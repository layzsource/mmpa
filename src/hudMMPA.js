console.log("🎯 hudMMPA.js loaded");

/**
 * Phase 13.30: MMPA V2.0 Production HUD
 * Real-time display of bifurcation predictions and force attribution
 *
 * Features:
 * - Stability meter (Σ*)
 * - Transition warnings (predictive)
 * - Force attribution (which audio bands are driving changes)
 * - Bifurcation risk visualization
 * - Transient detection (drum hits, note onsets)
 * - Beat/bar grid overlay
 */

import { AudioEngine } from './audio.js';
import { analyzePitchSpectrum } from './pitchDetector.js';

// === TRANSIENT DETECTION STATE ===
const transientDetector = {
  energyHistory: [],
  historyLength: 10,
  transients: [], // { time, strength }
  maxTransients: 100,
  lastTransientTime: 0,
  minTransientGap: 50, // ms between transients
  threshold: 1.5, // Energy spike multiplier
  enabled: true
};

// === FREQUENCY TRACKING STATE ===
const freqTracker = {
  smoothedFreq: 0,
  alpha: 0.3, // Smoothing factor (0 = no smoothing, 1 = no history)
  history: [],
  historyLength: 5
};

// === BEAT/BAR GRID STATE ===
const beatGrid = {
  enabled: true,
  lastBeatTime: 0,
  beatInterval: 0, // ms between beats (calculated from BPM)
  beatPhase: 0, // Offset to align with actual beats
  beatsPerBar: 4
};

/**
 * Detect transients (sudden energy spikes) in audio
 */
function detectTransients(spectrum, rms) {
  if (!transientDetector.enabled) return;

  const now = Date.now();

  // Calculate spectral flux (change in spectrum over time)
  let flux = 0;
  if (transientDetector.lastSpectrum) {
    for (let i = 0; i < spectrum.length; i++) {
      const diff = Math.max(0, spectrum[i] - transientDetector.lastSpectrum[i]);
      flux += diff * diff;
    }
    flux = Math.sqrt(flux / spectrum.length);
  }
  transientDetector.lastSpectrum = new Uint8Array(spectrum);

  // Track RMS energy history
  const currentEnergy = rms + flux / 255;
  transientDetector.energyHistory.push(currentEnergy);
  if (transientDetector.energyHistory.length > transientDetector.historyLength) {
    transientDetector.energyHistory.shift();
  }

  // Calculate average recent energy
  const avgEnergy = transientDetector.energyHistory.reduce((a, b) => a + b, 0) /
                    transientDetector.energyHistory.length;

  // Detect spike (current energy significantly above average)
  const timeSinceLastTransient = now - transientDetector.lastTransientTime;
  if (currentEnergy > avgEnergy * transientDetector.threshold &&
      timeSinceLastTransient > transientDetector.minTransientGap) {

    const strength = currentEnergy / avgEnergy;
    transientDetector.transients.push({ time: now, strength });
    transientDetector.lastTransientTime = now;

    // Limit stored transients
    if (transientDetector.transients.length > transientDetector.maxTransients) {
      transientDetector.transients.shift();
    }

    console.log(`🎵 Transient detected: strength=${strength.toFixed(2)}x`);
  }

  // Clean up old transients (older than 5 seconds)
  const cutoffTime = now - 5000;
  transientDetector.transients = transientDetector.transients.filter(t => t.time > cutoffTime);
}

/**
 * Update beat grid timing from BPM
 */
function updateBeatGrid(bpm) {
  if (!beatGrid.enabled || !bpm || bpm <= 0) return;

  beatGrid.beatInterval = (60000 / bpm); // ms per beat
}

// Helper to create control with consistent styling
function createControl(labelText) {
  const container = document.createElement('div');
  container.style.cssText = 'margin-bottom: 12px;';

  const label = document.createElement('label');
  label.textContent = labelText;
  label.style.cssText = 'display: block; margin-bottom: 5px;';

  return { container, label };
}

function createToggleControl(labelText, defaultValue, onChange) {
  const { container, label } = createControl(labelText);

  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.checked = defaultValue;
  toggle.style.cssText = 'margin-left: 10px;';
  toggle.addEventListener('change', (e) => onChange(e.target.checked));

  container.appendChild(label);
  label.appendChild(toggle);

  return container;
}

/**
 * Creates the MMPA V2.0 HUD section
 * @param {HTMLElement} parentContainer - The parent container to append to
 * @param {Function} notifyHUDUpdate - Callback to notify HUD changes
 */
