// src/chronelixPhaseSpace.js
// Phase Space Dynamics for Chronelix MMPA Bibibinary System
// Nonlinear dynamical systems analysis of audio + optical MMPA forces

console.log("🌀 chronelixPhaseSpace.js loaded");

/**
 * Phase Space Dynamics Engine
 * Models 12D bibibinary system (6 audio + 6 optical MMPA forces)
 * as a nonlinear dynamical system with phase transitions
 */
export class ChronelixPhaseSpace {
  constructor() {
    // 12D State Vector: x(t) = [I_a, R_a, C_a, T_a, A_a, P_a, I_o, R_o, C_o, T_o, A_o, P_o]
    this.state = this.createEmptyState();

    // History for trajectory analysis
    this.stateHistory = [];
    this.maxHistoryLength = 300; // 5 seconds at 60fps

    // Phase transition indicators
    this.orderParameter = 0;      // Identity crystallization (0=disorder, 1=order)
    this.variance = 0;            // Complexity spike at transition
    this.coherence = 0;           // Alignment jump at transition
    this.criticalSlowing = 0;     // Transformation → 0 at transition

    // Attractor analysis
    this.attractorType = 'unknown';
    this.lyapunovExponent = 0;

    // Synchronization metrics
    this.synchronicity = 0;       // Cross-domain correlation
    this.phaseCoherence = 0;      // Phase locking measure
    this.mutualInformation = 0;   // Information flow

    // Control parameters (for bifurcation)
    this.coupling = 0.5;          // Relationship strength
    this.temperature = 1.0;       // System energy/noise
  }

  /**
   * Create empty 12D state vector
   */
  createEmptyState() {
    return {
      // Audio MMPA forces (6D)
      audio: {
        identity: 0,        // I_a: Spectral centroid, harmonic content
        relationship: 0,    // R_a: Consonance, harmonic relationships
        complexity: 0,      // C_a: Spectral entropy, polyphony
        transformation: 0,  // T_a: Spectral flux, onset rate (dx/dt)
        alignment: 0,       // A_a: Temporal coherence, rhythm stability
        potential: 0        // P_a: Spectral spread, unrealized harmonics
      },

      // Optical MMPA forces (6D)
      optical: {
        identity: 0,        // I_o: Brightness, color dominance
        relationship: 0,    // R_o: Color harmony, spatial correlations
        complexity: 0,      // C_o: Edge density, fractal dimension
        transformation: 0,  // T_o: Optical flow, frame difference (dx/dt)
        alignment: 0,       // A_o: Symmetry, pattern regularity
        potential: 0        // P_o: Entropy, unexpressed states
      },

      timestamp: 0
    };
  }

  /**
   * Update state from MMPA features
   * @param {Object} audioMMPA - Audio MMPA features
   * @param {Object} opticalMMPA - Optical MMPA features
   * @param {number} timestamp - Current time in seconds
   */
  updateState(audioMMPA, opticalMMPA, timestamp) {
    const newState = this.createEmptyState();
    newState.timestamp = timestamp;

    // Extract audio MMPA forces
    if (audioMMPA && audioMMPA.enabled) {
      newState.audio.identity = audioMMPA.identity?.strength || 0;
      newState.audio.relationship = audioMMPA.relationship?.consonance || 0;
      newState.audio.complexity = audioMMPA.complexity?.spectralEntropy || 0;
      newState.audio.transformation = audioMMPA.transformation?.flux || 0;
      newState.audio.alignment = audioMMPA.alignment?.coherence || 0;
      newState.audio.potential = audioMMPA.potential?.entropy || 0;
    }

    // Extract optical MMPA forces
    if (opticalMMPA && opticalMMPA.enabled) {
      newState.optical.identity = opticalMMPA.identity?.brightness || 0;
      newState.optical.relationship = opticalMMPA.relationship?.harmony || 0;
      newState.optical.complexity = opticalMMPA.complexity?.edgeDensity || 0;
      newState.optical.transformation = opticalMMPA.transformation?.flux || 0;
      newState.optical.alignment = opticalMMPA.alignment?.symmetry || 0;
      newState.optical.potential = opticalMMPA.potential?.entropy || 0;
    }

    // Store current state
    this.state = newState;

    // Add to history
    this.stateHistory.push(newState);
    if (this.stateHistory.length > this.maxHistoryLength) {
      this.stateHistory.shift();
    }

    // Update derived metrics
    this.updatePhaseTransitionIndicators();
    this.updateSynchronizationMetrics();
    this.updateAttractorAnalysis();
  }

