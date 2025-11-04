/**
 * MMPA Framework V2.0: Physiological Actuator Interface
 *
 * Translates LQR control signals into medical dosing recommendations.
 *
 * Theory:
 * - Input: u = [Trans_sm, Res] from LQR controller
 * - Output: {vasoactive_dose, sedation_rate}
 * - Vasoactive: Blood pressure management (vasopressors, vasodilators)
 * - Sedation: Arousal/consciousness level
 *
 * Domain Translation:
 * - Trans_sm → Vasoactive dosing rate (circulatory stability)
 * - Res → Sedation depth (nervous system resilience)
 * - Negative u → Increase medication (stabilize patient)
 * - Positive u → Reduce medication (allow natural recovery)
 *
 * V2.0 Features:
 * - Safe dosing limits (clinical guidelines)
 * - Titration rate limits (prevent shock)
 * - Critical alert (emergency dosing if instability severe)
 *
 * IMPORTANT: This is a decision support tool, not autonomous medical device.
 * All outputs require clinical validation before application.
 */

console.log("🏥 physioActuator.js V2.0 loaded");

export class PhysiologicalActuator {
  constructor(options = {}) {
    // === Domain-Specific Parameters ===
    // Vasoactive dose range (μg/kg/min or similar units)
    this.minVasoDose = options.minVasoDose || 0;      // No vasopressor
    this.maxVasoDose = options.maxVasoDose || 20;     // Max safe dose

    // Sedation level range (Richmond Agitation-Sedation Scale: -5 to +4)
    // or depth percentage (0-100%)
    this.minSedation = options.minSedation || 0;      // Fully awake
    this.maxSedation = options.maxSedation || 100;    // Deep sedation

    // Current treatment state
    this.currentVasoDose = options.initialVasoDose || 5; // μg/kg/min
    this.currentSedation = options.initialSedation || 30; // 30% sedation

    // === Control-to-Actuator Mapping ===
    // How sensitive is vasoactive dose to Trans_sm control signal?
    this.vaso_gain = options.vaso_gain || 2.0; // μg/kg/min per unit control

    // How sensitive is sedation to Res control signal?
    this.sedation_gain = options.sedation_gain || 10.0; // % change per unit control

    // === Safety Parameters ===
    // Maximum titration rate (prevent rapid changes)
    this.maxVasoTitrationRate = options.maxVasoTitrationRate || 2.0; // μg/kg/min per step
    this.maxSedationTitrationRate = options.maxSedationTitrationRate || 10; // % per step

    // Critical alert threshold (Σ* below this → emergency dosing)
    this.criticalAlertThreshold = options.criticalAlertThreshold || 0.25;
    this.criticalAlertActive = false;

    console.log("🏥 Physiological Actuator initialized");
    console.log(`   Vasoactive Range: ${this.minVasoDose} - ${this.maxVasoDose} μg/kg/min`);
    console.log(`   Sedation Range: ${this.minSedation}% - ${this.maxSedation}%`);
    console.log(`   Critical Alert: Σ* < ${this.criticalAlertThreshold}`);
    console.log("   ⚠️  Decision support only - requires clinical validation");
  }

