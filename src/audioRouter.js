// 🎶 audioRouter.js — Phase 13.31 (Stability Minimum)
// Event-driven relay: AudioEngine → audioState → geometry/particles/HUD
// Signal Multimodality: Also connects to signalRouter

import { AudioEngine } from "./audio.js";
import { notifyHUDUpdate } from "./hud.js";
import { applyAudioBandsToSprites } from "./sprites.js";
import { state } from "./state.js";
import { extractAudioMMPAFeatures } from "./audioFeatureExtractor.js";
import { recipeRegistry } from "./recipeEngine.js";
import { audioRecipe } from "./recipes/audioRecipe.js";

console.log("🎶 audioRouter.js loaded (Phase 13.31)");

let audioState = {
  bass: 0,
  mid: 0,
  treble: 0,
  level: 0,
  spectrum: new Uint8Array(0),
};

// Phase 13.31: Numeric guards
function toNums(b) {
  return {
    bass: +b.bass || 0,
    mid: +b.mid || 0,
    treble: +b.treble || 0,
    level: +b.level || 0
  };
}

// Phase 13.31: Single gain & shape step
const shape = x => Math.pow(Math.max(0, x), 0.6);

function process(b) {
  const g = state.audio?.audioGain ?? 1;
  const n = toNums(b);
  return {
    bass: shape(n.bass) * g,
    mid: shape(n.mid) * g,
    treble: shape(n.treble) * g,
    level: shape(n.level) * g
  };
}

// Phase 13.31: Auto-calibrate + tone
const _tone = {
  startTime: 0,
  rmsHistory: [],
  silentDuration: 0,
  activeDuration: 0,
  toneActive: false
};

function checkAutoTone(rms) {
  const now = performance.now();
  if (_tone.startTime === 0) _tone.startTime = now;

  const elapsed = now - _tone.startTime;

  // Track RMS over 1s
  _tone.rmsHistory.push(rms);
  if (_tone.rmsHistory.length > 60) _tone.rmsHistory.shift(); // ~1s at 60fps

  const avgRms = _tone.rmsHistory.reduce((a, b) => a + b, 0) / _tone.rmsHistory.length;

  // If < 0.002 for 1s after start → enable tone
  if (!_tone.toneActive && elapsed > 1000 && avgRms < 0.002) {
    _tone.silentDuration += 16; // ~1 frame
    if (_tone.silentDuration >= 1000) {
      console.log("🔊 Silent boot → auto test tone ON (220Hz)");
      AudioEngine.setTestTone?.(true, 220);
      _tone.toneActive = true;
      _tone.silentDuration = 0;
    }
  } else {
    _tone.silentDuration = 0;
  }

  // If rms > 0.01 for 300ms → disable tone
  if (_tone.toneActive && rms > 0.01) {
    _tone.activeDuration += 16;
    if (_tone.activeDuration >= 300) {
      console.log("🔇 Mic activity → auto test tone OFF");
      AudioEngine.setTestTone?.(false);
      _tone.toneActive = false;
      _tone.activeDuration = 0;
    }
  } else {
    _tone.activeDuration = 0;
  }
}

