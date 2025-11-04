import * as THREE from 'three';
import { state } from './state.js';

console.log("🌫️ voxelMist.js loaded");

// Volumetric mist system for voxel wave environment
// Supports two rendering modes:
// - 'particles': 3D particle field with shader-based FBM displacement
// - 'planes': Multiple stacked horizontal planes for layered effect

// Particle system variables
let mistPoints = null;
let mistParticleGeometry = null;
let mistParticleMaterial = null;

// Plane system variables
let mistGroup = null;
let mistPlanes = [];
let mistPlaneGeometry = null;
let mistPlaneMaterial = null;

// Current render mode
let currentRenderMode = 'particles';

// Particle shader for point-based rendering
const PARTICLE_MIST_SHADER = {
  vertexShader: `
    uniform float uTime;
    uniform float uSpeed;
    attribute float aRandom;
    attribute float aScale;
    varying float vAlpha;
    varying vec2 vUv;

    // Hash function for noise
    float hash31(vec3 p) {
      p = fract(p * 0.1031);
      p += dot(p, p.yzx + 33.33);
      return fract((p.x + p.y) * p.z);
    }

    // 3D Value Noise
    float valueNoise3(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      vec3 u = f * f * (3.0 - 2.0 * f);

      float n000 = hash31(i + vec3(0.0));
      float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
      float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
      float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
      float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
      float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
      float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
      float n111 = hash31(i + vec3(1.0));

      return mix(
        mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
        mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y),
        u.z
      );
    }

    void main() {
      // Animate position with noise-based drift
      vec3 pos = position;
      vec3 q = pos * 0.3 + vec3(0.0, uTime * 0.1 * uSpeed, aRandom * 10.0);

      // Apply 3D noise displacement for organic movement
      float noise = valueNoise3(q);
      pos.x += sin(uTime * 0.2 + aRandom * 6.28) * 0.5;
      pos.z += cos(uTime * 0.15 + aRandom * 6.28) * 0.5;
      pos.y += uTime * 0.05 * uSpeed;

      // Wrap Y position for continuous vertical cycling
      pos.y = mod(pos.y + 60.0, 120.0) - 60.0;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Size with distance attenuation and scale variation
      gl_PointSize = (150.0 * aScale) / -mvPosition.z;

      // Height-based alpha falloff - gentle falloff from ground to sky
      // More visible near ground (y=-60), gradually fades toward top (y=+60)
      float heightNorm = (pos.y + 60.0) / 120.0; // Normalize to 0..1
      float heightFalloff = clamp(1.0 - smoothstep(0.0, 1.0, heightNorm * 0.8), 0.2, 1.0);
      vAlpha = heightFalloff * (0.4 + noise * 0.3);
    }
  `,
  fragmentShader: `
    uniform float uDensity;
    varying float vAlpha;

    void main() {
      // Circular particle with soft edge
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      float alpha = smoothstep(0.5, 0.1, dist);

      // Soft blue-gray mist color
      vec3 mistColor = vec3(0.53, 0.60, 0.73);

      gl_FragColor = vec4(mistColor, alpha * vAlpha * uDensity * 0.65);
    }
  `
};

// Plane shader for mesh-based layered rendering
const PLANE_MIST_SHADER = {
  vertexShader: `
    uniform float uTime;
    uniform float uSpeed;
    varying vec3 vPosition;
    varying float vAlpha;

    // Hash function for noise
    float hash31(vec3 p) {
      p = fract(p * 0.1031);
      p += dot(p, p.yzx + 33.33);
      return fract((p.x + p.y) * p.z);
    }

    // 3D Value Noise
    float valueNoise3(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      vec3 u = f * f * (3.0 - 2.0 * f);

      float n000 = hash31(i + vec3(0.0));
      float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
      float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
      float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
      float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
      float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
      float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
      float n111 = hash31(i + vec3(1.0));

      return mix(
        mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
        mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y),
        u.z
      );
    }

    void main() {
      vec3 pos = position;
      vec4 worldPos = modelMatrix * vec4(pos, 1.0);

      // Sample noise for this plane
      vec3 q = worldPos.xyz * 0.3 + vec3(0.0, uTime * 0.1 * uSpeed, 0.0);
      float noise = valueNoise3(q);

      // Pass position and alpha to fragment shader
      vPosition = worldPos.xyz;

      // Height-based alpha falloff - gentle falloff across full cubic volume
      // More visible near ground (y=-60), gradually fades toward top (y=+60)
      float heightNorm = (worldPos.y + 60.0) / 120.0; // Normalize to 0..1
      float heightFalloff = clamp(1.0 - smoothstep(0.0, 1.0, heightNorm * 0.8), 0.2, 1.0);
      vAlpha = heightFalloff * (0.4 + noise * 0.3);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uDensity;
    varying vec3 vPosition;
    varying float vAlpha;

    void main() {
      // Soft blue-gray mist color
      vec3 mistColor = vec3(0.53, 0.60, 0.73);

      // Reduce alpha for stacked layers to prevent over-saturation
      gl_FragColor = vec4(mistColor, vAlpha * uDensity * 0.04);
    }
  `
};

