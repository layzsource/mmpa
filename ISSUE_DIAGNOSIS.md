# MMPA PARTICLE MOTION BUG - DIAGNOSIS & ROOT CAUSE

## Summary
Particles move before audio is enabled and continue moving during silence because:
1. Default MMPA feature values carry non-zero motion parameters
2. Multiple systems fail to properly gate on silence/disabled state
3. The archetype system correctly identifies silence but particle system ignores it

---

## Root Cause Analysis

### Issue 1: Default Transformation Parameters Are Non-Zero
**Location:** `/src/state.js:477-479`

```javascript
transformation: {
  flux: 0.42,           // ← Should be 0 when no audio
  velocity: 0.15,       // ← Should be 0 when no audio  
  acceleration: 0.03    // ← Should be 0 when no audio
}
```

These hardcoded defaults were intended as "reasonable test values" but they override actual audio data when audio is silent/absent. They persist through the entire pipeline and drive particle motion.

**Impact:** Even with strength=0 (silent), these values cause:
- animationSpeed = 0.5 + (flux * 1.5) = 0.5 + (0.42 * 1.5) = 1.13x
- particleRandomness = entropy = 0.55
- motionVelocity = 0.15

---

### Issue 2: mmpaFeatures.enabled Never Set to True
**Location:** `/src/hudFinancial.js:177-193`

```javascript
function updateMMPAFeaturesFromAudio() {
  if (financialModeEnabled) return;
  
  const audioData = {
    bands: {
      bass: audioState.bass,
      mid: audioState.mid,
      treble: audioState.treble,
      level: audioState.level
    },
    features: state.audioFeatures || {},
    spectrum: audioState.spectrum || []
  };
  
  state.mmpaFeatures = extractAudioMMPAFeatures(audioData);
  // ← BUG: Never sets state.mmpaFeatures.enabled = true!
  
  notifyHUDUpdate();
}
```

The `enabled` flag is initialized as `false` and never set to `true` during audio feature extraction.

**Impact:** mappingLayer.js can check the guard clause (line 29) and return null if enabled=false, preventing all particle motion. But if the guard is ignored or bypassed, features flow through with synthetic defaults.

---

### Issue 3: Silence Detection Works Correctly (But Ignored)
**Location:** `/src/archetypeRecognizer.js:259-266`

```javascript
function getArchetypeFromRatio(phi, pi, strength) {
  // Silence check first (no signal = no archetype)
  if (strength < RECOGNITION_CONFIG.SILENCE_THRESHOLD) {  // 0.01
    console.log('🔇 SILENCE DETECTED → NEUTRAL_STATE:', { ... });
    return ARCHETYPES.NEUTRAL_STATE;
  }
  // ... ratio-based archetype selection
}
```

This works perfectly - strength=0 (silent audio) triggers NEUTRAL_STATE archetype.

**Problem:** Particles may not respect NEUTRAL_STATE. They may still animate based on synthetic defaults instead of checking archetype.

---

### Issue 4: NaN Protection with Fallback Defaults
**Location:** `/src/mappingLayer.js:46-96`

```javascript
// When features have NaN or missing values:
const safeFreq = (isNaN(freq) || freq <= 0) ? 440 : freq;
const safeStrength = isNaN(strength) ? 0.85 : strength;      // ← Fallback!
const safeConsonance = isNaN(consonance) ? 0.72 : consonance; // ← Fallback!
const safeBrightness = isNaN(brightness_spectral) ? 0.68 : brightness_spectral;

// These fallbacks are reasonable for safety but can mask silence:
const particleMultiplier = 0.8 + safeBrightness * 0.2; // 0.8-1.0
visualParams.particleDensity = particleMultiplier;     // Always ≥ 0.8!
```

**Impact:** Even if actual features are undefined, particles get visible (0.8+ density) with reasonable defaults.

---

## Timeline of Bug Manifestation

### Time 0: Page Load
```
state.js loads
├─ mmpaFeatures.enabled = false
├─ mmpaFeatures.transformation.flux = 0.42
├─ mmpaFeatures.transformation.velocity = 0.15
└─ mmpaFeatures.transformation.acceleration = 0.03
```

### Time 0-500ms
```
audioRouter initializes
├─ audioState = {bass:0, mid:0, treble:0, level:0}
├─ AudioEngine 'frame' listener registered
└─ No events fired (no audio input)

mapFeaturesToVisuals checks enabled flag
├─ if (!features || !features.enabled) return null
└─ Currently returns null (correct behavior - disabled)
```

