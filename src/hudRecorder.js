import { state } from './state.js';
import {
  startRecording,
  stopRecording,
  downloadRecording,
  downloadRecordingAsMP4,
  discardRecording,
  getRecordingStatus,
  onRecordingStatusChange,
  formatDuration
} from './recorder.js';

let canvas = null;
let audioContext = null;
let audioDestination = null;

export function initRecorder(canvasElement, audioCtx = null) {
  canvas = canvasElement;
  audioContext = audioCtx;

  // Create audio destination for capturing audio
  if (audioContext) {
    try {
      audioDestination = audioContext.createMediaStreamDestination();
      console.log('🎥 Audio destination created for recording');
    } catch (error) {
      console.warn('🎥 Could not create audio destination:', error);
    }
  }
}

export function getAudioDestination() {
  return audioDestination;
}

export function createRecorderHudSection(container) {
  // Initialize state
  if (!state.recorder) {
    state.recorder = {
      captureAudio: true,
      quality: 'high' // high, medium, low
    };
  }

  const section = document.createElement('div');
  section.className = 'hud-section';

  const title = document.createElement('h3');
  title.textContent = 'Video Recording';
  section.appendChild(title);

  // Status indicator
  const statusContainer = document.createElement('div');
  statusContainer.className = 'hud-control';
  statusContainer.style.display = 'flex';
  statusContainer.style.alignItems = 'center';
  statusContainer.style.gap = '10px';

  const statusIndicator = document.createElement('div');
  statusIndicator.style.width = '12px';
  statusIndicator.style.height = '12px';
  statusIndicator.style.borderRadius = '50%';
  statusIndicator.style.backgroundColor = '#555';
  statusIndicator.style.transition = 'background-color 0.3s';

  const statusText = document.createElement('span');
  statusText.textContent = 'Ready';
  statusText.style.fontWeight = 'bold';

  const durationText = document.createElement('span');
  durationText.textContent = '0:00';
  durationText.style.marginLeft = 'auto';
  durationText.style.fontFamily = 'monospace';

  statusContainer.appendChild(statusIndicator);
  statusContainer.appendChild(statusText);
  statusContainer.appendChild(durationText);
  section.appendChild(statusContainer);

  // Update status display
  function updateStatus(status) {
    if (status.isRecording) {
      statusIndicator.style.backgroundColor = '#ff0000';
      statusIndicator.style.animation = 'pulse 1s infinite';
      statusText.textContent = '● Recording';
      durationText.textContent = formatDuration(status.duration);
      startStopButton.textContent = '⏹ Stop Recording';
      downloadButton.disabled = true;
      downloadMP4Button.disabled = true;
      discardButton.disabled = true;
    } else if (status.chunkCount > 0) {
      statusIndicator.style.backgroundColor = '#00ff00';
      statusIndicator.style.animation = 'none';
      statusText.textContent = 'Ready to Download';
      durationText.textContent = formatDuration(status.duration);
      startStopButton.textContent = '⏺ Start Recording';
      downloadButton.disabled = false;
      downloadMP4Button.disabled = false;
      discardButton.disabled = false;
    } else {
      statusIndicator.style.backgroundColor = '#555';
      statusIndicator.style.animation = 'none';
      statusText.textContent = 'Ready';
      durationText.textContent = '0:00';
      startStopButton.textContent = '⏺ Start Recording';
      downloadButton.disabled = true;
      downloadMP4Button.disabled = true;
      discardButton.disabled = true;
    }
  }

  // Subscribe to status changes
  onRecordingStatusChange(updateStatus);

  // Capture Audio toggle
  const audioContainer = document.createElement('div');
  audioContainer.className = 'hud-control';
  const audioLabel = document.createElement('label');
  audioLabel.textContent = 'Capture Audio: ';
  const audioCheckbox = document.createElement('input');
  audioCheckbox.type = 'checkbox';
  audioCheckbox.checked = state.recorder.captureAudio;
  audioCheckbox.addEventListener('change', (e) => {
    state.recorder.captureAudio = e.target.checked;
  });
  audioLabel.appendChild(audioCheckbox);
  audioContainer.appendChild(audioLabel);
  section.appendChild(audioContainer);

  // Start/Stop button
  const startStopButton = document.createElement('button');
  startStopButton.textContent = '⏺ Start Recording';
  startStopButton.style.width = '100%';
  startStopButton.style.padding = '10px';
  startStopButton.style.fontSize = '14px';
  startStopButton.style.marginTop = '5px';
  startStopButton.addEventListener('click', async () => {
    const status = getRecordingStatus();

    if (status.isRecording) {
      // Stop recording
      startStopButton.disabled = true;
      startStopButton.textContent = 'Stopping...';
      await stopRecording();
      startStopButton.disabled = false;
    } else {
      // Start recording
      if (!canvas) {
        console.error('🎥 Canvas not initialized');
        alert('Recording error: Canvas not found');
        return;
      }

      let audioStream = null;
      if (state.recorder.captureAudio && audioDestination) {
        audioStream = audioDestination.stream;
      }

      const success = await startRecording(canvas, audioStream);
      if (!success) {
        alert('Failed to start recording. Check console for details.');
      }
    }
  });
  section.appendChild(startStopButton);

  // Download buttons container (for side-by-side layout)
  const downloadContainer = document.createElement('div');
  downloadContainer.style.display = 'flex';
  downloadContainer.style.gap = '5px';
  downloadContainer.style.marginTop = '5px';

  // Download WebM button
  const downloadButton = document.createElement('button');
  downloadButton.textContent = '⬇ WebM';
  downloadButton.disabled = true;
  downloadButton.style.flex = '1';
  downloadButton.style.padding = '10px';
  downloadButton.addEventListener('click', async () => {
    await downloadRecording();
    updateStatus(getRecordingStatus());
  });
  downloadContainer.appendChild(downloadButton);

  // Download MP4 button
  const downloadMP4Button = document.createElement('button');
  downloadMP4Button.textContent = '⬇ MP4';
  downloadMP4Button.disabled = true;
  downloadMP4Button.style.flex = '1';
  downloadMP4Button.style.padding = '10px';
  downloadMP4Button.addEventListener('click', async () => {
    try {
      // Show progress feedback
      downloadMP4Button.disabled = true;
      downloadMP4Button.textContent = 'Converting...';

      await downloadRecordingAsMP4(null, (progress) => {
        downloadMP4Button.textContent = `Converting ${Math.round(progress)}%`;
      });

      downloadMP4Button.textContent = '⬇ MP4';
      updateStatus(getRecordingStatus());
    } catch (error) {
      alert('MP4 conversion failed. Check console for details.');
      downloadMP4Button.textContent = '⬇ MP4';
      downloadMP4Button.disabled = false;
    }
  });
  downloadContainer.appendChild(downloadMP4Button);

  section.appendChild(downloadContainer);

  // Discard button
  const discardButton = document.createElement('button');
  discardButton.textContent = '🗑 Discard Recording';
  discardButton.disabled = true;
  discardButton.style.width = '100%';
  discardButton.style.padding = '10px';
  discardButton.style.marginTop = '5px';
  discardButton.addEventListener('click', () => {
    if (confirm('Discard this recording?')) {
      discardRecording();
      updateStatus(getRecordingStatus());
    }
  });
  section.appendChild(discardButton);

  // Info text
  const infoText = document.createElement('div');
  infoText.style.fontSize = '11px';
  infoText.style.color = '#888';
  infoText.style.marginTop = '10px';
  infoText.style.lineHeight = '1.4';
  infoText.innerHTML = `
    <strong>Quality:</strong> 60 FPS, 8 Mbps<br>
    <strong>Formats:</strong> WebM (instant) or MP4 (H.264, converted)<br>
    <strong>Note:</strong> MP4 conversion uses native FFmpeg (fast, 5-10 seconds for 20-second video).
  `;
  section.appendChild(infoText);

  // Add pulse animation for recording indicator
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `;
  document.head.appendChild(style);

  // Initialize with current status
  updateStatus(getRecordingStatus());

  container.appendChild(section);
}

console.log('🎥 Recorder HUD module loaded');
