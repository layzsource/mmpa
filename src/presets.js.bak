import { state } from './state.js';
import { initParticles } from './particles.js';

console.log("💾 presets.js loaded");

const STORAGE_KEY = 'morphing_interface_presets';
let currentPresetName = null;
let presetCallbacks = [];

export function initPresets() {
  console.log("💾 Presets system initialized");
}

export function savePreset(name, stateOverride, category = 'Uncategorized', tags = []) {
  if (!name || typeof name !== 'string') {
    console.warn('💾 Invalid preset name:', name);
    return false;
  }

  const presets = getPresetsFromStorage();

  // Phase 11.5.1: colorLayers should always come from global state, not overrides
  // Default presets (lines 378+) don't include colorLayers in their overrides
  if (!state.colorLayers) {
    console.warn("⚠️ savePreset(): colorLayers missing in global state");
    return false;
  }

  // Phase 11.2.9: Helper to safely extract layer properties with defaults
  const safeLayer = (layer) => {
    if (layer === "geometry") {
      return {
        baseColor: state.colorLayers?.geometry?.baseColor ?? "#ffffff",
        audioColor: state.colorLayers?.geometry?.audioColor ?? "#000000",
        audioIntensity: state.colorLayers?.geometry?.audioIntensity ?? 1.0
        // geometry has NO opacity property
      };
    }
    return {
      baseColor: state.colorLayers?.[layer]?.baseColor ?? "#ffffff",
      audioColor: state.colorLayers?.[layer]?.audioColor ?? "#000000",
      audioIntensity: state.colorLayers?.[layer]?.audioIntensity ?? 1.0,
      opacity: state?.[layer]?.opacity ?? 1.0
    };
  };

  const presetData = {
    name,
    timestamp: new Date().toISOString(),
    category: category || 'Uncategorized',
    tags: Array.isArray(tags) ? tags : [],
    visualSettings: { ...state.lighting },
    morphWeights: { ...state.morphWeights },
    color: state.color,
    idleSpin: state.idleSpin,
    scale: state.scale,

    // Phase 11.2.9: ColorLayers with safeLayer helper
    colorLayers: {
      geometry: safeLayer("geometry"),
      vessel: safeLayer("vessel"),
      shadows: safeLayer("shadows"),
      particles: safeLayer("particles")
    },

    vessel: {
      opacity: state.vessel?.opacity ?? 0.5,
      scale: state.vessel?.scale ?? 1.0,
      color: state.vessel?.color ?? '#00ff00',
      enabled: state.vessel?.enabled ?? true,
      spinEnabled: state.vessel?.spinEnabled ?? false,
      spinSpeed: state.vessel?.spinSpeed ?? 0.0035,
      layout: state.vessel?.layout ?? 'lattice',
      layoutIndex: state.vessel?.layoutIndex ?? 0,
      audioSmoothing: state.vessel?.audioSmoothing ?? 0.7,
      hueShiftRange: state.vessel?.hueShiftRange ?? 20
    },
    shadows: {
      enabled: state.shadows?.enabled ?? true,
      ground: state.shadows?.ground ?? true,
      backdrop: state.shadows?.backdrop ?? true,
      opacity: state.shadows?.opacity ?? 0.25,
      color: state.shadows?.color ?? '#000000'
    },
    sprites: {
      enabled: state.sprites?.enabled ?? true,
      count: state.sprites?.count ?? 200
    },
    particles: {
      enabled: state.particles?.enabled ?? true,
      count: state.particles?.count ?? 5000,
      layout: state.particles?.layout ?? 'cube',
      hue: state.particles?.hue ?? 0,
      size: state.particles?.size ?? 0.02,
      opacity: state.particles?.opacity ?? 0.5,
      organicMotion: state.particles?.organicMotion ?? false,
      organicStrength: state.particles?.organicStrength ?? 0.2,
      audioReactiveHue: state.particles?.audioReactiveHue ?? false,
      velocity: state.particles?.velocity ?? 0.05,
      orbitalSpeed: state.particles?.orbitalSpeed ?? 0.05,
      motionSmoothness: state.particles?.motionSmoothness ?? 0.5,
      spread: state.particlesMotion?.spread ?? 1.0,
      minCount: state.particles?.minCount ?? 1000,
      maxCount: state.particles?.maxCount ?? 10000,
      minSize: state.particles?.minSize ?? 0.005,
      maxSize: state.particles?.maxSize ?? 0.1
    },

    // Phase 11.7.15: Emoji Mixer streams
    emojiStreams: state.emojiStreams ?? [],

    // Phase 11.7.16: Emoji Sequencer
    emojiSequencer: {
      enabled: state.emojiSequencer?.enabled ?? false,
      bpm: state.emojiSequencer?.bpm ?? 120,
      patterns: state.emojiSequencer?.patterns ?? {},
      timelineLength: state.emojiSequencer?.timelineLength ?? 16
    },

    // Phase 11.7.17: Emoji Pattern Banks
    emojiBanks: state.emojiBanks ?? [null, null, null, null, null, null, null, null],
    currentBank: state.currentBank ?? null
  };

  presets[name] = presetData;
  savePresetsToStorage(presets);

  currentPresetName = name;
  console.log(`💾 Preset saved: ${name}`);

  notifyPresetUpdate({ action: 'saved', presetName: name });
  return true;
}

