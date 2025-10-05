import * as THREE from 'three';
import { state, blendColors, getEffectiveAudio } from './state.js'; // Phase 11.4.3: Import stable audio gate
import { updateShadows } from './shadows.js';
import { updateSprites } from './sprites.js';
import { updateParticles } from './particles.js';
import { updateAudio } from './audio.js'; // Audio system
import { updateVessel, renderShadowProjection } from './vessel.js';
import { getShadowBox } from './main.js'; // Phase 2.3.3
import { createPostProcessing } from './postprocessing.js'; // Dual Trail System
import { updateInterpolation, updateChain } from './presetRouter.js'; // Phase 11.2.8, 11.3.0
import { updateVisual } from './visual.js'; // Phase 11.6.0
import { initPeriaktos } from './periaktos.js'; // Phase 13.1.0: Periaktos mirror geometry

console.log("🔺 geometry.js loaded");

// Phase 11.4.3: One-time audio gate logging flag
let geometryAudioGateLogged = false;

// Phase 11.5.2: Debug throttle
let __geomFrame = 0;
const __GEOM_LOG_EVERY = 300; // ~5s at ~60fps

// Scene lighting references
let ambientLight = null;
let directionalLight = null;

export function getHUDIdleSpin() {
  return state.idleSpin;
}

const canvas = document.querySelector('#app');
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Dual Trail System: Initialize postprocessing composer with AfterimagePass
const { composer, afterimagePass } = createPostProcessing(renderer, scene, camera);

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
// Default: colored faces as fallback when no textures uploaded
const faceMaterials = [
  new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.7, metalness: 0.3 }), // Right (red)
  new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.7, metalness: 0.3 }), // Left (green)
  new THREE.MeshStandardMaterial({ color: 0x0000ff, roughness: 0.7, metalness: 0.3 }), // Top (blue)
  new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.7, metalness: 0.3 }), // Bottom (yellow)
  new THREE.MeshStandardMaterial({ color: 0x00ffff, roughness: 0.7, metalness: 0.3 }), // Front (cyan)
  new THREE.MeshStandardMaterial({ color: 0xff00ff, roughness: 0.7, metalness: 0.3 })  // Back (magenta)
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

  // Phase 13.1.0: Initialize Periaktos mirror geometry
  initPeriaktos();
  console.log("🌀 Periaktos initialized");

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

// Position camera for centered view
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// Handle window resize to maintain centering
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Clamp helper
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function updateMorphTargets(state) {
  // Phase 11.2: Use new array-based additive morphing system
  // Read from morphBaseWeights (persistent user values) and morphAudioWeights (from audio.js)
  const baseWeights = state.morphBaseWeights || [
    state.morphWeights.sphere || 0,
    state.morphWeights.cube || 0,
    state.morphWeights.pyramid || 0,
    state.morphWeights.torus || 0
  ];

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

  // Phase 11.2.1: Update material color using layered system
  const layerConfig = state.colorLayers.geometry;
  const audioData = getEffectiveAudio();
  const audioLevel = (audioData.bass + audioData.mid + audioData.treble) / 3;

  let finalColor = layerConfig.baseColor;

  if (state.audioReactive) {
    finalColor = blendColors(
      layerConfig.baseColor,
      layerConfig.audioColor,
      layerConfig.audioIntensity,
      audioLevel
    );

    // Debug logging (2% sample rate)
    if (Math.random() < 0.02) {
      console.log(`🎨 Geometry: base=${layerConfig.baseColor} audio=${layerConfig.audioColor} final=${finalColor}`);
    }
  }

  // Phase 11.6.0: Apply texture to morph if toggle ON
  if (state.useTextureOnMorph && state.texture) {
    material.map = state.texture;
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

  // Camera fit logic (perspective)
  const fov = (camera.fov || 75) * Math.PI / 180;
  const dist = (bounding * 0.5) / Math.tan(fov / 2);

  // Aim camera
  camera.position.set(0, 0, dist * 1.4);
  camera.lookAt(0, 0, 0);
  if (controls && typeof controls.update === 'function') controls.update();

  // Update renderer aspect
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  console.log("🎯 Camera and morph shape centered");
}

// Phase 12.0: Set morph amount (0=cube, 1=sphere conflation)
export function setMorphAmount(t /* 0..1 */) {
  if (morphMesh && morphMesh.morphTargetInfluences) {
    morphMesh.morphTargetInfluences[0] = THREE.MathUtils.clamp(t, 0, 1);
  }
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

// Phase 11.5.1: Performance monitoring for long-session lag detection
let frameCount = 0;
let lastFpsLog = performance.now();

// Main animation loop
function animate() {
  requestAnimationFrame(animate);

  // Phase 11.5.1: Log FPS every 5 seconds to detect degradation
  frameCount++;
  const now = performance.now();
  if (now - lastFpsLog > 5000) {
    const fps = (frameCount / (now - lastFpsLog)) * 1000;
    const memUsed = performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(1) : 'N/A';
    console.log(`📊 FPS: ${fps.toFixed(1)} | Mem: ${memUsed}MB | Particles: ${state.particlesCount}`);
    frameCount = 0;
    lastFpsLog = now;
  }

  // Phase 11.2.8: Update interpolation (modifies base state)
  updateInterpolation();

  // Phase 11.3.0: Update morph chain (layers on top of interpolation)
  updateChain();

  // Calculate rotation speeds from state
  const rotX = (state.idleSpin ? 0.01 : 0) + state.rotationX;
  const rotY = (state.idleSpin ? 0.01 : 0) + state.rotationY;
  const scale = state.scale;

  // Apply transformations to single morph mesh
  morphMesh.rotation.x += rotX;
  morphMesh.rotation.y += rotY;
  morphMesh.scale.set(scale, scale, scale);

  // Update audio if reactive
  if (state.audioReactive) updateAudio();

  // Update geometry from current state
  updateGeometryFromState();

  // Update shadows
  updateShadows(state.audioReactive);

  // Update particles
  if (state.particlesEnabled) {
    updateParticles(state.audioReactive, performance.now() * 0.001);
  }

  // Update sprites
  updateSprites();

  // Phase 11.6.0: Update background visual
  updateVisual();

  // Phase 11.7.3: Update emoji particles (always update if present, safe audio fallback)
  if (window.emojiParticles) {
    const audioLevel = state?.audio?.level ?? 0;
    window.emojiParticles.update(audioLevel);
  }

  // Phase 11.7.15: Update emoji stream manager (multi-stream support)
  if (window.emojiStreamManager) {
    const audioLevel = state?.audio?.level ?? 0;
    window.emojiStreamManager.update(audioLevel);
  }

  // Phase 11.7.16: Update emoji sequencer (beat-based choreography)
  if (window.emojiSequencer) {
    window.emojiSequencer.update();
  }

  // Phase 11.7.24/11.7.25/11.7.30: Update mandala controller (first-class scene citizen)
  // Phase 11.7.30: Pass audio level for ring expansion, symmetry pulse, emoji size reactivity
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
  updateVessel();

  // Phase 2.2.0: Render shadow projection for Conflat 6
  renderShadowProjection();

  // Phase 2.3.3: Render Shadow Box projection
  const shadowBox = getShadowBox();
  if (shadowBox) {
    shadowBox.render(scene);
  }

  // Dual Trail System: Use composer for motion trails, renderer for normal rendering
  if (state.motionTrailsEnabled) {
    afterimagePass.uniforms['damp'].value = state.motionTrailIntensity;
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
}

animate();

console.log("🔺 Geometry module initialized with state-based architecture");
