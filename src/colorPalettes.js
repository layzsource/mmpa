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
let customPalette = null; // User's custom palette

// Load custom palette from localStorage
function loadCustomPalette() {
  try {
    const saved = localStorage.getItem('mmpa_custom_palette');
    if (saved) {
      customPalette = JSON.parse(saved);
      return customPalette;
    }
  } catch (e) {
    console.warn('Could not load custom palette:', e);
  }
  return null;
}

// Save custom palette to localStorage
function saveCustomPalette(palette) {
  try {
    localStorage.setItem('mmpa_custom_palette', JSON.stringify(palette));
    customPalette = palette;
    console.log('✅ Custom palette saved');
  } catch (e) {
    console.error('❌ Could not save custom palette:', e);
  }
}

export function applyColorPalette(paletteName) {
  let palette;

  if (paletteName === 'Custom') {
    palette = customPalette || loadCustomPalette();
    if (!palette) {
      // Initialize custom palette from default
      palette = {
        description: 'Your personalized color mapping',
        pi: COLOR_PALETTES['Arousal Theory (Default)'].pi,
        phi: COLOR_PALETTES['Arousal Theory (Default)'].phi,
        archetypes: { ...COLOR_PALETTES['Arousal Theory (Default)'].archetypes }
      };
      saveCustomPalette(palette);
    }
    customPalette = palette;
  } else {
    palette = COLOR_PALETTES[paletteName];
    if (!palette) {
      console.error(`❌ Color palette not found: ${paletteName}`);
      return false;
    }
  }

  currentPalette = paletteName;

  // Save preference to localStorage
  try {
    localStorage.setItem('mmpa_color_palette', paletteName);
  } catch (e) {
    console.warn('Could not save color palette preference:', e);
  }

  // Track usage for ML suggestions (Phase 4)
  trackPaletteUsage(paletteName);

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
  if (currentPalette === 'Custom') {
    return customPalette?.archetypes?.[archetypeName] || '#888888';
  }
  const palette = COLOR_PALETTES[currentPalette];
  return palette?.archetypes?.[archetypeName] || '#888888';
}

export function getPiPhiColors() {
  if (currentPalette === 'Custom') {
    return {
      pi: customPalette?.pi || '#ff0000',
      phi: customPalette?.phi || '#00ffff'
    };
  }
  const palette = COLOR_PALETTES[currentPalette];
  return {
    pi: palette?.pi || '#ff0000',
    phi: palette?.phi || '#00ffff'
  };
}

// Get list of all archetype names
export function getArchetypeNames() {
  return [
    'PERFECT_FIFTH',
    'WOLF_FIFTH',
    'MAJOR_THIRD',
    'MINOR_THIRD',
    'TRITONE',
    'OCTAVE',
    'PERFECT_FOURTH',
    'MAJOR_SIXTH',
    'MINOR_SIXTH',
    'MAJOR_SECOND',
    'MINOR_SECOND'
  ];
}

// Update a specific color in the custom palette
export function updateCustomColor(type, value) {
  if (!customPalette) {
    customPalette = loadCustomPalette();
    if (!customPalette) {
      // Initialize from current palette
      const current = currentPalette === 'Custom' ?
        COLOR_PALETTES['Arousal Theory (Default)'] :
        COLOR_PALETTES[currentPalette];
      customPalette = {
        description: 'Your personalized color mapping',
        pi: current.pi,
        phi: current.phi,
        archetypes: { ...current.archetypes }
      };
    }
  }

  // Type can be 'pi', 'phi', or an archetype name
  if (type === 'pi' || type === 'phi') {
    customPalette[type] = value;
  } else if (customPalette.archetypes[type] !== undefined) {
    customPalette.archetypes[type] = value;
  } else {
    console.error(`❌ Unknown color type: ${type}`);
    return false;
  }

  saveCustomPalette(customPalette);

  // Track color usage for ML suggestions (Phase 4)
  trackColorUsage(value);

  // If currently using custom palette, emit update event
  if (currentPalette === 'Custom') {
    window.dispatchEvent(new CustomEvent('colorPaletteChanged', {
      detail: { palette: 'Custom', colors: customPalette }
    }));
  }

  return true;
}

