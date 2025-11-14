import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { state, blendColors, getEffectiveAudio } from './state.js'; // Phase 11.4.3: Import stable audio gate
import { updateShadows } from './shadows.js';
import { updateSprites } from './sprites.js';
import { updateParticles } from './particles.js';
import { updateAudio } from './audio.js'; // Audio system
import { updateVessel, renderShadowProjection } from './vessel.js';
import { getShadowBox } from './main.js'; // Phase 2.3.3
import { createPostProcessing } from './postprocessing.js'; // Dual Trail System
import { updateInterpolation, updateChain } from './presetRouter.js'; // Phase 11.2.8, 11.3.0
import { updateVisual, updateCellularAutomata } from './visual.js'; // Phase 11.6.0
import { updateVoxelFloor } from './voxelFloor.js'; // Phase 13.7.3: 64×64 voxel floor
import { initVoxelMist, updateVoxelMist } from './voxelMist.js'; // Phase 13.7.3: Volumetric mist
import { mapFeaturesToVisuals } from './mappingLayer.js'; // MMPA Phase 2: Feature-to-Visual translation
import { initPeriaktos } from './periaktos.js'; // Phase 13.1.0: Periaktos mirror geometry
import { updateHumanoid } from './humanoid.js'; // Humanoid dancer animation
import { initArchetypeMorph, updateArchetypeMorph } from './archetypeMorph.js'; // Chestahedron ↔ Bell morph
import { getCurrentGeometryColors, updateColorState } from './archetypeColors.js'; // MMPA archetype color integration
import { getPiPhiMetrics } from './hudPiPhi.js'; // π/φ synchronicity metrics
import { recordPerformanceMetrics } from './colorPalettes.js'; // ML performance tracking
import { getCurrentArchetype, getConfidence } from './archetypeRecognizer.js'; // Archetype detection
import { updateSpatialGrammar, getGeometryMorphFromGrammar, isSpatialGrammarEnabled } from './musicalSpatialGrammar.js'; // Spatial music theory

console.log("🔺 geometry.js loaded");

// Phase 11.4.3: One-time audio gate logging flag
let geometryAudioGateLogged = false;

// Phase 11.5.2: Debug throttle
let __geomFrame = 0;
const __GEOM_LOG_EVERY = 300; // ~5s at ~60fps

// Scene lighting references
let ambientLight = null;
let directionalLight = null;

// Phase 13.5.1: Morph targets for platonic solid polymorphing (mergeddeep.html style)
let platonicMorphTargets = [];

export function getHUDIdleSpin() {
  return state.idleSpin;
}

const canvas = document.querySelector('#app');
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// 4K HDR-quality renderer setup
export const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,           // Enable MSAA antialiasing
  alpha: false,              // No alpha channel (better performance)
  powerPreference: 'high-performance',
  precision: 'highp'         // High precision shaders
});

// Enable HDR-like tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// High-quality output color space (Three.js r152+)
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Retina/4K display support - use device pixel ratio (capped at 2 for performance)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Expose renderer globally for recording
window.renderer = renderer;

// Expose spatial grammar controls globally for console access
import { enableSpatialGrammar, disableSpatialGrammar, getSpatialGrammarDebugInfo } from './musicalSpatialGrammar.js';
import { globalProfiler } from './performanceProfiler.js';
window.enableSpatialGrammar = enableSpatialGrammar;
window.disableSpatialGrammar = disableSpatialGrammar;
window.getSpatialGrammarDebugInfo = getSpatialGrammarDebugInfo;
console.log("🎼 Spatial Grammar controls: window.enableSpatialGrammar() / window.disableSpatialGrammar()");

// Dual Trail System: Initialize postprocessing composer with AfterimagePass
const { composer, afterimagePass } = createPostProcessing(renderer, scene, camera);

// Phase 13.8: Export composer for shadow layer coordination
export { composer };

