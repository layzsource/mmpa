/**
 * 🧬 Chronelix-MMPA Integrator
 *
 * "Bibibinary" Foundation - Dual-domain synchronicity visualizer
 * Integrates Audio MMPA + Optical MMPA → Chronelix waveguide modulation
 *
 * Mathematical Foundation:
 * - Euler's Formula: e^(iθ) = cos(θ) + i·sin(θ) — Complex rotations in polar form
 * - De Moivre's Theorem: (cos(θ) + i·sin(θ))^n = cos(nθ) + i·sin(nθ) — Power operations
 *
 * Visual Yantra: Greek symbols (λ, φ) + Latin incantations (pattern names)
 * Chiral/Polar Synchronicity: Audio (AM/teal) vs Optical (PM/violet) spiral dance
 *
 * Data Flow:
 *   state.mmpaFeatures (Audio MMPA) ──┐
 *                                      ├──> Bibibinary Processor ──> Chronelix Modulation
 *   state.opticalMMPAFeatures      ──┘
 */

import { state } from './state.js';
import { phaseSpace } from './chronelixPhaseSpace.js';
import { particleStream } from './chronelixParticleStream.js';
import { gateAnalysis } from './chronelixGateAnalysis.js';
import { phaseTransitionDetector } from './chronelixPhaseTransition.js';
import { trajectoryPlotter } from './chronelixTrajectoryPlotter.js';
import { waveletDecomposition } from './chronelixWaveletDecomposition.js';
import { patternCodegen } from './chronelixPatternCodegen.js';
import { waveformVisualizer } from './chronelixWaveformVisualizer.js';
import { cylindricalSlicer } from './chronelixCylindricalSlicer.js';

console.log("🧬 chronelixMMPAIntegrator.js loaded");

export class ChronelixMMPAIntegrator {
  constructor() {
    this.enabled = false;
    this.chronelixGroup = null;
    this.lambdaMeshTop = null;
    this.lambdaMeshBottom = null;
    this.amChain = null;
    this.pmChain = null;

    // Expose phase space singleton for chart access
    this.phaseSpace = phaseSpace;

    // Bibibinary state
    this.audioPhase = 0;      // Audio domain phase (θ_audio)
    this.opticalPhase = 0;    // Optical domain phase (θ_optical)
    this.synchronicity = 0;   // Correlation between domains (0-1)
    this.chirality = 0;       // Handedness measure (-1 to +1)

    // Lambda modulation (automatic, driven by MMPA forces)
    this.lambdaRotation = 0;  // Current λ rotation (0 to 2π)
    this.lambdaVelocity = 0;  // Rate of λ rotation (rad/s)

    // Yantra state (visual pattern library)
    this.currentYantra = {
      audioPattern: 'unknown',
      opticalPattern: 'unknown',
      synchronicityPattern: 'independent',
      complexRotation: { real: 1, imag: 0 } // e^(iθ) representation
    };

    console.log("🧬 ChronelixMMPAIntegrator initialized");
  }

