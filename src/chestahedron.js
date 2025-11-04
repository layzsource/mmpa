console.log("💎 chestahedron.js loaded");

/**
 * MMPA Chestahedron - The Heart Geometry
 *
 * The Infallible 7-Face Model (Improved Implementation)
 * Based on computational geometry with Z-up convention
 *
 * The Heart serves as:
 * - The Sensor (12-edge chromatic deconstruction)
 * - The Periaktos (revolving stage for archetype transitions)
 * - The Axis of Being (36° tilt defines authentic rotation)
 */

import * as THREE from 'three';

// ============================================================================
// INVIOLABLE VERTEX COORDINATES (Computational Geometry, Z-up)
// ============================================================================

const V_FACTOR = 1.0; // Scale factor applied to normalized set

/**
 * The 7 vertices of the Chestahedron
 * Derived from computational geometry, normalized. Z is UP axis.
 */
const V_SET = [
    // V0: Apex
    [0.000000, 0.000000, 3.149206],

    // V1, V2, V3: Mid-Ring
    [1.791500, 0.000000, 0.812302],
    [-0.895750, 1.550186, 0.812302],
    [-0.895750, -1.550186, 0.812302],

    // V4, V5, V6: Lower Base Ring
    [1.156680, 2.003440, -1.745670],
    [-2.313360, 0.000000, -1.745670],
    [1.156680, -2.003440, -1.745670]
];

// Convert to THREE.Vector3 array with scale factor
const VERTICES = V_SET.map(v => new THREE.Vector3(
    v[0] * V_FACTOR,
    v[1] * V_FACTOR,
    v[2] * V_FACTOR
));

// Vertex indices for clarity
export const V = {
  APEX: 0,
  MID1: 1,
  MID2: 2,
  MID3: 3,
  BASE1: 4,
  BASE2: 5,
  BASE3: 6
};

// ============================================================================
// GEOMETRY SCALING AND CENTERING
// ============================================================================

const CH_Z_APEX_UNSCALED = 3.149206;
const CH_Z_BASE_UNSCALED = -1.745670;
const CH_Z_HEIGHT_UNSCALED = CH_Z_APEX_UNSCALED - CH_Z_BASE_UNSCALED; // 4.894876

// Calculate the center Z to position the Chestahedron geometry around the origin (0,0,0)
const CH_Z_CENTER_UNSCALED = (CH_Z_APEX_UNSCALED + CH_Z_BASE_UNSCALED) / 2; // 0.701768
const CH_CENTER_Z = CH_Z_CENTER_UNSCALED * V_FACTOR; // 0.701768

// ============================================================================
// THE AXIS OF BEING - 36° Sacred Tilt
// ============================================================================

export const AXIS_OF_BEING = {
  TILT_ANGLE: 36 * Math.PI / 180,  // 36 degrees in radians
  TILT_AXIS: 'x'  // Applied to X-axis
};

// ============================================================================
// GEOMETRY CONSTRUCTION
// ============================================================================

/**
 * Creates the Chestahedron geometry (7-sided polyhedron) with distinct material groups for each face.
 * @param {number} scale - Overall scale multiplier
 * @returns {THREE.BufferGeometry} The Chestahedron geometry
 */
function createChestahedronGeometry(scale = 1.0) {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    let faceIndex = 0;
    let offset = 0;

    // Helper function to add a triangle's vertices and assign a face group
    const addTri = (i1, i2, i3, currentFaceIndex) => {
        const v1 = VERTICES[i1];
        const v2 = VERTICES[i2];
        const v3 = VERTICES[i3];

        positions.push(
            v1.x * scale, v1.y * scale, v1.z * scale,
            v2.x * scale, v2.y * scale, v2.z * scale,
            v3.x * scale, v3.y * scale, v3.z * scale
        );

        geometry.addGroup(offset, 3, currentFaceIndex);
        offset += 3;
    };

    // Helper function to add a kite (quadrilateral) face, split into two triangles
    const addKite = (a, b, c, d, currentFaceIndex) => {
        addTri(a, b, c, currentFaceIndex);
        addTri(a, c, d, currentFaceIndex);
    };

    // 1. Kite Faces (3 Kites = 3 Faces)
    addKite(V.APEX, V.MID1, V.BASE1, V.MID2, faceIndex++); // Kite 1 - Face 0
    addKite(V.APEX, V.MID2, V.BASE2, V.MID3, faceIndex++); // Kite 2 - Face 1
    addKite(V.APEX, V.MID3, V.BASE3, V.MID1, faceIndex++); // Kite 3 - Face 2

    // 2. Equilateral Triangle Faces (3 Sides + 1 Base = 4 Faces)
    addTri(V.MID1, V.BASE1, V.BASE3, faceIndex++);    // Side Triangle 1 - Face 3
    addTri(V.MID2, V.BASE2, V.BASE1, faceIndex++);    // Side Triangle 2 - Face 4
    addTri(V.MID3, V.BASE3, V.BASE2, faceIndex++);    // Side Triangle 3 - Face 5
    addTri(V.BASE1, V.BASE2, V.BASE3, faceIndex++);   // Base Triangle - Face 6

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    // Apply the central Z-offset to center the Chestahedron geometry around the origin
    geometry.translate(0, 0, -CH_CENTER_Z * scale);

    return geometry;
}

