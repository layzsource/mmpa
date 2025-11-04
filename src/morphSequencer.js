console.log("🎬 morphSequencer.js loaded");

/**
 * MMPA Morph Sequencer - Phase 8
 *
 * Compose and perform pre-programmed sequences of morphs.
 * This is where memory becomes narrative - curated journeys
 * through phenomenological space.
 */

import { state } from './state.js';
import { startMorph, stopMorph, isMorphingActive } from './anchorMorphing.js';
import { getAnchor } from './anchorSystem.js';

// Storage key
const STORAGE_KEY = 'mmpa_sequences';

// Sequence storage
let sequences = [];

// Playback state
let currentSequence = null;
let currentStepIndex = 0;
let isPlaying = false;
let isPaused = false;
let loopEnabled = false;
let playbackTimeout = null;

/**
 * Sequence Data Structure:
 * {
 *   id: "seq_123",
 *   name: "Journey Through Chaos",
 *   description: "A exploration of extremes",
 *   steps: [
 *     {
 *       anchorId: "anchor_1",
 *       duration: 5000,
 *       easing: "easeInOutCubic",
 *       pauseAfter: 1000
 *     },
 *     ...
 *   ],
 *   loop: false,
 *   timestamp: 123456789,
 *   tags: ["performance", "ambient"]
 * }
 */

// ===================================================================
// SEQUENCE MANAGEMENT
// ===================================================================

/**
 * Initialize - load sequences from localStorage
 */
export function initSequences() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      sequences = JSON.parse(stored);
      console.log(`🎬 Loaded ${sequences.length} sequences`);
    }
  } catch (error) {
    console.error('Failed to load sequences:', error);
    sequences = [];
  }
}

/**
 * Save sequences to localStorage
 */
function saveSequencesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sequences));
  } catch (error) {
    console.error('Failed to save sequences:', error);
  }
}

/**
 * Create a new sequence
 */
