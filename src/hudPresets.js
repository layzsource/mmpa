import { state } from './state.js';
import { updatePresetList } from './hud.js';

console.log("💾 hudPresets.js loaded");

/**
 * Phase 12: Modular Presets HUD Section
 * Extracted from hud.js - complete Preset Manager, Interpolation, and Morph Chain UI
 */

/**
 * Creates the Presets HUD section with all controls
 * @param {HTMLElement} parentContainer - The parent container to append to
 * @param {Function} notifyHUDUpdate - Callback to notify HUD changes
 */
export function createPresetsHudSection(parentContainer, notifyHUDUpdate) {
  console.log("💾 Creating Presets HUD section");

  const presetSeparator = document.createElement('hr');
  presetSeparator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  parentContainer.appendChild(presetSeparator);

  const presetTitle = document.createElement('h4');
  presetTitle.textContent = '💾 Preset Manager (Phase 11.2.4)';
  presetTitle.style.cssText = 'margin: 0 0 10px 0; color: #00ffff; font-size: 12px;';
  parentContainer.appendChild(presetTitle);

  // Preset save controls (new preset)
  const saveContainer = document.createElement('div');
  saveContainer.style.cssText = 'margin-bottom: 10px;';

  const saveInput = document.createElement('input');
  saveInput.type = 'text';
  saveInput.placeholder = 'New preset name...';
  saveInput.style.cssText = 'width: 58%; padding: 4px; background: #333; color: white; border: 1px solid #555; margin-right: 2%;';

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save New';
  saveButton.style.cssText = 'width: 38%; padding: 4px; background: #00ff00; color: black; border: none; cursor: pointer; font-weight: bold;';
  saveButton.title = 'Save current state as new preset';

  // Phase 11.2.6: Category and tags inputs
  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Category (e.g., Live, Test)';
  categoryInput.value = 'Uncategorized';
  categoryInput.style.cssText = 'width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555; margin-top: 5px; font-size: 11px;';

  const tagsInput = document.createElement('input');
  tagsInput.type = 'text';
  tagsInput.placeholder = 'Tags (comma-separated, e.g., bright, fast)';
  tagsInput.style.cssText = 'width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555; margin-top: 5px; font-size: 11px;';

  saveButton.addEventListener('click', () => {
    const presetName = saveInput.value.trim();
    if (presetName) {
      const category = categoryInput.value.trim() || 'Uncategorized';
      const tags = tagsInput.value.trim() ? tagsInput.value.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];
      console.log("💾 [HUD] Save button clicked:", { presetName, category, tags });
      notifyHUDUpdate({ presetAction: 'save', presetName: presetName, category: category, tags: tags });
      saveInput.value = '';
      categoryInput.value = 'Uncategorized';
      tagsInput.value = '';
    } else {
      console.warn("💾 [HUD] Save button clicked but preset name is empty");
    }
  });

  saveContainer.appendChild(saveInput);
  saveContainer.appendChild(saveButton);
  saveContainer.appendChild(categoryInput);
  saveContainer.appendChild(tagsInput);
  parentContainer.appendChild(saveContainer);

  // Phase 11.2.6: Filter controls (category dropdown + tag filter)
  const filterContainer = document.createElement('div');
  filterContainer.style.cssText = 'margin-bottom: 10px;';

  // Phase 11.2.7: Search input
  const searchLabel = document.createElement('div');
  searchLabel.textContent = 'Search Presets:';
  searchLabel.style.cssText = 'margin-bottom: 3px; color: #aaa; font-size: 10px;';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search by name, category, or tags...';
  searchInput.style.cssText = 'width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555; margin-bottom: 8px; font-size: 11px;';

  const categoryFilterLabel = document.createElement('div');
  categoryFilterLabel.textContent = 'Filter by Category:';
  categoryFilterLabel.style.cssText = 'margin-bottom: 3px; color: #aaa; font-size: 10px;';

  const categoryFilter = document.createElement('select');
  categoryFilter.style.cssText = 'width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555; margin-bottom: 5px; font-size: 11px;';

  const tagFilterLabel = document.createElement('div');
  tagFilterLabel.textContent = 'Filter by Tags (comma-separated):';
  tagFilterLabel.style.cssText = 'margin-bottom: 3px; color: #aaa; font-size: 10px;';

  const tagFilter = document.createElement('input');
  tagFilter.type = 'text';
  tagFilter.placeholder = 'e.g., bright, fast';
  tagFilter.style.cssText = 'width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555; font-size: 11px;';

  filterContainer.appendChild(searchLabel);
  filterContainer.appendChild(searchInput);
  filterContainer.appendChild(categoryFilterLabel);
  filterContainer.appendChild(categoryFilter);
  filterContainer.appendChild(tagFilterLabel);
  filterContainer.appendChild(tagFilter);
  parentContainer.appendChild(filterContainer);

  // Phase 11.2.4: Preset list view (improved from dropdown)
  const presetListLabel = document.createElement('div');
  presetListLabel.textContent = 'Saved Presets:';
  presetListLabel.style.cssText = 'margin-bottom: 5px; color: #aaa; font-size: 11px;';
  parentContainer.appendChild(presetListLabel);

  const presetListContainer = document.createElement('div');
  presetListContainer.id = 'preset-list-container';
  presetListContainer.style.cssText = `
    max-height: 150px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #555;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 5px;
  `;
  parentContainer.appendChild(presetListContainer);

  // Preset action buttons (load/update/delete)
  const actionContainer = document.createElement('div');
  actionContainer.style.cssText = 'display: flex; gap: 5px; margin-bottom: 10px;';

  const loadButton = document.createElement('button');
  loadButton.textContent = 'Load';
  loadButton.style.cssText = 'flex: 1; padding: 6px; background: #0088ff; color: white; border: none; cursor: pointer; border-radius: 3px;';
  loadButton.title = 'Load selected preset';
  loadButton.disabled = true;

  const updateButton = document.createElement('button');
  updateButton.textContent = 'Update';
  updateButton.style.cssText = 'flex: 1; padding: 6px; background: #ff9900; color: white; border: none; cursor: pointer; border-radius: 3px;';
  updateButton.title = 'Overwrite selected preset with current state';
  updateButton.disabled = true;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.style.cssText = 'flex: 1; padding: 6px; background: #ff4444; color: white; border: none; cursor: pointer; border-radius: 3px;';
  deleteButton.title = 'Delete selected preset';
  deleteButton.disabled = true;

  // Track selected preset
  let selectedPresetName = null;

  loadButton.addEventListener('click', () => {
    if (selectedPresetName) {
      notifyHUDUpdate({ presetAction: 'load', presetName: selectedPresetName });
    }
  });

  updateButton.addEventListener('click', () => {
    if (selectedPresetName && confirm(`Overwrite preset "${selectedPresetName}" with current state?`)) {
      notifyHUDUpdate({ presetAction: 'update', presetName: selectedPresetName });
    }
  });

  deleteButton.addEventListener('click', () => {
    if (selectedPresetName && confirm(`Delete preset "${selectedPresetName}"?`)) {
      notifyHUDUpdate({ presetAction: 'delete', presetName: selectedPresetName });
      selectedPresetName = null;
      loadButton.disabled = true;
      updateButton.disabled = true;
      deleteButton.disabled = true;
    }
  });

  actionContainer.appendChild(loadButton);
  actionContainer.appendChild(updateButton);
  actionContainer.appendChild(deleteButton);
  parentContainer.appendChild(actionContainer);

  // Phase 11.2.8: Interpolation controls
  const interpolationContainer = document.createElement('div');
  interpolationContainer.style.cssText = 'margin-bottom: 10px; padding: 8px; background: rgba(0, 100, 150, 0.1); border: 1px solid #0066aa; border-radius: 4px;';

  const interpolationTitle = document.createElement('div');
  interpolationTitle.textContent = '🎚️ Preset Interpolation';
  interpolationTitle.style.cssText = 'margin-bottom: 5px; color: #00aaff; font-size: 11px; font-weight: bold;';

  const interpolationToggleLabel = document.createElement('label');
  interpolationToggleLabel.style.cssText = 'display: flex; align-items: center; margin-bottom: 5px; font-size: 11px; cursor: pointer;';

  const interpolationToggle = document.createElement('input');
  interpolationToggle.type = 'checkbox';
  interpolationToggle.checked = state.interpolation.enabled;
  interpolationToggle.style.cssText = 'margin-right: 8px;';

  const interpolationStatus = document.createElement('span');
  interpolationStatus.textContent = state.interpolation.enabled ? 'Enabled' : 'Disabled';
  interpolationStatus.style.cssText = `color: ${state.interpolation.enabled ? '#00ff00' : '#ff6666'};`;

  interpolationToggle.addEventListener('change', () => {
    state.interpolation.enabled = interpolationToggle.checked;
    interpolationStatus.textContent = interpolationToggle.checked ? 'Enabled' : 'Disabled';
    interpolationStatus.style.color = interpolationToggle.checked ? '#00ff00' : '#ff6666';
    console.log(`🎚️ Interpolation ${interpolationToggle.checked ? 'enabled' : 'disabled'}`);
  });

  interpolationToggleLabel.appendChild(interpolationToggle);
  interpolationToggleLabel.appendChild(interpolationStatus);

  const durationLabel = document.createElement('div');
  durationLabel.textContent = `Duration: ${state.interpolation.duration}ms`;
  durationLabel.style.cssText = 'margin-bottom: 3px; color: #aaa; font-size: 10px;';

  const durationSlider = document.createElement('input');
  durationSlider.type = 'range';
  durationSlider.min = '500';
  durationSlider.max = '10000';
  durationSlider.step = '500';
  durationSlider.value = state.interpolation.duration;
  durationSlider.style.cssText = 'width: 100%; margin-bottom: 3px;';

  durationSlider.addEventListener('input', () => {
    const value = parseInt(durationSlider.value);
    state.interpolation.duration = value;
    durationLabel.textContent = `Duration: ${value}ms`;
  });

  interpolationContainer.appendChild(interpolationTitle);
  interpolationContainer.appendChild(interpolationToggleLabel);
  interpolationContainer.appendChild(durationLabel);
  interpolationContainer.appendChild(durationSlider);
  parentContainer.appendChild(interpolationContainer);

  // ---- Phase 11.3.0: Morph Chain UI ----
  const chainSeparator = document.createElement('hr');
  chainSeparator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  parentContainer.appendChild(chainSeparator);

  const chainSection = document.createElement("div");
  chainSection.className = "panel-section";
  chainSection.style.cssText = 'margin-bottom: 10px;';

  const chainHeaderRow = document.createElement("div");
  chainHeaderRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;';

  const chainHeader = document.createElement("div");
  chainHeader.className = "panel-title";
  chainHeader.textContent = "🔗 Morph Chain";
  chainHeader.style.cssText = 'color: #ff9900; font-size: 12px; font-weight: bold;';

  // Phase 11.3.2: Status badge
  const statusBadge = document.createElement("div");
  statusBadge.id = "chainStatusBadge";
  statusBadge.textContent = "⏹ Stopped";
  statusBadge.style.cssText = 'padding: 3px 8px; background: #333; color: #888; border-radius: 3px; font-size: 9px; font-weight: bold;';

  chainHeaderRow.appendChild(chainHeader);
  chainHeaderRow.appendChild(statusBadge);
  chainSection.appendChild(chainHeaderRow);

  // Preset list as checkboxes
  const chainList = document.createElement("div");
  chainList.style.display = "flex";
  chainList.style.flexDirection = "column";
  chainList.style.gap = "6px";
  chainList.style.maxHeight = "150px";
  chainList.style.overflowY = "auto";
  chainList.style.marginBottom = "8px";
  chainList.style.padding = "5px";
  chainList.style.background = "#222";
  chainList.style.border = "1px solid #555";
  chainSection.appendChild(chainList);

  // Duration slider
  const durRow = document.createElement("div");
  durRow.style.display = "flex";
  durRow.style.alignItems = "center";
  durRow.style.gap = "8px";
  durRow.style.marginBottom = "8px";
  const durLabel = document.createElement("span");
  durLabel.textContent = "Duration (ms):";
  durLabel.style.fontSize = "10px";
  durLabel.style.color = "#aaa";
  const durInput = document.createElement("input");
  durInput.type = "range";
  durInput.min = "500";
  durInput.max = "10000";
  durInput.step = "500";
  durInput.value = "2000";
  durInput.style.flex = "1";
  const durVal = document.createElement("span");
  durVal.textContent = "2000";
  durVal.style.fontSize = "10px";
  durVal.style.color = "#fff";
  durVal.style.minWidth = "45px";
  durInput.addEventListener("input", () => durVal.textContent = durInput.value);
  durRow.appendChild(durLabel);
  durRow.appendChild(durInput);
  durRow.appendChild(durVal);
  chainSection.appendChild(durRow);

  // Phase 11.3.1: Loop/Shuffle toggles
  const optionsRow = document.createElement("div");
  optionsRow.style.display = "flex";
  optionsRow.style.gap = "15px";
  optionsRow.style.marginBottom = "8px";
  optionsRow.style.fontSize = "10px";

  const loopLabel = document.createElement("label");
  loopLabel.style.display = "flex";
  loopLabel.style.alignItems = "center";
  loopLabel.style.gap = "5px";
  loopLabel.style.cursor = "pointer";
  const loopCheckbox = document.createElement("input");
  loopCheckbox.type = "checkbox";
  loopCheckbox.id = "chainLoopToggle";
  loopLabel.appendChild(loopCheckbox);
  loopLabel.appendChild(document.createTextNode("🔁 Loop"));

  const shuffleLabel = document.createElement("label");
  shuffleLabel.style.display = "flex";
  shuffleLabel.style.alignItems = "center";
  shuffleLabel.style.gap = "5px";
  shuffleLabel.style.cursor = "pointer";
  const shuffleCheckbox = document.createElement("input");
  shuffleCheckbox.type = "checkbox";
  shuffleCheckbox.id = "chainShuffleToggle";
  shuffleLabel.appendChild(shuffleCheckbox);
  shuffleLabel.appendChild(document.createTextNode("🔀 Shuffle"));

  optionsRow.appendChild(loopLabel);
  optionsRow.appendChild(shuffleLabel);
  chainSection.appendChild(optionsRow);

  // Phase 11.3.1: Progress indicator
  const progressContainer = document.createElement("div");
  progressContainer.style.marginBottom = "8px";
  const progressLabel = document.createElement("div");
  progressLabel.textContent = "Progress: —";
  progressLabel.id = "chainProgressLabel";
  progressLabel.style.fontSize = "10px";
  progressLabel.style.color = "#aaa";
  progressLabel.style.marginBottom = "3px";
  const progressBar = document.createElement("div");
  progressBar.style.width = "100%";
  progressBar.style.height = "8px";
  progressBar.style.background = "#333";
  progressBar.style.border = "1px solid #555";
  progressBar.style.position = "relative";
  const progressFill = document.createElement("div");
  progressFill.id = "chainProgressFill";
  progressFill.style.width = "0%";
  progressFill.style.height = "100%";
  progressFill.style.background = "#00ff00";
  progressFill.style.transition = "width 0.1s linear"; // Phase 11.4.1: Smooth 100ms updates
  progressBar.appendChild(progressFill);
  progressContainer.appendChild(progressLabel);
  progressContainer.appendChild(progressBar);
  progressContainer.id = "chainProgressContainer"; // Phase 11.3.2: For visibility control
  progressContainer.style.display = "none"; // Phase 11.3.2: Hidden by default
  chainSection.appendChild(progressContainer);

  // Start/Stop buttons
  const btnRow = document.createElement("div");
  btnRow.style.display = "flex";
  btnRow.style.gap = "8px";
  btnRow.style.marginBottom = "8px";
  const startBtn = document.createElement("button");
  startBtn.id = "chainStartBtn"; // Phase 11.3.2: For button state management
  startBtn.textContent = "Start Chain";
  startBtn.style.cssText = 'flex: 1; padding: 6px; background: #00ff00; color: black; border: none; cursor: pointer; font-weight: bold; font-size: 11px;';
  const stopBtn = document.createElement("button");
  stopBtn.id = "chainStopBtn"; // Phase 11.3.2: For button state management
  stopBtn.textContent = "Stop";
  stopBtn.style.cssText = 'flex: 1; padding: 6px; background: #ff6666; color: black; border: none; cursor: pointer; font-weight: bold; font-size: 11px;';
  stopBtn.disabled = true; // Phase 11.3.2: Disabled by default
  stopBtn.style.opacity = "0.5";
  stopBtn.style.cursor = "not-allowed";

  // Phase 11.4.1 Prep: Reset Chain button
  const resetChainBtn = document.createElement("button");
  resetChainBtn.id = "chainResetBtn";
  resetChainBtn.textContent = "🔄";
  resetChainBtn.title = "Reset Chain";
  resetChainBtn.style.cssText = 'flex: 0.5; padding: 6px; background: #ffaa00; color: black; border: none; cursor: pointer; font-weight: bold; font-size: 11px;';

  btnRow.appendChild(startBtn);
  btnRow.appendChild(stopBtn);
  btnRow.appendChild(resetChainBtn);
  chainSection.appendChild(btnRow);

  // Phase 11.4.0: Playback controls (pause/resume, skip)
  const playbackRow = document.createElement("div");
  playbackRow.style.cssText = 'display: flex; gap: 5px; margin-bottom: 8px;';

  const pauseResumeBtn = document.createElement("button");
  pauseResumeBtn.id = "chainPauseResumeBtn";
  pauseResumeBtn.textContent = "⏸ Pause";
  pauseResumeBtn.style.cssText = 'flex: 2; padding: 6px; background: #ffaa00; color: black; border: none; cursor: pointer; font-weight: bold; font-size: 11px;';
  pauseResumeBtn.disabled = true;
  pauseResumeBtn.style.opacity = "0.5";
  pauseResumeBtn.style.cursor = "not-allowed";

  const skipPrevBtn = document.createElement("button");
  skipPrevBtn.id = "chainSkipPrevBtn";
  skipPrevBtn.textContent = "⏮";
  skipPrevBtn.style.cssText = 'flex: 1; padding: 6px; background: #6699ff; color: white; border: none; cursor: pointer; font-weight: bold; font-size: 11px;';
  skipPrevBtn.disabled = true;
  skipPrevBtn.style.opacity = "0.5";
  skipPrevBtn.style.cursor = "not-allowed";

  const skipNextBtn = document.createElement("button");
  skipNextBtn.id = "chainSkipNextBtn";
  skipNextBtn.textContent = "⏭";
  skipNextBtn.style.cssText = 'flex: 1; padding: 6px; background: #6699ff; color: white; border: none; cursor: pointer; font-weight: bold; font-size: 11px;';
  skipNextBtn.disabled = true;
  skipNextBtn.style.opacity = "0.5";
  skipNextBtn.style.cursor = "not-allowed";

  playbackRow.appendChild(skipPrevBtn);
  playbackRow.appendChild(pauseResumeBtn);
  playbackRow.appendChild(skipNextBtn);
  chainSection.appendChild(playbackRow);

  // Phase 11.4.0: Time remaining display
  const timeRemainingLabel = document.createElement("div");
  timeRemainingLabel.id = "chainTimeRemaining";
  timeRemainingLabel.textContent = "Remaining: --";
  timeRemainingLabel.style.cssText = 'font-size: 10px; color: #aaa; margin-bottom: 8px; text-align: center;';
  chainSection.appendChild(timeRemainingLabel);

  // Phase 11.3.1: Save chain section
  const saveChainRow = document.createElement("div");
  saveChainRow.style.display = "flex";
  saveChainRow.style.gap = "5px";
  saveChainRow.style.marginBottom = "8px";
  const saveChainInput = document.createElement("input");
  saveChainInput.type = "text";
  saveChainInput.placeholder = "Chain name...";
  saveChainInput.style.cssText = 'flex: 1; padding: 4px; background: #333; color: white; border: 1px solid #555; font-size: 10px;';
  const saveChainBtn = document.createElement("button");
  saveChainBtn.textContent = "💾 Save Chain";
  saveChainBtn.style.cssText = 'padding: 4px 8px; background: #ff9900; color: black; border: none; cursor: pointer; font-weight: bold; font-size: 10px;';
  saveChainRow.appendChild(saveChainInput);
  saveChainRow.appendChild(saveChainBtn);
  chainSection.appendChild(saveChainRow);

  // Phase 11.3.1: Saved chains list
  const savedChainsHeader = document.createElement("div");
  savedChainsHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;';

  const savedChainsTitle = document.createElement("div");
  savedChainsTitle.textContent = "Saved Chains:";
  savedChainsTitle.style.cssText = 'font-size: 10px; color: #aaa;';

  // Phase 11.4.0: Export/Import buttons
  const chainIORow = document.createElement("div");
  chainIORow.style.cssText = 'display: flex; gap: 5px;';

  const exportChainsBtn = document.createElement("button");
  exportChainsBtn.id = "exportChainsBtn";
  exportChainsBtn.textContent = "💾";
  exportChainsBtn.title = "Export chains";
  exportChainsBtn.style.cssText = 'padding: 2px 6px; background: #4CAF50; color: white; border: none; cursor: pointer; font-size: 10px; border-radius: 3px;';

  const importChainsBtn = document.createElement("button");
  importChainsBtn.id = "importChainsBtn";
  importChainsBtn.textContent = "📂";
  importChainsBtn.title = "Import chains";
  importChainsBtn.style.cssText = 'padding: 2px 6px; background: #2196F3; color: white; border: none; cursor: pointer; font-size: 10px; border-radius: 3px;';

  const importChainsInput = document.createElement("input");
  importChainsInput.type = "file";
  importChainsInput.id = "importChainsInput";
  importChainsInput.accept = ".json";
  importChainsInput.style.display = "none";

  chainIORow.appendChild(exportChainsBtn);
  chainIORow.appendChild(importChainsBtn);
  chainIORow.appendChild(importChainsInput);

  savedChainsHeader.appendChild(savedChainsTitle);
  savedChainsHeader.appendChild(chainIORow);
  chainSection.appendChild(savedChainsHeader);

  const savedChainsList = document.createElement("div");
  savedChainsList.id = "savedChainsList";
  savedChainsList.style.cssText = 'max-height: 100px; overflow-y: auto; background: #222; border: 1px solid #555; padding: 5px; margin-bottom: 8px;';
  chainSection.appendChild(savedChainsList);

  // Phase 11.4.1: Reset button
  const resetBtn = document.createElement('button');
  resetBtn.textContent = '♻️ Reset';
  resetBtn.style.cssText = 'width: 100%; margin-top: 8px; background: #222; color: #fff; border: 1px solid #444; padding: 6px; cursor: pointer; font-size: 11px; font-weight: bold;';
  resetBtn.addEventListener('click', () => {
    console.log("♻️ HUD reset clicked");
    notifyHUDUpdate({ type: 'app:reset' });
  });
  chainSection.appendChild(resetBtn);

  parentContainer.appendChild(chainSection);

  // Populate the checkbox list from current presets
  function refreshChainList() {
    chainList.innerHTML = "";
    const names = window.__PRESET_NAMES__ ? window.__PRESET_NAMES__() : [];
    if (names.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.textContent = "No presets available";
      emptyMsg.style.cssText = 'color: #888; font-size: 10px; padding: 5px;';
      chainList.appendChild(emptyMsg);
      return;
    }
    names.forEach(name => {
      const row = document.createElement("label");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "6px";
      row.style.cursor = "pointer";
      row.style.fontSize = "10px";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.value = name;
      row.appendChild(cb);
      row.appendChild(document.createTextNode(name));
      chainList.appendChild(row);
    });
  }

  // Phase 11.3.1: Refresh saved chains list
  function refreshSavedChainsList() {
    savedChainsList.innerHTML = "";
    // Import listChains dynamically to avoid circular dependency
    import('./presetRouter.js').then(({ listChains, getChainData }) => {
      const chainNames = listChains();
      if (chainNames.length === 0) {
        const emptyMsg = document.createElement("div");
        emptyMsg.textContent = "No saved chains";
        emptyMsg.style.cssText = 'color: #888; font-size: 9px; padding: 3px;';
        savedChainsList.appendChild(emptyMsg);
        return;
      }
      chainNames.forEach(name => {
        const chainData = getChainData(name);
        const row = document.createElement("div");
        row.style.cssText = 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; font-size: 9px;';

        const nameSpan = document.createElement("span");
        nameSpan.textContent = `${name} (${chainData.presets.length})`;
        nameSpan.style.cssText = 'flex: 1; color: #ccc;';
        nameSpan.title = `Presets: ${chainData.presets.join(", ")}\nDuration: ${chainData.duration}ms\nLoop: ${chainData.loop}\nShuffle: ${chainData.shuffle}`;

        const loadBtn = document.createElement("button");
        loadBtn.textContent = "Load";
        loadBtn.style.cssText = 'padding: 2px 6px; background: #00aaff; color: white; border: none; cursor: pointer; font-size: 8px; margin-right: 3px;';
        loadBtn.addEventListener("click", () => {
          console.log("🔗 Loading chain:", name);
          notifyHUDUpdate({ presetAction: "chain:load", chainName: name });
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "×";
        deleteBtn.style.cssText = 'padding: 2px 6px; background: #ff6666; color: white; border: none; cursor: pointer; font-size: 8px;';
        deleteBtn.addEventListener("click", () => {
          if (confirm(`Delete chain "${name}"?`)) {
            console.log("🔗 Deleting chain:", name);
            notifyHUDUpdate({ presetAction: "chain:delete", chainName: name });
            refreshSavedChainsList();
          }
        });

        row.appendChild(nameSpan);
        row.appendChild(loadBtn);
        row.appendChild(deleteBtn);
        savedChainsList.appendChild(row);
      });
    });
  }

  // Wire buttons
  startBtn.addEventListener("click", () => {
    const selected = [...chainList.querySelectorAll("input[type=checkbox]:checked")].map(x => x.value);

    // Phase 11.3.2: Validate preset selection
    if (selected.length === 0) {
      alert("⚠️ No presets selected. Please select at least one preset before starting a chain.");
      return;
    }

    const duration = Number(durInput.value) || 2000;
    const loop = loopCheckbox.checked;
    const shuffle = shuffleCheckbox.checked;
    console.log("🔗 HUD start chain:", selected, duration, { loop, shuffle });
    notifyHUDUpdate({
      presetAction: "chain:start",
      chainPresets: selected,
      chainDuration: duration,
      chainLoop: loop,
      chainShuffle: shuffle
    });
  });
  stopBtn.addEventListener("click", () => {
    console.log("🔗 HUD stop chain");
    notifyHUDUpdate({ presetAction: "chain:stop" });
  });

  // Phase 11.4.1 Prep: Reset Chain button
  resetChainBtn.addEventListener("click", () => {
    console.log("🔄 HUD reset chain");
    notifyHUDUpdate({ presetAction: "chain:reset" });
  });

  // Phase 11.4.0: Playback control buttons
  pauseResumeBtn.addEventListener("click", () => {
    const isPaused = pauseResumeBtn.textContent.includes("Resume");
    if (isPaused) {
      console.log("▶️ HUD resume chain");
      notifyHUDUpdate({ presetAction: "chain:resume" });
    } else {
      console.log("⏸ HUD pause chain");
      notifyHUDUpdate({ presetAction: "chain:pause" });
    }
  });

  skipPrevBtn.addEventListener("click", () => {
    console.log("⏮ HUD skip to previous preset");
    notifyHUDUpdate({ presetAction: "chain:skipPrev" });
  });

  skipNextBtn.addEventListener("click", () => {
    console.log("⏭ HUD skip to next preset");
    notifyHUDUpdate({ presetAction: "chain:skipNext" });
  });

  // Phase 11.4.0: Export/Import chains buttons
  exportChainsBtn.addEventListener("click", () => {
    console.log("💾 HUD export chains");
    notifyHUDUpdate({ presetAction: "chain:export" });
  });

  importChainsBtn.addEventListener("click", () => {
    importChainsInput.click();
  });

  importChainsInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("📂 HUD import chains:", file.name);
      notifyHUDUpdate({ presetAction: "chain:import", file });
      // Reset input so same file can be imported again
      importChainsInput.value = "";
    }
  });

  // Phase 11.3.1: Save chain button
  saveChainBtn.addEventListener("click", () => {
    const chainName = saveChainInput.value.trim();
    if (!chainName) {
      console.warn("🔗 Chain name is empty");
      return;
    }
    const selected = [...chainList.querySelectorAll("input[type=checkbox]:checked")].map(x => x.value);
    if (selected.length < 2) {
      console.warn("🔗 Need at least 2 presets to save a chain");
      return;
    }
    const duration = Number(durInput.value) || 2000;
    const loop = loopCheckbox.checked;
    const shuffle = shuffleCheckbox.checked;
    console.log("🔗 HUD save chain:", chainName, selected, { duration, loop, shuffle });
    notifyHUDUpdate({
      presetAction: "chain:save",
      chainName: chainName,
      chainPresets: selected,
      chainDuration: duration,
      chainLoop: loop,
      chainShuffle: shuffle
    });
    saveChainInput.value = "";
    setTimeout(refreshSavedChainsList, 100);
  });

  // Phase 11.3.2: Update progress indicator with continuous interpolation tracking
  // Phase 11.4.3: Added defensive guard for state.morphChain
  function updateChainProgress() {
    const progressContainer = document.getElementById("chainProgressContainer");
    const progressLabel = document.getElementById("chainProgressLabel");
    const progressFill = document.getElementById("chainProgressFill");
    const statusBadge = document.getElementById("chainStatusBadge");

    if (!progressLabel || !progressFill || !progressContainer || !statusBadge) return;

    const chain = state.morphChain;

    // Phase 11.4.3: Defensive guard - bail early if no chain or not active
    if (!chain || !chain.active) {
      // Hide progress container when not running
      progressContainer.style.display = "none";
      progressLabel.textContent = "Step —";
      progressFill.style.width = "0%";

      // Update status badge
      statusBadge.textContent = "⏹ Stopped";
      statusBadge.style.background = "#333";
      statusBadge.style.color = "#888";

      // Phase 11.3.2: Update button states
      const startBtn = document.querySelector('#chainStartBtn');
      const stopBtn = document.querySelector('#chainStopBtn');
      if (startBtn && stopBtn) {
        startBtn.disabled = false;
        startBtn.style.opacity = "1";
        startBtn.style.cursor = "pointer";

        stopBtn.disabled = true;
        stopBtn.style.opacity = "0.5";
        stopBtn.style.cursor = "not-allowed";
      }
      return;
    }

    // Phase 11.4.3: Safe to use chain properties after guard
    const { currentIndex, presets, duration, stepStartTime } = chain;
    const totalSteps = presets.length;

    if (!presets || totalSteps === 0) {
      progressContainer.style.display = "none";
      return;
    }

    // Time since this step began
    const elapsed = performance.now() - (stepStartTime || performance.now());
    const t = Math.min(elapsed / duration, 1.0);

    // Overall progress = finished steps + current interpolation progress
    const progress = (currentIndex + t) / totalSteps;

    const percent = Math.round(progress * 100);
    const step = Math.min(currentIndex + 1, totalSteps);

    // ✅ No variable shadowing — directly modify DOM elements
    progressFill.style.width = `${percent}%`;
    progressLabel.textContent = `Step ${step}/${totalSteps} (${percent}%)`;
    progressContainer.style.display = "block";

    // Update status badge
    statusBadge.textContent = "🟢 Running";
    statusBadge.style.background = "#004400";
    statusBadge.style.color = "#00ff00";

    // Phase 11.3.2: Update button states
    const startBtn = document.querySelector('#chainStartBtn');
    const stopBtn = document.querySelector('#chainStopBtn');
    if (startBtn && stopBtn) {
      startBtn.disabled = true;
      startBtn.style.opacity = "0.5";
      startBtn.style.cursor = "not-allowed";

      stopBtn.disabled = false;
      stopBtn.style.opacity = "1";
      stopBtn.style.cursor = "pointer";
    }
  }

  // Phase 11.3.2: Toast notification system
  const toastContainer = document.createElement("div");
  toastContainer.id = "chainToastContainer";
  toastContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 10px; pointer-events: none;';
  document.body.appendChild(toastContainer);

  // Phase 11.5.0: Reduced toast duration to 1.5s
  function showToast(message, duration = 1500) {
    const toast = document.createElement("div");
    toast.style.cssText = 'background: rgba(0, 0, 0, 0.9); color: white; padding: 12px 16px; border-radius: 4px; border-left: 4px solid #ff9900; font-size: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); max-width: 300px; pointer-events: auto; animation: slideInRight 0.3s ease;';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Add CSS animation for toast
  const toastStyle = document.createElement('style');
  toastStyle.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(toastStyle);

  // Phase 11.3.2: Listen for chain events and show toasts
  window.addEventListener("chainStarted", (e) => {
    const { presets } = e.detail;
    showToast(`🔗 Chain started: ${presets.join(" → ")}`);
  });

  window.addEventListener("chainStepComplete", (e) => {
    const { next } = e.detail;
    showToast(`✅ Step complete → Next: ${next}`);
  });

  window.addEventListener("chainLoopRestarted", () => {
    showToast("🔁 Loop restarted");
  });

  window.addEventListener("chainFinished", () => {
    showToast("🔗 Chain finished");
  });

  // Phase 11.4.0: Update UI state on chain events
  window.addEventListener("chainStarted", () => {
    // Enable playback controls
    pauseResumeBtn.disabled = false;
    pauseResumeBtn.style.opacity = "1";
    pauseResumeBtn.style.cursor = "pointer";
    pauseResumeBtn.textContent = "⏸ Pause";

    skipPrevBtn.disabled = false;
    skipPrevBtn.style.opacity = "1";
    skipPrevBtn.style.cursor = "pointer";

    skipNextBtn.disabled = false;
    skipNextBtn.style.opacity = "1";
    skipNextBtn.style.cursor = "pointer";

    // Enable stop and reset buttons
    stopBtn.disabled = false;
    stopBtn.style.opacity = "1";
    stopBtn.style.cursor = "pointer";

    resetChainBtn.disabled = false;
    resetChainBtn.style.opacity = "1";
    resetChainBtn.style.cursor = "pointer";

    // Disable start button
    startBtn.disabled = true;
    startBtn.style.opacity = "0.5";
    startBtn.style.cursor = "not-allowed";
  });

  window.addEventListener("chainFinished", () => {
    // Disable playback controls
    pauseResumeBtn.disabled = true;
    pauseResumeBtn.style.opacity = "0.5";
    pauseResumeBtn.style.cursor = "not-allowed";
    pauseResumeBtn.textContent = "⏸ Pause";

    skipPrevBtn.disabled = true;
    skipPrevBtn.style.opacity = "0.5";
    skipPrevBtn.style.cursor = "not-allowed";

    skipNextBtn.disabled = true;
    skipNextBtn.style.opacity = "0.5";
    skipNextBtn.style.cursor = "not-allowed";

    // Disable stop and reset buttons
    stopBtn.disabled = true;
    stopBtn.style.opacity = "0.5";
    stopBtn.style.cursor = "not-allowed";

    resetChainBtn.disabled = true;
    resetChainBtn.style.opacity = "0.5";
    resetChainBtn.style.cursor = "not-allowed";

    // Enable start button
    startBtn.disabled = false;
    startBtn.style.opacity = "1";
    startBtn.style.cursor = "pointer";

    // Clear time remaining
    timeRemainingLabel.textContent = "Remaining: --";
  });

  window.addEventListener("chainPaused", () => {
    pauseResumeBtn.textContent = "▶️ Resume";
    showToast("⏸ Chain paused");
  });

  window.addEventListener("chainResumed", () => {
    pauseResumeBtn.textContent = "⏸ Pause";
    showToast("▶️ Chain resumed");
  });

  window.addEventListener("chainSkipped", (e) => {
    const { direction, preset } = e.detail;
    const emoji = direction === 'next' ? '⏭' : '⏮';
    showToast(`${emoji} Skipped → ${preset}`);
  });

  // Phase 11.4.1: Chain reset and stopped events
  window.addEventListener("chainReset", () => {
    showToast("♻️ Chain reset to start");

    // Disable all playback controls
    pauseResumeBtn.disabled = true;
    pauseResumeBtn.style.opacity = "0.5";
    pauseResumeBtn.style.cursor = "not-allowed";
    pauseResumeBtn.textContent = "⏸ Pause";

    skipPrevBtn.disabled = true;
    skipPrevBtn.style.opacity = "0.5";
    skipPrevBtn.style.cursor = "not-allowed";

    skipNextBtn.disabled = true;
    skipNextBtn.style.opacity = "0.5";
    skipNextBtn.style.cursor = "not-allowed";

    stopBtn.disabled = true;
    stopBtn.style.opacity = "0.5";
    stopBtn.style.cursor = "not-allowed";

    resetChainBtn.disabled = true;
    resetChainBtn.style.opacity = "0.5";
    resetChainBtn.style.cursor = "not-allowed";

    // Enable start button
    startBtn.disabled = false;
    startBtn.style.opacity = "1";
    startBtn.style.cursor = "pointer";
  });

  window.addEventListener("chainStopped", () => {
    showToast("⏹ Chain stopped");

    // Disable all playback controls (same as chainFinished)
    pauseResumeBtn.disabled = true;
    pauseResumeBtn.style.opacity = "0.5";
    pauseResumeBtn.style.cursor = "not-allowed";
    pauseResumeBtn.textContent = "⏸ Pause";

    skipPrevBtn.disabled = true;
    skipPrevBtn.style.opacity = "0.5";
    skipPrevBtn.style.cursor = "not-allowed";

    skipNextBtn.disabled = true;
    skipNextBtn.style.opacity = "0.5";
    skipNextBtn.style.cursor = "not-allowed";

    stopBtn.disabled = true;
    stopBtn.style.opacity = "0.5";
    stopBtn.style.cursor = "not-allowed";

    resetChainBtn.disabled = true;
    resetChainBtn.style.opacity = "0.5";
    resetChainBtn.style.cursor = "not-allowed";

    // Enable start button
    startBtn.disabled = false;
    startBtn.style.opacity = "1";
    startBtn.style.cursor = "pointer";

    // Clear progress and time
    timeRemainingLabel.textContent = "Remaining: --";
  });

  // Phase 11.4.0: Update time remaining display (every 100ms)
  let timeRemainingInterval = null;

  window.addEventListener("chainStarted", () => {
    if (timeRemainingInterval) clearInterval(timeRemainingInterval);

    timeRemainingInterval = setInterval(() => {
      import('./presetRouter.js').then(({ getChainProgress }) => {
        const progress = getChainProgress();
        if (progress) {
          const remainingMs = progress.timeRemaining;
          const minutes = Math.floor(remainingMs / 60000);
          const seconds = Math.floor((remainingMs % 60000) / 1000);
          timeRemainingLabel.textContent = `Remaining: ${minutes}m ${seconds}s`;
        } else {
          timeRemainingLabel.textContent = "Remaining: --";
          if (timeRemainingInterval) {
            clearInterval(timeRemainingInterval);
            timeRemainingInterval = null;
          }
        }
      });
    }, 100);
  });

  window.addEventListener("chainFinished", () => {
    if (timeRemainingInterval) {
      clearInterval(timeRemainingInterval);
      timeRemainingInterval = null;
    }
  });

  // Phase 11.4.1: Listen for smooth progress updates from presetRouter
  window.addEventListener("chainProgress", (e) => {
    const { step, total, percent, remaining } = e.detail;
    const progressFill = document.getElementById("chainProgressFill");
    const progressLabel = document.getElementById("chainProgressLabel");
    const progressContainer = document.getElementById("chainProgressContainer");

    if (progressFill && progressLabel && progressContainer) {
      // Update progress bar width
      progressFill.style.width = `${percent}%`;

      // Update label with step/total, percent, and time remaining
      progressLabel.textContent = `Step ${step}/${total} (${percent}%) — Remaining: ${remaining}s`;

      // Ensure container is visible
      progressContainer.style.display = "block";
    }
  });

  // Update progress every 100ms
  setInterval(updateChainProgress, 100);

  // Initial populate + whenever presets change, call refreshChainList()
  refreshChainList();
  refreshSavedChainsList();
  document.addEventListener("presetsImported", refreshChainList);
  document.addEventListener("presetSaved", refreshChainList);
  document.addEventListener("presetDeleted", refreshChainList);

  // Phase 11.2.5: Import/Export buttons
  const importExportContainer = document.createElement('div');
  importExportContainer.style.cssText = 'display: flex; gap: 5px; margin-bottom: 10px;';

  const exportButton = document.createElement('button');
  exportButton.textContent = '📥 Export';
  exportButton.style.cssText = 'flex: 1; padding: 6px; background: #00aa00; color: white; border: none; cursor: pointer; border-radius: 3px; font-size: 11px;';
  exportButton.title = 'Export all presets as JSON file';

  const importButton = document.createElement('button');
  importButton.textContent = '📤 Import';
  importButton.style.cssText = 'flex: 1; padding: 6px; background: #aa00aa; color: white; border: none; cursor: pointer; border-radius: 3px; font-size: 11px;';
  importButton.title = 'Import presets from JSON file';

  // Hidden file input for import
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json,application/json';
  fileInput.style.display = 'none';

  exportButton.addEventListener('click', () => {
    notifyHUDUpdate({ presetAction: 'export' });
  });

  importButton.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      notifyHUDUpdate({ presetAction: 'import', file: file });
      fileInput.value = ''; // Reset input
    }
  });

  importExportContainer.appendChild(exportButton);
  importExportContainer.appendChild(importButton);
  importExportContainer.appendChild(fileInput);
  parentContainer.appendChild(importExportContainer);

  // Phase 11.2.6: Filter event listeners
  categoryFilter.addEventListener('change', () => {
    import('./presets.js').then(({ listPresets }) => {
      updatePresetList(listPresets());
    });
  });

  tagFilter.addEventListener('input', () => {
    import('./presets.js').then(({ listPresets }) => {
      updatePresetList(listPresets());
    });
  });

  // Phase 11.2.7: Search event listener
  searchInput.addEventListener('input', () => {
    import('./presets.js').then(({ listPresets }) => {
      updatePresetList(listPresets());
    });
  });

  console.log("💾 Presets HUD section created");
}

// Phase 13.4.2: Removed registerHUDCallback to fix circular dependency
