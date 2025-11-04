/**
 * MMPA Framework V2.0: Unscented Kalman Filter for Bifurcation Prediction
 *
 * Implements an Unscented Kalman Filter (UKF) to predict bifurcation (regime change)
 * by estimating the unobservable "distance to bifurcation" (Σ*) from
 * observable core stability (ΣC) and dynamic stress inputs.
 *
 * Key Innovation: φ-Regularization (Golden Ratio Optimal Disharmony)
 * The filter includes a tunable regularization term that penalizes deviation from
 * the golden ratio constraint: |A| / Σ|B| ≈ φ (1.618...)
 * This enforces the most non-resonant balance between memory and stress response.
 *
 * V2.0 Enhancements:
 * - Unscented Transform with sigma points (α=0.1, β=2, κ=0)
 * - Non-linear dynamics via Math.tanh()
 * - φ-constraint as tunable regularization (not hard enforcement)
 */

console.log("🔮 kalmanBifurcationFilter.js V2.0 (UKF) loaded");

const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio ≈ 1.618

export class KalmanBifurcationFilter {
  constructor(options = {}) {
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

    // === UKF Sigma Point Parameters (V2.0) ===
    this.alpha = options.alpha || 0.1;    // Spread of sigma points (0 < α ≤ 1)
    this.beta = options.beta || 2;        // Prior knowledge of distribution (β=2 optimal for Gaussian)
    this.kappa = options.kappa || 0;      // Secondary scaling parameter
    this.n = 1;                           // State dimension (scalar Σ*)

    // Derived scaling parameters
    this.lambda = this.alpha * this.alpha * (this.n + this.kappa) - this.n;
    this.gamma = Math.sqrt(this.n + this.lambda);

    // Sigma point weights
    this.Wm = new Array(2 * this.n + 1);  // Weights for mean
    this.Wc = new Array(2 * this.n + 1);  // Weights for covariance
    this.Wm[0] = this.lambda / (this.n + this.lambda);
    this.Wc[0] = this.lambda / (this.n + this.lambda) + (1 - this.alpha * this.alpha + this.beta);
    for (let i = 1; i <= 2 * this.n; i++) {
      this.Wm[i] = 1 / (2 * (this.n + this.lambda));
      this.Wc[i] = 1 / (2 * (this.n + this.lambda));
    }

    // === φ-Regularization Parameters (V2.0) ===
    this.phiTarget = PHI;
    this.phiRegWeight = options.phiRegWeight || 0.1; // Tunable regularization strength
    this.enablePhiRegularization = options.enablePhiRegularization !== false;

    // History for learning/optimization
    this.history = {
      s: [],           // Σ*(t) predictions
      y: [],           // ΣC(t) observations
      innovation: [],  // Prediction errors
      K: []            // Kalman gains
    };

    console.log("🔮 UKF Bifurcation Filter initialized (V2.0)");
    console.log(`   A = ${this.A.toFixed(4)} (memory)`);
    console.log(`   B = [${this.B.map(b => b.toFixed(4)).join(', ')}] (stress)`);
    console.log(`   UKF: α=${this.alpha}, β=${this.beta}, κ=${this.kappa}`);
    console.log(`   φ-regularization: ${this.enablePhiRegularization ? 'ENABLED (weight=' + this.phiRegWeight + ')' : 'DISABLED'}`);
  }

  /**
   * Generate sigma points for Unscented Transform
   * For scalar state (n=1), generates 3 sigma points:
   * χ₀ = x (mean)
   * χ₁ = x + γ√P
   * χ₂ = x - γ√P
   *
   * @param {number} x - State mean
   * @param {number} P - State covariance
   * @returns {Array} - Array of 3 sigma points
   */
  generateSigmaPoints(x, P) {
    const sigmaPoints = new Array(2 * this.n + 1);

    // χ₀ = x (center point)
    sigmaPoints[0] = x;

    // χ₁ = x + γ√P
    sigmaPoints[1] = x + this.gamma * Math.sqrt(P);

    // χ₂ = x - γ√P
    sigmaPoints[2] = x - this.gamma * Math.sqrt(P);

    return sigmaPoints;
  }

