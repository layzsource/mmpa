// src/portalBuilder/geometryBuilder.js
// Geometry Field Builder - Place and configure objects in portals
// Supports morphable shapes, glyphs, procedural fields

import * as THREE from 'three';

console.log("🔺 geometryBuilder.js loaded");

/**
 * Geometry Object Configuration
 */
export class GeometryObject {
  constructor(config = {}) {
    this.id = config.id || `geo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.type = config.type || 'sphere'; // sphere | cube | torus | chestahedron | glyph | custom
    this.position = config.position || [0, 0, 0];
    this.rotation = config.rotation || [0, 0, 0];
    this.scale = config.scale || [1, 1, 1];

    // Morph weights (for morphable shapes)
    this.morphWeights = config.morphWeights || {};

    // Material properties
    this.material = config.material || {
      color: '#FFFFFF',
      emissive: '#000000',
      emissiveIntensity: 0,
      metalness: 0.5,
      roughness: 0.5,
      wireframe: false,
      transparent: false,
      opacity: 1.0
    };

    // Audio reactivity
    this.audioReactive = config.audioReactive || false;
    this.audioMapping = config.audioMapping || {
      frequency: 'bass', // bass | mid | treble | all
      parameter: 'scale', // scale | rotation | emissive | morphWeight
      intensity: 1.0,
      smoothing: 0.8
    };

    // Motion
    this.motion = config.motion || {
      spin: [0, 0, 0], // Rotation speed per axis
      orbit: null, // { center, radius, speed, axis }
      float: null  // { amplitude, frequency }
    };

    // Perception-based visibility
    this.perceptionMode = config.perceptionMode || null; // null | 'wave' | 'particle'

    // Glyph-specific data
    this.glyphData = config.glyphData || null;

    // Custom geometry source
    this.customSource = config.customSource || null; // Path to OBJ/GLTF file
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      position: this.position,
      rotation: this.rotation,
      scale: this.scale,
      morphWeights: this.morphWeights,
      material: this.material,
      audioReactive: this.audioReactive,
      audioMapping: this.audioMapping,
      motion: this.motion,
      perceptionMode: this.perceptionMode,
      glyphData: this.glyphData,
      customSource: this.customSource
    };
  }

  static fromJSON(json) {
    return new GeometryObject(json);
  }
}

/**
 * Geometry Field Builder
 */
export class GeometryFieldBuilder {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    // Active geometry objects
    this.objects = new Map(); // id -> { config, mesh }

    // Glyph renderer (if available)
    this.glyphRenderer = null;

    console.log("🔺 GeometryFieldBuilder initialized");
  }

  /**
   * Set glyph renderer
   */
  setGlyphRenderer(renderer) {
    this.glyphRenderer = renderer;
  }

  /**
   * Add geometry object to the field
   */
  addObject(config) {
    const geoConfig = config instanceof GeometryObject ? config : new GeometryObject(config);

    try {
      const mesh = this.createMesh(geoConfig);

      if (mesh) {
        mesh.userData.portalGeometry = true;
        mesh.userData.geometryId = geoConfig.id;
        mesh.userData.config = geoConfig;

        this.scene.add(mesh);
        this.objects.set(geoConfig.id, { config: geoConfig, mesh });

        console.log(`🔺 Geometry object added: ${geoConfig.type} (${geoConfig.id})`);
        return { ok: true, id: geoConfig.id, mesh };
      }
    } catch (err) {
      console.error(`🔺 Failed to add geometry object:`, err);
      return { ok: false, error: err.message };
    }
  }

  /**
   * Create Three.js mesh from geometry configuration
   */
  createMesh(config) {
    let geometry;

    // Create geometry based on type
    switch (config.type) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(1, 32, 32);
        break;

      case 'cube':
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;

      case 'torus':
        geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
        break;

      case 'chestahedron':
        geometry = this.createChestahedronGeometry();
        break;

      case 'glyph':
        return this.createGlyphMesh(config);

      case 'custom':
        // Custom geometry loading would happen here
        console.warn('🔺 Custom geometry loading not yet implemented');
        geometry = new THREE.SphereGeometry(1, 32, 32);
        break;

      default:
        geometry = new THREE.SphereGeometry(1, 32, 32);
    }

    // Create material
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.material.color),
      emissive: new THREE.Color(config.material.emissive),
      emissiveIntensity: config.material.emissiveIntensity,
      metalness: config.material.metalness,
      roughness: config.material.roughness,
      wireframe: config.material.wireframe,
      transparent: config.material.transparent,
      opacity: config.material.opacity
    });

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);

    // Set position, rotation, scale
    mesh.position.set(...config.position);
    mesh.rotation.set(...config.rotation);
    mesh.scale.set(...config.scale);

    return mesh;
  }

  /**
   * Create Chestahedron geometry
   */
  createChestahedronGeometry() {
    // Chestahedron vertices (seven-sided polyhedron)
    const vertices = new Float32Array([
      // Top apex
      0, 1, 0,
      // Upper ring (3 vertices)
      0.943, 0.333, 0,
      -0.471, 0.333, 0.816,
      -0.471, 0.333, -0.816,
      // Lower ring (3 vertices)
      0.471, -0.333, 0.816,
      0.471, -0.333, -0.816,
      -0.943, -0.333, 0,
      // Bottom apex
      0, -1, 0
    ]);

    const indices = new Uint16Array([
      // Top faces
      0, 1, 2,
      0, 2, 3,
      0, 3, 1,
      // Middle faces
      1, 4, 2,
      2, 6, 3,
      3, 5, 1,
      // Bottom faces
      7, 4, 6,
      7, 6, 5,
      7, 5, 4,
      // Connecting faces
      1, 5, 4,
      2, 4, 6,
      3, 6, 5
    ]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    return geometry;
  }

  /**
   * Create glyph mesh
   */
  createGlyphMesh(config) {
    if (!this.glyphRenderer || !config.glyphData) {
      console.warn('🔺 Glyph renderer not available or glyph data missing');
      return null;
    }

    // Use glyph renderer to create glyph
    const glyph = this.glyphRenderer.createGlyph(config.glyphData);

    if (glyph) {
      glyph.position.set(...config.position);
      glyph.rotation.set(...config.rotation);
      glyph.scale.set(...config.scale);
    }

    return glyph;
  }

  /**
   * Update geometry object
   */
  updateObject(id, changes) {
    const obj = this.objects.get(id);
    if (!obj) {
      console.warn(`🔺 Geometry object not found: ${id}`);
      return { ok: false, error: 'Object not found' };
    }

    // Update configuration
    Object.assign(obj.config, changes);

    // Update mesh
    if (changes.position) {
      obj.mesh.position.set(...changes.position);
    }
    if (changes.rotation) {
      obj.mesh.rotation.set(...changes.rotation);
    }
    if (changes.scale) {
      obj.mesh.scale.set(...changes.scale);
    }
    if (changes.material) {
      Object.assign(obj.config.material, changes.material);

      if (changes.material.color) {
        obj.mesh.material.color.set(changes.material.color);
      }
      if (changes.material.emissive) {
        obj.mesh.material.emissive.set(changes.material.emissive);
      }
      if (changes.material.emissiveIntensity !== undefined) {
        obj.mesh.material.emissiveIntensity = changes.material.emissiveIntensity;
      }
      if (changes.material.wireframe !== undefined) {
        obj.mesh.material.wireframe = changes.material.wireframe;
      }
      if (changes.material.opacity !== undefined) {
        obj.mesh.material.opacity = changes.material.opacity;
      }
    }

    console.log(`🔺 Geometry object updated: ${id}`);
    return { ok: true };
  }

  /**
   * Remove geometry object
   */
  removeObject(id) {
    const obj = this.objects.get(id);
    if (!obj) {
      console.warn(`🔺 Geometry object not found: ${id}`);
      return { ok: false, error: 'Object not found' };
    }

    this.scene.remove(obj.mesh);

    // Dispose geometry and material
    if (obj.mesh.geometry) {
      obj.mesh.geometry.dispose();
    }
    if (obj.mesh.material) {
      obj.mesh.material.dispose();
    }

    this.objects.delete(id);

    console.log(`🔺 Geometry object removed: ${id}`);
    return { ok: true };
  }

  /**
   * Clear all geometry objects
   */
  clearAll() {
    this.objects.forEach((obj, id) => {
      this.removeObject(id);
    });

    console.log('🔺 All geometry objects cleared');
  }

  /**
   * Get all geometry objects
   */
  getAllObjects() {
    return Array.from(this.objects.values()).map(obj => obj.config);
  }

  /**
   * Load geometry field from configuration array
   */
  loadField(geometryConfigs = []) {
    this.clearAll();

    geometryConfigs.forEach(config => {
      this.addObject(config);
    });

    console.log(`🔺 Geometry field loaded (${geometryConfigs.length} objects)`);
    return { ok: true, count: geometryConfigs.length };
  }

  /**
   * Update animation (called each frame)
   */
  update(deltaTime, audioData = {}) {
    this.objects.forEach(obj => {
      const { config, mesh } = obj;

      // Apply motion: spin
      if (config.motion.spin) {
        mesh.rotation.x += config.motion.spin[0] * deltaTime;
        mesh.rotation.y += config.motion.spin[1] * deltaTime;
        mesh.rotation.z += config.motion.spin[2] * deltaTime;
      }

      // Apply motion: orbit
      if (config.motion.orbit) {
        const orbit = config.motion.orbit;
        const angle = orbit.speed * Date.now() / 1000;
        const center = new THREE.Vector3(...(orbit.center || [0, 0, 0]));

        mesh.position.x = center.x + Math.cos(angle) * orbit.radius;
        mesh.position.y = center.y;
        mesh.position.z = center.z + Math.sin(angle) * orbit.radius;
      }

      // Apply motion: float
      if (config.motion.float) {
        const float = config.motion.float;
        const offset = Math.sin(Date.now() / 1000 * float.frequency) * float.amplitude;
        mesh.position.y = config.position[1] + offset;
      }

      // Apply audio reactivity
      if (config.audioReactive && audioData) {
        this.applyAudioReactivity(mesh, config, audioData);
      }

      // Apply perception-based visibility
      if (config.perceptionMode) {
        const currentMode = window.perceptionState?.mode || 'wave';
        mesh.visible = !config.perceptionMode || config.perceptionMode === currentMode;
      }
    });
  }

  /**
   * Apply audio reactivity to mesh
   */
  applyAudioReactivity(mesh, config, audioData) {
    const mapping = config.audioMapping;
    let value = 0;

    // Get audio value based on frequency band
    switch (mapping.frequency) {
      case 'bass':
        value = audioData.bass || 0;
        break;
      case 'mid':
        value = audioData.mid || 0;
        break;
      case 'treble':
        value = audioData.treble || 0;
        break;
      case 'all':
        value = (audioData.bass + audioData.mid + audioData.treble) / 3 || 0;
        break;
    }

    // Apply smoothing
    if (mesh.userData.lastAudioValue === undefined) {
      mesh.userData.lastAudioValue = value;
    }

    const smoothed = mesh.userData.lastAudioValue * mapping.smoothing +
                     value * (1 - mapping.smoothing);
    mesh.userData.lastAudioValue = smoothed;

    // Apply to parameter
    const intensity = smoothed * mapping.intensity;

    switch (mapping.parameter) {
      case 'scale':
        const baseScale = config.scale[0];
        mesh.scale.setScalar(baseScale + intensity);
        break;

      case 'rotation':
        mesh.rotation.y += intensity * 0.1;
        break;

      case 'emissive':
        mesh.material.emissiveIntensity = config.material.emissiveIntensity + intensity;
        break;

      case 'morphWeight':
        // Morph weights would be applied here if geometry supports it
        break;
    }
  }

  /**
   * Create procedural field (lattice, fractal, etc.)
   */
  createProceduralField(config = {}) {
    const {
      type = 'lattice', // lattice | fractal | wave
      size = 10,
      spacing = 2,
      shape = 'sphere'
    } = config;

    const objects = [];

    switch (type) {
      case 'lattice':
        // Create 3D grid of objects
        for (let x = -size / 2; x < size / 2; x += spacing) {
          for (let y = -size / 2; y < size / 2; y += spacing) {
            for (let z = -size / 2; z < size / 2; z += spacing) {
              const obj = this.addObject({
                type: shape,
                position: [x, y, z],
                scale: [0.2, 0.2, 0.2],
                material: {
                  color: '#00FFFF',
                  emissive: '#00FFFF',
                  emissiveIntensity: 0.5,
                  wireframe: true
                }
              });

              if (obj.ok) {
                objects.push(obj.id);
              }
            }
          }
        }
        break;

      case 'fractal':
        // Sierpinski tetrahedron or similar
        this.createFractalStructure([0, 0, 0], size, 3, shape, objects);
        break;

      case 'wave':
        // Sine wave pattern
        for (let x = -size / 2; x < size / 2; x += spacing) {
          for (let z = -size / 2; z < size / 2; z += spacing) {
            const y = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 2;

            const obj = this.addObject({
              type: shape,
              position: [x, y, z],
              scale: [0.3, 0.3, 0.3],
              material: {
                color: '#FF00FF',
                wireframe: false
              }
            });

            if (obj.ok) {
              objects.push(obj.id);
            }
          }
        }
        break;
    }

    console.log(`🔺 Procedural field created: ${type} (${objects.length} objects)`);
    return { ok: true, count: objects.length, objects };
  }

  /**
   * Create fractal structure recursively
   */
  createFractalStructure(center, size, depth, shape, objects) {
    if (depth === 0) {
      const obj = this.addObject({
        type: shape,
        position: center,
        scale: [size * 0.1, size * 0.1, size * 0.1],
        material: {
          color: '#FFFF00',
          emissive: '#FFFF00',
          emissiveIntensity: 0.3
        }
      });

      if (obj.ok) {
        objects.push(obj.id);
      }
      return;
    }

    const offset = size / 4;
    const offsets = [
      [offset, 0, offset],
      [-offset, 0, offset],
      [offset, 0, -offset],
      [-offset, 0, -offset],
      [0, offset, 0]
    ];

    offsets.forEach(off => {
      const newCenter = [
        center[0] + off[0],
        center[1] + off[1],
        center[2] + off[2]
      ];

      this.createFractalStructure(newCenter, size / 2, depth - 1, shape, objects);
    });
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      totalObjects: this.objects.size,
      types: this.getAllObjects().reduce((acc, obj) => {
        acc[obj.type] = (acc[obj.type] || 0) + 1;
        return acc;
      }, {}),
      audioReactiveCount: this.getAllObjects().filter(obj => obj.audioReactive).length
    };
  }
}

console.log("🔺 Geometry Field Builder ready");
