// Timeline HUD (Phase 13.16)
// UI controls for timeline recording and playback

console.log("⏱️ hudTimeline.js loaded");

import { TimelineManager } from './timelineManager.js';
import { timelinePlaybackPanel } from './timelinePlaybackPanel.js'; // Phase 13.17

/**
 * Create Timeline HUD section
 * @param {HTMLElement} container - Container to append timeline controls to
 * @param {TimelineManager} timelineManager - Timeline manager instance
 */
export function createTimelineHudSection(container, timelineManager) {
  const section = document.createElement('div');
  section.className = 'hud-section';
  section.id = 'timeline-hud-section';

  const title = document.createElement('h3');
  title.textContent = 'Timeline & Playback';
  section.appendChild(title);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STATUS INDICATOR
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const statusContainer = document.createElement('div');
  statusContainer.className = 'hud-control';
  statusContainer.style.display = 'flex';
  statusContainer.style.alignItems = 'center';
  statusContainer.style.gap = '10px';
  statusContainer.style.marginBottom = '10px';

  const statusIndicator = document.createElement('div');
  statusIndicator.style.width = '12px';
  statusIndicator.style.height = '12px';
  statusIndicator.style.borderRadius = '50%';
  statusIndicator.style.backgroundColor = '#555';
  statusIndicator.style.transition = 'background-color 0.3s';

  const statusText = document.createElement('span');
  statusText.textContent = 'Ready';
  statusText.style.fontWeight = 'bold';
  statusText.style.fontSize = '12px';

  const frameCounter = document.createElement('span');
  frameCounter.textContent = '0 frames';
  frameCounter.style.marginLeft = 'auto';
  frameCounter.style.fontSize = '11px';
  frameCounter.style.color = '#888';

  statusContainer.appendChild(statusIndicator);
  statusContainer.appendChild(statusText);
  statusContainer.appendChild(frameCounter);
  section.appendChild(statusContainer);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TIME DISPLAY & PROGRESS BAR
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const timeDisplay = document.createElement('div');
  timeDisplay.style.display = 'flex';
  timeDisplay.style.justifyContent = 'space-between';
  timeDisplay.style.fontSize = '11px';
  timeDisplay.style.color = '#ccc';
  timeDisplay.style.fontFamily = 'monospace';
  timeDisplay.style.marginBottom = '5px';

  const currentTimeSpan = document.createElement('span');
  currentTimeSpan.textContent = '0:00.00';

  const durationSpan = document.createElement('span');
  durationSpan.textContent = '0:00.00';

  timeDisplay.appendChild(currentTimeSpan);
  timeDisplay.appendChild(durationSpan);
  section.appendChild(timeDisplay);

  // Timeline scrubber
  const scrubberContainer = document.createElement('div');
  scrubberContainer.style.width = '100%';
  scrubberContainer.style.height = '30px';
  scrubberContainer.style.position = 'relative';
  scrubberContainer.style.marginBottom = '10px';
  scrubberContainer.style.cursor = 'pointer';

  const scrubberTrack = document.createElement('div');
  scrubberTrack.style.width = '100%';
  scrubberTrack.style.height = '6px';
  scrubberTrack.style.backgroundColor = '#333';
  scrubberTrack.style.borderRadius = '3px';
  scrubberTrack.style.position = 'absolute';
  scrubberTrack.style.top = '50%';
  scrubberTrack.style.transform = 'translateY(-50%)';

  const scrubberProgress = document.createElement('div');
  scrubberProgress.style.width = '0%';
  scrubberProgress.style.height = '100%';
  scrubberProgress.style.backgroundColor = '#4CAF50';
  scrubberProgress.style.borderRadius = '3px';
  scrubberProgress.style.transition = 'width 0.1s';

  const scrubberHandle = document.createElement('div');
  scrubberHandle.style.width = '16px';
  scrubberHandle.style.height = '16px';
  scrubberHandle.style.backgroundColor = '#fff';
  scrubberHandle.style.borderRadius = '50%';
  scrubberHandle.style.position = 'absolute';
  scrubberHandle.style.top = '50%';
  scrubberHandle.style.left = '0%';
  scrubberHandle.style.transform = 'translate(-50%, -50%)';
  scrubberHandle.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
  scrubberHandle.style.transition = 'left 0.1s';

  scrubberTrack.appendChild(scrubberProgress);
  scrubberContainer.appendChild(scrubberTrack);
  scrubberContainer.appendChild(scrubberHandle);
  section.appendChild(scrubberContainer);

  // Scrubber interaction
  let scrubbing = false;

  function handleScrub(e) {
    const rect = scrubberContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    const status = timelineManager.getStatus();

    if (status.frameCount > 0) {
      const targetFrame = Math.floor(percent * status.frameCount);
      timelineManager.seek(targetFrame);
    }
  }

  scrubberContainer.addEventListener('mousedown', (e) => {
    scrubbing = true;
    handleScrub(e);
  });

  document.addEventListener('mousemove', (e) => {
    if (scrubbing) {
      handleScrub(e);
    }
  });

  document.addEventListener('mouseup', () => {
    scrubbing = false;
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TRANSPORT CONTROLS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const transportContainer = document.createElement('div');
  transportContainer.style.display = 'flex';
  transportContainer.style.gap = '5px';
  transportContainer.style.marginBottom = '10px';

  // Record button
  const recordButton = document.createElement('button');
  recordButton.textContent = '⏺ Record';
  recordButton.style.flex = '1';
  recordButton.style.padding = '8px';
  recordButton.style.fontSize = '13px';
  recordButton.addEventListener('click', () => {
    const status = timelineManager.getStatus();
    if (status.recording) {
      timelineManager.stopRecording();
    } else {
      timelineManager.startRecording();
    }
  });

  // Play/Pause button
  const playPauseButton = document.createElement('button');
  playPauseButton.textContent = '▶ Play';
  playPauseButton.style.flex = '1';
  playPauseButton.style.padding = '8px';
  playPauseButton.style.fontSize = '13px';
  playPauseButton.disabled = true;
  playPauseButton.addEventListener('click', () => {
    const status = timelineManager.getStatus();
    if (status.playing && !status.paused) {
      timelineManager.pause();
    } else if (status.paused) {
      timelineManager.play();
    } else {
      // Phase 13.17: Open playback panel when starting playback
      timelineManager.play();
      timelinePlaybackPanel.open();
    }
  });

  // Stop button
  const stopButton = document.createElement('button');
  stopButton.textContent = '⏹ Stop';
  stopButton.style.flex = '1';
  stopButton.style.padding = '8px';
  stopButton.style.fontSize = '13px';
  stopButton.disabled = true;
  stopButton.addEventListener('click', () => {
    timelineManager.stop();
  });

  transportContainer.appendChild(recordButton);
  transportContainer.appendChild(playPauseButton);
  transportContainer.appendChild(stopButton);
  section.appendChild(transportContainer);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CHRONELIX VIEWER TOGGLE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const chronelixViewerButton = document.createElement('button');
  chronelixViewerButton.textContent = '🧬 View Chronelix';
  chronelixViewerButton.style.width = '100%';
  chronelixViewerButton.style.padding = '8px';
  chronelixViewerButton.style.fontSize = '13px';
  chronelixViewerButton.style.marginBottom = '10px';
  chronelixViewerButton.style.background = 'linear-gradient(90deg, rgba(0,206,209,0.3) 0%, rgba(148,0,211,0.3) 100%)';
  chronelixViewerButton.addEventListener('click', () => {
    if (timelinePlaybackPanel.isOpen) {
      timelinePlaybackPanel.close();
      chronelixViewerButton.textContent = '🧬 View Chronelix';
    } else {
      timelinePlaybackPanel.open();
      chronelixViewerButton.textContent = '✕ Close Chronelix';
    }
  });

  section.appendChild(chronelixViewerButton);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PLAYBACK CONTROLS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const playbackContainer = document.createElement('div');
  playbackContainer.className = 'hud-control';
  playbackContainer.style.marginBottom = '10px';

  const speedLabel = document.createElement('label');
  speedLabel.textContent = 'Speed: ';
  speedLabel.style.fontSize = '12px';

  const speedSelect = document.createElement('select');
  speedSelect.style.marginLeft = '5px';
  ['0.25x', '0.5x', '0.75x', '1x', '1.5x', '2x', '4x'].forEach(speed => {
    const option = document.createElement('option');
    option.value = speed;
    option.textContent = speed;
    if (speed === '1x') option.selected = true;
    speedSelect.appendChild(option);
  });
  speedSelect.addEventListener('change', (e) => {
    const speed = parseFloat(e.target.value);
    timelineManager.setPlaybackSpeed(speed);
  });

  const loopLabel = document.createElement('label');
  loopLabel.textContent = ' Loop: ';
  loopLabel.style.marginLeft = '15px';
  loopLabel.style.fontSize = '12px';

  const loopCheckbox = document.createElement('input');
  loopCheckbox.type = 'checkbox';
  loopCheckbox.checked = false;
  loopCheckbox.addEventListener('change', (e) => {
    timelineManager.loop = e.target.checked;
  });

  speedLabel.appendChild(speedSelect);
  loopLabel.appendChild(loopCheckbox);
  playbackContainer.appendChild(speedLabel);
  playbackContainer.appendChild(loopLabel);
  section.appendChild(playbackContainer);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FILE OPERATIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const fileContainer = document.createElement('div');
  fileContainer.style.display = 'flex';
  fileContainer.style.gap = '5px';
  fileContainer.style.marginBottom = '10px';

  // Save button
  const saveButton = document.createElement('button');
  saveButton.textContent = '💾 Save';
  saveButton.style.flex = '1';
  saveButton.style.padding = '8px';
  saveButton.style.fontSize = '12px';
  saveButton.disabled = true;
  saveButton.addEventListener('click', () => {
    timelineManager.download();
  });

  // Load button
  const loadButton = document.createElement('button');
  loadButton.textContent = '📂 Load';
  loadButton.style.flex = '1';
  loadButton.style.padding = '8px';
  loadButton.style.fontSize = '12px';
  loadButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            timelineManager.importJSON(data);
          } catch (error) {
            console.error('⏱️ Failed to load timeline:', error);
            alert('Failed to load timeline file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  });

  // Clear button
  const clearButton = document.createElement('button');
  clearButton.textContent = '🗑️ Clear';
  clearButton.style.flex = '1';
  clearButton.style.padding = '8px';
  clearButton.style.fontSize = '12px';
  clearButton.disabled = true;
  clearButton.addEventListener('click', () => {
    if (confirm('Clear timeline data?')) {
      timelineManager.clear();
    }
  });

  fileContainer.appendChild(saveButton);
  fileContainer.appendChild(loadButton);
  fileContainer.appendChild(clearButton);
  section.appendChild(fileContainer);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // INFO TEXT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const infoText = document.createElement('div');
  infoText.style.fontSize = '11px';
  infoText.style.color = '#888';
  infoText.style.lineHeight = '1.4';
  infoText.innerHTML = `
    <strong>Timeline:</strong> Record up to 5 minutes at 60fps<br>
    <strong>Features:</strong> Scrub, playback, save/load sessions<br>
    <strong>Tip:</strong> Use for exploring audio patterns over time
  `;
  section.appendChild(infoText);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UPDATE UI FUNCTION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  function updateUI(status) {
    // Status indicator
    if (status.recording) {
      statusIndicator.style.backgroundColor = '#ff0000';
      statusIndicator.style.animation = 'pulse 1s infinite';
      statusText.textContent = '● Recording';
    } else if (status.playing && !status.paused) {
      statusIndicator.style.backgroundColor = '#4CAF50';
      statusIndicator.style.animation = 'none';
      statusText.textContent = '▶ Playing';
    } else if (status.paused) {
      statusIndicator.style.backgroundColor = '#FFA500';
      statusIndicator.style.animation = 'none';
      statusText.textContent = '⏸ Paused';
    } else if (status.hasData) {
      statusIndicator.style.backgroundColor = '#2196F3';
      statusIndicator.style.animation = 'none';
      statusText.textContent = 'Ready';
    } else {
      statusIndicator.style.backgroundColor = '#555';
      statusIndicator.style.animation = 'none';
      statusText.textContent = 'Ready';
    }

    // Frame counter
    frameCounter.textContent = `${status.frameCount} frames`;

    // Time display
    currentTimeSpan.textContent = TimelineManager.formatTime(status.currentTime);
    durationSpan.textContent = TimelineManager.formatTime(status.duration);

    // Progress bar
    const progress = status.frameCount > 0 ? (status.currentFrame / status.frameCount) * 100 : 0;
    scrubberProgress.style.width = `${progress}%`;
    scrubberHandle.style.left = `${progress}%`;

    // Button states
    recordButton.textContent = status.recording ? '⏹ Stop Rec' : '⏺ Record';
    recordButton.disabled = status.playing;

    playPauseButton.textContent = (status.playing && !status.paused) ? '⏸ Pause' : '▶ Play';
    playPauseButton.disabled = !status.hasData || status.recording;

    stopButton.disabled = !status.playing || status.recording;

    saveButton.disabled = !status.hasData || status.recording || status.playing;
    clearButton.disabled = !status.hasData || status.recording || status.playing;
  }

  // Subscribe to timeline state changes
  timelineManager.onStateChange = updateUI;

  // Initial UI update
  updateUI(timelineManager.getStatus());

  // Add pulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `;
  document.head.appendChild(style);

  container.appendChild(section);

  console.log('⏱️ Timeline HUD created');
}

console.log("⏱️ hudTimeline module ready");
