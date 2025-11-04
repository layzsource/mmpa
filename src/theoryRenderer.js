console.log("👁️ theoryRenderer.js loaded");

/**
 * MMPA Unified Theory Renderer
 *
 * Integrates the three core components of the Unified Theory:
 * - The Chestahedron (Heart/Sensor/Periaktos)
 * - The Double Vortex (Polarity Meter/Life Engine)
 * - The Archetype Recognizer (Pattern Detection)
 *
 * This is the complete visual manifestation of the MMPA Theory:
 * A Phenomenological Gauge Model and Early Warning System for Reality.
 */

import * as THREE from 'three';
import {
  createChestahedron,
  createChestahedronWireframe,
  createEdgeSensors,
  AXIS_OF_BEING
} from './chestahedron.js';
import {
  createDoubleVortex,
  updateDoubleVortex,
  setVortexSynchronization,
  calculateSynchronizationFromFeatures,
  triggerVortexImplosion,
  getVortexArchetype
} from './doubleVortex.js';
import {
  recognizeArchetype,
  onArchetypeEvent,
  getCurrentArchetype,
  getConfidence,
  isArchetype,
  ARCHETYPES,
  getStabilityMetric,
  getFluxMetric
} from './archetypeRecognizer.js';
import {
  logSample,
  isLogging as isDataLogging,
  startLogging,
  stopLogging,
  clearLog,
  exportData,
  getStatistics,
  getStatus as getLoggerStatus
} from './dataLogger.js';

// ============================================================================
// THEORY RENDERER STATE
// ============================================================================

let theoryScene = null;
let isInitialized = false;
let theoryEnabled = true; // Track theory mode state

