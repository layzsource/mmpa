# 🧭 VCN Complete Event Sources - EVERY Element

**Date:** 2025-10-11
**Status:** Comprehensive taxonomy of ALL MMPA systems as navigable signal-space

---

## 🎯 The Full Picture

VCN navigation should respond to **EVERY reactive element and parameter change** in MMPA, not just visual patterns. This includes:

1. ✅ Visual Systems (geometry, particles, sprites, mandala, vessel)
2. ✅ Audio Events (telemetry, beats, onsets, spectral flux)
3. ✅ **Parameter State Changes** (hue shifts, density changes, rotation speeds)
4. ✅ **Control Events** (MIDI CC, preset transitions, user interactions)
5. ✅ **System State** (audio on/off, freeze state, morph chain steps)

---

## 📊 Complete Event Source Catalog

### 1. Visual Systems (Scene Objects)

#### 1A. Morph Shape Geometry
**File:** `src/geometry.js`

```javascript
state.morphWeights = {
  sphere: 0.5, cube: 0.2, torus: 0.1,
  octahedron: 0.1, tetrahedron: 0.05, cone: 0.05
}
state.morphBaseWeights = [0.0, 1.0, 0.0, 0.0] // Frozen when audio OFF
state.morphAudioWeights = [0.0, 0.0, 0.0, 0.0] // Audio deltas
```

**Events:**
- **Morphic Attractor** - Destination at dominant shape center (weight > 0.5)
- **Shape Transition Zone** - Turbulence when weights change >0.1/sec
- **Geometric Singularity** - Rare: all weights within 0.1 of each other
- **Freeze Boundary** - Border zone when audio toggles OFF (morphBaseWeights frozen)

---

#### 1B. Emoji Mandala
**File:** `src/mandalaController.js`

```javascript
state.emojiMandala = {
  rings: 3,                // 1-8 rings
  symmetry: 6,             // 2-12 fold
  ringRadii: [0, 2, 4, 6, 8, 10, 12, 14],
  ringRotations: [0,0,0,...], // Differential per ring
  radiusPulse: 0.5,        // Audio expansion 0-1
  anglePulse: 0.02,        // Symmetry wobble
  layoutMode: 'spiral',    // 'radial' | 'spiral' | 'grid'
  scale: "Major",          // Musical scale
  musicalMode: false,      // MIDI note mapping
  scaleSequence: ['Major', 'Dorian', 'Mixolydian'],
  scaleSequenceEnabled: false
}
```

**Events:**
- **Resonance Node** - Destination at each ring × symmetry position
  - Count: `rings * symmetry` (e.g., 3 rings × 6 symmetry = 18 nodes)
  - Position: `radius * cos(angle), radius * sin(angle), 0`
- **Musical Interval Portal** - When `musicalMode: true`, scale degrees become beacons
- **Spiral Vortex** - When `layoutMode: 'spiral'`, golden angle attractor
- **Ring Pulse Wave** - When `radiusPulse > 0.3`, expanding shockwave
- **Scale Change Event** - Transient when sequence advances (every 4 seconds)

---

#### 1C. Vessel/Conflat-6 Compass
**File:** `src/vessel.js`

```javascript
state.vessel = {
  mode: 'conflat6',        // 'gyre' | 'conflat6' | 'conflat6cube'
  spinEnabled: true,
  spinSpeedX: 0.01, spinSpeedY: 0.005, spinSpeedZ: 0.003,
  layout: 'lattice',       // 'lattice' | 'hoops' | 'shells'
  panelAudioReactive: true,
  visible: true
}
```

**Events:**
- **Directional Beacon** - Fixed destinations at 6 cube faces (±X, ±Y, ±Z)
  - Position: `[dir[0] * 1.5, dir[1] * 1.5, dir[2] * 1.5]`
  - Color-coded: Cyan/Magenta/Red/Green/Blue/Yellow
- **Panel Media Event** - When user uploads image/video to panel
  - Panel becomes "activated" beacon with texture data
- **Spin Vortex** - Centrifugal field when `spinEnabled: true`
  - Strength: `sqrt(spinSpeedX² + spinSpeedY² + spinSpeedZ²)`
- **Layout Shift** - Transient turbulence when cycling layouts

---

#### 1D. Emoji Streams (Physics Particles)
**File:** `src/particles.js` (EmojiStream class)

