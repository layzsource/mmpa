// src/chronelixCylindricalSlicer.js
// Cylindrical Slice Visualizer for Chronelix MMPA System
// Proves the geometric relationship between helical flow and sine/cosine waveforms
// by slicing the cylinder at lambda-modulated angles

import * as THREE from 'three';

console.log("🔪 chronelixCylindricalSlicer.js loaded");

/**
 * Cylindrical Slice Visualizer
 *
 * This implements real cylindrical geometry to prove the mathematical
 * relationship between helical particle flow and waveform decomposition.
 *
 * Key Mathematics:
 * - Helix parametric form: (r·cos(θ), y, r·sin(θ))
 * - Slice plane at angle λ: n = [sin(λ), 0, cos(λ)]
 * - Unwrap transformation: (θ, y) → reveals sinusoidal pattern
 * - Respects trigonometry and physics principles
 */
export class ChronelixCylindricalSlicer {
  constructor() {
    // Slice plane control
    this.sliceAngle = 0;           // λ modulation angle (0 to 2π)
    this.planeOffset = 0;          // Plane position along slice direction
    this.planeThickness = 0.5;     // Capture zone thickness
    this.xAxisTilt = 0;            // X-axis tilt angle (chromatic step 0-11)

    // Cylinder geometry (from chronelix constants)
    this.cylinderRadius = 0;
    this.cylinderHeight = 0;

    // Intersection data
    this.intersectionPoints = [];   // Particles intersecting plane
    this.maxIntersections = 200;

    // Unwrapped surface data
    this.unwrappedData = {
      sine: [],      // X-component when unwrapped
      cosine: [],    // Z-component when unwrapped
      time: []       // Y-position (time proxy)
    };

    // Timeline data (for temporal visualization)
    this.timelineData = [];         // Array of {time, sine, cosine, lambda}
    this.timelineWindow = 10000;    // Time window in milliseconds (10 seconds)
    this.timelineStartTime = Date.now();

    // THREE.js visualization objects
    this.slicePlaneGroup = null;
    this.intersectionGroup = null;
    this.unwrapCanvasGroup = null;

    // Canvas for 2D unwrapped plot
    this.canvas2D = null;
    this.ctx2D = null;
    this.canvasTexture = null;

    // Statistics
    this.stats = {
      totalIntersections: 0,
      avgSineAmplitude: 0,
      avgCosineAmplitude: 0,
      dominantFrequency: 0
    };

    // Debug/visualization modes
    this.showSlicePlane = true;
    this.showIntersectionPoints = true;
    this.showUnwrappedPlot = true;
  }

  /**
   * Initialize the slicer
   */
  init(chronelixConstants, scene) {
    // Store cylinder geometry
    this.cylinderRadius = chronelixConstants.HELIX_RADIUS;
    this.cylinderHeight = chronelixConstants.Y_TOTAL_HEIGHT;

    // Create visualization groups
    this.slicePlaneGroup = new THREE.Group();
    this.intersectionGroup = new THREE.Group();
    this.unwrapCanvasGroup = new THREE.Group();

    scene.add(this.slicePlaneGroup);
    scene.add(this.intersectionGroup);
    scene.add(this.unwrapCanvasGroup);

    // Create slice plane visualization
    this.createSlicePlaneVisual();

    // Create 2D unwrapped plot canvas
    this.create2DUnwrapCanvas();

    console.log("🔪 Cylindrical slicer initialized");
  }

  /**
   * Create visual representation of the slicing plane
   */
  createSlicePlaneVisual() {
    // Plane geometry (large enough to cut through cylinder)
    const planeSize = this.cylinderRadius * 4;
    const planeGeometry = new THREE.PlaneGeometry(planeSize, this.cylinderHeight);

    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    this.slicePlaneMesh = new THREE.Mesh(planeGeometry, planeMaterial);

    // Plane edges for better visibility
    const edgesGeometry = new THREE.EdgesGeometry(planeGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      linewidth: 2
    });
    const planeEdges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

    this.slicePlaneMesh.add(planeEdges);
    this.slicePlaneGroup.add(this.slicePlaneMesh);

