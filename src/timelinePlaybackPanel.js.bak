// Timeline Playback Panel (Phase 13.17)
// Dedicated viewer for playing back recorded timeline sessions
// Side-by-side comparison with live visuals

console.log("⏱️ timelinePlaybackPanel.js loaded");

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getTimeline } from './timelineIntegration.js';
import { createChestahedron, AXIS_OF_BEING } from './chestahedron.js';
import { chronelixIntegrator } from './chronelixMMPAIntegrator.js';
import { sexagenaryCyclePanel } from './sexagenaryCyclePanel.js';

/**
 * TimelinePlaybackPanel - Dedicated viewer for timeline playback
 * Opens automatically when timeline playback starts
 */
export class TimelinePlaybackPanel {
  constructor() {
    this.isOpen = false;
    this.panel = null;
    this.canvasContainer = null;

    // Three.js scene for playback
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;

    // Playback state
    this.timeline = null;
    this.animationFrame = null;

    // Chronelix spatial reference system
    this.chronelixGroup = null;
    this.lambdaSymbol = null;
    this.lambdaRotation = 0; // 0 to 2π
    this.selectedPosition = 0; // 0-11 chromatic position
    this.modwheelValue = 0; // 0-127 MIDI value

    // UI elements
    this.infoPanel = null;
    this.timeDisplay = null;
    this.frameDisplay = null;
    this.audioDisplay = null;
    this.mmpaDisplay = null;
    this.yantraDisplay = null;

    // Bibibinary integrator
    this.integrator = chronelixIntegrator;
    this.lastUpdateTime = performance.now();

    console.log("⏱️ TimelinePlaybackPanel initialized");
  }

  open() {
    if (this.isOpen) return;

    this.timeline = getTimeline();
    if (!this.timeline) {
      console.log('🧬 Opening chronelix viewer without timeline data (live mode)');
    }

    // Create panel container
    this.panel = document.createElement('div');
    this.panel.id = 'timelinePlaybackPanel';
    this.panel.style.cssText = `
      position: fixed;
      top: 60px;
      right: 20px;
      width: 650px;
      height: 90vh;
      max-height: 1100px;
      background: rgba(0, 0, 0, 0.95);
      border: 2px solid #4CAF50;
      border-radius: 8px;
      padding: 15px;
      z-index: 1000;
      font-family: 'Courier New', monospace;
      color: #fff;
      box-shadow: 0 0 30px rgba(76, 175, 80, 0.7);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    `;

    // Title bar with close button
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #4CAF50;
    `;

    const title = document.createElement('div');
    title.style.cssText = `
      font-size: 14px;
      font-weight: bold;
      color: #4CAF50;
      text-transform: uppercase;
      letter-spacing: 2px;
    `;
    title.textContent = '⏯️ Timeline Playback Viewer';

    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 10px;
      align-items: center;
    `;

    // Cylindrical Unwrap toggle button
    const unwrapButton = document.createElement('button');
    unwrapButton.textContent = '🔪 Unwrap';
    unwrapButton.style.cssText = `
      background: rgba(20, 184, 166, 0.2);
      border: 1px solid #14b8a6;
      color: #14b8a6;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 6px;
      transition: all 0.2s;
      font-family: 'Courier New', monospace;
    `;
    unwrapButton.onmouseover = () => {
      unwrapButton.style.background = 'rgba(20, 184, 166, 0.3)';
      unwrapButton.style.borderColor = '#14b8a6';
    };
    unwrapButton.onmouseout = () => {
      unwrapButton.style.background = 'rgba(20, 184, 166, 0.2)';
      unwrapButton.style.borderColor = '#14b8a6';
    };
    unwrapButton.onclick = () => {
      if (window.cylindricalUnwrapPanel) {
        window.cylindricalUnwrapPanel.toggle();
      } else {
        console.warn('Cylindrical unwrap panel not initialized');
      }
    };

    // Material Physics toggle button
    const physicsButton = document.createElement('button');
    physicsButton.textContent = '🔬 ARPT';
    physicsButton.style.cssText = `
      background: rgba(168, 85, 247, 0.2);
      border: 1px solid #a855f7;
      color: #a855f7;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 6px;
      transition: all 0.2s;
      font-family: 'Courier New', monospace;
      margin-left: 8px;
    `;
    physicsButton.onmouseover = () => {
      physicsButton.style.background = 'rgba(168, 85, 247, 0.3)';
      physicsButton.style.borderColor = '#a855f7';
    };
    physicsButton.onmouseout = () => {
      physicsButton.style.background = 'rgba(168, 85, 247, 0.2)';
      physicsButton.style.borderColor = '#a855f7';
    };
    physicsButton.onclick = () => {
      if (window.materialPhysicsPanel) {
        window.materialPhysicsPanel.toggle();
      } else {
        console.warn('Material physics panel not initialized');
      }
    };

    // Sexagenary Cycle toggle button
    const cycleButton = document.createElement('button');
    cycleButton.textContent = '🌀 Cycle';
    cycleButton.style.cssText = `
      background: rgba(255, 215, 0, 0.2);
      border: 1px solid #FFD700;
      color: #FFD700;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 6px;
      transition: all 0.2s;
      font-family: 'Courier New', monospace;
    `;
    cycleButton.onmouseover = () => {
      cycleButton.style.background = 'rgba(255, 215, 0, 0.3)';
      cycleButton.style.borderColor = '#FFD700';
    };
    cycleButton.onmouseout = () => {
      cycleButton.style.background = 'rgba(255, 215, 0, 0.2)';
      cycleButton.style.borderColor = '#FFD700';
    };
    cycleButton.onclick = () => {
      sexagenaryCyclePanel.toggle();
    };

    // Chronelix Mode selector dropdown
    const chronelixModeDropdown = document.createElement('select');
    chronelixModeDropdown.id = 'chronelixModeDropdown';
    chronelixModeDropdown.style.cssText = `
      background: rgba(255, 200, 87, 0.2);
      border: 1px solid #ffc857;
      color: #ffc857;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 6px;
      transition: all 0.2s;
      font-family: 'Courier New', monospace;
      outline: none;
    `;

    const chronelixModes = [
      { value: 'STANDARD', label: '⟨ Standard' },
      { value: 'ANALYSIS', label: '⚛ Analysis' },
      { value: 'LIVING_SYMBOL', label: '🌸 Living' }
    ];

    chronelixModes.forEach(mode => {
      const option = document.createElement('option');
      option.value = mode.value;
      option.textContent = mode.label;
      chronelixModeDropdown.appendChild(option);
    });

    chronelixModeDropdown.onmouseover = () => {
      chronelixModeDropdown.style.background = 'rgba(255, 200, 87, 0.3)';
      chronelixModeDropdown.style.borderColor = '#ffc857';
    };
    chronelixModeDropdown.onmouseout = () => {
      chronelixModeDropdown.style.background = 'rgba(255, 200, 87, 0.2)';
      chronelixModeDropdown.style.borderColor = '#ffc857';
    };
    chronelixModeDropdown.onchange = (e) => {
      const mode = e.target.value;
      if (window.chronelixModeManager) {
        window.chronelixModeManager.setMode(window.ChronelixMode[mode]);
        console.log(`🌸 Chronelix mode switched to: ${mode}`);
      } else {
        console.warn('⚠️ Chronelix mode manager not initialized');
      }
    };

    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.cssText = `
      background: none;
      border: 1px solid #4CAF50;
      color: #4CAF50;
      font-size: 18px;
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      transition: all 0.2s;
    `;
    closeButton.onmouseover = () => {
      closeButton.style.background = '#4CAF50';
      closeButton.style.color = '#000';
    };
    closeButton.onmouseout = () => {
      closeButton.style.background = 'none';
      closeButton.style.color = '#4CAF50';
    };
    closeButton.onclick = () => this.close();

    buttonContainer.appendChild(unwrapButton);
    buttonContainer.appendChild(physicsButton);
    buttonContainer.appendChild(cycleButton);
    buttonContainer.appendChild(chronelixModeDropdown);
    buttonContainer.appendChild(closeButton);

    titleBar.appendChild(title);
    titleBar.appendChild(buttonContainer);
    this.panel.appendChild(titleBar);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // TIMELINE CONTROLS SECTION (Moved from HUD)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    this.createTimelineControls();

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // NOTE: Sexagenary Cycle chart moved to separate panel (sexagenaryCyclePanel.js)
    // Click the "🌀 Cycle" button in the title bar to open it
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // Canvas container for Three.js renderer
    this.canvasContainer = document.createElement('div');
    this.canvasContainer.style.cssText = `
      width: 100%;
      height: 400px;
      background: #000;
      border: 1px solid #333;
      border-radius: 4px;
      margin-bottom: 10px;
      position: relative;
    `;
    this.panel.appendChild(this.canvasContainer);

    // Info panel for frame data
    this.infoPanel = document.createElement('div');
    this.infoPanel.style.cssText = `
      flex: 1;
      overflow-y: auto;
      font-size: 11px;
      line-height: 1.6;
    `;
    this.panel.appendChild(this.infoPanel);

    // Create display sections
    this.createDisplaySections();

    // Initialize Three.js scene
    this.initThreeJS();

    // Add to document
    document.body.appendChild(this.panel);
    this.isOpen = true;

    // Start render loop
    this.startRenderLoop();

    console.log('⏱️ Timeline Playback Panel opened');
  }