// Get current custom palette (for UI display)
export function getCustomPalette() {
  return customPalette || loadCustomPalette();
}

// Reset custom palette to a preset
export function resetCustomPalette(presetName) {
  const preset = COLOR_PALETTES[presetName];
  if (!preset) {
    console.error(`❌ Preset not found: ${presetName}`);
    return false;
  }

  customPalette = {
    description: 'Your personalized color mapping',
    pi: preset.pi,
    phi: preset.phi,
    archetypes: { ...preset.archetypes }
  };

  saveCustomPalette(customPalette);

  if (currentPalette === 'Custom') {
    window.dispatchEvent(new CustomEvent('colorPaletteChanged', {
      detail: { palette: 'Custom', colors: customPalette }
    }));
  }

  console.log(`✅ Custom palette reset to ${presetName}`);
  return true;
}

// ===== PHASE 4: ML-ASSISTED PALETTE SUGGESTION =====

// Usage tracking
let usageTracking = {
  enabled: true,  // Opt-in by default (privacy-conscious)
  palettes: {},   // { paletteName: { usageCount, totalDuration, lastUsed } }
  colors: {},     // { hexColor: frequency }
  sessions: []    // Recent session data
};

let currentSessionStart = null;
let currentSessionPalette = null;

// Load usage data from localStorage
function loadUsageData() {
  try {
    const saved = localStorage.getItem('mmpa_palette_usage');
    if (saved) {
      usageTracking = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Could not load usage data:', e);
  }
}

// Save usage data to localStorage
function saveUsageData() {
  try {
    localStorage.setItem('mmpa_palette_usage', JSON.stringify(usageTracking));
  } catch (e) {
    console.error('Could not save usage data:', e);
  }
}

// Track palette usage
function trackPaletteUsage(paletteName) {
  if (!usageTracking.enabled) return;

  // End previous session
  if (currentSessionPalette && currentSessionStart) {
    const duration = Date.now() - currentSessionStart;
    if (!usageTracking.palettes[currentSessionPalette]) {
      usageTracking.palettes[currentSessionPalette] = {
        usageCount: 0,
        totalDuration: 0,
        lastUsed: 0
      };
    }
    usageTracking.palettes[currentSessionPalette].totalDuration += duration;
  }

  // Start new session
  currentSessionStart = Date.now();
  currentSessionPalette = paletteName;

  if (!usageTracking.palettes[paletteName]) {
    usageTracking.palettes[paletteName] = {
      usageCount: 0,
      totalDuration: 0,
      lastUsed: Date.now()
    };
  }

  usageTracking.palettes[paletteName].usageCount++;
  usageTracking.palettes[paletteName].lastUsed = Date.now();

  saveUsageData();
}

// Track color usage when custom colors are updated
function trackColorUsage(hexColor) {
  if (!usageTracking.enabled) return;

  if (!usageTracking.colors[hexColor]) {
    usageTracking.colors[hexColor] = 0;
  }
  usageTracking.colors[hexColor]++;

  saveUsageData();
}

// Calculate color distance (simple RGB Euclidean)
function colorDistance(color1, color2) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const rDiff = c1.r - c2.r;
  const gDiff = c1.g - c2.g;
  const bDiff = c1.b - c2.b;

  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

// Get most used colors
function getMostUsedColors(limit = 5) {
  const sorted = Object.entries(usageTracking.colors)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit);

  return sorted.map(([color]) => color);
}

// Get most used palettes
function getMostUsedPalettes(limit = 3) {
  const sorted = Object.entries(usageTracking.palettes)
    .sort(([, a], [, b]) => {
      // Weight by both usage count and duration
      const scoreA = a.usageCount * 0.4 + (a.totalDuration / 60000) * 0.6;
      const scoreB = b.usageCount * 0.4 + (b.totalDuration / 60000) * 0.6;
      return scoreB - scoreA;
    })
    .slice(0, limit);

  return sorted.map(([paletteName, data]) => ({ paletteName, ...data }));
}

