import { KalmanBifurcationFilter } from './kalmanBifurcationFilter_v2.js';
import { FeatureImportanceModule } from './featureImportanceModule.js';

console.log("💰 financialFeatureExtractor.js loaded (V2.0 - UKF + XAI)");

/**
 * Financial Feature Extractor - Sigma_R Framework
 *
 * JavaScript port of the Resolution-Adjusted Stability Theory (Σ_R Framework).
 * Analyzes financial market data and extracts the six universal forces,
 * mapping directly to MMPA's feature structure for visual manifestation.
 *
 * Philosophy:
 * - Markets, like music, are phenomenological instruments
 * - The same visual renderer responds to price volatility and musical intervals
 * - Six forces of stability: Identity, Relationship, Complexity,
 *   Transformation, Alignment/Entropy, Resolution
 *
 * Mathematical Foundation:
 *   Σ_R(t) = (1 / (1/Σ_C(t) + γ·Res(t)))^(1 + ρ·Res(t))
 *
 * Maps Financial Features → MMPA 6-category structure:
 * - IDENTITY: Price Change (ΔP, log returns)
 * - RELATIONSHIP: Volume Imbalance
 * - COMPLEXITY: Hurst Exponent (memory/persistence)
 * - TRANSFORMATION: Volatility Regime Shift
 * - ALIGNMENT: Autocorrelation (entropy)
 * - POTENTIAL: Expected Shortfall (tail risk)
 * - RESOLUTION: Sigma_R (final stability metric)
 */

/**
 * FinancialFeatureExtractor Class
 *
 * Maintains state and computes running financial metrics compatible with MMPA.
 */
export class FinancialFeatureExtractor {
  constructor(config = {}) {
    // Parameters (defaults match Python implementation)
    this.params = {
      kappa: 1.0,              // Complexity price modulation
      lambda: 1.0,             // Complexity volume modulation
      z: 0.8,                  // Entropy damping
      eta: 1.0,                // Transformation additive
      mu: 0.5,                 // Transformation exponent
      gamma_ent: 1.0,          // Entropy additive
      gamma: 0.5,              // Resolution additive
      rho: 1.0,                // Resolution exponent
      trans_span: 5,           // EWMA span (days)
      res_span: 10,
      ent_span: 20,
      hurst_span: 40,
      hurst_window: 60,        // R/S window
      short_vol_window: 10,    // Short-term volatility
      long_vol_window: 60,     // Long-term volatility
      es_quantile: 0.05,       // 95% VaR
      epsilon: 1e-8,           // Division safety
      ...config
    };

    // State: Historical data
    this.state = {
      priceHistory: [],         // Array of prices
      volumeHistory: [],        // Array of volumes
      returnsHistory: [],       // Array of log returns
      timestampHistory: [],     // Array of timestamps

      // EWMA states (alpha = 2 / (span + 1))
      ewma: {
        trans_sm: null,
        res_sm: null,
        ent_sm: null,
        hurst_sm: null
      },

      // Last computed features
      lastFeatures: this._getDefaultFeatures()
    };

    // Phase 13.28 V2.0: Kalman Filter for Bifurcation Prediction (Σ*)
    this.kalmanFilter = new KalmanBifurcationFilter({
      filterType: config.filterType || 'UKF',  // Default to UKF
      initialState: 0.99,        // Start very stable
      phiRegWeight: config.phiRegWeight !== undefined ? config.phiRegWeight : 0.1  // φ-regularization weight (0.0-1.0)
    });

    // Phase 13.31: Feature Importance Module (XAI transparency)
    // FIM will use default weights (delta_p: 2.0, vol_stress: 1.5, H: 1.0, entropy: 1.2)
    // unless custom weights are provided via config.sigmaC_weights
    this.featureImportanceModule = new FeatureImportanceModule({
      sigmaC_weights: config.sigmaC_weights
    });

    console.log("💰 FinancialFeatureExtractor V2.0 initialized");
    console.log(`   Filter Type: ${this.kalmanFilter.filterType}`);
    console.log(`   φ-Regularization: ${this.kalmanFilter.phiRegWeight.toFixed(3)}`);
  }

