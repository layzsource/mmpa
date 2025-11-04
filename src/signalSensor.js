// src/signalSensor.js
// Sensor Signal Input - Device Motion, Orientation, Touch
// Maps device sensors to signal bands

import { UniversalSignal } from './signalCore.js';

console.log("🎯 signalSensor.js loaded");

/**
 * SensorSignal - Extracts signals from device sensors
 * Maps sensor data to signal bands:
 * - bass: Large accelerations (shake, tilt magnitude)
 * - mid: Rotation rate (spinning device)
 * - treble: Rapid micro-movements (jitter, vibration)
 * - level: Total kinetic energy
 */
export class SensorSignal extends UniversalSignal {
  constructor(name = 'DeviceSensors') {
    super('sensor', name);

    // Sensor data
    this.acceleration = { x: 0, y: 0, z: 0 };
    this.rotationRate = { alpha: 0, beta: 0, gamma: 0 };
    this.orientation = { alpha: 0, beta: 0, gamma: 0 };

    // History for derivative calculations
    this.accelHistory = [];
    this.maxHistory = 30; // ~0.5s at 60fps

    // Touch data
    this.touches = [];
    this.touchVelocity = { x: 0, y: 0 };

    // Features
    this.features = {
      shake: 0,         // Large acceleration
      rotation: 0,      // Rotation rate magnitude
      jitter: 0,        // High-frequency vibration
      tilt: 0,          // Orientation magnitude
      touch: 0          // Touch activity
    };

    // Settings
    this.settings = {
      shakeSensitivity: 1.0,
      rotationSensitivity: 1.0,
      jitterSensitivity: 1.0,
      smoothing: 0.7
    };

    // Event handlers (bound)
    this.handleMotion = this.onDeviceMotion.bind(this);
    this.handleOrientation = this.onDeviceOrientation.bind(this);
    this.handleTouch = this.onTouchMove.bind(this);
    this.handleTouchEnd = this.onTouchEnd.bind(this);

    // Permission state (iOS 13+ requires permission)
    this.permissionGranted = false;

    console.log("🎯 SensorSignal created");
  }

