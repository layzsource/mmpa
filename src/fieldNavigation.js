// src/fieldNavigation.js
// VCN Phase 1: Field Navigation System
// Scans all MMPA systems for navigable events and generates destinations

import * as THREE from 'three';
import { SignalDestination } from './destinations.js';
import { state } from './state.js';

console.log("🌐 fieldNavigation.js loaded");

/**
 * MorphEventAnalyzer — Scans morph geometry for attractors and transitions
 */
class MorphEventAnalyzer {
  constructor() {
    this.lastWeights = null;
  }

  scan(morphMesh, morphWeights) {
    const events = [];

    if (!morphMesh || !morphWeights) return events;

    // Detect dominant shape (weight > 0.5) = Morphic Attractor
    for (const [shape, weight] of Object.entries(morphWeights)) {
      if (weight > 0.5) {
        events.push({
          type: 'morphic_attractor',
          category: 'geometry',
          position: morphMesh.position.clone(),
          signalWeight: weight,
          metadata: { dominantShape: shape }
        });
      }
    }

    // Detect shape transitions (weight change > 0.1)
    if (this.lastWeights) {
      for (const [shape, weight] of Object.entries(morphWeights)) {
        const lastWeight = this.lastWeights[shape] || 0;
        const delta = Math.abs(weight - lastWeight);

        if (delta > 0.1) {
          events.push({
            type: 'shape_transition',
            category: 'geometry',
            position: morphMesh.position.clone().add(new THREE.Vector3(0, 5, 0)),
            signalWeight: delta,
            metadata: { shape, delta }
          });
        }
      }
    }

    // Detect geometric singularity (all weights within 0.1 of each other)
    const weights = Object.values(morphWeights);
    const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
    const variance = weights.reduce((sum, w) => sum + Math.pow(w - avgWeight, 2), 0) / weights.length;

    if (variance < 0.01) { // Very low variance = balanced
      events.push({
        type: 'geometric_singularity',
        category: 'geometry',
        position: morphMesh.position.clone(),
        signalWeight: 1.0 - variance * 10, // High signal when balanced
        metadata: { variance }
      });
    }

    this.lastWeights = { ...morphWeights };
    return events;
  }
}

/**
 * MandalaEventAnalyzer — Scans mandala rings for resonance nodes
 */
class MandalaEventAnalyzer {
  scan(mandalaState) {
    const events = [];

    if (!mandalaState || !mandalaState.enabled) return events;

    const { rings, symmetry, ringRadii, radiusPulse, layoutMode } = mandalaState;

    // Generate resonance nodes at each ring × symmetry position
    for (let ringIndex = 0; ringIndex < rings; ringIndex++) {
      const radius = ringRadii[ringIndex] || (ringIndex * 2);
      const pulseRadius = radius * (1 + (radiusPulse || 0));

      for (let symIndex = 0; symIndex < symmetry; symIndex++) {
        const angle = (symIndex / symmetry) * Math.PI * 2;
        const x = Math.cos(angle) * pulseRadius;
        const y = Math.sin(angle) * pulseRadius;

        events.push({
          type: 'resonance_node',
          category: 'mandala',
          position: new THREE.Vector3(x, y, 0),
          signalWeight: 0.3 + (radiusPulse || 0) * 0.5,
          metadata: { ringIndex, symIndex, angle }
        });
      }
    }

    // Spiral vortex when layoutMode is 'spiral'
    if (layoutMode === 'spiral') {
      events.push({
        type: 'spiral_vortex',
        category: 'mandala',
        position: new THREE.Vector3(0, 0, 0),
        signalWeight: 0.8,
        metadata: { layoutMode }
      });
    }

    // Ring pulse event when radiusPulse > 0.3
    if ((radiusPulse || 0) > 0.3) {
      events.push({
        type: 'ring_pulse_wave',
        category: 'mandala',
        position: new THREE.Vector3(0, 0, 0),
        signalWeight: radiusPulse,
        metadata: { radiusPulse }
      });
    }

    return events;
  }
}

