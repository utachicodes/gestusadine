import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { requireStaff } from "./authz";

export const list = query({
  args: {
    contentType: v.optional(v.union(v.literal("ayah"), v.literal("hadith"), v.literal("dua"), v.literal("fact"), v.literal("action"))),
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
    contentType: v.union(v.literal("ayah"), v.literal("hadith"), v.literal("dua"), v.literal("fact"), v.literal("action")),
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
    contentType: v.optional(v.union(v.literal("ayah"), v.literal("hadith"), v.literal("dua"), v.literal("fact"), v.literal("action"))),
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
    const now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    const startOfToday = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    ).getTime();

    // Day-of-year index drives static fallback rotation
    const startOfYear = new Date(now.getUTCFullYear(), 0, 0);
    const dayIndex = Math.floor((now.getTime() - startOfYear.getTime()) / oneDay);

    // Fetch only today's entries (strict — no cross-day bleed)
    const todayEntries = await ctx.db
      .query("dailyContent")
      .withIndex("date", (q) => q.gte("date", startOfToday).lt("date", startOfToday + oneDay))
      .collect();

    const get = (type: "ayah" | "hadith" | "dua" | "fact" | "action") =>
      todayEntries.find((e) => e.contentType === type) ?? null;

    const dbAyah   = get("ayah");
    const dbHadith = get("hadith");
    const dbDua    = get("dua");
    const dbFact   = get("fact");
    const dbAction = get("action");

    // Static fallbacks — 7-entry pool rotated by day so every day is different
    const AYAT = [
      { reference: "Al-Baqarah 2:286", arabic: "لا يكلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", translation: "Allah does not burden a soul beyond what it can bear." },
      { reference: "An-Nur 24:35", arabic: "اللَّهُ نُورُ السَّمَوَاتِ وَالْأَرْضِ", translation: "Allah is the Light of the heavens and the earth." },
      { reference: "Al-Inshirah 94:5-6", arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "Surely with hardship comes ease." },
      { reference: "Al-Imran 3:173", arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", translation: "Allah is sufficient for us, and He is the best disposer of affairs." },
      { reference: "Al-Baqarah 2:152", arabic: "فَاذْكُرونِي أَذْكُرْكُمْ", translation: "So remember Me; I will remember you." },
      { reference: "Az-Zumar 39:53", arabic: "لا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", translation: "Do not despair of the mercy of Allah." },
      { reference: "Ar-Ra'd 13:28", arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", translation: "Verily, in the remembrance of Allah do hearts find rest." },
    ];

    const DUAS = [
      { arabic: "رَبِّ زِدْنِي عِلْمًا", translation: "My Lord, increase me in knowledge." },
      { arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا", translation: "Our Lord, do not let our hearts deviate after You have guided us." },
      { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً", translation: "Our Lord, grant us good in this world and good in the Hereafter." },
      { arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا", translation: "O Allah, I ask You for beneficial knowledge." },
      { arabic: "رَبِّ اشْرَحْ لِي صَدْرِي", translation: "My Lord, expand for me my breast with assurance." },
      { arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ", translation: "O Allah, help me to remember You, to give thanks to You, and to worship You well." },
      { arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ", translation: "O Allah, I seek refuge in You from anxiety and grief." },
    ];

    const HADITHS = [
      { arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ", translation: "Actions are but by intentions.", source: "Sahih al-Bukhari 1" },
      { arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ", translation: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", source: "Sahih al-Bukhari 6018" },
      { arabic: "الدِّينُ النَّصِيحَةُ", translation: "The religion is sincere advice.", source: "Sahih Muslim 55" },
      { arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", translation: "None of you truly believes until he loves for his brother what he loves for himself.", source: "Sahih al-Bukhari 13" },
      { arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ", translation: "Seeking knowledge is an obligation upon every Muslim.", source: "Ibn Majah 224" },
      { arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", translation: "The best of you are those who learn the Quran and teach it.", source: "Sahih al-Bukhari 5027" },
      { arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ", translation: "The Muslim is the one from whose tongue and hand other Muslims are safe.", source: "Sahih al-Bukhari 10" },
    ];

    const FACTS = [
      "The five daily prayers were made obligatory during the Night Journey (al-Isra' wal-Mi'raj).",
      "The Quran was revealed over approximately 23 years.",
      "The city of Madinah was originally called Yathrib before the Prophet came.",
      "Imam al-Bukhari memorised over 600,000 hadith.",
      "The word 'Islam' shares its root with 'salaam' (peace) — both come from the root sin-lam-mim.",
      "Zamzam water has been flowing continuously for over 4,000 years.",
      "The first mosque ever built was Masjid Quba, established upon the Prophet's arrival in Madinah.",
    ];

    const ACTIONS = [
      "Take a moment to make dhikr after your next prayer — say SubhanAllah, Alhamdulillah, and Allahu Akbar 33 times each.",
      "Read one page of Quran today with reflection on its meaning.",
      "Send salawat upon the Prophet at least 10 times today.",
      "Make dua for a fellow Muslim you haven't spoken to in a while, then reach out to them.",
      "Give a sincere smile to someone today — the Prophet called it charity.",
      "Perform two voluntary rak'ahs (Duha prayer) between sunrise and midday.",
      "Recite Ayat al-Kursi after your next obligatory prayer.",
    ];

    const i = dayIndex % 7;

    return {
      gregorianDate: now.toISOString().slice(0, 10),
      ayah: dbAyah
        ? { reference: dbAyah.source, arabic: dbAyah.content, translation: dbAyah.translation ?? "" }
        : AYAT[i],
      hadith: dbHadith
        ? { arabic: dbHadith.content, translation: dbHadith.translation ?? "", source: dbHadith.source }
        : HADITHS[i],
      dua: dbDua
        ? { arabic: dbDua.content, translation: dbDua.translation ?? "" }
        : DUAS[i],
      fact:   dbFact   ? dbFact.content   : FACTS[i],
      action: dbAction ? dbAction.content : ACTIONS[i],
    };
  },
});

export const insertDailyContent = internalMutation({
  args: {
    items: v.array(v.object({
      contentType: v.union(v.literal("ayah"), v.literal("hadith"), v.literal("dua"), v.literal("fact"), v.literal("action")),
      content: v.string(),
      source: v.string(),
      translation: v.optional(v.string()),
      date: v.number(),
      adminId: v.id("users"),
    })),
  },
  handler: async (ctx, { items }) => {
    const now = Date.now();
    for (const item of items) {
      const { adminId, ...rest } = item;
      await ctx.db.insert("dailyContent", { ...rest, createdBy: adminId, createdAt: now });
    }
  },
});
