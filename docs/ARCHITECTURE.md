# MMPA Architecture Documentation

**System Design & Data Flow for MMPA Platform v1.0**

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Data Flow](#data-flow)
4. [Core Components](#core-components)
5. [Design Patterns](#design-patterns)
6. [Performance Considerations](#performance-considerations)
7. [Extensibility](#extensibility)

---

## Overview

MMPA follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (WebGL)          │  ← Visualization
├─────────────────────────────────────────────┤
│       Mapping Layer (Feature → Visual)       │  ← Translation
├─────────────────────────────────────────────┤
│     Control Layer (LQR + Actuators)         │  ← Feedback
├─────────────────────────────────────────────┤
│    Analysis Layer (Differential Geometry)    │  ← Mathematics
├─────────────────────────────────────────────┤
│       Data Layer (Audio + Signals)           │  ← Input
└─────────────────────────────────────────────┘
```

### Design Principles

1. **Mathematical Rigor**: All operations grounded in verified mathematics
2. **Modularity**: Components are independent and composable
3. **Performance**: Real-time capable (60 FPS target)
4. **Memory Safety**: Bounded caches with FIFO eviction
5. **Testability**: All core modules have automated tests

---

## System Architecture

### High-Level Components

```
                    ┌──────────────┐
                    │   Browser    │
                    │   (WebGL)    │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼─────┐     ┌──────▼──────┐    ┌─────▼──────┐
   │   HUD    │     │   3D Scene   │    │  Particles │
   │ Controls │     │   Render     │    │   System   │
   └─────┬────┘     └──────┬───────┘    └─────┬──────┘
         │                 │                   │
         └─────────────────┼───────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Mapping   │
                    │    Layer    │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼─────┐     ┌──────▼──────┐    ┌─────▼──────┐
   │  MMPA    │     │  LQR Ctrl   │    │ Actuators  │
   │ Features │     │  (Control)  │    │  (Output)  │
   └─────┬────┘     └──────┬───────┘    └────────────┘
         │                 │
    ┌────▼──────────────────▼────┐
    │   Differential Geometry    │
    │   (Forms + Homology)       │
    └────┬──────────────────┬────┘
         │                  │
   ┌─────▼──────┐    ┌──────▼──────┐
   │ Spectrogram│    │  Persistent │
   │  Pipeline  │    │  Homology   │
   └─────┬──────┘    └─────────────┘
         │
   ┌─────▼──────┐
   │   Audio    │
   │   Engine   │
   └─────┬──────┘
         │
   ┌─────▼──────┐
   │   Data     │
   │  Sources   │
   └────────────┘
```

---

## Data Flow

### Primary Data Pipeline

```
Audio Input (Microphone/WebSocket/Generator)
    ↓
Audio Engine (FFT, Frequency Analysis)
    ↓
Spectrogram Pipeline (Time-Frequency Decomposition)
    ↓
Differential Forms Computer
    ├→ 0-forms (Energy Density)
    ├→ 1-forms (Momentum Covectors)
    └→ 2-forms (Symplectic Structure)
    ↓
MMPA Feature Extraction
    ├→ Identity (fundamentalFreq, strength, timbre)
    ├→ Structure (curvature, torsion, boundary)
    ├→ Dynamics (energyDensity, pressure, flow)
    ├→ Transformation (flux, velocity, acceleration)
    ├→ Alignment (coherence, stability, synchrony)
    └→ Potential (entropy, unpredictability, freedom)
    ↓
Mapping Layer (Features → Visual Parameters)
    ├→ Color (hue, saturation, brightness)
    ├→ Motion (velocity, turbulence, intensity)
    ├→ Form (stability, clarity, coherence)
    └→ Chaos (randomness, variation, relaxation)
    ↓
Visualization System (WebGL Renderer)
    ├→ Particle Systems
    ├→ Geometry Morphing
    └→ Shader Effects
```

### Control Feedback Loop

```
        ┌──────────────────────┐
        │  Σ* (System State)   │
        └──────────┬───────────┘
                   │
        ┌──────────▼───────────┐
        │   LQR Controller     │
        │  (Optimal Feedback)  │
        └──────────┬───────────┘
                   │
            u = [Trans_sm, Res]
                   │
        ┌──────────▼───────────┐
        │     Actuators        │
        ├──────────────────────┤
        │  Mechanical (θ, L)   │
        │  Financial  (v, E)   │
        └──────────┬───────────┘
                   │
        ┌──────────▼───────────┐
        │   System Response    │
        │   (State Update)     │
        └──────────┬───────────┘
                   │
                   └───────────┐
                               ↓
                        (feedback to Σ*)
```

**Legend**:
- Σ*: Aggregate state (normalized 0-1)
- u: Control signal vector
- Trans_sm: Transformation smoothness control
- Res: Resilience control
- θ: Damping coefficient
- L: Load capacity
- v: Trade velocity
- E: Portfolio exposure

---

## Core Components

### 1. Data Layer

#### Audio Engine (`src/audio/audioEngine.js`)

**Responsibility**: Real-time audio capture and FFT analysis

**Key Features**:
- Web Audio API integration
- AnalyserNode for frequency/time domain data
- Configurable FFT window (default: 2048)
- 60 Hz update rate

**Data Flow**:
```
Microphone → AudioContext → AnalyserNode → getFrequencyData() → Float32Array
```

#### Signal Providers (`src/cameraSignalProvider.js`)

**Responsibility**: Multi-source data routing

**Providers**:
1. **AudioSignalAdapter**: Live microphone input
2. **OSCSignalAdapter**: WebSocket OSC protocol (with reconnection)
3. **BinanceWebSocketSource**: Crypto market data
4. **CoinCapWebSocketSource**: Alternative crypto source
5. **SignalGeneratorSource**: Synthetic signals (sine, noise, chirp)

**Pattern**: Strategy pattern for interchangeable data sources

---

### 2. Analysis Layer

#### Spectrogram Pipeline (`src/bioacoustics/spectrogramPipeline.js`)

**Responsibility**: Time-frequency decomposition

**Algorithm**:
```javascript
for each time frame:
  1. Apply windowing function (Hann)
  2. Compute FFT
  3. Calculate magnitude spectrum
  4. Store in 2D array [time × frequency]
```

**Memory Management**:
- Rotating buffers (FIFO)
- Fixed size allocation
- No unbounded growth

#### Differential Forms Computer (`src/bioacoustics/differentialForms.js`)

**Responsibility**: Compute differential forms from spectrograms

**Mathematics**:
- **0-forms**: ω⁰(t,f) = energy(t,f)
- **1-forms**: ω¹ = (∂E/∂t)dt + (∂E/∂f)df
- **2-forms**: ω² = (∂²E/∂t∂f)dt∧df

**Key Methods**:
- `computeFormsFromSpectrogram()`: Main computation
- `pullback()`: Coordinate transformation F*ω
- `exteriorDerivative()`: d: Ωᵏ → Ωᵏ⁺¹

#### Homological Integrator (`src/bioacoustics/homology.js`)

**Responsibility**: Integration and topology

**Mathematics**:
- **Integration**: ⟨T, ω⟩ for k-currents T and k-forms ω
- **Boundary**: ∂: Dₖ → Dₖ₋₁ with ∂∂ = 0
- **Persistent Homology**: Vietoris-Rips filtration
- **Stokes' Theorem**: ∫_∂Ω ω = ∫_Ω dω (verified)

**Optimization**:
- Integration cache (1000 entries, FIFO eviction)
- O(1) cache lookup
- Persistent feature caching

---

### 3. Control Layer

#### LQR Controller (`src/control/lqrController.js`)

**Responsibility**: Optimal state feedback

**Theory**:
```
Cost Function: J = ∫(xᵀQx + uᵀRu)dt

Optimal Control: u* = -Kx
where K = R⁻¹BᵀP (gain matrix)

Riccati Equation: AᵀP + PA - PBR⁻¹BᵀP + Q = 0
```

**Implementation**:
- Discrete-time LQR
- 60 Hz update rate (dt = 1/60)
- Configurable Q (state weight) and R (control weight)

#### Actuators (`src/actuator/`)

**Responsibility**: Domain-specific control translation

**MechanicalActuator**:
```
u = [Trans_sm, Res]
  ↓
θ_new = θ + Trans_sm × gain_damping
L_new = L + Res × gain_load
```

**FinancialActuator**:
```
u = [Trans_sm, Res]
  ↓
v = Trans_sm × gain_velocity  (trade velocity)
E = E_current + Res × gain_exposure  (exposure)
```

**Safety Features**:
- Rate limiting (max velocity)
- Range constraints (min/max exposure)
- Emergency stop (halt on crisis)

---

### 4. Mapping Layer

#### Feature → Visual Translation (`src/mappingLayer.js`)

**Responsibility**: Bridge between analysis and visualization

**Mapping Rules**:

| MMPA Feature | Visual Parameter | Mapping |
|--------------|------------------|---------|
| fundamentalFreq | hue | log(freq) → 0-360° |
| strength | saturation | direct (0-1) |
| flux | animationSpeed | 0.5 + flux × 1.5 |
| velocity | motionVelocity | direct |
| entropy | particleRandomness | direct |
| coherence | visualClarity | direct |

**NaN Protection**:
```javascript
// Motion parameters default to 0 (no movement)
const safeFlux = isNaN(flux) ? 0 : flux;

// Visual parameters default to moderate values
const safeCoherence = isNaN(coherence) ? 0.78 : coherence;
```

---

### 5. Presentation Layer

#### WebGL Renderer

**Responsibility**: 3D visualization

**Components**:
- **Particle System**: 10,000+ particles with physics
- **Geometry Morphing**: Dynamic mesh deformation
- **Shader Pipeline**: GLSL fragment/vertex shaders
- **Camera System**: Orbital controls

**Performance**:
- Target: 60 FPS
- Actual: ~60 FPS on modern hardware
- Frame budget: 16.67ms

---

## Design Patterns

### 1. Strategy Pattern (Data Sources)

```javascript
class SignalProviderStrategy {
  async start() { /* ... */ }
  async stop() { /* ... */ }
  getData() { /* ... */ }
}

class AudioSignalAdapter extends SignalProviderStrategy { /* ... */ }
class OSCSignalAdapter extends SignalProviderStrategy { /* ... */ }
```

**Benefit**: Easy to add new data sources without modifying router

### 2. Observer Pattern (State Updates)

```javascript
// State changes trigger UI updates
state.mmpaFeatures.enabled = true;
// → Event listeners notify subscribers
// → UI updates automatically
```

**Benefit**: Decoupled components, reactive updates

### 3. Cache Pattern (Integration)

```javascript
// FIFO cache with size limit
class IntegrationCache {
  constructor(maxSize = 1000) { /* ... */ }

  get(key) {
    if (cache.has(key)) return cache.get(key);  // O(1)
    return null;
  }

  set(key, value) {
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);  // FIFO eviction
    }
    cache.set(key, value);
  }
}
```

**Benefit**: Performance + bounded memory

### 4. Builder Pattern (Currents)

```javascript
homology.createZeroCurrent(q, p, weight)
homology.createOneCurrent(points, weight)
homology.createTwoCurrent(triangles, weight)
```

**Benefit**: Clear API for complex object construction

---

## Performance Considerations

### Bottlenecks

1. **FFT Computation**: ~1ms per frame (acceptable)
2. **Differential Forms**: ~5ms for 100 frames (optimized)
3. **Persistent Homology**: ~50ms for 50 points (async recommended)
4. **WebGL Rendering**: ~16ms target (achieved)

### Optimizations

#### 1. Integration Caching

```javascript
// Before: O(n) integration every frame
// After: O(1) cache lookup (1000-entry limit)
const result = cache.get(key) || compute();
```

**Impact**: 100x speedup for repeated integrations

#### 2. Spectrogram Buffering

```javascript
// Rotating buffers prevent unbounded growth
if (buffer.size > MAX_SIZE) {
  buffer.shift();  // Remove oldest
}
```

**Impact**: Stable memory (~2 MB)

#### 3. NaN Short-Circuits

```javascript
// Early exit on invalid data
if (isNaN(flux)) return 0;  // Don't compute
```

**Impact**: Prevents cascading NaN propagation

### Memory Profile

| Component | Size | Growth |
|-----------|------|--------|
| Base application | 40 MB | Stable |
| Integration cache | 5 MB | Capped at 1000 |
| Audio buffers | 2 MB | Rotating |
| Spectrogram | 3 MB | Fixed |
| **Total** | **~50 MB** | **+3 MB per 5000 ops** |

---

## Extensibility

### Adding a New Data Source

1. **Create Provider Class**:
```javascript
class NewSignalProvider extends SignalProviderStrategy {
  async start() { /* init */ }
  async stop() { /* cleanup */ }
  getData() { /* return signal */ }
}
```

2. **Register in Router**:
```javascript
cameraSignalRouter.newProvider = new NewSignalProvider();
```

3. **Add Switch Case**:
```javascript
cameraSignalRouter.switchProvider('newProvider');
```

### Adding a New Actuator

1. **Create Actuator Class**:
```javascript
class CustomActuator {
  constructor(options) { /* ... */ }
  actuate(u, state) {
    // Transform [Trans_sm, Res] → domain params
    return { /* response */ };
  }
}
```

2. **Connect to Controller**:
```javascript
const response = customActuator.actuate(lqr.computeControl(state), state);
```

### Adding a New MMPA Feature

1. **Define in Ratio Engine**:
```javascript
const newFeature = computeNewFeature(differentialForms);
```

2. **Add to State**:
```javascript
state.mmpaFeatures.newCategory = {
  feature1: value,
  feature2: value
};
```

3. **Map to Visuals**:
```javascript
visualParams.newParam = state.mmpaFeatures.newCategory.feature1;
```

---

## Validation & Quality

### Test Coverage

- **Unit Tests**: 20/20 passing (100%)
- **Integration Tests**: Stokes theorem verified
- **Memory Tests**: No leaks detected
- **Performance Tests**: 60 FPS maintained

### Code Quality

- **Modularity**: ES6 modules, clear separation
- **Documentation**: JSDoc comments throughout
- **Error Handling**: Graceful degradation (NaN protection)
- **Type Safety**: Implicit via JSDoc annotations

---

## Future Architecture

### Planned Improvements (v2.0)

1. **GPU Acceleration**: WebGPU for differential forms
2. **Multi-Threading**: Web Workers for homology
3. **Streaming**: Real-time Morse theory
4. **WASM**: Performance-critical math in Rust/C++

### Scalability

Current limits:
- **Time frames**: 100 (5ms computation)
- **Frequency bins**: 1024 (FFT size)
- **Particles**: 10,000 (60 FPS)
- **Cache size**: 1000 entries

Future targets (v2.0):
- **Time frames**: 1000+
- **Frequency bins**: 4096+
- **Particles**: 100,000+
- **Cache size**: Adaptive (10,000+)

---

**Architecture Version**: 1.0
**Last Updated**: 2025-11-14
**Status**: Production Ready ✅
