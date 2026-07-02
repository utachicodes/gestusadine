import { type Loc } from "@/lib/i18n";
export { stripTimeSuffix, toMinutes, addMinutes, to12h } from "@/lib/prayerHelpers";
export type { Loc };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AladhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface AladhanResponse {
  data: {
    timings: AladhanTimings;
  };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const DEFAULT_LAT = 14.4228;
export const DEFAULT_LNG = -16.9646;
export const DEFAULT_LOCATION_EN = "Mbour, Senegal";
export const DEFAULT_LOCATION_FR = "Mbour, Sénégal";

export const LS_METHOD_KEY = "prayerTimes_method";
export const LS_SCHOOL_KEY = "prayerTimes_school";

export const CALC_METHODS: { value: number; label: Loc }[] = [
  { value: 3, label: { en: "Muslim World League", fr: "Ligue mondiale islamique" } },
  { value: 2, label: { en: "ISNA (North America)", fr: "ISNA (Amérique du Nord)" } },
  { value: 5, label: { en: "Egyptian General Authority", fr: "Autorité générale d'Égypte" } },
  { value: 1, label: { en: "Karachi (HanafiUO)", fr: "Karachi (HanafiUO)" } },
  { value: 4, label: { en: "Umm al-Qura (Mecca)", fr: "Umm al-Qura (La Mecque)" } },
  { value: 12, label: { en: "UOIF (France)", fr: "UOIF (France)" } },
];

export const SCHOOLS: { value: number; label: Loc }[] = [
  { value: 0, label: { en: "Standard (Shafi'i / Maliki / Hanbali)", fr: "Standard (Shafi'i / Maliki / Hanbali)" } },
  { value: 1, label: { en: "Hanafi", fr: "Hanafi" } },
];

// ---------------------------------------------------------------------------
// Prayer helpers
// ---------------------------------------------------------------------------

export const FARD_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
export type FardPrayer = (typeof FARD_PRAYERS)[number];
