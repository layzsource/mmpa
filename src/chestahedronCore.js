// src/chestahedronCore.js
// Chestahedron geometry - the heart-shaped polyhedron at the center of chronelix
// 7 faces, 12 edges, pentagonal star cross-section
// Generator of 5-fold → 12-fold emergence

import * as THREE from 'three';

console.log("💎 chestahedronCore.js loaded");

/**
 * Chestahedron geometry generator
 * Based on Frank Chester's discovery - a 7-sided polyhedron with heart-like form
 * Pentagonal base with equilateral triangular faces rising to apex
 */
export class ChestahedronCore {
  constructor(scene, params = {}) {
    this.scene = scene;

    // Geometry parameters
    this.baseRadius = params.baseRadius || 8.0;
    this.height = params.height || 12.0;
    this.position = params.position || new THREE.Vector3(0, 0, 0);

    // Visual state
    this.visible = true;
    this.wireframeMode = true;
    this.showCrossSections = true;
    this.rotationSpeed = 0.001;

    // Colors
    this.edgeColor = new THREE.Color(0x14b8a6); // Teal
    this.faceColor = new THREE.Color(0x2a2b2e); // Dark gray
    this.crossSectionColor = new THREE.Color(0x7c3aed); // Purple

    // Three.js objects
    this.group = new THREE.Group();
    this.edgesGroup = new THREE.Group();
    this.facesGroup = new THREE.Group();
    this.crossSectionGroup = new THREE.Group();

    // Vertices (will be calculated)
    this.vertices = [];

    this.init();

    console.log("💎 Chestahedron initialized");
  }

  /**
   * Initialize the chestahedron geometry
   */
  init() {
    this.calculateVertices();
    this.createGeometry();

    this.group.position.copy(this.position);
    this.scene.add(this.group);
  }

  /**
   * Calculate the vertices of the chestahedron
   * Base: regular pentagon at y=0
   * Apex: single point at y=height
   * Upper ring: pentagon between base and apex
   */
  calculateVertices() {
    this.vertices = [];

    const pentagonAngle = (Math.PI * 2) / 5; // 72 degrees

    // Base pentagon (5 vertices at y = height/2) - pointing toward AM λ (top)
    for (let i = 0; i < 5; i++) {
      const angle = i * pentagonAngle;
      const x = this.baseRadius * Math.cos(angle);
      const z = this.baseRadius * Math.sin(angle);
      this.vertices.push(new THREE.Vector3(x, this.height / 2, z));
    }

    // Middle pentagon (5 vertices at y = -height/4)
    // Rotated 36 degrees (half a step) for alternation
    const middleRadius = this.baseRadius * 0.6;
    const middleY = -this.height / 4;
    for (let i = 0; i < 5; i++) {
      const angle = i * pentagonAngle + pentagonAngle / 2; // Rotated
      const x = middleRadius * Math.cos(angle);
      const z = middleRadius * Math.sin(angle);
      this.vertices.push(new THREE.Vector3(x, middleY, z));
    }

    // Apex (1 vertex at y = -height/2) - pointing toward PM λ (bottom)
    this.vertices.push(new THREE.Vector3(0, -this.height / 2, 0));

    console.log(`💎 Generated ${this.vertices.length} vertices`);
  }

  /**
   * Create the 3D geometry - edges and faces
   */
  createGeometry() {
    this.createEdges();
    this.createFaces();
    this.createCrossSections();

    this.group.add(this.edgesGroup);
    this.group.add(this.facesGroup);
    this.group.add(this.crossSectionGroup);
  }