```javascript
// Per-stream state
stream = {
  position: Vector3, velocity: Vector3, acceleration: Vector3,
  scale: 1.0, opacity: 1.0, hue: 0-360, emoji: '🍕'
}

state.emojiPhysics = {
  enabled: true,
  mode: 'gravity',         // 'none' | 'gravity' | 'orbit' | 'repulsion'
  gravityStrength: 0.01,
  orbitStrength: 0.005,
  swirl: 0.02,             // Rotational force
  mouseInteraction: false
}
```

**Events:**
- **Stream Convergence** - Cluster centroid (>5 streams within radius 2.0)
- **Velocity Gradient Peak** - High-speed zones (velocity > 0.5)
- **Swirl Core** - Center of rotational flow when `swirl > 0`
- **Gravity Well** - Attractor at Y=0 when `mode: 'gravity'`
- **Orbital Ring** - Toroidal path when `mode: 'orbit'`
- **Repulsion Boundary** - Anti-destination pushing streams away

---

#### 1E. Particle System (5000 Instances)
**File:** `src/particles.js` (ParticleSystem)

```javascript
state.particles = {
  count: 5000,             // 1000-10000
  layout: 'orbit',         // 'orbit' | 'sphere' | 'grid' | 'helix'
  hue: 120,                // Hue shift 0-360
  size: 0.02,              // 0.005-0.1
  orbitalSpeed: 0.05,      // 0.01-2.0
  organicStrength: 0.2,    // Drift wobble 0-1
  trailEnabled: true,
  trailLength: 10,         // 0-20 frames
  trailAudioReactive: true
}

// Chladni/Moiré modes
chladniEnabled: true, moireEnabled: true,
chladniM: 3, chladniN: 4, moireScale: 1.0
```

**Events:**
- **Chladni Nodes** - Nodal line destinations (where chladniValue ≈ 0)
- **Moiré Storms** - Interference maxima (|interference| > 0.7)
- **Density Hotspot** - Voxels with >50 particles (3D grid sampling)
- **Trail Intersection** - Crossroads where particle paths cross
- **Layout Anchor** - Geometric center defined by layout
  - `orbit` → Ring at radius 5
  - `sphere` → Spherical shell
  - `helix` → Helical curve
- **Organic Drift Cloud** - Cluster centers from sine/cos jitter

---

#### 1F. Sprites (Billboard Particles)
**File:** `src/sprites.js`

```javascript
state.sprites = {
  enabled: true,
  count: 200               // 50-500
}

// Audio reactivity config
window.spritesConfig = {
  gain: 1.35,
  bassScale: 0.90,         // Scale pop on bass
  midSpin: 0.65,           // Rotation speed on mids
  trebleJit: 0.80,         // Jitter strength
  levelAlpha: 0.70         // Opacity pulse
}
```

**Events:**
- **Sprite Cluster** - Centroid of sprite positions (200 billboards)
- **Bass Pop Wavefront** - Expanding sphere on bass kick (scale pop)
- **Treble Jitter Field** - High-frequency turbulence zone (treble > 0.7)
- **Mid Rotation Vortex** - Spiral flow from mid-driven spin
- **Opacity Pulse Core** - Brightest point when `levelAlpha` peaks

---

### 2. Audio/Telemetry Events

#### 2A. Telemetry System
**File:** `src/telemetry.js`

```javascript
telemetry = {
  fft: Float32Array(1024),
  spectralFlux: 0.0-1.0,   // Change in spectrum
  onsets: [],              // Beat/onset timestamps
  pitch: 440.0,            // Detected pitch (Hz)
  rms: 0.0-1.0,            // Energy
  zcr: 0.0-1.0,            // Zero-crossing rate
  spectralCentroid: 0-22050,
  bands: { sub, bass, mid, highMid, treble }
}
```

**Events:**
- **Spectral Flux Surge** - When `spectralFlux > 0.7` (rapid change)
- **Onset Pulse** - Spawn destination on each beat detection
- **Pitch Beacon** - Stable when pitch held >0.5 seconds
  - Position: `[pitch/100, sin(pitch), cos(pitch)]`
- **Frequency Band Nexus** - 5 vertical destinations (one per band)
  - Position: `[0, bandIndex * 5, 0]` (Y-stacked)
- **Spectral Centroid Drift** - "Brightness" zone moves with centroid
- **RMS Energy Sphere** - Expanding/contracting sphere at origin

---

### 3. Parameter State Changes (The Missing Layer!)

