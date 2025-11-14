# MMPA Performance Profiling Guide

## Quick Start

### 1. Enable Profiling in Browser Console

Open the Electron app, then open DevTools (Cmd+Option+I on Mac) and run:

```javascript
// Enable profiling
window.performanceProfiler.enable();

// Wait 10 seconds for auto-report, or manually trigger:
window.performanceProfiler.printReport();

// Get top bottlenecks programmatically:
window.performanceProfiler.getTopBottlenecks(5);
```

### 2. Instrument the Animation Loop

Add this to the top of `src/geometry.js`:

```javascript
import { globalProfiler } from './performanceProfiler.js';
```

Then modify the `animate()` function:

```javascript
function animate() {
  requestAnimationFrame(animate);

  // START PROFILING
  globalProfiler.startFrame();

  try {
    const deltaTime = morphClock.getDelta();
    const fpDelta = fpClock.getDelta();

    globalProfiler.mark('spatial-grammar');
    updateSpatialGrammar();

    globalProfiler.mark('gamepad');
    if (window.gamepadManager) {
      window.gamepadManager.update();
    }

    globalProfiler.mark('orbit-controls');
    if (orbitControls.enabled) {
      orbitControls.update();
    }

    globalProfiler.mark('interpolation');
    updateInterpolation();

    globalProfiler.mark('morph-chain');
    updateChain();

    globalProfiler.mark('mmpa-mapping');
    const mmpaVisuals = mapFeaturesToVisuals(state.mmpaFeatures);

    globalProfiler.mark('mmpa-apply');
    if (mmpaVisuals && ambientLight) {
      const [r, g, b] = mmpaVisuals.coreColor;
      ambientLight.color.setRGB(r, g, b);

      if (state.mmpaFeatures.enabled) {
        const entropyInfluence = mmpaVisuals.particleRandomness * 0.01;
        morphMesh.rotation.z += entropyInfluence * (Math.random() - 0.5);
      }
    }

    globalProfiler.mark('geometry-transform');
    const mmpaSpeed = mmpaVisuals?.animationSpeed || 1.0;
    const rotX = ((state.idleSpin ? 0.01 : 0) + state.rotationX) * mmpaSpeed;
    const rotY = ((state.idleSpin ? 0.01 : 0) + state.rotationY) * mmpaSpeed;
    const scale = state.scale;
    morphMesh.rotation.x += rotX;
    morphMesh.rotation.y += rotY;
    morphMesh.scale.set(scale, scale, scale);

    globalProfiler.mark('audio-update');
    if (state.audioReactive) updateAudio();

    globalProfiler.mark('geometry-state');
    updateGeometryFromState();
    updateMorphVisibility();

    globalProfiler.mark('platonic-morph');
    updatePlatonicMorph(state.geometry.activeNotes, deltaTime, 1.0);

    globalProfiler.mark('shadows');
    updateShadows(state.audioReactive);

    globalProfiler.mark('particles');
    if (state.particlesEnabled) {
      updateParticles(state.audioReactive, performance.now() * 0.001, mmpaVisuals);
    }

    globalProfiler.mark('sprites');
    updateSprites();

    globalProfiler.mark('visual-background');
    updateVisual(camera, mmpaVisuals);

    globalProfiler.mark('cellular-automata');
    updateCellularAutomata(renderer);

    globalProfiler.mark('voxel-floor');
    updateVoxelFloor(performance.now() * 0.001);

    globalProfiler.mark('voxel-mist');
    updateVoxelMist(performance.now() * 0.001, camera);

    globalProfiler.mark('emoji-particles');
    if (window.emojiParticles) {
      const audioLevel = state?.audio?.level ?? 0;
      window.emojiParticles.update(audioLevel);
    }

    globalProfiler.mark('emoji-streams');
    if (window.emojiStreamManager) {
      const audioLevel = state?.audio?.level ?? 0;
      window.emojiStreamManager.update(audioLevel);
    }

    globalProfiler.mark('emoji-sequencer');
    if (window.emojiSequencer) {
      window.emojiSequencer.update();
    }

    globalProfiler.mark('mandala');
    if (window.mandalaController) {
      const audioLevel = state?.audio?.level ?? 0;
      window.mandalaController.update(audioLevel);
    }

    globalProfiler.mark('vessel');
    updateVessel(camera);

    globalProfiler.mark('humanoid');
    updateHumanoid(morphMesh.position);

    globalProfiler.mark('archetype-morph');
    updateArchetypeMorph(deltaTime);

    globalProfiler.mark('shadow-projection');
    renderShadowProjection();

    globalProfiler.mark('navigation');
    if (window.fpControls) {
      window.fpControls.update(fpDelta);
    }
    if (window.fieldNavigationSystem && window.destinationManager) {
      window.fieldNavigationSystem.update(performance.now(), window.destinationManager, camera);
    }
    if (window.vcnPanel && window.vcnPanel.isOpen) {
      window.vcnPanel.update(camera);
    }

    globalProfiler.mark('perception-state');
    if (window.perceptionState) {
      window.perceptionState.update(fpDelta);
    }

    globalProfiler.mark('game-mode');
    if (window.gameMode) {
      window.gameMode.update(fpDelta);
      // ... game mode HUD updates
    }

    globalProfiler.mark('destination-authoring');
    if (window.destinationAuthoring) {
      window.destinationAuthoring.updateMarkers(performance.now() * 0.001);
    }
    if (window.destinationNavigator) {
      window.destinationNavigator.update();
    }

    globalProfiler.mark('glyph-renderer');
    if (window.glyphRenderer) {
      window.glyphRenderer.update();
    }

    globalProfiler.mark('shadow-box');
    const shadowBox = getShadowBox();
    if (shadowBox) {
      shadowBox.render(scene);
    }

    globalProfiler.mark('compositor-render');
    if (state.motionTrailsEnabled) {
      afterimagePass.uniforms['damp'].value = state.motionTrailIntensity;
      afterimagePass.enabled = true;
    } else {
      afterimagePass.enabled = false;
    }
    composer.render();

    globalProfiler.mark('shadow-layer');
    if (typeof window.renderShadowLayer === 'function') {
      window.renderShadowLayer();
    }

    globalProfiler.mark('timeline-capture');
    if (window.captureTimelineFrame) {
      window.captureTimelineFrame();
    }

    // END PROFILING
    globalProfiler.endFrame();

    consecutiveAnimationErrors = 0;

  } catch (error) {
    // ... error handling
  }
}
```

