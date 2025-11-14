/**
 * MMPA Visual Bridge
 *
 * Maps MMPA V2.0 predictions (Σ*, bifurcation risk, FIM attribution) to visual parameters.
 * This is where your mathematical framework drives the visual transitions.
 *
 * Core Idea:
 * - High Σ* (stable) = minimal movement, calm visuals
 * - Low Σ* (unstable) = approaching bifurcation, visuals start morphing
 * - Bifurcation point (risk > threshold) = dramatic visual transition
 * - FIM attribution = which visual parameters respond to which audio bands
 */

console.log("🌉 mmpaVisualBridge.js loaded");

export class MMPAVisualBridge {
  constructor(options = {}) {
    // === Configuration ===
    this.enabled = options.enabled !== false;

    // Bifurcation thresholds (when to trigger visual transitions)
    this.thresholds = {
      stable: 0.80,      // Σ* > 0.80 = stable (minimal visuals)
      unstable: 0.60,    // Σ* < 0.60 = unstable (morphing begins)
      chaotic: 0.40,     // Σ* < 0.40 = chaotic (intense transitions)
      bifurcation: 0.30  // Σ* < 0.30 = bifurcation point (state change)
    };

    // Visual state
    this.currentState = 'stable';  // stable, unstable, chaotic, transitioning
    this.transitionProgress = 0;   // 0-1 for smooth state transitions
    this.lastBifurcationTime = 0;  // Prevent rapid bifurcations
    this.bifurcationCooldown = 2000; // ms between bifurcations

    // Smoothed visual parameters (LQR-like smoothing)
    this.smoothedParams = {
      intensity: 0,       // Overall visual intensity
      morphSpeed: 0,      // Speed of morphing
      colorShift: 0,      // Color cycling speed
      warpAmount: 0,      // Spatial distortion
      complexity: 0       // Pattern complexity
    };

    // Smoothing coefficients (how fast visuals respond)
    this.smoothing = {
      fast: 0.1,    // Quick response (e.g., intensity)
      medium: 0.05, // Medium response (e.g., color)
      slow: 0.02    // Slow response (e.g., warp)
    };

    // Attribution weights (which audio bands affect which visuals)
    this.attributionWeights = {
      bass: { intensity: 0.8, warpAmount: 0.6, complexity: 0.2 },
      mid: { morphSpeed: 0.7, colorShift: 0.5, intensity: 0.3 },
      treble: { colorShift: 0.8, complexity: 0.7, morphSpeed: 0.3 }
    };

    console.log("🌉 MMPA Visual Bridge initialized");
  }

  /**
   * Main update function - called each frame
   * Takes MMPA data and returns visual parameters
   *
   * @param {Object} mmpaData - From AudioEngine.getMMPAData()
   * @returns {Object} - Visual parameters for shader uniforms
   */
  update(mmpaData) {
    if (!this.enabled || !mmpaData || !mmpaData.enabled) {
      return this.getDefaultParams();
    }

    // Extract MMPA metrics
    const sigmaStar = mmpaData.sigma_star || 0.95;
    const bifurcationRisk = mmpaData.bifurcation_risk || 0.05;
    const attribution = mmpaData.attribution;
    const predictions = mmpaData.predictions;

    // === Step 1: Determine visual state based on Σ* ===
    this.updateVisualState(sigmaStar, bifurcationRisk, predictions);

    // === Step 2: Calculate target visual parameters ===
    const targetParams = this.calculateTargetParams(sigmaStar, bifurcationRisk, attribution);

    // === Step 3: Smooth parameters (LQR-like control) ===
    this.smoothParams(targetParams);

    // === Step 4: Map to shader uniforms ===
    return this.mapToShaderUniforms();
  }

