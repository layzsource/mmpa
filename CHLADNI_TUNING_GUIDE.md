# 🌀 Chladni Plate System - Tuning & Testing Guide

## 📍 Overview

The Chladni plate system creates **cymatic resonance patterns** in the particle field, simulating how sand particles arrange themselves on a vibrating metal plate based on standing wave patterns.

**Location**: `src/particles.js:1778-1819`
**Controls**: Particles HUD → "Chladni & Moiré Pattern Controls" section

---

## 🎛️ Control Parameters

### **1. Chladni Plates Toggle**
- **Default**: OFF
- **Function**: Enables/disables the entire Chladni system
- **Recommendation**: Turn ON when particles are enabled for best effect

### **2. Chladni M (Horizontal Mode)**
- **Range**: 1-8
- **Default**: 3
- **Function**: Controls horizontal nodal line count
- **Audio Reactive**: Bass adds 0-3 to base value
- **Visual Effect**: Higher M = more vertical striations
- **Recommended Starting Values**:
  - M=2, N=3: Simple cross pattern
  - M=4, N=4: Grid pattern
  - M=3, N=5: Asymmetric pattern (classic Chladni)

### **3. Chladni N (Vertical Mode)**
- **Range**: 1-8
- **Default**: 4
- **Function**: Controls vertical nodal line count
- **Audio Reactive**: Mid frequencies add 0-3 to base value
- **Visual Effect**: Higher N = more horizontal striations

### **4. Chladni Frequency**
- **Range**: 0.1-3.0
- **Default**: 1.0
- **Function**: Oscillation speed of the pattern
- **Audio Reactive**: Audio level multiplies by (1 + audioLevel*2)
- **Recommended Values**:
  - 0.3-0.5: Slow, meditative wave motion
  - 1.0-1.5: Natural resonance feel
  - 2.0-3.0: Rapid, energetic oscillation

---

## 🧪 Test Scenarios

### **Test 1: Classic Chladni Pattern (Static)**
```
Settings:
- Chladni Plates: ON
- M: 3
- N: 4
- Frequency: 1.0
- Audio Reactive: OFF (or low volume)

Expected Result:
- Clear nodal lines forming a symmetrical pattern
- Particles cluster along nodal lines (zero-displacement zones)
- Gentle vertical oscillation along z-axis
```

### **Test 2: Audio-Reactive Cymatics**
```
Settings:
- Chladni Plates: ON
- M: 2
- N: 2
- Frequency: 1.5
- Audio Reactive: ON
- Play bass-heavy music

Expected Result:
- Bass hits increase M mode (2→5 range)
- Mid frequencies increase N mode (2→5 range)
- Pattern complexity morphs with music
- Nodal lines shift dynamically
```

### **Test 3: High-Frequency Interference**
```
Settings:
- Chladni Plates: ON
- M: 6
- N: 7
- Frequency: 2.5
- Particle count: 5000+

Expected Result:
- Complex interference patterns
- Rapid oscillation creates "vibrating sand" effect
- Moiré-like secondary patterns emerge
```

### **Test 4: Low-Mode Simplicity**
```
Settings:
- Chladni Plates: ON
- M: 1
- N: 1
- Frequency: 0.5
- Particle count: 1000-2000

Expected Result:
- Single nodal line pattern (simple cross or circle)
- Very slow, breathing motion
- Clear visualization of resonance principle
```

---

## 🔧 Technical Analysis

### **Chladni Equation Used**:
```javascript
chladniValue = cos(n*π*x) * cos(m*π*y) + cos(m*π*x) * cos(n*π*y)
```

This is the **standard Chladni plate equation** that produces symmetric nodal patterns.

### **Particle Behavior**:
1. **Vertical Displacement**:
   ```javascript
   displacement = sin(chladniValue * 10 + phase) * 0.3 * (1 + audioLevel)
   pos.z += displacement * 0.1
   ```
   - Particles oscillate up/down based on pattern value
   - Audio level amplifies displacement

