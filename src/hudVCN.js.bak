// src/hudVCN.js
// VCN Phase 1: HUD controls for Vessel Compass Navigator

import { state } from './state.js';

console.log("🧭 hudVCN.js loaded");

/**
 * Create VCN HUD Section
 * Controls for first-person navigation and compass system
 */
export function createVCNHudSection(container, notifyHUDUpdate) {
  console.log("🧭 Creating VCN HUD section...");

  const section = document.createElement('div');
  section.className = 'hud-section';
  section.style.cssText = 'margin-bottom: 20px; padding: 15px; border: 1px solid #444; border-radius: 4px; background: rgba(0,0,0,0.3);';

  // Title
  const title = document.createElement('h3');
  title.textContent = '🧭 Vessel Compass Navigator';
  title.style.cssText = 'margin: 0 0 15px 0; color: #6644aa; font-size: 16px;';
  section.appendChild(title);

  // VCN Panel Toggle
  const panelToggleBtn = document.createElement('button');
  panelToggleBtn.textContent = 'Toggle VCN Panel [E]';
  panelToggleBtn.style.cssText = 'width: 100%; padding: 10px; margin-bottom: 10px; background: #6644aa; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;';
  panelToggleBtn.addEventListener('click', () => {
    if (window.vcnPanel) {
      window.vcnPanel.toggle();
    } else {
      console.warn("🧭 VCN Panel not initialized");
    }
  });
  panelToggleBtn.addEventListener('mouseenter', () => {
    panelToggleBtn.style.background = '#8866cc';
  });
  panelToggleBtn.addEventListener('mouseleave', () => {
    panelToggleBtn.style.background = '#6644aa';
  });
  section.appendChild(panelToggleBtn);

  // First-Person Controls Toggle
  const fpToggleBtn = document.createElement('button');
  fpToggleBtn.textContent = 'Enable FPS Controls (Click Canvas)';
  fpToggleBtn.style.cssText = 'width: 100%; padding: 10px; margin-bottom: 10px; background: #444466; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;';
  fpToggleBtn.addEventListener('click', () => {
    if (window.fpControls && !window.fpControls.enabled) {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.requestPointerLock();
      }
    }
  });
  fpToggleBtn.addEventListener('mouseenter', () => {
    fpToggleBtn.style.background = '#666688';
  });
  fpToggleBtn.addEventListener('mouseleave', () => {
    fpToggleBtn.style.background = '#444466';
  });
  section.appendChild(fpToggleBtn);

  // Movement Speed Control
  const speedLabel = document.createElement('label');
  speedLabel.textContent = 'Movement Speed';
  speedLabel.style.cssText = 'display: block; margin-bottom: 5px; color: #aaa; font-size: 12px;';
  section.appendChild(speedLabel);

  const speedSlider = document.createElement('input');
  speedSlider.type = 'range';
  speedSlider.min = '1';
  speedSlider.max = '50';
  speedSlider.step = '1';
  speedSlider.value = '10';
  speedSlider.style.cssText = 'width: 100%; margin-bottom: 5px;';
  speedSlider.addEventListener('input', (e) => {
    const speed = parseFloat(e.target.value);
    if (window.fpControls) {
      window.fpControls.setMovementSpeed(speed);
    }
    speedValue.textContent = speed.toFixed(0);
  });
  section.appendChild(speedSlider);

  const speedValue = document.createElement('span');
  speedValue.textContent = '10';
  speedValue.style.cssText = 'display: block; margin-bottom: 15px; color: #6644aa; font-size: 12px; text-align: right;';
  section.appendChild(speedValue);

  // Look Sensitivity Control
  const lookLabel = document.createElement('label');
  lookLabel.textContent = 'Look Sensitivity';
  lookLabel.style.cssText = 'display: block; margin-bottom: 5px; color: #aaa; font-size: 12px;';
  section.appendChild(lookLabel);

  const lookSlider = document.createElement('input');
  lookSlider.type = 'range';
  lookSlider.min = '0.0001';
  lookSlider.max = '0.01';
  lookSlider.step = '0.0001';
  lookSlider.value = '0.002';
  lookSlider.style.cssText = 'width: 100%; margin-bottom: 5px;';
  lookSlider.addEventListener('input', (e) => {
    const sensitivity = parseFloat(e.target.value);
    if (window.fpControls) {
      window.fpControls.setLookSpeed(sensitivity);
    }
    lookValue.textContent = (sensitivity * 1000).toFixed(1);
  });
  section.appendChild(lookSlider);

  const lookValue = document.createElement('span');
  lookValue.textContent = '2.0';
  lookValue.style.cssText = 'display: block; margin-bottom: 15px; color: #6644aa; font-size: 12px; text-align: right;';
  section.appendChild(lookValue);

  // Reset Camera Button
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset Camera [R]';
  resetBtn.style.cssText = 'width: 100%; padding: 8px; margin-bottom: 10px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;';
  resetBtn.addEventListener('click', () => {
    if (window.fpControls) {
      window.fpControls.resetPosition();
    }
  });
  section.appendChild(resetBtn);

  // Phase 1.5: Perception State Indicator
  const perceptionIndicator = document.createElement('div');
  perceptionIndicator.id = 'vcnPerceptionIndicator';
  perceptionIndicator.style.cssText = 'margin-bottom: 15px; padding: 15px; background: rgba(0, 255, 255, 0.1); border: 2px solid #00ffff; border-radius: 6px; text-align: center; font-size: 18px; font-weight: bold; transition: all 0.3s ease;';
  perceptionIndicator.innerHTML = '🌊 WAVE MODE';
  section.appendChild(perceptionIndicator);

  // Update perception indicator in real-time
  setInterval(() => {
    if (window.perceptionState) {
      const mode = window.perceptionState.mode;
      const progress = window.perceptionState.transitionProgress;

      if (mode === 'wave') {
        perceptionIndicator.innerHTML = '🌊 WAVE MODE';
        perceptionIndicator.style.background = `rgba(0, 255, 255, ${0.1 + (1 - progress) * 0.2})`;
        perceptionIndicator.style.borderColor = '#00ffff';
        perceptionIndicator.style.color = '#00ffff';
      } else {
        perceptionIndicator.innerHTML = '⚛️ PARTICLE MODE';
        perceptionIndicator.style.background = `rgba(255, 0, 255, ${0.1 + progress * 0.2})`;
        perceptionIndicator.style.borderColor = '#ff00ff';
        perceptionIndicator.style.color = '#ff00ff';
      }
    }
  }, 100);

  // Instructions
  const instructions = document.createElement('div');
  instructions.style.cssText = 'padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px; font-size: 11px; line-height: 1.6; color: #888;';
  instructions.innerHTML = `
    <strong style="color: #aaa;">Navigation Controls:</strong><br>
    <code style="color: #6644aa;">WASD</code> - Move (Forward/Back/Left/Right)<br>
    <code style="color: #6644aa;">Mouse</code> - Look around<br>
    <code style="color: #6644aa;">Space</code> - Move up<br>
    <code style="color: #6644aa;">Shift</code> - Move down<br>
    <code style="color: #6644aa;">ESC</code> - Exit pointer lock<br>
    <code style="color: #6644aa;">R</code> - Reset camera position<br>
    <code style="color: #6644aa;">E</code> - Toggle VCN compass panel<br>
    <br>
    <strong style="color: #aaa;">Phase 1.5 - Gamepad:</strong><br>
    <code style="color: #ff00ff;">B Button</code> - Toggle Wave ↔ Particle<br>
    <code style="color: #6644aa;">Left Stick</code> - Move<br>
    <code style="color: #6644aa;">Right Stick</code> - Look<br>
    <code style="color: #6644aa;">LT</code> - Thrust Boost (2.5x)
  `;
  section.appendChild(instructions);

  // Destination Stats (live updating)
  const stats = document.createElement('div');
  stats.id = 'vcnHudStats';
  stats.style.cssText = 'margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px; font-size: 11px; line-height: 1.6; color: #aaa;';
  stats.innerHTML = '<strong style="color: #aaa;">Destination Stats:</strong><br>Loading...';
  section.appendChild(stats);

  // Update stats every second
  setInterval(() => {
    if (window.destinationManager) {
      const destStats = window.destinationManager.getStats();
      const statsHTML = `
        <strong style="color: #aaa;">Destination Stats:</strong><br>
        Total: <span style="color: #6644aa;">${destStats.total}</span> |
        Active: <span style="color: #6644aa;">${destStats.active}</span> |
        Auto: <span style="color: #888;">${destStats.autoGenerated}</span><br>
        <div style="margin-top: 5px; font-size: 10px;">
          ${Object.entries(destStats.byCategory || {})
            .filter(([cat, count]) => count > 0)
            .map(([cat, count]) => `<span style="color: #666;">${cat}: ${count}</span>`)
            .join(' | ')}
        </div>
      `;
      stats.innerHTML = statsHTML;
    }
  }, 1000);

  container.appendChild(section);
  console.log("✅ VCN HUD section created");

  return section;
}

// Keyboard shortcut for VCN panel toggle (E key)
document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyE' && !e.ctrlKey && !e.metaKey && !e.altKey) {
    // Don't trigger if typing in input
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      return;
    }

    if (window.vcnPanel) {
      window.vcnPanel.toggle();
      e.preventDefault();
    }
  }
});

console.log("🧭 VCN HUD module ready");