const theoryState = {
  // Core components
  chestahedron: null,
  chestahedronWireframe: null,
  edgeSensors: null,
  vortexData: null,

  // Visual effects
  plasmaFlash: null,
  glowEffect: null,

  // Animation state
  heartRotationSpeed: 0.5,  // Base rotation speed
  heartWobble: 0,            // Wobble magnitude (0 = perfect, 1 = maximum wobble)

  // Archetype visual states
  archetypeEffects: {
    PERFECT_FIFTH: null,
    WOLF_FIFTH: null,
    NEUTRAL_STATE: null
  },

  // Configuration
  scale: 2.5,                // Overall scale of the visualization
  showWireframe: true,
  showEdgeSensors: false,
  autoRotate: true
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the Unified Theory visualization
 * @param {THREE.Scene} scene - The Three.js scene to add components to
 * @param {object} options - Configuration options
 * @returns {object} Theory renderer interface
 */
export function initTheoryRenderer(scene, options = {}) {
  if (isInitialized) {
    console.warn("👁️ Theory renderer already initialized");
    return getTheoryInterface();
  }

  console.log("👁️ Initializing Unified Theory Renderer");

  theoryScene = scene;

  // Apply options
  Object.assign(theoryState, options);

  // ARCHETYPE MORPH INTEGRATION: Skip static chestahedron creation
  // The archetype morph system (archetypeMorph.js) now handles chestahedron → bell morphing
  // Keeping this code commented for reference:
  // theoryState.chestahedron = createChestahedron(theoryState.scale, {
  //   roughness: 0.3,
  //   metalness: 0.7,
  //   transparent: false,
  //   opacity: 1.0
  // });
  // scene.add(theoryState.chestahedron);

  theoryState.chestahedron = null; // Explicitly set to null
  console.log("💎 Chestahedron creation skipped - using archetype morph system");

  // ARCHETYPE MORPH INTEGRATION: Skip wireframe creation
  // Wireframe is tied to the static chestahedron which we're no longer using
  theoryState.chestahedronWireframe = null;
  console.log("🔷 Wireframe creation skipped - using archetype morph system");

  // Create edge sensors if enabled
  if (theoryState.showEdgeSensors) {
    theoryState.edgeSensors = createEdgeSensors(theoryState.scale);
    scene.add(theoryState.edgeSensors);
    console.log("📡 Edge sensors (Mantis Shrimp Eye) created");
  }

  // Create the Double Vortex (Life Engine)
  theoryState.vortexData = createDoubleVortex();
  scene.add(theoryState.vortexData.group);
  console.log("🌀 Double Vortex (Life Engine) created");

  // Setup archetype event listeners
  setupArchetypeCallbacks();

  // Create visual effects
  createPlasmaFlashEffect(scene);
  createGlowEffect(scene);

  isInitialized = true;
  console.log("✨ Unified Theory Renderer initialized successfully");

  return getTheoryInterface();
}

/**
 * Get the theory renderer interface
 */
function getTheoryInterface() {
  return {
    update: updateTheoryRenderer,
    getChestahedron: () => theoryState.chestahedron,
    getVortex: () => theoryState.vortexData,
    setScale: (scale) => setTheoryScale(scale),
    toggleWireframe: () => toggleWireframe(),
    toggleEdgeSensors: () => toggleEdgeSensors(),
    setAutoRotate: (enabled) => { theoryState.autoRotate = enabled; },
    getCurrentArchetype: () => getCurrentArchetype(),
    getConfidence: () => getConfidence(),
    // Theory toggle state
    setEnabled: (enabled) => { theoryEnabled = enabled; console.log(`👁️ Theory mode: ${enabled ? 'ENABLED' : 'DISABLED'}`); },
    isEnabled: () => theoryEnabled,
    theoryState: theoryState, // Expose theoryState for archetypeMorph compatibility
    // Data logging functions
    startLogging: () => startLogging(),
    stopLogging: () => stopLogging(),
    clearLog: () => clearLog(),
    exportData: (format) => exportData(format),
    getLoggerStatus: () => getLoggerStatus()
  };
}

// ============================================================================
// UPDATE LOOP
// ============================================================================

/**
 * Update the theory visualization based on current MMPA state
 * @param {object} mmpaFeatures - Current MMPA feature values
 * @param {number} deltaTime - Time since last frame (seconds)
 */
export function updateTheoryRenderer(mmpaFeatures, deltaTime = 0.016) {
  if (!isInitialized) return;

  // 1. Recognize current archetype
  const recognition = recognizeArchetype(mmpaFeatures);

  // 2. Log data for training (if logging is active)
  if (isDataLogging()) {
    const stability = getStabilityMetric();
    const flux = getFluxMetric();
    logSample(stability, flux, recognition.archetype);
  }

  // 3. Calculate vortex synchronization from features
  const synchronization = calculateSynchronizationFromFeatures(mmpaFeatures);
  setVortexSynchronization(theoryState.vortexData, synchronization);

  // 4. Update Double Vortex animation
  updateDoubleVortex(theoryState.vortexData, deltaTime);

  // 5. Update Chestahedron (Heart) rotation and state
  updateHeartRotation(recognition, deltaTime);

  // 6. Apply archetype-specific visual effects
  applyArchetypeEffects(recognition);

  // 7. Update wireframe if present
  if (theoryState.chestahedronWireframe) {
    syncWireframeRotation();
  }

  // 8. Update edge sensors if present
  if (theoryState.edgeSensors) {
    syncEdgeSensorRotation();
  }
}

/**
 * Update the Heart (Chestahedron) rotation
 * - Perfect Fifth: Smooth rotation on 36° axis
 * - Wolf Fifth: Chaotic wobble off-axis
 * - Neutral: Gentle breathing rotation
 */
function updateHeartRotation(recognition, deltaTime) {
  const heart = theoryState.chestahedron;
  if (!heart) return;

  const archetype = recognition.archetype;

  if (archetype === ARCHETYPES.PERFECT_FIFTH) {
    // The Ringing Bell - smooth, perfect rotation on axis
    theoryState.heartWobble = Math.max(0, theoryState.heartWobble - deltaTime * 2);

    if (theoryState.autoRotate) {
      heart.rotation.z += theoryState.heartRotationSpeed * deltaTime;
    }

  } else if (archetype === ARCHETYPES.WOLF_FIFTH) {
    // The Cracked Bell - chaotic wobble
    theoryState.heartWobble = Math.min(1, theoryState.heartWobble + deltaTime * 3);

    // Add wobble - deviation from the 36° Axis of Being
    const wobbleX = Math.sin(performance.now() * 0.005) * theoryState.heartWobble * 0.3;
    const wobbleY = Math.cos(performance.now() * 0.007) * theoryState.heartWobble * 0.3;

    heart.rotation.x = AXIS_OF_BEING.TILT_ANGLE + wobbleX;
    heart.rotation.y = wobbleY;
    heart.rotation.z += theoryState.heartRotationSpeed * deltaTime * 2; // Faster, erratic

  } else {
    // Neutral State - gentle breathing
    theoryState.heartWobble = Math.max(0, theoryState.heartWobble - deltaTime);

    if (theoryState.autoRotate) {
      const breathe = Math.sin(performance.now() * 0.001) * 0.1;
      heart.rotation.z += (theoryState.heartRotationSpeed * 0.3 + breathe) * deltaTime;
    }
  }
}

/**
 * Sync wireframe rotation with main Chestahedron
 */
function syncWireframeRotation() {
  if (!theoryState.chestahedronWireframe || !theoryState.chestahedron) return;

  theoryState.chestahedronWireframe.rotation.copy(theoryState.chestahedron.rotation);
}

/**
 * Sync edge sensor rotation with main Chestahedron
 */
function syncEdgeSensorRotation() {
  if (!theoryState.edgeSensors || !theoryState.chestahedron) return;

  theoryState.edgeSensors.rotation.copy(theoryState.chestahedron.rotation);
}

// ============================================================================
// ARCHETYPE VISUAL EFFECTS
// ============================================================================

/**
 * Apply visual effects based on current archetype
 */
function applyArchetypeEffects(recognition) {
  const { archetype, confidence } = recognition;

  // Update materials based on archetype
  if (archetype === ARCHETYPES.PERFECT_FIFTH) {
    applyPerfectFifthEffect(confidence);
  } else if (archetype === ARCHETYPES.WOLF_FIFTH) {
    applyWolfFifthEffect(confidence);
  } else {
    applyNeutralStateEffect();
  }
}

/**
 * Perfect Fifth visual effect - crystalline, luminous, stable
 */
function applyPerfectFifthEffect(confidence) {
  if (!theoryState.chestahedron) return;

  // Increase metalness and reduce roughness - crystal-like
  theoryState.chestahedron.material.forEach(mat => {
    mat.metalness = 0.8;
    mat.roughness = 0.2;
    mat.emissive = mat.color.clone().multiplyScalar(0.2 * confidence);
  });

  // Activate glow effect
  if (theoryState.glowEffect) {
    theoryState.glowEffect.intensity = confidence;
  }
}

/**
 * Wolf Fifth visual effect - dark, chaotic, pulsing
 */
function applyWolfFifthEffect(confidence) {
  if (!theoryState.chestahedron) return;

  // Darken and make erratic
  theoryState.chestahedron.material.forEach(mat => {
    mat.metalness = 0.3;
    mat.roughness = 0.8;

    // Pulsing red emissive
    const pulse = Math.sin(performance.now() * 0.01) * 0.5 + 0.5;
    mat.emissive = new THREE.Color(0xff0000).multiplyScalar(pulse * confidence * 0.5);
  });
}

/**
 * Neutral State visual effect - subtle, ethereal
 */
function applyNeutralStateEffect() {
  if (!theoryState.chestahedron) return;

  // Return to default appearance
  theoryState.chestahedron.material.forEach(mat => {
    mat.metalness = 0.6;
    mat.roughness = 0.4;
    mat.emissive = new THREE.Color(0x000000);
  });

  // Disable glow
  if (theoryState.glowEffect) {
    theoryState.glowEffect.intensity = 0;
  }
}

// ============================================================================
// SPECIAL EFFECTS
// ============================================================================

/**
 * Create plasma flash effect for Wolf Fifth collapse
 */
function createPlasmaFlashEffect(scene) {
  const geometry = new THREE.SphereGeometry(0.5, 16, 16);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  });

  theoryState.plasmaFlash = new THREE.Mesh(geometry, material);
  theoryState.plasmaFlash.position.set(0, 0, 1.7); // Center of Chestahedron
  scene.add(theoryState.plasmaFlash);
}

