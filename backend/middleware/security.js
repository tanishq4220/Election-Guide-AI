/**
 * Security middleware for rate limiting and input validation.
 * @module security
 */
const rateLimit = require('express-rate-limit');

/**
 * Stricter rate limiter specifically for chat endpoints.
 * Limits each IP to 30 requests per 15-minute window.
 */
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.headers['x-forwarded-for'] || req.ip,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests. Please wait before trying again.',
      retryAfter: 900
    });
  }
});

/**
 * Validates and sanitizes chat input from request body.
 * Checks prompt existence, length, mode validity, and history size.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
function validateChatInput(req, res, next) {
  const { prompt, mode, history } = req.body;

  // Validate prompt
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt is required and must be a non-empty string.' });
  }

  if (prompt.length > 2000) {
    return res.status(400).json({ error: 'Prompt exceeds the maximum length of 2000 characters.' });
  }

  // Validate mode
  if (mode && !['simple', 'detailed'].includes(mode)) {
    return res.status(400).json({ error: 'Mode must be either "simple" or "detailed".' });
  }

  // Validate history
  if (history && (!Array.isArray(history) || history.length > 20)) {
    return res.status(400).json({ error: 'History must be an array of at most 20 messages.' });
  }

  next();
}

module.exports = { chatLimiter, validateChatInput };