/**
 * VesselEventAnalyzer — Scans vessel/Conflat-6 for directional beacons
 */
class VesselEventAnalyzer {
  scan(vesselGroup, vesselState) {
    const events = [];

    if (!vesselGroup || !vesselState || !vesselState.enabled) return events;

    const { mode, spinSpeedX, spinSpeedY, spinSpeedZ, scale } = vesselState;

    // Conflat-6 directional beacons (fixed)
    if (mode === 'conflat6' || mode === 'conflat6cube') {
      const directions = [
        { dir: [0, 0, 1], label: 'North', color: '#00ffff' },
        { dir: [0, 0, -1], label: 'South', color: '#ff00ff' },
        { dir: [1, 0, 0], label: 'East', color: '#ff0000' },
        { dir: [-1, 0, 0], label: 'West', color: '#00ff00' },
        { dir: [0, 1, 0], label: 'Up', color: '#0000ff' },
        { dir: [0, -1, 0], label: 'Down', color: '#ffff00' }
      ];

      directions.forEach(({ dir, label, color }) => {
        const distance = 1.5 * scale;
        events.push({
          type: 'directional_beacon',
          category: 'vessel',
          position: new THREE.Vector3(dir[0] * distance, dir[1] * distance, dir[2] * distance),
          signalWeight: 0.9,
          metadata: { direction: label, color }
        });
      });
    }

    // Spin vortex when spin is enabled
    if (vesselState.spinEnabled) {
      const spinMagnitude = Math.sqrt(spinSpeedX * spinSpeedX + spinSpeedY * spinSpeedY + spinSpeedZ * spinSpeedZ);
      if (spinMagnitude > 0.001) {
        events.push({
          type: 'spin_vortex',
          category: 'vessel',
          position: new THREE.Vector3(0, 0, 0),
          signalWeight: Math.min(spinMagnitude * 100, 1.0),
          metadata: { spinMagnitude }
        });
      }
    }

    return events;
  }
}

/**
 * StreamEventAnalyzer — Scans emoji streams for convergence points
 */
class StreamEventAnalyzer {
  scan(emojiStreams) {
    const events = [];

    if (!emojiStreams || emojiStreams.length === 0) return events;

    // Find cluster centroids (convergence points)
    const clusters = this.findClusters(emojiStreams, 2.0);

    clusters.forEach(cluster => {
      if (cluster.streams.length >= 5) {
        events.push({
          type: 'stream_convergence',
          category: 'streams',
          position: cluster.centroid,
          signalWeight: Math.min(cluster.streams.length / 10, 1.0),
          metadata: { streamCount: cluster.streams.length }
        });
      }
    });

    // Detect high-velocity zones
    emojiStreams.forEach(stream => {
      if (stream.velocity && stream.velocity.length() > 0.5) {
        events.push({
          type: 'velocity_gradient_peak',
          category: 'streams',
          position: stream.position.clone(),
          signalWeight: Math.min(stream.velocity.length() / 2, 1.0),
          metadata: { velocity: stream.velocity.length() }
        });
      }
    });

    return events;
  }

  findClusters(streams, radius) {
    const clusters = [];
    const used = new Set();

    streams.forEach((stream, i) => {
      if (used.has(i)) return;

      const cluster = { streams: [stream], centroid: stream.position.clone() };
      used.add(i);

      // Find nearby streams
      streams.forEach((other, j) => {
        if (i !== j && !used.has(j) && stream.position.distanceTo(other.position) < radius) {
          cluster.streams.push(other);
          used.add(j);
        }
      });

      // Calculate centroid
      if (cluster.streams.length > 1) {
        const sum = cluster.streams.reduce((acc, s) => acc.add(s.position), new THREE.Vector3(0, 0, 0));
        cluster.centroid = sum.divideScalar(cluster.streams.length);
      }

      clusters.push(cluster);
    });

    return clusters;
  }
}

