// ✅ Phase 13.27 — Console noise guard (local-only, easy to remove)
(() => {
  const DROP = [
    "HUD audioReactive update",
    "HUD(Audio): refresh",
    "HUD(Particles): refresh",
    "HUD(Mandala): refresh",
  ];
  const _log = console.log;
  console.log = (...a) => {
    const first = a[0];
    if (typeof first === "string" && DROP.some(s => first.includes(s))) return;
    _log(...a);
  };
})();

// ✅ HUD Safe Initialization Patch (Phase 12.1.0)
// Absolute circular-import safety

// Phase 13.25-lite: HUD audio log toggle (default OFF)
window.__HUD_AUDIO_LOGS__ = false;

// ✅ Phase 13.2.f — HUD Signal Bridge (unified dispatcher)
export const HUD = {
  listeners: new Set(),
  subscribe(fn) { if (typeof fn === "function") this.listeners.add(fn); },
  unsubscribe(fn) { this.listeners.delete(fn); },
  notify() {
    for (const fn of this.listeners) {
      try { fn(); } catch (e) { console.error("HUD listener error:", e); }
    }
  }
};

// Back-compat shims (replace any old use sites)
// Phase 13.4.1: Fix notifyHUDUpdate to pass data to hudRouter
export function notifyHUDUpdate(update) {
  if (update && typeof update === 'object') {
    // HUD control changed - notify hudRouter with data
    console.log('📟 notifyHUDUpdate called with:', Object.keys(update));
    if (typeof window._hudRouterCallback === "function") {
      try {
        window._hudRouterCallback(update);
      } catch (error) {
        console.error('📟 Error in HUD router callback:', error);
      }
    } else {
      console.warn('⚠️ No hudRouter callback registered!');
    }
  } else {
    // Simple refresh notification - notify all Signal Bridge listeners
    HUD.notify();
  }
}

export function registerHUDCallback(_section, fn) { HUD.subscribe(fn); }

// Guard the legacy global so old code doesn't crash
if (!window.hudCallbacks || typeof window.hudCallbacks !== "object") {
  window.hudCallbacks = {};
}
window.hudCallbacks.notify = notifyHUDUpdate; // legacy alias

console.log("📟 hud.js: HUD Signal Bridge online");

export const hudCallbacks = window.hudCallbacks;

// Legacy compatibility: onHUDUpdate
// This is used by hudRouter.js to register its update handler
export function onHUDUpdate(callback) {
  if (typeof callback === "function") {
    // Register the hudRouter callback globally so notifyHUDUpdate can call it
    window._hudRouterCallback = callback;
    console.log("📟 HUD router callback registered");
  } else {
    // When called with no args, trigger all callbacks
    notifyHUDUpdate();
  }
}

console.log("📟 HUD registry initialized");

import { state } from './state.js';
import { createMorphHudSection } from './hudMorph.js'; // Phase 11.7.51: Modular Morph HUD
import { createMandalaHudSection, refreshMandalaHUD } from './hudMandala.js'; // Phase 11.7.50: Modular Mandala HUD
import { createParticlesHudSection, refreshParticlesHUD } from './hudParticles.js'; // Phase 11.7.50: Modular Particles HUD
import { createBioacousticPanel } from './hudBioacoustics.js'; // Phase 1: Bioacoustic Analysis (Sp(2,ℝ)/Z₂)
import { createBackgroundHudSection } from './hudBackground.js'; // Phase 11.7.50: Modular Background HUD
import { createShadowsHudSection } from './hudShadows.js'; // Phase 11.7.50: Modular Shadows HUD
import { createVesselHudSection } from './hudVessel.js'; // Phase 11.7.50: Modular Vessel HUD
import { createAudioHudSection, refreshAudioHUD } from './hudAudio.js'; // Phase 11.7.50: Modular Audio HUD
import { createMidiHudSection } from './hudMidi.js'; // Phase 11.7.50: Modular MIDI HUD
import { createTelemetryHudSection } from './hudTelemetry.js'; // Phase 11.7.50: Modular Telemetry HUD
import { createMMPAHudSection } from './hudMMPA.js'; // Phase 13.30: MMPA V2.0 HUD
import { createPresetsHudSection } from './hudPresets.js'; // Phase 12: Modular Presets HUD
import { createGeometryHudSection } from './hudGeometry.js'; // Phase 12.0: Modular Geometry HUD
import { createAcidEmpireHudSection } from './hudAcidEmpire.js'; // Phase 13.6.0: Modular Acid Empire HUD
import { createHyperbolicTilingHudSection } from './hudHyperbolicTiling.js'; // Phase 13.29: Modular Hyperbolic Tiling HUD
import { createVoxelWaveHudSection } from './hudVoxelWave.js'; // Phase 13.7.0: Modular Voxel Wave HUD
import { createFeaturesHudSection } from './hudFeatures.js'; // MMPA Features (Ratio Engine)
import { createAnchorsHudSection } from './hudAnchors.js'; // MMPA Anchors (Memory)
import { createCommunityHudSection } from './hudCommunity.js'; // MMPA Community (Ecosystem)
import { createSequencesHudSection } from './hudSequences.js'; // MMPA Sequences (Composition)
import { createTheoryHudSection } from './hudTheory.js'; // MMPA Unified Theory (Heart/Vortex/Archetype)
import { initAnchors } from './anchorSystem.js'; // MMPA Anchor System
import { enterPerformanceMode } from './performanceMode.js'; // MMPA Performance Mode
import { createLuminousTessellationHudSection } from './hudLuminousTessellation.js'; // Luminous Tessellation HUD
import { createSacredGeometryHudSection } from './hudSacredGeometry.js'; // Sacred Geometry HUD
import { createRayMarchingHudSection } from './hudRayMarching.js'; // Ray Marching HUD
import { createLiquidSimHudSection } from './hudLiquidSim.js'; // Liquid Simulation HUD
import { createKaleidoscopeHudSection } from './hudKaleidoscope.js'; // Kaleidoscope HUD
import { createCellularAutomataHudSection } from './hudCellularAutomata.js'; // Cellular Automata HUD
import { createFlowFieldHudSection } from './hudFlowField.js'; // Flow Field HUD
import { createMandelbulbHudSection } from './hudMandelbulb.js'; // Mandelbulb Voxel Core HUD
import { createVCNHudSection } from './hudVCN.js'; // VCN Phase 1: Navigation HUD
import { createDestinationHUD } from './hudDestinations.js'; // Skybox Destination Authoring
import { createSignalHUD } from './hudSignals.js'; // Signal Multimodality
import { createMaterialPhysicsHUD } from './hudMaterialPhysics.js'; // Material Physics Engine
import { createMythHUD } from './hudMyth.js'; // Myth Layer Compiler
import { createPedagogicalHUD } from './hudPedagogical.js'; // Pedagogical Mode
import { createAIHUD } from './hudAI.js'; // AI Co-Agent Integration
import { createAIAssistantHUD } from './hudAIAssistant.js'; // AI Assistant - State-aware suggestions
import { createCameraHUD } from './hudCamera.js'; // Camera & Biosignal Inputs
import { createPortalHUD } from './hudPortal.js'; // Portal Builder
import { createTextSignalHUD } from './hudText.js'; // Text/NLP Signals
import { createRecorderHudSection } from './hudRecorder.js'; // Video Recording
import { createFinancialHUD } from './hudFinancial.js'; // Phase 13.27: Financial Data Pipeline
import { initTimeline } from './timelineIntegration.js'; // Phase 13.16: Timeline & Playback System
import { AudioManifoldPanel } from './audioManifoldPanel.js'; // Audio Manifold UMAP/t-SNE Visualization
import { createSettingsHudSection } from './hudSettings.js'; // Settings Configuration
import { initSettings, getSettings } from './settings.js'; // Settings Manager
import { FlightParams } from './flightParams.js'; // Flight parameters
import { createSynthHudSection, getSynthInstance } from './hudSynth.js'; // MMPA Synth Engine
import { createPiPhiPanel } from './hudPiPhi.js'; // π/φ Synchronicity Detector
import { loadSavedPalette } from './colorPalettes.js'; // Color Palette System

// Phase 13.4.2: Register refresh callbacks for modules that export them
// (Most modules removed registerHUDCallback to avoid circular dependencies)
if (typeof refreshAudioHUD === 'function') registerHUDCallback("audio", refreshAudioHUD);
if (typeof refreshParticlesHUD === 'function') registerHUDCallback("particles", refreshParticlesHUD);
if (typeof refreshMandalaHUD === 'function') registerHUDCallback("mandala", refreshMandalaHUD);

console.log("📟 hud.js loaded");

// Import Rams-inspired CSS
const hudCSSLink = document.createElement('link');
hudCSSLink.rel = 'stylesheet';
hudCSSLink.href = new URL('./hud-rams.css', import.meta.url).href;
document.head.appendChild(hudCSSLink);

export async function initHUD() {
  // Initialize MMPA Anchor System
  initAnchors();

  // Initialize Settings
  await initSettings();

  // Apply saved controller sensitivity settings
  const settings = getSettings();
  if (settings.controller) {
    if (settings.controller.yawSensitivity !== undefined) {
      FlightParams.look.yawSensitivity = settings.controller.yawSensitivity;
      console.log(`🎮 Loaded yaw sensitivity: ${settings.controller.yawSensitivity}`);
    }
    if (settings.controller.pitchSensitivity !== undefined) {
      FlightParams.look.pitchSensitivity = settings.controller.pitchSensitivity;
      console.log(`🎮 Loaded pitch sensitivity: ${settings.controller.pitchSensitivity}`);
    }
  }

  // Load saved color palette
  loadSavedPalette();

  const hudPanel = await createHUDPanel();
  document.body.appendChild(hudPanel);

  console.log("📟 HUD initialized with Rams design system");
}

