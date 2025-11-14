// src/signalCore.js
// Universal Signal Abstraction Layer
// Treats audio, camera, sensors, text as unified signal sources

console.log("📡 signalCore.js loaded");

/**
 * UniversalSignal - Base class for all signal sources
 * Provides standard interface: bands (bass, mid, treble, level) + spectrum
 */
export class UniversalSignal {
  constructor(type, name) {
    this.type = type; // 'audio', 'camera', 'sensor', 'text'
    this.name = name;
    this.enabled = false;
    this.state = 'idle'; // idle | initializing | ready | running | error

    // Standard signal output (matches audio format)
    this.bands = {
      bass: 0,
      mid: 0,
      treble: 0,
      level: 0
    };

    // Optional spectrum data (for frequency-like representations)
    this.spectrum = new Uint8Array(64);

    // Metadata for routing and display
    this.metadata = {
      source: name,
      timestamp: 0,
      fps: 0,
      quality: 1.0
    };

    // Event listeners
    this.frameListeners = new Set();
    this.stateListeners = new Set();

    console.log(`📡 UniversalSignal created: ${type}/${name}`);
  }

  /**
   * Lifecycle methods (override in subclasses)
   */
  async init() {
    this.state = 'initializing';
    this.emitState('initializing');
  }

  async start() {
    this.enabled = true;
    this.state = 'running';
    this.emitState('running');
    console.log(`▶️ Signal started: ${this.type}/${this.name}`);
  }

  async stop() {
    this.enabled = false;
    this.state = 'ready';
    this.emitState('stopped');
    console.log(`⏹️ Signal stopped: ${this.type}/${this.name}`);
  }

  /**
   * Update method - called every frame or on data availability
   * Subclasses should override and update this.bands + this.spectrum
   */
  update() {
    // Override in subclass
  }

  /**
   * Event emitters
   */
  emit(event, data) {
    if (event === 'frame') {
      this.metadata.timestamp = performance.now();

      const payload = {
        type: this.type,
        name: this.name,
        bands: { ...this.bands },
        spectrum: this.spectrum,
        metadata: { ...this.metadata }
      };

      for (const listener of this.frameListeners) {
        try {
          listener(payload);
        } catch (e) {
          console.error(`Signal frame listener error (${this.name}):`, e);
        }
      }
    }
  }

  emitState(state) {
    for (const listener of this.stateListeners) {
      try {
        listener(state, this.type, this.name);
      } catch (e) {
        console.error(`Signal state listener error (${this.name}):`, e);
      }
    }
  }

  /**
   * Event subscription
   */
  on(event, callback) {
    if (event === 'frame' && typeof callback === 'function') {
      this.frameListeners.add(callback);
    } else if (event === 'state' && typeof callback === 'function') {
      this.stateListeners.add(callback);
    }
  }

  off(event, callback) {
    if (event === 'frame') {
      this.frameListeners.delete(callback);
    } else if (event === 'state') {
      this.stateListeners.delete(callback);
    }
  }

  /**
   * Utility: Get signal info for HUD/debugging
   */
  getInfo() {
    return {
      type: this.type,
      name: this.name,
      state: this.state,
      enabled: this.enabled,
      bands: { ...this.bands },
      listeners: this.frameListeners.size,
      metadata: { ...this.metadata }
    };
  }
}

/**
 * SignalMultiplexer - Mixes multiple signal sources
 * Supports: blend, max, sum, multiply modes
 */
export class SignalMultiplexer {
  constructor() {
    this.sources = new Map(); // sourceId -> UniversalSignal
    this.weights = new Map(); // sourceId -> weight (0-1)
    this.mode = 'blend'; // blend | max | sum | multiply

    // Output bands (mixed result)
    this.output = {
      bass: 0,
      mid: 0,
      treble: 0,
      level: 0
    };

    // Output spectrum (mixed)
    this.outputSpectrum = new Uint8Array(64);

    this.frameListeners = new Set();

    console.log("📡 SignalMultiplexer created");
  }

  /**
   * Add signal source
   */
  addSource(sourceId, signal, weight = 1.0) {
    if (!(signal instanceof UniversalSignal)) {
      console.warn(`Cannot add source ${sourceId}: not a UniversalSignal`);
      return;
    }

    this.sources.set(sourceId, signal);
    this.weights.set(sourceId, Math.max(0, Math.min(1, weight)));

    // Subscribe to signal frames
    signal.on('frame', () => this.mix());

    console.log(`📡 Multiplexer: added source ${sourceId} (weight: ${weight})`);
  }

  /**
   * Remove signal source
   */
  removeSource(sourceId) {
    this.sources.delete(sourceId);
    this.weights.delete(sourceId);
    console.log(`📡 Multiplexer: removed source ${sourceId}`);
  }

  /**
   * Set source weight (0-1)
   */
  setWeight(sourceId, weight) {
    if (this.weights.has(sourceId)) {
      this.weights.set(sourceId, Math.max(0, Math.min(1, weight)));
    }
  }

  /**
   * Set mixing mode
   */
  setMode(mode) {
    if (['blend', 'max', 'sum', 'multiply'].includes(mode)) {
      this.mode = mode;
      console.log(`📡 Multiplexer: mode = ${mode}`);
    }
  }

