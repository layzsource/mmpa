// Bioacoustic Visualizer: Render Currents & Forms on Sp(2,ℝ)/Z₂
// Phase 3: Visual representation of differential geometry analysis
// Integrates mathematical analysis with particle system

import * as THREE from 'three';

console.log('👁️ bioacousticVisualizer.js loaded');

/**
 * Bioacoustic Visualizer
 *
 * Renders mathematical structures on the symplectic manifold:
 * - Currents (1-currents as trajectories through phase space)
 * - Differential forms (color-coded particle fields)
 * - Persistent homology features (barcodes as visual markers)
 * - Phase space structure (manifold surface)
 */
export class BioacousticVisualizer {
  constructor(scene, symplecticManifold) {
    console.log('👁️ Initializing Bioacoustic Visualizer...');

    this.scene = scene;
    this.manifold = symplecticManifold;

    // Visualization objects
    this.currentParticles = null;
    this.formField = null;
    this.homologyMarkers = [];
    this.trajectoryLines = [];

    // Visualization settings
    this.settings = {
      showCurrents: true,
      showForms: true,
      showHomology: true,
      currentParticleSize: 0.08,
      currentParticleColor: 0x00ffaa,
      formFieldOpacity: 0.6,
      trajectoryWidth: 2,
      homologyMarkerSize: 0.15
    };

    // Create visualization groups
    this.currentsGroup = new THREE.Group();
    this.formsGroup = new THREE.Group();
    this.homologyGroup = new THREE.Group();

    this.currentsGroup.name = 'BioacousticCurrents';
    this.formsGroup.name = 'BioacousticForms';
    this.homologyGroup.name = 'BioacousticHomology';

    scene.add(this.currentsGroup);
    scene.add(this.formsGroup);
    scene.add(this.homologyGroup);

    console.log('👁️ Bioacoustic Visualizer initialized');
  }

  /**
   * Visualize 1-currents as particle trajectories
   *
   * @param {Array} currents - 1-currents from homology module
   */
  visualizeCurrents(currents) {
    if (!this.settings.showCurrents) return;

    // Clear previous trajectories
    this.clearTrajectories();

    console.log(`👁️ Visualizing ${currents.length} currents...`);

    for (const current of currents) {
      if (!current.points || current.points.length < 2) continue;

      // Create particle trail along current
      this.createCurrentTrail(current);

      // Create trajectory line
      this.createTrajectoryLine(current);
    }
  }