/**
 * ParticleEventAnalyzer — Scans particle system for Chladni/Moiré patterns
 */
class ParticleEventAnalyzer {
  scan(particleSystem) {
    const events = [];

    if (!particleSystem || !state.particles) return events;

    const { chladniEnabled, moireEnabled, chladniM, chladniN, moireScale } = state.particles;
    const { bass, mid } = state.audio;

    // Chladni resonance nodes
    if (chladniEnabled) {
      const m = chladniM + Math.floor((bass || 0) * 3);
      const n = chladniN + Math.floor((mid || 0) * 3);

      // Sample Chladni field for nodes
      for (let x = -5; x <= 5; x += 1.5) {
        for (let y = -5; y <= 5; y += 1.5) {
          const chladniValue = Math.cos(n * Math.PI * x) * Math.cos(m * Math.PI * y) +
                              Math.cos(m * Math.PI * x) * Math.cos(n * Math.PI * y);

          if (Math.abs(chladniValue) < 0.2) {
            const signalWeight = 1.0 - Math.abs(chladniValue) * 5;
            events.push({
              type: 'chladni_node',
              category: 'particles',
              position: new THREE.Vector3(x * 5, y * 5, 0),
              signalWeight,
              metadata: { m, n, chladniValue }
            });
          }
        }
      }
    }

    // Moiré interference storms
    if (moireEnabled) {
      const freq1 = 2.0 * moireScale;
      const freq2 = 2.1 * moireScale;

      for (let x = -5; x <= 5; x += 1.5) {
        for (let y = -5; y <= 5; y += 1.5) {
          const pattern1 = Math.sin(x * freq1) * Math.sin(y * freq1);
          const pattern2 = Math.sin(x * freq2) * Math.sin(y * freq2);
          const interference = pattern1 * pattern2;

          if (Math.abs(interference) > 0.7) {
            events.push({
              type: 'moiré_storm',
              category: 'particles',
              position: new THREE.Vector3(x * 5, y * 5, Math.sin(x * y) * 2),
              signalWeight: Math.abs(interference),
              metadata: { interference }
            });
          }
        }
      }
    }

    return events;
  }
}

/**
 * SpriteEventAnalyzer — Scans sprite system for clusters
 */
class SpriteEventAnalyzer {
  scan(spriteGroup) {
    const events = [];

    if (!spriteGroup || !state.sprites?.enabled) return events;

    // Calculate sprite cluster centroid
    if (spriteGroup.children && spriteGroup.children.length > 0) {
      const centroid = new THREE.Vector3();
      spriteGroup.children.forEach(sprite => {
        centroid.add(sprite.position);
      });
      centroid.divideScalar(spriteGroup.children.length);

      events.push({
        type: 'sprite_cluster',
        category: 'sprites',
        position: centroid,
        signalWeight: 0.5,
        metadata: { count: spriteGroup.children.length }
      });
    }

    return events;
  }
}

/**
 * TelemetryEventAnalyzer — Scans audio telemetry for spectral events
 */
class TelemetryEventAnalyzer {
  constructor() {
    this.lastFlux = 0;
    this.lastPitch = 0;
  }

