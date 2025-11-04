console.log("🔍 archetypeRecognizer.js loaded");

/**
 * MMPA Archetype Recognizer (φ-Based Implementation)
 *
 * Analyzes the current MMPA feature state to identify which archetype
 * the system is embodying using the Golden Ratio (φ) as the coherence threshold.
 *
 * Based on Dan Winter's Phase Conjugation theory, φ (1.618...) represents
 * the universal non-arbitrary standard for system coherence.
 *
 * Archetypes:
 * - PERFECT_FIFTH: The Ringing Bell (coherent, stable, harmonious) - stability ≥ φ
 * - WOLF_FIFTH: The Cracked Bell (chaotic, imploding, crisis) - active but stability < φ
 * - NEUTRAL_STATE: The Aether (resting, sparse, quiet) - flux < activity floor
 */

import { GLOBAL_CONSTANTS } from './state.js';

// ============================================================================
// ARCHETYPE DEFINITIONS
// ============================================================================

export const ARCHETYPES = {
  PERFECT_FIFTH: 'PERFECT_FIFTH',
  WOLF_FIFTH: 'WOLF_FIFTH',
  NEUTRAL_STATE: 'NEUTRAL_STATE'
};

// ============================================================================
// CONFIGURATION
// ============================================================================

const PHI_THRESHOLD = GLOBAL_CONSTANTS.GOLDEN_RATIO_PHI;  // 1.618... - The coherence threshold
const ACTIVITY_FLOOR = GLOBAL_CONSTANTS.ACTIVITY_FLOOR;    // 0.5 - Minimum flux for active evaluation

// Recognition configuration
const RECOGNITION_CONFIG = {
  HISTORY_LENGTH: 60,             // Keep last 60 recognitions (1 second at 60fps)
  TRANSITION_COOLDOWN: 500,       // Milliseconds before allowing another transition

  // Calibration factors (tunable during testing)
  STABILITY_SCALE: 2.3,           // Calibrated to reach φ threshold with typical audio levels
  FLUX_NORMALIZATION: 1.0,        // Normalization factor for flux metric

  // Hysteresis margins (prevent flip-flopping between states)
  HYSTERESIS_PERCENT: 0.05        // 5% margin for threshold crossings
};

// ============================================================================
// RECOGNITION STATE
// ============================================================================

let recognitionState = {
  currentArchetype: ARCHETYPES.NEUTRAL_STATE,
  previousArchetype: null,
  confidence: 0,
  lastStabilityMetric: 0,
  lastFluxMetric: 0,
  transitionInProgress: false,
  lastTransitionTime: 0,
  history: [],
  callbacks: {
    onArchetypeChange: [],
    onPerfectFifthEnter: [],
    onWolfFifthEnter: [],
    onNeutralStateEnter: []
  }
};

// ============================================================================
// METRIC CALCULATION
// ============================================================================

/**
 * Calculates stability and flux metrics from MMPA features
 *
 * Stability: Measures internal order and predictability
 * - Derived from relationship.harmony (consonance) and identity.pitch (frequency)
 * - Higher values indicate more coherent, phase-conjugate states
 *
 * Flux: Measures system energy and disorder
 * - Derived from transformation.rate (flux) and potential.chaos (entropy)
 * - Higher values indicate more active/chaotic states
 *
 * @param {object} mmpaFeatures - The MMPA feature object
 * @returns {{stabilityMetric: number, fluxMetric: number}}
 */
// Debug logging state
let debugLogCounter = 0;

