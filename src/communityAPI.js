console.log("🌍 communityAPI.js loaded");

/**
 * MMPA Community API Client
 * Frontend interface to Ecosystem Server
 */

const API_BASE_URL = 'http://localhost:3003/api';

// Simple user ID (in future, this would be proper authentication)
let currentUserId = localStorage.getItem('mmpa_user_id');
if (!currentUserId) {
  currentUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('mmpa_user_id', currentUserId);
}

/**
 * Get current user ID
 */
export function getUserId() {
  return currentUserId;
}

/**
 * Fetch all shared anchors
 */
export async function fetchSharedAnchors({
  limit = 20,
  offset = 0,
  tags = null,
  sortBy = 'recent',
  minResonance = 0
} = {}) {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      sortBy,
      minResonance: minResonance.toString()
    });

    if (tags) params.append('tags', tags);

    const response = await fetch(`${API_BASE_URL}/anchors?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch shared anchors:', error);
    throw error;
  }
}

/**
 * Fetch single anchor
 */
export async function fetchAnchor(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/anchors/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch anchor:', error);
    throw error;
  }
}

/**
 * Share anchor to community
 */
export async function shareAnchor(anchor) {
  try {
    const response = await fetch(`${API_BASE_URL}/anchors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        anchor,
        creator: currentUserId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`🌍 Anchor shared to community: ${result.id}`);
    return result;
  } catch (error) {
    console.error('Failed to share anchor:', error);
    throw error;
  }
}

/**
 * Vote on an anchor
 */
export async function voteOnAnchor(anchorId, resonance) {
  try {
    const response = await fetch(`${API_BASE_URL}/anchors/${anchorId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: currentUserId,
        resonance
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`⭐ Voted on anchor: ${anchorId} (${resonance})`);
    return result;
  } catch (error) {
    console.error('Failed to vote:', error);
    throw error;
  }
}

/**
 * Search anchors
 */
export async function searchAnchors(query, tags = null, creator = null) {
  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (tags) params.append('tags', tags);
    if (creator) params.append('creator', creator);

    const response = await fetch(`${API_BASE_URL}/search?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to search:', error);
    throw error;
  }
}

/**
 * Check if server is available
 */
export async function checkServerStatus() {
  try {
    const response = await fetch('http://localhost:3003/health');
    return response.ok;
  } catch (error) {
    return false;
  }
}

console.log(`🌍 Community API ready (User: ${currentUserId})`);
