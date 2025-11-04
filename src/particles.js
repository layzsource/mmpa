// particles.js
// Phase 4.9.0 — Stable Particle Baseline
// InstancedMesh particle system with per-particle hue spread, organic motion, audio reactivity

import * as THREE from 'three';
import { SHADOW_LAYER } from './constants.js'; // Phase 2.3.3
import { getEffectiveAudio, state } from './state.js'; // Phase 11.4.3: Stable audio gate + Phase 11.7: state access

// Phase 11.7.22: Musical scale definitions (intervals from root)
const MUSICAL_SCALES = {
  Major: [0, 2, 4, 5, 7, 9, 11], // Ionian
  Minor: [0, 2, 3, 5, 7, 8, 10], // Natural minor
  Pentatonic: [0, 2, 4, 7, 9], // Major pentatonic
  Dorian: [0, 2, 3, 5, 7, 9, 10],
  Phrygian: [0, 1, 3, 5, 7, 8, 10],
  Lydian: [0, 2, 4, 6, 7, 9, 11],
  Mixolydian: [0, 2, 4, 5, 7, 9, 10],
  Chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

// Phase 11.7.22: Circle of Fifths ordering (chromatic positions)
const CIRCLE_OF_FIFTHS = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];

export class ParticleSystem {
  constructor(scene, count = 5000) {
    this.scene = scene;
    this.count = count;

    this.angles    = new Float32Array(this.count);
    this.radii     = new Float32Array(this.count);

    // Phase 11.7: Base velocity storage (x, y, z per particle)
    this.velocities = new Float32Array(this.count * 3);
    this.targets   = new Float32Array(this.count * 3);

    this.orbitalSpeed    = 0.05;
    this.smoothness      = 0.5;
    this.opacity         = 1.0;
    this.organicStrength = 0.2;

    // Phase 11.5.2: Lightweight organic drift (sine+cos jitter, per-axis amp)
    this.driftOffsets = [];
    for (let i = 0; i < this.count; i++) {
      this.driftOffsets.push({
        // random phase per axis
        x: Math.random() * Math.PI * 2,
        y: Math.random() * Math.PI * 2,
        z: Math.random() * Math.PI * 2,
        // speed scalar
        s: 0.6 + Math.random() * 0.8,
        // per-axis amplitude jitter (kept small; multiplied later by organic strength)
        ax: 0.6 + Math.random() * 0.8,
        ay: 0.6 + Math.random() * 0.8,
        az: 0.6 + Math.random() * 0.8,
        // second-octave contribution (adds wobble)
        a2: 0.3 + Math.random() * 0.5
      });
    }

    this.hueShift      = 0.0;
    this.audioReactive = true;
    this.audioLevel    = 0.0;
    this.audioGain     = 2.0;

    this.sizeWorld     = 0.5;
    this.currentLayout = 'orbit';
    this.vesselGroup   = null; // Phase 2.3.1: Reference to Vessel for coupled rotation

    // Phase 13.4: Chladni & Moiré pattern modes
    this.chladniEnabled = false;
    this.moireEnabled = false;
    this.chladniM = 3;
    this.chladniN = 4;
    this.chladniFrequency = 1.0;
    this.chladniPhase = 0;
    this.moireScale = 1.0;
    this.moireRotation = 0;
    this.moireSpeed = 0.01;

    // Phase 13.6: Advanced cymatic modes
    this.spectrogramEnabled = false;
    this.spectrogramBands = 32;          // Number of frequency bands
    this.spectrogramRadius = 8;          // Radius of mandala
    this.spectrogramRotation = 0;
    this.spectrogramSpeed = 0.01;

    this.phaseShiftEnabled = false;
    this.phaseShiftLayers = 3;           // Number of interference layers
    this.phaseShiftSpeed = 0.02;
    this.phaseShiftPhase = 0;
    this.phaseShiftDepth = 1.0;          // Holographic depth

    this.diffractionEnabled = false;
    this.diffractionIntensity = 1.0;     // Color intensity
    this.diffractionAngle = 0;           // Prism angle
    this.diffractionSpeed = 0.01;

    // MMPA Phase 3: Dynamic particle density control
    this.maxParticleCount = count;       // Maximum allocated particles
    this.targetDensity = 1.0;            // Target density (0.0 - 1.0)
    this.currentDensity = 1.0;           // Current density (smoothly interpolated)
    this.densitySmoothing = 0.05;        // Smoothing factor for density transitions

    // MMPA Phase 3: Dynamic animation speed control (TRANSFORMATION mapping)
    this.mmpaSpeedMultiplier = 1.0;      // Animation speed multiplier from features
    this.targetSpeedMultiplier = 1.0;    // Target speed (smoothly interpolated)
    this.speedSmoothing = 0.03;          // Smoothing for speed transitions

    // MMPA Phase 3: Dynamic stability control (ALIGNMENT mapping)
    this.baseSmoothing = 0.5;            // Base smoothness value (from constructor)
    this.targetSmoothing = 0.5;          // Target smoothness from features
    this.baseOrganicStrength = 0.2;      // Base organic strength (from constructor)
    this.targetOrganicStrength = 0.2;    // Target organic strength from features
    this.stabilitySmoothing = 0.02;      // Smoothing for stability transitions

    // MMPA Phase 3: Geometric harmony control (RELATIONSHIP mapping)
    this.symmetryOrder = 6;              // Current symmetry order (3-12 fold)
    this.targetSymmetryOrder = 6;        // Target symmetry order from consonance
    this.geometricSubdivision = 1.0;     // Geometric detail level (0.5 - 2.0)
    this.targetGeometricSubdivision = 1.0; // Target subdivision from complexity
    this.harmonicProportions = 1.0;      // Scale proportion multiplier (0.8 - 1.2)
    this.targetHarmonicProportions = 1.0; // Target proportions from harmonic order
    this.harmonySmoothing = 0.015;       // Smoothing for harmony transitions (slowest)

    // Phase 2.3.2A/C/D: Particle trails (LineSegments)
    this.trailEnabled         = false;
    this.trailLength          = 0;     // default off (0-10 frames)
    this.trailOpacity         = 0.3;   // default opacity
    this.trailFade            = 1.0;   // Phase 2.3.2C: fade strength (0=no fade, 1=full taper)
    this.trailAudioReactive   = false; // Phase 2.3.2D: audio-reactive trail length
    this.trailLengthMin       = 2;     // Phase 2.3.2D: shortest trail (quiet audio)
    this.trailLengthMax       = 10;    // Phase 2.3.2D: longest trail (loud audio)
    this.trailHistory         = [];    // array of position snapshots
    this.maxTrailLength       = 20;    // Expanded to support max range

    const baseGeom = new THREE.SphereGeometry(1, 6, 6);

    // Uniforms
    this.uniforms = {
      uSize:            { value: this.sizeWorld },
      uOpacity:         { value: this.opacity },
      uHueShift:        { value: this.hueShift },
      uAudioReactive:   { value: this.audioReactive },
      uAudioLevel:      { value: 0.0 },
      uBrightnessBoost: { value: 1.0 },
    };

    // Shaders
    const vertexShader = `
      uniform float uSize;
      uniform float uHueShift;
      uniform bool  uAudioReactive;
      uniform float uAudioLevel;

      attribute float aBaseHue;
      attribute float aPhase;

      varying float vHue;

      void main() {
        vec3 p = position * uSize;
        vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        float audioHue = uAudioLevel * 360.0;
        float finalHue = uAudioReactive
          ? mod(uHueShift + audioHue + aBaseHue + aPhase * 30.0, 360.0)
          : mod(uHueShift + aBaseHue, 360.0);
        vHue = finalHue;
      }
    `;

    const fragmentShader = `
      precision mediump float;
      uniform float uOpacity;
      uniform float uBrightnessBoost;
      varying float vHue;

      vec3 hsl2rgb(float h, float s, float l) {
        float c = (1.0 - abs(2.0*l - 1.0)) * s;
        float hp = h * 6.0;
        float x = c * (1.0 - abs(mod(hp, 2.0) - 1.0));
        vec3 rgb;
        if      (0.0 <= hp && hp < 1.0) rgb = vec3(c, x, 0.0);
        else if (1.0 <= hp && hp < 2.0) rgb = vec3(x, c, 0.0);
        else if (2.0 <= hp && hp < 3.0) rgb = vec3(0.0, c, x);
        else if (3.0 <= hp && hp < 4.0) rgb = vec3(0.0, x, c);
        else if (4.0 <= hp && hp < 5.0) rgb = vec3(x, 0.0, c);
        else                            rgb = vec3(c, 0.0, x);
        float m = l - 0.5 * c;
        return rgb + vec3(m);
      }

      void main() {
        float h = vHue / 360.0;
        float brightness = 0.5 * uBrightnessBoost;
        vec3 color = hsl2rgb(h, 1.0, brightness);
        gl_FragColor = vec4(color, uOpacity);
      }
    `;

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    this.mesh = new THREE.InstancedMesh(baseGeom, this.material, this.count);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Phase 2.3.3: Disable shadow layer by default (HUD controlled)
    this.mesh.layers.disable(SHADOW_LAYER);

    scene.add(this.mesh);

    // Per-instance attributes
    const aBaseHue = new Float32Array(this.count);
    const aPhase   = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      aBaseHue[i] = Math.random() * 360.0;
      aPhase[i]   = Math.random();

      this.angles[i] = Math.random() * Math.PI * 2;
      this.radii[i]  = 2 + Math.random() * 5;

      // Phase 11.7: Initialize base velocities
      const vi = i * 3;
      this.velocities[vi]     = (Math.random() - 0.5) * 0.002;
      this.velocities[vi + 1] = (Math.random() - 0.5) * 0.002;
      this.velocities[vi + 2] = (Math.random() - 0.5) * 0.002;
    }

    this.geometry = baseGeom;
    this.geometry.setAttribute('aBaseHue', new THREE.InstancedBufferAttribute(aBaseHue, 1));
    this.geometry.setAttribute('aPhase',   new THREE.InstancedBufferAttribute(aPhase, 1));

    // Phase 2.3.2B: Store base hue for trail color computation
    this.particleBaseHues = aBaseHue;

    this._tmpMatrix = new THREE.Matrix4();
    this._tmpQuat   = new THREE.Quaternion();
    this._tmpScale  = new THREE.Vector3(1, 1, 1);
    this._tmpPos    = new THREE.Vector3();

    // Phase 2.3.2E: Create preallocated trail buffers for performance
    // Max segments: each particle can have maxTrailLength segments, each segment has 2 vertices
    this.maxSegments = this.count * this.maxTrailLength * 2;
    this.trailSegmentArray = new Float32Array(this.maxSegments * 3); // xyz per vertex
    this.trailColorArray = new Float32Array(this.maxSegments * 3);   // rgb per vertex

    this.trailGeometry = new THREE.BufferGeometry();
    this.trailGeometry.setAttribute('position', new THREE.BufferAttribute(this.trailSegmentArray, 3));
    this.trailGeometry.setAttribute('color', new THREE.BufferAttribute(this.trailColorArray, 3));
    this.trailGeometry.setDrawRange(0, 0); // Start with no segments drawn

    this.trailMaterial = new THREE.LineBasicMaterial({
      vertexColors: true, // Phase 2.3.2B: Use per-vertex colors
      transparent: true,
      opacity: this.trailOpacity,
    });

    this.trailLines = new THREE.LineSegments(this.trailGeometry, this.trailMaterial);
    this.trailLines.visible = false; // Hidden by default

    // Phase 2.3.3: Disable shadow layer by default for trails too
    this.trailLines.layers.disable(SHADOW_LAYER);

    scene.add(this.trailLines);

    this._initParticles();
    this.setLayout('orbit');

