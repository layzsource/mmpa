console.log("🌀 hudHyperbolicTiling.js loaded");

import { state } from './state.js';

/**
 * Phase 13.29: Hyperbolic Tiling HUD section
 * Controls for the Hyperbolic Tiling shader system
 * Non-Euclidean infinity pattern with infinite zoom detail
 */
export function createHyperbolicTilingHudSection(container) {
  const section = document.createElement('div');
  section.className = 'hud-section hyperbolic-tiling';

  // Title
  const title = document.createElement('h3');
  title.textContent = 'Hyperbolic Tiling';
  section.appendChild(title);

  // Description
  const desc = document.createElement('p');
  desc.style.fontSize = '11px';
  desc.style.color = '#aaa';
  desc.style.marginBottom = '12px';
  desc.textContent = 'Non-Euclidean fractal pattern with infinite zoom detail';
  section.appendChild(desc);

  // Enable/Disable Toggle
  const enableLabel = document.createElement('label');
  enableLabel.style.display = 'block';
  enableLabel.style.marginBottom = '12px';
  enableLabel.style.fontWeight = 'bold';

  const enableCheckbox = document.createElement('input');
  enableCheckbox.type = 'checkbox';
  enableCheckbox.checked = state.hyperbolicTiling?.enabled || false;
  enableCheckbox.addEventListener('change', () => {
    state.hyperbolicTiling.enabled = enableCheckbox.checked;
    console.log(`🌀 Hyperbolic Tiling: ${enableCheckbox.checked ? 'ENABLED' : 'DISABLED'}`);
  });

  enableLabel.appendChild(enableCheckbox);
  enableLabel.appendChild(document.createTextNode(' Enable Hyperbolic Tiling'));
  section.appendChild(enableLabel);

  // Pattern Scale (Zoom)
  const scaleControl = createSliderControl(
    'Pattern Zoom',
    0.01,
    100,
    0.1,
    state.hyperbolicTiling?.patternScale || 4.0,
    (value) => {
      state.hyperbolicTiling.patternScale = value;
    },
    { logarithmic: true }
  );
  section.appendChild(scaleControl);

  // Pan X
  const panXControl = createSliderControl(
    'Pan X',
    -10.0,
    10.0,
    0.01,
    state.hyperbolicTiling?.panX || 0.0,
    (value) => {
      state.hyperbolicTiling.panX = value;
    }
  );
  section.appendChild(panXControl);

  // Pan Y
  const panYControl = createSliderControl(
    'Pan Y',
    -10.0,
    10.0,
    0.01,
    state.hyperbolicTiling?.panY || 0.0,
    (value) => {
      state.hyperbolicTiling.panY = value;
    }
  );
  section.appendChild(panYControl);

  // Rotation Speed
  const rotationControl = createSliderControl(
    'Rotation Speed',
    -0.5,
    0.5,
    0.01,
    state.hyperbolicTiling?.rotationSpeed || 0.1,
    (value) => {
      state.hyperbolicTiling.rotationSpeed = value;
    }
  );
  section.appendChild(rotationControl);

  // Iteration Count (detail level)
  const iterationsControl = createSliderControl(
    'Detail Level (Iterations)',
    5,
    50,
    1,
    state.hyperbolicTiling?.iterations || 25,
    (value) => {
      state.hyperbolicTiling.iterations = Math.floor(value);
    }
  );
  section.appendChild(iterationsControl);

  // Density Scale
  const densityControl = createSliderControl(
    'Density Scale',
    0.1,
    5.0,
    0.1,
    state.hyperbolicTiling?.densityScale || 1.0,
    (value) => {
      state.hyperbolicTiling.densityScale = value;
    }
  );
  section.appendChild(densityControl);

  // Base Color Shift (Hue)
  const hueControl = createSliderControl(
    'Color Hue Shift',
    0.0,
    1.0,
    0.01,
    state.hyperbolicTiling?.colorHueShift || 0.0,
    (value) => {
      state.hyperbolicTiling.colorHueShift = value;
    }
  );
  section.appendChild(hueControl);

  // Grid Intensity
  const gridControl = createSliderControl(
    'Grid Line Intensity',
    0.0,
    1.0,
    0.05,
    state.hyperbolicTiling?.gridIntensity || 0.4,
    (value) => {
      state.hyperbolicTiling.gridIntensity = value;
    }
  );
  section.appendChild(gridControl);

  // Audio Reactivity
  const audioControl = createSliderControl(
    'Audio Reactivity',
    0.0,
    5.0,
    0.1,
    state.hyperbolicTiling?.audioReactivity || 1.0,
    (value) => {
      state.hyperbolicTiling.audioReactivity = value;
    }
  );
  section.appendChild(audioControl);

  // Reset Button
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset View';
  resetButton.style.width = '100%';
  resetButton.style.padding = '8px';
  resetButton.style.marginTop = '12px';
  resetButton.style.backgroundColor = '#8b5cf6';
  resetButton.style.color = 'white';
  resetButton.style.border = 'none';
  resetButton.style.borderRadius = '4px';
  resetButton.style.cursor = 'pointer';
  resetButton.style.fontWeight = 'bold';

  resetButton.addEventListener('click', () => {
    state.hyperbolicTiling.panX = 0.0;
    state.hyperbolicTiling.panY = 0.0;
    state.hyperbolicTiling.patternScale = 4.0;
    console.log('🌀 Hyperbolic Tiling: View reset');

    // Update UI controls
    panXControl.querySelector('input').value = 0;
    panYControl.querySelector('input').value = 0;
    scaleControl.querySelector('input').value = 4.0;
  });

  section.appendChild(resetButton);

  container.appendChild(section);
  return section;
}

// Helper function for creating slider controls
function createSliderControl(label, min, max, step, initialValue, onChange, options = {}) {
  const container = document.createElement('div');
  container.style.marginBottom = '12px';

  const labelEl = document.createElement('label');
  labelEl.style.display = 'block';
  labelEl.style.marginBottom = '4px';
  labelEl.style.fontSize = '12px';
  labelEl.textContent = label;
  container.appendChild(labelEl);

  const inputContainer = document.createElement('div');
  inputContainer.style.display = 'flex';
  inputContainer.style.gap = '8px';
  inputContainer.style.alignItems = 'center';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = options.logarithmic ? Math.log10(min) : min;
  slider.max = options.logarithmic ? Math.log10(max) : max;
  slider.step = options.logarithmic ? 0.01 : step;
  slider.value = options.logarithmic ? Math.log10(initialValue) : initialValue;
  slider.style.flex = '1';

  const valueDisplay = document.createElement('span');
  valueDisplay.style.minWidth = '50px';
  valueDisplay.style.fontSize = '11px';
  valueDisplay.style.color = '#8b5cf6';
  valueDisplay.textContent = initialValue.toFixed(2);

  slider.addEventListener('input', () => {
    const value = options.logarithmic ?
      Math.pow(10, parseFloat(slider.value)) :
      parseFloat(slider.value);
    valueDisplay.textContent = value.toFixed(2);
    onChange(value);
  });

  inputContainer.appendChild(slider);
  inputContainer.appendChild(valueDisplay);
  container.appendChild(inputContainer);

  return container;
}
