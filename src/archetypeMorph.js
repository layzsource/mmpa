import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { onArchetypeEvent, ARCHETYPES } from './archetypeRecognizer.js';
import { analyzePitchSpectrum, mapToDiatonicScale, getScaleDegreeColor, getNoteColor } from './pitchDetector.js';
import { AudioEngine } from './audio.js';

console.log("🔄 archetypeMorph.js loaded - Chestahedron ↔ Bell transformation");

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio

const V_FACTOR = 1.0; // Scale factor for vertex coordinates
const MAX_MORPH_VALUE = 500; // Slider range (0 = Chestahedron, 500 = Bell)

// Chestahedron V=7 coordinates (computational geometry, normalized, Z-up)
const V_SET = [
    // V0: Apex
    [0.000000, 0.000000, 3.149206],

    // V1, V2, V3: Mid-Ring
    [1.791500, 0.000000, 0.812302],
    [-0.895750, 1.550186, 0.812302],
    [-0.895750, -1.550186, 0.812302],

    // V4, V5, V6: Lower Base Ring
    [1.156680, 2.003440, -1.745670],
    [-2.313360, 0.000000, -1.745670],
    [1.156680, -2.003440, -1.745670]
];

// Convert to THREE.Vector3 array with scale factor applied
const FINAL_VERTICES = V_SET.map(v =>
    new THREE.Vector3(v[0] * V_FACTOR, v[1] * V_FACTOR, v[2] * V_FACTOR)
);

// Geometry scaling and centering calculations
const CH_Z_APEX_UNSCALED = 3.149206;
const CH_Z_BASE_UNSCALED = -1.745670;
const CH_Z_HEIGHT_UNSCALED = CH_Z_APEX_UNSCALED - CH_Z_BASE_UNSCALED; // 4.894876
const CH_Z_CENTER_UNSCALED = (CH_Z_APEX_UNSCALED + CH_Z_BASE_UNSCALED) / 2; // 0.701768
const CH_CENTER_Z = CH_Z_CENTER_UNSCALED * V_FACTOR;

// Tonal Tower scaling
const TT_HEIGHT_UNSCALED_BASE = 2.0;
const TOTAL_SCALE_FACTOR = (CH_Z_HEIGHT_UNSCALED * V_FACTOR) / TT_HEIGHT_UNSCALED_BASE;

// =============================================================================
// MORPH STATE
// =============================================================================

let morphGroup = null;
let chestahedronMesh = null;
let tonalTowerMesh = null;
let plasmaFlashMesh = null; // Wolf Fifth plasma flash at apex
let currentMorphValue = 0; // 0-500 range
let targetMorphValue = 0;
let currentRotationSpeed = 0;

// Calculate apex position (after geometry centering)
const APEX_Z = (CH_Z_APEX_UNSCALED - CH_Z_CENTER_UNSCALED) * V_FACTOR; // 2.447438

// =============================================================================
// SYNESTHETIC COLOR MAPPING STATE
// =============================================================================

let synestheticColoringEnabled = true; // Toggle for synesthetic face coloring
let lastPitchAnalysis = null; // Cache last pitch analysis result
let colorUpdateCounter = 0; // For throttled updates
const COLOR_UPDATE_INTERVAL = 6; // Update colors every 6 frames (10Hz at 60fps)

const GOLD_COLOR = 0xffc01f; // Default gold color

// =============================================================================
// GEOMETRY CREATION
// =============================================================================

/**
 * Creates the 7-sided Chestahedron geometry with gold material
 */
