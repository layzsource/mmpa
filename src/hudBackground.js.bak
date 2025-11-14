// hudBackground.js - Phase 11.7.50: Modular Background HUD Section
// Extracted from hud.js for better organization

import * as THREE from 'three';
import { state } from './state.js';
import { setBackgroundScale, setSkyboxMode, setSkyboxFaceTexture } from './visual.js';

console.log("🖼️ hudBackground.js loaded");

/**
 * Create Background HUD section with all controls
 * @param {HTMLElement} container - Parent container to append controls to
 */
export function createBackgroundHudSection(container) {
  // Phase 11.6.0: Image/Video Upload + Texture Toggle
  const uploadInput = document.createElement("input");
  uploadInput.type = "file";
  uploadInput.accept = "image/*,video/*";
  uploadInput.style.display = "none";

  const uploadButton = document.createElement("button");
  uploadButton.innerText = "Upload Media";
  uploadButton.style.cssText = 'margin: 10px 0; padding: 8px 12px; background: #444; color: white; border: 1px solid #666; border-radius: 4px; cursor: pointer;';
  uploadButton.onclick = () => uploadInput.click();

  // Phase 13.7: Folder upload for skybox
  const folderUploadInput = document.createElement("input");
  folderUploadInput.type = "file";
  folderUploadInput.accept = "image/*,video/*";
  folderUploadInput.webkitdirectory = true;
  folderUploadInput.multiple = true;
  folderUploadInput.style.display = "none";

  const folderUploadButton = document.createElement("button");
  folderUploadButton.innerText = "Upload Skybox Folder";
  folderUploadButton.style.cssText = 'margin: 10px 0; padding: 8px 12px; background: #446; color: white; border: 1px solid #668; border-radius: 4px; cursor: pointer;';
  folderUploadButton.onclick = () => folderUploadInput.click();

  // Phase 13.7: Folder upload handler for skybox faces
  folderUploadInput.addEventListener("change", async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Filter only image and video files
    const mediaFiles = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));

    // Sort files alphabetically to ensure consistent ordering
    mediaFiles.sort((a, b) => a.name.localeCompare(b.name));

    console.log(`📁 Loading ${mediaFiles.length} media files for skybox (filtered from ${files.length} total files)...`);
    console.log('📋 File order:', mediaFiles.map(f => f.name).join(', '));

    if (mediaFiles.length === 0) {
      console.warn('⚠️ No valid media files found in folder');
      return;
    }

    // Auto-enable skybox mode
    state.useSkybox = true;
    setSkyboxMode(true);
    if (skyboxToggle) skyboxToggle.checked = true;

    // Face order: Right(0), Left(1), Top(2), Bottom(3), Front(4), Back(5)
    const faceNames = ['Right', 'Left', 'Top', 'Bottom', 'Front', 'Back'];

    // Load up to 6 files to the 6 faces
    const loadPromises = mediaFiles.slice(0, 6).map((file, index) => {
      return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const isVideo = file.type.startsWith('video/');

        if (isVideo) {
          const video = document.createElement('video');
          video.src = url;
          video.loop = true;
          video.muted = true;
          video.playsInline = true;

          video.addEventListener('loadeddata', () => {
            video.play();
            const texture = new THREE.VideoTexture(video);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.format = THREE.RGBFormat;

            state.skyboxTextures[index] = texture;
            state.skyboxVideoElements[index] = video;
            setSkyboxFaceTexture(index, texture);

            console.log(`🎥 ${faceNames[index]} face (${index}) ← ${file.name}`);
            resolve();
          });

          video.addEventListener('error', (err) => {
            console.error(`❌ Video load failed for ${faceNames[index]}:`, err);
            resolve();
          });
        } else {
          const loader = new THREE.TextureLoader();
          loader.load(
            url,
            (texture) => {
              texture.minFilter = THREE.LinearFilter;
              texture.magFilter = THREE.LinearFilter;
              texture.needsUpdate = true;

              state.skyboxTextures[index] = texture;
              state.skyboxVideoElements[index] = null;
              setSkyboxFaceTexture(index, texture);

              console.log(`🖼️ ${faceNames[index]} face (${index}) ← ${file.name}`);
              resolve();
            },
            undefined,
            (err) => {
              console.error(`❌ Image load failed for ${faceNames[index]}:`, err);
              resolve();
            }
          );
        }
      });
    });

    // Wait for all textures to load
    await Promise.all(loadPromises);

    // Update face indicators
    if (window.updateSkyboxFaceIndicators) window.updateSkyboxFaceIndicators();

    console.log(`✅ Skybox loaded with ${Math.min(mediaFiles.length, 6)} faces`);
  });

  uploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video/');

    if (isVideo) {
      // Create video element for video texture
      const video = document.createElement('video');
      video.src = url;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;

      video.addEventListener('loadeddata', () => {
        video.play();
        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
        state.texture = texture;
        state.videoElement = video; // Store reference for cleanup

        // Phase 13.6.2: Apply to skybox face if in skybox mode
        if (state.useSkybox) {
          const faceIndex = state.skyboxFaceIndex || 4; // Default to front face
          state.skyboxTextures[faceIndex] = texture;
          state.skyboxVideoElements[faceIndex] = video;
          setSkyboxFaceTexture(faceIndex, texture);
          if (window.updateSkyboxFaceIndicators) window.updateSkyboxFaceIndicators();
          console.log(`🎥 Video loaded → ${file.name} (Face ${faceIndex})`);
        } else {
          console.log("🎥 Video loaded →", file.name);
        }
      });

      video.addEventListener('error', (err) => {
        console.error("❌ Video load failed:", err);
      });
    } else {
      // Image loading (existing logic)
      const loader = new THREE.TextureLoader();
      loader.load(
        url,
        (texture) => {
          // Configure texture filters for proper display
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.needsUpdate = true;

          state.texture = texture;
          state.videoElement = null; // Clear any previous video

          // Phase 13.6.2: Apply to skybox face if in skybox mode
          if (state.useSkybox) {
            const faceIndex = state.skyboxFaceIndex || 4; // Default to front face
            state.skyboxTextures[faceIndex] = texture;
            state.skyboxVideoElements[faceIndex] = null; // Image, not video
            setSkyboxFaceTexture(faceIndex, texture);
            if (window.updateSkyboxFaceIndicators) window.updateSkyboxFaceIndicators();
            console.log(`🖼️ Image loaded → ${file.name} (Face ${faceIndex})`);
          } else {
            console.log("🖼️ Image loaded →", file.name);
          }
        },
        undefined,
        (err) => console.error("❌ Texture load failed:", err)
      );
    }
  });

  // Phase 13.7: Separate upload for morph shape texture
  const morphUploadInput = document.createElement("input");
  morphUploadInput.type = "file";
  morphUploadInput.accept = "image/*,video/*";
  morphUploadInput.style.display = "none";

  const morphUploadButton = document.createElement("button");
  morphUploadButton.innerText = "Upload Morph Texture";
  morphUploadButton.style.cssText = 'margin: 10px 0; padding: 8px 12px; background: #444; color: white; border: 1px solid #666; border-radius: 4px; cursor: pointer;';
  morphUploadButton.onclick = () => morphUploadInput.click();

  morphUploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video/');

    if (isVideo) {
      // Create video element for video texture
      const video = document.createElement('video');
      video.src = url;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;

      video.addEventListener('loadeddata', () => {
        video.play();
        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
        state.morphTexture = texture;
        state.morphVideoElement = video; // Store reference for cleanup

        // Auto-enable morph texture toggle
        state.useTextureOnMorph = true;
        morphToggle.checked = true;

        console.log(`🎥 Morph video loaded → ${file.name}`);
      });

      video.addEventListener('error', (err) => {
        console.error("❌ Morph video load failed:", err);
      });
    } else {
      // Image loading
      const loader = new THREE.TextureLoader();
      loader.load(
        url,
        (texture) => {
          // Configure texture filters for proper display
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.needsUpdate = true;

          state.morphTexture = texture;
          state.morphVideoElement = null; // Clear any previous video

          // Auto-enable morph texture toggle
          state.useTextureOnMorph = true;
          morphToggle.checked = true;

          console.log(`🖼️ Morph image loaded → ${file.name}`);
        },
        undefined,
        (err) => console.error("❌ Morph texture load failed:", err)
      );
    }
  });

  const morphToggle = document.createElement("input");
  morphToggle.type = "checkbox";
  morphToggle.checked = state.useTextureOnMorph;
  morphToggle.onchange = (e) => {
    state.useTextureOnMorph = e.target.checked;
    console.log("🎛️ Morph texture:", state.useTextureOnMorph ? "ON" : "OFF");
  };

  const morphLabel = document.createElement("label");
  morphLabel.innerText = "Apply texture to morph shape";
  morphLabel.style.cssText = 'display: block; margin: 10px 0; cursor: pointer;';
  morphLabel.prepend(morphToggle);

  // Phase 11.6.1: Background image toggle
  const bgToggle = document.createElement('input');
  bgToggle.type = 'checkbox';
  bgToggle.id = 'useBackgroundImage';
  bgToggle.checked = state.useBackgroundImage;
  bgToggle.onchange = () => {
    state.useBackgroundImage = bgToggle.checked;
    console.log(`🎛️ Background image: ${state.useBackgroundImage ? 'ON' : 'OFF'}`);
  };

  const bgLabel = document.createElement('label');
  bgLabel.htmlFor = 'useBackgroundImage';
  bgLabel.innerText = 'Show as background';
  bgLabel.style.cssText = 'display: block; margin: 10px 0; cursor: pointer;';
  bgLabel.prepend(bgToggle);

  // Phase 11.7.50: Background Scale slider
  const bgScaleContainer = document.createElement('div');
  bgScaleContainer.style.cssText = 'margin: 10px 0;';

  const bgScaleLabel = document.createElement('label');
  bgScaleLabel.textContent = 'Background Scale:';
  bgScaleLabel.style.cssText = 'display: block; margin-bottom: 4px; font-size: 12px;';

  const bgScaleSlider = document.createElement('input');
  bgScaleSlider.type = 'range';
  bgScaleSlider.min = '0.5';   // zoomed out
  bgScaleSlider.max = '2.0';   // zoomed in
  bgScaleSlider.step = '0.01';
  bgScaleSlider.value = state.backgroundScale || '1.0';
  bgScaleSlider.style.cssText = 'width: 100%;';

  const bgScaleValue = document.createElement('span');
  bgScaleValue.textContent = (state.backgroundScale || 1.0).toFixed(2);
  bgScaleValue.style.cssText = 'margin-left: 8px; font-size: 11px; color: #aaa;';

  bgScaleSlider.addEventListener('input', (e) => {
    const scale = parseFloat(e.target.value);
    bgScaleValue.textContent = scale.toFixed(2);
    setBackgroundScale(scale);
    console.log(`🖼️ Background scale: ${scale.toFixed(2)}`);
  });

  bgScaleContainer.appendChild(bgScaleLabel);
  bgScaleContainer.appendChild(bgScaleSlider);
  bgScaleContainer.appendChild(bgScaleValue);

  // Phase 13.6.2: Skybox Mode toggle
  const skyboxToggle = document.createElement('input');
  skyboxToggle.type = 'checkbox';
  skyboxToggle.id = 'useSkybox';
  skyboxToggle.checked = state.useSkybox || false;
  skyboxToggle.onchange = () => {
    state.useSkybox = skyboxToggle.checked;
    setSkyboxMode(skyboxToggle.checked);

    // Apply current texture to selected face when enabling skybox
    console.log(`🔍 Skybox toggle: checked=${skyboxToggle.checked}, state.texture=`, state.texture);
    if (skyboxToggle.checked && state.texture) {
      const faceIndex = parseInt(skyboxFaceSelect.value);
      console.log(`🔍 Transferring texture to face ${faceIndex}`, state.texture);
      state.skyboxTextures[faceIndex] = state.texture;
      state.skyboxVideoElements[faceIndex] = state.videoElement;
      setSkyboxFaceTexture(faceIndex, state.texture);
      if (window.updateSkyboxFaceIndicators) window.updateSkyboxFaceIndicators();
      console.log(`📦 Transferred background texture to skybox face ${faceIndex}`);
    } else if (skyboxToggle.checked && !state.texture) {
      console.warn(`⚠️ Skybox enabled but no texture in state.texture`);
    }

    console.log(`📦 Skybox mode: ${state.useSkybox ? 'ON' : 'OFF'}`);
  };

  const skyboxLabel = document.createElement('label');
  skyboxLabel.htmlFor = 'useSkybox';
  skyboxLabel.innerText = 'Use Skybox Mode (6-panel cube)';
  skyboxLabel.style.cssText = 'display: block; margin: 10px 0; cursor: pointer;';
  skyboxLabel.prepend(skyboxToggle);

  // Phase 13.6.2: Skybox Face Selector
  const skyboxFaceContainer = document.createElement('div');
  skyboxFaceContainer.style.cssText = 'margin: 10px 0;';

  const skyboxFaceLabel = document.createElement('label');
  skyboxFaceLabel.textContent = 'Skybox Face:';
  skyboxFaceLabel.style.cssText = 'display: block; margin-bottom: 4px; font-size: 12px;';

  const skyboxFaceSelect = document.createElement('select');
  skyboxFaceSelect.style.cssText = 'width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #666; border-radius: 4px;';
  skyboxFaceSelect.innerHTML = `
    <option value="0">Right (Positive X)</option>
    <option value="1">Left (Negative X)</option>
    <option value="2">Top (Positive Y)</option>
    <option value="3">Bottom (Negative Y)</option>
    <option value="4" selected>Front (Positive Z)</option>
    <option value="5">Back (Negative Z)</option>
  `;

  skyboxFaceSelect.addEventListener('change', () => {
    state.skyboxFaceIndex = parseInt(skyboxFaceSelect.value);

    // Load existing texture for this face if available
    if (state.useSkybox && state.skyboxTextures[state.skyboxFaceIndex]) {
      state.texture = state.skyboxTextures[state.skyboxFaceIndex];
      state.videoElement = state.skyboxVideoElements[state.skyboxFaceIndex];
    }

    console.log(`📦 Skybox face selected: ${skyboxFaceSelect.options[skyboxFaceSelect.selectedIndex].text}`);
  });

  skyboxFaceContainer.appendChild(skyboxFaceLabel);
  skyboxFaceContainer.appendChild(skyboxFaceSelect);

  // Phase 13.6.2: Face status indicator
  const faceStatusDiv = document.createElement('div');
  faceStatusDiv.style.cssText = 'margin: 10px 0; padding: 8px; background: #222; border-radius: 4px; font-size: 11px;';
  faceStatusDiv.innerHTML = '<div style="margin-bottom: 4px; font-weight: bold;">Loaded Faces:</div>';

  const faceNames = ['Right', 'Left', 'Top', 'Bottom', 'Front', 'Back'];
  const faceIndicators = faceNames.map((name, index) => {
    const indicator = document.createElement('span');
    indicator.style.cssText = 'display: inline-block; margin: 2px 4px; padding: 2px 6px; border-radius: 3px; background: #444; color: #888;';
    indicator.textContent = name;
    indicator.dataset.faceIndex = index;
    faceStatusDiv.appendChild(indicator);
    return indicator;
  });

  // Update indicators when textures are loaded
  const updateFaceIndicators = () => {
    faceIndicators.forEach((indicator, index) => {
      if (state.skyboxTextures[index]) {
        indicator.style.background = '#0a0';
        indicator.style.color = '#fff';
      } else {
        indicator.style.background = '#444';
        indicator.style.color = '#888';
      }
    });
  };

  // Initial update
  updateFaceIndicators();

  // Store update function for upload handler
  window.updateSkyboxFaceIndicators = updateFaceIndicators;

  container.appendChild(uploadButton);
  container.appendChild(uploadInput);
  container.appendChild(folderUploadButton);
  container.appendChild(folderUploadInput);
  container.appendChild(morphUploadButton);
  container.appendChild(morphUploadInput);
  container.appendChild(morphLabel);
  container.appendChild(bgLabel);
  container.appendChild(bgScaleContainer);
  container.appendChild(skyboxLabel);
  container.appendChild(skyboxFaceContainer);
  container.appendChild(faceStatusDiv);

  console.log("🖼️ Background HUD section created (with Skybox support + face indicators)");
}
