/**
 * Server-side output filter for the GëstuSaDine Council AI.
 *
 * Every generated response passes through this before it reaches any client.
 * If a check fails, the caller receives a safe fallback — the raw model output
 * is never returned. This runs in the Convex action, not in the browser, so it
 * cannot be bypassed by a client-side patch.
 *
 * Layers (in order of evaluation):
 *   1. Identity leak      — model revealing it is GPT / Claude / Fanar / etc.
 *   2. Harmful content    — violence, self-harm, weapon instructions
 *   3. Anti-ʿaqīdah       — content that contradicts Islamic monotheism
 *   4. Radicalization     — content that promotes violence in the name of religion
 *   5. Off-topic answer   — model answered a math/code question instead of redirecting
 *   6. Fabrication signal — model used hedging language that suggests it invented a hadith
 */

export interface FilterResult {
  safe: boolean;
  category?: string;
  fallback?: string;
}

// ── 1. Identity leak ──────────────────────────────────────────────────────────
const IDENTITY_LEAK: RegExp[] = [
  /\b(i'?m|i\s+am)\s+a[n]?\s+(gpt|gemma|llama|claude|bard|deepseek|mistral|fanar)\b/i,
  /\bpowered\s+by\s+(openai|anthropic|meta|google|mistral|fanar|together\s*ai|hugging\s*face)\b/i,
  /\b(openai|anthropic|meta\s*ai|qatar\s*computing)\s+(made|created|built|developed|trained)\s+me\b/i,
  /\bmy\s+(training\s+data|model\s+weights|fine-?tuning|base\s+model)\b/i,
  /\bas\s+an?\s+(ai\s+(language\s+)?model|large\s+language\s+model|llm)\b/i,
  /\bi\s+(was|am|have\s+been)\s+(trained|fine-?tuned)\s+(by|on|with)\b/i,
];

// ── 2. Harmful / dangerous content ───────────────────────────────────────────
const HARMFUL: RegExp[] = [
  /\bhow\s+to\s+(make|build|create|assemble|produce|synthesize)\s+(bomb|explosive|weapon|poison|drug|gun|firearm)\b/i,
  /\b(step[s\s]*[:-]|instructions?\s+(for|to))\s+.{0,40}(kill|murder|attack|blow\s+up)\b/i,
  /\bkill\s+(yourself|himself|herself|yourselves)\b/i,
  /\b(suicide\s+(method|how\s+to|way\s+to)|how\s+to\s+(commit\s+suicide|end\s+(your|my|his|her)\s+life))\b/i,
];

// ── 3. Anti-ʿaqīdah ───────────────────────────────────────────────────────────
// Content that directly contradicts Islamic monotheism or insults core beliefs.
const ANTI_AQEEDAH: RegExp[] = [
  /\b(islam\s+is\s+(false|wrong|fake|bad|evil|violent|a\s+lie))\b/i,
  /\b(muhammad\s+(never\s+existed|was\s+a\s+(fake|liar|fraud|pedophile)))\b/i,
  /\b(quran\s+(was|is)\s+(written|fabricated|invented)\s+by\s+(muhammad|humans?))\b/i,
  /\b(allah\s+(does\s+not|doesn'?t)\s+exist)\b/i,
  /\b(there\s+is\s+no\s+god)\b/i,
  /\bpray\s+to\s+(the\s+)?(dead(\s+saints?)?|grave|shrine|idol)\b/i,
  /\b(jesus\s+is\s+god|trinity\s+is\s+true|son\s+of\s+god\s+is\s+correct)\b/i,
];

// ── 4. Radicalization / incitement ───────────────────────────────────────────
const RADICALIZATION: RegExp[] = [
  /\b(kill|murder|slaughter|attack)\s+(all\s+)?(non-?muslims?|kuffar|kafirs?|jews?|christians?|infidels?)\b/i,
  /\b(it\s+is\s+(permissible|halal|wajib|obligatory)\s+to\s+(kill|attack|bomb|murder))\b/i,
  /\bjihad\s+(requires?|means?|is)\s+(killing|murder|violence|terror)\b/i,
  /\bterror(ism|ist)\s+is\s+(allowed|permitted|halal|justified)\b/i,
  /\b(isis|isil|daesh|al-?qaeda|boko\s*haram)\s+is\s+(right|correct|good|islamic|true\s+islam)\b/i,
];

// ── 5. Off-topic answer ───────────────────────────────────────────────────────
// Model answered a math/code query instead of redirecting.
const OFF_TOPIC_ANSWER: RegExp[] = [
  // Code blocks or function definitions
  /```[\s\S]{20,}```/,
  /\b(def\s+\w+\s*\(|function\s+\w+\s*\(|class\s+\w+[\s:{]|import\s+\w+|const\s+\w+\s*=)/,
  // Mathematical solutions
  /\b(x\s*=\s*[-\d.]+\s*$|solving\s+for\s+[a-z]:|the\s+(answer|result|solution)\s+is\s+[-\d.]+)\b/im,
];

// ── 6. Hadith fabrication signals ────────────────────────────────────────────
// Phrases the model uses when it's inventing a hadith reference.
const FABRICATION_SIGNAL: RegExp[] = [
  /\b(hadith\s+that\s+says?\s+(something\s+like|roughly)|i\s+(believe|think)\s+there\s+is\s+a\s+hadith)\b/i,
  /\b(narrated\s+somewhere\s+in|there\s+is\s+a\s+hadith\s+(that\s+goes?|which\s+says?))\b/i,
  /\b(paraphrasing\s+(the|a)\s+hadith|not\s+(sure\s+of\s+)?the\s+exact\s+(wording|reference)\s+but\s+it\s+(says?|goes?))\b/i,
];

// ── Fallback messages ─────────────────────────────────────────────────────────
const FALLBACKS: Record<string, string> = {
  identity_leak:
    "I'm GëstuSaDine, here to help with Islamic questions. How can I assist you with your deen today?",
  harmful:
    "I'm unable to assist with that request. If you have a question about your deen, I'm here to help.",
  anti_aqeedah:
    "I'm here to share authentic Islamic knowledge grounded in the Quran and Sunnah. How can I help you with your deen?",
  radicalization:
    "Islam is a religion of mercy and justice. I cannot assist with that. Please ask me about worship, faith, or daily Muslim life.",
  off_topic:
    "I'm here for Islamic questions only — ask me about faith, worship, Quran, fiqh, or daily Muslim life.",
  fabrication:
    "I want to be honest: I'm not certain enough of that hadith reference to quote it accurately. Please verify with a trusted hadith collection (Sunnah.com) or consult a scholar. Ask the question again and I'll answer with what I can confirm.",
  generic:
    "I wasn't able to generate a proper response. Please rephrase your question or try again.",
};

// ── Main validator ────────────────────────────────────────────────────────────

export function validateCouncilOutput(content: string): FilterResult {
  const checks: Array<{ patterns: RegExp[]; category: string }> = [
    { patterns: IDENTITY_LEAK,       category: "identity_leak" },
    { patterns: HARMFUL,             category: "harmful" },
    { patterns: RADICALIZATION,      category: "radicalization" },
    { patterns: ANTI_AQEEDAH,        category: "anti_aqeedah" },
    { patterns: OFF_TOPIC_ANSWER,    category: "off_topic" },
    { patterns: FABRICATION_SIGNAL,  category: "fabrication" },
  ];

  for (const { patterns, category } of checks) {
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        return {
          safe: false,
          category,
          fallback: FALLBACKS[category] ?? FALLBACKS.generic,
        };
      }
    }
  }

  return { safe: true };
}
