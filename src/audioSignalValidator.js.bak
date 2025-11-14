/**
 * Audio Signal Validator
 *
 * Empirically validates whether Kalman-LQR filtering improves audio signals
 * by measuring jitter, lag, and smoothness of raw vs filtered bands.
 *
 * Metrics:
 * - Jitter: Standard deviation of frame-to-frame changes (lower = smoother)
 * - Lag: Cross-correlation to measure response delay (lower = more responsive)
 * - SNR: Signal-to-noise ratio approximation (higher = cleaner)
 * - Visual Quality Score: Weighted combination of metrics
 *
 * Usage:
 *   const validator = new AudioSignalValidator(AudioEngine);
 *   validator.start();
 *   // Wait 30 seconds...
 *   const report = validator.getReport();
 *   validator.printReport();
 */

console.log("📊 audioSignalValidator.js loaded");

export class AudioSignalValidator {
  constructor(audioEngine, options = {}) {
    this.audioEngine = audioEngine;
    this.sampleSize = options.sampleSize || 1800; // 30 seconds at 60fps
    this.enabled = false;

    // History buffers
    this.history = {
      raw: {
        bass: [],
        mid: [],
        treble: [],
        level: []
      },
      filtered: {
        bass: [],
        mid: [],
        treble: [],
        level: []
      },
      timestamps: []
    };

    this.frameCount = 0;
    this.startTime = 0;

    console.log(`📊 AudioSignalValidator initialized (samples: ${this.sampleSize})`);
  }

  start() {
    this.enabled = true;
    this.frameCount = 0;
    this.startTime = performance.now();
    this.history = {
      raw: { bass: [], mid: [], treble: [], level: [] },
      filtered: { bass: [], mid: [], treble: [], level: [] },
      timestamps: []
    };
    console.log("📊 AudioSignalValidator: Started collecting samples");
  }

  stop() {
    this.enabled = false;
    console.log(`📊 AudioSignalValidator: Stopped after ${this.frameCount} samples`);
  }

  update() {
    if (!this.enabled) return;
    if (this.frameCount >= this.sampleSize) {
      this.enabled = false;
      console.log("📊 AudioSignalValidator: Sample size reached, auto-stopped");
      return;
    }

    const raw = this.audioEngine.getRawBands();
    const filtered = this.audioEngine.getBands();
    const timestamp = performance.now() - this.startTime;

    // Store samples
    this.history.raw.bass.push(raw.bass);
    this.history.raw.mid.push(raw.mid);
    this.history.raw.treble.push(raw.treble);
    this.history.raw.level.push(raw.level);

    this.history.filtered.bass.push(filtered.bass);
    this.history.filtered.mid.push(filtered.mid);
    this.history.filtered.treble.push(filtered.treble);
    this.history.filtered.level.push(filtered.level);

    this.history.timestamps.push(timestamp);

    this.frameCount++;
  }

  /**
   * Calculate jitter (frame-to-frame variance)
   * Lower is better (smoother)
   */
  _calculateJitter(values) {
    if (values.length < 2) return 0;

    const deltas = [];
    for (let i = 1; i < values.length; i++) {
      deltas.push(Math.abs(values[i] - values[i - 1]));
    }

    const mean = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    const variance = deltas.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / deltas.length;

    return Math.sqrt(variance);
  }

  /**
   * Calculate response lag using cross-correlation
   * Measures how many frames delayed the filtered signal is
   * Lower is better (more responsive)
   */
  _calculateLag(raw, filtered, maxLag = 10) {
    if (raw.length < maxLag || filtered.length < maxLag) return 0;

    let bestCorrelation = -Infinity;
    let bestLag = 0;

    // Try different lag values
    for (let lag = 0; lag <= maxLag; lag++) {
      let correlation = 0;
      const n = raw.length - lag;

      // Calculate cross-correlation
      for (let i = 0; i < n; i++) {
        correlation += raw[i] * filtered[i + lag];
      }

      correlation /= n;

      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestLag = lag;
      }
    }

