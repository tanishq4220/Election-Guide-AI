/**
 * Utility functions for input sanitization, validation, and history management.
 * @module utils
 */

/**
 * Sanitizes user input by stripping HTML tags and dangerous characters.
 * @param {string|null} input - The raw user input to sanitize.
 * @returns {string} The sanitized string, or empty string if input is null/undefined.
 */
function sanitizePrompt(input) {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '')           // Strip HTML tags
    .replace(/[<>'"]/g, '')            // Remove dangerous chars
    .trim()
    .slice(0, 2000);                   // Hard limit
}

/**
 * Validates whether a prompt is a valid election query.
 * @param {string} prompt - The user's query to validate.
 * @returns {boolean} True if the query is valid, false otherwise.
 */
function validateElectionQuery(prompt) {
  if (!prompt || typeof prompt !== 'string') return false;
  if (prompt.trim().length === 0) return false;
  if (prompt.length > 2000) return false;
  return true;
}

/**
 * Truncates chat history to the most recent N messages.
 * @param {Array} history - The full chat history array.
 * @param {number} [maxMessages=10] - Maximum number of messages to keep.
 * @returns {Array} The truncated history array.
 */
function truncateHistory(history, maxMessages = 10) {
  if (!Array.isArray(history)) return [];
  return history.slice(-maxMessages);
}

module.exports = { sanitizePrompt, validateElectionQuery, truncateHistory };
