// src/chronelixWaveletDecomposition.js
// Multi-Scale Wavelet Decomposition for Temporal Scale Separation
// Separates fast dynamics (transients) from slow dynamics (trends) in MMPA signals

console.log("🌊 chronelixWaveletDecomposition.js loaded");

/**
 * Wavelet Scale
 * Represents signal decomposition at a specific temporal scale
 */
class WaveletScale {
  constructor(level, period, label) {
    this.level = level;           // Scale level (0 = finest, higher = coarser)
    this.period = period;          // Temporal period in seconds
    this.label = label;            // Human-readable label

    // Decomposed coefficients for each MMPA force
    this.audioCoefficients = {
      identity: [],
      relationship: [],
      complexity: [],
      transformation: [],
      alignment: [],
      potential: []
    };

    this.opticalCoefficients = {
      identity: [],
      relationship: [],
      complexity: [],
      transformation: [],
      alignment: [],
      potential: []
    };

    // Energy at this scale
    this.audioEnergy = 0;
    this.opticalEnergy = 0;
    this.totalEnergy = 0;

    // Dominant patterns at this scale
    this.dominantFrequency = 0;
    this.patternStrength = 0;
  }

  /**
   * Compute energy at this scale
   */
  computeEnergy() {
    // Sum of squared coefficients
    let audioEnergy = 0;
    let opticalEnergy = 0;

    for (const force in this.audioCoefficients) {
      const coeffs = this.audioCoefficients[force];
      audioEnergy += coeffs.reduce((sum, c) => sum + c * c, 0);
    }

    for (const force in this.opticalCoefficients) {
      const coeffs = this.opticalCoefficients[force];
      opticalEnergy += coeffs.reduce((sum, c) => sum + c * c, 0);
    }

    this.audioEnergy = audioEnergy;
    this.opticalEnergy = opticalEnergy;
    this.totalEnergy = audioEnergy + opticalEnergy;
  }
}

/**
 * Multi-Scale Wavelet Decomposer
 * Decomposes MMPA signals into multiple temporal scales
 */
export class ChronelixWaveletDecomposition {
  constructor() {
    // Temporal scales (in seconds)
    this.scales = [
      new WaveletScale(0, 0.1, 'Ultra-fast (100ms)'),    // Transients, rapid changes
      new WaveletScale(1, 0.5, 'Fast (500ms)'),          // Quick patterns
      new WaveletScale(2, 1.0, 'Medium (1s)'),           // BPM sub-beat
      new WaveletScale(3, 2.0, 'Slow (2s)'),             // Beat-level patterns
      new WaveletScale(4, 5.0, 'Very slow (5s)'),        // Gate-level patterns
      new WaveletScale(5, 10.0, 'Ultra-slow (10s)')      // Long-term trends
    ];

    // Signal history for decomposition
    this.audioHistory = {
      identity: [],
      relationship: [],
      complexity: [],
      transformation: [],
      alignment: [],
      potential: []
    };

    this.opticalHistory = {
      identity: [],
      relationship: [],
      complexity: [],
      transformation: [],
      alignment: [],
      potential: []
    };

    // Window size for decomposition (frames)
    this.windowSize = 300; // 5 seconds at 60fps
    this.samplingRate = 60; // fps

    // Energy distribution
    this.energyDistribution = {
      audio: [],
      optical: [],
      total: []
    };

    // Pattern detection
    this.detectedPatterns = [];

    // Statistics
    this.totalDecompositions = 0;
  }

  /**
   * Update decomposition with new MMPA state
   */
  update(audioMMPA, opticalMMPA) {
    // Add current values to history
    if (audioMMPA && audioMMPA.enabled) {
      this.audioHistory.identity.push(audioMMPA.identity?.strength || 0);
      this.audioHistory.relationship.push(audioMMPA.relationship?.consonance || 0);
      this.audioHistory.complexity.push(audioMMPA.complexity?.spectralEntropy || 0);
      this.audioHistory.transformation.push(audioMMPA.transformation?.flux || 0);
      this.audioHistory.alignment.push(audioMMPA.alignment?.coherence || 0);
      this.audioHistory.potential.push(audioMMPA.potential?.entropy || 0);
    }

    if (opticalMMPA && opticalMMPA.enabled) {
      this.opticalHistory.identity.push(opticalMMPA.identity?.brightness || 0);
      this.opticalHistory.relationship.push(opticalMMPA.relationship?.harmony || 0);
      this.opticalHistory.complexity.push(opticalMMPA.complexity?.edgeDensity || 0);
      this.opticalHistory.transformation.push(opticalMMPA.transformation?.flux || 0);
      this.opticalHistory.alignment.push(opticalMMPA.alignment?.symmetry || 0);
      this.opticalHistory.potential.push(opticalMMPA.potential?.entropy || 0);
    }

    // Maintain window size
    for (const force in this.audioHistory) {
      if (this.audioHistory[force].length > this.windowSize) {
        this.audioHistory[force].shift();
      }
    }

    for (const force in this.opticalHistory) {
      if (this.opticalHistory[force].length > this.windowSize) {
        this.opticalHistory[force].shift();
      }
    }

    // Perform decomposition if we have enough data
    if (this.audioHistory.identity.length >= 60) { // At least 1 second
      this.performDecomposition();
    }
  }

