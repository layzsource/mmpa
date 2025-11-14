// Clay Modeler - 3D Object Authoring Tool
// CSG (Constructive Solid Geometry) editor for creating objects at destinations

console.log("🏗️ clayModeler.js loaded");

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Brush, Evaluator, ADDITION, SUBTRACTION, INTERSECTION } from 'three-bvh-csg';

/**
 * ClayModeler - Popup window for 3D object creation
 * Allows building objects from primitive shapes using CSG operations
 */
export class ClayModeler {
  constructor() {
    this.isOpen = false;
    this.panel = null;
    this.canvasContainer = null;

    // Three.js scene
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.transformControls = null;

    // Objects
    this.shapes = []; // Array of created shapes
    this.selectedShape = null;
    this.secondarySelectedShape = null; // For CSG operations (operand)
    this.previewMesh = null;

    // CSG evaluator
    this.csgEvaluator = new Evaluator();

    // Transform mode
    this.transformMode = 'translate'; // 'translate', 'rotate', 'scale'

    // Creation state
    this.currentPrimitive = 'box';
    this.currentOperation = 'union';
    this.currentMaterial = new THREE.MeshStandardMaterial({
      color: 0x4CAF50,
      metalness: 0.3,
      roughness: 0.6
    });

    // Animation
    this.animationFrame = null;

    console.log("🏗️ ClayModeler initialized");
  }