// Create consistent vertex correspondence system for morph targets
function createMorphGeometry() {
  // Use icosahedron as base for consistent vertex distribution
  const detail = 4; // Balance between quality and performance
  const baseGeometry = new THREE.IcosahedronGeometry(1, detail).toNonIndexed();
  const basePositions = baseGeometry.attributes.position.array;

  // Helper functions to map unit vectors to target shapes
  function toSphere(v) {
    return v.clone().normalize().multiplyScalar(0.8);
  }

  function toCube(v) {
    const x = v.x, y = v.y, z = v.z;
    const maxComponent = Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) || 1e-6;
    return new THREE.Vector3(x / maxComponent, y / maxComponent, z / maxComponent).multiplyScalar(0.8);
  }

  function toPyramid(v) {
    // Square pyramid with apex at (0, 1, 0)
    const absY = Math.abs(v.y);
    const height = 0.75;

    if (absY > 0.7) {
      // Near the apex
      const signY = Math.sign(v.y) || 1;
      return new THREE.Vector3(0, signY * height, 0);
    } else {
      // Project to pyramid faces
      const baseScale = (1 - absY) * 0.8;
      const px = THREE.MathUtils.clamp(v.x, -1, 1) * baseScale;
      const pz = THREE.MathUtils.clamp(v.z, -1, 1) * baseScale;
      const py = v.y * height;
      return new THREE.Vector3(px, py, pz);
    }
  }

  // Re-bake function for true parametric torus generation
  const TAU = Math.PI * 2;

  function wrapTau(a) {
    return ((a % TAU) + TAU) % TAU;
  }

  function buildTorusTarget(basePositions) {
    const out = new Float32Array(basePositions.length);
    const N = basePositions.length / 3;

    // Approximate a grid from base vertex count
    const segments = Math.floor(Math.sqrt(N));

    const R = 1.0;   // major radius
    const r = 0.3;   // tube thickness

    let idx = 0;
    for (let i = 0; i <= segments; i++) {  // <= ensures wrap
      const u = wrapTau((i / segments) * TAU);
      for (let j = 0; j <= segments; j++) {  // <= ensures wrap
        const vMinor = wrapTau((j / segments) * TAU);

        const cx = (R + r * Math.cos(vMinor)) * Math.cos(u);
        const cy = r * Math.sin(vMinor);
        const cz = (R + r * Math.cos(vMinor)) * Math.sin(u);

        out[idx++] = cx;
        out[idx++] = cy;
        out[idx++] = cz;

        if (idx >= out.length) break;
      }
      if (idx >= out.length) break;
    }
    return out;
  }

  function toTorus(v) {
    // True parametric torus mapping - eliminates missing-edge artifacts

    // Map spherical coordinates to torus parameters
    const u = (Math.atan2(v.z, v.x) + TAU) % TAU;

    // Minor tube angle: ensure full 0..2π coverage
    const vMinor = (Math.atan2(v.y, Math.hypot(v.x, v.z)) + Math.PI / 2) * (TAU / Math.PI);

    // Radii — tuned for clarity
    const R = 1.0;   // major radius (distance from center to tube center)
    const r = 0.3;   // minor radius (tube thickness)

    const cx = (R + r * Math.cos(vMinor)) * Math.cos(u);
    const cy = r * Math.sin(vMinor);
    const cz = (R + r * Math.cos(vMinor)) * Math.sin(u);

    return new THREE.Vector3(cx, cy, cz);
  }

  // Build morph target position arrays
  function buildTargetPositions(mapper) {
    const positions = new Float32Array(basePositions.length);
    for (let i = 0; i < basePositions.length; i += 3) {
      const v = new THREE.Vector3(basePositions[i], basePositions[i + 1], basePositions[i + 2]).normalize();
      const mapped = mapper(v);
      positions[i] = mapped.x;
      positions[i + 1] = mapped.y;
      positions[i + 2] = mapped.z;
    }
    return positions;
  }

  // Create morph targets
  const spherePositions = buildTargetPositions(toSphere);
  const cubePositions = buildTargetPositions(toCube);
  const pyramidPositions = buildTargetPositions(toPyramid);
  const torusPositions = buildTorusTarget(basePositions);

  // Set up geometry with morph targets
  const geometry = baseGeometry.clone();
  geometry.morphAttributes.position = [
    new THREE.Float32BufferAttribute(spherePositions, 3),   // Index 0: sphere
    new THREE.Float32BufferAttribute(cubePositions, 3),     // Index 1: cube
    new THREE.Float32BufferAttribute(pyramidPositions, 3),  // Index 2: pyramid
    new THREE.Float32BufferAttribute(torusPositions, 3)     // Index 3: torus
  ];

  return geometry;
}

// Phase 12.0: Per-face texture materials (6 faces: front/back/left/right/top/bottom)
// Phase 14.0: Dynamic palette-based colors (updated from archetype colors each frame)
const faceMaterials = [
  new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7, metalness: 0.3 }), // Right
  new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7, metalness: 0.3 }), // Left
  new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7, metalness: 0.3 }), // Top
  new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7, metalness: 0.3 }), // Bottom
  new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7, metalness: 0.3 }), // Front
  new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7, metalness: 0.3 })  // Back
];

// Wireframe material for wireframe mode
const material = new THREE.MeshStandardMaterial({
  color: state.color,
  wireframe: true,
  roughness: 0.7,
  metalness: 0.3
});

// Create single mesh with morph targets
const morphGeometry = createMorphGeometry();
const morphMesh = new THREE.Mesh(morphGeometry, material);
morphMesh.visible = true;
morphMesh.position.set(0, 0, 0);

// Initialize morph target influences (start with cube)
morphMesh.morphTargetInfluences = [0, 1, 0, 0]; // [sphere, cube, pyramid, torus]

// Phase 12.1: Explicit initializer for morph shape
export function initMorphShape(targetScene) {
  targetScene.add(morphMesh);
  console.log("🔺 Morph Shape added to scene (cube-sphere conflation)");

  // Phase 13.5.1: Initialize platonic solid morph targets
  setPlatonicSolid(state.geometry?.platonicSolid || 'cube');

  // Phase 13.1.0: Initialize Periaktos mirror geometry
  initPeriaktos();
  console.log("🌀 Periaktos initialized");

  // MMPA Archetype Morph: Initialize Chestahedron ↔ Bell transformation
  initArchetypeMorph(targetScene);
  console.log("🔄 Archetype Morph System initialized");

  return morphMesh;
}

// Auto-initialize for backward compatibility
scene.add(morphMesh);

// Export face materials for texture upload
export { faceMaterials };

// Keep reference for backward compatibility
const morphObjects = {
  mesh: morphMesh // Single mesh reference
};


// Setup lighting
setupLighting();

// MMPA Archetype Morph: Initialize Chestahedron ↔ Bell transformation
initArchetypeMorph(scene);
console.log("🔄 Archetype Morph System initialized (auto-init)");

// Control visibility based on theory mode
// Theory ON: show archetype morph (chestahedron/bell)
// Theory OFF: show old morph mesh (cube/sphere/pyramid/torus)
let lastMorphTheoryState = null;
let manualVisibilityControl = false; // Flag to disable automatic visibility control
function updateMorphVisibility() {
    // Skip automatic control if manual control is active
    if (manualVisibilityControl) {
        return;
    }

    const theoryEnabled = window.theoryRenderer?.isEnabled?.() ?? true;
    morphMesh.visible = !theoryEnabled; // Show old morph when theory OFF

    // Debug logging when state changes
    if (lastMorphTheoryState !== theoryEnabled) {
        console.log(`🔺 Morph visibility update - Theory: ${theoryEnabled ? 'ON' : 'OFF'}, morphMesh.visible: ${!theoryEnabled}`);
        lastMorphTheoryState = theoryEnabled;
    }
}