  /**
   * Connect to chronelix visualization in TimelinePlaybackPanel
   * @param {TimelinePlaybackPanel} playbackPanel - Panel instance with chronelix
   */
  connect(playbackPanel) {
    if (!playbackPanel || !playbackPanel.chronelixGroup) {
      console.warn("⚠️ Cannot connect: No chronelix visualization available");
      return false;
    }

    this.chronelixGroup = playbackPanel.chronelixGroup;
    this.lambdaMeshTop = playbackPanel.lambdaMeshTop;
    this.lambdaMeshBottom = playbackPanel.lambdaMeshBottom;

    // Find AM and PM chains in the chronelix group
    this.chronelixGroup.children.forEach(child => {
      if (child.children && child.children.length > 0) {
        const firstMesh = child.children[0];
        if (firstMesh.userData?.chain === 'AM') {
          this.amChain = child;
        } else if (firstMesh.userData?.chain === 'PM') {
          this.pmChain = child;
        }
      }
    });

    // Initialize particle stream with chronelix constants and scene
    if (playbackPanel.CHRONELIX_CONSTANTS && playbackPanel.scene) {
      particleStream.init(playbackPanel.CHRONELIX_CONSTANTS, playbackPanel.scene);
      gateAnalysis.init(playbackPanel.CHRONELIX_CONSTANTS, playbackPanel.scene);
      trajectoryPlotter.init(playbackPanel.scene);
      waveformVisualizer.init(playbackPanel.scene);
      cylindricalSlicer.init(playbackPanel.CHRONELIX_CONSTANTS, playbackPanel.scene);
      console.log("⚛️ Particle stream, gates, trajectory plotter, waveform visualizer, and cylindrical slicer initialized");
    } else {
      console.warn("⚠️ Missing chronelix constants or scene for particle stream initialization");
    }

    console.log("🧬 Chronelix-MMPA integrator connected", {
      hasLambdaTop: !!this.lambdaMeshTop,
      hasLambdaBottom: !!this.lambdaMeshBottom,
      hasAMChain: !!this.amChain,
      hasPMChain: !!this.pmChain
    });

    this.enabled = true;
    return true;
  }

  /**
   * Disconnect from chronelix
   */
  disconnect() {
    this.chronelixGroup = null;
    this.lambdaMeshTop = null;
    this.lambdaMeshBottom = null;
    this.amChain = null;
    this.pmChain = null;
    this.enabled = false;

    console.log("🧬 Chronelix-MMPA integrator disconnected");
  }

  /**
   * Main update loop - called each animation frame
   * Processes bibibinary MMPA data and modulates chronelix
   */
  update(deltaTime = 0.016) {
    if (!this.enabled || !this.chronelixGroup) return;

    // 1. Read MMPA features from both domains
    const audioMMPA = state.mmpaFeatures;
    const opticalMMPA = state.opticalMMPAFeatures;

    // Verify both domains are active
    const audioActive = audioMMPA?.enabled || false;
    const opticalActive = opticalMMPA?.enabled || false;

    if (!audioActive && !opticalActive) {
      // No data - return to neutral state
      return;
    }

    // 2. Extract forces for bibibinary processing
    const bibibinary = this.processBibibinary(audioMMPA, opticalMMPA);

    // 3. Update phase space with 12D state vector
    phaseSpace.update(audioMMPA, opticalMMPA, deltaTime);

    // 4. Update wavelet decomposition (multi-scale temporal analysis)
    waveletDecomposition.update(audioMMPA, opticalMMPA);

    // 5. Update waveform visualizer (sine/cosine from unit circle)
    waveformVisualizer.update(deltaTime, phaseSpace.state);

    // 6. Update particle stream (emit, update positions, update visuals)
    particleStream.update(deltaTime, phaseSpace.state);

    // 6.5. Update cylindrical slicer (lambda-driven slice angle, intersection detection)
    cylindricalSlicer.update(this.lambdaRotation, particleStream.particles);

    // 7. Analyze particles through 12 gates
    const gateStats = gateAnalysis.analyzeStream(particleStream.particles);

    // 8. Detect phase transitions
    phaseTransitionDetector.update(phaseSpace, deltaTime);

    // 9. Plot 3D trajectory
    trajectoryPlotter.update(particleStream.particles, phaseSpace, deltaTime);

    // 10. Generate patterns from analysis
    const transitions = phaseTransitionDetector.getRecentTransitions(1);
    if (transitions.length > 0) {
      patternCodegen.analyzePhaseTransition(transitions[0], phaseSpace);
    }
    if (gateStats.totalParticles > 0) {
      patternCodegen.analyzeGateSequence(gateStats);
    }
    const waveletTransition = waveletDecomposition.detectScaleTransition();
    if (waveletTransition.isTransient || waveletTransition.isTrending) {
      patternCodegen.analyzeWaveletSignature(waveletDecomposition);
    }
    if (phaseSpace.attractorType && phaseSpace.attractorType !== 'unknown') {
      patternCodegen.analyzeAttractor(phaseSpace);
    }

    // 11. Calculate complex rotations using Euler's formula
    const complexRotation = this.calculateComplexRotation(bibibinary);

    // 12. Calculate chiral synchronicity (AM vs PM spiral relationship)
    const chirality = this.calculateChirality(bibibinary);

    // 13. Update lambda modulation
    this.updateLambdaModulation(bibibinary, deltaTime);

    // 14. Modulate AM chain (audio/input/teal)
    this.modulateAMChain(bibibinary.audio);

    // 15. Modulate PM chain (optical/output/violet)
    this.modulatePMChain(bibibinary.optical);

    // 16. Update yantra (visual pattern recognition)
    this.updateYantra(bibibinary, complexRotation, chirality);
  }

