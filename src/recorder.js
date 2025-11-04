// Video Recording System using MediaRecorder API
import { state } from './state.js';

let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;
let recordingStartTime = 0;
let recordingDuration = 0;
let animationFrameId = null;

// Recording status callbacks
const statusCallbacks = new Set();

export function onRecordingStatusChange(callback) {
  statusCallbacks.add(callback);
}

function notifyStatusChange(status) {
  statusCallbacks.forEach(cb => cb(status));
}

// Get recording status
export function getRecordingStatus() {
  return {
    isRecording,
    duration: recordingDuration,
    chunkCount: recordedChunks.length
  };
}

// Start recording
export async function startRecording(canvas, audioStream = null) {
  if (isRecording) {
    console.warn('🎥 Recording already in progress');
    return false;
  }

  try {
    // Get canvas stream
    const canvasStream = canvas.captureStream(60); // 60 FPS
    console.log('🎥 Canvas stream captured at 60 FPS');

    // Combine streams if audio is available
    let combinedStream;
    if (audioStream) {
      combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ]);
      console.log('🎥 Combined video + audio stream created');
    } else {
      combinedStream = canvasStream;
      console.log('🎥 Video-only stream (no audio available)');
    }

    // Check supported formats
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm',
      'video/mp4'
    ];

    let selectedMimeType = null;
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        selectedMimeType = mimeType;
        console.log(`🎥 Using codec: ${mimeType}`);
        break;
      }
    }

    if (!selectedMimeType) {
      throw new Error('No supported video codec found');
    }

    // Create MediaRecorder
    mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: selectedMimeType,
      videoBitsPerSecond: 8000000, // 8 Mbps for high quality
      audioBitsPerSecond: 128000   // 128 kbps audio
    });

    recordedChunks = [];

    // Handle data available
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
        console.log(`🎥 Chunk received: ${(event.data.size / 1024 / 1024).toFixed(2)} MB (total: ${recordedChunks.length})`);
      }
    };

    // Handle recording stop
    mediaRecorder.onstop = () => {
      console.log('🎥 Recording stopped');
      isRecording = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      notifyStatusChange(getRecordingStatus());
    };

    // Handle errors
    mediaRecorder.onerror = (event) => {
      console.error('🎥 Recording error:', event.error);
      stopRecording();
    };

    // Start recording
    mediaRecorder.start(100); // Collect data every 100ms
    isRecording = true;
    recordingStartTime = performance.now();
    recordingDuration = 0;

    // Update duration timer
    function updateDuration() {
      if (isRecording) {
        recordingDuration = (performance.now() - recordingStartTime) / 1000;
        notifyStatusChange(getRecordingStatus());
        animationFrameId = requestAnimationFrame(updateDuration);
      }
    }
    updateDuration();

    console.log('🎥 Recording started');
    notifyStatusChange(getRecordingStatus());
    return true;

  } catch (error) {
    console.error('🎥 Failed to start recording:', error);
    return false;
  }
}

// Stop recording
export function stopRecording() {
  if (!isRecording || !mediaRecorder) {
    console.warn('🎥 No active recording to stop');
    return null;
  }

  return new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      console.log('🎥 Recording stopped');
      isRecording = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      notifyStatusChange(getRecordingStatus());
      resolve(recordedChunks);
    };

    mediaRecorder.stop();

    // Stop all tracks
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
  });
}

// Download recording
export async function downloadRecording(filename = null) {
  if (recordedChunks.length === 0) {
    console.warn('🎥 No recording data to download');
    return;
  }

  try {
    // Create blob from chunks
    const blob = new Blob(recordedChunks, {
      type: recordedChunks[0].type || 'video/webm'
    });

    const totalSize = (blob.size / 1024 / 1024).toFixed(2);
    console.log(`🎥 Creating download (${totalSize} MB)`);

    // Generate filename
    if (!filename) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
      filename = `MMPA_Recording_${timestamp}.${extension}`;
    }

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log(`🎥 Downloaded: ${filename} (${totalSize} MB)`);
    }, 100);

    // Clear chunks
    recordedChunks = [];

  } catch (error) {
    console.error('🎥 Download failed:', error);
  }
}

// Discard recording
export function discardRecording() {
  recordedChunks = [];
  recordingDuration = 0;
  console.log('🎥 Recording discarded');
  notifyStatusChange(getRecordingStatus());
}

// Format duration for display
export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

console.log('🎥 Recorder module loaded');
