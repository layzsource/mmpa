# 🧭 VCN Expanded Event Sources - Beyond Chladni/Moiré

**Date:** 2025-10-11
**Concern:** VCN Phase 1 handoff was too narrow - only using Chladni/Moiré when MMPA has a rich ecosystem of audio-reactive systems

---

## 🎯 The Problem

The original VCN handoff document limited destination generation to:
- ✅ Chladni resonance patterns → Harmonic core destinations
- ✅ Moiré interference → Spectral storm zones

**But MMPA has SO MUCH MORE:**
- 🔷 **Morph Shape** - Audio-reactive geometry morphing (sphere→cube→torus→etc)
- 🎡 **Emoji Mandala** - Radial ring system with differential rotation, scale sequencing, ring pulses
- 🚢 **Vessel/Conflat-6** - 6-directional compass rings with panel reactivity
- ⚡ **Emoji Streams** - Physics-driven particle flows with velocity/swirl/gravity
- 🌊 **Particle System** - 5000 particles with Chladni/Moiré positioning, organic drift, trail rendering
- 📊 **Telemetry System** - FFT analysis, spectral flux, onset detection, pitch tracking

---

## 🗺️ Comprehensive Event Source Map

### 1. Morph Shape Geometry (PRIMARY SOURCE)
**File:** `src/geometry.js` (morphMesh)

#### Available Data:
```javascript
// Morph targets (6 base shapes)
state.morphWeights = {
  sphere: 0.5,
  cube: 0.2,
  torus: 0.1,
  octahedron: 0.1,
  tetrahedron: 0.05,
  cone: 0.05
}

// Bounding sphere (dynamic radius)
morphMesh.geometry.computeBoundingSphere();
const radius = morphMesh.geometry.boundingSphere.radius; // 1.0-3.0+ range

// Color system
state.colorLayers.morph = {
  baseColor: '#6644aa',
  audioColor: '#ff3366',
  audioIntensity: 0.7
}
```

#### VCN Event Types:
- **"Morphic Attractor"** - Destination where dominant morph shape is strongest
  - Position: Center of morph + offset based on shape type
  - Strength: Morph weight (0.0-1.0)
  - Radius: Based on bounding sphere size
  - Example: If `sphere: 0.8`, create spherical "gravity well" destination

- **"Shape Transition Zone"** - Turbulence during rapid morph changes
  - Detect when morph weights change >0.1 per second
  - Create temporary "unstable zone" at morph center
  - Signal decays as morphing stabilizes

- **"Geometric Singularity"** - Rare event when all morph weights equalize
  - Occurs when top 3 shapes are within 0.1 of each other
  - Ultra-rare, high-value destination for exploration

---

### 2. Emoji Mandala System (RICH STRUCTURE)
**File:** `src/mandalaController.js`

#### Available Data:
```javascript
state.emojiMandala = {
  rings: 3,                    // 1-8 rings
  symmetry: 6,                 // 2-12 fold symmetry
  scale: "Major",              // Musical scale
  rotation: 0,                 // Global rotation angle
  ringRotations: [0,0,0,...],  // Per-ring rotation (differential)
  radiusPulse: 0.5,            // 0-1 audio-driven expansion
  anglePulse: 0.02,            // Symmetry wobble
  emojiScale: 1.2,             // Size pulse (0.5-1.5)
  glowIntensity: 0.8,          // Outer ring glow (0.5-1.0)
  ringRadii: [0, 2, 4, 6, 8, 10, 12, 14], // Spatial positions
  layoutMode: 'spiral',        // 'radial' | 'spiral' | 'grid'
  rainbowMode: true,           // Hue shifts per ring
  ringHues: [0, 60, 120, 180, 240, 300] // HSL hues per ring
}
```

#### VCN Event Types:
- **"Harmonic Resonance Node"** - Destination at each mandala ring
  - Position: Ring radius × symmetry angle
  - Generates 6-12 destinations per ring (based on symmetry)
  - Example: Ring 2, symmetry 6 → 6 destinations at radius=4, angles=0°,60°,120°,180°,240°,300°

- **"Musical Interval Portal"** - Scale-based destinations
  - When `musicalMode: true`, create destinations at scale degree positions
  - Major scale (0,2,4,5,7,9,11) → 7 destinations on Circle of Fifths
  - Color-coded by interval (root=red, fifth=blue, third=yellow)

- **"Spiral Vortex"** - Destination when layoutMode='spiral'
  - Single spiral attractor following golden angle (137.5°)
  - Pulls emoji streams into spiral flow pattern

- **"Ring Pulse Event"** - Transient event during audio reactivity
  - When `radiusPulse > 0.3`, outer rings are "energized"
  - Create temporary high-signal destinations at expanding ring edges

