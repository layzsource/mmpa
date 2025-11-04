// visual.js - Phase 11.6.0/11.7.50/13.6.0: Background plane texture + Acid Empire shader system
import * as THREE from "three";
import { state } from "./state.js";
import { initTheoryRenderer, updateTheoryRenderer } from './theoryRenderer.js';
import { updateCalibration, getStabilityMetric, getFluxMetric } from './archetypeRecognizer.js';

console.log("🖼️ visual.js loaded");

let backgroundMesh = null;
let skyboxMesh = null; // Phase 13.6.2: Skybox cube
let skyboxMaterials = []; // Phase 13.6.2: Array of 6 materials for skybox faces
let skyboxShaderMaterials = []; // Phase 13.6.2: Array of 6 shader materials for Acid Empire
let voxelWaveShaderMaterials = []; // Phase 13.7.0: Array of 6 shader materials for Voxel Wave
let hyperbolicTilingShaderMaterials = []; // Phase 13.29: Array of 6 shader materials for Hyperbolic Tiling
let acidShaderMaterial = null;
let voxelWaveShaderMaterial = null;
let hyperbolicTilingShaderMaterial = null;
let acidClock = new THREE.Clock();

// Audio-reactive smoothing for Acid Empire
let smoothedFrequency = 0.5; // Tracks dominant frequency (0-1)
let smoothedSphereScale = 1.0; // Tracks audio-reactive sphere scale

// MMPA Unified Theory Renderer - Phase 13
let theoryRendererAPI = null;
let theoryModeEnabled = false;

/**
 * Analyze audio spectrum to find dominant frequency range
 * Returns normalized frequency (0.0 = low bass, 1.0 = high treble)
 */
function analyzeDominantFrequency(spectrum) {
  if (!spectrum || spectrum.length === 0) return 0.5;

  // Divide spectrum into frequency bands
  const bandSize = Math.floor(spectrum.length / 3);
  const lowBand = spectrum.slice(0, bandSize); // Bass ~20-250Hz
  const midBand = spectrum.slice(bandSize, bandSize * 2); // Mid ~250-2kHz
  const highBand = spectrum.slice(bandSize * 2); // Treble ~2kHz-20kHz

  // Calculate weighted average for each band
  const lowAvg = lowBand.reduce((sum, val) => sum + val, 0) / lowBand.length / 255.0;
  const midAvg = midBand.reduce((sum, val) => sum + val, 0) / midBand.length / 255.0;
  const highAvg = highBand.reduce((sum, val) => sum + val, 0) / highBand.length / 255.0;

  // Find which band has the most energy
  const totalEnergy = lowAvg + midAvg + highAvg;
  if (totalEnergy < 0.01) return 0.5; // Silence - return neutral

  // Weight the bands to get a frequency position (0-1)
  // Low frequencies = 0.0, High frequencies = 1.0
  const freqPosition = (lowAvg * 0.0 + midAvg * 0.5 + highAvg * 1.0) / totalEnergy;

  return freqPosition;
}

// Phase 13.6.0: Acid Empire shader (sine wave grid + CRT + color cycling + effects)
const acidEmpireShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uScrollX;
    uniform float uScrollY;
    uniform float uFreq;
    uniform float uShapeMorph;
    uniform float uPulseStrength;
    uniform float uHighStrength;
    uniform float uColorShift;
    uniform float uColorDrive;
    uniform float uFeedback;
    uniform float uGlitch;
    uniform float uPortalWarp;
    uniform float uSphereScale;
    uniform float uInvert;
    uniform vec2 uResolution;

    varying vec2 vUv;

    // Noise function for VHS effect
    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      vec2 p = (uv - 0.5) * 2.0;

      // Portal warp effect (radial distortion)
      if (uPortalWarp > 0.01) {
        float dist = length(p);
        float warp = uPortalWarp * 0.5;
        p *= 1.0 + warp * dist * dist;
      }

      // Sphere shrink effect
      if (uSphereScale < 0.99) {
        float dist = length(p);
        p *= mix(1.0, uSphereScale, smoothstep(0.0, 1.0, dist));
      }

      // Acid Empire sine wave grid pattern
      float scale = (0.5 + 0.3 * uPulseStrength) * uShapeMorph;
      float x = p.x * scale * 10.0;
      float y = p.y * scale * 10.0;

      float sineX = sin(uFreq * 3.14159 * x + uScrollX + 1.5708);
      float sineY = sin(uFreq * 3.14159 * y + uScrollY + 1.5708);
      float pattern = sineX * sineY;

      // Normalize pattern
      float intensity = (pattern + 1.0) * 0.5;
      intensity = clamp(intensity * (1.0 + uPulseStrength), 0.0, 1.0);

      // Base color (grayscale)
      vec3 color = vec3(intensity);

      // Color cycling (HSV hue shift)
      if (uPulseStrength > 0.05 || uHighStrength > 0.05) {
        float hue = mod(uColorShift + intensity * uColorDrive, 1.0);
        float sat = 0.8;
        float val = intensity;

        // HSV to RGB
        float h6 = hue * 6.0;
        float c = val * sat;
        float x = c * (1.0 - abs(mod(h6, 2.0) - 1.0));
        float m = val - c;

        if (h6 < 1.0) color = vec3(c, x, 0.0);
        else if (h6 < 2.0) color = vec3(x, c, 0.0);
        else if (h6 < 3.0) color = vec3(0.0, c, x);
        else if (h6 < 4.0) color = vec3(0.0, x, c);
        else if (h6 < 5.0) color = vec3(x, 0.0, c);
        else color = vec3(c, 0.0, x);

        color += vec3(m);
      }

      // CRT scanlines
      float scanline = sin(uv.y * uResolution.y * 2.0) * 0.1;
      color *= (1.0 - scanline);

      // VHS glitch/warp
      if (uGlitch > 0.01) {
        float glitchLine = floor(uv.y * 100.0);
        float glitchNoise = rand(vec2(glitchLine, floor(uTime * 10.0)));
        if (glitchNoise < uGlitch * 0.1) {
          uv.x += (rand(vec2(glitchLine, uTime)) - 0.5) * uGlitch * 0.1;
          color.r += rand(vec2(uv.x, uTime)) * uGlitch * 0.3;
          color.g -= rand(vec2(uv.y, uTime)) * uGlitch * 0.2;
        }
      }

      // Color inversion (high frequency flash)
      if (uInvert > 0.5) {
        color = vec3(1.0) - color;
      }

      // VHS noise
      float noise = rand(uv + uTime * 0.1) * 0.05;
      color += vec3(noise * (0.3 + uGlitch * 0.7));

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

