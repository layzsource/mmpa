// HUD Panel: Bioacoustic Analysis Mode
// Phase 1: Basic toggle and controls for Sp(2,ℝ)/Z₂ manifold visualization

console.log('🔬 hudBioacoustics.js loaded');

/**
 * Create the Bioacoustic Analysis HUD panel
 * This is a separate visualization mode for cross-species audio comparison
 * and differential geometric analysis
 *
 * @param {HTMLElement} container - Parent container element
 * @param {Function} notifyHUDUpdate - Callback for state updates
 */
export function createBioacousticPanel(container, notifyHUDUpdate) {
  console.log('🔬 Creating bioacoustic analysis panel...');

  // Main panel container
  const panel = document.createElement('div');
  panel.style.cssText = 'margin-bottom: 15px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px;';

  // ===== HEADER =====
  const header = document.createElement('h3');
  header.textContent = '🔬 Bioacoustic Analysis';
  header.style.cssText = 'margin: 0 0 10px 0; color: #00ffaa; font-size: 14px;';
  panel.appendChild(header);

  // Info text
  const info = document.createElement('div');
  info.textContent = 'Differential geometry mode for species comparison';
  info.style.cssText = 'font-size: 11px; color: #aaa; margin-bottom: 10px; font-style: italic;';
  panel.appendChild(info);

  // ===== MODE TOGGLE =====
  const modeSection = document.createElement('div');
  modeSection.style.cssText = 'margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 3px;';

  const modeLabel = document.createElement('div');
  modeLabel.textContent = '🎵 Visualization Mode';
  modeLabel.style.cssText = 'font-weight: bold; margin-bottom: 8px; color: #fff; font-size: 12px;';
  modeSection.appendChild(modeLabel);

  // Radio buttons for mode selection
  const performanceMode = createRadioOption('bioacoustic-mode', 'performance', 'Performance (Default)', true);
  const analysisMode = createRadioOption('bioacoustic-mode', 'analysis', 'Analysis (Sp(2,ℝ)/Z₂)', false);

  performanceMode.style.cssText = 'margin-bottom: 5px;';
  analysisMode.style.cssText = 'margin-bottom: 5px;';

  // Add descriptions
  const perfDesc = document.createElement('div');
  perfDesc.textContent = '  → Real-time audio reactive particles';
  perfDesc.style.cssText = 'font-size: 10px; color: #888; margin-left: 20px; margin-bottom: 8px;';

  const analysDesc = document.createElement('div');
  analysDesc.textContent = '  → Differential geometry & homological integration';
  analysDesc.style.cssText = 'font-size: 10px; color: #888; margin-left: 20px; margin-bottom: 8px;';

  modeSection.appendChild(performanceMode);
  modeSection.appendChild(perfDesc);
  modeSection.appendChild(analysisMode);
  modeSection.appendChild(analysDesc);

  // Event listeners for mode change
  performanceMode.querySelector('input').addEventListener('change', (e) => {
    if (e.target.checked) {
      console.log('🔬 Switching to Performance mode');
      notifyHUDUpdate({ bioacousticMode: 'performance' });
      controlsSection.style.display = 'none';
    }
  });

  analysisMode.querySelector('input').addEventListener('change', (e) => {
    if (e.target.checked) {
      console.log('🔬 Switching to Analysis mode (Sp(2,ℝ)/Z₂)');
      notifyHUDUpdate({ bioacousticMode: 'analysis' });
      controlsSection.style.display = 'block';
    }
  });

  panel.appendChild(modeSection);

  // ===== ANALYSIS MODE CONTROLS (initially hidden) =====
  const controlsSection = document.createElement('div');
  controlsSection.style.cssText = 'display: none; margin-top: 10px;';

  // Manifold scale control
  const scaleControl = createSliderControl(
    'Manifold Scale',
    'bioacoustic-scale',
    0.1,
    10.0,
    2.0,
    0.1,
    (value) => {
      notifyHUDUpdate({ bioacousticScale: parseFloat(value) });
    }
  );
  controlsSection.appendChild(scaleControl);

  // Particle count control
  const countControl = createSliderControl(
    'Particle Count',
    'bioacoustic-count',
    100,
    10000,
    1000,
    100,
    (value) => {
      notifyHUDUpdate({ bioacousticParticleCount: parseInt(value) });
    }
  );
  controlsSection.appendChild(countControl);

  // Audio reactivity toggle
  const audioReactiveDiv = document.createElement('div');
  audioReactiveDiv.style.cssText = 'margin: 10px 0;';

  const audioReactiveLabel = document.createElement('label');
  audioReactiveLabel.style.cssText = 'display: flex; align-items: center; cursor: pointer; color: #ccc; font-size: 12px;';

  const audioReactiveCheckbox = document.createElement('input');
  audioReactiveCheckbox.type = 'checkbox';
  audioReactiveCheckbox.checked = true;
  audioReactiveCheckbox.style.cssText = 'margin-right: 8px;';
  audioReactiveCheckbox.addEventListener('change', (e) => {
    notifyHUDUpdate({ bioacousticAudioReactive: e.target.checked });
  });

  audioReactiveLabel.appendChild(audioReactiveCheckbox);
  audioReactiveLabel.appendChild(document.createTextNode('Audio Reactive Evolution'));
  audioReactiveDiv.appendChild(audioReactiveLabel);
  controlsSection.appendChild(audioReactiveDiv);

  // ===== STATUS DISPLAY =====
  const statusDiv = document.createElement('div');
  statusDiv.id = 'bioacoustic-status';
  statusDiv.style.cssText = 'margin-top: 10px; padding: 8px; background: rgba(0,255,170,0.1); border-radius: 3px; font-size: 11px; color: #00ffaa;';
  statusDiv.textContent = '● Status: Performance Mode Active';
  controlsSection.appendChild(statusDiv);

  // ===== PHASE 2: ANALYSIS CONTROLS =====
  const phase2Section = document.createElement('div');
  phase2Section.style.cssText = 'margin-top: 15px; padding: 10px; background: rgba(0,255,170,0.05); border: 1px solid rgba(0,255,170,0.3); border-radius: 3px;';

  const phase2Header = document.createElement('div');
  phase2Header.textContent = '📐 Phase 2: Differential Forms & Homology';
  phase2Header.style.cssText = 'font-weight: bold; margin-bottom: 10px; color: #00ffaa; font-size: 11px;';
  phase2Section.appendChild(phase2Header);

  // Start/Stop Analysis button
  const analysisButton = document.createElement('button');
  analysisButton.textContent = '▶ Start Analysis';
  analysisButton.style.cssText = 'width: 100%; padding: 8px; margin-bottom: 10px; background: rgba(0,255,170,0.2); border: 1px solid #00ffaa; border-radius: 3px; color: #00ffaa; cursor: pointer; font-size: 12px;';
  analysisButton.addEventListener('click', () => {
    const isRunning = analysisButton.textContent.startsWith('■');
    notifyHUDUpdate({
      bioacousticAnalysisRunning: !isRunning
    });
    analysisButton.textContent = isRunning ? '▶ Start Analysis' : '■ Stop Analysis';
    analysisButton.style.background = isRunning ? 'rgba(0,255,170,0.2)' : 'rgba(255,50,50,0.2)';
  });
  phase2Section.appendChild(analysisButton);

  // Capture Signature button
  const captureButton = document.createElement('button');
  captureButton.textContent = '📸 Capture Signature';
  captureButton.style.cssText = 'width: 100%; padding: 8px; margin-bottom: 10px; background: rgba(100,150,255,0.2); border: 1px solid #6496ff; border-radius: 3px; color: #6496ff; cursor: pointer; font-size: 12px;';
  captureButton.addEventListener('click', () => {
    notifyHUDUpdate({ bioacousticCaptureSignature: true });
  });
  phase2Section.appendChild(captureButton);

  // Verify Stokes' Theorem button
  const stokesButton = document.createElement('button');
  stokesButton.textContent = '∫ Verify Stokes\' Theorem';
  stokesButton.style.cssText = 'width: 100%; padding: 8px; margin-bottom: 10px; background: rgba(255,200,0,0.2); border: 1px solid #ffc800; border-radius: 3px; color: #ffc800; cursor: pointer; font-size: 12px;';
  stokesButton.addEventListener('click', () => {
    notifyHUDUpdate({ bioacousticVerifyStokes: true });
  });
  phase2Section.appendChild(stokesButton);

  // Status display
  const analysisStatus = document.createElement('div');
  analysisStatus.id = 'bioacoustic-analysis-status';
  analysisStatus.style.cssText = 'margin-top: 10px; padding: 8px; background: rgba(0,0,0,0.3); border-radius: 3px; font-size: 10px; color: #ccc; font-family: monospace; max-height: 120px; overflow-y: auto;';
  analysisStatus.innerHTML = `
    <div style="color: #00ffaa;">● Ready for analysis</div>
    <div>Forms: 0 | Currents: 0 | Barcodes: 0</div>
  `;
  phase2Section.appendChild(analysisStatus);

  controlsSection.appendChild(phase2Section);

  // ===== PHASE 3: VISUALIZATION CONTROLS =====
  const phase3Section = document.createElement('div');
  phase3Section.style.cssText = 'margin-top: 15px; padding: 10px; background: rgba(100,150,255,0.05); border: 1px solid rgba(100,150,255,0.3); border-radius: 3px;';

  const phase3Header = document.createElement('div');
  phase3Header.textContent = '👁️ Phase 3: Visualization';
  phase3Header.style.cssText = 'font-weight: bold; margin-bottom: 10px; color: #6496ff; font-size: 11px;';
  phase3Section.appendChild(phase3Header);

  // Show Currents checkbox
  const currentsCheckbox = createCheckbox(
    'Show Currents (Trajectories)',
    'bioacoustic-show-currents',
    true,
    (checked) => notifyHUDUpdate({ bioacousticShowCurrents: checked })
  );
  phase3Section.appendChild(currentsCheckbox);

  // Show Forms checkbox
  const formsCheckbox = createCheckbox(
    'Show Forms (Color Field)',
    'bioacoustic-show-forms',
    true,
    (checked) => notifyHUDUpdate({ bioacousticShowForms: checked })
  );
  phase3Section.appendChild(formsCheckbox);

  // Show Homology checkbox
  const homologyCheckbox = createCheckbox(
    'Show Homology (Features)',
    'bioacoustic-show-homology',
    true,
    (checked) => notifyHUDUpdate({ bioacousticShowHomology: checked })
  );
  phase3Section.appendChild(homologyCheckbox);

  controlsSection.appendChild(phase3Section);

  panel.appendChild(controlsSection);

  container.appendChild(panel);

  console.log('🔬 Bioacoustic analysis panel created');
}

