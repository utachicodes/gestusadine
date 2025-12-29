import fs from 'fs/promises';
import path from 'path';
import { freeEmbeddingService } from '../embedding-service.ts';
import { logger } from '../../shared/logger.ts';
import { createClient } from '@supabase/supabase-js';

export interface Document {
    id: string;
    title: string;
    content: string;
    source: string;
    uploadedAt: string;
    category: string;
}

export interface VectorEntry {
    id: string;
    docId: string;
    chunkIndex: number;
    text: string;
    embedding: number[];
    metadata: {
        title: string;
        source: string;
        category: string;
    };
}

export interface SearchResult {
    entry: VectorEntry;
    score: number;
}

export interface RAGResult {
    context: string;
    sources: Array<{ title: string; source: string }>;
    relevanceScore: number;
}

const VECTOR_DB_PATH = path.join(process.cwd(), 'backend', 'data', 'vectors.json');
const DOCUMENTS_DB_PATH = path.join(process.cwd(), 'backend', 'data', 'documents.json');
const DATA_DIR = path.join(process.cwd(), 'backend', 'data');

const SUPABASE_VECTORS_TABLE = process.env.SUPABASE_RAG_VECTORS_TABLE || 'rag_vectors';
const SUPABASE_DOCS_TABLE = process.env.SUPABASE_RAG_DOCS_TABLE || 'rag_ingested_documents';

function getSupabaseAdmin() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key, { auth: { persistSession: false } });
}

const CHUNK_SIZE = 500; // Characters per chunk
const CHUNK_OVERLAP = 100; // Overlap between chunks

export class VectorStore {
    private vectors: VectorEntry[] = [];
    private log = logger.prefixed('VectorStore');
    private supabase = getSupabaseAdmin();

    async init() {
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase
                    .from(SUPABASE_VECTORS_TABLE)
                    .select('*');

                if (error) throw error;

                this.vectors = (data ?? []).map((row: any) => ({
                    id: String(row.id),
                    docId: String(row.doc_id),
                    chunkIndex: Number(row.chunk_index),
                    text: String(row.text),
                    embedding: Array.isArray(row.embedding) ? row.embedding : [],
                    metadata: {
                        title: String(row.title ?? ''),
                        source: String(row.source ?? ''),
                        category: String(row.category ?? 'general'),
                    },
                }));
                this.log.info(`Loaded ${this.vectors.length} vectors (Supabase)`);
                return;
            } catch {
                // fall back to local
            }
        }

        try {
            await fs.mkdir(DATA_DIR, { recursive: true });
            const data = await fs.readFile(VECTOR_DB_PATH, 'utf-8');
            this.vectors = JSON.parse(data);
            this.log.info(`Loaded ${this.vectors.length} vectors`);
        } catch {
            this.vectors = [];
            this.log.debug('Initialized empty vector store');
        }
    }

    async addVectors(entries: VectorEntry[]) {
        this.vectors.push(...entries);
        await this.save();
    }

    async save() {
        if (this.supabase) {
            try {
                const rows = this.vectors.map((v) => ({
                    id: v.id,
                    doc_id: v.docId,
                    chunk_index: v.chunkIndex,
                    text: v.text,
                    embedding: v.embedding,
                    title: v.metadata.title,
                    source: v.metadata.source,
                    category: v.metadata.category,
                }));

                const { error } = await this.supabase
                    .from(SUPABASE_VECTORS_TABLE)
                    .upsert(rows, { onConflict: 'id' });

                if (!error) return;
            } catch {
                // fall back to local
            }
        }

        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(VECTOR_DB_PATH, JSON.stringify(this.vectors, null, 2));
    }

    async search(queryEmbedding: number[], topK: number = 5): Promise<SearchResult[]> {
        if (this.vectors.length === 0) return [];

        const scored = this.vectors.map(entry => ({
            entry,
            score: this.cosineSimilarity(queryEmbedding, entry.embedding)
        }));

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, topK);
    }

    private cosineSimilarity(a: number[], b: number[]): number {
        if (a.length !== b.length) return 0;
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        const denominator = Math.sqrt(normA) * Math.sqrt(normB);
        return denominator === 0 ? 0 : dotProduct / denominator;
    }

    async deleteForDoc(docId: string) {
        this.vectors = this.vectors.filter(v => v.docId !== docId);
        if (this.supabase) {
            try {
                await this.supabase.from(SUPABASE_VECTORS_TABLE).delete().eq('doc_id', docId);
            } catch {
                // ignore; save() will fallback
            }
        }
        await this.save();
    }

    getAll(): VectorEntry[] {
        return [...this.vectors];
    }
}

export class DocumentManager {
    private documents: Map<string, Document> = new Map();
    private log = logger.prefixed('DocumentManager');
    private supabase = getSupabaseAdmin();

