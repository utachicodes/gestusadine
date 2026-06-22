import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getCurrentUserOrThrow, getCurrentUser } from "./authz";
import { rateLimiter } from "./rateLimiter";

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
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    // Only return display-safe fields — never email, phone, gender, or
    // verification timestamps to prevent full-DB PII enumeration.
    return {
      _id: user._id,
      fullName: user.fullName,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
  },
});

export const updateProfile = mutation({
  args: {
    fullName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    if (args.fullName !== undefined && args.fullName.length > 150)
      throw new ConvexError("Display name must be 150 characters or fewer.");
    if (args.avatarUrl !== undefined && args.avatarUrl.length > 600)
      throw new ConvexError("Avatar URL is too long.");
    const patch: Record<string, any> = {};
    if (args.fullName !== void 0) patch.fullName = args.fullName;
    if (args.avatarUrl !== void 0) patch.avatarUrl = args.avatarUrl;
    await ctx.db.patch(user._id, patch);
  },
});

export const updateGender = mutation({
  args: {
    gender: v.union(v.literal("male"), v.literal("female")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    await ctx.db.patch(user._id, { gender: args.gender });
  },
});

export const setOnboardingCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    await ctx.db.patch(user._id, { onboardingCompleted: true });
  },
});

export const updateSubscriptionTier = mutation({
  args: {
    tier: v.union(v.literal("free"), v.literal("student"), v.literal("pro")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    // Admin-only. The real upgrade path for all other users is the NabooPay
    // webhook → internal confirmPayment. The ALLOW_SELF_TIER_SWITCH flag has
    // been removed — it was a privilege-escalation risk if the env var leaked
    // to production.
    if (user.role !== "admin" && user.role !== "system") {
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
    // Prevent self-role modification (accidental de-privileging or elevation).
    if (args.userId === caller._id) {
      throw new ConvexError("You cannot change your own role.");
    }
    // Protect system accounts from being modified by non-system callers.
    const target = await ctx.db.get(args.userId);
    if (target?.role === "system" && caller.role !== "system") {
      throw new ConvexError("Only system accounts can modify another system account.");
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

export const prepareSignup = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
    if (existing) {
      throw new ConvexError("An account with this email already exists.");
    }
  },
});

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"))),
    plainPassword: v.optional(v.string()),
    authProvider: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();
    if (existing) {
      return existing._id;
    }

    await rateLimiter.limit(ctx, "signUp");

    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      fullName: args.name,
      image: args.image,
      role: "user",
      subscriptionTier: "free",
      isAnonymous: false,
      gender: args.gender,
      onboardingCompleted: false,
      plainPassword: args.plainPassword,
      authProvider: args.authProvider,
    });
    return userId;
  },
});
