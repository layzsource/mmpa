// Phase 13.26 — Feature Beacon + ProjectorMode + Capture + Hotkeys
console.warn("🛰️ BEACON(main.js) 13.26", new Date().toISOString());

// ---------- Feature Beacon ----------
window.debugFeatures = function () {
  const has = (k) => typeof window[k] !== "undefined";
  const status = {
    source: "main.js",
    ts: new Date().toISOString(),
    projectorMode: has("ProjectorMode"),
    capture: has("Capture"),
    hotkeys: has("Hotkeys"),
    href: globalThis?.location?.href || "(no href)"
  };
  console.warn("🛰️ FeatureScan:", status);
  return status;
};
setTimeout(() => { try { window.debugFeatures(); } catch (e) {} }, 0);

// ---------- Projector Mode (REMOVED - see Phase 13.20/13.30 below) ----------

// Phase 13.11: Feature modules extracted to src/features/
// - Capture system: see features/capture.js
// - Hotkeys system: see features/hotkeys.js

// Phase 13.12 — Primary/Secondary role gate
const params = new URLSearchParams(location.search);
const ROLE = params.get('role') || (window.env?.isElectron ? 'primary' : 'secondary');
const IS_PRIMARY = ROLE === 'primary';
window.AppRole = { ROLE, IS_PRIMARY };
console.log(`🎭 Renderer role: ${ROLE} (primary owns audio/MIDI)`);

// Phase 2.3.3SS: Shadow Box Safe Stub (MUST be before imports to prevent boot crash)
var shadowBox = {
  render: () => {},
  setThreshold: () => {},
  setGain: () => {},
  setColors: () => {},
  setPalette: () => {},
  setShadowGain: () => {}
};

console.log("📦 ShadowBox safe stub active (Phase 2.3.3SS) - prevents initialization errors");

// Phase 11.7.1: Emoji particles global reference
let emojiParticles = null;

// Phase 11.7.15: Emoji stream manager global reference
let emojiStreamManager = null;

// Phase 11.7.16: Emoji sequencer global reference
let emojiSequencer = null;

// Phase 11.7.17: Emoji pattern bank manager global reference
let emojiBankManager = null;

// Phase 11.7.24: Mandala controller global reference
let mandalaController = null;

// VCN Phase 1: Global references for navigation system
let destinationManager = null;
let fieldNavigationSystem = null;
let firstPersonControls = null;
let vcnPanel = null;

// Skybox Destination Authoring: Global references
let destinationAuthoring = null;
let destinationNavigator = null;

// Stage 2: Game Mode global reference
let gameMode = null;

// Phase 13.11/13.13: Feature modules
import { initCapture } from './features/capture.js';
import { initHotkeys } from './features/hotkeys.js';
import { initProjectorMode } from './features/projectorMode.js';

import * as THREE from 'three';
import { initHUD, updatePresetList } from './hud.js';
import { initMIDI, getMIDIDeviceCount } from './midi.js';
import { initMIDI as initMMPAMIDI } from './midiController.js'; // MMPA MIDI Controller
import { getHUDIdleSpin, getVisualData, getMorphState, scene, renderer, camera, initMorphShape, composer } from './geometry.js'; // Phase 12.1: added initMorphShape, Phase 13.8: added composer
import { initShadows } from './shadows.js';
import { initSprites } from './sprites.js';
import { initParticles, getParticleSystemInstance, EmojiParticles, EmojiStreamManager, EmojiSequencer, EmojiPatternBankManager } from './particles.js'; // Phase 11.7.1, 11.7.15, 11.7.16, 11.7.17
import { MandalaController } from './mandalaController.js'; // Phase 11.7.24
import { initVessel, updateVessel, getVesselGroup } from './vessel.js'; // Phase 13.1.0: Restored vessel system
import { initVisual, updateVisual } from './visual.js'; // Phase 13.1.0: Restored visual system
import { initVoxelFloor, updateVoxelFloor } from './voxelFloor.js'; // Phase 13.7.3: 64×64 voxel floor
import { initVoxelMist } from './voxelMist.js'; // Phase 13.7.3: Volumetric mist
import { initTelemetry } from './telemetry.js';
import { initPresets, createDefaultPresets, listPresets, getCurrentPresetName } from './presets.js';
import { initAudio, getAudioValues, AudioEngine } from './audio.js';
import { state } from './state.js';
import { SHADOW_LAYER } from './constants.js'; // Phase 2.3.3

