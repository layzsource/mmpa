/**
 * Unit Tests for mappingLayer.js
 *
 * Tests the bridge between MMPA features and visual parameters:
 * - NaN protection (the particle motion bug fix)
 * - Feature-to-visual mapping for all 6 categories
 * - HSB to RGB color conversion
 * - Easing functions
 * - Composite parameter calculations
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mapFeaturesToVisuals, ease } from '../src/mappingLayer.js';

describe('mappingLayer.js - Feature Disabled', () => {
  it('should return null when features are null', () => {
    const result = mapFeaturesToVisuals(null);
    expect(result).toBeNull();
  });

  it('should return null when features.enabled is false', () => {
    const features = {
      enabled: false,
      identity: {},
      relationship: {},
      complexity: {},
      transformation: {},
      alignment: {},
      potential: {}
    };

    const result = mapFeaturesToVisuals(features);
    expect(result).toBeNull();
  });

  it('should return null when features object is missing enabled flag', () => {
    const features = {
      identity: {},
      relationship: {}
    };

    const result = mapFeaturesToVisuals(features);
    expect(result).toBeNull();
  });
});

describe('mappingLayer.js - NaN Protection (Motion Bug Fix)', () => {
  /**
   * CRITICAL: This tests the bug fix for particles moving before audio starts.
   * When audio is silent or not yet started, Meyda returns NaN for many features.
   * The mapping layer must default motion-related parameters to 0, not non-zero values.
   */

  it('should default motion parameters to 0 when transformation features are NaN', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: {
        flux: NaN,
        velocity: NaN,
        acceleration: NaN
      },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    // Motion parameters should be 0 when NaN (silent audio)
    expect(visual.motionVelocity).toBe(0);
    expect(visual.turbulence).toBe(0);
    expect(visual.dynamicIntensity).toBe(0);

    // Animation speed has a base of 0.5, so with flux=0: 0.5 + 0*1.5 = 0.5
    expect(visual.animationSpeed).toBe(0.5);
  });

  it('should default chaos parameters to 0 when potential features are NaN', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: {
        entropy: NaN,
        unpredictability: NaN,
        freedom: NaN
      }
    };

    const visual = mapFeaturesToVisuals(features);

    // Chaos parameters should be 0 when NaN (silent audio)
    expect(visual.particleRandomness).toBe(0);
    expect(visual.noiseAmplitude).toBe(0);
    expect(visual.variationRate).toBe(0);
    expect(visual.constraintRelaxation).toBe(0);
    expect(visual.overallChaos).toBe(0);
  });

  it('should default identity strength to 0 when NaN', () => {
    const features = {
      enabled: true,
      identity: {
        fundamentalFreq: 440,
        strength: NaN
      },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    expect(visual.colorIntensity).toBe(0);
    // Brightness should be 0.5 + 0*0.5 = 0.5 with strength=0
  });

  it('should default complexity brightness to 0 when NaN', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: {
        centroid: 1500,
        bandwidth: 2000,
        brightness: NaN
      },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    // Particle density should be 0.8 + 0*0.2 = 0.8 when brightness=0
    expect(visual.particleDensity).toBe(0.8);
  });

  it('should handle completely silent audio (all NaN)', () => {
    const features = {
      enabled: true,
      identity: {
        fundamentalFreq: NaN,
        strength: NaN
      },
      relationship: {
        consonance: NaN,
        complexity: NaN
      },
      complexity: {
        centroid: NaN,
        bandwidth: NaN,
        brightness: NaN
      },
      transformation: {
        flux: NaN,
        velocity: NaN,
        acceleration: NaN
      },
      alignment: {
        coherence: NaN,
        stability: NaN,
        synchrony: NaN
      },
      potential: {
        entropy: NaN,
        unpredictability: NaN,
        freedom: NaN
      }
    };

    const visual = mapFeaturesToVisuals(features);

    // Should not throw errors and should return valid object
    expect(visual).toBeTruthy();

    // Motion should be 0
    expect(visual.motionVelocity).toBe(0);
    expect(visual.turbulence).toBe(0);
    expect(visual.dynamicIntensity).toBe(0);

    // Chaos should be 0
    expect(visual.particleRandomness).toBe(0);
    expect(visual.overallChaos).toBe(0);

    // Should have valid color (defaults to 440Hz reference)
    expect(visual.coreColor).toBeDefined();
    expect(visual.coreColor.length).toBe(3);
  });
});