async function createHUDPanel() {
  const panel = document.createElement('div');
  panel.id = 'hud-panel';
  // No inline styles - all handled by hud-rams.css

  // Phase 11.5.0: HUD collapse state
  let hudCollapsed = false;

  // Header container with title + buttons
  const header = document.createElement('div');
  header.className = 'hud-header';

  const title = document.createElement('h3');
  title.className = 'hud-title';
  title.textContent = 'Controls';

  // Button group
  const btnGroup = document.createElement('div');
  btnGroup.style.cssText = 'display: flex; gap: 8px; align-items: center;';

  // Performance Mode button
  const perfModeBtn = document.createElement('button');
  perfModeBtn.className = 'hud-header-btn';
  perfModeBtn.textContent = 'Performance';
  perfModeBtn.title = 'Enter Performance Mode';
  perfModeBtn.addEventListener('click', () => {
    enterPerformanceMode();
  });

  // Collapse/Expand toggle button
  const collapseBtn = document.createElement('button');
  collapseBtn.className = 'hud-header-btn';
  collapseBtn.textContent = '−';
  collapseBtn.title = 'Collapse HUD';

  // Container for all controls (will be hidden when collapsed)
  const controlsContainer = document.createElement('div');
  controlsContainer.id = 'hud-controls-container';

  collapseBtn.addEventListener('click', () => {
    hudCollapsed = !hudCollapsed;
    if (hudCollapsed) {
      controlsContainer.style.display = 'none';
      collapseBtn.textContent = '+';
      collapseBtn.title = 'Expand HUD';
      console.log("📟 HUD collapsed (minimal mode)");
    } else {
      controlsContainer.style.display = 'block';
      collapseBtn.textContent = '−';
      collapseBtn.title = 'Collapse HUD';
      console.log("📟 HUD expanded (full mode)");
    }
  });

  btnGroup.appendChild(perfModeBtn);
  btnGroup.appendChild(collapseBtn);
  header.appendChild(title);
  header.appendChild(btnGroup);
  panel.appendChild(header);

  // Phase 11.5.0: Tab navigation
  const tabNav = document.createElement('div');
  tabNav.className = 'hud-tabs';

  const tabs = ['Morph', 'Presets', 'Audio', 'Financial', 'Synth', 'π/φ', 'Visual', 'Advanced', 'Settings', 'MIDI', 'VCN', 'Destinations', 'Signals', 'Myth', 'Learn', 'AI', 'Camera', 'Portal', 'Text'];
  let activeTab = 'Morph';
  const tabButtons = {};
  const tabContainers = {};

  tabs.forEach(tabName => {
    const btn = document.createElement('button');
    btn.className = 'hud-tab';
    btn.textContent = tabName;
    btn.addEventListener('click', () => {
      activeTab = tabName;
      tabs.forEach(t => {
        if (t === tabName) {
          tabButtons[t].classList.add('active');
        } else {
          tabButtons[t].classList.remove('active');
        }
        tabContainers[t].style.display = t === tabName ? 'block' : 'none';
      });
      console.log(`📟 Tab switched to: ${tabName}`);
    });
    tabNav.appendChild(btn);
    tabButtons[tabName] = btn;

    const container = document.createElement('div');
    container.className = 'hud-content';
    container.id = `tab-${tabName.toLowerCase()}`;
    container.style.display = tabName === 'Morph' ? 'block' : 'none';
    controlsContainer.appendChild(container);
    tabContainers[tabName] = container;
  });

  // Set initial active state
  tabButtons['Morph'].classList.add('active');

  controlsContainer.insertBefore(tabNav, controlsContainer.firstChild);

  // Phase 11.7.51: Modular Morph HUD section
  createMorphHudSection(tabContainers['Morph'], notifyHUDUpdate);

  // Phase 12: Modular Presets HUD section
  createPresetsHudSection(tabContainers['Presets'], notifyHUDUpdate);

  // REMOVED: Lines 164-1252 extracted to hudPresets.js
  // End of Presets section extraction

  // Phase 11.7.50: Modular Audio HUD section
  createAudioHudSection(tabContainers['Audio'], notifyHUDUpdate);

  // Video Recording HUD section
  createRecorderHudSection(tabContainers['Audio']);

  // Phase 13.16: Timeline & Playback System
  initTimeline(tabContainers['Audio']);

  // Phase 13.27: Financial Data Pipeline HUD section
  const financialSection = createFinancialHUD();
  tabContainers['Financial'].appendChild(financialSection);

  // === MMPA Features - The Ratio Engine ===
  createFeaturesHudSection(tabContainers['Audio']);

  // === MMPA Anchors - Memory System ===
  createAnchorsHudSection(tabContainers['Audio']);

  // === MMPA Community - Ecosystem ===
  try {
    createCommunityHudSection(tabContainers['Audio']);
  } catch (error) {
    console.error('❌ Failed to create Community HUD section:', error);
  }

  // === MMPA Sequences - Composition ===
  createSequencesHudSection(tabContainers['Audio']);

  // === MMPA Unified Theory - Heart/Vortex/Archetype ===
  createTheoryHudSection(tabContainers['Audio']);

  // === Audio Manifold Panel (UMAP/t-SNE Visualization) ===
  // Initialize panel instance with AudioEngine
  window.audioManifoldPanel = new AudioManifoldPanel(AudioEngine);

  // Create toggle button section
  const manifoldLabel = document.createElement("h4");
  manifoldLabel.textContent = "🎨 Audio Manifold Visualization";
  manifoldLabel.style.cssText = 'margin: 15px 0 10px 0; color: #a78bfa; font-size: 12px;';
  tabContainers['Audio'].appendChild(manifoldLabel);

  const manifoldToggle = document.createElement("button");
  manifoldToggle.textContent = "Open Audio Manifold";
  manifoldToggle.style.cssText = `
    background: rgba(167, 139, 250, 0.2);
    border: 1px solid #a78bfa;
    color: #a78bfa;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 10px;
    transition: all 0.2s;
  `;
  manifoldToggle.onmouseenter = () => {
    manifoldToggle.style.background = 'rgba(167, 139, 250, 0.3)';
    manifoldToggle.style.boxShadow = '0 0 10px rgba(167, 139, 250, 0.4)';
  };
  manifoldToggle.onmouseleave = () => {
    manifoldToggle.style.background = 'rgba(167, 139, 250, 0.2)';
    manifoldToggle.style.boxShadow = 'none';
  };
  manifoldToggle.onclick = () => {
    window.audioManifoldPanel.toggle();
    manifoldToggle.textContent = window.audioManifoldPanel.isOpen ? 'Close Audio Manifold' : 'Open Audio Manifold';
  };
  tabContainers['Audio'].appendChild(manifoldToggle);

  console.log('🎨 Audio Manifold Panel integrated into HUD');

  // === MMPA Synth Engine ===
  await createSynthHudSection(tabContainers['Synth']);

  // === π/φ Synchronicity Detector ===
  const piPhiPanel = createPiPhiPanel(tabContainers['π/φ']);
  window.piPhiPanel = piPhiPanel; // Global reference for audio analysis updates

  // NOTE: Chronelix Mode selector moved to Timeline Playback Panel (timelinePlaybackPanel.js)
  // where the Chronelix is actually displayed - access via the panel's title bar

  // === Phase 4.8.1/11.7.50: Particles (Modular) ===
  createParticlesHudSection(tabContainers['Visual'], notifyHUDUpdate, createToggleControl, createSliderControl);

  // === Phase 1: Bioacoustic Analysis (Sp(2,ℝ)/Z₂) ===
  createBioacousticPanel(tabContainers['Visual'], notifyHUDUpdate);

  // === Phase 11.7.1: Emoji Particles ===
  const emojiParticlesLabel = document.createElement("h4");
  emojiParticlesLabel.textContent = "🍕 Emoji Particles";
  emojiParticlesLabel.style.cssText = 'margin: 15px 0 10px 0; color: #00ffff; font-size: 12px;';
  tabContainers['Visual'].appendChild(emojiParticlesLabel);

  // Phase 11.7.2: Emoji picker dropdown
  const emojiPicker = document.createElement("select");
  emojiPicker.id = "emojiPicker";
  emojiPicker.style.cssText = 'margin-left: 8px; padding: 2px 4px; background: #1a1a1a; color: #00ffff; border: 1px solid #333; border-radius: 3px;';
  ["🍕","🌶️","🍄","⭐","🎵","💫"].forEach(emoji => {
    const option = document.createElement("option");
    option.value = emoji;
    option.textContent = emoji;
    emojiPicker.appendChild(option);
  });
  emojiPicker.disabled = true; // disabled until toggle ON

  const emojiParticlesToggle = createToggleControl('Enable Emoji Particles', false, async (value) => {
    state.useEmojiParticles = value;
    if (value) {
      // Phase 11.7.3: Disable default ParticleSystem (hard swap)
      const { getParticleSystemInstance } = await import('./particles.js');
      const { scene } = await import('./geometry.js');
      const particleSystem = getParticleSystemInstance();
      if (particleSystem && particleSystem.points) {
        scene.remove(particleSystem.points);
        console.log("✨ Default ParticleSystem disabled");
      }

      // Enable emoji particles
      if (!window.emojiParticles) {
        const { EmojiParticles } = await import('./particles.js');
        window.emojiParticles = new EmojiParticles(scene, 500, emojiPicker.value);
        console.log(`🍕 EmojiParticles enabled with ${emojiPicker.value}`);
      }
      emojiPicker.disabled = false;

    } else {
      // Phase 11.7.3: Restore default ParticleSystem
      const { getParticleSystemInstance } = await import('./particles.js');
      const { scene } = await import('./geometry.js');
      const particleSystem = getParticleSystemInstance();
      if (particleSystem && particleSystem.points) {
        scene.add(particleSystem.points);
        console.log("✨ Default ParticleSystem restored");
      }

      // Dispose emoji particles
      if (window.emojiParticles) {
        window.emojiParticles.dispose();
        window.emojiParticles = null;
        console.log("🍕 EmojiParticles disabled");
      }
      emojiPicker.disabled = true;
    }
  });
  emojiParticlesToggle.title = 'Toggle audio-reactive emoji particles';

  // Phase 11.7.2: Picker change event → swap emoji
  emojiPicker.addEventListener("change", (e) => {
    if (window.emojiParticles) {
      window.emojiParticles.swapEmoji(e.target.value);
    }
  });

  // Add toggle and picker to same line
  const emojiContainer = document.createElement("div");
  emojiContainer.style.cssText = 'display: flex; align-items: center; margin-bottom: 8px;';
  emojiContainer.appendChild(emojiParticlesToggle);
  emojiContainer.appendChild(emojiPicker);
  tabContainers['Visual'].appendChild(emojiContainer);

  // Phase 11.7.4: Emoji Count Slider
  // Phase 11.7.10: Emoji count slider (up to 2000 with instanced rendering)
  const emojiCountControl = createSliderControl('Emoji Count', 50, 10, 2000, 50, async (value) => {
    if (window.emojiParticles) {
      const currentEmoji = window.emojiParticles.emoji;
      const currentLayout = window.emojiParticles.layout;
      const currentReactivity = window.emojiParticles.audioReactivity;
      const { scene } = await import('./geometry.js');
      window.emojiParticles.dispose();
      const { EmojiParticles } = await import('./particles.js');
      window.emojiParticles = new EmojiParticles(scene, value, currentEmoji);
      window.emojiParticles.setLayout(currentLayout);
      window.emojiParticles.setAudioReactivity(currentReactivity);
      console.log(`🍕 Emoji instanced count set to ${value}`);
    }
  });
  emojiCountControl.title = 'Number of emoji particles (10-2000, instanced rendering)';
  tabContainers['Visual'].appendChild(emojiCountControl);

  // Phase 11.7.5: Emoji Layout Dropdown
  const emojiLayoutLabel = document.createElement("label");
  emojiLayoutLabel.textContent = "Layout";
  emojiLayoutLabel.style.cssText = 'display: block; margin-top: 8px; margin-bottom: 4px; color: #999; font-size: 11px;';
  tabContainers['Visual'].appendChild(emojiLayoutLabel);

  const emojiLayoutDropdown = document.createElement("select");
  emojiLayoutDropdown.id = "emojiLayout";
  emojiLayoutDropdown.style.cssText = 'width: 100%; padding: 4px; background: #1a1a1a; color: #00ffff; border: 1px solid #333; border-radius: 3px;';

  const layoutOptions = [
    { value: "cube", label: "Cube" },
    { value: "sphere", label: "Sphere" },
    { value: "orbit", label: "Orbit" },
    { value: "random", label: "Random" },
    { value: "spiral", label: "Spiral 🌀" },
    { value: "wave", label: "Wave Grid 🌊" },
    { value: "burst", label: "Burst 💥" },
    { value: "spectrum", label: "Spectrum 📊" }
  ];

  layoutOptions.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    emojiLayoutDropdown.appendChild(option);
  });

  emojiLayoutDropdown.addEventListener("change", (e) => {
    if (window.emojiParticles) {
      window.emojiParticles.setLayout(e.target.value);
    }
  });

  tabContainers['Visual'].appendChild(emojiLayoutDropdown);

  // Phase 11.7.8: Audio Reactivity Slider
  const emojiAudioReactivityControl = createSliderControl('Audio Reactivity', 1.0, 0, 2, 0.1, (value) => {
    if (window.emojiParticles) {
      window.emojiParticles.setAudioReactivity(value);
    }
  });
  emojiAudioReactivityControl.title = 'Multiplier for audio-reactive scale/rotation (0-2x)';
  tabContainers['Visual'].appendChild(emojiAudioReactivityControl);

  // Phase 11.7.11: Signal Linking Toggle
  const emojiSignalLinkingControl = createToggleControl('Link to Morph/Audio', false, (value) => {
    if (window.emojiParticles) {
      window.emojiParticles.setSignalLinking(value);
    }
  });
  emojiSignalLinkingControl.title = 'Link emoji particles to morph weights and audio bands (bass→expansion, mid→rotation, treble→sparkle)';
  tabContainers['Visual'].appendChild(emojiSignalLinkingControl);

  // Phase 11.7.12: Emoji Set Selection
  const emojiSetLabel = document.createElement("label");
  emojiSetLabel.textContent = "Emoji Set";
  emojiSetLabel.style.cssText = 'display: block; margin-top: 8px; margin-bottom: 4px; color: #999; font-size: 11px;';
  tabContainers['Visual'].appendChild(emojiSetLabel);

  const emojiSetDropdown = document.createElement("select");
  emojiSetDropdown.id = "emojiSet";
  emojiSetDropdown.style.cssText = 'width: 100%; padding: 4px; background: #1a1a1a; color: #00ffff; border: 1px solid #333; border-radius: 3px;';

  const emojiSets = [
    { value: "", label: "Single Emoji" },
    { value: "pizza", label: "🍕 Pizza" },
    { value: "cosmos", label: "⭐ Cosmos" },
    { value: "myth", label: "🦁 Myth" },
    { value: "ocean", label: "🌊 Ocean" },
    { value: "nature", label: "🌲 Nature" },
    { value: "tech", label: "💻 Tech" }
  ];

  emojiSets.forEach(set => {
    const option = document.createElement("option");
    option.value = set.value;
    option.textContent = set.label;
    emojiSetDropdown.appendChild(option);
  });

  emojiSetDropdown.addEventListener("change", (e) => {
    if (window.emojiParticles && e.target.value) {
      window.emojiParticles.loadEmojiSet(e.target.value);
    }
  });

  tabContainers['Visual'].appendChild(emojiSetDropdown);

  // Phase 11.7.12: Auto-Cycle Toggle
  const emojiAutoCycleControl = createToggleControl('Auto-Cycle Set', false, (value) => {
    if (window.emojiParticles) {
      window.emojiParticles.setAutoCycle(value, 4000);
    }
  });
  emojiAutoCycleControl.title = 'Automatically cycle through emojis in the selected set (4s interval)';
  tabContainers['Visual'].appendChild(emojiAutoCycleControl);

  // Phase 11.7.12: Story Mode Toggle
  const emojiStoryModeControl = createToggleControl('Story Mode', false, (value) => {
    if (window.emojiParticles) {
      const sequence = ["pizza", "cosmos", "myth"];
      window.emojiParticles.setStoryMode(value, sequence);
    }
  });
  emojiStoryModeControl.title = 'Enable narrative sequence: Pizza → Cosmos → Myth (use CC31 or manual advance)';
  tabContainers['Visual'].appendChild(emojiStoryModeControl);

  // === Phase 11.7.13: Beat Sync & Sequencing ===
  const beatSyncLabel = document.createElement("h4");
  beatSyncLabel.textContent = "🥁 Beat Sync";
  beatSyncLabel.style.cssText = 'margin: 15px 0 10px 0; color: #00ffff; font-size: 12px;';
  tabContainers['Visual'].appendChild(beatSyncLabel);

  // BPM Input
  const bpmControl = createSliderControl('BPM', 120, 60, 200, 1, (value) => {
    if (window.emojiParticles) {
      window.emojiParticles.setBPM(value);
    }
  });
  bpmControl.title = 'Tempo in beats per minute for pulse/sequencer sync';
  tabContainers['Visual'].appendChild(bpmControl);

  // Beat Sync Toggle
  const beatSyncToggle = createToggleControl('Enable Beat Sync', false, (value) => {
    if (window.emojiParticles) {
      window.emojiParticles.setBeatSync(value);
    }
  });
  beatSyncToggle.title = 'Pulse emojis on beat (scale/opacity)';
  tabContainers['Visual'].appendChild(beatSyncToggle);

  // Subdivision Dropdown
  const subdivisionLabel = document.createElement("label");
  subdivisionLabel.textContent = "Subdivision";
  subdivisionLabel.style.cssText = 'display: block; margin-top: 8px; margin-bottom: 4px; color: #999; font-size: 11px;';
  tabContainers['Visual'].appendChild(subdivisionLabel);

  const subdivisionDropdown = document.createElement("select");
  subdivisionDropdown.style.cssText = 'width: 100%; padding: 4px; background: #1a1a1a; color: #00ffff; border: 1px solid #333; border-radius: 3px;';
  [
    { value: 4, label: "Quarter Notes (1/4)" },
    { value: 8, label: "Eighth Notes (1/8)" },
    { value: 16, label: "Sixteenth Notes (1/16)" }
  ].forEach(opt => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    subdivisionDropdown.appendChild(option);
  });
  subdivisionDropdown.addEventListener("change", (e) => {
    if (window.emojiParticles) {
      window.emojiParticles.setSubdivision(parseInt(e.target.value));
    }
  });
  tabContainers['Visual'].appendChild(subdivisionDropdown);

  // Onset Detection Toggle
  const onsetDetectionToggle = createToggleControl('Onset Detection', false, (value) => {
    if (window.emojiParticles) {
      window.emojiParticles.setOnsetDetection(value);
    }
  });
  onsetDetectionToggle.title = 'Auto-detect beats from audio RMS spikes';
  tabContainers['Visual'].appendChild(onsetDetectionToggle);

  // Sequencer Toggle
  const sequencerToggle = createToggleControl('Sequencer Mode', false, (value) => {
    if (window.emojiParticles) {
      const defaultSequence = ["🍕", "🌶️", "🍄", "🧄"];
      window.emojiParticles.setSequencer(value, defaultSequence);
    }
  });
  sequencerToggle.title = 'Step through emoji sequence on each beat (🍕 → 🌶️ → 🍄 → 🧄)';
  tabContainers['Visual'].appendChild(sequencerToggle);

  // === Phase 11.7.15: Emoji Mixer (Multiple Streams) ===
  const emojiMixerLabel = document.createElement("h4");
  emojiMixerLabel.textContent = "🎨 Emoji Mixer";
  emojiMixerLabel.style.cssText = 'margin: 15px 0 10px 0; color: #00ffff; font-size: 12px;';
  tabContainers['Visual'].appendChild(emojiMixerLabel);

  // Container for all emoji streams
  const emojiStreamsContainer = document.createElement("div");
  emojiStreamsContainer.id = "emojiStreamsContainer";
  emojiStreamsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px;';
  tabContainers['Visual'].appendChild(emojiStreamsContainer);

  // Function to create a stream row
  function createEmojiStreamRow(emoji = "🍕", count = 100, enabled = true) {
    const row = document.createElement("div");
    row.style.cssText = 'display: flex; align-items: center; gap: 6px; padding: 4px; background: rgba(0,0,0,0.3); border-radius: 4px;';

    // Emoji input
    const emojiInput = document.createElement("input");
    emojiInput.type = "text";
    emojiInput.value = emoji;
    emojiInput.maxLength = 2;
    emojiInput.style.cssText = 'width: 40px; font-size: 20px; text-align: center; background: rgba(255,255,255,0.1); border: 1px solid #00ffff; color: white; padding: 2px;';

    // Count slider
    const countSlider = document.createElement("input");
    countSlider.type = "range";
    countSlider.min = 10;
    countSlider.max = 500;
    countSlider.value = count;
    countSlider.style.cssText = 'flex: 1; min-width: 80px;';

    // Count label
    const countLabel = document.createElement("span");
    countLabel.textContent = count;
    countLabel.style.cssText = 'font-size: 10px; color: #00ffff; min-width: 30px;';

    // Toggle checkbox
    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.checked = enabled;
    toggle.style.cssText = 'width: 16px; height: 16px;';

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.style.cssText = 'width: 24px; height: 24px; background: rgba(255,0,0,0.3); border: 1px solid red; color: red; cursor: pointer; border-radius: 4px; font-size: 12px;';

    // Event handlers
    emojiInput.addEventListener("input", () => {
      const oldEmoji = row.dataset.emoji;
      const newEmoji = emojiInput.value;
      if (oldEmoji && newEmoji && oldEmoji !== newEmoji && window.emojiStreamManager) {
        // Remove old stream and add new one
        window.emojiStreamManager.removeStream(oldEmoji);
        window.emojiStreamManager.addStream(newEmoji, parseInt(countSlider.value), toggle.checked);
        row.dataset.emoji = newEmoji;
        syncStateFromManager();
      }
    });

    countSlider.addEventListener("input", () => {
      countLabel.textContent = countSlider.value;
      if (window.emojiStreamManager && row.dataset.emoji) {
        window.emojiStreamManager.updateStreamCount(row.dataset.emoji, parseInt(countSlider.value));
        syncStateFromManager();
      }
    });

    toggle.addEventListener("change", () => {
      if (window.emojiStreamManager && row.dataset.emoji) {
        window.emojiStreamManager.toggleStream(row.dataset.emoji, toggle.checked);
        syncStateFromManager();
      }
    });

    removeBtn.addEventListener("click", () => {
      if (window.emojiStreamManager && row.dataset.emoji) {
        window.emojiStreamManager.removeStream(row.dataset.emoji);
        row.remove();
        syncStateFromManager();
        // Phase 11.7.16: Rebuild sequencer grid when streams change
        if (window.rebuildSequencerGrid) {
          window.rebuildSequencerGrid();
        }
      }
    });

    row.dataset.emoji = emoji;
    row.appendChild(emojiInput);
    row.appendChild(countSlider);
    row.appendChild(countLabel);
    row.appendChild(toggle);
    row.appendChild(removeBtn);

    return row;
  }

  // Function to sync state from manager
  function syncStateFromManager() {
    if (window.emojiStreamManager) {
      state.emojiStreams = window.emojiStreamManager.getStreamsArray();
    }
  }

  // Add Stream button
  const addStreamBtn = document.createElement("button");
  addStreamBtn.textContent = "+ Add Emoji Stream";
  addStreamBtn.style.cssText = 'padding: 8px; background: rgba(0,255,255,0.2); border: 1px solid #00ffff; color: #00ffff; cursor: pointer; border-radius: 4px; font-size: 11px; margin-bottom: 10px;';
  addStreamBtn.addEventListener("click", () => {
    const defaultEmojis = ["🍕", "🌶️", "🍄", "⭐", "🌙", "🦁", "🌊", "🌲", "💻", "🔥"];
    const usedEmojis = Array.from(emojiStreamsContainer.querySelectorAll('[data-emoji]')).map(el => el.dataset.emoji);
    const availableEmoji = defaultEmojis.find(e => !usedEmojis.includes(e)) || "🎨";

    const row = createEmojiStreamRow(availableEmoji, 100, true);
    emojiStreamsContainer.appendChild(row);

    // Add to manager
    if (window.emojiStreamManager) {
      window.emojiStreamManager.addStream(availableEmoji, 100, true);
      syncStateFromManager();
      // Phase 11.7.16: Rebuild sequencer grid when streams change
      if (window.rebuildSequencerGrid) {
        window.rebuildSequencerGrid();
      }
    }
  });
  tabContainers['Visual'].appendChild(addStreamBtn);

  // Function to rebuild emoji mixer UI from state
  function rebuildEmojiMixerUI() {
    // Clear existing rows
    emojiStreamsContainer.innerHTML = '';

    // Rebuild from state
    if (state.emojiStreams && state.emojiStreams.length > 0) {
      state.emojiStreams.forEach(({ emoji, count, enabled }) => {
        const row = createEmojiStreamRow(emoji, count, enabled);
        emojiStreamsContainer.appendChild(row);
      });
    }
  }

  // Expose rebuild function globally for preset loading
  window.rebuildEmojiMixerUI = rebuildEmojiMixerUI;

  // Initialize with default stream if state has streams
  rebuildEmojiMixerUI();

  // === Phase 11.7.16: Emoji Sequencer & Timeline ===
  const emojiSequencerLabel = document.createElement("h4");
  emojiSequencerLabel.textContent = "🎶 Emoji Sequencer";
  emojiSequencerLabel.style.cssText = 'margin: 15px 0 10px 0; color: #00ffff; font-size: 12px;';
  tabContainers['Visual'].appendChild(emojiSequencerLabel);

  // Sequencer enable toggle
  const sequencerEnableToggle = createToggleControl('Enable Sequencer', false, (value) => {
    if (window.emojiSequencer) {
      window.emojiSequencer.setEnabled(value);
      state.emojiSequencer.enabled = value;
    }
  });
  sequencerEnableToggle.title = 'Enable beat-based emoji sequencing';
  tabContainers['Visual'].appendChild(sequencerEnableToggle);

  // BPM control
  const sequencerBPMControl = createSliderControl('Sequencer BPM', 120, 60, 200, 1, (value) => {
    if (window.emojiSequencer) {
      window.emojiSequencer.setBPM(value);
      state.emojiSequencer.bpm = value;
    }
  });
  sequencerBPMControl.title = 'Beats per minute for sequencer';
  tabContainers['Visual'].appendChild(sequencerBPMControl);

  // Timeline length control
  const timelineLengthControl = createSliderControl('Timeline Length', 16, 4, 32, 1, (value) => {
    if (window.emojiSequencer) {
      window.emojiSequencer.setTimelineLength(value);
      state.emojiSequencer.timelineLength = value;
      rebuildSequencerGrid();
    }
  });
  timelineLengthControl.title = 'Number of beats in the timeline';
  tabContainers['Visual'].appendChild(timelineLengthControl);

  // Timeline grid container
  const timelineGridContainer = document.createElement("div");
  timelineGridContainer.id = "timelineGridContainer";
  timelineGridContainer.style.cssText = 'margin: 10px 0; padding: 8px; background: rgba(0,0,0,0.4); border-radius: 4px; overflow-x: auto; max-height: 300px; overflow-y: auto;';
  tabContainers['Visual'].appendChild(timelineGridContainer);

  // Function to build timeline grid
  function rebuildSequencerGrid() {
    if (!window.emojiSequencer) return;

    const container = document.getElementById("timelineGridContainer");
    if (!container) return;

    container.innerHTML = '';

    const emojis = Array.from(window.emojiStreamManager.streams.keys());
    if (emojis.length === 0) {
      container.innerHTML = '<div style="color: #888; font-size: 11px; padding: 10px;">Add emoji streams to use sequencer</div>';
      return;
    }

    const timelineLength = window.emojiSequencer.timelineLength;

    // Header row with beat numbers
    const headerRow = document.createElement("div");
    headerRow.style.cssText = 'display: flex; margin-bottom: 4px; padding-left: 40px;';
    for (let beat = 0; beat < timelineLength; beat++) {
      const beatLabel = document.createElement("div");
      beatLabel.textContent = beat + 1;
      beatLabel.style.cssText = 'width: 24px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 9px; color: #666; margin-right: 2px;';
      headerRow.appendChild(beatLabel);
    }
    container.appendChild(headerRow);

    // Emoji rows
    emojis.forEach(emoji => {
      const row = document.createElement("div");
      row.style.cssText = 'display: flex; align-items: center; margin-bottom: 4px;';

      // Emoji label
      const emojiLabel = document.createElement("div");
      emojiLabel.textContent = emoji;
      emojiLabel.style.cssText = 'width: 30px; font-size: 18px; text-align: center; margin-right: 10px;';
      row.appendChild(emojiLabel);

      // Beat toggles
      const pattern = window.emojiSequencer.getPattern(emoji);
      for (let beat = 0; beat < timelineLength; beat++) {
        const beatBtn = document.createElement("button");
        beatBtn.textContent = "●";
        beatBtn.dataset.emoji = emoji;
        beatBtn.dataset.beat = beat;
        beatBtn.style.cssText = `
          width: 24px;
          height: 24px;
          margin-right: 2px;
          border: 1px solid #00ffff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s;
        `;

        // Set initial state
        const isActive = pattern[beat] === 1;
        beatBtn.style.background = isActive ? 'rgba(0,255,255,0.6)' : 'rgba(0,0,0,0.3)';
        beatBtn.style.color = isActive ? '#000' : '#00ffff';

        beatBtn.addEventListener("click", () => {
          const newState = window.emojiSequencer.toggleBeat(emoji, beat);
          beatBtn.style.background = newState ? 'rgba(0,255,255,0.6)' : 'rgba(0,0,0,0.3)';
          beatBtn.style.color = newState ? '#000' : '#00ffff';

          // Sync to state
          state.emojiSequencer.patterns[emoji] = window.emojiSequencer.getPattern(emoji);
        });

        row.appendChild(beatBtn);
      }

      container.appendChild(row);
    });
  }

  // Expose rebuild function
  window.rebuildSequencerGrid = rebuildSequencerGrid;

  // Build initial grid
  rebuildSequencerGrid();

  // Reset button
  const resetSequencerBtn = document.createElement("button");
  resetSequencerBtn.textContent = "↺ Reset to Beat 1";
  resetSequencerBtn.style.cssText = 'padding: 6px 12px; background: rgba(0,255,255,0.2); border: 1px solid #00ffff; color: #00ffff; cursor: pointer; border-radius: 4px; font-size: 11px; margin-top: 8px;';
  resetSequencerBtn.addEventListener("click", () => {
    if (window.emojiSequencer) {
      window.emojiSequencer.reset();
    }
  });
  tabContainers['Visual'].appendChild(resetSequencerBtn);

  // === Phase 11.7.17: Emoji Pattern Banks ===
  const emojiBanksLabel = document.createElement("h4");
  emojiBanksLabel.textContent = "💾 Pattern Banks";
  emojiBanksLabel.style.cssText = 'margin: 15px 0 10px 0; color: #00ffff; font-size: 12px;';
  tabContainers['Visual'].appendChild(emojiBanksLabel);

  // Bank buttons grid (2 rows of 4)
  const banksGridContainer = document.createElement("div");
  banksGridContainer.style.cssText = 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 10px;';

  // Create 8 bank buttons
  const bankButtons = [];
  for (let i = 0; i < 8; i++) {
    const bankBtn = document.createElement("button");
    bankBtn.textContent = `${i + 1}`;
    bankBtn.dataset.bankIndex = i;
    bankBtn.style.cssText = `
      padding: 12px 8px;
      background: rgba(0,0,0,0.4);
      border: 1px solid #666;
      color: #666;
      cursor: pointer;
      border-radius: 4px;
      font-size: 16px;
      font-weight: bold;
      transition: all 0.2s;
      position: relative;
    `;

    // Load bank on click
    bankBtn.addEventListener("click", () => {
      if (window.emojiBankManager) {
        const success = window.emojiBankManager.loadBank(i);
        if (success) {
          state.currentBank = i;
          // Rebuild UI
          if (window.rebuildEmojiMixerUI) window.rebuildEmojiMixerUI();
          if (window.rebuildSequencerGrid) window.rebuildSequencerGrid();
          updateBankButtonStates();
        }
      }
    });

    // Right-click to save
    bankBtn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (window.emojiBankManager) {
        window.emojiBankManager.saveBank(i);
        state.emojiBanks = window.emojiBankManager.saveBanksToState();
        updateBankButtonStates();
      }
    });

    bankButtons.push(bankBtn);
    banksGridContainer.appendChild(bankBtn);
  }

  tabContainers['Visual'].appendChild(banksGridContainer);

  // Function to update bank button states
  function updateBankButtonStates() {
    if (!window.emojiBankManager) return;

    bankButtons.forEach((btn, index) => {
      const isEmpty = window.emojiBankManager.isBankEmpty(index);
      const isCurrent = state.currentBank === index;

      if (isEmpty) {
        btn.style.background = 'rgba(0,0,0,0.4)';
        btn.style.borderColor = '#666';
        btn.style.color = '#666';
        btn.title = `Bank ${index + 1}: Empty\nLeft-click to load\nRight-click to save current pattern`;
      } else {
        const bank = window.emojiBankManager.getBank(index);
        const emojiList = bank.streams.map(s => s.emoji).join('');

        btn.style.background = isCurrent ? 'rgba(0,255,255,0.4)' : 'rgba(0,255,0,0.2)';
        btn.style.borderColor = isCurrent ? '#00ffff' : '#00ff00';
        btn.style.color = isCurrent ? '#00ffff' : '#00ff00';
        btn.title = `Bank ${index + 1}: ${bank.name}\n${emojiList}\nLeft-click to load\nRight-click to save current pattern`;
      }
    });
  }

  // Expose update function
  window.updateBankButtonStates = updateBankButtonStates;

  // Initial update
  updateBankButtonStates();

  // Save/Clear controls row
  const bankControlsRow = document.createElement("div");
  bankControlsRow.style.cssText = 'display: flex; gap: 6px; margin-top: 8px;';

  // Save to current bank button
  const saveToBankBtn = document.createElement("button");
  saveToBankBtn.textContent = "💾 Save to Selected";
  saveToBankBtn.style.cssText = 'flex: 1; padding: 6px; background: rgba(0,255,0,0.2); border: 1px solid #00ff00; color: #00ff00; cursor: pointer; border-radius: 4px; font-size: 11px;';
  saveToBankBtn.addEventListener("click", () => {
    if (state.currentBank !== null && window.emojiBankManager) {
      window.emojiBankManager.saveBank(state.currentBank);
      state.emojiBanks = window.emojiBankManager.saveBanksToState();
      updateBankButtonStates();
    } else {
      console.warn("💾 No bank selected");
    }
  });
  saveToBankBtn.title = 'Save current emoji mix + sequencer to selected bank';
  bankControlsRow.appendChild(saveToBankBtn);

  // Clear bank button
  const clearBankBtn = document.createElement("button");
  clearBankBtn.textContent = "✕ Clear Selected";
  clearBankBtn.style.cssText = 'flex: 1; padding: 6px; background: rgba(255,0,0,0.2); border: 1px solid red; color: red; cursor: pointer; border-radius: 4px; font-size: 11px;';
  clearBankBtn.addEventListener("click", () => {
    if (state.currentBank !== null && window.emojiBankManager) {
      window.emojiBankManager.clearBank(state.currentBank);
      state.emojiBanks = window.emojiBankManager.saveBanksToState();
      updateBankButtonStates();
    }
  });
  clearBankBtn.title = 'Clear selected bank';
  bankControlsRow.appendChild(clearBankBtn);

  tabContainers['Visual'].appendChild(bankControlsRow);

  // Info text
  const bankInfoText = document.createElement("div");
  bankInfoText.textContent = "Left-click: Load | Right-click: Quick Save";
  bankInfoText.style.cssText = 'font-size: 10px; color: #888; margin-top: 6px; text-align: center;';
  tabContainers['Visual'].appendChild(bankInfoText);

  // === Phase 11.7.18: Emoji Physics & Interaction ===
  const emojiPhysicsLabel = document.createElement("h4");
  emojiPhysicsLabel.textContent = "🌐 Emoji Physics";
  emojiPhysicsLabel.style.cssText = 'margin: 15px 0 10px 0; color: #00ffff; font-size: 12px;';
  tabContainers['Visual'].appendChild(emojiPhysicsLabel);

  // Physics mode dropdown
  const physicsModeLabel = document.createElement("label");
  physicsModeLabel.textContent = "Physics Mode";
  physicsModeLabel.style.cssText = 'display: block; font-size: 11px; margin-bottom: 4px; color: #00ffff;';
  tabContainers['Visual'].appendChild(physicsModeLabel);

  const physicsModeDropdown = document.createElement("select");
  physicsModeDropdown.style.cssText = 'width: 100%; padding: 6px; background: rgba(0,0,0,0.5); border: 1px solid #00ffff; color: #00ffff; border-radius: 4px; margin-bottom: 10px; font-size: 11px;';

  const physicsModes = [
    { value: 'none', label: 'None (Static)' },
    { value: 'gravity', label: 'Gravity (Fall Down)' },
    { value: 'orbit', label: 'Orbit Attraction (Pull to Center)' },
    { value: 'repulsion', label: 'Repulsion (Scatter Away)' }
  ];

  physicsModes.forEach(mode => {
    const option = document.createElement("option");
    option.value = mode.value;
    option.textContent = mode.label;
    physicsModeDropdown.appendChild(option);
  });

  physicsModeDropdown.addEventListener("change", () => {
    const mode = physicsModeDropdown.value;
    state.emojiPhysics.mode = mode;

    // Apply to all streams
    if (window.emojiStreamManager) {
      window.emojiStreamManager.setPhysicsMode(mode);
    }

    // Apply to single emoji particles if active
    if (window.emojiParticles) {
      window.emojiParticles.setPhysicsMode(mode);
    }

    console.log(`🌐 Emoji physics mode: ${mode}`);
  });
  tabContainers['Visual'].appendChild(physicsModeDropdown);

  // Collision toggle
  const collisionToggle = createToggleControl('Enable Collisions', true, (value) => {
    state.emojiPhysics.collisionEnabled = value;
  });
  collisionToggle.title = 'Emojis bounce off each other gently';
  tabContainers['Visual'].appendChild(collisionToggle);

  // Audio modulation toggle
  const audioModToggle = createToggleControl('Audio Modulation', true, (value) => {
    state.emojiPhysics.audioModulation = value;
  });
  audioModToggle.title = 'Gravity affected by bass, repulsion by treble';
  tabContainers['Visual'].appendChild(audioModToggle);

  // Mouse interaction toggle
  const mouseInteractionToggle = createToggleControl('Mouse Swirl', false, (value) => {
    state.emojiPhysics.mouseInteraction = value;
  });
  mouseInteractionToggle.title = 'Drag mouse to create swirl forces';
  tabContainers['Visual'].appendChild(mouseInteractionToggle);

  // Gravity strength slider
  const gravityStrengthControl = createSliderControl('Gravity Strength', 0.01, 0.001, 0.05, 0.001, (value) => {
    state.emojiPhysics.gravityStrength = value;
  });
  gravityStrengthControl.title = 'Downward acceleration force';
  tabContainers['Visual'].appendChild(gravityStrengthControl);

  // Orbit strength slider
  const orbitStrengthControl = createSliderControl('Orbit Strength', 0.005, 0.001, 0.02, 0.001, (value) => {
    state.emojiPhysics.orbitStrength = value;
  });
  orbitStrengthControl.title = 'Attraction force toward center';
  tabContainers['Visual'].appendChild(orbitStrengthControl);

  // Repulsion strength slider
  const repulsionStrengthControl = createSliderControl('Repulsion Strength', 0.02, 0.001, 0.1, 0.001, (value) => {
    state.emojiPhysics.repulsionStrength = value;
  });
  repulsionStrengthControl.title = 'Force pushing emojis away from center';
  tabContainers['Visual'].appendChild(repulsionStrengthControl);

  // === Phase 11.7.19: Emoji Particle Fusion & Clusters ===
  const emojiFusionLabel = document.createElement("h4");
  emojiFusionLabel.textContent = "⚡ Emoji Fusion & Clusters";
  emojiFusionLabel.style.cssText = 'margin: 15px 0 10px 0; color: #ff00ff; font-size: 12px;';
  tabContainers['Visual'].appendChild(emojiFusionLabel);

  // Fusion enabled toggle
  const fusionToggle = createToggleControl('Enable Fusion', false, (value) => {
    state.emojiFusion.enabled = value;
    if (value) {
      console.log(`⚡ Fusion enabled (threshold ${state.emojiFusion.threshold.toFixed(1)})`);
    } else {
      console.log("⚡ Fusion disabled");
    }
  });
  fusionToggle.title = 'Particles merge into clusters when overlapping';
  tabContainers['Visual'].appendChild(fusionToggle);

  // Fusion threshold slider
  const fusionThresholdControl = createSliderControl('Fusion Threshold', 1.0, 0.1, 2.0, 0.1, (value) => {
    state.emojiFusion.threshold = value;
    console.log(`⚡ Fusion threshold = ${value.toFixed(1)}`);
  });
  fusionThresholdControl.title = 'Distance threshold for fusion (smaller = more fusions)';
  tabContainers['Visual'].appendChild(fusionThresholdControl);

  // === Phase 11.7.20: Emoji Constellations & Symbolic Geometry ===
  const emojiConstellationLabel = document.createElement("h4");
  emojiConstellationLabel.textContent = "🌌 Emoji Constellations";
  emojiConstellationLabel.style.cssText = 'margin: 15px 0 10px 0; color: #ffaa00; font-size: 12px;';
  tabContainers['Visual'].appendChild(emojiConstellationLabel);

  // Constellation type dropdown
  const constellationTypeLabel = document.createElement("label");
  constellationTypeLabel.textContent = "Constellation Pattern";
  constellationTypeLabel.style.cssText = 'display: block; font-size: 11px; margin-bottom: 4px; color: #ffaa00;';
  tabContainers['Visual'].appendChild(constellationTypeLabel);

  const constellationTypeDropdown = document.createElement("select");
  constellationTypeDropdown.style.cssText = 'width: 100%; padding: 6px; background: rgba(0,0,0,0.5); border: 1px solid #ffaa00; color: #ffaa00; border-radius: 4px; margin-bottom: 10px; font-size: 11px;';

  const constellationTypes = [
    { value: 'None', label: 'None (Free Motion)' },
    { value: 'Line', label: 'Line' },
    { value: 'Triangle', label: 'Triangle' },
    { value: 'Star', label: '5-Point Star ⭐' },
    { value: 'Spiral', label: 'Golden Spiral 🌀' },
    { value: 'CircleOf5ths', label: 'Circle of 5ths 🎵' },
    { value: 'Platonic', label: 'Platonic Solid (Icosahedron)' },
    { value: 'Custom', label: 'Custom Pattern (JSON)' }
  ];

  constellationTypes.forEach(type => {
    const option = document.createElement("option");
    option.value = type.value;
    option.textContent = type.label;
    constellationTypeDropdown.appendChild(option);
  });

  constellationTypeDropdown.addEventListener("change", () => {
    const type = constellationTypeDropdown.value;
    state.emojiConstellations.type = type;
    state.emojiConstellations.rotation = 0; // Reset rotation

    console.log(`🌌 Emoji constellation set: ${type}`);
  });
  tabContainers['Visual'].appendChild(constellationTypeDropdown);

  // Constellation scale slider
  const constellationScaleControl = createSliderControl('Constellation Scale', 5.0, 1.0, 15.0, 0.5, (value) => {
    state.emojiConstellations.scale = value;
    console.log(`🌌 Constellation scale: ${value.toFixed(1)}`);
  });
  constellationScaleControl.title = 'Size of the constellation pattern';
  tabContainers['Visual'].appendChild(constellationScaleControl);

  // Rotation speed slider
  const rotationSpeedControl = createSliderControl('Rotation Speed', 0.01, 0, 0.1, 0.005, (value) => {
    state.emojiConstellations.rotationSpeed = value;
    console.log(`🌌 Rotation speed: ${value.toFixed(3)}`);
  });
  rotationSpeedControl.title = 'Speed of constellation rotation';
  tabContainers['Visual'].appendChild(rotationSpeedControl);

  // Audio sync toggle
  const audioSyncToggle = createToggleControl('Audio Sync Rotation', true, (value) => {
    state.emojiConstellations.audioSync = value;
    console.log(`🌌 Audio sync: ${value ? 'ON' : 'OFF'}`);
  });
  audioSyncToggle.title = 'Rotation modulated by audio level';
  tabContainers['Visual'].appendChild(audioSyncToggle);

  // Beat sync toggle for constellations
  const constellationBeatSyncToggle = createToggleControl('Beat Sync Pulse', false, (value) => {
    state.emojiConstellations.beatSync = value;
    console.log(`🌌 Beat sync pulse: ${value ? 'ON' : 'OFF'}`);
  });
  constellationBeatSyncToggle.title = 'Constellation pulses with sequencer beats';
  tabContainers['Visual'].appendChild(constellationBeatSyncToggle);

  // Custom pattern JSON upload
  const customPatternLabel = document.createElement("label");
  customPatternLabel.textContent = "Upload Custom Pattern (JSON)";
  customPatternLabel.style.cssText = 'display: block; font-size: 11px; margin-top: 10px; margin-bottom: 4px; color: #ffaa00;';
  tabContainers['Visual'].appendChild(customPatternLabel);

  const customPatternInput = document.createElement("input");
  customPatternInput.type = "file";
  customPatternInput.accept = ".json";
  customPatternInput.style.cssText = 'width: 100%; padding: 4px; background: rgba(0,0,0,0.5); border: 1px solid #ffaa00; color: #ffaa00; border-radius: 4px; margin-bottom: 10px; font-size: 11px;';

  customPatternInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const pattern = JSON.parse(text);

      if (!pattern.positions || !Array.isArray(pattern.positions)) {
        console.error("❌ Invalid pattern format. Expected { positions: [{x, y, z?}, ...] }");
        return;
      }

      state.emojiConstellations.customPattern = pattern;
      state.emojiConstellations.type = 'Custom';
      constellationTypeDropdown.value = 'Custom';

      console.log(`🌌 Loaded custom constellation → ${file.name}`);
      console.log(`   ${pattern.positions.length} positions loaded`);
    } catch (error) {
      console.error("❌ Failed to load pattern JSON:", error.message);
    }
  });
  tabContainers['Visual'].appendChild(customPatternInput);

  // === Phase 11.7.21/11.7.50: Emoji Mandalas (Modular) ===
  try {
    createMandalaHudSection(tabContainers['Visual'], notifyHUDUpdate, createToggleControl, createSliderControl);
  } catch (error) {
    console.error('❌ Failed to create Mandala HUD section:', error);
  }

  // === Phase 12.0: Geometry (Morph Shape Controls) ===
  createGeometryHudSection(tabContainers['Visual'], { camera: null, renderer: null, controls: null });

  // === Phase 2.3.2A: Particle Trails ===
  const trailsLabel = document.createElement("h4");
  trailsLabel.textContent = "🌊 Particle Trails (Line Segments)";
  trailsLabel.style.cssText = 'margin: 15px 0 10px 0; color: #00ffff; font-size: 12px;';
  tabContainers['Visual'].appendChild(trailsLabel);

  // Trail enabled toggle (line trails)
  const trailEnabledControl = createToggleControl('Enable Line Trails', false, (value) => {
    notifyHUDUpdate({ particlesTrailEnabled: value });
  });
  tabContainers['Visual'].appendChild(trailEnabledControl);

  // Trail length slider
  const trailLengthControl = createSliderControl('Trail Length', 0, 0, 10, 1, (value) => {
    notifyHUDUpdate({ particlesTrailLength: value });
  });
  trailLengthControl.title = 'Number of frames to persist (0-10)';
  tabContainers['Visual'].appendChild(trailLengthControl);

  // Trail opacity slider
  const trailOpacityControl = createSliderControl('Trail Opacity', 0.3, 0.0, 1.0, 0.05, (value) => {
    notifyHUDUpdate({ particlesTrailOpacity: value });
  });
  trailOpacityControl.title = 'Transparency of trail lines (0.0-1.0)';
  tabContainers['Visual'].appendChild(trailOpacityControl);

  // Trail fade slider (Phase 2.3.2C)
  const trailFadeControl = createSliderControl('Trail Fade', 1.0, 0.0, 1.0, 0.05, (value) => {
    notifyHUDUpdate({ particlesTrailFade: value });
  });
  trailFadeControl.title = 'Strength of fading (0=no fade, 1=full taper)';
  tabContainers['Visual'].appendChild(trailFadeControl);

  // Phase 2.3.2D: Audio-reactive trail length controls
  const trailAudioReactiveControl = createToggleControl('Audio Reactive Length', false, (value) => {
    notifyHUDUpdate({ particlesTrailAudioReactive: value });
  });
  trailAudioReactiveControl.title = 'Trail length follows audio level';
  tabContainers['Visual'].appendChild(trailAudioReactiveControl);

  const trailLengthMinControl = createSliderControl('Min Length', 2, 1, 10, 1, (value) => {
    notifyHUDUpdate({ particlesTrailLengthMin: value });
  });
  trailLengthMinControl.title = 'Shortest trail when audio is quiet';
  tabContainers['Visual'].appendChild(trailLengthMinControl);

  const trailLengthMaxControl = createSliderControl('Max Length', 10, 1, 20, 1, (value) => {
    notifyHUDUpdate({ particlesTrailLengthMax: value });
  });
  trailLengthMaxControl.title = 'Longest trail when audio is loud';
  tabContainers['Visual'].appendChild(trailLengthMaxControl);

  // === Dual Trail System: Motion Trails (postprocessing blur) ===
  const motionTrailsLabel = document.createElement("h4");
  motionTrailsLabel.textContent = "🎞️ Motion Trails (Postprocessing)";
  motionTrailsLabel.style.cssText = 'margin: 15px 0 10px 0; color: #ffcc00; font-size: 12px;';
  tabContainers['Visual'].appendChild(motionTrailsLabel);

  // Motion trails toggle
  const motionTrailsControl = createToggleControl('Enable Motion Trails', false, (value) => {
    notifyHUDUpdate({ motionTrailsEnabled: value });
  });
  motionTrailsControl.title = 'AfterimagePass blur effect (works independently of line trails)';
  tabContainers['Visual'].appendChild(motionTrailsControl);

  // Motion trail intensity slider
  const motionTrailIntensityControl = createSliderControl('Trail Intensity', 0.96, 0.85, 0.99, 0.01, (value) => {
    notifyHUDUpdate({ motionTrailIntensity: value });
  });
  motionTrailIntensityControl.title = 'Blur damp value (higher = longer trails)';
  tabContainers['Visual'].appendChild(motionTrailIntensityControl);

  // === Phase 4.8.1: Reset to Defaults Button ===
  const resetButton = document.createElement('button');
  resetButton.textContent = '🔄 Reset to Defaults';
  resetButton.style.cssText = 'width: 100%; padding: 10px; background: #ff9900; color: black; border: none; cursor: pointer; font-weight: bold; border-radius: 5px; margin-top: 15px; margin-bottom: 15px;';
  resetButton.addEventListener('click', () => {
    notifyHUDUpdate({ particlesResetDefaults: true });
  });
  tabContainers['Visual'].appendChild(resetButton);

  // Phase 12.0: Center Me button (resets camera + morph shape position/rotation)
  const centerMeBtn = document.createElement('button');
  centerMeBtn.textContent = '🎯 Center Me';
  centerMeBtn.style.cssText = 'width: 100%; padding: 10px; background: #00aaff; color: white; border: none; cursor: pointer; font-weight: bold; border-radius: 5px; margin-bottom: 15px; font-size: 14px;';
  centerMeBtn.addEventListener('click', async () => {
    const { centerCameraAndMorph } = await import('./geometry.js');
    centerCameraAndMorph();
  });
  centerMeBtn.title = 'Reset camera and morph shape to center position';
  tabContainers['Visual'].appendChild(centerMeBtn);

  // Add separator for Phase 7 visual controls
  const visualSeparator = document.createElement('hr');
  visualSeparator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  tabContainers['Visual'].appendChild(visualSeparator);

  const visualTitle = document.createElement('h4');
  visualTitle.textContent = '🎨 Visual Polish';
  visualTitle.style.cssText = 'margin: 0 0 10px 0; color: #ff66ff; font-size: 12px;';
  tabContainers['Visual'].appendChild(visualTitle);

  // === Phase 11.6.0/11.7.50: Background Image (Modular) ===
  createBackgroundHudSection(tabContainers['Visual']);

  // === Phase 13.6.0: Acid Empire (Modular) ===
  createAcidEmpireHudSection(tabContainers['Visual']);

  // === Phase 13.29: Hyperbolic Tiling (Modular) ===
  createHyperbolicTilingHudSection(tabContainers['Visual']);

  // === Phase 13.30: Skybox Render Mode (Global Setting) ===
  const skyboxRenderModeLabel = document.createElement('label');
  skyboxRenderModeLabel.textContent = "🌐 Skybox Render Mode";
  skyboxRenderModeLabel.style.cssText = 'display: block; margin: 15px 0 5px 0; color: #00ffff; font-size: 11px; font-weight: bold;';
  tabContainers['Visual'].appendChild(skyboxRenderModeLabel);

  const skyboxRenderModeDropdown = document.createElement("select");
  skyboxRenderModeDropdown.style.cssText = 'width: 100%; padding: 4px; background: #111; color: #0ff; border: 1px solid #0ff; margin-bottom: 10px;';

  const mode360Option = document.createElement("option");
  mode360Option.value = "360";
  mode360Option.textContent = "360° Panorama (Seamless)";
  skyboxRenderModeDropdown.appendChild(mode360Option);

  const modePerPanelOption = document.createElement("option");
  modePerPanelOption.value = "per-panel";
  modePerPanelOption.textContent = "Per-Panel (6 Faces)";
  skyboxRenderModeDropdown.appendChild(modePerPanelOption);

  skyboxRenderModeDropdown.value = state.skyboxRenderMode || '360';

  skyboxRenderModeDropdown.addEventListener("change", () => {
    state.skyboxRenderMode = skyboxRenderModeDropdown.value;
    console.log(`🌐 Skybox render mode: ${state.skyboxRenderMode}`);
  });

  skyboxRenderModeDropdown.title = '360° creates seamless equirectangular panorama. Per-Panel renders each cube face independently.';
  tabContainers['Visual'].appendChild(skyboxRenderModeDropdown);

  // === Phase 13.7.0: Voxel Wave (Modular) ===
  createVoxelWaveHudSection(tabContainers['Visual']);

  // === Luminous Tessellation (Modular) ===
  createLuminousTessellationHudSection(tabContainers['Visual']);

  // === Sacred Geometry (Modular) ===
  createSacredGeometryHudSection(tabContainers['Visual']);

  // === Ray Marching (Modular) ===
  createRayMarchingHudSection(tabContainers['Visual']);

  // === Liquid Simulation (Modular) ===
  createLiquidSimHudSection(tabContainers['Visual']);

  // === Kaleidoscope (Modular) ===
  createKaleidoscopeHudSection(tabContainers['Visual']);

  // === Cellular Automata (Modular) ===
  createCellularAutomataHudSection(tabContainers['Visual']);

  // === Flow Field (Modular) ===
  createFlowFieldHudSection(tabContainers['Visual']);

  // === Mandelbulb Voxel Core (Modular) ===
  createMandelbulbHudSection(tabContainers['Visual']);

  // Ambient light intensity
  const ambientLightControl = createSliderControl('Ambient Intensity', 0.4, 0.0, 2.0, 0.1, (value) => {
    notifyHUDUpdate({ ambientIntensity: value });
  });
  tabContainers['Visual'].appendChild(ambientLightControl);

  // Directional light intensity
  const directionalLightControl = createSliderControl('Directional Intensity', 1.0, 0.0, 2.0, 0.1, (value) => {
    notifyHUDUpdate({ directionalIntensity: value });
  });
  tabContainers['Visual'].appendChild(directionalLightControl);

  // Directional light angle X
  const directionalAngleXControl = createSliderControl('Light Angle X', -45, -90, 90, 5, (value) => {
    notifyHUDUpdate({ directionalAngleX: value });
  });
  tabContainers['Visual'].appendChild(directionalAngleXControl);

  // Directional light angle Y
  const directionalAngleYControl = createSliderControl('Light Angle Y', 45, -90, 90, 5, (value) => {
    notifyHUDUpdate({ directionalAngleY: value });
  });
  tabContainers['Visual'].appendChild(directionalAngleYControl);

  // Color picker
  const colorPickerControl = createColorPickerControl('Geometry Color', '#00ff00', (value) => {
    notifyHUDUpdate({ color: value });
  });
  tabContainers['Visual'].appendChild(colorPickerControl);

  // Phase 11.2.2: Per-Layer Color System
  const colorLayersSeparator = document.createElement('hr');
  colorLayersSeparator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  tabContainers['Visual'].appendChild(colorLayersSeparator);

  const colorLayersTitle = document.createElement('h4');
  colorLayersTitle.textContent = '🎨 Color Layers (Phase 11.2.2)';
  colorLayersTitle.style.cssText = 'margin: 0 0 10px 0; color: #ff00ff; font-size: 12px;';
  tabContainers['Visual'].appendChild(colorLayersTitle);

  // Geometry Layer
  const geometryLayerLabel = document.createElement('h5');
  geometryLayerLabel.textContent = '🔺 Geometry';
  geometryLayerLabel.style.cssText = 'margin: 10px 0 5px 0; color: #00ff00; font-size: 11px;';
  tabContainers['Visual'].appendChild(geometryLayerLabel);

  const geometryBaseColorControl = createColorPickerControl('Base Color', '#00ff00', (value) => {
    notifyHUDUpdate({ colorLayer: 'geometry', property: 'baseColor', value });
  });
  tabContainers['Visual'].appendChild(geometryBaseColorControl);

  const geometryAudioColorControl = createColorPickerControl('Audio Color', '#ff0000', (value) => {
    notifyHUDUpdate({ colorLayer: 'geometry', property: 'audioColor', value });
  });
  tabContainers['Visual'].appendChild(geometryAudioColorControl);

  const geometryIntensityControl = createSliderControl('Audio Intensity', 0.5, 0.0, 1.0, 0.05, (value) => {
    notifyHUDUpdate({ colorLayer: 'geometry', property: 'audioIntensity', value });
  });
  geometryIntensityControl.title = 'Controls audio color contribution (0 = none, 1 = full)';
  tabContainers['Visual'].appendChild(geometryIntensityControl);

  // Vessel Layer
  const vesselLayerLabel = document.createElement('h5');
  vesselLayerLabel.textContent = '🚢 Vessel';
  vesselLayerLabel.style.cssText = 'margin: 10px 0 5px 0; color: #00ffff; font-size: 11px;';
  tabContainers['Visual'].appendChild(vesselLayerLabel);

  const vesselBaseColorControl = createColorPickerControl('Base Color', '#00ff00', (value) => {
    notifyHUDUpdate({ colorLayer: 'vessel', property: 'baseColor', value });
  });
  tabContainers['Visual'].appendChild(vesselBaseColorControl);

  const vesselAudioColorControl = createColorPickerControl('Audio Color', '#00ffff', (value) => {
    notifyHUDUpdate({ colorLayer: 'vessel', property: 'audioColor', value });
  });
  tabContainers['Visual'].appendChild(vesselAudioColorControl);

  const vesselIntensityControl = createSliderControl('Audio Intensity', 0.3, 0.0, 1.0, 0.05, (value) => {
    notifyHUDUpdate({ colorLayer: 'vessel', property: 'audioIntensity', value });
  });
  vesselIntensityControl.title = 'Controls audio color contribution (0 = none, 1 = full)';
  tabContainers['Visual'].appendChild(vesselIntensityControl);

  // Shadows Layer
  const shadowsLayerLabel = document.createElement('h5');
  shadowsLayerLabel.textContent = '🌑 Shadows';
  shadowsLayerLabel.style.cssText = 'margin: 10px 0 5px 0; color: #888; font-size: 11px;';
  tabContainers['Visual'].appendChild(shadowsLayerLabel);

  const shadowsBaseColorControl = createColorPickerControl('Base Color', '#000000', (value) => {
    notifyHUDUpdate({ colorLayer: 'shadows', property: 'baseColor', value });
  });
  tabContainers['Visual'].appendChild(shadowsBaseColorControl);

  const shadowsAudioColorControl = createColorPickerControl('Audio Color', '#333333', (value) => {
    notifyHUDUpdate({ colorLayer: 'shadows', property: 'audioColor', value });
  });
  tabContainers['Visual'].appendChild(shadowsAudioColorControl);

  const shadowsIntensityControl = createSliderControl('Audio Intensity', 0.2, 0.0, 1.0, 0.05, (value) => {
    notifyHUDUpdate({ colorLayer: 'shadows', property: 'audioIntensity', value });
  });
  shadowsIntensityControl.title = 'Controls audio color contribution (0 = none, 1 = full)';
  tabContainers['Visual'].appendChild(shadowsIntensityControl);

  // Particles Layer
  const particlesLayerLabel = document.createElement('h5');
  particlesLayerLabel.textContent = '✨ Particles (Shader - Infra Only)';
  particlesLayerLabel.style.cssText = 'margin: 10px 0 5px 0; color: #ffff00; font-size: 11px;';
  tabContainers['Visual'].appendChild(particlesLayerLabel);

  const particlesBaseColorControl = createColorPickerControl('Base Color', '#ffff00', (value) => {
    notifyHUDUpdate({ colorLayer: 'particles', property: 'baseColor', value });
  });
  particlesBaseColorControl.title = 'Ready but requires shader update (future phase)';
  tabContainers['Visual'].appendChild(particlesBaseColorControl);

  const particlesAudioColorControl = createColorPickerControl('Audio Color', '#ff00ff', (value) => {
    notifyHUDUpdate({ colorLayer: 'particles', property: 'audioColor', value });
  });
  particlesAudioColorControl.title = 'Ready but requires shader update (future phase)';
  tabContainers['Visual'].appendChild(particlesAudioColorControl);

  const particlesIntensityControl = createSliderControl('Audio Intensity', 0.7, 0.0, 1.0, 0.05, (value) => {
    notifyHUDUpdate({ colorLayer: 'particles', property: 'audioIntensity', value });
  });
  particlesIntensityControl.title = 'Ready but requires shader update (future phase)';
  tabContainers['Visual'].appendChild(particlesIntensityControl);

  // Phase 11.7.50: Modular Vessel HUD section
  createVesselHudSection(tabContainers['Visual'], notifyHUDUpdate);

  // Add separator for Shadow Box controls
  const shadowBoxSeparator = document.createElement('hr');
  shadowBoxSeparator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  tabContainers['Visual'].appendChild(shadowBoxSeparator);

  const shadowBoxTitle = document.createElement('h4');
  shadowBoxTitle.textContent = '📦 Shadow Box';
  shadowBoxTitle.style.cssText = 'margin: 0 0 10px 0; color: #888; font-size: 12px;';
  tabContainers['Visual'].appendChild(shadowBoxTitle);

  // Phase 2.3.3: Shadow Box controls
  const projectParticlesToShadowControl = createToggleControl('Project Particles', false, (value) => {
    notifyHUDUpdate({ shadowBoxProjectParticles: value });
  });
  tabContainers['Visual'].appendChild(projectParticlesToShadowControl);

  // Phase 2.3.6: Shadow Box palette selector
  const shadowPaletteControl = createDropdownControl('Palette', 'Manual',
    ['Manual', 'Alchemy Gold', 'Blake Indigo', 'Cosmic White'], (value) => {
    notifyHUDUpdate({ shadowBoxPalette: value });
  });
  shadowPaletteControl.title = 'Quick palette presets or manual color selection';
  tabContainers['Visual'].appendChild(shadowPaletteControl);

  // Phase 2.3.4: Shadow Box shader controls
  const shadowThresholdControl = createSliderControl('Threshold', 0.5, 0.0, 1.0, 0.01, (value) => {
    notifyHUDUpdate({ shadowBoxThreshold: value });
  });
  shadowThresholdControl.title = 'Cutoff point: below = background, above = foreground';
  tabContainers['Visual'].appendChild(shadowThresholdControl);

  const shadowBleachGainControl = createSliderControl('Bleach Gain', 1.0, 0.5, 3.0, 0.1, (value) => {
    notifyHUDUpdate({ shadowBoxBleachGain: value });
  });
  shadowBleachGainControl.title = 'Luminance amplification before threshold';
  tabContainers['Visual'].appendChild(shadowBleachGainControl);

  // Phase 2.3.5: Two-tone color controls
  const shadowBgColorControl = createColorPickerControl('Background Color', '#000000', (value) => {
    notifyHUDUpdate({ shadowBoxBgColor: value });
  });
  shadowBgColorControl.title = 'Color for pixels below threshold';
  tabContainers['Visual'].appendChild(shadowBgColorControl);

  const shadowFgColorControl = createColorPickerControl('Foreground Color', '#ffffff', (value) => {
    notifyHUDUpdate({ shadowBoxFgColor: value });
  });
  shadowFgColorControl.title = 'Color for pixels above threshold';
  tabContainers['Visual'].appendChild(shadowFgColorControl);

  // Phase 13.8: Shadow Layer pop-up window toggle
  const shadowLayerSeparator = document.createElement('hr');
  shadowLayerSeparator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  tabContainers['Visual'].appendChild(shadowLayerSeparator);

  const shadowLayerTitle = document.createElement('h4');
  shadowLayerTitle.textContent = '🌓 Shadow Layer (Interpretive Dimension)';
  shadowLayerTitle.style.cssText = 'margin: 0 0 10px 0; color: #9966ff; font-size: 12px;';
  tabContainers['Visual'].appendChild(shadowLayerTitle);

  // Shadow Layer toggle button
  const shadowLayerBtn = document.createElement('button');
  shadowLayerBtn.textContent = 'Open Shadow Layer Window';
  shadowLayerBtn.style.cssText = `
    width: 100%;
    padding: 10px;
    background: linear-gradient(135deg, #2a1a4a, #4a2a6a);
    color: #fff;
    border: 1px solid #6644aa;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    margin-bottom: 10px;
    transition: all 0.2s;
  `;
  shadowLayerBtn.addEventListener('mouseenter', () => {
    shadowLayerBtn.style.background = 'linear-gradient(135deg, #3a2a5a, #5a3a7a)';
  });
  shadowLayerBtn.addEventListener('mouseleave', () => {
    shadowLayerBtn.style.background = 'linear-gradient(135deg, #2a1a4a, #4a2a6a)';
  });
  shadowLayerBtn.addEventListener('click', () => {
    // Import and toggle shadow layer
    import('./shadowLayer.js').then(({ toggleShadowLayer, isShadowLayerOpen }) => {
      toggleShadowLayer();
      // Update button text
      setTimeout(() => {
        shadowLayerBtn.textContent = isShadowLayerOpen()
          ? 'Close Shadow Layer Window'
          : 'Open Shadow Layer Window';
      }, 100);
    }).catch(err => {
      console.error("Failed to load shadowLayer.js:", err);
    });
  });
  shadowLayerBtn.title = 'Opens a separate window with phase-offset echo visualization for comparative analysis';
  tabContainers['Visual'].appendChild(shadowLayerBtn);

  const shadowLayerInfo = document.createElement('div');
  shadowLayerInfo.style.cssText = 'font-size: 10px; color: #888; margin-bottom: 10px; line-height: 1.4;';
  shadowLayerInfo.innerHTML = `
    The Shadow Layer is a separate rendering window that shows an<br>
    interpretive echo of the main visualization with:<br>
    • Phase offset (30% delay)<br>
    • Echo decay (85% intensity)<br>
    • Color shift (+30° hue)<br>
    Perfect for comparative analysis and visual depth.
  `;
  tabContainers['Visual'].appendChild(shadowLayerInfo);

  // === Shadows (Modular) ===
  createShadowsHudSection(tabContainers['Visual'], notifyHUDUpdate, createToggleControl, createSliderControl, createColorPickerControl);

  // Add separator for Sprites controls
  const spritesSeparator = document.createElement('hr');
  spritesSeparator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  tabContainers['Visual'].appendChild(spritesSeparator);

  const spritesTitle = document.createElement('h4');
  spritesTitle.textContent = '✨ Sprites';
  spritesTitle.style.cssText = 'margin: 0 0 10px 0; color: #ffff00; font-size: 12px;';
  tabContainers['Visual'].appendChild(spritesTitle);

  // Sprites enable toggle
  const spritesEnableControl = createToggleControl('Enable Sprites', true, (value) => {
    notifyHUDUpdate({ spritesEnabled: value });
  });
  tabContainers['Visual'].appendChild(spritesEnableControl);

  // Sprites count slider
  const spritesCountControl = createSliderControl('Sprite Count', 200, 50, 500, 10, (value) => {
    notifyHUDUpdate({ spritesCount: value });
  });
  tabContainers['Visual'].appendChild(spritesCountControl);

  // Phase 11.7.50: Modular Telemetry/Debug HUD section
  createTelemetryHudSection(tabContainers['Advanced'], notifyHUDUpdate);

  // Phase 13.30: MMPA V2.0 Predictions HUD section
  createMMPAHudSection(tabContainers['Advanced'], notifyHUDUpdate);

  // Settings Configuration HUD section
  createSettingsHudSection(tabContainers['Settings']);

  // Phase 11.7.50: Modular MIDI HUD section
  createMidiHudSection(tabContainers['MIDI'], notifyHUDUpdate);

  // VCN Phase 1: Vessel Compass Navigator HUD section
  createVCNHudSection(tabContainers['VCN'], notifyHUDUpdate);

  // Skybox Destination Authoring: Destination authoring HUD section
  createDestinationHUD(tabContainers['Destinations']);

  // Signal Multimodality: Signal sources HUD section
  createSignalHUD(tabContainers['Signals']);

  // Material Physics Engine: ARPT scores and material states
  createMaterialPhysicsHUD(tabContainers['Signals']);

  // Myth Layer Compiler: Myth HUD section
  createMythHUD(tabContainers['Myth']);

  // Pedagogical Mode: Learning HUD section
  createPedagogicalHUD(tabContainers['Learn']);

  // AI Co-Agent Integration: AI generation HUD section
  createAIHUD(tabContainers['AI']);

  // AI Assistant: State-aware suggestions
  createAIAssistantHUD(tabContainers['AI']);

  // Camera & Biosignals: Camera HUD section
  createCameraHUD(tabContainers['Camera']);

  // Portal Builder: Portal HUD section
  createPortalHUD(tabContainers['Portal']);

  // Text/NLP Signals: Text Signal HUD section
  createTextSignalHUD(tabContainers['Text']);

  // Phase 11.5.0: Attach controls container to panel
  panel.appendChild(controlsContainer);

  return panel;
}

