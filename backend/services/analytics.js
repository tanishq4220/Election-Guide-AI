/**
 * BigQuery analytics service for tracking chat events and usage statistics.
 * Provides non-blocking event logging and aggregated stats retrieval.
 * @module services/analytics
 */
const crypto = require('crypto');
const { BQ_DATASET, BQ_TABLE } = require('../constants');
const logger = require('./logger');

/** @type {import('@google-cloud/bigquery').BigQuery|null} */
let bigquery = null;

/**
 * Lazy-initializes and returns the BigQuery client.
 * Only connects when GOOGLE_CLOUD_PROJECT is set in the environment.
 * @returns {import('@google-cloud/bigquery').BigQuery|null} The BigQuery client, or null if unavailable.
 */
function getBigQueryClient() {
  if (bigquery) return bigquery;
  try {
    const { BigQuery } = require('@google-cloud/bigquery');
    bigquery = new BigQuery({
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
    });
  } catch (err) {
    logger.warn('[Analytics] BigQuery client unavailable', { error: err.message });
  }
  return bigquery;
}

/**
 * Logs a chat interaction event to BigQuery for analytics.
 * Non-blocking — errors are caught and logged without crashing the app.
 * @param {Object} params - The event parameters.
 * @param {string} [params.userId] - The user's ID or 'anonymous'.
 * @param {string} [params.prompt] - The user's prompt text.
 * @param {string} [params.mode] - The response mode ('simple' or 'detailed').
 * @param {number} [params.responseTime] - Response time in milliseconds.
 * @param {number} [params.tokenCount] - Number of tokens in the response.
 * @returns {Promise<void>}
 */
async function logChatEvent({ userId, prompt, mode, responseTime, tokenCount }) {
  const client = getBigQueryClient();
  if (!client) return;

  const row = {
    event_id: crypto.randomUUID(),
    user_id: userId || 'anonymous',
    prompt_length: prompt ? prompt.length : 0,
    mode: mode || 'simple',
    response_time_ms: responseTime,
    token_count: tokenCount || 0,
    timestamp: new Date().toISOString(),
    session_date: new Date().toISOString().split('T')[0],
  };

  try {
    await client.dataset(BQ_DATASET).table(BQ_TABLE).insert([row]);
  } catch (err) {
    logger.error('[Analytics] BigQuery insert error', err);
  }
}

/**
 * Retrieves usage statistics for the last 7 days from BigQuery.
 * @returns {Promise<Array<{ session_date: string, total_queries: number, avg_response_ms: number, avg_tokens: number }>>}
 *   Array of daily statistics rows.
 */
async function getUsageStats() {
  const client = getBigQueryClient();
  if (!client) return [];

  const query = `
    SELECT 
      session_date,
      COUNT(*) as total_queries,
      AVG(response_time_ms) as avg_response_ms,
      AVG(token_count) as avg_tokens
    FROM \`${process.env.GOOGLE_CLOUD_PROJECT}.${BQ_DATASET}.${BQ_TABLE}\`
    WHERE timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
    GROUP BY session_date
    ORDER BY session_date DESC
  `;

  try {
    const [rows] = await client.query({ query });
    return rows;
  } catch (err) {
    logger.error('[Analytics] BigQuery query error', err);
    return [];
  }
}

module.exports = { logChatEvent, getUsageStats };
