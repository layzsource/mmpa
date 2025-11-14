# Audio Signal Processing Validation Guide

## Quick Start

### 1. Launch Application and Open DevTools

```bash
npm start
# Press Cmd+Option+I (Mac) or Ctrl+Shift+I (Windows/Linux)
```

### 2. Enable Audio and Run Validation

```javascript
// Import the validator (if not already exposed)
// The validator should be available as window.audioValidator if properly integrated

// Start validation (collects 1800 samples = 30 seconds at 60fps)
window.audioValidator.start();

// Play some music or enable microphone input
// Wait 30 seconds...

// Get report
window.audioValidator.printReport();
```

## What Gets Measured

### 1. Jitter (Smoothness)
**What:** Frame-to-frame variance in audio band values
**Why:** Lower jitter = smoother visuals, less flickering
**Goal:** Kalman filter should reduce jitter by >30%

### 2. Lag (Responsiveness)
**What:** Delay between raw signal and filtered signal
**Why:** Lower lag = more responsive to drops/beats
**Goal:** Lag should be <3 frames (<50ms)

### 3. SNR (Signal-to-Noise Ratio)
**What:** Ratio of signal power to noise power
**Why:** Higher SNR = cleaner signal with less noise
**Goal:** Filtered SNR should be higher than raw

### 4. Quality Score (0-100)
**What:** Weighted combination of jitter, lag, and SNR
**Why:** Overall measure of visual quality
**Goal:** Filtered quality should be >10 points higher than raw

## Example Report

```
📊 ═══════════════════════════════════════════════════════════
📊 AUDIO SIGNAL VALIDATION REPORT
📊 ═══════════════════════════════════════════════════════════

⏱️  Collection Stats:
   Samples: 1800
   Duration: 30.0s
   Avg FPS: 60.0

🎵 Per-Band Analysis:
───────────────────────────────────────────────────────────────────────────
Band    │ Jitter Reduct. │ Lag (frames) │ SNR Gain │ Quality Gain
───────────────────────────────────────────────────────────────────────────
bass    │         42.3% │          2.1 │   +3.2 dB │       +15.6
mid     │         38.7% │          1.8 │   +2.9 dB │       +14.2
treble  │         35.4% │          2.3 │   +2.5 dB │       +12.8
level   │         45.1% │          1.5 │   +3.8 dB │       +18.3
───────────────────────────────────────────────────────────────────────────

📈 Overall Summary:
   Average Jitter Reduction: 40.4%
   Average Quality Gain: +15.2 points
   Average Lag: 1.9 frames (31.7ms)

💡 Recommendation:
   Kalman filtering is BENEFICIAL - significant jitter reduction with minimal lag
```

## Interpreting Results

### ✅ Good Results (Filtering is Beneficial)
```
Jitter Reduction: >30%
Lag: <3 frames (<50ms)
Quality Gain: >10 points
```
**Action:** Keep Kalman filtering enabled with current preset

### ⚠️ Marginal Results (Filtering is Okay)
```
Jitter Reduction: 10-30%
Lag: 3-5 frames (50-83ms)
Quality Gain: 5-10 points
```
**Action:** Consider adjusting preset or testing with/without

### ❌ Poor Results (Filtering Adds Problems)
```
Jitter Reduction: <10%
Lag: >5 frames (>83ms)
Quality Gain: <5 points or negative
```
**Action:** Disable filtering or switch to 'reactive' preset

## Testing Different Presets

The Kalman filter has 4 presets with different tradeoffs:

### 1. Smooth (Maximum Stability)
```javascript
AudioEngine.setKalmanPreset('smooth');
window.audioValidator.start();
// Wait 30 seconds...
window.audioValidator.printReport();
```

**Expected:**
- Highest jitter reduction (>50%)
- Highest lag (3-5 frames)
- Best for slow, ambient music

### 2. Balanced (Default)
```javascript
AudioEngine.setKalmanPreset('balanced');
window.audioValidator.start();
// Wait 30 seconds...
window.audioValidator.printReport();
```

**Expected:**
- Good jitter reduction (30-40%)
- Moderate lag (2-3 frames)
- Best for most music genres

### 3. Responsive (Fast Transients)
```javascript
AudioEngine.setKalmanPreset('responsive');
window.audioValidator.start();
// Wait 30 seconds...
window.audioValidator.printReport();
```

**Expected:**
- Moderate jitter reduction (20-30%)
- Low lag (1-2 frames)
- Best for electronic, high-energy music