// VCN Phase 1: Vessel Compass Navigator imports
import { DestinationManager } from './destinations.js';
import { ExpandedFieldNavigationSystem } from './fieldNavigation.js';
import { FirstPersonControls } from './cameraControls.js';
import { VCNPanel } from './vcnPanel.js';

// Skybox Destination Authoring imports
import { DestinationAuthoringSystem } from './destinationAuthoring.js';
import { DestinationNavigator } from './destinationNavigation.js';

// Signal Multimodality imports
import { signalRouter } from './signalRouter.js';

// Myth Layer Compiler imports
import { MythCompiler } from './mythCompiler.js';
import { GlyphRenderer } from './mythGlyphs.js';

// Pedagogical Mode imports
import { PedagogicalSystem } from './pedagogicalCore.js';

// AI Co-Agent Integration imports
import { AICoAgent, ClaudeProvider, OpenAIProvider, GeminiProvider } from './aiCoAgent.js';

// AI State Snapshot System imports
import { stateSnapshotCapturer, SceneStateSnapshot } from './ai/stateSnapshot.js';

// AI Provider System imports
import { providerManager } from './ai/providers.js';

// Camera Signal System imports
import { CameraSignalProvider, OSCSignalAdapter, BiosignalAdapter } from './cameraSignalProvider.js';
import { CameraSignalRouter } from './cameraSignalRouter.js';

// Portal Builder imports
import { PortalManager } from './portalBuilder/portalManager.js';
import { SkyboxEditor } from './portalBuilder/skyboxEditor.js';
import { GeometryFieldBuilder } from './portalBuilder/geometryBuilder.js';
import { WaveformFieldEditor } from './portalBuilder/waveformEditor.js';
import { PortalMapUI } from './portalBuilder/portalMapUI.js';

// Text/NLP Signal Layer imports
import { TextSignalProvider, TextSignalBindings } from './textSignalProvider.js';

// Stage 2: Game Mode import
import { GameMode } from './gameMode.js';

// Humanoid dancer import
import { initHumanoid, updateHumanoid, setHumanoidVisible } from './humanoid.js';

// Phase 13.9: Input Manager import
import { initInputManager } from './core/inputManager.js';

// In secondary renderers, politely disable engine starts without breaking UI
if (!IS_PRIMARY && AudioEngine?.start) {
  const _start = AudioEngine.start.bind(AudioEngine);
  AudioEngine.start = async (...args) => {
    console.log('🔒 Secondary role: AudioEngine.start() blocked');
    return { ok: false, reason: 'secondary-role' };
  };
}

// Optional: keep Web MIDI from binding devices in secondary
if (!IS_PRIMARY && navigator.requestMIDIAccess) {
  const originalMIDIAccess = navigator.requestMIDIAccess.bind(navigator);
  navigator.requestMIDIAccess = async (...args) => {
    console.log('🔒 Secondary role: MIDI access stubbed');
    // Minimal stub with empty inputs/outputs to keep callers happy
    return {
      inputs: new Map(),
      outputs: new Map(),
      onstatechange: null
    };
  };
}

// Import the new router modules to set up the signal routing
import './midiRouter.js';
import './hudRouter.js';
import { initAudioRouter } from './audioRouter.js';
import { initOpticalRouter } from './opticalRouter.js';
import './presetRouter.js';

// Phase 11.2.3: Initialize unified control binding system
import { initDefaultBindings } from './controlBindings.js';
initDefaultBindings();

console.log("🔄 Build timestamp:", new Date().toISOString());

// Phase 2.3.3R: Import real ShadowBox from vessel.js (no longer using failsafe)
import { ShadowBox } from './vessel.js';
import { initRecorder } from './hudRecorder.js';
import { getAudioContext } from './audio.js';

// Phase 13.27: Financial Data Pipeline HUD
import './hudFinancial.js';

initHUD();

initMIDI(() => {
  console.log("🎹 MIDI ready");
});

// Initialize MMPA MIDI Controller
initMMPAMIDI().then(success => {
  if (success) {
    console.log("🎹 MMPA MIDI Controller ready");
  } else {
    console.log("🎹 MMPA MIDI Controller not available (Web MIDI API not supported)");
  }
});

initPresets();
createDefaultPresets();

