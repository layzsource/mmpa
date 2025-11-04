/**
 * Audio-MMPA Bridge V2.0
 *
 * Connects audio analysis to MMPA V2.0 control system for production audio visualization.
 *
 * What this does:
 * - Maps audio features (bass, mids, treble, flux, etc.) → control inputs
 * - Runs UKF to predict visual bifurcations ("drop incoming in 2.3s")
 * - Uses LQR to smooth transitions (no jarring jumps)
 * - Provides FIM force attribution ("bass is 70% of the motion")
 *
 * Production Features:
 * - Predictive transition warnings (know drops before they hit)
 * - Smooth morphing (LQR-controlled)
 * - Real-time audio band attribution
 * - Stability monitoring (visual "health" meter)
 */

console.log("🎵 audioMMPABridge.js V2.0 loaded");

import { MMPAControlSystem } from './mmpaControlSystem.js';

export class AudioMMPABridge {
  constructor(options = {}) {
    // === Configuration ===
    this.enabled = options.enabled !== false;
    this.audioFeatureMode = options.audioFeatureMode || 'bands'; // 'bands', 'meyda', 'hybrid'

    // === MMPA V2.0 Control System ===
    // Configure for audio visualization (no actuators, just prediction/control)
    this.mmpa = new MMPAControlSystem({
      domain: 'general',

      // System dynamics tuned for audio (faster response than financial)
      A: 0.85,  // Much less memory for faster response (was 0.92)
      B: [-0.15, -0.20],  // Increased stress response (was -0.08, -0.12)

      // UKF parameters (audio-optimized for responsiveness)
      Q: 0.008,  // MUCH higher process noise for audio reactivity (was 5e-4 = 0.0005)
      R: 0.005,  // Slightly higher measurement noise (was 2e-3 = 0.002)
      ukf_alpha: 0.25,  // Wider sigma point spread (was 0.15)

      // LQR parameters (more responsive, less damping)
      lqr_Q: 15.0,  // MUCH stronger tracking (was 8.0)
      lqr_R: [[0.3, 0.0], [0.0, 0.5]],  // Lower control cost = more reactive (was 0.8, 1.2)
      setpoint: 0.85,  // Lower target = more sensitivity to drops (was 0.90)

      // φ-regularization
      phiRegWeight: 0.15,  // Moderate golden ratio enforcement

      // Don't initialize actuators (not needed for visualization)
      financialActuator: null,
      mechanicalActuator: null,
      physiologicalActuator: null
    });

    // === Audio Feature Mapping ===
    // How do we map audio features to control inputs?
    // INCREASED for better audio responsiveness (was too conservative)
    this.featureWeights = {
      // Translational smoothness (frequency stability)
      // FIXED: Changed to POSITIVE values (B matrix is negative, so positive weights → destabilizing)
      trans_sm: {
        bass: 1.5,      // Bass changes affect smoothness most (SIGN FIX: was -1.5)
        mid: 1.2,       // (SIGN FIX: was -1.2)
        treble: 0.8,    // (SIGN FIX: was -0.8)
        flux: 1.0       // Spectral flux = rate of change (SIGN FIX: was -1.0)
      },
      // Resilience (overall energy/intensity)
      res: {
        bass: 1.2,      // (SIGN FIX: was -1.2)
        mid: 1.2,       // (SIGN FIX: was -1.2)
        treble: 0.8,    // (SIGN FIX: was -0.8)
        rms: 1.0        // RMS level (SIGN FIX: was -1.0)
      }
    };

    // === Prediction State ===
    this.predictions = {
      transitionWarning: false,
      secondsUntilTransition: null,
      confidence: 0,
      trajectory: []  // Recent Σ* values for trend analysis
    };

    // === Performance Metrics ===
    this.metrics = {
      currentStability: 0.95,  // Current Σ*
      bifurcationRisk: 0.05,   // 1 - Σ*
      dominantBand: 'none',    // Which audio band is driving changes
      attribution: null,       // FIM result
      transitionsDetected: 0,
      avgPredictionAccuracy: 0
    };

    // === History ===
    this.history = {
      stability: [],
      audio: [],
      predictions: [],
      maxLength: 300  // 5 seconds at 60fps
    };

    console.log("🎵 Audio-MMPA Bridge initialized");
    console.log(`   Mode: ${this.audioFeatureMode}`);
    console.log(`   Prediction: ${this.enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  /**
   * Process audio frame and update MMPA state
   *
   * @param {Object} audioBands - { bass, mid, treble, level } (0-1)
   * @param {Object} audioFeatures - Optional Meyda features for advanced mode
   * @returns {Object} - MMPA state with predictions
   */
  update(audioBands, audioFeatures = null) {
    if (!this.enabled) {
      return { enabled: false };
    }

    // ━━━ STEP 1: Map Audio Features → Control Inputs ━━━
    const { trans_sm, res } = this.mapAudioToControlInputs(audioBands, audioFeatures);
    const u_t = [trans_sm, res];

    // ━━━ STEP 2: Compute "Observation" (current visual stability) ━━━
    // For audio viz, we estimate ΣC from recent audio energy changes
    const y_t = this.computeAudioStabilityObservation(audioBands);

    // ━━━ STEP 3: Run MMPA V2.0 Control Cycle ━━━
    const mmpaResult = this.mmpa.step(u_t, y_t);

    // ━━━ STEP 4: Analyze Predictions ━━━
    this.updatePredictions(mmpaResult);

    // ━━━ STEP 5: Update Metrics ━━━
    this.metrics.currentStability = mmpaResult.sigma_star;
    this.metrics.bifurcationRisk = mmpaResult.bifurcation_risk;
    this.metrics.attribution = mmpaResult.force_attribution;

    // Determine dominant band from FIM
    if (this.metrics.attribution && this.metrics.attribution.top_contributors.length > 0) {
      this.metrics.dominantBand = this.metrics.attribution.top_contributors[0].name;
    }

    // ━━━ STEP 6: Log History ━━━
    this.history.stability.push(mmpaResult.sigma_star);
    this.history.audio.push({ ...audioBands });
    this.history.predictions.push({ ...this.predictions });

    if (this.history.stability.length > this.history.maxLength) {
      this.history.stability.shift();
      this.history.audio.shift();
      this.history.predictions.shift();
    }

    // ━━━ STEP 7: Return Complete State ━━━
    return {
      enabled: true,

      // MMPA State
      sigma_star: mmpaResult.sigma_star,
      bifurcation_risk: mmpaResult.bifurcation_risk,

      // Predictions
      predictions: this.predictions,

      // Force Attribution
      attribution: this.metrics.attribution,
      dominant_band: this.metrics.dominantBand,

      // Control
      control_signal: mmpaResult.control_signal,

      // Diagnostics
      ukf: mmpaResult.ukf_diagnostics,
      metrics: this.metrics
    };
  }

  /**
   * Map audio features to MMPA control inputs [Trans_sm, Res]
   */
  mapAudioToControlInputs(bands, features) {
    const { bass = 0, mid = 0, treble = 0, level = 0 } = bands;

    // Compute flux (rate of change) from history
    const flux = this.computeFlux(bands);

    // Trans_sm: translational smoothness (affected by all bands + flux)
    const trans_sm =
      this.featureWeights.trans_sm.bass * bass +
      this.featureWeights.trans_sm.mid * mid +
      this.featureWeights.trans_sm.treble * treble +
      this.featureWeights.trans_sm.flux * flux;

    // Res: resilience (affected by energy/intensity)
    const res =
      this.featureWeights.res.bass * bass +
      this.featureWeights.res.mid * mid +
      this.featureWeights.res.treble * treble +
      this.featureWeights.res.rms * level;

    return { trans_sm, res };
  }

  /**
   * Compute audio "flux" (rate of change) for transformation tracking
   */
  computeFlux(currentBands) {
    if (this.history.audio.length < 2) return 0;

    const prevBands = this.history.audio[this.history.audio.length - 1];
    const flux =
      Math.abs(currentBands.bass - prevBands.bass) +
      Math.abs(currentBands.mid - prevBands.mid) +
      Math.abs(currentBands.treble - prevBands.treble);

    return Math.min(1.0, flux);
  }

  /**
   * Estimate current visual stability from audio
   * (This is what the UKF is trying to predict/track)
   */
  computeAudioStabilityObservation(bands) {
    // High energy = low stability (approaching bifurcation)
    // Rapid changes = low stability
    const avgEnergy = (bands.bass + bands.mid + bands.treble) / 3;
    const flux = this.computeFlux(bands);

    // Invert: high energy/flux → low stability
    // INCREASED weighting for more dynamic range (was 0.6, 0.4)
    const stability = 1.0 - (0.8 * avgEnergy + 0.6 * flux);

    // Allow wider range for better response
    return Math.max(0.05, Math.min(0.95, stability));
  }

  /**
   * Analyze MMPA predictions for transition warnings
   */
  updatePredictions(mmpaResult) {
    // Add to trajectory
    this.predictions.trajectory.push(mmpaResult.sigma_star);
    if (this.predictions.trajectory.length > 30) {
      this.predictions.trajectory.shift();
    }

    // Detect downward trend (approaching bifurcation)
    const trend = this.computeTrend(this.predictions.trajectory);
    const currentStability = mmpaResult.sigma_star;

    // Transition threshold (when visual will dramatically change)
    const TRANSITION_THRESHOLD = 0.60;

    if (currentStability < TRANSITION_THRESHOLD && !this.predictions.transitionWarning) {
      // Entered transition zone
      this.predictions.transitionWarning = true;
      this.predictions.secondsUntilTransition = 0;
      this.predictions.confidence = 0.9;
      console.log("🎵 TRANSITION DETECTED: Σ* =", currentStability.toFixed(3));
      this.metrics.transitionsDetected++;
    } else if (currentStability > TRANSITION_THRESHOLD + 0.05 && this.predictions.transitionWarning) {
      // Exited transition zone
      this.predictions.transitionWarning = false;
      this.predictions.secondsUntilTransition = null;
      console.log("🎵 Transition cleared: Σ* =", currentStability.toFixed(3));
    } else if (trend < -0.01 && currentStability < TRANSITION_THRESHOLD + 0.15) {
      // Approaching transition (predictive warning)
      const rate = Math.abs(trend);
      const distance = currentStability - TRANSITION_THRESHOLD;
      const eta = distance / Math.max(rate, 0.001);

      this.predictions.secondsUntilTransition = eta / 60; // Convert frames to seconds (assuming 60fps)
      this.predictions.confidence = Math.min(0.95, rate * 10);
    }
  }

  /**
   * Compute linear trend of recent values
   */
  computeTrend(values) {
    if (values.length < 5) return 0;

    const recent = values.slice(-10);
    const n = recent.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += recent[i];
      sumXY += i * recent[i];
      sumX2 += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  /**
   * Get production HUD data
   */
  getHUDData() {
    return {
      stability: {
        current: this.metrics.currentStability,
        risk: this.metrics.bifurcationRisk,
        status: this.metrics.currentStability > 0.80 ? 'stable' :
                this.metrics.currentStability > 0.60 ? 'unstable' : 'chaotic'
      },
      prediction: {
        warning: this.predictions.transitionWarning,
        eta: this.predictions.secondsUntilTransition,
        confidence: this.predictions.confidence
      },
      attribution: {
        dominant: this.metrics.dominantBand,
        top3: this.metrics.attribution?.top_contributors || [],
        instability: this.metrics.attribution?.raw_instability || 0
      },
      stats: {
        transitions: this.metrics.transitionsDetected
      }
    };
  }

  /**
   * Reset system
   */
  reset() {
    this.mmpa.reset();
    this.history = {
      stability: [],
      audio: [],
      predictions: [],
      maxLength: 300
    };
    this.predictions = {
      transitionWarning: false,
      secondsUntilTransition: null,
      confidence: 0,
      trajectory: []
    };
    this.metrics.transitionsDetected = 0;
    console.log("🎵 Audio-MMPA Bridge reset");
  }

  /**
   * Get diagnostics
   */
  getDiagnostics() {
    return {
      version: '2.0-AudioMMPABridge',
      enabled: this.enabled,
      mode: this.audioFeatureMode,
      mmpa: this.mmpa.getDiagnostics(),
      metrics: this.metrics,
      history_length: this.history.stability.length
    };
  }
}

console.log("🎵 AudioMMPABridge class ready");

export default AudioMMPABridge;
