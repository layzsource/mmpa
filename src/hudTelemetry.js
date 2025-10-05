console.log("📡 hudTelemetry.js loaded");

/**
 * Phase 11.7.50: Modular Telemetry HUD Section
 * Extracted from hud.js to reduce monolithic HUD file
 *
 * Note: Performance HUD (FPS/Draw Calls) lives in hudParticles.js
 * This module provides telemetry overlay toggle and debug controls
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

/**
 * Creates the Telemetry/Debug HUD section
 * @param {HTMLElement} parentContainer - The parent container to append to
 * @param {Function} notifyHUDUpdate - Callback to notify HUD changes
 */
export function createTelemetryHudSection(parentContainer, notifyHUDUpdate) {
  console.log("📡 Creating Telemetry HUD section");

  // Section separator
  const separator = document.createElement('hr');
  separator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  parentContainer.appendChild(separator);

  // Section title
  const title = document.createElement('h4');
  title.textContent = '📡 Telemetry & Debug';
  title.style.cssText = 'margin: 0 0 10px 0; color: #ff9900; font-size: 12px;';
  parentContainer.appendChild(title);

  // Telemetry overlay toggle
  const telemetryToggle = createToggleControl('Show Telemetry Overlay', false, (value) => {
    notifyHUDUpdate({ telemetryOverlay: value });

    // Toggle telemetry overlay visibility
    const overlay = document.getElementById('telemetry-overlay');
    if (overlay) {
      overlay.style.display = value ? 'block' : 'none';
    }
  });
  telemetryToggle.title = 'Show/hide telemetry overlay with FPS, MIDI, morph weights, etc.';
  parentContainer.appendChild(telemetryToggle);

  // Info about Performance HUD location
  const infoDiv = document.createElement('div');
  infoDiv.style.cssText = 'margin-top: 10px; padding: 8px; background: rgba(255,255,0,0.1); border-radius: 5px; font-size: 11px; color: #ffff00;';
  infoDiv.innerHTML = `
    <strong>Performance Metrics:</strong><br>
    FPS and Draw Calls are displayed in the Particles section on the Visual tab.
  `;
  parentContainer.appendChild(infoDiv);

  // ——— Phase 13.22: Screenshot + Posterize UI ———
  (function addScreenshotUI() {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'margin-top:12px;padding-top:8px;border-top:1px solid #333;';
    wrap.innerHTML = `
      <div style="font-weight:600;margin-bottom:6px;">📸 Screenshot</div>

      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <button id="ss-shot" style="padding:6px 10px;">📸 Save PNG</button>

        <label style="display:flex;align-items:center;gap:6px;">
          <input id="ss-posterize" type="checkbox">
          Posterize
        </label>

        <label style="display:flex;align-items:center;gap:8px;">
          Levels
          <input id="ss-levels" type="range" min="2" max="16" step="1" value="6" style="width:160px;">
          <span id="ss-levels-val" style="opacity:.8;">6</span>
        </label>
      </div>
    `;
    parentContainer.appendChild(wrap);

    const $ = (id) => wrap.querySelector(id);
    const btn = $('#ss-shot');
    const cbx = $('#ss-posterize');
    const rng = $('#ss-levels');
    const lbl = $('#ss-levels-val');

    rng.addEventListener('input', () => (lbl.textContent = rng.value));

    btn.addEventListener('click', () => {
      const levels = parseInt(rng.value, 10) || 6;
      const posterize = !!cbx.checked;
      const res = window.Capture?.save?.({ posterize, levels });
      if (!res?.ok) {
        console.warn('📸 Screenshot failed:', res);
      } else {
        console.log(`📸 Screenshot saved (posterize=${posterize ? levels : 0})`);
      }
    });
  })();

  // ——— Phase 13.25: Feature Scan UI ———
  (function addFeatureScanUI() {
    const root = parentContainer || document.body;
    if (!root) return;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'margin-top:12px;padding-top:8px;border-top:1px solid #333;';
    wrap.innerHTML = `
      <div style="font-weight:600;margin-bottom:6px;">🛰️ Feature Scan</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button id="feat-scan" style="padding:6px 10px;">Scan Now</button>
        <button id="feat-pm" style="padding:6px 10px;">Toggle Projector Mode</button>
        <button id="feat-shot" style="padding:6px 10px;">Screenshot (PNG)</button>
      </div>
      <pre id="feat-out" style="margin-top:8px;max-height:160px;overflow:auto;background:#111;padding:8px;border:1px solid #333;"></pre>
    `;
    root.appendChild(wrap);

    const $ = (sel) => wrap.querySelector(sel);
    const out = $('#feat-out');

    $('#feat-scan').addEventListener('click', () => {
      const res = window.debugFeatures?.();
      out.textContent = JSON.stringify(res?.s || {}, null, 2) +
        (res?.problems?.length ? `\n\nMissing:\n- ${res.problems.join('\n- ')}` : '\n\nOK: all present');
    });

    $('#feat-pm').addEventListener('click', () => {
      if (window.ProjectorMode?.toggle) {
        window.ProjectorMode.toggle();
      } else {
        console.warn('ProjectorMode not available');
      }
    });

    $('#feat-shot').addEventListener('click', () => {
      const r = window.Capture?.save?.({ posterize:false });
      if (!r?.ok) console.warn('Capture not available or failed', r);
    });
  })();

  console.log("📡 Telemetry HUD section created");
}

// Phase 13.4.2: Removed registerHUDCallback to fix circular dependency
