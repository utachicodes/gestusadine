
import { Router } from 'express';
import {
    askCouncil,
    getCouncilMembers,
    uploadDocument,
    listDocuments,
    getDocument,
    deleteDocument,
    searchRAG,
    askCouncilWolof,
    translateToWolof,
    translateToFrench,
    detectLanguage,
    healthCheck
} from './council-handler.js';

export const councilRoutes = Router();

// Core Council
councilRoutes.post('/ask', askCouncil);
councilRoutes.get('/members', getCouncilMembers);
councilRoutes.get('/health', healthCheck);

// Knowledge Base (RAG)
councilRoutes.post('/documents', uploadDocument);
councilRoutes.get('/documents', listDocuments);
councilRoutes.get('/documents/:docId', getDocument);
councilRoutes.delete('/documents/:docId', deleteDocument);
councilRoutes.post('/search', searchRAG);

// Wolof / Translation Support
councilRoutes.post('/ask-wolof', askCouncilWolof);
councilRoutes.post('/translate-to-wolof', translateToWolof);
councilRoutes.post('/translate-to-french', translateToFrench);
councilRoutes.post('/detect-language', detectLanguage);
