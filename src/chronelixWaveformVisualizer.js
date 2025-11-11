// src/chronelixWaveformVisualizer.js
// Unit Circle Waveform Visualization for Data Pipeline Flow
// Generates sine/cosine waveforms from circle mathematics (Euler's formula)
// Visualizes bibibinary data flow through chronelix without pitch detection

import * as THREE from 'three';

console.log("📊 chronelixWaveformVisualizer.js loaded");

/**
 * Waveform Visualizer
 * Generates sine and cosine waveform graphs from unit circle
 * Visualizes data pipeline flow through chronelix using Euler's formula: e^(iθ) = cos(θ) + i·sin(θ)
 */
export class ChronelixWaveformVisualizer {
  constructor() {
    // THREE.js groups
    this.waveformGroup = null;
    this.unitCircleGroup = null;

    // Waveform data buffers
    this.audioWaveform = {
      sine: [],      // Imaginary component (sin)
      cosine: [],    // Real component (cos)
      phase: 0       // Current angle θ
    };

    this.opticalWaveform = {
      sine: [],
      cosine: [],
      phase: 0
    };

    // Debug frame counter
    this.debugFrameCount = 0;

    // Visualization parameters
    this.waveformLength = 200;      // Number of samples to display
    this.samplesPerSecond = 60;     // Sample rate (matches frame rate)
    this.amplitudeScale = 3.0;      // Visual amplitude scaling
    this.opticalSensitivityScale = 0.15;  // Damping factor for optical waveforms (15% sensitivity)

    // Unit circle visualization
    this.circleRadius = 2.0;
    this.showUnitCircle = true;

    // THREE.js meshes
    this.audioSineLine = null;
    this.audioCosineLine = null;
    this.opticalSineLine = null;
    this.opticalCosineLine = null;
    this.unitCircleMesh = null;
    this.audioRadiusLine = null;
    this.opticalRadiusLine = null;

    // Position offset for waveforms
    this.waveformOffset = {
      x: 15,
      y: 0,
      z: 0
    };

    this.circleOffset = {
      x: -15,
      y: 0,
      z: 0
    };
  }

  /**
   * Initialize waveform visualizer
   */
  init(scene) {
    this.waveformGroup = new THREE.Group();
    this.unitCircleGroup = new THREE.Group();

    scene.add(this.waveformGroup);
    scene.add(this.unitCircleGroup);

    // Create unit circle visualization
    if (this.showUnitCircle) {
      this.createUnitCircle();
    }

    // Create waveform lines
    this.createWaveformLines();

    // Initialize data buffers
    for (let i = 0; i < this.waveformLength; i++) {
      this.audioWaveform.sine.push(0);
      this.audioWaveform.cosine.push(0);
      this.opticalWaveform.sine.push(0);
      this.opticalWaveform.cosine.push(0);
    }

    console.log("📊 Waveform visualizer initialized");
  }

