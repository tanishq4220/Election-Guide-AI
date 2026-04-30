/**
 * AI chat route handler with input validation, caching, and analytics.
 * Provides the primary chat endpoint for the Election Guide AI assistant.
 * @module routes/aiRoutes
 */
const express = require('express');

const router = express.Router();
const { getElectionResponse } = require('../services/aiService');
const { sanitizePrompt, validateElectionQuery, truncateHistory } = require('../utils');
const { getCachedResponse, setCachedResponse } = require('../middleware/cache');
const { logChatEvent } = require('../services/analytics');
const { chatLimiter, validateChatInput } = require('../middleware/security');
const logger = require('../services/logger');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');

/**
 * POST /chat — Handles incoming chat requests and returns AI-generated responses.
 * Applies stricter rate limiting, input validation, prompt sanitization,
 * response caching, and BigQuery event logging.
 *
 * @route POST /chat
 * @param {string} req.body.prompt - The user's election-related question.
 * @param {Array} [req.body.history] - Previous chat messages for context.
 * @param {string} [req.body.userId] - Authenticated user's ID.
 * @param {string} [req.body.mode] - Response mode: 'simple' or 'detailed'.
 * @returns {{ message: string }} The AI-generated response.
 */
router.post('/chat', chatLimiter, validateChatInput, async (req, res) => {
  const { prompt, history, userId, mode } = req.body;
  const startTime = Date.now();

  // Sanitize the prompt to remove XSS and injection vectors
  const cleanPrompt = sanitizePrompt(prompt);

  if (!validateElectionQuery(cleanPrompt)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.INVALID_PROMPT,
    });
  }

  // Check cache first for efficiency
  const cached = getCachedResponse(cleanPrompt);
  if (cached) {
    logger.info('Cache hit for prompt', { promptLength: cleanPrompt.length });
    return res.json({ message: cached });
  }

  // Truncate history to prevent context overflow
  const safeHistory = truncateHistory(history);

  try {
    const response = await getElectionResponse(cleanPrompt, safeHistory, userId, mode);

    // Cache the response for future identical queries
    setCachedResponse(cleanPrompt, response);

    // Log analytics event (non-blocking)
    const responseTime = Date.now() - startTime;
    logChatEvent({
      userId,
      prompt: cleanPrompt,
      mode,
      responseTime,
      tokenCount: response ? response.length : 0,
    }).catch(() => {});

    logger.info('Chat response generated', { responseTime, mode });
    res.json({ message: response });
  } catch (error) {
    logger.error('AI route error', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGES.AI_FAILURE,
      details: error.message,
    });
  }
});

module.exports = router;
