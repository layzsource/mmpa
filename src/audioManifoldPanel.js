// Audio Manifold Panel - UMAP/t-SNE visualization of audio timbre space
// Real-time MFCC extraction → manifold embedding → 3D scatter plot
// Self-contained observational panel (does NOT modulate main scene)

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AudioManifoldComputer, ManifoldVisualizer } from './audioManifoldComputer.js';

console.log('[MANIFOLD] 🎨 audioManifoldPanel.js loaded');

/**
 * AudioManifoldPanel - Interactive 3D manifold visualization panel
 *
 * Features:
 * - Real-time MFCC extraction and UMAP embedding
 * - 2D/3D scatter plot of audio frames in manifold space
 * - Color mapping by time/amplitude/reverb/centroid
 * - Temporal and similarity tracers
 * - Interactive hover tooltips
 * - Draggable panel with THREE.js scene
 */
export class AudioManifoldPanel {
  constructor(audioCore) {
    this.audioCore = audioCore;
    this.isOpen = false;
    this.panel = null;

    // THREE.js components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.renderContainer = null;

    // Panel state
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.panelPosition = { x: null, y: null };

    // Dimensions
    this.width = 800;
    this.height = 600;

    // Performance settings
    this.showAnimation = false;  // Point oscillation OFF by default for performance

    // Audio manifold computer (use lightweight defaults)
    this.manifoldComputer = new AudioManifoldComputer({
      bufferDuration: 5,   // 5s only (50 frames)
      frameRate: 10,       // 10 FPS
      nDimensions: 3,
      nNeighbors: 5,       // Minimal
      minDist: 0.1,
      updateInterval: 10000 // 10 seconds (less frequent)
    });

    this.visualizer = new ManifoldVisualizer();

    // Visualization state
    this.is3D = true;
    this.showTemporalTracers = false;  // OFF by default
    this.showSimilarityTracers = false;

    // THREE.js objects
    this.pointsObject = null;
    this.tracerLines = null;

    // Animation
    this.animationFrameId = null;
    this.processingFrameId = null;

    // Interaction
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredPoint = null;
    this.tooltip = null;

    console.log('[MANIFOLD] 🎨 Audio Manifold Panel initialized');
  }

