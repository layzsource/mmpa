// Chronelix Living Symbol - Geometry Creation
// IVM Core, Flower of Life, Dharma Wheel, Enveloping Field

import * as THREE from 'three';
import { LIVING_SYMBOL_CONFIG } from './chronelixLivingSymbol.js';

console.log('🔷 chronelixLivingSymbolGeometry.js loaded');

const PHI = 1.618033988749;

// ============================================================================
// IVM GEOMETRY - Stella Octangula (Star Tetrahedron)
// ============================================================================

export function createStellaOctangula(radius) {
  const L = radius;
  const group = new THREE.Group();

  // Two interpenetrating tetrahedra vertices
  const vertices = [
    // Tetrahedron 1
    [L, L, L], [L, -L, -L], [-L, L, -L], [-L, -L, L],
    // Tetrahedron 2 (dual)
    [-L, -L, -L], [-L, L, L], [L, -L, L], [L, L, -L]
  ];

  const points = [];

  // Tetrahedron 1 edges (6 edges)
  points.push(...vertices[0], ...vertices[1]);
  points.push(...vertices[1], ...vertices[2]);
  points.push(...vertices[2], ...vertices[0]);
  points.push(...vertices[0], ...vertices[3]);
  points.push(...vertices[1], ...vertices[3]);
  points.push(...vertices[2], ...vertices[3]);

  // Tetrahedron 2 edges (6 edges)
  points.push(...vertices[4], ...vertices[5]);
  points.push(...vertices[5], ...vertices[6]);
  points.push(...vertices[6], ...vertices[4]);
  points.push(...vertices[4], ...vertices[7]);
  points.push(...vertices[5], ...vertices[7]);
  points.push(...vertices[6], ...vertices[7]);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3));

  const material = new THREE.LineBasicMaterial({
    color: LIVING_SYMBOL_CONFIG.COLORS.FINANCIAL,
    transparent: true,
    opacity: 0.55,
    linewidth: 2
  });

  const lines = new THREE.LineSegments(geometry, material);
  lines.userData.isStella = true;
  group.add(lines);

  return group;
}

// ============================================================================
// IVM GEOMETRY - Cuboctahedron (Vector Equilibrium)
// ============================================================================

export function createCuboctahedron(radius) {
  const L = radius;

  // 12 vertices of cuboctahedron
  const vertices = [
    [L, L, 0], [L, -L, 0], [-L, L, 0], [-L, -L, 0],
    [L, 0, L], [L, 0, -L], [-L, 0, L], [-L, 0, -L],
    [0, L, L], [0, L, -L], [0, -L, L], [0, -L, -L]
  ];

  // 24 edges
  const edges = [
    // Square faces (3 squares)
    [0, 2], [2, 3], [3, 1], [1, 0],
    [4, 6], [6, 7], [7, 5], [5, 4],
    [8, 10], [10, 11], [11, 9], [9, 8],
    // Triangular faces connections
    [0, 4], [0, 9], [2, 8], [2, 7],
    [3, 6], [3, 11], [1, 5], [1, 10],
    [4, 8], [6, 10], [5, 9], [7, 11]
  ];

  const points = [];
  for (const edge of edges) {
    points.push(...vertices[edge[0]], ...vertices[edge[1]]);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3));

  const material = new THREE.LineBasicMaterial({
    color: LIVING_SYMBOL_CONFIG.COLORS.ANLG,
    transparent: true,
    opacity: 0.3,
    linewidth: 2
  });

  const lines = new THREE.LineSegments(geometry, material);
  lines.userData.isCubo = true;

  return lines;
}

// ============================================================================
// FLOWER OF LIFE TEXTURE (37-circle pattern)
// ============================================================================

