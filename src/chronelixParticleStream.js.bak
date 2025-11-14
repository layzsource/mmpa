// src/chronelixParticleStream.js
// Particle Stream System for Chronelix Waveguide
// Data particles with circular polarization flowing through gates

import * as THREE from 'three';

console.log("⚛️ chronelixParticleStream.js loaded");

/**
 * Data Particle
 * Represents a quantum of bibibinary data flowing through the chronelix
 */
class DataParticle {
  constructor(id, initialState, birthTime) {
    this.id = id;
    this.birthTime = birthTime;
    this.age = 0;
    this.lifetime = 12 * 5; // 60 seconds (12 gates × 5 sec/gate)

    // Phase space state (12D)
    this.state = { ...initialState };

    // Position in waveguide (0 = top λ AM, 1 = bottom λ PM)
    this.progress = 0;

    // Velocity through pipeline (controlled by transformation force)
    this.velocity = 0;

    // Energy (accumulated transformation)
    this.energy = 0;

    // Circular polarization state
    this.polarization = {
      handedness: 0,      // -1 = left (AM), +1 = right (PM), 0 = linear
      phase: 0,           // Rotation angle (0 to 2π)
      ellipticity: 0      // 0 = linear, 1 = circular
    };

    // Trajectory history (for plotting)
    this.trajectory = [];
    this.maxTrajectoryLength = 60;

    // Gate passage tracking
    this.currentGate = 0;
    this.gateAnalysis = [];  // Results from each gate

    // Visual representation
    this.mesh = null;
    this.trailLine = null;

    // Active state
    this.active = true;
  }

  /**
   * Update particle state (called each frame)
   */
  update(deltaTime, phaseSpaceState) {
    if (!this.active) return;

    this.age += deltaTime;

    // Compute velocity from transformation forces
    const audioTransform = phaseSpaceState.audio.transformation;
    const opticalTransform = phaseSpaceState.optical.transformation;
    this.velocity = (audioTransform + opticalTransform) / 2;

    // Acceleration through gates (velocity increases)
    const gateAcceleration = 0.1 * this.currentGate;
    this.velocity += gateAcceleration;

    // Clamp velocity
    this.velocity = Math.max(0.001, Math.min(this.velocity, 0.05));

    // Update progress through pipeline
    this.progress += this.velocity * deltaTime;

    // Energy accumulation
    this.energy += this.velocity * deltaTime;

    // Update current gate (0-11 for 12 gates)
    this.currentGate = Math.floor(this.progress * 12);

    // Update circular polarization
    this.updatePolarization(phaseSpaceState);

    // Update state from phase space
    this.state = { ...phaseSpaceState };

    // Record trajectory
    this.addTrajectoryPoint();

    // Check if particle reached end
    if (this.progress >= 1.0 || this.age >= this.lifetime) {
      this.active = false;
    }
  }

  /**
   * Update circular polarization state
   */
  updatePolarization(phaseSpaceState) {
    // Handedness from domain dominance
    const audioDominance = (phaseSpaceState.audio.identity + phaseSpaceState.audio.alignment) / 2;
    const opticalDominance = (phaseSpaceState.optical.identity + phaseSpaceState.optical.alignment) / 2;

    // -1 (left/AM) to +1 (right/PM)
    this.polarization.handedness = opticalDominance - audioDominance;

    // Phase rotation (increases with transformation)
    const transformRate = (phaseSpaceState.audio.transformation + phaseSpaceState.optical.transformation) / 2;
    this.polarization.phase += transformRate * Math.PI * 0.1;
    this.polarization.phase = this.polarization.phase % (Math.PI * 2);

    // Ellipticity from coherence
    const coherence = (phaseSpaceState.audio.alignment + phaseSpaceState.optical.alignment) / 2;
    this.polarization.ellipticity = coherence;
  }

  /**
   * Add current position to trajectory
   */
  addTrajectoryPoint() {
    const point = {
      progress: this.progress,
      energy: this.energy,
      handedness: this.polarization.handedness,
      phase: this.polarization.phase,
      timestamp: this.age
    };

    this.trajectory.push(point);

    if (this.trajectory.length > this.maxTrajectoryLength) {
      this.trajectory.shift();
    }
  }

