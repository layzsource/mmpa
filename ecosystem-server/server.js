/**
 * MMPA Ecosystem Server
 * Backend API for community anchor sharing
 */

import express from 'express';
import cors from 'cors';
import {
  initDatabase,
  getAnchors,
  getAnchor,
  createAnchor,
  voteAnchor,
  searchAnchors,
  getSequences,
  getSequenceById,
  createSequence,
  voteSequence,
  searchSequences
} from './database.js';

const app = express();
const PORT = 3003;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Large limit for anchor data

// Initialize database
initDatabase();

// ===================================================================
// API Routes
// ===================================================================

/**
 * GET /api/anchors - List all shared anchors
 */
app.get('/api/anchors', (req, res) => {
  try {
    const {
      limit = 20,
      offset = 0,
      tags = null,
      sortBy = 'recent',
      minResonance = 0
    } = req.query;

    const result = getAnchors({
      limit: parseInt(limit),
      offset: parseInt(offset),
      tags,
      sortBy,
      minResonance: parseFloat(minResonance)
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching anchors:', error);
    res.status(500).json({ error: 'Failed to fetch anchors' });
  }
});

/**
 * GET /api/anchors/:id - Get single anchor
 */
app.get('/api/anchors/:id', (req, res) => {
  try {
    const anchor = getAnchor(req.params.id);

    if (!anchor) {
      return res.status(404).json({ error: 'Anchor not found' });
    }

    res.json(anchor);
  } catch (error) {
    console.error('Error fetching anchor:', error);
    res.status(500).json({ error: 'Failed to fetch anchor' });
  }
});

/**
 * POST /api/anchors - Share new anchor
 */
app.post('/api/anchors', (req, res) => {
  try {
    const { anchor, creator } = req.body;

    if (!anchor || !creator) {
      return res.status(400).json({ error: 'Missing anchor or creator' });
    }

    const result = createAnchor({ anchor, creator });

    res.status(201).json({
      id: result.id,
      message: 'Anchor shared successfully'
    });

    console.log(`✅ New anchor shared: "${anchor.name}" by ${creator}`);
  } catch (error) {
    console.error('Error creating anchor:', error);
    res.status(500).json({ error: 'Failed to create anchor' });
  }
});

/**
 * POST /api/anchors/:id/vote - Vote on anchor
 */
app.post('/api/anchors/:id/vote', (req, res) => {
  try {
    const { userId, resonance } = req.body;

    if (!userId || !resonance) {
      return res.status(400).json({ error: 'Missing userId or resonance' });
    }

    if (resonance < 1 || resonance > 5) {
      return res.status(400).json({ error: 'Resonance must be 1-5' });
    }

    const result = voteAnchor(req.params.id, userId, resonance);

    res.json({
      ...result,
      message: 'Vote recorded'
    });

    console.log(`⭐ Vote recorded: ${userId} → ${req.params.id} (${resonance})`);
  } catch (error) {
    console.error('Error recording vote:', error);
    if (error.message === 'Anchor not found') {
      return res.status(404).json({ error: 'Anchor not found' });
    }
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

/**
 * GET /api/anchors/search - Search anchors
 */
app.get('/api/search', (req, res) => {
  try {
    const { q, tags, creator } = req.query;

    const results = searchAnchors(q, tags, creator);

    res.json({
      results,
      total: results.length
    });
  } catch (error) {
    console.error('Error searching anchors:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// ===================================================================
// SEQUENCE API ROUTES
// ===================================================================

/**
 * GET /api/sequences - List all shared sequences
 */
app.get('/api/sequences', (req, res) => {
  try {
    const {
      limit = 20,
      offset = 0,
      tags = null,
      sortBy = 'recent',
      minResonance = 0
    } = req.query;

    const result = getSequences({
      limit: parseInt(limit),
      offset: parseInt(offset),
      tags,
      sortBy,
      minResonance: parseFloat(minResonance)
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching sequences:', error);
    res.status(500).json({ error: 'Failed to fetch sequences' });
  }
});

/**
 * GET /api/sequences/:id - Get single sequence
 */
app.get('/api/sequences/:id', (req, res) => {
  try {
    const sequence = getSequenceById(req.params.id);

    if (!sequence) {
      return res.status(404).json({ error: 'Sequence not found' });
    }

    res.json(sequence);
  } catch (error) {
    console.error('Error fetching sequence:', error);
    res.status(500).json({ error: 'Failed to fetch sequence' });
  }
});

/**
 * POST /api/sequences - Share new sequence
 */
app.post('/api/sequences', (req, res) => {
  try {
    const { sequence, creator } = req.body;

    if (!sequence || !creator) {
      return res.status(400).json({ error: 'Missing sequence or creator' });
    }

    const result = createSequence({ sequence, creator });

    res.status(201).json({
      id: result.id,
      message: 'Sequence shared successfully'
    });

    console.log(`✅ New sequence shared: "${sequence.name}" by ${creator}`);
  } catch (error) {
    console.error('Error creating sequence:', error);
    res.status(500).json({ error: 'Failed to create sequence' });
  }
});

/**
 * POST /api/sequences/:id/vote - Vote on sequence
 */
app.post('/api/sequences/:id/vote', (req, res) => {
  try {
    const { userId, resonance } = req.body;

    if (!userId || !resonance) {
      return res.status(400).json({ error: 'Missing userId or resonance' });
    }

    if (resonance < 1 || resonance > 5) {
      return res.status(400).json({ error: 'Resonance must be 1-5' });
    }

    const result = voteSequence(req.params.id, userId, resonance);

    res.json({
      ...result,
      message: 'Vote recorded'
    });

    console.log(`⭐ Vote recorded: ${userId} → ${req.params.id} (${resonance})`);
  } catch (error) {
    console.error('Error recording vote:', error);
    if (error.message === 'Sequence not found') {
      return res.status(404).json({ error: 'Sequence not found' });
    }
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

/**
 * GET /api/sequences/search - Search sequences
 */
app.get('/api/sequences-search', (req, res) => {
  try {
    const { q, tags, creator } = req.query;

    const results = searchSequences(q, tags, creator);

    res.json({
      results,
      total: results.length
    });
  } catch (error) {
    console.error('Error searching sequences:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

/**
 * GET /api/stats - Get ecosystem statistics
 */
app.get('/api/stats', (req, res) => {
  try {
    // This would query database for stats
    // For now, return mock data
    res.json({
      totalAnchors: 0,
      totalVotes: 0,
      topTags: []
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'MMPA Ecosystem Server' });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🌱 ========================================');
  console.log('🌱  MMPA Ecosystem Server');
  console.log('🌱 ========================================');
  console.log(`🌱  Port: ${PORT}`);
  console.log(`🌱  API: http://localhost:${PORT}/api`);
  console.log('🌱 ========================================');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🌱 Ecosystem server shutting down...');
  process.exit(0);
});
