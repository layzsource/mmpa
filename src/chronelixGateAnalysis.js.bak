// src/chronelixGateAnalysis.js
// Gate-Based Analysis System for Chronelix Particle Accelerator
// 12 chestahedron checkpoints with MMPA evaluation and force application

import * as THREE from 'three';

console.log("🚪 chronelixGateAnalysis.js loaded");

/**
 * Chestahedron Gate
 * Each gate is a checkpoint where particles are analyzed and accelerated
 */
class ChronelixGate {
  constructor(index, position, chronelixConstants) {
    this.index = index;
    this.position = position; // 0.0 to 1.0 through pipeline
    this.chronelixConstants = chronelixConstants;

    // Gate timing (5 seconds per gate = 60 sec / 12 gates)
    this.intervalDuration = 5.0; // seconds
    this.timeWindow = 0.1; // seconds (detection threshold)

    // MMPA analysis at this gate
    this.currentAnalysis = null;
    this.analysisHistory = [];
    this.maxHistoryLength = 100;

    // Particles that have passed through
    this.particlesPassed = [];
    this.totalParticles = 0;

    // Gate activity metrics
    this.activityLevel = 0; // 0 to 1
    this.averageEnergy = 0;
    this.averageVelocity = 0;
    this.lastPassageTime = 0;

    // Visualization
    this.mesh = null;
    this.glowMesh = null;
    this.particleCountLabel = null;
  }

  /**
   * Analyze particle as it passes through gate
   * Apply MMPA-based force transformations
   */
  analyzeParticlePassage(particle, phaseSpaceState, timestamp) {
    // Record passage
    this.totalParticles++;
    this.lastPassageTime = timestamp;

    // Extract MMPA forces at gate position
    const audioMMPA = phaseSpaceState.audio;
    const opticalMMPA = phaseSpaceState.optical;

    // Compute gate analysis
    const analysis = {
      particleId: particle.id,
      gateIndex: this.index,
      timestamp: timestamp,
      particleAge: particle.age,

      // MMPA state at gate
      mmpa: {
        audio: { ...audioMMPA },
        optical: { ...opticalMMPA }
      },

      // Particle state at gate
      particleState: {
        progress: particle.progress,
        velocity: particle.velocity,
        energy: particle.energy,
        polarization: { ...particle.polarization }
      },

      // Derived metrics
      metrics: this.computeGateMetrics(particle, phaseSpaceState)
    };

    // Apply force transformations to particle
    this.applyGateForces(particle, analysis);

    // Store analysis
    this.currentAnalysis = analysis;
    this.analysisHistory.push(analysis);
    if (this.analysisHistory.length > this.maxHistoryLength) {
      this.analysisHistory.shift();
    }

    // Store particle reference
    this.particlesPassed.push({
      id: particle.id,
      timestamp: timestamp,
      energyGain: analysis.metrics.energyBoost,
      velocityChange: analysis.metrics.velocityBoost
    });

    // Update activity level
    this.updateActivityLevel();

    return analysis;
  }

  /**
   * Compute gate-specific metrics
   */
  computeGateMetrics(particle, phaseSpaceState) {
    const a = phaseSpaceState.audio;
    const o = phaseSpaceState.optical;

    // Synchronicity at gate
    const synchronicity = this.computeSynchronicity(a, o);

    // Coherence (alignment measure)
    const coherence = (a.alignment + o.alignment) / 2;

    // Complexity (entropy measure)
    const complexity = (a.complexity + o.complexity) / 2;

    // Energy density (I + P)
    const energyDensity = (a.identity + a.potential + o.identity + o.potential) / 4;

    // Force magnitude (R + A)
    const forceMagnitude = (a.relationship + a.alignment + o.relationship + o.alignment) / 4;

    // Transformation rate (T)
    const transformationRate = (a.transformation + o.transformation) / 2;

    // Gate-specific boosts (based on MMPA evaluation)
    const velocityBoost = this.computeVelocityBoost(a, o);
    const energyBoost = this.computeEnergyBoost(a, o);
    const polarizationTorque = this.computePolarizationTorque(a, o);

    return {
      synchronicity,
      coherence,
      complexity,
      energyDensity,
      forceMagnitude,
      transformationRate,
      velocityBoost,
      energyBoost,
      polarizationTorque
    };
  }