/**
 * Initialize particle-based mist system
 */
function initParticleMist(scene) {
  console.log("🌫️ Initializing particle-based volumetric mist...");

  // Create extremely dense particle field distributed throughout 3D cubic volume
  const particleCount = 100000;  // Increased for larger volume
  const positions = new Float32Array(particleCount * 3);
  const randoms = new Float32Array(particleCount);
  const scales = new Float32Array(particleCount);

  // Volume dimensions - full cubic skybox volume
  const width = 200;   // Expanded to fill skybox
  const height = 120;  // Much taller to fill vertical space
  const depth = 200;   // Expanded to fill skybox
  const centerY = 0.0; // Center at origin

  // Distribute particles uniformly in 3D cubic volume
  for (let i = 0; i < particleCount; i++) {
    // Random position in volume - uniform distribution
    positions[i * 3] = (Math.random() - 0.5) * width;      // X

    // Distribute more uniformly in height with slight ground bias
    const yRand = Math.pow(Math.random(), 1.2); // Gentler curve for more vertical fill
    positions[i * 3 + 1] = centerY - (height/2) + yRand * height;  // Y: -60 to +60

    positions[i * 3 + 2] = (Math.random() - 0.5) * depth;  // Z

    // Random values for animation variation
    randoms[i] = Math.random();
    scales[i] = 0.5 + Math.random() * 0.5;  // Size variation
  }

  // Create particle geometry with custom attributes
  mistParticleGeometry = new THREE.BufferGeometry();
  mistParticleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  mistParticleGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
  mistParticleGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

  // Shader material with FBM noise
  mistParticleMaterial = new THREE.ShaderMaterial({
    vertexShader: PARTICLE_MIST_SHADER.vertexShader,
    fragmentShader: PARTICLE_MIST_SHADER.fragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
      uDensity: { value: 1.0 },
      uSpeed: { value: 1.0 }
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending
  });

  // Create Points object for particle system
  mistPoints = new THREE.Points(mistParticleGeometry, mistParticleMaterial);
  scene.add(mistPoints);
  mistPoints.visible = false; // Hidden by default

  console.log(`✅ Particle-based volumetric mist initialized with ${particleCount} particles (FBM noise)`);
}

/**
 * Initialize plane-based mist system
 */
function initPlaneMist(scene) {
  console.log("🌫️ Initializing plane-based volumetric mist...");

  mistGroup = new THREE.Group();

  // Create large plane geometry covering the environment
  mistPlaneGeometry = new THREE.PlaneGeometry(200, 200, 1, 1);

  // Shader material with FBM noise
  mistPlaneMaterial = new THREE.ShaderMaterial({
    vertexShader: PLANE_MIST_SHADER.vertexShader,
    fragmentShader: PLANE_MIST_SHADER.fragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
      uDensity: { value: 1.0 },
      uSpeed: { value: 1.0 }
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending
  });

  // Create many layers for full cubic volumetric effect
  const numHorizontalLayers = 240;  // Horizontal planes (XZ) stacked along Y
  const numVerticalLayers = 240;     // Vertical planes (YZ) distributed along X
  const startHeight = -60.0;
  const maxHeight = 120.0;
  const startX = -100.0;
  const maxX = 200.0;

  // Horizontal planes (XZ orientation, stacked vertically)
  for (let i = 0; i < numHorizontalLayers; i++) {
    const material = mistPlaneMaterial.clone();
    const mesh = new THREE.Mesh(mistPlaneGeometry, material);

    // Rotate to be horizontal
    mesh.rotation.x = -Math.PI / 2;

    // Densely pack layers for continuous volumetric appearance
    const height = startHeight + (i / (numHorizontalLayers - 1)) * maxHeight;
    mesh.position.y = height;

    // Varied rotation for organic look (prevents obvious stacking)
    mesh.rotation.z = (i / numHorizontalLayers) * Math.PI * 2.0 + Math.sin(i * 0.5) * 0.3;

    // Slight scale variation to break up uniformity
    const scaleVar = 1.0 + Math.sin(i * 0.7) * 0.1;
    mesh.scale.set(scaleVar, scaleVar, 1);

    mistGroup.add(mesh);
    mistPlanes.push({ mesh, material });
  }

  // Vertical planes (YZ orientation, distributed along X axis)
  for (let i = 0; i < numVerticalLayers; i++) {
    const material = mistPlaneMaterial.clone();
    const mesh = new THREE.Mesh(mistPlaneGeometry, material);

    // Keep default rotation for vertical orientation (YZ plane)
    mesh.rotation.y = Math.PI / 2;

    // Distribute along X axis
    const xPos = startX + (i / (numVerticalLayers - 1)) * maxX;
    mesh.position.x = xPos;

    // Varied rotation for organic look
    mesh.rotation.x = (i / numVerticalLayers) * Math.PI * 2.0 + Math.sin(i * 0.5) * 0.3;

    // Slight scale variation
    const scaleVar = 1.0 + Math.sin(i * 0.7 + 1.0) * 0.1;
    mesh.scale.set(scaleVar, scaleVar, 1);

    mistGroup.add(mesh);
    mistPlanes.push({ mesh, material });
  }

  scene.add(mistGroup);
  mistGroup.visible = false; // Hidden by default

  const totalPlanes = numHorizontalLayers + numVerticalLayers;
  console.log(`✅ Plane-based volumetric mist initialized with ${totalPlanes} planes (${numHorizontalLayers} horizontal + ${numVerticalLayers} vertical, FBM noise)`);
}

