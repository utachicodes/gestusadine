import { describe, it, expect } from "vitest";
import {
  startOfDay,
  isToday,
  wasYesterday,
  isConsecutiveDay,
  areAllPrayersLogged,
  prayerCount,
  isAllSurahsRead,
  computeSurahXp,
  computeDailyGoalsXp,
  computeStreak,
  computeGoalsCompletion,
  XP_REWARDS,
} from "../lib/dailyGoals";

describe("startOfDay", () => {
  it("returns a timestamp at midnight", () => {
    const ts = new Date(2025, 5, 15, 14, 30, 45).getTime();
    const result = startOfDay(ts);
    const d = new Date(result);
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
    expect(d.getSeconds()).toBe(0);
  });
});

describe("isToday", () => {
  it("returns true for current time", () => {
    expect(isToday(Date.now())).toBe(true);
  });

  it("returns false for a date in the past", () => {
    expect(isToday(0)).toBe(false);
  });
});

describe("wasYesterday", () => {
  it("returns true for yesterday", () => {
    const yesterday = startOfDay(Date.now()) - 86_400_000;
    expect(wasYesterday(yesterday + 12 * 3600_000)).toBe(true);
  });

  it("returns false for today", () => {
    expect(wasYesterday(Date.now())).toBe(false);
  });

  it("returns false for two days ago", () => {
    const twoDaysAgo = startOfDay(Date.now()) - 2 * 86_400_000;
    expect(wasYesterday(twoDaysAgo)).toBe(false);
  });
});

describe("isConsecutiveDay", () => {
  it("returns true for consecutive days", () => {
    const day1 = new Date(2025, 5, 15).getTime();
    const day2 = new Date(2025, 5, 16).getTime();
    expect(isConsecutiveDay(day1, day2)).toBe(true);
  });

  it("returns true regardless of argument order", () => {
    const day1 = new Date(2025, 5, 15).getTime();
    const day2 = new Date(2025, 5, 16).getTime();
    expect(isConsecutiveDay(day2, day1)).toBe(true);
  });

  it("returns false for non-consecutive days", () => {
    const day1 = new Date(2025, 5, 15).getTime();
    const day3 = new Date(2025, 5, 17).getTime();
    expect(isConsecutiveDay(day1, day3)).toBe(false);
  });

  it("returns false for same day", () => {
    const day = new Date(2025, 5, 15).getTime();
    expect(isConsecutiveDay(day, day)).toBe(false);
  });
});

describe("areAllPrayersLogged", () => {
  it("returns true when all 5 prayers are logged", () => {
    expect(areAllPrayersLogged(["fajr", "dhuhr", "asr", "maghrib", "isha"])).toBe(true);
  });

  it("returns false when prayers are missing", () => {
    expect(areAllPrayersLogged(["fajr", "dhuhr"])).toBe(false);
  });

  it("returns false for empty array", () => {
    expect(areAllPrayersLogged([])).toBe(false);
  });

  it("returns true with extra entries", () => {
    expect(areAllPrayersLogged(["fajr", "dhuhr", "asr", "maghrib", "isha", "extra"])).toBe(true);
  });
});

describe("prayerCount", () => {
  it("counts recognized prayers only", () => {
    expect(prayerCount(["fajr", "asr", "extra"])).toBe(2);
  });

  it("returns 0 for empty input", () => {
    expect(prayerCount([])).toBe(0);
  });

  it("counts all 5 when all present", () => {
    expect(prayerCount(["fajr", "dhuhr", "asr", "maghrib", "isha"])).toBe(5);
  });
});

describe("isAllSurahsRead", () => {
  it("returns true when 114 surahs read", () => {
    const surahs = Array.from({ length: 114 }, (_, i) => i + 1);
    expect(isAllSurahsRead(surahs)).toBe(true);
  });

  it("returns false when fewer than 114", () => {
    expect(isAllSurahsRead([1, 2, 3])).toBe(false);
  });

  it("returns false for empty array", () => {
    expect(isAllSurahsRead([])).toBe(false);
  });
});

describe("computeSurahXp", () => {
  it("returns 15 XP for a new surah", () => {
    expect(computeSurahXp(true, false)).toBe(XP_REWARDS.NEW_SURAHS_READ);
  });

  it("returns 5 XP for re-read on a new day", () => {
    expect(computeSurahXp(false, false)).toBe(XP_REWARDS.RE_READ_SURAHS);
  });

  it("returns 0 XP for re-read on same day", () => {
    expect(computeSurahXp(false, true)).toBe(0);
  });
});

describe("computeDailyGoalsXp", () => {
  it("returns full XP when all goals met", () => {
    const xp = computeDailyGoalsXp({ prayersLogged: true, surahRead: true });
    expect(xp).toBe(XP_REWARDS.ALL_PRAYERS_LOGGED + XP_REWARDS.NEW_SURAHS_READ);
  });

  it("returns partial XP for prayers only", () => {
    expect(computeDailyGoalsXp({ prayersLogged: true, surahRead: false })).toBe(
      XP_REWARDS.ALL_PRAYERS_LOGGED
    );
  });

  it("returns partial XP for quran only", () => {
    expect(computeDailyGoalsXp({ prayersLogged: false, surahRead: true })).toBe(
      XP_REWARDS.NEW_SURAHS_READ
    );
  });

  it("returns 0 when no goals met", () => {
    expect(computeDailyGoalsXp({ prayersLogged: false, surahRead: false })).toBe(0);
  });
});

describe("computeStreak", () => {
  it("increments streak if last active was yesterday", () => {
    const yesterday = startOfDay(Date.now()) - 86_400_000;
    const result = computeStreak(yesterday, 5);
    expect(result.streak).toBe(6);
  });

  it("resets streak if last active was 2+ days ago", () => {
    const twoDaysAgo = startOfDay(Date.now()) - 2 * 86_400_000;
    const result = computeStreak(twoDaysAgo, 5);
    expect(result.streak).toBe(1);
  });

  it("keeps streak unchanged if already active today", () => {
    const result = computeStreak(Date.now(), 5);
    expect(result.streak).toBe(5);
  });

  it("starts streak at 1 for first-time user", () => {
    const result = computeStreak(undefined, 0);
    expect(result.streak).toBe(1);
  });
});

describe("computeGoalsCompletion", () => {
  it("detects all done when both goals met", () => {
    const result = computeGoalsCompletion({
      prayersLogged: ["fajr", "dhuhr", "asr", "maghrib", "isha"],
      surahsRead: [1],
    });
    expect(result.allDone).toBe(true);
    expect(result.completedCount).toBe(2);
  });

  it("detects incomplete when prayers missing", () => {
    const result = computeGoalsCompletion({
      prayersLogged: ["fajr"],
      surahsRead: [1],
    });
    expect(result.allDone).toBe(false);
    expect(result.prayersComplete).toBe(false);
    expect(result.quranComplete).toBe(true);
  });

  it("detects incomplete when no surah read", () => {
    const result = computeGoalsCompletion({
      prayersLogged: ["fajr", "dhuhr", "asr", "maghrib", "isha"],
      surahsRead: [],
    });
    expect(result.allDone).toBe(false);
    expect(result.prayersComplete).toBe(true);
    expect(result.quranComplete).toBe(false);
  });

  it("returns 0 completed when nothing done", () => {
    const result = computeGoalsCompletion({
      prayersLogged: [],
      surahsRead: [],
    });
    expect(result.completedCount).toBe(0);
    expect(result.totalGoals).toBe(2);
  });
});
