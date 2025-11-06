/**
 * ANLG.js - Adaptive Noise and Latency Governor
 *
 * Phase 1: Dynamic UKF Covariance Scaling + Cancellation Logic
 * Phase 2: VCN/AI Data Throttling + Finite Memory Bound Telemetry
 *
 * Philosophy:
 * - Adapt measurement trust based on signal quality (STE/ZCR)
 * - Enforce cancellation logic in LQR control
 * - Gate expensive VCN/AI operations based on stability metrics
 * - Quantify performance gap (J_optimal / J_bound)
 *
 * Integration Points:
 * - Receives: Audio features (RMS, ZCR) from realFeatureExtractor
 * - Modifies: UKF R matrix dynamically (via audioMMPABridge)
 * - Controls: LQR cancellation logic (via mmpaControlSystem)
 * - Gates: VCN/AI data transmission based on Σ*
 */

console.log("🎛️ anlg.js loaded - Adaptive Noise and Latency Governor");

export class ANLG {
  constructor(options = {}) {
    // === Phase 1: Adaptive Covariance Configuration ===
    this.R_base = options.R_base || 0.005;  // Base measurement noise (from audioMMPABridge)
    this.R_min = options.R_min || 0.001;    // Min R (high trust in clean signal)
    this.R_max = options.R_max || 0.05;     // Max R (low trust in noisy signal)

    // Signal quality thresholds
    this.STE_low = options.STE_low || 0.01;   // Below this = too quiet (distrust)
    this.STE_high = options.STE_high || 0.5;  // Above this = good signal (trust)
    this.ZCR_low = options.ZCR_low || 10;     // Below this = tonal (trust)
    this.ZCR_high = options.ZCR_high || 100;  // Above this = noisy (distrust)

    // === Phase 1: Cancellation Logic Configuration ===
    this.cancellation_threshold = options.cancellation_threshold || 0.0;
    this.cancellation_gain = options.cancellation_gain || 0.5;

    // === Phase 2: Data Throttling Configuration ===
    this.throttle_enabled = options.throttle_enabled || true;
    this.Sigma_stable_threshold = options.Sigma_stable_threshold || 0.80;  // Above = stable (send less)
    this.Sigma_unstable_threshold = options.Sigma_unstable_threshold || 0.60;  // Below = unstable (send more)

    // Throttle rates (Hz)
    this.rate_stable = options.rate_stable || 1.0;      // 1 Hz when stable
    this.rate_unstable = options.rate_unstable || 10.0;  // 10 Hz when unstable
    this.rate_chaotic = options.rate_chaotic || 30.0;    // 30 Hz when chaotic

    // === Phase 2: Finite Memory Bound Telemetry ===
    this.track_performance_gap = options.track_performance_gap || true;
    this.J_optimal_history = [];  // Actual cost
    this.J_bound_history = [];    // Theoretical bound
    this.max_history = 300;       // 5 seconds at 60fps

    // === State ===
    this.current_R = this.R_base;
    this.current_throttle_rate = this.rate_stable;
    this.last_data_send_time = 0;
    this.signal_quality = 0.5;  // 0-1 scale

    // === Statistics ===
    this.stats = {
      R_adaptations: 0,
      cancellations_applied: 0,
      data_packets_sent: 0,
      data_packets_throttled: 0,
      avg_signal_quality: 0.5,
      avg_performance_gap: 1.0  // J_opt / J_bound
    };

    console.log("🎛️ ANLG initialized");
    console.log(`   R range: [${this.R_min}, ${this.R_max}] (base: ${this.R_base})`);
    console.log(`   Throttle rates: ${this.rate_stable}Hz (stable), ${this.rate_unstable}Hz (unstable), ${this.rate_chaotic}Hz (chaotic)`);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 1: ADAPTIVE COVARIANCE SCALING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Calculate adaptive measurement covariance R based on signal quality
   *
   * Theory:
   * - Clean, tonal signals (high STE, low ZCR) → low R (trust measurements)
   * - Noisy, chaotic signals (low STE, high ZCR) → high R (distrust measurements)
   *
   * @param {number} STE - Short-Time Energy (RMS) from audio, typically 0-1
   * @param {number} ZCR - Zero-Crossing Rate from audio, typically 0-200
   * @returns {number} Adaptive R value for UKF
   */
  calculateAdaptiveCovariance(STE, ZCR) {
    // Normalize STE to quality score (0 = bad, 1 = good)
    let STE_quality = 0;
    if (STE < this.STE_low) {
      STE_quality = 0;  // Too quiet = no trust
    } else if (STE >= this.STE_high) {
      STE_quality = 1;  // Good signal = full trust
    } else {
      // Linear interpolation
      STE_quality = (STE - this.STE_low) / (this.STE_high - this.STE_low);
    }

    // Normalize ZCR to quality score (0 = bad, 1 = good)
    let ZCR_quality = 0;
    if (ZCR <= this.ZCR_low) {
      ZCR_quality = 1;  // Tonal = full trust
    } else if (ZCR >= this.ZCR_high) {
      ZCR_quality = 0;  // Noisy = no trust
    } else {
      // Linear interpolation (inverted)
      ZCR_quality = 1 - ((ZCR - this.ZCR_low) / (this.ZCR_high - this.ZCR_low));
    }

    // Combined signal quality (weighted average)
    this.signal_quality = 0.6 * STE_quality + 0.4 * ZCR_quality;

    // Map quality to R: high quality → low R, low quality → high R
    const R_new = this.R_max - (this.signal_quality * (this.R_max - this.R_min));

    // Smooth transition (exponential moving average)
    const alpha = 0.1;  // Smoothing factor
    this.current_R = alpha * R_new + (1 - alpha) * this.current_R;

    this.stats.R_adaptations++;
    this.stats.avg_signal_quality = (this.stats.avg_signal_quality * 0.95 + this.signal_quality * 0.05);

    return this.current_R;
  }

  /**
   * Get current adaptive R for UKF (convenience method)
   */
  getCurrentR() {
    return this.current_R;
  }

  /**
   * Get signal quality metric (0-1)
   */
  getSignalQuality() {
    return this.signal_quality;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 1: CANCELLATION LOGIC
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Apply cancellation logic to LQR control signal
   *
   * Theory:
   * - LQR wants to drive state to setpoint
   * - But we want to allow some "exploration" or "equalization freedom"
   * - Apply subtractive control when error is small (near setpoint)
   *
   * @param {Array} u_lqr - LQR control signal [Trans_sm, Res]
   * @param {number} error - Tracking error (setpoint - current_state)
   * @returns {Array} Modified control signal with cancellation applied
   */
  applyCancellationLogic(u_lqr, error) {
    // Only apply cancellation when near setpoint (small error)
    if (Math.abs(error) < this.cancellation_threshold) {
      return u_lqr;  // No cancellation needed
    }

    // Compute cancellation strength (proportional to error)
    const strength = Math.min(1.0, Math.abs(error) / 0.2);  // Full cancellation at 0.2 error

    // Apply subtractive cancellation
    const u_cancelled = [
      u_lqr[0] * (1 - this.cancellation_gain * strength),
      u_lqr[1] * (1 - this.cancellation_gain * strength)
    ];

    this.stats.cancellations_applied++;

    return u_cancelled;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 2: VCN/AI DATA THROTTLING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Get current data transmission rate based on system stability
   *
   * Theory:
   * - When Σ* is high (stable), system is predictable → send data slowly
   * - When Σ* is low (chaotic), system is unpredictable → send data frequently
   * - Saves network bandwidth and processing when not needed
   *
   * @param {number} Sigma_star - Current stability metric (0-1)
   * @param {number} currentNoiseEntropy - Optional: current signal entropy for additional gating
   * @returns {number} Data rate in Hz
   */
  getStatusDataRate(Sigma_star, currentNoiseEntropy = 0.5) {
    if (!this.throttle_enabled) {
      return 60.0;  // Max rate (no throttling)
    }

    // Determine rate based on stability
    let rate;
    if (Sigma_star >= this.Sigma_stable_threshold) {
      rate = this.rate_stable;  // Stable = slow updates
    } else if (Sigma_star >= this.Sigma_unstable_threshold) {
      rate = this.rate_unstable;  // Unstable = moderate updates
    } else {
      rate = this.rate_chaotic;  // Chaotic = fast updates
    }

    // Optional: further reduce rate if signal has high entropy (noisy/unpredictable)
    if (currentNoiseEntropy > 0.7) {
      rate *= 0.5;  // Halve rate for noisy signals
    }

    this.current_throttle_rate = rate;
    return rate;
  }

  /**
   * Check if data should be sent based on throttle rate
   *
   * @param {number} now - Current timestamp (ms)
   * @returns {boolean} True if data should be sent
   */
  shouldSendData(now) {
    if (!this.throttle_enabled) {
      this.stats.data_packets_sent++;
      return true;
    }

    const interval_ms = 1000 / this.current_throttle_rate;
    const elapsed = now - this.last_data_send_time;

    if (elapsed >= interval_ms) {
      this.last_data_send_time = now;
      this.stats.data_packets_sent++;
      return true;
    }

    this.stats.data_packets_throttled++;
    return false;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 2: FINITE MEMORY BOUND TELEMETRY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Record LQR cost for performance gap tracking
   *
   * Theory:
   * - J_optimal = actual LQR cost achieved
   * - J_bound = theoretical minimum cost (from DARE solution)
   * - Gap = J_optimal / J_bound measures how well we're doing
   * - Gap → 1 means optimal performance
   * - Gap >> 1 means something is wrong (saturation, model mismatch, etc.)
   *
   * @param {number} error - Current tracking error (setpoint - state)
   * @param {Array} u - Control signal [Trans_sm, Res]
   * @param {number} Q - State cost weight
   * @param {Array} R - Control cost matrix (2x2)
   * @returns {Object} { J_optimal, J_bound, gap }
   */
  recordPerformanceGap(error, u, Q, R) {
    if (!this.track_performance_gap) {
      return { J_optimal: 0, J_bound: 0, gap: 1.0 };
    }

    // Compute actual stage cost (instantaneous)
    const state_cost = Q * error * error;
    const control_cost = R[0][0] * u[0] * u[0] + R[1][1] * u[1] * u[1];
    const J_optimal = state_cost + control_cost;

    // Theoretical bound (assuming perfect control, error = 0)
    // This is an approximation - real bound requires solving DARE
    const J_bound = Q * 0.01 * 0.01;  // Assume we can get error down to 1%

    // Track history
    this.J_optimal_history.push(J_optimal);
    this.J_bound_history.push(J_bound);

    if (this.J_optimal_history.length > this.max_history) {
      this.J_optimal_history.shift();
      this.J_bound_history.shift();
    }

    // Compute average gap
    const avg_J_optimal = this.J_optimal_history.reduce((a, b) => a + b, 0) / this.J_optimal_history.length;
    const avg_J_bound = this.J_bound_history.reduce((a, b) => a + b, 0) / this.J_bound_history.length;
    const gap = avg_J_bound > 0 ? avg_J_optimal / avg_J_bound : 1.0;

    this.stats.avg_performance_gap = gap;

    return {
      J_optimal: J_optimal,
      J_bound: J_bound,
      gap: gap
    };
  }

  /**
   * Get performance gap for HUD display
   */
  getPerformanceGap() {
    return this.stats.avg_performance_gap;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // DIAGNOSTICS & UTILITIES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Get HUD-friendly diagnostics
   */
  getHUDData() {
    return {
      signal_quality: this.signal_quality,
      adaptive_R: this.current_R,
      throttle_rate: this.current_throttle_rate,
      performance_gap: this.stats.avg_performance_gap,
      stats: {
        R_adaptations: this.stats.R_adaptations,
        cancellations: this.stats.cancellations_applied,
        data_sent: this.stats.data_packets_sent,
        data_throttled: this.stats.data_packets_throttled
      }
    };
  }

  /**
   * Get full diagnostics
   */
  getDiagnostics() {
    return {
      version: '1.0-ANLG',
      config: {
        R_base: this.R_base,
        R_range: [this.R_min, this.R_max],
        STE_thresholds: [this.STE_low, this.STE_high],
        ZCR_thresholds: [this.ZCR_low, this.ZCR_high],
        throttle_enabled: this.throttle_enabled,
        rates: {
          stable: this.rate_stable,
          unstable: this.rate_unstable,
          chaotic: this.rate_chaotic
        }
      },
      state: {
        current_R: this.current_R,
        signal_quality: this.signal_quality,
        throttle_rate: this.current_throttle_rate
      },
      stats: this.stats,
      history: {
        J_optimal: this.J_optimal_history.length,
        J_bound: this.J_bound_history.length
      }
    };
  }

  /**
   * Reset state
   */
  reset() {
    this.current_R = this.R_base;
    this.current_throttle_rate = this.rate_stable;
    this.last_data_send_time = 0;
    this.signal_quality = 0.5;
    this.J_optimal_history = [];
    this.J_bound_history = [];
    this.stats = {
      R_adaptations: 0,
      cancellations_applied: 0,
      data_packets_sent: 0,
      data_packets_throttled: 0,
      avg_signal_quality: 0.5,
      avg_performance_gap: 1.0
    };
    console.log("🎛️ ANLG reset");
  }
}

console.log("🎛️ ANLG class ready - Adaptive governance enabled");

export default ANLG;
