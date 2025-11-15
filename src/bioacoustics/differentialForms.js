// Differential Forms: Computation on Sp(2,ℝ)/Z₂
// Phase 2: Audio → Spectrogram → Differential Forms pipeline
// Mathematical framework for computing k-forms from bioacoustic data

import * as THREE from 'three';

console.log('📐 differentialForms.js loaded');

/**
 * Differential Forms Computer
 *
 * Mathematical Background:
 * - Differential k-forms are antisymmetric tensors: ω ∈ Ω^k(M)
 * - Exterior derivative: d: Ω^k → Ω^(k+1) with d² = 0
 * - For audio analysis: frequency → position, amplitude → momentum
 * - Symplectic form: ω = dp ∧ dq (fundamental 2-form)
 *
 * Pipeline:
 * Audio → FFT → Spectrogram → Phase Space → Differential Forms
 */
export class DifferentialFormsComputer {
  constructor() {
    console.log('📐 Initializing Differential Forms Computer...');

    // Spectrogram parameters
    this.fftSize = 2048;
    this.hopSize = 512;
    this.sampleRate = 44100;

    // Form degree (0=functions, 1=1-forms, 2=2-forms)
    this.formDegree = 2; // We work with 2-forms for symplectic structure

    // Storage for computed forms
    this.zeroForms = []; // Scalar functions (energy density)
    this.oneForms = [];  // 1-forms (momentum/position covectors)
    this.twoForms = [];  // 2-forms (symplectic area elements)

    // Time-frequency grid
    this.frequencyBins = this.fftSize / 2;
    this.timeFrames = 0;

    console.log('📐 Differential Forms Computer initialized');
  }

  /**
   * Convert audio spectrogram to differential forms
   * Maps frequency-amplitude space to phase space (p,q)
   *
   * @param {Float32Array} spectrogram - Time-frequency representation [time][freq]
   * @param {number} numFrames - Number of time frames
   * @returns {object} {zeroForms, oneForms, twoForms}
   */
  computeFormsFromSpectrogram(spectrogram, numFrames) {
    console.log(`📐 Computing differential forms from spectrogram (${numFrames} frames, ${this.frequencyBins} bins)`);

    this.timeFrames = numFrames;

    // Reset storage
    this.zeroForms = [];
    this.oneForms = [];
    this.twoForms = [];

    // Compute 0-forms (scalar energy density)
    this.computeZeroForms(spectrogram, numFrames);

    // Compute 1-forms (momentum and position covectors)
    this.computeOneForms(spectrogram, numFrames);

    // Compute 2-forms (symplectic area elements)
    this.computeTwoForms(spectrogram, numFrames);

    return {
      zeroForms: this.zeroForms,
      oneForms: this.oneForms,
      twoForms: this.twoForms,
      metadata: {
        timeFrames: this.timeFrames,
        frequencyBins: this.frequencyBins,
        sampleRate: this.sampleRate
      }
    };
  }

  /**
   * Compute 0-forms (scalar functions)
   * Energy density at each point in phase space
   *
   * @param {Float32Array} spectrogram
   * @param {number} numFrames
   */
  computeZeroForms(spectrogram, numFrames) {
    // 0-forms are just the magnitude values
    // E(t,f) = |S(t,f)|² (energy density)

    for (let t = 0; t < numFrames; t++) {
      const frame = [];
      for (let f = 0; f < this.frequencyBins; f++) {
        const idx = t * this.frequencyBins + f;
        const magnitude = spectrogram[idx] || 0;
        frame.push(magnitude * magnitude); // Energy = magnitude²
      }
      this.zeroForms.push(frame);
    }

    console.log(`📐 Computed ${this.zeroForms.length} 0-forms (energy density)`);
  }

