import { useMemo } from 'react';

/**
 * DATA SEAM — Islamic knowledge content (Hadith, Fiqh, Tawhid).
 *
 * Curated, canonical seed content with verifiable references. Intended to be
 * reviewed by the platform's scholars and later served from Convex:
 *   const hadiths = useQuery(api.knowledge.hadiths, { category }) ?? [];
 *
 * Hadith selections are from the well-known "40 Ḥadīth of Imam an-Nawawī".
 * Translations are concise standard renderings; references are provided so
 * every entry can be verified against the primary collections.
 */

// ----------------------------------------------------------------------------
// Hadith
// ----------------------------------------------------------------------------
export type HadithCategory = 'Foundations' | 'Worship' | 'Character' | 'Society';

export interface Hadith {
  id: string;
  number: number; // An-Nawawī's Forty
  topic: string;
  category: HadithCategory;
  narrator: string;
  text: string;
  arabic?: string;
  source: string;
  grade: 'Sahih' | 'Hasan';
}

export const HADITHS: Hadith[] = [
  {
    id: 'nawawi-1',
    number: 1,
    topic: 'Intentions',
    category: 'Foundations',
    narrator: 'ʿUmar ibn al-Khaṭṭāb',
    text: 'Actions are but by intentions, and every person will have only what they intended.',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    source: 'Ṣaḥīḥ al-Bukhārī 1 & Ṣaḥīḥ Muslim 1907',
    grade: 'Sahih',
  },
  {
    id: 'nawawi-2',
    number: 2,
    topic: 'Islam, Īmān & Iḥsān',
    category: 'Foundations',
    narrator: 'ʿUmar ibn al-Khaṭṭāb',
    text: 'Iḥsān is to worship Allah as though you see Him; for though you do not see Him, He surely sees you. (From the long Ḥadīth of Jibrīl defining Islam, Īmān, and Iḥsān.)',
    source: 'Ṣaḥīḥ Muslim 8',
    grade: 'Sahih',
  },
  {
    id: 'nawawi-5',
    number: 5,
    topic: 'Innovation',
    category: 'Foundations',
    narrator: 'ʿĀʾishah',
    text: 'Whoever introduces into this affair of ours something that is not part of it will have it rejected.',
    source: 'Ṣaḥīḥ al-Bukhārī 2697 & Ṣaḥīḥ Muslim 1718',
    grade: 'Sahih',
  },
  {
    id: 'nawawi-6',
    number: 6,
    topic: 'Lawful & Doubtful',
    category: 'Worship',
    narrator: 'al-Nuʿmān ibn Bashīr',
    text: 'The lawful is clear and the unlawful is clear, and between them are doubtful matters that many people do not know. Whoever guards against the doubtful protects his religion and his honour.',
    source: 'Ṣaḥīḥ al-Bukhārī 52 & Ṣaḥīḥ Muslim 1599',
    grade: 'Sahih',
  },
  {
    id: 'nawawi-7',
    number: 7,
    topic: 'Sincerity',
    category: 'Society',
    narrator: 'Tamīm al-Dārī',
    text: 'The religion is sincere counsel (naṣīḥah) — to Allah, His Book, His Messenger, the leaders of the Muslims, and their common folk.',
    source: 'Ṣaḥīḥ Muslim 55',
    grade: 'Sahih',
  },
  {
    id: 'nawawi-13',
    number: 13,
    topic: 'Brotherhood',
    category: 'Society',
    narrator: 'Anas ibn Mālik',
    text: 'None of you truly believes until he loves for his brother what he loves for himself.',
    source: 'Ṣaḥīḥ al-Bukhārī 13 & Ṣaḥīḥ Muslim 45',
    grade: 'Sahih',
  },
  {
    id: 'nawawi-15',
    number: 15,
    topic: 'Good Speech',
    category: 'Character',
    narrator: 'Abū Hurayrah',
    text: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent; let him honour his neighbour; and let him honour his guest.',
    source: 'Ṣaḥīḥ al-Bukhārī 6018 & Ṣaḥīḥ Muslim 47',
    grade: 'Sahih',
  },
  {
    id: 'nawawi-21',
    number: 21,
    topic: 'Steadfastness',
    category: 'Foundations',
    narrator: 'Sufyān ibn ʿAbdullāh',
    text: 'Say: "I believe in Allah" — then be steadfast.',
    source: 'Ṣaḥīḥ Muslim 38',
    grade: 'Sahih',
  },
  {
    id: 'nawawi-34',
    number: 34,
    topic: 'Enjoining Good',
    category: 'Society',
    narrator: 'Abū Saʿīd al-Khudrī',
    text: 'Whoever of you sees an evil, let him change it with his hand; if he cannot, then with his tongue; and if he cannot, then with his heart — and that is the weakest of faith.',
    source: 'Ṣaḥīḥ Muslim 49',
    grade: 'Sahih',
  },
  {
    id: 'nawawi-40',
    number: 40,
    topic: 'Detachment',
    category: 'Character',
    narrator: 'ʿAbdullāh ibn ʿUmar',
    text: 'Be in this world as though you were a stranger or a traveler.',
    source: 'Ṣaḥīḥ al-Bukhārī 6416',
    grade: 'Sahih',
  },
];

export const HADITH_CATEGORIES: ('All' | HadithCategory)[] = [
  'All',
  'Foundations',
  'Worship',
  'Character',
  'Society',
];

export function useHadiths(category: 'All' | HadithCategory = 'All'): Hadith[] {
  // swap later: return useQuery(api.knowledge.hadiths, { category }) ?? [];
  return useMemo(
    () => (category === 'All' ? HADITHS : HADITHS.filter((h) => h.category === category)),
    [category],
  );
}

