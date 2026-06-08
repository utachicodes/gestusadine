import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getCurrentUserOrThrow, requireStaff } from "./authz";

export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("classes");
    if (args.category) {
      q = q.withIndex("category", (idx: any) => idx.eq("category", args.category!));
    }
    return q.order("desc").take(50);
  },
});

export const getById = query({
  args: { id: v.id("classes") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    instructor: v.string(),
    lessons: v.array(
      v.object({
        title: v.string(),
        content: v.string(),
        videoUrl: v.optional(v.string()),
        duration: v.number(),
      })
    ),
    imageUrl: v.optional(v.string()),
    price: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireStaff(ctx);
    return ctx.db.insert("classes", {
      ...args,
      enrolled: 0,
      rating: 0,
      createdBy: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("classes"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    instructor: v.optional(v.string()),
    lessons: v.optional(
      v.array(
        v.object({
          title: v.string(),
          content: v.string(),
          videoUrl: v.optional(v.string()),
          duration: v.number(),
        })
      )
    ),
    imageUrl: v.optional(v.string()),
    price: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("classes") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.delete(args.id);
  },
});

export const enroll = mutation({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx);
    const cls = await ctx.db.get(args.classId);
    if (!cls) throw new ConvexError("Class not found");
    await ctx.db.patch(args.classId, { enrolled: (cls.enrolled ?? 0) + 1 });
  },
});
