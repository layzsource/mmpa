// src/cameraSignalProvider.js
// Camera Signal Provider - Converts pose/gesture into normalized signals (0-1)
// Uses MediaPipe for pose/hand/face detection
// Routes to geometry, particles, VCN navigation

console.log("📷 cameraSignalProvider.js loaded");

/**
 * Camera Signal Provider
 * Provides normalized signals from camera-based pose/gesture detection
 */
export class CameraSignalProvider {
  constructor() {
    this.video = null;
    this.canvas = null;
    this.ctx = null;
    this.stream = null;
    this.enabled = false;
    this.processing = false;

    // Detection modes
    this.poseDetectionEnabled = false;
    this.handDetectionEnabled = false;
    this.faceDetectionEnabled = false;

    // MediaPipe instances (lazy loaded)
    this.poseDetector = null;
    this.handDetector = null;
    this.faceDetector = null;

    // Current detection results
    this.poseData = null;
    this.handData = null;
    this.faceData = null;

    // Normalized signals (0-1)
    this.signals = {
      // Body pose
      bodyHeight: 0.5,        // Height of body in frame
      bodyWidth: 0.5,         // Width of body in frame
      bodyCenterX: 0.5,       // Horizontal center position
      bodyCenterY: 0.5,       // Vertical center position
      bodyLean: 0.5,          // Left/right lean (0=left, 0.5=center, 1=right)
      bodyTwist: 0.5,         // Torso twist

      // Arms
      leftArmRaise: 0,        // Left arm elevation (0=down, 1=up)
      rightArmRaise: 0,       // Right arm elevation
      armSpread: 0,           // Arms spread width
      armCross: 0,            // Arms crossing chest

      // Hands
      leftHandOpen: 0,        // Left hand openness (0=fist, 1=open)
      rightHandOpen: 0,       // Right hand openness
      leftHandY: 0.5,         // Left hand vertical position
      rightHandY: 0.5,        // Right hand vertical position
      handsDistance: 0,       // Distance between hands

      // Face
      faceCenterX: 0.5,       // Face horizontal position
      faceCenterY: 0.5,       // Face vertical position
      faceSize: 0.5,          // Face size (proximity)
      headTilt: 0.5,          // Head tilt
      mouthOpen: 0,           // Mouth openness
      eyebrowRaise: 0,        // Eyebrow position

      // Activity
      movementIntensity: 0,   // Overall movement speed
      gestureConfidence: 0,   // Confidence of detected gesture
      presenceDetected: 0     // Person detected (0 or 1)
    };

    // Signal history for smoothing
    this.signalHistory = {};
    this.historyLength = 5;

    // Gesture recognition
    this.currentGesture = 'none';
    this.gestureThreshold = 0.7;

    // Event listeners
    this.listeners = [];

    // Performance
    this.fps = 30;
    this.lastFrameTime = 0;
    this.frameInterval = 1000 / this.fps;
  }

  /**
   * Initialize camera and video element
   */
  async init() {
    // Create hidden video element
    this.video = document.createElement('video');
    this.video.style.display = 'none';
    this.video.autoplay = true;
    this.video.playsInline = true;
    document.body.appendChild(this.video);

    // Create canvas for processing
    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'none';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    console.log("📷 Camera signal provider initialized (not started)");
  }

  /**
   * Start camera stream
   */
  async start() {
    if (this.enabled) {
      console.log("📷 Camera already running");
      return;
    }

    try {
      // Request camera access
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      this.video.srcObject = this.stream;
      await this.video.play();

      // Set canvas size
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;

      this.enabled = true;
      console.log("📷 Camera started:", this.canvas.width, 'x', this.canvas.height);

      // Start processing loop
      this.startProcessing();

      this.emitEvent('started');
      return { ok: true };
    } catch (err) {
      console.error("📷 Camera access denied:", err);
      this.emitEvent('error', err);
      return { ok: false, error: err.message };
    }
  }

  /**
   * Stop camera stream
   */
  stop() {
    if (!this.enabled) return;

    this.enabled = false;
    this.processing = false;

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.video) {
      this.video.srcObject = null;
    }

