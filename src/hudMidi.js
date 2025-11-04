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

  // ——— Phase 13.16: MIDI Learn (Enhanced) ———
  (function addMidiLearnUI() {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'margin-top:12px;padding-top:8px;border-top:1px solid #333;';
    wrap.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <button id="ml-toggle" style="padding:6px 10px;">🎓 MIDI Learn: OFF</button>
        <button id="ml-clear-all" style="padding:6px 10px;background:#663333;">🗑️ Clear All</button>
      </div>

      <div id="ml-mappings" style="margin-bottom:10px;padding:8px;background:rgba(0,0,0,0.3);border-radius:5px;min-height:40px;max-height:200px;overflow-y:auto;">
        <div style="opacity:.6;font-size:11px;">No active mappings</div>
      </div>

      <div style="margin-top:10px;">
        <div style="font-weight:bold;margin-bottom:6px;color:#ff00ff;">Quick Learn Targets:</div>
        <div style="display:grid;grid-template-columns:1fr auto;gap:6px;font-size:11px;">
          <div>Vessel → Opacity (0..1)</div>
          <button id="ml-bind-vessel-opacity" style="padding:4px 8px;">Learn</button>

          <div>Vessel → Scale (0.5..2.0)</div>
          <button id="ml-bind-vessel-scale" style="padding:4px 8px;">Learn</button>

          <div>Particles → Size (0.05..1.0)</div>
          <button id="ml-bind-particle-size" style="padding:4px 8px;">Learn</button>

          <div>Particles → Hue (0..360)</div>
          <button id="ml-bind-hue" style="padding:4px 8px;">Learn</button>

          <div>Geometry → Audio Intensity (0..1)</div>
          <button id="ml-bind-audio" style="padding:4px 8px;">Learn</button>

          <div>Mandala → Rings (1..12)</div>
          <button id="ml-bind-rings" style="padding:4px 8px;">Learn</button>

          <div>Mandala → Symmetry (2..24)</div>
          <button id="ml-bind-symmetry" style="padding:4px 8px;">Learn</button>

          <div>Rotation X (0..0.1)</div>
          <button id="ml-bind-rotx" style="padding:4px 8px;">Learn</button>

          <div>Rotation Y (0..0.1)</div>
          <button id="ml-bind-roty" style="padding:4px 8px;">Learn</button>

          <div>Camera Zoom (1..15)</div>
          <button id="ml-bind-camera-zoom" style="padding:4px 8px;">Learn</button>
        </div>
      </div>
    `;
    parentContainer.appendChild(wrap);

    const $ = (id) => wrap.querySelector(id);
    const btn = $('#ml-toggle');
    const mappingsDiv = $('#ml-mappings');

    const updateToggle = () => {
      btn.textContent = `🎓 MIDI Learn: ${window.MidiLearn.active ? "ON" : "OFF"}`;
      btn.style.background = window.MidiLearn.active ? "#225522" : "";
    };

    const updateMappingsList = () => {
      const mappings = window.MidiLearnAPI?.getMappings() || {};
      const keys = Object.keys(mappings);

      if (keys.length === 0) {
        mappingsDiv.innerHTML = '<div style="opacity:.6;font-size:11px;">No active mappings</div>';
        return;
      }

      mappingsDiv.innerHTML = keys.map(cc => {
        const m = mappings[cc];
        return `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:4px;margin-bottom:4px;background:rgba(255,0,255,0.1);border-radius:3px;">
            <div style="font-size:11px;">
              <span style="color:#ff00ff;font-weight:bold;">CC${m.cc}</span> → ${m.label}
              <span style="opacity:.6;">(${m.min}..${m.max})</span>
            </div>
            <button onclick="window.MidiLearnAPI.clearMapping(${cc})" style="padding:2px 6px;font-size:10px;background:#663333;">✕</button>
          </div>
        `;
      }).join('');
    };

    // Expose update function globally
    window.updateMidiLearnUI = updateMappingsList;

    btn.addEventListener('click', () => {
      window.MidiLearn.setActive(!window.MidiLearn.active);
      updateToggle();
    });

    $('#ml-clear-all').addEventListener('click', () => {
      if (confirm('Clear all MIDI mappings?')) {
        window.MidiLearnAPI?.clearAllMappings();
      }
    });

    updateToggle();
    updateMappingsList();

    // Predefined quick targets
    $('#ml-bind-vessel-opacity').addEventListener('click', () => {
      window.MidiLearn.setTarget({ label: "Vessel Opacity", path: "vessel.opacity", min: 0, max: 1 });
      window.MidiLearn.setActive(true);
      updateToggle();
    });

    $('#ml-bind-vessel-scale').addEventListener('click', () => {
      window.MidiLearn.setTarget({ label: "Vessel Scale", path: "vessel.scale", min: 0.5, max: 2.0 });
      window.MidiLearn.setActive(true);
      updateToggle();
    });

    $('#ml-bind-particle-size').addEventListener('click', () => {
      window.MidiLearn.setTarget({ label: "Particle Size", path: "particleSize", min: 0.05, max: 1.0 });
      window.MidiLearn.setActive(true);
      updateToggle();
    });

    $('#ml-bind-audio').addEventListener('click', () => {
      window.MidiLearn.setTarget({ label: "Geometry Audio Intensity", path: "colorLayers.geometry.audioIntensity", min: 0, max: 1 });
      window.MidiLearn.setActive(true);
      updateToggle();
    });

    $('#ml-bind-hue').addEventListener('click', () => {
      window.MidiLearn.setTarget({ label: "Particles Hue", path: "particles.hue", min: 0, max: 360 });
      window.MidiLearn.setActive(true);
      updateToggle();
    });

    $('#ml-bind-rings').addEventListener('click', () => {
      window.MidiLearn.setTarget({ label: "Mandala Rings", path: "emojiMandala.rings", min: 1, max: 12 });
      window.MidiLearn.setActive(true);
      updateToggle();
    });

    $('#ml-bind-symmetry').addEventListener('click', () => {
      window.MidiLearn.setTarget({ label: "Mandala Symmetry", path: "emojiMandala.symmetry", min: 2, max: 24 });
      window.MidiLearn.setActive(true);
      updateToggle();
    });

    $('#ml-bind-rotx').addEventListener('click', () => {
      window.MidiLearn.setTarget({ label: "Rotation X", path: "rotationX", min: 0, max: 0.1 });
      window.MidiLearn.setActive(true);
      updateToggle();
    });

    $('#ml-bind-roty').addEventListener('click', () => {
      window.MidiLearn.setTarget({ label: "Rotation Y", path: "rotationY", min: 0, max: 0.1 });
      window.MidiLearn.setActive(true);
      updateToggle();
    });

    $('#ml-bind-camera-zoom').addEventListener('click', () => {
      window.MidiLearn.setTarget({ label: "Camera Zoom", path: "camera.zoom", min: 1, max: 15 });
      window.MidiLearn.setActive(true);
      updateToggle();
    });
  })();

  console.log("🎹 MIDI HUD section created");
}

// Phase 13.4.2: Removed registerHUDCallback to fix circular dependency
