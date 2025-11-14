console.log("🎯 state.js loaded");

// ============================================================================
// GLOBAL CONSTANTS - MMPA Unified Theory
// ============================================================================

/**
 * Universal constants for the MMPA system
 * φ (Phi) serves as the non-arbitrary coherence threshold based on
 * Dan Winter's Phase Conjugation theory
 */
export const GLOBAL_CONSTANTS = {
  GOLDEN_RATIO_PHI: 1.61803398875,    // φ - The coherence threshold
  INVERSE_PHI: 0.61803398875,         // 1/φ
  ACTIVITY_FLOOR: 0.5                 // Minimum flux for active state evaluation
};

// ============================================================================
// APPLICATION STATE
// ============================================================================

// Centralized application state for modular signal routing
export const state = {
  // Geometry transformations
  rotationX: 0,  // Base rotation speed X - Start at 0 to prevent motion before audio
  rotationY: 0,  // Base rotation speed Y - Start at 0 to prevent motion before audio
  scale: 1.0,       // Global scale multiplier

  // Morph target weights (normalized 0-1, auto-normalized if sum > 1)
  morphWeights: {
    cube: 1.0,      // Start with cube visible
    sphere: 0.0,
    pyramid: 0.0,
    torus: 0.0,
  },

  // Phase 11.2: Additive audio morphing (base + audio modulation)
  morphBaseWeights: [0.0, 1.0, 0.0, 0.0],  // [sphere, cube, pyramid, torus] - persistent manual values
  morphAudioWeights: [0.0, 0.0, 0.0, 0.0], // Audio modulation deltas (applied additively)
  morphBaseFrozen: false,                   // Phase 11.4.3E: Freeze flag - prevents morphBaseWeights updates when audio OFF

  // Visual properties
  color: "#00ff00",  // Current geometry color (legacy)
  hue: 120,          // Current hue in degrees (0-360)
  idleSpin: false,    // Enable/disable idle rotation - Start disabled to prevent motion before audio

  // Phase 11.6.0: Image/Video texture system
  texture: null,            // THREE.Texture or THREE.VideoTexture loaded from image/video
  videoElement: null,       // Phase 13.6.1: Video element reference for cleanup
  useTextureOnMorph: false,  // Toggle to apply texture to morph shape
  useBackgroundImage: false, // Phase 11.6.1: Toggle to show image/video as background
  backgroundScale: 1.0,      // Phase 11.7.50: Background image scale (0.5-2.0)

  // Phase 13.6.2: Skybox system
  useSkybox: false,         // Toggle skybox mode (6-panel cube vs flat background)
  skyboxRenderMode: '360',  // Phase 13.30: Render mode: 'per-panel' (6 faces) or '360' (equirectangular panorama)
  skyboxFaceIndex: 4,       // Selected face (0=right, 1=left, 2=top, 3=bottom, 4=front, 5=back)
  skyboxTextures: [null, null, null, null, null, null], // Textures for each face [right, left, top, bottom, front, back]
  skyboxVideoElements: [null, null, null, null, null, null], // Video elements for each face (for cleanup)

  // Phase 11.2.1: Per-layer color system (base + audio additive)
  colorLayers: {
    geometry: {
      baseColor: "#00ff00",
      audioColor: "#ff0000",
      audioIntensity: 0.5
    },
    vessel: {
      baseColor: "#00ff00",
      audioColor: "#00ffff",
      audioIntensity: 0.3
    },
    particles: {
      baseColor: "#ffff00",
      audioColor: "#ff00ff",
      audioIntensity: 0.7
    },
    shadows: {
      baseColor: "#000000",
      audioColor: "#333333",
      audioIntensity: 0.2
    }
  },

  // Audio-reactive values (normalized 0-1)
  audio: {
    bass: 0.0,       // Low frequency (20-250Hz)
    mid: 0.0,        // Mid frequency (250-2000Hz)
    treble: 0.0,     // High frequency (2000-8000Hz)
    enabled: false,  // Audio reactivity enabled
    sensitivity: 1.0, // Audio sensitivity multiplier
    audioGain: 1.0,  // Phase 13.30: Master reactivity multiplier
    autoTone: true,  // Phase 13.30: Auto test tone on silent boot
  },

  // Phase 13.30: UI configuration
  ui: {
    projectorMode: false  // Projector mode toggle
  },

  // Audio reactivity toggle
  audioReactive: false,

  // Phase 13.5.2: Input source for modulation (audio or MIDI)
  inputSource: 'audio',  // 'audio' | 'midi'

  // Phase 13.6.0: Acid Empire background visual system
  acidEmpire: {
    enabled: false,           // Enable Acid Empire mode
    scrollSpeedX: 0.0,        // Horizontal scroll speed
    scrollSpeedY: 0.0,        // Vertical scroll speed
    shapeMorph: 0.55,         // Shape complexity/scale
    colorShift: 0.0,          // Hue shift (0-1)
    colorDrive: 1.0,          // Color intensity
    glitchIntensity: 0.0,     // VHS glitch amount
    portalWarp: 0.0,          // Radial distortion
    sphereScale: 1.0,         // Sphere shrink effect
    bassIntensity: 1.0,       // Bass sensitivity multiplier
    // Audio reactivity parameters
    audioSphereEnabled: true,    // Enable audio-reactive sphere shrink
    audioSphereAmount: 0.3,      // How much audio affects sphere (0-1)
    audioSphereSmoothing: 0.7,   // Smoothing for sphere shrink (0-0.95)
    audioColorAmount: 0.5,       // How much frequency affects color (0-2)
    audioColorSmoothing: 0.85,   // Smoothing for color shift (0-0.95, high = melody tracking)
  },

  // Phase 13.29: Hyperbolic Tiling background visual system
  hyperbolicTiling: {
    enabled: false,           // Enable Hyperbolic Tiling mode
    patternScale: 4.0,        // Pattern zoom/scale
    panX: 0.0,                // Horizontal pan offset
    panY: 0.0,                // Vertical pan offset
    rotationSpeed: 0.1,       // Pattern rotation speed
    iterations: 25,           // Detail level (5-50)
    densityScale: 1.0,        // Density/complexity multiplier
    colorHueShift: 0.0,       // Hue shift (0-1)
    gridIntensity: 0.4,       // Grid line intensity (0-1)
    audioReactivity: 1.0,     // Audio sensitivity multiplier
  },

  // Phase 13.7.0: Voxel Wave Floor system
  voxelWave: {
    enabled: false,           // Enable Voxel Wave mode
    amplitude: 0.28,          // Wave height amplitude
    frequency: 0.6,           // Wave frequency (spacing)
    speed: 1.0,               // Animation speed
    cellSize: 1.0,            // Voxel cell size
    baseHeight: 0.35,         // Base voxel height
    colorShift: 0.0,          // Hue shift (0-1)
    mistEnabled: true,        // Enable mist/atmosphere effect (default ON)
    mistDensity: 1.0,         // Mist particle density multiplier (0.1-3.0)
    mistSpeed: 1.0,           // Mist motion speed multiplier (0.1-5.0)
    mistRenderMode: 'particles', // Mist rendering mode: 'particles' | 'planes'
    audioReactive: false,     // Enable audio reactivity for voxel wave
  },

  // Luminous Tessellation system - HDR Voronoi geometric patterns
  luminousTessellation: {
    enabled: false,           // Enable Luminous Tessellation mode
    scale: 3.0,               // Pattern scale (1.0-10.0)
    speed: 0.5,               // Animation speed (0.1-2.0)
    complexity: 0.5,          // Pattern complexity/detail (0.0-1.0)
    colorShift: 0.0,          // Hue shift (0.0-1.0)
    luminosity: 1.5,          // HDR brightness (0.5-3.0)
    contrast: 1.2,            // Color contrast (0.5-2.0)
    audioIntensity: 1.0,      // Audio reactivity intensity (0.0-3.0)
    waveAmplitude: 0.0,       // Wave depth/intensity (0.0-2.0)
    waveFrequency: 2.0,       // Wave frequency/ripples (0.5-5.0)
    morphIntensity: 0.0,      // Geometry morphing/mutation (0.0-1.0)
  },

  // Sacred Geometry system - Egyptian pyramids with parallax scrolling
  sacredGeometry: {
    enabled: false,           // Enable Sacred Geometry mode
    scrollSpeed: 0.0,         // Parallax scroll speed (0.0-1.0) - default 0 for static scene
    layerCount: 3.0,          // Number of parallax layers (1.0-4.0)
    colorShift: 0.0,          // Hue shift (0.0-1.0)
    symbolDensity: 0.5,       // Symbol density - pyramids/eyes/hieroglyphs (0.0-1.0)
    glowIntensity: 1.0,       // Glow/bloom intensity (0.0-3.0)
    pyramidScale: 2.0,        // Pyramid pattern scale (0.5-5.0)
    audioIntensity: 1.0,      // Audio reactivity intensity (0.0-3.0)
    dancingOutline: false,    // Audio-reactive dancing outline effect
  },

  // Fractal system - Mandelbrot/Julia sets
  fractals: {
    enabled: false,           // Enable Fractal mode
    zoom: 2.5,                // Zoom level (0.1-10.0)
    panX: 0.0,                // Pan X (-2.0 to 2.0)
    panY: 0.0,                // Pan Y (-2.0 to 2.0)
    maxIterations: 100,       // Detail/quality (10-200)
    colorShift: 0.0,          // Color cycling (0.0-1.0)
    juliaMode: false,         // Toggle Julia set mode
    juliaCx: -0.7,            // Julia constant X (-2.0 to 2.0)
    juliaCy: 0.27,            // Julia constant Y (-2.0 to 2.0)
    audioIntensity: 1.0,      // Audio reactivity (0.0-3.0)
  },

  // Vessel system
  vessel: {
    opacity: 0.5,
    scale: 1.0,
    color: "#00ff00",
    enabled: true,
    spinEnabled: false,     // NEW
    spinSpeed: 0.0035,      // NEW (radians per frame approx; ~0.2°/frame @60fps) - legacy Y-axis
    spinSpeedX: 0.0,        // NEW (X-axis spin speed)
    spinSpeedY: 0.0,        // NEW (Y-axis spin speed)
    spinSpeedZ: 0.0,        // NEW (Z-axis spin speed)
    scaleMultiplier: 1.2,   // NEW (adaptive scaling margin)
    layout: 'lattice',      // NEW (orbital layout: 'lattice' | 'hoops' | 'shells')
    layoutIndex: 0,         // NEW (layout index for MIDI cycling: 0=lattice, 1=hoops, 2=shells)
    audioSmoothing: 0.7,    // NEW (audio smoothing factor)
    hueShiftRange: 20,      // NEW (hue shift range in degrees)
    mode: 'gyre',           // Phase 2.x: Vessel mode ('gyre' | 'conflat6')
    visible: false,         // Phase 12.0: Compass rings visibility (hidden by default)
    panelAudioReactive: false,  // Phase 13.2.0: Panel audio reactivity toggle
    hdrTexture: 'none',     // Phase 13.7.2: Conflat-6 HDR texture ('none' | 'metallic' | 'custom')
    customTexture: null     // Phase 13.7.2: Custom uploaded texture for HDR mode
  },

  // Particle system
  particles: {
    enabled: true,
    count: 5000,         // Phase 4.4: default (was 1000)
    minCount: 1000,      // Phase 4.4: lower bound (was 100)
    maxCount: 10000,     // Phase 4.4: upper bound (was 5000)
    layout: "cube",      // 'cube' | 'sphere' | 'torus'
    hue: 0,              // Hue shift in degrees (0-360)
    size: 0.02,          // Phase 4.4: Particle size (was 0.15)
    minSize: 0.005,      // Phase 4.4: lower size bound (was 0.05)
    maxSize: 0.1,        // Phase 4.4: upper size bound (was 1.0)
    opacity: 0.5,        // Particle opacity (0.0-1.0)
    organicMotion: false,  // Enable organic motion with jitter
    organicStrength: 0.2,  // Phase 4.2: Organic wobble strength (0-1)
    audioReactiveHue: false,  // Enable audio-reactive hue cycling
    velocity: 0.05,      // Orbital speed factor (0.1-2.0) - legacy compatibility
    orbitalSpeed: 0.05,  // Phase 4.2a: Gentle start (was 0.8)
    motionSmoothness: 0.5,  // Motion damping factor (0-1, higher = smoother)
    trailEnabled: false,    // Phase 2.3.2A: Line trails (InstancedMesh segments)
    trailLength: 0,         // Phase 2.3.2A: Trail length in frames (0-10)
    trailOpacity: 0.3,      // Phase 2.3.2A: Trail line opacity
    trailFade: 1.0,         // Phase 2.3.2C: Trail fade strength
    trailAudioReactive: false,  // Phase 2.3.2D: Audio-reactive trail length
    trailLengthMin: 2,      // Phase 2.3.2D: Min trail length for audio reactivity
    trailLengthMax: 10      // Phase 2.3.2D: Max trail length for audio reactivity
  },

  // Dual Trail System: Motion Trails (postprocessing blur)
  motionTrailsEnabled: false,     // AfterimagePass toggle
  motionTrailIntensity: 0.96,     // Blur damp value (0.85-0.99)
  // Backward compatibility
  particlesEnabled: true,
  particlesCount: 5000, // Phase 4.4: matches new default
  particlesMotion: {
    velocity: 0.5,   // base drift speed multiplier (HUD slider: 0.1–2.0)
    spread: 1.0,     // spatial spread multiplier (HUD slider: 0.1–2.0)
  },

  // Phase 11.7: Particle motion debug controls
  particleDensity: 2000,
  particleSize: 0.1,
  particleMotionStrength: 0,  // Start at 0 - prevents motion before audio
  useAudioJitter: true,

  // Phase 11.7.1: Emoji particles toggle
  useEmojiParticles: false,

  // Phase 11.7.15: Emoji Mixer streams
  emojiStreams: [],

  // Phase 11.7.16: Emoji Sequencer & Timeline
  emojiSequencer: {
    enabled: false,
    bpm: 120,
    currentBeat: 0,
    patterns: {
      // Example: { "🍕": [1,0,1,0,1,0,1,0], "🌶️": [0,1,0,1,0,1,0,1] }
    },
    timelineLength: 16 // beats
  },

  // Phase 11.7.17: Emoji Pattern Banks
  emojiBanks: [
    // Array of 8 banks: { name: "Pizza Storm", streams: [...], patterns: {...}, bpm: 120, timelineLength: 16 }
    null, null, null, null, null, null, null, null
  ],
  currentBank: null, // Currently loaded bank index (0-7)

  // Phase 11.7.18: Emoji Physics & Interaction
  emojiPhysics: {
    mode: 'none', // 'none', 'gravity', 'orbit', 'repulsion'
    gravityStrength: 0.01,
    orbitStrength: 0.005,
    repulsionStrength: 0.02,
    collisionEnabled: true,
    audioModulation: true,
    mouseInteraction: false
  },

  // Phase 11.7.19: Emoji Particle Fusion & Clusters
  emojiFusion: {
    enabled: false,
    threshold: 1.0 // distance threshold for fusion trigger
  },

  // Phase 11.7.20: Emoji Constellations & Symbolic Geometry
  emojiConstellations: {
    type: 'None', // 'None', 'Line', 'Triangle', 'Star', 'Spiral', 'CircleOf5ths', 'Platonic', 'Custom'
    customPattern: null, // Custom JSON pattern data
    scale: 5.0, // Constellation scale factor
    rotation: 0, // Current rotation angle (radians)
    rotationSpeed: 0.01, // Rotation speed
    audioSync: true, // Sync rotation/pulse with audio
    beatSync: false // Sync with sequencer beats
  },

  // Phase 11.7.31: Mandala HUD controls (alias for emojiMandala)
  mandala: {
    enabled: false,
    ringCount: 6,     // HUD-friendly alias for rings (3-12)
    symmetry: 6,      // Fold symmetry (2-12)
    audioReactive: false,  // Audio reactivity toggle
    useCustomImage: false, // Phase 11.7.50: Toggle between emoji and custom image
    customImage: null,     // Phase 11.7.50: Custom uploaded texture (data URL)
    customImageName: null  // Phase 11.7.50: Filename of uploaded image
  },

  // Phase 11.7.21: Emoji Mandalas & Layered Symmetry
  emojiMandala: {
    enabled: false,
    rings: 3, // Number of concentric rings (1-12) - Phase 11.7.29: expanded range
    symmetry: 6, // Fold symmetry (3-24) - Phase 11.7.29: expanded range
    layout: ['🍕', '🌶️', '🍄'], // Emoji per ring (center → outer)
    emoji: '🍕', // Phase 11.7.29: Current primary emoji for mandala
    ringRadii: [0, 2, 4, 6, 8, 10], // Base radius for each ring
    rotation: 0, // Global rotation angle
    rotationSpeed: 0.02, // Base rotation speed
    audioModulation: true, // Audio affects rotation speed
    layeredAudio: true, // Different rings react to different bands (bass/mid/treble)
    layoutMode: 'radial', // Phase 11.7.26: 'radial' | 'spiral' | 'grid'

    // Phase 11.7.27: Audio-reactive mandala
    mandalaAudioReactive: true, // Mandala pulses with audio
    mandalaSensitivity: 1.0, // Audio sensitivity (0-2.0, default 1.0 = 100%)
    radiusPulse: 0, // Current radius pulse amount (calculated)
    anglePulse: 0, // Current angle twist amount (calculated)

    // Phase 11.7.22: Musical Scale Integration
    musicalMode: false, // Enable musical scale mapping
    scale: 'Major', // 'Major', 'Minor', 'Pentatonic', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian'
    rootNote: 60, // MIDI note number for root (C4 = 60)
    noteToEmoji: {}, // Maps MIDI note → emoji (dynamically populated)
    activeNotes: new Set(), // Currently playing MIDI notes
    notePulse: {}, // Maps note number → pulse intensity (0-1)

    // Phase 11.7.23: Interactive Performance Controls
    performanceMode: false, // Enable live performance controls
    ringRotationSpeeds: [0, 0.01, 0.015, 0.02, 0.025, 0.03], // Per-ring rotation speeds
    differentialRotation: true, // Each ring rotates independently
    scaleSequence: ['Major', 'Dorian', 'Mixolydian', 'Phrygian'], // Scale progression
    scaleSequenceIndex: 0, // Current scale in sequence
    scaleSequenceEnabled: false, // Auto-advance through scales
    scaleSequenceInterval: 4000, // Ms between scale changes
    lastScaleChange: 0, // Timestamp of last scale change
    midiMappings: {
      symmetry: 20, // CC20 → symmetry (2-12)
      ringCount: 21, // CC21 → ring count (1-8)
      rotationSpeed: 22, // CC22 → global rotation speed
      scaleSequence: 23 // CC23 → advance scale sequence
    }
  },

  // Lighting system
  lighting: {
    ambientIntensity: 0.4,
    directionalIntensity: 1.0,
    directionalAngleX: -45,
    directionalAngleY: 45,
  },

  // Preset system
  presets: [],

  // Morph state (for transitions and blending)
  morphState: {
    current: 'cube',
    previous: 'cube',
    progress: 0,
    isTransitioning: false,
    targets: ['cube', 'sphere', 'pyramid', 'torus']
  },

  // Shadows configuration
  shadows: {
    enabled: true,
    ground: true,
    backdrop: true,
    opacity: 0.25,
    color: '#000000'
  },

  // Phase 2.3.5/6: Shadow Box configuration
  shadowBox: {
    threshold: 0.5,
    gain: 1.0,
    bgColor: '#000000',
    fgColor: '#ffffff',
    palette: 'Manual'  // Phase 2.3.6: 'Manual' | 'Alchemy Gold' | 'Blake Indigo' | 'Cosmic White'
  },

  // Sprites configuration (disabled by default - legacy audio visualizer)
  sprites: {
    enabled: false,
    count: 200
  },

  // Wireframe overlay configuration
  wireframe: {
    enabled: true
  },

  // Phase 12.0: Geometry system (morph shape + textures)
  geometry: {
    skyboxMode: false,
    wireframe: false,
    platonicSolid: 'cube',      // Phase 13.5.1: Selected platonic solid
    renderMode: 'solid',         // Phase 13.5.1: 'solid', 'wireframe', or 'both'
    activeNotes: {},             // Phase 13.5.1: Active MIDI notes for morphing { noteId: { note, velocity } }
    morphInput: 'audio',         // Phase 13.5.2: Morph input source ('audio' | 'midi')
    faceTextures: {
      front: null,
      back: null,
      left: null,
      right: null,
      top: null,
      bottom: null
    }
  },

  // Debug visualization options (OFF by default)
  debug: {
    showWireframe: false,
    showRibbon: false
  },

  // MMPA Feature Extractor - The Six Universal Features
  // This is the empirical foundation - the "Ratio Engine"
  mmpaFeatures: {
    enabled: false,  // Toggle feature extraction system
    source: 'dummy', // 'dummy', 'microphone', 'file', 'simulation'
    mmpaParticleControl: false,  // TRUE = particles use ONLY MMPA forces, FALSE = raw audio + MMPA

    // IDENTITY - "What is it?" (Frequency/pitch)
    identity: {
      fundamentalFreq: 440.0,      // Hz
      harmonics: [440, 880, 1320], // Detected frequencies
      strength: 0.0                // Pitch clarity (0-1) - 0 when no audio present
    },

    // RELATIONSHIP - "How does it relate?" (Ratios/intervals)
    relationship: {
      ratios: ["2:1", "3:2", "4:3"], // Interval ratios
      consonance: 0.72,               // "In-tune" measure (0-1)
      complexity: 3                   // Number of simultaneous intervals
    },

    // COMPLEXITY - "How dense is it?" (Spectral centroid)
    complexity: {
      centroid: 1500.0,    // Hz - spectral center of mass
      bandwidth: 2000.0,   // Hz - spread of energy
      brightness: 0.68     // Normalized centroid (0-1)
    },

    // TRANSFORMATION - "How fast is it changing?" (Flux/velocity)
    // NOTE: Defaults are 0 to prevent motion when no audio present
    transformation: {
      flux: 0,             // Rate of spectral change (0-1)
      velocity: 0,         // Speed of change
      acceleration: 0      // Rate of change of velocity
    },

    // ALIGNMENT - "How synchronized is it?" (Coherence/phase)
    alignment: {
      coherence: 0.78,     // Phase alignment (0-1)
      stability: 0.65,     // Consistency over time (0-1)
      synchrony: 0.82      // Temporal alignment (0-1)
    },

    // POTENTIAL - "How unpredictable is it?" (Entropy/freedom)
    potential: {
      entropy: 0.55,           // Spectral entropy (0-1)
      unpredictability: 0.48,  // Deviation from patterns
      freedom: 0.60            // Degrees of freedom
    }
  },

  // Phase 11.2.8: Preset interpolation system
  interpolation: {
    enabled: true,          // User toggle for interpolation
    active: false,          // Currently interpolating
    duration: 2000,         // Interpolation duration in ms
    startTime: null,        // performance.now() when interpolation started
    startState: null,       // Snapshot of state at interpolation start
    targetState: null       // Target preset state to interpolate towards
  }
};

