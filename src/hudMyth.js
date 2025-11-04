// src/hudMyth.js
// HUD interface for Myth Layer Compiler
// Control panel for myths, archetypes, and narrative journeys

console.log("🌟 hudMyth.js loaded");

/**
 * Create Myth HUD section
 */
export function createMythHUD(container) {
  const section = document.createElement('div');
  section.className = 'hud-section myth-layer';
  section.style.maxWidth = '420px';

  const title = document.createElement('h3');
  title.textContent = '🌟 Myth Layer Compiler';
  section.appendChild(title);

  const intro = document.createElement('p');
  intro.textContent = 'Map symbolic metadata (archetypes, myths, glyphs) onto geometry and states';
  intro.style.cssText = `
    font-size: 11px;
    margin-bottom: 12px;
    opacity: 0.8;
  `;
  section.appendChild(intro);

  // === MYTH LIBRARY ===
  const librarySection = document.createElement('div');
  librarySection.style.marginBottom = '16px';

  const libraryTitle = document.createElement('h4');
  libraryTitle.textContent = 'Myth Library';
  libraryTitle.style.fontSize = '13px';
  libraryTitle.style.marginBottom = '8px';
  librarySection.appendChild(libraryTitle);

  // Myth selector
  const mythSelect = document.createElement('select');
  mythSelect.size = 6;
  mythSelect.style.width = '100%';
  mythSelect.style.marginBottom = '8px';
  mythSelect.style.fontFamily = 'monospace';
  mythSelect.style.fontSize = '11px';
  librarySection.appendChild(mythSelect);

  function refreshMythLibrary() {
    if (!window.mythCompiler) return;

    const library = window.mythCompiler.getLibrary();
    const myths = library.getAllMyths();

    mythSelect.innerHTML = '';

    if (myths.length === 0) {
      const option = document.createElement('option');
      option.textContent = '(no myths loaded)';
      option.disabled = true;
      mythSelect.appendChild(option);
      return;
    }

    myths.forEach(myth => {
      const option = document.createElement('option');
      option.value = myth.id;
      option.textContent = `${myth.name} (${myth.nodes.size} nodes)`;
      mythSelect.appendChild(option);
    });
  }

  // Load library button grid
  const libraryButtons = document.createElement('div');
  libraryButtons.style.display = 'grid';
  libraryButtons.style.gridTemplateColumns = '1fr 1fr';
  libraryButtons.style.gap = '8px';
  libraryButtons.style.marginBottom = '12px';

  const loadExamplesButton = document.createElement('button');
  loadExamplesButton.textContent = '📚 Load Examples';
  loadExamplesButton.style.padding = '6px';
  loadExamplesButton.style.fontSize = '11px';
  loadExamplesButton.addEventListener('click', async () => {
    if (!window.mythCompiler) return;

    const { getAllExampleMyths } = await import('./mythExamples.js');
    const examples = getAllExampleMyths();

    examples.forEach(myth => {
      window.mythCompiler.library.addMyth(myth);
      window.mythCompiler.compileMythNodes(myth);
    });

    refreshMythLibrary();
    alert(`Loaded ${examples.length} example myths`);
  });
  libraryButtons.appendChild(loadExamplesButton);

  const importButton = document.createElement('button');
  importButton.textContent = '⬆ Import JSON';
  importButton.style.padding = '6px';
  importButton.style.fontSize = '11px';
  importButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      if (window.mythCompiler && e.target.files[0]) {
        try {
          await window.mythCompiler.loadMythFromFile(e.target.files[0]);
          refreshMythLibrary();
        } catch (err) {
          alert(`Error importing myth: ${err.message}`);
        }
      }
    };
    input.click();
  });
  libraryButtons.appendChild(importButton);

  librarySection.appendChild(libraryButtons);

  section.appendChild(librarySection);

  // === ACTIVE MYTH ===
  const activeMythSection = document.createElement('div');
  activeMythSection.style.marginBottom = '16px';

  const activeMythTitle = document.createElement('h4');
  activeMythTitle.textContent = 'Active Myth';
  activeMythTitle.style.fontSize = '13px';
  activeMythTitle.style.marginBottom = '8px';
  activeMythSection.appendChild(activeMythTitle);

  // Myth info display
  const mythInfoDisplay = document.createElement('div');
  mythInfoDisplay.id = 'myth-info-display';
  mythInfoDisplay.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 10px;
    margin-bottom: 8px;
    min-height: 60px;
  `;
  mythInfoDisplay.textContent = 'No myth active';
  activeMythSection.appendChild(mythInfoDisplay);

  // Activate myth button
  const activateButton = document.createElement('button');
  activateButton.textContent = '⚡ Activate Selected Myth';
  activateButton.style.cssText = `
    width: 100%;
    padding: 8px;
    background: #9370DB;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 8px;
  `;
  activateButton.addEventListener('click', () => {
    const selectedId = mythSelect.value;
    if (!selectedId || !window.mythCompiler) return;

    window.mythCompiler.activateMyth(selectedId);
    updateMythInfo();
  });
  activeMythSection.appendChild(activateButton);

  section.appendChild(activeMythSection);

  // === JOURNEY NAVIGATION ===
  const journeySection = document.createElement('div');
  journeySection.style.marginBottom = '16px';

  const journeyTitle = document.createElement('h4');
  journeyTitle.textContent = 'Mythic Journey';
  journeyTitle.style.fontSize = '13px';
  journeyTitle.style.marginBottom = '8px';
  journeySection.appendChild(journeyTitle);

  // Current node display
  const currentNodeDisplay = document.createElement('div');
  currentNodeDisplay.id = 'current-node-display';
  currentNodeDisplay.style.cssText = `
    background: rgba(255, 255, 255, 0.1);
    padding: 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 11px;
    margin-bottom: 8px;
    min-height: 50px;
  `;
  currentNodeDisplay.innerHTML = '<div style="opacity: 0.6;">Not in journey</div>';
  journeySection.appendChild(currentNodeDisplay);

  // Progress bar
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
  `;
  const progressFill = document.createElement('div');
  progressFill.id = 'journey-progress';
  progressFill.style.cssText = `
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #9370DB, #FFD700);
    transition: width 0.3s ease;
  `;
  progressBar.appendChild(progressFill);
  journeySection.appendChild(progressBar);

  // Journey controls
  const journeyControls = document.createElement('div');
  journeyControls.style.display = 'grid';
  journeyControls.style.gridTemplateColumns = '1fr 2fr 1fr';
  journeyControls.style.gap = '8px';
  journeyControls.style.marginBottom = '12px';

  const previousButton = document.createElement('button');
  previousButton.textContent = '← Back';
  previousButton.style.padding = '8px';
  previousButton.style.fontSize = '11px';
  previousButton.addEventListener('click', () => {
    if (window.mythCompiler) {
      window.mythCompiler.retreatJourney();
      updateNodeInfo();
    }
  });
  journeyControls.appendChild(previousButton);

  const startButton = document.createElement('button');
  startButton.textContent = '🚀 Start Journey';
  startButton.style.cssText = `
    padding: 8px;
    font-size: 11px;
    background: #FFD700;
    color: #000;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  `;
  startButton.addEventListener('click', () => {
    const selectedId = mythSelect.value;
    if (!selectedId || !window.mythCompiler) return;

    window.mythCompiler.startJourney(selectedId);
    updateNodeInfo();
  });
  journeyControls.appendChild(startButton);

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next →';
  nextButton.style.padding = '8px';
  nextButton.style.fontSize = '11px';
  nextButton.addEventListener('click', () => {
    if (window.mythCompiler) {
      window.mythCompiler.advanceJourney();
      updateNodeInfo();
    }
  });
  journeyControls.appendChild(nextButton);

  journeySection.appendChild(journeyControls);

  section.appendChild(journeySection);

  // === GLYPH CONTROLS ===
  const glyphSection = document.createElement('div');
  glyphSection.style.marginBottom = '16px';

  const glyphTitle = document.createElement('h4');
  glyphTitle.textContent = 'Glyph Overlay';
  glyphTitle.style.fontSize = '13px';
  glyphTitle.style.marginBottom = '8px';
  glyphSection.appendChild(glyphTitle);

  const glyphVisibilityLabel = document.createElement('label');
  glyphVisibilityLabel.style.display = 'block';
  glyphVisibilityLabel.style.marginBottom = '8px';
  glyphVisibilityLabel.style.fontSize = '12px';

  const glyphVisibilityCheckbox = document.createElement('input');
  glyphVisibilityCheckbox.type = 'checkbox';
  glyphVisibilityCheckbox.checked = true;
  glyphVisibilityCheckbox.addEventListener('change', (e) => {
    if (window.glyphRenderer) {
      window.glyphRenderer.setVisible(e.target.checked);
    }
  });

  glyphVisibilityLabel.appendChild(glyphVisibilityCheckbox);
  glyphVisibilityLabel.appendChild(document.createTextNode(' Show Glyphs'));
  glyphSection.appendChild(glyphVisibilityLabel);

  section.appendChild(glyphSection);

  // === EXPORT/SAVE ===
  const exportSection = document.createElement('div');
  exportSection.style.marginBottom = '16px';

  const exportButtons = document.createElement('div');
  exportButtons.style.display = 'grid';
  exportButtons.style.gridTemplateColumns = '1fr 1fr';
  exportButtons.style.gap = '8px';

  const exportMythButton = document.createElement('button');
  exportMythButton.textContent = '⬇ Export Myth';
  exportMythButton.style.padding = '6px';
  exportMythButton.style.fontSize = '11px';
  exportMythButton.addEventListener('click', () => {
    const myth = window.mythCompiler?.getActiveMyth();
    if (myth) {
      myth.export();
    } else {
      alert('No active myth to export');
    }
  });
  exportButtons.appendChild(exportMythButton);

  const saveLibraryButton = document.createElement('button');
  saveLibraryButton.textContent = '💾 Save Library';
  saveLibraryButton.style.padding = '6px';
  saveLibraryButton.style.fontSize = '11px';
  saveLibraryButton.addEventListener('click', () => {
    if (window.mythCompiler) {
      window.mythCompiler.saveLibrary();
      alert('Myth library saved to localStorage');
    }
  });
  exportButtons.appendChild(saveLibraryButton);

  exportSection.appendChild(exportButtons);
  section.appendChild(exportSection);

  // === UPDATE FUNCTIONS ===
  function updateMythInfo() {
    if (!window.mythCompiler) return;

    const myth = window.mythCompiler.getActiveMyth();
    if (!myth) {
      mythInfoDisplay.innerHTML = '<div style="opacity: 0.6;">No myth active</div>';
      return;
    }

    mythInfoDisplay.innerHTML = `
      <div><strong>${myth.name}</strong></div>
      <div style="opacity: 0.8; margin-top: 4px;">${myth.description}</div>
      <div style="margin-top: 4px; opacity: 0.7;">
        ${myth.nodes.size} nodes • ${myth.archetypes.size} archetypes
      </div>
      <div style="margin-top: 4px; opacity: 0.7;">
        Category: ${myth.category} • Culture: ${myth.culture}
      </div>
    `;

    updateNodeInfo();
  }

  function updateNodeInfo() {
    if (!window.mythCompiler) return;

    const node = window.mythCompiler.getCurrentNode();
    const progress = window.mythCompiler.getProgress();

    // Update progress bar
    progressFill.style.width = (progress * 100).toFixed(1) + '%';

    if (!node) {
      currentNodeDisplay.innerHTML = '<div style="opacity: 0.6;">Not in journey</div>';
      return;
    }

    const glyph = node.glyph || node.archetype?.glyph || '○';

    currentNodeDisplay.innerHTML = `
      <div style="font-size: 24px; text-align: center; margin-bottom: 4px;">${glyph}</div>
      <div><strong>${node.name}</strong></div>
      <div style="opacity: 0.8; margin-top: 4px; font-size: 10px;">${node.description}</div>
      <div style="margin-top: 4px; opacity: 0.7; font-size: 9px;">
        Stage: ${node.narrativeStage} • Mytheme: ${node.mytheme || 'n/a'}
      </div>
    `;

    // Update glyph overlay if renderer exists
    if (window.glyphRenderer && node.glyph) {
      window.glyphRenderer.clearGlyphs();
      window.glyphRenderer.createGlyph({
        character: glyph,
        position: new THREE.Vector3(0, 2, 0),
        scale: node.glyphScale || 2.0,
        color: node.archetype?.color || '#ffffff'
      });
    }
  }

  // Listen for myth compiler events
  if (window.mythCompiler) {
    window.mythCompiler.onNodeChange(() => {
      updateNodeInfo();
    });

    window.mythCompiler.onMythChange(() => {
      updateMythInfo();
    });
  }

  // Auto-refresh library on load
  refreshMythLibrary();

  // Periodic refresh
  setInterval(() => {
    updateNodeInfo();
  }, 1000);

  container.appendChild(section);
  console.log("🌟 Myth HUD created");
}

console.log("🌟 Myth HUD system ready");
