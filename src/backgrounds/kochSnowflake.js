// Koch Snowflake Background - Infinite fractal zoom with audio reactivity
// Recursive L-System fractal: F -> F+F--F+F (60° angles)

import * as THREE from 'three';
import { state, getEffectiveAudio } from '../state.js';

console.log('❄️ kochSnowflake.js loaded');

/**
 * Koch Snowflake Background
 * - Infinite zoom capability with adaptive detail
 * - Audio-reactive colors and zoom
 * - Recursive path generation
 */
export class KochSnowflakeBackground {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    // Canvas for 2D fractal rendering
    this.canvas = document.createElement('canvas');
    this.canvas.width = 2048;
    this.canvas.height = 2048;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = true;

    // Koch constants
    this.ANGLE = Math.PI / 3; // 60 degrees
    this.WORLD_SIZE = 1000;
    this.INITIAL_LENGTH = this.WORLD_SIZE * 0.8;
    this.FRACTAL_CENTER_X = 500;
    this.FRACTAL_CENTER_Y = 500;

    // View/Camera state
    this.scale = 2.5;
    this.offsetX = this.FRACTAL_CENTER_X;
    this.offsetY = this.FRACTAL_CENTER_Y;
    this.rotationAngle = 0;
    this.rotationSpeed = 0.005;

    // Detail settings
    this.minScreenLength = 0.5; // Adaptive detail threshold
    this.maxRecursionDepth = 35;
    this.maxScale = 1000; // Improved zoom limit
    this.minScale = 0.1;

    // Audio reactivity settings
    this.audioReactive = true;
    this.autoZoom = false;
    this.autoZoomSpeed = 0.02;

    // Color settings
    this.baseColors = {
      background: '#FFFFFF',
      outline: '#1f2937',
      fill: '#93c5fd'
    };

    this.audioColors = {
      background: '#000000',
      outline: '#ff0080',
      fill: '#00ffff'
    };

    this.colorMode = 'static'; // 'static', 'audio', 'theory'

    // Create texture and material
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.needsUpdate = true;

    // Skybox geometry - inside-out sphere
    const geometry = new THREE.SphereGeometry(100, 64, 64);
    geometry.scale(-1, 1, 1); // Flip inside-out

    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      side: THREE.BackSide,
      depthWrite: false
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.renderOrder = -1000;
    this.scene.add(this.mesh);

    // Stats
    this.visibleSegmentsCount = 0;