// Initial state: hide old morph, show archetype morph
morphMesh.visible = false;
console.log("🔺 Old morph mesh hidden - archetype morph system active");

// Export the visibility controller
export { updateMorphVisibility };

// Position camera for centered view
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// Mouse controls (OrbitControls) - DISABLED for first-person gamepad control
export const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enabled = false;
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.05;
orbitControls.screenSpacePanning = false;
orbitControls.minDistance = 1;
orbitControls.maxDistance = 100;
orbitControls.maxPolarAngle = Math.PI; // Allow full rotation

// Toggle state for orbit controls
let orbitControlsEnabled = false;

// Functions to enable/disable mouse controls
export function enableOrbitControls() {
  orbitControls.enabled = true;
  orbitControlsEnabled = true;
  console.log('🖱️ Mouse controls ENABLED');
}

export function disableOrbitControls() {
  orbitControls.enabled = false;
  orbitControlsEnabled = false;
  console.log('🖱️ Mouse controls DISABLED');
}

export function toggleOrbitControls() {
  if (orbitControlsEnabled) {
    disableOrbitControls();
  } else {
    enableOrbitControls();
  }
  return orbitControlsEnabled;
}

export function isOrbitControlsEnabled() {
  return orbitControlsEnabled;
}

console.log('🖱️ Mouse controls initialized (Left-drag: Rotate, Right-drag: Pan, Scroll: Zoom)');

