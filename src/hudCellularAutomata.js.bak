import { state } from './state.js';

export function createCellularAutomataHudSection(container) {
  // Initialize state
  if (!state.cellularAutomata) {
    state.cellularAutomata = {
      enabled: false,
      birthRules: [3, 0, 0, 0],
      surviveRules: [2, 3, 0, 0],
      updateRate: 10,
      cellSize: 1.0,
      showGrid: true,
      aliveColor: [0.2, 0.8, 1.0],
      deadColor: [0.0, 0.0, 0.1]
    };
  }

  const section = document.createElement('div');
  section.className = 'hud-section';

  const title = document.createElement('h3');
  title.textContent = 'Cellular Automata';
  section.appendChild(title);

  // Enable toggle
  const enableContainer = document.createElement('div');
  enableContainer.className = 'hud-control';
  const enableLabel = document.createElement('label');
  enableLabel.textContent = 'Enable: ';
  const enableCheckbox = document.createElement('input');
  enableCheckbox.type = 'checkbox';
  enableCheckbox.checked = state.cellularAutomata.enabled;
  enableCheckbox.addEventListener('change', (e) => {
    state.cellularAutomata.enabled = e.target.checked;
  });
  enableLabel.appendChild(enableCheckbox);
  enableContainer.appendChild(enableLabel);
  section.appendChild(enableContainer);

  // Birth Rules
  const birthRulesContainer = document.createElement('div');
  birthRulesContainer.className = 'hud-control';
  birthRulesContainer.style.display = 'flex';
  birthRulesContainer.style.flexDirection = 'column';
  const birthRulesTitle = document.createElement('label');
  birthRulesTitle.textContent = 'Birth Rules (neighbor counts):';
  birthRulesContainer.appendChild(birthRulesTitle);

  const birthRulesInputContainer = document.createElement('div');
  birthRulesInputContainer.style.display = 'flex';
  birthRulesInputContainer.style.gap = '5px';

  const birthRuleInputs = [];
  for (let i = 0; i < 4; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = '8';
    input.value = state.cellularAutomata.birthRules[i].toString();
    input.style.width = '50px';
    input.addEventListener('input', (e) => {
      const val = parseInt(e.target.value) || 0;
      state.cellularAutomata.birthRules[i] = Math.max(0, Math.min(8, val));
    });
    birthRuleInputs.push(input);
    birthRulesInputContainer.appendChild(input);
  }
  birthRulesContainer.appendChild(birthRulesInputContainer);
  section.appendChild(birthRulesContainer);

  // Survive Rules
  const surviveRulesContainer = document.createElement('div');
  surviveRulesContainer.className = 'hud-control';
  surviveRulesContainer.style.display = 'flex';
  surviveRulesContainer.style.flexDirection = 'column';
  const surviveRulesTitle = document.createElement('label');
  surviveRulesTitle.textContent = 'Survive Rules (neighbor counts):';
  surviveRulesContainer.appendChild(surviveRulesTitle);

  const surviveRulesInputContainer = document.createElement('div');
  surviveRulesInputContainer.style.display = 'flex';
  surviveRulesInputContainer.style.gap = '5px';

  const surviveRuleInputs = [];
  for (let i = 0; i < 4; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = '8';
    input.value = state.cellularAutomata.surviveRules[i].toString();
    input.style.width = '50px';
    input.addEventListener('input', (e) => {
      const val = parseInt(e.target.value) || 0;
      state.cellularAutomata.surviveRules[i] = Math.max(0, Math.min(8, val));
    });
    surviveRuleInputs.push(input);
    surviveRulesInputContainer.appendChild(input);
  }
  surviveRulesContainer.appendChild(surviveRulesInputContainer);
  section.appendChild(surviveRulesContainer);

  // Update Rate slider
  const updateRateContainer = document.createElement('div');
  updateRateContainer.className = 'hud-control';
  const updateRateLabel = document.createElement('label');
  updateRateLabel.textContent = 'Update Rate (frames): ';
  const updateRateSlider = document.createElement('input');
  updateRateSlider.type = 'range';
  updateRateSlider.min = '1';
  updateRateSlider.max = '60';
  updateRateSlider.step = '1';
  updateRateSlider.value = state.cellularAutomata.updateRate.toString();
  const updateRateValue = document.createElement('span');
  updateRateValue.textContent = state.cellularAutomata.updateRate.toFixed(0);
  updateRateSlider.addEventListener('input', (e) => {
    state.cellularAutomata.updateRate = parseInt(e.target.value);
    updateRateValue.textContent = state.cellularAutomata.updateRate.toFixed(0);
  });
  updateRateLabel.appendChild(updateRateSlider);
  updateRateLabel.appendChild(updateRateValue);
  updateRateContainer.appendChild(updateRateLabel);
  section.appendChild(updateRateContainer);

  // Cell Size slider
  const cellSizeContainer = document.createElement('div');
  cellSizeContainer.className = 'hud-control';
  const cellSizeLabel = document.createElement('label');
  cellSizeLabel.textContent = 'Cell Size: ';
  const cellSizeSlider = document.createElement('input');
  cellSizeSlider.type = 'range';
  cellSizeSlider.min = '0.5';
  cellSizeSlider.max = '5.0';
  cellSizeSlider.step = '0.1';
  cellSizeSlider.value = state.cellularAutomata.cellSize.toString();
  const cellSizeValue = document.createElement('span');
  cellSizeValue.textContent = state.cellularAutomata.cellSize.toFixed(1);
  cellSizeSlider.addEventListener('input', (e) => {
    state.cellularAutomata.cellSize = parseFloat(e.target.value);
    cellSizeValue.textContent = state.cellularAutomata.cellSize.toFixed(1);
  });
  cellSizeLabel.appendChild(cellSizeSlider);
  cellSizeLabel.appendChild(cellSizeValue);
  cellSizeContainer.appendChild(cellSizeLabel);
  section.appendChild(cellSizeContainer);

  // Show Grid toggle
  const showGridContainer = document.createElement('div');
  showGridContainer.className = 'hud-control';
  const showGridLabel = document.createElement('label');
  showGridLabel.textContent = 'Show Grid: ';
  const showGridCheckbox = document.createElement('input');
  showGridCheckbox.type = 'checkbox';
  showGridCheckbox.checked = state.cellularAutomata.showGrid;
  showGridCheckbox.addEventListener('change', (e) => {
    state.cellularAutomata.showGrid = e.target.checked;
  });
  showGridLabel.appendChild(showGridCheckbox);
  showGridContainer.appendChild(showGridLabel);
  section.appendChild(showGridContainer);

  // Rule Presets
  const presetsContainer = document.createElement('div');
  presetsContainer.className = 'hud-control';
  const presetsLabel = document.createElement('label');
  presetsLabel.textContent = 'Rule Presets: ';
  presetsContainer.appendChild(presetsLabel);

  const rulePresets = [
    {
      name: "Conway's Life (B3/S23)",
      birth: [3, 0, 0, 0],
      survive: [2, 3, 0, 0]
    },
    {
      name: 'HighLife (B36/S23)',
      birth: [3, 6, 0, 0],
      survive: [2, 3, 0, 0]
    },
    {
      name: 'Day & Night (B3678/S34678)',
      birth: [3, 6, 7, 8],
      survive: [3, 4, 6, 7]
    },
    {
      name: 'Seeds (B2/S)',
      birth: [2, 0, 0, 0],
      survive: [0, 0, 0, 0]
    }
  ];

  rulePresets.forEach(preset => {
    const button = document.createElement('button');
    button.textContent = preset.name;
    button.addEventListener('click', () => {
      state.cellularAutomata.birthRules = [...preset.birth];
      state.cellularAutomata.surviveRules = [...preset.survive];

      for (let i = 0; i < 4; i++) {
        birthRuleInputs[i].value = preset.birth[i].toString();
        surviveRuleInputs[i].value = preset.survive[i].toString();
      }
    });
    presetsContainer.appendChild(button);
  });

  section.appendChild(presetsContainer);

  // Pattern Library
  const patternsContainer = document.createElement('div');
  patternsContainer.className = 'hud-control';
  const patternsLabel = document.createElement('label');
  patternsLabel.textContent = 'Initialize Pattern: ';
  patternsContainer.appendChild(patternsLabel);

  const patterns = [
    { name: 'Random (30%)', pattern: 'random' },
    { name: 'Random (50%)', pattern: 'random50' },
    { name: 'Clear All', pattern: 'clear' },
    { name: 'Center Square', pattern: 'centerSquare' }
  ];

  patterns.forEach(pattern => {
    const button = document.createElement('button');
    button.textContent = pattern.name;
    button.addEventListener('click', () => {
      // Set a flag to trigger pattern initialization in visual.js
      state.cellularAutomata.initPattern = pattern.pattern;
    });
    patternsContainer.appendChild(button);
  });

  section.appendChild(patternsContainer);
  container.appendChild(section);
}
