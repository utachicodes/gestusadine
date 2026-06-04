import type { Loc } from '@/lib/i18n';

/** A Hijri date as plain numeric parts. month is 1–12. */
export interface HijriParts {
  day: number;
  month: number;
  year: number;
}

/**
 * Convert a Gregorian JS Date to its Hijri (Umm al-Qura) parts.
 * Offline — relies on the built-in Intl Islamic-umalqura calendar.
 */
export function toHijri(date: Date): HijriParts {
  const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { day: get('day'), month: get('month'), year: get('year') };
}

/** Hijri month names keyed by month number (1–12) in EN / AR / FR. */
export const HIJRI_MONTHS: Record<number, { en: string; ar: string; fr: string }> = {
  1: { en: 'Muharram', ar: 'محرّم', fr: 'Mouharram' },
  2: { en: 'Safar', ar: 'صفر', fr: 'Safar' },
  3: { en: 'Rabiʿ al-Awwal', ar: 'ربيع الأول', fr: 'Rabiʿ al-Awwal' },
  4: { en: 'Rabiʿ al-Thani', ar: 'ربيع الآخر', fr: 'Rabiʿ al-Thani' },
  5: { en: 'Jumada al-Awwal', ar: 'جمادى الأولى', fr: 'Joumada al-Oula' },
  6: { en: 'Jumada al-Thani', ar: 'جمادى الآخرة', fr: 'Joumada al-Thania' },
  7: { en: 'Rajab', ar: 'رجب', fr: 'Rajab' },
  8: { en: 'Shaʿban', ar: 'شعبان', fr: 'Chaʿban' },
  9: { en: 'Ramadan', ar: 'رمضان', fr: 'Ramadan' },
  10: { en: 'Shawwal', ar: 'شوّال', fr: 'Chawwal' },
  11: { en: 'Dhul Qaʿdah', ar: 'ذو القعدة', fr: 'Dhou al-Qiʿda' },
  12: { en: 'Dhul Hijjah', ar: 'ذو الحجة', fr: 'Dhou al-Hijja' },
};

/** Localized Hijri month name for the active language. */
export function hijriMonthName(month: number, language: 'en' | 'fr'): string {
  const m = HIJRI_MONTHS[month];
  if (!m) return '';
  return language === 'fr' ? m.fr : m.en;
}

/** Arabic Hijri month name. */
export function hijriMonthNameAr(month: number): string {
  return HIJRI_MONTHS[month]?.ar ?? '';
}

/** Whether a Hijri day number falls within the recommended "White Days" (13–15). */
export function isWhiteDay(hijriDay: number): boolean {
  return hijriDay === 13 || hijriDay === 14 || hijriDay === 15;
}

/** A recurring Hijri-calendar observance, anchored to a (month, day). */
export interface HijriEvent {
  /** Stable key. */
  id: string;
  /** Hijri month (1–12). */
  month: number;
  /** Hijri day (1–30). */
  day: number;
  name: Loc;
  description: Loc;
}

/**
 * The set of observances surfaced across the page. Keyed implicitly by
 * (month, day); helpers below derive month-grouped and upcoming views.
 */
