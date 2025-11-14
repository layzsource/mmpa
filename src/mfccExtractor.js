// MFCC Extractor - Real-time Mel-Frequency Cepstral Coefficients
// Extracts timbral features from audio for manifold visualization

console.log('🎵 mfccExtractor.js loaded');

/**
 * MFCCExtractor - Computes Mel-Frequency Cepstral Coefficients from audio
 *
 * MFCCs capture the spectral envelope (timbre) of audio signals.
 * They're computed by:
 * 1. FFT → frequency spectrum
 * 2. Mel filterbank → perceptually-spaced frequency bands
 * 3. Log → logarithmic magnitude
 * 4. DCT → decorrelated coefficients
 */
export class MFCCExtractor {
  constructor(options = {}) {
    // Configuration
    this.numCoefficients = options.numCoefficients || 13; // Standard: 13 MFCCs
    this.numMelFilters = options.numMelFilters || 26;     // Standard: 26 mel bands
    this.fftSize = options.fftSize || 2048;
    this.sampleRate = options.sampleRate || 44100;

    // Frequency range for mel filterbank
    this.minFreq = options.minFreq || 0;
    this.maxFreq = options.maxFreq || this.sampleRate / 2;

    // Precompute mel filterbank
    this.melFilterbank = this.createMelFilterbank();

    // Precompute DCT matrix
    this.dctMatrix = this.createDCTMatrix();

    console.log(`🎵 MFCC Extractor initialized: ${this.numCoefficients} coefficients, ${this.numMelFilters} mel filters`);
  }

  /**
   * Convert frequency (Hz) to mel scale
   * Mel scale approximates human pitch perception
   */
  hzToMel(hz) {
    return 2595 * Math.log10(1 + hz / 700);
  }

  /**
   * Convert mel scale to frequency (Hz)
   */
  melToHz(mel) {
    return 700 * (Math.pow(10, mel / 2595) - 1);
  }

  /**
   * Create mel-scaled triangular filterbank
   * Returns array of filters, each filter is array of weights
   */
  createMelFilterbank() {
    const numBins = this.fftSize / 2 + 1;
    const melMin = this.hzToMel(this.minFreq);
    const melMax = this.hzToMel(this.maxFreq);

    // Equally-spaced mel frequencies
    const melPoints = [];
    for (let i = 0; i < this.numMelFilters + 2; i++) {
      melPoints.push(melMin + (melMax - melMin) * i / (this.numMelFilters + 1));
    }

    // Convert mel points to FFT bin indices
    const binPoints = melPoints.map(mel => {
      const hz = this.melToHz(mel);
      return Math.floor((this.fftSize + 1) * hz / this.sampleRate);
    });

    // Create triangular filters
    const filterbank = [];
    for (let i = 1; i <= this.numMelFilters; i++) {
      const filter = new Float32Array(numBins);
      const leftBin = binPoints[i - 1];
      const centerBin = binPoints[i];
      const rightBin = binPoints[i + 1];

      // Rising slope
      for (let j = leftBin; j < centerBin; j++) {
        filter[j] = (j - leftBin) / (centerBin - leftBin);
      }

      // Falling slope
      for (let j = centerBin; j < rightBin; j++) {
        filter[j] = (rightBin - j) / (rightBin - centerBin);
      }

      filterbank.push(filter);
    }

    return filterbank;
  }

  /**
   * Create Discrete Cosine Transform (DCT-II) matrix
   * Used to decorrelate mel filterbank energies
   */
  createDCTMatrix() {
    const matrix = [];
    const norm = Math.sqrt(2 / this.numMelFilters);

    for (let i = 0; i < this.numCoefficients; i++) {
      const row = [];
      for (let j = 0; j < this.numMelFilters; j++) {
        row.push(norm * Math.cos(Math.PI * i * (j + 0.5) / this.numMelFilters));
      }
      matrix.push(row);
    }

    return matrix;
  }

  /**
   * Extract MFCCs from frequency spectrum (FFT output)
   * @param {Float32Array} spectrum - Magnitude spectrum from FFT
   * @returns {Float32Array} - MFCC coefficients
   */
  extract(spectrum) {
    // 1. Apply mel filterbank
    const melEnergies = new Float32Array(this.numMelFilters);
    for (let i = 0; i < this.numMelFilters; i++) {
      let energy = 0;
      const filter = this.melFilterbank[i];

      for (let j = 0; j < spectrum.length; j++) {
        energy += spectrum[j] * filter[j];
      }

      // Log energy (add small epsilon to avoid log(0))
      melEnergies[i] = Math.log(Math.max(energy, 1e-10));
    }

    // 2. Apply DCT to get MFCCs
    const mfccs = new Float32Array(this.numCoefficients);
    for (let i = 0; i < this.numCoefficients; i++) {
      let coeff = 0;
      for (let j = 0; j < this.numMelFilters; j++) {
        coeff += melEnergies[j] * this.dctMatrix[i][j];
      }
      mfccs[i] = coeff;
    }

    return mfccs;
  }

  /**
   * Extract MFCCs from Web Audio API AnalyserNode
   * @param {AnalyserNode} analyser - Web Audio API analyser
   * @returns {Float32Array} - MFCC coefficients
   */
  extractFromAnalyser(analyser) {
    // Get frequency data from analyser
    const frequencyData = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(frequencyData);

    // Convert dB to linear magnitude
    const spectrum = new Float32Array(frequencyData.length);
    for (let i = 0; i < frequencyData.length; i++) {
      spectrum[i] = Math.pow(10, frequencyData[i] / 20); // dB to linear
    }

    return this.extract(spectrum);
  }
}

/**
 * AudioFeatureAnalyzer - Extracts additional audio features
 * Amplitude, reverb, spectral flux, zero-crossing rate, spectral centroid
 */
