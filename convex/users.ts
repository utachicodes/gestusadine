import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getCurrentUserOrThrow, getCurrentUser } from "./authz";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    return getCurrentUser(ctx);
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx);
    return ctx.db.get(args.userId);
  },
});

export const updateProfile = mutation({
  args: {
    fullName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const patch: Record<string, any> = {};
    if (args.fullName !== void 0) patch.fullName = args.fullName;
    if (args.avatarUrl !== void 0) patch.avatarUrl = args.avatarUrl;
    await ctx.db.patch(user._id, patch);
  },
});

export const updateSubscriptionTier = mutation({
  args: {
    tier: v.union(v.literal("free"), v.literal("student"), v.literal("pro")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    // Self-service tier changes are a paid-feature bypass. The real upgrade path
    // is the NabooPay webhook -> internal confirmPayment mutation. Allow direct
    // changes only for platform admins, or on a dev deployment that explicitly
    // opts in (used by the DEV-only tier switcher in Settings).
    const isPlatformAdmin = user.role === "admin" || user.role === "system";
    const devSwitchEnabled = process.env.ALLOW_SELF_TIER_SWITCH === "true";
    if (!isPlatformAdmin && !devSwitchEnabled) {
      throw new ConvexError("Subscription tier can only be changed through checkout.");
    }
    await ctx.db.patch(user._id, { subscriptionTier: args.tier });
  },
});

export const setRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("moderator"), v.literal("admin"), v.literal("system")),
  },
  handler: async (ctx, args) => {
    const caller = await getCurrentUserOrThrow(ctx);
    if (caller.role !== "admin" && caller.role !== "system") {
      throw new ConvexError("You don't have permission to do that.");
    }
    await ctx.db.patch(args.userId, { role: args.role });
  },
});

export const checkEmailExists = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    if (!email) return false;
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
    return user !== null;
  },
});