export function createMMPAHudSection(parentContainer, notifyHUDUpdate) {
  console.log("🎯 Creating MMPA V2.0 HUD section");

  // Section separator
  const separator = document.createElement('hr');
  separator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  parentContainer.appendChild(separator);

  // Section title
  const title = document.createElement('h4');
  title.textContent = '🎯 MMPA V2.0 Predictions';
  title.style.cssText = 'margin: 0 0 10px 0; color: #00ffff; font-size: 12px;';
  parentContainer.appendChild(title);

  // MMPA overlay toggle
  const mmpaToggle = createToggleControl('Show MMPA Overlay', false, (value) => {
    notifyHUDUpdate({ mmpaOverlay: value });

    // Toggle MMPA overlay visibility
    const overlay = document.getElementById('mmpa-overlay');
    if (overlay) {
      overlay.style.display = value ? 'block' : 'none';
    }

    if (value && !window.mmpaOverlayUpdateInterval) {
      startMMPAOverlayUpdates();
    } else if (!value && window.mmpaOverlayUpdateInterval) {
      clearInterval(window.mmpaOverlayUpdateInterval);
      window.mmpaOverlayUpdateInterval = null;
    }
  });
  mmpaToggle.title = 'Show/hide MMPA predictions overlay (stability, transitions, attribution)';
  parentContainer.appendChild(mmpaToggle);

  // Info about MMPA
  const infoDiv = document.createElement('div');
  infoDiv.style.cssText = 'margin-top: 10px; padding: 8px; background: rgba(0,255,255,0.1); border-radius: 5px; font-size: 11px; color: #00ffff;';
  infoDiv.innerHTML = `
    <strong>MMPA V2.0 Features:</strong><br>
    • Predictive transition warnings (know drops before they hit)<br>
    • Force attribution (which audio bands drive changes)<br>
    • Stability monitoring (visual "health" meter)<br>
    • LQR-smoothed control signals
  `;
  parentContainer.appendChild(infoDiv);

  // MMPA enable/disable toggle
  const mmpaEnableToggle = createToggleControl('Enable MMPA Processing', true, (value) => {
    AudioEngine.setMMPAEnabled(value);
    notifyHUDUpdate({ mmpaEnabled: value });
  });
  mmpaEnableToggle.title = 'Enable/disable MMPA V2.0 control system';
  parentContainer.appendChild(mmpaEnableToggle);

  // Debug console button
  const debugBtn = document.createElement('button');
  debugBtn.textContent = '📊 Log MMPA Diagnostics';
  debugBtn.style.cssText = 'padding: 6px 12px; margin-top: 8px;';
  debugBtn.addEventListener('click', () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 MMPA V2.0 Diagnostic Report');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      const diagnostics = AudioEngine.getMMPADiagnostics();
      const hudData = AudioEngine.getMMPAHUDData();
      const rawData = AudioEngine.getMMPAData();

      if (!diagnostics && !hudData && !rawData) {
        console.warn('⚠️ MMPA system not initialized or disabled');
        console.log('   Check: Is audio running? Is MMPA enabled in the HUD?');
        return;
      }

      console.log('📊 Full Diagnostics:', JSON.stringify(diagnostics, null, 2));
      console.log('\n📈 HUD Data:', JSON.stringify(hudData, null, 2));
      console.log('\n🔍 Raw MMPA Data:', JSON.stringify(rawData, null, 2));

      // Summary
      console.log('\n📋 Quick Summary:');
      if (hudData) {
        console.log(`   Stability (Σ*): ${hudData.stability?.current?.toFixed(3) || 'N/A'}`);
        console.log(`   Risk: ${((hudData.stability?.risk || 0) * 100).toFixed(1)}%`);
        console.log(`   Status: ${hudData.stability?.status || 'N/A'}`);
        console.log(`   Dominant Band: ${hudData.attribution?.dominant || 'N/A'}`);
        console.log(`   Transition Warning: ${hudData.prediction?.warning ? 'YES' : 'NO'}`);
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (err) {
      console.error('❌ Error getting MMPA diagnostics:', err);
      console.log('   This might mean AudioEngine is not available globally.');
      console.log('   Try using: window.AudioProbe.getMMPADiagnostics()');
    }
  });
  parentContainer.appendChild(debugBtn);

  // Reset button
  const resetBtn = document.createElement('button');
  resetBtn.textContent = '🔄 Reset MMPA State';
  resetBtn.style.cssText = 'padding: 6px 12px; margin-top: 8px; margin-left: 8px;';
  resetBtn.addEventListener('click', () => {
    AudioEngine.resetMMPA();
    console.log('🎯 MMPA state reset');
  });
  parentContainer.appendChild(resetBtn);

  // === BIFURCATION THRESHOLD TUNING ===
  const thresholdSection = document.createElement('div');
  thresholdSection.style.cssText = 'margin-top: 15px; padding: 10px; background: rgba(255,100,0,0.1); border-radius: 5px;';

  const thresholdTitle = document.createElement('h5');
  thresholdTitle.textContent = '🎚️ Bifurcation Thresholds';
  thresholdTitle.style.cssText = 'margin: 0 0 8px 0; color: #ff6400; font-size: 11px;';
  thresholdSection.appendChild(thresholdTitle);

  const thresholdInfo = document.createElement('div');
  thresholdInfo.style.cssText = 'font-size: 10px; color: #999; margin-bottom: 8px;';
  thresholdInfo.textContent = 'Adjust when visual transitions occur based on Σ* (stability):';
  thresholdSection.appendChild(thresholdInfo);

  // Stable threshold
  const stableControl = createSliderControl('Stable Σ* >', 0.80, 0, 1, 0.01, (value) => {
    if (window.mmpaVisualBridge) {
      window.mmpaVisualBridge.setThresholds({ stable: value });
    }
  });
  thresholdSection.appendChild(stableControl);

  // Unstable threshold
  const unstableControl = createSliderControl('Unstable Σ* <', 0.60, 0, 1, 0.01, (value) => {
    if (window.mmpaVisualBridge) {
      window.mmpaVisualBridge.setThresholds({ unstable: value });
    }
  });
  thresholdSection.appendChild(unstableControl);

  // Chaotic threshold
  const chaoticControl = createSliderControl('Chaotic Σ* <', 0.40, 0, 1, 0.01, (value) => {
    if (window.mmpaVisualBridge) {
      window.mmpaVisualBridge.setThresholds({ chaotic: value });
    }
  });
  thresholdSection.appendChild(chaoticControl);

  // Bifurcation threshold
  const bifurcationControl = createSliderControl('Bifurcation Σ* <', 0.30, 0, 1, 0.01, (value) => {
    if (window.mmpaVisualBridge) {
      window.mmpaVisualBridge.setThresholds({ bifurcation: value });
    }
  });
  thresholdSection.appendChild(bifurcationControl);

  parentContainer.appendChild(thresholdSection);

  console.log("✅ MMPA HUD section created");
}