export class AudioFeatureAnalyzer {
  constructor() {
    this.previousSpectrum = null;
    this.previousTimeDomain = null;

    console.log('🎵 Audio Feature Analyzer initialized');
  }

  /**
   * Calculate RMS amplitude (energy)
   * @param {Float32Array} timeDomainData - Time-domain samples
   * @returns {number} - RMS amplitude (0 to 1)
   */
  calculateAmplitude(timeDomainData) {
    let sumSquares = 0;
    for (let i = 0; i < timeDomainData.length; i++) {
      sumSquares += timeDomainData[i] * timeDomainData[i];
    }
    return Math.sqrt(sumSquares / timeDomainData.length);
  }

  /**
   * Estimate reverb/decay time
   * Uses spectral decay in high frequencies as proxy
   * @param {Float32Array} spectrum - Magnitude spectrum
   * @returns {number} - Reverb amount (0 to 1)
   */
  estimateReverb(spectrum) {
    // Compare high-frequency energy to total energy
    // Reverberant signals have more high-frequency content
    const midPoint = Math.floor(spectrum.length / 2);

    let lowEnergy = 0;
    let highEnergy = 0;

    for (let i = 0; i < midPoint; i++) {
      lowEnergy += spectrum[i];
    }

    for (let i = midPoint; i < spectrum.length; i++) {
      highEnergy += spectrum[i];
    }

    const totalEnergy = lowEnergy + highEnergy;
    if (totalEnergy < 1e-10) return 0;

    // Reverb increases high-frequency ratio
    return Math.min(1.0, highEnergy / (lowEnergy + 1e-10) * 0.5);
  }

  /**
   * Calculate spectral flux (rate of spectral change)
   * Useful for onset detection and transient identification
   * @param {Float32Array} spectrum - Current magnitude spectrum
   * @returns {number} - Spectral flux (0 to 1+)
   */
  calculateSpectralFlux(spectrum) {
    if (!this.previousSpectrum) {
      this.previousSpectrum = new Float32Array(spectrum);
      return 0;
    }

    let flux = 0;
    for (let i = 0; i < spectrum.length; i++) {
      const diff = spectrum[i] - this.previousSpectrum[i];
      // Only count increases (half-wave rectified)
      flux += Math.max(0, diff);
    }

    // Update previous spectrum
    this.previousSpectrum.set(spectrum);

    // Normalize by spectrum length
    return flux / spectrum.length;
  }

  /**
   * Calculate zero-crossing rate
   * Distinguishes noisy (high ZCR) from tonal (low ZCR) content
   * @param {Float32Array} timeDomainData - Time-domain samples
   * @returns {number} - Zero-crossing rate (0 to 1)
   */
  calculateZeroCrossingRate(timeDomainData) {
    let crossings = 0;
    for (let i = 1; i < timeDomainData.length; i++) {
      if ((timeDomainData[i] >= 0 && timeDomainData[i - 1] < 0) ||
          (timeDomainData[i] < 0 && timeDomainData[i - 1] >= 0)) {
        crossings++;
      }
    }

    // Normalize by sample count
    return crossings / (timeDomainData.length - 1);
  }

  /**
   * Calculate spectral centroid (brightness)
   * Center of mass of spectrum - higher = brighter
   * @param {Float32Array} spectrum - Magnitude spectrum
   * @returns {number} - Spectral centroid (0 to 1, normalized)
   */
  calculateSpectralCentroid(spectrum) {
    let weightedSum = 0;
    let totalMagnitude = 0;

    for (let i = 0; i < spectrum.length; i++) {
      weightedSum += i * spectrum[i];
      totalMagnitude += spectrum[i];
    }

    if (totalMagnitude < 1e-10) return 0;

    const centroid = weightedSum / totalMagnitude;

    // Normalize to 0-1
    return centroid / spectrum.length;
  }

  /**
   * Calculate spectral rolloff
   * Frequency below which 85% of energy is contained
   * @param {Float32Array} spectrum - Magnitude spectrum
   * @returns {number} - Spectral rolloff (0 to 1, normalized)
   */
  calculateSpectralRolloff(spectrum) {
    let totalEnergy = 0;
    for (let i = 0; i < spectrum.length; i++) {
      totalEnergy += spectrum[i];
    }

    const threshold = totalEnergy * 0.85;
    let cumulativeEnergy = 0;

    for (let i = 0; i < spectrum.length; i++) {
      cumulativeEnergy += spectrum[i];
      if (cumulativeEnergy >= threshold) {
        return i / spectrum.length;
      }
    }

    return 1.0;
  }

  /**
   * Extract all features from Web Audio API analyser
   * @param {AnalyserNode} analyser - Web Audio API analyser
   * @returns {Object} - All extracted features
   */
  extractAllFeatures(analyser) {
    // Get frequency data
    const frequencyData = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(frequencyData);

    // Convert dB to linear magnitude
    const spectrum = new Float32Array(frequencyData.length);
    for (let i = 0; i < frequencyData.length; i++) {
      spectrum[i] = Math.pow(10, frequencyData[i] / 20);
    }

    // Get time-domain data
    const timeDomainData = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(timeDomainData);

    return {
      amplitude: this.calculateAmplitude(timeDomainData),
      reverb: this.estimateReverb(spectrum),
      spectralFlux: this.calculateSpectralFlux(spectrum),
      zeroCrossingRate: this.calculateZeroCrossingRate(timeDomainData),
      spectralCentroid: this.calculateSpectralCentroid(spectrum),
      spectralRolloff: this.calculateSpectralRolloff(spectrum),
      spectrum: spectrum,
      timeDomain: timeDomainData
    };
  }
}

console.log('✅ MFCC Extractor ready');
