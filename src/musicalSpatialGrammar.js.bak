// Musical Spatial Grammar System
// Maps music theory (intervals, archetypes, harmony) to 3D spatial positions
// Creates learnable visual language where geometric relationships = harmonic relationships

console.log("🎼 musicalSpatialGrammar.js loaded");

import * as THREE from 'three';
import { getCurrentArchetype, getConfidence } from './archetypeRecognizer.js';

// ===== SPATIAL GRAMMAR CONSTANTS =====

// CHROMATIC CLOCK: 12 semitones mapped to clock positions (30° apart)
// C=0° (12 o'clock), C#=30° (1 o'clock), D=60° (2 o'clock), etc.
const CHROMATIC_CLOCK_ANGLES = [
  0,     // C  = 12 o'clock (0°, north)
  30,    // C# = 1 o'clock
  60,    // D  = 2 o'clock
  90,    // D# = 3 o'clock (east)
  120,   // E  = 4 o'clock
  150,   // F  = 5 o'clock
  180,   // F# = 6 o'clock (south)
  210,   // G  = 7 o'clock
  240,   // G# = 8 o'clock
  270,   // A  = 9 o'clock (west)
  300,   // A# = 10 o'clock
  330    // B  = 11 o'clock
].map(deg => (deg * Math.PI) / 180); // Convert to radians

// Interval names and their semitone distances
const INTERVALS = {
  UNISON: 0,
  MINOR_SECOND: 1,
  MAJOR_SECOND: 2,
  MINOR_THIRD: 3,
  MAJOR_THIRD: 4,
  PERFECT_FOURTH: 5,
  TRITONE: 6,
  PERFECT_FIFTH: 7,
  MINOR_SIXTH: 8,
  MAJOR_SIXTH: 9,
  MINOR_SEVENTH: 10,
  MAJOR_SEVENTH: 11,
  OCTAVE: 12
};

// Note names for debugging
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// ===== SPATIAL GRAMMAR STATE =====

class MusicalSpatialGrammar {
  constructor() {
    this.enabled = false; // Start DISABLED - keep original torus behavior
    this.autoEnableThreshold = 0.5; // Auto-enable when confidence exceeds this

    // Current harmonic state
    this.currentArchetype = 'NEUTRAL_STATE';
    this.currentConfidence = 0;
    this.currentTonic = 0; // Root note (0-11)

    // Spatial arrangement mode
    this.spatialMode = 'chromatic_clock'; // Chromatic clock: C at 12 o'clock, etc.

    // Particle density per interval (how many particles at each position)
    this.intervalDensities = new Array(12).fill(0);

    // Geometry deformation parameters
    this.harmonicTension = 0; // 0 = perfect harmony, 1 = maximum dissonance
    this.geometryScale = 1.0;
    this.geometryDistortion = 0;

    // Smooth transitions
    this.transitionSpeed = 0.05;
    this.targetDensities = new Array(12).fill(0);

    console.log("🎼 Musical Spatial Grammar initialized (Chromatic Clock, ENABLED by default)");
  }

  /**
   * Enable spatial grammar (makes it take control of visual arrangement)
   */
  enable() {
    this.enabled = true;
    console.log("🎼 ✅ Chromatic Clock ENABLED - particles arrange by detected intervals");
  }

  /**
   * Disable spatial grammar (return to manual/audio-reactive modes)
   */
  disable() {
    this.enabled = false;
    console.log("🎼 ❌ Chromatic Clock DISABLED - returning to MMPA symmetry mode");
  }

  /**
   * Update spatial grammar from archetype analysis
   * Call this every frame from geometry.js
   */
  update() {
    try {
      // Get current harmonic analysis
      const archetype = getCurrentArchetype();
      const confidence = getConfidence();

      // Auto-enable DISABLED - user wants manual control only
      // Keep original torus behavior with organic movement
      // User can manually enable with: enableSpatialGrammar()

      // Always update archetype state (even when disabled)
      if (confidence < 0.2) {
        this.currentArchetype = 'NEUTRAL_STATE';
        this.currentConfidence = 0;
      } else {
        this.currentArchetype = archetype;
        this.currentConfidence = confidence;
      }

      if (!this.enabled) return;

      // Calculate spatial arrangement based on archetype
      this.updateSpatialArrangement();

      // Smooth transition of particle densities
      for (let i = 0; i < 12; i++) {
        this.intervalDensities[i] += (this.targetDensities[i] - this.intervalDensities[i]) * this.transitionSpeed;
      }

    } catch (error) {
      console.warn("⚠️ Spatial grammar update error:", error);
    }
  }