// Phase 11.3.0: Morph Chain
export const morphChain = {
  presets: [],       // array of preset names (strings)
  currentIndex: 0,   // index into presets (target)
  active: false,     // chain running?
  duration: 2000,    // ms per step; mirrors interpolation.duration by default
  // Phase 11.3.1: Enhanced features
  loop: false,       // repeat chain continuously
  shuffle: false,    // randomize order each run
  savedChains: [],   // array of saved chain configs: { name, presets, duration, loop, shuffle }
  currentChainName: null,  // name of currently running saved chain (if any)
  // Phase 11.3.2: Progress tracking
  stepStartTime: null,  // performance.now() when current step started
  // Phase 11.4.0: Playback controls
  paused: false,     // chain paused?
  pausedAt: null,    // performance.now() when paused
  pausedProgress: 0  // progress (0-1) when paused
};

// Phase 11.5.0: Flag to suppress redundant normalize logs
let normalizeLogged = false;

// Utility function to normalize morph weights
export function normalizeMorphWeights() {
  const weights = state.morphWeights;
  const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  if (total > 1.0) {
    // Auto-normalize if sum exceeds 1.0
    Object.keys(weights).forEach(target => {
      weights[target] = weights[target] / total;
    });
    // Phase 11.5.0: Log only once when normalization starts
    if (!normalizeLogged) {
      console.log("🎯 Morph weights auto-normalized (sum exceeded 1.0)");
      normalizeLogged = true;
    }
  } else {
    // Reset flag when weights are back in valid range
    normalizeLogged = false;
  }
}

