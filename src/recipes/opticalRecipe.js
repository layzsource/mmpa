/**
 * 📷 Optical Pattern Recognition Recipe
 *
 * Second Concrete Recipe - Visual/Camera Data Domain
 *
 * Demonstrates how MMPA universal forces map to optical-specific insights:
 * - Identity: What colors/shapes? (brightness, hue, saturation, dominant forms)
 * - Relationship: Spatial harmony (color harmony, symmetry, balance)
 * - Complexity: Visual richness (detail level, texture, edge density)
 * - Transformation: Motion/change (optical flow, temporal flux, velocity)
 * - Alignment: Spatial coherence (symmetry, distribution, organization)
 * - Potential: Visual predictability (motion patterns, emergence, chaos)
 *
 * This recipe uses optical MMPA features (extractOpticalMMPAFeatures)
 * and interprets them for meaningful visual classification and anomaly detection.
 */

console.log("📷 opticalRecipe.js loading...");

import { MMPARecipe } from '../recipeEngine.js';

// ============================================================================
// OPTICAL PATTERN CATEGORIES
// ============================================================================

const OPTICAL_PATTERNS = {
  DARKNESS: 'darkness',           // Very low brightness
  STATIC: 'static',               // No motion, stable scene
  MONOCHROME: 'monochrome',       // Single color dominant
  VIBRANT: 'vibrant',             // High saturation, multiple colors
  GEOMETRIC: 'geometric',         // Sharp edges, regular shapes
  ORGANIC: 'organic',             // Soft edges, natural forms
  MOTION: 'motion',               // Visible movement
  FAST_MOTION: 'fast_motion',     // Rapid movement
  CHAOS: 'chaos',                 // Disorganized, high entropy
  SYMMETRY: 'symmetry',           // Balanced, organized
  TEXTURE: 'texture'              // Rich surface detail
};

const OPTICAL_QUALITIES = {
  BRIGHT: 'bright',               // High luminance
  DARK: 'dark',                   // Low luminance
  SATURATED: 'saturated',         // Vivid colors
  MUTED: 'muted',                 // Desaturated colors
  SHARP: 'sharp',                 // High edge definition
  SOFT: 'soft',                   // Low edge definition
  DETAILED: 'detailed',           // High complexity
  SIMPLE: 'simple',               // Low complexity
  BALANCED: 'balanced',           // Symmetric distribution
  SCATTERED: 'scattered',         // Random distribution
  STABLE: 'stable',               // Low temporal change
  DYNAMIC: 'dynamic'              // High temporal change
};

// ============================================================================
// OPTICAL-SPECIFIC THRESHOLDS
// ============================================================================

const DEFAULT_CONFIG = {
  // Identity thresholds
  darknessThreshold: 0.1,         // Brightness below this = darkness
  brightnessMin: 0.7,             // Min brightness for "bright"
  saturationMin: 0.6,             // Min saturation for "saturated"

  // Relationship thresholds
  harmonyMin: 0.6,                // Min harmony for "harmonious"
  symmetryMin: 0.7,               // Min symmetry for "symmetric"

  // Complexity thresholds
  detailedComplexityMin: 0.5,     // Min complexity for "detailed"
  simpleComplexityMax: 0.2,       // Max complexity for "simple"
  edgeDensityMin: 0.4,            // Min edge density for "sharp"

  // Transformation thresholds
  stableFluxMax: 0.1,             // Max flux for "stable"
  dynamicFluxMin: 0.4,            // Min flux for "dynamic"
  fastMotionMin: 0.7,             // Min motion for "fast motion"

  // Alignment thresholds
  balanceMin: 0.6,                // Min balance for "balanced"

  // Potential thresholds
  periodicEntropyMax: 0.3,        // Max entropy for periodic
  chaoticEntropyMin: 0.7          // Min entropy for chaotic
};

// ============================================================================
// OPTICAL RECIPE IMPLEMENTATION
// ============================================================================

/**
 * Create optical pattern recognition recipe
 */
