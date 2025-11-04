console.log("🎭 performanceMode.js loaded");

/**
 * MMPA Performance Mode - Phase 10
 *
 * Fullscreen performance interface for live sessions.
 * Streamlined controls, keyboard shortcuts, visual feedback.
 */

import { getAllAnchors } from './anchorSystem.js';
import { getAllSequences, playSequence, stopSequence, pauseSequence, resumeSequence, isSequencePlaying } from './morphSequencer.js';
import { morphToAnchor, stopMorph, startAutoMorph, stopAutoMorph, isAutoMorphingActive } from './anchorMorphing.js';
import { state } from './state.js';
import {
  isMIDIEnabled,
  getMIDIDevices,
  getAllMappings,
  startMIDILearn,
  cancelMIDILearn,
  mapNoteToAnchor,
  mapNoteToSequence,
  mapNoteToAction,
  mapCCToParameter,
  removeMapping,
  clearAllMappings
} from './midiController.js';

// Performance mode state
let isPerformanceMode = false;
let performanceUI = null;
let keyboardShortcutsEnabled = true;
let anchorHotkeys = {}; // Map of key -> anchorId
let sequenceHotkeys = {}; // Map of key -> sequenceId
let midiPanelOpen = false;
let midiPanel = null;
let midiLearnMode = false;
let midiInputMonitor = null;

// Keyboard shortcut map
const SHORTCUTS = {
  'Escape': 'Exit Performance Mode',
  'Space': 'Toggle Auto-Morph',
  'p': 'Pause/Resume Sequence',
  's': 'Stop All',
  'h': 'Toggle HUD',
  'm': 'Toggle MIDI Panel',
  '1-9': 'Trigger Anchor Hotkey',
  'F1-F9': 'Trigger Sequence Hotkey'
};

/**
 * Enter performance mode
 */
export function enterPerformanceMode() {
  if (isPerformanceMode) {
    console.log('🎭 Already in performance mode');
    return;
  }

  console.log('🎭 Entering performance mode');
  isPerformanceMode = true;

  // Create fullscreen performance UI
  createPerformanceUI();

  // Enable keyboard shortcuts
  enableKeyboardShortcuts();

  // Request fullscreen
  requestFullscreen();
}

/**
 * Exit performance mode
 */
export function exitPerformanceMode() {
  if (!isPerformanceMode) return;

  console.log('🎭 Exiting performance mode');
  isPerformanceMode = false;

  // Remove performance UI
  if (performanceUI && performanceUI.parentNode) {
    document.body.removeChild(performanceUI);
    performanceUI = null;
  }

  // Disable keyboard shortcuts
  disableKeyboardShortcuts();

  // Exit fullscreen
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
}

/**
 * Check if in performance mode
 */
export function isInPerformanceMode() {
  return isPerformanceMode;
}

/**
 * Create performance UI
 */
function createPerformanceUI() {
  performanceUI = document.createElement('div');
  performanceUI.id = 'performance-mode';
  performanceUI.style.position = 'fixed';
  performanceUI.style.top = '0';
  performanceUI.style.left = '0';
  performanceUI.style.width = '100%';
  performanceUI.style.height = '100%';
  performanceUI.style.backgroundColor = '#000';
  performanceUI.style.zIndex = '9999';
  performanceUI.style.display = 'flex';
  performanceUI.style.flexDirection = 'column';
  performanceUI.style.color = '#fff';
  performanceUI.style.fontFamily = 'monospace';

  // Header
  const header = createHeader();
  performanceUI.appendChild(header);

  // Main content area
  const content = document.createElement('div');
  content.style.flex = '1';
  content.style.display = 'flex';
  content.style.padding = '20px';
  content.style.gap = '20px';

  // Left panel - Anchors
  const anchorsPanel = createAnchorsPanel();
  content.appendChild(anchorsPanel);

  // Center panel - Visual feedback
  const visualPanel = createVisualPanel();
  content.appendChild(visualPanel);

  // Right panel - Sequences
  const sequencesPanel = createSequencesPanel();
  content.appendChild(sequencesPanel);

  performanceUI.appendChild(content);

  // Footer - Controls
  const footer = createFooter();
  performanceUI.appendChild(footer);

  document.body.appendChild(performanceUI);

  // Start visual updates
  startVisualUpdates();
}

/**
 * Create header
 */
