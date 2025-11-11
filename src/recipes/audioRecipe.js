/**
 * 🎵 Audio Pattern Recognition Recipe
 *
 * First Concrete Recipe - Accessible Data Domain
 *
 * Demonstrates how MMPA universal forces map to audio-specific insights:
 * - Identity: What type of sound? (speech, music, noise, silence)
 * - Relationship: Harmonic structure (consonant, dissonant, rhythmic)
 * - Complexity: Spectral richness (simple tone, complex texture)
 * - Transformation: Rate of change (stable, evolving, chaotic)
 * - Alignment: Temporal coherence (synchronized, scattered)
 * - Potential: Predictability (periodic, unpredictable, emergent)
 *
 * This recipe uses existing audio MMPA features (extractAudioMMPAFeatures)
 * and interprets them for meaningful audio classification and anomaly detection.
 */

console.log("🎵 audioRecipe.js loading...");

import { MMPARecipe } from '../recipeEngine.js';

// ============================================================================
// AUDIO PATTERN CATEGORIES
// ============================================================================

const AUDIO_PATTERNS = {
  SILENCE: 'silence',
  TONE: 'tone',           // Pure tone or simple harmonic
  SPEECH: 'speech',       // Human voice patterns
  MUSIC: 'music',         // Musical content
  NOISE: 'noise',         // Random/chaotic
  RHYTHM: 'rhythm',       // Periodic patterns
  AMBIENT: 'ambient',     // Low-level background
  TRANSIENT: 'transient', // Sharp attack/decay
  DRONE: 'drone'          // Sustained tone
};

const AUDIO_QUALITIES = {
  CONSONANT: 'consonant',     // Harmonically aligned
  DISSONANT: 'dissonant',     // Harmonically tense
  BRIGHT: 'bright',           // High frequency content
  DARK: 'dark',               // Low frequency content
  RICH: 'rich',               // Complex spectrum
  SPARSE: 'sparse',           // Simple spectrum
  STABLE: 'stable',           // Low flux
  DYNAMIC: 'dynamic',         // High flux
  COHERENT: 'coherent',       // Low ZCR (tonal)
  SCATTERED: 'scattered'      // High ZCR (noisy)
};

// ============================================================================
// AUDIO-SPECIFIC THRESHOLDS
// ============================================================================

const DEFAULT_CONFIG = {
  // Identity thresholds
  silenceThreshold: 0.01,        // RMS below this = silence
  toneStrengthMin: 0.05,         // Min RMS for tone detection
  speechFluxRange: [0.15, 0.45], // Flux range for speech
  musicFluxRange: [0.05, 0.35],  // Flux range for music

  // Relationship thresholds
  consonanceMin: 0.6,            // Min consonance for "consonant"
  dissonanceMax: 0.3,            // Max consonance for "dissonant"

  // Complexity thresholds
  richComplexityMin: 0.5,        // Min complexity for "rich"
  sparseComplexityMax: 0.2,      // Max complexity for "sparse"

  // Transformation thresholds
  stableFluxMax: 0.1,            // Max flux for "stable"
  dynamicFluxMin: 0.4,           // Min flux for "dynamic"

  // Alignment thresholds
  coherenceMin: 0.7,             // Min coherence for "coherent"

  // Potential thresholds
  periodicEntropyMax: 0.3,       // Max entropy for periodic
  chaoticEntropyMin: 0.7         // Min entropy for chaotic
};

// ============================================================================
// AUDIO RECIPE IMPLEMENTATION
// ============================================================================

/**
 * Create audio pattern recognition recipe
 */
