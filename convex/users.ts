import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getCurrentUserOrThrow, getCurrentUser } from "./authz";
import { rateLimiter } from "./rateLimiter";

const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const HASH_ALGORITHM = "PBKDF2";
const DIGEST_ALGORITHM = "SHA-256";

async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const encoder = new TextEncoder();
  const saltBytes = salt
    ? Uint8Array.from(atob(salt), (c) => c.charCodeAt(0))
    : crypto.getRandomValues(new Uint8Array(16));

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: HASH_ALGORITHM },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    { name: HASH_ALGORITHM, salt: saltBytes, iterations: ITERATIONS, hash: DIGEST_ALGORITHM },
    key,
    KEY_LENGTH * 8
  );

  const hashArray = new Uint8Array(derivedBits);
  const saltArray = new Uint8Array(saltBytes);

  return {
    hash: btoa(String.fromCharCode(...hashArray)),
    salt: btoa(String.fromCharCode(...saltArray)),
  };
}

async function verifyPassword(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
  const { hash } = await hashPassword(password, storedSalt);
  return hash === storedHash;
}

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

    let passwordHash: string | undefined;
    let passwordSalt: string | undefined;

    if (args.password) {
      const result = await hashPassword(args.password);
      passwordHash = result.hash;
      passwordSalt = result.salt;
    }

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
      passwordHash,
      passwordSalt,
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
    const email = args.email.toLowerCase().trim();
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      throw new ConvexError("Invalid email or password.");
    }

    // User has proper password hash — verify it
    if (user.passwordHash && user.passwordSalt) {
      const valid = await verifyPassword(args.password, user.passwordHash, user.passwordSalt);
      if (!valid) {
        throw new ConvexError("Invalid email or password.");
      }
      return user._id;
    }

    // Migration: user has no hash — check if they have a legacy plainPassword
    // stored in the database (field removed from schema but data persists)
    const raw = await ctx.db.get(user._id) as Record<string, unknown> | null;
    const legacyPassword = raw?.plainPassword as string | undefined;

    if (legacyPassword && legacyPassword === args.password) {
      // Migrate: hash the password and store properly
      const result = await hashPassword(args.password);
      await ctx.db.patch(user._id, {
        passwordHash: result.hash,
        passwordSalt: result.salt,
      });
      return user._id;
    }

    throw new ConvexError("Invalid email or password.");
  },
});