function createHeader() {
  const header = document.createElement('div');
  header.style.padding = '20px';
  header.style.borderBottom = '2px solid #333';
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';

  const title = document.createElement('h1');
  title.textContent = '🎭 MMPA Performance Mode';
  title.style.margin = '0';
  title.style.fontSize = '24px';
  title.style.color = '#00ffaa';
  header.appendChild(title);

  // Right side buttons container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.gap = '10px';
  buttonsContainer.style.alignItems = 'center';

  // MIDI button (only if MIDI is enabled)
  if (isMIDIEnabled()) {
    const midiBtn = document.createElement('button');
    midiBtn.textContent = '🎹 MIDI [M]';
    midiBtn.style.padding = '10px 20px';
    midiBtn.style.backgroundColor = '#aa00ff';
    midiBtn.style.color = '#fff';
    midiBtn.style.border = 'none';
    midiBtn.style.borderRadius = '5px';
    midiBtn.style.cursor = 'pointer';
    midiBtn.style.fontSize = '16px';
    midiBtn.style.fontWeight = 'bold';
    midiBtn.addEventListener('click', toggleMIDIPanel);
    buttonsContainer.appendChild(midiBtn);
  }

  const exitBtn = document.createElement('button');
  exitBtn.textContent = '✕ Exit (ESC)';
  exitBtn.style.padding = '10px 20px';
  exitBtn.style.backgroundColor = '#ff0000';
  exitBtn.style.color = '#fff';
  exitBtn.style.border = 'none';
  exitBtn.style.borderRadius = '5px';
  exitBtn.style.cursor = 'pointer';
  exitBtn.style.fontSize = '16px';
  exitBtn.style.fontWeight = 'bold';
  exitBtn.addEventListener('click', exitPerformanceMode);
  buttonsContainer.appendChild(exitBtn);

  header.appendChild(buttonsContainer);

  return header;
}

/**
 * Create anchors panel
 */
function createAnchorsPanel() {
  const panel = document.createElement('div');
  panel.style.flex = '1';
  panel.style.backgroundColor = '#111';
  panel.style.border = '2px solid #00aaff';
  panel.style.borderRadius = '10px';
  panel.style.padding = '20px';
  panel.style.overflowY = 'auto';

  const title = document.createElement('h2');
  title.textContent = '⚓ Anchors';
  title.style.marginTop = '0';
  title.style.color = '#00aaff';
  title.style.marginBottom = '16px';
  panel.appendChild(title);

  const anchors = getAllAnchors();

  if (anchors.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No anchors created yet';
    empty.style.color = '#666';
    panel.appendChild(empty);
    return panel;
  }

  anchors.slice(0, 9).forEach((anchor, idx) => {
    const btn = document.createElement('button');
    btn.textContent = `[${idx + 1}] ${anchor.name}`;
    btn.style.width = '100%';
    btn.style.padding = '15px';
    btn.style.marginBottom = '10px';
    btn.style.backgroundColor = '#222';
    btn.style.color = '#00aaff';
    btn.style.border = '2px solid #00aaff';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '16px';
    btn.style.textAlign = 'left';
    btn.style.fontFamily = 'monospace';

    btn.addEventListener('click', () => {
      morphToAnchor(anchor.id, 2000);
      flashButton(btn);
    });

    // Store hotkey mapping
    anchorHotkeys[`${idx + 1}`] = anchor.id;

    panel.appendChild(btn);
  });

  return panel;
}

/**
 * Create visual feedback panel
 */
