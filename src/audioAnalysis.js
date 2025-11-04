/**
 * Real Audio Analysis System
 *
 * Production-ready audio analysis for EDM/electronic music visualization:
 * - Onset Detection: Detect beats/hits using spectral flux
 * - Beat Tracking: Tempo detection (BPM) and beat grid alignment
 * - Buildup Detection: Rising spectral energy, increasing high-freq content
 * - Drop Prediction: Accurate prediction of drops before they happen
 *
 * Unlike MMPA (which was designed for systems with inherent dynamics),
 * this uses actual music information retrieval (MIR) techniques.
 */

console.log("🎵 audioAnalysis.js loaded");

/**
 * Onset Detector - Detects transient attacks (beats, hits, drops)
 */
export class OnsetDetector {
  constructor(options = {}) {
    this.enabled = options.enabled !== false;
    this.threshold = options.threshold || 1.5; // Onset detection threshold
    this.smoothingFrames = options.smoothingFrames || 3;

    // History for flux computation
    this.spectrumHistory = [];
    this.fluxHistory = [];
    this.maxHistory = 60; // 1 second at 60fps

    // Onset state
    this.lastOnsetTime = 0;
    this.onsetCooldown = 100; // ms between onsets
    this.onsetsDetected = 0;

    console.log("🎵 OnsetDetector initialized");
  }

  /**
   * Detect onsets from audio bands
   * @param {Object} bands - { bass, mid, treble, level }
   * @returns {Object} - { onset: boolean, flux: number, strength: number }
   */
  detect(bands) {
    if (!this.enabled) return { onset: false, flux: 0, strength: 0 };

    // Compute spectral flux (rate of change in spectrum)
    const spectrum = [bands.bass, bands.mid, bands.treble];
    const flux = this.computeSpectralFlux(spectrum);

    this.fluxHistory.push(flux);
    if (this.fluxHistory.length > this.maxHistory) {
      this.fluxHistory.shift();
    }

    // Adaptive threshold based on recent history
    const avgFlux = this.getAverageFlux();
    const adaptiveThreshold = avgFlux * this.threshold;

    // Detect onset if flux exceeds threshold
    const now = Date.now();
    const timeSinceLastOnset = now - this.lastOnsetTime;
    const onset = flux > adaptiveThreshold && timeSinceLastOnset > this.onsetCooldown;

    if (onset) {
      this.lastOnsetTime = now;
      this.onsetsDetected++;
    }

    return {
      onset: onset,
      flux: flux,
      strength: flux / Math.max(adaptiveThreshold, 0.001),
      avgFlux: avgFlux
    };
  }

  /**
   * Compute spectral flux (sum of positive differences)
   */
  computeSpectralFlux(spectrum) {
    if (this.spectrumHistory.length === 0) {
      this.spectrumHistory.push(spectrum);
      return 0;
    }

    const prevSpectrum = this.spectrumHistory[this.spectrumHistory.length - 1];
    let flux = 0;

    for (let i = 0; i < spectrum.length; i++) {
      const diff = spectrum[i] - prevSpectrum[i];
      if (diff > 0) flux += diff; // Only positive changes (increases in energy)
    }

    this.spectrumHistory.push(spectrum);
    if (this.spectrumHistory.length > 5) {
      this.spectrumHistory.shift();
    }

    return flux;
  }

  /**
   * Get average flux over recent history
   */
  getAverageFlux() {
    if (this.fluxHistory.length === 0) return 0;
    const sum = this.fluxHistory.reduce((a, b) => a + b, 0);
    return sum / this.fluxHistory.length;
  }

  reset() {
    this.spectrumHistory = [];
    this.fluxHistory = [];
    this.lastOnsetTime = 0;
    this.onsetsDetected = 0;
  }
}

/**
 * Beat Tracker - Detects tempo and tracks beats
 */
export class BeatTracker {
  constructor(options = {}) {
    this.enabled = options.enabled !== false;
    this.minBPM = options.minBPM || 60;
    this.maxBPM = options.maxBPM || 180;

    // Onset timing history
    this.onsetTimes = [];
    this.maxOnsets = 32; // Track last 32 onsets

    // Beat state
    this.bpm = 128; // Default EDM tempo
    this.beatInterval = 60000 / this.bpm; // ms per beat
    this.lastBeatTime = 0;
    this.beatCount = 0;
    this.confidence = 0; // 0-1, how confident we are in the BPM

    // Bar tracking (assuming 4/4 time)
    this.beatsPerBar = 4;
    this.barCount = 0;

    console.log("🎵 BeatTracker initialized");
  }

