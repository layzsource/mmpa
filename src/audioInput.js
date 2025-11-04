console.log("🎤 audioInput.js loaded");

/**
 * MMPA Audio Input Module - Phase 4
 *
 * Handles Web Audio API setup for microphone and file input.
 * Provides audio context, analyzer node, and stream management.
 *
 * Philosophy:
 * - The instrument must hear before it can see
 * - Clean separation between audio capture and analysis
 * - Support both live (microphone) and stored (file) input
 */

// Singleton audio context (required for Web Audio API)
let audioContext = null;
let analyzerNode = null;
let microphoneStream = null;
let sourceNode = null;
let fileAudioElement = null;

/**
 * Initialize Web Audio API context
 * Must be called from user interaction (browser security requirement)
 */
export function initAudioContext() {
  if (audioContext) {
    console.log("🎤 Audio context already initialized");
    return audioContext;
  }

  // Create AudioContext (cross-browser support)
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContextClass();

  // Create analyzer node for frequency/time domain analysis
  analyzerNode = audioContext.createAnalyser();
  analyzerNode.fftSize = 2048; // 2048 samples = ~46ms at 44.1kHz
  analyzerNode.smoothingTimeConstant = 0.8; // Smooth frequency data

  console.log(`🎤 Audio context initialized (${audioContext.sampleRate}Hz)`);
  return audioContext;
}

/**
 * Get the current audio context (lazy init)
 */
export function getAudioContext() {
  if (!audioContext) {
    initAudioContext();
  }
  return audioContext;
}

/**
 * Get the analyzer node (for Meyda integration)
 */
export function getAnalyzerNode() {
  return analyzerNode;
}

/**
 * Get audio context sample rate
 */
export function getSampleRate() {
  return audioContext ? audioContext.sampleRate : 44100;
}

/**
 * Get current FFT size
 */
export function getFFTSize() {
  return analyzerNode ? analyzerNode.fftSize : 2048;
}

/**
 * Get list of available audio input devices
 * @returns {Promise<Array>} Array of {deviceId, label} objects
 */
export async function getAudioInputDevices() {
  try {
    // Request permission first (required to get device labels)
    await navigator.mediaDevices.getUserMedia({ audio: true });

    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = devices
      .filter(device => device.kind === 'audioinput')
      .map(device => ({
        deviceId: device.deviceId,
        label: device.label || `Microphone ${device.deviceId.substr(0, 8)}`
      }));

    console.log(`🎤 Found ${audioInputs.length} audio input devices:`, audioInputs);
    return audioInputs;
  } catch (error) {
    console.error("🎤 Failed to enumerate devices:", error);
    return [];
  }
}

/**
 * Start microphone input
 * @param {string} deviceId - Optional specific device ID (e.g., BlackHole)
 * Returns Promise that resolves when mic is active
 */
export async function startMicrophone(deviceId = null) {
  try {
    // Ensure audio context exists
    if (!audioContext) {
      initAudioContext();
    }

    // Resume context if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Stop any existing sources
    stopAllSources();

    // Build audio constraints
    const audioConstraints = {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false
    };

    // Add device ID if specified
    if (deviceId) {
      audioConstraints.deviceId = { exact: deviceId };
      console.log(`🎤 Requesting specific device: ${deviceId}`);
    } else {
      console.log("🎤 Requesting default microphone...");
    }

    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: audioConstraints
    });

    microphoneStream = stream;

    // Create source from microphone stream
    sourceNode = audioContext.createMediaStreamSource(stream);
    sourceNode.connect(analyzerNode);

    const deviceLabel = stream.getAudioTracks()[0].label;
    console.log(`🎤 Microphone active: ${deviceLabel}`);
    return true;
  } catch (error) {
    console.error("🎤 Microphone access failed:", error);
    throw error;
  }
}

/**
 * Stop microphone input
 */
export function stopMicrophone() {
  if (microphoneStream) {
    microphoneStream.getTracks().forEach(track => track.stop());
    microphoneStream = null;
    console.log("🎤 Microphone stopped");
  }

  if (sourceNode) {
    sourceNode.disconnect();
    sourceNode = null;
  }
}

/**
 * Start audio file playback
 * @param {File} file - Audio file from file input
 * Returns Promise that resolves when file is ready
 */
export async function startAudioFile(file) {
  try {
    // Ensure audio context exists
    if (!audioContext) {
      initAudioContext();
    }

    // Resume context if suspended
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Stop any existing sources
    stopAllSources();

    // Create audio element for file playback
    fileAudioElement = new Audio();
    fileAudioElement.src = URL.createObjectURL(file);
    fileAudioElement.loop = true; // Loop for continuous analysis

    // Create source from audio element
    sourceNode = audioContext.createMediaElementSource(fileAudioElement);
    sourceNode.connect(analyzerNode);
    analyzerNode.connect(audioContext.destination); // Connect to speakers

    // Start playback
    await fileAudioElement.play();

    console.log(`🎤 Audio file playing: ${file.name}`);
    return true;
  } catch (error) {
    console.error("🎤 Audio file playback failed:", error);
    throw error;
  }
}

/**
 * Stop audio file playback
 */
export function stopAudioFile() {
  if (fileAudioElement) {
    fileAudioElement.pause();
    fileAudioElement.src = '';
    fileAudioElement = null;
    console.log("🎤 Audio file stopped");
  }

  if (sourceNode) {
    sourceNode.disconnect();
    sourceNode = null;
  }
}

/**
 * Stop all audio sources
 */
export function stopAllSources() {
  stopMicrophone();
  stopAudioFile();
}

/**
 * Check if audio is currently active
 */
export function isAudioActive() {
  return sourceNode !== null;
}

/**
 * Get current audio source type
 */
export function getSourceType() {
  if (microphoneStream) return 'microphone';
  if (fileAudioElement) return 'file';
  return 'none';
}

/**
 * Get time domain data (waveform)
 * @param {Uint8Array} buffer - Optional buffer to fill (will create if not provided)
 */
export function getTimeDomainData(buffer = null) {
  if (!analyzerNode) return null;

  const bufferLength = analyzerNode.fftSize;
  const dataArray = buffer || new Uint8Array(bufferLength);
  analyzerNode.getByteTimeDomainData(dataArray);
  return dataArray;
}

/**
 * Get frequency domain data (spectrum)
 * @param {Uint8Array} buffer - Optional buffer to fill (will create if not provided)
 */
export function getFrequencyData(buffer = null) {
  if (!analyzerNode) return null;

  const bufferLength = analyzerNode.frequencyBinCount;
  const dataArray = buffer || new Uint8Array(bufferLength);
  analyzerNode.getByteFrequencyData(dataArray);
  return dataArray;
}

/**
 * Debug: Log current audio status
 */
export function debugAudioInput() {
  console.log("🎤 AUDIO INPUT DEBUG");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Context State:", audioContext?.state);
  console.log("Sample Rate:", getSampleRate());
  console.log("FFT Size:", getFFTSize());
  console.log("Source Type:", getSourceType());
  console.log("Audio Active:", isAudioActive());
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

console.log("🎤 AudioInput ready - The instrument can now hear");
