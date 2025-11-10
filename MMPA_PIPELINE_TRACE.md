# MMPA FEATURE PIPELINE TRACE: AUDIO TO VISUALIZATION
## Complete Data Flow Diagram with File:Line References

---

## EXECUTIVE SUMMARY: THE CRITICAL ISSUE

**Root Cause of Particle Motion Before Audio:**
The system initializes with **DEFAULT NON-ZERO MMPA FEATURES** that trigger particle motion even when audio is disabled/silent. These defaults flow through the entire pipeline, causing visual motion from purely synthetic data.

---

## PART 1: AUDIO CAPTURE TO FEATURES

### Stage 1a: Audio Router - Initial Audio State
**File:** `/src/audioRouter.js`

```
audioState INITIALIZATION (lines 12-18):
├─ bass: 0
├─ mid: 0
├─ treble: 0
├─ level: 0
└─ spectrum: new Uint8Array(0)

PROCESSING FUNCTION: process(bands) [lines 33-42]
├─ Input: bands from AudioEngine
├─ toNums() conversion [lines 21-28] - converts to numbers, defaults to 0 if NaN
├─ gain multiplier applied [line 34] - state.audio?.audioGain ?? 1
├─ shape curve applied [line 31] - Math.pow(x, 0.6)
└─ OUTPUT: { bass, mid, treble, level } all shaped and gained
```

**Fallback/Default Values at This Stage:**
- All audio values START AT 0
- NaN protection converts undefined → 0
- BUT: audioState is always broadcast to subscribers

**Key Code:**
```javascript
function toNums(b) {
  return {
    bass: +b.bass || 0,        // Fallback: 0
    mid: +b.mid || 0,          // Fallback: 0
    treble: +b.treble || 0,    // Fallback: 0
    level: +b.level || 0       // Fallback: 0
  };
}
```

---

### Stage 1b: HUD Financial - Feature Extraction Switch Point
**File:** `/src/hudFinancial.js`

```
INITIALIZATION STATE (lines 66-68):
├─ financialPipeline: null
└─ financialModeEnabled: false (DEFAULT!)

TWO EXTRACTION MODES:
│
├─ AUDIO MODE (Financial Disabled):
│  ├─ startAudioMode() [lines 201-209]
│  ├─ Calls updateMMPAFeaturesFromAudio() every 16ms (~60fps)
│  ├─ Uses audioRouter.audioState as input
│  └─ Calls extractAudioMMPAFeatures() [line 191]
│
└─ FINANCIAL MODE (User Enabled):
   ├─ toggleFinancialMode(enabled) [lines 516-545]
   ├─ If enabled: stops audio, starts financial pipeline
   └─ Updates via onFeatures() callback [lines 110-114]

DEFAULT STARTUP (lines 1040-1045):
├─ setTimeout(() => { if (!financialModeEnabled) startAudioMode(); }, 500)
└─ Audio mode starts AUTOMATICALLY after 500ms!
```

**Key Code - Audio Feature Update:**
```javascript
function updateMMPAFeaturesFromAudio() {
  if (financialModeEnabled) return;
  
  const audioData = {
    bands: {
      bass: audioState.bass,        // 0 initially
      mid: audioState.mid,          // 0 initially
      treble: audioState.treble,    // 0 initially
      level: audioState.level       // 0 initially
    },
    features: state.audioFeatures || {},
    spectrum: audioState.spectrum || []
  };
  
  state.mmpaFeatures = extractAudioMMPAFeatures(audioData);
  notifyHUDUpdate();
}
```

---

### Stage 1c: Audio Feature Extractor - MMPA Structure Creation
**File:** `/src/audioFeatureExtractor.js`

