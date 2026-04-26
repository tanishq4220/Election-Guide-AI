/**
 * BigQuery analytics service for tracking chat events and usage statistics.
 * @module analytics
 */
const crypto = require('crypto');

let bigquery = null;
const DATASET = 'election_guide';
const TABLE = 'chat_events';

// Lazy initialization — only connect when GOOGLE_CLOUD_PROJECT is set
function getBigQueryClient() {
  if (bigquery) return bigquery;
  try {
    const { BigQuery } = require('@google-cloud/bigquery');
    bigquery = new BigQuery({
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
    });
  } catch (err) {
    console.warn('[Analytics] BigQuery client unavailable:', err.message);
  }
  return bigquery;
}

/**
 * Logs a chat interaction event to BigQuery for analytics.
 * Non-blocking — errors are caught and logged without crashing the app.
 * @param {Object} params - The event parameters.
 * @param {string} params.userId - The user's ID or 'anonymous'.
 * @param {string} params.prompt - The user's prompt text.
 * @param {string} params.mode - The response mode ('simple' or 'detailed').
 * @param {number} params.responseTime - Response time in milliseconds.
 * @param {number} params.tokenCount - Number of tokens in the response.
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
    await client.dataset(DATASET).table(TABLE).insert([row]);
  } catch (err) {
    console.error('[Analytics] BigQuery insert error:', err.message);
    // Non-blocking — don't crash the app
  }
}

/**
 * Retrieves usage statistics for the last 7 days from BigQuery.
 * @returns {Promise<Array>} Array of daily statistics rows.
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
    FROM \`${process.env.GOOGLE_CLOUD_PROJECT}.${DATASET}.${TABLE}\`
    WHERE timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
    GROUP BY session_date
    ORDER BY session_date DESC
  `;

  try {
    const [rows] = await client.query({ query });
    return rows;
  } catch (err) {
    console.error('[Analytics] BigQuery query error:', err.message);
    return [];
  }
}

module.exports = { logChatEvent, getUsageStats };