function createChestahedronGeometry() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    let faceIndex = 0;
    let offset = 0;

    // Vertex indices
    const V_APEX = 0;
    const V_MID1 = 1, V_MID2 = 2, V_MID3 = 3;
    const V_BASE1 = 4, V_BASE2 = 5, V_BASE3 = 6;

    // Helper: Add triangle and assign face group
    const addTri = (i1, i2, i3, currentFaceIndex) => {
        const v1 = FINAL_VERTICES[i1], v2 = FINAL_VERTICES[i2], v3 = FINAL_VERTICES[i3];
        positions.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z, v3.x, v3.y, v3.z);
        geometry.addGroup(offset, 3, currentFaceIndex);
        offset += 3;
    };

    // Helper: Add kite (quadrilateral) as two triangles
    const addKite = (a, b, c, d, currentFaceIndex) => {
        addTri(a, b, c, currentFaceIndex);
        addTri(a, c, d, currentFaceIndex);
    };

    // 1. Three kite faces (RED, GREEN, BLUE)
    addKite(V_APEX, V_MID1, V_BASE1, V_MID2, faceIndex++); // Face 0
    addKite(V_APEX, V_MID2, V_BASE2, V_MID3, faceIndex++); // Face 1
    addKite(V_APEX, V_MID3, V_BASE3, V_MID1, faceIndex++); // Face 2

    // 2. Three side triangles + one base triangle (YELLOW, ORANGE, PURPLE, WHITE)
    addTri(V_MID1, V_BASE1, V_BASE3, faceIndex++); // Face 3
    addTri(V_MID2, V_BASE2, V_BASE1, faceIndex++); // Face 4
    addTri(V_MID3, V_BASE3, V_BASE2, faceIndex++); // Face 5
    addTri(V_BASE1, V_BASE2, V_BASE3, faceIndex++); // Face 6

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    // Center geometry around origin
    geometry.translate(0, 0, -CH_CENTER_Z);

    return geometry;
}

/**
 * Creates the Tonal Tower (bell) geometry using LatheGeometry with PHI-based profile
 */
function createTonalTowerGeometry() {
    const radialSegments = 64;
    const profileSegments = 250;

    const C = 2 * PHI * PHI;
    const D = 1 - C;

    let formulaPoints = [];

    // Cinch and taper parameters
    const START_ULT = 0.26;
    const END_ULT = 0.00;
    const PULL_ULT_START = 0.01;
    const PULL_ULT_END = 0.99;
    const MID_CINCH_START = 0.11;
    const MID_CINCH_END = 0.99;
    const MID_CINCH_AMOUNT = 0.08;

    // Generate profile curve
    for (let i = 0; i <= profileSegments; i++) {
        const t = i / profileSegments;
        const x_unscaled = 1.0 + (PHI - 1.0) * t;
        let R_unscaled = 0.5 * x_unscaled;
        const Z_unscaled = (C / x_unscaled) + D;

        let totalPull = 0;

        // Mid-body concavity
        if (t >= MID_CINCH_START && t <= MID_CINCH_END) {
            const range = MID_CINCH_END - MID_CINCH_START;
            const t_norm = (t - MID_CINCH_START) / range;
            let pull_mid = MID_CINCH_AMOUNT * Math.sin(Math.PI * t_norm);
            totalPull = Math.max(totalPull, pull_mid);
        }

        // Unified Lower Taper (ULT)
        if (t <= START_ULT && t >= END_ULT) {
            const t_norm = 1.0 - (t / START_ULT);
            const progressive_pull_norm = Math.pow(t_norm, 1.5);
            const pull_ult = PULL_ULT_START * (1.0 - progressive_pull_norm) + PULL_ULT_END * progressive_pull_norm;
            totalPull = Math.max(totalPull, pull_ult);
        }

        R_unscaled *= (1.0 - totalPull);

        const R_scaled = R_unscaled * TOTAL_SCALE_FACTOR;
        const Z_scaled_final = (Z_unscaled * TOTAL_SCALE_FACTOR);

        formulaPoints.push(new THREE.Vector2(R_scaled, Z_scaled_final));
    }

    formulaPoints.reverse();

    // Create lathe body
    const latheGeometry = new THREE.LatheGeometry(formulaPoints, radialSegments);
    latheGeometry.rotateX(Math.PI / 2); // Align with Z-up convention

    // Create bottom cap
    const R_BOTTOM = formulaPoints[0].x;
    const Z_BOTTOM_ALIGNED = formulaPoints[0].y;
    const capGeometry = new THREE.CircleGeometry(R_BOTTOM, radialSegments);
    capGeometry.translate(0, 0, Z_BOTTOM_ALIGNED);

    // Merge lathe and cap
    const mergedGeometry = mergeGeometries([
        latheGeometry.clone(),
        capGeometry.clone()
    ]);

    mergedGeometry.computeVertexNormals();

    return mergedGeometry;
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize the archetype morph system and add to scene
 * @param {THREE.Scene} scene - Three.js scene to add morphing group to
 */
export function initArchetypeMorph(scene) {
    console.log("🔄 Initializing Archetype Morph System...");

    // Create gold metallic material (using global GOLD_COLOR)
    const goldMaterial = new THREE.MeshStandardMaterial({
        color: GOLD_COLOR,
        metalness: 0.95,
        roughness: 0.4,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: true
    });

    // Create Chestahedron with 7 identical gold materials (one per face)
    const chestaGeo = createChestahedronGeometry();
    const chestahedronMaterials = [];
    for (let i = 0; i < 7; i++) {
        chestahedronMaterials.push(goldMaterial.clone());
    }
    chestahedronMesh = new THREE.Mesh(chestaGeo, chestahedronMaterials);

    // Create Tonal Tower (bell)
    const tonalGeo = createTonalTowerGeometry();
    tonalTowerMesh = new THREE.Mesh(tonalGeo, goldMaterial.clone());
    tonalTowerMesh.visible = false; // Start hidden
    tonalTowerMesh.material.opacity = 0;

    // Create group for unified rotation (prevents wobble)
    morphGroup = new THREE.Group();

    // Apply 36-degree tilt on X-axis
    const TILT_ANGLE = 36 * Math.PI / 180;
    morphGroup.rotation.x = TILT_ANGLE;

    // Create plasma flash at apex for Wolf Fifth effect
    const flashGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const flashMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });
    plasmaFlashMesh = new THREE.Mesh(flashGeometry, flashMaterial);
    plasmaFlashMesh.position.set(0, 0, APEX_Z); // Position at apex of bell/chestahedron

    // Add meshes to group
    morphGroup.add(chestahedronMesh);
    morphGroup.add(tonalTowerMesh);
    morphGroup.add(plasmaFlashMesh); // Add plasma flash to group so it follows rotation

    // Initialize as hidden (theory mode starts disabled)
    morphGroup.visible = false;

    // Add group to scene
    scene.add(morphGroup);

    // Register archetype event callbacks
    registerArchetypeCallbacks();

    // Initialize morph state to show chestahedron (value = 0)
    applyMorph(0);
    console.log("🔄 Initial morph state applied: Chestahedron visible, Bell hidden");

    // Hide the theoryRenderer's static chestahedron to prevent visual conflict
    if (window.theoryRenderer && window.theoryRenderer.theoryState) {
        const ts = window.theoryRenderer.theoryState;
        if (ts.chestahedron) {
            ts.chestahedron.visible = false;
            console.log("🔷 TheoryRenderer chestahedron hidden");
        }
        if (ts.chestahedronWireframe) {
            ts.chestahedronWireframe.visible = false;
            console.log("🔷 TheoryRenderer wireframe hidden");
        }
    }

    console.log("✅ Archetype Morph System initialized");
}

