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
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const patch: Record<string, unknown> = {};
    if (args.fullName !== undefined) patch.fullName = args.fullName;
    if (args.name !== undefined) patch.name = args.name;
    if (args.avatarUrl !== undefined) patch.avatarUrl = args.avatarUrl;
    if (args.gender !== undefined) patch.gender = args.gender;
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

export const setRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("moderator"), v.literal("admin"), v.literal("system")),
  },
  handler: async (ctx, args) => {
    const caller = await getCurrentUserOrThrow(ctx);
    const isAdmin = caller.role === "admin" || caller.role === "system";
    if (!isAdmin) {
      throw new ConvexError("Only admins can change roles.");
    }
    const target = await ctx.db.get(args.userId);
    if (!target) throw new ConvexError("User not found.");
    if ((target.role === "system") && caller.role !== "system") {
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

export const getUserIdByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
    return user?._id ?? null;
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
    password: v.optional(v.string()),
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
      plainPassword: args.password,
      authProvider: args.authProvider ?? "credentials",
    });
    return userId;
  },
});

export const verifyUserPassword = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Rate-limit password attempts to prevent brute-force attacks
    await rateLimiter.limit(ctx, "failedLogins");

    const email = args.email.toLowerCase().trim();
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    if (!user || user.plainPassword !== args.password) {
      throw new ConvexError("Invalid email or password.");
    }

    return user._id;
  },
});
