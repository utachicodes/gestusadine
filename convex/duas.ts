import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./authz";

export const listDuaCategories = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("duaCategories")
      .withIndex("sortOrder")
      .collect();
  },
});

export const listDuas = query({
  args: {
    categoryId: v.optional(v.id("duaCategories")),
  },
  handler: async (ctx, args) => {
    if (args.categoryId) {
      return ctx.db
        .query("duas")
        .withIndex("categoryId", (q) => q.eq("categoryId", args.categoryId!))
        .collect();
    }
    return ctx.db.query("duas").collect();
  },
});

export const getDuaById = query({
  args: { id: v.id("duas") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const searchDuas = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const q = args.query.trim().toLowerCase();
    if (!q) return [];
    const all = await ctx.db.query("duas").collect();
    return all.filter(
      (d) =>
        d.title.en.toLowerCase().includes(q) ||
        d.title.fr.toLowerCase().includes(q) ||
        d.arabicText.includes(args.query) ||
        (d.transliteration ?? "").toLowerCase().includes(q) ||
        d.translation.en.toLowerCase().includes(q) ||
        d.translation.fr.toLowerCase().includes(q),
    );
  },
});

export const toggleFavorite = mutation({
  args: { duaId: v.id("duas") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return { favorited: false };

    const existing = await ctx.db
      .query("userDuaFavorites")
      .withIndex("userId_duaId", (q) =>
        q.eq("userId", user._id).eq("duaId", args.duaId),
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { favorited: false };
    }

    await ctx.db.insert("userDuaFavorites", {
      userId: user._id,
      duaId: args.duaId,
    });
    return { favorited: true };
  },
});

export const getFavoriteDuas = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const favs = await ctx.db
      .query("userDuaFavorites")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();

    const duas = await Promise.all(
      favs.map((f) => ctx.db.get(f.duaId)),
    );

    return duas.filter((d) => d !== null);
  },
});

export const getUserFavorites = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const favs = await ctx.db
      .query("userDuaFavorites")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();

    return favs.map((f) => f.duaId);
  },
});
