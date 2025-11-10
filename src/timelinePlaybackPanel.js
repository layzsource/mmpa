// Timeline Playback Panel (Phase 13.17)
// Dedicated viewer for playing back recorded timeline sessions
// Side-by-side comparison with live visuals

console.log("⏱️ timelinePlaybackPanel.js loaded");

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getTimeline } from './timelineIntegration.js';
import { createChestahedron, AXIS_OF_BEING } from './chestahedron.js';

/**
 * TimelinePlaybackPanel - Dedicated viewer for timeline playback
 * Opens automatically when timeline playback starts
 */
export class TimelinePlaybackPanel {
  constructor() {
    this.isOpen = false;
    this.panel = null;
    this.canvasContainer = null;

    // Three.js scene for playback
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;

    // Playback state
    this.timeline = null;
    this.animationFrame = null;

    // Chronelix spatial reference system
    this.chronelixGroup = null;
    this.lambdaSymbol = null;
    this.lambdaRotation = 0; // 0 to 2π
    this.selectedPosition = 0; // 0-11 chromatic position
    this.modwheelValue = 0; // 0-127 MIDI value

    // UI elements
    this.infoPanel = null;
    this.timeDisplay = null;
    this.frameDisplay = null;
    this.audioDisplay = null;
    this.mmpaDisplay = null;

    console.log("⏱️ TimelinePlaybackPanel initialized");
  }

