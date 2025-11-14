console.log("✨ hudLuminousTessellation.js loaded");

import { state } from './state.js';

/**
 * Luminous Tessellation HUD section
 * Controls for the HDR Voronoi tessellation shader system
 */
export function createLuminousTessellationHudSection(container) {
  const section = document.createElement('div');
  section.className = 'hud-section luminous-tessellation';

  // Title
  const title = document.createElement('h3');
  title.textContent = '✨ Luminous Tessellation';
  section.appendChild(title);

  // Description
  const description = document.createElement('p');
  description.textContent = '4K HDR geometric patterns with Voronoi tessellation';
  description.style.cssText = `
    font-size: 11px;
    opacity: 0.7;
    margin-bottom: 12px;
    font-style: italic;
  `;
  section.appendChild(description);

  // Enable/Disable Toggle
  const enableLabel = document.createElement('label');
  enableLabel.style.display = 'block';
  enableLabel.style.marginBottom = '12px';
  enableLabel.style.fontWeight = 'bold';

  const enableCheckbox = document.createElement('input');
  enableCheckbox.type = 'checkbox';
  enableCheckbox.checked = state.luminousTessellation?.enabled || false;
  enableCheckbox.addEventListener('change', () => {
    state.luminousTessellation.enabled = enableCheckbox.checked;
    console.log(`✨ Luminous Tessellation: ${enableCheckbox.checked ? 'ENABLED' : 'DISABLED'}`);
  });

  enableLabel.appendChild(enableCheckbox);
  enableLabel.appendChild(document.createTextNode(' Enable Luminous Tessellation'));
  section.appendChild(enableLabel);

  // Pattern Scale
  const scaleControl = createSliderControl(
    'Pattern Scale',
    1.0,
    10.0,
    0.5,
    state.luminousTessellation?.scale || 3.0,
    (value) => {
      state.luminousTessellation.scale = value;
    }
  );
  section.appendChild(scaleControl);

  // Animation Speed
  const speedControl = createSliderControl(
    'Animation Speed',
    0.1,
    2.0,
    0.1,
    state.luminousTessellation?.speed || 0.5,
    (value) => {
      state.luminousTessellation.speed = value;
    }
  );
  section.appendChild(speedControl);

  // Complexity
  const complexityControl = createSliderControl(
    'Complexity',
    0.0,
    1.0,
    0.05,
    state.luminousTessellation?.complexity || 0.5,
    (value) => {
      state.luminousTessellation.complexity = value;
    }
  );
  section.appendChild(complexityControl);

  // Color Shift
  const colorShiftControl = createSliderControl(
    'Color Shift',
    0.0,
    1.0,
    0.01,
    state.luminousTessellation?.colorShift || 0.0,
    (value) => {
      state.luminousTessellation.colorShift = value;
    }
  );
  section.appendChild(colorShiftControl);

  // Luminosity (HDR Brightness)
  const luminosityControl = createSliderControl(
    'HDR Luminosity',
    0.5,
    3.0,
    0.1,
    state.luminousTessellation?.luminosity || 1.5,
    (value) => {
      state.luminousTessellation.luminosity = value;
    }
  );
  section.appendChild(luminosityControl);

  // Contrast
  const contrastControl = createSliderControl(
    'Contrast',
    0.5,
    2.0,
    0.1,
    state.luminousTessellation?.contrast || 1.2,
    (value) => {
      state.luminousTessellation.contrast = value;
    }
  );
  section.appendChild(contrastControl);

  // Audio Intensity
  const audioIntensityControl = createSliderControl(
    'Audio Reactivity',
    0.0,
    3.0,
    0.1,
    state.luminousTessellation?.audioIntensity || 1.0,
    (value) => {
      state.luminousTessellation.audioIntensity = value;
    }
  );
  section.appendChild(audioIntensityControl);

  // Wave Amplitude
  const waveAmplitudeControl = createSliderControl(
    'Wave Depth',
    0.0,
    2.0,
    0.1,
    state.luminousTessellation?.waveAmplitude || 0.0,
    (value) => {
      state.luminousTessellation.waveAmplitude = value;
    }
  );
  section.appendChild(waveAmplitudeControl);

  // Wave Frequency
  const waveFrequencyControl = createSliderControl(
    'Wave Frequency',
    0.5,
    5.0,
    0.1,
    state.luminousTessellation?.waveFrequency || 2.0,
    (value) => {
      state.luminousTessellation.waveFrequency = value;
    }
  );
  section.appendChild(waveFrequencyControl);

  // Morph Intensity
  const morphIntensityControl = createSliderControl(
    'Geometry Morph',
    0.0,
    1.0,
    0.05,
    state.luminousTessellation?.morphIntensity || 0.0,
    (value) => {
      state.luminousTessellation.morphIntensity = value;
    }
  );
  section.appendChild(morphIntensityControl);

  // === FEATURE HIGHLIGHTS ===
  const highlightsSection = document.createElement('div');
  highlightsSection.style.cssText = `
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  `;

  const highlightsTitle = document.createElement('h4');
  highlightsTitle.textContent = '💎 Features';
  highlightsTitle.style.cssText = `
    font-size: 12px;
    margin-bottom: 8px;
    color: #FFD700;
  `;
  highlightsSection.appendChild(highlightsTitle);

  const featuresList = document.createElement('div');
  featuresList.style.cssText = `
    font-size: 10px;
    opacity: 0.7;
    line-height: 1.6;
  `;
  featuresList.innerHTML = `
    <div>• <strong>Multi-layer Voronoi tessellation</strong></div>
    <div>• <strong>HDR color gradients</strong> with deep saturation</div>
    <div>• <strong>Geometric edge glow</strong> (bloom effect)</div>
    <div>• <strong>Audio-reactive patterns</strong></div>
    <div>• <strong>Smooth organic animations</strong></div>
    <div>• <strong>Optimized for M3 Mac</strong> performance</div>
  `;
  highlightsSection.appendChild(featuresList);

  section.appendChild(highlightsSection);

  // === TIPS ===
  const tipsSection = document.createElement('div');
  tipsSection.style.cssText = `
    margin-top: 15px;
    padding: 10px;
    background: rgba(100, 200, 255, 0.1);
    border-left: 3px solid #64C8FF;
    border-radius: 3px;
  `;

  const tipsText = document.createElement('div');
  tipsText.style.cssText = `
    font-size: 10px;
    opacity: 0.8;
    line-height: 1.5;
  `;
  tipsText.innerHTML = `
    <div><strong>💡 Pro Tips:</strong></div>
    <div>• <strong>Scale 2-4:</strong> Smooth, large patterns</div>
    <div>• <strong>Scale 6-10:</strong> Fine, intricate detail</div>
    <div>• <strong>Luminosity 2-3:</strong> Full HDR bloom</div>
    <div>• <strong>Enable Skybox mode</strong> for 360° immersion</div>
    <div>• <strong>Combine with audio</strong> for reactive visuals</div>
  `;
  tipsSection.appendChild(tipsText);

  section.appendChild(tipsSection);

  container.appendChild(section);
  console.log("✨ Luminous Tessellation HUD section created");
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
  valueDisplay.textContent = initialValue.toFixed(2);
  valueDisplay.style.marginLeft = '10px';

  slider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    valueDisplay.textContent = value.toFixed(2);
    onChange(value);
  });

  control.appendChild(slider);
  control.appendChild(valueDisplay);

  return control;
}

console.log("✨ hudLuminousTessellation.js ready");