// Phase 13.29: Hyperbolic Tiling shader - Non-Euclidean fractal pattern with infinite zoom
const hyperbolicTilingShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;

    varying vec2 vUv;
    varying vec3 vWorldPosition;

    uniform float uTime;
    uniform float uPatternScale;
    uniform vec2 uPan;
    uniform float uRotationSpeed;
    uniform int uIterations;
    uniform float uDensityScale;
    uniform float uColorHueShift;
    uniform float uGridIntensity;
    uniform float uAudioBass;
    uniform float uAudioMid;
    uniform float uAudioTreble;
    uniform float uAudioLevel;
    uniform float uAudioReactivity;
    uniform vec2 uResolution;
    uniform int uFaceIndex;          // Phase 13.30: Skybox face index (0-5)
    uniform bool uRenderMode360;     // Phase 13.30: 360 equirectangular mode

    // 2D rotation matrix
    mat2 rotate(float angle) {
      float c = cos(angle);
      float s = sin(angle);
      return mat2(c, -s, s, c);
    }

    // Hue shift function
    vec3 hueShift(vec3 color, float shift) {
      const vec3 k = vec3(0.57735, 0.57735, 0.57735);
      float cosAngle = cos(shift * 6.28318);
      return vec3(color * cosAngle + cross(k, color) * sin(shift * 6.28318) + k * dot(k, color) * (1.0 - cosAngle));
    }

    // Complex number multiplication for hyperbolic transformations
    vec2 complexMul(vec2 a, vec2 b) {
      return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
    }

    // Hyperbolic distance (Poincare disk model)
    float hyperbolicDist(vec2 z) {
      float r2 = dot(z, z);
      return log((1.0 + r2) / (1.0 - r2 + 0.001));
    }

    // Phase 13.30: Convert world position to continuous spherical coordinates
    // Uses direction vector directly for seamless patterns
    vec3 worldPosToSpherical(vec3 worldPos) {
      // Normalize world position to get direction vector from origin
      vec3 dir = normalize(worldPos);

      // Convert to spherical coordinates for continuous mapping
      // Use theta (azimuthal angle) and phi (polar angle)
      float theta = atan(dir.z, dir.x);  // Horizontal angle: -PI to PI
      float phi = acos(clamp(dir.y, -1.0, 1.0));  // Vertical angle: 0 to PI

      // Return spherical coords that can be used directly
      // Scale to useful range for pattern generation
      return vec3(
        theta / 3.14159265359,        // -1 to 1 (horizontal)
        phi / 3.14159265359,          // 0 to 1 (vertical)
        length(worldPos)               // distance (if needed)
      );
    }

    // High-performance hyperbolic tiling with infinite detail
    float calculate_tiling(vec2 uv) {
      float scale = uPatternScale;
      vec2 p = (uv * 2.0 - 1.0) * scale * 0.5 + uPan;

      // Rotation
      float rotation = uTime * uRotationSpeed;
      p = rotate(rotation) * p;

      // Density parameter
      float density = uDensityScale;

      // Fractal-like iteration for complex hyperbolic patterns
      int maxIter = min(uIterations, 25);
      for (int i = 0; i < 25; i++) {
        if (i >= maxIter) break;

        // Core hyperbolic transformation
        p = abs(p);
        p = p / dot(p, p);  // Inversion
        p = p * 1.8 - 1.2;
      }

      // Calculate pattern density
      float d = length(p);
      d = 1.0 / d;

      return d;
    }

    void main() {
      // Phase 13.30: Use spherical coords in 360 mode (seamless), or face UV in per-panel mode
      vec2 uv;
      if (uRenderMode360) {
        // Get spherical coordinates from world position
        vec3 spherical = worldPosToSpherical(vWorldPosition);
        // Use theta and phi directly, scaled for pattern space
        // This avoids UV wrapping discontinuities
        uv = vec2(spherical.x * 2.0, spherical.y);  // theta: -2 to 2, phi: 0 to 1
      } else {
        uv = vUv;
      }

      // Calculate hyperbolic pattern density
      float d = calculate_tiling(uv);

      // Darker base color for contrast (richer blacks)
      vec3 color = vec3(0.02, 0.04, 0.08);

      // High-saturation color mix based on density (HDR/Ultracolor feel)
      color += vec3(1.1, 0.35, 1.3) * d;

      // Apply hue shift
      color = hueShift(color, uColorHueShift + uAudioMid * uAudioReactivity * 0.1);

      // Thin white grid lines (HDR highlight)
      float gridStrength = uGridIntensity * (1.0 + uAudioLevel * uAudioReactivity * 0.5);
      float grid = clamp(pow(mod(d * 12.0, 1.0), 15.0), 0.0, 1.0);
      color = mix(color, vec3(1.0), grid * 0.4 * gridStrength);

      // Audio-reactive HDR boost
      color *= (1.5 + uAudioLevel * uAudioReactivity);

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

// Phase 13.7.3: Simplified Voxel Wave - WebGL-compatible version
const voxelWaveShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPos;

    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uAmplitude;
    uniform float uFrequency;
    uniform float uSpeed;
    uniform float uCellSize;
    uniform float uColorShift;
    uniform float uSpectralFlux;
    uniform float uModWheel;

    varying vec2 vUv;
    varying vec3 vWorldPos;

    // Hue to RGB conversion
    vec3 hueToRgb(float h) {
      float r = clamp(abs(h * 6.0 - 3.0) - 1.0, 0.0, 1.0);
      float g = clamp(2.0 - abs(h * 6.0 - 2.0), 0.0, 1.0);
      float b = clamp(2.0 - abs(h * 6.0 - 4.0), 0.0, 1.0);
      return vec3(r, g, b);
    }

    void main() {
      // Map UV to grid coordinates (64×64 voxels)
      vec2 gridSize = vec2(64.0, 64.0);
      vec2 gridUV = vUv * gridSize;
      vec2 gridCell = floor(gridUV);
      vec2 cellUV = fract(gridUV);

      // Grid indices for wave calculation
      float ix = gridCell.x;
      float iy = gridCell.y;

      // Wave animation with prominent propagation
      float amp = uAmplitude * (1.0 + 0.35 * uModWheel);
      float freq = uFrequency * (0.6 + 0.6 * uSpectralFlux);
      float speed = uSpeed * (1.0 + 1.2 * uSpectralFlux);
      float phase = (ix + iy) * freq + uTime * speed;
      float wave = sin(phase);

      // Convert wave from [-1,1] to [0,1] for height/brightness
      float waveHeight = (wave + 1.0) * 0.5;

      // VOLUMETRIC EFFECT: Simulate 3D depth by scaling voxel based on wave
      // Higher wave = voxel "pops out" toward camera (appears larger)
      float depthScale = 1.0 + waveHeight * amp * 2.5; // Scale up to 2.5x at wave peaks

      // Apply depth scaling to cell coordinates to make voxel appear larger
      vec2 cellCenterScaled = (cellUV - 0.5) / depthScale + 0.5;
      vec2 cellCenterDist = abs(cellCenterScaled - 0.5) * 2.0;

      // Voxel shape (rounded square) with depth scaling
      float voxelShape = 1.0 - max(cellCenterDist.x, cellCenterDist.y);
      voxelShape = smoothstep(0.05, 0.15, voxelShape);

      // Clamp voxel shape to cell boundary (prevent overflow into neighbors)
      float cellBorder = max(abs(cellUV.x - 0.5), abs(cellUV.y - 0.5));
      voxelShape *= smoothstep(0.52, 0.48, cellBorder);

      // Wave STRONGLY affects voxel intensity - this creates the propagation effect
      // Voxels dim significantly when wave is low, bright when wave is high
      float waveIntensity = 0.2 + 0.8 * waveHeight; // Range from 0.2 to 1.0
      float intensity = voxelShape * waveIntensity;

      // Grid-based color cycling tied to wave propagation
      float gridPhase = (ix + iy) * (0.20 + 0.60 * uSpectralFlux) + uTime * (0.35 + 1.35 * uSpectralFlux);

      // Neutral base color (metallic gray-blue)
      vec3 baseFloorNeutral = vec3(0.26, 0.30, 0.36);

      // Hue calculation with color shift, influenced by wave
      float baseHue = fract(0.50 + uColorShift * 0.05);
      float hue = fract(baseHue + 0.45 * sin(gridPhase) + 0.15 * wave);

      // Convert hue to RGB tint
      vec3 tint = hueToRgb(hue);

      // Tint amount with audio reactivity AND wave height (brighter voxels = more vivid)
      float tintAmt = clamp(0.45 + 0.9 * uSpectralFlux + 0.45 * uModWheel + 0.3 * waveHeight, 0.0, 2.0);

      // Create vivid color (boosted by wave peak)
      vec3 vivid = tint * (1.8 + 1.6 * uSpectralFlux + 0.8 * waveHeight);

      // Mix neutral with vivid
      vec3 baseColor = mix(baseFloorNeutral, vivid, tintAmt);

      // Apply intensity
      vec3 finalColor = baseColor * intensity;

      // Emissive boost for audio reactivity AND wave peaks
      float emissive = uSpectralFlux * 0.5 * intensity + waveHeight * 0.4;
      finalColor += baseColor * emissive;

      // VOLUMETRIC SHADOWS AND HIGHLIGHTS
      // Create shadow at bottom-right of voxel (simulates lighting from top-left)
      vec2 shadowOffset = vec2(0.15, -0.15) * waveHeight; // Shadow moves with depth
      vec2 shadowUV = cellUV - 0.5 - shadowOffset;
      float shadowDist = length(shadowUV);
      float shadow = smoothstep(0.5, 0.3, shadowDist) * waveHeight * 0.4;

      // Create highlight at top-left of voxel
      vec2 highlightOffset = vec2(-0.2, 0.2) * waveHeight;
      vec2 highlightUV = cellUV - 0.5 - highlightOffset;
      float highlightDist = length(highlightUV);
      float highlight = smoothstep(0.5, 0.2, highlightDist) * waveHeight * 0.6;

      // Apply shadow (darken)
      finalColor *= (1.0 - shadow * voxelShape);

      // Apply highlight (brighten)
      finalColor += vec3(highlight) * voxelShape;

      // Add metallic shine on edges (enhanced by wave height)
      float edgeShine = pow(1.0 - voxelShape, 2.0) * 0.3 * (1.0 + uSpectralFlux + waveHeight * 0.5);
      finalColor += vec3(edgeShine);

      // Dark background between voxels with subtle ambient occlusion
      vec3 backgroundColor = vec3(0.05, 0.06, 0.12);
      // Add subtle AO - darker near voxels that are "tall" (high wave)
      float ao = 1.0 - (1.0 - voxelShape) * waveHeight * 0.3;
      backgroundColor *= ao;
      finalColor = mix(backgroundColor, finalColor, voxelShape);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

// Luminous Tessellation shader - HDR Voronoi with geometric patterns
const luminousTessellationShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uScale;
    uniform float uSpeed;
    uniform float uComplexity;
    uniform float uColorShift;
    uniform float uLuminosity;
    uniform float uContrast;
    uniform float uAudioBass;
    uniform float uAudioMid;
    uniform float uAudioTreble;
    uniform float uWaveAmplitude;
    uniform float uWaveFrequency;
    uniform float uMorphIntensity;
    uniform vec2 uResolution;

    varying vec2 vUv;

    // Hash function for pseudo-random values
    vec2 hash2(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }

    // Voronoi distance field
    vec3 voronoi(vec2 x, float time) {
      vec2 n = floor(x);
      vec2 f = fract(x);

      vec3 m = vec3(8.0);
      vec2 cellId = vec2(0.0);

      for(int j = -1; j <= 1; j++) {
        for(int i = -1; i <= 1; i++) {
          vec2 g = vec2(float(i), float(j));
          vec2 o = hash2(n + g);

          // Animate cell centers
          o = 0.5 + 0.5 * sin(time + 6.2831 * o);

          vec2 r = g + o - f;
          float d = dot(r, r);

          if(d < m.x) {
            m.y = m.x;
            m.x = d;
            cellId = n + g;
          } else if(d < m.y) {
            m.y = d;
          }
        }
      }

      return vec3(sqrt(m.x), sqrt(m.y), cellId.x + cellId.y);
    }

    // HDR-style color gradient with deep saturation
    vec3 hdrColor(float t, float hueShift, float luminosity) {
      t = mod(t + hueShift, 1.0);

      // Deep saturated colors with HDR luminosity
      vec3 color;
      if(t < 0.16) {
        float s = t / 0.16;
        color = mix(vec3(0.8, 0.0, 1.0), vec3(0.0, 0.4, 1.0), s); // Purple to deep blue
      } else if(t < 0.33) {
        float s = (t - 0.16) / 0.17;
        color = mix(vec3(0.0, 0.4, 1.0), vec3(0.0, 0.9, 1.0), s); // Deep blue to cyan
      } else if(t < 0.5) {
        float s = (t - 0.33) / 0.17;
        color = mix(vec3(0.0, 0.9, 1.0), vec3(0.0, 1.0, 0.6), s); // Cyan to emerald
      } else if(t < 0.66) {
        float s = (t - 0.5) / 0.16;
        color = mix(vec3(0.0, 1.0, 0.6), vec3(1.0, 0.9, 0.0), s); // Emerald to gold
      } else if(t < 0.83) {
        float s = (t - 0.66) / 0.17;
        color = mix(vec3(1.0, 0.9, 0.0), vec3(1.0, 0.3, 0.0), s); // Gold to orange
      } else {
        float s = (t - 0.83) / 0.17;
        color = mix(vec3(1.0, 0.3, 0.0), vec3(0.8, 0.0, 1.0), s); // Orange to purple
      }

      // Apply HDR luminosity boost
      color *= luminosity;
      return color;
    }

    // Smooth minimum for organic blending
    float smin(float a, float b, float k) {
      float h = max(k - abs(a - b), 0.0) / k;
      return min(a, b) - h * h * k * 0.25;
    }

    void main() {
      vec2 uv = vUv;
      vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

      // Geometry morphing/distortion effect
      if (uMorphIntensity > 0.01) {
        // Create organic distortion using time-varying waves
        float distortX = sin(p.y * 3.0 + uTime * 0.5) * uMorphIntensity * 0.3;
        float distortY = cos(p.x * 3.0 + uTime * 0.4) * uMorphIntensity * 0.3;
        p.x += distortX;
        p.y += distortY;

        // Add rotational twist
        float dist = length(p);
        float angle = atan(p.y, p.x);
        angle += dist * uMorphIntensity * sin(uTime * 0.3) * 0.5;
        p = vec2(cos(angle), sin(angle)) * dist;
      }

      // Multi-layer Voronoi with different scales
      float time = uTime * uSpeed;
      float scale = uScale * (1.0 + uAudioBass * 0.3);

      // Layer 1: Large cells (base structure)
      vec3 vor1 = voronoi(p * scale * 2.0, time * 0.5);

      // Layer 2: Medium cells (detail)
      vec3 vor2 = voronoi(p * scale * 5.0, time * 0.8);

      // Layer 3: Small cells (fine detail) - influenced by audio
      float detailScale = 10.0 + uAudioTreble * 5.0;
      vec3 vor3 = voronoi(p * scale * detailScale, time * 1.2);

      // Combine layers with smooth blending
      float dist1 = vor1.x;
      float dist2 = vor2.x;
      float dist3 = vor3.x;

      // Edge detection (borders between cells)
      float edge1 = abs(vor1.x - vor1.y);
      float edge2 = abs(vor2.x - vor2.y);
      float edge3 = abs(vor3.x - vor3.y);

      // Create geometric patterns
      float pattern = smin(smin(dist1, dist2, 0.1), dist3, 0.05);

      // Edge glow (HDR bloom-like effect)
      float edgeGlow = 0.0;
      edgeGlow += pow(1.0 - smoothstep(0.0, 0.05, edge1), 3.0) * 2.0;
      edgeGlow += pow(1.0 - smoothstep(0.0, 0.03, edge2), 4.0) * 1.5;
      edgeGlow += pow(1.0 - smoothstep(0.0, 0.02, edge3), 5.0) * 1.0;

      // Audio-reactive edge enhancement
      edgeGlow *= (1.0 + uAudioMid * 1.5);

      // Color based on cell ID and distance
      float colorIndex = fract(vor1.z * 0.1 + uTime * 0.05);
      vec3 baseColor = hdrColor(colorIndex, uColorShift, uLuminosity);

      // Secondary color for depth
      float colorIndex2 = fract(vor2.z * 0.15 + uTime * 0.08);
      vec3 detailColor = hdrColor(colorIndex2, uColorShift + 0.3, uLuminosity * 0.7);

      // Mix colors based on pattern
      vec3 cellColor = mix(baseColor, detailColor, smoothstep(0.1, 0.4, pattern));

      // Apply contrast
      cellColor = pow(cellColor, vec3(1.0 / uContrast));

      // Add edge glow (HDR bloom)
      vec3 glowColor = hdrColor(colorIndex + 0.5, uColorShift, uLuminosity * 2.0);
      vec3 finalColor = cellColor + glowColor * edgeGlow;

      // Subtle pulsing based on complexity parameter
      float pulse = 1.0 + sin(uTime * 2.0 + pattern * 10.0) * 0.1 * uComplexity;
      finalColor *= pulse;

      // Wave displacement effect (similar to voxel floor)
      if (uWaveAmplitude > 0.01) {
        // Create propagating wave pattern
        float waveDist = length(p) * uWaveFrequency;
        float wave = sin(waveDist - uTime * uSpeed * 2.0) * 0.5 + 0.5;

        // Apply wave to brightness and color intensity
        float waveModulation = 1.0 + wave * uWaveAmplitude;
        finalColor *= waveModulation;

        // Add wave-based luminosity boost to edges
        float waveEdge = abs(wave - 0.5) * 2.0; // 0 at peaks/troughs, 1 at midpoints
        finalColor += hdrColor(colorIndex + wave * 0.3, uColorShift, uLuminosity * 0.5) * waveEdge * uWaveAmplitude * 0.5;
      }

      // Vignette for depth
      float vignette = 1.0 - length(p) * 0.3;
      finalColor *= vignette;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

let luminousShaderMaterial = null;
let luminousShaderMaterials = []; // For skybox

// Sacred Geometry shader - Egyptian pyramids with scrolling parallax
const sacredGeometryShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uScrollSpeed;
    uniform float uLayerCount;
    uniform float uColorShift;
    uniform float uSymbolDensity;
    uniform float uGlowIntensity;
    uniform float uPyramidScale;
    uniform float uAudioBass;
    uniform float uAudioMid;
    uniform float uAudioTreble;
    uniform float uDancingOutline;
    uniform vec2 uResolution;

    varying vec2 vUv;

    // Hash for pseudo-random
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    // Egyptian color palette with psychedelic hues (darkened for deep blacks)
    vec3 egyptianColor(float t, float hueShift) {
      t = mod(t + hueShift, 1.0);
      vec3 color;

      if(t < 0.2) {
        // Deep blue to cyan (night sky to Nile) - reduced brightness
        color = mix(vec3(0.0, 0.05, 0.15), vec3(0.0, 0.4, 0.5), t / 0.2);
      } else if(t < 0.4) {
        // Cyan to gold (water to sun) - reduced brightness
        color = mix(vec3(0.0, 0.4, 0.5), vec3(0.5, 0.4, 0.0), (t - 0.2) / 0.2);
      } else if(t < 0.6) {
        // Gold to orange (sun to desert) - reduced brightness
        color = mix(vec3(0.5, 0.4, 0.0), vec3(0.5, 0.2, 0.0), (t - 0.4) / 0.2);
      } else if(t < 0.8) {
        // Orange to magenta (desert to royal purple) - reduced brightness
        color = mix(vec3(0.5, 0.2, 0.0), vec3(0.5, 0.0, 0.4), (t - 0.6) / 0.2);
      } else {
        // Magenta to deep blue (completion of cycle) - reduced brightness
        color = mix(vec3(0.5, 0.0, 0.4), vec3(0.0, 0.05, 0.15), (t - 0.8) / 0.2);
      }

      return color;
    }

    // Triangle/pyramid pattern
    float pyramid(vec2 p, float scale) {
      p *= scale;
      vec2 gridPos = floor(p);
      vec2 localPos = fract(p) - 0.5;

      // Triangle distance field
      float tri = abs(localPos.x) + abs(localPos.y);

      // Create pyramid outline
      float pyramid = smoothstep(0.7, 0.65, tri);

      // Inner pyramid (nested)
      float innerTri = abs(localPos.x * 0.6) + abs(localPos.y * 0.6);
      pyramid += smoothstep(0.4, 0.35, innerTri) * 0.5;

      return pyramid;
    }

    // Eye of Horus symbol
    float eyeOfHorus(vec2 p, float scale) {
      p *= scale;
      vec2 gridPos = floor(p);
      vec2 localPos = fract(p) - 0.5;

      // Simple eye shape using circles
      float eyeOuter = length(localPos) - 0.3;
      float eyeInner = length(localPos) - 0.15;
      float eye = smoothstep(0.02, 0.0, abs(eyeOuter)) + smoothstep(0.05, 0.0, abs(eyeInner));

      // Pupil
      eye += smoothstep(0.1, 0.05, length(localPos));

      return eye;
    }

    // Hieroglyphic-style line patterns
    float hieroglyphs(vec2 p, float scale, float time) {
      p *= scale;
      vec2 gridPos = floor(p);
      vec2 localPos = fract(p) - 0.5;

      float id = hash(gridPos);

      // Horizontal lines
      float lines = 0.0;
      for(int i = 0; i < 3; i++) {
        float y = -0.3 + float(i) * 0.3;
        lines += smoothstep(0.05, 0.02, abs(localPos.y - y));
      }

      // Vertical accents
      if(id > 0.5) {
        lines += smoothstep(0.05, 0.02, abs(localPos.x));
      }

      return lines * 0.3;
    }

    void main() {
      vec2 uv = vUv;
      vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

      vec3 finalColor = vec3(0.0);

      // Parallax scrolling layers
      float numLayers = uLayerCount;

      for(float layer = 0.0; layer < 4.0; layer++) {
        if(layer >= numLayers) break;

        float depth = (layer + 1.0) / numLayers;
        float scrollSpeed = uScrollSpeed * depth * (1.0 + uAudioBass * 0.5);

        // Scroll offset
        vec2 scrollOffset = vec2(0.0, uTime * scrollSpeed);
        vec2 layerP = p / depth + scrollOffset;

        // Pattern density varies by layer
        float scale = uPyramidScale * (1.0 + layer * 0.3) * (1.0 + uAudioMid * 0.3);

        // Build layer pattern
        float pattern = 0.0;

        // Pyramids (dominant)
        pattern += pyramid(layerP, scale * 2.0);

        // Eye symbols (sparse)
        if(uSymbolDensity > 0.3) {
          pattern += eyeOfHorus(layerP + vec2(0.5, 0.25), scale * 1.0) * 0.6;
        }

        // Hieroglyphs (background detail)
        if(uSymbolDensity > 0.6) {
          pattern += hieroglyphs(layerP, scale * 3.0, uTime);
        }

        // Color for this layer (only animate if scrolling)
        float colorTimeOffset = uTime * 0.1 * smoothstep(0.0, 0.05, uScrollSpeed);
        float colorIndex = depth + colorTimeOffset + pattern * 0.3;
        vec3 layerColor = egyptianColor(colorIndex, uColorShift);

        // Layer opacity based on depth (far = faint, near = bright) - reduced for more black
        float opacity = 0.15 + depth * 0.4;

        // Add glow (reduced to avoid blinding brightness)
        float glow = pattern * uGlowIntensity * 0.4 * (1.0 + uAudioTreble * 0.3);
        layerColor *= (1.0 + glow);

        // Accumulate layer
        finalColor += layerColor * pattern * opacity;
      }

      // Atmospheric gradient (night sky to ground) - much darker for rich blacks
      vec3 skyGradient = mix(
        vec3(0.0, 0.0, 0.05),   // Near-black night sky
        vec3(0.02, 0.01, 0.0),  // Near-black ground
        uv.y
      );

      // Blend with background
      finalColor = mix(skyGradient, finalColor, clamp(length(finalColor), 0.0, 1.0));

      // Add stars (if in upper half) - only show when audio is active
      if(uv.y > 0.5 && uAudioTreble > 0.01) {
        vec2 starP = p * 20.0;
        vec2 starGrid = floor(starP);
        float starChance = hash(starGrid);
        if(starChance > 0.95) {
          vec2 starLocal = fract(starP) - 0.5;
          float star = smoothstep(0.05, 0.0, length(starLocal));
          finalColor += vec3(1.0, 0.9, 0.7) * star * uAudioTreble;
        }
      }

      // Vignette (stronger to add more black around edges)
      float vignette = 1.0 - length(p) * 0.8;
      vignette = max(0.0, vignette); // Clamp to prevent negative
      finalColor *= vignette;

      // Dancing Outline (audio-reactive edge glow)
      if(uDancingOutline > 0.5) {
        // Distance from edges (0 at edges, 1 at center)
        vec2 edgeDist = abs(p);
        float dist = max(edgeDist.x, edgeDist.y);

        // Create pulsing outline effect
        float bassWave = sin(uTime * 3.0 + dist * 5.0) * 0.5 + 0.5;
        float midWave = sin(uTime * 5.0 - dist * 8.0) * 0.5 + 0.5;
        float trebleWave = sin(uTime * 7.0 + dist * 12.0) * 0.5 + 0.5;

        // Combine audio bands with different wave patterns
        float audioMix = bassWave * uAudioBass * 0.4 +
                         midWave * uAudioMid * 0.3 +
                         trebleWave * uAudioTreble * 0.3;

        // Edge glow (bright at edges, fades inward)
        float edgeGlow = smoothstep(0.95, 1.0, dist) * (0.5 + audioMix);

        // Animated color cycling for the outline
        float outlineHue = mod(uColorShift + uTime * 0.1 + dist * 0.5, 1.0);
        vec3 outlineColor = egyptianColor(outlineHue, 0.0);

        // Apply outline
        finalColor += outlineColor * edgeGlow * 2.0;
      }

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

let sacredGeometryShaderMaterial = null;
let sacredGeometryShaderMaterials = []; // For skybox

// Fractal Mandelbrot/Julia shader - Classic psychedelic fractals
const fractalShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uZoom;
    uniform vec2 uPan;
    uniform float uMaxIterations;
    uniform float uColorShift;
    uniform float uJuliaMode;
    uniform vec2 uJuliaC;
    uniform float uAudioBass;
    uniform float uAudioMid;
    uniform float uAudioTreble;
    uniform vec2 uResolution;
    varying vec2 vUv;

    vec3 palette(float t) {
      t = mod(t + uColorShift, 1.0);
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.0, 0.33, 0.67);
      return a + b * cos(6.28318 * (c * t + d));
    }

    void main() {
      vec2 uv = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
      vec2 z = (uv * uZoom.x) + uPan;
      vec2 c = uJuliaMode > 0.5 ? uJuliaC : z;
      if (uJuliaMode > 0.5) z = uv * uZoom.y;

      float iterations = 0.0;
      float maxIter = uMaxIterations;

      for(float i = 0.0; i < 200.0; i++) {
        if(i >= maxIter) break;
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if(dot(z, z) > 4.0) break;
        iterations++;
      }

      float t = iterations / maxIter;
      t = sqrt(t); // Smooth coloring

      vec3 color = palette(t * (1.0 + uAudioMid * 0.5));
      color *= 1.0 + uAudioBass * 0.3;

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

// Ray Marching shader - 3D volumetric SDF rendering
const rayMarchShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uCameraPos;
    uniform float uShapeType;
    uniform float uMorphAmount;
    uniform float uDensity;
    uniform float uAbsorption;
    uniform float uColorShift;
    uniform float uAudioBass;
    uniform float uAudioMid;
    uniform float uAudioTreble;
    varying vec2 vUv;

    #define MAX_STEPS 64
    #define MAX_DIST 100.0
    #define EPSILON 0.001

    // SDF primitives
    float sdSphere(vec3 p, float r) { return length(p) - r; }
    float sdBox(vec3 p, vec3 b) {
      vec3 q = abs(p) - b;
      return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
    }
    float sdTorus(vec3 p, vec2 t) {
      vec2 q = vec2(length(p.xz) - t.x, p.y);
      return length(q) - t.y;
    }

    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    float sceneSDF(vec3 p) {
      float angle = uTime * 0.3 + uAudioBass * 2.0;
      float ca = cos(angle);
      float sa = sin(angle);
      mat3 rot = mat3(ca, 0, sa, 0, 1, 0, -sa, 0, ca);
      vec3 rp = rot * p;

      float d1 = sdSphere(rp, 1.0 + 0.2 * sin(uTime + uAudioMid * 3.0));
      float d2 = sdBox(rp, vec3(0.8));
      float d3 = sdTorus(rp, vec2(1.0, 0.3));

      float result;
      if (uShapeType < 0.5) result = mix(d1, d2, uMorphAmount);
      else if (uShapeType < 1.5) result = mix(d2, d3, uMorphAmount);
      else result = mix(d3, d1, uMorphAmount);

      return result;
    }

    vec3 calcNormal(vec3 p) {
      vec2 e = vec2(EPSILON, 0.0);
      return normalize(vec3(
        sceneSDF(p + e.xyy) - sceneSDF(p - e.xyy),
        sceneSDF(p + e.yxy) - sceneSDF(p - e.yxy),
        sceneSDF(p + e.yyx) - sceneSDF(p - e.yyx)
      ));
    }

    void main() {
      vec2 uv = (vUv - 0.5) * 2.0;
      vec3 ro = uCameraPos;
      vec3 rd = normalize(vec3(uv, -1.5));

      float t = 0.0;
      vec3 color = vec3(0.0);
      float density = 0.0;

      for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * t;
        float d = sceneSDF(p);

        if (abs(d) < EPSILON) {
          vec3 normal = calcNormal(p);
          vec3 lightDir = normalize(vec3(2, 3, 4) - p);
          float diff = max(dot(normal, lightDir), 0.0);
          float spec = pow(max(dot(normal, normalize(lightDir - rd)), 0.0), 32.0);

          float hue = fract(uColorShift + t * 0.1 + uAudioBass * 0.3);
          vec3 baseColor = hsv2rgb(vec3(hue, 0.7, 0.8));
          color = baseColor * (diff + 0.2) + vec3(spec);
          break;
        }

        if (d < 0.5) {
          float sampleDensity = uDensity * (0.5 - d);
          density += sampleDensity * (1.0 - density);
          float hue = fract(uColorShift + t * 0.05);
          color += hsv2rgb(vec3(hue, 0.8, 0.6)) * sampleDensity * 0.1;
        }

        t += max(abs(d) * 0.5, 0.01);
        if (t > MAX_DIST) break;
      }

      color *= exp(-density * uAbsorption);
      if (density < 0.01 && length(color) < 0.01) {
        float bg = length(uv) * 0.3;
        color = vec3(0.05 + bg * 0.1, 0.05 + bg * 0.15, 0.1 + bg * 0.2);
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

// Liquid Simulation shader - Metaball fluid dynamics
const liquidSimShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uBlobCount;
    uniform float uThreshold;
    uniform float uViscosity;
    uniform float uGravity;
    uniform float uColorShift;
    uniform float uSurfaceTension;
    uniform float uAudioBass;
    uniform float uAudioMid;
    uniform float uAudioTreble;
    varying vec2 vUv;

    #define PI 3.14159265359

    float hash(float n) { return fract(sin(n) * 43758.5453123); }

    // HDR color palette
    vec3 hdrColor(float t, float hueShift, float luminosity) {
      t = mod(t + hueShift, 1.0);
      vec3 color;

      if(t < 0.16) {
        color = mix(vec3(0.0, 0.5, 1.5), vec3(0.5, 1.5, 1.5), t / 0.16); // Deep blue to cyan
      } else if(t < 0.33) {
        color = mix(vec3(0.5, 1.5, 1.5), vec3(0.0, 1.5, 0.5), (t - 0.16) / 0.17); // Cyan to turquoise
      } else if(t < 0.5) {
        color = mix(vec3(0.0, 1.5, 0.5), vec3(1.5, 1.0, 0.0), (t - 0.33) / 0.17); // Turquoise to gold
      } else if(t < 0.66) {
        color = mix(vec3(1.5, 1.0, 0.0), vec3(1.5, 0.3, 0.0), (t - 0.5) / 0.16); // Gold to orange
      } else if(t < 0.83) {
        color = mix(vec3(1.5, 0.3, 0.0), vec3(1.5, 0.0, 0.8), (t - 0.66) / 0.17); // Orange to magenta
      } else {
        color = mix(vec3(1.5, 0.0, 0.8), vec3(0.0, 0.5, 1.5), (t - 0.83) / 0.17); // Magenta to blue
      }

      return color * luminosity;
    }

    void main() {
      vec2 uv = (vUv - 0.5) * 2.0;

      // Metaball field calculation
      float field = 0.0;
      vec2 gradient = vec2(0.0);

      int blobCount = int(uBlobCount);
      for (int i = 0; i < 16; i++) {
        if (i >= blobCount) break;

        float seed = float(i);

        // Lissajous curve parameters with more variation
        vec2 freq = vec2(0.5 + hash(seed) * 1.0, 0.4 + hash(seed + 10.0) * 1.2);
        float phase = hash(seed + 20.0) * PI * 2.0;
        float speed = 0.2 + hash(seed + 30.0) * 0.6;

        // Adjust speed by viscosity (higher viscosity = slower)
        speed *= (2.0 - uViscosity);

        // Audio-reactive phase modulation
        float audioPhase = uAudioMid * PI * 0.5;

        // Blob position using Lissajous curves
        vec2 pos;
        pos.x = sin(uTime * speed * freq.x + phase + audioPhase) * 0.8;
        pos.y = cos(uTime * speed * freq.y + phase * 1.3) * 0.7;

        // Gravity influence
        float gravityOffset = uGravity * sin(uTime * speed * 0.5 + seed) * 0.4;
        pos.y -= gravityOffset;

        // Audio-reactive radius
        float radiusBase = 0.2 + 0.15 * sin(uTime * speed * 1.5 + seed);
        float radius = radiusBase * (1.0 + uAudioBass * 0.8);

        // Distance to blob
        vec2 toBlob = uv - pos;
        float d = length(toBlob);

        // Metaball contribution (inverse square falloff)
        float influence = (radius * radius) / (d * d + 0.001);
        field += influence;

        // Gradient for edge detection
        gradient += toBlob * influence / (d + 0.001);
      }

      // HDR surface rendering with edge glow
      float surfaceThreshold = uThreshold;
      float edgeWidth = uSurfaceTension * 0.3;

      // Surface intensity with smooth edge
      float surfaceIntensity = smoothstep(surfaceThreshold - edgeWidth, surfaceThreshold + edgeWidth, field);

      // Edge detection using gradient magnitude
      float edgeMagnitude = length(gradient);
      float edgeGlow = pow(1.0 - surfaceIntensity, 3.0) * smoothstep(0.0, 2.0, edgeMagnitude);
      edgeGlow *= 2.0 + uAudioTreble * 3.0; // HDR boost

      // Base color from field density
      float colorIndex = fract(field * 0.08 + uTime * 0.05);
      vec3 baseColor = hdrColor(colorIndex, uColorShift, 1.5);

      // Surface specular highlight
      float specular = pow(surfaceIntensity, 8.0) * 2.0;
      vec3 specularColor = hdrColor(colorIndex + 0.5, uColorShift, 3.0);

      // Caustics pattern (light refraction simulation)
      float causticScale = 8.0;
      float caustic1 = sin(field * causticScale + uTime * 2.0) * 0.5 + 0.5;
      float caustic2 = sin(field * causticScale * 1.3 - uTime * 1.5 + 2.0) * 0.5 + 0.5;
      float causticPattern = min(caustic1, caustic2);
      causticPattern = pow(causticPattern, 2.0) * surfaceIntensity;
      causticPattern *= 1.5 + uAudioTreble * 2.0;

      vec3 causticColor = hdrColor(colorIndex + 0.3, uColorShift, 2.0);

      // Subsurface scattering effect
      float subsurface = pow(surfaceIntensity, 0.5) * (1.0 - surfaceIntensity) * 0.8;
      vec3 subsurfaceColor = hdrColor(colorIndex + 0.15, uColorShift, 1.0);

      // Combine all lighting components
      vec3 finalColor = vec3(0.0);
      finalColor += baseColor * surfaceIntensity;
      finalColor += specularColor * specular;
      finalColor += causticColor * causticPattern;
      finalColor += subsurfaceColor * subsurface;

      // Edge glow (bloom-like effect)
      vec3 glowColor = hdrColor(colorIndex + 0.2, uColorShift, 2.5);
      finalColor += glowColor * edgeGlow;

      // Depth-based ambient occlusion
      float ao = smoothstep(0.0, 2.0, field) * 0.3;
      finalColor *= (1.0 - ao);

      // Vignette
      float vignette = 1.0 - length(uv) * 0.25;
      finalColor *= vignette;

      // Audio-reactive pulsing
      float pulse = 1.0 + sin(uTime * 3.0 + field * 5.0) * 0.08 * uAudioMid;
      finalColor *= pulse;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

// Kaleidoscope shader - Radial mirror symmetry
const kaleidoscopeShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uSegments;
    uniform float uRotation;
    uniform float uZoom;
    uniform float uColorShift;
    uniform float uAudioBass;
    uniform float uAudioMid;
    uniform float uAudioTreble;
    varying vec2 vUv;

    #define PI 3.14159265359
    #define TWO_PI 6.28318530718

    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
      vec2 uv = (vUv - 0.5) * 2.0;

      // Zoom
      uv /= uZoom;

      // Convert to polar coordinates
      float dist = length(uv);
      float angle = atan(uv.y, uv.x) + uRotation;

      // Apply kaleidoscope effect
      float segmentAngle = TWO_PI / uSegments;
      angle = mod(angle, segmentAngle);

      // Mirror effect
      if (mod(floor((atan(uv.y, uv.x) + uRotation) / segmentAngle), 2.0) > 0.5) {
        angle = segmentAngle - angle;
      }

      // Convert back to cartesian
      vec2 kaleido = vec2(cos(angle), sin(angle)) * dist;

      // Generate pattern based on position
      float pattern = sin(kaleido.x * 10.0 + uTime) * cos(kaleido.y * 10.0 + uTime);
      pattern += sin(dist * 20.0 - uTime * 2.0) * 0.5;
      pattern = (pattern + 1.0) * 0.5;

      // Audio reactive modulation
      pattern += uAudioBass * 0.3 * sin(dist * 5.0);
      pattern = clamp(pattern, 0.0, 1.0);

      // Color
      float hue = fract(uColorShift + dist * 0.2 + uTime * 0.1);
      float sat = 0.6 + uAudioMid * 0.4;
      float val = 0.7 + pattern * 0.3 + uAudioTreble * 0.3;

      vec3 color = hsv2rgb(vec3(hue, sat, val));

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

// Cellular Automata shader - Conway's Life with ping-pong rendering
const cellularAutomataShader = {
  computeVertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  computeFragmentShader: `
    uniform sampler2D uStateTexture;
    uniform vec2 uResolution;
    uniform vec4 uBirthRules;
    uniform vec4 uSurviveRules;
    varying vec2 vUv;

    void main() {
      vec2 texel = 1.0 / uResolution;
      float center = texture2D(uStateTexture, vUv).r;

      // Count Moore neighborhood (8 neighbors)
      float neighbors = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          if (x == 0 && y == 0) continue;
          vec2 offset = vec2(float(x), float(y)) * texel;
          neighbors += texture2D(uStateTexture, vUv + offset).r;
        }
      }

      float newState = 0.0;

      if (center > 0.5) {
        // Cell is alive - check survive rules
        if (neighbors == uSurviveRules.x || neighbors == uSurviveRules.y ||
            neighbors == uSurviveRules.z || neighbors == uSurviveRules.w) {
          newState = 1.0;
        }
      } else {
        // Cell is dead - check birth rules
        if (neighbors == uBirthRules.x || neighbors == uBirthRules.y ||
            neighbors == uBirthRules.z || neighbors == uBirthRules.w) {
          newState = 1.0;
        }
      }

      gl_FragColor = vec4(newState, newState, newState, 1.0);
    }
  `,
  displayVertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  displayFragmentShader: `
    uniform sampler2D uStateTexture;
    uniform float uTime;
    uniform float uColorShift;
    uniform float uCellSize;
    uniform bool uShowGrid;
    uniform float uAudioBass;
    uniform float uAudioMid;
    uniform float uAudioTreble;
    uniform vec2 uResolution;
    varying vec2 vUv;

    #define PI 3.14159265359

    // HDR color palette
    vec3 hdrColor(float t, float hueShift, float luminosity) {
      t = mod(t + hueShift, 1.0);
      vec3 color;

      if(t < 0.16) {
        color = mix(vec3(1.5, 0.0, 0.8), vec3(1.5, 0.5, 0.0), t / 0.16); // Magenta to orange
      } else if(t < 0.33) {
        color = mix(vec3(1.5, 0.5, 0.0), vec3(1.5, 1.5, 0.0), (t - 0.16) / 0.17); // Orange to yellow
      } else if(t < 0.5) {
        color = mix(vec3(1.5, 1.5, 0.0), vec3(0.0, 1.5, 0.8), (t - 0.33) / 0.17); // Yellow to cyan
      } else if(t < 0.66) {
        color = mix(vec3(0.0, 1.5, 0.8), vec3(0.0, 0.5, 1.5), (t - 0.5) / 0.16); // Cyan to blue
      } else if(t < 0.83) {
        color = mix(vec3(0.0, 0.5, 1.5), vec3(1.0, 0.0, 1.5), (t - 0.66) / 0.17); // Blue to purple
      } else {
        color = mix(vec3(1.0, 0.0, 1.5), vec3(1.5, 0.0, 0.8), (t - 0.83) / 0.17); // Purple to magenta
      }

      return color * luminosity;
    }

    void main() {
      vec2 texel = 1.0 / uResolution;
      float state = texture2D(uStateTexture, vUv).r;

      // Sample neighbors for edge detection and glow
      float neighbors = 0.0;
      float neighborSum = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          if (x == 0 && y == 0) continue;
          vec2 offset = vec2(float(x), float(y)) * texel;
          float n = texture2D(uStateTexture, vUv + offset).r;
          neighborSum += n;
          if (n > 0.5) neighbors += 1.0;
        }
      }

      // Edge detection - alive cells with dead neighbors glow
      float edgeFactor = 0.0;
      if (state > 0.5 && neighbors < 8.0) {
        edgeFactor = (8.0 - neighbors) / 8.0;
      }

      vec3 finalColor = vec3(0.0);

      if (state > 0.5) {
        // Alive cell - HDR glow based on neighbor density
        float density = neighbors / 8.0;

        // Color varies by position and density
        float colorIndex = fract(uColorShift + vUv.x * 0.2 + vUv.y * 0.2 + density * 0.3);
        vec3 cellColor = hdrColor(colorIndex, uColorShift, 2.0 + uAudioBass * 1.5);

        // Pulsing effect based on time and neighbors
        float pulse = 1.0 + sin(uTime * 2.0 + neighbors * 0.5) * 0.15 * uAudioMid;
        cellColor *= pulse;

        // Edge glow (bloom-like)
        float glowIntensity = pow(edgeFactor, 0.8) * (2.0 + uAudioTreble * 2.0);
        vec3 glowColor = hdrColor(colorIndex + 0.2, uColorShift, 3.0);
        cellColor += glowColor * glowIntensity;

        // Inner illumination based on neighbor count
        float innerGlow = smoothstep(3.0, 6.0, neighbors) * 0.5;
        cellColor *= (1.0 + innerGlow);

        finalColor = cellColor;
      } else {
        // Dead cell - dark with subtle glow from nearby alive cells
        float ambientGlow = neighborSum * 0.02;
        float colorIndex = fract(uColorShift + vUv.x * 0.15);
        vec3 ambientColor = hdrColor(colorIndex, uColorShift, 0.3);
        finalColor = ambientColor * ambientGlow;

        // Very dark base color
        finalColor += vec3(0.0, 0.0, 0.05);
      }

      // Enhanced grid with HDR glow
      if (uShowGrid) {
        vec2 pixel = vUv * uResolution;
        vec2 cellPos = pixel / uCellSize;
        vec2 gridCoord = fract(cellPos);

        // Grid line thickness
        float lineWidth = 0.05;
        float gridLine = 0.0;

        if (gridCoord.x < lineWidth || gridCoord.x > 1.0 - lineWidth ||
            gridCoord.y < lineWidth || gridCoord.y > 1.0 - lineWidth) {
          gridLine = 1.0;
        }

        // Grid glow at intersections
        if (gridLine > 0.0) {
          float intersectionDist = min(
            min(gridCoord.x, 1.0 - gridCoord.x),
            min(gridCoord.y, 1.0 - gridCoord.y)
          );
          float intersectionGlow = smoothstep(0.1, 0.0, intersectionDist) * 0.5;

          float colorIndex = fract(uColorShift + cellPos.x * 0.05 + cellPos.y * 0.05);
          vec3 gridColor = hdrColor(colorIndex, uColorShift, 0.3 + intersectionGlow);

          finalColor = mix(finalColor, finalColor * 0.6 + gridColor * 0.4, gridLine);
        }
      }

      // Scanline effect for retro feel
      float scanline = sin(vUv.y * uResolution.y * PI) * 0.03;
      finalColor *= (1.0 + scanline);

      // Vignette
      vec2 center = vUv - 0.5;
      float vignette = 1.0 - dot(center, center) * 0.3;
      finalColor *= vignette;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

// Flow Field shader - Enhanced HDR flowing energy field with curl noise
const flowFieldShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uScale;
    uniform float uSpeed;
    uniform float uStrength;
    uniform float uColorShift;
    uniform float uParticleDensity;
    uniform float uAudioBass;
    uniform float uAudioMid;
    uniform float uAudioTreble;
    uniform float uTimeScale;
    varying vec2 vUv;

    #define PI 3.14159265359

    // Simplex noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    // Curl noise for swirling flow
    vec2 curlNoise(vec2 p) {
      float eps = 0.01;
      float n1 = snoise(vec2(p.x, p.y + eps));
      float n2 = snoise(vec2(p.x, p.y - eps));
      float n3 = snoise(vec2(p.x + eps, p.y));
      float n4 = snoise(vec2(p.x - eps, p.y));
      float a = (n1 - n2) / (2.0 * eps);
      float b = (n3 - n4) / (2.0 * eps);
      return vec2(a, -b);
    }

    // HDR color with luminosity boost
    vec3 hdrColor(float t, float hueShift, float luminosity) {
      t = mod(t + hueShift, 1.0);
      vec3 color;

      // Enhanced palette with deeper colors
      if(t < 0.16) {
        color = mix(vec3(1.0, 0.0, 0.5), vec3(1.5, 0.2, 0.0), t / 0.16); // Magenta to orange-red
      } else if(t < 0.33) {
        color = mix(vec3(1.5, 0.2, 0.0), vec3(1.5, 1.0, 0.0), (t - 0.16) / 0.17); // Orange-red to yellow
      } else if(t < 0.5) {
        color = mix(vec3(1.5, 1.0, 0.0), vec3(0.0, 1.5, 0.3), (t - 0.33) / 0.17); // Yellow to cyan
      } else if(t < 0.66) {
        color = mix(vec3(0.0, 1.5, 0.3), vec3(0.0, 0.3, 1.5), (t - 0.5) / 0.16); // Cyan to blue
      } else if(t < 0.83) {
        color = mix(vec3(0.0, 0.3, 1.5), vec3(0.8, 0.0, 1.5), (t - 0.66) / 0.17); // Blue to purple
      } else {
        color = mix(vec3(0.8, 0.0, 1.5), vec3(1.0, 0.0, 0.5), (t - 0.83) / 0.17); // Purple to magenta
      }

      return color * luminosity;
    }

    void main() {
      vec2 uv = (vUv - 0.5) * 2.0;

      // Time with audio influence and configurable scale
      float time = uTime * uTimeScale * uSpeed * (1.0 + uAudioMid * 0.5);

      // Multi-octave flow field with audio-reactive scale
      float scale = uScale * (1.0 + uAudioBass * 0.3);
      vec2 pos = uv * scale;

      // Layer multiple octaves of curl noise
      vec2 flow = vec2(0.0);
      float amp = 1.0;
      for(int i = 0; i < 3; i++) {
        float octave = pow(2.0, float(i));
        vec2 curlVel = curlNoise(pos * octave + time * 0.3);
        flow += curlVel * amp * uStrength;
        amp *= 0.5;
      }

      // Stream line integration
      vec3 finalColor = vec3(0.0);
      float totalWeight = 0.0;

      // Trace particles along flow lines with HDR glow
      vec2 particlePos = uv;
      int steps = int(mix(30.0, 80.0, uParticleDensity));
      float stepSize = 0.015;

      for(int i = 0; i < 80; i++) {
        if(i >= steps) break;

        float t = float(i) / float(steps);

        // Sample flow field at particle position
        vec2 flowSample = curlNoise(particlePos * scale + time * 0.3) * uStrength;

        // Move particle
        particlePos += flowSample * stepSize;

        // Calculate glow based on distance from current UV
        float dist = length(particlePos - uv);
        float glow = exp(-dist * mix(15.0, 40.0, uParticleDensity));
        glow = pow(glow, 0.8); // Softer falloff

        // HDR color from flow field
        float flowMagnitude = length(flowSample);
        float colorIndex = fract(flowMagnitude * 0.5 + t * 0.3 + time * 0.1);
        vec3 streamColor = hdrColor(colorIndex, uColorShift, 2.0 + uAudioTreble * 1.5);

        // Accumulate color with bloom-like glow
        float weight = glow * (1.0 - t * 0.3);
        finalColor += streamColor * weight;
        totalWeight += weight;
      }

      // Normalize and boost
      if(totalWeight > 0.0) {
        finalColor /= totalWeight;
        finalColor *= totalWeight * 0.5; // Preserve intensity
      }

      // Add ambient field visualization
      float flowVis = length(flow) * 0.15;
      vec3 ambientColor = hdrColor(flowVis + uColorShift, uColorShift, 0.3);
      finalColor += ambientColor;

      // Enhance with audio-reactive pulsing
      float pulse = 1.0 + sin(time * 2.0 + length(uv) * 5.0) * 0.1 * uAudioMid;
      finalColor *= pulse;

      // Vignette for depth
      float vignette = 1.0 - length(uv) * 0.2;
      finalColor *= vignette;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

// Mandelbulb Voxel Core shader - 3D fractal raymarching with glass shells
const mandelbulbShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    void main() {
      vUv = uv;
      // Calculate world position for proper 3D ray direction
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uPower;
    uniform float uIterations;
    uniform float uPalette;
    uniform float uShellThickness;
    uniform float uAudioBass;
    uniform float uAudioMid;
    uniform float uAudioTreble;
    uniform float uColorShift;
    uniform vec2 uResolution;
    uniform vec3 uCameraPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    #define PI 3.14159265359
    #define MAX_STEPS 128
    #define MAX_DIST 50.0
    #define SURF_DIST 0.001

    // Rotation matrix
    mat2 rot(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }

    // 4 color palettes (Fiery, Icy Blue, Psychedelic, Grayscale)
    vec3 getPalette(float t, float paletteIndex) {
      t = fract(t + uColorShift);
      vec3 color;

      if (paletteIndex < 0.5) {
        // Palette 0: Fiery (red-orange-yellow)
        if (t < 0.33) {
          color = mix(vec3(1.5, 0.0, 0.0), vec3(1.5, 0.5, 0.0), t / 0.33);
        } else if (t < 0.66) {
          color = mix(vec3(1.5, 0.5, 0.0), vec3(1.5, 1.5, 0.0), (t - 0.33) / 0.33);
        } else {
          color = mix(vec3(1.5, 1.5, 0.0), vec3(1.5, 0.0, 0.0), (t - 0.66) / 0.34);
        }
      } else if (paletteIndex < 1.5) {
        // Palette 1: Icy Blue (cyan-blue-purple)
        if (t < 0.33) {
          color = mix(vec3(0.0, 1.5, 1.5), vec3(0.0, 0.5, 1.5), t / 0.33);
        } else if (t < 0.66) {
          color = mix(vec3(0.0, 0.5, 1.5), vec3(0.8, 0.0, 1.5), (t - 0.33) / 0.33);
        } else {
          color = mix(vec3(0.8, 0.0, 1.5), vec3(0.0, 1.5, 1.5), (t - 0.66) / 0.34);
        }
      } else if (paletteIndex < 2.5) {
        // Palette 2: Psychedelic (full rainbow)
        color = 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
        color *= 2.0; // HDR boost
      } else {
        // Palette 3: Grayscale (white-gray-black)
        float val = 0.5 + 0.5 * cos(6.28318 * t);
        color = vec3(val * 1.5);
      }

      return color;
    }

    // Mandelbulb SDF with audio-reactive power
    vec2 sdfMandelbulb(vec3 pos) {
      vec3 z = pos;
      float dr = 1.0;
      float r = 0.0;
      float power = uPower + uAudioBass * 2.0;
      float maxIter = 0.0;

      for (int i = 0; i < 50; i++) {
        if (float(i) >= uIterations) break;
        r = length(z);
        if (r > 4.0) break;

        // Mandelbulb formula
        dr = power * pow(r, power - 1.0) * dr + 1.0;
        float theta = acos(z.z / (r + 1e-5));
        float phi = atan(z.y, z.x);
        float zr = pow(r, power);
        theta *= power;
        phi *= power;
        z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
        z += pos;
        maxIter = float(i);
      }

      return vec2(0.5 * log(r) * r / dr, maxIter);
    }

    // Domain repetition for infinite grid
    vec3 opRep(vec3 p, vec3 c) {
      return mod(p + 0.5 * c, c) - 0.5 * c;
    }

    // Scene SDF - combines Mandelbulb + glass shell + grid
    vec4 map(vec3 p) {
      // Oscillate fractal space rotation instead of continuous rotation (slowed down)
      float globalPhase = sin(uTime * 0.05) * 0.5 + uAudioMid * 0.3;
      p.xz *= rot(globalPhase);
      p.xy *= rot(sin(uTime * 0.04) * 0.3);

      // Additional audio-reactive rotation
      p.yz *= rot(uAudioBass * 0.5);

      // Domain repetition - infinite cube grid
      vec3 cellSize = vec3(6.0);
      vec3 pRep = opRep(p, cellSize);

      // Mandelbulb fractal (scaled smaller)
      vec2 bulb = sdfMandelbulb(pRep * 0.65);
      float dBulb = bulb.x;
      float iter = bulb.y;

      // Thin glass shell around each cell (audio-reactive thickness)
      vec3 cellPos = p - round(p / cellSize) * cellSize;
      float shellThickness = uShellThickness + uAudioTreble * 0.02;
      float dShell = abs(length(cellPos) - 2.5) - shellThickness;

      // Material ID: 1=Mandelbulb, 2=Shell, 3=Background
      float matID = 1.0;
      float d = dBulb;

      if (dShell < d) {
        d = dShell;
        matID = 2.0;
      }

      return vec4(d, matID, iter, 0.0);
    }

    // Raymarching
    vec4 raymarch(vec3 ro, vec3 rd) {
      float dO = 0.0;
      vec4 result = vec4(0.0);

      // Jittered starting point for better detail
      dO += fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453) * 0.1;

      for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * dO;
        vec4 hit = map(p);
        float dS = hit.x;

        if (abs(dS) < SURF_DIST) {
          result = vec4(dO, hit.yzw);
          break;
        }

        dO += dS * 0.5; // Slower marching for better detail

        if (dO > MAX_DIST) break;
      }

      return result;
    }

    // Normal calculation
    vec3 getNormal(vec3 p) {
      vec2 e = vec2(0.001, 0.0);
      float d = map(p).x;
      vec3 n = d - vec3(
        map(p - e.xyy).x,
        map(p - e.yxy).x,
        map(p - e.yyx).x
      );
      return normalize(n);
    }

    void main() {
      // Setup ray based on UV - simpler approach that always works
      vec2 uv = (vUv - 0.5) * 2.0;
      uv.x *= uResolution.x / uResolution.y;

      // Camera setup - positioned to see the fractals
      vec3 ro = vec3(0.0, 0.0, 12.0 - uAudioMid * 3.0);
      vec3 rd = normalize(vec3(uv, -1.5));

      // Apply camera rotation - oscillate instead of continuous rotation
      float camPhase = sin(uTime * 0.08) * 0.6;
      rd.xz *= rot(camPhase);
      rd.yz *= rot(sin(uTime * 0.06) * 0.25);

      // Raymarch the scene
      vec4 march = raymarch(ro, rd);
      float d = march.x;
      float matID = march.y;
      float iter = march.z;

      vec3 col = vec3(0.0);

      if (d < MAX_DIST) {
        vec3 p = ro + rd * d;
        vec3 n = getNormal(p);

        // Lighting
        vec3 lightPos = ro + vec3(3.0, 5.0, 2.0);
        vec3 l = normalize(lightPos - p);
        float diff = max(dot(n, l), 0.0);
        float spec = pow(max(dot(reflect(-l, n), -rd), 0.0), 32.0);

        if (matID < 1.5) {
          // Mandelbulb fractal material
          float colorIndex = iter / uIterations + uTime * 0.1;
          vec3 baseColor = getPalette(colorIndex, uPalette);

          // Fresnel effect
          float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);

          col = baseColor * (0.3 + diff * 0.7);
          col += baseColor * fresnel * 2.0;
          col += vec3(1.5) * spec * 2.0;

          // Audio-reactive pulsing
          col *= 1.0 + uAudioBass * 0.5;

        } else if (matID < 2.5) {
          // Glass shell material (thin, translucent)
          float colorIndex = length(p) * 0.1 + uTime * 0.05;
          vec3 glassColor = getPalette(colorIndex, uPalette) * 0.3;

          float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 2.0);

          col = glassColor * (0.1 + diff * 0.2);
          col += glassColor * fresnel * 1.5;
          col += vec3(1.0) * spec;

          // Transparency (less opaque)
          col *= 0.5 + fresnel * 0.5;

        } else {
          // Neon grid fallback (pulsing background)
          float gridPulse = sin(uTime * 2.0 + d * 0.5) * 0.5 + 0.5;
          col = getPalette(d * 0.05 + uTime * 0.1, uPalette) * gridPulse * 0.2;
        }

        // Atmospheric depth fog
        float fog = exp(-d * 0.05);
        vec3 fogColor = getPalette(uTime * 0.05, uPalette) * 0.1;
        col = mix(fogColor, col, fog);

      } else {
        // Background - pulsing gradient
        float bgGradient = length(vUv - 0.5) * 2.0 + sin(uTime) * 0.1;
        col = getPalette(bgGradient + uTime * 0.05, uPalette) * 0.15;
      }

      // Vignette
      float vignette = 1.0 - dot(vUv - 0.5, vUv - 0.5) * 0.5;
      col *= vignette;

      // Debug: Show red if shader is running but no hits
      if (d >= MAX_DIST && length(col) < 0.1) {
        col = vec3(0.1, 0.0, 0.0); // Very dark red to show shader is working
      }

      gl_FragColor = vec4(col, 1.0);
    }
  `
};

let fractalShaderMaterial = null;
let fractalShaderMaterials = []; // For skybox
let rayMarchShaderMaterial = null;
let rayMarchShaderMaterials = []; // For skybox
let liquidSimShaderMaterial = null;
let liquidSimShaderMaterials = []; // For skybox
let kaleidoscopeShaderMaterial = null;
let kaleidoscopeShaderMaterials = []; // For skybox
let cellularAutomataComputeMaterial = null;
let cellularAutomataDisplayMaterial = null;
let cellularRenderTargetA = null;
let cellularRenderTargetB = null;
let cellularCurrentTarget = 'A';
let cellularComputeScene = null;
let cellularComputeMesh = null;
let cellularFrameCount = 0;
let flowFieldShaderMaterial = null;
let flowFieldShaderMaterials = []; // For skybox
let mandelbulbShaderMaterial = null;
let mandelbulbShaderMaterials = []; // For skybox

// Phase 11.7.50: Export backgroundMesh for external access (HUD scale control)
export function getBackgroundMesh() {
  return backgroundMesh;
}

export function initVisual(scene) {
  // Phase 13.6.0: Calculate fullscreen size based on camera FOV and position
  const fov = 75 * (Math.PI / 180); // convert to radians
  const distance = 10; // background plane is at z = -10, camera at z = 0-5
  const height = 2 * distance * Math.tan(fov / 2);
  const aspect = window.innerWidth / window.innerHeight;
  const width = height * aspect;
  const geometry = new THREE.PlaneGeometry(width, height);

  // Phase 13.6.0: Create Acid Empire shader material
  acidShaderMaterial = new THREE.ShaderMaterial({
    vertexShader: acidEmpireShader.vertexShader,
    fragmentShader: acidEmpireShader.fragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
      uScrollX: { value: 0.0 },
      uScrollY: { value: 0.0 },
      uFreq: { value: 1.0 },
      uShapeMorph: { value: 0.55 },
      uPulseStrength: { value: 0.0 },
      uHighStrength: { value: 0.0 },
      uColorShift: { value: 0.0 },
      uColorDrive: { value: 1.0 },
      uFeedback: { value: 0.0 },
      uGlitch: { value: 0.0 },
      uPortalWarp: { value: 0.0 },
      uSphereScale: { value: 1.0 },
      uInvert: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    }
  });

  // Phase 13.7.3: Create Voxel Wave raymarch shader material with PBR
  try {
    voxelWaveShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: voxelWaveShader.vertexShader,
      fragmentShader: voxelWaveShader.fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uAmplitude: { value: 0.28 },
        uFrequency: { value: 0.6 },
        uSpeed: { value: 1.0 },
        uCellSize: { value: 1.0 },
        uBaseHeight: { value: 0.35 },
        uColorShift: { value: 0.0 },
        uSpectralFlux: { value: 0.0 },
        uModWheel: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        cameraPosition: { value: new THREE.Vector3(0, 0, 5) },
        cameraMatrixWorld: { value: new THREE.Matrix4() }
      }
    });
    console.log("✅ Voxel Wave shader created successfully");
  } catch (error) {
    console.error("❌ Failed to create Voxel Wave shader:", error);
  }

  // Phase 13.29: Create Hyperbolic Tiling shader material
  try {
    hyperbolicTilingShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: hyperbolicTilingShader.vertexShader,
      fragmentShader: hyperbolicTilingShader.fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uPatternScale: { value: 4.0 },
        uPan: { value: new THREE.Vector2(0.0, 0.0) },
        uRotationSpeed: { value: 0.1 },
        uIterations: { value: 25 },
        uDensityScale: { value: 1.0 },
        uColorHueShift: { value: 0.0 },
        uGridIntensity: { value: 0.4 },
        uAudioBass: { value: 0.0 },
        uAudioMid: { value: 0.0 },
        uAudioTreble: { value: 0.0 },
        uAudioLevel: { value: 0.0 },
        uAudioReactivity: { value: 1.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uFaceIndex: { value: 0 },                                    // Phase 13.30: Skybox face index
        uRenderMode360: { value: state.skyboxRenderMode === '360' }  // Phase 13.30: 360 mode toggle
      }
    });
    console.log("✅ Hyperbolic Tiling shader created successfully");
  } catch (error) {
    console.error("❌ Failed to create Hyperbolic Tiling shader:", error);
  }

  // Luminous Tessellation shader material
  try {
    luminousShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: luminousTessellationShader.vertexShader,
      fragmentShader: luminousTessellationShader.fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uScale: { value: 3.0 },
        uSpeed: { value: 0.5 },
        uComplexity: { value: 0.5 },
        uColorShift: { value: 0.0 },
        uLuminosity: { value: 1.5 },
        uContrast: { value: 1.2 },
        uAudioBass: { value: 0.0 },
        uAudioMid: { value: 0.0 },
        uAudioTreble: { value: 0.0 },
        uWaveAmplitude: { value: 0.0 },
        uWaveFrequency: { value: 2.0 },
        uMorphIntensity: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      }
    });
    console.log("✅ Luminous Tessellation shader created successfully");
  } catch (error) {
    console.error("❌ Failed to create Luminous Tessellation shader:", error);
  }

  // Sacred Geometry shader material
  try {
    sacredGeometryShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: sacredGeometryShader.vertexShader,
      fragmentShader: sacredGeometryShader.fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uScrollSpeed: { value: 0.0 },
        uLayerCount: { value: 3.0 },
        uColorShift: { value: 0.0 },
        uSymbolDensity: { value: 0.5 },
        uGlowIntensity: { value: 1.0 },
        uPyramidScale: { value: 2.0 },
        uAudioBass: { value: 0.0 },
        uAudioMid: { value: 0.0 },
        uAudioTreble: { value: 0.0 },
        uDancingOutline: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      }
    });
    console.log("✅ Sacred Geometry shader created successfully");
  } catch (error) {
    console.error("❌ Failed to create Sacred Geometry shader:", error);
  }

  // Fractal shader material (Mandelbrot/Julia sets)
  try {
    fractalShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: fractalShader.vertexShader,
      fragmentShader: fractalShader.fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uZoom: { value: new THREE.Vector2(2.5, 2.5) },
        uPan: { value: new THREE.Vector2(0.0, 0.0) },
        uMaxIterations: { value: 100.0 },
        uColorShift: { value: 0.0 },
        uJuliaMode: { value: 0.0 },
        uJuliaC: { value: new THREE.Vector2(-0.7, 0.27) },
        uAudioBass: { value: 0.0 },
        uAudioMid: { value: 0.0 },
        uAudioTreble: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      }
    });
    console.log("✅ Fractal shader created successfully");
  } catch (error) {
    console.error("❌ Failed to create Fractal shader:", error);
  }

  // Ray Marching shader material
  try {
    rayMarchShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: rayMarchShader.vertexShader,
      fragmentShader: rayMarchShader.fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uCameraPos: { value: new THREE.Vector3(0, 0, 5) },
        uShapeType: { value: 0.0 },
        uMorphAmount: { value: 0.0 },
        uDensity: { value: 0.3 },
        uAbsorption: { value: 1.0 },
        uColorShift: { value: 0.0 },
        uAudioBass: { value: 0.0 },
        uAudioMid: { value: 0.0 },
        uAudioTreble: { value: 0.0 }
      }
    });
    console.log("✅ Ray Marching shader created successfully");
  } catch (error) {
    console.error("❌ Failed to create Ray Marching shader:", error);
  }

  // Liquid Simulation shader material
  try {
    liquidSimShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: liquidSimShader.vertexShader,
      fragmentShader: liquidSimShader.fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uBlobCount: { value: 8.0 },
        uThreshold: { value: 1.2 },
        uViscosity: { value: 0.5 },
        uGravity: { value: 0.3 },
        uColorShift: { value: 0.0 },
        uSurfaceTension: { value: 0.5 },
        uAudioBass: { value: 0.0 },
        uAudioMid: { value: 0.0 },
        uAudioTreble: { value: 0.0 }
      }
    });
    console.log("✅ Liquid Simulation shader created successfully");
  } catch (error) {
    console.error("❌ Failed to create Liquid Simulation shader:", error);
  }

  // Kaleidoscope shader material
  try {
    kaleidoscopeShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: kaleidoscopeShader.vertexShader,
      fragmentShader: kaleidoscopeShader.fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uSegments: { value: 8.0 },
        uRotation: { value: 0.0 },
        uZoom: { value: 1.0 },
        uColorShift: { value: 0.0 },
        uAudioBass: { value: 0.0 },
        uAudioMid: { value: 0.0 },
        uAudioTreble: { value: 0.0 }
      }
    });
    console.log("✅ Kaleidoscope shader created successfully");
  } catch (error) {
    console.error("❌ Failed to create Kaleidoscope shader:", error);
  }

  // Cellular Automata shader materials (compute + display)
  try {
    const caResolution = 256; // 256x256 grid

    // Create render targets for ping-pong buffering
    cellularRenderTargetA = new THREE.WebGLRenderTarget(caResolution, caResolution, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType
    });

    cellularRenderTargetB = new THREE.WebGLRenderTarget(caResolution, caResolution, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType
    });

    // Initialize with random pattern
    const initData = new Float32Array(caResolution * caResolution * 4);
    for (let i = 0; i < initData.length; i += 4) {
      const alive = Math.random() < 0.3 ? 1.0 : 0.0;
      initData[i] = alive;
      initData[i + 1] = alive;
      initData[i + 2] = alive;
      initData[i + 3] = 1.0;
    }

    const initTexture = new THREE.DataTexture(initData, caResolution, caResolution, THREE.RGBAFormat, THREE.FloatType);
    initTexture.needsUpdate = true;

    // Compute shader material (updates cell states)
    cellularAutomataComputeMaterial = new THREE.ShaderMaterial({
      vertexShader: cellularAutomataShader.computeVertexShader,
      fragmentShader: cellularAutomataShader.computeFragmentShader,
      uniforms: {
        uStateTexture: { value: initTexture },
        uResolution: { value: new THREE.Vector2(caResolution, caResolution) },
        uBirthRules: { value: new THREE.Vector4(3, 0, 0, 0) },
        uSurviveRules: { value: new THREE.Vector4(2, 3, 0, 0) }
      }
    });

    // Display shader material (renders colored cells)
    cellularAutomataDisplayMaterial = new THREE.ShaderMaterial({
      vertexShader: cellularAutomataShader.displayVertexShader,
      fragmentShader: cellularAutomataShader.displayFragmentShader,
      uniforms: {
        uStateTexture: { value: cellularRenderTargetA.texture },
        uTime: { value: 0.0 },
        uColorShift: { value: 0.0 },
        uCellSize: { value: 32.0 },
        uShowGrid: { value: true },
        uAudioBass: { value: 0.0 },
        uAudioMid: { value: 0.0 },
        uAudioTreble: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(caResolution, caResolution) }
      }
    });

    // Create compute scene and mesh (for offscreen rendering)
    cellularComputeScene = new THREE.Scene();
    const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const computeGeom = new THREE.PlaneGeometry(2, 2);
    cellularComputeMesh = new THREE.Mesh(computeGeom, cellularAutomataComputeMaterial);
    cellularComputeScene.add(cellularComputeMesh);

    console.log("✅ Cellular Automata shader created successfully");
  } catch (error) {
    console.error("❌ Failed to create Cellular Automata shader:", error);
  }

  // Flow Field shader material
  try {
    flowFieldShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: flowFieldShader.vertexShader,
      fragmentShader: flowFieldShader.fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uScale: { value: 4.0 },
        uSpeed: { value: 1.0 },
        uStrength: { value: 1.0 },
        uColorShift: { value: 0.0 },
        uParticleDensity: { value: 1.0 },
        uTimeScale: { value: 0.3 },
        uAudioBass: { value: 0.0 },
        uAudioMid: { value: 0.0 },
        uAudioTreble: { value: 0.0 }
      }
    });
    console.log("✅ Flow Field shader created successfully");
  } catch (error) {
    console.error("❌ Failed to create Flow Field shader:", error);
  }

  // Mandelbulb shader material
  try {
    mandelbulbShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: mandelbulbShader.vertexShader,
      fragmentShader: mandelbulbShader.fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uPower: { value: 8.0 },
        uIterations: { value: 16.0 },
        uPalette: { value: 0.0 },
        uShellThickness: { value: 0.02 },
        uColorShift: { value: 0.0 },
        uAudioBass: { value: 0.0 },
        uAudioMid: { value: 0.0 },
        uAudioTreble: { value: 0.0 },
        uCameraPosition: { value: new THREE.Vector3(0, 0, 0) },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      }
    });
    console.log("✅ Mandelbulb shader created successfully");
  } catch (error) {
    console.error("❌ Failed to create Mandelbulb shader:", error);
  }

  const material = new THREE.MeshBasicMaterial({ color: 0x111111 });
  backgroundMesh = new THREE.Mesh(geometry, material);
  backgroundMesh.position.z = -10; // push back behind everything
  scene.add(backgroundMesh);

  // Phase 13.6.2: Create skybox cube using 6 separate planes
  const skyboxSize = 100;
  const skyboxGroup = new THREE.Group();
  skyboxGroup.visible = false; // Hidden by default

  // Create 6 plane geometries for each face
  const planeGeometry = new THREE.PlaneGeometry(skyboxSize, skyboxSize);

  // Create 6 materials and 6 meshes
  skyboxMaterials = [];
  const skyboxMeshes = [];

  // Face 0: Right (Positive X) - rotated to face inward
  skyboxMaterials.push(new THREE.MeshBasicMaterial({ color: 0x111111 }));
  skyboxMeshes.push(new THREE.Mesh(planeGeometry, skyboxMaterials[0]));
  skyboxMeshes[0].position.set(skyboxSize / 2, 0, 0);
  skyboxMeshes[0].rotation.y = -Math.PI / 2;

  // Face 1: Left (Negative X)
  skyboxMaterials.push(new THREE.MeshBasicMaterial({ color: 0x111111 }));
  skyboxMeshes.push(new THREE.Mesh(planeGeometry, skyboxMaterials[1]));
  skyboxMeshes[1].position.set(-skyboxSize / 2, 0, 0);
  skyboxMeshes[1].rotation.y = Math.PI / 2;

  // Face 2: Top (Positive Y)
  skyboxMaterials.push(new THREE.MeshBasicMaterial({ color: 0x111111 }));
  skyboxMeshes.push(new THREE.Mesh(planeGeometry, skyboxMaterials[2]));
  skyboxMeshes[2].position.set(0, skyboxSize / 2, 0);
  skyboxMeshes[2].rotation.x = Math.PI / 2;

  // Face 3: Bottom (Negative Y)
  skyboxMaterials.push(new THREE.MeshBasicMaterial({ color: 0x111111 }));
  skyboxMeshes.push(new THREE.Mesh(planeGeometry, skyboxMaterials[3]));
  skyboxMeshes[3].position.set(0, -skyboxSize / 2, 0);
  skyboxMeshes[3].rotation.x = -Math.PI / 2;

  // Face 4: Front (Positive Z)
  skyboxMaterials.push(new THREE.MeshBasicMaterial({ color: 0x111111 }));
  skyboxMeshes.push(new THREE.Mesh(planeGeometry, skyboxMaterials[4]));
  skyboxMeshes[4].position.set(0, 0, skyboxSize / 2);
  skyboxMeshes[4].rotation.y = Math.PI;

  // Face 5: Back (Negative Z)
  skyboxMaterials.push(new THREE.MeshBasicMaterial({ color: 0x111111 }));
  skyboxMeshes.push(new THREE.Mesh(planeGeometry, skyboxMaterials[5]));
  skyboxMeshes[5].position.set(0, 0, -skyboxSize / 2);
  // No rotation needed, faces forward

  // Add all meshes to the group
  skyboxMeshes.forEach(mesh => skyboxGroup.add(mesh));

  skyboxMesh = skyboxGroup; // Store the group as skyboxMesh
  scene.add(skyboxMesh);

  // MMPA Unified Theory - Initialize the Heart/Vortex/Archetype visualization
  try {
    theoryRendererAPI = initTheoryRenderer(scene, {
      scale: 2.5,
      showWireframe: true,
      showEdgeSensors: false,
      autoRotate: true
    });

    // Expose API to window for HUD controls
    window.theoryRenderer = {
      setEnabled: (enabled) => {
        theoryModeEnabled = enabled;
        // Show/hide theory components
        if (theoryRendererAPI) {
          const chestahedron = theoryRendererAPI.getChestahedron();
          const vortex = theoryRendererAPI.getVortex();
          if (chestahedron) chestahedron.visible = enabled;
          if (vortex && vortex.group) vortex.group.visible = enabled;
        }
      },
      isEnabled: () => theoryModeEnabled,
      setScale: (scale) => theoryRendererAPI?.setScale(scale),
      toggleWireframe: () => theoryRendererAPI?.toggleWireframe(),
      toggleEdgeSensors: () => theoryRendererAPI?.toggleEdgeSensors(),
      setAutoRotate: (enabled) => theoryRendererAPI?.setAutoRotate(enabled),
      // Data logging functions
      startLogging: () => theoryRendererAPI?.startLogging(),
      stopLogging: () => theoryRendererAPI?.stopLogging(),
      clearLog: () => theoryRendererAPI?.clearLog(),
      exportData: (format) => theoryRendererAPI?.exportData(format),
      getLoggerStatus: () => theoryRendererAPI?.getLoggerStatus(),
      // Calibration functions
      calibrate: (stabilityScale, fluxNormalization) => {
        updateCalibration(stabilityScale, fluxNormalization);
        console.log(`🔧 Current metrics: stability=${getStabilityMetric().toFixed(3)}, flux=${getFluxMetric().toFixed(3)}`);
      },
      getMetrics: () => ({
        stability: getStabilityMetric(),
        flux: getFluxMetric(),
        phi: 1.618
      })
    };

    // Initialize with theory mode disabled (hidden by default)
    window.theoryRenderer.setEnabled(false);
    console.log("👁️ Unified Theory Renderer initialized (Heart/Vortex/Archetype) - Starting hidden");
  } catch (error) {
    console.error("👁️ Failed to initialize Theory Renderer:", error);
  }

  console.log("🖼️ Background plane + Skybox initialized (6 planes, Acid Empire ready)");
}

