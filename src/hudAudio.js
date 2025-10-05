import { HUD, notifyHUDUpdate, registerHUDCallback } from "./hud.js";

console.log("🎶 hudAudio.js loaded");

/**
 * Phase 11.7.50: Modular Audio HUD Section
 * Extracted from hud.js to reduce monolithic HUD file
 */

// Helper to create a control with consistent styling
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

function createSliderControl(labelText, defaultValue, min, max, step, onChange) {
  const { container, label } = createControl(labelText);

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = defaultValue;
  slider.style.cssText = 'width: 100%; margin-top: 5px;';

  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = defaultValue;
  valueDisplay.style.cssText = 'margin-left: 10px; color: #00ff00;';

  slider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    valueDisplay.textContent = value.toFixed(step >= 1 ? 0 : (step < 0.01 ? 4 : (step < 0.1 ? 2 : 1)));
    onChange(value);
  });

  container.appendChild(label);
  label.appendChild(valueDisplay);
  container.appendChild(slider);

  return container;
}

/**
 * Creates the Audio HUD section with all controls
 * @param {HTMLElement} parentContainer - The parent container to append to
 * @param {Function} notifyHUDUpdate - Callback to notify HUD changes
 */
export function createAudioHudSection(parentContainer, notifyHUDUpdate) {
  console.log("🎶 Creating Audio HUD section");

  // Section separator
  const separator = document.createElement('hr');
  separator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  parentContainer.appendChild(separator);

  // Section title
  const title = document.createElement('h4');
  title.textContent = '🎶 Audio-Reactive';
  title.style.cssText = 'margin: 0 0 10px 0; color: #ff9900; font-size: 12px;';
  parentContainer.appendChild(title);

  // Audio enable toggle
  const enableControl = createToggleControl('Audio-Reactive Morphing', false, (value) => {
    console.log("🪗 HUD audio toggle clicked");
    notifyHUDUpdate({ audioEnabled: value });
  });
  parentContainer.appendChild(enableControl);

  // Audio sensitivity slider
  const sensitivityControl = createSliderControl('Audio Sensitivity', 1.0, 0.5, 2.0, 0.1, (value) => {
    notifyHUDUpdate({ audioSensitivity: value });
  });
  parentContainer.appendChild(sensitivityControl);

  // Phase 13.30: Master Reactivity slider
  const gainControl = createSliderControl('Master Reactivity (×)', 1.0, 0.2, 4.0, 0.05, (value) => {
    notifyHUDUpdate({ audioGain: value });
  });
  parentContainer.appendChild(gainControl);

  // 🧩 Phase 13.8b — Device Picker + Test Tone

  // Device Picker
  const devWrap = document.createElement('div');
  devWrap.style.cssText = 'margin-top:10px;';
  const devLabel = document.createElement('label');
  devLabel.textContent = "Input Device:";
  devLabel.style.cssText = 'display:block;margin-bottom:4px;';
  const devSelect = document.createElement('select');
  devSelect.style.cssText = 'width:100%;';

  devWrap.appendChild(devLabel);
  devWrap.appendChild(devSelect);
  parentContainer.appendChild(devWrap);

  async function refreshDevices() {
    try {
      const list = await window.AudioEngine?.listInputs?.();
      devSelect.innerHTML = "";
      (list || []).forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.deviceId;
        opt.textContent = d.label || "(Unnamed input)";
        devSelect.appendChild(opt);
      });
    } catch (e) {
      console.warn("Audio device enumeration failed:", e);
    }
  }
  devSelect.addEventListener('change', async () => {
    await window.AudioEngine?.selectDevice?.(devSelect.value);
  });

  // ✅ Phase 13.9 — Pre-Gain slider (0.1x..16x)
  const gainWrap = document.createElement('div');
  gainWrap.style.cssText = 'margin-top:8px;';
  const gainLabel = document.createElement('label');
  gainLabel.textContent = "Mic Boost (Pre-Gain)";
  gainLabel.style.cssText = 'display:block;margin-bottom:4px;';
  const gainSlider = document.createElement('input');
  gainSlider.id = 'audio-pregain';
  gainSlider.type = 'range';
  gainSlider.min = '0.1';
  gainSlider.max = '16';
  gainSlider.step = '0.1';
  gainSlider.value = '4';
  gainSlider.style.cssText = 'width:100%;';
  gainSlider.addEventListener('input', (e) => window.AudioEngine?.setPreGain?.(parseFloat(e.target.value)));
  gainWrap.appendChild(gainLabel);
  gainWrap.appendChild(gainSlider);
  parentContainer.appendChild(gainWrap);

  // Test Tone Toggle
  const ttWrap = document.createElement('div');
  ttWrap.style.cssText = 'margin-top:10px;';
  const ttBtn = document.createElement('button');
  ttBtn.textContent = "🔊 Test Tone";
  ttBtn.style.cssText = 'width:100%;padding:6px;border-radius:6px;';
  ttBtn.addEventListener('click', async () => {
    await window.AudioEngine?.toggleTestTone?.();
  });
  ttWrap.appendChild(ttBtn);
  parentContainer.appendChild(ttWrap);

  // (Optional) Manual apply bands button for quick sanity check
  const applyBtn = document.createElement('button');
  applyBtn.textContent = "↻ Force-apply audio bands to visuals";
  applyBtn.style.cssText = 'margin-top:8px;width:100%;padding:6px;border-radius:6px;';
  applyBtn.addEventListener('click', () => {
    const b = window.AudioEngine?.bands;
    if (!b) return;
    // if your hud/hudRouter already calls notifyHUDUpdate with bands, you can mirror it:
    try {
      window.notifyHUDUpdate?.({ audioBands: { ...b } });
    } catch {}
    console.log("🪢 Applied bands to visuals:", b);
  });
  parentContainer.appendChild(applyBtn);

  // Populate on open (safe no-op if permissions not granted yet)
  setTimeout(refreshDevices, 0);

  console.log("🎶 Audio HUD section created");
}

// Phase 13.4.2: Export refresh callback for manual registration
export function refreshAudioHUD() {
  console.log("🎶 HUD(Audio): refresh");
}