  /**
   * Update beat tracking with onset detection
   * @param {Object} onsetData - From OnsetDetector
   * @returns {Object} - { beat: boolean, bar: boolean, bpm: number, confidence: number }
   */
  update(onsetData) {
    if (!this.enabled) return { beat: false, bar: false, bpm: this.bpm, confidence: 0 };

    const now = Date.now();

    // Record onsets for tempo estimation
    if (onsetData.onset) {
      this.onsetTimes.push(now);
      if (this.onsetTimes.length > this.maxOnsets) {
        this.onsetTimes.shift();
      }

      // Update BPM estimate
      this.estimateBPM();
    }

    // Check if we're on a beat
    const timeSinceLastBeat = now - this.lastBeatTime;
    const beat = timeSinceLastBeat >= this.beatInterval * 0.9; // Slightly early trigger

    if (beat) {
      this.lastBeatTime = now;
      this.beatCount++;

      // Check if we're on a bar (every 4 beats in 4/4 time)
      const bar = (this.beatCount % this.beatsPerBar) === 0;
      if (bar) {
        this.barCount++;
      }

      return { beat: true, bar: bar, bpm: this.bpm, confidence: this.confidence, beatInBar: this.beatCount % this.beatsPerBar };
    }

    return { beat: false, bar: false, bpm: this.bpm, confidence: this.confidence, beatInBar: this.beatCount % this.beatsPerBar };
  }

  /**
   * Estimate BPM from onset intervals
   */
  estimateBPM() {
    if (this.onsetTimes.length < 4) return;

    // Compute intervals between consecutive onsets
    const intervals = [];
    for (let i = 1; i < this.onsetTimes.length; i++) {
      intervals.push(this.onsetTimes[i] - this.onsetTimes[i - 1]);
    }

    // Filter out outliers
    const median = this.getMedian(intervals);
    const filtered = intervals.filter(interval =>
      interval > median * 0.5 && interval < median * 2.0
    );

    if (filtered.length < 2) return;

    // Average interval
    const avgInterval = filtered.reduce((a, b) => a + b, 0) / filtered.length;
    const estimatedBPM = 60000 / avgInterval;

    // Clamp to reasonable range
    if (estimatedBPM >= this.minBPM && estimatedBPM <= this.maxBPM) {
      // Smooth BPM estimate
      this.bpm = this.bpm * 0.9 + estimatedBPM * 0.1;
      this.beatInterval = 60000 / this.bpm;

      // Update confidence based on consistency
      const variance = this.getVariance(filtered);
      this.confidence = Math.max(0, Math.min(1, 1.0 - (variance / (median * median))));
    }
  }