  /**
   * Perform wavelet decomposition across scales
   */
  performDecomposition() {
    // Decompose each MMPA force at each scale
    for (const scale of this.scales) {
      // Audio decomposition
      for (const force in this.audioHistory) {
        const signal = this.audioHistory[force];
        const coeffs = this.decomposeSignal(signal, scale.period);
        scale.audioCoefficients[force] = coeffs;
      }

      // Optical decomposition
      for (const force in this.opticalHistory) {
        const signal = this.opticalHistory[force];
        const coeffs = this.decomposeSignal(signal, scale.period);
        scale.opticalCoefficients[force] = coeffs;
      }

      // Compute energy at this scale
      scale.computeEnergy();
    }

    // Update energy distribution
    this.updateEnergyDistribution();

    // Detect patterns
    this.detectPatterns();

    this.totalDecompositions++;
  }

  /**
   * Decompose signal at specific scale using moving average (simplified wavelet)
   * This is a simplified approach - real wavelets would use Morlet, Mexican Hat, etc.
   */
  decomposeSignal(signal, period) {
    if (signal.length === 0) return [];

    // Window size in frames
    const windowFrames = Math.round(period * this.samplingRate);
    const halfWindow = Math.floor(windowFrames / 2);

    const coefficients = [];

    for (let i = 0; i < signal.length; i++) {
      // Moving average (low-pass)
      let sum = 0;
      let count = 0;

      for (let j = Math.max(0, i - halfWindow); j < Math.min(signal.length, i + halfWindow); j++) {
        sum += signal[j];
        count++;
      }

      const average = count > 0 ? sum / count : 0;

      // Wavelet coefficient = signal - smoothed (high-pass)
      // This captures variations at this scale
      const coeff = signal[i] - average;
      coefficients.push(coeff);
    }

    return coefficients;
  }

  /**
   * Reconstruct signal from specific scales
   */
  reconstructSignal(force, domain, scaleIndices) {
    if (scaleIndices.length === 0) return [];

    const length = domain === 'audio'
      ? this.audioHistory[force]?.length || 0
      : this.opticalHistory[force]?.length || 0;

    if (length === 0) return [];

    const reconstructed = new Array(length).fill(0);

    // Sum coefficients from selected scales
    for (const scaleIndex of scaleIndices) {
      const scale = this.scales[scaleIndex];
      const coeffs = domain === 'audio'
        ? scale.audioCoefficients[force]
        : scale.opticalCoefficients[force];

      for (let i = 0; i < Math.min(length, coeffs.length); i++) {
        reconstructed[i] += coeffs[i];
      }
    }

    return reconstructed;
  }

  /**
   * Update energy distribution across scales
   */
  updateEnergyDistribution() {
    const audioEnergies = [];
    const opticalEnergies = [];
    const totalEnergies = [];

    for (const scale of this.scales) {
      audioEnergies.push(scale.audioEnergy);
      opticalEnergies.push(scale.opticalEnergy);
      totalEnergies.push(scale.totalEnergy);
    }

    // Normalize to percentages
    const audioTotal = audioEnergies.reduce((a, b) => a + b, 0);
    const opticalTotal = opticalEnergies.reduce((a, b) => a + b, 0);
    const grandTotal = totalEnergies.reduce((a, b) => a + b, 0);

    this.energyDistribution.audio = audioEnergies.map(e =>
      audioTotal > 0 ? (e / audioTotal) * 100 : 0
    );

    this.energyDistribution.optical = opticalEnergies.map(e =>
      opticalTotal > 0 ? (e / opticalTotal) * 100 : 0
    );

    this.energyDistribution.total = totalEnergies.map(e =>
      grandTotal > 0 ? (e / grandTotal) * 100 : 0
    );
  }

  /**
   * Detect dominant patterns at each scale
   */
  detectPatterns() {
    this.detectedPatterns = [];

    for (const scale of this.scales) {
      // Find dominant force at this scale
      let maxAudioEnergy = 0;
      let maxOpticalEnergy = 0;
      let dominantAudioForce = null;
      let dominantOpticalForce = null;

      // Audio forces
      for (const force in scale.audioCoefficients) {
        const coeffs = scale.audioCoefficients[force];
        const energy = coeffs.reduce((sum, c) => sum + c * c, 0);

        if (energy > maxAudioEnergy) {
          maxAudioEnergy = energy;
          dominantAudioForce = force;
        }
      }

      // Optical forces
      for (const force in scale.opticalCoefficients) {
        const coeffs = scale.opticalCoefficients[force];
        const energy = coeffs.reduce((sum, c) => sum + c * c, 0);

        if (energy > maxOpticalEnergy) {
          maxOpticalEnergy = energy;
          dominantOpticalForce = force;
        }
      }

      // Store pattern
      this.detectedPatterns.push({
        scale: scale.label,
        period: scale.period,
        audio: {
          dominantForce: dominantAudioForce,
          energy: maxAudioEnergy,
          strength: Math.sqrt(maxAudioEnergy)
        },
        optical: {
          dominantForce: dominantOpticalForce,
          energy: maxOpticalEnergy,
          strength: Math.sqrt(maxOpticalEnergy)
        }
      });
    }
  }