function createToggleControl(label, defaultValue, onChange) {
  const container = document.createElement('div');
  container.style.cssText = 'margin-bottom: 15px;';

  const labelEl = document.createElement('label');
  labelEl.textContent = label + ': ';
  labelEl.style.cssText = 'display: block; margin-bottom: 5px;';

  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.checked = defaultValue;
  toggle.style.cssText = 'margin-right: 5px;';

  toggle.addEventListener('change', () => {
    onChange(toggle.checked);
  });

  const status = document.createElement('span');
  status.textContent = defaultValue ? 'ON' : 'OFF';
  status.style.cssText = `color: ${defaultValue ? '#00ff00' : '#ff6666'};`;

  toggle.addEventListener('change', () => {
    status.textContent = toggle.checked ? 'ON' : 'OFF';
    status.style.color = toggle.checked ? '#00ff00' : '#ff6666';
  });

  labelEl.appendChild(toggle);
  labelEl.appendChild(status);
  container.appendChild(labelEl);

  return container;
}

function createSliderControl(label, defaultValue, min, max, step, onChange) {
  const container = document.createElement('div');
  container.style.cssText = 'margin-bottom: 15px;';

  const labelEl = document.createElement('label');
  labelEl.textContent = label + ': ';
  labelEl.style.cssText = 'display: block; margin-bottom: 5px;';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = defaultValue;
  slider.style.cssText = 'width: 100%; margin-bottom: 5px;';

  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = defaultValue.toFixed(3);
  valueDisplay.style.cssText = 'color: #00ff00; font-size: 12px;';

  slider.addEventListener('input', () => {
    const value = parseFloat(slider.value);
    valueDisplay.textContent = value.toFixed(3);
    onChange(value);
  });

  container.appendChild(labelEl);
  container.appendChild(slider);
  container.appendChild(valueDisplay);

  return container;
}