export function updateVisual(camera, mmpaVisuals = null) {
  if (!backgroundMesh) return;

  // MMPA Phase 2: Apply feature-based color shift if enabled
  let mmpaColorShift = 0.0;
  if (mmpaVisuals && state.mmpaFeatures?.enabled) {
    // Use the hue value (0-360) as a color shift parameter
    mmpaColorShift = mmpaVisuals.hue / 360.0; // Normalize to 0-1
  }

  // Phase 13.6.0: Dynamically resize background plane based on camera distance
  if (camera) {
    const cameraDistance = camera.position.length() + 10; // distance to plane at z=-10
    const fov = camera.fov * (Math.PI / 180);
    const height = 2 * cameraDistance * Math.tan(fov / 2);
    const aspect = window.innerWidth / window.innerHeight;
    const width = height * aspect;

    // Update geometry scale to maintain fullscreen coverage
    const currentGeometry = backgroundMesh.geometry;
    const scaleX = width / currentGeometry.parameters.width;
    const scaleY = height / currentGeometry.parameters.height;
    backgroundMesh.scale.set(scaleX, scaleY, 1);
  }

  // Phase 13.6.0/13.6.2: Switch between Acid Empire mode and standard modes
  if (state.acidEmpire?.enabled && acidShaderMaterial) {
    // Audio values for Acid Empire
    const bass = state.audio?.bass || 0;
    const mid = state.audio?.mid || 0;
    const treble = state.audio?.treble || 0;
    const level = state.audio?.level || 0;
    const spectrum = state.audio?.spectrum || new Uint8Array(0);
    const pulseStrength = Math.max(0, bass * (state.acidEmpire.bassIntensity || 1.0));
    const highStrength = Math.min(1.0, treble * 5.0);

    // Audio-reactive frequency analysis for color shift
    const currentFrequency = analyzeDominantFrequency(spectrum);
    const freqSmoothing = state.acidEmpire?.audioColorSmoothing || 0.85; // High smoothing = follows melody
    smoothedFrequency = smoothedFrequency * freqSmoothing + currentFrequency * (1 - freqSmoothing);

    // Audio-reactive sphere shrink (level-based)
    const targetSphereScale = 1.0 - (level * (state.acidEmpire?.audioSphereAmount || 0.3));
    const sphereSmoothing = state.acidEmpire?.audioSphereSmoothing || 0.7;
    smoothedSphereScale = smoothedSphereScale * sphereSmoothing + targetSphereScale * (1 - sphereSmoothing);

    // Compute final values (base + audio modulation + MMPA features)
    const baseColorShift = state.acidEmpire.colorShift || 0.0;
    const audioColorAmount = state.acidEmpire?.audioColorAmount || 0.5;
    const finalColorShift = baseColorShift + (smoothedFrequency * audioColorAmount) + (mmpaColorShift * 0.5);

    const baseSphereScale = state.acidEmpire.sphereScale || 1.0;
    const audioSphereEnabled = state.acidEmpire?.audioSphereEnabled !== false; // Default true
    const finalSphereScale = audioSphereEnabled ?
      Math.max(0.1, Math.min(1.0, baseSphereScale * smoothedSphereScale)) :
      baseSphereScale;

    // Update shader uniforms (MMPA Phase 3: apply animation speed)
    const baseTime = acidClock.getElapsedTime();
    const mmpaSpeed = mmpaVisuals?.animationSpeed || 1.0;
    acidShaderMaterial.uniforms.uTime.value = baseTime * mmpaSpeed;
    acidShaderMaterial.uniforms.uScrollX.value += (state.acidEmpire.scrollSpeedX || 0.0) * mmpaSpeed;
    acidShaderMaterial.uniforms.uScrollY.value += (state.acidEmpire.scrollSpeedY || 0.0) * mmpaSpeed;
    acidShaderMaterial.uniforms.uFreq.value = 1.0 + pulseStrength;
    acidShaderMaterial.uniforms.uShapeMorph.value = state.acidEmpire.shapeMorph || 0.55;
    acidShaderMaterial.uniforms.uPulseStrength.value = pulseStrength;
    acidShaderMaterial.uniforms.uHighStrength.value = highStrength;
    acidShaderMaterial.uniforms.uColorShift.value = finalColorShift;
    acidShaderMaterial.uniforms.uColorDrive.value = state.acidEmpire.colorDrive || 1.0;
    acidShaderMaterial.uniforms.uGlitch.value = state.acidEmpire.glitchIntensity || 0.0;
    acidShaderMaterial.uniforms.uPortalWarp.value = state.acidEmpire.portalWarp || 0.0;
    acidShaderMaterial.uniforms.uSphereScale.value = finalSphereScale;
    acidShaderMaterial.uniforms.uInvert.value = (highStrength > 0.7 && Math.random() < 0.08) ? 1.0 : 0.0;

    // Phase 13.6.2: Apply to background plane OR skybox
    if (state.useSkybox && skyboxMesh) {
      // Initialize skybox shader materials if needed
      if (skyboxShaderMaterials.length === 0) {
        console.log('🎨 Acid Empire shader initialized for skybox');
        for (let i = 0; i < 6; i++) {
          try {
            const skyboxShader = new THREE.ShaderMaterial({
              vertexShader: acidEmpireShader.vertexShader,
              fragmentShader: acidEmpireShader.fragmentShader,
              uniforms: THREE.UniformsUtils.clone(acidShaderMaterial.uniforms)
              // Note: No side: BackSide needed - planes are already rotated inward
            });
            skyboxShaderMaterials.push(skyboxShader);
          } catch (error) {
            console.error(`❌ Failed to create shader for face ${i}:`, error);
          }
        }
      }

      // Update all skybox shader uniforms with current audio values
      skyboxShaderMaterials.forEach((mat, index) => {
        if (!mat || !mat.uniforms) {
          console.warn(`⚠️ Invalid shader material for face ${index}`);
          return;
        }

        mat.uniforms.uTime.value = acidShaderMaterial.uniforms.uTime.value;
        mat.uniforms.uScrollX.value = acidShaderMaterial.uniforms.uScrollX.value;
        mat.uniforms.uScrollY.value = acidShaderMaterial.uniforms.uScrollY.value;
        mat.uniforms.uFreq.value = acidShaderMaterial.uniforms.uFreq.value;
        mat.uniforms.uShapeMorph.value = acidShaderMaterial.uniforms.uShapeMorph.value;
        mat.uniforms.uPulseStrength.value = acidShaderMaterial.uniforms.uPulseStrength.value;
        mat.uniforms.uHighStrength.value = acidShaderMaterial.uniforms.uHighStrength.value;
        mat.uniforms.uColorShift.value = acidShaderMaterial.uniforms.uColorShift.value;
        mat.uniforms.uColorDrive.value = acidShaderMaterial.uniforms.uColorDrive.value;
        mat.uniforms.uGlitch.value = acidShaderMaterial.uniforms.uGlitch.value;
        mat.uniforms.uPortalWarp.value = acidShaderMaterial.uniforms.uPortalWarp.value;
        mat.uniforms.uSphereScale.value = acidShaderMaterial.uniforms.uSphereScale.value;
        mat.uniforms.uInvert.value = acidShaderMaterial.uniforms.uInvert.value;

        // Apply to individual face mesh
        if (skyboxMesh.children[index]) {
          skyboxMesh.children[index].material = mat;
        }
      });
    } else {
      // Apply to background plane
      backgroundMesh.material = acidShaderMaterial;
    }

  } else if (state.hyperbolicTiling?.enabled && hyperbolicTilingShaderMaterial) {
    // Phase 13.29: Hyperbolic Tiling mode - Non-Euclidean fractal pattern
    console.log("🌀 Hyperbolic Tiling: ENABLED");
    const bass = state.audio?.bass || 0;
    const mid = state.audio?.mid || 0;
    const treble = state.audio?.treble || 0;
    const level = state.audio?.level || 0;

    // Update shader uniforms
    hyperbolicTilingShaderMaterial.uniforms.uTime.value = acidClock.getElapsedTime();
    hyperbolicTilingShaderMaterial.uniforms.uPatternScale.value = state.hyperbolicTiling.patternScale || 4.0;
    hyperbolicTilingShaderMaterial.uniforms.uPan.value.set(
      state.hyperbolicTiling.panX || 0.0,
      state.hyperbolicTiling.panY || 0.0
    );
    hyperbolicTilingShaderMaterial.uniforms.uRotationSpeed.value = state.hyperbolicTiling.rotationSpeed || 0.1;
    hyperbolicTilingShaderMaterial.uniforms.uIterations.value = Math.floor(state.hyperbolicTiling.iterations || 25);
    hyperbolicTilingShaderMaterial.uniforms.uDensityScale.value = state.hyperbolicTiling.densityScale || 1.0;
    hyperbolicTilingShaderMaterial.uniforms.uColorHueShift.value = state.hyperbolicTiling.colorHueShift || 0.0;
    hyperbolicTilingShaderMaterial.uniforms.uGridIntensity.value = state.hyperbolicTiling.gridIntensity || 0.4;
    hyperbolicTilingShaderMaterial.uniforms.uAudioBass.value = bass;
    hyperbolicTilingShaderMaterial.uniforms.uAudioMid.value = mid;
    hyperbolicTilingShaderMaterial.uniforms.uAudioTreble.value = treble;
    hyperbolicTilingShaderMaterial.uniforms.uAudioLevel.value = level;
    hyperbolicTilingShaderMaterial.uniforms.uAudioReactivity.value = state.hyperbolicTiling.audioReactivity || 1.0;

    // Apply to background plane OR skybox
    if (state.useSkybox && skyboxMesh) {
      // Initialize skybox shader materials if needed
      if (hyperbolicTilingShaderMaterials.length === 0) {
        console.log('🌀 Hyperbolic Tiling shader initialized for skybox');
        for (let i = 0; i < 6; i++) {
          try {
            const skyboxShader = new THREE.ShaderMaterial({
              vertexShader: hyperbolicTilingShader.vertexShader,
              fragmentShader: hyperbolicTilingShader.fragmentShader,
              uniforms: THREE.UniformsUtils.clone(hyperbolicTilingShaderMaterial.uniforms)
            });
            hyperbolicTilingShaderMaterials.push(skyboxShader);
          } catch (error) {
            console.error(`❌ Failed to create shader for face ${i}:`, error);
          }
        }
      }

      // Update all skybox shader uniforms
      const renderMode360 = state.skyboxRenderMode === '360';  // Phase 13.30: Check render mode
      hyperbolicTilingShaderMaterials.forEach((mat, index) => {
        if (!mat || !mat.uniforms) {
          console.warn(`⚠️ Invalid shader material for face ${index}`);
          return;
        }

        mat.uniforms.uTime.value = hyperbolicTilingShaderMaterial.uniforms.uTime.value;
        mat.uniforms.uPatternScale.value = hyperbolicTilingShaderMaterial.uniforms.uPatternScale.value;
        mat.uniforms.uPan.value.copy(hyperbolicTilingShaderMaterial.uniforms.uPan.value);
        mat.uniforms.uRotationSpeed.value = hyperbolicTilingShaderMaterial.uniforms.uRotationSpeed.value;
        mat.uniforms.uIterations.value = hyperbolicTilingShaderMaterial.uniforms.uIterations.value;
        mat.uniforms.uDensityScale.value = hyperbolicTilingShaderMaterial.uniforms.uDensityScale.value;
        mat.uniforms.uColorHueShift.value = hyperbolicTilingShaderMaterial.uniforms.uColorHueShift.value;
        mat.uniforms.uGridIntensity.value = hyperbolicTilingShaderMaterial.uniforms.uGridIntensity.value;
        mat.uniforms.uAudioBass.value = hyperbolicTilingShaderMaterial.uniforms.uAudioBass.value;
        mat.uniforms.uAudioMid.value = hyperbolicTilingShaderMaterial.uniforms.uAudioMid.value;
        mat.uniforms.uAudioTreble.value = hyperbolicTilingShaderMaterial.uniforms.uAudioTreble.value;
        mat.uniforms.uAudioLevel.value = hyperbolicTilingShaderMaterial.uniforms.uAudioLevel.value;
        mat.uniforms.uAudioReactivity.value = hyperbolicTilingShaderMaterial.uniforms.uAudioReactivity.value;

        // Phase 13.30: Set face index and render mode for 360 panorama
        mat.uniforms.uFaceIndex.value = index;
        mat.uniforms.uRenderMode360.value = renderMode360;

        // Apply to individual face mesh
        if (skyboxMesh.children[index]) {
          skyboxMesh.children[index].material = mat;
        }
      });
    } else {
      // Apply to background plane
      backgroundMesh.material = hyperbolicTilingShaderMaterial;
    }

  } else if (state.luminousTessellation?.enabled && luminousShaderMaterial) {
    // Luminous Tessellation mode - HDR Voronoi patterns
    const bass = state.audio?.bass || 0;
    const mid = state.audio?.mid || 0;
    const treble = state.audio?.treble || 0;

    // Update shader uniforms
    luminousShaderMaterial.uniforms.uTime.value = acidClock.getElapsedTime();
    luminousShaderMaterial.uniforms.uScale.value = state.luminousTessellation.scale || 3.0;
    luminousShaderMaterial.uniforms.uSpeed.value = state.luminousTessellation.speed || 0.5;
    luminousShaderMaterial.uniforms.uComplexity.value = state.luminousTessellation.complexity || 0.5;
    luminousShaderMaterial.uniforms.uColorShift.value = state.luminousTessellation.colorShift || 0.0;
    luminousShaderMaterial.uniforms.uLuminosity.value = state.luminousTessellation.luminosity || 1.5;
    luminousShaderMaterial.uniforms.uContrast.value = state.luminousTessellation.contrast || 1.2;
    luminousShaderMaterial.uniforms.uAudioBass.value = bass * (state.luminousTessellation.audioIntensity || 1.0);
    luminousShaderMaterial.uniforms.uAudioMid.value = mid * (state.luminousTessellation.audioIntensity || 1.0);
    luminousShaderMaterial.uniforms.uAudioTreble.value = treble * (state.luminousTessellation.audioIntensity || 1.0);
    luminousShaderMaterial.uniforms.uWaveAmplitude.value = state.luminousTessellation.waveAmplitude || 0.0;
    luminousShaderMaterial.uniforms.uWaveFrequency.value = state.luminousTessellation.waveFrequency || 2.0;
    luminousShaderMaterial.uniforms.uMorphIntensity.value = state.luminousTessellation.morphIntensity || 0.0;

    // Apply to background plane OR skybox
    if (state.useSkybox && skyboxMesh) {
      // Initialize skybox shader materials if needed
      if (luminousShaderMaterials.length === 0) {
        console.log('✨ Luminous Tessellation shader initialized for skybox');
        for (let i = 0; i < 6; i++) {
          try {
            const skyboxShader = new THREE.ShaderMaterial({
              vertexShader: luminousTessellationShader.vertexShader,
              fragmentShader: luminousTessellationShader.fragmentShader,
              uniforms: THREE.UniformsUtils.clone(luminousShaderMaterial.uniforms)
            });
            luminousShaderMaterials.push(skyboxShader);
          } catch (error) {
            console.error(`❌ Failed to create shader for face ${i}:`, error);
          }
        }
      }

      // Update all skybox shader uniforms
      luminousShaderMaterials.forEach((mat, index) => {
        if (!mat || !mat.uniforms) {
          console.warn(`⚠️ Invalid shader material for face ${index}`);
          return;
        }

        mat.uniforms.uTime.value = luminousShaderMaterial.uniforms.uTime.value;
        mat.uniforms.uScale.value = luminousShaderMaterial.uniforms.uScale.value;
        mat.uniforms.uSpeed.value = luminousShaderMaterial.uniforms.uSpeed.value;
        mat.uniforms.uComplexity.value = luminousShaderMaterial.uniforms.uComplexity.value;
        mat.uniforms.uColorShift.value = luminousShaderMaterial.uniforms.uColorShift.value;
        mat.uniforms.uLuminosity.value = luminousShaderMaterial.uniforms.uLuminosity.value;
        mat.uniforms.uContrast.value = luminousShaderMaterial.uniforms.uContrast.value;
        mat.uniforms.uAudioBass.value = luminousShaderMaterial.uniforms.uAudioBass.value;
        mat.uniforms.uAudioMid.value = luminousShaderMaterial.uniforms.uAudioMid.value;
        mat.uniforms.uAudioTreble.value = luminousShaderMaterial.uniforms.uAudioTreble.value;
        mat.uniforms.uWaveAmplitude.value = luminousShaderMaterial.uniforms.uWaveAmplitude.value;
        mat.uniforms.uWaveFrequency.value = luminousShaderMaterial.uniforms.uWaveFrequency.value;
        mat.uniforms.uMorphIntensity.value = luminousShaderMaterial.uniforms.uMorphIntensity.value;

        // Apply to individual face mesh
        if (skyboxMesh.children[index]) {
          skyboxMesh.children[index].material = mat;
        }
      });
    } else {
      // Apply to background plane
      backgroundMesh.material = luminousShaderMaterial;
    }

  } else if (state.sacredGeometry?.enabled && sacredGeometryShaderMaterial) {
    // Sacred Geometry mode - Egyptian pyramids with parallax scrolling
    const bass = state.audio?.bass || 0;
    const mid = state.audio?.mid || 0;
    const treble = state.audio?.treble || 0;

    // Update shader uniforms
    sacredGeometryShaderMaterial.uniforms.uTime.value = acidClock.getElapsedTime();
    sacredGeometryShaderMaterial.uniforms.uScrollSpeed.value = state.sacredGeometry.scrollSpeed || 0.1;
    sacredGeometryShaderMaterial.uniforms.uLayerCount.value = state.sacredGeometry.layerCount || 3.0;
    sacredGeometryShaderMaterial.uniforms.uColorShift.value = state.sacredGeometry.colorShift || 0.0;
    sacredGeometryShaderMaterial.uniforms.uSymbolDensity.value = state.sacredGeometry.symbolDensity || 0.5;
    sacredGeometryShaderMaterial.uniforms.uGlowIntensity.value = state.sacredGeometry.glowIntensity || 1.0;
    sacredGeometryShaderMaterial.uniforms.uPyramidScale.value = state.sacredGeometry.pyramidScale || 2.0;
    sacredGeometryShaderMaterial.uniforms.uAudioBass.value = bass * (state.sacredGeometry.audioIntensity || 1.0);
    sacredGeometryShaderMaterial.uniforms.uAudioMid.value = mid * (state.sacredGeometry.audioIntensity || 1.0);
    sacredGeometryShaderMaterial.uniforms.uAudioTreble.value = treble * (state.sacredGeometry.audioIntensity || 1.0);
    sacredGeometryShaderMaterial.uniforms.uDancingOutline.value = state.sacredGeometry.dancingOutline ? 1.0 : 0.0;

    // Apply to background plane OR skybox
    if (state.useSkybox && skyboxMesh) {
      // Initialize skybox shader materials if needed
      if (sacredGeometryShaderMaterials.length === 0) {
        console.log('🔺 Sacred Geometry shader initialized for skybox');
        for (let i = 0; i < 6; i++) {
          try {
            const skyboxShader = new THREE.ShaderMaterial({
              vertexShader: sacredGeometryShader.vertexShader,
              fragmentShader: sacredGeometryShader.fragmentShader,
              uniforms: THREE.UniformsUtils.clone(sacredGeometryShaderMaterial.uniforms)
            });
            sacredGeometryShaderMaterials.push(skyboxShader);
          } catch (error) {
            console.error(`❌ Failed to create shader for face ${i}:`, error);
          }
        }
      }

      // Update all skybox shader uniforms
      sacredGeometryShaderMaterials.forEach((mat, index) => {
        if (!mat || !mat.uniforms) {
          console.warn(`⚠️ Invalid shader material for face ${index}`);
          return;
        }

        mat.uniforms.uTime.value = sacredGeometryShaderMaterial.uniforms.uTime.value;
        mat.uniforms.uScrollSpeed.value = sacredGeometryShaderMaterial.uniforms.uScrollSpeed.value;
        mat.uniforms.uLayerCount.value = sacredGeometryShaderMaterial.uniforms.uLayerCount.value;
        mat.uniforms.uColorShift.value = sacredGeometryShaderMaterial.uniforms.uColorShift.value;
        mat.uniforms.uSymbolDensity.value = sacredGeometryShaderMaterial.uniforms.uSymbolDensity.value;
        mat.uniforms.uGlowIntensity.value = sacredGeometryShaderMaterial.uniforms.uGlowIntensity.value;
        mat.uniforms.uPyramidScale.value = sacredGeometryShaderMaterial.uniforms.uPyramidScale.value;
        mat.uniforms.uAudioBass.value = sacredGeometryShaderMaterial.uniforms.uAudioBass.value;
        mat.uniforms.uAudioMid.value = sacredGeometryShaderMaterial.uniforms.uAudioMid.value;
        mat.uniforms.uAudioTreble.value = sacredGeometryShaderMaterial.uniforms.uAudioTreble.value;
        mat.uniforms.uDancingOutline.value = sacredGeometryShaderMaterial.uniforms.uDancingOutline.value;

        // Apply to individual face mesh
        if (skyboxMesh.children[index]) {
          skyboxMesh.children[index].material = mat;
        }
      });
    } else {
      // Apply to background plane
      backgroundMesh.material = sacredGeometryShaderMaterial;
    }

  } else if (state.fractals?.enabled && fractalShaderMaterial) {
    // Fractal mode - Mandelbrot/Julia sets
    const bass = state.audio?.bass || 0;
    const mid = state.audio?.mid || 0;
    const treble = state.audio?.treble || 0;

    // Update shader uniforms
    fractalShaderMaterial.uniforms.uTime.value = acidClock.getElapsedTime();
    fractalShaderMaterial.uniforms.uZoom.value.set(state.fractals.zoom || 2.5, state.fractals.zoom || 2.5);
    fractalShaderMaterial.uniforms.uPan.value.set(state.fractals.panX || 0.0, state.fractals.panY || 0.0);
    fractalShaderMaterial.uniforms.uMaxIterations.value = state.fractals.maxIterations || 100;
    fractalShaderMaterial.uniforms.uColorShift.value = state.fractals.colorShift || 0.0;
    fractalShaderMaterial.uniforms.uJuliaMode.value = state.fractals.juliaMode ? 1.0 : 0.0;
    fractalShaderMaterial.uniforms.uJuliaC.value.set(state.fractals.juliaCx || -0.7, state.fractals.juliaCy || 0.27);
    fractalShaderMaterial.uniforms.uAudioBass.value = bass * (state.fractals.audioIntensity || 1.0);
    fractalShaderMaterial.uniforms.uAudioMid.value = mid * (state.fractals.audioIntensity || 1.0);
    fractalShaderMaterial.uniforms.uAudioTreble.value = treble * (state.fractals.audioIntensity || 1.0);

    // Apply to background plane
    backgroundMesh.material = fractalShaderMaterial;

  } else if (state.rayMarching?.enabled && rayMarchShaderMaterial) {
    // Ray Marching mode - 3D volumetric SDF rendering
    const bass = state.audio?.bass || 0;
    const mid = state.audio?.mid || 0;
    const treble = state.audio?.treble || 0;

    rayMarchShaderMaterial.uniforms.uTime.value = acidClock.getElapsedTime();
    if (camera) rayMarchShaderMaterial.uniforms.uCameraPos.value.copy(camera.position);
    rayMarchShaderMaterial.uniforms.uShapeType.value = state.rayMarching.shapeType || 0.0;
    rayMarchShaderMaterial.uniforms.uMorphAmount.value = state.rayMarching.morphAmount || 0.0;
    rayMarchShaderMaterial.uniforms.uDensity.value = state.rayMarching.density || 0.3;
    rayMarchShaderMaterial.uniforms.uAbsorption.value = state.rayMarching.absorption || 1.0;
    rayMarchShaderMaterial.uniforms.uColorShift.value = state.rayMarching.colorShift || 0.0;
    rayMarchShaderMaterial.uniforms.uAudioBass.value = bass;
    rayMarchShaderMaterial.uniforms.uAudioMid.value = mid;
    rayMarchShaderMaterial.uniforms.uAudioTreble.value = treble;

    // Apply to background plane OR skybox
    if (state.useSkybox && skyboxMesh) {
      // Initialize skybox shader materials if needed
      if (rayMarchShaderMaterials.length === 0) {
        console.log('📐 Ray Marching shader initialized for skybox');
        for (let i = 0; i < 6; i++) {
          try {
            const skyboxShader = new THREE.ShaderMaterial({
              vertexShader: rayMarchShader.vertexShader,
              fragmentShader: rayMarchShader.fragmentShader,
              uniforms: THREE.UniformsUtils.clone(rayMarchShaderMaterial.uniforms)
            });
            rayMarchShaderMaterials.push(skyboxShader);
          } catch (error) {
            console.error(`❌ Failed to create Ray Marching shader for face ${i}:`, error);
          }
        }
      }

      // Update all skybox shader uniforms
      rayMarchShaderMaterials.forEach((mat, index) => {
        if (!mat || !mat.uniforms) {
          console.warn(`⚠️ Invalid Ray Marching shader material for face ${index}`);
          return;
        }

        mat.uniforms.uTime.value = rayMarchShaderMaterial.uniforms.uTime.value;
        mat.uniforms.uCameraPos.value.copy(rayMarchShaderMaterial.uniforms.uCameraPos.value);
        mat.uniforms.uShapeType.value = rayMarchShaderMaterial.uniforms.uShapeType.value;
        mat.uniforms.uMorphAmount.value = rayMarchShaderMaterial.uniforms.uMorphAmount.value;
        mat.uniforms.uDensity.value = rayMarchShaderMaterial.uniforms.uDensity.value;
        mat.uniforms.uAbsorption.value = rayMarchShaderMaterial.uniforms.uAbsorption.value;
        mat.uniforms.uColorShift.value = rayMarchShaderMaterial.uniforms.uColorShift.value;
        mat.uniforms.uAudioBass.value = rayMarchShaderMaterial.uniforms.uAudioBass.value;
        mat.uniforms.uAudioMid.value = rayMarchShaderMaterial.uniforms.uAudioMid.value;
        mat.uniforms.uAudioTreble.value = rayMarchShaderMaterial.uniforms.uAudioTreble.value;

        // Apply to individual face mesh
        if (skyboxMesh.children[index]) {
          skyboxMesh.children[index].material = mat;
        }
      });
    } else {
      // Apply to background plane
      backgroundMesh.material = rayMarchShaderMaterial;
    }

  } else if (state.liquidSim?.enabled && liquidSimShaderMaterial) {
    // Liquid Simulation mode - Metaball fluid dynamics
    const bass = state.audio?.bass || 0;
    const mid = state.audio?.mid || 0;
    const treble = state.audio?.treble || 0;

    liquidSimShaderMaterial.uniforms.uTime.value = acidClock.getElapsedTime();
    liquidSimShaderMaterial.uniforms.uBlobCount.value = state.liquidSim.blobCount || 8.0;
    liquidSimShaderMaterial.uniforms.uThreshold.value = state.liquidSim.threshold || 1.2;
    liquidSimShaderMaterial.uniforms.uViscosity.value = state.liquidSim.viscosity || 0.5;
    liquidSimShaderMaterial.uniforms.uGravity.value = state.liquidSim.gravity || 0.3;
    liquidSimShaderMaterial.uniforms.uColorShift.value = state.liquidSim.colorShift || 0.0;
    liquidSimShaderMaterial.uniforms.uSurfaceTension.value = state.liquidSim.surfaceTension || 0.5;
    liquidSimShaderMaterial.uniforms.uAudioBass.value = bass;
    liquidSimShaderMaterial.uniforms.uAudioMid.value = mid;
    liquidSimShaderMaterial.uniforms.uAudioTreble.value = treble;

    // Apply to background plane OR skybox
    if (state.useSkybox && skyboxMesh) {
      // Initialize skybox shader materials if needed
      if (liquidSimShaderMaterials.length === 0) {
        console.log('💧 Liquid Simulation shader initialized for skybox');
        for (let i = 0; i < 6; i++) {
          try {
            const skyboxShader = new THREE.ShaderMaterial({
              vertexShader: liquidSimShader.vertexShader,
              fragmentShader: liquidSimShader.fragmentShader,
              uniforms: THREE.UniformsUtils.clone(liquidSimShaderMaterial.uniforms)
            });
            liquidSimShaderMaterials.push(skyboxShader);
          } catch (error) {
            console.error(`❌ Failed to create Liquid Simulation shader for face ${i}:`, error);
          }
        }
      }

      // Update all skybox shader uniforms
      liquidSimShaderMaterials.forEach((mat, index) => {
        if (!mat || !mat.uniforms) {
          console.warn(`⚠️ Invalid Liquid Simulation shader material for face ${index}`);
          return;
        }

        mat.uniforms.uTime.value = liquidSimShaderMaterial.uniforms.uTime.value;
        mat.uniforms.uBlobCount.value = liquidSimShaderMaterial.uniforms.uBlobCount.value;
        mat.uniforms.uThreshold.value = liquidSimShaderMaterial.uniforms.uThreshold.value;
        mat.uniforms.uViscosity.value = liquidSimShaderMaterial.uniforms.uViscosity.value;
        mat.uniforms.uGravity.value = liquidSimShaderMaterial.uniforms.uGravity.value;
        mat.uniforms.uColorShift.value = liquidSimShaderMaterial.uniforms.uColorShift.value;
        mat.uniforms.uSurfaceTension.value = liquidSimShaderMaterial.uniforms.uSurfaceTension.value;
        mat.uniforms.uAudioBass.value = liquidSimShaderMaterial.uniforms.uAudioBass.value;
        mat.uniforms.uAudioMid.value = liquidSimShaderMaterial.uniforms.uAudioMid.value;
        mat.uniforms.uAudioTreble.value = liquidSimShaderMaterial.uniforms.uAudioTreble.value;

        // Apply to individual face mesh
        if (skyboxMesh.children[index]) {
          skyboxMesh.children[index].material = mat;
        }
      });
    } else {
      // Apply to background plane
      backgroundMesh.material = liquidSimShaderMaterial;
    }

  } else if (state.kaleidoscope?.enabled && kaleidoscopeShaderMaterial) {
    // Kaleidoscope mode - Radial mirror symmetry
    const bass = state.audio?.bass || 0;
    const mid = state.audio?.mid || 0;
    const treble = state.audio?.treble || 0;

    kaleidoscopeShaderMaterial.uniforms.uTime.value = acidClock.getElapsedTime();
    kaleidoscopeShaderMaterial.uniforms.uSegments.value = state.kaleidoscope.segments || 8.0;
    kaleidoscopeShaderMaterial.uniforms.uRotation.value = state.kaleidoscope.rotation || 0.0;
    kaleidoscopeShaderMaterial.uniforms.uZoom.value = state.kaleidoscope.zoom || 1.0;
    kaleidoscopeShaderMaterial.uniforms.uColorShift.value = state.kaleidoscope.colorShift || 0.0;
    kaleidoscopeShaderMaterial.uniforms.uAudioBass.value = bass;
    kaleidoscopeShaderMaterial.uniforms.uAudioMid.value = mid;
    kaleidoscopeShaderMaterial.uniforms.uAudioTreble.value = treble;

    // Apply to background plane OR skybox
    if (state.useSkybox && skyboxMesh) {
      if (kaleidoscopeShaderMaterials.length === 0) {
        console.log('🔮 Kaleidoscope shader initialized for skybox');
        for (let i = 0; i < 6; i++) {
          kaleidoscopeShaderMaterials.push(new THREE.ShaderMaterial({
            vertexShader: kaleidoscopeShader.vertexShader,
            fragmentShader: kaleidoscopeShader.fragmentShader,
            uniforms: THREE.UniformsUtils.clone(kaleidoscopeShaderMaterial.uniforms)
          }));
        }
      }
      kaleidoscopeShaderMaterials.forEach((mat, index) => {
        if (!mat || !mat.uniforms) return;
        mat.uniforms.uTime.value = kaleidoscopeShaderMaterial.uniforms.uTime.value;
        mat.uniforms.uSegments.value = kaleidoscopeShaderMaterial.uniforms.uSegments.value;
        mat.uniforms.uRotation.value = kaleidoscopeShaderMaterial.uniforms.uRotation.value;
        mat.uniforms.uZoom.value = kaleidoscopeShaderMaterial.uniforms.uZoom.value;
        mat.uniforms.uColorShift.value = kaleidoscopeShaderMaterial.uniforms.uColorShift.value;
        mat.uniforms.uAudioBass.value = kaleidoscopeShaderMaterial.uniforms.uAudioBass.value;
        mat.uniforms.uAudioMid.value = kaleidoscopeShaderMaterial.uniforms.uAudioMid.value;
        mat.uniforms.uAudioTreble.value = kaleidoscopeShaderMaterial.uniforms.uAudioTreble.value;
        if (skyboxMesh.children[index]) skyboxMesh.children[index].material = mat;
      });
    } else {
      backgroundMesh.material = kaleidoscopeShaderMaterial;
    }

  } else if (state.cellularAutomata?.enabled && cellularAutomataDisplayMaterial) {
    // Cellular Automata mode - Conway's Life
    const bass = state.audio?.bass || 0;
    const mid = state.audio?.mid || 0;
    const treble = state.audio?.treble || 0;

    cellularAutomataDisplayMaterial.uniforms.uTime.value = acidClock.getElapsedTime();
    cellularAutomataDisplayMaterial.uniforms.uColorShift.value = state.cellularAutomata.colorShift || 0.0;
    cellularAutomataDisplayMaterial.uniforms.uCellSize.value = state.cellularAutomata.cellSize || 32.0;
    cellularAutomataDisplayMaterial.uniforms.uShowGrid.value = state.cellularAutomata.showGrid !== false;
    cellularAutomataDisplayMaterial.uniforms.uAudioBass.value = bass;
    cellularAutomataDisplayMaterial.uniforms.uAudioMid.value = mid;
    cellularAutomataDisplayMaterial.uniforms.uAudioTreble.value = treble;

    // Update compute shader rules
    if (state.cellularAutomata.birthRules) {
      const br = state.cellularAutomata.birthRules;
      cellularAutomataComputeMaterial.uniforms.uBirthRules.value.set(br[0] || 0, br[1] || 0, br[2] || 0, br[3] || 0);
    }
    if (state.cellularAutomata.surviveRules) {
      const sr = state.cellularAutomata.surviveRules;
      cellularAutomataComputeMaterial.uniforms.uSurviveRules.value.set(sr[0] || 0, sr[1] || 0, sr[2] || 0, sr[3] || 0);
    }

    // Apply display material to background plane (skybox not supported for CA due to render targets)
    backgroundMesh.material = cellularAutomataDisplayMaterial;
    backgroundMesh.visible = true;
    if (skyboxMesh) skyboxMesh.visible = false;

  } else if (state.flowField?.enabled && flowFieldShaderMaterial) {
    // Flow Field mode - Perlin noise particle trails
    const bass = state.audio?.bass || 0;
    const mid = state.audio?.mid || 0;
    const treble = state.audio?.treble || 0;

    flowFieldShaderMaterial.uniforms.uTime.value = acidClock.getElapsedTime();
    flowFieldShaderMaterial.uniforms.uScale.value = state.flowField.scale || 4.0;
    flowFieldShaderMaterial.uniforms.uSpeed.value = state.flowField.speed || 1.0;
    flowFieldShaderMaterial.uniforms.uStrength.value = state.flowField.strength || 1.0;
    flowFieldShaderMaterial.uniforms.uColorShift.value = state.flowField.colorShift || 0.0;
    flowFieldShaderMaterial.uniforms.uParticleDensity.value = state.flowField.particleDensity || 1.0;
    flowFieldShaderMaterial.uniforms.uTimeScale.value = state.flowField.timeScale || 0.3;
    flowFieldShaderMaterial.uniforms.uAudioBass.value = bass;
    flowFieldShaderMaterial.uniforms.uAudioMid.value = mid;
    flowFieldShaderMaterial.uniforms.uAudioTreble.value = treble;

    // Apply to background plane OR skybox
    if (state.useSkybox && skyboxMesh) {
      if (flowFieldShaderMaterials.length === 0) {
        console.log('🌊 Flow Field shader initialized for skybox');
        for (let i = 0; i < 6; i++) {
          flowFieldShaderMaterials.push(new THREE.ShaderMaterial({
            vertexShader: flowFieldShader.vertexShader,
            fragmentShader: flowFieldShader.fragmentShader,
            uniforms: THREE.UniformsUtils.clone(flowFieldShaderMaterial.uniforms)
          }));
        }
      }
      flowFieldShaderMaterials.forEach((mat, index) => {
        if (!mat || !mat.uniforms) return;
        mat.uniforms.uTime.value = flowFieldShaderMaterial.uniforms.uTime.value;
        mat.uniforms.uScale.value = flowFieldShaderMaterial.uniforms.uScale.value;
        mat.uniforms.uSpeed.value = flowFieldShaderMaterial.uniforms.uSpeed.value;
        mat.uniforms.uStrength.value = flowFieldShaderMaterial.uniforms.uStrength.value;
        mat.uniforms.uColorShift.value = flowFieldShaderMaterial.uniforms.uColorShift.value;
        mat.uniforms.uParticleDensity.value = flowFieldShaderMaterial.uniforms.uParticleDensity.value;
        mat.uniforms.uTimeScale.value = flowFieldShaderMaterial.uniforms.uTimeScale.value;
        mat.uniforms.uAudioBass.value = flowFieldShaderMaterial.uniforms.uAudioBass.value;
        mat.uniforms.uAudioMid.value = flowFieldShaderMaterial.uniforms.uAudioMid.value;
        mat.uniforms.uAudioTreble.value = flowFieldShaderMaterial.uniforms.uAudioTreble.value;
        if (skyboxMesh.children[index]) skyboxMesh.children[index].material = mat;
      });
    } else {
      backgroundMesh.material = flowFieldShaderMaterial;
    }

  } else if (state.mandelbulb?.enabled && mandelbulbShaderMaterial) {
    // Mandelbulb mode - 3D fractal raymarching
    const bass = state.audio?.bass || 0;
    const mid = state.audio?.mid || 0;
    const treble = state.audio?.treble || 0;

    mandelbulbShaderMaterial.uniforms.uTime.value = acidClock.getElapsedTime();
    mandelbulbShaderMaterial.uniforms.uPower.value = state.mandelbulb.power || 8.0;
    mandelbulbShaderMaterial.uniforms.uIterations.value = state.mandelbulb.iterations || 16.0;
    mandelbulbShaderMaterial.uniforms.uPalette.value = state.mandelbulb.palette || 0.0;
    mandelbulbShaderMaterial.uniforms.uShellThickness.value = state.mandelbulb.shellThickness || 0.02;
    mandelbulbShaderMaterial.uniforms.uColorShift.value = state.mandelbulb.colorShift || 0.0;
    mandelbulbShaderMaterial.uniforms.uAudioBass.value = bass;
    mandelbulbShaderMaterial.uniforms.uAudioMid.value = mid;
    mandelbulbShaderMaterial.uniforms.uAudioTreble.value = treble;
    mandelbulbShaderMaterial.uniforms.uCameraPosition.value.copy(camera.position);

    // Debug log once per second
    if (!window._mandelbulbDebugTime || Date.now() - window._mandelbulbDebugTime > 1000) {
      window._mandelbulbDebugTime = Date.now();
      console.log('🌀 Mandelbulb active:', {
        camera: camera.position.toArray(),
        useSkybox: state.useSkybox,
        backgroundVisible: backgroundMesh.visible,
        skyboxVisible: skyboxMesh ? skyboxMesh.visible : 'N/A'
      });
    }

    // Apply to background plane OR skybox
    if (state.useSkybox && skyboxMesh) {
      if (mandelbulbShaderMaterials.length === 0) {
        console.log('🌀 Mandelbulb shader initialized for skybox');
        for (let i = 0; i < 6; i++) {
          mandelbulbShaderMaterials.push(new THREE.ShaderMaterial({
            vertexShader: mandelbulbShader.vertexShader,
            fragmentShader: mandelbulbShader.fragmentShader,
            uniforms: THREE.UniformsUtils.clone(mandelbulbShaderMaterial.uniforms)
          }));
        }
      }
      mandelbulbShaderMaterials.forEach((mat, index) => {
        if (!mat || !mat.uniforms) return;
        mat.uniforms.uTime.value = mandelbulbShaderMaterial.uniforms.uTime.value;
        mat.uniforms.uPower.value = mandelbulbShaderMaterial.uniforms.uPower.value;
        mat.uniforms.uIterations.value = mandelbulbShaderMaterial.uniforms.uIterations.value;
        mat.uniforms.uPalette.value = mandelbulbShaderMaterial.uniforms.uPalette.value;
        mat.uniforms.uShellThickness.value = mandelbulbShaderMaterial.uniforms.uShellThickness.value;
        mat.uniforms.uColorShift.value = mandelbulbShaderMaterial.uniforms.uColorShift.value;
        mat.uniforms.uAudioBass.value = mandelbulbShaderMaterial.uniforms.uAudioBass.value;
        mat.uniforms.uAudioMid.value = mandelbulbShaderMaterial.uniforms.uAudioMid.value;
        mat.uniforms.uAudioTreble.value = mandelbulbShaderMaterial.uniforms.uAudioTreble.value;
        mat.uniforms.uCameraPosition.value.copy(mandelbulbShaderMaterial.uniforms.uCameraPosition.value);
        if (skyboxMesh.children[index]) skyboxMesh.children[index].material = mat;
      });
      // Show skybox, hide background plane
      backgroundMesh.visible = false;
      skyboxMesh.visible = true;
    } else {
      // Show background plane, hide skybox
      backgroundMesh.material = mandelbulbShaderMaterial;
      backgroundMesh.visible = true;
      if (skyboxMesh) skyboxMesh.visible = false;
    }

  } else if (state.voxelWave?.enabled) {
    // Phase 13.7.3: Voxel Wave uses 3D mesh voxels (voxelFloor.js), not shader
    // Hide background plane and skybox - let mesh voxels show through
    backgroundMesh.visible = false;
    if (skyboxMesh) {
      skyboxMesh.visible = false;
    }

  } else {
    // Standard mode: use basic material with texture or solid color
    // Phase 13.7.3: Only show background/skybox when actually in use
    // Hide backgroundMesh when no texture is loaded (user request)
    backgroundMesh.visible = !state.useSkybox && state.useBackgroundImage && state.texture;
    if (skyboxMesh) {
      skyboxMesh.visible = state.useSkybox;
    }

    if (state.useSkybox && skyboxMesh) {
      // Phase 13.6.2: Apply textures to skybox faces (keep materials persistent)

      // Debug: Log texture state once per second
      if (!window.lastSkyboxDebug || Date.now() - window.lastSkyboxDebug > 1000) {
        console.log(`🔍 Skybox textures:`, state.skyboxTextures.map((t, i) => `${i}:${!!t}`).join(', '));
        window.lastSkyboxDebug = Date.now();
      }

      skyboxMaterials.forEach((mat, index) => {
        const faceMesh = skyboxMesh.children[index];
        if (!faceMesh) return;

        // Only recreate if switching from shader mode
        if (!(mat instanceof THREE.MeshBasicMaterial)) {
          skyboxMaterials[index] = new THREE.MeshBasicMaterial({ color: 0x111111 });
          faceMesh.material = skyboxMaterials[index];
          console.log(`🔄 Switched face ${index} from shader to basic material`);
        }

        // Apply stored texture for this face if exists
        if (state.skyboxTextures[index]) {
          skyboxMaterials[index].map = state.skyboxTextures[index];
          skyboxMaterials[index].color.set(0xffffff);
        } else {
          skyboxMaterials[index].map = null;
          skyboxMaterials[index].color.set(0x111111);
        }
        skyboxMaterials[index].needsUpdate = true;

        // Ensure face mesh has the updated material reference
        if (faceMesh.material !== skyboxMaterials[index]) {
          faceMesh.material = skyboxMaterials[index];
          console.log(`🔗 Relinked material for face ${index}`);
        }
      });
    } else {
      // Background plane mode
      if (!(backgroundMesh.material instanceof THREE.MeshBasicMaterial)) {
        backgroundMesh.material = new THREE.MeshBasicMaterial({ color: 0x111111 });
      }

      // Phase 11.6.1: Only show texture when both texture exists AND toggle is ON
      if (state.useBackgroundImage && state.texture) {
        backgroundMesh.material.map = state.texture;
        backgroundMesh.material.color.set(0xffffff); // white base for texture visibility
      } else {
        backgroundMesh.material.map = null;
        backgroundMesh.material.color.set(0x111111); // dark gray fallback
      }
      backgroundMesh.material.needsUpdate = true;
    }
  }

  // MMPA Unified Theory - Update Heart/Vortex/Archetype visualization
  if (theoryModeEnabled && theoryRendererAPI && state.mmpaFeatures) {
    const deltaTime = 0.016; // ~60fps
    theoryRendererAPI.update(state.mmpaFeatures, deltaTime);
  }
}

