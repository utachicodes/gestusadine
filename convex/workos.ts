import { WorkOS } from "@workos-inc/node";
import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

const getWorkOS = () => {
  const apiKey = process.env.WORKOS_API_KEY;
  if (!apiKey) throw new Error("WORKOS_API_KEY is not set");
  return new WorkOS(apiKey);
};

export const sendVerificationEmail = action({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const workos = getWorkOS();

    // Create user in WorkOS to trigger verification email
    const { user: workosUser } = await workos.userManagement.createUser({
      email: args.email,
      emailVerified: false,
    });

    // Look up the Convex user by email and store the WorkOS ID
    const convexUser = await ctx.runQuery(internal.workos.lookupUserByEmail, {
      email: args.email,
    });
    if (convexUser) {
      await ctx.runMutation(internal.workos.storeWorkosId, {
        convexUserId: convexUser._id,
        workosId: workosUser.id,
      });
    }

    // Send the verification email
    await workos.userManagement.sendVerificationEmail({
      userId: workosUser.id,
    });

    return workosUser.id;
  },
});

export const lookupUserByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .first();
  },
});

export const storeWorkosId = internalMutation({
  args: {
    convexUserId: v.id("users"),
    workosId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.convexUserId, { workosId: args.workosId });
  },
});

export const verifyEmail = action({
  args: {
    code: v.string(),
    workosUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const workos = getWorkOS();

    const { user: workosUser } = await workos.userManagement.verifyEmail({
      userId: args.workosUserId,
      code: args.code,
    });

    // Update the Convex user's emailVerificationTime
    await ctx.runMutation(internal.workos.markEmailVerified, {
      workosId: workosUser.id,
    });

    return { verified: true };
  },
});

export const markEmailVerified = internalMutation({
  args: {
    workosId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("workosId", (q) => q.eq("workosId", args.workosId))
      .first();
    if (!user) throw new Error("User not found");
    await ctx.db.patch(user._id, { emailVerificationTime: Date.now() });
  },
});
