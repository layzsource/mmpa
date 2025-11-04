console.log("🌀 hudMorph.js loaded");

/**
 * Phase 11.7.51: Modular Morph HUD Section
 * Extracted from hud.js to complete HUD modularization
 */

import { morphMesh } from './geometry.js';
import { setHumanoidVisible } from './humanoid.js';

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
    valueDisplay.textContent = value.toFixed(step >= 1 ? 0 : (step < 0.01 ? 4 : (step < 0.001 ? 3 : 2)));
    onChange(value);
  });

  container.appendChild(label);
  label.appendChild(valueDisplay);
  container.appendChild(slider);

  return container;
}

function createDropdownControl(labelText, defaultValue, options, onChange) {
  const { container, label } = createControl(labelText);

  const select = document.createElement('select');
  select.style.cssText = 'width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555;';

  options.forEach(option => {
    const optionEl = document.createElement('option');
    optionEl.value = option;
    optionEl.textContent = option.charAt(0).toUpperCase() + option.slice(1);
    if (option === defaultValue) {
      optionEl.selected = true;
    }
    select.appendChild(optionEl);
  });

  select.addEventListener('change', (e) => onChange(e.target.value));

  container.appendChild(label);
  container.appendChild(select);

  return container;
}

/**
 * Creates the Morph HUD section with all controls
 * @param {HTMLElement} parentContainer - The parent container to append to
 * @param {Function} notifyHUDUpdate - Callback to notify HUD changes
 */
export function createMorphHudSection(parentContainer, notifyHUDUpdate) {
  console.log("🌀 Creating Morph HUD section");

  // Show/Hide Morph Shape toggle
  const showMorphControl = createToggleControl('Show Morph Shape', true, (value) => {
    if (morphMesh) {
      morphMesh.visible = value;
      console.log(`🔺 Morph shape visibility: ${value ? 'ON' : 'OFF'}`);
    }
  });
  showMorphControl.style.cssText = 'margin-bottom: 12px; padding: 8px; background: #2a2a2a; border-radius: 4px;';
  parentContainer.appendChild(showMorphControl);

  // Show/Hide Dancing Humanoid toggle
  const showHumanoidControl = createToggleControl('Show Dancing Humanoid', false, (value) => {
    setHumanoidVisible(value);
    console.log(`🕺 Humanoid visibility: ${value ? 'ON' : 'OFF'}`);
  });
  showHumanoidControl.style.cssText = 'margin-bottom: 12px; padding: 8px; background: #2a2a2a; border-radius: 4px;';
  parentContainer.appendChild(showHumanoidControl);

  // Idle spin toggle
  const idleSpinControl = createToggleControl('Idle Spin', true, (value) => {
    notifyHUDUpdate({ idleSpin: value });
  });
  parentContainer.appendChild(idleSpinControl);

  // X Rotation control
  const xRotControl = createSliderControl('X Rotation', 0, 0, 0.2, 0.001, (value) => {
    notifyHUDUpdate({ rotX: value });
  });
  parentContainer.appendChild(xRotControl);

  // Y Rotation control
  const yRotControl = createSliderControl('Y Rotation', 0, 0, 0.2, 0.001, (value) => {
    notifyHUDUpdate({ rotY: value });
  });
  parentContainer.appendChild(yRotControl);

  // Scale control
  const scaleControl = createSliderControl('Scale', 1.0, 0.5, 2.0, 0.1, (value) => {
    notifyHUDUpdate({ scale: value });
  });
  parentContainer.appendChild(scaleControl);

  // Morph target dropdown
  const morphControl = createDropdownControl('Morph Target', 'cube',
    ['cube', 'sphere', 'pyramid', 'torus'], (value) => {
    notifyHUDUpdate({ morphTarget: value });
  });
  parentContainer.appendChild(morphControl);

  // Morph intensity slider
  const morphIntensityControl = createSliderControl('Morph Intensity', 0.0, 0.0, 1.0, 0.01, (value) => {
    notifyHUDUpdate({ morphBlend: value });
  });
  parentContainer.appendChild(morphIntensityControl);

  // Separator for multi-target blends
  const separator = document.createElement('hr');
  separator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  parentContainer.appendChild(separator);

  const phase4Title = document.createElement('h4');
  phase4Title.textContent = '🌀 Multi-Target Blends';
  phase4Title.style.cssText = 'margin: 0 0 10px 0; color: #ffff00; font-size: 12px;';
  parentContainer.appendChild(phase4Title);

  // Per-target weight sliders
  const cubeWeightControl = createSliderControl('Cube Weight', 1.0, 0.0, 1.0, 0.01, (value) => {
    notifyHUDUpdate({ targetWeight: { target: 'cube', weight: value } });
  });
  parentContainer.appendChild(cubeWeightControl);

  const sphereWeightControl = createSliderControl('Sphere Weight', 0.0, 0.0, 1.0, 0.01, (value) => {
    notifyHUDUpdate({ targetWeight: { target: 'sphere', weight: value } });
  });
  parentContainer.appendChild(sphereWeightControl);

  const pyramidWeightControl = createSliderControl('Pyramid Weight', 0.0, 0.0, 1.0, 0.01, (value) => {
    notifyHUDUpdate({ targetWeight: { target: 'pyramid', weight: value } });
  });
  parentContainer.appendChild(pyramidWeightControl);

  const torusWeightControl = createSliderControl('Torus Weight', 0.0, 0.0, 1.0, 0.01, (value) => {
    notifyHUDUpdate({ targetWeight: { target: 'torus', weight: value } });
  });
  parentContainer.appendChild(torusWeightControl);

  console.log("🌀 Morph HUD section created");
}
