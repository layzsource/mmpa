// Chronelix Living Symbol Mode
// Visualizes MMPA data flow through sacred geometry
// IVM Core + Dual Helix + Flower of Life + Data Particles

import * as THREE from 'three';
import { getCurrentArchetype } from './archetypeRecognizer.js';

console.log('🌀 chronelixLivingSymbol.js loaded');

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const PHI = 1.618033988749;

export const LIVING_SYMBOL_CONFIG = {
  // IVM sizing (φ-based nested scales)
  IVM_SCALE_FACTOR: 1.0,
  IVM_STELLA_SCALE: 1.0,        // Stella Octangula (contraction)
  IVM_CUBO_SCALE: PHI,           // Cuboctahedron (expansion) - larger by φ

  // Data flow
  PARTICLE_SPEED_MIN: 0.002,
  PARTICLE_SPEED_MAX: 0.005,
  PARTICLE_SIZE: 0.15,
  TRAIL_LENGTH: 10,
  SPAWN_RATE_MAX: 3.0, // particles per second

  // Slicer
  SLICER_SPEED: 0.0003,
  SLICER_OPACITY: 0.15,

  // Animation
  ROTATION_SPEED: 0.005,
  BREATHING_SPEED: 0.6,
  BREATHING_AMPLITUDE: 0.6,

  // Colors
  COLORS: {
    AUDIO: 0x14b8a6,      // Teal
    FINANCIAL: 0xffc857,   // Gold
    SYNTH: 0x7c3aed,       // Violet
    ANLG: 0x60a5fa,        // Blue (processed)
    FIELD: 0xe6edf3,       // Soft white
    PHI_LINE: 0xffc857     // Gold
  }
};

// ============================================================================
// DATA PARTICLE CLASS
// ============================================================================

class DataParticle {
  constructor(type, path, scene) {
    this.type = type;
    this.progress = 0;
    this.speed = LIVING_SYMBOL_CONFIG.PARTICLE_SPEED_MIN +
                 Math.random() * (LIVING_SYMBOL_CONFIG.PARTICLE_SPEED_MAX - LIVING_SYMBOL_CONFIG.PARTICLE_SPEED_MIN);
    this.path = path;
    this.processed = false;
    this.scene = scene;

    // Visual mesh
    const geom = new THREE.SphereGeometry(LIVING_SYMBOL_CONFIG.PARTICLE_SIZE, 8, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: LIVING_SYMBOL_CONFIG.COLORS[type],
      emissive: LIVING_SYMBOL_CONFIG.COLORS[type],
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.9
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.userData.isDataParticle = true;

    // Trail
    this.trail = [];
    this.trailMesh = null;
    this.createTrailMesh();
  }

  createTrailMesh() {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(LIVING_SYMBOL_CONFIG.TRAIL_LENGTH * 3);
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({
      color: LIVING_SYMBOL_CONFIG.COLORS[this.type],
      transparent: true,
      opacity: 0.3,
      linewidth: 2
    });

    this.trailMesh = new THREE.Line(geom, mat);
    this.trailMesh.userData.isParticleTrail = true;
  }

  update(processingZone) {
    this.progress += this.speed;

    if (this.progress >= 1.0) {
      return false; // Particle completed journey
    }

    // Update position along curve
    const point = this.path.getPointAt(this.progress);
    this.mesh.position.copy(point);

    // Update trail
    this.trail.push(point.clone());
    if (this.trail.length > LIVING_SYMBOL_CONFIG.TRAIL_LENGTH) {
      this.trail.shift();
    }

    // Update trail mesh
    const positions = this.trailMesh.geometry.attributes.position.array;
    for (let i = 0; i < this.trail.length; i++) {
      positions[i * 3] = this.trail[i].x;
      positions[i * 3 + 1] = this.trail[i].y;
      positions[i * 3 + 2] = this.trail[i].z;
    }
    this.trailMesh.geometry.attributes.position.needsUpdate = true;

    // Check if in processing zone (IVM core)
    if (!this.processed && processingZone) {
      const distToCore = this.mesh.position.distanceTo(processingZone.position);

      if (distToCore < processingZone.radius) {
        this.processData(processingZone);
      }
    }

    return true;
  }

  processData(processingZone) {
    this.processed = true;
    this.type = 'ANLG';

    // Transform visuals
    this.mesh.material.color.setHex(LIVING_SYMBOL_CONFIG.COLORS.ANLG);
    this.mesh.material.emissive.setHex(LIVING_SYMBOL_CONFIG.COLORS.ANLG);
    this.mesh.scale.setScalar(1.4);

    this.trailMesh.material.color.setHex(LIVING_SYMBOL_CONFIG.COLORS.ANLG);

    // Trigger processing zone pulse
    if (processingZone.onProcess) {
      processingZone.onProcess();
    }

    console.log('🔵 Data processed through IVM core');
  }

  destroy() {
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }
    if (this.trailMesh.parent) {
      this.trailMesh.parent.remove(this.trailMesh);
    }

    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.trailMesh.geometry.dispose();
    this.trailMesh.material.dispose();
  }
}

