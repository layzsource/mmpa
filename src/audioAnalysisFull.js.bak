/**
 * Professional Audio Analysis for Drop Prediction
 *
 * Implements production-quality MIR (Music Information Retrieval) techniques:
 * - Multiple Onset Detection Functions (ODFs): Spectral flux, HFC, phase deviation
 * - Autocorrelation-based tempo tracking (more robust than IOI)
 * - Multi-band RMS energy analysis
 * - Energy contour analysis for drop detection
 * - Adaptive thresholding
 */

console.log("🎵 audioAnalysisFull.js loaded - Professional Edition");

export class FullSpectrumDropPredictor {
  constructor(audioContext, analyserNode, options = {}) {
    this.audioContext = audioContext;
    this.analyser = analyserNode;

    // Get FFT data
    this.fftSize = this.analyser.frequencyBinCount;
    this.frequencyData = new Uint8Array(this.fftSize);
    this.prevFrequencyData = new Uint8Array(this.fftSize);

    // Time-domain data for RMS and additional analysis
    this.timeDomainSize = this.analyser.fftSize;
    this.timeDomainData = new Uint8Array(this.timeDomainSize);

    // Beat tracking
    this.onsetHistory = [];
    this.onsetTimes = [];
    this.maxOnsets = 64; // Increased for better autocorrelation

    this.bpm = 128;
    this.beatInterval = 60000 / this.bpm;
    this.lastBeatTime = Date.now();
    this.beatCount = 0;
    this.beatConfidence = 0;

    // Multi-ODF onset detection
    this.baseOnsetThreshold = options.onsetThreshold || 10; // Balanced threshold
    this.onsetThreshold = this.baseOnsetThreshold;
    this.onsetCooldown = 150; // ms between onsets (prevent detecting multiple peaks per beat)
    this.lastOnsetTime = 0;
    this.onsetsDetected = 0;

    // ODF histories for adaptive thresholding
    this.fluxHistory = [];
    this.hfcHistory = [];
    this.phaseHistory = [];
    this.combinedODFHistory = [];
    this.maxODFHistory = 180; // 3 seconds at 60fps

    // Multi-band RMS energy
    this.rmsHistory = {
      sub: [],    // Sub-bass: 20-60 Hz
      bass: [],   // Bass: 60-250 Hz
      low: [],    // Low-mid: 250-500 Hz
      mid: [],    // Mid: 500-2000 Hz
      high: [],   // High-mid: 2000-6000 Hz
      pres: []    // Presence: 6000+ Hz
    };
    this.maxRMSHistory = 180; // 3 seconds

    // Buildup detection
    this.energyHistory = [];
    this.highFreqHistory = [];
    this.maxHistory = 180; // 3 seconds at 60fps
    this.inBuildup = false;
    this.buildupStartTime = 0;
    this.buildupIntensity = 0;
    this.buildupsDetected = 0;

    // Require sustained buildup (not just momentary upticks)
    this.buildupFramesAboveThreshold = 0;
    this.requiredBuildupFrames = 15; // 0.25 seconds at 60fps (reduced from 30)

    // Drop prediction
    this.dropWarning = false;
    this.dropETA = null;
    this.dropConfidence = 0;
    this.dropsDetected = 0;
    this.dropDetectedTime = 0;

    // Drop detection (actual drop moment)
    this.prevHighFreqEnergy = 0;
    this.prevTotalEnergy = 0;
    this.bassHistory = [];

    // Tap tempo
    this.tapTimes = [];
    this.maxTaps = 8; // Use last 8 taps for averaging
    this.tapTimeout = 3000; // Reset if > 3 seconds between taps
    this.tapBPM = null;
    this.tapActive = false;
    this.tapConfidence = 0;

    // Debug
    this.debugFrameCount = 0;

    console.log("🎵 FullSpectrumDropPredictor initialized (FFT bins:", this.fftSize, ")");
  }