    // Normal vector indicator
    const arrowLength = this.cylinderRadius * 1.5;
    const arrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 0),
      arrowLength,
      0x00ffff,
      arrowLength * 0.2,
      arrowLength * 0.1
    );
    this.slicePlaneGroup.add(arrowHelper);
    this.planeNormalArrow = arrowHelper;
  }

  /**
   * Create 2D canvas for unwrapped waveform plot
   */
  create2DUnwrapCanvas() {
    // Canvas dimensions
    const canvasWidth = 512;
    const canvasHeight = 256;

    // Create HTML canvas
    this.canvas2D = document.createElement('canvas');
    this.canvas2D.width = canvasWidth;
    this.canvas2D.height = canvasHeight;
    this.ctx2D = this.canvas2D.getContext('2d');

    // Create THREE texture from canvas
    this.canvasTexture = new THREE.CanvasTexture(this.canvas2D);
    this.canvasTexture.needsUpdate = true;

    // Create plane to display canvas in 3D space
    const displayWidth = 30;
    const displayHeight = displayWidth * (canvasHeight / canvasWidth);

    const canvasGeometry = new THREE.PlaneGeometry(displayWidth, displayHeight);
    const canvasMaterial = new THREE.MeshBasicMaterial({
      map: this.canvasTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });

    this.unwrapCanvas3D = new THREE.Mesh(canvasGeometry, canvasMaterial);

    // Position to the right of the chronelix
    this.unwrapCanvas3D.position.set(
      this.cylinderRadius * 3,
      0,
      0
    );

    this.unwrapCanvasGroup.add(this.unwrapCanvas3D);
  }

  /**
   * Update slicer with lambda modulation angle
   * @param {number} lambdaRotation - Current λ rotation (0 to 2π)
   * @param {Array} particles - Array of data particles from particle stream
   * @param {number} xAxisTilt - X-axis tilt angle (chromatic step 0-11)
   */
  update(lambdaRotation, particles, xAxisTilt = 0) {
    // Update slice angle from lambda modulation
    this.sliceAngle = lambdaRotation;

    // Update X-axis tilt (chromatic step 0-11)
    this.xAxisTilt = xAxisTilt;

    // Update plane offset based on lambda rotation (oscillate back and forth)
    // Maps lambda rotation (0 to 2π) to plane offset (-radius to +radius)
    const offsetAmplitude = this.cylinderRadius * 0.8; // 80% of radius
    this.planeOffset = Math.sin(lambdaRotation) * offsetAmplitude;

    // Update plane orientation
    this.updatePlaneOrientation();

    // Find particle intersections with plane
    this.findIntersections(particles);

    // Update unwrapped visualization
    this.updateUnwrappedPlot();

    // Update visibility
    this.slicePlaneGroup.visible = this.showSlicePlane;
    this.intersectionGroup.visible = this.showIntersectionPoints;
    this.unwrapCanvasGroup.visible = this.showUnwrappedPlot;
  }

  /**
   * Update slice plane orientation based on lambda angle and X-axis tilt
   *
   * Plane normal: n = [sin(λ), 0, cos(λ)]
   * This ensures the plane rotates around Y-axis (cylinder axis)
   * respecting trigonometric principles
   *
   * X-axis tilt adds additional rotation for chromatic stepping
   */
  updatePlaneOrientation() {
    if (!this.slicePlaneMesh) return;

    // Plane normal vector from lambda angle
    const nx = Math.sin(this.sliceAngle);
    const ny = 0;  // Plane perpendicular to XZ (horizontal)
    const nz = Math.cos(this.sliceAngle);

    const normal = new THREE.Vector3(nx, ny, nz).normalize();

    // Orient plane perpendicular to normal
    // Plane initially faces +Z, rotate to face normal direction
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      normal
    );

    // Apply X-axis tilt from chromatic position (0-11 maps to -60° to +60°)
    const tiltRange = Math.PI / 3; // 60° in radians
    const tiltAngle = ((this.xAxisTilt / 11) * 2 - 1) * tiltRange; // Maps 0-11 to -60° to +60°

    const xTiltQuat = new THREE.Quaternion();
    xTiltQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), tiltAngle);

    // Combine rotations: first lambda rotation, then X-axis tilt
    quaternion.multiply(xTiltQuat);

    this.slicePlaneMesh.quaternion.copy(quaternion);

    // Update normal arrow to show the actual tilted plane normal
    // This includes both lambda angle and X-axis tilt
    if (this.planeNormalArrow) {
      const tiltedNormal = normal.clone().applyQuaternion(xTiltQuat);
      this.planeNormalArrow.setDirection(tiltedNormal);
    }

    // Position plane at offset along normal
    const basePosition = normal.clone().multiplyScalar(this.planeOffset);
    this.slicePlaneMesh.position.copy(basePosition);
  }

  /**
   * Find particles intersecting the slice plane
   *
   * Uses signed distance to plane:
   * d = (P - P0) · n
   * where P0 is point on plane, n is normal
   */
  findIntersections(particles) {
    if (!particles) return;

    // Clear previous intersections
    this.clearIntersectionVisuals();
    this.intersectionPoints = [];

    // Plane equation: n·x + d = 0
    const nx = Math.sin(this.sliceAngle);
    const nz = Math.cos(this.sliceAngle);
    const normal = new THREE.Vector3(nx, 0, nz);

    // Plane origin (offset along normal)
    const planeOrigin = normal.clone().multiplyScalar(this.planeOffset);

    // Check each particle
    for (const particle of particles) {
      if (!particle.active || !particle.mesh) continue;

      const pos = particle.mesh.position;

      // Signed distance to plane
      const toPoint = new THREE.Vector3().subVectors(pos, planeOrigin);
      const signedDistance = toPoint.dot(normal);

      // Check if within capture thickness
      if (Math.abs(signedDistance) < this.planeThickness) {
        // Calculate unwrapped coordinates
        const unwrapped = this.unwrapPoint(pos);

        this.intersectionPoints.push({
          particle: particle,
          position3D: pos.clone(),
          unwrapped: unwrapped,
          signedDistance: signedDistance
        });

        // Create visual marker
        this.createIntersectionMarker(pos);

        // Add to timeline data
        const now = Date.now();
        this.timelineData.push({
          time: now,
          sine: unwrapped.sine,
          cosine: unwrapped.cosine,
          lambda: this.sliceAngle
        });
      }
    }

    // Limit intersection history
    if (this.intersectionPoints.length > this.maxIntersections) {
      this.intersectionPoints = this.intersectionPoints.slice(-this.maxIntersections);
    }

    // Trim old timeline data outside time window
    const now = Date.now();
    const cutoff = now - this.timelineWindow;
    this.timelineData = this.timelineData.filter(d => d.time >= cutoff);

    this.stats.totalIntersections = this.intersectionPoints.length;
  }

  /**
   * Unwrap 3D cylindrical coordinates to 2D planar coordinates
   *
   * Cylindrical → Planar transformation:
   * (x, y, z) → (θ, y) where θ = atan2(z, x)
   *
   * When plotted:
   * - X-component (r·cos(θ)) → sine wave
   * - Z-component (r·sin(θ)) → cosine wave
   */
  unwrapPoint(position3D) {
    const x = position3D.x;
    const y = position3D.y;
    const z = position3D.z;

    // Cylindrical angle θ
    const theta = Math.atan2(z, x);

    // Linearize: arc length = r·θ
    const linearPosition = this.cylinderRadius * theta;

    // Radius (should be approximately constant)
    const radius = Math.sqrt(x * x + z * z);

    // Decompose into sine and cosine components
    // When θ varies, these trace sinusoidal patterns
    const sineComponent = x;      // r·cos(θ) → sine pattern
    const cosineComponent = z;    // r·sin(θ) → cosine pattern

    return {
      theta: theta,              // Angle (radians)
      linear: linearPosition,    // Arc length (unwrapped)
      y: y,                      // Height (time proxy)
      radius: radius,
      sine: sineComponent,       // X-component
      cosine: cosineComponent    // Z-component
    };
  }

  /**
   * Create visual marker for intersection point
   */
  createIntersectionMarker(position) {
    const geometry = new THREE.SphereGeometry(0.15, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.7
    });

    const marker = new THREE.Mesh(geometry, material);
    marker.position.copy(position);

    this.intersectionGroup.add(marker);
  }

  /**
   * Clear intersection visual markers
   */
  clearIntersectionVisuals() {
    while (this.intersectionGroup.children.length > 0) {
      const child = this.intersectionGroup.children[0];
      this.intersectionGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    }
  }

  /**
   * Update 2D unwrapped waveform plot
   *
   * Plots sine and cosine components extracted from cylindrical unwrapping
   * This proves the geometric relationship between helix and waveforms
   */
  updateUnwrappedPlot() {
    if (!this.ctx2D) return;

    const ctx = this.ctx2D;
    const width = this.canvas2D.width;
    const height = this.canvas2D.height;

    // Allocate space: 70% for waveform, 30% for timeline
    const waveformHeight = Math.floor(height * 0.70);
    const timelineHeight = height - waveformHeight;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.fillRect(0, 0, width, height);

    // Draw grid for waveform section
    this.drawGrid(ctx, width, waveformHeight);

    // Collect unwrapped data from recent intersections
    const sineData = [];
    const cosineData = [];

    for (const intersection of this.intersectionPoints) {
      const u = intersection.unwrapped;

      // Normalize y to canvas coordinates (0 to 1)
      const yNorm = (u.y + this.cylinderHeight / 2) / this.cylinderHeight;

      sineData.push({
        x: yNorm,
        y: u.sine
      });

      cosineData.push({
        x: yNorm,
        y: u.cosine
      });
    }

    // Draw waveforms in upper section
    if (sineData.length > 1) {
      this.drawWaveform(ctx, sineData, width, waveformHeight, '#14b8a6', 'Sine (X)');
    }

    if (cosineData.length > 1) {
      this.drawWaveform(ctx, cosineData, width, waveformHeight, '#7c3aed', 'Cosine (Z)');
    }

    // Draw labels for waveform section
    this.drawLabels(ctx, width, waveformHeight);

    // Draw timeline in lower section
    this.drawTimeline(ctx, width, height, waveformHeight, timelineHeight);

    // Update texture
    if (this.canvasTexture) {
      this.canvasTexture.needsUpdate = true;
    }

    // Update statistics
    this.updateStatistics(sineData, cosineData);
  }

  /**
   * Draw grid on canvas
   */
  drawGrid(ctx, width, height) {
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical lines
    for (let i = 0; i <= 8; i++) {
      const x = (i / 8) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Center line (zero)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }

  /**
   * Draw waveform on canvas
   */
  drawWaveform(ctx, data, width, height, color, label) {
    if (data.length < 2) return;

    // Sort by x (time)
    data.sort((a, b) => a.x - b.x);

    // Find amplitude range for scaling
    let minY = Infinity;
    let maxY = -Infinity;
    for (const point of data) {
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }

    const yRange = Math.max(Math.abs(minY), Math.abs(maxY), this.cylinderRadius);

    // Draw waveform
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const point = data[i];

      // Map to canvas coordinates
      const canvasX = point.x * width;
      const canvasY = height / 2 - (point.y / yRange) * (height / 2) * 0.8;

      if (i === 0) {
        ctx.moveTo(canvasX, canvasY);
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }

    ctx.stroke();

    // Draw label
    ctx.fillStyle = color;
    ctx.font = '12px monospace';
    ctx.fillText(label, 10, data === this.unwrappedData.sine ? 20 : 40);
  }

  /**
   * Draw labels on canvas
   */
  drawLabels(ctx, width, height) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('Cylindrical Unwrap', width / 2 - 70, 20);

    ctx.font = '10px monospace';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText(`λ = ${(this.sliceAngle * 180 / Math.PI).toFixed(1)}°`, width - 80, 20);
    ctx.fillText(`n = ${this.intersectionPoints.length}`, width - 80, 35);
  }

  /**
   * Draw timeline visualization
   * Shows temporal evolution of sine/cosine waveform components
   */
  drawTimeline(ctx, width, totalHeight, waveformHeight, timelineHeight) {
    const timelineY = waveformHeight;
    const padding = 30;
    const plotHeight = timelineHeight - padding - 20;
    const plotWidth = width - 2 * padding;

    // Draw timeline background
    ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
    ctx.fillRect(0, timelineY, width, timelineHeight);

    // Draw timeline border
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, timelineY);
    ctx.lineTo(width, timelineY);
    ctx.stroke();

    // Draw title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('Timeline (10s window)', padding, timelineY + 18);

    // Draw grid
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = timelineY + padding + (i / 4) * plotHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 8; i++) {
      const x = padding + (i / 8) * plotWidth;
      ctx.beginPath();
      ctx.moveTo(x, timelineY + padding);
      ctx.lineTo(x, timelineY + padding + plotHeight);
      ctx.stroke();
    }

    // Draw center line (zero)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    const centerY = timelineY + padding + plotHeight / 2;
    ctx.beginPath();
    ctx.moveTo(padding, centerY);
    ctx.lineTo(width - padding, centerY);
    ctx.stroke();

    // Get time range
    const now = Date.now();
    const timeStart = now - this.timelineWindow;
    const timeEnd = now;

    // Find min/max values for scaling
    let minValue = 0;
    let maxValue = 0;
    for (const d of this.timelineData) {
      minValue = Math.min(minValue, d.sine, d.cosine);
      maxValue = Math.max(maxValue, d.sine, d.cosine);
    }

    // Add padding to value range
    const valueRange = Math.max(Math.abs(minValue), Math.abs(maxValue)) * 1.2;
    minValue = -valueRange;
    maxValue = valueRange;

    // Helper function to map data to canvas coordinates
    const mapToCanvas = (time, value) => {
      const x = padding + ((time - timeStart) / (timeEnd - timeStart)) * plotWidth;
      const y = timelineY + padding + plotHeight / 2 - (value / (maxValue - minValue)) * plotHeight;
      return { x, y };
    };

    // Draw sine component (teal)
    if (this.timelineData.length > 1) {
      ctx.strokeStyle = '#14b8a6';
      ctx.lineWidth = 2;
      ctx.beginPath();

      let firstPoint = true;
      for (const d of this.timelineData) {
        const pos = mapToCanvas(d.time, d.sine);
        if (firstPoint) {
          ctx.moveTo(pos.x, pos.y);
          firstPoint = false;
        } else {
          ctx.lineTo(pos.x, pos.y);
        }
      }
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#14b8a6';
      ctx.font = '10px monospace';
      ctx.fillText('Sine', width - padding - 40, timelineY + 18);
    }

    // Draw cosine component (purple)
    if (this.timelineData.length > 1) {
      ctx.strokeStyle = '#7c3aed';
      ctx.lineWidth = 2;
      ctx.beginPath();

      let firstPoint = true;
      for (const d of this.timelineData) {
        const pos = mapToCanvas(d.time, d.cosine);
        if (firstPoint) {
          ctx.moveTo(pos.x, pos.y);
          firstPoint = false;
        } else {
          ctx.lineTo(pos.x, pos.y);
        }
      }
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#7c3aed';
      ctx.font = '10px monospace';
      ctx.fillText('Cosine', width - padding - 90, timelineY + 18);
    }

    // Draw time axis labels
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '9px monospace';
    ctx.fillText('10s', padding, timelineY + padding + plotHeight + 15);
    ctx.fillText('5s', padding + plotWidth / 2, timelineY + padding + plotHeight + 15);
    ctx.fillText('0s (now)', width - padding - 35, timelineY + padding + plotHeight + 15);

    // Draw value axis labels
    ctx.fillText(maxValue.toFixed(2), 5, timelineY + padding + 5);
    ctx.fillText('0', 5, centerY + 5);
    ctx.fillText(minValue.toFixed(2), 5, timelineY + padding + plotHeight);
  }

  /**
   * Update statistics
   */
  updateStatistics(sineData, cosineData) {
    if (sineData.length > 0) {
      const sineAmps = sineData.map(d => Math.abs(d.y));
      this.stats.avgSineAmplitude = sineAmps.reduce((a, b) => a + b, 0) / sineAmps.length;
    }

    if (cosineData.length > 0) {
      const cosineAmps = cosineData.map(d => Math.abs(d.y));
      this.stats.avgCosineAmplitude = cosineAmps.reduce((a, b) => a + b, 0) / cosineAmps.length;
    }
  }

  /**
   * Set slice angle manually (for testing/control)
   */
  setSliceAngle(angle) {
    this.sliceAngle = angle % (Math.PI * 2);
  }

  /**
   * Set plane offset
   */
  setPlaneOffset(offset) {
    this.planeOffset = offset;
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      sliceAngle: (this.sliceAngle * 180 / Math.PI).toFixed(1) + '°',
      sliceAngleRad: this.sliceAngle.toFixed(3),
      planeOffset: this.planeOffset.toFixed(2),
      intersections: this.stats.totalIntersections,
      avgSineAmp: this.stats.avgSineAmplitude.toFixed(3),
      avgCosineAmp: this.stats.avgCosineAmplitude.toFixed(3)
    };
  }

  /**
   * Toggle visualization modes
   */
  toggleSlicePlane() {
    this.showSlicePlane = !this.showSlicePlane;
  }

  toggleIntersectionPoints() {
    this.showIntersectionPoints = !this.showIntersectionPoints;
  }

  toggleUnwrappedPlot() {
    this.showUnwrappedPlot = !this.showUnwrappedPlot;
  }

  /**
   * Dispose resources
   */
  dispose() {
    this.clearIntersectionVisuals();

    if (this.slicePlaneGroup) {
      this.slicePlaneGroup.parent?.remove(this.slicePlaneGroup);
    }

    if (this.intersectionGroup) {
      this.intersectionGroup.parent?.remove(this.intersectionGroup);
    }

    if (this.unwrapCanvasGroup) {
      this.unwrapCanvasGroup.parent?.remove(this.unwrapCanvasGroup);
    }

    if (this.canvasTexture) {
      this.canvasTexture.dispose();
    }
  }
}

// Singleton instance
export const cylindricalSlicer = new ChronelixCylindricalSlicer();

console.log("🔪 Cylindrical slicer ready");
