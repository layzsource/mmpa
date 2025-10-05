console.log("🚢 hudVessel.js loaded");

/**
 * Phase 11.7.50: Modular Vessel HUD Section
 * Extracted from hud.js to reduce monolithic HUD file
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
    valueDisplay.textContent = value.toFixed(step >= 1 ? 0 : (step < 0.01 ? 4 : 2));
    onChange(value);
  });

  container.appendChild(label);
  label.appendChild(valueDisplay);
  container.appendChild(slider);

  return container;
}

function createColorPickerControl(labelText, defaultValue, onChange) {
  const { container, label } = createControl(labelText);

  const picker = document.createElement('input');
  picker.type = 'color';
  picker.value = defaultValue;
  picker.style.cssText = 'margin-left: 10px; cursor: pointer;';
  picker.addEventListener('input', (e) => onChange(e.target.value));

  container.appendChild(label);
  label.appendChild(picker);

  return container;
}

function createDropdownControl(labelText, defaultValue, options, onChange) {
  const { container, label } = createControl(labelText);

  const select = document.createElement('select');
  select.style.cssText = 'width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555;';

  // Add ID for vessel layout dropdown (for MIDI integration)
  if (labelText === 'Vessel Layout') {
    select.id = 'vessel-layout-dropdown';
  }

  options.forEach(option => {
    const optionEl = document.createElement('option');
    optionEl.value = option;
    optionEl.textContent = option;
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
 * Creates the Vessel HUD section with all controls
 * @param {HTMLElement} parentContainer - The parent container to append to
 * @param {Function} notifyHUDUpdate - Callback to notify HUD changes
 */
export function createVesselHudSection(parentContainer, notifyHUDUpdate) {
  console.log("🚢 Creating Vessel HUD section");

  // Section separator
  const separator = document.createElement('hr');
  separator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  parentContainer.appendChild(separator);

  // Section title
  const title = document.createElement('h4');
  title.textContent = '🚢 Vessel';
  title.style.cssText = 'margin: 0 0 10px 0; color: #00ff00; font-size: 12px;';
  parentContainer.appendChild(title);

  // Vessel enable toggle
  const enableControl = createToggleControl('Enable Vessel', true, (value) => {
    notifyHUDUpdate({ vesselEnabled: value });
  });
  parentContainer.appendChild(enableControl);

  // Vessel mode dropdown (Phase 2.x)
  const modeControl = createDropdownControl('Vessel Mode', 'gyre',
    ['gyre', 'conflat6'], (value) => {
    notifyHUDUpdate({ vesselMode: value });
  });
  modeControl.title = 'Switch between Gyre (torus rings) and Conflat 6 (cube-sphere circles)';
  parentContainer.appendChild(modeControl);

  // Vessel opacity slider
  const opacityControl = createSliderControl('Vessel Opacity', 0.5, 0.0, 1.0, 0.01, (value) => {
    notifyHUDUpdate({ vesselOpacity: value });
  });
  parentContainer.appendChild(opacityControl);

  // Vessel scale slider
  const scaleControl = createSliderControl('Vessel Scale', 1.0, 0.5, 2.0, 0.1, (value) => {
    notifyHUDUpdate({ vesselScale: value });
  });
  parentContainer.appendChild(scaleControl);

  // Vessel color picker
  const colorControl = createColorPickerControl('Vessel Color', '#00ff00', (value) => {
    notifyHUDUpdate({ vesselColor: value });
  });
  parentContainer.appendChild(colorControl);

  // Vessel spin toggle
  const spinControl = createToggleControl('Vessel Spin', false, (value) => {
    notifyHUDUpdate({ vesselSpinEnabled: value });
  });
  parentContainer.appendChild(spinControl);

  // Vessel spin speed slider
  const spinSpeedControl = createSliderControl('Spin Speed', 0.0035, 0, 0.02, 0.0005, (value) => {
    notifyHUDUpdate({ vesselSpinSpeed: value });
  });
  parentContainer.appendChild(spinSpeedControl);

  // Vessel layout dropdown
  const layoutControl = createDropdownControl('Vessel Layout', 'lattice',
    ['lattice', 'hoops', 'shells'], (value) => {
    notifyHUDUpdate({ vesselLayout: value });
  });
  parentContainer.appendChild(layoutControl);

  // Audio smoothing slider
  const audioSmoothingControl = createSliderControl('Audio Smoothing', 0.7, 0.1, 0.9, 0.05, (value) => {
    notifyHUDUpdate({ vesselAudioSmoothing: value });
  });
  parentContainer.appendChild(audioSmoothingControl);

  // Hue shift range slider
  const hueShiftControl = createSliderControl('Hue Shift Range', 20, 0, 60, 5, (value) => {
    notifyHUDUpdate({ vesselHueShiftRange: value });
  });
  parentContainer.appendChild(hueShiftControl);

  // Phase 12.0: Compass Rings Visibility toggle (hidden by default)
  const compassRingsControl = createToggleControl('Show Compass Rings', false, (value) => {
    notifyHUDUpdate({ vesselVisible: value });
  });
  compassRingsControl.title = 'Show/hide 6 color-coded compass rings (N/S/E/W/Up/Down)';
  parentContainer.appendChild(compassRingsControl);

  // Vessel debug display
  const debugDiv = document.createElement('div');
  debugDiv.style.cssText = 'margin-top: 15px; font-size: 12px; color: #888;';
  debugDiv.innerHTML = '<p id="vessel-debug">Radius: --</p>';
  parentContainer.appendChild(debugDiv);

  console.log("🚢 Vessel HUD section created");
}

// Phase 13.4.2: Removed registerHUDCallback to fix circular dependency