  scan(audioData, telemetry) {
    const events = [];

    if (!audioData || !state.audioReactive) return events;

    // Spectral flux surge
    if (telemetry?.spectralFlux > 0.7) {
      events.push({
        type: 'spectral_flux_surge',
        category: 'telemetry',
        position: new THREE.Vector3(0, 10, 0),
        signalWeight: telemetry.spectralFlux,
        metadata: { flux: telemetry.spectralFlux }
      });
    }

    // Frequency band nexuses (vertical stack)
    const bands = ['sub', 'bass', 'mid', 'highMid', 'treble'];
    bands.forEach((band, index) => {
      const value = audioData[band] || 0;
      if (value > 0.3) {
        events.push({
          type: 'frequency_band_nexus',
          category: 'telemetry',
          position: new THREE.Vector3(0, index * 5, 0),
          signalWeight: value,
          metadata: { band, value }
        });
      }
    });

    // Pitch beacon (if pitch is stable)
    if (telemetry?.pitch && Math.abs(telemetry.pitch - this.lastPitch) < 10) {
      const pitch = telemetry.pitch;
      events.push({
        type: 'pitch_beacon',
        category: 'telemetry',
        position: new THREE.Vector3(pitch / 100, Math.sin(pitch) * 5, Math.cos(pitch) * 5),
        signalWeight: 0.7,
        metadata: { pitch }
      });
    }

    this.lastPitch = telemetry?.pitch || 0;
    return events;
  }
}

/**
 * ParameterEventAnalyzer — Detects parameter space changes
 */
class ParameterEventAnalyzer {
  constructor() {
    this.lastParams = this.captureParameters();
  }

  captureParameters() {
    return {
      hue: state.particles?.hue || 0,
      count: state.particles?.count || 0,
      scale: state.scale || 1.0,
      opacity: state.particles?.opacity || 0.5,
      timestamp: performance.now()
    };
  }

  scan() {
    const events = [];
    const current = this.captureParameters();
    const dt = current.timestamp - this.lastParams.timestamp;

    // Hue shift (circular path around color wheel)
    if (current.hue !== this.lastParams.hue) {
      const angle = current.hue * Math.PI / 180;
      const velocity = Math.abs(current.hue - this.lastParams.hue) / dt;

      events.push({
        type: 'hue_shift_portal',
        category: 'parameters',
        position: new THREE.Vector3(Math.cos(angle) * 10, Math.sin(angle) * 10, 0),
        signalWeight: Math.min(velocity * 100, 1.0),
        metadata: { hue: current.hue, velocity }
      });
    }

    // Density change (radial distance)
    if (current.count !== this.lastParams.count) {
      const delta = current.count - this.lastParams.count;
      const radius = (current.count / 10000) * 15;

      events.push({
        type: 'density_wave',
        category: 'parameters',
        position: new THREE.Vector3(radius, 0, 0),
        signalWeight: Math.min(Math.abs(delta) / 1000, 1.0),
        metadata: { count: current.count, delta }
      });
    }

    // Scale change (vertical height)
    if (current.scale !== this.lastParams.scale) {
      events.push({
        type: 'scale_expansion',
        category: 'parameters',
        position: new THREE.Vector3(0, current.scale * 10, 0),
        signalWeight: Math.abs(current.scale - this.lastParams.scale),
        metadata: { scale: current.scale }
      });
    }

    this.lastParams = current;
    return events;
  }
}

/**
 * ControlEventAnalyzer — Monitors control events (MIDI, presets)
 */
class ControlEventAnalyzer {
  constructor() {
    this.lastInterpolationActive = false;
  }

  scan(interpolation, morphChain) {
    const events = [];

    // Preset transition corridor
    if (interpolation?.active && !this.lastInterpolationActive) {
      events.push({
        type: 'preset_transition',
        category: 'controls',
        position: new THREE.Vector3(0, 5, 10),
        signalWeight: 0.8,
        metadata: { targetPreset: interpolation.targetState }
      });
    }

    this.lastInterpolationActive = interpolation?.active || false;

    // Morph chain waypoint
    if (morphChain?.active) {
      events.push({
        type: 'chain_waypoint',
        category: 'controls',
        position: new THREE.Vector3(morphChain.currentIndex * 5, 0, 0),
        signalWeight: 0.6,
        metadata: { index: morphChain.currentIndex }
      });
    }

    return events;
  }
}

/**
 * ExpandedFieldNavigationSystem — Main field scanner
 */