  /**
   * Open the panel
   */
  open() {
    if (this.isOpen) return;

    // Create panel container
    this.panel = document.createElement('div');
    this.panel.id = 'audio-manifold-panel';

    // Position panel
    if (this.panelPosition.x !== null && this.panelPosition.y !== null) {
      this.panel.style.cssText = `
        position: absolute;
        left: ${this.panelPosition.x}px;
        top: ${this.panelPosition.y}px;
        width: ${this.width}px;
        height: ${this.height}px;
        background: rgba(10, 10, 15, 0.95);
        border: 2px solid #a78bfa;
        border-radius: 12px;
        padding: 0;
        z-index: 1000;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, monospace;
        color: #f0f0f0;
        box-shadow: 0 0 30px rgba(167, 139, 250, 0.4);
        overflow: hidden;
        box-sizing: border-box;
      `;
    } else {
      // Default position: center-right
      this.panel.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        width: ${this.width}px;
        height: ${this.height}px;
        background: rgba(10, 10, 15, 0.95);
        border: 2px solid #a78bfa;
        border-radius: 12px;
        padding: 0;
        z-index: 1000;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, monospace;
        color: #f0f0f0;
        box-shadow: 0 0 30px rgba(167, 139, 250, 0.4);
        overflow: hidden;
        box-sizing: border-box;
      `;
    }

    // Header (draggable)
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 15px;
      border-bottom: 1px solid rgba(167, 139, 250, 0.3);
      cursor: move;
      user-select: none;
      background: rgba(167, 139, 250, 0.1);
    `;

    const title = document.createElement('div');
    title.textContent = '🎨 Audio Manifold (UMAP)';
    title.style.cssText = `
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: #a78bfa;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      background: transparent;
      border: none;
      color: #f0f0f0;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      line-height: 1;
      transition: color 0.2s;
    `;
    closeBtn.onmouseenter = () => { closeBtn.style.color = '#a78bfa'; };
    closeBtn.onmouseleave = () => { closeBtn.style.color = '#f0f0f0'; };
    closeBtn.onclick = () => this.close();

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Make header draggable
    header.onmousedown = (e) => this.startDrag(e);

    // Controls panel
    const controls = this.createControls();

    // THREE.js render container
    this.renderContainer = document.createElement('div');
    this.renderContainer.style.cssText = `
      width: 100%;
      height: calc(100% - 110px);
      background: rgba(0, 0, 0, 0.6);
      position: relative;
      overflow: hidden;
    `;

    // Status overlay (shows when no data)
    this.statusOverlay = document.createElement('div');
    this.statusOverlay.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #a78bfa;
      font-size: 14px;
      pointer-events: none;
      z-index: 5;
    `;
    this.statusOverlay.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 10px;">🎵</div>
      <div style="font-weight: 600;">Waiting for audio...</div>
      <div style="font-size: 11px; color: #888; margin-top: 8px;">Start playing audio to see timbre space</div>
    `;
    this.renderContainer.appendChild(this.statusOverlay);

    // Tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: #f0f0f0;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 11px;
      pointer-events: none;
      display: none;
      z-index: 10;
      max-width: 250px;
      border: 1px solid #a78bfa;
    `;
    this.renderContainer.appendChild(this.tooltip);

    // Stats display
    const stats = document.createElement('div');
    stats.id = 'manifold-stats';
    stats.style.cssText = `
      padding: 8px 15px;
      font-size: 10px;
      color: #888;
      border-top: 1px solid rgba(167, 139, 250, 0.2);
      background: rgba(0, 0, 0, 0.3);
    `;
    stats.innerHTML = 'Frames: 0 | Embedded: 0 | Compute: 0ms';

    // Assemble panel
    this.panel.appendChild(header);
    this.panel.appendChild(controls);
    this.panel.appendChild(this.renderContainer);
    this.panel.appendChild(stats);

    document.body.appendChild(this.panel);

    // Initialize THREE.js
    this.initThreeJS();

    // Set panel as open BEFORE starting processing
    this.isOpen = true;

    // Start processing audio frames
    this.startProcessing();

    // Start animation loop
    this.animate();

    console.log('[MANIFOLD] 🎨 Audio Manifold Panel opened');
  }

  /**
   * Create control panel UI
   */
  createControls() {
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      gap: 15px;
      padding: 10px 15px;
      background: rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid rgba(167, 139, 250, 0.2);
      flex-wrap: wrap;
      align-items: center;
    `;

    // Dimension toggle
    const dimToggle = this.createToggleButton('3D', '2D', true, (is3D) => {
      this.is3D = is3D;
      this.manifoldComputer.updateConfig({ nDimensions: is3D ? 3 : 2 });
      this.updateVisualization();
    });
    dimToggle.style.marginRight = '5px';

    // Color mode selector
    const colorLabel = document.createElement('span');
    colorLabel.textContent = 'Color:';
    colorLabel.style.cssText = 'font-size: 11px; color: #888; margin-left: 5px;';

    const colorSelect = document.createElement('select');
    colorSelect.style.cssText = `
      background: rgba(167, 139, 250, 0.2);
      border: 1px solid #a78bfa;
      color: #a78bfa;
      font-size: 10px;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      outline: none;
    `;
    const colorModes = [
      { value: 'time', label: 'Time' },
      { value: 'amplitude', label: 'Amplitude' },
      { value: 'reverb', label: 'Reverb' },
      { value: 'centroid', label: 'Brightness' }
    ];
    colorModes.forEach(mode => {
      const option = document.createElement('option');
      option.value = mode.value;
      option.textContent = mode.label;
      colorSelect.appendChild(option);
    });
    colorSelect.onchange = () => {
      this.visualizer.setColorMode(colorSelect.value);
      this.updateVisualization();
    };

    // Tracer toggles
    const tracerLabel = document.createElement('span');
    tracerLabel.textContent = 'Tracers:';
    tracerLabel.style.cssText = 'font-size: 11px; color: #888; margin-left: 10px;';

    const temporalCheck = this.createCheckbox('Temporal', false, (checked) => {
      this.showTemporalTracers = checked;
      this.updateVisualization();
    });

    const similarityCheck = this.createCheckbox('Similarity', false, (checked) => {
      this.showSimilarityTracers = checked;
      this.updateVisualization();
    });

    // Animation toggle (OFF by default for performance)
    const animLabel = document.createElement('span');
    animLabel.textContent = 'Effects:';
    animLabel.style.cssText = 'font-size: 11px; color: #888; margin-left: 10px;';

    const animCheck = this.createCheckbox('Animate', false, (checked) => {
      this.showAnimation = checked;
      console.log(`[MANIFOLD] 🎬 Point animation: ${checked ? 'ON' : 'OFF'}`);
    });

    container.appendChild(dimToggle);
    container.appendChild(colorLabel);
    container.appendChild(colorSelect);
    container.appendChild(tracerLabel);
    container.appendChild(temporalCheck);
    container.appendChild(similarityCheck);
    container.appendChild(animLabel);
    container.appendChild(animCheck);

    return container;
  }

  /**
   * Create toggle button (ON/OFF states)
   */
  createToggleButton(labelOn, labelOff, initialState, onChange) {
    const btn = document.createElement('button');
    btn.textContent = initialState ? labelOn : labelOff;
    btn.style.cssText = `
      background: ${initialState ? 'rgba(167, 139, 250, 0.3)' : 'rgba(100, 100, 100, 0.3)'};
      border: 1px solid ${initialState ? '#a78bfa' : '#666'};
      color: ${initialState ? '#a78bfa' : '#888'};
      font-size: 10px;
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      outline: none;
    `;

    let state = initialState;
    btn.onclick = () => {
      state = !state;
      btn.textContent = state ? labelOn : labelOff;
      btn.style.background = state ? 'rgba(167, 139, 250, 0.3)' : 'rgba(100, 100, 100, 0.3)';
      btn.style.borderColor = state ? '#a78bfa' : '#666';
      btn.style.color = state ? '#a78bfa' : '#888';
      onChange(state);
    };

    return btn;
  }

  /**
   * Create checkbox with label
   */
  createCheckbox(label, initialState, onChange) {
    const container = document.createElement('label');
    container.style.cssText = `
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: #aaa;
      cursor: pointer;
      user-select: none;
    `;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = initialState;
    checkbox.style.cssText = `
      accent-color: #a78bfa;
      cursor: pointer;
    `;
    checkbox.onchange = () => onChange(checkbox.checked);

    const labelText = document.createElement('span');
    labelText.textContent = label;

    container.appendChild(checkbox);
    container.appendChild(labelText);

    return container;
  }

  /**
   * Initialize THREE.js scene
   */
  initThreeJS() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111827);  // Match example dark background