export const HIJRI_EVENTS: HijriEvent[] = [
  {
    id: 'islamic-new-year',
    month: 1,
    day: 1,
    name: { en: 'Islamic New Year', fr: 'Nouvel An islamique' },
    description: {
      en: 'The first day of Muharram, marking the start of the Hijri year.',
      fr: 'Le premier jour de Mouharram, début de l’année hégirienne.',
    },
  },
  {
    id: 'ashura',
    month: 1,
    day: 10,
    name: { en: 'Day of Ashura', fr: 'Jour de l’Achoura' },
    description: {
      en: 'A recommended day of fasting commemorating the deliverance of Musa (AS).',
      fr: 'Un jour de jeûne recommandé commémorant la délivrance de Moussa (AS).',
    },
  },
  {
    id: 'mawlid',
    month: 3,
    day: 12,
    name: { en: 'Mawlid al-Nabi', fr: 'Mawlid al-Nabi' },
    description: {
      en: 'Observance of the birth of the Prophet Muhammad ﷺ.',
      fr: 'Célébration de la naissance du Prophète Muhammad ﷺ.',
    },
  },
  {
    id: 'ramadan-start',
    month: 9,
    day: 1,
    name: { en: '1st of Ramadan', fr: '1er Ramadan' },
    description: {
      en: 'The beginning of the blessed month of fasting.',
      fr: 'Le début du mois béni du jeûne.',
    },
  },
  {
    id: 'laylat-al-qadr',
    month: 9,
    day: 27,
    name: { en: 'Laylat al-Qadr', fr: 'Laylat al-Qadr' },
    description: {
      en: 'The Night of Decree, sought among the last ten nights of Ramadan.',
      fr: 'La Nuit du Destin, recherchée parmi les dix dernières nuits du Ramadan.',
    },
  },
  {
    id: 'eid-al-fitr',
    month: 10,
    day: 1,
    name: { en: 'Eid al-Fitr', fr: 'Aïd al-Fitr' },
    description: {
      en: 'The festival marking the end of Ramadan.',
      fr: 'La fête marquant la fin du Ramadan.',
    },
  },
  {
    id: 'tarwiyah',
    month: 12,
    day: 8,
    name: { en: 'Day of Tarwiyah', fr: 'Jour de Tarwiyah' },
    description: {
      en: 'Beginning of Hajj rites.',
      fr: 'Début des rites du Hajj.',
    },
  },
  {
    id: 'arafah',
    month: 12,
    day: 9,
    name: { en: 'Day of Arafah', fr: 'Jour d’Arafat' },
    description: {
      en: 'Best day for fasting (non-pilgrims).',
      fr: 'Le meilleur jour pour jeûner (non-pèlerins).',
    },
  },
  {
    id: 'eid-al-adha',
    month: 12,
    day: 10,
    name: { en: 'Eid al-Adha', fr: 'Aïd al-Adha' },
    description: {
      en: 'Festival of Sacrifice.',
      fr: 'La fête du Sacrifice.',
    },
  },
];

/** Lookup: does a (Hijri month, day) carry an event? */
export function eventOn(month: number, day: number): HijriEvent | undefined {
  return HIJRI_EVENTS.find((e) => e.month === month && e.day === day);
}

/** All events that fall within a given Hijri month, sorted by day. */
export function eventsInHijriMonth(month: number): HijriEvent[] {
  return HIJRI_EVENTS.filter((e) => e.month === month).sort((a, b) => a.day - b.day);
}

/** A computed upcoming occurrence of a recurring event. */
export interface UpcomingEvent extends HijriEvent {
  /** The resolved Gregorian date of the next occurrence. */
  gregorian: Date;
  /** Hijri parts at that Gregorian date. */
  hijri: HijriParts;
}

/** Add whole days to a date without mutating the input. */
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * For each recurring event, scan forward from `from` (default today) up to
 * `horizon` days, converting each Gregorian date to Hijri until the target
 * (month, day) matches. Returns occurrences sorted by soonest.
 */
export function computeUpcomingEvents(from: Date = new Date(), horizon = 400): UpcomingEvent[] {
  // Normalize to local midnight so "today" counts as the soonest.
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const results: UpcomingEvent[] = [];

  for (const event of HIJRI_EVENTS) {
    for (let offset = 0; offset <= horizon; offset++) {
      const candidate = addDays(start, offset);
      const h = toHijri(candidate);
      if (h.month === event.month && h.day === event.day) {
        results.push({ ...event, gregorian: candidate, hijri: h });
        break;
      }
    }
  }

  return results.sort((a, b) => a.gregorian.getTime() - b.gregorian.getTime());
}
