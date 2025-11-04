// src/signalAudio.js
// Audio Signal Adapter - Wraps AudioEngine as UniversalSignal
// Bridges existing audio system to signal multimodality

import { UniversalSignal } from './signalCore.js';
import { AudioEngine } from './audio.js';

console.log("🎵 signalAudio.js loaded");

/**
 * AudioSignal - Adapter for AudioEngine to UniversalSignal interface
 * Doesn't replace AudioEngine, just provides signal interface
 */
export class AudioSignal extends UniversalSignal {
  constructor(name = 'Microphone') {
    super('audio', name);

    this.audioEngine = AudioEngine;
    this.frameListener = null;

    console.log("🎵 AudioSignal adapter created");
  }

  /**
   * Initialize (AudioEngine already initialized by audioRouter)
   */
  async init() {
    this.state = 'initializing';
    this.emitState('initializing');

    try {
      // AudioEngine is initialized elsewhere, we just wrap it
      if (this.audioEngine.state === 'idle') {
        await this.audioEngine.init();
      }

      this.state = 'ready';
      this.emitState('ready');
      console.log("🎵 AudioSignal adapter ready");
    } catch (err) {
      this.state = 'error';
      this.emitState('error');
      console.error("🎵 Audio signal init error:", err);
      throw err;
    }
  }

  /**
   * Start (subscribe to AudioEngine frames)
   */
  async start() {
    if (this.state === 'idle') await this.init();
    if (this.state !== 'ready') return;

    // Start AudioEngine if not running
    if (this.audioEngine.state !== 'running') {
      await this.audioEngine.start();
    }

    // Subscribe to audio frames
    this.frameListener = (bands) => {
      if (!this.enabled) return;

      // Update bands from AudioEngine
      this.bands.bass = bands.bass || 0;
      this.bands.mid = bands.mid || 0;
      this.bands.treble = bands.treble || 0;
      this.bands.level = bands.level || 0;

      // Get spectrum
      this.spectrum = this.audioEngine.getSpectrum();

      // Emit signal frame
      this.emit('frame');
    };

    this.audioEngine.on('frame', this.frameListener);

    await super.start();

    console.log("🎵 Audio signal started (wrapped AudioEngine)");
  }

  /**
   * Stop
   */
  async stop() {
    await super.stop();

    // Unsubscribe from AudioEngine
    if (this.frameListener) {
      this.audioEngine.off('frame', this.frameListener);
      this.frameListener = null;
    }

    // Note: Don't stop AudioEngine as it may be used elsewhere

    console.log("🎵 Audio signal stopped");
  }

  /**
   * Get AudioEngine reference
   */
  getAudioEngine() {
    return this.audioEngine;
  }
}

console.log("🎵 Audio signal adapter ready");
