console.log("🎼 pitchDetector.js loaded");

/**
 * Pitch Detection and Harmonic Analysis Module
 *
 * Extracts musical information from FFT spectrum:
 * - 12-tone chromatic pitch class profile (C, C#, D, etc.)
 * - Dominant pitch detection (root note)
 * - Major/minor mode detection
 * - Key strength measurement
 * - Diatonic scale degree mapping (7 faces for chestahedron)
 *
 * Based on chromagram analysis technique from Music Information Retrieval.
 */

// ============================================================================
// CONSTANTS
// ============================================================================

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Frequency range for analysis
const MIN_FREQ = 55;    // A1
const MAX_FREQ = 4186;  // C8

// Minimum amplitude threshold (normalized 0-255)
const MIN_AMPLITUDE = 10;

// Diatonic scale degrees (intervals from root)
// Major scale: Root, Maj2, Maj3, P4, P5, Maj6, Maj7
const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

// Minor scale: Root, Maj2, Min3, P4, P5, Min6, Min7
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

// Scale degree names
const SCALE_DEGREE_NAMES = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

// ============================================================================
// PITCH DETECTION
// ============================================================================

/**
 * Analyzes FFT spectrum to extract chromatic pitch profile
 *
 * @param {Uint8Array} spectrum - FFT frequency data (0-255)
 * @param {number} sampleRate - Audio sample rate (e.g., 48000)
 * @param {number} nyquist - Nyquist frequency (sampleRate / 2)
 * @returns {Object} Pitch analysis result
 */
export function analyzePitchSpectrum(spectrum, sampleRate, nyquist) {
  // 12-tone chromagram (pitch class profile)
  const pitchClasses = new Array(12).fill(0);

  // Accumulate energy for each pitch class across all octaves
  for (let i = 0; i < spectrum.length; i++) {
    const freq = (i / spectrum.length) * nyquist;

    if (freq >= MIN_FREQ && freq <= MAX_FREQ && spectrum[i] > MIN_AMPLITUDE) {
      // Convert frequency to MIDI note number
      const midiNote = 12 * Math.log2(freq / 440.0) + 69;

      // Get pitch class (0-11, where 0=C, 1=C#, etc.)
      const pitchClass = Math.round(midiNote) % 12;

      if (pitchClass >= 0 && pitchClass < 12) {
        // Weight by amplitude
        pitchClasses[pitchClass] += spectrum[i] / 255;
      }
    }
  }

  // Find dominant pitch class
  let maxEnergy = 0;
  let dominantPitch = 0;
  let totalEnergy = 0;

  for (let i = 0; i < 12; i++) {
    totalEnergy += pitchClasses[i];
    if (pitchClasses[i] > maxEnergy) {
      maxEnergy = pitchClasses[i];
      dominantPitch = i;
    }
  }

  // Calculate key strength (how dominant is the peak vs. average)
  const avgEnergy = totalEnergy / 12;
  const strength = totalEnergy > 0 ? (maxEnergy / avgEnergy) / 3 : 0; // Normalize roughly to 0-1
  const strengthPercent = Math.min(100, strength * 100);

  // Determine major vs. minor by checking triad intervals
  // Major triad: root (0), major third (+4 semitones), perfect fifth (+7 semitones)
  // Minor triad: root (0), minor third (+3 semitones), perfect fifth (+7 semitones)
  const majorThird = pitchClasses[(dominantPitch + 4) % 12];
  const minorThird = pitchClasses[(dominantPitch + 3) % 12];
  const fifth = pitchClasses[(dominantPitch + 7) % 12];

  // Determine mode
  let mode = 'unknown';
  let isMajor = false;
  let isMinor = false;

  if (totalEnergy > 1) { // Only determine mode if we have enough signal
    if (majorThird > minorThird && fifth > avgEnergy) {
      mode = 'major';
      isMajor = true;
    } else if (minorThird > majorThird && fifth > avgEnergy) {
      mode = 'minor';
      isMinor = true;
    }
  }

  // Get detected key string
  const keyName = NOTE_NAMES[dominantPitch];
  const keyWithMode = mode !== 'unknown'
    ? `${keyName} ${mode === 'major' ? 'Maj' : 'Min'}`
    : keyName;

  return {
    // Raw chromatic data
    pitchClasses,            // Array[12] - energy per chromatic note
    chromaticNotes: NOTE_NAMES,

    // Dominant pitch
    rootNote: dominantPitch,  // 0-11 (0=C)
    rootNoteName: keyName,

    // Mode detection
    mode,                     // 'major', 'minor', or 'unknown'
    isMajor,
    isMinor,

    // Key detection
    detectedKey: keyWithMode,

    // Strength metrics
    totalEnergy,
    maxEnergy,
    avgEnergy,
    strength,                 // 0-1
    strengthPercent,          // 0-100

    // Triad analysis
    triad: {
      majorThird,
      minorThird,
      fifth
    }
  };
}

// ============================================================================
// DIATONIC MAPPING (7 Scale Degrees for Chestahedron Faces)
// ============================================================================

