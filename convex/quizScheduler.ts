import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const FANAR_BASE = "https://api.fanar.qa/v1";

const CATEGORIES = [
  "Quran",
  "Hadith",
  "Fiqh",
  "Seerah",
  "Islamic History",
  "Aqeedah",
  "Arabic",
  "Prophets",
];

const SYSTEM_PROMPT = `You are an Islamic knowledge quiz generator. Generate ONE quiz question for Muslims.
Return ONLY a valid JSON object with NO markdown, NO code fences, NO extra text — just the raw JSON.
The JSON must have exactly these fields:
{
  "question": "string — the quiz question",
  "options": ["string", "string", "string", "string"],
  "correctIndex": number (0-3),
  "explanation": "string — brief explanation referencing Quran or authentic Hadith if applicable",
  "category": "string",
  "difficulty": "easy" | "medium" | "hard"
}
Rules:
- Questions must be factually correct and based on authentic Islamic sources
- Explanations must be concise (1-2 sentences max)
- Options must be plausible; only one is correct
- Avoid controversial theological disputes between madhabs`;

export const generateDailyQuiz = internalAction({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.FANAR_API_KEY;
    if (!apiKey) {
      console.error("[quizScheduler] FANAR_API_KEY not set");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    const existing = await ctx.runQuery(internal.quizScheduler.getTodayQuiz, { date: todayMs });
    if (existing) {
      console.log("[quizScheduler] Quiz already exists for today, skipping.");
      return;
    }

    const category = CATEGORIES[todayMs % CATEGORIES.length];
    const userPrompt = `Generate a ${["easy", "medium", "hard"][todayMs % 3]} difficulty Islamic quiz question about: ${category}. Today's date: ${today.toDateString()}.`;

    let raw = "";
    try {
      const res = await fetch(`${FANAR_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "Fanar",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 400,
        }),
      });

      if (!res.ok) {
        console.error("[quizScheduler] Fanar API error:", res.status, await res.text());
        return;
      }

      const data = await res.json() as any;
      raw = data?.choices?.[0]?.message?.content ?? "";
    } catch (err) {
      console.error("[quizScheduler] Fetch error:", err);
      return;
    }

    // Strip markdown code fences if Fanar wraps the JSON
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    let parsed: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
      category: string;
      difficulty: "easy" | "medium" | "hard";
    };

    try {
      parsed = JSON.parse(jsonStr);
    } catch (err) {
      console.error("[quizScheduler] Failed to parse Fanar response:", jsonStr);
      return;
    }

    const { question, options, correctIndex, explanation, difficulty } = parsed;
    if (
      !question ||
      !Array.isArray(options) ||
      options.length !== 4 ||
      typeof correctIndex !== "number" ||
      correctIndex < 0 ||
      correctIndex > 3 ||
      !["easy", "medium", "hard"].includes(difficulty)
    ) {
      console.error("[quizScheduler] Invalid quiz shape:", parsed);
      return;
    }

    await ctx.runMutation(internal.quizScheduler.insertQuiz, {
      date: todayMs,
      question,
      options,
      correctIndex,
      explanation: explanation ?? "",
      difficulty,
      category: parsed.category ?? category,
    });

    console.log("[quizScheduler] Daily quiz created:", question.slice(0, 60));
  },
});

export const getTodayQuiz = internalQuery({
  args: { date: v.number() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("dailyQuizzes")
      .withIndex("date", (q) => q.eq("date", args.date))
      .first();
  },
});

export const insertQuiz = internalMutation({
  args: {
    date: v.number(),
    question: v.string(),
    options: v.array(v.string()),
    correctIndex: v.number(),
    explanation: v.string(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the system user (admin) to attribute the quiz to
    const admin = await ctx.db.query("users").filter((q) => q.eq(q.field("role"), "admin")).first();
    if (!admin) {
      console.error("[quizScheduler] No admin user found to attribute quiz");
      return;
    }
    return ctx.db.insert("dailyQuizzes", {
      ...args,
      createdBy: admin._id,
      createdAt: Date.now(),
    });
  },
});

