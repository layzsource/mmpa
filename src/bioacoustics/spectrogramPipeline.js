// Spectrogram → Differential Forms Pipeline
// Phase 2: Real-time audio processing for bioacoustic analysis
// Converts audio signal to time-frequency representation, then to differential forms

console.log('🎵 spectrogramPipeline.js loaded');

/**
 * Spectrogram Pipeline
 *
 * Flow: Audio → FFT → Spectrogram → Differential Forms → Manifold
 *
 * Features:
 * - Real-time FFT analysis
 * - Mel-scale frequency binning (perceptually relevant)
 * - Time-windowing with overlap
 * - Conversion to phase space coordinates
 */
export class SpectrogramPipeline {
  constructor(audioContext, fftSize = 2048) {
    console.log('🎵 Initializing Spectrogram Pipeline...');

    this.audioContext = audioContext;
    this.fftSize = fftSize;
    this.hopSize = fftSize / 4; // 75% overlap

    // Create analyzer node
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = this.fftSize;
    this.analyser.smoothingTimeConstant = 0.3;

    // Frequency data buffers
    this.frequencyData = new Float32Array(this.analyser.frequencyBinCount);
    this.timeDomainData = new Float32Array(this.analyser.fftSize);

    // Spectrogram storage (circular buffer)
    this.spectrogramMaxFrames = 100; // Keep last 100 frames
    this.spectrogram = [];

    // Mel-scale filterbank
    this.numMelBins = 128;
    this.melFilterbank = this.createMelFilterbank();

    // Phase space mapping
    this.frequencyToPosition = (freq) => Math.log(1 + freq / 100); // Log scale
    this.amplitudeToMomentum = (amp) => amp; // Linear for now

    console.log(`🎵 Pipeline initialized: FFT size ${this.fftSize}, ${this.numMelBins} mel bins`);
  }

  /**
   * Create Mel-scale filterbank
   * Converts linear frequency bins to perceptually-relevant mel scale
   *
   * @returns {Array<Float32Array>} Mel filterbank matrix
   */
  createMelFilterbank() {
    const filterbank = [];
    const sampleRate = this.audioContext.sampleRate;
    const numFreqBins = this.analyser.frequencyBinCount;

    // Mel scale conversion functions
    const hzToMel = (hz) => 2595 * Math.log10(1 + hz / 700);
    const melToHz = (mel) => 700 * (Math.pow(10, mel / 2595) - 1);

    const minMel = hzToMel(0);
    const maxMel = hzToMel(sampleRate / 2);
    const melStep = (maxMel - minMel) / (this.numMelBins + 1);

    // Create triangular filters
    for (let m = 0; m < this.numMelBins; m++) {
      const filter = new Float32Array(numFreqBins);

      const melLow = minMel + m * melStep;
      const melCenter = minMel + (m + 1) * melStep;
      const melHigh = minMel + (m + 2) * melStep;

      const fLow = melToHz(melLow);
      const fCenter = melToHz(melCenter);
      const fHigh = melToHz(melHigh);

      // Map mel frequencies to FFT bins
      for (let k = 0; k < numFreqBins; k++) {
        const freq = (k * sampleRate) / (2 * numFreqBins);

        if (freq >= fLow && freq <= fCenter) {
          filter[k] = (freq - fLow) / (fCenter - fLow);
        } else if (freq > fCenter && freq <= fHigh) {
          filter[k] = (fHigh - freq) / (fHigh - fCenter);
        }
      }

      filterbank.push(filter);
    }

    console.log(`🎵 Created ${this.numMelBins}-band mel filterbank`);
    return filterbank;
  }

  /**
   * Connect audio source to pipeline
   *
   * @param {AudioNode} source - Audio source (microphone, audio element, etc.)
   */
  connect(source) {
    source.connect(this.analyser);
    console.log('🎵 Audio source connected to pipeline');
  }

  /**
   * Process current audio frame
   * Extracts FFT, converts to mel spectrogram, stores in buffer
   *
   * @returns {object} {melSpectrogram, frequencyData}
   */
  processFrame() {
    // Get frequency domain data
    this.analyser.getFloatFrequencyData(this.frequencyData);

    // Convert to linear amplitude (from dB)
    const linearAmplitudes = new Float32Array(this.frequencyData.length);
    for (let i = 0; i < this.frequencyData.length; i++) {
      // Convert dB to linear: A = 10^(dB/20)
      linearAmplitudes[i] = Math.pow(10, this.frequencyData[i] / 20);
    }

    // Apply mel filterbank
    const melSpectrogram = this.applyMelFilterbank(linearAmplitudes);

    // Add to spectrogram buffer (circular)
    this.spectrogram.push(melSpectrogram);
    if (this.spectrogram.length > this.spectrogramMaxFrames) {
      this.spectrogram.shift();
    }

    return {
      melSpectrogram,
      frequencyData: linearAmplitudes,
      timestamp: this.audioContext.currentTime
    };
  }

