// src/hudDestinations.js
// HUD interface for destination authoring and navigation

console.log("🎨 hudDestinations.js loaded");

import { state } from './state.js';

/**
 * Create Destination Authoring HUD section
 */
export function createDestinationHUD(container) {
  const section = document.createElement('div');
  section.className = 'hud-section destination-authoring';
  section.style.maxWidth = '350px';

  const title = document.createElement('h3');
  title.textContent = '🎨 Destination Authoring';
  section.appendChild(title);

  // === CURRENT POSITION DISPLAY ===
  const positionDisplay = document.createElement('div');
  positionDisplay.className = 'position-display';
  positionDisplay.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    margin-bottom: 12px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 11px;
    line-height: 1.4;
  `;
  positionDisplay.innerHTML = `
    <div>Position: <span id="pos-x">0.0</span>, <span id="pos-y">0.0</span>, <span id="pos-z">0.0</span></div>
    <div>Distance to nearest: <span id="dist-nearest">--</span></div>
  `;
  section.appendChild(positionDisplay);

  // Update position display every frame
  if (window.camera) {
    setInterval(() => {
      const cam = window.camera;
      document.getElementById('pos-x').textContent = cam.position.x.toFixed(1);
      document.getElementById('pos-y').textContent = cam.position.y.toFixed(1);
      document.getElementById('pos-z').textContent = cam.position.z.toFixed(1);

      // Calculate distance to nearest destination
      if (window.destinationAuthoring) {
        const { destination, distance } = window.destinationAuthoring.findNearestDestination(cam.position);
        if (destination) {
          document.getElementById('dist-nearest').textContent = `${distance.toFixed(1)} → ${destination.name}`;
        } else {
          document.getElementById('dist-nearest').textContent = '--';
        }
      }
    }, 100);
  }

  // === CREATE DESTINATION HERE ===
  const createSection = document.createElement('div');
  createSection.style.marginBottom = '16px';

  const createLabel = document.createElement('label');
  createLabel.textContent = 'Destination Name:';
  createLabel.style.display = 'block';
  createLabel.style.marginBottom = '5px';
  createSection.appendChild(createLabel);

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Enter name...';
  nameInput.style.width = '100%';
  nameInput.style.marginBottom = '8px';
  createSection.appendChild(nameInput);

  const descInput = document.createElement('input');
  descInput.type = 'text';
  descInput.placeholder = 'Description (optional)...';
  descInput.style.width = '100%';
  descInput.style.marginBottom = '8px';
  createSection.appendChild(descInput);

  const createButton = document.createElement('button');
  createButton.textContent = '+ Create Destination Here';
  createButton.style.cssText = `
    width: 100%;
    padding: 10px;
    background: #00aa00;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  `;
  createButton.addEventListener('click', () => {
    if (!window.destinationAuthoring) {
      alert('Destination authoring system not initialized');
      return;
    }

    const name = nameInput.value.trim() || `Destination ${Date.now()}`;
    const description = descInput.value.trim();

    const dest = window.destinationAuthoring.createDestinationHere({
      name,
      description,
      markerShape: markerShapeSelect.value,
      markerColor: markerColorInput.value,
      transitionType: transitionTypeSelect.value
    });

    // Clear inputs
    nameInput.value = '';
    descInput.value = '';

    // Refresh list
    refreshDestinationList();

    alert(`✅ Created destination "${dest.name}"`);
  });
  createSection.appendChild(createButton);

  section.appendChild(createSection);

  // === MARKER APPEARANCE ===
  const appearanceSection = document.createElement('div');
  appearanceSection.style.marginBottom = '16px';

  const appearanceTitle = document.createElement('h4');
  appearanceTitle.textContent = 'Marker Appearance';
  appearanceTitle.style.fontSize = '13px';
  appearanceTitle.style.marginBottom = '8px';
  appearanceSection.appendChild(appearanceTitle);

  // Marker shape
  const shapeLabel = document.createElement('label');
  shapeLabel.textContent = 'Shape:';
  shapeLabel.style.display = 'block';
  shapeLabel.style.marginBottom = '3px';
  shapeLabel.style.fontSize = '11px';
  appearanceSection.appendChild(shapeLabel);

  const markerShapeSelect = document.createElement('select');
  markerShapeSelect.style.width = '100%';
  markerShapeSelect.style.marginBottom = '8px';
  ['sphere', 'cube', 'beacon', 'portal'].forEach(shape => {
    const option = document.createElement('option');
    option.value = shape;
    option.textContent = shape.charAt(0).toUpperCase() + shape.slice(1);
    markerShapeSelect.appendChild(option);
  });
  appearanceSection.appendChild(markerShapeSelect);

  // Marker color
  const colorLabel = document.createElement('label');
  colorLabel.textContent = 'Color:';
  colorLabel.style.display = 'block';
  colorLabel.style.marginBottom = '3px';
  colorLabel.style.fontSize = '11px';
  appearanceSection.appendChild(colorLabel);

  const markerColorInput = document.createElement('input');
  markerColorInput.type = 'color';
  markerColorInput.value = '#00ffff';
  markerColorInput.style.width = '100%';
  markerColorInput.style.marginBottom = '8px';
  appearanceSection.appendChild(markerColorInput);

  section.appendChild(appearanceSection);

  // === TRANSITION SETTINGS ===
  const transitionSection = document.createElement('div');
  transitionSection.style.marginBottom = '16px';

  const transitionTitle = document.createElement('h4');
  transitionTitle.textContent = 'Transition';
  transitionTitle.style.fontSize = '13px';
  transitionTitle.style.marginBottom = '8px';
  transitionSection.appendChild(transitionTitle);

  const transitionLabel = document.createElement('label');
  transitionLabel.textContent = 'Type:';
  transitionLabel.style.display = 'block';
  transitionLabel.style.marginBottom = '3px';
  transitionLabel.style.fontSize = '11px';
  transitionSection.appendChild(transitionLabel);

  const transitionTypeSelect = document.createElement('select');
  transitionTypeSelect.style.width = '100%';
  transitionTypeSelect.style.marginBottom = '8px';
  ['smooth', 'instant', 'fade'].forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    transitionTypeSelect.appendChild(option);
  });
  transitionSection.appendChild(transitionTypeSelect);

  section.appendChild(transitionSection);

  // === DESTINATION LIST ===
  const listSection = document.createElement('div');
  listSection.style.marginBottom = '16px';

  const listTitle = document.createElement('h4');
  listTitle.textContent = 'Saved Destinations';
  listTitle.style.fontSize = '13px';
  listTitle.style.marginBottom = '8px';
  listSection.appendChild(listTitle);

  const destinationList = document.createElement('select');
  destinationList.size = 8;
  destinationList.style.width = '100%';
  destinationList.style.marginBottom = '8px';
  destinationList.style.fontFamily = 'monospace';
  destinationList.style.fontSize = '11px';
  listSection.appendChild(destinationList);

  function refreshDestinationList() {
    if (!window.destinationAuthoring) return;

    // IMPORTANT: Preserve the currently selected destination ID before clearing
    const selectedId = destinationList.value;

    const destinations = window.destinationAuthoring.getAllDestinations();
    destinationList.innerHTML = '';

    if (destinations.length === 0) {
      const option = document.createElement('option');
      option.textContent = '(no destinations)';
      option.disabled = true;
      destinationList.appendChild(option);
      return;
    }

    destinations.forEach(dest => {
      const option = document.createElement('option');
      option.value = dest.id;

      // Format: [visited?] Name (distance)
      const visited = dest.visited ? '✓' : '○';
      const distance = window.camera ? window.camera.position.distanceTo(dest.position).toFixed(1) : '?';
      option.textContent = `${visited} ${dest.name} (${distance})`;

      destinationList.appendChild(option);
    });

    // Restore the previously selected destination if it still exists
    if (selectedId && destinations.some(d => d.id === selectedId)) {
      destinationList.value = selectedId;
      // Also refresh clay objects list for this destination
      refreshClayObjectsList();
    }
  }

  // Refresh list on load and when destinations change
  refreshDestinationList();
  window.addEventListener('destinationCreated', refreshDestinationList);
  window.addEventListener('destinationRemoved', refreshDestinationList);

  // Auto-refresh every 2 seconds to update distances
  setInterval(refreshDestinationList, 2000);

  section.appendChild(listSection);

  // === NAVIGATION CONTROLS ===
  const navButtons = document.createElement('div');
  navButtons.style.display = 'grid';
  navButtons.style.gridTemplateColumns = '1fr 1fr';
  navButtons.style.gap = '8px';
  navButtons.style.marginBottom = '16px';

  const navigateButton = document.createElement('button');
  navigateButton.textContent = '→ Navigate';
  navigateButton.style.padding = '8px';
  navigateButton.style.background = '#0088ff';
  navigateButton.style.color = 'white';
  navigateButton.style.border = 'none';
  navigateButton.style.borderRadius = '4px';
  navigateButton.style.cursor = 'pointer';
  navigateButton.addEventListener('click', () => {
    const selectedId = destinationList.value;
    if (!selectedId || !window.destinationNavigator) return;

    const dest = window.destinationAuthoring.getDestination(selectedId);
    if (dest) {
      window.destinationNavigator.navigateTo(dest);
    }
  });
  navButtons.appendChild(navigateButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '✖ Delete';
  deleteButton.style.padding = '8px';
  deleteButton.style.background = '#aa0000';
  deleteButton.style.color = 'white';
  deleteButton.style.border = 'none';
  deleteButton.style.borderRadius = '4px';
  deleteButton.style.cursor = 'pointer';
  deleteButton.addEventListener('click', () => {
    const selectedId = destinationList.value;
    if (!selectedId || !window.destinationAuthoring) return;

    const dest = window.destinationAuthoring.getDestination(selectedId);
    if (dest && confirm(`Delete "${dest.name}"?`)) {
      window.destinationAuthoring.removeDestination(selectedId);
      refreshDestinationList();
    }
  });
  navButtons.appendChild(deleteButton);

  section.appendChild(navButtons);

  // === CLAY OBJECTS LIST (Phase 13.22) ===
  const clayObjectsSection = document.createElement('div');
  clayObjectsSection.style.marginBottom = '16px';

  const clayTitle = document.createElement('h4');
  clayTitle.textContent = 'Clay Objects at Selected';
  clayTitle.style.fontSize = '13px';
  clayTitle.style.marginBottom = '8px';
  clayObjectsSection.appendChild(clayTitle);

  const clayObjectsList = document.createElement('select');
  clayObjectsList.size = 5;
  clayObjectsList.style.width = '100%';
  clayObjectsList.style.marginBottom = '8px';
  clayObjectsList.style.fontFamily = 'monospace';
  clayObjectsList.style.fontSize = '11px';
  clayObjectsSection.appendChild(clayObjectsList);

  function refreshClayObjectsList() {
    const selectedDestId = destinationList.value;
    // IMPORTANT: Preserve the currently selected clay object ID before clearing
    const selectedClayId = clayObjectsList.value;

    clayObjectsList.innerHTML = '';

    if (!selectedDestId || !window.destinationAuthoring) {
      const option = document.createElement('option');
      option.textContent = '(select a destination)';
      option.disabled = true;
      clayObjectsList.appendChild(option);
      return;
    }

    const clayObjects = window.destinationAuthoring.getClayObjectsForDestination(selectedDestId);

    if (clayObjects.length === 0) {
      const option = document.createElement('option');
      option.textContent = '(no clay objects)';
      option.disabled = true;
      clayObjectsList.appendChild(option);
      return;
    }

    clayObjects.forEach(clayObj => {
      const option = document.createElement('option');
      option.value = clayObj.id;
      option.textContent = `${clayObj.name} (${clayObj.shapes?.length || 0} shapes)`;
      clayObjectsList.appendChild(option);
    });

    // Restore the previously selected clay object if it still exists
    if (selectedClayId && clayObjects.some(obj => obj.id === selectedClayId)) {
      clayObjectsList.value = selectedClayId;
    }
  }

  // Refresh clay objects list when destination selection changes
  destinationList.addEventListener('change', refreshClayObjectsList);

  // Delete button for clay objects
  const deleteClayButton = document.createElement('button');
  deleteClayButton.textContent = '✖ Delete Clay Object';
  deleteClayButton.style.cssText = `
    width: 100%;
    padding: 8px;
    background: #aa0000;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
  `;
  deleteClayButton.addEventListener('click', () => {
    console.log('🗑️ Delete button clicked!');

    const selectedDestId = destinationList.value;
    const selectedClayId = clayObjectsList.value;

    console.log('🗑️ Selected destination ID:', selectedDestId);
    console.log('🗑️ Selected clay object ID:', selectedClayId);
    console.log('🗑️ window.destinationAuthoring exists:', !!window.destinationAuthoring);

    if (!selectedDestId) {
      console.warn('🗑️ No destination selected');
      alert('⚠️ Please select a destination first from the "Select Destination" dropdown above.');
      return;
    }

    if (!selectedClayId) {
      console.warn('🗑️ No clay object selected');
      alert('⚠️ Please select a clay object to delete.');
      return;
    }

    if (!window.destinationAuthoring) {
      console.error('🗑️ window.destinationAuthoring not available');
      alert('⚠️ Destination authoring system not available.');
      return;
    }

    const dest = window.destinationAuthoring.getDestination(selectedDestId);
    console.log('🗑️ Destination found:', dest);
    console.log('🗑️ Clay objects in destination:', dest?.clayObjects);

    const clayObj = dest?.clayObjects?.find(obj => obj.id === selectedClayId);
    console.log('🗑️ Clay object found:', clayObj);

    if (clayObj) {
      console.log('🗑️ Showing delete confirmation dialog for:', clayObj.name);
      showDeleteConfirmDialog(clayObj.name, () => {
        console.log('🗑️ Delete confirmed! Removing clay object...');
        window.destinationAuthoring.removeClayObjectFromDestination(selectedDestId, selectedClayId);
        console.log('🗑️ Refreshing clay objects list...');
        refreshClayObjectsList();
        console.log('🗑️ Delete complete!');
      });
    } else {
      console.error('🗑️ Clay object not found - cannot delete');
    }
  });

  function showDeleteConfirmDialog(clayObjectName, onConfirm) {
    console.log('🗑️ showDeleteConfirmDialog called for:', clayObjectName);

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: #1a1a1a;
      border: 2px solid #aa0000;
      border-radius: 8px;
      padding: 20px;
      max-width: 400px;
      box-shadow: 0 0 30px rgba(170, 0, 0, 0.5);
    `;

    const message = document.createElement('p');
    message.textContent = `Delete clay object "${clayObjectName}"?`;
    message.style.cssText = `
      color: #fff;
      margin: 0 0 20px 0;
      font-size: 14px;
      font-family: 'Courier New', monospace;
    `;
    modal.appendChild(message);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 10px;
    `;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.cssText = `
      background: #aa0000;
      border: none;
      color: #fff;
      padding: 10px 20px;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      cursor: pointer;
      border-radius: 4px;
      flex: 1;
    `;
    deleteBtn.onclick = () => {
      console.log('🗑️ Delete button in modal clicked!');
      document.body.removeChild(overlay);
      console.log('🗑️ Modal removed, calling onConfirm callback...');
      onConfirm();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
      background: #333;
      border: 1px solid #666;
      color: #fff;
      padding: 10px 20px;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      cursor: pointer;
      border-radius: 4px;
      flex: 1;
    `;
    cancelBtn.onclick = () => {
      console.log('🗑️ Cancel button clicked - closing modal');
      document.body.removeChild(overlay);
    };

    buttonContainer.appendChild(deleteBtn);
    buttonContainer.appendChild(cancelBtn);
    modal.appendChild(buttonContainer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    console.log('🗑️ Modal added to DOM');
  }
  clayObjectsSection.appendChild(deleteClayButton);

  section.appendChild(clayObjectsSection);

  // Listen for clay object events
  window.addEventListener('clayObjectAdded', () => {
    refreshClayObjectsList();
  });
  window.addEventListener('clayObjectRemoved', () => {
    refreshClayObjectsList();
  });

  // === EXPORT/IMPORT ===
  const ioButtons = document.createElement('div');
  ioButtons.style.display = 'grid';
  ioButtons.style.gridTemplateColumns = '1fr 1fr';
  ioButtons.style.gap = '8px';
  ioButtons.style.marginBottom = '16px';

  const exportButton = document.createElement('button');
  exportButton.textContent = '⬇ Export';
  exportButton.style.padding = '6px';
  exportButton.style.fontSize = '11px';
  exportButton.addEventListener('click', () => {
    if (window.destinationAuthoring) {
      window.destinationAuthoring.exportDestinations();
    }
  });
  ioButtons.appendChild(exportButton);

  const importButton = document.createElement('button');
  importButton.textContent = '⬆ Import';
  importButton.style.padding = '6px';
  importButton.style.fontSize = '11px';
  importButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      if (window.destinationAuthoring && e.target.files[0]) {
        window.destinationAuthoring.importDestinations(e.target.files[0]);
        refreshDestinationList();
      }
    };
    input.click();
  });
  ioButtons.appendChild(importButton);

  section.appendChild(ioButtons);

  // === MARKER VISIBILITY TOGGLE ===
  const visibilityLabel = document.createElement('label');
  visibilityLabel.style.display = 'block';
  visibilityLabel.style.marginBottom = '12px';
  visibilityLabel.style.fontSize = '12px';

  const visibilityCheckbox = document.createElement('input');
  visibilityCheckbox.type = 'checkbox';
  visibilityCheckbox.checked = true;
  visibilityCheckbox.addEventListener('change', (e) => {
    if (window.destinationAuthoring?.markerGroup) {
      window.destinationAuthoring.markerGroup.visible = e.target.checked;
    }
  });

  visibilityLabel.appendChild(visibilityCheckbox);
  visibilityLabel.appendChild(document.createTextNode(' Show Markers'));
  section.appendChild(visibilityLabel);

  // === CLEAR ALL ===
  const clearButton = document.createElement('button');
  clearButton.textContent = '🗑️ Clear All Destinations';
  clearButton.style.cssText = `
    width: 100%;
    padding: 6px;
    background: #660000;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
  `;
  clearButton.addEventListener('click', () => {
    if (!window.destinationAuthoring) return;

    if (confirm('Delete ALL destinations? This cannot be undone.')) {
      window.destinationAuthoring.clearAll();
      refreshDestinationList();
    }
  });
  section.appendChild(clearButton);

  // === CLAY MODELER ===
  const clayModelerButton = document.createElement('button');
  clayModelerButton.textContent = '🏗️ Open Clay Modeler';
  clayModelerButton.style.cssText = `
    width: 100%;
    padding: 10px;
    background: linear-gradient(135deg, #4CAF50, #2196F3);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    margin-top: 16px;
  `;
  clayModelerButton.addEventListener('click', async () => {
    // Lazy load Clay Modeler
    if (!window.ClayModeler) {
      const { clayModeler } = await import('./clayModeler.js');
      window.ClayModeler = clayModeler;
    }
    window.ClayModeler.toggle();
  });
  section.appendChild(clayModelerButton);

  container.appendChild(section);
  console.log("🎨 Destination HUD created");
}

console.log("🎨 hudDestinations.js ready");
