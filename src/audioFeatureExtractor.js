/**
 * Audio MMPA Feature Extractor
 *
 * Maps audio analysis features to MMPA structure for archetype recognition.
 * Runs in parallel with financialFeatureExtractor.js - user can switch modes.
 */

console.log("🎵 audioFeatureExtractor.js loaded");

/**
 * Map audio data to MMPA feature structure
 * @param {Object} audioData - { bands: { bass, mid, treble, level }, features: {...}, spectrum: [...] }
 * @returns {Object} - MMPA-compatible feature structure
 */
export function extractAudioMMPAFeatures(audioData) {
  const bands = audioData.bands || { bass: 0, mid: 0, treble: 0, level: 0 };
  const features = audioData.features || {};
  const spectrum = audioData.spectrum || [];

  // Extract RMS amplitude (signal strength)
  const rms = features.rms || bands.level || 0;

  // Calculate harmonic strength (consonance) from spectral centroid and RMS
  // High centroid + high RMS = bright, consonant sound
  // Low centroid or low RMS = dull or quiet
  const spectralCentroid = features.spectralCentroid || 0.5;
  const zcr = features.zcr || 0.5; // Zero crossing rate: lower = more tonal/harmonic

  // Consonance: combine spectral brightness with tonality (inverse of ZCR)
  // Range: 0-1, where 1 = highly consonant/harmonic
  const consonance = Math.min(1,
    (spectralCentroid * 0.4) +      // Brightness contributes to consonance
    ((1 - zcr) * 0.3) +              // Low ZCR = tonal = consonant
    (rms * 0.3)                      // Audible signal strength
  );

  // Calculate spectral flux (rate of change in spectrum)
  // This represents transformation/chaos
  const spectralFlux = features.spectralFlux || calculateSpectralFlux(spectrum);

  // Pitch strength from bands (bass = low freq, treble = high freq)
  const pitchStrength = (bands.bass * 0.5) + (bands.mid * 0.3) + (bands.treble * 0.2);

  // Spectral spread (bandwidth) as measure of complexity
  const spectralSpread = features.spectralSpread || 0.5;

  // Entropy from spectral flatness (flat spectrum = high entropy = noise-like)
  const spectralFlatness = features.spectralFlatness || 0.5;
  const entropy = spectralFlatness; // Already 0-1

  return {
    enabled: true,
    source: 'audio',

    // Identity: fundamental frequency and harmonics
    identity: {
      fundamentalFreq: features.fundamentalFreq || 440,  // Hz
      harmonics: features.harmonics || [440, 880, 1320],
      strength: rms,  // Signal strength (RMS amplitude)
      pitch: pitchStrength  // Pitch clarity
    },

    // Relationship: harmonic consonance
    relationship: {
      ratios: features.harmonicRatios || ["2:1", "3:2", "4:3"],
      consonance: consonance,  // 🎯 KEY FIX: Audio-based consonance, not financial!
      complexity: Math.floor((1 - consonance) * 10)  // Inverse of consonance
    },

    // Complexity: spectral characteristics
    complexity: {
      centroid: (spectralCentroid * 3000) + 500,  // Map to Hz range 500-3500
      bandwidth: spectralSpread * 2000,
      brightness: spectralCentroid  // 0-1
    },

    // Transformation: rate of change
    transformation: {
      flux: spectralFlux,  // 🎯 KEY FIX: Audio spectral flux, not stock flux!
      velocity: features.onset ? 0.8 : 0.15,  // Higher during onsets
      acceleration: 0.03
    },

    // Alignment: temporal coherence
    alignment: {
      coherence: 1 - zcr,  // Low ZCR = high coherence (tonal)
      stability: consonance,  // Same as consonance for audio
      synchrony: features.beat ? 0.9 : 0.5  // High when beat detected
    },

    // Potential: unpredictability/entropy
    potential: {
      entropy: entropy,  // Spectral flatness
      unpredictability: spectralFlux,  // Rate of change
      freedom: spectralSpread  // Spectral bandwidth
    }
  };
}

/**
 * Calculate spectral flux from spectrum
 * (Fallback if not provided in features)
 */
let lastSpectrum = null;
function calculateSpectralFlux(spectrum) {
  if (!spectrum || spectrum.length === 0) return 0;

  if (!lastSpectrum) {
    lastSpectrum = [...spectrum];
    return 0;
  }

  let flux = 0;
  for (let i = 0; i < Math.min(spectrum.length, lastSpectrum.length); i++) {
    const diff = spectrum[i] - lastSpectrum[i];
    if (diff > 0) flux += diff;  // Only positive changes
  }

  lastSpectrum = [...spectrum];
  return Math.min(flux / spectrum.length, 1.0);  // Normalize
}

/**
 * Debug: Log audio features vs financial features
 */
export function logFeatureComparison(audioFeatures, financialFeatures) {
  console.log('🎵 Audio vs Financial Features:');
  console.log('  Audio consonance:', audioFeatures.relationship.consonance.toFixed(3));
  console.log('  Financial consonance:', financialFeatures.relationship.consonance.toFixed(3));
  console.log('  Audio flux:', audioFeatures.transformation.flux.toFixed(3));
  console.log('  Financial flux:', financialFeatures.transformation.flux.toFixed(3));
}
