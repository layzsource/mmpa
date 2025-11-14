/**
 * Unit Tests for state.js
 *
 * Tests core state management functions:
 * - Morph weight normalization
 * - Color utilities
 * - Interpolation helpers
 * - Audio gate
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  state,
  normalizeMorphWeights,
  setMorphWeight,
  setMorphWeights,
  getMorphWeights,
  setColor,
  setHue,
  hexToRGB,
  rgbToHex,
  blendColors,
  lerp,
  lerpColor,
  lerpArray,
  easeInOutCubic,
  resetToBaseline,
  getEffectiveAudio
} from '../src/state.js';

describe('state.js - Morph Weight Management', () => {
  beforeEach(() => {
    // Reset morph weights before each test
    state.morphWeights = {
      cube: 1.0,
      sphere: 0.0,
      pyramid: 0.0,
      torus: 0.0
    };
  });

  it('should normalize weights when sum exceeds 1.0', () => {
    state.morphWeights = {
      cube: 0.5,
      sphere: 0.5,
      pyramid: 0.5,
      torus: 0.5
    };

    normalizeMorphWeights();

    const sum = Object.values(state.morphWeights).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1.0, 5);
  });

  it('should not modify weights when sum is less than 1.0', () => {
    state.morphWeights = {
      cube: 0.3,
      sphere: 0.2,
      pyramid: 0.1,
      torus: 0.1
    };

    const before = { ...state.morphWeights };
    normalizeMorphWeights();

    expect(state.morphWeights).toEqual(before);
  });

  it('should set individual morph weight', () => {
    state.audioReactive = true;

    // Start with lower weights so we don't trigger normalization
    state.morphWeights = {
      cube: 0.2,
      sphere: 0.0,
      pyramid: 0.0,
      torus: 0.0
    };

    setMorphWeight('sphere', 0.7);

    expect(state.morphWeights.sphere).toBeCloseTo(0.7, 5);
  });

  it('should clamp weight values to [0, 1]', () => {
    state.audioReactive = true;

    // Start with all weights at 0 to avoid normalization
    state.morphWeights = {
      cube: 0.0,
      sphere: 0.0,
      pyramid: 0.0,
      torus: 0.0
    };

    setMorphWeight('sphere', 1.5);
    expect(state.morphWeights.sphere).toBe(1.0); // Clamped to 1.0

    setMorphWeight('cube', -0.5);
    expect(state.morphWeights.cube).toBe(0.0); // Clamped to 0.0
  });

  it('should not update weights when audio is off (frozen)', () => {
    state.audioReactive = false;
    state.morphWeights.cube = 1.0;

    setMorphWeight('cube', 0.5);

    expect(state.morphWeights.cube).toBe(1.0); // Should stay frozen
  });

  it('should set all morph weights at once', () => {
    state.audioReactive = true;

    setMorphWeights({
      cube: 0.25,
      sphere: 0.25,
      pyramid: 0.25,
      torus: 0.25
    });

    expect(state.morphWeights.cube).toBe(0.25);
    expect(state.morphWeights.sphere).toBe(0.25);
    expect(state.morphWeights.pyramid).toBe(0.25);
    expect(state.morphWeights.torus).toBe(0.25);
  });

  it('should get morph weights as copy', () => {
    const weights = getMorphWeights();

    weights.cube = 0.5;

    expect(state.morphWeights.cube).toBe(1.0); // Original unchanged
  });
});

describe('state.js - Color Utilities', () => {
  it('should convert hex to RGB', () => {
    const rgb = hexToRGB('#ff0000');
    expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('should convert RGB to hex', () => {
    const hex = rgbToHex({ r: 255, g: 0, b: 0 });
    expect(hex).toBe('#ff0000');
  });

  it('should clamp RGB values', () => {
    const hex = rgbToHex({ r: 300, g: -50, b: 128 });
    expect(hex).toBe('#ff0080');
  });

  it('should blend colors additively', () => {
    const base = '#000000';
    const audio = '#ff0000';

    const blended = blendColors(base, audio, 0.5, 1.0);
    // Should be 50% red contribution
    const rgb = hexToRGB(blended);

    expect(rgb.r).toBeGreaterThan(0);
    expect(rgb.g).toBe(0);
    expect(rgb.b).toBe(0);
  });

  it('should set color and update hue', () => {
    setColor('#ff0000');

    expect(state.color).toBe('#ff0000');
    expect(state.hue).toBe(0); // Red is 0 degrees
  });

  it('should set hue and update color', () => {
    setHue(120); // Green

    expect(state.hue).toBe(120);
    expect(state.color).toBe('#00ff00');
  });

  it('should wrap hue to 0-360 range', () => {
    setHue(480); // 480 % 360 = 120

    expect(state.hue).toBe(120);
  });
});

describe('state.js - Interpolation Helpers', () => {
  it('should lerp between two values', () => {
    expect(lerp(0, 10, 0.0)).toBe(0);
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(0, 10, 1.0)).toBe(10);
  });

  it('should lerp between colors', () => {
    const color = lerpColor('#000000', '#ffffff', 0.5);
    const rgb = hexToRGB(color);

    // RGB values are rounded to integers, so 127.5 becomes 128
    expect(rgb.r).toBeCloseTo(128, 1);
    expect(rgb.g).toBeCloseTo(128, 1);
    expect(rgb.b).toBeCloseTo(128, 1);
  });

  it('should lerp between arrays', () => {
    const a = [0, 0, 0, 0];
    const b = [1, 1, 1, 1];

    const result = lerpArray(a, b, 0.5);

    expect(result).toEqual([0.5, 0.5, 0.5, 0.5]);
  });

  it('should handle mismatched array lengths', () => {
    const a = [0, 0];
    const b = [1, 1, 1, 1];

    const result = lerpArray(a, b, 0.5);

    expect(result.length).toBe(2); // Returns length of first array
  });

  it('should apply ease-in-out cubic', () => {
    expect(easeInOutCubic(0.0)).toBe(0.0);
    expect(easeInOutCubic(0.5)).toBe(0.5);
    expect(easeInOutCubic(1.0)).toBe(1.0);

    // Should ease in (accelerate) at start
    expect(easeInOutCubic(0.25)).toBeLessThan(0.25);

    // Should ease out (decelerate) at end
    expect(easeInOutCubic(0.75)).toBeGreaterThan(0.75);
  });
});

describe('state.js - Audio Gate', () => {
  beforeEach(() => {
    state.audio = {
      bass: 0.5,
      mid: 0.6,
      treble: 0.7,
      level: 0.6
    };
  });

  it('should return audio values when reactive is enabled', () => {
    state.audioReactive = true;

    const audio = getEffectiveAudio();

    expect(audio.bass).toBe(0.5);
    expect(audio.mid).toBe(0.6);
    expect(audio.treble).toBe(0.7);
  });

  it('should return zeros when reactive is disabled', () => {
    state.audioReactive = false;

    const audio = getEffectiveAudio();

    expect(audio.bass).toBe(0);
    expect(audio.mid).toBe(0);
    expect(audio.treble).toBe(0);
    expect(audio.level).toBe(0);
  });

  it('should handle missing audio object', () => {
    state.audioReactive = true;
    state.audio = null;

    const audio = getEffectiveAudio();

    expect(audio.bass).toBe(0);
    expect(audio.mid).toBe(0);
    expect(audio.treble).toBe(0);
  });

  it('should handle NaN audio values', () => {
    state.audioReactive = true;
    state.audio = {
      bass: NaN,
      mid: NaN,
      treble: NaN
    };

    const audio = getEffectiveAudio();

    expect(audio.bass).toBe(0);
    expect(audio.mid).toBe(0);
    expect(audio.treble).toBe(0);
  });

  it('should use fallback for level', () => {
    state.audioReactive = true;
    state.audio = {
      bass: 0.3,
      mid: 0.6,
      treble: 0.9
      // level missing
    };

    const audio = getEffectiveAudio();

    // Level should be average of bands
    expect(audio.level).toBeCloseTo((0.3 + 0.6 + 0.9) / 3, 5);
  });
});

describe('state.js - Reset to Baseline', () => {
  it('should reset transform values', () => {
    state.rotationX = 0.5;
    state.rotationY = 0.3;
    state.scale = 1.5;

    resetToBaseline();

    expect(state.rotationX).toBe(0);
    expect(state.rotationY).toBe(0);
    expect(state.scale).toBe(1.0);
  });

  it('should reset morph weights to cube', () => {
    state.morphBaseWeights = [1, 0, 0, 0]; // All sphere

    resetToBaseline();

    // Should reset to [0, 1, 0, 0] (cube)
    expect(state.morphBaseWeights[0]).toBe(0.0); // sphere
    expect(state.morphBaseWeights[1]).toBe(1.0); // cube
    expect(state.morphBaseWeights[2]).toBe(0.0); // pyramid
    expect(state.morphBaseWeights[3]).toBe(0.0); // torus
  });

  it('should stop active interpolation', () => {
    state.interpolation.active = true;

    resetToBaseline();

    expect(state.interpolation.active).toBe(false);
  });
});
