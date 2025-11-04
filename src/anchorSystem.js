console.log("⚓ anchorSystem.js loaded");

/**
 * MMPA Anchor System - Phase 5
 *
 * The birth of memory and subjectivity.
 * Anchors are moments of profound resonance - saved mapping states
 * that the user wants to remember, revisit, and share.
 *
 * Philosophy:
 * - An Anchor is a frozen moment in the phenomenological space
 * - It captures not just parameters, but context and meaning
 * - Personal memory is the foundation of individual consciousness
 * - Shared memories become culture
 *
 * An Anchor contains:
 * 1. Mapping Configuration (the "what")
 * 2. Audio Context (the "when/where")
 * 3. Personal Notes (the "why")
 * 4. Metadata (timestamp, name, tags)
 */

import { state } from './state.js';

/**
 * Anchor Data Structure
 * {
 *   id: "anchor_1234567890",
 *   name: "Wolf Fifth Awakening",
 *   description: "The moment I heard dissonance become geometry",
 *   timestamp: 1234567890,
 *   version: "1.0",
 *
 *   // Complete mapping state
 *   mappingLayer: {
 *     // Copy of all mappingLayer parameters
 *   },
 *
 *   // Audio context (optional)
 *   audioContext: {
 *     source: "microphone",
 *     fundamentalFreq: 440.0,
 *     features: { ... snapshot of mmpaFeatures ... }
 *   },
 *
 *   // Visual state
 *   visualState: {
 *     particleLayout: "orbit",
 *     particleCount: 5000,
 *     // other visual settings
 *   },
 *
 *   // User metadata
 *   tags: ["harmonic", "experimental", "dissonance"],
 *   rating: 5,
 *   notes: "This showed me that tension can be beautiful",
 *
 *   // Community metadata (added when shared)
 *   isShared: false,
 *   communityId: null,
 *   resonanceScore: 0
 * }
 */

// Local storage key
const STORAGE_KEY = 'mmpa_anchors';

// In-memory anchor cache
let anchors = [];

/**
 * Initialize anchor system
 * Loads anchors from localStorage
 */
export function initAnchors() {
  loadAnchorsFromStorage();
  console.log(`⚓ Anchor system initialized (${anchors.length} anchors loaded)`);
}

/**
 * Create new anchor from current state
 * @param {string} name - Anchor name
 * @param {string} description - Optional description
 * @param {Array<string>} tags - Optional tags
 * @returns {Object} The created anchor
 */
