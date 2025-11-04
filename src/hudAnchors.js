console.log("⚓ hudAnchors.js loaded");

/**
 * MMPA Anchor HUD Interface - Phase 5
 *
 * UI for creating, managing, and recalling Anchors.
 * This is where personal memory becomes tangible and actionable.
 */

import {
  createAnchor,
  loadAnchor,
  updateAnchor,
  deleteAnchor,
  getAllAnchors,
  exportAnchor,
  exportAllAnchors,
  importAnchor
} from './anchorSystem.js';
import { shareAnchor, checkServerStatus } from './communityAPI.js';
import {
  morphToAnchor,
  isMorphingActive,
  getMorphInfo,
  stopMorph,
  startAutoMorph,
  stopAutoMorph,
  isAutoMorphingActive,
  getAutoMorphConfig,
  updateAutoMorphConfig
} from './anchorMorphing.js';

/**
 * Create Anchor HUD section
 */
export function createAnchorsHudSection(container) {
  const section = document.createElement('div');
  section.className = 'hud-section mmpa-anchors';
  section.style.borderLeft = '3px solid #ffaa00'; // Orange accent for memory

  // Title
  const title = document.createElement('h3');
  title.textContent = '⚓ Anchors (Memory)';
  title.style.color = '#ffaa00';
  section.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Save moments of resonance';
  subtitle.style.fontSize = '12px';
  subtitle.style.color = '#888';
  subtitle.style.marginBottom = '12px';
  section.appendChild(subtitle);

  // Create Anchor Button
  const createButton = document.createElement('button');
  createButton.textContent = '+ Create New Anchor';
  createButton.style.width = '100%';
  createButton.style.padding = '10px';
  createButton.style.marginBottom = '12px';
  createButton.style.backgroundColor = '#ffaa00';
  createButton.style.color = '#000';
  createButton.style.border = 'none';
  createButton.style.borderRadius = '5px';
  createButton.style.cursor = 'pointer';
  createButton.style.fontWeight = 'bold';

  createButton.addEventListener('click', () => {
    showCreateAnchorDialog();
  });

  section.appendChild(createButton);

  // Auto-Morph Toggle Button
  const autoMorphButton = document.createElement('button');
  autoMorphButton.id = 'auto-morph-toggle';
  autoMorphButton.textContent = '✨ Start Auto-Morph';
  autoMorphButton.style.width = '100%';
  autoMorphButton.style.padding = '10px';
  autoMorphButton.style.marginBottom = '12px';
  autoMorphButton.style.backgroundColor = '#333';
  autoMorphButton.style.color = '#aa00ff';
  autoMorphButton.style.border = '2px solid #aa00ff';
  autoMorphButton.style.borderRadius = '5px';
  autoMorphButton.style.cursor = 'pointer';
  autoMorphButton.style.fontWeight = 'bold';

  autoMorphButton.addEventListener('click', () => {
    if (isAutoMorphingActive()) {
      stopAutoMorph();
      autoMorphButton.textContent = '✨ Start Auto-Morph';
      autoMorphButton.style.backgroundColor = '#333';
      autoMorphButton.style.color = '#aa00ff';
    } else {
      const anchors = getAllAnchors();
      if (anchors.length < 2) {
        alert('Create at least 2 anchors to use Auto-Morph mode!');
        return;
      }

      // Show config dialog
      showAutoMorphConfigDialog();
    }
  });

  section.appendChild(autoMorphButton);

  // Update button state periodically
  setInterval(() => {
    if (isAutoMorphingActive() && autoMorphButton.textContent !== '⏸️ Stop Auto-Morph') {
      autoMorphButton.textContent = '⏸️ Stop Auto-Morph';
      autoMorphButton.style.backgroundColor = '#aa00ff';
      autoMorphButton.style.color = '#000';
    }
  }, 500);

  // Import/Export Buttons
  const ioContainer = document.createElement('div');
  ioContainer.style.display = 'flex';
  ioContainer.style.gap = '8px';
  ioContainer.style.marginBottom = '16px';

  const importButton = document.createElement('button');
  importButton.textContent = '📥 Import';
  importButton.style.flex = '1';
  importButton.style.padding = '8px';
  importButton.style.backgroundColor = '#333';
  importButton.style.color = '#fff';
  importButton.style.border = '1px solid #555';
  importButton.style.borderRadius = '3px';
  importButton.style.cursor = 'pointer';
  importButton.addEventListener('click', () => {
    showImportDialog();
  });

  const exportButton = document.createElement('button');
  exportButton.textContent = '📤 Export All';
  exportButton.style.flex = '1';
  exportButton.style.padding = '8px';
  exportButton.style.backgroundColor = '#333';
  exportButton.style.color = '#fff';
  exportButton.style.border = '1px solid #555';
  exportButton.style.borderRadius = '3px';
  exportButton.style.cursor = 'pointer';
  exportButton.addEventListener('click', () => {
    exportAllAnchorsToFile();
  });

  ioContainer.appendChild(importButton);
  ioContainer.appendChild(exportButton);
  section.appendChild(ioContainer);

  // Morphing Status Indicator
  const morphStatus = document.createElement('div');
  morphStatus.id = 'morph-status';
  morphStatus.style.display = 'none'; // Hidden by default
  morphStatus.style.marginTop = '12px';
  morphStatus.style.padding = '12px';
  morphStatus.style.backgroundColor = '#1a0a2e';
  morphStatus.style.border = '2px solid #aa00ff';
  morphStatus.style.borderRadius = '5px';
  section.appendChild(morphStatus);

  // Start morphing status update loop
  startMorphStatusUpdater(morphStatus);

  // Divider
  const divider = document.createElement('hr');
  divider.style.border = 'none';
  divider.style.borderTop = '1px solid #333';
  divider.style.margin = '16px 0';
  section.appendChild(divider);

  // Anchor List
  const listTitle = document.createElement('h4');
  listTitle.textContent = 'Saved Anchors';
  listTitle.style.color = '#aaa';
  listTitle.style.marginBottom = '8px';
  section.appendChild(listTitle);

  const anchorList = document.createElement('div');
  anchorList.className = 'anchor-list';
  section.appendChild(anchorList);

  // Render initial list
  renderAnchorList(anchorList);

  container.appendChild(section);
  return section;
}

