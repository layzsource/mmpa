// src/hudMaterialPhysics.js
// HUD interface for Material Physics Engine
// Real-time display of ARPT scores and material states

console.log("🔬 hudMaterialPhysics.js loaded");

import { state } from './state.js';

/**
 * Create Material Physics HUD section
 */
export function createMaterialPhysicsHUD(container) {
  const section = document.createElement('div');
  section.className = 'hud-section material-physics';
  section.style.maxWidth = '400px';

  const title = document.createElement('h3');
  title.textContent = '🔬 Material Physics';
  section.appendChild(title);

  const intro = document.createElement('p');
  intro.textContent = 'Real-world material properties → ARPT scores';
  intro.style.cssText = `
    font-size: 11px;
    margin-bottom: 12px;
    opacity: 0.8;
  `;
  section.appendChild(intro);

  // === ARPT SCORES ===
  const arptSection = document.createElement('div');
  arptSection.style.marginBottom = '16px';

  const arptTitle = document.createElement('h4');
  arptTitle.textContent = 'ARPT Scores (0-255)';
  arptTitle.style.fontSize = '13px';
  arptTitle.style.marginBottom = '8px';
  arptSection.appendChild(arptTitle);

  // Create score meters
  const scores = [
    { key: 'A', label: 'Alignment', color: '#14b8a6', desc: 'Piezo quartz balance' },
    { key: 'R', label: 'Relationship', color: '#a855f7', desc: 'Calcite separation' },
    { key: 'P', label: 'Potential', color: '#eab308', desc: 'Silica charge' },
    { key: 'T', label: 'Transformation', color: '#f59e0b', desc: 'Polymer flow rate' }
  ];

  const scoreMeterElements = {};
  scores.forEach(({ key, label, color, desc }) => {
    const meterWrapper = document.createElement('div');
    meterWrapper.style.marginBottom = '10px';

    const meterHeader = document.createElement('div');
    meterHeader.style.display = 'flex';
    meterHeader.style.justifyContent = 'space-between';
    meterHeader.style.alignItems = 'center';
    meterHeader.style.marginBottom = '4px';

    const meterLabel = document.createElement('span');
    meterLabel.textContent = `${label} (${key})`;
    meterLabel.style.fontSize = '11px';
    meterLabel.style.fontWeight = '500';
    meterLabel.style.color = color;

    const meterValue = document.createElement('span');
    meterValue.id = `arpt-score-${key}`;
    meterValue.textContent = '0';
    meterValue.style.fontSize = '11px';
    meterValue.style.fontWeight = '600';
    meterValue.style.fontVariantNumeric = 'tabular-nums';

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
    `;

    meterWrapper.appendChild(meterHeader);
    meterWrapper.appendChild(progressBg);
    meterWrapper.appendChild(descText);
    arptSection.appendChild(meterWrapper);

    scoreMeterElements[key] = { value: meterValue, bar: progressFill };
  });

  section.appendChild(arptSection);

  // === MATERIAL STATES ===
  const materialsSection = document.createElement('div');
  materialsSection.style.marginBottom = '16px';

  const materialsTitle = document.createElement('h4');
  materialsTitle.textContent = 'Material States';
  materialsTitle.style.fontSize = '13px';
  materialsTitle.style.marginBottom = '8px';
  materialsSection.appendChild(materialsTitle);

  // Piezo Quartz Voltage
  const piezoDisplay = createMaterialDisplay(
    '⚡ Piezo Voltage',
    'piezo-voltage',
    'V',
    'Net stress across faces'
  );
  materialsSection.appendChild(piezoDisplay.element);

  // Calcite Orthogonality
  const calciteDisplay = createMaterialDisplay(
    '🔮 Channel Separation',
    'calcite-ortho',
    '%',
    'RCP/LCP isolation'
  );
  materialsSection.appendChild(calciteDisplay.element);

  // Silica Charge
  const silicaDisplay = createMaterialDisplay(
    '🔋 Lattice Charge',
    'silica-charge',
    '',
    'Stored energy (0-1)'
  );
  materialsSection.appendChild(silicaDisplay.element);

  // Polymer Viscosity
  const polymerDisplay = createMaterialDisplay(
    '🌊 Viscosity',
    'polymer-visc',
    'Pa·s',
    'Flow resistance'
  );
  materialsSection.appendChild(polymerDisplay.element);

  section.appendChild(materialsSection);

  // === PEMF STATE ===
  const pemfSection = document.createElement('div');
  pemfSection.style.marginBottom = '16px';

  const pemfTitle = document.createElement('h4');
  pemfTitle.textContent = 'PEMF Control';
  pemfTitle.style.fontSize = '13px';
  pemfTitle.style.marginBottom = '8px';
  pemfSection.appendChild(pemfTitle);

  // PEMF Frequency
  const freqDisplay = createMaterialDisplay(
    '📡 Frequency',
    'pemf-freq',
    'Hz',
    'Driving oscillation'
  );
  pemfSection.appendChild(freqDisplay.element);

  // PEMF Amplitude
  const ampDisplay = createMaterialDisplay(
    '📊 Amplitude',
    'pemf-amp',
    '',
    'Force magnitude (0-1)'
  );
  pemfSection.appendChild(ampDisplay.element);

  // PEMF Current Force
  const forceDisplay = createMaterialDisplay(
    '⚙️ Current Force',
    'pemf-force',
    '',
    'Instantaneous value'
  );
  pemfSection.appendChild(forceDisplay.element);

  section.appendChild(pemfSection);

  // Store references for updates
  section._updateElements = {
    scores: scoreMeterElements,
    piezo: piezoDisplay.value,
    calcite: calciteDisplay.value,
    silica: silicaDisplay.value,
    polymer: polymerDisplay.value,
    pemfFreq: freqDisplay.value,
    pemfAmp: ampDisplay.value,
    pemfForce: forceDisplay.value
  };

  // Start update loop
  startUpdateLoop(section);

  container.appendChild(section);
  return section;
}

/**
 * Create a material state display element
 */
function createMaterialDisplay(label, id, unit, description) {
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
    font-weight: '500';
    margin-bottom: 2px;
  `;

  const descText = document.createElement('div');
  descText.textContent = description;
  descText.style.cssText = `
    font-size: 9px;
    opacity: 0.6;
  `;

  labelWrapper.appendChild(labelText);
  labelWrapper.appendChild(descText);

  const valueText = document.createElement('span');
  valueText.id = id;
  valueText.textContent = `0 ${unit}`;
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
 * Update loop for real-time display
 */
function startUpdateLoop(section) {
  const update = () => {
    const arptData = state.materialPhysicsARPT;

    if (!arptData || !section._updateElements) {
      requestAnimationFrame(update);
      return;
    }

    const { scores, details, pemf } = arptData;
    const elements = section._updateElements;

    // Update ARPT scores
    if (scores) {
      ['A', 'R', 'P', 'T'].forEach(key => {
        const score = Math.round(scores[key] || 0);
        const percentage = (score / 255 * 100).toFixed(1);

        elements.scores[key].value.textContent = score;
        elements.scores[key].bar.style.width = `${percentage}%`;
      });
    }

    // Update material states
    if (details) {
      // Piezo quartz voltage
      if (details.alignment) {
        const voltage = (details.alignment.piezoVoltage || 0).toFixed(4);
        elements.piezo.textContent = `${voltage} V`;
      }

      // Calcite orthogonality
      if (details.relationship) {
        const ortho = ((details.relationship.orthogonality || 0) * 100).toFixed(1);
        elements.calcite.textContent = `${ortho} %`;
      }

      // Silica charge
      if (details.potential) {
        const charge = (details.potential.latticeCharge || 0).toFixed(3);
        elements.silica.textContent = charge;
      }

      // Polymer viscosity
      if (details.transformation) {
        const visc = (details.transformation.viscosity || 0).toFixed(0);
        elements.polymer.textContent = `${visc} Pa·s`;
      }
    }

    // Update PEMF state
    if (pemf) {
      const freq = (pemf.frequency || 0).toFixed(2);
      elements.pemfFreq.textContent = `${freq} Hz`;

      const amp = (pemf.amplitude || 0).toFixed(3);
      elements.pemfAmp.textContent = amp;

      const force = (pemf.currentForce || 0).toFixed(4);
      elements.pemfForce.textContent = force;
    }

    requestAnimationFrame(update);
  };

  update();
}

console.log("🔬 Material Physics HUD ready");