export function createFlowerOfLifeTexture(size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, size, size);

  const R_outer = size / 2;
  const R_seed = R_outer / 4;

  const centers = [];

  // Central circle
  centers.push([R_outer, R_outer]);

  // First ring (6 circles)
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    centers.push([
      R_outer + R_seed * Math.cos(angle),
      R_outer + R_seed * Math.sin(angle)
    ]);
  }

  // Second ring (12 circles)
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    // Outer petals
    centers.push([
      R_outer + 2 * R_seed * Math.cos(angle),
      R_outer + 2 * R_seed * Math.sin(angle)
    ]);
    // Between petals
    const angleHalf = angle + Math.PI / 6;
    centers.push([
      R_outer + R_seed * Math.cos(angleHalf),
      R_outer + R_seed * Math.sin(angleHalf)
    ]);
  }

  // Third ring (18 circles)
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    // Outer ring
    centers.push([
      R_outer + 3 * R_seed * Math.cos(angle),
      R_outer + 3 * R_seed * Math.sin(angle)
    ]);
    // Middle positions
    const angleHalf = angle + Math.PI / 6;
    centers.push([
      R_outer + 2 * R_seed * Math.cos(angleHalf),
      R_outer + 2 * R_seed * Math.sin(angleHalf)
    ]);
  }

  // Layer 1: Soft glow
  ctx.strokeStyle = 'rgba(255, 200, 87, 0.4)';
  ctx.lineWidth = 10;
  ctx.shadowBlur = 10;
  ctx.shadowColor = 'rgba(255, 200, 87, 0.8)';

  for (const center of centers) {
    ctx.beginPath();
    ctx.arc(center[0], center[1], R_seed, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Layer 2: Sharp detail
  ctx.strokeStyle = '#ffc857';
  ctx.lineWidth = 4;
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = 'lighter';

  for (const center of centers) {
    ctx.beginPath();
    ctx.arc(center[0], center[1], R_seed, 0, 2 * Math.PI);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ============================================================================
// FLOWER OF LIFE BASE PLATE
// ============================================================================

export function createFlowerOfLifePlate(radius, yPosition) {
  const geometry = new THREE.CircleGeometry(radius, 64);
  const texture = createFlowerOfLifeTexture();

  const material = new THREE.MeshStandardMaterial({
    color: 0x080808,
    emissive: LIVING_SYMBOL_CONFIG.COLORS.FINANCIAL,
    emissiveMap: texture,
    emissiveIntensity: 1.5,
    side: THREE.FrontSide,
    metalness: 0.9,
    roughness: 0.1
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2; // Flat on XZ plane
  mesh.position.y = yPosition;
  mesh.userData.isFlowerOfLife = true;

  return mesh;
}

// ============================================================================
// DHARMA WHEEL (Top output/consciousness symbol)
// ============================================================================

export function createDharmaWheel(radius, yPosition) {
  const group = new THREE.Group();

  // Rim
  const rimGeometry = new THREE.TorusGeometry(radius, 0.12, 10, 64);
  const rimMaterial = new THREE.MeshBasicMaterial({
    color: LIVING_SYMBOL_CONFIG.COLORS.FINANCIAL,
    transparent: true,
    opacity: 0.35
  });
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.rotation.x = Math.PI / 2;
  group.add(rim);

  // 8 spokes
  const spokeGeometry = new THREE.CylinderGeometry(0.08, 0.08, radius * 0.86, 8);
  for (let i = 0; i < 8; i++) {
    const spoke = new THREE.Mesh(spokeGeometry, new THREE.MeshBasicMaterial({
      color: LIVING_SYMBOL_CONFIG.COLORS.FINANCIAL,
      transparent: true,
      opacity: 0.42
    }));
    spoke.rotation.z = Math.PI / 2;
    spoke.rotation.y = i * (Math.PI * 2 / 8);
    group.add(spoke);
  }

  // Central hub
  const hub = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 20, 12),
    new THREE.MeshBasicMaterial({
      color: LIVING_SYMBOL_CONFIG.COLORS.FINANCIAL,
      transparent: true,
      opacity: 0.95
    })
  );
  group.add(hub);

  // Symbol (Φ for golden ratio)
  const symbolCanvas = document.createElement('canvas');
  symbolCanvas.width = symbolCanvas.height = 128;
  const ctx = symbolCanvas.getContext('2d');
  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = '#ffc857';
  ctx.font = "bold 80px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText('Φ', 64, 68);

  const symbolTexture = new THREE.CanvasTexture(symbolCanvas);
  const symbolMaterial = new THREE.MeshBasicMaterial({
    map: symbolTexture,
    color: LIVING_SYMBOL_CONFIG.COLORS.FINANCIAL,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide
  });

  const symbolPlane = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), symbolMaterial);
  symbolPlane.rotation.x = Math.PI / 2;
  symbolPlane.position.y = 0.15;
  group.add(symbolPlane);

  group.position.y = yPosition;
  group.userData.isDharmaWheel = true;

  return group;
}

// ============================================================================
// ENVELOPING CHESTAHEDRON FIELD
// ============================================================================

export function createEnvelopingChestahedron(yTop, yBottom, scale = 1.0) {
  // Chestahedron vertices (7 vertices)
  const CHESTA_VERTS = [
    [0.0000, 3.1492, 0.0000],  // Apex
    [1.7915, 0.8123, 0.0000],  // Base ring
    [-0.8957, 0.8123, 1.5501],
    [-0.8957, 0.8123, -1.5501],
    [1.1566, -1.7456, 2.0034],  // Bottom ring
    [-2.3133, -1.7456, 0.0000],
    [1.1566, -1.7456, -2.0034],
  ];

  const CH_HEIGHT = 3.1492 - (-1.7456);
  const targetHeight = yTop - yBottom;
  const requiredScale = (targetHeight / CH_HEIGHT) * scale;
  const yCenter = (yTop + yBottom) / 2;

  // Create geometry
  const vertices = [];
  for (const v of CHESTA_VERTS) {
    const x = v[0] * requiredScale;
    const y = (v[1] - 0.7018) * requiredScale; // Center Y
    const z = v[2] * requiredScale;
    vertices.push(x, y, z);
  }

  // Face indices
  const indices = [
    0, 1, 4,
    0, 4, 2,
    0, 2, 5,
    0, 5, 3,
    1, 4, 6,
    2, 5, 4,
    3, 6, 5,
    4, 5, 6
  ];

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
  geometry.setIndex(indices);
  geometry.rotateY(-Math.PI / 6);
  geometry.rotateX(Math.PI); // Flip apex up
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color: LIVING_SYMBOL_CONFIG.COLORS.FIELD,
    emissive: LIVING_SYMBOL_CONFIG.COLORS.FINANCIAL,
    emissiveIntensity: 0.2,
    metalness: 0.1,
    roughness: 0.2,
    transparent: true,
    opacity: 0.05,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = yCenter;

  // Add edges for definition
  const edges = new THREE.EdgesGeometry(geometry);
  const edgeLines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
    color: LIVING_SYMBOL_CONFIG.COLORS.FINANCIAL,
    transparent: true,
    opacity: 0.1
  }));
  mesh.add(edgeLines);

  mesh.userData.isEnvelopingField = true;

  return mesh;
}

// ============================================================================
// PHI VERTICAL LINE (Golden ratio axis)
// ============================================================================

export function createPhiLine(yBottom, yTop) {
  const length = yTop - yBottom;
  const geometry = new THREE.CylinderGeometry(0.18, 0.18, Math.abs(length), 12);
  const material = new THREE.MeshBasicMaterial({
    color: LIVING_SYMBOL_CONFIG.COLORS.PHI_LINE,
    transparent: true,
    opacity: 0.65
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = (yTop + yBottom) / 2;
  mesh.userData.isPhiLine = true;

  return mesh;
}

// ============================================================================
// CENTRAL AXIS (Subtle reference line)
// ============================================================================

export function createCenterAxis(yBottom, yTop) {
  const length = yTop - yBottom;
  const geometry = new THREE.CylinderGeometry(0.06, 0.06, Math.abs(length), 8);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.12
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = (yTop + yBottom) / 2;
  mesh.userData.isCenterAxis = true;

  return mesh;
}

console.log('✅ chronelixLivingSymbolGeometry.js ready');