// =============================================================================
// SYNESTHETIC COLOR MAPPING
// =============================================================================

/**
 * Update chestahedron face colors based on detected pitch/key
 * Maps the 7 diatonic scale degrees to the 7 faces using Newton-Scriabin color theory
 */
function updateSynestheticColors() {
    // DEBUG 1: Check if function is being called
    if (colorUpdateCounter === 0) {
        console.log('🎨 DEBUG 1: updateSynestheticColors first call');
    }

    // DEBUG 2: Check enabled state and mesh existence
    if (!synestheticColoringEnabled || !chestahedronMesh) {
        if (colorUpdateCounter % 120 === 0) { // Log every 2 seconds
            console.log('🎨 DEBUG 2: Early return - enabled:', synestheticColoringEnabled, 'mesh exists:', !!chestahedronMesh);
        }
        return;
    }

    // DEBUG 3: Check material array
    if (!Array.isArray(chestahedronMesh.material)) {
        if (colorUpdateCounter % 120 === 0) {
            console.log('🎨 DEBUG 3: Material not array - type:', typeof chestahedronMesh.material, 'isArray:', Array.isArray(chestahedronMesh.material));
        }
        return;
    }

    // Throttle updates to reduce CPU load (10Hz update rate)
    colorUpdateCounter++;
    if (colorUpdateCounter % COLOR_UPDATE_INTERVAL !== 0) return;

    // DEBUG 4: Past throttle check (log periodically)
    if (colorUpdateCounter % 120 === 0) {
        console.log('🎨 DEBUG 4: Past throttle check, counter:', colorUpdateCounter);
    }

    try {
        // DEBUG 5: Check AudioEngine availability
        if (!AudioEngine || !AudioEngine.analyser) {
            if (colorUpdateCounter % 120 === 0) {
                console.log('🎨 DEBUG 5: AudioEngine issue - engine exists:', !!AudioEngine, 'analyser exists:', !!AudioEngine?.analyser);
            }
            return;
        }

        // DEBUG 6: AudioEngine is available
        if (colorUpdateCounter % 120 === 0) {
            console.log('🎨 DEBUG 6: AudioEngine available, frequencyBinCount:', AudioEngine.analyser.frequencyBinCount);
        }

        // Get frequency spectrum
        const spectrum = new Uint8Array(AudioEngine.analyser.frequencyBinCount);
        AudioEngine.analyser.getByteFrequencyData(spectrum);

        const sampleRate = AudioEngine.ctx.sampleRate;
        const nyquist = sampleRate / 2;

        // Analyze chromatic pitch profile (12 tones)
        const pitchAnalysis = analyzePitchSpectrum(spectrum, sampleRate, nyquist);
        lastPitchAnalysis = pitchAnalysis; // Cache for debugging

        // Map to diatonic scale (7 scale degrees for 7 faces)
        const diatonicMapping = mapToDiatonicScale(pitchAnalysis);

        // DEBUG 7: Log energy levels periodically
        if (colorUpdateCounter % 120 === 0) {
            console.log('🎨 DEBUG 7: Energy:', pitchAnalysis.totalEnergy.toFixed(3), 'Threshold: 1.0');
        }

        // Check if we have enough signal energy to apply coloring
        const ENERGY_THRESHOLD = 1.0; // Minimum energy to trigger color change
        if (pitchAnalysis.totalEnergy < ENERGY_THRESHOLD) {
            // Not enough signal - fade back to gold
            chestahedronMesh.material.forEach(mat => {
                mat.color.lerp(new THREE.Color(GOLD_COLOR), 0.1);
            });
            if (colorUpdateCounter % 120 === 0) {
                console.log('🎨 DEBUG 8: Below energy threshold, fading to gold');
            }
            return;
        }

        // DEBUG 9: Energy threshold met - applying colors
        if (colorUpdateCounter % 60 === 0) {
            console.log(`🎨 DEBUG 9: APPLYING COLORS - Key: ${diatonicMapping.rootNote} ${diatonicMapping.mode}, energy: ${pitchAnalysis.totalEnergy.toFixed(2)}`);
        }

        // Apply colors to each face based on scale degree energy
        const { scaleDegreeEnergyNormalized, scaleDegreeNotes } = diatonicMapping;
        const rootNote = diatonicMapping.rootNote;
        const mode = diatonicMapping.mode;

        for (let faceIndex = 0; faceIndex < 7; faceIndex++) {
            const material = chestahedronMesh.material[faceIndex];
            const energy = scaleDegreeEnergyNormalized[faceIndex];

            // Get the color for this scale degree
            const scaleDegreeColor = getScaleDegreeColor(faceIndex, rootNote, mode);
            const targetColor = new THREE.Color(scaleDegreeColor);

            // Blend between gold (low energy) and chromatic color (high energy)
            const goldColor = new THREE.Color(GOLD_COLOR);
            const blendFactor = energy * 0.7; // Max 70% color blend (keep some gold)

            material.color.copy(goldColor).lerp(targetColor, blendFactor);
        }

        // Apply dominant key color glow to entire shape (visible during bell morph too)
        const dominantKeyColor = getNoteColor(pitchAnalysis.rootNote);
        const glowColor = new THREE.Color(dominantKeyColor);

        // Strong, visible glow: base 0.8 + scaled by strength, max 2.5
        const glowIntensity = Math.min(0.8 + (pitchAnalysis.strength * 2.0), 2.5);

        // Debug logging (every 60 frames = ~1 second at 60fps)
        if (Math.random() < 0.016) { // ~1/60 chance
            console.log(`🔆 GLOW DEBUG:`, {
                rootNote: pitchAnalysis.rootNote,
                rootNoteName: pitchAnalysis.rootNoteName,
                dominantKeyColor,
                glowIntensity: glowIntensity.toFixed(2),
                strength: pitchAnalysis.strength.toFixed(4),
                chromaticEnergy: pitchAnalysis.totalEnergy.toFixed(2),
                diatonicEnergy: diatonicMapping.totalEnergy.toFixed(2),
                hasChestahedronMaterials: Array.isArray(chestahedronMesh?.material),
                hasTonalTowerMaterial: !!tonalTowerMesh?.material
            });
        }

        // Apply glow to all chestahedron materials
        if (Array.isArray(chestahedronMesh.material)) {
            chestahedronMesh.material.forEach(mat => {
                mat.emissive.copy(glowColor);
                mat.emissiveIntensity = glowIntensity;
            });
        }

        // Apply glow to tonal tower (bell) material as well
        if (tonalTowerMesh && tonalTowerMesh.material) {
            tonalTowerMesh.material.emissive.copy(glowColor);
            tonalTowerMesh.material.emissiveIntensity = glowIntensity;
        }

    } catch (error) {
        console.error("🎨 Error updating synesthetic colors:", error);
        synestheticColoringEnabled = false; // Disable on error to prevent spam
    }
}

