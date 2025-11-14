/**
 * Test: Verify particles remain still when MMPA is enabled but audio is silent/NaN
 *
 * This test simulates the bug where NaN protection was falling back to non-zero
 * defaults, causing unwanted motion. After the fix, all motion parameters should
 * be 0 when audio is silent.
 */

// Mock the state module
const state = {
  mmpaFeatures: {
    enabled: true, // MMPA enabled
    identity: {
      fundamentalFreq: NaN, // Silence produces NaN
      strength: NaN
    },
    relationship: {
      consonance: 0.72,
      complexity: 3
    },
    complexity: {
      centroid: NaN,
      bandwidth: NaN,
      brightness: NaN
    },
    transformation: {
      flux: NaN,        // This was falling back to 0.42 (BUG)
      velocity: NaN,    // This was falling back to 0.15 (BUG)
      acceleration: NaN // This was falling back to 0.03 (BUG)
    },
    alignment: {
      coherence: 0.78,
      stability: 0.65,
      synchrony: 0.82
    },
    potential: {
      entropy: NaN,           // This was falling back to 0.28 (BUG)
      unpredictability: NaN,  // This was falling back to 0.15 (BUG)
      freedom: NaN            // This was falling back to 0.22 (BUG)
    }
  }
};

// Import the mapping function
import { mapFeaturesToVisuals } from './src/mappingLayer.js';

// Run the test
console.log('\n🧪 Testing: Particle motion with silent/NaN audio input');
console.log('='.repeat(60));

const visualParams = mapFeaturesToVisuals(state.mmpaFeatures);

if (!visualParams) {
  console.error('❌ TEST FAILED: mapFeaturesToVisuals returned null');
  process.exit(1);
}

// Check motion parameters (should all be 0 or minimal)
const motionTests = [
  { name: 'motionVelocity', value: visualParams.motionVelocity, expected: 0 },
  { name: 'turbulence', value: visualParams.turbulence, expected: 0 },
  { name: 'dynamicIntensity', value: visualParams.dynamicIntensity, expected: 0 },
  { name: 'particleRandomness', value: visualParams.particleRandomness, expected: 0 },
  { name: 'noiseAmplitude', value: visualParams.noiseAmplitude, expected: 0 },
  { name: 'variationRate', value: visualParams.variationRate, expected: 0 },
  { name: 'constraintRelaxation', value: visualParams.constraintRelaxation, expected: 0 },
  { name: 'colorIntensity', value: visualParams.colorIntensity, expected: 0 },
];

// Check animation speed (should be 0.5, the baseline with no flux)
const animationSpeedTest = {
  name: 'animationSpeed',
  value: visualParams.animationSpeed,
  expected: 0.5, // 0.5 + (0 * 1.5) = 0.5
};

let allPassed = true;

console.log('\nMotion Parameters (should all be 0 for silence):');
console.log('-'.repeat(60));

for (const test of motionTests) {
  const passed = test.value === test.expected;
  const status = passed ? '✓' : '✗';
  const color = passed ? '\x1b[32m' : '\x1b[31m';

  console.log(`${color}${status}\x1b[0m ${test.name.padEnd(25)} = ${test.value.toFixed(3)} (expected: ${test.expected})`);

  if (!passed) allPassed = false;
}

console.log('\nAnimation Speed:');
console.log('-'.repeat(60));

const speedPassed = animationSpeedTest.value === animationSpeedTest.expected;
const speedStatus = speedPassed ? '✓' : '✗';
const speedColor = speedPassed ? '\x1b[32m' : '\x1b[31m';

console.log(`${speedColor}${speedStatus}\x1b[0m ${animationSpeedTest.name.padEnd(25)} = ${animationSpeedTest.value.toFixed(3)} (expected: ${animationSpeedTest.expected})`);

if (!speedPassed) allPassed = false;

// Summary
console.log('\n' + '='.repeat(60));

if (allPassed) {
  console.log('✅ \x1b[32mALL TESTS PASSED\x1b[0m - Particles will remain still when silent!');
  console.log('\nFix verified:');
  console.log('  - NaN protection now defaults to 0 for motion parameters');
  console.log('  - No unwanted particle motion before audio is enabled');
  process.exit(0);
} else {
  console.log('❌ \x1b[31mTEST FAILED\x1b[0m - Some motion parameters are non-zero!');
  console.log('\nParticles will still move when silent. Check mappingLayer.js');
  process.exit(1);
}