  /**
   * Create unit circle visualization
   * Shows e^(iθ) = cos(θ) + i·sin(θ) decomposition
   */
  createUnitCircle() {
    // Circle outline
    const circleGeometry = new THREE.RingGeometry(
      this.circleRadius * 0.98,
      this.circleRadius * 1.02,
      64
    );
    const circleMaterial = new THREE.MeshBasicMaterial({
      color: 0x666666,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3
    });
    this.unitCircleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
    this.unitCircleMesh.rotation.x = Math.PI / 2; // Make horizontal
    this.unitCircleMesh.position.set(
      this.circleOffset.x,
      this.circleOffset.y,
      this.circleOffset.z
    );
    this.unitCircleGroup.add(this.unitCircleMesh);

    // Axes (real and imaginary)
    this.createAxis(
      this.circleOffset.x - this.circleRadius * 1.2,
      this.circleOffset.y,
      this.circleOffset.z,
      this.circleOffset.x + this.circleRadius * 1.2,
      this.circleOffset.y,
      this.circleOffset.z,
      0x00ff00 // Real axis (cosine) - green
    );

    this.createAxis(
      this.circleOffset.x,
      this.circleOffset.y,
      this.circleOffset.z - this.circleRadius * 1.2,
      this.circleOffset.x,
      this.circleOffset.y,
      this.circleOffset.z + this.circleRadius * 1.2,
      0xff0000 // Imaginary axis (sine) - red
    );

    // Radius lines (will be updated each frame)
    const radiusGeometry = new THREE.BufferGeometry();

    // Audio radius (teal)
    const audioRadiusMaterial = new THREE.LineBasicMaterial({
      color: 0x14b8a6,
      linewidth: 2
    });
    this.audioRadiusLine = new THREE.Line(radiusGeometry.clone(), audioRadiusMaterial);
    this.unitCircleGroup.add(this.audioRadiusLine);

    // Optical radius (violet)
    const opticalRadiusMaterial = new THREE.LineBasicMaterial({
      color: 0x7c3aed,
      linewidth: 2
    });
    this.opticalRadiusLine = new THREE.Line(radiusGeometry.clone(), opticalRadiusMaterial);
    this.unitCircleGroup.add(this.opticalRadiusLine);
  }

