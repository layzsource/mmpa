/**
 * VALIDATION TEST: Silence Particle Behavior
 *
 * Tests that particles remain still when audio is silent (NaN inputs).
 * Verifies NaN protection defaults motion parameters to 0, not non-zero values.
 */

console.log('\n🧪 VALIDATION TEST: Silence Particle Behavior');
console.log('='.repeat(70));

// Import mapping layer
import { mapFeaturesToVisuals } from './src/mappingLayer.js';

let allTestsPassed = true;

// ============================================================================
// TEST 1: Silent Audio (All NaN Features)
// ============================================================================
console.log('\n📋 TEST 1: Silent Audio - All NaN Features');
console.log('-'.repeat(70));

// Create MMPA features object with all NaN values (simulating silence)
const silentFeatures = {
  enabled: true,
  identity: {
    fundamentalFreq: NaN,
    strength: NaN,
    timbre: NaN
  },
  structure: {
    curvature: NaN,
    torsion: NaN,
    boundary: NaN
  },
  dynamics: {
    energyDensity: NaN,
    pressure: NaN,
    flow: NaN
  },
  transformation: {
    flux: NaN,
    velocity: NaN,
    acceleration: NaN
  },
  alignment: {
    coherence: NaN,
    stability: NaN,
    synchrony: NaN
  },
  potential: {
    entropy: NaN,
    unpredictability: NaN,
    freedom: NaN
  }
};

console.log('\nInput:');
console.log('  All MMPA features = NaN (silence)');

const visualParams = mapFeaturesToVisuals(silentFeatures);

console.log('\nExpected behavior:');
console.log('  ✓ All motion parameters should be 0');
console.log('  ✓ Particles should remain still');
console.log('  ✓ No random motion or noise');

console.log('\nActual results (motion parameters):');
console.log(`  motionVelocity: ${visualParams.motionVelocity} (expected: 0)`);
console.log(`  turbulence: ${visualParams.turbulence} (expected: 0)`);
console.log(`  dynamicIntensity: ${visualParams.dynamicIntensity} (expected: 0)`);
console.log(`  particleRandomness: ${visualParams.particleRandomness} (expected: 0)`);
console.log(`  noiseAmplitude: ${visualParams.noiseAmplitude} (expected: 0)`);
console.log(`  variationRate: ${visualParams.variationRate} (expected: 0)`);
console.log(`  constraintRelaxation: ${visualParams.constraintRelaxation} (expected: 0)`);
console.log(`  animationSpeed: ${visualParams.animationSpeed} (expected: 0.5, baseline)`);

// Validate all motion parameters are 0
const test1_velocity = visualParams.motionVelocity === 0;
const test1_turbulence = visualParams.turbulence === 0;
const test1_intensity = visualParams.dynamicIntensity === 0;
const test1_randomness = visualParams.particleRandomness === 0;
const test1_noise = visualParams.noiseAmplitude === 0;
const test1_variation = visualParams.variationRate === 0;
const test1_relaxation = visualParams.constraintRelaxation === 0;
const test1_animation = visualParams.animationSpeed === 0.5; // 0.5 + 0*1.5 = 0.5

const test1_passed = test1_velocity && test1_turbulence && test1_intensity &&
                      test1_randomness && test1_noise && test1_variation &&
                      test1_relaxation && test1_animation;

if (test1_passed) {
  console.log('\n✅ TEST 1 PASSED: All motion parameters correctly defaulted to 0');
} else {
  console.log('\n❌ TEST 1 FAILED:');
  if (!test1_velocity) console.log('  - motionVelocity should be 0 (BUG!)');
  if (!test1_turbulence) console.log('  - turbulence should be 0 (BUG!)');
  if (!test1_intensity) console.log('  - dynamicIntensity should be 0 (BUG!)');
  if (!test1_randomness) console.log('  - particleRandomness should be 0 (BUG!)');
  if (!test1_noise) console.log('  - noiseAmplitude should be 0 (BUG!)');
  if (!test1_variation) console.log('  - variationRate should be 0 (BUG!)');
  if (!test1_relaxation) console.log('  - constraintRelaxation should be 0 (BUG!)');
  if (!test1_animation) console.log('  - animationSpeed should be 0.5 baseline (BUG!)');
  allTestsPassed = false;
}

