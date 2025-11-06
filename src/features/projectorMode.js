// Phase 13.13: Projector Mode / Presentation Mode System
// Extracted from main.js lines 680-819

console.log("🖥️ projectorMode.js loaded");

/**
 * Enter fullscreen mode
 */
async function goFullscreen() {
  try {
    const el = document.documentElement;
    if (!document.fullscreenElement && el.requestFullscreen) {
      await el.requestFullscreen({ navigationUI: 'hide' }).catch(()=>{});
    }
  } catch {}
}

/**
 * Exit fullscreen mode
 */
async function exitFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen().catch(()=>{});
  } catch {}
}

/**
 * Bump render scale for better quality in presentation mode
 * @param {boolean} enable - Whether to enable or disable high quality
 */
function bumpRenderScale(enable) {
  try {
    const r = window.renderer;
    if (r?.setPixelRatio) {
      if (enable) {
        const target = Math.min(2, (window.devicePixelRatio || 1) * 1.15);
        r.setPixelRatio(target);
      } else {
        r.setPixelRatio(window.devicePixelRatio || 1);
      }
      r.setSize(window.innerWidth, window.innerHeight, false);
    }
  } catch {}
}

/**
 * Create and style the projector mode toggle button
 * @returns {HTMLButtonElement} The created button element
 */
function createProjectorButton() {
  const btn = document.createElement('button');
  btn.id = '__projector_btn__';
  btn.textContent = '🖥️ Projector Mode';
  btn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 16px;
    background: rgba(0,0,0,0.8);
    color: #fff;
    border: 1px solid #555;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-family: system-ui, -apple-system, sans-serif;
    z-index: 9999;
    transition: background 0.2s;
  `;
  btn.addEventListener('mouseenter', () => {
    btn.style.background = 'rgba(40,40,40,0.9)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'rgba(0,0,0,0.8)';
  });
  btn.addEventListener('click', () => {
    window.ProjectorMode.toggle();
  });
  document.body.appendChild(btn);
  return btn;
}

/**
 * Update button text based on current state
 */
function updateButton() {
  const btn = document.getElementById('__projector_btn__');
  if (!btn) return;
  btn.textContent = window.ProjectorMode.enabled ? '✖️ Exit Projector' : '🖥️ Projector Mode';
}

/**
 * Initialize projector mode system and expose global API
 */
export function initProjectorMode() {
  // 1) CSS: hide HUD + cursor when projector mode is active
  const css = `
    html.projector-mode, body.projector-mode { cursor: none !important; }
    /* Hide common HUD roots (we don't assume exact id/class) */
    .projector-mode [data-hud-root],
    .projector-mode #hud,
    .projector-mode .hud-root { display: none !important; }
    /* Optional: keep canvas clean edge-to-edge */
    .projector-mode body { background: #000 !important; }
  `;
  const style = document.createElement('style');
  style.id = 'projector-mode-style';
  style.textContent = css;
  document.head.appendChild(style);

  // Expose ProjectorMode API
  window.ProjectorMode = window.ProjectorMode || {
    enabled: false,
    hudVisible: true, // Track HUD visibility separately from projector mode
    async enable() {
      if (this.enabled) return;
      document.documentElement.classList.add('projector-mode');
      document.body.classList.add('projector-mode');
      await goFullscreen();
      bumpRenderScale(true);
      this.enabled = true;
      this.hudVisible = false; // HUD hidden by default in projector mode
      console.log('🖥️ Projector Mode: ON');
      updateButton();
    },
    async disable() {
      if (!this.enabled) return;
      document.documentElement.classList.remove('projector-mode');
      document.body.classList.remove('projector-mode');
      bumpRenderScale(false);
      await exitFullscreen();
      this.enabled = false;
      this.hudVisible = true; // HUD visible when not in projector mode
      console.log('🖥️ Projector Mode: OFF');
      updateButton();
    },
    async toggle() {
      return this.enabled ? this.disable() : this.enable();
    },
    // Aliases for backwards compatibility with hotkeys.js
    async on() {
      return this.enable();
    },
    async off() {
      return this.disable();
    },
    // Toggle HUD visibility without exiting projector mode
    toggleHUD() {
      if (!this.enabled) {
        console.warn('⚠️ ProjectorMode.toggleHUD() called but projector mode is not enabled');
        return;
      }
      this.hudVisible = !this.hudVisible;

      // Toggle the projector-mode class to show/hide HUD
      if (this.hudVisible) {
        // Remove class to show HUD
        document.documentElement.classList.remove('projector-mode');
        document.body.classList.remove('projector-mode');
        console.log('🖥️ Projector Mode: HUD visible');
      } else {
        // Add class to hide HUD
        document.documentElement.classList.add('projector-mode');
        document.body.classList.add('projector-mode');
        console.log('🖥️ Projector Mode: HUD hidden');
      }
    }
  };

  // Create button after DOM loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createProjectorButton);
  } else {
    createProjectorButton();
  }

  // Hotkeys: Shift+P toggles; Esc exits
  window.addEventListener('keydown', async (e) => {
    // Esc exits PM even if focus is on inputs
    if (e.key === 'Escape' && window.ProjectorMode.enabled) {
      e.preventDefault();
      return window.ProjectorMode.disable();
    }
    // Shift+P toggle, avoid stealing common shortcuts otherwise
    if ((e.key === 'P' || e.key === 'p') && e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      return window.ProjectorMode.toggle();
    }
  });

  // Safety: if fullscreen lost (e.g., user hits Esc), turn mode off
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && window.ProjectorMode.enabled) {
      window.ProjectorMode.disable();
    }
  });

  console.log("✅ Projector Mode system initialized");
}