  /**
   * Create the 12 edges
   */
  createEdges() {
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: this.edgeColor,
      linewidth: 2,
      transparent: true,
      opacity: 0.8
    });

    const edges = [];

    // Base pentagon edges (5 edges)
    for (let i = 0; i < 5; i++) {
      edges.push([i, (i + 1) % 5]);
    }

    // Base to upper pentagon (5 edges)
    for (let i = 0; i < 5; i++) {
      edges.push([i, 5 + i]);
    }

    // Upper pentagon to apex (5 edges, but we'll connect alternating)
    for (let i = 0; i < 5; i++) {
      edges.push([5 + i, 10]); // Upper vertex to apex
    }

    // Create line segments
    edges.forEach(([startIdx, endIdx]) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        this.vertices[startIdx],
        this.vertices[endIdx]
      ]);

      const line = new THREE.Line(geometry, edgeMaterial);
      this.edgesGroup.add(line);
    });

    console.log(`💎 Created ${edges.length} edges`);
  }

  /**
   * Create the 7 faces (1 base pentagon + 5 triangular sides + 1 composite top)
   */
  createFaces() {
    const faceMaterial = new THREE.MeshBasicMaterial({
      color: this.faceColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
      wireframe: false
    });

    // Base pentagon face
    const baseGeometry = new THREE.BufferGeometry();
    const baseVertices = new Float32Array(15); // 5 vertices * 3 components
    for (let i = 0; i < 5; i++) {
      const v = this.vertices[i];
      baseVertices[i * 3] = v.x;
      baseVertices[i * 3 + 1] = v.y;
      baseVertices[i * 3 + 2] = v.z;
    }
    baseGeometry.setAttribute('position', new THREE.BufferAttribute(baseVertices, 3));
    baseGeometry.setIndex([0, 1, 2, 0, 2, 3, 0, 3, 4]); // Triangulate pentagon
    baseGeometry.computeVertexNormals();

    const baseFace = new THREE.Mesh(baseGeometry, faceMaterial);
    this.facesGroup.add(baseFace);

    // Side triangular faces (5 faces connecting base to upper ring)
    for (let i = 0; i < 5; i++) {
      const v1 = this.vertices[i];
      const v2 = this.vertices[(i + 1) % 5];
      const v3 = this.vertices[5 + i];

      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        v1.x, v1.y, v1.z,
        v2.x, v2.y, v2.z,
        v3.x, v3.y, v3.z
      ]);
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.setIndex([0, 1, 2]);
      geometry.computeVertexNormals();

      const face = new THREE.Mesh(geometry, faceMaterial);
      this.facesGroup.add(face);
    }

    // Upper faces to apex (5 triangular faces)
    for (let i = 0; i < 5; i++) {
      const v1 = this.vertices[5 + i];
      const v2 = this.vertices[5 + (i + 1) % 5];
      const v3 = this.vertices[10]; // Apex

      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        v1.x, v1.y, v1.z,
        v2.x, v2.y, v2.z,
        v3.x, v3.y, v3.z
      ]);
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.setIndex([0, 1, 2]);
      geometry.computeVertexNormals();

      const face = new THREE.Mesh(geometry, faceMaterial);
      this.facesGroup.add(face);
    }

    console.log("💎 Created 7 faces");
  }

  /**
   * Create pentagonal star cross-sections at various heights
   */
  createCrossSections() {
    const crossSectionMaterial = new THREE.LineBasicMaterial({
      color: this.crossSectionColor,
      linewidth: 1,
      transparent: true,
      opacity: 0.4
    });

    // Create several cross-sections at different heights
    const numSections = 7;
    for (let i = 0; i < numSections; i++) {
      const t = i / (numSections - 1); // 0 to 1
      const y = -this.height / 2 + t * this.height;

      // Calculate radius at this height (interpolate between base and apex)
      const radius = this.baseRadius * (1 - t * 0.7);

      if (radius > 0.1) {
        const crossSection = this.createPentagonalCrossSection(y, radius);
        this.crossSectionGroup.add(crossSection);
      }
    }

    this.crossSectionGroup.visible = this.showCrossSections;
  }

  /**
   * Create a pentagonal cross-section at given height and radius
   */
  createPentagonalCrossSection(y, radius) {
    const points = [];
    const numPoints = 5;
    const angleStep = (Math.PI * 2) / numPoints;

    for (let i = 0; i <= numPoints; i++) {
      const angle = i * angleStep;
      points.push(new THREE.Vector3(
        radius * Math.cos(angle),
        y,
        radius * Math.sin(angle)
      ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: this.crossSectionColor,
      linewidth: 1,
      transparent: true,
      opacity: 0.3
    });

    return new THREE.Line(geometry, material);
  }

  /**
   * Update animation
   */
  update(time) {
    if (!this.visible) return;

    // Gentle rotation to show the form
    this.group.rotation.y += this.rotationSpeed;
  }

  /**
   * Toggle visibility
   */
  toggle() {
    this.visible = !this.visible;
    this.group.visible = this.visible;
  }

  /**
   * Toggle cross-sections
   */
  toggleCrossSections() {
    this.showCrossSections = !this.showCrossSections;
    this.crossSectionGroup.visible = this.showCrossSections;
  }

  /**
   * Set rotation speed
   */
  setRotationSpeed(speed) {
    this.rotationSpeed = speed;
  }

  /**
   * Dispose of resources
   */
  dispose() {
    this.scene.remove(this.group);

    this.edgesGroup.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });

    this.facesGroup.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });

    this.crossSectionGroup.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });
  }
}

console.log("💎 ChestahedronCore ready");
