import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./authz";
import { rateLimiter } from "./rateLimiter";

const RANK_THRESHOLDS = [
  { rank: "Talib", minXp: 0 },
  { rank: "Murid", minXp: 100 },
  { rank: "Bahith", minXp: 500 },
  { rank: "Alim", minXp: 1000 },
  { rank: "Faqih", minXp: 2500 },
] as const;

export type Rank = (typeof RANK_THRESHOLDS)[number]["rank"];

function computeRank(xp: number): Rank {
  let current: Rank = "Talib";
  for (const r of RANK_THRESHOLDS) {
    if (xp >= r.minXp) current = r.rank as Rank;
  }
  return current;
}

function nextRankThreshold(xp: number): number {
  for (const r of RANK_THRESHOLDS) {
    if (xp < r.minXp) return r.minXp;
  }
  return RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1].minXp;
}

export const myStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const xp = user.xp ?? 0;
    const streak = user.streak ?? 0;
    const rank = computeRank(xp);
    const nextThreshold = nextRankThreshold(xp);
    const quizzesTaken = await ctx.db
      .query("quizAttempts")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();

    const perfectScores = quizzesTaken.filter((a) => a.correct).length;

    return {
      xp,
      streak,
      rank,
      nextRankThreshold: nextThreshold,
      progressToNext: nextThreshold > 0 ? Math.min(1, xp / nextThreshold) : 1,
      quizzesTaken: quizzesTaken.length,
      perfectScores,
    };
  },
});

export const leaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    // Authenticated users only — and never expose email addresses as the
    // display name (PII leak). Fall back to a privacy-safe label instead.
    const viewer = await getCurrentUser(ctx);
    if (!viewer) return [];

    // Take top 200 and sort in memory — avoids loading entire users collection.
    // A proper XP index would allow server-side sort, but Convex doesn't support
    // range index ordering on arbitrary fields without a dedicated table.
    const users = await ctx.db.query("users").take(5000);
    return users
      .filter((u) => (u.xp ?? 0) > 0)
      .sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0))
      .slice(0, Math.min(args.limit ?? 50, 100))
      .map((u) => ({
        // userId intentionally omitted — prevents cross-referencing to accounts.
        displayName: u.fullName ?? u.name ?? "Anonymous",
        xp: u.xp ?? 0,
        rank: computeRank(u.xp ?? 0),
        isMe: u._id === viewer._id,
      }));
  },
});

export const awardXp = mutation({
  args: {
    amount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate: positive, capped at 500 per call, reason max 200 chars.
    if (!Number.isFinite(args.amount) || args.amount <= 0 || args.amount > 500) {
      throw new ConvexError("XP amount must be between 1 and 500.");
    }
    if (args.reason.length > 200) {
      throw new ConvexError("Reason must be 200 characters or fewer.");
    }
    const user = await getCurrentUserOrThrow(ctx);
    await rateLimiter.limit(ctx, "xpAward", { key: user._id, throws: true });
    const currentXp = user.xp ?? 0;
    await ctx.db.patch(user._id, { xp: currentXp + args.amount });
    await ctx.db.insert("userActivity", {
      userId: user._id,
      activityType: "xp_awarded",
      metadata: { amount: args.amount, reason: args.reason, totalXp: currentXp + args.amount },
      createdAt: Date.now(),
    });
  },
});

export const recordDailyActivity = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();
    const today = new Date(now).setHours(0, 0, 0, 0);
    const lastActive = user.lastActiveDate ?? 0;

    // Already recorded today — do nothing. This prevents re-awarding XP
    // every time the dashboard mounts.
    if (lastActive >= today) return;

    const yesterday = today - 86_400_000;
    let streak = user.streak ?? 0;
    if (lastActive >= yesterday) {
      streak += 1;
    } else {
      streak = 1;
    }

    await ctx.db.patch(user._id, {
      streak,
      lastActiveDate: now,
      xp: (user.xp ?? 0) + 10,
    });
  },
});
