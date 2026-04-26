/**
 * AI chat route handler with input validation, caching, and analytics.
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

/**
 * POST /chat — Handles incoming chat requests and returns AI-generated responses.
 * Applies stricter rate limiting, input validation, prompt sanitization,
 * response caching, and BigQuery event logging.
 */
router.post('/chat', chatLimiter, validateChatInput, async (req, res) => {
  const { prompt, history, userId, mode } = req.body;
  const startTime = Date.now();

  // Sanitize the prompt
  const cleanPrompt = sanitizePrompt(prompt);

  if (!validateElectionQuery(cleanPrompt)) {
    return res.status(400).json({ error: 'Invalid or empty prompt after sanitization.' });
  }

  // Check cache first for efficiency
  const cached = getCachedResponse(cleanPrompt);
  if (cached) {
    logger.info('Cache hit for prompt', { promptLength: cleanPrompt.length });
    return res.json({ message: cached });
  }

  // Truncate history to last 10 messages
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
      tokenCount: response ? response.length : 0
    }).catch(() => {});

    logger.info('Chat response generated', { responseTime, mode });
    res.json({ message: response });
  } catch (error) {
    logger.error('AI route error', error);
    res.status(500).json({
      error: "Failed to generate response from AI",
      details: error.message
    });
  }
});

module.exports = router;
