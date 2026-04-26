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
const { cacheMiddleware } = require('./middleware/cache');

const app = express();
const PORT = process.env.PORT || 8080;

// ─── Performance & Security Middlewares ─────────────────────────────
app.use(compression({ level: 6, threshold: 1024 }));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "apis.google.com"],
      connectSrc: ["'self'", "*.googleapis.com", "*.firebaseapp.com"],
    }
  }
}));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || "*",
}));
app.use(express.json({ limit: '10kb' })); // Reject oversized payloads

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
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests from this IP, please try again after 15 minutes" }
});
app.use('/api/', limiter);

// ─── Cache static assets ───────────────────────────────────────────
app.use("/_next", express.static(".next", {
  maxAge: "1y",
  immutable: true
}));

// ─── Health + Metrics Endpoint ──────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: require('./package.json').version
  });
});

// ─── Root Status ────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Election Guide AI Backend Running ✅");
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
  res.status(404).json({ error: 'Endpoint not found' });
});

// ─── Error Handling ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error('Unhandled server error', err);
  res.status(500).json({ error: 'Sorry, something went wrong on our end!' });
});

// ─── Start Server (only when not imported for testing) ──────────────
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;
