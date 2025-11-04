# 🌓 Shadow Layer - Interpretive Dimension Guide

## 📍 Overview

The **Shadow Layer** is a separate pop-up window that renders a phase-offset, echoed visualization of the main scene. It implements the **interpretive dimension** from the MMPA (Morpho-Morphic Pattern Aggregator) architecture, enabling comparative analysis between the primary visualization and its temporal echo.

**Location**: `src/shadowLayer.js`
**HUD Control**: Visual Tab → "🌓 Shadow Layer (Interpretive Dimension)" section
**Phase**: 13.8

---

## 🎯 Purpose

The Shadow Layer serves multiple creative and analytical purposes:

1. **Comparative Analysis**: Side-by-side comparison of the visualization at different time phases
2. **Temporal Echo**: Visualize how patterns evolve over time with a delay
3. **Reduced Confusion**: Separate window prevents visual clutter in main scene
4. **Interpretive Depth**: Color and phase shifts create an alternate reading of the same signal data
5. **Multi-Monitor Workflow**: Ideal for presentation/performance setups with multiple displays

---

## 🎛️ Configuration Parameters

### **Phase Offset**
- **Default**: 0.3 (30% time delay)
- **Function**: Temporal lag applied to all animations and transformations
- **Effect**: Shadow visualization "follows" the main scene with a noticeable delay

### **Echo Decay**
- **Default**: 0.85 (85% intensity)
- **Function**: Attenuation factor for motion and scale
- **Effect**: Shadow movements are slightly subdued compared to main scene

### **Color Shift**
- **Default**: +30° hue rotation
- **Function**: Shifts the color palette in HSL color space
- **Effect**: Creates visual distinction while maintaining aesthetic coherence

---

## 🖥️ Window Controls

### **Opening the Shadow Layer**
1. Navigate to **Visual Tab** in HUD
2. Scroll to **"🌓 Shadow Layer (Interpretive Dimension)"** section
3. Click **"Open Shadow Layer Window"**
4. A new window opens (typically positioned to the right of main window)

### **Window Features**
- **Collapsible**: Click "Collapse" button to minimize to 300×150px and move to bottom-right corner of main window
- **Expandable**: Click "Expand" button to restore original size and position
- **Resizable**: Drag window edges to resize manually
- **Independent Rendering**: Runs its own Three.js animation loop
- **Auto-cleanup**: Closes gracefully when main window closes
- **Smart Positioning**: Collapsed window stays anchored to main window for easy access

### **Closing the Shadow Layer**
- Click **"Close Shadow Layer Window"** in HUD, or
- Close the pop-up window directly (X button)

---

## 🔧 Technical Architecture

### **Independent Scene Graph**
The Shadow Layer maintains its own complete Three.js environment:

```javascript
shadowScene       // Separate THREE.Scene instance
shadowCamera      // Independent PerspectiveCamera
shadowRenderer    // Dedicated WebGLRenderer
shadowMorphMesh   // Cloned geometry with morph targets
```

### **Rendering Pipeline**
1. **Main Window**: Renders at full frame rate (60 FPS)
2. **Shadow Window**: Renders independently at 60 FPS
3. **Synchronization**: Reads from shared `state` object
4. **Phase Offset**: Applied via time manipulation in update loop

### **Animation Loop**
```javascript
updateShadowScene() {
  const phaseTime = time - PHASE_OFFSET;

  // All animations use phaseTime instead of time
  rotation = sin(phaseTime * speed)
  scale = 1 + sin(phaseTime * 2) * pulse * ECHO_DECAY

  // Color shifted by COLOR_SHIFT degrees
  hue = (baseHue + COLOR_SHIFT) % 360
}
```

---

## 🎨 Visual Effects

### **1. Phase-Delayed Motion**
- Rotation lags behind main scene by phase offset
- Creates "following" or "echoing" motion
- Smooth interpolation prevents jarring jumps

### **2. Decayed Intensity**
- Scale pulses are 15% smaller than main scene
- Opacity fluctuates more subtly
- Gives impression of "fading memory" of main visualization

### **3. Hue-Shifted Colors**
- Base colors rotated 30° on color wheel
- Audio-reactive hue changes are preserved but offset
- Maintains visual relationship while creating distinction

### **4. Orbital Camera**
- Camera orbits center point slowly
- Phase-offset creates different viewing angle than main scene
- Provides 3D depth perception when viewed side-by-side

---

## 🧪 Use Cases

### **1. Live Performance**
Setup:
- Main window on laptop screen (performer control)
- Shadow Layer on external projector (audience view)
- Creates dual-perspective visual experience

### **2. Music Production**
Setup:
- Main window shows real-time audio response
- Shadow Layer shows 30% delayed echo
- Visualizes reverb/delay effects spatially

