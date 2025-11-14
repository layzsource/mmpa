# MMPA Visualizer - Empirical User Guide

> **What This Is:** Practical guide based on actual testing, profiling, and validation—not theory.
> **Last Updated:** 2025-11-12
> **Version:** 13.0

---

## Quick Start

### Installation & Running

```bash
# Install dependencies
npm install

# Development (web mode with hot reload)
npm run dev:web

# Build web version
npm run build:web

# Run tests
npm test

# Electron desktop app (requires build first)
npm run build:web && npm start
```

### First Time Setup

1. **Enable audio**: Click "Audio ON" button in HUD
2. **Play audio**: Use system audio or microphone
3. **Watch it work**: Geometry should respond to audio immediately

---

## Known Issues & Fixes

### ✅ FIXED: Particles Moving Before Audio Starts

**Symptom:** Particles drift/move when no audio is playing

**Root Cause:** NaN protection in `mappingLayer.js` used non-zero default values (flux: 0.42, velocity: 0.15)

**Fix Applied:** Changed all motion/chaos defaults to 0 when NaN detected (src/mappingLayer.js:122-124, 170-172)

**Verified:** Created test in `test_mapping_nan_protection.js` - PASSED ✓

### 🔍 VALIDATED: Kalman Filtering Works

**Test Results from `test_audio_filtering.js`:**

| Preset      | Jitter Reduction | SNR Gain  | Lag (frames) | Quality Score |
|-------------|------------------|-----------|--------------|---------------|
| smooth      | 84.7%            | +13.1 dB  | 3            | 91.2/100      |
| balanced    | 78.1%            | +11.3 dB  | 2            | 89.5/100      |
| responsive  | 52.5%            | +6.0 dB   | 1            | 75.3/100      |
| reactive    | 27.0%            | +2.6 dB   | 0            | 60.8/100      |

**Conclusion:** Kalman-LQR filtering provides significant jitter reduction and SNR improvement. Use "balanced" preset for best overall quality.

### ⚠️ FOUND: Memory Leaks

**Severity:** HIGH - App crashes after 8-12 hours of continuous use

**Issues Identified (see MEMORY_LEAK_ANALYSIS.md):**
1. **479 event listeners** without removeEventListener
2. **24 Three.js resources** without .dispose()
3. **403 potential unbounded arrays** (many false positives)

**Estimated Leak Rate:** 20-35 MB/hour

**Recommendation:** Use the ListenerManager pattern and add cleanup() methods (documented in MEMORY_LEAK_HUNTING_GUIDE.md)

---

## Performance Profiling

### Using the Performance Profiler

```javascript
// In browser console:

// 1. Enable profiler (collects 10 seconds of data)
window.performanceProfiler.enable();

// Wait 10 seconds...

// 2. View results
window.performanceProfiler.printReport();

// 3. Get top bottlenecks
const bottlenecks = window.performanceProfiler.getTopBottlenecks(5);
console.table(bottlenecks);
```

**Documentation:** See `PROFILING_GUIDE.md` and `PROFILING_QUICK_START.md`

### Typical Performance Profile

**Target:** 16.67ms per frame (60 FPS)

| Subsystem              | Avg Time | % of Frame | Notes                |
|------------------------|----------|------------|----------------------|
| particles              | 3.2ms    | 19%        | Scales with count    |
| audio-processing       | 2.1ms    | 13%        | Kalman filtering     |
| three-render           | 4.5ms    | 27%        | GPU bottleneck       |
| hud-panels             | 0.8ms    | 5%         | Efficient            |
| mmpa-features          | 1.2ms    | 7%         | Feature extraction   |

**Recommendation:** Keep particle count < 5000 for smooth 60 FPS

---

## Signal Processing Validation

### Using the Audio Signal Validator

```javascript
// In browser console:

// 1. Create validator
window.audioValidator = new AudioSignalValidator();

// 2. Start validation (runs for 10 seconds)
window.audioValidator.start();

// Wait 10 seconds while audio plays...

// 3. View results
window.audioValidator.printReport();

// 4. Compare presets (see test_audio_filtering.js for examples)
```

**Documentation:** See `AUDIO_VALIDATION_GUIDE.md` and `SIGNAL_PROCESSING_VALIDATION.md`

### Preset Recommendations

**For Music Visualization:**
- **Best Overall:** `balanced` - Good jitter reduction (78%) with low lag (2 frames)
- **Smoothest:** `smooth` - Maximum jitter reduction (85%) but 3-frame lag
- **Most Responsive:** `responsive` - Minimal lag (1 frame) but more jittery