/**
 * Maps 12 chromatic pitch classes to 7 diatonic scale degrees
 *
 * This is the key function for chestahedron face mapping.
 * Returns energy distribution across the 7 scale degrees.
 *
 * @param {Object} pitchAnalysis - Result from analyzePitchSpectrum()
 * @returns {Object} Diatonic mapping for 7 faces
 */
export function mapToDiatonicScale(pitchAnalysis) {
  const { pitchClasses, rootNote, mode, totalEnergy } = pitchAnalysis;

  // Choose scale intervals based on detected mode
  const scaleIntervals = mode === 'minor' ? MINOR_SCALE_INTERVALS : MAJOR_SCALE_INTERVALS;

  // Array to store energy for each scale degree (7 faces)
  const scaleDegreeEnergy = new Array(7).fill(0);

  // Map chromatic pitch classes to diatonic scale degrees
  for (let degree = 0; degree < 7; degree++) {
    const interval = scaleIntervals[degree];
    const chromaticIndex = (rootNote + interval) % 12;
    scaleDegreeEnergy[degree] = pitchClasses[chromaticIndex];
  }

  // Normalize to 0-1 range
  const maxScaleDegreeEnergy = Math.max(...scaleDegreeEnergy);
  const normalizedScaleDegrees = scaleDegreeEnergy.map(e =>
    maxScaleDegreeEnergy > 0 ? e / maxScaleDegreeEnergy : 0
  );

  // Get note names for each scale degree
  const scaleDegreeNotes = scaleIntervals.map(interval =>
    NOTE_NAMES[(rootNote + interval) % 12]
  );

  return {
    // 7 faces data
    scaleDegreeEnergy,           // Raw energy values
    scaleDegreeEnergyNormalized: normalizedScaleDegrees,  // 0-1 normalized
    scaleDegreeNames: SCALE_DEGREE_NAMES,
    scaleDegreeNotes,            // Actual note names (C, D, E, etc.)

    // Scale info
    rootNote: pitchAnalysis.rootNoteName,
    mode: mode !== 'unknown' ? mode : 'major', // Default to major if unknown
    scaleIntervals,

    // Metrics
    totalEnergy: totalEnergy,
    maxDegreeEnergy: maxScaleDegreeEnergy,

    // Dominant scale degree
    dominantDegree: normalizedScaleDegrees.indexOf(Math.max(...normalizedScaleDegrees)),
    dominantDegreeEnergy: Math.max(...normalizedScaleDegrees)
  };
}

// ============================================================================
// COMPLETE ANALYSIS (All-in-One Function)
// ============================================================================

/**
 * Complete pitch and harmonic analysis
 *
 * @param {Uint8Array} spectrum - FFT frequency data
 * @param {number} sampleRate - Audio sample rate
 * @param {number} nyquist - Nyquist frequency
 * @returns {Object} Complete analysis with chromatic and diatonic data
 */
export function analyzeHarmonicContent(spectrum, sampleRate, nyquist) {
  // Step 1: Chromatic analysis (12 tones)
  const chromatic = analyzePitchSpectrum(spectrum, sampleRate, nyquist);

  // Step 2: Diatonic mapping (7 scale degrees)
  const diatonic = mapToDiatonicScale(chromatic);

  return {
    chromatic,
    diatonic,

    // Quick access fields
    detectedKey: chromatic.detectedKey,
    rootNote: chromatic.rootNoteName,
    mode: chromatic.mode,
    strength: chromatic.strength,

    // For HUD display
    display: {
      key: chromatic.detectedKey,
      confidence: chromatic.strengthPercent.toFixed(0) + '%',
      totalEnergy: chromatic.totalEnergy
    }
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get color for a note based on Newton-Scriabin color theory
 * Maps chromatic notes to colors for visualization
 *
 * @param {number} pitchClass - 0-11 (0=C)
 * @returns {string} Hex color
 */
export function getNoteColor(pitchClass) {
  // Newton-Scriabin chromatic color mapping (research-based)
  const colors = [
    '#FF0000', // C - Red
    '#FF4500', // C# - Red-Orange
    '#FFA500', // D - Orange
    '#FFD700', // D# - Gold
    '#FFFF00', // E - Yellow
    '#7FFF00', // F - Chartreuse
    '#00FF00', // F# - Green
    '#00FF7F', // G - Spring Green
    '#00FFFF', // G# - Cyan
    '#1E90FF', // A - Blue
    '#9370DB', // A# - Purple
    '#FF00FF'  // B - Magenta
  ];

  return colors[pitchClass % 12];
}

/**
 * Get color for a scale degree (for 7 chestahedron faces)
 *
 * @param {number} degree - 0-6 (I-VII)
 * @param {string} rootNote - Root note name (e.g., 'C')
 * @param {string} mode - 'major' or 'minor'
 * @returns {string} Hex color
 */
export function getScaleDegreeColor(degree, rootNote, mode = 'major') {
  const rootIndex = NOTE_NAMES.indexOf(rootNote);
  const scaleIntervals = mode === 'minor' ? MINOR_SCALE_INTERVALS : MAJOR_SCALE_INTERVALS;
  const chromaticIndex = (rootIndex + scaleIntervals[degree]) % 12;

  return getNoteColor(chromaticIndex);
}

console.log("🎼 pitchDetector.js ready - Chromatic & Diatonic Analysis");
