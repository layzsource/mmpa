/**
 * MMPA Ecosystem Database
 * SQLite database for community anchor storage
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'ecosystem.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

/**
 * Initialize database schema
 */
export function initDatabase() {
  // Anchors table
  db.exec(`
    CREATE TABLE IF NOT EXISTS anchors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      creator TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      anchor_data TEXT NOT NULL,
      tags TEXT,
      votes INTEGER DEFAULT 0,
      resonance_score REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Votes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      anchor_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      resonance INTEGER NOT NULL,
      timestamp INTEGER NOT NULL,
      FOREIGN KEY (anchor_id) REFERENCES anchors(id),
      UNIQUE(anchor_id, user_id)
    )
  `);

  // Sequences table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sequences (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      creator TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      sequence_data TEXT NOT NULL,
      tags TEXT,
      votes INTEGER DEFAULT 0,
      resonance_score REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Sequence votes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sequence_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sequence_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      resonance INTEGER NOT NULL,
      timestamp INTEGER NOT NULL,
      FOREIGN KEY (sequence_id) REFERENCES sequences(id),
      UNIQUE(sequence_id, user_id)
    )
  `);

  // Indexes for performance
  db.exec(`CREATE INDEX IF NOT EXISTS idx_anchors_resonance ON anchors(resonance_score DESC)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_anchors_timestamp ON anchors(timestamp DESC)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_votes_anchor ON votes(anchor_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_sequences_resonance ON sequences(resonance_score DESC)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_sequences_timestamp ON sequences(timestamp DESC)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_sequence_votes_sequence ON sequence_votes(sequence_id)`);

  console.log('🗄️  Database initialized');
}

/**
 * Get all anchors with pagination and filtering
 */
export function getAnchors({ limit = 20, offset = 0, tags = null, sortBy = 'recent', minResonance = 0 }) {
  let query = 'SELECT * FROM anchors WHERE resonance_score >= ?';
  const params = [minResonance];

  if (tags) {
    query += ' AND (';
    const tagList = tags.split(',');
    tagList.forEach((tag, i) => {
      if (i > 0) query += ' OR ';
      query += 'tags LIKE ?';
      params.push(`%${tag.trim()}%`);
    });
    query += ')';
  }

  // Sorting
  if (sortBy === 'resonance') {
    query += ' ORDER BY resonance_score DESC, timestamp DESC';
  } else if (sortBy === 'votes') {
    query += ' ORDER BY votes DESC, timestamp DESC';
  } else {
    query += ' ORDER BY timestamp DESC';
  }

  query += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const anchors = db.prepare(query).all(...params);

  // Get total count
  const totalQuery = 'SELECT COUNT(*) as count FROM anchors WHERE resonance_score >= ?';
  const totalParams = [minResonance];
  if (tags) {
    // ... same tag filtering for count
  }
  const total = db.prepare(totalQuery).get(...totalParams).count;

  return {
    anchors: anchors.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      creator: row.creator,
      timestamp: row.timestamp,
      tags: row.tags ? row.tags.split(',') : [],
      votes: row.votes,
      resonanceScore: row.resonance_score,
      anchor: JSON.parse(row.anchor_data)
    })),
    total,
    limit,
    offset
  };
}

/**
 * Get single anchor by ID
 */
export function getAnchor(id) {
  const row = db.prepare('SELECT * FROM anchors WHERE id = ?').get(id);

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    creator: row.creator,
    timestamp: row.timestamp,
    tags: row.tags ? row.tags.split(',') : [],
    votes: row.votes,
    resonanceScore: row.resonance_score,
    anchor: JSON.parse(row.anchor_data)
  };
}

/**
 * Create new shared anchor
 */
export function createAnchor({ anchor, creator }) {
  const id = `shared_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const tags = anchor.tags ? anchor.tags.join(',') : '';

  const stmt = db.prepare(`
    INSERT INTO anchors (id, name, description, creator, timestamp, anchor_data, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    anchor.name,
    anchor.description || '',
    creator,
    anchor.timestamp,
    JSON.stringify(anchor),
    tags
  );

  return { id };
}

/**
 * Vote on an anchor
 */
export function voteAnchor(anchorId, userId, resonance) {
  // Check if anchor exists
  const anchor = db.prepare('SELECT id FROM anchors WHERE id = ?').get(anchorId);
  if (!anchor) {
    throw new Error('Anchor not found');
  }

  // Insert or replace vote
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO votes (anchor_id, user_id, resonance, timestamp)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(anchorId, userId, resonance, Date.now());

  // Recalculate resonance score
  updateResonanceScore(anchorId);

  // Return updated stats
  const updated = db.prepare('SELECT votes, resonance_score FROM anchors WHERE id = ?').get(anchorId);
  return {
    votes: updated.votes,
    resonanceScore: updated.resonance_score
  };
}

/**
 * Update resonance score for an anchor
 * Score = (avgResonance * 2) + (uniqueVoters / 10)
 */
function updateResonanceScore(anchorId) {
  const stats = db.prepare(`
    SELECT
      COUNT(*) as vote_count,
      AVG(resonance) as avg_resonance
    FROM votes
    WHERE anchor_id = ?
  `).get(anchorId);

  const avgResonance = stats.avg_resonance || 0;
  const voteCount = stats.vote_count || 0;
  const resonanceScore = (avgResonance * 2) + (voteCount / 10);

  db.prepare('UPDATE anchors SET votes = ?, resonance_score = ? WHERE id = ?')
    .run(voteCount, resonanceScore, anchorId);
}

/**
 * Search anchors
 */
export function searchAnchors(query, tags = null, creator = null) {
  let sql = 'SELECT * FROM anchors WHERE 1=1';
  const params = [];

  if (query) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${query}%`, `%${query}%`);
  }

  if (tags) {
    const tagList = tags.split(',');
    sql += ' AND (';
    tagList.forEach((tag, i) => {
      if (i > 0) sql += ' OR ';
      sql += 'tags LIKE ?';
      params.push(`%${tag.trim()}%`);
    });
    sql += ')';
  }

  if (creator) {
    sql += ' AND creator = ?';
    params.push(creator);
  }

  sql += ' ORDER BY resonance_score DESC LIMIT 50';

  const results = db.prepare(sql).all(...params);

  return results.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    creator: row.creator,
    timestamp: row.timestamp,
    tags: row.tags ? row.tags.split(',') : [],
    votes: row.votes,
    resonanceScore: row.resonance_score,
    anchor: JSON.parse(row.anchor_data)
  }));
}

