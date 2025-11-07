// MMPA Synth Preset Library
// Validation test bank + musical/DAW-ready presets

export const SYNTH_PRESETS = {
  // ===== VALIDATION TEST BANK =====
  // Controlled test signals for MMPA domain validation

  validation: {
    // Test 1: Pure Sine Wave (Control)
    'Pure Sine 440Hz': {
      category: 'validation',
      description: 'Control test - single frequency sine wave. Expected: High stability, PERFECT_FIFTH archetype.',
      note: 440, // A4
      params: {
        oscType: 'sine',
        detune: 0,
        octave: 0,
        attack: 0.001,
        decay: 0,
        sustain: 1.0,
        release: 0.001,
        filterType: 'none',
        filterFreq: 20000,
        filterQ: 1,
        filterEnvAmount: 0,
        lfoRate: 0,
        lfoAmount: 0,
        lfoTarget: 'pitch',
        lfoWaveform: 'sine',
        reverbMix: 0,
        delayTime: 0,
        delayFeedback: 0,
        delayMix: 0,
        distortion: 0,
        glide: 0,
        volume: 0.5
      }
    },

    // Test 2: White Noise (Chaos)
    'White Noise': {
      category: 'validation',
      description: 'Chaos test - random noise. Expected: Low stability, high flux, mixed archetypes.',
      note: null, // No specific pitch
      params: {
        oscType: 'noise',
        detune: 0,
        octave: 0,
        attack: 0.001,
        decay: 0,
        sustain: 1.0,
        release: 0.001,
        filterType: 'none',
        filterFreq: 20000,
        filterQ: 1,
        filterEnvAmount: 0,
        lfoRate: 0,
        lfoAmount: 0,
        lfoTarget: 'pitch',
        lfoWaveform: 'sine',
        reverbMix: 0,
        delayTime: 0,
        delayFeedback: 0,
        delayMix: 0,
        distortion: 0,
        glide: 0,
        volume: 0.3
      }
    },

    // Test 3: Rhythmic Pulse (Beats)
    'Rhythmic Pulse 120 BPM': {
      category: 'validation',
      description: 'Rhythmic test - pulsing clicks. Expected: WOLF_FIFTH patterns, periodic flux spikes.',
      note: 440,
      params: {
        oscType: 'square',
        detune: 0,
        octave: 0,
        attack: 0.001,
        decay: 0.05,
        sustain: 0.0,
        release: 0.001,
        filterType: 'highpass',
        filterFreq: 1000,
        filterQ: 5,
        filterEnvAmount: 0,
        lfoRate: 2, // 120 BPM
        lfoAmount: 1,
        lfoTarget: 'amplitude',
        lfoWaveform: 'square',
        reverbMix: 0,
        delayTime: 0,
        delayFeedback: 0,
        delayMix: 0,
        distortion: 0,
        glide: 0,
        volume: 0.4
      }
    },

    // Test 4: Harmonic Drone (Stability)
    'Harmonic Drone C Major': {
      category: 'validation',
      description: 'Harmonic stability test - stacked perfect fifths. Expected: High stability, PERFECT_FIFTH.',
      note: 261.63, // C4
      params: {
        oscType: 'sine',
        detune: 0,
        octave: 0,
        attack: 2.0,
        decay: 0.5,
        sustain: 0.8,
        release: 2.0,
        filterType: 'lowpass',
        filterFreq: 800,
        filterQ: 1,
        filterEnvAmount: 0,
        lfoRate: 0.1,
        lfoAmount: 5,
        lfoTarget: 'filter',
        lfoWaveform: 'sine',
        reverbMix: 0.3,
        delayTime: 0,
        delayFeedback: 0,
        delayMix: 0,
        distortion: 0,
        glide: 0,
        volume: 0.4
      }
    },

    // Test 5: Random Walk (Transitions)
    'Random Walk': {
      category: 'validation',
      description: 'Transition test - evolving timbre. Expected: Frequent archetype transitions, variable stability.',
      note: 220,
      params: {
        oscType: 'sawtooth',
        detune: 0,
        octave: 0,
        attack: 0.5,
        decay: 0.3,
        sustain: 0.6,
        release: 0.8,
        filterType: 'lowpass',
        filterFreq: 1200,
        filterQ: 3,
        filterEnvAmount: 2000,
        lfoRate: 0.3,
        lfoAmount: 500,
        lfoTarget: 'filter',
        lfoWaveform: 'sine',
        reverbMix: 0.2,
        delayTime: 0.3,
        delayFeedback: 0.4,
        delayMix: 0.2,
        distortion: 0,
        glide: 0.5,
        volume: 0.5
      }
    }
  },

  // ===== MUSICAL / DAW PRESETS =====
  // Production-ready synth patches

  bass: {
    'Sub Bass': {
      category: 'bass',
      description: 'Deep sub bass for low-end foundation',
      note: 55, // A1
      params: {
        oscType: 'sine',
        detune: 0,
        octave: -1,
        attack: 0.01,
        decay: 0.2,
        sustain: 0.7,
        release: 0.3,
        filterType: 'lowpass',
        filterFreq: 200,
        filterQ: 2,
        filterEnvAmount: 100,
        lfoRate: 0,
        lfoAmount: 0,
        lfoTarget: 'pitch',
        lfoWaveform: 'sine',
        reverbMix: 0,
        delayTime: 0,
        delayFeedback: 0,
        delayMix: 0,
        distortion: 0.1,
        glide: 0.05,
        volume: 0.8
      }
    },

    'Acid Bass': {
      category: 'bass',
      description: '303-style acid bass line',
      note: 110,
      params: {
        oscType: 'sawtooth',
        detune: 0,
        octave: -1,
        attack: 0.001,
        decay: 0.1,
        sustain: 0.3,
        release: 0.1,
        filterType: 'lowpass',
        filterFreq: 800,
        filterQ: 15,
        filterEnvAmount: 3000,
        lfoRate: 0,
        lfoAmount: 0,
        lfoTarget: 'pitch',
        lfoWaveform: 'sine',
        reverbMix: 0,
        delayTime: 0,
        delayFeedback: 0,
        delayMix: 0,
        distortion: 0.3,
        glide: 0.02,
        volume: 0.7
      }
    }
  },

  lead: {
    'Supersaw Lead': {
      category: 'lead',
      description: 'EDM supersaw lead synth',
      note: 440,
      params: {
        oscType: 'sawtooth',
        detune: 15,
        octave: 0,
        attack: 0.05,
        decay: 0.3,
        sustain: 0.6,
        release: 0.5,
        filterType: 'lowpass',
        filterFreq: 2000,
        filterQ: 2,
        filterEnvAmount: 1500,
        lfoRate: 5,
        lfoAmount: 10,
        lfoTarget: 'pitch',
        lfoWaveform: 'sine',
        reverbMix: 0.3,
        delayTime: 0.25,
        delayFeedback: 0.3,
        delayMix: 0.2,
        distortion: 0.1,
        glide: 0.1,
        volume: 0.6
      }
    },

    'Pluck Lead': {
      category: 'lead',
      description: 'Sharp pluck lead for melodies',
      note: 880,
      params: {
        oscType: 'triangle',
        detune: 0,
        octave: 1,
        attack: 0.001,
        decay: 0.15,
        sustain: 0.2,
        release: 0.1,
        filterType: 'lowpass',
        filterFreq: 3000,
        filterQ: 3,
        filterEnvAmount: 2000,
        lfoRate: 0,
        lfoAmount: 0,
        lfoTarget: 'pitch',
        lfoWaveform: 'sine',
        reverbMix: 0.2,
        delayTime: 0.375,
        delayFeedback: 0.25,
        delayMix: 0.15,
        distortion: 0,
        glide: 0,
        volume: 0.6
      }
    }
  },

  pad: {
    'Ambient Pad': {
      category: 'pad',
      description: 'Lush ambient pad for atmospheres',
      note: 220,
      params: {
        oscType: 'sawtooth',
        detune: 10,
        octave: 0,
        attack: 2.0,
        decay: 1.0,
        sustain: 0.7,
        release: 3.0,
        filterType: 'lowpass',
        filterFreq: 1500,
        filterQ: 1,
        filterEnvAmount: 300,
        lfoRate: 0.2,
        lfoAmount: 20,
        lfoTarget: 'filter',
        lfoWaveform: 'sine',
        reverbMix: 0.5,
        delayTime: 0.5,
        delayFeedback: 0.4,
        delayMix: 0.3,
        distortion: 0,
        glide: 0.3,
        volume: 0.5
      }
    },

    'String Pad': {
      category: 'pad',
      description: 'String ensemble pad',
      note: 261.63,
      params: {
        oscType: 'sawtooth',
        detune: 5,
        octave: 0,
        attack: 0.5,
        decay: 0.5,
        sustain: 0.8,
        release: 1.5,
        filterType: 'lowpass',
        filterFreq: 2000,
        filterQ: 1,
        filterEnvAmount: 500,
        lfoRate: 0.3,
        lfoAmount: 15,
        lfoTarget: 'pitch',
        lfoWaveform: 'sine',
        reverbMix: 0.4,
        delayTime: 0,
        delayFeedback: 0,
        delayMix: 0,
        distortion: 0,
        glide: 0.2,
        volume: 0.5
      }
    }
  },

  fx: {
    'Riser Sweep': {
      category: 'fx',
      description: 'Upward sweep for builds and transitions',
      note: 55,
      params: {
        oscType: 'sawtooth',
        detune: 20,
        octave: 0,
        attack: 0.01,
        decay: 0,
        sustain: 1.0,
        release: 0.5,
        filterType: 'lowpass',
        filterFreq: 200,
        filterQ: 5,
        filterEnvAmount: 8000,
        lfoRate: 0.1,
        lfoAmount: 50,
        lfoTarget: 'pitch',
        lfoWaveform: 'sawtooth',
        reverbMix: 0.6,
        delayTime: 0.25,
        delayFeedback: 0.5,
        delayMix: 0.4,
        distortion: 0.2,
        glide: 0,
        volume: 0.6
      }
    },

    'Impact Hit': {
      category: 'fx',
      description: 'Percussive impact for drops and transitions',
      note: 55,
      params: {
        oscType: 'sine',
        detune: 0,
        octave: -2,
        attack: 0.001,
        decay: 0.3,
        sustain: 0.0,
        release: 0.001,
        filterType: 'lowpass',
        filterFreq: 100,
        filterQ: 1,
        filterEnvAmount: 0,
        lfoRate: 0,
        lfoAmount: 0,
        lfoTarget: 'pitch',
        lfoWaveform: 'sine',
        reverbMix: 0.4,
        delayTime: 0,
        delayFeedback: 0,
        delayMix: 0,
        distortion: 0.5,
        glide: 0,
        volume: 0.9
      }
    }
  },

  // ===== TUNING REFERENCES =====
  tuning: {
    'A440 Reference': {
      category: 'tuning',
      description: 'Standard tuning reference tone (440 Hz)',
      note: 440,
      params: {
        oscType: 'sine',
        detune: 0,
        octave: 0,
        attack: 0.01,
        decay: 0,
        sustain: 1.0,
        release: 0.01,
        filterType: 'none',
        filterFreq: 20000,
        filterQ: 1,
        filterEnvAmount: 0,
        lfoRate: 0,
        lfoAmount: 0,
        lfoTarget: 'pitch',
        lfoWaveform: 'sine',
        reverbMix: 0,
        delayTime: 0,
        delayFeedback: 0,
        delayMix: 0,
        distortion: 0,
        glide: 0,
        volume: 0.5
      }
    },

    '1kHz Reference': {
      category: 'tuning',
      description: 'Standard 1kHz sine tone for calibration',
      note: 1000,
      params: {
        oscType: 'sine',
        detune: 0,
        octave: 0,
        attack: 0.01,
        decay: 0,
        sustain: 1.0,
        release: 0.01,
        filterType: 'none',
        filterFreq: 20000,
        filterQ: 1,
        filterEnvAmount: 0,
        lfoRate: 0,
        lfoAmount: 0,
        lfoTarget: 'pitch',
        lfoWaveform: 'sine',
        reverbMix: 0,
        delayTime: 0,
        delayFeedback: 0,
        delayMix: 0,
        distortion: 0,
        glide: 0,
        volume: 0.5
      }
    }
  }
};

// Flatten presets for easy access
export function getAllPresets() {
  const allPresets = {};
  Object.keys(SYNTH_PRESETS).forEach(category => {
    Object.keys(SYNTH_PRESETS[category]).forEach(name => {
      allPresets[name] = SYNTH_PRESETS[category][name];
    });
  });
  return allPresets;
}

// Get presets by category
export function getPresetsByCategory(category) {
  return SYNTH_PRESETS[category] || {};
}

// Get preset categories
export function getCategories() {
  return Object.keys(SYNTH_PRESETS);
}

console.log("🎹 synthPresets.js loaded");
