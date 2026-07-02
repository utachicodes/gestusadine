import { mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { api } from "./_generated/api";
import { requireAdmin } from "./authz";

// One-time fix: reset a specific user's XP to a correct value.
// Run via: npx convex run seed:resetXp --email "you@example.com" --xp 0
export const resetXp = mutation({
  args: { email: v.string(), xp: v.number() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email.toLowerCase()))
      .unique();
    if (!user) throw new ConvexError("User not found.");
    await ctx.db.patch(user._id, { xp: args.xp, lastActiveDate: undefined });
    return { reset: true, userId: user._id };
  },
});

export const createAdmin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!adminEmails.includes(args.email.toLowerCase())) {
      throw new ConvexError("This email is not listed in ADMIN_EMAILS.");
    }

    // Self-disabling once any admin account exists
    const existingAdmin = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(q.eq(q.field("role"), "admin"), q.eq(q.field("role"), "system")),
      )
      .first();

    if (existingAdmin) {
      throw new ConvexError(
        "An admin account already exists. Use the normal sign-in page.",
      );
    }

    // If user doc already exists, just promote it
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { role: "admin" });
      return { success: true, userId: existing._id, promoted: true };
    }

    // Create user with hashed password
    const userId = await ctx.runMutation(api.users.createUser, {
      email: args.email,
      name: args.name ?? args.email.split("@")[0],
      password: args.password,
    });

    // Promote to admin
    await ctx.db.patch(userId, { role: "admin" });
    return { success: true, userId };
  },
});