  getMedian(values) {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  getVariance(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  reset() {
    this.onsetTimes = [];
    this.lastBeatTime = 0;
    this.beatCount = 0;
    this.barCount = 0;
    this.confidence = 0;
  }
}

/**
 * Buildup Detector - Detects buildups leading to drops
 */
export class BuildupDetector {
  constructor(options = {}) {
    this.enabled = options.enabled !== false;
    this.buildupThreshold = options.buildupThreshold || 0.25; // LOWERED: Was 0.6, now much more sensitive

    // Energy tracking
    this.energyHistory = [];
    this.spectralCentroidHistory = [];
    this.maxHistory = 180; // 3 seconds at 60fps

    // Buildup state
    this.inBuildup = false;
    this.buildupStartTime = 0;
    this.buildupIntensity = 0; // 0-1
    this.buildupsDetected = 0;

    // Debug logging
    this.debugFrameCount = 0;

    console.log("🎵 BuildupDetector initialized (threshold:", this.buildupThreshold, ")");
  }

  /**
   * Detect buildup from audio bands
   * @param {Object} bands - { bass, mid, treble, level }
   * @returns {Object} - { buildup: boolean, intensity: number, duration: number }
   */
  detect(bands) {
    if (!this.enabled) return { buildup: false, intensity: 0, duration: 0 };

    // Track overall energy
    const energy = bands.level;
    this.energyHistory.push(energy);

    // Track spectral centroid (approximation: weighted average of bands)
    const spectralCentroid = (bands.treble * 3 + bands.mid * 2 + bands.bass * 1) / 6;
    this.spectralCentroidHistory.push(spectralCentroid);

    // Trim history
    if (this.energyHistory.length > this.maxHistory) {
      this.energyHistory.shift();
      this.spectralCentroidHistory.shift();
    }

    // Compute trends
    const energyTrend = this.computeTrend(this.energyHistory);
    const spectralTrend = this.computeTrend(this.spectralCentroidHistory);

    // Buildup = rising energy + rising spectral centroid
    const buildupSignal = energyTrend + spectralTrend;
    this.buildupIntensity = Math.max(0, Math.min(1, buildupSignal / 0.02)); // Normalize

    const now = Date.now();

    // Debug logging every 3 seconds
    this.debugFrameCount++;
    if (this.debugFrameCount % 180 === 0) {
      console.log('🔥 Buildup Debug:', {
        energyTrend: energyTrend.toFixed(4),
        spectralTrend: spectralTrend.toFixed(4),
        buildupSignal: buildupSignal.toFixed(4),
        intensity: this.buildupIntensity.toFixed(3),
        threshold: this.buildupThreshold,
        inBuildup: this.inBuildup
      });
    }

    // Detect buildup start
    if (!this.inBuildup && this.buildupIntensity > this.buildupThreshold) {
      this.inBuildup = true;
      this.buildupStartTime = now;
      this.buildupsDetected++;
      console.log('🔥 BUILDUP STARTED! Intensity:', this.buildupIntensity.toFixed(3));
    }

    // Detect buildup end (sudden drop or long duration)
    if (this.inBuildup) {
      const buildupDuration = now - this.buildupStartTime;

      // End if intensity drops or if buildup is too long (>8 seconds)
      if (this.buildupIntensity < this.buildupThreshold * 0.5 || buildupDuration > 8000) {
        this.inBuildup = false;
      }
    }

    return {
      buildup: this.inBuildup,
      intensity: this.buildupIntensity,
      duration: this.inBuildup ? (now - this.buildupStartTime) / 1000 : 0
    };
  }

  /**
   * Compute linear trend of recent values
   */
  computeTrend(values) {
    if (values.length < 10) return 0;

    const recent = values.slice(-30); // Last 0.5 seconds
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

  reset() {
    this.energyHistory = [];
    this.spectralCentroidHistory = [];
    this.inBuildup = false;
    this.buildupStartTime = 0;
    this.buildupIntensity = 0;
    this.buildupsDetected = 0;
  }
}

/**
 * Drop Predictor - Combines all analysis to predict drops
 */
export class DropPredictor {
  constructor(options = {}) {
    this.enabled = options.enabled !== false;

    // Sub-systems
    this.onsetDetector = new OnsetDetector(options.onset || {});
    this.beatTracker = new BeatTracker(options.beat || {});
    this.buildupDetector = new BuildupDetector(options.buildup || {});

    // Drop prediction state
    this.dropWarning = false;
    this.dropPredictedTime = null;
    this.dropConfidence = 0;
    this.dropsDetected = 0;
    this.lastDropPredictionLog = 0; // For debug logging

    // History
    this.history = {
      onsets: [],
      beats: [],
      buildups: []
    };

    console.log("🎵 DropPredictor initialized");
  }

  /**
   * Update with audio bands and get predictions
   * @param {Object} bands - { bass, mid, treble, level }
   * @returns {Object} - Complete analysis with drop prediction
   */
  update(bands) {
    if (!this.enabled) return { enabled: false };

    // Run sub-systems
    const onsetData = this.onsetDetector.detect(bands);
    const beatData = this.beatTracker.update(onsetData);
    const buildupData = this.buildupDetector.detect(bands);

    // Drop prediction logic
    this.predictDrop(beatData, buildupData, onsetData);

    return {
      enabled: true,

      // Onset detection
      onset: onsetData.onset,
      onsetStrength: onsetData.strength,
      spectralFlux: onsetData.flux,

      // Beat tracking
      beat: beatData.beat,
      bar: beatData.bar,
      bpm: beatData.bpm,
      beatConfidence: beatData.confidence,
      beatInBar: beatData.beatInBar,

      // Buildup detection
      buildup: buildupData.buildup,
      buildupIntensity: buildupData.intensity,
      buildupDuration: buildupData.duration,

      // Drop prediction
      dropWarning: this.dropWarning,
      dropETA: this.dropPredictedTime,
      dropConfidence: this.dropConfidence,

      // Stats
      stats: {
        onsetsDetected: this.onsetDetector.onsetsDetected,
        beatsDetected: this.beatTracker.beatCount,
        barsDetected: this.beatTracker.barCount,
        buildupsDetected: this.buildupDetector.buildupsDetected,
        dropsDetected: this.dropsDetected
      }
    };
  }

  /**
   * Predict drops based on buildup patterns and beat grid
   */
  predictDrop(beatData, buildupData, onsetData) {
    // Drop prediction heuristics:
    // 1. We're in a buildup (rising energy/spectral content)
    // 2. Buildup has been going for 1-8 seconds (REDUCED from 2s)
    // 3. We're approaching a strong beat (bar boundary or phrase boundary)

    const now = Date.now();

    if (buildupData.buildup && buildupData.duration > 1.0) {
      // Buildup detected and sufficiently long

      // Predict drop at next bar boundary
      const msToNextBar = beatData.bpm ? (beatData.beatInterval * (4 - beatData.beatInBar)) : 2000;

      this.dropWarning = true;
      this.dropPredictedTime = msToNextBar / 1000; // Convert to seconds
      this.dropConfidence = Math.min(0.95, buildupData.intensity * beatData.confidence);

      // Debug log
      if (!this.lastDropPredictionLog || (now - this.lastDropPredictionLog) > 1000) {
        console.log('💥 DROP PREDICTED! ETA:', this.dropPredictedTime.toFixed(1) + 's', 'Confidence:', (this.dropConfidence * 100).toFixed(0) + '%');
        this.lastDropPredictionLog = now;
      }

    } else if (this.dropWarning && !buildupData.buildup) {
      // Buildup ended - drop likely happened
      this.dropWarning = false;
      this.dropsDetected++;
      this.dropPredictedTime = null;
      this.dropConfidence = 0;
    }
  }

  /**
   * Get HUD data
   */
  getHUDData() {
    return {
      prediction: {
        warning: this.dropWarning,
        eta: this.dropPredictedTime,
        confidence: this.dropConfidence
      },
      beats: {
        bpm: this.beatTracker.bpm,
        confidence: this.beatTracker.confidence,
        beatCount: this.beatTracker.beatCount,
        barCount: this.beatTracker.barCount
      },
      buildup: {
        active: this.buildupDetector.inBuildup,
        intensity: this.buildupDetector.buildupIntensity
      },
      stats: {
        dropsDetected: this.dropsDetected,
        onsets: this.onsetDetector.onsetsDetected,
        buildups: this.buildupDetector.buildupsDetected
      }
    };
  }

  /**
   * Reset all systems
   */
  reset() {
    this.onsetDetector.reset();
    this.beatTracker.reset();
    this.buildupDetector.reset();
    this.dropWarning = false;
    this.dropPredictedTime = null;
    this.dropConfidence = 0;
    this.dropsDetected = 0;
  }

  /**
   * Get diagnostics
   */
  getDiagnostics() {
    return {
      version: '1.0-DropPredictor',
      enabled: this.enabled,
      components: {
        onsetDetector: {
          threshold: this.onsetDetector.threshold,
          onsetsDetected: this.onsetDetector.onsetsDetected
        },
        beatTracker: {
          bpm: this.beatTracker.bpm,
          confidence: this.beatTracker.confidence,
          beatCount: this.beatTracker.beatCount
        },
        buildupDetector: {
          threshold: this.buildupDetector.buildupThreshold,
          buildupsDetected: this.buildupDetector.buildupsDetected
        }
      },
      currentState: {
        dropWarning: this.dropWarning,
        dropETA: this.dropPredictedTime,
        dropConfidence: this.dropConfidence
      }
    };
  }
}

console.log("✅ audioAnalysis.js ready");

export default DropPredictor;
