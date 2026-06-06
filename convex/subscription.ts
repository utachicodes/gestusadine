import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./authz";

type Tier = "free" | "student" | "pro";

const TIER_RANK: Record<Tier, number> = { free: 0, student: 1, pro: 2 };

const TIER_CREDITS: Record<Tier, number> = {
  free: 15,
  student: 500,
  pro: -1,
};

export function currentPeriod(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function effectiveTier(tier: Tier | undefined, role: string | undefined): Tier {
  if (role === "admin" || role === "system") return "pro";
  return tier ?? "free";
}

export const getMySubscription = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const tier = effectiveTier(user.subscriptionTier as Tier, user.role);
    const period = currentPeriod();
    const usageRec = await ctx.db
      .query("subscriptionUsage")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("period"), period))
      .unique();

    const used = usageRec?.queriesUsed ?? 0;
    const limit = TIER_CREDITS[tier];
    const unlimited = limit === -1;

    return {
      tier,
      used,
      limit,
      unlimited,
      remaining: unlimited ? Infinity : Math.max(0, limit - used),
      period,
      fairUse: tier === "student" || tier === "pro",
      canAskCouncil: unlimited || used < limit,
    };
  },
});

export const recordCouncilQuery = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const period = currentPeriod();
    const tier = effectiveTier(user.subscriptionTier as Tier, user.role);
    const limit = TIER_CREDITS[tier];

    if (limit !== -1) {
      const existing = await ctx.db
        .query("subscriptionUsage")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .filter((q) => q.eq(q.field("period"), period))
        .unique();

      const used = existing?.queriesUsed ?? 0;
      if (used >= limit) throw new Error("Monthly council query limit reached");
    }

    const existing = await ctx.db
      .query("subscriptionUsage")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("period"), period))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { queriesUsed: existing.queriesUsed + 1 });
    } else {
      await ctx.db.insert("subscriptionUsage", {
        userId: user._id,
        period,
        queriesUsed: 1,
      });
    }

    return { success: true };
  },
});
