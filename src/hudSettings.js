// Settings HUD Section (Phase 13.0)
// User-configurable save paths and filename patterns

import { getSettings, updateSettings, chooseDirectory } from './settings.js';
import {
  COLOR_PALETTES,
  applyColorPalette,
  getCurrentPalette,
  getArchetypeNames,
  updateCustomColor,
  getCustomPalette,
  resetCustomPalette,
  COLOR_GENERATION_RULES,
  applyGeneratedPalette,
  getPersonalizedRecommendations,
  suggestPalette,
  setTrackingEnabled,
  clearUsageData
} from './colorPalettes.js';

export function createSettingsHudSection(container) {
  const section = document.createElement('div');
  section.className = 'hud-section';

  // Title
  const title = document.createElement('h4');
  title.textContent = '⚙️ Save Paths Configuration';
  title.style.cssText = 'margin: 10px 0; color: #00ffff; font-size: 13px; font-weight: 500;';
  section.appendChild(title);

  // Description
  const desc = document.createElement('p');
  desc.textContent = 'Configure where timeline and training data files are saved';
  desc.style.cssText = 'margin: 0 0 15px 0; color: #888; font-size: 11px;';
  section.appendChild(desc);

  // Path configurations
  const pathConfigs = [
    { key: 'timelines', label: 'Timeline JSONs', description: 'Preset and chain timeline files' },
    { key: 'trainingData', label: 'Training Data', description: 'CSV files for analysis' },
    { key: 'experiments', label: 'Experiments', description: 'Domain-specific test data' }
  ];

  pathConfigs.forEach(({ key, label, description }) => {
    const pathGroup = document.createElement('div');
    pathGroup.style.cssText = 'margin-bottom: 15px; padding: 10px; background: rgba(0, 255, 255, 0.05); border-radius: 4px;';

    const pathLabel = document.createElement('div');
    pathLabel.textContent = label;
    pathLabel.style.cssText = 'color: #00ffff; font-size: 11px; margin-bottom: 4px; font-weight: 500;';
    pathGroup.appendChild(pathLabel);

    const pathDesc = document.createElement('div');
    pathDesc.textContent = description;
    pathDesc.style.cssText = 'color: #666; font-size: 10px; margin-bottom: 6px;';
    pathGroup.appendChild(pathDesc);

    const pathRow = document.createElement('div');
    pathRow.style.cssText = 'display: flex; gap: 8px; align-items: center;';

    const pathInput = document.createElement('input');
    pathInput.type = 'text';
    pathInput.value = getSettings().savePaths[key] || '';
    pathInput.style.cssText = 'flex: 1; padding: 4px 8px; background: #1a1a1a; color: #00ffff; border: 1px solid #333; border-radius: 3px; font-size: 11px; font-family: monospace;';
    pathInput.readOnly = true;
    pathRow.appendChild(pathInput);

    const browseBtn = document.createElement('button');
    browseBtn.textContent = 'Browse';
    browseBtn.style.cssText = 'padding: 4px 12px; background: #2a2a2a; color: #00ffff; border: 1px solid #444; border-radius: 3px; cursor: pointer; font-size: 11px; transition: all 0.2s;';
    browseBtn.addEventListener('mouseover', () => {
      browseBtn.style.background = '#3a3a3a';
      browseBtn.style.borderColor = '#00ffff';
    });
    browseBtn.addEventListener('mouseout', () => {
      browseBtn.style.background = '#2a2a2a';
      browseBtn.style.borderColor = '#444';
    });
    browseBtn.addEventListener('click', async () => {
      const newPath = await chooseDirectory(pathInput.value);
      if (newPath) {
        pathInput.value = newPath;
        const settings = getSettings();
        settings.savePaths[key] = newPath;
        await updateSettings(settings);
        console.log(`✅ Updated ${label} path to: ${newPath}`);
      }
    });
    pathRow.appendChild(browseBtn);

    pathGroup.appendChild(pathRow);
    section.appendChild(pathGroup);
  });

  // Filename patterns
  const patternTitle = document.createElement('h4');
  patternTitle.textContent = '📝 Filename Patterns';
  patternTitle.style.cssText = 'margin: 20px 0 10px 0; color: #00ffff; font-size: 13px; font-weight: 500;';
  section.appendChild(patternTitle);

  const patternDesc = document.createElement('p');
  patternDesc.textContent = 'Customize filenames. Use {date} for YYYY-MM-DD, {timestamp} for Unix timestamp';
  patternDesc.style.cssText = 'margin: 0 0 15px 0; color: #888; font-size: 11px;';
  section.appendChild(patternDesc);

  const patternConfigs = [
    { key: 'presets', label: 'Presets', default: 'presets_{date}' },
    { key: 'chains', label: 'Chains', default: 'chains_{date}' },
    { key: 'training', label: 'Training', default: 'training_{date}' }
  ];

  patternConfigs.forEach(({ key, label, default: defaultPattern }) => {
    const patternGroup = document.createElement('div');
    patternGroup.style.cssText = 'margin-bottom: 10px;';

    const patternLabel = document.createElement('label');
    patternLabel.textContent = label;
    patternLabel.style.cssText = 'display: block; color: #00ffff; font-size: 11px; margin-bottom: 4px;';
    patternGroup.appendChild(patternLabel);

    const patternInput = document.createElement('input');
    patternInput.type = 'text';
    patternInput.value = getSettings().filenamePatterns[key] || defaultPattern;
    patternInput.placeholder = defaultPattern;
    patternInput.style.cssText = 'width: 100%; padding: 4px 8px; background: #1a1a1a; color: #00ffff; border: 1px solid #333; border-radius: 3px; font-size: 11px; font-family: monospace;';

    patternInput.addEventListener('change', async () => {
      const settings = getSettings();
      settings.filenamePatterns[key] = patternInput.value || defaultPattern;
      await updateSettings(settings);
      console.log(`✅ Updated ${label} pattern to: ${patternInput.value}`);
    });

    patternGroup.appendChild(patternInput);
    section.appendChild(patternGroup);
  });

  // Color Palette Section
  const colorPaletteTitle = document.createElement('h4');
  colorPaletteTitle.textContent = '🎨 Synesthetic Color Mapping';
  colorPaletteTitle.style.cssText = 'margin: 20px 0 10px 0; color: #00ffff; font-size: 13px; font-weight: 500;';
  section.appendChild(colorPaletteTitle);

  const colorPaletteDesc = document.createElement('p');
  colorPaletteDesc.textContent = 'Choose how archetypes map to colors. Each palette has different empirical or artistic basis.';
  colorPaletteDesc.style.cssText = 'margin: 0 0 15px 0; color: #888; font-size: 11px;';
  section.appendChild(colorPaletteDesc);

  const paletteSelector = document.createElement('select');
  paletteSelector.style.cssText = 'width: 100%; padding: 6px; background: #1a1a1a; color: #00ffff; border: 1px solid #6644aa; border-radius: 3px; font-size: 11px; margin-bottom: 10px; cursor: pointer;';

  // Add preset palettes
  Object.keys(COLOR_PALETTES).forEach(paletteName => {
    const option = document.createElement('option');
    option.value = paletteName;
    option.textContent = paletteName;
    paletteSelector.appendChild(option);
  });

  // Add Custom option
  const customOption = document.createElement('option');
  customOption.value = 'Custom';
  customOption.textContent = 'Custom (User-Defined)';
  paletteSelector.appendChild(customOption);

  paletteSelector.value = getCurrentPalette();

  // Description of selected palette
  const paletteDescDisplay = document.createElement('div');
  paletteDescDisplay.style.cssText = 'padding: 10px; background: rgba(0, 255, 255, 0.05); border: 1px solid #333; border-radius: 4px; font-size: 10px; color: #888; font-style: italic; margin-bottom: 10px;';

  function updateDescription() {
    if (paletteSelector.value === 'Custom') {
      const customPal = getCustomPalette();
      paletteDescDisplay.textContent = customPal?.description || 'Your personalized color mapping';
    } else {
      paletteDescDisplay.textContent = COLOR_PALETTES[paletteSelector.value].description;
    }
  }

  updateDescription();

  // Custom color editor (hidden by default)
  const customEditorContainer = document.createElement('div');
  customEditorContainer.style.cssText = 'display: none; margin-top: 15px; padding: 15px; background: rgba(0, 0, 0, 0.3); border: 1px solid #6644aa; border-radius: 4px;';

  paletteSelector.addEventListener('change', (e) => {
    applyColorPalette(e.target.value);
    updateDescription();

    // Show/hide custom editor
    if (e.target.value === 'Custom') {
      customEditorContainer.style.display = 'block';
      createCustomColorEditor(customEditorContainer);
    } else {
      customEditorContainer.style.display = 'none';
    }

    console.log(`🎨 Color palette changed to: ${e.target.value}`);
  });

  section.appendChild(paletteSelector);
  section.appendChild(paletteDescDisplay);
  section.appendChild(customEditorContainer);

  // Initialize custom editor if currently selected
  if (getCurrentPalette() === 'Custom') {
    customEditorContainer.style.display = 'block';
    createCustomColorEditor(customEditorContainer);
  }

  // Status indicator
  const status = document.createElement('div');
  status.style.cssText = 'margin-top: 20px; padding: 10px; background: rgba(0, 255, 0, 0.1); border-left: 3px solid #0f0; border-radius: 3px;';

  const statusTitle = document.createElement('div');
  statusTitle.textContent = '✅ Settings Auto-Saved';
  statusTitle.style.cssText = 'color: #0f0; font-size: 11px; font-weight: 500; margin-bottom: 4px;';
  status.appendChild(statusTitle);

  const statusDesc = document.createElement('div');
  statusDesc.textContent = 'Changes are saved automatically. Files will be saved to these locations when exported.';
  statusDesc.style.cssText = 'color: #888; font-size: 10px;';
  status.appendChild(statusDesc);

  section.appendChild(status);

  container.appendChild(section);
}