  /**
   * Default MMPA-compatible feature structure
   */
  _getDefaultFeatures() {
    return {
      timestamp: Date.now(),
      signal: {
        source: 'financial',
        dataPoints: 0
      },
      features: {
        identity: {
          fundamentalFreq: 0.0,      // Scaled returns
          strength: 0.5
        },
        relationship: {
          consonance: 0.5,           // 1 - |vol_imbalance|
          complexity: 0.5            // Hurst exponent
        },
        complexity: {
          brightness: 0.5,           // Hurst exponent
          centroid: 1000.0,          // Scaled sigma_long
          bandwidth: 1000.0          // Scaled sigma_short
        },
        transformation: {
          flux: 0.0,                 // Smoothed transformation
          velocity: 0.0,             // Raw transformation
          acceleration: 0.0
        },
        alignment: {
          coherence: 0.5,            // 1 - entropy
          stability: 0.5,            // Sigma_C
          synchrony: 0.5             // Sigma_R
        },
        potential: {
          entropy: 0.5,              // Autocorrelation residual
          unpredictability: 0.0,     // Resolution ratio
          freedom: 0.5               // 1 - Sigma_R
        },
        resolution: {
          sigma_C: 0.5,              // Core stability
          sigma_R: 0.5,              // Resolution-adjusted stability
          res_ratio: 0.0             // ES / vol ratio
        }
      }
    };
  }

  /**
   * Update with new price/volume tick
   *
   * @param {number} price - Current price
   * @param {number} volume - Current volume (optional)
   * @param {number} timestamp - Unix timestamp (optional, defaults to now)
   */
  update(price, volume = null, timestamp = null) {
    const ts = timestamp || Date.now();

    // Add to history
    this.state.priceHistory.push(price);
    this.state.volumeHistory.push(volume);
    this.state.timestampHistory.push(ts);

    // Compute returns if we have at least 2 prices
    if (this.state.priceHistory.length >= 2) {
      const prevPrice = this.state.priceHistory[this.state.priceHistory.length - 2];
      const logReturn = Math.log(price / prevPrice);
      this.state.returnsHistory.push(logReturn);
    } else {
      this.state.returnsHistory.push(0.0);
    }

    // Limit history to reasonable size (e.g., 200 data points)
    const maxHistory = 200;
    if (this.state.priceHistory.length > maxHistory) {
      this.state.priceHistory.shift();
      this.state.volumeHistory.shift();
      this.state.returnsHistory.shift();
      this.state.timestampHistory.shift();
    }

    // Recompute features
    this.state.lastFeatures = this._computeFeatures();

    return this.state.lastFeatures;
  }

  /**
   * Get current features without updating
   */
  getFeatures() {
    return this.state.lastFeatures;
  }