  /**
   * Compute time evolution: dx/dt = f(x, μ)
   * Returns velocity vector in phase space
   */
  computeTimeDerivative() {
    const s = this.state;
    const μ = { coupling: this.coupling, temperature: this.temperature };

    // Transformation forces ARE the time derivatives
    const dxdt = {
      audio: {
        // Identity change driven by transformation and potential
        identity: s.audio.transformation * (1 - s.audio.identity) +
                  s.audio.potential * 0.1,

        // Relationship change driven by coupling and alignment
        relationship: μ.coupling * (s.optical.relationship - s.audio.relationship) +
                      s.audio.alignment * 0.5,

        // Complexity change driven by transformation and diversity
        complexity: s.audio.transformation * (1 - s.audio.complexity) +
                    (s.audio.potential - s.audio.complexity) * 0.3,

        // Transformation is self-modulating (acceleration)
        transformation: (s.audio.potential - s.audio.identity) * 0.5 -
                        s.audio.transformation * 0.1, // Damping

        // Alignment driven by relationship coherence
        alignment: s.audio.relationship * (1 - s.audio.alignment) -
                   s.audio.complexity * 0.2, // Complexity reduces alignment

        // Potential depleted by transformation, restored by disorder
        potential: s.audio.complexity * 0.3 -
                   s.audio.transformation * 0.5
      },

      optical: {
        identity: s.optical.transformation * (1 - s.optical.identity) +
                  s.optical.potential * 0.1,

        relationship: μ.coupling * (s.audio.relationship - s.optical.relationship) +
                      s.optical.alignment * 0.5,

        complexity: s.optical.transformation * (1 - s.optical.complexity) +
                    (s.optical.potential - s.optical.complexity) * 0.3,

        transformation: (s.optical.potential - s.optical.identity) * 0.5 -
                        s.optical.transformation * 0.1,

        alignment: s.optical.relationship * (1 - s.optical.alignment) -
                   s.optical.complexity * 0.2,

        potential: s.optical.complexity * 0.3 -
                   s.optical.transformation * 0.5
      }
    };

    return dxdt;
  }

  /**
   * Update phase transition indicators
   */
  updatePhaseTransitionIndicators() {
    if (this.stateHistory.length < 2) return;

    const s = this.state;

    // Order parameter: Average identity crystallization
    this.orderParameter = (s.audio.identity + s.optical.identity) / 2;

    // Variance: Complexity spike
    this.variance = (s.audio.complexity + s.optical.complexity) / 2;

    // Coherence: Alignment measure
    this.coherence = (s.audio.alignment + s.optical.alignment) / 2;

    // Critical slowing: Rate of transformation approaching zero
    this.criticalSlowing = 1 - ((s.audio.transformation + s.optical.transformation) / 2);
  }

  /**
   * Update synchronization metrics
   */
  updateSynchronizationMetrics() {
    const s = this.state;

    // Simple cross-correlation (Pearson)
    this.synchronicity = this.computeCrossCorrelation();

    // Phase coherence: alignment of transformation phases
    const audioPhase = Math.atan2(s.audio.transformation, s.audio.identity);
    const opticalPhase = Math.atan2(s.optical.transformation, s.optical.identity);
    const phaseDiff = Math.abs(audioPhase - opticalPhase);
    this.phaseCoherence = Math.cos(phaseDiff);

    // Mutual information (simplified via correlation)
    this.mutualInformation = -Math.log(1 - Math.abs(this.synchronicity) + 0.001);
  }

  /**
   * Compute cross-correlation between audio and optical domains
   */
  computeCrossCorrelation() {
    const s = this.state;

    // Flatten to vectors
    const audioVec = [
      s.audio.identity,
      s.audio.relationship,
      s.audio.complexity,
      s.audio.transformation,
      s.audio.alignment,
      s.audio.potential
    ];

    const opticalVec = [
      s.optical.identity,
      s.optical.relationship,
      s.optical.complexity,
      s.optical.transformation,
      s.optical.alignment,
      s.optical.potential
    ];

    // Compute Pearson correlation
    const audioMean = audioVec.reduce((a, b) => a + b) / audioVec.length;
    const opticalMean = opticalVec.reduce((a, b) => a + b) / opticalVec.length;

    let numerator = 0;
    let audioDenom = 0;
    let opticalDenom = 0;

    for (let i = 0; i < 6; i++) {
      const audioDev = audioVec[i] - audioMean;
      const opticalDev = opticalVec[i] - opticalMean;
      numerator += audioDev * opticalDev;
      audioDenom += audioDev * audioDev;
      opticalDenom += opticalDev * opticalDev;
    }

    const denominator = Math.sqrt(audioDenom * opticalDenom);
    return denominator > 0 ? numerator / denominator : 0;
  }