export class ExpandedFieldNavigationSystem {
  constructor(scene, components) {
    this.scene = scene;
    this.components = components;

    this.updateInterval = 1000; // 1 second scan
    this.lastUpdate = 0;

    // Initialize all 9 analyzers
    this.morphAnalyzer = new MorphEventAnalyzer();
    this.mandalaAnalyzer = new MandalaEventAnalyzer();
    this.vesselAnalyzer = new VesselEventAnalyzer();
    this.streamAnalyzer = new StreamEventAnalyzer();
    this.particleAnalyzer = new ParticleEventAnalyzer();
    this.spriteAnalyzer = new SpriteEventAnalyzer();
    this.telemetryAnalyzer = new TelemetryEventAnalyzer();
    this.parameterAnalyzer = new ParameterEventAnalyzer();
    this.controlAnalyzer = new ControlEventAnalyzer();

    console.log("🌐 ExpandedFieldNavigationSystem initialized with 9 analyzers");
  }

  update(time, destinationManager, camera) {
    // Don't run for first 3 seconds to allow systems to initialize
    if (!this.startTime) {
      this.startTime = time;
      return;
    }
    if (time - this.startTime < 3000) return;

    if (time - this.lastUpdate < this.updateInterval) return;

    try {
      // Clear old auto-generated destinations
      destinationManager.destinations = destinationManager.destinations.filter(
        d => !d.autoGenerated
      );

      const events = [];

      // Scan all event sources
      // 1. Morph geometry
      if (this.components.morphMesh && state.morphWeights) {
        events.push(...this.morphAnalyzer.scan(this.components.morphMesh, state.morphWeights));
      }

      // 2. Mandala rings
      if (state.emojiMandala?.enabled) {
        events.push(...this.mandalaAnalyzer.scan(state.emojiMandala));
      }

      // 3. Vessel/Conflat-6
      if (this.components.vesselGroup && state.vessel?.enabled) {
        events.push(...this.vesselAnalyzer.scan(this.components.vesselGroup, state.vessel));
      }

      // 4. Emoji streams
      if (window.emojiStreams && state.emojiPhysics?.enabled) {
        events.push(...this.streamAnalyzer.scan(window.emojiStreams));
      }

      // 5. Particle fields
      if (this.components.particleSystem) {
        events.push(...this.particleAnalyzer.scan(this.components.particleSystem));
      }

      // 6. Sprites
      if (this.components.spriteGroup) {
        events.push(...this.spriteAnalyzer.scan(this.components.spriteGroup));
      }

      // 7. Telemetry
      if (state.audio && state.audioReactive) {
        events.push(...this.telemetryAnalyzer.scan(state.audio, state.telemetry));
      }

      // 8. Parameters
      events.push(...this.parameterAnalyzer.scan());

      // 9. Controls
      events.push(...this.controlAnalyzer.scan(state.interpolation, window.morphChain));

      // Convert events to destinations
      events.forEach(event => {
        const destination = new SignalDestination(
          event.type,
          event.position,
          event.signalWeight,
          event.category
        );
        destination.autoGenerated = true;
        destination.metadata = event.metadata;
        destinationManager.add(destination);
      });

      const stats = destinationManager.getStats();
      // console.log(`🌐 Field scan);

      this.lastUpdate = time;
    } catch (error) {
      console.error("🌐 Field scan error:", error);
      // Still update lastUpdate to avoid hammering on errors
      this.lastUpdate = time;
    }
  }

  getActiveSourceCount() {
    let count = 0;
    if (state.morphWeights) count++;
    if (state.emojiMandala?.enabled) count++;
    if (state.vessel?.enabled) count++;
    if (state.emojiPhysics?.enabled) count++;
    if (this.components.particleSystem) count++;
    if (state.sprites?.enabled) count++;
    if (state.audioReactive) count++;
    count += 2; // Always track parameters + controls
    return count;
  }
}

// console.log("🌐 Field);
