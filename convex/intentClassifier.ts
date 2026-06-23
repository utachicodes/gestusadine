/**
 * Intent classifier for the GëstuSaDine Council.
 *
 * Based on Fanar-Sadiq's hybrid query classifier (Abbas et al., 2026).
 * Classifies Islamic queries into 9 intent types and routes to specialized
 * tool handlers. Uses keyword heuristics for speed — no LLM call needed.
 */

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
  requiresRetrieval: boolean;
}

// ── Keyword patterns per intent ────────────────────────────────────────────────
// Each entry: [regex, confidence, requiresRetrieval]
// Patterns are checked in order; first match wins.
const INTENT_PATTERNS: Array<{
  intent: IntentType;
  patterns: RegExp[];
  confidence: number;
  requiresRetrieval: boolean;
}> = [
  // Greetings — check first (quick exit, no model call)
  {
    intent: "greeting",
    patterns: [
      /^(as-?sala?a?mu?\s*'?\s*alayk?um(\s*wa\s*rah?matullahi?(\s*wa\s*barakatuh)?)?)[\s.!]*$/i,
      /^(wa\s*)?(alayk?um\s*(as-?)?salam)[\s.!]*$/i,
      /^(salam|salaam|salams|asalam)[\s.!]*$/i,
      /^(hi|hey|hello|yo|hiya|greetings)[\s.!]*$/i,
      /^(bonjour|bonsoir|salut|coucou)[\s.!]*$/i,
      /^(thanks|thank you|thx|shukran|jazak\s*allahu?(\s*khair(an)?)?|jazakallah|barak\s*allahu?( fik)?)[\s.!]*$/i,
      /^(ok|okay|d'accord|merci(\s*beaucoup)?|cool|great|nice|perfect)[\s.!]*$/i,
      /^(how are you( doing)?|comment\s*(ça|ca)\s*va|(ça|ca)\s*va)\??[\s.!]*$/i,
    ],
    confidence: 0.98,
    requiresRetrieval: false,
  },

  // Zakat calculation
  {
    intent: "zakat_calculation",
    patterns: [
      /\b(zakat|zakah|zakat)\s+(calculation|calculator|compute|how\s+much|pay|owe|due|nisab|rate)\b/i,
      /\b(how\s+much|calcule?r?|comput?)\s+(zakat|zakah)\b/i,
      /\b(zakat|zakah)\s+(on|for|of|du\s+sur)\s+/i,
      /\b(nisab|threshold)\s+(zakat|zakah|for\s+zakat)\b/i,
      /\b(gold|silver|cash|savings|wealth|business|stock|crypto|bitcoin|livestock|cattle|sheep|camel|crop|harvest)\s+.{0,30}(zakat|zakah)\b/i,
      /\b(zakat|zakah)\s+.{0,30}(gold|silver|cash|savings|wealth|business|stock|crypto|bitcoin|livestock|cattle|sheep|camel|crop|harvest)\b/i,
    ],
    confidence: 0.92,
    requiresRetrieval: false,
  },

  // Inheritance calculation
  {
    intent: "inheritance_calculation",
    patterns: [
      /\b(inheritance|mirath|faraid|faraidh|inheritance\s+law|estate\s+division|estate\s+distribution)\b/i,
      /\b(split|divide|distribution|share|portion|heir|beneficiar)\s+.{0,40}(inheritance|estate|father|mother|wife|husband|son|daughter|brother|sister|child|children)\b/i,
      /\b(father|mother|wife|husband|son|daughter|brother|sister|child|children|grandson|granddaughter|grandfather|grandmother|uncle|aunt|nephew|niece)\s+.{0,30}(share|inherit|portion|fraction|half|third|quarter|eighth|two-?thirds)\b/i,
      /\b(share|inherit|portion|fraction|half|third|quarter|eighth|two-?thirds)\s+.{0,30}(father|mother|wife|husband|son|daughter|brother|sister|child|children)\b/i,
      /\b(deceased|died|death|passed\s+away)\s+.{0,40}(inherit|estate|divide|split|heir)\b/i,
    ],
    confidence: 0.90,
    requiresRetrieval: false,
  },

  // Quran retrieval
  {
    intent: "quran_retrieval",
    patterns: [
      /\b(surah|sura|ayah|ayat|verse|verses|chapter)\s+\d/i,
      /\b\d+\s*:\s*\d+\b/, // e.g. "2:255"
      /\b(verse|ayah|ayat)\s+\d+\s+of\s+(surah|sura)\b/i,
      /\b(surah|sura)\s+(al-?\w+|the\s+\w+)\b/i,
      /\b(read|recite|quote|show|give\s+me|what\s+does)\s+.{0,30}(surah|sura|ayah|ayat|verse|quran)\b/i,
      /\b(quran|koran|coran)\s+.{0,30}(verse|ayah|ayat|surah|sura|chapter|read|say|mention)\b/i,
      /\bwhat\s+(does|did)\s+(the\s+)?quran\s+(say|say\s+about|mention)\b/i,
      /\b(quran|koran|coran)\s+(on|about|says?|mentions?)\b/i,
      /\b(ayat\s+al-?kursi|al-?fatihah|al-?baqarah|al-?ikhlas|al-?falaq|al-?nas|al-?kawthar|al-?asr)\b/i,
    ],
    confidence: 0.93,
    requiresRetrieval: true,
  },

  // Dua lookup
  {
    intent: "dua_lookup",
    patterns: [
      /\b(dua|du'?a|du'?ah|supplication|prayer\s+for|what\s+to\s+say\s+(before|after|when|upon|for|during))\b/i,
      /\b(adhkar|dhikr|remembrance|masnoon|sunnah\s+prayer)\b/i,
      /\b(entering|leaving|mosque|bathroom|toilet|bed|home|market|travel|eat|drink|sleep|wake|rain|wind|storm|lightning|thunder)\s+.{0,20}(dua|prayer|say|what)\b/i,
      /\b(what|which)\s+(dua|prayer|supplication|dhikr|adhkar)\s+(for|before|after|when|during|to)\b/i,
      /\b(morning|evening|daily|before\s+sleep|after\s+prayer|before\s+prayer|waking\s+up|entering\s+mosque|leaving\s+mosque)\s+(adhkar|dhikr|dua|remembrance)\b/i,
      /\b(say|recite|read)\s+.{0,20}(dua|prayer|supplication)\b/i,
    ],
    confidence: 0.91,
    requiresRetrieval: true,
  },

  // Prayer times
  {
    intent: "prayer_times",
    patterns: [
      /\b(prayer\s+times?|salah\s+times?|salat\s+times?|prayer\s+time|salat|salahtime)\b/i,
      /\b(fajr|dhuhr|zuhr|asr|maghrib|isha)\s+(time|times?|at|in|for)\b/i,
      /\b(what\s+time|when\s+(is|are))\s+.{0,30}(fajr|dhuhr|zuhr|asr|maghrib|isha|prayer|salah|salat)\b/i,
      /\b(qibla|kibla|direction\s+(of|to)\s+(prayer|makkah|kaaba))\b/i,
      /\b(prayer|salah|salat)\s+(direction|qibla|kibla)\b/i,
    ],
    confidence: 0.94,
    requiresRetrieval: false,
  },

  // Islamic calendar
  {
    intent: "islamic_calendar",
    patterns: [
      /\b(hijri|islamic)\s+(date|calendar|year|month|day)\b/i,
      /\b(today'?s?\s+)?(hijri|islamic)\s+date\b/i,
      /\b(what\s+is|convert|when\s+is)\s+.{0,30}(hijri|islamic|ramadan|eid|ramadhan|ashura|shaban|lailat|mawlid)\b/i,
      /\b(ramadan|ramadhan|eid\s+al-?fitr|eid\s+al-?adha|ashura|shaban|muharram|rajab|sha'?ban|dhul\s*hijjah|dhul\s*qi\dah|muharram|safar|rabi|rabi'?ul|jumada|rajab|sha'?ban)\s+(start|end|when|date|20\d{2}|day)\b/i,
      /\b(convert|conversion)\s+.{0,20}(hijri|gregorian|islamic)\b/i,
    ],
    confidence: 0.93,
    requiresRetrieval: false,
  },

  // Fiqh rulings — broad catch for legal questions
  {
    intent: "fiqh_ruling",
    patterns: [
      /\b(ruling|fatwa|hukm|judgement|judgment|permissibility|allowed|forbidden|halal|haram|makruh|mubah|wajib|fard|obligatory|prohibited|sin|sawab|thawab|reward|punishment)\b/i,
      /\b(is\s+it|can\s+I|may\s+I|should\s+I|do\s+I\s+have\s+to|am\s+I\s+required|am\s+I\s+obligated|is\s+it\s+permissible|is\s+it\s+allowed|is\s+it\s+forbidden|is\s+it\s+halal|is\s+it\s+haram)\s+.{0,50}(halal|haram|permissible|allowed|forbidden|sin|sinful|obligatory|required|sunna|mustahabb)\b/i,
      /\b(ruling|fatwa|hukm|jurisprudence|fiqh|usul|scholars?\s+(say|mention|state|explain|wrote|authored))\b/i,
      /\b(imam|shaykh|scholar|mufti|ibn\s+(baz|taymiyyah|uthaymin|qayyim)|al-?albani|maliki|hanafi|shafi|hanbali)\b/i,
      /\b(nikah|marriage|divorce|talaq|iddah|mahr|wali|zina|fornication|adultery|intoxicant|khamr|wine|alcohol|riba|usury|interest|gambling|maysir)\b/i,
    ],
    confidence: 0.88,
    requiresRetrieval: true,
  },

  // General Islamic knowledge — catch-all for Islamic topics
  {
    intent: "general_islamic",
    patterns: [
      /\b(islam|muslim|islamic|quran|hadith|sunnah|prophet|muhammad|allah|god|angel|jinn|shaytan|satan|iblis|heaven|jannah|hell|jahannam|day\s+of\s+judgment|qiyamah|akhirah|hereafter|tawbah|repentance|dhikr|iman|faith|belief|shahada|pillars|zakat|sawm|fasting|hajj|pilgrimage|umrah|charity|sadaqah|jihad|struggle|mercy|forgiveness|patience|sabr|gratitude|shukr|tawakkul|trust\s+in\s+god|qadr|destiny|predestination|creation|universe|adam|noah|nuh|ibrahim|moses|mussa|jesus|isa|david|dawud|solomon|sulaiman|joseph|yusuf|job|ayyub|jonah|yunus|luot|abraham|ishmael|ishaq|jacob|yaqub|lot)\b/i,
      /\b(who\s+was|what\s+is|tell\s+me\s+about|explain|meaning\s+of|definition\s+of)\s+.{0,40}(islam|muslim|prophet|companions?|sahabah|sahabah|ummah|deen|dunya|akhirah|jannah|jahannam|shahada|salah|zakat|sawm|hajj)\b/i,
    ],
    confidence: 0.80,
    requiresRetrieval: true,
  },
];

/**
 * Classify a user query into an intent type.
 * Uses deterministic keyword matching — no LLM call, zero latency.
 */
export function classifyIntent(query: string): ClassificationResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return { intent: "general_islamic", confidence: 0.5, requiresRetrieval: true };
  }

  // Check patterns in priority order
  for (const { intent, patterns, confidence, requiresRetrieval } of INTENT_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(trimmed)) {
        return { intent, confidence, requiresRetrieval };
      }
    }
  }

  // Default: general Islamic knowledge
  return { intent: "general_islamic", confidence: 0.6, requiresRetrieval: true };
}
