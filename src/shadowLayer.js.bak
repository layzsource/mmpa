// src/shadowLayer.js
// Phase 13.8: Shadow Layer - Split-screen panel with phase-offset echo visualization
// Implements the interpretive dimension for comparative analysis

import * as THREE from 'three';
import { state, getEffectiveAudio } from './state.js';

console.log("🌓 shadowLayer.js loaded");

let shadowPanel = null;
let shadowCanvas = null;
let shadowRenderer = null;
let shadowCamera = null;
let isActive = false;
let isCollapsed = false;

// Store references to main scene elements
let mainRenderer = null;
let mainCamera = null;
let mainScene = null;
let mainCanvas = null;
let mainComposer = null;

// Phase offset configuration
export const PHASE_OFFSET = 0.3; // 30% phase delay
export const ECHO_DECAY = 0.85;   // Echo intensity decay factor
export const COLOR_SHIFT = 30;    // Hue shift in degrees

/**
 * Initialize shadow layer split-screen panel
 */
export function initShadowLayer(scene, camera, renderer, composer) {
  mainScene = scene;
  mainCamera = camera;
  mainRenderer = renderer;
  mainCanvas = renderer.domElement;
  mainComposer = composer;

  console.log("🌓 Shadow layer initialized (split-screen mode)");
}

/**
 * Open shadow layer split-screen panel
 */
