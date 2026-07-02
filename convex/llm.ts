import { action, internalMutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";
import { api, internal } from "./_generated/api";
import { buildCouncilSystemPrompt, RAG_HEADER, RAG_FOOTER } from "./prompts";
import { validateCouncilOutput } from "./outputFilter";
import { classifyIntent } from "./intentClassifier";
import { dispatchTool } from "./tools";

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
    console.error("[fanar] request failed", { status: res.status, detail: err.slice(0, 500) });
    if (res.status === 429) {
      throw new ConvexError("The assistant is busy right now. Please wait a moment and try again.");
    }
    throw new ConvexError("The assistant is temporarily unavailable. Please try again later.");
  }
  return res.json();
}

/**
 * Normalize RAG results into citation-tagged references.
 * Each source gets a [CITE:N] tag so the LLM can reference them precisely.
 */
function normalizeCitations(
  results: any[],
): { context: string; citations: string } {
  if (results.length === 0) return { context: "", citations: "" };

  const contextLines = results.map(
    (r, i) => `[CITE:${i + 1}] ${r.category ? `(${r.category}) ` : ""}${r.content}`
  );
  const citationList = results
    .map((r, i) => `[CITE:${i + 1}] ${r.source ?? r.category ?? "Islamic source"}`)
    .join("\n");

  return {
    context:
      RAG_HEADER + contextLines.join("\n\n") + RAG_FOOTER,
    citations: citationList,
  };
}

/**
 * Search the duas database for a matching dua.
 */
async function searchDua(
  ctx: any,
  query: string,
): Promise<string | null> {
  try {
    const results = await ctx.runQuery(api.duas.searchDuas, { query });
    if (!results || results.length === 0) return null;

    const dua = results[0];
    const lang = "en";
    let response = `**${dua.title[lang] ?? dua.title.en}**\n\n`;
    response += `**Arabic:** ${dua.arabicText}\n\n`;
    if (dua.transliteration) {
      response += `**Transliteration:** ${dua.transliteration}\n\n`;
    }
    response += `**Translation:** ${dua.translation[lang] ?? dua.translation.en}\n\n`;
    if (dua.source) {
      response += `*Source: ${dua.source}*`;
    }
    return response;
  } catch {
    return null;
  }
}