```
FUNCTION: extractAudioMMPAFeatures(audioData) [lines 15-98]

INPUT FALLBACK CHAIN:
├─ bands: audioData.bands || { bass: 0, mid: 0, treble: 0, level: 0 } [line 16]
├─ features: audioData.features || {} [line 17]
└─ spectrum: audioData.spectrum || [] [line 18]

MMPA STRUCTURE OUTPUT (lines 51-97):
│
├─ identity: {
│  ├─ fundamentalFreq: features.fundamentalFreq || 440 [line 57]    ← DEFAULT!
│  ├─ harmonics: features.harmonics || [440, 880, 1320] [line 58]   ← DEFAULT!
│  ├─ strength: rms (bands.level || 0) [line 59]
│  └─ pitch: pitchStrength [line 60]
│
├─ relationship: {
│  ├─ ratios: features.harmonicRatios || ["2:1", "3:2", "4:3"] [line 65]
│  ├─ consonance: consonance (0.15-1.0) [line 66]
│  └─ complexity: Math.floor((1 - consonance) * 10) [line 67]
│
├─ complexity: {
│  ├─ centroid: (spectralCentroid * 3000) + 500 [line 72]           ← DEFAULT!
│  ├─ bandwidth: spectralSpread * 2000 [line 73]
│  └─ brightness: spectralCentroid [line 74]
│
├─ transformation: {
│  ├─ flux: spectralFlux (0-1) [line 79]
│  ├─ velocity: features.onset ? 0.8 : 0.15 [line 80]
│  └─ acceleration: 0.03 [line 81]
│
├─ alignment: {
│  ├─ coherence: 1 - zcr [line 86]
│  ├─ stability: consonance [line 87]
│  └─ synchrony: features.beat ? 0.9 : 0.5 [line 88]
│
└─ potential: {
   ├─ entropy: entropy (0-1) [line 93]
   ├─ unpredictability: spectralFlux [line 94]
   └─ freedom: spectralSpread [line 95]
```

**CRITICAL DEFAULTS - When Audio is Silent/Disabled:**
```javascript
// When features.* doesn't exist (which is default):
const spectralCentroid = features.spectralCentroid || 0.5;  // Default: 0.5
const zcr = features.zcr || 0.5;                             // Default: 0.5
const spectralFlux = features.spectralFlux || 0;             // Default: 0

// Calculations with these defaults:
const consonance = Math.min(1,
  (0.5 * 0.4) +           // 0.2
  ((1 - 0.5) * 0.3) +     // 0.15
  (rms * 0.3)              // 0.0 (rms is 0 when silent)
) = 0.35 minimum

const pitchStrength = (0 * 0.5) + (0 * 0.3) + (0 * 0.2) = 0
```

**DEFAULT MMPA FEATURES (when all audio is 0):**
```
identity: {
  fundamentalFreq: 440,        // Hardcoded default!
  harmonics: [440, 880, 1320], // Hardcoded defaults!
  strength: 0,
  pitch: 0
}
relationship: {
  consonance: 0.35,            // Calculated with defaults
  complexity: 6                 // Math.floor(0.65 * 10)
}
complexity: {
  centroid: 2000,              // (0.5 * 3000) + 500
  bandwidth: 0,
  brightness: 0.5
}
transformation: {
  flux: 0,
  velocity: 0.15,              // Default when no onset
  acceleration: 0.03           // Hardcoded
}
alignment: {
  coherence: 0.5,              // 1 - 0.5 (zcr default)
  stability: 0.35,             // consonance
  synchrony: 0.5               // Default when no beat
}
potential: {
  entropy: 0.5,                // Default spectralFlatness
  unpredictability: 0,         // spectralFlux
  freedom: 0                    // spectralSpread default
}
```

---

## PART 2: FEATURES TO VISUALS

### Stage 2a: Mapping Layer - Feature to Visual Parameters
**File:** `/src/mappingLayer.js`

