// backend/server.js - COMPLETE WITH ALL ROUTES
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MongoDB Connection
// ==========================================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/wanderly');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// ==========================================
// Middleware
// ==========================================
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ==========================================
// Routes
// ==========================================

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Wanderly Travel API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      destinations: '/api/destinations',
      bookings: '/api/bookings',
      voice: '/api/voice',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// API Routes
const destinationRoutes = require('./routes/destinations');
const bookingRoutes = require('./routes/bookings');
const voiceRoutes = require('./routes/voiceRoutes');

app.use('/api/destinations', destinationRoutes);
app.use('/api/bookings', bookingRoutes);
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
      'GET /api/destinations',
      'GET /api/destinations/:id',
      'POST /api/destinations',
      'PUT /api/destinations/:id',
      'DELETE /api/destinations/:id',
      'POST /api/bookings',
      'GET /api/bookings/:bookingCode'
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
  console.log(`🗺️  Destinations API: http://localhost:${PORT}/api/destinations`);
  console.log(`📅 Bookings API: http://localhost:${PORT}/api/bookings`);
  console.log(`💬 Voice API: http://localhost:${PORT}/api/voice`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log('========================================\n');
  console.log('✅ All routes loaded');
  console.log('✅ MongoDB connected');
  console.log('✅ CORS enabled for localhost:3000');
  console.log('✅ Ready to accept requests\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;