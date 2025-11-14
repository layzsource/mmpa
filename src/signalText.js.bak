// src/signalText.js
// Text Stream Signal Input - Typing, Clipboard, File streams
// Maps text characteristics to signal bands

import { UniversalSignal } from './signalCore.js';

console.log("📝 signalText.js loaded");

/**
 * TextSignal - Extracts signals from text input streams
 * Maps text properties to signal bands:
 * - bass: Word/sentence rhythm (punctuation, pauses)
 * - mid: Character frequency (typing speed)
 * - treble: Complexity (unique chars, capitalization)
 * - level: Overall text activity
 */
export class TextSignal extends UniversalSignal {
  constructor(name = 'TextStream') {
    super('text', name);

    // Text buffer
    this.buffer = '';
    this.maxBufferSize = 1000;

    // Typing metrics
    this.typingMetrics = {
      lastKeyTime: 0,
      keyInterval: 0,
      typingSpeed: 0,  // chars/sec
      burstiness: 0    // variance in typing speed
    };

    // Text analysis
    this.textMetrics = {
      charFrequency: 0,   // recent typing rate
      complexity: 0,      // unique chars / total chars
      rhythm: 0,          // punctuation density
      sentiment: 0        // positive/negative tone (simple)
    };

    // History for analysis
    this.keyHistory = [];
    this.maxKeyHistory = 100;

    // Features
    this.features = {
      rhythm: 0,      // Punctuation, sentence breaks
      frequency: 0,   // Typing speed
      complexity: 0,  // Character diversity
      activity: 0     // Overall text activity
    };

    // Settings
    this.settings = {
      mode: 'keyboard',  // keyboard | paste | file | stream
      smoothing: 0.8,
      rhythmSensitivity: 1.0,
      activityDecay: 0.95
    };

    // Input modes
    this.inputElement = null;
    this.fileReader = null;
    this.streamReader = null;

    // Event handlers
    this.handleKeydown = this.onKeydown.bind(this);
    this.handlePaste = this.onPaste.bind(this);

    // Update loop
    this.updateLoop = null;

    console.log("📝 TextSignal created");
  }

  /**
   * Initialize text signal
   */
  async init(mode = 'keyboard') {
    this.state = 'initializing';
    this.emitState('initializing');

    try {
      this.settings.mode = mode;

      if (mode === 'keyboard') {
        // Listen to document keyboard events
        document.addEventListener('keydown', this.handleKeydown);
        document.addEventListener('paste', this.handlePaste);
      }

      this.state = 'ready';
      this.emitState('ready');
      console.log(`📝 TextSignal initialized (mode: ${mode})`);
    } catch (err) {
      this.state = 'error';
      this.emitState('error');
      console.error("📝 Text init error:", err);
      throw err;
    }
  }

  /**
   * Start text signal processing
   */
  async start() {
    if (this.state === 'idle') await this.init();
    if (this.state !== 'ready') return;

    await super.start();

    // Start analysis loop
    this.startAnalysisLoop();

    console.log("📝 Text signal started");
  }

  /**
   * Stop text signal
   */
  async stop() {
    await super.stop();

    // Stop analysis loop
    if (this.updateLoop) {
      clearInterval(this.updateLoop);
      this.updateLoop = null;
    }

    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('paste', this.handlePaste);

    console.log("📝 Text signal stopped");
  }

  /**
   * Keydown event handler
   */
  onKeydown(event) {
    if (!this.enabled) return;

    const now = performance.now();
    const char = event.key;

    // Skip modifier keys
    if (['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'Escape'].includes(char)) {
      return;
    }

    // Add character to buffer
    if (char.length === 1) {
      this.addText(char);
    } else if (char === 'Enter') {
      this.addText('\n');
    } else if (char === 'Space') {
      this.addText(' ');
    } else if (char === 'Backspace' && this.buffer.length > 0) {
      this.buffer = this.buffer.slice(0, -1);
    }

    // Track typing metrics
    if (this.typingMetrics.lastKeyTime > 0) {
      this.typingMetrics.keyInterval = now - this.typingMetrics.lastKeyTime;
      this.typingMetrics.typingSpeed = 1000 / this.typingMetrics.keyInterval; // chars/sec
    }

    this.typingMetrics.lastKeyTime = now;

    // Add to key history
    this.keyHistory.push({ char, time: now });
    if (this.keyHistory.length > this.maxKeyHistory) {
      this.keyHistory.shift();
    }
  }

  /**
   * Paste event handler
   */
  onPaste(event) {
    if (!this.enabled) return;

    event.preventDefault();
    const text = event.clipboardData.getData('text');
    this.addText(text);
    console.log(`📝 Pasted ${text.length} characters`);
  }

  /**
   * Add text to buffer
   */
  addText(text) {
    this.buffer += text;

    // Trim buffer if too large
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer = this.buffer.slice(-this.maxBufferSize);
    }
  }

