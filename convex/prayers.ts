import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./authz";

const DAY_MS = 86_400_000;

const prayerArg = v.union(
  v.literal("fajr"),
  v.literal("dhuhr"),
  v.literal("asr"),
  v.literal("maghrib"),
  v.literal("isha"),
);

function startOfDay(ms: number): number {
  return new Date(ms).setHours(0, 0, 0, 0);
}

// Which prayers the signed-in user has logged today.
export const getToday = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    const date = startOfDay(Date.now());
    if (!user) return { date, logged: [] as string[] };
    const rows = await ctx.db
      .query("prayerLogs")
      .withIndex("userId_date", (q) => q.eq("userId", user._id).eq("date", date))
      .collect();
    return { date, logged: rows.map((r) => r.prayer) };
  },
});

// Mark/unmark a prayer for today (idempotent toggle).
export const togglePrayer = mutation({
  args: { prayer: prayerArg },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const date = startOfDay(Date.now());
    const existing = await ctx.db
      .query("prayerLogs")
      .withIndex("userId_date", (q) => q.eq("userId", user._id).eq("date", date))
      .filter((q) => q.eq(q.field("prayer"), args.prayer))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
      return { logged: false };
    }
    await ctx.db.insert("prayerLogs", {
      userId: user._id,
      prayer: args.prayer,
      date,
      createdAt: Date.now(),
    });
    return { logged: true };
  },
});

// Aggregate stats for the dashboard: today's count, streak of perfect (5/5)
// days, total perfect days, total prayers logged, and a 7-day history.
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const today = startOfDay(Date.now());
    const cutoff = today - 90 * DAY_MS;
    const rows = await ctx.db
      .query("prayerLogs")
      .withIndex("userId_date", (q) => q.eq("userId", user._id).gte("date", cutoff))
      .collect();

    const counts = new Map<number, number>();
    for (const r of rows) counts.set(r.date, (counts.get(r.date) ?? 0) + 1);

    const perfectDays = [...counts.values()].filter((c) => c >= 5).length;
    const todayCount = counts.get(today) ?? 0;

    // Streak: consecutive days with all 5 logged, ending today (if already
    // complete) or yesterday (today still in progress).
    let streak = 0;
    let cursor = todayCount >= 5 ? today : today - DAY_MS;
    while ((counts.get(cursor) ?? 0) >= 5) {
      streak += 1;
      cursor -= DAY_MS;
    }

    const history: { date: number; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = today - i * DAY_MS;
      history.push({ date: d, count: counts.get(d) ?? 0 });
    }

    return { todayCount, streak, perfectDays, totalLogged: rows.length, history };
  },
});
