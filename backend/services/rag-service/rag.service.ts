import fs from 'fs/promises';
import path from 'path';
import { freeEmbeddingService } from '../embedding-service.js';
import { logger } from '../../shared/logger.js';
import { db } from '../api-gateway/src/lib/firebase-admin.js';

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

const FIRESTORE_VECTORS_COLLECTION = 'rag_vectors';
const FIRESTORE_DOCS_COLLECTION = 'rag_ingested_documents';

// Force Firestore check - we want this to be the primary storage
async function getFirestoreAvailable(): Promise<boolean> {
    try {
        await db.collection(FIRESTORE_VECTORS_COLLECTION).limit(1).get();
        return true;
    } catch (error) {
        console.warn('⚠️  Firestore check failed. Using local storage as fallback.', error);
        return false;
    }
}

const CHUNK_SIZE = 500; // Characters per chunk
const CHUNK_OVERLAP = 100; // Overlap between chunks

export class VectorStore {
    private vectors: VectorEntry[] = [];
    private log = logger.prefixed('VectorStore');
    private useFirestore = false;

    async init() {
        this.useFirestore = await getFirestoreAvailable();

        if (this.useFirestore) {
            try {
                const snapshot = await db.collection(FIRESTORE_VECTORS_COLLECTION).get();

                this.vectors = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: String(doc.id),
                        docId: String(data.doc_id),
                        chunkIndex: Number(data.chunk_index),
                        text: String(data.text),
                        embedding: Array.isArray(data.embedding) ? data.embedding : [],
                        metadata: {
                            title: String(data.title ?? ''),
                            source: String(data.source ?? ''),
                            category: String(data.category ?? 'general'),
                        },
                    };
                });
                this.log.info(`Loaded ${this.vectors.length} vectors (Firestore)`);
                return;
            } catch (error) {
                console.error('Error loading from Firestore:', error);
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
        if (this.useFirestore) {
            try {
                const batch = db.batch();
                for (const v of this.vectors) {
                    const docRef = db.collection(FIRESTORE_VECTORS_COLLECTION).doc(v.id);
                    batch.set(docRef, {
                        doc_id: v.docId,
                        chunk_index: v.chunkIndex,
                        text: v.text,
                        embedding: v.embedding,
                        title: v.metadata.title,
                        source: v.metadata.source,
                        category: v.metadata.category,
                    }, { merge: true });
                }
                await batch.commit();
                return;
            } catch (error) {
                console.error('Error saving to Firestore:', error);
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
        if (this.useFirestore) {
            try {
                const snapshot = await db.collection(FIRESTORE_VECTORS_COLLECTION)
                    .where('doc_id', '==', docId)
                    .get();
                const batch = db.batch();
                snapshot.docs.forEach(doc => batch.delete(doc.ref));
                await batch.commit();
            } catch (error) {
                console.error('Error deleting from Firestore:', error);
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
    private useFirestore = false;

    async init() {
        this.useFirestore = await getFirestoreAvailable();

        if (this.useFirestore) {
            try {
                const snapshot = await db.collection(FIRESTORE_DOCS_COLLECTION).get();

                this.documents = new Map();
                for (const doc of snapshot.docs) {
                    const data = doc.data();
                    this.documents.set(doc.id, {
                        id: doc.id,
                        title: String(data.title ?? ''),
                        content: String(data.content ?? ''),
                        source: String(data.source ?? ''),
                        category: String(data.category ?? 'general'),
                        uploadedAt: String(data.uploaded_at ?? new Date().toISOString()),
                    });
                }
                this.log.info(`Loaded ${this.documents.size} documents (Firestore)`);
                return;
            } catch (error) {
                console.error('Error loading documents from Firestore:', error);
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

        if (this.useFirestore) {
            try {
                const batch = db.batch();
                for (const d of docs) {
                    const docRef = db.collection(FIRESTORE_DOCS_COLLECTION).doc(d.id);
                    batch.set(docRef, {
                        title: d.title,
                        content: d.content,
                        source: d.source,
                        category: d.category,
                        uploaded_at: d.uploadedAt,
                    }, { merge: true });
                }
                await batch.commit();
                return;
            } catch (error) {
                console.error('Error saving documents to Firestore:', error);
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
