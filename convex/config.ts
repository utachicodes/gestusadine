import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireStaff } from "./authz";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("agentConfig").order("desc").take(50);
  },
});

export const getById = query({
  args: { agentId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("agentConfig")
      .withIndex("agentId", (q) => q.eq("agentId", args.agentId))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    agentId: v.string(),
    name: v.string(),
    provider: v.string(),
    model: v.string(),
    temperature: v.number(),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireStaff(ctx);
    const existing = await ctx.db
      .query("agentConfig")
      .withIndex("agentId", (q) => q.eq("agentId", args.agentId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedBy: user._id,
        updatedAt: Date.now(),
      });
      return existing._id;
    }
    return ctx.db.insert("agentConfig", {
      ...args,
      updatedBy: user._id,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("agentConfig") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.delete(args.id);
  },
});