    // Phase 11.4.2S: Log per-axis drift initialization
    console.log(`✨ Particle drift initialized for ${this.count} particles`);
  }

  _initParticles() {
    for (let i = 0; i < this.count; i++) {
      const x = Math.cos(this.angles[i]) * this.radii[i];
      const y = Math.sin(this.angles[i]) * this.radii[i];
      const z = 0;

      const ti = i * 3;
      this.targets[ti]     = x;
      this.targets[ti + 1] = y;
      this.targets[ti + 2] = z;

      this._tmpPos.set(x, y, z);
      this._tmpMatrix.compose(this._tmpPos, this._tmpQuat, this._tmpScale);
      this.mesh.setMatrixAt(i, this._tmpMatrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  setLayout(layout) {
    this.currentLayout = layout;
  }

  // MMPA Phase 3: Set target particle density (0.0 - 1.0)
  setDensityMultiplier(multiplier) {
    this.targetDensity = Math.max(0.0, Math.min(1.0, multiplier));
  }

  // MMPA Phase 3: Set animation speed multiplier (0.5x - 2.0x)
  setAnimationSpeed(multiplier) {
    this.targetSpeedMultiplier = Math.max(0.1, Math.min(3.0, multiplier));
  }

  // MMPA Phase 3: Set form stability from alignment features
  setFormStability(stability) {
    // High stability (alignment) → High smoothness (0.2 - 0.9 range)
    this.targetSmoothing = 0.2 + (stability * 0.7);
    // High stability (alignment) → Low organic strength (0.05 - 0.4 range, inverted)
    this.targetOrganicStrength = 0.4 - (stability * 0.35);
  }

  // MMPA Phase 3: Set geometric harmony from relationship features
  setGeometricHarmony(consonance, complexity, harmonicOrder) {
    // consonance (0-1) → symmetryOrder (3-12 fold)
    // Perfect consonance = 12-fold (octaves, perfect fifths)
    // Dissonance = 3-fold (tritones, "wolf" intervals)
    this.targetSymmetryOrder = Math.round(3 + consonance * 9);

    // complexity (0-10 normalized to 0-1) → geometricSubdivision (0.5-2.0)
    // Simple intervals = sparse geometry
    // Complex polyphony = dense geometry
    const normalizedComplexity = Math.min(1.0, complexity / 10);
    this.targetGeometricSubdivision = 0.5 + normalizedComplexity * 1.5;

    // harmonicOrder (0-1) → harmonicProportions (0.8-1.2)
    // Pure ratios = golden proportions
    // Complex ratios = distorted proportions
    this.targetHarmonicProportions = 0.8 + harmonicOrder * 0.4;
  }

  updateLayoutVesselPlanes() {
    const radius = 2.0;
    for (let i = 0; i < this.count; i++) {
      const ti = i * 3;
      const plane = i % 6;
      const angle = (i / this.count) * Math.PI * 2;

      switch (plane) {
        case 0: // +X
          this.targets[ti]     = radius;
          this.targets[ti + 1] = Math.cos(angle) * radius;
          this.targets[ti + 2] = Math.sin(angle) * radius;
          break;
        case 1: // -X
          this.targets[ti]     = -radius;
          this.targets[ti + 1] = Math.cos(angle) * radius;
          this.targets[ti + 2] = Math.sin(angle) * radius;
          break;
        case 2: // +Y
          this.targets[ti]     = Math.cos(angle) * radius;
          this.targets[ti + 1] = radius;
          this.targets[ti + 2] = Math.sin(angle) * radius;
          break;
        case 3: // -Y
          this.targets[ti]     = Math.cos(angle) * radius;
          this.targets[ti + 1] = -radius;
          this.targets[ti + 2] = Math.sin(angle) * radius;
          break;
        case 4: // +Z
          this.targets[ti]     = Math.cos(angle) * radius;
          this.targets[ti + 1] = Math.sin(angle) * radius;
          this.targets[ti + 2] = radius;
          break;
        case 5: // -Z
          this.targets[ti]     = Math.cos(angle) * radius;
          this.targets[ti + 1] = Math.sin(angle) * radius;
          this.targets[ti + 2] = -radius;
          break;
      }

      // Organic jitter overlay
      const jitter = this.organicStrength * 0.1;
      this.targets[ti]     += (Math.random() - 0.5) * jitter;
      this.targets[ti + 1] += (Math.random() - 0.5) * jitter;
      this.targets[ti + 2] += (Math.random() - 0.5) * jitter;
    }
  }

  update() {
    const t = Date.now() * 0.001;
    const sm = this.smoothness;

    // Audio Gating Fix: Get audio data through centralized gating once at top
    const a = getEffectiveAudio();
    const audioMix = this.audioReactive ? ((a.bass + a.mid + a.treble) / 3) * this.audioGain : 0.0;

    // MMPA Phase 3: Smooth density interpolation
    this.currentDensity += (this.targetDensity - this.currentDensity) * this.densitySmoothing;
    const visibleCount = Math.floor(this.currentDensity * this.maxParticleCount);

    // Update mesh count to control how many instances are rendered
    if (this.mesh && this.mesh.count !== visibleCount) {
      this.mesh.count = Math.max(1, visibleCount); // Ensure at least 1 particle
    }

    // MMPA Phase 3: Smooth animation speed interpolation
    this.mmpaSpeedMultiplier += (this.targetSpeedMultiplier - this.mmpaSpeedMultiplier) * this.speedSmoothing;
    const effectiveTime = t * this.mmpaSpeedMultiplier; // Apply speed to time itself

    // MMPA Phase 3: Smooth stability interpolation (ALIGNMENT features)
    this.smoothness += (this.targetSmoothing - this.smoothness) * this.stabilitySmoothing;
    this.organicStrength += (this.targetOrganicStrength - this.organicStrength) * this.stabilitySmoothing;

    // MMPA Phase 3: Smooth harmony interpolation (RELATIONSHIP features)
    this.symmetryOrder += (this.targetSymmetryOrder - this.symmetryOrder) * this.harmonySmoothing;
    this.geometricSubdivision += (this.targetGeometricSubdivision - this.geometricSubdivision) * this.harmonySmoothing;
    this.harmonicProportions += (this.targetHarmonicProportions - this.harmonicProportions) * this.harmonySmoothing;

    // Phase 13.6: Update cymatic animation phases (with MMPA speed)
    this.spectrogramRotation += this.spectrogramSpeed * (1 + audioMix * 2);
    this.phaseShiftPhase += this.phaseShiftSpeed * (1 + audioMix * 2);
    this.diffractionAngle += this.diffractionSpeed * (1 + audioMix * 2);
    this.chladniPhase += this.chladniFrequency * 0.05 * (1 + audioMix);
    this.moireRotation += this.moireSpeed * (1 + audioMix);

    for (let i = 0; i < this.count; i++) {
      const ti = i * 3;

      switch (this.currentLayout) {
        case 'orbit': {
          // Phase 4.8.1.7: Decoupled organic motion (MMPA Phase 3: with speed multiplier)
          // Base orbital rotation (controlled by orbitalSpeed + MMPA speed)
          this.angles[i] += this.orbitalSpeed * 0.01 * this.mmpaSpeedMultiplier;

          // MMPA Phase 3: Apply harmonic geometry (RELATIONSHIP features)
          // 1. Symmetry Order: Quantize angle to create n-fold radial symmetry
          const symmetryAngleStep = (Math.PI * 2) / this.symmetryOrder;
          const quantizedAngle = Math.round(this.angles[i] / symmetryAngleStep) * symmetryAngleStep;

          // Blend between organic (free angle) and harmonic (quantized angle) based on consonance
          // High consonance = strong quantization, low consonance = more organic
          const consonanceBlend = Math.max(0, Math.min(1, (this.symmetryOrder - 3) / 9)); // 0-1 from symmetry order
          const harmonicAngle = this.angles[i] * (1 - consonanceBlend) + quantizedAngle * consonanceBlend;

          // 2. Geometric Subdivision: Create concentric rings based on complexity
          const ringIndex = Math.floor((i / this.count) * this.geometricSubdivision * 3); // 0-3 rings
          const ringRadius = 1.0 + ringIndex * 0.7; // Rings at 1.0, 1.7, 2.4, 3.1...

          // 3. Harmonic Proportions: Scale overall radius by golden/simple ratios
          const baseRadius = this.radii[i] * ringRadius * this.harmonicProportions;

          // Organic wander (controlled by organicStrength + MMPA speed)
          const angleJitter  = this.organicStrength * 0.05 * Math.sin(effectiveTime * 0.3 + i * 0.17);
          const radiusJitter = this.organicStrength * Math.sin(effectiveTime * 0.5 + i * 0.23);

          // Final position with harmonic structure + organic jitter
          this.targets[ti]     = Math.cos(harmonicAngle + angleJitter) * (baseRadius + radiusJitter);
          this.targets[ti + 1] = Math.sin(harmonicAngle + angleJitter) * (baseRadius + radiusJitter);
          this.targets[ti + 2] = radiusJitter * 0.5;
          break;
        }
        case 'sphere': {
          // Phase 4.8.1.7: Decoupled organic motion (MMPA Phase 3: with speed multiplier)
          const phi = (i % 180) * Math.PI / 180.0;
          const th  = (i % 360) * Math.PI / 180.0;

          // MMPA Phase 3: Apply harmonic geometry (RELATIONSHIP features)
          // 1. Symmetry Order: Quantize theta angle for latitude bands
          const symmetryAngleStep = (Math.PI * 2) / this.symmetryOrder;
          const quantizedTheta = Math.round(th / symmetryAngleStep) * symmetryAngleStep;
          const consonanceBlend = Math.max(0, Math.min(1, (this.symmetryOrder - 3) / 9));
          const harmonicTheta = th * (1 - consonanceBlend) + quantizedTheta * consonanceBlend;

          // 2. Geometric Subdivision: Layer the sphere radius based on complexity
          const layerIndex = Math.floor((i / this.count) * this.geometricSubdivision * 2); // 0-2 layers
          const layerRadius = 2.5 + layerIndex * 0.4; // Layers at 2.5, 2.9, 3.3...

          // 3. Harmonic Proportions: Scale overall sphere
          const r = layerRadius * this.harmonicProportions + this.organicStrength * Math.sin(effectiveTime * 0.8 + i * 0.19);
          const angleJitter = this.organicStrength * 0.05 * Math.cos(effectiveTime * 0.2 + i * 0.31);

          this.targets[ti]     = r * Math.sin(phi) * Math.cos(harmonicTheta + angleJitter);
          this.targets[ti + 1] = r * Math.sin(phi) * Math.sin(harmonicTheta + angleJitter);
          this.targets[ti + 2] = r * Math.cos(phi);
          break;
        }
        case 'torus': {
          // Phase 4.8.1.7: Decoupled organic motion (MMPA Phase 3: with speed multiplier)
          const u = (i % 360) * Math.PI / 180.0;
          const v = (i % 360) * Math.PI / 180.0;
          const R = 2.5 + this.organicStrength * Math.sin(effectiveTime * 0.5 + i * 0.11);
          const r = 1.0 + this.organicStrength * Math.cos(effectiveTime * 0.7 + i * 0.17);
          const angleJitter = this.organicStrength * 0.05 * Math.sin(effectiveTime * 0.4 + i * 0.29);

          this.targets[ti]     = (R + r * Math.cos(v)) * Math.cos(u + angleJitter);
          this.targets[ti + 1] = (R + r * Math.cos(v)) * Math.sin(u + angleJitter);
          this.targets[ti + 2] = r * Math.sin(v);
          break;
        }
        case 'cube': {
          // Phase 4.8.1.7: Decoupled organic motion (MMPA Phase 3: with speed multiplier)
          const s = 5;
          // Base position jitter (with MMPA speed)
          const baseX = Math.sin(effectiveTime * 0.1 + i * 0.37) * s;
          const baseY = Math.cos(effectiveTime * 0.15 + i * 0.41) * s;
          const baseZ = Math.sin(effectiveTime * 0.12 + i * 0.43) * s;

          // Organic wander (with MMPA speed)
          const wx = this.organicStrength * Math.sin(effectiveTime * 0.6 + i * 0.23);
          const wy = this.organicStrength * Math.cos(effectiveTime * 0.7 + i * 0.29);
          const wz = this.organicStrength * Math.sin(effectiveTime * 0.5 + i * 0.31);

          this.targets[ti]     = baseX + wx;
          this.targets[ti + 1] = baseY + wy;
          this.targets[ti + 2] = baseZ + wz;
          break;
        }
        case 'vesselPlanes': {
          // Phase 2.3.0: Vessel-aware layout with organic motion
          this.updateLayoutVesselPlanes();
          break;
        }
      }

      this.mesh.getMatrixAt(i, this._tmpMatrix);
      this._tmpMatrix.decompose(this._tmpPos, this._tmpQuat, this._tmpScale);

      let tx = this.targets[ti];
      let ty = this.targets[ti + 1];
      let tz = this.targets[ti + 2];

      // Phase 11.5.2: Layered jitter (sine + cosine + 2nd octave), per-axis amp
      if (this.organicStrength > 0 && this.driftOffsets.length) {
        const off = this.driftOffsets[i];

        const fx = 0.18 * off.s;
        const fy = 0.23 * off.s;
        const fz = 0.15 * off.s;

        // base scale tuned down slightly; amplitudes come from ax/ay/az
        const driftScale = this.organicStrength * 0.018;

        // primary (slow) layer
        const dx1 = Math.sin(t * fx + off.x) * off.ax;
        const dy1 = Math.cos(t * fy + off.y) * off.ay; // cosine to desync phase families
        const dz1 = Math.sin(t * fz + off.z) * off.az;

        // secondary (faster) layer — subtle wobble
        const dx2 = Math.sin(t * fx * 2.3 + off.x * 1.7) * off.a2;
        const dy2 = Math.sin(t * fy * 2.1 + off.y * 1.3) * off.a2;
        const dz2 = Math.cos(t * fz * 2.4 + off.z * 1.9) * off.a2;

        // combine and scale
        tx += (dx1 + 0.4 * dx2) * driftScale;
        ty += (dy1 + 0.4 * dy2) * driftScale;
        tz += (dz1 + 0.4 * dz2) * driftScale;

        // Phase 11.4.2S: One-time drift active log
        if (!this._driftNotified) {
          this._driftNotified = true;
          console.log(`✨ Particle drift per-axis active (organic=${this.organicStrength.toFixed(2)})`);
        }
      }

      // Phase 11.7: Base velocity drift + noise field (safe defaults)
      const vi = i * 3;
      const motionStrength = state?.particleMotionStrength ?? 0.5;

      // Apply base velocity (persistent tiny velocities)
      tx += this.velocities[vi] * motionStrength;
      ty += this.velocities[vi + 1] * motionStrength;
      tz += this.velocities[vi + 2] * motionStrength;

      // Noise field drift (sine/cosine based)
      const noiseScale = motionStrength * 0.01;
      tx += Math.sin(t * 0.3 + i * 0.17) * noiseScale;
      ty += Math.cos(t * 0.4 + i * 0.23) * noiseScale;
      tz += Math.sin(t * 0.35 + i * 0.29) * noiseScale;

      // Phase 11.7: Audio jitter (velocity bursts on FFT peaks, safe default)
      const useJitter = state?.useAudioJitter ?? true;
      if (useJitter && this.audioReactive && audioMix > 0.1) {
        const audioBoost = audioMix * 0.01;
        // Add random directional burst scaled by audio level
        const burstAngle = (i * 0.37) % (Math.PI * 2);
        const burstX = Math.cos(burstAngle) * audioBoost;
        const burstY = Math.sin(burstAngle) * audioBoost;
        const burstZ = Math.sin(burstAngle * 0.7) * audioBoost;

        tx += burstX;
        ty += burstY;
        tz += burstZ;
      }

      // Phase 13.4: Apply Chladni plate resonance pattern
      if (this.chladniEnabled) {
        const m = this.chladniM + Math.floor(a.bass * 3);
        const n = this.chladniN + Math.floor(a.mid * 3);

        const x = tx / 5;
        const y = ty / 5;

        const chladniValue = Math.cos(n * Math.PI * x) * Math.cos(m * Math.PI * y) +
                            Math.cos(m * Math.PI * x) * Math.cos(n * Math.PI * y);

        // Create wave-like displacement that moves particles to nodal lines
        const wavePhase = chladniValue * 5 + this.chladniPhase;
        const displacement = Math.sin(wavePhase) * 0.8 * (1 + audioMix);

        // Apply displacement perpendicular to current position for visible wave effect
        const angle = Math.atan2(ty, tx);
        tx += Math.cos(angle + Math.PI/2) * displacement;
        ty += Math.sin(angle + Math.PI/2) * displacement;
        tz += displacement * 0.5;
      }

      // Phase 13.4: Apply Moiré interference pattern
      if (this.moireEnabled) {
        const freq1 = 2.0 * this.moireScale;
        const pattern1 = Math.sin(tx * freq1) * Math.sin(ty * freq1);

        const rotX = tx * Math.cos(this.moireRotation) - ty * Math.sin(this.moireRotation);
        const rotY = tx * Math.sin(this.moireRotation) + ty * Math.cos(this.moireRotation);
        const freq2 = 2.1 * this.moireScale;
        const pattern2 = Math.sin(rotX * freq2) * Math.sin(rotY * freq2);

        const interference = pattern1 * pattern2;

        // Apply radial displacement based on interference
        const radialDisplacement = interference * 1.2 * (1 + audioMix);
        const angle = Math.atan2(ty, tx);
        tx += Math.cos(angle) * radialDisplacement;
        ty += Math.sin(angle) * radialDisplacement;

        // Add vertical wave for visual depth
        tz += interference * 0.5 * (1 + audioMix);
      }

      // Phase 13.6: Apply Spectrogram tessellations (FFT → radial mandala)
      if (this.spectrogramEnabled) {
        const radius = Math.sqrt(tx * tx + ty * ty);
        const theta = Math.atan2(ty, tx) + this.spectrogramRotation;

        // Map particle to frequency band based on angle
        const normalizedAngle = (theta + Math.PI) / (2 * Math.PI);
        const bandIndex = Math.floor(normalizedAngle * this.spectrogramBands) % this.spectrogramBands;
        const bandAmplitude = (a.bass + a.mid + a.treble) / 3;

        // Create radial rings and tessellation
        const ringCount = 8;
        const ringIndex = Math.floor((radius / this.spectrogramRadius) * ringCount) % ringCount;
        const cellAngle = Math.floor(normalizedAngle * this.spectrogramBands * 2) / (this.spectrogramBands * 2) * Math.PI * 2;
        const cellRadius = (ringIndex + 0.5) * (this.spectrogramRadius / ringCount);

        const targetX = Math.cos(cellAngle - this.spectrogramRotation) * cellRadius;
        const targetY = Math.sin(cellAngle - this.spectrogramRotation) * cellRadius;

        // Attraction with audio modulation
        const attractionStrength = 0.5 * (1 + bandAmplitude * 2);
        tx += (targetX - tx) * attractionStrength * 0.02;
        ty += (targetY - ty) * attractionStrength * 0.02;

        // Radial pulsing
        const ringPhase = ringIndex * Math.PI / ringCount + t;
        const pulseDir = { x: tx / Math.max(radius, 0.1), y: ty / Math.max(radius, 0.1) };
        const radialPulse = bandAmplitude * 2.0 * Math.sin(ringPhase * Math.PI);
        tx += pulseDir.x * radialPulse;
        ty += pulseDir.y * radialPulse;

        // Vertical displacement
        const verticalWave = Math.sin(theta * this.spectrogramBands + t * 2) * bandAmplitude;
        tz += verticalWave * 2.0;
      }

      // Phase 13.6: Apply Phase-shift interference (holographic moiré)
      if (this.phaseShiftEnabled) {
        const radius = Math.sqrt(tx * tx + ty * ty);
        let totalInterference = 0;

        for (let layer = 0; layer < this.phaseShiftLayers; layer++) {
          const layerPhase = this.phaseShiftPhase + layer * (Math.PI * 2 / this.phaseShiftLayers);
          const layerFreq = 2.0 + layer * 0.5;
          const layerAngle = (Math.PI * 2 / this.phaseShiftLayers) * layer;

          // Rotate coordinate system for each layer
          const rotX = tx * Math.cos(layerAngle) - ty * Math.sin(layerAngle);
          const rotY = tx * Math.sin(layerAngle) + ty * Math.cos(layerAngle);

          // Create wave pattern with audio modulation
          const wave1 = Math.sin(rotX * layerFreq + layerPhase + a.bass * 3);
          const wave2 = Math.sin(rotY * layerFreq - layerPhase + a.mid * 3);
          const wave3 = Math.sin(tz * layerFreq * 0.5 + layerPhase * 1.5 + a.treble * 3);

          const layerInterference = (wave1 + wave2 + wave3) / 3;
          const layerWeight = 1.0 - Math.abs((layer / (this.phaseShiftLayers - 1)) - 0.5);
          totalInterference += layerInterference * layerWeight;
        }

        totalInterference /= this.phaseShiftLayers;

        // Holographic depth effect
        const depthDisplacement = totalInterference * this.phaseShiftDepth * 2.0;
        const depthDir = { x: tx / Math.max(radius, 0.1), y: ty / Math.max(radius, 0.1), z: tz / Math.max(Math.abs(tz), 0.1) };
        tx += depthDir.x * depthDisplacement * (1 + audioMix);
        ty += depthDir.y * depthDisplacement * (1 + audioMix);
        tz += depthDir.z * depthDisplacement * (1 + audioMix);

        // Tangential vortex flow
        const angle = Math.atan2(ty, tx);
        const flowStrength = totalInterference * 1.0 * (1 + a.mid * 0.5);
        tx += Math.cos(angle + Math.PI / 2) * flowStrength;
        ty += Math.sin(angle + Math.PI / 2) * flowStrength;
      }

      // Phase 13.6: Apply Spectral Diffraction (rainbow prismatic dispersion)
      if (this.diffractionEnabled) {
        const radius = Math.sqrt(tx * tx + ty * ty);
        const theta = Math.atan2(ty, tx);

        // Each particle gets a "wavelength" based on its index
        const wavelength = (i % 360) / 360.0;

        // Dispersion: different wavelengths refract at different angles
        const dispersionAngle = this.diffractionAngle + wavelength * Math.PI * 0.5;
        const refractionStrength = this.diffractionIntensity * 2.0 * (1 + audioMix);

        // Chromatic displacement - particles spread in rainbow pattern
        const disperseX = Math.cos(dispersionAngle) * refractionStrength;
        const disperseY = Math.sin(dispersionAngle) * refractionStrength;
        tx += disperseX * (1 + a.bass * 0.5);
        ty += disperseY * (1 + a.mid * 0.5);

        // Iridescent wave patterns (like soap bubbles)
        const iridescencePhase = radius * 3.0 + theta * 2.0 - this.diffractionAngle * 2;
        const iridescence = Math.sin(iridescencePhase + wavelength * Math.PI * 2) * 0.5 + 0.5;

        // Thin-film interference
        const interference = Math.cos(iridescencePhase * (1.0 + audioMix * 2) + wavelength * Math.PI * 4);
        const interferenceStrength = interference * iridescence * 1.5;
        const radialDir = { x: tx / Math.max(radius, 0.1), y: ty / Math.max(radius, 0.1) };
        tx += radialDir.x * interferenceStrength * (1 + a.treble);
        ty += radialDir.y * interferenceStrength * (1 + a.treble);

        // Vertical rainbow stacking
        const spectralHeight = (wavelength - 0.5) * this.diffractionIntensity * 3.0;
        tz += spectralHeight * (1 + audioMix * 0.5);

        // Diffraction grating effect
        const gratingPeriod = 0.8;
        const gratingPhase = (tx + ty) / gratingPeriod + this.diffractionAngle * 5;
        const gratingPattern = Math.sin(gratingPhase * Math.PI * 2);
        const fringeDir = { x: Math.cos(theta), y: Math.sin(theta) };
        const fringeAttraction = gratingPattern * 1.0 * this.diffractionIntensity;
        tx += fringeDir.x * fringeAttraction;
        ty += fringeDir.y * fringeAttraction;
      }

      // Phase 2.3.1: Apply Vessel rotation to vesselPlanes layout
      if (this.currentLayout === 'vesselPlanes' && this.vesselGroup) {
        const v = new THREE.Vector3(tx, ty, tz);
        v.applyQuaternion(this.vesselGroup.quaternion);
        tx = v.x;
        ty = v.y;
        tz = v.z;
      }

      // Phase 11.7: Boundary clamping (keep particles within sphere)
      const maxRadius = 10; // Maximum distance from origin
      const distSq = tx * tx + ty * ty + tz * tz;
      if (distSq > maxRadius * maxRadius) {
        const dist = Math.sqrt(distSq);
        const scale = maxRadius / dist;
        tx *= scale;
        ty *= scale;
        tz *= scale;
      }

      this._tmpPos.set(
        this._tmpPos.x + (tx - this._tmpPos.x) * sm,
        this._tmpPos.y + (ty - this._tmpPos.y) * sm,
        this._tmpPos.z + (tz - this._tmpPos.z) * sm
      );

      this._tmpMatrix.compose(this._tmpPos, this._tmpQuat, this._tmpScale);
      this.mesh.setMatrixAt(i, this._tmpMatrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;

    // Phase 2.3.2D: Audio-reactive trail length modulation
    if (this.trailEnabled && this.trailAudioReactive) {
      const dynamicLength = Math.floor(
        THREE.MathUtils.lerp(this.trailLengthMin, this.trailLengthMax, this.audioLevel)
      );
      this.trailLength = Math.max(0, Math.min(this.maxTrailLength, dynamicLength));
    }

    // Phase 2.3.2E: Update particle trails with preallocated buffers (performance fix)
    // Performance guard: Early exit if trails disabled or count is zero
    if (!this.trailEnabled || this.trailLength <= 0 || this.count === 0) {
      this.trailHistory = [];
      this.trailLines.visible = false;
      this.trailGeometry.setDrawRange(0, 0);
    } else {
      // Capture current particle positions (reuse single allocation)
      const currentPositions = new Float32Array(this.count * 3);
      for (let i = 0; i < this.count; i++) {
        this.mesh.getMatrixAt(i, this._tmpMatrix);
        this._tmpMatrix.decompose(this._tmpPos, this._tmpQuat, this._tmpScale);
        const idx = i * 3;
        currentPositions[idx]     = this._tmpPos.x;
        currentPositions[idx + 1] = this._tmpPos.y;
        currentPositions[idx + 2] = this._tmpPos.z;
      }

      // Add to history
      this.trailHistory.unshift(currentPositions);
      if (this.trailHistory.length > this.trailLength) {
        this.trailHistory.pop();
      }

      // Build line segments in preallocated arrays (no push, no new allocations)
      let segIndex = 0;
      let colIndex = 0;
      const tempColor = new THREE.Color();

      for (let i = 0; i < this.count; i++) {
        const idx = i * 3;

        // Phase 2.3.2B: Derive current particle hue from audio + hueShift
        const baseHue = this.particleBaseHues[i];
        let finalHue = this.hueShift;

        if (this.audioReactive) {
          const audioHue = audioMix * 360;
          finalHue = (this.hueShift + audioHue + baseHue) % 360;
        } else {
          finalHue = (this.hueShift + baseHue) % 360;
        }

        tempColor.setHSL(finalHue / 360, 1.0, 0.5);

        for (let t = 0; t < this.trailHistory.length - 1; t++) {
          const a = this.trailHistory[t];
          const b = this.trailHistory[t + 1];

          // Write positions directly to preallocated array
          this.trailSegmentArray[segIndex++] = a[idx];
          this.trailSegmentArray[segIndex++] = a[idx + 1];
          this.trailSegmentArray[segIndex++] = a[idx + 2];

          this.trailSegmentArray[segIndex++] = b[idx];
          this.trailSegmentArray[segIndex++] = b[idx + 1];
          this.trailSegmentArray[segIndex++] = b[idx + 2];

          // Phase 2.3.2C: Fade factor (1.0 at head, → (1 - trailFade) at tail)
          const fadeFactor = 1.0 - (t / this.trailHistory.length) * this.trailFade;

          // Write colors directly to preallocated array
          this.trailColorArray[colIndex++] = tempColor.r * fadeFactor;
          this.trailColorArray[colIndex++] = tempColor.g * fadeFactor;
          this.trailColorArray[colIndex++] = tempColor.b * fadeFactor;

          this.trailColorArray[colIndex++] = tempColor.r * fadeFactor;
          this.trailColorArray[colIndex++] = tempColor.g * fadeFactor;
          this.trailColorArray[colIndex++] = tempColor.b * fadeFactor;
        }
      }

      // Update geometry with actual vertex count used
      const vertexCount = segIndex / 3;
      if (vertexCount > 0) {
        this.trailGeometry.setDrawRange(0, vertexCount);
        this.trailGeometry.attributes.position.needsUpdate = true;
        this.trailGeometry.attributes.color.needsUpdate = true;
        this.trailLines.visible = true;
      } else {
        this.trailGeometry.setDrawRange(0, 0);
        this.trailLines.visible = false;
      }

      // Update material opacity
      this.trailMaterial.opacity = this.trailOpacity;
    }

    // Phase 4.9.0: Brightness compensation for small particles (under 0.3 world units)
    let brightnessBoost = 1.0;
    if (this.sizeWorld < 0.3) {
      brightnessBoost = THREE.MathUtils.lerp(1.6, 1.0, this.sizeWorld / 0.3);
    }

    this.uniforms.uSize.value            = this.sizeWorld;
    this.uniforms.uOpacity.value         = this.opacity;
    this.uniforms.uHueShift.value        = this.hueShift;
    this.uniforms.uAudioReactive.value   = this.audioReactive;
    this.uniforms.uAudioLevel.value      = audioMix;
    this.uniforms.uBrightnessBoost.value = brightnessBoost;

    // Phase 13.4: Update pattern animation phases
    if (this.chladniEnabled) {
      this.chladniPhase += this.chladniFrequency * (1 + audioMix * 2) * 0.02;
    }
    if (this.moireEnabled) {
      this.moireRotation += this.moireSpeed * (1 + audioMix);
    }

    // Debug log (Phase 2.3.2E: added trail performance status)
    if (Math.random() < 0.01) {
      const audioHue = audioMix * 360;
      const finalHue = (this.hueShift + audioHue) % 360;
      const coupled = this.currentLayout === 'vesselPlanes' && this.vesselGroup ? ' (coupled)' : '';
      const hueMode = this.audioReactive ? 'audio' : 'manual';
      const audioReactiveLen = this.trailAudioReactive ? `audioReactiveLen=true` : '';
      const trailStatus = this.trailEnabled
        ? ` | trails: enabled length=${this.trailLength} opacity=${this.trailOpacity.toFixed(2)} fade=${this.trailFade.toFixed(2)} ${audioReactiveLen} perf=OK`
        : '';
      // Phase 11.4.2: Log organic drift status
      const organicStatus = this.organicStrength > 0 ? ` ✨ Particle drift active (organic=${this.organicStrength.toFixed(2)})` : '';
      console.log(
        `✨ Layout: ${this.currentLayout}${coupled} | count: ${this.count} | size: ${this.sizeWorld.toFixed(2)} | speed: ${this.orbitalSpeed.toFixed(2)} | organic: ${this.organicStrength.toFixed(2)}${organicStatus}${trailStatus}`
      );
    }
  }

  // HUD hooks
  setOrbitalSpeed(v)     { this.orbitalSpeed = Math.max(0.01, v); }
  setSmoothness(v)       { this.smoothness = v; }
  setOpacity(v)          { this.opacity = v; }
  setOrganicStrength(v)  { this.organicStrength = v; }
  setHueShift(v)         { this.hueShift = v % 360; }
  setAudioReactive(b)    { this.audioReactive = !!b; }
  setVesselReference(vesselGroup) { this.vesselGroup = vesselGroup; } // Phase 2.3.1

  // Phase 2.3.2A/C/D: Trail control methods
  setTrailEnabled(v)        { this.trailEnabled = !!v; }
  setTrailLength(v)         { this.trailLength = Math.max(0, Math.min(this.maxTrailLength, Math.floor(v))); }
  setTrailOpacity(v)        { this.trailOpacity = Math.max(0, Math.min(1, v)); }
  setTrailFade(v)           { this.trailFade = Math.max(0, Math.min(1, v)); } // Phase 2.3.2C
  setTrailAudioReactive(v)  { this.trailAudioReactive = !!v; } // Phase 2.3.2D
  setTrailLengthMin(v)      { this.trailLengthMin = Math.max(1, Math.min(this.maxTrailLength, Math.floor(v))); }
  setTrailLengthMax(v)      { this.trailLengthMax = Math.max(1, Math.min(this.maxTrailLength, Math.floor(v))); }

  // Phase 2.3.3: Shadow Box projection control
  setProjectParticlesToShadow(enabled) {
    if (enabled) {
      this.mesh.layers.enable(SHADOW_LAYER);
      this.trailLines.layers.enable(SHADOW_LAYER);
    } else {
      this.mesh.layers.disable(SHADOW_LAYER);
      this.trailLines.layers.disable(SHADOW_LAYER);
    }
  }
  setAudioLevel(v)       { this.audioLevel = v; }
  setAudioGain(v)        { this.audioGain = v; }
  setParticleSizeWorld(v){ this.sizeWorld = Math.max(0.05, v); }
  setParticleSize(v)     { this.sizeWorld = Math.max(0.05, v); } // Alias
  changeLayout(name)     { this.setLayout(name); }

  setParticleCount(v) {
    this.dispose(this.scene);
    const sys = new ParticleSystem(this.scene, v);
    sys.setParticleSizeWorld(this.sizeWorld);
    sys.setAudioGain(this.audioGain);
    sys.setHueShift(this.hueShift);
    sys.setAudioReactive(this.audioReactive);
    sys.setOrbitalSpeed(this.orbitalSpeed);
    sys.setSmoothness(this.smoothness);
    sys.setOpacity(this.opacity);
    sys.setOrganicStrength(this.organicStrength);
    sys.setLayout(this.currentLayout);
    return sys;
  }

  dispose(scene) {
    scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

// Legacy compatibility
let particleSystemInstance = null;

export function initParticles(scene, count = 5000) {
  if (particleSystemInstance) {
    destroyParticles(scene);
  }
  particleSystemInstance = new ParticleSystem(scene, count);
  console.log(`✨ Particles initialized: count=${count}, instance=${!!particleSystemInstance}`);
  return particleSystemInstance;
}

export function updateParticles(audioReactive, time, mmpaVisuals = null) {
  if (particleSystemInstance) {
    // MMPA Phase 3: Apply particle density from COMPLEXITY features
    if (mmpaVisuals && mmpaVisuals.particleDensity !== undefined && particleSystemInstance.setDensityMultiplier) {
      particleSystemInstance.setDensityMultiplier(mmpaVisuals.particleDensity);
    }
    // MMPA Phase 3: Apply animation speed from TRANSFORMATION features
    if (mmpaVisuals && mmpaVisuals.animationSpeed && particleSystemInstance.setAnimationSpeed) {
      particleSystemInstance.setAnimationSpeed(mmpaVisuals.animationSpeed);
    }
    // MMPA Phase 3: Apply form stability from ALIGNMENT features
    if (mmpaVisuals && mmpaVisuals.formStability !== undefined && particleSystemInstance.setFormStability) {
      particleSystemInstance.setFormStability(mmpaVisuals.formStability);
    }
    // MMPA Phase 3: Apply geometric harmony from RELATIONSHIP features
    if (mmpaVisuals && mmpaVisuals.geometricSymmetry !== undefined && particleSystemInstance.setGeometricHarmony) {
      particleSystemInstance.setGeometricHarmony(
        mmpaVisuals.geometricSymmetry,  // consonance (0-1)
        mmpaVisuals.patternComplexity * 10,  // complexity (denormalized from 0-1 to 0-10)
        mmpaVisuals.harmonicOrder  // harmonicOrder (0-1)
      );
    }
    particleSystemInstance.update();
  }
}

export function destroyParticles(scene) {
  if (particleSystemInstance) {
    particleSystemInstance.dispose(scene);
    particleSystemInstance = null;
  }
}

export function getParticleSystemInstance() {
  return particleSystemInstance;
}

// === 🍕 Phase 11.7.10: Emoji Particle Extension (Instanced Rendering) ===
// InstancedMesh-based emoji particles for 1k+ performance with audio reactivity

// Phase 11.7.12: Emoji narrative sets
const EMOJI_SETS = {
  pizza: ["🍕", "🌶️", "🍄", "🧄", "🧀"],
  cosmos: ["⭐", "🌙", "☀️", "🌍", "🌌"],
  myth: ["🦁", "🦅", "🐍", "🐉", "🔥"],
  ocean: ["🌊", "🐠", "🐙", "🦈", "🐚"],
  nature: ["🌲", "🍃", "🌺", "🦋", "🌈"],
  tech: ["💻", "🤖", "⚡", "🔮", "💎"]
};

export class EmojiParticles {
  constructor(scene, count = 50, emoji = "🍕") {
    this.scene = scene;
    this.count = count;
    this.emoji = emoji;
    this.layout = "cube"; // Phase 11.7.5: default layout
    this.audioReactivity = 1.0; // Phase 11.7.8: audio response multiplier
    this.useInstancing = true; // Phase 11.7.10: instancing flag
    this.linkedToSignals = false; // Phase 11.7.11: morph/audio linking

    // Phase 11.7.12: Narrative/symbol layer
    this.currentSet = null; // Active emoji set name
    this.currentSetIndex = 0; // Index within the set
    this.autoCycleEnabled = false; // Auto-cycle through set
    this.cycleInterval = 4000; // Milliseconds between cycles
    this.lastCycleTime = performance.now();
    this.storyMode = false; // Story sequence mode
    this.storySequence = ["pizza", "cosmos", "myth"]; // Default story order
    this.storyIndex = 0;

    // Phase 11.7.13: Beat sync & sequencing
    this.bpm = 120; // Beats per minute
    this.beatSyncEnabled = false; // BPM-locked pulse
    this.lastBeatTime = performance.now();
    this.beatInterval = 0; // Calculated from BPM
    this.subdivision = 4; // 1/4 notes (4), 1/8 (8), 1/16 (16)
    this.sequencerEnabled = false; // Sequencer mode
    this.sequence = ["🍕", "🌶️", "🍄", "🧄"]; // Default sequence
    this.sequenceIndex = 0;
    this.pulseAmount = 0; // Current pulse intensity (0-1)
    this.pulseDuration = 200; // Milliseconds for pulse decay
    this.lastPulseTime = 0;
    this.onsetDetection = false; // Audio onset detection mode
    this.lastOnsetValue = 0;

    // Phase 11.7.14: Spatial layout & orbit dynamics
    this.orbitSpeed = 0.01; // Radians per frame for orbit rotation
    this.spiralRotation = 0; // Cumulative rotation for spiral
    this.gridSpacing = 1.0; // Grid cell spacing
    this.orbitRings = 3; // Number of orbital rings
    this.orbitRadii = []; // Radius for each particle's orbit

    // Phase 11.7.10: Per-instance data storage
    this.positions = [];
    this.velocities = [];
    this.baseScales = [];
    this.rotations = [];

    // Phase 11.7.11: Layout interpolation storage
    this.basePositions = []; // Original layout positions for morphing

    // Phase 11.7.18: Physics properties
    this.physicsMode = 'none'; // 'none', 'gravity', 'orbit', 'repulsion'
    this.accelerations = []; // Per-particle acceleration vectors
    this.vesselCenter = new THREE.Vector3(0, 0, 0); // Center point for orbit/repulsion
    this.mousePosition = new THREE.Vector3(0, 0, 0); // Mouse position in 3D space

    // Phase 11.7.19: Fusion & Cluster system
    this.clusters = []; // Array of active clusters { particleIndices: [], position: Vector3, scale: float, opacity: float }
    this.particleToCluster = new Map(); // Maps particle index → cluster ID
    this.nextClusterId = 0; // Cluster ID counter

    // Phase 13.4: Chladni & Moiré pattern modes
    this.chladniEnabled = false; // Chladni plate resonance patterns
    this.moireEnabled = false; // Moiré interference patterns
    this.chladniM = 3; // Chladni mode number m (horizontal)
    this.chladniN = 4; // Chladni mode number n (vertical)
    this.chladniFrequency = 1.0; // Oscillation frequency
    this.chladniPhase = 0; // Current phase for animation
    this.moireScale = 1.0; // Scale of moiré pattern
    this.moireRotation = 0; // Rotation angle for second pattern
    this.moireSpeed = 0.01; // Rotation speed

    // Phase 13.6: Advanced cymatic modes
    this.spectrogramEnabled = false;
    this.spectrogramBands = 32;          // Number of frequency bands
    this.spectrogramRadius = 8;          // Radius of mandala
    this.spectrogramRotation = 0;
    this.spectrogramSpeed = 0.01;

    this.phaseShiftEnabled = false;
    this.phaseShiftLayers = 3;           // Number of interference layers
    this.phaseShiftSpeed = 0.02;
    this.phaseShiftPhase = 0;
    this.phaseShiftDepth = 1.0;          // Holographic depth

    this.diffractionEnabled = false;
    this.diffractionIntensity = 1.0;     // Color intensity
    this.diffractionAngle = 0;           // Prism angle
    this.diffractionSpeed = 0.01;

    // Phase 11.7.50: Check for custom image, otherwise use emoji
    let texture;
    if (state.mandala?.useCustomImage && state.mandala?.customImage) {
      const loader = new THREE.TextureLoader();
      texture = loader.load(state.mandala.customImage,
        () => console.log(`🖼️ Initial mandala texture: ${state.mandala.customImageName || 'custom image'}`),
        undefined,
        (error) => {
          console.error('🖼️ Failed to load custom image, using emoji fallback:', error);
        }
      );
    } else {
      texture = this.createEmojiTexture(this.emoji, 128);
    }

    try {
      // Phase 11.7.10: Create instanced mesh for performance
      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });

      this.instancedMesh = new THREE.InstancedMesh(geometry, material, count);
      this.dummy = new THREE.Object3D();

      // Initialize per-instance data
      for (let i = 0; i < count; i++) {
        // Phase 11.7.7: Size variation (0.4-0.8 base scale)
        const baseScale = 0.4 + Math.random() * 0.4;
        this.baseScales.push(baseScale);

        // Phase 11.7.7: Per-particle velocity for continuous drift
        const velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        );
        this.velocities.push(velocity);

        // Initialize position (will be set by positionSprites)
        this.positions.push(new THREE.Vector3(0, 0, 0));

        // Initialize rotation
        this.rotations.push(0);

        // Phase 11.7.18: Initialize acceleration
        this.accelerations.push(new THREE.Vector3(0, 0, 0));
      }

      this.scene.add(this.instancedMesh);

      // Phase 11.7.5: Position sprites according to layout
      this.positionSprites();

      console.log(`🍕 EmojiParticles (instanced) initialized: ${count} x ${emoji}`);
    } catch (error) {
      console.warn("🍕 Instancing failed, using fallback sprite mode:", error);
      this.useInstancing = false;
      this.initSpriteFallback(texture);
    }

    // Phase 11.7.50: Listen for mandala image upload/clear events
    this.setupMandalaImageListeners();
  }

  // Phase 11.7.50: Setup event listeners for mandala image changes
  setupMandalaImageListeners() {
    window.addEventListener('mandala:imageSelected', () => {
      // Refresh texture when custom image is uploaded
      this.swapEmoji(this.emoji);
    });

    window.addEventListener('mandala:imageCleared', () => {
      // Refresh texture when custom image is cleared (return to emoji)
      this.swapEmoji(this.emoji);
    });
  }

  // Phase 11.7.10: Fallback sprite mode for unsupported browsers
  initSpriteFallback(texture) {
    this.sprites = [];
    for (let i = 0; i < this.count; i++) {
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8
      });
      const sprite = new THREE.Sprite(material);
      sprite.userData.baseScale = this.baseScales[i];
      this.scene.add(sprite);
      this.sprites.push(sprite);
    }
    this.positionSprites();
    console.log(`🍕 EmojiParticles (fallback sprites) initialized: ${this.count} x ${this.emoji}`);
  }

  createEmojiTexture(emoji, size) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.font = `${size * 0.8}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, size / 2, size / 2);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  update(audioLevel = 0) {
    // Phase 11.7.4: Safe fallback to prevent vanishing when audioMorph overrides audio.level
    const level = audioLevel ?? (state?.audio?.level ?? 0);
    const reactivity = this.audioReactivity; // Phase 11.7.8: apply reactivity multiplier

    // Phase 11.7.12: Auto-cycle emoji in set
    if (this.autoCycleEnabled && this.currentSet) {
      const now = performance.now();
      if (now - this.lastCycleTime >= this.cycleInterval) {
        this.cycleEmoji();
        this.lastCycleTime = now;
      }
    }

    // Phase 11.7.11: Audio band extraction
    const bass = state?.audio?.bass ?? 0;
    const mid = state?.audio?.mid ?? 0;
    const treble = state?.audio?.treble ?? 0;

    // Phase 11.7.13: Beat sync & sequencing
    const now = performance.now();

    // BPM-based beat detection
    if (this.beatSyncEnabled && this.bpm > 0) {
      const beatInterval = (60000 / this.bpm) / (this.subdivision / 4);
      this.beatInterval = beatInterval;

      if (now - this.lastBeatTime >= beatInterval) {
        this.triggerBeat();
        this.lastBeatTime = now;
      }
    }

    // Onset detection (audio RMS spike)
    if (this.onsetDetection) {
      const currentOnset = bass + mid + treble;
      const onsetThreshold = 0.5;
      if (currentOnset > onsetThreshold && currentOnset > this.lastOnsetValue * 1.5) {
        this.triggerBeat();
        console.log("🥁 Beat detected → pulse");
      }
      this.lastOnsetValue = currentOnset;
    }

    // Pulse decay
    if (this.pulseAmount > 0) {
      const pulseDecay = (now - this.lastPulseTime) / this.pulseDuration;
      this.pulseAmount = Math.max(0, 1 - pulseDecay);
    }

    // Phase 11.7.11: Morph weight influence (if linked)
    let morphBias = { cube: 0.25, sphere: 0.25, pyramid: 0.25, torus: 0.25 };
    if (this.linkedToSignals && state?.morphWeights) {
      const weights = state.morphWeights;
      const total = (weights.cube || 0) + (weights.sphere || 0) + (weights.pyramid || 0) + (weights.torus || 0);
      if (total > 0) {
        morphBias.cube = (weights.cube || 0) / total;
        morphBias.sphere = (weights.sphere || 0) / total;
        morphBias.pyramid = (weights.pyramid || 0) / total;
        morphBias.torus = (weights.torus || 0) / total;
      }
    }

    // Phase 11.7.18: Apply physics forces before position updates
    this.applyPhysics(level, bass, mid, treble);

    // Phase 11.7.18: Apply collision detection
    this.applyCollisions();

    // Phase 11.7.19: Apply fusion logic
    this.applyFusion(level);

    // Phase 11.7.20: Apply constellation geometry (overrides free motion if active)
    this.applyConstellation();

    // Phase 11.7.21: Apply mandala geometry (overrides constellation if enabled)
    this.applyMandala();

    if (this.useInstancing && this.instancedMesh) {
      // Phase 11.7.10: Instanced mesh update - FIRST PASS: Set base layout positions
      for (let i = 0; i < this.count; i++) {
        const pos = this.positions[i];
        const vel = this.velocities[i];

        // Apply velocity (drift)
        pos.add(vel);

        // Phase 11.7.14: Orbit dynamics (audio-reactive rotation around vessel)
        if (this.layout === "orbit" || this.layout === "ring") {
          const orbitRotation = this.orbitSpeed * (1 + level * reactivity);
          const radius = this.orbitRadii[i] || 6;
          const baseAngle = (i / this.count) * Math.PI * 2;
          const angle = baseAngle + this.spiralRotation;
          pos.x = radius * Math.cos(angle);
          pos.z = radius * Math.sin(angle);
        }

        // Phase 11.7.14: Spiral rotation animation (cosmic swirl)
        if (this.layout === "spiral") {
          const angle = i * 0.3 + this.spiralRotation;
          const radius = 5 + i * 0.02;
          pos.x = Math.cos(angle) * radius;
          pos.z = Math.sin(angle) * radius;
          pos.y = i * 0.1; // Keep vertical spacing
        }

        // Phase 11.7.11: Bass → radial expansion
        if (this.linkedToSignals && bass > 0.1) {
          const direction = pos.clone().normalize();
          pos.add(direction.multiplyScalar(bass * 0.2 * reactivity));
        }

        // Boundary bounce
        const maxBound = 10;
        if (Math.abs(pos.x) > maxBound) {
          vel.x *= -1;
          pos.x = Math.sign(pos.x) * maxBound;
        }
        if (Math.abs(pos.y) > maxBound) {
          vel.y *= -1;
          pos.y = Math.sign(pos.y) * maxBound;
        }
        if (Math.abs(pos.z) > maxBound) {
          vel.z *= -1;
          pos.z = Math.sign(pos.z) * maxBound;
        }
      }

      // Phase 13.4 & 13.6: Apply cymatic patterns (AFTER layout positioning, BEFORE matrix updates)
      this.applyChladni();
      this.applyMoire();
      this.applySpectrogram();
      this.applyPhaseShift();
      this.applyDiffraction();

      // DEBUG: Force obvious displacement to test if this code path runs
      if (this.spectrogramEnabled || this.phaseShiftEnabled || this.diffractionEnabled) {
        if (!this._cymaticDebugLogged) {
          console.log('🌌 CYMATIC METHODS CALLED - displacing first particle by 5 units');
          this._cymaticDebugLogged = true;
        }
        // Displace first particle dramatically to test visibility
        this.positions[0].x += 5;
        this.positions[0].y += 5;
      }

      // SECOND PASS: Update all matrices with final positions
      for (let i = 0; i < this.count; i++) {
        const pos = this.positions[i];
        const baseScale = this.baseScales[i];

        // Audio-reactive scale
        let scale = baseScale + level * 5.0 * reactivity;

        // Phase 11.7.13: Add beat pulse to scale
        if (this.pulseAmount > 0) {
          scale += this.pulseAmount * 1.5;
        }

        // Phase 11.7.19: Apply cluster scale if particle is in a cluster
        if (this.particleToCluster.has(i)) {
          const clusterId = this.particleToCluster.get(i);
          const cluster = this.clusters.find(c => c.id === clusterId);
          if (cluster) {
            scale = cluster.scale;
          }
        }

        // Phase 11.7.11: Mid → rotation speed boost
        const rotationBoost = this.linkedToSignals ? mid * 0.3 : 0;
        this.rotations[i] += (level * 0.15 + rotationBoost) * reactivity;

        // Update instance matrix with final position
        this.dummy.position.copy(pos);
        this.dummy.scale.set(scale, scale, scale);
        this.dummy.rotation.z = this.rotations[i];
        this.dummy.updateMatrix();
        this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
      }

      // Phase 11.7.11/11.7.13: Treble sparkle + beat pulse opacity
      let opacity = 0.8;
      if (this.linkedToSignals && treble > 0.2) {
        opacity = 0.5 + treble * 0.5;
      }
      if (this.pulseAmount > 0) {
        opacity = Math.min(1.0, opacity + this.pulseAmount * 0.4);
      }
      this.instancedMesh.material.opacity = opacity;

      this.instancedMesh.instanceMatrix.needsUpdate = true;

      // Phase 11.7.14: Accumulate spiral/orbit rotation
      if (this.layout === "spiral" || this.layout === "orbit" || this.layout === "ring") {
        this.spiralRotation += this.orbitSpeed * (1 + level * 0.5);
      }

    } else if (this.sprites) {
      // Fallback sprite mode
      this.sprites.forEach((sprite, i) => {
        const baseScale = sprite.userData.baseScale || 0.5;
        const scale = baseScale + level * 1.5 * reactivity;
        sprite.scale.set(scale, scale, scale);
        sprite.material.rotation += level * 0.05 * reactivity;

        // Opacity shift
        sprite.material.opacity = 0.7 + level * 0.3 * reactivity;

        // Phase 11.7.7: Continuous drift with velocity
        const vel = this.velocities[i];
        sprite.position.add(vel);

        // Phase 11.7.7: Drift bounds - bounce off walls instead of reset
        const maxBound = 10;
        if (Math.abs(sprite.position.x) > maxBound) {
          vel.x *= -1;
          sprite.position.x = Math.sign(sprite.position.x) * maxBound;
        }
        if (Math.abs(sprite.position.y) > maxBound) {
          vel.y *= -1;
          sprite.position.y = Math.sign(sprite.position.y) * maxBound;
        }
        if (Math.abs(sprite.position.z) > maxBound) {
          vel.z *= -1;
          sprite.position.z = Math.sign(sprite.position.z) * maxBound;
        }
      });
    }
  }

  // Phase 11.7.18: Set physics mode
  setPhysicsMode(mode) {
    this.physicsMode = mode;
    console.log(`🌐 Emoji physics: ${mode}`);
  }

  // Phase 11.7.18: Apply physics forces
  applyPhysics(audioLevel, bass, mid, treble) {
    if (this.physicsMode === 'none') return;

    const { physicsMode: mode } = state.emojiPhysics || {};
    const gravityStr = state.emojiPhysics?.gravityStrength ?? 0.01;
    const orbitStr = state.emojiPhysics?.orbitStrength ?? 0.005;
    const repulsionStr = state.emojiPhysics?.repulsionStrength ?? 0.02;
    const audioMod = state.emojiPhysics?.audioModulation ?? true;

    for (let i = 0; i < this.count; i++) {
      const pos = this.positions[i];
      const vel = this.velocities[i];
      const accel = this.accelerations[i];

      // Reset acceleration
      accel.set(0, 0, 0);

      // Gravity mode
      if (this.physicsMode === 'gravity') {
        const gravityForce = audioMod ? gravityStr * (1 + bass * 2) : gravityStr;
        accel.y -= gravityForce;
      }

      // Orbit attraction mode
      else if (this.physicsMode === 'orbit') {
        const toCenter = new THREE.Vector3().subVectors(this.vesselCenter, pos);
        const distance = toCenter.length();
        if (distance > 0.1) {
          toCenter.normalize();
          const attractionForce = audioMod ? orbitStr * (1 + mid * 0.5) : orbitStr;
          accel.add(toCenter.multiplyScalar(attractionForce));
        }
      }

      // Repulsion mode
      else if (this.physicsMode === 'repulsion') {
        const fromCenter = new THREE.Vector3().subVectors(pos, this.vesselCenter);
        const distance = fromCenter.length();
        if (distance > 0.1) {
          fromCenter.normalize();
          const repelForce = audioMod ? repulsionStr * (1 + treble * 3) : repulsionStr;
          accel.add(fromCenter.multiplyScalar(repelForce));
        }
      }

      // Apply acceleration to velocity
      vel.add(accel);

      // Damping to prevent runaway speeds
      vel.multiplyScalar(0.98);
    }
  }

  // Phase 11.7.18: Collision detection and bouncing
  applyCollisions() {
    if (!state.emojiPhysics?.collisionEnabled) return;

    const collisionRadius = 0.5; // Radius for collision detection

    for (let i = 0; i < this.count; i++) {
      for (let j = i + 1; j < this.count; j++) {
        const pos1 = this.positions[i];
        const pos2 = this.positions[j];
        const vel1 = this.velocities[i];
        const vel2 = this.velocities[j];

        const delta = new THREE.Vector3().subVectors(pos1, pos2);
        const distance = delta.length();

        if (distance < collisionRadius * 2 && distance > 0) {
          // Collision detected - apply gentle bounce
          const overlap = collisionRadius * 2 - distance;
          const direction = delta.normalize();

          // Separate particles
          pos1.add(direction.clone().multiplyScalar(overlap * 0.5));
          pos2.sub(direction.clone().multiplyScalar(overlap * 0.5));

          // Exchange velocity components along collision axis
          const relativeVel = new THREE.Vector3().subVectors(vel1, vel2);
          const velAlongNormal = relativeVel.dot(direction);

          if (velAlongNormal < 0) {
            const restitution = 0.3; // Bounciness (0 = no bounce, 1 = perfect bounce)
            const impulse = direction.multiplyScalar(velAlongNormal * restitution);
            vel1.sub(impulse);
            vel2.add(impulse);
          }
        }
      }
    }
  }

  // Phase 11.7.18: Apply mouse swirl force
  applySwirlForce(mouseX, mouseY) {
    if (!state.emojiPhysics?.mouseInteraction) return;

    // Convert screen coords to 3D world space (simplified)
    this.mousePosition.set(
      (mouseX / window.innerWidth) * 20 - 10,
      -(mouseY / window.innerHeight) * 20 + 10,
      0
    );

    const swirlStrength = 0.05;
    const swirlRadius = 5;

    for (let i = 0; i < this.count; i++) {
      const pos = this.positions[i];
      const vel = this.velocities[i];
      const toMouse = new THREE.Vector3().subVectors(this.mousePosition, pos);
      const distance = toMouse.length();

      if (distance < swirlRadius && distance > 0.1) {
        // Tangential swirl force (perpendicular to radial direction)
        const tangent = new THREE.Vector3(-toMouse.y, toMouse.x, 0).normalize();
        const falloff = 1 - (distance / swirlRadius);
        vel.add(tangent.multiplyScalar(swirlStrength * falloff));
      }
    }
  }

  // Phase 11.7.19: Detect fusion events and create/update clusters
  applyFusion(audioLevel = 0) {
    if (!state.emojiFusion?.enabled) return;

    const threshold = state.emojiFusion?.threshold ?? 1.0;
    const fusionOccurred = new Set();

    // Check for overlapping particles
    for (let i = 0; i < this.count; i++) {
      if (this.particleToCluster.has(i)) continue; // Skip already clustered particles

      for (let j = i + 1; j < this.count; j++) {
        if (this.particleToCluster.has(j)) continue;

        const pos1 = this.positions[i];
        const pos2 = this.positions[j];
        const distance = pos1.distanceTo(pos2);

        // Fusion threshold detected
        if (distance < threshold) {
          // Create new cluster
          const clusterId = this.nextClusterId++;
          const clusterPosition = new THREE.Vector3().addVectors(pos1, pos2).multiplyScalar(0.5);

          const cluster = {
            id: clusterId,
            particleIndices: [i, j],
            position: clusterPosition,
            scale: this.baseScales[i] + this.baseScales[j], // Combined scale
            opacity: 0.9,
            driftVelocity: new THREE.Vector3(
              (this.velocities[i].x + this.velocities[j].x) * 0.5,
              (this.velocities[i].y + this.velocities[j].y) * 0.5,
              (this.velocities[i].z + this.velocities[j].z) * 0.5
            ),
            createdAt: performance.now()
          };

          this.clusters.push(cluster);
          this.particleToCluster.set(i, clusterId);
          this.particleToCluster.set(j, clusterId);
          fusionOccurred.add(clusterId);

          // Console log fusion event
          console.log(`⚡ ${this.emoji} + ${this.emoji} fused → cluster #${clusterId}`);
        }
      }
    }

    // Update cluster dynamics (breathing, drift)
    this.updateClusters(audioLevel);

    // Check for cluster decay (particles drifting apart)
    this.checkClusterDecay(threshold);
  }

  // Phase 11.7.19: Update cluster dynamics (breathing, opacity pulse, drift)
  updateClusters(audioLevel = 0) {
    const now = performance.now();
    const bass = state?.audio?.bass ?? 0;
    const mid = state?.audio?.mid ?? 0;

    for (const cluster of this.clusters) {
      // Breathing effect: scale grows with audio level
      const breathingScale = 1 + audioLevel * 0.5;
      cluster.scale *= breathingScale;

      // Opacity pulses with mid-range audio
      cluster.opacity = 0.85 + mid * 0.15;

      // Slow drift apart (unless reinforced by audio)
      if (audioLevel < 0.1) {
        const decayRate = 0.001;
        cluster.driftVelocity.multiplyScalar(1 - decayRate);
      }

      // Apply drift to cluster position
      cluster.position.add(cluster.driftVelocity);

      // Update constituent particle positions to match cluster
      for (const particleIdx of cluster.particleIndices) {
        this.positions[particleIdx].copy(cluster.position);
      }
    }
  }

  // Phase 11.7.19: Check if clusters should decay (particles drift apart)
  checkClusterDecay(threshold) {
    const clustersToRemove = [];

    for (let i = 0; i < this.clusters.length; i++) {
      const cluster = this.clusters[i];
      const age = performance.now() - cluster.createdAt;

      // If cluster is old and low audio, allow decay
      if (age > 5000 && (state?.audio?.level ?? 0) < 0.1) {
        // Release particles back to independent motion
        for (const particleIdx of cluster.particleIndices) {
          this.particleToCluster.delete(particleIdx);
          // Restore original velocity with small random jitter
          this.velocities[particleIdx].set(
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01
          );
        }
        clustersToRemove.push(i);
        console.log(`💥 Cluster #${cluster.id} decayed → particles restored`);
      }
    }

    // Remove decayed clusters (reverse order to preserve indices)
    for (let i = clustersToRemove.length - 1; i >= 0; i--) {
      this.clusters.splice(clustersToRemove[i], 1);
    }
  }

  // Phase 11.7.20: Generate constellation pattern positions
  generateConstellationPositions() {
    const { type, scale, customPattern } = state.emojiConstellations || {};
    const positions = [];

    switch (type) {
      case 'Line':
        // Simple line of particles
        for (let i = 0; i < this.count; i++) {
          const t = (i / (this.count - 1)) - 0.5; // -0.5 to 0.5
          positions.push(new THREE.Vector3(t * scale * 2, 0, 0));
        }
        break;

      case 'Triangle':
        // Equilateral triangle
        for (let i = 0; i < this.count; i++) {
          const angle = (i / this.count) * Math.PI * 2;
          const side = i % 3;
          if (side === 0) {
            positions.push(new THREE.Vector3(
              Math.cos(angle) * scale,
              Math.sin(angle) * scale,
              0
            ));
          } else if (side === 1) {
            positions.push(new THREE.Vector3(
              Math.cos(angle + Math.PI * 2/3) * scale,
              Math.sin(angle + Math.PI * 2/3) * scale,
              0
            ));
          } else {
            positions.push(new THREE.Vector3(
              Math.cos(angle + Math.PI * 4/3) * scale,
              Math.sin(angle + Math.PI * 4/3) * scale,
              0
            ));
          }
        }
        break;

      case 'Star':
        // 5-point star
        for (let i = 0; i < this.count; i++) {
          const angle = (i / this.count) * Math.PI * 2;
          const isOuter = i % 2 === 0;
          const radius = isOuter ? scale : scale * 0.4;
          positions.push(new THREE.Vector3(
            Math.cos(angle - Math.PI / 2) * radius,
            Math.sin(angle - Math.PI / 2) * radius,
            0
          ));
        }
        break;

      case 'Spiral':
        // Golden spiral / Fibonacci
        for (let i = 0; i < this.count; i++) {
          const theta = i * 0.5; // Spiral tightness
          const radius = scale * Math.sqrt(i / this.count);
          positions.push(new THREE.Vector3(
            Math.cos(theta) * radius,
            Math.sin(theta) * radius,
            i * 0.05 // Slight vertical offset
          ));
        }
        break;

      case 'CircleOf5ths':
        // Musical Circle of Fifths (12 positions)
        const fifthsOrder = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]; // Chromatic fifths
        for (let i = 0; i < this.count; i++) {
          const noteIndex = i % 12;
          const position = fifthsOrder[noteIndex];
          const angle = (position / 12) * Math.PI * 2 - Math.PI / 2;
          const ring = Math.floor(i / 12);
          const radius = scale * (1 + ring * 0.3);
          positions.push(new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            ring * 0.2
          ));
        }
        break;

      case 'Platonic':
        // Icosahedron vertices (20-sided platonic solid)
        const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
        const vertices = [
          [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
          [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
          [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1]
        ];
        for (let i = 0; i < this.count; i++) {
          const v = vertices[i % vertices.length];
          const scaleFactor = scale / 2;
          positions.push(new THREE.Vector3(
            v[0] * scaleFactor,
            v[1] * scaleFactor,
            v[2] * scaleFactor
          ));
        }
        break;

      case 'Custom':
        // Load from custom pattern JSON
        if (customPattern && customPattern.positions) {
          for (let i = 0; i < this.count; i++) {
            const p = customPattern.positions[i % customPattern.positions.length];
            positions.push(new THREE.Vector3(
              p.x * scale,
              p.y * scale,
              (p.z || 0) * scale
            ));
          }
        }
        break;

      default:
        // No constellation - return null to use default layout
        return null;
    }

    return positions;
  }

  // Phase 11.7.20: Apply constellation layout
  applyConstellation() {
    const { type, rotation, audioSync, beatSync } = state.emojiConstellations || {};

    if (type === 'None') return;

    const constellationPositions = this.generateConstellationPositions();
    if (!constellationPositions) return;

    const audioLevel = state?.audio?.level ?? 0;
    const rotationAngle = rotation + (audioSync ? audioLevel * 0.5 : 0);

    // Apply constellation positions with rotation
    for (let i = 0; i < this.count; i++) {
      if (i < constellationPositions.length) {
        const basePos = constellationPositions[i];

        // Apply rotation around Y axis
        const rotatedX = basePos.x * Math.cos(rotationAngle) - basePos.z * Math.sin(rotationAngle);
        const rotatedZ = basePos.x * Math.sin(rotationAngle) + basePos.z * Math.cos(rotationAngle);

        this.positions[i].set(rotatedX, basePos.y, rotatedZ);

        // Beat pulse scale
        if (beatSync && this.pulseAmount > 0) {
          const pulseScale = 1 + this.pulseAmount * 0.2;
          this.positions[i].multiplyScalar(pulseScale);
        }
      }
    }

    // Update rotation
    const rotSpeed = state.emojiConstellations?.rotationSpeed ?? 0.01;
    state.emojiConstellations.rotation += rotSpeed;
  }

  // Phase 11.7.21/11.7.22/11.7.26: Generate mandala pattern positions (with musical mode + layout modes)
  generateMandalaPositions() {
    const { enabled, rings, symmetry, ringRadii, musicalMode, scale, rootNote, layoutMode } = state.emojiMandala || {};
    if (!enabled) return null;

    const positions = [];
    const particleRingAssignment = []; // Track which ring each particle belongs to
    const particleNoteAssignment = []; // Track MIDI note for each particle (Phase 11.7.22)
    let particleIndex = 0;

    // Phase 11.7.22: Get scale intervals
    const scaleIntervals = musicalMode ? (MUSICAL_SCALES[scale] || MUSICAL_SCALES.Major) : null;

    // Phase 11.7.26: Layout mode (radial, spiral, grid)
    const mode = layoutMode || 'radial';
    const spiralOffset = Math.PI / 6; // 30 degrees per ring

    for (let ring = 0; ring < rings && ring < 6; ring++) {
      const radius = ringRadii[ring] || (ring * 2);
      let particlesInRing = ring === 0 ? 1 : symmetry;

      // Phase 11.7.22: Musical mode overrides particle count with scale notes
      if (musicalMode && scaleIntervals && ring > 0) {
        particlesInRing = scaleIntervals.length;
      }

      for (let i = 0; i < particlesInRing; i++) {
        if (particleIndex >= this.count) break;

        if (ring === 0) {
          // Center particle (root note in musical mode)
          positions.push(new THREE.Vector3(0, 0, 0));
          particleNoteAssignment.push(rootNote); // Root note
        } else {
          // Phase 11.7.26: Calculate position based on layout mode
          let x, y, z = 0;
          let angle;
          let midiNote = rootNote;

          // Calculate base angle
          if (musicalMode && scaleIntervals) {
            // Use Circle of Fifths spacing
            const interval = scaleIntervals[i % scaleIntervals.length];
            const fifthsIndex = CIRCLE_OF_FIFTHS.indexOf(interval);
            angle = (fifthsIndex / 12) * Math.PI * 2 - Math.PI / 2; // Start at top
            midiNote = rootNote + interval + (Math.floor(ring / 2) * 12); // Higher rings = higher octaves
          } else {
            // Standard symmetry spacing
            angle = (i / particlesInRing) * Math.PI * 2;
          }

          // Apply layout mode
          if (mode === 'spiral') {
            // Spiral: Add offset per ring to create Fibonacci-like spiral
            angle += ring * spiralOffset;
            x = Math.cos(angle) * radius;
            y = Math.sin(angle) * radius;
          } else if (mode === 'grid') {
            // Grid: XY lattice arrangement (ignore angle)
            const gridSize = Math.ceil(Math.sqrt(particlesInRing));
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const spacing = (radius * 2) / gridSize;
            x = (col - gridSize / 2) * spacing + spacing / 2;
            y = (row - gridSize / 2) * spacing + spacing / 2 + (ring * 2); // Offset by ring
          } else {
            // Radial (default): Concentric rings
            x = Math.cos(angle) * radius;
            y = Math.sin(angle) * radius;
          }

          positions.push(new THREE.Vector3(x, y, z));
          particleNoteAssignment.push(midiNote);
        }

        particleRingAssignment.push(ring);
        particleIndex++;
      }
    }

    // Fill remaining particles if any
    while (particleIndex < this.count) {
      positions.push(new THREE.Vector3(0, 0, 0));
      particleRingAssignment.push(rings - 1);
      particleNoteAssignment.push(rootNote);
      particleIndex++;
    }

    return { positions, particleRingAssignment, particleNoteAssignment };
  }

  // Phase 11.7.21/11.7.22/11.7.23/11.7.27: Apply mandala layout with layered audio + differential rotation + audio pulse
  applyMandala() {
    const { enabled, rotation, rotationSpeed, audioModulation, layeredAudio, musicalMode, activeNotes, notePulse,
            differentialRotation, ringRotationSpeeds, scaleSequenceEnabled, scaleSequence, scaleSequenceIndex,
            scaleSequenceInterval, lastScaleChange, mandalaAudioReactive, radiusPulse, anglePulse } = state.emojiMandala || {};
    if (!enabled) return;

    // Phase 11.7.23: Scale sequencing
    if (scaleSequenceEnabled && scaleSequence && scaleSequence.length > 0) {
      const now = performance.now();
      if (now - lastScaleChange >= scaleSequenceInterval) {
        const nextIndex = (scaleSequenceIndex + 1) % scaleSequence.length;
        state.emojiMandala.scaleSequenceIndex = nextIndex;
        state.emojiMandala.scale = scaleSequence[nextIndex];
        state.emojiMandala.lastScaleChange = now;
        console.log(`🎛️ Scale sequence → ${scaleSequence[nextIndex]}`);
      }
    }

    const mandalaData = this.generateMandalaPositions();
    if (!mandalaData) return;

    const { positions: mandalaPositions, particleRingAssignment, particleNoteAssignment } = mandalaData;
    const audioLevel = state?.audio?.level ?? 0;
    const bass = state?.audio?.bass ?? 0;
    const mid = state?.audio?.mid ?? 0;
    const treble = state?.audio?.treble ?? 0;

    // Apply mandala positions with rotation and layered audio scaling
    for (let i = 0; i < this.count; i++) {
      if (i < mandalaPositions.length) {
        const basePos = mandalaPositions[i];
        const ringIndex = particleRingAssignment[i];

        // Phase 11.7.23: Differential rotation per ring
        let rotationAngle;
        if (differentialRotation && ringRotationSpeeds) {
          const ringSpeed = ringRotationSpeeds[ringIndex] || 0.01;

          // Audio-reactive: outer rings (treble) spin faster
          const audioBoost = audioModulation ? (
            ringIndex === 0 ? bass * 0.2 :
            ringIndex <= 2 ? mid * 0.3 :
            treble * 0.5
          ) : 0;

          const effectiveSpeed = ringSpeed * (1 + audioBoost);

          // Initialize ring rotation tracking
          if (!this.ringRotations) this.ringRotations = Array(6).fill(0);
          this.ringRotations[ringIndex] += effectiveSpeed;
          rotationAngle = this.ringRotations[ringIndex];
        } else {
          // Global rotation (audio-modulated if enabled)
          rotationAngle = rotation + (audioModulation ? audioLevel * 0.3 : 0);
        }

        // Phase 11.7.27: Add angle pulse (symmetry twist on beats)
        if (mandalaAudioReactive && anglePulse) {
          rotationAngle += anglePulse;
        }

        // Phase 11.7.27: Apply radius pulse (mandala expansion on beats)
        const radiusScale = mandalaAudioReactive ? (1 + (radiusPulse || 0)) : 1.0;

        // Apply rotation around Z axis (top-down view)
        const rotatedX = basePos.x * Math.cos(rotationAngle) - basePos.y * Math.sin(rotationAngle);
        const rotatedY = basePos.x * Math.sin(rotationAngle) + basePos.y * Math.cos(rotationAngle);

        // Layered audio reactivity: different rings scale with different bands
        let audioScale = 1.0;
        if (layeredAudio) {
          if (ringIndex === 0) {
            // Center: bass
            audioScale = 1.0 + bass * 0.3;
          } else if (ringIndex <= 1) {
            // Inner rings: bass
            audioScale = 1.0 + bass * 0.2;
          } else if (ringIndex <= 3) {
            // Middle rings: mids
            audioScale = 1.0 + mid * 0.25;
          } else {
            // Outer rings: treble
            audioScale = 1.0 + treble * 0.3;
          }
        } else {
          audioScale = 1.0 + audioLevel * 0.2;
        }

        // Phase 11.7.22: Add MIDI note pulse in musical mode
        if (musicalMode && particleNoteAssignment[i] !== undefined) {
          const midiNote = particleNoteAssignment[i];
          const pulse = notePulse[midiNote] || 0;
          audioScale += pulse * 0.5; // Additional pulse from MIDI note

          // Store note for particle (for later reference)
          if (!this.particleNoteMap) this.particleNoteMap = {};
          this.particleNoteMap[i] = midiNote;
        }

        // Phase 11.7.27: Combine radius pulse with audio scale + emoji scale
        const finalScale = audioScale * radiusScale;

        this.positions[i].set(
          rotatedX * finalScale,
          rotatedY * finalScale,
          basePos.z
        );

        // Store ring index in particle metadata for later use
        if (!this.particleRingIndex) this.particleRingIndex = [];
        this.particleRingIndex[i] = ringIndex;
      }
    }

    // Update rotation
    const baseRotSpeed = rotationSpeed ?? 0.02;
    const finalRotSpeed = audioModulation ? baseRotSpeed * (1 + audioLevel * 2) : baseRotSpeed;
    state.emojiMandala.rotation += finalRotSpeed;
  }

  // Phase 13.5: Enhanced 3D Chladni cymatic resonance patterns
  applyChladni() {
    if (!this.chladniEnabled) return;

    const audioLevel = state?.audio?.level ?? 0;
    const bass = state?.audio?.bass ?? 0;
    const mid = state?.audio?.mid ?? 0;
    const treble = state?.audio?.treble ?? 0;

    // Audio-reactive mode numbers with wider range
    const m = this.chladniM + Math.floor(bass * 5);
    const n = this.chladniN + Math.floor(mid * 5);
    const k = Math.floor(treble * 4) + 2; // Third dimension mode

    // Advance phase for animation
    this.chladniPhase += this.chladniFrequency * (1 + audioLevel * 3) * 0.015;

    for (let i = 0; i < this.count; i++) {
      const pos = this.positions[i];

      // Normalize to [-1, 1] with tighter scaling for sharper patterns
      const x = pos.x / 4;
      const y = pos.y / 4;
      const z = pos.z / 4;

      // 3D Chladni equation - multiple resonance modes
      const chladni1 = Math.cos(n * Math.PI * x) * Math.cos(m * Math.PI * y);
      const chladni2 = Math.cos(m * Math.PI * x) * Math.cos(n * Math.PI * y);
      const chladni3 = Math.cos(k * Math.PI * z) * Math.cos((m + n) * Math.PI * 0.5 * (x + y));

      // Combine modes for complex 3D standing waves
      const chladniValue = chladni1 + chladni2 + chladni3 * 0.5;

      // Radial component for circular/spherical patterns
      const radius = Math.sqrt(x * x + y * y + z * z);
      const radialMode = Math.cos(m * Math.PI * radius) * Math.sin(n * Math.PI * radius);

      // Combine Cartesian and radial modes
      const combinedPattern = chladniValue * 0.7 + radialMode * 0.3;

      // Time-based oscillation with audio modulation
      const wavePhase = combinedPattern * 8 + this.chladniPhase;
      const wave = Math.sin(wavePhase) * (0.4 + audioLevel * 0.6);

      // Strong nodal line attraction (particles gather at zeros)
      const nodalStrength = 1.0 / (Math.abs(combinedPattern) + 0.1);
      const nodalPull = nodalStrength * wave * 0.15;

      // 3D displacement - perpendicular to gradient for standing wave effect
      const angle = Math.atan2(y, x);
      const elevation = Math.atan2(z, Math.sqrt(x * x + y * y));

      pos.x += Math.cos(angle) * Math.cos(elevation) * nodalPull;
      pos.y += Math.sin(angle) * Math.cos(elevation) * nodalPull;
      pos.z += Math.sin(elevation) * nodalPull + wave * 0.2;

      // Audio burst creates dramatic pattern shifts
      if (audioLevel > 0.7) {
        const burst = (audioLevel - 0.7) * 3;
        const spiralAngle = angle + radius * 2 + this.chladniPhase * 0.5;
        pos.x += Math.cos(spiralAngle) * burst * 0.1;
        pos.y += Math.sin(spiralAngle) * burst * 0.1;
        pos.z += Math.sin(wavePhase) * burst * 0.15;
      }
    }
  }

  // Phase 13.5: Enhanced multi-layer Moiré interference with sacred geometry
  applyMoire() {
    if (!this.moireEnabled) return;

    const audioLevel = state?.audio?.level ?? 0;
    const bass = state?.audio?.bass ?? 0;
    const mid = state?.audio?.mid ?? 0;
    const treble = state?.audio?.treble ?? 0;

    // Audio-reactive scale and speed (when audioReactive is enabled)
    const effectiveScale = this.audioReactive
      ? this.moireScale * (1.0 + audioLevel * 0.8 + treble * 0.5)
      : this.moireScale;

    const effectiveSpeed = this.audioReactive
      ? this.moireSpeed * (1.0 + audioLevel * 2.5 + bass * 1.5)
      : this.moireSpeed * (1 + audioLevel * 2);

    // Rotate multiple pattern layers for complex moiré effect
    this.moireRotation += effectiveSpeed;
    const rot2 = this.moireRotation * 1.618; // Golden ratio rotation
    const rot3 = this.moireRotation * 0.618;

    for (let i = 0; i < this.count; i++) {
      const pos = this.positions[i];

      // Cartesian position
      const x = pos.x;
      const y = pos.y;
      const z = pos.z;

      // Polar coordinates for radial patterns
      const radius = Math.sqrt(x * x + y * y);
      const theta = Math.atan2(y, x);

      // Layer 1: Square grid with audio-modulated frequency
      const freq1 = (2.0 + bass * 2) * effectiveScale;
      const pattern1 = Math.sin(x * freq1) * Math.sin(y * freq1) * Math.cos(z * freq1 * 0.5);

      // Layer 2: Rotated hexagonal grid (sacred geometry)
      const rotX = x * Math.cos(this.moireRotation) - y * Math.sin(this.moireRotation);
      const rotY = x * Math.sin(this.moireRotation) + y * Math.cos(this.moireRotation);
      const freq2 = (2.2 + mid * 1.5) * effectiveScale;
      const hexPattern = Math.sin(rotX * freq2) * Math.sin(rotY * freq2) +
                        Math.sin((rotX + rotY * Math.sqrt(3)) * freq2 * 0.5);

      // Layer 3: Spiral/vortex pattern (Fibonacci-inspired)
      const spiralFreq = 3.0 * effectiveScale;
      const spiralPhase = radius * spiralFreq - theta * 5 - rot3;
      const spiral = Math.sin(spiralPhase) * Math.cos(z * spiralFreq * 0.3);

      // Layer 4: Concentric rings (Flower of Life inspired)
      const ringFreq = (4.0 + treble * 3) * effectiveScale;
      const rings = Math.sin(radius * ringFreq) * Math.cos(theta * 6 + rot2);

      // Combine all layers with audio-reactive weighting
      const combined = pattern1 * 0.3 +
                      hexPattern * 0.25 +
                      spiral * (0.2 + bass * 0.2) +
                      rings * (0.25 + treble * 0.15);

      // Interference creates regions of constructive/destructive waves
      const interference = combined;

      // Strong attraction to interference maxima (bright fringes)
      const attractionStrength = Math.abs(interference) > 0.5 ? 0.3 : 0.1;
      const direction = new THREE.Vector3(x, y, z).normalize();

      // Radial push/pull based on interference
      const radialForce = interference * attractionStrength * (1 + audioLevel * 1.5);
      pos.x += direction.x * radialForce * 0.08;
      pos.y += direction.y * radialForce * 0.08;
      pos.z += direction.z * radialForce * 0.08;

      // Tangential flow creating vortex effect
      const tangentX = -y / (radius + 0.1);
      const tangentY = x / (radius + 0.1);
      const vortexStrength = spiral * 0.12 * (1 + mid * 0.5);
      pos.x += tangentX * vortexStrength;
      pos.y += tangentY * vortexStrength;

      // Vertical displacement creates 3D relief
      pos.z += interference * 0.3 * (1 + audioLevel);

      // Audio peaks create explosive expansion
      if (audioLevel > 0.75) {
        const burst = (audioLevel - 0.75) * 4;
        const burstAngle = theta + this.moireRotation;
        pos.x += Math.cos(burstAngle) * burst * 0.15;
        pos.y += Math.sin(burstAngle) * burst * 0.15;
        pos.z += Math.sin(interference * 10) * burst * 0.2;
      }
    }
  }

  // Phase 13.6: Spectrogram tessellations - FFT frequency bins mapped to radial mandala
  applySpectrogram() {
    if (!this.spectrogramEnabled) return;

    if (!this._spectrogramLoggedOnce) {
      console.log('🌌 Spectrogram pattern ACTIVE');
      this._spectrogramLoggedOnce = true;
    }

    const audioLevel = state?.audio?.level ?? 0;
    const bass = state?.audio?.bass ?? 0;
    const mid = state?.audio?.mid ?? 0;
    const treble = state?.audio?.treble ?? 0;

    // Get FFT data if available (simulated with audio bands for now)
    const fftBands = this.spectrogramBands;
    const fftData = [];

    // Simulate FFT spectrum from bass/mid/treble
    for (let b = 0; b < fftBands; b++) {
      const binPos = b / fftBands; // 0 to 1
      let amplitude = 0;

      // Low frequencies (0-0.33) - bass dominant
      if (binPos < 0.33) {
        amplitude = bass * (1 - binPos * 3) + mid * (binPos * 3);
      }
      // Mid frequencies (0.33-0.66) - mid dominant
      else if (binPos < 0.66) {
        const midPos = (binPos - 0.33) * 3;
        amplitude = mid * (1 - Math.abs(midPos - 0.5) * 2) + bass * (1 - midPos) + treble * midPos;
      }
      // High frequencies (0.66-1.0) - treble dominant
      else {
        const highPos = (binPos - 0.66) * 3;
        amplitude = treble * highPos + mid * (1 - highPos);
      }

      // Add some variation and clamp
      amplitude = Math.max(0, Math.min(1, amplitude + Math.sin(b * 0.5 + audioLevel * 10) * 0.1));
      fftData.push(amplitude);
    }

    // Rotate the spectrogram mandala
    this.spectrogramRotation += this.spectrogramSpeed * (1 + audioLevel * 2);

    for (let i = 0; i < this.count; i++) {
      const pos = this.positions[i];
      const x = pos.x;
      const y = pos.y;
      const z = pos.z;

      // Convert to polar coordinates
      const radius = Math.sqrt(x * x + y * y);
      const theta = Math.atan2(y, x) + this.spectrogramRotation;

      // Map particle to frequency band based on angle
      const normalizedAngle = (theta + Math.PI) / (2 * Math.PI); // 0 to 1
      const bandIndex = Math.floor(normalizedAngle * fftBands) % fftBands;
      const bandAmplitude = fftData[bandIndex];

      // Create radial rings for each frequency band
      const ringCount = 8;
      const ringIndex = Math.floor((radius / this.spectrogramRadius) * ringCount) % ringCount;
      const ringPhase = (radius / this.spectrogramRadius) * ringCount - ringIndex;

      // Tessellation: particles organize into cellular structures
      const cellAngle = Math.floor(normalizedAngle * fftBands * 2) / (fftBands * 2) * Math.PI * 2;
      const cellRadius = (ringIndex + 0.5) * (this.spectrogramRadius / ringCount);

      // Target position for this cell
      const targetX = Math.cos(cellAngle - this.spectrogramRotation) * cellRadius;
      const targetY = Math.sin(cellAngle - this.spectrogramRotation) * cellRadius;

      // Attraction to tessellation grid with audio modulation (INCREASED STRENGTH)
      const attractionStrength = 0.5 * (1 + bandAmplitude * 2);
      pos.x += (targetX - x) * attractionStrength;
      pos.y += (targetY - y) * attractionStrength;

      // Radial pulsing based on frequency amplitude (INCREASED)
      const radialPulse = bandAmplitude * 2.0 * Math.sin(ringPhase * Math.PI);
      const pulseDir = new THREE.Vector3(x, y, 0).normalize();
      pos.x += pulseDir.x * radialPulse;
      pos.y += pulseDir.y * radialPulse;

      // Vertical displacement creates 3D mandala effect (INCREASED)
      const verticalWave = Math.sin(normalizedAngle * fftBands + audioLevel * 5) * bandAmplitude;
      pos.z += verticalWave * 2.0;

      // High frequency peaks create spiral arms (INCREASED)
      if (bandAmplitude > 0.7) {
        const spiralPhase = theta * 3 + radius * 0.5 + audioLevel * 5;
        const spiralStrength = (bandAmplitude - 0.7) * 3;
        pos.x += Math.cos(spiralPhase) * spiralStrength * 1.0;
        pos.y += Math.sin(spiralPhase) * spiralStrength * 1.0;
        pos.z += Math.sin(spiralPhase * 2) * spiralStrength * 1.5;
      }
    }
  }

  // Phase 13.6: Phase-shift interference - holographic moiré with depth
  applyPhaseShift() {
    if (!this.phaseShiftEnabled) return;

    const audioLevel = state?.audio?.level ?? 0;
    const bass = state?.audio?.bass ?? 0;
    const mid = state?.audio?.mid ?? 0;
    const treble = state?.audio?.treble ?? 0;

    // Advance phase for animation
    this.phaseShiftPhase += this.phaseShiftSpeed * (1 + audioLevel * 2);

    for (let i = 0; i < this.count; i++) {
      const pos = this.positions[i];
      const x = pos.x;
      const y = pos.y;
      const z = pos.z;

      const radius = Math.sqrt(x * x + y * y);
      const theta = Math.atan2(y, x);

      // Create multiple interference layers with phase offsets
      let totalInterference = 0;

      for (let layer = 0; layer < this.phaseShiftLayers; layer++) {
        // Each layer has different frequency, phase, and orientation
        const layerPhase = this.phaseShiftPhase + layer * (Math.PI * 2 / this.phaseShiftLayers);
        const layerFreq = 2.0 + layer * 0.5;
        const layerAngle = (Math.PI * 2 / this.phaseShiftLayers) * layer;

        // Rotate coordinate system for each layer
        const rotX = x * Math.cos(layerAngle) - y * Math.sin(layerAngle);
        const rotY = x * Math.sin(layerAngle) + y * Math.cos(layerAngle);

        // Create wave pattern with audio modulation
        const wave1 = Math.sin(rotX * layerFreq + layerPhase + bass * 3);
        const wave2 = Math.sin(rotY * layerFreq - layerPhase + mid * 3);
        const wave3 = Math.sin(z * layerFreq * 0.5 + layerPhase * 1.5 + treble * 3);

        // Combine waves for 3D interference
        const layerInterference = (wave1 + wave2 + wave3) / 3;

        // Weight layers (center layers stronger)
        const layerWeight = 1.0 - Math.abs((layer / (this.phaseShiftLayers - 1)) - 0.5);
        totalInterference += layerInterference * layerWeight;
      }

      // Normalize interference
      totalInterference /= this.phaseShiftLayers;

      // Holographic depth effect - particles move in/out of phase planes (INCREASED)
      const depthDisplacement = totalInterference * this.phaseShiftDepth * 2.0;
      const depthDir = new THREE.Vector3(x, y, z).normalize();
      pos.x += depthDir.x * depthDisplacement * (1 + audioLevel);
      pos.y += depthDir.y * depthDisplacement * (1 + audioLevel);
      pos.z += depthDir.z * depthDisplacement * (1 + audioLevel);

      // Tangential flow from interference gradients (creates vortex) (INCREASED)
      const gradientAngle = theta + Math.PI / 2;
      const flowStrength = totalInterference * 1.0 * (1 + mid * 0.5);
      pos.x += Math.cos(gradientAngle) * flowStrength;
      pos.y += Math.sin(gradientAngle) * flowStrength;

      // Vertical oscillation with interference maxima (INCREASED)
      const verticalOscillation = Math.abs(totalInterference) * 2.0;
      pos.z += Math.sin(this.phaseShiftPhase * 2 + radius) * verticalOscillation;

      // Strong audio creates destructive interference bursts (INCREASED)
      if (audioLevel > 0.75) {
        const burstStrength = (audioLevel - 0.75) * 4;
        const burstPhase = totalInterference * 10 + this.phaseShiftPhase;
        const burstX = Math.cos(burstPhase) * Math.cos(theta);
        const burstY = Math.cos(burstPhase) * Math.sin(theta);
        const burstZ = Math.sin(burstPhase);

        pos.x += burstX * burstStrength * 0.8;
        pos.y += burstY * burstStrength * 0.8;
        pos.z += burstZ * burstStrength * 1.0;
      }
    }
  }

  // Phase 13.6: Color and light diffraction (particle displacement, color in shader)
  applyDiffraction() {
    if (!this.diffractionEnabled) return;

    const audioLevel = state?.audio?.level ?? 0;
    const bass = state?.audio?.bass ?? 0;
    const mid = state?.audio?.mid ?? 0;
    const treble = state?.audio?.treble ?? 0;

    // Rotate the prism angle
    this.diffractionAngle += this.diffractionSpeed * (1 + audioLevel * 2);

    for (let i = 0; i < this.count; i++) {
      const pos = this.positions[i];
      const x = pos.x;
      const y = pos.y;
      const z = pos.z;

      const radius = Math.sqrt(x * x + y * y);
      const theta = Math.atan2(y, x);

      // Simulate wavelength-dependent refraction (dispersion)
      // Each particle gets a "wavelength" based on its index (hue in shader)
      const wavelength = (i % 360) / 360.0; // 0 to 1 (will map to color in shader)

      // Dispersion: different wavelengths refract at different angles (INCREASED)
      const dispersionAngle = this.diffractionAngle + wavelength * Math.PI * 0.5;
      const refractionStrength = this.diffractionIntensity * 2.0 * (1 + audioLevel);

      // Chromatic displacement - particles spread in rainbow pattern (INCREASED)
      const disperseX = Math.cos(dispersionAngle) * refractionStrength;
      const disperseY = Math.sin(dispersionAngle) * refractionStrength;

      pos.x += disperseX * (1 + bass * 0.5);
      pos.y += disperseY * (1 + mid * 0.5);

      // Iridescent wave patterns (like soap bubbles or oil slicks)
      const iridescencePhase = radius * 3.0 + theta * 2.0 - this.diffractionAngle * 2;
      const iridescence = Math.sin(iridescencePhase + wavelength * Math.PI * 2) * 0.5 + 0.5;

      // Thin-film interference creates oscillating patterns
      const filmThickness = 1.0 + audioLevel * 2;
      const interference = Math.cos(iridescencePhase * filmThickness + wavelength * Math.PI * 4);

      // Displacement based on interference (INCREASED)
      const interferenceStrength = interference * iridescence * 1.5;
      const radialDir = new THREE.Vector3(x, y, 0).normalize();
      pos.x += radialDir.x * interferenceStrength * (1 + treble);
      pos.y += radialDir.y * interferenceStrength * (1 + treble);

      // Vertical rainbow stacking (spectral separation) (INCREASED)
      const spectralHeight = (wavelength - 0.5) * this.diffractionIntensity * 3.0;
      pos.z += spectralHeight * (1 + audioLevel * 0.5);

      // Diffraction grating effect - periodic bright/dark fringes (INCREASED)
      const gratingPeriod = 1.5;
      const gratingPhase = (x * Math.cos(this.diffractionAngle) + y * Math.sin(this.diffractionAngle)) / gratingPeriod;
      const gratingPattern = Math.sin(gratingPhase * Math.PI * 2 + wavelength * Math.PI * 8);

      // Particles attracted to bright fringes (INCREASED)
      const fringeAttraction = gratingPattern * 1.0 * this.diffractionIntensity;
      const fringeDir = new THREE.Vector3(
        -Math.sin(this.diffractionAngle),
        Math.cos(this.diffractionAngle),
        0
      );
      pos.x += fringeDir.x * fringeAttraction;
      pos.y += fringeDir.y * fringeAttraction;

      // High audio creates prismatic explosion (INCREASED)
      if (audioLevel > 0.7) {
        const prismBurst = (audioLevel - 0.7) * 3;
        const burstAngle = wavelength * Math.PI * 2; // Rainbow radial burst
        pos.x += Math.cos(burstAngle) * prismBurst * 1.5;
        pos.y += Math.sin(burstAngle) * prismBurst * 1.5;
        pos.z += Math.sin(wavelength * Math.PI * 4 + this.diffractionAngle * 5) * prismBurst * 2.0;
      }
    }
  }

  // Phase 11.7.5/11.7.10: Position instances or sprites based on current layout
  positionSprites() {
    const positionInstance = (i, pos) => {
      if (this.useInstancing && this.instancedMesh) {
        this.positions[i].copy(pos);
        const baseScale = this.baseScales[i];
        this.dummy.position.copy(pos);
        this.dummy.scale.set(baseScale, baseScale, baseScale);
        this.dummy.rotation.z = this.rotations[i];
        this.dummy.updateMatrix();
        this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
      } else if (this.sprites && this.sprites[i]) {
        this.sprites[i].position.copy(pos);
      }
    };

    for (let i = 0; i < this.count; i++) {
      const pos = new THREE.Vector3();

      if (this.layout === "cube") {
        pos.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        );
      } else if (this.layout === "sphere") {
        const r = 5;
        const theta = Math.acos(2 * Math.random() - 1);
        const phi = 2 * Math.PI * Math.random();
        pos.set(
          r * Math.sin(theta) * Math.cos(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(theta)
        );
      } else if (this.layout === "ring" || this.layout === "orbit") {
        // Phase 11.7.14: Multi-ring orbit with stored radii
        const ringIndex = i % this.orbitRings;
        const r = 4 + ringIndex * 2; // Rings at r=4, 6, 8...
        this.orbitRadii[i] = r; // Store for dynamic rotation
        const angle = (i / this.count) * Math.PI * 2;
        pos.set(
          r * Math.cos(angle),
          0,
          r * Math.sin(angle)
        );
      } else if (this.layout === "random") {
        pos.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );
      } else if (this.layout === "spiral") {
        const angle = i * 0.3;
        const radius = 5 + i * 0.02;
        pos.set(
          Math.cos(angle) * radius,
          i * 0.1,
          Math.sin(angle) * radius
        );
      } else if (this.layout === "wave") {
        // Phase 11.7.14: Enhanced grid with configurable spacing
        const gridWidth = Math.ceil(Math.sqrt(this.count));
        const x = (i % gridWidth) * this.gridSpacing - (gridWidth * this.gridSpacing) / 2;
        const z = Math.floor(i / gridWidth) * this.gridSpacing - (gridWidth * this.gridSpacing) / 2;
        pos.set(x, Math.sin((x + z) * 0.5) * 2, z);
      } else if (this.layout === "burst") {
        const r = Math.random() * 2;
        const theta = Math.acos(2 * Math.random() - 1);
        const phi = 2 * Math.PI * Math.random();
        pos.set(
          r * Math.sin(theta) * Math.cos(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(theta)
        );
        // Set outward velocity for burst effect
        const vel = this.velocities[i];
        const direction = pos.clone().normalize();
        vel.copy(direction.multiplyScalar(0.02));
      }

      positionInstance(i, pos);
    }

    // Update instance matrix after all positions set
    if (this.useInstancing && this.instancedMesh) {
      this.instancedMesh.instanceMatrix.needsUpdate = true;
    }
  }

  // Phase 11.7.5: Set layout and reposition all sprites
  setLayout(layout) {
    this.layout = layout;
    this.positionSprites();
    console.log(`🍕 Emoji layout set to: ${layout}`);
  }

  // Phase 11.7.8: Set audio reactivity multiplier
  setAudioReactivity(value) {
    this.audioReactivity = value;
    console.log(`🍕 Emoji audio reactivity = ${value.toFixed(1)}x`);
  }

  // Phase 11.7.11: Toggle signal linking (morph/audio)
  setSignalLinking(enabled) {
    this.linkedToSignals = enabled;
    if (enabled) {
      console.log("🍕 EmojiParticles linked to morph/audio");
    } else {
      console.log("🍕 EmojiParticles unlinked from signals");
    }
  }

  // Phase 11.7.12: Load emoji set
  loadEmojiSet(setName) {
    if (!EMOJI_SETS[setName]) {
      console.warn(`🍕 Unknown emoji set: ${setName}`);
      return;
    }
    this.currentSet = setName;
    this.currentSetIndex = 0;
    this.emoji = EMOJI_SETS[setName][0];
    this.swapEmoji(this.emoji);
    console.log(`🍕 Emoji set loaded: ${setName}`);
  }

  // Phase 11.7.12: Cycle to next emoji in current set
  cycleEmoji() {
    if (!this.currentSet || !EMOJI_SETS[this.currentSet]) {
      console.warn("🍕 No emoji set active for cycling");
      return;
    }
    const set = EMOJI_SETS[this.currentSet];
    this.currentSetIndex = (this.currentSetIndex + 1) % set.length;
    this.emoji = set[this.currentSetIndex];
    this.swapEmoji(this.emoji);
    console.log(`🍕 Emoji cycled: ${this.emoji}`);
  }

  // Phase 11.7.12: Toggle auto-cycle mode
  setAutoCycle(enabled, interval = 4000) {
    this.autoCycleEnabled = enabled;
    this.cycleInterval = interval;
    this.lastCycleTime = performance.now();
    if (enabled) {
      console.log(`🍕 Emoji auto-cycle enabled (${interval}ms interval)`);
    } else {
      console.log("🍕 Emoji auto-cycle disabled");
    }
  }

  // Phase 11.7.13: Set BPM for beat sync
  setBPM(bpm) {
    this.bpm = bpm;
    console.log(`🥁 Emoji sync at ${bpm} BPM`);
  }

  // Phase 11.7.13: Toggle beat sync
  setBeatSync(enabled) {
    this.beatSyncEnabled = enabled;
    this.lastBeatTime = performance.now();
    if (enabled) {
      console.log(`🥁 Beat sync enabled at ${this.bpm} BPM`);
    } else {
      console.log("🥁 Beat sync disabled");
    }
  }

  // Phase 11.7.13: Set subdivision (4=quarter, 8=eighth, 16=sixteenth)
  setSubdivision(subdivision) {
    this.subdivision = subdivision;
    const noteNames = { 4: "1/4", 8: "1/8", 16: "1/16" };
    console.log(`🥁 Emoji subdivision = ${noteNames[subdivision] || subdivision} notes`);
  }

  // Phase 11.7.13: Toggle onset detection
  setOnsetDetection(enabled) {
    this.onsetDetection = enabled;
    if (enabled) {
      console.log("🥁 Onset detection enabled");
    } else {
      console.log("🥁 Onset detection disabled");
    }
  }

  // Phase 11.7.13: Toggle sequencer mode
  setSequencer(enabled, sequence = ["🍕", "🌶️", "🍄", "🧄"]) {
    this.sequencerEnabled = enabled;
    this.sequence = sequence;
    this.sequenceIndex = 0;
    if (enabled) {
      console.log(`🥁 Sequencer ON: ${sequence.join(" → ")}`);
    } else {
      console.log("🥁 Sequencer OFF");
    }
  }

  // Phase 11.7.13: Trigger beat pulse and sequencer step
  triggerBeat() {
    this.pulseAmount = 1.0;
    this.lastPulseTime = performance.now();

    // Sequencer: advance to next emoji
    if (this.sequencerEnabled && this.sequence.length > 0) {
      this.emoji = this.sequence[this.sequenceIndex];
      this.swapEmoji(this.emoji);
      console.log(`🥁 Step ${this.sequenceIndex + 1}/${this.sequence.length} → ${this.emoji}`);
      this.sequenceIndex = (this.sequenceIndex + 1) % this.sequence.length;
    }
  }

  // Phase 11.7.12: Toggle story mode
  setStoryMode(enabled, sequence = ["pizza", "cosmos", "myth"]) {
    this.storyMode = enabled;
    this.storySequence = sequence;
    this.storyIndex = 0;
    if (enabled) {
      this.loadEmojiSet(sequence[0]);
      console.log(`📖 Story mode enabled: ${sequence.join(" → ")}`);
    } else {
      console.log("📖 Story mode disabled");
    }
  }

  // Phase 11.7.12: Advance to next set in story
  advanceStory() {
    if (!this.storyMode || this.storySequence.length === 0) {
      console.warn("📖 Story mode not active");
      return;
    }
    this.storyIndex = (this.storyIndex + 1) % this.storySequence.length;
    const nextSet = this.storySequence[this.storyIndex];
    this.loadEmojiSet(nextSet);
    console.log(`📖 Story advanced → ${nextSet} set`);
  }

  // Phase 11.7.10/11.7.50: Swap emoji texture (instanced or sprite mode) with custom image support
  swapEmoji(newEmoji) {
    this.emoji = newEmoji;

    // Phase 11.7.50: Check if custom image should be used instead of emoji
    let texture;
    if (state.mandala?.useCustomImage && state.mandala?.customImage) {
      // Load custom image texture from data URL
      const loader = new THREE.TextureLoader();
      texture = loader.load(state.mandala.customImage,
        () => {
          console.log(`🖼️ Custom mandala image loaded: ${state.mandala.customImageName || 'uploaded image'}`);
          // Update material after texture loads
          if (this.useInstancing && this.instancedMesh) {
            this.instancedMesh.material.needsUpdate = true;
          } else if (this.sprites) {
            this.sprites.forEach(sprite => sprite.material.needsUpdate = true);
          }
        },
        undefined,
        (error) => {
          console.error('🖼️ Failed to load custom mandala image, falling back to emoji:', error);
          // Fallback to emoji on error
          const fallbackTexture = this.createEmojiTexture(newEmoji, 128);
          this.applyTexture(fallbackTexture);
        }
      );
    } else {
      // Use emoji texture
      texture = this.createEmojiTexture(newEmoji, 128);
    }

    this.applyTexture(texture);

    const sourceType = (state.mandala?.useCustomImage && state.mandala?.customImage) ? 'custom image' : 'emoji';
    console.log(`🍕 Texture updated: ${sourceType} ${sourceType === 'emoji' ? newEmoji : '(' + (state.mandala?.customImageName || 'uploaded') + ')'}`);
  }

  // Phase 11.7.50: Helper to apply texture to instanced mesh or sprites
  applyTexture(texture) {
    if (this.useInstancing && this.instancedMesh) {
      // Update instanced mesh material texture
      if (this.instancedMesh.material.map) {
        this.instancedMesh.material.map.dispose();
      }
      this.instancedMesh.material.map = texture;
      this.instancedMesh.material.needsUpdate = true;
    } else if (this.sprites) {
      // Fallback sprite mode
      this.sprites.forEach(sprite => {
        if (sprite.material.map) {
          sprite.material.map.dispose();
        }
        sprite.material.map = texture;
        sprite.material.needsUpdate = true;
      });
    }
  }

  // Phase 11.7.10: Dispose (instanced or sprite mode)
  dispose() {
    if (this.useInstancing && this.instancedMesh) {
      this.scene.remove(this.instancedMesh);
      this.instancedMesh.geometry.dispose();
      this.instancedMesh.material.dispose();
      if (this.instancedMesh.material.map) {
        this.instancedMesh.material.map.dispose();
      }
      this.instancedMesh = null;
      console.log("🍕 EmojiParticles (instanced) disposed");
    } else if (this.sprites) {
      this.sprites.forEach(sprite => {
        this.scene.remove(sprite);
        sprite.material.dispose();
        if (sprite.material.map) sprite.material.map.dispose();
      });
      this.sprites = [];
      console.log("🍕 EmojiParticles disposed");
    }

    this.positions = [];
    this.velocities = [];
    this.baseScales = [];
    this.rotations = [];
  }
}

