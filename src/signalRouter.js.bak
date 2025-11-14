// src/signalRouter.js
// Signal Router - Universal signal routing to geometry/visual systems
// Integrates audio, camera, sensors, text into unified signal flow

import { SignalMultiplexer } from './signalCore.js';
import { CameraSignal } from './signalCamera.js';
import { SensorSignal } from './signalSensor.js';
import { TextSignal } from './signalText.js';
import { state } from './state.js';

console.log("📡 signalRouter.js loaded");

/**
 * SignalRouter - Central hub for all signal sources
 * Routes signals to geometry, particles, visual effects
 */
export class SignalRouter {
  constructor() {
    // Signal sources
    this.sources = {
      audio: null,      // Will be set from audioRouter
      camera: null,
      sensor: null,
      text: null
    };

    // Signal multiplexer
    this.multiplexer = new SignalMultiplexer();

    // Current output (multiplexed signal)
    this.currentSignal = {
      bass: 0,
      mid: 0,
      treble: 0,
      level: 0,
      spectrum: new Uint8Array(64)
    };

    // Routing configuration
    this.routing = {
      enabled: true,
      mode: 'blend',  // blend | max | sum | multiply
      weights: {
        audio: 1.0,
        camera: 0.0,
        sensor: 0.0,
        text: 0.0
      },
      targets: {
        morphWeights: true,
        geometry: true,
        particles: true,
        lighting: false,
        colors: false
      }
    };

    // Processing chain
    this.processors = [];

    // Frame listeners
    this.frameListeners = new Set();

    // Statistics
    this.stats = {
      frameCount: 0,
      lastFrameTime: 0,
      fps: 0
    };

    console.log("📡 SignalRouter created");
  }

  /**
   * Initialize signal sources
   */
  async init() {
    console.log("📡 Initializing signal sources...");

    try {
      // Create camera signal (don't start yet)
      this.sources.camera = new CameraSignal('Webcam');

      // Create sensor signal (don't start yet)
      this.sources.sensor = new SensorSignal('DeviceSensors');

      // Create text signal (don't start yet)
      this.sources.text = new TextSignal('TextStream');

      // Note: audio signal is set externally from audioRouter

      console.log("📡 Signal sources created (not started)");
    } catch (err) {
      console.error("📡 Signal source init error:", err);
      throw err;
    }
  }

  /**
   * Set audio signal source (from audioRouter)
   */
  setAudioSource(audioSignal) {
    this.sources.audio = audioSignal;
    console.log("📡 Audio signal source connected");
  }

  /**
   * Enable signal source
   */
  async enableSource(sourceType) {
    const source = this.sources[sourceType];
    if (!source) {
      console.warn(`📡 Unknown source type: ${sourceType}`);
      return false;
    }

    try {
      // Initialize if needed
      if (source.state === 'idle') {
        await source.init();
      }

      // Start signal
      await source.start();

      // Add to multiplexer
      this.multiplexer.addSource(sourceType, source, this.routing.weights[sourceType]);

      console.log(`📡 Enabled signal source: ${sourceType}`);
      return true;
    } catch (err) {
      console.error(`📡 Error enabling ${sourceType}:`, err);
      return false;
    }
  }

  /**
   * Disable signal source
   */
  async disableSource(sourceType) {
    const source = this.sources[sourceType];
    if (!source) return;

    try {
      await source.stop();
      this.multiplexer.removeSource(sourceType);
      console.log(`📡 Disabled signal source: ${sourceType}`);
    } catch (err) {
      console.error(`📡 Error disabling ${sourceType}:`, err);
    }
  }

  /**
   * Set source weight (0-1)
   */
  setSourceWeight(sourceType, weight) {
    this.routing.weights[sourceType] = Math.max(0, Math.min(1, weight));
    this.multiplexer.setWeight(sourceType, this.routing.weights[sourceType]);
    console.log(`📡 Set ${sourceType} weight: ${weight.toFixed(2)}`);
  }

