// src/shadows.js
import * as THREE from 'three';
import { state, blendColors, getEffectiveAudio } from './state.js'; // Phase 11.4.3: Import stable audio gate

console.log("🌑 shadows.js loaded");

let groundShadow = null;
let backdropShadow = null;
let shadowMaterial = null;

export function initShadows(scene) {
  console.log("🌑 Initializing multi-plane shadow system (v2.2.0)...");

  // Shared shadow material
  shadowMaterial = new THREE.MeshBasicMaterial({
    color: state.shadows.color,
    transparent: true,
    opacity: state.shadows.opacity,
    depthWrite: false
  });

  // Ground shadow: CircleGeometry (3, 64), positioned at y = -1.2
  const groundGeometry = new THREE.CircleGeometry(3, 64);
  groundShadow = new THREE.Mesh(groundGeometry, shadowMaterial);
  groundShadow.rotation.x = -Math.PI / 2; // Rotate to lie flat on ground
  groundShadow.position.y = -1.2;
  groundShadow.visible = state.shadows.enabled && state.shadows.ground;
  scene.add(groundShadow);

  // Backdrop shadow: PlaneGeometry (8×8), positioned behind vessel at z = -4
  const backdropGeometry = new THREE.PlaneGeometry(8, 8);
  backdropShadow = new THREE.Mesh(backdropGeometry, shadowMaterial.clone());
  backdropShadow.position.z = -4;
  backdropShadow.visible = state.shadows.enabled && state.shadows.backdrop;
  scene.add(backdropShadow);

  console.log("✅ Multi-plane shadow system initialized");
}

export function updateShadows(audioReactive) {
  if (!groundShadow || !backdropShadow || !shadowMaterial) return;

  // Update visibility from state
  groundShadow.visible = state.shadows.enabled && state.shadows.ground;
  backdropShadow.visible = state.shadows.enabled && state.shadows.backdrop;

  // Phase 11.2.1: Layered color system
  const layerConfig = state.colorLayers.shadows;
  const audioData = getEffectiveAudio();
  const audioLevel = (audioData.bass + audioData.mid + audioData.treble) / 3;

  let finalColor = layerConfig.baseColor;

  if (state.audioReactive) {
    // Phase 11.2.1: Additive color blending
    finalColor = blendColors(
      layerConfig.baseColor,
      layerConfig.audioColor,
      layerConfig.audioIntensity,
      audioLevel
    );

    // Debug logging (2% sample rate)
    if (Math.random() < 0.02) {
      // console.log(`🌑 Shadows:);
    }

    // Map bass → opacity pulse (±0.1 range)
    const bassPulse = (audioData.bass || 0) * 0.1;
    const baseOpacity = state.shadows.opacity;
    shadowMaterial.opacity = Math.max(0.0, Math.min(1.0, baseOpacity + bassPulse));

    // Map mid → backdrop only subtle flicker (±0.05)
    if (backdropShadow.visible) {
      const midFlicker = (audioData.mid || 0) * 0.05;
      backdropShadow.material.opacity = Math.max(0.0, Math.min(1.0, baseOpacity + midFlicker));
    }
  } else {
    // Static opacity when audio reactivity is off
    shadowMaterial.opacity = state.shadows.opacity;
    backdropShadow.material.opacity = state.shadows.opacity;
  }

  // Apply layered color
  shadowMaterial.color.set(finalColor);
  backdropShadow.material.color.set(finalColor);

  // Scale shadows dynamically with vessel scale
  const vesselScale = state.vessel.scale || 1.0;
  groundShadow.scale.setScalar(vesselScale);
  backdropShadow.scale.setScalar(vesselScale);
}

export function getShadowElements() {
  return { groundShadow, backdropShadow, shadowMaterial };
}

console.log("🌑 Enhanced shadow module ready");