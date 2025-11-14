// src/sprites.js
import * as THREE from 'three';
import { getEffectiveAudio, state } from './state.js';
import { getCurrentGeometryColors } from './archetypeColors.js'; // Phase 14.0: Palette colors

// ——— Phase 13.28: Sprites audio reactivity (additive) ———
import { state as appState } from "./state.js";

// Lightweight config (can later be surfaced in HUD)
const __SPRITES_AR_CFG__ = (() => {
  const c = (window.spritesConfig ||= {});
  // sensible defaults; can be changed live in DevTools: window.spritesConfig.gain = 1.4
  c.gain        ??= 1.35;   // global gain multiplier
  c.bassScale   ??= 0.90;   // scale pop on bass
  c.midSpin     ??= 0.65;   // rotation speed on mids
  c.trebleJit   ??= 0.80;   // jitter strength on treble
  c.levelAlpha  ??= 0.70;   // opacity pulsing with overall level
  c.smoothing   ??= 0.12;   // EMA smoothing (0..1)
  c.minLevel    ??= 0.002;  // ignore near-zero floor
  return c;
})();

const __SPRITES_AR_STATE__ = { // smoothed bands
  bass: 0, mid: 0, treble: 0, level: 0,
  t: 0
};

function __ema(prev, next, a){ return prev + (next - prev) * a; }

function __getAudioBands(dt=0.016){
  const a = appState?.audio || { bass:0, mid:0, treble:0, level:0 };
  const k = Math.max(0.0001, Math.min(1, __SPRITES_AR_CFG__.smoothing));
  __SPRITES_AR_STATE__.bass   = __ema(__SPRITES_AR_STATE__.bass,   a.bass,   k);
  __SPRITES_AR_STATE__.mid    = __ema(__SPRITES_AR_STATE__.mid,    a.mid,    k);
  __SPRITES_AR_STATE__.treble = __ema(__SPRITES_AR_STATE__.treble, a.treble, k);
  __SPRITES_AR_STATE__.level  = __ema(__SPRITES_AR_STATE__.level,  a.level,  k);
  __SPRITES_AR_STATE__.t += dt;
  return __SPRITES_AR_STATE__;
}

// One-time lazy init per sprite (no constructor edits needed)
function __stampSpriteBase(sprite){
  if (sprite.__sprArInit) return;
  sprite.__sprArInit = true;
  sprite.__baseScale   = sprite.scale?.x || 1;
  sprite.__baseOpacity = (sprite.material?.opacity ?? 1);
  // Deterministic phase for jitter
  const id = sprite.id || Math.random()*1e6;
  sprite.__phase = (id * 0.318309886) % (Math.PI*2);
}

function __applyAudioToSprites(spritesArray, dt=0.016){
  const S = __getAudioBands(dt);
  const C = __SPRITES_AR_CFG__;
  if (S.level < C.minLevel) return; // tiny CPU save when silent

  const g  = C.gain;
  const sb = C.bassScale * g;
  const sm = C.midSpin   * g;
  const st = C.trebleJit * g;
  const sl = C.levelAlpha* g;

  for (let i=0; i<spritesArray.length; i++){
    const s = spritesArray[i];
    if (!s) continue;
    __stampSpriteBase(s);

    // — scale pop on bass
    const scaleMul = 1 + (S.bass * sb);
    s.scale.setScalar(s.__baseScale * scaleMul);

    // — subtle spin on mids (Z only; feels like twinkle)
    if (s.rotation) s.rotation.z += (S.mid * sm * dt * 6.0);

    // — micro jitter on treble (phase offset per sprite)
    const ph = s.__phase + S.t * 30; // fast, feels "sparkly"
    const j  = (S.treble * st) * 0.02; // world-space jitter magnitude
    if (s.position){
      s.position.x += Math.sin(ph) * j;
      s.position.y += Math.cos(ph*1.3) * j;
    }

    // — alpha pulse on overall level
    if (s.material){
      const base = s.__baseOpacity;
      const pulse = 0.6 + (S.level * sl); // 0.6..1.6 (clamped below)
      s.material.transparent = true;
      s.material.opacity = Math.max(0.0, Math.min(1.0, base * pulse));
      // if your sprite material needs update flag:
      if ('needsUpdate' in s.material) s.material.needsUpdate = true;
    }
  }
}

let spriteGroup;
let spriteScene;
// Phase 11.4.3: One-time audio gate logging flag
let spritesAudioGateLogged = false;