  update() {
    if (!this.audioContext || this.audioContext.state !== 'running') {
      return null;
    }

    const now = Date.now();

    // Get both frequency and time-domain data
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.timeDomainData);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 1: Compute Multiple Onset Detection Functions
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // ODF 1: Spectral Flux (sum of positive spectral differences)
    let flux = 0;
    let weightedSum = 0;
    for (let i = 0; i < this.fftSize; i++) {
      const diff = this.frequencyData[i] - this.prevFrequencyData[i];
      // Weight bass more for beat detection
      const weight = i < this.fftSize * 0.15 ? 2.5 :  // Sub-bass/bass
                     i < this.fftSize * 0.4 ? 1.8 :    // Low-mid
                     1.0;                              // Mid/high
      if (diff > 0) {
        flux += diff * weight;
        weightedSum += weight;
      }
    }
    flux = weightedSum > 0 ? flux / weightedSum : 0;

    // ODF 2: High-Frequency Content (HFC) - sum of weighted magnitudes
    let hfc = 0;
    for (let i = 0; i < this.fftSize; i++) {
      hfc += this.frequencyData[i] * (i + 1); // Weight by bin number
    }
    hfc = hfc / (this.fftSize * 255); // Normalize

    // ODF 3: Phase Deviation (approximated by high-freq flux)
    let phaseDeviation = 0;
    const highFreqStart = Math.floor(this.fftSize * 0.5);
    for (let i = highFreqStart; i < this.fftSize; i++) {
      const diff = Math.abs(this.frequencyData[i] - this.prevFrequencyData[i]);
      phaseDeviation += diff;
    }
    phaseDeviation = phaseDeviation / (this.fftSize - highFreqStart);

    // Combined ODF (weighted sum of all ODFs)
    const combinedODF = (0.6 * flux) + (0.25 * hfc * 100) + (0.15 * phaseDeviation);

    // Track ODF histories
    this.fluxHistory.push(flux);
    this.hfcHistory.push(hfc);
    this.phaseHistory.push(phaseDeviation);
    this.combinedODFHistory.push(combinedODF);

    if (this.fluxHistory.length > this.maxODFHistory) {
      this.fluxHistory.shift();
      this.hfcHistory.shift();
      this.phaseHistory.shift();
      this.combinedODFHistory.shift();
    }

    // Adaptive threshold (using combined ODF)
    if (this.combinedODFHistory.length > 30) {
      const median = this.getMedian(this.combinedODFHistory);
      const std = Math.sqrt(this.getVariance(this.combinedODFHistory));
      // Less aggressive multiplier for better detection of clean signals (metronome, etc)
      this.onsetThreshold = Math.max(this.baseOnsetThreshold, median + 1.2 * std);
    }

    // Copy current to previous
    this.prevFrequencyData.set(this.frequencyData);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 2: ONSET DETECTION (using combined ODF)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const onset = combinedODF > this.onsetThreshold && (now - this.lastOnsetTime) > this.onsetCooldown;

    if (onset) {
      this.lastOnsetTime = now;
      this.onsetsDetected++;
      this.onsetTimes.push(now);
      this.onsetHistory.push(combinedODF);

      if (this.onsetTimes.length > this.maxOnsets) {
        this.onsetTimes.shift();
        this.onsetHistory.shift();
      }

      // Log first few onsets for debugging
      if (this.onsetsDetected <= 10 || this.onsetsDetected % 50 === 0) {
        console.log(`🎯 ONSET #${this.onsetsDetected}: ODF=${combinedODF.toFixed(1)} (threshold=${this.onsetThreshold.toFixed(1)}, ratio=${(combinedODF/this.onsetThreshold).toFixed(2)}x)`);
      }

      // Estimate BPM using autocorrelation
      this.estimateBPMAutocorrelation();
    }

    // === BEAT TRACKING ===
    const timeSinceLastBeat = now - this.lastBeatTime;
    // Use onset as phase lock when close to beat time
    let beat = false;

