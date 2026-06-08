import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getCurrentUserOrThrow, getCurrentUser, requireStaff } from "./authz";

export const list = query({
  args: { date: v.optional(v.number()) },
  handler: async (ctx, args) => {
    if (args.date) {
      return ctx.db
        .query("dailyQuizzes")
        .withIndex("date", (q) => q.eq("date", args.date!))
        .collect();
    }
    return ctx.db.query("dailyQuizzes").order("desc").take(100);
  },
});

export const getTodayQuiz = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().setHours(0, 0, 0, 0);
    return ctx.db
      .query("dailyQuizzes")
      .withIndex("date", (q) => q.eq("date", today))
      .first();
  },
});

export const create = mutation({
  args: {
    date: v.number(),
    question: v.string(),
    options: v.array(v.string()),
    correctIndex: v.number(),
    explanation: v.optional(v.string()),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireStaff(ctx);
    return ctx.db.insert("dailyQuizzes", {
      ...args,
      createdBy: user._id,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("dailyQuizzes"),
    question: v.optional(v.string()),
    options: v.optional(v.array(v.string())),
    correctIndex: v.optional(v.number()),
    explanation: v.optional(v.string()),
    difficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("dailyQuizzes") },
  handler: async (ctx, args) => {
    await requireStaff(ctx);
    await ctx.db.delete(args.id);
  },
});

export const submitAnswer = mutation({
  args: {
    quizId: v.id("dailyQuizzes"),
    selectedIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) throw new ConvexError("This quiz is no longer available.");

    const correct = args.selectedIndex === quiz.correctIndex;
    const xpEarned = correct ? (quiz.difficulty === "easy" ? 10 : quiz.difficulty === "medium" ? 25 : 50) : 0;

    await ctx.db.insert("quizAttempts", {
      userId: user._id,
      quizId: args.quizId,
      selectedIndex: args.selectedIndex,
      correct,
      xpEarned,
      attemptedAt: Date.now(),
    });

    if (xpEarned > 0) {
      await ctx.db.patch(user._id, { xp: (user.xp ?? 0) + xpEarned });
    }

    return { correct, xpEarned, correctIndex: quiz.correctIndex, explanation: quiz.explanation };
  },
});

export const getTodaysAttempt = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    const today = new Date().setHours(0, 0, 0, 0);
    const quiz = await ctx.db
      .query("dailyQuizzes")
      .withIndex("date", (q) => q.eq("date", today))
      .first();
    if (!quiz) return null;
    return ctx.db
      .query("quizAttempts")
      .withIndex("quizId", (q) => q.eq("quizId", quiz._id))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();
  },
});
