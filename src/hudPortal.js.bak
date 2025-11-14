// src/hudPortal.js
// Portal Builder HUD interface
// Unified interface for creating, editing, and navigating portals

import { showPrompt, showAlert, showConfirm } from './modalDialog.js';

console.log("🚪 hudPortal.js loaded");

/**
 * Create Portal Builder HUD section
 */
export function createPortalHUD(container) {
  const section = document.createElement('div');
  section.className = 'hud-section portal-builder';
  section.style.maxWidth = '700px';

  const title = document.createElement('h3');
  title.textContent = '🚪 Portal Builder';
  section.appendChild(title);

  const intro = document.createElement('p');
  intro.textContent = 'Create and navigate interactive destinations with custom skyboxes, geometry, and waveform fields. Build your own mythic multiverse.';
  intro.style.cssText = `
    font-size: 11px;
    margin-bottom: 12px;
    opacity: 0.8;
  `;
  section.appendChild(intro);

  // === TABS ===
  const tabs = ['Portals', 'Skybox', 'Geometry', 'Waveform', 'Map'];
  const tabButtons = [];
  const tabContainers = {};

  const tabBar = document.createElement('div');
  tabBar.style.cssText = `
    display: flex;
    gap: 4px;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 8px;
  `;

  tabs.forEach((tabName, index) => {
    const button = document.createElement('button');
    button.textContent = tabName;
    button.style.cssText = `
      padding: 6px 12px;
      font-size: 11px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: none;
      border-radius: 4px 4px 0 0;
      cursor: pointer;
      transition: background 0.2s;
    `;

    button.addEventListener('click', () => {
      // Hide all tabs
      tabs.forEach(t => {
        tabContainers[t].style.display = 'none';
      });

      // Reset all buttons
      tabButtons.forEach(b => {
        b.style.background = 'rgba(255, 255, 255, 0.1)';
      });

      // Show selected tab
      tabContainers[tabName].style.display = 'block';
      button.style.background = 'rgba(100, 200, 255, 0.3)';
    });

    tabBar.appendChild(button);
    tabButtons.push(button);

    // Create tab container
    const tabContainer = document.createElement('div');
    tabContainer.style.display = index === 0 ? 'block' : 'none';
    tabContainers[tabName] = tabContainer;
  });

  // Set first tab active
  tabButtons[0].style.background = 'rgba(100, 200, 255, 0.3)';

  section.appendChild(tabBar);

  // === PORTALS TAB ===
  const portalsTab = tabContainers['Portals'];

  // Portal list
  const portalListContainer = document.createElement('div');
  portalListContainer.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 12px;
    max-height: 300px;
    overflow-y: auto;
  `;

  const portalList = document.createElement('div');
  portalList.id = 'portal-list';
  portalListContainer.appendChild(portalList);

  portalsTab.appendChild(portalListContainer);

  // Portal controls
  const portalControls = document.createElement('div');
  portalControls.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 12px;
  `;

  const createPortalButton = document.createElement('button');
  createPortalButton.textContent = '➕ New Portal';
  createPortalButton.style.cssText = `
    padding: 8px;
    background: #32CD32;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    font-size: 11px;
  `;
  createPortalButton.addEventListener('click', async () => {
    console.log('🔍 DEBUG: Create Portal button clicked');

    if (!window.portalManager) {
      console.error('🔍 DEBUG: portalManager not found on window!');
      await showAlert('ERROR: Portal Manager not loaded!');
      return;
    }

    console.log('🔍 DEBUG: Prompting for portal name...');
    const name = await showPrompt('Portal name:');
    if (!name) {
      console.log('🔍 DEBUG: User cancelled portal name prompt');
      return;
    }

    console.log(`🔍 DEBUG: Creating portal with name: "${name}"`);
    const portal = window.portalManager.createPortal({ name });
    console.log('🔍 DEBUG: Portal created:', portal);
    console.log('🔍 DEBUG: activePortalId after creation:', window.portalManager.activePortalId);

    updatePortalList();
    updateCurrentPortalInfo();
    updatePortalStatus();

    await showAlert(`✅ Portal "${portal.name}" created and set as ACTIVE!\n\nID: ${portal.id}\nActive Portal ID: ${window.portalManager.activePortalId}\n\nYou can now add waveforms, geometry, and skyboxes to this portal.`);
  });
  portalControls.appendChild(createPortalButton);

  const importPortalButton = document.createElement('button');
  importPortalButton.textContent = '📥 Import';
  importPortalButton.style.padding = '8px';
  importPortalButton.style.fontSize = '11px';
  importPortalButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      const text = await file.text();
      const result = window.portalManager.importPortal(text);

      if (result.ok) {
        updatePortalList();
        await showAlert(`Portal imported: ${result.portal.name}`);
      } else {
        await showAlert(`Import failed: ${result.error}`);
      }
    };
    input.click();
  });
  portalControls.appendChild(importPortalButton);

  portalsTab.appendChild(portalControls);

  // Current portal info
  const currentPortalInfo = document.createElement('div');
  currentPortalInfo.id = 'current-portal-info';
  currentPortalInfo.style.cssText = `
    background: rgba(0, 0, 0, 0.7);
    padding: 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 10px;
    margin-bottom: 12px;
  `;
  portalsTab.appendChild(currentPortalInfo);

  // === SKYBOX TAB ===
  const skyboxTab = tabContainers['Skybox'];

  const skyboxInfo = document.createElement('div');
  skyboxInfo.textContent = 'Skybox editor: Upload images, create procedural environments, or layer multiple skyboxes.';
  skyboxInfo.style.cssText = `
    font-size: 11px;
    opacity: 0.8;
    margin-bottom: 12px;
  `;
  skyboxTab.appendChild(skyboxInfo);

  // Active portal status
  const skyboxPortalStatus = document.createElement('div');
  skyboxPortalStatus.id = 'skybox-portal-status';
  skyboxPortalStatus.style.cssText = `
    background: rgba(50, 205, 50, 0.2);
    padding: 6px;
    border-radius: 4px;
    font-size: 10px;
    margin-bottom: 12px;
    border-left: 3px solid #32CD32;
  `;
  skyboxTab.appendChild(skyboxPortalStatus);

  // Procedural skybox button
  const proceduralSkyboxButton = document.createElement('button');
  proceduralSkyboxButton.textContent = '🌌 Create Procedural Skybox';
  proceduralSkyboxButton.style.cssText = `
    width: 100%;
    padding: 10px;
    margin-bottom: 12px;
    font-size: 11px;
    background: rgba(100, 100, 255, 0.3);
  `;
  proceduralSkyboxButton.addEventListener('click', async () => {
    if (!window.skyboxEditor) return;

    const skyboxConfig = {
      type: 'procedural',
      starDensity: 1000,
      nebulaIntensity: 0.5,
      colors: ['#000033', '#1a0033', '#330033'],
      cosmicNoiseScale: 3.0
    };

    const result = window.skyboxEditor.createProceduralSkybox(skyboxConfig);

    if (result.ok) {
      // Save to active portal
      if (window.portalManager && window.portalManager.activePortalId) {
        const portal = window.portalManager.getPortal(window.portalManager.activePortalId);
        if (portal) {
          portal.skybox = {
            type: 'procedural',
            ...skyboxConfig,
            rotation: 0,
            scale: 1,
            brightness: 1
          };
          portal.modifiedAt = Date.now();
          window.portalManager.saveLibrary();
          console.log(`🚪 Added procedural skybox to portal: ${portal.name}`);
        }
      }
      await showAlert('Procedural skybox created in current portal!');
    }
  });
  skyboxTab.appendChild(proceduralSkyboxButton);

  // === GEOMETRY TAB ===
  const geometryTab = tabContainers['Geometry'];

  const geometryInfo = document.createElement('div');
  geometryInfo.textContent = 'Add morphable shapes, glyphs, and procedural fields to your portal.';
  geometryInfo.style.cssText = `
    font-size: 11px;
    opacity: 0.8;
    margin-bottom: 12px;
  `;
  geometryTab.appendChild(geometryInfo);

  // Active portal status
  const geometryPortalStatus = document.createElement('div');
  geometryPortalStatus.id = 'geometry-portal-status';
  geometryPortalStatus.style.cssText = `
    background: rgba(50, 205, 50, 0.2);
    padding: 6px;
    border-radius: 4px;
    font-size: 10px;
    margin-bottom: 12px;
    border-left: 3px solid #32CD32;
  `;
  geometryTab.appendChild(geometryPortalStatus);

  // Shape buttons
  const shapeButtons = document.createElement('div');
  shapeButtons.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    margin-bottom: 12px;
  `;

  ['sphere', 'cube', 'torus', 'chestahedron'].forEach(shape => {
    const button = document.createElement('button');
    button.textContent = `Add ${shape}`;
    button.style.padding = '8px';
    button.style.fontSize = '10px';
    button.addEventListener('click', async () => {
      if (!window.geometryBuilder) return;

      // Get camera position for placement
      const camera = window.geometryBuilder.camera;
      const cameraPos = camera ? camera.position : { x: 0, y: 2, z: 0 };

      // Place object in front of camera
      const position = [
        cameraPos.x,
        cameraPos.y,
        cameraPos.z - 5 // 5 units in front
      ];

      const objConfig = {
        type: shape,
        position: position,
        material: { color: '#00FFFF', wireframe: false },
        audioReactive: true
      };

      window.geometryBuilder.addObject(objConfig);

      // Add to active portal if one exists
      if (window.portalManager && window.portalManager.activePortalId) {
        const portal = window.portalManager.getPortal(window.portalManager.activePortalId);
        if (portal) {
          portal.geometry.push(objConfig);
          portal.modifiedAt = Date.now();
          window.portalManager.saveLibrary();
          console.log(`🚪 Added ${shape} to portal: ${portal.name}`);
        }
      }

      updateGeometryList();
      await showAlert(`${shape} added at camera position`);
    });
    shapeButtons.appendChild(button);
  });

  geometryTab.appendChild(shapeButtons);

  // Geometry object list
  const geometryListContainer = document.createElement('div');
  geometryListContainer.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 12px;
    max-height: 200px;
    overflow-y: auto;
  `;

  const geometryList = document.createElement('div');
  geometryList.id = 'geometry-list';
  geometryList.innerHTML = '<div style="opacity: 0.6;">No geometry objects</div>';
  geometryListContainer.appendChild(geometryList);
  geometryTab.appendChild(geometryListContainer);

  // Procedural field button
  const proceduralFieldButton = document.createElement('button');
  proceduralFieldButton.textContent = '🔮 Create Procedural Field';
  proceduralFieldButton.style.cssText = `
    width: 100%;
    padding: 10px;
    margin-bottom: 12px;
    font-size: 11px;
  `;
  proceduralFieldButton.addEventListener('click', async () => {
    if (!window.geometryBuilder) return;

    const type = await showPrompt('Field type (lattice/fractal/wave):', 'lattice');
    if (!type) return;

    // Get camera position for field center
    const camera = window.geometryBuilder.camera;
    const cameraPos = camera ? camera.position : { x: 0, y: 0, z: 0 };

    const fieldConfig = {
      type,
      size: 10,
      spacing: 2,
      shape: 'sphere',
      center: [cameraPos.x, cameraPos.y, cameraPos.z - 10]
    };

    window.geometryBuilder.createProceduralField(fieldConfig);

    // Add to active portal
    if (window.portalManager && window.portalManager.activePortalId) {
      const portal = window.portalManager.getPortal(window.portalManager.activePortalId);
      if (portal) {
        portal.geometry.push({ ...fieldConfig, isProceduralField: true });
        portal.modifiedAt = Date.now();
        window.portalManager.saveLibrary();
        console.log(`🚪 Added procedural field to portal: ${portal.name}`);
      }
    }

    updateGeometryList();
    await showAlert(`${type} field created at camera position!`);
  });
  geometryTab.appendChild(proceduralFieldButton);

  // Clear all geometry button
  const clearGeometryButton = document.createElement('button');
  clearGeometryButton.textContent = '🗑️ Clear All Geometry';
  clearGeometryButton.style.cssText = `
    width: 100%;
    padding: 8px;
    background: rgba(255, 50, 50, 0.3);
    font-size: 11px;
  `;
  clearGeometryButton.addEventListener('click', async () => {
    if (!window.geometryBuilder) return;
    if (!await showConfirm('Clear all geometry objects?')) return;

    window.geometryBuilder.clearAll();
    updateGeometryList();
  });
  geometryTab.appendChild(clearGeometryButton);

  // === WAVEFORM TAB ===
  const waveformTab = tabContainers['Waveform'];

  const waveformInfo = document.createElement('div');
  waveformInfo.textContent = 'Create audio-reactive terrain and waveform fields.';
  waveformInfo.style.cssText = `
    font-size: 11px;
    opacity: 0.8;
    margin-bottom: 12px;
  `;
  waveformTab.appendChild(waveformInfo);

  // Active portal status
  const waveformPortalStatus = document.createElement('div');
  waveformPortalStatus.id = 'waveform-portal-status';
  waveformPortalStatus.style.cssText = `
    background: rgba(50, 205, 50, 0.2);
    padding: 6px;
    border-radius: 4px;
    font-size: 10px;
    margin-bottom: 12px;
    border-left: 3px solid #32CD32;
  `;
  waveformTab.appendChild(waveformPortalStatus);

  // Waveform type buttons
  const waveformButtons = document.createElement('div');
  waveformButtons.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 12px;
  `;

  ['floor', 'river', 'plasma', 'mist'].forEach(type => {
    const button = document.createElement('button');
    button.textContent = `${type} field`;
    button.style.padding = '8px';
    button.style.fontSize = '10px';
    button.addEventListener('click', async () => {
      console.log(`🔍 DEBUG: ${type} waveform button clicked`);

      if (!window.waveformEditor) {
        console.error('🔍 DEBUG: waveformEditor not found!');
        return;
      }

      const fieldConfig = {
        type,
        gridSize: 64,
        amplitude: 0.8,
        audioBand: 'bass'
      };

      console.log('🔍 DEBUG: Creating waveform field:', fieldConfig);
      window.waveformEditor.createField(fieldConfig);

      // Update active portal's wavefield configuration
      console.log('🔍 DEBUG: Checking for portal manager and active portal...');
      console.log('🔍 DEBUG: window.portalManager:', window.portalManager);
      console.log('🔍 DEBUG: activePortalId:', window.portalManager?.activePortalId);

      if (window.portalManager && window.portalManager.activePortalId) {
        const portal = window.portalManager.getPortal(window.portalManager.activePortalId);
        console.log('🔍 DEBUG: Found active portal:', portal);

        if (portal) {
          console.log(`🔍 DEBUG: Saving ${type} wavefield to portal: ${portal.name} (${portal.id})`);
          portal.wavefield = {
            enabled: true,
            type: type,
            gridSize: fieldConfig.gridSize,
            amplitude: fieldConfig.amplitude,
            audioBand: fieldConfig.audioBand,
            frequency: 1.2,
            propagationSpeed: 1.0,
            color: '#00FFFF'
          };
          portal.modifiedAt = Date.now();
          window.portalManager.saveLibrary();
          console.log(`🚪 Added ${type} wavefield to portal: ${portal.name}`);
          await showAlert(`${type} waveform saved to portal: ${portal.name} (${portal.id})`);
        } else {
          console.error('🔍 DEBUG: Portal not found despite having activePortalId!');
          await showAlert('ERROR: Active portal not found!');
        }
      } else {
        console.warn('🔍 DEBUG: No active portal - waveform not saved to any portal');
        await showAlert(`⚠️ ${type} waveform created but NOT saved to any portal!\n\nNo active portal found.\nactivePortalId: ${window.portalManager?.activePortalId}`);
      }

      updateWaveformList();
    });
    waveformButtons.appendChild(button);
  });

  waveformTab.appendChild(waveformButtons);

  // Waveform field list
  const waveformListContainer = document.createElement('div');
  waveformListContainer.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 12px;
    max-height: 200px;
    overflow-y: auto;
  `;

  const waveformList = document.createElement('div');
  waveformList.id = 'waveform-list';
  waveformList.innerHTML = '<div style="opacity: 0.6;">No waveform fields</div>';
  waveformListContainer.appendChild(waveformList);
  waveformTab.appendChild(waveformListContainer);

  // Clear all waveforms button
  const clearWaveformsButton = document.createElement('button');
  clearWaveformsButton.textContent = '🗑️ Clear All Waveforms';
  clearWaveformsButton.style.cssText = `
    width: 100%;
    padding: 8px;
    background: rgba(255, 50, 50, 0.3);
    font-size: 11px;
  `;
  clearWaveformsButton.addEventListener('click', async () => {
    if (!window.waveformEditor) return;
    if (!await showConfirm('Clear all waveform fields?')) return;

    window.waveformEditor.clearAll();
    updateWaveformList();
  });
  waveformTab.appendChild(clearWaveformsButton);

  // === MAP TAB ===
  const mapTab = tabContainers['Map'];

  const mapInfo = document.createElement('div');
  mapInfo.textContent = 'Visual map of all portals. Click to select, drag to pan, scroll to zoom.';
  mapInfo.style.cssText = `
    font-size: 11px;
    opacity: 0.8;
    margin-bottom: 12px;
  `;
  mapTab.appendChild(mapInfo);

  // Map container
  const mapContainer = document.createElement('div');
  mapContainer.id = 'portal-map-container';
  mapContainer.style.cssText = `
    margin-bottom: 12px;
  `;
  mapTab.appendChild(mapContainer);

  // Map controls
  const mapControls = document.createElement('div');
  mapControls.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
  `;

  const resetViewButton = document.createElement('button');
  resetViewButton.textContent = '🎯 Reset View';
  resetViewButton.style.padding = '6px';
  resetViewButton.style.fontSize = '10px';
  resetViewButton.addEventListener('click', () => {
    if (window.portalMapUI) {
      window.portalMapUI.resetView();
    }
  });
  mapControls.appendChild(resetViewButton);

  const layoutCircleButton = document.createElement('button');
  layoutCircleButton.textContent = '⭕ Circle Layout';
  layoutCircleButton.style.padding = '6px';
  layoutCircleButton.style.fontSize = '10px';
  layoutCircleButton.addEventListener('click', () => {
    if (window.portalMapUI) {
      window.portalMapUI.autoLayoutCircle();
    }
  });
  mapControls.appendChild(layoutCircleButton);

  const layoutGridButton = document.createElement('button');
  layoutGridButton.textContent = '⊞ Grid Layout';
  layoutGridButton.style.padding = '6px';
  layoutGridButton.style.fontSize = '10px';
  layoutGridButton.addEventListener('click', () => {
    if (window.portalMapUI) {
      window.portalMapUI.autoLayoutGrid();
    }
  });
  mapControls.appendChild(layoutGridButton);

  mapTab.appendChild(mapControls);

  // Append all tabs
  Object.values(tabContainers).forEach(tab => section.appendChild(tab));
  container.appendChild(section);

  // === UPDATE FUNCTIONS ===
  function updatePortalList() {
    if (!window.portalManager) return;

    const portals = window.portalManager.getAllPortals();

    if (portals.length === 0) {
      portalList.innerHTML = '<div style="opacity: 0.6;">No portals yet. Create one!</div>';
      return;
    }

    let html = '';

    portals.forEach(portal => {
      const isActive = window.portalManager.activePortalId === portal.id;

      html += `
        <div style="
          background: ${isActive ? 'rgba(50, 205, 50, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
          padding: 8px;
          border-radius: 4px;
          margin-bottom: 4px;
          border-left: 3px solid ${isActive ? '#32CD32' : '#666'};
        ">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>${portal.name}</strong>
              <span style="opacity: 0.7; margin-left: 8px;">${portal.type}</span>
              ${portal.locked ? '<span style="color: #FF6666;">🔒</span>' : ''}
              ${portal.visited ? '<span style="color: #32CD32;">✓</span>' : ''}
            </div>
            <div>
              <button onclick="enterPortal('${portal.id}')" style="font-size: 10px; padding: 4px 8px; margin-right: 4px;">Enter</button>
              <button onclick="deletePortal('${portal.id}')" style="font-size: 10px; padding: 4px 8px;">Delete</button>
            </div>
          </div>
        </div>
      `;
    });

    portalList.innerHTML = html;
  }

  function updateCurrentPortalInfo() {
    if (!window.portalManager || !window.portalManager.activePortalId) {
      currentPortalInfo.innerHTML = '<div style="opacity: 0.6;">No active portal</div>';
      return;
    }

    const portal = window.portalManager.getPortal(window.portalManager.activePortalId);
    if (!portal) return;

    currentPortalInfo.innerHTML = `
      <div><strong>Active Portal:</strong> ${portal.name}</div>
      <div style="margin-top: 4px;">Type: ${portal.type}</div>
      <div>Tags: ${portal.tags.join(', ') || 'None'}</div>
      <div style="margin-top: 4px;">Geometry: ${portal.geometry.length} objects</div>
      <div>Waveform: ${portal.wavefield.enabled ? 'Enabled' : 'Disabled'}</div>
      <div style="margin-top: 4px;">${portal.description || 'No description'}</div>
    `;
  }

  function updateGeometryList() {
    if (!window.geometryBuilder) {
      geometryList.innerHTML = '<div style="opacity: 0.6;">Geometry builder not loaded</div>';
      return;
    }

    const objects = window.geometryBuilder.getAllObjects ? window.geometryBuilder.getAllObjects() : [];

    if (objects.length === 0) {
      geometryList.innerHTML = '<div style="opacity: 0.6;">No geometry objects</div>';
      return;
    }

    let html = '';
    objects.forEach((obj, index) => {
      const pos = obj.position || [0, 0, 0];
      html += `
        <div style="background: rgba(255,255,255,0.05); padding: 6px; margin-bottom: 4px; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px;">${obj.type} at [${pos[0].toFixed(1)}, ${pos[1].toFixed(1)}, ${pos[2].toFixed(1)}]</span>
            <button onclick="deleteGeometry('${obj.id || index}')" style="font-size: 10px; padding: 2px 6px; background: rgba(255,50,50,0.4);">×</button>
          </div>
        </div>
      `;
    });
    geometryList.innerHTML = html;
  }

  function updateWaveformList() {
    if (!window.waveformEditor) {
      waveformList.innerHTML = '<div style="opacity: 0.6;">Waveform editor not loaded</div>';
      return;
    }

    const fields = window.waveformEditor.getAllFields ? window.waveformEditor.getAllFields() : [];

    if (fields.length === 0) {
      waveformList.innerHTML = '<div style="opacity: 0.6;">No waveform fields</div>';
      return;
    }

    let html = '';
    fields.forEach((field, index) => {
      html += `
        <div style="background: rgba(255,255,255,0.05); padding: 6px; margin-bottom: 4px; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px;">${field.type || 'Unknown'} field - Band: ${field.audioBand || 'N/A'}</span>
            <button onclick="deleteWaveform('${field.id || index}')" style="font-size: 10px; padding: 2px 6px; background: rgba(255,50,50,0.4);">×</button>
          </div>
        </div>
      `;
    });
    waveformList.innerHTML = html;
  }

  function updatePortalStatus() {
    const statusPanels = [
      document.getElementById('skybox-portal-status'),
      document.getElementById('geometry-portal-status'),
      document.getElementById('waveform-portal-status')
    ];

    if (!window.portalManager || !window.portalManager.activePortalId) {
      statusPanels.forEach(panel => {
        if (panel) {
          panel.innerHTML = '⚠️ No active portal - Create or Enter a portal to save content';
          panel.style.background = 'rgba(255, 165, 0, 0.2)';
          panel.style.borderLeftColor = '#FFA500';
        }
      });
      return;
    }

    const portal = window.portalManager.getPortal(window.portalManager.activePortalId);
    if (!portal) return;

    const statusText = `✓ Editing: <strong>${portal.name}</strong> (${portal.type})`;

    statusPanels.forEach(panel => {
      if (panel) {
        panel.innerHTML = statusText;
        panel.style.background = 'rgba(50, 205, 50, 0.2)';
        panel.style.borderLeftColor = '#32CD32';
      }
    });
  }

  // Global functions for portal list buttons
  window.enterPortal = async (id) => {
    if (!window.portalManager) return;

    const result = await window.portalManager.enterPortal(id);

    if (result.ok) {
      updatePortalList();
      updateCurrentPortalInfo();
      updatePortalStatus();
      await showAlert(`Entered portal: ${result.portal.name}\n\nYou can now add geometry, waveforms, and skyboxes to this world.`);
    } else {
      await showAlert(`Failed to enter portal: ${result.error}`);
    }
  };

  window.deletePortal = async (id) => {
    if (!window.portalManager) return;

    if (!await showConfirm('Delete this portal?')) return;

    window.portalManager.deletePortal(id);
    updatePortalList();
    updateCurrentPortalInfo();
  };

  window.deleteGeometry = (id) => {
    if (!window.geometryBuilder) return;

    if (window.geometryBuilder.removeObject) {
      window.geometryBuilder.removeObject(id);
    }
    updateGeometryList();
  };

  window.deleteWaveform = (id) => {
    if (!window.waveformEditor) return;

    if (window.waveformEditor.removeField) {
      window.waveformEditor.removeField(id);
    }
    updateWaveformList();
  };

  // Initialize portal map UI
  setTimeout(() => {
    if (window.portalManager && window.portalMapUI) {
      window.portalMapUI.createMapCanvas(mapContainer, 600, 400);

      // Handle portal selection from map
      window.portalMapUI.onPortalSelected = (portalId) => {
        updateCurrentPortalInfo();
      };
    }
  }, 100);

  // Periodic updates
  setInterval(() => {
    updatePortalList();
    updateCurrentPortalInfo();
    updatePortalStatus();
  }, 1000);

  // Initial updates
  setTimeout(() => {
    updatePortalList();
    updateCurrentPortalInfo();
    updateGeometryList();
    updateWaveformList();
    updatePortalStatus();
  }, 100);

  console.log("🚪 Portal Builder HUD created");
}

console.log("🚪 Portal HUD system ready");