/**
 * Enable or disable synesthetic face coloring
 * @param {boolean} enabled - Enable/disable flag
 */
export function setSynestheticColoringEnabled(enabled) {
    synestheticColoringEnabled = enabled;
    console.log(`🎨 Synesthetic coloring: ${enabled ? 'ENABLED' : 'DISABLED'}`);

    // Reset to gold when disabled
    if (!enabled) {
        // Reset chestahedron materials
        if (chestahedronMesh && Array.isArray(chestahedronMesh.material)) {
            chestahedronMesh.material.forEach(mat => {
                mat.color.setHex(GOLD_COLOR);
                mat.emissive.setHex(0x000000); // Remove glow
                mat.emissiveIntensity = 0;
            });
        }

        // Reset tonal tower material
        if (tonalTowerMesh && tonalTowerMesh.material) {
            tonalTowerMesh.material.color.setHex(GOLD_COLOR);
            tonalTowerMesh.material.emissive.setHex(0x000000); // Remove glow
            tonalTowerMesh.material.emissiveIntensity = 0;
        }
    }
}

/**
 * Get last pitch analysis result (for debugging)
 */
export function getLastPitchAnalysis() {
    return lastPitchAnalysis;
}

// =============================================================================
// ARCHETYPE EVENT CALLBACKS
// =============================================================================

