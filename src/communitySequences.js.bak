console.log("🎬 communitySequences.js loaded");

/**
 * MMPA Community Sequences API Client
 * Frontend interface to Ecosystem Server for sequence sharing
 */

import { getUserId } from './communityAPI.js';

const API_BASE_URL = 'http://localhost:3003/api';

/**
 * Fetch all shared sequences
 */
export async function fetchSharedSequences({
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

    const response = await fetch(`${API_BASE_URL}/sequences?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch shared sequences:', error);
    throw error;
  }
}

/**
 * Fetch single sequence
 */
export async function fetchSequence(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/sequences/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch sequence:', error);
    throw error;
  }
}

/**
 * Share sequence to community
 */
export async function shareSequence(sequence) {
  try {
    const response = await fetch(`${API_BASE_URL}/sequences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sequence,
        creator: getUserId()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`🎬 Sequence shared to community: ${result.id}`);
    return result;
  } catch (error) {
    console.error('Failed to share sequence:', error);
    throw error;
  }
}

/**
 * Vote on a sequence
 */
export async function voteOnSequence(sequenceId, resonance) {
  try {
    const response = await fetch(`${API_BASE_URL}/sequences/${sequenceId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: getUserId(),
        resonance
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`⭐ Voted on sequence: ${sequenceId} (${resonance})`);
    return result;
  } catch (error) {
    console.error('Failed to vote:', error);
    throw error;
  }
}

/**
 * Search sequences
 */
export async function searchSequences(query, tags = null, creator = null) {
  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (tags) params.append('tags', tags);
    if (creator) params.append('creator', creator);

    const response = await fetch(`${API_BASE_URL}/sequences-search?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to search sequences:', error);
    throw error;
  }
}

console.log("🎬 Community Sequences API ready");