    // Camera
    const aspect = this.width / (this.height - 110);
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 60); // Further back to see more points
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(this.width, this.height - 110);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderContainer.appendChild(this.renderer.domElement);

    console.log(`[MANIFOLD] 🎨 Renderer created: ${this.width}x${this.height - 110}px, canvas:`, this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 20;
    this.controls.maxDistance = 200;
    this.controls.screenSpacePanning = false;

    // Lighting for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    this.scene.add(pointLight);

    // Grid helper
    const gridHelper = new THREE.GridHelper(10, 20, 0x666666, 0x333333);
    this.scene.add(gridHelper);

    // Axes helper (brighter colors)
    const axesHelper = new THREE.AxesHelper(3);
    this.scene.add(axesHelper);

    // Mouse interaction
    this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));

    console.log('[MANIFOLD] 🎨 THREE.js scene initialized, camera at (0,0,5)');
    console.log('[MANIFOLD] 🎨 Scene children:', this.scene.children.length);

    // Force an initial render
    this.renderer.render(this.scene, this.camera);
    console.log('[MANIFOLD] 🎨 Initial render completed');
  }

  /**
   * Start processing audio frames
   */
  async startProcessing() {
    // Ensure AudioEngine is available
    if (!this.audioCore) {
      console.error('[MANIFOLD] ❌ AudioEngine not available');
      this.updateStatusOverlay('❌ AudioEngine not initialized');
      return;
    }

    console.log('[MANIFOLD] 🎨 AudioEngine state:', this.audioCore.state);

    // If audio is not running, show message and retry
    if (this.audioCore.state !== 'running') {
      console.log('[MANIFOLD] ⚠️ AudioEngine not running. State:', this.audioCore.state);
      this.updateStatusOverlay('⚠️ Audio not running. Enable audio in the Audio tab first.');
      setTimeout(() => this.startProcessing(), 1000);
      return;
    }

    // Get analyser using the getAnalyser() method
    const analyser = this.audioCore.getAnalyser();
    if (!analyser) {
      console.warn('[MANIFOLD] ⚠️ Audio analyser not ready yet, retrying in 500ms...');
      this.updateStatusOverlay('⏳ Waiting for audio analyser...');
      setTimeout(() => this.startProcessing(), 500);
      return;
    }

    console.log('[MANIFOLD] ✅ Starting audio frame processing with analyser');
    this.updateStatusOverlay(null); // Hide status overlay

    const processFrame = () => {
      if (!this.isOpen) {
        console.log('[MANIFOLD] ⏸️ Processing stopped - panel closed');
        return;
      }

      try {
        // Get analyser each frame (in case it changes)
        const analyser = this.audioCore.getAnalyser();
        if (!analyser) {
          console.warn('[MANIFOLD] ⚠️ Analyser lost, stopping processing');
          this.updateStatusOverlay('❌ Audio analyser lost');
          return;
        }

        // Process audio frame through manifold computer
        this.manifoldComputer.processFrame(analyser);

        // Update stats display
        this.updateStats();
      } catch (error) {
        console.error('[MANIFOLD] ❌ Error in processFrame:', error);
      }

      // Schedule next frame (60 FPS)
      this.processingFrameId = setTimeout(processFrame, 1000 / 10); // 10 FPS (reduced from 60)
    };

    processFrame();
    console.log('[MANIFOLD] ✅ Audio frame processing started');
  }

  /**
   * Update status overlay text
   */
  updateStatusOverlay(text) {
    if (!this.statusOverlay) return;

    if (text === null) {
      this.statusOverlay.style.display = 'none';
    } else {
      this.statusOverlay.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 10px;">🎵</div>
        <div style="font-weight: 600;">${text}</div>
      `;
      this.statusOverlay.style.display = 'block';
    }
  }

  /**
   * Update visualization (points and tracers)
   */
  updateVisualization() {
    const frames = this.manifoldComputer.getEmbeddedFrames();
    console.log(`[MANIFOLD] 🎨 updateVisualization called: ${frames.length} embedded frames`);
    if (frames.length === 0) {
      console.warn('[MANIFOLD] ⚠️ No embedded frames to visualize yet');
      // Show status overlay when no data
      if (this.statusOverlay) this.statusOverlay.style.display = 'block';
      return;
    }

    // Hide status overlay when we have data
    if (this.statusOverlay) this.statusOverlay.style.display = 'none';

    // Remove old objects
    if (this.pointsObject) this.scene.remove(this.pointsObject);
    if (this.tracerLines) this.scene.remove(this.tracerLines);

    // Create point cloud geometry
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    frames.forEach((frame, i) => {
      if (!frame.embedding) return;

      // Position
      positions.push(
        frame.embedding[0] * 2,
        this.is3D && frame.embedding[2] ? frame.embedding[2] * 2 : 0,
        frame.embedding[1] * 2
      );

      // Color
      const color = this.visualizer.getFrameColor(frame, i, frames.length);
      colors.push(color.r, color.g, color.b);

      // Size
      const size = this.visualizer.getPointSize(frame);
      sizes.push(size);
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    // Point material - styled like the example
    const material = new THREE.PointsMaterial({
      size: 0.5, // Much larger for visibility
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending // Glow effect
    });

    this.pointsObject = new THREE.Points(geometry, material);

    // Store original positions and frame data for animation
    this.pointsObject.userData = {
      frames: frames,
      originalPositions: positions.slice() // Copy positions
    };

    this.scene.add(this.pointsObject);

    // Create tracers
    this.createTracers(frames);
  }

  /**
   * Create tracer lines between frames
   */
  createTracers(frames) {
    const linePositions = [];
    const lineColors = [];

    // Temporal tracers
    if (this.showTemporalTracers) {
      const tracers = this.visualizer.computeTemporalTracers(frames);
      tracers.forEach(tracer => {
        const from = frames[tracer.from];
        const to = frames[tracer.to];
        if (!from.embedding || !to.embedding) return;

        linePositions.push(
          from.embedding[0] * 2,
          this.is3D && from.embedding[2] ? from.embedding[2] * 2 : 0,
          from.embedding[1] * 2,
          to.embedding[0] * 2,
          this.is3D && to.embedding[2] ? to.embedding[2] * 2 : 0,
          to.embedding[1] * 2
        );

        // Teal for temporal
        lineColors.push(0.08, 0.72, 0.65, 0.08, 0.72, 0.65);
      });
    }

    // Similarity tracers
    if (this.showSimilarityTracers) {
      const tracers = this.visualizer.computeSimilarityTracers(frames, 0.5);
      tracers.forEach(tracer => {
        const from = frames[tracer.from];
        const to = frames[tracer.to];
        if (!from.embedding || !to.embedding) return;

        linePositions.push(
          from.embedding[0] * 2,
          this.is3D && from.embedding[2] ? from.embedding[2] * 2 : 0,
          from.embedding[1] * 2,
          to.embedding[0] * 2,
          this.is3D && to.embedding[2] ? to.embedding[2] * 2 : 0,
          to.embedding[1] * 2
        );

        // Purple for similarity
        lineColors.push(0.49, 0.23, 0.93, 0.49, 0.23, 0.93);
      });
    }

    if (linePositions.length > 0) {
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

      const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.2,
        linewidth: 1
      });

      this.tracerLines = new THREE.LineSegments(lineGeometry, lineMaterial);
      this.scene.add(this.tracerLines);
    }
  }

  /**
   * Update stats display
   */
  updateStats() {
    const stats = this.manifoldComputer.getStats();
    const statsEl = document.getElementById('manifold-stats');
    if (statsEl) {
      statsEl.innerHTML = `Frames: ${stats.bufferSize} | Embedded: ${stats.embeddedCount} | Compute: ${stats.lastComputeTime}ms | Buffer: ${stats.bufferUtilization}`;
    }

    // Update visualization every second or when embeddings computed
    if (stats.embeddedCount > 0) {
      this.updateVisualization();
    }
  }

  /**
   * Mouse move handler for hover tooltips
   */
  onMouseMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.pointsObject) {
      const intersects = this.raycaster.intersectObject(this.pointsObject);

      if (intersects.length > 0) {
        const index = intersects[0].index;
        const frames = this.manifoldComputer.getEmbeddedFrames();
        const frame = frames[index];

        if (frame) {
          this.showTooltip(event, frame, index);
        }
      } else {
        this.hideTooltip();
      }
    }
  }

  /**
   * Show tooltip for hovered frame
   */
  showTooltip(event, frame, index) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.tooltip.style.display = 'block';
    this.tooltip.style.left = x + 10 + 'px';
    this.tooltip.style.top = y + 10 + 'px';

    const timeSec = ((performance.now() - frame.timestamp) / 1000).toFixed(1);

    this.tooltip.innerHTML = `
      <div style="margin-bottom: 4px; font-weight: 600; color: #a78bfa;">Frame ${index}</div>
      <div style="font-size: 10px; color: #888;">${timeSec}s ago</div>
      <div style="margin-top: 6px; font-size: 10px;">
        Amplitude: ${frame.features.amplitude.toFixed(3)}<br>
        Reverb: ${frame.features.reverb.toFixed(3)}<br>
        Centroid: ${frame.features.spectralCentroid.toFixed(3)}<br>
        Flux: ${frame.features.spectralFlux.toFixed(3)}
      </div>
    `;
  }

  /**
   * Hide tooltip
   */
  hideTooltip() {
    this.tooltip.style.display = 'none';
  }

  /**
   * Animation loop
   */
  animate() {
    if (!this.isOpen) return;

    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Oscillating animation for points (DISABLED BY DEFAULT for performance)
    // Only animates if this.showAnimation === true
    if (this.showAnimation && this.pointsObject && this.pointsObject.userData.frames) {
      const positions = this.pointsObject.geometry.attributes.position.array;
      const originalPositions = this.pointsObject.userData.originalPositions;
      const frames = this.pointsObject.userData.frames;
      const time = performance.now() * 0.001; // Time in seconds

      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        if (!frame) continue;

        // Oscillation speed based on spectral flux (activity)
        const speed = (frame.features.spectralFlux * 2 + 0.5) * 2;

        // Amplitude based on ZCR and amplitude
        const amplitude = (frame.features.zeroCrossingRate * 0.3 + frame.features.amplitude * 0.2) * 2;

        // Add sine wave oscillation to Y position
        const phase = i * 0.1; // Per-point phase offset
        const offset = Math.sin(time * speed + phase) * amplitude;

        positions[i * 3 + 1] = originalPositions[i * 3 + 1] + offset;
      }

      this.pointsObject.geometry.attributes.position.needsUpdate = true;
    }

    // Update visualization every 30 frames (~500ms at 60fps)
    if (!this.lastVisualizationUpdate) this.lastVisualizationUpdate = 0;
    if (Date.now() - this.lastVisualizationUpdate > 500) {
      this.updateVisualization();
      this.lastVisualizationUpdate = Date.now();
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Start dragging panel
   */
  startDrag(e) {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') return;

    this.isDragging = true;
    const rect = this.panel.getBoundingClientRect();
    this.dragOffset.x = e.clientX - rect.left;
    this.dragOffset.y = e.clientY - rect.top;

    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.stopDrag);

    e.preventDefault();
  }

  onDrag = (e) => {
    if (!this.isDragging) return;

    const x = e.clientX - this.dragOffset.x;
    const y = e.clientY - this.dragOffset.y;

    this.panel.style.left = x + 'px';
    this.panel.style.top = y + 'px';
    this.panel.style.right = 'auto';
    this.panel.style.transform = 'none';

    this.panelPosition.x = x;
    this.panelPosition.y = y;
  }

  stopDrag = () => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDrag);
  }

  /**
   * Close the panel
   */
  close() {
    if (!this.isOpen) return;

    // Stop animation and processing
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.processingFrameId) {
      clearTimeout(this.processingFrameId);
      this.processingFrameId = null;
    }

    // Clean up THREE.js
    if (this.renderer) {
      this.renderer.dispose();
      if (this.controls) this.controls.dispose();
    }

    // Remove panel
    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
    }

    this.isOpen = false;
    console.log('[MANIFOLD] 🎨 Audio Manifold Panel closed');
  }

  /**
   * Toggle panel visibility
   */
  toggle() {
    console.log('[MANIFOLD] 🎨 Audio Manifold Panel toggle() called, isOpen:', this.isOpen);
    try {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    } catch (error) {
      console.error('[MANIFOLD] ❌ Audio Manifold Panel toggle() error:', error);
    }
  }
}

console.log('[MANIFOLD] ✅ Audio Manifold Panel ready');
