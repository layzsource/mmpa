/**
 * Phase 13.29: Intelligent Regime Classification
 *
 * Three-layer logic for determining market regime state:
 * 1. Input Layer: SigmaStar, BifurcationRisk, SigmaR, phiRatio
 * 2. Prediction Layer: Smooth signals, compute expected bifurcation risk
 * 3. Decision Layer: Thresholds, trends, hysteresis → regime state
 *
 * Key Features:
 * - Hysteresis buffers to prevent regime chatter
 * - Predictive weighting using expected future SigmaStar
 * - Sticky transitions (maintains state unless strong evidence)
 * - Continuous regime score for confidence
 */

console.log("🎯 regimeClassifier.js loaded");

export class RegimeClassifier {
  constructor(params = {}) {
    // Tunable parameters
    this.params = {
      // Crisis transition thresholds
      riskCrisisThreshold: params.riskCrisisThreshold ?? 0.70,    // 70% risk
      sigmaRCrisisLimit: params.sigmaRCrisisLimit ?? 0.08,        // Very low ΣR
      sigmaStarCrisisLimit: params.sigmaStarCrisisLimit ?? 0.30,  // Low Σ*

      // Normal transition thresholds
      riskNormalThreshold: params.riskNormalThreshold ?? 0.20,    // 20% risk
      sigmaStarRecovery: params.sigmaStarRecovery ?? 0.90,        // Strong Σ*

      // Hysteresis (prevents chatter)
      hysteresisWindow: params.hysteresisWindow ?? 3,             // samples

      // Prediction horizon
      predictionHorizon: params.predictionHorizon ?? 3,           // ticks ahead
      predictionAlpha: params.predictionAlpha ?? 0.3,             // prediction weight

      // φ-constraint sensitivity
      phiViolationPenalty: params.phiViolationPenalty ?? 1.2,     // multiplier
      phiToleranceWindow: params.phiToleranceWindow ?? 0.05,      // ±0.05

      // Smoothing
      smoothingAlpha: params.smoothingAlpha ?? 0.3,               // EMA alpha

      ...params
    };

    // State tracking
    this.state = {
      currentRegime: 'NORMAL',
      previousRegime: 'NORMAL',
      regimeScore: 1.0,
      transitionCount: 0,
      ticksSinceTransition: 0
    };

    // Hysteresis buffers (rolling windows)
    this.buffers = {
      sigmaStar: [],
      sigmaR: [],
      bifurcationRisk: [],
      phiRatio: []
    };

    // Smoothed signals
    this.smoothed = {
      sigmaStar: null,
      bifurcationRisk: null,
      sigmaR: null
    };

    // Prediction state
    this.prediction = {
      expectedSigmaStar: null,
      expectedRisk: null
    };

    console.log("🎯 RegimeClassifier initialized");
    console.log(`   Crisis threshold: Risk > ${(this.params.riskCrisisThreshold * 100).toFixed(0)}%, ΣR < ${this.params.sigmaRCrisisLimit.toFixed(3)}`);
    console.log(`   Normal threshold: Risk < ${(this.params.riskNormalThreshold * 100).toFixed(0)}%, Σ* > ${this.params.sigmaStarRecovery.toFixed(3)}`);
  }

  /**
   * Main classification method - determines current regime
   */
  calculateRegimeState({
    sigmaStar,           // Latent stability from Kalman filter
    sigmaR,              // Observed resolution-adjusted stability
    bifurcationRisk,     // 0-1 probability of bifurcation
    phiRatio             // Golden ratio constraint (optional)
  }) {
    // Update buffers
    this._updateBuffers(sigmaStar, sigmaR, bifurcationRisk, phiRatio);

    // Smooth signals (exponential moving average)
    this._smoothSignals(sigmaStar, bifurcationRisk, sigmaR);

    // Compute predictive layer
    this._computePredictions();

    // Decision logic with hysteresis
    const regimeDecision = this._applyDecisionLogic();

    // Update state tracking
    this._updateState(regimeDecision);

    // Return comprehensive regime information
    return {
      regimeState: this.state.currentRegime,
      regimeScore: this.state.regimeScore,
      confidence: this._computeConfidence(),

      // Averaged signals (for display)
      avgRiskRecent: this._getRecentAverage('bifurcationRisk'),
      avgSigmaStarRecent: this._getRecentAverage('sigmaStar'),
      avgSigmaRRecent: this._getRecentAverage('sigmaR'),

      // Predictions
      expectedSigmaStar: this.prediction.expectedSigmaStar,
      expectedRisk: this.prediction.expectedRisk,

      // Transition metadata
      transitionCount: this.state.transitionCount,
      ticksSinceTransition: this.state.ticksSinceTransition,
      previousRegime: this.state.previousRegime
    };
  }