export function createOpticalRecipe(customConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...customConfig };

  return new MMPARecipe({
    name: 'Optical Pattern Recognition',
    domain: 'optical',
    description: 'Interprets visual signals using MMPA forces for pattern classification',
    enabled: true,

    // Input adapter (not used - optical MMPA features already computed)
    inputAdapter: (rawOptical) => {
      // This would convert raw video frames to signal format
      // But we rely on extractOpticalMMPAFeatures happening externally
      return { signal: rawOptical, metadata: {} };
    },

    // Output interpreter: MMPA forces → Optical meaning
    outputInterpreter: (mmpa) => {
      const interpretation = {
        pattern: classifyOpticalPattern(mmpa, config),
        qualities: extractOpticalQualities(mmpa, config),
        alerts: detectOpticalAnomalies(mmpa, config),
        summary: '',
        visualization: generateVisualizationHints(mmpa),
        forces: {
          identity: interpretIdentity(mmpa.identity),
          relationship: interpretRelationship(mmpa.relationship),
          complexity: interpretComplexity(mmpa.complexity),
          transformation: interpretTransformation(mmpa.transformation),
          alignment: interpretAlignment(mmpa.alignment),
          potential: interpretPotential(mmpa.potential)
        }
      };

      // Generate human-readable summary
      interpretation.summary = generateSummary(interpretation);

      return interpretation;
    },

    config: config
  });
}

// ============================================================================
// PATTERN CLASSIFICATION
// ============================================================================

/**
 * Classify primary optical pattern type
 */
function classifyOpticalPattern(mmpa, config) {
  const brightness = mmpa.identity?.brightness || 0;
  const saturation = mmpa.identity?.saturation || 0;
  const flux = mmpa.transformation?.flux || 0;
  const motion = mmpa.transformation?.velocity || 0;
  const harmony = mmpa.relationship?.harmony || 0;
  const complexity = mmpa.complexity?.detail || 0;
  const entropy = mmpa.potential?.entropy || 0;
  const symmetry = mmpa.alignment?.symmetry || 0;

  // Darkness
  if (brightness < config.darknessThreshold) {
    return {
      type: OPTICAL_PATTERNS.DARKNESS,
      confidence: 1.0 - brightness / config.darknessThreshold
    };
  }

  // Fast motion
  if (motion > config.fastMotionMin && flux > config.dynamicFluxMin) {
    return {
      type: OPTICAL_PATTERNS.FAST_MOTION,
      confidence: (motion + flux) / 2
    };
  }

  // Motion
  if (motion > 0.3 && flux > 0.2) {
    return {
      type: OPTICAL_PATTERNS.MOTION,
      confidence: (motion + flux) / 2
    };
  }

  // Chaos
  if (entropy > config.chaoticEntropyMin && flux > config.dynamicFluxMin) {
    return {
      type: OPTICAL_PATTERNS.CHAOS,
      confidence: entropy
    };
  }

  // Symmetry
  if (symmetry > config.symmetryMin && flux < config.stableFluxMax) {
    return {
      type: OPTICAL_PATTERNS.SYMMETRY,
      confidence: symmetry
    };
  }

  // Geometric (sharp edges + low entropy)
  if (complexity > 0.4 && entropy < 0.4) {
    return {
      type: OPTICAL_PATTERNS.GEOMETRIC,
      confidence: (complexity + (1 - entropy)) / 2
    };
  }

  // Organic (soft complexity)
  if (complexity > 0.3 && entropy > 0.4) {
    return {
      type: OPTICAL_PATTERNS.ORGANIC,
      confidence: 0.7
    };
  }

  // Vibrant (high saturation + harmony)
  if (saturation > config.saturationMin && harmony > 0.5) {
    return {
      type: OPTICAL_PATTERNS.VIBRANT,
      confidence: (saturation + harmony) / 2
    };
  }

  // Monochrome (low saturation)
  if (saturation < 0.2) {
    return {
      type: OPTICAL_PATTERNS.MONOCHROME,
      confidence: 1.0 - saturation
    };
  }

  // Texture (high complexity + stable)
  if (complexity > config.detailedComplexityMin && flux < config.stableFluxMax) {
    return {
      type: OPTICAL_PATTERNS.TEXTURE,
      confidence: complexity
    };
  }

  // Static (stable, low motion)
  if (flux < config.stableFluxMax && motion < 0.1) {
    return {
      type: OPTICAL_PATTERNS.STATIC,
      confidence: 1.0 - flux
    };
  }

  // Default: Unknown
  return {
    type: 'unknown',
    confidence: 0.0
  };
}

