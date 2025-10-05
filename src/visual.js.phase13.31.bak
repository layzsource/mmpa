// visual.js - Phase 11.6.0/11.7.50: Background plane texture system with scale control
import * as THREE from "three";
import { state } from "./state.js";

console.log("🖼️ visual.js loaded");

let backgroundMesh = null;

// Phase 11.7.50: Export backgroundMesh for external access (HUD scale control)
export function getBackgroundMesh() {
  return backgroundMesh;
}

export function initVisual(scene) {
  // Phase 11.7.50: Use aspect ratio for proper fullscreen coverage
  const aspect = window.innerWidth / window.innerHeight;
  const geometry = new THREE.PlaneGeometry(2 * aspect, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0x111111 });
  backgroundMesh = new THREE.Mesh(geometry, material);
  backgroundMesh.position.z = -10; // push back behind everything
  scene.add(backgroundMesh);
  console.log("🖼️ Background plane initialized");
}

export function updateVisual() {
  if (!backgroundMesh) return;

  // Phase 11.6.1: Only show texture when both texture exists AND toggle is ON
  if (state.useBackgroundImage && state.texture) {
    backgroundMesh.material.map = state.texture;
    backgroundMesh.material.color.set(0xffffff); // white base for texture visibility
  } else {
    backgroundMesh.material.map = null;
    backgroundMesh.material.color.set(0x111111); // dark gray fallback
  }
  backgroundMesh.material.needsUpdate = true;

  // Phase 11.7.50: Apply background scale with aspect ratio preservation
  const scale = state.backgroundScale || 1.0;
  backgroundMesh.scale.set(scale, scale, 1);
}

// Phase 11.7.50: Update background scale (called from HUD)
export function setBackgroundScale(scale) {
  if (!backgroundMesh) return;
  state.backgroundScale = scale;
  backgroundMesh.scale.set(scale, scale, 1);
}
