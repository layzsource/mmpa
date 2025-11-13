// src/cylindricalUnwrapPanel.js
// Dedicated HUD panel for Cylindrical Unwrap Visualization
// Shows the mathematical proof: helical flow → sine/cosine waveforms

console.log("📊 cylindricalUnwrapPanel.js loaded");

/**
 * CylindricalUnwrapPanel — Dedicated HUD for Unwrap Visualization
 *
 * Displays the 2D unwrapped waveforms extracted from the cylindrical
 * particle flow, proving the geometric relationship between helix and
 * trigonometric functions.
 */
export class CylindricalUnwrapPanel {
  constructor(cylindricalSlicer) {
    this.cylindricalSlicer = cylindricalSlicer;
    this.isOpen = false;
    this.panel = null;
    this.canvas = null;
    this.ctx = null;

    // Panel state
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.panelPosition = { x: null, y: null }; // null = use CSS default

    // Canvas dimensions
    this.canvasWidth = 640;
    this.canvasHeight = 320;

    // Timeline canvas
    this.timelineCanvas = null;
    this.timelineCtx = null;
    this.timelineHeight = 120;

    // Timeline data
    this.timelineHistory = [];
    this.MAX_HISTORY_SECONDS = 60;
    this.MAX_HISTORY_FRAMES = this.MAX_HISTORY_SECONDS * 60; // 60 FPS
    this.timelineStartTime = Date.now();

    // Animation
    this.animationFrameId = null;

    console.log("📊 CylindricalUnwrapPanel initialized");
  }

