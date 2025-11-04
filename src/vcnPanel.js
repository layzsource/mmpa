// src/vcnPanel.js
// VCN Phase 1: Vessel Compass Navigator HUD Panel
// Conflat-6 compass showing direction/distance to signal destinations

import * as THREE from 'three';
import { state } from './state.js';

console.log("🧭 vcnPanel.js loaded");

/**
 * VCNPanel — The Vessel Compass Navigator HUD
 * A dowsing rod for sensing signal-space topology
 */
export class VCNPanel {
  constructor(destinationManager) {
    this.destinationManager = destinationManager;
    this.isOpen = false;
    this.panel = null;
    this.canvas = null;
    this.ctx = null;

    // Current tracking
    this.nearestByCategory = {};
    this.overallNearest = null;

    // Conflat-6 face configuration (6 directional axes)
    // Canvas angles: 0°=right, 90°=down, 180°=left, 270°=up
    // North is +Z (1), South is -Z (-1)
    this.faces = [
      { axis: 'north', dir: [0, 0, 1], angle: 270, color: '#00ffff', category: 'geometry', label: 'North (+Z)' },
      { axis: 'south', dir: [0, 0, -1], angle: 90, color: '#ff00ff', category: 'mandala', label: 'South (-Z)' },
      { axis: 'east', dir: [1, 0, 0], angle: 0, color: '#ff0000', category: 'streams', label: 'East (+X)' },
      { axis: 'west', dir: [-1, 0, 0], angle: 180, color: '#00ff00', category: 'particles', label: 'West (-X)' },
      { axis: 'up', dir: [0, 1, 0], angle: -90, color: '#0000ff', category: 'telemetry', label: 'Up (+Y)' },
      { axis: 'down', dir: [0, -1, 0], angle: 90, color: '#ffff00', category: 'parameters', label: 'Down (-Y)' }
    ];

    // Compass geometry
    this.compassRadius = 90;
    this.pulsePhase = 0;

    console.log("🧭 VCNPanel initialized");
  }

  open() {
    if (this.isOpen) return;

    // Create panel container
    this.panel = document.createElement('div');
    this.panel.id = 'vcnPanel';
    this.panel.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 380px;
      height: 480px;
      background: rgba(0, 0, 0, 0.9);
      border: 2px solid #6644aa;
      border-radius: 8px;
      padding: 15px;
      z-index: 1000;
      font-family: 'Courier New', monospace;
      color: #fff;
      box-shadow: 0 0 30px rgba(102, 68, 170, 0.7);
    `;

    // Title
    const title = document.createElement('div');
    title.style.cssText = `
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
      text-align: center;
      color: #6644aa;
      text-transform: uppercase;
      letter-spacing: 2px;
    `;
    title.textContent = '🧭 Vessel Compass Navigator';
    this.panel.appendChild(title);

    // Compass canvas (Conflat-6 geometry)
    this.canvas = document.createElement('canvas');
    this.canvas.width = 280;
    this.canvas.height = 280;
    this.canvas.style.cssText = `
      display: block;
      margin: 0 auto 15px auto;
      border: 1px solid #444;
      background: #000;
    `;
    this.ctx = this.canvas.getContext('2d');
    this.panel.appendChild(this.canvas);

    // Flight Telemetry container (camera position/direction/speed)
    const flightTelemetry = document.createElement('div');
    flightTelemetry.id = 'vcnFlightTelemetry';
    flightTelemetry.style.cssText = `
      font-size: 11px;
      line-height: 1.6;
      margin-bottom: 12px;
      padding: 8px;
      background: rgba(102, 68, 170, 0.15);
      border: 1px solid #6644aa;
      border-radius: 4px;
    `;
    flightTelemetry.innerHTML = `
      <div style="font-size: 10px; color: #6644aa; margin-bottom: 6px; font-weight: bold;">🛩️ Flight Telemetry</div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 10px;">
        <span>Position:</span>
        <span id="vcnPosition" style="font-family: monospace;">--</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 10px;">
        <span>Direction:</span>
        <span id="vcnDirection" style="font-family: monospace;">--</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 10px;">
        <span>Speed:</span>
        <span id="vcnSpeed" style="font-family: monospace; color: #00ff00;">--</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 10px;">
        <span>Thrust:</span>
        <span id="vcnThrust" style="font-family: monospace; color: #ffaa00;">--</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 10px;">
        <span>Mode:</span>
        <span id="vcnMode" style="font-family: monospace; color: #ff00ff;">--</span>
      </div>
    `;
    this.panel.appendChild(flightTelemetry);

    // Metrics container
    const metrics = document.createElement('div');
    metrics.id = 'vcnMetrics';
    metrics.style.cssText = `
      font-size: 11px;
      line-height: 1.6;
    `;
    metrics.innerHTML = `
      <div style="font-size: 10px; color: #888; margin-bottom: 6px; font-weight: bold;">🎯 Nearest Destination</div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #aaa;">
        <span>Type:</span>
        <span id="vcnType">--</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>Distance:</span>
        <span id="vcnDistance">--</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>Bearing:</span>
        <span id="vcnBearing">--</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>Signal:</span>
        <span id="vcnSignal">--</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span>Category:</span>
        <span id="vcnCategory">--</span>
      </div>
      <div style="border-top: 1px solid #333; padding-top: 8px; margin-top: 8px;">
        <div style="font-size: 10px; color: #888; margin-bottom: 4px;">Active Destinations</div>
        <div id="vcnStats" style="font-size: 10px; color: #aaa;"></div>
      </div>
    `;
    this.panel.appendChild(metrics);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close [E]';
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 5px 10px;
      background: rgba(255, 0, 0, 0.3);
      color: #fff;
      border: 1px solid #ff0000;
      border-radius: 3px;
      cursor: pointer;
      font-size: 10px;
    `;
    closeBtn.addEventListener('click', () => this.close());
    this.panel.appendChild(closeBtn);

    // Instructions
    const instructions = document.createElement('div');
    instructions.style.cssText = `
      position: absolute;
      bottom: 10px;
      left: 10px;
      right: 10px;
      font-size: 9px;
      color: #666;
      text-align: center;
      line-height: 1.4;
    `;
    instructions.innerHTML = `
      WASD: Move | Mouse: Look | Space/Shift: Up/Down<br>
      ESC: Exit navigation | R: Reset camera
    `;
    this.panel.appendChild(instructions);

    document.body.appendChild(this.panel);
    this.isOpen = true;
    console.log("🧭 VCN Panel opened");
  }