```
FUNCTION: mapFeaturesToVisuals(features) [lines 27-203]

GUARD CLAUSE (lines 28-31):
├─ if (!features || !features.enabled) return null
└─ Features must have enabled: true

NaN PROTECTION + DEFAULTS:
├─ safeFreq: (isNaN(freq) || freq <= 0) ? 440 : freq [line 47]
├─ safeStrength: isNaN(strength) ? 0.85 : strength [line 48]      ← DEFAULTS TO 0.85!
├─ safeConsonance: isNaN(consonance) ? 0.72 : consonance [line 75]  ← DEFAULTS TO 0.72!
├─ safeComplexity: isNaN(complexity) ? 3 : complexity [line 76]
├─ safeCentroid: (isNaN(centroid) || centroid <= 0) ? 1500 : centroid [line 94]
├─ safeBrightness: isNaN(brightness_spectral) ? 0.68 : brightness_spectral [line 96]
└─ ... [lines 98-172] more NaN protections with defaults

OUTPUT PARAMETERS (sampled):
├─ colorIntensity: 0.85 (default from safeStrength)
├─ geometricSymmetry: 0.72 (default from safeConsonance)
├─ particleDensity: 0.8 + (0.68 * 0.2) = 0.936 [line 101]        ← ALWAYS > 0.8!
├─ spatialElevation: normalized from 1500Hz (default centroid)
├─ animationSpeed: 0.5 + (0 * 1.5) = 0.5 minimum [line 127]
├─ particleRandomness: 0.28 (default entropy)
└─ ... more parameters
```

**THE CRITICAL PROBLEM:**
When features come in with NaN or missing values, mappingLayer applies SENSIBLE DEFAULTS:
- particleDensity ALWAYS ≥ 0.8 (ensures particles visible)
- Many values have reasonable non-zero defaults
- This causes VISUAL MOTION even with silent audio!

**Key Code:**
```javascript
const particleMultiplier = 0.8 + safeBrightness * 0.2; // 0.8 to 1.0
visualParams.particleDensity = particleMultiplier;     // Min 0.8, even if audio=0!
```

---

### Stage 2b: State - Default MMPA Features at Module Load
**File:** `/src/state.js`

```
DEFAULT INITIALIZATION (lines 449-495):

mmpaFeatures: {
  enabled: false,                    // ← CRITICAL: starts DISABLED!
  source: 'dummy',
  
  identity: {
    fundamentalFreq: 440.0,          // Default 440 Hz (A note)
    harmonics: [440, 880, 1320],
    strength: 0.0                    // ← 0 when no audio
  },
  
  relationship: {
    consonance: 0.72,                // ← Hardcoded default!
    complexity: 3
  },
  
  complexity: {
    centroid: 1500.0,                // ← Hardcoded 1500 Hz!
    bandwidth: 2000.0,
    brightness: 0.68                 // ← Hardcoded!
  },
  
  transformation: {
    flux: 0.42,                      // ← Hardcoded non-zero!
    velocity: 0.15,                  // ← Hardcoded non-zero!
    acceleration: 0.03               // ← Hardcoded non-zero!
  },
  
  alignment: {
    coherence: 0.78,                 // ← Hardcoded!
    stability: 0.65,                 // ← Hardcoded!
    synchrony: 0.82                  // ← Hardcoded!
  },
  
  potential: {
    entropy: 0.55,                   // ← Hardcoded!
    unpredictability: 0.48,          // ← Hardcoded!
    freedom: 0.60                    // ← Hardcoded!
  }
}

PROBLEM: These defaults are used immediately on load!
         They're NOT audio-derived, just synthetic constants.
```

---

### Stage 2c: Theory Renderer - Archetype Recognition Integration
**File:** `/src/theoryRenderer.js`

```
UPDATE LOOP: updateTheoryRenderer(mmpaFeatures, deltaTime) [lines 192-239]

STEPS:
1. Recognize Archetype [line 196]
   ├─ Input: mmpaFeatures (could have enabled: false!)
   └─ Output: recognition object with archetype
   
2. Calculate Vortex Sync [line 218]
   ├─ Input: mmpaFeatures
   └─ Output: synchronization value
   
3. Update Visual Effects [line 228]
   ├─ applyArchetypeEffects(recognition)
   └─ Modifies chestahedron material based on archetype
   
4. Update Particle Motion [lines 225, 231-238]
   ├─ updateHeartRotation() based on archetype
   └─ Rotations applied even if archetype is NEUTRAL_STATE!
```

---

## PART 3: ARCHETYPE SYSTEM

### Stage 3a: Archetype Recognizer - Pattern Detection
**File:** `/src/archetypeRecognizer.js`