function registerArchetypeCallbacks() {
    // PERFECT_FIFTH: Transition to bell (500)
    onArchetypeEvent('onPerfectFifthEnter', (data) => {
        // Check if we're in startup delay period
        const timeSinceEnable = Date.now() - theoryEnableTime;
        if (theoryEnableTime > 0 && timeSinceEnable < STARTUP_DELAY_MS) {
            console.log(`🔔 PERFECT_FIFTH detected BUT IGNORED (startup delay: ${timeSinceEnable}ms / ${STARTUP_DELAY_MS}ms)`);
            return;
        }

        console.log(`🔔 PERFECT_FIFTH detected - morphing to bell (φ-coherence: ${data.stabilityMetric.toFixed(3)})`);
        targetMorphValue = MAX_MORPH_VALUE; // Full bell
        console.log(`   → targetMorphValue set to ${targetMorphValue} (full bell)`);
    });

    // WOLF_FIFTH: Return partway to chestahedron (250) - chaos state
    onArchetypeEvent('onWolfFifthEnter', (data) => {
        // Check if we're in startup delay period
        const timeSinceEnable = Date.now() - theoryEnableTime;
        if (theoryEnableTime > 0 && timeSinceEnable < STARTUP_DELAY_MS) {
            console.log(`⚡ WOLF_FIFTH detected BUT IGNORED (startup delay: ${timeSinceEnable}ms / ${STARTUP_DELAY_MS}ms)`);
            return;
        }

        console.log(`⚡ WOLF_FIFTH detected - partial morph (sub-φ crisis: ${data.stabilityMetric.toFixed(3)})`);
        targetMorphValue = MAX_MORPH_VALUE * 0.5; // Mid-point morph
        console.log(`   → targetMorphValue set to ${targetMorphValue} (mid-point morph)`);
    });

    // NEUTRAL_STATE: Return to chestahedron (0)
    onArchetypeEvent('onNeutralStateEnter', (data) => {
        // Check if we're in startup delay period
        const timeSinceEnable = Date.now() - theoryEnableTime;
        if (theoryEnableTime > 0 && timeSinceEnable < STARTUP_DELAY_MS) {
            console.log(`🌫️ NEUTRAL_STATE detected BUT IGNORED (startup delay: ${timeSinceEnable}ms / ${STARTUP_DELAY_MS}ms)`);
            return;
        }

        console.log(`🌫️ NEUTRAL_STATE detected - returning to chestahedron (quiet field: ${data.fluxMetric.toFixed(3)})`);
        targetMorphValue = 0; // Full chestahedron
        console.log(`   → targetMorphValue set to ${targetMorphValue} (full chestahedron)`);
    });
}

