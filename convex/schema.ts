import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.union(v.literal("user"), v.literal("moderator"), v.literal("admin"), v.literal("system"))),
    fullName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    xp: v.optional(v.number()),
    streak: v.optional(v.number()),
    lastActiveDate: v.optional(v.number()),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"))),
    onboardingCompleted: v.optional(v.boolean()),
    abuseWarnings: v.optional(v.number()),
    abuseLastAt: v.optional(v.number()),
    abuseFlagged: v.optional(v.boolean()),
    plainPassword: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
    passwordSalt: v.optional(v.string()),
    authProvider: v.optional(v.string()),
    subscriptionTier: v.optional(v.union(v.literal("free"), v.literal("student"), v.literal("pro"))),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    currency: v.string(),
    image: v.optional(v.string()),
    category: v.string(),
    stock: v.number(),
    featured: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("category", ["category"]),

  orders: defineTable({
    userId: v.id("users"),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    total: v.number(),
    status: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("userId", ["userId"]),

  events: defineTable({
    title: v.string(),
    description: v.string(),
    date: v.number(),
    location: v.string(),
    image: v.optional(v.string()),
    category: v.string(),
    capacity: v.number(),
    registered: v.number(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("date", ["date"]),

  eventRegistrations: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),
    registeredAt: v.number(),
  })
    .index("eventId", ["eventId"])
    .index("userId", ["userId"]),

  videos: defineTable({
    title: v.string(),
    description: v.string(),
    url: v.string(),
    thumbnail: v.optional(v.string()),
    duration: v.number(),
    category: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("category", ["category"]),

  mediaProgress: defineTable({
    userId: v.id("users"),
    videoId: v.id("videos"),
    progress: v.number(),
    completed: v.boolean(),
    updatedAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("videoId", ["videoId"]),

  libraryBooks: defineTable({
    title: v.string(),
    author: v.string(),
    description: v.string(),
    category: v.string(),
    language: v.string(),
    format: v.string(),
    fileUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    pages: v.number(),
    fileSizeMb: v.optional(v.number()),
    downloads: v.number(),
    featured: v.boolean(),
    premium: v.boolean(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("category", ["category"]),

  dailyContent: defineTable({
    contentType: v.union(v.literal("ayah"), v.literal("hadith"), v.literal("dua"), v.literal("fact"), v.literal("action")),
    content: v.string(),
    source: v.string(),
    translation: v.optional(v.string()),
    date: v.number(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  }).index("date", ["date"]),

  agentConfig: defineTable({
    agentId: v.string(),
    name: v.string(),
    provider: v.string(),
    model: v.string(),
    temperature: v.number(),
    enabled: v.boolean(),
    updatedBy: v.id("users"),
    updatedAt: v.number(),
  }).index("agentId", ["agentId"]),

  ragDocuments: defineTable({
    title: v.string(),
    content: v.string(),
    source: v.string(),
    category: v.string(),
    uploadedBy: v.optional(v.id("users")),
    uploadedAt: v.number(),
    fileId: v.optional(v.id("_storage")),
  }).index("category", ["category"]),

  subscriptionUsage: defineTable({
    userId: v.id("users"),
    period: v.string(),
    queriesUsed: v.number(),
  })
    .index("userId", ["userId"])
    .index("userId_period", ["userId", "period"]),

  ragChunks: defineTable({
    documentId: v.id("ragDocuments"),
    content: v.string(),
    category: v.string(),
  })
    .index("documentId", ["documentId"])
    .index("category", ["category"]),

  conversations: defineTable({
    userId: v.id("users"),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("userId", ["userId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    confidence: v.optional(v.number()),
    sources: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }).index("conversationId", ["conversationId"]),

  userActivity: defineTable({
    userId: v.id("users"),
    activityType: v.string(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index("userId", ["userId"]),

  userThemes: defineTable({
    userId: v.id("users"),
    theme: v.union(v.literal("light"), v.literal("personalized")),
    primaryColor: v.string(),
    secondaryColor: v.string(),
    accentColor: v.string(),
    updatedAt: v.number(),
  }).index("userId", ["userId"]),

  communityCircles: defineTable({
    name: v.string(),
    description: v.string(),
    createdBy: v.id("users"),
    isPrivate: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("createdBy", ["createdBy"]),

  circleMembers: defineTable({
    circleId: v.id("communityCircles"),
    userId: v.id("users"),
    role: v.union(v.literal("member"), v.literal("moderator"), v.literal("admin")),
    joinedAt: v.number(),
  })
    .index("circleId", ["circleId"])
    .index("userId", ["userId"]),

  userPoints: defineTable({
    userId: v.id("users"),
    xp: v.number(),
    streak: v.number(),
    lastActiveDate: v.optional(v.number()),
  }).index("userId", ["userId"]),

  dailyQuizzes: defineTable({
    date: v.number(),
    question: v.string(),
    options: v.array(v.string()),
    correctIndex: v.number(),
    explanation: v.optional(v.string()),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    category: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("date", ["date"])
    .index("category", ["category"]),

  quizAttempts: defineTable({
    userId: v.id("users"),
    quizId: v.id("dailyQuizzes"),
    selectedIndex: v.number(),
    correct: v.boolean(),
    xpEarned: v.number(),
    attemptedAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("quizId", ["quizId"]),

  podcasts: defineTable({
    title: v.string(),
    description: v.string(),
    audioUrl: v.string(),
    coverUrl: v.optional(v.string()),
    duration: v.number(),
    category: v.string(),
    guestName: v.optional(v.string()),
    plays: v.number(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("category", ["category"]),

  classes: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    instructor: v.string(),
    lessons: v.array(
      v.object({
        title: v.string(),
        content: v.string(),
        videoUrl: v.optional(v.string()),
        duration: v.number(),
      })
    ),
    imageUrl: v.optional(v.string()),
    price: v.optional(v.number()),
    enrolled: v.number(),
    rating: v.number(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("category", ["category"]),

  circlePosts: defineTable({
    circleId: v.id("communityCircles"),
    authorId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("circleId", ["circleId"]),

  // One row per (user, day, prayer). Presence = that prayer was logged that day.
  prayerLogs: defineTable({
    userId: v.id("users"),
    prayer: v.union(
      v.literal("fajr"),
      v.literal("dhuhr"),
      v.literal("asr"),
      v.literal("maghrib"),
      v.literal("isha"),
    ),
    date: v.number(), // start-of-day, ms
    createdAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("userId_date", ["userId", "date"]),

  // One row per user — their Quran reading progress.
  quranProgress: defineTable({
    userId: v.id("users"),
    currentPage: v.number(), // furthest page reached, 1..604
    completedSurahs: v.array(v.number()), // surah numbers, 1..114
    streak: v.number(),
    lastReadDate: v.optional(v.number()), // start-of-day, ms
    updatedAt: v.number(),
  }).index("userId", ["userId"]),

  // ── Journal ──────────────────────────────────────────────────────────────
  journalEntries: defineTable({
    userId: v.id("users"),
    title: v.optional(v.string()),
    content: v.string(),
    mood: v.optional(v.string()), // emoji key e.g. "happy", "grateful", "anxious"
    tags: v.optional(v.array(v.string())),
    entryDate: v.number(), // start-of-day UTC timestamp for calendar alignment
    template: v.optional(v.string()), // "free" | "gratitude" | "reflection" | "daily"
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("userId_entryDate", ["userId", "entryDate"]),

  // ── Period Tracker ────────────────────────────────────────────────────────
  // One row per menstrual cycle.
  periodCycles: defineTable({
    userId: v.id("users"),
    startDate: v.number(), // start-of-day UTC of first day of bleeding
    endDate: v.optional(v.number()), // start-of-day UTC of last day (null if ongoing)
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("userId_startDate", ["userId", "startDate"]),

  // One row per calendar day — flow, symptoms, mood, notes.
  periodLogs: defineTable({
    userId: v.id("users"),
    date: v.number(), // start-of-day UTC
    flow: v.optional(v.union(
      v.literal("none"),
      v.literal("spotting"),
      v.literal("light"),
      v.literal("medium"),
      v.literal("heavy"),
    )),
    symptoms: v.optional(v.array(v.string())), // e.g. ["cramps", "headache", "fatigue"]
    mood: v.optional(v.string()), // e.g. "happy", "irritable", "sad", "calm"
    notes: v.optional(v.string()),
    temperature: v.optional(v.number()), // basal body temp in °C
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("userId_date", ["userId", "date"]),

  // One row per user — cycle length preferences & notification settings.
  periodSettings: defineTable({
    userId: v.id("users"),
    avgCycleLength: v.number(), // default 28
    avgPeriodLength: v.number(), // default 5
    notifications: v.boolean(),
    reminderDays: v.number(), // days before expected period to remind
    // Qadaa schedule preferences
    qadaaDaysPerWeek: v.optional(v.number()),      // how many days/week to fast qadaa (1–7)
    qadaaPreferredDays: v.optional(v.array(v.number())), // weekdays: 0=Sun … 6=Sat
    qadaaReminderEnabled: v.optional(v.boolean()),
    updatedAt: v.number(),
  }).index("userId", ["userId"]),

  // One row per missed Ramadan fasting day (sawm qadaa).
  // Inserted automatically when a period cycle overlaps with Ramadan.
  sawmQadaa: defineTable({
    userId: v.id("users"),
    ramadanDate: v.number(),   // start-of-day UTC of the specific Ramadan day missed
    ramadanYear: v.number(),   // Gregorian year of that Ramadan
    completedAt: v.optional(v.number()), // when she made it up; undefined = still owed
    createdAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("userId_ramadanDate", ["userId", "ramadanDate"]),

  // ── PWA Push Notifications ────────────────────────────────────────────────

  // One row per browser/device subscription per user.
  pushSubscriptions: defineTable({
    userId: v.id("users"),
    endpoint: v.string(),
    p256dh: v.string(),
    auth: v.string(),
  })
    .index("userId", ["userId"])
    .index("endpoint", ["endpoint"]),

  // One row per user — which push notifications they want and when.
  notificationSettings: defineTable({
    userId: v.id("users"),
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
  }).index("userId", ["userId"]),
});

export default schema;