describe('mappingLayer.js - Identity → Color Mapping', () => {
  it('should map fundamental frequency to hue', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.8 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    expect(visual.hue).toBeGreaterThanOrEqual(0);
    expect(visual.hue).toBeLessThanOrEqual(360);
    expect(visual.colorIntensity).toBe(0.8);
  });

  it('should produce valid RGB color from HSB conversion', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.8 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    expect(visual.coreColor).toBeDefined();
    expect(visual.coreColor.length).toBe(3);

    // RGB values should be in 0-1 range
    for (const value of visual.coreColor) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it('should handle low frequencies (bass)', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 40, strength: 0.8 }, // Low bass
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    expect(visual.hue).toBeGreaterThanOrEqual(0);
    expect(visual.coreColor).toBeDefined();
  });

  it('should handle high frequencies (treble)', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 8000, strength: 0.8 }, // High treble
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    expect(visual.hue).toBeGreaterThanOrEqual(0);
    expect(visual.hue).toBeLessThanOrEqual(360);
  });
});

describe('mappingLayer.js - Relationship → Harmony Mapping', () => {
  it('should map consonance to geometric symmetry', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.9, complexity: 2 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    expect(visual.geometricSymmetry).toBe(0.9);
    expect(visual.patternComplexity).toBe(0.2); // complexity 2 / 10 = 0.2
  });

  it('should calculate harmonic order from consonance and complexity', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.8, complexity: 4 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    // harmonicOrder = consonance * (1 - complexity/20)
    // = 0.8 * (1 - 4/20) = 0.8 * 0.8 = 0.64
    expect(visual.harmonicOrder).toBeCloseTo(0.64, 5);
  });
});

describe('mappingLayer.js - Complexity → Density Mapping', () => {
  it('should map spectral brightness to particle density', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 1.0 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    // particleDensity = 0.8 + brightness * 0.2
    // = 0.8 + 1.0 * 0.2 = 1.0
    expect(visual.particleDensity).toBe(1.0);
  });

  it('should map bandwidth to particle spread', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 5000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    // particleSpread = bandwidth / 10000
    // = 5000 / 10000 = 0.5
    expect(visual.particleSpread).toBe(0.5);
  });

  it('should map centroid to spatial elevation', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    // Should be logarithmically mapped
    expect(visual.spatialElevation).toBeGreaterThanOrEqual(0);
    expect(visual.spatialElevation).toBeLessThanOrEqual(1);
  });
});

describe('mappingLayer.js - Transformation → Motion Mapping', () => {
  it('should map flux to animation speed', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.8, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    // animationSpeed = 0.5 + flux * 1.5
    // = 0.5 + 0.8 * 1.5 = 0.5 + 1.2 = 1.7
    expect(visual.animationSpeed).toBeCloseTo(1.7, 5);
  });

  it('should map velocity to motion velocity', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.6, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    expect(visual.motionVelocity).toBe(0.6);
  });

  it('should map acceleration to turbulence', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.4 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    expect(visual.turbulence).toBe(0.4);
  });

  it('should calculate dynamic intensity from all transformation features', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.6, velocity: 0.3, acceleration: 0.3 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    // dynamicIntensity = (flux + velocity + acceleration) / 3
    // = (0.6 + 0.3 + 0.3) / 3 = 0.4
    expect(visual.dynamicIntensity).toBeCloseTo(0.4, 5);
  });
});

describe('mappingLayer.js - Alignment → Stability Mapping', () => {
  it('should map coherence to visual clarity', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.95, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    expect(visual.visualClarity).toBe(0.95);
  });

  it('should map stability to form stability', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.85, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    expect(visual.formStability).toBe(0.85);
  });

  it('should calculate overall alignment', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.9, stability: 0.6, synchrony: 0.9 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    // overallAlignment = (coherence + stability + synchrony) / 3
    // = (0.9 + 0.6 + 0.9) / 3 = 0.8
    expect(visual.overallAlignment).toBeCloseTo(0.8, 5);
  });
});