function createDropdownControl(label, defaultValue, options, onChange) {
  const container = document.createElement('div');
  container.style.cssText = 'margin-bottom: 15px;';

  const labelEl = document.createElement('label');
  labelEl.textContent = label + ': ';
  labelEl.style.cssText = 'display: block; margin-bottom: 5px;';

  const select = document.createElement('select');
  select.style.cssText = 'width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555;';

  // Add ID for vessel layout dropdown
  if (label === 'Vessel Layout') {
    select.id = 'vessel-layout-dropdown';
  }

  options.forEach(option => {
    const optionEl = document.createElement('option');
    optionEl.value = option;
    optionEl.textContent = option.charAt(0).toUpperCase() + option.slice(1);
    if (option === defaultValue) {
      optionEl.selected = true;
    }
    select.appendChild(optionEl);
  });

  select.addEventListener('change', () => {
    onChange(select.value);
  });

  container.appendChild(labelEl);
  container.appendChild(select);

  return container;
}

function createColorPickerControl(label, defaultValue, onChange) {
  const container = document.createElement('div');
  container.style.cssText = 'margin-bottom: 15px;';

  const labelEl = document.createElement('label');
  labelEl.textContent = label + ': ';
  labelEl.style.cssText = 'display: block; margin-bottom: 5px;';

  const colorPicker = document.createElement('input');
  colorPicker.type = 'color';
  colorPicker.value = defaultValue;
  colorPicker.style.cssText = 'width: 60%; height: 32px; padding: 2px; background: #333; border: 1px solid #555; cursor: pointer; margin-right: 10px;';

  const colorDisplay = document.createElement('span');
  colorDisplay.textContent = defaultValue.toUpperCase();
  colorDisplay.style.cssText = 'color: #00ff00; font-size: 12px; font-family: monospace;';

  colorPicker.addEventListener('change', () => {
    const value = colorPicker.value;
    colorDisplay.textContent = value.toUpperCase();
    onChange(value);
  });

  container.appendChild(labelEl);
  container.appendChild(colorPicker);
  container.appendChild(colorDisplay);

  return container;
}