// Handle window resize to maintain centering
window.addEventListener('resize', () => {
  // Phase 13.8: Don't resize if shadow layer is managing the split-screen
  if (typeof window.isShadowLayerActive === 'function' && window.isShadowLayerActive()) {
    // Shadow layer handles its own resizing
    return;
  }

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update pixel ratio for retina/4K displays
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Clamp helper
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function updateMorphTargets(state) {
  // Phase 11.2: Use new array-based additive morphing system
  // Read from morphBaseWeights (persistent user values) and morphAudioWeights (from audio.js)
  let baseWeights = state.morphBaseWeights || [
    state.morphWeights.sphere || 0,
    state.morphWeights.cube || 0,
    state.morphWeights.pyramid || 0,
    state.morphWeights.torus || 0
  ];

  // === SPATIAL GRAMMAR OVERRIDE ===
  // If spatial grammar is active, use its harmonic-driven morph weights
  if (isSpatialGrammarEnabled()) {
    const grammarWeights = getGeometryMorphFromGrammar();
    if (grammarWeights) {
      baseWeights = grammarWeights; // Override with harmonic structure
    }
  }

  // Phase 11.5.1: Deep trace for audio bleed detection
  const prevInfluences = morphMesh.morphTargetInfluences.slice();

  // Phase 11.4.3: Get audio data through stable gate
  const audioData = getEffectiveAudio();

  // Phase 11.4.3B: Freeze check - log once when clamped to base
  if (!state.audioReactive && !geometryAudioGateLogged) {
    console.log("🎵 Geometry morph clamped to base (audio OFF)");
    geometryAudioGateLogged = true;
  } else if (state.audioReactive && geometryAudioGateLogged) {
    // Reset flag when audio reactive is turned back on
    geometryAudioGateLogged = false;
  }

  // Phase 11.2: Calculate audio deltas for each morph target (stored in state for reuse)
  const audioWeights = [
    (audioData.bass || 0) * 0.1,
    (audioData.mid || 0) * 0.1,
    (audioData.treble || 0) * 0.1,
    ((audioData.bass || 0) + (audioData.mid || 0) + (audioData.treble || 0)) / 3 * 0.1
  ];

  // Update state.morphAudioWeights for other systems to read
  state.morphAudioWeights = audioWeights;

  // Phase 11.2: Additive morphing - base + (audio * gain)
  // Phase 11.4.3C: Gated morph weight application
  const gain = state.audio.sensitivity || 1.0;

  // Phase 11.5.2: Throttled trace log when audio OFF (before applying clamp)
  if (!state.audioReactive && (__geomFrame++ % __GEOM_LOG_EVERY) === 0) {
    console.log("🛑 Geometry clamp check", {
      baseWeights: baseWeights.slice(0, 4),
      audioWeights: audioWeights.slice(0, 4),
      influences_before: Array.from(morphMesh.morphTargetInfluences).slice(0, 4)
    });
  }

  for (let i = 0; i < morphMesh.morphTargetInfluences.length; i++) {
    const baseWeight = baseWeights[i] || 0;
    if (state.audioReactive) {
      // Additive: final = base + (audio * gain)
      morphMesh.morphTargetInfluences[i] = clamp(baseWeight + (audioWeights[i] * gain), 0, 1);

      // Phase 11.4.3C: Reset one-time log when audio turns back on
      if (geometryAudioGateLogged) {
        geometryAudioGateLogged = false;
      }
    } else {
      // Audio off: use base only
      morphMesh.morphTargetInfluences[i] = baseWeight;
    }
  }

  // Phase 11.5.2: Throttled bleed detection (audio OFF)
  if (!state.audioReactive) {
    const changed = prevInfluences.some((prev, i) =>
      Math.abs(prev - morphMesh.morphTargetInfluences[i]) > 0.001
    );

    if (changed && (__geomFrame % __GEOM_LOG_EVERY) === 0) {
      console.log("🔴 Geometry bleed detected (audio OFF)", {
        prevInfluences: prevInfluences.slice(0, 4).map(v => v.toFixed(3)),
        newInfluences: Array.from(morphMesh.morphTargetInfluences).slice(0, 4).map(v => v.toFixed(3)),
        baseWeights: baseWeights.slice(0, 4).map(v => v.toFixed(3)),
        audioData: audioData,
        interpolationActive: state.interpolation?.active,
        chainActive: state.morphChain?.active
      });
    }
  }

  // Phase 11.2: Debug logging with base + audio breakdown
  if (Math.random() < 0.02) {
    console.log("🎛️ Base:", baseWeights.map(v => v.toFixed(2)),
                "🎵 Audio:", audioWeights.map(v => v.toFixed(2)),
                "➡️ Final:", Array.from(morphMesh.morphTargetInfluences).map(v => v.toFixed(2)));
  }
}

// Function to update geometry from state
function updateGeometryFromState() {
  // Update morph targets with persistent weights and optional audio overlay
  if (morphMesh && state.morphWeights) {
    updateMorphTargets(state);
  }

  // MMPA Archetype Colors: Update π/φ metrics for color blending
  let finalColor = 0x888888; // Default gray

  try {
    const piPhiMetrics = getPiPhiMetrics();
    const archetype = getCurrentArchetype();
    const confidence = getConfidence();

    updateColorState({
      pi: piPhiMetrics.pi,
      phi: piPhiMetrics.phi,
      synchronicity: piPhiMetrics.synchronicity
    });

    // Record performance metrics for ML training (sampled 1% to reduce overhead)
    if (Math.random() < 0.01) {
      recordPerformanceMetrics({
        archetype,
        confidence,
        pi: piPhiMetrics.pi,
        phi: piPhiMetrics.phi,
        synchronicity: piPhiMetrics.synchronicity,
        isSyncEvent: piPhiMetrics.synchronicity > 0.6
      });
    }

    // Get archetype-based colors from palette system
    const archetypeColors = getCurrentGeometryColors();
    const audioData = getEffectiveAudio();
    const audioLevel = (audioData.bass + audioData.mid + audioData.treble) / 3;

    // Use archetype colors instead of layerConfig
    finalColor = archetypeColors.baseColor;

    if (state.audioReactive) {
      finalColor = blendColors(
        archetypeColors.baseColor,
        archetypeColors.audioColor,
        state.colorLayers.geometry.audioIntensity || 0.5,
        audioLevel
      );

      // Debug logging (2% sample rate)
      if (Math.random() < 0.02) {
        console.log(`🎨 Geometry: archetype base=${archetypeColors.baseColor.toString(16)} audio=${archetypeColors.audioColor.toString(16)} final=${finalColor}`);
      }
    }

    // Phase 14.0: Update face materials and lighting with palette colors
    updateFaceMaterialColors(archetypeColors);
    updateLightingColors(archetypeColors);

  } catch (error) {
    // Silently fall back to default color if color system fails
    // Don't spam console - just use gray
  }

  // Phase 13.7: Apply texture to morph if toggle ON (use morphTexture or fallback to texture)
  if (state.useTextureOnMorph && (state.morphTexture || state.texture)) {
    material.map = state.morphTexture || state.texture;
    material.color.set(0xffffff); // ensures texture visible
    material.needsUpdate = true;
  } else {
    material.map = null;
    material.color.set(finalColor);
    material.needsUpdate = true;
  }

  // Update lighting from state
  if (ambientLight) {
    ambientLight.intensity = state.lighting.ambientIntensity;
  }
  if (directionalLight) {
    directionalLight.intensity = state.lighting.directionalIntensity;
    updateDirectionalLightPosition();
  }
}

function setupLighting() {
  // Add ambient light
  ambientLight = new THREE.AmbientLight(0xffffff, state.lighting.ambientIntensity);
  scene.add(ambientLight);

  // Add directional light
  directionalLight = new THREE.DirectionalLight(0xffffff, state.lighting.directionalIntensity);
  updateDirectionalLightPosition();
  scene.add(directionalLight);

  console.log("🎨 Lighting system initialized");
}

function updateDirectionalLightPosition() {
  if (!directionalLight) return;

  // Convert angles to radians and position the light
  const radX = (state.lighting.directionalAngleX * Math.PI) / 180;
  const radY = (state.lighting.directionalAngleY * Math.PI) / 180;

  directionalLight.position.set(
    Math.sin(radY) * Math.cos(radX) * 10,
    Math.sin(radX) * 10,
    Math.cos(radY) * Math.cos(radX) * 10
  );
}

// Phase 14.0: Update face materials with palette colors
function updateFaceMaterialColors(archetypeColors) {
  if (!archetypeColors) return;

  // Use baseColor for primary faces, audioColor for secondary faces
  // This creates visual depth and shows both colors simultaneously
  const baseColor = archetypeColors.baseColor;
  const audioColor = archetypeColors.audioColor;
  const syncPulse = archetypeColors.syncPulse;

  // Blend between base and audio based on sync pulse for dynamic effect
  const pulseBlend = Math.min(1, syncPulse * 0.7); // Cap at 70% blend

  faceMaterials[0].color.set(baseColor);       // Right: base
  faceMaterials[1].color.set(audioColor);      // Left: audio (complementary)
  faceMaterials[2].color.set(blendColors(baseColor, audioColor, 0.3, 1.0)); // Top: blend
  faceMaterials[3].color.set(blendColors(baseColor, audioColor, 0.7, 1.0)); // Bottom: blend
  faceMaterials[4].color.set(baseColor);       // Front: base
  faceMaterials[5].color.set(audioColor);      // Back: audio (complementary)

  // Add pulse glow effect during high synchronicity
  if (syncPulse > 0.5) {
    const emissiveIntensity = (syncPulse - 0.5) * 0.4; // 0-0.2 range
    faceMaterials.forEach(mat => {
      mat.emissive.set(baseColor);
      mat.emissiveIntensity = emissiveIntensity;
    });
  } else {
    // No emissive glow when not synced
    faceMaterials.forEach(mat => {
      mat.emissiveIntensity = 0;
    });
  }
}

// Phase 14.0: Update lighting colors based on palette
function updateLightingColors(archetypeColors) {
  if (!archetypeColors || !ambientLight || !directionalLight) return;

  // Tint ambient light with base archetype color (subtle, 20% influence)
  const baseColor = new THREE.Color(archetypeColors.baseColor);
  const white = new THREE.Color(0xffffff);
  ambientLight.color.lerpColors(white, baseColor, 0.2);

  // Tint directional light with audio color (even more subtle, 15% influence)
  const audioColor = new THREE.Color(archetypeColors.audioColor);
  directionalLight.color.lerpColors(white, audioColor, 0.15);
}

// Phase 12.0: Set texture on specific face (0=right, 1=left, 2=top, 3=bottom, 4=front, 5=back)
export function setFaceTexture(faceIndex, texture) {
  if (faceIndex < 0 || faceIndex >= 6) {
    console.error(`❌ Invalid face index: ${faceIndex}. Must be 0-5.`);
    return;
  }

  faceMaterials[faceIndex].map = texture;
  faceMaterials[faceIndex].color.set(0xffffff); // Ensure texture is visible
  faceMaterials[faceIndex].needsUpdate = true;
  console.log(`🖼️ Texture set on face ${faceIndex}`);
}

// Phase 12.0: Clear texture from specific face (restore colored face)
export function clearFaceTexture(faceIndex) {
  if (faceIndex < 0 || faceIndex >= 6) return;

  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0x00ffff, 0xff00ff];
  faceMaterials[faceIndex].map = null;
  faceMaterials[faceIndex].color.set(colors[faceIndex]);
  faceMaterials[faceIndex].needsUpdate = true;
  console.log(`🎨 Face ${faceIndex} restored to color`);
}

// Phase 12.0: Toggle wireframe vs face-textured mode (extended API)
export function setWireframeMode(enabled) {
  state.geometry.wireframe = !!enabled;
  if (enabled) {
    morphMesh.material = material; // Single wireframe material
  } else {
    morphMesh.material = faceMaterials; // Array of face materials
  }
  console.log(`🔲 Wireframe mode: ${enabled ? 'ON' : 'OFF'}`);
}

// Phase 12.0: Skybox mode - allows camera to go inside/outside morph shape (extended API)
export function setSkyboxMode(enabled) {
  state.geometry.skyboxMode = !!enabled;
  faceMaterials.forEach(mat => {
    mat.side = enabled ? THREE.DoubleSide : THREE.FrontSide;
  });
  material.side = enabled ? THREE.DoubleSide : THREE.FrontSide;
  console.log(`📦 Skybox mode (double-sided): ${enabled ? 'ON' : 'OFF'}`);
}

// Phase 12.0: Center camera and morph shape (reset position/rotation + fit to view)
export function centerCameraAndMorph(controls) {
  // Reset morph transform
  morphMesh.position.set(0, 0, 0);
  morphMesh.rotation.set(0, 0, 0);

  // Compute bounding box size to frame
  const box = new THREE.Box3().setFromObject(morphMesh);
  const size = box.getSize(new THREE.Vector3());
  const bounding = Math.max(size.x, size.y, size.z) || 10;

  // Camera fit logic (perspective) - closer zoom for inside cube view
  const fov = (camera.fov || 75) * Math.PI / 180;
  const dist = (bounding * 0.5) / Math.tan(fov / 2);

  // Aim camera - zoom in closer (0.6x instead of 1.4x) to view from inside cube
  camera.position.set(0, 0, dist * 0.6);
  camera.lookAt(0, 0, 0);
  if (controls && typeof controls.update === 'function') controls.update();

  // Update renderer aspect
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  console.log("🎯 Camera centered - inside cube view");
}

// Phase 13.2.0: Reset camera to initialization view
export function resetCameraView(controls) {
  // Reset morph transform
  morphMesh.position.set(0, 0, 0);
  morphMesh.rotation.set(0, 0, 0);

  // Reset camera to initial position
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);
  if (controls && typeof controls.update === 'function') controls.update();

  // Update renderer aspect
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  console.log("🎯 Camera reset to initialization view");
}