/**
 * Render the list of anchors
 */
function renderAnchorList(listContainer) {
  listContainer.innerHTML = '';

  const anchors = getAllAnchors();

  if (anchors.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No anchors saved yet';
    emptyMessage.style.color = '#666';
    emptyMessage.style.fontStyle = 'italic';
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.padding = '20px';
    listContainer.appendChild(emptyMessage);
    return;
  }

  // Sort by timestamp (newest first)
  const sortedAnchors = [...anchors].sort((a, b) => b.timestamp - a.timestamp);

  sortedAnchors.forEach(anchor => {
    const anchorItem = createAnchorListItem(anchor, listContainer);
    listContainer.appendChild(anchorItem);
  });
}

/**
 * Create a single anchor list item
 */
function createAnchorListItem(anchor, listContainer) {
  const item = document.createElement('div');
  item.className = 'anchor-item';
  item.style.backgroundColor = '#1a1a1a';
  item.style.padding = '12px';
  item.style.marginBottom = '8px';
  item.style.borderRadius = '5px';
  item.style.border = '1px solid #333';

  // Anchor name
  const name = document.createElement('div');
  name.textContent = anchor.name;
  name.style.fontWeight = 'bold';
  name.style.color = '#ffaa00';
  name.style.marginBottom = '4px';
  item.appendChild(name);

  // Timestamp
  const timestamp = document.createElement('div');
  timestamp.textContent = new Date(anchor.timestamp).toLocaleString();
  timestamp.style.fontSize = '11px';
  timestamp.style.color = '#666';
  timestamp.style.marginBottom = '8px';
  item.appendChild(timestamp);

  // Description (if any)
  if (anchor.description) {
    const desc = document.createElement('div');
    desc.textContent = anchor.description;
    desc.style.fontSize = '12px';
    desc.style.color = '#aaa';
    desc.style.marginBottom = '8px';
    item.appendChild(desc);
  }

  // Tags (if any)
  if (anchor.tags && anchor.tags.length > 0) {
    const tagsContainer = document.createElement('div');
    tagsContainer.style.marginBottom = '8px';

    anchor.tags.forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.textContent = tag;
      tagSpan.style.display = 'inline-block';
      tagSpan.style.backgroundColor = '#333';
      tagSpan.style.color = '#ffaa00';
      tagSpan.style.padding = '2px 8px';
      tagSpan.style.marginRight = '4px';
      tagSpan.style.borderRadius = '3px';
      tagSpan.style.fontSize = '10px';
      tagsContainer.appendChild(tagSpan);
    });

    item.appendChild(tagsContainer);
  }

  // Action buttons
  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '4px';

  const loadBtn = createActionButton('Load', '#00aa00', () => {
    loadAnchor(anchor.id);
    alert(`Loaded anchor: ${anchor.name}`);
  });

  const morphBtn = createActionButton('Morph', '#aa00ff', () => {
    showMorphDialog(anchor);
  });

  const shareBtn = createActionButton('Share', '#00aa88', async () => {
    const serverOnline = await checkServerStatus();
    if (!serverOnline) {
      alert('Ecosystem server offline!\n\nTo start it:\n1. Open terminal\n2. cd ecosystem-server\n3. npm start');
      return;
    }

    try {
      await shareAnchor(anchor);
      alert(`✨ "${anchor.name}" shared to community!`);
    } catch (error) {
      alert(`Failed to share: ${error.message}`);
    }
  });

  const exportBtn = createActionButton('Export', '#0088ff', () => {
    exportAnchorToFile(anchor);
  });

  const deleteBtn = createActionButton('Delete', '#ff4444', () => {
    if (confirm(`Delete anchor "${anchor.name}"?`)) {
      deleteAnchor(anchor.id);
      renderAnchorList(listContainer);
    }
  });

  actions.appendChild(loadBtn);
  actions.appendChild(morphBtn);
  actions.appendChild(shareBtn);
  actions.appendChild(exportBtn);
  actions.appendChild(deleteBtn);
  item.appendChild(actions);

  return item;
}

