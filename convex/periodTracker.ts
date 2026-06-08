import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./authz";

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}

/** Returns null if unauthenticated or not female. Used in read-only queries (no error thrown). */
async function getFemaleUser(ctx: Parameters<typeof getCurrentUserOrThrow>[0]) {
  const user = await getCurrentUser(ctx);
  if (!user || user.gender !== "female") return null;
  return user;
}

/** Throws if the caller is not a female user. Used in mutations. */
async function requireFemaleUser(ctx: Parameters<typeof getCurrentUserOrThrow>[0]) {
  const user = await getCurrentUserOrThrow(ctx);
  if (user.gender !== "female") {
    throw new ConvexError("This feature is only available to female users.");
  }
  return user;
}

// ── Settings ─────────────────────────────────────────────────────────────────

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    const user = await getFemaleUser(ctx);
    if (!user) return null;
    const settings = await ctx.db
      .query("periodSettings")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .first();
    return settings ?? {
      avgCycleLength: 28,
      avgPeriodLength: 5,
      notifications: false,
      reminderDays: 2,
    };
  },
});

export const updateSettings = mutation({
  args: {
    avgCycleLength: v.optional(v.number()),
    avgPeriodLength: v.optional(v.number()),
    notifications: v.optional(v.boolean()),
    reminderDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireFemaleUser(ctx);
    const existing = await ctx.db
      .query("periodSettings")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .first();

    const now = Date.now();
    if (existing) {
      const patch: Record<string, unknown> = { updatedAt: now };
      if (args.avgCycleLength !== undefined) patch.avgCycleLength = args.avgCycleLength;
      if (args.avgPeriodLength !== undefined) patch.avgPeriodLength = args.avgPeriodLength;
      if (args.notifications !== undefined) patch.notifications = args.notifications;
      if (args.reminderDays !== undefined) patch.reminderDays = args.reminderDays;
      await ctx.db.patch(existing._id, patch);
    } else {
      await ctx.db.insert("periodSettings", {
        userId: user._id,
        avgCycleLength: args.avgCycleLength ?? 28,
        avgPeriodLength: args.avgPeriodLength ?? 5,
        notifications: args.notifications ?? false,
        reminderDays: args.reminderDays ?? 2,
        updatedAt: now,
      });
    }
  },
});

// ── Daily Logs ────────────────────────────────────────────────────────────────

export const getDayLog = query({
  args: { date: v.number() },
  handler: async (ctx, args) => {
    const user = await getFemaleUser(ctx);
    if (!user) return null;
    const day = startOfDay(args.date);
    return ctx.db
      .query("periodLogs")
      .withIndex("userId_date", (q) => q.eq("userId", user._id).eq("date", day))
      .first();
  },
});

export const getTodayLog = query({
  args: {},
  handler: async (ctx) => {
    const user = await getFemaleUser(ctx);
    if (!user) return null;
    const today = startOfDay(Date.now());
    return ctx.db
      .query("periodLogs")
      .withIndex("userId_date", (q) => q.eq("userId", user._id).eq("date", today))
      .first();
  },
});

export const getLogsInRange = query({
  args: { fromDate: v.number(), toDate: v.number() },
  handler: async (ctx, args) => {
    const user = await getFemaleUser(ctx);
    if (!user) return [];
    const from = startOfDay(args.fromDate);
    const to = startOfDay(args.toDate);
    if (to < from) throw new ConvexError("toDate must be on or after fromDate.");
    // Hard cap: 366 days to prevent unbounded data scans.
    const MAX_RANGE_MS = 366 * 24 * 60 * 60 * 1000;
    if (to - from > MAX_RANGE_MS) throw new ConvexError("Date range must not exceed 366 days.");

    const logs = await ctx.db
      .query("periodLogs")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();

    return logs.filter((l) => l.date >= from && l.date <= to);
  },
});