// Phase 12.0: Set morph amount (0=cube, 1=sphere conflation)
export function setMorphAmount(t /* 0..1 */) {
  if (morphMesh && morphMesh.morphTargetInfluences) {
    morphMesh.morphTargetInfluences[0] = THREE.MathUtils.clamp(t, 0, 1);
  }
}

// Phase 13.5.1: Set Platonic Solid (rebuild geometry with new solid)
export function setPlatonicSolid(solidType) {
  state.geometry.platonicSolid = solidType;

  // Create new geometry based on solid type
  let newGeometry;
  const subdivisions = 2; // Detail level

  switch (solidType) {
    case 'tetrahedron':
      newGeometry = new THREE.TetrahedronGeometry(1, subdivisions);
      break;
    case 'octahedron':
      newGeometry = new THREE.OctahedronGeometry(1, subdivisions);
      break;
    case 'dodecahedron':
      newGeometry = new THREE.DodecahedronGeometry(1, subdivisions);
      break;
    case 'icosahedron':
      newGeometry = new THREE.IcosahedronGeometry(1, subdivisions);
      break;
    case 'cube':
    default:
      newGeometry = new THREE.BoxGeometry(2, 2, 2, 8, 8, 8);
      break;
  }

  // Dispose old geometry
  if (morphMesh && morphMesh.geometry) {
    morphMesh.geometry.dispose();
  }

  // Apply new geometry
  if (morphMesh) {
    morphMesh.geometry = newGeometry.toNonIndexed();

    // Phase 13.5.1: Initialize morph targets (mergeddeep.html style)
    platonicMorphTargets = [];
    const pos = morphMesh.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      platonicMorphTargets.push({
        original: new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)),
        current: new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i))
      });
    }

    console.log(`✨ Platonic Solid changed to: ${solidType} (${pos.count} vertices)`);
  }
}