/**
 * Trigger the plasma flash (sonoluminescent burst)
 */
export function triggerPlasmaFlash() {
  if (!theoryState.plasmaFlash) return;

  console.log("⚡💥 PLASMA FLASH - Sonoluminescent Burst!");

  const flash = theoryState.plasmaFlash;
  const material = flash.material;

  // Reset
  flash.scale.set(0.1, 0.1, 0.1);
  material.opacity = 1.0;
  material.color.setHex(0xffffff);

  // Animate expansion and fade
  const startTime = performance.now();
  const duration = 500; // milliseconds

  function animateFlash() {
    const elapsed = performance.now() - startTime;
    const progress = elapsed / duration;

    if (progress < 1.0) {
      flash.scale.setScalar(0.1 + progress * 3);
      material.opacity = 1.0 - progress;

      // Color shift: white → red → orange → fade
      if (progress < 0.3) {
        material.color.setHex(0xffffff);
      } else if (progress < 0.6) {
        material.color.setHex(0xff3333);
      } else {
        material.color.setHex(0xff8800);
      }

      requestAnimationFrame(animateFlash);
    } else {
      material.opacity = 0;
      flash.scale.set(0.1, 0.1, 0.1);
    }
  }

  animateFlash();
}

/**
 * Create glow effect for Perfect Fifth state
 */