// Phase 11.7.15: Emoji Mixer & Multiple Streams Manager
export class EmojiStreamManager {
  constructor(scene) {
    this.scene = scene;
    this.streams = new Map(); // Map<emoji, EmojiParticles>
    console.log("🎨 EmojiStreamManager initialized");
  }

  // Add a new emoji stream
  addStream(emoji, count = 100, enabled = true) {
    if (this.streams.has(emoji)) {
      console.warn(`🎨 Stream already exists: ${emoji}`);
      return;
    }

    const stream = new EmojiParticles(this.scene, count, emoji);
    stream.enabled = enabled;

    if (!enabled) {
      // If disabled, remove from scene immediately
      if (stream.instancedMesh) {
        this.scene.remove(stream.instancedMesh);
      }
    }

    this.streams.set(emoji, stream);
    console.log(`${emoji} Stream added: ${count}`);
  }

  // Remove and dispose a stream
  removeStream(emoji) {
    const stream = this.streams.get(emoji);
    if (!stream) {
      console.warn(`🎨 Stream not found: ${emoji}`);
      return;
    }

    stream.dispose();
    this.streams.delete(emoji);
    console.log(`${emoji} Stream disposed`);
  }

  // Toggle stream visibility without disposing
  toggleStream(emoji, enabled) {
    const stream = this.streams.get(emoji);
    if (!stream) {
      console.warn(`🎨 Stream not found: ${emoji}`);
      return;
    }

    stream.enabled = enabled;

    if (enabled) {
      // Re-add to scene
      if (stream.instancedMesh && !this.scene.children.includes(stream.instancedMesh)) {
        this.scene.add(stream.instancedMesh);
      }
      console.log(`${emoji} Stream enabled`);
    } else {
      // Remove from scene but keep in memory
      if (stream.instancedMesh) {
        this.scene.remove(stream.instancedMesh);
      }
      console.log(`${emoji} Stream disabled`);
    }
  }

