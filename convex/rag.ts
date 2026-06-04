import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { getCurrentUserOrThrow } from "./authz";

export const upsertDocument = action({
  args: {
    title: v.string(),
    content: v.string(),
    source: v.string(),
    category: v.string(),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx as any);

    const docId = await ctx.runMutation(internal.ragInternal.insertDocument, {
      title: args.title,
      content: args.content,
      source: args.source,
      category: args.category,
      uploadedBy: user._id,
      uploadedAt: Date.now(),
      fileId: args.storageId,
    });

    const chunkSize = 500;
    const chunks = [];
    for (let i = 0; i < args.content.length; i += chunkSize) {
      chunks.push({
        content: args.content.substring(i, i + chunkSize),
        category: args.category,
      });
    }

    if (chunks.length > 0) {
      await ctx.runMutation(internal.ragInternal.insertChunkBatch, {
        chunks,
        documentId: docId,
      });
    }

    return { docId, chunkCount: chunks.length };
  },
});

export const search = action({
  args: {
    query: v.string(),
    category: v.optional(v.string()),
    topK: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const queryLower = args.query.toLowerCase();
    const topK = args.topK ?? 5;

    const chunks = await ctx.runQuery(internal.ragInternal.listChunks, {
      category: args.category,
    });

    const scored = chunks
      .map((chunk: any) => {
        const contentLower = chunk.content.toLowerCase();
        let score = 0;
        const words = queryLower.split(/\s+/);
        for (const word of words) {
          if (word.length < 2) continue;
          const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
          const matches = contentLower.match(regex);
          if (matches) score += matches.length;
        }
        score += (contentLower.includes(queryLower) ? 10 : 0);
        return { ...chunk, score };
      })
      .filter((c: any) => c.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, topK);

    return scored;
  },
});

export const listDocuments = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("ragDocuments");
    if (args.category) {
      q = q.withIndex("category", (idx: any) =>
        idx.eq("category", args.category!)
      );
    }
    return q.order("desc").take(50);
  },
});

export const getDocumentById = query({
  args: { id: v.id("ragDocuments") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const deleteDocument = mutation({
  args: { id: v.id("ragDocuments") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const chunks = await ctx.db
      .query("ragChunks")
      .withIndex("documentId", (q) => q.eq("documentId", args.id))
      .collect();
    for (const chunk of chunks) {
      await ctx.db.delete(chunk._id);
    }
    await ctx.db.delete(args.id);
  },
});