  /**
   * Create axis line
   */
  createAxis(x1, y1, z1, x2, y2, z2, color) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([x1, y1, z1, x2, y2, z2]);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5
    });

    const line = new THREE.Line(geometry, material);
    this.unitCircleGroup.add(line);
  }

  /**
   * Create waveform lines
   */
  createWaveformLines() {
    // Audio sine (imaginary component)
    const audioSineGeometry = new THREE.BufferGeometry();
    const audioSineMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000, // Red for sine (imaginary)
      linewidth: 2
    });
    this.audioSineLine = new THREE.Line(audioSineGeometry, audioSineMaterial);
    this.waveformGroup.add(this.audioSineLine);

    // Audio cosine (real component)
    const audioCosineGeometry = new THREE.BufferGeometry();
    const audioCosineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00, // Green for cosine (real)
      linewidth: 2
    });
    this.audioCosineLine = new THREE.Line(audioCosineGeometry, audioCosineMaterial);
    this.waveformGroup.add(this.audioCosineLine);

    // Optical sine (imaginary component)
    const opticalSineGeometry = new THREE.BufferGeometry();
    const opticalSineMaterial = new THREE.LineBasicMaterial({
      color: 0xff6666, // Light red for optical sine
      linewidth: 2,
      transparent: true,
      opacity: 0.7
    });
    this.opticalSineLine = new THREE.Line(opticalSineGeometry, opticalSineMaterial);
    this.waveformGroup.add(this.opticalSineLine);

    // Optical cosine (real component)
    const opticalCosineGeometry = new THREE.BufferGeometry();
    const opticalCosineMaterial = new THREE.LineBasicMaterial({
      color: 0x66ff66, // Light green for optical cosine
      linewidth: 2,
      transparent: true,
      opacity: 0.7
    });
    this.opticalCosineLine = new THREE.Line(opticalCosineGeometry, opticalCosineMaterial);
    this.waveformGroup.add(this.opticalCosineLine);
  }

  /**
   * Update waveform from phase space state
   * Uses Euler's formula: e^(iθ) = cos(θ) + i·sin(θ)
   */
  update(deltaTime, phaseSpaceState) {
    if (!phaseSpaceState) return;

    // Increment debug counter
    this.debugFrameCount++;

    // Compute phase rotation from transformation (rate of change)
    const audioTransform = phaseSpaceState.audio.transformation || 0;
    const opticalTransform = phaseSpaceState.optical.transformation || 0;

    // Update phases (θ increases with transformation)
    this.audioWaveform.phase += audioTransform * Math.PI * 0.1;
    this.opticalWaveform.phase += opticalTransform * Math.PI * 0.1;

    // Compute amplitude from MMPA forces
    const audioAmplitude = this.computeAmplitude(phaseSpaceState.audio, 'audio');
    const rawOpticalAmplitude = this.computeAmplitude(phaseSpaceState.optical, 'optical');

    // Apply sensitivity damping to optical waveforms
    const opticalAmplitude = rawOpticalAmplitude * this.opticalSensitivityScale;

    // Generate new samples using Euler's formula
    // e^(iθ) = cos(θ) + i·sin(θ)
    const audioSine = audioAmplitude * Math.sin(this.audioWaveform.phase);
    const audioCosine = audioAmplitude * Math.cos(this.audioWaveform.phase);
    const opticalSine = opticalAmplitude * Math.sin(this.opticalWaveform.phase);
    const opticalCosine = opticalAmplitude * Math.cos(this.opticalWaveform.phase);

    // Add to buffers (shift old samples)
    this.audioWaveform.sine.push(audioSine);
    this.audioWaveform.cosine.push(audioCosine);
    this.opticalWaveform.sine.push(opticalSine);
    this.opticalWaveform.cosine.push(opticalCosine);

    // Maintain buffer length
    if (this.audioWaveform.sine.length > this.waveformLength) {
      this.audioWaveform.sine.shift();
      this.audioWaveform.cosine.shift();
      this.opticalWaveform.sine.shift();
      this.opticalWaveform.cosine.shift();
    }

    // Update visualizations
    this.updateWaveformLines();
    if (this.showUnitCircle) {
      this.updateUnitCircle(audioSine, audioCosine, opticalSine, opticalCosine);
    }
  }

  /**
   * Compute amplitude from MMPA forces
   * NOT pitch detection - just data flow magnitude
   */
  computeAmplitude(mmpaForces, domain = 'unknown') {
    // Combine identity and potential for amplitude
    const identity = mmpaForces.identity || 0;
    const potential = mmpaForces.potential || 0;
    const alignment = mmpaForces.alignment || 0;
    const transformation = mmpaForces.transformation || 0;
    const complexity = mmpaForces.complexity || 0;

    // DEBUG: Log optical values every 60 frames (once per second)
    if (domain === 'optical' && this.debugFrameCount % 60 === 0) {
      console.log('📊 Optical MMPA for waveform:', {
        identity,
        potential,
        alignment,
        transformation,
        complexity
      });
    }

    // Use transformation and complexity which are more likely to vary with camera motion
    // Instead of identity/potential/alignment which might be zero
    const amplitude = (transformation + complexity + alignment) / 3;

    return amplitude;
  }

  /**
   * Update waveform line geometries
   */
  updateWaveformLines() {
    const xSpacing = 0.1; // Horizontal spacing between samples
    const yOffset = 0;    // Vertical center

    // Audio sine waveform
    const audioSinePositions = [];
    for (let i = 0; i < this.audioWaveform.sine.length; i++) {
      const x = this.waveformOffset.x + (i * xSpacing);
      const y = this.waveformOffset.y + yOffset + 5; // Offset upward
      const z = this.waveformOffset.z + this.audioWaveform.sine[i] * this.amplitudeScale;
      audioSinePositions.push(x, y, z);
    }
    this.audioSineLine.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(audioSinePositions, 3)
    );

    // Audio cosine waveform
    const audioCosinePositions = [];
    for (let i = 0; i < this.audioWaveform.cosine.length; i++) {
      const x = this.waveformOffset.x + (i * xSpacing);
      const y = this.waveformOffset.y + yOffset; // Center
      const z = this.waveformOffset.z + this.audioWaveform.cosine[i] * this.amplitudeScale;
      audioCosinePositions.push(x, y, z);
    }
    this.audioCosineLine.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(audioCosinePositions, 3)
    );

    // Optical sine waveform
    const opticalSinePositions = [];
    for (let i = 0; i < this.opticalWaveform.sine.length; i++) {
      const x = this.waveformOffset.x + (i * xSpacing);
      const y = this.waveformOffset.y + yOffset - 5; // Offset downward
      const z = this.waveformOffset.z + this.opticalWaveform.sine[i] * this.amplitudeScale;
      opticalSinePositions.push(x, y, z);
    }
    this.opticalSineLine.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(opticalSinePositions, 3)
    );

    // Optical cosine waveform
    const opticalCosinePositions = [];
    for (let i = 0; i < this.opticalWaveform.cosine.length; i++) {
      const x = this.waveformOffset.x + (i * xSpacing);
      const y = this.waveformOffset.y + yOffset - 10; // Offset further down
      const z = this.waveformOffset.z + this.opticalWaveform.cosine[i] * this.amplitudeScale;
      opticalCosinePositions.push(x, y, z);
    }
    this.opticalCosineLine.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(opticalCosinePositions, 3)
    );
  }

  /**
   * Update unit circle visualization
   * Shows current position on circle: (cos θ, sin θ)
   */
  updateUnitCircle(audioSine, audioCosine, opticalSine, opticalCosine) {
    // Audio radius line (center to point on circle)
    const audioX = this.circleOffset.x + audioCosine * this.circleRadius;
    const audioY = this.circleOffset.y;
    const audioZ = this.circleOffset.z + audioSine * this.circleRadius;

    const audioRadiusPositions = new Float32Array([
      this.circleOffset.x, this.circleOffset.y, this.circleOffset.z,
      audioX, audioY, audioZ
    ]);
    this.audioRadiusLine.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(audioRadiusPositions, 3)
    );

    // Optical radius line
    const opticalX = this.circleOffset.x + opticalCosine * this.circleRadius;
    const opticalY = this.circleOffset.y;
    const opticalZ = this.circleOffset.z + opticalSine * this.circleRadius;

    const opticalRadiusPositions = new Float32Array([
      this.circleOffset.x, this.circleOffset.y, this.circleOffset.z,
      opticalX, opticalY, opticalZ
    ]);
    this.opticalRadiusLine.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(opticalRadiusPositions, 3)
    );
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      audioPhase: (this.audioWaveform.phase % (2 * Math.PI)).toFixed(3),
      opticalPhase: (this.opticalWaveform.phase % (2 * Math.PI)).toFixed(3),
      waveformLength: this.waveformLength,
      showUnitCircle: this.showUnitCircle
    };
  }

  /**
   * Toggle unit circle visibility
   */
  toggleUnitCircle() {
    this.showUnitCircle = !this.showUnitCircle;
    this.unitCircleGroup.visible = this.showUnitCircle;
  }

  /**
   * Clear waveforms
   */
  clear() {
    this.audioWaveform.sine = [];
    this.audioWaveform.cosine = [];
    this.audioWaveform.phase = 0;
    this.opticalWaveform.sine = [];
    this.opticalWaveform.cosine = [];
    this.opticalWaveform.phase = 0;

    // Refill with zeros
    for (let i = 0; i < this.waveformLength; i++) {
      this.audioWaveform.sine.push(0);
      this.audioWaveform.cosine.push(0);
      this.opticalWaveform.sine.push(0);
      this.opticalWaveform.cosine.push(0);
    }
  }

  /**
   * Dispose resources
   */
  dispose() {
    if (this.waveformGroup) {
      this.waveformGroup.parent?.remove(this.waveformGroup);
    }

    if (this.unitCircleGroup) {
      this.unitCircleGroup.parent?.remove(this.unitCircleGroup);
    }

    // Dispose geometries and materials
    [this.audioSineLine, this.audioCosineLine, this.opticalSineLine, this.opticalCosineLine].forEach(line => {
      if (line) {
        line.geometry?.dispose();
        line.material?.dispose();
      }
    });

    if (this.unitCircleMesh) {
      this.unitCircleMesh.geometry?.dispose();
      this.unitCircleMesh.material?.dispose();
    }
  }
}

// Singleton instance
export const waveformVisualizer = new ChronelixWaveformVisualizer();

console.log("📊 Waveform visualizer ready");
