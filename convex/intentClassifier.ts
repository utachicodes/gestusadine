/**
 * Hybrid query classifier for the GëstuSaDine Council.
 *
 * Based on Fanar-Sadiq's hybrid query classifier (Abbas et al., 2026).
 * Two-tier architecture:
 *   Tier 1 — LLM-based primary classifier (structured JSON output)
 *   Tier 2 — Embedding-based fallback (cosine similarity with prototypes)
 *
 * A keyword fast-path handles obvious greetings instantly (no model call).
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type IntentType =
  | "fiqh_ruling"
  | "quran_retrieval"
  | "general_islamic"
  | "greeting"
  | "dua_lookup"
  | "prayer_times"
  | "islamic_calendar"
  | "zakat_calculation"
  | "inheritance_calculation";

export interface ClassificationResult {
  intent: IntentType;
  confidence: number;
  language: string;
  rationale: string;
  subquestions: string[];
  requiresRetrieval: boolean;
  /** Which tier produced this result. */
  tier: "keyword" | "llm" | "embedding";
}

export const INTENT_LABELS: IntentType[] = [
  "fiqh_ruling",
  "quran_retrieval",
  "general_islamic",
  "greeting",
  "zakat_calculation",
  "inheritance_calculation",
  "dua_lookup",
  "islamic_calendar",
  "prayer_times",
];

const INTENT_LABEL_SET = new Set<string>(INTENT_LABELS);

// ── Tier 0: Keyword fast-path ─────────────────────────────────────────────────
// Instant exit for greetings and other trivially identifiable queries.
// No model call, zero latency.

const GREETING_PATTERNS: RegExp[] = [
  /^(as-?sala?a?mu?\s*'?\s*ala[iy]k?um(\s*wa\s*rah?matullahi?(\s*wa\s*barakatuh)?)?)[\s.!]*$/i,
  /^(wa\s*)?(ala[iy]k?um\s*(as-?)?salam)[\s.!]*$/i,
  /^(salam|salaam|salams|asalam)[\s.!]*$/i,
  /^(hi|hey|hello|yo|hiya|greetings)[\s.!]*$/i,
  /^(bonjour|bonsoir|salut|coucou)[\s.!]*$/i,
  /^(thanks|thank you|thx|shukran|jazak\s*allahu?(\s*khair(an)?)?|jazakallah|barak\s*allahu?( fik)?)[\s.!]*$/i,
  /^(ok|okay|d'accord|merci(\s*beaucoup)?|cool|great|nice|perfect)[\s.!]*$/i,
  /^(how are you( doing)?|comment\s*(ça|ca)\s*va|(ça|ca)\s*va)\??[\s.!]*$/i,
];

function keywordFastPath(query: string): ClassificationResult | null {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      intent: "general_islamic",
      confidence: 0.5,
      language: "en",
      rationale: "Empty query",
      subquestions: [],
      requiresRetrieval: true,
      tier: "keyword",
    };
  }

  // Greetings — quick exit, no model call
  for (const pattern of GREETING_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        intent: "greeting",
        confidence: 0.98,
        language: detectLanguage(trimmed),
        rationale: "Matched greeting pattern",
        subquestions: [],
        requiresRetrieval: false,
        tier: "keyword",
      };
    }
  }

  return null;
}

// ── Language detection ─────────────────────────────────────────────────────────

function detectLanguage(text: string): string {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const totalChars = text.replace(/\s/g, "").length;
  if (totalChars === 0) return "en";
  return arabicChars / totalChars > 0.3 ? "ar" : "en";
}

// ── Tier 1: LLM primary classifier ───────────────────────────────────────────
// Prompts Fanar to output structured JSON with intent, confidence, rationale,
// subquestions, and retrieval flag. Temperature 0 for determinism.

