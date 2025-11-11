// src/materialPhysics.js
// Material Physics Engine for Chronelix MMPA
// Defines transfer functions from real material properties to ARPT scores

console.log("🔬 materialPhysics.js loaded");

/**
 * Material Constants - Based on Real Physical Properties
 *
 * These constants define the physics engine that governs the chronelix behavior.
 * Each material property creates a measurable effect in the simulation.
 */
export const MATERIALS = {
  // Piezo Quartz - The Error Sensor (Alignment A)
  // Converts mechanical stress to electrical voltage
  piezoQuartz: {
    piezoConstant: 2.31e-12,        // C/N (coulombs per newton) - real quartz value
    sensitivity: 0.8,                // Amplification factor for simulation
    equilibriumThreshold: 0.01,      // Voltage threshold for "aligned" state
    temperatureCoeff: -0.00016,      // Temperature coefficient (1/°C)
    maxStress: 50e6,                 // Maximum stress (50 MPa)

    // Face indices for opposing pressure measurements
    opposingFaces: [
      [0, 3],  // Kite faces opposite each other
      [1, 4],
      [2, 5]
    ]
  },

  // Calcite - The Channel Separator (Relationship R)
  // Splits light into orthogonal polarizations via birefringence
  calcite: {
    birefringenceIndex: 0.172,       // Δn (refractive index difference)
    ordinaryIndex: 1.658,            // n_o (ordinary ray)
    extraordinaryIndex: 1.486,       // n_e (extraordinary ray)
    separationAngle: 6.5,            // degrees (natural cleavage angle)
    channelIsolation: 0.95,          // 95% separation efficiency
    wavelengthDependent: true,       // Dispersion effects

    // Frequency-to-polarization mapping
    frequencyBands: {
      bass: 'LCP',      // Left circular polarization → PM λ
      mid: 'linear',    // Linear polarization → mixed
      treble: 'RCP'     // Right circular polarization → AM λ
    }
  },

  // Silica Lattice - The Memory/Battery (Potential P)
  // Stores energy as dielectric charge
  silicaLattice: {
    dielectricConstant: 3.9,         // ε_r (relative permittivity)
    capacitance: 8.85e-12,           // F/m (farads per meter) - ε_0
    relaxationTime: 100,             // ms (charge decay time constant)
    maxChargeStorage: 1.0,           // Normalized max charge (0-1)
    leakageCurrent: 0.001,           // Normalized leakage rate per frame
    hurstExponent: 0.8,              // Long-range memory coefficient

    // Temperature effects
    chargeDecayRate: (temp = 20) => {
      // Higher temp = faster decay
      return 1.0 / (100 * Math.exp(-0.01 * (temp - 20)));
    }
  },

  // Polymer Matrix - The Viscosity Control (Transformation T)
  // Determines rate of state transitions
  polymerMatrix: {
    baseviscosity: 1000,            // Pa·s (pascal-seconds) - honey-like
    chainLength: 500,                // Monomer units (affects entanglement)
    dampingCoeff: 0.7,               // Energy dissipation factor
    shearThinning: 0.3,              // Non-Newtonian behavior
    glassTransTemperature: 85,       // °C (below this, system becomes rigid)

    // Viscosity as function of shear rate (flow speed)
    effectiveViscosity: (baseVisc, shearRate) => {
      // Shear-thinning: higher flow = lower viscosity
      return baseVisc / (1 + 0.3 * shearRate);
    },

    // Critical slowing down threshold
    criticalViscosity: 5000          // Pa·s (above this, T → 0)
  },

  // Fiber Optic Waveguide - The Transmission Medium
  // PMMA (acrylic) fiber properties
  fiberOptic: {
    coreDiameter: 1.0,               // mm (normalized scale)
    claddingThickness: 0.1,          // mm
    refractiveIndexCore: 1.492,      // PMMA at 589nm
    refractiveIndexCladding: 1.402,  // Lower RI for total internal reflection
    numericalAperture: 0.47,         // Light-gathering capacity
    attenuationCoeff: 0.2,           // dB/m (signal loss per unit length)
    dispersionCoeff: 0.1,            // ps/(nm·km) (chromatic dispersion)

    // Waveguide modes
    propagationModes: {
      fundamental: 'TE01',  // Transverse electric (bass frequencies)
      higher: 'TM11'        // Transverse magnetic (treble frequencies)
    }
  }
};

/**
 * PEMF (Pulsed Electromagnetic Field) State
 * Controls the driving force for transformation
 */
