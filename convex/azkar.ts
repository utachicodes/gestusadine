import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./authz";

function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}

export const listAzkarCategories = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("azkarCategories")
      .withIndex("sortOrder")
      .collect();
  },
});

export const listAzkar = query({
  args: {
    categoryId: v.optional(v.id("azkarCategories")),
  },
  handler: async (ctx, args) => {
    if (args.categoryId) {
      return ctx.db
        .query("azkar")
        .withIndex("categoryId", (q) => q.eq("categoryId", args.categoryId!))
        .collect();
    }
    return ctx.db.query("azkar").collect();
  },
});

export const logAzkarProgress = mutation({
  args: {
    azkarId: v.id("azkar"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const today = startOfDay(Date.now());

    const existing = await ctx.db
      .query("userAzkarProgress")
      .withIndex("userId_date", (q) =>
        q.eq("userId", user._id).eq("date", today),
      )
      .filter((q) => q.eq(q.field("azkarId"), args.azkarId))
      .first();

    const azkar = await ctx.db.get(args.azkarId);
    const maxCount = azkar?.repeatCount ?? 1;

    if (existing) {
      const newCount = Math.min(existing.count + 1, maxCount);
      await ctx.db.patch(existing._id, { count: newCount });
      return { count: newCount, completed: newCount >= maxCount };
    }

    await ctx.db.insert("userAzkarProgress", {
      userId: user._id,
      azkarId: args.azkarId,
      date: today,
      count: 1,
    });
    return { count: 1, completed: false };
  },
});

export const resetAzkarProgress = mutation({
  args: {
    azkarId: v.id("azkar"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const today = startOfDay(Date.now());

    const existing = await ctx.db
      .query("userAzkarProgress")
      .withIndex("userId_date", (q) =>
        q.eq("userId", user._id).eq("date", today),
      )
      .filter((q) => q.eq(q.field("azkarId"), args.azkarId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
    return { count: 0 };
  },
});

export const getTodayAzkarProgress = query({
  args: {
    categoryId: v.optional(v.id("azkarCategories")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const today = startOfDay(Date.now());

    if (args.categoryId) {
      const azkarList = await ctx.db
        .query("azkar")
        .withIndex("categoryId", (q) => q.eq("categoryId", args.categoryId!))
        .collect();

      const progress = await ctx.db
        .query("userAzkarProgress")
        .withIndex("userId_date", (q) =>
          q.eq("userId", user._id).eq("date", today),
        )
        .collect();

      const progressMap = new Map(progress.map((p) => [p.azkarId, p.count]));

      return azkarList.map((a) => ({
        ...a,
        currentCount: progressMap.get(a._id) ?? 0,
      }));
    }

    const allProgress = await ctx.db
      .query("userAzkarProgress")
      .withIndex("userId_date", (q) =>
        q.eq("userId", user._id).eq("date", today),
      )
      .collect();

    return allProgress;
  },
});

export const getAzkarStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return { totalCompleted: 0, categoriesCompleted: 0 };

    const today = startOfDay(Date.now());

    const progress = await ctx.db
      .query("userAzkarProgress")
      .withIndex("userId_date", (q) =>
        q.eq("userId", user._id).eq("date", today),
      )
      .collect();

    const allAzkar = await ctx.db.query("azkar").collect();
    const azkarMap = new Map(allAzkar.map((a) => [a._id, a.repeatCount]));

    let totalCompleted = 0;
    let categoriesCompleted = 0;

    for (const p of progress) {
      const required = azkarMap.get(p.azkarId) ?? 1;
      totalCompleted += Math.min(p.count, required);
      if (p.count >= required) categoriesCompleted += 1;
    }

    return { totalCompleted, categoriesCompleted };
  },
});
