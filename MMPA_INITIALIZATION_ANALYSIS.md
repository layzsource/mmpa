# MMPA Visualization System - Complete Initialization Flow Analysis

## Executive Summary

The MMPA visualization system is a complex, multi-layered framework that initializes in a carefully orchestrated sequence from application startup through real-time audio feature extraction and visual rendering. The system supports multiple data sources (audio, financial, simulated) and manages particle motion through five independent force sources.

---

## 1. STATE INITIALIZATION

### 1.1 MMPA Features State (`state.js`)

**File:** `/src/state.js` (Lines 1-506)

**Initial Values for `state.mmpaFeatures`:**
```javascript
mmpaFeatures: {
  enabled: false,                    // Feature extraction OFF by default
  source: 'dummy',                   // Options: 'dummy', 'microphone', 'file', 'simulation'
  mmpaParticleControl: false,        // Particles use raw audio, not MMPA forces
  
  // IDENTITY - "What is it?" (Frequency/pitch)
  identity: {
    fundamentalFreq: 440.0,          // Default concert A (Hz)
    harmonics: [440, 880, 1320],     // Detected frequencies
    strength: 0.0                    // Pitch clarity (0-1) - 0 when silent
  },
  
  // RELATIONSHIP - "How does it relate?" (Ratios/intervals)
  relationship: {
    ratios: ["2:1", "3:2", "4:3"],   // Interval ratios
    consonance: 0.72,                // "In-tune" measure (0-1)
    complexity: 3                    // Number of simultaneous intervals
  },
  
  // COMPLEXITY - "How dense is it?" (Spectral centroid)
  complexity: {
    centroid: 1500.0,                // Hz - spectral center of mass
    bandwidth: 2000.0,               // Hz - spread of energy
    brightness: 0.68                 // Normalized centroid (0-1)
  },
  
  // TRANSFORMATION - "How fast is it changing?" (Flux/velocity)
  transformation: {
    flux: 0.42,                      // Rate of spectral change (0-1)
    velocity: 0.15,                  // Speed of change
    acceleration: 0.03               // Rate of change of velocity
  },
  
  // ALIGNMENT - "How synchronized is it?" (Coherence/phase)
  alignment: {
    coherence: 0.78,                 // Phase alignment (0-1)
    stability: 0.65,                 // Consistency over time (0-1)
    synchrony: 0.82                  // Temporal alignment (0-1)
  },
  
  // POTENTIAL - "How unpredictable is it?" (Entropy/freedom)
  potential: {
    entropy: 0.55,                   // Spectral entropy (0-1)
    unpredictability: 0.48,          // Deviation from patterns
    freedom: 0.60                    // Degrees of freedom
  }
}
```

### 1.2 Particle-Related State

**File:** `/src/state.js` (Lines 222-246)

```javascript
particles: {
  enabled: true,
  count: 5000,                       // Phase 4.4: Default
  minCount: 1000,
  maxCount: 10000,
  layout: "cube",                    // 'cube' | 'sphere' | 'torus'
  hue: 0,                            // Hue shift in degrees (0-360)
  size: 0.02,                        // Particle size
  minSize: 0.005,
  maxSize: 0.1,
  opacity: 0.5,                      // Particle opacity (0.0-1.0)
  organicMotion: false,              // Enable organic motion with jitter
  organicStrength: 0.2,              // Organic wobble strength (0-1)
  audioReactiveHue: false,           // Audio-reactive hue cycling
  velocity: 0.05,                    // Orbital speed factor
  orbitalSpeed: 0.05,                // Gentle start
  motionSmoothness: 0.5,             // Motion damping factor
  trailEnabled: false,               // Line trails (InstancedMesh segments)
  trailLength: 0,                    // Trail length in frames (0-10)
  trailOpacity: 0.3,                 // Trail line opacity
  trailFade: 1.0,                    // Trail fade strength
  trailAudioReactive: false,         // Audio-reactive trail length
  trailLengthMin: 2,                 // Min trail length for audio reactivity
  trailLengthMax: 10                 // Max trail length for audio reactivity
}
```

### 1.3 Audio-Related State

**File:** `/src/state.js` (Lines 85-94)

