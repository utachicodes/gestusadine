import { action, internalMutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";
import { api, internal } from "./_generated/api";
import {
  buildCouncilSystemPrompt,
  isGreeting,
  greetingReply,
  RAG_HEADER,
  RAG_FOOTER,
} from "./prompts";
import { validateCouncilOutput } from "./outputFilter";

const FANAR_BASE = "https://api.fanar.qa/v1";
const FANAR_MODEL = "Fanar";

async function fanarFetch(
  path: string,
  apiKey: string,
  body: any
): Promise<any> {
  const res = await fetch(`${FANAR_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    // Full provider detail goes to Convex server logs only — never the client.
    console.error("[fanar] request failed", { status: res.status, detail: err.slice(0, 500) });
    if (res.status === 429) {
      throw new ConvexError("The assistant is busy right now. Please wait a moment and try again.");
    }
    // Auth / server errors are infrastructure problems — keep the cause opaque.
    throw new ConvexError("The assistant is temporarily unavailable. Please try again later.");
  }
  return res.json();
}

export const generate = action({
  args: {
    // The client supplies ONLY the conversation + display preferences. The
    // system prompt, methodology, guardrails, model and sampling are all set
    // server-side and cannot be overridden by the caller.
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
    // Whitelisted literals only — prevents prompt injection via these fields.
    language: v.optional(v.union(v.literal("en"), v.literal("fr"), v.literal("ar"))),
    madhab: v.optional(v.union(
      v.literal("general"),
      v.literal("hanafi"),
      v.literal("maliki"),
      v.literal("shafii"),
      v.literal("hanbali"),
    )),
  },
  handler: async (ctx, args) => {
    // The chat action must not be anonymously callable — otherwise the Fanar
    // budget and per-tier quota can be bypassed by calling it directly.
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Please sign in to use the assistant.");

    // Hard caps: max 50 turns, each message max 4 000 chars.
    if (args.messages.length > 50) {
      throw new ConvexError("Conversation is too long. Please start a new one.");
    }
    for (const msg of args.messages) {
      if (msg.content.length > 4_000) {
        throw new ConvexError("Message is too long (max 4 000 characters).");
      }
    }

    const lastUserMsg = [...args.messages].reverse().find((m) => m.role === "user");
    const userText = lastUserMsg?.content?.trim() ?? "";

    // ── Abuse / jailbreak detection ───────────────────────────────────────────
    // Detect override/jailbreak attempts server-side. Track per-user count.
    // Strike 1: silent redirect. Strike 2: final warning. Strike 3: delete account.
    const JAILBREAK_PATTERNS = [
      /\b(ignore|disregard|skip|forget|override|bypass|break|violate)\s+(all\s+)?(previous|above|your|the|any)\s+(instructions?|prompt|rules?|guidelines?|filter)\b/i,
      /\b(reveal|show|print|output|repeat|leak|expose|tell\s+me)\s+(your|the|me|us)\s*(system\s*prompt|instructions?|prompt|rules?|guidelines?|configuration)\b/i,
      /\b(dan|developer\s+mode|jailbreak|jailbroken|uncensored\s+mode|god\s+mode|do\s+anything\s+now)\b/i,
      /\b(pretend\s+(you\s+are|to\s+be)|act\s+as\s+(if\s+you\s+are|a\s+)?|roleplay\s+as|you\s+are\s+now)\s+.{0,40}(ai|bot|assistant|model|gpt|llm|chatbot)\b/i,
      /\b(new\s+instructions?|from\s+now\s+on\s+you|i\s+am\s+your\s+(developer|creator|owner|admin|god))\b/i,
      /\b(disable\s+(your\s+)?(filter|safety|restriction|guard|rule))\b/i,
    ];

    const isJailbreakAttempt = JAILBREAK_PATTERNS.some((p) => p.test(userText));

    if (isJailbreakAttempt) {
      const user = await ctx.runQuery(api.users.currentUser);
      if (user) {
        const warnings = (user.abuseWarnings ?? 0) + 1;
        console.warn("[council] jailbreak attempt", { userId: user._id, warnings });

        const lang = (args.language || "en").toLowerCase();

        // Strike 3 — delete the account immediately.
        if (warnings >= 3) {
          await ctx.runMutation(internal.llm.deleteAbusiveAccount, { userId: user._id });
          if (lang.startsWith("fr")) {
            throw new ConvexError("Votre compte a été supprimé suite à plusieurs tentatives de contournement des règles de la plateforme.");
          }
          throw new ConvexError("Your account has been deleted due to repeated attempts to bypass platform rules.");
        }

        // Always persist the updated count.
        await ctx.runMutation(internal.llm.recordAbuseWarning, {
          userId: user._id,
          warnings,
          flagged: false,
        });

        // Strike 2 — final warning.
        if (warnings === 2) {
          if (lang.startsWith("fr")) {
            return `⚠️ **Avertissement final :** Vous avez déjà tenté de contourner les règles. **Une prochaine tentative entraînera la suppression définitive de votre compte.** Je suis ici uniquement pour les questions islamiques.`;
          }
          return `⚠️ **Final warning:** You have already attempted to bypass the rules. **One more attempt will permanently delete your account.** I'm here for Islamic questions only.`;
        }

        // Strike 1 — silent redirect.
        return lang.startsWith("fr")
          ? "Je suis ici uniquement pour les questions islamiques. Comment puis-je vous aider avec votre deen ?"
          : "I'm here for Islamic questions only. How can I help you with your deen?";
      }
      // Unauthenticated — silent redirect.
      const lang = (args.language || "en").toLowerCase();
      return lang.startsWith("fr")
        ? "Je suis ici uniquement pour les questions islamiques."
        : "I'm here for Islamic questions only.";
    }

    // Pure greetings/pleasantries get a quick reply — no model call, and NOT
    // charged against the monthly quota.
    if (isGreeting(userText)) {
      return greetingReply(args.language);
    }

    // Enforce the per-tier quota on the SERVER, before doing any work. This
    // closes the client-side counting bypass and the race window.
    await ctx.runQuery(internal.subscription.checkCouncilQuota);

    const apiKey = process.env.FANAR_API_KEY;
    if (!apiKey) {
      console.error("[fanar] FANAR_API_KEY not configured");
      throw new ConvexError("The assistant is temporarily unavailable. Please try again later.");
    }

    // RAG retrieval (best-effort). Retrieved text is framed as untrusted data.
    let ragContext = "";
    if (userText) {
      try {
        const results = (await ctx.runAction(api.rag.search, {
          query: userText,
          topK: 8,
        })) as any[];
        if (results.length > 0) {
          ragContext =
            RAG_HEADER +
            results
              .map((r, i) => `[${i + 1}] ${r.category ? `(${r.category}) ` : ""}${r.content}`)
              .join("\n\n") +
            RAG_FOOTER;
        }
      } catch {
        // RAG search failed — proceed without context.
      }
    }

    const systemPrompt =
      buildCouncilSystemPrompt({ language: args.language, madhab: args.madhab }) + ragContext;

    const data = await fanarFetch("/chat/completions", apiKey, {
      model: FANAR_MODEL,
      messages: [{ role: "system", content: systemPrompt }, ...args.messages],
      temperature: 0.3,
      max_tokens: 800,
    });

    const content = data.choices?.[0]?.message?.content;
    if (!content || content.trim().length === 0) {
      throw new ConvexError("The assistant couldn't generate a response. Please try rephrasing your question.");
    }

    // Server-side output filter — runs before the response reaches any client.
    // If any safety check fails, return a safe fallback instead of the raw output.
    const filterResult = validateCouncilOutput(content);
    if (!filterResult.safe) {
      console.warn("[council] output filtered", { category: filterResult.category });
      // Filtered responses are NOT charged against the quota.
      return filterResult.fallback ?? "I wasn't able to generate a proper response. Please try again.";
    }

    // Only a successful, safe answer is charged against the quota.
    await ctx.runMutation(internal.subscription.incrementCouncilUsage);
    return content;
  },
});