export function updatePresetList(presets) {
  const hudPanel = document.getElementById('hud-panel');
  if (hudPanel && hudPanel.presetListContainer) {
    const listContainer = hudPanel.presetListContainer;
    const setSelectedPreset = hudPanel.setSelectedPreset;
    const categoryFilter = hudPanel.categoryFilter;
    const tagFilter = hudPanel.tagFilter;
    const searchInput = hudPanel.searchInput; // Phase 11.2.7

    // Clear current list
    listContainer.innerHTML = '';

    // Phase 11.2.6: Get filter values
    const selectedCategory = categoryFilter ? categoryFilter.value : 'All';
    const filterTagsInput = tagFilter ? tagFilter.value.trim() : '';
    const filterTags = filterTagsInput ? filterTagsInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0) : [];

    // Phase 11.2.7: Get search query
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (searchQuery) {
      console.log(`🔍 Search: ${searchQuery}`);
    }

    // Phase 11.2.6: Collect all categories and update category filter dropdown
    if (categoryFilter) {
      const allCategories = new Set(['All']);
      import('./presets.js').then(({ getPresetData }) => {
        presets.forEach(name => {
          const preset = getPresetData(name);
          if (preset && preset.category) {
            allCategories.add(preset.category);
          }
        });

        // Update category filter options
        const currentValue = categoryFilter.value;
        categoryFilter.innerHTML = '';
        Array.from(allCategories).sort().forEach(cat => {
          const option = document.createElement('option');
          option.value = cat;
          option.textContent = cat;
          if (cat === currentValue) option.selected = true;
          categoryFilter.appendChild(option);
        });
      });
    }

    if (presets.length === 0) {
      // Show empty state
      const emptyMessage = document.createElement('div');
      emptyMessage.textContent = 'No presets saved yet';
      emptyMessage.style.cssText = 'color: #666; font-size: 11px; text-align: center; padding: 10px;';
      listContainer.appendChild(emptyMessage);
      return;
    }

    // Phase 11.2.6: Filter and display presets
    import('./presets.js').then(({ getPresetData }) => {
      let filteredCount = 0;
      presets.forEach(presetName => {
        const presetData = getPresetData(presetName);
        const presetCategory = presetData?.category || 'Uncategorized';
        const presetTags = presetData?.tags || [];

        // Phase 11.2.7: Apply search filter (checks name, category, tags)
        if (searchQuery) {
          const nameMatch = presetName.toLowerCase().includes(searchQuery);
          const categoryMatch = presetCategory.toLowerCase().includes(searchQuery);
          const tagsMatch = presetTags.some(tag => tag.toLowerCase().includes(searchQuery));

          if (!nameMatch && !categoryMatch && !tagsMatch) {
            return; // Skip this preset
          }
        }

        // Apply category filter
        if (selectedCategory !== 'All' && presetCategory !== selectedCategory) {
          return; // Skip this preset
        }

        // Apply tag filter (all filter tags must be present)
        if (filterTags.length > 0) {
          const presetTagsLower = presetTags.map(t => t.toLowerCase());
          const hasAllTags = filterTags.every(ft => presetTagsLower.includes(ft));
          if (!hasAllTags) {
            return; // Skip this preset
          }
        }

        filteredCount++;

        const presetItem = document.createElement('div');
        presetItem.className = 'preset-item';
        presetItem.style.cssText = `
          padding: 6px 8px;
          margin-bottom: 3px;
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
          transition: background 0.2s, border-color 0.2s;
        `;

        // Phase 11.2.6: Preset name
        const nameSpan = document.createElement('div');
        nameSpan.textContent = presetName;
        nameSpan.style.cssText = 'font-weight: bold; margin-bottom: 3px;';
        presetItem.appendChild(nameSpan);

        // Phase 11.2.6: Category and tags display
        const metaSpan = document.createElement('div');
        metaSpan.style.cssText = 'font-size: 9px; color: #888;';
        metaSpan.textContent = `[${presetCategory}]`;
        if (presetTags.length > 0) {
          metaSpan.textContent += ` ${presetTags.map(t => `#${t}`).join(' ')}`;
        }
        presetItem.appendChild(metaSpan);

        // Hover effect
        presetItem.addEventListener('mouseenter', () => {
          presetItem.style.background = '#3a3a3a';
          presetItem.style.borderColor = '#666';
        });

        presetItem.addEventListener('mouseleave', () => {
          if (!presetItem.classList.contains('selected')) {
            presetItem.style.background = '#2a2a2a';
            presetItem.style.borderColor = '#444';
          }
        });

        // Click to select
        presetItem.addEventListener('click', () => {
          // Deselect all
          listContainer.querySelectorAll('.preset-item').forEach(item => {
            item.classList.remove('selected');
            item.style.background = '#2a2a2a';
            item.style.borderColor = '#444';
          });

          // Select this item
          presetItem.classList.add('selected');
          presetItem.style.background = '#0088ff';
          presetItem.style.borderColor = '#00aaff';
          setSelectedPreset(presetName);
        });

        listContainer.appendChild(presetItem);
      });

      // Show "no results" message if all presets were filtered out
      if (filteredCount === 0) {
        const noResultsMessage = document.createElement('div');
        noResultsMessage.textContent = 'No presets match filters';
        noResultsMessage.style.cssText = 'color: #666; font-size: 11px; text-align: center; padding: 10px;';
        listContainer.appendChild(noResultsMessage);
      }
    });
  }
}