function calculateMetrics(mmpaFeatures) {
  // Extract feature values with safe defaults (using actual MMPA feature names)
  const consonance = mmpaFeatures.relationship?.consonance || 0;
  // Use pitch if available (from anchors), otherwise use strength (pitch clarity)
  const pitch = mmpaFeatures.identity?.pitch || mmpaFeatures.identity?.strength || 0;
  const strength = mmpaFeatures.identity?.strength || 0;  // RMS amplitude (signal presence)
  const flux = mmpaFeatures.transformation?.flux || 0;
  const entropy = mmpaFeatures.potential?.entropy || 0;

  // Debug logging every 2 seconds (120 frames at 60fps)
  debugLogCounter++;
  if (debugLogCounter % 120 === 0) {
    console.log('🔍 Archetype recognizer input:', {
      consonance,
      pitch,
      strength,
      flux,
      entropy
    });
  }

  // --- STABILITY Metric Calculation ---
  // Derived from the system's internal order and predictability
  const stabilityScore =
    (consonance * 0.7) +   // Dominant weight: Harmony/Order/Consonance
    (pitch * 0.3);         // Secondary weight: Cyclic/Structural Predictability

  // Scale to ensure optimal coherent state aligns with or exceeds PHI_THRESHOLD (~1.618)
  const stabilityMetric = stabilityScore * RECOGNITION_CONFIG.STABILITY_SCALE;

  // --- FLUX Metric Calculation ---
  // Derived from the system's energy and disorder/unpredictability
  const fluxScore =
    (flux * 0.6) +         // Dominant weight: Rate of change/Energy
    (entropy * 0.4);       // Secondary weight: Disorder/Chaos

  // Normalize to 0-1.0 range
  const fluxMetric = Math.min(fluxScore * RECOGNITION_CONFIG.FLUX_NORMALIZATION, 1.0);

  return { stabilityMetric, fluxMetric, strength };
}

/**
 * Export metrics for HUD display and logging
 */
export function getMetrics(mmpaFeatures) {
  return calculateMetrics(mmpaFeatures);
}

// ============================================================================
// ARCHETYPE EVALUATION (φ-Based Logic)
// ============================================================================

/**
 * Evaluates the archetypal state using φ-based thresholds with hysteresis
 *
 * @param {number} stabilityMetric - Coherence measure (0–2+)
 * @param {number} fluxMetric - System energy/activity (0–1)
 * @param {number} strength - RMS signal amplitude (0–1)
 * @param {string} currentArchetype - Current state (for hysteresis)
 * @returns {string} Archetype name
 */
function evaluateArchetype(stabilityMetric, fluxMetric, strength, currentArchetype) {
  // REVISED LOGIC v3 (Oct 30, 2025):
  // - Use STRENGTH (RMS amplitude) to detect presence, not flux
  // - Add 5% hysteresis to prevent flip-flopping
  // - Strict validation: PERFECT_FIFTH requires stability ≥ φ

  // Calculate hysteresis-adjusted thresholds
  const hysteresis = RECOGNITION_CONFIG.HYSTERESIS_PERCENT;

  // If already in PERFECT_FIFTH, require stability to drop further before exiting
  const phiThreshold = currentArchetype === ARCHETYPES.PERFECT_FIFTH
    ? PHI_THRESHOLD * (1 - hysteresis)  // Exit: 1.537 (more lenient to stay in)
    : PHI_THRESHOLD;                     // Enter: 1.618 (standard threshold)

  // If already in WOLF_FIFTH, require flux to drop further before exiting
  const fluxThreshold = currentArchetype === ARCHETYPES.WOLF_FIFTH
    ? 0.03 * (1 - hysteresis)  // Exit: 0.0285 (more lenient to stay in)
    : 0.03;                     // Enter: 0.03 (standard threshold)

  // 1. High Coherence → Perfect Fifth (Ringing Bell)
  // A sustained, coherent tone (pure sine, ringing bell, harmonic music)
  // STRICT: Requires stability ≥ φ threshold AND audible signal (strength ≥ 0.02)
  if (stabilityMetric >= phiThreshold && strength >= 0.02) {
    return ARCHETYPES.PERFECT_FIFTH;
  }

  // 2. Very Quiet Field → Neutral (Aether)
  // True silence or near-silence (strength < 0.01)
  if (strength < 0.01) {
    return ARCHETYPES.NEUTRAL_STATE;
  }

  // 3. Active Chaos → Wolf Fifth (Cracked Bell)
  // High activity/change but low coherence (noise, dissonance, transients)
  // STRICT: Requires flux ≥ threshold AND stability < φ (to prevent overlap with Perfect Fifth)
  if (fluxMetric >= fluxThreshold && stabilityMetric < PHI_THRESHOLD) {
    return ARCHETYPES.WOLF_FIFTH;
  }

  // 4. Moderate/Transitional States → Neutral
  // Some signal present but neither coherent nor chaotic
  return ARCHETYPES.NEUTRAL_STATE;
}