export const testModel = action({
  args: {
    model: v.string(),
    temperature: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Admin-only diagnostic — gate it so it can't be used to probe models or
    // burn the Fanar budget anonymously.
    const me = await ctx.runQuery(api.users.currentUser);
    if (!me || (me.role !== "admin" && me.role !== "system")) {
      throw new ConvexError("Not authorized.");
    }

    const apiKey = process.env.FANAR_API_KEY;
    if (!apiKey) {
      console.error("[fanar] FANAR_API_KEY not configured");
      throw new ConvexError("The assistant is temporarily unavailable. Please try again later.");
    }

    const startTime = Date.now();
    const data = await fanarFetch("/chat/completions", apiKey, {
      model: args.model,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: 'Say only: "Hello, I am working correctly."',
        },
      ],
      temperature: args.temperature ?? 0.7,
      max_tokens: 50,
    });

    return {
      success: true,
      response: data.choices[0]?.message?.content ?? "",
      duration: Date.now() - startTime,
    };
  },
});

// Internal — increments the abuse warning counter on the user record.
export const recordAbuseWarning = internalMutation({
  args: {
    userId:   v.id("users"),
    warnings: v.number(),
    flagged:  v.boolean(),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, unknown> = {
      abuseWarnings: args.warnings,
      abuseLastAt:   Date.now(),
    };
    if (args.flagged) patch.abuseFlagged = true;
    await ctx.db.patch(args.userId as Id<"users">, patch);
  },
});

// Internal — permanently deletes a user account and all their associated data
// after the 3rd jailbreak strike.
export const deleteAbusiveAccount = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const id = args.userId as Id<"users">;
    console.warn("[council] deleting abusive account", { userId: id });

    // Delete all user-owned records across every table.
    const tables = [
      "journalEntries",
      "periodLogs",
      "periodCycles",
      "periodSettings",
      "sawmQadaa",
      "quizAttempts",
      "subscriptionUsage",
      "userActivity",
    ] as const;

    for (const table of tables) {
      const rows = await ctx.db
        .query(table)
        .withIndex("userId", (q) => q.eq("userId", id))
        .collect();
      for (const row of rows) {
        await ctx.db.delete(row._id);
      }
    }

    // Finally delete the user record itself.
    await ctx.db.delete(id);
  },
});