// ✅ Phase 13.4.1 — notifyHUDUpdate is now merged into notifyHUDUpdate
// (Function removed - use notifyHUDUpdate(update) instead)

// Phase 4.8.1: Performance HUD update
export function updatePerformanceHUD(fps, drawCalls) {
  const fpsEl = document.getElementById('hud-fps');
  const drawCallsEl = document.getElementById('hud-drawcalls');
  if (fpsEl) fpsEl.textContent = fps;
  if (drawCallsEl) drawCallsEl.textContent = drawCalls;
}

import { AudioEngine } from "./audio.js";
import { audioState } from "./audioRouter.js";
import { state as appState } from "./state.js";

// Phase 13.1b: Audio reactive callback bridge
window.hudCallbacks.audioReactive = (audioData) => {
  // ✅ Phase 13.27 — Minimal audio state bridge
  // Update appState.audio with live audio data
  appState.audio.bass = audioData.bass ?? 0;
  appState.audio.mid = audioData.mid ?? 0;
  appState.audio.treble = audioData.treble ?? 0;
  appState.audio.level = audioData.level ?? 0;

  window.__HUD_AUDIO_LOGS__ && console.log("🔉 HUD audioReactive update →",
    "bass:", audioData.bass.toFixed(2),
    "mid:", audioData.mid.toFixed(2),
    "treble:", audioData.treble.toFixed(2),
    "level:", audioData.level.toFixed(2)
  );
};