---

### 3. Vessel/Conflat-6 Compass (DIRECTIONAL)
**File:** `src/vessel.js`

#### Available Data:
```javascript
state.vessel = {
  mode: 'conflat6',            // 'gyre' | 'conflat6' | 'conflat6cube'
  enabled: true,
  spinEnabled: true,
  spinSpeedX: 0.01,
  spinSpeedY: 0.005,
  spinSpeedZ: 0.003,
  scale: 1.2,
  opacity: 0.7,
  panelAudioReactive: true
}

// Conflat-6 directional rings
const rings = [
  { dir: [0, 0, 1], label: 'North', color: 0x00ffff },    // +Z (cyan)
  { dir: [0, 0, -1], label: 'South', color: 0xff00ff },   // -Z (magenta)
  { dir: [1, 0, 0], label: 'East', color: 0xff0000 },     // +X (red)
  { dir: [-1, 0, 0], label: 'West', color: 0x00ff00 },    // -X (green)
  { dir: [0, 1, 0], label: 'Up', color: 0x0000ff },       // +Y (blue)
  { dir: [0, -1, 0], label: 'Down', color: 0xffff00 }     // -Y (yellow)
]
```

#### VCN Event Types:
- **"Directional Beacon"** - Fixed destination at each Conflat-6 face
  - 6 permanent beacons at cube faces (±X, ±Y, ±Z)
  - Distance: `1.5 * vessel.scale` from origin
  - Color: Matches ring color (cyan, magenta, red, green, blue, yellow)
  - Purpose: Navigation waypoints that define signal-space axes

- **"Panel Media Event"** - Destination when panel has uploaded image/video
  - When user uploads media to a panel (North/South/East/West/Up/Down)
  - That panel becomes "activated" destination
  - Signal strength = panel opacity pulse (0.3-1.0)

- **"Spin Vortex"** - Turbulence from vessel rotation
  - When `spinEnabled: true`, vessel rotation creates centrifugal field
  - Emoji streams get "caught" in spin wake
  - Destination appears at rotation axis (center)

---

### 4. Emoji Stream Physics (FLOW FIELD)
**File:** `src/particles.js` → `EmojiStream` class

#### Available Data:
```javascript
// Per-stream physics state
stream = {
  position: Vector3,           // Current XYZ
  velocity: Vector3,           // dx/dy/dz per frame
  acceleration: Vector3,       // Force accumulator
  scale: 1.0,                  // Visual size
  opacity: 1.0,                // Transparency
  hue: 0-360,                  // HSL color
  emoji: '🍕',                 // Rendered character
  lifetime: 0-1.0              // Fade-out stage
}

// Physics parameters
state.emojiPhysics = {
  enabled: true,
  gravity: 0.001,
  drag: 0.98,
  swirl: 0.02,
  bounce: 0.8,
  fieldFollowing: false        // NEW: VCN field integration
}
```

#### VCN Event Types:
- **"Stream Convergence Point"** - Destination where streams cluster
  - Analyze positions of all active emoji streams
  - Find centroid of densest cluster (>5 streams within radius 2.0)
  - Create "attractor vortex" destination

- **"Velocity Gradient Peak"** - High-speed flow zones
  - Sample stream velocities across grid
  - Find zones where velocity magnitude > 0.5
  - Mark as "fast current" zones (good for travel boost)

- **"Swirl Core"** - Rotational flow center
  - When `swirl > 0`, streams orbit around Y-axis
  - Core of swirl = stable destination (eye of storm)

---

### 5. Particle System Fields (SPATIAL STRUCTURE)
**File:** `src/particles.js` → `ParticleSystem`

#### Available Data (Beyond Chladni/Moiré):
```javascript
// Current layout determines particle positioning
currentLayout = 'orbit'       // 'orbit' | 'sphere' | 'grid' | 'helix' | etc.

// Organic drift (sine/cos jitter)
driftOffsets = [
  { x, y, z, s, ax, ay, az, a2 }, // Per-particle phase offsets
  ...5000 entries
]

// Trail rendering
trailEnabled: true,
trailLength: 10,                 // 0-20 frames
trailOpacity: 0.3,
trailFade: 1.0,
trailAudioReactive: true,
trailHistory: []                 // Array of position snapshots
```

#### VCN Event Types:
- **"Particle Density Hotspot"** - Destination at cluster centers
  - Sample 3D space on 2-unit grid
  - Count particles in each voxel
  - Mark voxels with >50 particles as "dense core" destinations

- **"Trail Intersection Node"** - Where particle trails cross
  - When `trailEnabled: true`, trails form visible paths
  - Find intersections between trails (line-line closest approach)
  - Mark intersections as "crossroads" destinations