### 4. Reactive (Maximum Responsiveness)
```javascript
AudioEngine.setKalmanPreset('reactive');
window.audioValidator.start();
// Wait 30 seconds...
window.audioValidator.printReport();
```

**Expected:**
- Minimal jitter reduction (10-20%)
- Minimal lag (<1 frame)
- Closest to raw signal

## Comparing Raw vs Filtered

### Test 1: Disable Filtering
```javascript
// Disable Kalman filter (use raw signal)
AudioEngine.setKalmanEnabled(false);

window.audioValidator.start();
// Wait 30 seconds...
const rawReport = window.audioValidator.getReport();

// Enable Kalman filter
AudioEngine.setKalmanEnabled(true);

window.audioValidator.start();
// Wait 30 seconds...
const filteredReport = window.audioValidator.getReport();

// Compare
console.log('Raw Jitter:', rawReport.summary.avgJitterImprovement);
console.log('Filtered Jitter:', filteredReport.summary.avgJitterImprovement);
```

### Test 2: Visual Inspection
```javascript
// Enable validator to see real-time data
window.audioValidator.start();

// While music is playing, watch particles/visuals
// Raw signal will show more flickering/jitter
// Filtered signal will be smoother

// Compare:
AudioEngine.setKalmanEnabled(false); // Raw - should be jittery
AudioEngine.setKalmanEnabled(true);  // Filtered - should be smooth
```

## Advanced: Export Data for Analysis

```javascript
// Collect samples
window.audioValidator.start();
// Wait 30 seconds...

// Export data as JSON
const data = window.audioValidator.exportData();

// Copy to clipboard
copy(JSON.stringify(data, null, 2));

// Or save to file (in Node.js environment)
// fs.writeFileSync('audio_validation.json', JSON.stringify(data, null, 2));
```

You can then analyze the data in Python, R, MATLAB, etc.

## Kalman Filter Details

### What It Does
- **Prediction Step:** Predicts next value using velocity (LQR component)
- **Update Step:** Corrects prediction using new measurement (Kalman gain)
- **Velocity Tracking:** Estimates rate of change for predictive tracking

### Parameters
```javascript
// Q: Process noise (how much signal naturally varies)
// Higher Q = more responsive, less smooth

// R: Measurement noise (FFT bin averaging noise)
// Higher R = more smoothing, slower response

// K_lqr: LQR control gain (predictive tracking)
// Higher K = more anticipation of trends

// velocitySmoothing: Velocity estimate smoothing
// Higher = smoother velocity estimates
```

### Preset Configurations

| Preset     | Q      | R     | K_lqr | Vel Smooth |
|------------|--------|-------|-------|------------|
| smooth     | 0.0005 | 0.02  | 0.0   | 0.9        |
| balanced   | 0.001  | 0.01  | 0.05  | 0.7        |
| responsive | 0.005  | 0.005 | 0.1   | 0.5        |
| reactive   | 0.01   | 0.002 | 0.15  | 0.3        |

## Common Issues

### Issue: Validator shows "No samples collected yet"
**Solution:** Make sure audio is enabled and playing:
```javascript
// Enable audio reactivity
state.audioReactive = true;

// Check if audio is working
AudioEngine.getBands();
// Should return { bass: 0.xx, mid: 0.xx, treble: 0.xx, level: 0.xx }
```

### Issue: All values are 0
**Solution:** Enable audio input:
```javascript
// Enable microphone
await AudioEngine.start();

// Or enable test tone
await AudioEngine.toggleTestTone(true);
```

### Issue: Lag is very high (>5 frames)
**Solution:** Switch to more responsive preset:
```javascript
AudioEngine.setKalmanPreset('responsive');
// or
AudioEngine.setKalmanPreset('reactive');
```

### Issue: Jitter reduction is negative
**Solution:** This means filtering is adding noise, not removing it. Disable filtering:
```javascript
AudioEngine.setKalmanEnabled(false);
```

## Integration into Main Code

To automatically run validation on startup, add to `src/main.js`:

```javascript
import { AudioSignalValidator } from './audioSignalValidator.js';

// After AudioEngine is initialized:
if (typeof window !== 'undefined') {
  window.audioValidator = new AudioSignalValidator(AudioEngine);

  // Auto-run validation after 5 seconds
  setTimeout(() => {
    console.log('📊 Starting automatic audio validation...');
    window.audioValidator.start();

    setTimeout(() => {
      window.audioValidator.printReport();
    }, 30000); // 30 seconds
  }, 5000); // Wait 5 seconds for audio to stabilize
}
```

---

**Created:** 2025-11-12
**Status:** ✅ Ready for validation testing