// Phase 11.7.50: Update background scale (called from HUD)
export function setBackgroundScale(scale) {
  if (!backgroundMesh) return;
  state.backgroundScale = scale;
  backgroundMesh.scale.set(scale, scale, 1);
}

// Phase 13.6.2: Skybox mode control
export function setSkyboxMode(enabled) {
  if (!skyboxMesh || !backgroundMesh) return;

  state.useSkybox = enabled;
  skyboxMesh.visible = enabled;
  backgroundMesh.visible = !enabled;

  console.log(`📦 Skybox mode: ${enabled ? 'ON' : 'OFF'}`);
}

// Phase 13.6.2: Set texture on specific skybox face
// faceIndex: 0=right, 1=left, 2=top, 3=bottom, 4=front, 5=back
export function setSkyboxFaceTexture(faceIndex, texture) {
  if (!skyboxMesh || !skyboxMaterials[faceIndex]) {
    console.warn(`⚠️ Skybox not initialized (mesh: ${!!skyboxMesh}, materials[${faceIndex}]: ${!!skyboxMaterials[faceIndex]})`);
    return;
  }

  // Get the specific plane mesh from the group
  const faceMesh = skyboxMesh.children[faceIndex];
  if (!faceMesh) {
    console.warn(`⚠️ Skybox face ${faceIndex} mesh not found`);
    return;
  }

  // Ensure we have a MeshBasicMaterial (not a shader material)
  if (!(skyboxMaterials[faceIndex] instanceof THREE.MeshBasicMaterial)) {
    skyboxMaterials[faceIndex] = new THREE.MeshBasicMaterial({ color: 0x111111 });
    faceMesh.material = skyboxMaterials[faceIndex];
    console.log(`🔄 Recreated basic material for face ${faceIndex}`);
  }

  // Update the basic material for this face
  if (texture) {
    skyboxMaterials[faceIndex].map = texture;
    skyboxMaterials[faceIndex].color.set(0xffffff);
  } else {
    skyboxMaterials[faceIndex].map = null;
    skyboxMaterials[faceIndex].color.set(0x111111);
  }
  skyboxMaterials[faceIndex].needsUpdate = true;

  console.log(`📦 Texture ${texture ? 'applied' : 'cleared'} for face ${faceIndex} (visible: ${skyboxMesh.visible}, material: ${faceMesh.material.type})`);
}