  /**
   * Get 3D position in chronelix (for visualization)
   */
  get3DPosition(chronelixConstants) {
    const C = chronelixConstants;

    // Y position (top to bottom)
    const yRange = C.Y_TOTAL_HEIGHT;
    const y = (C.Y_TOTAL_HEIGHT / 2) - (this.progress * yRange);

    // Helical path (circular polarization)
    const angle = this.progress * C.GLOBAL_ROTATION_INCREMENT * C.UNITS_PER_CHAIN +
                  this.polarization.phase;

    // Radius grows from 0 at top to full over first 20% of descent
    // Particles enter at center axis and spiral outward
    const radiusGrowth = Math.min(this.progress * 5, 1.0); // progress=0.2 → 1.0
    const radius = C.HELIX_RADIUS * radiusGrowth * (1 + this.polarization.ellipticity * 0.5);

    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);

    return new THREE.Vector3(x, y, z);
  }

  /**
   * Get particle color (based on state)
   */
  getColor() {
    // Blend teal (AM) and violet (PM) based on handedness
    const teal = new THREE.Color(0x14b8a6);
    const violet = new THREE.Color(0x7c3aed);

    const t = (this.polarization.handedness + 1) / 2; // Map -1..1 to 0..1
    const color = teal.clone().lerp(violet, t);

    // Brightness based on energy
    const brightness = 0.5 + (this.energy * 0.5);
    color.multiplyScalar(Math.min(brightness, 1.5));

    return color;
  }
}

/**
 * Particle Stream Manager
 * Manages flow of data particles through chronelix
 */
export class ChronelixParticleStream {
  constructor() {
    this.particles = [];
    this.nextParticleId = 0;
    this.maxParticles = 50;

    // Emission control
    this.emissionRate = 2; // particles per second
    this.timeSinceLastEmission = 0;

    // THREE.js objects
    this.particlesGroup = null;
    this.trajectoriesGroup = null;

    // Chronelix constants (set by parent)
    this.chronelixConstants = null;

    // Statistics
    this.stats = {
      totalEmitted: 0,
      totalCompleted: 0,
      activeCount: 0,
      averageVelocity: 0,
      averageEnergy: 0
    };
  }

  /**
   * Initialize particle stream
   */
  init(chronelixConstants, scene) {
    this.chronelixConstants = chronelixConstants;

    // Create groups for particles and trajectories
    this.particlesGroup = new THREE.Group();
    this.trajectoriesGroup = new THREE.Group();

    scene.add(this.particlesGroup);
    scene.add(this.trajectoriesGroup);

    console.log("⚛️ Particle stream initialized");
  }

  /**
   * Update particle stream
   */
  update(deltaTime, phaseSpaceState) {
    if (!this.chronelixConstants) return;

    // Emit new particles
    this.timeSinceLastEmission += deltaTime;
    const emissionInterval = 1.0 / this.emissionRate;

    if (this.timeSinceLastEmission >= emissionInterval &&
        this.particles.length < this.maxParticles) {
      this.emitParticle(phaseSpaceState);
      this.timeSinceLastEmission = 0;
    }

    // Update all particles
    for (const particle of this.particles) {
      particle.update(deltaTime, phaseSpaceState);

      // Update visual representation
      if (particle.active) {
        this.updateParticleVisuals(particle);
      }
    }

    // Remove inactive particles
    this.particles = this.particles.filter(p => {
      if (!p.active) {
        this.removeParticleVisuals(p);
        this.stats.totalCompleted++;
        return false;
      }
      return true;
    });

    // Update statistics
    this.updateStats();
  }

  /**
   * Emit new particle
   */
  emitParticle(phaseSpaceState) {
    const particle = new DataParticle(
      this.nextParticleId++,
      phaseSpaceState,
      performance.now() / 1000
    );

    this.particles.push(particle);
    this.createParticleVisuals(particle);
    this.stats.totalEmitted++;
  }