  /**
   * Update rolling buffers for hysteresis
   */
  _updateBuffers(sigmaStar, sigmaR, bifurcationRisk, phiRatio) {
    const maxLen = this.params.hysteresisWindow * 2; // Keep extra history

    this.buffers.sigmaStar.push(sigmaStar);
    this.buffers.sigmaR.push(sigmaR);
    this.buffers.bifurcationRisk.push(bifurcationRisk);
    if (phiRatio !== undefined) {
      this.buffers.phiRatio.push(phiRatio);
    }

    // Trim to max length
    if (this.buffers.sigmaStar.length > maxLen) this.buffers.sigmaStar.shift();
    if (this.buffers.sigmaR.length > maxLen) this.buffers.sigmaR.shift();
    if (this.buffers.bifurcationRisk.length > maxLen) this.buffers.bifurcationRisk.shift();
    if (this.buffers.phiRatio.length > maxLen) this.buffers.phiRatio.shift();
  }

  /**
   * Exponential moving average smoothing
   */
  _smoothSignals(sigmaStar, bifurcationRisk, sigmaR) {
    const alpha = this.params.smoothingAlpha;

    // Initialize on first call
    if (this.smoothed.sigmaStar === null) {
      this.smoothed.sigmaStar = sigmaStar;
      this.smoothed.bifurcationRisk = bifurcationRisk;
      this.smoothed.sigmaR = sigmaR;
    } else {
      // EMA: S_t = α * x_t + (1 - α) * S_t-1
      this.smoothed.sigmaStar = alpha * sigmaStar + (1 - alpha) * this.smoothed.sigmaStar;
      this.smoothed.bifurcationRisk = alpha * bifurcationRisk + (1 - alpha) * this.smoothed.bifurcationRisk;
      this.smoothed.sigmaR = alpha * sigmaR + (1 - alpha) * this.smoothed.sigmaR;
    }
  }

  /**
   * Compute predictions for next horizon
   */
  _computePredictions() {
    // Simple linear extrapolation for SigmaStar prediction
    if (this.buffers.sigmaStar.length >= 2) {
      const recent = this.buffers.sigmaStar.slice(-3);
      const trend = this._linearTrend(recent);
      this.prediction.expectedSigmaStar = Math.max(0, Math.min(1,
        recent[recent.length - 1] + trend * this.params.predictionHorizon
      ));
    } else {
      this.prediction.expectedSigmaStar = this.smoothed.sigmaStar;
    }

    // Predicted risk based on expected SigmaStar
    // BifurcationRisk = 1 - tanh(k * Σ*)
    const k = 3.0; // sensitivity parameter
    this.prediction.expectedRisk = 1 - Math.tanh(k * this.prediction.expectedSigmaStar);
  }

  /**
   * Compute linear trend from recent samples
   */
  _linearTrend(samples) {
    if (samples.length < 2) return 0;

    const n = samples.length;
    const x = Array.from({length: n}, (_, i) => i);
    const y = samples;

    // Simple linear regression: y = mx + b
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope || 0;
  }

  /**
   * Core decision logic with multi-threshold conditions
   */
  _applyDecisionLogic() {
    const avgRisk = this._getRecentAverage('bifurcationRisk');
    const avgSigmaStar = this._getRecentAverage('sigmaStar');
    const avgSigmaR = this._getRecentAverage('sigmaR');

    const expectedSigmaStar = this.prediction.expectedSigmaStar;
    const expectedRisk = this.prediction.expectedRisk;

    // φ-constraint penalty (if violated, make crisis more sensitive)
    const phiPenalty = this._computePhiPenalty();

    // Adjusted thresholds
    const crisisThreshold = this.params.riskCrisisThreshold * phiPenalty;
    const normalThreshold = this.params.riskNormalThreshold;

    let newRegime = this.state.currentRegime;
    let regimeScore = 0.5; // default

    // === CRISIS Transition Logic ===
    // High risk AND low observed stability AND low latent stability
    const crisisCondition = (
      avgRisk > crisisThreshold &&
      avgSigmaR < this.params.sigmaRCrisisLimit
    ) || (
      // Alternative: predictive crisis
      expectedRisk > 0.8 && avgSigmaStar < this.params.sigmaStarCrisisLimit
    );

    if (crisisCondition) {
      newRegime = 'CRISIS';
      regimeScore = 1 - avgRisk * (1 - avgSigmaStar); // Lower is more crisis
    }

    // === NORMAL Transition Logic ===
    // Sustained low risk AND strong latent recovery
    const normalCondition = (
      avgRisk < normalThreshold &&
      avgSigmaStar > this.params.sigmaStarRecovery
    ) || (
      // Alternative: predictive recovery
      expectedSigmaStar > 0.92 && expectedRisk < 0.25
    );

    if (normalCondition) {
      newRegime = 'NORMAL';
      regimeScore = 1 - avgRisk * (1 - avgSigmaStar); // Higher is more normal
    }

    // === Hysteresis: Maintain regime unless strong evidence ===
    // If neither condition strongly met, keep previous regime
    if (!crisisCondition && !normalCondition) {
      newRegime = this.state.currentRegime;
      regimeScore = this.state.regimeScore; // Preserve score
    }

    return {
      regimeState: newRegime,
      regimeScore: Math.max(0, Math.min(1, regimeScore))
    };
  }