  /**
   * Process bibibinary MMPA data from both domains
   * Extracts parallel forces for synchronized modulation
   */
  processBibibinary(audioMMPA, opticalMMPA) {
    const audioActive = audioMMPA?.enabled || false;
    const opticalActive = opticalMMPA?.enabled || false;

    // Audio domain forces
    const audio = {
      active: audioActive,
      identity: audioActive ? (audioMMPA.identity?.strength || 0) : 0,
      relationship: audioActive ? (audioMMPA.relationship?.consonance || 0) : 0,
      complexity: audioActive ? (audioMMPA.complexity?.spectralEntropy || 0) : 0,
      transformation: audioActive ? (audioMMPA.transformation?.flux || 0) : 0,
      alignment: audioActive ? (audioMMPA.alignment?.coherence || 0) : 0,
      potential: audioActive ? (audioMMPA.potential?.entropy || 0) : 0
    };

    // Optical domain forces
    const optical = {
      active: opticalActive,
      identity: opticalActive ? (opticalMMPA.identity?.brightness || 0) : 0,
      relationship: opticalActive ? (opticalMMPA.relationship?.harmony || 0) : 0,
      complexity: opticalActive ? (opticalMMPA.complexity?.edgeDensity || 0) : 0,
      transformation: opticalActive ? (opticalMMPA.transformation?.flux || 0) : 0,
      alignment: opticalActive ? (opticalMMPA.alignment?.symmetry || 0) : 0,
      potential: opticalActive ? (opticalMMPA.potential?.entropy || 0) : 0
    };

    // Calculate synchronicity (correlation between domains)
    let synchronicity = 0;
    if (audioActive && opticalActive) {
      // Average correlation across all 6 forces
      const correlations = [
        this.correlate(audio.identity, optical.identity),
        this.correlate(audio.relationship, optical.relationship),
        this.correlate(audio.complexity, optical.complexity),
        this.correlate(audio.transformation, optical.transformation),
        this.correlate(audio.alignment, optical.alignment),
        this.correlate(audio.potential, optical.potential)
      ];
      synchronicity = correlations.reduce((sum, c) => sum + c, 0) / correlations.length;
    }

    return {
      audio,
      optical,
      synchronicity,
      bothActive: audioActive && opticalActive
    };
  }

  /**
   * Calculate correlation between two values (0-1)
   * High values in both = high correlation
   * Similar magnitudes = high correlation
   */
  correlate(a, b) {
    // Normalized product (both high → 1, both low → 1, one high one low → 0)
    const product = a * b;
    const difference = Math.abs(a - b);
    return product * (1 - difference);
  }