// Phase 13.5.1: Set Render Mode (solid, wireframe, or both)
export function setRenderMode(mode) {
  state.geometry.renderMode = mode;

  if (!morphMesh) return;

  switch (mode) {
    case 'wireframe':
      // Show only wireframe
      if (Array.isArray(morphMesh.material)) {
        morphMesh.material.forEach(mat => {
          mat.wireframe = true;
          mat.visible = true;
        });
      } else {
        morphMesh.material.wireframe = true;
        morphMesh.material.visible = true;
      }
      console.log('🔲 Render mode: Wireframe');
      break;

    case 'both':
      // Show both solid and wireframe (via material settings)
      if (Array.isArray(morphMesh.material)) {
        morphMesh.material.forEach(mat => {
          mat.wireframe = false;
          mat.wireframeLinewidth = 2;
          mat.visible = true;
        });
      } else {
        morphMesh.material.wireframe = false;
        morphMesh.material.wireframeLinewidth = 2;
        morphMesh.material.visible = true;
      }
      // Note: THREE.js doesn't easily support both at once, so this sets solid with thick edges
      console.log('🔲 Render mode: Both (solid with edges)');
      break;

    case 'solid':
    default:
      // Show only solid
      if (Array.isArray(morphMesh.material)) {
        morphMesh.material.forEach(mat => {
          mat.wireframe = false;
          mat.visible = true;
        });
      } else {
        morphMesh.material.wireframe = false;
        morphMesh.material.visible = true;
      }
      console.log('🔲 Render mode: Solid');
      break;
  }
}

// Phase 13.5.1/13.5.2: Update platonic solid morphing (mergeddeep.html style)
// Supports both MIDI and audio input based on state.geometry.morphInput
export function updatePlatonicMorph(activeNotes, deltaTime, morphAmount = 1.0) {
  if (!morphMesh || platonicMorphTargets.length === 0) {
    // Debug: Log why we're not morphing
    if (Math.random() < 0.01) {
      console.log(`🔍 Morph skip: morphMesh=${!!morphMesh}, targets=${platonicMorphTargets.length}`);
    }
    return;
  }

  const positions = morphMesh.geometry.attributes.position;
  const morphInput = state.geometry?.morphInput || 'audio';

  // Debug logging (1% of frames)
  if (Math.random() < 0.01) {
    console.log(`🎨 Morph input: ${morphInput}, activeNotes: ${Object.keys(activeNotes).length}, audio: ${state.audio?.level?.toFixed(2)}`);
  }

  for (let i = 0; i < platonicMorphTargets.length; i++) {
    const v = platonicMorphTargets[i];
    let totalOffset = 0;

    if (morphInput === 'midi') {
      // MIDI-based morphing (original mergeddeep.html style)
      for (const noteId in activeNotes) {
        const note = activeNotes[noteId];
        const octave = Math.floor(note.note / 12) - 1;
        const spatialFrequency = 1.0 + octave * 0.5;
        const noteFrequency = note.note * 0.1;
        const offset = Math.sin(noteFrequency + v.original.y * spatialFrequency) * note.velocity * morphAmount;
        totalOffset += offset;
      }
    } else if (morphInput === 'audio') {
      // Audio-based morphing (using audio level and frequencies)
      const audioLevel = state.audio?.level || 0;
      const bass = state.audio?.bass || 0;
      const mid = state.audio?.mid || 0;
      const treble = state.audio?.treble || 0;

      // Create frequency-based spatial modulation similar to MIDI approach
      const time = performance.now() * 0.001;
      const bassOffset = Math.sin(time * 0.5 + v.original.y * 2.0) * bass * morphAmount;
      const midOffset = Math.sin(time * 1.0 + v.original.x * 2.0) * mid * morphAmount;
      const trebleOffset = Math.sin(time * 2.0 + v.original.z * 2.0) * treble * morphAmount;

      totalOffset = (bassOffset + midOffset + trebleOffset) * audioLevel;
    }

    // Calculate target position
    const targetPosition = v.original.clone().multiplyScalar(1 + totalOffset);

    // Smoothly lerp to target
    v.current.lerp(targetPosition, deltaTime * 10.0);

    // Update geometry positions
    positions.setXYZ(i, v.current.x, v.current.y, v.current.z);
  }

  positions.needsUpdate = true;
  morphMesh.geometry.computeVertexNormals();
}

// Export functions for telemetry and other modules
export function getVisualData() {
  return {
    ambientIntensity: state.lighting.ambientIntensity,
    directionalIntensity: state.lighting.directionalIntensity,
    color: state.color,
    hue: state.hue
  };
}

export function getMorphState() {
  return {
    current: state.morphState.current,
    previous: state.morphState.previous,
    progress: state.morphState.progress,
    weights: { ...state.morphWeights },
    isTransitioning: state.morphState.isTransitioning,
    targets: state.morphState.targets
  };
}

export { morphMesh };

// Helper function to control morph visibility from HUD
export function setMorphVisibility(visible) {
  manualVisibilityControl = true; // Enable manual control, disable automatic
  morphMesh.visible = visible;
  console.log(`🔺 Morph shape visibility set to: ${visible ? 'ON' : 'OFF'} (manual control enabled)`);
}

// Phase 11.5.1: Performance monitoring for long-session lag detection
let frameCount = 0;
let lastFpsLog = performance.now();

// Phase 13.5.1: Clock for platonic solid morphing deltaTime
const morphClock = new THREE.Clock();

// VCN Phase 1: Clock for first-person controls
const fpClock = new THREE.Clock();

