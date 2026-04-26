/**
 * Health check routes with uptime and analytics metrics.
 * @module routes/healthRoutes
 */
const express = require('express');
const router = express.Router();
const { getUsageStats } = require('../services/analytics');
const { cacheMiddleware } = require('../middleware/cache');

/**
 * GET / — Returns health status, uptime, and environment information.
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
 * GET /stats — Returns aggregated usage analytics from BigQuery (cached 5 min).
 */
router.get('/stats', cacheMiddleware(300), async (req, res) => {
  try {
    const stats = await getUsageStats();
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics stats' });
  }
});

module.exports = router;
