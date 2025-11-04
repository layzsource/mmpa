/**
 * MMPA Framework V2.0: Complete Closed-Loop Control System
 *
 * Integrates all V2.0 components into a single unified control loop:
 *
 * System Architecture:
 * ┌─────────────┐
 * │ Observations│ (y_t: ΣC, other sensors)
 * └──────┬──────┘
 *        │
 *        ▼
 * ┌─────────────┐
 * │ UKF Filter  │ (State estimation: Σ* ← [y_t, u_t])
 * └──────┬──────┘
 *        │ Σ*(t)
 *        ▼
 * ┌─────────────┐
 * │ LQR Control │ (Optimal control: u* = -K·e)
 * └──────┬──────┘
 *        │ u*(t)
 *        ├────────────────────┬──────────────────┐
 *        ▼                    ▼                  ▼
 * ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
 * │  Financial   │   │ Mechanical   │   │Physiological │
 * │  Actuator    │   │  Actuator    │   │  Actuator    │
 * └──────────────┘   └──────────────┘   └──────────────┘
 *        │                    │                  │
 *        └────────────────────┴──────────────────┘
 *                           │
 *                           ▼
 *                    [ Domain Actions ]
 *
 * V2.0 Capabilities:
 * - Autonomous state estimation (UKF)
 * - Optimal control (LQR with Riccati solution)
 * - Multi-domain actuation (Finance, Mechanical, Physiological)
 * - Real-time diagnostics (FIM force attribution)
 * - φ-regularization (golden ratio constraint)
 */

console.log("🎛️ mmpaControlSystem.js V2.0 loaded");

import { KalmanBifurcationFilter } from './kalmanBifurcationFilter.js';
import { LQRController } from './lqrController.js';
import { FeatureImportanceModule } from './featureImportanceModule.js';
import FinancialActuator from './actuator/financialActuator.js';
import MechanicalActuator from './actuator/mechanicalActuator.js';
import PhysiologicalActuator from './actuator/physioActuator.js';

export class MMPAControlSystem {
  constructor(options = {}) {
    // === System Configuration ===
    this.domain = options.domain || 'general'; // 'financial', 'mechanical', 'physiological', 'general'
    this.dt = options.dt || 1.0; // Time step (seconds)

    // === Initialize Core Components ===

    // 1. UKF State Estimator
    this.ukf = new KalmanBifurcationFilter({
      initialState: options.initialState || 0.95,
      A: options.A || 0.95,
      B: options.B || [-0.05, -0.15],
      H: options.H || 1.0,
      Q: options.Q || 1e-4,
      R: options.R || 1e-3,
      alpha: options.ukf_alpha || 0.1,
      beta: options.ukf_beta || 2,
      kappa: options.ukf_kappa || 0,
      phiRegWeight: options.phiRegWeight || 0.1,
      enablePhiRegularization: options.enablePhiRegularization !== false
    });

    // 2. LQR Optimal Controller
    this.lqr = new LQRController({
      A: options.A || 0.95,
      B: options.B || [-0.05, -0.15],
      Q: options.lqr_Q || 10.0,
      R: options.lqr_R || [[1.0, 0.0], [0.0, 2.0]],
      setpoint: options.setpoint || 0.95,
      u_min: options.u_min || [-0.5, -0.5],
      u_max: options.u_max || [0.5, 0.5]
    });

    // 3. Feature Importance Module (Force Attribution)
    this.fim = new FeatureImportanceModule({
      B: options.B || [-0.05, -0.15],
      inputNames: options.inputNames || ['Trans_sm', 'Res'],
      topN: 3
    });

    // 4. Domain Actuators (initialize based on domain)
    this.actuators = {
      financial: null,
      mechanical: null,
      physiological: null
    };

    // Initialize appropriate actuator(s)
    if (this.domain === 'financial' || this.domain === 'general') {
      this.actuators.financial = new FinancialActuator(options.financialActuator || {});
    }
    if (this.domain === 'mechanical' || this.domain === 'general') {
      this.actuators.mechanical = new MechanicalActuator(options.mechanicalActuator || {});
    }
    if (this.domain === 'physiological' || this.domain === 'general') {
      this.actuators.physiological = new PhysiologicalActuator(options.physiologicalActuator || {});
    }

    // === System State ===
    this.time = 0;
    this.iteration = 0;
    this.isRunning = false;

    // History logging
    this.history = {
      time: [],
      sigma_star: [],
      sigma_c: [],
      control: [],
      innovation: [],
      loss: [],
      actions: []
    };

    console.log("🎛️ MMPA Control System V2.0 initialized");
    console.log(`   Domain: ${this.domain}`);
    console.log(`   Components: UKF + LQR + FIM + ${Object.keys(this.actuators).filter(k => this.actuators[k]).length} Actuator(s)`);
  }

