// hudParticles.js - Phase 11.7.50: Modular Particles HUD Section
// Extracted from hud.js for better organization

import { state } from './state.js';
import { HUD, notifyHUDUpdate, registerHUDCallback } from "./hud.js";

console.log("✨ hudParticles.js loaded");

/**
 * Create Particles HUD section with all controls
 * @param {HTMLElement} container - Parent container to append controls to
 * @param {Function} notifyHUDUpdate - Callback to notify main HUD of state changes
 * @param {Function} createToggleControl - Helper function for toggle controls
 * @param {Function} createSliderControl - Helper function for slider controls
 */
export function createParticlesHudSection(container, notifyHUDUpdate, createToggleControl, createSliderControl) {
  // Add separator for particle controls
  const particleSeparator = document.createElement('hr');
  particleSeparator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  container.appendChild(particleSeparator);

  const particleTitle = document.createElement('h4');
  particleTitle.textContent = '✨ Particles';
  particleTitle.style.cssText = 'margin: 0 0 10px 0; color: #00ffff; font-size: 12px;';
  container.appendChild(particleTitle);

  // === Phase 4.8.1: Performance HUD ===
  const perfDiv = document.createElement('div');
  perfDiv.style.cssText = 'margin-bottom: 15px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px;';

  const fpsLabel = document.createElement('div');
  fpsLabel.innerHTML = '<span style="color: #888;">FPS:</span> <span id="hud-fps" style="color: #0f0;">--</span>';
  fpsLabel.style.cssText = 'margin-bottom: 5px; font-size: 12px;';
  perfDiv.appendChild(fpsLabel);

  const drawCallsLabel = document.createElement('div');
  drawCallsLabel.innerHTML = '<span style="color: #888;">Draw Calls:</span> <span id="hud-drawcalls" style="color: #0ff;">--</span>';
  drawCallsLabel.style.cssText = 'font-size: 12px;';
  perfDiv.appendChild(drawCallsLabel);

  container.appendChild(perfDiv);

  // Particles enable toggle
  const particlesEnableControl = createToggleControl('Enable Particles', true, (value) => {
    notifyHUDUpdate({ particlesEnabled: value });
  });
  container.appendChild(particlesEnableControl);

  // Particle density slider (Phase 4.4: expanded to 10,000)
  const particleDensityControl = createSliderControl('Particle Density', 5000, 1000, 10000, 100, (value) => {
    notifyHUDUpdate({ particlesCount: value });
  });
  particleDensityControl.title = 'Number of particles (1000-10000, requires reinit)';
  container.appendChild(particleDensityControl);

  // Particle layout dropdown
  const particleLayoutDiv = document.createElement('div');
  particleLayoutDiv.style.cssText = 'margin-bottom: 10px;';

  const particleLayoutLabel = document.createElement('label');
  particleLayoutLabel.textContent = 'Layout';
  particleLayoutLabel.style.cssText = 'display: block; margin-bottom: 5px; color: #ccc; font-size: 12px;';
  particleLayoutDiv.appendChild(particleLayoutLabel);

  const particleLayoutSelect = document.createElement('select');
  particleLayoutSelect.id = 'particle-layout-dropdown';
  particleLayoutSelect.style.cssText = 'width: 100%; padding: 5px; background: #333; color: white; border: 1px solid #555; border-radius: 3px;';

  ['cube', 'sphere', 'torus', 'vesselPlanes'].forEach(option => {
    const optionEl = document.createElement('option');
    optionEl.value = option;
    // Special case for vesselPlanes display name
    if (option === 'vesselPlanes') {
      optionEl.textContent = 'Vessel Planes';
    } else {
      optionEl.textContent = option.charAt(0).toUpperCase() + option.slice(1);
    }
    optionEl.selected = option === 'cube';
    particleLayoutSelect.appendChild(optionEl);
  });

  // Phase 4.3b: Add event listener for layout changes
  particleLayoutSelect.addEventListener('change', () => {
    notifyHUDUpdate({ particlesLayout: particleLayoutSelect.value });
  });

  particleLayoutDiv.appendChild(particleLayoutSelect);
  container.appendChild(particleLayoutDiv);

  // ✨ Particle Polish section
  const particlePolishLabel = document.createElement("h4");
  particlePolishLabel.textContent = "✨ Particle Polish";
  particlePolishLabel.style.cssText = 'margin: 15px 0 10px 0; color: #ffff00; font-size: 12px;';
  container.appendChild(particlePolishLabel);

  // Hue shift slider (0-360)
  const hueShiftControl = createSliderControl('Hue Shift', 0, 0, 360, 5, (value) => {
    notifyHUDUpdate({ particlesHue: value });
  });
  container.appendChild(hueShiftControl);

  // Size slider (Phase 4.8: true world-unit sizing, 0.05-2.0)
  const sizeControl = createSliderControl('Size', 0.5, 0.05, 2.0, 0.05, (value) => {
    notifyHUDUpdate({ particlesSize: value });
  });
  sizeControl.title = 'True 3D world-unit size (0.05 = tiny, 2.0 = large)';
  container.appendChild(sizeControl);

  // Opacity slider (0.0-1.0)
  const opacityControl = createSliderControl('Opacity', 0.5, 0.0, 1.0, 0.05, (value) => {
    notifyHUDUpdate({ particlesOpacity: value });
  });
  container.appendChild(opacityControl);

  // Organic motion toggle
  const organicMotionControl = createToggleControl('Organic Motion', false, (value) => {
    notifyHUDUpdate({ particlesOrganicMotion: value });
  });
  container.appendChild(organicMotionControl);

  // Organic strength slider (Phase 4.8.1.7)
  const organicStrengthControl = createSliderControl('Organic Strength', 0.2, 0.0, 1.0, 0.05, (value) => {
    notifyHUDUpdate({ particlesOrganicStrength: value });
  });
  organicStrengthControl.title = 'Controls wander strength (0 = clean orbit, 1 = chaotic swarm)';
  container.appendChild(organicStrengthControl);

  // Audio-reactive hue toggle
  const audioHueControl = createToggleControl('Audio-Reactive Hue', false, (value) => {
    notifyHUDUpdate({ particlesAudioReactiveHue: value });
  });
  container.appendChild(audioHueControl);

  // Audio Gain slider (Phase 4.8)
  const audioGainControl = createSliderControl('Audio Gain', 2.0, 0.5, 5.0, 0.1, (value) => {
    notifyHUDUpdate({ particlesAudioGain: value });
  });
  audioGainControl.title = 'Amplifies per-particle audio hue variation';
  container.appendChild(audioGainControl);

  // Orbital Speed slider (Phase 4.9.0)
  const velocityControl = createSliderControl('Orbital Speed', 0.05, 0.01, 2.0, 0.01, (value) => {
    notifyHUDUpdate({ particlesVelocity: value });
  });
  velocityControl.title = 'Controls particle orbital speed around vessel (min: 0.01)';
  container.appendChild(velocityControl);

  // Motion Smoothness slider
  const motionSmoothnessControl = createSliderControl('Motion Smoothness', 0.5, 0.0, 1.0, 0.1, (value) => {
    notifyHUDUpdate({ particlesMotionSmoothness: value });
  });
  container.appendChild(motionSmoothnessControl);

  // Phase 11.7: Particle Motion Debug Controls (unique naming to avoid collisions)
  const particleDensityDebugControl = createSliderControl('Density (Debug)', 2000, 500, 4000, 100, (value) => {
    state.particleDensity = value;
    console.log(`🎛️ Particle density: ${value}`);
  });
  particleDensityDebugControl.title = 'Particle density (500-4000)';
  container.appendChild(particleDensityDebugControl);

  const particleSizeDebugControl = createSliderControl('Size (Debug)', 0.1, 0.05, 1.0, 0.05, (value) => {
    state.particleSize = value;
    console.log(`🎛️ Particle size: ${value}`);
  });
  particleSizeDebugControl.title = 'Particle size (0.05-1.0)';
  container.appendChild(particleSizeDebugControl);

  const particleMotionStrengthControl = createSliderControl('Motion Strength', 0.5, 0.0, 1.0, 0.1, (value) => {
    state.particleMotionStrength = value;
    console.log(`🎛️ Particle motion strength: ${value}`);
  });
  particleMotionStrengthControl.title = 'Global drift strength multiplier';
  container.appendChild(particleMotionStrengthControl);

  const particleAudioJitterControl = createToggleControl('Audio Jitter', true, (value) => {
    state.useAudioJitter = value;
    console.log(`🎛️ Audio jitter: ${value ? 'ON' : 'OFF'}`);
  });
  particleAudioJitterControl.title = 'Add velocity bursts on FFT peaks';
  container.appendChild(particleAudioJitterControl);

  // ——— Phase 13.11: Sprites Reactivity Controls (additive, safe) ———
  (function addSpriteControls() {
    // Safe guard: if config not present yet, skip rendering
    const cfg = window.SpritesReactConfig;
    if (!cfg) return;

    const wrap = document.createElement('div');
    wrap.style.cssText = 'margin-top:12px;padding-top:8px;border-top:1px solid #333;';
    wrap.innerHTML = `
      <div style="font-weight:600;margin-bottom:6px;">🧩 Sprites Reactivity</div>

      <label style="display:block;margin-bottom:4px;">Attack
        <input id="sp-attack" type="range" min="0.05" max="0.8" step="0.01">
      </label>

      <label style="display:block;margin:8px 0 4px;">Release
        <input id="sp-release" type="range" min="0.05" max="0.6" step="0.01">
      </label>

      <label style="display:block;margin:8px 0 4px;">Beat Threshold
        <input id="sp-thresh" type="range" min="0.2" max="0.9" step="0.01">
      </label>

      <label style="display:block;margin:8px 0 4px;">Size Amp
        <input id="sp-size" type="range" min="0.1" max="2.0" step="0.05">
      </label>

      <label style="display:block;margin:8px 0 4px;">Spawn Amp
        <input id="sp-spawn" type="range" min="0.1" max="3.0" step="0.05">
      </label>

      <label style="display:block;margin:8px 0 4px;">Hue Amp
        <input id="sp-hue" type="range" min="0" max="240" step="5">
      </label>

      <label style="display:block;margin:8px 0 4px;">Beat Flash
        <input id="sp-flash" type="range" min="0" max="0.8" step="0.05">
      </label>
    `;
    container.appendChild(wrap);

    const $ = (id) => wrap.querySelector(id);
    // Initialize sliders from current config
    $('#sp-attack').value  = cfg.attack ?? 0.35;
    $('#sp-release').value = cfg.release ?? 0.12;
    $('#sp-thresh').value  = cfg.beatThresh ?? 0.48;
    $('#sp-size').value    = cfg.sizeMulAmp ?? 1.10;
    $('#sp-spawn').value   = cfg.spawnAmp ?? 1.70;
    $('#sp-hue').value     = cfg.hueAmp ?? 140.0;
    $('#sp-flash').value   = cfg.beatFlash ?? 0.35;

    const apply = () => {
      cfg.attack     = parseFloat($('#sp-attack').value);
      cfg.release    = parseFloat($('#sp-release').value);
      cfg.beatThresh = parseFloat($('#sp-thresh').value);
      cfg.sizeMulAmp = parseFloat($('#sp-size').value);
      cfg.spawnAmp   = parseFloat($('#sp-spawn').value);
      cfg.hueAmp     = parseFloat($('#sp-hue').value);
      cfg.beatFlash  = parseFloat($('#sp-flash').value);
      console.log('🧩 SpritesReactConfig updated:', { ...cfg });
    };

    ['#sp-attack','#sp-release','#sp-thresh','#sp-size','#sp-spawn','#sp-hue','#sp-flash']
      .forEach(id => $(id).addEventListener('input', apply));
  })();

  console.log("✨ Particles HUD section created");
}

// Phase 13.4.2: Export refresh callback for manual registration
export function refreshParticlesHUD() {
  console.log("✨ HUD(Particles): refresh");
}