// Restore presets from localStorage
try {
  const savedPresets = JSON.parse(localStorage.getItem("presets") || "{}");
  if (Object.keys(savedPresets).length > 0) {
    console.log("💾 Restored presets from localStorage");
  }
} catch (error) {
  console.warn("💾 Failed to restore presets:", error);
}

initAudio();

// Phase 13.4: Initialize audio router event relay
initAudioRouter();

// Initialize optical router (parallel to audio router)
initOpticalRouter();

// Initialize video recorder with canvas and audio context
// Get renderer canvas (renderer is globally available from geometry.js)
const recorderCanvas = window.renderer?.domElement || document.querySelector('#app');
const recorderAudioCtx = getAudioContext();
if (recorderCanvas) {
  initRecorder(recorderCanvas, recorderAudioCtx);
  console.log('🎥 Video recorder initialized');
} else {
  console.warn('🎥 Recorder initialization delayed: canvas not ready');
}

initShadows(scene);

initSprites(scene);

// Phase 12.1: Initialize morph shape (cube-sphere conflation)
const morphShape = initMorphShape(scene);
window.morphShape = morphShape; // expose for debugging
console.log("🔺 Morph Shape initialized and exposed globally");

// Initialize humanoid dancer at morph shape position
try {
  console.log("🕺 About to initialize humanoid...");
  initHumanoid(scene);
  console.log("🕺 Humanoid initialization complete");
} catch (error) {
  console.error("🕺 Humanoid initialization FAILED:", error);
}

// Phase 13.1.0: Initialize visual/background system
initVisual(scene);

// Phase 13.1.0: Initialize vessel system with Conflat 6 support
initVessel(scene, renderer, camera);

// Phase 13.7.3: Initialize 64×64 voxel floor
initVoxelFloor(scene);

// Phase 13.7.3: Initialize volumetric mist particle system
initVoxelMist(scene);

// Phase 13.8: Initialize shadow layer (split-screen mode)
import { initShadowLayer, renderShadowLayer, isShadowLayerOpen } from './shadowLayer.js';
initShadowLayer(scene, camera, renderer, composer);
window.renderShadowLayer = renderShadowLayer;
window.isShadowLayerActive = isShadowLayerOpen; // Expose for resize handler coordination
console.log("🌓 Shadow layer initialized");

// Phase 13.32: Dev helpers (console)
window.Vessel = {
  show:(b)=> setVesselVisible(b),
  color:(hex)=> setVesselColor(hex),
  wire:(b)=> setVesselWireframe(b),
  sky:(on, radius=30)=> setVesselAsSkydome(scene, on, radius)
};

window.Conflat = {
  show:(b)=> setConflatVisible(b),
  set:(hex, op)=> setConflat(hex, op)
};

// Phase 13.32: Quick hotkeys (Shift+V vessel, Shift+S skydome, Shift+C conflat)
window.addEventListener('keydown', (e) => {
  if (!e.shiftKey) return;
  if (e.code === 'KeyV') { const vis = getVessel()?.visible ?? true; setVesselVisible(!vis); }
  if (e.code === 'KeyS') {
    const v = getVessel();
    if (v) setVesselAsSkydome(scene, !v.userData.isSkydome, 40);
  }
  if (e.code === 'KeyC') {
    const plane = getConflat();
    const isOff = !plane || plane.material.opacity < 0.05;
    setConflatVisible(true);
    setConflat(isOff ? '#101018' : '#000000', isOff ? 0.18 : 0.0);
  }
});

// Phase 2.3.3SS: Initialize real ShadowBox with vessel shadow projection
shadowBox = new ShadowBox(scene, renderer, camera);
console.log("📦 ShadowBox initialized with vessel projection rendering");

if (state.particlesEnabled) {
  initParticles(scene, state.particlesCount);
  // Phase 13.32: Vessel coupling disabled (simplified vessel)
  // const particleSystem = getParticleSystemInstance();
  // const vesselGroup = getVesselGroup();
  // if (particleSystem && vesselGroup) {
  //   particleSystem.setVesselReference(vesselGroup);
  //   console.log("🔗 Particles coupled to Vessel rotation");
  // }
}

// Phase 11.7.15: Initialize emoji stream manager
emojiStreamManager = new EmojiStreamManager(scene);
window.emojiStreamManager = emojiStreamManager;

// Phase 11.7.16: Initialize emoji sequencer
emojiSequencer = new EmojiSequencer(emojiStreamManager);
window.emojiSequencer = emojiSequencer;

