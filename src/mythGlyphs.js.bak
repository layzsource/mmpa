// src/mythGlyphs.js
// Glyph Renderer - Symbolic overlay visualization for myths
// Renders Unicode glyphs, emojis, and custom symbols over geometry

import * as THREE from 'three';

console.log("🌟 mythGlyphs.js loaded");

/**
 * GlyphRenderer - Renders symbolic glyphs as overlays
 */
export class GlyphRenderer {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    // Glyph group
    this.glyphGroup = new THREE.Group();
    this.glyphGroup.name = 'MythGlyphs';
    this.scene.add(this.glyphGroup);

    // Active glyphs
    this.glyphs = new Map(); // glyphId -> glyph object

    // Canvas for text rendering
    this.textCanvas = document.createElement('canvas');
    this.textContext = this.textCanvas.getContext('2d');

    // Settings
    this.settings = {
      visible: true,
      defaultSize: 256,
      defaultColor: '#ffffff',
      defaultOpacity: 0.9,
      billboard: true, // Always face camera
      fadeIn: true,
      fadeInDuration: 1000
    };

    console.log("🌟 GlyphRenderer created");
  }

  /**
   * Create glyph sprite
   */
  createGlyph(config = {}) {
    const glyphId = config.id || `glyph_${Date.now()}_${Math.random()}`;

    // Glyph configuration
    const glyph = {
      id: glyphId,
      character: config.character || '○',
      position: config.position || new THREE.Vector3(0, 0, 0),
      scale: config.scale || 1.0,
      color: config.color || this.settings.defaultColor,
      opacity: config.opacity !== undefined ? config.opacity : this.settings.defaultOpacity,
      fontSize: config.fontSize || 128,
      fontFamily: config.fontFamily || 'Arial, sans-serif',
      fontWeight: config.fontWeight || 'normal',
      billboard: config.billboard !== undefined ? config.billboard : this.settings.billboard,
      worldPosition: config.worldPosition !== undefined ? config.worldPosition : true
    };

    // Create texture from text
    const texture = this.createTextTexture(glyph);

    // Create sprite material
    const material = new THREE.SpriteMaterial({
      map: texture,
      color: new THREE.Color(glyph.color),
      transparent: true,
      opacity: glyph.opacity,
      depthWrite: false,
      depthTest: true
    });

    // Create sprite
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(glyph.position);
    sprite.scale.set(glyph.scale, glyph.scale, 1);
    sprite.name = glyphId;
    sprite.userData.glyph = glyph;

    // Add to group
    this.glyphGroup.add(sprite);

    // Store reference
    glyph.sprite = sprite;
    glyph.material = material;
    glyph.texture = texture;
    this.glyphs.set(glyphId, glyph);

    // Fade in animation
    if (this.settings.fadeIn) {
      this.fadeInGlyph(glyph);
    }

    console.log(`🌟 Created glyph: ${glyph.character} (${glyphId})`);
    return glyph;
  }

  /**
   * Create texture from text character
   */
  createTextTexture(glyph) {
    const size = this.settings.defaultSize;
    this.textCanvas.width = size;
    this.textCanvas.height = size;

    const ctx = this.textContext;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Configure text rendering
    ctx.font = `${glyph.fontWeight} ${glyph.fontSize}px ${glyph.fontFamily}`;
    ctx.fillStyle = '#ffffff'; // Always white (color applied via material)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Add subtle glow
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 20;

    // Draw character
    ctx.fillText(glyph.character, size / 2, size / 2);

    // Create texture
    const texture = new THREE.CanvasTexture(this.textCanvas);
    texture.needsUpdate = true;

    return texture;
  }

  /**
   * Update glyph
   */
  updateGlyph(glyphId, updates = {}) {
    const glyph = this.glyphs.get(glyphId);
    if (!glyph) {
      console.warn(`🌟 Glyph ${glyphId} not found`);
      return;
    }

    // Update position
    if (updates.position) {
      glyph.position.copy(updates.position);
      glyph.sprite.position.copy(updates.position);
    }

    // Update scale
    if (updates.scale !== undefined) {
      glyph.scale = updates.scale;
      glyph.sprite.scale.set(glyph.scale, glyph.scale, 1);
    }

    // Update color
    if (updates.color) {
      glyph.color = updates.color;
      glyph.material.color.set(glyph.color);
    }

    // Update opacity
    if (updates.opacity !== undefined) {
      glyph.opacity = updates.opacity;
      glyph.material.opacity = glyph.opacity;
    }

    // Update character (requires texture rebuild)
    if (updates.character) {
      glyph.character = updates.character;
      glyph.texture.dispose();
      glyph.texture = this.createTextTexture(glyph);
      glyph.material.map = glyph.texture;
      glyph.material.needsUpdate = true;
    }
  }

  /**
   * Remove glyph
   */
  removeGlyph(glyphId) {
    const glyph = this.glyphs.get(glyphId);
    if (!glyph) return;

    // Dispose resources
    if (glyph.texture) glyph.texture.dispose();
    if (glyph.material) glyph.material.dispose();
    if (glyph.sprite) this.glyphGroup.remove(glyph.sprite);

    this.glyphs.delete(glyphId);
    console.log(`🌟 Removed glyph: ${glyphId}`);
  }

  /**
   * Clear all glyphs
   */
  clearGlyphs() {
    for (const glyphId of this.glyphs.keys()) {
      this.removeGlyph(glyphId);
    }
    console.log("🌟 Cleared all glyphs");
  }

  /**
   * Fade in glyph
   */
  fadeInGlyph(glyph) {
    const startOpacity = 0;
    const targetOpacity = glyph.opacity;
    const duration = this.settings.fadeInDuration;
    const startTime = performance.now();

    glyph.material.opacity = startOpacity;

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / duration, 1.0);

      // Ease in
      const eased = t * t;

      glyph.material.opacity = startOpacity + (targetOpacity - startOpacity) * eased;

      if (t < 1.0) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  /**
   * Fade out glyph
   */
  fadeOutGlyph(glyphId, callback) {
    const glyph = this.glyphs.get(glyphId);
    if (!glyph) return;

    const startOpacity = glyph.material.opacity;
    const duration = 500;
    const startTime = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / duration, 1.0);

      // Ease out
      const eased = 1 - (1 - t) * (1 - t);

      glyph.material.opacity = startOpacity * (1 - eased);

      if (t < 1.0) {
        requestAnimationFrame(animate);
      } else {
        this.removeGlyph(glyphId);
        if (callback) callback();
      }
    };

    animate();
  }

  /**
   * Update billboarding (make glyphs face camera)
   */
  update() {
    if (!this.settings.billboard) return;

    for (const glyph of this.glyphs.values()) {
      if (glyph.billboard && glyph.sprite) {
        // Sprites automatically billboard in THREE.js
        // This is a no-op but kept for extensibility
      }
    }
  }

  /**
   * Set glyph visibility
   */
  setVisible(visible) {
    this.settings.visible = visible;
    this.glyphGroup.visible = visible;
  }

  /**
   * Get glyph by ID
   */
  getGlyph(glyphId) {
    return this.glyphs.get(glyphId);
  }

  /**
   * Get all glyphs
   */
  getAllGlyphs() {
    return Array.from(this.glyphs.values());
  }

  /**
   * Get glyph count
   */
  getGlyphCount() {
    return this.glyphs.size;
  }
}