```javascript
audio: {
  bass: 0.0,                         // Low frequency (20-250Hz)
  mid: 0.0,                          // Mid frequency (250-2000Hz)
  treble: 0.0,                       // High frequency (2000-8000Hz)
  enabled: false,                    // Audio reactivity enabled
  sensitivity: 1.0,                  // Audio sensitivity multiplier
  audioGain: 1.0,                    // Phase 13.30: Master reactivity multiplier
  autoTone: true,                    // Phase 13.30: Auto test tone on silent boot
}

audioReactive: false,                // Global toggle
```

### 1.4 Archetype State

**File:** `/src/archetypeRecognizer.js` (Lines 83-107)

```javascript
let recognitionState = {
  currentArchetype: ARCHETYPES.NEUTRAL_STATE,
  previousArchetype: null,
  confidence: 0,
  lastStabilityMetric: 0,
  lastFluxMetric: 0,
  lastPi: 0,                         // ANLG Layer: Chaos score
  lastPhi: 0,                        // ANLG Layer: Harmony score
  lastPhiOverPi: 0,                  // ANLG Layer: φ/π ratio
  transitionInProgress: false,
  lastTransitionTime: 0,
  history: [],                       // Keep last 60 recognitions (1 second @60fps)
  
  // Archetype types (ANLG-based):
  // PURE_HARMONY (φ/π > 3.0)
  // HIGH_HARMONY (φ/π 1.5-3.0)
  // BALANCED (φ/π 0.8-1.5)
  // HIGH_CHAOS (φ/π 0.3-0.8)
  // PURE_CHAOS (φ/π < 0.3)
  // NEUTRAL_STATE (Silence)
}
```

---

## 2. STARTUP SEQUENCE

### 2.1 Main.js Initialization Order

**File:** `/src/main.js`

1. **Line 74-76:** Feature modules imported
   - `initCapture()` from `./features/capture.js`
   - `initHotkeys()` from `./features/hotkeys.js`
   - `initProjectorMode()` from `./features/projectorMode.js`

2. **Line 79:** HUD initialization
   ```javascript
   initHUD();  // Line 192
   ```

3. **Line 80-81:** MIDI initialization
   ```javascript
   initMIDI();              // Line 194
   initMMPAMIDI();          // Line 199 (MMPA-specific MIDI)
   ```

4. **Line 92:** Preset system
   ```javascript
   initPresets();           // Line 207
   createDefaultPresets();  // Line 208
   ```

5. **Line 93:** Audio initialization
   ```javascript
   initAudio();             // Line 220
   ```

6. **Line 175:** Audio router initialization
   ```javascript
   initAudioRouter();       // Line 223
   ```

7. **Line 82:** Geometry initialization
   ```javascript
   const morphShape = initMorphShape(scene);  // Line 241
   ```

8. **Line 88:** Visual/background system initialization
   ```javascript
   initVisual(scene);       // Line 255
   ```

9. **Line 85:** Particle system initialization
   ```javascript
   initParticles(scene, state.particlesCount);  // Line 307
   ```
   - Default count: 5000 particles
   - Uses InstancedMesh with WebGL instancing
   - Pre-allocates drift offset calculations (sine/cosine jitter)

10. **Line 87:** Vessel system initialization
    ```javascript
    initVessel(scene, renderer, camera);  // Line 258
    ```

11. **Lines 318-327:** Emoji system initialization
    ```javascript
    emojiStreamManager = new EmojiStreamManager(scene);
    emojiSequencer = new EmojiSequencer(emojiStreamManager);
    emojiBankManager = new EmojiPatternBankManager(emojiStreamManager, emojiSequencer);
    ```

12. **Lines 330-342:** Mandala controller initialization
    ```javascript
    mandalaController = new MandalaController(scene, {...});
    ```

### 2.2 Timing of Key Initializations

| Component | File | Line | When Called |
|-----------|------|------|------------|
| Visual System | `visual.js` | 1982 | main.js line 255, AFTER geometry |
| Particle System | `particles.js` | 1145 | main.js line 307, AFTER visual |
| Audio System | `audio.js` | 623 | main.js line 220, early (pre-visual) |
| Audio Router | `audioRouter.js` | 93 | main.js line 223, AFTER initAudio |
| Vessel | `vessel.js` | (init fn) | main.js line 258, AFTER geometry |