// ============================================================================
// DATA FLOW MANAGER
// ============================================================================

export class DataFlowManager {
  constructor(chronelixGroup, yTopApex, yBottomBase, helixRadius) {
    this.group = chronelixGroup;
    this.yTopApex = yTopApex;
    this.yBottomBase = yBottomBase;
    this.helixRadius = helixRadius;

    this.particles = [];
    this.paths = null;
    this.processingZone = null;

    this.spawnRates = {
      AUDIO: 0,
      FINANCIAL: 0,
      SYNTH: 0
    };

    this.lastSpawnTimes = {
      AUDIO: 0,
      FINANCIAL: 0,
      SYNTH: 0
    };

    this.stats = {
      audio: 0,
      financial: 0,
      synth: 0,
      anlg: 0
    };

    this.initialize();
  }

  initialize() {
    this.createFlowPaths();
    this.createProcessingZone();
  }

  createFlowPaths() {
    const yTotal = this.yTopApex - this.yBottomBase;
    const ivmYCenter = (this.yTopApex + this.yBottomBase) / 2;
    const ivmRadius = Math.max(this.helixRadius * 0.12, 4.2);

    this.paths = {};

    // Entry angles for three data types
    const entryAngles = {
      AUDIO: 0,
      FINANCIAL: (2 * Math.PI) / 3,
      SYNTH: (4 * Math.PI) / 3
    };

    for (const [dataType, entryAngle] of Object.entries(entryAngles)) {
      const points = [];

      // 1. Entry at Flower of Life (bottom)
      const entryY = this.yBottomBase - 2;
      points.push(new THREE.Vector3(
        this.helixRadius * 0.8 * Math.cos(entryAngle),
        entryY,
        this.helixRadius * 0.8 * Math.sin(entryAngle)
      ));

      // 2. Spiral up through helix (50 steps for smooth curve)
      const spiralSteps = 50;
      for (let i = 0; i < spiralSteps; i++) {
        const t = i / spiralSteps;
        const theta = (t * 4 * Math.PI) + entryAngle; // 2 full rotations
        const y = entryY + (yTotal * t * 0.85); // Don't go all the way to top yet

        // Spiral inward as it rises
        const radius = this.helixRadius * (0.8 - t * 0.5);

        points.push(new THREE.Vector3(
          radius * Math.cos(theta),
          y,
          radius * Math.sin(theta)
        ));
      }

      // 3. Converge to IVM core (processing)
      const convergenceSteps = 10;
      for (let i = 0; i < convergenceSteps; i++) {
        const t = i / convergenceSteps;
        const lastPoint = points[points.length - 1];

        points.push(new THREE.Vector3(
          lastPoint.x * (1 - t),
          lastPoint.y + (ivmYCenter - lastPoint.y) * t,
          lastPoint.z * (1 - t)
        ));
      }

      // 4. Pass through core
      points.push(new THREE.Vector3(0, ivmYCenter, 0));

      // 5. Emerge from core (spiral outward)
      const emergenceSteps = 20;
      const emergenceAngle = entryAngle + Math.PI; // Opposite side

      for (let i = 0; i < emergenceSteps; i++) {
        const t = i / emergenceSteps;
        const theta = emergenceAngle + (t * Math.PI * 0.5);
        const y = ivmYCenter + ((this.yTopApex - ivmYCenter) * t);
        const radius = ivmRadius * (1 + t * 2);

        points.push(new THREE.Vector3(
          radius * Math.cos(theta),
          y,
          radius * Math.sin(theta)
        ));
      }

      // 6. Exit at Dharma Wheel (top)
      points.push(new THREE.Vector3(0, this.yTopApex + 2, 0));

      // Create smooth curve
      const curve = new THREE.CatmullRomCurve3(points);
      curve.curveType = 'centripetal';

      this.paths[dataType] = curve;
    }

    console.log('🌀 Data flow paths created');
  }