/**
 * Preset glyph collections for common symbols
 */
export const GlyphPresets = {
  // Alchemical
  alchemy: {
    fire: '🜂',
    water: '🜄',
    air: '🜁',
    earth: '🜃',
    gold: '☉',
    silver: '☽',
    mercury: '☿'
  },

  // Astrological
  zodiac: {
    aries: '♈',
    taurus: '♉',
    gemini: '♊',
    cancer: '♋',
    leo: '♌',
    virgo: '♍',
    libra: '♎',
    scorpio: '♏',
    sagittarius: '♐',
    capricorn: '♑',
    aquarius: '♒',
    pisces: '♓'
  },

  // Geometric
  sacred: {
    circle: '○',
    vesica: '⧓',
    triangle: '△',
    square: '□',
    pentagon: '⬟',
    hexagon: '⬡',
    star: '✦',
    spiral: '🌀'
  },

  // I Ching
  iching: {
    heaven: '☰',
    earth: '☷',
    water: '☵',
    fire: '☲',
    thunder: '☳',
    wind: '☴',
    mountain: '☶',
    lake: '☱'
  },

  // Runic
  runes: {
    fehu: 'ᚠ',
    uruz: 'ᚢ',
    thurisaz: 'ᚦ',
    ansuz: 'ᚨ',
    raidho: 'ᚱ',
    kenaz: 'ᚲ',
    gebo: 'ᚷ',
    wunjo: 'ᚹ'
  },

  // Tarot
  tarot: {
    fool: '0',
    magician: 'I',
    priestess: 'II',
    empress: 'III',
    emperor: 'IV',
    hierophant: 'V',
    lovers: 'VI',
    chariot: 'VII',
    strength: 'VIII',
    hermit: 'IX',
    wheel: 'X',
    justice: 'XI',
    hanged: 'XII',
    death: 'XIII',
    temperance: 'XIV',
    devil: 'XV',
    tower: 'XVI',
    star: 'XVII',
    moon: 'XVIII',
    sun: 'XIX',
    judgement: 'XX',
    world: 'XXI'
  },

  // Chakras
  chakras: {
    root: '🔴',
    sacral: '🟠',
    solar: '🟡',
    heart: '🟢',
    throat: '🔵',
    third_eye: '🟣',
    crown: '⚪'
  }
};

console.log("🌟 Glyph rendering system ready");