/**
 * Create action button
 */
function createActionButton(label, color, onClick) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.style.flex = '1';
  btn.style.padding = '6px';
  btn.style.backgroundColor = color;
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '3px';
  btn.style.cursor = 'pointer';
  btn.style.fontSize = '11px';
  btn.addEventListener('click', onClick);
  return btn;
}

/**
 * Show create anchor dialog
 */
function showCreateAnchorDialog() {
  const name = prompt('Anchor Name:', `Moment ${getAllAnchors().length + 1}`);
  if (!name) return;

  const description = prompt('Description (optional):', '');
  const tagsInput = prompt('Tags (comma-separated, optional):', '');
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

  const anchor = createAnchor(name, description, tags);
  alert(`Anchor created: ${anchor.name}`);

  // Refresh list
  const listContainer = document.querySelector('.anchor-list');
  if (listContainer) {
    renderAnchorList(listContainer);
  }
}

/**
 * Export single anchor to file
 */
function exportAnchorToFile(anchor) {
  const json = exportAnchor(anchor.id);
  if (!json) return;

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `anchor_${anchor.name.replace(/[^a-z0-9]/gi, '_')}.json`;
  a.click();
  URL.revokeObjectURL(url);

  console.log(`⚓ Exported anchor: ${anchor.name}`);
}

/**
 * Export all anchors to file
 */
function exportAllAnchorsToFile() {
  const json = exportAllAnchors();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mmpa_anchors_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  console.log('⚓ Exported all anchors');
}

/**
 * Show import dialog
 */
function showImportDialog() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const anchor = importAnchor(event.target.result);
        if (anchor) {
          alert(`Imported anchor: ${anchor.name}`);

          // Refresh list
          const listContainer = document.querySelector('.anchor-list');
          if (listContainer) {
            renderAnchorList(listContainer);
          }
        } else {
          alert('Failed to import anchor. Invalid format.');
        }
      } catch (error) {
        alert(`Import failed: ${error.message}`);
      }
    };
    reader.readAsText(file);
  });

  input.click();
}

/**
 * Show morph dialog - select target anchor and morph settings
 */