    console.log('❄️ Koch Snowflake background initialized');
  }

  /**
   * Recursively generate Koch curve path
   * Builds path using ctx.lineTo() under current transformation
   */
  recursiveGeneratePath(currX, currY, angle, length, depth) {
    const endX = currX + length * Math.cos(angle);
    const endY = currY + length * Math.sin(angle);

    // BASE CASE: Segment too small or max depth reached
    const projectedLength = length * this.scale;
    if (projectedLength < this.minScreenLength || depth >= this.maxRecursionDepth) {
      this.ctx.lineTo(endX, endY);
      this.visibleSegmentsCount++;
      return { x: endX, y: endY, angle: angle };
    }

    // RECURSIVE CASE: L-System rule F -> F+F--F+F
    const newLength = length / 3.0;
    let currentPos = { x: currX, y: currY };
    let currentAngle = angle;

    // F (Straight)
    currentPos = this.recursiveGeneratePath(currentPos.x, currentPos.y, currentAngle, newLength, depth + 1);

    // + (Turn left 60°)
    currentAngle = currentPos.angle - this.ANGLE;
    currentPos = this.recursiveGeneratePath(currentPos.x, currentPos.y, currentAngle, newLength, depth + 1);

    // -- (Turn right 120°)
    currentAngle = currentPos.angle + 2 * this.ANGLE;
    currentPos = this.recursiveGeneratePath(currentPos.x, currentPos.y, currentAngle, newLength, depth + 1);

    // + (Turn left 60°)
    currentAngle = currentPos.angle - this.ANGLE;

    // F (Straight)
    return this.recursiveGeneratePath(currentPos.x, currentPos.y, currentAngle, newLength, depth + 1);
  }

  /**
   * Get colors based on mode and audio data
   */
  getColors() {
    if (this.colorMode === 'static') {
      return { ...this.baseColors };
    }

    if (this.colorMode === 'audio' && this.audioReactive && state.audioReactive) {
      const audioData = getEffectiveAudio();
      const intensity = (audioData.bass + audioData.mid + audioData.treble) / 3;

      // Blend base and audio colors
      return {
        background: this.blendColors(this.baseColors.background, this.audioColors.background, intensity),
        outline: this.blendColors(this.baseColors.outline, this.audioColors.outline, intensity),
        fill: this.blendColors(this.baseColors.fill, this.audioColors.fill, intensity)
      };
    }

    if (this.colorMode === 'theory') {
      // Color theory mapping: bass=red, mid=green, treble=blue
      const audioData = getEffectiveAudio();
      return {
        background: '#000000',
        outline: this.rgbToHex(audioData.bass * 255, audioData.mid * 255, audioData.treble * 255),
        fill: this.rgbToHex(audioData.treble * 255, audioData.bass * 255, audioData.mid * 255)
      };
    }

    return { ...this.baseColors };
  }

  /**
   * Blend two hex colors by intensity
   */
  blendColors(hex1, hex2, intensity) {
    const c1 = this.hexToRgb(hex1);
    const c2 = this.hexToRgb(hex2);

    const r = Math.round(c1.r + (c2.r - c1.r) * intensity);
    const g = Math.round(c1.g + (c2.g - c1.g) * intensity);
    const b = Math.round(c1.b + (c2.b - c1.b) * intensity);

    return this.rgbToHex(r, g, b);
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Render the Koch snowflake to canvas
   */
  render() {
    const W = this.canvas.width;
    const H = this.canvas.height;

    // Get current colors
    const colors = this.getColors();

    // 1. Clear and set background
    this.ctx.fillStyle = colors.background;
    this.ctx.fillRect(0, 0, W, H);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // 2. Apply audio reactivity
    if (this.audioReactive && state.audioReactive) {
      const audioData = getEffectiveAudio();

      // Audio-reactive rotation speed
      this.rotationSpeed = 0.005 + audioData.mid * 0.01;

      // Auto-zoom with bass
      if (this.autoZoom) {
        const zoomFactor = 1.0 + audioData.bass * this.autoZoomSpeed;
        this.scale = Math.min(this.maxScale, this.scale * zoomFactor);
      }
    }

    // 3. Update rotation
    this.rotationAngle += this.rotationSpeed;
    if (this.rotationAngle > 2 * Math.PI) {
      this.rotationAngle -= 2 * Math.PI;
    }

    // 4. Apply camera transform (Pan/Zoom/Rotate)
    const centerX = W / 2;
    const centerY = H / 2;

    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(this.rotationAngle);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.translate(-this.offsetX, -this.offsetY);

    // 5. Setup drawing style
    this.ctx.lineWidth = Math.max(0.5, 1.5 / this.scale);
    this.ctx.lineJoin = 'bevel';
    this.ctx.lineCap = 'butt';

    this.visibleSegmentsCount = 0;

    // 6. Calculate starting vertices (equilateral triangle)
    const H_TRIANGLE_FULL = this.INITIAL_LENGTH * Math.sqrt(3) / 2;
    const Y_A = this.FRACTAL_CENTER_Y - H_TRIANGLE_FULL * 2 / 3;
    const SIDE_LENGTH = this.INITIAL_LENGTH;

    // 7. Generate entire closed path
    this.ctx.beginPath();

    let currX = this.FRACTAL_CENTER_X;
    let currY = Y_A;
    this.ctx.moveTo(currX, currY);

    // Side 1
    let startAngle1 = Math.PI / 6;
    let result = this.recursiveGeneratePath(currX, currY, startAngle1, SIDE_LENGTH, 0);

    // Side 2
    currX = result.x;
    currY = result.y;
    let startAngle2 = startAngle1 + 2 * this.ANGLE;
    result = this.recursiveGeneratePath(currX, currY, startAngle2, SIDE_LENGTH, 0);

    // Side 3
    currX = result.x;
    currY = result.y;
    let startAngle3 = startAngle2 + 2 * this.ANGLE;
    this.recursiveGeneratePath(currX, currY, startAngle3, SIDE_LENGTH, 0);

    this.ctx.closePath();

    // 8. Fill and stroke
    this.ctx.fillStyle = colors.fill;
    this.ctx.fill();

    this.ctx.strokeStyle = colors.outline;
    this.ctx.stroke();

    // Reset transform
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Update texture
    this.texture.needsUpdate = true;
  }

  /**
   * Update - called every frame
   */
  update() {
    if (!this._hasLoggedUpdate) {
      console.log('❄️ Koch update() called - starting render loop');
      console.log(`   Camera position: ${this.camera ? `(${this.camera.position.x}, ${this.camera.position.y}, ${this.camera.position.z})` : 'null'}`);
      console.log(`   Mesh position: (${this.mesh.position.x}, ${this.mesh.position.y}, ${this.mesh.position.z})`);
      console.log(`   Mesh visible: ${this.mesh.visible}`);
      console.log(`   Mesh in scene: ${this.scene.children.includes(this.mesh)}`);
      this._hasLoggedUpdate = true;
    }
    this.render();
  }

  /**
   * Zoom in/out
   */
  zoom(factor) {
    const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * factor));
    this.scale = newScale;
  }

  /**
   * Reset view
   */
  reset() {
    this.scale = 2.5;
    this.rotationAngle = 0;
    this.offsetX = this.FRACTAL_CENTER_X;
    this.offsetY = this.FRACTAL_CENTER_Y;
  }

  /**
   * Set color mode
   */
  setColorMode(mode) {
    this.colorMode = mode; // 'static', 'audio', 'theory'
    console.log(`❄️ Koch color mode: ${mode}`);
  }

  /**
   * Set colors
   */
  setColors(base, audio) {
    if (base) this.baseColors = { ...this.baseColors, ...base };
    if (audio) this.audioColors = { ...this.audioColors, ...audio };
  }

  /**
   * Dispose
   */
  dispose() {
    this.scene.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
    console.log('❄️ Koch Snowflake background disposed');
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      segments: this.visibleSegmentsCount,
      scale: this.scale.toFixed(2),
      rotation: (this.rotationAngle * 180 / Math.PI).toFixed(1),
      offset: `(${this.offsetX.toFixed(0)}, ${this.offsetY.toFixed(0)})`
    };
  }
}

console.log('❄️ Koch Snowflake background module ready');
