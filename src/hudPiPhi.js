// MMPA π/φ Synchronicity Detector
// Real-time visualization of chaos (π) vs. harmony (φ) balance
// Based on color psychology (arousal theory), not esoteric claims

import { getPiPhiColors, getPaletteColor } from './colorPalettes.js';

// Enhanced timeline data structure
let timelineHistory = [];
const MAX_HISTORY_SECONDS = 120; // Keep 120 seconds of history
const MAX_HISTORY_FRAMES = MAX_HISTORY_SECONDS * 60; // Assume 60 FPS
let timelineStartTime = Date.now();

// Peak detection
let synchronicityPeaks = [];
const PEAK_THRESHOLD = 0.6; // Minimum sync to register as peak
const PEAK_COOLDOWN = 30; // Frames between peaks (0.5 seconds)
let framesSinceLastPeak = 0;

// Current π/φ metrics (for color system integration)
let lastPiPhiMetrics = { pi: 0, phi: 0, synchronicity: 0, balance: 0.5 };

export function createPiPhiPanel(container) {
  const panel = document.createElement('div');
  panel.className = 'hud-section';
  panel.style.cssText = 'max-width: 100%; overflow-y: auto; max-height: calc(100vh - 200px);';

  panel.innerHTML = `
    <h4 style="color: #00ffff; margin: 10px 0; font-size: 14px; font-weight: 500;">
      π/φ Synchronicity Detector
    </h4>
    <p style="color: #888; font-size: 10px; margin: 0 0 15px 0;">
      Real-time balance of cosmic chaos (π) and earthly harmony (φ)
    </p>

    <div style="display: flex; gap: 20px; margin-bottom: 20px;">

      <!-- Left Panel: Metrics -->
      <div style="flex: 1; display: flex; flex-direction: column; gap: 15px; background: rgba(0, 255, 255, 0.05); padding: 15px; border: 1px solid #6644aa; border-radius: 4px;">
        <h5 style="color: #00ffff; font-size: 12px; margin: 0 0 10px 0; border-bottom: 1px solid #333; padding-bottom: 8px;">
          π/φ Balance Sheet
        </h5>

        <!-- Pi Metric -->
        <div id="pi-metric">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="color: #ff4444; font-size: 11px; font-weight: 500;">π (Chaos)</span>
            <span id="pi-icon" style="font-size: 10px;">⚡</span>
          </div>
          <div style="height: 8px; background: #1a1a1a; border-radius: 4px; overflow: hidden; border: 1px solid #333;">
            <div id="pi-bar" style="height: 100%; background: #ff4444; width: 0%; transition: width 0.3s ease;"></div>
          </div>
          <div id="pi-value" style="text-align: right; font-size: 10px; color: #888; margin-top: 2px; font-family: monospace;">0.00%</div>
        </div>

        <!-- Phi Metric -->
        <div id="phi-metric">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="color: #00ffff; font-size: 11px; font-weight: 500;">φ (Harmony)</span>
            <span id="phi-icon" style="font-size: 10px;">◆</span>
          </div>
          <div style="height: 8px; background: #1a1a1a; border-radius: 4px; overflow: hidden; border: 1px solid #333;">
            <div id="phi-bar" style="height: 100%; background: #00ffff; width: 0%; transition: width 0.3s ease;"></div>
          </div>
          <div id="phi-value" style="text-align: right; font-size: 10px; color: #888; margin-top: 2px; font-family: monospace;">0.00%</div>
        </div>

        <!-- Balance Indicator -->
        <div style="border-top: 1px solid #333; padding-top: 10px; margin-top: 5px;">
          <div style="color: #888; font-size: 10px; margin-bottom: 4px;">Balance:</div>
          <div id="balance-text" style="color: #ffff00; font-size: 11px; font-family: monospace;">50% π / 50% φ</div>
        </div>

        <!-- Current Archetype -->
        <div style="border-top: 1px solid #333; padding-top: 10px; margin-top: 5px;">
          <div style="color: #888; font-size: 10px; margin-bottom: 4px;">Current Archetype:</div>
          <div id="archetype-name" style="color: #ffff00; font-size: 13px; font-weight: bold;">--</div>
          <div id="archetype-conf" style="color: #888; font-size: 9px; margin-top: 2px;">Confidence: --</div>
        </div>
      </div>

      <!-- Right Panel: Central Gauge -->
      <div style="flex: 2; display: flex; align-items: center; justify-content: center; position: relative; background: rgba(0, 0, 0, 0.3); border: 1px solid #6644aa; border-radius: 4px; padding: 20px;">
        <div id="sync-gauge" style="
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: rgba(128, 0, 128, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          box-shadow: 0 0 20px rgba(128, 0, 128, 0.5);
          transition: all 0.5s ease;
          border: 3px solid rgba(128, 0, 128, 0.8);
        ">
          <div style="color: white; font-size: 12px; text-align: center; padding: 10px;">
            <div id="sync-archetype" style="font-weight: bold; margin-bottom: 4px; font-size: 11px;">--</div>
            <div id="sync-percent" style="font-size: 10px; opacity: 0.8;">0% Sync</div>
          </div>
        </div>
        <div style="position: absolute; bottom: 10px; left: 0; right: 0; text-align: center; font-size: 9px; color: #888;">
          Synchronicity emerges when π and φ align
        </div>
      </div>
    </div>

    <!-- Event Log -->
    <div style="background: rgba(0, 255, 255, 0.05); padding: 12px; border: 1px solid #333; border-radius: 4px;">
      <div style="color: #888; font-size: 10px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
        <span>⚡</span>
        <span>Synchronicity Event:</span>
      </div>
      <div id="event-type" style="color: #ffff00; font-size: 11px; font-family: monospace;">Monitoring...</div>
    </div>

    <!-- Enhanced Synchronicity Timeline -->
    <div style="margin-top: 15px; background: rgba(0, 0, 0, 0.3); padding: 15px; border: 1px solid #6644aa; border-radius: 4px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div style="color: #00ffff; font-size: 12px; font-weight: 500;">⏱️ Synchronicity Timeline</div>
        <div style="display: flex; gap: 15px; font-size: 9px;">
          <div style="display: flex; align-items: center; gap: 4px;">
            <div style="width: 12px; height: 2px; background: #ff4444;"></div>
            <span style="color: #888;">π (Chaos)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 4px;">
            <div style="width: 12px; height: 2px; background: #00ffff;"></div>
            <span style="color: #888;">φ (Harmony)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 4px;">
            <div style="width: 12px; height: 8px; background: rgba(128, 0, 128, 0.3);"></div>
            <span style="color: #888;">Sync Area</span>
          </div>
        </div>
      </div>

      <!-- Canvas Timeline -->
      <div style="position: relative; background: #1a1a1a; border: 1px solid #333; border-radius: 3px; overflow: hidden;">
        <canvas id="sync-timeline-canvas" width="800" height="120" style="display: block; width: 100%; height: 120px; cursor: crosshair;"></canvas>

        <!-- Hover Tooltip -->
        <div id="timeline-tooltip" style="
          position: absolute;
          display: none;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid #6644aa;
          border-radius: 3px;
          padding: 8px;
          font-size: 10px;
          color: white;
          pointer-events: none;
          z-index: 1000;
          white-space: nowrap;
        "></div>

        <!-- Playhead -->
        <div id="timeline-playhead" style="
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(255, 255, 255, 0.6);
          pointer-events: none;
        "></div>
      </div>

      <!-- Time Scale -->
      <div style="display: flex; justify-content: space-between; margin-top: 6px;">
        <span style="font-size: 9px; color: #666;">-120s</span>
        <span style="font-size: 9px; color: #666;">-90s</span>
        <span style="font-size: 9px; color: #666;">-60s</span>
        <span style="font-size: 9px; color: #666;">-30s</span>
        <span style="font-size: 9px; color: #00ffff;">Now</span>
      </div>

      <!-- Peak Events Log -->
      <div id="peak-events-log" style="margin-top: 12px; max-height: 80px; overflow-y: auto; font-size: 9px; color: #888;">
        <div style="color: #666; font-style: italic;">Synchronicity peaks will appear here...</div>
      </div>

      <!-- Data Export -->
      <div style="margin-top: 12px; display: flex; gap: 8px; justify-content: space-between;">
        <button id="export-timeline-btn" style="
          flex: 1;
          padding: 8px;
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid #00ffff;
          border-radius: 4px;
          color: #00ffff;
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        " onmouseover="this.style.background='rgba(0, 255, 255, 0.2)'" onmouseout="this.style.background='rgba(0, 255, 255, 0.1)'">
          💾 Export Timeline
        </button>
        <button id="export-complete-btn" style="
          flex: 1;
          padding: 8px;
          background: rgba(255, 0, 255, 0.1);
          border: 1px solid #ff00ff;
          border-radius: 4px;
          color: #ff00ff;
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        " onmouseover="this.style.background='rgba(255, 0, 255, 0.2)'" onmouseout="this.style.background='rgba(255, 0, 255, 0.1)'">
          💾 Export All Data
        </button>
      </div>

      <!-- CSV Export -->
      <div style="margin-top: 8px;">
        <button id="export-csv-btn" style="
          width: 100%;
          padding: 8px;
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid #00ff00;
          border-radius: 4px;
          color: #00ff00;
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        " onmouseover="this.style.background='rgba(0, 255, 0, 0.2)'" onmouseout="this.style.background='rgba(0, 255, 0, 0.1)'">
          📊 Export CSV (Spreadsheet)
        </button>
      </div>

      <!-- PNG Snapshot Export -->
      <div style="margin-top: 8px;">
        <button id="export-png-btn" style="
          width: 100%;
          padding: 8px;
          background: rgba(255, 165, 0, 0.1);
          border: 1px solid #ffa500;
          border-radius: 4px;
          color: #ffa500;
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        " onmouseover="this.style.background='rgba(255, 165, 0, 0.2)'" onmouseout="this.style.background='rgba(255, 165, 0, 0.1)'">
          🖼️ Export Timeline Image (PNG)
        </button>
      </div>

      <!-- Data Import -->
      <div style="margin-top: 8px; display: flex; gap: 8px; justify-content: space-between;">
        <button id="import-timeline-btn" style="
          flex: 1;
          padding: 8px;
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid #00ffff;
          border-radius: 4px;
          color: #00ffff;
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        " onmouseover="this.style.background='rgba(0, 255, 255, 0.2)'" onmouseout="this.style.background='rgba(0, 255, 255, 0.1)'">
          📂 Import Timeline
        </button>
        <button id="import-complete-btn" style="
          flex: 1;
          padding: 8px;
          background: rgba(255, 0, 255, 0.1);
          border: 1px solid #ff00ff;
          border-radius: 4px;
          color: #ff00ff;
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        " onmouseover="this.style.background='rgba(255, 0, 255, 0.2)'" onmouseout="this.style.background='rgba(255, 0, 255, 0.1)'">
          📂 Import All Data
        </button>
      </div>

      <!-- Hidden file inputs -->
      <input type="file" id="timeline-file-input" accept=".json" style="display: none;">
      <input type="file" id="complete-file-input" accept=".json" style="display: none;">
    </div>
  `;

  container.appendChild(panel);

  // Wire up export buttons (use querySelector since panel might not be in DOM yet)
  const exportTimelineBtn = panel.querySelector('#export-timeline-btn');
  const exportCompleteBtn = panel.querySelector('#export-complete-btn');
  const exportCSVBtn = panel.querySelector('#export-csv-btn');
  const exportPNGBtn = panel.querySelector('#export-png-btn');
  const importTimelineBtn = panel.querySelector('#import-timeline-btn');
  const importCompleteBtn = panel.querySelector('#import-complete-btn');
  const timelineFileInput = panel.querySelector('#timeline-file-input');
  const completeFileInput = panel.querySelector('#complete-file-input');

  if (exportTimelineBtn) {
    exportTimelineBtn.addEventListener('click', () => {
      downloadTimelineJSON();
    });
  }

  if (exportCompleteBtn) {
    exportCompleteBtn.addEventListener('click', () => {
      downloadCompleteMMPAData();
    });
  }

  if (exportCSVBtn) {
    exportCSVBtn.addEventListener('click', () => {
      downloadTimelineCSV();
    });
  }

  if (exportPNGBtn) {
    exportPNGBtn.addEventListener('click', () => {
      downloadTimelinePNG();
    });
  }

  if (importTimelineBtn && timelineFileInput) {
    importTimelineBtn.addEventListener('click', () => {
      timelineFileInput.click();
    });

    timelineFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        importTimelineJSON(file);
        timelineFileInput.value = ''; // Reset for re-import
      }
    });
  }

  if (importCompleteBtn && completeFileInput) {
    importCompleteBtn.addEventListener('click', () => {
      completeFileInput.click();
    });

    completeFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        importCompleteMMPAData(file);
        completeFileInput.value = ''; // Reset for re-import
      }
    });
  }

  // Initialize canvas interaction (delayed to ensure DOM is ready)
  setTimeout(() => {
    initializeTimelineInteraction();
  }, 0);

  // Return update function
  return {
    update: (analysis) => {
      updatePiPhiPanel(analysis);
    }
  };
}