  /**
   * Execute one control cycle
   *
   * @param {Array} u_t - Current control inputs [Trans_sm, Res, ...]
   * @param {number} y_t - Current observation (ΣC or equivalent)
   * @returns {Object} - Complete system output
   */
  step(u_t, y_t) {
    this.iteration++;
    this.time += this.dt;

    // ━━━ STEP 1: State Estimation (UKF) ━━━
    const ukf_result = this.ukf.step(u_t, y_t);
    const sigma_star = ukf_result.sigma_star;

    // ━━━ STEP 2: Optimal Control (LQR) ━━━
    const lqr_result = this.lqr.computeControl(sigma_star);
    const u_star = lqr_result.u; // Optimal control signal

    // ━━━ STEP 3: Force Attribution (FIM) ━━━
    const fim_result = this.fim.computeAttribution(u_star, sigma_star);

    // ━━━ STEP 4: Domain Actuation ━━━
    const actuator_outputs = {};

    if (this.actuators.financial) {
      actuator_outputs.financial = this.actuators.financial.actuate(u_star, sigma_star);
    }
    if (this.actuators.mechanical) {
      actuator_outputs.mechanical = this.actuators.mechanical.actuate(u_star, sigma_star);
    }
    if (this.actuators.physiological) {
      actuator_outputs.physiological = this.actuators.physiological.actuate(u_star, sigma_star);
    }

    // ━━━ STEP 5: Logging ━━━
    this.history.time.push(this.time);
    this.history.sigma_star.push(sigma_star);
    this.history.sigma_c.push(y_t);
    this.history.control.push([...u_star]);
    this.history.innovation.push(ukf_result.innovation);
    this.history.loss.push(ukf_result.loss);
    this.history.actions.push(actuator_outputs);

    // Keep history bounded (last 1000 steps)
    if (this.history.time.length > 1000) {
      Object.keys(this.history).forEach(key => this.history[key].shift());
    }

    // ━━━ Return Complete System State ━━━
    return {
      time: this.time,
      iteration: this.iteration,

      // State estimation
      sigma_star: sigma_star,
      sigma_c: y_t,
      bifurcation_risk: ukf_result.bifurcation_risk,

      // Control
      control_signal: u_star,
      tracking_error: lqr_result.error,
      control_saturated: lqr_result.saturated,

      // Force attribution
      force_attribution: fim_result,

      // Actuator outputs
      actuators: actuator_outputs,

      // Diagnostics
      ukf_diagnostics: {
        innovation: ukf_result.innovation,
        kalman_gain: ukf_result.kalman_gain,
        confidence: ukf_result.confidence,
        phi_deviation: ukf_result.phi_deviation,
        loss: ukf_result.loss
      }
    };
  }

  /**
   * Run simulation with mock data
   *
   * @param {number} steps - Number of steps to simulate
   * @param {Function} observationGenerator - Function that generates y_t at each step
   * @param {Function} inputGenerator - Function that generates u_t at each step
   * @returns {Array} - Array of step outputs
   */
  simulate(steps, observationGenerator, inputGenerator) {
    console.log(`🎛️ Starting ${steps}-step simulation...`);

    const results = [];
    this.isRunning = true;

    for (let i = 0; i < steps; i++) {
      // Generate mock inputs
      const y_t = observationGenerator ? observationGenerator(i, this.time) : 0.95;
      const u_t = inputGenerator ? inputGenerator(i, this.time) : [0, 0];

      // Execute control cycle
      const result = this.step(u_t, y_t);
      results.push(result);

      // Log progress every 100 steps
      if (i % 100 === 0) {
        console.log(`  Step ${i}/${steps}: Σ* = ${result.sigma_star.toFixed(3)}, Risk = ${(result.bifurcation_risk * 100).toFixed(1)}%`);
      }
    }

    this.isRunning = false;
    console.log(`🎛️ Simulation complete (${steps} steps, ${this.time.toFixed(1)}s)`);

    return results;
  }

  /**
   * Reset system to initial state
   */
  reset() {
    this.ukf.reset();
    this.time = 0;
    this.iteration = 0;
    this.history = {
      time: [],
      sigma_star: [],
      sigma_c: [],
      control: [],
      innovation: [],
      loss: [],
      actions: []
    };
    console.log("🎛️ System reset");
  }

  /**
   * Get complete system diagnostics
   */
  getDiagnostics() {
    return {
      version: '2.0-MMPAControlSystem',
      domain: this.domain,
      time: this.time,
      iteration: this.iteration,
      is_running: this.isRunning,

      components: {
        ukf: this.ukf.getDiagnostics(),
        lqr: this.lqr.getDiagnostics(),
        fim: this.fim.getDiagnostics()
      },

      actuators: Object.fromEntries(
        Object.entries(this.actuators)
          .filter(([_, actuator]) => actuator !== null)
          .map(([name, actuator]) => [name, actuator.getDiagnostics()])
      ),

      history_length: this.history.time.length
    };
  }
}

console.log("🎛️ MMPAControlSystem class ready");

export default MMPAControlSystem;
