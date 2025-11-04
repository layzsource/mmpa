// src/hudSignals.js
// HUD interface for Signal Multimodality
// Control panel for audio, camera, sensor, text signal inputs

console.log("📡 hudSignals.js loaded");

import { signalRouter } from './signalRouter.js';

/**
 * Create Signal Multimodality HUD section
 */
export function createSignalHUD(container) {
  const section = document.createElement('div');
  section.className = 'hud-section signal-multimodality';
  section.style.maxWidth = '400px';

  const title = document.createElement('h3');
  title.textContent = '📡 Signal Multimodality';
  section.appendChild(title);

  const intro = document.createElement('p');
  intro.textContent = 'Universal signal substrate: audio, camera, sensors, text → morphs';
  intro.style.cssText = `
    font-size: 11px;
    margin-bottom: 12px;
    opacity: 0.8;
  `;
  section.appendChild(intro);

  // === SIGNAL SOURCES ===
  const sourcesSection = document.createElement('div');
  sourcesSection.style.marginBottom = '16px';

  const sourcesTitle = document.createElement('h4');
  sourcesTitle.textContent = 'Signal Sources';
  sourcesTitle.style.fontSize = '13px';
  sourcesTitle.style.marginBottom = '8px';
  sourcesSection.appendChild(sourcesTitle);

  // Audio source
  createSourceControl(sourcesSection, 'audio', '🎵 Audio (Microphone)', true);

  // Camera source
  createSourceControl(sourcesSection, 'camera', '📷 Camera (Webcam)', false);

  // Sensor source
  createSourceControl(sourcesSection, 'sensor', '🎯 Sensors (Motion)', false);

  // Text source
  createSourceControl(sourcesSection, 'text', '📝 Text (Typing)', false);

  section.appendChild(sourcesSection);

  // === MIXING CONTROLS ===
  const mixSection = document.createElement('div');
  mixSection.style.marginBottom = '16px';

  const mixTitle = document.createElement('h4');
  mixTitle.textContent = 'Signal Mixing';
  mixTitle.style.fontSize = '13px';
  mixTitle.style.marginBottom = '8px';
  mixSection.appendChild(mixTitle);

  // Mix mode selector
  const modeLabel = document.createElement('label');
  modeLabel.textContent = 'Mix Mode:';
  modeLabel.style.display = 'block';
  modeLabel.style.marginBottom = '3px';
  modeLabel.style.fontSize = '11px';
  mixSection.appendChild(modeLabel);

  const modeSelect = document.createElement('select');
  modeSelect.style.width = '100%';
  modeSelect.style.marginBottom = '12px';
  ['blend', 'max', 'sum', 'multiply'].forEach(mode => {
    const option = document.createElement('option');
    option.value = mode;
    option.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
    modeSelect.appendChild(option);
  });
  modeSelect.addEventListener('change', () => {
    signalRouter.setMixMode(modeSelect.value);
  });
  mixSection.appendChild(modeSelect);

  section.appendChild(mixSection);

  // === ROUTING TARGETS ===
  const targetsSection = document.createElement('div');
  targetsSection.style.marginBottom = '16px';

  const targetsTitle = document.createElement('h4');
  targetsTitle.textContent = 'Routing Targets';
  targetsTitle.style.fontSize = '13px';
  targetsTitle.style.marginBottom = '8px';
  targetsSection.appendChild(targetsTitle);

  createTargetControl(targetsSection, 'morphWeights', 'Morph Weights', true);
  createTargetControl(targetsSection, 'geometry', 'Geometry', true);
  createTargetControl(targetsSection, 'particles', 'Particles', true);
  createTargetControl(targetsSection, 'lighting', 'Lighting', false);
  createTargetControl(targetsSection, 'colors', 'Colors', false);

  section.appendChild(targetsSection);

  // === SIGNAL VISUALIZER ===
  const vizSection = document.createElement('div');
  vizSection.style.marginBottom = '16px';

  const vizTitle = document.createElement('h4');
  vizTitle.textContent = 'Live Signal';
  vizTitle.style.fontSize = '13px';
  vizTitle.style.marginBottom = '8px';
  vizSection.appendChild(vizTitle);

  // Signal meters
  const metersDiv = document.createElement('div');
  metersDiv.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 10px;
  `;

  const bassBar = createMeterBar('Bass', '#ff0000');
  const midBar = createMeterBar('Mid', '#00ff00');
  const trebleBar = createMeterBar('Treble', '#0088ff');
  const levelBar = createMeterBar('Level', '#ffff00');

  metersDiv.appendChild(bassBar.container);
  metersDiv.appendChild(midBar.container);
  metersDiv.appendChild(trebleBar.container);
  metersDiv.appendChild(levelBar.container);

  vizSection.appendChild(metersDiv);

  // Update meters from signal
  setInterval(() => {
    const signal = signalRouter.getCurrentSignal();
    bassBar.update(signal.bass);
    midBar.update(signal.mid);
    trebleBar.update(signal.treble);
    levelBar.update(signal.level);
  }, 50);

  section.appendChild(vizSection);

  // === CAMERA PREVIEW (if camera enabled) ===
  const cameraPreviewDiv = document.createElement('div');
  cameraPreviewDiv.id = 'camera-preview-container';
  cameraPreviewDiv.style.cssText = `
    margin-top: 12px;
    display: none;
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 4px;
  `;

  const cameraTitle = document.createElement('div');
  cameraTitle.textContent = 'Camera Preview:';
  cameraTitle.style.cssText = `
    font-size: 11px;
    margin-bottom: 4px;
  `;
  cameraPreviewDiv.appendChild(cameraTitle);

  const cameraCanvas = document.createElement('canvas');
  cameraCanvas.id = 'camera-preview-canvas';
  cameraCanvas.style.cssText = `
    width: 100%;
    height: auto;
    border-radius: 4px;
    image-rendering: auto;
  `;
  cameraPreviewDiv.appendChild(cameraCanvas);

  vizSection.appendChild(cameraPreviewDiv);

  // === TEXT BUFFER DISPLAY (if text enabled) ===
  const textBufferDiv = document.createElement('div');
  textBufferDiv.id = 'text-buffer-container';
  textBufferDiv.style.cssText = `
    margin-top: 12px;
    display: none;
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 4px;
  `;

  const textTitle = document.createElement('div');
  textTitle.textContent = 'Recent Text:';
  textTitle.style.cssText = `
    font-size: 11px;
    margin-bottom: 4px;
  `;
  textBufferDiv.appendChild(textTitle);

  const textDisplay = document.createElement('div');
  textDisplay.id = 'text-display';
  textDisplay.style.cssText = `
    font-family: monospace;
    font-size: 10px;
    max-height: 60px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.3);
    padding: 4px;
    border-radius: 2px;
    word-wrap: break-word;
  `;
  textBufferDiv.appendChild(textDisplay);

  const clearTextButton = document.createElement('button');
  clearTextButton.textContent = 'Clear Buffer';
  clearTextButton.style.cssText = `
    margin-top: 4px;
    padding: 4px 8px;
    font-size: 10px;
  `;
  clearTextButton.addEventListener('click', () => {
    const textSource = signalRouter.getSource('text');
    if (textSource) {
      textSource.clearBuffer();
      textDisplay.textContent = '';
    }
  });
  textBufferDiv.appendChild(clearTextButton);

  vizSection.appendChild(textBufferDiv);

  // Update text display
  setInterval(() => {
    const textSource = signalRouter.getSource('text');
    if (textSource?.enabled) {
      textDisplay.textContent = textSource.getRecentText(100);
    }
  }, 200);

  // === INFO PANEL ===
  const infoSection = document.createElement('div');
  infoSection.style.marginTop = '16px';

  const infoButton = document.createElement('button');
  infoButton.textContent = '📊 Show Signal Info';
  infoButton.style.cssText = `
    width: 100%;
    padding: 6px;
    font-size: 11px;
  `;
  infoButton.addEventListener('click', () => {
    const info = signalRouter.getInfo();
    console.log('📡 Signal Router Info:', info);
    alert('Signal router info logged to console (F12)');
  });
  infoSection.appendChild(infoButton);

  section.appendChild(infoSection);

  container.appendChild(section);
  console.log("📡 Signal HUD created");
}

/**
 * Create source control (enable/disable + weight slider)
 */
function createSourceControl(parent, sourceType, label, defaultEnabled) {
  const container = document.createElement('div');
  container.style.cssText = `
    background: rgba(255, 255, 255, 0.05);
    padding: 8px;
    margin-bottom: 8px;
    border-radius: 4px;
  `;

  // Header with enable checkbox
  const header = document.createElement('label');
  header.style.cssText = `
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    font-size: 12px;
    cursor: pointer;
  `;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = defaultEnabled;
  checkbox.style.marginRight = '6px';
  checkbox.addEventListener('change', async () => {
    const enabled = checkbox.checked;
    if (enabled) {
      const success = await signalRouter.enableSource(sourceType);
      if (!success) {
        checkbox.checked = false;
        alert(`Failed to enable ${label}. Check console for errors.`);
      } else {
        // Show previews if applicable
        if (sourceType === 'camera') {
          showCameraPreview();
        } else if (sourceType === 'text') {
          showTextBuffer();
        }
      }
    } else {
      await signalRouter.disableSource(sourceType);
      if (sourceType === 'camera') {
        hideCameraPreview();
      } else if (sourceType === 'text') {
        hideTextBuffer();
      }
    }
  });

  header.appendChild(checkbox);
  header.appendChild(document.createTextNode(label));
  container.appendChild(header);

  // Weight slider
  const sliderContainer = document.createElement('div');
  sliderContainer.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
  `;

  const sliderLabel = document.createElement('span');
  sliderLabel.textContent = 'Weight:';
  sliderLabel.style.fontSize = '10px';
  sliderLabel.style.minWidth = '45px';
  sliderContainer.appendChild(sliderLabel);

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = '100';
  slider.value = '100';
  slider.style.flex = '1';
  slider.addEventListener('input', () => {
    const weight = slider.value / 100;
    signalRouter.setSourceWeight(sourceType, weight);
    valueDisplay.textContent = weight.toFixed(2);
  });
  sliderContainer.appendChild(slider);

  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = '1.00';
  valueDisplay.style.fontSize = '10px';
  valueDisplay.style.minWidth = '30px';
  valueDisplay.style.fontFamily = 'monospace';
  sliderContainer.appendChild(valueDisplay);

  container.appendChild(sliderContainer);

  parent.appendChild(container);

  // Enable audio by default
  if (defaultEnabled && sourceType === 'audio') {
    // Audio is handled by audioRouter, just set weight
    signalRouter.setSourceWeight('audio', 1.0);
  }
}

