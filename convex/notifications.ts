import { mutation, internalMutation, internalQuery, query, internalAction, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { getCurrentUserOrThrow } from "./authz";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getUtcOffsetMs(timezone: string): number {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) =>
    parseInt(parts.find((p) => p.type === t)?.value ?? "0");
  let h = get("hour");
  if (h === 24) h = 0;
  const localMs = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    h,
    get("minute"),
    get("second")
  );
  return localMs - now.getTime(); // positive = UTC+
}

function getPrayerTimesUtc(
  lat: number,
  lng: number,
  timezone: string,
  method: string
) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const get = (t: string) =>
    parseInt(parts.find((p) => p.type === t)?.value ?? "0");
  const localDate = new Date(get("year"), get("month") - 1, get("day"));

  const coords = new Coordinates(lat, lng);
  const params =
    method === "ISNA"
      ? CalculationMethod.NorthAmerica()
      : method === "Egypt"
      ? CalculationMethod.Egyptian()
      : method === "Karachi"
      ? CalculationMethod.Karachi()
      : method === "UmmAlQura"
      ? CalculationMethod.UmmAlQura()
      : CalculationMethod.MuslimWorldLeague();

  const pt = new PrayerTimes(coords, localDate, params);
  const offset = getUtcOffsetMs(timezone);

  return {
    fajr: pt.fajr.getTime() - offset,
    dhuhr: pt.dhuhr.getTime() - offset,
    asr: pt.asr.getTime() - offset,
    maghrib: pt.maghrib.getTime() - offset,
    isha: pt.isha.getTime() - offset,
  };
}

/** Parse "HH:MM" and return the UTC ms timestamp for that time today in the
 *  given timezone. Returns null if the time has already passed today. */
function getReminderTimeTodayUtc(
  timeStr: string,
  timezone: string
): number | null {
  const [hhStr, mmStr] = timeStr.split(":");
  const hh = parseInt(hhStr ?? "8", 10);
  const mm = parseInt(mmStr ?? "0", 10);

  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const get = (t: string) =>
    parseInt(parts.find((p) => p.type === t)?.value ?? "0");

  const offset = getUtcOffsetMs(timezone);
  // Construct the local wall-clock time as if it were UTC, then subtract offset
  const localWall = Date.UTC(get("year"), get("month") - 1, get("day"), hh, mm, 0);
  const utcMs = localWall - offset;

  return utcMs > now.getTime() ? utcMs : null;
}

// ─── Subscription Management ─────────────────────────────────────────────────

export const saveSubscription = mutation({
  args: {
    endpoint: v.string(),
    p256dh: v.string(),
    auth: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const existing = await ctx.db
      .query("pushSubscriptions")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("endpoint"), args.endpoint))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        p256dh: args.p256dh,
        auth: args.auth,
      });
    } else {
      await ctx.db.insert("pushSubscriptions", {
        userId: user._id,
        endpoint: args.endpoint,
        p256dh: args.p256dh,
        auth: args.auth,
      });
    }
  },
});

export const removeSubscription = mutation({
  args: {
    endpoint: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const sub = await ctx.db
      .query("pushSubscriptions")
      .withIndex("endpoint", (q) => q.eq("endpoint", args.endpoint))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .unique();
    if (sub) {
      await ctx.db.delete(sub._id);
    }
  },
});

export const removeSubscriptionByEndpoint = internalMutation({
  args: {
    endpoint: v.string(),
  },
  handler: async (ctx, args) => {
    const sub = await ctx.db
      .query("pushSubscriptions")
      .withIndex("endpoint", (q) => q.eq("endpoint", args.endpoint))
      .unique();
    if (sub) {
      await ctx.db.delete(sub._id);
    }
  },
});

// ─── Notification Settings ────────────────────────────────────────────────────

export const getMySettings = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const settings = await ctx.db
      .query("notificationSettings")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .unique();
    return settings ?? null;
  },
});

export const saveSettings = mutation({
  args: {
    prayerEnabled: v.optional(v.boolean()),
    fajrEnabled: v.optional(v.boolean()),
    dhuhrEnabled: v.optional(v.boolean()),
    asrEnabled: v.optional(v.boolean()),
    maghribEnabled: v.optional(v.boolean()),
    ishaEnabled: v.optional(v.boolean()),
    quranEnabled: v.optional(v.boolean()),
    quranTime: v.optional(v.string()),
    dailyContentEnabled: v.optional(v.boolean()),
    dailyContentTime: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    timezone: v.optional(v.string()),
    calculationMethod: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const existing = await ctx.db
      .query("notificationSettings")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("notificationSettings", {
        userId: user._id,
        ...args,
      });
    }
  },
});

export const sendTestNotification = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Please sign in to continue.");
    const subs = await ctx.runQuery(
      internal.notifications._getSubscriptionsForUser,
      { userId }
    );
    if (subs.length === 0) {
      throw new Error("No push subscription found. Enable push notifications first.");
    }
    for (const sub of subs) {
      await ctx.runAction(internal.webPush.sendPush, {
        endpoint: sub.endpoint,
        p256dh: sub.p256dh,
        auth: sub.auth,
        title: "GëstuSaDine — Test",
        body: "Push notifications are working correctly.",
        icon: "/app-icon.png",
        tag: "test",
        url: "/settings",
      });
    }
  },
});

// ─── Prayer Notification Scheduling ──────────────────────────────────────────

