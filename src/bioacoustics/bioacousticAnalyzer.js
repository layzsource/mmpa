// Bioacoustic Analyzer: Complete Pipeline Integration
// Phase 2: Main coordinating module for bioacoustic analysis
// Integrates spectrogram → forms → homology → comparison

import { DifferentialFormsComputer } from './differentialForms.js';
import { SpectrogramPipeline } from './spectrogramPipeline.js';
import { HomologicalIntegrator } from './homology.js';
import { SpeciesLibrary } from './speciesLibrary.js';

console.log('🧬 bioacousticAnalyzer.js loaded');

/**
 * Bioacoustic Analyzer
 *
 * Complete pipeline for cross-species bioacoustic analysis:
 * 1. Audio → Spectrogram (via SpectrogramPipeline)
 * 2. Spectrogram → Differential Forms (via DifferentialFormsComputer)
 * 3. Forms → Currents (trajectory extraction)
 * 4. Persistent Homology (topological features)
 * 5. Homological Integration (compare via ⟨T, α⟩)
 * 6. Species Comparison (cross-species similarity)
 */
export class BioacousticAnalyzer {
  constructor(audioContext) {
    console.log('🧬 Initializing Bioacoustic Analyzer...');

    this.audioContext = audioContext;

    // Core modules
    this.spectrogram = new SpectrogramPipeline(audioContext);
    this.formsComputer = new DifferentialFormsComputer();
    this.homology = new HomologicalIntegrator();
    this.library = new SpeciesLibrary();

    // Analysis state
    this.isAnalyzing = false;
    this.analysisInterval = null;
    this.updateRate = 100; // ms

    // Current analysis results
    this.currentAnalysis = null;

    console.log('🧬 Bioacoustic Analyzer initialized');
  }

  /**
   * Connect audio source and start analysis
   *
   * @param {AudioNode} source - Audio source (microphone, audio element)
   */
  connect(source) {
    this.spectrogram.connect(source);
    console.log('🧬 Audio source connected');
  }

  /**
   * Start real-time bioacoustic analysis
   */
  startAnalysis() {
    if (this.isAnalyzing) {
      console.warn('🧬 Analysis already running');
      return;
    }

    console.log('🧬 Starting bioacoustic analysis...');
    this.isAnalyzing = true;

    this.analysisInterval = setInterval(() => {
      this.processFrame();
    }, this.updateRate);
  }

  /**
   * Stop real-time analysis
   */
  stopAnalysis() {
    if (!this.isAnalyzing) return;

    console.log('🧬 Stopping bioacoustic analysis...');
    this.isAnalyzing = false;

    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
  }

  /**
   * Process single audio frame through complete pipeline
   */
  processFrame() {
    // 1. Extract spectrogram frame
    const frameData = this.spectrogram.processFrame();

    // 2. Check if we have enough frames for analysis
    if (this.spectrogram.spectrogram.length < 10) {
      return; // Need more data
    }

    // 3. Get full spectrogram
    const spectrogramData = this.spectrogram.getSpectrogramFlat();

    // 4. Compute differential forms
    const forms = this.formsComputer.computeFormsFromSpectrogram(
      spectrogramData.spectrogram,
      spectrogramData.numFrames
    );

    // 5. Extract phase space representation
    const phaseSpace = this.spectrogram.toPhaseSpace();

    // 6. Create currents from phase space trajectories
    this.extractCurrents(phaseSpace);

    // 7. Compute persistent homology
    const barcodes = this.homology.computePersistentHomology(phaseSpace, 2.0);

    // 8. Extract audio features for manifold parameters
    const features = this.spectrogram.extractFeatures();

    // 9. Store current analysis
    this.currentAnalysis = {
      timestamp: Date.now(),
      forms,
      phaseSpace,
      barcodes,
      features,
      currentCount: {
        0: this.homology.currents[0].length,
        1: this.homology.currents[1].length,
        2: this.homology.currents[2].length
      }
    };
  }

