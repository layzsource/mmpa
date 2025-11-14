console.log("🌀 anchorMorphing.js loaded");

/**
 * MMPA Anchor Morphing System - Phase 6
 *
 * Enables smooth interpolation between saved phenomenological states.
 * This is where memory becomes fluid, allowing transitions between
 * discrete moments of resonance.
 */

import { state } from './state.js';

// Morphing state
let isMorphing = false;
let morphStartTime = 0;
let morphDuration = 3000; // milliseconds
let morphProgress = 0;
let fromAnchor = null;
let toAnchor = null;
let easingFunction = easeInOutCubic;
let animationFrameId = null;
let onMorphComplete = null;

/**
 * Easing functions
 */
export const EASING = {
  linear: (t) => t,
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2
};

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Start morphing from one anchor to another
 */
export function startMorph(from, to, duration = 3000, easing = 'easeInOutCubic', callback = null) {
  // Stop any existing morph
  stopMorph();

  console.log(`🌀 Starting morph: "${from.name}" → "${to.name}" (${duration}ms)`);

  fromAnchor = from;
  toAnchor = to;
  morphDuration = duration;
  easingFunction = EASING[easing] || EASING.easeInOutCubic;
  onMorphComplete = callback;

  isMorphing = true;
  morphStartTime = performance.now();
  morphProgress = 0;

  // Start animation loop
  morphLoop();
}

/**
 * Stop current morph
 */
