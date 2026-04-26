/**
 * Google Cloud Logging service with structured log entries.
 * Falls back to console logging when Cloud Logging is unavailable.
 * @module logger
 */

let log = null;

// Lazy initialization — only connect when GOOGLE_CLOUD_PROJECT is set
function getLogClient() {
  if (log) return log;
  try {
    const { Logging } = require('@google-cloud/logging');
    const logging = new Logging({ projectId: process.env.GOOGLE_CLOUD_PROJECT });
    log = logging.log('election-guide-api');
  } catch (err) {
    // Cloud Logging not available — will use console fallback
  }
  return log;
}

/**
 * Structured logger that writes to both Google Cloud Logging and console.
 */
const logger = {
  /**
   * Logs an informational message.
   * @param {string} message - The log message.
   * @param {Object} [metadata={}] - Additional metadata to include.
   */
  info: (message, metadata = {}) => {
    const client = getLogClient();
    if (client) {
      const entry = client.entry(
        { severity: 'INFO', resource: { type: 'global' } },
        { message, ...metadata, timestamp: new Date().toISOString() }
      );
      client.write(entry).catch(() => {});
    }
    console.log(`[INFO] ${message}`, metadata);
  },

  /**
   * Logs an error message with optional error object.
   * @param {string} message - The error description.
   * @param {Error} [error={}] - The error object.
   */
  error: (message, error = {}) => {
    const client = getLogClient();
    if (client) {
      const entry = client.entry(
        { severity: 'ERROR', resource: { type: 'global' } },
        { message, error: error.message, stack: error.stack }
      );
      client.write(entry).catch(() => {});
    }
    console.error(`[ERROR] ${message}`, error);
  },

  /**
   * Logs a warning message.
   * @param {string} message - The warning message.
   * @param {Object} [metadata={}] - Additional metadata.
   */
  warn: (message, metadata = {}) => {
    const client = getLogClient();
    if (client) {
      const entry = client.entry(
        { severity: 'WARNING', resource: { type: 'global' } },
        { message, ...metadata }
      );
      client.write(entry).catch(() => {});
    }
    console.warn(`[WARN] ${message}`, metadata);
  }
};

module.exports = logger;
