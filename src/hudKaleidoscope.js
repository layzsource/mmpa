import { state } from './state.js';

export function createKaleidoscopeHudSection(container) {
  // Initialize state
  if (!state.kaleidoscope) {
    state.kaleidoscope = {
      enabled: false,
      segments: 8.0,
      rotation: 0.0,
      zoom: 1.0,
      colorShift: 0.0,
      centerX: 0.5,
      centerY: 0.5
    };
  }

  const section = document.createElement('div');
  section.className = 'hud-section';

  const title = document.createElement('h3');
  title.textContent = 'Kaleidoscope';
  section.appendChild(title);

  // Enable toggle
  const enableContainer = document.createElement('div');
  enableContainer.className = 'hud-control';
  const enableLabel = document.createElement('label');
  enableLabel.textContent = 'Enable: ';
  const enableCheckbox = document.createElement('input');
  enableCheckbox.type = 'checkbox';
  enableCheckbox.checked = state.kaleidoscope.enabled;
  enableCheckbox.addEventListener('change', (e) => {
    state.kaleidoscope.enabled = e.target.checked;
  });
  enableLabel.appendChild(enableCheckbox);
  enableContainer.appendChild(enableLabel);
  section.appendChild(enableContainer);

  // Segments slider
  const segmentsContainer = document.createElement('div');
  segmentsContainer.className = 'hud-control';
  const segmentsLabel = document.createElement('label');
  segmentsLabel.textContent = 'Segments: ';
  const segmentsSlider = document.createElement('input');
  segmentsSlider.type = 'range';
  segmentsSlider.min = '2';
  segmentsSlider.max = '32';
  segmentsSlider.step = '1';
  segmentsSlider.value = state.kaleidoscope.segments.toString();
  const segmentsValue = document.createElement('span');
  segmentsValue.textContent = state.kaleidoscope.segments.toFixed(0);
  segmentsSlider.addEventListener('input', (e) => {
    state.kaleidoscope.segments = parseFloat(e.target.value);
    segmentsValue.textContent = state.kaleidoscope.segments.toFixed(0);
  });
  segmentsLabel.appendChild(segmentsSlider);
  segmentsLabel.appendChild(segmentsValue);
  segmentsContainer.appendChild(segmentsLabel);
  section.appendChild(segmentsContainer);

  // Rotation slider
  const rotationContainer = document.createElement('div');
  rotationContainer.className = 'hud-control';
  const rotationLabel = document.createElement('label');
  rotationLabel.textContent = 'Rotation: ';
  const rotationSlider = document.createElement('input');
  rotationSlider.type = 'range';
  rotationSlider.min = '0';
  rotationSlider.max = '6.28';
  rotationSlider.step = '0.01';
  rotationSlider.value = state.kaleidoscope.rotation.toString();
  const rotationValue = document.createElement('span');
  rotationValue.textContent = state.kaleidoscope.rotation.toFixed(2);
  rotationSlider.addEventListener('input', (e) => {
    state.kaleidoscope.rotation = parseFloat(e.target.value);
    rotationValue.textContent = state.kaleidoscope.rotation.toFixed(2);
  });
  rotationLabel.appendChild(rotationSlider);
  rotationLabel.appendChild(rotationValue);
  rotationContainer.appendChild(rotationLabel);
  section.appendChild(rotationContainer);

  // Zoom slider
  const zoomContainer = document.createElement('div');
  zoomContainer.className = 'hud-control';
  const zoomLabel = document.createElement('label');
  zoomLabel.textContent = 'Zoom: ';
  const zoomSlider = document.createElement('input');
  zoomSlider.type = 'range';
  zoomSlider.min = '0.1';
  zoomSlider.max = '5.0';
  zoomSlider.step = '0.1';
  zoomSlider.value = state.kaleidoscope.zoom.toString();
  const zoomValue = document.createElement('span');
  zoomValue.textContent = state.kaleidoscope.zoom.toFixed(1);
  zoomSlider.addEventListener('input', (e) => {
    state.kaleidoscope.zoom = parseFloat(e.target.value);
    zoomValue.textContent = state.kaleidoscope.zoom.toFixed(1);
  });
  zoomLabel.appendChild(zoomSlider);
  zoomLabel.appendChild(zoomValue);
  zoomContainer.appendChild(zoomLabel);
  section.appendChild(zoomContainer);

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
  colorShiftSlider.value = state.kaleidoscope.colorShift.toString();
  const colorShiftValue = document.createElement('span');
  colorShiftValue.textContent = state.kaleidoscope.colorShift.toFixed(2);
  colorShiftSlider.addEventListener('input', (e) => {
    state.kaleidoscope.colorShift = parseFloat(e.target.value);
    colorShiftValue.textContent = state.kaleidoscope.colorShift.toFixed(2);
  });
  colorShiftLabel.appendChild(colorShiftSlider);
  colorShiftLabel.appendChild(colorShiftValue);
  colorShiftContainer.appendChild(colorShiftLabel);
  section.appendChild(colorShiftContainer);

  // Center X slider
  const centerXContainer = document.createElement('div');
  centerXContainer.className = 'hud-control';
  const centerXLabel = document.createElement('label');
  centerXLabel.textContent = 'Center X: ';
  const centerXSlider = document.createElement('input');
  centerXSlider.type = 'range';
  centerXSlider.min = '0';
  centerXSlider.max = '1';
  centerXSlider.step = '0.01';
  centerXSlider.value = state.kaleidoscope.centerX.toString();
  const centerXValue = document.createElement('span');
  centerXValue.textContent = state.kaleidoscope.centerX.toFixed(2);
  centerXSlider.addEventListener('input', (e) => {
    state.kaleidoscope.centerX = parseFloat(e.target.value);
    centerXValue.textContent = state.kaleidoscope.centerX.toFixed(2);
  });
  centerXLabel.appendChild(centerXSlider);
  centerXLabel.appendChild(centerXValue);
  centerXContainer.appendChild(centerXLabel);
  section.appendChild(centerXContainer);

  // Center Y slider
  const centerYContainer = document.createElement('div');
  centerYContainer.className = 'hud-control';
  const centerYLabel = document.createElement('label');
  centerYLabel.textContent = 'Center Y: ';
  const centerYSlider = document.createElement('input');
  centerYSlider.type = 'range';
  centerYSlider.min = '0';
  centerYSlider.max = '1';
  centerYSlider.step = '0.01';
  centerYSlider.value = state.kaleidoscope.centerY.toString();
  const centerYValue = document.createElement('span');
  centerYValue.textContent = state.kaleidoscope.centerY.toFixed(2);
  centerYSlider.addEventListener('input', (e) => {
    state.kaleidoscope.centerY = parseFloat(e.target.value);
    centerYValue.textContent = state.kaleidoscope.centerY.toFixed(2);
  });
  centerYLabel.appendChild(centerYSlider);
  centerYLabel.appendChild(centerYValue);
  centerYContainer.appendChild(centerYLabel);
  section.appendChild(centerYContainer);

  // Presets
  const presetsContainer = document.createElement('div');
  presetsContainer.className = 'hud-control';
  const presetsLabel = document.createElement('label');
  presetsLabel.textContent = 'Presets: ';
  presetsContainer.appendChild(presetsLabel);

  const presets = [
    {
      name: '4-Way Mirror',
      settings: { segments: 4, rotation: 0.0, zoom: 1.0, colorShift: 0.0, centerX: 0.5, centerY: 0.5 }
    },
    {
      name: '6-Point Star',
      settings: { segments: 6, rotation: 0.0, zoom: 1.2, colorShift: 0.3, centerX: 0.5, centerY: 0.5 }
    },
    {
      name: '8-Fold Mandala',
      settings: { segments: 8, rotation: 0.785, zoom: 1.5, colorShift: 0.5, centerX: 0.5, centerY: 0.5 }
    },
    {
      name: '12-Point Flower',
      settings: { segments: 12, rotation: 0.0, zoom: 2.0, colorShift: 0.7, centerX: 0.5, centerY: 0.5 }
    }
  ];

  presets.forEach(preset => {
    const button = document.createElement('button');
    button.textContent = preset.name;
    button.addEventListener('click', () => {
      state.kaleidoscope.segments = preset.settings.segments;
      state.kaleidoscope.rotation = preset.settings.rotation;
      state.kaleidoscope.zoom = preset.settings.zoom;
      state.kaleidoscope.colorShift = preset.settings.colorShift;
      state.kaleidoscope.centerX = preset.settings.centerX;
      state.kaleidoscope.centerY = preset.settings.centerY;

      segmentsSlider.value = preset.settings.segments.toString();
      segmentsValue.textContent = preset.settings.segments.toFixed(0);
      rotationSlider.value = preset.settings.rotation.toString();
      rotationValue.textContent = preset.settings.rotation.toFixed(2);
      zoomSlider.value = preset.settings.zoom.toString();
      zoomValue.textContent = preset.settings.zoom.toFixed(1);
      colorShiftSlider.value = preset.settings.colorShift.toString();
      colorShiftValue.textContent = preset.settings.colorShift.toFixed(2);
      centerXSlider.value = preset.settings.centerX.toString();
      centerXValue.textContent = preset.settings.centerX.toFixed(2);
      centerYSlider.value = preset.settings.centerY.toString();
      centerYValue.textContent = preset.settings.centerY.toFixed(2);
    });
    presetsContainer.appendChild(button);
  });

  section.appendChild(presetsContainer);
  container.appendChild(section);
}