// Utility function to set individual morph weight
export function setMorphWeight(target, weight) {
  // Phase 11.4.3E: Freeze morphBaseWeights when audio OFF
  if (!state.audioReactive) {
    // 🚫 Audio OFF — freeze morphBaseWeights (no overwrites)
    if (!state.morphBaseFrozen) {
      console.log("🛑 Audio OFF — morphBaseWeights frozen at", state.morphBaseWeights);
      state.morphBaseFrozen = true;
    }
    return; // Skip updating while frozen
  }

  // 🎵 Audio ON — allow updates + normalization
  state.morphBaseFrozen = false;

  if (state.morphState.targets.includes(target)) {
    state.morphWeights[target] = Math.max(0, Math.min(1, weight));
    normalizeMorphWeights();

    // Phase 11.2: Sync to morphBaseWeights array [sphere, cube, pyramid, torus]
    const targetIndex = ['sphere', 'cube', 'pyramid', 'torus'].indexOf(target);
    if (targetIndex >= 0) {
      state.morphBaseWeights[targetIndex] = state.morphWeights[target];
      // Phase 11.4.3D: Trace morphBaseWeights update
      console.log("📦 morphBaseWeights updated (setMorphWeight)", state.morphBaseWeights);
    }
  } else {
    console.warn(`🎯 Invalid morph target: ${target}`);
  }
}