  // Update stream count (recreate with new count)
  updateStreamCount(emoji, newCount) {
    const stream = this.streams.get(emoji);
    if (!stream) {
      console.warn(`🎨 Stream not found: ${emoji}`);
      return;
    }

    const wasEnabled = stream.enabled;
    const layout = stream.layout;
    const audioReactivity = stream.audioReactivity;

    // Dispose old stream
    stream.dispose();

    // Create new stream with updated count
    const newStream = new EmojiParticles(this.scene, newCount, emoji);
    newStream.enabled = wasEnabled;
    newStream.setLayout(layout);
    newStream.setAudioReactivity(audioReactivity);

    if (!wasEnabled && newStream.instancedMesh) {
      this.scene.remove(newStream.instancedMesh);
    }

    this.streams.set(emoji, newStream);
    console.log(`${emoji} Count updated: ${newCount}`);
  }

  // Update all active streams
  update(audioLevel) {
    this.streams.forEach((stream, emoji) => {
      if (stream.enabled) {
        stream.update(audioLevel);
      }
    });
  }

  // Phase 11.7.18: Set physics mode for all streams
  setPhysicsMode(mode) {
    this.streams.forEach((stream, emoji) => {
      stream.setPhysicsMode(mode);
    });
  }

  // Get all streams as array (for state sync)
  getStreamsArray() {
    const arr = [];
    this.streams.forEach((stream, emoji) => {
      arr.push({
        emoji,
        count: stream.count,
        enabled: stream.enabled
      });
    });
    return arr;
  }