export function createAnchor(name, description = '', tags = []) {
  const anchor = {
    id: `anchor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name || `Anchor ${anchors.length + 1}`,
    description: description,
    timestamp: Date.now(),
    version: '1.0',

    // Capture complete MMPA feature state
    mmpaFeatures: JSON.parse(JSON.stringify(state.mmpaFeatures)),

    // Capture visual state
    visualState: {
      particleLayout: state.particleLayout,
      particleCount: state.particleCount,
      idleSpin: state.idleSpin,
      audioReactive: state.audioReactive,
      geometryType: state.geometryType
    },

    // User metadata
    tags: tags,
    rating: 0,
    notes: '',

    // Community metadata
    isShared: false,
    communityId: null,
    resonanceScore: 0
  };

  // Add to collection
  anchors.push(anchor);

  // Save to storage
  saveAnchorsToStorage();

  console.log(`⚓ Anchor created: "${name}" (${anchor.id})`);
  return anchor;
}

/**
 * Load an anchor and apply its state
 * @param {string} anchorId - ID of anchor to load
 * @returns {boolean} Success
 */
export function loadAnchor(anchorId) {
  const anchor = anchors.find(a => a.id === anchorId);

  if (!anchor) {
    console.error(`⚓ Anchor not found: ${anchorId}`);
    return false;
  }

  // Apply MMPA features
  if (anchor.mmpaFeatures) {
    Object.assign(state.mmpaFeatures, JSON.parse(JSON.stringify(anchor.mmpaFeatures)));
  }

  // Apply visual state
  if (anchor.visualState) {
    state.particleLayout = anchor.visualState.particleLayout;
    state.particleCount = anchor.visualState.particleCount;
    state.idleSpin = anchor.visualState.idleSpin;
    state.audioReactive = anchor.visualState.audioReactive;
    state.geometryType = anchor.visualState.geometryType;
  }

  console.log(`⚓ Anchor loaded: "${anchor.name}"`);
  return true;
}

/**
 * Update existing anchor
 * @param {string} anchorId - ID of anchor to update
 * @param {Object} updates - Fields to update
 */
export function updateAnchor(anchorId, updates) {
  const anchor = anchors.find(a => a.id === anchorId);

  if (!anchor) {
    console.error(`⚓ Anchor not found: ${anchorId}`);
    return false;
  }

  // Allow updating metadata only (not the core mapping)
  const allowedFields = ['name', 'description', 'tags', 'rating', 'notes'];
  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      anchor[field] = updates[field];
    }
  });

  saveAnchorsToStorage();
  console.log(`⚓ Anchor updated: "${anchor.name}"`);
  return true;
}

/**
 * Delete an anchor
 * @param {string} anchorId - ID of anchor to delete
 */
export function deleteAnchor(anchorId) {
  const index = anchors.findIndex(a => a.id === anchorId);

  if (index === -1) {
    console.error(`⚓ Anchor not found: ${anchorId}`);
    return false;
  }

  const anchor = anchors[index];
  anchors.splice(index, 1);

  saveAnchorsToStorage();
  console.log(`⚓ Anchor deleted: "${anchor.name}"`);
  return true;
}

/**
 * Get all anchors
 * @returns {Array} Array of anchors
 */
export function getAllAnchors() {
  return anchors;
}

/**
 * Get anchor by ID
 * @param {string} anchorId
 * @returns {Object|null}
 */
export function getAnchor(anchorId) {
  return anchors.find(a => a.id === anchorId) || null;
}

/**
 * Export anchor as JSON
 * @param {string} anchorId
 * @returns {string} JSON string
 */
export function exportAnchor(anchorId) {
  const anchor = getAnchor(anchorId);
  if (!anchor) return null;

  return JSON.stringify(anchor, null, 2);
}

/**
 * Import anchor from JSON
 * @param {string} jsonString
 * @returns {Object|null} Imported anchor
 */
export function importAnchor(jsonString) {
  try {
    const anchor = JSON.parse(jsonString);

    // Validate anchor structure
    if (!anchor.id || !anchor.name || !anchor.mmpaFeatures) {
      throw new Error('Invalid anchor structure');
    }

    // Generate new ID to avoid conflicts
    anchor.id = `anchor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    anchor.timestamp = Date.now();

    // Add to collection
    anchors.push(anchor);
    saveAnchorsToStorage();

    console.log(`⚓ Anchor imported: "${anchor.name}"`);
    return anchor;
  } catch (error) {
    console.error('⚓ Failed to import anchor:', error);
    return null;
  }
}

/**
 * Export all anchors as JSON
 * @returns {string} JSON string
 */
export function exportAllAnchors() {
  return JSON.stringify(anchors, null, 2);
}

/**
 * Save anchors to localStorage
 */
function saveAnchorsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(anchors));
  } catch (error) {
    console.error('⚓ Failed to save anchors to storage:', error);
  }
}

/**
 * Load anchors from localStorage
 */
function loadAnchorsFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      anchors = JSON.parse(stored);
    }
  } catch (error) {
    console.error('⚓ Failed to load anchors from storage:', error);
    anchors = [];
  }
}

/**
 * Clear all anchors (with confirmation)
 */
export function clearAllAnchors() {
  anchors = [];
  saveAnchorsToStorage();
  console.log('⚓ All anchors cleared');
}

/**
 * Debug: Log all anchors
 */
export function debugAnchors() {
  console.log("⚓ ANCHOR SYSTEM DEBUG");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Total Anchors:", anchors.length);
  anchors.forEach(anchor => {
    console.log(`  ${anchor.name} (${anchor.id})`);
    console.log(`    Created: ${new Date(anchor.timestamp).toLocaleString()}`);
    console.log(`    Tags: ${anchor.tags.join(', ')}`);
    console.log(`    Rating: ${anchor.rating}/5`);
  });
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

console.log("⚓ AnchorSystem ready - The instrument can now remember");