### **3. Pattern Analysis**
Setup:
- Place windows side-by-side
- Observe how patterns evolve over time
- Identify periodic vs. chaotic behaviors

### **4. Recording/Streaming**
Setup:
- Screen capture both windows
- Edit together for split-screen effect
- Provides richer visual content

---

## 🐛 Troubleshooting

### **Issue: Pop-up window blocked**
**Solution**: Check browser pop-up settings, allow pop-ups for this site

### **Issue: Window doesn't open**
**Causes**:
- Pop-up blocker enabled
- Browser security settings
- Multi-monitor configuration issues

**Solutions**:
1. Manually allow pop-ups in browser settings
2. Try opening in Electron app instead of browser
3. Check console for error messages

### **Issue: Shadow Layer stops animating**
**Cause**: Window lost focus or was moved to background

**Solution**: Click on Shadow Layer window to restore focus

### **Issue: Performance degradation**
**Cause**: Running two full rendering pipelines simultaneously

**Solutions**:
- Reduce particle count in main scene
- Disable heavy effects (skybox, acid empire)
- Close other applications
- Use GPU-accelerated browser

### **Issue: Colors don't match expected shift**
**Cause**: Audio reactive mode may override base colors

**Solution**: Disable audio reactive temporarily to see base color shift

---

## 📊 Performance Notes

### **CPU/GPU Impact**
- **Main Scene**: ~30-50% GPU usage (typical)
- **Shadow Layer**: Additional ~20-30% GPU usage
- **Total**: 50-80% GPU usage with both windows

### **Optimization Tips**
1. **Reduce particle counts** in both scenes
2. **Lower resolution** of shadow window (resize smaller)
3. **Disable post-processing** effects when using Shadow Layer
4. **Close unused tabs/apps** to free resources

### **Recommended System**
- **GPU**: Dedicated graphics card (NVIDIA/AMD)
- **RAM**: 8GB minimum, 16GB recommended
- **CPU**: Quad-core or better
- **Display**: Dual monitor setup for best experience

---

## 🔮 Future Enhancements

Potential improvements to consider:

1. **Configurable Parameters**
   - UI sliders for phase offset (0-100%)
   - Echo decay adjustment (0-100%)
   - Color shift control (0-360°)

2. **Multiple Shadow Layers**
   - Open 2-3 shadow windows with different offsets
   - Create "cascade" effect with progressive delays

3. **Particle System Integration**
   - Render particle field in shadow window
   - Apply phase offset to particle positions

4. **Vessel System Integration**
   - Clone vessel geometry to shadow scene
   - Synchronize vessel rotation with offset

5. **Preset Integration**
   - Save shadow layer state in presets
   - Auto-open shadow layer when loading certain presets

6. **Recording Mode**
   - Capture both windows to single video file
   - Side-by-side or overlay compositing

7. **Sync Lock**
   - Toggle to match shadow exactly (0% offset)
   - Useful for debugging or synchronized displays

---

## 📝 Quick Reference

| Feature | Default Value | Description |
|---------|--------------|-------------|
| **Phase Offset** | 30% | Time delay for echo effect |
| **Echo Decay** | 85% | Intensity reduction factor |
| **Hue Shift** | +30° | Color palette rotation |
| **Window Size** | 800×600 | Initial dimensions |
| **Collapsed Size** | 300×150 | Minimized dimensions |
| **FPS** | 60 | Animation frame rate |

### **Keyboard Shortcuts**
- No dedicated shortcuts yet (planned for future phase)

### **HUD Location**
Visual Tab → Scroll down → "🌓 Shadow Layer (Interpretive Dimension)"

---

## 🔗 Related Systems

- **Shadows Module** (`src/shadows.js`): Different system - ground/backdrop shadows in main scene
- **Shadow Box** (legacy): Render-to-texture projection (currently disabled)
- **Visual Module** (`src/visual.js`): Background/skybox rendering
- **Vessel Module** (`src/vessel.js`): Orbital ring structures

---

## 💡 Creative Tips

### **Tip 1: Complementary Colors**
If main scene is blue (hue 240°), shadow layer will be orange (hue 270°), creating visual tension

### **Tip 2: Echo Music Timing**
Set phase offset to match your song's delay/reverb time for synchronized visuals

### **Tip 3: Dual Monitor Setup**
Position windows on separate monitors for immersive dual-perspective experience

### **Tip 4: Screen Recording**
Record both windows with OBS, use chroma key or masking for creative composites

### **Tip 5: Slow Motion Effect**
Large phase offset (50%+) makes shadow layer appear in "slow motion" relative to main

---

*Last updated: 2025-10-10*
*System: MMPA Signal-to-Form Engine v13.8*
*Module: Shadow Layer (Interpretive Dimension)*
