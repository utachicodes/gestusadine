import { DocumentMetadata } from '../../shared/document-types';
import fs from 'fs/promises';
import path from 'path';
import { ragService } from './rag.service';
import { createClient } from '@supabase/supabase-js';

const UPLOAD_DIR = path.join(process.cwd(), 'backend', 'uploads');
const METADATA_FILE = path.join(process.cwd(), 'backend', 'documents.json');

const SUPABASE_BUCKET = process.env.SUPABASE_RAG_BUCKET || 'rag-documents';
const SUPABASE_TABLE = process.env.SUPABASE_RAG_TABLE || 'rag_documents';

function getSupabaseAdmin() {
    const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
    const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '').trim();

    // Validate format
    if (!url || !url.startsWith('http') || url.includes('your-supabase-url')) {
        console.warn('⚠️  Supabase URL missing or invalid in DocumentManager. Falling back to local storage.');
        return null;
    }

    if (!key || key.includes('your-supabase-key')) {
        console.warn('⚠️  Supabase Key missing or invalid in DocumentManager. Falling back to local storage.');
        return null;
    }

    try {
        return createClient(url, key, { auth: { persistSession: false } });
    } catch (error: any) {
        console.error('❌ Failed to initialize Supabase client in DocumentManager:', error.message);
        return null;
    }
}

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
    private supabase = getSupabaseAdmin();

    async init() {
        await ensureUploadDir();
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase
                    .from(SUPABASE_TABLE)
                    .select('*')
                    .order('uploaded_at', { ascending: false });

                if (error) throw error;

                const next: Record<string, DocumentMetadata> = {};
                for (const row of data ?? []) {
                    next[String(row.id)] = {
                        id: String(row.id),
                        filename: String(row.filename),
                        category: String(row.category ?? 'general'),
                        uploadedAt: String(row.uploaded_at),
                        processedAt: row.processed_at ? String(row.processed_at) : undefined,
                        status: (row.status as any) ?? 'uploaded',
                        chunkCount: typeof row.chunk_count === 'number' ? row.chunk_count : undefined,
                        storageBucket: String(row.storage_bucket ?? SUPABASE_BUCKET),
                        storagePath: row.storage_path ? String(row.storage_path) : undefined,
                    };
                }
                this.documents = next;
            } catch {
                try {
                    const data = await fs.readFile(METADATA_FILE, 'utf-8');
                    this.documents = JSON.parse(data);
                } catch {
                    this.documents = {};
                }
            }
        } else {
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
        if (!this.supabase) {
            await fs.writeFile(METADATA_FILE, JSON.stringify(this.documents, null, 2));
            return;
        }

        const rows = Object.values(this.documents).map((d) => ({
            id: d.id,
            filename: d.filename,
            category: d.category,
            uploaded_at: d.uploadedAt,
            processed_at: d.processedAt ?? null,
            status: d.status,
            chunk_count: d.chunkCount ?? null,
            storage_bucket: d.storageBucket ?? SUPABASE_BUCKET,
            storage_path: d.storagePath ?? null,
        }));

        const { error } = await this.supabase.from(SUPABASE_TABLE).upsert(rows, { onConflict: 'id' });
        if (error) {
            await fs.writeFile(METADATA_FILE, JSON.stringify(this.documents, null, 2));
        }
    }

    async uploadDocument(filename: string, content: Buffer, category: string): Promise<DocumentMetadata> {
        const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        let storagePath: string | undefined;
        if (this.supabase) {
            storagePath = `${id}/${filename}`;
            const { error } = await this.supabase.storage
                .from(SUPABASE_BUCKET)
                .upload(storagePath, content, {
                    upsert: true,
                    contentType: 'application/octet-stream',
                });
            if (error) {
                storagePath = undefined;
            }
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
            storageBucket: storagePath ? SUPABASE_BUCKET : undefined,
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
            if (this.supabase && doc.storageBucket && doc.storagePath) {
                const { data, error } = await this.supabase.storage
                    .from(doc.storageBucket)
                    .download(doc.storagePath);
                if (error || !data) throw error;
                const buf = Buffer.from(await data.arrayBuffer());
                content = buf.toString('utf-8');
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

        if (this.supabase && doc.storageBucket && doc.storagePath) {
            await this.supabase.storage.from(doc.storageBucket).remove([doc.storagePath]);
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
        await this.saveMetadata();
    }

    async getSignedUrl(id: string, expiresInSeconds: number = 60 * 5): Promise<string> {
        const doc = this.documents[id];
        if (!doc) throw new Error('Document not found');
        if (!this.supabase || !doc.storageBucket || !doc.storagePath) throw new Error('Signed URLs unavailable');

        const { data, error } = await this.supabase.storage
            .from(doc.storageBucket)
            .createSignedUrl(doc.storagePath, expiresInSeconds);
        if (error || !data?.signedUrl) throw (error ?? new Error('Failed to create signed URL'));
        return data.signedUrl;
    }
}

export const documentManager = new DocumentManager();
