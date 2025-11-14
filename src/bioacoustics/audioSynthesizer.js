// Audio Synthesizer: Transform Species via Frequency Shift
// Phase 5: Cross-species audio synthesis and translation
// Generates audio from differential forms + currents with frequency scaling

console.log('🎵 audioSynthesizer.js loaded');

/**
 * Audio Synthesizer
 *
 * Purpose:
 * - Synthesize audio from bioacoustic signatures
 * - Apply frequency-shift transformations (bird → whale, whale → bird)
 * - Real-time morphing between species
 * - "Translation" playback for cross-species comparison
 *
 * Method:
 * - Use 2-forms to generate amplitude envelope
 * - Use 1-currents to generate frequency contours
 * - Apply frequency shift factor from species comparison
 * - Use Web Audio API for synthesis
 */
export class AudioSynthesizer {
  constructor(audioContext) {
    console.log('🎵 Initializing Audio Synthesizer...');

    this.audioContext = audioContext;

    // Synthesis parameters
    this.params = {
      duration: 2.0, // seconds
      baseFrequency: 440, // Hz (A4)
      carrierType: 'sine', // oscillator type
      modulationDepth: 0.3,
      attackTime: 0.1,
      releaseTime: 0.2
    };

    // Current playback state
    this.isPlaying = false;
    this.currentSource = null;

    console.log('🎵 Audio Synthesizer initialized');
  }

  /**
   * Synthesize audio from species signature
   *
   * @param {object} signature - Bioacoustic signature (from speciesLibrary)
   * @param {number} frequencyShift - Frequency multiplier (default 1.0)
   * @returns {AudioBuffer} Synthesized audio
   */
  synthesizeFromSignature(signature, frequencyShift = 1.0) {
    console.log(`🎵 Synthesizing audio (freq shift: ${frequencyShift.toFixed(2)}x)...`);

    if (!signature || !signature.forms) {
      console.error('🎵 Invalid signature data');
      return null;
    }

    const sampleRate = this.audioContext.sampleRate;
    const duration = this.params.duration;
    const numSamples = Math.floor(sampleRate * duration);

    // Create audio buffer
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
    const channelData = buffer.getChannelData(0);

    // Extract form and current data
    const twoForms = signature.forms.twoForms || [];
    const currents = signature.currents[1] || []; // 1-currents for frequency modulation

    // Generate audio from forms and currents
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate; // Time in seconds
      const phase = t / duration; // Normalized phase (0 to 1)

      // Get amplitude from 2-forms
      const amplitude = this.getAmplitudeFromForms(twoForms, phase);

      // Get frequency modulation from currents
      const freqMod = this.getFrequencyFromCurrents(currents, phase);

      // Apply frequency shift
      const shiftedFreq = this.params.baseFrequency * frequencyShift * (1 + freqMod);

      // Generate carrier wave
      const carrier = Math.sin(2 * Math.PI * shiftedFreq * t);

      // Apply amplitude envelope (ADSR)
      const envelope = this.getEnvelope(phase);

      // Combine: amplitude × envelope × carrier
      channelData[i] = amplitude * envelope * carrier * 0.3; // Scale to prevent clipping
    }

