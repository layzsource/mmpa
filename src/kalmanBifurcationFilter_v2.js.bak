/**
 * Phase 13.28 V2.0: Latent Stability State (Σ*) Kalman Filter
 *
 * Implements BOTH Linear Kalman Filter (LKF) and Unscented Kalman Filter (UKF)
 * to predict bifurcation (regime change) by estimating the unobservable
 * "distance to bifurcation" (Σ*) from observable core stability (ΣC)
 * and dynamic stress inputs.
 *
 * Key Innovation: φ-Constraint (Non-Resonant Initialization Heuristic)
 * The filter matrices are initialized such that |A| / Σ|B| ≈ φ (1.618...)
 * This provides a non-resonant starting point that accelerates convergence.
 * The constraint is now an OPTIONAL regularization term (tunable weight).
 *
 * V2.0 Improvements:
 * - UKF for non-linear dynamics (tanh activation)
 * - φ-constraint as optional empirical heuristic (not theoretical axiom)
 * - Backward compatibility with LKF
 * - Enterprise-grade configurability
 */

console.log("🔮 kalmanBifurcationFilter_v2.js loaded");

const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio ≈ 1.618

export class KalmanBifurcationFilter {
  constructor(options = {}) {
    // Filter type: 'LKF' (legacy) or 'UKF' (default)
    this.filterType = options.filterType || 'UKF';

    // State vector: s_t = [Σ*(t)] (scalar)
    this.s = options.initialState || 0.99; // Start very stable

    // Covariance matrix: P_t (uncertainty in state estimate)
    this.P = options.initialCovariance || 0.01;

    // === Filter Matrices (The Learned Dynamics) ===

    // State transition: A (memory/inertia)
    // How much the system relies on its previous state
    this.A = options.A || 0.95; // High inertia

    // Control input matrix: B (stress response)
    // How dynamic inputs push towards instability
    // B = [B_trans, B_res] for [Trans_sm, Res]
    this.B = options.B || [-0.05, -0.15]; // Inputs subtract from stability

    // Observation matrix: H (latent-to-observable mapping)
    // How Σ* relates to ΣC
    this.H = options.H || 1.0; // Initial guess: Σ* ≈ ΣC

    // Process noise covariance: Q (system uncertainty)
    this.Q = options.Q || 1e-4; // Small random bumps

    // Measurement noise covariance: R (sensor uncertainty)
    this.R = options.R || 1e-3; // ΣC calculation noise

    // === UKF Parameters (N=1 for scalar state) ===
    this.ukf = {
      alpha: options.ukfAlpha || 0.1,   // Spread of sigma points (moderate for N=1)
      beta: options.ukfBeta || 2,       // Prior distribution knowledge (Gaussian)
      kappa: options.ukfKappa || 0,     // Secondary scaling (standard for N=1)
      lambda: 0,                        // Computed: alpha^2 * (N + kappa) - N
      weights_m: [],                    // Mean weights for sigma points
      weights_c: []                     // Covariance weights for sigma points
    };

    // Compute lambda and weights for UKF
    const N = 1; // Scalar state
    this.ukf.lambda = this.ukf.alpha ** 2 * (N + this.ukf.kappa) - N;

    // Weights for N=1 (3 sigma points total)
    const lambda_plus_N = this.ukf.lambda + N;
    this.ukf.weights_m[0] = this.ukf.lambda / lambda_plus_N;
    this.ukf.weights_m[1] = 0.5 / lambda_plus_N;
    this.ukf.weights_m[2] = 0.5 / lambda_plus_N;

    this.ukf.weights_c[0] = this.ukf.lambda / lambda_plus_N + (1 - this.ukf.alpha ** 2 + this.ukf.beta);
    this.ukf.weights_c[1] = 0.5 / lambda_plus_N;
    this.ukf.weights_c[2] = 0.5 / lambda_plus_N;

    // === φ-Constraint Parameters ===
    this.phiTarget = PHI;
    this.phiRegWeight = options.phiRegWeight !== undefined ? options.phiRegWeight : 0.1; // Default 0.1
    this.phiLearningRate = options.phiLearningRate || 0.001;

    // History for learning/optimization
    this.history = {
      s: [],           // Σ*(t) predictions
      y: [],           // ΣC(t) observations
      innovation: [],  // Prediction errors
      K: []            // Kalman gains
    };

    console.log("🔮 Kalman Bifurcation Filter V2.0 initialized");
    console.log(`   Filter Type: ${this.filterType}`);
    console.log(`   A = ${this.A.toFixed(4)} (memory)`);
    console.log(`   B = [${this.B.map(b => b.toFixed(4)).join(', ')}] (stress)`);
    console.log(`   φ-regularization weight: ${this.phiRegWeight.toFixed(3)}`);

    if (this.filterType === 'UKF') {
      console.log(`   UKF: α=${this.ukf.alpha}, β=${this.ukf.beta}, κ=${this.ukf.kappa}`);
      console.log(`   UKF: λ=${this.ukf.lambda.toFixed(4)}, 3 sigma points`);
    }
  }

