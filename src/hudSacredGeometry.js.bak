console.log("🔺 hudSacredGeometry.js loaded");

import { state } from './state.js';

/**
 * Sacred Geometry HUD section
 * Controls for the Egyptian pyramids parallax shader system
 */
export function createSacredGeometryHudSection(container) {
  const section = document.createElement('div');
  section.className = 'hud-section sacred-geometry';

  // Title
  const title = document.createElement('h3');
  title.textContent = '🔺 Sacred Geometry';
  section.appendChild(title);

  // Description
  const description = document.createElement('p');
  description.textContent = 'Psychedelic Egyptian pyramids with parallax scrolling';
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
  enableCheckbox.checked = state.sacredGeometry?.enabled || false;
  enableCheckbox.addEventListener('change', () => {
    state.sacredGeometry.enabled = enableCheckbox.checked;
    console.log(`🔺 Sacred Geometry: ${enableCheckbox.checked ? 'ENABLED' : 'DISABLED'}`);
  });

  enableLabel.appendChild(enableCheckbox);
  enableLabel.appendChild(document.createTextNode(' Enable Sacred Geometry'));
  section.appendChild(enableLabel);

  // Scroll Speed
  const scrollSpeedControl = createSliderControl(
    'Scroll Speed',
    0.0,
    1.0,
    0.05,
    state.sacredGeometry?.scrollSpeed || 0.1,
    (value) => {
      state.sacredGeometry.scrollSpeed = value;
    }
  );
  section.appendChild(scrollSpeedControl);

  // Layer Count
  const layerCountControl = createSliderControl(
    'Parallax Layers',
    1.0,
    4.0,
    1.0,
    state.sacredGeometry?.layerCount || 3.0,
    (value) => {
      state.sacredGeometry.layerCount = value;
    }
  );
  section.appendChild(layerCountControl);

  // Pyramid Scale
  const pyramidScaleControl = createSliderControl(
    'Pyramid Scale',
    0.5,
    5.0,
    0.1,
    state.sacredGeometry?.pyramidScale || 2.0,
    (value) => {
      state.sacredGeometry.pyramidScale = value;
    }
  );
  section.appendChild(pyramidScaleControl);

  // Symbol Density
  const symbolDensityControl = createSliderControl(
    'Symbol Density',
    0.0,
    1.0,
    0.05,
    state.sacredGeometry?.symbolDensity || 0.5,
    (value) => {
      state.sacredGeometry.symbolDensity = value;
    }
  );
  section.appendChild(symbolDensityControl);

  // Color Shift
  const colorShiftControl = createSliderControl(
    'Color Shift',
    0.0,
    1.0,
    0.01,
    state.sacredGeometry?.colorShift || 0.0,
    (value) => {
      state.sacredGeometry.colorShift = value;
    }
  );
  section.appendChild(colorShiftControl);

  // Glow Intensity
  const glowIntensityControl = createSliderControl(
    'Glow Intensity',
    0.0,
    3.0,
    0.1,
    state.sacredGeometry?.glowIntensity || 1.0,
    (value) => {
      state.sacredGeometry.glowIntensity = value;
    }
  );
  section.appendChild(glowIntensityControl);

  // Audio Intensity
  const audioIntensityControl = createSliderControl(
    'Audio Reactivity',
    0.0,
    3.0,
    0.1,
    state.sacredGeometry?.audioIntensity || 1.0,
    (value) => {
      state.sacredGeometry.audioIntensity = value;
    }
  );
  section.appendChild(audioIntensityControl);

  // Dancing Outline Toggle
  const outlineLabel = document.createElement('label');
  outlineLabel.style.display = 'block';
  outlineLabel.style.marginTop = '15px';
  outlineLabel.style.marginBottom = '12px';

  const outlineCheckbox = document.createElement('input');
  outlineCheckbox.type = 'checkbox';
  outlineCheckbox.checked = state.sacredGeometry?.dancingOutline || false;
  outlineCheckbox.addEventListener('change', () => {
    state.sacredGeometry.dancingOutline = outlineCheckbox.checked;
    console.log(`🔺 Dancing Outline: ${outlineCheckbox.checked ? 'ENABLED' : 'DISABLED'}`);
  });

  outlineLabel.appendChild(outlineCheckbox);
  outlineLabel.appendChild(document.createTextNode(' Dancing Outline (Audio-Reactive)'));
  section.appendChild(outlineLabel);

  // === FEATURE HIGHLIGHTS ===
  const highlightsSection = document.createElement('div');
  highlightsSection.style.cssText = `
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  `;

  const highlightsTitle = document.createElement('h4');
  highlightsTitle.textContent = '🌟 Features';
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
    <div>• <strong>Pyramids</strong> - Sacred triangular geometry</div>
    <div>• <strong>Eye of Horus</strong> - Ancient Egyptian symbol</div>
    <div>• <strong>Hieroglyphs</strong> - Mystical line patterns</div>
    <div>• <strong>Parallax Scrolling</strong> - Multi-layer depth</div>
    <div>• <strong>Psychedelic Colors</strong> - Cyan/Gold/Magenta palette</div>
    <div>• <strong>Audio-Reactive</strong> - Pulses with music</div>
  `;
  highlightsSection.appendChild(featuresList);

  section.appendChild(highlightsSection);

  // === TIPS ===
  const tipsSection = document.createElement('div');
  tipsSection.style.cssText = `
    margin-top: 15px;
    padding: 10px;
    background: rgba(255, 215, 0, 0.1);
    border-left: 3px solid #FFD700;
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
    <div>• <strong>Scroll Speed 0.1-0.3:</strong> Slow, meditative scroll</div>
    <div>• <strong>Scroll Speed 0.5-1.0:</strong> Fast, intense motion</div>
    <div>• <strong>Symbol Density 0.0-0.3:</strong> Pyramids only</div>
    <div>• <strong>Symbol Density 0.3-0.6:</strong> + Eye of Horus</div>
    <div>• <strong>Symbol Density 0.6-1.0:</strong> + Hieroglyphs</div>
    <div>• <strong>4 Layers:</strong> Maximum depth effect</div>
    <div>• <strong>Enable audio</strong> for reactive glow and scrolling</div>
  `;
  tipsSection.appendChild(tipsText);

  section.appendChild(tipsSection);

  container.appendChild(section);
  console.log("🔺 Sacred Geometry HUD section created");
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

console.log("🔺 hudSacredGeometry.js ready");