  /**
   * Request sensor permissions (iOS 13+)
   */
  async requestPermission() {
    // Check if DeviceMotionEvent has requestPermission (iOS 13+)
    if (typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        this.permissionGranted = permission === 'granted';

        if (!this.permissionGranted) {
          console.warn("🎯 Device motion permission denied");
        }

        return this.permissionGranted;
      } catch (err) {
        console.error("🎯 Permission request error:", err);
        return false;
      }
    } else {
      // Not iOS or older version - assume granted
      this.permissionGranted = true;
      return true;
    }
  }

  /**
   * Initialize sensors
   */
  async init() {
    this.state = 'initializing';
    this.emitState('initializing');

    try {
      // Request permissions
      const hasPermission = await this.requestPermission();

      if (!hasPermission) {
        throw new Error('Sensor permission denied');
      }

      this.state = 'ready';
      this.emitState('ready');
      console.log("🎯 SensorSignal initialized");
    } catch (err) {
      this.state = 'error';
      this.emitState('error');
      console.error("🎯 Sensor init error:", err);
      throw err;
    }
  }

  /**
   * Start sensor monitoring
   */
  async start() {
    if (this.state === 'idle') await this.init();
    if (this.state !== 'ready') return;

    await super.start();

    // Add event listeners
    window.addEventListener('devicemotion', this.handleMotion, true);
    window.addEventListener('deviceorientation', this.handleOrientation, true);
    window.addEventListener('touchmove', this.handleTouch, { passive: true });
    window.addEventListener('touchend', this.handleTouchEnd, { passive: true });

    // Start update loop
    this.startUpdateLoop();

    console.log("🎯 Sensor signal started");
  }

  /**
   * Stop sensor monitoring
   */
  async stop() {
    await super.stop();

    // Remove event listeners
    window.removeEventListener('devicemotion', this.handleMotion, true);
    window.removeEventListener('deviceorientation', this.handleOrientation, true);
    window.removeEventListener('touchmove', this.handleTouch);
    window.removeEventListener('touchend', this.handleTouchEnd);

    console.log("🎯 Sensor signal stopped");
  }

  /**
   * Device motion event handler
   */
  onDeviceMotion(event) {
    if (!this.enabled) return;

    // Get acceleration (with gravity removed if available)
    const accel = event.accelerationIncludingGravity || event.acceleration || { x: 0, y: 0, z: 0 };
    this.acceleration = {
      x: accel.x || 0,
      y: accel.y || 0,
      z: accel.z || 0
    };

    // Get rotation rate
    const rotation = event.rotationRate || { alpha: 0, beta: 0, gamma: 0 };
    this.rotationRate = {
      alpha: rotation.alpha || 0,
      beta: rotation.beta || 0,
      gamma: rotation.gamma || 0
    };

    // Add to history for jitter detection
    this.accelHistory.push({ ...this.acceleration, time: performance.now() });
    if (this.accelHistory.length > this.maxHistory) {
      this.accelHistory.shift();
    }
  }

  /**
   * Device orientation event handler
   */
  onDeviceOrientation(event) {
    if (!this.enabled) return;

    this.orientation = {
      alpha: event.alpha || 0,  // Z-axis rotation (compass)
      beta: event.beta || 0,    // X-axis rotation (front-back tilt)
      gamma: event.gamma || 0   // Y-axis rotation (left-right tilt)
    };
  }

  /**
   * Touch move event handler
   */
  onTouchMove(event) {
    if (!this.enabled) return;

    this.touches = Array.from(event.touches).map(t => ({
      x: t.clientX,
      y: t.clientY,
      force: t.force || 1
    }));

    // Calculate touch velocity (simple approximation)
    if (this.touches.length > 0 && this.prevTouch) {
      const dt = 16; // assume ~60fps
      this.touchVelocity = {
        x: (this.touches[0].x - this.prevTouch.x) / dt,
        y: (this.touches[0].y - this.prevTouch.y) / dt
      };
    }

    this.prevTouch = this.touches[0] || null;
  }

  /**
   * Touch end event handler
   */
  onTouchEnd() {
    this.touches = [];
    this.touchVelocity = { x: 0, y: 0 };
    this.prevTouch = null;
  }

  /**
   * Start update loop for feature extraction
   */
  startUpdateLoop() {
    const update = () => {
      if (!this.enabled || this.state !== 'running') return;

      this.extractFeatures();
      this.updateBandsFromFeatures();
      this.emit('frame');

      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }

  /**
   * Extract features from sensor data
   */
  extractFeatures() {
    // Shake: magnitude of acceleration vector
    const accelMag = Math.sqrt(
      this.acceleration.x ** 2 +
      this.acceleration.y ** 2 +
      this.acceleration.z ** 2
    );
    const shake = Math.min(1, accelMag / 20 * this.settings.shakeSensitivity);

    // Rotation: magnitude of rotation rate
    const rotationMag = Math.sqrt(
      this.rotationRate.alpha ** 2 +
      this.rotationRate.beta ** 2 +
      this.rotationRate.gamma ** 2
    );
    const rotation = Math.min(1, rotationMag / 200 * this.settings.rotationSensitivity);

    // Jitter: variance in acceleration over time
    const jitter = this.calculateJitter();

    // Tilt: magnitude of device tilt
    const tiltMag = Math.sqrt(
      this.orientation.beta ** 2 +
      this.orientation.gamma ** 2
    );
    const tilt = Math.min(1, tiltMag / 90); // Normalize to 0-1

    // Touch: activity from touch input
    const touchMag = Math.sqrt(
      this.touchVelocity.x ** 2 +
      this.touchVelocity.y ** 2
    );
    const touch = Math.min(1, touchMag / 10);

    // Apply smoothing
    const s = this.settings.smoothing;
    this.features.shake = this.features.shake * s + shake * (1 - s);
    this.features.rotation = this.features.rotation * s + rotation * (1 - s);
    this.features.jitter = this.features.jitter * s + jitter * (1 - s);
    this.features.tilt = this.features.tilt * s + tilt * (1 - s);
    this.features.touch = this.features.touch * s + touch * (1 - s);
  }

  /**
   * Calculate jitter (high-frequency vibration)
   */
  calculateJitter() {
    if (this.accelHistory.length < 5) return 0;

    // Calculate variance of recent accelerations
    const recent = this.accelHistory.slice(-10);
    const avgX = recent.reduce((sum, a) => sum + a.x, 0) / recent.length;
    const avgY = recent.reduce((sum, a) => sum + a.y, 0) / recent.length;
    const avgZ = recent.reduce((sum, a) => sum + a.z, 0) / recent.length;

    const variance = recent.reduce((sum, a) => {
      const dx = a.x - avgX;
      const dy = a.y - avgY;
      const dz = a.z - avgZ;
      return sum + (dx * dx + dy * dy + dz * dz);
    }, 0) / recent.length;

    const jitter = Math.sqrt(variance);
    return Math.min(1, jitter / 2 * this.settings.jitterSensitivity);
  }

  /**
   * Map sensor features to signal bands
   */
  updateBandsFromFeatures() {
    // Bass: Large shakes and tilts (low-frequency movement)
    this.bands.bass = Math.max(this.features.shake, this.features.tilt * 0.5);

    // Mid: Rotation rate
    this.bands.mid = this.features.rotation;

    // Treble: Jitter and touch (high-frequency activity)
    this.bands.treble = Math.max(this.features.jitter, this.features.touch);

    // Level: Overall kinetic energy
    this.bands.level = (this.features.shake + this.features.rotation + this.features.jitter) / 3;

    // Update spectrum
    this.updateSpectrum();

    // Update metadata
    this.metadata.quality = this.permissionGranted ? 1.0 : 0.0;
  }

  /**
   * Create sensor "spectrum"
   */
  updateSpectrum() {
    // Map sensor features across spectrum
    const shakeLevel = this.features.shake * 255;
    const rotationLevel = this.features.rotation * 255;
    const jitterLevel = this.features.jitter * 255;
    const touchLevel = this.features.touch * 255;

    // Low bins: shake
    for (let i = 0; i < 16; i++) this.spectrum[i] = shakeLevel;

    // Mid-low bins: rotation
    for (let i = 16; i < 32; i++) this.spectrum[i] = rotationLevel;

    // Mid-high bins: jitter
    for (let i = 32; i < 48; i++) this.spectrum[i] = jitterLevel;

    // High bins: touch
    for (let i = 48; i < 64; i++) this.spectrum[i] = touchLevel;
  }

  /**
   * Settings
   */
  setShakeSensitivity(value) {
    this.settings.shakeSensitivity = Math.max(0.1, Math.min(10, value));
  }

  setRotationSensitivity(value) {
    this.settings.rotationSensitivity = Math.max(0.1, Math.min(10, value));
  }

  setJitterSensitivity(value) {
    this.settings.jitterSensitivity = Math.max(0.1, Math.min(10, value));
  }

  setSmoothing(value) {
    this.settings.smoothing = Math.max(0, Math.min(1, value));
  }

  /**
   * Get current sensor readings
   */
  getSensorData() {
    return {
      acceleration: { ...this.acceleration },
      rotationRate: { ...this.rotationRate },
      orientation: { ...this.orientation },
      touches: this.touches.length,
      features: { ...this.features }
    };
  }
}

console.log("🎯 Sensor signal system ready");