  /**
   * Load text from file
   */
  async loadFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target.result;
        this.addText(text);
        console.log(`📝 Loaded ${text.length} characters from file`);
        resolve(text);
      };

      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  /**
   * Set text stream (for piped input)
   */
  setStream(stream) {
    // Stream could be from WebSocket, EventSource, etc.
    this.streamReader = stream;
    console.log("📝 Text stream connected");
  }

  /**
   * Start analysis loop
   */
  startAnalysisLoop() {
    // Update at ~20Hz
    this.updateLoop = setInterval(() => {
      if (!this.enabled || this.state !== 'running') return;

      this.analyzeText();
      this.updateBandsFromFeatures();
      this.emit('frame');

      // Apply activity decay
      this.features.activity *= this.settings.activityDecay;
    }, 50);
  }

  /**
   * Analyze current text buffer
   */
  analyzeText() {
    if (this.buffer.length === 0) {
      this.textMetrics = {
        charFrequency: 0,
        complexity: 0,
        rhythm: 0,
        sentiment: 0
      };
      return;
    }

    // Character frequency (recent typing rate)
    const recentKeys = this.keyHistory.slice(-20);
    if (recentKeys.length > 1) {
      const timeSpan = recentKeys[recentKeys.length - 1].time - recentKeys[0].time;
      this.textMetrics.charFrequency = timeSpan > 0 ? (recentKeys.length / timeSpan) * 1000 : 0;
    }

    // Complexity (character diversity)
    const uniqueChars = new Set(this.buffer.toLowerCase()).size;
    const totalChars = this.buffer.length;
    this.textMetrics.complexity = totalChars > 0 ? uniqueChars / Math.min(totalChars, 100) : 0;

    // Rhythm (punctuation density)
    const punctuation = this.buffer.match(/[.,;:!?-]/g) || [];
    const spaces = this.buffer.match(/\s/g) || [];
    this.textMetrics.rhythm = (punctuation.length + spaces.length) / Math.max(totalChars, 1);

    // Simple sentiment (exclamation = positive, question = neutral, period = calm)
    const exclamations = (this.buffer.match(/!/g) || []).length;
    const questions = (this.buffer.match(/\?/g) || []).length;
    this.textMetrics.sentiment = (exclamations - questions) / Math.max(totalChars, 1);

    // Extract features with activity boost
    this.extractFeatures();
  }

  /**
   * Extract features from text metrics
   */
  extractFeatures() {
    // Rhythm: punctuation and sentence breaks (low frequency)
    const rhythm = Math.min(1, this.textMetrics.rhythm * this.settings.rhythmSensitivity * 5);

    // Frequency: typing speed (mid frequency)
    const frequency = Math.min(1, this.textMetrics.charFrequency / 10);

    // Complexity: character diversity (high frequency)
    const complexity = Math.min(1, this.textMetrics.complexity * 2);

    // Activity: overall text activity (recent typing)
    const recentActivity = this.keyHistory.length > 0 ? 1 : 0;
    const activity = recentActivity > 0 ? Math.min(1, this.textMetrics.charFrequency / 5) : 0;

    // Apply smoothing
    const s = this.settings.smoothing;
    this.features.rhythm = this.features.rhythm * s + rhythm * (1 - s);
    this.features.frequency = this.features.frequency * s + frequency * (1 - s);
    this.features.complexity = this.features.complexity * s + complexity * (1 - s);
    this.features.activity = Math.max(this.features.activity, activity); // Don't smooth activity down
  }

  /**
   * Map text features to signal bands
   */
  updateBandsFromFeatures() {
    // Bass: Rhythm (punctuation, pauses)
    this.bands.bass = this.features.rhythm;

    // Mid: Typing frequency
    this.bands.mid = this.features.frequency;

    // Treble: Complexity (character diversity)
    this.bands.treble = this.features.complexity;

    // Level: Overall activity
    this.bands.level = this.features.activity;

    // Update spectrum
    this.updateSpectrum();

    // Update metadata
    this.metadata.quality = this.buffer.length / this.maxBufferSize;
  }

  /**
   * Create text "spectrum"
   */
  updateSpectrum() {
    // Map text features across spectrum
    const rhythmLevel = this.features.rhythm * 255;
    const frequencyLevel = this.features.frequency * 255;
    const complexityLevel = this.features.complexity * 255;
    const activityLevel = this.features.activity * 255;

    // Low bins: rhythm
    for (let i = 0; i < 16; i++) this.spectrum[i] = rhythmLevel;

    // Mid-low bins: frequency
    for (let i = 16; i < 32; i++) this.spectrum[i] = frequencyLevel;

    // Mid-high bins: complexity
    for (let i = 32; i < 48; i++) this.spectrum[i] = complexityLevel;

    // High bins: activity
    for (let i = 48; i < 64; i++) this.spectrum[i] = activityLevel;
  }

  /**
   * Get current text buffer
   */
  getBuffer() {
    return this.buffer;
  }

  /**
   * Get recent text (last N chars)
   */
  getRecentText(n = 100) {
    return this.buffer.slice(-n);
  }

  /**
   * Clear buffer
   */
  clearBuffer() {
    this.buffer = '';
    this.keyHistory = [];
    console.log("📝 Buffer cleared");
  }

  /**
   * Settings
   */
  setRhythmSensitivity(value) {
    this.settings.rhythmSensitivity = Math.max(0.1, Math.min(10, value));
  }

  setActivityDecay(value) {
    this.settings.activityDecay = Math.max(0.5, Math.min(0.99, value));
  }

  setSmoothing(value) {
    this.settings.smoothing = Math.max(0, Math.min(1, value));
  }

  /**
   * Get text metrics for debugging
   */
  getMetrics() {
    return {
      bufferLength: this.buffer.length,
      typingSpeed: this.typingMetrics.typingSpeed.toFixed(2),
      recentKeys: this.keyHistory.length,
      metrics: { ...this.textMetrics },
      features: { ...this.features }
    };
  }
}

console.log("📝 Text signal system ready");