  /**
   * Non-linear state transition function (V2.0)
   * f(s, u) = tanh(A * s + B · u)
   *
   * This enforces s ∈ (-1, 1) naturally via tanh saturation
   *
   * @param {number} s - Current state Σ*
   * @param {Array} u - Control inputs [Trans_sm, Res]
   * @returns {number} - Next state
   */
  stateTransitionFunction(s, u) {
    const [trans_sm, res] = u;
    const control_effect = this.B[0] * trans_sm + this.B[1] * res;
    const linear_pred = this.A * s + control_effect;

    // Apply tanh non-linearity for soft saturation
    return Math.tanh(linear_pred);
  }

  /**
   * Non-linear observation function (V2.0)
   * h(s) = tanh(H * s)
   *
   * Maps latent Σ* to observable ΣC with saturation
   *
   * @param {number} s - State Σ*
   * @returns {number} - Observation ΣC
   */
  observationFunction(s) {
    return Math.tanh(this.H * s);
  }

  /**
   * UKF Prediction Step: Project state and covariance forward using sigma points
   *
   * 1. Generate sigma points χᵢ from current state
   * 2. Propagate each through non-linear dynamics: Yᵢ = f(χᵢ, u)
   * 3. Compute predicted mean: s_pred = Σ Wᵢᵐ Yᵢ
   * 4. Compute predicted covariance: P_pred = Σ Wᵢᶜ (Yᵢ - s_pred)(Yᵢ - s_pred)ᵀ + Q
   *
   * @param {Array} u_t - Control inputs [Trans_sm, Res]
   * @returns {Object} { s_pred, P_pred, sigmaPoints_pred }
   */
  predict(u_t) {
    // Step 1: Generate sigma points from current state
    const sigmaPoints = this.generateSigmaPoints(this.s, this.P);

    // Step 2: Propagate sigma points through non-linear state transition
    const sigmaPoints_pred = sigmaPoints.map(chi =>
      this.stateTransitionFunction(chi, u_t)
    );

    // Step 3: Compute predicted state (weighted mean)
    let s_pred = 0;
    for (let i = 0; i < sigmaPoints_pred.length; i++) {
      s_pred += this.Wm[i] * sigmaPoints_pred[i];
    }

    // Step 4: Compute predicted covariance
    let P_pred = 0;
    for (let i = 0; i < sigmaPoints_pred.length; i++) {
      const diff = sigmaPoints_pred[i] - s_pred;
      P_pred += this.Wc[i] * diff * diff;
    }
    P_pred += this.Q; // Add process noise

    return { s_pred, P_pred, sigmaPoints_pred };
  }

  /**
   * UKF Update Step: Correct prediction with observation using sigma points
   *
   * 1. Generate sigma points from predicted state
   * 2. Propagate through observation function: Zᵢ = h(Yᵢ)
   * 3. Compute predicted observation: z_pred = Σ Wᵢᵐ Zᵢ
   * 4. Compute innovation covariance and cross-covariance
   * 5. Compute Kalman gain and update state
   *
   * @param {number} s_pred - Predicted state
   * @param {number} P_pred - Predicted covariance
   * @param {number} y_t - Actual observation
   * @param {Array} sigmaPoints_pred - Predicted sigma points from predict()
   * @returns {Object} { s, P, K, innovation }
   */
  update(s_pred, P_pred, y_t, sigmaPoints_pred) {
    // Step 1: Propagate predicted sigma points through observation function
    const sigmaPoints_obs = sigmaPoints_pred.map(chi =>
      this.observationFunction(chi)
    );

    // Step 2: Compute predicted observation (weighted mean)
    let z_pred = 0;
    for (let i = 0; i < sigmaPoints_obs.length; i++) {
      z_pred += this.Wm[i] * sigmaPoints_obs[i];
    }

    // Step 3: Compute innovation covariance Pzz
    let Pzz = 0;
    for (let i = 0; i < sigmaPoints_obs.length; i++) {
      const diff = sigmaPoints_obs[i] - z_pred;
      Pzz += this.Wc[i] * diff * diff;
    }
    Pzz += this.R; // Add measurement noise

    // Step 4: Compute cross-covariance Pxz
    let Pxz = 0;
    for (let i = 0; i < sigmaPoints_pred.length; i++) {
      const diff_x = sigmaPoints_pred[i] - s_pred;
      const diff_z = sigmaPoints_obs[i] - z_pred;
      Pxz += this.Wc[i] * diff_x * diff_z;
    }

    // Step 5: Compute Kalman gain
    const K = Pxz / Pzz;

    // Step 6: Calculate innovation
    const innovation = y_t - z_pred;

    // Step 7: Update state
    let s_new = s_pred + K * innovation;
    // Note: tanh already saturates, but we'll still clamp for safety
    s_new = Math.max(-0.999, Math.min(0.999, s_new));

    // Step 8: Update covariance
    const P_new = P_pred - K * Pzz * K;

    return { s: s_new, P: P_new, K, innovation };
  }