export function createSequence(name, description = '', steps = [], tags = []) {
  const sequence = {
    id: `seq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name || `Sequence ${sequences.length + 1}`,
    description: description,
    steps: steps,
    loop: false,
    timestamp: Date.now(),
    tags: tags
  };

  sequences.push(sequence);
  saveSequencesToStorage();

  console.log(`🎬 Created sequence: ${sequence.name}`);
  return sequence;
}

/**
 * Get all sequences
 */
export function getAllSequences() {
  return [...sequences];
}

/**
 * Get sequence by ID
 */
export function getSequence(sequenceId) {
  return sequences.find(s => s.id === sequenceId) || null;
}

/**
 * Update sequence
 */
export function updateSequence(sequenceId, updates) {
  const index = sequences.findIndex(s => s.id === sequenceId);
  if (index === -1) return false;

  sequences[index] = { ...sequences[index], ...updates };
  saveSequencesToStorage();

  console.log(`🎬 Updated sequence: ${sequences[index].name}`);
  return true;
}

/**
 * Delete sequence
 */
export function deleteSequence(sequenceId) {
  const index = sequences.findIndex(s => s.id === sequenceId);
  if (index === -1) return false;

  const name = sequences[index].name;
  sequences.splice(index, 1);
  saveSequencesToStorage();

  console.log(`🎬 Deleted sequence: ${name}`);
  return true;
}

/**
 * Add step to sequence
 */
export function addStepToSequence(sequenceId, step) {
  const sequence = getSequence(sequenceId);
  if (!sequence) return false;

  sequence.steps.push(step);
  saveSequencesToStorage();

  console.log(`🎬 Added step to sequence: ${sequence.name}`);
  return true;
}

/**
 * Remove step from sequence
 */
export function removeStepFromSequence(sequenceId, stepIndex) {
  const sequence = getSequence(sequenceId);
  if (!sequence || stepIndex < 0 || stepIndex >= sequence.steps.length) {
    return false;
  }

  sequence.steps.splice(stepIndex, 1);
  saveSequencesToStorage();

  console.log(`🎬 Removed step from sequence: ${sequence.name}`);
  return true;
}

/**
 * Reorder steps in sequence
 */
export function reorderSteps(sequenceId, fromIndex, toIndex) {
  const sequence = getSequence(sequenceId);
  if (!sequence) return false;

  const [step] = sequence.steps.splice(fromIndex, 1);
  sequence.steps.splice(toIndex, 0, step);
  saveSequencesToStorage();

  return true;
}

// ===================================================================
// SEQUENCE PLAYBACK
// ===================================================================

/**
 * Play sequence
 */
export function playSequence(sequenceId, loop = false) {
  const sequence = getSequence(sequenceId);
  if (!sequence) {
    console.error(`Sequence not found: ${sequenceId}`);
    return false;
  }

  if (sequence.steps.length === 0) {
    console.error('Sequence has no steps');
    return false;
  }

  console.log(`🎬 Playing sequence: ${sequence.name} (${sequence.steps.length} steps, loop: ${loop})`);

  currentSequence = sequence;
  currentStepIndex = 0;
  isPlaying = true;
  isPaused = false;
  loopEnabled = loop;

  // Start first step
  executeStep(currentStepIndex);

  return true;
}

/**
 * Pause sequence playback
 */
export function pauseSequence() {
  if (!isPlaying) return false;

  console.log('🎬 Pausing sequence');
  isPaused = true;
  stopMorph();

  if (playbackTimeout) {
    clearTimeout(playbackTimeout);
    playbackTimeout = null;
  }

  return true;
}

/**
 * Resume sequence playback
 */
export function resumeSequence() {
  if (!isPlaying || !isPaused) return false;

  console.log('🎬 Resuming sequence');
  isPaused = false;

  // Continue with current step
  executeStep(currentStepIndex);

  return true;
}

/**
 * Stop sequence playback
 */
export function stopSequence() {
  if (!isPlaying) return false;

  console.log('🎬 Stopping sequence');

  isPlaying = false;
  isPaused = false;
  currentSequence = null;
  currentStepIndex = 0;

  stopMorph();

  if (playbackTimeout) {
    clearTimeout(playbackTimeout);
    playbackTimeout = null;
  }

  return true;
}

/**
 * Execute a single step in the sequence
 */
function executeStep(stepIndex) {
  if (!isPlaying || isPaused) return;
  if (!currentSequence) return;

  const step = currentSequence.steps[stepIndex];
  if (!step) {
    // End of sequence
    if (loopEnabled) {
      console.log('🎬 Sequence loop - restarting');
      currentStepIndex = 0;
      executeStep(0);
    } else {
      console.log('🎬 Sequence complete');
      stopSequence();
    }
    return;
  }

  // Get anchor
  const anchor = getAnchor(step.anchorId);
  if (!anchor) {
    console.error(`Anchor not found: ${step.anchorId}`);
    // Skip to next step
    currentStepIndex++;
    scheduleNextStep(0);
    return;
  }

  console.log(`🎬 Step ${stepIndex + 1}/${currentSequence.steps.length}: Morph to "${anchor.name}" (${step.duration}ms)`);

  // Capture current state
  const currentState = {
    name: 'Sequence Origin',
    mmpaFeatures: JSON.parse(JSON.stringify(state.mmpaFeatures)),
    visualState: {
      particleLayout: state.particleLayout,
      particleCount: state.particleCount,
      idleSpin: state.idleSpin,
      audioReactive: state.audioReactive,
      geometryType: state.geometryType
    }
  };

  // Start morph with completion callback
  startMorph(currentState, anchor, step.duration, step.easing, () => {
    if (!isPlaying || isPaused) return;

    // Move to next step after pause
    currentStepIndex++;
    const pauseDuration = step.pauseAfter || 0;

    if (pauseDuration > 0) {
      console.log(`🎬 Pausing for ${pauseDuration}ms`);
    }

    scheduleNextStep(pauseDuration);
  });
}

/**
 * Schedule next step
 */
function scheduleNextStep(delay) {
  if (!isPlaying || isPaused) return;

  playbackTimeout = setTimeout(() => {
    executeStep(currentStepIndex);
  }, delay);
}

/**
 * Get playback status
 */
export function getPlaybackStatus() {
  return {
    isPlaying,
    isPaused,
    currentSequence: currentSequence ? currentSequence.name : null,
    currentStep: currentStepIndex + 1,
    totalSteps: currentSequence ? currentSequence.steps.length : 0,
    loopEnabled
  };
}

/**
 * Is sequence playing
 */
export function isSequencePlaying() {
  return isPlaying && !isPaused;
}

// ===================================================================
// IMPORT / EXPORT
// ===================================================================

/**
 * Export sequence as JSON
 */
export function exportSequence(sequenceId) {
  const sequence = getSequence(sequenceId);
  if (!sequence) return null;

  return JSON.stringify(sequence, null, 2);
}

/**
 * Import sequence from JSON
 */
export function importSequence(jsonString) {
  try {
    const sequence = JSON.parse(jsonString);

    // Validate structure
    if (!sequence.name || !sequence.steps || !Array.isArray(sequence.steps)) {
      console.error('Invalid sequence format');
      return null;
    }

    // Generate new ID and timestamp
    sequence.id = `seq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sequence.timestamp = Date.now();

    sequences.push(sequence);
    saveSequencesToStorage();

    console.log(`🎬 Imported sequence: ${sequence.name}`);
    return sequence;
  } catch (error) {
    console.error('Failed to import sequence:', error);
    return null;
  }
}

/**
 * Export all sequences
 */
export function exportAllSequences() {
  return JSON.stringify(sequences, null, 2);
}

/**
 * Clear all sequences
 */
export function clearAllSequences() {
  sequences = [];
  saveSequencesToStorage();
  console.log('🎬 Cleared all sequences');
}

console.log("🎬 morphSequencer.js ready");
