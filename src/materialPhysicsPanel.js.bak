// src/materialPhysicsPanel.js
// Dedicated HUD panel for Material Physics ARPT Scores
// Real-time display of material states and physics calculations

console.log("🔬 materialPhysicsPanel.js loaded");

import { state } from './state.js';

/**
 * MaterialPhysicsPanel — Dedicated HUD for ARPT Material Physics
 *
 * Displays real-time ARPT scores derived from actual material physics:
 * - Piezoelectric quartz stress (Alignment)
 * - Calcite birefringence (Relationship)
 * - Silica lattice charge storage (Potential)
 * - Polymer matrix viscosity (Transformation)
 */
export class MaterialPhysicsPanel {
  constructor() {
    this.isOpen = false;
    this.panel = null;

    // Panel state
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.panelPosition = { x: null, y: null }; // null = use CSS default

    // Panel dimensions
    this.panelWidth = 400;

    // Animation
    this.animationFrameId = null;

    // UI element references
    this.scoreMeterElements = {};
    this.materialStateElements = {};
    this.pemfStateElements = {};

    console.log("🔬 MaterialPhysicsPanel initialized");
  }

  /**
   * Open the panel
   */
  open() {
    if (this.isOpen) return;

    // Create panel container
    this.panel = document.createElement('div');
    this.panel.id = 'material-physics-panel';

    // Position panel
    if (this.panelPosition.x !== null && this.panelPosition.y !== null) {
      this.panel.style.cssText = `
        position: absolute;
        left: ${this.panelPosition.x}px;
        top: ${this.panelPosition.y}px;
        width: ${this.panelWidth}px;
        background: rgba(10, 10, 15, 0.95);
        border: 2px solid #eab308;
        border-radius: 12px;
        padding: 15px;
        z-index: 1000;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, monospace;
        color: #f0f0f0;
        box-shadow: 0 0 30px rgba(234, 179, 8, 0.4);
        overflow: hidden;
        box-sizing: border-box;
        max-height: 90vh;
        overflow-y: auto;
      `;
    } else {
      // Default position: top-left
      this.panel.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        width: ${this.panelWidth}px;
        background: rgba(10, 10, 15, 0.95);
        border: 2px solid #eab308;
        border-radius: 12px;
        padding: 15px;
        z-index: 1000;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, monospace;
        color: #f0f0f0;
        box-shadow: 0 0 30px rgba(234, 179, 8, 0.4);
        overflow: hidden;
        box-sizing: border-box;
        max-height: 90vh;
        overflow-y: auto;
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
      border-bottom: 1px solid rgba(234, 179, 8, 0.3);
      cursor: move;
      user-select: none;
    `;

    const title = document.createElement('div');
    title.textContent = '🔬 Material Physics';
    title.style.cssText = `
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: #eab308;
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
    closeBtn.onmouseenter = () => { closeBtn.style.color = '#eab308'; };
    closeBtn.onmouseleave = () => { closeBtn.style.color = '#f0f0f0'; };
    closeBtn.onclick = () => this.close();

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Make header draggable
    header.onmousedown = (e) => this.startDrag(e);

    // Description
    const intro = document.createElement('p');
    intro.textContent = 'Real-world material properties → ARPT scores';
    intro.style.cssText = `
      font-size: 11px;
      margin: 0 0 16px 0;
      opacity: 0.8;
      color: #8a8d93;
    `;

    // ARPT Scores Section
    const arptSection = this.createARPTSection();

    // Material States Section
    const materialsSection = this.createMaterialStatesSection();

    // PEMF State Section
    const pemfSection = this.createPEMFSection();

    // Assemble panel
    this.panel.appendChild(header);
    this.panel.appendChild(intro);
    this.panel.appendChild(arptSection);
    this.panel.appendChild(materialsSection);
    this.panel.appendChild(pemfSection);

    document.body.appendChild(this.panel);

    this.isOpen = true;

    // Start animation loop
    this.startAnimation();

    console.log("🔬 Material Physics panel opened");
  }

  /**
   * Create ARPT Scores Section
   */
  createARPTSection() {
    const section = document.createElement('div');
    section.style.marginBottom = '16px';

    const title = document.createElement('h4');
    title.textContent = 'ARPT Scores (0-255)';
    title.style.cssText = `
      font-size: 13px;
      margin: 0 0 8px 0;
      color: #f0f0f0;
    `;

    section.appendChild(title);

    const scores = [
      { key: 'A', label: 'Alignment', color: '#14b8a6', desc: 'Piezo quartz balance' },
      { key: 'R', label: 'Relationship', color: '#a855f7', desc: 'Calcite separation' },
      { key: 'P', label: 'Potential', color: '#eab308', desc: 'Silica charge' },
      { key: 'T', label: 'Transformation', color: '#f59e0b', desc: 'Polymer flow rate' }
    ];

    scores.forEach(({ key, label, color, desc }) => {
      const meterWrapper = document.createElement('div');
      meterWrapper.style.marginBottom = '10px';

      const meterHeader = document.createElement('div');
      meterHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      `;

      const meterLabel = document.createElement('span');
      meterLabel.textContent = `${label} (${key})`;
      meterLabel.style.cssText = `
        font-size: 11px;
        font-weight: 500;
        color: ${color};
      `;

      const meterValue = document.createElement('span');
      meterValue.id = `arpt-score-${key}`;
      meterValue.textContent = '0';
      meterValue.style.cssText = `
        font-size: 11px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: #f0f0f0;
      `;

      meterHeader.appendChild(meterLabel);
      meterHeader.appendChild(meterValue);

      // Progress bar
      const progressBg = document.createElement('div');
      progressBg.style.cssText = `
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
      `;

      const progressFill = document.createElement('div');
      progressFill.id = `arpt-bar-${key}`;
      progressFill.style.cssText = `
        width: 0%;
        height: 100%;
        background: ${color};
        transition: width 0.15s ease;
      `;
      progressBg.appendChild(progressFill);

      // Description
      const descText = document.createElement('div');
      descText.textContent = desc;
      descText.style.cssText = `
        font-size: 10px;
        opacity: 0.6;
        margin-top: 2px;
        color: #8a8d93;
      `;

      meterWrapper.appendChild(meterHeader);
      meterWrapper.appendChild(progressBg);
      meterWrapper.appendChild(descText);
      section.appendChild(meterWrapper);

      this.scoreMeterElements[key] = { value: meterValue, bar: progressFill };
    });

    return section;
  }

  /**
   * Create Material States Section
   */
  createMaterialStatesSection() {
    const section = document.createElement('div');
    section.style.marginBottom = '16px';

    const title = document.createElement('h4');
    title.textContent = 'Material States';
    title.style.cssText = `
      font-size: 13px;
      margin: 0 0 8px 0;
      color: #f0f0f0;
    `;

    section.appendChild(title);

    const materials = [
      { key: 'piezo', label: '⚡ Piezo Voltage', unit: 'V', desc: 'Net stress across faces' },
      { key: 'calcite', label: '🔮 Channel Separation', unit: '%', desc: 'RCP/LCP isolation' },
      { key: 'silica', label: '🔋 Lattice Charge', unit: '', desc: 'Stored energy (0-1)' },
      { key: 'polymer', label: '🌊 Viscosity', unit: 'Pa·s', desc: 'Flow resistance' }
    ];

    materials.forEach(({ key, label, unit, desc }) => {
      const display = this.createMaterialDisplay(label, `${key}-value`, unit, desc);
      section.appendChild(display.element);
      this.materialStateElements[key] = display.value;
    });

    return section;
  }

  /**
   * Create PEMF Section
   */
  createPEMFSection() {
    const section = document.createElement('div');

    const title = document.createElement('h4');
    title.textContent = 'PEMF Control';
    title.style.cssText = `
      font-size: 13px;
      margin: 0 0 8px 0;
      color: #f0f0f0;
    `;

    section.appendChild(title);

    const pemfItems = [
      { key: 'freq', label: '📡 Frequency', unit: 'Hz', desc: 'Driving oscillation' },
      { key: 'amp', label: '📊 Amplitude', unit: '', desc: 'Force magnitude (0-1)' },
      { key: 'force', label: '⚙️ Current Force', unit: '', desc: 'Instantaneous value' }
    ];

    pemfItems.forEach(({ key, label, unit, desc }) => {
      const display = this.createMaterialDisplay(label, `pemf-${key}-value`, unit, desc);
      section.appendChild(display.element);
      this.pemfStateElements[key] = display.value;
    });

    return section;
  }

  /**
   * Create a material state display element
   */
  createMaterialDisplay(label, id, unit, description) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 6px;
      margin-bottom: 6px;
    `;

    const labelWrapper = document.createElement('div');
    labelWrapper.style.flex = '1';

    const labelText = document.createElement('div');
    labelText.textContent = label;
    labelText.style.cssText = `
      font-size: 11px;
      font-weight: 500;
      margin-bottom: 2px;
      color: #f0f0f0;
    `;

    const descText = document.createElement('div');
    descText.textContent = description;
    descText.style.cssText = `
      font-size: 9px;
      opacity: 0.6;
      color: #8a8d93;
    `;

    labelWrapper.appendChild(labelText);
    labelWrapper.appendChild(descText);

    const valueText = document.createElement('span');
    valueText.id = id;
    valueText.textContent = unit ? `0 ${unit}` : '0';
    valueText.style.cssText = `
      font-size: 12px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      color: rgba(255, 255, 255, 0.9);
    `;

    wrapper.appendChild(labelWrapper);
    wrapper.appendChild(valueText);

    return { element: wrapper, value: valueText };
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
    this.scoreMeterElements = {};
    this.materialStateElements = {};
    this.pemfStateElements = {};
    this.isOpen = false;

    console.log("🔬 Material Physics panel closed");
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

      this.update();
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
   * Update display with current ARPT data
   */
  update() {
    const arptData = state.materialPhysicsARPT;

    if (!arptData) return;

    const { scores, details, pemf } = arptData;

    // Update ARPT scores
    if (scores) {
      ['A', 'R', 'P', 'T'].forEach(key => {
        const score = Math.round(scores[key] || 0);
        const percentage = (score / 255 * 100).toFixed(1);

        if (this.scoreMeterElements[key]) {
          this.scoreMeterElements[key].value.textContent = score;
          this.scoreMeterElements[key].bar.style.width = `${percentage}%`;
        }
      });
    }

    // Update material states
    if (details) {
      // Piezo quartz voltage
      if (details.alignment && this.materialStateElements.piezo) {
        const voltage = (details.alignment.piezoVoltage || 0).toFixed(4);
        this.materialStateElements.piezo.textContent = `${voltage} V`;
      }

      // Calcite orthogonality
      if (details.relationship && this.materialStateElements.calcite) {
        const ortho = ((details.relationship.orthogonality || 0) * 100).toFixed(1);
        this.materialStateElements.calcite.textContent = `${ortho} %`;
      }

      // Silica charge
      if (details.potential && this.materialStateElements.silica) {
        const charge = (details.potential.latticeCharge || 0).toFixed(3);
        this.materialStateElements.silica.textContent = charge;
      }

      // Polymer viscosity
      if (details.transformation && this.materialStateElements.polymer) {
        const visc = (details.transformation.viscosity || 0).toFixed(0);
        this.materialStateElements.polymer.textContent = `${visc} Pa·s`;
      }
    }

    // Update PEMF state
    if (pemf) {
      if (this.pemfStateElements.freq) {
        const freq = (pemf.frequency || 0).toFixed(2);
        this.pemfStateElements.freq.textContent = `${freq} Hz`;
      }

      if (this.pemfStateElements.amp) {
        const amp = (pemf.amplitude || 0).toFixed(3);
        this.pemfStateElements.amp.textContent = amp;
      }

      if (this.pemfStateElements.force) {
        const force = (pemf.currentForce || 0).toFixed(4);
        this.pemfStateElements.force.textContent = force;
      }
    }
  }
}

console.log("🔬 MaterialPhysicsPanel ready");