describe('mappingLayer.js - Potential → Chaos Mapping', () => {
  it('should map entropy to particle randomness', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.7, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    expect(visual.particleRandomness).toBe(0.7);
    expect(visual.noiseAmplitude).toBe(0.7);
  });

  it('should map unpredictability to variation rate', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.6, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    expect(visual.variationRate).toBe(0.6);
  });

  it('should map freedom to constraint relaxation', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.8 }
    };

    const visual = mapFeaturesToVisuals(features);

    expect(visual.constraintRelaxation).toBe(0.8);
  });

  it('should calculate overall chaos', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.6, unpredictability: 0.3, freedom: 0.6 }
    };

    const visual = mapFeaturesToVisuals(features);

    // overallChaos = (entropy + unpredictability + freedom) / 3
    // = (0.6 + 0.3 + 0.6) / 3 = 0.5
    expect(visual.overallChaos).toBe(0.5);
  });
});

describe('mappingLayer.js - Composite Parameters', () => {
  it('should calculate energy from strength, flux, and brightness', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.9 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.6 },
      transformation: { flux: 0.6, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    // energy = (strength + flux + brightness) / 3
    // = (0.9 + 0.6 + 0.6) / 3 = 0.7
    expect(visual.energy).toBeCloseTo(0.7, 5);
  });

  it('should calculate focus from coherence and entropy', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.9, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.2, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    // focus = coherence * (1 - entropy)
    // = 0.9 * (1 - 0.2) = 0.9 * 0.8 = 0.72
    expect(visual.focus).toBeCloseTo(0.72, 5);
  });

  it('should calculate excitement from velocity and brightness', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.7, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.8 },
      transformation: { flux: 0.5, velocity: 0.6, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.7, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    // excitement = (velocity + brightness) / 2
    // = (0.6 + 0.8) / 2 = 0.7
    expect(visual.excitement).toBe(0.7);
  });

  it('should calculate calm from stability and consonance', () => {
    const features = {
      enabled: true,
      identity: { fundamentalFreq: 440, strength: 0.5 },
      relationship: { consonance: 0.9, complexity: 3 },
      complexity: { centroid: 1500, bandwidth: 2000, brightness: 0.5 },
      transformation: { flux: 0.5, velocity: 0.3, acceleration: 0.1 },
      alignment: { coherence: 0.8, stability: 0.8, synchrony: 0.8 },
      potential: { entropy: 0.3, unpredictability: 0.2, freedom: 0.4 }
    };

    const visual = mapFeaturesToVisuals(features);

    // calm = (stability + consonance) / 2
    // = (0.8 + 0.9) / 2 = 0.85
    expect(visual.calm).toBeCloseTo(0.85, 5);
  });
});

describe('mappingLayer.js - Easing Functions', () => {
  it('should apply linear easing', () => {
    expect(ease(0, 'linear')).toBe(0);
    expect(ease(0.5, 'linear')).toBe(0.5);
    expect(ease(1, 'linear')).toBe(1);
  });

  it('should apply ease-in (quadratic)', () => {
    expect(ease(0, 'ease-in')).toBe(0);
    expect(ease(0.5, 'ease-in')).toBe(0.25); // 0.5^2 = 0.25
    expect(ease(1, 'ease-in')).toBe(1);
  });

  it('should apply ease-out (quadratic)', () => {
    expect(ease(0, 'ease-out')).toBe(0);
    expect(ease(1, 'ease-out')).toBe(1);

    // ease-out should be steeper at start than linear
    expect(ease(0.5, 'ease-out')).toBeGreaterThan(0.5);
  });

  it('should apply ease-in-out (cubic)', () => {
    expect(ease(0, 'ease-in-out')).toBe(0);
    expect(ease(0.5, 'ease-in-out')).toBe(0.5);
    expect(ease(1, 'ease-in-out')).toBe(1);

    // Should accelerate in first half
    expect(ease(0.25, 'ease-in-out')).toBeLessThan(0.25);

    // Should decelerate in second half
    expect(ease(0.75, 'ease-in-out')).toBeGreaterThan(0.75);
  });

  it('should default to linear when curve not recognized', () => {
    expect(ease(0.5, 'unknown')).toBe(0.5);
    expect(ease(0.5)).toBe(0.5); // No curve parameter
  });

  it('should clamp easing output to 0-1 range', () => {
    // All curves should produce values in 0-1 range
    const curves = ['linear', 'ease-in', 'ease-out', 'ease-in-out'];
    const testValues = [0, 0.25, 0.5, 0.75, 1];

    for (const curve of curves) {
      for (const value of testValues) {
        const result = ease(value, curve);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
      }
    }
  });
});