// =============================================================================
// MORPH CONTROL
// =============================================================================

// Debug logging throttle
let debugFrameCount = 0;
const DEBUG_LOG_INTERVAL = 120; // Log every 2 seconds at 60fps

/**
 * Apply morph value to control opacity crossfade and rotation
 * @param {number} value - Morph value (0-500)
 */
function applyMorph(value) {
    if (!chestahedronMesh || !tonalTowerMesh) return;

    // Debug logging
    if (debugFrameCount++ % DEBUG_LOG_INTERVAL === 0) {
        console.log(`🔄 Morph value: ${value.toFixed(1)}, Target: ${targetMorphValue}, ChestVis: ${chestahedronMesh.visible}, BellVis: ${tonalTowerMesh.visible}`);
    }

    // 1. Chestahedron fade out (0-400 range)
    const chestaFadeEnd = 400;
    let chestaOpacity = 1.0;

    if (value > 0 && value < chestaFadeEnd) {
        chestaOpacity = 1.0 - (value / chestaFadeEnd);
    } else if (value >= chestaFadeEnd) {
        chestaOpacity = 0.0;
    }

    // DepthWrite management to prevent z-fighting artifacts
    const CH_DEPTH_WRITE_SWITCH_POINT = 75.0;
    const isChestaFullyOpaque = value <= CH_DEPTH_WRITE_SWITCH_POINT;

    // Apply to all materials (array of 7 face materials)
    if (Array.isArray(chestahedronMesh.material)) {
        chestahedronMesh.material.forEach(mat => {
            mat.opacity = chestaOpacity;
            mat.depthWrite = isChestaFullyOpaque;
            mat.visible = chestaOpacity > 0.0; // Per-material visibility
        });
    } else {
        chestahedronMesh.material.opacity = chestaOpacity;
        chestahedronMesh.material.depthWrite = isChestaFullyOpaque;
        chestahedronMesh.material.visible = chestaOpacity > 0.0;
    }
    chestahedronMesh.visible = chestaOpacity > 0.0;

    // ULTRA-AGGRESSIVE hiding for full bell state
    if (value >= 450) {
        chestahedronMesh.visible = false;
        chestahedronMesh.scale.set(0.00001, 0.00001, 0.00001); // Scale to microscopic
        chestahedronMesh.position.y = -10000; // Move chestahedron FAR away (not the group!)
        chestahedronMesh.renderOrder = -1000; // Push WAY behind
        // Force all materials invisible
        if (Array.isArray(chestahedronMesh.material)) {
            chestahedronMesh.material.forEach(mat => {
                mat.opacity = 0;
                mat.visible = false;
            });
        }
    } else if (value < 100) {
        // Restore full scale and position when returning to chestahedron
        chestahedronMesh.scale.set(1, 1, 1);
        chestahedronMesh.position.y = 0; // Restore position
        chestahedronMesh.renderOrder = 0;
    } else {
        // Smooth scale transition during morph (100-450 range)
        const scaleFactor = 1.0 - ((value - 100) / 350);
        chestahedronMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
        // Smooth position transition - move chestahedron down as it fades
        const posFactor = (value - 100) / 350;
        chestahedronMesh.position.y = -10000 * posFactor;
    }

    // 2. Tonal Tower fade in (100-500 range)
    const tonalFadeStart = 100;
    const tonalFadeEnd = MAX_MORPH_VALUE;
    const tonalRange = tonalFadeEnd - tonalFadeStart;

    let tonalOpacity = 0.0;
    if (value > tonalFadeStart) {
        tonalOpacity = Math.min(1.0, (value - tonalFadeStart) / tonalRange);
    }

    const TT_DEPTH_WRITE_SWITCH_POINT = 425.0;
    const isTonalFullyOpaque = value >= TT_DEPTH_WRITE_SWITCH_POINT;

    tonalTowerMesh.material.opacity = tonalOpacity;
    tonalTowerMesh.material.depthWrite = isTonalFullyOpaque;
    tonalTowerMesh.material.visible = tonalOpacity > 0.0;
    tonalTowerMesh.visible = tonalOpacity > 0.0;

    // Restore position and scale when becoming visible (fixes hide/show issue)
    if (tonalOpacity > 0.0) {
        tonalTowerMesh.renderOrder = 1;
        tonalTowerMesh.scale.set(1, 1, 1);
        tonalTowerMesh.position.y = 0; // Restore from -10000 if previously hidden
    } else {
        // Hide tonal tower when not visible
        tonalTowerMesh.scale.set(0.00001, 0.00001, 0.00001);
        tonalTowerMesh.position.y = -10000;
    }

    // 3. Store rotation speed for animate loop
    currentRotationSpeed = value;
}