  // Load streams from state array
  loadStreams(streamsArray) {
    // Clear existing streams
    this.streams.forEach((stream, emoji) => {
      stream.dispose();
    });
    this.streams.clear();

    // Add new streams from array
    streamsArray.forEach(({ emoji, count, enabled }) => {
      this.addStream(emoji, count, enabled);
    });

    console.log(`🎨 Loaded ${streamsArray.length} emoji streams`);
  }

  // Dispose all streams
  dispose() {
    this.streams.forEach((stream, emoji) => {
      stream.dispose();
    });
    this.streams.clear();
    console.log("🎨 EmojiStreamManager disposed");
  }
}

// Phase 11.7.16: Emoji Sequencer & Timeline
export class EmojiSequencer {
  constructor(streamManager) {
    this.streamManager = streamManager;
    this.enabled = false;
    this.bpm = 120;
    this.currentBeat = 0;
    this.patterns = {}; // { emoji: [1,0,1,0,...] }
    this.timelineLength = 16;
    this.lastBeatTime = performance.now();
    this.beatInterval = (60000 / this.bpm); // milliseconds per beat

    console.log("🎶 EmojiSequencer initialized");
  }

  // Set BPM and recalculate beat interval
  setBPM(bpm) {
    this.bpm = bpm;
    this.beatInterval = (60000 / this.bpm);
    console.log(`🎶 Sequencer BPM set to ${bpm}`);
  }