  /**
   * Update visual state machine based on stability
   */
  updateVisualState(sigmaStar, bifurcationRisk, predictions) {
    const now = Date.now();
    const timeSinceBifurcation = now - this.lastBifurcationTime;

    // State transitions based on Σ*
    if (sigmaStar > this.thresholds.stable) {
      this.currentState = 'stable';
      this.transitionProgress = 0;
    } else if (sigmaStar > this.thresholds.unstable) {
      this.currentState = 'unstable';
      // Transition progress increases as we approach unstable threshold
      this.transitionProgress = 1 - ((sigmaStar - this.thresholds.unstable) /
                                     (this.thresholds.stable - this.thresholds.unstable));
    } else if (sigmaStar > this.thresholds.chaotic) {
      this.currentState = 'chaotic';
      this.transitionProgress = 1 - ((sigmaStar - this.thresholds.chaotic) /
                                     (this.thresholds.unstable - this.thresholds.chaotic));
    } else {
      // Below chaotic threshold = bifurcation point
      if (timeSinceBifurcation > this.bifurcationCooldown) {
        this.currentState = 'transitioning';
        this.lastBifurcationTime = now;
        console.log("🎯 BIFURCATION DETECTED: Σ* =", sigmaStar.toFixed(3), "- Visual state transition triggered");
      }
    }

    // Use UKF prediction warnings for early response
    if (predictions && predictions.transitionWarning && sigmaStar > this.thresholds.chaotic) {
      // Start ramping up visuals before we hit the threshold (predictive)
      const predictionBoost = 0.3;
      this.transitionProgress = Math.min(1, this.transitionProgress + predictionBoost);
    }
  }

  /**
   * Calculate target visual parameters based on MMPA state
   */
  calculateTargetParams(sigmaStar, bifurcationRisk, attribution) {
    const target = {
      intensity: 0,
      morphSpeed: 0,
      colorShift: 0,
      warpAmount: 0,
      complexity: 0
    };

    // Base parameters on bifurcation risk (inverse of stability)
    // High risk = high visual intensity
    const riskFactor = Math.pow(bifurcationRisk, 0.7); // Power curve for more gradual ramp

    target.intensity = riskFactor * (0.5 + 0.5 * this.transitionProgress);
    target.morphSpeed = riskFactor * (0.3 + 0.7 * this.transitionProgress);
    target.warpAmount = riskFactor * this.transitionProgress;
    target.colorShift = Math.min(1, riskFactor * 2); // Color shifts more aggressively
    target.complexity = 0.3 + 0.7 * riskFactor; // More complex patterns as we approach bifurcation

    // State-specific overrides
    if (this.currentState === 'stable') {
      // Calm, minimal movement
      target.intensity *= 0.3;
      target.morphSpeed *= 0.2;
      target.warpAmount = 0;
    } else if (this.currentState === 'transitioning') {
      // Dramatic state change
      target.intensity = 1.0;
      target.morphSpeed = 1.0;
      target.warpAmount = Math.sin(Date.now() * 0.005) * 0.5 + 0.5; // Pulsing warp
      target.colorShift = 2.0; // Rapid color cycling
      target.complexity = 1.0;
    }

    // Apply force attribution (FIM) if available
    if (attribution && attribution.top_contributors && attribution.top_contributors.length > 0) {
      const dominant = attribution.top_contributors[0];
      const contribution = dominant.contribution || 0;

      // Map band names to attribution weights
      const bandMap = {
        'bass': 'bass',
        'mid': 'mid',
        'treble': 'treble',
        'Bass': 'bass',
        'Mid': 'mid',
        'Treble': 'treble'
      };

      const bandName = bandMap[dominant.name] || 'mid';
      const weights = this.attributionWeights[bandName];

      if (weights) {
        // Boost parameters based on which band is dominant
        target.intensity *= 1 + (weights.intensity * contribution);
        target.morphSpeed *= 1 + (weights.morphSpeed * contribution);
        target.colorShift *= 1 + (weights.colorShift * contribution);
        target.warpAmount *= 1 + (weights.warpAmount * contribution);
        target.complexity *= 1 + (weights.complexity * contribution);
      }
    }

    // Clamp all values to [0, 1] range
    for (const key in target) {
      target[key] = Math.max(0, Math.min(1, target[key]));
    }

    return target;
  }

