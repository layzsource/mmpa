// Phase 13.9: Input Manager Module
// Centralized keyboard and mouse event handling

import { state } from '../state.js';

console.log("⌨️ inputManager.js loaded");

// Mouse tracking state
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

/**
 * Initialize input handlers
 * @param {Object} deps - Dependencies for input handling
 * @param {Object} deps.renderer - Three.js renderer
 * @param {Object} deps.gameMode - Game mode instance (optional)
 */
export function initInputManager(deps = {}) {
  const { renderer, gameMode } = deps;

  console.log("⌨️ Initializing Input Manager...");

  // Phase 11.7.18: Mouse interaction for emoji swirl forces
  setupMouseInteraction();

  // Stage 2: Canvas click listener for firing projectiles
  if (renderer?.domElement && gameMode) {
    setupGameModeClickHandler(renderer.domElement, gameMode);
  }

  // Phase 13.9: Morph target toggle (P key)
  setupMorphToggleHandler();

  console.log("✅ Input Manager initialized");
}

/**
 * Set up mouse interaction for emoji swirl forces
 */
function setupMouseInteraction() {
  window.addEventListener('mousedown', () => { isMouseDown = true; });
  window.addEventListener('mouseup', () => { isMouseDown = false; });
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Apply swirl force to all active emoji streams
    if (isMouseDown && state.emojiPhysics?.mouseInteraction) {
      if (window.emojiStreamManager) {
        window.emojiStreamManager.streams.forEach((stream, emoji) => {
          if (stream.enabled) {
            stream.applySwirlForce(mouseX, mouseY);
          }
        });
      }
      // Also apply to single emoji particles if active
      if (window.emojiParticles) {
        window.emojiParticles.applySwirlForce(mouseX, mouseY);
      }
    }
  });

  console.log("🖱️ Mouse interaction handlers installed (emoji swirl forces)");
}

/**
 * Set up game mode click handler
 */
function setupGameModeClickHandler(canvas, gameMode) {
  canvas.addEventListener('click', (e) => {
    console.log("🖱️ Click detected on canvas", { enabled: gameMode?.enabled, gameMode: !!gameMode });
    if (gameMode && gameMode.enabled) {
      console.log("🎮 Attempting to fire projectile...");
      gameMode.fireProjectile();
    } else {
      console.log("🎮 Game mode not enabled or not initialized");
    }
  });

  console.log("🎮 Game mode click handler installed");
}

/**
 * Set up morph target toggle handler (P key)
 */
function setupMorphToggleHandler() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
      // Toggle to next morph target
      const targets = state.morphState.targets;
      const currentIndex = targets.indexOf(state.morphState.current);
      const nextIndex = (currentIndex + 1) % targets.length;
      const newTarget = targets[nextIndex];

      // Update state
      state.morphState.previous = state.morphState.current;
      state.morphState.current = newTarget;

      // Reset all weights and set new target to 1.0
      targets.forEach(target => {
        state.morphWeights[target] = 0;
      });
      state.morphWeights[newTarget] = 1.0;

      console.log(`🔄 Toggled to morph target: ${newTarget}`);
    }
  });

  console.log("⌨️ Morph toggle handler installed (P key)");
}

/**
 * Get current mouse position
 * @returns {{x: number, y: number, isDown: boolean}}
 */
export function getMouseState() {
  return {
    x: mouseX,
    y: mouseY,
    isDown: isMouseDown
  };
}