/**
 * Creates the Chestahedron mesh with uniform gold material
 * @param {number} scale - Overall scale multiplier
 * @param {object} materialOptions - Material property overrides
 * @returns {THREE.Mesh} The Chestahedron mesh
 */
export function createChestahedron(scale = 1.0, materialOptions = {}) {
  const geometry = createChestahedronGeometry(scale);

  // Uniform Gold Material (Matches Tonal Tower aesthetic)
  const GOLD_COLOR = 0xffc01f;
  const NUM_FACES = 7;

  const defaultMaterialProps = {
    color: GOLD_COLOR,
    metalness: 0.95,
    roughness: 0.4,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1.0,
    depthWrite: true
  };

  // Merge with user options
  const materialProps = { ...defaultMaterialProps, ...materialOptions };

  // Create 7 identical gold materials (one per face group)
  const materials = [];
  for (let i = 0; i < NUM_FACES; i++) {
    materials.push(new THREE.MeshStandardMaterial(materialProps));
  }

  const mesh = new THREE.Mesh(geometry, materials);

  // Apply the 36° tilt on the X-axis (The Axis of Being)
  mesh.rotation[AXIS_OF_BEING.TILT_AXIS] = AXIS_OF_BEING.TILT_ANGLE;

  console.log("💎 Chestahedron created with gold material and 36° tilt");
  return mesh;
}

/**
 * Creates a wireframe overlay for the Chestahedron
 * @param {number} scale - Overall scale multiplier
 * @param {number} color - Wireframe color (hex)
 * @param {number} opacity - Wireframe opacity (0-1)
 * @returns {THREE.LineSegments} The wireframe mesh
 */
export function createChestahedronWireframe(scale = 1.0, color = 0xffffff, opacity = 0.3) {
  const geometry = createChestahedronGeometry(scale);
  const wireframeGeometry = new THREE.WireframeGeometry(geometry);

  const material = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: opacity,
    linewidth: 1
  });

  const wireframe = new THREE.LineSegments(wireframeGeometry, material);

  // Apply the same 36° tilt
  wireframe.rotation[AXIS_OF_BEING.TILT_AXIS] = AXIS_OF_BEING.TILT_ANGLE;

  return wireframe;
}

/**
 * Creates the 12 edge sensors (Mantis Shrimp Eye)
 * @param {number} scale - Overall scale multiplier
 * @returns {THREE.Group} Group containing all edge sensor visualizations
 */
export function createEdgeSensors(scale = 1.0) {
  const group = new THREE.Group();

  // Define the 12 edges of the Chestahedron
  const edges = [
    // Edges from Apex to Mid-Ring (3 edges)
    [V.APEX, V.MID1],
    [V.APEX, V.MID2],
    [V.APEX, V.MID3],

    // Edges from Mid-Ring to Base (6 edges)
    [V.MID1, V.BASE1],
    [V.MID1, V.BASE3],
    [V.MID2, V.BASE1],
    [V.MID2, V.BASE2],
    [V.MID3, V.BASE2],
    [V.MID3, V.BASE3],

    // Edges of Base Triangle (3 edges)
    [V.BASE1, V.BASE2],
    [V.BASE2, V.BASE3],
    [V.BASE3, V.BASE1]
  ];

  // Create a small sphere at the midpoint of each edge
  const sensorGeometry = new THREE.SphereGeometry(0.05 * scale, 8, 8);
  const sensorMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 0.5,
    metalness: 0.8,
    roughness: 0.2
  });

  edges.forEach((edge, index) => {
    const v1 = VERTICES[edge[0]].clone().multiplyScalar(scale);
    const v2 = VERTICES[edge[1]].clone().multiplyScalar(scale);

    // Calculate midpoint
    const midpoint = new THREE.Vector3()
      .addVectors(v1, v2)
      .multiplyScalar(0.5);

    // Apply centering offset
    midpoint.z -= CH_CENTER_Z * scale;

    const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial.clone());
    sensor.position.copy(midpoint);
    sensor.userData.edgeIndex = index;

    group.add(sensor);
  });

  // Apply the same 36° tilt
  group.rotation[AXIS_OF_BEING.TILT_AXIS] = AXIS_OF_BEING.TILT_ANGLE;

  console.log("📡 Created 12 edge sensors (Mantis Shrimp Eye)");
  return group;
}

/**
 * Get vertex positions (useful for external calculations)
 * @param {number} scale - Overall scale multiplier
 * @returns {Array<THREE.Vector3>} Array of vertex positions
 */
export function getVertexPositions(scale = 1.0) {
  return VERTICES.map(v => {
    const scaled = v.clone().multiplyScalar(scale);
    scaled.z -= CH_CENTER_Z * scale; // Apply centering
    return scaled;
  });
}

console.log("💎 chestahedron.js ready - Infallible 7-Face Model (Improved)");
