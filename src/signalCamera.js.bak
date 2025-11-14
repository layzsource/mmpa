// src/signalCamera.js
// Camera Signal Input - Webcam → Visual Features → Morph Bands
// Extracts: brightness, motion, color dominance, edge density

import { UniversalSignal } from './signalCore.js';

console.log("📷 signalCamera.js loaded");

/**
 * CameraSignal - Extracts visual features from webcam
 * Maps visual properties to signal bands:
 * - bass: Low-frequency motion (large movements)
 * - mid: Color saturation / vibrancy
 * - treble: Edge density / high-frequency detail
 * - level: Overall brightness / luminance
 */
export class CameraSignal extends UniversalSignal {
  constructor(name = 'Webcam') {
    super('camera', name);

    // Video elements
    this.video = null;
    this.stream = null;
    this.deviceId = null;

    // Canvas for frame analysis
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.canvas.width = 160;  // Low-res for performance
    this.canvas.height = 120;

    // Analysis buffers
    this.prevFrame = null;
    this.currentFrame = null;

    // Feature extractors
    this.features = {
      brightness: 0,
      motion: 0,
      saturation: 0,
      edges: 0
    };

    // Settings
    this.settings = {
      motionSensitivity: 1.0,
      edgeSensitivity: 1.0,
      updateInterval: 33, // ~30fps analysis
      mirror: true
    };

    // Update loop
    this.updateLoop = null;
    this.lastUpdate = 0;

    console.log("📷 CameraSignal created");
  }

  /**
   * List available cameras
   */
  async listCameras() {
    if (!navigator.mediaDevices?.enumerateDevices) return [];
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(d => d.kind === 'videoinput');
  }

  /**
   * Initialize camera
   */
  async init(deviceId = null) {
    this.state = 'initializing';
    this.emitState('initializing');

    try {
      this.deviceId = deviceId;

      // Request camera access
      const constraints = deviceId
        ? { video: { deviceId: { exact: deviceId }, width: 640, height: 480 } }
        : { video: { width: 640, height: 480 } };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Create video element
      this.video = document.createElement('video');
      this.video.srcObject = this.stream;
      this.video.autoplay = true;
      this.video.playsInline = true;

      // Wait for video to be ready
      await new Promise((resolve) => {
        this.video.onloadedmetadata = () => {
          this.video.play();
          resolve();
        };
      });

      this.state = 'ready';
      this.emitState('ready');
      console.log("📷 CameraSignal initialized");
    } catch (err) {
      this.state = 'error';
      this.emitState('error');
      console.error("📷 Camera init error:", err);
      throw err;
    }
  }

  /**
   * Start camera signal processing
   */
  async start() {
    if (this.state === 'idle') await this.init();
    if (this.state !== 'ready') return;

    await super.start();

    // Start analysis loop
    this.startAnalysisLoop();

    console.log("📷 Camera signal started");
  }

  /**
   * Stop camera signal
   */
  async stop() {
    await super.stop();

    // Stop analysis loop
    if (this.updateLoop) {
      cancelAnimationFrame(this.updateLoop);
      this.updateLoop = null;
    }

    console.log("📷 Camera signal stopped");
  }

  /**
   * Cleanup and release camera
   */
  async dispose() {
    await this.stop();

    if (this.stream) {
      for (const track of this.stream.getTracks()) {
        track.stop();
      }
      this.stream = null;
    }

    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }

    console.log("📷 Camera signal disposed");
  }

  /**
   * Start analysis loop
   */
  startAnalysisLoop() {
    const analyze = () => {
      if (!this.enabled || this.state !== 'running') {
        this.updateLoop = null;
        return;
      }

      const now = performance.now();
      if (now - this.lastUpdate >= this.settings.updateInterval) {
        this.analyzeFrame();
        this.updateBandsFromFeatures();
        this.emit('frame');
        this.lastUpdate = now;
      }

      this.updateLoop = requestAnimationFrame(analyze);
    };

    this.updateLoop = requestAnimationFrame(analyze);
  }

  /**
   * Analyze current video frame
   */
  analyzeFrame() {
    if (!this.video || this.video.readyState < 2) return;

    // Draw video frame to canvas
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    // Get pixel data
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.currentFrame = imageData.data;

    // Extract features
    this.features.brightness = this.extractBrightness(this.currentFrame);
    this.features.saturation = this.extractSaturation(this.currentFrame);
    this.features.edges = this.extractEdges(imageData);

    if (this.prevFrame) {
      this.features.motion = this.extractMotion(this.prevFrame, this.currentFrame);
    }

    // Store frame for next motion detection
    this.prevFrame = new Uint8ClampedArray(this.currentFrame);
  }

  /**
   * Extract brightness (luminance)
   */
  extractBrightness(pixels) {
    let sum = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      // RGB to luminance: 0.299*R + 0.587*G + 0.114*B
      sum += pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
    }
    return (sum / (pixels.length / 4)) / 255; // Normalize to 0-1
  }

  /**
   * Extract color saturation
   */
  extractSaturation(pixels) {
    let totalSat = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i] / 255;
      const g = pixels[i + 1] / 255;
      const b = pixels[i + 2] / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;

      // Saturation = delta / max (if max > 0)
      const sat = max > 0 ? delta / max : 0;
      totalSat += sat;
    }
    return totalSat / (pixels.length / 4); // Average saturation
  }

  /**
   * Extract motion (frame difference)
   */
  extractMotion(prev, current) {
    let diff = 0;
    for (let i = 0; i < current.length; i += 4) {
      // Compare luminance
      const prevLum = prev[i] * 0.299 + prev[i + 1] * 0.587 + prev[i + 2] * 0.114;
      const currLum = current[i] * 0.299 + current[i + 1] * 0.587 + current[i + 2] * 0.114;
      diff += Math.abs(currLum - prevLum);
    }
    const motion = (diff / (current.length / 4)) / 255;
    return Math.min(1, motion * this.settings.motionSensitivity * 10);
  }

  /**
   * Extract edge density (high-frequency detail)
   * Using simple Sobel-like edge detection
   */
  extractEdges(imageData) {
    const w = imageData.width;
    const h = imageData.height;
    const pixels = imageData.data;

    let edgeSum = 0;
    const samples = 100; // Sample subset for performance

    for (let s = 0; s < samples; s++) {
      const x = Math.floor(Math.random() * (w - 1)) + 1;
      const y = Math.floor(Math.random() * (h - 1)) + 1;

      const idx = (y * w + x) * 4;

      // Get luminance of center and neighbors
      const center = pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
      const right = pixels[idx + 4] * 0.299 + pixels[idx + 5] * 0.587 + pixels[idx + 6] * 0.114;
      const down = pixels[idx + w * 4] * 0.299 + pixels[idx + w * 4 + 1] * 0.587 + pixels[idx + w * 4 + 2] * 0.114;

      // Gradient magnitude
      const gx = Math.abs(right - center);
      const gy = Math.abs(down - center);
      edgeSum += Math.sqrt(gx * gx + gy * gy);
    }

    const edgeDensity = (edgeSum / samples) / 255;
    return Math.min(1, edgeDensity * this.settings.edgeSensitivity * 5);
  }

  /**
   * Map visual features to signal bands
   */
  updateBandsFromFeatures() {
    // Bass: Large motion (low-frequency movement)
    this.bands.bass = this.features.motion;

    // Mid: Color saturation (vibrancy)
    this.bands.mid = this.features.saturation;

    // Treble: Edge density (high-frequency detail)
    this.bands.treble = this.features.edges;

    // Level: Overall brightness
    this.bands.level = this.features.brightness;

    // Update spectrum (visual frequency representation)
    // Map features across spectrum bands
    this.updateSpectrum();

    // Update metadata
    this.metadata.fps = 1000 / this.settings.updateInterval;
    this.metadata.quality = this.video ? (this.video.videoWidth / 640) : 0;
  }

  /**
   * Create visual "spectrum" from features
   */
  updateSpectrum() {
    // Create frequency-like representation of visual data
    // Low bins: motion, Mid bins: saturation, High bins: edges

    const bassLevel = this.features.motion * 255;
    const midLevel = this.features.saturation * 255;
    const trebleLevel = this.features.edges * 255;

    // Distribute across spectrum
    for (let i = 0; i < 21; i++) this.spectrum[i] = bassLevel;
    for (let i = 21; i < 43; i++) this.spectrum[i] = midLevel;
    for (let i = 43; i < 64; i++) this.spectrum[i] = trebleLevel;

    // Add brightness envelope
    const brightnessEnvelope = this.features.brightness;
    for (let i = 0; i < 64; i++) {
      this.spectrum[i] = Math.min(255, this.spectrum[i] * brightnessEnvelope);
    }
  }

  /**
   * Get preview canvas (for HUD display)
   */
  getPreviewCanvas() {
    return this.canvas;
  }

  /**
   * Settings
   */
  setMotionSensitivity(value) {
    this.settings.motionSensitivity = Math.max(0.1, Math.min(10, value));
  }

  setEdgeSensitivity(value) {
    this.settings.edgeSensitivity = Math.max(0.1, Math.min(10, value));
  }

  setUpdateInterval(ms) {
    this.settings.updateInterval = Math.max(16, Math.min(1000, ms));
  }

  setMirror(enabled) {
    this.settings.mirror = enabled;
  }
}

console.log("📷 Camera signal system ready");