    console.log(`🎵 Synthesized ${numSamples} samples (${duration}s)`);
    return buffer;
  }

  /**
   * Extract amplitude from 2-forms
   *
   * @param {Array} twoForms - 2-form data
   * @param {number} phase - Normalized time (0-1)
   * @returns {number} Amplitude (0-1)
   */
  getAmplitudeFromForms(twoForms, phase) {
    if (!twoForms || twoForms.length === 0) {
      return 0.5; // Default amplitude
    }

    // Map phase to form index
    const frameIndex = Math.floor(phase * twoForms.length);
    const frame = twoForms[Math.min(frameIndex, twoForms.length - 1)];

    if (!frame || frame.length === 0) {
      return 0.5;
    }

    // Average form values in frame
    let sum = 0;
    for (const form of frame) {
      const value = form.value || form || 0;
      sum += Math.abs(value);
    }

    const avgValue = sum / frame.length;

    // Normalize to 0-1 range (forms can be negative)
    return Math.min(1.0, Math.max(0.0, avgValue * 0.5 + 0.5));
  }

  /**
   * Extract frequency modulation from 1-currents
   *
   * @param {Array} currents - 1-current trajectories
   * @param {number} phase - Normalized time (0-1)
   * @returns {number} Frequency modulation factor (-1 to 1)
   */
  getFrequencyFromCurrents(currents, phase) {
    if (!currents || currents.length === 0) {
      return 0; // No modulation
    }

    // Use first current for simplicity
    const current = currents[0];
    if (!current.points || current.points.length === 0) {
      return 0;
    }

    // Map phase to current point
    const pointIndex = Math.floor(phase * current.points.length);
    const point = current.points[Math.min(pointIndex, current.points.length - 1)];

    // Use momentum (p) for frequency modulation
    const p = point.p || 0;

    // Normalize to -1 to 1 range
    return Math.tanh(p); // Smooth sigmoid-like mapping
  }

  /**
   * ADSR envelope
   *
   * @param {number} phase - Normalized time (0-1)
   * @returns {number} Envelope amplitude (0-1)
   */
  getEnvelope(phase) {
    const attackTime = this.params.attackTime / this.params.duration;
    const releaseTime = this.params.releaseTime / this.params.duration;
    const sustainLevel = 0.8;

    if (phase < attackTime) {
      // Attack
      return (phase / attackTime) * sustainLevel;
    } else if (phase > 1 - releaseTime) {
      // Release
      return ((1 - phase) / releaseTime) * sustainLevel;
    } else {
      // Sustain
      return sustainLevel;
    }
  }

  /**
   * Translate species A to species B's frequency range
   *
   * @param {string} sourceSpeciesId - Source species
   * @param {string} targetSpeciesId - Target species
   * @param {object} library - SpeciesLibrary instance
   * @returns {AudioBuffer|null} Translated audio
   */
  translateSpecies(sourceSpeciesId, targetSpeciesId, library) {
    console.log(`🎵 Translating ${sourceSpeciesId} → ${targetSpeciesId}...`);

    const sourceSpecies = library.getSpecies(sourceSpeciesId);
    const targetSpecies = library.getSpecies(targetSpeciesId);

    if (!sourceSpecies || !targetSpecies) {
      console.error('🎵 Species not found');
      return null;
    }

    if (sourceSpecies.signatures.length === 0) {
      console.error(`🎵 No signatures for ${sourceSpeciesId}`);
      return null;
    }

    // Get source signature
    const sourceSignature = sourceSpecies.signatures[0];

    // Calculate frequency shift
    const freqShift = library.computeFrequencyShift(sourceSpecies, targetSpecies);

    console.log(`🎵 Frequency shift: ${freqShift.toFixed(2)}x`);

    // Synthesize with frequency shift
    return this.synthesizeFromSignature(sourceSignature, freqShift);
  }

  /**
   * Play synthesized audio buffer
   *
   * @param {AudioBuffer} buffer - Audio buffer to play
   * @param {Function} onEnd - Callback when playback ends
   */
  play(buffer, onEnd) {
    if (!buffer) {
      console.error('🎵 No buffer to play');
      return;
    }

    // Stop any current playback
    this.stop();

    console.log('🎵 Playing synthesized audio...');

    // Create buffer source
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;

    // Create gain node for volume control
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0.5; // 50% volume

    // Connect: source → gain → destination
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Set up end callback
    source.onended = () => {
      console.log('🎵 Playback ended');
      this.isPlaying = false;
      this.currentSource = null;
      if (onEnd) onEnd();
    };

    // Start playback
    source.start(0);
    this.isPlaying = true;
    this.currentSource = source;
  }

  /**
   * Stop current playback
   */
  stop() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {
        // Already stopped
      }
      this.currentSource = null;
    }
    this.isPlaying = false;
  }

  /**
   * Morph between two species
   *
   * @param {string} speciesA - First species
   * @param {string} speciesB - Second species
   * @param {number} morphFactor - Blend factor (0 = A, 1 = B)
   * @param {object} library - SpeciesLibrary instance
   * @returns {AudioBuffer|null} Morphed audio
   */
  morphSpecies(speciesA, speciesB, morphFactor, library) {
    console.log(`🎵 Morphing ${speciesA} ↔ ${speciesB} (factor: ${morphFactor.toFixed(2)})...`);

    const specA = library.getSpecies(speciesA);
    const specB = library.getSpecies(speciesB);

    if (!specA || !specB) {
      console.error('🎵 Species not found');
      return null;
    }

    if (specA.signatures.length === 0 || specB.signatures.length === 0) {
      console.error('🎵 Missing signatures');
      return null;
    }

    // Calculate intermediate frequency shift
    const freqShiftA = 1.0;
    const freqShiftB = library.computeFrequencyShift(specA, specB);
    const freqShift = freqShiftA + (freqShiftB - freqShiftA) * morphFactor;

    // For simplicity, use species A's signature with interpolated frequency
    const signature = specA.signatures[0];

    return this.synthesizeFromSignature(signature, freqShift);
  }

  /**
   * Update synthesis parameters
   *
   * @param {object} params - Parameter updates
   */
  updateParams(params) {
    Object.assign(this.params, params);
    console.log('🎵 Parameters updated:', this.params);
  }

  /**
   * Get current state
   *
   * @returns {object} Synthesizer state
   */
  getState() {
    return {
      isPlaying: this.isPlaying,
      params: { ...this.params }
    };
  }

  /**
   * Clean up resources
   */
  dispose() {
    this.stop();
    console.log('🎵 Synthesizer disposed');
  }
}

console.log('🎵 Audio Synthesizer module ready');