function createVisualPanel() {
  const panel = document.createElement('div');
  panel.style.flex = '2';
  panel.style.backgroundColor = '#111';
  panel.style.border = '2px solid #ff00aa';
  panel.style.borderRadius = '10px';
  panel.style.padding = '20px';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.alignItems = 'center';
  panel.style.justifyContent = 'center';

  // Status display
  const statusDiv = document.createElement('div');
  statusDiv.id = 'perf-status';
  statusDiv.style.textAlign = 'center';
  statusDiv.style.marginBottom = '40px';

  const statusTitle = document.createElement('div');
  statusTitle.textContent = 'System Status';
  statusTitle.style.fontSize = '20px';
  statusTitle.style.color = '#ff00aa';
  statusTitle.style.marginBottom = '16px';
  statusDiv.appendChild(statusTitle);

  const statusText = document.createElement('div');
  statusText.id = 'perf-status-text';
  statusText.style.fontSize = '48px';
  statusText.style.fontWeight = 'bold';
  statusText.style.color = '#00ffaa';
  statusText.textContent = 'READY';
  statusDiv.appendChild(statusText);

  panel.appendChild(statusDiv);

  // MMPA Features display
  const featuresDiv = document.createElement('div');
  featuresDiv.id = 'perf-features';
  featuresDiv.style.width = '100%';
  featuresDiv.style.display = 'grid';
  featuresDiv.style.gridTemplateColumns = 'repeat(3, 1fr)';
  featuresDiv.style.gap = '16px';

  const featureNames = ['Identity', 'Relationship', 'Complexity', 'Transformation', 'Alignment', 'Potential'];
  const featureKeys = ['identity', 'relationship', 'complexity', 'transformation', 'alignment', 'potential'];

  featureKeys.forEach((key, idx) => {
    const featureBox = document.createElement('div');
    featureBox.style.backgroundColor = '#222';
    featureBox.style.border = '1px solid #444';
    featureBox.style.borderRadius = '8px';
    featureBox.style.padding = '12px';
    featureBox.style.textAlign = 'center';

    const name = document.createElement('div');
    name.textContent = featureNames[idx];
    name.style.fontSize = '12px';
    name.style.color = '#888';
    name.style.marginBottom = '8px';
    featureBox.appendChild(name);

    const value = document.createElement('div');
    value.id = `perf-feature-${key}`;
    value.style.fontSize = '24px';
    value.style.fontWeight = 'bold';
    value.style.color = '#00ffaa';
    value.textContent = '0.50';
    featureBox.appendChild(value);

    featuresDiv.appendChild(featureBox);
  });

  panel.appendChild(featuresDiv);

  return panel;
}

/**
 * Create sequences panel
 */
function createSequencesPanel() {
  const panel = document.createElement('div');
  panel.style.flex = '1';
  panel.style.backgroundColor = '#111';
  panel.style.border = '2px solid #ff00aa';
  panel.style.borderRadius = '10px';
  panel.style.padding = '20px';
  panel.style.overflowY = 'auto';

  const title = document.createElement('h2');
  title.textContent = '🎬 Sequences';
  title.style.marginTop = '0';
  title.style.color = '#ff00aa';
  title.style.marginBottom = '16px';
  panel.appendChild(title);

  const sequences = getAllSequences();

  if (sequences.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No sequences created yet';
    empty.style.color = '#666';
    panel.appendChild(empty);
    return panel;
  }

  sequences.slice(0, 9).forEach((sequence, idx) => {
    const btn = document.createElement('button');
    btn.textContent = `[F${idx + 1}] ${sequence.name}`;
    btn.style.width = '100%';
    btn.style.padding = '15px';
    btn.style.marginBottom = '10px';
    btn.style.backgroundColor = '#222';
    btn.style.color = '#ff00aa';
    btn.style.border = '2px solid #ff00aa';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '16px';
    btn.style.textAlign = 'left';
    btn.style.fontFamily = 'monospace';

    btn.addEventListener('click', () => {
      playSequence(sequence.id, sequence.loop);
      flashButton(btn);
    });

    // Store hotkey mapping
    sequenceHotkeys[`F${idx + 1}`] = sequence.id;

    panel.appendChild(btn);
  });

  return panel;
}

/**
 * Create footer
 */
function createFooter() {
  const footer = document.createElement('div');
  footer.style.padding = '20px';
  footer.style.borderTop = '2px solid #333';
  footer.style.display = 'flex';
  footer.style.gap = '16px';
  footer.style.justifyContent = 'center';

  const autoMorphBtn = createControlBtn('⚡ Auto-Morph [SPACE]', '#aa00ff', () => {
    if (isAutoMorphingActive()) {
      stopAutoMorph();
      autoMorphBtn.textContent = '⚡ Auto-Morph [SPACE]';
      autoMorphBtn.style.backgroundColor = '#aa00ff';
    } else {
      startAutoMorph({ minDuration: 3000, maxDuration: 8000, pauseBetween: 1000 });
      autoMorphBtn.textContent = '⏹ Stop Auto [SPACE]';
      autoMorphBtn.style.backgroundColor = '#ff00aa';
    }
  });

  const pauseBtn = createControlBtn('⏸ Pause [P]', '#ff8800', () => {
    if (isSequencePlaying()) {
      pauseSequence();
    } else {
      resumeSequence();
    }
  });

  const stopBtn = createControlBtn('⏹ Stop All [S]', '#ff0000', () => {
    stopSequence();
    stopMorph();
    stopAutoMorph();
  });

  footer.appendChild(autoMorphBtn);
  footer.appendChild(pauseBtn);
  footer.appendChild(stopBtn);

  return footer;
}

