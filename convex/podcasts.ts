import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./authz";

export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("podcasts");
    if (args.category) {
      q = q.withIndex("category", (idx: any) => idx.eq("category", args.category!));
    }
    return q.order("desc").take(50);
  },
});

export const getById = query({
  args: { id: v.id("podcasts") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    audioUrl: v.string(),
    coverUrl: v.optional(v.string()),
    duration: v.number(),
    category: v.string(),
    guestName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    return ctx.db.insert("podcasts", {
      ...args,
      plays: 0,
      createdBy: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("podcasts"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    audioUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    duration: v.optional(v.number()),
    category: v.optional(v.string()),
    guestName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("podcasts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const recordPlay = mutation({
  args: { id: v.id("podcasts") },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.id);
    if (podcast) {
      await ctx.db.patch(args.id, { plays: (podcast.plays ?? 0) + 1 });
    }
  },
});
