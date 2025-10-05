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

// ---------- Screenshot / Posterize (safe) ----------
(function(){
  function getCanvas() {
    // prefer Three's canvas
    const c = document.querySelector("canvas");
    if (!c) throw new Error("No canvas found");
    return c;
  }
  function png() {
    try {
      const c = getCanvas();
      const url = c.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `capture_${Date.now()}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      console.log("📸 Screenshot saved (PNG)");
    } catch(e) { console.error("Capture.png error", e); }
  }
  function jpeg(quality = 0.92) {
    try {
      const c = getCanvas();
      const url = c.toDataURL("image/jpeg", quality);
      const a = document.createElement("a");
      a.href = url;
      a.download = `capture_${Date.now()}.jpg`;
      document.body.appendChild(a); a.click(); a.remove();
      console.log("📸 Screenshot saved (JPEG)");
    } catch(e) { console.error("Capture.jpeg error", e); }
  }
  window.Capture = { png, jpeg };
})();

// ---------- One-Key Hotkeys (guarded) ----------
(function(){
  function handler(e){
    // Ignore when typing in inputs/textareas
    const tag = (e.target && e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.isComposing) return;

    if (e.key === "p" || e.key === "P") {
      // P → toggle Projector HUD (first press also ensures projector ON)
      if (!document.fullscreenElement) window.ProjectorMode?.on();
      else window.ProjectorMode?.toggleHUD();
    }
    if (e.key === "f" || e.key === "F") {
      // F → full projector on/off
      if (!document.fullscreenElement) window.ProjectorMode?.on();
      else window.ProjectorMode?.off();
    }
    if (e.key === "s" || e.key === "S") {
      // S → screenshot PNG
      window.Capture?.png();
    }
  }
  window.Hotkeys = { install(){
    window.removeEventListener("keydown", handler, true);
    window.addEventListener("keydown", handler, true);
    console.log("⌨️ Hotkeys installed (P=presentation HUD, F=fullscreen toggle, S=screenshot)");
  }};
  // auto-install once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ()=>window.Hotkeys.install(), {once:true});
  } else {
    window.Hotkeys.install();
  }
})();

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

import * as THREE from 'three';
import { initHUD, updatePresetList } from './hud.js';
import { initMIDI, getMIDIDeviceCount } from './midi.js';
import { getHUDIdleSpin, getVisualData, getMorphState, scene, renderer, camera, initMorphShape } from './geometry.js'; // Phase 12.1: added initMorphShape
import { initShadows } from './shadows.js';
import { initSprites } from './sprites.js';
import { initParticles, getParticleSystemInstance, EmojiParticles, EmojiStreamManager, EmojiSequencer, EmojiPatternBankManager } from './particles.js'; // Phase 11.7.1, 11.7.15, 11.7.16, 11.7.17
import { MandalaController } from './mandalaController.js'; // Phase 11.7.24
import { initVessel, updateVessel, getVesselGroup } from './vessel.js'; // Phase 13.1.0: Restored vessel system
import { initVisual, updateVisual } from './visual.js'; // Phase 13.1.0: Restored visual system
import { initTelemetry } from './telemetry.js';
import { initPresets, createDefaultPresets, listPresets, getCurrentPresetName } from './presets.js';
import { initAudio, getAudioValues, AudioEngine } from './audio.js';
import { state } from './state.js';
import { SHADOW_LAYER } from './constants.js'; // Phase 2.3.3

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
import './presetRouter.js';

// Phase 11.2.3: Initialize unified control binding system
import { initDefaultBindings } from './controlBindings.js';
initDefaultBindings();

console.log("🔄 Build timestamp:", new Date().toISOString());

// Phase 2.3.3R: Shadow Box failsafe fallback (disabled rendering, app stability restored)
class ShadowBox {
  constructor(scene, renderer) {
    console.log("⚠️ ShadowBox initialized in FAILSAFE mode (Phase 2.3.3R) - rendering disabled");
    this.renderer = renderer;
    this.plane = null; // nothing added to scene
  }

  render(scene) {
    // Do nothing — avoid crashes
    // Uncomment for debugging: console.log("📦 ShadowBox render tick (failsafe)");
  }

  setThreshold(value) {
    console.log(`📦 ShadowBox threshold set: ${value.toFixed(2)} (failsafe mode)`);
  }

  setGain(value) {
    console.log(`📦 ShadowBox gain set: ${value.toFixed(1)} (failsafe mode)`);
  }

  setColors(bgColor, fgColor) {
    console.log(`📦 ShadowBox colors set: bg=${bgColor}, fg=${fgColor} (failsafe mode)`);
  }

  setPalette(name) {
    console.log(`📦 ShadowBox palette set: ${name} (failsafe mode)`);
  }

  setShadowGain(g) {
    console.log(`📦 ShadowBox gain (legacy) set: ${g.toFixed(1)} (failsafe mode)`);
  }
}

initHUD();

initMIDI(() => {
  console.log("🎹 MIDI ready");
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

initShadows(scene);

initSprites(scene);

// Phase 12.1: Initialize morph shape (cube-sphere conflation)
const morphShape = initMorphShape(scene);
window.morphShape = morphShape; // expose for debugging
console.log("🔺 Morph Shape initialized and exposed globally");

// Phase 13.1.0: Initialize visual/background system
initVisual(scene);

// Phase 13.1.0: Initialize vessel system with Conflat 6 support
initVessel(scene, renderer, camera);

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

// Phase 2.3.3SS: Overwrite stub with real ShadowBox instance (currently failsafe/disabled)
shadowBox = new ShadowBox(scene, renderer);
console.log("📦 ShadowBox stub replaced with failsafe instance");

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

// Phase 11.7.18: Mouse interaction for emoji swirl forces
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousedown', () => { isMouseDown = true; });
window.addEventListener('mouseup', () => { isMouseDown = false; });
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Apply swirl force to all active emoji streams
  if (isMouseDown && state.emojiPhysics?.mouseInteraction) {
    if (window.emojiStreamManager) {
      window.emojiStreamManager.streams.forEach((stream, emoji) => {
        if (stream.enabled) {
          stream.applySwirlForce(mouseX, mouseY);
        }
      });
    }
    // Also apply to single emoji particles if active
    if (window.emojiParticles) {
      window.emojiParticles.applySwirlForce(mouseX, mouseY);
    }
  }
});

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

window.addEventListener('keydown', (e) => {
  if (e.key === 'p' || e.key === 'P') {
    // Toggle to next morph target
    const targets = state.morphState.targets;
    const currentIndex = targets.indexOf(state.morphState.current);
    const nextIndex = (currentIndex + 1) % targets.length;
    const newTarget = targets[nextIndex];

    // Update state
    state.morphState.previous = state.morphState.current;
    state.morphState.current = newTarget;

    // Reset all weights and set new target to 1.0
    targets.forEach(target => {
      state.morphWeights[target] = 0;
    });
    state.morphWeights[newTarget] = 1.0;

    console.log(`🔄 Toggled to morph target: ${newTarget}`);
  }
});

console.log("✅ main.js loaded – all modules imported");

// Phase 2.3.3: Export shadowBox for HUD access
export function getShadowBox() {
  return shadowBox;
}

// Phase 11.7.24: Export mandalaController for router access
export function getMandalaController() {
  return mandalaController;
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

// ——— Phase 13.20 Projector Mode ———
(function installProjectorMode() {
  // 1) CSS: hide HUD + cursor when projector mode is active
  const css = `
    html.projector-mode, body.projector-mode { cursor: none !important; }
    /* Hide common HUD roots (we don't assume exact id/class) */
    .projector-mode [data-hud-root],
    .projector-mode #hud,
    .projector-mode .hud-root { display: none !important; }
    /* Optional: keep canvas clean edge-to-edge */
    .projector-mode body { background: #000 !important; }
  `;
  const style = document.createElement('style');
  style.id = 'projector-mode-style';
  style.textContent = css;
  document.head.appendChild(style);

  async function goFullscreen() {
    try {
      const el = document.documentElement;
      if (!document.fullscreenElement && el.requestFullscreen) {
        await el.requestFullscreen({ navigationUI: 'hide' }).catch(()=>{});
      }
    } catch {}
  }
  async function exitFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen().catch(()=>{});
    } catch {}
  }

  // Optional render scale bump (safe, best-effort)
  function bumpRenderScale(enable) {
    try {
      const r = window.renderer;
      if (r?.setPixelRatio) {
        if (enable) {
          const target = Math.min(2, (window.devicePixelRatio || 1) * 1.15);
          r.setPixelRatio(target);
        } else {
          r.setPixelRatio(window.devicePixelRatio || 1);
        }
        r.setSize(window.innerWidth, window.innerHeight, false);
      }
    } catch {}
  }

  window.ProjectorMode = window.ProjectorMode || {
    enabled: false,
    async enable() {
      if (this.enabled) return;
      document.documentElement.classList.add('projector-mode');
      document.body.classList.add('projector-mode');
      await goFullscreen();
      bumpRenderScale(true);
      this.enabled = true;
      console.log('🖥️ Projector Mode: ON');
      updateButton();
    },
    async disable() {
      if (!this.enabled) return;
      document.documentElement.classList.remove('projector-mode');
      document.body.classList.remove('projector-mode');
      bumpRenderScale(false);
      await exitFullscreen();
      this.enabled = false;
      console.log('🖥️ Projector Mode: OFF');
      updateButton();
    },
    async toggle() {
      return this.enabled ? this.disable() : this.enable();
    }
  };

  // Phase 13.30: Projector Mode button (bottom-right)
  function createProjectorButton() {
    const btn = document.createElement('button');
    btn.id = '__projector_btn__';
    btn.textContent = '🖥️ Projector Mode';
    btn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 16px;
      background: rgba(0,0,0,0.8);
      color: #fff;
      border: 1px solid #555;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-family: system-ui, -apple-system, sans-serif;
      z-index: 9999;
      transition: background 0.2s;
    `;
    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'rgba(40,40,40,0.9)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'rgba(0,0,0,0.8)';
    });
    btn.addEventListener('click', () => {
      window.ProjectorMode.toggle();
    });
    document.body.appendChild(btn);
    return btn;
  }

  function updateButton() {
    const btn = document.getElementById('__projector_btn__');
    if (!btn) return;
    btn.textContent = window.ProjectorMode.enabled ? '✖️ Exit Projector' : '🖥️ Projector Mode';
  }

  // Create button after DOM loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createProjectorButton);
  } else {
    createProjectorButton();
  }

  // Hotkeys: Shift+P toggles; Esc exits
  window.addEventListener('keydown', async (e) => {
    // Esc exits PM even if focus is on inputs
    if (e.key === 'Escape' && window.ProjectorMode.enabled) {
      e.preventDefault();
      return window.ProjectorMode.disable();
    }
    // Shift+P toggle, avoid stealing common shortcuts otherwise
    if ((e.key === 'P' || e.key === 'p') && e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      return window.ProjectorMode.toggle();
    }
  });

  // Safety: if fullscreen lost (e.g., user hits Esc), turn mode off
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && window.ProjectorMode.enabled) {
      window.ProjectorMode.disable();
    }
  });
})();

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
    const on = document.body.classList.toggle('hud-hidden');
    document.documentElement.classList.toggle('hud-hidden', on);
    console.log(`🧰 HUD ${on ? 'hidden' : 'visible'}`);
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
