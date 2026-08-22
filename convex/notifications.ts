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

/** Quiet hours protect sleep: non-prayer reminders scheduled between 22:00 and
 *  07:00 local time are moved to 07:00 local. Prayers are never shifted. */
function adjustForQuietHours(utcMs: number, timezone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    hour12: false,
  }).formatToParts(new Date(utcMs));
  const get = (t: string) => parseInt(parts.find((p) => p.type === t)?.value ?? "0");
  let h = get("hour");
  if (h === 24) h = 0;
  if (h < 22 && h >= 7) return utcMs;

  const offset = getUtcOffsetMs(timezone);
  // Move to 07:00 local on the same calendar day the reminder would fire.
  let target = Date.UTC(get("year"), get("month") - 1, get("day"), 7, 0, 0) - offset;
  if (target <= utcMs) target += 24 * 60 * 60 * 1000;
  return target;
}

// ─── Notification copy (EN + FR, calm & short for teens) ─────────────────────

type Lang = "en" | "fr";

const COPY = {
  prayer: {
    en: (label: string) => `Time for ${label}. Take a breath — this moment is yours.`,
    fr: (label: string) => `C'est l'heure de ${label}. Une pause, juste pour toi et Allah.`,
  },
  quran: {
    title: { en: "Quran time", fr: "Temps pour le Coran" },
    body: {
      en: "Even one ayah counts today. Your streak is waiting.",
      fr: "Même un verset compte aujourd'hui. Ta série t'attend.",
    },
  },
  daily: {
    title: { en: "Your daily reset", fr: "Ta pause quotidienne" },
    body: {
      en: "One small reminder of iman is ready — under 2 minutes.",
      fr: "Un petit rappel d'iman t'attend — moins de 2 minutes.",
    },
  },
  dua: {
    title: { en: "A moment with Allah", fr: "Un moment avec Allah" },
  },
} as const;

