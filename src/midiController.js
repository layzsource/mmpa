console.log("🎹 midiController.js loaded");

/**
 * MMPA MIDI Controller - Phase 11
 *
 * Web MIDI API integration for external controller support.
 * Map MIDI notes and CC to anchors, sequences, and parameters.
 */

import { getAllAnchors } from './anchorSystem.js';
import { getAllSequences, playSequence, stopSequence, pauseSequence, resumeSequence } from './morphSequencer.js';
import { morphToAnchor, startAutoMorph, stopAutoMorph, stopMorph } from './anchorMorphing.js';

// Storage key
const STORAGE_KEY = 'mmpa_midi_mappings';

// MIDI state
let midiAccess = null;
let midiInputs = [];
let midiEnabled = false;

// MIDI learn mode
let midiLearnActive = false;
let midiLearnCallback = null;

// MIDI mappings
let midiMappings = {
  notes: {},    // noteNumber -> { type: 'anchor'|'sequence', id: string }
  cc: {}        // ccNumber -> { type: 'morph_duration'|'auto_morph_speed', param: string }
};

/**
 * Initialize MIDI system
 */
export async function initMIDI() {
  if (!navigator.requestMIDIAccess) {
    console.warn('🎹 Web MIDI API not supported in this browser');
    return false;
  }

  try {
    midiAccess = await navigator.requestMIDIAccess();
    console.log('🎹 MIDI Access granted');

    // Load saved mappings
    loadMappings();

    // Setup inputs
    setupMIDIInputs();

    // Listen for device changes
    midiAccess.addEventListener('statechange', handleMIDIStateChange);

    midiEnabled = true;
    return true;
  } catch (error) {
    console.error('🎹 Failed to get MIDI access:', error);
    return false;
  }
}

/**
 * Setup MIDI inputs
 */
function setupMIDIInputs() {
  if (!midiAccess) return;

  midiInputs = [];
  const inputs = midiAccess.inputs.values();

  for (let input of inputs) {
    console.log(`🎹 MIDI Input: ${input.name}`);
    input.addEventListener('midimessage', handleMIDIMessage);
    midiInputs.push(input);
  }

  console.log(`🎹 ${midiInputs.length} MIDI input(s) connected`);
}

/**
 * Handle MIDI state changes (device connect/disconnect)
 */
function handleMIDIStateChange(event) {
  console.log(`🎹 MIDI State Change: ${event.port.name} - ${event.port.state}`);
  setupMIDIInputs();
}

/**
 * Handle MIDI messages
 */
function handleMIDIMessage(event) {
  const [status, data1, data2] = event.data;
  const command = status & 0xF0;
  const channel = status & 0x0F;

  // MIDI Learn mode - capture any message
  if (midiLearnActive && midiLearnCallback) {
    midiLearnCallback({ command, channel, data1, data2, status });
    midiLearnActive = false;
    midiLearnCallback = null;
    return;
  }

  // Note On (0x90)
  if (command === 0x90 && data2 > 0) {
    handleNoteOn(data1, data2);
  }
  // Note Off (0x80 or Note On with velocity 0)
  else if (command === 0x80 || (command === 0x90 && data2 === 0)) {
    handleNoteOff(data1);
  }
  // Control Change (0xB0)
  else if (command === 0xB0) {
    handleControlChange(data1, data2);
  }
}

/**
 * Handle Note On
 */
function handleNoteOn(note, velocity) {
  const mapping = midiMappings.notes[note];

  if (!mapping) {
    console.log(`🎹 Note On: ${note} (velocity: ${velocity}) - No mapping`);
    return;
  }

  console.log(`🎹 Note On: ${note} → ${mapping.type}: ${mapping.id}`);

  if (mapping.type === 'anchor') {
    morphToAnchor(mapping.id, 2000);
  } else if (mapping.type === 'sequence') {
    const sequence = getAllSequences().find(s => s.id === mapping.id);
    if (sequence) {
      playSequence(mapping.id, sequence.loop);
    }
  } else if (mapping.type === 'auto_morph') {
    startAutoMorph({ minDuration: 3000, maxDuration: 8000, pauseBetween: 1000 });
  } else if (mapping.type === 'stop_all') {
    stopSequence();
    stopMorph();
    stopAutoMorph();
  }
}

/**
 * Handle Note Off
 */
function handleNoteOff(note) {
  // Currently not used, but could be used for momentary actions
  console.log(`🎹 Note Off: ${note}`);
}

/**
 * Handle Control Change (CC)
 */