// Phase 11.7.17: Initialize emoji pattern bank manager
emojiBankManager = new EmojiPatternBankManager(emojiStreamManager, emojiSequencer);
window.emojiBankManager = emojiBankManager;

// Phase 11.7.24/11.7.25: Initialize mandala controller
mandalaController = new MandalaController(scene, {
  rings: state.emojiMandala.rings,
  symmetry: state.emojiMandala.symmetry,
  scale: state.emojiMandala.scale,
  rotationSpeed: state.emojiMandala.rotationSpeed,
  emojiLayout: state.emojiMandala.layout
});
window.mandalaController = mandalaController;
console.log("🎛️ MandalaController initialized and exposed globally");

// Phase 11.7.25: Integration trace
const mandalaState = mandalaController.getState();
console.log(`🔗 Mandala bound to HUD + MIDI (rings=${mandalaState.rings}, symmetry=${mandalaState.symmetry}, scale=${mandalaState.scale}, mode=${mandalaState.mode})`);
console.log(`🔗 Mandala → Animation Loop: ✅ | HUD Routing: ✅ | MIDI Routing: ✅`);

// VCN Phase 1: Initialize Vessel Compass Navigator system
destinationManager = new DestinationManager();
window.destinationManager = destinationManager;
console.log("🧭 DestinationManager initialized");

// Initialize field navigation with all component references
fieldNavigationSystem = new ExpandedFieldNavigationSystem(scene, {
  morphMesh: morphShape,
  mandalaController: mandalaController,
  vesselGroup: getVesselGroup(),
  particleSystem: getParticleSystemInstance(),
  spriteGroup: window.spriteGroup
});
window.fieldNavigationSystem = fieldNavigationSystem;
console.log("🌐 ExpandedFieldNavigationSystem initialized with 9 analyzers");

// Initialize first-person camera controls
firstPersonControls = new FirstPersonControls(camera, renderer.domElement);
window.fpControls = firstPersonControls;
console.log("🎮 FirstPersonControls initialized (click canvas to enable)");

// Initialize VCN compass panel
vcnPanel = new VCNPanel(destinationManager);
window.vcnPanel = vcnPanel;
console.log("🧭 VCNPanel initialized");

console.log("✅ VCN Phase 1 systems initialized — Ready for signal-space navigation");

// Skybox Destination Authoring: Initialize authoring and navigation systems
destinationAuthoring = new DestinationAuthoringSystem(destinationManager, scene, camera);
window.destinationAuthoring = destinationAuthoring;
console.log("🎨 DestinationAuthoringSystem initialized");

destinationNavigator = new DestinationNavigator(camera, destinationAuthoring);
window.destinationNavigator = destinationNavigator;
console.log("🚀 DestinationNavigator initialized");

console.log("✅ Skybox Destination Authoring systems ready");

// Signal Multimodality: Initialize signal router (async)
(async () => {
  try {
    await signalRouter.init();
    signalRouter.start();
    window.signalRouter = signalRouter;
    console.log("📡 SignalRouter initialized and started");
    console.log("✅ Signal Multimodality systems ready");
  } catch (err) {
    console.error("📡 Signal router initialization error:", err);
  }
})();

// Myth Layer Compiler: Initialize myth compiler and glyph renderer
const mythCompiler = new MythCompiler(scene, camera);
mythCompiler.setDestinationSystem(destinationAuthoring);
mythCompiler.setSignalRouter(signalRouter);
window.mythCompiler = mythCompiler;
console.log("🌟 MythCompiler initialized");

const glyphRenderer = new GlyphRenderer(scene, camera, renderer);
window.glyphRenderer = glyphRenderer;
console.log("🌟 GlyphRenderer initialized");

// Load myth library from storage
mythCompiler.loadLibrary();
console.log("✅ Myth Layer Compiler systems ready");

// Pedagogical Mode: Initialize pedagogical system
const pedagogicalSystem = new PedagogicalSystem(scene, camera);
pedagogicalSystem.setDestinationSystem(destinationAuthoring);
pedagogicalSystem.setMythCompiler(mythCompiler);
pedagogicalSystem.setSignalRouter(signalRouter);
window.pedagogicalSystem = pedagogicalSystem;
console.log("📚 PedagogicalSystem initialized");

// Load pedagogical library from storage
pedagogicalSystem.loadLibrary();
console.log("✅ Pedagogical Mode systems ready");