function showMorphDialog(sourceAnchor) {
  const anchors = getAllAnchors();
  const otherAnchors = anchors.filter(a => a.id !== sourceAnchor.id);

  if (otherAnchors.length === 0) {
    alert('Create at least one more anchor to morph to!');
    return;
  }

  // Build anchor options string
  const anchorOptions = otherAnchors
    .map((a, idx) => `${idx + 1}. ${a.name}`)
    .join('\n');

  const choice = prompt(
    `🌀 Morph to which anchor?\n\n${anchorOptions}\n\nEnter number (1-${otherAnchors.length}):`,
    '1'
  );

  if (!choice) return;

  const idx = parseInt(choice) - 1;
  if (idx < 0 || idx >= otherAnchors.length) {
    alert('Invalid choice');
    return;
  }

  const targetAnchor = otherAnchors[idx];

  // Ask for duration
  const durationInput = prompt(
    `Duration (seconds)?`,
    '3'
  );

  if (!durationInput) return;

  const duration = parseFloat(durationInput) * 1000; // Convert to ms

  // Ask for easing
  const easingOptions = `1. Ease In Out (smooth)
2. Linear
3. Ease In (slow start)
4. Ease Out (slow end)
5. Sine Wave

Enter number (1-5):`;

  const easingChoice = prompt(
    `🌀 Easing function?\n\n${easingOptions}`,
    '1'
  );

  const easingMap = {
    '1': 'easeInOutCubic',
    '2': 'linear',
    '3': 'easeInCubic',
    '4': 'easeOutCubic',
    '5': 'easeInOutSine'
  };

  const easing = easingMap[easingChoice] || 'easeInOutCubic';

  // Start morph!
  console.log(`🌀 Morphing: "${sourceAnchor.name}" → "${targetAnchor.name}"`);
  morphToAnchor(targetAnchor.id, duration, easing);
  alert(`🌀 Morphing to "${targetAnchor.name}" (${duration / 1000}s)`);
}

/**
 * Start morph status updater - shows real-time morphing progress
 */
function startMorphStatusUpdater(morphStatusElement) {
  setInterval(() => {
    if (isMorphingActive()) {
      const info = getMorphInfo();
      if (!info) return;

      // Show status element
      morphStatusElement.style.display = 'block';

      // Build progress bar
      const progressPercent = Math.round(info.progress * 100);
      const progressBar = '█'.repeat(Math.floor(progressPercent / 5)) +
                         '░'.repeat(20 - Math.floor(progressPercent / 5));

      // Update content
      morphStatusElement.innerHTML = `
        <div style="color: #aa00ff; font-weight: bold; margin-bottom: 8px;">
          🌀 Morphing Active
        </div>
        <div style="color: #fff; font-size: 11px; margin-bottom: 4px;">
          ${info.from} → ${info.to}
        </div>
        <div style="color: #aa00ff; font-size: 12px; font-family: monospace; margin-bottom: 4px;">
          ${progressBar} ${progressPercent}%
        </div>
        <button id="stop-morph-btn" style="
          width: 100%;
          padding: 6px;
          background-color: #ff4444;
          color: #fff;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
          font-weight: bold;
        ">Stop Morph</button>
      `;

      // Add stop button handler
      const stopBtn = document.getElementById('stop-morph-btn');
      if (stopBtn) {
        stopBtn.addEventListener('click', () => {
          stopMorph();
          morphStatusElement.style.display = 'none';
        });
      }
    } else {
      // Hide status element when not morphing
      morphStatusElement.style.display = 'none';
    }
  }, 100); // Update at 10fps
}

/**
 * Show auto-morph configuration dialog
 */
function showAutoMorphConfigDialog() {
  // Get current config
  const currentConfig = getAutoMorphConfig();

  // Ask for min duration
  const minDurationInput = prompt(
    `✨ Auto-Morph Settings\n\nMinimum duration per morph (seconds)?`,
    (currentConfig.minDuration / 1000).toString()
  );
  if (!minDurationInput) return;
  const minDuration = parseFloat(minDurationInput) * 1000;

  // Ask for max duration
  const maxDurationInput = prompt(
    `Maximum duration per morph (seconds)?`,
    (currentConfig.maxDuration / 1000).toString()
  );
  if (!maxDurationInput) return;
  const maxDuration = parseFloat(maxDurationInput) * 1000;

  // Ask for pause between morphs
  const pauseInput = prompt(
    `Pause between morphs (seconds)?`,
    (currentConfig.pauseBetween / 1000).toString()
  );
  if (!pauseInput) return;
  const pauseBetween = parseFloat(pauseInput) * 1000;

  // Ask for random easing
  const randomEasingChoice = confirm(
    `Use random easing functions?\n\n(Cancel = fixed easing)`
  );

  // Start auto-morph with config
  const config = {
    minDuration,
    maxDuration,
    pauseBetween,
    randomEasing: randomEasingChoice,
    avoidRepeats: true,
    anchorPool: [] // Use all anchors
  };

  console.log('✨ Starting auto-morph with config:', config);
  startAutoMorph(config);

  // Update button immediately
  const autoMorphButton = document.getElementById('auto-morph-toggle');
  if (autoMorphButton) {
    autoMorphButton.textContent = '⏸️ Stop Auto-Morph';
    autoMorphButton.style.backgroundColor = '#aa00ff';
    autoMorphButton.style.color = '#000';
  }
}

console.log("⚓ hudAnchors.js ready");