// =============================================================================
// ANIMATION UPDATE
// =============================================================================

/**
 * Update morph animation (call from main animation loop)
 * @param {number} deltaTime - Time delta in seconds
 */
// Track last theory state for change detection
let lastTheoryEnabled = null;
let theoryEnableTime = 0; // Track when theory mode was enabled
const STARTUP_DELAY_MS = 1000; // 1 second delay before allowing archetype transitions

export function updateArchetypeMorph(deltaTime) {
    if (!morphGroup) return;

    // Check if theory mode is enabled (respects the theory toggle)
    // Default to FALSE if not initialized yet (prevents flash of visible geometry)
    const theoryEnabled = window.theoryRenderer?.isEnabled?.() ?? false;

    // Handle theory state changes
    if (lastTheoryEnabled !== theoryEnabled) {
        console.log(`🔷 Theory toggle changed: ${theoryEnabled ? 'ON' : 'OFF'} - morphGroup.visible = ${theoryEnabled}`);
        console.log(`🔷 Current morph values: currentMorphValue=${currentMorphValue.toFixed(1)}, targetMorphValue=${targetMorphValue}`);

        if (theoryEnabled) {
            // Record when theory mode was enabled
            theoryEnableTime = Date.now();

            // Reset morph values to show chestahedron (ignore any pre-existing archetype state)
            targetMorphValue = 0;
            currentMorphValue = 0;
            applyMorph(0); // Force immediate chestahedron visibility

            console.log(`🔷 Theory ENABLED - Starting ${STARTUP_DELAY_MS}ms stabilization period`);
            console.log(`🔷 Morph values RESET - currentMorphValue=0, targetMorphValue=0 (chestahedron)`);
        }

        if (!theoryEnabled) {
            // Log details only when transitioning to disabled
            console.log(`🔷 Theory DISABLED - Hiding all meshes. morphGroup.visible = ${theoryEnabled}`);

            if (chestahedronMesh) {
                if (Array.isArray(chestahedronMesh.material)) {
                    console.log(`  ↳ Chestahedron materials (${chestahedronMesh.material.length}): all opacity=0, visible=false`);
                } else {
                    console.log(`  ↳ Chestahedron material: opacity=0, visible=false`);
                }
                console.log(`  ↳ Chestahedron mesh: visible=false, scale=0.00001, pos.y=-10000`);
            }

            if (tonalTowerMesh) {
                console.log(`  ↳ Tonal Tower: visible=false, opacity=0, scale=0.00001, pos.y=-10000`);
            }

            console.log(`🔷 Theory disabled hiding complete - returning early (no applyMorph)`);
        }

        lastTheoryEnabled = theoryEnabled;
    }

    morphGroup.visible = theoryEnabled;

    if (!theoryEnabled) {
        // Explicitly hide and zero opacity for performance (but don't log every frame)
        if (chestahedronMesh) {
            chestahedronMesh.visible = false;
            chestahedronMesh.scale.set(0.00001, 0.00001, 0.00001);
            chestahedronMesh.position.y = -10000;

            if (Array.isArray(chestahedronMesh.material)) {
                chestahedronMesh.material.forEach((mat, idx) => {
                    mat.opacity = 0;
                    mat.visible = false;
                    mat.needsUpdate = true;
                });
            } else {
                chestahedronMesh.material.opacity = 0;
                chestahedronMesh.material.visible = false;
                chestahedronMesh.material.needsUpdate = true;
            }
        }

        if (tonalTowerMesh) {
            tonalTowerMesh.visible = false;
            tonalTowerMesh.scale.set(0.00001, 0.00001, 0.00001);
            tonalTowerMesh.position.y = -10000;
            tonalTowerMesh.material.opacity = 0;
            tonalTowerMesh.material.visible = false;
            tonalTowerMesh.material.needsUpdate = true;
        }

        return; // Skip animation if theory is disabled
    }

    // Smooth transition to target morph value
    const MORPH_LERP_SPEED = 2.0; // Adjust for faster/slower transitions
    currentMorphValue += (targetMorphValue - currentMorphValue) * MORPH_LERP_SPEED * deltaTime;

    // Apply current morph state
    applyMorph(currentMorphValue);

    // Update synesthetic face colors based on audio pitch detection
    updateSynestheticColors();

    // Apply rotation around Z-axis (geometric polar axis after X-tilt)
    if (currentRotationSpeed > 0) {
        // Scaling factor 0.1 for rotation rate (radians/sec)
        const rotationRate = currentRotationSpeed * 0.1 * deltaTime;
        morphGroup.rotation.z += rotationRate;
    }
}

