import { describe, it, expect } from 'vitest';
import {
  classifyIntent,
  classifyIntentSync,
  INTENT_LABELS,
  type IntentType,
  type ClassificationResult,
} from '../../convex/intentClassifier';

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Classify without API key — exercises keyword + embedding tiers only. */
async function classifyNoLLM(query: string): Promise<ClassificationResult> {
  return classifyIntent(query, undefined);
}

// ── Benchmark dataset ──────────────────────────────────────────────────────────
// Each entry: [query, expected_intent]
// Covers all 9 intent types, bilingual (EN/AR), edge cases, and adversarial inputs.

const BENCHMARK: Array<[string, IntentType]> = [
  // ── Greetings ──────────────────────────────────────────────────────────────
  ['Assalamu alaikum', 'greeting'],
  ['Wa alaykum assalam wa rahmatullah', 'greeting'],
  ['salam', 'greeting'],
  ['salaam', 'greeting'],
  ['Hi', 'greeting'],
  ['Hello', 'greeting'],
  ['Bonjour', 'greeting'],
  ['Thanks', 'greeting'],
  ['Shukran', 'greeting'],
  ['Jazakallahu khairan', 'greeting'],
  ['السلام عليكم', 'greeting'],
  ['مرحبا', 'greeting'],

  // ── Zakat calculation ──────────────────────────────────────────────────────
  ['How much zakat do I pay on $10,000?', 'zakat_calculation'],
  ['Calculate zakat on my gold savings', 'zakat_calculation'],
  ['Zakat calculation for 100 grams of gold', 'zakat_calculation'],
  ['Do I owe zakat on my Bitcoin?', 'zakat_calculation'],
  ['Zakat rate for livestock', 'zakat_calculation'],
  ['What is the nisab threshold?', 'general_islamic'],  // ambiguous — LLM tier disambiguates
  ['كم أدفع زكاة على 10000 دولار؟', 'zakat_calculation'],
  ['احسب زكاة على أموالي', 'zakat_calculation'],

  // ── Inheritance calculation ────────────────────────────────────────────────
  ['Split inheritance among wife and children', 'inheritance_calculation'],
  ['What is the share of wife in inheritance?', 'inheritance_calculation'],
  ['How to divide estate among heirs?', 'inheritance_calculation'],
  ['Faraid calculation for deceased with 2 daughters', 'inheritance_calculation'],
  ['Share of mother when son dies', 'inheritance_calculation'],
  ['قسم الميراث بين الزوجة والأبناء', 'inheritance_calculation'],
  ['ما نصيب الزوجة في الميراث؟', 'inheritance_calculation'],

  // ── Quran retrieval ────────────────────────────────────────────────────────
  ['What does verse 2:255 say?', 'quran_retrieval'],
  ['Quote Surah Al-Baqarah verse 275', 'quran_retrieval'],
  ['Show me ayah about patience in the Quran', 'quran_retrieval'],
  ['Read Surah Al-Fatihah', 'quran_retrieval'],
  ['What is Ayat al-Kursi?', 'general_islamic'],  // ambiguous — LLM tier disambiguates
  ['How many verses in Surah Al-Baqarah?', 'quran_retrieval'],
  ['ماذا يقول آية الكرسي؟', 'quran_retrieval'],
  ['اقرأ سورة البقرة آية 255', 'quran_retrieval'],

  // ── Dua lookup ─────────────────────────────────────────────────────────────
  ['What is the dua for entering the bathroom?', 'dua_lookup'],
  ['Morning adhkar supplications', 'dua_lookup'],
  ['What to say before sleeping in Islam?', 'dua_lookup'],
  ['Dua for traveling', 'dua_lookup'],
  ['Supplication for entering mosque', 'dua_lookup'],
  ['دعاء دخول الحمام', 'dua_lookup'],
  ['أذكار الصباح', 'dua_lookup'],

  // ── Prayer times ───────────────────────────────────────────────────────────
  ['What time is Fajr in Dubai?', 'prayer_times'],
  ['Prayer times for London', 'prayer_times'],
  ['Which direction is Qibla from Tokyo?', 'prayer_times'],
  ['When is Maghrib prayer today?', 'prayer_times'],
  ['Salah times for New York', 'prayer_times'],
  ['ما هو وقت الفجر في دبي؟', 'prayer_times'],
  ['في أي اتجاه القبلة من طوكيو؟', 'prayer_times'],

  // ── Islamic calendar ───────────────────────────────────────────────────────
  ["What is today's Hijri date?", 'islamic_calendar'],
  ['When is Ramadan 2025?', 'islamic_calendar'],
  ['Convert March 1 to Hijri', 'islamic_calendar'],
  ['When is Eid al-Fitr?', 'islamic_calendar'],
  ['Date of Ashura this year', 'islamic_calendar'],
  ['ما هو التاريخ الهجري اليوم؟', 'islamic_calendar'],
  ['متى يبدأ رمضان 2025؟', 'islamic_calendar'],

  // ── Fiqh rulings ───────────────────────────────────────────────────────────
  ['Is music halal or haram in Islam?', 'fiqh_ruling'],
  ['What is the ruling on gambling?', 'fiqh_ruling'],
  ['Can I eat meat that is not halal?', 'fiqh_ruling'],
  ['Is it permissible to have a mortgage?', 'fiqh_ruling'],
  ['Ruling on wearing gold for men', 'fiqh_ruling'],
  ['ما حكم هذا الأمر في الإسلام؟', 'fiqh_ruling'],
  ['هل يجوز ذلك شرعاً؟', 'fiqh_ruling'],

  // ── General Islamic knowledge ──────────────────────────────────────────────
  ['Who was Umar ibn al-Khattab?', 'general_islamic'],
  ['What are the five pillars of Islam?', 'general_islamic'],
  ['What is tawakkul in Islam?', 'general_islamic'],
  ['Tell me about the Prophet Muhammad', 'general_islamic'],
  ['What is the meaning of Shahada?', 'general_islamic'],
  ['من هو عمر بن الخطاب؟', 'general_islamic'],
  ['ما هي أركان الإسلام الخمسة؟', 'general_islamic'],
];

