console.log("🔬 hudFeatures.js loaded");

import { state } from './state.js';
import { updateFeature, startSimulation, stopSimulation, getCurrentFeatures as getSimulatedFeatures } from './featureExtractor.js';
import { startMicrophone, stopMicrophone, startAudioFile, stopAudioFile, initAudioContext, getAudioInputDevices } from './audioInput.js';
import { initRealExtractor, startExtraction, stopExtraction, getCurrentFeatures as getRealFeatures, isExtracting } from './realFeatureExtractor.js';

// Real-time feature update loop
let featureUpdateInterval = null;

/**
 * MMPA Feature Extractor HUD
 * Manual control panel for the six universal features
 */
export function createFeaturesHudSection(container) {
  const section = document.createElement('div');
  section.className = 'hud-section mmpa-features';
  section.style.borderLeft = '3px solid #00ffff'; // Cyan accent for MMPA core

  // Store selected audio device ID (declare early to avoid hoisting issues)
  let selectedDeviceId = null;

  // Title
  const title = document.createElement('h3');
  title.textContent = '🔬 MMPA Features (Ratio Engine)';
  title.style.color = '#00ffff';
  section.appendChild(title);

  // Enable/Disable Toggle
  const enableLabel = document.createElement('label');
  enableLabel.style.display = 'block';
  enableLabel.style.marginBottom = '12px';
  enableLabel.style.fontWeight = 'bold';
  enableLabel.style.color = '#00ffff';

  const enableCheckbox = document.createElement('input');
  enableCheckbox.type = 'checkbox';
  enableCheckbox.checked = state.mmpaFeatures?.enabled || false;
  enableCheckbox.addEventListener('change', () => {
    state.mmpaFeatures.enabled = enableCheckbox.checked;
    console.log(`🔬 MMPA Features: ${enableCheckbox.checked ? 'ENABLED' : 'DISABLED'}`);
  });

  enableLabel.appendChild(enableCheckbox);
  enableLabel.appendChild(document.createTextNode(' Enable Feature Extraction'));
  section.appendChild(enableLabel);

  // Source Selector
  const sourceContainer = document.createElement('div');
  sourceContainer.style.marginBottom = '16px';

  const sourceLabel = document.createElement('label');
  sourceLabel.textContent = 'Source:';
  sourceLabel.style.display = 'block';
  sourceLabel.style.marginBottom = '5px';
  sourceLabel.style.color = '#aaa';
  sourceContainer.appendChild(sourceLabel);

  const sourceSelect = document.createElement('select');
  sourceSelect.style.width = '100%';
  sourceSelect.style.padding = '5px';
  sourceSelect.style.backgroundColor = '#222';
  sourceSelect.style.color = '#fff';
  sourceSelect.style.border = '1px solid #555';
  sourceSelect.style.borderRadius = '3px';

  ['dummy', 'simulation', 'microphone', 'file'].forEach(sourceName => {
    const option = document.createElement('option');
    option.value = sourceName;
    option.textContent = sourceName.charAt(0).toUpperCase() + sourceName.slice(1);
    sourceSelect.appendChild(option);
  });

  sourceSelect.value = state.mmpaFeatures?.source || 'dummy';

  // Audio Device Selector (create BEFORE event handlers so they can reference it)
  const deviceContainer = document.createElement('div');
  deviceContainer.style.marginBottom = '16px';
  deviceContainer.style.display = 'none'; // Hidden by default

  const deviceLabel = document.createElement('label');
  deviceLabel.textContent = 'Audio Input Device:';
  deviceLabel.style.display = 'block';
  deviceLabel.style.marginBottom = '5px';
  deviceLabel.style.color = '#aaa';
  deviceContainer.appendChild(deviceLabel);

  const deviceSelect = document.createElement('select');
  deviceSelect.style.width = '100%';
  deviceSelect.style.padding = '5px';
  deviceSelect.style.backgroundColor = '#222';
  deviceSelect.style.color = '#fff';
  deviceSelect.style.border = '1px solid #555';
  deviceSelect.style.borderRadius = '3px';
  deviceContainer.appendChild(deviceSelect);

  // Now add event listeners (after deviceContainer and deviceSelect exist)
  sourceSelect.addEventListener('change', async () => {
    const newSource = sourceSelect.value;
    state.mmpaFeatures.source = newSource;
    console.log(`🔬 Feature source: ${newSource}`);

    // Stop all sources first
    stopSimulation();
    stopExtraction();
    stopMicrophone();
    stopAudioFile();
    stopFeatureUpdates();

    // Hide device selector by default
    deviceContainer.style.display = 'none';

    // Start selected source
    try {
      if (newSource === 'simulation') {
        startSimulation();
        startSimulationUpdates();  // Copy simulated features to state
        console.log("🔬 Simulation mode active");
      } else if (newSource === 'microphone') {
        // Show and populate device selector
        deviceContainer.style.display = 'block';

        // Populate device list
        const devices = await getAudioInputDevices();
        deviceSelect.innerHTML = ''; // Clear existing options

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Default Device';
        deviceSelect.appendChild(defaultOption);

        // Add each device
        devices.forEach(device => {
          const option = document.createElement('option');
          option.value = device.deviceId;
          option.textContent = device.label;
          deviceSelect.appendChild(option);
        });

        // Initialize audio context and extractor (user gesture required)
        initAudioContext();
        initRealExtractor();
        await startMicrophone(selectedDeviceId);
        startExtraction();
        startFeatureUpdates();
        console.log("🎤 Microphone input active");
      } else if (newSource === 'file') {
        // Show file picker
        showFilePicker();
      }
    } catch (error) {
      console.error(`🔬 Failed to start ${newSource}:`, error);
      alert(`Failed to start ${newSource}. ${error.message}`);
      sourceSelect.value = 'dummy';
      state.mmpaFeatures.source = 'dummy';
      deviceContainer.style.display = 'none';
    }
  });

  // Device selector change handler
  deviceSelect.addEventListener('change', async () => {
    selectedDeviceId = deviceSelect.value || null;
    console.log(`🎤 Device selected: ${selectedDeviceId || 'default'}`);

    // Restart microphone with new device
    if (state.mmpaFeatures.source === 'microphone') {
      try {
        stopMicrophone();
        stopExtraction();
        initAudioContext();
        initRealExtractor();
        await startMicrophone(selectedDeviceId);
        startExtraction();
        startFeatureUpdates();
        console.log("🎤 Switched to new device");
      } catch (error) {
        console.error("🎤 Failed to switch device:", error);
        alert(`Failed to switch device. ${error.message}`);
      }
    }
  });

  sourceContainer.appendChild(sourceSelect);
  section.appendChild(sourceContainer);

  // Append device selector (already created above before event handlers)
  section.appendChild(deviceContainer);

  // Divider
  const divider = document.createElement('hr');
  divider.style.border = 'none';
  divider.style.borderTop = '1px solid #333';
  divider.style.margin = '16px 0';
  section.appendChild(divider);

  // Feature Categories
  const categories = [
    {
      name: 'IDENTITY',
      description: 'What is it?',
      color: '#ff4444',
      features: [
        { key: 'fundamentalFreq', label: 'Fundamental Frequency', min: 20, max: 20000, step: 1, unit: 'Hz' },
        { key: 'strength', label: 'Pitch Strength', min: 0, max: 1, step: 0.01, unit: '' }
      ]
    },
    {
      name: 'RELATIONSHIP',
      description: 'How does it relate?',
      color: '#ffaa44',
      features: [
        { key: 'consonance', label: 'Consonance', min: 0, max: 1, step: 0.01, unit: '' },
        { key: 'complexity', label: 'Interval Complexity', min: 0, max: 10, step: 1, unit: '' }
      ]
    },
    {
      name: 'COMPLEXITY',
      description: 'How dense is it?',
      color: '#ffff44',
      features: [
        { key: 'centroid', label: 'Spectral Centroid', min: 20, max: 20000, step: 10, unit: 'Hz' },
        { key: 'bandwidth', label: 'Bandwidth', min: 100, max: 10000, step: 10, unit: 'Hz' },
        { key: 'brightness', label: 'Brightness', min: 0, max: 1, step: 0.01, unit: '' }
      ]
    },
    {
      name: 'TRANSFORMATION',
      description: 'How fast is it changing?',
      color: '#44ff44',
      features: [
        { key: 'flux', label: 'Spectral Flux', min: 0, max: 1, step: 0.01, unit: '' },
        { key: 'velocity', label: 'Velocity', min: 0, max: 1, step: 0.01, unit: '' },
        { key: 'acceleration', label: 'Acceleration', min: 0, max: 1, step: 0.01, unit: '' }
      ]
    },
    {
      name: 'ALIGNMENT',
      description: 'How synchronized is it?',
      color: '#4444ff',
      features: [
        { key: 'coherence', label: 'Coherence', min: 0, max: 1, step: 0.01, unit: '' },
        { key: 'stability', label: 'Stability', min: 0, max: 1, step: 0.01, unit: '' },
        { key: 'synchrony', label: 'Synchrony', min: 0, max: 1, step: 0.01, unit: '' }
      ]
    },
    {
      name: 'POTENTIAL',
      description: 'How unpredictable is it?',
      color: '#ff44ff',
      features: [
        { key: 'entropy', label: 'Entropy', min: 0, max: 1, step: 0.01, unit: '' },
        { key: 'unpredictability', label: 'Unpredictability', min: 0, max: 1, step: 0.01, unit: '' },
        { key: 'freedom', label: 'Freedom', min: 0, max: 1, step: 0.01, unit: '' }
      ]
    }
  ];

  categories.forEach(category => {
    // Category Header
    const categoryHeader = document.createElement('div');
    categoryHeader.style.marginTop = '20px';
    categoryHeader.style.marginBottom = '10px';
    categoryHeader.style.borderLeft = `3px solid ${category.color}`;
    categoryHeader.style.paddingLeft = '8px';

    const categoryTitle = document.createElement('h4');
    categoryTitle.textContent = `${category.name}`;
    categoryTitle.style.margin = '0';
    categoryTitle.style.color = category.color;
    categoryHeader.appendChild(categoryTitle);

    const categoryDesc = document.createElement('div');
    categoryDesc.textContent = category.description;
    categoryDesc.style.fontSize = '11px';
    categoryDesc.style.color = '#888';
    categoryDesc.style.fontStyle = 'italic';
    categoryHeader.appendChild(categoryDesc);

    section.appendChild(categoryHeader);

    // Feature Sliders
    const categoryKey = category.name.toLowerCase();
    category.features.forEach(feature => {
      const control = createFeatureSlider(
        feature.label,
        feature.min,
        feature.max,
        feature.step,
        state.mmpaFeatures[categoryKey][feature.key],
        feature.unit,
        (value) => {
          state.mmpaFeatures[categoryKey][feature.key] = value;
          updateFeature(categoryKey, feature.key, value);
        }
      );
      section.appendChild(control);
    });
  });

  container.appendChild(section);
  console.log("🔬 MMPA Features HUD section created");
}