/**
 * Helper: Create a radio button option
 */
function createRadioOption(name, value, label, checked = false) {
  const container = document.createElement('label');
  container.style.cssText = 'display: flex; align-items: center; cursor: pointer; color: #ccc; font-size: 12px;';

  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.name = name;
  radio.value = value;
  radio.checked = checked;
  radio.style.cssText = 'margin-right: 8px;';

  const text = document.createTextNode(label);

  container.appendChild(radio);
  container.appendChild(text);

  return container;
}

/**
 * Helper: Create a checkbox control
 */
function createCheckbox(label, id, checked, onChange) {
  const container = document.createElement('div');
  container.style.cssText = 'margin: 8px 0;';

  const checkboxLabel = document.createElement('label');
  checkboxLabel.style.cssText = 'display: flex; align-items: center; cursor: pointer; color: #ccc; font-size: 12px;';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = id;
  checkbox.checked = checked;
  checkbox.style.cssText = 'margin-right: 8px;';
  checkbox.addEventListener('change', (e) => {
    onChange(e.target.checked);
  });

  checkboxLabel.appendChild(checkbox);
  checkboxLabel.appendChild(document.createTextNode(label));
  container.appendChild(checkboxLabel);

  return container;
}

/**
 * Helper: Create a slider control with label
 */
function createSliderControl(label, id, min, max, value, step, onChange) {
  const container = document.createElement('div');
  container.style.cssText = 'margin: 10px 0;';

  const labelDiv = document.createElement('div');
  labelDiv.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; color: #ccc;';

  const labelSpan = document.createElement('span');
  labelSpan.textContent = label;

  const valueSpan = document.createElement('span');
  valueSpan.id = `${id}-value`;
  valueSpan.textContent = value;
  valueSpan.style.cssText = 'color: #00ffaa;';

  labelDiv.appendChild(labelSpan);
  labelDiv.appendChild(valueSpan);

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = id;
  slider.min = min;
  slider.max = max;
  slider.value = value;
  slider.step = step;
  slider.style.cssText = 'width: 100%;';

  slider.addEventListener('input', (e) => {
    valueSpan.textContent = e.target.value;
    onChange(e.target.value);
  });

  container.appendChild(labelDiv);
  container.appendChild(slider);

  return container;
}

console.log('🔬 Bioacoustic HUD module ready');
