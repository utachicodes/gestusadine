import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow, requireStaff } from "./authz";

export const list = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("libraryBooks");
    if (args.category) {
      q = q.withIndex("category", (idx) => idx.eq("category", args.category!));
    }
    return q.order("desc").take(50);
  },
});

export const getById = query({
  args: { id: v.id("libraryBooks") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const create = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    description: v.string(),
    category: v.string(),
    language: v.string(),
    format: v.string(),
    fileUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    pages: v.number(),
    fileSizeMb: v.optional(v.number()),
    featured: v.boolean(),
    premium: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireStaff(ctx);
    const now = Date.now();
    return ctx.db.insert("libraryBooks", {
      ...args,
      downloads: 0,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("libraryBooks"),
    title: v.optional(v.string()),
    author: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    language: v.optional(v.string()),
    format: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    pages: v.optional(v.number()),
    fileSizeMb: v.optional(v.number()),
    featured: v.optional(v.boolean()),
    premium: v.optional(v.boolean()),
    downloads: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("libraryBooks") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return ctx.storage.generateUploadUrl();
  },
});

export const saveUploadedFile = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("File not found in storage");
    return { url, storageId: args.storageId };
  },
});