- **"Layout Anchor"** - Fixed destination defined by layout geometry
  - `orbit` layout → Ring-shaped destination at orbital path
  - `sphere` layout → Spherical shell destination
  - `helix` layout → Helical curve destination

---

### 6. Telemetry System (SIGNAL INTELLIGENCE)
**File:** `src/telemetry.js`

#### Available Data:
```javascript
telemetry = {
  fft: Float32Array(1024),     // Frequency bins
  spectralFlux: 0.0-1.0,       // Change in spectrum
  onsets: [],                  // Beat/onset timestamps
  pitch: 440.0,                // Detected pitch (Hz)
  rms: 0.0-1.0,                // RMS energy
  zcr: 0.0-1.0,                // Zero-crossing rate
  spectralCentroid: 0-22050,   // "Brightness" of sound
  bands: {
    sub: 0.0-1.0,              // 20-60 Hz
    bass: 0.0-1.0,             // 60-250 Hz
    mid: 0.0-1.0,              // 250-2000 Hz
    highMid: 0.0-1.0,          // 2000-6000 Hz
    treble: 0.0-1.0            // 6000-20000 Hz
  }
}
```

#### VCN Event Types:
- **"Spectral Flux Surge"** - Transient high-change event
  - When `spectralFlux > 0.7`, sound is rapidly changing
  - Create temporary "chaos burst" destination
  - Lasts 1-2 seconds, then fades

- **"Onset Pulse"** - Beat-driven destination spawn
  - On each detected onset (beat), spawn new destination
  - Position: Random within radius 10 of camera
  - Lifetime: Decays over next 4 beats

- **"Pitch Locking Beacon"** - Destination at detected pitch frequency
  - Map pitch (Hz) to 3D position: `x = pitch/100, y = sin(pitch), z = cos(pitch)`
  - Stable destination when pitch is held for >0.5 seconds
  - Useful for melodic/harmonic navigation

- **"Frequency Band Nexus"** - Destination for each active band
  - 5 destinations (sub, bass, mid, highMid, treble)
  - Position: Vertical stack at Y = band index * 5
  - Strength: Band energy (0.0-1.0)

---

## 🔧 Implementation: Expanded FieldNavigationSystem

### Updated Architecture

```javascript
export class ExpandedFieldNavigationSystem {
  constructor(scene, particleSystem, mandalaController, vesselGroup) {
    this.scene = scene;
    this.particleSystem = particleSystem;
    this.mandalaController = mandalaController;
    this.vesselGroup = vesselGroup;

    this.updateInterval = 1000; // Scan every 1 second (faster than 2s)
    this.lastUpdate = 0;

    // Event source modules
    this.morphAnalyzer = new MorphEventAnalyzer();
    this.mandalaAnalyzer = new MandalaEventAnalyzer();
    this.vesselAnalyzer = new VesselEventAnalyzer();
    this.streamAnalyzer = new StreamEventAnalyzer();
    this.particleAnalyzer = new ParticleEventAnalyzer();
    this.telemetryAnalyzer = new TelemetryEventAnalyzer();
  }

  update(time, destinationManager, camera) {
    if (time - this.lastUpdate < this.updateInterval) return;

    // Clear old auto-generated destinations
    destinationManager.destinations = destinationManager.destinations.filter(
      d => !d.autoGenerated
    );

    // Scan ALL event sources
    const events = [];

    // 1. Morph geometry events
    if (state.morphing.enabled) {
      events.push(...this.morphAnalyzer.scan(morphMesh, state.morphWeights));
    }

    // 2. Mandala events
    if (state.emojiMandala.enabled) {
      events.push(...this.mandalaAnalyzer.scan(state.emojiMandala));
    }

    // 3. Vessel/Conflat-6 events
    if (state.vessel.enabled && this.vesselGroup) {
      events.push(...this.vesselAnalyzer.scan(this.vesselGroup, state.vessel));
    }

    // 4. Emoji stream events
    if (state.emojiPhysics.enabled) {
      events.push(...this.streamAnalyzer.scan(window.emojiStreams || []));
    }

    // 5. Particle field events (includes Chladni/Moiré)
    if (this.particleSystem) {
      events.push(...this.particleAnalyzer.scan(this.particleSystem));
    }

    // 6. Telemetry events
    if (state.audio && state.audioReactive) {
      events.push(...this.telemetryAnalyzer.scan(state.audio, state.telemetry));
    }

    // Convert events to destinations
    events.forEach(event => {
      const destination = this.eventToDestination(event);
      destination.autoGenerated = true;
      destinationManager.add(destination);
    });

    console.log(`🌐 Field scan: ${events.length} events detected from ${this.getActiveSourceCount()} sources`);
    this.lastUpdate = time;
  }

  eventToDestination(event) {
    return new SignalDestination(
      event.type,
      event.position,
      event.signalWeight
    );
  }

  getActiveSourceCount() {
    let count = 0;
    if (state.morphing.enabled) count++;
    if (state.emojiMandala.enabled) count++;
    if (state.vessel.enabled) count++;
    if (state.emojiPhysics.enabled) count++;
    if (this.particleSystem) count++;
    if (state.audioReactive) count++;
    return count;
  }
}
```

