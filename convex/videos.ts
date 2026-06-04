import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow, requireStaff } from "./authz";

export const list = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("videos");
    if (args.category) {
      q = q.withIndex("category", (idx) => idx.eq("category", args.category!));
    }
    return q.order("desc").take(50);
  },
});

export const getById = query({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    url: v.string(),
    thumbnail: v.optional(v.string()),
    duration: v.number(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireStaff(ctx);
    const now = Date.now();
    return ctx.db.insert("videos", {
      ...args,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("videos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    thumbnail: v.optional(v.string()),
    duration: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.delete(args.id);
  },
});

export const updateProgress = mutation({
  args: {
    videoId: v.id("videos"),
    progress: v.number(),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const existing = await ctx.db
      .query("mediaProgress")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("videoId"), args.videoId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        progress: args.progress,
        completed: args.completed,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("mediaProgress", {
        userId: user._id,
        videoId: args.videoId,
        progress: args.progress,
        completed: args.completed,
        updatedAt: Date.now(),
      });
    }
  },
});