// ===================================================================
// SEQUENCE FUNCTIONS
// ===================================================================

/**
 * Get all sequences with pagination and filtering
 */
export function getSequences({ limit = 20, offset = 0, tags = null, sortBy = 'recent', minResonance = 0 }) {
  let query = 'SELECT * FROM sequences WHERE resonance_score >= ?';
  const params = [minResonance];

  if (tags) {
    query += ' AND (';
    const tagList = tags.split(',');
    tagList.forEach((tag, i) => {
      if (i > 0) query += ' OR ';
      query += 'tags LIKE ?';
      params.push(`%${tag.trim()}%`);
    });
    query += ')';
  }

  // Sorting
  if (sortBy === 'resonance') {
    query += ' ORDER BY resonance_score DESC, timestamp DESC';
  } else if (sortBy === 'votes') {
    query += ' ORDER BY votes DESC, timestamp DESC';
  } else {
    query += ' ORDER BY timestamp DESC';
  }

  query += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const sequences = db.prepare(query).all(...params);

  // Get total count
  const totalQuery = 'SELECT COUNT(*) as count FROM sequences WHERE resonance_score >= ?';
  const totalParams = [minResonance];
  const total = db.prepare(totalQuery).get(...totalParams).count;

  return {
    sequences: sequences.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      creator: row.creator,
      timestamp: row.timestamp,
      tags: row.tags ? row.tags.split(',') : [],
      votes: row.votes,
      resonanceScore: row.resonance_score,
      sequence: JSON.parse(row.sequence_data)
    })),
    total,
    limit,
    offset
  };
}

/**
 * Get single sequence by ID
 */
export function getSequenceById(id) {
  const row = db.prepare('SELECT * FROM sequences WHERE id = ?').get(id);

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    creator: row.creator,
    timestamp: row.timestamp,
    tags: row.tags ? row.tags.split(',') : [],
    votes: row.votes,
    resonanceScore: row.resonance_score,
    sequence: JSON.parse(row.sequence_data)
  };
}

/**
 * Create new shared sequence
 */
export function createSequence({ sequence, creator }) {
  const id = `shared_seq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const tags = sequence.tags ? sequence.tags.join(',') : '';

  const stmt = db.prepare(`
    INSERT INTO sequences (id, name, description, creator, timestamp, sequence_data, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    sequence.name,
    sequence.description || '',
    creator,
    sequence.timestamp,
    JSON.stringify(sequence),
    tags
  );

  return { id };
}

/**
 * Vote on a sequence
 */
export function voteSequence(sequenceId, userId, resonance) {
  // Check if sequence exists
  const sequence = db.prepare('SELECT id FROM sequences WHERE id = ?').get(sequenceId);
  if (!sequence) {
    throw new Error('Sequence not found');
  }

  // Insert or replace vote
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO sequence_votes (sequence_id, user_id, resonance, timestamp)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(sequenceId, userId, resonance, Date.now());

  // Recalculate resonance score
  updateSequenceResonanceScore(sequenceId);

  // Return updated stats
  const updated = db.prepare('SELECT votes, resonance_score FROM sequences WHERE id = ?').get(sequenceId);
  return {
    votes: updated.votes,
    resonanceScore: updated.resonance_score
  };
}

/**
 * Update resonance score for a sequence
 * Score = (avgResonance * 2) + (uniqueVoters / 10)
 */
function updateSequenceResonanceScore(sequenceId) {
  const stats = db.prepare(`
    SELECT
      COUNT(*) as vote_count,
      AVG(resonance) as avg_resonance
    FROM sequence_votes
    WHERE sequence_id = ?
  `).get(sequenceId);

  const avgResonance = stats.avg_resonance || 0;
  const voteCount = stats.vote_count || 0;
  const resonanceScore = (avgResonance * 2) + (voteCount / 10);

  db.prepare('UPDATE sequences SET votes = ?, resonance_score = ? WHERE id = ?')
    .run(voteCount, resonanceScore, sequenceId);
}

/**
 * Search sequences
 */
export function searchSequences(query, tags = null, creator = null) {
  let sql = 'SELECT * FROM sequences WHERE 1=1';
  const params = [];

  if (query) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${query}%`, `%${query}%`);
  }

  if (tags) {
    const tagList = tags.split(',');
    sql += ' AND (';
    tagList.forEach((tag, i) => {
      if (i > 0) sql += ' OR ';
      sql += 'tags LIKE ?';
      params.push(`%${tag.trim()}%`);
    });
    sql += ')';
  }

  if (creator) {
    sql += ' AND creator = ?';
    params.push(creator);
  }

  sql += ' ORDER BY resonance_score DESC LIMIT 50';

  const results = db.prepare(sql).all(...params);

  return results.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    creator: row.creator,
    timestamp: row.timestamp,
    tags: row.tags ? row.tags.split(',') : [],
    votes: row.votes,
    resonanceScore: row.resonance_score,
    sequence: JSON.parse(row.sequence_data)
  }));
}

export default db;