/**
 * Create control button
 */
function createControlBtn(text, color, onClick) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.style.padding = '15px 30px';
  btn.style.backgroundColor = color;
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '8px';
  btn.style.cursor = 'pointer';
  btn.style.fontSize = '18px';
  btn.style.fontWeight = 'bold';
  btn.style.fontFamily = 'monospace';
  btn.addEventListener('click', onClick);
  return btn;
}

/**
 * Flash button effect
 */
function flashButton(btn) {
  const originalBg = btn.style.backgroundColor;
  btn.style.backgroundColor = '#fff';
  setTimeout(() => {
    btn.style.backgroundColor = originalBg;
  }, 100);
}

/**
 * Start visual updates
 */
function startVisualUpdates() {
  setInterval(() => {
    if (!isPerformanceMode) return;

    // Update status text
    const statusText = document.getElementById('perf-status-text');
    if (statusText) {
      if (isSequencePlaying()) {
        statusText.textContent = 'PLAYING SEQUENCE';
        statusText.style.color = '#ff00aa';
      } else if (isAutoMorphingActive()) {
        statusText.textContent = 'AUTO-MORPHING';
        statusText.style.color = '#aa00ff';
      } else {
        statusText.textContent = 'READY';
        statusText.style.color = '#00ffaa';
      }
    }

    // Update MMPA features
    const featureKeys = ['identity', 'relationship', 'complexity', 'transformation', 'alignment', 'potential'];
    featureKeys.forEach(key => {
      const elem = document.getElementById(`perf-feature-${key}`);
      if (elem && state.mmpaFeatures[key]) {
        const features = state.mmpaFeatures[key];
        const values = Object.values(features);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        elem.textContent = avg.toFixed(2);

        // Color based on value
        if (avg > 0.7) {
          elem.style.color = '#ff0000';
        } else if (avg > 0.4) {
          elem.style.color = '#ffaa00';
        } else {
          elem.style.color = '#00ffaa';
        }
      }
    });
  }, 100); // Update at 10fps
}

/**
 * Enable keyboard shortcuts
 */
function enableKeyboardShortcuts() {
  document.addEventListener('keydown', handleKeyboard);
}

/**
 * Disable keyboard shortcuts
 */
function disableKeyboardShortcuts() {
  document.removeEventListener('keydown', handleKeyboard);
}

/**
 * Handle keyboard events
 */
function handleKeyboard(e) {
  if (!isPerformanceMode) return;

  // Escape - Exit
  if (e.key === 'Escape') {
    exitPerformanceMode();
    return;
  }

  // Space - Toggle auto-morph
  if (e.key === ' ') {
    e.preventDefault();
    if (isAutoMorphingActive()) {
      stopAutoMorph();
    } else {
      startAutoMorph({ minDuration: 3000, maxDuration: 8000, pauseBetween: 1000 });
    }
    return;
  }

  // P - Pause/resume sequence
  if (e.key === 'p' || e.key === 'P') {
    if (isSequencePlaying()) {
      pauseSequence();
    } else {
      resumeSequence();
    }
    return;
  }

  // S - Stop all
  if (e.key === 's' || e.key === 'S') {
    stopSequence();
    stopMorph();
    stopAutoMorph();
    return;
  }

  // M - Toggle MIDI panel
  if (e.key === 'm' || e.key === 'M') {
    if (isMIDIEnabled()) {
      toggleMIDIPanel();
    }
    return;
  }

  // Number keys 1-9 - Trigger anchors
  if (e.key >= '1' && e.key <= '9') {
    const anchorId = anchorHotkeys[e.key];
    if (anchorId) {
      morphToAnchor(anchorId, 2000);
      console.log(`🎭 Triggered anchor hotkey: ${e.key}`);
    }
    return;
  }

  // F-keys - Trigger sequences
  if (e.key.startsWith('F') && e.key.length === 2) {
    const sequenceId = sequenceHotkeys[e.key];
    if (sequenceId) {
      const sequence = getAllSequences().find(s => s.id === sequenceId);
      if (sequence) {
        playSequence(sequenceId, sequence.loop);
        console.log(`🎭 Triggered sequence hotkey: ${e.key}`);
      }
    }
    return;
  }
}