  /**
   * Get scale with maximum energy
   */
  getDominantScale() {
    let maxEnergy = 0;
    let dominantScale = null;

    for (const scale of this.scales) {
      if (scale.totalEnergy > maxEnergy) {
        maxEnergy = scale.totalEnergy;
        dominantScale = scale;
      }
    }

    return dominantScale;
  }

  /**
   * Get energy ratio between fast and slow scales
   */
  getFastSlowRatio() {
    // Fast scales: 0, 1, 2 (< 1s)
    // Slow scales: 3, 4, 5 (>= 2s)
    let fastEnergy = 0;
    let slowEnergy = 0;

    for (let i = 0; i < 3; i++) {
      fastEnergy += this.scales[i].totalEnergy;
    }

    for (let i = 3; i < 6; i++) {
      slowEnergy += this.scales[i].totalEnergy;
    }

    return slowEnergy > 0 ? fastEnergy / slowEnergy : 0;
  }

  /**
   * Detect scale transitions (when dominant scale changes)
   */
  detectScaleTransition() {
    const dominant = this.getDominantScale();
    const ratio = this.getFastSlowRatio();

    return {
      dominantScale: dominant?.label || 'none',
      dominantPeriod: dominant?.period || 0,
      fastSlowRatio: ratio,
      isTransient: ratio > 2.0,  // Fast dynamics dominate
      isTrending: ratio < 0.5    // Slow dynamics dominate
    };
  }

  /**
   * Get coefficients for specific force and domain at all scales
   */
  getForceDecomposition(force, domain) {
    const decomposition = [];

    for (const scale of this.scales) {
      const coeffs = domain === 'audio'
        ? scale.audioCoefficients[force]
        : scale.opticalCoefficients[force];

      decomposition.push({
        scale: scale.label,
        period: scale.period,
        coefficients: coeffs,
        energy: coeffs.reduce((sum, c) => sum + c * c, 0)
      });
    }

    return decomposition;
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    const dominant = this.getDominantScale();
    const transition = this.detectScaleTransition();

    return {
      totalDecompositions: this.totalDecompositions,
      windowSize: this.windowSize,
      samplingRate: this.samplingRate,
      audioHistoryLength: this.audioHistory.identity?.length || 0,
      opticalHistoryLength: this.opticalHistory.identity?.length || 0,
      dominantScale: dominant?.label || 'none',
      fastSlowRatio: transition.fastSlowRatio.toFixed(2),
      isTransient: transition.isTransient,
      isTrending: transition.isTrending,
      energyDistribution: {
        audio: this.energyDistribution.audio.map(e => e.toFixed(1) + '%'),
        optical: this.energyDistribution.optical.map(e => e.toFixed(1) + '%')
      }
    };
  }

  /**
   * Get scale statistics
   */
  getScaleStatistics() {
    return this.scales.map(scale => ({
      label: scale.label,
      period: scale.period,
      audioEnergy: scale.audioEnergy.toFixed(3),
      opticalEnergy: scale.opticalEnergy.toFixed(3),
      totalEnergy: scale.totalEnergy.toFixed(3),
      energyPercent: this.energyDistribution.total[scale.level]?.toFixed(1) + '%'
    }));
  }

  /**
   * Reset decomposition
   */
  reset() {
    // Clear history
    for (const force in this.audioHistory) {
      this.audioHistory[force] = [];
    }

    for (const force in this.opticalHistory) {
      this.opticalHistory[force] = [];
    }

    // Reset scales
    for (const scale of this.scales) {
      for (const force in scale.audioCoefficients) {
        scale.audioCoefficients[force] = [];
      }
      for (const force in scale.opticalCoefficients) {
        scale.opticalCoefficients[force] = [];
      }
      scale.audioEnergy = 0;
      scale.opticalEnergy = 0;
      scale.totalEnergy = 0;
    }

    this.energyDistribution = {
      audio: [],
      optical: [],
      total: []
    };

    this.detectedPatterns = [];
    this.totalDecompositions = 0;
  }
}

// Singleton instance
export const waveletDecomposition = new ChronelixWaveletDecomposition();

console.log("🌊 Wavelet decomposition system ready");
