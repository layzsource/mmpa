// Settings HUD Section (Phase 13.0)
// User-configurable save paths and filename patterns

import { getSettings, updateSettings, chooseDirectory } from './settings.js';
import { COLOR_PALETTES, applyColorPalette, getCurrentPalette } from './colorPalettes.js';

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

  Object.keys(COLOR_PALETTES).forEach(paletteName => {
    const option = document.createElement('option');
    option.value = paletteName;
    option.textContent = paletteName;
    paletteSelector.appendChild(option);
  });

  paletteSelector.value = getCurrentPalette();

  paletteSelector.addEventListener('change', (e) => {
    applyColorPalette(e.target.value);
    paletteDescDisplay.textContent = COLOR_PALETTES[e.target.value].description;
    console.log(`🎨 Color palette changed to: ${e.target.value}`);
  });

  section.appendChild(paletteSelector);

  // Description of selected palette
  const paletteDescDisplay = document.createElement('div');
  paletteDescDisplay.style.cssText = 'padding: 10px; background: rgba(0, 255, 255, 0.05); border: 1px solid #333; border-radius: 4px; font-size: 10px; color: #888; font-style: italic; margin-bottom: 20px;';
  paletteDescDisplay.textContent = COLOR_PALETTES[getCurrentPalette()].description;
  section.appendChild(paletteDescDisplay);

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