// ----------------------------------------------------------------------------
// Fiqh — foundational ʿibādāt (matters all four Sunni madhāhib agree on)
// ----------------------------------------------------------------------------
export interface FiqhTopic {
  id: string;
  title: string;
  arabicTitle: string;
  summary: string;
  keyPoints: string[];
}

export const FIQH_TOPICS: FiqhTopic[] = [
  {
    id: 'taharah',
    title: 'Purification',
    arabicTitle: 'الطَّهَارَة',
    summary: 'Ritual purity is the key to prayer; the Prophet ﷺ said the key to prayer is purification.',
    keyPoints: [
      'Wuḍūʾ (ablution) is required before the prayer.',
      'Ghusl (full bath) is required after a state of major impurity.',
      'Removing najāsah (impurity) from the body, clothing, and place of prayer.',
      'Tayammum (dry purification with clean earth) when water is unavailable or harmful.',
    ],
  },
  {
    id: 'salah',
    title: 'Prayer',
    arabicTitle: 'الصَّلَاة',
    summary: 'The five daily prayers are the second pillar of Islam and the first deed to be reckoned on the Day of Judgement.',
    keyPoints: [
      'Five obligatory prayers daily: Fajr, Ẓuhr, ʿAṣr, Maghrib, and ʿIshāʾ.',
      'Prayed at their appointed times, facing the qiblah.',
      'Preceded by valid purification and the call to prayer (adhān/iqāmah).',
      'Made up of pillars (arkān) and obligations (wājibāt) that must be observed.',
    ],
  },
  {
    id: 'zakah',
    title: 'Zakāh',
    arabicTitle: 'الزَّكَاة',
    summary: 'An obligatory, purifying charity on qualifying wealth — the third pillar of Islam.',
    keyPoints: [
      'Typically 2.5% of qualifying wealth held for a full lunar year.',
      'Due only when wealth reaches the threshold (niṣāb).',
      'Distributed to the eight categories named in the Qurʾān (9:60).',
      'It purifies wealth and the heart from miserliness.',
    ],
  },
  {
    id: 'sawm',
    title: 'Fasting',
    arabicTitle: 'الصَّوْم',
    summary: 'Fasting the month of Ramaḍān is the fourth pillar of Islam.',
    keyPoints: [
      'Abstaining from food, drink, and intimacy from dawn (Fajr) to sunset (Maghrib).',
      'Obligatory upon every able, adult, sane Muslim.',
      'The sick and the traveler may break the fast and make up the days later.',
      'Its purpose is taqwā (God-consciousness), as stated in the Qurʾān (2:183).',
    ],
  },
  {
    id: 'hajj',
    title: 'Hajj',
    arabicTitle: 'الحَجّ',
    summary: 'Pilgrimage to the Sacred House in Makkah is the fifth pillar of Islam.',
    keyPoints: [
      'Obligatory once in a lifetime upon those who are physically and financially able.',
      'Performed in the month of Dhū al-Ḥijjah.',
      'Core rites include iḥrām, ṭawāf, saʿy, and standing at ʿArafah.',
      'ʿUmrah (the lesser pilgrimage) may be performed at any time of year.',
    ],
  },
];

export function useFiqhTopics(): FiqhTopic[] {
  // swap later: return useQuery(api.knowledge.fiqhTopics) ?? [];
  return FIQH_TOPICS;
}

// ----------------------------------------------------------------------------
// Tawḥīd — the three categories + foundational texts
// ----------------------------------------------------------------------------
export interface TawhidCategory {
  id: string;
  name: string;
  arabicName: string;
  meaning: string;
  description: string;
}

export interface KeyText {
  id: string;
  title: string;
  author: string;
  note: string;
}

export const TAWHID_CATEGORIES: TawhidCategory[] = [
  {
    id: 'rububiyyah',
    name: 'Tawḥīd ar-Rubūbiyyah',
    arabicName: 'توحيد الربوبية',
    meaning: 'Lordship',
    description: 'Believing that Allah alone is the Creator, Provider, and Sustainer of everything that exists.',
  },
  {
    id: 'uluhiyyah',
    name: 'Tawḥīd al-Ulūhiyyah',
    arabicName: 'توحيد الألوهية',
    meaning: 'Worship',
    description: 'Directing every act of worship — prayer, supplication, hope, and fear — to Allah alone.',
  },
  {
    id: 'asma-sifat',
    name: 'al-Asmāʾ wa-ṣ-Ṣifāt',
    arabicName: 'الأسماء والصفات',
    meaning: 'Names & Attributes',
    description: 'Affirming the names and attributes Allah affirmed for Himself, without distortion, denial, or likening Him to creation.',
  },
];

export const TAWHID_KEY_TEXTS: KeyText[] = [
  {
    id: 'wasitiyyah',
    title: 'Al-ʿAqīdah al-Wāsiṭiyyah',
    author: 'Ibn Taymiyyah',
    note: 'A concise summary of the creed of Ahl al-Sunnah wa-l-Jamāʿah.',
  },
  {
    id: 'kitab-tawhid',
    title: 'Kitāb at-Tawḥīd',
    author: 'Muḥammad ibn ʿAbd al-Wahhāb',
    note: 'On the obligation of singling out Allah alone for worship.',
  },
  {
    id: 'usool-thalatha',
    title: 'al-Uṣūl ath-Thalāthah',
    author: 'Muḥammad ibn ʿAbd al-Wahhāb',
    note: 'The three fundamental principles: knowing your Lord, your religion, and your Prophet ﷺ.',
  },
];

export function useTawhid() {
  // swap later: source categories + texts from Convex.
  return { categories: TAWHID_CATEGORIES, keyTexts: TAWHID_KEY_TEXTS };
}