export function openShadowLayer() {
  if (isActive) {
    console.log("🌓 Shadow layer already active");
    return;
  }

  // Create shadow panel container
  shadowPanel = document.createElement('div');
  shadowPanel.id = 'shadowPanel';
  shadowPanel.style.cssText = `
    position: fixed;
    right: 0;
    top: 0;
    width: 50%;
    height: 100%;
    background: #000;
    border-left: 2px solid #6644aa;
    z-index: 500;
    transition: all 0.3s ease;
  `;

  // Store original main canvas styles
  const originalStyles = {
    width: mainCanvas.style.width || '100%',
    position: mainCanvas.style.position || '',
    left: mainCanvas.style.left || '',
    top: mainCanvas.style.top || ''
  };
  mainCanvas.dataset.originalStyles = JSON.stringify(originalStyles);

  // Create shadow canvas
  shadowCanvas = document.createElement('canvas');
  shadowCanvas.id = 'shadowCanvas';
  shadowCanvas.style.cssText = `
    display: block;
    width: 100%;
    height: 100%;
  `;

  // Create info overlay
  const infoDiv = document.createElement('div');
  infoDiv.style.cssText = `
    position: absolute;
    top: 10px;
    left: 10px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 11px;
    font-family: 'Courier New', monospace;
    pointer-events: none;
    text-shadow: 0 0 3px black;
  `;
  infoDiv.innerHTML = `
    🌓 Shadow Layer (Interpretive Dimension)<br>
    Phase Offset: ${(PHASE_OFFSET * 100).toFixed(0)}%<br>
    Echo Decay: ${(ECHO_DECAY * 100).toFixed(0)}%<br>
    Hue Shift: +${COLOR_SHIFT}°
  `;

  // Create collapse button
  const collapseBtn = document.createElement('button');
  collapseBtn.textContent = 'Collapse';
  collapseBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    border: 1px solid #555;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
    z-index: 501;
  `;
  collapseBtn.addEventListener('click', toggleCollapse);

  shadowPanel.appendChild(shadowCanvas);
  shadowPanel.appendChild(infoDiv);
  shadowPanel.appendChild(collapseBtn);
  document.body.appendChild(shadowPanel);

  // Initialize shadow renderer
  shadowRenderer = new THREE.WebGLRenderer({
    canvas: shadowCanvas,
    antialias: true,
    alpha: false
  });
  shadowRenderer.setPixelRatio(window.devicePixelRatio);
  shadowRenderer.setSize(shadowPanel.clientWidth, shadowPanel.clientHeight);

  // Create shadow camera (clone of main camera)
  shadowCamera = mainCamera.clone();

  // Adjust main canvas to take only left half (keep existing position style)
  const existingPosition = mainCanvas.style.position || 'fixed';
  mainCanvas.style.width = '50%';
  if (!mainCanvas.style.position || mainCanvas.style.position === 'static') {
    mainCanvas.style.position = 'fixed';
  }
  mainCanvas.style.left = '0';
  mainCanvas.style.top = '0';

  // Update main renderer size
  const width = window.innerWidth / 2;
  const height = window.innerHeight;
  mainRenderer.setSize(width, height, false); // false = don't update style
  mainCamera.aspect = width / height;
  mainCamera.updateProjectionMatrix();

  // Phase 13.8: Also update composer size
  if (mainComposer && mainComposer.setSize) {
    mainComposer.setSize(width, height);
  }

  isActive = true;
  console.log("🌓 Shadow layer panel opened (split-screen)");

  // Handle window resize
  window.addEventListener('resize', handleResize);
}

/**
 * Close shadow layer panel
 */
export function closeShadowLayer() {
  if (!isActive) return;

  // Remove shadow panel
  if (shadowPanel && shadowPanel.parentNode) {
    shadowPanel.parentNode.removeChild(shadowPanel);
  }

  // Dispose shadow renderer
  if (shadowRenderer) {
    shadowRenderer.dispose();
    shadowRenderer = null;
  }

  shadowPanel = null;
  shadowCanvas = null;
  shadowCamera = null;

  // Restore main canvas to original styles
  if (mainCanvas.dataset.originalStyles) {
    try {
      const originalStyles = JSON.parse(mainCanvas.dataset.originalStyles);
      mainCanvas.style.width = originalStyles.width;
      mainCanvas.style.position = originalStyles.position;
      mainCanvas.style.left = originalStyles.left;
      mainCanvas.style.top = originalStyles.top;
      delete mainCanvas.dataset.originalStyles;
    } catch (e) {
      console.warn("Failed to restore original canvas styles", e);
      mainCanvas.style.width = '100%';
      mainCanvas.style.position = '';
      mainCanvas.style.left = '';
      mainCanvas.style.top = '';
    }
  } else {
    // Fallback if original styles weren't saved
    mainCanvas.style.width = '100%';
    mainCanvas.style.position = '';
    mainCanvas.style.left = '';
    mainCanvas.style.top = '';
  }

  // Update main renderer size (don't force style update)
  mainRenderer.setSize(window.innerWidth, window.innerHeight, false);
  mainCamera.aspect = window.innerWidth / window.innerHeight;
  mainCamera.updateProjectionMatrix();

  // Phase 13.8: Also restore composer size
  if (mainComposer && mainComposer.setSize) {
    mainComposer.setSize(window.innerWidth, window.innerHeight);
  }

  window.removeEventListener('resize', handleResize);

  isActive = false;
  isCollapsed = false;
  console.log("🌓 Shadow layer closed and main canvas restored");
}

/**
 * Toggle shadow layer
 */
export function toggleShadowLayer() {
  if (isActive) {
    closeShadowLayer();
  } else {
    openShadowLayer();
  }
}

/**
 * Toggle collapse state
 */
function toggleCollapse() {
  if (!shadowPanel) return;

  isCollapsed = !isCollapsed;

  if (isCollapsed) {
    // Collapse to 200px width on right side
    shadowPanel.style.width = '200px';
    shadowPanel.querySelector('button').textContent = 'Expand';
  } else {
    // Expand to 50% width
    shadowPanel.style.width = '50%';
    shadowPanel.querySelector('button').textContent = 'Collapse';
  }

  // Update renderer sizes
  handleResize();

  console.log(`🌓 Shadow layer ${isCollapsed ? 'collapsed' : 'expanded'}`);
}

/**
 * Handle window resize
 */
function handleResize() {
  if (!isActive) return;

  const shadowWidth = isCollapsed ? 200 : window.innerWidth / 2;
  const mainWidth = window.innerWidth - shadowWidth;
  const height = window.innerHeight;

  // Update main canvas width style
  mainCanvas.style.width = `${(mainWidth / window.innerWidth) * 100}%`;

  // Update shadow panel width
  if (shadowPanel) {
    shadowPanel.style.width = isCollapsed ? '200px' : '50%';
  }

  // Update main renderer size (don't force style update)
  mainRenderer.setSize(mainWidth, height, false);
  mainCamera.aspect = mainWidth / height;
  mainCamera.updateProjectionMatrix();

  // Phase 13.8: Also update composer size
  if (mainComposer && mainComposer.setSize) {
    mainComposer.setSize(mainWidth, height);
  }

  // Update shadow renderer size
  if (shadowRenderer && shadowCamera) {
    shadowRenderer.setSize(shadowWidth, height);
    shadowCamera.aspect = shadowWidth / height;
    shadowCamera.updateProjectionMatrix();
  }

  console.log(`🌓 Resized: main=${mainWidth}px, shadow=${shadowWidth}px`);
}

/**
 * Render shadow layer with phase offset
 * Called from main animation loop
 */
export function renderShadowLayer() {
  if (!isActive || !shadowRenderer || !shadowCamera || !mainScene) return;

  // Store original camera properties
  const originalPosition = mainCamera.position.clone();
  const originalRotation = mainCamera.rotation.clone();
  const originalQuaternion = mainCamera.quaternion.clone();

  // Apply phase offset to time-based animations
  const time = performance.now() * 0.001;
  const phaseTime = time - PHASE_OFFSET;
  const timeDelta = time - phaseTime;

  // Temporarily modify scene for shadow rendering
  mainScene.traverse((obj) => {
    // Store current state BEFORE any modifications
    obj.userData.shadowOriginalPosition = obj.position.clone();
    obj.userData.shadowOriginalRotation = obj.rotation.clone();
    obj.userData.shadowOriginalQuaternion = obj.quaternion.clone();
    obj.userData.shadowOriginalScale = obj.scale.clone();

    // Apply phase offset transformations
    if (obj.rotation) {
      obj.rotation.x -= timeDelta * 0.3 * ECHO_DECAY;
      obj.rotation.y -= timeDelta * 0.2 * ECHO_DECAY;
      obj.rotation.z -= timeDelta * 0.15 * ECHO_DECAY;
    }

    // Apply echo decay to scale (multiply each component)
    if (obj.scale && obj.type !== 'Scene') {
      obj.scale.x *= ECHO_DECAY;
      obj.scale.y *= ECHO_DECAY;
      obj.scale.z *= ECHO_DECAY;
    }

    // Apply color shift
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(mat => applyColorShift(mat));
      } else {
        applyColorShift(obj.material);
      }
    }
  });

  // Copy camera with slight offset
  shadowCamera.position.copy(originalPosition);
  shadowCamera.rotation.copy(originalRotation);
  shadowCamera.quaternion.copy(originalQuaternion);

  // Add slight orbital offset to shadow camera
  const orbitOffset = Math.sin(phaseTime * 0.1) * 0.5 * ECHO_DECAY;
  shadowCamera.position.x += orbitOffset;

  // Render shadow view
  shadowRenderer.render(mainScene, shadowCamera);

  // Restore original transformations
  mainScene.traverse((obj) => {
    if (obj.userData.shadowOriginalPosition) {
      obj.position.copy(obj.userData.shadowOriginalPosition);
      obj.rotation.copy(obj.userData.shadowOriginalRotation);
      obj.quaternion.copy(obj.userData.shadowOriginalQuaternion);
      obj.scale.copy(obj.userData.shadowOriginalScale);

      // Clean up stored values
      delete obj.userData.shadowOriginalPosition;
      delete obj.userData.shadowOriginalRotation;
      delete obj.userData.shadowOriginalQuaternion;
      delete obj.userData.shadowOriginalScale;
    }

    // Restore original colors
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(mat => restoreColor(mat));
      } else {
        restoreColor(obj.material);
      }
    }
  });
}

/**
 * Apply color shift to material
 */
function applyColorShift(material) {
  if (!material.color) return;

  // Store original color
  material.userData.originalColor = material.color.clone();

  // Apply hue shift
  const hsl = { h: 0, s: 0, l: 0 };
  material.color.getHSL(hsl);
  hsl.h = (hsl.h + COLOR_SHIFT / 360) % 1.0;
  material.color.setHSL(hsl.h, hsl.s, hsl.l);

  // Also shift emissive if present
  if (material.emissive) {
    material.userData.originalEmissive = material.emissive.clone();
    material.emissive.getHSL(hsl);
    hsl.h = (hsl.h + COLOR_SHIFT / 360) % 1.0;
    material.emissive.setHSL(hsl.h, hsl.s, hsl.l);
  }
}

/**
 * Restore original material color
 */
function restoreColor(material) {
  if (material.userData.originalColor) {
    material.color.copy(material.userData.originalColor);
  }
  if (material.userData.originalEmissive) {
    material.emissive.copy(material.userData.originalEmissive);
  }
}

/**
 * Check if shadow layer is active
 */
export function isShadowLayerOpen() {
  return isActive;
}

/**
 * Update shadow layer configuration
 */
export function setShadowLayerConfig(config) {
  console.log("🌓 Shadow layer config update:", config);
}

console.log("🌓 Shadow Layer module ready (split-screen mode)");