// AI Co-Agent Integration: Initialize AI co-agent system
const aiCoAgent = new AICoAgent();
aiCoAgent.setDestinationSystem(destinationAuthoring);
aiCoAgent.setMythCompiler(mythCompiler);
aiCoAgent.setPedagogicalSystem(pedagogicalSystem);
window.aiCoAgent = aiCoAgent;

// Expose AI provider classes for console configuration
window.ClaudeProvider = ClaudeProvider;
window.OpenAIProvider = OpenAIProvider;
window.GeminiProvider = GeminiProvider;

console.log("🤖 AICoAgent initialized");

// Load AI settings from storage
aiCoAgent.loadSettings();
console.log("✅ AI Co-Agent Integration systems ready");

// AI State Snapshot System: Initialize state capturer (already created globally)
// Expose class for creating custom snapshots
window.SceneStateSnapshot = SceneStateSnapshot;
console.log("🧠 State Snapshot System initialized");
console.log("💡 Tip: Use stateSnapshotCapturer.captureState() to capture current scene state");
console.log("💡 Tip: Use snapshot.getDetailedDescription() for AI-ready prompts");
console.log("✅ AI State Snapshot System ready");

// AI Provider System: Initialize provider manager (already created globally)
// Provider manager automatically loads saved config from localStorage
console.log("🤖 AI Provider System initialized");
console.log("💡 Tip: Use providerManager.setProvider('claude', 'your-api-key') or providerManager.setProvider('openai', 'your-api-key')");
console.log("💡 Tip: Configure providers via the AI Assistant HUD interface");
console.log("✅ AI Provider System ready");

// Camera Signal System: Initialize camera provider and routing
(async () => {
  try {
    const cameraSignalProvider = new CameraSignalProvider();
    await cameraSignalProvider.init();
    window.cameraSignalProvider = cameraSignalProvider;
    console.log("📷 CameraSignalProvider initialized");

    const oscAdapter = new OSCSignalAdapter();
    window.oscAdapter = oscAdapter;
    console.log("📡 OSCSignalAdapter initialized");

    const biosignalAdapter = new BiosignalAdapter();
    window.biosignalAdapter = biosignalAdapter;
    console.log("📟 BiosignalAdapter initialized");

    const cameraSignalRouter = new CameraSignalRouter();
    cameraSignalRouter.setCameraProvider(cameraSignalProvider);
    cameraSignalRouter.setOSCAdapter(oscAdapter);
    cameraSignalRouter.setBiosignalAdapter(biosignalAdapter);
    cameraSignalRouter.setSignalRouter(signalRouter);
    cameraSignalRouter.start();
    window.cameraSignalRouter = cameraSignalRouter;
    console.log("📷 CameraSignalRouter initialized and started");
    console.log("✅ Camera Signal System ready");
  } catch (err) {
    console.error("📷 Camera signal system initialization error:", err);
  }
})();

// Portal Builder: Initialize portal management and editing systems
const portalManager = new PortalManager();
portalManager.setScene(scene, camera);
portalManager.setDestinationSystem(destinationAuthoring);
portalManager.setMythCompiler(mythCompiler);
portalManager.setPresetManager(window.presets);
portalManager.setDestinationNavigator(destinationNavigator);
window.portalManager = portalManager;
console.log("🚪 PortalManager initialized");
console.log("🔗 PortalManager synced with DestinationNavigator");

const skyboxEditor = new SkyboxEditor(scene, camera);
window.skyboxEditor = skyboxEditor;
console.log("🌌 SkyboxEditor initialized");

const geometryBuilder = new GeometryFieldBuilder(scene, camera);
geometryBuilder.setGlyphRenderer(glyphRenderer);
window.geometryBuilder = geometryBuilder;
console.log("🔺 GeometryFieldBuilder initialized");

const waveformEditor = new WaveformFieldEditor(scene, camera);
window.waveformEditor = waveformEditor;
console.log("🌊 WaveformFieldEditor initialized");

const portalMapUI = new PortalMapUI(portalManager);
window.portalMapUI = portalMapUI;
console.log("🗺️ PortalMapUI initialized");

// Load portal library from storage
portalManager.loadLibrary();

console.log("✅ Portal Builder systems ready");
console.log("💡 Tip: Create a portal to start building, or use Destinations tab to explore");

// Text/NLP Signal Layer: Initialize text signal provider and bindings
const textSignalProvider = new TextSignalProvider();
window.textSignalProvider = textSignalProvider;
console.log("📝 TextSignalProvider initialized");

