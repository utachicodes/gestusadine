const DAY_MS = 86_400_000;

export function startOfDay(ms: number): number {
  return new Date(ms).setHours(0, 0, 0, 0);
}

export function isToday(timestamp: number): boolean {
  return startOfDay(timestamp) === startOfDay(Date.now());
}

export function wasYesterday(timestamp: number): boolean {
  const today = startOfDay(Date.now());
  const yesterday = today - DAY_MS;
  return startOfDay(timestamp) === yesterday;
}

export function isConsecutiveDay(a: number, b: number): boolean {
  const dayA = startOfDay(a);
  const dayB = startOfDay(b);
  return Math.abs(dayA - dayB) === DAY_MS;
}

export const FIVE_PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
export type PrayerName = (typeof FIVE_PRAYERS)[number];

export function areAllPrayersLogged(logged: string[]): boolean {
  return FIVE_PRAYERS.every((p) => logged.includes(p));
}

export function prayerCount(logged: string[]): number {
  return FIVE_PRAYERS.filter((p) => logged.includes(p)).length;
}

const TOTAL_SURAHS = 114;

export function isAllSurahsRead(completedSurahs: number[]): boolean {
  return completedSurahs.length >= TOTAL_SURAHS;
}

export const XP_REWARDS = {
  NEW_SURAHS_READ: 15,
  RE_READ_SURAHS: 5,
  DAILY_LOGIN: 10,
  ALL_PRAYERS_LOGGED: 25,
  QUIZ_PERFECT: 20,
} as const;

export function computeSurahXp(isNew: boolean, alreadyReadToday: boolean): number {
  if (isNew) return XP_REWARDS.NEW_SURAHS_READ;
  if (alreadyReadToday) return 0;
  return XP_REWARDS.RE_READ_SURAHS;
}

export function computeDailyGoalsXp(goals: {
  prayersLogged: boolean;
  surahRead: boolean;
}): number {
  let xp = 0;
  if (goals.prayersLogged) xp += XP_REWARDS.ALL_PRAYERS_LOGGED;
  if (goals.surahRead) xp += XP_REWARDS.NEW_SURAHS_READ;
  return xp;
}

export function computeStreak(
  lastActiveDate: number | undefined,
  currentStreak: number
): { streak: number; lastActiveDate: number } {
  const today = startOfDay(Date.now());
  const last = lastActiveDate ?? 0;

  if (last >= today) {
    return { streak: currentStreak, lastActiveDate: last };
  }

  const yesterday = today - DAY_MS;
  const newStreak = last >= yesterday ? currentStreak + 1 : 1;
  return { streak: newStreak, lastActiveDate: today };
}

export interface DailyGoalsState {
  prayersLogged: string[];
  surahsRead: number[];
}

export function computeGoalsCompletion(state: DailyGoalsState): {
  prayersComplete: boolean;
  quranComplete: boolean;
  allDone: boolean;
  completedCount: number;
  totalGoals: number;
} {
  const prayersComplete = areAllPrayersLogged(state.prayersLogged);
  const quranComplete = state.surahsRead.length > 0;
  const completedCount = (prayersComplete ? 1 : 0) + (quranComplete ? 1 : 0);
  return {
    prayersComplete,
    quranComplete,
    allDone: prayersComplete && quranComplete,
    completedCount,
    totalGoals: 2,
  };
}
