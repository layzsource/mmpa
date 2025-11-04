console.log("🎬 hudSequences.js loaded");

/**
 * MMPA Sequence HUD Interface - Phase 8
 *
 * UI for composing and performing morph sequences.
 * This is where memory becomes narrative.
 */

import {
  initSequences,
  createSequence,
  getAllSequences,
  getSequence,
  deleteSequence,
  playSequence,
  pauseSequence,
  resumeSequence,
  stopSequence,
  getPlaybackStatus,
  isSequencePlaying,
  exportSequence,
  importSequence,
  exportAllSequences,
  addStepToSequence
} from './morphSequencer.js';
import { getAllAnchors } from './anchorSystem.js';
import {
  fetchSharedSequences,
  shareSequence,
  voteOnSequence
} from './communitySequences.js';
import { checkServerStatus } from './communityAPI.js';

/**
 * Create Sequences HUD section
 */
export function createSequencesHudSection(container) {
  // Initialize sequences
  initSequences();

  const section = document.createElement('div');
  section.className = 'hud-section mmpa-sequences';
  section.style.borderLeft = '3px solid #ff00aa'; // Pink accent for sequences

  // Title
  const title = document.createElement('h3');
  title.textContent = '🎬 Sequences (Composition)';
  title.style.color = '#ff00aa';
  section.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Compose phenomenological journeys';
  subtitle.style.fontSize = '12px';
  subtitle.style.color = '#888';
  subtitle.style.marginBottom = '12px';
  section.appendChild(subtitle);

  // Create Sequence Button
  const createButton = document.createElement('button');
  createButton.textContent = '+ Create New Sequence';
  createButton.style.width = '100%';
  createButton.style.padding = '10px';
  createButton.style.marginBottom = '12px';
  createButton.style.backgroundColor = '#ff00aa';
  createButton.style.color = '#000';
  createButton.style.border = 'none';
  createButton.style.borderRadius = '5px';
  createButton.style.cursor = 'pointer';
  createButton.style.fontWeight = 'bold';

  createButton.addEventListener('click', () => {
    showCreateSequenceDialog(sequenceList);
  });

  section.appendChild(createButton);

  // Browse Community Button
  const browseButton = document.createElement('button');
  browseButton.textContent = '🌍 Browse Community Sequences';
  browseButton.style.width = '100%';
  browseButton.style.padding = '10px';
  browseButton.style.marginBottom = '12px';
  browseButton.style.backgroundColor = '#333';
  browseButton.style.color = '#ff00aa';
  browseButton.style.border = '2px solid #ff00aa';
  browseButton.style.borderRadius = '5px';
  browseButton.style.cursor = 'pointer';
  browseButton.style.fontWeight = 'bold';

  browseButton.addEventListener('click', async () => {
    const serverOk = await checkServerStatus();
    if (!serverOk) {
      alert('⚠️ Ecosystem server not available.\n\nMake sure the backend is running:\ncd ecosystem-server && npm start');
      return;
    }
    showBrowseCommunityDialog();
  });

  section.appendChild(browseButton);

  // Playback Controls
  const controlsContainer = document.createElement('div');
  controlsContainer.style.display = 'flex';
  controlsContainer.style.gap = '8px';
  controlsContainer.style.marginBottom = '12px';

  const playBtn = createControlButton('▶️ Play', '#00aa00', () => {
    const sequences = getAllSequences();
    if (sequences.length === 0) {
      alert('No sequences yet! Create one first.');
      return;
    }
    showPlaySequenceDialog();
  });

  const pauseBtn = createControlButton('⏸️ Pause', '#ff8800', () => {
    if (isSequencePlaying()) {
      pauseSequence();
    } else {
      resumeSequence();
    }
  });

  const stopBtn = createControlButton('⏹️ Stop', '#ff0000', () => {
    stopSequence();
  });

  controlsContainer.appendChild(playBtn);
  controlsContainer.appendChild(pauseBtn);
  controlsContainer.appendChild(stopBtn);
  section.appendChild(controlsContainer);

  // Playback Status
  const statusDiv = document.createElement('div');
  statusDiv.id = 'sequence-status';
  statusDiv.style.display = 'none';
  statusDiv.style.padding = '8px';
  statusDiv.style.marginBottom = '12px';
  statusDiv.style.backgroundColor = '#1a1a2e';
  statusDiv.style.border = '2px solid #ff00aa';
  statusDiv.style.borderRadius = '5px';
  statusDiv.style.fontSize = '11px';
  section.appendChild(statusDiv);

  // Update status periodically
  startPlaybackStatusUpdater(statusDiv);

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
    showImportSequenceDialog(sequenceList);
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
    exportAllSequencesToFile();
  });

  ioContainer.appendChild(importButton);
  ioContainer.appendChild(exportButton);
  section.appendChild(ioContainer);

  // Divider
  const divider = document.createElement('hr');
  divider.style.border = 'none';
  divider.style.borderTop = '1px solid #333';
  divider.style.margin = '16px 0';
  section.appendChild(divider);

  // Sequence List
  const listTitle = document.createElement('h4');
  listTitle.textContent = 'Saved Sequences';
  listTitle.style.color = '#aaa';
  listTitle.style.marginBottom = '8px';
  section.appendChild(listTitle);

  const sequenceList = document.createElement('div');
  sequenceList.className = 'sequence-list';
  section.appendChild(sequenceList);

  // Render initial list
  renderSequenceList(sequenceList);

  container.appendChild(section);
  return section;
}

