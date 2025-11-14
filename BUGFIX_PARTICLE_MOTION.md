# Bug Fix: Particle Motion Before Audio Enabled

## Issue
Particles were moving even when audio was silent or not yet enabled, creating unwanted motion on application startup.

## Root Cause
In `src/mappingLayer.js`, the NaN protection was using **non-zero fallback defaults** when audio produced NaN values (silence):

```javascript
// BEFORE (BUG):
const safeFlux = isNaN(flux) ? 0.42 : flux;           // ❌ Non-zero default
const safeVelocity = isNaN(velocity) ? 0.15 : velocity; // ❌ Non-zero default
const safeAcceleration = isNaN(acceleration) ? 0.03 : acceleration; // ❌ Non-zero default

const safeStrength = isNaN(strength) ? 0.85 : strength; // ❌ Non-zero default
const safeBrightness = isNaN(brightness_spectral) ? 0.68 : brightness_spectral; // ❌ Non-zero default

const safeEntropy = isNaN(entropy) ? 0.28 : entropy; // ❌ Non-zero default
const safeUnpredictability = isNaN(unpredictability) ? 0.15 : unpredictability; // ❌ Non-zero default
const safeFreedom = isNaN(freedom) ? 0.22 : freedom; // ❌ Non-zero default
```

## Solution
Changed all **"presence"** metrics to default to **0** when NaN is detected:

```javascript
// AFTER (FIXED):
const safeFlux = isNaN(flux) ? 0 : flux;           // ✓ Zero when silent
const safeVelocity = isNaN(velocity) ? 0 : velocity; // ✓ Zero when silent
const safeAcceleration = isNaN(acceleration) ? 0 : acceleration; // ✓ Zero when silent

const safeStrength = isNaN(strength) ? 0 : strength; // ✓ Zero when silent
const safeBrightness = isNaN(brightness_spectral) ? 0 : brightness_spectral; // ✓ Zero when silent

const safeEntropy = isNaN(entropy) ? 0 : entropy; // ✓ Zero when silent
const safeUnpredictability = isNaN(unpredictability) ? 0 : unpredictability; // ✓ Zero when silent
const safeFreedom = isNaN(freedom) ? 0 : freedom; // ✓ Zero when silent
```

### Rationale
- **Silence = No Signal = Zero Motion** (empirically correct)
- Reference values (frequencies, spatial positions) kept as reasonable defaults (e.g., 440Hz, 1500Hz)
- Relational metrics (consonance, stability, coherence) kept as defaults (not presence-based)

## Files Changed
- `src/mappingLayer.js` (lines 48, 96, 122-124, 170-172)

## Test Coverage
Created `test_mapping_nan_protection.js` to verify:
- ✓ All motion parameters = 0 when audio is NaN
- ✓ All chaos/randomness parameters = 0 when audio is NaN
- ✓ Presence metrics = 0 when audio is NaN
- ✓ Animation speed = 0.5 (baseline) when flux = 0

**Test result:** ✅ ALL TESTS PASSED

## Expected Behavior After Fix
1. **Application startup**: Particles remain completely still
2. **MMPA enabled, no audio input**: Particles remain completely still
3. **MMPA enabled, silent audio (NaN)**: Particles remain completely still
4. **MMPA enabled, active audio**: Particles respond to audio features ✓

## Verification Steps
1. Run test: `node test_mapping_nan_protection.js` (should pass)
2. Launch application
3. Enable MMPA features
4. Verify particles don't move until audio is actually playing
5. Enable audio → particles should now respond

## Related Issues
- Originally identified in Opus analysis report
- Mentioned in `MMPA_ANALYSIS_INDEX.md`, `ISSUE_DIAGNOSIS.md`
- Priority: **HIGH** (significant UX issue)

---

**Fix completed:** 2025-11-12
**Status:** ✅ VERIFIED
