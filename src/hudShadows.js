// hudShadows.js - Phase 11.7.50: Modular Shadows HUD Section
// Extracted from hud.js for better organization

import { state } from './state.js';

console.log("🌑 hudShadows.js loaded");

/**
 * Create Shadows HUD section with all controls
 * @param {HTMLElement} container - Parent container to append controls to
 * @param {Function} notifyHUDUpdate - Callback to notify main HUD of state changes
 * @param {Function} createToggleControl - Helper function for toggle controls
 * @param {Function} createSliderControl - Helper function for slider controls
 * @param {Function} createColorPickerControl - Helper function for color picker controls
 */
export function createShadowsHudSection(container, notifyHUDUpdate, createToggleControl, createSliderControl, createColorPickerControl) {
  // Add separator for Shadows controls
  const shadowsSeparator = document.createElement('hr');
  shadowsSeparator.style.cssText = 'border: 1px solid #555; margin: 15px 0;';
  container.appendChild(shadowsSeparator);

  const shadowsTitle = document.createElement('h4');
  shadowsTitle.textContent = '🌑 Shadows';
  shadowsTitle.style.cssText = 'margin: 0 0 10px 0; color: #555; font-size: 12px;';
  container.appendChild(shadowsTitle);

  // Shadows enable toggle
  const shadowsEnableControl = createToggleControl('Enable Shadows', true, (value) => {
    notifyHUDUpdate({ shadowsEnabled: value });
  });
  container.appendChild(shadowsEnableControl);

  // Ground shadow checkbox
  const groundShadowControl = createToggleControl('Ground Shadow', true, (value) => {
    notifyHUDUpdate({ shadowsGround: value });
  });
  container.appendChild(groundShadowControl);

  // Backdrop shadow checkbox
  const backdropShadowControl = createToggleControl('Backdrop Shadow', true, (value) => {
    notifyHUDUpdate({ shadowsBackdrop: value });
  });
  container.appendChild(backdropShadowControl);

  // Shadow opacity slider
  const shadowOpacityControl = createSliderControl('Shadow Opacity', 0.25, 0.0, 1.0, 0.05, (value) => {
    notifyHUDUpdate({ shadowsOpacity: value });
  });
  container.appendChild(shadowOpacityControl);

  // Shadow color picker
  const shadowColorControl = createColorPickerControl('Shadow Color', '#000000', (value) => {
    notifyHUDUpdate({ shadowsColor: value });
  });
  container.appendChild(shadowColorControl);

  // console.log("🌑 Shadows);
}

// Phase 13.2: Register update callback
// Phase 13.4.2: Removed registerHUDCallback to fix circular dependency
// Signal Bridge pattern doesn't need explicit registration
