import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireStaff } from "./authz";

export const list = query({
  args: {
    contentType: v.optional(v.union(v.literal("ayah"), v.literal("hadith"), v.literal("dua"), v.literal("fact"))),
  },
  handler: async (ctx, args) => {
    if (args.contentType) {
      return ctx.db.query("dailyContent")
        .withIndex("date", (idx) => idx.eq("date", Date.now()))
        .order("desc")
        .take(50);
    }
    return ctx.db.query("dailyContent").order("desc").take(50);
  },
});

export const getByDate = query({
  args: { date: v.number() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("dailyContent")
      .withIndex("date", (q) => q.eq("date", args.date))
      .order("desc")
      .take(10);
  },
});

export const create = mutation({
  args: {
    contentType: v.union(v.literal("ayah"), v.literal("hadith"), v.literal("dua"), v.literal("fact")),
    content: v.string(),
    source: v.string(),
    translation: v.optional(v.string()),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireStaff(ctx);
    return ctx.db.insert("dailyContent", {
      ...args,
      createdAt: Date.now(),
      createdBy: user._id,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("dailyContent"),
    contentType: v.optional(v.union(v.literal("ayah"), v.literal("hadith"), v.literal("dua"), v.literal("fact"))),
    content: v.optional(v.string()),
    source: v.optional(v.string()),
    translation: v.optional(v.string()),
    date: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields });
  },
});

export const remove = mutation({
  args: { id: v.id("dailyContent") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.delete(args.id);
  },
});

export const getDaily = query({
  args: {},
  handler: async (ctx) => {
    // 1. Calculate day index for static fallbacks
    const now = new Date();
    const startOfYear = new Date(now.getUTCFullYear(), 0, 0);
    const diff =
      now.getTime() -
      startOfYear.getTime() +
      (startOfYear.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayIndex = Math.floor(diff / oneDay);

    const startOfToday = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    ).getTime();

    // 2. Fetch daily content entries from DB
    const dbEntries = await ctx.db
      .query("dailyContent")
      .order("desc")
      .take(20);

    // Let's filter for today's entries
    const todayEntries = dbEntries.filter(
      (item) => item.date >= startOfToday && item.date < startOfToday + oneDay
    );

    const getByType = (type: "ayah" | "hadith" | "dua" | "fact") => {
      // First try today's entries
      const todayItem = todayEntries.find((item) => item.contentType === type);
      if (todayItem) return todayItem;

      // Then try any latest entry of this type from the DB
      const latestItem = dbEntries.find((item) => item.contentType === type);
      if (latestItem) return latestItem;

      return null;
    };

    const dbAyah = getByType("ayah");
    const dbDua = getByType("dua");
    const dbFact = getByType("fact");

    // Static Fallbacks (matching the Express backend)
    const staticAyat = [
      {
        reference: "An-Nur 24:35",
        arabic: "ٱللَّهُ نُورُ ٱلسَّمَٰوَاتِ وَٱلْأَرْضِ",
        translation:
          "Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp...",
      },
      {
        reference: "Al-Baqarah 2:286",
        arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
        translation: "Allah does not burden a soul beyond what it can bear.",
      },
      {
        reference: "Al-Inshirah 94:5",
        arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
        translation: "So, surely with hardship comes ease.",
      },
    ];

    const staticDuas = [
      {
        arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا",
        translation: "Our Lord, do not let our hearts deviate after You have guided us.",
      },
      {
        arabic: "رَبِّ زِدْنِي عِلْمًا",
        translation: "My Lord, increase me in knowledge.",
      },
      {
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي ٱلْآخِرَةِ حَسَنَةً",
        translation: "Our Lord, grant us good in this world and good in the Hereafter.",
      },
    ];

    const staticFacts = [
      "The five daily prayers were made obligatory during the Night Journey (al-Isrāʾ wal-Miʿrāj).",
      "Many scholars from all four madhabs emphasized the importance of local custom (ʿurf) as long as it does not contradict clear texts.",
      "Seeking knowledge of dīn is a communal obligation (farḍ kifāyah) in every community.",
    ];

    const fallbackAyah = staticAyat[dayIndex % staticAyat.length];
    const fallbackDua = staticDuas[dayIndex % staticDuas.length];
    const fallbackFact = staticFacts[dayIndex % staticFacts.length];

    const gregorianDate = now.toISOString().slice(0, 10);

    return {
      gregorianDate,
      ayah: dbAyah
        ? {
            reference: dbAyah.source,
            arabic: dbAyah.content,
            translation: dbAyah.translation || "",
          }
        : fallbackAyah,
      dua: dbDua
        ? {
            arabic: dbDua.content,
            translation: dbDua.translation || "",
          }
        : fallbackDua,
      fact: dbFact ? dbFact.content : fallbackFact,
    };
  },
});