/**
 * Request fullscreen
 */
function requestFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(err => {
      console.log('Fullscreen request failed:', err);
    });
  }
}

/**
 * Toggle MIDI panel
 */
function toggleMIDIPanel() {
  if (midiPanelOpen) {
    closeMIDIPanel();
  } else {
    openMIDIPanel();
  }
}

/**
 * Open MIDI panel
 */
function openMIDIPanel() {
  if (midiPanelOpen) return;

  console.log('🎹 Opening MIDI panel');
  midiPanelOpen = true;

  midiPanel = createMIDIPanel();
  performanceUI.appendChild(midiPanel);

  // Start MIDI input monitoring
  startMIDIInputMonitoring();
}

/**
 * Close MIDI panel
 */
function closeMIDIPanel() {
  if (!midiPanelOpen) return;

  console.log('🎹 Closing MIDI panel');
  midiPanelOpen = false;

  if (midiPanel && midiPanel.parentNode) {
    performanceUI.removeChild(midiPanel);
    midiPanel = null;
  }

  // Stop MIDI learn if active
  if (midiLearnMode) {
    cancelMIDILearn();
    midiLearnMode = false;
  }
}

/**
 * Create MIDI panel
 */
function createMIDIPanel() {
  const panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.top = '0';
  panel.style.right = '0';
  panel.style.width = '400px';
  panel.style.height = '100%';
  panel.style.backgroundColor = '#1a0033';
  panel.style.borderLeft = '3px solid #aa00ff';
  panel.style.overflowY = 'auto';
  panel.style.zIndex = '10000';
  panel.style.padding = '20px';
  panel.style.boxSizing = 'border-box';

  // Header
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '20px';

  const title = document.createElement('h2');
  title.textContent = '🎹 MIDI Control';
  title.style.margin = '0';
  title.style.color = '#aa00ff';
  header.appendChild(title);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.padding = '5px 10px';
  closeBtn.style.backgroundColor = '#ff0000';
  closeBtn.style.color = '#fff';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '3px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontSize = '16px';
  closeBtn.addEventListener('click', closeMIDIPanel);
  header.appendChild(closeBtn);

  panel.appendChild(header);

  // MIDI Devices section
  const devicesSection = createMIDIDevicesSection();
  panel.appendChild(devicesSection);

  // MIDI Input Monitor section
  const monitorSection = createMIDIInputMonitorSection();
  panel.appendChild(monitorSection);

  // MIDI Mappings section
  const mappingsSection = createMIDIMappingsSection();
  panel.appendChild(mappingsSection);

  // Quick Actions section
  const actionsSection = createQuickActionsSection();
  panel.appendChild(actionsSection);

  return panel;
}

/**
 * Create MIDI devices section
 */
function createMIDIDevicesSection() {
  const section = document.createElement('div');
  section.style.marginBottom = '20px';
  section.style.padding = '15px';
  section.style.backgroundColor = '#220044';
  section.style.borderRadius = '8px';
  section.style.border = '1px solid #aa00ff';

  const title = document.createElement('h3');
  title.textContent = 'Connected Devices';
  title.style.marginTop = '0';
  title.style.marginBottom = '12px';
  title.style.color = '#aa00ff';
  title.style.fontSize = '16px';
  section.appendChild(title);

  const devices = getMIDIDevices();

  if (devices.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No MIDI devices connected';
    empty.style.color = '#888';
    empty.style.fontSize = '14px';
    empty.style.margin = '0';
    section.appendChild(empty);
  } else {
    devices.forEach(device => {
      const deviceDiv = document.createElement('div');
      deviceDiv.style.padding = '8px';
      deviceDiv.style.backgroundColor = '#330066';
      deviceDiv.style.borderRadius = '4px';
      deviceDiv.style.marginBottom = '8px';
      deviceDiv.style.fontSize = '12px';

      const nameDiv = document.createElement('div');
      nameDiv.textContent = device.name;
      nameDiv.style.color = '#fff';
      nameDiv.style.fontWeight = 'bold';
      deviceDiv.appendChild(nameDiv);

      const statusDiv = document.createElement('div');
      statusDiv.textContent = `Status: ${device.state}`;
      statusDiv.style.color = device.state === 'connected' ? '#00ff00' : '#ff0000';
      statusDiv.style.fontSize = '11px';
      deviceDiv.appendChild(statusDiv);

      section.appendChild(deviceDiv);
    });
  }

  return section;
}