// Calculate average color from user's preferences
function getAveragePreferredColor(colors) {
  if (colors.length === 0) return '#888888';

  let totalR = 0, totalG = 0, totalB = 0;

  colors.forEach(color => {
    const rgb = hexToRgb(color);
    totalR += rgb.r;
    totalG += rgb.g;
    totalB += rgb.b;
  });

  const avgR = Math.round(totalR / colors.length);
  const avgG = Math.round(totalG / colors.length);
  const avgB = Math.round(totalB / colors.length);

  return rgbToHex(avgR, avgG, avgB);
}

// Suggest palette based on user preferences
export function suggestPalette() {
  if (!usageTracking.enabled) return null;

  const mostUsedColors = getMostUsedColors(10);
  if (mostUsedColors.length < 3) {
    // Not enough data, suggest a popular preset
    return {
      type: 'preset',
      paletteName: 'Arousal Theory (Default)',
      reason: 'Not enough usage data yet. Try this popular preset!'
    };
  }

  // Calculate average preferred color
  const avgColor = getAveragePreferredColor(mostUsedColors);

  // Find closest matching rule based on color preferences
  let bestRule = 'Consonance Gradient';
  let bestDistance = Infinity;

  Object.entries(COLOR_GENERATION_RULES).forEach(([ruleName, rule]) => {
    const ruleStartRgb = hexToRgb(rule.colorStart);
    const ruleEndRgb = hexToRgb(rule.colorEnd);
    const avgRgb = hexToRgb(avgColor);

    // Distance to rule's color space
    const distStart = Math.sqrt(
      Math.pow(ruleStartRgb.r - avgRgb.r, 2) +
      Math.pow(ruleStartRgb.g - avgRgb.g, 2) +
      Math.pow(ruleStartRgb.b - avgRgb.b, 2)
    );
    const distEnd = Math.sqrt(
      Math.pow(ruleEndRgb.r - avgRgb.r, 2) +
      Math.pow(ruleEndRgb.g - avgRgb.g, 2) +
      Math.pow(ruleEndRgb.b - avgRgb.b, 2)
    );

    const avgDist = (distStart + distEnd) / 2;

    if (avgDist < bestDistance) {
      bestDistance = avgDist;
      bestRule = ruleName;
    }
  });

  // Analyze color temperature preference
  const warmColors = mostUsedColors.filter(color => {
    const rgb = hexToRgb(color);
    return rgb.r > rgb.b; // More red than blue = warm
  }).length;

  const preferWarm = warmColors > mostUsedColors.length / 2;

  // Adjust suggestion based on preference
  let suggestedStart = avgColor;
  let suggestedEnd = preferWarm ? '#0000ff' : '#ff0000'; // Opposite temperature

  return {
    type: 'generated',
    rule: bestRule,
    startColor: suggestedStart,
    endColor: suggestedEnd,
    reason: `Based on your ${preferWarm ? 'warm' : 'cool'} color preferences`
  };
}

// Get personalized recommendations
export function getPersonalizedRecommendations() {
  loadUsageData();

  const mostUsed = getMostUsedPalettes(3);
  const suggestion = suggestPalette();

  return {
    mostUsed,
    suggestion,
    totalSessions: Object.keys(usageTracking.palettes).length,
    colorsDefined: Object.keys(usageTracking.colors).length
  };
}

// Enable/disable tracking
export function setTrackingEnabled(enabled) {
  usageTracking.enabled = enabled;
  saveUsageData();
  console.log(`🔒 Palette usage tracking ${enabled ? 'enabled' : 'disabled'}`);
}

// Clear usage data
export function clearUsageData() {
  usageTracking = {
    enabled: usageTracking.enabled,
    palettes: {},
    colors: {},
    sessions: []
  };
  saveUsageData();
  console.log('🗑️ Usage data cleared');
}

