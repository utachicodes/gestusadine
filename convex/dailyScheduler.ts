import { internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const FANAR_BASE = "https://api.fanar.qa/v1";

const SYSTEM_PROMPT = `You are an Islamic content generator. Generate daily spiritual content for Muslims.
Return ONLY a valid JSON object with NO markdown, NO code fences — just raw JSON.
Use this exact structure:
{
  "ayah": {
    "arabic": "the Arabic text of the verse",
    "translation": "English translation",
    "reference": "Surah Name chapter:verse"
  },
  "hadith": {
    "arabic": "the Arabic text of the hadith",
    "translation": "English translation",
    "source": "Collection name, hadith number"
  },
  "dua": {
    "arabic": "Arabic text of the dua",
    "translation": "English translation"
  },
  "fact": "One interesting Islamic historical or knowledge fact (1-2 sentences)",
  "action": "One specific, practical spiritual action the reader can do today (1-2 sentences)"
}
Rules:
- Use only authentic Quran verses and Sahih (authenticated) hadiths
- Hadiths must be from Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, or Ibn Majah
- The daily action must be specific and doable (not vague like 'be kind')
- Keep Arabic text accurate with proper diacritics where possible
- The fact must be verifiable and educational`;

async function callFanar(apiKey: string, userPrompt: string): Promise<string> {
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
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  if (!res.ok) {
    throw new Error(`Fanar API ${res.status}: ${await res.text()}`);
  }

  const data = await res.json() as any;
  return data?.choices?.[0]?.message?.content ?? "";
}

export const generateDailyContent = internalAction({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.FANAR_API_KEY;
    if (!apiKey) {
      console.error("[dailyScheduler] FANAR_API_KEY not set");
      return;
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    // Check if content already generated for today
    const existing = await ctx.runQuery(internal.dailyScheduler.hasTodayContent, { date: todayMs });
    if (existing) {
      console.log("[dailyScheduler] Content already exists for today, skipping.");
      return;
    }

    const admin = await ctx.runQuery(internal.dailyScheduler.getAdmin);
    if (!admin) {
      console.error("[dailyScheduler] No admin user found");
      return;
    }

    const prompt = `Generate fresh Islamic daily content for ${today.toDateString()}. Make it varied and meaningful — choose a different verse, hadith, and dua than the most common ones.`;

    let raw = "";
    try {
      raw = await callFanar(apiKey, prompt);
    } catch (err) {
      console.error("[dailyScheduler] Fanar fetch error:", err);
      return;
    }

    const jsonStr = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    let parsed: {
      ayah: { arabic: string; translation: string; reference: string };
      hadith: { arabic: string; translation: string; source: string };
      dua: { arabic: string; translation: string };
      fact: string;
      action: string;
    };

    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("[dailyScheduler] Failed to parse response:", jsonStr.slice(0, 200));
      return;
    }

    const { ayah, hadith, dua, fact, action } = parsed;
    if (!ayah?.arabic || !hadith?.arabic || !dua?.arabic || !fact || !action) {
      console.error("[dailyScheduler] Incomplete response shape");
      return;
    }

    await ctx.runMutation(internal.daily.insertDailyContent, {
      items: [
        { contentType: "ayah",   content: ayah.arabic,   source: ayah.reference,  translation: ayah.translation,   date: todayMs, adminId: admin._id },
        { contentType: "hadith", content: hadith.arabic, source: hadith.source,   translation: hadith.translation, date: todayMs, adminId: admin._id },
        { contentType: "dua",    content: dua.arabic,    source: "",              translation: dua.translation,    date: todayMs, adminId: admin._id },
        { contentType: "fact",   content: fact,          source: "",              date: todayMs, adminId: admin._id },
        { contentType: "action", content: action,        source: "",              date: todayMs, adminId: admin._id },
      ],
    });

    console.log("[dailyScheduler] Daily content generated for", today.toDateString());
  },
});

export const hasTodayContent = internalQuery({
  args: { date: v.number() },
  handler: async (ctx, { date }) => {
    const oneDay = 1000 * 60 * 60 * 24;
    const entry = await ctx.db
      .query("dailyContent")
      .withIndex("date", (q) => q.gte("date", date).lt("date", date + oneDay))
      .first();
    return entry !== null;
  },
});

export const getAdmin = internalQuery({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("users").filter((q) => q.eq(q.field("role"), "admin")).first();
  },
});