  /**
   * Compute φ-constraint penalty
   * If φ-ratio deviates from target, make transitions more sensitive
   */
  _computePhiPenalty() {
    if (this.buffers.phiRatio.length === 0) return 1.0;

    const PHI_TARGET = 1.618;
    const avgPhiRatio = this._getRecentAverage('phiRatio');
    const phiError = Math.abs(avgPhiRatio - PHI_TARGET);

    if (phiError > this.params.phiToleranceWindow) {
      // Apply penalty: makes crisis threshold lower (more sensitive)
      return 1.0 / this.params.phiViolationPenalty;
    }

    return 1.0; // No penalty
  }

  /**
   * Get recent average from buffer
   */
  _getRecentAverage(bufferName) {
    const buffer = this.buffers[bufferName];
    if (buffer.length === 0) return 0;

    const windowSize = Math.min(this.params.hysteresisWindow, buffer.length);
    const recent = buffer.slice(-windowSize);
    return recent.reduce((sum, val) => sum + val, 0) / recent.length;
  }

  /**
   * Update internal state tracking
   */
  _updateState(regimeDecision) {
    const { regimeState, regimeScore } = regimeDecision;

    // Detect regime transition
    if (regimeState !== this.state.currentRegime) {
      this.state.previousRegime = this.state.currentRegime;
      this.state.currentRegime = regimeState;
      this.state.transitionCount++;
      this.state.ticksSinceTransition = 0;

      console.log(`🎯 Regime transition: ${this.state.previousRegime} → ${regimeState} (transition #${this.state.transitionCount})`);
    } else {
      this.state.ticksSinceTransition++;
    }

    this.state.regimeScore = regimeScore;
  }

  /**
   * Compute confidence in current regime classification
   */
  _computeConfidence() {
    // Confidence increases with:
    // 1. Time since last transition (stability)
    // 2. Consistency of recent signals
    // 3. Distance from threshold boundaries

    const stabilityFactor = Math.min(1.0, this.state.ticksSinceTransition / 10);

    const avgRisk = this._getRecentAverage('bifurcationRisk');
    const avgSigmaStar = this._getRecentAverage('sigmaStar');

    // Distance from decision boundaries
    let boundaryDistance = 0;
    if (this.state.currentRegime === 'CRISIS') {
      // Far from normal threshold = high confidence
      boundaryDistance = Math.max(0, avgRisk - this.params.riskNormalThreshold);
    } else {
      // Far from crisis threshold = high confidence
      boundaryDistance = Math.max(0, this.params.riskCrisisThreshold - avgRisk);
    }
    const boundaryFactor = Math.min(1.0, boundaryDistance * 2);

    // Signal consistency (low variance = high confidence)
    const riskVariance = this._computeVariance('bifurcationRisk');
    const consistencyFactor = 1.0 - Math.min(1.0, riskVariance * 10);

    // Weighted average
    const confidence = 0.4 * stabilityFactor + 0.3 * boundaryFactor + 0.3 * consistencyFactor;

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Compute variance of recent buffer values
   */
  _computeVariance(bufferName) {
    const buffer = this.buffers[bufferName];
    if (buffer.length < 2) return 0;

    const windowSize = Math.min(this.params.hysteresisWindow, buffer.length);
    const recent = buffer.slice(-windowSize);

    const mean = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const variance = recent.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / recent.length;

    return variance;
  }

  /**
   * Get current regime state (simple accessor)
   */
  getCurrentRegime() {
    return this.state.currentRegime;
  }

  /**
   * Get diagnostics for monitoring
   */
  getDiagnostics() {
    return {
      state: this.state,
      smoothed: this.smoothed,
      prediction: this.prediction,
      bufferLengths: {
        sigmaStar: this.buffers.sigmaStar.length,
        bifurcationRisk: this.buffers.bifurcationRisk.length,
        sigmaR: this.buffers.sigmaR.length
      },
      averages: {
        sigmaStar: this._getRecentAverage('sigmaStar'),
        bifurcationRisk: this._getRecentAverage('bifurcationRisk'),
        sigmaR: this._getRecentAverage('sigmaR')
      }
    };
  }

  /**
   * Reset classifier state
   */
  reset() {
    this.state = {
      currentRegime: 'NORMAL',
      previousRegime: 'NORMAL',
      regimeScore: 1.0,
      transitionCount: 0,
      ticksSinceTransition: 0
    };

    this.buffers = {
      sigmaStar: [],
      sigmaR: [],
      bifurcationRisk: [],
      phiRatio: []
    };

    this.smoothed = {
      sigmaStar: null,
      bifurcationRisk: null,
      sigmaR: null
    };

    this.prediction = {
      expectedSigmaStar: null,
      expectedRisk: null
    };

    console.log("🎯 RegimeClassifier reset");
  }
}

console.log("🎯 RegimeClassifier class ready");