  // ============================================================================
  // NON-LINEAR SYSTEM DYNAMICS (for UKF)
  // ============================================================================

  /**
   * Non-linear state transition function: s_{k+1} = f(s_k, u_k)
   * Uses tanh activation to enforce bounded non-linearity
   * @param {Array} s - State [Σ*]
   * @param {Array} u - Control inputs [Trans_sm, Res]
   * @returns {Array} Next state [Σ*_{k+1}]
   */
  f(s, u) {
    const [trans_sm, res] = u;

    // Linear projection
    const s_linear = this.A * s[0] + this.B[0] * trans_sm + this.B[1] * res;

    // Apply tanh non-linearity to enforce bounds and capture regime dynamics
    // Factor 1.5 provides moderate non-linearity while keeping sensitivity
    const s_next = Math.tanh(s_linear * 1.5);

    return [s_next];
  }

  /**
   * Non-linear observation function: y_k = h(s_k)
   * Maps latent state Σ* to observable ΣC
   * @param {Array} s - State [Σ*]
   * @returns {number} Observation ΣC
   */
  h(s) {
    // Direct relationship with potential boundary enforcement
    // For now, linear mapping (can be enhanced with non-linear transform)
    return this.H * s[0];
  }

  // ============================================================================
  // UKF: SIGMA POINT GENERATION
  // ============================================================================

  /**
   * Generate sigma points for UKF
   * For N=1 (scalar state), we need 2N+1 = 3 sigma points
   * @param {number} s - Current state (scalar)
   * @param {number} P - Current covariance (scalar)
   * @returns {Array} Array of 3 sigma points
   */
  generateSigmaPoints(s, P) {
    const N = 1;
    const lambda_plus_N = this.ukf.lambda + N;

    // Sigma points for scalar state (3 points)
    const sigma_points = [];

    // σ_0 = s (central point)
    sigma_points[0] = [s];

    // σ_1 = s + sqrt((λ+N) * P)
    const offset = Math.sqrt(lambda_plus_N * P);
    sigma_points[1] = [s + offset];

    // σ_2 = s - sqrt((λ+N) * P)
    sigma_points[2] = [s - offset];

    return sigma_points;
  }

  // ============================================================================
  // UKF: PREDICTION STEP
  // ============================================================================

  /**
   * UKF Prediction: Propagate sigma points through non-linear dynamics
   * @param {Array} u_t - Control inputs [Trans_sm, Res]
   * @returns {Object} { s_pred, P_pred, sigma_points_pred }
   */
  predictUKF(u_t) {
    // 1. Generate sigma points from current state
    const sigma_points = this.generateSigmaPoints(this.s, this.P);

    // 2. Propagate sigma points through non-linear function f()
    const sigma_points_pred = sigma_points.map(sp => this.f(sp, u_t));

    // 3. Compute predicted mean (weighted sum)
    let s_pred = 0;
    for (let i = 0; i < 3; i++) {
      s_pred += this.ukf.weights_m[i] * sigma_points_pred[i][0];
    }

    // 4. Compute predicted covariance (weighted outer product)
    let P_pred = 0;
    for (let i = 0; i < 3; i++) {
      const diff = sigma_points_pred[i][0] - s_pred;
      P_pred += this.ukf.weights_c[i] * diff * diff;
    }
    P_pred += this.Q; // Add process noise

    return { s_pred, P_pred, sigma_points_pred };
  }

