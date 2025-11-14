// 🎹 Synth Pitch to Archetype Mapper
// Maps synth frequencies to MMPA archetypes based on musical intervals

/**
 * Global variable to store current synth frequency
 * Set this when the synth plays a note, null when stopped
 */
export let currentSynthFrequency = null;

/**
 * Set the current synth frequency (called by synthEngine)
 */
export function setSynthFrequency(frequency) {
  currentSynthFrequency = frequency;
  console.log(`🎹 Synth frequency set:`, frequency ? `${frequency.toFixed(2)} Hz` : 'null');
}

/**
 * Check if synth mode is active (synth is playing)
 */
export function isSynthMode() {
  return currentSynthFrequency !== null;
}

/**
 * Map frequency to nearest note name and MMPA archetype
 * Based on equal temperament (A4 = 440 Hz)
 *
 * Musical interval archetypes (from MMPA theory):
 * - Unison/Octave → NEUTRAL_STATE (perfect stability)
 * - Perfect Fifth (7 semitones) → PURE_HARMONY (most consonant)
 * - Perfect Fourth (5 semitones) → HIGH_HARMONY (consonant)
 * - Major Third (4 semitones) → HIGH_HARMONY (consonant)
 * - Minor Third (3 semitones) → BALANCED (moderate)
 * - Major Second (2 semitones) → HIGH_CHAOS (mildly dissonant)
 * - Minor Second (1 semitone) → PURE_CHAOS (very dissonant)
 * - Tritone (6 semitones) → PURE_CHAOS (devil's interval)
 */
export function frequencyToArchetype(frequency) {
  if (!frequency || frequency <= 0) return 'NEUTRAL_STATE';

  // Convert frequency to MIDI note number
  const midiNote = 12 * Math.log2(frequency / 440) + 69;

  // Get semitones from C (mod 12 for interval within octave)
  const semitones = Math.round(midiNote) % 12;

  // Map intervals to archetypes
  const intervalMap = {
    0: 'NEUTRAL_STATE',   // C - Unison
    1: 'PURE_CHAOS',      // C# - Minor second (dissonant)
    2: 'HIGH_CHAOS',      // D - Major second
    3: 'BALANCED',        // D# - Minor third
    4: 'HIGH_HARMONY',    // E - Major third (consonant)
    5: 'HIGH_HARMONY',    // F - Perfect fourth
    6: 'PURE_CHAOS',      // F# - Tritone (devil's interval)
    7: 'PURE_HARMONY',    // G - Perfect fifth (most consonant)
    8: 'BALANCED',        // G# - Minor sixth
    9: 'HIGH_HARMONY',    // A - Major sixth
    10: 'HIGH_CHAOS',     // A# - Minor seventh
    11: 'BALANCED'        // B - Major seventh
  };

  const noteName = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][semitones];
  const archetype = intervalMap[semitones] || 'NEUTRAL_STATE';

  console.log(`🎵 Frequency ${frequency.toFixed(2)} Hz → MIDI ${midiNote.toFixed(2)} → Note ${noteName} (semitone ${semitones}) → ${archetype}`);

  return archetype;
}

/**
 * Get archetype for the current synth frequency
 */
export function getSynthArchetype() {
  if (!isSynthMode()) return null;
  return frequencyToArchetype(currentSynthFrequency);
}

console.log('🎹 synthPitchMapper.js loaded');
