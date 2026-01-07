import express from 'express';
import { OpenRouterClient } from '../../llm-service/openrouter-client';
import { LLMCouncil } from '../../llm-service/llm-council';
import { requireAuth, optionalAuth } from './auth';
import { logger } from '../../../shared/logger';

const router = express.Router();
const openRouter = new OpenRouterClient();
const llmCouncil = new LLMCouncil();

// Chat endpoint - optional authentication
router.post('/chat', optionalAuth, async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message is required',
        message: 'Please provide a valid message to continue'
      });
    }

    // Sanitize and validate language
    const validLanguages = ['en', 'fr', 'wo'];
    const sanitizedLanguage = validLanguages.includes(language) ? language : 'en';

    logger.info('Processing chat message', {
      userId: req.authUser?.sub,
      language: sanitizedLanguage,
      messageLength: message.length
    });

    // Get response from LLM Council
    const councilResponse = await llmCouncil.processQuery(message.trim());

    if (!councilResponse || !councilResponse.synthesisResult) {
      throw new Error('Invalid response from LLM Council');
    }

    // Format the response with language context
    const response = {
      response: councilResponse.synthesisResult,
      council: {
        members: councilResponse.councilMembers?.map((m: any) => m.name || m) || [],
        consensus: councilResponse.synthesisResult,
        reasoning: councilResponse.initialResponses?.map((r: any) => r.reasoning || r.content || '').filter(Boolean) || []
      },
      language: sanitizedLanguage
    };

    logger.info('Chat response generated', {
      userId: req.authUser?.sub,
      responseLength: response.response.length
    });

    res.json(response);
  } catch (error: any) {
    logger.error('Chat API error:', {
      error: error.message || error,
      stack: error.stack,
      userId: req.authUser?.sub
    });

    res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Failed to process your request. Please try again.'
    });
  }
});

// Health check for chat service
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'chat'
  });
});

export default router;