/**
 * Main recognition function (maintains API compatibility)
 *
 * @param {object} mmpaFeatures - Current MMPA feature state
 * @returns {object} Recognition result
 */
export function recognizeArchetype(mmpaFeatures) {
  // Calculate metrics
  const { stabilityMetric, fluxMetric, strength } = calculateMetrics(mmpaFeatures);

  // Store for external access
  recognitionState.lastStabilityMetric = stabilityMetric;
  recognitionState.lastFluxMetric = fluxMetric;

  // Evaluate archetype (with hysteresis based on current state)
  const detectedArchetype = evaluateArchetype(
    stabilityMetric,
    fluxMetric,
    strength,
    recognitionState.currentArchetype
  );

  // Calculate confidence (proximity to φ for Perfect Fifth, distance for others)
  let confidence = 0;
  if (detectedArchetype === ARCHETYPES.PERFECT_FIFTH) {
    // Confidence increases as we approach or exceed φ
    confidence = Math.min(stabilityMetric / PHI_THRESHOLD, 1.0);
  } else if (detectedArchetype === ARCHETYPES.WOLF_FIFTH) {
    // Confidence increases with flux but decreases with stability
    confidence = fluxMetric * (1.0 - Math.min(stabilityMetric / PHI_THRESHOLD, 1.0));
  } else {
    // Neutral: confidence based on how quiet the system is
    // Normalized to realistic flux range (0.01-0.1)
    confidence = Math.max(0, 1.0 - (fluxMetric / 0.1));
  }

  recognitionState.confidence = confidence;

  // Update history
  recognitionState.history.push({
    archetype: detectedArchetype,
    confidence: confidence,
    stabilityMetric: stabilityMetric,
    fluxMetric: fluxMetric,
    timestamp: performance.now()
  });

  // Trim history
  if (recognitionState.history.length > RECOGNITION_CONFIG.HISTORY_LENGTH) {
    recognitionState.history.shift();
  }

  // Check for archetype transition (with cooldown to prevent flicker)
  const now = performance.now();
  const timeSinceLastTransition = now - recognitionState.lastTransitionTime;

  if (detectedArchetype !== recognitionState.currentArchetype &&
      timeSinceLastTransition > RECOGNITION_CONFIG.TRANSITION_COOLDOWN) {
    handleArchetypeTransition(detectedArchetype, confidence, stabilityMetric, fluxMetric);
  }

  return {
    archetype: recognitionState.currentArchetype,
    confidence: recognitionState.confidence,
    stabilityMetric: stabilityMetric,
    fluxMetric: fluxMetric,
    transitionInProgress: recognitionState.transitionInProgress
  };
}

// ============================================================================
// TRANSITION HANDLING
// ============================================================================

/**
 * Handle transition to a new archetype
 */
