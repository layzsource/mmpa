// Video Recording System using MediaRecorder API
import { state } from './state.js';

let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;
let recordingStartTime = 0;
let recordingDuration = 0;
let animationFrameId = null;

// FFmpeg.wasm for MP4 conversion
let ffmpeg = null;
let ffmpegLoaded = false;
let ffmpegLoading = false;

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

// Load FFmpeg.wasm for MP4 conversion
async function loadFFmpeg() {
  if (ffmpegLoaded) return true;
  if (ffmpegLoading) {
    console.log('🎥 FFmpeg already loading...');
    // Wait for loading to complete
    while (ffmpegLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return ffmpegLoaded;
  }

  try {
    ffmpegLoading = true;
    console.log('🎥 Loading FFmpeg.wasm for MP4 conversion...');

    // Dynamically import FFmpeg.wasm
    const { FFmpeg } = await import('https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.7/dist/esm/index.min.js');
    const { fetchFile, toBlobURL } = await import('https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/dist/esm/index.min.js');

    ffmpeg = new FFmpeg();

    // Load FFmpeg core
    const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
    });

    ffmpegLoaded = true;
    console.log('🎥 FFmpeg.wasm loaded successfully');
    return true;

  } catch (error) {
    console.error('🎥 Failed to load FFmpeg.wasm:', error);
    ffmpegLoaded = false;
    return false;
  } finally {
    ffmpegLoading = false;
  }
}

// Convert WebM to MP4 using native FFmpeg (Electron) or FFmpeg.wasm (browser)
async function convertToMP4(webmBlob, onProgress = null) {
  // Check if running in Electron with native FFmpeg support
  if (window.electronAPI && window.electronAPI.convertToMP4) {
    try {
      console.log('🎥 Converting WebM to MP4 using native FFmpeg...');
      const startTime = Date.now();

      // Convert blob to array buffer
      const webmData = await webmBlob.arrayBuffer();
      const webmArray = Array.from(new Uint8Array(webmData));

      // Call native FFmpeg via Electron IPC
      const mp4Array = await window.electronAPI.convertToMP4(webmArray);

      // Convert back to blob
      const mp4Blob = new Blob([new Uint8Array(mp4Array)], { type: 'video/mp4' });

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`🎥 Native FFmpeg conversion complete in ${duration}s`);

      // Report 100% progress
      if (onProgress) onProgress(100);

      return mp4Blob;

    } catch (error) {
      console.error('🎥 Native FFmpeg conversion failed:', error);
      throw error;
    }
  }

  // Fallback to FFmpeg.wasm (browser-only, slow)
  console.warn('🎥 Native FFmpeg not available, falling back to FFmpeg.wasm (slow)');

  if (!await loadFFmpeg()) {
    throw new Error('Failed to load FFmpeg');
  }

  try {
    console.log('🎥 Converting WebM to MP4 with FFmpeg.wasm...');

    // Register progress callback
    if (onProgress) {
      ffmpeg.on('progress', ({ progress }) => {
        onProgress(progress * 100);
      });
    }

    // Write input file
    const webmData = await webmBlob.arrayBuffer();
    await ffmpeg.writeFile('input.webm', new Uint8Array(webmData));

    // Convert to MP4 with H.264 codec
    await ffmpeg.exec([
      '-i', 'input.webm',
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '18',
      '-c:a', 'aac',
      '-b:a', '128k',
      'output.mp4'
    ]);

    // Read output file
    const data = await ffmpeg.readFile('output.mp4');
    const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });

    // Cleanup
    await ffmpeg.deleteFile('input.webm');
    await ffmpeg.deleteFile('output.mp4');

    console.log('🎥 MP4 conversion complete (FFmpeg.wasm)');
    return mp4Blob;

  } catch (error) {
    console.error('🎥 MP4 conversion failed:', error);
    throw error;
  }
}

// Download recording as MP4
export async function downloadRecordingAsMP4(filename = null, onProgress = null) {
  if (recordedChunks.length === 0) {
    console.warn('🎥 No recording data to download');
    return;
  }

  try {
    // Create WebM blob from chunks
    const webmBlob = new Blob(recordedChunks, {
      type: recordedChunks[0].type || 'video/webm'
    });

    const webmSize = (webmBlob.size / 1024 / 1024).toFixed(2);
    console.log(`🎥 Converting to MP4 (${webmSize} MB WebM)`);

    // Convert to MP4
    const mp4Blob = await convertToMP4(webmBlob, onProgress);

    const mp4Size = (mp4Blob.size / 1024 / 1024).toFixed(2);
    console.log(`🎥 Creating MP4 download (${mp4Size} MB)`);

    // Generate filename
    if (!filename) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      filename = `MMPA_Recording_${timestamp}.mp4`;
    }

    // Create download link
    const url = URL.createObjectURL(mp4Blob);
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
      console.log(`🎥 Downloaded: ${filename} (${mp4Size} MB)`);
    }, 100);

    // Clear chunks
    recordedChunks = [];

  } catch (error) {
    console.error('🎥 MP4 download failed:', error);
    throw error;
  }
}

// Check if FFmpeg is loaded
export function isFFmpegReady() {
  return ffmpegLoaded;
}

// Preload FFmpeg (optional, can be called on app init)
export async function preloadFFmpeg() {
  return await loadFFmpeg();
}

console.log('🎥 Recorder module loaded');
