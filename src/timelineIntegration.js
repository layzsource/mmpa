// Timeline Integration Module (Phase 13.16)
// Quick integration wrapper for adding timeline to existing system

console.log("⏱️ timelineIntegration.js loaded");

import { TimelineManager } from './timelineManager.js';
import { createTimelineHudSection } from './hudTimeline.js';

// Global timeline instance
let timeline = null;

/**
 * Initialize timeline system and add to HUD
 * @param {HTMLElement} hudContainer - HUD container to add timeline panel to
 */
export function initTimeline(hudContainer) {
  if (timeline) {
    console.warn('⏱️ Timeline already initialized');
    return timeline;
  }

  // Create timeline manager
  timeline = new TimelineManager({
    fps: 60,
    maxFrames: 18000 // 5 minutes at 60fps
  });

  // Setup playback callback to drive system
  timeline.onPlaybackFrame = (frame) => {
    // When playing back, inject frame data into the system
    // This will override live audio with recorded data
    if (window.AudioEngine && frame.audio) {
      // Override audio values during playback
      window.TimelinePlaybackData = frame;
    }
  };

  // Add to HUD if container provided
  if (hudContainer) {
    createTimelineHudSection(hudContainer, timeline);
  }

  // Expose globally for easy access
  window.Timeline = timeline;
  window.captureTimelineFrame = captureTimelineFrame;

  console.log('⏱️ Timeline system initialized');
  return timeline;
}

/**
 * Capture current frame (call this from render loop)
 */
export function captureTimelineFrame() {
  if (!timeline || !timeline.recording) return;

  try {
    // Gather system state using correct AudioEngine API
    const audioEngine = window.AudioEngine;
    const spectrum = audioEngine?.getSpectrum?.() || new Uint8Array(0);
    const audioAnalysis = audioEngine?.getAudioAnalysisData?.() || null;

    const state = {
      // Audio data - using correct API
      audioBands: audioEngine?.bands || { bass: 0, mid: 0, treble: 0 },
      audioLevel: audioEngine?.getRMS?.() || 0,
      audioSpectrum: spectrum.length > 0 ? Array.from(spectrum) : null,
      audioFeatures: audioAnalysis,
      peakFreq: audioAnalysis?.dominant_frequency || 0,

      // MMPA state - using correct method
      mmpa: audioEngine?.getMMPAHUDData?.() || null,

      // Visual state
      currentPreset: window.getCurrentPresetName?.() || 'unknown',
      morphProgress: window.getMorphProgress?.() || 0
    };

    timeline.captureFrame(state);
  } catch (error) {
    console.error('⏱️ Frame capture error:', error);
  }
}

/**
 * Get timeline instance
 */
export function getTimeline() {
  return timeline;
}

/**
 * Check if timeline is playing (use this to override live audio)
 */
export function isTimelinePlaying() {
  return timeline && timeline.playing && !timeline.paused;
}

/**
 * Get current playback frame data
 */
export function getPlaybackData() {
  if (!isTimelinePlaying()) return null;
  return timeline.getCurrentFrame();
}

console.log("⏱️ Timeline integration module ready");
