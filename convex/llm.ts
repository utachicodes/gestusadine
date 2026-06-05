import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const FANAR_BASE = "https://api.fanar.qa/v1";

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
    const err = await res.text();
    if (res.status === 429) {
      throw new Error("You've exceeded your Fanar API rate limit. Please wait a moment and try again.");
    }
    throw new Error(`Fanar error (${res.status}): ${err}`);
  }
  return res.json();
}

export const generate = action({
  args: {
    model: v.string(),
    systemPrompt: v.string(),
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
    temperature: v.optional(v.number()),
    maxTokens: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.FANAR_API_KEY;
    if (!apiKey) throw new Error("FANAR_API_KEY not configured");

    // Get the last user message for RAG search
    const lastUserMsg = [...args.messages].reverse().find(m => m.role === "user");
    let ragContext = "";

    if (lastUserMsg) {
      try {
        const results = await ctx.runAction(api.rag.search, {
          query: lastUserMsg.content,
          topK: 8,
        }) as any[];
        if (results.length > 0) {
          ragContext = "\n\nREFERENCE MATERIAL FROM ISLAMIC SOURCES:\n" +
            results.map((r, i) =>
              `[${i + 1}] ${r.category ? `(${r.category}) ` : ""}${r.content}`
            ).join("\n\n") +
            "\n\nUse the above reference material to support your answer where relevant. Cite sources using [1], [2], etc. You may also draw on your general Islamic knowledge for well-known facts (Quran surah names and order, well-known ayat, basic fiqh, seerah, etc.). Only say 'The available sources do not cover this question' if the question is obscure or speculative — not for basic Islamic knowledge.";
        }
      } catch {
        // RAG search failed — proceed without context
      }
    }

    const systemPrompt = ragContext
      ? args.systemPrompt + ragContext
      : args.systemPrompt;

    const data = await fanarFetch("/chat/completions", apiKey, {
      model: args.model,
      messages: [
        { role: "system", content: systemPrompt },
        ...args.messages,
      ],
      temperature: args.temperature ?? 0.7,
      max_tokens: args.maxTokens ?? 2000,
    });

    return data.choices[0]?.message?.content ?? "";
  },
});

export const testModel = action({
  args: {
    model: v.string(),
    temperature: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.FANAR_API_KEY;
    if (!apiKey) throw new Error("FANAR_API_KEY not configured");

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
