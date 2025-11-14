// src/chronelixTrajectoryPlotter.js
// 3D Trajectory Plotting for Phase Space Analysis
// Real-time visualization of particle paths, attractor basins, and phase portraits

import * as THREE from 'three';

console.log("📈 chronelixTrajectoryPlotter.js loaded");

/**
 * Trajectory Line
 * Represents a plotted path through phase space
 */
class TrajectoryLine {
  constructor(id, type, color) {
    this.id = id;
    this.type = type; // 'particle', 'phase_space', 'attractor', 'synchronicity'
    this.color = color;

    this.points = [];
    this.maxPoints = 300; // Maximum trajectory length

    // THREE.js line
    this.line = null;
    this.geometry = null;
    this.material = null;

    // Fade effect
    this.fadeEnabled = true;
    this.opacity = 1.0;
    this.age = 0;
    this.lifetime = 60; // seconds

    // Active state
    this.active = true;
  }

  /**
   * Add point to trajectory
   */
  addPoint(position) {
    this.points.push({
      x: position.x,
      y: position.y,
      z: position.z,
      timestamp: performance.now() / 1000
    });

    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }
  }

  /**
   * Update trajectory visual
   */
  updateVisual() {
    if (!this.line || this.points.length < 2) return;

    // Create positions array
    const positions = [];
    for (const point of this.points) {
      positions.push(point.x, point.y, point.z);
    }

    // Update geometry
    this.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );

    // Update opacity based on age
    if (this.fadeEnabled) {
      const ageFactor = 1 - (this.age / this.lifetime);
      this.material.opacity = Math.max(0, this.opacity * ageFactor);
    }
  }

  /**
   * Update age
   */
  update(deltaTime) {
    this.age += deltaTime;

    if (this.age >= this.lifetime) {
      this.active = false;
    }
  }

  /**
   * Clear points
   */
  clear() {
    this.points = [];
  }
}

/**
 * Trajectory Plotter
 * Manages 3D visualization of trajectories through phase space
 */
export class ChronelixTrajectoryPlotter {
  constructor() {
    this.trajectories = new Map(); // id → TrajectoryLine
    this.nextTrajectoryId = 0;

    // THREE.js groups
    this.particleTrajectoriesGroup = null;
    this.phaseSpaceTrajectoriesGroup = null;
    this.attractorTrajectoriesGroup = null;
    this.synchronicityTrajectoriesGroup = null;

    // Visualization modes
    this.modes = {
      showParticleTrajectories: true,
      showPhaseSpaceTrajectory: true,
      showAttractorBasin: false,
      showSynchronicityPath: true
    };

    // Phase space trajectory (system-level)
    this.systemTrajectory = null;

    // Attractor visualization
    this.attractorPoints = [];
    this.attractorMesh = null;

    // Statistics
    this.totalTrajectoriesPlotted = 0;
    this.activeTrajectoriesCount = 0;
  }

  /**
   * Initialize plotter
   */
  init(scene) {
    // Create groups
    this.particleTrajectoriesGroup = new THREE.Group();
    this.phaseSpaceTrajectoriesGroup = new THREE.Group();
    this.attractorTrajectoriesGroup = new THREE.Group();
    this.synchronicityTrajectoriesGroup = new THREE.Group();

    scene.add(this.particleTrajectoriesGroup);
    scene.add(this.phaseSpaceTrajectoriesGroup);
    scene.add(this.attractorTrajectoriesGroup);
    scene.add(this.synchronicityTrajectoriesGroup);

    // Create system trajectory
    this.systemTrajectory = new TrajectoryLine(
      'system',
      'phase_space',
      new THREE.Color(0x8b5cf6) // Purple
    );
    this.systemTrajectory.fadeEnabled = false;
    this.systemTrajectory.maxPoints = 600; // 10 seconds at 60fps
    this.createTrajectoryVisual(this.systemTrajectory, this.phaseSpaceTrajectoriesGroup);

    console.log("📈 Trajectory plotter initialized");
  }