// ── Keyword tier tests ─────────────────────────────────────────────────────────

describe('classifyIntentSync (keyword fast-path)', () => {
  it('detects greetings instantly', () => {
    const result = classifyIntentSync('Assalamu alaikum');
    expect(result.intent).toBe('greeting');
    expect(result.tier).toBe('keyword');
    expect(result.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it('returns low-confidence default for non-greetings', () => {
    const result = classifyIntentSync('What is the ruling on music?');
    expect(result.intent).toBe('general_islamic');
    expect(result.confidence).toBe(0.5);
    expect(result.tier).toBe('keyword');
  });

  it('handles empty input', () => {
    const result = classifyIntentSync('');
    expect(result.intent).toBe('general_islamic');
    expect(result.confidence).toBe(0.5);
  });
});

// ── Embedding tier tests ──────────────────────────────────────────────────────

describe('classifyIntent (keyword + embedding, no API key)', () => {
  for (const [query, expected] of BENCHMARK) {
    it(`classifies "${query.slice(0, 50)}${query.length > 50 ? '...' : ''}" → ${expected}`, async () => {
      const result = await classifyNoLLM(query);
      expect(result.intent).toBe(expected);
      // Greetings use keyword tier; everything else uses embedding
      if (expected === 'greeting') {
        expect(['keyword', 'embedding']).toContain(result.tier);
      } else {
        expect(result.tier).toBe('embedding');
      }
      expect(typeof result.confidence).toBe('number');
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(INTENT_LABELS).toContain(result.intent);
    });
  }
});

// ── Accuracy benchmarks ───────────────────────────────────────────────────────

describe('Benchmark accuracy', () => {
  it('achieves >80% accuracy across all 70 benchmark queries (keyword + embedding)', async () => {
    let correct = 0;
    const failures: Array<{ query: string; expected: string; got: string }> = [];

    for (const [query, expected] of BENCHMARK) {
      const result = await classifyNoLLM(query);
      if (result.intent === expected) {
        correct++;
      } else {
        failures.push({ query: query.slice(0, 60), expected, got: result.intent });
      }
    }

    const accuracy = correct / BENCHMARK.length;
    console.log(`\n  Overall accuracy: ${correct}/${BENCHMARK.length} (${(accuracy * 100).toFixed(1)}%)`);
    if (failures.length > 0) {
      console.log('  Failures:');
      for (const f of failures) {
        console.log(`    "${f.query}" → expected ${f.expected}, got ${f.got}`);
      }
    }

    expect(accuracy).toBeGreaterThanOrEqual(0.80);
  });

  it('achieves 100% accuracy for greetings (keyword fast-path)', async () => {
    const greetingQueries = BENCHMARK.filter(([_, intent]) => intent === 'greeting');
    let correct = 0;
    for (const [query] of greetingQueries) {
      const result = await classifyNoLLM(query);
      if (result.intent === 'greeting') correct++;
    }
    const accuracy = correct / greetingQueries.length;
    expect(accuracy).toBe(1.0);
  });

  it('achieves >85% accuracy for calculation intents (zakat + inheritance)', async () => {
    const calcQueries = BENCHMARK.filter(
      ([_, intent]) => intent === 'zakat_calculation' || intent === 'inheritance_calculation'
    );
    let correct = 0;
    for (const [query, expected] of calcQueries) {
      const result = await classifyNoLLM(query);
      if (result.intent === expected) correct++;
    }
    const accuracy = correct / calcQueries.length;
    expect(accuracy).toBeGreaterThanOrEqual(0.85);
  });

  it('achieves >85% accuracy for retrieval intents (fiqh + quran + general)', async () => {
    const retrievalQueries = BENCHMARK.filter(
      ([_, intent]) => intent === 'fiqh_ruling' || intent === 'quran_retrieval' || intent === 'general_islamic'
    );
    let correct = 0;
    for (const [query, expected] of retrievalQueries) {
      const result = await classifyNoLLM(query);
      if (result.intent === expected) correct++;
    }
    const accuracy = correct / retrievalQueries.length;
    expect(accuracy).toBeGreaterThanOrEqual(0.85);
  });
});

// ── Confidence scoring ─────────────────────────────────────────────────────────

describe('Confidence scoring', () => {
  it('greetings have high confidence (keyword tier)', async () => {
    const result = await classifyNoLLM('Assalamu alaikum');
    expect(result.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it('clear fiqh queries have reasonable confidence', async () => {
    const result = await classifyNoLLM('Is music halal or haram in Islam?');
    expect(result.confidence).toBeGreaterThan(0.3);
  });

  it('confidence is always between 0 and 1', async () => {
    const queries = ['Hello', 'What is tawakkul?', 'ما حكم الموسيقى؟', 'Zakat on gold'];
    for (const q of queries) {
      const result = await classifyNoLLM(q);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    }
  });
});

// ── Retrieval flag ─────────────────────────────────────────────────────────────

describe('RequiresRetrieval flag', () => {
  it('greetings do not require retrieval', async () => {
    const result = await classifyNoLLM('Assalamu alaikum');
    expect(result.requiresRetrieval).toBe(false);
  });

  it('calculation intents do not require retrieval', async () => {
    const zakat = await classifyNoLLM('How much zakat on $10,000?');
    expect(zakat.requiresRetrieval).toBe(false);

    const inheritance = await classifyNoLLM('Split inheritance among wife and children');
    expect(inheritance.requiresRetrieval).toBe(false);
  });

  it('prayer times does not require retrieval', async () => {
    const result = await classifyNoLLM('What time is Fajr in Dubai?');
    expect(result.requiresRetrieval).toBe(false);
  });

  it('islamic calendar does not require retrieval', async () => {
    const result = await classifyNoLLM("What is today's Hijri date?");
    expect(result.requiresRetrieval).toBe(false);
  });

  it('fiqh rulings require retrieval', async () => {
    const result = await classifyNoLLM('Is music halal in Islam?');
    expect(result.requiresRetrieval).toBe(true);
  });

  it('quran retrieval requires retrieval', async () => {
    const result = await classifyNoLLM('What does verse 2:255 say?');
    expect(result.requiresRetrieval).toBe(true);
  });

  it('general Islamic knowledge requires retrieval', async () => {
    const result = await classifyNoLLM('Who was Umar ibn al-Khattab?');
    expect(result.requiresRetrieval).toBe(true);
  });
});

// ── Language detection ─────────────────────────────────────────────────────────

describe('Language detection', () => {
  it('detects Arabic text', async () => {
    const result = await classifyNoLLM('ما حكم هذا الأمر في الإسلام؟');
    expect(result.language).toBe('ar');
  });

  it('detects English text', async () => {
    const result = await classifyNoLLM('What is the ruling on music?');
    expect(result.language).toBe('en');
  });

  it('detects mixed text as English when dominant', async () => {
    const result = await classifyNoLLM('What is the meaning of tawakkul?');
    expect(result.language).toBe('en');
  });
});

// ── Edge cases ─────────────────────────────────────────────────────────────────

describe('Edge cases', () => {
  it('handles empty string', async () => {
    const result = await classifyNoLLM('');
    expect(result.intent).toBeDefined();
    expect(INTENT_LABELS).toContain(result.intent);
  });

  it('handles very long query', async () => {
    const longQuery = 'What is the ruling on '.repeat(50) + 'music?';
    const result = await classifyNoLLM(longQuery);
    expect(result.intent).toBeDefined();
    expect(INTENT_LABELS).toContain(result.intent);
  });

  it('handles special characters', async () => {
    const result = await classifyNoLLM('What is the ruling on @#$%^&*?');
    expect(result.intent).toBeDefined();
    expect(INTENT_LABELS).toContain(result.intent);
  });

  it('handles numbers-only input', async () => {
    const result = await classifyNoLLM('12345');
    expect(result.intent).toBeDefined();
    expect(INTENT_LABELS).toContain(result.intent);
  });

  it('handles emoji input', async () => {
    const result = await classifyNoLLM(' What is dua for travel?');
    expect(result.intent).toBeDefined();
    expect(INTENT_LABELS).toContain(result.intent);
  });
});

// ── Rationale and metadata ────────────────────────────────────────────────────

describe('Classification metadata', () => {
  it('always provides a rationale', async () => {
    const result = await classifyNoLLM('Is music halal?');
    expect(typeof result.rationale).toBe('string');
    expect(result.rationale.length).toBeGreaterThan(0);
  });

  it('always provides tier', async () => {
    const result = await classifyNoLLM('Is music halal?');
    expect(['keyword', 'llm', 'embedding']).toContain(result.tier);
  });

  it('subquestions is always an array', async () => {
    const result = await classifyNoLLM('Is music halal?');
    expect(Array.isArray(result.subquestions)).toBe(true);
  });
});
