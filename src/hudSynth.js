// MMPA Synth HUD Panel
// Professional synth control interface for validation testing and DAW workflows

import { SynthEngine } from './synthEngine.js';
import { SYNTH_PRESETS, getAllPresets, getCategories } from './synthPresets.js';
import { AudioEngine, getAudioContext } from './audio.js';
import { MIDISynthManager } from './midiSynth.js';

let synthInstance = null;
let currentPreset = null;
let midiManager = null;

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
    addSlider(controls, 'Tuning Offset (Hz)', 'tuningOffset', -10, 10, 0, 0.1);

    return controls;
  });

  // ===== MIDI CONTROL =====
  createMIDISection(section);

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

// MIDI Control Section
function createMIDISection(parent) {
  const midiDiv = document.createElement('div');
  midiDiv.style.cssText = 'margin-bottom: 15px; background: rgba(102, 68, 170, 0.15); border: 1px solid #6644aa; border-radius: 4px; padding: 10px;';

  const header = document.createElement('div');
  header.style.cssText = 'color: #00ffff; font-size: 11px; font-weight: 500; margin-bottom: 10px; cursor: pointer; user-select: none;';
  header.textContent = '▼ 🎹 MIDI Control';

  const content = document.createElement('div');
  content.style.display = 'block';

  // Toggle collapse
  let collapsed = false;
  header.addEventListener('click', () => {
    collapsed = !collapsed;
    content.style.display = collapsed ? 'none' : 'block';
    header.textContent = (collapsed ? '▶ ' : '▼ ') + '🎹 MIDI Control';
  });

  // Enable MIDI button
  const enableBtn = document.createElement('button');
  enableBtn.textContent = '🎹 Enable MIDI';
  enableBtn.style.cssText = 'width: 100%; padding: 8px; margin-bottom: 10px; background: #2a7a2a; color: #fff; border: 1px solid #3a9a3a; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 500;';

  const statusDiv = document.createElement('div');
  statusDiv.id = 'midi-status';
  statusDiv.style.cssText = 'color: #888; font-size: 10px; margin-bottom: 10px; min-height: 20px;';
  statusDiv.textContent = 'MIDI not initialized';

  const deviceSelectDiv = document.createElement('div');
  deviceSelectDiv.style.cssText = 'margin-bottom: 10px; display: none;';

  const deviceLabel = document.createElement('label');
  deviceLabel.textContent = '🎛️ MIDI Input Device';
  deviceLabel.style.cssText = 'display: block; color: #00ffff; font-size: 10px; margin-bottom: 4px;';

  const deviceSelect = document.createElement('select');
  deviceSelect.id = 'midi-device-select';
  deviceSelect.style.cssText = 'width: 100%; padding: 4px; background: #1a1a1a; color: #00ffff; border: 1px solid #333; border-radius: 3px; font-size: 10px; margin-bottom: 8px;';

  deviceSelectDiv.appendChild(deviceLabel);
  deviceSelectDiv.appendChild(deviceSelect);

  // MIDI Learn section
  const learnDiv = document.createElement('div');
  learnDiv.id = 'midi-learn-section';
  learnDiv.style.cssText = 'margin-top: 10px; padding: 8px; background: rgba(0, 255, 255, 0.05); border: 1px solid #333; border-radius: 3px; display: none;';

  const learnTitle = document.createElement('div');
  learnTitle.textContent = '🎓 MIDI Learn';
  learnTitle.style.cssText = 'color: #00ffff; font-size: 10px; margin-bottom: 6px; font-weight: 500;';

  const learnDesc = document.createElement('div');
  learnDesc.textContent = 'Map MIDI CC controls to synth parameters:';
  learnDesc.style.cssText = 'color: #888; font-size: 9px; margin-bottom: 6px;';

  const learnButtons = document.createElement('div');
  learnButtons.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 4px;';

  // Key parameters for MIDI learn
  const learnParams = [
    { param: 'filterFreq', label: 'Filter Cutoff' },
    { param: 'filterQ', label: 'Resonance' },
    { param: 'attack', label: 'Attack' },
    { param: 'release', label: 'Release' },
    { param: 'lfoRate', label: 'LFO Rate' },
    { param: 'lfoAmount', label: 'LFO Amount' }
  ];

  learnParams.forEach(({ param, label }) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = 'padding: 4px; background: #333; color: #888; border: 1px solid #444; border-radius: 3px; cursor: pointer; font-size: 9px;';
    btn.addEventListener('click', () => {
      if (midiManager && midiManager.midiAccess) {
        midiManager.startLearn(param);
        statusDiv.textContent = `🎓 MIDI Learn: Move a knob/slider for "${label}"...`;
        statusDiv.style.color = '#ffff00';

        // Reset status after timeout
        setTimeout(() => {
          if (midiManager.learnMode) {
            midiManager.cancelLearn();
            statusDiv.textContent = 'MIDI Learn cancelled (timeout)';
            statusDiv.style.color = '#888';
          }
        }, 10000);
      }
    });
    learnButtons.appendChild(btn);
  });

  learnDiv.appendChild(learnTitle);
  learnDiv.appendChild(learnDesc);
  learnDiv.appendChild(learnButtons);

  // CC Mappings display
  const mappingsDiv = document.createElement('div');
  mappingsDiv.id = 'midi-mappings';
  mappingsDiv.style.cssText = 'margin-top: 10px; padding: 8px; background: rgba(0, 0, 0, 0.3); border: 1px solid #333; border-radius: 3px; display: none;';

  const mappingsTitle = document.createElement('div');
  mappingsTitle.textContent = '🎛️ Active CC Mappings';
  mappingsTitle.style.cssText = 'color: #00ffff; font-size: 10px; margin-bottom: 6px; font-weight: 500;';

  const mappingsList = document.createElement('div');
  mappingsList.id = 'midi-mappings-list';
  mappingsList.style.cssText = 'color: #888; font-size: 9px; font-family: monospace;';

  mappingsDiv.appendChild(mappingsTitle);
  mappingsDiv.appendChild(mappingsList);

  // Panic button
  const panicBtn = document.createElement('button');
  panicBtn.textContent = '🛑 All Notes Off (Panic)';
  panicBtn.style.cssText = 'width: 100%; padding: 6px; margin-top: 10px; background: #7a2a2a; color: #fff; border: 1px solid #9a3a3a; border-radius: 4px; cursor: pointer; font-size: 10px; display: none;';
  panicBtn.addEventListener('click', () => {
    if (midiManager) {
      midiManager.allNotesOff();
      statusDiv.textContent = '🛑 All notes off';
      statusDiv.style.color = '#ff6666';
      setTimeout(() => {
        statusDiv.style.color = '#888';
      }, 2000);
    }
  });

  // Enable MIDI button handler
  enableBtn.addEventListener('click', async () => {
    if (!midiManager) {
      midiManager = new MIDISynthManager(synthInstance);

      // Set up callbacks
      midiManager.onDeviceChange = (devices) => {
        updateDeviceList(devices);
      };

      midiManager.onMIDIMessage = (msg) => {
        // Show MIDI activity
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        if (msg.command === 0x90 && msg.velocity > 0) { // Note On
          const noteName = noteNames[msg.note % 12] + Math.floor(msg.note / 12 - 1);
          statusDiv.textContent = `🎵 Note: ${noteName} (${msg.note}) vel=${msg.velocity}`;
          statusDiv.style.color = '#00ff00';
        } else if (msg.command === 0x80 || (msg.command === 0x90 && msg.velocity === 0)) { // Note Off
          statusDiv.textContent = 'MIDI active - waiting for input...';
          statusDiv.style.color = '#888';
        } else if (msg.command === 0xb0) { // CC
          const paramName = midiManager.ccMappings.get(msg.note);
          if (paramName) {
            statusDiv.textContent = `🎛️ CC ${msg.note} → ${paramName}: ${msg.velocity}`;
            statusDiv.style.color = '#00ffff';
            updateMappingsDisplay();
          }
        }
      };
    }

    const success = await midiManager.init();

    if (success) {
      // Connect synth to audio output for MIDI playback
      await AudioEngine.start();
      const audioContext = getAudioContext();

      // Connect to BOTH analyzer (for MMPA) AND destination (for audio output)
      await AudioEngine.connectExternalSource(synthInstance.masterGain);
      synthInstance.masterGain.connect(audioContext.destination);

      console.log("🎹 MIDI enabled - synth connected to speakers and analyzer");

      statusDiv.textContent = '✅ MIDI enabled - waiting for input...';
      statusDiv.style.color = '#00ff00';
      enableBtn.textContent = '✅ MIDI Enabled';
      enableBtn.style.background = '#1a5a1a';
      enableBtn.disabled = true;
      enableBtn.style.opacity = '0.7';
      enableBtn.style.cursor = 'not-allowed';

      deviceSelectDiv.style.display = 'block';
      learnDiv.style.display = 'block';
      mappingsDiv.style.display = 'block';
      panicBtn.style.display = 'block';

      updateDeviceList(midiManager.getInputList());
      updateMappingsDisplay();
    } else {
      statusDiv.textContent = '❌ MIDI not supported or permission denied';
      statusDiv.style.color = '#ff6666';
    }
  });

  function updateDeviceList(devices) {
    deviceSelect.innerHTML = '';

    if (devices.length === 0) {
      const option = document.createElement('option');
      option.textContent = 'No MIDI devices connected';
      deviceSelect.appendChild(option);
      deviceSelect.disabled = true;
    } else {
      deviceSelect.disabled = false;
      devices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.id;
        option.textContent = `${device.name} ${device.state === 'connected' ? '🟢' : '🔴'}`;
        deviceSelect.appendChild(option);
      });
      statusDiv.textContent = `✅ ${devices.length} MIDI device(s) connected`;
      statusDiv.style.color = '#00ff00';
    }
  }

  function updateMappingsDisplay() {
    if (!midiManager) return;

    const mappings = midiManager.getCCMappings();
    const entries = Object.entries(mappings);

    if (entries.length === 0) {
      mappingsList.textContent = 'No CC mappings yet. Use MIDI Learn above.';
      return;
    }

    mappingsList.innerHTML = '';
    entries.forEach(([cc, param]) => {
      const row = document.createElement('div');
      row.style.cssText = 'padding: 2px 0; display: flex; justify-content: space-between;';
      row.innerHTML = `<span>CC ${cc}</span> <span>→ ${param}</span>`;
      mappingsList.appendChild(row);
    });
  }

  content.appendChild(enableBtn);
  content.appendChild(statusDiv);
  content.appendChild(deviceSelectDiv);
  content.appendChild(learnDiv);
  content.appendChild(mappingsDiv);
  content.appendChild(panicBtn);

  midiDiv.appendChild(header);
  midiDiv.appendChild(content);
  parent.appendChild(midiDiv);
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
    '• Enable MIDI Control to play synth with MIDI keyboard or controller',
    '• Use MIDI Learn to map CC knobs to synth parameters',
    '• Adjust Tuning Offset in Global section to calibrate frequency accuracy'
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