function initializeTimelineInteraction() {
  const canvas = document.getElementById('sync-timeline-canvas');
  const tooltip = document.getElementById('timeline-tooltip');

  if (!canvas || !tooltip) return;

  // Hover interaction
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate which data point we're hovering over
    const canvasWidth = canvas.width;
    const timelineLength = timelineHistory.length;

    if (timelineLength === 0) return;

    const dataIndex = Math.floor((x / rect.width) * timelineLength);

    if (dataIndex >= 0 && dataIndex < timelineLength) {
      const dataPoint = timelineHistory[dataIndex];
      const secondsAgo = Math.floor((Date.now() - dataPoint.timestamp) / 1000);

      // Show tooltip
      tooltip.style.display = 'block';
      tooltip.style.left = `${e.clientX - rect.left + 10}px`;
      tooltip.style.top = `${e.clientY - rect.top - 60}px`;

      tooltip.innerHTML = `
        <div style="color: #00ffff; font-weight: bold; margin-bottom: 4px;">${secondsAgo}s ago</div>
        <div style="color: #ff4444;">π: ${(dataPoint.pi * 100).toFixed(1)}%</div>
        <div style="color: #00ffff;">φ: ${(dataPoint.phi * 100).toFixed(1)}%</div>
        <div style="color: #ff00ff;">Sync: ${(dataPoint.synchronicity * 100).toFixed(1)}%</div>
        ${dataPoint.archetype ? `<div style="color: #ffff00; margin-top: 4px;">${dataPoint.archetype}</div>` : ''}
        ${dataPoint.confidence ? `<div style="color: #888; font-size: 9px;">Confidence: ${(dataPoint.confidence * 100).toFixed(1)}%</div>` : ''}
      `;
    }
  });

  canvas.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });

  // Click to log details
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const timelineLength = timelineHistory.length;

    if (timelineLength === 0) return;

    const dataIndex = Math.floor((x / rect.width) * timelineLength);

    if (dataIndex >= 0 && dataIndex < timelineLength) {
      const dataPoint = timelineHistory[dataIndex];
      const secondsAgo = Math.floor((Date.now() - dataPoint.timestamp) / 1000);

      console.log(`📊 Timeline Data Point (${secondsAgo}s ago):`, {
        timestamp: new Date(dataPoint.timestamp).toLocaleTimeString(),
        pi: (dataPoint.pi * 100).toFixed(2) + '%',
        phi: (dataPoint.phi * 100).toFixed(2) + '%',
        synchronicity: (dataPoint.synchronicity * 100).toFixed(2) + '%',
        archetype: dataPoint.archetype,
        confidence: (dataPoint.confidence * 100).toFixed(2) + '%'
      });
    }
  });
}