// Phase 13.4: Event-driven update relay
export function initAudioRouter() {
  console.log("🎧 Initializing audio router event relay...");

  // Register audio recipe with the global registry
  recipeRegistry.register(audioRecipe);
  console.log("📋 Audio recipe registered with recipe engine");

  let frameCount = 0;
  let audioFeatureExtractionStarted = false;  // Track if audio MMPA feature extraction has started

  AudioEngine.on('frame', (bands) => {
    if (!bands) {
      console.warn("⚠️ audioRouter received null bands");
      return;
    }

    // Start logging when first frame arrives
    if (!audioFeatureExtractionStarted) {
      audioFeatureExtractionStarted = true;
      console.log("🎵 Audio MMPA feature extraction started (AudioEngine is now running)");
    }

    try {
      // Phase 13.31: Process bands (numeric guards + gain + shape)
      const processed = process(bands);

      // Update audioState with processed bands
      audioState.bass = processed.bass;
      audioState.mid = processed.mid;
      audioState.treble = processed.treble;
      audioState.level = processed.level;
      audioState.spectrum = AudioEngine.getSpectrum();

      // Extract MMPA features from audio (bypasses financial module entirely)
      // Only update if not in financial mode and audio level is above threshold
      const financialModeEnabled = state.financial?.enabled || false;
      if (!financialModeEnabled && processed.level >= 0.01) {
        const audioData = {
          bands: {
            bass: processed.bass,
            mid: processed.mid,
            treble: processed.treble,
            level: processed.level
          },
          features: state.audioFeatures || {},
          spectrum: audioState.spectrum
        };

        // Direct audio → MMPA feature extraction (no financial dependency)
        state.mmpaFeatures = extractAudioMMPAFeatures(audioData);
        state.mmpaFeatures.enabled = true;

        // Process MMPA features through active recipe for interpretation
        const recipeResult = recipeRegistry.process(null, state.mmpaFeatures);
        if (recipeResult) {
          state.recipeInterpretation = recipeResult;

          // Log recipe interpretation every 180 frames (~3 seconds at 60fps)
          if (frameCount % 180 === 0) {
            console.log("🎵 Audio pattern recognized:", {
              pattern: recipeResult.interpretation.pattern.type,
              confidence: (recipeResult.interpretation.pattern.confidence * 100).toFixed(0) + '%',
              qualities: recipeResult.interpretation.qualities.join(', '),
              alerts: recipeResult.interpretation.alerts.length
            });
          }
        }

        // Log MMPA features every 180 frames (~3 seconds at 60fps)
        if (frameCount % 180 === 0) {
          console.log("🎵 Audio MMPA features extracted:", {
            level: processed.level.toFixed(3),
            identity_strength: state.mmpaFeatures.identity?.strength?.toFixed(3),
            relationship_consonance: state.mmpaFeatures.relationship?.consonance?.toFixed(3),
            transformation_flux: state.mmpaFeatures.transformation?.flux?.toFixed(3)
          });
        }
      } else if (!financialModeEnabled && processed.level < 0.01) {
        // Disable MMPA features when audio is too quiet (prevents NEUTRAL_STATE spam)
        if (state.mmpaFeatures.enabled) {
          state.mmpaFeatures.enabled = false;
          console.log("🔇 Audio level below threshold - MMPA features disabled");
        }
      }

      // Signal Multimodality: Feed audio signal to signal router
      if (window?.signalRouter) {
        // Create audio signal wrapper if not exists
        if (!window.signalRouter.sources.audio) {
          // Use dynamic import instead of require
          import('./signalAudio.js').then(({ AudioSignal }) => {
            const audioSignal = new AudioSignal('Microphone');
            audioSignal.enabled = true;
            audioSignal.state = 'running';
            window.signalRouter.sources.audio = audioSignal;
            window.signalRouter.multiplexer.addSource('audio', audioSignal, 1.0);
            console.log("📡 Audio source auto-connected to signal router");
          }).catch(err => {
            console.warn("⚠️ Could not load signalAudio.js:", err);
          });
        }

        // Update audio signal bands directly
        const audioSignal = window.signalRouter.sources.audio;
        if (audioSignal) {
          audioSignal.bands = { ...processed };
          audioSignal.spectrum = AudioEngine.getSpectrum();
        }
      }

      // Phase 13.31: Auto-calibrate + tone
      if (state.audio?.autoTone) {
        checkAutoTone(processed.level);
      }

      // Log every 60 frames (once per second at 60fps)
      if (frameCount++ % 60 === 0) {
        console.log("🎧 Audio frame relay:", {
          bass: audioState.bass.toFixed(3),
          mid: audioState.mid.toFixed(3),
          treble: audioState.treble.toFixed(3),
          level: audioState.level.toFixed(3),
          hasCallback: !!window?.hudCallbacks?.audioReactive
        });
      }

      // Broadcast to geometry/particles if callbacks exist
      if (window?.hudCallbacks?.audioReactive) {
        window.hudCallbacks.audioReactive(audioState);
      }

      // Phase 13.10: Apply audio to sprites
      applyAudioBandsToSprites(audioState);

      // Notify HUD Signal Bridge
      notifyHUDUpdate();
    } catch (err) {
      console.error("❌ audioRouter relay error:", err);
    }
  });

  console.log("✅ Audio router event relay registered");
}

export { audioState };
console.log("🎶 Audio routing configured (Phase 13.31)");
