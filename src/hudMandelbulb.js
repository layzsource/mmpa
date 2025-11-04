import { state } from './state.js';

export function createMandelbulbHudSection(container) {
  // Initialize state
  if (!state.mandelbulb) {
    state.mandelbulb = {
      enabled: false,
      power: 8.0,
      iterations: 16.0,
      palette: 0.0,
      shellThickness: 0.02,
      colorShift: 0.0
    };
  }

  const section = document.createElement('div');
  section.className = 'hud-section';

  const title = document.createElement('h3');
  title.textContent = 'Mandelbulb Voxel Core';
  section.appendChild(title);

  // Enable toggle
  const enableContainer = document.createElement('div');
  enableContainer.className = 'hud-control';
  const enableLabel = document.createElement('label');
  enableLabel.textContent = 'Enable: ';
  const enableCheckbox = document.createElement('input');
  enableCheckbox.type = 'checkbox';
  enableCheckbox.checked = state.mandelbulb.enabled;
  enableCheckbox.addEventListener('change', (e) => {
    state.mandelbulb.enabled = e.target.checked;
  });
  enableLabel.appendChild(enableCheckbox);
  enableContainer.appendChild(enableLabel);
  section.appendChild(enableContainer);

  // Power slider (Mandelbulb exponent)
  const powerContainer = document.createElement('div');
  powerContainer.className = 'hud-control';
  const powerLabel = document.createElement('label');
  powerLabel.textContent = 'Power (Exponent): ';
  const powerSlider = document.createElement('input');
  powerSlider.type = 'range';
  powerSlider.min = '2';
  powerSlider.max = '16';
  powerSlider.step = '0.5';
  powerSlider.value = state.mandelbulb.power.toString();
  const powerValue = document.createElement('span');
  powerValue.textContent = state.mandelbulb.power.toFixed(1);
  powerSlider.addEventListener('input', (e) => {
    state.mandelbulb.power = parseFloat(e.target.value);
    powerValue.textContent = state.mandelbulb.power.toFixed(1);
  });
  powerLabel.appendChild(powerSlider);
  powerLabel.appendChild(powerValue);
  powerContainer.appendChild(powerLabel);
  section.appendChild(powerContainer);

  // Iterations slider
  const iterContainer = document.createElement('div');
  iterContainer.className = 'hud-control';
  const iterLabel = document.createElement('label');
  iterLabel.textContent = 'Iterations: ';
  const iterSlider = document.createElement('input');
  iterSlider.type = 'range';
  iterSlider.min = '5';
  iterSlider.max = '50';
  iterSlider.step = '1';
  iterSlider.value = state.mandelbulb.iterations.toString();
  const iterValue = document.createElement('span');
  iterValue.textContent = state.mandelbulb.iterations.toFixed(0);
  iterSlider.addEventListener('input', (e) => {
    state.mandelbulb.iterations = parseFloat(e.target.value);
    iterValue.textContent = state.mandelbulb.iterations.toFixed(0);
  });
  iterLabel.appendChild(iterSlider);
  iterLabel.appendChild(iterValue);
  iterContainer.appendChild(iterLabel);
  section.appendChild(iterContainer);

  // Palette selector
  const paletteContainer = document.createElement('div');
  paletteContainer.className = 'hud-control';
  const paletteLabel = document.createElement('label');
  paletteLabel.textContent = 'Color Palette: ';
  const paletteSelect = document.createElement('select');
  paletteSelect.innerHTML = `
    <option value="0">Fiery (Red/Orange/Yellow)</option>
    <option value="1">Icy Blue (Cyan/Blue/Purple)</option>
    <option value="2">Psychedelic (Full Rainbow)</option>
    <option value="3">Grayscale</option>
  `;
  paletteSelect.value = state.mandelbulb.palette.toString();
  paletteSelect.addEventListener('change', (e) => {
    state.mandelbulb.palette = parseFloat(e.target.value);
  });
  paletteLabel.appendChild(paletteSelect);
  paletteContainer.appendChild(paletteLabel);
  section.appendChild(paletteContainer);

  // Shell Thickness slider
  const shellContainer = document.createElement('div');
  shellContainer.className = 'hud-control';
  const shellLabel = document.createElement('label');
  shellLabel.textContent = 'Shell Thickness: ';
  const shellSlider = document.createElement('input');
  shellSlider.type = 'range';
  shellSlider.min = '0.005';
  shellSlider.max = '0.06';
  shellSlider.step = '0.001';
  shellSlider.value = state.mandelbulb.shellThickness.toString();
  const shellValue = document.createElement('span');
  shellValue.textContent = state.mandelbulb.shellThickness.toFixed(3);
  shellSlider.addEventListener('input', (e) => {
    state.mandelbulb.shellThickness = parseFloat(e.target.value);
    shellValue.textContent = state.mandelbulb.shellThickness.toFixed(3);
  });
  shellLabel.appendChild(shellSlider);
  shellLabel.appendChild(shellValue);
  shellContainer.appendChild(shellLabel);
  section.appendChild(shellContainer);

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
  colorShiftSlider.value = state.mandelbulb.colorShift.toString();
  const colorShiftValue = document.createElement('span');
  colorShiftValue.textContent = state.mandelbulb.colorShift.toFixed(2);
  colorShiftSlider.addEventListener('input', (e) => {
    state.mandelbulb.colorShift = parseFloat(e.target.value);
    colorShiftValue.textContent = state.mandelbulb.colorShift.toFixed(2);
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
  section.appendChild(presetsContainer);

  const presets = [
    {
      name: 'Classic Bulb',
      settings: { power: 8.0, iterations: 16, palette: 0, shellThickness: 0.02, colorShift: 0.0 }
    },
    {
      name: 'High Detail',
      settings: { power: 9.0, iterations: 32, palette: 1, shellThickness: 0.015, colorShift: 0.3 }
    },
    {
      name: 'Psychedelic Dream',
      settings: { power: 7.0, iterations: 20, palette: 2, shellThickness: 0.03, colorShift: 0.5 }
    },
    {
      name: 'Thin Glass',
      settings: { power: 10.0, iterations: 24, palette: 1, shellThickness: 0.008, colorShift: 0.2 }
    },
    {
      name: 'Spiky Chaos',
      settings: { power: 12.0, iterations: 16, palette: 0, shellThickness: 0.025, colorShift: 0.7 }
    }
  ];

  const presetButtonsContainer = document.createElement('div');
  presetButtonsContainer.style.display = 'flex';
  presetButtonsContainer.style.flexWrap = 'wrap';
  presetButtonsContainer.style.gap = '5px';
  presetButtonsContainer.style.marginTop = '5px';

  presets.forEach(preset => {
    const button = document.createElement('button');
    button.textContent = preset.name;
    button.style.flex = '1 1 45%';
    button.style.padding = '5px';
    button.style.fontSize = '11px';
    button.addEventListener('click', () => {
      Object.assign(state.mandelbulb, preset.settings);
      // Update UI elements
      powerSlider.value = preset.settings.power.toString();
      powerValue.textContent = preset.settings.power.toFixed(1);
      iterSlider.value = preset.settings.iterations.toString();
      iterValue.textContent = preset.settings.iterations.toFixed(0);
      paletteSelect.value = preset.settings.palette.toString();
      shellSlider.value = preset.settings.shellThickness.toString();
      shellValue.textContent = preset.settings.shellThickness.toFixed(3);
      colorShiftSlider.value = preset.settings.colorShift.toString();
      colorShiftValue.textContent = preset.settings.colorShift.toFixed(2);
    });
    presetButtonsContainer.appendChild(button);
  });

  presetsContainer.appendChild(presetsLabel);
  presetsContainer.appendChild(presetButtonsContainer);

  // Info text
  const infoText = document.createElement('div');
  infoText.style.fontSize = '11px';
  infoText.style.color = '#888';
  infoText.style.marginTop = '10px';
  infoText.style.lineHeight = '1.4';
  infoText.innerHTML = `
    <strong>3D Fractal Raymarching</strong><br>
    • Audio-reactive: Bass affects power, mid affects camera distance, treble affects shell thickness<br>
    • Glass shells create infinite grid cells<br>
    • Higher iterations = more detail (but slower)
  `;
  section.appendChild(infoText);

  container.appendChild(section);
}

console.log('🌀 Mandelbulb HUD module loaded');