  /**
   * Set mixing mode
   */
  setMixMode(mode) {
    this.routing.mode = mode;
    this.multiplexer.setMode(mode);
    console.log(`📡 Mix mode: ${mode}`);
  }

  /**
   * Start signal routing
   */
  start() {
    if (this.routing.enabled) {
      console.log("📡 Signal routing already active");
      return;
    }

    this.routing.enabled = true;

    // Subscribe to multiplexer output
    this.multiplexer.on('frame', (signal) => this.onSignalFrame(signal));

    // Note: Individual sources are started via enableSource()

    console.log("📡 Signal routing started");
  }

  /**
   * Stop signal routing
   */
  stop() {
    this.routing.enabled = false;
    console.log("📡 Signal routing stopped");
  }

  /**
   * Handle incoming signal frame from multiplexer
   */
  onSignalFrame(signal) {
    if (!this.routing.enabled) return;

    // Update current signal
    this.currentSignal = {
      bass: signal.bands.bass,
      mid: signal.bands.mid,
      treble: signal.bands.treble,
      level: signal.bands.level,
      spectrum: signal.spectrum
    };

    // Apply processing chain
    for (const processor of this.processors) {
      processor(this.currentSignal);
    }

    // Route to targets
    this.routeToTargets(this.currentSignal);

    // Emit to frame listeners
    for (const listener of this.frameListeners) {
      try {
        listener(this.currentSignal);
      } catch (e) {
        console.error("📡 Frame listener error:", e);
      }
    }

    // Update stats
    this.updateStats();
  }

  /**
   * Route signal to configured targets
   */
  routeToTargets(signal) {
    // Route to morph weights
    if (this.routing.targets.morphWeights) {
      this.routeToMorphWeights(signal);
    }

    // Route to geometry transforms
    if (this.routing.targets.geometry) {
      this.routeToGeometry(signal);
    }

    // Route to particles
    if (this.routing.targets.particles) {
      this.routeToParticles(signal);
    }

    // Route to lighting
    if (this.routing.targets.lighting) {
      this.routeToLighting(signal);
    }

    // Route to colors
    if (this.routing.targets.colors) {
      this.routeToColors(signal);
    }

    // Notify HUD (if callback exists)
    if (window?.hudCallbacks?.audioReactive) {
      window.hudCallbacks.audioReactive(signal);
    }
  }

  /**
   * Route to morph weights (like audio routing)
   */
  routeToMorphWeights(signal) {
    if (!state.morphWeights) return;

    const { bass, mid, treble, level } = signal;

    // Apply to morph targets (similar to audioRouter behavior)
    // This maintains compatibility with existing audio-reactive morphs
    if (state.audio?.morphTargets) {
      const targets = state.audio.morphTargets;

      // Example routing (customize as needed)
      if (targets.bass && state.morphWeights[targets.bass]) {
        state.morphWeights[targets.bass] = bass * (state.audio.morphSensitivity || 1.0);
      }

      if (targets.mid && state.morphWeights[targets.mid]) {
        state.morphWeights[targets.mid] = mid * (state.audio.morphSensitivity || 1.0);
      }

      if (targets.treble && state.morphWeights[targets.treble]) {
        state.morphWeights[targets.treble] = treble * (state.audio.morphSensitivity || 1.0);
      }
    }
  }

  /**
   * Route to geometry transforms
   */
  routeToGeometry(signal) {
    const { bass, mid, treble, level } = signal;

    // Apply to geometry reactivity (if enabled in state)
    if (state.audio?.geometryReactive) {
      // Bass affects scale
      if (state.audio.scaleReactive) {
        const scaleInfluence = bass * 0.2;
        state.scale = Math.max(0.5, Math.min(2.0, 1.0 + scaleInfluence));
      }

      // Mid affects rotation
      if (state.audio.rotationReactive) {
        state.rotationY += mid * 0.02;
      }

      // Treble affects idle spin
      if (state.audio.spinReactive) {
        state.idleSpin = treble * 2.0;
      }
    }
  }