## Understanding the Output

### Example Report

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

### Interpreting Results

**Good performance:**
- Total frame time < 16.67ms (60fps)
- No single subsystem > 5ms
- Memory stable over time

**Problem indicators:**
- Frame time > 16.67ms → dropping below 60fps
- Single subsystem > 10ms → major bottleneck
- Memory increasing over time → leak
- High "untracked overhead" → profiling is incomplete

## Optimization Strategies

### 1. Disable Expensive Features

```javascript
// In browser console:
state.particlesEnabled = false;  // If particles are the bottleneck
state.voxelWave.enabled = false;
state.acidEmpire.enabled = false;
```

### 2. Reduce Particle Count

```javascript
state.particlesCount = 1000;  // Down from 5000
```

### 3. Lower Visual Quality

```javascript
state.voxelWave.cellSize = 2.0;  // Larger cells = less geometry
state.hyperbolicTiling.iterations = 15;  // Down from 25
```

### 4. Profile Specific Scenarios

```javascript
// Before expensive operation:
window.performanceProfiler.reset();
window.performanceProfiler.enable();

// Do the thing...

// After:
setTimeout(() => {
  window.performanceProfiler.printReport();
}, 5000);
```

## Chrome DevTools Performance Tab

### Recording a Performance Profile

1. Open DevTools → Performance tab
2. Click Record (●)
3. Let it run for 5-10 seconds
4. Stop recording
5. Analyze flame graph

**Look for:**
- Long yellow bars = scripting bottlenecks
- Long purple bars = rendering bottlenecks
- Long green bars = painting bottlenecks

### Key Metrics

- **Scripting time**: JavaScript execution (animation loop)
- **Rendering time**: Layout, style calculation
- **Painting time**: Drawing to screen
- **GPU time**: WebGL operations

### Target Goals

- **60fps**: 16.67ms/frame budget
- **Scripting**: < 8ms/frame
- **Rendering**: < 4ms/frame
- **Painting**: < 2ms/frame
- **Idle time**: > 2ms/frame (breathing room)

## Common Bottlenecks

### Particle Systems
- **Cause**: 10,000 particles with complex motion
- **Fix**: Reduce count, simplify motion calculations, use GPU instancing

### Visual Backgrounds
- **Cause**: Complex shaders (Acid Empire, Hyperbolic Tiling)
- **Fix**: Reduce shader complexity, lower resolution, disable when not in focus

### Three.js Rendering
- **Cause**: Too many draw calls, excessive geometry
- **Fix**: Merge geometries, use instancing, frustum culling

### MMPA Feature Extraction
- **Cause**: FFT analysis, Kalman filtering every frame
- **Fix**: Throttle updates (every N frames), optimize algorithms

### Memory Leaks
- **Cause**: Textures not disposed, listeners not removed
- **Fix**: Call `.dispose()` on geometries/materials, remove event listeners

---

**Created:** 2025-11-12
**Status:** Ready for profiling
