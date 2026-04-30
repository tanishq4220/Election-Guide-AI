/**
 * Health check routes with uptime, memory metrics, and analytics stats.
 * Provides system monitoring endpoints for operational visibility.
 * @module routes/healthRoutes
 */
const express = require('express');

const router = express.Router();
const { getUsageStats } = require('../services/analytics');
const { cacheMiddleware } = require('../middleware/cache');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');

/**
 * GET / — Returns health status, uptime, memory usage, and environment info.
 * @route GET /
 * @returns {{ status: string, uptime: number, timestamp: string, environment: string, memory: object }}
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage(),
  });
});

/**
 * GET /stats — Returns aggregated usage analytics from BigQuery.
 * Responses are cached for 5 minutes to reduce BigQuery costs.
 * @route GET /stats
 * @returns {{ stats: Array }}
 */
router.get('/stats', cacheMiddleware(300), async (req, res) => {
  try {
    const stats = await getUsageStats();
    res.json({ stats });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGES.ANALYTICS_FAILURE,
    });
  }
});

module.exports = router;