  /**
   * Route to particles
   */
  routeToParticles(signal) {
    // Particles can subscribe to signal via frameListeners
    // or access currentSignal directly
  }

  /**
   * Route to lighting
   */
  routeToLighting(signal) {
    if (!state.lighting) return;

    const { bass, mid, level } = signal;

    if (state.audio?.lightingReactive) {
      // Bass affects ambient intensity
      state.lighting.ambientIntensity = 0.3 + bass * 0.5;

      // Mid affects directional intensity
      state.lighting.directionalIntensity = 0.5 + mid * 0.8;
    }
  }

  /**
   * Route to colors
   */
  routeToColors(signal) {
    const { treble, level } = signal;

    if (state.audio?.colorReactive) {
      // Treble affects hue shift
      state.hue = (state.hue + treble * 2) % 360;

      // Level affects color brightness (handled in visual.js)
    }
  }

  /**
   * Add processing function to chain
   */
  addProcessor(processor) {
    if (typeof processor === 'function') {
      this.processors.push(processor);
      console.log("📡 Added signal processor");
    }
  }

  /**
   * Remove processor
   */
  removeProcessor(processor) {
    const index = this.processors.indexOf(processor);
    if (index > -1) {
      this.processors.splice(index, 1);
      console.log("📡 Removed signal processor");
    }
  }

  /**
   * Subscribe to signal frames
   */
  on(event, callback) {
    if (event === 'frame' && typeof callback === 'function') {
      this.frameListeners.add(callback);
    }
  }

  /**
   * Unsubscribe from signal frames
   */
  off(event, callback) {
    if (event === 'frame') {
      this.frameListeners.delete(callback);
    }
  }

  /**
   * Update statistics
   */
  updateStats() {
    this.stats.frameCount++;

    const now = performance.now();
    if (this.stats.lastFrameTime > 0) {
      const dt = now - this.stats.lastFrameTime;
      this.stats.fps = 1000 / dt;
    }
    this.stats.lastFrameTime = now;
  }

  /**
   * Get current signal
   */
  getCurrentSignal() {
    return { ...this.currentSignal };
  }

  /**
   * Get router info
   */
  getInfo() {
    return {
      enabled: this.routing.enabled,
      mode: this.routing.mode,
      weights: { ...this.routing.weights },
      targets: { ...this.routing.targets },
      sources: Object.keys(this.sources).map(key => ({
        type: key,
        enabled: this.sources[key]?.enabled || false,
        state: this.sources[key]?.state || 'none'
      })),
      stats: { ...this.stats },
      multiplexer: this.multiplexer.getInfo()
    };
  }

  /**
   * Get signal source
   */
  getSource(sourceType) {
    return this.sources[sourceType];
  }

  /**
   * Enable/disable routing target
   */
  setTargetEnabled(target, enabled) {
    if (this.routing.targets.hasOwnProperty(target)) {
      this.routing.targets[target] = enabled;
      console.log(`📡 Target ${target}: ${enabled ? 'enabled' : 'disabled'}`);
    }
  }
}

// Create singleton router instance
export const signalRouter = new SignalRouter();

// Expose globally for debugging
if (typeof window !== 'undefined') {
  window.signalRouter = signalRouter;
  window.SignalProbe = {
    info: () => signalRouter.getInfo(),
    enable: (type) => signalRouter.enableSource(type),
    disable: (type) => signalRouter.disableSource(type),
    setWeight: (type, weight) => signalRouter.setSourceWeight(type, weight),
    setMode: (mode) => signalRouter.setMixMode(mode),
    getSignal: () => signalRouter.getCurrentSignal(),
    sources: signalRouter.sources
  };
}

console.log("📡 Signal router system ready");