  close() {
    if (!this.isOpen || !this.panel) return;

    document.body.removeChild(this.panel);
    this.panel = null;
    this.canvas = null;
    this.ctx = null;
    this.isOpen = false;
    console.log("🧭 VCN Panel closed");
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  update(camera) {
    if (!this.isOpen || !this.ctx) return;

    this.pulsePhase += 0.05;

    // Get nearest destination overall
    this.overallNearest = this.destinationManager.getNearestTo(camera.position);

    // Get nearest destination per category (for Conflat-6 faces)
    this.nearestByCategory = {};
    this.faces.forEach(face => {
      this.nearestByCategory[face.category] = this.destinationManager.getNearestByCategory(
        camera.position,
        face.category
      );
    });

    // Update flight telemetry
    this.updateFlightTelemetry(camera);

    // Update canvas
    this.drawCompass(camera);

    // Update metrics
    this.updateMetrics(camera);
  }

  drawCompass(camera) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = this.compassRadius;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // Calculate direction to morph shape at world origin (0,0,0)
    const morphPosition = new THREE.Vector3(0, 0, 0);
    const toMorph = morphPosition.clone().sub(camera.position);
    const cameraForward = camera.getWorldDirection(new THREE.Vector3());
    // Calculate angle to morph relative to camera's forward direction
    const morphAngle = Math.atan2(toMorph.x, toMorph.z) - Math.atan2(cameraForward.x, cameraForward.z);

    // Draw Conflat-6 faces (rotated to always point north toward morph)
    this.faces.forEach(face => {
      this.drawFace(ctx, cx, cy, r, face, camera, morphAngle);
    });

    // Draw center circle (vessel position)
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#6644aa';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw vessel icon (small dot)
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }

  drawFace(ctx, cx, cy, r, face, camera, morphAngle) {
    // North face should point toward morph shape
    // Rotate face angle based on direction to morph
    const rotatedAngle = face.angle - (morphAngle * 180 / Math.PI);

    const destination = this.nearestByCategory[face.category];
    let intensity = 0.1; // Dim default

    if (destination && destination.active) {
      const bearing = destination.getBearingFrom(camera);
      const distance = destination.distance;
      const signalStrength = destination.getSignalStrength(distance);

      if (bearing > 0.5) {
        intensity = bearing * signalStrength;
      }
    }

    // Draw face as pie slice
    const startAngle = (rotatedAngle - 30) * Math.PI / 180;
    const endAngle = (rotatedAngle + 30) * Math.PI / 180;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();

    // Apply intensity with pulse
    const pulse = 0.8 + Math.sin(this.pulsePhase + face.angle) * 0.2;
    const finalIntensity = intensity * pulse;

    ctx.fillStyle = this.adjustColorIntensity(face.color, finalIntensity);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw face label (single letter only)
    const labelAngle = rotatedAngle * Math.PI / 180;
    const labelDist = r + 20;
    const labelX = cx + Math.cos(labelAngle) * labelDist;
    const labelY = cy + Math.sin(labelAngle) * labelDist;

    ctx.font = '11px monospace';
    ctx.fillStyle = intensity > 0.3 ? face.color : '#555';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const shortLabel = face.axis[0].toUpperCase();
    ctx.fillText(shortLabel, labelX, labelY);
  }