// Utility function to set all morph weights at once
export function setMorphWeights(weights) {
  // Phase 11.4.3E: Freeze morphBaseWeights when audio OFF
  if (!state.audioReactive) {
    // 🚫 Audio OFF — freeze morphBaseWeights (no overwrites)
    if (!state.morphBaseFrozen) {
      console.log("🛑 Audio OFF — morphBaseWeights frozen at", state.morphBaseWeights);
      state.morphBaseFrozen = true;
    }
    return; // Skip updating while frozen
  }

  // 🎵 Audio ON — allow updates + normalization
  state.morphBaseFrozen = false;

  state.morphState.targets.forEach(target => {
    if (weights[target] !== undefined) {
      state.morphWeights[target] = Math.max(0, Math.min(1, weights[target]));
    }
  });
  normalizeMorphWeights();

  // Phase 11.2: Sync to morphBaseWeights array [sphere, cube, pyramid, torus]
  state.morphBaseWeights = [
    state.morphWeights.sphere || 0,
    state.morphWeights.cube || 0,
    state.morphWeights.pyramid || 0,
    state.morphWeights.torus || 0
  ];
  // Phase 11.4.3D: Trace morphBaseWeights update
  console.log("📦 morphBaseWeights updated (setMorphWeights)", state.morphBaseWeights);
}