### Time 500ms: Audio Mode Auto-Start
```
setTimeout callback fires in hudFinancial.js:1041

startAudioMode() called
├─ Creates interval: updateMMPAFeaturesFromAudio() every 16ms
│
└─ updateMMPAFeaturesFromAudio():
   ├─ audioState still {bass:0, mid:0, ...} (no audio input)
   ├─ Calls extractAudioMMPAFeatures(audioData)
   │  └─ Creates mmpaFeatures with:
   │     - strength: 0 (no audio)
   │     - flux: 0 (calculated from empty spectrum)
   │     - velocity: 0.15 (DEFAULT - no onset detected)
   │     - consonance: 0.35-0.72 (DEFAULT - calculated from 0s)
   │     - coherence: 0.5 (DEFAULT - zcr default)
   │     - entropy: 0.5 (DEFAULT)
   │
   ├─ state.mmpaFeatures = extracted (with defaults)
   ├─ state.mmpaFeatures.enabled STILL = false ← BUG!
   └─ notifyHUDUpdate() called
```

### Time 500ms+: Particle Updates Begin
```
theoryRenderer.updateTheoryRenderer() called each frame
├─ recognizeArchetype(mmpaFeatures)
│  ├─ strength < 0.01 → returns NEUTRAL_STATE
│  └─ Correct!
│
└─ But particle system may:
   ├─ Ignore archetype
   ├─ Check enabled=false and return null
   ├─ OR still apply defaults if guard bypassed
   └─ Result: Synthetic motion from defaults (flux, velocity)
```

---

## The Paradox

**Archetype System:**
- Correctly identifies SILENCE (strength < 0.01 → NEUTRAL_STATE)
- Should trigger silence visual treatment

**But:**
- Default transformation values (flux=0.42, velocity=0.15) drive motion
- Guard clause on enabled flag may be ignored
- Particle system continues moving with synthetic data

---

## Evidence Chain

### Particle motion occurs when:
1. Audio is disabled (no audio input)
2. SILENCE is detected (strength < 0.01)
3. Archetype is correctly NEUTRAL_STATE

### Because:
1. state.js has non-zero transformation defaults
2. hudFinancial.js never sets enabled=true
3. Some particle system bypasses or ignores enabled guard
4. Synthetic defaults flow through mapFeaturesToVisuals

---

## Solution Strategy

### Short-term (Critical)
1. **state.js:** Zero out transformation defaults
   ```javascript
   transformation: {
     flux: 0,           // Not 0.42
     velocity: 0,       // Not 0.15
     acceleration: 0    // Not 0.03
   }
   ```

2. **hudFinancial.js:** Set enabled flag when extracting
   ```javascript
   state.mmpaFeatures = extractAudioMMPAFeatures(audioData);
   state.mmpaFeatures.enabled = true;  // ADD THIS
   ```

3. **visual.js:** Guard particle updates
   ```javascript
   if (state.mmpaFeatures?.enabled !== true) {
     freezeParticles();
     return;
   }
   ```

### Long-term (Architectural)
1. Separate "synthetic test defaults" from "audio-derived features"
2. Implement explicit feature validity flags
3. Add gating at each pipeline stage (not just at endpoints)
4. Log feature flow for debugging

---

## Validation Tests

### Test 1: Defaults are Zeroed
```
Expected:
- state.js transformation.flux = 0
- state.js transformation.velocity = 0
- state.js transformation.acceleration = 0
```

### Test 2: Features Explicitly Enabled
```
Expected:
- updateMMPAFeaturesFromAudio sets enabled = true
- mapFeaturesToVisuals respects enabled flag
```

### Test 3: Silent Audio Freezes Motion
```
Expected:
- strength < 0.01 → archetype = NEUTRAL_STATE
- NEUTRAL_STATE → particles frozen
- No motion without audio input
```

### Test 4: Guard Clauses Work
```
Expected:
- mapFeaturesToVisuals returns null if enabled=false
- theoryRenderer skips effects if disabled
- visual.js freezes particles if disabled
```

---

## Files Needing Changes

| File | Line | Change | Why |
|------|------|--------|-----|
| state.js | 477 | flux: 0 | Eliminate non-zero defaults |
| state.js | 478 | velocity: 0 | Eliminate non-zero defaults |
| state.js | 479 | acceleration: 0 | Eliminate non-zero defaults |
| hudFinancial.js | 191 | Add `enabled = true` | Gate pipeline on real audio |
| mappingLayer.js | 29 | Verify guard works | Return null when disabled |
| visual.js | ? | Add archetype check | Gate particles on silent archetype |

---

## Conclusion

The bug is **data-driven, not logic-driven**. The archetype recognition logic works correctly. The silence detection works correctly. But:

1. **Synthetic defaults flow through** when audio is absent
2. **Enabled flag not set** so guard clauses can't work
3. **Particle system ignores** archetype state

Fixing the defaults and enabling flag will solve the issue at the root.

