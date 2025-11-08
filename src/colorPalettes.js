// MMPA Color Palette System
// Customizable synesthetic mappings (Phase 1: Presets)
// Empirically grounded in color psychology, not esoteric claims

export const COLOR_PALETTES = {
  'Arousal Theory (Default)': {
    description: 'Based on color psychology: warm colors for high arousal (chaos), cool colors for low arousal (harmony)',
    pi: '#ff0000',      // Red - high arousal, energy, chaos
    phi: '#00ffff',     // Cyan - low arousal, calm, stability
    archetypes: {
      'PERFECT_FIFTH': '#00ffff',    // Cyan - consonant, stable
      'WOLF_FIFTH': '#8b0000',        // Dark red - dissonant, unstable
      'MAJOR_THIRD': '#ffff00',       // Yellow - bright, positive
      'MINOR_THIRD': '#0000ff',       // Blue - dark, contemplative
      'TRITONE': '#800080',           // Purple - ambiguous, tense
      'OCTAVE': '#ffffff',            // White - perfect unity
      'PERFECT_FOURTH': '#00ff00',    // Green - balanced
      'MAJOR_SIXTH': '#ff00ff',       // Magenta - warm consonance
      'MINOR_SIXTH': '#00aaff',       // Light blue - cool consonance
      'MAJOR_SECOND': '#ffaa00',      // Orange - mild dissonance
      'MINOR_SECOND': '#ff0088'       // Pink - sharp dissonance
    }
  },

  'Scriabin Synesthesia': {
    description: 'Based on composer Alexander Scriabin\'s documented chromesthesia (personal synesthetic mappings)',
    pi: '#ff0000',      // C = Red
    phi: '#0066ff',     // F# = Bright Blue
    archetypes: {
      'PERFECT_FIFTH': '#0066ff',    // F# in C scale (bright blue)
      'WOLF_FIFTH': '#ff0000',        // C (red)
      'MAJOR_THIRD': '#ffff00',       // E (yellow/white)
      'MINOR_THIRD': '#ff00ff',       // Eb (purple/violet)
      'TRITONE': '#9400d3',           // F# (dark violet)
      'OCTAVE': '#ff0000',            // C octave (red)
      'PERFECT_FOURTH': '#00ff00',    // F (bright green)
      'MAJOR_SIXTH': '#ff1493',       // A (rose/pink)
      'MINOR_SIXTH': '#4b0082',       // Ab (indigo)
      'MAJOR_SECOND': '#ffa500',      // D (orange)
      'MINOR_SECOND': '#8b0000'       // Db (dark red)
    }
  },

  'Newton Rainbow (1704)': {
    description: 'Isaac Newton\'s color wheel mapped to musical scale (historical, theoretical)',
    pi: '#ff0000',      // Red (C)
    phi: '#4b0082',     // Indigo (G)
    archetypes: {
      'PERFECT_FIFTH': '#4b0082',    // Indigo (G)
      'WOLF_FIFTH': '#8b0000',        // Dark red (detuned)
      'MAJOR_THIRD': '#ffff00',       // Yellow (E)
      'MINOR_THIRD': '#ffa500',       // Orange (Eb)
      'TRITONE': '#00ff00',           // Green (F#)
      'OCTAVE': '#ff0000',            // Red (C octave)
      'PERFECT_FOURTH': '#00ff00',    // Green (F)
      'MAJOR_SIXTH': '#0000ff',       // Blue (A)
      'MINOR_SIXTH': '#008000',       // Dark green (Ab)
      'MAJOR_SECOND': '#ff8c00',      // Dark orange (D)
      'MINOR_SECOND': '#ff6347'       // Tomato (Db)
    }
  },

  'High Contrast (Accessibility)': {
    description: 'Maximum contrast for visual impairment, colorblindness, or high-visibility needs',
    pi: '#ffffff',      // White
    phi: '#000000',     // Black
    archetypes: {
      'PERFECT_FIFTH': '#000000',    // Black
      'WOLF_FIFTH': '#ffffff',        // White
      'MAJOR_THIRD': '#ffff00',       // Yellow
      'MINOR_THIRD': '#0000ff',       // Blue
      'TRITONE': '#808080',           // Gray
      'OCTAVE': '#ffffff',            // White
      'PERFECT_FOURTH': '#00ff00',    // Green
      'MAJOR_SIXTH': '#ff00ff',       // Magenta
      'MINOR_SIXTH': '#00ffff',       // Cyan
      'MAJOR_SECOND': '#ff0000',      // Red
      'MINOR_SECOND': '#ffa500'       // Orange
    }
  },

  'Ocean Depths (Cool Theme)': {
    description: 'Cool palette inspired by ocean and water - calming, meditative',
    pi: '#00aaff',      // Light blue (surface)
    phi: '#003366',     // Deep blue (depths)
    archetypes: {
      'PERFECT_FIFTH': '#003366',    // Deep blue
      'WOLF_FIFTH': '#00aaff',        // Light blue
      'MAJOR_THIRD': '#33ddff',       // Bright cyan
      'MINOR_THIRD': '#002244',       // Very dark blue
      'TRITONE': '#0088cc',           // Medium blue
      'OCTAVE': '#00ffff',            // Cyan
      'PERFECT_FOURTH': '#0066bb',    // Blue
      'MAJOR_SIXTH': '#66eeff',       // Pale cyan
      'MINOR_SIXTH': '#004488',       // Dark blue
      'MAJOR_SECOND': '#00ccee',      // Sky blue
      'MINOR_SECOND': '#005599'       // Navy blue
    }
  },

  'Sunset Fire (Warm Theme)': {
    description: 'Warm palette inspired by fire and sunset - energetic, passionate',
    pi: '#ff6600',      // Orange
    phi: '#ffcc00',     // Yellow
    archetypes: {
      'PERFECT_FIFTH': '#ffcc00',    // Yellow
      'WOLF_FIFTH': '#ff6600',        // Orange
      'MAJOR_THIRD': '#ffff99',       // Pale yellow
      'MINOR_THIRD': '#ff9900',       // Dark orange
      'TRITONE': '#ff3300',           // Red-orange
      'OCTAVE': '#ffffcc',            // Cream
      'PERFECT_FOURTH': '#ffdd44',    // Golden yellow
      'MAJOR_SIXTH': '#ffaa22',       // Amber
      'MINOR_SIXTH': '#ff7700',       // Bright orange
      'MAJOR_SECOND': '#ffbb33',      // Yellow-orange
      'MINOR_SECOND': '#ff5500'       // Dark red-orange
    }
  },

  'Inverted (Experimental)': {
    description: 'Inverted arousal mapping - cool colors for chaos, warm for harmony (experimental)',
    pi: '#00ffff',      // Cyan (inverted from red)
    phi: '#ff0000',     // Red (inverted from cyan)
    archetypes: {
      'PERFECT_FIFTH': '#ff0000',    // Red - stable (inverted)
      'WOLF_FIFTH': '#00ffff',        // Cyan - chaotic (inverted)
      'MAJOR_THIRD': '#0000ff',       // Blue - major (inverted)
      'MINOR_THIRD': '#ffff00',       // Yellow - minor (inverted)
      'TRITONE': '#00ff00',           // Green - ambiguous
      'OCTAVE': '#000000',            // Black - unity (inverted)
      'PERFECT_FOURTH': '#ff00ff',    // Magenta - balanced
      'MAJOR_SIXTH': '#00ff88',       // Cyan-green
      'MINOR_SIXTH': '#ff8800',       // Orange
      'MAJOR_SECOND': '#0088ff',      // Blue
      'MINOR_SECOND': '#ff0044'       // Red-pink
    }
  },

  'Monochrome Purple': {
    description: 'Single hue with varying saturation/lightness - for focus on brightness over color',
    pi: '#800080',      // Purple
    phi: '#e6d6ff',     // Pale purple
    archetypes: {
      'PERFECT_FIFTH': '#e6d6ff',    // Very pale purple
      'WOLF_FIFTH': '#4b0082',        // Indigo
      'MAJOR_THIRD': '#d8bfff',       // Pale purple
      'MINOR_THIRD': '#9966cc',       // Medium purple
      'TRITONE': '#663399',           // Dark purple
      'OCTAVE': '#f5f0ff',            // Almost white purple
      'PERFECT_FOURTH': '#c9adff',    // Light purple
      'MAJOR_SIXTH': '#b399d9',       // Medium-light purple
      'MINOR_SIXTH': '#7a5099',       // Dark medium purple
      'MAJOR_SECOND': '#ad85d9',      // Light-medium purple
      'MINOR_SECOND': '#5c3d7a'       // Very dark purple
    }
  }
};

