// Phase 11.7.50: Image Upload Module
// Handles file input & texture loading for mandala custom images

import * as THREE from 'three';

let currentTexture = null;

console.log("🖼️ imageUpload.js loaded");

/**
 * Load an image file as a THREE.Texture
 * @param {File} file - Image file from file input
 * @returns {Promise<THREE.Texture>} - Loaded texture
 */
export function loadImageAsTexture(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid file type. Please select an image file.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const imageUrl = e.target.result;
      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(
        imageUrl,
        (texture) => {
          // Dispose old texture if exists
          if (currentTexture) {
            currentTexture.dispose();
          }

          currentTexture = texture;
          console.log(`🖼️ Image loaded as texture: ${file.name}`);
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error('🖼️ Error loading texture:', error);
          reject(error);
        }
      );
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Clear the current texture and free memory
 */
export function clearTexture() {
  if (currentTexture) {
    currentTexture.dispose();
    currentTexture = null;
    console.log('🖼️ Texture cleared');
  }
}

/**
 * Get the current texture (if any)
 * @returns {THREE.Texture|null}
 */
export function getCurrentTexture() {
  return currentTexture;
}
