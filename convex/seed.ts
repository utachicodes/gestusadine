import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { createAccount } from "@convex-dev/auth/server";

export const createAdmin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      return { success: false, message: `User ${args.email} already exists` };
    }

    const { user } = await createAccount(ctx, {
      provider: "password",
      account: { id: args.email, secret: args.password },
      profile: {
        email: args.email,
        name: args.name ?? args.email.split("@")[0],
      },
    });

    // Ensure admin role via ADMIN_EMAILS
    const adminEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (adminEmails.includes(args.email.toLowerCase())) {
      await ctx.db.patch(user._id, { role: "admin" });
    }

    return { success: true, userId: user._id };
  },
});
