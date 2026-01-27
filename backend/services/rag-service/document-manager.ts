import { DocumentMetadata } from '../../shared/document-types.js';
import fs from 'fs/promises';
import path from 'path';
import { ragService } from './rag.service.js';
import { db, storage } from '../api-gateway/src/lib/firebase-admin.js';

const UPLOAD_DIR = path.join(process.cwd(), 'backend', 'uploads');
const METADATA_FILE = path.join(process.cwd(), 'backend', 'documents.json');

const FIRESTORE_DOCS_COLLECTION = 'rag_documents';
const STORAGE_BUCKET_NAME = process.env.FIREBASE_STORAGE_BUCKET || 'rag-documents';

// Ensure upload directory exists
async function ensureUploadDir() {
    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
}

export class DocumentManager {
    private documents: Record<string, DocumentMetadata> = {};

    async init() {
        await ensureUploadDir();
        try {
            const snapshot = await db.collection(FIRESTORE_DOCS_COLLECTION)
                .orderBy('uploaded_at', 'desc')
                .get();

            const next: Record<string, DocumentMetadata> = {};
            snapshot.forEach((doc) => {
                const data = doc.data();
                next[doc.id] = {
                    id: doc.id,
                    filename: String(data.filename),
                    category: String(data.category ?? 'general'),
                    uploadedAt: String(data.uploaded_at),
                    processedAt: data.processed_at ? String(data.processed_at) : undefined,
                    status: (data.status as any) ?? 'uploaded',
                    chunkCount: typeof data.chunk_count === 'number' ? data.chunk_count : undefined,
                    storageBucket: String(data.storage_bucket ?? STORAGE_BUCKET_NAME),
                    storagePath: data.storage_path ? String(data.storage_path) : undefined,
                };
            });
            this.documents = next;
        } catch (error) {
            console.warn('⚠️ Firestore unavailable or empty in DocumentManager. Falling back to local storage.');
            try {
                const data = await fs.readFile(METADATA_FILE, 'utf-8');
                this.documents = JSON.parse(data);
            } catch {
                this.documents = {};
            }
        }
        await ragService.init();
    }

    async saveMetadata() {
        try {
            const batch = db.batch();
            Object.values(this.documents).forEach((d) => {
                const docRef = db.collection(FIRESTORE_DOCS_COLLECTION).doc(d.id);
                batch.set(docRef, {
                    filename: d.filename,
                    category: d.category,
                    uploaded_at: d.uploadedAt,
                    processed_at: d.processedAt ?? null,
                    status: d.status,
                    chunk_count: d.chunkCount ?? null,
                    storage_bucket: d.storageBucket ?? STORAGE_BUCKET_NAME,
                    storage_path: d.storagePath ?? null,
                }, { merge: true });
            });
            await batch.commit();
        } catch (error) {
            console.error('Error saving metadata to Firestore:', error);
            await fs.writeFile(METADATA_FILE, JSON.stringify(this.documents, null, 2));
        }
    }

    async uploadDocument(filename: string, content: Buffer, category: string): Promise<DocumentMetadata> {
        const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        let storagePath: string | undefined;

        try {
            const bucket = storage.bucket(STORAGE_BUCKET_NAME);
            storagePath = `${id}/${filename}`;
            const file = bucket.file(storagePath);
            await file.save(content, {
                contentType: 'application/octet-stream',
                metadata: {
                    metadata: {
                        originalName: filename,
                        category: category
                    }
                }
            });
        } catch (error) {
            console.error('Error uploading to Firebase Storage:', error);
            storagePath = undefined;
        }

        if (!storagePath) {
            const filepath = path.join(UPLOAD_DIR, `${id}_${filename}`);
            await fs.writeFile(filepath, content);
        }

        const metadata: DocumentMetadata = {
            id,
            filename,
            category,
            uploadedAt: new Date().toISOString(),
            status: 'uploaded',
            storageBucket: storagePath ? STORAGE_BUCKET_NAME : undefined,
            storagePath: storagePath
        };

        this.documents[id] = metadata;
        await this.saveMetadata();

        // Trigger processing (chunking + embeddings)
        this.processDocument(id).catch(console.error);

        return metadata;
    }

    async processDocument(id: string) {
        const doc = this.documents[id];
        if (!doc) return;

        doc.status = 'processing';
        await this.saveMetadata();

        try {
            let content: string;
            if (doc.storageBucket && doc.storagePath) {
                const bucket = storage.bucket(doc.storageBucket);
                const file = bucket.file(doc.storagePath);
                const [buffer] = await file.download();
                content = buffer.toString('utf-8');
            } else {
                const filepath = path.join(UPLOAD_DIR, `${id}_${doc.filename}`);
                content = await fs.readFile(filepath, 'utf-8');
            }

            // Chunking
            const chunks = this.chunkText(content);
            doc.chunkCount = chunks.length;

            // Generate embeddings and store in vector DB
            await ragService.ingestDocument(
                id,
                doc.filename,
                content,
                'upload',
                doc.category
            );

            doc.status = 'ready';
            doc.processedAt = new Date().toISOString();
        } catch (error) {
            console.error('Error processing document:', error);
            doc.status = 'error';
        }

        await this.saveMetadata();
    }

    private chunkText(text: string, maxChunkSize = 500): string[] {
        const paragraphs = text.split(/\n\n+/);
        const chunks: string[] = [];
        let currentChunk = '';

        for (const para of paragraphs) {
            if (currentChunk.length + para.length > maxChunkSize && currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = para;
            } else {
                currentChunk += (currentChunk ? '\n\n' : '') + para;
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    }

    async listDocuments(category?: string): Promise<DocumentMetadata[]> {
        const all = Object.values(this.documents);
        return category ? all.filter(d => d.category === category) : all;
    }

    async deleteDocument(id: string): Promise<void> {
        const doc = this.documents[id];
        if (!doc) throw new Error('Document not found');

        if (doc.storageBucket && doc.storagePath) {
            try {
                const bucket = storage.bucket(doc.storageBucket);
                await bucket.file(doc.storagePath).delete();
            } catch (error) {
                console.warn('Error deleting file from Firebase Storage:', error);
            }
        } else {
            const filepath = path.join(UPLOAD_DIR, `${id}_${doc.filename}`);
            try {
                await fs.unlink(filepath);
            } catch {
                // File might not exist
            }
        }

        await ragService.removeDocument(id);

        delete this.documents[id];
        // Also delete from Firestore
        await db.collection(FIRESTORE_DOCS_COLLECTION).doc(id).delete();
        await this.saveMetadata();
    }

    async getSignedUrl(id: string, expiresInSeconds: number = 60 * 5): Promise<string> {
        const doc = this.documents[id];
        if (!doc) throw new Error('Document not found');
        if (!doc.storageBucket || !doc.storagePath) throw new Error('Signed URLs unavailable');

        const bucket = storage.bucket(doc.storageBucket);
        const [url] = await bucket.file(doc.storagePath).getSignedUrl({
            action: 'read',
            expires: Date.now() + expiresInSeconds * 1000
        });
        return url;
    }
}

export const documentManager = new DocumentManager();