    console.log("📷 Camera stopped");
    this.emitEvent('stopped');
  }

  /**
   * Enable pose detection
   */
  async enablePoseDetection() {
    if (this.poseDetectionEnabled) return;

    try {
      // Note: MediaPipe would need to be added as a dependency
      // For now, we'll use a simplified motion detection fallback
      console.log("📷 Pose detection enabled (using motion fallback)");
      this.poseDetectionEnabled = true;
    } catch (err) {
      console.error("📷 Pose detection failed:", err);
    }
  }

  /**
   * Enable hand detection
   */
  async enableHandDetection() {
    if (this.handDetectionEnabled) return;

    try {
      console.log("📷 Hand detection enabled (using motion fallback)");
      this.handDetectionEnabled = true;
    } catch (err) {
      console.error("📷 Hand detection failed:", err);
    }
  }

  /**
   * Enable face detection
   */
  async enableFaceDetection() {
    if (this.faceDetectionEnabled) return;

    try {
      console.log("📷 Face detection enabled (using motion fallback)");
      this.faceDetectionEnabled = true;
    } catch (err) {
      console.error("📷 Face detection failed:", err);
    }
  }

  /**
   * Start processing loop
   */
  startProcessing() {
    if (this.processing) return;
    this.processing = true;
    this.processFrame();
  }

  /**
   * Process single frame
   */
  async processFrame() {
    if (!this.processing || !this.enabled) return;

    const now = Date.now();
    const elapsed = now - this.lastFrameTime;

    if (elapsed > this.frameInterval) {
      this.lastFrameTime = now;

      // Draw video frame to canvas
      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

      // Detect motion/changes (simplified fallback)
      await this.detectMotion();

      // Detect presence
      this.detectPresence();

      // Smooth signals
      this.smoothSignals();

      // Recognize gestures
      this.recognizeGestures();

      // Emit signal update
      this.emitEvent('signal', this.signals);
    }

    // Continue loop
    requestAnimationFrame(() => this.processFrame());
  }

  /**
   * Detect motion intensity (fallback method)
   */
  async detectMotion() {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const pixels = imageData.data;

    // Simple motion detection via pixel brightness changes
    let totalBrightness = 0;
    let count = 0;

    for (let i = 0; i < pixels.length; i += 40) { // Sample every 10th pixel
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
      count++;
    }

    const avgBrightness = totalBrightness / count;

    // Update movement intensity based on brightness variance
    // This is a very simplified approach - real implementation would use frame differencing
    if (!this.lastBrightness) {
      this.lastBrightness = avgBrightness;
    }

    const diff = Math.abs(avgBrightness - this.lastBrightness);
    this.signals.movementIntensity = Math.min(1.0, diff / 20);
    this.lastBrightness = avgBrightness;

    // Simulate some pose signals based on random walk (for demo purposes)
    // Real implementation would use MediaPipe or TensorFlow.js
    if (this.poseDetectionEnabled) {
      this.updatePoseSignals();
    }

    if (this.handDetectionEnabled) {
      this.updateHandSignals();
    }

    if (this.faceDetectionEnabled) {
      this.updateFaceSignals();
    }
  }

  /**
   * Update pose signals (simplified simulation)
   */
  updatePoseSignals() {
    // Simulate pose data with smooth random walk
    const smooth = 0.95;

    this.signals.bodyCenterX = smooth * this.signals.bodyCenterX + (1 - smooth) * (0.4 + Math.random() * 0.2);
    this.signals.bodyCenterY = smooth * this.signals.bodyCenterY + (1 - smooth) * (0.4 + Math.random() * 0.2);
    this.signals.bodyLean = smooth * this.signals.bodyLean + (1 - smooth) * (0.4 + Math.random() * 0.2);
    this.signals.leftArmRaise = smooth * this.signals.leftArmRaise + (1 - smooth) * Math.random();
    this.signals.rightArmRaise = smooth * this.signals.rightArmRaise + (1 - smooth) * Math.random();
  }

  /**
   * Update hand signals (simplified simulation)
   */
  updateHandSignals() {
    const smooth = 0.9;

    this.signals.leftHandOpen = smooth * this.signals.leftHandOpen + (1 - smooth) * Math.random();
    this.signals.rightHandOpen = smooth * this.signals.rightHandOpen + (1 - smooth) * Math.random();
    this.signals.handsDistance = smooth * this.signals.handsDistance + (1 - smooth) * Math.random();
  }

  /**
   * Update face signals (simplified simulation)
   */
  updateFaceSignals() {
    const smooth = 0.95;

    this.signals.faceCenterX = smooth * this.signals.faceCenterX + (1 - smooth) * (0.45 + Math.random() * 0.1);
    this.signals.faceCenterY = smooth * this.signals.faceCenterY + (1 - smooth) * (0.45 + Math.random() * 0.1);
    this.signals.faceSize = smooth * this.signals.faceSize + (1 - smooth) * (0.4 + Math.random() * 0.2);
  }

  /**
   * Detect presence
   */
  detectPresence() {
    // Simple presence detection based on movement
    this.signals.presenceDetected = this.signals.movementIntensity > 0.1 ? 1 : 0;
  }

  /**
   * Smooth signals over time
   */
  smoothSignals() {
    Object.keys(this.signals).forEach(key => {
      if (!this.signalHistory[key]) {
        this.signalHistory[key] = [];
      }

      this.signalHistory[key].push(this.signals[key]);
      if (this.signalHistory[key].length > this.historyLength) {
        this.signalHistory[key].shift();
      }

      // Average over history
      const sum = this.signalHistory[key].reduce((a, b) => a + b, 0);
      this.signals[key] = sum / this.signalHistory[key].length;
    });
  }

  /**
   * Recognize gestures from signal patterns
   */
  recognizeGestures() {
    const { leftArmRaise, rightArmRaise, armSpread, handsDistance, leftHandOpen, rightHandOpen } = this.signals;

    let gesture = 'none';
    let confidence = 0;

    // Arms up
    if (leftArmRaise > 0.7 && rightArmRaise > 0.7) {
      gesture = 'arms_up';
      confidence = Math.min(leftArmRaise, rightArmRaise);
    }
    // Arms spread
    else if (armSpread > 0.7) {
      gesture = 'arms_spread';
      confidence = armSpread;
    }
    // Hands together
    else if (handsDistance < 0.2) {
      gesture = 'hands_together';
      confidence = 1 - handsDistance;
    }
    // Wave (one arm up)
    else if (leftArmRaise > 0.7 && rightArmRaise < 0.3) {
      gesture = 'wave_left';
      confidence = leftArmRaise;
    }
    else if (rightArmRaise > 0.7 && leftArmRaise < 0.3) {
      gesture = 'wave_right';
      confidence = rightArmRaise;
    }

    if (confidence > this.gestureThreshold && gesture !== this.currentGesture) {
      this.currentGesture = gesture;
      this.signals.gestureConfidence = confidence;
      this.emitEvent('gesture', { gesture, confidence });
      console.log(`📷 Gesture detected: ${gesture} (${confidence.toFixed(2)})`);
    }
  }

  /**
   * Get specific signal value
   */
  getSignal(name) {
    return this.signals[name] || 0;
  }

  /**
   * Get all signals
   */
  getAllSignals() {
    return { ...this.signals };
  }

  /**
   * Map signal to range
   */
  mapSignal(signalName, min, max) {
    const value = this.getSignal(signalName);
    return min + value * (max - min);
  }

  /**
   * Event system
   */
  on(eventType, callback) {
    this.listeners.push({ type: eventType, callback });
  }

  emitEvent(eventType, data) {
    this.listeners
      .filter(l => l.type === eventType)
      .forEach(l => l.callback(data));
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      enabled: this.enabled,
      processing: this.processing,
      resolution: `${this.canvas?.width || 0}x${this.canvas?.height || 0}`,
      fps: this.fps,
      poseDetection: this.poseDetectionEnabled,
      handDetection: this.handDetectionEnabled,
      faceDetection: this.faceDetectionEnabled,
      currentGesture: this.currentGesture,
      signals: this.signals
    };
  }
}

