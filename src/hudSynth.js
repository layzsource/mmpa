// MMPA Synth HUD Panel
// Professional synth control interface for validation testing and DAW workflows

import { SynthEngine } from './synthEngine.js';
import { SYNTH_PRESETS, getAllPresets, getCategories } from './synthPresets.js';
import { AudioEngine, getAudioContext } from './audio.js';

let synthInstance = null;
let currentPreset = null;

export async function createSynthHudSection(container) {
  const section = document.createElement('div');
  section.className = 'hud-section';
  section.style.cssText = 'max-width: 100%; overflow-y: auto; max-height: calc(100vh - 200px);';

  // Ensure AudioEngine is initialized
  await AudioEngine.start();

  // Initialize synth engine with shared AudioContext
  const audioContext = getAudioContext();
  synthInstance = new SynthEngine(audioContext);

  // Title
  const title = document.createElement('h4');
  title.textContent = '🎹 MMPA Synth Engine';
  title.style.cssText = 'margin: 10px 0; color: #00ffff; font-size: 14px; font-weight: 500;';
  section.appendChild(title);

  const description = document.createElement('p');
  description.textContent = 'Professional synthesizer for validation testing and DAW workflows';
  description.style.cssText = 'margin: 0 0 15px 0; color: #888; font-size: 10px;';
  section.appendChild(description);

  // ===== PRESET SELECTOR =====
  createPresetSelector(section);

  // ===== TRANSPORT CONTROLS =====
  createTransportControls(section);

  // ===== OSCILLATOR SECTION =====
  createSection(section, '🎵 Oscillator', () => {
    const controls = document.createElement('div');

    addDropdown(controls, 'Waveform', 'oscType', [
      {value: 'sine', label: 'Sine'},
      {value: 'square', label: 'Square'},
      {value: 'sawtooth', label: 'Sawtooth'},
      {value: 'triangle', label: 'Triangle'},
      {value: 'noise', label: 'Noise'}
    ]);

    addSlider(controls, 'Detune', 'detune', -50, 50, 0, 0.1);
    addSlider(controls, 'Octave', 'octave', -2, 2, 0, 1);

    return controls;
  });

  // ===== ADSR ENVELOPE =====
  createSection(section, '📊 Envelope (ADSR)', () => {
    const controls = document.createElement('div');

    addSlider(controls, 'Attack', 'attack', 0.001, 5, 0.01, 0.001);
    addSlider(controls, 'Decay', 'decay', 0, 3, 0.1, 0.001);
    addSlider(controls, 'Sustain', 'sustain', 0, 1, 0.7, 0.01);
    addSlider(controls, 'Release', 'release', 0.001, 5, 0.3, 0.001);

    return controls;
  });

  // ===== FILTER SECTION =====
  createSection(section, '🎚️ Filter', () => {
    const controls = document.createElement('div');

    addDropdown(controls, 'Type', 'filterType', [
      {value: 'none', label: 'None'},
      {value: 'lowpass', label: 'Lowpass'},
      {value: 'highpass', label: 'Highpass'},
      {value: 'bandpass', label: 'Bandpass'},
      {value: 'notch', label: 'Notch'}
    ]);

    addSlider(controls, 'Frequency', 'filterFreq', 20, 20000, 2000, 1);
    addSlider(controls, 'Resonance (Q)', 'filterQ', 0.1, 20, 1, 0.1);
    addSlider(controls, 'Env Amount', 'filterEnvAmount', -5000, 5000, 0, 10);

    return controls;
  });

  // ===== LFO SECTION =====
  createSection(section, '🌊 LFO', () => {
    const controls = document.createElement('div');

    addDropdown(controls, 'Waveform', 'lfoWaveform', [
      {value: 'sine', label: 'Sine'},
      {value: 'square', label: 'Square'},
      {value: 'sawtooth', label: 'Sawtooth'},
      {value: 'triangle', label: 'Triangle'}
    ]);

    addSlider(controls, 'Rate (Hz)', 'lfoRate', 0.1, 20, 4, 0.1);
    addSlider(controls, 'Amount', 'lfoAmount', 0, 1000, 0, 1);

    addDropdown(controls, 'Target', 'lfoTarget', [
      {value: 'pitch', label: 'Pitch'},
      {value: 'filter', label: 'Filter'},
      {value: 'amplitude', label: 'Amplitude'}
    ]);

    return controls;
  });

  // ===== EFFECTS =====
  createSection(section, '✨ Effects', () => {
    const controls = document.createElement('div');

    addSlider(controls, 'Reverb Mix', 'reverbMix', 0, 1, 0, 0.01);
    addSlider(controls, 'Delay Time', 'delayTime', 0.01, 2, 0.3, 0.01);
    addSlider(controls, 'Delay Feedback', 'delayFeedback', 0, 0.95, 0.3, 0.01);
    addSlider(controls, 'Delay Mix', 'delayMix', 0, 1, 0, 0.01);
    addSlider(controls, 'Distortion', 'distortion', 0, 1, 0, 0.01);

    return controls;
  });

  // ===== GLOBAL =====
  createSection(section, '🎛️ Global', () => {
    const controls = document.createElement('div');

    addSlider(controls, 'Volume', 'volume', 0, 1, 0.7, 0.01);
    addSlider(controls, 'Glide (Portamento)', 'glide', 0, 1, 0, 0.01);

    return controls;
  });

  // ===== INFO PANEL =====
  createInfoPanel(section);

  container.appendChild(section);

  console.log("🎹 Synth HUD created");
}