// Global archetype color map (will be modified by palette selection)
let currentPalette = 'Arousal Theory (Default)';

export function applyColorPalette(paletteName) {
  const palette = COLOR_PALETTES[paletteName];
  if (!palette) {
    console.error(`❌ Color palette not found: ${paletteName}`);
    return false;
  }

  currentPalette = paletteName;

  // Save preference to localStorage
  try {
    localStorage.setItem('mmpa_color_palette', paletteName);
  } catch (e) {
    console.warn('Could not save color palette preference:', e);
  }

  // Emit event for UI updates
  window.dispatchEvent(new CustomEvent('colorPaletteChanged', {
    detail: { palette: paletteName, colors: palette }
  }));

  console.log(`🎨 Applied color palette: ${paletteName}`);
  console.log(`   Description: ${palette.description}`);

  return true;
}

export function loadSavedPalette() {
  try {
    const saved = localStorage.getItem('mmpa_color_palette');
    if (saved && COLOR_PALETTES[saved]) {
      applyColorPalette(saved);
      return saved;
    }
  } catch (e) {
    console.warn('Could not load saved color palette:', e);
  }

  // Default palette
  applyColorPalette('Arousal Theory (Default)');
  return 'Arousal Theory (Default)';
}

export function getCurrentPalette() {
  return currentPalette;
}

export function getPaletteColor(archetypeName) {
  const palette = COLOR_PALETTES[currentPalette];
  return palette?.archetypes?.[archetypeName] || '#888888';
}

export function getPiPhiColors() {
  const palette = COLOR_PALETTES[currentPalette];
  return {
    pi: palette?.pi || '#ff0000',
    phi: palette?.phi || '#00ffff'
  };
}

console.log("🎨 colorPalettes.js loaded");