// Initialize usage tracking
loadUsageData();

// ===== PHASE 3: RULE-BASED PALETTE GENERATION =====

// Archetype properties for rule-based generation
const ARCHETYPE_PROPERTIES = {
  'PERFECT_FIFTH': {
    consonance: 1.0,      // Most consonant
    complexity: 0.1,      // Simplest ratio (3:2)
    frequency: 1.5,       // Frequency ratio
    harmonicity: 1.0,     // Perfect harmonicity
    tension: 0.0          // No tension
  },
  'OCTAVE': {
    consonance: 1.0,
    complexity: 0.0,
    frequency: 2.0,
    harmonicity: 1.0,
    tension: 0.0
  },
  'PERFECT_FOURTH': {
    consonance: 0.9,
    complexity: 0.15,
    frequency: 1.333,
    harmonicity: 0.95,
    tension: 0.1
  },
  'MAJOR_THIRD': {
    consonance: 0.8,
    complexity: 0.3,
    frequency: 1.25,
    harmonicity: 0.85,
    tension: 0.2
  },
  'MINOR_THIRD': {
    consonance: 0.75,
    complexity: 0.35,
    frequency: 1.2,
    harmonicity: 0.8,
    tension: 0.25
  },
  'MAJOR_SIXTH': {
    consonance: 0.7,
    complexity: 0.4,
    frequency: 1.667,
    harmonicity: 0.75,
    tension: 0.3
  },
  'MINOR_SIXTH': {
    consonance: 0.65,
    complexity: 0.45,
    frequency: 1.6,
    harmonicity: 0.7,
    tension: 0.35
  },
  'MAJOR_SECOND': {
    consonance: 0.4,
    complexity: 0.6,
    frequency: 1.125,
    harmonicity: 0.5,
    tension: 0.6
  },
  'MINOR_SECOND': {
    consonance: 0.2,
    complexity: 0.75,
    frequency: 1.067,
    harmonicity: 0.3,
    tension: 0.8
  },
  'TRITONE': {
    consonance: 0.0,      // Most dissonant
    complexity: 0.5,
    frequency: 1.414,
    harmonicity: 0.0,
    tension: 1.0          // Maximum tension
  },
  'WOLF_FIFTH': {
    consonance: 0.1,
    complexity: 0.9,
    frequency: 1.48,
    harmonicity: 0.2,
    tension: 0.9
  }
};

// Color generation rules
export const COLOR_GENERATION_RULES = {
  'Consonance Gradient': {
    description: 'Colors transition from dissonant (warm) to consonant (cool) based on harmonic consonance',
    property: 'consonance',
    colorStart: '#ff0000',  // Red (dissonant)
    colorEnd: '#0000ff'     // Blue (consonant)
  },
  'Frequency Spectrum': {
    description: 'Colors map to frequency ratios like visible light spectrum (low=red, high=violet)',
    property: 'frequency',
    colorStart: '#ff0000',  // Red (low freq)
    colorEnd: '#9400d3'     // Violet (high freq)
  },
  'Tension Heat Map': {
    description: 'Colors represent musical tension from cool (relaxed) to hot (tense)',
    property: 'tension',
    colorStart: '#00ffff',  // Cyan (relaxed)
    colorEnd: '#ff0000'     // Red (tense)
  },
  'Complexity Fade': {
    description: 'Simple ratios are bright, complex ratios fade to dark',
    property: 'complexity',
    colorStart: '#ffffff',  // White (simple)
    colorEnd: '#000000'     // Black (complex)
  },
  'Harmonic Saturation': {
    description: 'Harmonic intervals are saturated, inharmonic intervals are desaturated',
    property: 'harmonicity',
    colorStart: '#808080',  // Gray (inharmonic)
    colorEnd: '#ff00ff'     // Magenta (harmonic)
  },
  'Rainbow (Chromatic)': {
    description: 'Map intervals to rainbow colors in chromatic circle order',
    property: 'frequency',
    colorStart: '#ff0000',
    colorEnd: '#ff0000',    // Wraps around
    useHue: true
  },
  'Golden Ratio Spiral': {
    description: 'Colors follow φ (golden ratio) spiral through hue space',
    property: 'consonance',
    colorStart: '#ffaa00',
    colorEnd: '#00aaff',
    useGoldenRatio: true
  }
};