const CLASSIFIER_PROMPT = `You are an expert **Islamic question classifier**.
Analyze the user's question and classify it into **ONE** of these categories:

1. **fiqh_ruling**: Questions asking for Islamic legal rulings, permissibility, obligations, or jurisprudence
   Examples: "Is X halal?", "What's the ruling on Y?"

2. **quran_retrieval**: Questions asking for specific Quranic verses or ayahs
   Examples: "What does verse 2:255 say?", "Find ayah about patience"

3. **general_islamic**: General questions about Islamic knowledge, history, concepts, or practices
   Use this when the question does NOT request a ruling/calculation/timing/retrieval explicitly.
   Examples: "Who was Umar ibn al-Khattab?", "What is tawakkul?"

4. **greeting**: Simple greetings, thanks, or pleasantries
   Examples: "Hi", "Thanks!"

5. **zakat_calculation**: Requests to compute Zakat owed based on assets, debts, or metal prices
   Examples: "How much zakat do I pay on $10,000?"

6. **inheritance_calculation**: Requests to divide an estate among heirs (Mirath/Faraid)
   Examples: "Split inheritance among wife and children"

7. **dua_lookup**: Requests for duas (supplications) or adhkar (remembrances), or what to say in specific situations
   Examples: "dua for entering bathroom", "morning adhkar"

8. **islamic_calendar**: Questions about Hijri/Islamic dates, date conversions, or Islamic events/holidays
   Examples: "What is today's Hijri date?", "When is Ramadan 2025?"

9. **prayer_times**: Questions about prayer times, salah timing, or Qibla direction for a location
   Examples: "What time is Fajr in Dubai?", "Which direction is Qibla from Tokyo?"

Return ONLY valid JSON in this format (no markdown, no explanation):
{
  "question_type": "<intent_label>",
  "language": "en" or "ar",
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of classification",
  "subquestions": ["optional decomposition subquestions"],
  "requires_retrieval": true or false
}`;

function buildClassifierUserPrompt(question: string): string {
  return `Classify the question below:\n\nQuestion: ${question}`;
}

interface LLMClassificationRaw {
  question_type?: string;
  language?: string;
  confidence?: number;
  reasoning?: string;
  subquestions?: string[];
  requires_retrieval?: boolean;
}

async function llmClassify(
  query: string,
  apiKey: string,
): Promise<ClassificationResult> {
  const res = await fetch("https://api.fanar.qa/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "Fanar",
      messages: [
        { role: "system", content: CLASSIFIER_PROMPT },
        { role: "user", content: buildClassifierUserPrompt(query) },
      ],
      temperature: 0,
      max_tokens: 300,
    }),
  });

  if (!res.ok) {
    throw new Error(`Fanar classifier request failed: ${res.status}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty classifier response");

  // Parse JSON — handle markdown code blocks and trailing artifacts
  let parsed: LLMClassificationRaw;
  try {
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .replace(/<end_of_turn>|<\/s>|<\|im_end\|>/g, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Malformed JSON from classifier: ${raw.slice(0, 200)}`);
  }

  const intent = parsed.question_type;
  if (!intent || !INTENT_LABEL_SET.has(intent)) {
    throw new Error(`Invalid intent label: ${intent}`);
  }

  return {
    intent: intent as IntentType,
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5,
    language: parsed.language || detectLanguage(query),
    rationale: parsed.reasoning || "",
    subquestions: Array.isArray(parsed.subquestions) ? parsed.subquestions : [],
    requiresRetrieval: typeof parsed.requires_retrieval === "boolean"
      ? parsed.requires_retrieval
      : intent !== "greeting",
    tier: "llm",
  };
}

// ── Tier 2: Embedding-based fallback ──────────────────────────────────────────
// When the LLM classifier fails (low confidence, malformed JSON, exception),
// compute cosine similarity between the query and pre-computed prototype
// embeddings for each intent-language pair.
//
// Prototypes are computed offline from representative examples per intent.
// In production these would be loaded from a vector store; here we use
// a lightweight online computation with a compact prototype bank.

interface PrototypeEntry {
  intent: IntentType;
  language: string;
  text: string;
  embedding?: number[];
}