  // Set timeline length (number of beats)
  setTimelineLength(length) {
    this.timelineLength = length;
    // Extend or truncate existing patterns
    Object.keys(this.patterns).forEach(emoji => {
      const pattern = this.patterns[emoji];
      if (pattern.length < length) {
        // Extend with zeros
        this.patterns[emoji] = [...pattern, ...new Array(length - pattern.length).fill(0)];
      } else if (pattern.length > length) {
        // Truncate
        this.patterns[emoji] = pattern.slice(0, length);
      }
    });
    console.log(`🎶 Timeline length set to ${length} beats`);
  }

  // Set pattern for an emoji
  setPattern(emoji, pattern) {
    if (!Array.isArray(pattern)) {
      console.warn(`🎶 Invalid pattern for ${emoji}`);
      return;
    }
    // Ensure pattern matches timeline length
    if (pattern.length !== this.timelineLength) {
      const adjusted = new Array(this.timelineLength).fill(0);
      for (let i = 0; i < Math.min(pattern.length, this.timelineLength); i++) {
        adjusted[i] = pattern[i];
      }
      this.patterns[emoji] = adjusted;
    } else {
      this.patterns[emoji] = [...pattern];
    }
    console.log(`🎶 Pattern set for ${emoji}: ${this.patterns[emoji].join('')}`);
  }