export function loadPreset(name) {
  if (!name || typeof name !== 'string') {
    console.warn('💾 Invalid preset name:', name);
    return null;
  }

  const presets = getPresetsFromStorage();
  const preset = presets[name];

  if (!preset) {
    console.warn(`💾 Preset not found: ${name}`);
    return null;
  }

  // Restore state from preset
  if (preset.visualSettings) {
    Object.assign(state.lighting, preset.visualSettings);
  }
  if (preset.morphWeights) {
    Object.assign(state.morphWeights, preset.morphWeights);
  }
  if (preset.color) {
    state.color = preset.color;
  }
  if (preset.idleSpin !== undefined) {
    state.idleSpin = preset.idleSpin;
  }
  if (preset.scale !== undefined) {
    state.scale = preset.scale;
  }
  if (preset.vessel) {
    if (preset.vessel.opacity !== undefined) state.vessel.opacity = preset.vessel.opacity;
    if (preset.vessel.scale !== undefined) state.vessel.scale = preset.vessel.scale;
    if (preset.vessel.color !== undefined) state.vessel.color = preset.vessel.color;
    if (preset.vessel.enabled !== undefined) state.vessel.enabled = preset.vessel.enabled;
    if (preset.vessel.spinEnabled !== undefined) state.vessel.spinEnabled = preset.vessel.spinEnabled;
    if (preset.vessel.spinSpeed !== undefined) state.vessel.spinSpeed = preset.vessel.spinSpeed;
    if (preset.vessel.layout !== undefined) {
      state.vessel.layout = preset.vessel.layout;
      // Update layoutIndex to match (with fallback)
      const layouts = ["lattice", "hoops", "shells"];
      state.vessel.layoutIndex = preset.vessel.layoutIndex !== undefined ?
        preset.vessel.layoutIndex : layouts.indexOf(preset.vessel.layout);
      // Reinitialize vessel with new layout
      import('./vessel.js').then(({ reinitVessel }) => {
        import('./geometry.js').then(({ scene }) => {
          reinitVessel(scene);
        });
      });
    }
    if (preset.vessel.audioSmoothing !== undefined) state.vessel.audioSmoothing = preset.vessel.audioSmoothing;
    if (preset.vessel.hueShiftRange !== undefined) state.vessel.hueShiftRange = preset.vessel.hueShiftRange;
  }

  // Load shadows state (with backward compatibility)
  if (preset.shadows) {
    if (preset.shadows.enabled !== undefined) state.shadows.enabled = preset.shadows.enabled;
    if (preset.shadows.ground !== undefined) state.shadows.ground = preset.shadows.ground;
    if (preset.shadows.backdrop !== undefined) state.shadows.backdrop = preset.shadows.backdrop;
    if (preset.shadows.opacity !== undefined) state.shadows.opacity = preset.shadows.opacity;
    if (preset.shadows.color !== undefined) state.shadows.color = preset.shadows.color;
  } else {
    // Backward compatibility: missing keys default to enabled/black
    state.shadows.enabled = true;
    state.shadows.ground = true;
    state.shadows.backdrop = true;
    state.shadows.opacity = 0.25;
    state.shadows.color = '#000000';
  }

  // Load sprites state (with backward compatibility)
  if (preset.sprites) {
    state.sprites.enabled = preset.sprites.enabled ?? true;
    state.sprites.count = preset.sprites.count ?? 200;
  } else {
    // Backward compatibility: default to enabled
    state.sprites = { enabled: true, count: 200 };
  }

  // Load particles state (with backward compatibility)
  if (preset.particles) {
    if (preset.particles.enabled !== undefined) state.particles.enabled = preset.particles.enabled;
    if (preset.particles.count !== undefined) state.particles.count = preset.particles.count;
    if (preset.particles.layout !== undefined) state.particles.layout = preset.particles.layout;

    // Particle polish properties (with backward compatibility and safe defaults)
    state.particles.hue = preset.particles.hue ?? 0;
    state.particles.size = preset.particles.size ?? 0.02; // Phase 4.4: smaller default
    state.particles.opacity = preset.particles.opacity ?? 0.5;
    state.particles.organicMotion = preset.particles.organicMotion ?? false;
    state.particles.organicStrength = preset.particles.organicStrength ?? 0.2; // Phase 4.2
    state.particles.audioReactiveHue = preset.particles.audioReactiveHue ?? false;

    // Velocity: prefer new single value, fallback to legacy motion.velocity
    state.particles.velocity = preset.particles.velocity ?? preset.particles.motion?.velocity ?? 0.05;
    state.particles.orbitalSpeed = preset.particles.orbitalSpeed ?? preset.particles.velocity ?? 0.05; // Phase 4.2a: gentle default
    state.particles.motionSmoothness = preset.particles.motionSmoothness ?? 0.5;

    // Phase 4.4: adjusted ranges for higher density/smaller particles
    state.particles.minCount = preset.particles.minCount ?? 1000;
    state.particles.maxCount = preset.particles.maxCount ?? 10000;
    state.particles.minSize = preset.particles.minSize ?? 0.005;
    state.particles.maxSize = preset.particles.maxSize ?? 0.1;

    // Legacy spread support only
    state.particlesMotion = {
      velocity: 0.5,  // Deprecated, not used
      spread: preset.particles.spread ?? preset.particles.motion?.spread ?? 1.0
    };

    // Note: HUD sliders are now controlled via HUD update callbacks, no manual sync needed

    // Reinitialize particles with new layout
    if (state?.particles?.enabled) {
      initParticles(state.particles);
      console.log("✨ Particles reinitialized via initParticles");
    } else if (!state?.particles) {
      console.warn("⚠️ No state.particles found when loading preset");
    }
  } else {
    // Default to safe values for legacy presets (Phase 4.4: higher density/smaller particles)
    state.particles.layout = 'cube';
    state.particles.hue = 0;
    state.particles.size = 0.02; // Phase 4.4: smaller default
    state.particles.opacity = 0.5;
    state.particles.organicMotion = false;
    state.particles.organicStrength = 0.2; // Phase 4.2
    state.particles.audioReactiveHue = false;
    state.particles.velocity = 0.05;
    state.particles.orbitalSpeed = 0.05; // Phase 4.2a: gentle default
    state.particles.motionSmoothness = 0.5;
    state.particles.minCount = 1000; // Phase 4.4: adjusted
    state.particles.maxCount = 10000; // Phase 4.4: adjusted
    state.particles.minSize = 0.005; // Phase 4.4: adjusted
    state.particles.maxSize = 0.1; // Phase 4.4: adjusted
    state.particlesMotion = {
      velocity: 0.5,
      spread: 1.0
    };
  }

  // Phase 11.2.9: Load colorLayers (with backward compatibility)
  if (preset.colorLayers) {
    if (preset.colorLayers.geometry) {
      state.colorLayers.geometry.baseColor = preset.colorLayers.geometry.baseColor ?? '#00ff00';
      state.colorLayers.geometry.audioColor = preset.colorLayers.geometry.audioColor ?? '#ff0000';
      state.colorLayers.geometry.audioIntensity = preset.colorLayers.geometry.audioIntensity ?? 0.5;
    }
    if (preset.colorLayers.vessel) {
      state.colorLayers.vessel.baseColor = preset.colorLayers.vessel.baseColor ?? '#00ff00';
      state.colorLayers.vessel.audioColor = preset.colorLayers.vessel.audioColor ?? '#00ffff';
      state.colorLayers.vessel.audioIntensity = preset.colorLayers.vessel.audioIntensity ?? 0.3;
    }
    if (preset.colorLayers.shadows) {
      state.colorLayers.shadows.baseColor = preset.colorLayers.shadows.baseColor ?? '#000000';
      state.colorLayers.shadows.audioColor = preset.colorLayers.shadows.audioColor ?? '#333333';
      state.colorLayers.shadows.audioIntensity = preset.colorLayers.shadows.audioIntensity ?? 0.2;
    }
    if (preset.colorLayers.particles) {
      state.colorLayers.particles.baseColor = preset.colorLayers.particles.baseColor ?? '#ffff00';
      state.colorLayers.particles.audioColor = preset.colorLayers.particles.audioColor ?? '#ff00ff';
      state.colorLayers.particles.audioIntensity = preset.colorLayers.particles.audioIntensity ?? 0.7;
    }
    console.log("💾 ColorLayers loaded from preset");
  } else {
    console.log("💾 Legacy preset: colorLayers not found, using defaults");
  }

  // Phase 11.7.15: Load emoji streams
  if (preset.emojiStreams) {
    state.emojiStreams = preset.emojiStreams;
    if (window.emojiStreamManager) {
      window.emojiStreamManager.loadStreams(preset.emojiStreams);
      console.log(`🎨 Loaded ${preset.emojiStreams.length} emoji streams`);
    }
    // Rebuild HUD UI
    if (window.rebuildEmojiMixerUI) {
      window.rebuildEmojiMixerUI();
    }
  } else {
    state.emojiStreams = [];
    if (window.rebuildEmojiMixerUI) {
      window.rebuildEmojiMixerUI();
    }
  }

  // Phase 11.7.16: Load emoji sequencer
  if (preset.emojiSequencer) {
    state.emojiSequencer = {
      enabled: preset.emojiSequencer.enabled ?? false,
      bpm: preset.emojiSequencer.bpm ?? 120,
      patterns: preset.emojiSequencer.patterns ?? {},
      timelineLength: preset.emojiSequencer.timelineLength ?? 16,
      currentBeat: 0 // Always reset to 0 on load
    };
    if (window.emojiSequencer) {
      window.emojiSequencer.loadFromState(state.emojiSequencer);
      console.log(`🎶 Sequencer loaded: ${state.emojiSequencer.bpm} BPM, ${state.emojiSequencer.timelineLength} beats`);
    }
    // Rebuild sequencer grid
    if (window.rebuildSequencerGrid) {
      window.rebuildSequencerGrid();
    }
  } else {
    // Default sequencer state for legacy presets
    state.emojiSequencer = {
      enabled: false,
      bpm: 120,
      currentBeat: 0,
      patterns: {},
      timelineLength: 16
    };
    if (window.rebuildSequencerGrid) {
      window.rebuildSequencerGrid();
    }
  }

  // Phase 11.7.17: Load emoji pattern banks
  if (preset.emojiBanks) {
    state.emojiBanks = preset.emojiBanks;
    state.currentBank = preset.currentBank ?? null;
    if (window.emojiBankManager) {
      window.emojiBankManager.loadBanksFromState(preset.emojiBanks);
      const loadedCount = state.emojiBanks.filter(b => b !== null).length;
      console.log(`💾 Loaded ${loadedCount} pattern banks`);
    }
    // Update bank button states
    if (window.updateBankButtonStates) {
      window.updateBankButtonStates();
    }
  } else {
    // Default banks for legacy presets
    state.emojiBanks = [null, null, null, null, null, null, null, null];
    state.currentBank = null;
    if (window.updateBankButtonStates) {
      window.updateBankButtonStates();
    }
  }

  currentPresetName = name;
  console.log(`💾 Preset loaded: ${name}`);

  notifyPresetUpdate({ action: 'loaded', presetName: name, presetData: preset });
  return preset;
}

