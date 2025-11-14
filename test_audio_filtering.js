/**
 * Unit Test: Validate Kalman Filter Effectiveness
 *
 * Tests whether the Kalman-LQR filter actually reduces jitter
 * and improves signal quality compared to raw audio bands.
 *
 * This is a synthetic test using simulated audio data.
 */

import { AudioBandFilter } from './src/audioKalmanFilter.js';

console.log('\n🧪 Testing: Kalman-LQR Audio Filtering');
console.log('='.repeat(60));

// Generate synthetic audio data (simulates real audio with noise)
function generateSyntheticAudio(frames, options = {}) {
  const {
    frequency = 0.05,      // Base oscillation frequency
    amplitude = 0.8,       // Signal amplitude
    noiseLevel = 0.1,      // Noise amplitude
    spikeProb = 0.05       // Probability of sudden spike
  } = options;

  const data = [];
  for (let i = 0; i < frames; i++) {
    // Base signal (sine wave)
    const base = (Math.sin(i * frequency) * 0.5 + 0.5) * amplitude;

    // Add random noise
    const noise = (Math.random() - 0.5) * noiseLevel;

    // Occasional spikes (simulates transients)
    const spike = Math.random() < spikeProb ? (Math.random() * 0.3) : 0;

    // Clamp to [0, 1]
    const value = Math.max(0, Math.min(1, base + noise + spike));

    data.push(value);
  }

  return data;
}

// Calculate jitter (frame-to-frame variance)
function calculateJitter(values) {
  if (values.length < 2) return 0;

  const deltas = [];
  for (let i = 1; i < values.length; i++) {
    deltas.push(Math.abs(values[i] - values[i - 1]));
  }

  const mean = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  const variance = deltas.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / deltas.length;

  return Math.sqrt(variance);
}

// Calculate SNR
function calculateSNR(values) {
  if (values.length < 2) return 0;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const signalPower = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;

  const deltas = [];
  for (let i = 1; i < values.length; i++) {
    deltas.push(values[i] - values[i - 1]);
  }
  const deltaMean = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  const noisePower = deltas.reduce((sum, d) => sum + Math.pow(d - deltaMean, 2), 0) / deltas.length;

  if (noisePower === 0) return Infinity;
  return 10 * Math.log10(signalPower / noisePower);
}