  /**
   * Create THREE.js visuals for particle
   */
  createParticleVisuals(particle) {
    // Particle sphere
    const geometry = new THREE.SphereGeometry(0.3, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: particle.getColor(),
      emissive: particle.getColor(),
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2
    });

    particle.mesh = new THREE.Mesh(geometry, material);
    particle.mesh.position.copy(particle.get3DPosition(this.chronelixConstants));

    this.particlesGroup.add(particle.mesh);

    // Trajectory trail (will be updated)
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({
      color: particle.getColor(),
      transparent: true,
      opacity: 0.5,
      linewidth: 2
    });

    particle.trailLine = new THREE.Line(trailGeometry, trailMaterial);
    this.trajectoriesGroup.add(particle.trailLine);
  }

  /**
   * Update particle visuals
   */
  updateParticleVisuals(particle) {
    if (!particle.mesh) return;

    // Update position
    particle.mesh.position.copy(particle.get3DPosition(this.chronelixConstants));

    // Update color
    const color = particle.getColor();
    particle.mesh.material.color.copy(color);
    particle.mesh.material.emissive.copy(color);

    // Update trajectory trail
    if (particle.trailLine && particle.trajectory.length >= 2) {
      const positions = [];

      for (const point of particle.trajectory) {
        // Reconstruct 3D position from trajectory point
        const C = this.chronelixConstants;
        const yRange = C.Y_TOTAL_HEIGHT;
        const y = (C.Y_TOTAL_HEIGHT / 2) - (point.progress * yRange);

        const angle = point.progress * C.GLOBAL_ROTATION_INCREMENT * C.UNITS_PER_CHAIN +
                      point.phase;

        const radius = C.HELIX_RADIUS * (1 + particle.polarization.ellipticity * 0.5);

        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);

        positions.push(x, y, z);
      }

      particle.trailLine.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      );

      particle.trailLine.material.color.copy(color);
    }
  }

  /**
   * Remove particle visuals
   */
  removeParticleVisuals(particle) {
    if (particle.mesh) {
      this.particlesGroup.remove(particle.mesh);
      particle.mesh.geometry.dispose();
      particle.mesh.material.dispose();
    }

    if (particle.trailLine) {
      this.trajectoriesGroup.remove(particle.trailLine);
      particle.trailLine.geometry.dispose();
      particle.trailLine.material.dispose();
    }
  }

  /**
   * Update statistics
   */
  updateStats() {
    this.stats.activeCount = this.particles.length;

    if (this.particles.length > 0) {
      let totalVelocity = 0;
      let totalEnergy = 0;

      for (const particle of this.particles) {
        totalVelocity += particle.velocity;
        totalEnergy += particle.energy;
      }

      this.stats.averageVelocity = totalVelocity / this.particles.length;
      this.stats.averageEnergy = totalEnergy / this.particles.length;
    }
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      activeParticles: this.stats.activeCount,
      totalEmitted: this.stats.totalEmitted,
      totalCompleted: this.stats.totalCompleted,
      avgVelocity: this.stats.averageVelocity.toFixed(4),
      avgEnergy: this.stats.averageEnergy.toFixed(3),
      emissionRate: this.emissionRate
    };
  }

  /**
   * Set emission rate
   */
  setEmissionRate(rate) {
    this.emissionRate = Math.max(0.1, Math.min(rate, 10));
  }

  /**
   * Clear all particles
   */
  clear() {
    for (const particle of this.particles) {
      this.removeParticleVisuals(particle);
    }

    this.particles = [];
    this.stats.activeCount = 0;
  }

  /**
   * Dispose resources
   */
  dispose() {
    this.clear();

    if (this.particlesGroup) {
      this.particlesGroup.parent?.remove(this.particlesGroup);
    }

    if (this.trajectoriesGroup) {
      this.trajectoriesGroup.parent?.remove(this.trajectoriesGroup);
    }
  }
}

// Singleton instance
export const particleStream = new ChronelixParticleStream();

console.log("⚛️ Particle stream system ready");
