console.log("🎹 hudMidi.js loaded");

// Phase 13.16 — MIDI Learn bridge
window.MidiLearn = window.MidiLearn || {
  active: false,
  target: null, // { label, path, min, max }
  setTarget(t) { this.target = t; console.log("🎓 MIDI Learn target:", t); },
  setActive(v) { this.active = !!v; console.log(`🎓 MIDI Learn: ${this.active ? "ON" : "OFF"}`); }
};

/**
 * Phase 11.7.50: Modular MIDI HUD Section
 * Extracted from hud.js to reduce monolithic HUD file
 *
 * Note: Currently no MIDI UI exists in hud.js, but this module provides
 * infrastructure for future MIDI controls (port selection, CC mappings, etc.)
 */

import { getMIDIDeviceCount } from './midi.js';

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

/**
 * Creates the MIDI HUD section with all controls
 * @param {HTMLElement} parentContainer - The parent container to append to
 * @param {Function} notifyHUDUpdate - Callback to notify HUD changes
 */
export function createMidiHudSection(parentContainer, notifyHUDUpdate) {
  console.log("🎹 Creating MIDI HUD section");

  // Section separator
  const separator = document.createElement('hr');
  separator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  parentContainer.appendChild(separator);

  // Section title
  const title = document.createElement('h4');
  title.textContent = '🎹 MIDI';
  title.style.cssText = 'margin: 0 0 10px 0; color: #ff00ff; font-size: 12px;';
  parentContainer.appendChild(title);

  // MIDI device count display
  const deviceCountDiv = document.createElement('div');
  deviceCountDiv.style.cssText = 'margin-bottom: 15px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px;';

  const deviceCountLabel = document.createElement('div');
  const deviceCount = getMIDIDeviceCount();
  deviceCountLabel.innerHTML = `<span style="color: #888;">MIDI Devices:</span> <span id="hud-midi-devices" style="color: #ff00ff;">${deviceCount}</span>`;
  deviceCountLabel.style.cssText = 'font-size: 12px;';
  deviceCountDiv.appendChild(deviceCountLabel);

  parentContainer.appendChild(deviceCountDiv);

  // MIDI logging toggle (for debugging)
  const logToggle = createToggleControl('Enable MIDI Logging', false, (value) => {
    notifyHUDUpdate({ midiLogging: value });
  });
  logToggle.title = 'Log all incoming MIDI messages to console';
  parentContainer.appendChild(logToggle);

  // Info text about MIDI mappings
  const infoDiv = document.createElement('div');
  infoDiv.style.cssText = 'margin-top: 10px; padding: 8px; background: rgba(255,255,0,0.1); border-radius: 5px; font-size: 11px; color: #ffff00;';
  infoDiv.innerHTML = `
    <strong>Active MIDI Mappings:</strong><br>
    • Mandala: CC20-23 (symmetry, rings, rotation, scale)<br>
    • Vessel: CC24-26 (layout, opacity, scale)<br>
    • Emoji: CC27-31 (physics, story mode)<br>
    • Global: CC1 (mod wheel) for master control
  `;
  parentContainer.appendChild(infoDiv);

  // ——— Phase 13.16: MIDI Learn (micro) ———
  (function addMidiLearnUI() {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'margin-top:12px;padding-top:8px;border-top:1px solid #333;';
    wrap.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <button id="ml-toggle" style="padding:6px 10px;">🎓 MIDI Learn: OFF</button>
        <span style="opacity:.8">Pick a target, toggle Learn, then twist a knob.</span>
      </div>

      <div style="margin-top:10px;display:grid;grid-template-columns:1fr auto;gap:6px;">
        <div>Audio Intensity (0..1)</div>
        <button id="ml-bind-audio" style="padding:4px 8px;">Bind</button>

        <div>Particles → Hue Shift (−180..+180)</div>
        <button id="ml-bind-hue" style="padding:4px 8px;">Bind</button>

        <div>Mandala → Rings (1..8)</div>
        <button id="ml-bind-rings" style="padding:4px 8px;">Bind</button>
      </div>
    `;
    parentContainer.appendChild(wrap);

    const $ = (id) => wrap.querySelector(id);
    const btn = $('#ml-toggle');

    const updateToggle = () => {
      btn.textContent = `🎓 MIDI Learn: ${window.MidiLearn.active ? "ON" : "OFF"}`;
      btn.style.background = window.MidiLearn.active ? "#225522" : "";
    };

    btn.addEventListener('click', () => {
      window.MidiLearn.setActive(!window.MidiLearn.active);
      updateToggle();
    });
    updateToggle();

    // Predefined quick targets (safe examples)
    $('#ml-bind-audio').addEventListener('click', () => {
      window.MidiLearn.setTarget({ label: "Audio Intensity", path: "geometry.audioIntensity", min: 0, max: 1 });
    });
    $('#ml-bind-hue').addEventListener('click', () => {
      window.MidiLearn.setTarget({ label: "Particles Hue Shift", path: "particles.hueShift", min: -180, max: 180 });
    });
    $('#ml-bind-rings').addEventListener('click', () => {
      window.MidiLearn.setTarget({ label: "Mandala Rings", path: "mandala.rings", min: 1, max: 8 });
    });
  })();

  console.log("🎹 MIDI HUD section created");
}

// Phase 13.4.2: Removed registerHUDCallback to fix circular dependency
