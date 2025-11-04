# MMPA Ecosystem API Schema

## Overview
RESTful API for sharing and discovering phenomenological mapping anchors.

**Base URL:** `http://localhost:3003/api`

---

## Endpoints

### 1. List Shared Anchors
**GET** `/anchors`

Query Parameters:
- `limit` (number, default: 20) - Results per page
- `offset` (number, default: 0) - Pagination offset
- `tags` (string, comma-separated) - Filter by tags
- `sortBy` (string: 'recent', 'resonance', 'votes') - Sort order
- `minResonance` (number) - Minimum resonance score

Response:
```json
{
  "anchors": [
    {
      "id": "shared_1234567890",
      "name": "Wolf Fifth Awakening",
      "description": "...",
      "creator": "user_abc",
      "timestamp": 1234567890,
      "tags": ["harmonic", "experimental"],
      "votes": 42,
      "resonanceScore": 8.7,
      "anchor": { ... full anchor data ... }
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

### 2. Get Single Anchor
**GET** `/anchors/:id`

Response:
```json
{
  "id": "shared_1234567890",
  "name": "Wolf Fifth Awakening",
  "creator": "user_abc",
  "timestamp": 1234567890,
  "votes": 42,
  "resonanceScore": 8.7,
  "anchor": { ... full anchor data ... }
}
```

### 3. Share New Anchor
**POST** `/anchors`

Request Body:
```json
{
  "anchor": { ... full anchor object ... },
  "creator": "user_abc"
}
```

Response:
```json
{
  "id": "shared_1234567890",
  "message": "Anchor shared successfully"
}
```

### 4. Vote/Resonate with Anchor
**POST** `/anchors/:id/vote`

Request Body:
```json
{
  "userId": "user_abc",
  "resonance": 5  // 1-5 scale
}
```

Response:
```json
{
  "votes": 43,
  "resonanceScore": 8.8,
  "message": "Vote recorded"
}
```

### 5. Search Anchors
**GET** `/anchors/search`

Query Parameters:
- `q` (string) - Search query (name, description)
- `tags` (string, comma-separated) - Filter by tags
- `creator` (string) - Filter by creator

Response: Same as List Anchors

---

## Database Schema (SQLite)

### Table: `anchors`
```sql
CREATE TABLE anchors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  creator TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  anchor_data TEXT NOT NULL,  -- JSON string
  tags TEXT,                  -- Comma-separated
  votes INTEGER DEFAULT 0,
  resonance_score REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `votes`
```sql
CREATE TABLE votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  anchor_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  resonance INTEGER NOT NULL,  -- 1-5 scale
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (anchor_id) REFERENCES anchors(id),
  UNIQUE(anchor_id, user_id)  -- One vote per user per anchor
);
```

---

## Resonance Score Algorithm

**Ethical Farming Metric:**
```
resonanceScore = (avgResonance * 2) + (uniqueVoters / 10)
```

Where:
- `avgResonance` = Average of all resonance votes (1-5 scale)
- `uniqueVoters` = Number of unique users who voted
- Weighted toward quality (avg * 2) over quantity (voters / 10)

Example:
- 10 votes, average 4.5 resonance
- Score = (4.5 * 2) + (10 / 10) = 9.0 + 1.0 = **10.0**

This prevents spam and rewards genuinely resonant discoveries.

---

## Authentication (MVP)

For MVP, using simple user ID strings (no passwords).
Future: JWT tokens, OAuth, proper user management.

Request Header:
```
X-User-Id: user_abc
```
