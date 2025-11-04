console.log("🔬 realFeatureExtractor.js loaded");

/**
 * MMPA Real Feature Extractor - Phase 4
 *
 * The empirical measurement engine. Uses Meyda.js to analyze live audio
 * and extract the six universal features from actual sound.
 *
 * Philosophy:
 * - This is where perception begins
 * - The instrument measures "what is" in the signal
 * - Pure empirical observation, no interpretation (that's MappingLayer's job)
 *
 * Maps Meyda features → MMPA 6-category structure:
 * - IDENTITY: What is it? (pitch, harmonics, strength)
 * - RELATIONSHIP: How does it relate? (consonance, complexity, ratios)
 * - COMPLEXITY: How dense is it? (centroid, bandwidth, brightness)
 * - TRANSFORMATION: How fast is it changing? (flux, velocity, acceleration)
 * - ALIGNMENT: How synchronized is it? (coherence, stability, synchrony)
 * - POTENTIAL: How unpredictable is it? (entropy, unpredictability, freedom)
 */

import Meyda from 'meyda';
import { getAudioContext, getAnalyzerNode, getSampleRate, getFFTSize } from './audioInput.js';

// Meyda analyzer instance
let meydaAnalyzer = null;

// Feature history for temporal analysis (velocity, acceleration, stability)
const historyLength = 10;
const featureHistory = {
  centroid: [],
  flux: [],
  rms: [],
  spectralPeaks: []
};

// Manual spectral flux calculation (to avoid Meyda's initial frame errors)
let previousSpectrum = null;

// Current extracted features (updated every frame)
let currentFeatures = {
  timestamp: Date.now(),
  signal: {
    source: 'none',
    sampleRate: 44100,
    bufferSize: 2048
  },
  features: {
    identity: {
      fundamentalFreq: 440.0,
      harmonics: [440, 880, 1320],
      strength: 0.0
    },
    relationship: {
      ratios: ["2:1", "3:2"],
      consonance: 0.5,
      complexity: 0
    },
    complexity: {
      centroid: 1000.0,
      bandwidth: 1000.0,
      brightness: 0.5
    },
    transformation: {
      flux: 0.0,
      velocity: 0.0,
      acceleration: 0.0
    },
    alignment: {
      coherence: 0.5,
      stability: 0.5,
      synchrony: 0.5
    },
    potential: {
      entropy: 0.5,
      unpredictability: 0.5,
      freedom: 0.5
    }
  }
};

/**
 * Initialize real feature extraction with Meyda
 */
export function initRealExtractor() {
  const audioContext = getAudioContext();
  const analyzerNode = getAnalyzerNode();

  if (!audioContext || !analyzerNode) {
    console.error("🔬 Cannot init extractor: Audio context not ready");
    return false;
  }

  // Configure Meyda to extract all needed features
  // NOTE: spectralFlux removed - we calculate it manually to avoid initial frame errors
  meydaAnalyzer = Meyda.createMeydaAnalyzer({
    audioContext: audioContext,
    source: analyzerNode,
    bufferSize: getFFTSize(),
    featureExtractors: [
      'rms',                // Root Mean Square (amplitude)
      'spectralCentroid',   // Center of mass of spectrum
      'spectralFlatness',   // Measure of noisiness
      'spectralSlope',      // Tilt of spectrum
      'spectralRolloff',    // 85% of spectral energy
      'spectralSpread',     // Bandwidth around centroid
      'zcr',                // Zero Crossing Rate
      'chroma',             // Pitch class distribution
      'energy'              // Sum of squared magnitudes
    ],
    callback: analyzeMeydaFeatures
  });

  console.log("🔬 Real feature extractor initialized");
  return true;
}

/**
 * Start real-time feature extraction
 */
export function startExtraction() {
  if (!meydaAnalyzer) {
    initRealExtractor();
  }

  if (meydaAnalyzer) {
    meydaAnalyzer.start();
    currentFeatures.signal.source = 'live';
    console.log("🔬 Feature extraction started");
    return true;
  }

  return false;
}

/**
 * Stop real-time feature extraction
 */
export function stopExtraction() {
  if (meydaAnalyzer) {
    meydaAnalyzer.stop();
    currentFeatures.signal.source = 'none';
    previousSpectrum = null; // Reset for clean restart
    console.log("🔬 Feature extraction stopped");
  }
}

// Debug counter for logging
let meydaCallbackCounter = 0;

/**
 * Calculate spectral flux manually (avoids Meyda's initial frame errors)
 * Spectral flux = sum of squared differences between consecutive spectra
 */