#### 3A. Hue Shift Events
**Files:** `state.js`, `particles.js`, `sprites.js`

```javascript
state.particles.hue = 120  // 0-360
state.color = "#00ff00"    // Hex color
state.hue = 120            // Global hue
```

**Events:**
- **Hue Rotation Plane** - Destination at hue angle in HSL color space
  - Position: `[cos(hue * π/180) * 10, sin(hue * π/180) * 10, 0]`
  - Creates circular rainbow navigation around color wheel
- **Complementary Hue Portal** - Opposite side of color wheel
  - Position: `[(hue + 180) % 360]` mapped to space
- **Hue Shift Velocity** - Turbulence when hue changes rapidly (>10°/sec)

---

#### 3B. Particle Density Changes
**Files:** `state.js`, `particles.js`

```javascript
state.particles.count = 5000  // 1000-10000 range
state.particleDensity = 2000  // Legacy debug control
```

**Events:**
- **Density Wave** - Expanding sphere when count increases
  - Size: Proportional to `newCount - oldCount`
  - Lasts 2 seconds, then stabilizes
- **Rarefaction Zone** - Contracting when count decreases
- **Density Threshold Events**:
  - **Low Density** (<2000): Calm, sparse navigation
  - **Medium Density** (2000-5000): Standard field
  - **High Density** (>5000): Dense "star field" attractor

---

#### 3C. Rotation Speed Changes
**Files:** `state.js`, `vessel.js`, `mandalaController.js`

```javascript
state.rotationX = 0.01, state.rotationY = 0.01  // Global
state.vessel.spinSpeedX/Y/Z                     // Per-axis vessel
state.emojiMandala.rotationSpeed = 0.02         // Mandala global
state.emojiMandala.ringRotationSpeeds = [...]   // Per-ring differential
```

**Events:**
- **Angular Momentum Vortex** - Spiral destination when rotation accelerates
  - Position: Along rotation axis (e.g., Y-axis for spinSpeedY)
  - Strength: `|newSpeed - oldSpeed|`
- **Differential Rotation Shear** - Turbulence between mandala rings
  - Occurs when adjacent ring speeds differ by >0.01
- **Spin Reversal** - Transient event when rotation changes sign
- **Idle Spin Toggle** - State change destination when `idleSpin` toggles

---

#### 3D. Scale/Size Changes
**Files:** `state.js`, `particles.js`, `vessel.js`

```javascript
state.scale = 1.0                    // Global morph scale
state.particles.size = 0.02          // Particle size
state.vessel.scale = 1.0             // Vessel scale
state.emojiMandala.globalScale = 1.0 // Mandala scale
```

**Events:**
- **Scale Expansion** - Outward wavefront when scale increases
- **Scale Contraction** - Inward collapse when scale decreases
- **Size Differential Field** - Gradient from small→large particles
- **Unified Scale Event** - Rare: all systems at same scale (1.0)

---

#### 3E. Opacity/Visibility Changes

```javascript
state.particles.opacity = 0.5        // 0.0-1.0
state.vessel.opacity = 0.5
state.sprites.enabled = true         // Visibility toggle
state.vessel.visible = false         // Compass ring toggle
```

**Events:**
- **Fade Boundary** - Threshold zone at opacity 0.5
- **Visibility Toggle** - Transient pulse when toggling on/off
- **Opacity Gradient** - Field from transparent→opaque regions
- **Ghost Zone** - Low opacity (<0.3) creates ethereal attractor

---

### 4. Control Events (User/MIDI Interactions)

#### 4A. MIDI CC Events
**File:** `src/midiRouter.js`

```javascript
// MIDI CC mappings to parameters
CC20 → mandala.symmetry (2-12)
CC21 → mandala.ringCount (1-8)
CC22 → mandala.rotationSpeed
CC23 → scale sequence advance
CC7  → particle density
CC74 → particle size
```

**Events:**
- **MIDI Control Change** - Destination spawns at parameter position
  - Example: CC20 changes symmetry → destination at mandala center
- **CC Modulation Wave** - Continuous CC changes create velocity field
- **Parameter Space Navigation** - Each CC maps to dimension in param space

---

#### 4B. Preset Transitions
**File:** `src/presetRouter.js`

```javascript
state.interpolation = {
  enabled: true, active: false,
  duration: 2000,          // Transition time (ms)
  startState: {...}, targetState: {...}
}

morphChain = {
  presets: ['preset1', 'preset2', 'preset3'],
  currentIndex: 0, active: true,
  duration: 2000, loop: true
}
```