---

## 3. DEFAULT MMPA FEATURES (Fallback Values)

### 3.1 Fallback Creation When No Audio Exists

**Source File: `audioFeatureExtractor.js` (Lines 15-98)**

When audio signal is absent or silent, the system provides fallback MMPA feature values:

```javascript
// When audio data is missing or zero:
identity: {
  fundamentalFreq: 440,              // Default A note
  harmonics: [440, 880, 1320],       // Standard harmonics
  strength: rms || 0,                // Falls back to 0 if no RMS
  pitch: pitchStrength || 0          // Falls back to 0
}

relationship: {
  ratios: ["2:1", "3:2", "4:3"],     // Standard Western intervals
  consonance: Math.min(1,
    (spectralCentroid * 0.4) +       // If missing, spectralCentroid = 0.5
    ((1 - zcr) * 0.3) +              // If missing, zcr = 0.5 (neutral)
    (rms * 0.3)                      // If missing, rms = 0
  )
  // Result when silent: consonance ≈ 0.15
}
```

### 3.2 Fallback Values in Mapping Layer

**Source File: `mappingLayer.js` (Lines 27-200)**

The mapping layer applies NaN protection with sensible defaults:

```javascript
// IDENTITY Fallback
const safeFreq = (isNaN(freq) || freq <= 0) ? 440 : freq;
const safeStrength = isNaN(strength) ? 0.85 : strength;

// RELATIONSHIP Fallback
const safeConsonance = isNaN(consonance) ? 0.72 : consonance;
const safeComplexity = isNaN(complexity) ? 3 : complexity;

// COMPLEXITY Fallback
const safeCentroid = (isNaN(centroid) || centroid <= 0) ? 1500 : centroid;
const safeBandwidth = isNaN(bandwidth) ? 2000 : bandwidth;
const safeBrightness = isNaN(brightness_spectral) ? 0.68 : brightness_spectral;

// TRANSFORMATION Fallback
const safeFlux = isNaN(flux) ? 0.42 : flux;
const safeVelocity = isNaN(velocity) ? 0.15 : velocity;
const safeAcceleration = isNaN(acceleration) ? 0.03 : acceleration;

// ALIGNMENT Fallback
const safeCoherence = isNaN(coherence) ? 0.78 : coherence;
const safeStability = isNaN(stability) ? 0.65 : stability;
const safeSynchrony = isNaN(synchrony) ? 0.82 : synchrony;

// POTENTIAL Fallback
const safeEntropy = isNaN(entropy) ? 0.28 : entropy;
const safeUnpredictability = isNaN(unpredictability) ? 0.15 : unpredictability;
const safeFreedom = isNaN(freedom) ? 0.22 : freedom;
```

### 3.3 Initial Archetype State

**Source File: `archetypeRecognizer.js` (Lines 83-107)**

```javascript
currentArchetype: ARCHETYPES.NEUTRAL_STATE  // Starts in silence
previousArchetype: null
confidence: 0                                // No confidence initially
```

When audio begins or switches, archetype is determined by φ/π ratio thresholds:
- **NEUTRAL_STATE:** Silence (RMS < 0.01)
- **PURE_HARMONY:** φ/π > 3.0 (Ringing Bell)
- **HIGH_HARMONY:** φ/π 1.5-3.0 (Consonant)
- **BALANCED:** φ/π 0.8-1.5
- **HIGH_CHAOS:** φ/π 0.3-0.8
- **PURE_CHAOS:** φ/π < 0.3 (Wolf Fifth)

---

## 4. PARTICLE MOTION SOURCES

### 4.1 Source 1: Time-Based Animation (requestAnimationFrame)

**Source File: `geometry.js` (Lines 928-929)**

```javascript
function animate() {
  requestAnimationFrame(animate);
  // Frame-by-frame animation loop at ~60fps
  const deltaTime = morphClock.getDelta();
  // ... 150+ update calls per frame
}
```

**How particles use time:**
- Line 1021: `updateParticles(state.audioReactive, performance.now() * 0.001, mmpaVisuals)`
- Particle update receives elapsed time in seconds
- Used for orbital animation and drifting

