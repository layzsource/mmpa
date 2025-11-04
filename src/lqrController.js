/**
 * MMPA Framework V2.0: Linear Quadratic Regulator (LQR) Controller
 *
 * Implements discrete-time LQR for optimal closed-loop control of the MMPA system.
 *
 * Theory:
 * - Given state error e(t) = s_target - s(t)
 * - Find optimal control u*(t) that minimizes cost:
 *   J = Σ [e(t)ᵀQe(t) + u(t)ᵀRu(t)]
 * - Solution: u*(t) = -K*e(t), where K solves Discrete Algebraic Riccati Equation (DARE)
 *
 * Key Innovation:
 * - State = Σ* (latent bifurcation distance)
 * - Control = [Trans_sm, Res] (translational smoothness, resilience)
 * - Goal: Drive Σ* towards target setpoint (e.g., 0.95 for high stability)
 *
 * V2.0 Features:
 * - Iterative Riccati solver (converges to steady-state solution)
 * - Tunable Q (state cost) and R (control cost) matrices
 * - Anti-windup for control saturation
 */

console.log("🎛️ lqrController.js V2.0 loaded");

export class LQRController {
  constructor(options = {}) {
    // === System Dynamics (from UKF) ===
    // State dimension (scalar Σ*)
    this.n = 1;
    // Control dimension ([Trans_sm, Res])
    this.m = 2;

    // State transition matrix A (from UKF dynamics)
    // For discrete-time: s(t+1) ≈ A*s(t) + B*u(t)
    this.A = options.A || 0.95; // Scalar for 1D state

    // Control input matrix B (from UKF)
    this.B = options.B || [-0.05, -0.15]; // [B_trans, B_res]

    // === LQR Cost Matrices ===
    // State cost Q: penalizes error from setpoint
    // Higher Q → more aggressive tracking, less control effort
    this.Q = options.Q || 10.0; // Scalar for 1D state

    // Control cost R: penalizes control effort
    // Higher R → smoother control, slower response
    // R is (m × m) matrix for multi-input
    this.R = options.R || [
      [1.0, 0.0],  // Cost for Trans_sm
      [0.0, 2.0]   // Cost for Res (higher cost = prefer Trans_sm)
    ];

    // === Riccati Solver Parameters ===
    this.maxIterations = options.maxIterations || 100;
    this.tolerance = options.tolerance || 1e-6;

    // === Control Limits (Anti-windup) ===
    this.u_min = options.u_min || [-0.5, -0.5];  // Min control per channel
    this.u_max = options.u_max || [0.5, 0.5];    // Max control per channel

    // === Setpoint ===
    this.setpoint = options.setpoint || 0.95; // Target Σ* (high stability)

    // === Computed Optimal Gain ===
    this.K = null; // Will be (m × n) = (2 × 1) vector after solving DARE

    // Solve DARE on initialization
    this.solveDARE();

    console.log("🎛️ LQR Controller initialized");
    console.log(`   Setpoint: Σ* = ${this.setpoint.toFixed(3)}`);
    console.log(`   Q (state cost): ${this.Q}`);
    console.log(`   R (control cost): [[${this.R[0][0]}, ${this.R[0][1]}], [${this.R[1][0]}, ${this.R[1][1]}]]`);
    console.log(`   Optimal Gain K: [${this.K ? this.K.map(k => k.toFixed(4)).join(', ') : 'not computed'}]`);
  }

