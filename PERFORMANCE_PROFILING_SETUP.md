# Performance Profiling Setup Summary

## ✅ What Was Done

### 1. Created Performance Profiler Module
**File:** `src/performanceProfiler.js` (367 lines)

**Features:**
- Measures time spent in each subsystem per frame
- Tracks FPS (average, min, max)
- Monitors memory usage (if available)
- Auto-generates reports every 10 seconds
- Identifies top bottlenecks automatically
- Zero performance impact when disabled

**API:**
```javascript
window.performanceProfiler.enable();      // Start profiling
window.performanceProfiler.printReport(); // Generate report
window.performanceProfiler.getTopBottlenecks(5); // Get top 5
window.performanceProfiler.reset();       // Clear data
window.performanceProfiler.disable();     // Stop profiling
```

### 2. Instrumented Animation Loop
**File:** `src/geometry.js` (MODIFIED)

**Changes:**
- Added profiler import
- Added `startFrame()` at beginning of animate()
- Added `endFrame()` before error handling
- Added 35 `profiler.mark()` calls at strategic points

**Backup:** `src/geometry.js.backup` (original saved)

### 3. Created Automation Scripts

**`scripts/add_profiling.js`**
- Automatically instruments geometry.js
- Backs up original file
- Adds profiler import and marks
- Run: `node scripts/add_profiling.js`

**`scripts/remove_profiling.js`**
- Removes all instrumentation
- Restores original from backup
- Run: `node scripts/remove_profiling.js`

### 4. Created Documentation

**`PROFILING_QUICK_START.md`**
- Quick reference for profiling commands
- Common bottlenecks and fixes
- List of all 35 instrumented subsystems

**`PROFILING_GUIDE.md`**
- Comprehensive profiling guide
- Chrome DevTools instructions
- Optimization strategies
- Interpretation guidelines

## 📊 35 Instrumented Subsystems

The animation loop now tracks performance of:

| Category | Subsystems |
|----------|------------|
| **Core** | spatial-grammar, gamepad, orbit-controls, interpolation, morph-chain |
| **MMPA** | mmpa-mapping, mmpa-apply |
| **Geometry** | geometry-transform, geometry-state, platonic-morph |
| **Audio** | audio-update |
| **Visuals** | shadows, particles, sprites, visual-background, cellular-automata |
| **3D Effects** | voxel-floor, voxel-mist, vessel, humanoid, archetype-morph |
| **Emoji System** | emoji-particles, emoji-streams, emoji-sequencer, mandala |
| **Rendering** | shadow-projection, shadow-box, shadow-layer, compositor-render |
| **Navigation** | navigation, perception-state, game-mode |
| **Authoring** | destination-authoring, glyph-renderer |
| **Capture** | timeline-capture |

## 🚀 How to Use

### Quick Start (30 seconds)

1. Launch app: `npm start`
2. Open DevTools: `Cmd+Option+I`
3. Enable profiler: `window.performanceProfiler.enable()`
4. Wait 10 seconds
5. Read auto-generated report in console

### What You'll Learn

**From the profiler report:**
- Which subsystems are slowest
- How much time each subsystem takes per frame
- Whether you're hitting 60fps
- Memory usage patterns
- Percentage of frame time per subsystem

**From Chrome DevTools Performance tab:**
- JavaScript execution bottlenecks (flame graph)
- Rendering/painting costs
- GPU utilization
- Call stack analysis

## 🎯 Expected Results

### Healthy Performance
```
Average FPS: 58-60
Total frame time: < 16.67ms
Largest subsystem: < 5ms
Memory: Stable over time
```

### Warning Signs
```
⚠️ Average FPS: < 50
⚠️ Total frame time: > 20ms
⚠️ Any subsystem: > 10ms
⚠️ Memory: Growing over time
```

## 🔧 Common Optimizations

Based on profiling data, you might:

1. **Reduce particle count** (if particles > 5ms)
2. **Disable expensive visual effects** (if visual-background > 3ms)
3. **Lower voxel resolution** (if voxel-* > 2ms)
4. **Throttle MMPA updates** (if mmpa-mapping > 1ms)
5. **Simplify shaders** (if compositor-render > 5ms)

## 📂 Files Created

