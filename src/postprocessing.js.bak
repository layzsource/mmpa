// postprocessing.js
// Dual Trail System: Motion Trails via AfterimagePass (postprocessing blur)

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';

console.log("🎞️ postprocessing.js loaded");

/**
 * Creates an EffectComposer with AfterimagePass for motion blur trails
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @returns {{ composer: EffectComposer, afterimagePass: AfterimagePass }}
 */
export function createPostProcessing(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);

  // RenderPass: renders the scene normally
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // AfterimagePass: creates motion blur by blending with previous frames
  const afterimagePass = new AfterimagePass();
  afterimagePass.uniforms['damp'].value = 0.96; // default intensity (0.85-0.99 range)
  composer.addPass(afterimagePass);

  console.log("🎞️ EffectComposer initialized with AfterimagePass (damp: 0.96)");

  return { composer, afterimagePass };
}