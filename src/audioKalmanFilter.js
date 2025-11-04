/**
 * Audio Band Kalman-LQR Filter
 *
 * Applies optimal Kalman filtering with LQR control to audio frequency bands
 * for stable, responsive audio visualizations.
 *
 * Benefits over simple exponential smoothing:
 * - Mathematically optimal noise rejection
 * - Predictive tracking (anticipates trends)
 * - Configurable tradeoff between stability and responsiveness
 * - Consistent with financial data pipeline architecture
 */

console.log("🎵 audioKalmanFilter.js loaded");

/**
 * Single-channel Kalman-LQR filter for one audio band
 */
class AudioKalmanChannel {
  constructor(options = {}) {
    // State: current filtered value
    this.x = 0;

    // State covariance (uncertainty in estimate)
    this.P = options.initialCovariance || 0.1;

    // Process noise covariance (how much the signal naturally varies)
    // Higher Q = more responsive but less smooth
    this.Q = options.Q || 0.001;

    // Measurement noise covariance (FFT bin averaging noise)
    // Higher R = more smoothing but slower response
    this.R = options.R || 0.01;

    // State transition (system dynamics)
    // A = 1 means we expect the value to persist
    this.A = options.A || 1.0;

    // Observation model (we directly observe the state)
    this.H = 1.0;

    // LQR control gain (optional - for predictive tracking)
    this.K_lqr = options.K_lqr || 0.0;

    // Velocity estimate (for predictive tracking)
    this.velocity = 0;
    this.velocitySmoothing = options.velocitySmoothing || 0.7;

    // History for diagnostics
    this.history = {
      raw: [],
      filtered: [],
      kalmanGain: []
    };
    this.historyLimit = 100;
  }

  /**
   * Update filter with new measurement
   * @param {number} z - Raw measurement (0-1)
   * @returns {number} Filtered value (0-1)
   */
  update(z) {
    // Clamp input to valid range
    z = Math.max(0, Math.min(1, z));

    // PREDICTION STEP
    // Predict next state using velocity (LQR predictive component)
    const x_pred = this.A * this.x + this.K_lqr * this.velocity;

    // Predict covariance
    const P_pred = this.A * this.P * this.A + this.Q;

    // UPDATE STEP (Kalman correction)
    // Innovation (measurement residual)
    const y = z - this.H * x_pred;

    // Innovation covariance
    const S = this.H * P_pred * this.H + this.R;

    // Kalman gain (optimal weighting)
    const K = (P_pred * this.H) / S;

    // Update state estimate
    const x_new = x_pred + K * y;

    // Update covariance
    const P_new = (1 - K * this.H) * P_pred;

    // Update velocity estimate (for LQR prediction)
    const newVelocity = x_new - this.x;
    this.velocity = this.velocitySmoothing * this.velocity +
                    (1 - this.velocitySmoothing) * newVelocity;

    // Store results
    this.x = x_new;
    this.P = P_new;

    // Update history
    this.history.raw.push(z);
    this.history.filtered.push(x_new);
    this.history.kalmanGain.push(K);

    // Trim history
    if (this.history.raw.length > this.historyLimit) {
      this.history.raw.shift();
      this.history.filtered.shift();
      this.history.kalmanGain.shift();
    }

    // Return bounded result
    return Math.max(0, Math.min(1, x_new));
  }

  /**
   * Get current filtered value without updating
   */
  getValue() {
    return Math.max(0, Math.min(1, this.x));
  }

  /**
   * Reset filter to initial state
   */
  reset() {
    this.x = 0;
    this.P = 0.1;
    this.velocity = 0;
    this.history = {
      raw: [],
      filtered: [],
      kalmanGain: []
    };
  }

  /**
   * Get diagnostic info
   */
  getDiagnostics() {
    return {
      state: this.x,
      covariance: this.P,
      velocity: this.velocity,
      lastKalmanGain: this.history.kalmanGain[this.history.kalmanGain.length - 1] || 0
    };
  }
}

/**
 * Multi-band audio filter with preset configurations
 */
