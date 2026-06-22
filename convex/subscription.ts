import { query, internalMutation, internalQuery } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./authz";

const HOURLY_LIMIT = 5;
const DAILY_LIMIT = 20;

function currentHour(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}-${String(d.getHours()).padStart(2, "0")}`;
}

function currentDay(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const getMySubscription = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const hour = currentHour();
    const day = currentDay();

    const hourlyRec = await ctx.db
      .query("subscriptionUsage")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("period"), `hour:${hour}`))
      .unique();

    const dailyRec = await ctx.db
      .query("subscriptionUsage")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("period"), `day:${day}`))
      .unique();

    const hourlyUsed = hourlyRec?.queriesUsed ?? 0;
    const dailyUsed = dailyRec?.queriesUsed ?? 0;

    return {
      hourlyUsed,
      hourlyLimit: HOURLY_LIMIT,
      hourlyRemaining: Math.max(0, HOURLY_LIMIT - hourlyUsed),
      dailyUsed,
      dailyLimit: DAILY_LIMIT,
      dailyRemaining: Math.max(0, DAILY_LIMIT - dailyUsed),
      canAskCouncil: hourlyUsed < HOURLY_LIMIT && dailyUsed < DAILY_LIMIT,
    };
  },
});

export const checkCouncilQuota = internalQuery({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);

    const hour = currentHour();
    const day = currentDay();

    const hourlyRec = await ctx.db
      .query("subscriptionUsage")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("period"), `hour:${hour}`))
      .unique();

    const dailyRec = await ctx.db
      .query("subscriptionUsage")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("period"), `day:${day}`))
      .unique();

    const hourlyUsed = hourlyRec?.queriesUsed ?? 0;
    const dailyUsed = dailyRec?.queriesUsed ?? 0;

    if (hourlyUsed >= HOURLY_LIMIT) {
      throw new ConvexError(`You've reached the hourly limit of ${HOURLY_LIMIT} questions. Please wait a moment.`);
    }
    if (dailyUsed >= DAILY_LIMIT) {
      throw new ConvexError(`You've reached the daily limit of ${DAILY_LIMIT} questions. Come back tomorrow, in sha Allah.`);
    }
  },
});

export const incrementCouncilUsage = internalMutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);

    const hour = currentHour();
    const day = currentDay();

    // Increment hourly
    const hourlyRec = await ctx.db
      .query("subscriptionUsage")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("period"), `hour:${hour}`))
      .unique();

    if (hourlyRec) {
      await ctx.db.patch(hourlyRec._id, { queriesUsed: hourlyRec.queriesUsed + 1 });
    } else {
      await ctx.db.insert("subscriptionUsage", { userId: user._id, period: `hour:${hour}`, queriesUsed: 1 });
    }

    // Increment daily
    const dailyRec = await ctx.db
      .query("subscriptionUsage")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("period"), `day:${day}`))
      .unique();

    if (dailyRec) {
      await ctx.db.patch(dailyRec._id, { queriesUsed: dailyRec.queriesUsed + 1 });
    } else {
      await ctx.db.insert("subscriptionUsage", { userId: user._id, period: `day:${day}`, queriesUsed: 1 });
    }
  },
});