/** Representative prototypes per intent-language pair. */
const PROTOTYPES: PrototypeEntry[] = [
  // Fiqh rulings
  { intent: "fiqh_ruling", language: "en", text: "Is it halal or haram to do this?" },
  { intent: "fiqh_ruling", language: "en", text: "What is the Islamic ruling on music?" },
  { intent: "fiqh_ruling", language: "en", text: "Can I do this according to Islamic law?" },
  { intent: "fiqh_ruling", language: "en", text: "Is this permissible in Islam?" },
  { intent: "fiqh_ruling", language: "en", text: "Ruling on wearing gold for men in Islam" },
  { intent: "fiqh_ruling", language: "en", text: "What do scholars say about this?" },
  { intent: "fiqh_ruling", language: "ar", text: "ما حكم هذا الأمر في الإسلام؟" },
  { intent: "fiqh_ruling", language: "ar", text: "هل يجوز ذلك شرعاً؟" },

  // Quran retrieval
  { intent: "quran_retrieval", language: "en", text: "What does verse 2:255 say?" },
  { intent: "quran_retrieval", language: "en", text: "Quote Surah Al-Baqarah verse 275" },
  { intent: "quran_retrieval", language: "en", text: "Show me ayah about patience in the Quran" },
  { intent: "quran_retrieval", language: "en", text: "Read Surah Al-Fatihah to me" },
  { intent: "quran_retrieval", language: "en", text: "How many verses in Surah Al-Baqarah?" },
  { intent: "quran_retrieval", language: "ar", text: "ماذا يقول آية الكرسي؟" },
  { intent: "quran_retrieval", language: "ar", text: "اقرأ سورة البقرة آية 255" },

  // General Islamic
  { intent: "general_islamic", language: "en", text: "Who was Umar ibn al-Khattab?" },
  { intent: "general_islamic", language: "en", text: "What are the five pillars of Islam?" },
  { intent: "general_islamic", language: "en", text: "What is tawakkul in Islam?" },
  { intent: "general_islamic", language: "en", text: "Tell me about the history of Islam" },
  { intent: "general_islamic", language: "en", text: "What is the meaning of Shahada?" },
  { intent: "general_islamic", language: "ar", text: "من هو عمر بن الخطاب؟" },
  { intent: "general_islamic", language: "ar", text: "ما هي أركان الإسلام الخمسة؟" },

  // Greetings
  { intent: "greeting", language: "en", text: "Assalamu alaikum" },
  { intent: "greeting", language: "en", text: "Hello, how are you?" },
  { intent: "greeting", language: "en", text: "Wa alaykum assalam wa rahmatullah" },
  { intent: "greeting", language: "ar", text: "السلام عليكم" },
  { intent: "greeting", language: "ar", text: "مرحبا" },

  // Zakat
  { intent: "zakat_calculation", language: "en", text: "How much zakat do I pay on $10,000?" },
  { intent: "zakat_calculation", language: "en", text: "Calculate zakat on my gold savings" },
  { intent: "zakat_calculation", language: "en", text: "Zakat rate for Bitcoin cryptocurrency" },
  { intent: "zakat_calculation", language: "en", text: "What is the nisab threshold for zakat?" },
  { intent: "zakat_calculation", language: "ar", text: "كم أدفع زكاة على 10000 دولار؟" },
  { intent: "zakat_calculation", language: "ar", text: "احسب زكاة على أموالي" },

  // Inheritance
  { intent: "inheritance_calculation", language: "en", text: "Split inheritance among wife and children" },
  { intent: "inheritance_calculation", language: "en", text: "What is the share of wife in inheritance?" },
  { intent: "inheritance_calculation", language: "en", text: "How to divide estate among heirs in Islam?" },
  { intent: "inheritance_calculation", language: "en", text: "Faraid calculation for deceased with daughters" },
  { intent: "inheritance_calculation", language: "en", text: "Share of mother when son dies in inheritance" },
  { intent: "inheritance_calculation", language: "ar", text: "قسم الميراث بين الزوجة والأبناء" },
  { intent: "inheritance_calculation", language: "ar", text: "ما نصيب الزوجة في الميراث؟" },

  // Dua
  { intent: "dua_lookup", language: "en", text: "What is the dua for entering the bathroom?" },
  { intent: "dua_lookup", language: "en", text: "Morning adhkar supplications" },
  { intent: "dua_lookup", language: "en", text: "What to say before sleeping in Islam?" },
  { intent: "dua_lookup", language: "en", text: "Dua for traveling in Islam" },
  { intent: "dua_lookup", language: "en", text: "Supplication for entering mosque" },
  { intent: "dua_lookup", language: "ar", text: "دعاء دخول الحمام" },
  { intent: "dua_lookup", language: "ar", text: "أذكار الصباح" },

  // Calendar
  { intent: "islamic_calendar", language: "en", text: "What is today's Hijri date?" },
  { intent: "islamic_calendar", language: "en", text: "When is Ramadan 2025?" },
  { intent: "islamic_calendar", language: "en", text: "Convert March 1 to Hijri date" },
  { intent: "islamic_calendar", language: "en", text: "When is Eid al-Fitr this year?" },
  { intent: "islamic_calendar", language: "en", text: "Date of Ashura this year" },
  { intent: "islamic_calendar", language: "ar", text: "ما هو التاريخ الهجري اليوم؟" },
  { intent: "islamic_calendar", language: "ar", text: "متى يبدأ رمضان 2025؟" },

  // Prayer times
  { intent: "prayer_times", language: "en", text: "What time is Fajr in Dubai?" },
  { intent: "prayer_times", language: "en", text: "Prayer times for London today" },
  { intent: "prayer_times", language: "en", text: "Which direction is Qibla from Tokyo?" },
  { intent: "prayer_times", language: "en", text: "When is Maghrib prayer today?" },
  { intent: "prayer_times", language: "en", text: "Salah times for New York City" },
  { intent: "prayer_times", language: "ar", text: "ما هو وقت الفجر في دبي؟" },
  { intent: "prayer_times", language: "ar", text: "في أي اتجاه القبلة من طوكيو؟" },
];