  /**
   * Apply control signal to generate dosing recommendations
   *
   * @param {Array} u - Control signal [Trans_sm, Res] from LQR
   * @param {number} current_state - Current Σ* value
   * @returns {Object} { vaso_dose, sedation_level, action, critical_alert }
   */
  actuate(u, current_state) {
    // Check critical alert condition
    if (current_state < this.criticalAlertThreshold) {
      if (!this.criticalAlertActive) {
        console.warn(`🏥 CRITICAL ALERT: Σ* = ${current_state.toFixed(3)} < ${this.criticalAlertThreshold}`);
        this.criticalAlertActive = true;
      }

      return {
        vaso_dose: this.maxVasoDose,         // Maximum vasopressor support
        sedation_level: this.maxSedation,    // Deep sedation
        action: 'CRITICAL_INTERVENTION',
        critical_alert: true,
        reason: `Severe instability detected (Σ* = ${current_state.toFixed(3)})`,
        warning: '⚠️  URGENT CLINICAL REVIEW REQUIRED'
      };
    }

    // Clear critical alert if state recovers
    if (this.criticalAlertActive && current_state >= this.criticalAlertThreshold + 0.05) {
      console.log(`🏥 Critical alert cleared: Σ* = ${current_state.toFixed(3)}`);
      this.criticalAlertActive = false;
    }

    const [trans_sm, res] = u;

    // --- Vasoactive Dose Calculation ---
    // Trans_sm controls circulatory stability
    // Negative Trans_sm → increase vasopressor (support blood pressure)
    // Positive Trans_sm → reduce vasopressor (allow weaning)
    let vaso_delta = -trans_sm * this.vaso_gain;

    // Apply titration rate limiting (safety)
    vaso_delta = Math.max(-this.maxVasoTitrationRate, Math.min(this.maxVasoTitrationRate, vaso_delta));

    let vaso_target = this.currentVasoDose + vaso_delta;

    // Apply dose constraints
    vaso_target = Math.max(this.minVasoDose, Math.min(this.maxVasoDose, vaso_target));

    // --- Sedation Level Calculation ---
    // Res controls nervous system resilience
    // Negative Res → increase sedation (reduce agitation/stress)
    // Positive Res → reduce sedation (promote awakening)
    let sedation_delta = -res * this.sedation_gain;

    // Apply titration rate limiting (safety)
    sedation_delta = Math.max(-this.maxSedationTitrationRate, Math.min(this.maxSedationTitrationRate, sedation_delta));

    let sedation_target = this.currentSedation + sedation_delta;

    // Apply sedation constraints
    sedation_target = Math.max(this.minSedation, Math.min(this.maxSedation, sedation_target));

    // Determine action type
    let action = 'MAINTAIN';
    if (Math.abs(vaso_delta) > 0.5) {
      action = vaso_delta > 0 ? 'INCREASE_VASOPRESSOR' : 'WEAN_VASOPRESSOR';
    }
    if (Math.abs(sedation_delta) > 5) {
      action = sedation_delta > 0 ? 'DEEPEN_SEDATION' : 'LIGHTEN_SEDATION';
    }

    return {
      vaso_dose: vaso_target,                // μg/kg/min
      sedation_level: sedation_target,       // % (0-100)
      vaso_delta: vaso_delta,                // Change from current
      sedation_delta: sedation_delta,        // Change from current
      action: action,                        // Action description
      critical_alert: false,
      current_vaso: this.currentVasoDose,
      current_sedation: this.currentSedation,
      warning: '⚠️  Decision support - clinical validation required'
    };
  }

  /**
   * Update current treatment state (called after dosing changes applied)
   *
   * @param {number} new_vaso_dose - New vasoactive dose
   * @param {number} new_sedation - New sedation level
   */
  updateState(new_vaso_dose, new_sedation) {
    this.currentVasoDose = Math.max(this.minVasoDose, Math.min(this.maxVasoDose, new_vaso_dose));
    this.currentSedation = Math.max(this.minSedation, Math.min(this.maxSedation, new_sedation));
    console.log(`🏥 Treatment updated: Vaso=${this.currentVasoDose.toFixed(1)} μg/kg/min, Sedation=${this.currentSedation.toFixed(0)}%`);
  }

  /**
   * Manually trigger/clear critical alert
   *
   * @param {boolean} activate - True to trigger, false to clear
   */
  setCriticalAlert(activate) {
    this.criticalAlertActive = activate;
    console.log(`🏥 Critical alert ${activate ? 'ACTIVATED' : 'CLEARED'} (manual override)`);
  }

  /**
   * Get diagnostics
   */
  getDiagnostics() {
    return {
      version: '2.0-PhysiologicalActuator',
      domain: 'physiological',
      current_vaso_dose: this.currentVasoDose,
      current_sedation: this.currentSedation,
      vaso_range: [this.minVasoDose, this.maxVasoDose],
      sedation_range: [this.minSedation, this.maxSedation],
      critical_alert_active: this.criticalAlertActive,
      critical_threshold: this.criticalAlertThreshold,
      titration_limits: {
        vaso: this.maxVasoTitrationRate,
        sedation: this.maxSedationTitrationRate
      },
      gains: {
        vaso: this.vaso_gain,
        sedation: this.sedation_gain
      },
      disclaimer: 'Decision support tool - not autonomous medical device'
    };
  }
}

console.log("🏥 PhysiologicalActuator class ready");
console.log("⚠️  MEDICAL DEVICE DISCLAIMER: Decision support only, requires clinical validation");

export default PhysiologicalActuator;