function calculatePiPhiMetrics(analysis) {
  // π component (transcendence, chaos, infinity)
  // High when: Flux is high, Stability is low, Harmonic Strength is low
  const piScore = Math.min(1, (
    (analysis.flux || 0) * 0.4 +
    (1 - (analysis.stability || 0)) * 0.3 +
    (1 - (analysis.harmonicStrength || 0)) * 0.3
  ));

  // φ component (harmony, pattern, beauty)
  // High when: Stability is high, Harmonic Strength is high, Flux is low
  const phiScore = Math.min(1, (
    (analysis.stability || 0) * 0.4 +
    (analysis.harmonicStrength || 0) * 0.3 +
    (1 - (analysis.flux || 0)) * 0.3
  ));

  // Balance: 0 = pure φ, 1 = pure π
  const balance = (piScore + phiScore) > 0 ? piScore / (piScore + phiScore) : 0.5;

  // Synchronicity: high only when BOTH pi and phi are high, AND confidence is high
  // This is the "meaningful coincidence" moment
  const synchronicity = Math.min(1, piScore * phiScore * (analysis.confidence || 0));

  return { pi: piScore, phi: phiScore, balance, synchronicity };
}

function updatePiPhiPanel(analysis) {
  const { pi, phi, balance, synchronicity } = calculatePiPhiMetrics(analysis);

  // Store metrics for color system integration
  lastPiPhiMetrics = { pi, phi, synchronicity, balance };

  // Get current palette colors
  const colors = getPiPhiColors();

  // Update π metric
  const piBar = document.getElementById('pi-bar');
  const piValue = document.getElementById('pi-value');
  if (piBar && piValue) {
    piBar.style.width = `${pi * 100}%`;
    piBar.style.background = colors.pi;
    piValue.textContent = `${(pi * 100).toFixed(2)}%`;
  }

  // Update φ metric
  const phiBar = document.getElementById('phi-bar');
  const phiValue = document.getElementById('phi-value');
  if (phiBar && phiValue) {
    phiBar.style.width = `${phi * 100}%`;
    phiBar.style.background = colors.phi;
    phiValue.textContent = `${(phi * 100).toFixed(2)}%`;
  }

  // Update balance text
  const balanceText = document.getElementById('balance-text');
  if (balanceText) {
    const piPercent = (balance * 100).toFixed(0);
    const phiPercent = ((1 - balance) * 100).toFixed(0);
    balanceText.textContent = `${piPercent}% π / ${phiPercent}% φ`;
  }

  // Update archetype
  const archetypeName = document.getElementById('archetype-name');
  const archetypeConf = document.getElementById('archetype-conf');
  if (archetypeName && archetypeConf) {
    archetypeName.textContent = analysis.archetype || '--';
    archetypeConf.textContent = `Confidence: ${((analysis.confidence || 0) * 100).toFixed(1)}%`;
  }

  // Update central gauge
  const gauge = document.getElementById('sync-gauge');
  const syncArchetype = document.getElementById('sync-archetype');
  const syncPercent = document.getElementById('sync-percent');

  if (gauge && syncArchetype && syncPercent) {
    // Dynamic sizing based on synchronicity
    const size = 150 + (synchronicity * 100);
    gauge.style.width = `${size}px`;
    gauge.style.height = `${size}px`;

    // Color interpolation: cyan (φ=0) → purple (0.5) → red (π=1)
    const r = Math.round(255 * balance);
    const b = Math.round(255 * (1 - balance));
    const color = `rgb(${r}, 0, ${b})`;

    gauge.style.background = color;
    gauge.style.boxShadow = `0 0 ${synchronicity * 40}px ${color}`;
    gauge.style.borderColor = color;
    gauge.style.opacity = 0.5 + (synchronicity * 0.5);

    syncArchetype.textContent = analysis.archetype || '--';
    syncPercent.textContent = `${(synchronicity * 100).toFixed(0)}% Sync`;
  }

  // Event type classification (empirical descriptions)
  const eventType = document.getElementById('event-type');
  if (eventType) {
    let eventText;

    if (synchronicity > 0.7 && pi > 0.7 && phi > 0.7) {
      eventText = '⚡⚡⚡ GOLDEN MOMENT: High Flux + High Stability (Chaotic Harmony)';
    } else if (synchronicity > 0.6 && phi > 0.8 && pi < 0.3) {
      eventText = '✓ Pure Harmony: Low Flux + High Stability (Consonant)';
    } else if (synchronicity > 0.5 && pi > 0.8 && phi < 0.3) {
      eventText = '~ Pure Chaos: High Flux + Low Stability (Dissonant)';
    } else if (synchronicity > 0.5) {
      eventText = `◆ Moderate Alignment (π: ${(pi*100).toFixed(0)}%, φ: ${(phi*100).toFixed(0)}%)`;
    } else if (pi > 0.7) {
      eventText = '⚡ High Chaos (unstable, evolving)';
    } else if (phi > 0.7) {
      eventText = '◆ High Harmony (stable, predictable)';
    } else {
      eventText = '- Neutral (no significant alignment)';
    }

    eventType.textContent = eventText;
  }

  // Update timeline with full data
  updateEnhancedTimeline(pi, phi, synchronicity, analysis);
}