  /**
   * Core computation: All six forces + Sigma_R
   */
  _computeFeatures() {
    const features = this._getDefaultFeatures();
    features.timestamp = Date.now();
    features.signal.dataPoints = this.state.priceHistory.length;

    // Need at least minimum data for meaningful calculations
    if (this.state.returnsHistory.length < 20) {
      return features;  // Return defaults
    }

    const returns = this.state.returnsHistory;
    const volumes = this.state.volumeHistory;
    const eps = this.params.epsilon;

    // =====================================================================
    // 1. IDENTITY - Price Change (returns)
    // =====================================================================
    const latestReturn = returns[returns.length - 1];
    features.features.identity.fundamentalFreq = latestReturn * 1000;  // Scale for visualization
    features.features.identity.strength = Math.min(Math.abs(latestReturn), 1.0);

    // =====================================================================
    // 2. Realized Volatility (short and long)
    // =====================================================================
    const sigma_short = this._rollingStd(returns, this.params.short_vol_window);
    const sigma_long = Math.max(this._rollingStd(returns, this.params.long_vol_window), eps);

    // =====================================================================
    // 3. TRANSFORMATION - Volatility Regime Shift
    // =====================================================================
    const trans_raw = (sigma_short - sigma_long) / sigma_long;
    const trans_mag = Math.min(Math.abs(trans_raw), 10.0);
    const trans_compressed = Math.log1p(trans_mag);  // log(1 + x)

    // EWMA smoothing
    const trans_sm = this._updateEWMA('trans_sm', trans_compressed, this.params.trans_span);

    features.features.transformation.flux = trans_sm;
    features.features.transformation.velocity = Math.max(-1, Math.min(1, trans_raw));

    // =====================================================================
    // 4. COMPLEXITY - Hurst Exponent (memory/persistence)
    // =====================================================================
    const hurst_raw = this._estimateHurst(returns, this.params.hurst_window);
    const hurst = this._updateEWMA('hurst_sm', hurst_raw, this.params.hurst_span);
    const hurst_clipped = Math.max(0.01, Math.min(0.99, hurst));

    features.features.complexity.brightness = hurst_clipped;
    features.features.complexity.centroid = sigma_long * 1000;  // Scale
    features.features.complexity.bandwidth = sigma_short * 1000;
    features.features.relationship.complexity = hurst_clipped;

    // =====================================================================
    // 5. ALIGNMENT/ENTROPY - Autocorrelation Residual
    // =====================================================================
    const rho1 = this._autocorrelation(returns, 1, 20);
    const ent_raw = 1 - Math.abs(rho1);
    const ent_sm = this._updateEWMA('ent_sm', ent_raw, this.params.ent_span);
    const ent_clipped = Math.max(0, Math.min(1, ent_sm));

    features.features.potential.entropy = ent_clipped;
    features.features.alignment.coherence = 1 - ent_clipped;

    // =====================================================================
    // 6. RELATIONSHIP - Volume Imbalance
    // =====================================================================
    let vol_imbalance = 0.0;
    if (volumes[0] !== null && volumes.length >= 20) {
      const vol_ma = this._rollingMean(volumes, 20);
      vol_imbalance = (volumes[volumes.length - 1] - vol_ma) / (vol_ma + eps);
      vol_imbalance = Math.max(-5, Math.min(5, vol_imbalance));  // Clip
    }

    features.features.relationship.consonance = Math.max(0, Math.min(1, 1 - Math.abs(vol_imbalance) / 5));

    // =====================================================================
    // 7. RESOLUTION - Expected Shortfall (tail risk)
    // =====================================================================
    const es = this._computeExpectedShortfall(returns, this.params.long_vol_window, this.params.es_quantile);
    const res_raw = es / (sigma_long + eps);
    const res_mag = Math.min(res_raw, 10.0);
    const res_compressed = Math.log1p(res_mag);
    const res_sm = this._updateEWMA('res_sm', res_compressed, this.params.res_span);

    features.features.potential.unpredictability = res_sm;
    features.features.resolution.res_ratio = res_sm;

    // =====================================================================
    // 8. CORE STABILITY (Σ_C)
    // =====================================================================
    const H_centered = hurst_clipped - 0.5;
    const ent_damped = 1 - this.params.z * ent_clipped;

    const alpha_eff = 1 + this.params.kappa * H_centered * ent_damped;
    const beta_eff = 1 + this.params.lambda * H_centered * ent_damped;

    // Systemic stress
    const D = 1
      + alpha_eff * (latestReturn ** 2)
      + beta_eff * (vol_imbalance ** 2)
      + this.params.eta * trans_sm
      + this.params.gamma_ent * ent_clipped;

    // Core stability
    const exponent = 1 + this.params.mu * trans_sm;
    const sigma_C = Math.pow(1 / D, exponent);
    const sigma_C_clipped = Math.max(1e-12, Math.min(1.0, sigma_C));

    features.features.alignment.stability = sigma_C_clipped;
    features.features.resolution.sigma_C = sigma_C_clipped;

    // =====================================================================
    // 9. RESOLUTION-ADJUSTED STABILITY (Σ_R)
    // =====================================================================
    const inv_sigma_C = 1 / (sigma_C_clipped + eps);
    const res_adjusted_inv = inv_sigma_C + this.params.gamma * res_sm;
    const res_exponent = 1 + this.params.rho * res_sm;

    const sigma_R = Math.pow(1 / res_adjusted_inv, res_exponent);
    const sigma_R_clipped = Math.max(1e-12, Math.min(1.0, sigma_R));

    features.features.alignment.synchrony = sigma_R_clipped;
    features.features.resolution.sigma_R = sigma_R_clipped;
    features.features.potential.freedom = 1 - sigma_R_clipped;

    // =====================================================================
    // 10. LATENT STABILITY STATE (Σ*) - BIFURCATION PREDICTION
    // Phase 13.28: Kalman Filter for regime change prediction
    // =====================================================================
    // Control inputs: u_t = [Trans_sm, Res]
    const u_t = [trans_sm, res_sm];

    // Observation: y_t = Σ_C (core stability)
    const y_t = sigma_C_clipped;

    // Run Kalman filter prediction-update cycle
    const bifurcation = this.kalmanFilter.step(u_t, y_t);

    // Add bifurcation predictions to features
    features.features.resolution.sigma_star = bifurcation.sigma_star;  // Latent state
    features.features.resolution.bifurcation_risk = bifurcation.bifurcation_risk;  // Risk metric
    features.features.resolution.kalman_innovation = bifurcation.innovation;  // Prediction error
    features.features.resolution.kalman_confidence = bifurcation.confidence;  // State certainty

    // Get φ-ratio for monitoring golden ratio constraint
    features.features.resolution.phi_ratio = this.kalmanFilter.getPhiRatio();

    // =====================================================================
    // 11. FEATURE IMPORTANCE (XAI) - Phase 13.31
    // Decompose total instability into 6-force contributions
    // =====================================================================
    const sigmaC_inputs = {
      delta_p: latestReturn,
      vol_stress: vol_imbalance,
      H: hurst_clipped - 0.5,  // Centered (deviation from 0.5)
      entropy: ent_clipped
    };

    const latent_inputs = [trans_sm, res_sm];

    const kalman_matrices = {
      B: this.kalmanFilter.B
    };

    const xai = this.featureImportanceModule.calculateFeatureImportance(
      sigmaC_inputs,
      latent_inputs,
      kalman_matrices
    );

    // Add XAI breakdown to features for HUD display
    features.xai = xai;

    return features;
  }

