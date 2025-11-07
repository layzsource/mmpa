// MMPA Synth Engine
// Professional-grade synthesizer for validation testing and DAW workflows
// Supports multiple oscillator types, ADSR, filters, LFO, and effects

export class SynthEngine {
  constructor(audioContext) {
    this.audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.3;
    // Don't auto-connect to destination - let the host decide routing

    // Voice management
    this.voices = [];
    this.maxPolyphony = 8;

    // Global parameters
    this.params = {
      // Oscillator
      oscType: 'sine', // sine, square, sawtooth, triangle, noise
      detune: 0,
      octave: 0,
      tuningOffset: 0, // Hz adjustment for calibration (-10 to +10)

      // ADSR Envelope
      attack: 0.01,
      decay: 0.1,
      sustain: 0.7,
      release: 0.3,

      // Filter
      filterType: 'lowpass', // lowpass, highpass, bandpass, notch
      filterFreq: 2000,
      filterQ: 1,
      filterEnvAmount: 0,

      // LFO
      lfoRate: 4,
      lfoAmount: 0,
      lfoTarget: 'pitch', // pitch, filter, amplitude
      lfoWaveform: 'sine',

      // Effects
      reverbMix: 0,
      delayTime: 0.3,
      delayFeedback: 0.3,
      delayMix: 0,
      distortion: 0,

      // Misc
      glide: 0, // portamento time
      volume: 0.7
    };

    // Effects chains
    this.reverb = null;
    this.delay = null;
    this.distortion = null;

    this.initEffects();

    console.log("🎹 SynthEngine initialized");
  }

  initEffects() {
    // Reverb (using convolver with impulse response)
    this.reverb = this.audioContext.createGain();
    this.reverb.gain.value = 0;
    this.reverb.connect(this.masterGain);

    // Delay
    this.delay = this.audioContext.createDelay(2);
    this.delayFeedback = this.audioContext.createGain();
    this.delayMix = this.audioContext.createGain();

    this.delay.delayTime.value = this.params.delayTime;
    this.delayFeedback.gain.value = this.params.delayFeedback;
    this.delayMix.gain.value = 0;

    this.delay.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delay);
    this.delay.connect(this.delayMix);
    this.delayMix.connect(this.masterGain);

    // Distortion (waveshaper)
    this.distortion = this.audioContext.createWaveShaper();
    this.distortion.curve = this.makeDistortionCurve(0);
    this.distortion.oversample = '4x';
  }

  makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }

    return curve;
  }

  // Note on/off
  noteOn(frequency, velocity = 1) {
    if (this.voices.length >= this.maxPolyphony) {
      // Voice stealing - remove oldest voice
      const oldestVoice = this.voices.shift();
      oldestVoice.stop();
    }

    const voice = new SynthVoice(this.audioContext, this.params, frequency, velocity);

    // Connect voice to effects/output
    if (this.params.distortion > 0) {
      voice.output.connect(this.distortion);
      this.distortion.connect(this.masterGain);
    } else {
      voice.output.connect(this.masterGain);
    }

    if (this.params.delayMix > 0) {
      voice.output.connect(this.delay);
    }

    if (this.params.reverbMix > 0) {
      voice.output.connect(this.reverb);
    }

    voice.start();
    this.voices.push(voice);

    return voice;
  }

  noteOff(frequency) {
    const voice = this.voices.find(v => Math.abs(v.frequency - frequency) < 1);
    if (voice) {
      voice.release();
      // Remove voice after release time
      setTimeout(() => {
        const index = this.voices.indexOf(voice);
        if (index > -1) {
          this.voices.splice(index, 1);
        }
      }, this.params.release * 1000 + 100);
    }
  }

  allNotesOff() {
    this.voices.forEach(voice => voice.release());
    setTimeout(() => {
      this.voices = [];
    }, this.params.release * 1000 + 100);
  }

  // Continuous tone (for testing)
  startContinuousTone(frequency) {
    this.stopContinuousTone();
    this.continuousTone = this.noteOn(frequency, 1);
  }

  stopContinuousTone() {
    if (this.continuousTone) {
      this.continuousTone.release();
      this.continuousTone = null;
    }
  }

  // Parameter updates
  updateParam(param, value) {
    this.params[param] = value;

    // Update active voices
    switch(param) {
      case 'filterFreq':
        this.voices.forEach(v => {
          if (v.filter) v.filter.frequency.value = value;
        });
        break;
      case 'filterQ':
        this.voices.forEach(v => {
          if (v.filter) v.filter.Q.value = value;
        });
        break;
      case 'delayTime':
        this.delay.delayTime.value = value;
        break;
      case 'delayFeedback':
        this.delayFeedback.gain.value = value;
        break;
      case 'delayMix':
        this.delayMix.gain.value = value;
        break;
      case 'reverbMix':
        this.reverb.gain.value = value;
        break;
      case 'distortion':
        this.distortion.curve = this.makeDistortionCurve(value * 100);
        break;
      case 'volume':
        this.masterGain.gain.value = value * 0.5;
        break;
    }
  }

  // Generate noise buffer
  createNoiseBuffer() {
    const bufferSize = this.audioContext.sampleRate * 2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  // Connect to external destination (for recording)
  connectTo(destination) {
    this.masterGain.connect(destination);
  }

  disconnect() {
    this.masterGain.disconnect();
    this.masterGain.connect(this.audioContext.destination);
  }
}

