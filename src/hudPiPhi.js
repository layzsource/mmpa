// MMPA π/φ Synchronicity Detector
// Real-time visualization of chaos (π) vs. harmony (φ) balance
// Based on color psychology (arousal theory), not esoteric claims

import { getPiPhiColors } from './colorPalettes.js';

let syncHistory = [];
const MAX_HISTORY = 60; // Keep last 60 frames (1 second at 60 FPS)

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

    <!-- History Graph (Simple ASCII-style) -->
    <div style="margin-top: 15px; background: rgba(0, 0, 0, 0.3); padding: 12px; border: 1px solid #333; border-radius: 4px;">
      <div style="color: #888; font-size: 10px; margin-bottom: 8px;">Synchronicity Timeline (last 60 frames):</div>
      <div id="sync-timeline" style="height: 40px; position: relative; background: #1a1a1a; border: 1px solid #333; border-radius: 2px; overflow: hidden;">
        <!-- Will be populated with bars -->
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 4px;">
        <span style="font-size: 9px; color: #666;">60 frames ago</span>
        <span style="font-size: 9px; color: #666;">Now</span>
      </div>
    </div>
  `;

  container.appendChild(panel);

  // Return update function
  return {
    update: (analysis) => {
      updatePiPhiPanel(analysis);
    }
  };
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

  // Update timeline
  updateSyncTimeline(synchronicity);
}

function updateSyncTimeline(synchronicity) {
  // Add to history
  syncHistory.push(synchronicity);
  if (syncHistory.length > MAX_HISTORY) {
    syncHistory.shift();
  }

  const timeline = document.getElementById('sync-timeline');
  if (!timeline) return;

  // Clear existing bars
  timeline.innerHTML = '';

  // Calculate bar width
  const barWidth = timeline.clientWidth / MAX_HISTORY;

  // Render bars
  syncHistory.forEach((sync, index) => {
    const bar = document.createElement('div');
    const height = sync * 100; // 0-100%

    // Color based on sync value
    let color;
    if (sync > 0.7) {
      color = '#00ff00'; // Green - high sync
    } else if (sync > 0.4) {
      color = '#ffff00'; // Yellow - medium sync
    } else if (sync > 0.2) {
      color = '#ff8800'; // Orange - low sync
    } else {
      color = '#333333'; // Gray - minimal sync
    }

    bar.style.cssText = `
      position: absolute;
      bottom: 0;
      left: ${index * barWidth}px;
      width: ${barWidth}px;
      height: ${height}%;
      background: ${color};
      opacity: 0.8;
      transition: height 0.3s ease;
    `;

    timeline.appendChild(bar);
  });
}

// Listen for color palette changes
window.addEventListener('colorPaletteChanged', () => {
  console.log('🎨 π/φ panel: Color palette changed, will update on next frame');
});

console.log("🎨 hudPiPhi.js loaded");