  /**
   * Mix all sources according to mode
   */
  mix() {
    // Reset output
    this.output = { bass: 0, mid: 0, treble: 0, level: 0 };
    this.outputSpectrum.fill(0);

    if (this.sources.size === 0) {
      this.emit();
      return;
    }

    const activeSources = [];
    for (const [id, signal] of this.sources) {
      if (signal.enabled) {
        activeSources.push({
          id,
          signal,
          weight: this.weights.get(id) || 1.0
        });
      }
    }

    if (activeSources.length === 0) {
      this.emit();
      return;
    }

    switch (this.mode) {
      case 'blend':
        this.mixBlend(activeSources);
        break;
      case 'max':
        this.mixMax(activeSources);
        break;
      case 'sum':
        this.mixSum(activeSources);
        break;
      case 'multiply':
        this.mixMultiply(activeSources);
        break;
    }

    this.emit();
  }

  /**
   * Blend mode: weighted average
   */
  mixBlend(sources) {
    let totalWeight = 0;

    for (const { signal, weight } of sources) {
      this.output.bass += signal.bands.bass * weight;
      this.output.mid += signal.bands.mid * weight;
      this.output.treble += signal.bands.treble * weight;
      this.output.level += signal.bands.level * weight;

      // Blend spectrum
      for (let i = 0; i < this.outputSpectrum.length; i++) {
        this.outputSpectrum[i] += (signal.spectrum[i] || 0) * weight;
      }

      totalWeight += weight;
    }

    // Normalize by total weight
    if (totalWeight > 0) {
      this.output.bass /= totalWeight;
      this.output.mid /= totalWeight;
      this.output.treble /= totalWeight;
      this.output.level /= totalWeight;

      for (let i = 0; i < this.outputSpectrum.length; i++) {
        this.outputSpectrum[i] = Math.min(255, this.outputSpectrum[i] / totalWeight);
      }
    }
  }

  /**
   * Max mode: take maximum value
   */
  mixMax(sources) {
    for (const { signal, weight } of sources) {
      this.output.bass = Math.max(this.output.bass, signal.bands.bass * weight);
      this.output.mid = Math.max(this.output.mid, signal.bands.mid * weight);
      this.output.treble = Math.max(this.output.treble, signal.bands.treble * weight);
      this.output.level = Math.max(this.output.level, signal.bands.level * weight);

      for (let i = 0; i < this.outputSpectrum.length; i++) {
        this.outputSpectrum[i] = Math.max(this.outputSpectrum[i], (signal.spectrum[i] || 0) * weight);
      }
    }
  }

  /**
   * Sum mode: additive (can exceed 1.0)
   */
  mixSum(sources) {
    for (const { signal, weight } of sources) {
      this.output.bass += signal.bands.bass * weight;
      this.output.mid += signal.bands.mid * weight;
      this.output.treble += signal.bands.treble * weight;
      this.output.level += signal.bands.level * weight;

      for (let i = 0; i < this.outputSpectrum.length; i++) {
        this.outputSpectrum[i] = Math.min(255, this.outputSpectrum[i] + (signal.spectrum[i] || 0) * weight);
      }
    }
  }

  /**
   * Multiply mode: multiplicative modulation
   */
  mixMultiply(sources) {
    this.output.bass = 1;
    this.output.mid = 1;
    this.output.treble = 1;
    this.output.level = 1;
    this.outputSpectrum.fill(255);

    for (const { signal, weight } of sources) {
      const w = weight;
      this.output.bass *= (signal.bands.bass * w + (1 - w));
      this.output.mid *= (signal.bands.mid * w + (1 - w));
      this.output.treble *= (signal.bands.treble * w + (1 - w));
      this.output.level *= (signal.bands.level * w + (1 - w));

      for (let i = 0; i < this.outputSpectrum.length; i++) {
        const val = (signal.spectrum[i] || 0) / 255;
        this.outputSpectrum[i] *= (val * w + (1 - w));
      }
    }
  }

  /**
   * Emit mixed output
   */
  emit() {
    const payload = {
      type: 'multiplexed',
      mode: this.mode,
      bands: { ...this.output },
      spectrum: this.outputSpectrum,
      sources: Array.from(this.sources.keys())
    };

    for (const listener of this.frameListeners) {
      try {
        listener(payload);
      } catch (e) {
        console.error("Multiplexer listener error:", e);
      }
    }
  }

  /**
   * Event subscription
   */
  on(event, callback) {
    if (event === 'frame' && typeof callback === 'function') {
      this.frameListeners.add(callback);
    }
  }

  off(event, callback) {
    if (event === 'frame') {
      this.frameListeners.delete(callback);
    }
  }

  /**
   * Get multiplexer info
   */
  getInfo() {
    return {
      mode: this.mode,
      sources: Array.from(this.sources.entries()).map(([id, signal]) => ({
        id,
        type: signal.type,
        name: signal.name,
        weight: this.weights.get(id),
        enabled: signal.enabled
      })),
      output: { ...this.output },
      listeners: this.frameListeners.size
    };
  }
}

console.log("📡 Signal core system ready");
