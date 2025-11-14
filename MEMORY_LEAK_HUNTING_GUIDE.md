# Memory Leak Hunting Guide

## Quick Start

### 1. Launch Application and Start Detector

```bash
npm start
# Press Cmd+Option+I (Mac) to open DevTools
```

### 2. Start Long-Running Monitor (in Console)

```javascript
// Start 10-minute monitoring session
window.memoryLeakDetector.start();

// Let it run for 10+ minutes while using the app normally
// Play music, switch presets, enable/disable features

// After 10 minutes, get report:
window.memoryLeakDetector.printReport();
```

## What Gets Monitored

### 1. Heap Memory Growth
**What:** Total JavaScript heap size over time
**Leak Indicator:** Linear growth (R² > 0.7) with positive slope
**Goal:** Heap should stabilize after initial allocation

### 2. Event Listeners
**What:** Count of active event listeners
**Leak Indicator:** Growing listener count
**Goal:** Listener count should remain stable

### 3. Three.js Resources
**What:** Geometries and textures not disposed
**Leak Indicator:** Growing geometry/texture count
**Goal:** Counts should stabilize or decrease

### 4. Tracked Arrays/Objects
**What:** Specific arrays you mark for monitoring
**Leak Indicator:** Unbounded growth
**Goal:** Arrays should have max size or cleanup logic

## Common Leak Patterns

### Pattern 1: Unbounded History Arrays

**Problem:**
```javascript
// BAD: Array grows forever
this.history = [];
function update() {
  this.history.push(data); // Never cleaned up!
}
```

**Solution:**
```javascript
// GOOD: Bounded array with cleanup
this.history = [];
this.maxHistory = 100;

function update() {
  this.history.push(data);
  if (this.history.length > this.maxHistory) {
    this.history.shift(); // Remove oldest
  }
}
```

**Example in MMPA:**
- `audioKalmanFilter.js:54` - Has `historyLimit: 100` ✅
- `performanceProfiler.js` - Has `sampleSize` limit ✅
- Check other history arrays in codebase

### Pattern 2: Event Listener Leaks

**Problem:**
```javascript
// BAD: Listener added but never removed
function init() {
  window.addEventListener('resize', handleResize);
}
// Component unmounts but listener stays!
```

**Solution:**
```javascript
// GOOD: Store reference and clean up
function init() {
  this.handleResize = () => { ... };
  window.addEventListener('resize', this.handleResize);
}

function cleanup() {
  window.removeEventListener('resize', this.handleResize);
}
```

**Check in MMPA:**
```bash
grep -r "addEventListener" src/ | wc -l
grep -r "removeEventListener" src/ | wc -l
# If adds >> removes, potential leaks!
```

### Pattern 3: Three.js Resource Leaks

**Problem:**
```javascript
// BAD: Geometry created but never disposed
function createParticles() {
  const geometry = new THREE.BufferGeometry();
  // Used once, then abandoned
}
```

**Solution:**
```javascript
// GOOD: Dispose when done
function cleanup() {
  geometry.dispose();
  material.dispose();
  texture.dispose();
}
```

**In MMPA, check:**
- Particle system disposal
- Visual mode switching (are old textures disposed?)
- Preset loading (are old geometries cleaned up?)

### Pattern 4: Closures Capturing Large Objects

**Problem:**
```javascript
// BAD: Closure captures entire large object
const hugeData = loadData(); // 100MB

setTimeout(() => {
  console.log(hugeData.oneField); // Keeps all 100MB in memory!
}, 1000);
```

**Solution:**
```javascript
// GOOD: Extract only what you need
const hugeData = loadData();
const onlyThis = hugeData.oneField; // Grab specific field

setTimeout(() => {
  console.log(onlyThis); // Only keeps small value
}, 1000);

hugeData = null; // Allow GC
```

## Tracking Specific Objects

### Track an Array for Growth

```javascript
// In your code, find arrays that might grow unbounded
// Example: particle history

// Track it:
window.memoryLeakDetector.track('particleHistory', particleSystemInstance.history);

// Start monitoring:
window.memoryLeakDetector.start();

// After 10 minutes:
window.memoryLeakDetector.printReport();
// Will show if particleHistory is growing unboundedly
```

### Example: Track Multiple Arrays

```javascript
// Track all suspicious arrays
window.memoryLeakDetector.track('kalmanHistory', audioEngine.kalmanFilter.bassFilter.history.raw);
window.memoryLeakDetector.track('performanceFrames', globalProfiler.frames);
window.memoryLeakDetector.track('presetList', state.presets);
window.memoryLeakDetector.track('audioBands', audioEngine.bands);

window.memoryLeakDetector.start();
```

## Chrome DevTools Memory Profiling

### Heap Snapshot Comparison

1. **Baseline snapshot:**
   - DevTools → Memory → Take snapshot

2. **Use the app for 5-10 minutes:**
   - Switch presets
   - Enable/disable features
   - Play audio

3. **Second snapshot:**
   - Take another snapshot

4. **Compare:**
   - Select second snapshot
   - Change view to "Comparison"
   - Look for:
     - Detached DOM nodes (memory leaks)
     - Large arrays growing
     - Objects with high retention count

### Allocation Timeline

1. **DevTools → Memory → Allocation instrumentation on timeline**
2. **Click Record**
3. **Use the app normally for 2-3 minutes**
4. **Stop recording**
5. **Look for:**
   - Blue bars that never turn gray (never freed)
   - Steadily increasing allocations
   - Objects that accumulate over time

## Known Suspicious Areas in MMPA

### 1. Particle System History (particles.js)
```javascript
// Check: driftOffsets array - does it grow?
// Check: trail history arrays
// Check: velocity storage
```

