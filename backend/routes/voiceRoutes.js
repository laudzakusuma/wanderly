// backend/routes/voiceRoutes.js
// Express routes untuk Voice Agent API

const express = require('express');
const router = express.Router();

// In-memory session storage (untuk demo)
const sessions = new Map();

// Fungsi untuk generate session ID
function generateSessionId() {
  return 'sess_' + Math.random().toString(36).substring(2, 15);
}

// Mock data destinasi
const destinations = [
  {
    id: 1,
    name: 'Bali',
    description: 'Pulau Dewata dengan pantai eksotis dan budaya yang kaya',
    price: 'Mulai dari Rp 2.500.000',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
    category: 'beach'
  },
  {
    id: 2,
    name: 'Raja Ampat',
    description: 'Surga bawah laut dengan keanekaragaman hayati terbaik',
    price: 'Mulai dari Rp 8.000.000',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    category: 'beach'
  },
  {
    id: 3,
    name: 'Bromo',
    description: 'Gunung berapi aktif dengan pemandangan sunrise menakjubkan',
    price: 'Mulai dari Rp 1.800.000',
    image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=400',
    category: 'mountain'
  },
  {
    id: 4,
    name: 'Yogyakarta',
    description: 'Kota budaya dengan candi Borobudur dan Prambanan',
    price: 'Mulai dari Rp 1.500.000',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400',
    category: 'culture'
  },
  {
    id: 5,
    name: 'Labuan Bajo',
    description: 'Gerbang menuju Pulau Komodo dan Pink Beach',
    price: 'Mulai dari Rp 3.500.000',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    category: 'beach'
  }
];

// Simple NLP untuk process user query
function processUserQuery(text) {
  const lowerText = text.toLowerCase();
  
  // Keywords untuk beach
  const beachKeywords = ['pantai', 'beach', 'laut', 'diving', 'snorkeling', 'pasir'];
  // Keywords untuk mountain
  const mountainKeywords = ['gunung', 'mountain', 'hiking', 'pendakian', 'summit'];
  // Keywords untuk culture
  const cultureKeywords = ['budaya', 'culture', 'candi', 'temple', 'sejarah', 'history'];
  // Keywords untuk cheap/budget
  const budgetKeywords = ['murah', 'budget', 'hemat', 'terjangkau', 'cheap'];
  
  let matchedDestinations = [];
  let responseMessage = '';

  // Check for beach
  if (beachKeywords.some(keyword => lowerText.includes(keyword))) {
    matchedDestinations = destinations.filter(d => d.category === 'beach');
    responseMessage = 'Saya menemukan beberapa destinasi pantai yang menakjubkan untuk Anda!';
  }
  // Check for mountain
  else if (mountainKeywords.some(keyword => lowerText.includes(keyword))) {
    matchedDestinations = destinations.filter(d => d.category === 'mountain');
    responseMessage = 'Berikut adalah destinasi gunung terbaik di Indonesia!';
  }
  // Check for culture
  else if (cultureKeywords.some(keyword => lowerText.includes(keyword))) {
    matchedDestinations = destinations.filter(d => d.category === 'culture');
    responseMessage = 'Ini dia destinasi wisata budaya yang kaya akan sejarah!';
  }
  // Check for budget
  else if (budgetKeywords.some(keyword => lowerText.includes(keyword))) {
    matchedDestinations = destinations.filter(d => {
      const price = parseInt(d.price.match(/\d+/)[0]);
      return price < 2000000;
    });
    responseMessage = 'Saya menemukan destinasi wisata dengan harga terjangkau untuk Anda!';
  }
  // Default: recommend popular destinations
  else {
    matchedDestinations = destinations.slice(0, 3);
    responseMessage = 'Berikut adalah beberapa destinasi wisata populer yang mungkin Anda suka!';
  }

  // Limit to max 3 destinations
  if (matchedDestinations.length > 3) {
    matchedDestinations = matchedDestinations.slice(0, 3);
  }

  return {
    message: responseMessage,
    destinations: matchedDestinations
  };
}

// ==========================================
// API ROUTES
// ==========================================

/**
 * POST /api/voice/start-session
 * Initialize new voice session
 */
router.post('/start-session', (req, res) => {
  try {
    const sessionId = generateSessionId();
    
    // Create new session
    sessions.set(sessionId, {
      id: sessionId,
      createdAt: new Date(),
      messages: []
    });

    console.log(`✅ New session created: ${sessionId}`);

    res.json({
      sessionId,
      message: 'Halo! Aku Wanderly, asisten travel virtual kamu. Mau cari destinasi wisata kemana hari ini?'
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      error: 'Failed to create session',
      message: error.message
    });
  }
});

/**
 * POST /api/voice/text-query
 * Process text query from user
 */
router.post('/text-query', (req, res) => {
  try {
    const { sessionId, text } = req.body;

    // Validate request
    if (!sessionId || !text) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'sessionId and text are required'
      });
    }

    // Check if session exists
    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        error: 'Session not found',
        message: 'Invalid or expired session ID'
      });
    }

    // Process user query
    const result = processUserQuery(text);

    // Save to session
    session.messages.push({
      type: 'user',
      text: text,
      timestamp: new Date()
    });

    session.messages.push({
      type: 'ai',
      text: result.message,
      destinations: result.destinations,
      timestamp: new Date()
    });

    console.log(`💬 Query processed for session ${sessionId}: "${text}"`);

    res.json({
      message: result.message,
      destinations: result.destinations,
      sessionId: sessionId
    });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({
      error: 'Failed to process query',
      message: error.message
    });
  }
});

/**
 * GET /api/voice/session/:sessionId
 * Get session details
 */
router.get('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        error: 'Session not found',
        message: 'Invalid or expired session ID'
      });
    }

    res.json({
      sessionId: session.id,
      createdAt: session.createdAt,
      messageCount: session.messages.length,
      messages: session.messages
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      error: 'Failed to fetch session',
      message: error.message
    });
  }
});

/**
 * DELETE /api/voice/session/:sessionId
 * Delete session
 */
router.delete('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;

    if (sessions.has(sessionId)) {
      sessions.delete(sessionId);
      console.log(`🗑️  Session deleted: ${sessionId}`);
      
      res.json({
        message: 'Session deleted successfully',
        sessionId: sessionId
      });
    } else {
      res.status(404).json({
        error: 'Session not found',
        message: 'Invalid session ID'
      });
    }
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({
      error: 'Failed to delete session',
      message: error.message
    });
  }
});

/**
 * GET /api/voice/stats
 * Get system statistics
 */
router.get('/stats', (req, res) => {
  try {
    res.json({
      activeSessions: sessions.size,
      totalDestinations: destinations.length,
      uptime: process.uptime(),
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      error: 'Failed to fetch stats',
      message: error.message
    });
  }
});

// Cleanup old sessions (run every 1 hour)
setInterval(() => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  let deletedCount = 0;

  sessions.forEach((session, sessionId) => {
    if (session.createdAt < oneHourAgo) {
      sessions.delete(sessionId);
      deletedCount++;
    }
  });

  if (deletedCount > 0) {
    console.log(`🧹 Cleaned up ${deletedCount} old sessions`);
  }
}, 60 * 60 * 1000); // 1 hour

module.exports = router;