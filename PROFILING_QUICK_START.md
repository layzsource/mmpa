# Performance Profiling - Quick Start

## ✅ Setup Complete!

Your application is now instrumented with 35 performance measurement points.

## 🚀 How to Use

### 1. Launch Application

```bash
npm start
# or
npm run dev
```

### 2. Open DevTools

Press `Cmd+Option+I` (Mac) or `Ctrl+Shift+I` (Windows/Linux)

### 3. Enable Profiler (in Console)

```javascript
// Start profiling
window.performanceProfiler.enable();

// Wait 10 seconds for automatic report
// OR trigger manually:
window.performanceProfiler.printReport();
```

### 4. Read the Report

You'll see output like:

```
📊 ═══════════════════════════════════════════════════════════
📊 PERFORMANCE PROFILER REPORT
📊 ═══════════════════════════════════════════════════════════

⏱️  Frame Statistics (300 frames):
   Average FPS: 58.3
   Min FPS: 45.2
   Max FPS: 60.0

🔥 Top 10 Subsystems by Time:
───────────────────────────────────────────────────────────────
Rank | Subsystem                  | Avg(ms) | Max(ms) |  % Frame
───────────────────────────────────────────────────────────────
   1 | particles                  |   5.234 |  12.456 |   31.2%
   2 | visual-background          |   2.891 |   8.123 |   17.3%
   3 | compositor-render          |   2.456 |   5.678 |   14.7%
   ...
```

**What to look for:**
- ✅ Total frame time < 16.67ms (60fps)
- ⚠️ Any subsystem > 5ms = bottleneck
- 🚨 Any subsystem > 10ms = major problem

## 🔍 Quick Checks

### Get Top Bottlenecks

```javascript
window.performanceProfiler.getTopBottlenecks(5);
// Returns array of top 5 slowest subsystems
```

### Reset and Profile Again

```javascript
window.performanceProfiler.reset();
// Clears all data, starts fresh
```

### Disable Profiling

```javascript
window.performanceProfiler.disable();
// Stops measuring (zero performance impact)
```

## 🎯 Common Bottlenecks & Fixes

### Particles (> 5ms)
```javascript
// Reduce particle count
state.particlesCount = 1000; // down from 5000
```

### Visual Background (> 3ms)
```javascript
// Disable expensive effects
state.acidEmpire.enabled = false;
state.luminousTessellation.enabled = false;
```

### Voxel Systems (> 2ms)
```javascript
// Lower resolution
state.voxelWave.cellSize = 2.0; // larger cells
```

### MMPA Mapping (> 1ms)
```javascript
// Disable MMPA
state.mmpaFeatures.enabled = false;
```

## 📈 Chrome DevTools Performance Tab

For deeper analysis:

1. DevTools → **Performance** tab
2. Click **Record (●)**
3. Let run for 5-10 seconds
4. Click **Stop**
5. Analyze flame graph

**Look for:**
- Long yellow bars = JavaScript bottlenecks
- Long purple bars = Layout/rendering
- Repeated patterns = animation loop systems

## 🧹 Remove Instrumentation

When you're done profiling:

```bash
node scripts/remove_profiling.js
```

This removes all profiler code and restores original `geometry.js`.

## 📊 35 Instrumented Subsystems

1. spatial-grammar
2. gamepad
3. orbit-controls
4. interpolation
5. morph-chain
6. mmpa-mapping
7. mmpa-apply
8. geometry-transform
9. audio-update
10. geometry-state
11. platonic-morph
12. shadows
13. particles
14. sprites
15. visual-background
16. cellular-automata
17. voxel-floor
18. voxel-mist
19. emoji-particles
20. emoji-streams
21. emoji-sequencer
22. mandala
23. vessel
24. humanoid
25. archetype-morph
26. shadow-projection
27. navigation
28. perception-state
29. game-mode
30. destination-authoring
31. glyph-renderer
32. shadow-box
33. compositor-render
34. shadow-layer
35. timeline-capture

## 🎓 More Info

See `PROFILING_GUIDE.md` for detailed documentation.

---

**Created:** 2025-11-12
**Status:** ✅ Ready to profile!