function handleArchetypeTransition(newArchetype, confidence, stabilityMetric, fluxMetric) {
  const oldArchetype = recognitionState.currentArchetype;

  console.log(
    `🔄 Archetype transition: ${oldArchetype} → ${newArchetype} ` +
    `(stability: ${stabilityMetric.toFixed(3)}, flux: ${fluxMetric.toFixed(3)}, ` +
    `confidence: ${(confidence * 100).toFixed(1)}%)`
  );

  recognitionState.previousArchetype = oldArchetype;
  recognitionState.currentArchetype = newArchetype;
  recognitionState.transitionInProgress = true;
  recognitionState.lastTransitionTime = performance.now();

  // Trigger callbacks
  triggerCallbacks('onArchetypeChange', {
    from: oldArchetype,
    to: newArchetype,
    confidence,
    stabilityMetric,
    fluxMetric
  });

  // Trigger specific archetype callbacks
  if (newArchetype === ARCHETYPES.PERFECT_FIFTH) {
    console.log(`💎 ✨ PERFECT FIFTH ACHIEVED - The Ringing Bell ✨ (φ-coherence: ${stabilityMetric.toFixed(3)})`);
    triggerCallbacks('onPerfectFifthEnter', { confidence, stabilityMetric, fluxMetric });
  } else if (newArchetype === ARCHETYPES.WOLF_FIFTH) {
    console.log(`💥 ⚡ WOLF FIFTH DETECTED - The Cracked Bell ⚡ (sub-φ crisis: ${stabilityMetric.toFixed(3)})`);
    triggerCallbacks('onWolfFifthEnter', { confidence, stabilityMetric, fluxMetric });
  } else if (newArchetype === ARCHETYPES.NEUTRAL_STATE) {
    console.log(`🌫️ Neutral State - The Aether (quiet field: flux ${fluxMetric.toFixed(3)})`);
    triggerCallbacks('onNeutralStateEnter', { confidence, stabilityMetric, fluxMetric });
  }

  // Transition completes after a delay
  setTimeout(() => {
    recognitionState.transitionInProgress = false;
  }, RECOGNITION_CONFIG.TRANSITION_COOLDOWN);
}

// ============================================================================
// EVENT SYSTEM
// ============================================================================

/**
 * Register a callback for archetype events
 * @param {string} event - Event name
 * @param {function} callback - Callback function
 */
export function onArchetypeEvent(event, callback) {
  if (recognitionState.callbacks[event]) {
    recognitionState.callbacks[event].push(callback);
  }
}

/**
 * Trigger all callbacks for an event
 */
function triggerCallbacks(event, data) {
  if (recognitionState.callbacks[event]) {
    recognitionState.callbacks[event].forEach(callback => callback(data));
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the current archetype
 */
export function getCurrentArchetype() {
  return recognitionState.currentArchetype;
}

/**
 * Get the current confidence level
 */
export function getConfidence() {
  return recognitionState.confidence;
}

/**
 * Get the current stability metric (φ-coherence)
 */
export function getStabilityMetric() {
  return recognitionState.lastStabilityMetric;
}

/**
 * Get the current flux metric (system activity)
 */
export function getFluxMetric() {
  return recognitionState.lastFluxMetric;
}

/**
 * Check if a specific archetype is active
 */
export function isArchetype(archetype) {
  return recognitionState.currentArchetype === archetype;
}

/**
 * Get recognition history
 */
export function getRecognitionHistory() {
  return [...recognitionState.history];
}

/**
 * Get archetype stability (how consistently the same archetype has been detected)
 */
export function getArchetypeStability(frames = 30) {
  if (recognitionState.history.length < frames) {
    return 0;
  }

  const recent = recognitionState.history.slice(-frames);
  const currentArchetype = recognitionState.currentArchetype;
  const matches = recent.filter(r => r.archetype === currentArchetype).length;

  return matches / frames;
}

/**
 * Reset recognition state
 */
export function resetRecognition() {
  recognitionState.currentArchetype = ARCHETYPES.NEUTRAL_STATE;
  recognitionState.previousArchetype = null;
  recognitionState.confidence = 0;
  recognitionState.lastStabilityMetric = 0;
  recognitionState.lastFluxMetric = 0;
  recognitionState.transitionInProgress = false;
  recognitionState.history = [];

  console.log("🔍 Archetype recognition reset");
}

/**
 * Update calibration factors (for tuning during testing)
 */
export function updateCalibration(stabilityScale, fluxNormalization) {
  if (stabilityScale !== undefined) {
    RECOGNITION_CONFIG.STABILITY_SCALE = stabilityScale;
    console.log(`🔧 Stability scale updated to ${stabilityScale}`);
  }
  if (fluxNormalization !== undefined) {
    RECOGNITION_CONFIG.FLUX_NORMALIZATION = fluxNormalization;
    console.log(`🔧 Flux normalization updated to ${fluxNormalization}`);
  }
}

console.log("🔍 archetypeRecognizer.js ready - φ-Based Pattern Recognition (φ = " + PHI_THRESHOLD.toFixed(5) + ")");