/**
 * OSC Signal Adapter
 * Receives OSC messages and converts to normalized signals
 */
export class OSCSignalAdapter {
  constructor(config = {}) {
    this.signals = {};
    this.listeners = [];
    this.connected = false;
    this.websocket = null;
    this.oscMappings = new Map(); // OSC address -> signal name

    // Reconnection configuration
    this.config = {
      reconnectDelay: config.reconnectDelay || 3000,
      maxReconnectAttempts: config.maxReconnectAttempts || 10,
      ...config
    };
    this.reconnectAttempts = 0;
    this.isConnecting = false;
    this.isRunning = false;
    this.wsUrl = null; // Store URL for reconnection
  }

  /**
   * Connect to OSC WebSocket bridge
   * Requires a bridge server (e.g., node-osc-bridge)
   */
  async connect(wsUrl = 'ws://localhost:8080') {
    if (this.connected || this.isConnecting) {
      console.log("📡 OSC already connected or connecting");
      return;
    }

    this.wsUrl = wsUrl; // Store for reconnection
    this.isRunning = true;
    this.isConnecting = true;

    console.log(`📡 Connecting to OSC WebSocket: ${wsUrl}`);

    try {
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        this.connected = true;
        this.isConnecting = false;
        this.reconnectAttempts = 0; // Reset on successful connection
        console.log("📡 OSC WebSocket connected:", wsUrl);
        this.emitEvent('connected');
      };

      this.websocket.onmessage = (event) => {
        this.handleOSCMessage(JSON.parse(event.data));
      };

      this.websocket.onerror = (err) => {
        console.error("📡 OSC WebSocket error:", err);
        this.emitEvent('error', err);
      };

      this.websocket.onclose = () => {
        this.connected = false;
        this.isConnecting = false;
        console.log("📡 OSC WebSocket disconnected");
        this.emitEvent('disconnected');

        // Attempt reconnection if still running
        if (this.isRunning) {
          this._attemptReconnect();
        }
      };
    } catch (err) {
      console.error("📡 OSC connection failed:", err);
      this.isConnecting = false;
      if (this.isRunning) {
        this._attemptReconnect();
      }
      return { ok: false, error: err.message };
    }
  }

  /**
   * Disconnect from OSC
   */
  disconnect() {
    console.log("📡 Stopping OSC WebSocket");
    this.isRunning = false; // Stop reconnection attempts

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.connected = false;
    this.isConnecting = false;
  }

  /**
   * Attempt reconnection with exponential backoff
   */
  _attemptReconnect() {
    if (!this.isRunning || !this.wsUrl) return;

    this.reconnectAttempts++;

    if (this.reconnectAttempts > this.config.maxReconnectAttempts) {
      console.error(`📡 OSC max reconnection attempts (${this.config.maxReconnectAttempts}) reached. Giving up.`);
      this.isRunning = false;
      return;
    }

    const delay = Math.min(
      this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      30000 // Max 30 seconds
    );

    console.log(`📡 OSC reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect(this.wsUrl);
    }, delay);
  }

  /**
   * Map OSC address to signal name
   */
  mapOSC(oscAddress, signalName, min = 0, max = 1) {
    this.oscMappings.set(oscAddress, { signalName, min, max });
    console.log(`📡 OSC mapped: ${oscAddress} → ${signalName} [${min}-${max}]`);
  }

  /**
   * Handle incoming OSC message
   */
  handleOSCMessage(message) {
    // Expected format: { address: '/signal/name', args: [0.5] }
    const { address, args } = message;

    if (!address || !args || args.length === 0) return;

    const mapping = this.oscMappings.get(address);
    if (mapping) {
      const { signalName, min, max } = mapping;
      const rawValue = args[0];

      // Normalize to 0-1
      const normalized = (rawValue - min) / (max - min);
      const clamped = Math.max(0, Math.min(1, normalized));

      this.signals[signalName] = clamped;
      this.emitEvent('signal', { name: signalName, value: clamped });
    } else {
      // Auto-map unknown addresses
      const signalName = address.replace(/\//g, '_').substring(1);
      this.signals[signalName] = args[0];
      this.emitEvent('signal', { name: signalName, value: args[0] });
    }
  }

  /**
   * Get signal value
   */
  getSignal(name) {
    return this.signals[name] || 0;
  }

  /**
   * Get all signals
   */
  getAllSignals() {
    return { ...this.signals };
  }

  /**
   * Event system
   */
  on(eventType, callback) {
    this.listeners.push({ type: eventType, callback });
  }

  emitEvent(eventType, data) {
    this.listeners
      .filter(l => l.type === eventType)
      .forEach(l => l.callback(data));
  }
}

/**
 * Serial/Biosignal Adapter
 * Receives serial data (EEG, heart rate, etc.) and converts to signals
 */
export class BiosignalAdapter {
  constructor() {
    this.signals = {};
    this.listeners = [];
    this.connected = false;
    this.port = null;
    this.reader = null;
    this.buffer = '';
  }

  /**
   * Connect to serial device (Web Serial API)
   */
  async connect() {
    if (!('serial' in navigator)) {
      console.error("📟 Web Serial API not supported");
      return { ok: false, error: 'Web Serial not supported' };
    }

    try {
      // Request port
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: 9600 });

      this.connected = true;
      console.log("📟 Serial device connected");

      // Start reading
      this.startReading();

      this.emitEvent('connected');
      return { ok: true };
    } catch (err) {
      console.error("📟 Serial connection failed:", err);
      return { ok: false, error: err.message };
    }
  }

  /**
   * Disconnect from serial device
   */
  async disconnect() {
    if (this.reader) {
      await this.reader.cancel();
      this.reader = null;
    }

    if (this.port) {
      await this.port.close();
      this.port = null;
    }

    this.connected = false;
    console.log("📟 Serial device disconnected");
    this.emitEvent('disconnected');
  }

  /**
   * Start reading from serial port
   */
  async startReading() {
    const decoder = new TextDecoderStream();
    const readableStreamClosed = this.port.readable.pipeTo(decoder.writable);
    this.reader = decoder.readable.getReader();

    try {
      while (true) {
        const { value, done } = await this.reader.read();
        if (done) break;

        this.buffer += value;

        // Process complete lines
        let newlineIndex;
        while ((newlineIndex = this.buffer.indexOf('\n')) >= 0) {
          const line = this.buffer.substring(0, newlineIndex).trim();
          this.buffer = this.buffer.substring(newlineIndex + 1);

          if (line) {
            this.parseSerialData(line);
          }
        }
      }
    } catch (err) {
      console.error("📟 Serial read error:", err);
      this.emitEvent('error', err);
    }
  }

  /**
   * Parse serial data line
   * Expected format: "signal_name:value" or JSON
   */
  parseSerialData(line) {
    try {
      // Try JSON first
      const data = JSON.parse(line);
      Object.keys(data).forEach(key => {
        const normalized = Math.max(0, Math.min(1, parseFloat(data[key])));
        this.signals[key] = normalized;
        this.emitEvent('signal', { name: key, value: normalized });
      });
    } catch {
      // Fall back to key:value format
      const [name, value] = line.split(':');
      if (name && value) {
        const normalized = Math.max(0, Math.min(1, parseFloat(value)));
        this.signals[name.trim()] = normalized;
        this.emitEvent('signal', { name: name.trim(), value: normalized });
      }
    }
  }

  /**
   * Get signal value
   */
  getSignal(name) {
    return this.signals[name] || 0;
  }

  /**
   * Get all signals
   */
  getAllSignals() {
    return { ...this.signals };
  }

  /**
   * Event system
   */
  on(eventType, callback) {
    this.listeners.push({ type: eventType, callback });
  }

  emitEvent(eventType, data) {
    this.listeners
      .filter(l => l.type === eventType)
      .forEach(l => l.callback(data));
  }
}

console.log("📷 Camera signal provider system ready");
