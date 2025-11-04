// src/cameraSignalRouter.js
// Routes camera signals to geometry, particles, VCN navigation
// Integrates with existing signal router

console.log("📷 cameraSignalRouter.js loaded");

/**
 * Camera Signal Router
 * Routes camera/biosignal data to visual systems
 */
export class CameraSignalRouter {
  constructor() {
    this.cameraProvider = null;
    this.oscAdapter = null;
    this.biosignalAdapter = null;

    // Target systems
    this.geometrySystem = null;
    this.particleSystem = null;
    this.vcnSystem = null;
    this.signalRouter = null;

    // Signal mappings
    this.mappings = new Map();

    // Default mappings
    this.initDefaultMappings();

    // State
    this.enabled = false;
    this.updateInterval = null;
    this.updateRate = 30; // Hz
  }

  /**
   * Initialize default signal mappings
   */
  initDefaultMappings() {
    // Camera → Geometry morphing
    this.addMapping('camera', 'leftArmRaise', 'geometry', 'morphWeight_sphere', 0, 1);
    this.addMapping('camera', 'rightArmRaise', 'geometry', 'morphWeight_cube', 0, 1);
    this.addMapping('camera', 'armSpread', 'geometry', 'rotation', 0, 2);
    this.addMapping('camera', 'bodyLean', 'geometry', 'scale', 0.5, 2.0);

    // Camera → Particles
    this.addMapping('camera', 'movementIntensity', 'particles', 'emissionRate', 0, 100);
    this.addMapping('camera', 'handsDistance', 'particles', 'spread', 0, 5);

    // Camera → VCN navigation
    this.addMapping('camera', 'bodyCenterX', 'vcn', 'yaw', -Math.PI, Math.PI);
    this.addMapping('camera', 'bodyCenterY', 'vcn', 'pitch', -Math.PI / 2, Math.PI / 2);

    console.log("📷 Default camera signal mappings initialized");
  }

  /**
   * Add signal mapping
   */
  addMapping(sourceType, sourceSignal, targetSystem, targetParam, min, max) {
    const key = `${sourceType}:${sourceSignal}`;
    this.mappings.set(key, {
      sourceType,
      sourceSignal,
      targetSystem,
      targetParam,
      min,
      max,
      enabled: true
    });
  }

  /**
   * Remove signal mapping
   */
  removeMapping(sourceType, sourceSignal) {
    const key = `${sourceType}:${sourceSignal}`;
    this.mappings.delete(key);
  }

  /**
   * Set camera provider
   */
  setCameraProvider(provider) {
    this.cameraProvider = provider;

    // Listen for camera signal updates
    if (provider) {
      provider.on('signal', (signals) => {
        this.routeCameraSignals(signals);
      });

      provider.on('gesture', ({ gesture, confidence }) => {
        this.handleGesture(gesture, confidence);
      });
    }
  }

  /**
   * Set OSC adapter
   */
  setOSCAdapter(adapter) {
    this.oscAdapter = adapter;

    if (adapter) {
      adapter.on('signal', ({ name, value }) => {
        this.routeOSCSignal(name, value);
      });
    }
  }

  /**
   * Set biosignal adapter
   */
  setBiosignalAdapter(adapter) {
    this.biosignalAdapter = adapter;

    if (adapter) {
      adapter.on('signal', ({ name, value }) => {
        this.routeBiosignal(name, value);
      });
    }
  }

  /**
   * Set target systems
   */
  setGeometrySystem(system) {
    this.geometrySystem = system;
  }

  setParticleSystem(system) {
    this.particleSystem = system;
  }

  setVCNSystem(system) {
    this.vcnSystem = system;
  }

  setSignalRouter(router) {
    this.signalRouter = router;
  }

  /**
   * Start routing
   */
  start() {
    if (this.enabled) return;
    this.enabled = true;

    // Start periodic update
    this.updateInterval = setInterval(() => {
      this.update();
    }, 1000 / this.updateRate);

    console.log("📷 Camera signal routing started");
  }

  /**
   * Stop routing
   */
  stop() {
    if (!this.enabled) return;
    this.enabled = false;

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    console.log("📷 Camera signal routing stopped");
  }

  /**
   * Update routing (called periodically)
   */
  update() {
    if (!this.enabled) return;

    // Route camera signals
    if (this.cameraProvider?.enabled) {
      const signals = this.cameraProvider.getAllSignals();
      this.routeCameraSignals(signals);
    }

    // Route OSC signals
    if (this.oscAdapter?.connected) {
      const signals = this.oscAdapter.getAllSignals();
      Object.keys(signals).forEach(name => {
        this.routeOSCSignal(name, signals[name]);
      });
    }

    // Route biosignals
    if (this.biosignalAdapter?.connected) {
      const signals = this.biosignalAdapter.getAllSignals();
      Object.keys(signals).forEach(name => {
        this.routeBiosignal(name, signals[name]);
      });
    }
  }

