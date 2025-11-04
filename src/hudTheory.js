console.log("👁️ hudTheory.js loaded");

/**
 * MMPA Unified Theory HUD Section
 * Controls for the Heart/Vortex/Archetype visualization
 */

import { state, GLOBAL_CONSTANTS } from './state.js';
import {
  getCurrentArchetype,
  getConfidence,
  getStabilityMetric,
  getFluxMetric
} from './archetypeRecognizer.js';

// Track theory mode state
let theoryModeEnabled = false;
let statusUpdateInterval = null;

/**
 * Create the Unified Theory HUD section
 */
export function createTheoryHudSection(container) {
  const section = document.createElement('div');
  section.className = 'hud-section mmpa-theory';
  section.style.cssText = `
    border-left: 3px solid #aa00ff;
    padding: 12px;
    margin-bottom: 16px;
    background: rgba(170, 0, 255, 0.05);
  `;

  // Header
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  `;

  const title = document.createElement('h3');
  title.textContent = '👁️ Unified Theory';
  title.style.cssText = `
    margin: 0;
    color: #aa00ff;
    font-size: 16px;
    font-weight: bold;
  `;
  header.appendChild(title);

  // Toggle button with performance indicator
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '👁️ OFF';
  toggleBtn.title = 'Toggle Theory Visuals (T key)\nHide for better performance';
  toggleBtn.style.cssText = `
    padding: 6px 16px;
    background: rgba(170, 0, 255, 0.2);
    color: #aa00ff;
    border: 1px solid #aa00ff;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    font-size: 12px;
  `;

  const toggleTheoryMode = () => {
    theoryModeEnabled = !theoryModeEnabled;
    toggleBtn.textContent = theoryModeEnabled ? '👁️ ON' : '👁️ OFF';
    toggleBtn.style.background = theoryModeEnabled ? 'rgba(170, 0, 255, 0.5)' : 'rgba(170, 0, 255, 0.2)';

    // Notify visual system
    if (window.theoryRenderer) {
      window.theoryRenderer.setEnabled(theoryModeEnabled);
    }

    // Start/stop status updates
    if (theoryModeEnabled) {
      startStatusUpdates();
    } else {
      stopStatusUpdates();
    }

    console.log(`👁️ Theory Mode: ${theoryModeEnabled ? 'ENABLED ✨' : 'DISABLED 💤'} (Press T to toggle)`);
  };

  toggleBtn.addEventListener('click', toggleTheoryMode);

  // Keyboard shortcut: T key
  window.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
      // Don't trigger if typing in an input field
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        toggleTheoryMode();
      }
    }
  });

  header.appendChild(toggleBtn);
  section.appendChild(header);

  // Status display
  const statusDiv = document.createElement('div');
  statusDiv.id = 'theory-status';
  statusDiv.style.cssText = `
    padding: 12px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    margin-bottom: 12px;
    font-family: monospace;
    font-size: 12px;
  `;
  statusDiv.innerHTML = `
    <div style="color: #888;">Theory Mode: Inactive</div>
    <div style="color: #888; margin-top: 4px;">💤 Visuals hidden for better performance</div>
    <div style="color: #666; margin-top: 4px; font-size: 11px;">Press T to toggle visibility</div>
  `;
  section.appendChild(statusDiv);

  // Controls
  const controlsDiv = document.createElement('div');
  controlsDiv.style.marginTop = '12px';

  // Scale control
  const scaleControl = createSlider('Scale', 1.0, 5.0, 2.5, 0.1, (value) => {
    if (window.theoryRenderer) {
      window.theoryRenderer.setScale(value);
    }
  });
  controlsDiv.appendChild(scaleControl);

  // Wireframe toggle
  const wireframeToggle = createCheckbox('Show Wireframe', true, (checked) => {
    if (window.theoryRenderer) {
      window.theoryRenderer.toggleWireframe();
    }
  });
  controlsDiv.appendChild(wireframeToggle);

  // Edge sensors toggle
  const edgeSensorsToggle = createCheckbox('Show Edge Sensors', false, (checked) => {
    if (window.theoryRenderer) {
      window.theoryRenderer.toggleEdgeSensors();
    }
  });
  controlsDiv.appendChild(edgeSensorsToggle);

  // Auto-rotate toggle
  const autoRotateToggle = createCheckbox('Auto Rotate', true, (checked) => {
    if (window.theoryRenderer) {
      window.theoryRenderer.setAutoRotate(checked);
    }
  });
  controlsDiv.appendChild(autoRotateToggle);

  section.appendChild(controlsDiv);

  // Data Logging Section
  const loggingDiv = document.createElement('div');
  loggingDiv.style.cssText = `
    margin-top: 12px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    border: 1px solid rgba(170, 0, 255, 0.3);
  `;

  const loggingHeader = document.createElement('div');
  loggingHeader.textContent = '📊 Training Data Collection';
  loggingHeader.style.cssText = `
    font-weight: bold;
    font-size: 11px;
    color: #aa00ff;
    margin-bottom: 8px;
  `;
  loggingDiv.appendChild(loggingHeader);

  // Logging status
  const loggingStatus = document.createElement('div');
  loggingStatus.id = 'logging-status';
  loggingStatus.style.cssText = `
    font-size: 10px;
    color: #888;
    margin-bottom: 8px;
  `;
  loggingStatus.textContent = 'Status: Inactive';
  loggingDiv.appendChild(loggingStatus);

  // Logging control buttons
  const loggingButtonsDiv = document.createElement('div');
  loggingButtonsDiv.style.cssText = `
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  `;

  // Start/Stop button
  const startStopBtn = document.createElement('button');
  startStopBtn.textContent = 'Start';
  startStopBtn.style.cssText = `
    flex: 1;
    padding: 6px;
    background: rgba(0, 200, 0, 0.2);
    color: #00ff00;
    border: 1px solid #00aa00;
    border-radius: 4px;
    cursor: pointer;
    font-size: 10px;
    font-weight: bold;
  `;
  startStopBtn.addEventListener('click', () => {
    if (!window.theoryRenderer) return;

    const status = window.theoryRenderer.getLoggerStatus();
    if (status.isLogging) {
      window.theoryRenderer.stopLogging();
      startStopBtn.textContent = 'Start';
      startStopBtn.style.background = 'rgba(0, 200, 0, 0.2)';
      startStopBtn.style.color = '#00ff00';
      startStopBtn.style.borderColor = '#00aa00';
      loggingStatus.textContent = `Status: Stopped (${status.bufferUsage} samples)`;
      loggingStatus.style.color = '#888';
    } else {
      window.theoryRenderer.startLogging();
      startStopBtn.textContent = 'Stop';
      startStopBtn.style.background = 'rgba(200, 0, 0, 0.2)';
      startStopBtn.style.color = '#ff6666';
      startStopBtn.style.borderColor = '#aa0000';
      loggingStatus.textContent = 'Status: Recording...';
      loggingStatus.style.color = '#00ff00';
    }
  });
  loggingButtonsDiv.appendChild(startStopBtn);

  // Clear button
  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear';
  clearBtn.style.cssText = `
    flex: 1;
    padding: 6px;
    background: rgba(100, 100, 100, 0.2);
    color: #aaa;
    border: 1px solid #666;
    border-radius: 4px;
    cursor: pointer;
    font-size: 10px;
    font-weight: bold;
  `;
  clearBtn.addEventListener('click', () => {
    if (!window.theoryRenderer) return;
    if (confirm('Clear all logged data?')) {
      window.theoryRenderer.clearLog();
      loggingStatus.textContent = 'Status: Cleared';
      loggingStatus.style.color = '#888';
    }
  });
  loggingButtonsDiv.appendChild(clearBtn);

  loggingDiv.appendChild(loggingButtonsDiv);

  // Export buttons
  const exportButtonsDiv = document.createElement('div');
  exportButtonsDiv.style.cssText = `
    display: flex;
    gap: 6px;
  `;

  // Export JSON button
  const exportJsonBtn = document.createElement('button');
  exportJsonBtn.textContent = 'Export JSON';
  exportJsonBtn.style.cssText = `
    flex: 1;
    padding: 6px;
    background: rgba(170, 0, 255, 0.2);
    color: #aa00ff;
    border: 1px solid #aa00ff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 10px;
    font-weight: bold;
  `;
  exportJsonBtn.addEventListener('click', () => {
    if (!window.theoryRenderer) return;
    const result = window.theoryRenderer.exportData('json');
    if (result) {
      loggingStatus.textContent = 'Exported JSON successfully';
      loggingStatus.style.color = '#00ff00';
      setTimeout(() => {
        loggingStatus.textContent = `Status: ${window.theoryRenderer.getLoggerStatus().isLogging ? 'Recording...' : 'Inactive'}`;
        loggingStatus.style.color = window.theoryRenderer.getLoggerStatus().isLogging ? '#00ff00' : '#888';
      }, 2000);
    }
  });
  exportButtonsDiv.appendChild(exportJsonBtn);

  // Export CSV button
  const exportCsvBtn = document.createElement('button');
  exportCsvBtn.textContent = 'Export CSV';
  exportCsvBtn.style.cssText = `
    flex: 1;
    padding: 6px;
    background: rgba(170, 0, 255, 0.2);
    color: #aa00ff;
    border: 1px solid #aa00ff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 10px;
    font-weight: bold;
  `;
  exportCsvBtn.addEventListener('click', () => {
    if (!window.theoryRenderer) return;
    const result = window.theoryRenderer.exportData('csv');
    if (result) {
      loggingStatus.textContent = 'Exported CSV successfully';
      loggingStatus.style.color = '#00ff00';
      setTimeout(() => {
        loggingStatus.textContent = `Status: ${window.theoryRenderer.getLoggerStatus().isLogging ? 'Recording...' : 'Inactive'}`;
        loggingStatus.style.color = window.theoryRenderer.getLoggerStatus().isLogging ? '#00ff00' : '#888';
      }, 2000);
    }
  });
  exportButtonsDiv.appendChild(exportCsvBtn);

  loggingDiv.appendChild(exportButtonsDiv);

  section.appendChild(loggingDiv);

  // Info panel
  const infoDiv = document.createElement('div');
  infoDiv.style.cssText = `
    margin-top: 12px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    font-size: 11px;
    color: #888;
  `;
  infoDiv.innerHTML = `
    <div style="font-weight: bold; color: #aa00ff; margin-bottom: 4px;">The Unified Theory</div>
    <div>💎 Heart: Chestahedron (√2 geometry)</div>
    <div>🌀 Vortex: Life polarity meter</div>
    <div>🔍 Recognizer: Archetype detection</div>
    <div style="margin-top: 8px; color: #666;">
      Perfect Fifth = Coherent ringing bell<br>
      Wolf Fifth = Chaotic cracked bell
    </div>
  `;
  section.appendChild(infoDiv);

  container.appendChild(section);
  console.log('👁️ Theory HUD section created');

  return section;
}

/**
 * Helper: Create slider control
 */
function createSlider(label, min, max, value, step, onChange) {
  const container = document.createElement('div');
  container.style.marginBottom = '8px';

  const labelEl = document.createElement('label');
  labelEl.textContent = label;
  labelEl.style.cssText = `
    display: block;
    color: #aaa;
    font-size: 11px;
    margin-bottom: 4px;
  `;
  container.appendChild(labelEl);

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.value = value;
  slider.step = step;
  slider.style.width = '100%';

  slider.addEventListener('input', (e) => {
    valueDisplay.textContent = parseFloat(e.target.value).toFixed(1);
  });

  slider.addEventListener('change', (e) => {
    onChange(parseFloat(e.target.value));
  });

  container.appendChild(slider);

  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = value.toFixed(1);
  valueDisplay.style.cssText = `
    display: block;
    text-align: right;
    color: #aa00ff;
    font-size: 10px;
    margin-top: 2px;
  `;
  container.appendChild(valueDisplay);

  return container;
}

/**
 * Helper: Create checkbox control
 */
function createCheckbox(label, checked, onChange) {
  const container = document.createElement('div');
  container.style.cssText = `
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  `;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = checked;
  checkbox.style.marginRight = '8px';
  checkbox.addEventListener('change', (e) => {
    onChange(e.target.checked);
  });
  container.appendChild(checkbox);

  const labelEl = document.createElement('label');
  labelEl.textContent = label;
  labelEl.style.cssText = `
    color: #aaa;
    font-size: 11px;
    cursor: pointer;
  `;
  labelEl.addEventListener('click', () => {
    checkbox.checked = !checkbox.checked;
    onChange(checkbox.checked);
  });
  container.appendChild(labelEl);

  return container;
}

/**
 * Start updating the status display
 */
function startStatusUpdates() {
  if (statusUpdateInterval) return;

  statusUpdateInterval = setInterval(() => {
    updateStatusDisplay();
  }, 200); // Update at 5Hz
}

/**
 * Stop status updates
 */
function stopStatusUpdates() {
  if (statusUpdateInterval) {
    clearInterval(statusUpdateInterval);
    statusUpdateInterval = null;
  }
}

/**
 * Update the status display with φ-coherence metrics
 */
function updateStatusDisplay() {
  const statusDiv = document.getElementById('theory-status');
  if (!statusDiv) return;

  try {
    const archetype = getCurrentArchetype();
    const confidence = getConfidence();
    const stability = getStabilityMetric();
    const flux = getFluxMetric();

    // Archetype display
    let archetypeDisplay = archetype;
    let archetypeColor = '#888';

    if (archetype === 'PERFECT_FIFTH') {
      archetypeDisplay = '💎 Perfect Fifth';
      archetypeColor = '#00ffaa';
    } else if (archetype === 'WOLF_FIFTH') {
      archetypeDisplay = '💥 Wolf Fifth';
      archetypeColor = '#ff3333';
    } else {
      archetypeDisplay = '🌫️ Neutral State';
      archetypeColor = '#888';
    }

    // Confidence color
    const confidencePercent = (confidence * 100).toFixed(1);
    const confidenceColor = confidence > 0.8 ? '#00ff00' : confidence > 0.5 ? '#ffaa00' : '#ff3333';

    // φ-Coherence (Stability) color - green when approaching/exceeding φ
    const PHI = GLOBAL_CONSTANTS.GOLDEN_RATIO_PHI;
    const stabilityRatio = stability / PHI;
    const stabilityColor = stability >= PHI ? '#00ff00' :
                           stability >= PHI * 0.8 ? '#ffaa00' : '#ff6666';

    // Flux color - blue for calm, yellow for active, red for chaotic
    const fluxColor = flux < 0.3 ? '#66aaff' :
                      flux < 0.7 ? '#ffaa00' : '#ff6666';

    // Create visual bar for stability (shows proximity to φ)
    const stabilityPercent = Math.min((stabilityRatio * 100), 150);
    const stabilityBar = `
      <div style="background: #222; height: 6px; border-radius: 3px; margin-top: 4px; position: relative; overflow: hidden;">
        <div style="background: ${stabilityColor}; height: 100%; width: ${stabilityPercent}%; transition: all 0.3s;"></div>
        <div style="position: absolute; left: ${(100 / 1.5).toFixed(1)}%; top: 0; width: 2px; height: 100%; background: #fff; opacity: 0.5;"></div>
      </div>
      <div style="font-size: 8px; color: #666; margin-top: 2px;">φ threshold at 66.7%</div>
    `;

    statusDiv.innerHTML = `
      <div style="color: ${archetypeColor}; font-weight: bold; font-size: 14px; margin-bottom: 8px;">
        ${archetypeDisplay}
      </div>
      <div style="color: ${confidenceColor}; font-size: 11px; margin-bottom: 6px;">
        Confidence: ${confidencePercent}%
      </div>
      <div style="border-top: 1px solid #333; padding-top: 6px; margin-top: 6px;">
        <div style="font-size: 10px; color: #999;">φ-Coherence (Stability)</div>
        <div style="color: ${stabilityColor}; font-size: 12px; font-weight: bold; margin-top: 2px;">
          ${stability.toFixed(3)} ${stability >= PHI ? '✓' : ''} <span style="color: #666; font-size: 10px;">(φ = ${PHI.toFixed(3)})</span>
        </div>
        ${stabilityBar}
      </div>
      <div style="border-top: 1px solid #333; padding-top: 6px; margin-top: 6px;">
        <div style="font-size: 10px; color: #999;">System Activity (Flux)</div>
        <div style="color: ${fluxColor}; font-size: 12px; font-weight: bold; margin-top: 2px;">
          ${flux.toFixed(3)} <span style="color: #666; font-size: 10px;">(${flux < 0.5 ? 'quiet' : flux < 0.7 ? 'active' : 'chaotic'})</span>
        </div>
      </div>
      <div style="color: #555; margin-top: 8px; font-size: 9px; font-style: italic;">
        Real-time φ-based detection
      </div>
    `;
  } catch (error) {
    // Silently handle errors during updates
    statusDiv.innerHTML = `
      <div style="color: #ff3333;">Error updating status</div>
      <div style="color: #666; font-size: 10px;">${error.message}</div>
    `;
  }
}

console.log("👁️ hudTheory.js ready");
