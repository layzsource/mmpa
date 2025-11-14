import * as THREE from 'three';
import { state, blendColors, getEffectiveAudio } from './state.js'; // Phase 11.4.3: Import stable audio gate
import { morphMesh } from './geometry.js';
import { SHADOW_LAYER } from './constants.js'; // Phase 2.3.3
import { getDirectionalColors } from './archetypeColors.js'; // Phase 14.0: Palette-based directional colors

console.log("🚢 vessel.js loaded");

let vesselGroup, vesselMaterial;
let shadowBox = null;
let conflat6Clock = new THREE.Clock(); // Phase 13.7.1: Clock for Conflat-6 HDR animation
let conflat6HDRMaterial = null; // Phase 13.7.1: Raymarched Conflat-6 material
let metallicTexture = null; // Phase 13.7.2: Metallic voxel cube texture

// Layout configuration
const layouts = ["lattice", "hoops", "shells"];
const modes = ["gyre", "conflat6", "conflat6cube", "conflat6hdr"]; // Phase 2.x/13.7.1: Vessel modes

// Orbital layout configurations
function createLatticeLayout() {
  // 12-ring spherical lattice (current default)
  return [
    // 4 equatorial rings (XY plane at different angles)
    { axis: [0, 0, 1], angle: 0 },
    { axis: [0, 0, 1], angle: Math.PI / 4 },
    { axis: [0, 0, 1], angle: Math.PI / 2 },
    { axis: [0, 0, 1], angle: (3 * Math.PI) / 4 },
    // 4 tilted rings (XZ and YZ planes at ±45°)
    { axis: [1, 0, 0], angle: Math.PI / 4 },
    { axis: [1, 0, 0], angle: -Math.PI / 4 },
    { axis: [0, 1, 0], angle: Math.PI / 4 },
    { axis: [0, 1, 0], angle: -Math.PI / 4 },
    // 4 polar support rings (±135° on XZ + YZ planes)
    { axis: [1, 0, 0], angle: (3 * Math.PI) / 4 },
    { axis: [1, 0, 0], angle: -(3 * Math.PI) / 4 },
    { axis: [0, 1, 0], angle: (3 * Math.PI) / 4 },
    { axis: [0, 1, 0], angle: -(3 * Math.PI) / 4 },
  ];
}

function createHoopsLayout() {
  // 6 stacked orbital hoops
  const hoops = [];
  for (let i = 0; i < 6; i++) {
    const yOffset = (i - 2.5) * 0.4; // Stack vertically
    hoops.push({
      axis: [0, 0, 1],
      angle: 0,
      position: [0, yOffset, 0],
      scale: 1 - Math.abs(yOffset) * 0.1 // Slight taper
    });
  }
  return hoops;
}

function createShellsLayout() {
  // 3 nested shells at different radii
  const shells = [];
  const radii = [0.8, 1.0, 1.2];
  radii.forEach(radius => {
    // 4 rings per shell
    for (let i = 0; i < 4; i++) {
      shells.push({
        axis: [0, 0, 1],
        angle: (i * Math.PI) / 2,
        radius: radius
      });
    }
  });
  return shells;
}

function createConflat6Layout() {
  // Phase 14.0: Conflat 6 - six color-coded directional rings (N/S/E/W/Up/Down)
  // Colors now derived from active palette for consistent theming
  const dirColors = getDirectionalColors();
  return [
    { dir: [1, 0, 0], label: 'East', color: dirColors[0] },     // East
    { dir: [-1, 0, 0], label: 'West', color: dirColors[1] },    // West
    { dir: [0, 1, 0], label: 'Up', color: dirColors[2] },       // Up
    { dir: [0, -1, 0], label: 'Down', color: dirColors[3] },    // Down
    { dir: [0, 0, 1], label: 'North', color: dirColors[4] },    // North
    { dir: [0, 0, -1], label: 'South', color: dirColors[5] }    // South
  ];
}

function getLayoutConfig(layoutType) {
  switch (layoutType) {
    case 'hoops': return createHoopsLayout();
    case 'shells': return createShellsLayout();
    case 'conflat6': return createConflat6Layout();
    case 'lattice':
    default: return createLatticeLayout();
  }
}

