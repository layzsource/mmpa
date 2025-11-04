// 🌀 perceptionState.js
// Phase 1.5 — Pilot State: Wave ↔ Particle Perception System
// Manages dual perception modes that alter field interaction, navigation feel, and event visibility

import * as THREE from 'three';

/**
 * PerceptionState manages the wave ↔ particle duality mechanic.
 *
 * Philosophy:
 * - Wave mode = continuous, distributed sensing (like duck perception)
 * - Particle mode = discrete, focused detection (like rabbit perception)
 * - Not two things, but two modes of seeing the same signal field
 *
 * Wittgenstein's duck/rabbit → quantum wave-particle duality
 */
export class PerceptionState {
  constructor() {
    this.mode = 'wave';  // 'wave' or 'particle'
    this.transitionProgress = 0;  // 0.0 = pure wave, 1.0 = pure particle
    this.transitionSpeed = 5.0;   // How fast to blend between states
    this.lastToggleTime = 0;
    this.toggleCooldown = 200;    // ms - prevent accidental double-toggles

    // Callbacks
    this.onToggle = null;  // Called when mode switches
    this.onTransitionUpdate = null;  // Called each frame during transition

    console.log('🌀 perceptionState.js loaded');
  }

  /**
   * Toggle between wave and particle modes
   */
  toggle() {
    const now = performance.now();
    if (now - this.lastToggleTime < this.toggleCooldown) return;

    const oldMode = this.mode;
    this.mode = this.mode === 'wave' ? 'particle' : 'wave';
    this.lastToggleTime = now;

    console.log(`🧬 Perception toggled: ${oldMode} → ${this.mode}`);

    // Trigger callback
    if (this.onToggle) {
      this.onToggle(this.mode, oldMode);
    }
  }

  /**
   * Smoothly interpolate transition progress (called each frame)
   * @param {number} delta - Time since last frame in seconds
   */
  update(delta) {
    const targetProgress = this.mode === 'particle' ? 1.0 : 0.0;

    // Smooth lerp to target
    this.transitionProgress = THREE.MathUtils.lerp(
      this.transitionProgress,
      targetProgress,
      this.transitionSpeed * delta
    );

    // Callback for systems that need frame-by-frame updates
    if (this.onTransitionUpdate) {
      this.onTransitionUpdate(this.transitionProgress);
    }
  }

  /**
   * Force mode without cooldown (for testing/initialization)
   */
  setMode(mode) {
    if (mode !== 'wave' && mode !== 'particle') {
      console.warn(`⚠️ Invalid perception mode: ${mode}`);
      return;
    }

    this.mode = mode;
    this.transitionProgress = mode === 'particle' ? 1.0 : 0.0;
  }

  // --- Getters ---

  get isWave() { return this.mode === 'wave'; }
  get isParticle() { return this.mode === 'particle'; }
  get waveFactor() { return 1.0 - this.transitionProgress; }
  get particleFactor() { return this.transitionProgress; }

  /**
   * Field perception radius - how far events can be detected
   * Wave = broad sensing, Particle = narrow focus
   */
  getFieldPerceptionRadius() {
    return this.isWave ? 50 : 10;
  }

  /**
   * Movement damping - affects navigation "feel"
   * Wave = fluid/floaty, Particle = snappy/responsive
   */
  getMovementDamping() {
    return this.isWave ? 0.92 : 0.85;
  }

  /**
   * Detection threshold - signal strength needed to register event
   * Wave = picks up gradients, Particle = only sharp anomalies
   */
  getDetectionThreshold() {
    return this.isWave ? 0.3 : 0.7;
  }

  /**
   * Movement speed modifier
   * Wave = slower but smoother, Particle = faster but twitchy
   */
  getMovementSpeedModifier() {
    return this.isWave ? 0.8 : 1.2;
  }

  /**
   * Camera inertia - how much momentum affects movement
   * Wave = high inertia (smooth arcs), Particle = low inertia (tight turns)
   */
  getCameraInertia() {
    return this.isWave ? 0.15 : 0.05;
  }

  /**
   * VCN glow style parameters for current mode
   */
  getVCNGlowStyle() {
    return this.isWave ? {
      blur: 15,
      spreadMultiplier: 1.5,
      pulseFrequency: 0.3,
      colorSaturation: 0.6,
      edgeSharpness: 0.3
    } : {
      blur: 5,
      spreadMultiplier: 0.8,
      pulseFrequency: 1.2,
      colorSaturation: 1.0,
      edgeSharpness: 0.9
    };
  }

  /**
   * Check if a destination category is visible in current mode
   * @param {string} category - Destination category
   * @returns {boolean}
   */
  isDestinationVisible(category) {
    // Wave-only categories (continuous/gradient phenomena)
    const waveOnlyCategories = [
      'bass',
      'morphTransition',
      'harmonic',
      'mandalaPulse',
      'densityWave'
    ];

    // Particle-only categories (discrete/onset phenomena)
    const particleOnlyCategories = [
      'flux',
      'chladniResonance',
      'onset',
      'spectralPeak',
      'moireStorm'
    ];

    // Always-visible categories
    const alwaysVisible = [
      'geometry',
      'vessel',
      'control'
    ];

    if (alwaysVisible.includes(category)) return true;

    if (this.isWave) {
      return !particleOnlyCategories.includes(category);
    } else {
      return !waveOnlyCategories.includes(category);
    }
  }

  /**
   * Get debug info for HUD display
   */
  getDebugInfo() {
    return {
      mode: this.mode,
      progress: this.transitionProgress.toFixed(3),
      waveFactor: this.waveFactor.toFixed(3),
      particleFactor: this.particleFactor.toFixed(3),
      perceptionRadius: this.getFieldPerceptionRadius(),
      threshold: this.getDetectionThreshold(),
      speedMod: this.getMovementSpeedModifier().toFixed(2)
    };
  }
}

export default PerceptionState;