export class PEMFState {
  constructor() {
    this.frequency = 10.0;           // Hz (10 Hz default - alpha wave)
    this.amplitude = 1.0;            // Normalized (0-1)
    this.pulseWidth = 50;            // ms
    this.dutyCycle = 0.5;            // 50% on/off
    this.waveform = 'sine';          // sine, square, sawtooth

    // Dynamic adjustment parameters
    this.minFrequency = 1.0;         // Hz (delta waves)
    this.maxFrequency = 100.0;       // Hz (gamma waves)
    this.frequencyStep = 0.5;        // Hz per adjustment
    this.amplitudeStep = 0.05;       // Amplitude per adjustment

    // Feedback gain
    this.alignmentGain = 0.1;        // Response to A score
    this.transformationGain = 0.15;  // Response to T score
    this.potentialGain = 0.05;       // Response to P score
  }

  /**
   * Update PEMF based on ARPT feedback
   */
  adjustFromFeedback(arptScores) {
    // Low alignment → increase frequency to drive synchronization
    if (arptScores.A < 64) {
      this.frequency = Math.min(
        this.maxFrequency,
        this.frequency + this.frequencyStep * this.alignmentGain
      );
    }

    // High alignment → can reduce driving force
    if (arptScores.A > 192) {
      this.frequency = Math.max(
        this.minFrequency,
        this.frequency - this.frequencyStep * this.alignmentGain
      );
    }

    // Low transformation (high viscosity) → boost amplitude
    if (arptScores.T < 32) {
      this.amplitude = Math.min(
        1.0,
        this.amplitude + this.amplitudeStep * this.transformationGain
      );
    }

    // Low potential (charge decaying) → increase pulse width
    if (arptScores.P < 64) {
      this.pulseWidth = Math.min(
        100,
        this.pulseWidth + 5 * this.potentialGain
      );
    }

    return this;
  }

  /**
   * Get current PEMF force at time t
   */
  getForceAtTime(time) {
    const phase = (time * this.frequency * 2 * Math.PI) / 1000; // Convert to radians

    switch (this.waveform) {
      case 'sine':
        return this.amplitude * Math.sin(phase);
      case 'square':
        return this.amplitude * (Math.sin(phase) > 0 ? 1 : -1);
      case 'sawtooth':
        return this.amplitude * (2 * (phase % (2 * Math.PI)) / (2 * Math.PI) - 1);
      default:
        return 0;
    }
  }
}

/**
 * Material Physics Calculator
 * Converts audio signals and geometry states into ARPT scores
 */
export class MaterialPhysicsEngine {
  constructor() {
    this.pemfState = new PEMFState();
    this.temperature = 20;           // °C (ambient)
    this.time = 0;                   // ms (elapsed simulation time)

    // Silica lattice charge state
    this.latticeCharge = 0;
    this.lastChargeTime = 0;

    console.log("🔬 Material Physics Engine initialized");
  }

  /**
   * Calculate Alignment score from Piezo Quartz stress
   * A = 127 - |net_stress| * sensitivity
   * Perfect alignment = zero net stress across opposing faces
   */
  calculateAlignment(chestahedronFaces, audioFrame) {
    const mat = MATERIALS.piezoQuartz;

    // Calculate pressure on each face from audio signal
    const facePressures = chestahedronFaces.map((face, index) => {
      // Use audio frequency content to modulate pressure
      const bass = audioFrame.bass || 0;
      const mid = audioFrame.mid || 0;
      const treble = audioFrame.treble || 0;

      // Different faces respond to different frequency bands
      let pressure = 0;
      if (index < 3) {
        // Kite faces → bass response
        pressure = bass * 0.5;
      } else if (index < 6) {
        // Side triangles → mid response
        pressure = mid * 0.3;
      } else {
        // Base triangle → treble response
        pressure = treble * 0.2;
      }

      return pressure;
    });

    // Calculate net stress by summing opposing face differentials
    let netStress = 0;
    mat.opposingFaces.forEach(([face1, face2]) => {
      const differential = Math.abs(facePressures[face1] - facePressures[face2]);
      netStress += differential;
    });

    // Convert stress to voltage via piezo effect
    const piezoVoltage = netStress * mat.piezoConstant * 1e9; // Scale for visibility

    // Alignment score: 127 = perfect (zero voltage), 0 = maximum misalignment
    const A = Math.max(0, Math.min(255, 127 - piezoVoltage * mat.sensitivity * 100));

    return {
      score: A,
      netStress: netStress,
      piezoVoltage: piezoVoltage,
      facePressures: facePressures
    };
  }