  /**
   * Update attractor analysis
   */
  updateAttractorAnalysis() {
    if (this.stateHistory.length < 30) return;

    // Compute Lyapunov exponent (simplified)
    this.lyapunovExponent = this.computeLyapunovExponent();

    // Classify attractor type
    if (Math.abs(this.lyapunovExponent) < 0.01) {
      this.attractorType = 'fixed_point';
    } else if (this.lyapunovExponent < 0) {
      this.attractorType = 'limit_cycle';
    } else if (this.lyapunovExponent > 0) {
      this.attractorType = 'chaotic';
    } else {
      this.attractorType = 'strange';
    }
  }

  /**
   * Compute Lyapunov exponent (simplified)
   * Measures rate of divergence in phase space
   */
  computeLyapunovExponent() {
    if (this.stateHistory.length < 30) return 0;

    const recent = this.stateHistory.slice(-30);
    let sumLogDivergence = 0;

    for (let i = 1; i < recent.length; i++) {
      const dist = this.computeStateDistance(recent[i], recent[i - 1]);
      if (dist > 0) {
        sumLogDivergence += Math.log(dist);
      }
    }

    return sumLogDivergence / (recent.length - 1);
  }

  /**
   * Compute Euclidean distance between two states in 12D space
   */
  computeStateDistance(state1, state2) {
    let sumSquares = 0;

    const domains = ['audio', 'optical'];
    const forces = ['identity', 'relationship', 'complexity',
                    'transformation', 'alignment', 'potential'];

    for (const domain of domains) {
      for (const force of forces) {
        const diff = state1[domain][force] - state2[domain][force];
        sumSquares += diff * diff;
      }
    }

    return Math.sqrt(sumSquares);
  }

  /**
   * Detect phase transition
   * Returns true if system is near critical point
   */
  detectPhaseTransition() {
    // Transition indicators:
    // 1. Order parameter near 0.5 (maximum uncertainty)
    // 2. Variance spike (complexity high)
    // 3. Critical slowing (transformation → 0)
    // 4. Coherence changing rapidly

    const orderNearCritical = Math.abs(this.orderParameter - 0.5) < 0.2;
    const varianceHigh = this.variance > 0.7;
    const slowingDetected = this.criticalSlowing > 0.7;

    return orderNearCritical && (varianceHigh || slowingDetected);
  }

  /**
   * Get current phase space position (for visualization)
   */
  getPhaseSpacePosition() {
    return {
      // Project 12D → 3D for visualization
      x: (this.state.audio.identity + this.state.optical.identity) / 2,
      y: (this.state.audio.relationship + this.state.optical.relationship) / 2,
      z: (this.state.audio.complexity + this.state.optical.complexity) / 2,

      // Full 12D state
      state: this.state,

      // Derived metrics
      synchronicity: this.synchronicity,
      orderParameter: this.orderParameter,
      variance: this.variance,
      coherence: this.coherence,
      criticalSlowing: this.criticalSlowing,

      // Attractor info
      attractorType: this.attractorType,
      lyapunovExponent: this.lyapunovExponent
    };
  }

  /**
   * Get trajectory in phase space (last N states projected to 3D)
   */
  getTrajectory(numPoints = 60) {
    const recent = this.stateHistory.slice(-numPoints);
    return recent.map(state => ({
      x: (state.audio.identity + state.optical.identity) / 2,
      y: (state.audio.relationship + state.optical.relationship) / 2,
      z: (state.audio.complexity + state.optical.complexity) / 2,
      timestamp: state.timestamp
    }));
  }

  /**
   * Update phase space (convenience wrapper for updateState)
   * @param {Object} audioMMPA - Audio MMPA features
   * @param {Object} opticalMMPA - Optical MMPA features
   * @param {number} deltaTime - Time delta (not used, for API consistency)
   */
  update(audioMMPA, opticalMMPA, deltaTime) {
    this.updateState(audioMMPA, opticalMMPA, performance.now() / 1000);
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      stateHistoryLength: this.stateHistory.length,
      orderParameter: this.orderParameter.toFixed(3),
      variance: this.variance.toFixed(3),
      coherence: this.coherence.toFixed(3),
      criticalSlowing: this.criticalSlowing.toFixed(3),
      synchronicity: this.synchronicity.toFixed(3),
      phaseCoherence: this.phaseCoherence.toFixed(3),
      attractorType: this.attractorType,
      lyapunovExponent: this.lyapunovExponent.toFixed(4),
      inTransition: this.detectPhaseTransition()
    };
  }

  /**
   * Reset state
   */
  reset() {
    this.state = this.createEmptyState();
    this.stateHistory = [];
    this.orderParameter = 0;
    this.variance = 0;
    this.coherence = 0;
    this.criticalSlowing = 0;
    this.attractorType = 'unknown';
    this.lyapunovExponent = 0;
    this.synchronicity = 0;
    this.phaseCoherence = 0;
    this.mutualInformation = 0;
  }
}

// Singleton instance
export const phaseSpace = new ChronelixPhaseSpace();

console.log("🌀 Phase space dynamics engine ready");
