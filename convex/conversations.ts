import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./authz";

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    return await ctx.db
      .query("conversations")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const conv = await ctx.db.get(args.conversationId);
    if (!conv || conv.userId !== user._id) return [];
    return await ctx.db
      .query("messages")
      .withIndex("conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();
  },
});

export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();
    return await ctx.db.insert("conversations", {
      userId: user._id,
      title: args.title,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const addMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    confidence: v.optional(v.number()),
    sources: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const conv = await ctx.db.get(args.conversationId);
    if (!conv || conv.userId !== user._id) throw new Error("Conversation not found");
    const now = Date.now();
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: args.role,
      content: args.content,
      confidence: args.confidence,
      sources: args.sources,
      createdAt: now,
    });
    await ctx.db.patch(args.conversationId, { updatedAt: now });
  },
});

export const updateTitle = mutation({
  args: { conversationId: v.id("conversations"), title: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const conv = await ctx.db.get(args.conversationId);
    if (!conv || conv.userId !== user._id) throw new Error("Conversation not found");
    await ctx.db.patch(args.conversationId, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const conv = await ctx.db.get(args.conversationId);
    if (!conv || conv.userId !== user._id) throw new Error("Conversation not found");
    const messages = await ctx.db
      .query("messages")
      .withIndex("conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
    await ctx.db.delete(args.conversationId);
  },
});