```
ARCHETYPE DEFINITIONS (lines 25-32):
├─ PURE_HARMONY (φ/π > 3.0)
├─ HIGH_HARMONY (φ/π 1.5-3.0)
├─ BALANCED (φ/π 0.8-1.5)
├─ HIGH_CHAOS (φ/π 0.3-0.8)
├─ PURE_CHAOS (φ/π < 0.3)
└─ NEUTRAL_STATE (Silence)

SILENCE THRESHOLD (line 76):
├─ SILENCE_THRESHOLD: 0.01
└─ STRENGTH < 0.01 → NEUTRAL_STATE

RECOGNITION FUNCTION: recognizeArchetype(mmpaFeatures) [lines 398-490]

STEP 1: Calculate π/φ Ratios [line 400]
├─ Function: calculatePiPhi(mmpaFeatures) [lines 190-231]
├─ Inputs extracted [lines 191-196]:
│  ├─ consonance = features.relationship?.consonance || 0
│  ├─ flux = features.transformation?.flux || 0
│  ├─ entropy = features.potential?.entropy || 0
│  ├─ strength = features.identity?.strength || 0
│  └─ coherence = features.alignment?.coherence || 0
│
├─ π Score (chaos) [lines 200-204]:
│  ├─ pi = Math.min(1, ((flux * 0.4) + (entropy * 0.3) + ((1 - coherence) * 0.3)) * PI_SCALE)
│  └─ With defaults: pi = min(1, (0 + 0.15 + 0.11) * 1.0) = 0.26
│
└─ φ Score (harmony) [lines 208-212]:
   ├─ phi = Math.min(1, ((consonance * 0.4) + (coherence * 0.3) + ((1 - flux) * 0.3)) * PHI_SCALE)
   └─ With defaults: phi = min(1, (0.288 + 0.234 + 0.3) * 1.0) = 0.822

STEP 2: Determine Archetype [line 414]
├─ Function: getArchetypeFromRatio(phi, pi, strength) [lines 257-300]
├─ SILENCE CHECK [lines 259-266]:
│  └─ if (strength < 0.01) return NEUTRAL_STATE
│
├─ RATIO CALCULATION [line 269]:
│  └─ phiOverPi = pi > 0.01 ? phi / pi : 10
│     With defaults: 0.822 / 0.26 = 3.16
│
└─ DECISION TREE [lines 273-288]:
   └─ phiOverPi = 3.16 > 3.0
      → RETURN PURE_HARMONY!

STEP 3: Confidence Calculation [lines 425-450]
├─ For PURE_HARMONY:
│  └─ confidence = min((3.16 - 3.0) / 2.0 + 0.7, 1.0) = 0.778
│
└─ confidence stored in recognitionState

STEP 4: History & Transition [lines 455-478]
├─ Add to history
├─ Check if archetype changed
└─ If changed, trigger callbacks
```

**THE CRITICAL BUG:**

When `strength = 0` (no audio):
```
pi = min(1, (0 + entropy_default + coherence_term) * 1.0)
   = min(1, (0 + 0.15 + 0.11) * 1.0) = 0.26

phi = min(1, (consonance_default + 0.234 + 0.3) * 1.0)
    = min(1, (0.288 + 0.234 + 0.3) * 1.0) = 0.822

phiOverPi = 0.822 / 0.26 = 3.16

Decision: phiOverPi (3.16) > PURE_HARMONY_THRESHOLD (3.0)
Result: PURE_HARMONY archetype is detected!

BUT strength = 0, so getArchetypeFromRatio returns NEUTRAL_STATE [line 265]
```

Wait - let me re-check the flow...

---

## CRITICAL DISCOVERY: TWO DIFFERENT LOGIC PATHS!

**Path A: ANLG π/φ Based (New):**
- getArchetypeFromRatio() [line 414]
- Uses pi/phi ratio directly
- CHECKS strength < 0.01 FIRST [line 259]
- Returns NEUTRAL_STATE if silent

**Path B: Legacy φ-Threshold Based:**
- evaluateArchetype() [line 318] - NOT USED in recognizeArchetype!
- Uses stabilityMetric >= PHI_THRESHOLD
- Also has strength checks