// Interpolate between two hex colors
function interpolateColor(color1, color2, factor) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return rgbToHex(r, g, b);
}

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Convert RGB to hex
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Convert HSL to RGB
function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r, g, b;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

// Generate palette from rule
export function generatePaletteFromRule(ruleName, startColor = null, endColor = null) {
  const rule = COLOR_GENERATION_RULES[ruleName];
  if (!rule) {
    console.error(`❌ Rule not found: ${ruleName}`);
    return null;
  }

  const start = startColor || rule.colorStart;
  const end = endColor || rule.colorEnd;
  const property = rule.property;

  const generatedPalette = {
    description: `Generated: ${rule.description}`,
    pi: null,
    phi: null,
    archetypes: {}
  };

  // Generate archetype colors based on property
  const archetypes = Object.keys(ARCHETYPE_PROPERTIES);

  if (rule.useHue) {
    // Rainbow/hue-based generation
    archetypes.forEach((archetype, index) => {
      const hue = (index / archetypes.length) * 360;
      const rgb = hslToRgb(hue, 0.8, 0.5);
      generatedPalette.archetypes[archetype] = rgbToHex(rgb.r, rgb.g, rgb.b);
    });
  } else if (rule.useGoldenRatio) {
    // Golden ratio spiral through hue space
    const PHI = 1.618033988749;
    archetypes.forEach((archetype, index) => {
      const hue = (index * 360 / PHI) % 360;
      const value = ARCHETYPE_PROPERTIES[archetype][property];
      const saturation = 0.5 + (value * 0.5);
      const lightness = 0.4 + (value * 0.2);
      const rgb = hslToRgb(hue, saturation, lightness);
      generatedPalette.archetypes[archetype] = rgbToHex(rgb.r, rgb.g, rgb.b);
    });
  } else {
    // Linear interpolation based on property
    archetypes.forEach(archetype => {
      const value = ARCHETYPE_PROPERTIES[archetype][property];
      generatedPalette.archetypes[archetype] = interpolateColor(start, end, value);
    });
  }

  // Generate π/φ colors based on rule
  if (property === 'consonance' || property === 'harmonicity') {
    generatedPalette.pi = interpolateColor(start, end, 0.0);  // Chaos = low consonance
    generatedPalette.phi = interpolateColor(start, end, 1.0); // Harmony = high consonance
  } else if (property === 'tension') {
    generatedPalette.pi = interpolateColor(start, end, 1.0);  // Chaos = high tension
    generatedPalette.phi = interpolateColor(start, end, 0.0); // Harmony = low tension
  } else if (property === 'complexity') {
    generatedPalette.pi = interpolateColor(start, end, 1.0);  // Chaos = complex
    generatedPalette.phi = interpolateColor(start, end, 0.0); // Harmony = simple
  } else {
    // Default based on frequency
    generatedPalette.pi = interpolateColor(start, end, 0.7);
    generatedPalette.phi = interpolateColor(start, end, 0.3);
  }

  return generatedPalette;
}

// Apply generated palette to custom palette
export function applyGeneratedPalette(ruleName, startColor = null, endColor = null) {
  const generated = generatePaletteFromRule(ruleName, startColor, endColor);
  if (!generated) return false;

  customPalette = generated;
  saveCustomPalette(customPalette);

  if (currentPalette === 'Custom') {
    window.dispatchEvent(new CustomEvent('colorPaletteChanged', {
      detail: { palette: 'Custom', colors: customPalette }
    }));
  }

  console.log(`✅ Generated palette from rule: ${ruleName}`);
  return true;
}

console.log("🎨 colorPalettes.js loaded");
