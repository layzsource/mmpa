# Koch Snowflake Integration Steps

## Files Created:
- ✅ `/src/backgrounds/kochSnowflake.js` - Core Koch snowflake implementation

## Integration Points Needed in visual.js:

### 1. Add to initialization (in initBackground or similar function):
```javascript
// Initialize Koch Snowflake background
if (scene && camera) {
  kochSnowflakeBackground = new KochSnowflakeBackground(scene, camera);
  kochSnowflakeBackground.mesh.visible = false; // Hidden by default
  console.log('❄️ Koch Snowflake background initialized');
}
```

### 2. Add to render/update loop (in animate or updateVisuals function):
```javascript
// Update Koch Snowflake if active
if (kochSnowflakeBackground && state.backgroundType === 'koch') {
  kochSnowflakeBackground.update();
}
```

### 3. Add export functions (at bottom of visual.js):
```javascript
// Koch Snowflake controls
export function setKochSnowflakeMode(enabled) {
  if (!kochSnowflakeBackground) return;

  state.backgroundType = enabled ? 'koch' : 'solid';

  // Hide other backgrounds
  if (backgroundMesh) backgroundMesh.visible = !enabled;
  if (skyboxMesh) skyboxMesh.visible = false;

  kochSnowflakeBackground.mesh.visible = enabled;

  console.log(`❄️ Koch Snowflake: ${enabled ? 'ON' : 'OFF'}`);
}

export function setKochColorMode(mode) {
  if (!kochSnowflakeBackground) return;
  kochSnowflakeBackground.setColorMode(mode); // 'static', 'audio', 'theory'
}

export function kochZoom(factor) {
  if (!kochSnowflakeBackground) return;
  kochSnowflakeBackground.zoom(factor);
}

export function kochReset() {
  if (!kochSnowflakeBackground) return;
  kochSnowflakeBackground.reset();
}
```

### 4. Add to state.js:
```javascript
backgroundType: 'solid', // 'solid', 'skybox', 'koch'
```

### 5. Add UI controls to hudBackground.js:
```javascript
// Koch Snowflake toggle
const kochToggle = document.createElement("input");
kochToggle.type = "checkbox";
kochToggle.checked = state.backgroundType === 'koch';
kochToggle.onchange = () => {
  setKochSnowflakeMode(kochToggle.checked);
  if (kochToggle.checked) {
    skyboxToggle.checked = false;
  }
};

const kochLabel = document.createElement("label");
kochLabel.textContent = " Koch Snowflake";
kochLabel.style.cssText = 'font-size: 14px; color: white;';
kochLabel.prepend(kochToggle);

// Koch color mode selector
const kochColorSelect = document.createElement("select");
kochColorSelect.style.cssText = 'margin: 10px 0; padding: 6px; background: #333; color: white; border: 1px solid #666; border-radius: 4px;';
['static', 'audio', 'theory'].forEach(mode => {
  const option = document.createElement("option");
  option.value = mode;
  option.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
  kochColorSelect.appendChild(option);
});
kochColorSelect.onchange = () => setKochColorMode(kochColorSelect.value);

// Zoom buttons
const kochZoomIn = document.createElement("button");
kochZoomIn.textContent = "Zoom In";
kochZoomIn.onclick = () => kochZoom(1.2);

const kochZoomOut = document.createElement("button");
kochZoomOut.textContent = "Zoom Out";
kochZoomOut.onclick = () => kochZoom(0.8);

const kochResetBtn = document.createElement("button");
kochResetBtn.textContent = "Reset Koch";
kochResetBtn.onclick = () => kochReset();
```

## Quick Test:
1. Build and run the app
2. Open HUD → Background section
3. Toggle "Koch Snowflake" checkbox
4. Should see fractal background with infinite zoom capability
5. Change color modes to test audio reactivity