/**
 * Create MIDI input monitor section
 */
function createMIDIInputMonitorSection() {
  const section = document.createElement('div');
  section.style.marginBottom = '20px';
  section.style.padding = '15px';
  section.style.backgroundColor = '#220044';
  section.style.borderRadius = '8px';
  section.style.border = '1px solid #aa00ff';

  const title = document.createElement('h3');
  title.textContent = 'MIDI Input Monitor';
  title.style.marginTop = '0';
  title.style.marginBottom = '12px';
  title.style.color = '#aa00ff';
  title.style.fontSize = '16px';
  section.appendChild(title);

  midiInputMonitor = document.createElement('div');
  midiInputMonitor.id = 'midi-input-monitor';
  midiInputMonitor.style.padding = '10px';
  midiInputMonitor.style.backgroundColor = '#000';
  midiInputMonitor.style.borderRadius = '4px';
  midiInputMonitor.style.minHeight = '60px';
  midiInputMonitor.style.maxHeight = '120px';
  midiInputMonitor.style.overflowY = 'auto';
  midiInputMonitor.style.fontSize = '11px';
  midiInputMonitor.style.fontFamily = 'monospace';
  midiInputMonitor.style.color = '#00ff00';
  midiInputMonitor.textContent = 'Waiting for MIDI input...';
  section.appendChild(midiInputMonitor);

  return section;
}

/**
 * Create MIDI mappings section
 */
function createMIDIMappingsSection() {
  const section = document.createElement('div');
  section.style.marginBottom = '20px';
  section.style.padding = '15px';
  section.style.backgroundColor = '#220044';
  section.style.borderRadius = '8px';
  section.style.border = '1px solid #aa00ff';

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '12px';

  const title = document.createElement('h3');
  title.textContent = 'MIDI Mappings';
  title.style.margin = '0';
  title.style.color = '#aa00ff';
  title.style.fontSize = '16px';
  header.appendChild(title);

  const learnBtn = document.createElement('button');
  learnBtn.textContent = 'Learn';
  learnBtn.style.padding = '4px 12px';
  learnBtn.style.backgroundColor = '#00aa00';
  learnBtn.style.color = '#fff';
  learnBtn.style.border = 'none';
  learnBtn.style.borderRadius = '4px';
  learnBtn.style.cursor = 'pointer';
  learnBtn.style.fontSize = '12px';
  learnBtn.addEventListener('click', () => startMIDILearnWorkflow());
  header.appendChild(learnBtn);

  section.appendChild(header);

  const mappingsList = document.createElement('div');
  mappingsList.id = 'midi-mappings-list';
  mappingsList.style.maxHeight = '300px';
  mappingsList.style.overflowY = 'auto';

  // Display current mappings
  const mappings = getAllMappings();
  const totalMappings = Object.keys(mappings.notes).length + Object.keys(mappings.cc).length;

  if (totalMappings === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No mappings configured. Click "Learn" to create mappings.';
    empty.style.color = '#888';
    empty.style.fontSize = '12px';
    empty.style.margin = '0';
    mappingsList.appendChild(empty);
  } else {
    // Note mappings
    Object.entries(mappings.notes).forEach(([note, mapping]) => {
      const mappingDiv = createMappingItem('NOTE', note, mapping);
      mappingsList.appendChild(mappingDiv);
    });

    // CC mappings
    Object.entries(mappings.cc).forEach(([cc, mapping]) => {
      const mappingDiv = createMappingItem('CC', cc, mapping);
      mappingsList.appendChild(mappingDiv);
    });
  }

  section.appendChild(mappingsList);

  return section;
}

/**
 * Create mapping item
 */