// Cellular Automata ping-pong update function
let caDebugLogged = false;
export function updateCellularAutomata(renderer) {
  if (!state.cellularAutomata?.enabled || !cellularAutomataComputeMaterial || !cellularAutomataDisplayMaterial) {
    return;
  }

  if (!caDebugLogged) {
    console.log('🧬 Cellular Automata update running', {
      enabled: state.cellularAutomata.enabled,
      updateRate: state.cellularAutomata.updateRate,
      birthRules: state.cellularAutomata.birthRules,
      surviveRules: state.cellularAutomata.surviveRules
    });
    caDebugLogged = true;
  }

  // Handle pattern initialization
  if (state.cellularAutomata.initPattern) {
    const pattern = state.cellularAutomata.initPattern;
    delete state.cellularAutomata.initPattern; // Clear the flag

    const caResolution = 256;
    const initData = new Float32Array(caResolution * caResolution * 4);

    switch (pattern) {
      case 'random':
        for (let i = 0; i < initData.length; i += 4) {
          const alive = Math.random() < 0.3 ? 1.0 : 0.0;
          initData[i] = alive;
          initData[i + 1] = alive;
          initData[i + 2] = alive;
          initData[i + 3] = 1.0;
        }
        break;

      case 'random50':
        for (let i = 0; i < initData.length; i += 4) {
          const alive = Math.random() < 0.5 ? 1.0 : 0.0;
          initData[i] = alive;
          initData[i + 1] = alive;
          initData[i + 2] = alive;
          initData[i + 3] = 1.0;
        }
        break;

      case 'clear':
        for (let i = 0; i < initData.length; i += 4) {
          initData[i] = 0.0;
          initData[i + 1] = 0.0;
          initData[i + 2] = 0.0;
          initData[i + 3] = 1.0;
        }
        break;

      case 'centerSquare':
        for (let i = 0; i < initData.length; i += 4) {
          const pixelIndex = i / 4;
          const x = pixelIndex % caResolution;
          const y = Math.floor(pixelIndex / caResolution);
          const centerX = caResolution / 2;
          const centerY = caResolution / 2;
          const size = 32;

          const alive = (Math.abs(x - centerX) < size && Math.abs(y - centerY) < size) ? 1.0 : 0.0;
          initData[i] = alive;
          initData[i + 1] = alive;
          initData[i + 2] = alive;
          initData[i + 3] = 1.0;
        }
        break;
    }

    // Create new texture and update both render targets
    const initTexture = new THREE.DataTexture(
      initData,
      caResolution,
      caResolution,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    initTexture.needsUpdate = true;

    // Render the initialization to both targets
    cellularAutomataComputeMaterial.uniforms.uStateTexture.value = initTexture;
    renderer.setRenderTarget(cellularRenderTargetA);
    renderer.render(cellularComputeScene, new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1));
    renderer.setRenderTarget(cellularRenderTargetB);
    renderer.render(cellularComputeScene, new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1));
    renderer.setRenderTarget(null);

    cellularCurrentTarget = 'A';
    cellularFrameCount = 0;
  }

  // Update at specified rate
  const updateRate = state.cellularAutomata.updateRate || 10;
  cellularFrameCount++;

  if (cellularFrameCount >= updateRate) {
    cellularFrameCount = 0;

    // Ping-pong rendering
    if (cellularCurrentTarget === 'A') {
      // Read from A, write to B
      cellularAutomataComputeMaterial.uniforms.uStateTexture.value = cellularRenderTargetA.texture;
      renderer.setRenderTarget(cellularRenderTargetB);
      renderer.render(cellularComputeScene, new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1));
      renderer.setRenderTarget(null);

      // Update display to show B
      cellularAutomataDisplayMaterial.uniforms.uStateTexture.value = cellularRenderTargetB.texture;
      cellularCurrentTarget = 'B';
    } else {
      // Read from B, write to A
      cellularAutomataComputeMaterial.uniforms.uStateTexture.value = cellularRenderTargetB.texture;
      renderer.setRenderTarget(cellularRenderTargetA);
      renderer.render(cellularComputeScene, new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1));
      renderer.setRenderTarget(null);

      // Update display to show A
      cellularAutomataDisplayMaterial.uniforms.uStateTexture.value = cellularRenderTargetA.texture;
      cellularCurrentTarget = 'A';
    }
  }
}