// Phase 2.2.0: ShadowBox class for shadow projection with real-time rendering
class ShadowBox {
  constructor(scene, renderer, camera) {
    const size = 6.0;

    const geo = new THREE.PlaneGeometry(size, size);
    const mat = new THREE.MeshBasicMaterial({
      map: null,
      transparent: true,
      opacity: 0.9
    });

    this.plane = new THREE.Mesh(geo, mat);
    this.plane.position.set(0, -5, 0); // below Vessel
    this.plane.rotation.x = -Math.PI / 2;

    // Hide shadow plane from main view (will be visible only in side panels)
    this.plane.visible = false;

    scene.add(this.plane);
    this.scene = scene;

    // Render target for vessel projection (1024x1024 for clarity)
    this.renderTarget = new THREE.WebGLRenderTarget(1024, 1024);
    this.plane.material.map = this.renderTarget.texture;

    this.renderer = renderer;
    this.camera = camera;

    // Projection camera (top-down orthographic)
    this.shadowCam = new THREE.OrthographicCamera(-3, 3, 3, -3, 0.1, 20);
    this.shadowCam.position.set(0, 5, 0);
    this.shadowCam.lookAt(0, 0, 0);
  }

  render() {
    if (!vesselGroup || !this.renderer) return;

    // Render Vessel only into render target
    const oldTarget = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.clear();
    this.renderer.render(vesselGroup, this.shadowCam);
    this.renderer.setRenderTarget(oldTarget);
  }

  // Control visibility of shadow plane
  setPlaneVisible(visible) {
    if (this.plane) {
      this.plane.visible = visible;
      console.log(`📦 ShadowBox plane visibility: ${visible ? 'ON' : 'OFF'}`);
    }
  }

  dispose() {
    if (this.plane) {
      this.scene.remove(this.plane);
      this.plane.geometry.dispose();
      this.plane.material.dispose();
    }
    if (this.renderTarget) {
      this.renderTarget.dispose();
    }
  }
}

// Phase 13.7.2: Create procedural metallic texture (voxel cube style)
function createMetallicTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Create metallic gradient pattern
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(0.5, '#4a4a6a');
  gradient.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Add subtle noise for metallic texture
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    data[i] += noise;     // R
    data[i + 1] += noise; // G
    data[i + 2] += noise; // B
  }
  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Phase 13.7.1: Conflat-6 HDR Raymarched Shader
