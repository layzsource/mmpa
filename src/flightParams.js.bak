// 🛩️ flightParams.js
// Phase 1.5.2 — Flight Physics Parameters
// Single source of truth for pilot motion tuning

/**
 * FlightParams defines the physics of first-person navigation.
 *
 * Philosophy:
 * - Flight: momentum, acceleration, drift, banking, thrust
 * - Dream: responsive, forgiving, lucid-telepathic control
 *
 * Wave mode = floaty, graceful arcs, longer glide
 * Particle mode = tight turns, fast accel/stop, crisp response
 */
export const FlightParams = {
  // --- Base Kinematics ---
  baseSpeed: 15.0,          // m/s at neutral input
  maxSpeed: 60.0,           // absolute speed clamp (increased for free exploration)
  accel: 30.0,              // m/s² forward acceleration
  decel: 26.0,              // m/s² counter-accel when opposing velocity
  strafeAccel: 20.0,        // m/s² lateral acceleration
  verticalAccel: 18.0,      // m/s² ascent/descent (Space/Shift or future RB/LB)
  thrustMultiplier: 3.0,    // LT boost multiplier (increased for faster travel)

  // --- Damping (velocity decay per frame) ---
  // Applied as: velocity *= damping^(dt*60)
  damping: {
    wave: 0.86,      // Floaty, graceful glide
    particle: 0.76,  // Tighter, faster settle
  },

  // --- Look Response ---
  look: {
    yawSensitivity: 3.0,     // degrees per (unit stick) per frame @60fps (balanced for smooth control)
    pitchSensitivity: 2.5,   // degrees per (unit stick) per frame @60fps (balanced for smooth control)
    maxPitchDeg: 89.9,       // allow nearly full vertical look (prevent gimbal lock)
    bankingFactor: 0.18,     // visual roll from yaw input (camera.rotation.z)
    bankReturn: 0.92,        // per-frame lerp back to level roll (0..1)
  },

  // --- Input Shaping ---
  input: {
    deadzone: 0.14,      // Stick deadzone (applied in gamepadManager already, but can adjust)
    expo: 0.35,          // Exponential curve (0..1), 0=linear, higher=more precision at center
    thrustExpo: 0.25,    // Softer ramp near zero thrust (LT trigger)
  },

  // --- Dream Assists (lucid control) ---
  assist: {
    microBrake: 0.06,      // Small opposing accel when input released (prevents endless drift)
    aimStabilize: 0.10,    // Lerp factor to damp random jitter in look (reduces micro-tremor)
    snapConeDeg: 12,       // Optional soft snap to forward when near neutral (unused for now)
  },

  // --- Perception-Specific Modifiers ---
  // These scale base params when in wave vs particle mode
  perception: {
    wave: {
      maxSpeedMult: 0.9,         // Slower max speed (survey mode)
      thrustMult: 2.0,           // LT boost (reduced from base)
      bankingFactorMult: 1.1,    // More graceful banking
      microBrakeMult: 0.67,      // Less aggressive brake (longer glide)
      lookSensitivityMult: 0.9,  // Gentler look
    },
    particle: {
      maxSpeedMult: 1.1,         // Faster max speed (engage mode)
      thrustMult: 2.4,           // LT boost (increased from base)
      bankingFactorMult: 0.9,    // Tighter banking
      microBrakeMult: 1.33,      // More aggressive brake (quick settle)
      lookSensitivityMult: 1.1,  // Snappier look
    },
  },
};

/**
 * Apply exponential response curve to stick input.
 * Small inputs become even smaller for fine control.
 *
 * @param {number} x - Input value (-1 to 1)
 * @param {number} expo - Exponent factor (0..1), 0=linear, 1=quadratic
 * @returns {number} - Shaped input
 */
export function applyExpo(x, expo) {
  // Preserve sign, apply power curve to magnitude
  return Math.sign(x) * Math.pow(Math.abs(x), 1.0 - expo);
}

/**
 * Get effective flight parameters for current perception mode.
 *
 * @param {Object} perceptionState - Current perception state
 * @returns {Object} - Modified flight params
 */
export function getEffectiveFlightParams(perceptionState) {
  const mode = perceptionState.mode; // 'wave' or 'particle'
  const mods = FlightParams.perception[mode];

  return {
    ...FlightParams,
    maxSpeed: FlightParams.maxSpeed * mods.maxSpeedMult,
    thrustMultiplier: FlightParams.thrustMultiplier * mods.thrustMult,
    bankingFactor: FlightParams.look.bankingFactor * mods.bankingFactorMult,
    microBrake: FlightParams.assist.microBrake * mods.microBrakeMult,
    yawSensitivity: FlightParams.look.yawSensitivity * mods.lookSensitivityMult,
    pitchSensitivity: FlightParams.look.pitchSensitivity * mods.lookSensitivityMult,
    damping: FlightParams.damping[mode],
  };
}

console.log('🛩️ flightParams.js loaded — VERSION 2.0 — Sensitivity: 3.0/2.5');

export default FlightParams;
