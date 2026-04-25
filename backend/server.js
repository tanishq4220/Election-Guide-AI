const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 8080;

// Performance & Security Middlewares
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin: "*",
}));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use('/api/', limiter);

// Cache static assets (if serving frontend from here)
app.use("/_next", express.static(".next", {
  maxAge: "1y",
  immutable: true
}));

// Health + Metrics Endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Root Redirect/Status
app.get("/", (req, res) => {
  res.send("Election Guide AI Backend Running ✅");
});

// Routes
const aiRoutes = require('./routes/aiRoutes');
const healthRoutes = require('./routes/healthRoutes');

app.use('/api/ai', aiRoutes);
app.use('/api', aiRoutes);
app.use('/api/health', healthRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Sorry, something went wrong on our end!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
