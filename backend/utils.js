/**
 * Utility functions for input sanitization, validation, history management, and hashing.
 * @module utils
 */
const crypto = require('crypto');
const { MAX_PROMPT_LENGTH, DEFAULT_TRUNCATE_LIMIT } = require('./constants');

/** Regex pattern to match HTML tags. */
const HTML_TAG_PATTERN = /<[^>]*>/g;

/** Regex pattern to match dangerous characters. */
const DANGEROUS_CHAR_PATTERN = /[<>'"`;]/g;

/**
 * Sanitizes user input by stripping HTML tags and dangerous characters.
 * @param {string|null|undefined} input - The raw user input to sanitize.
 * @returns {string} The sanitized string, or empty string if input is null/undefined.
 */
function sanitizePrompt(input) {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(HTML_TAG_PATTERN, '')
    .replace(DANGEROUS_CHAR_PATTERN, '')
    .trim()
    .slice(0, MAX_PROMPT_LENGTH);
}

/**
 * Validates whether a prompt is a valid election query.
 * @param {string} prompt - The user's query to validate.
 * @returns {boolean} True if the query is valid, false otherwise.
 */
function validateElectionQuery(prompt) {
  if (!prompt || typeof prompt !== 'string') return false;
  if (prompt.trim().length === 0) return false;
  if (prompt.length > MAX_PROMPT_LENGTH) return false;
  return true;
}

/**
 * Truncates chat history to the most recent N messages.
 * @param {Array} history - The full chat history array.
 * @param {number} [maxMessages=10] - Maximum number of messages to keep.
 * @returns {Array} The truncated history array.
 */
function truncateHistory(history, maxMessages = DEFAULT_TRUNCATE_LIMIT) {
  if (!Array.isArray(history)) return [];
  return history.slice(-maxMessages);
}

/**
 * Creates an MD5 hash of a normalized prompt for cache key generation.
 * Normalizes by lowercasing and trimming whitespace before hashing.
 * @param {string} prompt - User prompt to hash.
 * @returns {string} 32-character hex hash string.
 */
function hashPrompt(prompt) {
  return crypto
    .createHash('md5')
    .update((prompt || '').toLowerCase().trim())
    .digest('hex');
}

module.exports = { sanitizePrompt, validateElectionQuery, truncateHistory, hashPrompt };