  /**
   * Calculate complex rotation using Euler's formula
   * e^(iθ) = cos(θ) + i·sin(θ)
   *
   * θ is derived from MMPA transformation forces
   */
  calculateComplexRotation(bibibinary) {
    const { audio, optical, synchronicity } = bibibinary;

    // Phase angles from transformation forces
    this.audioPhase = audio.transformation * Math.PI * 2; // 0 to 2π
    this.opticalPhase = optical.transformation * Math.PI * 2;

    // Combined phase (weighted by synchronicity)
    const combinedPhase = synchronicity > 0.5
      ? (this.audioPhase + this.opticalPhase) / 2  // High sync: average
      : this.audioPhase + this.opticalPhase;        // Low sync: sum (faster rotation)

    // Euler's formula: e^(iθ) = cos(θ) + i·sin(θ)
    const complexRotation = {
      real: Math.cos(combinedPhase),      // Real part
      imag: Math.sin(combinedPhase),      // Imaginary part
      magnitude: 1,                        // Always 1 for unit circle
      phase: combinedPhase                 // Phase angle θ
    };

    return complexRotation;
  }

  /**
   * Calculate chirality (handedness) from audio vs optical relationship
   * Positive = right-handed (audio leads), Negative = left-handed (optical leads)
   */
  calculateChirality(bibibinary) {
    const { audio, optical, synchronicity } = bibibinary;

    // Compare transformation rates (which domain is changing faster?)
    const audioRate = audio.transformation;
    const opticalRate = optical.transformation;

    // Chirality: positive when audio faster (AM/right-handed), negative when optical faster (PM/left-handed)
    const rawChirality = audioRate - opticalRate;

    // Modulated by synchronicity (high sync = weaker chirality)
    this.chirality = rawChirality * (1 - synchronicity * 0.5);

    return this.chirality;
  }

  /**
   * Update lambda (λ) modulation based on MMPA forces
   * Lambda represents the tuning/chromatic position, now driven by data
   */
  updateLambdaModulation(bibibinary, deltaTime) {
    const { audio, optical, synchronicity } = bibibinary;

    // Lambda velocity driven by transformation forces (change rate)
    // Use De Moivre's theorem for power scaling: velocity^n scales rotation
    const audioTransformPower = Math.pow(audio.transformation, 2);    // n=2 for smoother acceleration
    const opticalTransformPower = Math.pow(optical.transformation, 2);

    // Combined velocity (rad/s)
    const targetVelocity = (audioTransformPower + opticalTransformPower) * Math.PI; // 0 to 2π rad/s

    // Smooth velocity transition
    this.lambdaVelocity += (targetVelocity - this.lambdaVelocity) * 0.1;

    // Update lambda rotation
    this.lambdaRotation += this.lambdaVelocity * deltaTime;
    this.lambdaRotation = this.lambdaRotation % (Math.PI * 2); // Wrap to 0-2π

    // Apply rotation to lambda symbols
    if (this.lambdaMeshTop) {
      this.lambdaMeshTop.rotation.z = this.lambdaRotation + Math.PI / 6;
    }
    if (this.lambdaMeshBottom) {
      this.lambdaMeshBottom.rotation.z = this.lambdaRotation + Math.PI / 6;
    }
  }

  /**
   * Modulate AM chain (audio/input/teal) based on audio MMPA forces
   * AM = Amplitude Modulation, Consonance, Right-handed helix
   */
  modulateAMChain(audioForces) {
    if (!this.amChain || !audioForces.active) return;

    // Modulate each Chestahedron in the AM chain
    this.amChain.children.forEach((mesh, index) => {
      if (!mesh.material) return;

      // Identity → Color intensity (brighter = stronger identity)
      const identityIntensity = audioForces.identity;

      // Relationship → Opacity (higher consonance = more solid)
      const relationshipOpacity = 0.3 + audioForces.relationship * 0.6;

      // Complexity → Scale variation along chain
      const complexityScale = 1.0 + audioForces.complexity * 0.3 * Math.sin(index * 0.5);

      // Transformation → Local twist rate
      const transformationTwist = audioForces.transformation * Math.PI * 0.1;

      // Alignment → Position stability (high alignment = less jitter)
      const alignmentJitter = (1 - audioForces.alignment) * 0.5;

      // Apply modulations
      mesh.material.emissiveIntensity = 0.2 + identityIntensity * 0.6;
      mesh.material.opacity = relationshipOpacity;
      mesh.scale.setScalar(complexityScale);
      mesh.rotation.y += transformationTwist;

      // Jitter position slightly based on alignment
      if (alignmentJitter > 0.1) {
        mesh.position.x += (Math.random() - 0.5) * alignmentJitter;
        mesh.position.z += (Math.random() - 0.5) * alignmentJitter;
      }
    });
  }

