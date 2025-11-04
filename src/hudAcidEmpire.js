console.log("🎨 hudAcidEmpire.js loaded");

import { state } from './state.js';

/**
 * Phase 13.6.0: Acid Empire HUD section
 * Controls for the Acid Empire background shader system
 */
export function createAcidEmpireHudSection(container) {
  const section = document.createElement('div');
  section.className = 'hud-section acid-empire';

  // Title
  const title = document.createElement('h3');
  title.textContent = 'Acid Empire';
  section.appendChild(title);

  // Enable/Disable Toggle
  const enableLabel = document.createElement('label');
  enableLabel.style.display = 'block';
  enableLabel.style.marginBottom = '12px';
  enableLabel.style.fontWeight = 'bold';

  const enableCheckbox = document.createElement('input');
  enableCheckbox.type = 'checkbox';
  enableCheckbox.checked = state.acidEmpire?.enabled || false;
  enableCheckbox.addEventListener('change', () => {
    state.acidEmpire.enabled = enableCheckbox.checked;
    console.log(`🎨 Acid Empire: ${enableCheckbox.checked ? 'ENABLED' : 'DISABLED'}`);
  });

  enableLabel.appendChild(enableCheckbox);
  enableLabel.appendChild(document.createTextNode(' Enable Acid Empire'));
  section.appendChild(enableLabel);

  // Scroll Speed X
  const scrollXControl = createSliderControl(
    'Scroll Speed X',
    -0.05,
    0.05,
    0.001,
    state.acidEmpire?.scrollSpeedX || 0.0,
    (value) => {
      state.acidEmpire.scrollSpeedX = value;
    }
  );
  section.appendChild(scrollXControl);

  // Scroll Speed Y
  const scrollYControl = createSliderControl(
    'Scroll Speed Y',
    -0.05,
    0.05,
    0.001,
    state.acidEmpire?.scrollSpeedY || 0.0,
    (value) => {
      state.acidEmpire.scrollSpeedY = value;
    }
  );
  section.appendChild(scrollYControl);

  // Shape Morph (complexity)
  const morphControl = createSliderControl(
    'Shape Complexity',
    0.1,
    2.0,
    0.05,
    state.acidEmpire?.shapeMorph || 0.55,
    (value) => {
      state.acidEmpire.shapeMorph = value;
    }
  );
  section.appendChild(morphControl);

  // Color Shift (hue rotation)
  const colorShiftControl = createSliderControl(
    'Color Shift',
    0.0,
    1.0,
    0.01,
    state.acidEmpire?.colorShift || 0.0,
    (value) => {
      state.acidEmpire.colorShift = value;
    }
  );
  section.appendChild(colorShiftControl);

  // Color Drive (intensity)
  const colorDriveControl = createSliderControl(
    'Color Intensity',
    0.0,
    3.0,
    0.1,
    state.acidEmpire?.colorDrive || 1.0,
    (value) => {
      state.acidEmpire.colorDrive = value;
    }
  );
  section.appendChild(colorDriveControl);

  // Glitch Intensity
  const glitchControl = createSliderControl(
    'VHS Glitch',
    0.0,
    1.0,
    0.05,
    state.acidEmpire?.glitchIntensity || 0.0,
    (value) => {
      state.acidEmpire.glitchIntensity = value;
    }
  );
  section.appendChild(glitchControl);

  // Portal Warp
  const portalControl = createSliderControl(
    'Portal Warp',
    0.0,
    1.0,
    0.05,
    state.acidEmpire?.portalWarp || 0.0,
    (value) => {
      state.acidEmpire.portalWarp = value;
    }
  );
  section.appendChild(portalControl);

  // Sphere Scale
  const sphereControl = createSliderControl(
    'Sphere Shrink',
    0.1,
    1.0,
    0.05,
    state.acidEmpire?.sphereScale || 1.0,
    (value) => {
      state.acidEmpire.sphereScale = value;
    }
  );
  section.appendChild(sphereControl);

  // Bass Intensity (sensitivity)
  const bassControl = createSliderControl(
    'Bass Sensitivity',
    0.0,
    3.0,
    0.1,
    state.acidEmpire?.bassIntensity || 1.0,
    (value) => {
      state.acidEmpire.bassIntensity = value;
    }
  );
  section.appendChild(bassControl);

  // === AUDIO REACTIVITY SECTION ===
  const audioSection = document.createElement('div');
  audioSection.style.cssText = `
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  `;

  const audioTitle = document.createElement('h4');
  audioTitle.textContent = '🎵 Audio Reactivity';
  audioTitle.style.cssText = `
    font-size: 14px;
    margin-bottom: 10px;
    color: #FFD700;
  `;
  audioSection.appendChild(audioTitle);

  // Audio Sphere Shrink Enable
  const audioSphereLabel = document.createElement('label');
  audioSphereLabel.style.display = 'block';
  audioSphereLabel.style.marginBottom = '12px';
  audioSphereLabel.style.fontWeight = 'bold';

  const audioSphereCheckbox = document.createElement('input');
  audioSphereCheckbox.type = 'checkbox';
  audioSphereCheckbox.checked = state.acidEmpire?.audioSphereEnabled !== false; // Default true
  audioSphereCheckbox.addEventListener('change', () => {
    state.acidEmpire.audioSphereEnabled = audioSphereCheckbox.checked;
    console.log(`🎵 Audio Sphere Shrink: ${audioSphereCheckbox.checked ? 'ENABLED' : 'DISABLED'}`);
  });

  audioSphereLabel.appendChild(audioSphereCheckbox);
  audioSphereLabel.appendChild(document.createTextNode(' Audio Sphere Shrink'));
  audioSection.appendChild(audioSphereLabel);

  // Audio Sphere Amount
  const audioSphereAmountControl = createSliderControl(
    'Sphere Shrink Amount',
    0.0,
    1.0,
    0.05,
    state.acidEmpire?.audioSphereAmount || 0.3,
    (value) => {
      state.acidEmpire.audioSphereAmount = value;
    }
  );
  audioSection.appendChild(audioSphereAmountControl);

  // Audio Sphere Smoothing
  const audioSphereSmoothing = createSliderControl(
    'Sphere Smoothing',
    0.0,
    0.95,
    0.05,
    state.acidEmpire?.audioSphereSmoothing || 0.7,
    (value) => {
      state.acidEmpire.audioSphereSmoothing = value;
    }
  );
  audioSection.appendChild(audioSphereSmoothing);

  // Audio Color Amount
  const audioColorAmountControl = createSliderControl(
    'Frequency Color Amount',
    0.0,
    2.0,
    0.1,
    state.acidEmpire?.audioColorAmount || 0.5,
    (value) => {
      state.acidEmpire.audioColorAmount = value;
    }
  );
  audioSection.appendChild(audioColorAmountControl);

  // Audio Color Smoothing
  const audioColorSmoothing = createSliderControl(
    'Color Smoothing (melody tracking)',
    0.0,
    0.95,
    0.05,
    state.acidEmpire?.audioColorSmoothing || 0.85,
    (value) => {
      state.acidEmpire.audioColorSmoothing = value;
    }
  );
  audioSection.appendChild(audioColorSmoothing);

  // Help text
  const helpText = document.createElement('div');
  helpText.style.cssText = `
    font-size: 10px;
    opacity: 0.6;
    margin-top: 12px;
    line-height: 1.4;
    font-style: italic;
  `;
  helpText.innerHTML = `
    <div><strong>💡 Audio Reactivity Tips:</strong></div>
    <div>• High smoothing (0.8-0.95) = smooth melody tracking</div>
    <div>• Low smoothing (0.0-0.5) = fast, flashy response</div>
    <div>• Color shifts: low freq = dark, high freq = bright</div>
    <div>• Sphere shrinks with overall audio level</div>
  `;
  audioSection.appendChild(helpText);

  section.appendChild(audioSection);

  container.appendChild(section);
  console.log("🎨 Acid Empire HUD section created with audio reactivity");
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

console.log("🎨 hudAcidEmpire.js ready");
