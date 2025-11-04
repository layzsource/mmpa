console.log("🎨 mappingLayer.js loaded");

/**
 * MMPA MappingLayer - Phase 2
 *
 * The bridge between empirical measurement (Ratio Engine) and visual manifestation.
 * Translates the six universal features into concrete visual parameters.
 *
 * Philosophy:
 * - The Ratio Engine measures "what is" (empirical data)
 * - The MappingLayer interprets "how to show it" (translation rules)
 * - The Visual Systems render "what appears" (final manifestation)
 *
 * This is the heart of the phenomenological instrument - where abstract
 * measurements become lived, visual experience.
 */

import { state } from './state.js';

/**
 * Main mapping function - called once per frame
 * Takes the live feature data and returns visual parameters
 *
 * @param {Object} features - The mmpaFeatures object from state
 * @returns {Object} Visual parameters to drive the render systems
 */
export function mapFeaturesToVisuals(features) {
  // Early return if features are disabled
  if (!features || !features.enabled) {
    return null;
  }

  const visualParams = {};

  // ===================================================================
  // 1. IDENTITY → COLOR
  // "What is it?" maps to the fundamental hue and brightness
  // ===================================================================

  // Map fundamental frequency (Hz) to hue (0-360)
  // Musical note range: A0 (27.5Hz) to C8 (4186Hz)
  // Using logarithmic mapping for musical perception
  const freq = features.identity.fundamentalFreq;
  const strength = features.identity.strength;

  // NaN Protection
  const safeFreq = (isNaN(freq) || freq <= 0) ? 440 : freq;
  const safeStrength = isNaN(strength) ? 0.85 : strength;

  const minFreq = 20;
  const maxFreq = 20000;
  const normalizedFreq = Math.log(safeFreq / minFreq) / Math.log(maxFreq / minFreq);
  const hue = normalizedFreq * 360; // Full color wheel

  // Map pitch strength to color saturation and brightness
  const saturation = safeStrength; // Strong pitch = saturated color
  const brightness = 0.5 + safeStrength * 0.5; // Strong pitch = brighter

  // Convert HSB to RGB for shader use
  const rgb = hsbToRgb(hue, saturation, brightness);

  visualParams.coreColor = rgb; // [r, g, b] in 0-1 range
  visualParams.colorIntensity = safeStrength;
  visualParams.hue = hue;

  // ===================================================================
  // 2. RELATIONSHIP → HARMONY
  // "How does it relate?" maps to geometric proportions and symmetry
  // ===================================================================

  const consonance = features.relationship.consonance;
  const complexity = features.relationship.complexity;

  // NaN Protection
  const safeConsonance = isNaN(consonance) ? 0.72 : consonance;
  const safeComplexity = isNaN(complexity) ? 3 : complexity;

  // High consonance = more symmetric, ordered geometry
  // High complexity = more intricate patterns
  visualParams.geometricSymmetry = safeConsonance; // 0-1
  visualParams.patternComplexity = safeComplexity / 10; // Normalize 0-10 to 0-1
  visualParams.harmonicOrder = safeConsonance * (1 - (safeComplexity / 20)); // Balanced measure

  // ===================================================================
  // 3. COMPLEXITY → DENSITY
  // "How dense is it?" maps to particle count and detail level
  // ===================================================================

  const centroid = features.complexity.centroid;
  const bandwidth = features.complexity.bandwidth;
  const brightness_spectral = features.complexity.brightness;

  // NaN Protection: Silence or invalid audio can produce NaN values from Meyda
  const safeCentroid = (isNaN(centroid) || centroid <= 0) ? 1500 : centroid;
  const safeBandwidth = isNaN(bandwidth) ? 2000 : bandwidth;
  const safeBrightness = isNaN(brightness_spectral) ? 0.68 : brightness_spectral;

  // Map spectral brightness (0-1) to particle density
  // Higher brightness = more high-frequency content = more particles
  // Keep minimum at 0.8 to ensure particles are always visible
  const particleMultiplier = 0.8 + safeBrightness * 0.2; // 0.8 to 1.0
  visualParams.particleDensity = particleMultiplier;

  // Map bandwidth to particle spread
  const normalizedBandwidth = safeBandwidth / 10000; // 0-1
  visualParams.particleSpread = normalizedBandwidth;

  // Map centroid to spatial distribution (lower = ground, higher = elevated)
  const normalizedCentroid = Math.log(safeCentroid / 20) / Math.log(20000 / 20);
  visualParams.spatialElevation = normalizedCentroid;

  // ===================================================================
  // 4. TRANSFORMATION → MOTION
  // "How fast is it changing?" maps to animation speed and dynamics
  // ===================================================================

  const flux = features.transformation.flux;
  const velocity = features.transformation.velocity;
  const acceleration = features.transformation.acceleration;

  // NaN Protection
  const safeFlux = isNaN(flux) ? 0.42 : flux;
  const safeVelocity = isNaN(velocity) ? 0.15 : velocity;
  const safeAcceleration = isNaN(acceleration) ? 0.03 : acceleration;

  // Map spectral flux to overall animation speed
  visualParams.animationSpeed = 0.5 + safeFlux * 1.5; // 0.5x to 2.0x

  // Map velocity to camera/geometry movement speed
  visualParams.motionVelocity = safeVelocity;

  // Map acceleration to "turbulence" or sudden changes
  visualParams.turbulence = safeAcceleration;
  visualParams.dynamicIntensity = (safeFlux + safeVelocity + safeAcceleration) / 3;

  // ===================================================================
  // 5. ALIGNMENT → STABILITY
  // "How synchronized is it?" maps to form coherence and steadiness
  // ===================================================================

  const coherence = features.alignment.coherence;
  const stability = features.alignment.stability;
  const synchrony = features.alignment.synchrony;

  // NaN Protection
  const safeCoherence = isNaN(coherence) ? 0.78 : coherence;
  const safeStability = isNaN(stability) ? 0.65 : stability;
  const safeSynchrony = isNaN(synchrony) ? 0.82 : synchrony;

  // Map coherence to visual clarity (anti-blur, sharp edges)
  visualParams.visualClarity = safeCoherence;

  // Map stability to how much forms "hold" vs "morph"
  visualParams.formStability = safeStability;

  // Map synchrony to how elements move together
  visualParams.elementSynchrony = safeSynchrony;
  visualParams.overallAlignment = (safeCoherence + safeStability + safeSynchrony) / 3;

  // ===================================================================
  // 6. POTENTIAL → CHAOS
  // "How unpredictable is it?" maps to randomness and variation
  // ===================================================================

  const entropy = features.potential.entropy;
  const unpredictability = features.potential.unpredictability;
  const freedom = features.potential.freedom;

  // NaN Protection
  const safeEntropy = isNaN(entropy) ? 0.28 : entropy;
  const safeUnpredictability = isNaN(unpredictability) ? 0.15 : unpredictability;
  const safeFreedom = isNaN(freedom) ? 0.22 : freedom;

  // Map entropy to particle randomness and noise amplitude
  visualParams.particleRandomness = safeEntropy;
  visualParams.noiseAmplitude = safeEntropy;

  // Map unpredictability to sudden parameter variations
  visualParams.variationRate = safeUnpredictability;

  // Map freedom to the "looseness" of constraints
  visualParams.constraintRelaxation = safeFreedom;
  visualParams.overallChaos = (safeEntropy + safeUnpredictability + safeFreedom) / 3;

  // ===================================================================
  // COMPOSITE PARAMETERS
  // Derived values that combine multiple features for holistic effects
  // ===================================================================

  // Energy: combination of brightness, flux, and complexity
  visualParams.energy = (safeStrength + safeFlux + safeBrightness) / 3;

  // Focus: combination of coherence and low entropy
  visualParams.focus = safeCoherence * (1 - safeEntropy);

  // Excitement: combination of high velocity and high complexity
  visualParams.excitement = (safeVelocity + safeBrightness) / 2;

  // Calm: combination of stability and consonance
  visualParams.calm = (safeStability + safeConsonance) / 2;

  return visualParams;
}

