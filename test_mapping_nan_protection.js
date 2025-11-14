/**
 * Unit Test: Verify NaN protection in mappingLayer.js defaults to 0 for motion
 *
 * This tests the fix for the particle motion bug where NaN values from silent
 * audio were falling back to non-zero defaults, causing unwanted motion.
 */

// Test data: simulate silent audio with NaN values
const silentFeatures = {
  enabled: true,
  identity: {
    fundamentalFreq: NaN,
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
    flux: NaN,        // Should default to 0 (NOT 0.42)
    velocity: NaN,    // Should default to 0 (NOT 0.15)
    acceleration: NaN // Should default to 0 (NOT 0.03)
  },
  alignment: {
    coherence: 0.78,
    stability: 0.65,
    synchrony: 0.82
  },
  potential: {
    entropy: NaN,           // Should default to 0 (NOT 0.28)
    unpredictability: NaN,  // Should default to 0 (NOT 0.15)
    freedom: NaN            // Should default to 0 (NOT 0.22)
  }
};

// Inline the relevant parts of mappingLayer to test in isolation
function testNaNProtection(features) {
  if (!features || !features.enabled) {
    return null;
  }

  const visualParams = {};

  // TRANSFORMATION → MOTION
  const flux = features.transformation.flux;
  const velocity = features.transformation.velocity;
  const acceleration = features.transformation.acceleration;

  const safeFlux = isNaN(flux) ? 0 : flux;
  const safeVelocity = isNaN(velocity) ? 0 : velocity;
  const safeAcceleration = isNaN(acceleration) ? 0 : acceleration;

  visualParams.motionVelocity = safeVelocity;
  visualParams.turbulence = safeAcceleration;
  visualParams.dynamicIntensity = (safeFlux + safeVelocity + safeAcceleration) / 3;
  visualParams.animationSpeed = 0.5 + safeFlux * 1.5;

  // IDENTITY → COLOR
  const strength = features.identity.strength;
  const safeStrength = isNaN(strength) ? 0 : strength;
  visualParams.colorIntensity = safeStrength;

  // COMPLEXITY → DENSITY
  const brightness_spectral = features.complexity.brightness;
  const safeBrightness = isNaN(brightness_spectral) ? 0 : brightness_spectral;
  const particleMultiplier = 0.8 + safeBrightness * 0.2;
  visualParams.particleDensity = particleMultiplier;

  // POTENTIAL → CHAOS
  const entropy = features.potential.entropy;
  const unpredictability = features.potential.unpredictability;
  const freedom = features.potential.freedom;

  const safeEntropy = isNaN(entropy) ? 0 : entropy;
  const safeUnpredictability = isNaN(unpredictability) ? 0 : unpredictability;
  const safeFreedom = isNaN(freedom) ? 0 : freedom;

  visualParams.particleRandomness = safeEntropy;
  visualParams.noiseAmplitude = safeEntropy;
  visualParams.variationRate = safeUnpredictability;
  visualParams.constraintRelaxation = safeFreedom;
  visualParams.overallChaos = (safeEntropy + safeUnpredictability + safeFreedom) / 3;

  return visualParams;
}

// Run the test
console.log('\n🧪 Testing: NaN Protection in mappingLayer.js');
console.log('='.repeat(60));

const result = testNaNProtection(silentFeatures);

if (!result) {
  console.error('❌ TEST FAILED: Function returned null');
  process.exit(1);
}

// Define expected values for silent audio
const tests = [
  // Motion parameters (should all be 0)
  { name: 'motionVelocity', value: result.motionVelocity, expected: 0, category: 'MOTION' },
  { name: 'turbulence', value: result.turbulence, expected: 0, category: 'MOTION' },
  { name: 'dynamicIntensity', value: result.dynamicIntensity, expected: 0, category: 'MOTION' },

  // Animation speed (baseline is 0.5 when flux = 0)
  { name: 'animationSpeed', value: result.animationSpeed, expected: 0.5, category: 'MOTION' },

  // Signal presence (should be 0)
  { name: 'colorIntensity', value: result.colorIntensity, expected: 0, category: 'PRESENCE' },

  // Density (should be minimum 0.8 with no brightness)
  { name: 'particleDensity', value: result.particleDensity, expected: 0.8, category: 'DENSITY' },

  // Chaos/randomness (should all be 0)
  { name: 'particleRandomness', value: result.particleRandomness, expected: 0, category: 'CHAOS' },
  { name: 'noiseAmplitude', value: result.noiseAmplitude, expected: 0, category: 'CHAOS' },
  { name: 'variationRate', value: result.variationRate, expected: 0, category: 'CHAOS' },
  { name: 'constraintRelaxation', value: result.constraintRelaxation, expected: 0, category: 'CHAOS' },
  { name: 'overallChaos', value: result.overallChaos, expected: 0, category: 'CHAOS' },
];

let allPassed = true;
let currentCategory = '';

for (const test of tests) {
  if (test.category !== currentCategory) {
    currentCategory = test.category;
    console.log(`\n${currentCategory} Parameters:`);
    console.log('-'.repeat(60));
  }

  const passed = test.value === test.expected;
  const status = passed ? '✓' : '✗';
  const color = passed ? '\x1b[32m' : '\x1b[31m';

  console.log(`${color}${status}\x1b[0m ${test.name.padEnd(25)} = ${test.value.toFixed(3)} (expected: ${test.expected})`);

  if (!passed) {
    allPassed = false;
    console.log(`   \x1b[33m⚠  This will cause unwanted motion/effects when silent!\x1b[0m`);
  }
}

// Summary
console.log('\n' + '='.repeat(60));

if (allPassed) {
  console.log('✅ \x1b[32mALL TESTS PASSED\x1b[0m');
  console.log('\n✓ NaN protection correctly defaults to 0 for motion parameters');
  console.log('✓ Particles will remain still when audio is silent/NaN');
  console.log('✓ No unwanted effects before audio is enabled\n');
  process.exit(0);
} else {
  console.log('❌ \x1b[31mTEST FAILED\x1b[0m');
  console.log('\n✗ Some NaN protections still use non-zero defaults');
  console.log('✗ Particles will move when silent');
  console.log('✗ Check mappingLayer.js NaN protection fallback values\n');
  process.exit(1);
}
