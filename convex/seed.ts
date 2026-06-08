import { mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { createAccount } from "@convex-dev/auth/server";

export const createAdmin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Only allow emails explicitly listed in ADMIN_EMAILS.
    const adminEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!adminEmails.includes(args.email.toLowerCase())) {
      throw new ConvexError("This email is not listed in ADMIN_EMAILS.");
    }

    // Self-disabling once any admin account exists — prevents account takeover.
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

    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      // Account exists but has no admin role yet — promote it.
      await ctx.db.patch(existing._id, { role: "admin" });
      return { success: true, userId: existing._id, promoted: true };
    }

    const { user } = await createAccount(ctx, {
      provider: "password",
      account: { id: args.email, secret: args.password },
      profile: {
        email: args.email,
        name: args.name ?? args.email.split("@")[0],
      },
    });

    await ctx.db.patch(user._id, { role: "admin" });
    return { success: true, userId: user._id, promoted: false };
  },
});
