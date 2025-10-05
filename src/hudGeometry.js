console.log("🎯 hudGeometry.js loaded");

import { setSkyboxMode, setWireframeMode, centerCameraAndMorph } from './geometry.js';
import { state } from './state.js';

/**
 * Phase 12.0: Geometry HUD section
 * Controls: Skybox Mode, Wireframe, Center Me button
 */
export function createGeometryHudSection(container, sceneRefs = {}) {
  const section = document.createElement('div');
  section.className = 'hud-section geometry';

  // Title
  const title = document.createElement('h3');
  title.textContent = 'Geometry';
  section.appendChild(title);

  // Skybox Mode toggle
  const skyboxLabel = document.createElement('label');
  skyboxLabel.style.display = 'block';
  skyboxLabel.style.marginBottom = '8px';

  const skyboxCheckbox = document.createElement('input');
  skyboxCheckbox.type = 'checkbox';
  skyboxCheckbox.checked = !!state.geometry.skyboxMode;
  skyboxCheckbox.addEventListener('change', () => {
    setSkyboxMode(skyboxCheckbox.checked);
  });

  skyboxLabel.appendChild(skyboxCheckbox);
  skyboxLabel.appendChild(document.createTextNode(' Skybox Mode (double-sided)'));
  section.appendChild(skyboxLabel);

  // Wireframe toggle
  const wireframeLabel = document.createElement('label');
  wireframeLabel.style.display = 'block';
  wireframeLabel.style.marginBottom = '8px';

  const wireframeCheckbox = document.createElement('input');
  wireframeCheckbox.type = 'checkbox';
  wireframeCheckbox.checked = !!state.geometry.wireframe;
  wireframeCheckbox.addEventListener('change', () => {
    setWireframeMode(wireframeCheckbox.checked);
  });

  wireframeLabel.appendChild(wireframeCheckbox);
  wireframeLabel.appendChild(document.createTextNode(' Wireframe'));
  section.appendChild(wireframeLabel);

  // Center Me button
  const centerButton = document.createElement('button');
  centerButton.textContent = 'Center Me';
  centerButton.style.padding = '8px 12px';
  centerButton.style.marginTop = '8px';
  centerButton.style.cursor = 'pointer';
  centerButton.addEventListener('click', () => {
    // Pass controls from sceneRefs if available
    centerCameraAndMorph(sceneRefs.controls);
  });
  section.appendChild(centerButton);

  container.appendChild(section);
  console.log("🎯 Geometry HUD section created");
}

console.log("🎯 hudGeometry.js ready");

// Phase 13.4.2: Removed registerHUDCallback to fix circular dependency