  // Toggle beat in pattern
  toggleBeat(emoji, beatIndex) {
    if (!this.patterns[emoji]) {
      this.patterns[emoji] = new Array(this.timelineLength).fill(0);
    }
    this.patterns[emoji][beatIndex] = this.patterns[emoji][beatIndex] ? 0 : 1;
    console.log(`🎶 ${emoji} beat ${beatIndex}: ${this.patterns[emoji][beatIndex] ? 'ON' : 'OFF'}`);
    return this.patterns[emoji][beatIndex];
  }

  // Get pattern for emoji (create if doesn't exist)
  getPattern(emoji) {
    if (!this.patterns[emoji]) {
      this.patterns[emoji] = new Array(this.timelineLength).fill(0);
    }
    return this.patterns[emoji];
  }

  // Enable/disable sequencer
  setEnabled(enabled) {
    this.enabled = enabled;
    if (enabled) {
      this.currentBeat = 0;
      this.lastBeatTime = performance.now();
      console.log(`🎶 Sequencer ON @ ${this.bpm} BPM`);
    } else {
      console.log("🎶 Sequencer OFF");
    }
  }

  // Reset to beat 0
  reset() {
    this.currentBeat = 0;
    this.lastBeatTime = performance.now();
    console.log("🎶 Sequencer reset to beat 0");
  }

