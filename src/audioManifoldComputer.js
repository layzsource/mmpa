// Audio Manifold Computer - UMAP/t-SNE dimensionality reduction for audio timbre
// Integrates MFCC extraction with manifold learning for real-time visualization

import { UMAP } from 'umap-js';
import { MFCCExtractor, AudioFeatureAnalyzer } from './mfccExtractor.js';

console.log('[MANIFOLD] 🎨 audioManifoldComputer.js loaded');

/**
 * AudioManifoldComputer
 *
 * Real-time audio feature extraction → manifold embedding
 * Maintains rolling buffer of audio frames with extracted features
 * Computes 2D/3D UMAP embeddings for visualization
 */
export class AudioManifoldComputer {
  constructor(options = {}) {
    // Configuration
    this.bufferDuration = options.bufferDuration || 5;   // seconds (reduced from 10)
    this.frameRate = options.frameRate || 10;            // fps
    this.maxFrames = this.bufferDuration * this.frameRate; // 50 frames max

    // Manifold settings
    this.nDimensions = options.nDimensions || 3;          // 2D or 3D output
    this.nNeighbors = options.nNeighbors || 5;            // UMAP neighbors (needs 6+ points)
    this.minDist = options.minDist || 0.1;                // UMAP min distance
    this.updateInterval = options.updateInterval || 10000; // ms between UMAP updates (10s to prevent freezing)

    // Feature extraction
    this.mfccExtractor = new MFCCExtractor({
      numCoefficients: 13,
      numMelFilters: 26,
      fftSize: 2048,
      sampleRate: 44100
    });

    this.featureAnalyzer = new AudioFeatureAnalyzer();

    // Data buffers
    this.frameBuffer = [];          // Array of {timestamp, mfccs, features, embedding}
    this.lastUpdateTime = 0;

    // UMAP instance
    this.umap = null;
    this.isComputing = false;

    // Statistics
    this.stats = {
      totalFrames: 0,
      embeddingsComputed: 0,
      lastComputeTime: 0
    };

    console.log(`[MANIFOLD] 🎨 Audio Manifold Computer initialized: ${this.bufferDuration}s buffer, ${this.nDimensions}D output`);
  }

  /**
   * Process audio frame - extract features and add to buffer
   * @param {AnalyserNode} analyser - Web Audio API analyser
   * @returns {Object} - Frame data with features
   */
  processFrame(analyser) {
    if (!analyser) {
      console.warn('[MANIFOLD] ⚠️ No analyser provided to processFrame');
      return null;
    }

    const timestamp = performance.now();

    // Extract MFCCs
    const mfccs = this.mfccExtractor.extractFromAnalyser(analyser);

    // Extract additional features
    const features = this.featureAnalyzer.extractAllFeatures(analyser);

    // Log first few frames
    if (this.frameBuffer.length < 5) {
      console.log(`[MANIFOLD] 🎵 Frame ${this.frameBuffer.length}: MFCCs[0]=${mfccs[0].toFixed(3)}, amplitude=${features.amplitude.toFixed(3)}`);
    }

    // Create frame data
    const frame = {
      timestamp,
      mfccs: Array.from(mfccs),
      features: {
        amplitude: features.amplitude,
        reverb: features.reverb,
        spectralFlux: features.spectralFlux,
        zeroCrossingRate: features.zeroCrossingRate,
        spectralCentroid: features.spectralCentroid,
        spectralRolloff: features.spectralRolloff
      },
      embedding: null  // Will be computed by UMAP
    };

    // Add to buffer
    this.frameBuffer.push(frame);

    // Trim buffer to max size
    if (this.frameBuffer.length > this.maxFrames) {
      this.frameBuffer.shift();
    }

    this.stats.totalFrames++;

    // Check if we should update UMAP embedding
    if (timestamp - this.lastUpdateTime >= this.updateInterval) {
      this.updateEmbeddings();
    }

    return frame;
  }