/**
 * Create control button
 */
function createControlButton(label, color, onClick) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.style.flex = '1';
  btn.style.padding = '8px';
  btn.style.backgroundColor = color;
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '3px';
  btn.style.cursor = 'pointer';
  btn.style.fontSize = '12px';
  btn.style.fontWeight = 'bold';
  btn.addEventListener('click', onClick);
  return btn;
}

/**
 * Render sequence list
 */
function renderSequenceList(listContainer) {
  listContainer.innerHTML = '';

  const sequences = getAllSequences();

  if (sequences.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No sequences created yet';
    emptyMessage.style.color = '#666';
    emptyMessage.style.fontStyle = 'italic';
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.padding = '20px';
    listContainer.appendChild(emptyMessage);
    return;
  }

  // Sort by timestamp (newest first)
  const sortedSequences = [...sequences].sort((a, b) => b.timestamp - a.timestamp);

  sortedSequences.forEach(sequence => {
    const item = createSequenceListItem(sequence, listContainer);
    listContainer.appendChild(item);
  });
}

/**
 * Create sequence list item
 */
function createSequenceListItem(sequence, listContainer) {
  const item = document.createElement('div');
  item.className = 'sequence-item';
  item.style.backgroundColor = '#1a1a1a';
  item.style.padding = '12px';
  item.style.marginBottom = '8px';
  item.style.borderRadius = '5px';
  item.style.border = '1px solid #ff00aa44';

  // Name
  const name = document.createElement('div');
  name.textContent = sequence.name;
  name.style.fontWeight = 'bold';
  name.style.color = '#ff00aa';
  name.style.marginBottom = '4px';
  item.appendChild(name);

  // Description
  if (sequence.description) {
    const desc = document.createElement('div');
    desc.textContent = sequence.description;
    desc.style.fontSize = '11px';
    desc.style.color = '#aaa';
    desc.style.marginBottom = '8px';
    item.appendChild(desc);
  }

  // Stats
  const stats = document.createElement('div');
  stats.textContent = `${sequence.steps.length} steps • ${sequence.loop ? 'Loop' : 'Once'}`;
  stats.style.fontSize = '10px';
  stats.style.color = '#666';
  stats.style.marginBottom = '8px';
  item.appendChild(stats);

  // Action buttons
  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '4px';

  const playBtn = createActionButton('Play', '#00aa00', () => {
    playSequence(sequence.id, sequence.loop);
  });

  const editBtn = createActionButton('Edit', '#0088ff', () => {
    showEditSequenceDialog(sequence, listContainer);
  });

  const exportBtn = createActionButton('Export', '#888800', () => {
    exportSequenceToFile(sequence);
  });

  const shareBtn = createActionButton('Share', '#ff00aa', async () => {
    const serverOk = await checkServerStatus();
    if (!serverOk) {
      alert('⚠️ Ecosystem server not available.\n\nMake sure the backend is running:\ncd ecosystem-server && npm start');
      return;
    }
    shareSequenceToCommunity(sequence);
  });

  const deleteBtn = createActionButton('Delete', '#ff4444', () => {
    if (confirm(`Delete sequence "${sequence.name}"?`)) {
      deleteSequence(sequence.id);
      renderSequenceList(listContainer);
    }
  });

  actions.appendChild(playBtn);
  actions.appendChild(editBtn);
  actions.appendChild(exportBtn);
  actions.appendChild(shareBtn);
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
  btn.style.fontSize = '10px';
  btn.addEventListener('click', onClick);
  return btn;
}

