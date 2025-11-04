// src/portalBuilder/waveformEditor.js
// Waveform Field Editor - Audio-reactive terrain and space-wide effects
// Creates voxel floors, waveform rivers, particle fields

import * as THREE from 'three';

console.log("🌊 waveformEditor.js loaded");

/**
 * Waveform Field Configuration
 */
export class WaveformFieldConfig {
  constructor(config = {}) {
    this.id = config.id || `wave_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = config.name || "Waveform Field";
    this.type = config.type || 'floor'; // floor | river | plasma | mist

    // Grid configuration
    this.gridSize = config.gridSize || 64;
    this.cellSize = config.cellSize || 1.0;

    // Wave parameters
    this.amplitude = config.amplitude || 0.8;
    this.frequency = config.frequency || 1.2;
    this.propagationSpeed = config.propagationSpeed || 1.0;
    this.phaseOffset = config.phaseOffset || 0;

    // Audio binding
    this.audioBand = config.audioBand || 'bass'; // bass | mid | treble | all
    this.audioSensitivity = config.audioSensitivity || 1.0;
    this.smoothing = config.smoothing || 0.8;

    // Visual properties
    this.color = config.color || '#00FFFF';
    this.colorMode = config.colorMode || 'solid'; // solid | gradient | spectrum
    this.gradientColors = config.gradientColors || ['#0000FF', '#00FFFF', '#00FF00'];
    this.opacity = config.opacity || 1.0;
    this.wireframe = config.wireframe || false;

    // Particle field (for plasma/mist types)
    this.particleCount = config.particleCount || 1000;
    this.particleSize = config.particleSize || 0.1;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      gridSize: this.gridSize,
      cellSize: this.cellSize,
      amplitude: this.amplitude,
      frequency: this.frequency,
      propagationSpeed: this.propagationSpeed,
      phaseOffset: this.phaseOffset,
      audioBand: this.audioBand,
      audioSensitivity: this.audioSensitivity,
      smoothing: this.smoothing,
      color: this.color,
      colorMode: this.colorMode,
      gradientColors: this.gradientColors,
      opacity: this.opacity,
      wireframe: this.wireframe,
      particleCount: this.particleCount,
      particleSize: this.particleSize
    };
  }

  static fromJSON(json) {
    return new WaveformFieldConfig(json);
  }
}

/**
 * Waveform Field Editor
 */
export class WaveformFieldEditor {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    // Active waveform fields
    this.fields = new Map(); // id -> { config, mesh/system }

    // Audio data cache
    this.audioData = {
      bass: 0,
      mid: 0,
      treble: 0,
      smoothedBass: 0,
      smoothedMid: 0,
      smoothedTreble: 0
    };

    console.log("🌊 WaveformFieldEditor initialized");
  }

  /**
   * Create waveform field
   */
  createField(config) {
    const fieldConfig = config instanceof WaveformFieldConfig ?
                       config : new WaveformFieldConfig(config);

    try {
      let field;

      switch (fieldConfig.type) {
        case 'floor':
          field = this.createFloorField(fieldConfig);
          break;

        case 'river':
          field = this.createRiverField(fieldConfig);
          break;

        case 'plasma':
          field = this.createPlasmaField(fieldConfig);
          break;

        case 'mist':
          field = this.createMistField(fieldConfig);
          break;

        default:
          field = this.createFloorField(fieldConfig);
      }

      if (field) {
        field.userData.waveformField = true;
        field.userData.fieldId = fieldConfig.id;
        field.userData.config = fieldConfig;

        this.scene.add(field);
        this.fields.set(fieldConfig.id, { config: fieldConfig, mesh: field });

        console.log(`🌊 Waveform field created: ${fieldConfig.type} (${fieldConfig.id})`);
        return { ok: true, id: fieldConfig.id, field };
      }
    } catch (err) {
      console.error(`🌊 Failed to create waveform field:`, err);
      return { ok: false, error: err.message };
    }
  }

  /**
   * Create floor waveform field
   */
  createFloorField(config) {
    const size = config.gridSize;
    const cellSize = config.cellSize;

    // Create plane geometry with subdivision
    const geometry = new THREE.PlaneGeometry(
      size * cellSize,
      size * cellSize,
      size - 1,
      size - 1
    );

    geometry.rotateX(-Math.PI / 2); // Make horizontal

    // Store original positions for wave animation
    const positions = geometry.attributes.position.array;
    geometry.userData.originalPositions = new Float32Array(positions);

    // Create material with custom shader
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        amplitude: { value: config.amplitude },
        frequency: { value: config.frequency },
        audioValue: { value: 0 },
        color1: { value: new THREE.Color(config.gradientColors[0]) },
        color2: { value: new THREE.Color(config.gradientColors[1]) },
        color3: { value: new THREE.Color(config.gradientColors[2]) }
      },
      vertexShader: `
        uniform float time;
        uniform float amplitude;
        uniform float frequency;
        uniform float audioValue;

        varying vec3 vPosition;
        varying float vHeight;

        void main() {
          vPosition = position;

          // Wave calculation
          float wave = sin(position.x * frequency + time) *
                       cos(position.z * frequency + time) *
                       amplitude * (1.0 + audioValue);

          vec3 newPosition = position;
          newPosition.y = wave;

          vHeight = wave;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;

        varying vec3 vPosition;
        varying float vHeight;

        void main() {
          float heightNorm = (vHeight + 1.0) * 0.5; // Normalize to 0-1

          vec3 color;
          if (heightNorm < 0.5) {
            color = mix(color1, color2, heightNorm * 2.0);
          } else {
            color = mix(color2, color3, (heightNorm - 0.5) * 2.0);
          }

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide,
      wireframe: config.wireframe,
      transparent: config.opacity < 1.0,
      opacity: config.opacity
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Position at camera location if available
    if (this.camera) {
      mesh.position.set(
        this.camera.position.x,
        0, // Keep floor at ground level
        this.camera.position.z
      );
      console.log(`🌊 Floor positioned at camera location: (${mesh.position.x.toFixed(1)}, ${mesh.position.y}, ${mesh.position.z.toFixed(1)})`);
    } else {
      mesh.position.y = 0;
    }

    return mesh;
  }

  /**
   * Create river waveform field
   */
  createRiverField(config) {
    // River is a long strip with flowing waves
    const length = config.gridSize * 2;
    const width = config.gridSize / 2;
    const segments = config.gridSize;

    const geometry = new THREE.PlaneGeometry(
      length * config.cellSize,
      width * config.cellSize,
      segments * 2,
      segments
    );

    geometry.rotateX(-Math.PI / 2);
    geometry.userData.originalPositions = new Float32Array(geometry.attributes.position.array);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        amplitude: { value: config.amplitude },
        frequency: { value: config.frequency },
        flowSpeed: { value: config.propagationSpeed },
        audioValue: { value: 0 },
        color: { value: new THREE.Color(config.color) }
      },
      vertexShader: `
        uniform float time;
        uniform float amplitude;
        uniform float frequency;
        uniform float flowSpeed;
        uniform float audioValue;

        varying vec3 vPosition;
        varying float vWave;

        void main() {
          vPosition = position;

          // Flowing wave along X axis
          float wave = sin(position.x * frequency - time * flowSpeed) *
                       cos(position.z * frequency * 0.5) *
                       amplitude * (1.0 + audioValue * 0.5);

          vec3 newPosition = position;
          newPosition.y = wave;

          vWave = wave;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vWave;

        void main() {
          float brightness = (vWave + 1.0) * 0.5 + 0.5;
          gl_FragColor = vec4(color * brightness, 0.7);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
      wireframe: config.wireframe
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Position at camera location if available
    if (this.camera) {
      mesh.position.set(
        this.camera.position.x,
        0.1, // Slightly above ground
        this.camera.position.z
      );
      console.log(`🌊 River positioned at camera location: (${mesh.position.x.toFixed(1)}, ${mesh.position.y}, ${mesh.position.z.toFixed(1)})`);
    } else {
      mesh.position.set(0, 0.1, 0);
    }

    return mesh;
  }

  /**
   * Create plasma waveform field
   */
  createPlasmaField(config) {
    // Volumetric plasma effect using particles
    const particleCount = config.particleCount;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Initialize particles in a volume
    const range = config.gridSize * config.cellSize;

    // Get camera position offset
    let offsetX = 0, offsetZ = 0;
    if (this.camera) {
      offsetX = this.camera.position.x;
      offsetZ = this.camera.position.z;
    }

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * range + offsetX;
      positions[i * 3 + 1] = (Math.random() - 0.5) * range * 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * range + offsetZ;

      const color = new THREE.Color(config.color);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = config.particleSize;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    geometry.userData.originalPositions = new Float32Array(positions);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        amplitude: { value: config.amplitude },
        audioValue: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;

        uniform float time;
        uniform float amplitude;
        uniform float audioValue;

        void main() {
          vColor = color;

          vec3 pos = position;

          // Plasma motion
          pos.y += sin(pos.x * 2.0 + time) * cos(pos.z * 2.0 + time) * amplitude * (1.0 + audioValue);

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + audioValue * 0.5);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;

        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);

          if (dist > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha * 0.6);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);

    if (this.camera) {
      console.log(`🌊 Plasma field positioned at camera location: (${offsetX.toFixed(1)}, center, ${offsetZ.toFixed(1)})`);
    }

    return particles;
  }

  /**
   * Create mist waveform field
   */
  createMistField(config) {
    // Similar to plasma but more subtle, ground-level
    const particleCount = config.particleCount;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const range = config.gridSize * config.cellSize;

    // Get camera position offset
    let offsetX = 0, offsetZ = 0;
    if (this.camera) {
      offsetX = this.camera.position.x;
      offsetZ = this.camera.position.z;
    }

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * range + offsetX;
      positions[i * 3 + 1] = Math.random() * 2; // Low to ground
      positions[i * 3 + 2] = (Math.random() - 0.5) * range + offsetZ;

      const color = new THREE.Color(config.color);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    geometry.userData.originalPositions = new Float32Array(positions);

    const material = new THREE.PointsMaterial({
      size: config.particleSize * 2,
      color: new THREE.Color(config.color),
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const mist = new THREE.Points(geometry, material);

    if (this.camera) {
      console.log(`🌊 Mist field positioned at camera location: (${offsetX.toFixed(1)}, ground-level, ${offsetZ.toFixed(1)})`);
    }

    return mist;
  }

  /**
   * Update audio data
   */
  updateAudioData(audioData) {
    if (audioData.bass !== undefined) this.audioData.bass = audioData.bass;
    if (audioData.mid !== undefined) this.audioData.mid = audioData.mid;
    if (audioData.treble !== undefined) this.audioData.treble = audioData.treble;

    // Apply smoothing
    this.audioData.smoothedBass = this.audioData.smoothedBass * 0.8 + this.audioData.bass * 0.2;
    this.audioData.smoothedMid = this.audioData.smoothedMid * 0.8 + this.audioData.mid * 0.2;
    this.audioData.smoothedTreble = this.audioData.smoothedTreble * 0.8 + this.audioData.treble * 0.2;
  }

  /**
   * Update animation (called each frame)
   */
  update(deltaTime) {
    this.fields.forEach(field => {
      const { config, mesh } = field;

      // Get audio value for this field's band
      let audioValue = 0;
      switch (config.audioBand) {
        case 'bass':
          audioValue = this.audioData.smoothedBass;
          break;
        case 'mid':
          audioValue = this.audioData.smoothedMid;
          break;
        case 'treble':
          audioValue = this.audioData.smoothedTreble;
          break;
        case 'all':
          audioValue = (this.audioData.smoothedBass + this.audioData.smoothedMid + this.audioData.smoothedTreble) / 3;
          break;
      }

      audioValue *= config.audioSensitivity;

      // Update shader uniforms
      if (mesh.material.uniforms) {
        mesh.material.uniforms.time.value += deltaTime * config.propagationSpeed;
        mesh.material.uniforms.audioValue.value = audioValue;
      }
    });
  }

  /**
   * Remove waveform field
   */
  removeField(id) {
    const field = this.fields.get(id);
    if (!field) {
      console.warn(`🌊 Waveform field not found: ${id}`);
      return { ok: false, error: 'Field not found' };
    }

    this.scene.remove(field.mesh);

    // Dispose geometry and material
    if (field.mesh.geometry) {
      field.mesh.geometry.dispose();
    }
    if (field.mesh.material) {
      field.mesh.material.dispose();
    }

    this.fields.delete(id);

    console.log(`🌊 Waveform field removed: ${id}`);
    return { ok: true };
  }

  /**
   * Clear all fields
   */
  clearAll() {
    this.fields.forEach((field, id) => {
      this.removeField(id);
    });

    console.log('🌊 All waveform fields cleared');
  }

  /**
   * Get all fields
   */
  getAllFields() {
    return Array.from(this.fields.values()).map(f => f.config);
  }

  /**
   * Load fields from configuration array
   */
  loadFields(configs = []) {
    this.clearAll();

    configs.forEach(config => {
      this.createField(config);
    });

    console.log(`🌊 Waveform fields loaded (${configs.length} fields)`);
    return { ok: true, count: configs.length };
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      totalFields: this.fields.size,
      types: this.getAllFields().reduce((acc, field) => {
        acc[field.type] = (acc[field.type] || 0) + 1;
        return acc;
      }, {}),
      audioData: this.audioData
    };
  }
}

console.log("🌊 Waveform Field Editor ready");
