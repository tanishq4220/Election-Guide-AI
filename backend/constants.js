/**
 * Centralized constants for the Election Guide AI backend.
 * Consolidates magic numbers, strings, and configuration values
 * to improve maintainability and code quality.
 * @module constants
 */

/** Maximum allowed prompt length in characters. */
const MAX_PROMPT_LENGTH = 2000;

/** Maximum number of chat history messages accepted per request. */
const MAX_HISTORY_LENGTH = 20;

/** Default number of messages retained during history truncation. */
const DEFAULT_TRUNCATE_LIMIT = 10;

/** Global rate limiter: max requests per window. */
const GLOBAL_RATE_LIMIT = 100;

/** Chat-specific rate limiter: max requests per window. */
const CHAT_RATE_LIMIT = 30;

/** Rate limiter window duration in milliseconds (15 minutes). */
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** Cache TTL for AI responses in seconds (30 minutes). */
const AI_CACHE_TTL_SECONDS = 1800;

/** Default cache TTL for GET endpoints in seconds (1 hour). */
const DEFAULT_CACHE_TTL_SECONDS = 3600;

/** Cache check period in seconds. */
const CACHE_CHECK_PERIOD_SECONDS = 600;

/** Maximum JSON body size accepted by the server. */
const MAX_BODY_SIZE = '10kb';

/** Compression threshold in bytes. */
const COMPRESSION_THRESHOLD = 1024;

/** Compression level (1–9). */
const COMPRESSION_LEVEL = 6;

/** Default server port. */
const DEFAULT_PORT = 8080;

/** Maximum output tokens for Gemini model. */
const MAX_OUTPUT_TOKENS = 1000;

/** Valid chat modes. */
const VALID_MODES = ['simple', 'detailed'];

/** BigQuery dataset name. */
const BQ_DATASET = 'election_guide';

/** BigQuery table name. */
const BQ_TABLE = 'chat_events';

/** Cloud Logging log name. */
const LOG_NAME = 'election-guide-api';

/** HTTP status codes. */
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

/** Error messages returned to clients. */
const ERROR_MESSAGES = {
  PROMPT_REQUIRED: 'Prompt is required and must be a non-empty string.',
  PROMPT_TOO_LONG: `Prompt exceeds the maximum length of ${MAX_PROMPT_LENGTH} characters.`,
  INVALID_MODE: `Mode must be one of: ${VALID_MODES.join(', ')}.`,
  HISTORY_INVALID: `History must be an array of at most ${MAX_HISTORY_LENGTH} messages.`,
  INVALID_PROMPT: 'Invalid or empty prompt after sanitization.',
  RATE_LIMITED: 'Too many requests. Please wait before trying again.',
  GLOBAL_RATE_LIMITED: 'Too many requests from this IP, please try again after 15 minutes',
  ENDPOINT_NOT_FOUND: 'Endpoint not found',
  INTERNAL_ERROR: 'Sorry, something went wrong on our end!',
  AI_FAILURE: 'Failed to generate response from AI',
  ANSWERS_REQUIRED: 'Answers must be an array.',
  ANALYTICS_FAILURE: 'Failed to fetch analytics stats',
};

module.exports = {
  MAX_PROMPT_LENGTH,
  MAX_HISTORY_LENGTH,
  DEFAULT_TRUNCATE_LIMIT,
  GLOBAL_RATE_LIMIT,
  CHAT_RATE_LIMIT,
  RATE_LIMIT_WINDOW_MS,
  AI_CACHE_TTL_SECONDS,
  DEFAULT_CACHE_TTL_SECONDS,
  CACHE_CHECK_PERIOD_SECONDS,
  MAX_BODY_SIZE,
  COMPRESSION_THRESHOLD,
  COMPRESSION_LEVEL,
  DEFAULT_PORT,
  MAX_OUTPUT_TOKENS,
  VALID_MODES,
  BQ_DATASET,
  BQ_TABLE,
  LOG_NAME,
  HTTP_STATUS,
  ERROR_MESSAGES,
};