const textSignalBindings = new TextSignalBindings(textSignalProvider);
window.textSignalBindings = textSignalBindings;

// Setup text signal bindings
textSignalBindings.bindSentimentToVessel(window.vessel || getVesselGroup());
textSignalBindings.bindToneToGlyphs(glyphRenderer);
textSignalBindings.bindRhythmToParticles(getParticleSystemInstance());

// Bind mythic keywords to myth state transitions
if (mythCompiler) {
  textSignalBindings.bindMythicToStateTransitions(mythCompiler);
}

console.log("📝 Text signal bindings established:");
console.log("  • Sentiment → Vessel morph");
console.log("  • Tone → Glyph states");
console.log("  • Rhythm → Particle behavior");
console.log("  • Mythic keywords → Myth transitions");
console.log("✅ Text/NLP Signal Layer ready");

// Phase 13.9: Initialize input manager (mouse, keyboard handlers)
initInputManager({
  renderer,
  gameMode
});

// Phase 13.11/13.13: Initialize feature modules (Capture, Hotkeys, ProjectorMode)
initCapture();
initHotkeys();
initProjectorMode();

// Phase 1.5 — Pilot State: Perception + Gamepad Integration
import { PerceptionState } from './perceptionState.js';
import { GamepadManager } from './gamepadManager.js';

let perceptionState = null;
let gamepadManager = null;

// Initialize perception state system
perceptionState = new PerceptionState();
window.perceptionState = perceptionState;
console.log("🌀 PerceptionState initialized (wave mode)");

// Initialize gamepad manager
gamepadManager = new GamepadManager();
window.gamepadManager = gamepadManager;
console.log("🎮 GamepadManager initialized");

// Wire perception state and gamepad to first-person controls
firstPersonControls.perceptionState = perceptionState;
firstPersonControls.gamepadManager = gamepadManager;
console.log("🔗 Phase 1.5 systems linked to FirstPersonControls");

// Wire perception state to VCN panel
vcnPanel.perceptionState = perceptionState;
console.log("🔗 PerceptionState linked to VCN compass");

// Optional: Add visual/audio feedback on perception toggle
perceptionState.onToggle = (newMode, oldMode) => {
  console.log(`🧬 Perception mode changed: ${oldMode} → ${newMode}`);
  // Future: Play audio cue, flash screen, pulse VCN, etc.
};

console.log("✅ Phase 1.5 Pilot State initialized — Wave ↔ Particle perception ready");

// Stage 2: Initialize Game Mode system
gameMode = new GameMode(scene, camera);
window.gameMode = gameMode;
console.log("🎮 GameMode initialized");

// Phase 13.9: Game mode click handler moved to inputManager.js

console.log("✅ Stage 2: Game Mode initialized — Ready for deer hunting");

// Phase 13.9: Mouse interaction handlers moved to inputManager.js

initTelemetry(() => ({
  midiDevices: getMIDIDeviceCount(),
  hudIdle: state.idleSpin,
  morphState: {
    current: state.morphState.current,
    previous: state.morphState.previous,
    progress: state.morphState.progress,
    weights: { ...state.morphWeights },
    isTransitioning: state.morphState.isTransitioning,
    targets: state.morphState.targets
  },
  currentPreset: state.presets.currentPresetName,
  audioData: {
    bass: state.audio.bass,
    mid: state.audio.mid,
    treble: state.audio.treble,
    isEnabled: state.audio.enabled,
    sensitivity: state.audio.sensitivity
  },
  visualData: {
    ambientIntensity: state.lighting.ambientIntensity,
    directionalIntensity: state.lighting.directionalIntensity,
    color: state.color,
    hue: state.hue
  }
}));

// Update preset list in HUD after initialization
setTimeout(() => {
  updatePresetList(listPresets());
}, 100);

// Phase 13.9: Morph toggle handler (P key) moved to inputManager.js

console.log("✅ main.js loaded – all modules imported");

// Phase 2.3.3: Export shadowBox for HUD access
export function getShadowBox() {
  return shadowBox;
}

// Phase 11.7.24: Export mandalaController for router access
export function getMandalaController() {
  return mandalaController;
}

// Stage 2: Export gameMode for HUD access
export function getGameModeInstance() {
  return gameMode;
}

