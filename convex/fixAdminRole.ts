import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const fix = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
    if (!user) return { fixed: false, reason: "not found" };
    await ctx.db.patch(user._id, { role: "admin" });
    return { fixed: true, userId: user._id };
  },
});