const conflat6HDRShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uCameraPosition;
    uniform float uSpectralFlux;
    uniform float uModWheel;
    uniform float uCircleOffset;
    uniform float uExposure;
    uniform float uOpacity;
    uniform sampler2D uTexture;
    uniform bool uUseTexture;

    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    // Smooth minimum for blending SDFs
    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }

    // SDF for torus (aligned along X, Y, or Z axis)
    float sdTorusX(vec3 p, float R, float r) {
      vec2 q = vec2(length(p.yz) - R, p.x);
      return length(q) - r;
    }

    float sdTorusY(vec3 p, float R, float r) {
      vec2 q = vec2(length(p.xz) - R, p.y);
      return length(q) - r;
    }

    float sdTorusZ(vec3 p, float R, float r) {
      vec2 q = vec2(length(p.xy) - R, p.z);
      return length(q) - r;
    }

    // Conflat-6 SDF: 6 tori arranged at cube faces with smooth blending
    float sdfConflat6(vec3 p, float time) {
      // Rotation animation
      float c = cos(time * 0.22);
      float s = sin(time * 0.22);
      vec3 pr = vec3(c*p.x - s*p.z, p.y, s*p.x + c*p.z);

      float R = 1.05;  // Major radius
      float r = 0.22;  // Minor radius (tube thickness)
      float h = 0.85;  // Offset from center
      float k = 0.25;  // Smooth blend factor

      float d = 1e9;
      d = smin(d, sdTorusX(pr - vec3( h, 0.0, 0.0), R, r), k);
      d = smin(d, sdTorusX(pr - vec3(-h, 0.0, 0.0), R, r), k);
      d = smin(d, sdTorusY(pr - vec3(0.0,  h, 0.0), R, r), k);
      d = smin(d, sdTorusY(pr - vec3(0.0, -h, 0.0), R, r), k);
      d = smin(d, sdTorusZ(pr - vec3(0.0, 0.0,  h), R, r), k);
      d = smin(d, sdTorusZ(pr - vec3(0.0, 0.0, -h), R, r), k);

      return d;
    }

    // Normal calculation using gradient
    vec3 calcNormal(vec3 p, float time) {
      float e = 0.002;
      vec3 dx = vec3(e, 0.0, 0.0);
      vec3 dy = vec3(0.0, e, 0.0);
      vec3 dz = vec3(0.0, 0.0, e);
      float nx = sdfConflat6(p + dx, time) - sdfConflat6(p - dx, time);
      float ny = sdfConflat6(p + dy, time) - sdfConflat6(p - dy, time);
      float nz = sdfConflat6(p + dz, time) - sdfConflat6(p - dz, time);
      return normalize(vec3(nx, ny, nz));
    }

    // Raymarch through the scene
    float raymarch(vec3 ro, vec3 rd, float maxDist, float time) {
      float t = 0.0;
      for (int i = 0; i < 80; i++) {
        vec3 p = ro + rd * t;
        float h = sdfConflat6(p, time);
        if (h < 0.001) return t;
        t += h * 0.8; // Slightly conservative step
        if (t > maxDist) break;
      }
      return -1.0;
    }

    // Convert hue to RGB
    vec3 hueToRgb(float h) {
      float r = clamp(abs(h * 6.0 - 3.0) - 1.0, 0.0, 1.0);
      float g = clamp(2.0 - abs(h * 6.0 - 2.0), 0.0, 1.0);
      float b = clamp(2.0 - abs(h * 6.0 - 4.0), 0.0, 1.0);
      return vec3(r, g, b);
    }

    // ACES tonemapping for HDR
    vec3 aces(vec3 x) {
      float a = 2.51;
      float b = 0.03;
      float c = 2.43;
      float d = 0.59;
      float e = 0.14;
      return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
    }

    // Sky color gradient
    vec3 skyColor(vec3 dir) {
      float h = clamp(dir.y * 0.6 + 0.5, 0.0, 1.0);
      return mix(vec3(0.06, 0.07, 0.16), vec3(0.30, 0.38, 0.92), h);
    }

    void main() {
      // Ray setup using camera position as ray origin
      vec3 ro = uCameraPosition;
      vec3 rd = normalize(vWorldPosition - uCameraPosition);

      float time = uTime;
      float maxDist = 10.0;
      float hitT = raymarch(ro, rd, maxDist, time);

      vec3 col = vec3(0.0);
      float alpha = 0.0;

      if (hitT > 0.0) {
        vec3 p = ro + rd * hitT;
        vec3 n = calcNormal(p, time);
        vec3 v = normalize(-rd);
        vec3 L = normalize(vec3(0.35, 0.9, 0.22));  // Sun direction
        vec3 H = normalize(L + v);

        // Lighting terms
        float NoL = max(dot(n, L), 0.0);
        float NoV = max(dot(n, v), 0.0);
        float NoH = max(dot(n, H), 0.0);
        float VoH = max(dot(v, H), 0.0);

        // Spectral aura color (audio-reactive) or texture-based color
        vec3 base;
        if (uUseTexture) {
          // Use texture color with UV mapping based on surface normal
          vec2 texUV = vec2(
            atan(n.z, n.x) / (2.0 * 3.14159265) + 0.5,
            asin(n.y) / 3.14159265 + 0.5
          );
          vec3 texColor = texture2D(uTexture, texUV * 4.0).rgb; // Repeat 4x
          base = texColor;
        } else {
          // Original spectral aura color
          vec3 baseNeutral = vec3(0.95, 1.03, 1.08);
          float auraHue = fract(0.62 + uCircleOffset * 0.03 + time * 0.015 + uSpectralFlux * 0.07);
          vec3 aura = hueToRgb(auraHue) * (0.15 + 0.20 * uSpectralFlux + 0.10 * uModWheel);
          base = baseNeutral + aura;
        }

        // PBR parameters
        float metal = 0.82;
        float rough = 0.28;

        // Cook-Torrance BRDF
        float a = max(0.001, rough * rough);
        float a2 = a * a;
        float d_denom = (NoH * NoH) * (a2 - 1.0) + 1.0;
        float D = a2 / (3.14159265 * d_denom * d_denom);

        float k = (rough + 1.0);
        float k2 = (k * k) / 8.0;
        float Gv = NoV / (NoV * (1.0 - k2) + k2);
        float Gl = NoL / (NoL * (1.0 - k2) + k2);
        float G = Gv * Gl;

        vec3 F0 = mix(vec3(0.04), base, metal);
        vec3 F = F0 + (vec3(1.0) - F0) * pow(1.0 - VoH, 5.0);

        float spec = (D * G) / max(4.0 * NoV * NoL, 1e-4);
        vec3 specCol = F * spec;
        vec3 kd = (vec3(1.0) - F) * (1.0 - metal);
        vec3 diffuse = kd * base / 3.14159265;

        // Sun and sky lighting
        vec3 sunRadiance = vec3(42000.0, 38000.0, 32000.0) * 0.00003;
        vec3 Lo_sun = (diffuse + specCol) * (sunRadiance * NoL);
        vec3 skyAmb = skyColor(n);
        vec3 refl = skyColor(reflect(-v, n));
        vec3 Lo_sky = diffuse * skyAmb * 0.45 + specCol * refl * 0.22;

        vec3 surf = Lo_sun + Lo_sky;

        // Distance fog (reduced for more solid appearance)
        float fog = 1.0 - exp(-hitT * hitT * 0.05);
        vec3 bg = skyColor(rd);
        col = mix(surf, bg, fog * 0.3); // Reduced fog mixing

        // HDR exposure and tonemapping
        col = aces(col * uExposure);

        gl_FragColor = vec4(col, uOpacity);
      } else {
        // Miss - discard the fragment entirely
        discard;
      }
    }
  `
};

export function initVessel(scene, renderer, camera) {
  console.log("🚢 Initializing vessel system...");

  vesselGroup = new THREE.Group();

  const vesselMode = state.vessel.mode || 'gyre';

  // Phase 13.7.1: Handle Conflat-6 HDR mode - raymarched volumetric tori with PBR
  if (vesselMode === 'conflat6hdr') {
    // Phase 13.7.2: Create metallic texture if needed
    if (!metallicTexture) {
      metallicTexture = createMetallicTexture();
    }

    // Create material if it doesn't exist
    if (!conflat6HDRMaterial) {
      conflat6HDRMaterial = new THREE.ShaderMaterial({
        vertexShader: conflat6HDRShader.vertexShader,
        fragmentShader: conflat6HDRShader.fragmentShader,
        uniforms: {
          uTime: { value: 0.0 },
          uCameraPosition: { value: new THREE.Vector3() },
          uSpectralFlux: { value: 0.0 },
          uModWheel: { value: 0.0 },
          uCircleOffset: { value: 0.0 },
          uExposure: { value: 2.0 },
          uOpacity: { value: state.vessel.opacity || 0.7 },
          uTexture: { value: null },
          uUseTexture: { value: false }
        },
        transparent: true,
        depthWrite: true,
        side: THREE.FrontSide
      });
    }

    // Phase 13.7.2: Set texture based on state
    const textureMode = state.vessel.hdrTexture || 'none';
    if (textureMode === 'metallic') {
      conflat6HDRMaterial.uniforms.uTexture.value = metallicTexture;
      conflat6HDRMaterial.uniforms.uUseTexture.value = true;
    } else if (textureMode === 'custom' && state.vessel.customTexture) {
      conflat6HDRMaterial.uniforms.uTexture.value = state.vessel.customTexture;
      conflat6HDRMaterial.uniforms.uUseTexture.value = true;
    } else {
      conflat6HDRMaterial.uniforms.uUseTexture.value = false;
    }

    // Create a sphere mesh to display the raymarched shader
    const sphereGeo = new THREE.SphereGeometry(2.0, 64, 64);
    const sphere = new THREE.Mesh(sphereGeo, conflat6HDRMaterial);
    sphere.name = 'conflat6hdr_sphere';
    vesselGroup.add(sphere);

    console.log('✅ Vessel initialized - Conflat-6 HDR (raymarched volumetric)');

  } else if (vesselMode === 'conflat6' || vesselMode === 'conflat6cube') {
    // Conflat 6: Six color-coded torus rings positioned at cube faces
    // Ring radius must equal cube half-size so rings touch at edges
    const cubeHalfSize = 1.5; // Distance from center to each face
    const ringRadius = cubeHalfSize;  // Ring radius = cube half-size for closed cube
    const tubeRadius = 0.05;

    const rings = [
      { dir: [0, 0, 1], label: 'North', color: 0x00ffff },    // +Z (cyan)
      { dir: [0, 0, -1], label: 'South', color: 0xff00ff },   // -Z (magenta)
      { dir: [1, 0, 0], label: 'East', color: 0xff0000 },     // +X (red)
      { dir: [-1, 0, 0], label: 'West', color: 0x00ff00 },    // -X (green)
      { dir: [0, 1, 0], label: 'Up', color: 0x0000ff },       // +Y (blue)
      { dir: [0, -1, 0], label: 'Down', color: 0xffff00 }     // -Y (yellow)
    ];

    rings.forEach((config) => {
      const { dir, label, color } = config;

      // Create torus ring (only for conflat6, not conflat6cube)
      if (vesselMode === 'conflat6') {
        const torusGeo = new THREE.TorusGeometry(ringRadius, tubeRadius, 16, 64);

        const torusMat = new THREE.MeshStandardMaterial({
          color: color,
          transparent: true,
          opacity: state.vessel.opacity || 0.7,
          emissive: color,
          emissiveIntensity: 0.3
        });

        const ring = new THREE.Mesh(torusGeo, torusMat);

        // Position ring at the cube face
        const position = new THREE.Vector3(
          dir[0] * cubeHalfSize,
          dir[1] * cubeHalfSize,
          dir[2] * cubeHalfSize
        );

        ring.position.copy(position);

        // Orient ring: make its normal align with dir
        const targetNormal = new THREE.Vector3(...dir);
        const defaultNormal = new THREE.Vector3(0, 0, 1);
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(defaultNormal, targetNormal);

        ring.quaternion.copy(quaternion);
        ring.name = `ring_${label.toLowerCase()}`;
        ring.userData = { direction: label, color: color };

        vesselGroup.add(ring);
      }

      // Create panel for media
      // Use square panels for conflat6cube (full size to form true cube), circular panels for conflat6
      const panelSize = vesselMode === 'conflat6cube'
        ? cubeHalfSize * 2  // Full cube face size - edges touch perfectly
        : ringRadius * 0.95 * 2; // Slightly smaller for circular panels with rings

      const panelGeo = vesselMode === 'conflat6cube'
        ? new THREE.PlaneGeometry(panelSize, panelSize)
        : new THREE.CircleGeometry(ringRadius * 0.95, 64);

      const panelMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });

      const panel = new THREE.Mesh(panelGeo, panelMat);

      // Position panel at the cube face
      const position = new THREE.Vector3(
        dir[0] * cubeHalfSize,
        dir[1] * cubeHalfSize,
        dir[2] * cubeHalfSize
      );

      panel.position.copy(position);

      // Orient panel: make its normal align with dir
      const targetNormal = new THREE.Vector3(...dir);
      const defaultNormal = new THREE.Vector3(0, 0, 1);
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(defaultNormal, targetNormal);

      panel.quaternion.copy(quaternion);
      panel.name = `panel_${label.toLowerCase()}`;
      panel.userData = { direction: label, color: color };

      vesselGroup.add(panel);

      const shapeType = vesselMode === 'conflat6cube' ? 'panel' : 'ring + panel';
      console.log(`🧭 ${label} ${shapeType} (${color.toString(16)}) at cube face`);
    });

    const modeLabel = vesselMode === 'conflat6cube' ? 'Conflat 6 Cube (square panels)' : 'Conflat 6 (circular panels)';
    console.log(`✅ Vessel initialized - ${modeLabel}`);
  } else {
    // Gyre mode: Torus-based rings (existing behavior)
    vesselMaterial = new THREE.MeshStandardMaterial({
      color: state.vessel.color,
      transparent: true,
      opacity: state.vessel.opacity
    });

    // Create rings based on current layout
    const ringConfigs = getLayoutConfig(state.vessel.layout);

    ringConfigs.forEach((config) => {
      const { axis, angle, position, scale: ringScale, radius } = config;

      // Improved subdivision for smoother rings
      const geometry = new THREE.TorusGeometry(
        radius || 1,    // Use custom radius for shells layout
        0.03,           // Slightly thinner for less visual clutter
        24,             // More radial segments for smoothness
        100             // More tubular segments for quality
      );

      const torus = new THREE.Mesh(geometry, vesselMaterial);

      // Apply rotation
      torus.rotateOnAxis(new THREE.Vector3(...axis), angle);

      // Apply position offset (for hoops layout)
      if (position) {
        torus.position.set(...position);
      }

      // Apply individual ring scaling (for hoops layout)
      if (ringScale) {
        torus.scale.setScalar(ringScale);
      }

      vesselGroup.add(torus);
    });

    // Clean up shadow box if it exists
    if (shadowBox) {
      shadowBox.dispose();
      shadowBox = null;
    }

    console.log(`✅ Vessel initialized - Gyre mode (${state.vessel.layout} layout)`);
  }

  vesselGroup.scale.setScalar(state.vessel.scale);
  vesselGroup.visible = state.vessel.enabled;

  // Phase 2.3.3: Enable Vessel in shadow layer for projection
  vesselGroup.layers.enable(SHADOW_LAYER);

  scene.add(vesselGroup);
}

// Phase 2.2.0: Export function to render shadow projection
export function renderShadowProjection() {
  if (shadowBox && state.vessel.mode === 'conflat6' && state.vessel.enabled) {
    shadowBox.render();
  }
}

export function updateVessel(camera) {
  if (!vesselGroup || !morphMesh) return;

  // Phase 12.0: Update visibility from state (respects both enabled and visible flags)
  vesselGroup.visible = state.vessel.enabled && state.vessel.visible;

  if (!vesselGroup.visible) return;

  // Per-axis spin control
  if (state.vessel.spinEnabled) {
    vesselGroup.rotation.x += state.vessel.spinSpeedX;
    vesselGroup.rotation.y += state.vessel.spinSpeedY;
    vesselGroup.rotation.z += state.vessel.spinSpeedZ;
  }

  // Adaptive scale based on morph target size
  morphMesh.geometry.computeBoundingSphere();
  const radius = morphMesh.geometry.boundingSphere.radius;
  let adaptiveRadius = radius * (state.vessel.scaleMultiplier || 1.2) * state.vessel.scale;

  // Base adaptive scale
  vesselGroup.scale.set(adaptiveRadius, adaptiveRadius, adaptiveRadius);

  // Phase 13.7.1: Update Conflat-6 HDR shader uniforms
  if (state.vessel.mode === 'conflat6hdr' && conflat6HDRMaterial) {
    const audioData = getEffectiveAudio();
    const spectralFlux = (audioData.bass + audioData.mid + audioData.treble) / 3;
    const modWheel = audioData.bass * 0.5;

    conflat6HDRMaterial.uniforms.uTime.value = conflat6Clock.getElapsedTime();
    conflat6HDRMaterial.uniforms.uSpectralFlux.value = spectralFlux;
    conflat6HDRMaterial.uniforms.uModWheel.value = modWheel;
    conflat6HDRMaterial.uniforms.uCircleOffset.value = 0.0; // Can be connected to MIDI later
    conflat6HDRMaterial.uniforms.uOpacity.value = state.vessel.opacity || 0.7;

    // Phase 13.7.2: Update texture based on current state
    const textureMode = state.vessel.hdrTexture || 'none';
    if (textureMode === 'metallic') {
      if (!metallicTexture) metallicTexture = createMetallicTexture();
      conflat6HDRMaterial.uniforms.uTexture.value = metallicTexture;
      conflat6HDRMaterial.uniforms.uUseTexture.value = true;
    } else if (textureMode === 'custom' && state.vessel.customTexture) {
      conflat6HDRMaterial.uniforms.uTexture.value = state.vessel.customTexture;
      conflat6HDRMaterial.uniforms.uUseTexture.value = true;
    } else {
      conflat6HDRMaterial.uniforms.uUseTexture.value = false;
    }

    // Update camera position for raymarching
    if (camera) {
      conflat6HDRMaterial.uniforms.uCameraPosition.value.copy(camera.position);
    }

    return; // Skip standard vessel material updates
  }

  // Base opacity (for gyre and conflat6/conflat6cube modes)
  if (vesselMaterial) {
    vesselMaterial.opacity = state.vessel.opacity;
  }

  // Phase 11.2.1: Layered color system
  const layerConfig = state.colorLayers.vessel;
  const audioData = getEffectiveAudio();
  const audioLevel = (audioData.bass + audioData.mid + audioData.treble) / 3;

  let finalColor = layerConfig.baseColor;

  if (state.audioReactive) {
    // Bass pulses vessel scale (±5%), does not affect morphs
    const bassFactor = 1 + (audioData.bass - 0.5) * 0.1;
    vesselGroup.scale.multiplyScalar(bassFactor);

    // Mid pulses vessel opacity (0.2–0.8 range)
    vesselMaterial.opacity = THREE.MathUtils.clamp(0.2 + audioData.mid * 0.6, 0.2, 0.8);

    // Phase 11.2.1: Additive color blending
    finalColor = blendColors(
      layerConfig.baseColor,
      layerConfig.audioColor,
      layerConfig.audioIntensity,
      audioLevel
    );

    // Debug logging (2% sample rate)
    if (Math.random() < 0.02) {
      console.log(`🎨 Vessel: base=${layerConfig.baseColor} audio=${layerConfig.audioColor} final=${finalColor}`);
    }
  }

  vesselMaterial.color.set(finalColor);

  // Phase 13.2.0: Panel audio reactivity for conflat6/conflat6cube
  if (state.vessel.panelAudioReactive && (state.vessel.mode === 'conflat6' || state.vessel.mode === 'conflat6cube')) {
    const directions = ['north', 'south', 'east', 'west', 'up', 'down'];

    directions.forEach((dir) => {
      const panelName = `panel_${dir}`;
      const panel = vesselGroup.getObjectByName(panelName);

      if (panel) {
        // Scale pulse with bass (±15%)
        const scaleAmount = 1 + (audioData.bass - 0.5) * 0.3;
        panel.scale.setScalar(scaleAmount);

        // Opacity pulse with mid frequencies (0.3-1.0 range)
        panel.material.opacity = THREE.MathUtils.clamp(0.3 + audioData.mid * 0.7, 0.3, 1.0);

        // Also apply to image meshes if they exist
        if (panel.userData.imageMesh) {
          panel.userData.imageMesh.scale.setScalar(scaleAmount);
          panel.userData.imageMesh.material.opacity = THREE.MathUtils.clamp(0.7 + audioData.treble * 0.3, 0.7, 1.0);
        }
      }
    });
  }

  // Update debug display
  const debugElement = document.getElementById('vessel-debug');
  if (debugElement) {
    debugElement.textContent = `Radius: ${adaptiveRadius.toFixed(2)}`;
  }
}

export function cycleLayout(scene) {
  state.vessel.layoutIndex = (state.vessel.layoutIndex + 1) % layouts.length;
  state.vessel.layout = layouts[state.vessel.layoutIndex];
  console.log(`🔄 Vessel layout cycled to: ${state.vessel.layout}`);
  reinitVessel(scene);

  // Trigger HUD sync
  notifyHUDUpdate();
}

export function reinitVessel(scene, renderer, camera) {
  if (vesselGroup) {
    // Remove existing vessel from scene
    scene.remove(vesselGroup);
    // Clear the group
    vesselGroup.clear();
  }
  // Reinitialize with current layout
  initVessel(scene, renderer, camera);
  // Ensure material color is synced after reinit
  if (vesselMaterial) {
    vesselMaterial.color.set(state.vessel.color);
  }
}

// Notify HUD about layout changes
function notifyHUDUpdate() {
  const dropdown = document.getElementById('vessel-layout-dropdown');
  if (dropdown) {
    dropdown.value = state.vessel.layout;
    console.log(`🔄 HUD synced to layout: ${state.vessel.layout}`);
  }
}

export function getVesselGroup() {
  return vesselGroup;
}

// Phase 12.0: Toggle compass rings visibility
export function setVesselVisible(visible) {
  state.vessel.visible = !!visible;
  if (vesselGroup) {
    vesselGroup.visible = state.vessel.enabled && state.vessel.visible;
  }
  console.log(`🧭 Compass rings: ${visible ? 'VISIBLE' : 'HIDDEN'}`);
}

// Upload media (image/video) to a specific Conflat 6 panel
export function uploadPanelMedia(direction, file) {
  if (!vesselGroup || (state.vessel.mode !== 'conflat6' && state.vessel.mode !== 'conflat6cube')) {
    console.warn('Conflat 6 mode not active');
    return;
  }

  const panelName = `panel_${direction.toLowerCase()}`;
  const panel = vesselGroup.getObjectByName(panelName);

  if (!panel) {
    console.warn(`Panel ${direction} not found`);
    return;
  }

  const url = URL.createObjectURL(file);
  const isVideo = file.type.startsWith('video/');

  if (isVideo) {
    const video = document.createElement('video');
    video.src = url;
    video.loop = true;
    video.muted = true;
    video.play();

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    panel.material.map = texture;
    panel.material.needsUpdate = true;
    panel.userData.mediaElement = video;
    console.log(`📹 Video uploaded to ${direction} panel`);
  } else {
    // Image: Create a new double-sided mesh surface with the image texture
    const texture = new THREE.TextureLoader().load(url, () => {
      console.log(`🖼️ Image uploaded to ${direction} panel`);
    });

    // Remove existing image mesh if it exists
    if (panel.userData.imageMesh) {
      panel.parent.remove(panel.userData.imageMesh);
      panel.userData.imageMesh.geometry.dispose();
      panel.userData.imageMesh.material.dispose();
      panel.userData.imageMesh = null;
    }

    // Create new mesh with double-sided material for image projection
    const meshGeo = panel.geometry.clone();
    const meshMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide
    });

    const imageMesh = new THREE.Mesh(meshGeo, meshMat);

    // Copy position and rotation from panel
    imageMesh.position.copy(panel.position);
    imageMesh.quaternion.copy(panel.quaternion);
    imageMesh.name = `image_${direction.toLowerCase()}`;

    // Add to vessel group and store reference
    vesselGroup.add(imageMesh);
    panel.userData.imageMesh = imageMesh;
  }
}

// Clear media from a specific panel
export function clearPanelMedia(direction) {
  if (!vesselGroup || (state.vessel.mode !== 'conflat6' && state.vessel.mode !== 'conflat6cube')) return;

  const panelName = `panel_${direction.toLowerCase()}`;
  const panel = vesselGroup.getObjectByName(panelName);

  if (!panel) return;

  // Clear video element
  if (panel.userData.mediaElement) {
    panel.userData.mediaElement.pause();
    panel.userData.mediaElement = null;
  }

  // Clear video texture from panel material
  if (panel.material.map) {
    panel.material.map.dispose();
    panel.material.map = null;
    panel.material.needsUpdate = true;
  }

  // Clear image mesh
  if (panel.userData.imageMesh) {
    vesselGroup.remove(panel.userData.imageMesh);
    panel.userData.imageMesh.geometry.dispose();
    panel.userData.imageMesh.material.map?.dispose();
    panel.userData.imageMesh.material.dispose();
    panel.userData.imageMesh = null;
  }

  console.log(`🗑️ Cleared ${direction} panel`);
}

// Export ShadowBox class for use in main.js
export { ShadowBox };

console.log("🚢 Vessel module ready");