    // Calculate rough audio energy to detect silence
    let roughEnergy = 0;
    for (let i = 0; i < Math.min(this.fftSize, 100); i++) {
      roughEnergy += this.frequencyData[i];
    }
    roughEnergy = roughEnergy / (255 * 100); // Normalize to 0-1
    const isSilent = roughEnergy < 0.02; // Very low threshold for silence

    if (timeSinceLastBeat >= this.beatInterval * 0.85) {
      // Near beat time - accept onset as beat (phase-locking)
      if (onset && timeSinceLastBeat <= this.beatInterval * 1.15) {
        beat = true;
        // Phase lock: adjust beat time to onset
        this.lastBeatTime = now;
      } else if (timeSinceLastBeat >= this.beatInterval && !isSilent) {
        // Fallback: trigger beat based on tempo ONLY if there's actual audio
        // This prevents the "phantom pulse" during silence
        beat = true;
        this.lastBeatTime = now;
      }
    }

    let bar = false;
    let beatInBar = this.beatCount % 4;

    if (beat) {
      this.beatCount++;
      beatInBar = this.beatCount % 4;
      bar = (beatInBar === 0);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 3: Multi-Band RMS Energy Analysis
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const rms = this.computeMultiBandRMS();

    // Also track legacy energy metrics for compatibility
    let totalEnergy = 0;
    for (let i = 0; i < this.fftSize; i++) {
      totalEnergy += this.frequencyData[i];
    }
    totalEnergy /= this.fftSize;

    this.energyHistory.push(totalEnergy / 255);
    if (this.energyHistory.length > this.maxHistory) {
      this.energyHistory.shift();
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4: Energy Contour Analysis for Buildup Detection
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // Buildup detection using multi-band energy trends
    const bassTrend = this.computeTrend(this.rmsHistory.bass);
    const midTrend = this.computeTrend(this.rmsHistory.mid);
    const highTrend = this.computeTrend(this.rmsHistory.high);

    // Buildup = rising energy across all bands, especially mids and highs
    const buildupSignal = (0.3 * bassTrend) + (0.4 * midTrend) + (0.3 * highTrend);
    this.buildupIntensity = Math.max(0, Math.min(1, buildupSignal / 0.008)); // Normalize to 0-1

    // Require MUCH higher energy to avoid false positives in quiet sections
    const avgEnergy = (rms.bass + rms.mid + rms.high) / 3;
    const minEnergyThreshold = 0.20; // 20% of max energy (raised from 12%)

    // Count frames above buildup threshold
    const buildupThreshold = 0.40; // MUCH higher threshold (was 0.25)
    if (this.buildupIntensity > buildupThreshold && avgEnergy > minEnergyThreshold) {
      this.buildupFramesAboveThreshold++;
    } else {
      this.buildupFramesAboveThreshold = Math.max(0, this.buildupFramesAboveThreshold - 2);
    }

    // Detect buildup start/end - require SUSTAINED increase
    if (!this.inBuildup && this.buildupFramesAboveThreshold >= this.requiredBuildupFrames) {
      this.inBuildup = true;
      this.buildupStartTime = now;
      this.buildupsDetected++;
      console.log('🔥 BUILDUP STARTED!',
                  'Intensity:', this.buildupIntensity.toFixed(3),
                  'Energy:', avgEnergy.toFixed(2),
                  'Bass↑:', bassTrend.toFixed(4),
                  'Mid↑:', midTrend.toFixed(4),
                  'High↑:', highTrend.toFixed(4));
    }

    if (this.inBuildup) {
      const buildupDuration = (now - this.buildupStartTime) / 1000;

      // End if intensity drops below exit threshold OR too long
      if (this.buildupIntensity < 0.30 || buildupDuration > 12 ||
          this.buildupFramesAboveThreshold < this.requiredBuildupFrames / 2) {
        this.inBuildup = false;
        this.buildupFramesAboveThreshold = 0;
        console.log('🔥 Buildup ended (duration:', buildupDuration.toFixed(1) + 's)');
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 5: Drop Detection - STRICT MULTI-CONDITION APPROACH
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // Calculate individual indicators (but don't trigger on them individually)

    // 1. High-freq energy dropped significantly
    const prevHighEnergy = this.rmsHistory.high.length > 8 ?
      this.rmsHistory.high[this.rmsHistory.high.length - 8] : 0;
    const highFreqDrop = prevHighEnergy > 0.30 && rms.high < 0.15;

    // 2. Bass/sub-bass spike (comparing to history)
    const recentBassAvg = this.rmsHistory.bass.length > 30 ?
      this.rmsHistory.bass.slice(-30, -10).reduce((a, b) => a + b, 0) / 20 : 0;
    const bassSpike = (rms.bass - recentBassAvg) > 0.30 && rms.bass > 0.45;

    // 3. Strong onset detected
    const veryStrongOnset = onset && (combinedODF / this.onsetThreshold) > 3.0;

    // 4. High overall energy (not in a quiet section)
    const highEnergy = avgEnergy > 0.25;

    // Count how many indicators are true
    let dropScore = 0;
    if (highFreqDrop) dropScore++;
    if (bassSpike) dropScore++;
    if (veryStrongOnset) dropScore++;
    if (highEnergy) dropScore++;

    // REQUIRE at least 3 out of 4 indicators to trigger a drop
    // AND require high energy (no drops in quiet sections)
    const dropDetected = dropScore >= 3 && highEnergy;

    if (dropDetected && !this.dropWarning) {
      this.dropsDetected++;
      this.dropWarning = true;
      this.dropDetectedTime = now;
      console.log('💥 DROP DETECTED!',
                  'Score:', dropScore + '/4',
                  'HighFreqDrop:', highFreqDrop,
                  'BassSpike:', bassSpike,
                  'VeryStrongOnset:', veryStrongOnset,
                  'HighEnergy:', highEnergy,
                  'Total drops:', this.dropsDetected,
                  'RMS:', { bass: rms.bass.toFixed(2), mid: rms.mid.toFixed(2), high: rms.high.toFixed(2) });
    }

    // Predictive drop warning during buildup (also strict)
    if (this.inBuildup && !this.dropWarning) {
      const buildupDuration = (now - this.buildupStartTime) / 1000;

      // Only predict if buildup is strong AND sustained
      if (buildupDuration > 1.5 && this.buildupIntensity > 0.60) {
        // Predict drop at next bar boundary
        const msToNextBar = this.beatInterval * (4 - beatInBar);
        this.dropETA = msToNextBar / 1000;
        this.dropConfidence = Math.min(0.90, this.buildupIntensity * 0.8 + (buildupDuration - 1.5) * 0.05);
      }
    }

    // Clear drop warning after 600ms to allow detection of multiple drops
    if (this.dropWarning && (now - this.dropDetectedTime) > 600) {
      this.dropWarning = false;
      this.dropETA = null;
      this.dropConfidence = 0;
    }

    // Debug logging - ENHANCED for beat detection debugging
    this.debugFrameCount++;
    if (this.debugFrameCount % 180 === 0) {
      console.log('🎵 Analysis:', {
        bpm: this.bpm.toFixed(1),
        confidence: (this.beatConfidence * 100).toFixed(0) + '%',
        combinedODF: combinedODF.toFixed(1),
        odfThreshold: this.onsetThreshold.toFixed(1),
        odfRatio: (combinedODF / this.onsetThreshold).toFixed(2) + 'x',
        onsets: this.onsetsDetected,
        beats: this.beatCount,
        onsetHistory: this.onsetHistory.length,
        buildup: this.inBuildup,
        dropWarning: this.dropWarning
      });
    }

    return {
      enabled: true,

      // Onset
      onset: onset,
      onsetStrength: flux / this.onsetThreshold,
      spectralFlux: flux,

      // Beat tracking
      beat: beat,
      bar: bar,
      bpm: this.bpm,
      beatConfidence: this.beatConfidence,
      beatInBar: beatInBar,

      // Tap tempo
      tapActive: this.tapActive,
      tapBPM: this.tapBPM,
      tapConfidence: this.tapConfidence,
      tapTimes: this.tapTimes,

      // Buildup
      buildup: this.inBuildup,
      buildupIntensity: this.buildupIntensity,
      buildupDuration: this.inBuildup ? (now - this.buildupStartTime) / 1000 : 0,

      // Drop prediction
      dropWarning: this.dropWarning,
      dropETA: this.dropETA,
      dropConfidence: this.dropConfidence,

      // Stats
      stats: {
        onsetsDetected: this.onsetsDetected,
        beatsDetected: this.beatCount,
        barsDetected: Math.floor(this.beatCount / 4),
        buildupsDetected: this.buildupsDetected,
        dropsDetected: this.dropsDetected
      }
    };
  }

  /**
   * Autocorrelation-based BPM estimation (more robust than IOI)
   * Uses onset strength history to find periodic patterns
   */
  estimateBPMAutocorrelation() {
    // Skip BPM updates when tap tempo is active (user has manual control)
    if (this.tapActive) {
      return;
    }

    if (this.onsetHistory.length < 16) return;

    const signal = this.onsetHistory;
    const n = signal.length;

    // Compute autocorrelation for lag values corresponding to 60-180 BPM
    // At 60fps: 60 BPM = 1 beat/sec = 60 frames/beat
    //          180 BPM = 3 beats/sec = 20 frames/beat
    const minLag = Math.floor(60 / 3); // 180 BPM at 60fps = 20 frames
    const maxLag = Math.floor(60); // 60 BPM at 60fps = 60 frames

    // Need at least double the minimum lag for meaningful autocorrelation
    if (n < minLag * 2) return;

    // Store all correlations for harmonic analysis
    const correlations = [];

    for (let lag = minLag; lag <= Math.min(maxLag, Math.floor(n / 2)); lag++) {
      let correlation = 0;
      let count = 0;

      for (let i = 0; i < n - lag; i++) {
        correlation += signal[i] * signal[i + lag];
        count++;
      }

      correlation = count > 0 ? correlation / count : 0;
      correlations.push({ lag, correlation });
    }

    // Safety check: if no correlations computed, exit
    if (correlations.length === 0) return;

    // Find best lag with harmonic rejection
    // Prefer longer lags (lower BPMs) when they have similar strength
    correlations.sort((a, b) => b.correlation - a.correlation);

    let bestLag = correlations[0].lag;
    let maxCorrelation = correlations[0].correlation;

    // Check if there's a harmonic (multiple) of the top candidate
    // that's almost as strong - if so, prefer the longer lag (fundamental)
    for (let i = 1; i < Math.min(10, correlations.length); i++) {
      const candidate = correlations[i];
      // Check if this lag is roughly a multiple of bestLag (harmonic relationship)
      const ratio = candidate.lag / bestLag;

      // Check for common harmonic ratios: 2:1, 3:2, 4:3, 5:4
      const isHarmonic =
        (ratio >= 1.8 && ratio <= 2.2) ||   // 2:1 (octave)
        (ratio >= 1.4 && ratio <= 1.6) ||   // 3:2 (perfect fifth)
        (ratio >= 1.25 && ratio <= 1.4) ||  // 5:4 or 4:3
        (ratio >= 1.1 && ratio <= 1.25);    // Other close harmonics

      if (isHarmonic && candidate.correlation > maxCorrelation * 0.70) {
        // Found a strong harmonic peak - prefer it (lower BPM = fundamental)
        bestLag = candidate.lag;
        maxCorrelation = candidate.correlation;
        console.log(`🎵 Harmonic rejection: preferring lag ${bestLag} (${((60*60)/bestLag).toFixed(1)} BPM) over ${correlations[0].lag} (${((60*60)/correlations[0].lag).toFixed(1)} BPM), ratio: ${ratio.toFixed(2)}`);
        break;
      }
    }

    // Convert lag (in frames at 60fps) to BPM
    const estimatedBPM = (60 * 60) / bestLag; // 60 seconds * 60 fps / frames per beat

    // Only accept BPM in reasonable range for EDM (60-200)
    if (estimatedBPM >= 60 && estimatedBPM <= 200) {
      const prevBPM = this.bpm;

      // Two-phase smoothing: fast initial convergence, then stable locking
      const bpmDiff = Math.abs(estimatedBPM - prevBPM);
      let smoothingFactor;

      if (bpmDiff < 5) {
        // Very close to target - lock hard (high smoothing = slow change)
        smoothingFactor = 0.90;
      } else if (bpmDiff < 15) {
        // Moderately close - balance stability and responsiveness
        smoothingFactor = 0.70;
      } else {
        // Far from target - allow faster convergence
        smoothingFactor = 0.40;
      }

      this.bpm = this.bpm * smoothingFactor + estimatedBPM * (1 - smoothingFactor);

      // Limit maximum change per update (5 BPM max)
      const maxChange = 5;
      if (Math.abs(this.bpm - prevBPM) > maxChange) {
        this.bpm = prevBPM + Math.sign(this.bpm - prevBPM) * maxChange;
      }

      this.beatInterval = 60000 / this.bpm;

      // Compute confidence based on correlation strength
      // Normalize maxCorrelation relative to signal energy
      const signalEnergy = signal.reduce((sum, val) => sum + val * val, 0) / signal.length;
      this.beatConfidence = signalEnergy > 0 ?
        Math.max(0, Math.min(1, maxCorrelation / signalEnergy)) : 0;

      // Log BPM changes
      if (Math.abs(estimatedBPM - prevBPM) > 2) {
        console.log(`🎵 BPM updated: ${prevBPM.toFixed(1)} → ${this.bpm.toFixed(1)} (confidence: ${(this.beatConfidence * 100).toFixed(0)}%)`);
      }
    }
  }

  /**
   * Tap Tempo - manual BPM input via tapping
   * Call this method when user taps (e.g., keyboard press, button click)
   */
  tap() {
    const now = Date.now();

    // Reset if too much time has passed since last tap
    if (this.tapTimes.length > 0) {
      const timeSinceLastTap = now - this.tapTimes[this.tapTimes.length - 1];
      if (timeSinceLastTap > this.tapTimeout) {
        this.tapTimes = [];
        this.tapActive = false;
        console.log("🎹 Tap tempo reset (timeout)");
      }
    }

    // Add this tap
    this.tapTimes.push(now);

    // Need at least 2 taps to calculate BPM
    if (this.tapTimes.length >= 2) {
      // Calculate intervals between taps
      const intervals = [];
      for (let i = 1; i < this.tapTimes.length; i++) {
        intervals.push(this.tapTimes[i] - this.tapTimes[i - 1]);
      }

      // Average interval in milliseconds
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

      // Convert to BPM (60000 ms per minute)
      const tapBPM = 60000 / avgInterval;

      // Only accept reasonable BPM values (60-200)
      if (tapBPM >= 60 && tapBPM <= 200) {
        this.tapBPM = tapBPM;
        this.tapActive = true;

        // Confidence increases with more taps (up to maxTaps)
        this.tapConfidence = Math.min(1.0, intervals.length / (this.maxTaps - 1));

        // Override automatic BPM detection with tap tempo
        this.bpm = this.tapBPM;
        this.beatInterval = 60000 / this.bpm;
        this.beatConfidence = this.tapConfidence;

        console.log(`🎹 Tap ${this.tapTimes.length}/${this.maxTaps}: BPM = ${this.tapBPM.toFixed(1)} (confidence: ${(this.tapConfidence * 100).toFixed(0)}%, avg interval: ${avgInterval.toFixed(0)}ms) [LOCKED - autocorrelation disabled]`);
      }

      // Keep only last maxTaps
      if (this.tapTimes.length > this.maxTaps) {
        this.tapTimes.shift();
      }
    } else {
      console.log("🎹 Tap 1 - tap again to set tempo");
    }
  }

  /**
   * Reset tap tempo
   */
  resetTapTempo() {
    this.tapTimes = [];
    this.tapBPM = null;
    this.tapActive = false;
    this.tapConfidence = 0;
    console.log("🎹 Tap tempo cleared");
  }

  /**
   * Compute multi-band RMS energy
   * Returns energy levels for different frequency bands
   */
  computeMultiBandRMS() {
    const sampleRate = this.audioContext.sampleRate;
    const nyquist = sampleRate / 2;
    const binWidth = nyquist / this.fftSize;

    // Helper to get bin index for a frequency
    const freqToBin = (freq) => Math.floor(freq / binWidth);

    const bands = {
      sub: { start: freqToBin(20), end: freqToBin(60) },      // Sub-bass
      bass: { start: freqToBin(60), end: freqToBin(250) },    // Bass
      low: { start: freqToBin(250), end: freqToBin(500) },    // Low-mid
      mid: { start: freqToBin(500), end: freqToBin(2000) },   // Mid
      high: { start: freqToBin(2000), end: freqToBin(6000) }, // High-mid
      pres: { start: freqToBin(6000), end: this.fftSize }     // Presence
    };

    const rms = {};
    for (const [name, range] of Object.entries(bands)) {
      let sum = 0;
      const count = range.end - range.start;
      for (let i = range.start; i < range.end && i < this.fftSize; i++) {
        sum += this.frequencyData[i] * this.frequencyData[i];
      }
      rms[name] = Math.sqrt(sum / count) / 255; // Normalize to 0-1

      // Track history
      this.rmsHistory[name].push(rms[name]);
      if (this.rmsHistory[name].length > this.maxRMSHistory) {
        this.rmsHistory[name].shift();
      }
    }

    return rms;
  }

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

  getHUDData() {
    return {
      prediction: {
        warning: this.dropWarning,
        eta: this.dropETA,
        confidence: this.dropConfidence
      },
      beats: {
        bpm: this.bpm,
        confidence: this.beatConfidence,
        beatCount: this.beatCount,
        barCount: Math.floor(this.beatCount / 4)
      },
      buildup: {
        active: this.inBuildup,
        intensity: this.buildupIntensity
      },
      stats: {
        dropsDetected: this.dropsDetected,
        onsets: this.onsetsDetected,
        buildups: this.buildupsDetected
      }
    };
  }

  reset() {
    this.onsetHistory = [];
    this.onsetTimes = [];
    this.beatCount = 0;
    this.lastBeatTime = Date.now();
    this.energyHistory = [];
    this.highFreqHistory = [];
    this.bassHistory = [];

    // Clear ODF histories
    this.fluxHistory = [];
    this.hfcHistory = [];
    this.phaseHistory = [];
    this.combinedODFHistory = [];

    // Clear RMS histories
    for (const band in this.rmsHistory) {
      this.rmsHistory[band] = [];
    }

    this.inBuildup = false;
    this.dropWarning = false;
    this.dropsDetected = 0;
    this.dropDetectedTime = 0;
    this.onsetsDetected = 0;
    this.buildupsDetected = 0;
    this.buildupFramesAboveThreshold = 0;
    this.prevHighFreqEnergy = 0;
    this.prevTotalEnergy = 0;
    console.log('🎵 FullSpectrumDropPredictor reset (Professional Edition)');
  }
}

console.log("✅ audioAnalysisFull.js ready");