/**
 * Helper: Convert HSB to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-1)
 * @param {number} b - Brightness (0-1)
 * @returns {Array} [r, g, b] in 0-1 range
 */
function hsbToRgb(h, s, b) {
  h = h % 360;
  const c = b * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = b - c;

  let r, g, b_;

  if (h < 60) {
    [r, g, b_] = [c, x, 0];
  } else if (h < 120) {
    [r, g, b_] = [x, c, 0];
  } else if (h < 180) {
    [r, g, b_] = [0, c, x];
  } else if (h < 240) {
    [r, g, b_] = [0, x, c];
  } else if (h < 300) {
    [r, g, b_] = [x, 0, c];
  } else {
    [r, g, b_] = [c, 0, x];
  }

  return [r + m, g + m, b_ + m];
}

/**
 * Helper: Apply easing curve to a value
 * @param {number} x - Input value (0-1)
 * @param {string} curve - 'linear', 'ease-in', 'ease-out', 'ease-in-out'
 * @returns {number} Eased value (0-1)
 */
export function ease(x, curve = 'linear') {
  switch (curve) {
    case 'ease-in':
      return x * x;
    case 'ease-out':
      return 1 - Math.pow(1 - x, 2);
    case 'ease-in-out':
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    default:
      return x;
  }
}

/**
 * Debug function: Log the current mapping output
 */
export function debugMappingLayer() {
  const features = state.mmpaFeatures;
  const visual = mapFeaturesToVisuals(features);

  console.log("🎨 MAPPING LAYER DEBUG");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Features In:", features);
  console.log("Visuals Out:", visual);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

console.log("🎨 MappingLayer ready - The bridge is built");
