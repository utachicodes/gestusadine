import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./authz";

const TOTAL_PAGES = 604; // standard Madani mushaf
const TOTAL_SURAHS = 114;
const DAY_MS = 86_400_000;

function startOfDay(ms: number): number {
  return new Date(ms).setHours(0, 0, 0, 0);
}

// Advance the reading streak: +1 if last read was yesterday, reset to 1 if the
// chain was broken, unchanged if already read today.
function bumpStreak(rec: { streak?: number; lastReadDate?: number } | null) {
  const today = startOfDay(Date.now());
  const last = rec?.lastReadDate ?? 0;
  let streak = rec?.streak ?? 0;
  if (last < today) {
    streak = last >= today - DAY_MS ? streak + 1 : 1;
  }
  return { streak, lastReadDate: today };
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    const rec = await ctx.db
      .query("quranProgress")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .unique();

    const currentPage = rec?.currentPage ?? 0;
    const completedSurahs = rec?.completedSurahs ?? [];
    return {
      currentPage,
      totalPages: TOTAL_PAGES,
      pagePercent: Math.round((currentPage / TOTAL_PAGES) * 100),
      completedSurahs,
      completedSurahCount: completedSurahs.length,
      totalSurahs: TOTAL_SURAHS,
      surahPercent: Math.round((completedSurahs.length / TOTAL_SURAHS) * 100),
      streak: rec?.streak ?? 0,
      lastReadDate: rec?.lastReadDate,
    };
  },
});

// Set the reading bookmark (furthest page reached).
export const setPage = mutation({
  args: { page: v.number() },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const page = Math.max(0, Math.min(TOTAL_PAGES, Math.floor(args.page)));
    const rec = await ctx.db
      .query("quranProgress")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .unique();
    const { streak, lastReadDate } = bumpStreak(rec);
    if (rec) {
      await ctx.db.patch(rec._id, { currentPage: page, streak, lastReadDate, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("quranProgress", {
        userId: user._id,
        currentPage: page,
        completedSurahs: [],
        streak,
        lastReadDate,
        updatedAt: Date.now(),
      });
    }
  },
});

// Mark/unmark a surah as completed.
export const toggleSurah = mutation({
  args: { surah: v.number() },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const surah = Math.floor(args.surah);
    if (surah < 1 || surah > TOTAL_SURAHS) throw new ConvexError("Invalid surah number.");
    const rec = await ctx.db
      .query("quranProgress")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .unique();
    const { streak, lastReadDate } = bumpStreak(rec);
    const current = rec?.completedSurahs ?? [];
    const next = current.includes(surah)
      ? current.filter((s) => s !== surah)
      : [...current, surah];
    if (rec) {
      await ctx.db.patch(rec._id, { completedSurahs: next, streak, lastReadDate, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("quranProgress", {
        userId: user._id,
        currentPage: 0,
        completedSurahs: next,
        streak,
        lastReadDate,
        updatedAt: Date.now(),
      });
    }
  },
});