function createGlowEffect(scene) {
  theoryState.glowEffect = {
    intensity: 0,
    light: new THREE.PointLight(0x00ffaa, 0, 10)
  };

  theoryState.glowEffect.light.position.set(0, 0, 1.7);
  scene.add(theoryState.glowEffect.light);
}

// ============================================================================
// ARCHETYPE EVENT CALLBACKS
// ============================================================================

/**
 * Setup callbacks for archetype transitions
 */
function setupArchetypeCallbacks() {
  // Perfect Fifth achieved
  onArchetypeEvent('onPerfectFifthEnter', (data) => {
    console.log("✨ Visual: Perfect Fifth - The Ringing Bell", data);
    // Smooth transition to crystalline state handled in update loop
  });

  // Wolf Fifth detected
  onArchetypeEvent('onWolfFifthEnter', (data) => {
    console.log("💥 Visual: Wolf Fifth - The Cracked Bell", data);
    // Trigger vortex implosion
    if (theoryState.vortexData) {
      triggerVortexImplosion(theoryState.vortexData);
    }
    // Trigger plasma flash after a delay
    setTimeout(() => {
      triggerPlasmaFlash();
    }, 300);
  });

  // Neutral State
  onArchetypeEvent('onNeutralStateEnter', (data) => {
    console.log("🌫️ Visual: Neutral State - The Aether", data);
    // Return to calm state handled in update loop
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Set the overall scale of the theory visualization
 */
function setTheoryScale(newScale) {
  const scaleFactor = newScale / theoryState.scale;

  if (theoryState.chestahedron) {
    theoryState.chestahedron.scale.multiplyScalar(scaleFactor);
  }
  if (theoryState.chestahedronWireframe) {
    theoryState.chestahedronWireframe.scale.multiplyScalar(scaleFactor);
  }
  if (theoryState.edgeSensors) {
    theoryState.edgeSensors.scale.multiplyScalar(scaleFactor);
  }
  if (theoryState.vortexData) {
    theoryState.vortexData.group.scale.multiplyScalar(scaleFactor);
  }

  theoryState.scale = newScale;
}

/**
 * Toggle wireframe visibility
 */
function toggleWireframe() {
  if (theoryState.chestahedronWireframe) {
    theoryState.chestahedronWireframe.visible = !theoryState.chestahedronWireframe.visible;
  }
}

/**
 * Toggle edge sensor visibility
 */
function toggleEdgeSensors() {
  if (theoryState.edgeSensors) {
    theoryState.edgeSensors.visible = !theoryState.edgeSensors.visible;
  }
}

/**
 * Cleanup and dispose of theory renderer
 */
export function disposeTheoryRenderer() {
  if (!isInitialized) return;

  // Remove from scene
  if (theoryState.chestahedron) theoryScene.remove(theoryState.chestahedron);
  if (theoryState.chestahedronWireframe) theoryScene.remove(theoryState.chestahedronWireframe);
  if (theoryState.edgeSensors) theoryScene.remove(theoryState.edgeSensors);
  if (theoryState.vortexData) theoryScene.remove(theoryState.vortexData.group);
  if (theoryState.plasmaFlash) theoryScene.remove(theoryState.plasmaFlash);
  if (theoryState.glowEffect) theoryScene.remove(theoryState.glowEffect.light);

  // TODO: Dispose of geometries and materials

  isInitialized = false;
  console.log("👁️ Theory renderer disposed");
}

console.log("👁️ theoryRenderer.js ready - The Unified Theory visualization engine is initialized");