  /**
   * Compute synchronicity (cross-correlation)
   */
  computeSynchronicity(audio, optical) {
    const audioVec = [
      audio.identity,
      audio.relationship,
      audio.complexity,
      audio.transformation,
      audio.alignment,
      audio.potential
    ];

    const opticalVec = [
      optical.identity,
      optical.relationship,
      optical.complexity,
      optical.transformation,
      optical.alignment,
      optical.potential
    ];

    // Pearson correlation
    const audioMean = audioVec.reduce((a, b) => a + b) / 6;
    const opticalMean = opticalVec.reduce((a, b) => a + b) / 6;

    let numerator = 0;
    let audioDenom = 0;
    let opticalDenom = 0;

    for (let i = 0; i < 6; i++) {
      const audioDev = audioVec[i] - audioMean;
      const opticalDev = opticalVec[i] - opticalMean;
      numerator += audioDev * opticalDev;
      audioDenom += audioDev * audioDev;
      opticalDenom += opticalDev * opticalDev;
    }

    const denom = Math.sqrt(audioDenom * opticalDenom);
    return denom > 0 ? numerator / denom : 0;
  }

  /**
   * Compute velocity boost: Δv = f(R, A)
   * Relationship and Alignment drive acceleration
   */
  computeVelocityBoost(audio, optical) {
    const relationshipForce = (audio.relationship + optical.relationship) / 2;
    const alignmentForce = (audio.alignment + optical.alignment) / 2;

    // Velocity boost proportional to R and A
    const boost = (relationshipForce + alignmentForce) * 0.01;
    return boost;
  }

  /**
   * Compute energy boost: ΔE = f(I, C, P)
   * Identity, Complexity, and Potential contribute to energy gain
   */
  computeEnergyBoost(audio, optical) {
    const identityEnergy = (audio.identity + optical.identity) / 2;
    const complexityEnergy = (audio.complexity + optical.complexity) / 2;
    const potentialEnergy = (audio.potential + optical.potential) / 2;

    // Energy boost from I, C, P
    const boost = (identityEnergy * 0.3 + complexityEnergy * 0.3 + potentialEnergy * 0.4) * 0.05;
    return boost;
  }

  /**
   * Compute polarization torque: Δθ = f(T_a - T_o)
   * Transformation asymmetry causes handedness shift
   */
  computePolarizationTorque(audio, optical) {
    const transformationAsymmetry = optical.transformation - audio.transformation;

    // Torque proportional to transformation difference
    const torque = transformationAsymmetry * 0.1;
    return torque;
  }

  /**
   * Apply gate forces to particle
   */
  applyGateForces(particle, analysis) {
    const metrics = analysis.metrics;

    // Apply velocity boost (acceleration)
    particle.velocity += metrics.velocityBoost;
    particle.velocity = Math.max(0.001, Math.min(particle.velocity, 0.1)); // Clamp

    // Apply energy boost
    particle.energy += metrics.energyBoost;

    // Apply polarization torque (handedness shift)
    particle.polarization.handedness += metrics.polarizationTorque;
    particle.polarization.handedness = Math.max(-1, Math.min(particle.polarization.handedness, 1));

    // Store gate analysis in particle
    if (!particle.gateAnalysis) {
      particle.gateAnalysis = [];
    }
    particle.gateAnalysis.push(analysis);
  }

  /**
   * Update gate activity level
   */
  updateActivityLevel() {
    if (this.particlesPassed.length === 0) {
      this.activityLevel = 0;
      return;
    }

    // Activity based on recent passages (last 10)
    const recentPasses = this.particlesPassed.slice(-10);

    // Calculate average energy and velocity from recent passes
    let totalEnergy = 0;
    let totalVelocity = 0;

    for (const pass of recentPasses) {
      totalEnergy += pass.energyGain;
      totalVelocity += pass.velocityChange;
    }

    this.averageEnergy = totalEnergy / recentPasses.length;
    this.averageVelocity = totalVelocity / recentPasses.length;

    // Activity level (0 to 1) based on energy and velocity
    this.activityLevel = Math.min(1, (this.averageEnergy + this.averageVelocity) * 10);
  }

  /**
   * Get 3D position of gate in chronelix
   */
  get3DPosition() {
    const C = this.chronelixConstants;
    const yRange = C.Y_TOTAL_HEIGHT;
    const y = (C.Y_TOTAL_HEIGHT / 2) - (this.position * yRange);

    // Gates are rings around the helix
    return new THREE.Vector3(0, y, 0);
  }

