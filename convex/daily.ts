import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireStaff } from "./authz";

export const list = query({
  args: {
    contentType: v.optional(v.union(v.literal("ayah"), v.literal("hadith"), v.literal("dua"), v.literal("fact"))),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("dailyContent");
    if (args.contentType) {
      q = q.withIndex("date", (idx) => idx.eq("date", Date.now()));
    }
    return q.order("desc").take(50);
  },
});

export const getByDate = query({
  args: { date: v.number() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("dailyContent")
      .withIndex("date", (q) => q.eq("date", args.date))
      .order("desc")
      .take(10);
  },
});

export const create = mutation({
  args: {
    contentType: v.union(v.literal("ayah"), v.literal("hadith"), v.literal("dua"), v.literal("fact")),
    content: v.string(),
    source: v.string(),
    translation: v.optional(v.string()),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    return ctx.db.insert("dailyContent", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("dailyContent"),
    contentType: v.optional(v.union(v.literal("ayah"), v.literal("hadith"), v.literal("dua"), v.literal("fact"))),
    content: v.optional(v.string()),
    source: v.optional(v.string()),
    translation: v.optional(v.string()),
    date: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields });
  },
});

export const remove = mutation({
  args: { id: v.id("dailyContent") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.delete(args.id);
  },
});
