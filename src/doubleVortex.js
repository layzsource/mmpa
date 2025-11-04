console.log("🌀 doubleVortex.js loaded");

/**
 * MMPA Double Vortex - The Polarity Meter & Engine of Life
 *
 * Two counter-rotating particle streams that visualize the balance between:
 * - Internal Coherence (self-organization)
 * - External Resonance (environmental harmony)
 *
 * States:
 * - SYNCHRONIZED: Perfect Fifth - The Ringing Bell (coherent life)
 * - CHAOTIC: Wolf Fifth - The Cracked Bell (crisis/annihilation)
 */

import * as THREE from 'three';

// ============================================================================
// VORTEX CONFIGURATION
// ============================================================================

export const VORTEX_CONFIG = {
  // Particle count per vortex stream
  PARTICLES_PER_STREAM: 500,

  // Vortex geometry
  RADIUS: 0.8,              // Base radius of the helix
  HEIGHT: 2.5,              // Vertical span of the vortex
  TURNS: 3,                 // Number of complete rotations
  CENTER_Y: 1.7,            // Vertical center point (aligned with Chestahedron center)

  // Particle appearance
  PARTICLE_SIZE: 0.015,
  PARTICLE_SIZE_VARIANCE: 0.005,

  // Flow speed
  FLOW_SPEED: 0.02,         // Base flow speed (in radians per frame)
  FLOW_SPEED_VARIANCE: 0.01,

  // Colors
  COLOR_STREAM_1: 0x00ffff,  // Cyan - upward flow
  COLOR_STREAM_2: 0xff00ff,  // Magenta - downward flow

  // Synchronization state
  SYNC_THRESHOLD: 0.9,       // How synchronized the streams must be (0-1)
  CHAOS_THRESHOLD: 0.3       // Below this = chaotic state
};

// ============================================================================
// VORTEX STATE
// ============================================================================

let vortexState = {
  synchronization: 0.95,     // Current sync level (1.0 = perfect, 0.0 = chaos)
  rotationSpeed: 1.0,        // Rotation multiplier
  flowDirection: 1.0,        // 1.0 = normal, -1.0 = reversed
  implosionActive: false,    // Is the vortex imploding?
  implosionProgress: 0       // 0-1, progress of implosion
};

// ============================================================================
// PARTICLE SYSTEM
// ============================================================================

/**
 * Create a single vortex stream
 * @param {boolean} clockwise - Direction of rotation
 * @param {number} color - Particle color
 * @returns {object} Vortex stream data
 */