  /**
   * Extract currents (trajectories) from phase space points
   *
   * @param {Array<object>} phaseSpace - Phase space points
   */
  extractCurrents(phaseSpace) {
    // Group points by time to form trajectories
    const timeGroups = new Map();

    for (const point of phaseSpace) {
      if (!timeGroups.has(point.time)) {
        timeGroups.set(point.time, []);
      }
      timeGroups.get(point.time).push(point);
    }

    // Create 1-currents from sequential time frames
    const times = Array.from(timeGroups.keys()).sort((a, b) => a - b);

    for (let i = 0; i < times.length - 5; i += 5) {
      // Create trajectory every 5 frames
      const trajectory = [];

      for (let j = 0; j < 5; j++) {
        const frame = timeGroups.get(times[i + j]);
        if (frame && frame.length > 0) {
          // Use point with highest energy
          const maxPoint = frame.reduce((max, p) =>
            p.energy > max.energy ? p : max
          );
          trajectory.push({ q: maxPoint.q, p: maxPoint.p });
        }
      }

      if (trajectory.length >= 3) {
        this.homology.createOneCurrent(trajectory, 1.0);
      }
    }
  }

  /**
   * Capture current audio as species signature
   *
   * @param {string} speciesId - Species to save signature to
   * @returns {boolean} Success
   */
  captureSignature(speciesId) {
    if (!this.currentAnalysis) {
      console.error('🧬 No analysis data to capture');
      return false;
    }

    console.log(`🧬 Capturing signature for species: ${speciesId}`);

    const signatureData = {
      spectrogram: this.spectrogram.getSpectrogramFlat(),
      zeroForms: this.currentAnalysis.forms.zeroForms,
      oneForms: this.currentAnalysis.forms.oneForms,
      twoForms: this.currentAnalysis.forms.twoForms,
      currents: {
        0: this.homology.currents[0],
        1: this.homology.currents[1],
        2: this.homology.currents[2]
      },
      persistentBarcodes: this.currentAnalysis.barcodes,
      phaseSpace: this.currentAnalysis.phaseSpace,
      features: this.currentAnalysis.features,
      duration: this.spectrogram.spectrogram.length * (this.spectrogram.hopSize / this.spectrogram.audioContext.sampleRate),
      sampleRate: this.spectrogram.audioContext.sampleRate,
      timestamp: new Date().toISOString()
    };

    return this.library.addSignature(speciesId, signatureData);
  }

  /**
   * Compare two species using homological integration
   *
   * @param {string} speciesId1 - First species
   * @param {string} speciesId2 - Second species
   * @returns {object|null} Comparison result
   */
  compareSpecies(speciesId1, speciesId2) {
    console.log(`🧬 Comparing species: ${speciesId1} vs ${speciesId2}`);
    return this.library.compareSpecies(speciesId1, speciesId2, this.homology);
  }

  /**
   * Verify Stokes' theorem on current data
   * Mathematical validation: ⟨∂T, α⟩ = ⟨T, dα⟩
   *
   * @returns {object|null} Verification result
   */
  verifyStokesTheorem() {
    if (this.homology.currents[1].length === 0) {
      console.warn('🧬 No 1-currents available for Stokes verification');
      return null;
    }

    if (!this.currentAnalysis || !this.currentAnalysis.forms.oneForms.length) {
      console.warn('🧬 No differential forms available for Stokes verification');
      return null;
    }

    // Use first 1-current
    const current = this.homology.currents[1][0];

    // Use first 1-form frame
    const oneForm = this.currentAnalysis.forms.oneForms[0][0];

    // Compute exterior derivative (2-form)
    const twoForm = this.currentAnalysis.forms.twoForms[0]?.[0] || { value: 0 };

    // Verify Stokes' theorem
    const verification = this.homology.verifyStokes(current, oneForm, twoForm);

    console.log(`🧬 Stokes verification: ${verification.verified ? 'PASSED' : 'FAILED'}`);
    return verification;
  }

  /**
   * Get current analysis state
   *
   * @returns {object} Analysis state
   */
  getState() {
    return {
      isAnalyzing: this.isAnalyzing,
      hasAnalysis: this.currentAnalysis !== null,
      spectrogram: this.spectrogram.getState(),
      forms: this.formsComputer.getFormState(),
      homology: this.homology.getState(),
      library: this.library.getStats()
    };
  }

  /**
   * Get current audio features for manifold animation
   *
   * @returns {object} {bass, mid, treble, centroid, spread}
   */
  getAudioFeatures() {
    return this.spectrogram.extractFeatures();
  }

  /**
   * Clear all analysis data
   */
  clear() {
    this.stopAnalysis();
    this.spectrogram.clear();
    this.homology.clear();
    this.currentAnalysis = null;
    console.log('🧬 Analysis data cleared');
  }

  /**
   * Reset everything including species library
   */
  reset() {
    this.clear();
    this.library.clear();
    this.library.initializeDefaultSpecies();
    console.log('🧬 Analyzer reset to initial state');
  }
}

console.log('🧬 Bioacoustic Analyzer module ready');
