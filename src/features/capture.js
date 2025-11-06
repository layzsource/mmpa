// Phase 13.11: Screenshot / Posterize Capture System
// Extracted from main.js lines 23-53

console.log("📸 capture.js loaded");

/**
 * Get the Three.js canvas element
 * @returns {HTMLCanvasElement} Canvas element
 */
function getCanvas() {
  // prefer Three's canvas
  const c = document.querySelector("canvas");
  if (!c) throw new Error("No canvas found");
  return c;
}

/**
 * Save screenshot as PNG
 */
function png() {
  try {
    const c = getCanvas();
    const url = c.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `capture_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    console.log("📸 Screenshot saved (PNG)");
  } catch (e) {
    console.error("Capture.png error", e);
  }
}

/**
 * Save screenshot as JPEG
 * @param {number} quality - JPEG quality (0-1)
 */
function jpeg(quality = 0.92) {
  try {
    const c = getCanvas();
    const url = c.toDataURL("image/jpeg", quality);
    const a = document.createElement("a");
    a.href = url;
    a.download = `capture_${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    console.log("📸 Screenshot saved (JPEG)");
  } catch (e) {
    console.error("Capture.jpeg error", e);
  }
}

/**
 * Initialize capture system and expose global API
 */
export function initCapture() {
  window.Capture = { png, jpeg };
  console.log("✅ Capture system initialized");
}
