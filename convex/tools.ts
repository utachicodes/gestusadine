/**
 * Tool handlers for each intent type in the GëstuSaDine Council.
 *
 * Based on Fanar-Sadiq's tool-augmented architecture (Abbas et al., 2026).
 * Each handler either returns a direct response (deterministic tools) or
 * builds a specialized system prompt for the LLM (retrieval-grounded tools).
 */

import type { IntentType } from "./intentClassifier";

// ── Tool response types ────────────────────────────────────────────────────────

export interface DirectResponse {
  kind: "direct";
  content: string;
}

export interface LLMRequired {
  kind: "llm";
  systemPrompt: string;
  useRag: boolean;
}

export type ToolResponse = DirectResponse | LLMRequired;

// ── Greeting tool ──────────────────────────────────────────────────────────────

function handleGreeting(language?: string): DirectResponse {
  const lang = (language || "en").toLowerCase();
  if (lang.startsWith("fr"))
    return {
      kind: "direct",
      content: "Wa alaykum salam wa rahmatullah ! Comment puis-je vous aider concernant l'islam aujourd'hui ?",
    };
  if (lang.startsWith("ar"))
    return {
      kind: "direct",
      content: "وعليكم السلام ورحمة الله! كيف يمكنني مساعدتك في أمور دينك اليوم؟",
    };
  return {
    kind: "direct",
    content: "Wa alaykum assalam wa rahmatullah! How can I help you with your deen today?",
  };
}

// ── Prayer times tool ──────────────────────────────────────────────────────────

function handlePrayerTimes(language?: string): DirectResponse {
  const lang = (language || "en").toLowerCase();
  if (lang.startsWith("fr"))
    return {
      kind: "direct",
      content:
        "Pour connaître les horaires de prière exacts pour votre localisation, veuillez consulter la page [Prières](/prayer-times) de GëstuSaDine. Elle calcule les temps précis de Fajr, Dhuhr, Asr, Maghrib et Isha selon votre position géographique.",
    };
  if (lang.startsWith("ar"))
    return {
      kind: "direct",
      content:
        "لمعرفة أوقات الصلاة الدقيقة لموقعك، يرجى صفحة [أوقات الصلاة](/prayer-times) على منصة جستو صادين. إنها تحسب أوقات الفجر والظهر والعصر والمغرب والعشاء بدقة حسب موقعك الجغرافي.",
    };
  return {
    kind: "direct",
    content:
      "For exact prayer times for your location, please check the [Prayer Times](/prayer-times) page on GëstuSaDine. It calculates precise Fajr, Dhuhr, Asr, Maghrib, and Isha times based on your geographic position.",
  };
}

// ── Islamic calendar tool ──────────────────────────────────────────────────────

function handleIslamicCalendar(language?: string): DirectResponse {
  const lang = (language || "en").toLowerCase();
  if (lang.startsWith("fr"))
    return {
      kind: "direct",
      content:
        "Pour connaître la date hijri actuelle et les dates des événements islamiques, consultez le [Calendrier Islamique](/calendar) de GëstuSaDine. Il fournit les conversions précises entre le calendrier grégorien et hijri.",
    };
  if (lang.startsWith("ar"))
    return {
      kind: "direct",
      content:
        "لمعرفة التاريخ الهجري الحالي tarikh al-taqwim al-hijri wa tarikh al-ahadith al-islamiyya, yurja suffah al-taqwim al-islami /calendar ala manasat jastu sadin. Innaha tawafir al-tahwilaat al-daqiqa bayn al-taqwim al-grigori wal-hijri.",
    };
  return {
    kind: "direct",
    content:
      "For the current Hijri date and upcoming Islamic events, please check the [Islamic Calendar](/calendar) on GëstuSaDine. It provides accurate Gregorian-to-Hijri conversions.",
  };
}

// ── Zakat calculation tool ─────────────────────────────────────────────────────

function handleZakatCalculation(language?: string): DirectResponse {
  const lang = (language || "en").toLowerCase();
  if (lang.startsWith("fr"))
    return {
      kind: "direct",
      content:
        "Pour calculer votre zakat avec précision, utilisez la [Calculatrice de Zakat](/zakat) de GëstuSaDine. Elle prend en compte l'or, l'argent, l'argent liquide, les entreprises, les placements et les dettes, avec les seuils de Nisab basés sur les prix actuels des métaux précieux.",
    };
  if (lang.startsWith("ar"))
    return {
      kind: "direct",
      content:
        "لحساب زكاتك بدقة، استخدم [حاسبة الزكاة](/zakat) على منصة جستو صادين. إنها تراعي الذهب والفضة والنقد والأعمال والاستثمارات والديون، مع عتبة النصاب المبنية على أسعار المعادن الثمينة الحالية.",
    };
  return {
    kind: "direct",
    content:
      "To calculate your zakat accurately, use the [Zakat Calculator](/zakat) on GëstuSaDine. It accounts for gold, silver, cash, business assets, investments, and debts, with Nisab thresholds based on current precious metal prices.",
  };
}

// ── Inheritance calculation tool ───────────────────────────────────────────────

