console.log("🎯 hudGeometry.js loaded");

import { setSkyboxMode, setWireframeMode, centerCameraAndMorph, resetCameraView, setPlatonicSolid, setRenderMode } from './geometry.js';
import { state } from './state.js';

/**
 * Phase 12.0: Geometry HUD section
 * Controls: Skybox Mode, Wireframe, Center Me button, Reset View button
 * Phase 13.5.1: Added Platonic Solid selector and Render Mode (Solid/Wireframe)
 */
export function createGeometryHudSection(container, sceneRefs = {}) {
  const section = document.createElement('div');
  section.className = 'hud-section geometry';

  // Title
  const title = document.createElement('h3');
  title.textContent = 'Geometry';
  section.appendChild(title);

  // Phase 13.5.1: Platonic Solid selector
  const solidLabel = document.createElement('label');
  solidLabel.textContent = 'Platonic Solid';
  solidLabel.style.display = 'block';
  solidLabel.style.marginBottom = '5px';
  solidLabel.style.marginTop = '8px';
  section.appendChild(solidLabel);

  const solidSelect = document.createElement('select');
  solidSelect.style.width = '100%';
  solidSelect.style.padding = '6px';
  solidSelect.style.marginBottom = '12px';

  const solidOptions = [
    { value: 'cube', label: 'Cube (Hexahedron)' },
    { value: 'tetrahedron', label: 'Tetrahedron' },
    { value: 'octahedron', label: 'Octahedron' },
    { value: 'dodecahedron', label: 'Dodecahedron' },
    { value: 'icosahedron', label: 'Icosahedron' }
  ];

  solidOptions.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    if (opt.value === (state.geometry?.platonicSolid || 'cube')) {
      option.selected = true;
    }
    solidSelect.appendChild(option);
  });

  solidSelect.addEventListener('change', () => {
    setPlatonicSolid(solidSelect.value);
  });

  section.appendChild(solidSelect);

  // Phase 13.5.1: Render Mode selector (Solid/Wireframe)
  const renderModeLabel = document.createElement('label');
  renderModeLabel.textContent = 'Render Mode';
  renderModeLabel.style.display = 'block';
  renderModeLabel.style.marginBottom = '5px';
  section.appendChild(renderModeLabel);

  const renderModeSelect = document.createElement('select');
  renderModeSelect.style.width = '100%';
  renderModeSelect.style.padding = '6px';
  renderModeSelect.style.marginBottom = '12px';

  const renderModes = [
    { value: 'solid', label: 'Solid' },
    { value: 'wireframe', label: 'Wireframe' },
    { value: 'both', label: 'Both (Solid + Wireframe)' }
  ];

  renderModes.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    if (opt.value === (state.geometry?.renderMode || 'solid')) {
      option.selected = true;
    }
    renderModeSelect.appendChild(option);
  });

  renderModeSelect.addEventListener('change', () => {
    setRenderMode(renderModeSelect.value);
  });

  section.appendChild(renderModeSelect);

  // Phase 13.5.2: Morph Input selector
  const morphInputLabel = document.createElement('label');
  morphInputLabel.textContent = 'Morph Input';
  morphInputLabel.style.display = 'block';
  morphInputLabel.style.marginBottom = '5px';
  section.appendChild(morphInputLabel);

  const morphInputSelect = document.createElement('select');
  morphInputSelect.style.width = '100%';
  morphInputSelect.style.padding = '6px';
  morphInputSelect.style.marginBottom = '12px';

  const morphInputOptions = [
    { value: 'audio', label: 'Audio' },
    { value: 'midi', label: 'MIDI' }
  ];

  morphInputOptions.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    if (opt.value === (state.geometry?.morphInput || 'audio')) {
      option.selected = true;
    }
    morphInputSelect.appendChild(option);
  });

  morphInputSelect.addEventListener('change', () => {
    state.geometry.morphInput = morphInputSelect.value;
    console.log(`🎯 Morph input changed to: ${morphInputSelect.value}`);
  });

  section.appendChild(morphInputSelect);

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

  // Zoom slider (camera distance control)
  const zoomControl = document.createElement('div');
  zoomControl.style.marginTop = '12px';

  const zoomLabel = document.createElement('label');
  zoomLabel.textContent = 'Camera Zoom';
  zoomLabel.style.display = 'block';
  zoomLabel.style.marginBottom = '5px';
  zoomControl.appendChild(zoomLabel);

  const zoomSlider = document.createElement('input');
  zoomSlider.type = 'range';
  zoomSlider.min = '1';
  zoomSlider.max = '15';
  zoomSlider.step = '0.1';
  zoomSlider.value = '5'; // Default camera position
  zoomSlider.style.width = '100%';

  const zoomValue = document.createElement('span');
  zoomValue.textContent = '5.0';
  zoomValue.style.marginLeft = '10px';

  zoomSlider.addEventListener('input', (e) => {
    const zoomDist = parseFloat(e.target.value);
    zoomValue.textContent = zoomDist.toFixed(1);

    // Update camera position
    import('./geometry.js').then(({ camera }) => {
      camera.position.set(0, 0, zoomDist);
      camera.lookAt(0, 0, 0);
      if (sceneRefs?.controls && typeof sceneRefs.controls.update === 'function') {
        sceneRefs.controls.update();
      }
    });
  });

  zoomControl.appendChild(zoomSlider);
  zoomControl.appendChild(zoomValue);
  section.appendChild(zoomControl);

  // X-axis slider (camera horizontal position)
  const xControl = document.createElement('div');
  xControl.style.marginTop = '12px';

  const xLabel = document.createElement('label');
  xLabel.textContent = 'Camera X-Axis';
  xLabel.style.display = 'block';
  xLabel.style.marginBottom = '5px';
  xControl.appendChild(xLabel);

  const xSlider = document.createElement('input');
  xSlider.type = 'range';
  xSlider.min = '-10';
  xSlider.max = '10';
  xSlider.step = '0.1';
  xSlider.value = '0'; // Default camera position
  xSlider.style.width = '100%';

  const xValue = document.createElement('span');
  xValue.textContent = '0.0';
  xValue.style.marginLeft = '10px';

  xSlider.addEventListener('input', (e) => {
    const xPos = parseFloat(e.target.value);
    xValue.textContent = xPos.toFixed(1);

    // Update camera position
    import('./geometry.js').then(({ camera }) => {
      camera.position.x = xPos;
      camera.lookAt(0, 0, 0);
      if (sceneRefs?.controls && typeof sceneRefs.controls.update === 'function') {
        sceneRefs.controls.update();
      }
    });
  });

  xControl.appendChild(xSlider);
  xControl.appendChild(xValue);
  section.appendChild(xControl);

  // Y-axis slider (camera vertical position)
  const yControl = document.createElement('div');
  yControl.style.marginTop = '12px';

  const yLabel = document.createElement('label');
  yLabel.textContent = 'Camera Y-Axis';
  yLabel.style.display = 'block';
  yLabel.style.marginBottom = '5px';
  yControl.appendChild(yLabel);

  const ySlider = document.createElement('input');
  ySlider.type = 'range';
  ySlider.min = '-10';
  ySlider.max = '10';
  ySlider.step = '0.1';
  ySlider.value = '0'; // Default camera position
  ySlider.style.width = '100%';

  const yValue = document.createElement('span');
  yValue.textContent = '0.0';
  yValue.style.marginLeft = '10px';

  ySlider.addEventListener('input', (e) => {
    const yPos = parseFloat(e.target.value);
    yValue.textContent = yPos.toFixed(1);

    // Update camera position
    import('./geometry.js').then(({ camera }) => {
      camera.position.y = yPos;
      camera.lookAt(0, 0, 0);
      if (sceneRefs?.controls && typeof sceneRefs.controls.update === 'function') {
        sceneRefs.controls.update();
      }
    });
  });

  yControl.appendChild(ySlider);
  yControl.appendChild(yValue);
  section.appendChild(yControl);

  // Phase 13.7: Camera X rotation (pitch) slider
  const rotXControl = document.createElement('div');
  rotXControl.style.marginTop = '12px';

  const rotXLabel = document.createElement('label');
  rotXLabel.textContent = 'Camera X Rotation (Pitch)';
  rotXLabel.style.display = 'block';
  rotXLabel.style.marginBottom = '5px';
  rotXControl.appendChild(rotXLabel);

  const rotXSlider = document.createElement('input');
  rotXSlider.type = 'range';
  rotXSlider.min = '0';
  rotXSlider.max = String(Math.PI * 2); // Full 360° in radians
  rotXSlider.step = '0.01';
  rotXSlider.value = '0';
  rotXSlider.style.width = '100%';

  const rotXValue = document.createElement('span');
  rotXValue.textContent = '0°';
  rotXValue.style.marginLeft = '10px';

  rotXSlider.addEventListener('input', (e) => {
    const rotRad = parseFloat(e.target.value);
    const rotDeg = (rotRad * 180 / Math.PI).toFixed(0);
    rotXValue.textContent = `${rotDeg}°`;

    // Update camera rotation
    import('./geometry.js').then(({ camera }) => {
      camera.rotation.x = rotRad;
      if (sceneRefs?.controls && typeof sceneRefs.controls.update === 'function') {
        sceneRefs.controls.update();
      }
    });
  });

  rotXControl.appendChild(rotXSlider);
  rotXControl.appendChild(rotXValue);
  section.appendChild(rotXControl);

  // Phase 13.7: Camera Y rotation (yaw) slider
  const rotYControl = document.createElement('div');
  rotYControl.style.marginTop = '12px';

  const rotYLabel = document.createElement('label');
  rotYLabel.textContent = 'Camera Y Rotation (Yaw)';
  rotYLabel.style.display = 'block';
  rotYLabel.style.marginBottom = '5px';
  rotYControl.appendChild(rotYLabel);

  const rotYSlider = document.createElement('input');
  rotYSlider.type = 'range';
  rotYSlider.min = '0';
  rotYSlider.max = String(Math.PI * 2); // Full 360° in radians
  rotYSlider.step = '0.01';
  rotYSlider.value = '0';
  rotYSlider.style.width = '100%';

  const rotYValue = document.createElement('span');
  rotYValue.textContent = '0°';
  rotYValue.style.marginLeft = '10px';

  rotYSlider.addEventListener('input', (e) => {
    const rotRad = parseFloat(e.target.value);
    const rotDeg = (rotRad * 180 / Math.PI).toFixed(0);
    rotYValue.textContent = `${rotDeg}°`;

    // Update camera rotation
    import('./geometry.js').then(({ camera }) => {
      camera.rotation.y = rotRad;
      if (sceneRefs?.controls && typeof sceneRefs.controls.update === 'function') {
        sceneRefs.controls.update();
      }
    });
  });

  rotYControl.appendChild(rotYSlider);
  rotYControl.appendChild(rotYValue);
  section.appendChild(rotYControl);

  // Phase 13.7: Camera 360° orbit around center slider
  const orbitControl = document.createElement('div');
  orbitControl.style.marginTop = '12px';

  const orbitLabel = document.createElement('label');
  orbitLabel.textContent = 'Camera Orbit Around Center';
  orbitLabel.style.display = 'block';
  orbitLabel.style.marginBottom = '5px';
  orbitControl.appendChild(orbitLabel);

  const orbitSlider = document.createElement('input');
  orbitSlider.type = 'range';
  orbitSlider.min = '0';
  orbitSlider.max = String(Math.PI * 2); // Full 360° in radians
  orbitSlider.step = '0.01';
  orbitSlider.value = '0';
  orbitSlider.style.width = '100%';

  const orbitValue = document.createElement('span');
  orbitValue.textContent = '0°';
  orbitValue.style.marginLeft = '10px';

  orbitSlider.addEventListener('input', (e) => {
    const angle = parseFloat(e.target.value);
    const angleDeg = (angle * 180 / Math.PI).toFixed(0);
    orbitValue.textContent = `${angleDeg}°`;

    // Update camera position in orbit around center (0,0,0)
    import('./geometry.js').then(({ camera }) => {
      // Get current radius (distance from center)
      const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
      const currentY = camera.position.y;

      // Calculate new position on orbit
      camera.position.x = Math.sin(angle) * radius;
      camera.position.z = Math.cos(angle) * radius;
      camera.position.y = currentY; // Keep Y position constant

      // Always look at center
      camera.lookAt(0, 0, 0);

      if (sceneRefs?.controls && typeof sceneRefs.controls.update === 'function') {
        sceneRefs.controls.update();
      }
    });
  });

  orbitControl.appendChild(orbitSlider);
  orbitControl.appendChild(orbitValue);
  section.appendChild(orbitControl);

  // Phase 13.7: Camera vertical orbit (latitude/elevation) slider
  const verticalOrbitControl = document.createElement('div');
  verticalOrbitControl.style.marginTop = '12px';

  const verticalOrbitLabel = document.createElement('label');
  verticalOrbitLabel.textContent = 'Camera Vertical Orbit (Latitude)';
  verticalOrbitLabel.style.display = 'block';
  verticalOrbitLabel.style.marginBottom = '5px';
  verticalOrbitControl.appendChild(verticalOrbitLabel);

  const verticalOrbitSlider = document.createElement('input');
  verticalOrbitSlider.type = 'range';
  verticalOrbitSlider.min = String(-Math.PI / 2); // -90° (bottom)
  verticalOrbitSlider.max = String(Math.PI / 2);  // +90° (top)
  verticalOrbitSlider.step = '0.01';
  verticalOrbitSlider.value = '0';
  verticalOrbitSlider.style.width = '100%';

  const verticalOrbitValue = document.createElement('span');
  verticalOrbitValue.textContent = '0°';
  verticalOrbitValue.style.marginLeft = '10px';

  verticalOrbitSlider.addEventListener('input', (e) => {
    const elevation = parseFloat(e.target.value);
    const elevationDeg = (elevation * 180 / Math.PI).toFixed(0);
    verticalOrbitValue.textContent = `${elevationDeg}°`;

    // Update camera position with vertical orbit
    import('./geometry.js').then(({ camera }) => {
      // Get current horizontal angle from X and Z position
      const horizontalAngle = Math.atan2(camera.position.x, camera.position.z);

      // Get current radius in XZ plane
      const radiusXZ = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);

      // Calculate total radius (distance from center)
      const totalRadius = Math.sqrt(radiusXZ ** 2 + camera.position.y ** 2);

      // Calculate new position based on elevation angle
      const newRadiusXZ = totalRadius * Math.cos(elevation);
      const newY = totalRadius * Math.sin(elevation);

      // Apply horizontal angle to get X and Z
      camera.position.x = Math.sin(horizontalAngle) * newRadiusXZ;
      camera.position.z = Math.cos(horizontalAngle) * newRadiusXZ;
      camera.position.y = newY;

      // Always look at center
      camera.lookAt(0, 0, 0);

      if (sceneRefs?.controls && typeof sceneRefs.controls.update === 'function') {
        sceneRefs.controls.update();
      }
    });
  });

  verticalOrbitControl.appendChild(verticalOrbitSlider);
  verticalOrbitControl.appendChild(verticalOrbitValue);
  section.appendChild(verticalOrbitControl);

  // Phase 13.7: Auto Orbit animation
  let autoOrbitActive = false;
  let autoOrbitStartTime = 0;
  let autoOrbitAnimationFrame = null;

  function autoOrbitAnimation() {
    if (!autoOrbitActive) return;

    const elapsed = (performance.now() - autoOrbitStartTime) / 1000; // seconds

    // Animation parameters
    const orbitSpeed = 0.05; // radians per second (very slow)
    const verticalOrbitSpeed = 0.02; // radians per second (even slower)

    // Calculate full orbit duration (one complete 360° rotation)
    const orbitDuration = (Math.PI * 2) / orbitSpeed; // ~125.7 seconds for full orbit

    // Calculate zoom (1 to 15 spread across the entire orbit duration)
    const zoomProgress = elapsed / orbitDuration;
    const zoom = Math.min(1 + zoomProgress * 14, 15);

    // Calculate horizontal orbit angle (continuous rotation)
    const horizontalAngle = (elapsed * orbitSpeed) % (Math.PI * 2);

    // Calculate vertical orbit angle (sine wave between -π/4 and π/4 for smooth motion)
    const verticalAngle = Math.sin(elapsed * verticalOrbitSpeed) * (Math.PI / 4);

    // Update camera position
    import('./geometry.js').then(({ camera }) => {
      // Calculate position using spherical coordinates
      const radiusXZ = zoom * Math.cos(verticalAngle);
      camera.position.x = Math.sin(horizontalAngle) * radiusXZ;
      camera.position.z = Math.cos(horizontalAngle) * radiusXZ;
      camera.position.y = zoom * Math.sin(verticalAngle);

      // Always look at center
      camera.lookAt(0, 0, 0);

      // Update slider values
      zoomSlider.value = zoom;
      zoomValue.textContent = zoom.toFixed(1);
      orbitSlider.value = horizontalAngle;
      orbitValue.textContent = `${(horizontalAngle * 180 / Math.PI).toFixed(0)}°`;
      verticalOrbitSlider.value = verticalAngle;
      verticalOrbitValue.textContent = `${(verticalAngle * 180 / Math.PI).toFixed(0)}°`;
    });

    autoOrbitAnimationFrame = requestAnimationFrame(autoOrbitAnimation);
  }

  function startAutoOrbit() {
    if (autoOrbitActive) return;

    autoOrbitActive = true;
    autoOrbitStartTime = performance.now();

    // Reset camera to center position (zoom = 1)
    import('./geometry.js').then(({ camera }) => {
      camera.position.set(0, 0, 1);
      camera.lookAt(0, 0, 0);
    });

    autoOrbitAnimation();
    autoOrbitButton.textContent = 'Stop Auto Orbit';
    autoOrbitButton.style.background = '#c44';
    console.log('🎬 Auto orbit started');
  }

  function stopAutoOrbit() {
    if (!autoOrbitActive) return;

    autoOrbitActive = false;
    if (autoOrbitAnimationFrame) {
      cancelAnimationFrame(autoOrbitAnimationFrame);
      autoOrbitAnimationFrame = null;
    }

    autoOrbitButton.textContent = 'Auto Orbit';
    autoOrbitButton.style.background = '#444';
    console.log('🛑 Auto orbit stopped');
  }

  // Auto Orbit button
  const autoOrbitButton = document.createElement('button');
  autoOrbitButton.textContent = 'Auto Orbit';
  autoOrbitButton.style.cssText = 'padding: 8px 12px; margin-top: 12px; width: 100%; cursor: pointer; background: #444; color: white; border: 1px solid #666; border-radius: 4px;';
  autoOrbitButton.addEventListener('click', () => {
    if (autoOrbitActive) {
      stopAutoOrbit();
    } else {
      startAutoOrbit();
    }
  });
  section.appendChild(autoOrbitButton);

  // Center Me button (zoom in to view from inside cube)
  const centerButton = document.createElement('button');
  centerButton.textContent = 'Center Me';
  centerButton.style.padding = '8px 12px';
  centerButton.style.marginTop = '8px';
  centerButton.style.cursor = 'pointer';
  centerButton.addEventListener('click', () => {
    // Pass controls from sceneRefs if available
    centerCameraAndMorph(sceneRefs.controls);
    // Update sliders to match new camera position
    import('./geometry.js').then(({ camera }) => {
      xSlider.value = camera.position.x;
      xValue.textContent = camera.position.x.toFixed(1);
      ySlider.value = camera.position.y;
      yValue.textContent = camera.position.y.toFixed(1);
      zoomSlider.value = camera.position.z;
      zoomValue.textContent = camera.position.z.toFixed(1);
    });
  });
  section.appendChild(centerButton);

  // Reset View button (return to initialization view)
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset View';
  resetButton.style.padding = '8px 12px';
  resetButton.style.marginTop = '8px';
  resetButton.style.marginLeft = '8px';
  resetButton.style.cursor = 'pointer';
  resetButton.addEventListener('click', () => {
    // Pass controls from sceneRefs if available
    resetCameraView(sceneRefs.controls);
    // Update sliders to match reset position
    xSlider.value = 0;
    xValue.textContent = '0.0';
    ySlider.value = 0;
    yValue.textContent = '0.0';
    zoomSlider.value = 5;
    zoomValue.textContent = '5.0';
    // Reset rotation sliders
    rotXSlider.value = 0;
    rotXValue.textContent = '0°';
    rotYSlider.value = 0;
    rotYValue.textContent = '0°';
    // Reset orbit sliders
    orbitSlider.value = 0;
    orbitValue.textContent = '0°';
    verticalOrbitSlider.value = 0;
    verticalOrbitValue.textContent = '0°';
    // Reset camera rotation
    import('./geometry.js').then(({ camera }) => {
      camera.rotation.x = 0;
      camera.rotation.y = 0;
    });
  });
  section.appendChild(resetButton);

  container.appendChild(section);
  console.log("🎯 Geometry HUD section created");
}

console.log("🎯 hudGeometry.js ready");

// Phase 13.4.2: Removed registerHUDCallback to fix circular dependency