  /**
   * Calculate spatial arrangement based on detected archetype
   * Maps harmonic intervals to chromatic clock positions (congregation points)
   */
  updateSpatialArrangement() {
    // Reset target densities
    this.targetDensities.fill(0);

    switch (this.currentArchetype) {
      case 'PERFECT_FIFTH':
        // Perfect Fifth: C + G (0 + 7 semitones)
        // Chromatic Clock: C=0° (12 o'clock), G=210° (7 o'clock)
        // Particles congregate at these two positions
        this.targetDensities[0] = 1.0;  // C (tonic, 12 o'clock) - strongest
        this.targetDensities[7] = 0.9;  // G (perfect fifth, 7 o'clock) - second strongest
        this.targetDensities[5] = 0.3;  // F (perfect fourth, 5 o'clock) - harmonic support
        this.targetDensities[4] = 0.2;  // E (major third, 4 o'clock) - color tone

        this.harmonicTension = 0.1; // Very low tension (consonant)
        this.geometryScale = 1.0 + (this.currentConfidence * 0.3); // Expand with confidence
        this.geometryDistortion = 0;
        break;

      case 'WOLF_FIFTH':
        // Wolf Fifth: C + F# (0 + 6 semitones = tritone/diminished fifth)
        // Chromatic Clock: C=0° (12 o'clock), F#=180° (6 o'clock)
        // Mistuned fifth creates tension - particles congregate but with distortion
        this.targetDensities[0] = 1.0;  // C (tonic, 12 o'clock)
        this.targetDensities[6] = 0.8;  // F# (tritone/wolf fifth, 6 o'clock) - WRONG fifth!
        this.targetDensities[7] = 0.4;  // G (true fifth) - ghost presence shows "should be here"
        this.targetDensities[3] = 0.3;  // D# (minor third) - dissonant color

        this.harmonicTension = 0.7; // High tension (dissonant)
        this.geometryScale = 0.9 + (this.currentConfidence * 0.2); // Slight compression
        this.geometryDistortion = this.currentConfidence * 0.5; // Warp the clock (shows mistuning)
        break;

      case 'NEUTRAL_STATE':
      default:
        // No clear harmonic center detected
        // Uniform distribution around the clock - no congregation
        this.targetDensities.fill(1.0 / 12);
        this.harmonicTension = 0.5;
        this.geometryScale = 1.0;
        this.geometryDistortion = 0;
        break;
    }
  }

  /**
   * Get spatial position for a particle based on its index and current grammar
   * Places particles ON TORUS SURFACE at chromatic clock positions (congregation)
   * @param {number} particleIndex - Index of particle
   * @param {number} totalParticles - Total number of particles
   * @returns {object} - { x, y, z, radius, angle, intensity, interval }
   */
  getParticlePosition(particleIndex, totalParticles) {
    if (!this.enabled) return null; // Not active, don't override

    // Determine which chromatic interval this particle belongs to based on density distribution
    // Particles congregate at intervals with higher density

    // Calculate total density to normalize
    const totalDensity = this.intervalDensities.reduce((sum, d) => sum + d, 0);

    let targetInterval = 0;

    if (totalDensity === 0) {
      // Fallback: uniform distribution if no densities set
      targetInterval = Math.floor((particleIndex / totalParticles) * 12) % 12;
    } else {
      // Find which interval this particle maps to using cumulative density distribution
      const normalizedIndex = particleIndex / totalParticles;
      let cumulativeDensity = 0;

      for (let i = 0; i < 12; i++) {
        cumulativeDensity += this.intervalDensities[i] / totalDensity;
        if (normalizedIndex < cumulativeDensity) {
          targetInterval = i;
          break;
        }
      }
    }

    // Get angle for this interval from CHROMATIC CLOCK
    // C=0° (north), C#=30°, D=60°, ..., B=330°
    // This is θ (theta) in torus parametric equations - position around major circle
    let theta = CHROMATIC_CLOCK_ANGLES[targetInterval];

    // Apply distortion for wolf fifth tension (warps the clock)
    if (this.geometryDistortion > 0) {
      // Warp angles near the mistuned interval
      const distortionAmount = Math.sin(theta * 2) * this.geometryDistortion * 0.3;
      theta += distortionAmount;
    }

    // TORUS PARAMETRIC POSITIONING
    // Major radius R (distance from center to tube center)
    const R = 3.0 * this.geometryScale;

    // Minor radius r (tube thickness) - varies with density (congregation makes tube thicker)
    const baseTubeRadius = 0.8;
    const densityBoost = this.intervalDensities[targetInterval] * 0.6; // Thicker tube at congregation points
    const r = baseTubeRadius + densityBoost;

    // φ (phi) - angle around the minor circle (tube cross-section)
    // Distribute particles around the tube at this chromatic position
    const particlePhase = (particleIndex * 0.1) % (Math.PI * 2);
    const phi = particlePhase; // Each particle at different position around tube

    // Add slight jitter for organic feel
    const thetaJitter = Math.cos(particlePhase * 1.3) * 0.05;
    const phiJitter = Math.sin(particlePhase * 1.7) * 0.1;

    // Torus parametric equations:
    // x = (R + r*cos(φ)) * cos(θ)
    // y = (R + r*cos(φ)) * sin(θ)
    // z = r * sin(φ)
    const x = (R + r * Math.cos(phi + phiJitter)) * Math.cos(theta + thetaJitter);
    const y = (R + r * Math.cos(phi + phiJitter)) * Math.sin(theta + thetaJitter);

    // Z represents both tube position AND harmonic tension
    const baseTubeZ = r * Math.sin(phi + phiJitter);
    const tensionWarp = Math.sin(theta * 3) * this.harmonicTension * 0.5; // Subtle tension warping
    const z = baseTubeZ + tensionWarp;

    return {
      x, y, z,
      radius: R, // Major radius for reference
      angle: theta + thetaJitter,
      intensity: this.intervalDensities[targetInterval],
      interval: targetInterval,
      note: NOTE_NAMES[targetInterval] // For debugging
    };
  }