  /**
   * Solve Discrete-time Algebraic Riccati Equation (DARE)
   *
   * Finds steady-state solution P to:
   * P = AᵀPA - AᵀPB(R + BᵀPB)⁻¹BᵀPA + Q
   *
   * Then computes optimal gain:
   * K = (R + BᵀPB)⁻¹BᵀPA
   *
   * Uses iterative method (value iteration) for simplicity.
   */
  solveDARE() {
    // Initialize P = Q (starting guess)
    let P = this.Q;

    let converged = false;
    let iter = 0;

    while (!converged && iter < this.maxIterations) {
      // Compute BᵀPB (scalar for scalar state)
      // B is [B_trans, B_res], so BᵀPB is a (2×2) matrix
      const BtPB = [
        [this.B[0] * P * this.B[0], this.B[0] * P * this.B[1]],
        [this.B[1] * P * this.B[0], this.B[1] * P * this.B[1]]
      ];

      // R + BᵀPB (2×2 matrix)
      const S = [
        [this.R[0][0] + BtPB[0][0], this.R[0][1] + BtPB[0][1]],
        [this.R[1][0] + BtPB[1][0], this.R[1][1] + BtPB[1][1]]
      ];

      // S⁻¹ (invert 2×2 matrix)
      const det = S[0][0] * S[1][1] - S[0][1] * S[1][0];
      if (Math.abs(det) < 1e-10) {
        console.error("🎛️ DARE: Singular matrix S (det ≈ 0)");
        break;
      }
      const S_inv = [
        [S[1][1] / det, -S[0][1] / det],
        [-S[1][0] / det, S[0][0] / det]
      ];

      // BᵀPA (2×1 vector for scalar state)
      const BtPA = [
        this.B[0] * P * this.A,
        this.B[1] * P * this.A
      ];

      // K = S⁻¹ * BᵀPA (2×1 vector)
      const K_new = [
        S_inv[0][0] * BtPA[0] + S_inv[0][1] * BtPA[1],
        S_inv[1][0] * BtPA[0] + S_inv[1][1] * BtPA[1]
      ];

      // AᵀPB (1×2 row vector)
      const AtPB = [
        this.A * P * this.B[0],
        this.A * P * this.B[1]
      ];

      // AᵀPB * K_new (scalar)
      const AtPBK = AtPB[0] * K_new[0] + AtPB[1] * K_new[1];

      // P_new = AᵀPA - AᵀPB*K + Q
      const P_new = this.A * P * this.A - AtPBK + this.Q;

      // Check convergence
      const delta = Math.abs(P_new - P);
      if (delta < this.tolerance) {
        converged = true;
      }

      // Update
      P = P_new;
      this.K = K_new;
      iter++;
    }

    if (!converged) {
      console.warn(`🎛️ DARE did not converge after ${iter} iterations (delta = ${Math.abs(P - this.Q).toExponential(2)})`);
    } else {
      console.log(`🎛️ DARE converged in ${iter} iterations`);
    }

    return P;
  }

  /**
   * Compute optimal control signal
   *
   * u*(t) = -K * e(t)
   * where e(t) = setpoint - s(t)
   *
   * @param {number} current_state - Current Σ* value
   * @returns {Object} { u, error, saturated }
   */
  computeControl(current_state) {
    if (!this.K) {
      console.error("🎛️ Cannot compute control: K not initialized (DARE failed)");
      return { u: [0, 0], error: 0, saturated: false };
    }

    // State error
    const error = this.setpoint - current_state;

    // Optimal control: u = -K*e
    let u_raw = [
      -this.K[0] * error,
      -this.K[1] * error
    ];

    // Apply saturation (anti-windup)
    const u = [
      Math.max(this.u_min[0], Math.min(this.u_max[0], u_raw[0])),
      Math.max(this.u_min[1], Math.min(this.u_max[1], u_raw[1]))
    ];

    // Check if saturated
    const saturated = (
      u[0] !== u_raw[0] || u[1] !== u_raw[1]
    );

    return {
      u: u,                      // Control signal [Trans_sm, Res]
      error: error,              // Tracking error
      saturated: saturated,      // Whether control is clamped
      u_raw: u_raw              // Unsaturated control (for diagnostics)
    };
  }

  /**
   * Update setpoint (target Σ*)
   *
   * @param {number} new_setpoint - New target stability
   */
  setSetpoint(new_setpoint) {
    this.setpoint = Math.max(0.0, Math.min(1.0, new_setpoint));
    console.log(`🎛️ LQR setpoint updated: Σ* = ${this.setpoint.toFixed(3)}`);
  }

  /**
   * Update cost matrices and re-solve DARE
   *
   * @param {number} Q_new - New state cost
   * @param {Array} R_new - New control cost matrix (2×2)
   */
  updateCosts(Q_new, R_new) {
    this.Q = Q_new;
    this.R = R_new;
    console.log("🎛️ LQR cost matrices updated, re-solving DARE...");
    this.solveDARE();
  }

  /**
   * Get diagnostics
   */
  getDiagnostics() {
    return {
      version: '2.0-LQR',
      setpoint: this.setpoint,
      gain: this.K,
      system: {
        A: this.A,
        B: this.B
      },
      costs: {
        Q: this.Q,
        R: this.R
      },
      limits: {
        u_min: this.u_min,
        u_max: this.u_max
      }
    };
  }
}

console.log("🎛️ LQRController class ready");

export default LQRController;
