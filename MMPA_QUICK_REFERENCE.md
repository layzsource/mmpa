# MMPA PIPELINE QUICK REFERENCE
## File Locations & Critical Default Values

---

## FILES IN PIPELINE ORDER

### 1. AUDIO CAPTURE & ROUTING
**File: `/src/audioRouter.js`**
- Lines 12-18: audioState initialization (all 0)
- Lines 21-42: toNums() + process() functions
- Lines 97-168: AudioEngine event listener ('frame' event)

**Key Defaults:**
- bass: 0, mid: 0, treble: 0, level: 0
- NaN converts to 0

---

### 2. FEATURE EXTRACTION MODE SELECTOR
**File: `/src/hudFinancial.js`**
- Lines 66-68: financialPipeline/Mode state (default: null, false)
- Lines 201-209: startAudioMode() function
- Lines 1040-1045: Auto-start audio mode after 500ms
- Lines 177-193: updateMMPAFeaturesFromAudio() function

**Key Issue:**
- mmpaFeatures.enabled is NEVER set to true
- updateMMPAFeaturesFromAudio() runs every 16ms (~60fps)

---

### 3. AUDIO TO MMPA FEATURES CONVERTER
**File: `/src/audioFeatureExtractor.js`**
- Lines 15-98: extractAudioMMPAFeatures() main function
- Lines 26-27: spectralCentroid/zcr defaults (0.5)
- Lines 51-97: MMPA structure assembly

**Key Defaults (when audio absent):**
```javascript
fundamentalFreq: 440 Hz          (line 57)
consonance: 0.35-1.0             (lines 31-35)
centroid: (0.5*3000)+500 = 2000  (line 72)
velocity: 0.15                   (line 80)
acceleration: 0.03               (line 81)
synchrony: 0.5                   (line 88)
entropy: 0.5                      (line 93)
```

---

### 4. GLOBAL STATE DEFAULTS
**File: `/src/state.js`**
- Lines 449-495: mmpaFeatures default structure

**Critical Hardcoded Defaults:**
```javascript
mmpaFeatures: {
  enabled: false,                         // line 450
  identity.fundamentalFreq: 440.0,        // line 456
  identity.strength: 0.0,                 // line 458
  relationship.consonance: 0.72,          // line 464
  complexity.centroid: 1500.0,            // line 470
  complexity.brightness: 0.68,            // line 472
  transformation.flux: 0.42,              // line 477 ← NON-ZERO!
  transformation.velocity: 0.15,          // line 478 ← NON-ZERO!
  transformation.acceleration: 0.03,      // line 479
  alignment.coherence: 0.78,              // line 484
  alignment.stability: 0.65,              // line 485
  alignment.synchrony: 0.82,              // line 486
  potential.entropy: 0.55,                // line 491
  potential.unpredictability: 0.48,       // line 492
}
```

---

### 5. FEATURES TO VISUAL PARAMETERS
**File: `/src/mappingLayer.js`**
- Lines 27-203: mapFeaturesToVisuals() main function
- Lines 28-31: Guard clause (checks .enabled)
- Lines 46-96: NaN protection with defaults

**Critical NaN Defaults:**
```javascript
safeStrength: isNaN(strength) ? 0.85 : strength      // line 48
safeConsonance: isNaN(consonance) ? 0.72 : consonance // line 75
safeCentroid: isNaN(centroid) ? 1500 : centroid       // line 94
safeBrightness: isNaN(brightness) ? 0.68 : brightness // line 96

// Output critical value:
particleDensity: 0.8 + (brightness * 0.2)             // line 101 → MIN 0.8!
```

---

### 6. THEORY VISUALIZATION & ARCHETYPE
**File: `/src/theoryRenderer.js`**
- Lines 99-154: initTheoryRenderer() setup
- Lines 192-239: updateTheoryRenderer() main loop
- Line 196: recognizeArchetype() call

**File: `/src/archetypeRecognizer.js`**
- Lines 25-32: ARCHETYPE definitions
- Lines 76: SILENCE_THRESHOLD = 0.01
- Lines 130-170: calculateMetrics() function
- Lines 190-231: calculatePiPhi() π/φ calculation
- Lines 257-300: getArchetypeFromRatio() decision tree
- Lines 398-490: recognizeArchetype() main function
- Lines 259-266: SILENCE CHECK (strength < 0.01 → NEUTRAL_STATE)

---

### 7. PARTICLE VISUALIZATION
**File: `/src/visual.js`**
- Lines 1-150: Background/shader systems, particle setup
- Uses mapFeaturesToVisuals() output to animate

---

## THE BUG IN 3 POINTS

### 1. Default Feature Values Flow Through Silent Audio
```
audioState = {bass:0, mid:0, treble:0, level:0}
        ↓
extractAudioMMPAFeatures() [strength=0]
        ↓
mmpaFeatures with DEFAULTS (consonance:0.72, velocity:0.15, etc.)
        ↓
But mmpaFeatures.enabled = false!
```

### 2. mapFeaturesToVisuals() Applies Safe Defaults
```
if (!features || !features.enabled) return null   ← GUARD CLAUSE

BUT if guard is bypassed or ignored:
NaN → 0.85 (safeStrength)
NaN → 0.72 (safeConsonance)
particleDensity = 0.8 + (0.68 * 0.2) = 0.936 ← ALWAYS VISIBLE!
```

### 3. Archetype Recognizer Correctly Identifies Silence
```
strength < 0.01 → return NEUTRAL_STATE [line 265]
        ↓
Correct! But if particles ignore archetype:
        ↓
Particles still move with synthetic defaults
```

---

## QUICK FIX CHECKLIST

- [ ] state.js line 477: Change `flux: 0.42` → `flux: 0`
- [ ] state.js line 478: Change `velocity: 0.15` → `velocity: 0`
- [ ] hudFinancial.js line 191: Add `state.mmpaFeatures.enabled = true` after extraction
- [ ] mappingLayer.js line 29: Verify guard clause works (return null if disabled)
- [ ] visual.js: Add archetype check before particle animation

---

## TEST VERIFICATION

**Before Fix:**
- Page loads → particles move immediately (silence has velocity: 0.15)
- Audio disabled → particles move (synthetic consonance: 0.72)
- SILENCE detected → particles still move

**After Fix:**
- Page loads → particles frozen (velocity: 0)
- Audio disabled → particles frozen (enabled: false)
- SILENCE detected → particles frozen (NEUTRAL_STATE)
- Audio enabled with sound → particles move proportionally

---

## π/φ ARCHETYPE CALCULATION

When strength = 0 (silent):
```
consonance (default): 0.72
entropy (default): 0.55
coherence (default): 0.78

π = (flux*0.4 + entropy*0.3 + (1-coherence)*0.3) * 1.0
  = (0*0.4 + 0.55*0.3 + 0.22*0.3) * 1.0
  = (0 + 0.165 + 0.066) * 1.0
  = 0.231

φ = (consonance*0.4 + coherence*0.3 + (1-flux)*0.3) * 1.0
  = (0.72*0.4 + 0.78*0.3 + 1*0.3) * 1.0
  = (0.288 + 0.234 + 0.3) * 1.0
  = 0.822

phiOverPi = 0.822 / 0.231 = 3.56 > 3.0 (PURE_HARMONY threshold!)

BUT getArchetypeFromRatio checks strength FIRST [line 259]:
strength (0) < SILENCE_THRESHOLD (0.01)?
→ YES → return NEUTRAL_STATE [line 265]
```

Result: Correctly identifies NEUTRAL_STATE despite high φ/π ratio.
Problem: Particles may not respect NEUTRAL_STATE archetype.