  /**
   * Update UMAP embeddings for all frames
   * Runs UMAP on combined MFCC + feature vectors
   */
  updateEmbeddings() {
    console.log(`[MANIFOLD] 📊 updateEmbeddings called: ${this.frameBuffer.length} frames, isComputing: ${this.isComputing}`);

    if (this.isComputing || this.frameBuffer.length < 10) {
      if (this.frameBuffer.length < 10) {
        console.log(`[MANIFOLD] ⏳ Need ${10 - this.frameBuffer.length} more frames before computing UMAP (have ${this.frameBuffer.length})`);
      }
      return;
    }

    this.isComputing = true;
    const startTime = performance.now();

    try {
      // Sample frames if buffer is too large (max 50 for performance)
      const maxUMAPFrames = 50;
      const framesToUse = this.frameBuffer.length > maxUMAPFrames
        ? this.sampleFrames(this.frameBuffer, maxUMAPFrames)
        : this.frameBuffer;

      console.log(`[MANIFOLD] 📊 Computing UMAP on ${framesToUse.length} frames (sampled from ${this.frameBuffer.length})`);

      // Prepare input data: concatenate MFCCs with selected features
      const inputData = framesToUse.map(frame => {
        return [
          ...frame.mfccs,                      // 13 MFCCs
          frame.features.amplitude * 10,        // Scale amplitude
          frame.features.reverb * 5,            // Scale reverb
          frame.features.spectralFlux * 5,      // Scale spectral flux
          frame.features.spectralCentroid * 5,  // Scale centroid
          frame.features.spectralRolloff * 5    // Scale rolloff
        ];
      });

      // Initialize or update UMAP
      if (!this.umap) {
        this.umap = new UMAP({
          nComponents: this.nDimensions,
          nNeighbors: this.nNeighbors,
          minDist: this.minDist,
          nEpochs: 5,  // Minimal epochs - prevents freezing
          spread: 1.0
        });
      }

      // Fit UMAP and get embeddings
      const embeddings = this.umap.fit(inputData);

      // Update frame embeddings (map back to original frames if sampled)
      if (framesToUse.length < this.frameBuffer.length) {
        // Sampled: assign embeddings to sampled frames
        for (let i = 0; i < framesToUse.length; i++) {
          framesToUse[i].embedding = embeddings[i];
        }
      } else {
        // Not sampled: assign to all frames
        for (let i = 0; i < this.frameBuffer.length; i++) {
          this.frameBuffer[i].embedding = embeddings[i];
        }
      }

      this.stats.embeddingsComputed++;
      this.stats.lastComputeTime = performance.now() - startTime;
      this.lastUpdateTime = performance.now();

      console.log(`[MANIFOLD] 🎨 UMAP computed: ${this.frameBuffer.length} frames in ${this.stats.lastComputeTime.toFixed(1)}ms`);

    } catch (error) {
      console.error('[MANIFOLD] ❌ UMAP computation error:', error);
    } finally {
      this.isComputing = false;
    }
  }

  /**
   * Sample frames evenly from buffer
   * @param {Array} frames - All frames
   * @param {number} maxCount - Max frames to return
   * @returns {Array} - Sampled frames
   */
  sampleFrames(frames, maxCount) {
    if (frames.length <= maxCount) return frames;

    const step = frames.length / maxCount;
    const sampled = [];
    for (let i = 0; i < maxCount; i++) {
      const index = Math.floor(i * step);
      sampled.push(frames[index]);
    }
    return sampled;
  }

  /**
   * Get all frames with embeddings
   * @returns {Array} - Frame buffer
   */
  getFrames() {
    return this.frameBuffer;
  }

  /**
   * Get frames with valid embeddings only
   * @returns {Array} - Frames that have been embedded
   */
  getEmbeddedFrames() {
    return this.frameBuffer.filter(frame => frame.embedding !== null);
  }

  /**
   * Get statistics
   * @returns {Object} - Computation statistics
   */
  getStats() {
    return {
      ...this.stats,
      bufferSize: this.frameBuffer.length,
      embeddedCount: this.getEmbeddedFrames().length,
      bufferUtilization: (this.frameBuffer.length / this.maxFrames * 100).toFixed(1) + '%'
    };
  }

  /**
   * Clear buffer
   */
  clear() {
    this.frameBuffer = [];
    this.umap = null;
    console.log('[MANIFOLD] 🎨 Manifold buffer cleared');
  }

  /**
   * Update configuration
   * @param {Object} options - New options
   */
  updateConfig(options) {
    if (options.nDimensions && options.nDimensions !== this.nDimensions) {
      this.nDimensions = options.nDimensions;
      this.umap = null; // Force recreation
    }

    if (options.nNeighbors) this.nNeighbors = options.nNeighbors;
    if (options.minDist) this.minDist = options.minDist;
    if (options.updateInterval) this.updateInterval = options.updateInterval;

    console.log('[MANIFOLD] 🎨 Manifold config updated:', options);
  }
}

