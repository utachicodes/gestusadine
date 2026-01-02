import { Request, Response } from 'express';
import { llmCouncil } from '../../../../services/llm-service/llm-council';
import { ragService } from '../../../../services/rag-service/rag.service';
import { logger } from '../../../../shared/logger';
import { Validator } from '../../../../shared/validator';
import { translationClient } from '../../../translation-service/client';
import { Source } from '../../../../services/rag-service/types';

const routeLogger = logger.prefixed('CouncilRoute');

/**
 * Ask the LLM Council a question
 * POST /api/council/ask
 */
export async function askCouncil(req: Request, res: Response) {
    try {
        const { query, useRAG = true, topK = 5 } = req.body;

        // Validate input
        const validatedQuery = Validator.validateString(query, 'query', {
            required: true,
            minLength: 3,
            maxLength: 5000
        });

        routeLogger.info(`Processing query: "${validatedQuery}"`);

        let ragContext = '';
        let sources: Source[] = [];
        if (useRAG) {
            try {
                routeLogger.info('Retrieving RAG context...');
                const ragResult = await ragService.search(validatedQuery, topK);
                ragContext = ragResult.context;
                sources = ragResult.sources;
                routeLogger.info(`Found ${sources.length} relevant sources for the query.`);
            } catch (ragError: any) {
                routeLogger.error('RAG service failed', ragError);
                // Non-fatal error: proceed without RAG context
            }
        }

        const result = await llmCouncil.processQuery(validatedQuery, ragContext);

        res.json({
            success: true,
            data: { ...result, sources }
        });
    } catch (error: any) {
        routeLogger.error('Error processing query', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message || 'Failed to process council query',
            success: false
        });
    }
}

/**
 * Get council member information
 * GET /api/council/members
 */
export function getCouncilMembers(req: Request, res: Response) {
    try {
        const members = llmCouncil.getMembers();
        res.json({
            success: true,
            data: members.map(m => ({
                id: m.id,
                name: m.name,
                role: m.role,
                modelId: m.modelId,
                temperature: m.temperature
            }))
        });
    } catch (error: any) {
        console.error('[CouncilRoute] Error getting members:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
            success: false
        });
    }
}

/**
 * Upload and ingest a document for RAG
 * POST /api/council/documents
 */
export async function uploadDocument(req: Request, res: Response) {
    try {
        const { docId, title, content, source, category = 'general' } = req.body;

        // Validate input
        const validatedDocId = Validator.validateString(docId, 'docId', { required: true });
        const validatedTitle = Validator.validateString(title, 'title', { required: true, maxLength: 500 });
        const validatedContent = Validator.validateString(content, 'content', { required: true });
        const validatedSource = Validator.validateString(source, 'source', { required: true });

        routeLogger.info(`Ingesting document: "${validatedTitle}"`);
        await ragService.ingestDocument(validatedDocId, validatedTitle, validatedContent, validatedSource, category);

        res.json({
            success: true,
            message: `Document "${validatedTitle}" ingested successfully`,
            docId: validatedDocId
        });
    } catch (error: any) {
        routeLogger.error('Error uploading document', error);
        res.status(500).json({
            error: 'Failed to upload document',
            message: error.message,
            success: false
        });
    }
}

/**
 * List all ingested documents
 * GET /api/council/documents
 */
export function listDocuments(req: Request, res: Response) {
    try {
        const documents = ragService.getAllDocuments();
        res.json({
            success: true,
            data: documents,
            count: documents.length
        });
    } catch (error: any) {
        console.error('[CouncilRoute] Error listing documents:', error);
        res.status(500).json({
            error: 'Failed to list documents',
            message: error.message,
            success: false
        });
    }
}

/**
 * Get document by ID
 * GET /api/council/documents/:docId
 */
export function getDocument(req: Request, res: Response) {
    try {
        const { docId } = req.params;
        const document = ragService.getDocument(docId);

        if (!document) {
            res.status(404).json({
                error: 'Document not found',
                success: false
            });
            return;
        }

        res.json({
            success: true,
            data: document
        });
    } catch (error: any) {
        routeLogger.error('Error getting document', error);
        res.status(500).json({
            error: 'Failed to get document',
            message: error.message,
            success: false
        });
    }
}

/**
 * Delete a document
 * DELETE /api/council/documents/:docId
 */
export async function deleteDocument(req: Request, res: Response) {
    try {
        const { docId } = req.params;

        // Validate input
        const validatedDocId = Validator.validateString(docId, 'docId', { required: true });

        routeLogger.info(`Deleting document: ${validatedDocId}`);
        await ragService.removeDocument(validatedDocId);

        res.json({
            success: true,
            message: 'Document deleted successfully',
            docId
        });
    } catch (error: any) {
        console.error('[CouncilRoute] Error deleting document:', error);
        res.status(500).json({
            error: 'Failed to delete document',
            message: error.message,
            success: false
        });
    }
}

/**
 * Search RAG database
 * POST /api/council/search
 */