export const generate = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
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
    // ── Auth check ────────────────────────────────────────────────────────────
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Please sign in to use the assistant.");

    // ── Input validation ──────────────────────────────────────────────────────
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

    // ── Jailbreak detection ───────────────────────────────────────────────────
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

        if (warnings >= 3) {
          await ctx.runMutation(internal.llm.deleteAbusiveAccount, { userId: user._id });
          if (lang.startsWith("fr")) {
            throw new ConvexError("Votre compte a été supprimé suite à plusieurs tentatives de contournement des règles de la plateforme.");
          }
          throw new ConvexError("Your account has been deleted due to repeated attempts to bypass platform rules.");
        }

        await ctx.runMutation(internal.llm.recordAbuseWarning, {
          userId: user._id,
          warnings,
          flagged: false,
        });

        if (warnings === 2) {
          if (lang.startsWith("fr")) {
            return `⚠️ **Avertissement final :** Vous avez déjà tenté de contourner les règles. **Une prochaine tentative entraînera la suppression définitive de votre compte.** Je suis ici uniquement pour les questions islamiques.`;
          }
          return `⚠️ **Final warning:** You have already attempted to bypass the rules. **One more attempt will permanently delete your account.** I'm here for Islamic questions only.`;
        }

        return lang.startsWith("fr")
          ? "Je suis ici uniquement pour les questions islamiques. Comment puis-je vous aider avec votre deen ?"
          : "I'm here for Islamic questions only. How can I help you with your deen?";
      }
      const lang = (args.language || "en").toLowerCase();
      return lang.startsWith("fr")
        ? "Je suis ici uniquement pour les questions islamiques."
        : "I'm here for Islamic questions only.";
    }

    // ── Intent classification (hybrid: LLM primary + embedding fallback) ──────
    const apiKey = process.env.FANAR_API_KEY;
    const classification = await classifyIntent(userText, apiKey);
    const toolResponse = dispatchTool(
      classification.intent,
      args.language,
      args.madhab,
      classification.confidence,
    );

    console.log("[council] intent classified", {
      intent: classification.intent,
      confidence: classification.confidence,
      tier: classification.tier,
      requiresRetrieval: classification.requiresRetrieval,
    });

    // ── Direct tool responses (no LLM call needed, no quota charged) ─────────
    if (toolResponse.kind === "direct") {
      return toolResponse.content;
    }

    // ── Dua lookup — try database first before LLM ───────────────────────────
    if (classification.intent === "dua_lookup") {
      const duaResult = await searchDua(ctx, userText);
      if (duaResult) return duaResult;
      // Fall through to LLM with RAG if no dua found in database
    }

    // ── Quota enforcement ─────────────────────────────────────────────────────
    await ctx.runQuery(internal.subscription.checkCouncilQuota);

    if (!apiKey) {
      console.error("[fanar] FANAR_API_KEY not configured");
      throw new ConvexError("The assistant is temporarily unavailable. Please try again later.");
    }

    // ── RAG retrieval (for intents that need it) ─────────────────────────────
    let ragContext = "";
    let citationBlock = "";

    if (classification.requiresRetrieval && userText) {
      try {
        const results = (await ctx.runAction(api.rag.search, {
          query: userText,
          topK: 8,
        })) as any[];

        const normalized = normalizeCitations(results);
        ragContext = normalized.context;
        citationBlock = normalized.citations;
      } catch {
        // RAG search failed — proceed without context.
      }
    }

    // ── Build system prompt ───────────────────────────────────────────────────
    const systemPrompt = toolResponse.systemPrompt + ragContext;

    // ── Call Fanar LLM ────────────────────────────────────────────────────────
    const data = await fanarFetch("/chat/completions", apiKey, {
      model: FANAR_MODEL,
      messages: [{ role: "system", content: systemPrompt }, ...args.messages],
      temperature: 0.3,
      max_tokens: 1200,
    });

    const content = data.choices?.[0]?.message?.content;
    if (!content || content.trim().length === 0) {
      throw new ConvexError("The assistant couldn't generate a response. Please try rephrasing your question.");
    }

    // ── Output filter ─────────────────────────────────────────────────────────
    const filterResult = validateCouncilOutput(content);
    if (!filterResult.safe) {
      console.warn("[council] output filtered", { category: filterResult.category });
      return filterResult.fallback ?? "I wasn't able to generate a proper response. Please try again.";
    }

    // ── Post-generation grounding check (Fanar-Sadiq §3.4–3.5) ──────────────
    // For fiqh rulings and general Islamic knowledge, the response must contain
    // at least one citation tag. A response without citations for these intents
    // likely means the model fabricated a ruling — return a safe fallback.
    const GROUNDED_INTENTS = new Set(["fiqh_ruling", "general_islamic", "quran_retrieval"]);
    if (
      GROUNDED_INTENTS.has(classification.intent) &&
      classification.requiresRetrieval &&
      !/\[CITE:\d+\]/.test(content)
    ) {
      console.warn("[council] ungrounded response for grounded intent", {
        intent: classification.intent,
        confidence: classification.confidence,
      });

      const lang = (args.language || "en").toLowerCase();
      if (lang.startsWith("fr")) {
        return "Je ne suis pas certain de la réponse à cette question. Veuillez consulter un savant qualifié ou un imam de confiance pour obtenir une réponse fiable avec les références appropriées.";
      }
      if (lang.startsWith("ar")) {
        return "لست متأكداً من الإجابة على هذا السؤال. يرجى الاستشارة عند عالم مؤهل أو إمام موثوق للحصول على إجابة موثوقة مع المراجع المناسبة.";
      }
      return "I'm not confident enough in my answer to this question. Please consult a qualified scholar or trusted imam for a reliable response with proper references.";
    }

    // ── Append citations if present ───────────────────────────────────────────
    let finalResponse = content;
    if (citationBlock) {
      finalResponse += `\n\n---\n**Sources:**\n${citationBlock}`;
    }

    // ── Charge quota ──────────────────────────────────────────────────────────
    await ctx.runMutation(internal.subscription.incrementCouncilUsage);
    return finalResponse;
  },
});

export const testModel = action({
  args: {
    model: v.string(),
    temperature: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
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

export const deleteAbusiveAccount = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const id = args.userId as Id<"users">;

    const tables = [
      "journalEntries",
      "periodLogs",
      "periodCycles",
      "periodSettings",
      "sawmQadaa",
      "quizAttempts",
      "subscriptionUsage",
      "userActivity",
      "conversations",
      "messages",
      "prayerLogs",
      "quranProgress",
      "userThemes",
      "circleMembers",
      "circlePosts",
      "userPoints",
      "pushSubscriptions",
      "notificationSettings",
      "mediaProgress",
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

    await ctx.db.delete(id);
  },
});
