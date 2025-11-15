# MMPA API Documentation

**Complete API Reference for MMPA Platform v1.0**

---

## Table of Contents

1. [Differential Geometry](#differential-geometry)
2. [Homological Integration](#homological-integration)
3. [Control Systems](#control-systems)
4. [Actuators](#actuators)
5. [Audio Processing](#audio-processing)
6. [Data Sources](#data-sources)
7. [State Management](#state-management)
8. [Visualization](#visualization)

---

## Differential Geometry

### DifferentialFormsComputer

**File**: `src/bioacoustics/differentialForms.js`

Computes differential forms (0-forms, 1-forms, 2-forms) from audio spectrograms and implements pullback transformations.

#### Constructor

```javascript
new DifferentialFormsComputer(options)
```

**Parameters**:
- `options` (Object):
  - `timeFrames` (number): Number of time frames in spectrogram
  - `frequencyBins` (number): Number of frequency bins (default: 1024)

**Example**:
```javascript
const df = new DifferentialFormsComputer({
  timeFrames: 100,
  frequencyBins: 1024
});
```

#### Methods

##### `computeFormsFromSpectrogram(spectrogram, numFrames)`

Computes all differential forms from a spectrogram.

**Parameters**:
- `spectrogram` (Float32Array): Flattened spectrogram data
- `numFrames` (number): Number of time frames

**Returns**: void

**Side Effects**: Populates `this.zeroForms`, `this.oneForms`, `this.twoForms`

**Example**:
```javascript
const spectrogram = new Float32Array(100 * 1024);
// ... fill with spectrogram data ...
df.computeFormsFromSpectrogram(spectrogram, 100);

// Access computed forms
const energy = df.zeroForms;      // Energy density (0-forms)
const momentum = df.oneForms;     // Covector fields (1-forms)
const symplectic = df.twoForms;   // Area forms (2-forms)
```

##### `pullback(form, map)`

Applies pullback transformation F*ω for coordinate changes.

**Parameters**:
- `form` (Object): Differential form with structure:
  ```javascript
  {
    degree: number,  // 0, 1, or 2
    data: any        // Form data (structure depends on degree)
  }
  ```
- `map` (Function): Coordinate transformation `(t, f) => {t: number, f: number}`

**Returns**: Object with structure:
```javascript
{
  type: 'pullback',
  degree: number,
  map: Function,
  baseForm: Object,
  evaluate: Function  // (t, f) => number
}
```

**Example**:
```javascript
// Define coordinate transformation (bird → whale)
const birdToWhale = (t, f) => ({
  t: t * 2.5,    // Whales slower
  f: f * 0.3     // Whales lower frequency
});

// Create 0-form
const zeroForm = {
  degree: 0,
  data: df.zeroForms
};

// Apply pullback
const transformed = df.pullback(zeroForm, birdToWhale);

// Evaluate at a point
const value = transformed.evaluate(10, 440);  // time=10, freq=440Hz
```

##### `exteriorDerivative(form)`

Computes exterior derivative d: Ωᵏ → Ωᵏ⁺¹

**Parameters**:
- `form` (Object): Differential form (degree 0 or 1)

**Returns**: Object representing (k+1)-form

**Example**:
```javascript
const oneForm = { degree: 1, data: df.oneForms };
const twoForm = df.exteriorDerivative(oneForm);
// twoForm.degree === 2
```

---

## Homological Integration

### HomologicalIntegrator

**File**: `src/bioacoustics/homology.js`

Implements homological integration ⟨T, ω⟩, boundary operator ∂, and persistent homology computation.

#### Constructor

```javascript
new HomologicalIntegrator()
```

**Example**:
```javascript
const homology = new HomologicalIntegrator();
```

#### Methods

##### `createZeroCurrent(q, p, weight)`

Creates a 0-current (point mass) in phase space.

**Parameters**:
- `q` (number): Position coordinate (e.g., frequency)
- `p` (number): Momentum coordinate (e.g., amplitude rate)
- `weight` (number): Mass/weight of point (default: 1.0)

**Returns**: Object
```javascript
{
  degree: 0,
  position: {q, p},
  weight: number,
  id: string
}
```

**Example**:
```javascript
const point = homology.createZeroCurrent(440, 0.8, 1.0);
```

##### `createOneCurrent(points, weight)`

Creates a 1-current (curve/trajectory) from an array of points.

**Parameters**:
- `points` (Array): Array of `{q, p}` points
- `weight` (number): Weight of curve (default: 1.0)

**Returns**: Object
```javascript
{
  degree: 1,
  points: Array<{q, p}>,
  weight: number,
  id: string
}
```

**Example**:
```javascript
const curve = homology.createOneCurrent([
  {q: 0, p: 0},
  {q: 1, p: 0.5},
  {q: 2, p: 1.0}
], 1.0);
```

##### `createTwoCurrent(triangles, weight)`

Creates a 2-current (surface) from triangulation.

**Parameters**:
- `triangles` (Array): Array of triangles, each with 3 vertices `[{q, p}, {q, p}, {q, p}]`
- `weight` (number): Weight of surface (default: 1.0)

**Returns**: Object
```javascript
{
  degree: 2,
  triangles: Array,
  weight: number,
  id: string
}
```

**Example**:
```javascript
const surface = homology.createTwoCurrent([
  [{q: 0, p: 0}, {q: 1, p: 0}, {q: 0, p: 1}]
], 1.0);
```

##### `boundary(current)`

Computes boundary operator ∂: Dₖ → Dₖ₋₁

**Parameters**:
- `current` (Object): k-current (degree 0, 1, or 2)

**Returns**: Object or null
- For 0-current: returns `null` (∂(point) = 0)
- For 1-current: returns 0-current with components
- For 2-current: returns 1-current with boundary curves

**Example**:
```javascript
const curve = homology.createOneCurrent([{q: 0, p: 0}, {q: 1, p: 1}], 1.0);
const boundary = homology.boundary(curve);
// boundary = {degree: 0, components: [{position: {q:1, p:1}, weight: 1}, ...]}
```

##### `integrate(current, form)`

Integrates differential form over current: ⟨T, ω⟩

**Parameters**:
- `current` (Object): k-current
- `form` (Object): k-form (degrees must match)

**Returns**: number (integration value)

**Caching**: Results are cached with FIFO eviction (max 1000 entries)

**Example**:
```javascript
const point = homology.createZeroCurrent(440, 0.8, 1.0);
const zeroForm = {degree: 0, data: df.zeroForms};
const integral = homology.integrate(point, zeroForm);
// Returns: scalar value
```

##### `verifyStokes(current, form, exteriorDerivative)`

Verifies Stokes' theorem: ∫_∂Ω ω = ∫_Ω dω

**Parameters**:
- `current` (Object): k-current T
- `form` (Object): (k-1)-form α
- `exteriorDerivative` (Object): k-form dα

**Returns**: Object
```javascript
{
  lhs: number,        // ⟨∂T, α⟩ (boundary integral)
  rhs: number,        // ⟨T, dα⟩ (region integral)
  error: number,      // |lhs - rhs|
  verified: boolean   // error < 1e-6
}
```

**Example**:
```javascript
const curve = homology.createOneCurrent([{q: 0, p: 0}, {q: 1, p: 1}], 1.0);
const oneForm = {degree: 1, data: {q: 1.0, p: 1.0}};
const twoForm = {degree: 2, data: [[{value: 0.0}]]};

const result = homology.verifyStokes(curve, oneForm, twoForm);
// result.verified === true (Stokes theorem holds)
```

##### `computePersistentHomology(phaseSpacePoints, maxScale)`

Computes persistent homology barcodes for topological feature detection.

**Parameters**:
- `phaseSpacePoints` (Array): Array of `{q, p}` points
- `maxScale` (number): Maximum filtration scale (default: 2.0)

**Returns**: Array of features
```javascript
[
  {
    birth: number,       // Scale when feature appears
    death: number,       // Scale when feature disappears (Infinity for persistent)
    persistence: number  // death - birth
  },
  ...
]
```

**Example**:
```javascript
const points = [];
for (let i = 0; i < 50; i++) {
  const angle = (i / 50) * 2 * Math.PI;
  points.push({
    q: 440 + 50 * Math.cos(angle),
    p: 0.5 + 0.3 * Math.sin(angle)
  });
}

const features = homology.computePersistentHomology(points, 100);
// Returns: Array of topological features (connected components, loops, voids)
```

---

## Control Systems

### LQRController

**File**: `src/control/lqrController.js`

Linear Quadratic Regulator for optimal state feedback control.

#### Constructor

```javascript
new LQRController(options)
```

**Parameters**:
- `options` (Object):
  - `Q_gain` (number): State error weight (default: 1.0)
  - `R_gain` (number): Control effort weight (default: 0.1)
  - `target_state` (number): Desired setpoint (default: 0.618)
  - `dt` (number): Time step in seconds (default: 1/60)

**Example**:
```javascript
const lqr = new LQRController({
  Q_gain: 1.0,
  R_gain: 0.1,
  target_state: 0.618,  // Golden ratio
  dt: 1/60
});
```

#### Methods

##### `computeControl(current_state, dt)`

Computes optimal control signal u = [Trans_sm, Res]

**Parameters**:
- `current_state` (number): Current Σ* value
- `dt` (number): Time step (optional, uses constructor dt if not provided)

**Returns**: Array<number> `[Trans_sm, Res]`
- `Trans_sm`: Transformation smoothness control
- `Res`: Resilience control

**Example**:
```javascript
const currentState = 0.5;
const controlSignal = lqr.computeControl(currentState, 1/60);
// Returns: [-0.118, -0.118] (example values, pulls toward 0.618)
```

##### `update(current_state, dt)`

Updates controller state and returns control signal.

**Parameters**:
- `current_state` (number): Current Σ* value
- `dt` (number): Time step

**Returns**: Array<number> `[Trans_sm, Res]`

**Side Effects**: Updates internal controller state

**Example**:
```javascript
// In animation loop
function animate() {
  const dt = 1/60;
  const currentState = computeCurrentState();
  const controlSignal = lqr.update(currentState, dt);

  // Apply to actuators
  mechActuator.actuate(controlSignal, currentState);

  requestAnimationFrame(animate);
}
```

##### `setTargetState(target)`

Updates target setpoint.

**Parameters**:
- `target` (number): New target Σ* value

**Returns**: void

**Example**:
```javascript
lqr.setTargetState(0.707);  // Change to √2/2
```

---

## Actuators

### MechanicalActuator

**File**: `src/actuator/mechanicalActuator.js`

Translates control signals into mechanical system parameters (damping, load capacity).

#### Constructor

```javascript
new MechanicalActuator(options)
```

**Parameters**:
- `options` (Object):
  - `initialDamping` (number): Initial damping coefficient (default: 1000)
  - `initialLoadLimit` (number): Initial load capacity 0-1 (default: 0.8)
  - `damping_gain` (number): Sensitivity to Trans_sm (default: 500)
  - `load_gain` (number): Sensitivity to Res (default: 0.15)

**Example**:
```javascript
const mechActuator = new MechanicalActuator({
  initialDamping: 1000,
  initialLoadLimit: 0.8,
  damping_gain: 500,
  load_gain: 0.15
});
```

#### Methods

##### `actuate(u, current_state)`

Applies control signal to generate mechanical adjustments.

**Parameters**:
- `u` (Array<number>): Control signal `[Trans_sm, Res]`
- `current_state` (number): Current Σ* value

**Returns**: Object
```javascript
{
  damping_delta: number,        // Change in damping coefficient
  load_delta: number,           // Change in load capacity
  action: string,               // 'INCREASE_LOAD' | 'REDUCE_LOAD' | 'MAINTAIN'
  current_damping: number,
  current_load: number,
  new_damping: number,
  new_load: number
}
```

**Example**:
```javascript
const controlSignal = [-0.1, -0.1];  // Conservative
const state = 0.8;

const response = mechActuator.actuate(controlSignal, state);
// response.damping_delta > 0  (increased damping)
// response.load_delta < 0     (reduced load capacity)
// response.action === 'REDUCE_LOAD'
```

### FinancialActuator

**File**: `src/actuator/financialActuator.js`

Translates control signals into trading commands (velocity, exposure).

#### Constructor

```javascript
new FinancialActuator(options)
```

**Parameters**:
- `options` (Object):
  - `maxTradeVelocity` (number): Max shares/sec (default: 100)
  - `minExposure` (number): Min portfolio % (default: 0.0)
  - `maxExposure` (number): Max portfolio % (default: 1.0)
  - `initialExposure` (number): Starting exposure (default: 0.5)
  - `velocity_gain` (number): Sensitivity to Trans_sm (default: 50.0)
  - `exposure_gain` (number): Sensitivity to Res (default: 0.2)
  - `emergencyStopThreshold` (number): Σ* halt threshold (default: 0.3)

**Example**:
```javascript
const finActuator = new FinancialActuator({
  maxTradeVelocity: 100,
  initialExposure: 0.7,
  velocity_gain: 50.0,
  exposure_gain: 0.2,
  emergencyStopThreshold: 0.3
});
```

#### Methods

##### `actuate(u, current_state)`

Applies control signal to generate trading commands.

**Parameters**:
- `u` (Array<number>): Control signal `[Trans_sm, Res]`
- `current_state` (number): Current Σ* value

**Returns**: Object
```javascript
{
  trade_velocity: number,       // shares/sec (negative = sell)
  exposure_target: number,      // desired portfolio % (0-1)
  exposure_delta: number,       // change from current
  action: string,               // 'BUY' | 'SELL' | 'HOLD' | 'HALT'
  halted: boolean,
  current_exposure: number
}
```

**Emergency Stop**: If `current_state < emergencyStopThreshold`, returns:
```javascript
{
  trade_velocity: 0,
  exposure_target: 0,  // Go to cash
  action: 'HALT',
  halted: true,
  reason: 'Crisis detected'
}
```

**Example**:
```javascript
const controlSignal = [0.1, 0.1];  // Aggressive
const state = 0.8;

const response = finActuator.actuate(controlSignal, state);
// response.trade_velocity > 0  (buy)
// response.exposure_delta > 0  (increase exposure)
// response.action === 'BUY'
```

##### `updateExposure(new_exposure)`

Updates current exposure after trade execution.

**Parameters**:
- `new_exposure` (number): New portfolio exposure (0-1)

**Returns**: void

**Example**:
```javascript
finActuator.updateExposure(0.75);  // Now 75% invested
```

---

## Audio Processing

### AudioEngine

**File**: `src/audio/audioEngine.js`

Core audio processing with FFT and spectrogram computation.

#### Global Access

```javascript
import { audioEngine } from './src/audio/audioEngine.js';
```

#### Methods

##### `initialize()`

Initializes Web Audio API context and analyzer.

**Returns**: Promise<void>

**Example**:
```javascript
await audioEngine.initialize();
```

##### `getFrequencyData()`

Gets current frequency domain data.

**Returns**: Uint8Array (frequency magnitudes 0-255)

**Example**:
```javascript
const frequencyData = audioEngine.getFrequencyData();
// frequencyData.length === fftSize / 2
```

##### `getTimeDomainData()`

Gets current time domain waveform.

**Returns**: Uint8Array (amplitude values 0-255)

**Example**:
```javascript
const waveform = audioEngine.getTimeDomainData();
```

---

## Data Sources

### CameraSignalRouter

**File**: `src/cameraSignalProvider.js`

Manages multiple data sources (audio, WebSocket, crypto, generators).

#### Properties

```javascript
{
  currentProvider: string,      // 'audio' | 'osc' | 'binance' | 'coincap' | 'generator'
  oscAdapter: OSCSignalAdapter,
  binanceSource: BinanceWebSocketSource,
  coincapSource: CoinCapWebSocketSource,
  generatorSource: SignalGeneratorSource
}
```

#### Methods

##### `switchProvider(providerName)`

Switches active data source.

**Parameters**:
- `providerName` (string): Name of provider

**Returns**: void

**Example**:
```javascript
cameraSignalRouter.switchProvider('binance');
```

##### `startOSC(wsUrl)`

Starts OSC WebSocket connection.

**Parameters**:
- `wsUrl` (string): WebSocket URL (default: 'ws://localhost:8080')

**Returns**: Promise<void>

**Example**:
```javascript
await cameraSignalRouter.startOSC('ws://localhost:8080');
```

---

## State Management

### Global State Object

**File**: `src/state.js`

Central state management for the application.

#### Structure

```javascript
{
  // Audio
  audioEnabled: boolean,

  // MMPA Features
  mmpaFeatures: {
    enabled: boolean,
    identity: {fundamentalFreq, strength, timbre},
    structure: {curvature, torsion, boundary},
    dynamics: {energyDensity, pressure, flow},
    transformation: {flux, velocity, acceleration},
    alignment: {coherence, stability, synchrony},
    potential: {entropy, unpredictability, freedom}
  },

  // Visual Parameters
  visualParams: {
    animationSpeed: number,
    motionVelocity: number,
    turbulence: number,
    particleRandomness: number,
    // ... etc
  },

  // Control
  control: {
    setpoint: number,
    currentState: number,
    controlSignal: [number, number]
  }
}
```

#### Example Usage

```javascript
import { state } from './src/state.js';

// Enable features
state.mmpaFeatures.enabled = true;

// Read current state
const currentSigmaStar = state.control.currentState;

// Update visual parameters
state.visualParams.motionVelocity = 0.5;
```

---

## Additional Resources

- **Examples**: See `test_*.js` files for usage examples
- **Source Code**: All modules include inline JSDoc comments
- **Validation**: See `VALIDATION_COMPLETE.md` for test coverage

---

**API Version**: 1.0
**Last Updated**: 2025-11-14
**Status**: Production Ready ✅
