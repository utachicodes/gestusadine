import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./authz";

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}

// ── Queries ──────────────────────────────────────────────────────────────────

export const getEntries = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    return ctx.db
      .query("journalEntries")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const getEntryByDate = query({
  args: { date: v.number() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    const day = startOfDay(args.date);
    return ctx.db
      .query("journalEntries")
      .withIndex("userId_entryDate", (q) => q.eq("userId", user._id).eq("entryDate", day))
      .first();
  },
});

export const getTodayEntry = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    const today = startOfDay(Date.now());
    return ctx.db
      .query("journalEntries")
      .withIndex("userId_entryDate", (q) => q.eq("userId", user._id).eq("entryDate", today))
      .first();
  },
});

// Returns the current writing streak (consecutive days with at least one entry).
export const getStreak = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return 0;
    const entries = await ctx.db
      .query("journalEntries")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(400);

    if (entries.length === 0) return 0;

    // Deduplicate by entryDate
    const daySet = new Set(entries.map((e) => e.entryDate));
    const today = startOfDay(Date.now());

    let streak = 0;
    let current = today;

    while (daySet.has(current)) {
      streak++;
      current -= 86400000; // subtract one day in ms
    }
    return streak;
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return { total: 0, streak: 0, moodCounts: {}, tagCounts: {} };
    const entries = await ctx.db
      .query("journalEntries")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(400);

    const total = entries.length;
    const moodCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};

    for (const e of entries) {
      if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] ?? 0) + 1;
      for (const tag of e.tags ?? []) {
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      }
    }

    // Compute streak
    const daySet = new Set(entries.map((e) => e.entryDate));
    const today = startOfDay(Date.now());
    let streak = 0;
    let cur = today;
    while (daySet.has(cur)) { streak++; cur -= 86400000; }

    return { total, streak, moodCounts, tagCounts };
  },
});

// Returns dates (as epoch ms) that have entries — for calendar display.
export const getEntryDates = query({
  args: {
    fromDate: v.number(),
    toDate: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    const from = startOfDay(args.fromDate);
    const to = startOfDay(args.toDate);

    const entries = await ctx.db
      .query("journalEntries")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return entries
      .filter((e) => e.entryDate >= from && e.entryDate <= to)
      .map((e) => ({ date: e.entryDate, mood: e.mood }));
  },
});

// ── Mutations ────────────────────────────────────────────────────────────────

export const createEntry = mutation({
  args: {
    title: v.optional(v.string()),
    content: v.string(),
    mood: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    entryDate: v.optional(v.number()), // defaults to today
    template: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    if (!args.content.trim()) {
      throw new ConvexError("Journal entry content cannot be empty.");
    }
    if (args.content.length > 20000) throw new ConvexError("Content must be 20,000 characters or fewer.");
    if (args.title && args.title.length > 200) throw new ConvexError("Title must be 200 characters or fewer.");
    if (args.tags && args.tags.length > 20) throw new ConvexError("Too many tags.");

    const now = Date.now();
    const entryDate = startOfDay(args.entryDate ?? now);

    // One entry per day — upsert behaviour.
    const existing = await ctx.db
      .query("journalEntries")
      .withIndex("userId_entryDate", (q) => q.eq("userId", user._id).eq("entryDate", entryDate))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        title: args.title,
        content: args.content,
        mood: args.mood,
        tags: args.tags,
        template: args.template,
        updatedAt: now,
      });
      return existing._id;
    }

    return ctx.db.insert("journalEntries", {
      userId: user._id,
      title: args.title,
      content: args.content,
      mood: args.mood,
      tags: args.tags ?? [],
      entryDate,
      template: args.template ?? "free",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateEntry = mutation({
  args: {
    id: v.id("journalEntries"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    mood: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const entry = await ctx.db.get(args.id);
    if (!entry || entry.userId !== user._id) {
      throw new ConvexError("Entry not found.");
    }

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.title !== undefined) {
      if (args.title.length > 200) throw new ConvexError("Title must be 200 characters or fewer.");
      patch.title = args.title;
    }
    if (args.content !== undefined) {
      if (!args.content.trim()) throw new ConvexError("Content cannot be empty.");
      if (args.content.length > 20000) throw new ConvexError("Content must be 20,000 characters or fewer.");
      patch.content = args.content;
    }
    if (args.mood !== undefined) patch.mood = args.mood;
    if (args.tags !== undefined) {
      if (args.tags.length > 20) throw new ConvexError("Too many tags.");
      patch.tags = args.tags;
    }

    await ctx.db.patch(args.id, patch);
  },
});

export const deleteEntry = mutation({
  args: { id: v.id("journalEntries") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const entry = await ctx.db.get(args.id);
    if (!entry || entry.userId !== user._id) {
      throw new ConvexError("Entry not found.");
    }
    await ctx.db.delete(args.id);
  },
});