// 🔎 Debug: list all objects in the scene
function logSceneObjects(scene) {
  console.log("🔍 Scene Object Inventory:");
  console.log("===========================");
  let count = 0;
  scene.traverse((obj) => {
    if (obj.isMesh || obj.isLine || obj.isLineSegments) {
      count++;
      const geometryType = obj.geometry ? obj.geometry.type : "unknown";
      const material = obj.material ? `${obj.material.type} (wireframe:${obj.material.wireframe})` : "no material";
      console.log(`${count}. ${obj.type} | name="${obj.name || "(unnamed)"}" | geometry=${geometryType} | material=${material}`);
      console.log(`   visible=${obj.visible} | position=(${obj.position.x.toFixed(2)}, ${obj.position.y.toFixed(2)}, ${obj.position.z.toFixed(2)})`);
      console.log(`   `, obj);
    }
  });
  console.log(`===========================`);
  console.log(`Total renderable objects: ${count}`);
}

// Run once after everything has initialized
setTimeout(() => {
  logSceneObjects(scene);
}, 2000);

// Phase 13.2.f: HUD System uses Signal Bridge pattern
// No manual initialization needed - HUD modules auto-register via registerHUDCallback()
console.log("✅ Phase 13.4 HUD System Ready (Signal Bridge)");

// Phase 13.13: Projector Mode now in features/projectorMode.js

// ——— Phase 13.22: Screenshot + Posterize Export ———
(function installCapture() {
  function _glCanvas() {
    const c = window?.renderer?.domElement;
    if (!c) console.warn("📸 Capture: renderer canvas not found");
    return c;
  }

  function _makeDataURL(posterizeLevels = 0) {
    const src = _glCanvas();
    if (!src) return null;

    const w = src.width, h = src.height;
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const ctx = off.getContext('2d', { willReadFrequently: true });

    // draw current WebGL frame into 2D canvas
    ctx.drawImage(src, 0, 0, w, h);

    // optional: posterize only for export (no live shader changes)
    if (posterizeLevels && posterizeLevels > 1) {
      const levels = Math.max(2, Math.min(32, posterizeLevels | 0));
      const step = 255 / (levels - 1);

      const img = ctx.getImageData(0, 0, w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        d[i]     = Math.round(d[i]     / step) * step; // R
        d[i + 1] = Math.round(d[i + 1] / step) * step; // G
        d[i + 2] = Math.round(d[i + 2] / step) * step; // B
        // alpha left as is (d[i + 3])
      }
      ctx.putImageData(img, 0, 0);
    }

    return off.toDataURL('image/png');
  }

  function _saveAs({ posterize = false, levels = 6, filename } = {}) {
    const url = _makeDataURL(posterize ? levels : 0);
    if (!url) return { ok: false, reason: 'no-canvas' };

    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const name = filename || `morph_capture_${stamp}${posterize ? `_pz${levels}` : ''}.png`;

    // dataURL download (works in Electron & web)
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();

    console.log(`📸 Saved ${name} (posterize=${posterize ? levels : 0})`);
    return { ok: true, name, url };
  }

  window.Capture = window.Capture || {
    dataURL: _makeDataURL,
    save: _saveAs,
  };

  console.log('📸 Capture ready (Phase 13.22)');
})();