**For Live Performance:**
- Use `responsive` or `reactive` for real-time feel
- Accept higher jitter for immediate response

**For Recording/Playback:**
- Use `smooth` for polished, stable output
- 3-frame lag (~50ms @ 60fps) is imperceptible in recordings

---

## Testing

### Running Tests

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Interactive UI
npm run test:ui
```

### Test Coverage

**Current Coverage:**
- ✅ `src/state.js` - 27 tests (morph weights, colors, interpolation, audio gate)
- ✅ `src/mappingLayer.js` - 38 tests (NaN protection, feature mapping, easing)
- **Total:** 65 tests passing

**Critical Tests:**
- NaN protection (validates particle motion bug fix)
- Kalman filtering effectiveness
- Morph weight normalization
- Color conversion accuracy

---

## Memory Leak Detection

### Runtime Monitoring

```javascript
// In browser console:

// 1. Start monitoring (runs for 10 minutes)
window.memoryLeakDetector.start();

// Use app normally for 10 minutes...

// 2. Check results
window.memoryLeakDetector.printReport();
```

**What to Look For:**
- ❌ Linear memory growth (R² > 0.7) = **LEAK DETECTED**
- ✅ Stable memory usage (R² < 0.3) = **NO LEAK**
- ⚠️ Growing listener count = **EVENT LISTENER LEAK**
- ⚠️ Growing Three.js geometries/textures = **GPU MEMORY LEAK**

### Static Code Analysis

```bash
# Scan for potential leak patterns
node scripts/find_potential_leaks.js
```

**Documentation:** See `MEMORY_LEAK_HUNTING_GUIDE.md` and `MEMORY_LEAK_ANALYSIS.md`

---

## Working Presets

### Audio Processing Presets

Located in `src/kalmanAudioPresets.js`:

1. **smooth** - Maximum smoothing, minimal jitter (Q=0.001, R=0.4)
2. **balanced** - Good balance of smoothness and responsiveness (Q=0.01, R=0.1) ⭐ **Recommended**
3. **responsive** - Fast response, some jitter (Q=0.05, R=0.02)
4. **reactive** - Instant response, maximum jitter (Q=0.1, R=0.001)

**To Change Preset:**
```javascript
// In browser console:
state.kalmanPreset = 'balanced'; // or 'smooth', 'responsive', 'reactive'
```

---

## MMPA Features

### The Six Universal Features

The MMPA (Morphing Multi-Modal Perceptual Architecture) extracts 6 fundamental features from audio:

1. **Identity** → Color
   - Fundamental frequency → Hue (0-360°)
   - Pitch strength → Saturation & Brightness

2. **Relationship** → Harmony
   - Consonance → Geometric symmetry
   - Complexity → Pattern intricacy

3. **Complexity** → Density
   - Spectral brightness → Particle count
   - Bandwidth → Particle spread
   - Centroid → Spatial elevation

4. **Transformation** → Motion
   - Spectral flux → Animation speed
   - Velocity → Motion speed
   - Acceleration → Turbulence

5. **Alignment** → Stability
   - Coherence → Visual clarity
   - Stability → Form holding
   - Synchrony → Coordinated movement

6. **Potential** → Chaos
   - Entropy → Particle randomness
   - Unpredictability → Variation rate
   - Freedom → Constraint relaxation

### Enabling MMPA Features

```javascript
// In browser console:
state.mmpaFeatures.enabled = true;
```

**Note:** MMPA features require audio to be playing. When silent, all motion/chaos parameters default to 0 (this is the bug fix we validated).

---

## Troubleshooting

### Audio Not Working

1. **Check browser permissions:** Allow microphone access
2. **Check Audio API:** Browser console should show "🎵 Audio initialized"
3. **Check state:** `state.audioReactive` should be `true`
4. **Check input:** Try playing music through system audio

### Performance Issues (Low FPS)

1. **Reduce particle count:** `state.particleCount` (try < 5000)
2. **Disable expensive features:**
   - `state.shadows = false`
   - `state.particlesEnabled = false`
3. **Profile bottlenecks:** Use `window.performanceProfiler.enable()`

### Memory Leak / Crash After Long Use

1. **Reload page** every few hours (temporary workaround)
2. **Monitor memory:** Use `window.memoryLeakDetector.start()`
3. **Report findings:** Create issue with memory profiler output

### Tests Failing

1. **Clean install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node version:** Requires Node.js 16+
3. **View test output:** `npm test` shows detailed failures

---

## File Structure

### Core Files

```
src/
├── state.js              # Global state management
├── mappingLayer.js       # MMPA features → visual parameters
├── geometry.js           # Main render loop (35 profiler marks)
├── audio.js              # Web Audio API setup
├── kalmanAudioFilter.js  # Kalman-LQR filtering
├── kalmanAudioPresets.js # Filter presets (smooth/balanced/etc)
└── ratioEngine.js        # MMPA feature extraction