// Helper function to create custom color editor
function createCustomColorEditor(container) {
  container.innerHTML = ''; // Clear existing content

  const customPal = getCustomPalette();
  if (!customPal) return;

  // Header with reset button
  const header = document.createElement('div');
  header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #333;';

  const headerTitle = document.createElement('h5');
  headerTitle.textContent = 'Custom Palette Editor';
  headerTitle.style.cssText = 'color: #00ffff; font-size: 12px; margin: 0;';
  header.appendChild(headerTitle);

  const resetSection = document.createElement('div');
  resetSection.style.cssText = 'display: flex; gap: 8px; align-items: center;';

  const resetLabel = document.createElement('span');
  resetLabel.textContent = 'Reset from:';
  resetLabel.style.cssText = 'color: #888; font-size: 10px;';
  resetSection.appendChild(resetLabel);

  const resetSelector = document.createElement('select');
  resetSelector.style.cssText = 'padding: 3px 6px; background: #1a1a1a; color: #00ffff; border: 1px solid #444; border-radius: 3px; font-size: 10px; cursor: pointer;';

  Object.keys(COLOR_PALETTES).forEach(paletteName => {
    const option = document.createElement('option');
    option.value = paletteName;
    option.textContent = paletteName;
    resetSelector.appendChild(option);
  });

  resetSelector.addEventListener('change', (e) => {
    if (confirm(`Reset custom palette to "${e.target.value}"?`)) {
      resetCustomPalette(e.target.value);
      createCustomColorEditor(container); // Rebuild UI
      console.log(`✅ Custom palette reset to ${e.target.value}`);
    }
  });

  resetSection.appendChild(resetSelector);
  header.appendChild(resetSection);
  container.appendChild(header);

  // ===== PHASE 3: RULE-BASED GENERATION =====
  const generatorSection = document.createElement('div');
  generatorSection.style.cssText = 'margin-bottom: 20px; padding: 15px; background: rgba(102, 68, 170, 0.1); border: 1px solid #6644aa; border-radius: 4px;';

  const generatorTitle = document.createElement('h5');
  generatorTitle.textContent = '🎲 Generate from Rule';
  generatorTitle.style.cssText = 'color: #00ffff; font-size: 12px; margin: 0 0 10px 0;';
  generatorSection.appendChild(generatorTitle);

  const generatorDesc = document.createElement('div');
  generatorDesc.textContent = 'Algorithmically generate color palettes based on musical/mathematical properties';
  generatorDesc.style.cssText = 'color: #888; font-size: 10px; margin-bottom: 12px;';
  generatorSection.appendChild(generatorDesc);

  // Rule selector
  const ruleSelector = document.createElement('select');
  ruleSelector.style.cssText = 'width: 100%; padding: 6px; background: #1a1a1a; color: #00ffff; border: 1px solid #6644aa; border-radius: 3px; font-size: 10px; margin-bottom: 8px; cursor: pointer;';

  Object.keys(COLOR_GENERATION_RULES).forEach(ruleName => {
    const option = document.createElement('option');
    option.value = ruleName;
    option.textContent = ruleName;
    ruleSelector.appendChild(option);
  });

  // Rule description display
  const ruleDescDisplay = document.createElement('div');
  ruleDescDisplay.style.cssText = 'padding: 8px; background: rgba(0, 0, 0, 0.3); border: 1px solid #333; border-radius: 3px; font-size: 9px; color: #888; font-style: italic; margin-bottom: 12px; min-height: 32px;';
  ruleDescDisplay.textContent = COLOR_GENERATION_RULES[ruleSelector.value].description;

  ruleSelector.addEventListener('change', (e) => {
    ruleDescDisplay.textContent = COLOR_GENERATION_RULES[e.target.value].description;
    // Update color pickers with rule defaults
    const rule = COLOR_GENERATION_RULES[e.target.value];
    startColorPicker.value = rule.colorStart;
    endColorPicker.value = rule.colorEnd;
  });

  generatorSection.appendChild(ruleSelector);
  generatorSection.appendChild(ruleDescDisplay);

  // Color range controls
  const colorRangeRow = document.createElement('div');
  colorRangeRow.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;';

  const startColorGroup = document.createElement('div');
  const startColorLabel = document.createElement('label');
  startColorLabel.textContent = 'Start Color:';
  startColorLabel.style.cssText = 'display: block; color: #888; font-size: 9px; margin-bottom: 4px;';
  startColorGroup.appendChild(startColorLabel);

  const startColorPicker = document.createElement('input');
  startColorPicker.type = 'color';
  startColorPicker.value = COLOR_GENERATION_RULES[ruleSelector.value].colorStart;
  startColorPicker.style.cssText = 'width: 100%; height: 32px; background: #1a1a1a; border: 1px solid #6644aa; border-radius: 3px; cursor: pointer;';
  startColorGroup.appendChild(startColorPicker);

  const endColorGroup = document.createElement('div');
  const endColorLabel = document.createElement('label');
  endColorLabel.textContent = 'End Color:';
  endColorLabel.style.cssText = 'display: block; color: #888; font-size: 9px; margin-bottom: 4px;';
  endColorGroup.appendChild(endColorLabel);

  const endColorPicker = document.createElement('input');
  endColorPicker.type = 'color';
  endColorPicker.value = COLOR_GENERATION_RULES[ruleSelector.value].colorEnd;
  endColorPicker.style.cssText = 'width: 100%; height: 32px; background: #1a1a1a; border: 1px solid #6644aa; border-radius: 3px; cursor: pointer;';
  endColorGroup.appendChild(endColorPicker);

  colorRangeRow.appendChild(startColorGroup);
  colorRangeRow.appendChild(endColorGroup);
  generatorSection.appendChild(colorRangeRow);

  // Generate button
  const generateBtn = document.createElement('button');
  generateBtn.textContent = '✨ Generate & Apply Palette';
  generateBtn.style.cssText = 'width: 100%; padding: 8px 12px; background: linear-gradient(135deg, #6644aa 0%, #00ffff 100%); color: #000; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 500; transition: all 0.2s;';

  generateBtn.addEventListener('mouseover', () => {
    generateBtn.style.transform = 'scale(1.02)';
    generateBtn.style.boxShadow = '0 0 15px rgba(102, 68, 170, 0.5)';
  });

  generateBtn.addEventListener('mouseout', () => {
    generateBtn.style.transform = 'scale(1)';
    generateBtn.style.boxShadow = 'none';
  });

  generateBtn.addEventListener('click', () => {
    const ruleName = ruleSelector.value;
    const startColor = startColorPicker.value;
    const endColor = endColorPicker.value;

    applyGeneratedPalette(ruleName, startColor, endColor);
    createCustomColorEditor(container); // Rebuild UI to show new colors

    // Visual feedback
    generateBtn.textContent = '✅ Palette Generated!';
    setTimeout(() => {
      generateBtn.textContent = '✨ Generate & Apply Palette';
    }, 2000);
  });

  generatorSection.appendChild(generateBtn);
  container.appendChild(generatorSection);

  // ===== PHASE 4: ML-ASSISTED RECOMMENDATIONS =====
  const recommendationsSection = document.createElement('div');
  recommendationsSection.style.cssText = 'margin-top: 20px; padding: 15px; background: rgba(0, 255, 255, 0.05); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 4px;';

  const recsTitle = document.createElement('h5');
  recsTitle.textContent = '🤖 Suggested for You';
  recsTitle.style.cssText = 'color: #00ffff; font-size: 12px; margin: 0 0 10px 0;';
  recommendationsSection.appendChild(recsTitle);

  const recsDesc = document.createElement('div');
  recsDesc.textContent = 'AI-powered palette suggestions based on your usage patterns';
  recsDesc.style.cssText = 'color: #888; font-size: 10px; margin-bottom: 15px;';
  recommendationsSection.appendChild(recsDesc);

  // Get recommendations
  const recommendations = getPersonalizedRecommendations();

  // Most used palettes
  if (recommendations.mostUsed && recommendations.mostUsed.length > 0) {
    const mostUsedTitle = document.createElement('div');
    mostUsedTitle.textContent = 'Your Most Used Palettes:';
    mostUsedTitle.style.cssText = 'color: #888; font-size: 10px; margin-bottom: 8px;';
    recommendationsSection.appendChild(mostUsedTitle);

    const mostUsedList = document.createElement('div');
    mostUsedList.style.cssText = 'margin-bottom: 15px;';

    recommendations.mostUsed.forEach((palette, index) => {
      const paletteItem = document.createElement('div');
      paletteItem.style.cssText = 'display: flex; justify-content: space-between; padding: 6px 8px; background: rgba(0, 0, 0, 0.3); border: 1px solid #333; border-radius: 3px; margin-bottom: 4px; font-size: 9px;';

      const paletteName = document.createElement('span');
      paletteName.textContent = `${index + 1}. ${palette.paletteName}`;
      paletteName.style.cssText = 'color: #00ffff;';

      const paletteStats = document.createElement('span');
      const durationMins = Math.round(palette.totalDuration / 60000);
      paletteStats.textContent = `${palette.usageCount} sessions, ${durationMins}m`;
      paletteStats.style.cssText = 'color: #666;';

      paletteItem.appendChild(paletteName);
      paletteItem.appendChild(paletteStats);
      mostUsedList.appendChild(paletteItem);
    });

    recommendationsSection.appendChild(mostUsedList);
  }

  // AI Suggestion
  if (recommendations.suggestion) {
    const suggestionTitle = document.createElement('div');
    suggestionTitle.textContent = 'AI-Generated Suggestion:';
    suggestionTitle.style.cssText = 'color: #888; font-size: 10px; margin-bottom: 8px;';
    recommendationsSection.appendChild(suggestionTitle);

    const suggestionBox = document.createElement('div');
    suggestionBox.style.cssText = 'padding: 10px; background: rgba(102, 68, 170, 0.2); border: 1px solid #6644aa; border-radius: 3px; margin-bottom: 12px;';

    if (recommendations.suggestion.type === 'preset') {
      const presetRec = document.createElement('div');
      presetRec.style.cssText = 'font-size: 10px; color: #888;';
      presetRec.innerHTML = `
        <div style="color: #00ffff; margin-bottom: 4px;">${recommendations.suggestion.paletteName}</div>
        <div style="font-style: italic;">${recommendations.suggestion.reason}</div>
      `;
      suggestionBox.appendChild(presetRec);
    } else if (recommendations.suggestion.type === 'generated') {
      const generatedRec = document.createElement('div');
      generatedRec.style.cssText = 'font-size: 10px; color: #888;';
      generatedRec.innerHTML = `
        <div style="color: #00ffff; margin-bottom: 4px;">Rule: ${recommendations.suggestion.rule}</div>
        <div style="margin-bottom: 8px; font-style: italic;">${recommendations.suggestion.reason}</div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span>Start:</span>
          <div style="width: 20px; height: 20px; background: ${recommendations.suggestion.startColor}; border: 1px solid #666; border-radius: 2px;"></div>
          <span>→</span>
          <div style="width: 20px; height: 20px; background: ${recommendations.suggestion.endColor}; border: 1px solid #666; border-radius: 2px;"></div>
          <span>End</span>
        </div>
      `;
      suggestionBox.appendChild(generatedRec);

      const applySuggestionBtn = document.createElement('button');
      applySuggestionBtn.textContent = '✨ Apply This Suggestion';
      applySuggestionBtn.style.cssText = 'width: 100%; padding: 8px; margin-top: 10px; background: linear-gradient(135deg, #6644aa, #8855cc); color: white; border: none; border-radius: 4px; font-size: 11px; cursor: pointer; transition: all 0.2s;';

      applySuggestionBtn.addEventListener('mouseover', () => {
        applySuggestionBtn.style.transform = 'scale(1.02)';
        applySuggestionBtn.style.boxShadow = '0 0 15px rgba(102, 68, 170, 0.5)';
      });

      applySuggestionBtn.addEventListener('mouseout', () => {
        applySuggestionBtn.style.transform = 'scale(1)';
        applySuggestionBtn.style.boxShadow = 'none';
      });

      applySuggestionBtn.addEventListener('click', () => {
        applyGeneratedPalette(
          recommendations.suggestion.rule,
          recommendations.suggestion.startColor,
          recommendations.suggestion.endColor
        );
        createCustomColorEditor(container); // Rebuild UI
        applySuggestionBtn.textContent = '✅ Suggestion Applied!';
        setTimeout(() => {
          applySuggestionBtn.textContent = '✨ Apply This Suggestion';
        }, 2000);
      });

      suggestionBox.appendChild(applySuggestionBtn);
    }

    recommendationsSection.appendChild(suggestionBox);
  }

  // Privacy controls
  const privacySection = document.createElement('div');
  privacySection.style.cssText = 'margin-top: 12px; padding-top: 12px; border-top: 1px dashed #333;';

  const privacyTitle = document.createElement('div');
  privacyTitle.textContent = '🔒 Privacy Controls:';
  privacyTitle.style.cssText = 'color: #666; font-size: 9px; margin-bottom: 8px;';
  privacySection.appendChild(privacyTitle);

  const privacyButtons = document.createElement('div');
  privacyButtons.style.cssText = 'display: flex; gap: 8px;';

  const clearDataBtn = document.createElement('button');
  clearDataBtn.textContent = '🗑️ Clear Usage Data';
  clearDataBtn.style.cssText = 'flex: 1; padding: 6px; background: rgba(220, 20, 60, 0.2); color: #dc143c; border: 1px solid #dc143c; border-radius: 3px; font-size: 9px; cursor: pointer; transition: all 0.2s;';

  clearDataBtn.addEventListener('mouseover', () => {
    clearDataBtn.style.background = 'rgba(220, 20, 60, 0.3)';
  });

  clearDataBtn.addEventListener('mouseout', () => {
    clearDataBtn.style.background = 'rgba(220, 20, 60, 0.2)';
  });

  clearDataBtn.addEventListener('click', () => {
    if (confirm('Clear all usage tracking data? This cannot be undone.')) {
      clearUsageData();
      createCustomColorEditor(container); // Rebuild UI
      clearDataBtn.textContent = '✅ Data Cleared';
      setTimeout(() => {
        clearDataBtn.textContent = '🗑️ Clear Usage Data';
      }, 2000);
    }
  });

  privacyButtons.appendChild(clearDataBtn);
  privacySection.appendChild(privacyButtons);

  const privacyNote = document.createElement('div');
  privacyNote.textContent = 'All tracking data stays local on your device. No external data collection.';
  privacyNote.style.cssText = 'color: #444; font-size: 8px; margin-top: 8px; font-style: italic;';
  privacySection.appendChild(privacyNote);

  recommendationsSection.appendChild(privacySection);
  container.appendChild(recommendationsSection);

  // Divider
  const divider = document.createElement('div');
  divider.style.cssText = 'border-top: 1px solid #333; margin: 20px 0;';
  container.appendChild(divider);

  // Manual editing title
  const manualTitle = document.createElement('h5');
  manualTitle.textContent = '🎨 Manual Color Editing';
  manualTitle.style.cssText = 'color: #888; font-size: 11px; margin: 0 0 15px 0;';
  container.appendChild(manualTitle);

  // π and φ colors
  const piPhiSection = document.createElement('div');
  piPhiSection.style.cssText = 'margin-bottom: 15px;';

  const piPhiTitle = document.createElement('div');
  piPhiTitle.textContent = 'π/φ Synchronicity Colors:';
  piPhiTitle.style.cssText = 'color: #888; font-size: 10px; margin-bottom: 8px;';
  piPhiSection.appendChild(piPhiTitle);

  const piPhiGrid = document.createElement('div');
  piPhiGrid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 10px;';

  createColorInput(piPhiGrid, 'π (Chaos)', customPal.pi, (color) => {
    updateCustomColor('pi', color);
  });

  createColorInput(piPhiGrid, 'φ (Harmony)', customPal.phi, (color) => {
    updateCustomColor('phi', color);
  });

  piPhiSection.appendChild(piPhiGrid);
  container.appendChild(piPhiSection);

  // Archetype colors
  const archetypeSection = document.createElement('div');

  const archetypeTitle = document.createElement('div');
  archetypeTitle.textContent = 'Archetype Colors:';
  archetypeTitle.style.cssText = 'color: #888; font-size: 10px; margin-bottom: 8px;';
  archetypeSection.appendChild(archetypeTitle);

  const archetypeGrid = document.createElement('div');
  archetypeGrid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 10px;';

  const archetypeNames = getArchetypeNames();
  const archetypeLabels = {
    'PERFECT_FIFTH': 'Perfect Fifth',
    'WOLF_FIFTH': 'Wolf Fifth',
    'MAJOR_THIRD': 'Major Third',
    'MINOR_THIRD': 'Minor Third',
    'TRITONE': 'Tritone',
    'OCTAVE': 'Octave',
    'PERFECT_FOURTH': 'Perfect Fourth',
    'MAJOR_SIXTH': 'Major Sixth',
    'MINOR_SIXTH': 'Minor Sixth',
    'MAJOR_SECOND': 'Major Second',
    'MINOR_SECOND': 'Minor Second'
  };

  archetypeNames.forEach(archetype => {
    createColorInput(archetypeGrid, archetypeLabels[archetype], customPal.archetypes[archetype], (color) => {
      updateCustomColor(archetype, color);
    });
  });

  archetypeSection.appendChild(archetypeGrid);
  container.appendChild(archetypeSection);
}

// Helper to create a color input row
function createColorInput(container, label, initialColor, onChange) {
  const row = document.createElement('div');
  row.style.cssText = 'display: flex; align-items: center; gap: 8px;';

  const labelEl = document.createElement('label');
  labelEl.textContent = label;
  labelEl.style.cssText = 'flex: 1; color: #00ffff; font-size: 10px;';
  row.appendChild(labelEl);

  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = initialColor;
  colorInput.style.cssText = 'width: 40px; height: 24px; background: #1a1a1a; border: 1px solid #6644aa; border-radius: 3px; cursor: pointer;';

  colorInput.addEventListener('change', (e) => {
    onChange(e.target.value);
  });

  row.appendChild(colorInput);

  const hexDisplay = document.createElement('span');
  hexDisplay.textContent = initialColor;
  hexDisplay.style.cssText = 'font-family: monospace; font-size: 9px; color: #666; width: 60px;';

  colorInput.addEventListener('input', (e) => {
    hexDisplay.textContent = e.target.value;
  });

  row.appendChild(hexDisplay);
  container.appendChild(row);
}