/**
 * Create routing target control
 */
function createTargetControl(parent, targetName, label, defaultEnabled) {
  const container = document.createElement('label');
  container.style.cssText = `
    display: block;
    margin-bottom: 6px;
    font-size: 11px;
    cursor: pointer;
  `;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = defaultEnabled;
  checkbox.style.marginRight = '6px';
  checkbox.addEventListener('change', () => {
    signalRouter.setTargetEnabled(targetName, checkbox.checked);
  });

  container.appendChild(checkbox);
  container.appendChild(document.createTextNode(label));

  parent.appendChild(container);
}

/**
 * Create meter bar for signal visualization
 */
function createMeterBar(label, color) {
  const container = document.createElement('div');
  container.style.marginBottom = '6px';

  const labelDiv = document.createElement('div');
  labelDiv.textContent = label + ':';
  labelDiv.style.cssText = `
    font-size: 9px;
    margin-bottom: 2px;
    opacity: 0.8;
  `;
  container.appendChild(labelDiv);

  const barBg = document.createElement('div');
  barBg.style.cssText = `
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
  `;

  const barFill = document.createElement('div');
  barFill.style.cssText = `
    height: 100%;
    width: 0%;
    background: ${color};
    transition: width 0.05s ease-out;
  `;
  barBg.appendChild(barFill);
  container.appendChild(barBg);

  return {
    container,
    update: (value) => {
      barFill.style.width = (value * 100).toFixed(1) + '%';
    }
  };
}

/**
 * Show/hide camera preview
 */
function showCameraPreview() {
  const container = document.getElementById('camera-preview-container');
  const canvas = document.getElementById('camera-preview-canvas');
  if (!container || !canvas) return;

  container.style.display = 'block';

  const cameraSource = signalRouter.getSource('camera');
  if (!cameraSource) return;

  // Update preview from camera canvas
  const updatePreview = () => {
    if (!cameraSource.enabled) return;

    const sourceCanvas = cameraSource.getPreviewCanvas();
    if (sourceCanvas) {
      canvas.width = sourceCanvas.width;
      canvas.height = sourceCanvas.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(sourceCanvas, 0, 0);
    }

    requestAnimationFrame(updatePreview);
  };

  updatePreview();
}

function hideCameraPreview() {
  const container = document.getElementById('camera-preview-container');
  if (container) {
    container.style.display = 'none';
  }
}

/**
 * Show/hide text buffer
 */
function showTextBuffer() {
  const container = document.getElementById('text-buffer-container');
  if (container) {
    container.style.display = 'block';
  }
}

function hideTextBuffer() {
  const container = document.getElementById('text-buffer-container');
  if (container) {
    container.style.display = 'none';
  }
}

console.log("📡 Signal HUD system ready");