  /**
   * Open the panel
   */
  open() {
    if (this.isOpen) return;

    // Create panel container
    this.panel = document.createElement('div');
    this.panel.id = 'cylindrical-unwrap-panel';

    // Position panel
    if (this.panelPosition.x !== null && this.panelPosition.y !== null) {
      this.panel.style.cssText = `
        position: absolute;
        left: ${this.panelPosition.x}px;
        top: ${this.panelPosition.y}px;
        width: ${this.canvasWidth + 40}px;
        background: rgba(10, 10, 15, 0.95);
        border: 2px solid #14b8a6;
        border-radius: 12px;
        padding: 15px;
        z-index: 1000;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, monospace;
        color: #f0f0f0;
        box-shadow: 0 0 30px rgba(20, 184, 166, 0.4);
        overflow: hidden;
        box-sizing: border-box;
      `;
    } else {
      // Default position: top-left
      this.panel.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        width: ${this.canvasWidth + 40}px;
        background: rgba(10, 10, 15, 0.95);
        border: 2px solid #14b8a6;
        border-radius: 12px;
        padding: 15px;
        z-index: 1000;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, monospace;
        color: #f0f0f0;
        box-shadow: 0 0 30px rgba(20, 184, 166, 0.4);
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
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(20, 184, 166, 0.3);
      cursor: move;
      user-select: none;
    `;

    const title = document.createElement('div');
    title.textContent = '🔪 Cylindrical Unwrap';
    title.style.cssText = `
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: #14b8a6;
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
    closeBtn.onmouseenter = () => { closeBtn.style.color = '#14b8a6'; };
    closeBtn.onmouseleave = () => { closeBtn.style.color = '#f0f0f0'; };
    closeBtn.onclick = () => this.close();

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Make header draggable
    header.onmousedown = (e) => this.startDrag(e);

    // Canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.style.cssText = `
      width: 100%;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 8px;
      padding: 10px;
      box-sizing: border-box;
      margin-bottom: 10px;
    `;

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.canvas.style.cssText = `
      width: 100%;
      display: block;
      border-radius: 4px;
    `;
    this.ctx = this.canvas.getContext('2d');

    canvasContainer.appendChild(this.canvas);

    // Timeline section
    const timelineSection = document.createElement('div');
    timelineSection.style.cssText = `
      margin-top: 15px;
      background: rgba(0, 0, 0, 0.6);
      padding: 12px;
      border: 1px solid rgba(20, 184, 166, 0.3);
      border-radius: 8px;
    `;

    const timelineHeader = document.createElement('div');
    timelineHeader.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    `;

    const timelineTitle = document.createElement('div');
    timelineTitle.textContent = '⏱️ Amplitude Timeline';
    timelineTitle.style.cssText = `
      color: #14b8a6;
      font-size: 12px;
      font-weight: 600;
    `;

    const timelineLegend = document.createElement('div');
    timelineLegend.style.cssText = `
      display: flex;
      gap: 12px;
      font-size: 9px;
    `;
    timelineLegend.innerHTML = `
      <div style="display: flex; align-items: center; gap: 4px;">
        <div style="width: 12px; height: 2px; background: #14b8a6;"></div>
        <span style="color: #8a8d93;">Sine</span>
      </div>
      <div style="display: flex; align-items: center; gap: 4px;">
        <div style="width: 12px; height: 2px; background: #7c3aed;"></div>
        <span style="color: #8a8d93;">Cosine</span>
      </div>
    `;

    timelineHeader.appendChild(timelineTitle);
    timelineHeader.appendChild(timelineLegend);

    // Timeline canvas
    this.timelineCanvas = document.createElement('canvas');
    this.timelineCanvas.width = this.canvasWidth;
    this.timelineCanvas.height = this.timelineHeight;
    this.timelineCanvas.style.cssText = `
      width: 100%;
      display: block;
      border-radius: 4px;
      background: #0a0a0f;
      border: 1px solid rgba(100, 100, 100, 0.3);
      cursor: crosshair;
    `;
    this.timelineCtx = this.timelineCanvas.getContext('2d');

    // Timeline tooltip
    const timelineTooltip = document.createElement('div');
    timelineTooltip.id = 'unwrap-timeline-tooltip';
    timelineTooltip.style.cssText = `
      position: absolute;
      display: none;
      background: rgba(0, 0, 0, 0.9);
      border: 1px solid #14b8a6;
      border-radius: 3px;
      padding: 6px 8px;
      font-size: 10px;
      color: white;
      pointer-events: none;
      z-index: 1000;
      white-space: nowrap;
    `;

    // Add mouse interaction to timeline
    this.timelineCanvas.addEventListener('mousemove', (e) => this.handleTimelineHover(e, timelineTooltip));
    this.timelineCanvas.addEventListener('mouseleave', () => {
      timelineTooltip.style.display = 'none';
    });

    // Time scale
    const timeScale = document.createElement('div');
    timeScale.style.cssText = `
      display: flex;
      justify-content: space-between;
      margin-top: 6px;
      font-size: 9px;
      color: #666;
    `;
    timeScale.innerHTML = `
      <span>-60s</span>
      <span>-45s</span>
      <span>-30s</span>
      <span>-15s</span>
      <span style="color: #14b8a6;">Now</span>
    `;

    timelineSection.appendChild(timelineHeader);
    timelineSection.appendChild(this.timelineCanvas);
    timelineSection.appendChild(timelineTooltip);
    timelineSection.appendChild(timeScale);

    // Info section
    const infoSection = document.createElement('div');
    infoSection.id = 'unwrap-info';
    infoSection.style.cssText = `
      font-size: 11px;
      color: #8a8d93;
      line-height: 1.6;
    `;

    // Controls section
    const controlsSection = document.createElement('div');
    controlsSection.style.cssText = `
      display: flex;
      gap: 8px;
      margin-top: 10px;
    `;

    // Toggle buttons
    const togglePlaneBtn = this.createToggleButton('Slice Plane', () => {
      this.cylindricalSlicer.toggleSlicePlane();
    });
    const togglePointsBtn = this.createToggleButton('Intersections', () => {
      this.cylindricalSlicer.toggleIntersectionPoints();
    });

    controlsSection.appendChild(togglePlaneBtn);
    controlsSection.appendChild(togglePointsBtn);

    // Assemble panel
    this.panel.appendChild(header);
    this.panel.appendChild(canvasContainer);
    this.panel.appendChild(timelineSection);
    this.panel.appendChild(infoSection);
    this.panel.appendChild(controlsSection);

    document.body.appendChild(this.panel);

    this.isOpen = true;

    // Start animation loop
    this.startAnimation();

    console.log("📊 Cylindrical unwrap panel opened");
  }

  /**
   * Close the panel
   */
  close() {
    if (!this.isOpen) return;

    // Stop animation
    this.stopAnimation();

    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
    }

    this.panel = null;
    this.canvas = null;
    this.ctx = null;
    this.isOpen = false;

    console.log("📊 Cylindrical unwrap panel closed");
  }