export const scheduleDailyPrayerNotifications = internalAction({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.runQuery(
      internal.notifications._getAllPrayerSettings
    );

    for (const s of settings) {
      if (!s.latitude || !s.longitude || !s.timezone) continue;

      const subs = await ctx.runQuery(
        internal.notifications._getSubscriptionsForUser,
        { userId: s.userId }
      );
      if (subs.length === 0) continue;

      const times = getPrayerTimesUtc(
        s.latitude,
        s.longitude,
        s.timezone,
        s.calculationMethod ?? "MuslimWorldLeague"
      );
      const now = Date.now();

      const prayers = [
        {
          key: "fajr",
          enabled: s.fajrEnabled !== false,
          label: "Fajr",
        },
        {
          key: "dhuhr",
          enabled: s.dhuhrEnabled !== false,
          label: "Dhuhr",
        },
        {
          key: "asr",
          enabled: s.asrEnabled !== false,
          label: "Asr",
        },
        {
          key: "maghrib",
          enabled: s.maghribEnabled !== false,
          label: "Maghrib",
        },
        {
          key: "isha",
          enabled: s.ishaEnabled !== false,
          label: "Isha",
        },
      ];

      for (const prayer of prayers) {
        if (!prayer.enabled) continue;
        const t = times[prayer.key as keyof typeof times];
        if (t > now) {
          await ctx.scheduler.runAt(
            t,
            internal.notifications.deliverPrayerPush,
            {
              userId: s.userId,
              prayerName: prayer.key,
              prayerLabel: prayer.label,
            }
          );
        }
      }
    }
  },
});

export const deliverPrayerPush = internalAction({
  args: {
    userId: v.id("users"),
    prayerName: v.string(),
    prayerLabel: v.string(),
  },
  handler: async (ctx, { userId, prayerName, prayerLabel }) => {
    const settings = await ctx.runQuery(
      internal.notifications._getSettingsForUser,
      { userId }
    );
    if (!settings?.prayerEnabled) return;

    const subs = await ctx.runQuery(
      internal.notifications._getSubscriptionsForUser,
      { userId }
    );

    for (const sub of subs) {
      await ctx.runAction(internal.webPush.sendPush, {
        endpoint: sub.endpoint,
        p256dh: sub.p256dh,
        auth: sub.auth,
        title: `${prayerLabel} — وقت الصلاة`,
        body: `It's time for ${prayerLabel} prayer. May Allah accept your worship.`,
        icon: "/logo.png",
        tag: `prayer-${prayerName}`,
        url: "/prayer-times",
      });
    }
  },
});

export const deliverQuranReminder = internalAction({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const settings = await ctx.runQuery(
      internal.notifications._getSettingsForUser,
      { userId }
    );
    if (!settings?.quranEnabled) return;

    const subs = await ctx.runQuery(
      internal.notifications._getSubscriptionsForUser,
      { userId }
    );

    for (const sub of subs) {
      await ctx.runAction(internal.webPush.sendPush, {
        endpoint: sub.endpoint,
        p256dh: sub.p256dh,
        auth: sub.auth,
        title: "Quran Reading — تلاوة القرآن",
        body: "Time for your daily Quran reading. Even a few verses bring great reward.",
        icon: "/logo.png",
        tag: "quran-reminder",
        url: "/quran",
      });
    }
  },
});

export const deliverDailyContentReminder = internalAction({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const settings = await ctx.runQuery(
      internal.notifications._getSettingsForUser,
      { userId }
    );
    if (!settings?.dailyContentEnabled) return;

    const subs = await ctx.runQuery(
      internal.notifications._getSubscriptionsForUser,
      { userId }
    );

    for (const sub of subs) {
      await ctx.runAction(internal.webPush.sendPush, {
        endpoint: sub.endpoint,
        p256dh: sub.p256dh,
        auth: sub.auth,
        title: "Daily Islamic Content — المحتوى اليومي",
        body: "Your daily reminder of wisdom, knowledge and reflection is ready.",
        icon: "/logo.png",
        tag: "daily-content",
        url: "/dashboard",
      });
    }
  },
});

// ─── Reminder Scheduler (called by cron) ────────────────────────────────────

export const scheduleReminders = internalAction({
  args: {},
  handler: async (ctx) => {
    const allSettings = await ctx.runQuery(
      internal.notifications._getAllReminderSettings
    );

    for (const s of allSettings) {
      if (!s.timezone) continue;

      if (s.quranEnabled && s.quranTime) {
        const t = getReminderTimeTodayUtc(s.quranTime, s.timezone);
        if (t !== null) {
          await ctx.scheduler.runAt(
            t,
            internal.notifications.deliverQuranReminder,
            { userId: s.userId }
          );
        }
      }

      if (s.dailyContentEnabled) {
        const timeStr = s.dailyContentTime ?? "08:00";
        const t = getReminderTimeTodayUtc(timeStr, s.timezone);
        if (t !== null) {
          await ctx.scheduler.runAt(
            t,
            internal.notifications.deliverDailyContentReminder,
            { userId: s.userId }
          );
        }
      }
    }
  },
});

// ─── Internal Queries (used by internalActions above) ────────────────────────

export const _getAllPrayerSettings = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("notificationSettings")
      .filter((q) => q.eq(q.field("prayerEnabled"), true))
      .collect();
  },
});

export const _getAllReminderSettings = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("notificationSettings")
      .filter((q) =>
        q.or(
          q.eq(q.field("quranEnabled"), true),
          q.eq(q.field("dailyContentEnabled"), true)
        )
      )
      .collect();
  },
});

export const _getSettingsForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("notificationSettings")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const _getSubscriptionsForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("pushSubscriptions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
  },
});