function calculateSpectralFlux() {
  const analyzer = getAnalyzerNode();
  if (!analyzer) return 0;

  // Get current spectrum
  const bufferLength = analyzer.frequencyBinCount;
  const currentSpectrum = new Float32Array(bufferLength);
  analyzer.getFloatFrequencyData(currentSpectrum);

  // If no previous frame, store current and return 0
  if (!previousSpectrum) {
    previousSpectrum = new Float32Array(currentSpectrum);
    return 0;
  }

  // Calculate sum of squared differences
  let flux = 0;
  for (let i = 0; i < bufferLength; i++) {
    const diff = currentSpectrum[i] - previousSpectrum[i];
    flux += diff * diff;
  }

  // Normalize and store current spectrum for next frame
  flux = Math.sqrt(flux / bufferLength);
  previousSpectrum = new Float32Array(currentSpectrum);

  return flux;
}

/**
 * Meyda callback - called every buffer with extracted features
 * This is where Meyda features are mapped to MMPA 6 categories
 */
function analyzeMeydaFeatures(features) {
  if (!features) return;

  // Wrap in try-catch to handle any unexpected errors
  try {
    currentFeatures.timestamp = Date.now();
    currentFeatures.signal.sampleRate = getSampleRate();
    currentFeatures.signal.bufferSize = getFFTSize();

    // Calculate manual spectral flux first (for debug logging)
    const manualFlux = calculateSpectralFlux();

    // Debug logging every 2 seconds (assuming ~20 callbacks per second)
    meydaCallbackCounter++;
    if (meydaCallbackCounter % 40 === 0) {
      console.log('🔬 Meyda callback active:', {
        rms: features.rms?.toFixed(3),
        centroid: features.spectralCentroid?.toFixed(1),
        manualFlux: manualFlux?.toFixed(3),
        flatness: features.spectralFlatness?.toFixed(3)
      });
    }

  // ===================================================================
  // 1. IDENTITY → Pitch and Harmonic Content
  // ===================================================================

  // Estimate fundamental frequency from spectral peaks and RMS
  const fundamentalFreq = estimateFundamentalFreq(features);
  const harmonics = estimateHarmonics(fundamentalFreq);

  // Pitch strength: RMS amplitude × spectral clarity (inverse of flatness)
  const strength = Math.min(1.0, features.rms * 2 * (1 - features.spectralFlatness));

  currentFeatures.features.identity = {
    fundamentalFreq: fundamentalFreq || 440.0,
    harmonics: harmonics,
    strength: strength
  };

  // ===================================================================
  // 2. RELATIONSHIP → Harmonic Relationships
  // ===================================================================

  // Consonance: Use chroma features to measure harmonic clarity
  // High chroma concentration = consonant (pure intervals)
  // Spread chroma = dissonant (complex intervals)
  const consonance = features.chroma ? calculateConsonance(features.chroma) : 0.5;

  // Complexity: Count of prominent spectral peaks
  const complexity = countSpectralPeaks(features);

  // Ratios: Extract frequency ratios from top spectral peaks
  const ratios = extractHarmonicRatios(fundamentalFreq, harmonics);

  currentFeatures.features.relationship = {
    ratios: ratios,
    consonance: consonance,
    complexity: complexity
  };

  // ===================================================================
  // 3. COMPLEXITY → Spectral Density
  // ===================================================================

  currentFeatures.features.complexity = {
    centroid: features.spectralCentroid || 1000.0,
    bandwidth: features.spectralSpread || 1000.0,
    brightness: Math.min(1.0, (features.spectralRolloff || 5000) / 10000)
  };

  // Store centroid history for velocity calculation
  updateHistory(featureHistory.centroid, features.spectralCentroid);

  // ===================================================================
  // 4. TRANSFORMATION → Rate of Change
  // ===================================================================

  // Use manual spectral flux (already calculated above)
  const flux = Math.min(1.0, manualFlux / 50); // Normalize to 0-1 range

  // Velocity: Change in centroid over time (first derivative)
  const velocity = calculateVelocity(featureHistory.centroid);

  // Acceleration: Change in velocity over time (second derivative)
  const acceleration = calculateAcceleration(featureHistory.centroid);

  currentFeatures.features.transformation = {
    flux: flux,
    velocity: velocity,
    acceleration: acceleration
  };

  // Store flux history
  updateHistory(featureHistory.flux, flux);

  // ===================================================================
  // 5. ALIGNMENT → Temporal Coherence
  // ===================================================================

  // Coherence: Inverse of spectral flatness (tonal = coherent, noisy = incoherent)
  const coherence = 1 - features.spectralFlatness;

  // Stability: Inverse of RMS variance (steady amplitude = stable)
  updateHistory(featureHistory.rms, features.rms);
  const stability = 1 - calculateVariance(featureHistory.rms);

  // Synchrony: Regularity of zero crossings (periodic = synchronous)
  const synchrony = 1 - Math.min(1.0, features.zcr / 200);

  currentFeatures.features.alignment = {
    coherence: coherence,
    stability: stability,
    synchrony: synchrony
  };

  // ===================================================================
  // 6. POTENTIAL → Unpredictability
  // ===================================================================

  // Entropy: Spectral flatness (white noise = high entropy)
  const entropy = features.spectralFlatness;

  // Unpredictability: Variance of spectral flux
  const unpredictability = calculateVariance(featureHistory.flux);

  // Freedom: Bandwidth relative to centroid (wide spread = more freedom)
  const freedom = Math.min(1.0, (features.spectralSpread || 1000) / (features.spectralCentroid || 1000));

  currentFeatures.features.potential = {
    entropy: entropy,
    unpredictability: unpredictability,
    freedom: freedom
  };

  } catch (error) {
    // Silently handle any unexpected errors
    // Features will keep their previous values until valid data is available
    if (meydaCallbackCounter <= 5) {
      console.log('🔬 Meyda warming up... (initial frame errors are normal)');
    } else {
      // Log errors after warmup period for debugging
      console.warn('🔬 Meyda callback error:', error.message);
    }
  }
}