  /**
   * Modulate PM chain (optical/output/violet) based on optical MMPA forces
   * PM = Phase Modulation, Dissonance, Left-handed helix
   */
  modulatePMChain(opticalForces) {
    if (!this.pmChain || !opticalForces.active) return;

    // Modulate each Chestahedron in the PM chain
    this.pmChain.children.forEach((mesh, index) => {
      if (!mesh.material) return;

      // Identity → Color intensity (brighter = stronger visual presence)
      const identityIntensity = opticalForces.identity;

      // Relationship → Opacity (higher harmony = more visible)
      const relationshipOpacity = 0.3 + opticalForces.relationship * 0.6;

      // Complexity → Scale variation (edge density affects size)
      const complexityScale = 1.0 + opticalForces.complexity * 0.3 * Math.cos(index * 0.5);

      // Transformation → Local twist rate (visual flux)
      const transformationTwist = opticalForces.transformation * Math.PI * 0.1;

      // Alignment → Position stability (symmetry reduces jitter)
      const alignmentJitter = (1 - opticalForces.alignment) * 0.5;

      // Apply modulations
      mesh.material.emissiveIntensity = 0.2 + identityIntensity * 0.6;
      mesh.material.opacity = relationshipOpacity;
      mesh.scale.setScalar(complexityScale);
      mesh.rotation.y += transformationTwist;

      // Jitter position slightly based on alignment
      if (alignmentJitter > 0.1) {
        mesh.position.x += (Math.random() - 0.5) * alignmentJitter;
        mesh.position.z += (Math.random() - 0.5) * alignmentJitter;
      }
    });
  }

  /**
   * Update yantra (visual pattern library)
   * Greek symbols: λ (lambda), φ (phi)
   * Latin incantations: Pattern names from recipes
   */
  updateYantra(bibibinary, complexRotation, chirality) {
    const { audio, optical, synchronicity } = bibibinary;

    // Read pattern interpretations from recipes
    const audioPattern = state.recipeInterpretation?.interpretation?.pattern?.type || 'unknown';
    const opticalPattern = state.opticalRecipeInterpretation?.interpretation?.pattern?.type || 'unknown';

    // Determine synchronicity pattern
    let synchronicityPattern = 'independent';
    if (synchronicity > 0.7) {
      synchronicityPattern = 'synchronized'; // High correlation
    } else if (synchronicity > 0.4) {
      synchronicityPattern = 'entangled';    // Medium correlation
    } else if (synchronicity > 0.2) {
      synchronicityPattern = 'interfering';  // Low correlation
    } else {
      synchronicityPattern = 'independent';  // No correlation
    }

    // Update current yantra state
    this.currentYantra = {
      audioPattern,
      opticalPattern,
      synchronicityPattern,
      complexRotation,
      chirality,
      synchronicity,

      // "Latin incantations" - descriptive summary
      incantation: this.generateIncantation(audioPattern, opticalPattern, synchronicityPattern)
    };

    // Store in global state for HUD display
    state.chronelixYantra = this.currentYantra;
  }