  createProcessingZone() {
    const ivmYCenter = (this.yTopApex + this.yBottomBase) / 2;
    const ivmRadius = Math.max(this.helixRadius * 0.12, 4.2);

    this.processingZone = {
      position: new THREE.Vector3(0, ivmYCenter, 0),
      radius: ivmRadius * 1.8,
      onProcess: null // Set externally to trigger visual feedback
    };
  }

  setDataActivity(dataType, activity) {
    // activity: 0-1, how much data is flowing
    const type = dataType.toUpperCase();
    if (this.spawnRates[type] !== undefined) {
      this.spawnRates[type] = activity * LIVING_SYMBOL_CONFIG.SPAWN_RATE_MAX;
    }
  }

  update(deltaTime) {
    const now = Date.now() / 1000;

    // Spawn particles based on activity
    for (const [dataType, rate] of Object.entries(this.spawnRates)) {
      if (rate > 0) {
        const timeSinceLastSpawn = now - this.lastSpawnTimes[dataType];
        const spawnInterval = 1 / rate;

        if (timeSinceLastSpawn >= spawnInterval) {
          this.spawnParticle(dataType);
          this.lastSpawnTimes[dataType] = now;
        }
      }
    }

    // Update all particles
    this.particles = this.particles.filter(particle => {
      const stillActive = particle.update(this.processingZone);

      if (!stillActive) {
        particle.destroy();
      }

      return stillActive;
    });

    // Update stats
    this.updateStats();
  }

  spawnParticle(dataType) {
    const path = this.paths[dataType];
    if (!path) return;

    const particle = new DataParticle(dataType, path, this.group);
    this.particles.push(particle);

    this.group.add(particle.mesh);
    this.group.add(particle.trailMesh);
  }

  updateStats() {
    this.stats = {
      audio: 0,
      financial: 0,
      synth: 0,
      anlg: 0
    };

    for (const particle of this.particles) {
      if (particle.type === 'AUDIO') this.stats.audio++;
      else if (particle.type === 'FINANCIAL') this.stats.financial++;
      else if (particle.type === 'SYNTH') this.stats.synth++;
      else if (particle.type === 'ANLG') this.stats.anlg++;
    }
  }

  getStats() {
    return { ...this.stats };
  }

  destroy() {
    this.particles.forEach(p => p.destroy());
    this.particles = [];
  }
}

// ============================================================================
// IVM DOUBLE VORTEX (Contraction/Expansion)
// ============================================================================

export class IVMDoubleVortex {
  constructor(stellaOctangula, cuboctahedron) {
    this.stella = stellaOctangula;
    this.cubo = cuboctahedron;

    this.currentHarmony = 0.3;
    this.currentChaos = 0.3;

    this.targetHarmony = 0.3;
    this.targetChaos = 0.3;

    this.baseScale = {
      stella: LIVING_SYMBOL_CONFIG.IVM_STELLA_SCALE,
      cubo: LIVING_SYMBOL_CONFIG.IVM_CUBO_SCALE
    };
  }

  updateFromArchetype(archetype) {
    // Map MMPA archetypes to harmony/chaos values
    const mapping = {
      'PURE_HARMONY': { harmony: 1.0, chaos: 0.1 },
      'HIGH_HARMONY': { harmony: 0.75, chaos: 0.25 },
      'BALANCED': { harmony: 0.5, chaos: 0.5 },
      'HIGH_CHAOS': { harmony: 0.25, chaos: 0.75 },
      'PURE_CHAOS': { harmony: 0.1, chaos: 1.0 },
      'NEUTRAL_STATE': { harmony: 0.3, chaos: 0.3 }
    };

    const values = mapping[archetype] || mapping['NEUTRAL_STATE'];
    this.targetHarmony = values.harmony;
    this.targetChaos = values.chaos;
  }