  /**
   * Toggle panel visibility
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Create a toggle button
   */
  createToggleButton(label, onClick) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = `
      flex: 1;
      background: rgba(20, 184, 166, 0.2);
      border: 1px solid rgba(20, 184, 166, 0.4);
      border-radius: 6px;
      padding: 6px 12px;
      color: #14b8a6;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    `;
    btn.onmouseenter = () => {
      btn.style.background = 'rgba(20, 184, 166, 0.3)';
      btn.style.borderColor = '#14b8a6';
    };
    btn.onmouseleave = () => {
      btn.style.background = 'rgba(20, 184, 166, 0.2)';
      btn.style.borderColor = 'rgba(20, 184, 166, 0.4)';
    };
    btn.onclick = onClick;
    return btn;
  }

  /**
   * Start dragging
   */
  startDrag(e) {
    if (e.target.tagName === 'BUTTON') return; // Don't drag when clicking close button

    this.isDragging = true;
    const rect = this.panel.getBoundingClientRect();
    this.dragOffset.x = e.clientX - rect.left;
    this.dragOffset.y = e.clientY - rect.top;

    document.addEventListener('mousemove', this.drag);
    document.addEventListener('mouseup', this.stopDrag);
    e.preventDefault();
  }

  /**
   * Handle drag movement
   */
  drag = (e) => {
    if (!this.isDragging) return;

    const x = e.clientX - this.dragOffset.x;
    const y = e.clientY - this.dragOffset.y;

    this.panelPosition.x = x;
    this.panelPosition.y = y;

    this.panel.style.position = 'absolute';
    this.panel.style.left = `${x}px`;
    this.panel.style.top = `${y}px`;
    this.panel.style.bottom = 'auto';
    this.panel.style.right = 'auto';
  };

  /**
   * Stop dragging
   */
  stopDrag = () => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.drag);
    document.removeEventListener('mouseup', this.stopDrag);
  };

  /**
   * Start animation loop
   */
  startAnimation() {
    const animate = () => {
      if (!this.isOpen) return;

      this.render();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  /**
   * Stop animation loop
   */
  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Render the unwrap visualization
   */
  render() {
    if (!this.ctx || !this.cylindricalSlicer) return;

    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    this.drawGrid(ctx, width, height);

    // Get intersection data from slicer
    const intersectionPoints = this.cylindricalSlicer.intersectionPoints || [];
    const cylinderHeight = this.cylindricalSlicer.cylinderHeight || 24.27;
    const cylinderRadius = this.cylindricalSlicer.cylinderRadius || 15.0;

    // Collect unwrapped data
    const sineData = [];
    const cosineData = [];

    for (const intersection of intersectionPoints) {
      const u = intersection.unwrapped;

      // Normalize y to canvas coordinates (0 to 1)
      const yNorm = (u.y + cylinderHeight / 2) / cylinderHeight;

      sineData.push({
        x: yNorm,
        y: u.sine
      });

      cosineData.push({
        x: yNorm,
        y: u.cosine
      });
    }

    // Calculate average amplitudes for timeline
    let avgSineAmp = 0;
    let avgCosineAmp = 0;

    if (sineData.length > 0) {
      avgSineAmp = sineData.reduce((sum, d) => sum + Math.abs(d.y), 0) / sineData.length;
    }

    if (cosineData.length > 0) {
      avgCosineAmp = cosineData.reduce((sum, d) => sum + Math.abs(d.y), 0) / cosineData.length;
    }

    // Update timeline with amplitude data
    this.updateTimeline(avgSineAmp, avgCosineAmp);

    // Draw waveforms
    if (sineData.length > 1) {
      this.drawWaveform(ctx, sineData, width, height, '#14b8a6', 'Sine (X)', cylinderRadius);
    }

    if (cosineData.length > 1) {
      this.drawWaveform(ctx, cosineData, width, height, '#7c3aed', 'Cosine (Z)', cylinderRadius);
    }

    // Draw labels
    this.drawLabels(ctx, width, height);

    // Update info section
    this.updateInfo();
  }

  /**
   * Draw grid
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
   * Draw waveform
   */
  drawWaveform(ctx, data, width, height, color, label, yRange) {
    if (data.length < 2) return;

    // Sort by x (time)
    data.sort((a, b) => a.x - b.x);

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
    ctx.fillText(label, 10, label.includes('Sine') ? 20 : 40);
  }

  /**
   * Draw labels
   */
  drawLabels(ctx, width, height) {
    const sliceAngle = this.cylindricalSlicer.sliceAngle || 0;
    const intersectionCount = (this.cylindricalSlicer.intersectionPoints || []).length;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('Cylindrical Unwrap', width / 2 - 70, 20);

    ctx.font = '10px monospace';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText(`λ = ${(sliceAngle * 180 / Math.PI).toFixed(1)}°`, width - 80, 20);
    ctx.fillText(`n = ${intersectionCount}`, width - 80, 35);
  }

  /**
   * Update info section
   */
  updateInfo() {
    const infoSection = document.getElementById('unwrap-info');
    if (!infoSection) return;

    const debugInfo = this.cylindricalSlicer.getDebugInfo();

    infoSection.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <div><strong>Slice Angle:</strong> ${debugInfo.sliceAngle}</div>
        <div><strong>Intersections:</strong> ${debugInfo.intersections}</div>
        <div><strong>Plane Offset:</strong> ${debugInfo.planeOffset}</div>
        <div><strong>Sine Amp:</strong> ${debugInfo.avgSineAmp}</div>
        <div colspan="2"><strong>Cosine Amp:</strong> ${debugInfo.avgCosineAmp}</div>
      </div>
      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(138, 141, 147, 0.3); font-size: 10px; line-height: 1.5;">
        <em>Mathematical proof: Helical particle flow unwraps to sine/cosine waveforms.</em>
      </div>
    `;
  }

  /**
   * Update method (called from animation loop)
   */
  update() {
    // Rendering happens in animation loop
  }

  /**
   * Update timeline with new amplitude data
   */
  updateTimeline(sineAmplitude, cosineAmplitude) {
    // Add data point to history
    const dataPoint = {
      timestamp: Date.now(),
      sine: sineAmplitude,
      cosine: cosineAmplitude
    };

    this.timelineHistory.push(dataPoint);

    // Trim old data
    if (this.timelineHistory.length > this.MAX_HISTORY_FRAMES) {
      this.timelineHistory.shift();
    }

    // Render timeline
    this.renderTimelineCanvas();
  }

  /**
   * Render timeline canvas
   */
  renderTimelineCanvas() {
    if (!this.timelineCtx || !this.timelineCanvas) return;

    const ctx = this.timelineCtx;
    const width = this.timelineCanvas.width;
    const height = this.timelineCanvas.height;

    // Clear canvas
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    if (this.timelineHistory.length === 0) return;

    // Draw grid lines (every 15 seconds)
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const x = (i / 4) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Center line (zero)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Get cylinder radius for normalization
    const cylinderRadius = this.cylindricalSlicer?.cylinderRadius || 15.0;

    // Draw sine line (teal)
    ctx.strokeStyle = '#14b8a6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < this.timelineHistory.length; i++) {
      const x = (i / Math.max(this.MAX_HISTORY_FRAMES - 1, 1)) * width;
      const y = height / 2 - (this.timelineHistory[i].sine / cylinderRadius) * (height / 2) * 0.8;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Draw cosine line (purple)
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < this.timelineHistory.length; i++) {
      const x = (i / Math.max(this.MAX_HISTORY_FRAMES - 1, 1)) * width;
      const y = height / 2 - (this.timelineHistory[i].cosine / cylinderRadius) * (height / 2) * 0.8;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Draw playhead (current time)
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(width, height);
    ctx.stroke();
  }

  /**
   * Handle timeline hover interaction
   */
  handleTimelineHover(e, tooltip) {
    const rect = this.timelineCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate which data point we're hovering over
    const timelineLength = this.timelineHistory.length;

    if (timelineLength === 0) return;

    const dataIndex = Math.floor((x / rect.width) * timelineLength);

    if (dataIndex >= 0 && dataIndex < timelineLength) {
      const dataPoint = this.timelineHistory[dataIndex];
      const secondsAgo = Math.floor((Date.now() - dataPoint.timestamp) / 1000);

      // Show tooltip
      tooltip.style.display = 'block';
      tooltip.style.left = `${e.clientX - rect.left + 10}px`;
      tooltip.style.top = `${e.clientY - rect.top - 50}px`;

      tooltip.innerHTML = `
        <div style="color: #14b8a6; font-weight: bold; margin-bottom: 4px;">${secondsAgo}s ago</div>
        <div style="color: #14b8a6;">Sine: ${dataPoint.sine.toFixed(2)}</div>
        <div style="color: #7c3aed;">Cosine: ${dataPoint.cosine.toFixed(2)}</div>
      `;
    }
  }
}

console.log("📊 CylindricalUnwrapPanel ready");