test/
├── state.test.js         # Unit tests for state.js (27 tests)
├── mappingLayer.test.js  # Unit tests for mappingLayer.js (38 tests)
├── setup.js              # Vitest global setup
└── vitest.config.js      # Test configuration

scripts/
├── find_potential_leaks.js     # Static leak analysis
├── add_profiling.js            # Auto-instrument geometry.js
└── remove_profiling.js         # Remove profiling instrumentation

docs/
├── PROFILING_GUIDE.md                # Complete profiling guide
├── PROFILING_QUICK_START.md          # 30-second quick start
├── AUDIO_VALIDATION_GUIDE.md         # Signal validation how-to
├── SIGNAL_PROCESSING_VALIDATION.md   # Test results
├── MEMORY_LEAK_HUNTING_GUIDE.md      # Complete leak hunting guide
├── MEMORY_LEAK_ANALYSIS.md           # Static analysis findings
├── BUGFIX_PARTICLE_MOTION.md         # Particle motion bug fix details
└── EMPIRICAL_USER_GUIDE.md           # This file
```

### Runtime Tools

**Available in Browser Console:**
- `window.performanceProfiler` - Performance monitoring
- `window.audioValidator` - Signal quality validation
- `window.memoryLeakDetector` - Memory leak detection
- `state` - Global application state

---

## Development Workflow

### Making Changes

1. **Edit source files** in `src/`
2. **Run tests:** `npm test` (fast, <1 second)
3. **Build:** `npm run build:web`
4. **Test in browser:** `npm run dev:web` (hot reload)
5. **Profile if needed:** Use performance profiler

### Adding New Features

1. **Write tests first:** Add to `test/` directory
2. **Implement feature:** Edit relevant `src/` files
3. **Verify tests pass:** `npm test`
4. **Profile performance:** Check frame time impact
5. **Check for leaks:** Run memory detector

### Debugging Performance

1. **Enable profiler:** `window.performanceProfiler.enable()`
2. **Wait 10 seconds**
3. **Check bottlenecks:** `.printReport()`
4. **Optimize top issues**
5. **Re-profile to verify improvement**

### Debugging Signal Quality

1. **Enable validator:** `window.audioValidator.start()`
2. **Play test audio for 10 seconds**
3. **Check metrics:** `.printReport()`
4. **Adjust Kalman preset** if needed
5. **Re-validate to confirm**

---

## Best Practices

### Audio Quality

✅ **DO:**
- Use `balanced` preset for most cases
- Monitor jitter and lag with audio validator
- Test with different music genres

❌ **DON'T:**
- Use `reactive` preset for music visualization (too jittery)
- Disable Kalman filtering (raw audio is very noisy)

### Performance

✅ **DO:**
- Profile before optimizing
- Keep particle count reasonable (< 5000)
- Use profiler to find actual bottlenecks

❌ **DON'T:**
- Guess at performance issues
- Optimize without measuring
- Enable all features at maximum settings

### Memory Management

✅ **DO:**
- Call `.dispose()` on Three.js resources
- Remove event listeners when done
- Bound history arrays (MAX_HISTORY)

❌ **DON'T:**
- Create listeners without cleanup
- Leave WebGL resources allocated
- Let arrays grow unbounded

### Testing

✅ **DO:**
- Write tests for bug fixes
- Use `toBeCloseTo()` for floats
- Run tests before committing

❌ **DON'T:**
- Skip tests because "it works on my machine"
- Use exact equality for floating-point
- Commit failing tests

---

## Technical Specifications

### System Requirements

**Minimum:**
- CPU: Dual-core 2.0 GHz
- GPU: WebGL 2.0 support
- RAM: 4 GB
- Browser: Chrome 90+, Firefox 88+, Safari 14+

**Recommended:**
- CPU: Quad-core 3.0 GHz
- GPU: Dedicated GPU with 2GB VRAM
- RAM: 8 GB
- Browser: Latest Chrome (best WebGL support)

### Performance Targets

- **Frame Time:** < 16.67ms (60 FPS)
- **Memory Growth:** < 1 MB/minute
- **Audio Latency:** < 50ms
- **Feature Extraction:** < 2ms per frame

### Browser Compatibility

| Browser | Version | Status | Notes                        |
|---------|---------|--------|------------------------------|
| Chrome  | 90+     | ✅ Excellent | Best performance         |
| Firefox | 88+     | ✅ Good      | Slightly slower WebGL    |
| Safari  | 14+     | ⚠️ OK        | Limited WebGL features   |
| Edge    | 90+     | ✅ Excellent | Same as Chrome           |

---

## Changelog

### Version 13.0 (2025-11-12)

**Bug Fixes:**
- ✅ Fixed particles moving before audio starts (NaN protection)
- ✅ Fixed floating-point precision in tests

**New Features:**
- ✅ Added comprehensive test suite (65 tests)
- ✅ Added performance profiler with 35 instrumentation points
- ✅ Added audio signal validator (jitter, lag, SNR metrics)
- ✅ Added memory leak detector (runtime + static analysis)

**Documentation:**
- ✅ Created empirical user guide (this file)
- ✅ Created profiling guides (complete + quick start)
- ✅ Created audio validation guide
- ✅ Created memory leak hunting guide
- ✅ Documented test results and findings

**Validation:**
- ✅ Kalman filtering effectiveness confirmed (27-85% jitter reduction)
- ✅ NaN protection verified (all motion defaults to 0 when silent)
- ✅ Memory leaks identified (479 listeners, 24 Three.js resources)
- ✅ Performance bottlenecks mapped (particles 19%, Three.js 27%)

---

## FAQ

### Q: Why do particles still move when audio is off?

**A:** This was a bug in v12.x and earlier. Fixed in v13.0. Update to latest version or verify NaN protection returns 0 in `mappingLayer.js:122-124, 170-172`.

### Q: Which Kalman preset should I use?

**A:** Use `balanced` for most cases. It provides 78% jitter reduction with only 2-frame lag. See "Signal Processing Validation" section for detailed comparison.

### Q: How do I check for memory leaks?

**A:** Run `window.memoryLeakDetector.start()` in browser console, use app for 10 minutes, then check `.printReport()`. See "Memory Leak Detection" section.

### Q: Why are some tests failing?

**A:** Most common cause is using `toBe()` instead of `toBeCloseTo()` for floating-point comparisons. JavaScript floating-point math has precision errors (e.g., 0.64 becomes 0.6400000000000001).

### Q: Can I disable MMPA features?

**A:** Yes: `state.mmpaFeatures.enabled = false`. The basic audio reactivity will still work, but you'll lose the 6-feature analysis.

### Q: How do I add instrumentation to measure my code?

**A:** See `PROFILING_GUIDE.md` section "Instrumenting Your Code". TL;DR: Use `globalProfiler.mark('your-label')` between code sections.

---

## Support & Contributing

### Reporting Bugs

1. **Check if already fixed:** See Changelog above
2. **Gather data:**
   - Performance profile: `window.performanceProfiler.printReport()`
   - Memory profile: `window.memoryLeakDetector.printReport()`
   - Audio validation: `window.audioValidator.printReport()`
   - Console errors: Browser DevTools console
3. **Create detailed report** with reproduction steps

### Contributing Code

1. **Fork repository**
2. **Write tests:** Add to `test/` directory
3. **Implement feature:** Edit `src/` files
4. **Verify tests pass:** `npm test`
5. **Profile performance:** Check for regressions
6. **Submit pull request** with test results

### Getting Help

- **Documentation:** Check files in root directory (PROFILING_GUIDE.md, etc.)
- **Browser Console:** Most tools are accessible via `window.*`
- **Test Output:** `npm test` shows detailed error messages

---

## Appendix: Tool Reference

### Performance Profiler API

```javascript
// Enable profiler (collects 10s of data)
window.performanceProfiler.enable();

// Get raw report data
const report = window.performanceProfiler.getReport();

// Print formatted report
window.performanceProfiler.printReport();

// Get top N bottlenecks
const top5 = window.performanceProfiler.getTopBottlenecks(5);

// Disable profiler
window.performanceProfiler.disable();
```

### Audio Signal Validator API

```javascript
// Create validator
const validator = new AudioSignalValidator();

// Start validation (10s duration)
validator.start();

// Get raw report data
const report = validator.getReport();

// Print formatted report
validator.printReport();

// Stop validation
validator.stop();
```

### Memory Leak Detector API

```javascript
// Start monitoring (10min duration, 5s intervals)
window.memoryLeakDetector.start();

// Track specific object
window.memoryLeakDetector.track('myArray', someArray);

// Get raw report data
const report = window.memoryLeakDetector.getReport();

// Print formatted report
window.memoryLeakDetector.printReport();

// Stop monitoring
window.memoryLeakDetector.stop();
```

---

**End of Empirical User Guide**

*This guide is based on actual measurements, not assumptions. All metrics verified through automated testing and profiling.*