  update(breathPhase) {
    // Smooth interpolation to targets
    this.currentHarmony += (this.targetHarmony - this.currentHarmony) * 0.05;
    this.currentChaos += (this.targetChaos - this.currentChaos) * 0.05;

    // === EXPANSION (Cuboctahedron) ===
    // Expands with harmony
    let expansionScale = this.baseScale.cubo * (1.0 + this.currentHarmony * 0.4);

    // Breathing OUT adds expansion
    if (breathPhase > 0) {
      expansionScale *= (1.0 + breathPhase * 0.15);
    }

    this.cubo.scale.setScalar(expansionScale);
    this.cubo.rotation.x -= LIVING_SYMBOL_CONFIG.ROTATION_SPEED * 0.25;

    // === CONTRACTION (Stella Octangula) ===
    // Contracts with chaos (gets smaller toward center)
    let contractionScale = this.baseScale.stella * (1.0 - this.currentChaos * 0.3);

    // Breathing IN adds contraction
    if (breathPhase < 0) {
      contractionScale *= (1.0 + Math.abs(breathPhase) * 0.15);
    }

    this.stella.scale.setScalar(contractionScale);
    this.stella.rotation.y += LIVING_SYMBOL_CONFIG.ROTATION_SPEED * 0.4;

    // Update materials for visual feedback
    if (this.stella.material && this.stella.material.emissiveIntensity !== undefined) {
      this.stella.material.emissiveIntensity = 0.3 + this.currentChaos * 0.5;
    }

    if (this.cubo.material && this.cubo.material.emissiveIntensity !== undefined) {
      this.cubo.material.emissiveIntensity = 0.2 + this.currentHarmony * 0.3;
    }
  }

  pulse() {
    // Called when data is processed - creates a pulse effect
    const originalStella = this.stella.scale.x;
    const originalCubo = this.cubo.scale.x;

    // Quick pulse out then back
    const pulseDuration = 300; // ms

    this.stella.scale.setScalar(originalStella * 1.3);
    this.cubo.scale.setScalar(originalCubo * 1.2);

    setTimeout(() => {
      // Don't reset directly, let update() handle it smoothly
    }, pulseDuration);
  }
}

// ============================================================================
// SLICER VISUALIZATION
// ============================================================================

export class SlicerPlane {
  constructor(helixRadius, yBottom, yTop, chronelixGroup) {
    this.helixRadius = helixRadius;
    this.yBottom = yBottom;
    this.yTop = yTop;
    this.group = chronelixGroup;

    this.position = 0; // -1 to +1
    this.mesh = null;

    this.create();
  }

  create() {
    const size = this.helixRadius * 3;

    // Plane geometry
    const planeGeom = new THREE.PlaneGeometry(size, size);
    const planeMat = new THREE.MeshBasicMaterial({
      color: LIVING_SYMBOL_CONFIG.COLORS.ANLG,
      transparent: true,
      opacity: LIVING_SYMBOL_CONFIG.SLICER_OPACITY,
      side: THREE.DoubleSide
    });

    this.mesh = new THREE.Mesh(planeGeom, planeMat);
    this.mesh.rotation.x = Math.PI / 2; // Horizontal

    // Add grid overlay
    const gridHelper = new THREE.GridHelper(size, 20,
      LIVING_SYMBOL_CONFIG.COLORS.ANLG,
      LIVING_SYMBOL_CONFIG.COLORS.ANLG
    );
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    gridHelper.rotation.x = Math.PI / 2;
    this.mesh.add(gridHelper);

    this.group.add(this.mesh);
  }

  update(time) {
    // Smooth oscillation through structure
    this.position = Math.sin(time * LIVING_SYMBOL_CONFIG.SLICER_SPEED);

    const yRange = (this.yTop - this.yBottom) / 2;
    this.mesh.position.y = this.position * yRange;

    // Subtle opacity pulse
    this.mesh.material.opacity = LIVING_SYMBOL_CONFIG.SLICER_OPACITY +
                                  Math.abs(this.position) * 0.1;
  }

  destroy() {
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

console.log('✅ chronelixLivingSymbol.js ready');
