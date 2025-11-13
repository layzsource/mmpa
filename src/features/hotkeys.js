// Phase 13.11: One-Key Hotkeys System
// Extracted from main.js lines 56-88

console.log("⌨️ hotkeys.js loaded");

/**
 * Keyboard event handler
 * @param {KeyboardEvent} e - Keyboard event
 */
function handler(e) {
  // Ignore when typing in inputs/textareas
  const tag = (e.target && e.target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea" || e.isComposing) return;

  if (e.key === "p" || e.key === "P") {
    // P → toggle Projector HUD (first press also ensures projector ON)
    if (!document.fullscreenElement) window.ProjectorMode?.on();
    else window.ProjectorMode?.toggleHUD();
  }
  if (e.key === "f" || e.key === "F") {
    // F → full projector on/off
    if (!document.fullscreenElement) window.ProjectorMode?.on();
    else window.ProjectorMode?.off();
  }
  if (e.key === "s" || e.key === "S") {
    // S → screenshot PNG
    window.Capture?.png();
  }
  if (e.key === "u" || e.key === "U") {
    // U → toggle Cylindrical Unwrap panel
    window.cylindricalUnwrapPanel?.toggle();
  }
  if (e.key === "l" || e.key === "L") {
    // L → toggle Living Symbol mode (cycles through STANDARD → ANALYSIS → LIVING_SYMBOL)
    window.chronelixModeManager?.toggleMode();
    const mode = window.chronelixModeManager?.getMode();
    console.log(`🌸 Chronelix mode: ${mode}`);
  }
  if (e.key === "m" || e.key === "M") {
    // M → toggle Material Physics panel
    window.materialPhysicsPanel?.toggle();
  }
}

/**
 * Install hotkeys (removes existing handler first to prevent duplicates)
 */
function install() {
  window.removeEventListener("keydown", handler, true);
  window.addEventListener("keydown", handler, true);
  console.log("⌨️ Hotkeys installed (P=presentation HUD, F=fullscreen toggle, S=screenshot, U=unwrap panel, L=Living Symbol, M=Material Physics)");
}

/**
 * Initialize hotkeys system and expose global API
 */
export function initHotkeys() {
  // Expose global API
  window.Hotkeys = { install };

  // Auto-install once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => install(), { once: true });
  } else {
    install();
  }

  console.log("✅ Hotkeys system initialized");
}