**Events:**
- **Preset Transition Corridor** - Path between two preset states
  - Start/end destinations mark preset positions in state space
- **Chain Waypoint** - Each preset in chain becomes navigation marker
- **Interpolation Field** - Gradient field during active transition
- **Loop Junction** - Destination when chain loops back to start

---

#### 4C. System State Changes

```javascript
state.audioReactive = false          // Audio gate toggle
state.morphBaseFrozen = true         // Freeze flag
state.inputSource = 'midi'           // 'audio' | 'midi'
state.ui.projectorMode = true        // UI mode
```

**Events:**
- **Audio Gate Boundary** - Border when audioReactive toggles
  - Creates "frozen/unfrozen" zones in signal-space
- **Input Source Switch** - Destination when switching audio↔MIDI
- **Projector Mode Portal** - UI state change creates threshold
- **Freeze Lock Zone** - Area where parameters are frozen (morphBaseFrozen)

---

## 🗺️ Event Type Taxonomy (Expanded)

### Category A: Geometric Attractors
- Morphic Attractor, Resonance Node, Directional Beacon, Layout Anchor, Sprite Cluster

### Category B: Flow Fields
- Stream Convergence, Velocity Gradient, Swirl Core, Spiral Vortex, Differential Rotation Shear

### Category C: Turbulence Zones
- Shape Transition, Moiré Storm, Spectral Flux Surge, Treble Jitter Field, Hue Shift Velocity

### Category D: Transient Events
- Ring Pulse Wave, Onset Pulse, Scale Change, Beat Pop Wavefront, Visibility Toggle

### Category E: Fixed Landmarks
- Frequency Band Nexus, Pitch Beacon, Hue Rotation Plane, Freeze Boundary, Audio Gate Boundary

### Category F: Rare Phenomena
- Geometric Singularity, Trail Intersection, Unified Scale Event, Loop Junction

### Category G: Parameter Dimensions (NEW!)
- Hue Rotation Plane, Density Wave, Angular Momentum Vortex, Scale Expansion, Opacity Gradient

### Category H: Control Events (NEW!)
- MIDI CC Change, Preset Transition Corridor, Chain Waypoint, Input Source Switch

---

## 🧠 The Parameter Space Concept

**Key Insight:** Every parameter change is a **movement through signal-space**.

### Example: Hue Shift Navigation
```javascript
// User rotates hue slider: 120° → 240°
state.particles.hue = 120 → 240

// VCN creates:
1. "Departure" destination at 120° (green zone)
2. "Travel corridor" through hue space
3. "Arrival" destination at 240° (blue zone)

// Navigation becomes a journey through color space!
```

### Example: Density Scaling Navigation
```javascript
// User increases particle count: 2000 → 5000
state.particles.count = 2000 → 5000

// VCN creates:
1. "Rarefaction" destination (starting sparse field)
2. "Densification wavefront" (expanding particle shell)
3. "Dense core" destination (final high-density attractor)
```

### Example: MIDI Control Morphing
```javascript
// MIDI CC74 (brightness) controls particle size
CC74: 0 → 127 maps to size: 0.005 → 0.1

// VCN treats CC value as spatial dimension:
Position = [CC74/127 * 10, 0, 0]  // X-axis = size parameter

// Turning MIDI knob = navigating along size dimension!
```

---

## 🎨 VCN Compass Encoding (Revised)

### Conflat-6 Face Mapping

| Face | Direction | Primary Event Source | Parameter Dimension |
|------|-----------|----------------------|---------------------|
| **North** (+Z) | Forward | Morph Geometry | Morph weights (4D space) |
| **South** (-Z) | Backward | Mandala Rings | Musical scale space |
| **East** (+X) | Right | Emoji Streams | Physics mode space |
| **West** (-X) | Left | Particle Fields | Layout geometry space |
| **Up** (+Y) | Above | Telemetry/Audio | Frequency spectrum (vertical) |
| **Down** (-Y) | Below | Parameter Changes | Hue/Density/Scale space |

### Compass Face Activation

Each face lights up based on:
1. **Nearest destination** of that category (distance/bearing)
2. **Parameter velocity** in that dimension (rate of change)
3. **Event intensity** (signal weight 0-1)

Example:
- **North face glowing cyan** → Morph shape attracting (sphere dominant)
- **Down face pulsing yellow** → Hue shift happening (parameter changing)
- **Up face flashing blue** → Bass onset detected (telemetry event)