  /**
   * Compute 1-forms (covectors)
   * Map frequency → position (q), amplitude → momentum (p)
   *
   * 1-forms are linear functionals: α(v) = ⟨α, v⟩
   * In coordinates: α = α_q dq + α_p dp
   *
   * @param {Float32Array} spectrogram
   * @param {number} numFrames
   */
  computeOneForms(spectrogram, numFrames) {
    // Compute gradients in phase space
    // ∂E/∂q (spatial derivative) and ∂E/∂p (momentum derivative)

    for (let t = 1; t < numFrames - 1; t++) {
      const frameOneForms = [];

      for (let f = 1; f < this.frequencyBins - 1; f++) {
        const idx = t * this.frequencyBins + f;
        const E = spectrogram[idx] || 0;

        // Position derivative (frequency direction)
        const E_next_f = spectrogram[idx + 1] || 0;
        const E_prev_f = spectrogram[idx - 1] || 0;
        const dE_dq = (E_next_f - E_prev_f) / 2;

        // Momentum derivative (time direction)
        const E_next_t = spectrogram[(t + 1) * this.frequencyBins + f] || 0;
        const E_prev_t = spectrogram[(t - 1) * this.frequencyBins + f] || 0;
        const dE_dp = (E_next_t - E_prev_t) / 2;

        // 1-form: α = dE_dq * dq + dE_dp * dp
        frameOneForms.push({
          q: dE_dq,  // Coefficient of dq
          p: dE_dp,  // Coefficient of dp
          frequency: f,
          time: t
        });
      }

      this.oneForms.push(frameOneForms);
    }

    console.log(`📐 Computed ${this.oneForms.length} frames of 1-forms`);
  }

  /**
   * Compute 2-forms (area elements)
   * The symplectic form ω = dp ∧ dq
   *
   * 2-forms are bilinear antisymmetric: ω(v,w) = -ω(w,v)
   * In phase space: ω = dp ∧ dq measures oriented area
   *
   * @param {Float32Array} spectrogram
   * @param {number} numFrames
   */
  computeTwoForms(spectrogram, numFrames) {
    // Compute the exterior derivative of 1-forms
    // dα = ∂α_p/∂q - ∂α_q/∂p (wedge product)

    for (let t = 1; t < this.oneForms.length - 1; t++) {
      const frameTwoForms = [];

      if (!this.oneForms[t]) continue;

      for (let i = 1; i < this.oneForms[t].length - 1; i++) {
        const oneForm = this.oneForms[t][i];

        // Get neighboring 1-forms for derivatives
        const oneForm_next_q = this.oneForms[t][i + 1] || oneForm;
        const oneForm_prev_q = this.oneForms[t][i - 1] || oneForm;
        const oneForm_next_p = this.oneForms[t + 1]?.[i] || oneForm;
        const oneForm_prev_p = this.oneForms[t - 1]?.[i] || oneForm;

        // Compute exterior derivative: dα = (∂α_p/∂q - ∂α_q/∂p) dq ∧ dp
        const dAlpha_p_dq = (oneForm_next_q.p - oneForm_prev_q.p) / 2;
        const dAlpha_q_dp = (oneForm_next_p.q - oneForm_prev_p.q) / 2;

        const twoFormValue = dAlpha_p_dq - dAlpha_q_dp;

        frameTwoForms.push({
          value: twoFormValue,  // Coefficient of dq ∧ dp
          frequency: oneForm.frequency,
          time: oneForm.time
        });
      }

      this.twoForms.push(frameTwoForms);
    }

    console.log(`📐 Computed ${this.twoForms.length} frames of 2-forms`);
  }

  /**
   * Exterior derivative: d: Ω^k → Ω^(k+1)
   * Fundamental operator in differential geometry
   * Satisfies: d² = 0 (nilpotency)
   *
   * @param {Array} kForms - Array of k-forms
   * @param {number} degree - Current form degree
   * @returns {Array} (k+1)-forms
   */
  exteriorDerivative(kForms, degree) {
    if (degree === 0) {
      // d(0-form) = 1-form (gradient)
      return this.gradientOperator(kForms);
    } else if (degree === 1) {
      // d(1-form) = 2-form (curl in 2D)
      return this.curlOperator(kForms);
    } else {
      // d(2-form) = 0 in 2D phase space
      console.log('📐 d² = 0: exterior derivative of 2-form vanishes');
      return [];
    }
  }

