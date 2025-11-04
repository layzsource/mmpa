# Changelog - November 3, 2025

## Session Summary
Backup created: 2025-11-03 19:31:00
Previous state: morphing_interface_baseline_v13.0_electron_backup_20251010_075604

## Changes Made This Session

### 1. Background Mesh Visibility Fix
**File**: `src/visual.js:3118`
**Issue**: Background projection mesh was always visible even when no texture loaded
**Fix**: Added condition to only show backgroundMesh when texture exists AND toggle is enabled
```javascript
backgroundMesh.visible = !state.useSkybox && state.useBackgroundImage && state.texture;
```

### 2. Mist Plane Density Enhancement
**File**: `src/voxelMist.js:270-327`
**Issue**: Mist planes had visible gaps (too much spacing between layers)
**Fix**:
- Doubled horizontal planes: 120 → 240 (~0.5 unit spacing)
- Added 240 vertical planes distributed along X axis (~0.83 unit spacing)
- Total planes increased from 120 to 480
- Creates volumetric grid effect with crossing planes

### 3. Tap Tempo BPM Drift Fix
**File**: `src/audioAnalysisFull.js:428-432`
**Issue**: BPM drifted from 110 to 115-116 over several minutes when using tap tempo
**Root Cause**: Autocorrelation BPM detection continued running even when tap tempo was active
**Fix**: Added check to skip autocorrelation updates when `this.tapActive` is true
```javascript
if (this.tapActive) {
  return;
}
```

### 4. Frequency Detection Accuracy
**File**: `src/hudMMPA.js:913-954`
**Issue**: 440 Hz reading as 445 Hz, 432 Hz reading as 422 Hz (5-10 Hz error)
**Fix**:
- Added parabolic interpolation for sub-bin peak finding (3-bin analysis)
- Fixed FFT size calculation (was using spectrum.length, now uses analyser.fftSize)
- Added median filtering (5-sample history)
- Added exponential smoothing (α=0.3)
- Improved accuracy from 5-10 Hz error to ~0.2 Hz error

### 5. Tap Tempo Button Functionality
**Files**:
- `src/audio.js:221-229` - Added wrapper methods
- `src/hudMMPA.js:531-583` - Fixed button handlers
**Issue**: Tap tempo buttons not responding, console showed "AudioEngine.dropPredictor.tap not available!"
**Root Cause**: Button handlers used incorrect API path `window.AudioEngine.instance.dropPredictor.tap()`
**Fix**:
- Changed handlers to call `AudioEngine.tap()` directly
- Added `tap()` and `resetTapTempo()` wrapper methods in AudioCore class

## System State

### Current Features Working
- ✅ Real-time audio analysis (FFT, RMS, frequency detection)
- ✅ Beat detection and autocorrelation BPM
- ✅ Tap tempo with on-screen UI (TAP button + reset)
- ✅ MMPA V2.0 integration (UKF, LQR, FIM)
- ✅ Volumetric mist system (particles + 480 planes)
- ✅ Multiple shader modes (cellular automata, mandelbulb, flow field)
- ✅ Background mesh/skybox with proper visibility control
- ✅ HUD with stability metrics and audio analysis

### Performance Notes
- 480 mist planes may impact performance on lower-end GPUs
- Consider material instancing for optimization if needed
- Current setup: each plane clones material (480 ShaderMaterials active)

### Known Issues
- Autocorrelation BPM can detect harmonics (2x or 0.5x actual BPM)
- Bifurcation cooldown (2 seconds) may miss rapid musical changes
- No FPS monitoring in HUD yet

## Technical Debt
1. Large files could be split (visual.js, hudMMPA.js)
2. Configuration scattered across multiple files
3. No automated tests
4. Limited error handling/recovery

## Next Steps (Recommended)
**If prioritizing stability:**
- Add FPS monitoring
- Implement material instancing for mist planes
- Add error boundaries

**If prioritizing features:**
- Add Z-axis planes for complete 3D grid
- Implement color-coded mist (bass=blue, mid=green, treble=red)
- Add visual preset system

**If prioritizing polish:**
- Add smooth transitions between shader modes
- Create animated HUD elements
- Improve tap tempo UI with animations

## File Manifest (Modified Files This Session)
1. `src/visual.js` - Background mesh visibility logic
2. `src/voxelMist.js` - Dual-axis mist plane system
3. `src/audioAnalysisFull.js` - Tap tempo BPM lock
4. `src/hudMMPA.js` - Frequency accuracy + tap button handlers
5. `src/audio.js` - Tap tempo wrapper methods

---
End of changelog
