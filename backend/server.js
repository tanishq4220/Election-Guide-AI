/**
 * Election Guide AI — Express Application Server
 *
 * Production-grade backend with:
 * - Google Cloud Logging & BigQuery analytics
 * - Compression, Helmet security, CORS
 * - Rate limiting, input validation, caching
 * - Health monitoring with uptime & metrics
 *
 * @module server
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const logger = require('./services/logger');
const {
  GLOBAL_RATE_LIMIT,
  RATE_LIMIT_WINDOW_MS,
  MAX_BODY_SIZE,
  COMPRESSION_THRESHOLD,
  COMPRESSION_LEVEL,
  DEFAULT_PORT,
  HTTP_STATUS,
  ERROR_MESSAGES,
} = require('./constants');

const app = express();
const PORT = process.env.PORT || DEFAULT_PORT;

// ─── Performance & Security Middlewares ─────────────────────────────
app.use(compression({ level: COMPRESSION_LEVEL, threshold: COMPRESSION_THRESHOLD }));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'apis.google.com'],
      connectSrc: ["'self'", '*.googleapis.com', '*.firebaseapp.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: MAX_BODY_SIZE }));

// ─── Response Time Tracking ─────────────────────────────────────────
app.use((req, res, next) => {
  req._startTime = Date.now();
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - req._startTime;
    if (!res.headersSent) {
      res.setHeader('X-Response-Time', `${duration}ms`);
    }
    originalEnd.apply(res, args);
  };
  next();
});

// ─── Global Rate Limiting ───────────────────────────────────────────
const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: GLOBAL_RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: ERROR_MESSAGES.GLOBAL_RATE_LIMITED },
});
app.use('/api/', limiter);

// ─── Cache static assets ───────────────────────────────────────────
app.use('/_next', express.static('.next', {
  maxAge: '1y',
  immutable: true,
}));

// ─── Health + Metrics Endpoint ──────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: require('./package.json').version,
  });
});

// ─── Root Status ────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Election Guide AI Backend Running ✅');
});

// ─── Routes ─────────────────────────────────────────────────────────
const aiRoutes = require('./routes/aiRoutes');
const healthRoutes = require('./routes/healthRoutes');
const quizRoutes = require('./routes/quizRoutes');

app.use('/api/ai', aiRoutes);
app.use('/api', aiRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/quiz', quizRoutes);

// ─── 404 Handler ────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ error: ERROR_MESSAGES.ENDPOINT_NOT_FOUND });
});

// ─── Error Handling ─────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  logger.error('Unhandled server error', err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: ERROR_MESSAGES.INTERNAL_ERROR,
  });
});

// ─── Start Server (only when not imported for testing) ──────────────
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;