  open() {
    if (this.isOpen) return;

    console.log("🏗️ Opening Clay Modeler...");

    // Create panel container
    this.panel = document.createElement('div');
    this.panel.id = 'clayModelerPanel';
    this.panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 900px;
      height: 700px;
      background: rgba(20, 20, 20, 0.98);
      border: 2px solid #4CAF50;
      border-radius: 12px;
      padding: 20px;
      z-index: 2000;
      font-family: 'Courier New', monospace;
      color: #fff;
      box-shadow: 0 0 50px rgba(76, 175, 80, 0.8);
      display: flex;
      flex-direction: column;
    `;

    // Title bar
    const titleBar = this.createTitleBar();
    this.panel.appendChild(titleBar);

    // Main content area (horizontal split)
    const mainContent = document.createElement('div');
    mainContent.style.cssText = `
      display: flex;
      flex: 1;
      gap: 15px;
      overflow: hidden;
    `;

    // Left panel - Tools
    const toolPanel = this.createToolPanel();
    mainContent.appendChild(toolPanel);

    // Right panel - Viewport
    const viewportPanel = this.createViewportPanel();
    mainContent.appendChild(viewportPanel);

    this.panel.appendChild(mainContent);

    // Add to document
    document.body.appendChild(this.panel);
    this.isOpen = true;

    // Initialize Three.js after DOM is ready
    setTimeout(() => {
      this.initThreeJS();
      this.startRenderLoop();
    }, 100);

    console.log("🏗️ Clay Modeler opened");
  }

  createTitleBar() {
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #4CAF50;
    `;

    const title = document.createElement('div');
    title.style.cssText = `
      font-size: 16px;
      font-weight: bold;
      color: #4CAF50;
      text-transform: uppercase;
      letter-spacing: 2px;
    `;
    title.textContent = '🏗️ Clay Modeler - 3D Object Creator';

    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.cssText = `
      background: none;
      border: 1px solid #4CAF50;
      color: #4CAF50;
      font-size: 20px;
      cursor: pointer;
      width: 35px;
      height: 35px;
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

    return titleBar;
  }

  createToolPanel() {
    const toolPanel = document.createElement('div');
    toolPanel.style.cssText = `
      width: 250px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid #333;
      border-radius: 8px;
      padding: 15px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    `;

    // Primitives section
    const primitivesSection = this.createSection('Primitives', [
      this.createButton('Box', () => this.createPrimitive('box')),
      this.createButton('Sphere', () => this.createPrimitive('sphere')),
      this.createButton('Cylinder', () => this.createPrimitive('cylinder')),
      this.createButton('Cone', () => this.createPrimitive('cone')),
      this.createButton('Torus', () => this.createPrimitive('torus'))
    ]);
    toolPanel.appendChild(primitivesSection);

    // Operations section
    const operationsSection = this.createSection('CSG Operations', [
      this.createButton('Union (Combine)', () => this.performCSG('union'), '#4CAF50'),
      this.createButton('Subtract', () => this.performCSG('subtract'), '#FF5722'),
      this.createButton('Intersect', () => this.performCSG('intersect'), '#2196F3')
    ]);
    toolPanel.appendChild(operationsSection);

    // Transform section
    const transformSection = this.createSection('Transform Selected', [
      this.createButton('Move', () => this.setTransformMode('translate')),
      this.createButton('Rotate', () => this.setTransformMode('rotate')),
      this.createButton('Scale', () => this.setTransformMode('scale')),
      this.createButton('Delete', () => this.deleteSelected(), '#f44336')
    ]);
    toolPanel.appendChild(transformSection);

    // Export section
    const exportSection = this.createSection('Export', [
      this.createButton('Save to Destination', () => this.saveToDestination(), '#FFD700'),
      this.createButton('View Saved Objects', () => this.viewSavedObjects(), '#2196F3'),
      this.createButton('Clear All', () => this.clearAll(), '#757575')
    ]);
    toolPanel.appendChild(exportSection);

    return toolPanel;
  }

  createSection(title, buttons) {
    const section = document.createElement('div');
    section.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;

    const sectionTitle = document.createElement('div');
    sectionTitle.style.cssText = `
      font-size: 12px;
      color: #4CAF50;
      font-weight: bold;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 1px;
    `;
    sectionTitle.textContent = title;
    section.appendChild(sectionTitle);

    buttons.forEach(button => section.appendChild(button));

    return section;
  }

  createButton(label, onClick, color = '#4CAF50') {
    const button = document.createElement('button');
    button.textContent = label;
    button.style.cssText = `
      background: rgba(${this.hexToRgb(color)}, 0.2);
      border: 1px solid ${color};
      color: ${color};
      padding: 10px 15px;
      font-size: 11px;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s;
      font-family: 'Courier New', monospace;
      font-weight: bold;
    `;
    button.onmouseover = () => {
      button.style.background = color;
      button.style.color = '#000';
    };
    button.onmouseout = () => {
      button.style.background = `rgba(${this.hexToRgb(color)}, 0.2)`;
      button.style.color = color;
    };
    button.onclick = onClick;

    return button;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '76, 175, 80';
  }

  createViewportPanel() {
    const viewportPanel = document.createElement('div');
    viewportPanel.style.cssText = `
      flex: 1;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid #333;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
    `;

    // Canvas container
    this.canvasContainer = document.createElement('div');
    this.canvasContainer.style.cssText = `
      width: 100%;
      height: 100%;
    `;
    viewportPanel.appendChild(this.canvasContainer);

    // Info overlay
    const infoOverlay = document.createElement('div');
    infoOverlay.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.7);
      padding: 10px;
      border-radius: 4px;
      font-size: 10px;
      color: #aaa;
      line-height: 1.4;
      pointer-events: none;
    `;
    infoOverlay.innerHTML = `
      <div style="color: #4CAF50; font-weight: bold; margin-bottom: 5px;">Controls:</div>
      <div>• Left click + drag: Rotate view</div>
      <div>• Right click + drag: Pan view</div>
      <div>• Scroll: Zoom in/out</div>
      <div>• Click object: Select (primary)</div>
      <div>• Shift+Click object: Select (secondary for CSG)</div>
      <div style="color: #4CAF50; font-weight: bold; margin-top: 8px; margin-bottom: 3px;">Transform (when selected):</div>
      <div>• W: Translate mode</div>
      <div>• E: Rotate mode</div>
      <div>• R: Scale mode</div>
      <div>• +/-: Gizmo size</div>
      <div style="color: #4CAF50; font-weight: bold; margin-top: 8px; margin-bottom: 3px;">CSG Operations:</div>
      <div>• Select 2 shapes (primary + secondary)</div>
      <div>• Click Union, Subtract, or Intersect</div>
    `;
    viewportPanel.appendChild(infoOverlay);

    return viewportPanel;
  }

  initThreeJS() {
    console.log("🏗️ Initializing Three.js scene...");

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);

    // Get container dimensions
    const width = this.canvasContainer.clientWidth;
    const height = this.canvasContainer.clientHeight;

    // Camera
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.canvasContainer.appendChild(this.renderer.domElement);

    // Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Transform Controls for manipulating objects
    this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
    this.transformControls.setMode(this.transformMode);
    this.transformControls.setSize(0.8);
    this.scene.add(this.transformControls);

    // Disable OrbitControls when using TransformControls
    this.transformControls.addEventListener('dragging-changed', (event) => {
      this.controls.enabled = !event.value;
    });

    // Update controls when object changes
    this.transformControls.addEventListener('objectChange', () => {
      // Object has been transformed - could trigger save state here
    });

    // Grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    this.scene.add(gridHelper);

    // Axes helper
    const axesHelper = new THREE.AxesHelper(2);
    this.scene.add(axesHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    this.scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x4444ff, 0.3);
    directionalLight2.position.set(-5, -3, -5);
    this.scene.add(directionalLight2);

    // Raycaster for object selection
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Mouse click handler
    this.renderer.domElement.addEventListener('click', (event) => {
      this.onCanvasClick(event);
    });

    console.log("🏗️ Three.js scene initialized", { width, height });
  }

  startRenderLoop() {
    const animate = () => {
      if (!this.isOpen) return;

      this.animationFrame = requestAnimationFrame(animate);

      // Update controls
      if (this.controls) {
        this.controls.update();
      }

      // Render scene
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };

    animate();
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SHAPE CREATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  createPrimitive(type) {
    console.log(`🏗️ Creating primitive: ${type}`);

    let geometry;

    switch (type) {
      case 'box':
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(0.6, 32, 32);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(0.5, 1, 32);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
        break;
      default:
        console.error(`Unknown primitive type: ${type}`);
        return;
    }

    // Create mesh
    const material = this.currentMaterial.clone();
    const mesh = new THREE.Mesh(geometry, material);

    // Position slightly offset if objects exist
    if (this.shapes.length > 0) {
      mesh.position.x = Math.random() * 2 - 1;
      mesh.position.z = Math.random() * 2 - 1;
    }

    // Add to scene and track
    this.scene.add(mesh);
    this.shapes.push({
      mesh: mesh,
      type: type,
      id: Date.now()
    });

    // Select the new shape
    this.selectShape(mesh);

    console.log(`🏗️ Created ${type} at`, mesh.position);
  }

  selectShape(mesh, asSecondary = false) {
    if (asSecondary) {
      // Select as secondary (CSG operand)
      if (this.secondarySelectedShape) {
        this.secondarySelectedShape.material.emissive.setHex(0x000000);
      }

      this.secondarySelectedShape = mesh;
      if (mesh) {
        mesh.material.emissive.setHex(0x444400); // Yellow tint for secondary
      }
    } else {
      // Select as primary
      if (this.selectedShape) {
        this.selectedShape.material.emissive.setHex(0x000000);
      }

      this.selectedShape = mesh;
      if (mesh) {
        mesh.material.emissive.setHex(0x444444); // Gray tint for primary

        // Attach TransformControls to selected object
        if (this.transformControls) {
          this.transformControls.attach(mesh);
        }
      } else {
        // Detach TransformControls when nothing is selected
        if (this.transformControls) {
          this.transformControls.detach();
        }
      }
    }
  }

  onCanvasClick(event) {
    // Calculate mouse position in normalized device coordinates
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const meshes = this.shapes.map(s => s.mesh);
    const intersects = this.raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      // Shift+click for secondary selection (CSG operand)
      const asSecondary = event.shiftKey;
      this.selectShape(intersects[0].object, asSecondary);
      console.log(`🏗️ Selected shape ${asSecondary ? '(secondary)' : '(primary)'}:`, intersects[0].object);
    } else {
      // Clear selection when clicking empty space
      if (event.shiftKey) {
        this.selectShape(null, true); // Clear secondary
      } else {
        this.selectShape(null, false); // Clear primary
      }
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CSG OPERATIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  performCSG(operation) {
    console.log(`🏗️ Performing CSG operation: ${operation}`);

    // Validate we have shapes
    if (this.shapes.length < 2) {
      alert('Need at least 2 shapes for CSG operations');
      return;
    }

    // Validate selections
    if (!this.selectedShape) {
      alert('Please select a primary shape first (left click)');
      return;
    }

    if (!this.secondarySelectedShape) {
      alert('Please select a secondary shape (Shift+click on another shape)');
      return;
    }

    if (this.selectedShape === this.secondarySelectedShape) {
      alert('Cannot perform CSG on the same shape. Select two different shapes.');
      return;
    }

    console.log(`🏗️ Performing ${operation}: ${this.selectedShape.userData.name || 'shape'} ← ${this.secondarySelectedShape.userData.name || 'shape'}`);

    try {
      // Create Brush objects (three-bvh-csg format)
      const brushA = new Brush(this.selectedShape.geometry, this.selectedShape.material);
      brushA.position.copy(this.selectedShape.position);
      brushA.rotation.copy(this.selectedShape.rotation);
      brushA.scale.copy(this.selectedShape.scale);
      brushA.updateMatrixWorld();

      const brushB = new Brush(this.secondarySelectedShape.geometry, this.secondarySelectedShape.material);
      brushB.position.copy(this.secondarySelectedShape.position);
      brushB.rotation.copy(this.secondarySelectedShape.rotation);
      brushB.scale.copy(this.secondarySelectedShape.scale);
      brushB.updateMatrixWorld();

      // Perform CSG operation
      let resultBrush;
      switch (operation) {
        case 'union':
          resultBrush = this.csgEvaluator.evaluate(brushA, brushB, ADDITION);
          break;
        case 'subtract':
          resultBrush = this.csgEvaluator.evaluate(brushA, brushB, SUBTRACTION);
          break;
        case 'intersect':
          resultBrush = this.csgEvaluator.evaluate(brushA, brushB, INTERSECTION);
          break;
        default:
          alert(`Unknown CSG operation: ${operation}`);
          return;
      }

      // Create new mesh from result
      const resultMaterial = this.currentMaterial.clone();
      const resultMesh = new THREE.Mesh(resultBrush.geometry, resultMaterial);
      resultMesh.userData.name = `CSG_${operation}_${Date.now()}`;

      // Add to scene and track
      this.scene.add(resultMesh);
      this.shapes.push({
        mesh: resultMesh,
        type: `csg_${operation}`,
        id: Date.now()
      });

      // Remove original shapes
      this.scene.remove(this.selectedShape);
      this.scene.remove(this.secondarySelectedShape);

      // Dispose geometries and materials
      this.selectedShape.geometry.dispose();
      this.selectedShape.material.dispose();
      this.secondarySelectedShape.geometry.dispose();
      this.secondarySelectedShape.material.dispose();

      // Remove from tracking
      this.shapes = this.shapes.filter(s =>
        s.mesh !== this.selectedShape && s.mesh !== this.secondarySelectedShape
      );

      // Select the new shape
      this.selectedShape = null;
      this.secondarySelectedShape = null;
      this.selectShape(resultMesh);

      console.log(`🏗️ CSG ${operation} completed successfully`);
    } catch (error) {
      console.error('🏗️ CSG operation failed:', error);
      alert(`CSG ${operation} failed: ${error.message}`);
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TRANSFORM OPERATIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  setTransformMode(mode) {
    if (!['translate', 'rotate', 'scale'].includes(mode)) {
      console.error(`Invalid transform mode: ${mode}`);
      return;
    }

    this.transformMode = mode;

    if (this.transformControls) {
      this.transformControls.setMode(mode);
    }

    console.log(`🏗️ Transform mode set to: ${mode}`);
  }

  deleteSelected() {
    if (!this.selectedShape) {
      alert('No shape selected');
      return;
    }

    console.log("🏗️ Deleting selected shape");

    // Remove from scene
    this.scene.remove(this.selectedShape);

    // Dispose geometry and material
    this.selectedShape.geometry.dispose();
    this.selectedShape.material.dispose();

    // Remove from tracking array
    this.shapes = this.shapes.filter(s => s.mesh !== this.selectedShape);

    this.selectedShape = null;
  }

  clearAll() {
    if (!confirm('Clear all shapes? This cannot be undone.')) {
      return;
    }

    console.log("🏗️ Clearing all shapes");

    // Remove all shapes
    this.shapes.forEach(shape => {
      this.scene.remove(shape.mesh);
      shape.mesh.geometry.dispose();
      shape.mesh.material.dispose();
    });

    this.shapes = [];
    this.selectedShape = null;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // EXPORT & INTEGRATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  saveToDestination() {
    console.log("🏗️ saveToDestination() called");

    if (this.shapes.length === 0) {
      console.warn('🏗️ No shapes to save');
      alert('No shapes to save');
      return;
    }

    console.log(`🏗️ Have ${this.shapes.length} shapes to save`);

    if (!window.destinationAuthoring) {
      console.error('🏗️ window.destinationAuthoring not available');
      alert('Destination authoring system not available.\n\nMake sure the main scene is loaded first.');
      return;
    }

    console.log("🏗️ destinationAuthoring available, getting destinations...");

    // Get all destinations
    let destinations;
    try {
      destinations = window.destinationAuthoring.getAllDestinations();
      console.log(`🏗️ Found ${destinations.length} destinations`, destinations);
    } catch (error) {
      console.error('🏗️ Error getting destinations:', error);
      alert(`Error getting destinations: ${error.message}`);
      return;
    }

    if (destinations.length === 0) {
      alert('⚠️ No destinations found.\n\nCreate a destination first using the HUD panel, then reopen Clay Modeler.');
      return;
    }

    // Show custom destination picker modal
    this.showDestinationPicker(destinations);
  }

  showDestinationPicker(destinations) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: #1a1a1a;
      border: 2px solid #4CAF50;
      border-radius: 8px;
      padding: 20px;
      max-width: 500px;
      max-height: 70vh;
      overflow-y: auto;
      box-shadow: 0 0 30px rgba(76, 175, 80, 0.5);
    `;

    // Title
    const title = document.createElement('h2');
    title.textContent = 'Select Destination';
    title.style.cssText = `
      color: #4CAF50;
      margin: 0 0 15px 0;
      font-size: 18px;
      font-family: 'Courier New', monospace;
    `;
    modal.appendChild(title);

    // Subtitle
    const subtitle = document.createElement('p');
    subtitle.textContent = `Saving ${this.shapes.length} shape(s)`;
    subtitle.style.cssText = `
      color: #888;
      margin: 0 0 20px 0;
      font-size: 12px;
      font-family: 'Courier New', monospace;
    `;
    modal.appendChild(subtitle);

    // Destination list
    const list = document.createElement('div');
    list.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
    `;

    destinations.forEach((dest) => {
      const camPos = window.camera ? window.camera.position : { x: 0, y: 0, z: 0 };
      const distance = Math.sqrt(
        Math.pow(dest.position.x - camPos.x, 2) +
        Math.pow(dest.position.y - camPos.y, 2) +
        Math.pow(dest.position.z - camPos.z, 2)
      );

      const button = document.createElement('button');
      button.textContent = `${dest.name} (${distance.toFixed(1)} units)`;
      button.style.cssText = `
        background: #2a2a2a;
        border: 1px solid #4CAF50;
        color: #fff;
        padding: 12px;
        font-size: 14px;
        font-family: 'Courier New', monospace;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;
        text-align: left;
      `;
      button.onmouseover = () => {
        button.style.background = '#4CAF50';
        button.style.color = '#000';
      };
      button.onmouseout = () => {
        button.style.background = '#2a2a2a';
        button.style.color = '#fff';
      };
      button.onclick = () => {
        document.body.removeChild(overlay);
        this.performSave(dest);
      };
      list.appendChild(button);
    });

    modal.appendChild(list);

    // Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
      background: #333;
      border: 1px solid #666;
      color: #fff;
      padding: 10px 20px;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      cursor: pointer;
      border-radius: 4px;
      width: 100%;
    `;
    cancelBtn.onclick = () => {
      document.body.removeChild(overlay);
    };
    modal.appendChild(cancelBtn);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  performSave(selectedDestination) {
    try {
      // Serialize all shapes
      const clayObjectData = {
        name: `Clay Object ${Date.now()}`,
        description: `Created with ${this.shapes.length} shape(s)`,
        shapes: this.shapes.map((shape, index) => {
          // Serialize geometry
          const geometryData = shape.mesh.geometry.toJSON();

          // Serialize material
          const materialData = {
            color: '#' + shape.mesh.material.color.getHexString(),
            metalness: shape.mesh.material.metalness,
            roughness: shape.mesh.material.roughness,
            emissive: '#' + shape.mesh.material.emissive.getHexString(),
            emissiveIntensity: shape.mesh.material.emissiveIntensity
          };

          // Serialize transform
          return {
            id: shape.id,
            type: shape.type,
            geometry: geometryData,
            material: materialData,
            position: shape.mesh.position.toArray(),
            rotation: [shape.mesh.rotation.x, shape.mesh.rotation.y, shape.mesh.rotation.z],
            scale: shape.mesh.scale.toArray()
          };
        }),
        createdAt: Date.now(),
        version: '1.0'
      };

      // Save to selected destination
      const result = window.destinationAuthoring.addClayObjectToDestination(selectedDestination.id, clayObjectData);

      if (result) {
        alert(`✅ Saved clay object to "${selectedDestination.name}"!\n\nObject ID: ${result.id}\nShapes: ${this.shapes.length}`);
        console.log('🏗️ Clay object saved:', result);

        // Show clear workspace dialog
        this.showClearWorkspaceDialog();
      } else {
        alert('❌ Failed to save to destination');
      }
    } catch (error) {
      console.error('🏗️ Failed to save to destination:', error);
      alert(`❌ Failed to save: ${error.message}`);
    }
  }

  showClearWorkspaceDialog() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: #1a1a1a;
      border: 2px solid #4CAF50;
      border-radius: 8px;
      padding: 20px;
      max-width: 400px;
      box-shadow: 0 0 30px rgba(76, 175, 80, 0.5);
    `;

    const message = document.createElement('p');
    message.textContent = 'Clear the modeler workspace?';
    message.style.cssText = `
      color: #fff;
      margin: 0 0 20px 0;
      font-size: 14px;
      font-family: 'Courier New', monospace;
    `;
    modal.appendChild(message);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 10px;
    `;

    const yesBtn = document.createElement('button');
    yesBtn.textContent = 'Yes, Clear';
    yesBtn.style.cssText = `
      background: #4CAF50;
      border: none;
      color: #000;
      padding: 10px 20px;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      cursor: pointer;
      border-radius: 4px;
      flex: 1;
    `;
    yesBtn.onclick = () => {
      this.clearAll();
      document.body.removeChild(overlay);
    };

    const noBtn = document.createElement('button');
    noBtn.textContent = 'No, Keep';
    noBtn.style.cssText = `
      background: #333;
      border: 1px solid #666;
      color: #fff;
      padding: 10px 20px;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      cursor: pointer;
      border-radius: 4px;
      flex: 1;
    `;
    noBtn.onclick = () => {
      document.body.removeChild(overlay);
    };

    buttonContainer.appendChild(yesBtn);
    buttonContainer.appendChild(noBtn);
    modal.appendChild(buttonContainer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  viewSavedObjects() {
    if (!window.destinationAuthoring) {
      alert('Destination authoring system not available');
      return;
    }

    console.log("🏗️ Viewing saved objects...");

    // Get all destinations
    const destinations = window.destinationAuthoring.getAllDestinations();

    if (destinations.length === 0) {
      alert('No destinations found.\n\nCreate a destination first to save clay objects.');
      return;
    }

    // Build list of destinations with clay objects
    let messageLines = ['📦 Saved Clay Objects:\n'];
    let hasObjects = false;

    destinations.forEach((dest) => {
      if (dest.clayObjects && dest.clayObjects.length > 0) {
        hasObjects = true;
        messageLines.push(`\n📍 ${dest.name}:`);
        dest.clayObjects.forEach((clayObj, idx) => {
          const created = new Date(clayObj.createdAt).toLocaleString();
          messageLines.push(`  ${idx + 1}. ${clayObj.name}`);
          messageLines.push(`     • Shapes: ${clayObj.shapes?.length || 0}`);
          messageLines.push(`     • Created: ${created}`);
          messageLines.push(`     • ID: ${clayObj.id}`);
        });
      }
    });

    if (!hasObjects) {
      alert('No clay objects saved yet.\n\nCreate shapes and click "Save to Destination" to save them.');
      return;
    }

    messageLines.push('\n\nTo delete a clay object:');
    messageLines.push('Use the Destination HUD panel');
    messageLines.push('or use the browser console:');
    messageLines.push('\nwindow.destinationAuthoring.removeClayObjectFromDestination(destinationId, clayObjectId)');

    alert(messageLines.join('\n'));
  }

  exportJSON() {
    const data = {
      shapes: this.shapes.map(shape => ({
        type: shape.type,
        position: shape.mesh.position.toArray(),
        rotation: shape.mesh.rotation.toArray(),
        scale: shape.mesh.scale.toArray()
      })),
      version: '1.0'
    };

    return data;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LIFECYCLE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  close() {
    if (!this.isOpen) return;

    console.log("🏗️ Closing Clay Modeler...");

    // Stop animation loop
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    // Dispose Three.js resources
    if (this.transformControls) {
      this.transformControls.detach();
      this.transformControls.dispose();
      this.transformControls = null;
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    // Dispose all shapes
    this.shapes.forEach(shape => {
      if (shape.mesh.geometry) shape.mesh.geometry.dispose();
      if (shape.mesh.material) shape.mesh.material.dispose();
    });

    this.shapes = [];
    this.selectedShape = null;
    this.controls = null;

    // Remove panel from DOM
    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
    }

    this.panel = null;
    this.isOpen = false;

    console.log("🏗️ Clay Modeler closed");
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
export const clayModeler = new ClayModeler();

// Expose globally for easy access
if (typeof window !== 'undefined') {
  window.ClayModeler = clayModeler;
}

console.log("🏗️ Clay Modeler module ready");