  /**
   * Create THREE.js visual for trajectory
   */
  createTrajectoryVisual(trajectory, group) {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({
      color: trajectory.color,
      transparent: true,
      opacity: trajectory.opacity,
      linewidth: 2
    });

    trajectory.line = new THREE.Line(geometry, material);
    trajectory.geometry = geometry;
    trajectory.material = material;

    group.add(trajectory.line);
  }

  /**
   * Update plotter
   */
  update(particles, phaseSpace, deltaTime) {
    // Update particle trajectories
    if (this.modes.showParticleTrajectories) {
      this.updateParticleTrajectories(particles);
    }

    // Update phase space trajectory
    if (this.modes.showPhaseSpaceTrajectory && phaseSpace) {
      this.updatePhaseSpaceTrajectory(phaseSpace);
    }

    // Update attractor basin
    if (this.modes.showAttractorBasin && phaseSpace) {
      this.updateAttractorBasin(phaseSpace);
    }

    // Update synchronicity path
    if (this.modes.showSynchronicityPath && phaseSpace) {
      this.updateSynchronicityPath(phaseSpace);
    }

    // Update all trajectory visuals
    for (const [id, trajectory] of this.trajectories) {
      trajectory.update(deltaTime);
      trajectory.updateVisual();

      if (!trajectory.active) {
        this.removeTrajectory(id);
      }
    }

    // Update statistics
    this.activeTrajectoriesCount = this.trajectories.size;
  }

  /**
   * Update particle trajectories
   * Each particle has its own trajectory line
   */
  updateParticleTrajectories(particles) {
    for (const particle of particles) {
      if (!particle.active) continue;

      // Check if trajectory exists for this particle
      const trajId = `particle_${particle.id}`;
      let trajectory = this.trajectories.get(trajId);

      // Create trajectory if needed
      if (!trajectory) {
        trajectory = new TrajectoryLine(
          trajId,
          'particle',
          particle.getColor()
        );
        trajectory.maxPoints = 60; // 1 second trail
        trajectory.fadeEnabled = true;
        trajectory.lifetime = particle.lifetime;

        this.createTrajectoryVisual(trajectory, this.particleTrajectoriesGroup);
        this.trajectories.set(trajId, trajectory);
        this.totalTrajectoriesPlotted++;
      }

      // Add current position to trajectory
      if (particle.mesh) {
        trajectory.addPoint(particle.mesh.position);
        trajectory.material.color.copy(particle.getColor());
      }
    }
  }

  /**
   * Update phase space trajectory
   * System-level trajectory showing 12D→3D projection
   */
  updatePhaseSpaceTrajectory(phaseSpace) {
    const pos = phaseSpace.getPhaseSpacePosition();

    // Project 12D → 3D (already done in getPhaseSpacePosition)
    // x = (I_a + I_o)/2, y = (R_a + R_o)/2, z = (C_a + C_o)/2
    const position = new THREE.Vector3(
      (pos.x - 0.5) * 30, // Scale to visible range
      (pos.y - 0.5) * 30,
      (pos.z - 0.5) * 30
    );

    this.systemTrajectory.addPoint(position);
  }

  /**
   * Update attractor basin visualization
   * Plots recent points to show attractor structure
   */
  updateAttractorBasin(phaseSpace) {
    const trajectory = phaseSpace.getTrajectory(300); // Last 5 seconds

    // Store attractor points
    this.attractorPoints = trajectory.map(point => ({
      x: (point.x - 0.5) * 30,
      y: (point.y - 0.5) * 30,
      z: (point.z - 0.5) * 30
    }));

    // Create/update point cloud visualization
    this.updateAttractorVisualization();
  }

  /**
   * Update attractor visualization (point cloud)
   */
  updateAttractorVisualization() {
    // Remove old mesh
    if (this.attractorMesh) {
      this.attractorTrajectoriesGroup.remove(this.attractorMesh);
      this.attractorMesh.geometry.dispose();
      this.attractorMesh.material.dispose();
    }

    if (this.attractorPoints.length === 0) return;

    // Create point cloud
    const positions = [];
    const colors = [];

    for (let i = 0; i < this.attractorPoints.length; i++) {
      const point = this.attractorPoints[i];
      positions.push(point.x, point.y, point.z);

      // Color gradient based on age (older = darker)
      const ageFactor = i / this.attractorPoints.length;
      const color = new THREE.Color().setHSL(0.7, 0.8, 0.3 + ageFactor * 0.4);
      colors.push(color.r, color.g, color.b);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });

    this.attractorMesh = new THREE.Points(geometry, material);
    this.attractorTrajectoriesGroup.add(this.attractorMesh);
  }

  /**
   * Update synchronicity path
   * Plots cross-correlation between audio and optical domains
   */
  updateSynchronicityPath(phaseSpace) {
    const trajId = 'synchronicity';
    let trajectory = this.trajectories.get(trajId);

    // Create trajectory if needed
    if (!trajectory) {
      trajectory = new TrajectoryLine(
        trajId,
        'synchronicity',
        new THREE.Color(0xfbbf24) // Amber
      );
      trajectory.maxPoints = 300;
      trajectory.fadeEnabled = false;

      this.createTrajectoryVisual(trajectory, this.synchronicityTrajectoriesGroup);
      this.trajectories.set(trajId, trajectory);
    }

    // Plot synchronicity as a 3D curve
    // x = synchronicity, y = coherence, z = complexity
    const sync = phaseSpace.synchronicity;
    const coherence = phaseSpace.coherence;
    const variance = phaseSpace.variance;

    const position = new THREE.Vector3(
      sync * 30 - 15,           // -15 to +15
      coherence * 30 - 15,      // -15 to +15
      variance * 30 - 15        // -15 to +15
    );

    trajectory.addPoint(position);

    // Update color based on synchronicity
    const color = new THREE.Color();
    if (sync > 0.5) {
      color.setHSL(0.3, 1.0, 0.5); // Green (high sync)
    } else if (sync < -0.5) {
      color.setHSL(0.0, 1.0, 0.5); // Red (anti-sync)
    } else {
      color.setHSL(0.15, 1.0, 0.5); // Yellow (neutral)
    }

    trajectory.material.color.copy(color);
  }

  /**
   * Plot particle journey through gates
   * Shows full path from emission to completion with gate markers
   */
  plotParticleJourney(particle, gateAnalyses) {
    const trajId = `journey_${particle.id}`;
    const trajectory = new TrajectoryLine(
      trajId,
      'particle',
      new THREE.Color(0x06b6d4) // Cyan
    );
    trajectory.maxPoints = 1000;
    trajectory.fadeEnabled = true;
    trajectory.lifetime = 30;

    // Add all points from particle history
    for (const trajPoint of particle.trajectory) {
      // Reconstruct 3D position from trajectory point
      const progress = trajPoint.progress;
      const yRange = 100; // Assume constant
      const y = 50 - (progress * yRange);

      const angle = progress * 2 * Math.PI * 3 + trajPoint.phase;
      const radius = 10 * (1 + trajPoint.handedness * 0.3);

      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      trajectory.addPoint(new THREE.Vector3(x, y, z));
    }

    // Add gate markers
    for (const analysis of gateAnalyses) {
      // Create small sphere at gate position
      const gateGeometry = new THREE.SphereGeometry(0.5, 8, 8);
      const gateMaterial = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.8
      });

      const gateMarker = new THREE.Mesh(gateGeometry, gateMaterial);
      // Position at gate based on analysis...
      this.particleTrajectoriesGroup.add(gateMarker);
    }

    this.createTrajectoryVisual(trajectory, this.particleTrajectoriesGroup);
    this.trajectories.set(trajId, trajectory);
    this.totalTrajectoriesPlotted++;
  }

  /**
   * Plot phase portrait
   * 2D projection of phase space (e.g., velocity vs position)
   */
  plotPhasePortrait(xMetric, yMetric, phaseSpaceHistory) {
    const trajId = `portrait_${xMetric}_${yMetric}`;
    const trajectory = new TrajectoryLine(
      trajId,
      'phase_space',
      new THREE.Color(0xec4899) // Pink
    );
    trajectory.maxPoints = 500;
    trajectory.fadeEnabled = false;

    // Extract metrics from history
    for (const state of phaseSpaceHistory) {
      const x = this.extractMetric(state, xMetric);
      const y = this.extractMetric(state, yMetric);

      // Plot in XY plane (Z = 0)
      trajectory.addPoint(new THREE.Vector3(
        x * 20 - 10,
        y * 20 - 10,
        0
      ));
    }

    this.createTrajectoryVisual(trajectory, this.phaseSpaceTrajectoriesGroup);
    this.trajectories.set(trajId, trajectory);
    this.totalTrajectoriesPlotted++;
  }

  /**
   * Extract metric value from phase space state
   */
  extractMetric(state, metricName) {
    // Parse metric name (e.g., "audio.identity", "optical.transformation")
    const parts = metricName.split('.');
    if (parts.length === 2) {
      const [domain, force] = parts;
      return state[domain]?.[force] || 0;
    }
    return 0;
  }

  /**
   * Create trajectory for particle
   */
  createParticleTrajectory(particleId, color, maxPoints = 60) {
    const trajId = `particle_${particleId}`;
    const trajectory = new TrajectoryLine(trajId, 'particle', color);
    trajectory.maxPoints = maxPoints;
    trajectory.fadeEnabled = true;

    this.createTrajectoryVisual(trajectory, this.particleTrajectoriesGroup);
    this.trajectories.set(trajId, trajectory);
    this.totalTrajectoriesPlotted++;

    return trajectory;
  }

  /**
   * Remove trajectory
   */
  removeTrajectory(id) {
    const trajectory = this.trajectories.get(id);
    if (!trajectory) return;

    // Remove from scene
    if (trajectory.line) {
      trajectory.line.parent?.remove(trajectory.line);
      trajectory.geometry?.dispose();
      trajectory.material?.dispose();
    }

    this.trajectories.delete(id);
  }

  /**
   * Clear all trajectories of a given type
   */
  clearTrajectories(type = null) {
    const toRemove = [];

    for (const [id, trajectory] of this.trajectories) {
      if (type === null || trajectory.type === type) {
        toRemove.push(id);
      }
    }

    for (const id of toRemove) {
      this.removeTrajectory(id);
    }
  }

  /**
   * Set visualization mode
   */
  setMode(modeName, enabled) {
    if (this.modes[modeName] !== undefined) {
      this.modes[modeName] = enabled;

      // Update group visibility
      switch (modeName) {
        case 'showParticleTrajectories':
          this.particleTrajectoriesGroup.visible = enabled;
          break;
        case 'showPhaseSpaceTrajectory':
          this.phaseSpaceTrajectoriesGroup.visible = enabled;
          break;
        case 'showAttractorBasin':
          this.attractorTrajectoriesGroup.visible = enabled;
          break;
        case 'showSynchronicityPath':
          this.synchronicityTrajectoriesGroup.visible = enabled;
          break;
      }
    }
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      activeTrajectories: this.activeTrajectoriesCount,
      totalPlotted: this.totalTrajectoriesPlotted,
      systemTrajectoryPoints: this.systemTrajectory?.points.length || 0,
      attractorPoints: this.attractorPoints.length,
      modes: { ...this.modes }
    };
  }

  /**
   * Reset plotter
   */
  reset() {
    this.clearTrajectories();
    this.systemTrajectory?.clear();
    this.attractorPoints = [];

    if (this.attractorMesh) {
      this.attractorTrajectoriesGroup.remove(this.attractorMesh);
      this.attractorMesh.geometry.dispose();
      this.attractorMesh.material.dispose();
      this.attractorMesh = null;
    }

    this.totalTrajectoriesPlotted = 0;
  }

  /**
   * Dispose resources
   */
  dispose() {
    this.reset();

    if (this.systemTrajectory) {
      this.systemTrajectory.geometry?.dispose();
      this.systemTrajectory.material?.dispose();
    }

    const groups = [
      this.particleTrajectoriesGroup,
      this.phaseSpaceTrajectoriesGroup,
      this.attractorTrajectoriesGroup,
      this.synchronicityTrajectoriesGroup
    ];

    for (const group of groups) {
      if (group) {
        group.parent?.remove(group);
      }
    }
  }
}

// Singleton instance
export const trajectoryPlotter = new ChronelixTrajectoryPlotter();

console.log("📈 Trajectory plotter ready");