// =============================================================================
// MANUAL CONTROL (for testing/debugging)
// =============================================================================

/**
 * Manually set morph value (for testing)
 * @param {number} value - Morph value (0-500)
 */
export function setMorphValue(value) {
    targetMorphValue = THREE.MathUtils.clamp(value, 0, MAX_MORPH_VALUE);
}

/**
 * Get current morph value
 * @returns {number} Current morph value (0-500)
 */
export function getMorphValue() {
    return currentMorphValue;
}

/**
 * Trigger the plasma flash at the apex (called from theoryRenderer on Wolf Fifth)
 * Enhanced with chaotic color-shifting for Wolf Fifth
 */
export function triggerPlasmaFlash() {
    if (!plasmaFlashMesh) return;

    console.log("⚡💥 PLASMA FLASH - Sonoluminescent Burst at apex!");

    const flash = plasmaFlashMesh;
    const material = flash.material;

    // Reset
    flash.scale.set(0.1, 0.1, 0.1);
    material.opacity = 1.0;
    material.color.setHex(0xffffff);

    // Chaotic color sequence for Wolf Fifth
    const colorSequence = [
        0xffffff, // Bright white (initial burst)
        0xff00ff, // Magenta (peak intensity)
        0xff0000, // Red (implosion)
        0xff4400, // Red-Orange (chaos)
        0x8800ff, // Purple (dissipation)
        0x0044ff  // Dark Blue (fade)
    ];

    // Animate expansion and fade
    const startTime = performance.now();
    const duration = 700; // milliseconds (slightly longer for dramatic effect)

    function animateFlash() {
        const elapsed = performance.now() - startTime;
        const progress = elapsed / duration;

        if (progress < 1.0) {
            // Non-linear expansion (explosive burst then rapid expansion)
            const expansionCurve = progress < 0.2
                ? Math.pow(progress * 5, 2) * 0.04  // Explosive start
                : 0.2 + (progress - 0.2) * 3.5;      // Rapid expansion
            flash.scale.setScalar(0.1 + expansionCurve);

            // Non-linear fade (bright burst, then fade)
            material.opacity = progress < 0.3
                ? 1.0                           // Hold brightness
                : 1.0 - Math.pow((progress - 0.3) / 0.7, 1.5); // Accelerated fade

            // Chaotic color cycling through dissonant spectrum
            const colorProgress = progress * (colorSequence.length - 1);
            const colorIndex = Math.floor(colorProgress);
            const colorBlend = colorProgress - colorIndex;

            if (colorIndex < colorSequence.length - 1) {
                const color1 = new THREE.Color(colorSequence[colorIndex]);
                const color2 = new THREE.Color(colorSequence[colorIndex + 1]);
                material.color = color1.lerp(color2, colorBlend);
            } else {
                material.color.setHex(colorSequence[colorSequence.length - 1]);
            }

            // Add flicker/chaos effect during the flash
            const flicker = 1.0 + Math.sin(performance.now() * 0.05) * 0.15;
            material.opacity *= flicker;

            requestAnimationFrame(animateFlash);
        } else {
            material.opacity = 0;
            flash.scale.set(0.1, 0.1, 0.1);
        }
    }

    animateFlash();
}

console.log("🔄 archetypeMorph.js ready - Chestahedron ↔ Bell transformation system loaded");