  // Update - called each frame
  update() {
    if (!this.enabled) return;

    const now = performance.now();
    const elapsed = now - this.lastBeatTime;

    // Check if it's time to advance to next beat
    if (elapsed >= this.beatInterval) {
      this.advanceBeat();
      this.lastBeatTime = now;
    }
  }

  // Advance to next beat and apply pattern
  advanceBeat() {
    this.currentBeat = (this.currentBeat + 1) % this.timelineLength;

    // Apply patterns for this beat
    Object.keys(this.patterns).forEach(emoji => {
      const shouldBeActive = this.patterns[emoji][this.currentBeat];
      const stream = this.streamManager.streams.get(emoji);

      if (stream) {
        const wasEnabled = stream.enabled;
        const nowEnabled = shouldBeActive === 1;

        if (wasEnabled !== nowEnabled) {
          this.streamManager.toggleStream(emoji, nowEnabled);
          if (nowEnabled) {
            console.log(`🎶 ${emoji} active on beat ${this.currentBeat + 1}`);
          }
        }
      }
    });
  }

  // Load from state
  loadFromState(stateData) {
    this.bpm = stateData.bpm || 120;
    this.timelineLength = stateData.timelineLength || 16;
    this.patterns = {};

    // Deep copy patterns
    Object.keys(stateData.patterns || {}).forEach(emoji => {
      this.patterns[emoji] = [...stateData.patterns[emoji]];
    });

    this.beatInterval = (60000 / this.bpm);
    console.log(`🎶 Sequencer loaded: ${this.bpm} BPM, ${this.timelineLength} beats`);
  }

  // Save to state
  saveToState() {
    return {
      enabled: this.enabled,
      bpm: this.bpm,
      currentBeat: this.currentBeat,
      patterns: JSON.parse(JSON.stringify(this.patterns)), // Deep copy
      timelineLength: this.timelineLength
    };
  }
}

// Phase 11.7.17: Emoji Pattern Banks Manager
export class EmojiPatternBankManager {
  constructor(streamManager, sequencer) {
    this.streamManager = streamManager;
    this.sequencer = sequencer;
    this.banks = new Array(8).fill(null); // 8 bank slots
    this.currentBankIndex = null;

    console.log("💾 EmojiPatternBankManager initialized (8 banks)");
  }

  // Save current state to a bank
  saveBank(bankIndex, name = null) {
    if (bankIndex < 0 || bankIndex >= 8) {
      console.warn(`💾 Invalid bank index: ${bankIndex}`);
      return false;
    }

    // Capture current streams
    const streams = this.streamManager.getStreamsArray();

    // Capture current sequencer state
    const sequencerState = this.sequencer.saveToState();

    const bankData = {
      name: name || `Bank ${bankIndex + 1}`,
      streams: JSON.parse(JSON.stringify(streams)), // Deep copy
      patterns: JSON.parse(JSON.stringify(sequencerState.patterns)),
      bpm: sequencerState.bpm,
      timelineLength: sequencerState.timelineLength,
      timestamp: new Date().toISOString()
    };

    this.banks[bankIndex] = bankData;

    // Build emoji summary
    const emojiList = streams.map(s => s.emoji).join('');
    console.log(`💾 Bank ${bankIndex + 1} saved → ${emojiList}`);

    return true;
  }

  // Load a bank
  loadBank(bankIndex) {
    if (bankIndex < 0 || bankIndex >= 8) {
      console.warn(`📂 Invalid bank index: ${bankIndex}`);
      return false;
    }

    const bank = this.banks[bankIndex];
    if (!bank) {
      console.warn(`📂 Bank ${bankIndex + 1} is empty`);
      return false;
    }

    // Load streams
    if (this.streamManager) {
      this.streamManager.loadStreams(bank.streams);
    }

    // Load sequencer patterns
    if (this.sequencer) {
      this.sequencer.loadFromState({
        bpm: bank.bpm,
        patterns: bank.patterns,
        timelineLength: bank.timelineLength,
        enabled: this.sequencer.enabled // Preserve enabled state
      });
    }

    this.currentBankIndex = bankIndex;

    const emojiList = bank.streams.map(s => s.emoji).join('');
    console.log(`📂 Bank ${bankIndex + 1} loaded → ${emojiList}`);

    return true;
  }

  // Clear a bank
  clearBank(bankIndex) {
    if (bankIndex < 0 || bankIndex >= 8) {
      console.warn(`💾 Invalid bank index: ${bankIndex}`);
      return false;
    }

    this.banks[bankIndex] = null;
    console.log(`💾 Bank ${bankIndex + 1} cleared`);
    return true;
  }

  // Get bank data
  getBank(bankIndex) {
    if (bankIndex < 0 || bankIndex >= 8) return null;
    return this.banks[bankIndex];
  }

  // Check if bank is empty
  isBankEmpty(bankIndex) {
    if (bankIndex < 0 || bankIndex >= 8) return true;
    return this.banks[bankIndex] === null;
  }

  // Get bank name
  getBankName(bankIndex) {
    const bank = this.getBank(bankIndex);
    return bank ? bank.name : `Bank ${bankIndex + 1}`;
  }

  // Rename bank
  renameBank(bankIndex, newName) {
    if (bankIndex < 0 || bankIndex >= 8) return false;
    const bank = this.banks[bankIndex];
    if (!bank) return false;

    bank.name = newName;
    console.log(`💾 Bank ${bankIndex + 1} renamed to "${newName}"`);
    return true;
  }

  // Load all banks from state
  loadBanksFromState(banksArray) {
    if (!Array.isArray(banksArray) || banksArray.length !== 8) {
      console.warn("💾 Invalid banks array, resetting to empty");
      this.banks = new Array(8).fill(null);
      return;
    }

    this.banks = banksArray.map(bank => {
      if (!bank) return null;
      return {
        name: bank.name || "Unnamed",
        streams: bank.streams || [],
        patterns: bank.patterns || {},
        bpm: bank.bpm || 120,
        timelineLength: bank.timelineLength || 16,
        timestamp: bank.timestamp || new Date().toISOString()
      };
    });

    const loadedCount = this.banks.filter(b => b !== null).length;
    console.log(`💾 Loaded ${loadedCount} pattern banks`);
  }

  // Save all banks to state
  saveBanksToState() {
    return this.banks.map(bank => {
      if (!bank) return null;
      return {
        name: bank.name,
        streams: JSON.parse(JSON.stringify(bank.streams)),
        patterns: JSON.parse(JSON.stringify(bank.patterns)),
        bpm: bank.bpm,
        timelineLength: bank.timelineLength,
        timestamp: bank.timestamp
      };
    });
  }
}