  drawMorphArrow(ctx, cx, cy, camera, morphPosition) {
    // Arrow always points straight up (north) toward morph shape
    const arrowLength = 50;
    const angle = 270 * Math.PI / 180; // Straight up

    const arrowX = cx + Math.cos(angle) * arrowLength;
    const arrowY = cy + Math.sin(angle) * arrowLength;

    // Draw arrow line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(arrowX, arrowY);
    ctx.strokeStyle = '#00ffff'; // Cyan for north/morph
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw arrowhead
    const headSize = 10;
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
      arrowX - headSize * Math.sin(angle - Math.PI / 6),
      arrowY + headSize * Math.cos(angle - Math.PI / 6)
    );
    ctx.lineTo(
      arrowX - headSize * Math.sin(angle + Math.PI / 6),
      arrowY + headSize * Math.cos(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = '#00ffff';
    ctx.fill();
  }

  updateFlightTelemetry(camera) {
    // Get telemetry from first-person controls
    const fpControls = window.fpControls;

    // Camera position
    const pos = camera.position;
    const posText = `${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}`;
    document.getElementById('vcnPosition').textContent = posText;

    // Camera direction (forward vector)
    const direction = camera.getWorldDirection(new THREE.Vector3());
    const dirText = `${direction.x.toFixed(2)}, ${direction.y.toFixed(2)}, ${direction.z.toFixed(2)}`;
    document.getElementById('vcnDirection').textContent = dirText;

    // Speed and thrust from fpControls telemetry
    if (fpControls && fpControls.telemetry) {
      const speed = fpControls.telemetry.speed || 0;
      const thrust = fpControls.telemetry.thrustMult || 1.0;
      const mode = fpControls.telemetry.mode || 'wave';

      document.getElementById('vcnSpeed').textContent = `${speed.toFixed(1)} m/s`;
      document.getElementById('vcnThrust').textContent = `${thrust.toFixed(2)}x`;

      // Color-code mode
      const modeColor = mode === 'wave' ? '#00ffff' : '#ff00ff';
      const modeIcon = mode === 'wave' ? '🌊' : '⚛️';
      document.getElementById('vcnMode').innerHTML = `<span style="color: ${modeColor}">${modeIcon} ${mode.toUpperCase()}</span>`;
    } else {
      document.getElementById('vcnSpeed').textContent = '--';
      document.getElementById('vcnThrust').textContent = '--';
      document.getElementById('vcnMode').textContent = '--';
    }
  }

  updateMetrics(camera) {
    if (!this.overallNearest) {
      document.getElementById('vcnType').textContent = 'No signal';
      document.getElementById('vcnDistance').textContent = '--';
      document.getElementById('vcnBearing').textContent = '--';
      document.getElementById('vcnSignal').textContent = '--';
      document.getElementById('vcnCategory').textContent = '--';
    } else {
      const dest = this.overallNearest;
      const bearing = dest.getBearingFrom(camera);
      const distance = dest.distance;
      const signalStrength = dest.getSignalStrength(distance);

      document.getElementById('vcnType').textContent = dest.type.replace(/_/g, ' ');
      document.getElementById('vcnDistance').textContent = distance.toFixed(1) + ' units';

      const bearingPercent = (bearing * 100).toFixed(0);
      const bearingDir = bearing > 0.8 ? '↑' : bearing > 0.3 ? '↗' : bearing > -0.3 ? '→' : '↓';
      document.getElementById('vcnBearing').textContent = `${bearingDir} ${bearingPercent}%`;

      document.getElementById('vcnSignal').textContent = (signalStrength * 100).toFixed(0) + '%';

      const catColor = dest.color || '#fff';
      document.getElementById('vcnCategory').innerHTML =
        `<span style="color: ${catColor}">${dest.category}</span>`;
    }

    // Update stats
    const stats = this.destinationManager.getStats();
    const statsEl = document.getElementById('vcnStats');
    if (statsEl) {
      const byCategory = Object.entries(stats.byCategory)
        .filter(([cat, count]) => count > 0)
        .map(([cat, count]) => `${cat}: ${count}`)
        .join(' | ');

      statsEl.textContent = `Total: ${stats.active} (${stats.autoGenerated} auto) | ${byCategory || 'None'}`;
    }
  }

  adjustColorIntensity(hexColor, intensity) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    const nr = Math.floor(r * intensity);
    const ng = Math.floor(g * intensity);
    const nb = Math.floor(b * intensity);

    return `rgb(${nr}, ${ng}, ${nb})`;
  }
}

console.log("🧭 VCN Panel ready");
