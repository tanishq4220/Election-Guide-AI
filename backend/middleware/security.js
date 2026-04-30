/**
 * Security middleware for rate limiting and input validation.
 * Provides chat-specific rate limiting and request body validation
 * to prevent abuse, injection attacks, and malformed data.
 * @module middleware/security
 */
const rateLimit = require('express-rate-limit');
const {
  CHAT_RATE_LIMIT,
  RATE_LIMIT_WINDOW_MS,
  MAX_PROMPT_LENGTH,
  MAX_HISTORY_LENGTH,
  VALID_MODES,
  HTTP_STATUS,
  ERROR_MESSAGES,
} = require('../constants');

/**
 * Stricter rate limiter specifically for chat endpoints.
 * Limits each IP to a configured number of requests per window.
 * Uses X-Forwarded-For header when behind a proxy, with IP fallback.
 * @type {import('express-rate-limit').RateLimitRequestHandler}
 */
const chatLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: CHAT_RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.headers['x-forwarded-for'] || req.ip,
  handler: (req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      error: ERROR_MESSAGES.RATE_LIMITED,
      retryAfter: RATE_LIMIT_WINDOW_MS / 1000,
    });
  },
});

/**
 * Validates and sanitizes chat input from request body.
 * Checks prompt existence, length, mode validity, and history size.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {void}
 */
function validateChatInput(req, res, next) {
  const { prompt, mode, history } = req.body;

  // Validate prompt exists and is a non-empty string
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.PROMPT_REQUIRED,
    });
  }

  // Validate prompt does not exceed maximum length
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.PROMPT_TOO_LONG,
    });
  }

  // Validate mode is one of the accepted values
  if (mode && !VALID_MODES.includes(mode)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.INVALID_MODE,
    });
  }

  // Validate history is a valid array within size limits
  if (history && (!Array.isArray(history) || history.length > MAX_HISTORY_LENGTH)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.HISTORY_INVALID,
    });
  }

  next();
}

module.exports = { chatLimiter, validateChatInput };
