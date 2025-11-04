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

  container.appendChild(section);
  console.log("🎨 Destination HUD created");
}

console.log("🎨 hudDestinations.js ready");
