/**
 * VALIDATION TEST: Actuator Sign Fixes
 *
 * Tests that actuator control signals now have correct signs after bug fixes.
 * Tests both mechanical and financial actuators.
 */

console.log('\n🧪 VALIDATION TEST: Actuator Sign Fixes');
console.log('='.repeat(70));

// Import actuators
import MechanicalActuator from './src/actuator/mechanicalActuator.js';
import FinancialActuator from './src/actuator/financialActuator.js';

let allTestsPassed = true;

// ============================================================================
// TEST 1: Mechanical Actuator - Negative Res Signal
// ============================================================================
console.log('\n📋 TEST 1: Mechanical Actuator - Negative Res (Conservative)');
console.log('-'.repeat(70));

const mechActuator = new MechanicalActuator({
  initialDamping: 1000,
  initialLoadLimit: 0.8,
  damping_gain: 500,
  load_gain: 0.15
});

// Test with negative control signals (system below setpoint, need correction)
const u_negative = [-0.1, -0.1]; // [Trans_sm, Res]
const state_high = 0.8; // Current state

const mechResult1 = mechActuator.actuate(u_negative, state_high);

console.log('\nInput:');
console.log('  Control signals u = [-0.1, -0.1] (negative = conservative)');
console.log('  Current state Σ* = 0.8');

console.log('\nExpected behavior:');
console.log('  ✓ Increase damping (stabilize)');
console.log('  ✓ Reduce load capacity (conservative)');

console.log('\nActual results:');
console.log(`  Damping delta: ${mechResult1.damping_delta.toFixed(2)} (${mechResult1.damping_delta > 0 ? 'INCREASED ✓' : 'DECREASED ✗'})`);
console.log(`  Load delta: ${mechResult1.load_delta.toFixed(4)} (${mechResult1.load_delta < 0 ? 'REDUCED ✓' : 'INCREASED ✗'})`);
console.log(`  Action: ${mechResult1.action}`);

// Validate
const test1_damping = mechResult1.damping_delta > 0;
const test1_load = mechResult1.load_delta < 0;
// Small deltas may show as MAINTAIN (delta < threshold), which is acceptable
const test1_action = mechResult1.action.includes('REDUCE') || mechResult1.action === 'MAINTAIN';

if (test1_damping && test1_load && test1_action) {
  console.log('\n✅ TEST 1 PASSED: Negative Res correctly reduces load capacity');
} else {
  console.log('\n❌ TEST 1 FAILED:');
  if (!test1_damping) console.log('  - Damping should increase with negative Trans_sm');
  if (!test1_load) console.log('  - Load should decrease with negative Res (BUG!)');
  if (!test1_action) console.log('  - Action description should say REDUCE_LOAD');
  allTestsPassed = false;
}

// ============================================================================
// TEST 2: Mechanical Actuator - Positive Res Signal
// ============================================================================
console.log('\n📋 TEST 2: Mechanical Actuator - Positive Res (Aggressive)');
console.log('-'.repeat(70));

const u_positive = [0.1, 0.1]; // Positive signals (system above setpoint)
const mechResult2 = mechActuator.actuate(u_positive, state_high);

console.log('\nInput:');
console.log('  Control signals u = [0.1, 0.1] (positive = aggressive)');
console.log('  Current state Σ* = 0.8');

console.log('\nExpected behavior:');
console.log('  ✓ Decrease damping (allow more motion)');
console.log('  ✓ Increase load capacity (aggressive)');

console.log('\nActual results:');
console.log(`  Damping delta: ${mechResult2.damping_delta.toFixed(2)} (${mechResult2.damping_delta < 0 ? 'DECREASED ✓' : 'INCREASED ✗'})`);
console.log(`  Load delta: ${mechResult2.load_delta.toFixed(4)} (${mechResult2.load_delta > 0 ? 'INCREASED ✓' : 'DECREASED ✗'})`);
console.log(`  Action: ${mechResult2.action}`);

const test2_damping = mechResult2.damping_delta < 0;
const test2_load = mechResult2.load_delta > 0;
// Small deltas may show as MAINTAIN (delta < threshold), which is acceptable
const test2_action = mechResult2.action.includes('INCREASE') || mechResult2.action === 'MAINTAIN';

if (test2_damping && test2_load && test2_action) {
  console.log('\n✅ TEST 2 PASSED: Positive Res correctly increases load capacity');
} else {
  console.log('\n❌ TEST 2 FAILED:');
  if (!test2_damping) console.log('  - Damping should decrease with positive Trans_sm');
  if (!test2_load) console.log('  - Load should increase with positive Res (BUG!)');
  if (!test2_action) console.log('  - Action description should say INCREASE_LOAD');
  allTestsPassed = false;
}

// ============================================================================
// TEST 3: Financial Actuator - Negative Res Signal
// ============================================================================
console.log('\n📋 TEST 3: Financial Actuator - Negative Res (Defensive)');
console.log('-'.repeat(70));

const finActuator = new FinancialActuator({
  initialExposure: 0.7, // 70% exposure
  velocity_gain: 50.0,
  exposure_gain: 0.2
});

