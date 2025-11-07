// Timeline Playback Panel (Phase 13.17)
// Dedicated viewer for playing back recorded timeline sessions
// Side-by-side comparison with live visuals

console.log("⏱️ timelinePlaybackPanel.js loaded");

import * as THREE from 'three';
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
    this.geometry = null;
    this.material = null;
    this.mesh = null;

    // Playback state
    this.timeline = null;
    this.animationFrame = null;

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
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.canvasContainer.appendChild(this.renderer.domElement);

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

      // Always add a small rotation for visual feedback (even without timeline data)
      if (this.mesh) {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
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
        // Audio-reactive rotation (subtler than before)
        this.mesh.rotation.x += bass * 0.05;
        this.mesh.rotation.y += mid * 0.05;
        this.mesh.rotation.z += treble * 0.05;

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
