// Archetype Color Bridge
// Connects π/φ color palette system to 3D geometry rendering
console.log("🎨 archetypeColors.js loaded");

import { getPaletteColor, getPiPhiColors } from './colorPalettes.js';
import { getCurrentArchetype, getConfidence } from './archetypeRecognizer.js';

// Track current coloring state
let currentArchetypeColor = '#888888';
let currentPiPhiBlend = { pi: '#ff0000', phi: '#00ffff' };
let synchronicityPulse = 0; // 0-1, for pulse effects

// π/φ metrics for blending (set by update)
let lastPiScore = 0;
let lastPhiScore = 0;
let lastSynchronicity = 0;

/**
 * Get archetype-based color for geometry
 * @param {string} archetypeName - Current archetype name
 * @returns {number} - Three.js color hex (e.g., 0xff4444)
 */
export function getArchetypeColor(archetypeName) {
  if (!archetypeName || archetypeName === 'NEUTRAL_STATE' || archetypeName === '--') {
    // No archetype detected, return neutral gray
    return 0x888888;
  }

  // Get hex color from palette
  const hexColor = getPaletteColor(archetypeName);

  // Convert hex string (#ff4444) to number (0xff4444)
  const colorNum = parseInt(hexColor.replace('#', '0x'), 16);

  currentArchetypeColor = hexColor;
  return colorNum;
}

/**
 * Get π/φ blended color based on current chaos/harmony balance
 * @param {number} piScore - Chaos score (0-1)
 * @param {number} phiScore - Harmony score (0-1)
 * @returns {number} - Three.js color hex
 */
export function getPiPhiBlendedColor(piScore, phiScore) {
  const colors = getPiPhiColors();

  // Convert hex to RGB
  const piRgb = hexToRgb(colors.pi);
  const phiRgb = hexToRgb(colors.phi);

  // Normalize blend weights
  const total = piScore + phiScore;
  const piWeight = total > 0 ? piScore / total : 0.5;
  const phiWeight = total > 0 ? phiScore / total : 0.5;

  // Blend colors
  const r = Math.round(piRgb.r * piWeight + phiRgb.r * phiWeight);
  const g = Math.round(piRgb.g * piWeight + phiRgb.g * phiWeight);
  const b = Math.round(piRgb.b * piWeight + phiRgb.b * phiWeight);

  return (r << 16) | (g << 8) | b;
}

/**
 * Get color that combines archetype + π/φ blend
 * @param {string} archetypeName
 * @param {number} piScore
 * @param {number} phiScore
 * @param {number} confidence - Archetype detection confidence (0-1)
 * @returns {number} - Three.js color hex
 */
export function getCombinedColor(archetypeName, piScore, phiScore, confidence) {
  // If low confidence, blend more toward π/φ state
  // If high confidence, use archetype color

  if (confidence < 0.3) {
    // Low confidence: use pure π/φ blend
    return getPiPhiBlendedColor(piScore, phiScore);
  }

  const archetypeColor = getArchetypeColor(archetypeName);
  const piPhiColor = getPiPhiBlendedColor(piScore, phiScore);

  if (confidence > 0.7) {
    // High confidence: use archetype color
    return archetypeColor;
  }

  // Medium confidence: blend archetype with π/φ
  const blendFactor = (confidence - 0.3) / 0.4; // 0-1 range from conf 0.3-0.7
  return blendThreeColors(archetypeColor, piPhiColor, blendFactor);
}

/**
 * Update color state from MMPA analysis
 * Called each frame from geometry update
 * @param {object} analysis - { archetype, confidence, pi, phi, synchronicity }
 */
export function updateColorState(analysis) {
  lastPiScore = analysis.pi || 0;
  lastPhiScore = analysis.phi || 0;
  lastSynchronicity = analysis.synchronicity || 0;

  // Update synchronicity pulse (decay over time)
  if (lastSynchronicity > 0.6) {
    synchronicityPulse = Math.min(1, synchronicityPulse + 0.1);
  } else {
    synchronicityPulse = Math.max(0, synchronicityPulse - 0.05);
  }
}

/**
 * Get synchronicity pulse effect intensity
 * Used for flashing/glowing during high synchronicity events
 * @returns {number} - Pulse intensity (0-1)
 */
export function getSynchronicityPulse() {
  return synchronicityPulse;
}

/**
 * Get current geometry color (call this from geometry.js update loop)
 * @returns {object} - { baseColor, audioColor, syncPulse }
 */
export function getCurrentGeometryColors() {
  try {
    const archetype = getCurrentArchetype();
    const confidence = getConfidence();

    // Base color: archetype or π/φ blend
    const baseColor = getCombinedColor(archetype, lastPiScore, lastPhiScore, confidence);

    // Audio reactive color: brighter version of base, or π/φ accent
    const colors = getPiPhiColors();
    const piColor = parseInt(colors.pi.replace('#', '0x'), 16);
    const phiColor = parseInt(colors.phi.replace('#', '0x'), 16);

    // Choose accent based on current dominance
    const audioColor = lastPiScore > lastPhiScore ? piColor : phiColor;

    return {
      baseColor: baseColor,
      audioColor: audioColor,
      syncPulse: synchronicityPulse
    };
  } catch (error) {
    // Fallback to neutral colors if there's any error
    console.warn('⚠️ archetypeColors error:', error);
    return {
      baseColor: 0x888888,
      audioColor: 0xaaaaaa,
      syncPulse: 0
    };
  }
}

// ===== UTILITY FUNCTIONS =====

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 136, g: 136, b: 136 };
}

function blendThreeColors(color1Num, color2Num, factor) {
  // Extract RGB from color1
  const r1 = (color1Num >> 16) & 0xff;
  const g1 = (color1Num >> 8) & 0xff;
  const b1 = color1Num & 0xff;

  // Extract RGB from color2
  const r2 = (color2Num >> 16) & 0xff;
  const g2 = (color2Num >> 8) & 0xff;
  const b2 = color2Num & 0xff;

  // Blend
  const r = Math.round(r1 * factor + r2 * (1 - factor));
  const g = Math.round(g1 * factor + g2 * (1 - factor));
  const b = Math.round(b1 * factor + b2 * (1 - factor));

  return (r << 16) | (g << 8) | b;
}

// Listen for palette changes and log
window.addEventListener('colorPaletteChanged', (event) => {
  console.log('🎨 Archetype colors updated for new palette:', event.detail.palette);
});

console.log("🎨 Archetype color bridge ready");