// Helper function to create feature slider controls
function createFeatureSlider(label, min, max, step, initialValue, unit, onChange) {
  const control = document.createElement('div');
  control.style.marginTop = '10px';
  control.style.marginBottom = '8px';

  const labelEl = document.createElement('label');
  labelEl.textContent = label;
  labelEl.style.display = 'block';
  labelEl.style.marginBottom = '4px';
  labelEl.style.fontSize = '12px';
  labelEl.style.color = '#ccc';
  control.appendChild(labelEl);

  const sliderContainer = document.createElement('div');
  sliderContainer.style.display = 'flex';
  sliderContainer.style.alignItems = 'center';
  sliderContainer.style.gap = '8px';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = initialValue;
  slider.style.flex = '1';

  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = formatValue(initialValue, step) + (unit ? ` ${unit}` : '');
  valueDisplay.style.minWidth = '80px';
  valueDisplay.style.fontSize = '11px';
  valueDisplay.style.color = '#0ff';
  valueDisplay.style.textAlign = 'right';

  slider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    valueDisplay.textContent = formatValue(value, step) + (unit ? ` ${unit}` : '');
    onChange(value);
  });

  sliderContainer.appendChild(slider);
  sliderContainer.appendChild(valueDisplay);
  control.appendChild(sliderContainer);

  return control;
}