  // =====================================================================
  // Helper Methods - Statistical Functions
  // =====================================================================

  /**
   * Rolling mean
   */
  _rollingMean(arr, window) {
    if (arr.length < window) return arr.reduce((a, b) => a + b, 0) / arr.length;

    const slice = arr.slice(-window);
    return slice.reduce((a, b) => a + b, 0) / window;
  }

  /**
   * Rolling standard deviation
   */
  _rollingStd(arr, window) {
    if (arr.length < 2) return 0.0;

    const slice = arr.length >= window ? arr.slice(-window) : arr;
    const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
    const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / slice.length;

    return Math.sqrt(variance);
  }

  /**
   * Exponentially weighted moving average (EWMA)
   * alpha = 2 / (span + 1)
   */
  _updateEWMA(key, newValue, span) {
    const alpha = 2 / (span + 1);

    if (this.state.ewma[key] === null) {
      this.state.ewma[key] = newValue;
    } else {
      this.state.ewma[key] = alpha * newValue + (1 - alpha) * this.state.ewma[key];
    }

    return this.state.ewma[key];
  }

  /**
   * Estimate Hurst exponent using R/S analysis
   * H > 0.5: persistent (trending)
   * H < 0.5: anti-persistent (mean-reverting)
   * H = 0.5: random walk
   */
  _estimateHurst(returns, window) {
    if (returns.length < window) {
      return 0.5;  // Neutral default
    }

    try {
      const slice = returns.slice(-window);
      const mean = slice.reduce((a, b) => a + b, 0) / slice.length;

      // Cumulative deviation from mean
      let cumsum = 0;
      const Y = slice.map(r => {
        cumsum += (r - mean);
        return cumsum;
      });

      // Range
      const R = Math.max(...Y) - Math.min(...Y);

      // Standard deviation
      const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / slice.length;
      const S = Math.sqrt(variance);

      if (S === 0 || R === 0) {
        return 0.5;
      }

      // R/S ratio
      const rs = R / S;

      // Hurst estimate: H ≈ log(R/S) / log(n/2)
      const H = Math.log(rs) / Math.log(window / 2);

      // Clip to valid range
      return Math.max(0.01, Math.min(0.99, H));
    } catch (e) {
      return 0.5;
    }
  }

