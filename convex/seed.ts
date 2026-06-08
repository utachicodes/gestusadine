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

    // If user doc already exists, just promote it.
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { role: "admin" });
      return { success: true, userId: existing._id, promoted: true };
    }

    // Clean up any stale authAccounts entry for this email that points to a
    // deleted user. Without this, createAccount calls createOrUpdateUser with
    // existingUserId pointing to a ghost row and returns { user: null }.
    const staleAccount = await ctx.db
      .query("authAccounts")
      .filter((q) =>
        q.and(
          q.eq(q.field("provider"), "password"),
          q.eq(q.field("providerAccountId"), args.email),
        ),
      )
      .first();

    if (staleAccount) {
      // Verify the linked user really doesn't exist before deleting.
      const linkedUser = await ctx.db.get(staleAccount.userId as any);
      if (!linkedUser) {
        await ctx.db.delete(staleAccount._id);
      }
    }

    // Create the auth account + user document via Convex Auth.
    const displayName = args.name ?? args.email.split("@")[0];
    const { user } = await createAccount(ctx, {
      provider: "password",
      account: { id: args.email, secret: args.password },
      profile: { email: args.email, name: displayName },
    });

    if (!user) {
      throw new ConvexError("Failed to create admin account — please try again.");
    }

    await ctx.db.patch(user._id, { role: "admin" });
    return { success: true, userId: user._id };
  },
});