// Individual voice (note instance)
class SynthVoice {
  constructor(audioContext, params, frequency, velocity) {
    this.audioContext = audioContext;
    this.params = params;
    this.frequency = frequency;
    this.velocity = velocity;

    // Create voice nodes
    this.output = this.audioContext.createGain();
    this.output.gain.value = 0;

    // Oscillator
    if (params.oscType === 'noise') {
      this.osc = this.audioContext.createBufferSource();
      this.osc.buffer = this.createNoiseBuffer();
      this.osc.loop = true;
    } else {
      this.osc = this.audioContext.createOscillator();
      this.osc.type = params.oscType;
      // Apply tuning offset for calibration
      this.osc.frequency.value = (frequency + params.tuningOffset) * Math.pow(2, params.octave);
      this.osc.detune.value = params.detune;
    }

    // Filter
    if (params.filterType !== 'none') {
      this.filter = this.audioContext.createBiquadFilter();
      this.filter.type = params.filterType;
      this.filter.frequency.value = params.filterFreq;
      this.filter.Q.value = params.filterQ;
      this.osc.connect(this.filter);
      this.filter.connect(this.output);
    } else {
      this.osc.connect(this.output);
    }

    // LFO
    if (params.lfoAmount > 0) {
      this.lfo = this.audioContext.createOscillator();
      this.lfo.type = params.lfoWaveform;
      this.lfo.frequency.value = params.lfoRate;

      this.lfoGain = this.audioContext.createGain();
      this.lfoGain.gain.value = params.lfoAmount;

      this.lfo.connect(this.lfoGain);

      switch(params.lfoTarget) {
        case 'pitch':
          this.lfoGain.connect(this.osc.detune || this.osc.playbackRate);
          break;
        case 'filter':
          if (this.filter) {
            this.lfoGain.connect(this.filter.frequency);
          }
          break;
        case 'amplitude':
          this.lfoGain.connect(this.output.gain);
          break;
      }
    }

    this.startTime = null;
    this.releaseTime = null;
  }

  createNoiseBuffer() {
    const bufferSize = this.audioContext.sampleRate * 2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  start() {
    const now = this.audioContext.currentTime;
    this.startTime = now;

    // ADSR Attack
    this.output.gain.setValueAtTime(0, now);
    this.output.gain.linearRampToValueAtTime(
      this.velocity * this.params.sustain,
      now + this.params.attack
    );

    // Decay
    this.output.gain.linearRampToValueAtTime(
      this.velocity * this.params.sustain,
      now + this.params.attack + this.params.decay
    );

    // Start oscillators
    this.osc.start(now);
    if (this.lfo) {
      this.lfo.start(now);
    }
  }

  release() {
    if (this.releaseTime) return; // Already releasing

    const now = this.audioContext.currentTime;
    this.releaseTime = now;

    // Release envelope
    this.output.gain.cancelScheduledValues(now);
    this.output.gain.setValueAtTime(this.output.gain.value, now);
    this.output.gain.linearRampToValueAtTime(0, now + this.params.release);

    // Stop oscillators after release
    this.osc.stop(now + this.params.release + 0.1);
    if (this.lfo) {
      this.lfo.stop(now + this.params.release + 0.1);
    }
  }

  stop() {
    try {
      this.osc.stop();
      if (this.lfo) this.lfo.stop();
    } catch (e) {
      // Already stopped
    }
  }
}

console.log("🎹 synthEngine.js loaded");
