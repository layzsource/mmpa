// src/hudCamera.js
// HUD interface for camera signal providers
// Control panel for camera/OSC/biosignal inputs

console.log("📷 hudCamera.js loaded");

/**
 * Create Camera Signal HUD section
 */
export function createCameraHUD(container) {
  const section = document.createElement('div');
  section.className = 'hud-section camera-signals';
  section.style.maxWidth = '500px';

  const title = document.createElement('h3');
  title.textContent = '📷 Camera & Biosignals';
  section.appendChild(title);

  const intro = document.createElement('p');
  intro.textContent = 'Camera pose/gesture detection, OSC input, and biosignal adapters. Signals route to geometry, particles, and navigation.';
  intro.style.cssText = `
    font-size: 11px;
    margin-bottom: 12px;
    opacity: 0.8;
  `;
  section.appendChild(intro);

  // === CAMERA INPUT ===
  const cameraSection = document.createElement('div');
  cameraSection.style.marginBottom = '16px';

  const cameraTitle = document.createElement('h4');
  cameraTitle.textContent = '📹 Camera Input';
  cameraTitle.style.fontSize = '13px';
  cameraTitle.style.marginBottom = '8px';
  cameraSection.appendChild(cameraTitle);

  // Camera status
  const cameraStatus = document.createElement('div');
  cameraStatus.id = 'camera-status';
  cameraStatus.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 10px;
    margin-bottom: 8px;
  `;
  cameraStatus.innerHTML = '<div style="opacity: 0.6;">Not started</div>';
  cameraSection.appendChild(cameraStatus);

  // Camera controls
  const cameraControls = document.createElement('div');
  cameraControls.style.display = 'grid';
  cameraControls.style.gridTemplateColumns = '1fr 1fr';
  cameraControls.style.gap = '8px';
  cameraControls.style.marginBottom = '12px';

  const startCameraButton = document.createElement('button');
  startCameraButton.textContent = '▶️ Start Camera';
  startCameraButton.style.cssText = `
    padding: 8px;
    background: #32CD32;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    font-size: 11px;
  `;
  startCameraButton.addEventListener('click', async () => {
    if (!window.cameraSignalProvider) return;

    startCameraButton.disabled = true;
    startCameraButton.textContent = '⏳ Starting...';

    const result = await window.cameraSignalProvider.start();
    if (result.ok) {
      startCameraButton.textContent = '⏸️ Stop';
      startCameraButton.style.background = '#DC143C';
      startCameraButton.disabled = false;
      startCameraButton.onclick = stopCamera;
      updateCameraStatus();
    } else {
      alert(`Camera failed: ${result.error}`);
      startCameraButton.disabled = false;
      startCameraButton.textContent = '▶️ Start Camera';
    }
  });
  cameraControls.appendChild(startCameraButton);

  function stopCamera() {
    if (!window.cameraSignalProvider) return;
    window.cameraSignalProvider.stop();
    startCameraButton.textContent = '▶️ Start Camera';
    startCameraButton.style.background = '#32CD32';
    startCameraButton.onclick = () => startCameraButton.click();
    updateCameraStatus();
  }

  const togglePoseButton = document.createElement('button');
  togglePoseButton.textContent = '🧍 Enable Pose';
  togglePoseButton.style.padding = '8px';
  togglePoseButton.style.fontSize = '11px';
  togglePoseButton.addEventListener('click', () => {
    if (window.cameraSignalProvider) {
      window.cameraSignalProvider.enablePoseDetection();
      togglePoseButton.style.background = 'rgba(50, 205, 50, 0.5)';
    }
  });
  cameraControls.appendChild(togglePoseButton);

  cameraSection.appendChild(cameraControls);

  // Detection toggles
  const detectionToggles = document.createElement('div');
  detectionToggles.style.display = 'grid';
  detectionToggles.style.gridTemplateColumns = '1fr 1fr';
  detectionToggles.style.gap = '8px';
  detectionToggles.style.marginBottom = '12px';

  const toggleHandButton = document.createElement('button');
  toggleHandButton.textContent = '👋 Enable Hands';
  toggleHandButton.style.padding = '6px';
  toggleHandButton.style.fontSize = '11px';
  toggleHandButton.addEventListener('click', () => {
    if (window.cameraSignalProvider) {
      window.cameraSignalProvider.enableHandDetection();
      toggleHandButton.style.background = 'rgba(50, 205, 50, 0.5)';
    }
  });
  detectionToggles.appendChild(toggleHandButton);

  const toggleFaceButton = document.createElement('button');
  toggleFaceButton.textContent = '👤 Enable Face';
  toggleFaceButton.style.padding = '6px';
  toggleFaceButton.style.fontSize = '11px';
  toggleFaceButton.addEventListener('click', () => {
    if (window.cameraSignalProvider) {
      window.cameraSignalProvider.enableFaceDetection();
      toggleFaceButton.style.background = 'rgba(50, 205, 50, 0.5)';
    }
  });
  detectionToggles.appendChild(toggleFaceButton);

  cameraSection.appendChild(detectionToggles);

  section.appendChild(cameraSection);

  // === SIGNAL DISPLAY ===
  const signalSection = document.createElement('div');
  signalSection.style.marginBottom = '16px';

  const signalTitle = document.createElement('h4');
  signalTitle.textContent = '📊 Active Signals';
  signalTitle.style.fontSize = '13px';
  signalTitle.style.marginBottom = '8px';
  signalSection.appendChild(signalTitle);

  const signalDisplay = document.createElement('div');
  signalDisplay.id = 'camera-signals';
  signalDisplay.style.cssText = `
    background: rgba(0, 0, 0, 0.7);
    padding: 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 9px;
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 12px;
  `;
  signalDisplay.textContent = 'No signals yet...';
  signalSection.appendChild(signalDisplay);

  section.appendChild(signalSection);

  // === OSC INPUT ===
  const oscSection = document.createElement('div');
  oscSection.style.marginBottom = '16px';

  const oscTitle = document.createElement('h4');
  oscTitle.textContent = '📡 OSC Input';
  oscTitle.style.fontSize = '13px';
  oscTitle.style.marginBottom = '8px';
  oscSection.appendChild(oscTitle);

  const oscInfo = document.createElement('div');
  oscInfo.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 4px;
    font-size: 10px;
    margin-bottom: 8px;
    opacity: 0.8;
  `;
  oscInfo.innerHTML = `
    <div><strong>ℹ️ OSC WebSocket Bridge</strong></div>
    <div style="margin-top: 4px;">Requires bridge server (e.g., node-osc-bridge)</div>
    <div style="margin-top: 4px; font-family: monospace; color: #FFD700;">
      npm install -g osc-websocket-bridge<br>
      osc-websocket-bridge --port 8080
    </div>
  `;
  oscSection.appendChild(oscInfo);

  const oscControls = document.createElement('div');
  oscControls.style.display = 'grid';
  oscControls.style.gridTemplateColumns = '2fr 1fr';
  oscControls.style.gap = '8px';
  oscControls.style.marginBottom = '8px';

  const oscUrlInput = document.createElement('input');
  oscUrlInput.type = 'text';
  oscUrlInput.placeholder = 'ws://localhost:8080';
  oscUrlInput.value = 'ws://localhost:8080';
  oscUrlInput.style.cssText = `
    padding: 6px;
    font-size: 11px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  `;
  oscControls.appendChild(oscUrlInput);

  const oscConnectButton = document.createElement('button');
  oscConnectButton.textContent = '🔌 Connect';
  oscConnectButton.style.padding = '6px';
  oscConnectButton.style.fontSize = '11px';
  oscConnectButton.addEventListener('click', async () => {
    if (window.oscAdapter) {
      await window.oscAdapter.connect(oscUrlInput.value);
    }
  });
  oscControls.appendChild(oscConnectButton);

  oscSection.appendChild(oscControls);
  section.appendChild(oscSection);

  // === BIOSIGNAL INPUT ===
  const biosignalSection = document.createElement('div');
  biosignalSection.style.marginBottom = '16px';

  const biosignalTitle = document.createElement('h4');
  biosignalTitle.textContent = '📟 Biosignal Input';
  biosignalTitle.style.fontSize = '13px';
  biosignalTitle.style.marginBottom = '8px';
  biosignalSection.appendChild(biosignalTitle);

  const biosignalInfo = document.createElement('div');
  biosignalInfo.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 4px;
    font-size: 10px;
    margin-bottom: 8px;
    opacity: 0.8;
  `;
  biosignalInfo.innerHTML = `
    <div><strong>ℹ️ Serial Device (Web Serial API)</strong></div>
    <div style="margin-top: 4px;">Connect EEG, heart rate, or other biosensors</div>
    <div style="margin-top: 4px;">Format: <code>signal_name:value</code> or JSON</div>
  `;
  biosignalSection.appendChild(biosignalInfo);

  const biosignalButton = document.createElement('button');
  biosignalButton.textContent = '🔌 Connect Serial Device';
  biosignalButton.style.cssText = `
    width: 100%;
    padding: 8px;
    font-size: 11px;
  `;
  biosignalButton.addEventListener('click', async () => {
    if (window.biosignalAdapter) {
      const result = await window.biosignalAdapter.connect();
      if (result.ok) {
        biosignalButton.textContent = '✅ Connected';
        biosignalButton.style.background = 'rgba(50, 205, 50, 0.5)';
      } else {
        alert(`Serial connection failed: ${result.error}`);
      }
    }
  });
  biosignalSection.appendChild(biosignalButton);

  section.appendChild(biosignalSection);

  // === ROUTING STATUS ===
  const routingSection = document.createElement('div');
  routingSection.style.marginBottom = '16px';

  const routingTitle = document.createElement('h4');
  routingTitle.textContent = '🔀 Signal Routing';
  routingTitle.style.fontSize = '13px';
  routingTitle.style.marginBottom = '8px';
  routingSection.appendChild(routingTitle);

  const routingStatus = document.createElement('div');
  routingStatus.id = 'routing-status';
  routingStatus.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 10px;
    margin-bottom: 8px;
  `;
  updateRoutingStatus();
  routingSection.appendChild(routingStatus);

  const routingControls = document.createElement('div');
  routingControls.style.display = 'grid';
  routingControls.style.gridTemplateColumns = '1fr 1fr';
  routingControls.style.gap = '8px';

  const startRoutingButton = document.createElement('button');
  startRoutingButton.textContent = '▶️ Start Routing';
  startRoutingButton.style.padding = '6px';
  startRoutingButton.style.fontSize = '11px';
  startRoutingButton.addEventListener('click', () => {
    if (window.cameraSignalRouter) {
      window.cameraSignalRouter.start();
      startRoutingButton.textContent = '⏸️ Stop Routing';
      startRoutingButton.onclick = () => {
        window.cameraSignalRouter.stop();
        startRoutingButton.textContent = '▶️ Start Routing';
        startRoutingButton.onclick = () => startRoutingButton.click();
        updateRoutingStatus();
      };
      updateRoutingStatus();
    }
  });
  routingControls.appendChild(startRoutingButton);

  const viewMappingsButton = document.createElement('button');
  viewMappingsButton.textContent = '🗺️ View Mappings';
  viewMappingsButton.style.padding = '6px';
  viewMappingsButton.style.fontSize = '11px';
  viewMappingsButton.addEventListener('click', () => {
    if (window.cameraSignalRouter) {
      const mappings = window.cameraSignalRouter.getMappings();
      console.table(mappings);
      alert(`Signal Mappings (${mappings.length} total)\n\nCheck console for details.`);
    }
  });
  routingControls.appendChild(viewMappingsButton);

  routingSection.appendChild(routingControls);
  section.appendChild(routingSection);

  // === UPDATE FUNCTIONS ===
  function updateCameraStatus() {
    if (!window.cameraSignalProvider) return;

    const info = window.cameraSignalProvider.getDebugInfo();

    cameraStatus.innerHTML = `
      <div><strong>Status:</strong> ${info.enabled ? '🟢 Running' : '🔴 Stopped'}</div>
      <div style="margin-top: 4px;">Resolution: ${info.resolution}</div>
      <div>FPS: ${info.fps} | Processing: ${info.processing ? 'Yes' : 'No'}</div>
      <div style="margin-top: 4px;">Pose: ${info.poseDetection ? '✅' : '❌'} | Hands: ${info.handDetection ? '✅' : '❌'} | Face: ${info.faceDetection ? '✅' : '❌'}</div>
      <div style="margin-top: 4px;">Gesture: ${info.currentGesture}</div>
    `;
  }

  function updateSignalDisplay() {
    if (!window.cameraSignalProvider) return;

    const signals = window.cameraSignalProvider.getAllSignals();
    const sortedKeys = Object.keys(signals).sort();

    let html = '<div style="display: grid; gap: 2px;">';

    sortedKeys.forEach(key => {
      const value = signals[key];
      const barWidth = (value * 100).toFixed(0);
      const color = value > 0.8 ? '#32CD32' : value > 0.5 ? '#FFD700' : '#888';

      html += `
        <div style="display: grid; grid-template-columns: 150px 1fr 50px; gap: 8px; align-items: center;">
          <div style="opacity: 0.8;">${key}</div>
          <div style="background: rgba(255,255,255,0.1); height: 12px; border-radius: 2px; overflow: hidden;">
            <div style="background: ${color}; width: ${barWidth}%; height: 100%; transition: width 0.1s;"></div>
          </div>
          <div style="text-align: right;">${value.toFixed(2)}</div>
        </div>
      `;
    });

    html += '</div>';
    signalDisplay.innerHTML = html;
  }

  function updateRoutingStatus() {
    if (!window.cameraSignalRouter) {
      routingStatus.innerHTML = '<div style="opacity: 0.6;">Router not initialized</div>';
      return;
    }

    const info = window.cameraSignalRouter.getDebugInfo();

    routingStatus.innerHTML = `
      <div><strong>Routing:</strong> ${info.enabled ? '🟢 Active' : '🔴 Stopped'}</div>
      <div style="margin-top: 4px;">Camera: ${info.cameraEnabled ? '✅' : '❌'} | OSC: ${info.oscConnected ? '✅' : '❌'} | Biosignal: ${info.biosignalConnected ? '✅' : '❌'}</div>
      <div style="margin-top: 4px;">Active Mappings: ${info.activeMappings} / ${info.totalMappings}</div>
    `;
  }

  // Periodic updates
  setInterval(() => {
    if (window.cameraSignalProvider?.enabled) {
      updateCameraStatus();
      updateSignalDisplay();
    }
    if (window.cameraSignalRouter) {
      updateRoutingStatus();
    }
  }, 100);

  container.appendChild(section);
  console.log("📷 Camera HUD created");
}

console.log("📷 Camera HUD system ready");