  /**
   * Smooth parameters using exponential moving average (LQR-like)
   */
  smoothParams(targetParams) {
    // Fast response for intensity (tracks transients)
    this.smoothedParams.intensity +=
      (targetParams.intensity - this.smoothedParams.intensity) * this.smoothing.fast;

    // Medium response for morphing and color
    this.smoothedParams.morphSpeed +=
      (targetParams.morphSpeed - this.smoothedParams.morphSpeed) * this.smoothing.medium;
    this.smoothedParams.colorShift +=
      (targetParams.colorShift - this.smoothedParams.colorShift) * this.smoothing.medium;

    // Slow response for spatial warping (prevents jarring jumps)
    this.smoothedParams.warpAmount +=
      (targetParams.warpAmount - this.smoothedParams.warpAmount) * this.smoothing.slow;
    this.smoothedParams.complexity +=
      (targetParams.complexity - this.smoothedParams.complexity) * this.smoothing.slow;
  }

  /**
   * Map smoothed MMPA parameters to shader uniform values
   */
  mapToShaderUniforms() {
    return {
      // Direct mappings
      uPulseStrength: this.smoothedParams.intensity,
      uHighStrength: this.smoothedParams.intensity * 0.8,

      // Morphing/animation
      uShapeMorph: 0.5 + 0.5 * this.smoothedParams.morphSpeed,
      uColorDrive: this.smoothedParams.complexity * 2.0,

      // Color
      uColorShift: this.smoothedParams.colorShift * 10.0, // Scale for visible cycling

      // Spatial effects
      uPortalWarp: this.smoothedParams.warpAmount,
      uSphereScale: 1.0 - (this.smoothedParams.warpAmount * 0.5),

      // Feedback/echo effects
      uFeedback: this.smoothedParams.intensity * 0.6,
      uGlitch: this.currentState === 'transitioning' ? 0.5 : 0,

      // Inversion for dramatic state changes
      uInvert: this.currentState === 'transitioning' ? 1 : 0,

      // Metadata
      _mmpaState: this.currentState,
      _bifurcationRisk: this.smoothedParams.intensity,
      _transitionProgress: this.transitionProgress
    };
  }

  /**
   * Get default parameters (when MMPA is disabled or no data)
   */
  getDefaultParams() {
    return {
      uPulseStrength: 0,
      uHighStrength: 0,
      uShapeMorph: 0.5,
      uColorDrive: 0,
      uColorShift: 0,
      uPortalWarp: 0,
      uSphereScale: 1.0,
      uFeedback: 0,
      uGlitch: 0,
      uInvert: 0,
      _mmpaState: 'disabled',
      _bifurcationRisk: 0,
      _transitionProgress: 0
    };
  }

  /**
   * Set bifurcation thresholds (for tuning)
   */
  setThresholds(newThresholds) {
    Object.assign(this.thresholds, newThresholds);
    console.log("🌉 MMPA Visual Bridge thresholds updated:", this.thresholds);
  }

  /**
   * Get diagnostics
   */
  getDiagnostics() {
    return {
      enabled: this.enabled,
      currentState: this.currentState,
      transitionProgress: this.transitionProgress.toFixed(3),
      smoothedParams: {
        intensity: this.smoothedParams.intensity.toFixed(3),
        morphSpeed: this.smoothedParams.morphSpeed.toFixed(3),
        colorShift: this.smoothedParams.colorShift.toFixed(3),
        warpAmount: this.smoothedParams.warpAmount.toFixed(3),
        complexity: this.smoothedParams.complexity.toFixed(3)
      },
      thresholds: this.thresholds
    };
  }

  /**
   * Reset state
   */
  reset() {
    this.currentState = 'stable';
    this.transitionProgress = 0;
    this.lastBifurcationTime = 0;
    this.smoothedParams = {
      intensity: 0,
      morphSpeed: 0,
      colorShift: 0,
      warpAmount: 0,
      complexity: 0
    };
    console.log("🌉 MMPA Visual Bridge reset");
  }
}

console.log("✅ MMPAVisualBridge class ready");

export default MMPAVisualBridge;
