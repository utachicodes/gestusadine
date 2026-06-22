import { action, mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { internal } from "./_generated/api";
import { getCurrentUserOrThrow, requireStaff } from "./authz";

const MAX_TITLE_LEN = 500;
const MAX_CONTENT_LEN = 500_000; // 500 KB of plain text
const MAX_SOURCE_LEN = 500;

export const upsertDocument = action({
  args: {
    title: v.string(),
    content: v.string(),
    source: v.string(),
    category: v.string(),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await requireStaff(ctx as any);

    if (args.title.length > MAX_TITLE_LEN)
      throw new ConvexError(`Title must be ${MAX_TITLE_LEN} characters or fewer.`);
    if (args.content.length > MAX_CONTENT_LEN)
      throw new ConvexError(`Content must be ${MAX_CONTENT_LEN} characters or fewer.`);
    if (args.source.length > MAX_SOURCE_LEN)
      throw new ConvexError(`Source must be ${MAX_SOURCE_LEN} characters or fewer.`);

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

// --- Retrieval helpers -----------------------------------------------------
// Deterministic keyword retrieval, hardened for consistency across equivalent
// phrasings. Two queries that mean the same thing (e.g. "how to do ablution"
// vs "steps of wudu", or French vs English) map to the same concepts and so
// retrieve the same chunks. (A future upgrade to true vector/semantic search
// would require a confirmed embeddings provider.)

const STOPWORDS = new Set([
  // English
  "the", "a", "an", "of", "to", "in", "on", "for", "and", "or", "is", "are", "was",
  "do", "does", "did", "how", "what", "when", "where", "who", "why", "which", "can",
  "i", "you", "we", "my", "me", "it", "this", "that", "with", "about", "from", "as",
  "be", "have", "has", "should", "would", "could", "please", "tell", "explain",
  // French
  "le", "la", "les", "un", "une", "des", "de", "du", "et", "ou", "est", "sont",
  "comment", "quoi", "quand", "ou", "qui", "pourquoi", "quel", "quelle", "je", "tu",
  "vous", "nous", "mon", "ma", "ce", "cette", "avec", "sur", "pour", "dans", "que",
]);

// Equivalence classes: the first item is the canonical id. Members include
// English, French, and common transliterations of the same Islamic concept.
const SYNONYM_GROUPS: string[][] = [
  ["prayer", "prayers", "salah", "salat", "priere", "prieres"],
  ["ablution", "ablutions", "wudu", "wudoo", "woudou"],
  ["ghusl", "purification", "tahara", "taharah"],
  ["fasting", "fast", "sawm", "siyam", "jeune", "ramadan"],
  ["charity", "alms", "zakat", "zakah", "sadaqah", "sadaqa", "aumone"],
  ["pilgrimage", "hajj", "umrah", "pelerinage"],
  ["prophet", "messenger", "muhammad", "rasul", "nabi", "prophete", "messager"],
  ["allah", "god", "dieu"],
  ["quran", "koran", "coran", "quranic"],
  ["hadith", "sunnah", "narration", "tradition"],
  ["faith", "belief", "iman", "aqidah", "creed", "croyance", "foi"],
  ["sin", "sins", "haram", "forbidden", "peche", "interdit"],
  ["permissible", "halal", "allowed", "permis", "licite"],
  ["marriage", "nikah", "wedding", "mariage"],
  ["divorce", "talaq"],
  ["inheritance", "mirath", "heritage"],
  ["repentance", "tawbah", "forgiveness", "pardon", "repentir"],
  ["death", "funeral", "janazah", "mort", "deces"],
  ["intention", "niyyah", "niyah"],
];

const TERM_TO_CONCEPT = new Map<string, string>();
const CONCEPT_TO_TERMS = new Map<string, string[]>();
for (const group of SYNONYM_GROUPS) {
  const id = group[0];
  CONCEPT_TO_TERMS.set(id, group);
  for (const term of group) TERM_TO_CONCEPT.set(term, id);
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip Latin diacritics
    .replace(/[ً-ٰٟـ]/g, "") // strip Arabic harakat + tatweel
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9؀-ۿ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWord(haystack: string, term: string): number {
  const esc = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(^|[^a-z0-9\\u0600-\\u06ff])${esc}([^a-z0-9\\u0600-\\u06ff]|$)`, "g");
  let n = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(haystack)) !== null) {
    n++;
    if (re.lastIndex === m.index) re.lastIndex++;
  }
  return n;
}

export const search = action({
  args: {
    query: v.string(),
    category: v.optional(v.string()),
    topK: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Please sign in to use search.");

    const topK = args.topK ?? 5;
    const qNorm = normalize(args.query);
    const qWords = qNorm
      .split(" ")
      .filter((w) => w.length >= 2 && !STOPWORDS.has(w));

    // Build the set of distinct concepts the query is about, each with its
    // full list of equivalent surface terms to look for.
    const conceptTerms = new Map<string, string[]>();
    for (const w of qWords) {
      const id = TERM_TO_CONCEPT.get(w) ?? w;
      if (!conceptTerms.has(id)) conceptTerms.set(id, CONCEPT_TO_TERMS.get(id) ?? [w]);
    }

    // Nothing meaningful to search for — return no context (the model then
    // applies its Silence Rule consistently rather than improvising).
    if (conceptTerms.size === 0) return [];

    const chunks = await ctx.runQuery(internal.ragInternal.listChunks, {
      category: args.category,
    });

    const scored = chunks
      .map((chunk: any) => {
        const cNorm = normalize(chunk.content);
        let coverage = 0; // how many distinct query concepts appear
        let freq = 0; // total matched-term occurrences
        for (const terms of conceptTerms.values()) {
          let present = false;
          for (const t of terms) {
            const c = countWord(cNorm, t);
            if (c > 0) {
              present = true;
              freq += c;
            }
          }
          if (present) coverage += 1;
        }
        const exact = cNorm.includes(qNorm) ? 1 : 0;
        // Concept coverage dominates, so a chunk touching more of the query's
        // distinct ideas always outranks one that merely repeats a single word.
        const score = coverage * 100 + freq + exact * 50;
        return { ...chunk, score, coverage };
      })
      .filter((c: any) => c.coverage > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, topK)
      .map(({ coverage, ...rest }: any) => rest);

    return scored;
  },
});

export const listDocuments = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx);
    if (args.category) {
      return ctx.db.query("ragDocuments")
        .withIndex("category", (idx) => idx.eq("category", args.category!))
        .order("desc")
        .take(50);
    }
    return ctx.db.query("ragDocuments").order("desc").take(50);
  },
});

export const getDocumentById = query({
  args: { id: v.id("ragDocuments") },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx);
    return ctx.db.get(args.id);
  },
});

export const deleteDocument = mutation({
  args: { id: v.id("ragDocuments") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Only admins or the original uploader may delete documents.
    const doc = await ctx.db.get(args.id);
    if (!doc) return; // already gone
    const isAdmin = user.role === "admin" || user.role === "system";
    const isOwner = doc.uploadedBy !== undefined && doc.uploadedBy === user._id;
    if (!isAdmin && !isOwner) {
      throw new ConvexError("You do not have permission to delete this document.");
    }

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
