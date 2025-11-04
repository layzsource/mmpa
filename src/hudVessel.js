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

  // Vessel mode dropdown (Phase 2.x / 13.7.1)
  const modeControl = createDropdownControl('Vessel Mode', 'gyre',
    ['gyre', 'conflat6', 'conflat6cube', 'conflat6hdr'], (value) => {
    notifyHUDUpdate({ vesselMode: value });
  });
  modeControl.title = 'Switch between Gyre (torus rings), Conflat 6 (circular panels), Conflat 6 Cube (square panels), and Conflat-6 HDR (raymarched volumetric with PBR lighting)';
  parentContainer.appendChild(modeControl);

  // Phase 13.7.2: Conflat-6 HDR Texture Selection
  const textureControl = createDropdownControl('HDR Texture', 'none',
    ['none', 'metallic', 'custom'], (value) => {
    notifyHUDUpdate({ vesselHDRTexture: value });
  });
  textureControl.title = 'Select texture for Conflat-6 HDR mode (metallic = voxel cube style)';
  parentContainer.appendChild(textureControl);

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

  // Vessel spin speed sliders (X, Y, Z axes)
  const spinSpeedXControl = createSliderControl('Spin Speed X', 0.0, -0.02, 0.02, 0.0005, (value) => {
    notifyHUDUpdate({ vesselSpinSpeedX: value });
  });
  parentContainer.appendChild(spinSpeedXControl);

  const spinSpeedYControl = createSliderControl('Spin Speed Y', 0.0, -0.02, 0.02, 0.0005, (value) => {
    notifyHUDUpdate({ vesselSpinSpeedY: value });
  });
  parentContainer.appendChild(spinSpeedYControl);

  const spinSpeedZControl = createSliderControl('Spin Speed Z', 0.0, -0.02, 0.02, 0.0005, (value) => {
    notifyHUDUpdate({ vesselSpinSpeedZ: value });
  });
  parentContainer.appendChild(spinSpeedZControl);

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

  // Phase 13.2.0: Panel Audio Reactivity toggle
  const panelAudioControl = createToggleControl('Panel Audio Reactive', false, (value) => {
    notifyHUDUpdate({ vesselPanelAudioReactive: value });
  });
  panelAudioControl.title = 'Make panels pulse/scale with audio (conflat6/conflat6cube only)';
  parentContainer.appendChild(panelAudioControl);

  // Conflat 6 Panel Upload Section
  const conflat6Section = document.createElement('div');
  conflat6Section.id = 'conflat6-panel-uploads';
  conflat6Section.style.cssText = 'margin-top: 15px; padding: 10px; background: rgba(0,100,100,0.1); border: 1px solid #0ff; border-radius: 4px;';

  const conflat6Title = document.createElement('h5');
  conflat6Title.textContent = '📦 Conflat 6 Panel Media';
  conflat6Title.style.cssText = 'margin: 0 0 10px 0; color: #0ff; font-size: 11px;';
  conflat6Section.appendChild(conflat6Title);

  const directions = ['North', 'South', 'East', 'West', 'Up', 'Down'];
  const colors = ['#00ffff', '#ff00ff', '#ff0000', '#00ff00', '#0000ff', '#ffff00'];

  directions.forEach((dir, idx) => {
    const panelControl = document.createElement('div');
    panelControl.style.cssText = 'margin-bottom: 8px; padding: 5px; background: rgba(0,0,0,0.3); border-radius: 3px;';

    const panelLabel = document.createElement('div');
    panelLabel.textContent = `${dir}`;
    panelLabel.style.cssText = `color: ${colors[idx]}; font-weight: bold; margin-bottom: 3px; font-size: 10px;`;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*';
    fileInput.style.cssText = 'font-size: 9px; width: 100%;';
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        const { uploadPanelMedia } = await import('./vessel.js');
        uploadPanelMedia(dir, file);
      }
    });

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear';
    clearBtn.style.cssText = 'margin-top: 3px; padding: 2px 8px; font-size: 9px; background: #333; color: #ff5555; border: 1px solid #555; cursor: pointer;';
    clearBtn.addEventListener('click', async () => {
      const { clearPanelMedia } = await import('./vessel.js');
      clearPanelMedia(dir);
      fileInput.value = '';
    });

    panelControl.appendChild(panelLabel);
    panelControl.appendChild(fileInput);
    panelControl.appendChild(clearBtn);
    conflat6Section.appendChild(panelControl);
  });

  parentContainer.appendChild(conflat6Section);

  // Vessel debug display
  const debugDiv = document.createElement('div');
  debugDiv.style.cssText = 'margin-top: 15px; font-size: 12px; color: #888;';
  debugDiv.innerHTML = '<p id="vessel-debug">Radius: --</p>';
  parentContainer.appendChild(debugDiv);

  console.log("🚢 Vessel HUD section created");
}

// Phase 13.4.2: Removed registerHUDCallback to fix circular dependency