// ============================================================================
// TEST 2: Partial Silence (Some NaN, Some Valid)
// ============================================================================
console.log('\n📋 TEST 2: Partial Silence - Mixed NaN and Valid Features');
console.log('-'.repeat(70));

// Mix of valid and NaN features (partial audio signal)
const partialFeatures = {
  enabled: true,
  identity: {
    fundamentalFreq: 440, // Valid A4 note
    strength: 0.5,
    timbre: NaN
  },
  structure: {
    curvature: NaN,
    torsion: NaN,
    boundary: NaN
  },
  dynamics: {
    energyDensity: NaN,
    pressure: NaN,
    flow: NaN
  },
  transformation: {
    flux: NaN,        // Motion parameter = NaN
    velocity: NaN,    // Motion parameter = NaN
    acceleration: NaN // Motion parameter = NaN
  },
  alignment: {
    coherence: NaN,
    stability: NaN,
    synchrony: NaN
  },
  potential: {
    entropy: NaN,           // Motion parameter = NaN
    unpredictability: NaN,  // Motion parameter = NaN
    freedom: NaN            // Motion parameter = NaN
  }
};

console.log('\nInput:');
console.log('  Identity features valid (freq=440Hz, strength=0.5)');
console.log('  All motion features = NaN (no movement)');

const partialParams = mapFeaturesToVisuals(partialFeatures);

console.log('\nExpected behavior:');
console.log('  ✓ Color should be derived from frequency (valid)');
console.log('  ✓ Motion parameters should still be 0 (NaN protection)');

console.log('\nActual results:');
console.log(`  Color hue: ${partialParams.hue?.toFixed(1)} (should be defined)`);
console.log(`  Color saturation: ${partialParams.saturation?.toFixed(2)} (should be 0.5)`);
console.log(`  motionVelocity: ${partialParams.motionVelocity} (expected: 0)`);
console.log(`  turbulence: ${partialParams.turbulence} (expected: 0)`);
console.log(`  particleRandomness: ${partialParams.particleRandomness} (expected: 0)`);

const test2_color = !isNaN(partialParams.hue) && partialParams.saturation === 0.5;
const test2_velocity = partialParams.motionVelocity === 0;
const test2_turbulence = partialParams.turbulence === 0;
const test2_randomness = partialParams.particleRandomness === 0;

const test2_passed = test2_color && test2_velocity && test2_turbulence && test2_randomness;

if (test2_passed) {
  console.log('\n✅ TEST 2 PASSED: NaN protection works for partial data');
} else {
  console.log('\n❌ TEST 2 FAILED:');
  if (!test2_color) console.log('  - Color should be derived from valid frequency');
  if (!test2_velocity) console.log('  - Motion velocity should be 0 with NaN flux/velocity');
  if (!test2_turbulence) console.log('  - Turbulence should be 0 with NaN acceleration');
  if (!test2_randomness) console.log('  - Randomness should be 0 with NaN entropy');
  allTestsPassed = false;
}

// ============================================================================
// TEST 3: Non-Zero Features (Normal Audio)
// ============================================================================
console.log('\n📋 TEST 3: Normal Audio - Non-Zero Features');
console.log('-'.repeat(70));

// Valid features with non-zero values (normal audio)
const normalFeatures = {
  enabled: true,
  identity: {
    fundamentalFreq: 440,
    strength: 0.8,
    timbre: 0.6
  },
  structure: {
    curvature: 0.4,
    torsion: 0.3,
    boundary: 0.5
  },
  dynamics: {
    energyDensity: 0.7,
    pressure: 0.6,
    flow: 0.5
  },
  transformation: {
    flux: 0.5,
    velocity: 0.3,
    acceleration: 0.2
  },
  alignment: {
    coherence: 0.8,
    stability: 0.7,
    synchrony: 0.9
  },
  potential: {
    entropy: 0.4,
    unpredictability: 0.3,
    freedom: 0.2
  }
};

