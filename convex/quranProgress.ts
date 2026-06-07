import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./authz";

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
    const completedSurahs = rec?.completedSurahs ?? [];
    return {
      completedSurahs,
      completedSurahCount: completedSurahs.length,
      totalSurahs: TOTAL_SURAHS,
      streak: rec?.streak ?? 0,
      lastReadDate: rec?.lastReadDate,
    };
  },
});

// Auto-called when a surah is opened in the reader — marks it as read
// (idempotent) and advances the reading streak. No manual marking required.
export const recordSurahRead = mutation({
  args: { surah: v.number() },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const surah = Math.floor(args.surah);
    if (surah < 1 || surah > TOTAL_SURAHS) return;

    const rec = await ctx.db
      .query("quranProgress")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .unique();
    const { streak, lastReadDate } = bumpStreak(rec);
    const current = rec?.completedSurahs ?? [];
    const completedSurahs = current.includes(surah) ? current : [...current, surah];

    if (rec) {
      await ctx.db.patch(rec._id, { completedSurahs, streak, lastReadDate, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("quranProgress", {
        userId: user._id,
        currentPage: 0,
        completedSurahs,
        streak,
        lastReadDate,
        updatedAt: Date.now(),
      });
    }
  },
});