// Helper to create slider control
function createSliderControl(labelText, defaultValue, min, max, step, onChange) {
  const container = document.createElement('div');
  container.style.cssText = 'margin-bottom: 8px;';

  const label = document.createElement('label');
  label.style.cssText = 'display: flex; justify-content: space-between; align-items: center; font-size: 10px; margin-bottom: 3px;';

  const labelSpan = document.createElement('span');
  labelSpan.textContent = labelText;

  const valueSpan = document.createElement('span');
  valueSpan.style.cssText = 'color: #00ff00; font-weight: bold;';
  valueSpan.textContent = defaultValue.toFixed(2);

  label.appendChild(labelSpan);
  label.appendChild(valueSpan);

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = defaultValue;
  slider.style.cssText = 'width: 100%;';
  slider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    valueSpan.textContent = value.toFixed(2);
    onChange(value);
  });

  container.appendChild(label);
  container.appendChild(slider);

  return container;
}

/**
 * Create the MMPA overlay element (called once on page load)
 */
export function createMMPAOverlay() {
  // Check if overlay already exists
  if (document.getElementById('mmpa-overlay')) {
    console.log("🎯 MMPA overlay already exists");
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'mmpa-overlay';
  overlay.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.85);
    color: #00ffff;
    padding: 15px;
    border-radius: 10px;
    border: 2px solid #00ffff;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    z-index: 10000;
    min-width: 300px;
    max-width: 350px;
    display: none;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    transition: all 0.3s ease;
  `;

  overlay.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <div style="font-weight: bold; font-size: 14px;">
        🎯 MMPA V2.0 Control System
      </div>
      <button id="mmpa-collapse-btn" style="
        background: transparent;
        border: 1px solid #00ffff;
        color: #00ffff;
        cursor: pointer;
        padding: 2px 8px;
        border-radius: 5px;
        font-size: 16px;
        line-height: 1;
        font-weight: bold;
      " title="Collapse/Expand">−</button>
    </div>

    <div id="mmpa-content">

    <div id="mmpa-waveform-section" style="margin-bottom: 12px;">
      <div style="font-weight: bold; color: #00ff00; margin-bottom: 5px;">Live Waveform (Peak/RMS):</div>
      <canvas id="mmpa-waveform-canvas" width="320" height="60" style="
        width: 100%;
        height: 60px;
        background: #000;
        border: 1px solid #00ff00;
        border-radius: 5px;
      "></canvas>
    </div>

    <div id="mmpa-spectrum-section" style="margin-bottom: 12px;">
      <div style="font-weight: bold; color: #ff00ff; margin-bottom: 5px;">Spectrum (Frequency Bands):</div>
      <canvas id="mmpa-spectrum-canvas" width="320" height="80" style="
        width: 100%;
        height: 80px;
        background: #000;
        border: 1px solid #ff00ff;
        border-radius: 5px;
      "></canvas>
      <div style="font-size: 9px; color: #666; margin-top: 3px; display: flex; justify-content: space-between;">
        <span style="color: #8b00ff;">Sub</span>
        <span style="color: #ff0000;">Bass</span>
        <span style="color: #ff8800;">Low</span>
        <span style="color: #ffff00;">Mid</span>
        <span style="color: #00ff00;">High</span>
        <span style="color: #00ffff;">Pres</span>
      </div>
    </div>

    <div id="mmpa-audio-metrics-section" style="margin-bottom: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
      <div>
        <div style="font-size: 10px; color: #888;">BPM:</div>
        <div id="mmpa-bpm-value" style="font-weight: bold; color: #ff00ff;">-- bpm</div>
        <div style="margin-top: 4px; display: flex; gap: 4px;">
          <button id="mmpa-tap-btn" style="
            background: #222;
            border: 1px solid #888;
            color: #888;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 9px;
            flex: 1;
            transition: all 0.2s;
          " title="Tap to set BPM">TAP</button>
          <button id="mmpa-tap-reset-btn" style="
            background: #222;
            border: 1px solid #666;
            color: #666;
            cursor: pointer;
            padding: 4px 6px;
            border-radius: 4px;
            font-size: 9px;
            transition: all 0.2s;
          " title="Reset tap tempo">×</button>
        </div>
        <div id="mmpa-tap-status" style="font-size: 8px; color: #666; margin-top: 2px; text-align: center;">-</div>
      </div>
      <div>
        <div style="font-size: 10px; color: #888;">Key:</div>
        <div id="mmpa-key-value" style="font-weight: bold; color: #ff69b4;">--</div>
      </div>
      <div>
        <div style="font-size: 10px; color: #888;">Amplitude:</div>
        <div id="mmpa-amplitude-value" style="font-weight: bold; color: #ffff00;">--</div>
      </div>
      <div>
        <div style="font-size: 10px; color: #888;">Peak Freq:</div>
        <div id="mmpa-frequency-value" style="font-weight: bold; color: #00ffff;">-- Hz</div>
      </div>
      <div>
        <div style="font-size: 10px; color: #888;">Confidence:</div>
        <div id="mmpa-beat-confidence" style="font-weight: bold; color: #ff9900;">--%</div>
      </div>
      <div>
        <div style="font-size: 10px; color: #888;">Key Strength:</div>
        <div id="mmpa-key-confidence" style="font-weight: bold; color: #9370db;">--%</div>
      </div>
    </div>

    <div id="mmpa-stability-section" style="margin-bottom: 12px;">
      <div style="font-weight: bold; color: #ffff00;">Σ* (Stability):</div>
      <div style="display: flex; align-items: center; margin-top: 5px;">
        <div id="mmpa-stability-bar-bg" style="flex: 1; height: 20px; background: #333; border-radius: 5px; position: relative; overflow: hidden;">
          <div id="mmpa-stability-bar" style="height: 100%; background: linear-gradient(90deg, #00ff00, #ffff00, #ff0000); width: 0%; transition: width 0.3s;"></div>
        </div>
        <div id="mmpa-stability-value" style="margin-left: 10px; font-weight: bold;">Σ* = --</div>
      </div>
      <div id="mmpa-status" style="margin-top: 5px; font-size: 11px; color: #ff9900;">Status: Initializing...</div>
    </div>

    <div id="mmpa-transition-section" style="margin-bottom: 12px; padding: 8px; background: rgba(100, 100, 100, 0.2); border-radius: 5px; transition: background 0.5s ease, border 0.5s ease; border: 1px solid rgba(100, 100, 100, 0.3);">
      <div id="mmpa-transition-title" style="font-weight: bold; color: #888; transition: color 0.5s ease;">UKF Transition Prediction</div>
      <div id="mmpa-transition-eta" style="margin-top: 5px; font-size: 11px; color: #999;">ETA: --</div>
      <div id="mmpa-transition-confidence" style="font-size: 11px; color: #999;">Confidence: --</div>
    </div>

    <div id="mmpa-risk-section" style="margin-bottom: 12px;">
      <div style="font-weight: bold; color: #00ffff;">Bifurcation Risk:</div>
      <div id="mmpa-risk-value" style="margin-top: 5px; font-size: 14px; color: #00ffff;">--% risk</div>
    </div>

    <div id="mmpa-attribution-section">
      <div style="font-weight: bold; color: #9900ff;">Force Attribution (FIM):</div>
      <div id="mmpa-dominant-band" style="margin-top: 5px; font-size: 11px; color: #ffff00;">Dominant: --</div>
      <div id="mmpa-attribution-list" style="margin-top: 5px; font-size: 10px;">
        <div>--: --%</div>
        <div>--: --%</div>
        <div>--: --%</div>
      </div>
    </div>

    <div style="margin-top: 10px; font-size: 10px; opacity: 0.7; text-align: center;">
      UKF Predictions | LQR Control | FIM Attribution | 60fps
    </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Add collapse/expand functionality
  const collapseBtn = document.getElementById('mmpa-collapse-btn');
  const content = document.getElementById('mmpa-content');
  let isCollapsed = false;

  if (collapseBtn && content) {
    collapseBtn.addEventListener('click', () => {
      isCollapsed = !isCollapsed;
      if (isCollapsed) {
        content.style.display = 'none';
        collapseBtn.textContent = '+';
        overlay.style.minWidth = 'auto';
      } else {
        content.style.display = 'block';
        collapseBtn.textContent = '−';
        overlay.style.minWidth = '300px';
      }
    });
  }

  // Add tap tempo button handlers
  const tapBtn = document.getElementById('mmpa-tap-btn');
  const tapResetBtn = document.getElementById('mmpa-tap-reset-btn');

  if (tapBtn) {
    tapBtn.addEventListener('click', () => {
      console.log('🎹 Tap button clicked!');
      // Call tap() on AudioEngine (which forwards to dropPredictor)
      if (AudioEngine && typeof AudioEngine.tap === 'function') {
        console.log('🎹 Calling AudioEngine.tap()...');
        AudioEngine.tap();
        // Visual feedback - flash the button
        tapBtn.style.background = '#00ff00';
        tapBtn.style.borderColor = '#00ff00';
        tapBtn.style.color = '#000';
        setTimeout(() => {
          tapBtn.style.background = '#222';
          tapBtn.style.borderColor = '#888';
          tapBtn.style.color = '#888';
        }, 100);
      } else {
        console.error('❌ AudioEngine.tap() not available!', {
          AudioEngine: !!AudioEngine,
          tap: typeof AudioEngine?.tap
        });
      }
    });
  } else {
    console.error('❌ Tap button not found in DOM');
  }

  if (tapResetBtn) {
    tapResetBtn.addEventListener('click', () => {
      console.log('🎹 Reset button clicked!');
      // Reset tap tempo
      if (AudioEngine && typeof AudioEngine.resetTapTempo === 'function') {
        console.log('🎹 Resetting tap tempo...');
        AudioEngine.resetTapTempo();
        // Visual feedback
        tapResetBtn.style.background = '#ff0000';
        tapResetBtn.style.borderColor = '#ff0000';
        tapResetBtn.style.color = '#fff';
        setTimeout(() => {
          tapResetBtn.style.background = '#222';
          tapResetBtn.style.borderColor = '#666';
          tapResetBtn.style.color = '#666';
        }, 100);
      } else {
        console.error('❌ AudioEngine.resetTapTempo() not available!', {
          AudioEngine: !!AudioEngine,
          resetTapTempo: typeof AudioEngine?.resetTapTempo
        });
      }
    });
  } else {
    console.error('❌ Reset button not found in DOM');
  }

  console.log("✅ MMPA overlay created");
}

/**
 * Start updating the MMPA overlay at 60fps
 * Shows MMPA V2.0 predictions (UKF, LQR, FIM)
 */
function startMMPAOverlayUpdates() {
  let frameCount = 0;

  // Get canvases and contexts
  const waveCanvas = document.getElementById('mmpa-waveform-canvas');
  const waveCtx = waveCanvas ? waveCanvas.getContext('2d') : null;
  const specCanvas = document.getElementById('mmpa-spectrum-canvas');
  const specCtx = specCanvas ? specCanvas.getContext('2d') : null;

  window.mmpaOverlayUpdateInterval = setInterval(() => {
    // Use ACTUAL MMPA V2.0 predictions (UKF-based)
    const hudData = AudioEngine.getMMPAHUDData();
    if (!hudData) return;

    frameCount++;

    // === PROFESSIONAL WAVEFORM: Peak/RMS Envelope (Ableton-style) ===
    if (waveCtx && AudioEngine.getAnalyser()) {
      const analyser = AudioEngine.getAnalyser();
      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      // Clear canvas
      waveCtx.fillStyle = '#000';
      waveCtx.fillRect(0, 0, waveCanvas.width, waveCanvas.height);

      // Compute Peak/RMS envelopes
      const numBars = 160; // Number of vertical slices
      const samplesPerBar = Math.floor(bufferLength / numBars);
      const centerY = waveCanvas.height / 2;
      const maxAmplitude = waveCanvas.height / 2;

      // Draw RMS fill (darker, inner)
      waveCtx.fillStyle = 'rgba(0, 255, 0, 0.3)';
      waveCtx.beginPath();
      waveCtx.moveTo(0, centerY);

      for (let i = 0; i < numBars; i++) {
        const start = i * samplesPerBar;
        const end = start + samplesPerBar;

        // Compute RMS for this window
        let sumSquares = 0;
        for (let j = start; j < end && j < bufferLength; j++) {
          const normalized = (dataArray[j] - 128) / 128;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / samplesPerBar);
        const rmsHeight = rms * maxAmplitude;

        const x = (i / numBars) * waveCanvas.width;
        waveCtx.lineTo(x, centerY - rmsHeight);
      }

      // Complete the fill shape
      for (let i = numBars - 1; i >= 0; i--) {
        const start = i * samplesPerBar;
        const end = start + samplesPerBar;

        let sumSquares = 0;
        for (let j = start; j < end && j < bufferLength; j++) {
          const normalized = (dataArray[j] - 128) / 128;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / samplesPerBar);
        const rmsHeight = rms * maxAmplitude;

        const x = (i / numBars) * waveCanvas.width;
        waveCtx.lineTo(x, centerY + rmsHeight);
      }
      waveCtx.closePath();
      waveCtx.fill();

      // Draw Peak envelope (brighter, outer)
      waveCtx.strokeStyle = '#00ff00';
      waveCtx.lineWidth = 1.5;
      waveCtx.beginPath();

      for (let i = 0; i < numBars; i++) {
        const start = i * samplesPerBar;
        const end = start + samplesPerBar;

        // Find peak in this window
        let peak = 0;
        for (let j = start; j < end && j < bufferLength; j++) {
          const normalized = Math.abs((dataArray[j] - 128) / 128);
          if (normalized > peak) peak = normalized;
        }

        const peakHeight = peak * maxAmplitude;
        const x = (i / numBars) * waveCanvas.width;

        if (i === 0) {
          waveCtx.moveTo(x, centerY - peakHeight);
        } else {
          waveCtx.lineTo(x, centerY - peakHeight);
        }
      }
      waveCtx.stroke();

      // Draw lower peak envelope
      waveCtx.beginPath();
      for (let i = 0; i < numBars; i++) {
        const start = i * samplesPerBar;
        const end = start + samplesPerBar;

        let peak = 0;
        for (let j = start; j < end && j < bufferLength; j++) {
          const normalized = Math.abs((dataArray[j] - 128) / 128);
          if (normalized > peak) peak = normalized;
        }

        const peakHeight = peak * maxAmplitude;
        const x = (i / numBars) * waveCanvas.width;

        if (i === 0) {
          waveCtx.moveTo(x, centerY + peakHeight);
        } else {
          waveCtx.lineTo(x, centerY + peakHeight);
        }
      }
      waveCtx.stroke();

      // Center line
      waveCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      waveCtx.lineWidth = 1;
      waveCtx.beginPath();
      waveCtx.moveTo(0, centerY);
      waveCtx.lineTo(waveCanvas.width, centerY);
      waveCtx.stroke();

      // === BEAT/BAR GRID OVERLAY ===
      if (beatGrid.enabled && beatGrid.beatInterval > 0) {
        const now = Date.now();
        const timeSinceStart = now % (beatGrid.beatInterval * beatGrid.beatsPerBar);

        // Draw vertical lines for beats
        for (let beat = 0; beat < beatGrid.beatsPerBar; beat++) {
          const beatTime = beat * beatGrid.beatInterval - timeSinceStart;
          const xPos = (beatTime / (beatGrid.beatInterval * beatGrid.beatsPerBar)) * waveCanvas.width;

          if (xPos >= 0 && xPos <= waveCanvas.width) {
            // Bar line (every 4 beats) - brighter
            if (beat === 0) {
              waveCtx.strokeStyle = 'rgba(255, 255, 0, 0.4)';
              waveCtx.lineWidth = 2;
            } else {
              // Beat line - dimmer
              waveCtx.strokeStyle = 'rgba(255, 255, 0, 0.15)';
              waveCtx.lineWidth = 1;
            }

            waveCtx.beginPath();
            waveCtx.moveTo(xPos, 0);
            waveCtx.lineTo(xPos, waveCanvas.height);
            waveCtx.stroke();
          }
        }
      }

      // === TRANSIENT MARKERS ===
      if (transientDetector.enabled && transientDetector.transients.length > 0) {
        const now = Date.now();
        const displayWindow = 2000; // Show transients from last 2 seconds

        transientDetector.transients.forEach(transient => {
          const age = now - transient.time;
          if (age < displayWindow) {
            // Position based on age (most recent = right edge)
            const xPos = waveCanvas.width - (age / displayWindow) * waveCanvas.width;

            // Fade out based on age
            const alpha = 1 - (age / displayWindow);

            // Color based on strength (green to red)
            const strength = Math.min(1, (transient.strength - 1) / 2); // Normalize 1-3 → 0-1
            const r = Math.floor(255 * strength);
            const g = Math.floor(255 * (1 - strength));

            // Draw marker line
            waveCtx.strokeStyle = `rgba(${r}, ${g}, 0, ${alpha * 0.6})`;
            waveCtx.lineWidth = 2;
            waveCtx.beginPath();
            waveCtx.moveTo(xPos, 0);
            waveCtx.lineTo(xPos, waveCanvas.height);
            waveCtx.stroke();

            // Draw strength indicator
            waveCtx.fillStyle = `rgba(${r}, ${g}, 0, ${alpha})`;
            waveCtx.fillRect(xPos - 1, 2, 2, 6 * strength);
          }
        });
      }
    }

    // === SPECTRUM ANALYZER: Color-coded frequency bands ===
    if (specCtx && AudioEngine.getAnalyser()) {
      const analyser = AudioEngine.getAnalyser();
      const spectrum = AudioEngine.getSpectrum();
      const sampleRate = analyser.context.sampleRate;

      // Clear canvas
      specCtx.fillStyle = '#000';
      specCtx.fillRect(0, 0, specCanvas.width, specCanvas.height);

      // Define frequency bands (Hz) - like brainwaves but for audio
      const bands = [
        { name: 'Sub', min: 20, max: 60, color: '#8b00ff' },      // Purple
        { name: 'Bass', min: 60, max: 250, color: '#ff0000' },    // Red
        { name: 'Low', min: 250, max: 500, color: '#ff8800' },    // Orange
        { name: 'Mid', min: 500, max: 2000, color: '#ffff00' },   // Yellow
        { name: 'High', min: 2000, max: 6000, color: '#00ff00' }, // Green
        { name: 'Pres', min: 6000, max: 20000, color: '#00ffff' } // Cyan
      ];

      const nyquist = sampleRate / 2;
      const binsPerHz = spectrum.length / nyquist;

      // Draw each frequency band
      bands.forEach((band, bandIdx) => {
        const startBin = Math.floor(band.min * binsPerHz);
        const endBin = Math.floor(band.max * binsPerHz);

        // Compute average energy in this band
        let sum = 0;
        let count = 0;
        for (let i = startBin; i < endBin && i < spectrum.length; i++) {
          sum += spectrum[i];
          count++;
        }
        const avgEnergy = count > 0 ? sum / count : 0;
        const normalized = avgEnergy / 255;

        // Calculate bar position and size
        const barWidth = specCanvas.width / bands.length;
        const x = bandIdx * barWidth;
        const barHeight = normalized * specCanvas.height;
        const y = specCanvas.height - barHeight;

        // Draw bar with gradient
        const gradient = specCtx.createLinearGradient(x, specCanvas.height, x, y);
        gradient.addColorStop(0, band.color + '88'); // Semi-transparent at bottom
        gradient.addColorStop(1, band.color);        // Solid at top

        specCtx.fillStyle = gradient;
        specCtx.fillRect(x + 2, y, barWidth - 4, barHeight);

        // Add peak indicator
        if (normalized > 0.7) {
          specCtx.fillStyle = '#ffffff';
          specCtx.fillRect(x + 2, y, barWidth - 4, 2);
        }
      });
    }

    // === TRANSIENT DETECTION & BEAT GRID UPDATES ===
    if (AudioEngine.getAnalyser()) {
      const spectrum = AudioEngine.getSpectrum();
      const rms = AudioEngine.getRMS();

      // Detect transients (for visual markers)
      detectTransients(spectrum, rms);
    }

    // Update audio metrics (BPM, amplitude, frequency)
    const audioAnalysisData = AudioEngine.getAudioAnalysisData();
    if (audioAnalysisData) {
      // BPM
      const bpmValue = document.getElementById('mmpa-bpm-value');
      if (bpmValue) {
        bpmValue.textContent = `${audioAnalysisData.bpm?.toFixed(1) || '--'} bpm`;
      }

      // Tap tempo status
      const tapStatusEl = document.getElementById('mmpa-tap-status');
      const tapBtnEl = document.getElementById('mmpa-tap-btn');

      if (audioAnalysisData.tapActive) {
        // Active tap tempo
        const taps = audioAnalysisData.tapTimes?.length || 0;
        const confidence = (audioAnalysisData.tapConfidence * 100).toFixed(0);

        if (tapStatusEl) {
          tapStatusEl.textContent = `${taps} taps • ${confidence}%`;
          tapStatusEl.style.color = '#00ff00';
        }
        if (tapBtnEl) {
          tapBtnEl.style.borderColor = '#00ff00';
          tapBtnEl.style.color = '#00ff00';
        }
      } else {
        // Inactive
        if (tapStatusEl) {
          tapStatusEl.textContent = '-';
          tapStatusEl.style.color = '#666';
        }
        if (tapBtnEl) {
          tapBtnEl.style.borderColor = '#888';
          tapBtnEl.style.color = '#888';
        }
      }

      // Update beat grid from BPM
      if (audioAnalysisData.bpm) {
        updateBeatGrid(audioAnalysisData.bpm);
      }

      // Beat confidence
      const beatConfidence = document.getElementById('mmpa-beat-confidence');
      if (beatConfidence) {
        const conf = audioAnalysisData.beatConfidence || 0;
        beatConfidence.textContent = `${(conf * 100).toFixed(0)}%`;
      }
    }

    // Amplitude (RMS from AudioEngine)
    const amplitudeValue = document.getElementById('mmpa-amplitude-value');
    if (amplitudeValue) {
      const rms = AudioEngine.getRMS();
      amplitudeValue.textContent = (rms * 100).toFixed(1) + '%';
    }

    // Peak frequency (from spectrum)
    const frequencyValue = document.getElementById('mmpa-frequency-value');
    if (frequencyValue && AudioEngine.getAnalyser()) {
      const analyser = AudioEngine.getAnalyser();
      const spectrum = AudioEngine.getSpectrum();

      // Find peak frequency
      let maxVal = 0;
      let maxIdx = 0;
      for (let i = 0; i < spectrum.length; i++) {
        if (spectrum[i] > maxVal) {
          maxVal = spectrum[i];
          maxIdx = i;
        }
      }

      // Parabolic interpolation for sub-bin accuracy
      let interpolatedIdx = maxIdx;
      if (maxIdx > 0 && maxIdx < spectrum.length - 1 && maxVal > 10) {
        const alpha = spectrum[maxIdx - 1];
        const beta = spectrum[maxIdx];
        const gamma = spectrum[maxIdx + 1];

        // Parabolic peak interpolation
        const denom = (alpha - 2 * beta + gamma);
        if (Math.abs(denom) > 0.001) {
          const p = 0.5 * (alpha - gamma) / denom;
          interpolatedIdx = maxIdx + p;
        }
      }

      // Convert bin index to frequency using actual FFT size
      const fftSize = analyser.fftSize;
      const sampleRate = analyser.context.sampleRate;
      const rawFreq = (interpolatedIdx * sampleRate) / fftSize;

      // Add to history for median filtering
      if (rawFreq > 20 && rawFreq < 20000) {
        freqTracker.history.push(rawFreq);
        if (freqTracker.history.length > freqTracker.historyLength) {
          freqTracker.history.shift();
        }

        // Median filter to remove outliers
        const sortedHistory = [...freqTracker.history].sort((a, b) => a - b);
        const medianFreq = sortedHistory[Math.floor(sortedHistory.length / 2)];

        // Exponential smoothing
        if (freqTracker.smoothedFreq === 0) {
          freqTracker.smoothedFreq = medianFreq;
        } else {
          freqTracker.smoothedFreq = freqTracker.alpha * medianFreq + (1 - freqTracker.alpha) * freqTracker.smoothedFreq;
        }

        frequencyValue.textContent = `${freqTracker.smoothedFreq.toFixed(1)} Hz`;
      } else {
        frequencyValue.textContent = '-- Hz';
      }
    }

    // === KEY DETECTION (Chromagram-based) ===
    const keyValue = document.getElementById('mmpa-key-value');
    const keyConfidence = document.getElementById('mmpa-key-confidence');
    if (keyValue && keyConfidence && AudioEngine.getAnalyser()) {
      const analyser = AudioEngine.getAnalyser();
      const spectrum = AudioEngine.getSpectrum();
      const sampleRate = analyser.context.sampleRate;
      const nyquist = sampleRate / 2;

      // Use pitchDetector module for chromatic analysis
      const pitchAnalysis = analyzePitchSpectrum(spectrum, sampleRate, nyquist);

      // Extract results for display
      const detectedKey = pitchAnalysis.detectedKey;
      const strengthPercent = pitchAnalysis.strengthPercent;
      const totalEnergy = pitchAnalysis.totalEnergy;

      // Update display
      keyValue.textContent = totalEnergy > 0.5 ? detectedKey : '--';
      keyConfidence.textContent = totalEnergy > 0.5 ? `${strengthPercent.toFixed(0)}%` : '--%';
    }

    // Update Σ* (Stability) bar - ACTUAL MMPA DATA
    const stabilityBar = document.getElementById('mmpa-stability-bar');
    const stabilityValue = document.getElementById('mmpa-stability-value');
    const statusDiv = document.getElementById('mmpa-status');

    if (stabilityBar && stabilityValue && statusDiv && hudData.stability) {
      // Show Σ* (Sigma Star) stability value
      const sigmaStar = hudData.stability.current || 0;
      const risk = hudData.stability.risk || 0;
      stabilityValue.textContent = `Σ* = ${sigmaStar.toFixed(3)}`;

      // Bar shows bifurcation risk (inverse of stability)
      stabilityBar.style.width = `${(risk * 100).toFixed(1)}%`;

      // Status shows stability state
      const status = hudData.stability.status || 'unknown';
      if (status === 'stable') {
        statusDiv.style.color = '#00ff00';
        statusDiv.textContent = `STABLE (risk: ${(risk * 100).toFixed(0)}%)`;
      } else if (status === 'unstable') {
        statusDiv.style.color = '#ffff00';
        statusDiv.textContent = `UNSTABLE (risk: ${(risk * 100).toFixed(0)}%)`;
      } else {
        statusDiv.style.color = '#ff0000';
        statusDiv.textContent = `CHAOTIC (risk: ${(risk * 100).toFixed(0)}%)`;
      }
    }

    // Update transition warning - ACTUAL UKF PREDICTIONS
    const transitionSection = document.getElementById('mmpa-transition-section');
    const transitionTitle = document.getElementById('mmpa-transition-title');
    const transitionEta = document.getElementById('mmpa-transition-eta');
    const transitionConfidence = document.getElementById('mmpa-transition-confidence');

    if (transitionSection && hudData.prediction?.warning) {
      // Warning active - change to red colors
      transitionSection.style.background = 'rgba(255, 0, 0, 0.3)';
      transitionSection.style.borderColor = 'rgba(255, 0, 0, 0.6)';
      if (transitionTitle) {
        transitionTitle.textContent = '⚠️ TRANSITION WARNING (UKF)';
        transitionTitle.style.color = '#ff0000';
      }
      if (transitionEta) {
        if (hudData.prediction.eta !== null) {
          transitionEta.textContent = `ETA: ${hudData.prediction.eta.toFixed(2)}s`;
        } else {
          transitionEta.textContent = 'TRANSITION NOW!';
        }
        transitionEta.style.color = '#ffcccc';
      }
      if (transitionConfidence) {
        transitionConfidence.textContent = `Confidence: ${(hudData.prediction.confidence * 100).toFixed(0)}%`;
        transitionConfidence.style.color = '#ffcccc';
      }
    } else if (transitionSection) {
      // No warning - neutral gray colors
      transitionSection.style.background = 'rgba(100, 100, 100, 0.2)';
      transitionSection.style.borderColor = 'rgba(100, 100, 100, 0.3)';
      if (transitionTitle) {
        transitionTitle.textContent = 'UKF Transition Prediction';
        transitionTitle.style.color = '#888';
      }
      if (transitionEta) {
        transitionEta.textContent = 'ETA: --';
        transitionEta.style.color = '#999';
      }
      if (transitionConfidence) {
        transitionConfidence.textContent = 'Confidence: --';
        transitionConfidence.style.color = '#999';
      }
    }

    // Update bifurcation risk display
    const riskValue = document.getElementById('mmpa-risk-value');
    if (riskValue && hudData.stability) {
      const risk = (hudData.stability.risk || 0) * 100;
      riskValue.textContent = `${risk.toFixed(1)}% risk`;
      riskValue.style.color = risk > 50 ? '#ff0000' : risk > 30 ? '#ffff00' : '#00ff00';
    }

    // Update force attribution - ACTUAL FIM RESULTS
    const dominantBand = document.getElementById('mmpa-dominant-band');
    if (dominantBand && hudData.attribution) {
      const dominant = hudData.attribution.dominant || 'none';
      dominantBand.textContent = `Dominant Force: ${dominant}`;
    }

    const attributionList = document.getElementById('mmpa-attribution-list');
    if (attributionList && hudData.attribution?.top3) {
      const top3 = hudData.attribution.top3.slice(0, 3);
      attributionList.innerHTML = top3.map(item =>
        `<div>${item.name}: ${(item.contribution * 100).toFixed(1)}%</div>`
      ).join('');
    }

    // Log diagnostics every 5 seconds - MMPA DATA
    if (frameCount % 300 === 0) {
      console.log('🎯 MMPA V2.0 HUD Update:', {
        sigmaStar: hudData.stability?.current?.toFixed(3),
        risk: ((hudData.stability?.risk || 0) * 100).toFixed(1) + '%',
        status: hudData.stability?.status,
        transitionWarning: hudData.prediction?.warning,
        transitionETA: hudData.prediction?.eta?.toFixed(2),
        dominant: hudData.attribution?.dominant,
        transitions: hudData.stats?.transitions
      });
    }
  }, 1000 / 60); // 60fps

  console.log("▶️ Audio Analysis overlay updates started (60fps)");
}

// Auto-create overlay on module load
if (typeof window !== 'undefined') {
  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createMMPAOverlay);
  } else {
    createMMPAOverlay();
  }
}

console.log("✅ hudMMPA.js ready");