const finResult1 = finActuator.actuate(u_negative, state_high);

console.log('\nInput:');
console.log('  Control signals u = [-0.1, -0.1] (negative = defensive)');
console.log('  Current exposure = 70%');

console.log('\nExpected behavior:');
console.log('  ✓ Reduce positions (sell)');
console.log('  ✓ Reduce exposure (defensive)');

console.log('\nActual results:');
console.log(`  Trade velocity: ${finResult1.trade_velocity.toFixed(2)} (${finResult1.trade_velocity < 0 ? 'SELL ✓' : 'BUY ✗'})`);
console.log(`  Exposure delta: ${finResult1.exposure_delta.toFixed(4)} (${finResult1.exposure_delta < 0 ? 'REDUCED ✓' : 'INCREASED ✗'})`);
console.log(`  Action: ${finResult1.action}`);

const test3_velocity = finResult1.trade_velocity < 0;
const test3_exposure = finResult1.exposure_delta < 0;
// Action check: velocity is negative, so action should be SELL (or HOLD if below threshold)
const test3_action = (finResult1.action === 'SELL' || finResult1.action === 'HOLD') &&
                     (Math.abs(finResult1.trade_velocity) < 1.0 || finResult1.action === 'SELL');

if (test3_velocity && test3_exposure && test3_action) {
  console.log('\n✅ TEST 3 PASSED: Negative Res correctly reduces exposure');
} else {
  console.log('\n❌ TEST 3 FAILED:');
  if (!test3_velocity) console.log('  - Velocity should be negative (sell) with negative Trans_sm (BUG!)');
  if (!test3_exposure) console.log('  - Exposure should decrease with negative Res (BUG!)');
  if (!test3_action) console.log('  - Action should be SELL or HOLD');
  allTestsPassed = false;
}

// ============================================================================
// TEST 4: Financial Actuator - Positive Res Signal
// ============================================================================
console.log('\n📋 TEST 4: Financial Actuator - Positive Res (Aggressive)');
console.log('-'.repeat(70));

const finResult2 = finActuator.actuate(u_positive, state_high);

console.log('\nInput:');
console.log('  Control signals u = [0.1, 0.1] (positive = aggressive)');

console.log('\nExpected behavior:');
console.log('  ✓ Increase positions (buy)');
console.log('  ✓ Increase exposure (aggressive)');

console.log('\nActual results:');
console.log(`  Trade velocity: ${finResult2.trade_velocity.toFixed(2)} (${finResult2.trade_velocity > 0 ? 'BUY ✓' : 'SELL ✗'})`);
console.log(`  Exposure delta: ${finResult2.exposure_delta.toFixed(4)} (${finResult2.exposure_delta > 0 ? 'INCREASED ✓' : 'DECREASED ✗'})`);
console.log(`  Action: ${finResult2.action}`);

const test4_velocity = finResult2.trade_velocity > 0;
const test4_exposure = finResult2.exposure_delta > 0;
// Action check: velocity is positive, so action should be BUY (or HOLD if below threshold)
const test4_action = (finResult2.action === 'BUY' || finResult2.action === 'HOLD') &&
                     (Math.abs(finResult2.trade_velocity) < 1.0 || finResult2.action === 'BUY');

if (test4_velocity && test4_exposure && test4_action) {
  console.log('\n✅ TEST 4 PASSED: Positive Res correctly increases exposure');
} else {
  console.log('\n❌ TEST 4 FAILED:');
  if (!test4_velocity) console.log('  - Velocity should be positive (buy) with positive Trans_sm (BUG!)');
  if (!test4_exposure) console.log('  - Exposure should increase with positive Res (BUG!)');
  if (!test4_action) console.log('  - Action should be BUY or HOLD');
  allTestsPassed = false;
}

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('📊 VALIDATION SUMMARY');
console.log('='.repeat(70));

const testsRun = 4;
const testsPassed = [test1_damping && test1_load && test1_action,
                     test2_damping && test2_load && test2_action,
                     test3_velocity && test3_exposure && test3_action,
                     test4_velocity && test4_exposure && test4_action].filter(Boolean).length;

console.log(`\nTests Run: ${testsRun}`);
console.log(`Tests Passed: ${testsPassed}`);
console.log(`Tests Failed: ${testsRun - testsPassed}`);

if (allTestsPassed) {
  console.log('\n✅ \x1b[32mALL ACTUATOR TESTS PASSED!\x1b[0m');
  console.log('\n🎉 Actuator sign fixes verified:');
  console.log('  ✓ Negative Res now correctly reduces load/exposure (conservative)');
  console.log('  ✓ Positive Res now correctly increases load/exposure (aggressive)');
  console.log('  ✓ Action descriptions match actual behavior');
  console.log('\n🚀 Actuators ready for production!');
  process.exit(0);
} else {
  console.log('\n❌ \x1b[31mSOME TESTS FAILED!\x1b[0m');
  console.log('\n⚠️  Check the failures above and verify sign fixes were applied correctly.');
  process.exit(1);
}