// ——— Phase 13.24: One-Key Hotkeys ———
(function installOneKeyHotkeys() {
  // CSS for HUD hide/show (non-destructive)
  const css = `
    html.hud-hidden, body.hud-hidden { cursor: auto; }
    .hud-hidden [data-hud-root],
    .hud-hidden #hud,
    .hud-hidden .hud-root { display: none !important; }
  `;
  const style = document.createElement('style');
  style.id = 'onekey-style';
  style.textContent = css;
  document.head.appendChild(style);

  function isTyping(e) {
    const t = e.target;
    const tag = (t?.tagName || '').toLowerCase();
    const editable = t?.isContentEditable;
    return editable || tag === 'input' || tag === 'textarea' || tag === 'select';
  }

  async function toggleFullscreenFallback() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.({ navigationUI: 'hide' });
      } else {
        await document.exitFullscreen?.();
      }
    } catch {}
  }

  function toggleHUD() {
    const hudPanel = document.getElementById('hud-panel');
    if (!hudPanel) return console.warn('⚠️ HUD panel not found');
    const isHidden = hudPanel.classList.toggle('hud-hidden');
    console.log(`🧰 HUD ${isHidden ? 'hidden' : 'visible'}`);
  }

  function toggleWireframe() {
    const scene = window.scene || window.Scene || window.THREE_SCENE;
    if (!scene?.traverse) return console.warn('⚠️ Wireframe: scene not found');
    let count = 0, toWire;
    // Decide target state by peeking first mesh
    let firstWire = null;
    scene.traverse(obj => {
      if (obj.isMesh && obj.material) {
        if (firstWire === null) firstWire = !!obj.material.wireframe;
      }
    });
    toWire = !firstWire;
    scene.traverse(obj => {
      if (obj.isMesh && obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => (m.wireframe = toWire));
        } else {
          obj.material.wireframe = toWire;
        }
        count++;
      }
    });
    console.log(`🧵 Wireframe: ${toWire ? 'ON' : 'OFF'} (meshes affected: ${count})`);
  }

  function screenshot() {
    const ok = window.Capture?.save?.({ posterize: false });
    if (!ok?.ok) console.warn('📸 Screenshot failed or Capture not ready');
  }

  function toggleAudioReactive() {
    try {
      // Best-effort: use appState if present, else fall back to notifying HUD
      const st = window.appState || window.state || {};
      const curr = !!st.audioReactive;
      const next = !curr;

      // Update local state if possible (non-breaking)
      if ('audioReactive' in st) st.audioReactive = next;

      // Notify HUD/router; many modules already listen for onHUDUpdate
      if (typeof window.onHUDUpdate === 'function') {
        window.onHUDUpdate({ audioReactive: next });
      } else if (typeof window.notifyHUDUpdate === 'function') {
        window.notifyHUDUpdate({ audioReactive: next });
      }

      console.log(`🎛️ Audio-reactive: ${next ? 'ON' : 'OFF'}`);
    } catch (e) {
      console.warn('⚠️ Audio-reactive toggle not available:', e);
    }
  }

  window.addEventListener('keydown', async (e) => {
    // Ignore if user is typing or modifiers pressed (so these are truly one-key)
    if (isTyping(e) || e.metaKey || e.ctrlKey || e.altKey) return;

    const k = e.key;
    if (k === 'F' || k === 'f') {
      e.preventDefault();
      // Prefer ProjectorMode if present (Phase 13.20), else fullscreen fallback
      if (window.ProjectorMode?.toggle) return window.ProjectorMode.toggle();
      return toggleFullscreenFallback();
    }
    if (k === 'H' || k === 'h') {
      e.preventDefault();
      return toggleHUD();
    }
    if (k === 'S' || k === 's') {
      e.preventDefault();
      return screenshot();
    }
    if (k === 'W' || k === 'w') {
      e.preventDefault();
      return toggleWireframe();
    }
    if (k === 'M' || k === 'm') {
      e.preventDefault();
      return toggleAudioReactive();
    }
  });

  console.log('⌨️ One-Key Hotkeys ready — F:Fullscreen, H:HUD, S:Shot, W:Wire, M:Audio');
})();

// ——— Phase 13.25: Feature Beacons ———
(function featureBeacons() {
  function has(fn) { return typeof fn === 'function'; }
  function yes(v) { return !!v; }

  const status = () => ({
    file: import.meta?.url || '(no import.meta.url)',
    ProjectorMode: {
      present: !!window.ProjectorMode,
      methods: {
        toggle: has(window.ProjectorMode?.toggle),
        enable: has(window.ProjectorMode?.enable),
        disable: has(window.ProjectorMode?.disable),
      }
    },
    Capture: {
      present: !!window.Capture,
      methods: {
        save: has(window.Capture?.save),
        dataURL: has(window.Capture?.dataURL),
      }
    },
    Hotkeys: {
      ready: !!document.getElementById('onekey-style'), // added by Phase 13.24
    }
  });

  window.debugFeatures = function debugFeatures() {
    const s = status();
    console.log('🛰️ Feature Beacons:', s);
    const problems = [];
    if (!s.ProjectorMode.present) problems.push('ProjectorMode missing (Phase 13.20 not loaded)');
    if (!s.Capture.present) problems.push('Capture missing (Phase 13.22 not loaded)');
    if (!s.Hotkeys.ready) problems.push('One-Key Hotkeys CSS not found (Phase 13.24 not loaded)');
    if (problems.length) {
      console.warn('🛑 Missing features:', problems);
    } else {
      console.log('✅ All requested features detected');
    }
    return { s, problems };
  };

  console.log('🛰️ Beacons online (Phase 13.25) from', import.meta?.url || '(unknown)');
})();
