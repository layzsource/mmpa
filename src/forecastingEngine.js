/**
 * Phase 13.30: Predictive Forecasting Engine
 *
 * Transforms the reactive Kalman filter into a predictive system:
 * 1. Multi-step ahead forecasting: x_t+τ|t = A^τ * x_t
 * 2. Probabilistic crisis forecast over horizon window
 * 3. Empirical validation metrics (precision, recall, lead time)
 * 4. Alert system for predicted regime changes
 * 5. Historical replay for backtesting
 *
 * Key Innovation: Predicts bifurcation BEFORE observable in Σ_R
 */

console.log("🔮 forecastingEngine.js loaded");

export class ForecastingEngine {
  constructor(kalmanFilter, params = {}) {
    this.kalman = kalmanFilter;

    // Forecasting parameters
    this.params = {
      forecastHorizon: params.forecastHorizon ?? 24,        // Look ahead 24 ticks
      crisisThreshold: params.crisisThreshold ?? 0.70,      // 70% risk = crisis
      alertThreshold: params.alertThreshold ?? 0.65,        // 65% = warning
      validationWindow: params.validationWindow ?? 100,     // Samples for metrics
      leadTimeMax: params.leadTimeMax ?? 50,                // Max lead time to track
      ...params
    };

    // Forecast state
    this.forecast = {
      sigmaStar: [],          // Predicted Σ* for next τ steps
      bifurcationRisk: [],    // Predicted risk for next τ steps
      crisisProbability: 0,   // P(crisis in next τ steps)
      expectedLeadTime: 0,    // Expected ticks until crisis
      confidence: 0           // Forecast confidence
    };

    // Alert tracking
    this.alerts = {
      active: false,
      type: null,             // 'WARNING' or 'CRISIS'
      issuedAt: null,
      forecastedCrisisTime: null,
      message: ''
    };

    // Validation metrics
    this.validation = {
      history: [],            // { predicted, actual, leadTime, timestamp }
      truePositives: 0,
      falsePositives: 0,
      trueNegatives: 0,
      falseNegatives: 0,
      leadTimes: [],          // Successful prediction lead times
      lastCrisisActual: null,
      lastCrisisPredicted: null
    };

    // Historical replay buffer
    this.replayBuffer = {
      ticks: [],
      features: [],
      regimes: [],
      maxLength: 1000         // Keep last 1000 ticks
    };

    console.log("🔮 ForecastingEngine initialized");
    console.log(`   Forecast horizon: ${this.params.forecastHorizon} ticks`);
    console.log(`   Crisis threshold: ${(this.params.crisisThreshold * 100).toFixed(0)}%`);
  }

  /**
   * Generate multi-step forecast
   * x_t+τ|t = A^τ * x_t
   */
  generateForecast(currentSigmaStar, currentInputs) {
    const horizon = this.params.forecastHorizon;
    const A = this.kalman.A;
    const B = this.kalman.B;

    this.forecast.sigmaStar = [];
    this.forecast.bifurcationRisk = [];

    let state = currentSigmaStar;

    for (let tau = 1; tau <= horizon; tau++) {
      // Multi-step state projection: x_t+τ = A^τ * x_t + (sum of control inputs)
      // Simplified: assume inputs decay/stabilize over horizon
      const inputDecay = Math.exp(-tau / 10); // Exponential decay
      const [trans_sm, res_sm] = currentInputs;

      const controlEffect = (B[0] * trans_sm + B[1] * res_sm) * inputDecay;
      state = A * state + controlEffect;

      // Clamp to [0, 1]
      state = Math.max(0, Math.min(1, state));

      this.forecast.sigmaStar.push(state);

      // Compute bifurcation risk: BifurcationRisk = 1 - tanh(k * Σ*)
      const k = 3.0;
      const risk = 1 - Math.tanh(k * state);
      this.forecast.bifurcationRisk.push(risk);
    }

    // Compute crisis probability over horizon
    this._computeCrisisProbability();

    // Compute expected lead time
    this._computeExpectedLeadTime();

    // Update confidence based on Kalman uncertainty
    this.forecast.confidence = 1 - this.kalman.P;

    // Check for alert conditions
    this._evaluateAlerts();
  }

  /**
   * Compute P(crisis in next τ steps)
   */
  _computeCrisisProbability() {
    const risks = this.forecast.bifurcationRisk;
    if (risks.length === 0) {
      this.forecast.crisisProbability = 0;
      return;
    }

    // Max risk over horizon (worst case)
    const maxRisk = Math.max(...risks);

    // Average risk (expected case)
    const avgRisk = risks.reduce((sum, r) => sum + r, 0) / risks.length;

    // Weighted: 70% max, 30% avg (conservative bias)
    this.forecast.crisisProbability = 0.7 * maxRisk + 0.3 * avgRisk;
  }