  /**
   * Get gate color based on activity
   */
  getColor() {
    // Blend from dark blue (inactive) to bright cyan (active)
    const inactive = new THREE.Color(0x1e3a8a);
    const active = new THREE.Color(0x06b6d4);

    const color = inactive.clone().lerp(active, this.activityLevel);
    return color;
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      index: this.index,
      position: this.position.toFixed(2),
      totalParticles: this.totalParticles,
      activityLevel: this.activityLevel.toFixed(3),
      averageEnergy: this.averageEnergy.toFixed(4),
      averageVelocity: this.averageVelocity.toFixed(4),
      lastAnalysis: this.currentAnalysis ? {
        synchronicity: this.currentAnalysis.metrics.synchronicity.toFixed(3),
        coherence: this.currentAnalysis.metrics.coherence.toFixed(3),
        complexity: this.currentAnalysis.metrics.complexity.toFixed(3)
      } : null
    };
  }
}

/**
 * Gate Analysis System
 * Manages 12 chestahedron gates for particle analysis
 */
export class ChronelixGateAnalysis {
  constructor() {
    this.gates = [];
    this.chronelixConstants = null;

    // THREE.js visualization
    this.gatesGroup = null;

    // System metrics
    this.totalAnalyses = 0;
    this.averageSystemEnergy = 0;
    this.averageSystemVelocity = 0;

    // Analysis callbacks
    this.onGatePassage = null; // Callback when particle passes gate
  }

  /**
   * Initialize gate system
   */
  init(chronelixConstants, scene) {
    this.chronelixConstants = chronelixConstants;

    // Create 12 gates evenly spaced along pipeline
    for (let i = 0; i < 12; i++) {
      const position = i / 12; // 0/12, 1/12, 2/12, ..., 11/12
      const gate = new ChronelixGate(i, position, chronelixConstants);
      this.gates.push(gate);
    }

    // Create visualization group
    this.gatesGroup = new THREE.Group();
    scene.add(this.gatesGroup);

    // Create gate visuals
    this.createGateVisuals();

    console.log(`🚪 Gate analysis system initialized (${this.gates.length} gates)`);
  }

  /**
   * Create THREE.js visuals for gates
   */
  createGateVisuals() {
    const C = this.chronelixConstants;

    for (const gate of this.gates) {
      // Gate ring
      const ringGeometry = new THREE.TorusGeometry(
        C.HELIX_RADIUS * 1.5, // Outer radius
        0.1,                  // Tube radius
        16,                   // Radial segments
        32                    // Tubular segments
      );

      const ringMaterial = new THREE.MeshStandardMaterial({
        color: gate.getColor(),
        emissive: gate.getColor(),
        emissiveIntensity: 0.3,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6
      });

      gate.mesh = new THREE.Mesh(ringGeometry, ringMaterial);
      gate.mesh.position.copy(gate.get3DPosition());
      gate.mesh.rotation.x = Math.PI / 2; // Horizontal ring

      this.gatesGroup.add(gate.mesh);

      // Glow effect (scales with activity)
      const glowGeometry = new THREE.TorusGeometry(
        C.HELIX_RADIUS * 1.5,
        0.2,
        8,
        16
      );

      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.0 // Initially invisible
      });

      gate.glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      gate.glowMesh.position.copy(gate.get3DPosition());
      gate.glowMesh.rotation.x = Math.PI / 2;