function createVortexStream(clockwise = true, color = 0x00ffff) {
  const particleCount = VORTEX_CONFIG.PARTICLES_PER_STREAM;
  const particles = [];
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const colors = new Float32Array(particleCount * 3);
  const phases = new Float32Array(particleCount); // Phase offset for each particle

  const c = new THREE.Color(color);

  for (let i = 0; i < particleCount; i++) {
    // Initial phase (evenly distributed around the helix)
    const phase = (i / particleCount) * Math.PI * 2 * VORTEX_CONFIG.TURNS;
    phases[i] = phase;

    // Initial position on helix
    const t = i / particleCount; // 0 to 1
    const angle = phase * (clockwise ? 1 : -1);
    const radius = VORTEX_CONFIG.RADIUS;
    const height = (t - 0.5) * VORTEX_CONFIG.HEIGHT + VORTEX_CONFIG.CENTER_Y;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = height;

    // Size with variance
    sizes[i] = VORTEX_CONFIG.PARTICLE_SIZE +
               (Math.random() - 0.5) * VORTEX_CONFIG.PARTICLE_SIZE_VARIANCE;

    // Color
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    // Store particle metadata
    particles.push({
      phase: phase,
      speed: VORTEX_CONFIG.FLOW_SPEED + (Math.random() - 0.5) * VORTEX_CONFIG.FLOW_SPEED_VARIANCE,
      originalRadius: radius
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Particle material
  const material = new THREE.PointsMaterial({
    size: VORTEX_CONFIG.PARTICLE_SIZE,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });

  const points = new THREE.Points(geometry, material);

  return {
    points,
    particles,
    clockwise,
    phases,
    geometry
  };
}

/**
 * Create the complete Double Vortex system
 * @returns {object} Double Vortex group and control data
 */
export function createDoubleVortex() {
  const group = new THREE.Group();

  // Create the two counter-rotating streams
  const stream1 = createVortexStream(true, VORTEX_CONFIG.COLOR_STREAM_1);   // Clockwise
  const stream2 = createVortexStream(false, VORTEX_CONFIG.COLOR_STREAM_2);  // Counter-clockwise

  group.add(stream1.points);
  group.add(stream2.points);

  return {
    group,
    stream1,
    stream2,
    state: vortexState
  };
}

// ============================================================================
// ANIMATION & STATE UPDATES
// ============================================================================

/**
 * Update the Double Vortex animation
 * @param {object} vortexData - The vortex data returned from createDoubleVortex
 * @param {number} deltaTime - Time since last frame (in seconds)
 */
export function updateDoubleVortex(vortexData, deltaTime = 0.016) {
  const { stream1, stream2, state } = vortexData;

  updateVortexStream(stream1, state, deltaTime);
  updateVortexStream(stream2, state, deltaTime);

  // Update implosion if active
  if (state.implosionActive) {
    updateImplosion(vortexData, deltaTime);
  }
}

/**
 * Update a single vortex stream
 */
function updateVortexStream(stream, state, deltaTime) {
  const positions = stream.geometry.attributes.position.array;
  const particleCount = stream.particles.length;
  const direction = stream.clockwise ? 1 : -1;

  for (let i = 0; i < particleCount; i++) {
    const particle = stream.particles[i];

    // Update phase (flow along helix)
    particle.phase += particle.speed * state.rotationSpeed * state.flowDirection * deltaTime * 60;

    // Wrap phase
    const maxPhase = Math.PI * 2 * VORTEX_CONFIG.TURNS;
    if (particle.phase > maxPhase) particle.phase -= maxPhase;
    if (particle.phase < 0) particle.phase += maxPhase;

    // Calculate position on helix
    const t = particle.phase / maxPhase; // 0 to 1
    const angle = particle.phase * direction;

    // Radius modulation based on synchronization
    const syncNoise = (1 - state.synchronization) * 0.3;
    const radiusVariance = (Math.random() - 0.5) * syncNoise;
    const radius = particle.originalRadius * (1 + radiusVariance);

    // Height along Z-axis
    const height = (t - 0.5) * VORTEX_CONFIG.HEIGHT + VORTEX_CONFIG.CENTER_Y;

    // Update position
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = height;
  }

  stream.geometry.attributes.position.needsUpdate = true;
}

/**
 * Update implosion effect (Wolf Fifth / Cracked Bell)
 */
function updateImplosion(vortexData, deltaTime) {
  const { state } = vortexData;

  state.implosionProgress += deltaTime * 2.0; // 0.5 second implosion

  if (state.implosionProgress >= 1.0) {
    // Implosion complete - trigger flash
    state.implosionActive = false;
    state.implosionProgress = 0;
    triggerSonoluminescentFlash(vortexData);
  } else {
    // Contract vortex inward
    const contractionFactor = 1.0 - state.implosionProgress;
    // This will be implemented when we integrate with the scene
  }
}

/**
 * Trigger the sonoluminescent flash (plasma burst)
 */
function triggerSonoluminescentFlash(vortexData) {
  console.log("⚡ SONOLUMINESCENT FLASH - Wolf Fifth Collapse!");
  // This will create a bright flash effect
  // Implementation will be in theoryRenderer.js
}

// ============================================================================
// STATE CONTROL
// ============================================================================

/**
 * Set the synchronization level of the vortex
 * @param {object} vortexData - Vortex data
 * @param {number} syncLevel - Synchronization level (0-1)
 */
export function setVortexSynchronization(vortexData, syncLevel) {
  vortexData.state.synchronization = Math.max(0, Math.min(1, syncLevel));

  // Check if we've entered a crisis state
  if (syncLevel < VORTEX_CONFIG.CHAOS_THRESHOLD && !vortexData.state.implosionActive) {
    console.log("🌀 WARNING: Vortex entering chaotic state");
  }

  // Check if we've achieved perfect synchronization
  if (syncLevel >= VORTEX_CONFIG.SYNC_THRESHOLD) {
    console.log("💎 Perfect Fifth: Vortex synchronized - The Ringing Bell");
  }
}

/**
 * Set the rotation speed multiplier
 * @param {object} vortexData - Vortex data
 * @param {number} speed - Speed multiplier
 */
export function setVortexSpeed(vortexData, speed) {
  vortexData.state.rotationSpeed = speed;
}

/**
 * Trigger vortex implosion (transition to Wolf Fifth)
 * @param {object} vortexData - Vortex data
 */
export function triggerVortexImplosion(vortexData) {
  if (vortexData.state.implosionActive) return;

  console.log("💥 VORTEX IMPLOSION TRIGGERED - Wolf Fifth Initiated");
  vortexData.state.implosionActive = true;
  vortexData.state.implosionProgress = 0;
  vortexData.state.synchronization = 0;
}

/**
 * Reset vortex to stable state
 * @param {object} vortexData - Vortex data
 */
export function resetVortex(vortexData) {
  vortexData.state.synchronization = 0.95;
  vortexData.state.rotationSpeed = 1.0;
  vortexData.state.flowDirection = 1.0;
  vortexData.state.implosionActive = false;
  vortexData.state.implosionProgress = 0;

  console.log("🌀 Vortex reset to stable state");
}

/**
 * Get current vortex archetype based on state
 * @param {object} vortexData - Vortex data
 * @returns {string} Current archetype
 */
export function getVortexArchetype(vortexData) {
  const sync = vortexData.state.synchronization;

  if (vortexData.state.implosionActive) {
    return 'WOLF_FIFTH';
  } else if (sync >= VORTEX_CONFIG.SYNC_THRESHOLD) {
    return 'PERFECT_FIFTH';
  } else if (sync < VORTEX_CONFIG.CHAOS_THRESHOLD) {
    return 'APPROACHING_WOLF_FIFTH';
  } else {
    return 'NEUTRAL_STATE';
  }
}

// ============================================================================
// SYNCHRONIZATION ANALYSIS
// ============================================================================

/**
 * Calculate synchronization from MMPA features
 * Maps the 6 MMPA features to a synchronization value
 * @param {object} mmpaFeatures - Current MMPA feature state
 * @returns {number} Synchronization level (0-1)
 */
export function calculateSynchronizationFromFeatures(mmpaFeatures) {
  // Extract average values for each category
  const identity = averageFeatureValues(mmpaFeatures.identity);
  const relationship = averageFeatureValues(mmpaFeatures.relationship);
  const complexity = averageFeatureValues(mmpaFeatures.complexity);
  const transformation = averageFeatureValues(mmpaFeatures.transformation);
  const alignment = averageFeatureValues(mmpaFeatures.alignment);
  const potential = averageFeatureValues(mmpaFeatures.potential);

  // Perfect Fifth signature:
  // - High Identity & Alignment (coherence)
  // - High Relationship harmony (resonance)
  // - Low Transformation rate (stability)
  // - Low Potential chaos (order)
  // - Moderate Complexity (structure without over-complication)

  const coherenceScore = (identity + alignment) / 2;
  const resonanceScore = relationship;
  const stabilityScore = 1 - transformation; // Inverse - low transformation = high stability
  const orderScore = 1 - potential; // Inverse - low chaos = high order
  const structureScore = complexity;

  // Weighted average (coherence and resonance are most important)
  const synchronization = (
    coherenceScore * 0.3 +
    resonanceScore * 0.3 +
    stabilityScore * 0.2 +
    orderScore * 0.1 +
    structureScore * 0.1
  );

  return Math.max(0, Math.min(1, synchronization));
}

/**
 * Helper: Average all values in a feature category
 */
function averageFeatureValues(featureCategory) {
  const values = Object.values(featureCategory);
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

console.log("🌀 doubleVortex.js ready - The Polarity Meter is initialized");