  createDisplaySections() {
    // Lambda Modwheel Control
    const lambdaSection = document.createElement('div');
    lambdaSection.style.cssText = `
      margin-bottom: 15px;
      padding: 10px;
      background: rgba(76, 175, 80, 0.1);
      border: 1px solid #4CAF50;
      border-radius: 4px;
    `;

    const lambdaTitle = document.createElement('div');
    lambdaTitle.textContent = 'λ Lambda Position (Chromatic Modwheel)';
    lambdaTitle.style.cssText = 'color: #FFD700; font-weight: bold; margin-bottom: 8px;';
    lambdaSection.appendChild(lambdaTitle);

    // Slider container
    const sliderContainer = document.createElement('div');
    sliderContainer.style.cssText = 'display: flex; align-items: center; gap: 10px;';

    // Discrete position slider (0-11 for 12 chromatic positions)
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '11';
    slider.value = '0';
    slider.step = '1';  // Discrete stepping
    slider.style.cssText = `
      flex: 1;
      height: 6px;
      background: linear-gradient(to right, #00CED1, #9400D3);
      border-radius: 3px;
      outline: none;
      cursor: pointer;
    `;

    // Value display
    const valueDisplay = document.createElement('span');
    valueDisplay.style.cssText = 'color: #FFD700; font-family: monospace; min-width: 80px;';
    valueDisplay.textContent = 'Pos 0 (0°)';

    // Slider input handler - discrete chromatic positions
    slider.oninput = (e) => {
      const position = parseInt(e.target.value);  // Direct 0-11 position
      this.setLambdaPosition(position);
      const degrees = Math.round(this.lambdaRotation * 180 / Math.PI);
      valueDisplay.textContent = `Pos ${position} (${degrees}°)`;
    };

    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(valueDisplay);
    lambdaSection.appendChild(sliderContainer);

    this.infoPanel.appendChild(lambdaSection);

    // Time and frame info
    const timeSection = document.createElement('div');
    timeSection.style.marginBottom = '10px';
    this.timeDisplay = document.createElement('div');
    this.timeDisplay.style.color = '#4CAF50';
    this.frameDisplay = document.createElement('div');
    this.frameDisplay.style.color = '#888';
    timeSection.appendChild(this.timeDisplay);
    timeSection.appendChild(this.frameDisplay);
    this.infoPanel.appendChild(timeSection);

    // Audio data
    const audioSection = document.createElement('div');
    audioSection.style.marginBottom = '10px';
    const audioTitle = document.createElement('div');
    audioTitle.textContent = 'Audio Bands:';
    audioTitle.style.cssText = 'color: #4CAF50; font-weight: bold; margin-bottom: 5px;';
    audioSection.appendChild(audioTitle);
    this.audioDisplay = document.createElement('div');
    this.audioDisplay.style.fontFamily = 'monospace';
    audioSection.appendChild(this.audioDisplay);
    this.infoPanel.appendChild(audioSection);

    // MMPA data
    const mmpaSection = document.createElement('div');
    const mmpaTitle = document.createElement('div');
    mmpaTitle.textContent = 'MMPA State:';
    mmpaTitle.style.cssText = 'color: #4CAF50; font-weight: bold; margin-bottom: 5px;';
    mmpaSection.appendChild(mmpaTitle);
    this.mmpaDisplay = document.createElement('div');
    this.mmpaDisplay.style.fontFamily = 'monospace';
    mmpaSection.appendChild(this.mmpaDisplay);
    this.infoPanel.appendChild(mmpaSection);

    // Bibibinary Yantra (Live MMPA Integration)
    const yantraSection = document.createElement('div');
    yantraSection.style.cssText = `
      margin-top: 15px;
      padding: 10px;
      background: linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(124, 58, 237, 0.1));
      border: 1px solid #FFD700;
      border-radius: 4px;
    `;
    const yantraTitle = document.createElement('div');
    yantraTitle.textContent = '🧬 Bibibinary Yantra (Audio × Optical)';
    yantraTitle.style.cssText = 'color: #FFD700; font-weight: bold; margin-bottom: 8px;';
    yantraSection.appendChild(yantraTitle);
    this.yantraDisplay = document.createElement('div');
    this.yantraDisplay.style.fontFamily = 'monospace';
    this.yantraDisplay.style.fontSize = '10px';
    this.yantraDisplay.style.lineHeight = '1.4';
    yantraSection.appendChild(this.yantraDisplay);
    this.infoPanel.appendChild(yantraSection);
  }