  /**
   * Generate Latin incantation (descriptive pattern summary)
   * Combines audio + optical patterns into poetic phrase
   */
  generateIncantation(audioPattern, opticalPattern, syncPattern) {
    const incantations = {
      synchronized: {
        silence_darkness: "Silentium et Tenebrae — The Void Unified",
        silence_static: "Silentium Immobile — Frozen Quietude",
        rhythm_motion: "Rhythmus et Motus — Dance of Being",
        melody_vibrant: "Melodia Vivida — Song of Color",
        harmony_symmetry: "Harmonia Specularis — Mirror of Order",
        drone_monochrome: "Tonus Monochromaticus — Single Voice",
        chaos_chaos: "Chaos Duplicatus — Double Turbulence"
      },
      entangled: {
        silence_motion: "Silentium Mobilis — Silent Movement",
        rhythm_static: "Rhythmus Congelatus — Frozen Beat",
        melody_darkness: "Melodia Obscura — Song in Shadow",
        harmony_chaos: "Harmonia Turbulenta — Ordered Chaos"
      },
      interfering: {
        percussion_geometric: "Percussio Geometrica — Striking Angles",
        bass_organic: "Bassus Organicus — Deep Nature",
        noise_texture: "Strepitus Texturae — Noise Fabric"
      },
      independent: {
        default: "Autonomia Duplicis — Independent Paths"
      }
    };

    // Try to find specific combination
    const combinedKey = `${audioPattern}_${opticalPattern}`;

    if (incantations[syncPattern] && incantations[syncPattern][combinedKey]) {
      return incantations[syncPattern][combinedKey];
    }

    // Fallback to general synchronicity phrase
    if (incantations[syncPattern] && incantations[syncPattern].default) {
      return incantations[syncPattern].default;
    }

    // Ultimate fallback
    return `${audioPattern.toUpperCase()} × ${opticalPattern.toUpperCase()}`;
  }

  /**
   * Get current yantra state for external display
   */
  getYantra() {
    return this.currentYantra;
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      enabled: this.enabled,
      audioPhase: (this.audioPhase * 180 / Math.PI).toFixed(1) + '°',
      opticalPhase: (this.opticalPhase * 180 / Math.PI).toFixed(1) + '°',
      synchronicity: (this.synchronicity * 100).toFixed(1) + '%',
      chirality: this.chirality.toFixed(3),
      lambdaRotation: (this.lambdaRotation * 180 / Math.PI).toFixed(1) + '°',
      lambdaVelocity: this.lambdaVelocity.toFixed(3) + ' rad/s',
      yantra: this.currentYantra.incantation,

      // Analysis modules debug info
      phaseSpace: phaseSpace.getDebugInfo(),
      particles: {
        count: particleStream.particles.length,
        maxCount: particleStream.maxParticles,
        emissionRate: particleStream.emissionRate
      },
      gates: gateAnalysis.getDebugInfo(),
      transitions: phaseTransitionDetector.getDebugInfo(),
      trajectory: trajectoryPlotter.getDebugInfo(),
      wavelet: waveletDecomposition.getDebugInfo(),
      patterns: patternCodegen.getDebugInfo(),
      waveforms: waveformVisualizer.getDebugInfo()
    };
  }

  /**
   * Get analysis modules for external access
   */
  getAnalysisModules() {
    return {
      phaseSpace,
      particleStream,
      gateAnalysis,
      phaseTransitionDetector,
      trajectoryPlotter,
      waveletDecomposition,
      patternCodegen,
      waveformVisualizer
    };
  }

  /**
   * Export pattern library
   */
  exportPatternLibrary() {
    return patternCodegen.exportLibrary();
  }
}

// Create singleton instance
export const chronelixIntegrator = new ChronelixMMPAIntegrator();

// Expose globally for debugging
if (typeof window !== 'undefined') {
  window.chronelixIntegrator = chronelixIntegrator;
  window.chronelixPhaseSpace = phaseSpace;
  window.chronelixParticleStream = particleStream;
  window.chronelixGateAnalysis = gateAnalysis;
  window.chronelixPhaseTransitionDetector = phaseTransitionDetector;
  window.chronelixTrajectoryPlotter = trajectoryPlotter;
  window.chronelixWaveletDecomposition = waveletDecomposition;
  window.chronelixPatternCodegen = patternCodegen;
  window.chronelixWaveformVisualizer = waveformVisualizer;
}

console.log("🧬 Chronelix-MMPA Integrator ready");
console.log("🧬 All Chronelix analysis modules exposed globally for debugging");
