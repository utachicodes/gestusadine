import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getCurrentUserOrThrow, getCurrentUser } from "./authz";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const circles = await ctx.db.query("communityCircles").order("desc").take(50);
    const allMembers = await ctx.db.query("circleMembers").collect();
    const memberCounts: Record<string, number> = {};
    for (const m of allMembers) {
      memberCounts[m.circleId] = (memberCounts[m.circleId] ?? 0) + 1;
    }
    return circles.map((c) => ({
      ...c,
      memberCount: memberCounts[c._id] ?? 0,
    }));
  },
});

export const getById = query({
  args: { id: v.id("communityCircles") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    isPrivate: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const circleId = await ctx.db.insert("communityCircles", {
      name: args.name,
      description: args.description,
      createdBy: user._id,
      isPrivate: args.isPrivate,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    await ctx.db.insert("circleMembers", {
      circleId,
      userId: user._id,
      role: "admin",
      joinedAt: Date.now(),
    });
    return circleId;
  },
});

export const update = mutation({
  args: {
    id: v.id("communityCircles"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    isPrivate: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const circle = await ctx.db.get(args.id);
    if (!circle) throw new ConvexError("Circle not found");
    const isPlatformAdmin = user.role === "admin" || user.role === "system";
    if (circle.createdBy !== user._id && !isPlatformAdmin) {
      throw new ConvexError("You don't have permission to modify this circle.");
    }
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("communityCircles") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const circle = await ctx.db.get(args.id);
    if (!circle) throw new ConvexError("Circle not found");
    const isPlatformAdmin = user.role === "admin" || user.role === "system";
    if (circle.createdBy !== user._id && !isPlatformAdmin) {
      throw new ConvexError("You don't have permission to delete this circle.");
    }
    const members = await ctx.db.query("circleMembers").withIndex("circleId", (q) => q.eq("circleId", args.id)).collect();
    const posts = await ctx.db.query("circlePosts").withIndex("circleId", (q) => q.eq("circleId", args.id)).collect();
    for (const m of members) await ctx.db.delete(m._id);
    for (const p of posts) await ctx.db.delete(p._id);
    await ctx.db.delete(args.id);
  },
});

export const join = mutation({
  args: { circleId: v.id("communityCircles") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const existing = await ctx.db
      .query("circleMembers")
      .withIndex("circleId", (q) => q.eq("circleId", args.circleId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();
    if (existing) return { alreadyMember: true };
    await ctx.db.insert("circleMembers", {
      circleId: args.circleId,
      userId: user._id,
      role: "member",
      joinedAt: Date.now(),
    });
    return { alreadyMember: false };
  },
});

export const leave = mutation({
  args: { circleId: v.id("communityCircles") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const membership = await ctx.db
      .query("circleMembers")
      .withIndex("circleId", (q) => q.eq("circleId", args.circleId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();
    if (membership) await ctx.db.delete(membership._id);
  },
});

export const myCircles = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    const memberships = await ctx.db
      .query("circleMembers")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();
    const circles = await Promise.all(
      memberships.map((m) => ctx.db.get(m.circleId))
    );
    return circles.filter(Boolean);
  },
});

export const posts = query({
  args: { circleId: v.id("communityCircles") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("circlePosts")
      .withIndex("circleId", (q) => q.eq("circleId", args.circleId))
      .order("desc")
      .take(50);
  },
});

export const createPost = mutation({
  args: {
    circleId: v.id("communityCircles"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    return ctx.db.insert("circlePosts", {
      circleId: args.circleId,
      authorId: user._id,
      content: args.content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const deletePost = mutation({
  args: { id: v.id("circlePosts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const post = await ctx.db.get(args.id);
    if (!post) return;
    const circle = await ctx.db.get(post.circleId);
    const isPlatformAdmin = user.role === "admin" || user.role === "system";
    const isAuthor = post.authorId === user._id;
    const isCircleOwner = circle?.createdBy === user._id;
    if (!isAuthor && !isCircleOwner && !isPlatformAdmin) {
      throw new ConvexError("You don't have permission to delete this post.");
    }
    await ctx.db.delete(args.id);
  },
});

export const postsWithAuthors = query({
  args: { circleId: v.id("communityCircles") },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("circlePosts")
      .withIndex("circleId", (q) => q.eq("circleId", args.circleId))
      .order("desc")
      .take(50);
    return Promise.all(
      posts.map(async (p) => {
        const author = p.authorId ? await ctx.db.get(p.authorId) : null;
        return {
          ...p,
          authorName: author?.fullName ?? "Anonymous",
        };
      })
    );
  },
});

export const memberCount = query({
  args: { circleId: v.id("communityCircles") },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("circleMembers")
      .withIndex("circleId", (q) => q.eq("circleId", args.circleId))
      .collect();
    return members.length;
  },
});
