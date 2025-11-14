// Timeline & Playback System (Phase 13.16)
// Enables temporal navigation through captured performance data

console.log("⏱️ timelineManager.js loaded");

export class TimelineManager {
  constructor(options = {}) {
    // Recording state
    this.recording = false;
    this.playing = false;
    this.paused = false;

    // Timeline data
    this.frames = [];
    this.currentFrame = 0;
    this.recordingStartTime = 0;
    this.fps = options.fps || 60;

    // Metadata
    this.metadata = {
      recordedAt: null,
      duration: 0,
      fps: this.fps,
      version: '13.16'
    };

    // Callbacks
    this.onFrameCaptured = null;
    this.onPlaybackFrame = null;
    this.onStateChange = null;

    // Playback control
    this.playbackSpeed = 1.0;
    this.loop = false;
    this.playbackIntervalId = null;

    // Memory management
    this.maxFrames = options.maxFrames || 18000; // 5 minutes at 60fps

    console.log(`⏱️ TimelineManager initialized (max ${this.maxFrames} frames, ${this.fps} fps)`);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RECORDING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Start recording timeline frames
   */
  startRecording() {
    if (this.recording) {
      console.warn('⏱️ Already recording');
      return false;
    }

    this.recording = true;
    this.frames = [];
    this.currentFrame = 0;
    this.recordingStartTime = performance.now();
    this.metadata.recordedAt = new Date().toISOString();

    console.log('⏱️ Recording started');
    this.notifyStateChange();
    return true;
  }

  /**
   * Stop recording
   */
  stopRecording() {
    if (!this.recording) {
      console.warn('⏱️ Not recording');
      return false;
    }

    this.recording = false;
    this.metadata.duration = this.frames.length / this.fps;

    console.log(`⏱️ Recording stopped: ${this.frames.length} frames (${this.metadata.duration.toFixed(2)}s)`);
    this.notifyStateChange();
    return true;
  }

  /**
   * Capture current frame state
   * @param {Object} state - Complete system state
   */
  captureFrame(state) {
    if (!this.recording) return;

    // Check memory limit
    if (this.frames.length >= this.maxFrames) {
      console.warn(`⏱️ Max frames reached (${this.maxFrames}), stopping recording`);
      this.stopRecording();
      return;
    }

    const frame = {
      index: this.frames.length,
      timestamp: performance.now() - this.recordingStartTime,

      // Audio data
      audio: {
        bands: { ...state.audioBands },
        level: state.audioLevel,
        spectrum: state.audioSpectrum ? [...state.audioSpectrum] : null,
        features: state.audioFeatures ? { ...state.audioFeatures } : null,
        peakFreq: state.peakFreq
      },

      // MMPA state
      mmpa: state.mmpa ? {
        sigma_star: state.mmpa.sigma_star,
        bifurcation_risk: state.mmpa.bifurcation_risk,
        control_signal: state.mmpa.control_signal ? [...state.mmpa.control_signal] : null,
        predictions: state.mmpa.predictions ? { ...state.mmpa.predictions } : null,
        attribution: state.mmpa.attribution ? { ...state.mmpa.attribution } : null
      } : null,

      // Visual parameters (simplified - just key values)
      visual: {
        currentPreset: state.currentPreset,
        morphProgress: state.morphProgress,
        // Add more as needed
      }
    };

    this.frames.push(frame);

    // Callback for UI updates
    if (this.onFrameCaptured) {
      this.onFrameCaptured(frame);
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PLAYBACK
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Start playback from current position
   */
  play() {
    if (this.frames.length === 0) {
      console.warn('⏱️ No frames to play');
      return false;
    }

    if (this.playing && !this.paused) {
      console.warn('⏱️ Already playing');
      return false;
    }

    this.playing = true;
    this.paused = false;

    // If at end, restart from beginning
    if (this.currentFrame >= this.frames.length - 1) {
      this.currentFrame = 0;
    }

    // Start playback loop
    const frameInterval = (1000 / this.fps) / this.playbackSpeed;
    this.playbackIntervalId = setInterval(() => {
      this.playNextFrame();
    }, frameInterval);

    console.log(`⏱️ Playback started at frame ${this.currentFrame}`);
    this.notifyStateChange();
    return true;
  }

  /**
   * Pause playback
   */
  pause() {
    if (!this.playing || this.paused) {
      console.warn('⏱️ Not playing or already paused');
      return false;
    }

    this.paused = true;
    if (this.playbackIntervalId) {
      clearInterval(this.playbackIntervalId);
      this.playbackIntervalId = null;
    }

    console.log(`⏱️ Playback paused at frame ${this.currentFrame}`);
    this.notifyStateChange();
    return true;
  }

  /**
   * Stop playback and reset to beginning
   */
  stop() {
    if (!this.playing) {
      console.warn('⏱️ Not playing');
      return false;
    }

    this.playing = false;
    this.paused = false;
    this.currentFrame = 0;

    if (this.playbackIntervalId) {
      clearInterval(this.playbackIntervalId);
      this.playbackIntervalId = null;
    }

    console.log('⏱️ Playback stopped');
    this.notifyStateChange();
    return true;
  }

  /**
   * Play next frame in sequence
   */
  playNextFrame() {
    if (this.currentFrame >= this.frames.length - 1) {
      // Reached end
      if (this.loop) {
        this.currentFrame = 0;
      } else {
        this.stop();
        return;
      }
    }

    this.currentFrame++;
    const frame = this.frames[this.currentFrame];

    // Callback to update system with frame data
    if (this.onPlaybackFrame) {
      this.onPlaybackFrame(frame);
    }
  }

  /**
   * Seek to specific frame
   * @param {number} frameIndex - Frame index to seek to
   */
  seek(frameIndex) {
    if (frameIndex < 0 || frameIndex >= this.frames.length) {
      console.warn(`⏱️ Invalid frame index: ${frameIndex}`);
      return false;
    }

    const wasPlaying = this.playing && !this.paused;
    if (wasPlaying) {
      this.pause();
    }

    this.currentFrame = frameIndex;
    const frame = this.frames[this.currentFrame];

    // Callback to update system with frame data
    if (this.onPlaybackFrame) {
      this.onPlaybackFrame(frame);
    }

    if (wasPlaying) {
      this.play();
    }

    this.notifyStateChange();
    return true;
  }

  /**
   * Seek to specific time (in seconds)
   * @param {number} seconds - Time to seek to
   */
  seekToTime(seconds) {
    const frameIndex = Math.floor(seconds * this.fps);
    return this.seek(frameIndex);
  }

  /**
   * Set playback speed
   * @param {number} speed - Speed multiplier (0.5, 1.0, 2.0, etc.)
   */
  setPlaybackSpeed(speed) {
    if (speed <= 0) {
      console.warn('⏱️ Invalid playback speed');
      return false;
    }

    this.playbackSpeed = speed;

    // If playing, restart interval with new speed
    if (this.playing && !this.paused) {
      const wasPlaying = true;
      this.pause();
      if (wasPlaying) {
        this.play();
      }
    }

    console.log(`⏱️ Playback speed set to ${speed}x`);
    this.notifyStateChange();
    return true;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // DATA MANAGEMENT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Get current frame data
   */
  getCurrentFrame() {
    if (this.currentFrame >= 0 && this.currentFrame < this.frames.length) {
      return this.frames[this.currentFrame];
    }
    return null;
  }

  /**
   * Clear timeline data
   */
  clear() {
    const wasRecording = this.recording;
    const wasPlaying = this.playing;

    if (wasRecording) this.stopRecording();
    if (wasPlaying) this.stop();

    this.frames = [];
    this.currentFrame = 0;
    this.metadata = {
      recordedAt: null,
      duration: 0,
      fps: this.fps,
      version: '13.16'
    };

    console.log('⏱️ Timeline cleared');
    this.notifyStateChange();
  }

  /**
   * Export timeline as JSON
   */
  exportJSON() {
    return {
      metadata: this.metadata,
      frames: this.frames,
      version: '13.16'
    };
  }

  /**
   * Import timeline from JSON
   * @param {Object} data - Timeline data
   */
  importJSON(data) {
    if (!data.frames || !Array.isArray(data.frames)) {
      console.error('⏱️ Invalid timeline data');
      return false;
    }

    this.clear();
    this.frames = data.frames;
    this.metadata = data.metadata || this.metadata;
    this.currentFrame = 0;

    console.log(`⏱️ Timeline imported: ${this.frames.length} frames`);
    this.notifyStateChange();
    return true;
  }

  /**
   * Download timeline as JSON file
   */
  download() {
    const data = this.exportJSON();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `MMPA_Timeline_${timestamp}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`⏱️ Timeline downloaded: ${filename}`);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STATUS & CALLBACKS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Get current status
   */
  getStatus() {
    return {
      recording: this.recording,
      playing: this.playing,
      paused: this.paused,
      frameCount: this.frames.length,
      currentFrame: this.currentFrame,
      duration: this.frames.length / this.fps,
      currentTime: this.currentFrame / this.fps,
      playbackSpeed: this.playbackSpeed,
      loop: this.loop,
      hasData: this.frames.length > 0,
      metadata: this.metadata
    };
  }

  /**
   * Notify state change to callbacks
   */
  notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange(this.getStatus());
    }
  }

  /**
   * Format time for display (MM:SS.ms)
   */
  static formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }
}

console.log("⏱️ TimelineManager class ready");
