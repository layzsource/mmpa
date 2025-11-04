console.log("💧 hudLiquidSim.js loaded");

import { state } from './state.js';

/**
 * Liquid Simulation HUD section
 * Controls for metaball fluid dynamics shader
 */
export function createLiquidSimHudSection(container) {
  const section = document.createElement('div');
  section.className = 'hud-section liquid-sim';

  // Title
  const title = document.createElement('h3');
  title.textContent = 'Liquid Simulation (Metaballs)';
  section.appendChild(title);

  // Initialize state if needed
  if (!state.liquidSim) {
    state.liquidSim = {
      enabled: false,
      blobCount: 8.0,
      threshold: 1.2,
      viscosity: 0.5,
      gravity: 0.3,
      colorShift: 0.0,
      surfaceTension: 0.5
    };
  }

  // Enable/Disable Toggle
  const enableLabel = document.createElement('label');
  enableLabel.style.display = 'block';
  enableLabel.style.marginBottom = '12px';
  enableLabel.style.fontWeight = 'bold';

  const enableCheckbox = document.createElement('input');
  enableCheckbox.type = 'checkbox';
  enableCheckbox.checked = state.liquidSim.enabled || false;
  enableCheckbox.addEventListener('change', () => {
    state.liquidSim.enabled = enableCheckbox.checked;
    console.log(`💧 Liquid Simulation: ${enableCheckbox.checked ? 'ENABLED' : 'DISABLED'}`);
  });

  enableLabel.appendChild(enableCheckbox);
  enableLabel.appendChild(document.createTextNode(' Enable Liquid Simulation'));
  section.appendChild(enableLabel);

  // Blob Count
  const blobCountControl = createSliderControl(
    'Blob Count',
    4,
    16,
    1,
    state.liquidSim.blobCount,
    (value) => {
      state.liquidSim.blobCount = Math.floor(value);
    }
  );
  section.appendChild(blobCountControl);

  // Threshold
  const thresholdControl = createSliderControl(
    'Threshold (Size)',
    0.5,
    3.0,
    0.05,
    state.liquidSim.threshold,
    (value) => {
      state.liquidSim.threshold = value;
    }
  );
  section.appendChild(thresholdControl);

  // Viscosity
  const viscosityControl = createSliderControl(
    'Viscosity (Flow)',
    0.0,
    1.0,
    0.01,
    state.liquidSim.viscosity,
    (value) => {
      state.liquidSim.viscosity = value;
    }
  );
  section.appendChild(viscosityControl);

  // Gravity
  const gravityControl = createSliderControl(
    'Gravity Strength',
    0.0,
    1.0,
    0.01,
    state.liquidSim.gravity,
    (value) => {
      state.liquidSim.gravity = value;
    }
  );
  section.appendChild(gravityControl);

  // Surface Tension
  const tensionControl = createSliderControl(
    'Surface Tension',
    0.0,
    1.0,
    0.01,
    state.liquidSim.surfaceTension,
    (value) => {
      state.liquidSim.surfaceTension = value;
    }
  );
  section.appendChild(tensionControl);

  // Color Shift
  const colorShiftControl = createSliderControl(
    'Color Shift',
    0.0,
    1.0,
    0.01,
    state.liquidSim.colorShift,
    (value) => {
      state.liquidSim.colorShift = value;
    }
  );
  section.appendChild(colorShiftControl);

  // Presets
  const presetsDiv = document.createElement('div');
  presetsDiv.style.marginTop = '16px';

  const presetsLabel = document.createElement('div');
  presetsLabel.textContent = 'Presets:';
  presetsLabel.style.marginBottom = '8px';
  presetsLabel.style.fontWeight = 'bold';
  presetsDiv.appendChild(presetsLabel);

  const presets = [
    { name: 'Water', blobCount: 8, threshold: 1.2, viscosity: 0.2, gravity: 0.5, tension: 0.3 },
    { name: 'Oil', blobCount: 10, threshold: 1.5, viscosity: 0.6, gravity: 0.4, tension: 0.7 },
    { name: 'Mercury', blobCount: 6, threshold: 0.8, viscosity: 0.3, gravity: 0.7, tension: 0.9 },
    { name: 'Honey', blobCount: 12, threshold: 2.0, viscosity: 0.9, gravity: 0.3, tension: 0.8 }
  ];

  presets.forEach(preset => {
    const btn = document.createElement('button');
    btn.textContent = preset.name;
    btn.style.margin = '4px';
    btn.style.padding = '6px 12px';
    btn.addEventListener('click', () => {
      state.liquidSim.blobCount = preset.blobCount;
      state.liquidSim.threshold = preset.threshold;
      state.liquidSim.viscosity = preset.viscosity;
      state.liquidSim.gravity = preset.gravity;
      state.liquidSim.surfaceTension = preset.tension;

      blobCountControl.querySelector('input').value = preset.blobCount;
      blobCountControl.querySelector('span').textContent = preset.blobCount.toFixed(3);
      thresholdControl.querySelector('input').value = preset.threshold;
      thresholdControl.querySelector('span').textContent = preset.threshold.toFixed(3);
      viscosityControl.querySelector('input').value = preset.viscosity;
      viscosityControl.querySelector('span').textContent = preset.viscosity.toFixed(3);
      gravityControl.querySelector('input').value = preset.gravity;
      gravityControl.querySelector('span').textContent = preset.gravity.toFixed(3);
      tensionControl.querySelector('input').value = preset.tension;
      tensionControl.querySelector('span').textContent = preset.tension.toFixed(3);

      console.log(`💧 Loaded preset: ${preset.name}`);
    });
    presetsDiv.appendChild(btn);
  });

  section.appendChild(presetsDiv);

  container.appendChild(section);
  console.log("💧 Liquid Simulation HUD section created");
}

function createSliderControl(label, min, max, step, initialValue, onChange) {
  const control = document.createElement('div');
  control.style.marginTop = '12px';

  const labelEl = document.createElement('label');
  labelEl.textContent = label;
  labelEl.style.display = 'block';
  labelEl.style.marginBottom = '5px';
  control.appendChild(labelEl);

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = initialValue;
  slider.style.width = '100%';

  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = initialValue.toFixed(3);
  valueDisplay.style.marginLeft = '10px';

  slider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    valueDisplay.textContent = value.toFixed(3);
    onChange(value);
  });

  control.appendChild(slider);
  control.appendChild(valueDisplay);

  return control;
}