function handleControlChange(cc, value) {
  const mapping = midiMappings.cc[cc];

  if (!mapping) {
    console.log(`🎹 CC: ${cc} = ${value} - No mapping`);
    return;
  }

  console.log(`🎹 CC: ${cc} → ${mapping.type} = ${value}`);

  // Normalize CC value (0-127) to useful ranges
  const normalized = value / 127;

  if (mapping.type === 'morph_duration') {
    // Map to 1000ms - 10000ms
    const duration = 1000 + (normalized * 9000);
    // Store for next morph
    window._midiMorphDuration = duration;
  } else if (mapping.type === 'auto_morph_speed') {
    // Map to min/max duration ranges
    const minDuration = 1000 + (normalized * 5000); // 1s - 6s
    const maxDuration = minDuration + 3000; // +3s range
    // Update auto-morph config if active
    if (typeof updateAutoMorphConfig !== 'undefined') {
      updateAutoMorphConfig({ minDuration, maxDuration });
    }
  }
}

/**
 * Start MIDI learn mode
 */
export function startMIDILearn(callback) {
  console.log('🎹 MIDI Learn mode activated - press any MIDI control');
  midiLearnActive = true;
  midiLearnCallback = callback;
}

/**
 * Cancel MIDI learn mode
 */
export function cancelMIDILearn() {
  console.log('🎹 MIDI Learn mode cancelled');
  midiLearnActive = false;
  midiLearnCallback = null;
}

/**
 * Map MIDI note to anchor
 */
export function mapNoteToAnchor(note, anchorId) {
  midiMappings.notes[note] = { type: 'anchor', id: anchorId };
  saveMappings();
  console.log(`🎹 Mapped note ${note} → anchor ${anchorId}`);
}

/**
 * Map MIDI note to sequence
 */
export function mapNoteToSequence(note, sequenceId) {
  midiMappings.notes[note] = { type: 'sequence', id: sequenceId };
  saveMappings();
  console.log(`🎹 Mapped note ${note} → sequence ${sequenceId}`);
}

/**
 * Map MIDI note to action
 */
export function mapNoteToAction(note, actionType) {
  midiMappings.notes[note] = { type: actionType };
  saveMappings();
  console.log(`🎹 Mapped note ${note} → action ${actionType}`);
}

/**
 * Map MIDI CC to parameter
 */
export function mapCCToParameter(cc, paramType) {
  midiMappings.cc[cc] = { type: paramType };
  saveMappings();
  console.log(`🎹 Mapped CC ${cc} → parameter ${paramType}`);
}

/**
 * Remove MIDI mapping
 */
export function removeMapping(type, value) {
  if (type === 'note') {
    delete midiMappings.notes[value];
  } else if (type === 'cc') {
    delete midiMappings.cc[value];
  }
  saveMappings();
  console.log(`🎹 Removed ${type} mapping: ${value}`);
}

/**
 * Get all mappings
 */
export function getAllMappings() {
  return {
    notes: { ...midiMappings.notes },
    cc: { ...midiMappings.cc }
  };
}

/**
 * Clear all mappings
 */
export function clearAllMappings() {
  midiMappings = { notes: {}, cc: {} };
  saveMappings();
  console.log('🎹 Cleared all MIDI mappings');
}

/**
 * Save mappings to localStorage
 */
function saveMappings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(midiMappings));
  } catch (error) {
    console.error('🎹 Failed to save MIDI mappings:', error);
  }
}

/**
 * Load mappings from localStorage
 */
function loadMappings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      midiMappings = JSON.parse(stored);
      console.log(`🎹 Loaded ${Object.keys(midiMappings.notes).length} note mappings, ${Object.keys(midiMappings.cc).length} CC mappings`);
    }
  } catch (error) {
    console.error('🎹 Failed to load MIDI mappings:', error);
    midiMappings = { notes: {}, cc: {} };
  }
}

/**
 * Check if MIDI is enabled
 */
export function isMIDIEnabled() {
  return midiEnabled;
}

/**
 * Get connected MIDI devices
 */
export function getMIDIDevices() {
  if (!midiAccess) return [];

  const devices = [];
  const inputs = midiAccess.inputs.values();

  for (let input of inputs) {
    devices.push({
      id: input.id,
      name: input.name,
      manufacturer: input.manufacturer,
      state: input.state
    });
  }

  return devices;
}

/**
 * Export mappings as JSON
 */
export function exportMappings() {
  return JSON.stringify(midiMappings, null, 2);
}

/**
 * Import mappings from JSON
 */
export function importMappings(jsonString) {
  try {
    const imported = JSON.parse(jsonString);
    midiMappings = imported;
    saveMappings();
    console.log('🎹 Imported MIDI mappings');
    return true;
  } catch (error) {
    console.error('🎹 Failed to import MIDI mappings:', error);
    return false;
  }
}

console.log("🎹 midiController.js ready");