function createMappingItem(type, value, mapping) {
  const item = document.createElement('div');
  item.style.padding = '8px';
  item.style.backgroundColor = '#330066';
  item.style.borderRadius = '4px';
  item.style.marginBottom = '6px';
  item.style.display = 'flex';
  item.style.justifyContent = 'space-between';
  item.style.alignItems = 'center';
  item.style.fontSize = '12px';

  const info = document.createElement('div');

  const typeSpan = document.createElement('span');
  typeSpan.textContent = `${type} ${value}`;
  typeSpan.style.color = '#aa00ff';
  typeSpan.style.fontWeight = 'bold';
  info.appendChild(typeSpan);

  const arrow = document.createElement('span');
  arrow.textContent = ' → ';
  arrow.style.color = '#888';
  info.appendChild(arrow);

  const target = document.createElement('span');
  if (mapping.type === 'anchor') {
    const anchor = getAllAnchors().find(a => a.id === mapping.id);
    target.textContent = anchor ? `Anchor: ${anchor.name}` : 'Anchor (deleted)';
    target.style.color = '#00aaff';
  } else if (mapping.type === 'sequence') {
    const sequence = getAllSequences().find(s => s.id === mapping.id);
    target.textContent = sequence ? `Sequence: ${sequence.name}` : 'Sequence (deleted)';
    target.style.color = '#ff00aa';
  } else {
    target.textContent = mapping.type.replace('_', ' ').toUpperCase();
    target.style.color = '#ffaa00';
  }
  info.appendChild(target);

  item.appendChild(info);

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✕';
  deleteBtn.style.padding = '2px 6px';
  deleteBtn.style.backgroundColor = '#ff0000';
  deleteBtn.style.color = '#fff';
  deleteBtn.style.border = 'none';
  deleteBtn.style.borderRadius = '3px';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.style.fontSize = '10px';
  deleteBtn.addEventListener('click', () => {
    removeMapping(type.toLowerCase(), parseInt(value));
    refreshMIDIMappingsDisplay();
  });
  item.appendChild(deleteBtn);

  return item;
}

/**
 * Create quick actions section
 */
function createQuickActionsSection() {
  const section = document.createElement('div');
  section.style.padding = '15px';
  section.style.backgroundColor = '#220044';
  section.style.borderRadius = '8px';
  section.style.border = '1px solid #aa00ff';

  const title = document.createElement('h3');
  title.textContent = 'Quick Actions';
  title.style.marginTop = '0';
  title.style.marginBottom = '12px';
  title.style.color = '#aa00ff';
  title.style.fontSize = '16px';
  section.appendChild(title);

  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear All Mappings';
  clearBtn.style.width = '100%';
  clearBtn.style.padding = '10px';
  clearBtn.style.backgroundColor = '#ff0000';
  clearBtn.style.color = '#fff';
  clearBtn.style.border = 'none';
  clearBtn.style.borderRadius = '4px';
  clearBtn.style.cursor = 'pointer';
  clearBtn.style.fontSize = '14px';
  clearBtn.style.fontWeight = 'bold';
  clearBtn.addEventListener('click', () => {
    if (confirm('Clear all MIDI mappings? This cannot be undone.')) {
      clearAllMappings();
      refreshMIDIMappingsDisplay();
    }
  });
  section.appendChild(clearBtn);

  return section;
}

/**
 * Start MIDI learn workflow
 */
function startMIDILearnWorkflow() {
  if (midiLearnMode) {
    cancelMIDILearn();
    midiLearnMode = false;
    return;
  }

  // Show target selection dialog
  const targets = [];

  // Add anchors
  getAllAnchors().slice(0, 9).forEach(anchor => {
    targets.push({ type: 'anchor', id: anchor.id, label: `Anchor: ${anchor.name}` });
  });

  // Add sequences
  getAllSequences().slice(0, 9).forEach(sequence => {
    targets.push({ type: 'sequence', id: sequence.id, label: `Sequence: ${sequence.name}` });
  });

  // Add actions
  targets.push({ type: 'auto_morph', label: 'Action: Auto-Morph' });
  targets.push({ type: 'stop_all', label: 'Action: Stop All' });

  // Create selection dialog
  const dialog = document.createElement('div');
  dialog.style.position = 'fixed';
  dialog.style.top = '50%';
  dialog.style.left = '50%';
  dialog.style.transform = 'translate(-50%, -50%)';
  dialog.style.backgroundColor = '#1a0033';
  dialog.style.border = '3px solid #aa00ff';
  dialog.style.borderRadius = '10px';
  dialog.style.padding = '20px';
  dialog.style.zIndex = '10001';
  dialog.style.maxWidth = '400px';
  dialog.style.maxHeight = '80%';
  dialog.style.overflowY = 'auto';

  const dialogTitle = document.createElement('h3');
  dialogTitle.textContent = 'Select Target for MIDI Learn';
  dialogTitle.style.marginTop = '0';
  dialogTitle.style.color = '#aa00ff';
  dialog.appendChild(dialogTitle);

  targets.forEach(target => {
    const btn = document.createElement('button');
    btn.textContent = target.label;
    btn.style.width = '100%';
    btn.style.padding = '12px';
    btn.style.marginBottom = '8px';
    btn.style.backgroundColor = '#330066';
    btn.style.color = '#fff';
    btn.style.border = '1px solid #aa00ff';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '14px';
    btn.style.textAlign = 'left';
    btn.addEventListener('click', () => {
      document.body.removeChild(dialog);
      startMIDILearnForTarget(target);
    });
    dialog.appendChild(btn);
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.width = '100%';
  cancelBtn.style.padding = '12px';
  cancelBtn.style.backgroundColor = '#ff0000';
  cancelBtn.style.color = '#fff';
  cancelBtn.style.border = 'none';
  cancelBtn.style.borderRadius = '4px';
  cancelBtn.style.cursor = 'pointer';
  cancelBtn.style.fontSize = '14px';
  cancelBtn.style.fontWeight = 'bold';
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(dialog);
  });
  dialog.appendChild(cancelBtn);

  document.body.appendChild(dialog);
}