function updateEnhancedTimeline(pi, phi, synchronicity, analysis) {
  // Add data point to history
  const dataPoint = {
    timestamp: Date.now(),
    pi: pi,
    phi: phi,
    synchronicity: synchronicity,
    archetype: analysis.archetype,
    confidence: analysis.confidence || 0
  };

  timelineHistory.push(dataPoint);

  // Trim old data (keep last MAX_HISTORY_FRAMES)
  if (timelineHistory.length > MAX_HISTORY_FRAMES) {
    timelineHistory.shift();
  }

  // Peak detection
  framesSinceLastPeak++;

  if (synchronicity > PEAK_THRESHOLD && framesSinceLastPeak > PEAK_COOLDOWN) {
    const peak = {
      timestamp: dataPoint.timestamp,
      synchronicity: synchronicity,
      archetype: analysis.archetype,
      pi: pi,
      phi: phi,
      confidence: analysis.confidence || 0
    };

    synchronicityPeaks.unshift(peak); // Add to front
    if (synchronicityPeaks.length > 10) {
      synchronicityPeaks.pop(); // Keep only last 10 peaks
    }

    framesSinceLastPeak = 0;

    // Update peak events log
    updatePeakEventsLog();
  }

  // Render canvas
  renderTimelineCanvas();
}

