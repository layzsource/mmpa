/**
 * MMPA Framework V2.0: Mechanical Actuator Interface
 *
 * Translates LQR control signals into mechanical system adjustments.
 *
 * Theory:
 * - Input: u = [Trans_sm, Res] from LQR controller
 * - Output: {damping_coefficient, load_limit}
 * - Damping: Vibration suppression (e.g., active suspension, shock absorbers)
 * - Load limit: Maximum stress/strain threshold
 *
 * Domain Translation:
 * - Trans_sm → Damping rate (smooth out oscillations)
 * - Res → Load capacity scaling (structural integrity)
 * - Negative u → Increase damping, reduce load (stabilize)
 * - Positive u → Reduce damping, increase load (aggressive operation)
 *
 * V2.0 Features:
 * - Adaptive damping control
 * - Load limiting (safety constraints)
 * - Emergency braking (full damping if instability detected)
 */

console.log("⚙️ mechanicalActuator.js V2.0 loaded");

export class MechanicalActuator {
  constructor(options = {}) {
    // === Domain-Specific Parameters ===
    // Damping coefficient range (N·s/m or similar units)
    this.minDamping = options.minDamping || 100;      // Minimum damping (underdamped)
    this.maxDamping = options.maxDamping || 5000;     // Maximum damping (overdamped)

    // Load capacity range (kN, tons, or percentage of max stress)
    this.minLoad = options.minLoad || 0.2;            // 20% of rated capacity
    this.maxLoad = options.maxLoad || 1.0;            // 100% of rated capacity

    // Current system state
    this.currentDamping = options.initialDamping || 1000; // N·s/m
    this.currentLoadLimit = options.initialLoadLimit || 0.8; // 80% capacity

    // === Control-to-Actuator Mapping ===
    // How sensitive is damping to Trans_sm control signal?
    this.damping_gain = options.damping_gain || 500.0; // N·s/m per unit control

    // How sensitive is load limit to Res control signal?
    this.load_gain = options.load_gain || 0.15; // % change per unit control

    // === Safety Parameters ===
    // Emergency braking threshold (Σ* below this → max damping)
    this.emergencyBrakeThreshold = options.emergencyBrakeThreshold || 0.35;
    this.emergencyBrakeActive = false;

    console.log("⚙️ Mechanical Actuator initialized");
    console.log(`   Damping Range: ${this.minDamping} - ${this.maxDamping} N·s/m`);
    console.log(`   Load Range: ${(this.minLoad * 100).toFixed(0)}% - ${(this.maxLoad * 100).toFixed(0)}%`);
    console.log(`   Emergency Brake: Σ* < ${this.emergencyBrakeThreshold}`);
  }

  /**
   * Apply control signal to generate mechanical adjustments
   *
   * @param {Array} u - Control signal [Trans_sm, Res] from LQR
   * @param {number} current_state - Current Σ* value
   * @returns {Object} { damping, load_limit, action, emergency_brake }
   */
  actuate(u, current_state) {
    // Check emergency brake condition
    if (current_state < this.emergencyBrakeThreshold) {
      if (!this.emergencyBrakeActive) {
        console.warn(`⚙️ EMERGENCY BRAKE: Σ* = ${current_state.toFixed(3)} < ${this.emergencyBrakeThreshold}`);
        this.emergencyBrakeActive = true;
      }

      return {
        damping: this.maxDamping,       // Full damping
        load_limit: this.minLoad,       // Minimum load
        action: 'EMERGENCY_BRAKE',
        emergency_brake: true,
        reason: `Instability detected (Σ* = ${current_state.toFixed(3)})`
      };
    }

    // Release emergency brake if state recovers
    if (this.emergencyBrakeActive && current_state >= this.emergencyBrakeThreshold + 0.05) {
      console.log(`⚙️ Emergency brake released: Σ* = ${current_state.toFixed(3)}`);
      this.emergencyBrakeActive = false;
    }

    const [trans_sm, res] = u;

    // --- Damping Coefficient Calculation ---
    // Trans_sm controls damping to smooth out oscillations
    // Negative Trans_sm → increase damping (stabilize)
    // Positive Trans_sm → decrease damping (allow more motion)
    let damping_delta = -trans_sm * this.damping_gain;
    let damping_target = this.currentDamping + damping_delta;

    // Apply damping constraints
    damping_target = Math.max(this.minDamping, Math.min(this.maxDamping, damping_target));

    // --- Load Limit Calculation ---
    // Res controls maximum allowable load
    // Negative Res → reduce load capacity (conservative)
    // Positive Res → increase load capacity (aggressive)
    let load_delta = -res * this.load_gain;
    let load_target = this.currentLoadLimit + load_delta;

    // Apply load constraints
    load_target = Math.max(this.minLoad, Math.min(this.maxLoad, load_target));

    // Determine action type
    let action = 'MAINTAIN';
    if (Math.abs(damping_delta) > 50) {
      action = damping_delta > 0 ? 'INCREASE_DAMPING' : 'DECREASE_DAMPING';
    }
    if (Math.abs(load_delta) > 0.05) {
      action = load_delta > 0 ? 'REDUCE_LOAD' : 'INCREASE_LOAD';
    }

    return {
      damping: damping_target,               // N·s/m
      load_limit: load_target,               // % of max capacity (0-1)
      damping_delta: damping_delta,          // Change from current
      load_delta: load_delta,                // Change from current
      action: action,                        // Action description
      emergency_brake: false,
      current_damping: this.currentDamping,
      current_load: this.currentLoadLimit
    };
  }

  /**
   * Update current system state (called after actuator changes applied)
   *
   * @param {number} new_damping - New damping coefficient
   * @param {number} new_load_limit - New load limit
   */
  updateState(new_damping, new_load_limit) {
    this.currentDamping = Math.max(this.minDamping, Math.min(this.maxDamping, new_damping));
    this.currentLoadLimit = Math.max(this.minLoad, Math.min(this.maxLoad, new_load_limit));
    console.log(`⚙️ State updated: Damping=${this.currentDamping.toFixed(0)} N·s/m, Load=${(this.currentLoadLimit * 100).toFixed(0)}%`);
  }

  /**
   * Manually trigger/release emergency brake
   *
   * @param {boolean} activate - True to engage, false to release
   */
  setEmergencyBrake(activate) {
    this.emergencyBrakeActive = activate;
    console.log(`⚙️ Emergency brake ${activate ? 'ENGAGED' : 'RELEASED'} (manual override)`);
  }

  /**
   * Get diagnostics
   */
  getDiagnostics() {
    return {
      version: '2.0-MechanicalActuator',
      domain: 'mechanical',
      current_damping: this.currentDamping,
      current_load_limit: this.currentLoadLimit,
      damping_range: [this.minDamping, this.maxDamping],
      load_range: [this.minLoad, this.maxLoad],
      emergency_brake_active: this.emergencyBrakeActive,
      emergency_threshold: this.emergencyBrakeThreshold,
      gains: {
        damping: this.damping_gain,
        load: this.load_gain
      }
    };
  }
}

console.log("⚙️ MechanicalActuator class ready");

export default MechanicalActuator;