**WHICH ONE IS ACTIVE?**

Looking at recognizeArchetype() [lines 398-490]:
```javascript
export function recognizeArchetype(mmpaFeatures) {
  // Line 400: Calculate π/φ metrics
  const { pi, phi, piOverPhi, phiOverPi } = calculatePiPhi(mmpaFeatures);
  const strength = mmpaFeatures.identity?.strength || 0;
  
  // Line 414: Use ANLG decision tree
  const detectedArchetype = getArchetypeFromRatio(phi, pi, strength);
  
  // ... confidence calculation, history, transitions
  
  return {
    archetype: recognitionState.currentArchetype,  // Returns stored archetype
    confidence: recognitionState.confidence,
    ...
  };
}
```

**The active path is π/φ based (ANLG).**

---

## RECONSTRUCTED CRITICAL PATH: THE BUG

### Scenario: Page Load, Audio Disabled, Particles Still Moving

```
TIME: 0-500ms
├─ state.js loads, mmpaFeatures.enabled = false [state.js:450]
├─ audioRouter initialized, audioState = {bass:0, mid:0, treble:0, level:0} [audioRouter:12-18]
└─ mapFeaturesToVisuals returns NULL because features.enabled = false [mappingLayer:29]

TIME: 500ms (setTimeout fires in hudFinancial)
├─ startAudioMode() called [hudFinancial:1041-1045]
├─ mmpaFeatures.enabled NEVER SET TO TRUE!
├─ updateMMPAFeaturesFromAudio() interval starts
├─ PROBLEM: updateMMPAFeaturesFromAudio() calls extractAudioMMPAFeatures()
│  └─ Creates mmpaFeatures with DEFAULT values [audioFeatureExtractor:51-97]
│  └─ identity.fundamentalFreq = 440 (default)
│  └─ relationship.consonance = 0.35+ (calculated from defaults)
│  └─ transformation.velocity = 0.15 (default)
│  └─ ... many non-zero defaults
│
├─ Sets state.mmpaFeatures = extractedFeatures [hudFinancial:191]
├─ Calls notifyHUDUpdate() [hudFinancial:192]
└─ BUT: mmpaFeatures.enabled is STILL FALSE!

TIME: When particles update
├─ IF mapFeaturesToVisuals checks .enabled flag [mappingLayer:29]:
│  └─ Returns NULL, no particle motion (correct behavior)
│
├─ IF mapFeaturesToVisuals IGNORES .enabled flag:
│  └─ Maps default features to visuals
│  └─ particleDensity = 0.8+ (always visible)
│  └─ animationSpeed = 0.5+ (always moving)
│  └─ Particles move even though audio is silent!
```

---

## DEFAULT VALUES SUMMARY TABLE

| Location | Variable | Default | Issue |
|----------|----------|---------|-------|
| state.js:450 | mmpaFeatures.enabled | false | START DISABLED |
| state.js:456 | identity.fundamentalFreq | 440 Hz | Hardcoded, not audio |
| state.js:464 | relationship.consonance | 0.72 | Hardcoded, not audio |
| state.js:470 | complexity.centroid | 1500 Hz | Hardcoded, not audio |
| state.js:477 | transformation.flux | 0.42 | Hardcoded, non-zero |
| state.js:478 | transformation.velocity | 0.15 | Hardcoded, non-zero |
| state.js:484 | alignment.coherence | 0.78 | Hardcoded, not audio |
| audioRouter.js:13-18 | audioState | all 0 | Correct initial |
| audioFeatureExtractor.js:16 | bands fallback | {bass:0, mid:0, ...} | Correct initial |
| audioFeatureExtractor.js:26 | spectralCentroid | 0.5 | Default when missing |
| audioFeatureExtractor.js:27 | zcr | 0.5 | Default when missing |
| mappingLayer.js:48 | safeStrength | 0.85 | DEFAULT if NaN! |
| mappingLayer.js:75 | safeConsonance | 0.72 | DEFAULT if NaN! |
| mappingLayer.js:101 | particleDensity | 0.8-1.0 | ALWAYS ≥ 0.8 |
| archetypeRecognizer.js:259 | SILENCE_THRESHOLD | 0.01 | Check point |

