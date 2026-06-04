import { action } from "./_generated/server";
import { v } from "convex/values";

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

    const data = await fanarFetch("/chat/completions", apiKey, {
      model: args.model,
      messages: [
        { role: "system", content: args.systemPrompt },
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