  /**
   * Get geometry morph influences based on current harmonic state
   * Returns morph target weights for sphere, cube, pyramid, torus
   * CHROMATIC CLOCK: Base geometry is TORUS (represents the clock face)
   * @returns {array} - [sphere, cube, pyramid, torus] weights (0-1)
   */
  getGeometryMorphWeights() {
    if (!this.enabled) return null;

    // Map harmonic concepts to geometric shapes:
    // Torus = BASE (chromatic clock - the ring/donut shape)
    // Cube = stability, consonance (perfect intervals lock into cube)
    // Pyramid = tension, dissonance (wolf fifth warps toward pyramid)
    // Sphere = neutral fallback

    const weights = [0, 0, 0, 0];

    switch (this.currentArchetype) {
      case 'PERFECT_FIFTH':
        // Perfect harmony → torus stays dominant, cube adds subtle stability
        // TORUS IS KING: Keep it at 0.85+ to preserve donut shape
        weights[3] = 0.85 + (0.1 * this.currentConfidence); // Torus (chromatic clock base)
        weights[1] = 0.15 * this.currentConfidence; // Cube (subtle consonant structure)
        break;

      case 'WOLF_FIFTH':
        // Tension → torus stays dominant but with subtle pyramid warping
        // TORUS IS KING: Keep it at 0.75+ even with tension
        weights[3] = 0.80 - (0.05 * this.currentConfidence); // Torus (still dominant)
        weights[2] = 0.20 + (0.15 * this.currentConfidence); // Pyramid (subtle dissonant tension)
        break;

      case 'NEUTRAL_STATE':
      default:
        // No clear harmony → pure torus (chromatic clock visible, no bias)
        // TORUS IS KING: 100% torus when neutral
        weights[3] = 1.0;
        break;
    }

    return weights;
  }

  /**
   * Get color intensity for a given interval
   * Used to make active intervals visually prominent
   * @param {number} interval - Semitone interval (0-11)
   * @returns {number} - Intensity (0-1)
   */
  getIntervalIntensity(interval) {
    if (!this.enabled) return 0.5;
    return this.intervalDensities[interval];
  }

  /**
   * Get debug info for HUD display
   */
  getDebugInfo() {
    return {
      enabled: this.enabled,
      archetype: this.currentArchetype,
      confidence: this.currentConfidence.toFixed(2),
      tension: this.harmonicTension.toFixed(2),
      scale: this.geometryScale.toFixed(2),
      distortion: this.geometryDistortion.toFixed(2),
      mode: this.spatialMode,
      activeCongregations: this.intervalDensities
        .map((d, i) => d > 0.1 ? `${NOTE_NAMES[i]}:${d.toFixed(1)}` : null)
        .filter(Boolean)
        .join(', ') || 'uniform'
    };
  }
}

// ===== SINGLETON INSTANCE =====

const spatialGrammar = new MusicalSpatialGrammar();

// Export instance and control functions
export { spatialGrammar };

export function enableSpatialGrammar() {
  spatialGrammar.enable();
}

export function disableSpatialGrammar() {
  spatialGrammar.disable();
}

export function updateSpatialGrammar() {
  spatialGrammar.update();
}

export function isSpatialGrammarEnabled() {
  return spatialGrammar.enabled;
}

export function getParticlePositionFromGrammar(particleIndex, totalParticles) {
  return spatialGrammar.getParticlePosition(particleIndex, totalParticles);
}

export function getGeometryMorphFromGrammar() {
  return spatialGrammar.getGeometryMorphWeights();
}

export function getSpatialGrammarDebugInfo() {
  return spatialGrammar.getDebugInfo();
}

console.log("🎼 Musical Spatial Grammar ready - CHROMATIC CLOCK mode");
console.log("   📍 C=12 o'clock (north), G=7 o'clock, F#=6 o'clock (south)");
console.log("   🎯 Particles congregate at active intervals");
console.log("   ⚙️  Console: enableSpatialGrammar() | disableSpatialGrammar() | getSpatialGrammarDebugInfo()");