  /**
   * Compute expected ticks until crisis
   */
  _computeExpectedLeadTime() {
    const risks = this.forecast.bifurcationRisk;
    const threshold = this.params.crisisThreshold;

    // Find first tick where risk exceeds threshold
    const crisisTick = risks.findIndex(r => r > threshold);

    if (crisisTick === -1) {
      this.forecast.expectedLeadTime = this.params.forecastHorizon; // Beyond horizon
    } else {
      this.forecast.expectedLeadTime = crisisTick + 1; // +1 for next tick
    }
  }

  /**
   * Evaluate alert conditions
   */
  _evaluateAlerts() {
    const crisisProb = this.forecast.crisisProbability;
    const leadTime = this.forecast.expectedLeadTime;

    // Clear alert if risk has subsided
    if (crisisProb < this.params.alertThreshold * 0.8) {
      if (this.alerts.active) {
        console.log("🔮 Alert cleared - risk subsided");
      }
      this.alerts.active = false;
      this.alerts.type = null;
      return;
    }

    // Issue CRISIS alert
    if (crisisProb >= this.params.crisisThreshold && !this.alerts.active) {
      this.alerts.active = true;
      this.alerts.type = 'CRISIS';
      this.alerts.issuedAt = Date.now();
      this.alerts.forecastedCrisisTime = leadTime;
      this.alerts.message = `CRISIS PREDICTED in ${leadTime} ticks (${(crisisProb * 100).toFixed(0)}% probability)`;

      console.log(`🚨 ${this.alerts.message}`);
    }

    // Issue WARNING alert
    else if (crisisProb >= this.params.alertThreshold && !this.alerts.active) {
      this.alerts.active = true;
      this.alerts.type = 'WARNING';
      this.alerts.issuedAt = Date.now();
      this.alerts.forecastedCrisisTime = leadTime;
      this.alerts.message = `Crisis WARNING - risk rising (${(crisisProb * 100).toFixed(0)}% in ${leadTime} ticks)`;

      console.log(`⚠️  ${this.alerts.message}`);
    }
  }

  /**
   * Record actual regime state for validation
   */
  recordActual(actualRegime, currentTick, features) {
    const isCrisis = (actualRegime === 'CRISIS');

    // Store in replay buffer
    this.replayBuffer.ticks.push(currentTick);
    this.replayBuffer.features.push(features);
    this.replayBuffer.regimes.push(actualRegime);

    // Trim buffer
    if (this.replayBuffer.ticks.length > this.replayBuffer.maxLength) {
      this.replayBuffer.ticks.shift();
      this.replayBuffer.features.shift();
      this.replayBuffer.regimes.shift();
    }

    // Validation logic: Did we predict this correctly?
    if (this.alerts.active && isCrisis) {
      // TRUE POSITIVE: We predicted crisis and it happened
      const leadTime = this.alerts.forecastedCrisisTime;

      this.validation.truePositives++;
      this.validation.leadTimes.push(leadTime);
      this.validation.lastCrisisPredicted = Date.now();

      this.validation.history.push({
        predicted: true,
        actual: true,
        leadTime: leadTime,
        timestamp: Date.now(),
        type: 'TP'
      });

      console.log(`✅ PREDICTION SUCCESS - Lead time: ${leadTime} ticks`);

      // Clear alert after validation
      this.alerts.active = false;
    }
    else if (this.alerts.active && !isCrisis) {
      // Still waiting or FALSE POSITIVE (if too long)
      const ticksSinceAlert = Date.now() - this.alerts.issuedAt;
      const maxWaitMs = this.params.forecastHorizon * 1000; // Assume 1 tick = 1 second

      if (ticksSinceAlert > maxWaitMs) {
        // FALSE POSITIVE: Predicted crisis but it didn't happen
        this.validation.falsePositives++;

        this.validation.history.push({
          predicted: true,
          actual: false,
          leadTime: null,
          timestamp: Date.now(),
          type: 'FP'
        });

        console.log(`❌ FALSE POSITIVE - Crisis did not materialize`);

        // Clear alert
        this.alerts.active = false;
      }
    }
    else if (!this.alerts.active && isCrisis) {
      // FALSE NEGATIVE: Crisis happened but we didn't predict it
      this.validation.falseNegatives++;

      this.validation.history.push({
        predicted: false,
        actual: true,
        leadTime: null,
        timestamp: Date.now(),
        type: 'FN'
      });

      console.log(`⚠️  FALSE NEGATIVE - Missed crisis prediction`);
    }
    else {
      // TRUE NEGATIVE: No prediction, no crisis
      this.validation.trueNegatives++;
    }

    // Track crisis state changes
    if (isCrisis && this.validation.lastCrisisActual !== isCrisis) {
      this.validation.lastCrisisActual = Date.now();
    }

    // Trim history
    if (this.validation.history.length > this.params.validationWindow) {
      this.validation.history.shift();
    }
  }