**Test:**
```javascript
window.memoryLeakDetector.track('particleCount', state.particlesCount);
window.memoryLeakDetector.start();
// Change particle count multiple times
// Check if old particles are properly disposed
```

### 2. Audio History Buffers (audio.js, audioKalmanFilter.js)
```javascript
// audioKalmanFilter.js has historyLimit: 100 ✅
// But check if history is actually trimmed
```

**Test:**
```javascript
window.memoryLeakDetector.track('kalmanHistoryBass',
  audioEngine.kalmanFilter.bassFilter.history.raw);
window.memoryLeakDetector.start();
// Let audio run for 10 minutes
// Verify history stays at 100 items
```

### 3. Performance Profiler Frames (performanceProfiler.js)
```javascript
// Has sampleSize: 300 ✅
// But verify trimming works
```

**Test:**
```javascript
window.memoryLeakDetector.track('profilerFrames',
  window.performanceProfiler.frames);
window.performanceProfiler.enable();
window.memoryLeakDetector.start();
```

### 4. Visual Mode Textures (visual.js)
```javascript
// When switching visual modes, are old textures disposed?
```

**Test:**
```javascript
window.memoryLeakDetector.start();

// Switch between visual modes repeatedly
state.acidEmpire.enabled = true;
// Wait 1 minute...
state.acidEmpire.enabled = false;
state.voxelWave.enabled = true;
// Wait 1 minute...
state.voxelWave.enabled = false;
state.luminousTessellation.enabled = true;
// Repeat 10 times...

window.memoryLeakDetector.printReport();
// Check for texture growth
```

### 5. Preset Loading (presetRouter.js)
```javascript
// When loading presets, are old states cleaned up?
```

**Test:**
```javascript
window.memoryLeakDetector.start();

// Load different presets repeatedly
for (let i = 0; i < 20; i++) {
  // Load preset
  // Wait
  // Load different preset
}

window.memoryLeakDetector.printReport();
```

### 6. MMPA Bridge History (audioMMPABridge.js)
```javascript
// Check: UKF prediction history
// Check: Feature importance buffers
```

**Test:**
```javascript
// Find and track MMPA history arrays
window.memoryLeakDetector.track('mmpaHistory', audioEngine.mmpaBridge.someHistoryArray);
```

## Interpreting Results

### ✅ Good (No Leak)
```
💾 Memory Analysis:
   Start: 150.2 MB
   End: 155.8 MB
   Change: +5.6 MB
   Growth Rate: +0.56 MB/min
   Linear Growth: ✓ No (R² = 0.234)
```
**Interpretation:** Small growth, not linear (R² < 0.7), likely normal allocation

### ⚠️ Suspicious (Possible Leak)
```
💾 Memory Analysis:
   Start: 150.2 MB
   End: 180.4 MB
   Change: +30.2 MB
   Growth Rate: +3.02 MB/min
   Linear Growth: ⚠️  YES (R² = 0.891)
```
**Interpretation:** Large, linear growth (R² = 0.89) - likely memory leak!

### 🚨 Definite Leak
```
📡 Event Listeners:
   Initial: 45
   Current: 245
   Growth: +200

🎨 Three.js Resources:
   Geometries: 23 → 523 (+500)
   Textures: 8 → 158 (+150)
```
**Interpretation:** Listeners/resources accumulating - definite leaks!

## Fixing Common Leaks

### Fix 1: Add History Limits

```javascript
// Find unbounded arrays
grep -r "\.push(" src/ | grep -v "shift\|slice\|splice"

// Add limits to each:
if (this.history.length > this.maxHistory) {
  this.history.shift();
}
```

### Fix 2: Remove Event Listeners

```javascript
// Find addEventListener without corresponding removeEventListener
grep -r "addEventListener" src/ > adds.txt
grep -r "removeEventListener" src/ > removes.txt
# Compare files

// Add cleanup:
class MyComponent {
  constructor() {
    this.listeners = [];
  }

  addListener(target, event, handler) {
    target.addEventListener(event, handler);
    this.listeners.push({ target, event, handler });
  }

  cleanup() {
    for (const { target, event, handler } of this.listeners) {
      target.removeEventListener(event, handler);
    }
    this.listeners = [];
  }
}
```

### Fix 3: Dispose Three.js Resources

```javascript
// When switching visual modes:
function cleanupOldMode() {
  if (this.oldGeometry) {
    this.oldGeometry.dispose();
    this.oldGeometry = null;
  }
  if (this.oldMaterial) {
    this.oldMaterial.dispose();
    this.oldMaterial = null;
  }
  if (this.oldTexture) {
    this.oldTexture.dispose();
    this.oldTexture = null;
  }
}
```

## Automated Leak Detection Script

Save this to `scripts/find_potential_leaks.sh`:

```bash
#!/bin/bash

echo "🔍 Searching for potential memory leaks..."

echo "\n📊 Unbounded arrays (push without limits):"
grep -rn "\.push(" src/ | grep -v "shift\|splice\|slice\|pop\|length >" | head -20

echo "\n📡 addEventListener without removeEventListener:"
comm -23 <(grep -rh "addEventListener" src/ | sort) <(grep -rh "removeEventListener" src/ | sort) | head -10

echo "\n🎨 Three.js objects without dispose:"
grep -rn "new THREE" src/ | grep -v "dispose" | head -20

echo "\n💾 Large object allocations:"
grep -rn "new Array\|new Set\|new Map" src/ | head -20
```

Run:
```bash
chmod +x scripts/find_potential_leaks.sh
./scripts/find_potential_leaks.sh
```

---

**Created:** 2025-11-12
**Status:** ✅ Ready for leak hunting
**Tools:** memoryLeakDetector.js, Chrome DevTools, search scripts