export const logDay = mutation({
  args: {
    date: v.optional(v.number()), // defaults to today
    flow: v.optional(v.union(
      v.literal("none"),
      v.literal("spotting"),
      v.literal("light"),
      v.literal("medium"),
      v.literal("heavy"),
    )),
    symptoms: v.optional(v.array(v.string())),
    mood: v.optional(v.string()),
    notes: v.optional(v.string()),
    temperature: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireFemaleUser(ctx);
    if (args.notes && args.notes.length > 2000) throw new ConvexError("Notes must be 2000 characters or fewer.");
    if (args.symptoms && args.symptoms.length > 20) throw new ConvexError("Too many symptoms.");
    const now = Date.now();
    const day = startOfDay(args.date ?? now);

    const existing = await ctx.db
      .query("periodLogs")
      .withIndex("userId_date", (q) => q.eq("userId", user._id).eq("date", day))
      .first();

    if (existing) {
      const patch: Record<string, unknown> = { updatedAt: now };
      if (args.flow !== undefined) patch.flow = args.flow;
      if (args.symptoms !== undefined) patch.symptoms = args.symptoms;
      if (args.mood !== undefined) patch.mood = args.mood;
      if (args.notes !== undefined) patch.notes = args.notes;
      if (args.temperature !== undefined) patch.temperature = args.temperature;
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }

    return ctx.db.insert("periodLogs", {
      userId: user._id,
      date: day,
      flow: args.flow,
      symptoms: args.symptoms,
      mood: args.mood,
      notes: args.notes,
      temperature: args.temperature,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// ── Cycles ────────────────────────────────────────────────────────────────────

export const getCycles = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getFemaleUser(ctx);
    if (!user) return [];
    return ctx.db
      .query("periodCycles")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit ?? 12);
  },
});

export const getActiveCycle = query({
  args: {},
  handler: async (ctx) => {
    const user = await getFemaleUser(ctx);
    if (!user) return null;
    const cycles = await ctx.db
      .query("periodCycles")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(1);
    const latest = cycles[0];
    if (!latest || latest.endDate !== undefined) return null;
    return latest;
  },
});

export const startCycle = mutation({
  args: {
    startDate: v.optional(v.number()), // defaults to today
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireFemaleUser(ctx);
    const now = Date.now();
    const startDate = startOfDay(args.startDate ?? now);

    // Close any open cycle
    const openCycles = await ctx.db
      .query("periodCycles")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();

    for (const c of openCycles) {
      if (c.endDate === undefined) {
        // Close it one day before the new start
        await ctx.db.patch(c._id, {
          endDate: startDate - 86400000,
          updatedAt: now,
        });
      }
    }

    const cycleId = await ctx.db.insert("periodCycles", {
      userId: user._id,
      startDate,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    // Also create a log entry for day 1 with heavy/medium flow as default start marker
    const existingLog = await ctx.db
      .query("periodLogs")
      .withIndex("userId_date", (q) => q.eq("userId", user._id).eq("date", startDate))
      .first();

    if (!existingLog) {
      await ctx.db.insert("periodLogs", {
        userId: user._id,
        date: startDate,
        flow: "medium",
        symptoms: [],
        createdAt: now,
        updatedAt: now,
      });
    }

    return cycleId;
  },
});

export const endCycle = mutation({
  args: {
    cycleId: v.id("periodCycles"),
    endDate: v.optional(v.number()), // defaults to today
  },
  handler: async (ctx, args) => {
    const user = await requireFemaleUser(ctx);
    const cycle = await ctx.db.get(args.cycleId);
    if (!cycle || cycle.userId !== user._id) {
      throw new ConvexError("Cycle not found.");
    }
    const endDate = startOfDay(args.endDate ?? Date.now());
    await ctx.db.patch(args.cycleId, { endDate, updatedAt: Date.now() });
  },
});

// ── Analytics ────────────────────────────────────────────────────────────────

export const getAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const user = await getFemaleUser(ctx);
    if (!user) return null;

    const cycles = await ctx.db
      .query("periodCycles")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(24);

    const logs = await ctx.db
      .query("periodLogs")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();

    // Compute cycle lengths for completed cycles
    const cycleLengths: number[] = [];
    const periodLengths: number[] = [];

    for (let i = 0; i < cycles.length - 1; i++) {
      const c = cycles[i];
      const prev = cycles[i + 1];
      if (prev.startDate) {
        cycleLengths.push(Math.round((c.startDate - prev.startDate) / 86400000));
      }
      if (c.endDate !== undefined) {
        periodLengths.push(Math.round((c.endDate - c.startDate) / 86400000) + 1);
      }
    }

    const avgCycleLength = cycleLengths.length
      ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
      : 28;

    const avgPeriodLength = periodLengths.length
      ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
      : 5;

    // Symptom frequency
    const symptomCounts: Record<string, number> = {};
    const moodCounts: Record<string, number> = {};
    for (const log of logs) {
      for (const s of log.symptoms ?? []) {
        symptomCounts[s] = (symptomCounts[s] ?? 0) + 1;
      }
      if (log.mood) moodCounts[log.mood] = (moodCounts[log.mood] ?? 0) + 1;
    }

    return {
      totalCycles: cycles.length,
      avgCycleLength,
      avgPeriodLength,
      cycleLengths: cycleLengths.slice(0, 12),
      symptomCounts,
      moodCounts,
      lastPeriodStart: cycles[0]?.startDate ?? null,
    };
  },
});