      this.gatesGroup.add(gate.glowMesh);
    }
  }

  /**
   * Update gate system
   * Check particles and trigger analysis
   */
  update(particles, phaseSpaceState, timestamp) {
    if (!this.chronelixConstants) return;

    // Check each particle against each gate
    for (const particle of particles) {
      if (!particle.active) continue;

      const currentGateIndex = particle.currentGate;

      // Check if particle just entered a new gate
      if (currentGateIndex >= 0 && currentGateIndex < 12) {
        const gate = this.gates[currentGateIndex];

        // Check if this particle hasn't been analyzed at this gate yet
        const alreadyAnalyzed = particle.gateAnalysis?.some(
          a => a.gateIndex === currentGateIndex
        );

        if (!alreadyAnalyzed) {
          // Analyze particle passage
          const analysis = gate.analyzeParticlePassage(particle, phaseSpaceState, timestamp);
          this.totalAnalyses++;

          // Trigger callback
          if (this.onGatePassage) {
            this.onGatePassage(gate, particle, analysis);
          }

          // Log analysis (every 10th passage)
          if (this.totalAnalyses % 10 === 0) {
            console.log(`🚪 Gate ${currentGateIndex} passage:`, {
              particle: particle.id,
              sync: analysis.metrics.synchronicity.toFixed(3),
              energy: analysis.metrics.energyDensity.toFixed(3),
              velocity: particle.velocity.toFixed(4)
            });
          }
        }
      }
    }

    // Update gate visuals
    this.updateGateVisuals();

    // Update system metrics
    this.updateSystemMetrics();
  }

  /**
   * Update gate visuals based on activity
   */
  updateGateVisuals() {
    for (const gate of this.gates) {
      if (!gate.mesh || !gate.glowMesh) continue;

      // Update color based on activity
      const color = gate.getColor();
      gate.mesh.material.color.copy(color);
      gate.mesh.material.emissive.copy(color);
      gate.mesh.material.emissiveIntensity = 0.3 + (gate.activityLevel * 0.7);

      // Update glow opacity based on activity
      gate.glowMesh.material.opacity = gate.activityLevel * 0.5;
      gate.glowMesh.material.color.copy(color);

      // Pulse effect based on activity
      const pulseScale = 1 + (gate.activityLevel * 0.2);
      gate.glowMesh.scale.set(pulseScale, pulseScale, pulseScale);
    }
  }

  /**
   * Update system-wide metrics
   */
  updateSystemMetrics() {
    let totalEnergy = 0;
    let totalVelocity = 0;
    let activeGates = 0;

    for (const gate of this.gates) {
      if (gate.activityLevel > 0) {
        totalEnergy += gate.averageEnergy;
        totalVelocity += gate.averageVelocity;
        activeGates++;
      }
    }

    if (activeGates > 0) {
      this.averageSystemEnergy = totalEnergy / activeGates;
      this.averageSystemVelocity = totalVelocity / activeGates;
    }
  }

  /**
   * Get gate by index
   */
  getGate(index) {
    return this.gates[index];
  }

  /**
   * Get all gate analyses for a specific particle
   */
  getParticleJourney(particleId) {
    const journey = [];

    for (const gate of this.gates) {
      const analysis = gate.analysisHistory.find(a => a.particleId === particleId);
      if (analysis) {
        journey.push(analysis);
      }
    }

    return journey;
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    const activeGates = this.gates.filter(g => g.activityLevel > 0).length;

    return {
      totalGates: this.gates.length,
      activeGates: activeGates,
      totalAnalyses: this.totalAnalyses,
      avgSystemEnergy: this.averageSystemEnergy.toFixed(4),
      avgSystemVelocity: this.averageSystemVelocity.toFixed(4),
      gates: this.gates.map(g => g.getDebugInfo())
    };
  }

  /**
   * Get statistical summary
   */
  getStatistics() {
    const stats = {
      totalParticles: 0,
      gateDistribution: [],
      averageEnergyByGate: [],
      averageVelocityByGate: [],
      synchronicityByGate: []
    };

    for (const gate of this.gates) {
      stats.totalParticles += gate.totalParticles;
      stats.gateDistribution.push(gate.totalParticles);
      stats.averageEnergyByGate.push(gate.averageEnergy);
      stats.averageVelocityByGate.push(gate.averageVelocity);

      // Get average synchronicity from recent analyses
      const recentAnalyses = gate.analysisHistory.slice(-10);
      const avgSync = recentAnalyses.length > 0
        ? recentAnalyses.reduce((sum, a) => sum + a.metrics.synchronicity, 0) / recentAnalyses.length
        : 0;
      stats.synchronicityByGate.push(avgSync);
    }

    return stats;
  }

  /**
   * Analyze particle stream (convenience wrapper for getStatistics)
   * @param {Array} particles - Array of particles in the stream
   * @returns {Object} Gate statistics including totalGates, activeGates, etc.
   */
  analyzeStream(particles) {
    // getStatistics() provides all the data needed by pattern codegen
    const stats = this.getStatistics();

    // Add total gates and active gates count
    stats.totalGates = this.gates.length;
    stats.activeGates = this.gates.filter(g => g.activityLevel > 0).length;

    return stats;
  }

  /**
   * Reset all gates
   */
  reset() {
    for (const gate of this.gates) {
      gate.analysisHistory = [];
      gate.particlesPassed = [];
      gate.totalParticles = 0;
      gate.activityLevel = 0;
      gate.averageEnergy = 0;
      gate.averageVelocity = 0;
      gate.currentAnalysis = null;
    }

    this.totalAnalyses = 0;
    this.averageSystemEnergy = 0;
    this.averageSystemVelocity = 0;
  }

  /**
   * Dispose resources
   */
  dispose() {
    for (const gate of this.gates) {
      if (gate.mesh) {
        gate.mesh.geometry.dispose();
        gate.mesh.material.dispose();
      }
      if (gate.glowMesh) {
        gate.glowMesh.geometry.dispose();
        gate.glowMesh.material.dispose();
      }
    }

    if (this.gatesGroup) {
      this.gatesGroup.parent?.remove(this.gatesGroup);
    }
  }
}

// Singleton instance
export const gateAnalysis = new ChronelixGateAnalysis();

console.log("🚪 Gate analysis system ready");
