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
  const velocityControl = createSliderControl('Orbital Speed', 0.05, 0.0, 2.0, 0.01, (value) => {
    notifyHUDUpdate({ particlesVelocity: value });
  });
  velocityControl.title = 'Controls particle orbital speed around vessel (0.0 = static, reacts to audio)';
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

  // ——— Phase 13.4: Chladni & Moiré Pattern Controls ———
  const patternSeparator = document.createElement('hr');
  patternSeparator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  container.appendChild(patternSeparator);

  const patternTitle = document.createElement('h4');
  patternTitle.textContent = '🌀 Pattern Modes';
  patternTitle.style.cssText = 'margin: 0 0 10px 0; color: #ff69b4; font-size: 12px;';
  container.appendChild(patternTitle);

  // Chladni pattern toggle
  const chladniControl = createToggleControl('Chladni Plates', false, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.chladniEnabled = value;
      console.log(`🌀 Chladni pattern: ${value ? 'ON' : 'OFF'}`);
    } else {
      console.warn('🌀 Particle system not initialized yet');
    }
  });
  chladniControl.title = 'Audio-reactive resonance plate patterns';
  container.appendChild(chladniControl);

  // Chladni M mode slider
  const chladniMControl = createSliderControl('Chladni M', 3, 1, 8, 1, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.chladniM = value;
      console.log(`🌀 Chladni M mode: ${value}`);
    }
  });
  chladniMControl.title = 'Horizontal mode number (1-8)';
  container.appendChild(chladniMControl);

  // Chladni N mode slider
  const chladniNControl = createSliderControl('Chladni N', 4, 1, 8, 1, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.chladniN = value;
      console.log(`🌀 Chladni N mode: ${value}`);
    }
  });
  chladniNControl.title = 'Vertical mode number (1-8)';
  container.appendChild(chladniNControl);

  // Chladni frequency slider
  const chladniFreqControl = createSliderControl('Chladni Frequency', 1.0, 0.0, 3.0, 0.1, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.chladniFrequency = value;
      console.log(`🌀 Chladni frequency: ${value.toFixed(1)}`);
    }
  });
  chladniFreqControl.title = 'Oscillation speed (0.0 = static, reacts to audio)';
  container.appendChild(chladniFreqControl);

  // Moiré pattern toggle
  const moireControl = createToggleControl('Moiré Patterns', false, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.moireEnabled = value;
      console.log(`🌀 Moiré pattern: ${value ? 'ON' : 'OFF'}`);
    } else {
      console.warn('🌀 Particle system not initialized yet');
    }
  });
  moireControl.title = 'Audio-reactive interference patterns';
  container.appendChild(moireControl);

  // Moiré scale slider
  const moireScaleControl = createSliderControl('Moiré Scale', 1.0, 0.5, 3.0, 0.1, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.moireScale = value;
      console.log(`🌀 Moiré scale: ${value.toFixed(1)}`);
    }
  });
  moireScaleControl.title = 'Pattern frequency (0.5-3.0)';
  container.appendChild(moireScaleControl);

  // Moiré speed slider
  const moireSpeedControl = createSliderControl('Moiré Speed', 0.01, 0.0, 0.05, 0.001, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.moireSpeed = value;
      console.log(`🌀 Moiré speed: ${value.toFixed(3)}`);
    }
  });
  moireSpeedControl.title = 'Rotation speed (0.0 = static, reacts to audio)';
  container.appendChild(moireSpeedControl);

  // ——— Phase 13.6: Advanced Cymatic Pattern Controls ———
  const advancedPatternSeparator = document.createElement('hr');
  advancedPatternSeparator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  container.appendChild(advancedPatternSeparator);

  const advancedPatternTitle = document.createElement('h3');
  advancedPatternTitle.textContent = '🌌 Advanced Cymatics';
  advancedPatternTitle.style.cssText = 'margin: 0 0 10px 0; color: #00d9ff; font-size: 12px;';
  container.appendChild(advancedPatternTitle);

  // Spectrogram tessellations toggle
  const spectrogramControl = createToggleControl('Spectrogram Mandala', false, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.spectrogramEnabled = value;
      console.log(`🌌 Spectrogram tessellations: ${value ? 'ON' : 'OFF'}`);
    }
  });
  spectrogramControl.title = 'FFT frequency bins mapped to radial mandala';
  container.appendChild(spectrogramControl);

  // Spectrogram bands slider
  const spectrogramBandsControl = createSliderControl('Spectrogram Bands', 32, 8, 64, 4, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.spectrogramBands = value;
      console.log(`🌌 Spectrogram bands: ${value}`);
    }
  });
  spectrogramBandsControl.title = 'Number of frequency bands (8-64)';
  container.appendChild(spectrogramBandsControl);

  // Spectrogram speed slider
  const spectrogramSpeedControl = createSliderControl('Spectrogram Speed', 0.01, 0.0, 0.05, 0.001, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.spectrogramSpeed = value;
      console.log(`🌌 Spectrogram speed: ${value.toFixed(3)}`);
    }
  });
  spectrogramSpeedControl.title = 'Rotation speed (0.0 = static)';
  container.appendChild(spectrogramSpeedControl);

  // Phase-shift interference toggle
  const phaseShiftControl = createToggleControl('Holographic Moiré', false, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.phaseShiftEnabled = value;
      console.log(`🌌 Phase-shift interference: ${value ? 'ON' : 'OFF'}`);
    }
  });
  phaseShiftControl.title = 'Multi-layer phase interference patterns';
  container.appendChild(phaseShiftControl);

  // Phase-shift layers slider
  const phaseShiftLayersControl = createSliderControl('Phase Layers', 3, 2, 6, 1, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.phaseShiftLayers = value;
      console.log(`🌌 Phase layers: ${value}`);
    }
  });
  phaseShiftLayersControl.title = 'Number of interference layers (2-6)';
  container.appendChild(phaseShiftLayersControl);

  // Phase-shift speed slider
  const phaseShiftSpeedControl = createSliderControl('Phase Speed', 0.02, 0.0, 0.1, 0.01, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.phaseShiftSpeed = value;
      console.log(`🌌 Phase speed: ${value.toFixed(2)}`);
    }
  });
  phaseShiftSpeedControl.title = 'Animation speed (0.0 = static)';
  container.appendChild(phaseShiftSpeedControl);

  // Phase-shift depth slider
  const phaseShiftDepthControl = createSliderControl('Holographic Depth', 1.0, 0.0, 3.0, 0.1, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.phaseShiftDepth = value;
      console.log(`🌌 Holographic depth: ${value.toFixed(1)}`);
    }
  });
  phaseShiftDepthControl.title = '3D depth displacement (0.0-3.0)';
  container.appendChild(phaseShiftDepthControl);

  // Diffraction toggle
  const diffractionControl = createToggleControl('Spectral Diffraction', false, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.diffractionEnabled = value;
      console.log(`🌌 Spectral diffraction: ${value ? 'ON' : 'OFF'}`);
    }
  });
  diffractionControl.title = 'Rainbow prismatic dispersion and iridescence';
  container.appendChild(diffractionControl);

  // Diffraction intensity slider
  const diffractionIntensityControl = createSliderControl('Diffraction Intensity', 1.0, 0.0, 3.0, 0.1, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.diffractionIntensity = value;
      console.log(`🌌 Diffraction intensity: ${value.toFixed(1)}`);
    }
  });
  diffractionIntensityControl.title = 'Color intensity and dispersion strength (0.0-3.0)';
  container.appendChild(diffractionIntensityControl);

  // Diffraction speed slider
  const diffractionSpeedControl = createSliderControl('Diffraction Speed', 0.01, 0.0, 0.05, 0.001, async (value) => {
    const { getParticleSystemInstance } = await import('./particles.js');
    const particles = getParticleSystemInstance();
    if (particles) {
      particles.diffractionSpeed = value;
      console.log(`🌌 Diffraction speed: ${value.toFixed(3)}`);
    }
  });
  diffractionSpeedControl.title = 'Prism rotation speed (0.0 = static)';
  container.appendChild(diffractionSpeedControl);

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

  // ——— Stage 2: Game Mode Controls ———
  const gameModeSeparator = document.createElement('hr');
  gameModeSeparator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  container.appendChild(gameModeSeparator);

  const gameModeTitle = document.createElement('h4');
  gameModeTitle.textContent = '🎮 Stage 2: Game Mode';
  gameModeTitle.style.cssText = 'margin: 0 0 10px 0; color: #ff6600; font-size: 12px;';
  container.appendChild(gameModeTitle);

  // Game mode toggle
  const gameModeControl = createToggleControl('Enable Game Mode', false, async (value) => {
    const { getGameModeInstance } = await import('./main.js');
    const gameMode = getGameModeInstance();
    if (gameMode) {
      gameMode.toggle();
      console.log(`🎮 Game Mode: ${value ? 'ON' : 'OFF'}`);
    } else {
      console.warn('🎮 Game mode not initialized yet');
    }
  });
  gameModeControl.title = 'Toggle deer shooting game mode';
  container.appendChild(gameModeControl);

  // Score and Health display container
  const gameStatsDiv = document.createElement('div');
  gameStatsDiv.style.cssText = 'margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px;';

  // Score display
  const scoreDiv = document.createElement('div');
  scoreDiv.id = 'game-mode-score';
  scoreDiv.style.cssText = 'font-size: 14px; color: #ff6600; margin-bottom: 5px;';
  scoreDiv.textContent = 'Score: 0';
  gameStatsDiv.appendChild(scoreDiv);

  // Health display
  const healthDiv = document.createElement('div');
  healthDiv.id = 'game-mode-health';
  healthDiv.style.cssText = 'font-size: 14px; color: #ff0066;';
  healthDiv.innerHTML = 'Health: <span style="color: #ff3366;">❤️❤️❤️</span>';
  gameStatsDiv.appendChild(healthDiv);

  container.appendChild(gameStatsDiv);

  // Instructions
  const instructionsDiv = document.createElement('div');
  instructionsDiv.style.cssText = 'margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 5px; font-size: 11px; color: #888;';
  instructionsDiv.innerHTML = '<strong>Controls:</strong><br/>Click to shoot red burst particles<br/>Hit the deer emojis flying through space';
  container.appendChild(instructionsDiv);

  console.log("✨ Particles HUD section created");
}

// Phase 13.4.2: Export refresh callback for manual registration
export function refreshParticlesHUD() {
  console.log("✨ HUD(Particles): refresh");
}
