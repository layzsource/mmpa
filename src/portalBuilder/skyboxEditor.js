// src/portalBuilder/skyboxEditor.js
// Skybox Editor - Environment authoring for portals
// Supports image, procedural, video, and layered skyboxes

import * as THREE from 'three';

console.log("🌌 skyboxEditor.js loaded");

/**
 * Skybox Editor
 * Creates and manages skybox configurations for portals
 */
export class SkyboxEditor {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    // Current skybox mesh
    this.currentSkybox = null;
    this.skyboxLayers = []; // For layered skyboxes

    // Procedural skybox settings
    this.proceduralSettings = {
      starDensity: 1000,
      nebulaIntensity: 0.5,
      cosmicNoiseScale: 1.0,
      colors: ['#000033', '#1a0033', '#330033']
    };

    console.log("🌌 SkyboxEditor initialized");
  }

  /**
   * Create skybox from image (equirectangular or cubemap)
   */
  async createImageSkybox(config = {}) {
    const {
      source,
      type = 'equirectangular', // 'equirectangular' | 'cubemap'
      rotation = 0,
      scale = 1,
      brightness = 1,
      hueShift = 0
    } = config;

    try {
      let texture;

      if (type === 'equirectangular') {
        texture = await this.loadEquirectangularTexture(source);
      } else if (type === 'cubemap') {
        texture = await this.loadCubemapTexture(source);
      }

      // Apply transformations
      texture.rotation = rotation;

      // Create shader material for brightness and hue shift
      const skyboxMaterial = new THREE.ShaderMaterial({
        uniforms: {
          tCube: { value: texture },
          brightness: { value: brightness },
          hueShift: { value: hueShift }
        },
        vertexShader: `
          varying vec3 vWorldDirection;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldDirection = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform samplerCube tCube;
          uniform float brightness;
          uniform float hueShift;
          varying vec3 vWorldDirection;

          vec3 hueShiftRGB(vec3 color, float shift) {
            const vec3 k = vec3(0.57735, 0.57735, 0.57735);
            float cosAngle = cos(shift);
            return color * cosAngle + cross(k, color) * sin(shift) + k * dot(k, color) * (1.0 - cosAngle);
          }

          void main() {
            vec3 color = textureCube(tCube, vWorldDirection).rgb;
            color *= brightness;
            if (abs(hueShift) > 0.01) {
              color = hueShiftRGB(color, hueShift);
            }
            gl_FragColor = vec4(color, 1.0);
          }
        `,
        side: THREE.BackSide,
        depthWrite: false
      });

      // Create skybox mesh
      const geometry = new THREE.SphereGeometry(500, 60, 40);
      const skybox = new THREE.Mesh(geometry, skyboxMaterial);
      skybox.userData.portalSkybox = true;

      this.applySkybox(skybox);

      console.log('🌌 Image skybox created:', source);
      return { ok: true, skybox };
    } catch (err) {
      console.error('🌌 Failed to create image skybox:', err);
      return { ok: false, error: err.message };
    }
  }

  /**
   * Load equirectangular texture
   */
  async loadEquirectangularTexture(source) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        source,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          texture.colorSpace = THREE.SRGBColorSpace;
          resolve(texture);
        },
        undefined,
        (err) => reject(err)
      );
    });
  }

  /**
   * Load cubemap texture
   */
  async loadCubemapTexture(sources) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.CubeTextureLoader();
      loader.load(
        sources, // Array of 6 images [px, nx, py, ny, pz, nz]
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          resolve(texture);
        },
        undefined,
        (err) => reject(err)
      );
    });
  }

  /**
   * Create procedural skybox
   */
  createProceduralSkybox(config = {}) {
    const {
      starDensity = 1000,
      nebulaIntensity = 0.5,
      cosmicNoiseScale = 1.0,
      colors = ['#000033', '#1a0033', '#330033']
    } = config;

    // Create shader material for procedural skybox
    const skyboxMaterial = new THREE.ShaderMaterial({
      uniforms: {
        starDensity: { value: starDensity },
        nebulaIntensity: { value: nebulaIntensity },
        cosmicNoiseScale: { value: cosmicNoiseScale },
        color1: { value: new THREE.Color(colors[0]) },
        color2: { value: new THREE.Color(colors[1]) },
        color3: { value: new THREE.Color(colors[2]) },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vWorldDirection;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldDirection = normalize(worldPosition.xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float starDensity;
        uniform float nebulaIntensity;
        uniform float cosmicNoiseScale;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform float time;
        varying vec3 vWorldDirection;

        // Simple noise function
        float hash(vec3 p) {
          p = fract(p * 0.3183099 + 0.1);
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);

          return mix(
            mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
            f.z
          );
        }

        void main() {
          vec3 dir = normalize(vWorldDirection);

          // Gradient background
          float gradient = (dir.y + 1.0) * 0.5;
          vec3 bgColor = mix(color1, color2, gradient);
          bgColor = mix(bgColor, color3, pow(gradient, 2.0));

          // Nebula clouds
          float nebula = noise(dir * cosmicNoiseScale * 2.0);
          nebula += 0.5 * noise(dir * cosmicNoiseScale * 4.0);
          nebula += 0.25 * noise(dir * cosmicNoiseScale * 8.0);
          nebula *= nebulaIntensity;

          vec3 nebulaColor = mix(color2, color3, nebula);
          bgColor = mix(bgColor, nebulaColor, nebula * 0.5);

          // Stars
          float starField = hash(floor(dir * starDensity));
          if (starField > 0.998) {
            float starBrightness = smoothstep(0.998, 1.0, starField);
            bgColor += vec3(starBrightness);
          }

          gl_FragColor = vec4(bgColor, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false
    });

    // Create skybox mesh
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    const skybox = new THREE.Mesh(geometry, skyboxMaterial);
    skybox.userData.portalSkybox = true;
    skybox.userData.procedural = true;

    this.applySkybox(skybox);

    console.log('🌌 Procedural skybox created');
    return { ok: true, skybox };
  }

  /**
   * Create video skybox
   */
  async createVideoSkybox(config = {}) {
    const { source, loop = true, muted = true } = config;

    try {
      // Create video element
      const video = document.createElement('video');
      video.src = source;
      video.loop = loop;
      video.muted = muted;
      video.crossOrigin = 'anonymous';

      // Wait for video to load
      await new Promise((resolve, reject) => {
        video.addEventListener('loadeddata', resolve);
        video.addEventListener('error', reject);
      });

      // Create video texture
      const texture = new THREE.VideoTexture(video);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;

      // Create skybox material
      const skyboxMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
      });

      // Create skybox mesh
      const geometry = new THREE.SphereGeometry(500, 60, 40);
      const skybox = new THREE.Mesh(geometry, skyboxMaterial);
      skybox.userData.portalSkybox = true;
      skybox.userData.video = video;

      this.applySkybox(skybox);

      // Start video playback
      video.play();

      console.log('🌌 Video skybox created:', source);
      return { ok: true, skybox, video };
    } catch (err) {
      console.error('🌌 Failed to create video skybox:', err);
      return { ok: false, error: err.message };
    }
  }

  /**
   * Create layered skybox (multiple skyboxes blended)
   */
  async createLayeredSkybox(layers = []) {
    try {
      const skyboxes = [];

      for (const layer of layers) {
        let result;

        if (layer.type === 'image') {
          result = await this.createImageSkybox(layer);
        } else if (layer.type === 'procedural') {
          result = this.createProceduralSkybox(layer);
        } else if (layer.type === 'video') {
          result = await this.createVideoSkybox(layer);
        }

        if (result.ok) {
          // Set opacity for layering
          result.skybox.material.transparent = true;
          result.skybox.material.opacity = layer.opacity || 1.0;
          skyboxes.push(result.skybox);
        }
      }

      // Apply all layers to scene
      this.removeSkybox();
      skyboxes.forEach(skybox => {
        this.scene.add(skybox);
      });

      this.skyboxLayers = skyboxes;

      console.log(`🌌 Layered skybox created (${skyboxes.length} layers)`);
      return { ok: true, layers: skyboxes };
    } catch (err) {
      console.error('🌌 Failed to create layered skybox:', err);
      return { ok: false, error: err.message };
    }
  }

  /**
   * Apply skybox to scene
   */
  applySkybox(skybox) {
    this.removeSkybox();
    this.scene.add(skybox);
    this.currentSkybox = skybox;
  }

  /**
   * Remove current skybox
   */
  removeSkybox() {
    if (this.currentSkybox) {
      this.scene.remove(this.currentSkybox);

      // Dispose geometry and material
      if (this.currentSkybox.geometry) {
        this.currentSkybox.geometry.dispose();
      }
      if (this.currentSkybox.material) {
        if (this.currentSkybox.material.map) {
          this.currentSkybox.material.map.dispose();
        }
        this.currentSkybox.material.dispose();
      }

      // Stop video if present
      if (this.currentSkybox.userData.video) {
        this.currentSkybox.userData.video.pause();
        this.currentSkybox.userData.video = null;
      }

      this.currentSkybox = null;
    }

    // Remove all layers
    this.skyboxLayers.forEach(skybox => {
      this.scene.remove(skybox);
      if (skybox.geometry) skybox.geometry.dispose();
      if (skybox.material) skybox.material.dispose();
    });
    this.skyboxLayers = [];
  }

  /**
   * Update skybox parameters
   */
  updateSkybox(params = {}) {
    if (!this.currentSkybox) return;

    const material = this.currentSkybox.material;

    if (params.brightness !== undefined && material.uniforms?.brightness) {
      material.uniforms.brightness.value = params.brightness;
    }

    if (params.hueShift !== undefined && material.uniforms?.hueShift) {
      material.uniforms.hueShift.value = params.hueShift;
    }

    if (params.rotation !== undefined) {
      this.currentSkybox.rotation.y = params.rotation;
    }

    if (params.scale !== undefined) {
      this.currentSkybox.scale.set(params.scale, params.scale, params.scale);
    }

    // Procedural skybox parameters
    if (this.currentSkybox.userData.procedural) {
      if (params.starDensity !== undefined) {
        material.uniforms.starDensity.value = params.starDensity;
      }
      if (params.nebulaIntensity !== undefined) {
        material.uniforms.nebulaIntensity.value = params.nebulaIntensity;
      }
      if (params.cosmicNoiseScale !== undefined) {
        material.uniforms.cosmicNoiseScale.value = params.cosmicNoiseScale;
      }
    }
  }

  /**
   * Animate procedural skybox
   */
  update(deltaTime) {
    if (this.currentSkybox?.userData.procedural) {
      const material = this.currentSkybox.material;
      if (material.uniforms?.time) {
        material.uniforms.time.value += deltaTime;
      }
    }

    // Animate layered skyboxes
    this.skyboxLayers.forEach(skybox => {
      if (skybox.userData.procedural && skybox.material.uniforms?.time) {
        skybox.material.uniforms.time.value += deltaTime;
      }
    });
  }

  /**
   * Get current skybox configuration
   */
  getCurrentConfig() {
    if (!this.currentSkybox) return null;

    return {
      type: this.currentSkybox.userData.procedural ? 'procedural' : 'image',
      rotation: this.currentSkybox.rotation.y,
      scale: this.currentSkybox.scale.x,
      // Additional properties would be extracted from uniforms
    };
  }
}

console.log("🌌 Skybox Editor ready");
