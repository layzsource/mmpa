console.log("🌊 hudVoxelWave.js loaded");

import { state } from './state.js';
import { scene } from './geometry.js';
import { switchMistRenderMode } from './voxelMist.js';

/**
 * Phase 13.7.0: Voxel Wave HUD section
 * Controls for the Voxel Wave Floor shader system
 */
export function createVoxelWaveHudSection(container) {
  const section = document.createElement('div');
  section.className = 'hud-section voxel-wave';

  // Title
  const title = document.createElement('h3');
  title.textContent = 'Voxel Wave Floor';
  section.appendChild(title);

  // Enable/Disable Toggle
  const enableLabel = document.createElement('label');
  enableLabel.style.display = 'block';
  enableLabel.style.marginBottom = '12px';
  enableLabel.style.fontWeight = 'bold';

  const enableCheckbox = document.createElement('input');
  enableCheckbox.type = 'checkbox';
  enableCheckbox.checked = state.voxelWave?.enabled || false;
  enableCheckbox.addEventListener('change', () => {
    state.voxelWave.enabled = enableCheckbox.checked;
    console.log(`🌊 Voxel Wave: ${enableCheckbox.checked ? 'ENABLED' : 'DISABLED'}`);
  });

  enableLabel.appendChild(enableCheckbox);
  enableLabel.appendChild(document.createTextNode(' Enable Voxel Wave'));
  section.appendChild(enableLabel);

  // Audio Reactivity Toggle
  const audioLabel = document.createElement('label');
  audioLabel.style.display = 'block';
  audioLabel.style.marginBottom = '12px';
  audioLabel.style.fontWeight = 'bold';

  const audioCheckbox = document.createElement('input');
  audioCheckbox.type = 'checkbox';
  audioCheckbox.checked = state.voxelWave?.audioReactive || false;
  audioCheckbox.addEventListener('change', () => {
    state.voxelWave.audioReactive = audioCheckbox.checked;
    console.log(`🎵 Voxel Wave Audio Reactive: ${audioCheckbox.checked ? 'ENABLED' : 'DISABLED'}`);
  });

  audioLabel.appendChild(audioCheckbox);
  audioLabel.appendChild(document.createTextNode(' Audio Reactive'));
  section.appendChild(audioLabel);

  // Mist/Atmosphere Toggle
  const mistLabel = document.createElement('label');
  mistLabel.style.display = 'block';
  mistLabel.style.marginBottom = '12px';
  mistLabel.style.fontWeight = 'bold';

  const mistCheckbox = document.createElement('input');
  mistCheckbox.type = 'checkbox';
  mistCheckbox.checked = state.voxelWave?.mistEnabled !== false; // Default ON
  mistCheckbox.addEventListener('change', () => {
    state.voxelWave.mistEnabled = mistCheckbox.checked;
    console.log(`🌫️ Voxel Wave Mist: ${mistCheckbox.checked ? 'ENABLED' : 'DISABLED'}`);
  });

  mistLabel.appendChild(mistCheckbox);
  mistLabel.appendChild(document.createTextNode(' Enable Mist/Atmosphere'));
  section.appendChild(mistLabel);

  // Mist Render Mode Dropdown
  const mistModeContainer = document.createElement('div');
  mistModeContainer.style.marginTop = '12px';
  mistModeContainer.style.marginBottom = '12px';

  const mistModeLabel = document.createElement('label');
  mistModeLabel.textContent = 'Mist Render Mode';
  mistModeLabel.style.display = 'block';
  mistModeLabel.style.marginBottom = '5px';
  mistModeContainer.appendChild(mistModeLabel);

  const mistModeSelect = document.createElement('select');
  mistModeSelect.style.width = '100%';
  mistModeSelect.style.padding = '5px';
  mistModeSelect.style.backgroundColor = '#222';
  mistModeSelect.style.color = '#fff';
  mistModeSelect.style.border = '1px solid #555';
  mistModeSelect.style.borderRadius = '3px';

  const particlesOption = document.createElement('option');
  particlesOption.value = 'particles';
  particlesOption.textContent = 'Particles (Seamless Volumetric)';
  mistModeSelect.appendChild(particlesOption);

  const planesOption = document.createElement('option');
  planesOption.value = 'planes';
  planesOption.textContent = 'Planes (Layered)';
  mistModeSelect.appendChild(planesOption);

  const bothOption = document.createElement('option');
  bothOption.value = 'both';
  bothOption.textContent = 'Both (Particles + Planes)';
  mistModeSelect.appendChild(bothOption);

  mistModeSelect.value = state.voxelWave?.mistRenderMode || 'particles';

  mistModeSelect.addEventListener('change', () => {
    const newMode = mistModeSelect.value;
    console.log(`🌫️ Switching mist render mode to: ${newMode}`);
    switchMistRenderMode(newMode, scene);
  });

  mistModeContainer.appendChild(mistModeSelect);
  section.appendChild(mistModeContainer);

  // Mist Density
  const mistDensityControl = createSliderControl(
    'Mist Density',
    0.1,
    3.0,
    0.1,
    state.voxelWave?.mistDensity || 1.0,
    (value) => {
      state.voxelWave.mistDensity = value;
    }
  );
  section.appendChild(mistDensityControl);

  // Mist Speed
  const mistSpeedControl = createSliderControl(
    'Mist Speed',
    0.1,
    5.0,
    0.1,
    state.voxelWave?.mistSpeed || 1.0,
    (value) => {
      state.voxelWave.mistSpeed = value;
    }
  );
  section.appendChild(mistSpeedControl);

  // Wave Amplitude
  const amplitudeControl = createSliderControl(
    'Wave Amplitude',
    0.0,
    1.0,
    0.01,
    state.voxelWave?.amplitude || 0.28,
    (value) => {
      state.voxelWave.amplitude = value;
    }
  );
  section.appendChild(amplitudeControl);

  // Wave Frequency
  const frequencyControl = createSliderControl(
    'Wave Frequency',
    0.1,
    2.0,
    0.05,
    state.voxelWave?.frequency || 0.6,
    (value) => {
      state.voxelWave.frequency = value;
    }
  );
  section.appendChild(frequencyControl);

  // Animation Speed
  const speedControl = createSliderControl(
    'Animation Speed',
    0.0,
    3.0,
    0.1,
    state.voxelWave?.speed || 1.0,
    (value) => {
      state.voxelWave.speed = value;
    }
  );
  section.appendChild(speedControl);

  // Cell Size
  const cellSizeControl = createSliderControl(
    'Cell Size',
    0.5,
    3.0,
    0.1,
    state.voxelWave?.cellSize || 1.0,
    (value) => {
      state.voxelWave.cellSize = value;
    }
  );
  section.appendChild(cellSizeControl);

  // Base Height
  const baseHeightControl = createSliderControl(
    'Base Height',
    0.1,
    1.0,
    0.05,
    state.voxelWave?.baseHeight || 0.35,
    (value) => {
      state.voxelWave.baseHeight = value;
    }
  );
  section.appendChild(baseHeightControl);

  // Color Shift (hue rotation)
  const colorShiftControl = createSliderControl(
    'Color Shift',
    0.0,
    1.0,
    0.01,
    state.voxelWave?.colorShift || 0.0,
    (value) => {
      state.voxelWave.colorShift = value;
    }
  );
  section.appendChild(colorShiftControl);

  container.appendChild(section);
  console.log("🌊 Voxel Wave HUD section created");
}

// Helper function to create slider controls
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

console.log("🌊 hudVoxelWave.js ready");