/**
 * Estimate fundamental frequency from spectral data
 * Uses RMS threshold and spectral centroid as proxy
 */
function estimateFundamentalFreq(features) {
  // Simple heuristic: use centroid as fundamental when energy is high
  if (features.rms < 0.01) return 440.0; // Silence = default A440

  // Map centroid to fundamental (rough estimate)
  // Real pitch detection would use autocorrelation or YIN algorithm
  const freq = features.spectralCentroid * 0.5; // Centroid is typically higher than fundamental
  return Math.max(20, Math.min(20000, freq));
}

/**
 * Generate harmonic series from fundamental
 */
function estimateHarmonics(fundamental) {
  return [
    fundamental,
    fundamental * 2,
    fundamental * 3,
    fundamental * 4,
    fundamental * 5
  ].slice(0, 3); // Return first 3 harmonics
}

/**
 * Calculate consonance from chroma features
 * Pure intervals (octaves, fifths) have high chroma concentration
 */
function calculateConsonance(chroma) {
  if (!chroma || chroma.length === 0) return 0.5;

  // Find maximum chroma value
  const maxChroma = Math.max(...chroma);

  // Calculate concentration: how dominant is the strongest pitch class
  const concentration = maxChroma / (chroma.reduce((a, b) => a + b, 0) / chroma.length);

  return Math.min(1.0, concentration / 3); // Normalize to 0-1
}

/**
 * Count number of prominent spectral peaks (simple version)
 * Real implementation would use peak detection algorithm
 */
function countSpectralPeaks(features) {
  // Use spectral slope and spread as proxy for harmonic complexity
  const slope = Math.abs(features.spectralSlope || 0);
  const spread = features.spectralSpread || 1000;

  // More spread + less slope = more peaks
  const peakEstimate = Math.floor((spread / 1000) * (1 + slope * 100));
  return Math.max(1, Math.min(10, peakEstimate));
}

/**
 * Extract harmonic ratios from fundamental and harmonics
 */
function extractHarmonicRatios(fundamental, harmonics) {
  const ratios = [];
  for (let i = 1; i < harmonics.length; i++) {
    const ratio = harmonics[i] / fundamental;
    ratios.push(`${Math.round(ratio)}:1`);
  }
  return ratios.length > 0 ? ratios : ["2:1"];
}

/**
 * Calculate velocity (first derivative) from history
 */
function calculateVelocity(history) {
  if (history.length < 2) return 0.0;

  const current = history[history.length - 1];
  const previous = history[history.length - 2];
  const delta = Math.abs(current - previous);

  return Math.min(1.0, delta / 1000); // Normalize
}

/**
 * Calculate acceleration (second derivative) from history
 */
function calculateAcceleration(history) {
  if (history.length < 3) return 0.0;

  const v1 = Math.abs(history[history.length - 1] - history[history.length - 2]);
  const v2 = Math.abs(history[history.length - 2] - history[history.length - 3]);
  const deltaV = Math.abs(v1 - v2);

  return Math.min(1.0, deltaV / 500); // Normalize
}

/**
 * Calculate variance of a history array
 */
function calculateVariance(history) {
  if (history.length < 2) return 0.0;

  const mean = history.reduce((a, b) => a + b, 0) / history.length;
  const variance = history.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / history.length;

  return Math.min(1.0, Math.sqrt(variance) / mean); // Normalized coefficient of variation
}

/**
 * Update rolling history buffer
 */
function updateHistory(historyArray, value) {
  if (value !== undefined && !isNaN(value)) {
    historyArray.push(value);
    if (historyArray.length > historyLength) {
      historyArray.shift();
    }
  }
}

/**
 * Get current features (called by main app)
 */
export function getCurrentFeatures() {
  return currentFeatures;
}

/**
 * Check if extraction is active
 */
export function isExtracting() {
  return currentFeatures.signal.source === 'live';
}

/**
 * Debug function: Log current features
 */
export function debugRealExtractor() {
  console.log("🔬 REAL FEATURE EXTRACTOR DEBUG");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Features:", currentFeatures);
  console.log("Extracting:", isExtracting());
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

console.log("🔬 RealFeatureExtractor ready - The instrument can now perceive");