export function initSprites(scene) {
  spriteScene = scene;
  spriteGroup = new THREE.Group();

  // Phase 14.0: Get initial color from palette
  const colors = getCurrentGeometryColors();
  const spriteMaterial = new THREE.SpriteMaterial({
    color: colors?.baseColor || 0x888888,
    transparent: true,
    opacity: 0.4,
  });

  // Generate sprites based on state.sprites.count
  const count = state.sprites.count || 200;
  for (let i = 0; i < count; i++) {
    const sprite = new THREE.Sprite(spriteMaterial.clone());
    sprite.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    sprite.scale.set(0.1, 0.1, 0.1);
    spriteGroup.add(sprite);
  }

  spriteGroup.visible = state.sprites.enabled;
  scene.add(spriteGroup);
  console.log(`✨ Sprites initialized (count: ${count}, enabled: ${state.sprites.enabled})`);

  // Phase 13.10: Mark sprites ready for audio reactivity
  markSpritesReady({ pool: spriteGroup.children, group: spriteGroup });
}

export function updateSprites() {
  if (!spriteGroup) return;

  // Update visibility based on state
  spriteGroup.visible = state.sprites.enabled;

  if (!state.sprites.enabled) return;

  // Phase 11.4.3: Use stable audio gate
  const { bass, mid, treble, level } = getEffectiveAudio();
  const audioLevel = (bass + mid + treble) / 3;

  // Phase 11.4.3B: Freeze check - log once when clamped
  if (!state.audioReactive && !spritesAudioGateLogged) {
    window.__HUD_AUDIO_LOGS__ && console.log("🎵 Sprites update clamped to base (audio OFF)");
    spritesAudioGateLogged = true;
  } else if (state.audioReactive && spritesAudioGateLogged) {
    // Reset flag when audio reactive is turned back on
    spritesAudioGateLogged = false;
  }

  spriteGroup.children.forEach((sprite, i) => {
    const angle = Date.now() * 0.001 + i;

    // Phase 11.5.1: Use morphBaseWeights (stable) + audio deltas when ON, base only when OFF
    let sphereWeight = 0;
    let cubeWeight = 0;
    let pyramidWeight = 0;

    if (state.audioReactive && state.morphAudioWeights) {
      // Audio ON: use base + audio deltas (matches geometry.js additive system)
      sphereWeight = (state.morphBaseWeights?.[0] || 0) + (state.morphAudioWeights[0] || 0);
      cubeWeight = (state.morphBaseWeights?.[1] || 0) + (state.morphAudioWeights[1] || 0);
      pyramidWeight = (state.morphBaseWeights?.[2] || 0) + (state.morphAudioWeights[2] || 0);
    } else {
      // Audio OFF: use base only (no audio modulation)
      sphereWeight = state.morphBaseWeights?.[0] || 0;
      cubeWeight = state.morphBaseWeights?.[1] || 0;
      pyramidWeight = state.morphBaseWeights?.[2] || 0;
    }

    sprite.position.x = Math.sin(angle) * (2 + sphereWeight * 3);
    sprite.position.y = Math.cos(angle) * (2 + cubeWeight * 3);
    sprite.position.z = Math.sin(angle * 0.5) * (2 + pyramidWeight * 3);

    // Phase 14.0: Use palette colors (alternate between base and audio for variety)
    const colors = getCurrentGeometryColors();
    const useAudioColor = i % 2 === 0; // Alternate sprites between two colors
    sprite.material.color.set(useAudioColor ? colors.audioColor : colors.baseColor);
    // Phase 11.4.3B: Base opacity when audio off, modulated when on
    sprite.material.opacity = state.audioReactive ? (0.2 + audioLevel * 0.8) : 0.2;
  });

  // Phase 13.28: Apply audio reactivity v2 (bass pop, mid spin, treble jitter, level alpha)
  if (state.audioReactive) {
    __applyAudioToSprites(spriteGroup.children, 0.016);
  }
}

export function destroySprites() {
  if (!spriteGroup || !spriteScene) return;

  // Remove from scene
  spriteScene.remove(spriteGroup);

  // Dispose of all sprite materials and clear group
  spriteGroup.children.forEach(sprite => {
    if (sprite.material) {
      sprite.material.dispose();
    }
  });

  spriteGroup.clear();
  spriteGroup = null;
  console.log("✨ Sprites destroyed");
}

export function reinitSprites(scene) {
  destroySprites();
  initSprites(scene);
}

// 🧩 Phase 13.10b — Sprite Reactivity Boost (attack/decay, AGC, beat pops)

let _SPRITES_READY = false;
let _spritesCtx = null;