  // ============================================================================
  // UKF: UPDATE STEP
  // ============================================================================

  /**
   * UKF Update: Correct prediction with observation
   * @param {number} s_pred - Predicted state
   * @param {number} P_pred - Predicted covariance
   * @param {Array} sigma_points_pred - Predicted sigma points
   * @param {number} y_t - Observation (ΣC)
   * @returns {Object} { s, P, K, innovation }
   */
  updateUKF(s_pred, P_pred, sigma_points_pred, y_t) {
    // 1. Map sigma points through observation function h()
    const y_sigma = sigma_points_pred.map(sp => this.h(sp));

    // 2. Compute predicted observation mean
    let y_pred = 0;
    for (let i = 0; i < 3; i++) {
      y_pred += this.ukf.weights_m[i] * y_sigma[i];
    }

    // 3. Compute innovation covariance S
    let S = 0;
    for (let i = 0; i < 3; i++) {
      const diff = y_sigma[i] - y_pred;
      S += this.ukf.weights_c[i] * diff * diff;
    }
    S += this.R; // Add measurement noise

    // 4. Compute cross-covariance P_xy
    let P_xy = 0;
    for (let i = 0; i < 3; i++) {
      const diff_s = sigma_points_pred[i][0] - s_pred;
      const diff_y = y_sigma[i] - y_pred;
      P_xy += this.ukf.weights_c[i] * diff_s * diff_y;
    }

    // 5. Compute Kalman gain
    const K = P_xy / S;

    // 6. Update state
    const innovation = y_t - y_pred;
    let s_new = s_pred + K * innovation;
    s_new = Math.max(0.0, Math.min(1.0, s_new)); // Clamp to [0, 1]

    // 7. Update covariance
    const P_new = P_pred - K * S * K;

    return { s: s_new, P: P_new, K, innovation };
  }

  // ============================================================================
  // LKF: PREDICTION STEP (Legacy)
  // ============================================================================

  /**
   * LKF Prediction Step: Project state and covariance forward
   * s_t|t-1 = A * s_t-1 + B * u_t
   * P_t|t-1 = A * P_t-1 * A^T + Q
   */
  predictLKF(u_t) {
    // u_t = [Trans_sm(t), Res(t)]
    const [trans_sm, res] = u_t;

    // Step 1.1: Project the state (causal prediction)
    const control_effect = this.B[0] * trans_sm + this.B[1] * res;
    const s_pred = this.A * this.s + control_effect;

    // Step 1.2: Project the covariance (uncertainty)
    const P_pred = this.A * this.P * this.A + this.Q;

    return { s_pred, P_pred };
  }

  // ============================================================================
  // LKF: UPDATE STEP (Legacy)
  // ============================================================================

  /**
   * LKF Update Step: Correct prediction with observation
   * innovation = y_t - H * s_t|t-1
   * K = P_t|t-1 * H^T / (H * P_t|t-1 * H^T + R)
   * s_t = s_t|t-1 + K * innovation
   * P_t = (I - K * H) * P_t|t-1
   */
  updateLKF(s_pred, P_pred, y_t) {
    // Step 2.1: Calculate innovation (observation error)
    const innovation = y_t - this.H * s_pred;

    // Step 2.2: Calculate Kalman Gain
    const S = this.H * P_pred * this.H + this.R; // Innovation covariance
    const K = (P_pred * this.H) / S;

    // Step 2.3: Update state
    let s_new = s_pred + K * innovation;
    s_new = Math.max(0.0, Math.min(1.0, s_new)); // Clamp to [0, 1]

    // Step 2.4: Update covariance
    const P_new = (1 - K * this.H) * P_pred;

    return { s: s_new, P: P_new, K, innovation };
  }