### 4.2 Source 2: Noise Functions (Sine/Cosine Based)

**Source File: `particles.js` (Lines 685-746)**

#### Organic Drift (Sine+Cosine Jitter)
```javascript
// Lines 686-716: Layered organic motion
if (this.organicStrength > 0 && this.driftOffsets.length) {
  const off = this.driftOffsets[i];  // Per-particle phase offset
  
  // Primary (slow) layer - sine/cosine with phase offset
  const dx1 = Math.sin(t * fx + off.x) * off.ax;
  const dy1 = Math.cos(t * fy + off.y) * off.ay;
  const dz1 = Math.sin(t * fz + off.z) * off.az;
  
  // Secondary (faster) layer - 2x frequency for wobble
  const dx2 = Math.sin(t * fx * 2.3 + off.x * 1.7) * off.a2;
  const dy2 = Math.sin(t * fy * 2.1 + off.y * 1.3) * off.a2;
  const dz2 = Math.cos(t * fz * 2.4 + off.z * 1.9) * off.a2;
  
  // Combined and scaled
  tx += (dx1 + 0.4 * dx2) * driftScale;  // driftScale = organicStrength * 0.018
}
```

#### Noise Field Drift
```javascript
// Lines 727-731: Continuous sine-based noise
const noiseScale = motionStrength * 0.01;
tx += Math.sin(t * 0.3 + i * 0.17) * noiseScale;
ty += Math.cos(t * 0.4 + i * 0.23) * noiseScale;
tz += Math.sin(t * 0.35 + i * 0.29) * noiseScale;
```

### 4.3 Source 3: MMPA Feature-Driven Motion

**Source File: `geometry.js` (Lines 969-1022)**

```javascript
// Line 970: Map features to visual parameters
const mmpaVisuals = mapFeaturesToVisuals(state.mmpaFeatures);

// Line 994: Apply animation speed from TRANSFORMATION feature
const mmpaSpeed = mmpaVisuals?.animationSpeed || 1.0;  // 0.5x to 2.0x
const rotX = ((state.idleSpin ? 0.01 : 0) + state.rotationX) * mmpaSpeed;
const rotY = ((state.idleSpin ? 0.01 : 0) + state.rotationY) * mmpaSpeed;

// Lines 987-989: Apply entropy influence to geometry
if (state.mmpaFeatures.enabled) {
  const entropyInfluence = mmpaVisuals.particleRandomness * 0.01;
  morphMesh.rotation.z += entropyInfluence * (Math.random() - 0.5);
}
```

**MMPA mappings driving particles (from `mappingLayer.js`):**

| MMPA Feature | Visual Parameter | Particle Effect |
|--------------|------------------|-----------------|
| TRANSFORMATION.flux | animationSpeed | Speeds up/down orbital motion |
| COMPLEXITY.brightness | particleDensity | Increases/decreases active particles |
| COMPLEXITY.bandwidth | particleSpread | Spreads particles wider |
| RELATIONSHIP.consonance | geometricSymmetry | Adjusts symmetry order (3-12 fold) |
| POTENTIAL.entropy | particleRandomness | Adds chaos/jitter |
| ALIGNMENT.stability | formStability | Damping/smoothness |

### 4.4 Source 4: Audio-Driven Motion

**Source File: `particles.js` (Lines 733-746, 750-826)**

#### Audio Jitter Bursts
```javascript
// Lines 733-746: Velocity bursts on FFT peaks
const useJitter = state?.useAudioJitter ?? true;
if (useJitter && this.audioReactive && audioMix > 0.1) {
  const audioBoost = audioMix * 0.01;
  const burstAngle = (i * 0.37) % (Math.PI * 2);
  const burstX = Math.cos(burstAngle) * audioBoost;
  const burstY = Math.sin(burstAngle) * audioBoost;
  const burstZ = Math.sin(burstAngle * 0.7) * audioBoost;
  
  tx += burstX;
  ty += burstY;
  tz += burstZ;
}
```

