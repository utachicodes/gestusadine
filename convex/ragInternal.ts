import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const insertDocument = internalMutation({
  args: {
    title: v.string(),
    content: v.string(),
    source: v.string(),
    category: v.string(),
    uploadedBy: v.optional(v.id("users")),
    uploadedAt: v.number(),
    fileId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("ragDocuments", args);
  },
});

export const insertChunkBatch = internalMutation({
  args: {
    chunks: v.array(
      v.object({
        content: v.string(),
        category: v.string(),
      })
    ),
    documentId: v.id("ragDocuments"),
  },
  handler: async (ctx, args) => {
    for (const chunk of args.chunks) {
      await ctx.db.insert("ragChunks", {
        documentId: args.documentId,
        content: chunk.content,
        category: chunk.category,
      });
    }
  },
});

export const listChunks = internalQuery({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("ragChunks");
    if (args.category) {
      q = q.withIndex("category", (idx: any) =>
        idx.eq("category", args.category!)
      );
    }
    return q.collect();
  },
});