  /**
   * Route camera signals to targets
   */
  routeCameraSignals(signals) {
    Object.keys(signals).forEach(signalName => {
      const key = `camera:${signalName}`;
      const mapping = this.mappings.get(key);

      if (mapping && mapping.enabled) {
        const value = signals[signalName];
        const scaled = mapping.min + value * (mapping.max - mapping.min);

        this.applyToTarget(mapping.targetSystem, mapping.targetParam, scaled);
      }
    });

    // Also send to main signal router
    if (this.signalRouter) {
      Object.keys(signals).forEach(name => {
        this.signalRouter.addSignal('camera', name, signals[name]);
      });
    }
  }

  /**
   * Route OSC signal
   */
  routeOSCSignal(name, value) {
    // Send to main signal router
    if (this.signalRouter) {
      this.signalRouter.addSignal('osc', name, value);
    }

    // Apply direct mappings if any
    const key = `osc:${name}`;
    const mapping = this.mappings.get(key);

    if (mapping && mapping.enabled) {
      const scaled = mapping.min + value * (mapping.max - mapping.min);
      this.applyToTarget(mapping.targetSystem, mapping.targetParam, scaled);
    }
  }

  /**
   * Route biosignal
   */
  routeBiosignal(name, value) {
    // Send to main signal router
    if (this.signalRouter) {
      this.signalRouter.addSignal('biosignal', name, value);
    }

    // Apply direct mappings if any
    const key = `biosignal:${name}`;
    const mapping = this.mappings.get(key);

    if (mapping && mapping.enabled) {
      const scaled = mapping.min + value * (mapping.max - mapping.min);
      this.applyToTarget(mapping.targetSystem, mapping.targetParam, scaled);
    }
  }

  /**
   * Apply signal to target system
   */
  applyToTarget(systemName, param, value) {
    switch (systemName) {
      case 'geometry':
        this.applyToGeometry(param, value);
        break;

      case 'particles':
        this.applyToParticles(param, value);
        break;

      case 'vcn':
        this.applyToVCN(param, value);
        break;

      default:
        console.warn(`📷 Unknown target system: ${systemName}`);
    }
  }

  /**
   * Apply to geometry system
   */
  applyToGeometry(param, value) {
    if (!window.state) return;

    if (param.startsWith('morphWeight_')) {
      const shape = param.replace('morphWeight_', '');
      if (window.state.morphWeights[shape] !== undefined) {
        window.state.morphWeights[shape] = value;
      }
    } else if (param === 'rotation') {
      window.state.rotation = value;
    } else if (param === 'scale') {
      window.state.scale = value;
    } else if (param === 'hue') {
      window.state.hue = value;
    }
  }

  /**
   * Apply to particle system
   */
  applyToParticles(param, value) {
    const particles = window.emojiStreamManager;
    if (!particles) return;

    if (param === 'emissionRate') {
      // Adjust emission rate for all streams
      particles.streams.forEach(stream => {
        stream.emissionRate = value;
      });
    } else if (param === 'spread') {
      particles.streams.forEach(stream => {
        stream.spread = value;
      });
    }
  }

  /**
   * Apply to VCN navigation
   */
  applyToVCN(param, value) {
    const fpControls = window.fpControls;
    if (!fpControls) return;

    if (param === 'yaw') {
      fpControls.yaw = value;
    } else if (param === 'pitch') {
      fpControls.pitch = value;
    } else if (param === 'moveSpeed') {
      fpControls.moveSpeed = value;
    }
  }

  /**
   * Handle recognized gesture
   */
  handleGesture(gesture, confidence) {
    console.log(`📷 Gesture: ${gesture} (${confidence.toFixed(2)})`);

    // Map gestures to actions
    switch (gesture) {
      case 'arms_up':
        // Trigger preset change or visual effect
        if (window.state) {
          window.state.morphWeights.sphere = 1.0;
        }
        break;

      case 'arms_spread':
        // Expand particle system
        if (window.emojiStreamManager) {
          window.emojiStreamManager.streams.forEach(stream => {
            stream.spread = 5.0;
          });
        }
        break;

      case 'hands_together':
        // Contract/focus
        if (window.state) {
          window.state.scale = 0.5;
        }
        break;

      case 'wave_left':
      case 'wave_right':
        // Rotate camera or change view
        if (window.fpControls) {
          window.fpControls.yaw += gesture === 'wave_left' ? -0.5 : 0.5;
        }
        break;
    }

    // Send to signal router
    if (this.signalRouter) {
      this.signalRouter.addSignal('gesture', gesture, confidence);
    }
  }

  /**
   * Get current mappings
   */
  getMappings() {
    return Array.from(this.mappings.values());
  }

  /**
   * Enable/disable mapping
   */
  setMappingEnabled(sourceType, sourceSignal, enabled) {
    const key = `${sourceType}:${sourceSignal}`;
    const mapping = this.mappings.get(key);
    if (mapping) {
      mapping.enabled = enabled;
    }
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      enabled: this.enabled,
      cameraEnabled: this.cameraProvider?.enabled || false,
      oscConnected: this.oscAdapter?.connected || false,
      biosignalConnected: this.biosignalAdapter?.connected || false,
      activeMappings: Array.from(this.mappings.values()).filter(m => m.enabled).length,
      totalMappings: this.mappings.size
    };
  }
}

console.log("📷 Camera signal router ready");