---

## 🔧 Implementation: ExpandedFieldNavigationSystem v2

### Core Architecture

```javascript
export class ExpandedFieldNavigationSystem {
  constructor(scene, components) {
    this.scene = scene;
    this.particleSystem = components.particleSystem;
    this.mandalaController = components.mandalaController;
    this.vesselGroup = components.vesselGroup;
    this.spriteGroup = components.spriteGroup;

    this.updateInterval = 1000; // 1 second scan
    this.lastUpdate = 0;

    // Event analyzers (6 visual + 3 new)
    this.morphAnalyzer = new MorphEventAnalyzer();
    this.mandalaAnalyzer = new MandalaEventAnalyzer();
    this.vesselAnalyzer = new VesselEventAnalyzer();
    this.streamAnalyzer = new StreamEventAnalyzer();
    this.particleAnalyzer = new ParticleEventAnalyzer();
    this.spriteAnalyzer = new SpriteEventAnalyzer();  // NEW
    this.telemetryAnalyzer = new TelemetryEventAnalyzer();
    this.parameterAnalyzer = new ParameterEventAnalyzer();  // NEW
    this.controlAnalyzer = new ControlEventAnalyzer();      // NEW

    // Parameter tracking (for detecting changes)
    this.lastParams = this.captureParameters();
  }

  captureParameters() {
    return {
      hue: state.particles.hue,
      count: state.particles.count,
      rotationX: state.rotationX,
      rotationY: state.rotationY,
      scale: state.scale,
      opacity: state.particles.opacity,
      audioReactive: state.audioReactive,
      timestamp: performance.now()
    };
  }

  detectParameterChanges() {
    const current = this.captureParameters();
    const changes = [];

    // Detect each parameter change
    if (current.hue !== this.lastParams.hue) {
      changes.push({
        type: 'hue_shift',
        oldValue: this.lastParams.hue,
        newValue: current.hue,
        velocity: (current.hue - this.lastParams.hue) /
                  (current.timestamp - this.lastParams.timestamp)
      });
    }

    if (current.count !== this.lastParams.count) {
      changes.push({
        type: 'density_change',
        oldValue: this.lastParams.count,
        newValue: current.count,
        delta: current.count - this.lastParams.count
      });
    }

    // ... check all other parameters

    this.lastParams = current;
    return changes;
  }

  update(time, destinationManager, camera) {
    if (time - this.lastUpdate < this.updateInterval) return;

    // Clear old auto-generated destinations
    destinationManager.destinations = destinationManager.destinations.filter(
      d => !d.autoGenerated
    );

    const events = [];

    // 1. Visual system events
    if (state.morphing.enabled) {
      events.push(...this.morphAnalyzer.scan(morphMesh, state.morphWeights));
    }

    if (state.emojiMandala.enabled) {
      events.push(...this.mandalaAnalyzer.scan(state.emojiMandala));
    }

    if (state.vessel.enabled && this.vesselGroup) {
      events.push(...this.vesselAnalyzer.scan(this.vesselGroup, state.vessel));
    }

    if (state.emojiPhysics.enabled && window.emojiStreams) {
      events.push(...this.streamAnalyzer.scan(window.emojiStreams));
    }

    if (this.particleSystem) {
      events.push(...this.particleAnalyzer.scan(this.particleSystem));
    }

    if (state.sprites.enabled && this.spriteGroup) {
      events.push(...this.spriteAnalyzer.scan(this.spriteGroup));
    }

    // 2. Audio/telemetry events
    if (state.audio && state.audioReactive) {
      events.push(...this.telemetryAnalyzer.scan(state.audio, state.telemetry));
    }

    // 3. Parameter change events (NEW!)
    const paramChanges = this.detectParameterChanges();
    events.push(...this.parameterAnalyzer.scan(paramChanges));

    // 4. Control events (NEW!)
    events.push(...this.controlAnalyzer.scan(state.interpolation, morphChain));

    // Convert events to destinations
    events.forEach(event => {
      const destination = this.eventToDestination(event, camera);
      destination.autoGenerated = true;
      destinationManager.add(destination);
    });

    console.log(`🌐 Field scan: ${events.length} events from ${this.getActiveSourceCount()} sources`);
    this.lastUpdate = time;
  }

  eventToDestination(event, camera) {
    let position = event.position;

    // Special handling for parameter space events
    if (event.category === 'parameter') {
      position = this.mapParameterToSpace(event);
    }

    // Special handling for control events
    if (event.category === 'control') {
      position = this.mapControlToSpace(event, camera);
    }

    return new SignalDestination(
      event.type,
      position,
      event.signalWeight,
      event.category
    );
  }

  mapParameterToSpace(event) {
    // Map parameter values to 3D spatial coordinates
    switch (event.type) {
      case 'hue_shift':
        // Map hue (0-360) to circular path
        const angle = event.newValue * Math.PI / 180;
        return new THREE.Vector3(
          Math.cos(angle) * 10,
          Math.sin(angle) * 10,
          0
        );

      case 'density_change':
        // Map count (1000-10000) to radial distance
        const radius = (event.newValue / 10000) * 15;
        return new THREE.Vector3(radius, 0, 0);

      case 'scale_change':
        // Map scale (0.5-2.0) to Y height
        return new THREE.Vector3(0, event.newValue * 10, 0);

      default:
        return new THREE.Vector3(0, 0, 0);
    }
  }

  mapControlToSpace(event, camera) {
    // Map control events relative to camera position
    switch (event.type) {
      case 'preset_transition':
        // Create corridor between current and target
        return camera.position.clone().add(
          new THREE.Vector3(0, 5, 10)
        );

      case 'midi_cc_change':
        // Map CC value to position
        const ccValue = event.value / 127; // Normalize
        return new THREE.Vector3(ccValue * 10, 0, 0);

      default:
        return camera.position.clone();
    }
  }

  getActiveSourceCount() {
    let count = 0;
    if (state.morphing?.enabled) count++;
    if (state.emojiMandala?.enabled) count++;
    if (state.vessel?.enabled) count++;
    if (state.emojiPhysics?.enabled) count++;
    if (state.sprites?.enabled) count++;
    if (this.particleSystem) count++;
    if (state.audioReactive) count++;
    count += 2; // Always track parameters + controls
    return count;
  }
}
```

