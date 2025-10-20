// backend/server.js
// Main Express server for Wanderly Travel MVP

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// Middleware
// ==========================================

// CORS - Allow frontend requests
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Body parser - Parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ==========================================
// Routes
// ==========================================

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Wanderly Travel API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      voice: '/api/voice',
      health: '/health'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Voice API routes
const voiceRoutes = require('./routes/voiceRoutes');
app.use('/api/voice', voiceRoutes);

// ==========================================
// Error Handling
// ==========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.path} not found`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /api/voice/start-session',
      'POST /api/voice/text-query',
      'GET /api/voice/session/:sessionId',
      'DELETE /api/voice/session/:sessionId',
      'GET /api/voice/stats'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==========================================
// Start Server
// ==========================================

app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🚀 Wanderly Travel API Server');
  console.log('========================================');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Base URL: http://localhost:${PORT}`);
  console.log(`💬 Voice API: http://localhost:${PORT}/api/voice`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log('========================================\n');
  console.log('✅ Voice API routes loaded');
  console.log('✅ CORS enabled for localhost:3000');
  console.log('✅ Ready to accept requests\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;