  /**
   * Compute validation metrics
   */
  getValidationMetrics() {
    const tp = this.validation.truePositives;
    const fp = this.validation.falsePositives;
    const tn = this.validation.trueNegatives;
    const fn = this.validation.falseNegatives;

    const total = tp + fp + tn + fn;
    if (total === 0) {
      return {
        precision: 0,
        recall: 0,
        accuracy: 0,
        f1Score: 0,
        avgLeadTime: 0,
        leadTimeStdDev: 0
      };
    }

    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const accuracy = (tp + tn) / total;
    const f1Score = precision + recall > 0 ? 2 * (precision * recall) / (precision + recall) : 0;

    // Lead time statistics
    const leadTimes = this.validation.leadTimes;
    const avgLeadTime = leadTimes.length > 0
      ? leadTimes.reduce((sum, t) => sum + t, 0) / leadTimes.length
      : 0;

    const leadTimeVariance = leadTimes.length > 1
      ? leadTimes.reduce((sum, t) => sum + Math.pow(t - avgLeadTime, 2), 0) / leadTimes.length
      : 0;
    const leadTimeStdDev = Math.sqrt(leadTimeVariance);

    return {
      precision,
      recall,
      accuracy,
      f1Score,
      avgLeadTime,
      leadTimeStdDev,
      truePositives: tp,
      falsePositives: fp,
      trueNegatives: tn,
      falseNegatives: fn,
      totalPredictions: total
    };
  }

  /**
   * Get current forecast
   */
  getForecast() {
    return {
      ...this.forecast,
      alert: this.alerts.active ? this.alerts : null
    };
  }

  /**
   * Get alert state
   */
  getAlert() {
    return this.alerts.active ? this.alerts : null;
  }

  /**
   * Historical replay for backtesting
   * Replays stored data to measure prediction accuracy
   */
  runBacktest(startIndex = 0, endIndex = null) {
    if (this.replayBuffer.ticks.length === 0) {
      console.warn("🔮 No replay data available for backtest");
      return null;
    }

    const end = endIndex || this.replayBuffer.ticks.length;
    const testResults = [];

    console.log(`🔮 Running backtest on ${end - startIndex} samples...`);

    for (let i = startIndex; i < end; i++) {
      const features = this.replayBuffer.features[i];
      const actualRegime = this.replayBuffer.regimes[i];

      // Generate forecast from this point
      const sigmaStar = features.features.resolution.sigma_star;
      const inputs = [
        features.features.transformation.flux,
        features.features.resolution.sigma_R
      ];

      this.generateForecast(sigmaStar, inputs);

      // Look ahead to see if crisis actually occurred
      let crisisOccurred = false;
      let actualLeadTime = null;

      for (let j = 1; j <= this.params.forecastHorizon && i + j < end; j++) {
        if (this.replayBuffer.regimes[i + j] === 'CRISIS') {
          crisisOccurred = true;
          actualLeadTime = j;
          break;
        }
      }

      const predicted = this.forecast.crisisProbability > this.params.crisisThreshold;

      testResults.push({
        index: i,
        predicted,
        actual: crisisOccurred,
        predictedProb: this.forecast.crisisProbability,
        actualLeadTime,
        predictedLeadTime: this.forecast.expectedLeadTime
      });
    }

    // Compute backtest metrics
    const tp = testResults.filter(r => r.predicted && r.actual).length;
    const fp = testResults.filter(r => r.predicted && !r.actual).length;
    const tn = testResults.filter(r => !r.predicted && !r.actual).length;
    const fn = testResults.filter(r => !r.predicted && r.actual).length;

    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const accuracy = (tp + tn) / testResults.length;

    console.log(`🔮 Backtest complete:`);
    console.log(`   Precision: ${(precision * 100).toFixed(1)}%`);
    console.log(`   Recall: ${(recall * 100).toFixed(1)}%`);
    console.log(`   Accuracy: ${(accuracy * 100).toFixed(1)}%`);

    return {
      results: testResults,
      metrics: { precision, recall, accuracy, tp, fp, tn, fn }
    };
  }

  /**
   * Reset validation state
   */
  resetValidation() {
    this.validation = {
      history: [],
      truePositives: 0,
      falsePositives: 0,
      trueNegatives: 0,
      falseNegatives: 0,
      leadTimes: [],
      lastCrisisActual: null,
      lastCrisisPredicted: null
    };
    console.log("🔮 Validation metrics reset");
  }

  /**
   * Export replay buffer for external analysis
   */
  exportReplayBuffer() {
    return {
      ticks: [...this.replayBuffer.ticks],
      features: [...this.replayBuffer.features],
      regimes: [...this.replayBuffer.regimes]
    };
  }
}

console.log("🔮 ForecastingEngine class ready");