export async function searchRAG(req: Request, res: Response) {
    try {
        const { query, topK = 5 } = req.body;

        // Validate input
        const validatedQuery = Validator.validateString(query, 'query', {
            required: true,
            minLength: 2,
            maxLength: 5000
        });

        routeLogger.info(`Searching RAG: "${validatedQuery}"`);
        const result = await ragService.search(validatedQuery, topK);

        res.json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('[CouncilRoute] Error searching RAG:', error);
        res.status(500).json({
            error: 'Search failed',
            message: error.message,
            success: false
        });
    }
}

/**
 * Translate text from French to Wolof
 * POST /api/council/translate-to-wolof
 */
export async function translateToWolof(req: Request, res: Response) {
    try {
        const { text } = req.body;

        const validatedText = Validator.validateString(text, 'text', {
            required: true,
            minLength: 1,
            maxLength: 5000
        });

        routeLogger.info('Translating to Wolof...');
        const translation = await translationClient.translate({
            text: validatedText,
            source_lang: 'fr',
            target_lang: 'wo'
        });

        res.json({
            success: true,
            original: translation.original,
            translated: translation.translated,
            source_language: 'French',
            target_language: 'Wolof'
        });
    } catch (error: any) {
        routeLogger.error('Error translating to Wolof', error);
        res.status(500).json({
            error: 'Translation failed',
            message: error.message,
            success: false
        });
    }
}

/**
 * Translate text from Wolof to French
 * POST /api/council/translate-to-french
 */
export async function translateToFrench(req: Request, res: Response) {
    try {
        const { text } = req.body;

        const validatedText = Validator.validateString(text, 'text', {
            required: true,
            minLength: 1,
            maxLength: 5000
        });

        routeLogger.info('Translating to French...');
        const translation = await translationClient.translate({
            text: validatedText,
            source_lang: 'wo',
            target_lang: 'fr'
        });

        res.json({
            success: true,
            original: translation.original,
            translated: translation.translated,
            source_language: 'Wolof',
            target_language: 'French'
        });
    } catch (error: any) {
        routeLogger.error('Error translating to French', error);
        res.status(500).json({
            error: 'Translation failed',
            message: error.message,
            success: false
        });
    }
}

/**
 * Ask the Council a question in Wolof (auto-translates)
 * POST /api/council/ask-wolof
 */
export async function askCouncilWolof(req: Request, res: Response) {
    try {
        const { query, useRAG = true, topK = 5 } = req.body;

        const validatedQuery = Validator.validateString(query, 'query', {
            required: true,
            minLength: 3,
            maxLength: 5000
        });

        routeLogger.info(`Processing Wolof query: "${validatedQuery}"`);

        // Translate Wolof query to French for LLM processing
        const translationResult = await translationClient.translate({
            text: validatedQuery,
            source_lang: 'wo',
            target_lang: 'fr'
        });

        const frenchQuery = translationResult.translated;
        routeLogger.info(`Translated to French: "${frenchQuery}"`);

        // Process with Council
        let ragContext = '';
        let sources: Source[] = [];
        if (useRAG) {
            try {
                routeLogger.info('Retrieving RAG context for Wolof query...');
                const ragResult = await ragService.search(frenchQuery, topK);
                ragContext = ragResult.context;
                sources = ragResult.sources;
                routeLogger.info(`Found ${sources.length} relevant sources for the Wolof query.`);
            } catch (ragError: any) {
                routeLogger.error('RAG service failed for Wolof query', ragError);
                // Non-fatal error: proceed without RAG context
            }
        }

        const councilResult = await llmCouncil.processQuery(frenchQuery, ragContext);

        // Translate Council response back to Wolof
        const responseTranslation = await translationClient.translate({
            text: councilResult.synthesisResult,
            source_lang: 'fr',
            target_lang: 'wo'
        });

        res.json({
            success: true,
            data: {
                ...councilResult,
                synthesisResult: responseTranslation.translated,
                synthesisResultFrench: councilResult.synthesisResult,
                originalQueryWolof: validatedQuery,
                originalQueryFrench: frenchQuery,
                language: 'wolof',
                sources
            }
        });
    } catch (error: any) {
        routeLogger.error('Error processing Wolof query', error);
        res.status(500).json({
            error: 'Failed to process Wolof query',
            message: error.message,
            success: false
        });
    }
}

/**
 * Detect language of text (French or Wolof)
 * POST /api/council/detect-language
 */
export async function detectLanguage(req: Request, res: Response) {
    try {
        const { text } = req.body;

        const validatedText = Validator.validateString(text, 'text', {
            required: true,
            minLength: 1,
            maxLength: 1000
        });

        routeLogger.info('Detecting language...');
        const detection = await translationClient.detectLanguage(validatedText);

        res.json({
            success: true,
            text: validatedText,
            detected_language: detection.detected_language,
            language_name: detection.language_name
        });
    } catch (error: any) {
        routeLogger.error('Error detecting language', error);
        res.status(500).json({
            error: 'Language detection failed',
            message: error.message,
            success: false
        });
    }
}

/**
 * Health check endpoint
 * GET /api/council/health
 */
export function healthCheck(req: Request, res: Response) {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        members: llmCouncil.getMembers().length
    });
}