  /**
   * Create particle trail along a current (trajectory)
   *
   * @param {object} current - 1-current with points array
   */
  createCurrentTrail(current) {
    const points = current.points;
    const particleCount = Math.min(points.length * 5, 100); // Up to 100 particles per current

    // Create geometry for particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Interpolate along trajectory
    for (let i = 0; i < particleCount; i++) {
      const t = i / (particleCount - 1);
      const idx = Math.floor(t * (points.length - 1));
      const nextIdx = Math.min(idx + 1, points.length - 1);
      const localT = (t * (points.length - 1)) - idx;

      const p1 = points[idx];
      const p2 = points[nextIdx];

      // Interpolate in phase space (q, p)
      const q = p1.q + (p2.q - p1.q) * localT;
      const p = p1.p + (p2.p - p1.p) * localT;

      // Map to manifold coordinates (use simplified mapping)
      const theta = q * Math.PI;
      const phi = Math.PI / 2 + p * 0.5;
      const psi = theta * 2;

      // Project to 3D
      const pos = this.manifold.manifoldToEuclidean(theta, phi, psi);

      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      // Color based on energy (Hamiltonian)
      const energy = (p * p + q * q) / 2;
      const color = new THREE.Color();
      color.setHSL(0.3 + energy * 0.5, 1.0, 0.6); // Green to blue

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create material
    const material = new THREE.PointsMaterial({
      size: this.settings.currentParticleSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    // Create points object
    const points3D = new THREE.Points(geometry, material);
    this.currentsGroup.add(points3D);
  }

  /**
   * Create line rendering of trajectory
   *
   * @param {object} current - 1-current with points array
   */
  createTrajectoryLine(current) {
    const points = current.points;
    const positions = [];

    for (const point of points) {
      const theta = point.q * Math.PI;
      const phi = Math.PI / 2 + point.p * 0.5;
      const psi = theta * 2;

      const pos = this.manifold.manifoldToEuclidean(theta, phi, psi);
      positions.push(pos);
    }

    // Create line geometry
    const geometry = new THREE.BufferGeometry().setFromPoints(positions);

    const material = new THREE.LineBasicMaterial({
      color: this.settings.currentParticleColor,
      linewidth: this.settings.trajectoryWidth,
      transparent: true,
      opacity: 0.4
    });

    const line = new THREE.Line(geometry, material);
    this.currentsGroup.add(line);
    this.trajectoryLines.push(line);
  }

  /**
   * Visualize differential 2-forms as color field
   *
   * @param {Array} twoForms - 2-forms from differential forms computer
   */
  visualizeForms(twoForms) {
    if (!this.settings.showForms || !twoForms || twoForms.length === 0) return;

    console.log(`👁️ Visualizing ${twoForms.length} 2-form frames...`);

    // Clear previous form field
    this.clearFormField();

    // Sample most recent frame
    const latestFrame = twoForms[twoForms.length - 1];
    if (!latestFrame || latestFrame.length === 0) return;

    // Create particle field from form values
    const particleCount = Math.min(latestFrame.length, 500);
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const form = latestFrame[i];
      if (!form) continue;

      // Map form coordinates to manifold
      const freq = form.frequency || i;
      const time = form.time || 0;

      const theta = (freq / particleCount) * 2 * Math.PI;
      const phi = Math.PI / 2;
      const psi = theta * 2;

      const pos = this.manifold.manifoldToEuclidean(theta, phi, psi);

      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      // Color based on form value (coefficient of dq ∧ dp)
      const formValue = form.value || 0;
      const color = new THREE.Color();

      // Red for positive, blue for negative
      if (formValue > 0) {
        color.setHSL(0.0, 1.0, 0.5 + Math.min(formValue, 0.5));
      } else {
        color.setHSL(0.6, 1.0, 0.5 + Math.min(Math.abs(formValue), 0.5));
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Size based on magnitude
      sizes[i] = this.settings.currentParticleSize * (1 + Math.abs(formValue) * 2);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: this.settings.currentParticleSize * 0.5,
      vertexColors: true,
      transparent: true,
      opacity: this.settings.formFieldOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.formField = new THREE.Points(geometry, material);
    this.formsGroup.add(this.formField);
  }

  /**
   * Visualize persistent homology barcodes as markers
   *
   * @param {Array} barcodes - Persistent homology barcodes
   */
  visualizeHomology(barcodes) {
    if (!this.settings.showHomology || !barcodes || barcodes.length === 0) return;

    console.log(`👁️ Visualizing ${barcodes.length} homology features...`);

    // Clear previous markers
    this.clearHomologyMarkers();

    // Show top 10 most persistent features
    const topFeatures = barcodes.slice(0, 10);

    for (let i = 0; i < topFeatures.length; i++) {
      const barcode = topFeatures[i];

      // Position marker at birth/death positions on manifold
      const birthTheta = barcode.birth * 2 * Math.PI;
      const deathTheta = barcode.death * 2 * Math.PI;

      // Create marker at birth
      this.createHomologyMarker(birthTheta, 0x00ff00, barcode.persistence);

      // Create marker at death
      this.createHomologyMarker(deathTheta, 0xff0000, barcode.persistence);

      // Connect birth-death with line
      this.createBirthDeathLine(birthTheta, deathTheta, barcode.persistence);
    }
  }

  /**
   * Create homology feature marker
   */
  createHomologyMarker(theta, color, persistence) {
    const phi = Math.PI / 2;
    const psi = theta * 2;

    const pos = this.manifold.manifoldToEuclidean(theta, phi, psi);

    const geometry = new THREE.SphereGeometry(this.settings.homologyMarkerSize, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.8
    });

    const marker = new THREE.Mesh(geometry, material);
    marker.position.copy(pos);

    // Scale by persistence
    const scale = 0.5 + persistence * 1.5;
    marker.scale.setScalar(scale);

    this.homologyGroup.add(marker);
    this.homologyMarkers.push(marker);
  }

  /**
   * Create line between birth and death of homology feature
   */
  createBirthDeathLine(birthTheta, deathTheta, persistence) {
    const phi = Math.PI / 2;

    const birthPos = this.manifold.manifoldToEuclidean(birthTheta, phi, birthTheta * 2);
    const deathPos = this.manifold.manifoldToEuclidean(deathTheta, phi, deathTheta * 2);

    const geometry = new THREE.BufferGeometry().setFromPoints([birthPos, deathPos]);
    const material = new THREE.LineBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.3 + persistence * 0.5,
      linewidth: 2
    });

    const line = new THREE.Line(geometry, material);
    this.homologyGroup.add(line);
  }

  /**
   * Update visualization from analyzer state
   *
   * @param {object} analyzer - BioacousticAnalyzer instance
   */
  updateFromAnalyzer(analyzer) {
    if (!analyzer || !analyzer.currentAnalysis) return;

    const analysis = analyzer.currentAnalysis;

    // Visualize currents
    if (analyzer.homology && analyzer.homology.currents[1].length > 0) {
      this.visualizeCurrents(analyzer.homology.currents[1]);
    }

    // Visualize forms
    if (analysis.forms && analysis.forms.twoForms) {
      this.visualizeForms(analysis.forms.twoForms);
    }

    // Visualize homology
    if (analysis.barcodes && analysis.barcodes.length > 0) {
      this.visualizeHomology(analysis.barcodes);
    }
  }

  /**
   * Clear all trajectories
   */
  clearTrajectories() {
    while (this.currentsGroup.children.length > 0) {
      const child = this.currentsGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      this.currentsGroup.remove(child);
    }
    this.trajectoryLines = [];
  }

  /**
   * Clear form field
   */
  clearFormField() {
    while (this.formsGroup.children.length > 0) {
      const child = this.formsGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      this.formsGroup.remove(child);
    }
    this.formField = null;
  }

  /**
   * Clear homology markers
   */
  clearHomologyMarkers() {
    while (this.homologyGroup.children.length > 0) {
      const child = this.homologyGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      this.homologyGroup.remove(child);
    }
    this.homologyMarkers = [];
  }

  /**
   * Clear all visualizations
   */
  clear() {
    this.clearTrajectories();
    this.clearFormField();
    this.clearHomologyMarkers();
    console.log('👁️ Visualizations cleared');
  }

  /**
   * Set visibility of visualization layers
   */
  setVisibility(currents, forms, homology) {
    this.settings.showCurrents = currents;
    this.settings.showForms = forms;
    this.settings.showHomology = homology;

    this.currentsGroup.visible = currents;
    this.formsGroup.visible = forms;
    this.homologyGroup.visible = homology;
  }

  /**
   * Dispose of all resources
   */
  dispose() {
    this.clear();
    this.scene.remove(this.currentsGroup);
    this.scene.remove(this.formsGroup);
    this.scene.remove(this.homologyGroup);
    console.log('👁️ Visualizer disposed');
  }
}

console.log('👁️ Bioacoustic Visualizer module ready');
