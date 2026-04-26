/**
 * In-memory caching middleware and AI response cache for performance optimization.
 * Uses node-cache for lightweight, zero-dependency caching.
 * @module cache
 */
const NodeCache = require('node-cache');
const crypto = require('crypto');

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

/**
 * Express middleware that caches GET responses for the specified TTL.
 * Sets X-Cache header to 'HIT' or 'MISS' for observability.
 * @param {number} [ttl=3600] - Cache time-to-live in seconds.
 * @returns {Function} Express middleware function.
 */
function cacheMiddleware(ttl = 3600) {
  return (req, res, next) => {
    if (req.method !== 'GET') return next();

    const key = `cache:${req.originalUrl}`;
    const cached = cache.get(key);

    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cache.set(key, data, ttl);
      res.setHeader('X-Cache', 'MISS');
      originalJson(data);
    };
    next();
  };
}

/**
 * Generates an MD5 hash of a normalized prompt for cache key usage.
 * @param {string} prompt - The user's prompt.
 * @returns {string} MD5 hash of the lowercase, trimmed prompt.
 */
function hashPrompt(prompt) {
  return crypto.createHash('md5').update(prompt.toLowerCase().trim()).digest('hex');
}

/**
 * Retrieves a cached AI response for a given prompt.
 * @param {string} prompt - The user's prompt.
 * @returns {string|undefined} The cached response, or undefined if not found.
 */
function getCachedResponse(prompt) {
  return cache.get(`ai:${hashPrompt(prompt)}`);
}

/**
 * Stores an AI response in the cache for 30 minutes.
 * @param {string} prompt - The user's prompt.
 * @param {string} response - The AI response to cache.
 */
function setCachedResponse(prompt, response) {
  cache.set(`ai:${hashPrompt(prompt)}`, response, 1800); // 30 min
}

module.exports = { cacheMiddleware, getCachedResponse, setCachedResponse };