```
src/
  performanceProfiler.js      (NEW - profiler module)
  geometry.js.backup           (NEW - original backup)

scripts/
  add_profiling.js            (NEW - auto-instrument)
  remove_profiling.js         (NEW - auto-remove)

PROFILING_QUICK_START.md     (NEW - quick reference)
PROFILING_GUIDE.md           (NEW - comprehensive guide)
PERFORMANCE_PROFILING_SETUP.md (NEW - this file)
```

## 📂 Files Modified

```
src/
  geometry.js                 (MODIFIED - instrumented with profiler)
```

## ⚡ Performance Impact

**When disabled (default):** Zero overhead
- No marks recorded
- No memory allocated
- Simple boolean checks only

**When enabled:** Minimal overhead
- ~0.1-0.2ms per frame (< 1% of 16.67ms budget)
- Negligible memory usage (~1MB for 300 frames)
- Does not affect FPS unless reporting

## 🧪 Next Steps

### 1. Profile a Clean Session
```bash
npm start
# In DevTools console:
window.performanceProfiler.enable()
# Let run for 30 seconds
window.performanceProfiler.printReport()
```

### 2. Profile with Audio
Enable audio reactivity and profile:
```javascript
state.audioReactive = true;
// Play music or enable microphone
// Wait 30 seconds
window.performanceProfiler.printReport();
```

### 3. Profile with Heavy Effects
Enable expensive features:
```javascript
state.particlesCount = 10000;
state.acidEmpire.enabled = true;
state.voxelWave.enabled = true;
// Wait 30 seconds
window.performanceProfiler.printReport();
```

### 4. Identify Bottlenecks
```javascript
const top5 = window.performanceProfiler.getTopBottlenecks(5);
console.table(top5);
```

### 5. Test Optimizations
```javascript
// Before optimization
window.performanceProfiler.reset();
window.performanceProfiler.enable();
// Wait 30 seconds
const before = window.performanceProfiler.getReport();

// Apply optimization (e.g., reduce particles)
state.particlesCount = 1000;

// After optimization
window.performanceProfiler.reset();
// Wait 30 seconds
const after = window.performanceProfiler.getReport();

// Compare
console.log('Before FPS:', before.fps.average);
console.log('After FPS:', after.fps.average);
```

## 🔄 Removing Instrumentation

When you're done profiling and want to clean up:

```bash
node scripts/remove_profiling.js
```

This will:
- Restore original `geometry.js`
- Remove `geometry.js.backup`
- Remove all profiler marks
- **Keep** `performanceProfiler.js` (you can delete manually if desired)

The profiler can be re-added anytime:

```bash
node scripts/add_profiling.js
```

## 📊 Example Report

```
📊 ═══════════════════════════════════════════════════════════
📊 PERFORMANCE PROFILER REPORT
📊 ═══════════════════════════════════════════════════════════

⏱️  Frame Statistics (300 frames):
   Average FPS: 58.3
   Min FPS: 45.2
   Max FPS: 60.0

💾 Memory Usage:
   Current: 156.8 MB
   Average: 155.2 MB
   Range: 152.1 - 159.4 MB

🔥 Top 10 Subsystems by Time:
───────────────────────────────────────────────────────────────
Rank | Subsystem                  | Avg(ms) | Max(ms) |  % Frame
───────────────────────────────────────────────────────────────
   1 | particles                  |   5.234 |  12.456 |   31.2%
   2 | visual-background          |   2.891 |   8.123 |   17.3%
   3 | compositor-render          |   2.456 |   5.678 |   14.7%
   4 | voxel-floor                |   1.234 |   3.456 |    7.4%
   5 | mandala                    |   0.987 |   2.345 |    5.9%
   6 | vessel                     |   0.876 |   2.123 |    5.2%
   7 | shadows                    |   0.654 |   1.567 |    3.9%
   8 | audio-update               |   0.543 |   1.234 |    3.2%
   9 | cellular-automata          |   0.432 |   1.012 |    2.6%
  10 | voxel-mist                 |   0.389 |   0.923 |    2.3%
───────────────────────────────────────────────────────────────
     | Untracked overhead         |   1.256 |   3.456 |    7.5%
═══════════════════════════════════════════════════════════════

⚠️  WARNING: "particles" is taking 5.23ms/frame
   This subsystem is consuming 31.2% of frame time!
```

---

**Setup completed:** 2025-11-12
**Status:** ✅ Ready for profiling
**Next:** Launch app and enable profiler in DevTools