export function deletePreset(name) {
  if (!name || typeof name !== 'string') {
    console.warn('💾 Invalid preset name:', name);
    return false;
  }

  const presets = getPresetsFromStorage();

  if (!presets[name]) {
    console.warn(`💾 Preset not found: ${name}`);
    return false;
  }

  delete presets[name];
  savePresetsToStorage(presets);

  if (currentPresetName === name) {
    currentPresetName = null;
  }

  console.log(`💾 Preset deleted: ${name}`);
  notifyPresetUpdate({ action: 'deleted', presetName: name });
  return true;
}

export function listPresets() {
  const presets = getPresetsFromStorage();
  return Object.keys(presets).sort();
}

// Phase 11.3.0: Expose listPresets as window helper for HUD
if (typeof window !== "undefined") {
  window.__PRESET_NAMES__ = listPresets;
}

export function getCurrentPresetName() {
  return currentPresetName;
}

// Phase 13.16: Expose getCurrentPresetName for timeline capture
if (typeof window !== "undefined") {
  window.getCurrentPresetName = getCurrentPresetName;
}

export function getPresetData(name) {
  const presets = getPresetsFromStorage();
  return presets[name] || null;
}

export function onPresetUpdate(callback) {
  presetCallbacks.push(callback);
}

function getPresetsFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('💾 Error reading presets from localStorage:', error);
    return {};
  }
}