function renderTimelineCanvas() {
  const canvas = document.getElementById('sync-timeline-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  if (timelineHistory.length === 0) return;

  // Draw grid lines (every 30 seconds)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;

  for (let i = 0; i <= 4; i++) {
    const x = (i / 4) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Middle line (50%)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  // Draw synchronicity area (filled)
  ctx.fillStyle = 'rgba(128, 0, 128, 0.3)';
  ctx.beginPath();
  ctx.moveTo(0, height);

  for (let i = 0; i < timelineHistory.length; i++) {
    const x = (i / Math.max(MAX_HISTORY_FRAMES - 1, 1)) * width;
    const y = height - (timelineHistory[i].synchronicity * height);
    if (i === 0) {
      ctx.lineTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Get current palette colors for π/φ
  const piPhiColors = getPiPhiColors();

  // Draw π line (chaos) - use palette color
  ctx.strokeStyle = piPhiColors.pi;
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let i = 0; i < timelineHistory.length; i++) {
    const x = (i / Math.max(MAX_HISTORY_FRAMES - 1, 1)) * width;
    const y = height - (timelineHistory[i].pi * height);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();

  // Draw φ line (harmony) - use palette color
  ctx.strokeStyle = piPhiColors.phi;
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let i = 0; i < timelineHistory.length; i++) {
    const x = (i / Math.max(MAX_HISTORY_FRAMES - 1, 1)) * width;
    const y = height - (timelineHistory[i].phi * height);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();

  // Draw peak markers
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';

  synchronicityPeaks.forEach(peak => {
    // Find position in timeline
    const peakAge = Date.now() - peak.timestamp;
    const peakAgeSeconds = peakAge / 1000;

    if (peakAgeSeconds <= MAX_HISTORY_SECONDS) {
      const timelineIndex = timelineHistory.findIndex(d => d.timestamp >= peak.timestamp);

      if (timelineIndex !== -1) {
        const x = (timelineIndex / Math.max(MAX_HISTORY_FRAMES - 1, 1)) * width;
        const y = height - (peak.synchronicity * height);

        // Get archetype color from palette
        const archetypeColor = peak.archetype ? getPaletteColor(peak.archetype) : '#ffff00';

        // Draw marker line with archetype color
        ctx.strokeStyle = archetypeColor + '99'; // Add alpha
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw archetype label (if room) with archetype color
        if (peak.archetype && x > 30 && x < width - 30) {
          ctx.fillStyle = archetypeColor;
          ctx.fillText(peak.archetype, x, Math.max(y - 5, 12));
        }

        // Draw peak dot with archetype color
        ctx.fillStyle = archetypeColor;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
}

function updatePeakEventsLog() {
  const logContainer = document.getElementById('peak-events-log');
  if (!logContainer) return;

  if (synchronicityPeaks.length === 0) {
    logContainer.innerHTML = '<div style="color: #666; font-style: italic;">Synchronicity peaks will appear here...</div>';
    return;
  }

  logContainer.innerHTML = synchronicityPeaks.map(peak => {
    const secondsAgo = Math.floor((Date.now() - peak.timestamp) / 1000);
    const timeStr = secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo / 60)}m ${secondsAgo % 60}s ago`;

    // Get archetype color from palette
    const archetypeColor = peak.archetype ? getPaletteColor(peak.archetype) : '#ffff00';

    return `
      <div style="display: flex; justify-content: space-between; padding: 4px 6px; margin-bottom: 3px; background: ${archetypeColor}11; border-left: 2px solid ${archetypeColor}; border-radius: 2px;">
        <div>
          <span style="color: ${archetypeColor}; font-weight: bold;">${(peak.synchronicity * 100).toFixed(0)}%</span>
          <span style="color: #888; margin-left: 6px;">${peak.archetype || 'Unknown'}</span>
        </div>
        <div style="color: #666;">${timeStr}</div>
      </div>
    `;
  }).join('');
}

// Listen for color palette changes
window.addEventListener('colorPaletteChanged', () => {
  console.log('🎨 π/φ panel: Color palette changed, will update on next frame');
});

/**
 * Get current π/φ metrics for color system integration
 * @returns {object} { pi, phi, synchronicity, balance }
 */
export function getPiPhiMetrics() {
  return { ...lastPiPhiMetrics };
}

// ===== DATA EXPORT SYSTEM =====

/**
 * Export timeline and synchronicity data to JSON
 * @returns {object} Complete timeline data for analysis/backup
 */
export function exportTimelineData() {
  return {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    timelineStartTime: timelineStartTime,
    sessionDuration: Math.floor((Date.now() - timelineStartTime) / 1000), // seconds
    history: timelineHistory,
    peaks: synchronicityPeaks,
    currentMetrics: lastPiPhiMetrics,
    statistics: {
      totalDataPoints: timelineHistory.length,
      peakCount: synchronicityPeaks.length,
      avgPi: timelineHistory.length > 0 ?
        timelineHistory.reduce((sum, d) => sum + d.pi, 0) / timelineHistory.length : 0,
      avgPhi: timelineHistory.length > 0 ?
        timelineHistory.reduce((sum, d) => sum + d.phi, 0) / timelineHistory.length : 0,
      avgSync: timelineHistory.length > 0 ?
        timelineHistory.reduce((sum, d) => sum + d.synchronicity, 0) / timelineHistory.length : 0,
      maxSync: timelineHistory.length > 0 ?
        Math.max(...timelineHistory.map(d => d.synchronicity)) : 0
    }
  };
}

/**
 * Download timeline data as JSON file
 */
export function downloadTimelineJSON() {
  const data = exportTimelineData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mmpa-timeline-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  console.log('💾 Timeline data downloaded');
}

/**
 * Download timeline data as CSV file for spreadsheet analysis
 * Converts timelineHistory to CSV format with headers
 */
export function downloadTimelineCSV() {
  if (timelineHistory.length === 0) {
    alert('⚠️ No timeline data to export. Start the analysis first!');
    return;
  }

  // CSV Headers
  const headers = [
    'Timestamp',
    'Elapsed Time (s)',
    'Pi Score (Chaos)',
    'Phi Score (Harmony)',
    'Synchronicity',
    'Balance',
    'Archetype',
    'Confidence'
  ];

  // Convert data rows
  const rows = timelineHistory.map((point, index) => {
    const timestamp = new Date(timelineStartTime + (index * 100)).toISOString(); // 100ms intervals
    const elapsedSeconds = ((index * 100) / 1000).toFixed(2);

    return [
      timestamp,
      elapsedSeconds,
      point.pi.toFixed(4),
      point.phi.toFixed(4),
      point.synchronicity.toFixed(4),
      point.balance.toFixed(4),
      point.archetype || 'NEUTRAL_STATE',
      point.confidence ? point.confidence.toFixed(4) : '0.0000'
    ].join(',');
  });

  // Combine headers and rows
  const csv = [headers.join(','), ...rows].join('\n');

  // Create and download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mmpa-timeline-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  console.log(`📊 CSV exported: ${timelineHistory.length} data points`);
}

/**
 * Download timeline canvas as PNG image
 * Captures the current visual state of the timeline
 */
export function downloadTimelinePNG() {
  const canvas = document.getElementById('sync-timeline-canvas');

  if (!canvas) {
    alert('⚠️ Timeline canvas not found');
    return;
  }

  if (timelineHistory.length === 0) {
    alert('⚠️ No timeline data to export. Start the analysis first!');
    return;
  }

  try {
    // Convert canvas to data URL (PNG format)
    const dataURL = canvas.toDataURL('image/png');

    // Create download link
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `mmpa-timeline-${new Date().toISOString().split('T')[0]}.png`;
    a.click();

    console.log('🖼️ Timeline PNG exported');
  } catch (error) {
    console.error('❌ Failed to export PNG:', error);
    alert('❌ Failed to export timeline image: ' + error.message);
  }
}

/**
 * Download comprehensive MMPA data (palettes + timeline)
 */
export function downloadCompleteMMPAData() {
  // Import palette export function
  import('./colorPalettes.js').then(module => {
    const paletteData = module.exportAllPalettes();
    const timelineData = exportTimelineData();

    const completeData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      type: 'mmpa-complete-export',
      palettes: paletteData,
      timeline: timelineData
    };

    const json = JSON.stringify(completeData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mmpa-complete-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('💾 Complete MMPA data downloaded');
  });
}

/**
 * Import timeline data from JSON file
 */
function importTimelineJSON(file) {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      // Validate data structure
      if (!data.version || !data.history) {
        alert('❌ Invalid timeline file format');
        return;
      }

      // Restore timeline data
      timelineHistory = data.history || [];
      synchronicityPeaks = data.peaks || [];

      if (data.timelineStartTime) {
        timelineStartTime = data.timelineStartTime;
      }

      // Update current metrics
      if (data.currentMetrics) {
        lastPiPhiMetrics = data.currentMetrics;
      }

      console.log(`✅ Timeline imported: ${timelineHistory.length} data points, ${synchronicityPeaks.length} peaks`);
      alert(`✅ Timeline imported successfully!\n\n${timelineHistory.length} data points\n${synchronicityPeaks.length} synchronicity peaks`);

      // Force UI update
      updatePeakEventsLog();
      renderTimelineCanvas();

    } catch (error) {
      console.error('❌ Failed to import timeline:', error);
      alert('❌ Failed to import timeline: ' + error.message);
    }
  };

  reader.readAsText(file);
}

/**
 * Import complete MMPA data (palettes + timeline)
 */
function importCompleteMMPAData(file) {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      // Validate data structure
      if (!data.version || data.type !== 'mmpa-complete-export') {
        alert('❌ Invalid complete export file format');
        return;
      }

      let successMessages = [];

      // Import timeline data
      if (data.timeline) {
        timelineHistory = data.timeline.history || [];
        synchronicityPeaks = data.timeline.peaks || [];

        if (data.timeline.timelineStartTime) {
          timelineStartTime = data.timeline.timelineStartTime;
        }

        if (data.timeline.currentMetrics) {
          lastPiPhiMetrics = data.timeline.currentMetrics;
        }

        successMessages.push(`Timeline: ${timelineHistory.length} data points, ${synchronicityPeaks.length} peaks`);
        console.log('✅ Timeline data imported');
      }

      // Import palette data
      if (data.palettes) {
        import('./colorPalettes.js').then(module => {
          const success = module.importPalettes(data.palettes);
          if (success) {
            successMessages.push('Color palettes restored');
            console.log('✅ Palette data imported');
          }

          alert(`✅ Complete MMPA data imported!\n\n${successMessages.join('\n')}`);

          // Force UI update
          updatePeakEventsLog();
          renderTimelineCanvas();
        });
      } else {
        alert(`✅ Timeline imported!\n\n${successMessages.join('\n')}`);
        updatePeakEventsLog();
        renderTimelineCanvas();
      }

    } catch (error) {
      console.error('❌ Failed to import complete data:', error);
      alert('❌ Failed to import complete data: ' + error.message);
    }
  };

  reader.readAsText(file);
}

console.log("🎨 hudPiPhi.js loaded");
