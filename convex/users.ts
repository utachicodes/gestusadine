import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
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
      throw new Error("Only admins can change roles");
    }
    await ctx.db.patch(args.userId, { role: args.role });
  },
});

export const getEmailVerificationStatus = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    if (!email) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
    if (!user) return null;
    return { verified: !!user.emailVerificationTime };
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