2. **Nodal Attraction**:
   ```javascript
   if (|chladniValue| < 0.3) {
     pos.z = pos.z * 0.95 + targetZ * 0.05  // Smooth attraction
   }
   ```
   - Particles cluster at nodal lines (where chladniValue ≈ 0)
   - Creates the "sand accumulation" effect

### **Audio Integration**:
- **Bass → M mode**: `m = baseM + floor(bass * 3)`
- **Mid → N mode**: `n = baseN + floor(mid * 3)`
- **Audio level → phase speed**: `phase += frequency * (1 + audioLevel*2) * 0.02`

---

## 🎨 Recommended Visual Combinations

### **1. Cymatic Skybox**
- Chladni: ON (M=4, N=5, Freq=1.2)
- Skybox: ON with textures
- Camera: Auto Orbit
- Result: Particle resonance patterns against textured environment

### **2. Morphing Resonance**
- Chladni: ON (M=3, N=3, Freq=1.5)
- Geometry: Cube→Sphere morph active
- Audio Reactive: ON
- Result: Geometric morph with cymatics overlay

### **3. Minimalist Meditation**
- Chladni: ON (M=1, N=2, Freq=0.3)
- Particle count: 500
- Background: Dark or single color
- Audio: Drone or ambient music
- Result: Slow, hypnotic resonance visualization

### **4. High-Energy Spectacle**
- Chladni: ON (M=5, N=6, Freq=2.5)
- Particle count: 10000+
- Audio Reactive: ON (EDM/electronic)
- Acid Empire: ON for background shader
- Result: Maximum visual complexity

---

## 🐛 Troubleshooting

### **Issue: No visible pattern**
- Check: Particles enabled?
- Check: Chladni toggle ON?
- Try: Increase particle count (3000+)
- Try: Lower M and N values (2-3 range)

### **Issue: Pattern too chaotic**
- Lower M and N values
- Reduce frequency (0.5-1.0)
- Decrease particle count

### **Issue: No audio reactivity**
- Verify audio input active (check audio meter)
- Increase audio gain/volume
- Check: M and N are in low range (allows room for +3 modulation)

### **Issue: Particles don't cluster at nodes**
- This is correct behavior at high frequencies
- Lower frequency to see nodal clustering
- Increase threshold in code (currently 0.3) for stronger attraction

---

## 📊 Performance Notes

- **Optimal particle count**: 2000-5000 for clear patterns
- **CPU impact**: Moderate (O(n) complexity per frame)
- **Best with**:
  - Audio reactive ON
  - Moderate M/N values (2-5)
  - Frequency 0.5-2.0

---

## 🔬 Mathematical Deep Dive

The Chladni equation generates **standing wave patterns** by combining two cosine waves:

```
Pattern = cos(n*π*x) * cos(m*π*y) + cos(m*π*x) * cos(n*π*y)
```

**Nodal lines** occur where this value equals zero - these are zones of zero displacement where particles accumulate (just like sand on a vibrating plate).

**Mode numbers (m, n)** determine:
- Number of nodal lines
- Symmetry of pattern
- Complexity of interference

**Real Chladni plates** use circular boundaries; this implementation uses rectangular (x,y) coordinates for computational efficiency.

---

## 🎯 Next Steps for Enhancement

Potential improvements to consider:

1. **Circular boundary** adaptation for true cymatics
2. **Multiple frequency modes** (bass, mid, treble each control different patterns)
3. **3D Chladni** (spherical harmonics instead of plate modes)
4. **Color coding** by displacement amplitude
5. **Particle size** variation based on nodal proximity

---

## 📝 Quick Reference Card

| Parameter | Subtle | Moderate | Intense |
|-----------|--------|----------|---------|
| M mode | 1-2 | 3-4 | 5-8 |
| N mode | 1-2 | 3-4 | 5-8 |
| Frequency | 0.3-0.7 | 1.0-1.5 | 2.0-3.0 |
| Particles | 500-1500 | 2000-5000 | 5000-15000 |

**Pro tip**: Start with M=3, N=4, Freq=1.0, then adjust to taste!

---

*Last updated: 2025-10-10*
*System: MMPA Signal-to-Form Engine v13.7*