  /**
   * Create timeline playback controls (moved from HUD for better organization)
   */
  createTimelineControls() {
    const controlsSection = document.createElement('div');
    controlsSection.style.cssText = `
      margin-bottom: 15px;
      padding: 12px;
      background: rgba(76, 175, 80, 0.1);
      border: 1px solid #4CAF50;
      border-radius: 6px;
    `;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STATUS INDICATOR & FRAME COUNTER
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const statusContainer = document.createElement('div');
    statusContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    `;

    this.statusIndicator = document.createElement('div');
    this.statusIndicator.style.cssText = `
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #555;
      transition: background-color 0.3s;
    `;

    this.statusText = document.createElement('span');
    this.statusText.textContent = 'Ready';
    this.statusText.style.cssText = `
      font-weight: bold;
      font-size: 12px;
      color: #fff;
    `;

    this.frameCounter = document.createElement('span');
    this.frameCounter.textContent = '0 frames';
    this.frameCounter.style.cssText = `
      margin-left: auto;
      font-size: 11px;
      color: #888;
    `;

    statusContainer.appendChild(this.statusIndicator);
    statusContainer.appendChild(this.statusText);
    statusContainer.appendChild(this.frameCounter);
    controlsSection.appendChild(statusContainer);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // TIME DISPLAY
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const timeDisplayContainer = document.createElement('div');
    timeDisplayContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #ccc;
      font-family: monospace;
      margin-bottom: 8px;
    `;

    this.currentTimeSpan = document.createElement('span');
    this.currentTimeSpan.textContent = '0:00.00';

    this.durationSpan = document.createElement('span');
    this.durationSpan.textContent = '0:00.00';

    timeDisplayContainer.appendChild(this.currentTimeSpan);
    timeDisplayContainer.appendChild(this.durationSpan);
    controlsSection.appendChild(timeDisplayContainer);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // TIMELINE SCRUBBER
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    this.scrubberContainer = document.createElement('div');
    this.scrubberContainer.style.cssText = `
      width: 100%;
      height: 30px;
      position: relative;
      margin-bottom: 12px;
      cursor: pointer;
    `;

    const scrubberTrack = document.createElement('div');
    scrubberTrack.style.cssText = `
      width: 100%;
      height: 6px;
      background-color: #333;
      border-radius: 3px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    `;

    this.scrubberProgress = document.createElement('div');
    this.scrubberProgress.style.cssText = `
      width: 0%;
      height: 100%;
      background-color: #4CAF50;
      border-radius: 3px;
      transition: width 0.1s;
    `;

    this.scrubberHandle = document.createElement('div');
    this.scrubberHandle.style.cssText = `
      width: 16px;
      height: 16px;
      background-color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 0%;
      transform: translate(-50%, -50%);
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      transition: left 0.1s;
    `;

    scrubberTrack.appendChild(this.scrubberProgress);
    this.scrubberContainer.appendChild(scrubberTrack);
    this.scrubberContainer.appendChild(this.scrubberHandle);
    controlsSection.appendChild(this.scrubberContainer);

    // Scrubber interaction
    let scrubbing = false;

    const handleScrub = (e) => {
      if (!this.timeline) return;

      const rect = this.scrubberContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, x / rect.width));
      const status = this.timeline.getStatus();