  /**
   * Apply mel filterbank to linear frequency spectrum
   *
   * @param {Float32Array} spectrum - Linear frequency spectrum
   * @returns {Float32Array} Mel-binned spectrum
   */
  applyMelFilterbank(spectrum) {
    const melSpectrum = new Float32Array(this.numMelBins);

    for (let m = 0; m < this.numMelBins; m++) {
      let sum = 0;
      for (let k = 0; k < spectrum.length; k++) {
        sum += spectrum[k] * this.melFilterbank[m][k];
      }
      melSpectrum[m] = sum;
    }

    return melSpectrum;
  }

  /**
   * Get full spectrogram as flat array for differential forms computation
   *
   * @returns {object} {spectrogram: Float32Array, numFrames: number}
   */
  getSpectrogramFlat() {
    const numFrames = this.spectrogram.length;
    const totalSize = numFrames * this.numMelBins;
    const flatSpectrogram = new Float32Array(totalSize);

    for (let t = 0; t < numFrames; t++) {
      for (let f = 0; f < this.numMelBins; f++) {
        flatSpectrogram[t * this.numMelBins + f] = this.spectrogram[t][f];
      }
    }

    return {
      spectrogram: flatSpectrogram,
      numFrames,
      numBins: this.numMelBins
    };
  }

  /**
   * Convert spectrogram to phase space coordinates
   * Maps (time, frequency, amplitude) → (t, q, p)
   *
   * @returns {Array<object>} Phase space points [{t, q, p, energy}, ...]
   */
  toPhaseSpace() {
    const phaseSpacePoints = [];

    for (let t = 0; t < this.spectrogram.length; t++) {
      for (let f = 0; f < this.numMelBins; f++) {
        const amplitude = this.spectrogram[t][f];

        if (amplitude > 1e-6) { // Skip near-zero values
          const q = this.frequencyToPosition(f); // Position
          const p = this.amplitudeToMomentum(amplitude); // Momentum
          const energy = (p * p + q * q) / 2; // Harmonic oscillator Hamiltonian

          phaseSpacePoints.push({
            time: t,
            q,
            p,
            energy,
            frequency: f,
            amplitude
          });
        }
      }
    }

    return phaseSpacePoints;
  }

  /**
   * Extract audio features for manifold parameters
   *
   * @returns {object} {bass, mid, treble, centroid, spread}
   */
  extractFeatures() {
    if (this.spectrogram.length === 0) {
      return { bass: 0, mid: 0, treble: 0, centroid: 0, spread: 0 };
    }

    // Use most recent frame
    const frame = this.spectrogram[this.spectrogram.length - 1];

    // Split into bass/mid/treble
    const bassEnd = Math.floor(this.numMelBins * 0.25);
    const midEnd = Math.floor(this.numMelBins * 0.6);

    let bassSum = 0, midSum = 0, trebleSum = 0;

    for (let i = 0; i < bassEnd; i++) bassSum += frame[i];
    for (let i = bassEnd; i < midEnd; i++) midSum += frame[i];
    for (let i = midEnd; i < this.numMelBins; i++) trebleSum += frame[i];

    const total = bassSum + midSum + trebleSum + 1e-10;

    // Spectral centroid (center of mass)
    let centroidSum = 0, totalEnergy = 0;
    for (let i = 0; i < this.numMelBins; i++) {
      centroidSum += i * frame[i];
      totalEnergy += frame[i];
    }
    const centroid = totalEnergy > 0 ? centroidSum / totalEnergy / this.numMelBins : 0.5;

    // Spectral spread (standard deviation)
    let spreadSum = 0;
    for (let i = 0; i < this.numMelBins; i++) {
      const diff = i / this.numMelBins - centroid;
      spreadSum += diff * diff * frame[i];
    }
    const spread = totalEnergy > 0 ? Math.sqrt(spreadSum / totalEnergy) : 0;

    return {
      bass: bassSum / total,
      mid: midSum / total,
      treble: trebleSum / total,
      centroid,
      spread
    };
  }

  /**
   * Clear spectrogram buffer
   */
  clear() {
    this.spectrogram = [];
    console.log('🎵 Spectrogram buffer cleared');
  }

  /**
   * Get pipeline state
   */
  getState() {
    return {
      fftSize: this.fftSize,
      numMelBins: this.numMelBins,
      spectrogramFrames: this.spectrogram.length,
      maxFrames: this.spectrogramMaxFrames,
      sampleRate: this.audioContext.sampleRate
    };
  }
}

console.log('🎵 Spectrogram Pipeline module ready');