/**
 * Extract optical quality descriptors
 */
function extractOpticalQualities(mmpa, config) {
  const qualities = [];

  const brightness = mmpa.identity?.brightness || 0;
  const saturation = mmpa.identity?.saturation || 0;
  const harmony = mmpa.relationship?.harmony || 0;
  const complexity = mmpa.complexity?.detail || 0;
  const edgeDensity = mmpa.complexity?.edgeDensity || 0;
  const flux = mmpa.transformation?.flux || 0;
  const balance = mmpa.alignment?.balance || 0;

  // Brightness
  if (brightness > config.brightnessMin) qualities.push(OPTICAL_QUALITIES.BRIGHT);
  if (brightness < 0.3) qualities.push(OPTICAL_QUALITIES.DARK);

  // Saturation
  if (saturation > config.saturationMin) qualities.push(OPTICAL_QUALITIES.SATURATED);
  if (saturation < 0.3) qualities.push(OPTICAL_QUALITIES.MUTED);

  // Edge definition
  if (edgeDensity > config.edgeDensityMin) qualities.push(OPTICAL_QUALITIES.SHARP);
  if (edgeDensity < 0.2) qualities.push(OPTICAL_QUALITIES.SOFT);

  // Complexity
  if (complexity > config.detailedComplexityMin) qualities.push(OPTICAL_QUALITIES.DETAILED);
  if (complexity < config.simpleComplexityMax) qualities.push(OPTICAL_QUALITIES.SIMPLE);

  // Balance
  if (balance > config.balanceMin) qualities.push(OPTICAL_QUALITIES.BALANCED);
  if (balance < 0.3) qualities.push(OPTICAL_QUALITIES.SCATTERED);

  // Stability
  if (flux < config.stableFluxMax) qualities.push(OPTICAL_QUALITIES.STABLE);
  if (flux > config.dynamicFluxMin) qualities.push(OPTICAL_QUALITIES.DYNAMIC);

  return qualities;
}

/**
 * Detect optical anomalies and generate alerts
 */
function detectOpticalAnomalies(mmpa, config) {
  const alerts = [];

  const brightness = mmpa.identity?.brightness || 0;
  const flux = mmpa.transformation?.flux || 0;
  const motion = mmpa.transformation?.velocity || 0;
  const entropy = mmpa.potential?.entropy || 0;

  // Sudden brightness spike
  if (brightness > 0.95) {
    alerts.push({
      type: 'BRIGHTNESS_SPIKE',
      severity: 'medium',
      message: `Very high brightness detected (${(brightness * 100).toFixed(0)}%)`,
      value: brightness
    });
  }

  // Near darkness
  if (brightness < 0.05) {
    alerts.push({
      type: 'NEAR_DARKNESS',
      severity: 'low',
      message: `Very low brightness (${(brightness * 100).toFixed(0)}%)`,
      value: brightness
    });
  }

  // Extreme flux (sudden change)
  if (flux > 0.8) {
    alerts.push({
      type: 'RAPID_VISUAL_CHANGE',
      severity: 'medium',
      message: `Rapid visual change detected (flux: ${flux.toFixed(2)})`,
      value: flux
    });
  }

  // Very fast motion
  if (motion > 0.9) {
    alerts.push({
      type: 'EXTREME_MOTION',
      severity: 'high',
      message: `Extreme motion detected (velocity: ${motion.toFixed(2)})`,
      value: motion
    });
  }

  // Visual chaos (high entropy + high flux)
  if (entropy > 0.8 && flux > 0.6) {
    alerts.push({
      type: 'VISUAL_CHAOS',
      severity: 'medium',
      message: `Chaotic visual pattern detected`,
      value: { entropy, flux }
    });
  }

  return alerts;
}

// ============================================================================
// FORCE INTERPRETATION (Optical-Specific Meanings)
// ============================================================================

