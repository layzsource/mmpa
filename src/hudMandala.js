// hudMandala.js - Phase 11.7.50: Modular Mandala HUD Section
// Extracted from hud.js for better organization and future expansion

import { state } from './state.js';
import { mountMandalaUploadAfter } from './mandalaUpload.js';
import { notifyHUDUpdate, registerHUDCallback } from "./hud.js";

console.log("🌀 hudMandala.js loaded");

/**
 * Create Mandala HUD section with all controls
 * @param {HTMLElement} container - Parent container to append controls to
 * @param {Function} notifyHUDUpdate - Callback to notify main HUD of state changes
 * @param {Function} createToggleControl - Helper function for toggle controls
 * @param {Function} createSliderControl - Helper function for slider controls
 */
export function createMandalaHudSection(container, notifyHUDUpdate, createToggleControl, createSliderControl) {
  // === Phase 11.7.21: Emoji Mandalas & Layered Symmetry ===
  const emojiMandalaLabel = document.createElement("h4");
  emojiMandalaLabel.textContent = "🌀 Emoji Mandalas";
  emojiMandalaLabel.style.cssText = 'margin: 15px 0 10px 0; color: #ff66ff; font-size: 12px;';
  container.appendChild(emojiMandalaLabel);

  // Mandala mode toggle
  // Phase 11.7.31: Sync to both state.mandala and state.emojiMandala
  const mandalaToggle = createToggleControl('Enable Mandala Mode', false, (value) => {
    state.mandala.enabled = value;
    state.emojiMandala.enabled = value;
    notifyHUDUpdate({ mandalaEnabled: value });
    console.log(`🎛️ Mandala: ${value ? 'ON' : 'OFF'}`);
  });
  mandalaToggle.title = 'Radial symmetry mandala pattern';
  container.appendChild(mandalaToggle);

  // Ring count slider
  // Phase 11.7.29: Updated range to 3-12
  // Phase 11.7.31: Sync to state.mandala and use mandalaRings event
  const ringCountControl = createSliderControl('Rings', 6, 3, 12, 1, (value) => {
    state.mandala.ringCount = value;
    state.emojiMandala.rings = value;
    notifyHUDUpdate({ mandalaRings: value });
    console.log(`🎛️ Mandala rings: ${value}`);
  });
  ringCountControl.title = 'Number of concentric rings (3-12)';
  container.appendChild(ringCountControl);

  // Phase 11.7.26: Layout mode dropdown
  const layoutModeLabel = document.createElement("label");
  layoutModeLabel.textContent = "Layout Mode";
  layoutModeLabel.style.cssText = 'display: block; font-size: 11px; margin-bottom: 4px; color: #ff66ff;';
  container.appendChild(layoutModeLabel);

  const layoutModeDropdown = document.createElement("select");
  layoutModeDropdown.style.cssText = 'width: 100%; padding: 6px; background: rgba(0,0,0,0.5); border: 1px solid #ff66ff; color: #ff66ff; border-radius: 4px; margin-bottom: 10px; font-size: 11px;';

  const layoutModes = [
    { value: 'radial', label: '⭕ Radial (Concentric)' },
    { value: 'spiral', label: '🌀 Spiral (Fibonacci)' },
    { value: 'grid', label: '🔲 Grid (Lattice)' }
  ];

  layoutModes.forEach(mode => {
    const option = document.createElement("option");
    option.value = mode.value;
    option.textContent = mode.label;
    if (mode.value === 'radial') option.selected = true;
    layoutModeDropdown.appendChild(option);
  });

  layoutModeDropdown.addEventListener("change", () => {
    const mode = layoutModeDropdown.value;
    // Phase 11.7.26: Route through HUD update system to MandalaController
    notifyHUDUpdate({ mandala: { layoutMode: mode } });
    // Phase 11.7.29: Add console log
    const emoji = mode === 'spiral' ? '🌀' : mode === 'grid' ? '🔲' : '⭕';
    console.log(`📟 HUD → Mandala layout set to ${mode.charAt(0).toUpperCase() + mode.slice(1)} ${emoji}`);
  });
  layoutModeDropdown.title = 'Mandala geometry layout pattern';
  container.appendChild(layoutModeDropdown);

  // Symmetry slider
  // Phase 11.7.29: Changed from dropdown to slider (2-12 range for HUD simplicity)
  // Phase 11.7.31: Sync to state.mandala and use mandalaSymmetry event
  const symmetryControl = createSliderControl('Symmetry', 6, 2, 12, 1, (value) => {
    state.mandala.symmetry = value;
    state.emojiMandala.symmetry = value;
    notifyHUDUpdate({ mandalaSymmetry: value });
    console.log(`🎛️ Mandala symmetry: ${value}`);
  });
  symmetryControl.title = 'Symmetry fold count (2-12 spokes)';
  container.appendChild(symmetryControl);

  // Rotation speed slider
  const mandalaRotSpeedControl = createSliderControl('Rotation Speed', 0.02, 0, 0.1, 0.005, (value) => {
    // Phase 11.7.25: Route through HUD update system to MandalaController
    notifyHUDUpdate({ mandala: { rotationSpeed: value } });
  });
  mandalaRotSpeedControl.title = 'Base rotation speed';
  container.appendChild(mandalaRotSpeedControl);

  // Audio modulation toggle
  const mandalaAudioModToggle = createToggleControl('Audio Speed Boost', true, (value) => {
    // Phase 11.7.25: Route through HUD update system to MandalaController
    notifyHUDUpdate({ mandala: { audioModulation: value } });
  });
  mandalaAudioModToggle.title = 'Audio increases rotation speed';
  container.appendChild(mandalaAudioModToggle);

  // Layered audio toggle
  const layeredAudioToggle = createToggleControl('Layered Audio (Bass/Mid/Treble)', true, (value) => {
    // Phase 11.7.25: Route through HUD update system to MandalaController
    notifyHUDUpdate({ mandala: { layeredAudio: value } });
  });
  layeredAudioToggle.title = 'Inner rings→bass, middle→mids, outer→treble';
  container.appendChild(layeredAudioToggle);

  // Phase 11.7.27/11.7.29: Mandala audio-reactive toggle
  const mandalaAudioReactiveToggle = createToggleControl('Audio-Reactive Mandala', true, (value) => {
    notifyHUDUpdate({ mandala: { mandalaAudioReactive: value } });
    console.log(`📟 HUD → Mandala audioReactive = ${value ? 'ON' : 'OFF'}`);
  });
  mandalaAudioReactiveToggle.title = 'Mandala pulses and expands with audio';
  container.appendChild(mandalaAudioReactiveToggle);

  // Phase 11.7.27/11.7.29: Mandala sensitivity slider
  const mandalaSensitivityControl = createSliderControl('Mandala Sensitivity', 1.0, 0, 2.0, 0.1, (value) => {
    notifyHUDUpdate({ mandala: { mandalaSensitivity: value } });
    console.log(`📟 HUD → Mandala sensitivity = ${value.toFixed(1)}`);
  });
  mandalaSensitivityControl.title = 'Audio reactivity strength (0-200%)';
  container.appendChild(mandalaSensitivityControl);

  // Phase 11.7.34: Mandala Layout Preset Dropdown
  const layoutPresetLabel = document.createElement("label");
  layoutPresetLabel.textContent = "Mandala Layout Preset";
  layoutPresetLabel.style.cssText = 'display: block; font-size: 11px; margin-top: 10px; margin-bottom: 4px; color: #ff66ff;';
  container.appendChild(layoutPresetLabel);

  const layoutPresetDropdown = document.createElement("select");
  layoutPresetDropdown.style.cssText = 'width: 100%; padding: 6px; background: rgba(0,0,0,0.5); border: 1px solid #ff66ff; color: #ff66ff; border-radius: 4px; margin-bottom: 10px; font-size: 11px;';

  const layoutPresets = [
    { value: 'Classic', label: '🎨 Classic (evenly spaced, symmetry=6)' },
    { value: 'Flower', label: '🌸 Flower (alternating radii, symmetry=8)' },
    { value: 'Spiral', label: '🌀 Spiral (golden angle rotation)' },
    { value: 'Dense', label: '🔷 Dense (doubled rings, symmetry=12)' }
  ];

  layoutPresets.forEach(preset => {
    const option = document.createElement("option");
    option.value = preset.value;
    option.textContent = preset.label;
    if (preset.value === 'Classic') option.selected = true;
    layoutPresetDropdown.appendChild(option);
  });

  layoutPresetDropdown.addEventListener("change", () => {
    const preset = layoutPresetDropdown.value;
    notifyHUDUpdate({ mandala: { layoutPreset: preset } });
    console.log(`📟 HUD → Mandala layout preset: ${preset}`);
  });
  layoutPresetDropdown.title = 'Apply predefined mandala layout configuration';
  container.appendChild(layoutPresetDropdown);

  // Phase 11.7.34: Ring Spacing slider
  const ringSpacingControl = createSliderControl('Ring Spacing', 1.0, 0.2, 2.0, 0.1, (value) => {
    notifyHUDUpdate({ mandala: { ringSpacing: value } });
    console.log(`📟 HUD → Ring spacing = ${value.toFixed(1)}`);
  });
  ringSpacingControl.title = 'Distance multiplier between rings (0.2-2.0)';
  container.appendChild(ringSpacingControl);

  // Phase 11.7.34: Base Radius slider
  const baseRadiusControl = createSliderControl('Base Radius', 1.0, 0.5, 3.0, 0.1, (value) => {
    notifyHUDUpdate({ mandala: { baseRadius: value } });
    console.log(`📟 HUD → Base radius = ${value.toFixed(1)}`);
  });
  baseRadiusControl.title = 'Base radius multiplier (0.5-3.0)';
  container.appendChild(baseRadiusControl);

  // Phase 11.7.34: Global Scale slider
  const globalScaleControl = createSliderControl('Global Scale', 1.0, 0.5, 2.0, 0.1, (value) => {
    notifyHUDUpdate({ mandala: { globalScale: value } });
    console.log(`📟 HUD → Global scale = ${value.toFixed(1)}`);
  });
  globalScaleControl.title = 'Overall mandala scale (0.5-2.0)';
  container.appendChild(globalScaleControl);

  // Phase 11.7.34: Rainbow Mode toggle
  const rainbowModeToggle = createToggleControl('Rainbow Mode', false, (value) => {
    notifyHUDUpdate({ mandala: { rainbowMode: value } });
    console.log(`📟 HUD → Rainbow mode: ${value ? 'ON' : 'OFF'}`);
  });
  rainbowModeToggle.title = 'Apply rainbow hue shift per ring';
  container.appendChild(rainbowModeToggle);

  // Phase 11.7.29: Emoji Picker (radio buttons)
  const emojiPickerLabel = document.createElement("label");
  emojiPickerLabel.textContent = "Mandala Emoji";
  emojiPickerLabel.style.cssText = 'display: block; font-size: 11px; margin-top: 10px; margin-bottom: 6px; color: #ff66ff;';
  container.appendChild(emojiPickerLabel);

  const emojiPickerContainer = document.createElement("div");
  emojiPickerContainer.style.cssText = 'display: flex; gap: 8px; margin-bottom: 10px; padding: 8px; background: rgba(0,0,0,0.3); border-radius: 4px;';

  const emojiOptions = ['🍕', '🌶️', '🍄', '⭐'];
  emojiOptions.forEach((emoji, index) => {
    const radioLabel = document.createElement("label");
    radioLabel.style.cssText = 'display: flex; align-items: center; gap: 4px; cursor: pointer; padding: 4px 8px; border-radius: 4px; background: rgba(255,255,255,0.1); transition: background 0.2s;';

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "mandalaEmoji";
    radio.value = emoji;
    radio.checked = index === 0; // Default to 🍕
    radio.style.cssText = 'cursor: pointer;';

    const emojiSpan = document.createElement("span");
    emojiSpan.textContent = emoji;
    emojiSpan.style.cssText = 'font-size: 20px;';

    radio.addEventListener("change", () => {
      if (radio.checked) {
        notifyHUDUpdate({ mandala: { emoji: emoji } });
        console.log(`📟 HUD → Mandala emoji set to ${emoji}`);
      }
    });

    radioLabel.appendChild(radio);
    radioLabel.appendChild(emojiSpan);
    emojiPickerContainer.appendChild(radioLabel);
  });

  container.appendChild(emojiPickerContainer);

  // Phase 11.7.50: Mount PNG upload UI after emoji picker
  mountMandalaUploadAfter(emojiPickerContainer);

  // Per-ring emoji layout editor
  const ringLayoutLabel = document.createElement("label");
  ringLayoutLabel.textContent = "Ring Emoji Layout (center → outer)";
  ringLayoutLabel.style.cssText = 'display: block; font-size: 11px; margin-top: 10px; margin-bottom: 4px; color: #ff66ff;';
  container.appendChild(ringLayoutLabel);

  const ringLayoutInput = document.createElement("input");
  ringLayoutInput.type = "text";
  ringLayoutInput.value = state.emojiMandala.layout.join(' ');
  ringLayoutInput.placeholder = "🍕 🌶️ 🍄";
  ringLayoutInput.style.cssText = 'width: 100%; padding: 6px; background: rgba(0,0,0,0.5); border: 1px solid #ff66ff; color: #ff66ff; border-radius: 4px; margin-bottom: 10px; font-size: 14px;';

  ringLayoutInput.addEventListener("input", (e) => {
    const emojis = e.target.value.split(/\s+/).filter(s => s.length > 0);
    state.emojiMandala.layout = emojis;
    console.log(`🌀 Mandala layout updated: ${emojis.join(' → ')}`);
  });
  ringLayoutInput.title = 'Space-separated emojis for each ring';
  container.appendChild(ringLayoutInput);

  // Phase 11.7.22: Musical Scale Mode
  const musicalModeLabel = document.createElement("h4");
  musicalModeLabel.textContent = "🎼 Musical Scale Mode";
  musicalModeLabel.style.cssText = 'margin: 15px 0 10px 0; color: #ffdd66; font-size: 12px;';
  container.appendChild(musicalModeLabel);

  // Musical mode toggle
  const musicalModeToggle = createToggleControl('Enable Musical Mode', false, (value) => {
    // Phase 11.7.25: Route through HUD update system to MandalaController
    notifyHUDUpdate({ mandala: { musicalMode: value } });
  });
  musicalModeToggle.title = 'Emojis arranged by musical scale intervals';
  container.appendChild(musicalModeToggle);

  // Scale selector
  const scaleLabel = document.createElement("label");
  scaleLabel.textContent = "Scale/Mode";
  scaleLabel.style.cssText = 'display: block; font-size: 11px; margin-bottom: 4px; color: #ffdd66;';
  container.appendChild(scaleLabel);

  const scaleDropdown = document.createElement("select");
  scaleDropdown.style.cssText = 'width: 100%; padding: 6px; background: rgba(0,0,0,0.5); border: 1px solid #ffdd66; color: #ffdd66; border-radius: 4px; margin-bottom: 10px; font-size: 11px;';

  const scales = ['Major', 'Minor', 'Pentatonic', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Chromatic'];
  scales.forEach(scale => {
    const option = document.createElement("option");
    option.value = scale;
    option.textContent = scale;
    if (scale === 'Major') option.selected = true;
    scaleDropdown.appendChild(option);
  });

  scaleDropdown.addEventListener("change", () => {
    // Phase 11.7.25: Route through HUD update system to MandalaController
    const scale = scaleDropdown.value;
    notifyHUDUpdate({ mandala: { scale, mode: scale } }); // Mode defaults to scale name
  });
  container.appendChild(scaleDropdown);

  // Root note slider (MIDI 48-72 = C3-C5)
  const rootNoteControl = createSliderControl('Root Note (MIDI)', 60, 48, 72, 1, (value) => {
    state.emojiMandala.rootNote = value;
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteName = noteNames[value % 12];
    const octave = Math.floor(value / 12) - 1;
    console.log(`🎼 Root note: ${noteName}${octave} (MIDI ${value})`);
  });
  rootNoteControl.title = 'MIDI root note for scale (C4=60)';
  container.appendChild(rootNoteControl);

  // Phase 11.7.23: Interactive Performance Controls
  const performanceLabel = document.createElement("h4");
  performanceLabel.textContent = "🎛️ Performance Controls";
  performanceLabel.style.cssText = 'margin: 15px 0 10px 0; color: #ff9944; font-size: 12px;';
  container.appendChild(performanceLabel);

  // Performance mode toggle
  const performanceModeToggle = createToggleControl('Enable Performance Mode', false, (value) => {
    // Phase 11.7.25: Route through HUD update system to MandalaController
    notifyHUDUpdate({ mandala: { performanceMode: value } });
  });
  performanceModeToggle.title = 'Live manipulation controls enabled';
  container.appendChild(performanceModeToggle);

  // Differential rotation toggle
  const diffRotationToggle = createToggleControl('Differential Ring Rotation', true, (value) => {
    state.emojiMandala.differentialRotation = value;
    console.log(`🎛️ Differential rotation: ${value ? 'ON (each ring independent)' : 'OFF (unified)'}`);
  });
  diffRotationToggle.title = 'Each ring rotates at different speed';
  container.appendChild(diffRotationToggle);

  // Extended ring count slider (up to 8 for performance mode)
  const extendedRingCountControl = createSliderControl('Ring Count (Performance)', 3, 1, 8, 1, (value) => {
    state.emojiMandala.rings = value;
    console.log(`🎛️ Mandala rings: ${value}`);
  });
  extendedRingCountControl.title = 'Number of rings (1-8 in performance mode)';
  container.appendChild(extendedRingCountControl);

  // Extended symmetry slider (up to 12)
  const extendedSymmetryControl = createSliderControl('Symmetry (Performance)', 6, 2, 12, 1, (value) => {
    state.emojiMandala.symmetry = value;
    console.log(`🎛️ Mandala symmetry: ${value}-fold`);
  });
  extendedSymmetryControl.title = 'Radial symmetry spokes (2-12)';
  container.appendChild(extendedSymmetryControl);

  // Scale sequence toggle
  const scaleSequenceToggle = createToggleControl('Auto Scale Sequence', false, (value) => {
    state.emojiMandala.scaleSequenceEnabled = value;
    if (value) {
      state.emojiMandala.lastScaleChange = performance.now();
      console.log(`🎛️ Scale sequencing ON: ${state.emojiMandala.scaleSequence.join(' → ')}`);
    } else {
      console.log("🎛️ Scale sequencing OFF");
    }
  });
  scaleSequenceToggle.title = 'Auto-advance through scale progression';
  container.appendChild(scaleSequenceToggle);

  // Scale sequence interval slider
  const scaleIntervalControl = createSliderControl('Scale Change Interval (s)', 4, 1, 10, 0.5, (value) => {
    state.emojiMandala.scaleSequenceInterval = value * 1000;
    console.log(`🎛️ Scale interval: ${value}s`);
  });
  scaleIntervalControl.title = 'Seconds between scale changes';
  container.appendChild(scaleIntervalControl);

  // Scale sequence editor (text input)
  const scaleSeqLabel = document.createElement("label");
  scaleSeqLabel.textContent = "Scale Sequence";
  scaleSeqLabel.style.cssText = 'display: block; font-size: 11px; margin-top: 10px; margin-bottom: 4px; color: #ff9944;';
  container.appendChild(scaleSeqLabel);

  const scaleSeqInput = document.createElement("input");
  scaleSeqInput.type = "text";
  scaleSeqInput.value = state.emojiMandala.scaleSequence.join(' ');
  scaleSeqInput.placeholder = "Major Dorian Mixolydian";
  scaleSeqInput.style.cssText = 'width: 100%; padding: 6px; background: rgba(0,0,0,0.5); border: 1px solid #ff9944; color: #ff9944; border-radius: 4px; margin-bottom: 10px; font-size: 11px;';

  scaleSeqInput.addEventListener("input", (e) => {
    const scales = e.target.value.split(/\s+/).filter(s => s.length > 0);
    state.emojiMandala.scaleSequence = scales;
    console.log(`🎛️ Scale sequence updated: ${scales.join(' → ')}`);
  });
  scaleSeqInput.title = 'Space-separated scale names';
  container.appendChild(scaleSeqInput);

  console.log("🌀 Mandala HUD section created");
}

// Phase 13.4.2: Export refresh callback for manual registration
// (Called from hud.js after all modules loaded to avoid circular dependency)
export function refreshMandalaHUD() {
  console.log("🌀 HUD(Mandala): refresh");
}