// Create collapsible section
function createSection(parent, title, createControls) {
  const sectionDiv = document.createElement('div');
  sectionDiv.style.cssText = 'margin-bottom: 15px; background: rgba(0, 255, 255, 0.05); border: 1px solid #6644aa; border-radius: 4px; padding: 10px;';

  const header = document.createElement('div');
  header.style.cssText = 'color: #00ffff; font-size: 11px; font-weight: 500; margin-bottom: 10px; cursor: pointer; user-select: none;';
  header.textContent = title;

  const content = createControls();
  content.style.display = 'block';

  // Toggle collapse
  let collapsed = false;
  header.addEventListener('click', () => {
    collapsed = !collapsed;
    content.style.display = collapsed ? 'none' : 'block';
    header.textContent = (collapsed ? '▶ ' : '▼ ') + title.replace('▼ ', '').replace('▶ ', '');
  });

  header.textContent = '▼ ' + title;

  sectionDiv.appendChild(header);
  sectionDiv.appendChild(content);
  parent.appendChild(sectionDiv);
}

// Preset selector
function createPresetSelector(parent) {
  const presetDiv = document.createElement('div');
  presetDiv.style.cssText = 'margin-bottom: 15px; background: rgba(102, 68, 170, 0.15); border: 1px solid #6644aa; border-radius: 4px; padding: 10px;';

  const label = document.createElement('label');
  label.textContent = '🎼 Preset';
  label.style.cssText = 'display: block; color: #00ffff; font-size: 11px; margin-bottom: 6px; font-weight: 500;';
  presetDiv.appendChild(label);

  const select = document.createElement('select');
  select.style.cssText = 'width: 100%; padding: 6px; background: #1a1a1a; color: #00ffff; border: 1px solid #6644aa; border-radius: 3px; font-size: 11px; margin-bottom: 8px;';

  // Organize presets by category
  const allPresets = getAllPresets();
  const categories = getCategories();

  categories.forEach(category => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = category.toUpperCase();

    Object.keys(SYNTH_PRESETS[category]).forEach(presetName => {
      const option = document.createElement('option');
      option.value = presetName;
      option.textContent = presetName;
      optgroup.appendChild(option);
    });

    select.appendChild(optgroup);
  });

  select.addEventListener('change', () => {
    loadPreset(select.value);
  });

  presetDiv.appendChild(select);

  // Preset description
  const descDiv = document.createElement('div');
  descDiv.id = 'synth-preset-desc';
  descDiv.style.cssText = 'color: #888; font-size: 10px; font-style: italic; min-height: 30px;';
  presetDiv.appendChild(descDiv);

  parent.appendChild(presetDiv);

  // Load default preset
  loadPreset(Object.keys(allPresets)[0]);
}

// Transport controls (play/stop)
function createTransportControls(parent) {
  const transportDiv = document.createElement('div');
  transportDiv.style.cssText = 'margin-bottom: 15px; display: flex; gap: 10px;';

  const playBtn = document.createElement('button');
  playBtn.textContent = '▶ Play Tone';
  playBtn.style.cssText = 'flex: 1; padding: 10px; background: #2a7a2a; color: #fff; border: 1px solid #3a9a3a; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;';
  playBtn.addEventListener('click', async () => {
    if (currentPreset) {
      // Ensure audio context is running
      await AudioEngine.start();
      const audioContext = getAudioContext();

      // Connect synth to BOTH analyzer (for MMPA) AND destination (for audio output)
      await AudioEngine.connectExternalSource(synthInstance.masterGain);
      synthInstance.masterGain.connect(audioContext.destination);

      // Start tone (use 440 Hz default for noise since frequency doesn't matter)
      const frequency = currentPreset.note || 440;
      synthInstance.startContinuousTone(frequency);

      playBtn.disabled = true;
      playBtn.style.opacity = '0.5';
      stopBtn.disabled = false;
      stopBtn.style.opacity = '1';

      console.log("🎹 Synth playing, MMPA analyzing");
    }
  });

  const stopBtn = document.createElement('button');
  stopBtn.textContent = '■ Stop';
  stopBtn.style.cssText = 'flex: 1; padding: 10px; background: #7a2a2a; color: #fff; border: 1px solid #9a3a3a; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500; opacity: 0.5;';
  stopBtn.disabled = true;
  stopBtn.addEventListener('click', () => {
    // Stop tone
    synthInstance.stopContinuousTone();

    // Disconnect synth from analyzer and speakers
    AudioEngine.disconnectExternalSource();
    try {
      const audioContext = getAudioContext();
      synthInstance.masterGain.disconnect(audioContext.destination);
    } catch {}

    playBtn.disabled = false;
    playBtn.style.opacity = '1';
    stopBtn.disabled = true;
    stopBtn.style.opacity = '0.5';

    console.log("🎹 Synth stopped, mic restored");
  });

  transportDiv.appendChild(playBtn);
  transportDiv.appendChild(stopBtn);
  parent.appendChild(transportDiv);
}