// Phase 13.12: Error boundary tracking for animation loop
let consecutiveAnimationErrors = 0;
let lastAnimationErrorTime = 0;
const MAX_ANIMATION_ERRORS = 10; // Warn after 10 consecutive errors
const ERROR_THROTTLE_MS = 1000; // Log errors max once per second

// Main animation loop
function animate() {
  requestAnimationFrame(animate);

  try {
    globalProfiler.startFrame();
    // Phase 13.5.1: Get deltaTime for morphing
    const deltaTime = morphClock.getDelta();

  // VCN Phase 1: Get deltaTime for camera controls
  const fpDelta = fpClock.getDelta();

  // === Spatial Grammar Update ===
  // Update musical spatial grammar (if enabled, arranges geometry by harmony)
      globalProfiler.mark('spatial-grammar');
updateSpatialGrammar();

  // Mouse Controls: Update OrbitControls for smooth damping

  // Phase 1.5: Update gamepad state every frame
  if (window.gamepadManager) {
        globalProfiler.mark('gamepad');
window.gamepadManager.update();
  }
  if (orbitControls.enabled) {
        globalProfiler.mark('orbit-controls');
orbitControls.update();
  }

  // Phase 11.5.1: Log FPS every 5 seconds to detect degradation
  frameCount++;
  const now = performance.now();
  if (now - lastFpsLog > 5000) {
    const fps = (frameCount / (now - lastFpsLog)) * 1000;
    const memUsed = performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(1) : 'N/A';
    // console.log(`📊 FPS);
    frameCount = 0;
    lastFpsLog = now;
  }

  // Phase 11.2.8: Update interpolation (modifies base state)
      globalProfiler.mark('interpolation');
updateInterpolation();

  // Phase 11.3.0: Update morph chain (layers on top of interpolation)
      globalProfiler.mark('morph-chain');
updateChain();

  // MMPA Phase 2: Translate features to visual parameters
      globalProfiler.mark('mmpa-mapping');
const mmpaVisuals = mapFeaturesToVisuals(state.mmpaFeatures);

  // Debug: Track MMPA and particle state (log every 5 seconds)
  if (!window._lastParticleDebugLog) window._lastParticleDebugLog = 0;
  if (now - window._lastParticleDebugLog > 5000) {
    // console.log(`🔍 Geometry);
    window._lastParticleDebugLog = now;
  }

  // Apply MMPA visuals when enabled
      globalProfiler.mark('mmpa-apply');
if (mmpaVisuals && ambientLight) {
    // Apply Identity → Color mapping to ambient light
    const [r, g, b] = mmpaVisuals.coreColor;
    ambientLight.color.setRGB(r, g, b);

    // Apply Potential → Randomness to rotation if enabled
    if (state.mmpaFeatures.enabled) {
      // Subtle rotation influence from entropy
      const entropyInfluence = mmpaVisuals.particleRandomness * 0.01;
      morphMesh.rotation.z += entropyInfluence * (Math.random() - 0.5);
    }
  }

  // Calculate rotation speeds from state (MMPA Phase 3: apply animation speed)
  const mmpaSpeed = mmpaVisuals?.animationSpeed || 1.0;
  const rotX = ((state.idleSpin ? 0.01 : 0) + state.rotationX) * mmpaSpeed;
  const rotY = ((state.idleSpin ? 0.01 : 0) + state.rotationY) * mmpaSpeed;
  const scale = state.scale;

  // Apply transformations to single morph mesh
      globalProfiler.mark('geometry-transform');
morphMesh.rotation.x += rotX;
  morphMesh.rotation.y += rotY;
  morphMesh.scale.set(scale, scale, scale);

  // Update audio if reactive
      globalProfiler.mark('audio-update');
if (state.audioReactive) updateAudio();

  // Update geometry from current state
      globalProfiler.mark('geometry-state');
updateGeometryFromState();

  // Update visibility based on theory mode toggle
  updateMorphVisibility();

  // Phase 13.5.1: Update platonic solid morphing (mergeddeep.html style)
      globalProfiler.mark('platonic-morph');
updatePlatonicMorph(state.geometry.activeNotes, deltaTime, 1.0);

  // Update shadows
      globalProfiler.mark('shadows');
updateShadows(state.audioReactive);

  // Update particles (MMPA Phase 2: pass visual parameters)
      globalProfiler.mark('particles');
if (state.particlesEnabled) {
    updateParticles(state.audioReactive, performance.now() * 0.001, mmpaVisuals);
  }

  // Update sprites
      globalProfiler.mark('sprites');
updateSprites();

  // Phase 11.6.0: Update background visual (MMPA Phase 2: pass visual parameters)
      globalProfiler.mark('visual-background');
updateVisual(camera, mmpaVisuals);

  // Update Cellular Automata ping-pong rendering
      globalProfiler.mark('cellular-automata');
updateCellularAutomata(renderer);

  // Phase 13.7.3: Update 64×64 voxel floor
      globalProfiler.mark('voxel-floor');
updateVoxelFloor(performance.now() * 0.001);

  // Phase 13.7.3: Update shader-based volumetric mist with FBM noise
      globalProfiler.mark('voxel-mist');
updateVoxelMist(performance.now() * 0.001, camera);

  // Phase 11.7.3: Update emoji particles (always update if present, safe audio fallback)
      globalProfiler.mark('emoji-particles');
if (window.emojiParticles) {
    const audioLevel = state?.audio?.level ?? 0;
    window.emojiParticles.update(audioLevel);
  }

  // Phase 11.7.15: Update emoji stream manager (multi-stream support)
      globalProfiler.mark('emoji-streams');
if (window.emojiStreamManager) {
    const audioLevel = state?.audio?.level ?? 0;
    window.emojiStreamManager.update(audioLevel);
  }

  // Phase 11.7.16: Update emoji sequencer (beat-based choreography)
      globalProfiler.mark('emoji-sequencer');
if (window.emojiSequencer) {
    window.emojiSequencer.update();
  }

  // Phase 11.7.24/11.7.25/11.7.30: Update mandala controller (first-class scene citizen)
  // Phase 11.7.30: Pass audio level for ring expansion, symmetry pulse, emoji size reactivity
      globalProfiler.mark('mandala');
if (window.mandalaController) {
    const audioLevel = state?.audio?.level ?? 0;

    // Phase 11.7.30: Log mandala audio reactivity state on toggle (one-time)
    if (state.mandala?.audioReactive && !window.__mandalaAudioLoggedOn) {
      console.log("🔊 Mandala audioReactive=ON");
      window.__mandalaAudioLoggedOn = true;
      window.__mandalaAudioLoggedOff = false;
    } else if (!state.mandala?.audioReactive && !window.__mandalaAudioLoggedOff) {
      console.log("🔇 Mandala audioReactive=OFF");
      window.__mandalaAudioLoggedOff = true;
      window.__mandalaAudioLoggedOn = false;
    }

    window.mandalaController.update(audioLevel);
  }

  // Update vessel (uses getEffectiveAudio() internally)
      globalProfiler.mark('vessel');
updateVessel(camera);

  // Update humanoid dancer at morph shape position
      globalProfiler.mark('humanoid');
updateHumanoid(morphMesh.position);

  // MMPA Archetype Morph: Update Chestahedron ↔ Bell transformation
      globalProfiler.mark('archetype-morph');
updateArchetypeMorph(deltaTime);

  // Phase 2.2.0: Render shadow projection for Conflat 6
      globalProfiler.mark('shadow-projection');
renderShadowProjection();

  // VCN Phase 1: Update navigation systems
      globalProfiler.mark('navigation');
if (window.fpControls) {
    window.fpControls.update(fpDelta);
  }

  if (window.fieldNavigationSystem && window.destinationManager) {
    window.fieldNavigationSystem.update(performance.now(), window.destinationManager, camera);
  }

  if (window.vcnPanel && window.vcnPanel.isOpen) {
    window.vcnPanel.update(camera);
  }

  // Phase 1.5: Update perception state transitions
      globalProfiler.mark('perception-state');
if (window.perceptionState) {
    window.perceptionState.update(fpDelta);
  }

  // Stage 2: Update game mode
      globalProfiler.mark('game-mode');
if (window.gameMode) {
    window.gameMode.update(fpDelta);

    // Update score display in HUD
    const scoreDiv = document.getElementById('game-mode-score');
    if (scoreDiv && window.gameMode.enabled) {
      scoreDiv.textContent = `Score: ${window.gameMode.score}`;
    }

    // Update health display in HUD
    const healthDiv = document.getElementById('game-mode-health');
    if (healthDiv && window.gameMode.enabled) {
      const hearts = '❤️'.repeat(window.gameMode.health);
      const emptyHearts = '🖤'.repeat(window.gameMode.maxHealth - window.gameMode.health);
      healthDiv.innerHTML = `Health: <span style="color: #ff3366;">${hearts}${emptyHearts}</span>`;
    }
  }

  // Skybox Destination Authoring: Update marker animations
      globalProfiler.mark('destination-authoring');
if (window.destinationAuthoring) {
    window.destinationAuthoring.updateMarkers(performance.now() * 0.001);
  }

  // Skybox Destination Authoring: Update navigation transitions
  if (window.destinationNavigator) {
    window.destinationNavigator.update();
  }

  // Myth Layer Compiler: Update glyph billboarding
      globalProfiler.mark('glyph-renderer');
if (window.glyphRenderer) {
    window.glyphRenderer.update();
  }

  // Phase 2.3.3: Render Shadow Box projection
      globalProfiler.mark('shadow-box');
const shadowBox = getShadowBox();
  if (shadowBox) {
    shadowBox.render(scene);
  }

  // Phase 13.8: Render shadow layer (split-screen with phase offset)
  // This must be called AFTER composer.render() to render the second view
  // Will be imported and called after composer renders

  // Dual Trail System: Use composer for motion trails
  if (state.motionTrailsEnabled) {
    afterimagePass.uniforms['damp'].value = state.motionTrailIntensity;
    afterimagePass.enabled = true;
  } else {
    afterimagePass.enabled = false;
  }
      globalProfiler.mark('compositor-render');
composer.render();

  // Phase 13.8: Render shadow layer AFTER main render (split-screen with phase offset)
      globalProfiler.mark('shadow-layer');
if (typeof window.renderShadowLayer === 'function') {
    window.renderShadowLayer();
  }

    // Phase 13.16: Capture timeline frame if recording
        globalProfiler.mark('timeline-capture');
if (window.captureTimelineFrame) {
      window.captureTimelineFrame();
    }

    // Phase 13.12: Reset error counter on successful frame
    consecutiveAnimationErrors = 0;

    globalProfiler.endFrame();

  } catch (error) {
    // Phase 13.12: Error boundary - log but continue animation loop
    consecutiveAnimationErrors++;

    // Throttle error logging to prevent console spam
    const now = performance.now();
    if (now - lastAnimationErrorTime > ERROR_THROTTLE_MS) {
      console.error(`🚨 Animation loop error (${consecutiveAnimationErrors} consecutive):`, error);
      console.error('Stack trace:', error.stack);
      lastAnimationErrorTime = now;

      // Warn user after threshold
      if (consecutiveAnimationErrors === MAX_ANIMATION_ERRORS) {
        console.error(`⚠️ ${MAX_ANIMATION_ERRORS} consecutive animation errors detected. App may be unstable.`);
        console.error('💡 Try refreshing the page or check console for underlying issues.');
      }
    }
    // Continue loop despite error (graceful degradation)
  }
}

animate();

console.log("🔺 Geometry module initialized with state-based architecture");
