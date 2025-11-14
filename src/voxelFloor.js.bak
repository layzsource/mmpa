import * as THREE from 'three';
import { state, getEffectiveAudio } from './state.js';
import { getBackgroundMesh } from './visual.js';

console.log("🧱 voxelFloor.js loaded");

let voxelFloorGroup = null;
let voxelMeshes = [];
let voxelGeometry = null;
let voxelMaterials = [];
const GRID_SIZE = 64;
const SPACING = 0.5;  // Tighter spacing - nearly touching
const BASE_HEIGHT = 0.35;

// Phase 13.7.3: 64×64 Voxel Floor System
// Individual cube meshes that respond to audio with wave propagation

/**
 * Initialize the voxel floor - 64×64 grid of cube meshes
 */
export function initVoxelFloor(scene) {
  console.log("🧱 Initializing 64×64 voxel background...");

  voxelFloorGroup = new THREE.Group();

  // Shared geometry for all voxels (nearly touching with 0.5 spacing)
  voxelGeometry = new THREE.BoxGeometry(0.48, BASE_HEIGHT, 0.48);

  // Create 64×64 grid as vertical background (X-Y plane, not X-Z floor)
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      // Create material for this voxel
      const material = new THREE.MeshStandardMaterial({
        color: 0x263036,
        metalness: 0.12,
        roughness: 0.52,
        emissive: 0x000000,
        emissiveIntensity: 0.0
      });

      // Create mesh
      const voxel = new THREE.Mesh(voxelGeometry, material);

      // Position in vertical grid (X-Y plane, centered around origin)
      voxel.position.set(
        (x - GRID_SIZE / 2) * SPACING,
        (y - GRID_SIZE / 2) * SPACING,
        0  // Z=0, will be moved back as group
      );

      // Store grid coordinates for wave calculations
      voxel.userData.gridX = x;
      voxel.userData.gridZ = y;  // Using Y as the second dimension for wave
      voxel.userData.baseY = 0;

      voxelFloorGroup.add(voxel);
      voxelMeshes.push(voxel);
      voxelMaterials.push(material);
    }
  }

  // Position entire group at background plane depth
  voxelFloorGroup.position.set(0, 0, -10);

  scene.add(voxelFloorGroup);
  console.log(`✅ Voxel floor initialized: ${voxelMeshes.length} voxels`);
}

/**
 * Convert hue (0-1) to RGB
 */
function hueToRgb(h) {
  const r = Math.max(0, Math.min(1, Math.abs(h * 6.0 - 3.0) - 1.0));
  const g = Math.max(0, Math.min(1, 2.0 - Math.abs(h * 6.0 - 2.0)));
  const b = Math.max(0, Math.min(1, 2.0 - Math.abs(h * 6.0 - 4.0)));
  return new THREE.Color(r, g, b);
}

/**
 * Update voxel floor - wave propagation and audio reactivity
 * Phase 13.7.3: True volumetric 3D mesh voxels with real depth
 */
export function updateVoxelFloor(time) {
  if (!voxelFloorGroup || !state.voxelWave?.enabled) {
    // Hide voxel floor when disabled
    if (voxelFloorGroup) voxelFloorGroup.visible = false;
    return;
  }

  // Show voxel floor when enabled
  voxelFloorGroup.visible = true;

  // Get audio data only if audio reactivity is enabled
  const audioReactive = state.voxelWave?.audioReactive || false;
  const audioData = audioReactive ? getEffectiveAudio() : { bass: 0, mid: 0, treble: 0 };
  const spectralFlux = (audioData.bass + audioData.mid + audioData.treble) / 3;
  const modWheel = audioData.bass * 0.5;

  // Wave parameters from state (with optional audio modulation)
  const amplitude = (state.voxelWave.amplitude || 0.28) * (1.0 + (audioReactive ? 0.35 * modWheel : 0));
  const frequency = (state.voxelWave.frequency || 0.6) * (audioReactive ? 0.6 + 0.6 * spectralFlux : 1.0);
  const speed = (state.voxelWave.speed || 1.0) * (audioReactive ? 1.0 + 1.2 * spectralFlux : 1.0);
  const colorShift = state.voxelWave.colorShift || 0.0;

  // Neutral base color
  const baseFloorNeutral = new THREE.Color(0.26, 0.30, 0.36);

  // Update each voxel
  for (let i = 0; i < voxelMeshes.length; i++) {
    const voxel = voxelMeshes[i];
    const material = voxelMaterials[i];
    const ix = voxel.userData.gridX;
    const iz = voxel.userData.gridZ;

    // Wave propagation calculation
    const phase = (ix + iz) * frequency + time * speed;
    const waveHeight = amplitude * Math.sin(phase);

    // Update voxel depth (Z-axis for vertical background)
    const targetHeight = BASE_HEIGHT + waveHeight;
    voxel.scale.z = targetHeight / BASE_HEIGHT;
    voxel.position.z = -10 + (targetHeight - BASE_HEIGHT) * 0.5;

    // Grid-based color cycling (with optional audio modulation)
    const gridPhase = (ix + iz) * (audioReactive ? 0.20 + 0.60 * spectralFlux : 0.20) + time * (audioReactive ? 0.35 + 1.35 * spectralFlux : 0.35);
    const baseHue = (0.50 + colorShift * 0.05) % 1.0;
    const hue = (baseHue + 0.45 * Math.sin(gridPhase)) % 1.0;

    // Convert hue to RGB tint
    const tint = hueToRgb(hue);

    // Tint amount with optional audio reactivity (up to 2.0 for vivid)
    const tintAmt = Math.max(0.0, Math.min(2.0, audioReactive ? 0.45 + 0.9 * spectralFlux + 0.45 * modWheel : 0.45));

    // Create vivid color (boosted by 1.8 + optional audio)
    const vividBoost = audioReactive ? 1.8 + 1.6 * spectralFlux : 1.8;
    const vivid = tint.clone().multiplyScalar(vividBoost);

    // Mix neutral base with vivid tint
    const finalColor = baseFloorNeutral.clone().lerp(vivid, tintAmt);

    // Apply color
    material.color.copy(finalColor);

    // Emissive for brightness boost (optional audio)
    const emissiveIntensity = audioReactive ? Math.max(0, spectralFlux * 0.8) : 0;
    material.emissive.copy(finalColor);
    material.emissiveIntensity = emissiveIntensity;
  }
}

/**
 * Get the voxel floor group for external access
 */
export function getVoxelFloorGroup() {
  return voxelFloorGroup;
}

/**
 * Dispose of voxel floor resources
 */
export function disposeVoxelFloor() {
  if (voxelFloorGroup) {
    voxelMeshes.forEach(voxel => {
      voxel.geometry.dispose();
      voxel.material.dispose();
    });
    voxelFloorGroup.parent?.remove(voxelFloorGroup);
    voxelMeshes = [];
    voxelMaterials = [];
    voxelFloorGroup = null;
  }
}

console.log("🧱 Voxel floor module ready");