  /**
   * Gradient operator (exterior derivative of 0-forms)
   */
  gradientOperator(scalarField) {
    console.log('📐 Computing gradient (d: Ω⁰ → Ω¹)');
    // Already computed in computeOneForms
    return this.oneForms;
  }

  /**
   * Curl operator (exterior derivative of 1-forms)
   */
  curlOperator(oneFormsField) {
    console.log('📐 Computing curl (d: Ω¹ → Ω²)');
    // Already computed in computeTwoForms
    return this.twoForms;
  }

  /**
   * Wedge product: α ∧ β
   * Antisymmetric tensor product of differential forms
   *
   * @param {object} form1 - First form
   * @param {object} form2 - Second form
   * @returns {number} Wedge product value
   */
  wedgeProduct(form1, form2) {
    // For 1-forms: (a dq + b dp) ∧ (c dq + d dp) = (ad - bc) dq ∧ dp
    if (form1.q !== undefined && form2.q !== undefined) {
      return form1.q * form2.p - form1.p * form2.q;
    }
    return 0;
  }

  /**
   * Hodge star operator: *: Ω^k → Ω^(n-k)
   * Maps k-forms to (n-k)-forms using metric
   * In 2D phase space: *dq = dp, *dp = -dq, *(dq∧dp) = 1
   *
   * @param {object} form - Differential form
   * @param {number} degree - Form degree
   * @returns {object} Hodge dual
   */
  hodgeStar(form, degree) {
    if (degree === 1) {
      // *: Ω¹ → Ω¹ (90° rotation)
      return {
        q: form.p,   // *dq = dp
        p: -form.q,  // *dp = -dq
        frequency: form.frequency,
        time: form.time
      };
    } else if (degree === 2) {
      // *: Ω² → Ω⁰ (area to function)
      return form.value;
    }
    return form;
  }