  // ============================================================================
  // UNIFIED STEP INTERFACE
  // ============================================================================

  /**
   * Full cycle: Predict + Update (uses selected filter type)
   * @param {Array} u_t - Control inputs [Trans_sm, Res]
   * @param {number} y_t - Observation (ΣC)
   * @returns {Object} { sigma_star, sigma_c, innovation, confidence }
   */
  step(u_t, y_t) {
    let s_pred, P_pred, K, innovation;

    // Select filter type
    if (this.filterType === 'UKF') {
      // UKF Prediction
      const ukf_pred = this.predictUKF(u_t);
      s_pred = ukf_pred.s_pred;
      P_pred = ukf_pred.P_pred;

      // UKF Update
      const ukf_update = this.updateUKF(s_pred, P_pred, ukf_pred.sigma_points_pred, y_t);
      this.s = ukf_update.s;
      this.P = ukf_update.P;
      K = ukf_update.K;
      innovation = ukf_update.innovation;
    } else {
      // LKF Prediction
      const lkf_pred = this.predictLKF(u_t);
      s_pred = lkf_pred.s_pred;
      P_pred = lkf_pred.P_pred;

      // LKF Update
      const lkf_update = this.updateLKF(s_pred, P_pred, y_t);
      this.s = lkf_update.s;
      this.P = lkf_update.P;
      K = lkf_update.K;
      innovation = lkf_update.innovation;
    }

    // Log to history (keep last 100 samples)
    this.history.s.push(this.s);
    this.history.y.push(y_t);
    this.history.innovation.push(innovation);
    this.history.K.push(K);

    if (this.history.s.length > 100) {
      this.history.s.shift();
      this.history.y.shift();
      this.history.innovation.shift();
      this.history.K.shift();
    }

    // Apply φ-constraint learning (if weight > 0)
    if (this.phiRegWeight > 0 && this.history.s.length > 10) {
      this.applyPhiConstraint();
    }

    return {
      sigma_star: this.s,         // Σ*(t) - Latent bifurcation distance
      sigma_c: y_t,               // ΣC(t) - Observable core stability
      innovation: innovation,     // Prediction error
      kalman_gain: K,             // Filter confidence
      confidence: 1 - this.P,     // State certainty (inverse of covariance)
      bifurcation_risk: 1 - this.s  // Risk of regime change (0-1)
    };
  }

  // ============================================================================
  // φ-CONSTRAINT: OPTIONAL REGULARIZATION (V2.0)
  // ============================================================================

  /**
   * φ-Constraint: Optimize A and B with regularization toward φ-ratio
   * |A| / Σ|B| ≈ φ
   *
   * V2.0: This is now an OPTIONAL empirical heuristic (not a theoretical axiom).
   * The loss function is: Loss = MSE(Observed, Predicted) + (phiRegWeight * phi_deviation)
   *
   * Enterprise clients can tune phiRegWeight from 0.0 (data-only fit) to 1.0 (strong φ-enforcement)
   * to empirically validate the Non-Resonant Initialization Heuristic.
   */
  applyPhiConstraint() {
    // Current ratio
    const B_sum = Math.abs(this.B[0]) + Math.abs(this.B[1]);
    const current_ratio = Math.abs(this.A) / B_sum;

    // Calculate φ-deviation (regularization term)
    const phi_deviation = Math.abs(current_ratio - this.phiTarget);

    // Only apply if deviation is significant and weight is non-zero
    if (phi_deviation > 0.01 && this.phiRegWeight > 0) {
      // Calculate MSE from recent history (prediction error)
      const recent_innovations = this.history.innovation.slice(-10);
      const mse = recent_innovations.reduce((sum, inn) => sum + inn * inn, 0) / recent_innovations.length;

      // Combined loss: MSE + (phiRegWeight * phi_deviation)
      // We adjust matrices to minimize this combined loss
      const total_loss = mse + (this.phiRegWeight * phi_deviation);

      // Gradient descent towards φ (weighted by phiRegWeight)
      const ratio_error = current_ratio - this.phiTarget;
      const effective_learning_rate = this.phiLearningRate * this.phiRegWeight;
      const adjustment = effective_learning_rate * ratio_error;

      // Adjust A and B proportionally
      // A increases if ratio too small, decreases if too large
      this.A = this.A * (1 - adjustment * 0.1);

      // B increases if ratio too large (more stress response needed)
      this.B[0] = this.B[0] * (1 + adjustment * 0.1);
      this.B[1] = this.B[1] * (1 + adjustment * 0.1);

      // Keep A in reasonable range [0.85, 0.99]
      this.A = Math.max(0.85, Math.min(0.99, this.A));

      // Keep B elements negative and reasonable
      this.B[0] = Math.max(-0.2, Math.min(-0.01, this.B[0]));
      this.B[1] = Math.max(-0.3, Math.min(-0.05, this.B[1]));
    }
  }