// Helper to format values based on step size
function formatValue(value, step) {
  if (step >= 1) {
    return value.toFixed(0);
  } else if (step >= 0.1) {
    return value.toFixed(1);
  } else if (step >= 0.01) {
    return value.toFixed(2);
  } else {
    return value.toFixed(3);
  }
}

/**
 * Start simulation feature updates
 * Copies simulated features to state.mmpaFeatures
 */
function startSimulationUpdates() {
  stopFeatureUpdates(); // Clear any existing interval

  let debugCounter = 0;
  featureUpdateInterval = setInterval(() => {
    const simulatedFeatures = getSimulatedFeatures();

    // Deep copy features from simulation to state
    if (simulatedFeatures && simulatedFeatures.features) {
      Object.keys(simulatedFeatures.features).forEach(category => {
        if (state.mmpaFeatures[category]) {
          Object.assign(state.mmpaFeatures[category], simulatedFeatures.features[category]);
        }
      });

      // Debug logging every 2 seconds (40 frames at 50ms)
      debugCounter++;
      if (debugCounter % 40 === 0) {
        console.log('🔬 Simulation update:', {
          'identity.strength': simulatedFeatures.features.identity?.strength,
          'relationship.consonance': simulatedFeatures.features.relationship?.consonance,
          'transformation.flux': simulatedFeatures.features.transformation?.flux,
          'potential.entropy': simulatedFeatures.features.potential?.entropy
        });
      }
    }
  }, 50); // Update at ~20fps (every 50ms)

  console.log("🔬 Simulation feature updates started");
}

