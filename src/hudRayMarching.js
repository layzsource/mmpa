console.log("📐 hudRayMarching.js loaded");

import { state } from './state.js';

/**
 * Ray Marching HUD section
 * Controls for 3D volumetric SDF rendering shader
 */
export function createRayMarchingHudSection(container) {
  const section = document.createElement('div');
  section.className = 'hud-section ray-marching';

  // Title
  const title = document.createElement('h3');
  title.textContent = 'Ray Marching (3D Volumetric)';
  section.appendChild(title);

  // Initialize state if needed
  if (!state.rayMarching) {
    state.rayMarching = {
      enabled: false,
      shapeType: 0.0,
      morphAmount: 0.0,
      density: 0.3,
      absorption: 1.0,
      colorShift: 0.0
    };
  }

  // Enable/Disable Toggle
  const enableLabel = document.createElement('label');
  enableLabel.style.display = 'block';
  enableLabel.style.marginBottom = '12px';
  enableLabel.style.fontWeight = 'bold';

  const enableCheckbox = document.createElement('input');
  enableCheckbox.type = 'checkbox';
  enableCheckbox.checked = state.rayMarching.enabled || false;
  enableCheckbox.addEventListener('change', () => {
    state.rayMarching.enabled = enableCheckbox.checked;
    console.log(`📐 Ray Marching: ${enableCheckbox.checked ? 'ENABLED' : 'DISABLED'}`);
  });

  enableLabel.appendChild(enableCheckbox);
  enableLabel.appendChild(document.createTextNode(' Enable Ray Marching'));
  section.appendChild(enableLabel);

  // Shape Type Selector
  const shapeTypeControl = document.createElement('div');
  shapeTypeControl.style.marginTop = '12px';

  const shapeTypeLabel = document.createElement('label');
  shapeTypeLabel.textContent = 'Shape Transition';
  shapeTypeLabel.style.display = 'block';
  shapeTypeLabel.style.marginBottom = '5px';
  shapeTypeControl.appendChild(shapeTypeLabel);

  const shapeTypeSelect = document.createElement('select');
  shapeTypeSelect.style.width = '100%';
  shapeTypeSelect.innerHTML = `
    <option value="0">Sphere → Box</option>
    <option value="1">Box → Torus</option>
    <option value="2">Torus → Sphere</option>
  `;
  shapeTypeSelect.value = state.rayMarching.shapeType.toString();
  shapeTypeSelect.addEventListener('change', (e) => {
    state.rayMarching.shapeType = parseFloat(e.target.value);
    console.log(`📐 Shape type: ${e.target.options[e.target.selectedIndex].text}`);
  });
  shapeTypeControl.appendChild(shapeTypeSelect);
  section.appendChild(shapeTypeControl);

  // Morph Amount
  const morphControl = createSliderControl(
    'Morph Amount',
    0.0,
    1.0,
    0.01,
    state.rayMarching.morphAmount,
    (value) => {
      state.rayMarching.morphAmount = value;
    }
  );
  section.appendChild(morphControl);

  // Density
  const densityControl = createSliderControl(
    'Density (Fog)',
    0.0,
    1.0,
    0.01,
    state.rayMarching.density,
    (value) => {
      state.rayMarching.density = value;
    }
  );
  section.appendChild(densityControl);

  // Absorption
  const absorptionControl = createSliderControl(
    'Absorption',
    0.0,
    5.0,
    0.1,
    state.rayMarching.absorption,
    (value) => {
      state.rayMarching.absorption = value;
    }
  );
  section.appendChild(absorptionControl);

  // Color Shift
  const colorShiftControl = createSliderControl(
    'Color Shift',
    0.0,
    1.0,
    0.01,
    state.rayMarching.colorShift,
    (value) => {
      state.rayMarching.colorShift = value;
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
    { name: 'Solid Glass', shapeType: 0, morph: 0.5, density: 0.1, absorption: 0.3 },
    { name: 'Foggy Shapes', shapeType: 1, morph: 0.3, density: 0.5, absorption: 1.5 },
    { name: 'Dense Cloud', shapeType: 2, morph: 0.7, density: 0.7, absorption: 2.0 }
  ];

  presets.forEach(preset => {
    const btn = document.createElement('button');
    btn.textContent = preset.name;
    btn.style.margin = '4px';
    btn.style.padding = '6px 12px';
    btn.addEventListener('click', () => {
      state.rayMarching.shapeType = preset.shapeType;
      state.rayMarching.morphAmount = preset.morph;
      state.rayMarching.density = preset.density;
      state.rayMarching.absorption = preset.absorption;

      shapeTypeSelect.value = preset.shapeType.toString();
      morphControl.querySelector('input').value = preset.morph;
      morphControl.querySelector('span').textContent = preset.morph.toFixed(3);
      densityControl.querySelector('input').value = preset.density;
      densityControl.querySelector('span').textContent = preset.density.toFixed(3);
      absorptionControl.querySelector('input').value = preset.absorption;
      absorptionControl.querySelector('span').textContent = preset.absorption.toFixed(3);

      console.log(`📐 Loaded preset: ${preset.name}`);
    });
    presetsDiv.appendChild(btn);
  });

  section.appendChild(presetsDiv);

  container.appendChild(section);
  console.log("📐 Ray Marching HUD section created");
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