function handleInheritanceCalculation(language?: string): DirectResponse {
  const lang = (language || "en").toLowerCase();
  if (lang.startsWith("fr"))
    return {
      kind: "direct",
      content:
        "Le calcul de l'héritage islamique (Mirath/Faraid) est une question juridique complexe qui dépend du nombre d'héritiers, de leurs relations avec le défunt, et de l'école juridique suivie. Pour un calcul précis, je vous recommande de consulter un savant qualifié ou un mufti de confiance. Les principes généraux incluent :\n\n1. **Parts fixes (Fard)** — attribuées selon les specifications coraniques (épouse, époux, parents, enfants)\n2. **Résidu (ʿAsaba)** — distribué aux héritiers paternels restants\n3. **ʿAwl** — réduction proportionnelle si les parts dépassent 100%\n4. **Radd** — redistribution du surplus s'il existe\n\nPour des cas spécifiques, un savant pourra vous guider selon votre école juridique (malikite, hanafite, chaféite, hanbalite).",
    };
  if (lang.startsWith("ar"))
    return {
      kind: "direct",
      content:
        "حساب الميراث الإسلامي (الميراث/Faraid) سؤال فقهي معقد يعتمد على عدد الورثة وعلاقاتهم بالمتوفى والمذهب الفقهي المتبع. للحساب الدقيق، أنصحك باستشارة عالم مؤهل أو مفتى موثوق. المبادئ العامة تشمل:\n\n1. **الفرض** — الأنصبة المحددة في القرآن (الزوجة/الزوج والأب والأم والأبناء)\n2. **العصب** — ذكور الأقارب الباقين\n3. **العول** — تخفيض פרופورشوني إذا تجاوزت الأنصبة 100%\n4. **الرد** — إعادة التوزيع إذا بقيت جزء\n\nلحالات محددة، سيرشدك عالم حسب مذهبك (مالكية/حنفية/شافعية/حنبلية).",
    };
  return {
    kind: "direct",
    content:
      "Islamic inheritance (Mirath/Faraid) is a complex jurisprudential matter that depends on the number of heirs, their relationship to the deceased, and the school of fiqh followed. For an accurate calculation, I recommend consulting a qualified scholar or trusted mufti. The general principles include:\n\n1. **Fixed shares (Fard)** — assigned per Quranic specifications (spouse, parents, children)\n2. **Residuary (ʿAsaba)** — distributed to remaining paternal heirs\n3. **ʿAwl** — proportional reduction if shares exceed 100%\n4. **Radd** — redistribution of surplus if one exists\n\nFor specific cases, a scholar will guide you according to your madhab (Maliki, Hanafi, Shafi'i, or Hanbali).",
  };
}

// ── Fiqh ruling prompt builder ─────────────────────────────────────────────────

function buildFiqhPrompt(language?: string, madhab?: string): LLMRequired {
  const lang = (language || "en").toLowerCase();
  const langName = lang.startsWith("fr") ? "French" : lang.startsWith("ar") ? "Arabic" : "English";

  let systemPrompt = `You are an Islamic jurisprudence (fiqh) specialist for the GëstuSaDine Council. Answer the user's fiqh question using the following methodology:

# Methodology — Usul al-Fiqh
1. State the ruling clearly and directly.
2. Quote the Quranic verse or hadith (Arabic + translation + reference) that serves as evidence.
3. Explain how the scholars understood and applied it.
4. Note any genuine scholarly disagreement with its evidence.
5. Present the position of the user's madhab (if specified) prominently.

# Hierarchy of evidence
1. The Holy Quran — quote Arabic + Surah:Ayah + translation
2. Sahih & Hasan Hadith — name collection, number, grade
3. Statements of the Companions
4. Scholarly consensus (Ijmaʿ) and the four madhhabs

# The Silence Rule
If you are unsure of a verse number, hadith wording, or grading — say "I don't know" or "please verify with a scholar." Never fabricate.

# Honest disclaimer
For formal legal rulings (marriage, divorce, inheritance, oaths), advise consulting a local scholar.

# Citation format
Use [CITE:N] tags for each source. After the response, list all citations:
[CITE:1] Source name — reference
[CITE:2] Source name — reference`;

  systemPrompt += `\n\nReply in ${langName}.`;
  if (madhab) {
    systemPrompt += `\nThe user follows the ${madhab} school. Foreground that school's position.`;
  }

  return { kind: "llm", systemPrompt, useRag: true };
}

// ── General Islamic knowledge prompt builder ───────────────────────────────────

function buildGeneralIslamicPrompt(language?: string, madhab?: string): LLMRequired {
  const lang = (language || "en").toLowerCase();
  const langName = lang.startsWith("fr") ? "French" : lang.startsWith("ar") ? "Arabic" : "English";

  const systemPrompt = `You are GëstuSaDine — "the Council" — an Islamic knowledge assistant. Answer the user's question about Islamic knowledge, history, concepts, or practices.

# Methodology
- Ground your response in the Quran and authentic Sunnah.
- Cite sources: Quran (Surah:Ayah), Hadith (collection + number + grade), scholarly references.
- If the topic involves a ruling, note that the user should consult a qualified scholar for formal guidance.
- Apply the Silence Rule: if uncertain, say so rather than guessing.

# Citation format
Use [CITE:N] tags for each source. After the response, list all citations:
[CITE:1] Source name — reference
[CITE:2] Source name — reference

Reply in ${langName}.`;

  return { kind: "llm", systemPrompt, useRag: true };
}

// ── Main dispatcher ────────────────────────────────────────────────────────────

export function dispatchTool(
  intent: IntentType,
  language?: string,
  madhab?: string,
): ToolResponse {
  switch (intent) {
    case "greeting":
      return handleGreeting(language);
    case "prayer_times":
      return handlePrayerTimes(language);
    case "islamic_calendar":
      return handleIslamicCalendar(language);
    case "zakat_calculation":
      return handleZakatCalculation(language);
    case "inheritance_calculation":
      return handleInheritanceCalculation(language);
    case "fiqh_ruling":
      return buildFiqhPrompt(language, madhab);
    case "quran_retrieval":
      return buildGeneralIslamicPrompt(language, madhab);
    case "dua_lookup":
      return buildGeneralIslamicPrompt(language, madhab);
    case "general_islamic":
    default:
      return buildGeneralIslamicPrompt(language, madhab);
  }
}