/**
 * Start real-time feature updates
 * Copies features from realFeatureExtractor to state.mmpaFeatures
 */
function startFeatureUpdates() {
  stopFeatureUpdates(); // Clear any existing interval

  featureUpdateInterval = setInterval(() => {
    if (isExtracting()) {
      const realFeatures = getRealFeatures();

      // Deep copy features from real extractor to state
      if (realFeatures && realFeatures.features) {
        Object.keys(realFeatures.features).forEach(category => {
          if (state.mmpaFeatures[category]) {
            Object.assign(state.mmpaFeatures[category], realFeatures.features[category]);
          }
        });
      }
    }
  }, 50); // Update at ~20fps (every 50ms)

  console.log("🔬 Real-time feature updates started");
}

/**
 * Stop real-time feature updates
 */
function stopFeatureUpdates() {
  if (featureUpdateInterval) {
    clearInterval(featureUpdateInterval);
    featureUpdateInterval = null;
    console.log("🔬 Real-time feature updates stopped");
  }
}

/**
 * Show file picker for audio file input
 */
function showFilePicker() {
  // Create hidden file input
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'audio/*';
  fileInput.style.display = 'none';

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Initialize audio context and extractor
        initAudioContext();
        initRealExtractor();

        // Start file playback
        await startAudioFile(file);
        startExtraction();
        startFeatureUpdates();

        console.log(`🎵 Playing audio file: ${file.name}`);
      } catch (error) {
        console.error("🔬 Failed to load audio file:", error);
        alert(`Failed to load audio file. ${error.message}`);
        state.mmpaFeatures.source = 'dummy';
      }
    }

    // Remove file input from DOM
    document.body.removeChild(fileInput);
  });

  // Trigger file picker
  document.body.appendChild(fileInput);
  fileInput.click();
}

console.log("🔬 hudFeatures.js ready");