/**
 * Compute a simple bag-of-words TF vector for text.
 * Used as a lightweight alternative to neural embeddings when the
 * embedding model is not available.
 */
function textToVector(text: string): Map<string, number> {
  const vec = new Map<string, number>();
  const tokens = text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  for (const token of tokens) {
    vec.set(token, (vec.get(token) || 0) + 1);
  }
  return vec;
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const [key, val] of a) {
    normA += val * val;
    const bVal = b.get(key);
    if (bVal !== undefined) dot += val * bVal;
  }
  for (const val of b.values()) {
    normB += val * val;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/** Shared Arabic/Islamic keyword sets for boosting similarity. */
const ISLAMIC_KEYWORDS_EN = new Set([
  "islam", "muslim", "quran", "hadith", "sunnah", "prayer", "salah",
  "zakat", "zakah", "hajj", "fasting", "sawm", "fiqh", "fatwa",
  "halal", "haram", "dua", "adhkar", "allah", "prophet", "muhammad",
  "surah", "ayah", "verse", "hijri", "inheritance", "mirath", "faraid",
  "qibla", "fajr", "dhuhr", "asr", "maghrib", "isha", "ramadan",
  "eid", "mosque", "masjid", "imam", "scholar", "ruling", "permissible",
  "forbidden", "obligatory", "supplication", "remembrance", "calendar",
  "date", "prayer", "times", "calculate", "compute", "pay", "owe",
  "gold", "silver", "cash", "wealth", "estate", "heir", "wife", "husband",
  "son", "daughter", "father", "mother", "brother", "sister", "child",
]);

const ISLAMIC_KEYWORDS_AR = new Set([
  "islam", "uslim", "quran", "qur'an", "koran", "hadith", "sunnah",
  "salah", "salat", "zakat", "zakah", "hajj", "sawm", "siyam",
  "fiqh", "fatwa", "halal", "haram", "dua", "dhikr", "allah",
  "prophet", "muhammad", "rasul", "surah", "ayah", "verse", "hijri",
  "inheritance", "mirath", "faraid", "qibla", "fajr", "dhuhr", "asr",
  "maghrib", "isha", "ramadan", "eid", "mosque", "masjid", "imam",
  "scholar", "ruling", "prayer", "times", "calendar", "date",
]);

function addIslamicBoost(queryVec: Map<string, number>, lang: string): void {
  const keywords = lang === "ar" ? ISLAMIC_KEYWORDS_AR : ISLAMIC_KEYWORDS_EN;
  for (const keyword of keywords) {
    if (queryVec.has(keyword)) {
      // Boost Islamic keywords by 50%
      queryVec.set(keyword, queryVec.get(keyword)! * 1.5);
    }
  }
}

function embeddingFallback(query: string): ClassificationResult {
  const lang = detectLanguage(query);
  const queryVec = textToVector(query);
  addIslamicBoost(queryVec, lang);

  // Score each prototype
  const scores: Array<{ intent: IntentType; score: number }> = [];
  for (const proto of PROTOTYPES) {
    const protoVec = textToVector(proto.text);
    const sim = cosineSimilarity(queryVec, protoVec);
    scores.push({ intent: proto.intent, score: sim });
  }

  // Group by intent and average scores
  const intentScores = new Map<IntentType, number[]>();
  for (const { intent, score } of scores) {
    if (!intentScores.has(intent)) intentScores.set(intent, []);
    intentScores.get(intent)!.push(score);
  }

  const averaged: Array<{ intent: IntentType; avgScore: number }> = [];
  for (const [intent, scoresArr] of intentScores) {
    const avg = scoresArr.reduce((a, b) => a + b, 0) / scoresArr.length;
    averaged.push({ intent, avgScore: avg });
  }

  averaged.sort((a, b) => b.avgScore - a.avgScore);

  const top1 = averaged[0];
  const top2 = averaged[1];

  // Confidence = margin between top two, mapped to 0-1
  const margin = top2 ? top1.avgScore - top2.avgScore : top1.avgScore;
  const confidence = Math.min(1, Math.max(0, margin * 2 + 0.3));

  // Determine retrieval flag by intent
  const NO_RETRIEVAL: IntentType[] = [
    "greeting", "zakat_calculation", "inheritance_calculation",
    "prayer_times", "islamic_calendar",
  ];

  return {
    intent: top1.intent,
    confidence,
    language: lang,
    rationale: `Embedding fallback: top match "${top1.intent}" (score=${top1.avgScore.toFixed(3)})`,
    subquestions: [],
    requiresRetrieval: !NO_RETRIEVAL.includes(top1.intent),
    tier: "embedding",
  };
}

// ── Main classifier ───────────────────────────────────────────────────────────

const LLM_CONFIDENCE_THRESHOLD = 0.5;

/**
 * Classify a user query into an intent type.
 *
 * Uses a two-tier hybrid approach (Abbas et al., 2026):
 *   1. LLM primary classifier — prompts Fanar with structured JSON output
 *   2. Embedding fallback — cosine similarity with prototype embeddings
 *
 * A keyword fast-path handles greetings instantly (no model call).
 *
 * @param query - The user's query text
 * @param apiKey - Fanar API key (optional; if omitted, skips LLM tier)
 * @returns ClassificationResult with intent, confidence, and metadata
 */
export async function classifyIntent(
  query: string,
  apiKey?: string,
): Promise<ClassificationResult> {
  // Tier 0: Keyword fast-path (instant, no model call)
  const keywordResult = keywordFastPath(query);
  if (keywordResult) return keywordResult;

  // Tier 1: LLM primary classifier
  if (apiKey) {
    try {
      const llmResult = await llmClassify(query, apiKey);

      // If LLM confidence is high enough, use it
      if (llmResult.confidence >= LLM_CONFIDENCE_THRESHOLD) {
        return llmResult;
      }

      // Low confidence — fall through to embedding fallback,
      // but merge LLM rationale if available
      const embedResult = embeddingFallback(query);
      if (llmResult.rationale) {
        embedResult.rationale = `LLM: ${llmResult.rationale} | ${embedResult.rationale}`;
      }
      // Use the higher confidence between LLM and embedding
      embedResult.confidence = Math.max(embedResult.confidence, llmResult.confidence * 0.8);
      return embedResult;
    } catch (err) {
      // LLM failed — fall through to embedding fallback
      console.warn("[classifier] LLM tier failed, using embedding fallback", err);
    }
  }

  // Tier 2: Embedding-based fallback
  return embeddingFallback(query);
}

/**
 * Synchronous keyword-only classifier.
 * Use this when async is not possible (e.g., in synchronous contexts).
 * Only handles greetings and empty queries — everything else returns
 * a low-confidence default.
 */
export function classifyIntentSync(query: string): ClassificationResult {
  const keywordResult = keywordFastPath(query);
  if (keywordResult) return keywordResult;

  // Default: general Islamic knowledge, low confidence
  return {
    intent: "general_islamic",
    confidence: 0.5,
    language: detectLanguage(query),
    rationale: "Keyword-only classifier: no match, defaulting to general Islamic",
    subquestions: [],
    requiresRetrieval: true,
    tier: "keyword",
  };
}