    async init() {
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase
                    .from(SUPABASE_DOCS_TABLE)
                    .select('*');
                if (error) throw error;

                this.documents = new Map();
                for (const row of data ?? []) {
                    this.documents.set(String((row as any).id), {
                        id: String((row as any).id),
                        title: String((row as any).title ?? ''),
                        content: String((row as any).content ?? ''),
                        source: String((row as any).source ?? ''),
                        category: String((row as any).category ?? 'general'),
                        uploadedAt: String((row as any).uploaded_at ?? new Date().toISOString()),
                    });
                }
                this.log.info(`Loaded ${this.documents.size} documents (Supabase)`);
                return;
            } catch {
                // fall back to local
            }
        }

        try {
            const data = await fs.readFile(DOCUMENTS_DB_PATH, 'utf-8');
            const docs = JSON.parse(data) as Document[];
            for (const doc of docs) {
                this.documents.set(doc.id, doc);
            }
            this.log.info(`Loaded ${this.documents.size} documents`);
        } catch {
            this.documents = new Map();
            this.log.debug('Initialized empty document store');
        }
    }

    async addDocument(doc: Document) {
        this.documents.set(doc.id, doc);
        await this.save();
    }

    async removeDocument(docId: string) {
        this.documents.delete(docId);
        await this.save();
    }

    async save() {
        const docs = Array.from(this.documents.values());

        if (this.supabase) {
            try {
                const rows = docs.map((d) => ({
                    id: d.id,
                    title: d.title,
                    content: d.content,
                    source: d.source,
                    category: d.category,
                    uploaded_at: d.uploadedAt,
                }));
                const { error } = await this.supabase.from(SUPABASE_DOCS_TABLE).upsert(rows, { onConflict: 'id' });
                if (!error) return;
            } catch {
                // fall back to local
            }
        }

        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(DOCUMENTS_DB_PATH, JSON.stringify(docs, null, 2));
    }

    getDocument(docId: string): Document | undefined {
        return this.documents.get(docId);
    }

    getAllDocuments(): Document[] {
        return Array.from(this.documents.values());
    }
}

export class RAGService {
    private vectorStore: VectorStore;
    private documentManager: DocumentManager;

    constructor() {
        this.vectorStore = new VectorStore();
        this.documentManager = new DocumentManager();
    }

    async init() {
        await this.vectorStore.init();
        await this.documentManager.init();
        // Initialize free embedding service
        await freeEmbeddingService.initialize();
        logger.info('[RAG] Using free embedding service:', freeEmbeddingService.getModelInfo());
    }

    /**
     * Chunk text into overlapping segments
     */
    private chunkText(text: string): string[] {
        const chunks: string[] = [];
        for (let i = 0; i < text.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
            chunks.push(text.substring(i, i + CHUNK_SIZE));
        }
        return chunks.filter(chunk => chunk.trim().length > 0);
    }

    /**
     * Ingest a document into the RAG system
     */
    async ingestDocument(docId: string, title: string, content: string, source: string, category: string = 'general') {
        const ragLogger = logger.prefixed('RAG.Ingest');
        ragLogger.info(`Ingesting document "${title}" (${docId})`);

        // Save document metadata
        const doc: Document = {
            id: docId,
            title,
            content,
            source,
            category,
            uploadedAt: new Date().toISOString()
        };
        await this.documentManager.addDocument(doc);

        // Chunk and embed the document
        const chunks = this.chunkText(content);
        const entries: VectorEntry[] = [];

        for (let i = 0; i < chunks.length; i++) {
            try {
                const embedding = await freeEmbeddingService.getEmbedding(chunks[i]);
                entries.push({
                    id: `${docId}_${i}`,
                    docId,
                    chunkIndex: i,
                    text: chunks[i],
                    embedding,
                    metadata: {
                        title,
                        source,
                        category
                    }
                });

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error: any) {
                ragLogger.error(`Failed to embed chunk ${i} of ${docId}`, error);
            }
        }

        await this.vectorStore.addVectors(entries);
        ragLogger.info(`Ingested ${entries.length} chunks from "${title}"`);
    }

    /**
     * Remove a document and its embeddings
     */
    async removeDocument(docId: string) {
        const ragLogger = logger.prefixed('RAG.Remove');
        ragLogger.info(`Removing document ${docId}`);
        await this.documentManager.removeDocument(docId);
        await this.vectorStore.deleteForDoc(docId);
    }

    /**
     * Search for relevant context using semantic similarity
     */
    async search(query: string, topK: number = 5, category?: string): Promise<RAGResult> {
        try {
            // Get embedding for query (using free embedding service)
            const queryEmbedding = await freeEmbeddingService.getEmbedding(query);

            // Search vector store
            const results = await this.vectorStore.search(queryEmbedding, topK);

            if (results.length === 0) {
                return {
                    context: '',
                    sources: [],
                    relevanceScore: 0
                };
            }

            // Filter results by category if provided
            let filteredResults = results;
            if (category && category !== 'general') {
                filteredResults = results.filter(r => r.entry.metadata.category === category);
                // If filtering removed all results, return empty (strict isolation)
                // Or fallback? User wants strict isolation ("IT'S ALL OF THEM").
                if (filteredResults.length === 0) {
                    return {
                        context: '',
                        sources: [],
                        relevanceScore: 0
                    };
                }
            }

            // Build context from top filtered results
            const contextParts = filteredResults.map(r => `[${r.entry.metadata.title}]\n${r.entry.text}`);
            const context = contextParts.join('\n\n---\n\n');

            // Extract unique sources
            const sourcesSet = new Set<string>();
            const sources: Array<{ title: string; source: string }> = [];
            for (const result of filteredResults) {
                const key = `${result.entry.metadata.title}|${result.entry.metadata.source}`;
                if (!sourcesSet.has(key)) {
                    sourcesSet.add(key);
                    sources.push({
                        title: result.entry.metadata.title,
                        source: result.entry.metadata.source
                    });
                }
            }

            // Average relevance score
            const relevanceScore =
                filteredResults.reduce((sum, r) => sum + Math.max(0, r.score), 0) / filteredResults.length;

            return {
                context,
                sources,
                relevanceScore
            };
        } catch (error: any) {
            console.error('[RAG] Search failed:', error.message);
            return {
                context: '',
                sources: [],
                relevanceScore: 0
            };
        }
    }

    /**
     * Get all indexed documents
     */
    getAllDocuments(): Document[] {
        return this.documentManager.getAllDocuments();
    }

    /**
     * Get document by ID
     */
    getDocument(docId: string): Document | undefined {
        return this.documentManager.getDocument(docId);
    }
}

export const ragService = new RAGService();