    return bestLag;
  }

  /**
   * Calculate Signal-to-Noise Ratio approximation
   * Higher is better (cleaner signal)
   */
  _calculateSNR(values) {
    if (values.length < 2) return 0;

    // Signal power (variance of the signal)
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const signalPower = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;

    // Noise power (high-frequency jitter)
    const deltas = [];
    for (let i = 1; i < values.length; i++) {
      deltas.push(values[i] - values[i - 1]);
    }
    const deltaMean = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    const noisePower = deltas.reduce((sum, d) => sum + Math.pow(d - deltaMean, 2), 0) / deltas.length;

    if (noisePower === 0) return Infinity;
    return 10 * Math.log10(signalPower / noisePower);
  }

  /**
   * Calculate visual quality score (0-100)
   * Weighted combination of metrics
   */
  _calculateQualityScore(jitter, lag, snr) {
    // Lower jitter is better (invert)
    const jitterScore = Math.max(0, 100 * (1 - jitter * 10));

    // Lower lag is better (invert)
    const lagScore = Math.max(0, 100 * (1 - lag / 10));

    // Higher SNR is better
    const snrScore = Math.min(100, Math.max(0, snr * 2));

    // Weighted average (jitter most important for visuals)
    return (jitterScore * 0.5 + lagScore * 0.2 + snrScore * 0.3);
  }

  /**
   * Generate comparison report
   */
  getReport() {
    if (this.frameCount === 0) {
      return { error: 'No samples collected yet' };
    }

    const report = {
      sampleCount: this.frameCount,
      duration: this.history.timestamps[this.history.timestamps.length - 1],
      bands: {}
    };

    // Analyze each band
    const bands = ['bass', 'mid', 'treble', 'level'];

    for (const band of bands) {
      const raw = this.history.raw[band];
      const filtered = this.history.filtered[band];

      const rawJitter = this._calculateJitter(raw);
      const filteredJitter = this._calculateJitter(filtered);

      const lag = this._calculateLag(raw, filtered);

      const rawSNR = this._calculateSNR(raw);
      const filteredSNR = this._calculateSNR(filtered);

      const rawQuality = this._calculateQualityScore(rawJitter, 0, rawSNR);
      const filteredQuality = this._calculateQualityScore(filteredJitter, lag, filteredSNR);

      report.bands[band] = {
        jitter: {
          raw: rawJitter,
          filtered: filteredJitter,
          improvement: ((rawJitter - filteredJitter) / rawJitter) * 100
        },
        lag: {
          frames: lag,
          milliseconds: lag * (1000 / 60) // Assume 60fps
        },
        snr: {
          raw: rawSNR,
          filtered: filteredSNR,
          improvement: filteredSNR - rawSNR
        },
        quality: {
          raw: rawQuality,
          filtered: filteredQuality,
          improvement: filteredQuality - rawQuality
        }
      };
    }

    // Overall summary
    const allJitterImprovements = bands.map(b => report.bands[b].jitter.improvement);
    const allQualityImprovements = bands.map(b => report.bands[b].quality.improvement);
    const allLags = bands.map(b => report.bands[b].lag.frames);

    report.summary = {
      avgJitterImprovement: allJitterImprovements.reduce((a, b) => a + b, 0) / bands.length,
      avgQualityImprovement: allQualityImprovements.reduce((a, b) => a + b, 0) / bands.length,
      avgLag: allLags.reduce((a, b) => a + b, 0) / bands.length,
      recommendation: ''
    };

    // Generate recommendation
    if (report.summary.avgJitterImprovement > 30 && report.summary.avgLag < 3) {
      report.summary.recommendation = 'Kalman filtering is BENEFICIAL - significant jitter reduction with minimal lag';
    } else if (report.summary.avgJitterImprovement > 10 && report.summary.avgLag < 5) {
      report.summary.recommendation = 'Kalman filtering is MARGINALLY BENEFICIAL - modest improvement';
    } else if (report.summary.avgLag > 5) {
      report.summary.recommendation = 'Kalman filtering adds TOO MUCH LAG - consider more responsive preset';
    } else {
      report.summary.recommendation = 'Kalman filtering provides MINIMAL BENEFIT - raw signal may be acceptable';
    }

    return report;
  }

  /**
   * Print formatted report to console
   */
  printReport() {
    const report = this.getReport();

    if (report.error) {
      console.warn('📊 Audio Signal Validation: Not enough data yet');
      return;
    }

    console.log('\n📊 ═══════════════════════════════════════════════════════════');
    console.log('📊 AUDIO SIGNAL VALIDATION REPORT');
    console.log('📊 ═══════════════════════════════════════════════════════════');

    console.log(`\n⏱️  Collection Stats:`);
    console.log(`   Samples: ${report.sampleCount}`);
    console.log(`   Duration: ${(report.duration / 1000).toFixed(1)}s`);
    console.log(`   Avg FPS: ${(report.sampleCount / (report.duration / 1000)).toFixed(1)}`);

    console.log(`\n🎵 Per-Band Analysis:`);
    console.log('─'.repeat(75));
    console.log('Band    │ Jitter Reduct. │ Lag (frames) │ SNR Gain │ Quality Gain');
    console.log('─'.repeat(75));

    const bands = ['bass', 'mid', 'treble', 'level'];
    for (const band of bands) {
      const b = report.bands[band];

      const jitterImprov = b.jitter.improvement.toFixed(1).padStart(6) + '%';
      const lag = b.lag.frames.toFixed(1).padStart(4);
      const snrGain = b.snr.improvement.toFixed(1).padStart(4) + ' dB';
      const qualityGain = b.quality.improvement > 0 ? '+' : '';
      const quality = qualityGain + b.quality.improvement.toFixed(1).padStart(4);

      // Color code by effectiveness
      let color = '\x1b[32m'; // Green = good
      if (b.jitter.improvement < 20) color = '\x1b[33m'; // Yellow = marginal
      if (b.jitter.improvement < 5 || b.lag.frames > 5) color = '\x1b[31m'; // Red = poor

      console.log(`${color}${band.padEnd(7)} │ ${jitterImprov.padStart(14)} │ ${lag.padStart(12)} │ ${snrGain.padStart(8)} │ ${quality.padStart(12)}\x1b[0m`);
    }

    console.log('─'.repeat(75));

    console.log(`\n📈 Overall Summary:`);
    console.log(`   Average Jitter Reduction: ${report.summary.avgJitterImprovement.toFixed(1)}%`);
    console.log(`   Average Quality Gain: ${report.summary.avgQualityImprovement > 0 ? '+' : ''}${report.summary.avgQualityImprovement.toFixed(1)} points`);
    console.log(`   Average Lag: ${report.summary.avgLag.toFixed(1)} frames (${(report.summary.avgLag * 16.67).toFixed(1)}ms)`);

    console.log(`\n💡 Recommendation:`);
    const recColor = report.summary.recommendation.includes('BENEFICIAL') ? '\x1b[32m' :
                     report.summary.recommendation.includes('MARGINAL') ? '\x1b[33m' : '\x1b[31m';
    console.log(`   ${recColor}${report.summary.recommendation}\x1b[0m`);

    console.log('\n═'.repeat(75));
  }

  /**
   * Get current Kalman filter diagnostics
   */
  getKalmanDiagnostics() {
    return this.audioEngine.getKalmanDiagnostics();
  }

  /**
   * Export data for external analysis
   */
  exportData() {
    return {
      history: this.history,
      report: this.getReport()
    };
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  window.AudioSignalValidator = AudioSignalValidator;
}

console.log("📊 AudioSignalValidator class ready");