/**
 * Main initialization function - creates mist based on current render mode
 */
export function initVoxelMist(scene) {
  const renderMode = state.voxelWave?.mistRenderMode || 'particles';
  currentRenderMode = renderMode;

  if (renderMode === 'particles') {
    initParticleMist(scene);
  } else if (renderMode === 'planes') {
    initPlaneMist(scene);
  } else if (renderMode === 'both') {
    initParticleMist(scene);
    initPlaneMist(scene);
  }
}

/**
 * Update mist system based on current render mode
 */
export function updateVoxelMist(time, camera) {
  const enabled = state.voxelWave?.mistEnabled;
  const density = state.voxelWave?.mistDensity || 1.0;
  const speed = state.voxelWave?.mistSpeed || 1.0;

  // Update particle-based mist
  if (mistPoints) {
    mistPoints.visible = enabled && (currentRenderMode === 'particles' || currentRenderMode === 'both');

    if (mistPoints.visible && mistParticleMaterial) {
      mistParticleMaterial.uniforms.uTime.value = time;
      mistParticleMaterial.uniforms.uDensity.value = density;
      mistParticleMaterial.uniforms.uSpeed.value = speed;
    }
  }

  // Update plane-based mist
  if (mistGroup) {
    mistGroup.visible = enabled && (currentRenderMode === 'planes' || currentRenderMode === 'both');

    if (mistGroup.visible) {
      mistPlanes.forEach((plane, index) => {
        const { material } = plane;

        // Slightly offset time for each layer for more organic movement
        const timeOffset = index * 0.5;
        material.uniforms.uTime.value = time + timeOffset;
        material.uniforms.uDensity.value = density;
        material.uniforms.uSpeed.value = speed;
      });
    }
  }
}

/**
 * Get active mist object(s) for external access
 */
export function getVoxelMistGroup() {
  if (currentRenderMode === 'particles') {
    return mistPoints;
  } else if (currentRenderMode === 'planes') {
    return mistGroup;
  } else if (currentRenderMode === 'both') {
    // Return both objects in an array
    return [mistPoints, mistGroup].filter(obj => obj !== null);
  }
  return null;
}

/**
 * Dispose of mist resources
 */
export function disposeVoxelMist() {
  // Dispose particle system
  if (mistPoints) {
    if (mistParticleGeometry) mistParticleGeometry.dispose();
    if (mistParticleMaterial) mistParticleMaterial.dispose();
    mistPoints.parent?.remove(mistPoints);
    mistPoints = null;
    mistParticleGeometry = null;
    mistParticleMaterial = null;
  }

  // Dispose plane system
  if (mistGroup) {
    mistPlanes.forEach(({ mesh, material }) => {
      if (mesh.geometry) mesh.geometry.dispose();
      if (material) material.dispose();
    });
    mistGroup.parent?.remove(mistGroup);
    mistPlanes = [];
    mistGroup = null;
    mistPlaneGeometry = null;
    mistPlaneMaterial = null;
  }
}

/**
 * Switch between rendering modes dynamically
 * @param {string} newMode - 'particles', 'planes', or 'both'
 * @param {THREE.Scene} scene - Scene object for re-initialization
 */
export function switchMistRenderMode(newMode, scene) {
  if (newMode === currentRenderMode) return;

  console.log(`🌫️ Switching mist render mode: ${currentRenderMode} → ${newMode}`);

  // Update state
  state.voxelWave.mistRenderMode = newMode;
  currentRenderMode = newMode;

  // Handle different mode transitions
  if (newMode === 'both') {
    // Initialize any missing systems without disposing existing ones
    if (!mistPoints) {
      initParticleMist(scene);
    }
    if (!mistGroup) {
      initPlaneMist(scene);
    }
  } else if (newMode === 'particles') {
    // Dispose planes, keep or init particles
    if (mistGroup) {
      mistPlanes.forEach(({ mesh, material }) => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (material) material.dispose();
      });
      mistGroup.parent?.remove(mistGroup);
      mistPlanes = [];
      mistGroup = null;
      mistPlaneGeometry = null;
      mistPlaneMaterial = null;
    }
    if (!mistPoints) {
      initParticleMist(scene);
    }
  } else if (newMode === 'planes') {
    // Dispose particles, keep or init planes
    if (mistPoints) {
      if (mistParticleGeometry) mistParticleGeometry.dispose();
      if (mistParticleMaterial) mistParticleMaterial.dispose();
      mistPoints.parent?.remove(mistPoints);
      mistPoints = null;
      mistParticleGeometry = null;
      mistParticleMaterial = null;
    }
    if (!mistGroup) {
      initPlaneMist(scene);
    }
  }
}

console.log("🌫️ Voxel mist module ready");