      if (status.frameCount > 0) {
        const targetFrame = Math.floor(percent * status.frameCount);
        this.timeline.seek(targetFrame);
      }
    };

    this.scrubberContainer.addEventListener('mousedown', (e) => {
      scrubbing = true;
      handleScrub(e);
    });

    document.addEventListener('mousemove', (e) => {
      if (scrubbing) {
        handleScrub(e);
      }
    });

    document.addEventListener('mouseup', () => {
      scrubbing = false;
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // TRANSPORT CONTROLS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const transportContainer = document.createElement('div');
    transportContainer.style.cssText = `
      display: flex;
      gap: 6px;
      margin-bottom: 10px;
    `;

    // Record button
    this.recordButton = document.createElement('button');
    this.recordButton.textContent = '⏺ Record';
    this.recordButton.style.cssText = `
      flex: 1;
      padding: 8px;
      font-size: 13px;
      background: rgba(255, 0, 0, 0.2);
      border: 1px solid #ff0000;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    `;
    this.recordButton.addEventListener('click', () => {
      if (!this.timeline) return;
      const status = this.timeline.getStatus();
      if (status.recording) {
        this.timeline.stopRecording();
      } else {
        this.timeline.startRecording();
      }
    });

    // Play/Pause button
    this.playPauseButton = document.createElement('button');
    this.playPauseButton.textContent = '▶ Play';
    this.playPauseButton.style.cssText = `
      flex: 1;
      padding: 8px;
      font-size: 13px;
      background: rgba(76, 175, 80, 0.2);
      border: 1px solid #4CAF50;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    `;
    this.playPauseButton.disabled = true;
    this.playPauseButton.addEventListener('click', () => {
      if (!this.timeline) return;
      const status = this.timeline.getStatus();
      if (status.playing && !status.paused) {
        this.timeline.pause();
      } else if (status.paused) {
        this.timeline.play();
      } else {
        this.timeline.play();
      }
    });

    // Stop button
    this.stopButton = document.createElement('button');
    this.stopButton.textContent = '⏹ Stop';
    this.stopButton.style.cssText = `
      flex: 1;
      padding: 8px;
      font-size: 13px;
      background: rgba(128, 128, 128, 0.2);
      border: 1px solid #888;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    `;
    this.stopButton.disabled = true;
    this.stopButton.addEventListener('click', () => {
      if (!this.timeline) return;
      this.timeline.stop();
    });

    transportContainer.appendChild(this.recordButton);
    transportContainer.appendChild(this.playPauseButton);
    transportContainer.appendChild(this.stopButton);
    controlsSection.appendChild(transportContainer);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PLAYBACK CONTROLS (Speed & Loop)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const playbackContainer = document.createElement('div');
    playbackContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 10px;
      font-size: 12px;
    `;

    const speedLabel = document.createElement('label');
    speedLabel.textContent = 'Speed: ';
    speedLabel.style.color = '#ccc';

    this.speedSelect = document.createElement('select');
    this.speedSelect.style.cssText = `
      margin-left: 5px;
      padding: 4px;
      background: #222;
      color: #fff;
      border: 1px solid #4CAF50;
      border-radius: 3px;
    `;
    ['0.25x', '0.5x', '0.75x', '1x', '1.5x', '2x', '4x'].forEach(speed => {
      const option = document.createElement('option');
      option.value = speed;
      option.textContent = speed;
      if (speed === '1x') option.selected = true;
      this.speedSelect.appendChild(option);
    });
    this.speedSelect.addEventListener('change', (e) => {
      if (!this.timeline) return;
      const speed = parseFloat(e.target.value);
      this.timeline.setPlaybackSpeed(speed);
    });

    const loopLabel = document.createElement('label');
    loopLabel.textContent = 'Loop: ';
    loopLabel.style.color = '#ccc';

    this.loopCheckbox = document.createElement('input');
    this.loopCheckbox.type = 'checkbox';
    this.loopCheckbox.checked = false;
    this.loopCheckbox.addEventListener('change', (e) => {
      if (!this.timeline) return;
      this.timeline.loop = e.target.checked;
    });

    speedLabel.appendChild(this.speedSelect);
    loopLabel.appendChild(this.loopCheckbox);
    playbackContainer.appendChild(speedLabel);
    playbackContainer.appendChild(loopLabel);
    controlsSection.appendChild(playbackContainer);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FILE OPERATIONS (Save, Load, Clear)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const fileContainer = document.createElement('div');
    fileContainer.style.cssText = `
      display: flex;
      gap: 6px;
    `;

    // Save button
    this.saveButton = document.createElement('button');
    this.saveButton.textContent = '💾 Save';
    this.saveButton.style.cssText = `
      flex: 1;
      padding: 6px;
      font-size: 12px;
      background: rgba(33, 150, 243, 0.2);
      border: 1px solid #2196F3;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    `;
    this.saveButton.disabled = true;
    this.saveButton.addEventListener('click', () => {
      if (!this.timeline) return;
      this.timeline.download();
    });

    // Load button
    this.loadButton = document.createElement('button');
    this.loadButton.textContent = '📂 Load';
    this.loadButton.style.cssText = `
      flex: 1;
      padding: 6px;
      font-size: 12px;
      background: rgba(255, 193, 7, 0.2);
      border: 1px solid #FFC107;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    `;
    this.loadButton.addEventListener('click', () => {
      if (!this.timeline) return;
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const data = JSON.parse(event.target.result);
              this.timeline.importJSON(data);
            } catch (error) {
              console.error('⏱️ Failed to load timeline:', error);
              alert('Failed to load timeline file');
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    });

    // Clear button
    this.clearButton = document.createElement('button');
    this.clearButton.textContent = '🗑️ Clear';
    this.clearButton.style.cssText = `
      flex: 1;
      padding: 6px;
      font-size: 12px;
      background: rgba(244, 67, 54, 0.2);
      border: 1px solid #F44336;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    `;
    this.clearButton.disabled = true;
    this.clearButton.addEventListener('click', () => {
      if (!this.timeline) return;
      if (confirm('Clear timeline data?')) {
        this.timeline.clear();
      }
    });

    fileContainer.appendChild(this.saveButton);
    fileContainer.appendChild(this.loadButton);
    fileContainer.appendChild(this.clearButton);
    controlsSection.appendChild(fileContainer);

    // Add controls section to panel
    this.panel.appendChild(controlsSection);

    // Add pulse animation style
    if (!document.getElementById('timeline-pulse-style')) {
      const style = document.createElement('style');
      style.id = 'timeline-pulse-style';
      style.textContent = `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `;
      document.head.appendChild(style);
    }

    // Subscribe to timeline state changes if timeline exists
    if (this.timeline) {
      this.timeline.onStateChange = (status) => this.updateTimelineUI(status);
      // Initial UI update
      this.updateTimelineUI(this.timeline.getStatus());
    }

    console.log('⏱️ Timeline controls created in Chronelix viewer');
  }

  /**
   * Update timeline UI based on current state
   */
  updateTimelineUI(status) {
    if (!status) return;

    // Status indicator
    if (status.recording) {
      this.statusIndicator.style.backgroundColor = '#ff0000';
      this.statusIndicator.style.animation = 'pulse 1s infinite';
      this.statusText.textContent = '● Recording';
    } else if (status.playing && !status.paused) {
      this.statusIndicator.style.backgroundColor = '#4CAF50';
      this.statusIndicator.style.animation = 'none';
      this.statusText.textContent = '▶ Playing';
    } else if (status.paused) {
      this.statusIndicator.style.backgroundColor = '#FFA500';
      this.statusIndicator.style.animation = 'none';
      this.statusText.textContent = '⏸ Paused';
    } else if (status.hasData) {
      this.statusIndicator.style.backgroundColor = '#2196F3';
      this.statusIndicator.style.animation = 'none';
      this.statusText.textContent = 'Ready';
    } else {
      this.statusIndicator.style.backgroundColor = '#555';
      this.statusIndicator.style.animation = 'none';
      this.statusText.textContent = 'Ready';
    }

    // Frame counter
    this.frameCounter.textContent = `${status.frameCount} frames`;

    // Time display
    const TimelineManager = this.timeline.constructor;
    this.currentTimeSpan.textContent = TimelineManager.formatTime(status.currentTime);
    this.durationSpan.textContent = TimelineManager.formatTime(status.duration);

    // Progress bar
    const progress = status.frameCount > 0 ? (status.currentFrame / status.frameCount) * 100 : 0;
    this.scrubberProgress.style.width = `${progress}%`;
    this.scrubberHandle.style.left = `${progress}%`;

    // Button states
    this.recordButton.textContent = status.recording ? '⏹ Stop Rec' : '⏺ Record';
    this.recordButton.disabled = status.playing;

    this.playPauseButton.textContent = (status.playing && !status.paused) ? '⏸ Pause' : '▶ Play';
    this.playPauseButton.disabled = !status.hasData || status.recording;

    this.stopButton.disabled = !status.playing || status.recording;

    this.saveButton.disabled = !status.hasData || status.recording || status.playing;
    this.clearButton.disabled = !status.hasData || status.recording || status.playing;
  }

  /**
   * MMPA Chronelix Waveguide - Pipeline Visualizer
   * Based on φ-spacing and proper AM/PM chirality
   */

  // Chronelix constants
  get CHRONELIX_CONSTANTS() {
    const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio ~1.618034
    const SCALE_FACTOR = 0.8;
    const UNITS_PER_CHAIN = 12; // 12 AM + 12 PM = 24 total
    const HELIX_RADIUS = 15.0;
    const Y_TOTAL_HEIGHT = HELIX_RADIUS * PHI; // φ-based height ~24.27
    const Y_OFFSET_PER_UNIT = Y_TOTAL_HEIGHT / UNITS_PER_CHAIN;
    const TOTAL_ANGLE = 2 * Math.PI;
    const GLOBAL_ROTATION_INCREMENT = TOTAL_ANGLE / UNITS_PER_CHAIN;
    const TWIST_FACTOR = 1.0;
    const LOCAL_TWIST_INCREMENT = GLOBAL_ROTATION_INCREMENT * TWIST_FACTOR;

    // Normalized Chestahedron vertices (Z-up convention)
    const V_SET_UNSCALED = [
      [0.0000, 3.1492, 0.0000],   // V0: Apex
      [1.7915, 0.8123, 0.0000],   // V1: Mid1
      [-0.8957, 0.8123, 1.5501],  // V2: Mid2
      [-0.8957, 0.8123, -1.5501], // V3: Mid3
      [1.1566, -1.7456, 2.0034],  // V4: Base1
      [-2.3133, -1.7456, 0.0000], // V5: Base2
      [1.1566, -1.7456, -2.0034], // V6: Base3
    ];

    const CH_Y_APEX_UNSCALED = 3.1492;
    const CH_Y_BASE_UNSCALED = -1.7456;
    const CH_Y_CENTER = (CH_Y_APEX_UNSCALED + CH_Y_BASE_UNSCALED) / 2 * SCALE_FACTOR;
    const APEX_TO_CENTER_HEIGHT = (CH_Y_APEX_UNSCALED - CH_Y_CENTER/SCALE_FACTOR) * SCALE_FACTOR;
    const BASE_TO_CENTER_HEIGHT = (CH_Y_CENTER/SCALE_FACTOR - CH_Y_BASE_UNSCALED) * SCALE_FACTOR;

    return {
      PHI,
      SCALE_FACTOR,
      UNITS_PER_CHAIN,
      HELIX_RADIUS,
      Y_TOTAL_HEIGHT,
      Y_OFFSET_PER_UNIT,
      GLOBAL_ROTATION_INCREMENT,
      LOCAL_TWIST_INCREMENT,
      V_SET_UNSCALED,
      CH_Y_CENTER,
      APEX_TO_CENTER_HEIGHT,
      BASE_TO_CENTER_HEIGHT,
      TEAL_COLOR: 0x14b8a6,     // AM - Input/Consonance
      VIOLET_COLOR: 0x7c3aed,   // PM - Output/Dissonance
      AMBER_COLOR: 0xfacc15     // Lambda indicator
    };
  }

  /**
   * Create base Chestahedron geometry with chirality support
   * @param {boolean} isChiral - If true, mirrors the geometry (PM chain)
   */
  createBaseChronelixGeometry(isChiral) {
    const C = this.CHRONELIX_CONSTANTS;
    const positions = [];

    // Vertex indices
    const V_APEX = 0, V_MID1 = 1, V_MID2 = 2, V_MID3 = 3;
    const V_BASE1 = 4, V_BASE2 = 5, V_BASE3 = 6;

    // Convert vertices to positions array
    C.V_SET_UNSCALED.forEach(v => {
      positions.push(
        v[0] * C.SCALE_FACTOR * (isChiral ? -1 : 1), // Mirror X for chiral
        v[1] * C.SCALE_FACTOR - C.CH_Y_CENTER,
        v[2] * C.SCALE_FACTOR
      );
    });

    // Face indices (7 faces total)
    let indices = [
      // 3 Kite faces
      V_APEX, V_MID1, V_BASE1, V_APEX, V_BASE1, V_MID2,
      V_APEX, V_MID2, V_BASE2, V_APEX, V_BASE2, V_MID3,
      V_APEX, V_MID3, V_BASE3, V_APEX, V_BASE3, V_MID1,
      // 3 Side triangles + 1 Base triangle
      V_MID1, V_BASE1, V_BASE3,
      V_MID2, V_BASE2, V_BASE1,
      V_MID3, V_BASE3, V_BASE2,
      V_BASE1, V_BASE2, V_BASE3,
    ];

    // Reverse winding order for chiral (mirrored) geometry
    if (isChiral) {
      for (let i = 0; i < indices.length; i += 3) {
        const temp = indices[i + 1];
        indices[i + 1] = indices[i + 2];
        indices[i + 2] = temp;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.rotateY(-Math.PI / 6);
    geometry.computeVertexNormals();

    // Apply centering offset
    geometry.translate(0, 0, -C.CH_Y_CENTER * C.SCALE_FACTOR);

    return geometry;
  }

  /**
   * Create a Chestahedron mesh with wireframe for chronelix unit
   */
  createChronelixMesh(geometry, color, opacity) {
    const material = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.8,
      roughness: 0.1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: opacity,
      wireframe: false
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Add wireframe edges
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
      color: color,
      linewidth: 2.5,
      opacity: 0.8,
      transparent: true
    }));
    mesh.add(line);

    return mesh;
  }

  /**
   * Create one interlocking chain (AM or PM)
   * @param {number} startAngleOffset - Starting angular offset (0 for AM, π for PM)
   * @param {number} color - Chain color (teal or violet)
   * @param {boolean} isChiral - If true, creates mirrored PM chain
   */
  createInterlockingChain(startAngleOffset, color, isChiral) {
    const C = this.CHRONELIX_CONSTANTS;
    const group = new THREE.Group();
    const geometry = this.createBaseChronelixGeometry(isChiral);

    for (let i = 0; i < C.UNITS_PER_CHAIN; i++) {
      // 1. Position on helix (φ-based spacing)
      const globalAngle = (i * C.GLOBAL_ROTATION_INCREMENT) + startAngleOffset;
      const y = (i * C.Y_OFFSET_PER_UNIT) - (C.Y_TOTAL_HEIGHT / 2);
      const x = C.HELIX_RADIUS * Math.cos(globalAngle);
      const z = C.HELIX_RADIUS * Math.sin(globalAngle);

      const mesh = this.createChronelixMesh(geometry, color, 0.5);

      // 2. Local twist
      const localTwist = i * C.LOCAL_TWIST_INCREMENT;
      mesh.rotation.y = globalAngle + Math.PI / 2 + localTwist;

      // 3. Polarity flip for PM chain (base-up)
      if (isChiral) {
        mesh.rotation.x = Math.PI;
      }

      mesh.position.set(x, y, z);
      mesh.userData.chain = isChiral ? 'PM' : 'AM';
      mesh.userData.position = i;

      group.add(mesh);
    }

    return group;
  }

  /**
   * Create transparent cylindrical waveguide (the pipeline itself)
   */
  createCylindricalWaveguide() {
    const C = this.CHRONELIX_CONSTANTS;
    const cylinderRadius = C.HELIX_RADIUS + 3.5;
    const geometry = new THREE.CylinderGeometry(
      cylinderRadius,
      cylinderRadius,
      C.Y_TOTAL_HEIGHT * 1.05,
      64,
      1,
      true // Open-ended
    );

    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.9,
      roughness: 0.1,
      side: THREE.BackSide, // Render interior surface
      transparent: true,
      opacity: 0.05 // Very transparent - shows data flow
    });

    return new THREE.Mesh(geometry, material);
  }

  /**
   * Create continuity caps and lambda symbols
   * Now with teal (AM/input) and violet (PM/output) labels for flow direction
   */
  createContinuityCaps() {
    const C = this.CHRONELIX_CONSTANTS;
    const capsGroup = new THREE.Group();
    const capRadius = C.HELIX_RADIUS + 0.5;

    const capMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    });

    const capGeometry = new THREE.CircleGeometry(capRadius, 32);
    capGeometry.rotateX(-Math.PI / 2); // Lay flat

    // Helper: Create lambda symbol geometry
    const createLambdaGeometry = (size = 4.0) => {
      const lambdaShape = new THREE.Shape();
      lambdaShape.moveTo(-size * 0.5, 0);
      lambdaShape.lineTo(0, size);
      lambdaShape.lineTo(size * 0.5, 0);
      lambdaShape.lineTo(size * 0.3, 0);
      lambdaShape.lineTo(0, size * 0.75);
      lambdaShape.lineTo(-size * 0.3, 0);
      lambdaShape.closePath();

      return new THREE.ExtrudeGeometry(lambdaShape, {
        steps: 1,
        depth: 0.1,
        bevelEnabled: false
      });
    };

    // ═══════════════════════════════════════════════════════════════
    // TOP CAP - AM / INPUT (Teal)
    // ═══════════════════════════════════════════════════════════════
    const yTopCenter = ((C.UNITS_PER_CHAIN - 1) * C.Y_OFFSET_PER_UNIT) - (C.Y_TOTAL_HEIGHT / 2);
    const yTopCap = yTopCenter + C.APEX_TO_CENTER_HEIGHT;

    // Top cap circle
    const topCap = new THREE.Mesh(capGeometry, capMaterial);
    topCap.position.y = yTopCap;
    capsGroup.add(topCap);

    // Teal lambda - AM / Input marker
    const lambdaTopGeometry = createLambdaGeometry(4.0);
    const lambdaTopMaterial = new THREE.MeshBasicMaterial({
      color: C.TEAL_COLOR, // AM color
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });

    const lambdaTopMesh = new THREE.Mesh(lambdaTopGeometry, lambdaTopMaterial);
    lambdaTopMesh.position.set(0, yTopCap + 0.15, 0);
    lambdaTopMesh.rotation.x = -Math.PI / 2;
    lambdaTopMesh.rotation.z = Math.PI / 6;
    capsGroup.add(lambdaTopMesh);

    // Store top lambda for rotation updates (controlled by modwheel)
    this.lambdaMeshTop = lambdaTopMesh;

    // "AM" text label above top cap
    // We'll create a simple text sprite using canvas
    const createTextSprite = (text, color, size = 2.0) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
      ctx.font = 'bold 80px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 64);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(size, size / 2, 1);
      return sprite;
    };

    const amLabel = createTextSprite('λ AM', C.TEAL_COLOR);
    amLabel.position.set(0, yTopCap + 2.5, 0);
    capsGroup.add(amLabel);

    // ═══════════════════════════════════════════════════════════════
    // BOTTOM CAP - PM / OUTPUT (Violet)
    // ═══════════════════════════════════════════════════════════════
    const yBottomCenter = 0 - (C.Y_TOTAL_HEIGHT / 2);
    const yBottomCap = yBottomCenter - C.BASE_TO_CENTER_HEIGHT;

    // Bottom cap circle
    const bottomCap = new THREE.Mesh(capGeometry, capMaterial);
    bottomCap.position.y = yBottomCap;
    capsGroup.add(bottomCap);

    // Violet lambda - PM / Output marker
    const lambdaBottomGeometry = createLambdaGeometry(4.0);
    const lambdaBottomMaterial = new THREE.MeshBasicMaterial({
      color: C.VIOLET_COLOR, // PM color
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });

    const lambdaBottomMesh = new THREE.Mesh(lambdaBottomGeometry, lambdaBottomMaterial);
    lambdaBottomMesh.position.set(0, yBottomCap - 0.15, 0);
    lambdaBottomMesh.rotation.x = -Math.PI / 2;
    lambdaBottomMesh.rotation.z = Math.PI / 6;
    capsGroup.add(lambdaBottomMesh);

    // Store bottom lambda for rotation updates (controlled by modwheel)
    this.lambdaMeshBottom = lambdaBottomMesh;

    // "PM" text label below bottom cap
    const pmLabel = createTextSprite('λ PM', C.VIOLET_COLOR);
    pmLabel.position.set(0, yBottomCap - 2.5, 0);
    capsGroup.add(pmLabel);

    console.log('🧬 Continuity caps created with λ AM (teal/input) and λ PM (violet/output) markers');
    return capsGroup;
  }

  /**
   * Create complete chronelix waveguide system
   * Replaces old sphere-based helix with proper pipeline visualizer
   */
  createChronelixHelix() {
    const C = this.CHRONELIX_CONSTANTS;
    const chronelixGroup = new THREE.Group();

    // 1. Cylindrical waveguide (the pipeline)
    const waveguide = this.createCylindricalWaveguide();
    chronelixGroup.add(waveguide);

    // 2. AM Chain (Input - Teal, Consonance, Right-handed, Apex-up)
    const amChain = this.createInterlockingChain(0, C.TEAL_COLOR, false);
    chronelixGroup.add(amChain);

    // 3. PM Chain (Output - Violet, Dissonance, Left-handed, Base-up)
    const pmChain = this.createInterlockingChain(Math.PI, C.VIOLET_COLOR, true);
    chronelixGroup.add(pmChain);

    // 4. Continuity caps and lambda symbol
    const caps = this.createContinuityCaps();
    chronelixGroup.add(caps);

    // Apply slight tilt for better viewing
    chronelixGroup.rotation.x = -Math.PI / 8;

    console.log('🧬 Chronelix waveguide created: φ-spaced pipeline with AM/PM chains');
    return chronelixGroup;
  }

  /**
   * Create lambda (λ) symbol as interactive tuning needle
   * (Kept for compatibility - now integrated into continuity caps)
   */
  createLambdaSymbol() {
    // Lambda is now part of the caps system
    // Return empty group for compatibility
    return new THREE.Group();
  }

  /**
   * Set lambda position from discrete chromatic position (0-11)
   * @param {number} position - Discrete chromatic position (0-11)
   */
  setLambdaPosition(position) {
    // Clamp to valid range
    this.selectedPosition = Math.max(0, Math.min(11, Math.floor(position)));

    // Convert discrete position to rotation angle (30° increments) - for display only
    // Position 0 = 0°, Position 1 = 30°, Position 2 = 60°, ..., Position 11 = 330°
    this.lambdaRotation = (this.selectedPosition / 12) * Math.PI * 2;

    // Keep modwheel value in sync for compatibility (map back to MIDI range)
    this.modwheelValue = Math.round((this.selectedPosition / 11) * 127);

    console.log(`λ Position: ${this.selectedPosition} → X-axis tilt chromatic step (automatic rotation continues)`);

    // Send X-axis tilt to integrator (controls cylindrical slicer tilt angle)
    if (window.chronelixIntegrator) {
      window.chronelixIntegrator.setSlicerXAxisTilt(this.selectedPosition);
    }
  }

  /**
   * Legacy MIDI modwheel support - converts MIDI 0-127 to discrete positions
   * @param {number} midiValue - MIDI modwheel value (0-127)
   * @deprecated Use setLambdaPosition() with discrete 0-11 values instead
   */
  setModwheelPosition(midiValue) {
    // Convert MIDI to discrete position and delegate to setLambdaPosition
    const discretePosition = Math.floor((midiValue / 127) * 12);
    this.setLambdaPosition(discretePosition);
  }

  /**
   * Update lambda rotation based on current settings
   */
  updateLambdaRotation() {
    // Rotate both lambda symbols together (same chromatic position at input and output)
    if (this.lambdaMeshTop) {
      this.lambdaMeshTop.rotation.z = this.lambdaRotation + Math.PI / 6;
    }
    if (this.lambdaMeshBottom) {
      this.lambdaMeshBottom.rotation.z = this.lambdaRotation + Math.PI / 6;
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // NOTE: drawEarthlyBranchesChart method removed
  // Chart now lives in sexagenaryCyclePanel.js (separate window)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  initThreeJS() {
    // Create Three.js scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Get dimensions (fallback to fixed size if container not sized yet)
    const width = this.canvasContainer.clientWidth || 570;
    const height = this.canvasContainer.clientHeight || 400;

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    // Position camera to view full chronelix helix (height=6, radius=3.5)
    this.camera.position.set(8, 3, 8);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.canvasContainer.appendChild(this.renderer.domElement);

    // OrbitControls for zoom, pan, rotate
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Smooth movement
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2;  // Minimum zoom distance
    this.controls.maxDistance = 50; // Maximum zoom distance
    this.controls.enablePan = true;
    this.controls.enableRotate = true;
    this.controls.enableZoom = true;
    console.log("🎮 OrbitControls enabled (zoom, pan, rotate)");

    // Create MMPA Chestahedron with semantic component colors
    // MMPA Face Mapping:
    // Face 0 (Kite 1) → Identity (Pitch/Core): Cyan
    // Face 1 (Kite 2) → Relationship (Harmony): Green
    // Face 2 (Kite 3) → Complexity (Spectral): Magenta
    // Face 3 (Side Triangle) → Transformation (Flux): Orange-Red
    // Face 4 (Side Triangle) → Alignment (Coherence): Yellow
    // Face 5 (Side Triangle) → Potential (Entropy): Violet
    // Face 6 (Base Triangle) → Dominant State: Gold (highlights)

    const mmpaFaceColors = [
      0x00ffff, // Face 0: Identity - Cyan (fundamental frequency, stable)
      0x00ff00, // Face 1: Relationship - Green (harmony, balance)
      0xff00ff, // Face 2: Complexity - Magenta (spectral richness)
      0xff4400, // Face 3: Transformation - Red-Orange (flux, change)
      0xffff00, // Face 4: Alignment - Yellow (coherence, clarity)
      0x8800ff, // Face 5: Potential - Violet (entropy, chaos)
      0xffc01f  // Face 6: Dominant - Gold (current state highlight)
    ];

    // Create Chestahedron with custom materials for each face
    const materialOptions = {
      metalness: 0.7,
      roughness: 0.3,
      side: THREE.DoubleSide,
      transparent: false,
      opacity: 1.0,
      emissive: 0x000000,
      emissiveIntensity: 0.3
    };

    this.mesh = createChestahedron(1.5, materialOptions);

    // Override materials with MMPA colors
    for (let i = 0; i < 7; i++) {
      this.mesh.material[i].color.setHex(mmpaFaceColors[i]);
      this.mesh.material[i].emissive.setHex(mmpaFaceColors[i]);
      this.mesh.material[i].emissiveIntensity = 0.2; // Subtle glow
    }

    this.scene.add(this.mesh);

    // Store materials for dynamic updates
    this.materials = this.mesh.material;

    // Create chronelix spatial reference system
    this.chronelixGroup = this.createChronelixHelix();
    this.scene.add(this.chronelixGroup);

    // Create lambda tuning needle
    this.lambdaSymbol = this.createLambdaSymbol();
    this.scene.add(this.lambdaSymbol);

    // Lighting for MeshStandardMaterial
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    this.scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x4444ff, 0.4);
    directionalLight2.position.set(-5, -3, -5);
    this.scene.add(directionalLight2);

    // Connect bibibinary integrator for live MMPA→Chronelix modulation
    const connected = this.integrator.connect(this);
    if (connected) {
      console.log('🧬 Bibibinary integrator connected - Audio×Optical→Chronelix modulation active');
    }

    console.log('⏱️ Three.js scene initialized with MMPA Chestahedron', { width, height });
  }

  startRenderLoop() {
    console.log('⏱️ Starting render loop', {
      hasRenderer: !!this.renderer,
      hasScene: !!this.scene,
      hasCamera: !!this.camera,
      hasMesh: !!this.mesh
    });

    const animate = () => {
      if (!this.isOpen) return;

      this.animationFrame = requestAnimationFrame(animate);

      // Rotation disabled - base stays facing AM λ (top), apex stays facing PM λ (bottom)
      // The 36-degree X-axis tilt is already applied during mesh creation
      if (this.mesh) {
        // this.mesh.rotation.y += 0.01; // ROTATION DISABLED
      }

      // Update bibibinary integrator (live MMPA modulation)
      const currentTime = performance.now();
      const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convert to seconds
      this.lastUpdateTime = currentTime;
      this.integrator.update(deltaTime);

      // Update lambda needle rotation
      this.updateLambdaRotation();

      // Update yantra display
      this.updateYantraDisplay();

      // NOTE: Earthly Branches chart rendering removed
      // Chart now lives in sexagenaryCyclePanel.js (separate window with its own render loop)

      // Update OrbitControls (required for damping)
      if (this.controls) {
        this.controls.update();
      }

      // Update visualization from current timeline frame
      this.updateFromTimeline();

      // Render scene
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };

    animate();
  }

  updateFromTimeline() {
    if (!this.timeline) return;

    const status = this.timeline.getStatus();
    const frame = this.timeline.getCurrentFrame();

    if (!frame) {
      this.timeDisplay.textContent = 'No frame data';
      return;
    }

    // Update time display
    const currentTime = status.currentTime;
    const duration = status.duration;
    this.timeDisplay.textContent = `Time: ${this.formatTime(currentTime)} / ${this.formatTime(duration)}`;
    this.frameDisplay.textContent = `Frame: ${frame.index} / ${status.frameCount}`;

    // Update audio display
    if (frame.audio && frame.audio.bands) {
      const { bass, mid, treble } = frame.audio.bands;
      this.audioDisplay.innerHTML = `
        Bass:   ${(bass * 100).toFixed(1)}% ${'█'.repeat(Math.floor(bass * 20))}
<br>Mid:    ${(mid * 100).toFixed(1)}% ${'█'.repeat(Math.floor(mid * 20))}
<br>Treble: ${(treble * 100).toFixed(1)}% ${'█'.repeat(Math.floor(treble * 20))}
<br>Level:  ${(frame.audio.level * 100).toFixed(1)}%
      `;

      // Update Chestahedron based on audio
      if (this.mesh) {
        // No rotation - base stays facing AM λ (top), apex stays facing PM λ (bottom)
        const audioEnergy = (bass + mid + treble) / 3;
        // this.mesh.rotation.z += audioEnergy * 0.02; // ROTATION DISABLED

        // Audio-reactive scale (pulse with audio level)
        const scale = 1.0 + frame.audio.level * 0.3;
        this.mesh.scale.setScalar(scale);
      }
    }

    // Update MMPA display and Chestahedron face colors
    if (frame.mmpa && frame.mmpa.attribution) {
      const attr = frame.mmpa.attribution;
      this.mmpaDisplay.innerHTML = `
        Dominant: ${attr.dominant || 'N/A'}
<br>Instability: ${((attr.instability || 0) * 100).toFixed(1)}%
<br>Top Component: ${attr.top3?.[0]?.name || 'N/A'}
      `;

      // Update Chestahedron face intensities based on MMPA attribution
      if (this.materials && attr.top3) {
        // Map component names to face indices
        const componentToFace = {
          'Identity': 0,
          'Relationship': 1,
          'Complexity': 2,
          'Transformation': 3,
          'Alignment': 4,
          'Potential': 5
        };

        // Reset all faces to dim intensity
        for (let i = 0; i < 6; i++) {
          this.materials[i].emissiveIntensity = 0.1;
        }

        // Highlight top 3 components based on their contribution
        attr.top3.forEach((component, idx) => {
          const faceIdx = componentToFace[component.name];
          if (faceIdx !== undefined) {
            // Brighter based on contribution (0.3 to 0.8 range)
            const intensity = 0.3 + component.contribution * 0.5;
            this.materials[faceIdx].emissiveIntensity = intensity;
          }
        });

        // Highlight dominant face (Face 6 - base triangle, gold)
        if (attr.dominant && componentToFace[attr.dominant] !== undefined) {
          const dominantFaceIdx = componentToFace[attr.dominant];
          const dominantIntensity = this.materials[dominantFaceIdx].emissiveIntensity;
          this.materials[6].emissiveIntensity = 0.4 + dominantIntensity * 0.6;
        }
      }
    } else {
      this.mmpaDisplay.textContent = 'No MMPA data';
      // Reset all face intensities when no MMPA data
      if (this.materials) {
        for (let i = 0; i < 7; i++) {
          this.materials[i].emissiveIntensity = 0.2;
        }
      }
    }
  }

  /**
   * Update yantra display with live bibibinary data
   */
  updateYantraDisplay() {
    if (!this.yantraDisplay) return;

    const yantra = this.integrator.getYantra();
    const debug = this.integrator.getDebugInfo();

    this.yantraDisplay.innerHTML = `
<span style="color: #14b8a6">Audio:</span> ${yantra.audioPattern || 'N/A'}
<span style="color: #7c3aed">Optical:</span> ${yantra.opticalPattern || 'N/A'}
<span style="color: #FFD700">Sync:</span> ${yantra.synchronicityPattern || 'N/A'} (${debug.synchronicity})
<span style="color: #FFD700">λ:</span> ${debug.lambdaRotation} @ ${debug.lambdaVelocity}
<span style="color: #888">Chirality:</span> ${debug.chirality}

<span style="color: #FFD700; font-weight: bold;">📜 ${yantra.incantation || 'Awaiting signal...'}</span>
    `.trim();
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }

  close() {
    if (!this.isOpen) return;

    // Stop animation loop
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    // Dispose Three.js resources
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    // Dispose OrbitControls
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }

    // Dispose Chronelix helix group
    if (this.chronelixGroup) {
      this.chronelixGroup.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      this.chronelixGroup = null;
    }

    // Dispose Lambda meshes (now part of caps system)
    if (this.lambdaMeshTop) {
      if (this.lambdaMeshTop.geometry) this.lambdaMeshTop.geometry.dispose();
      if (this.lambdaMeshTop.material) this.lambdaMeshTop.material.dispose();
      this.lambdaMeshTop = null;
    }
    if (this.lambdaMeshBottom) {
      if (this.lambdaMeshBottom.geometry) this.lambdaMeshBottom.geometry.dispose();
      if (this.lambdaMeshBottom.material) this.lambdaMeshBottom.material.dispose();
      this.lambdaMeshBottom = null;
    }

    // Dispose old lambda symbol (compatibility)
    if (this.lambdaSymbol) {
      this.lambdaSymbol.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
      this.lambdaSymbol = null;
    }

    // Dispose Chestahedron geometry and materials
    if (this.mesh) {
      if (this.mesh.geometry) {
        this.mesh.geometry.dispose();
      }
      if (Array.isArray(this.mesh.material)) {
        // Dispose all face materials
        this.mesh.material.forEach(mat => mat.dispose());
      } else if (this.mesh.material) {
        this.mesh.material.dispose();
      }
      this.mesh = null;
    }
    this.materials = null;

    // Remove panel from DOM
    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
    }

    this.panel = null;
    this.isOpen = false;
    this.timeline = null;

    console.log('⏱️ Timeline Playback Panel closed');
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

// Create singleton instance
export const timelinePlaybackPanel = new TimelinePlaybackPanel();

// Expose globally for easy access
if (typeof window !== 'undefined') {
  window.TimelinePlaybackPanel = timelinePlaybackPanel;
}

console.log("⏱️ Timeline Playback Panel module ready");