export function createAudioRecipe(customConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...customConfig };

  return new MMPARecipe({
    name: 'Audio Pattern Recognition',
    domain: 'audio',
    description: 'Interprets audio signals using MMPA forces for pattern classification',
    enabled: true,

    // Input adapter (not used - audio MMPA features already computed)
    inputAdapter: (rawAudio) => {
      // This would convert raw audio to signal format
      // But we rely on extractAudioMMPAFeatures happening externally
      return { signal: rawAudio, metadata: {} };
    },

    // Output interpreter: MMPA forces → Audio meaning
    outputInterpreter: (mmpa) => {
      const interpretation = {
        pattern: classifyAudioPattern(mmpa, config),
        qualities: extractAudioQualities(mmpa, config),
        alerts: detectAudioAnomalies(mmpa, config),
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
 * Classify primary audio pattern type
 */
function classifyAudioPattern(mmpa, config) {
  const strength = mmpa.identity?.strength || 0;
  const flux = mmpa.transformation?.flux || 0;
  const consonance = mmpa.relationship?.consonance || 0;
  const entropy = mmpa.potential?.entropy || 0;

  // Silence
  if (strength < config.silenceThreshold) {
    return {
      type: AUDIO_PATTERNS.SILENCE,
      confidence: 1.0 - strength / config.silenceThreshold
    };
  }

  // Pure tone
  if (strength > config.toneStrengthMin &&
      consonance > config.consonanceMin &&
      flux < config.stableFluxMax &&
      entropy < config.periodicEntropyMax) {
    return {
      type: AUDIO_PATTERNS.TONE,
      confidence: (consonance + (1 - flux)) / 2
    };
  }

  // Speech (moderate flux, mid consonance)
  if (flux >= config.speechFluxRange[0] &&
      flux <= config.speechFluxRange[1] &&
      consonance > 0.3) {
    return {
      type: AUDIO_PATTERNS.SPEECH,
      confidence: 0.7 // Moderate confidence (would need more features for certainty)
    };
  }

  // Music (moderate flux, higher consonance)
  if (flux >= config.musicFluxRange[0] &&
      flux <= config.musicFluxRange[1] &&
      consonance > config.consonanceMin) {
    return {
      type: AUDIO_PATTERNS.MUSIC,
      confidence: consonance
    };
  }

  // Rhythm (periodic with moderate flux)
  if (entropy < config.periodicEntropyMax &&
      flux > config.stableFluxMax) {
    return {
      type: AUDIO_PATTERNS.RHYTHM,
      confidence: 1.0 - entropy
    };
  }

  // Noise (high entropy, low consonance)
  if (entropy > config.chaoticEntropyMin &&
      consonance < config.dissonanceMax) {
    return {
      type: AUDIO_PATTERNS.NOISE,
      confidence: entropy
    };
  }

  // Drone (stable, sustained)
  if (flux < config.stableFluxMax && strength > 0.05) {
    return {
      type: AUDIO_PATTERNS.DRONE,
      confidence: 1.0 - flux
    };
  }

  // Ambient (low level, varying)
  if (strength < 0.05 && strength > config.silenceThreshold) {
    return {
      type: AUDIO_PATTERNS.AMBIENT,
      confidence: 0.6
    };
  }

  // Default: Unknown
  return {
    type: 'unknown',
    confidence: 0.0
  };
}

/**
 * Extract audio quality descriptors
 */
function extractAudioQualities(mmpa, config) {
  const qualities = [];

  const consonance = mmpa.relationship?.consonance || 0;
  const complexity = mmpa.complexity?.brightness || 0;
  const flux = mmpa.transformation?.flux || 0;
  const coherence = mmpa.alignment?.coherence || 0;
  const centroid = mmpa.complexity?.centroid || 0;

  // Consonance/Dissonance
  if (consonance > config.consonanceMin) qualities.push(AUDIO_QUALITIES.CONSONANT);
  if (consonance < config.dissonanceMax) qualities.push(AUDIO_QUALITIES.DISSONANT);

  // Brightness
  if (centroid > 2000) qualities.push(AUDIO_QUALITIES.BRIGHT);
  if (centroid < 1000) qualities.push(AUDIO_QUALITIES.DARK);

  // Complexity
  if (complexity > config.richComplexityMin) qualities.push(AUDIO_QUALITIES.RICH);
  if (complexity < config.sparseComplexityMax) qualities.push(AUDIO_QUALITIES.SPARSE);

  // Stability
  if (flux < config.stableFluxMax) qualities.push(AUDIO_QUALITIES.STABLE);
  if (flux > config.dynamicFluxMin) qualities.push(AUDIO_QUALITIES.DYNAMIC);

  // Coherence
  if (coherence > config.coherenceMin) qualities.push(AUDIO_QUALITIES.COHERENT);
  if (coherence < 0.3) qualities.push(AUDIO_QUALITIES.SCATTERED);

  return qualities;
}

/**
 * Detect audio anomalies and generate alerts
 */
function detectAudioAnomalies(mmpa, config) {
  const alerts = [];

  const strength = mmpa.identity?.strength || 0;
  const flux = mmpa.transformation?.flux || 0;
  const consonance = mmpa.relationship?.consonance || 0;
  const entropy = mmpa.potential?.entropy || 0;

  // Sudden spike in level
  if (strength > 0.9) {
    alerts.push({
      type: 'LEVEL_SPIKE',
      severity: 'high',
      message: `Very high signal level detected (${(strength * 100).toFixed(0)}%)`,
      value: strength
    });
  }

  // Extreme flux (sudden change)
  if (flux > 0.8) {
    alerts.push({
      type: 'RAPID_CHANGE',
      severity: 'medium',
      message: `Rapid spectral change detected (flux: ${flux.toFixed(2)})`,
      value: flux
    });
  }

  // Extreme dissonance
  if (consonance < 0.1) {
    alerts.push({
      type: 'DISSONANCE',
      severity: 'low',
      message: `Highly dissonant signal (consonance: ${consonance.toFixed(2)})`,
      value: consonance
    });
  }

  // Chaos (high entropy + high flux)
  if (entropy > 0.8 && flux > 0.6) {
    alerts.push({
      type: 'CHAOTIC_SIGNAL',
      severity: 'medium',
      message: `Chaotic signal pattern detected`,
      value: { entropy, flux }
    });
  }

  return alerts;
}

// ============================================================================
// FORCE INTERPRETATION (Audio-Specific Meanings)
// ============================================================================

function interpretIdentity(identity) {
  const strength = identity?.strength || 0;
  const pitch = identity?.pitch || 0;
  const fundamentalFreq = identity?.fundamentalFreq || 0;

  return {
    meaning: 'Signal presence and pitch content',
    strength: strength,
    pitch: pitch,
    fundamentalFreq: fundamentalFreq,
    description: strength > 0.05
      ? `Strong signal at ${fundamentalFreq.toFixed(0)}Hz`
      : 'Weak or absent signal'
  };
}

function interpretRelationship(relationship) {
  const consonance = relationship?.consonance || 0;
  const complexity = relationship?.complexity || 0;

  return {
    meaning: 'Harmonic alignment and structure',
    consonance: consonance,
    complexity: complexity,
    description: consonance > 0.6
      ? 'Harmonically consonant'
      : consonance < 0.3
        ? 'Harmonically dissonant'
        : 'Moderately harmonic'
  };
}

function interpretComplexity(complexity) {
  const centroid = complexity?.centroid || 0;
  const bandwidth = complexity?.bandwidth || 0;
  const brightness = complexity?.brightness || 0;

  return {
    meaning: 'Spectral richness and distribution',
    centroid: centroid,
    bandwidth: bandwidth,
    brightness: brightness,
    description: brightness > 0.6
      ? 'Rich, bright spectrum'
      : 'Dark or simple spectrum'
  };
}

function interpretTransformation(transformation) {
  const flux = transformation?.flux || 0;
  const velocity = transformation?.velocity || 0;

  return {
    meaning: 'Rate of spectral change',
    flux: flux,
    velocity: velocity,
    description: flux > 0.5
      ? 'Rapidly evolving'
      : flux < 0.1
        ? 'Stable and steady'
        : 'Moderate variation'
  };
}

function interpretAlignment(alignment) {
  const coherence = alignment?.coherence || 0;
  const stability = alignment?.stability || 0;

  return {
    meaning: 'Temporal coherence and tonality',
    coherence: coherence,
    stability: stability,
    description: coherence > 0.7
      ? 'Highly tonal and coherent'
      : 'Noisy or scattered'
  };
}

function interpretPotential(potential) {
  const entropy = potential?.entropy || 0;
  const unpredictability = potential?.unpredictability || 0;

  return {
    meaning: 'Unpredictability and emergence',
    entropy: entropy,
    unpredictability: unpredictability,
    description: entropy > 0.7
      ? 'Highly unpredictable'
      : entropy < 0.3
        ? 'Highly periodic'
        : 'Moderately random'
  };
}

// ============================================================================
// VISUALIZATION HINTS
// ============================================================================

function generateVisualizationHints(mmpa) {
  const flux = mmpa.transformation?.flux || 0;
  const consonance = mmpa.relationship?.consonance || 0;
  const strength = mmpa.identity?.strength || 0;

  return {
    color: {
      hue: consonance * 120,        // 0=red (dissonant), 120=green (consonant)
      saturation: flux * 100,        // Higher flux = more saturated
      lightness: 30 + (strength * 50) // Brighter with higher strength
    },
    rotation: flux * Math.PI * 2,    // Rotation speed based on flux
    scale: 0.5 + (strength * 1.5),   // Size based on strength
    opacity: Math.max(0.2, strength) // Fade with weak signals
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

export const audioRecipe = createAudioRecipe();

console.log("🎵 Audio recipe ready - Pattern recognition enabled");