---

## WHAT ARCHETYPE IS ACTIVE BY DEFAULT?

### Before Audio Enabled (time 0-500ms):
```
mmpaFeatures.enabled = false
mapFeaturesToVisuals returns NULL
No particle motion (correct)
archetype = NEUTRAL_STATE (initial) [archetypeRecognizer.js:84]
```

### After Audio Enabled, But Still Silent (time > 500ms):
```
strength = audioState.level = 0 (no audio signal)

getArchetypeFromRatio(phi=0.822, pi=0.26, strength=0):
├─ Check 1: strength (0) < SILENCE_THRESHOLD (0.01)?
│  └─ YES → return NEUTRAL_STATE [line 265]
└─ Result: NEUTRAL_STATE

CORRECT BEHAVIOR: Archetype is NEUTRAL_STATE when silent!
```

### BUT Particles Still Move Because:
1. mappingLayer.js still processes features even if mmpaFeatures.enabled = false
2. OR: theoryRenderer updates even if archetype is NEUTRAL_STATE
3. OR: particles not checking archetype before moving

---

## RECOMMENDED FIX LOCATIONS

1. **audioFeatureExtractor.js [lines 15-98]:**
   - When `strength == 0`, return features with `enabled: false`
   - OR: Set all transformation/alignment values to 0 when silent

2. **mappingLayer.js [lines 27-31]:**
   - Ensure guard clause is ALWAYS checked
   - Return NULL for all visual params if disabled

3. **visual.js (particle update):**
   - Check archetype before animating
   - If NEUTRAL_STATE and strength < 0.01, freeze particles

4. **state.js [lines 449-495]:**
   - Change default `transformation.flux: 0` (not 0.42)
   - Change default `transformation.velocity: 0` (not 0.15)
   - These should only be non-zero with active audio

---

## DATA FLOW DIAGRAM (Text Format)

```
AUDIO CAPTURE
    ↓
┌──────────────────────────────────────┐
│ audioRouter.js                       │
│ audioState = {bass:0, mid:0, ...}  │
│ Normalization, gain, shape curve     │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│ hudFinancial.js                      │
│ updateMMPAFeaturesFromAudio()        │
│ Decides: Audio or Financial mode     │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│ audioFeatureExtractor.js             │
│ extractAudioMMPAFeatures(audioData)  │
│ Creates MMPA structure               │
│ DEFAULTS when features missing       │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│ state.mmpaFeatures                   │
│ {enabled: false/true, ...features}   │
│ Defaults: flux:0.42, velocity:0.15   │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│ mappingLayer.js                      │
│ mapFeaturesToVisuals(features)       │
│ Guard: if (!features.enabled) null   │
│ NaN Defaults: brightness:0.68, ...   │
│ particleDensity: 0.8-1.0 (always!)   │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│ theoryRenderer.js                    │
│ updateTheoryRenderer(mmpaFeatures)   │
│ Recognizes archetype                 │
│ Applies visual effects               │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│ archetypeRecognizer.js               │
│ recognizeArchetype(mmpaFeatures)     │
│ Calculates π/φ ratios                │
│ Returns: {archetype, confidence}     │
│ SILENCE: strength < 0.01 → neutral   │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│ visual.js (Particle Updates)         │
│ Animates based on archetype          │
│ IF archetype = NEUTRAL_STATE?        │
│ Motion should STOP                   │
└──────────────────────────────────────┘
```

---

## CONCLUSION

**Three simultaneous issues cause pre-audio particle motion:**

1. **Default MMPA Features in state.js** carry non-zero transformation/alignment values that persist even when audio is disabled.

2. **NaN Protection in mappingLayer.js** applies sensible defaults (0.8+ density, 0.68 brightness) when features are missing/undefined, causing visual motion even with synthetic data.

3. **Enabled Flag Not Set** - mmpaFeatures.enabled stays false, but some systems may ignore this guard clause and process the defaults anyway.

**Solution:** Zero out defaults in state.js AND ensure mappingLayer strictly guards on `.enabled` flag.