function lang(settings: { language?: string } | null): Lang {
  return settings?.language === "fr" ? "fr" : "en";
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

// Save an Expo Push Token (React Native). Reuses pushSubscriptions table
// with endpoint = expo push token and empty p256dh/auth (not needed for Expo).
export const saveExpoPushToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const existing = await ctx.db
      .query("pushSubscriptions")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("endpoint"), args.token))
      .unique();
    if (!existing) {
      await ctx.db.insert("pushSubscriptions", {
        userId: user._id,
        endpoint: args.token,
        p256dh: "",
        auth: "",
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
    duaReminderEnabled: v.optional(v.boolean()),
    duaReminderTimes: v.optional(v.array(v.string())),
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

export const scheduleForToday = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated.");

    const settings = await ctx.runQuery(internal.notifications._getSettingsForUser, { userId });
    if (!settings) return;

    const subs = await ctx.runQuery(internal.notifications._getSubscriptionsForUser, { userId });
    if (subs.length === 0) return;

    const now = Date.now();

    // Prayer times
    if (settings.prayerEnabled && settings.latitude && settings.longitude && settings.timezone) {
      const times = getPrayerTimesUtc(
        settings.latitude,
        settings.longitude,
        settings.timezone,
        settings.calculationMethod ?? "MuslimWorldLeague"
      );
      const prayers = [
        { key: "fajr",    enabled: settings.fajrEnabled    !== false, label: "Fajr" },
        { key: "dhuhr",   enabled: settings.dhuhrEnabled   !== false, label: "Dhuhr" },
        { key: "asr",     enabled: settings.asrEnabled     !== false, label: "Asr" },
        { key: "maghrib", enabled: settings.maghribEnabled !== false, label: "Maghrib" },
        { key: "isha",    enabled: settings.ishaEnabled    !== false, label: "Isha" },
      ];
      for (const p of prayers) {
        if (!p.enabled) continue;
        const t = times[p.key as keyof typeof times];
        if (t > now) {
          await ctx.scheduler.runAt(t, internal.notifications.deliverPrayerPush, {
            userId,
            prayerName: p.key,
            prayerLabel: p.label,
          });
        }
      }
    }

    const tz = settings.timezone ?? "Africa/Dakar";
    const quiet = settings.quietHoursEnabled !== false;

    // Quran reminder — on by default unless explicitly disabled
    if (settings.quranEnabled !== false) {
      const t = getReminderTimeTodayUtc(settings.quranTime ?? "10:00", tz);
      if (t !== null) {
        await ctx.scheduler.runAt(
          quiet ? adjustForQuietHours(t, tz) : t,
          internal.notifications.deliverQuranReminder, { userId }
        );
      }
    }

    // Daily content reminder — on by default unless explicitly disabled
    if (settings.dailyContentEnabled !== false) {
      const t = getReminderTimeTodayUtc(settings.dailyContentTime ?? "22:00", tz);
      if (t !== null) {
        await ctx.scheduler.runAt(
          quiet ? adjustForQuietHours(t, tz) : t,
          internal.notifications.deliverDailyContentReminder, { userId }
        );
      }
    }

    // Dua reminders — strictly opt-in so new users are never overwhelmed
    if (settings.duaReminderEnabled === true) {
      const times = settings.duaReminderTimes ?? ["09:00", "14:00", "20:00"];
      for (const timeStr of times) {
        const t = getReminderTimeTodayUtc(timeStr, tz);
        if (t !== null) {
          await ctx.scheduler.runAt(
            quiet ? adjustForQuietHours(t, tz) : t,
            internal.notifications.deliverDuaReminder, { userId }
          );
        }
      }
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
        icon: "/icons/icon-192.png",
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

    const l = lang(settings);
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
        body: COPY.prayer[l](prayerLabel),
        icon: "/icons/icon-192.png",
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
    if (settings?.quranEnabled === false) return;

    const l = lang(settings);
    const subs = await ctx.runQuery(
      internal.notifications._getSubscriptionsForUser,
      { userId }
    );

    for (const sub of subs) {
      await ctx.runAction(internal.webPush.sendPush, {
        endpoint: sub.endpoint,
        p256dh: sub.p256dh,
        auth: sub.auth,
        title: COPY.quran.title[l],
        body: COPY.quran.body[l],
        icon: "/icons/icon-192.png",
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
    if (settings?.dailyContentEnabled === false) return;

    const l = lang(settings);
    const subs = await ctx.runQuery(
      internal.notifications._getSubscriptionsForUser,
      { userId }
    );

    for (const sub of subs) {
      await ctx.runAction(internal.webPush.sendPush, {
        endpoint: sub.endpoint,
        p256dh: sub.p256dh,
        auth: sub.auth,
        title: COPY.daily.title[l],
        body: COPY.daily.body[l],
        icon: "/icons/icon-192.png",
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
      const tz = s.timezone ?? "Africa/Dakar";
      const quiet = s.quietHoursEnabled !== false;

      if (s.quranEnabled !== false) {
        const t = getReminderTimeTodayUtc(s.quranTime ?? "10:00", tz);
        if (t !== null) {
          await ctx.scheduler.runAt(
            quiet ? adjustForQuietHours(t, tz) : t,
            internal.notifications.deliverQuranReminder,
            { userId: s.userId }
          );
        }
      }

      if (s.dailyContentEnabled !== false) {
        const t = getReminderTimeTodayUtc(s.dailyContentTime ?? "22:00", tz);
        if (t !== null) {
          await ctx.scheduler.runAt(
            quiet ? adjustForQuietHours(t, tz) : t,
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
    // Fetch all rows; opt-out filtering (quranEnabled === false, etc.) happens
    // in the caller so rows with unset fields (undefined) are treated as enabled.
    return await ctx.db.query("notificationSettings").collect();
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

// ─── Dua Reminder System ──────────────────────────────────────────────────

// Random dua reminder messages in English and French
const DUA_REMINDER_MESSAGES = [
  { en: "Time for a dua! Say: Rabbana atina fid-dunya hasanah", fr: "C'est l'heure d'une dua ! Dites : Rabbana atina fid-dunya hasanah" },
  { en: "Remember Allah with a dua right now", fr: "Souvenez-vous d'Allah avec une dua maintenant" },
  { en: "A moment of reflection — make a dua for someone you love", fr: "Un moment de réflexion — faites une dua pour quelqu'un que vous aimez" },
  { en: "The Prophet ﷺ said: The dua of a Muslim for his brother in his absence is answered", fr: "Le Prophète ﷺ a dit : La dua d'un musulman pour son frère en son absence est exaucée" },
  { en: "Make a dua for the Ummah right now", fr: "Faites une dua pour l'Ummah maintenant" },
  { en: "Pause and say: Hasbiyallahu la ilaha illa hu", fr: "Arrêtez-vous et dites : Hasbiyallahu la ilaha illa hu" },
  { en: "Send blessings upon the Prophet ﷺ — Allah will send blessings upon you", fr: "Envoyez des bénédictions sur le Prophète ﷺ — Allah vous en enverra" },
  { en: "A dua from the heart is never rejected", fr: "Une dua du cœur n'est jamais rejetée" },
  { en: "Say: La ilaha illa anta subhanaka inni kuntu min adh-dhalimin", fr: "Dites : La ilaha illa anta subhanaka inni kuntu min adh-dhalimin" },
  { en: "Remember: Allah is close to the broken-hearted", fr: "Souvenez-vous : Allah est proche des cœurs brisés" },
  { en: "Take a moment to make shukr (gratitude) to Allah", fr: "Prenez un moment pour faire le shukr (remerciement) à Allah" },
  { en: "This is a blessed moment — make a dua now", fr: "C'est un moment béni — faites une dua maintenant" },
];

// Pick a random dua message (deterministic per invocation)
function pickRandomDua(): { en: string; fr: string } {
  const idx = Math.floor(Math.random() * DUA_REMINDER_MESSAGES.length);
  return DUA_REMINDER_MESSAGES[idx];
}

export const deliverDuaReminder = internalAction({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const settings = await ctx.runQuery(
      internal.notifications._getSettingsForUser,
      { userId }
    );
    if (settings?.duaReminderEnabled !== true) return;

    const subs = await ctx.runQuery(
      internal.notifications._getSubscriptionsForUser,
      { userId }
    );

    const msg = pickRandomDua();

    for (const sub of subs) {
      await ctx.runAction(internal.webPush.sendPush, {
        endpoint: sub.endpoint,
        p256dh: sub.p256dh,
        auth: sub.auth,
        title: COPY.dua.title[lang(settings)],
        body: lang(settings) === "fr" ? msg.fr : msg.en,
        icon: "/icons/icon-192.png",
        tag: "dua-reminder",
        url: "/duas",
      });
    }
  },
});

// Schedule dua reminders for all opted-in users (called by cron).
// Dua reminders are strictly opt-in — users must explicitly enable them.
export const scheduleDuaReminders = internalAction({
  args: {},
  handler: async (ctx) => {
    const allSettings = await ctx.runQuery(
      internal.notifications._getAllReminderSettings
    );

    for (const s of allSettings) {
      if (s.duaReminderEnabled !== true) continue;

      const tz = s.timezone ?? "Africa/Dakar";
      const times = s.duaReminderTimes ?? ["09:00", "14:00", "20:00"];

      for (const timeStr of times) {
        const t = getReminderTimeTodayUtc(timeStr, tz);
        if (t !== null) {
          await ctx.scheduler.runAt(
            s.quietHoursEnabled !== false ? adjustForQuietHours(t, tz) : t,
            internal.notifications.deliverDuaReminder,
            { userId: s.userId }
          );
        }
      }
    }
  },
});