  open() {
    if (this.isOpen) return;

    this.timeline = getTimeline();
    if (!this.timeline) {
      console.warn('⏱️ No timeline available');
      return;
    }

    // Create panel container
    this.panel = document.createElement('div');
    this.panel.id = 'timelinePlaybackPanel';
    this.panel.style.cssText = `
      position: fixed;
      top: 60px;
      right: 20px;
      width: 600px;
      height: 700px;
      background: rgba(0, 0, 0, 0.95);
      border: 2px solid #4CAF50;
      border-radius: 8px;
      padding: 15px;
      z-index: 1000;
      font-family: 'Courier New', monospace;
      color: #fff;
      box-shadow: 0 0 30px rgba(76, 175, 80, 0.7);
      display: flex;
      flex-direction: column;
    `;

    // Title bar with close button
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #4CAF50;
    `;

    const title = document.createElement('div');
    title.style.cssText = `
      font-size: 14px;
      font-weight: bold;
      color: #4CAF50;
      text-transform: uppercase;
      letter-spacing: 2px;
    `;
    title.textContent = '⏯️ Timeline Playback Viewer';

    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.cssText = `
      background: none;
      border: 1px solid #4CAF50;
      color: #4CAF50;
      font-size: 18px;
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      transition: all 0.2s;
    `;
    closeButton.onmouseover = () => {
      closeButton.style.background = '#4CAF50';
      closeButton.style.color = '#000';
    };
    closeButton.onmouseout = () => {
      closeButton.style.background = 'none';
      closeButton.style.color = '#4CAF50';
    };
    closeButton.onclick = () => this.close();

    titleBar.appendChild(title);
    titleBar.appendChild(closeButton);
    this.panel.appendChild(titleBar);

    // Canvas container for Three.js renderer
    this.canvasContainer = document.createElement('div');
    this.canvasContainer.style.cssText = `
      width: 100%;
      height: 400px;
      background: #000;
      border: 1px solid #333;
      border-radius: 4px;
      margin-bottom: 10px;
      position: relative;
    `;
    this.panel.appendChild(this.canvasContainer);

    // Info panel for frame data
    this.infoPanel = document.createElement('div');
    this.infoPanel.style.cssText = `
      flex: 1;
      overflow-y: auto;
      font-size: 11px;
      line-height: 1.6;
    `;
    this.panel.appendChild(this.infoPanel);

    // Create display sections
    this.createDisplaySections();

    // Initialize Three.js scene
    this.initThreeJS();

    // Add to document
    document.body.appendChild(this.panel);
    this.isOpen = true;

    // Start render loop
    this.startRenderLoop();

    console.log('⏱️ Timeline Playback Panel opened');
  }

  createDisplaySections() {
    // Lambda Modwheel Control
    const lambdaSection = document.createElement('div');
    lambdaSection.style.cssText = `
      margin-bottom: 15px;
      padding: 10px;
      background: rgba(76, 175, 80, 0.1);
      border: 1px solid #4CAF50;
      border-radius: 4px;
    `;

    const lambdaTitle = document.createElement('div');
    lambdaTitle.textContent = 'λ Lambda Position (Chromatic Modwheel)';
    lambdaTitle.style.cssText = 'color: #FFD700; font-weight: bold; margin-bottom: 8px;';
    lambdaSection.appendChild(lambdaTitle);

    // Slider container
    const sliderContainer = document.createElement('div');
    sliderContainer.style.cssText = 'display: flex; align-items: center; gap: 10px;';

    // Modwheel slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '127';
    slider.value = '0';
    slider.style.cssText = `
      flex: 1;
      height: 6px;
      background: linear-gradient(to right, #00CED1, #9400D3);
      border-radius: 3px;
      outline: none;
      cursor: pointer;
    `;

    // Value display
    const valueDisplay = document.createElement('span');
    valueDisplay.style.cssText = 'color: #FFD700; font-family: monospace; min-width: 80px;';
    valueDisplay.textContent = 'Pos 0 (0°)';

    // Slider input handler
    slider.oninput = (e) => {
      const midiValue = parseInt(e.target.value);
      this.setModwheelPosition(midiValue);
      const position = this.selectedPosition;
      const degrees = Math.round(this.lambdaRotation * 180 / Math.PI);
      valueDisplay.textContent = `Pos ${position} (${degrees}°)`;
    };

    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(valueDisplay);
    lambdaSection.appendChild(sliderContainer);

    this.infoPanel.appendChild(lambdaSection);

    // Time and frame info
    const timeSection = document.createElement('div');
    timeSection.style.marginBottom = '10px';
    this.timeDisplay = document.createElement('div');
    this.timeDisplay.style.color = '#4CAF50';
    this.frameDisplay = document.createElement('div');
    this.frameDisplay.style.color = '#888';
    timeSection.appendChild(this.timeDisplay);
    timeSection.appendChild(this.frameDisplay);
    this.infoPanel.appendChild(timeSection);

    // Audio data
    const audioSection = document.createElement('div');
    audioSection.style.marginBottom = '10px';
    const audioTitle = document.createElement('div');
    audioTitle.textContent = 'Audio Bands:';
    audioTitle.style.cssText = 'color: #4CAF50; font-weight: bold; margin-bottom: 5px;';
    audioSection.appendChild(audioTitle);
    this.audioDisplay = document.createElement('div');
    this.audioDisplay.style.fontFamily = 'monospace';
    audioSection.appendChild(this.audioDisplay);
    this.infoPanel.appendChild(audioSection);

    // MMPA data
    const mmpaSection = document.createElement('div');
    const mmpaTitle = document.createElement('div');
    mmpaTitle.textContent = 'MMPA State:';
    mmpaTitle.style.cssText = 'color: #4CAF50; font-weight: bold; margin-bottom: 5px;';
    mmpaSection.appendChild(mmpaTitle);
    this.mmpaDisplay = document.createElement('div');
    this.mmpaDisplay.style.fontFamily = 'monospace';
    mmpaSection.appendChild(this.mmpaDisplay);
    this.infoPanel.appendChild(mmpaSection);
  }

  /**
   * MMPA Chronelix Waveguide - Pipeline Visualizer
   * Based on φ-spacing and proper AM/PM chirality
   */

  // Chronelix constants
  get CHRONELIX_CONSTANTS() {
    const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio ~1.618034
    const SCALE_FACTOR = 0.8;
    const UNITS_PER_CHAIN = 12; // 12 AM + 12 PM = 24 total
    const HELIX_RADIUS = 15.0;
    const Y_TOTAL_HEIGHT = HELIX_RADIUS * PHI; // φ-based height ~24.27
    const Y_OFFSET_PER_UNIT = Y_TOTAL_HEIGHT / UNITS_PER_CHAIN;
    const TOTAL_ANGLE = 2 * Math.PI;
    const GLOBAL_ROTATION_INCREMENT = TOTAL_ANGLE / UNITS_PER_CHAIN;
    const TWIST_FACTOR = 1.0;
    const LOCAL_TWIST_INCREMENT = GLOBAL_ROTATION_INCREMENT * TWIST_FACTOR;

    // Normalized Chestahedron vertices (Z-up convention)
    const V_SET_UNSCALED = [
      [0.0000, 3.1492, 0.0000],   // V0: Apex
      [1.7915, 0.8123, 0.0000],   // V1: Mid1
      [-0.8957, 0.8123, 1.5501],  // V2: Mid2
      [-0.8957, 0.8123, -1.5501], // V3: Mid3
      [1.1566, -1.7456, 2.0034],  // V4: Base1
      [-2.3133, -1.7456, 0.0000], // V5: Base2
      [1.1566, -1.7456, -2.0034], // V6: Base3
    ];

    const CH_Y_APEX_UNSCALED = 3.1492;
    const CH_Y_BASE_UNSCALED = -1.7456;
    const CH_Y_CENTER = (CH_Y_APEX_UNSCALED + CH_Y_BASE_UNSCALED) / 2 * SCALE_FACTOR;
    const APEX_TO_CENTER_HEIGHT = (CH_Y_APEX_UNSCALED - CH_Y_CENTER/SCALE_FACTOR) * SCALE_FACTOR;
    const BASE_TO_CENTER_HEIGHT = (CH_Y_CENTER/SCALE_FACTOR - CH_Y_BASE_UNSCALED) * SCALE_FACTOR;

    return {
      PHI,
      SCALE_FACTOR,
      UNITS_PER_CHAIN,
      HELIX_RADIUS,
      Y_TOTAL_HEIGHT,
      Y_OFFSET_PER_UNIT,
      GLOBAL_ROTATION_INCREMENT,
      LOCAL_TWIST_INCREMENT,
      V_SET_UNSCALED,
      CH_Y_CENTER,
      APEX_TO_CENTER_HEIGHT,
      BASE_TO_CENTER_HEIGHT,
      TEAL_COLOR: 0x14b8a6,     // AM - Input/Consonance
      VIOLET_COLOR: 0x7c3aed,   // PM - Output/Dissonance
      AMBER_COLOR: 0xfacc15     // Lambda indicator
    };
  }

  /**
   * Create base Chestahedron geometry with chirality support
   * @param {boolean} isChiral - If true, mirrors the geometry (PM chain)
   */
  createBaseChronelixGeometry(isChiral) {
    const C = this.CHRONELIX_CONSTANTS;
    const positions = [];

    // Vertex indices
    const V_APEX = 0, V_MID1 = 1, V_MID2 = 2, V_MID3 = 3;
    const V_BASE1 = 4, V_BASE2 = 5, V_BASE3 = 6;

    // Convert vertices to positions array
    C.V_SET_UNSCALED.forEach(v => {
      positions.push(
        v[0] * C.SCALE_FACTOR * (isChiral ? -1 : 1), // Mirror X for chiral
        v[1] * C.SCALE_FACTOR - C.CH_Y_CENTER,
        v[2] * C.SCALE_FACTOR
      );
    });

    // Face indices (7 faces total)
    let indices = [
      // 3 Kite faces
      V_APEX, V_MID1, V_BASE1, V_APEX, V_BASE1, V_MID2,
      V_APEX, V_MID2, V_BASE2, V_APEX, V_BASE2, V_MID3,
      V_APEX, V_MID3, V_BASE3, V_APEX, V_BASE3, V_MID1,
      // 3 Side triangles + 1 Base triangle
      V_MID1, V_BASE1, V_BASE3,
      V_MID2, V_BASE2, V_BASE1,
      V_MID3, V_BASE3, V_BASE2,
      V_BASE1, V_BASE2, V_BASE3,
    ];

    // Reverse winding order for chiral (mirrored) geometry
    if (isChiral) {
      for (let i = 0; i < indices.length; i += 3) {
        const temp = indices[i + 1];
        indices[i + 1] = indices[i + 2];
        indices[i + 2] = temp;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.rotateY(-Math.PI / 6);
    geometry.computeVertexNormals();

    // Apply centering offset
    geometry.translate(0, 0, -C.CH_Y_CENTER * C.SCALE_FACTOR);

    return geometry;
  }

  /**
   * Create a Chestahedron mesh with wireframe for chronelix unit
   */
  createChronelixMesh(geometry, color, opacity) {
    const material = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.8,
      roughness: 0.1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: opacity,
      wireframe: false
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Add wireframe edges
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
      color: color,
      linewidth: 2.5,
      opacity: 0.8,
      transparent: true
    }));
    mesh.add(line);

    return mesh;
  }

  /**
   * Create one interlocking chain (AM or PM)
   * @param {number} startAngleOffset - Starting angular offset (0 for AM, π for PM)
   * @param {number} color - Chain color (teal or violet)
   * @param {boolean} isChiral - If true, creates mirrored PM chain
   */
  createInterlockingChain(startAngleOffset, color, isChiral) {
    const C = this.CHRONELIX_CONSTANTS;
    const group = new THREE.Group();
    const geometry = this.createBaseChronelixGeometry(isChiral);

    for (let i = 0; i < C.UNITS_PER_CHAIN; i++) {
      // 1. Position on helix (φ-based spacing)
      const globalAngle = (i * C.GLOBAL_ROTATION_INCREMENT) + startAngleOffset;
      const y = (i * C.Y_OFFSET_PER_UNIT) - (C.Y_TOTAL_HEIGHT / 2);
      const x = C.HELIX_RADIUS * Math.cos(globalAngle);
      const z = C.HELIX_RADIUS * Math.sin(globalAngle);

      const mesh = this.createChronelixMesh(geometry, color, 0.5);

      // 2. Local twist
      const localTwist = i * C.LOCAL_TWIST_INCREMENT;
      mesh.rotation.y = globalAngle + Math.PI / 2 + localTwist;

      // 3. Polarity flip for PM chain (base-up)
      if (isChiral) {
        mesh.rotation.x = Math.PI;
      }

      mesh.position.set(x, y, z);
      mesh.userData.chain = isChiral ? 'PM' : 'AM';
      mesh.userData.position = i;

      group.add(mesh);
    }

    return group;
  }

  /**
   * Create transparent cylindrical waveguide (the pipeline itself)
   */
  createCylindricalWaveguide() {
    const C = this.CHRONELIX_CONSTANTS;
    const cylinderRadius = C.HELIX_RADIUS + 3.5;
    const geometry = new THREE.CylinderGeometry(
      cylinderRadius,
      cylinderRadius,
      C.Y_TOTAL_HEIGHT * 1.05,
      64,
      1,
      true // Open-ended
    );

    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.9,
      roughness: 0.1,
      side: THREE.BackSide, // Render interior surface
      transparent: true,
      opacity: 0.05 // Very transparent - shows data flow
    });

    return new THREE.Mesh(geometry, material);
  }

  /**
   * Create continuity caps and lambda symbols
   * Now with teal (AM/input) and violet (PM/output) labels for flow direction
   */
  createContinuityCaps() {
    const C = this.CHRONELIX_CONSTANTS;
    const capsGroup = new THREE.Group();
    const capRadius = C.HELIX_RADIUS + 0.5;

    const capMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    });

    const capGeometry = new THREE.CircleGeometry(capRadius, 32);
    capGeometry.rotateX(-Math.PI / 2); // Lay flat

    // Helper: Create lambda symbol geometry
    const createLambdaGeometry = (size = 4.0) => {
      const lambdaShape = new THREE.Shape();
      lambdaShape.moveTo(-size * 0.5, 0);
      lambdaShape.lineTo(0, size);
      lambdaShape.lineTo(size * 0.5, 0);
      lambdaShape.lineTo(size * 0.3, 0);
      lambdaShape.lineTo(0, size * 0.75);
      lambdaShape.lineTo(-size * 0.3, 0);
      lambdaShape.closePath();

      return new THREE.ExtrudeGeometry(lambdaShape, {
        steps: 1,
        depth: 0.1,
        bevelEnabled: false
      });
    };

    // ═══════════════════════════════════════════════════════════════
    // TOP CAP - AM / INPUT (Teal)
    // ═══════════════════════════════════════════════════════════════
    const yTopCenter = ((C.UNITS_PER_CHAIN - 1) * C.Y_OFFSET_PER_UNIT) - (C.Y_TOTAL_HEIGHT / 2);
    const yTopCap = yTopCenter + C.APEX_TO_CENTER_HEIGHT;

    // Top cap circle
    const topCap = new THREE.Mesh(capGeometry, capMaterial);
    topCap.position.y = yTopCap;
    capsGroup.add(topCap);

    // Teal lambda - AM / Input marker
    const lambdaTopGeometry = createLambdaGeometry(4.0);
    const lambdaTopMaterial = new THREE.MeshBasicMaterial({
      color: C.TEAL_COLOR, // AM color
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });

    const lambdaTopMesh = new THREE.Mesh(lambdaTopGeometry, lambdaTopMaterial);
    lambdaTopMesh.position.set(0, yTopCap + 0.15, 0);
    lambdaTopMesh.rotation.x = -Math.PI / 2;
    lambdaTopMesh.rotation.z = Math.PI / 6;
    capsGroup.add(lambdaTopMesh);

    // Store top lambda for rotation updates (controlled by modwheel)
    this.lambdaMeshTop = lambdaTopMesh;

    // "AM" text label above top cap
    // We'll create a simple text sprite using canvas
    const createTextSprite = (text, color, size = 2.0) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
      ctx.font = 'bold 80px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 64);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(size, size / 2, 1);
      return sprite;
    };

    const amLabel = createTextSprite('λ AM', C.TEAL_COLOR);
    amLabel.position.set(0, yTopCap + 2.5, 0);
    capsGroup.add(amLabel);

    // ═══════════════════════════════════════════════════════════════
    // BOTTOM CAP - PM / OUTPUT (Violet)
    // ═══════════════════════════════════════════════════════════════
    const yBottomCenter = 0 - (C.Y_TOTAL_HEIGHT / 2);
    const yBottomCap = yBottomCenter - C.BASE_TO_CENTER_HEIGHT;

    // Bottom cap circle
    const bottomCap = new THREE.Mesh(capGeometry, capMaterial);
    bottomCap.position.y = yBottomCap;
    capsGroup.add(bottomCap);

    // Violet lambda - PM / Output marker
    const lambdaBottomGeometry = createLambdaGeometry(4.0);
    const lambdaBottomMaterial = new THREE.MeshBasicMaterial({
      color: C.VIOLET_COLOR, // PM color
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });

    const lambdaBottomMesh = new THREE.Mesh(lambdaBottomGeometry, lambdaBottomMaterial);
    lambdaBottomMesh.position.set(0, yBottomCap - 0.15, 0);
    lambdaBottomMesh.rotation.x = -Math.PI / 2;
    lambdaBottomMesh.rotation.z = Math.PI / 6;
    capsGroup.add(lambdaBottomMesh);

    // Store bottom lambda for rotation updates (controlled by modwheel)
    this.lambdaMeshBottom = lambdaBottomMesh;

    // "PM" text label below bottom cap
    const pmLabel = createTextSprite('λ PM', C.VIOLET_COLOR);
    pmLabel.position.set(0, yBottomCap - 2.5, 0);
    capsGroup.add(pmLabel);

    console.log('🧬 Continuity caps created with λ AM (teal/input) and λ PM (violet/output) markers');
    return capsGroup;
  }

  /**
   * Create complete chronelix waveguide system
   * Replaces old sphere-based helix with proper pipeline visualizer
   */
  createChronelixHelix() {
    const C = this.CHRONELIX_CONSTANTS;
    const chronelixGroup = new THREE.Group();

    // 1. Cylindrical waveguide (the pipeline)
    const waveguide = this.createCylindricalWaveguide();
    chronelixGroup.add(waveguide);

    // 2. AM Chain (Input - Teal, Consonance, Right-handed, Apex-up)
    const amChain = this.createInterlockingChain(0, C.TEAL_COLOR, false);
    chronelixGroup.add(amChain);

    // 3. PM Chain (Output - Violet, Dissonance, Left-handed, Base-up)
    const pmChain = this.createInterlockingChain(Math.PI, C.VIOLET_COLOR, true);
    chronelixGroup.add(pmChain);

    // 4. Continuity caps and lambda symbol
    const caps = this.createContinuityCaps();
    chronelixGroup.add(caps);

    // Apply slight tilt for better viewing
    chronelixGroup.rotation.x = -Math.PI / 8;

    console.log('🧬 Chronelix waveguide created: φ-spaced pipeline with AM/PM chains');
    return chronelixGroup;
  }

  /**
   * Create lambda (λ) symbol as interactive tuning needle
   * (Kept for compatibility - now integrated into continuity caps)
   */
  createLambdaSymbol() {
    // Lambda is now part of the caps system
    // Return empty group for compatibility
    return new THREE.Group();
  }

  /**
   * Set lambda position from modwheel input (MIDI 0-127)
   * @param {number} midiValue - MIDI modwheel value (0-127)
   */
  setModwheelPosition(midiValue) {
    // Clamp to valid range
    this.modwheelValue = Math.max(0, Math.min(127, midiValue));

    // Convert MIDI 0-127 to chromatic position 0-11
    this.selectedPosition = Math.floor((this.modwheelValue / 127) * 12);
    if (this.selectedPosition >= 12) this.selectedPosition = 11; // Safety clamp

    // Convert to rotation angle (0 to 2π)
    this.lambdaRotation = (this.selectedPosition / 12) * Math.PI * 2;

    console.log(`λ Modwheel: ${this.modwheelValue} → Position: ${this.selectedPosition} (${Math.round(this.lambdaRotation * 180 / Math.PI)}°)`);
  }

  /**
   * Update lambda rotation based on current settings
   */
  updateLambdaRotation() {
    // Rotate both lambda symbols together (same chromatic position at input and output)
    if (this.lambdaMeshTop) {
      this.lambdaMeshTop.rotation.z = this.lambdaRotation + Math.PI / 6;
    }
    if (this.lambdaMeshBottom) {
      this.lambdaMeshBottom.rotation.z = this.lambdaRotation + Math.PI / 6;
    }
  }

  initThreeJS() {
    // Create Three.js scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Get dimensions (fallback to fixed size if container not sized yet)
    const width = this.canvasContainer.clientWidth || 570;
    const height = this.canvasContainer.clientHeight || 400;

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    // Position camera to view full chronelix helix (height=6, radius=3.5)
    this.camera.position.set(8, 3, 8);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.canvasContainer.appendChild(this.renderer.domElement);

    // OrbitControls for zoom, pan, rotate
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Smooth movement
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2;  // Minimum zoom distance
    this.controls.maxDistance = 50; // Maximum zoom distance
    this.controls.enablePan = true;
    this.controls.enableRotate = true;
    this.controls.enableZoom = true;
    console.log("🎮 OrbitControls enabled (zoom, pan, rotate)");

    // Create MMPA Chestahedron with semantic component colors
    // MMPA Face Mapping:
    // Face 0 (Kite 1) → Identity (Pitch/Core): Cyan
    // Face 1 (Kite 2) → Relationship (Harmony): Green
    // Face 2 (Kite 3) → Complexity (Spectral): Magenta
    // Face 3 (Side Triangle) → Transformation (Flux): Orange-Red
    // Face 4 (Side Triangle) → Alignment (Coherence): Yellow
    // Face 5 (Side Triangle) → Potential (Entropy): Violet
    // Face 6 (Base Triangle) → Dominant State: Gold (highlights)

    const mmpaFaceColors = [
      0x00ffff, // Face 0: Identity - Cyan (fundamental frequency, stable)
      0x00ff00, // Face 1: Relationship - Green (harmony, balance)
      0xff00ff, // Face 2: Complexity - Magenta (spectral richness)
      0xff4400, // Face 3: Transformation - Red-Orange (flux, change)
      0xffff00, // Face 4: Alignment - Yellow (coherence, clarity)
      0x8800ff, // Face 5: Potential - Violet (entropy, chaos)
      0xffc01f  // Face 6: Dominant - Gold (current state highlight)
    ];

    // Create Chestahedron with custom materials for each face
    const materialOptions = {
      metalness: 0.7,
      roughness: 0.3,
      side: THREE.DoubleSide,
      transparent: false,
      opacity: 1.0,
      emissive: 0x000000,
      emissiveIntensity: 0.3
    };

    this.mesh = createChestahedron(1.5, materialOptions);

    // Override materials with MMPA colors
    for (let i = 0; i < 7; i++) {
      this.mesh.material[i].color.setHex(mmpaFaceColors[i]);
      this.mesh.material[i].emissive.setHex(mmpaFaceColors[i]);
      this.mesh.material[i].emissiveIntensity = 0.2; // Subtle glow
    }

    this.scene.add(this.mesh);

    // Store materials for dynamic updates
    this.materials = this.mesh.material;

    // Create chronelix spatial reference system
    this.chronelixGroup = this.createChronelixHelix();
    this.scene.add(this.chronelixGroup);

    // Create lambda tuning needle
    this.lambdaSymbol = this.createLambdaSymbol();
    this.scene.add(this.lambdaSymbol);

    // Lighting for MeshStandardMaterial
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    this.scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x4444ff, 0.4);
    directionalLight2.position.set(-5, -3, -5);
    this.scene.add(directionalLight2);

    console.log('⏱️ Three.js scene initialized with MMPA Chestahedron', { width, height });
  }

  startRenderLoop() {
    console.log('⏱️ Starting render loop', {
      hasRenderer: !!this.renderer,
      hasScene: !!this.scene,
      hasCamera: !!this.camera,
      hasMesh: !!this.mesh
    });

    const animate = () => {
      if (!this.isOpen) return;

      this.animationFrame = requestAnimationFrame(animate);

      // Rotate around Y-axis only (respecting AXIS_OF_BEING)
      // The 36-degree X-axis tilt is already applied during mesh creation
      if (this.mesh) {
        this.mesh.rotation.y += 0.01; // Vertical spin (authentic rotation)
      }

      // Update lambda needle rotation
      this.updateLambdaRotation();

      // Update OrbitControls (required for damping)
      if (this.controls) {
        this.controls.update();
      }

      // Update visualization from current timeline frame
      this.updateFromTimeline();

      // Render scene
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };

    animate();
  }

  updateFromTimeline() {
    if (!this.timeline) return;

    const status = this.timeline.getStatus();
    const frame = this.timeline.getCurrentFrame();

    if (!frame) {
      this.timeDisplay.textContent = 'No frame data';
      return;
    }

    // Update time display
    const currentTime = status.currentTime;
    const duration = status.duration;
    this.timeDisplay.textContent = `Time: ${this.formatTime(currentTime)} / ${this.formatTime(duration)}`;
    this.frameDisplay.textContent = `Frame: ${frame.index} / ${status.frameCount}`;

    // Update audio display
    if (frame.audio && frame.audio.bands) {
      const { bass, mid, treble } = frame.audio.bands;
      this.audioDisplay.innerHTML = `
        Bass:   ${(bass * 100).toFixed(1)}% ${'█'.repeat(Math.floor(bass * 20))}
<br>Mid:    ${(mid * 100).toFixed(1)}% ${'█'.repeat(Math.floor(mid * 20))}
<br>Treble: ${(treble * 100).toFixed(1)}% ${'█'.repeat(Math.floor(treble * 20))}
<br>Level:  ${(frame.audio.level * 100).toFixed(1)}%
      `;

      // Update Chestahedron based on audio
      if (this.mesh) {
        // Audio-reactive rotation speed (Y-axis only, respecting AXIS_OF_BEING)
        // Base rotation is handled in animate(), audio modulates the speed
        const audioEnergy = (bass + mid + treble) / 3;
        this.mesh.rotation.y += audioEnergy * 0.02; // Faster spin with more audio energy

        // Audio-reactive scale (pulse with audio level)
        const scale = 1.0 + frame.audio.level * 0.3;
        this.mesh.scale.setScalar(scale);
      }
    }

    // Update MMPA display and Chestahedron face colors
    if (frame.mmpa && frame.mmpa.attribution) {
      const attr = frame.mmpa.attribution;
      this.mmpaDisplay.innerHTML = `
        Dominant: ${attr.dominant || 'N/A'}
<br>Instability: ${((attr.instability || 0) * 100).toFixed(1)}%
<br>Top Component: ${attr.top3?.[0]?.name || 'N/A'}
      `;

      // Update Chestahedron face intensities based on MMPA attribution
      if (this.materials && attr.top3) {
        // Map component names to face indices
        const componentToFace = {
          'Identity': 0,
          'Relationship': 1,
          'Complexity': 2,
          'Transformation': 3,
          'Alignment': 4,
          'Potential': 5
        };

        // Reset all faces to dim intensity
        for (let i = 0; i < 6; i++) {
          this.materials[i].emissiveIntensity = 0.1;
        }

        // Highlight top 3 components based on their contribution
        attr.top3.forEach((component, idx) => {
          const faceIdx = componentToFace[component.name];
          if (faceIdx !== undefined) {
            // Brighter based on contribution (0.3 to 0.8 range)
            const intensity = 0.3 + component.contribution * 0.5;
            this.materials[faceIdx].emissiveIntensity = intensity;
          }
        });

        // Highlight dominant face (Face 6 - base triangle, gold)
        if (attr.dominant && componentToFace[attr.dominant] !== undefined) {
          const dominantFaceIdx = componentToFace[attr.dominant];
          const dominantIntensity = this.materials[dominantFaceIdx].emissiveIntensity;
          this.materials[6].emissiveIntensity = 0.4 + dominantIntensity * 0.6;
        }
      }
    } else {
      this.mmpaDisplay.textContent = 'No MMPA data';
      // Reset all face intensities when no MMPA data
      if (this.materials) {
        for (let i = 0; i < 7; i++) {
          this.materials[i].emissiveIntensity = 0.2;
        }
      }
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }

  close() {
    if (!this.isOpen) return;

    // Stop animation loop
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    // Dispose Three.js resources
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    // Dispose OrbitControls
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }

    // Dispose Chronelix helix group
    if (this.chronelixGroup) {
      this.chronelixGroup.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      this.chronelixGroup = null;
    }

    // Dispose Lambda meshes (now part of caps system)
    if (this.lambdaMeshTop) {
      if (this.lambdaMeshTop.geometry) this.lambdaMeshTop.geometry.dispose();
      if (this.lambdaMeshTop.material) this.lambdaMeshTop.material.dispose();
      this.lambdaMeshTop = null;
    }
    if (this.lambdaMeshBottom) {
      if (this.lambdaMeshBottom.geometry) this.lambdaMeshBottom.geometry.dispose();
      if (this.lambdaMeshBottom.material) this.lambdaMeshBottom.material.dispose();
      this.lambdaMeshBottom = null;
    }

    // Dispose old lambda symbol (compatibility)
    if (this.lambdaSymbol) {
      this.lambdaSymbol.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
      this.lambdaSymbol = null;
    }

    // Dispose Chestahedron geometry and materials
    if (this.mesh) {
      if (this.mesh.geometry) {
        this.mesh.geometry.dispose();
      }
      if (Array.isArray(this.mesh.material)) {
        // Dispose all face materials
        this.mesh.material.forEach(mat => mat.dispose());
      } else if (this.mesh.material) {
        this.mesh.material.dispose();
      }
      this.mesh = null;
    }
    this.materials = null;

    // Remove panel from DOM
    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
    }

    this.panel = null;
    this.isOpen = false;
    this.timeline = null;

    console.log('⏱️ Timeline Playback Panel closed');
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

// Create singleton instance
export const timelinePlaybackPanel = new TimelinePlaybackPanel();

// Expose globally for easy access
if (typeof window !== 'undefined') {
  window.TimelinePlaybackPanel = timelinePlaybackPanel;
}

console.log("⏱️ Timeline Playback Panel module ready");