/**
 * Start MIDI learn for specific target
 */
function startMIDILearnForTarget(target) {
  midiLearnMode = true;

  // Show waiting message
  if (midiInputMonitor) {
    midiInputMonitor.style.backgroundColor = '#003300';
    midiInputMonitor.style.color = '#00ff00';
    midiInputMonitor.textContent = `LEARNING MODE: Press any MIDI control to map to "${target.label}"...`;
  }

  startMIDILearn((midiData) => {
    midiLearnMode = false;

    const { command, data1 } = midiData;

    if (command === 0x90) {
      // Note On
      if (target.type === 'anchor') {
        mapNoteToAnchor(data1, target.id);
      } else if (target.type === 'sequence') {
        mapNoteToSequence(data1, target.id);
      } else {
        mapNoteToAction(data1, target.type);
      }

      if (midiInputMonitor) {
        midiInputMonitor.style.backgroundColor = '#000';
        midiInputMonitor.textContent = `✓ Mapped NOTE ${data1} to ${target.label}`;
      }
    } else if (command === 0xB0) {
      // Control Change
      if (target.type === 'morph_duration' || target.type === 'auto_morph_speed') {
        mapCCToParameter(data1, target.type);
        if (midiInputMonitor) {
          midiInputMonitor.style.backgroundColor = '#000';
          midiInputMonitor.textContent = `✓ Mapped CC ${data1} to ${target.label}`;
        }
      } else {
        if (midiInputMonitor) {
          midiInputMonitor.style.backgroundColor = '#330000';
          midiInputMonitor.style.color = '#ff0000';
          midiInputMonitor.textContent = `✗ CC controls cannot be mapped to ${target.label}. Use notes instead.`;
        }
      }
    }

    refreshMIDIMappingsDisplay();
  });
}

/**
 * Refresh MIDI mappings display
 */
function refreshMIDIMappingsDisplay() {
  if (!midiPanelOpen) return;

  // Recreate the mappings section
  const oldSection = document.getElementById('midi-mappings-list');
  if (oldSection && oldSection.parentNode) {
    const newSection = createMIDIMappingsSection();
    oldSection.parentNode.replaceChild(newSection, oldSection.parentNode);

    // Since createMIDIMappingsSection returns a full section, we need to refresh the entire section
    // For now, let's just close and reopen the panel
    closeMIDIPanel();
    setTimeout(() => openMIDIPanel(), 100);
  }
}

/**
 * Start MIDI input monitoring
 */
function startMIDIInputMonitoring() {
  // Listen for MIDI messages globally to display them
  const originalHandleMIDI = window._originalMIDIHandler;

  // We'll add a global listener by patching the MIDI controller temporarily
  // For now, we'll use a simple interval to check recent MIDI activity
  // This is a simplified approach - a proper implementation would hook into midiController

  setInterval(() => {
    if (!midiPanelOpen || !midiInputMonitor || midiLearnMode) return;

    // This would ideally show recent MIDI messages
    // For now, we'll keep the monitor static unless in learn mode
  }, 100);
}

console.log("🎭 performanceMode.js ready");