// Config is adjustable at runtime: window.SpritesReactConfig = { ... }
const CFG = (window.SpritesReactConfig = {
  // smoothing
  attack: 0.35,       // quicker rise
  release: 0.12,      // slower fall
  // auto-gain (normalizes mic/test tone energy)
  agcDecay: 0.985,    // how fast peak falls
  agcFloor: 0.15,     // minimum peak to avoid overblow
  // mapping strength
  sizeMulBase: 0.85,
  sizeMulAmp:  1.10,  // ↑ (was 0.60) — bigger range
  opacityBase: 0.45,
  opacityAmp:  0.55,  // ↑ stronger brightness swings
  spawnBase:   0.30,
  spawnAmp:    1.70,  // ↑ more density
  hueAmp:      140.0, // ↑ color swing from treble vs bass
  // beat pops
  beatThresh:  0.48,  // normalized bass threshold
  beatHoldMs:  140,   // min time between pops
  beatBoostSize: 0.35,
  beatBoostSpawn: 1.2,
  beatFlash:  0.35,   // extra opacity on pop
});

let _env = { level: 0, bass: 0, mid: 0, treble: 0 };
let _peak = 0.2; // AGC rolling peak
let _lastBeatT = 0;

// smart EMA: separate attack/release
function _follow(prev, next) {
  const a = next > prev ? CFG.attack : CFG.release;
  return prev + a * (next - prev);
}

export function markSpritesReady(ctx) {
  _SPRITES_READY = true;
  _spritesCtx = ctx || _spritesCtx || {};
  console.log("✨ Sprites audio-reactive bridge armed (13.10b)");
}

/**
 * Apply audio bands to sprites (call every audio frame).
 * bands: { bass, mid, treble, level } in [0..1]
 */
export function applyAudioBandsToSprites(bands = {}) {
  if (!_SPRITES_READY || !_spritesCtx) return;

  // --- Auto Gain Control (normalize incoming energy) ---
  // rolling peak with decay; prevents flat look on quiet inputs
  const rawLevel = Math.max(0, Math.min(1, bands.level ?? 0));
  _peak = Math.max(_peak * CFG.agcDecay, rawLevel, CFG.agcFloor);
  const norm = (v) => (v ?? 0) / (_peak || 1e-6);

  // attack/decay smoothing on normalized bands
  const nb = norm(bands.bass);
  const nm = norm(bands.mid);
  const nt = norm(bands.treble);
  const nl = norm(bands.level);

  _env.bass   = _follow(_env.bass,   Math.min(nb, 1));
  _env.mid    = _follow(_env.mid,    Math.min(nm, 1));
  _env.treble = _follow(_env.treble, Math.min(nt, 1));
  _env.level  = _follow(_env.level,  Math.min(nl, 1));

  // --- Beat detection on bass (normalized) ---
  let beatKick = 0;
  const now = performance.now();
  if (_env.bass > CFG.beatThresh && (now - _lastBeatT) > CFG.beatHoldMs) {
    beatKick = 1;
    _lastBeatT = now;
    // console.log("💥 Sprite beat pop");
  }

  // --- Map to sprite parameters (stronger & flashier) ---
  const sizeMul   = CFG.sizeMulBase + CFG.sizeMulAmp * _env.level + beatKick * CFG.beatBoostSize;
  const hueShift  = (_env.treble - _env.bass) * CFG.hueAmp;
  const spawnRate = CFG.spawnBase + CFG.spawnAmp * _env.mid + beatKick * CFG.beatBoostSpawn;
  const opacity   = CFG.opacityBase + CFG.opacityAmp * _env.level + beatKick * CFG.beatFlash;

  try {
    // If you have a manager with setters:
    _spritesCtx.setSizeMultiplier?.(sizeMul);
    _spritesCtx.setHueShift?.(hueShift);
    _spritesCtx.setSpawnRate?.(spawnRate);
    _spritesCtx.setOpacity?.(Math.min(1, opacity));

    // Fallback: iterate pool if present
    if (_spritesCtx.pool && Array.isArray(_spritesCtx.pool)) {
      for (const s of _spritesCtx.pool) {
        if (!s) continue;
        if (s.setSize)  s.setSize((s.baseSize || 1) * sizeMul);
        if (s.setHue)   s.setHue(((s.baseHue || 0) + hueShift) % 360);
        if (s.setAlpha) s.setAlpha(Math.max(0, Math.min(1, opacity)));
      }
    }
  } catch (e) {
    // Never break render loop on sprite errors
    // console.warn("Sprites reactive apply failed:", e);
  }
}