#### Audio-Reactive Cymatic Patterns
```javascript
// Lines 748-768: Chladni plate resonance
if (this.chladniEnabled) {
  const m = this.chladniM + Math.floor(a.bass * 3);
  const n = this.chladniN + Math.floor(a.mid * 3);
  
  const chladniValue = Math.cos(n * Math.PI * x) * Math.cos(m * Math.PI * y) +
                      Math.cos(m * Math.PI * x) * Math.cos(n * Math.PI * y);
  
  const wavePhase = chladniValue * 5 + this.chladniPhase;
  const displacement = Math.sin(wavePhase) * 0.8 * (1 + audioMix);
  
  // Apply perpendicular displacement for wave effect
}

// Lines 770-790: Moiré interference patterns
if (this.moireEnabled) {
  const freq1 = 2.0 * this.moireScale;
  const pattern1 = Math.sin(tx * freq1) * Math.sin(ty * freq1);
  // ... interference calculation
  const radialDisplacement = interference * 1.2 * (1 + audioMix);
}

// Lines 792-826: Spectrogram tessellations (FFT → radial mandala)
if (this.spectrogramEnabled) {
  const radius = Math.sqrt(tx * tx + ty * ty);
  const theta = Math.atan2(ty, tx) + this.spectrogramRotation;
  const normalizedAngle = (theta + Math.PI) / (2 * Math.PI);
  const bandIndex = Math.floor(normalizedAngle * this.spectrogramBands);
  
  // Create radial rings and tessellation
  const attractionStrength = 0.5 * (1 + bandAmplitude * 2);
  tx += (targetX - tx) * attractionStrength * 0.02;
  ty += (targetY - ty) * attractionStrength * 0.02;
}
```

#### More Audio Patterns
- **Phase-shift interference** (Lines 828-866): Holographic depth effect
- **Spectral diffraction** (Lines 868-909): Rainbow prismatic dispersion

### 4.5 Source 5: Autonomous Behaviors

**Source File: `particles.js`**

#### Base Velocities
```javascript
// Lines 722-725: Persistent tiny velocities
tx += this.velocities[vi] * motionStrength;
ty += this.velocities[vi + 1] * motionStrength;
tz += this.velocities[vi + 2] * motionStrength;

// Initialized at construction (lines 252-256):
this.velocities[vi]     = (Math.random() - 0.5) * 0.002;
this.velocities[vi + 1] = (Math.random() - 0.5) * 0.002;
this.velocities[vi + 2] = (Math.random() - 0.5) * 0.002;
```

#### Orbital Motion
```javascript
// Particles orbit in layouts: 'cube', 'sphere', 'torus'
// Orbital speed controlled by: state.particles.orbitalSpeed (default 0.05)
// Layout determines initial position basin
```

#### Boundary Clamping
```javascript
// Lines 920-929: Keep particles within sphere
const maxRadius = 10;
const distSq = tx * tx + ty * ty + tz * tz;
if (distSq > maxRadius * maxRadius) {
  const dist = Math.sqrt(distSq);
  const scale = maxRadius / dist;
  tx *= scale; ty *= scale; tz *= scale;
}
```

---

## 5. AUDIO MODE STARTUP (hudFinancial.js Line 1034)

### 5.1 Audio Mode Initialization Sequence

**Source File: `hudFinancial.js` (Lines 201-220)**

```javascript
// Phase 13.27: Audio mode starter at hudFinancial.js:201
function startAudioMode() {
  if (audioUpdateInterval) return;  // Already running
  
  audioUpdateInterval = setInterval(() => {
    updateMMPAFeaturesFromAudio();   // Extract audio → MMPA features
  }, 16);  // ~60fps (16ms per frame)
  
  console.log("🎵 Audio mode started - MMPA features now based on audio");
}

function stopAudioMode() {
  if (audioUpdateInterval) {
    clearInterval(audioUpdateInterval);
    audioUpdateInterval = null;
  }
}
```

### 5.2 Audio Feature Extraction Pipeline

**Source File: `audioFeatureExtractor.js` (Lines 15-98)**