// Run test for a specific preset
function testPreset(preset, frames = 1000) {
  console.log(`\n🔬 Testing preset: ${preset.toUpperCase()}`);
  console.log('-'.repeat(60));

  // Create filter
  const filter = new AudioBandFilter({ preset, enabled: true });

  // Generate synthetic audio
  const rawBass = generateSyntheticAudio(frames, { frequency: 0.03, noiseLevel: 0.15 });
  const rawMid = generateSyntheticAudio(frames, { frequency: 0.05, noiseLevel: 0.12 });
  const rawTreble = generateSyntheticAudio(frames, { frequency: 0.08, noiseLevel: 0.10 });
  const rawLevel = generateSyntheticAudio(frames, { frequency: 0.04, noiseLevel: 0.08 });

  // Apply filtering
  const filteredBass = [];
  const filteredMid = [];
  const filteredTreble = [];
  const filteredLevel = [];

  for (let i = 0; i < frames; i++) {
    const filtered = filter.update({
      bass: rawBass[i],
      mid: rawMid[i],
      treble: rawTreble[i],
      level: rawLevel[i]
    });

    filteredBass.push(filtered.bass);
    filteredMid.push(filtered.mid);
    filteredTreble.push(filtered.treble);
    filteredLevel.push(filtered.level);
  }

  // Calculate metrics
  const results = {
    bass: {
      rawJitter: calculateJitter(rawBass),
      filteredJitter: calculateJitter(filteredBass),
      rawSNR: calculateSNR(rawBass),
      filteredSNR: calculateSNR(filteredBass)
    },
    mid: {
      rawJitter: calculateJitter(rawMid),
      filteredJitter: calculateJitter(filteredMid),
      rawSNR: calculateSNR(rawMid),
      filteredSNR: calculateSNR(filteredMid)
    },
    treble: {
      rawJitter: calculateJitter(rawTreble),
      filteredJitter: calculateJitter(filteredTreble),
      rawSNR: calculateSNR(rawTreble),
      filteredSNR: calculateSNR(filteredTreble)
    },
    level: {
      rawJitter: calculateJitter(rawLevel),
      filteredJitter: calculateJitter(filteredLevel),
      rawSNR: calculateSNR(rawLevel),
      filteredSNR: calculateSNR(filteredLevel)
    }
  };

  // Calculate improvements
  const bands = ['bass', 'mid', 'treble', 'level'];
  const jitterImprovements = [];
  const snrImprovements = [];

  console.log('\nBand    │ Raw Jitter │ Filtered │ Improvement │ SNR Gain');
  console.log('-'.repeat(60));

  for (const band of bands) {
    const r = results[band];
    const jitterImprovement = ((r.rawJitter - r.filteredJitter) / r.rawJitter) * 100;
    const snrGain = r.filteredSNR - r.rawSNR;

    jitterImprovements.push(jitterImprovement);
    snrImprovements.push(snrGain);

    const color = jitterImprovement > 30 ? '\x1b[32m' : jitterImprovement > 10 ? '\x1b[33m' : '\x1b[31m';

    console.log(`${color}${band.padEnd(7)} │ ${r.rawJitter.toFixed(4).padStart(10)} │ ${r.filteredJitter.toFixed(4).padStart(8)} │ ${jitterImprovement.toFixed(1).padStart(10)}% │ ${snrGain > 0 ? '+' : ''}${snrGain.toFixed(1)} dB\x1b[0m`);
  }

  const avgJitterImprovement = jitterImprovements.reduce((a, b) => a + b, 0) / bands.length;
  const avgSNRGain = snrImprovements.reduce((a, b) => a + b, 0) / bands.length;

  console.log('-'.repeat(60));
  console.log(`Average │            │          │ ${avgJitterImprovement.toFixed(1).padStart(10)}% │ ${avgSNRGain > 0 ? '+' : ''}${avgSNRGain.toFixed(1)} dB`);

  return {
    preset,
    avgJitterImprovement,
    avgSNRGain,
    passed: avgJitterImprovement > 20 && avgSNRGain > 1.0
  };
}

// Run tests for all presets
const presets = ['smooth', 'balanced', 'responsive', 'reactive'];
const results = [];

for (const preset of presets) {
  const result = testPreset(preset, 1000);
  results.push(result);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));

console.log('\nPreset      │ Jitter Reduc │ SNR Gain │ Status');
console.log('-'.repeat(60));

for (const result of results) {
  const status = result.passed ? '\x1b[32m✓ PASS\x1b[0m' : '\x1b[31m✗ FAIL\x1b[0m';
  console.log(`${result.preset.padEnd(11)} │ ${result.avgJitterImprovement.toFixed(1).padStart(11)}% │ ${result.avgSNRGain > 0 ? '+' : ''}${result.avgSNRGain.toFixed(1).padStart(7)} dB │ ${status}`);
}

console.log('='.repeat(60));

// Overall assessment
const allPassed = results.every(r => r.passed);

if (allPassed) {
  console.log('\n✅ \x1b[32mALL TESTS PASSED\x1b[0m');
  console.log('\n✓ Kalman-LQR filtering effectively reduces jitter');
  console.log('✓ All presets improve SNR');
  console.log('✓ Filtering is empirically beneficial\n');
  process.exit(0);
} else {
  console.log('\n⚠️  \x1b[33mSOME TESTS FAILED\x1b[0m');
  console.log('\nSome presets may not provide sufficient benefit.');
  console.log('Consider adjusting filter parameters or using raw signal.\n');
  process.exit(1);
}