export function stopMorph() {
  if (!isMorphing) return;

  console.log('🌀 Morph stopped');

  isMorphing = false;
  morphProgress = 0;
  fromAnchor = null;
  toAnchor = null;

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

/**
 * Check if currently morphing
 */
export function isMorphingActive() {
  return isMorphing;
}

/**
 * Get current morph progress (0-1)
 */
export function getMorphProgress() {
  return morphProgress;
}

// Phase 13.16: Expose getMorphProgress for timeline capture
if (typeof window !== "undefined") {
  window.getMorphProgress = getMorphProgress;
}

/**
 * Get current morph info
 */
export function getMorphInfo() {
  if (!isMorphing) return null;

  return {
    from: fromAnchor ? fromAnchor.name : null,
    to: toAnchor ? toAnchor.name : null,
    progress: morphProgress,
    duration: morphDuration
  };
}

/**
 * Animation loop
 */
function morphLoop() {
  if (!isMorphing) return;

  const currentTime = performance.now();
  const elapsed = currentTime - morphStartTime;

  // Calculate raw progress (0-1)
  const rawProgress = Math.min(elapsed / morphDuration, 1);

  // Apply easing
  morphProgress = easingFunction(rawProgress);

  // Interpolate state
  interpolateAnchors(fromAnchor, toAnchor, morphProgress);

  // Check if complete
  if (rawProgress >= 1) {
    console.log('🌀 Morph complete');
    isMorphing = false;

    if (onMorphComplete) {
      onMorphComplete();
    }

    return;
  }

  // Continue loop
  animationFrameId = requestAnimationFrame(morphLoop);
}

/**
 * Interpolate between two anchors
 */
function interpolateAnchors(from, to, t) {
  // Interpolate MMPA Features
  interpolateMMPAFeatures(from.mmpaFeatures, to.mmpaFeatures, t);

  // Interpolate Visual State
  interpolateVisualState(from.visualState, to.visualState, t);
}

/**
 * Interpolate MMPA features
 */
function interpolateMMPAFeatures(fromFeatures, toFeatures, t) {
  // Identity
  if (fromFeatures.identity && toFeatures.identity) {
    state.mmpaFeatures.identity.pitch = lerp(
      fromFeatures.identity.pitch,
      toFeatures.identity.pitch,
      t
    );
    state.mmpaFeatures.identity.strength = lerp(
      fromFeatures.identity.strength,
      toFeatures.identity.strength,
      t
    );
    state.mmpaFeatures.identity.clarity = lerp(
      fromFeatures.identity.clarity,
      toFeatures.identity.clarity,
      t
    );
  }

  // Relationship
  if (fromFeatures.relationship && toFeatures.relationship) {
    state.mmpaFeatures.relationship.consonance = lerp(
      fromFeatures.relationship.consonance,
      toFeatures.relationship.consonance,
      t
    );
    state.mmpaFeatures.relationship.tension = lerp(
      fromFeatures.relationship.tension,
      toFeatures.relationship.tension,
      t
    );
    state.mmpaFeatures.relationship.complexity = lerp(
      fromFeatures.relationship.complexity,
      toFeatures.relationship.complexity,
      t
    );
  }

  // Complexity
  if (fromFeatures.complexity && toFeatures.complexity) {
    state.mmpaFeatures.complexity.centroid = lerp(
      fromFeatures.complexity.centroid,
      toFeatures.complexity.centroid,
      t
    );
    state.mmpaFeatures.complexity.bandwidth = lerp(
      fromFeatures.complexity.bandwidth,
      toFeatures.complexity.bandwidth,
      t
    );
    state.mmpaFeatures.complexity.brightness = lerp(
      fromFeatures.complexity.brightness,
      toFeatures.complexity.brightness,
      t
    );
  }

  // Transformation
  if (fromFeatures.transformation && toFeatures.transformation) {
    state.mmpaFeatures.transformation.flux = lerp(
      fromFeatures.transformation.flux,
      toFeatures.transformation.flux,
      t
    );
    state.mmpaFeatures.transformation.velocity = lerp(
      fromFeatures.transformation.velocity,
      toFeatures.transformation.velocity,
      t
    );
    state.mmpaFeatures.transformation.acceleration = lerp(
      fromFeatures.transformation.acceleration,
      toFeatures.transformation.acceleration,
      t
    );
  }

  // Alignment
  if (fromFeatures.alignment && toFeatures.alignment) {
    state.mmpaFeatures.alignment.coherence = lerp(
      fromFeatures.alignment.coherence,
      toFeatures.alignment.coherence,
      t
    );
    state.mmpaFeatures.alignment.stability = lerp(
      fromFeatures.alignment.stability,
      toFeatures.alignment.stability,
      t
    );
    state.mmpaFeatures.alignment.synchrony = lerp(
      fromFeatures.alignment.synchrony,
      toFeatures.alignment.synchrony,
      t
    );
  }

  // Potential
  if (fromFeatures.potential && toFeatures.potential) {
    state.mmpaFeatures.potential.entropy = lerp(
      fromFeatures.potential.entropy,
      toFeatures.potential.entropy,
      t
    );
    state.mmpaFeatures.potential.unpredictability = lerp(
      fromFeatures.potential.unpredictability,
      toFeatures.potential.unpredictability,
      t
    );
    state.mmpaFeatures.potential.freedom = lerp(
      fromFeatures.potential.freedom,
      toFeatures.potential.freedom,
      t
    );
  }
}

/**
 * Interpolate visual state
 */
function interpolateVisualState(fromState, toState, t) {
  // Particle count
  const targetCount = Math.round(lerp(fromState.particleCount, toState.particleCount, t));
  if (state.particleCount !== targetCount) {
    state.particleCount = targetCount;
  }

  // Idle spin
  state.idleSpin = lerp(fromState.idleSpin, toState.idleSpin, t);

  // Audio reactive (boolean - transition at midpoint)
  if (t < 0.5) {
    state.audioReactive = fromState.audioReactive;
  } else {
    state.audioReactive = toState.audioReactive;
  }

  // Particle layout (discrete - transition at midpoint)
  if (t < 0.5) {
    state.particleLayout = fromState.particleLayout;
  } else {
    state.particleLayout = toState.particleLayout;
  }

  // Geometry type (discrete - transition at midpoint)
  if (t < 0.5) {
    state.geometryType = fromState.geometryType;
  } else {
    state.geometryType = toState.geometryType;
  }
}

/**
 * Linear interpolation
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Morph to anchor by ID
 */
export function morphToAnchor(anchorId, duration = 3000, easing = 'easeInOutCubic') {
  // Get current state as "from" anchor
  const currentState = {
    name: 'Current State',
    mmpaFeatures: JSON.parse(JSON.stringify(state.mmpaFeatures)),
    visualState: {
      particleLayout: state.particleLayout,
      particleCount: state.particleCount,
      idleSpin: state.idleSpin,
      audioReactive: state.audioReactive,
      geometryType: state.geometryType
    }
  };

  // Import anchor system to get target anchor
  import('./anchorSystem.js').then(({ getAnchor }) => {
    const targetAnchor = getAnchor(anchorId);

    if (!targetAnchor) {
      console.error(`Anchor not found: ${anchorId}`);
      return;
    }

    startMorph(currentState, targetAnchor, duration, easing);
  });
}

// ===================================================================
// AUTO-MORPHING MODE - Generative Exploration
// ===================================================================

// Auto-morph state
let isAutoMorphing = false;
let autoMorphConfig = {
  minDuration: 3000,      // Minimum morph duration (ms)
  maxDuration: 8000,      // Maximum morph duration (ms)
  pauseBetween: 1000,     // Pause between morphs (ms)
  randomEasing: true,     // Random easing each time
  avoidRepeats: true,     // Don't morph to same anchor twice in a row
  anchorPool: []          // Pool of anchor IDs to choose from (empty = all)
};
let lastAutoMorphTarget = null;
let autoMorphTimeout = null;

/**
 * Start auto-morphing mode
 */
export function startAutoMorph(config = {}) {
  if (isAutoMorphing) {
    console.log('🌀 Auto-morph already active');
    return;
  }

  // Merge config
  autoMorphConfig = { ...autoMorphConfig, ...config };

  console.log('🌀 Starting auto-morph mode', autoMorphConfig);
  isAutoMorphing = true;

  // Start first morph
  scheduleNextAutoMorph();
}

/**
 * Stop auto-morphing mode
 */
export function stopAutoMorph() {
  if (!isAutoMorphing) return;

  console.log('🌀 Stopping auto-morph mode');
  isAutoMorphing = false;

  // Clear scheduled morphs
  if (autoMorphTimeout) {
    clearTimeout(autoMorphTimeout);
    autoMorphTimeout = null;
  }

  // Stop current morph
  stopMorph();
}

/**
 * Check if auto-morphing is active
 */
export function isAutoMorphingActive() {
  return isAutoMorphing;
}

/**
 * Get auto-morph configuration
 */
export function getAutoMorphConfig() {
  return { ...autoMorphConfig };
}

/**
 * Update auto-morph configuration
 */
export function updateAutoMorphConfig(config) {
  autoMorphConfig = { ...autoMorphConfig, ...config };
  console.log('🌀 Auto-morph config updated', autoMorphConfig);
}

/**
 * Schedule next auto-morph
 */
function scheduleNextAutoMorph() {
  if (!isAutoMorphing) return;

  // Wait for current morph to complete
  if (isMorphing) {
    // Check again in 500ms
    setTimeout(scheduleNextAutoMorph, 500);
    return;
  }

  // Random pause between morphs
  const pause = autoMorphConfig.pauseBetween;

  autoMorphTimeout = setTimeout(() => {
    executeAutoMorph();
  }, pause);
}

/**
 * Execute a single auto-morph
 */
async function executeAutoMorph() {
  if (!isAutoMorphing) return;

  // Get available anchors
  const { getAllAnchors } = await import('./anchorSystem.js');
  const allAnchors = getAllAnchors();

  // Filter anchor pool
  let availableAnchors = autoMorphConfig.anchorPool.length > 0
    ? allAnchors.filter(a => autoMorphConfig.anchorPool.includes(a.id))
    : allAnchors;

  // Avoid repeats
  if (autoMorphConfig.avoidRepeats && lastAutoMorphTarget) {
    availableAnchors = availableAnchors.filter(a => a.id !== lastAutoMorphTarget);
  }

  if (availableAnchors.length === 0) {
    console.log('🌀 No anchors available for auto-morph');
    stopAutoMorph();
    return;
  }

  // Pick random anchor
  const randomAnchor = availableAnchors[Math.floor(Math.random() * availableAnchors.length)];
  lastAutoMorphTarget = randomAnchor.id;

  // Random duration
  const duration = Math.random() * (autoMorphConfig.maxDuration - autoMorphConfig.minDuration)
    + autoMorphConfig.minDuration;

  // Random or fixed easing
  let easing = 'easeInOutCubic';
  if (autoMorphConfig.randomEasing) {
    const easingOptions = ['linear', 'easeInOutCubic', 'easeInCubic', 'easeOutCubic', 'easeInOutSine'];
    easing = easingOptions[Math.floor(Math.random() * easingOptions.length)];
  }

  console.log(`🌀 Auto-morph → "${randomAnchor.name}" (${Math.round(duration/1000)}s, ${easing})`);

  // Capture current state
  const currentState = {
    name: 'Auto-Morph Origin',
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
  startMorph(currentState, randomAnchor, duration, easing, () => {
    // Schedule next morph
    scheduleNextAutoMorph();
  });
}

console.log("🌀 anchorMorphing.js ready");