```javascript
// Main extraction function:
export function extractAudioMMPAFeatures(audioData) {
  const bands = audioData.bands || { bass: 0, mid: 0, treble: 0, level: 0 };
  const features = audioData.features || {};
  const spectrum = audioData.spectrum || [];
  
  // Calculate derived metrics
  const rms = features.rms || bands.level || 0;
  const spectralCentroid = features.spectralCentroid || 0.5;
  const zcr = features.zcr || 0.5;
  const spectralFlux = calculateSpectralFlux(spectrum);  // Audio change rate
  
  // Map to MMPA structure:
  return {
    enabled: true,
    source: 'audio',
    identity: { fundamentalFreq, harmonics, strength: rms, pitch: pitchStrength },
    relationship: { ratios, consonance, complexity },
    complexity: { centroid, bandwidth, brightness },
    transformation: { flux: spectralFlux, velocity, acceleration },
    alignment: { coherence, stability, synchrony },
    potential: { entropy, unpredictability, freedom }
  };
}
```

### 5.3 Audio System Integration

**Source File: `audio.js` (Lines 29-150)**

```javascript
class AudioCore {
  constructor() {
    // Phase 13.1 initialization
    this.ctx = null;               // AudioContext
    this.source = null;            // MediaStreamSource
    this.analyser = null;          // AnalyserNode
    this.inputGain = null;         // GainNode for metering
    this.stream = null;            // MediaStream
    this.fftSize = 2048;           // FFT resolution
    this.freqData = null;          // Frequency spectrum array
    this.timeData = null;          // Time domain waveform
    
    // Phase 13.30: MMPA V2.0 Bridge
    this.mmpaBridge = new AudioMMPABridge({
      enabled: true,
      audioFeatureMode: 'bands'
    });
    
    // Phase 13.31: Real audio analysis (onset detection, beat tracking)
    this.dropPredictor = null;
    this.audioAnalysisData = null;
  }
  
  async toggleTestTone(enable = !this.testToneActive) {
    // Auto-generates test tone (220Hz sine) when microphone is absent
    // Feeds to analyser chain (not speakers)
  }
}
```

---

## 6. DETAILED INITIALIZATION TIMELINE

### Phase 0: Application Load (main.js Lines 1-192)

1. Feature beacons established (line 2)
2. Safe stubs created (line 34)
3. Global references initialized (lines 45-64)
4. Modules imported (lines 73-148)

### Phase 1: HUD System (main.js:192)

```javascript
initHUD();  // Initialize all HUD panels and controls
```

### Phase 2: Input Systems (main.js:194-224)

```javascript
initMIDI();           // Web MIDI interface
initMMPAMIDI();       // MMPA-specific MIDI controller
initPresets();        // Load/save preset system
createDefaultPresets();
initAudio();          // Initialize AudioCore
initAudioRouter();    // Route audio events
```

### Phase 3: 3D Scene (main.js:236-265)

```javascript
initShadows(scene);          // Shadow rendering
initSprites(scene);          // Legacy sprite system
initMorphShape(scene);       // Main geometry morphing
initHumanoid(scene);         // Dancer avatar
initVisual(scene);           // Background/visual effects
initVessel(scene, ...);      // Vessel rings system
initVoxelFloor(scene);       // 64×64 voxel floor
initVoxelMist(scene);        // Volumetric mist
```

### Phase 4: Particle System (main.js:307-315)

```javascript
if (state.particlesEnabled) {
  initParticles(scene, state.particlesCount);
  // InstancedMesh with 5000 particles
  // Drift offsets pre-calculated for ~60 frames
}
```

### Phase 5: Advanced Systems (main.js:318-578)

```javascript
emojiStreamManager = new EmojiStreamManager(scene);
emojiSequencer = new EmojiSequencer(emojiStreamManager);
mandalaController = new MandalaController(scene, {...});
destinationManager = new DestinationManager();
fieldNavigationSystem = new ExpandedFieldNavigationSystem(...);
// ... 15 more major systems
```

### Phase 6: Feature Modules (main.js:553-555)

```javascript
initCapture();         // Screenshot system
initHotkeys();         // Keyboard shortcuts
initProjectorMode();   // Fullscreen mode
```

### Phase 7: Animation Loop Begins (geometry.js:928-929)

```javascript
function animate() {
  requestAnimationFrame(animate);
  // CONTINUOUS 60fps loop:
  // - Update MMPA features (if audio mode ON)
  // - Update particles with all 5 motion sources
  // - Render scene
}
```

---

## 7. KEY FILES AND LINE REFERENCES