function savePresetsToStorage(presets) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('💾 Error saving presets to localStorage:', error);
  }
}

function notifyPresetUpdate(updateData) {
  presetCallbacks.forEach(callback => {
    try {
      callback(updateData);
    } catch (error) {
      console.error('💾 Error in preset callback:', error);
    }
  });
}

// Create a few default presets on first run
export function createDefaultPresets() {
  const presets = getPresetsFromStorage();

  if (Object.keys(presets).length === 0) {
    console.log("💾 Creating default presets...");

    // Cube Default
    savePreset('Cube Default', {
      morphWeights: { cube: 1.0, sphere: 0.0, pyramid: 0.0, torus: 0.0 },
      morphBlend: 0.0,
      currentTarget: 'cube',
      hudIdleSpin: true,
      hudRotX: 0,
      hudRotY: 0,
      hudScale: 1.0,
      visualSettings: {
        color: '#ff0000',
        hue: 0
      }
    });

    // Sphere Focus
    savePreset('Sphere Focus', {
      morphWeights: { cube: 0.0, sphere: 1.0, pyramid: 0.0, torus: 0.0 },
      morphBlend: 0.0,
      currentTarget: 'sphere',
      hudIdleSpin: true,
      hudRotX: 0,
      hudRotY: 0,
      hudScale: 1.0,
      visualSettings: {
        color: '#00ff00',
        hue: 120
      }
    });

    // Mixed Blend
    savePreset('Mixed Blend', {
      morphWeights: { cube: 0.3, sphere: 0.3, pyramid: 0.2, torus: 0.2 },
      morphBlend: 0.0,
      currentTarget: 'cube',
      hudIdleSpin: true,
      hudRotX: 0,
      hudRotY: 0,
      hudScale: 1.0,
      visualSettings: {
        color: '#0000ff',
        hue: 240
      }
    });
  }
}