  /**
   * Calculate Relationship score from Calcite birefringence
   * R = channel_isolation * orthogonality
   * Perfect separation = RCP and LCP channels completely isolated
   */
  calculateRelationship(audioFrame) {
    const mat = MATERIALS.calcite;

    // Extract frequency bands
    const bass = audioFrame.bass || 0;
    const mid = audioFrame.mid || 0;
    const treble = audioFrame.treble || 0;

    // Simulate channel separation via birefringence
    // LCP channel (PM λ) = bass frequencies
    const LCP_channel = bass;

    // RCP channel (AM λ) = treble frequencies
    const RCP_channel = treble;

    // Mid frequencies = mixed/unseparated
    const mixedChannel = mid;

    // Calculate orthogonality (how different are the channels?)
    const channelDifference = Math.abs(LCP_channel - RCP_channel);
    const orthogonality = Math.min(1.0, channelDifference);

    // Relationship score = isolation efficiency * orthogonality
    const R = mat.channelIsolation * orthogonality * 255;

    // Penalty for mixed content (indicates poor separation)
    const mixedPenalty = mixedChannel * 50;
    const R_final = Math.max(0, Math.min(255, R - mixedPenalty));

    return {
      score: R_final,
      LCP_channel: LCP_channel,
      RCP_channel: RCP_channel,
      mixedChannel: mixedChannel,
      orthogonality: orthogonality
    };
  }

  /**
   * Calculate Potential score from Silica Lattice charge storage
   * P = stored_charge * retention_factor
   * High P = system can maintain coherent state
   */
  calculatePotential(pemfForce, deltaTime) {
    const mat = MATERIALS.silicaLattice;

    // PEMF induces charge in lattice
    const chargeInduction = Math.abs(pemfForce) * mat.capacitance * 1e12; // Scale for visibility
    this.latticeCharge += chargeInduction;

    // Charge decay over time (leakage + thermal relaxation)
    const decayRate = mat.chargeDecayRate(this.temperature);
    const chargeLoss = this.latticeCharge * decayRate * (deltaTime / 1000);
    this.latticeCharge = Math.max(0, this.latticeCharge - chargeLoss);

    // Clamp to max storage capacity
    this.latticeCharge = Math.min(mat.maxChargeStorage, this.latticeCharge);

    // Potential score = charge level scaled to 0-255
    const P = this.latticeCharge * 255;

    // Hurst exponent effect: high charge = long-range memory
    const hurstEffect = Math.pow(this.latticeCharge, mat.hurstExponent);

    return {
      score: P,
      latticeCharge: this.latticeCharge,
      hurstEffect: hurstEffect,
      decayRate: decayRate
    };
  }

  /**
   * Calculate Transformation score from Polymer Matrix viscosity
   * T = driving_force / viscosity
   * High viscosity = slow transformation (critical slowing down)
   */
  calculateTransformation(pemfForce, audioLevel) {
    const mat = MATERIALS.polymerMatrix;

    // Shear rate proportional to audio energy (flow speed)
    const shearRate = audioLevel * 10.0; // Scale factor

    // Effective viscosity with shear-thinning
    const viscosity = mat.effectiveViscosity(mat.baseviscosity, shearRate);

    // Transformation rate = PEMF force / viscosity
    const transformationRate = Math.abs(pemfForce) / viscosity;

    // Normalize to 0-255 scale
    // High transformation rate → high T score
    const T = Math.min(255, transformationRate * 1e5); // Scale factor

    // Critical slowing down detection
    const criticalSlowingDown = viscosity > mat.criticalViscosity;

    return {
      score: T,
      viscosity: viscosity,
      transformationRate: transformationRate,
      shearRate: shearRate,
      criticalSlowingDown: criticalSlowingDown
    };
  }

  /**
   * Calculate all ARPT scores for current frame
   */
  calculateARPT(chestahedronFaces, audioFrame, deltaTime = 16) {
    this.time += deltaTime;

    // Get current PEMF force
    const pemfForce = this.pemfState.getForceAtTime(this.time);

    // Calculate audio level for viscosity modulation
    const audioLevel = (audioFrame.bass + audioFrame.mid + audioFrame.treble) / 3;

    // Calculate individual scores with detailed state
    const alignment = this.calculateAlignment(chestahedronFaces, audioFrame);
    const relationship = this.calculateRelationship(audioFrame);
    const potential = this.calculatePotential(pemfForce, deltaTime);
    const transformation = this.calculateTransformation(pemfForce, audioLevel);

    // Update PEMF based on feedback
    const arptScores = {
      A: alignment.score,
      R: relationship.score,
      P: potential.score,
      T: transformation.score
    };

    this.pemfState.adjustFromFeedback(arptScores);

    return {
      scores: arptScores,
      details: {
        alignment: alignment,
        relationship: relationship,
        potential: potential,
        transformation: transformation
      },
      pemf: {
        frequency: this.pemfState.frequency,
        amplitude: this.pemfState.amplitude,
        currentForce: pemfForce
      },
      timestamp: this.time
    };
  }

  /**
   * Reset system state
   */
  reset() {
    this.time = 0;
    this.latticeCharge = 0;
    this.lastChargeTime = 0;
    this.pemfState = new PEMFState();
    console.log("🔬 Material Physics Engine reset");
  }
}

console.log("🔬 Material Physics Engine ready");