export class AudioBandFilter {
  constructor(options = {}) {
    // Filter mode presets
    const presets = {
      // Smooth: Maximum stability, slow transients
      smooth: {
        Q: 0.0005,
        R: 0.02,
        K_lqr: 0.0,
        velocitySmoothing: 0.9
      },
      // Balanced: Good stability with reasonable response
      balanced: {
        Q: 0.001,
        R: 0.01,
        K_lqr: 0.05,
        velocitySmoothing: 0.7
      },
      // Responsive: Fast transients, less smoothing
      responsive: {
        Q: 0.005,
        R: 0.005,
        K_lqr: 0.1,
        velocitySmoothing: 0.5
      },
      // Reactive: Maximum responsiveness (closest to raw)
      reactive: {
        Q: 0.01,
        R: 0.002,
        K_lqr: 0.15,
        velocitySmoothing: 0.3
      }
    };

    // Get preset or use custom
    const preset = options.preset || 'balanced';
    const config = presets[preset] || presets.balanced;

    // Override with custom options
    const channelConfig = {
      ...config,
      ...options
    };

    // Create separate filters for each band
    this.bassFilter = new AudioKalmanChannel({
      ...channelConfig,
      // Bass can be slightly more responsive (punchy kicks)
      Q: channelConfig.Q * 1.2
    });

    this.midFilter = new AudioKalmanChannel({
      ...channelConfig
    });

    this.trebleFilter = new AudioKalmanChannel({
      ...channelConfig,
      // Treble can be smoother (reduce harshness)
      R: channelConfig.R * 1.5
    });

    this.levelFilter = new AudioKalmanChannel({
      ...channelConfig,
      // Level (RMS) should be very smooth
      Q: channelConfig.Q * 0.5,
      R: channelConfig.R * 2.0
    });

    this.enabled = options.enabled !== undefined ? options.enabled : true;
    this.preset = preset;

    console.log(`🎵 AudioBandFilter initialized (preset: ${preset})`);
  }

  /**
   * Filter all bands
   * @param {Object} rawBands - { bass, mid, treble, level }
   * @returns {Object} Filtered bands
   */
  update(rawBands) {
    if (!this.enabled) {
      return rawBands;
    }

    return {
      bass: this.bassFilter.update(rawBands.bass || 0),
      mid: this.midFilter.update(rawBands.mid || 0),
      treble: this.trebleFilter.update(rawBands.treble || 0),
      level: this.levelFilter.update(rawBands.level || 0)
    };
  }

  /**
   * Get current filtered values without updating
   */
  getValues() {
    return {
      bass: this.bassFilter.getValue(),
      mid: this.midFilter.getValue(),
      treble: this.trebleFilter.getValue(),
      level: this.levelFilter.getValue()
    };
  }

  /**
   * Change preset configuration
   */
  setPreset(preset) {
    console.log(`🎵 AudioBandFilter: Switching to preset '${preset}'`);
    // Create new instance with preset
    const newFilter = new AudioBandFilter({ preset, enabled: this.enabled });

    // Copy current state to maintain continuity
    newFilter.bassFilter.x = this.bassFilter.x;
    newFilter.midFilter.x = this.midFilter.x;
    newFilter.trebleFilter.x = this.trebleFilter.x;
    newFilter.levelFilter.x = this.levelFilter.x;

    // Copy to self
    Object.assign(this, newFilter);
  }

  /**
   * Enable/disable filtering (bypass mode)
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    console.log(`🎵 AudioBandFilter: ${enabled ? 'Enabled' : 'Disabled (bypass)'}`);
  }

  /**
   * Reset all filters
   */
  reset() {
    this.bassFilter.reset();
    this.midFilter.reset();
    this.trebleFilter.reset();
    this.levelFilter.reset();
    console.log("🎵 AudioBandFilter: Reset all channels");
  }

  /**
   * Get diagnostics for all channels
   */
  getDiagnostics() {
    return {
      enabled: this.enabled,
      preset: this.preset,
      bass: this.bassFilter.getDiagnostics(),
      mid: this.midFilter.getDiagnostics(),
      treble: this.trebleFilter.getDiagnostics(),
      level: this.levelFilter.getDiagnostics()
    };
  }
}

console.log("🎵 AudioBandFilter class ready");

// Export for testing
if (typeof window !== 'undefined') {
  window.AudioBandFilter = AudioBandFilter;
  window.AudioKalmanChannel = AudioKalmanChannel;
}