// 🎯 FIX 18: DISABLE audio auto-start
// Audio now only starts when user explicitly enables it
// Users can call window.AudioEngine.start() from console or use HUD controls
/*
// Arm audio once the HUD finishes setting up (no prompts; safe if device missing)
setTimeout(() => {
  AudioEngine.start().then(ok => {
    if (ok) console.log("✅ Audio engine running");
  });
}, 1000);
*/
console.log("🎤 Audio engine will NOT auto-start - call AudioEngine.start() manually or via HUD");

// ——— Phase 13.20 Projector Mode toggle button (small, non-intrusive) ———
(function addProjectorButton() {
  // Wait until DOM is ready and HUD exists
  const root = document.body;
  if (!root) return;

  const btn = document.createElement('button');
  btn.textContent = '🖥️ Projector Mode';
  btn.title = 'Shift+P toggles; Esc exits';
  Object.assign(btn.style, {
    position: 'fixed',
    right: '12px',
    bottom: '12px',
    zIndex: 99999,
    padding: '8px 12px',
    background: '#111',
    color: '#eee',
    border: '1px solid #444',
    borderRadius: '8px',
    cursor: 'pointer',
    opacity: '0.85'
  });

  btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
  btn.addEventListener('mouseleave', () => btn.style.opacity = '0.85');
  btn.addEventListener('click', () => window.ProjectorMode?.toggle());

  root.appendChild(btn);

  // Hide the button itself in projector mode (keyboard Esc to exit)
  const obs = new MutationObserver(() => {
    const on = document.body.classList.contains('projector-mode') || document.documentElement.classList.contains('projector-mode');
    btn.style.display = on ? 'none' : 'block';
  });
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();

// ——— Phase 13.25.2: Console Noise Gate for HUD audio spam ———
(function noiseGateHUDLogs() {
  // Toggle in console: setAudioLog(true/false); setAudioLogRate( ms );
  window.__AUDIO_LOG_ENABLED__ = false;   // default: muted
  window.__AUDIO_LOG_MIN_MS__  = 1000;    // throttle window

  window.setAudioLog = (on = true) => { window.__AUDIO_LOG_ENABLED__ = !!on; console.warn('🔧 Audio log:', on ? 'ON' : 'OFF'); };
  window.setAudioLogRate = (ms = 1000) => { window.__AUDIO_LOG_MIN_MS__ = Math.max(0, ms|0); console.warn('🔧 Audio log rate set to', window.__AUDIO_LOG_MIN_MS__, 'ms'); };

  const ORIG_LOG = console.log;
  console.log = function (...args) {
    try {
      const first = args[0];
      // Only gate the noisy per-frame HUD audio line
      if (typeof first === 'string' && first.startsWith('🔉 HUD audioReactive update')) {
        if (!window.__AUDIO_LOG_ENABLED__) return; // muted
        const now = performance.now();
        const last = console.__lastAudioHUD__ || 0;
        if (now - last < (window.__AUDIO_LOG_MIN_MS__ ?? 1000)) return; // throttled
        console.__lastAudioHUD__ = now;
      }
    } catch (_) {}
    return ORIG_LOG.apply(console, args);
  };

  console.warn('🛑 HUD audio log gated (Phase 13.25.2). Use setAudioLog(true) to enable, setAudioLog(false) to mute.');
})();
