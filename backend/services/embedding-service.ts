import type { pipeline as PipelineType, env as EnvType } from '@huggingface/transformers';

/**
 * Free embedding service using Transformers.js
 * Model: Xenova/all-MiniLM-L6-v2 (384 dimensions, 100% free, runs locally)
 * 
 * NOTE: Lazy-loaded to avoid onnxruntime-node compatibility issues on Node.js 24+
 */
class FreeEmbeddingService {
    private pipeline: any = null;
    private modelName = 'Xenova/all-MiniLM-L6-v2';
    private isInitialized = false;
    private transformersModule: any = null;

    /**
     * Lazy load the transformers module
     */
    private async loadTransformers() {
        if (this.transformersModule) return this.transformersModule;

        try {
            this.transformersModule = await import('@huggingface/transformers');
            // Disable local model loading in production
            this.transformersModule.env.allowLocalModels = false;
            return this.transformersModule;
        } catch (error: any) {
            console.warn('[FreeEmbedding] Transformers.js not available:', error.message);
            console.warn('[FreeEmbedding] This may be due to onnxruntime-node compatibility with Node.js 24+');
            console.warn('[FreeEmbedding] Embedding service will not be available');
            throw error;
        }
    }

    /**
     * Initialize the embedding pipeline
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            console.log('[FreeEmbedding] Initializing Transformers.js pipeline...');
            const transformers = await this.loadTransformers();
            this.pipeline = await transformers.pipeline('feature-extraction', this.modelName);
            this.isInitialized = true;
            console.log('[FreeEmbedding] Pipeline initialized successfully');
        } catch (error: any) {
            console.error('[FreeEmbedding] Failed to initialize:', error.message);
            throw new Error(`Failed to initialize embedding pipeline: ${error.message}`);
        }
    }

    /**
     * Generate embeddings for a given text
     * @param text - Input text to embed
     * @returns 384-dimensional embedding vector
     */
    async getEmbedding(text: string): Promise<number[]> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            // Generate embedding
            const output = await this.pipeline(text, {
                pooling: 'mean',
                normalize: true,
            });

            // Convert to regular array
            const embedding = Array.from(output.data as Float32Array);

            return embedding;
        } catch (error: any) {
            console.error('[FreeEmbedding] Failed to generate embedding:', error.message);
            throw new Error(`Failed to generate embedding: ${error.message}`);
        }
    }

    /**
     * Generate embeddings for multiple texts in batch
     * @param texts - Array of texts to embed
     * @returns Array of embedding vectors
     */
    async getEmbeddings(texts: string[]): Promise<number[][]> {
        const embeddings: number[][] = [];

        for (const text of texts) {
            const embedding = await this.getEmbedding(text);
            embeddings.push(embedding);
        }

        return embeddings;
    }

    /**
     * Get model information
     */
    getModelInfo() {
        return {
            name: this.modelName,
            dimensions: 384,
            cost: 0,
            provider: 'Hugging Face (Local)',
            status: this.isInitialized ? 'ready' : 'not initialized',
        };
    }
}

// Export singleton instance
export const freeEmbeddingService = new FreeEmbeddingService();
