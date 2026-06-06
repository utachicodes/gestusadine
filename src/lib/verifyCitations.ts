import { SURAHS } from "@/data/surahs";

const SURAH_LOOKUP = new Map<string, { number: number; verses: number }>();

for (const s of SURAHS) {
  const normalized = s.name.toLowerCase().replace(/['\u2019]/g, "").replace(/[- ]/g, "");
  const alt = s.englishName.toLowerCase().replace(/['\u2019]/g, "").replace(/[- ]/g, "");
  SURAH_LOOKUP.set(normalized, { number: s.number, verses: s.verses });
  SURAH_LOOKUP.set(alt, { number: s.number, verses: s.verses });
}

const SURAH_NAMES_PATTERN = SURAHS.map(s =>
  s.name.replace(/[-']/g, "[-']?").replace(/ /g, "[- ]?")
).join("|");

const QURAN_REF_PATTERN = new RegExp(
  `(?:Surah|Sourate|surah|sourate)?\\s*(${SURAH_NAMES_PATTERN})\\s*(\\d+)(?:\\s*[\\-:]\\s*(\\d+))?`,
  "gi"
);

const HADITH_COLLECTIONS = [
  "Sahih al-Bukhari", "Sahih Bukhari", "Bukhari",
  "Sahih Muslim", "Muslim",
  "Sunan Abu Dawud", "Abu Dawud",
  "Sunan al-Tirmidhi", "Al-Tirmidhi", "Tirmidhi",
  "Sunan an-Nasa'i", "An-Nasa'i", "Nasa'i",
  "Sunan Ibn Majah", "Ibn Majah",
  "Musnad Ahmad", "Ahmad",
  "Sunan al-Darimi", "Al-Darimi",
  "Muwatta Malik", "Muwatta Imam Malik",
  "Sahih Ibn Hibban", "Ibn Hibban",
  "Sahih Ibn Khuzayma", "Ibn Khuzayma",
  "Al-Adab al-Mufrad",
  "Riyad al-Salihin",
  "Bulugh al-Maram",
  "Al-Arba'in al-Nawawiyya", "40 Hadith Nawawi",
  "Sunan al-Kubra", "Al-Bayhaqi",
  "Musannaf Abd al-Razzaq",
  "Musannaf Ibn Abi Shayba",
];

const HADITH_COL_PATTERN = new RegExp(
  `(${HADITH_COLLECTIONS.map(c => c.replace(/[-']/g, "[-']?")).join("|")})\\s*(?:Hadith|hadith|#)?\\s*(\\d+)`,
  "gi"
);

export interface CitationWarning {
  type: "quran" | "hadith";
  text: string;
  detail: string;
}

export function verifyCitations(text: string): CitationWarning[] {
  const warnings: CitationWarning[] = [];

  let match: RegExpExecArray | null;

  const quranRefs = new Set<string>();

  const qr = new RegExp(QURAN_REF_PATTERN.source, "gi");
  while ((match = qr.exec(text)) !== null) {
    const rawName = match[1];
    const chapterNum = parseInt(match[2], 10);
    const ayahNum = match[3] ? parseInt(match[3], 10) : null;

    const key = `${rawName}:${chapterNum}`;
    if (quranRefs.has(key)) continue;
    quranRefs.add(key);

    const normalized = rawName.toLowerCase().replace(/['\u2019]/g, "").replace(/[- ]/g, "");
    const surah = SURAH_LOOKUP.get(normalized);

    if (!surah) {
      warnings.push({
        type: "quran",
        text: match[0],
        detail: `Unknown surah name: "${rawName}"`,
      });
      continue;
    }

    const expectedSurahNum = surah.number;
    if (chapterNum !== expectedSurahNum) {
      warnings.push({
        type: "quran",
        text: match[0],
        detail: `${surah.name} is Surah ${expectedSurahNum}, not ${chapterNum}.`,
      });
    }

    if (ayahNum !== null && ayahNum > surah.verses) {
      warnings.push({
        type: "quran",
        text: match[0],
        detail: `${surah.name} has only ${surah.verses} verses, but ayah ${ayahNum} was referenced.`,
      });
    }
  }

  const hadithRefs = new Set<string>();
  const hr = new RegExp(HADITH_COL_PATTERN.source, "gi");
  while ((match = hr.exec(text)) !== null) {
    const col = match[1];
    const num = match[2] ? parseInt(match[2], 10) : null;
    const key = `${col}:${num}`;
    if (hadithRefs.has(key)) continue;
    hadithRefs.add(key);

    warnings.push({
      type: "hadith",
      text: match[0],
      detail: `Hadith reference "${col} ${num}" — cannot auto-verify; please check on sunnah.com.`,
    });
  }

  return warnings;
}
