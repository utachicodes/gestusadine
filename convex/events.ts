import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow, requireStaff } from "./authz";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("events").order("desc").take(50);
  },
});

export const getById = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    date: v.number(),
    location: v.string(),
    image: v.optional(v.string()),
    category: v.string(),
    capacity: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireStaff(ctx);
    const now = Date.now();
    return ctx.db.insert("events", {
      ...args,
      registered: 0,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    date: v.optional(v.number()),
    location: v.optional(v.string()),
    image: v.optional(v.string()),
    category: v.optional(v.string()),
    capacity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.delete(args.id);
  },
});

export const myRegistrations = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    const regs = await ctx.db
      .query("eventRegistrations")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();
    return regs.map((r) => r.eventId);
  },
});

export const register = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new ConvexError("This event no longer exists.");
    if (event.registered >= event.capacity) throw new ConvexError("This event is full.");

    const existing = await ctx.db
      .query("eventRegistrations")
      .withIndex("eventId", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (existing) throw new ConvexError("You're already registered for this event.");

    await ctx.db.insert("eventRegistrations", {
      eventId: args.eventId,
      userId: user._id,
      registeredAt: Date.now(),
    });
    await ctx.db.patch(args.eventId, { registered: event.registered + 1 });
  },
});
