import { query, internalMutation, internalQuery } from "./_generated/server";
import { ConvexError } from "convex/values";
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

// Internal — called by the chat action BEFORE generating. Throws when the
// caller is over their monthly limit. Not exposed to the client, so usage can't
// be bypassed by skipping a client-side call.
export const checkCouncilQuota = internalQuery({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const tier = effectiveTier(user.subscriptionTier as Tier, user.role);
    const limit = TIER_CREDITS[tier];
    if (limit === -1) return; // unlimited

    const period = currentPeriod();
    const existing = await ctx.db
      .query("subscriptionUsage")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("period"), period))
      .unique();

    const used = existing?.queriesUsed ?? 0;
    if (used >= limit) {
      throw new ConvexError("You've reached your monthly question limit. Upgrade for more.");
    }
  },
});

// Internal — called by the chat action AFTER a successful answer. Only
// successful responses are charged against the quota.
export const incrementCouncilUsage = internalMutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const tier = effectiveTier(user.subscriptionTier as Tier, user.role);
    if (TIER_CREDITS[tier] === -1) return; // unlimited — no need to track

    const period = currentPeriod();
    const existing = await ctx.db
      .query("subscriptionUsage")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("period"), period))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { queriesUsed: existing.queriesUsed + 1 });
    } else {
      await ctx.db.insert("subscriptionUsage", { userId: user._id, period, queriesUsed: 1 });
    }
  },
});