console.log('\nInput:');
console.log('  All features have valid non-zero values');

const normalParams = mapFeaturesToVisuals(normalFeatures);

console.log('\nExpected behavior:');
console.log('  ✓ Motion parameters should be NON-ZERO');
console.log('  ✓ Particles should move with audio');

console.log('\nActual results:');
console.log(`  motionVelocity: ${normalParams.motionVelocity} (expected: 0.3)`);
console.log(`  turbulence: ${normalParams.turbulence} (expected: 0.2)`);
console.log(`  particleRandomness: ${normalParams.particleRandomness} (expected: 0.4)`);
console.log(`  animationSpeed: ${normalParams.animationSpeed.toFixed(2)} (expected: 1.25)`);

const test3_velocity = normalParams.motionVelocity === 0.3;
const test3_turbulence = normalParams.turbulence === 0.2;
const test3_randomness = normalParams.particleRandomness === 0.4;
const test3_animation = normalParams.animationSpeed === 1.25; // 0.5 + 0.5*1.5 = 1.25

const test3_passed = test3_velocity && test3_turbulence && test3_randomness && test3_animation;

if (test3_passed) {
  console.log('\n✅ TEST 3 PASSED: Valid features produce non-zero motion');
} else {
  console.log('\n❌ TEST 3 FAILED:');
  if (!test3_velocity) console.log('  - Motion velocity should match input (0.3)');
  if (!test3_turbulence) console.log('  - Turbulence should match input (0.2)');
  if (!test3_randomness) console.log('  - Randomness should match input (0.4)');
  if (!test3_animation) console.log('  - Animation speed should be computed (1.25)');
  allTestsPassed = false;
}

// ============================================================================
// TEST 4: Features Disabled
// ============================================================================
console.log('\n📋 TEST 4: Features Disabled');
console.log('-'.repeat(70));

const disabledFeatures = {
  enabled: false,
  identity: { fundamentalFreq: 440, strength: 0.8, timbre: 0.6 }
  // ... other features don't matter when disabled
};

console.log('\nInput:');
console.log('  features.enabled = false');

const disabledParams = mapFeaturesToVisuals(disabledFeatures);

console.log('\nExpected behavior:');
console.log('  ✓ Should return null (early exit)');

console.log('\nActual results:');
console.log(`  Result: ${disabledParams}`);

const test4_passed = disabledParams === null;

if (test4_passed) {
  console.log('\n✅ TEST 4 PASSED: Disabled features return null');
} else {
  console.log('\n❌ TEST 4 FAILED: Should return null when disabled');
  allTestsPassed = false;
}

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('📊 VALIDATION SUMMARY');
console.log('='.repeat(70));

const testsRun = 4;
const testsPassed = [test1_passed, test2_passed, test3_passed, test4_passed].filter(Boolean).length;

console.log(`\nTests Run: ${testsRun}`);
console.log(`Tests Passed: ${testsPassed}`);
console.log(`Tests Failed: ${testsRun - testsPassed}`);

if (allTestsPassed) {
  console.log('\n✅ \x1b[32mALL SILENCE TESTS PASSED!\x1b[0m');
  console.log('\n🎉 NaN protection verified:');
  console.log('  ✓ Silent audio (NaN) produces zero motion');
  console.log('  ✓ Particles remain still with no audio signal');
  console.log('  ✓ Partial data handled correctly (mixed NaN/valid)');
  console.log('  ✓ Normal audio produces expected motion');
  console.log('  ✓ Disabled features return null (early exit)');
  console.log('\n🚀 Silence particle behavior ready for production!');
  console.log('\n📈 Bug Status: VERIFIED FIXED ✅');
  process.exit(0);
} else {
  console.log('\n❌ \x1b[31mSOME TESTS FAILED!\x1b[0m');
  console.log('\n⚠️  Check the failures above and verify NaN protection in mappingLayer.js');
  process.exit(1);
}