  /**
   * Compute autocorrelation at given lag
   */
  _autocorrelation(arr, lag, window) {
    if (arr.length < lag + window) {
      return 0.0;
    }

    const slice = arr.slice(-window);
    const mean = slice.reduce((a, b) => a + b, 0) / slice.length;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < slice.length - lag; i++) {
      numerator += (slice[i] - mean) * (slice[i + lag] - mean);
    }

    for (let i = 0; i < slice.length; i++) {
      denominator += (slice[i] - mean) ** 2;
    }

    if (denominator === 0) return 0.0;

    return numerator / denominator;
  }

  /**
   * Compute Expected Shortfall (CVaR)
   * Average of worst losses beyond VaR threshold
   */
  _computeExpectedShortfall(returns, window, quantile) {
    if (returns.length < window) {
      return 0.0;
    }

    const slice = returns.slice(-window);

    // Sort to find VaR threshold
    const sorted = [...slice].sort((a, b) => a - b);
    const varIndex = Math.floor(quantile * sorted.length);
    const varThreshold = sorted[varIndex];

    // Mean of returns below VaR
    const tailLosses = slice.filter(r => r <= varThreshold);

    if (tailLosses.length === 0) {
      return 0.0;
    }

    const es = tailLosses.reduce((a, b) => a + b, 0) / tailLosses.length;

    // Return absolute value (positive ES for losses)
    return Math.abs(es);
  }

  /**
   * Reset state (useful for switching assets or testing)
   */
  reset() {
    this.state.priceHistory = [];
    this.state.volumeHistory = [];
    this.state.returnsHistory = [];
    this.state.timestampHistory = [];
    this.state.ewma = {
      trans_sm: null,
      res_sm: null,
      ent_sm: null,
      hurst_sm: null
    };
    this.state.lastFeatures = this._getDefaultFeatures();

    console.log("💰 Financial extractor state reset");
  }

  /**
   * Load historical data in bulk (for backtesting or initial state)
   * @param {Array} priceData - Array of {price, volume, timestamp} objects
   */
  loadHistoricalData(priceData) {
    this.reset();

    priceData.forEach(point => {
      this.update(point.price, point.volume || null, point.timestamp || null);
    });

    console.log(`💰 Loaded ${priceData.length} historical data points`);
    return this.state.lastFeatures;
  }

  /**
   * Get current state summary (for debugging)
   */
  getStateSummary() {
    return {
      dataPoints: this.state.priceHistory.length,
      latestPrice: this.state.priceHistory[this.state.priceHistory.length - 1],
      latestReturn: this.state.returnsHistory[this.state.returnsHistory.length - 1],
      sigma_R: this.state.lastFeatures.features.resolution.sigma_R,
      sigma_C: this.state.lastFeatures.features.resolution.sigma_C,
      hurst: this.state.lastFeatures.features.complexity.brightness
    };
  }
}

// =====================================================================
// Module Exports
// =====================================================================

// Singleton instance (optional, for convenience)
let defaultExtractor = null;

export function getFinancialExtractor(config = null) {
  if (!defaultExtractor || config) {
    defaultExtractor = new FinancialFeatureExtractor(config || {});
  }
  return defaultExtractor;
}

export function resetFinancialExtractor() {
  if (defaultExtractor) {
    defaultExtractor.reset();
  }
}

console.log("💰 Financial Feature Extractor module ready");
