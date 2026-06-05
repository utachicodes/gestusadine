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
    if (!process.env.WORKOS_API_KEY) {
      return null;
    }
    const workos = getWorkOS();
    const email = args.email.toLowerCase().trim();

    // Check if Convex user already has a WorkOS ID stored
    const convexUser = await ctx.runQuery(internal.workos.lookupUserByEmail, {
      email,
    });

    let workosUserId = convexUser?.workosId;

    if (!workosUserId) {
      // No WorkOS user yet — create one
      const { user: workosUser } = await workos.userManagement.createUser({
        email,
        emailVerified: false,
      });
      workosUserId = workosUser.id;

      // Store the WorkOS ID on the Convex user
      if (convexUser) {
        await ctx.runMutation(internal.workos.storeWorkosId, {
          convexUserId: convexUser._id,
          workosId: workosUserId,
        });
      }
    }

    // Send the verification email
    await workos.userManagement.sendVerificationEmail({
      userId: workosUserId,
    });

    return workosUserId;
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