/**
 * Show create sequence dialog
 */
function showCreateSequenceDialog(listContainer) {
  const name = prompt('Sequence Name:', `Journey ${getAllSequences().length + 1}`);
  if (!name) return;

  const description = prompt('Description (optional):', '');

  const sequence = createSequence(name, description, [], []);
  alert(`Created sequence: ${sequence.name}\n\nNow use Edit to add steps!`);

  renderSequenceList(listContainer);
}

/**
 * Show edit sequence dialog
 */
function showEditSequenceDialog(sequence, listContainer) {
  const choice = prompt(
    `Edit "${sequence.name}"\n\n` +
    `Current steps: ${sequence.steps.length}\n\n` +
    `1. Add Step\n` +
    `2. View Steps\n` +
    `3. Toggle Loop\n` +
    `4. Rename\n\n` +
    `Enter choice (1-4):`,
    '1'
  );

  if (!choice) return;

  switch (choice) {
    case '1':
      showAddStepDialog(sequence, listContainer);
      break;
    case '2':
      showViewStepsDialog(sequence);
      break;
    case '3':
      sequence.loop = !sequence.loop;
      alert(`Loop ${sequence.loop ? 'enabled' : 'disabled'}`);
      renderSequenceList(listContainer);
      break;
    case '4':
      const newName = prompt('New name:', sequence.name);
      if (newName) {
        sequence.name = newName;
        renderSequenceList(listContainer);
      }
      break;
  }
}

/**
 * Show add step dialog
 */
function showAddStepDialog(sequence, listContainer) {
  const anchors = getAllAnchors();

  if (anchors.length === 0) {
    alert('No anchors available! Create some anchors first.');
    return;
  }

  // Show anchor list
  const anchorOptions = anchors
    .map((a, idx) => `${idx + 1}. ${a.name}`)
    .join('\n');

  const anchorChoice = prompt(
    `Select anchor:\n\n${anchorOptions}\n\nEnter number (1-${anchors.length}):`,
    '1'
  );

  if (!anchorChoice) return;

  const anchorIndex = parseInt(anchorChoice) - 1;
  if (anchorIndex < 0 || anchorIndex >= anchors.length) {
    alert('Invalid choice');
    return;
  }

  const selectedAnchor = anchors[anchorIndex];

  // Ask for duration
  const durationInput = prompt('Duration (seconds):', '5');
  if (!durationInput) return;
  const duration = parseFloat(durationInput) * 1000;

  // Ask for easing
  const easingOptions = `1. Ease In Out\n2. Linear\n3. Ease In\n4. Ease Out\n5. Sine Wave`;
  const easingChoice = prompt(`Easing:\n\n${easingOptions}\n\nEnter (1-5):`, '1');
  const easingMap = {
    '1': 'easeInOutCubic',
    '2': 'linear',
    '3': 'easeInCubic',
    '4': 'easeOutCubic',
    '5': 'easeInOutSine'
  };
  const easing = easingMap[easingChoice] || 'easeInOutCubic';

  // Ask for pause after
  const pauseInput = prompt('Pause after (seconds):', '1');
  const pauseAfter = pauseInput ? parseFloat(pauseInput) * 1000 : 1000;

  // Add step
  const step = {
    anchorId: selectedAnchor.id,
    duration: duration,
    easing: easing,
    pauseAfter: pauseAfter
  };

  addStepToSequence(sequence.id, step);
  alert(`Added step: "${selectedAnchor.name}" (${duration / 1000}s)`);

  renderSequenceList(listContainer);
}

/**
 * Show view steps dialog
 */
function showViewStepsDialog(sequence) {
  if (sequence.steps.length === 0) {
    alert('No steps in this sequence yet!');
    return;
  }

  const anchors = getAllAnchors();
  const stepList = sequence.steps.map((step, idx) => {
    const anchor = anchors.find(a => a.id === step.anchorId);
    const anchorName = anchor ? anchor.name : '<missing>';
    return `${idx + 1}. ${anchorName} (${step.duration / 1000}s, ${step.easing})`;
  }).join('\n');

  alert(`Steps in "${sequence.name}":\n\n${stepList}`);
}

/**
 * Show play sequence dialog
 */