### Core State Management
- **state.js** (1-827): Global application state
  - mmpaFeatures: 449-495
  - particles: 223-246
  - audio: 86-94

### Feature Extraction
- **audioFeatureExtractor.js** (1-132): Audio → MMPA mapping
  - extractAudioMMPAFeatures(): 15-98
  - calculateSpectralFlux(): 105-121

### Visual Mapping
- **mappingLayer.js** (1-250): MMPA features → visual parameters
  - mapFeaturesToVisuals(): 27-200
  - NaN protection: 46-96

### Particle System
- **particles.js** (1-3000): InstancedMesh particle rendering
  - ParticleSystem constructor: 29-150
  - Drift offset initialization: 47-63
  - update() main loop: 459-1050
  - Organic drift (sin/cos): 686-716
  - Noise field: 727-731
  - Audio jitter: 733-746
  - Chladni/Moiré/Spectrogram: 748-826
  - Base velocities: 722-725

### Audio System
- **audio.js** (1-650): AudioCore and analysis
  - AudioCore constructor: 29-80
  - toggleTestTone(): 83-122
  - connectExternalSource(): 125-141

### Archetype Recognition
- **archetypeRecognizer.js** (1-400): Archetype detection
  - ARCHETYPES enum: 25-32
  - recognitionState: 83-107
  - calculateMetrics(): 130-150

### Initialization
- **main.js** (1-916): Master initialization sequence
  - Feature modules: 74-76
  - initHUD(): 192
  - initAudio(): 220
  - initVisual(): 255
  - initParticles(): 307
  - Animation loop begins: 929

### Rendering Loop
- **geometry.js** (928-1150): Main animation loop
  - animate() entry point: 928-929
  - MMPA feature mapping: 970
  - Particle update call: 1021
  - Update order: 1004-1082

### Audio Mode
- **hudFinancial.js** (1-1034): Financial/audio mode control
  - startAudioMode(): 201-209
  - updateMMPAFeaturesFromAudio(): 177-193

---

## 8. MOTION FORCE HIERARCHY (By Priority)

1. **Time-based orbital motion** (Base trajectory)
   - Source: `particles.js:722-725` (velocities)
   - Rate: `state.particles.orbitalSpeed` (0.05)

2. **Organic drift** (Natural wobble)
   - Source: `particles.js:686-716` (driftOffsets sine/cosine)
   - Rate: `state.particles.organicStrength` (0.2)
   - Scale: `organicStrength * 0.018`

3. **Noise field** (Subtle continuous motion)
   - Source: `particles.js:727-731` (sine-based)
   - Rate: `motionStrength * 0.01`

4. **Audio jitter** (Reactivity bursts)
   - Source: `particles.js:733-746` (directional bursts)
   - Rate: `audioMix * 0.01` (scales with audio level)

5. **Cymatic patterns** (Audio-driven resonance)
   - Source: `particles.js:748-909` (Chladni, Moiré, Spectrogram, Phase-shift, Diffraction)
   - Rate: `(1 + audioMix)` multiplier

6. **MMPA speed modulation** (Overarching speed control)
   - Source: `geometry.js:994` (animationSpeed from TRANSFORMATION)
   - Scale: `0.5x to 2.0x` based on spectral flux

7. **Boundary clamping** (Constraint enforcement)
   - Source: `particles.js:920-929`
   - Radius: 10.0 units maximum

---

## 9. SUMMARY TABLE

| Component | Initial State | Startup Timing | Motion Sources |
|-----------|---------------|-----------------|-----------------|
| **Particles** | Enabled, count=5000, no organic motion | main.js:307 | 5 sources (time, noise, audio, MMPA, autonomous) |
| **Audio** | Disabled, bands=0, reactive=false | main.js:220 | Microphone/file input or test tone |
| **MMPA Features** | Disabled, source='dummy' | hudFinancial.js:201 | Audio extraction or financial data |
| **Archetype** | NEUTRAL_STATE, confidence=0 | Calculated per frame | Determined by φ/π ratio |
| **Visual** | Initialized with scene | main.js:255 | Background shaders (Acid Empire, etc.) |
| **Vessel** | Opacity=0.5, visible=false | main.js:258 | Rotation + MMPA alignment |

---