---

## 📊 Event Type Taxonomy

### Destination Categories

| Category | Event Types | Example Sources |
|----------|-------------|-----------------|
| **Attractors** | Morphic Attractor, Harmonic Resonance Node, Directional Beacon | Morph shape, Mandala rings, Conflat-6 |
| **Turbulence Zones** | Shape Transition Zone, Spectral Storm, Spin Vortex | Morph changes, Moiré, Vessel spin |
| **Flow Currents** | Stream Convergence, Velocity Gradient, Swirl Core | Emoji streams, Particle drift |
| **Transient Events** | Ring Pulse, Onset Pulse, Spectral Flux Surge | Mandala reactivity, Beat detection |
| **Fixed Landmarks** | Layout Anchor, Frequency Band Nexus, Pitch Beacon | Particle layout, Telemetry |
| **Rare Phenomena** | Geometric Singularity, Trail Intersection | Morph balance, Particle trails |

---

## 🎨 Visual Encoding in VCN Compass

### Compass Face → Event Source Mapping

Conflat-6 faces can represent different event sources:

| Face | Direction | Event Source | Color |
|------|-----------|--------------|-------|
| **North** (+Z) | Forward | Morph Attractors | Cyan |
| **South** (-Z) | Backward | Mandala Resonance | Magenta |
| **East** (+X) | Right | Emoji Streams | Red |
| **West** (-X) | Left | Particle Fields | Green |
| **Up** (+Y) | Above | Telemetry Signals | Blue |
| **Down** (-Y) | Below | Vessel Beacons | Yellow |

Each face lights up based on nearest destination of that category.

---

## 🚀 Implementation Priority

### Phase 1A+ (Add to existing plan):
1. ✅ Keep Chladni/Moiré (already planned)
2. ✅ Add Morph Attractor scanning
3. ✅ Add Mandala Resonance Node detection
4. ✅ Add Conflat-6 Directional Beacons

### Phase 1B+:
5. ✅ Add Emoji Stream clustering analysis
6. ✅ Add Telemetry onset pulse events

### Phase 1C+:
7. ✅ Add Particle density hotspots
8. ✅ Add rare event detection (singularities, trail intersections)

---

## 📈 Performance Budget

| Event Source | Update Frequency | CPU Cost | Max Destinations |
|--------------|------------------|----------|------------------|
| Morph Geometry | 1s | <1ms | 3-5 |
| Mandala | 1s | 2ms | 6-24 (rings × symmetry) |
| Vessel | 1s | <1ms | 6 (fixed) |
| Emoji Streams | 1s | 3ms | 5-10 (clusters) |
| Particle Fields | 2s | 5ms | 10-15 (voxel sampling) |
| Telemetry | Per-beat | 1ms | 1-3 (transient) |
| **TOTAL** | Mixed | **~12ms/s** | **40-60 destinations** |

Goal: <15ms per frame impact, 60 FPS maintained.

---

## ✅ Updated Success Criteria

### Phase 1 Complete When:
- [ ] VCN compass displays destinations from **6+ event sources** (not just 2)
- [ ] Morph shape generates visible attractors when dominant weight changes
- [ ] Mandala rings generate spatial resonance nodes
- [ ] Conflat-6 beacons provide fixed directional landmarks
- [ ] Emoji streams show convergence point destinations
- [ ] Telemetry onset events spawn transient beat destinations
- [ ] User can distinguish event types by color/icon in VCN panel

---

## 🎯 Conceptual Win

**Original VCN Plan:** "Chladni/Moiré patterns become navigable"

**Expanded VCN Plan:**
> "The entire MMPA signal-to-form engine becomes a **living, navigable topology** where every reactive system contributes meaningful destinations, creating a multi-layered signal-space that reveals the full complexity of the audio-visual synthesis."

---

**Bottom Line:** VCN should not be limited to 2 pattern types when MMPA has 6+ rich, audio-reactive systems already running. Each system is a **signal dimension** that can generate destinations, turbulence, attractors, and rare events.

🚀 **Let's build a VCN that explores the full depth of the signal-space!**