/**
 * ManifoldVisualizer - Prepares data for THREE.js visualization
 * Handles color mapping, tracer computation, etc.
 */
export class ManifoldVisualizer {
  constructor() {
    this.colorMode = 'time';  // 'time', 'amplitude', 'reverb', 'centroid'
    this.tracerMode = 'temporal';  // 'temporal', 'similarity', 'both'

    console.log('[MANIFOLD] 🎨 Manifold Visualizer initialized');
  }

  /**
   * Map frame to color based on selected mode
   * @param {Object} frame - Frame data
   * @param {number} index - Frame index in buffer
   * @param {number} totalFrames - Total frames
   * @returns {Object} - RGB color {r, g, b} (0-1)
   */
  getFrameColor(frame, index, totalFrames) {
    switch (this.colorMode) {
      case 'time':
        // Purple (old) → Golden (new)
        const t = index / totalFrames;
        return {
          r: 0.5 + t * 0.5,  // 0.5 → 1.0
          g: 0.2 + t * 0.6,  // 0.2 → 0.8
          b: 0.8 - t * 0.4   // 0.8 → 0.4
        };

      case 'amplitude':
        // Blue (quiet) → Red (loud) - vibrant gradient like example
        const amp = frame.features.amplitude;
        return {
          r: amp,
          g: 0.1,
          b: 1.0 - amp
        };

      case 'reverb':
        // Teal (dry) → Purple (wet)
        const rev = frame.features.reverb;
        return {
          r: 0.5 + rev * 0.5,
          g: 0.7 - rev * 0.5,
          b: 0.9
        };

      case 'centroid':
        // Purple (bass) → Teal (treble)
        const cent = frame.features.spectralCentroid;
        return {
          r: 0.5 - cent * 0.4,
          g: 0.6 + cent * 0.2,
          b: 0.9 - cent * 0.3
        };

      default:
        return { r: 1, g: 1, b: 1 };
    }
  }

  /**
   * Get point size based on frame features
   * @param {Object} frame - Frame data
   * @returns {number} - Point size (relative scale)
   */
  getPointSize(frame) {
    // Size by amplitude and spectral content: larger = louder and brighter
    const amplitudeFactor = 0.5 + frame.features.amplitude * 1.5;
    const centroidFactor = 0.8 + frame.features.spectralCentroid * 0.4;
    return amplitudeFactor * centroidFactor;
  }

  /**
   * Compute temporal tracers (connect consecutive frames)
   * @param {Array} frames - Embedded frames
   * @returns {Array} - Array of {from: index, to: index}
   */
  computeTemporalTracers(frames) {
    const tracers = [];
    for (let i = 0; i < frames.length - 1; i++) {
      tracers.push({ from: i, to: i + 1 });
    }
    return tracers;
  }

  /**
   * Compute similarity tracers (connect similar timbres)
   * @param {Array} frames - Embedded frames
   * @param {number} maxDistance - Max distance threshold
   * @returns {Array} - Array of {from: index, to: index}
   */
  computeSimilarityTracers(frames, maxDistance = 0.3) {
    const tracers = [];

    for (let i = 0; i < frames.length; i++) {
      if (!frames[i].embedding) continue;

      // Find nearest neighbors in embedding space
      for (let j = i + 1; j < frames.length; j++) {
        if (!frames[j].embedding) continue;

        // Calculate Euclidean distance in embedding space
        const dist = this.calculateDistance(
          frames[i].embedding,
          frames[j].embedding
        );

        if (dist < maxDistance) {
          tracers.push({ from: i, to: j, distance: dist });
        }
      }
    }

    return tracers;
  }

  /**
   * Calculate Euclidean distance between two embeddings
   */
  calculateDistance(embedding1, embedding2) {
    let sum = 0;
    for (let i = 0; i < embedding1.length; i++) {
      const diff = embedding1[i] - embedding2[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  /**
   * Set color mode
   */
  setColorMode(mode) {
    this.colorMode = mode;
    console.log(`[MANIFOLD] 🎨 Color mode: ${mode}`);
  }

  /**
   * Set tracer mode
   */
  setTracerMode(mode) {
    this.tracerMode = mode;
    console.log(`[MANIFOLD] 🎨 Tracer mode: ${mode}`);
  }
}

console.log('[MANIFOLD] ✅ Audio Manifold Computer ready');