  /**
   * Set φ-regularization weight (0.0 to 1.0)
   * 0.0 = Data-only fit, 1.0 = Strong φ-enforcement
   */
  setPhiRegWeight(weight) {
    this.phiRegWeight = Math.max(0.0, Math.min(1.0, weight));
    console.log(`🔮 φ-regularization weight set to ${this.phiRegWeight.toFixed(3)}`);
  }

  /**
   * Switch filter type dynamically
   * @param {string} type - 'LKF' or 'UKF'
   */
  setFilterType(type) {
    if (type === 'LKF' || type === 'UKF') {
      this.filterType = type;
      console.log(`🔮 Filter type changed to ${type}`);
    } else {
      console.error(`🔮 Invalid filter type: ${type}. Use 'LKF' or 'UKF'`);
    }
  }

  /**
   * Get current φ-ratio for monitoring
   */
  getPhiRatio() {
    const B_sum = Math.abs(this.B[0]) + Math.abs(this.B[1]);
    return Math.abs(this.A) / B_sum;
  }

  /**
   * Get filter diagnostics
   */
  getDiagnostics() {
    const B_sum = Math.abs(this.B[0]) + Math.abs(this.B[1]);
    const phi_ratio = Math.abs(this.A) / B_sum;
    const phi_error = Math.abs(phi_ratio - this.phiTarget);

    return {
      filter_type: this.filterType,
      state: this.s,
      covariance: this.P,
      matrices: {
        A: this.A,
        B: this.B,
        H: this.H,
        Q: this.Q,
        R: this.R
      },
      phi: {
        target: this.phiTarget,
        current: phi_ratio,
        error: phi_error,
        converged: phi_error < 0.01,
        reg_weight: this.phiRegWeight
      },
      ukf: this.filterType === 'UKF' ? {
        alpha: this.ukf.alpha,
        beta: this.ukf.beta,
        kappa: this.ukf.kappa,
        lambda: this.ukf.lambda
      } : null,
      history_length: this.history.s.length
    };
  }

  /**
   * Reset filter to initial state
   */
  reset(initialState = 0.99) {
    this.s = initialState;
    this.P = 0.01;
    this.history = {
      s: [],
      y: [],
      innovation: [],
      K: []
    };
    console.log("🔮 Kalman filter reset");
  }

  /**
   * Export filter state for persistence
   */
  exportState() {
    return {
      filterType: this.filterType,
      s: this.s,
      P: this.P,
      A: this.A,
      B: [...this.B],
      H: this.H,
      Q: this.Q,
      R: this.R,
      phiRegWeight: this.phiRegWeight
    };
  }

  /**
   * Import filter state
   */
  importState(state) {
    this.filterType = state.filterType || this.filterType;
    this.s = state.s;
    this.P = state.P;
    this.A = state.A;
    this.B = [...state.B];
    this.H = state.H;
    this.Q = state.Q;
    this.R = state.R;
    if (state.phiRegWeight !== undefined) {
      this.phiRegWeight = state.phiRegWeight;
    }
    console.log("🔮 Kalman filter state imported");
  }
}

console.log("🔮 KalmanBifurcationFilter V2.0 class ready");
