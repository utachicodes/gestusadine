import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getCurrentUser, getCurrentUserOrThrow } from "./authz";
import { MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}

// ── Ramadan Calendar ──────────────────────────────────────────────────────────
// Approximate Ramadan start dates (Gregorian) per year. Based on global crescent
// moon sightings. Extend this table when new years are confirmed.
const RAMADAN_STARTS: Record<number, [number, number]> = {
  // [month (1-12), day]
  2019: [5,  5],
  2020: [4, 24],
  2021: [4, 13],
  2022: [4,  2],
  2023: [3, 23],
  2024: [3, 11],
  2025: [3,  1],
  2026: [2, 18],
  2027: [2,  8],
  2028: [1, 28],
  2029: [1, 17],
  2030: [1,  6],
};
const RAMADAN_DAYS = 29; // use 29 as minimum; some years are 30 — safe to use 30

function getRamadanRange(year: number): { start: number; end: number } | null {
  const entry = RAMADAN_STARTS[year];
  if (!entry) return null;
  const [month, day] = entry;
  const start = Date.UTC(year, month - 1, day);
  const end = start + (RAMADAN_DAYS + 1) * 86_400_000; // +1 day safety buffer for 30-day months
  return { start, end };
}

/** Returns all Ramadan day timestamps that fall within [cycleStart, cycleEnd]. */
function ramadanDaysInRange(
  cycleStart: number,
  cycleEnd: number,
): { date: number; year: number }[] {
  const results: { date: number; year: number }[] = [];
  // Check the Ramadan for the year of the cycle start and the year after
  // (a cycle could straddle a year boundary in January)
  const years = new Set([
    new Date(cycleStart).getUTCFullYear(),
    new Date(cycleEnd).getUTCFullYear(),
  ]);
  for (const year of years) {
    const range = getRamadanRange(year);
    if (!range) continue;
    let d = range.start;
    while (d <= range.end) {
      if (d >= cycleStart && d <= cycleEnd) {
        results.push({ date: d, year });
      }
      d += 86_400_000;
    }
  }
  return results;
}

/** Upsert qadaa rows for every Ramadan day that falls inside the given cycle. */
async function syncQadaaForCycle(
  ctx: MutationCtx,
  userId: Id<"users">,
  cycleStart: number,
  cycleEnd: number,
): Promise<void> {
  const days = ramadanDaysInRange(cycleStart, cycleEnd);
  const now = Date.now();
  for (const { date, year } of days) {
    const existing = await ctx.db
      .query("sawmQadaa")
      .withIndex("userId_ramadanDate", (q) =>
        q.eq("userId", userId).eq("ramadanDate", date),
      )
      .first();
    if (!existing) {
      await ctx.db.insert("sawmQadaa", {
        userId,
        ramadanDate: date,
        ramadanYear: year,
        createdAt: now,
      });
    }
  }
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
    qadaaDaysPerWeek: v.optional(v.number()),
    qadaaPreferredDays: v.optional(v.array(v.number())),
    qadaaReminderEnabled: v.optional(v.boolean()),
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
      if (args.qadaaDaysPerWeek !== undefined) patch.qadaaDaysPerWeek = args.qadaaDaysPerWeek;
      if (args.qadaaPreferredDays !== undefined) patch.qadaaPreferredDays = args.qadaaPreferredDays;
      if (args.qadaaReminderEnabled !== undefined) patch.qadaaReminderEnabled = args.qadaaReminderEnabled;
      await ctx.db.patch(existing._id, patch);
    } else {
      await ctx.db.insert("periodSettings", {
        userId: user._id,
        avgCycleLength: args.avgCycleLength ?? 28,
        avgPeriodLength: args.avgPeriodLength ?? 5,
        notifications: args.notifications ?? false,
        reminderDays: args.reminderDays ?? 2,
        qadaaDaysPerWeek: args.qadaaDaysPerWeek,
        qadaaPreferredDays: args.qadaaPreferredDays,
        qadaaReminderEnabled: args.qadaaReminderEnabled,
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
        const autoEndDate = startDate - 86400000;
        await ctx.db.patch(c._id, { endDate: autoEndDate, updatedAt: now });
        await syncQadaaForCycle(ctx, user._id, c.startDate, autoEndDate);
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
    await syncQadaaForCycle(ctx, user._id, cycle.startDate, endDate);
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

// ── Sawm Qadaa ────────────────────────────────────────────────────────────────

export const getQadaaSummary = query({
  args: {},
  handler: async (ctx) => {
    const user = await getFemaleUser(ctx);
    if (!user) return null;

    const rows = await ctx.db
      .query("sawmQadaa")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();

    const totalOwed = rows.filter((r) => r.completedAt === undefined).length;
    const totalCompleted = rows.filter((r) => r.completedAt !== undefined).length;

    // Group owed by year
    const byYear: Record<number, { owed: number; completed: number; dates: number[] }> = {};
    for (const r of rows) {
      if (!byYear[r.ramadanYear]) {
        byYear[r.ramadanYear] = { owed: 0, completed: 0, dates: [] };
      }
      if (r.completedAt === undefined) {
        byYear[r.ramadanYear].owed++;
        byYear[r.ramadanYear].dates.push(r.ramadanDate);
      } else {
        byYear[r.ramadanYear].completed++;
      }
    }

    return { totalOwed, totalCompleted, byYear, rows };
  },
});

export const markQadaaCompleted = mutation({
  args: { qadaaId: v.id("sawmQadaa") },
  handler: async (ctx, args) => {
    const user = await requireFemaleUser(ctx);
    const row = await ctx.db.get(args.qadaaId);
    if (!row || row.userId !== user._id) {
      throw new ConvexError("Record not found.");
    }
    if (row.completedAt !== undefined) return; // already marked
    await ctx.db.patch(args.qadaaId, { completedAt: Date.now() });
  },
});

export const unmarkQadaaCompleted = mutation({
  args: { qadaaId: v.id("sawmQadaa") },
  handler: async (ctx, args) => {
    const user = await requireFemaleUser(ctx);
    const row = await ctx.db.get(args.qadaaId);
    if (!row || row.userId !== user._id) {
      throw new ConvexError("Record not found.");
    }
    await ctx.db.patch(args.qadaaId, { completedAt: undefined });
  },
});

/** Scan all past completed cycles and insert qadaa rows for any Ramadan overlap
 *  not yet recorded. Safe to call multiple times — upsert logic skips duplicates. */
export const backfillQadaaFromHistory = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireFemaleUser(ctx);
    const cycles = await ctx.db
      .query("periodCycles")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();

    let inserted = 0;
    for (const cycle of cycles) {
      if (cycle.endDate === undefined) continue; // skip open cycles
      const before = await ctx.db
        .query("sawmQadaa")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .collect();
      const beforeCount = before.length;
      await syncQadaaForCycle(ctx, user._id, cycle.startDate, cycle.endDate);
      const after = await ctx.db
        .query("sawmQadaa")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .collect();
      inserted += after.length - beforeCount;
    }
    return { inserted };
  },
});