// Add slider control
function addSlider(parent, label, param, min, max, defaultValue, step) {
  const row = document.createElement('div');
  row.style.cssText = 'margin-bottom: 10px;';

  const labelEl = document.createElement('label');
  labelEl.style.cssText = 'display: block; color: #00ffff; font-size: 10px; margin-bottom: 4px;';
  labelEl.textContent = label;

  const sliderContainer = document.createElement('div');
  sliderContainer.style.cssText = 'display: flex; gap: 8px; align-items: center;';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = defaultValue;
  slider.style.cssText = 'flex: 1;';

  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = defaultValue.toFixed(step < 1 ? 3 : 0);
  valueDisplay.style.cssText = 'color: #888; font-size: 10px; font-family: monospace; min-width: 50px; text-align: right;';

  slider.addEventListener('input', () => {
    const value = parseFloat(slider.value);
    valueDisplay.textContent = value.toFixed(step < 1 ? 3 : 0);
    synthInstance.updateParam(param, value);
  });

  sliderContainer.appendChild(slider);
  sliderContainer.appendChild(valueDisplay);

  row.appendChild(labelEl);
  row.appendChild(sliderContainer);
  parent.appendChild(row);

  // Store reference for preset loading
  slider.dataset.param = param;
  return slider;
}

// Add dropdown control
function addDropdown(parent, label, param, options) {
  const row = document.createElement('div');
  row.style.cssText = 'margin-bottom: 10px;';

  const labelEl = document.createElement('label');
  labelEl.style.cssText = 'display: block; color: #00ffff; font-size: 10px; margin-bottom: 4px;';
  labelEl.textContent = label;

  const select = document.createElement('select');
  select.style.cssText = 'width: 100%; padding: 4px; background: #1a1a1a; color: #00ffff; border: 1px solid #333; border-radius: 3px; font-size: 10px;';

  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    synthInstance.updateParam(param, select.value);
  });

  row.appendChild(labelEl);
  row.appendChild(select);
  parent.appendChild(row);

  // Store reference for preset loading
  select.dataset.param = param;
  return select;
}

// Load preset
function loadPreset(presetName) {
  const allPresets = getAllPresets();
  const preset = allPresets[presetName];

  if (!preset) {
    console.error(`Preset not found: ${presetName}`);
    return;
  }

  currentPreset = preset;

  // Update synth parameters
  Object.keys(preset.params).forEach(param => {
    synthInstance.updateParam(param, preset.params[param]);
  });

  // Update UI controls
  document.querySelectorAll('[data-param]').forEach(control => {
    const param = control.dataset.param;
    if (preset.params[param] !== undefined) {
      if (control.tagName === 'INPUT' && control.type === 'range') {
        control.value = preset.params[param];
        const valueDisplay = control.nextElementSibling;
        if (valueDisplay) {
          const step = parseFloat(control.step);
          valueDisplay.textContent = preset.params[param].toFixed(step < 1 ? 3 : 0);
        }
      } else if (control.tagName === 'SELECT') {
        control.value = preset.params[param];
      }
    }
  });

  // Update description
  const descDiv = document.getElementById('synth-preset-desc');
  if (descDiv) {
    descDiv.textContent = preset.description || '';
  }

  console.log(`🎹 Loaded preset: ${presetName}`);
}

// Info panel
function createInfoPanel(parent) {
  const infoDiv = document.createElement('div');
  infoDiv.style.cssText = 'margin-top: 15px; padding: 10px; background: rgba(0, 255, 255, 0.1); border: 1px solid #00ffff; border-radius: 4px;';

  const title = document.createElement('div');
  title.textContent = 'ℹ️ Usage Tips';
  title.style.cssText = 'color: #00ffff; font-size: 11px; font-weight: 500; margin-bottom: 8px;';
  infoDiv.appendChild(title);

  const tips = [
    '• Load a validation preset and hit "Play Tone" to test MMPA predictions',
    '• Use "Export MMPA Training Data" (Audio tab) to save test results',
    '• Musical presets are DAW-ready for production use',
    '• Adjust envelope and filter for different archetype responses',
    '• Connect MIDI controller for live performance (coming soon)'
  ];

  tips.forEach(tip => {
    const tipEl = document.createElement('div');
    tipEl.textContent = tip;
    tipEl.style.cssText = 'color: #888; font-size: 10px; margin-bottom: 4px;';
    infoDiv.appendChild(tipEl);
  });

  parent.appendChild(infoDiv);
}

// Export synth instance for external access (e.g., recorder integration)
export function getSynthInstance() {
  return synthInstance;
}

console.log("🎹 hudSynth.js loaded");