function interpretIdentity(identity) {
  const brightness = identity?.brightness || 0;
  const hue = identity?.hue || 0;
  const saturation = identity?.saturation || 0;

  return {
    meaning: 'Visual appearance and color content',
    brightness: brightness,
    hue: hue,
    saturation: saturation,
    description: brightness > 0.7
      ? `Bright scene (${(hue * 360).toFixed(0)}° hue)`
      : brightness < 0.3
        ? 'Dark scene'
        : 'Moderate brightness'
  };
}

function interpretRelationship(relationship) {
  const harmony = relationship?.harmony || 0;
  const distribution = relationship?.distribution || 0;

  return {
    meaning: 'Color harmony and spatial relationships',
    harmony: harmony,
    distribution: distribution,
    description: harmony > 0.6
      ? 'Harmonious color palette'
      : harmony < 0.3
        ? 'Contrasting colors'
        : 'Mixed color scheme'
  };
}

function interpretComplexity(complexity) {
  const detail = complexity?.detail || 0;
  const edgeDensity = complexity?.edgeDensity || 0;
  const textureRichness = complexity?.textureRichness || 0;

  return {
    meaning: 'Visual detail and texture richness',
    detail: detail,
    edgeDensity: edgeDensity,
    textureRichness: textureRichness,
    description: detail > 0.6
      ? 'Highly detailed scene'
      : 'Simple or smooth scene'
  };
}

function interpretTransformation(transformation) {
  const flux = transformation?.flux || 0;
  const velocity = transformation?.velocity || 0;

  return {
    meaning: 'Rate of visual change and motion',
    flux: flux,
    velocity: velocity,
    description: velocity > 0.5
      ? 'Significant motion detected'
      : flux < 0.1
        ? 'Stable, static scene'
        : 'Subtle changes'
  };
}

function interpretAlignment(alignment) {
  const symmetry = alignment?.symmetry || 0;
  const balance = alignment?.balance || 0;

  return {
    meaning: 'Spatial organization and symmetry',
    symmetry: symmetry,
    balance: balance,
    description: symmetry > 0.7
      ? 'Highly symmetric composition'
      : 'Asymmetric or scattered'
  };
}

function interpretPotential(potential) {
  const entropy = potential?.entropy || 0;
  const unpredictability = potential?.unpredictability || 0;

  return {
    meaning: 'Visual unpredictability and emergence',
    entropy: entropy,
    unpredictability: unpredictability,
    description: entropy > 0.7
      ? 'Highly unpredictable visuals'
      : entropy < 0.3
        ? 'Highly regular patterns'
        : 'Moderately random'
  };
}

// ============================================================================
// VISUALIZATION HINTS
// ============================================================================

function generateVisualizationHints(mmpa) {
  const brightness = mmpa.identity?.brightness || 0;
  const hue = mmpa.identity?.hue || 0;
  const saturation = mmpa.identity?.saturation || 0;
  const flux = mmpa.transformation?.flux || 0;

  return {
    color: {
      hue: hue * 360,                      // 0-360 degrees
      saturation: saturation * 100,        // 0-100%
      lightness: 30 + (brightness * 50)    // Brighter with higher brightness
    },
    rotation: flux * Math.PI * 2,          // Rotation speed based on flux
    scale: 0.5 + (brightness * 1.5),       // Size based on brightness
    opacity: Math.max(0.2, brightness)     // Fade with darkness
  };
}

// ============================================================================
// SUMMARY GENERATION
// ============================================================================

function generateSummary(interpretation) {
  const pattern = interpretation.pattern.type;
  const confidence = (interpretation.pattern.confidence * 100).toFixed(0);
  const qualities = interpretation.qualities.join(', ');
  const alertCount = interpretation.alerts.length;

  let summary = `${pattern} (${confidence}% confidence)`;
  if (qualities.length > 0) {
    summary += ` - ${qualities}`;
  }
  if (alertCount > 0) {
    summary += ` [${alertCount} alert${alertCount > 1 ? 's' : ''}]`;
  }

  return summary;
}

// ============================================================================
// EXPORT DEFAULT RECIPE INSTANCE
// ============================================================================

export const opticalRecipe = createOpticalRecipe();

console.log("📷 Optical recipe ready - Visual pattern recognition enabled");