function showPlaySequenceDialog() {
  const sequences = getAllSequences();
  const sequenceOptions = sequences
    .map((s, idx) => `${idx + 1}. ${s.name} (${s.steps.length} steps)`)
    .join('\n');

  const choice = prompt(
    `Select sequence to play:\n\n${sequenceOptions}\n\nEnter number (1-${sequences.length}):`,
    '1'
  );

  if (!choice) return;

  const index = parseInt(choice) - 1;
  if (index < 0 || index >= sequences.length) {
    alert('Invalid choice');
    return;
  }

  const sequence = sequences[index];

  const loopChoice = confirm(`Loop sequence?\n\n(OK = Loop, Cancel = Play once)`);

  playSequence(sequence.id, loopChoice);
  alert(`🎬 Playing: "${sequence.name}"`);
}

/**
 * Export sequence to file
 */
function exportSequenceToFile(sequence) {
  const json = exportSequence(sequence.id);
  if (!json) return;

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sequence_${sequence.name.replace(/[^a-z0-9]/gi, '_')}.json`;
  a.click();
  URL.revokeObjectURL(url);

  console.log(`🎬 Exported sequence: ${sequence.name}`);
}

/**
 * Export all sequences to file
 */
function exportAllSequencesToFile() {
  const json = exportAllSequences();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mmpa_sequences_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  console.log('🎬 Exported all sequences');
}

/**
 * Show import sequence dialog
 */
function showImportSequenceDialog(listContainer) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const sequence = importSequence(event.target.result);
        if (sequence) {
          alert(`Imported sequence: ${sequence.name}`);
          renderSequenceList(listContainer);
        } else {
          alert('Failed to import sequence. Invalid format.');
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
 * Start playback status updater
 */
function startPlaybackStatusUpdater(statusElement) {
  setInterval(() => {
    const status = getPlaybackStatus();

    if (status.isPlaying || status.isPaused) {
      // Show status
      statusElement.style.display = 'block';

      const progressPercent = Math.round((status.currentStep / status.totalSteps) * 100);
      const progressBar = '▓'.repeat(Math.floor(progressPercent / 5)) +
                         '░'.repeat(20 - Math.floor(progressPercent / 5));

      statusElement.innerHTML = `
        <div style="color: #ff00aa; font-weight: bold; margin-bottom: 4px;">
          🎬 ${status.isPaused ? 'Paused' : 'Playing'}: ${status.currentSequence}
        </div>
        <div style="color: #fff; font-size: 11px; margin-bottom: 4px;">
          Step ${status.currentStep}/${status.totalSteps} ${status.loopEnabled ? '(Loop)' : ''}
        </div>
        <div style="color: #ff00aa; font-size: 12px; font-family: monospace;">
          ${progressBar} ${progressPercent}%
        </div>
      `;
    } else {
      // Hide status
      statusElement.style.display = 'none';
    }
  }, 200); // Update at 5fps
}

// ===================================================================
// COMMUNITY FUNCTIONS
// ===================================================================

/**
 * Share sequence to community
 */
async function shareSequenceToCommunity(sequence) {
  try {
    const result = await shareSequence(sequence);
    alert(`✅ Sequence shared to community!\n\nSequence: ${sequence.name}\nID: ${result.id}\n\nOthers can now discover and play your sequence!`);
  } catch (error) {
    alert(`❌ Failed to share sequence:\n\n${error.message}`);
  }
}

/**
 * Show browse community dialog
 */
async function showBrowseCommunityDialog() {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  overlay.style.zIndex = '10000';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.padding = '20px';

  // Create dialog
  const dialog = document.createElement('div');
  dialog.style.backgroundColor = '#1a1a1a';
  dialog.style.border = '2px solid #ff00aa';
  dialog.style.borderRadius = '10px';
  dialog.style.padding = '24px';
  dialog.style.maxWidth = '800px';
  dialog.style.maxHeight = '80vh';
  dialog.style.width = '100%';
  dialog.style.overflow = 'auto';

  // Title
  const title = document.createElement('h2');
  title.textContent = '🌍 Community Sequences';
  title.style.color = '#ff00aa';
  title.style.marginTop = '0';
  title.style.marginBottom = '16px';
  dialog.appendChild(title);

  // Loading message
  const loading = document.createElement('p');
  loading.textContent = 'Loading community sequences...';
  loading.style.color = '#888';
  loading.style.textAlign = 'center';
  loading.style.padding = '40px';
  dialog.appendChild(loading);

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });

  // Fetch sequences
  try {
    const result = await fetchSharedSequences({ limit: 50, sortBy: 'recent' });
    dialog.removeChild(loading);

    if (result.sequences.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'No community sequences yet. Be the first to share one!';
      empty.style.color = '#666';
      empty.style.textAlign = 'center';
      empty.style.padding = '40px';
      dialog.appendChild(empty);
    } else {
      // Sort options
      const sortContainer = document.createElement('div');
      sortContainer.style.marginBottom = '16px';
      sortContainer.style.display = 'flex';
      sortContainer.style.gap = '8px';
      sortContainer.style.alignItems = 'center';

      const sortLabel = document.createElement('span');
      sortLabel.textContent = 'Sort by:';
      sortLabel.style.color = '#888';
      sortLabel.style.fontSize = '12px';
      sortContainer.appendChild(sortLabel);

      ['Recent', 'Top Rated', 'Most Votes'].forEach((option, idx) => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.style.padding = '4px 8px';
        btn.style.fontSize = '11px';
        btn.style.backgroundColor = idx === 0 ? '#ff00aa' : '#333';
        btn.style.color = idx === 0 ? '#000' : '#ff00aa';
        btn.style.border = '1px solid #ff00aa';
        btn.style.borderRadius = '3px';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', async () => {
          const sortBy = ['recent', 'resonance', 'votes'][idx];
          document.body.removeChild(overlay);
          showBrowseCommunityDialog(); // Refresh with new sort
        });
        sortContainer.appendChild(btn);
      });

      dialog.appendChild(sortContainer);

      // Sequence list
      result.sequences.forEach(item => {
        const seqDiv = createCommunitySequenceItem(item, overlay);
        dialog.appendChild(seqDiv);
      });
    }

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.width = '100%';
    closeBtn.style.padding = '10px';
    closeBtn.style.marginTop = '16px';
    closeBtn.style.backgroundColor = '#333';
    closeBtn.style.color = '#ff00aa';
    closeBtn.style.border = '2px solid #ff00aa';
    closeBtn.style.borderRadius = '5px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
    dialog.appendChild(closeBtn);

  } catch (error) {
    dialog.removeChild(loading);
    const errorMsg = document.createElement('p');
    errorMsg.textContent = `Failed to load: ${error.message}`;
    errorMsg.style.color = '#ff4444';
    errorMsg.style.textAlign = 'center';
    errorMsg.style.padding = '40px';
    dialog.appendChild(errorMsg);
  }
}

/**
 * Create community sequence item
 */
function createCommunitySequenceItem(item, overlay) {
  const div = document.createElement('div');
  div.style.backgroundColor = '#222';
  div.style.border = '1px solid #ff00aa44';
  div.style.borderRadius = '5px';
  div.style.padding = '12px';
  div.style.marginBottom = '8px';

  // Name
  const name = document.createElement('div');
  name.textContent = item.sequence.name;
  name.style.fontWeight = 'bold';
  name.style.color = '#ff00aa';
  name.style.marginBottom = '4px';
  div.appendChild(name);

  // Description
  if (item.description) {
    const desc = document.createElement('div');
    desc.textContent = item.description;
    desc.style.fontSize = '11px';
    desc.style.color = '#aaa';
    desc.style.marginBottom = '8px';
    div.appendChild(desc);
  }

  // Stats
  const stats = document.createElement('div');
  stats.textContent = `${item.sequence.steps.length} steps • by ${item.creator.substring(0, 12)}... • ⭐ ${item.resonanceScore.toFixed(1)} (${item.votes} votes)`;
  stats.style.fontSize = '10px';
  stats.style.color = '#666';
  stats.style.marginBottom = '8px';
  div.appendChild(stats);

  // Actions
  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '4px';

  const importBtn = createActionButton('Import', '#00aa00', () => {
    importSequence(JSON.stringify(item.sequence));
    alert(`Imported: ${item.sequence.name}\n\nSequence added to your local library!`);
    document.body.removeChild(overlay);
  });

  const voteBtn = createActionButton('⭐ Vote', '#ff8800', async () => {
    const resonance = prompt('Rate this sequence (1-5):', '5');
    if (!resonance) return;
    const rating = parseInt(resonance);
    if (rating < 1 || rating > 5) {
      alert('Rating must be 1-5');
      return;
    }
    try {
      await voteOnSequence(item.id, rating);
      alert(`Voted ${rating} stars!`);
      document.body.removeChild(overlay);
      showBrowseCommunityDialog(); // Refresh
    } catch (error) {
      alert(`Vote failed: ${error.message}`);
    }
  });

  actions.appendChild(importBtn);
  actions.appendChild(voteBtn);
  div.appendChild(actions);

  return div;
}

console.log("🎬 hudSequences.js ready");