  /**
   * Pullback: Maps forms from one manifold to another
   * F*: Ω^k(N) → Ω^k(M) via map F: M → N
   *
   * Used for comparing forms between different species
   *
   * @param {object} form - Form on target manifold
   * @param {Function} map - Coordinate transformation F
   * @returns {object} Pulled-back form
   */
  pullback(form, map) {
    console.log('📐 Computing pullback F*ω');

    // Validate inputs
    if (!form || !map) {
      console.warn('📐 Invalid pullback inputs');
      return form;
    }

    // For 0-forms (scalar functions): (F*f)(x) = f(F(x))
    if (form.degree === 0) {
      const pulledBack = [];
      for (let t = 0; t < this.timeFrames; t++) {
        const frame = [];
        for (let f = 0; f < this.frequencyBins; f++) {
          // Apply map to coordinates
          const mapped = map(t, f);
          const tMapped = Math.floor(mapped.t);
          const fMapped = Math.floor(mapped.f);

          // Sample form at mapped coordinates (with bounds checking)
          if (tMapped >= 0 && tMapped < this.zeroForms.length &&
              fMapped >= 0 && fMapped < this.frequencyBins) {
            frame.push(this.zeroForms[tMapped][fMapped]);
          } else {
            frame.push(0); // Outside domain
          }
        }
        pulledBack.push(frame);
      }

      return {
        degree: 0,
        data: pulledBack,
        type: 'pullback'
      };
    }

    // For 1-forms: F*ω = (∂F/∂x) · ω(F(x))
    // ω = α_q dq + α_p dp
    // F*ω = (∂F^q/∂x α_q + ∂F^p/∂x α_p) dx
    if (form.degree === 1) {
      const pulledBack = [];
      const epsilon = 1e-6; // For numerical derivatives

      for (let t = 1; t < this.timeFrames - 1; t++) {
        const frame = [];
        for (let f = 1; f < this.frequencyBins - 1; f++) {
          // Compute Jacobian ∂F/∂x numerically
          const F_center = map(t, f);
          const F_dt = map(t + epsilon, f);
          const F_df = map(t, f + epsilon);

          const dFq_dt = (F_dt.t - F_center.t) / epsilon;
          const dFq_df = (F_df.t - F_center.t) / epsilon;
          const dFp_dt = (F_dt.f - F_center.f) / epsilon;
          const dFp_df = (F_df.f - F_center.f) / epsilon;

          // Sample 1-form at mapped point
          const tMapped = Math.floor(F_center.t);
          const fMapped = Math.floor(F_center.f);

          let alpha_q = 0, alpha_p = 0;
          if (tMapped >= 0 && tMapped < this.oneForms.length &&
              fMapped >= 0 && fMapped < this.frequencyBins) {
            const oneFormIdx = tMapped * this.frequencyBins + fMapped;
            if (this.oneForms[tMapped] && this.oneForms[tMapped][fMapped]) {
              alpha_q = this.oneForms[tMapped][fMapped].q || 0;
              alpha_p = this.oneForms[tMapped][fMapped].p || 0;
            }
          }

          // Pullback: F*ω components
          const pulledback_q = dFq_dt * alpha_q + dFp_dt * alpha_p;
          const pulledback_p = dFq_df * alpha_q + dFp_df * alpha_p;

          frame.push({
            q: pulledback_q,
            p: pulledback_p,
            frequency: f,
            time: t
          });
        }
        pulledBack.push(frame);
      }

      return {
        degree: 1,
        data: pulledBack,
        type: 'pullback'
      };
    }

    // For 2-forms: F*ω = det(∂F/∂x) ω(F(x))
    // Since we're in 2D phase space, this is the Jacobian determinant times the form
    if (form.degree === 2) {
      const pulledBack = [];
      const epsilon = 1e-6;

      for (let t = 1; t < this.timeFrames - 1; t++) {
        const frame = [];
        for (let f = 1; f < this.frequencyBins - 1; f++) {
          // Compute Jacobian determinant
          const F_center = map(t, f);
          const F_dt = map(t + epsilon, f);
          const F_df = map(t, f + epsilon);

          const dFq_dt = (F_dt.t - F_center.t) / epsilon;
          const dFq_df = (F_df.t - F_center.t) / epsilon;
          const dFp_dt = (F_dt.f - F_center.f) / epsilon;
          const dFp_df = (F_df.f - F_center.f) / epsilon;

          const jacobianDet = dFq_dt * dFp_df - dFq_df * dFp_dt;

          // Sample 2-form at mapped point
          const tMapped = Math.floor(F_center.t);
          const fMapped = Math.floor(F_center.f);

          let omega_value = 0;
          if (tMapped >= 0 && tMapped < this.twoForms.length &&
              fMapped >= 0 && fMapped < this.frequencyBins) {
            if (this.twoForms[tMapped] && this.twoForms[tMapped][fMapped]) {
              omega_value = this.twoForms[tMapped][fMapped];
            }
          }

          // Pullback: det(J) × ω
          frame.push(jacobianDet * omega_value);
        }
        pulledBack.push(frame);
      }

      return {
        degree: 2,
        data: pulledBack,
        type: 'pullback'
      };
    }

    // Unknown degree
    console.warn(`📐 Pullback not implemented for degree ${form.degree}`);
    return form;
  }

  /**
   * Get current form state for visualization
   */
  getFormState() {
    return {
      zeroFormsCount: this.zeroForms.length,
      oneFormsCount: this.oneForms.length,
      twoFormsCount: this.twoForms.length,
      timeFrames: this.timeFrames,
      frequencyBins: this.frequencyBins
    };
  }
}

console.log('📐 Differential Forms module ready');