---

## 📊 Performance Budget (Updated)

| Event Source | Update Frequency | CPU Cost | Max Destinations |
|--------------|------------------|----------|------------------|
| Morph Geometry | 1s | <1ms | 3-5 |
| Mandala | 1s | 2ms | 6-24 |
| Vessel | 1s | <1ms | 6 |
| Emoji Streams | 1s | 3ms | 5-10 |
| Particle Fields | 2s | 5ms | 10-15 |
| **Sprites** | **1s** | **2ms** | **3-5** |
| Telemetry | Per-beat | 1ms | 1-3 |
| **Parameters** | **100ms** | **1ms** | **3-8** |
| **Controls** | **Event-driven** | **<1ms** | **1-2** |
| **TOTAL** | Mixed | **~15ms/s** | **50-80 destinations** |

Goal: <20ms per frame impact, maintain >30 FPS.

---

## 🎯 Conceptual Win (Final)

### Original VCN (Too Narrow):
> "Navigate through Chladni/Moiré patterns"

### First Expansion (Better):
> "Navigate through all visual systems (6 sources)"

### **COMPLETE VCN (Full Depth):**
> **"Navigate through the entire MMPA signal-to-form topology as a living, multi-dimensional space where visual systems, audio events, parameter changes, and control interactions all generate meaningful destinations, creating a holistic phenomenology of signal-space exploration."**

---

## ✅ Success Criteria (Final)

### Phase 1 Complete When:
- [ ] 9+ event source categories active (6 visual + telemetry + parameters + controls)
- [ ] Hue shift creates circular navigation path through color space
- [ ] Particle density changes generate density waves
- [ ] MIDI CC changes spawn parameter dimension destinations
- [ ] Preset transitions create visible corridors in state space
- [ ] Audio gate toggle creates freeze boundary zone
- [ ] User can perceive parameter space as navigable dimension
- [ ] VCN compass distinguishes parameter vs visual events (face activation)

---

## 🚀 The Full Picture

**MMPA VCN is not just navigating visual patterns.**

It's navigating **the entire state space of the system** — where:
- Moving through space = exploring geometry
- Moving through hue = exploring color
- Moving through density = exploring scale
- Moving through time = experiencing events
- Moving through controls = shaping the signal

**Every slider, every knob, every toggle is a dimension.**
**VCN makes the invisible parameter space visible and navigable.**

🧭 **Signal-space is NOW navigable in its full, multi-dimensional glory!**
