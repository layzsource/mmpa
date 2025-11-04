import { state } from './state.js';

export function createFlowFieldHudSection(container) {
  // Initialize state
  if (!state.flowField) {
    state.flowField = {
      enabled: false,
      scale: 4.0,
      speed: 1.0,
      strength: 1.0,
      particleDensity: 1.0,
      colorShift: 0.0,
      timeScale: 0.3
    };
  }

  const section = document.createElement('div');
  section.className = 'hud-section';

  const title = document.createElement('h3');
  title.textContent = 'Flow Field';
  section.appendChild(title);

  // Enable toggle
  const enableContainer = document.createElement('div');
  enableContainer.className = 'hud-control';
  const enableLabel = document.createElement('label');
  enableLabel.textContent = 'Enable: ';
  const enableCheckbox = document.createElement('input');
  enableCheckbox.type = 'checkbox';
  enableCheckbox.checked = state.flowField.enabled;
  enableCheckbox.addEventListener('change', (e) => {
    state.flowField.enabled = e.target.checked;
  });
  enableLabel.appendChild(enableCheckbox);
  enableContainer.appendChild(enableLabel);
  section.appendChild(enableContainer);

  // Scale slider (noise frequency)
  const scaleContainer = document.createElement('div');
  scaleContainer.className = 'hud-control';
  const scaleLabel = document.createElement('label');
  scaleLabel.textContent = 'Scale (Frequency): ';
  const scaleSlider = document.createElement('input');
  scaleSlider.type = 'range';
  scaleSlider.min = '1';
  scaleSlider.max = '20';
  scaleSlider.step = '0.5';
  scaleSlider.value = state.flowField.scale.toString();
  const scaleValue = document.createElement('span');
  scaleValue.textContent = state.flowField.scale.toFixed(1);
  scaleSlider.addEventListener('input', (e) => {
    state.flowField.scale = parseFloat(e.target.value);
    scaleValue.textContent = state.flowField.scale.toFixed(1);
  });
  scaleLabel.appendChild(scaleSlider);
  scaleLabel.appendChild(scaleValue);
  scaleContainer.appendChild(scaleLabel);
  section.appendChild(scaleContainer);

  // Speed slider
  const speedContainer = document.createElement('div');
  speedContainer.className = 'hud-control';
  const speedLabel = document.createElement('label');
  speedLabel.textContent = 'Speed: ';
  const speedSlider = document.createElement('input');
  speedSlider.type = 'range';
  speedSlider.min = '0.1';
  speedSlider.max = '5.0';
  speedSlider.step = '0.1';
  speedSlider.value = state.flowField.speed.toString();
  const speedValue = document.createElement('span');
  speedValue.textContent = state.flowField.speed.toFixed(1);
  speedSlider.addEventListener('input', (e) => {
    state.flowField.speed = parseFloat(e.target.value);
    speedValue.textContent = state.flowField.speed.toFixed(1);
  });
  speedLabel.appendChild(speedSlider);
  speedLabel.appendChild(speedValue);
  speedContainer.appendChild(speedLabel);
  section.appendChild(speedContainer);

  // Strength slider (flow curl)
  const strengthContainer = document.createElement('div');
  strengthContainer.className = 'hud-control';
  const strengthLabel = document.createElement('label');
  strengthLabel.textContent = 'Strength (Curl): ';
  const strengthSlider = document.createElement('input');
  strengthSlider.type = 'range';
  strengthSlider.min = '0';
  strengthSlider.max = '3';
  strengthSlider.step = '0.1';
  strengthSlider.value = state.flowField.strength.toString();
  const strengthValue = document.createElement('span');
  strengthValue.textContent = state.flowField.strength.toFixed(1);
  strengthSlider.addEventListener('input', (e) => {
    state.flowField.strength = parseFloat(e.target.value);
    strengthValue.textContent = state.flowField.strength.toFixed(1);
  });
  strengthLabel.appendChild(strengthSlider);
  strengthLabel.appendChild(strengthValue);
  strengthContainer.appendChild(strengthLabel);
  section.appendChild(strengthContainer);

  // Particle Density slider
  const densityContainer = document.createElement('div');
  densityContainer.className = 'hud-control';
  const densityLabel = document.createElement('label');
  densityLabel.textContent = 'Particle Density: ';
  const densitySlider = document.createElement('input');
  densitySlider.type = 'range';
  densitySlider.min = '0.1';
  densitySlider.max = '3.0';
  densitySlider.step = '0.1';
  densitySlider.value = state.flowField.particleDensity.toString();
  const densityValue = document.createElement('span');
  densityValue.textContent = state.flowField.particleDensity.toFixed(1);
  densitySlider.addEventListener('input', (e) => {
    state.flowField.particleDensity = parseFloat(e.target.value);
    densityValue.textContent = state.flowField.particleDensity.toFixed(1);
  });
  densityLabel.appendChild(densitySlider);
  densityLabel.appendChild(densityValue);
  densityContainer.appendChild(densityLabel);
  section.appendChild(densityContainer);

  // Time Scale slider
  const timeScaleContainer = document.createElement('div');
  timeScaleContainer.className = 'hud-control';
  const timeScaleLabel = document.createElement('label');
  timeScaleLabel.textContent = 'Time Scale: ';
  const timeScaleSlider = document.createElement('input');
  timeScaleSlider.type = 'range';
  timeScaleSlider.min = '0';
  timeScaleSlider.max = '2';
  timeScaleSlider.step = '0.1';
  timeScaleSlider.value = state.flowField.timeScale.toString();
  const timeScaleValue = document.createElement('span');
  timeScaleValue.textContent = state.flowField.timeScale.toFixed(1);
  timeScaleSlider.addEventListener('input', (e) => {
    state.flowField.timeScale = parseFloat(e.target.value);
    timeScaleValue.textContent = state.flowField.timeScale.toFixed(1);
  });
  timeScaleLabel.appendChild(timeScaleSlider);
  timeScaleLabel.appendChild(timeScaleValue);
  timeScaleContainer.appendChild(timeScaleLabel);
  section.appendChild(timeScaleContainer);

  // Color Shift slider
  const colorShiftContainer = document.createElement('div');
  colorShiftContainer.className = 'hud-control';
  const colorShiftLabel = document.createElement('label');
  colorShiftLabel.textContent = 'Color Shift: ';
  const colorShiftSlider = document.createElement('input');
  colorShiftSlider.type = 'range';
  colorShiftSlider.min = '0';
  colorShiftSlider.max = '1';
  colorShiftSlider.step = '0.01';
  colorShiftSlider.value = state.flowField.colorShift.toString();
  const colorShiftValue = document.createElement('span');
  colorShiftValue.textContent = state.flowField.colorShift.toFixed(2);
  colorShiftSlider.addEventListener('input', (e) => {
    state.flowField.colorShift = parseFloat(e.target.value);
    colorShiftValue.textContent = state.flowField.colorShift.toFixed(2);
  });
  colorShiftLabel.appendChild(colorShiftSlider);
  colorShiftLabel.appendChild(colorShiftValue);
  colorShiftContainer.appendChild(colorShiftLabel);
  section.appendChild(colorShiftContainer);

  // Presets
  const presetsContainer = document.createElement('div');
  presetsContainer.className = 'hud-control';
  const presetsLabel = document.createElement('label');
  presetsLabel.textContent = 'Presets: ';
  presetsContainer.appendChild(presetsLabel);

  const presets = [
    {
      name: 'Smooth Flow',
      settings: { scale: 2.0, speed: 1.5, strength: 1.2, particleDensity: 1.0, timeScale: 0.5, colorShift: 0.0 }
    },
    {
      name: 'Chaotic Storm',
      settings: { scale: 8.0, speed: 3.0, strength: 2.5, particleDensity: 1.5, timeScale: 1.0, colorShift: 0.5 }
    },
    {
      name: 'Turbulent Vortex',
      settings: { scale: 5.0, speed: 2.5, strength: 3.0, particleDensity: 2.0, timeScale: 0.8, colorShift: 0.3 }
    },
    {
      name: 'Ethereal Drift',
      settings: { scale: 3.0, speed: 1.0, strength: 0.8, particleDensity: 1.2, timeScale: 0.3, colorShift: 0.7 }
    }
  ];

  presets.forEach(preset => {
    const button = document.createElement('button');
    button.textContent = preset.name;
    button.addEventListener('click', () => {
      state.flowField.scale = preset.settings.scale;
      state.flowField.speed = preset.settings.speed;
      state.flowField.strength = preset.settings.strength;
      state.flowField.particleDensity = preset.settings.particleDensity;
      state.flowField.timeScale = preset.settings.timeScale;
      state.flowField.colorShift = preset.settings.colorShift;

      scaleSlider.value = preset.settings.scale.toString();
      scaleValue.textContent = preset.settings.scale.toFixed(1);
      speedSlider.value = preset.settings.speed.toString();
      speedValue.textContent = preset.settings.speed.toFixed(1);
      strengthSlider.value = preset.settings.strength.toString();
      strengthValue.textContent = preset.settings.strength.toFixed(1);
      densitySlider.value = preset.settings.particleDensity.toString();
      densityValue.textContent = preset.settings.particleDensity.toFixed(1);
      timeScaleSlider.value = preset.settings.timeScale.toString();
      timeScaleValue.textContent = preset.settings.timeScale.toFixed(1);
      colorShiftSlider.value = preset.settings.colorShift.toString();
      colorShiftValue.textContent = preset.settings.colorShift.toFixed(2);
    });
    presetsContainer.appendChild(button);
  });

  section.appendChild(presetsContainer);
  container.appendChild(section);
}