// Utility function to get current morph weights
export function getMorphWeights() {
  return { ...state.morphWeights };
}

// Utility function to set color and update hue
export function setColor(color) {
  state.color = color;
  // Extract hue from hex color for consistency
  const r = parseInt(color.slice(1, 3), 16) / 255;
  const g = parseInt(color.slice(3, 5), 16) / 255;
  const b = parseInt(color.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  if (diff === 0) {
    state.hue = 0;
  } else if (max === r) {
    state.hue = ((g - b) / diff) * 60;
  } else if (max === g) {
    state.hue = ((b - r) / diff + 2) * 60;
  } else {
    state.hue = ((r - g) / diff + 4) * 60;
  }

  if (state.hue < 0) state.hue += 360;
  state.hue = Math.round(state.hue);
}

// Utility function to set hue and update color
export function setHue(hue) {
  state.hue = hue % 360;

  // Convert HSL to hex (saturation 100%, lightness 50%)
  const h = state.hue / 360;
  const s = 1.0;
  const l = 0.5;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;

  let r, g, b;
  if (h < 1/6) { r = c; g = x; b = 0; }
  else if (h < 2/6) { r = x; g = c; b = 0; }
  else if (h < 3/6) { r = 0; g = c; b = x; }
  else if (h < 4/6) { r = 0; g = x; b = c; }
  else if (h < 5/6) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  state.color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Phase 11.2.1: Color blending utilities for per-layer additive colors
export function hexToRGB(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export function rgbToHex(rgb) {
  const r = Math.round(Math.max(0, Math.min(255, rgb.r)));
  const g = Math.round(Math.max(0, Math.min(255, rgb.g)));
  const b = Math.round(Math.max(0, Math.min(255, rgb.b)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Phase 11.2.1: Additive color blending
// final = base + (audio * intensity * audioLevel)
export function blendColors(baseHex, audioHex, intensity, audioLevel) {
  const baseRGB = hexToRGB(baseHex);
  const audioRGB = hexToRGB(audioHex);

  const contribution = intensity * audioLevel;
  const finalRGB = {
    r: baseRGB.r + (audioRGB.r * contribution),
    g: baseRGB.g + (audioRGB.g * contribution),
    b: baseRGB.b + (audioRGB.b * contribution)
  };

  return rgbToHex(finalRGB);
}

// Phase 11.2.8: Interpolation helper functions
// Linear interpolation between two values
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Interpolate between two hex colors
export function lerpColor(colorA, colorB, t) {
  const rgbA = hexToRGB(colorA);
  const rgbB = hexToRGB(colorB);

  const lerpedRGB = {
    r: lerp(rgbA.r, rgbB.r, t),
    g: lerp(rgbA.g, rgbB.g, t),
    b: lerp(rgbA.b, rgbB.b, t)
  };

  return rgbToHex(lerpedRGB);
}

// Interpolate between two arrays (for morphBaseWeights)
export function lerpArray(arrA, arrB, t) {
  return arrA.map((a, i) => lerp(a, arrB[i] || 0, t));
}

// Ease-in-out cubic easing function
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Phase 11.4.1: Baseline snapshot + reset
export const BASELINE = {
  rotationX: 0,  // No auto-rotation by default
  rotationY: 0,  // No auto-rotation by default
  scale: 1.0,
  morphBaseWeights: [0.0, 1.0, 0.0, 0.0], // [sphere, cube, pyramid, torus] - default cube
  colorLayers: JSON.parse(JSON.stringify(state.colorLayers)),
  vessel: { opacity: state.vessel?.opacity ?? 0.5 },
  shadows: { opacity: state.shadows?.opacity ?? 0.25 },
  particles: { opacity: state.particles?.opacity ?? 0.5 }
};

export function resetToBaseline() {
  // Stop any active interpolation/chain
  state.interpolation.active = false;
  morphChain.active = false;
  morphChain.paused = false;

  // Reset transform values
  state.rotationX = BASELINE.rotationX;
  state.rotationY = BASELINE.rotationY;
  state.scale = BASELINE.scale;

  // Reset morph weights
  state.morphBaseWeights = [...BASELINE.morphBaseWeights];
  // Phase 11.4.3D: Trace morphBaseWeights update
  console.log("📦 morphBaseWeights updated (resetToBaseline)", state.morphBaseWeights);

  // Reset color layers
  state.colorLayers = JSON.parse(JSON.stringify(BASELINE.colorLayers));

  // Reset opacities
  state.vessel.opacity = BASELINE.vessel.opacity;
  state.shadows.opacity = BASELINE.shadows.opacity;
  state.particles.opacity = BASELINE.particles.opacity;

  console.log("♻️ State reset to baseline");
}

// ---- Phase 11.4.2S: stable audio gate -------------------------------
// ---- Phase 11.4.3: Added debug logging for audio gate validation ----
let lastAudioReactiveLog = true; // Track state changes

export function getEffectiveAudio() {
  const { audioReactive, audio } = state;

  // Phase 11.4.3: Debug log when audioReactive changes to OFF
  if (!audioReactive && lastAudioReactiveLog !== false) {
    console.log("🎵 Audio-reactive OFF — returning zero weights");
    lastAudioReactiveLog = false;
  } else if (audioReactive && lastAudioReactiveLog !== true) {
    console.log("🎵 Audio-reactive ON — resuming audio response");
    lastAudioReactiveLog = true;
  }

  if (!audioReactive) {
    return { bass: 0, mid: 0, treble: 0, level: 0 };
  }

  if (!audio || Number.isNaN(audio.bass) || Number.isNaN(audio.mid) || Number.isNaN(audio.treble)) {
    return { bass: 0, mid: 0, treble: 0, level: 0 };
  }

  return {
    bass: audio.bass ?? 0,
    mid: audio.mid ?? 0,
    treble: audio.treble ?? 0,
    level: audio.level ?? ((audio.bass ?? 0) + (audio.mid ?? 0) + (audio.treble ?? 0)) / 3,
  };
}
// ---------------------------------------------------------------------

// Phase 11.7.50: Listen for mandala image upload events
window.addEventListener('mandala:imageSelected', (e) => {
  const { url, name } = e.detail;
  state.mandala.useCustomImage = true;
  state.mandala.customImage = url;
  state.mandala.customImageName = name;
  console.log(`🎯 State updated: mandala custom image → ${name} (exclusive mode ON)`);
});

window.addEventListener('mandala:imageCleared', () => {
  state.mandala.useCustomImage = false;
  state.mandala.customImage = null;
  state.mandala.customImageName = null;
  console.log('🎯 State updated: mandala custom image cleared (returning to emoji)');
});

// Phase 13.31: Ensure defaults exist
state.audio = state.audio || {};
if (state.audio.audioGain == null) state.audio.audioGain = 1.0;

console.log("🎯 State initialized:", state);