  /**
   * Full UKF cycle: Predict + Update
   * @param {Array} u_t - Control inputs [Trans_sm, Res]
   * @param {number} y_t - Observation (ΣC)
   * @returns {Object} { sigma_star, sigma_c, innovation, confidence, phi_deviation, loss }
   */
  step(u_t, y_t) {
    // UKF Prediction
    const { s_pred, P_pred, sigmaPoints_pred } = this.predict(u_t);

    // UKF Update
    const { s, P, K, innovation } = this.update(s_pred, P_pred, y_t, sigmaPoints_pred);

    // Store state
    this.s = s;
    this.P = P;

    // Log to history (keep last 100 samples)
    this.history.s.push(s);
    this.history.y.push(y_t);
    this.history.innovation.push(innovation);
    this.history.K.push(K);

    if (this.history.s.length > 100) {
      this.history.s.shift();
      this.history.y.shift();
      this.history.innovation.shift();
      this.history.K.shift();
    }

    // Compute φ-deviation for regularization
    const phi_deviation = this.computePhiDeviation();

    // Compute total loss (MSE + φ-regularization)
    const mse = innovation * innovation;
    const loss = mse + (this.phiRegWeight * phi_deviation * phi_deviation);

    return {
      sigma_star: s,              // Σ*(t) - Latent bifurcation distance
      sigma_c: y_t,               // ΣC(t) - Observable core stability
      innovation: innovation,     // Prediction error
      kalman_gain: K,             // Filter confidence
      confidence: 1 - P,          // State certainty (inverse of covariance)
      bifurcation_risk: 1 - s,    // Risk of regime change (0-1)
      phi_deviation: phi_deviation, // φ-ratio deviation from target
      loss: loss                  // Total loss (MSE + regularization)
    };
  }

  /**
   * Compute φ-deviation for regularization (V2.0)
   * Returns: |current_ratio - φ|
   *
   * This is used as a penalty term in the loss function rather than
   * actively adjusting parameters (soft constraint vs hard constraint).
   *
   * @returns {number} - Absolute deviation from golden ratio
   */
  computePhiDeviation() {
    if (!this.enablePhiRegularization) return 0;

    // Current ratio: |A| / Σ|B|
    const B_sum = Math.abs(this.B[0]) + Math.abs(this.B[1]);
    const current_ratio = Math.abs(this.A) / B_sum;

    // Deviation from φ
    return Math.abs(current_ratio - this.phiTarget);
  }

  /**
   * Get current φ-ratio for monitoring
   */
  getPhiRatio() {
    const B_sum = Math.abs(this.B[0]) + Math.abs(this.B[1]);
    return Math.abs(this.A) / B_sum;
  }

  /**
   * Get filter diagnostics (V2.0)
   */
  getDiagnostics() {
    const B_sum = Math.abs(this.B[0]) + Math.abs(this.B[1]);
    const phi_ratio = Math.abs(this.A) / B_sum;
    const phi_deviation = Math.abs(phi_ratio - this.phiTarget);

    return {
      version: '2.0-UKF',
      state: this.s,
      covariance: this.P,
      matrices: {
        A: this.A,
        B: this.B,
        H: this.H,
        Q: this.Q,
        R: this.R
      },
      ukf_params: {
        alpha: this.alpha,
        beta: this.beta,
        kappa: this.kappa,
        lambda: this.lambda,
        gamma: this.gamma
      },
      phi_regularization: {
        enabled: this.enablePhiRegularization,
        weight: this.phiRegWeight,
        target: this.phiTarget,
        current_ratio: phi_ratio,
        deviation: phi_deviation,
        within_tolerance: phi_deviation < 0.05
      },
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
      s: this.s,
      P: this.P,
      A: this.A,
      B: [...this.B],
      H: this.H,
      Q: this.Q,
      R: this.R
    };
  }

  /**
   * Import filter state
   */
  importState(state) {
    this.s = state.s;
    this.P = state.P;
    this.A = state.A;
    this.B = [...state.B];
    this.H = state.H;
    this.Q = state.Q;
    this.R = state.R;
    console.log("🔮 Kalman filter state imported");
  }
}

console.log("🔮 KalmanBifurcationFilter class ready");
