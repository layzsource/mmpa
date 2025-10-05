import { onCC, onNote, onPitchBend } from './midi.js';
import { state, setMorphWeight, setHue } from './state.js';
import { applyMIDIBinding } from './controlBindings.js';

console.log("🎹 midiRouter.js loaded");

// Phase 13.16 — MIDI Learn capture (prints mapping snippet)
const _MidiLearn = (function() {
  function _normToRange(val01, min, max) {
    const v = Math.max(0, Math.min(1, val01));
    return min + (max - min) * v;
  }
  function _makeSnippet({ cc, channel = 0, path, min, max }) {
    const nice = `// CC${cc} → ${path} (${min}..${max})
{ cc: ${cc}, ch: ${channel}, apply: (value01) => {
  const v = ${min} + (${max} - ${min}) * value01;
  // Example HUD update; replace with your central binding call if different:
  window.onHUDUpdate?.({ "${path}": v });
}}`;
    return nice;
  }

  function handleCC({ cc, value, channel = 0 }) {
    const l = window.MidiLearn;
    if (!l?.active || !l?.target) return;
    const { path, min = 0, max = 1, label = path } = l.target;
    const value01 = Math.max(0, Math.min(1, value / 127));
    const preview = _normToRange(value01, min, max);

    console.log(`✅ MIDI Learn: CC${cc} captured for "${label}" → path="${path}", range=[${min}, ${max}]`);
    console.log("📋 Paste this into your mapping (e.g., controlBindings):\n" + _makeSnippet({ cc, channel, path, min, max }));

    // store lightweight binding suggestion in localStorage (non-executing)
    try {
      const prev = JSON.parse(localStorage.getItem("midiLearnSuggestions") || "[]");
      prev.push({ ts: Date.now(), cc, channel, path, min, max, label });
      localStorage.setItem("midiLearnSuggestions", JSON.stringify(prev));
    } catch {}

    // auto-exit learn to avoid accidental rebinds
    l.setActive(false);
  }

  return { handleCC };
})();

// Phase 11.7.24: Import mandala controller getter
let getMandalaController;
setTimeout(() => {
  // Lazy import to avoid circular dependency
  import('./main.js').then(module => {
    getMandalaController = module.getMandalaController;
  });
}, 0);

// Phase 11.7.12: MIDI-triggered emoji cycling
window.emojiParticlesMIDI = {
  cycleCC: 30, // Default CC for emoji cycling
  advanceStoryCC: 31 // Default CC for story advancement
};

// Phase 11.7.17: MIDI bank switching (pads 40-47 for banks 1-8)
window.emojiBankMIDI = {
  startCC: 40, // CC40-47 map to banks 1-8
  endCC: 47
};

// Phase 11.2.3: Unified Control Binding System
// Most MIDI CCs now route through applyMIDIBinding() for centralized control flow.
// Exception: CC2/CC3 have complex blend logic that updates multiple state paths,
// so they remain as special cases with direct state manipulation + morphBaseWeights sync.

// MIDI CC to state routing
onCC(({ cc, value, device, channel = 0 }) => {
  console.log(`🎹 CC${cc} from ${device}: ${value}`);

  // Phase 13.16: MIDI Learn capture (early exit if captured)
  _MidiLearn.handleCC({ cc, value, channel });

  // Phase 11.7.28: Mandala MIDI bindings (CC20-24) - priority when mandala enabled
  if (state.emojiMandala?.enabled) {
    const controller = getMandalaController?.();

    if (cc === 20) {
      // CC20 → Mandala Symmetry (3-24 spokes)
      const symmetry = Math.floor(3 + (value / 127) * 21); // 3-24 range
      if (controller) {
        controller.setSymmetry(symmetry);
      } else {
        state.emojiMandala.symmetry = Math.min(24, symmetry);
        console.log(`🎹 [MIDI] CC20 → Mandala Symmetry = ${state.emojiMandala.symmetry}`);
      }
      return; // Handled, skip binding system
    } else if (cc === 21) {
      // CC21 → Mandala Rings (1-12)
      const rings = Math.floor(1 + (value / 127) * 11); // 1-12 range
      if (controller) {
        controller.setRings(rings);
      } else {
        state.emojiMandala.rings = Math.min(12, rings);
        console.log(`🎹 [MIDI] CC21 → Mandala Rings = ${state.emojiMandala.rings}`);
      }
      return; // Handled, skip binding system
    } else if (cc === 22) {
      // CC22 → Mandala Layout Mode (discrete mapping)
      let layoutMode;
      if (value < 43) {
        layoutMode = 'radial'; // 0-42
      } else if (value < 86) {
        layoutMode = 'spiral'; // 43-85
      } else {
        layoutMode = 'grid'; // 86-127
      }

      if (controller) {
        controller.setLayout(layoutMode);
      } else {
        state.emojiMandala.layoutMode = layoutMode;
        const emoji = layoutMode === 'spiral' ? '🌀' : layoutMode === 'grid' ? '🔲' : '⭕';
        console.log(`🎹 [MIDI] CC22 → Mandala Layout = ${layoutMode.charAt(0).toUpperCase() + layoutMode.slice(1)} ${emoji}`);
      }
      return; // Handled, skip binding system
    } else if (cc === 23) {
      // CC23 → Mandala Emoji Swap (preset emoji)
      let emoji;
      if (value < 32) {
        emoji = '🍕'; // 0-31
      } else if (value < 64) {
        emoji = '🌶️'; // 32-63
      } else if (value < 96) {
        emoji = '🍄'; // 64-95
      } else {
        emoji = '⭐'; // 96-127
      }

      if (controller) {
        controller.swapEmoji(emoji);
      } else {
        state.emojiMandala.layout[0] = emoji; // Swap center emoji
        console.log(`🎹 [MIDI] CC23 → Mandala Emoji = ${emoji}`);
      }
      return; // Handled, skip binding system
    } else if (cc === 24) {
      // CC24 → Mandala Sensitivity (0.0-2.0)
      const sensitivity = (value / 127) * 2.0;
      if (controller) {
        controller.setMandalaSensitivity(sensitivity);
      } else {
        state.emojiMandala.mandalaSensitivity = sensitivity;
        console.log(`🎹 [MIDI] CC24 → Mandala Sensitivity = ${sensitivity.toFixed(1)}`);
      }
      return; // Handled, skip binding system
    }
  }

  // Phase 11.2.3: Try unified binding system
  // This handles: CC10 (sphere weight), CC20-23 (color intensities, morph weights, hue)
  if (applyMIDIBinding(cc, value)) {
    // Binding found and applied via controlBindings.js
    return;
  }

  // Phase 11.2.3: Special cases below (complex logic not suitable for simple binding)
  // CC2 (morph blend), CC3 (morph target), CC1/CC4 (rotation), CC7/CC8 (vessel), CC24 (scale)

  if (cc === 1) {
    // Phase 11.7.23/11.7.24: CC1 → Mandala rotation speed (if mandala enabled, else X rotation)
    if (state.emojiMandala?.enabled) {
      const normalizedSpeed = (value / 127) * 0.1; // 0-0.1 range
      const controller = getMandalaController?.();
      if (controller) {
        controller.setRotationSpeed(normalizedSpeed);
      } else {
        state.emojiMandala.rotationSpeed = normalizedSpeed;
        console.log(`🎛️ Mandala rotation speed: ${normalizedSpeed.toFixed(3)}`);
      }
    } else {
      state.rotationX = (value / 127) * 0.1;
    }
  } else if (cc === 2) {
    // Phase 11.7.23/11.7.24: CC2 → Mandala symmetry (if mandala enabled, else morph blend)
    if (state.emojiMandala?.enabled) {
      const symmetry = Math.floor(2 + (value / 127) * 10); // 2-12 range
      const controller = getMandalaController?.();
      if (controller) {
        controller.setSymmetry(symmetry);
      } else {
        state.emojiMandala.symmetry = Math.min(12, symmetry);
        console.log(`🎛️ Mandala symmetry: ${state.emojiMandala.symmetry}-fold`);
      }
    } else {
      // CC2 → Morph blend (legacy support)
      // Phase 11.2.2: Updated to sync with morphBaseWeights array
      const intensity = value / 127;
      // Simple blend: reduce current weights and blend toward next target
      const targets = state.morphState.targets;
      const currentIndex = targets.indexOf(state.morphState.current);
      const nextIndex = (currentIndex + 1) % targets.length;
      const currentTarget = targets[currentIndex];
      const nextTarget = targets[nextIndex];

      // Reset all weights and blend between current and next
      targets.forEach(target => {
        state.morphWeights[target] = 0;
      });
      state.morphWeights[currentTarget] = 1 - intensity;
      state.morphWeights[nextTarget] = intensity;

      // Phase 11.2.2: Sync to morphBaseWeights array [sphere, cube, pyramid, torus]
      state.morphBaseWeights = [0, 0, 0, 0];
      state.morphBaseWeights[currentIndex] = 1 - intensity;
      state.morphBaseWeights[nextIndex] = intensity;

      console.log(`🎹 CC2: Morph blend ${currentTarget}→${nextTarget} (${(intensity * 100).toFixed(0)}%)`);
    }
  } else if (cc === 3) {
    // Phase 11.7.23/11.7.24: CC3 → Mandala ring count (if mandala enabled, else morph target)
    if (state.emojiMandala?.enabled) {
      const rings = Math.floor(1 + (value / 127) * 7); // 1-8 range
      const controller = getMandalaController?.();
      if (controller) {
        controller.setRings(rings);
      } else {
        state.emojiMandala.rings = Math.min(8, rings);
        console.log(`🎛️ Mandala rings: ${state.emojiMandala.rings}`);
      }
    } else {
      // CC3 → Morph target selection
      // Phase 11.2.2: Updated to sync with morphBaseWeights array
      const targets = ["cube", "sphere", "pyramid", "torus"];
      let targetIndex;
      if (value < 32) targetIndex = 0;      // 0-31 → Cube
      else if (value < 64) targetIndex = 1; // 32-63 → Sphere
      else if (value < 96) targetIndex = 2; // 64-95 → Pyramid
      else targetIndex = 3;                 // 96-127 → Torus

      const newTarget = targets[targetIndex];

      // Update morph state and set weights
      state.morphState.previous = state.morphState.current;
      state.morphState.current = newTarget;

      // Reset all weights and set current target to 1.0
      targets.forEach(target => {
        state.morphWeights[target] = 0;
      });
      state.morphWeights[newTarget] = 1.0;

      // Phase 11.2.2: Sync to morphBaseWeights array [sphere, cube, pyramid, torus]
      const morphTargetIndex = ['sphere', 'cube', 'pyramid', 'torus'].indexOf(newTarget);
      state.morphBaseWeights = [0, 0, 0, 0];
      if (morphTargetIndex >= 0) {
        state.morphBaseWeights[morphTargetIndex] = 1.0;
      }

      console.log(`🎹 CC3: Morph target → ${newTarget}`);
    }
  } else if (cc === 4) {
    // CC4 → Y rotation speed
    state.rotationY = (value / 127) * 0.1;
  } else if (cc === 5) {
    // Phase 11.7.27: CC5 → Mandala sensitivity (0-200%)
    if (state.emojiMandala?.enabled) {
      const controller = getMandalaController?.();
      const sensitivity = (value / 127) * 2.0; // Map 0-127 to 0-2.0
      if (controller) {
        controller.setMandalaSensitivity(sensitivity);
      } else {
        state.emojiMandala.mandalaSensitivity = sensitivity;
        console.log(`🎵 Mandala sensitivity: ${(sensitivity * 100).toFixed(0)}%`);
      }
    }
  } else if (cc === 6) {
    // Phase 11.7.27: CC6 → Audio-reactive toggle
    if (state.emojiMandala?.enabled) {
      const controller = getMandalaController?.();
      const enabled = value > 63; // Treat as on/off (>63 = on)
      if (controller) {
        controller.setMandalaAudioReactive(enabled);
      } else {
        state.emojiMandala.mandalaAudioReactive = enabled;
        console.log(`🎵 Mandala audio-reactive ${enabled ? 'ON' : 'OFF'}`);
      }
    }
  } else if (cc === 7) {
    // CC7 → Vessel opacity (volume fader on MPK Mini)
    state.vessel.opacity = value / 127;
  } else if (cc === 8) {
    // CC8 → Vessel layout cycling (knob #2 on MPK Mini)
    if (value > 64) { // Detect knob turn or button press
      import('./vessel.js').then(({ cycleLayout }) => {
        import('./geometry.js').then(({ scene }) => {
          cycleLayout(scene);
        });
      });
    }
  } else if (cc === 10) {
    // Phase 11.2.3: CC10 now handled by unified binding system (morph.sphereWeight)
    // Keeping this as fallback in case binding system doesn't handle it
    console.log(`🎹 CC10 fallback: sphere weight (should be handled by binding system)`);
  } else if (cc === 21) {
    // Phase 11.2.3: CC21 mapped to both vessel.audioIntensity and particles.hueShift in binding system
    // Keeping legacy hue shift behavior as fallback
    const newHue = (value / 127) * 360;
    setHue(newHue);
    console.log(`🎹 CC21 fallback: hue shift (binding system also active)`);
  } else if (cc === 22) {
    // Phase 11.2.3: CC22 now handled by unified binding system (morph.pyramidWeight / shadows.audioIntensity)
    // Note: CC22 has dual mapping conflict - will use binding system priority
    console.log(`🎹 CC22 fallback: pyramid weight (should be handled by binding system)`);
  } else if (cc === 23) {
    // Phase 11.2.3: CC23 now handled by unified binding system (morph.torusWeight / particles.audioIntensity)
    // Note: CC23 has dual mapping conflict - will use binding system priority
    console.log(`🎹 CC23 fallback: torus weight (should be handled by binding system)`);
  } else if (cc === 24) {
    // CC24 → Scale (0.5-2.0)
    state.scale = 0.5 + (value / 127) * 1.5;
  } else if (cc === window.emojiParticlesMIDI.cycleCC) {
    // Phase 11.7.12: CC30 (default) → Cycle emoji in set
    if (window.emojiParticles && value > 0) {
      window.emojiParticles.cycleEmoji();
    }
  } else if (cc === window.emojiParticlesMIDI.advanceStoryCC) {
    // Phase 11.7.12: CC31 (default) → Advance story
    if (window.emojiParticles && value > 0) {
      window.emojiParticles.advanceStory();
    }
  } else if (cc === 40) {
    // Phase 11.7.32: CC40 → Mandala ON/OFF toggle (0 = OFF, >0 = ON)
    const enabled = value > 0;
    state.mandala.enabled = enabled;
    state.emojiMandala.enabled = enabled;
    console.log(`🎛️ MIDI → Mandala: ${enabled ? 'ON' : 'OFF'}`);
  } else if (cc === 41) {
    // Phase 11.7.32: CC41 → Mandala ring count (map 0-127 → 3-12)
    const rings = Math.floor(3 + (value / 127) * 9); // 3-12 range
    state.mandala.ringCount = rings;
    state.emojiMandala.rings = rings;
    const controller = getMandalaController?.();
    if (controller) {
      controller.setRings(rings);
    }
    console.log(`🎛️ MIDI → Mandala rings: ${rings}`);
  } else if (cc === 42) {
    // Phase 11.7.32: CC42 → Mandala symmetry (map 0-127 → 2-12)
    const symmetry = Math.floor(2 + (value / 127) * 10); // 2-12 range
    state.mandala.symmetry = symmetry;
    state.emojiMandala.symmetry = symmetry;
    const controller = getMandalaController?.();
    if (controller) {
      controller.setSymmetry(symmetry);
    }
    console.log(`🎛️ MIDI → Mandala symmetry: ${symmetry}`);
  } else if (cc >= window.emojiBankMIDI.startCC && cc <= window.emojiBankMIDI.endCC) {
    // Phase 11.7.17: CC40-47 → Load emoji pattern banks 1-8
    if (value > 0 && window.emojiBankManager) {
      const bankIndex = cc - window.emojiBankMIDI.startCC;
      const success = window.emojiBankManager.loadBank(bankIndex);
      if (success) {
        state.currentBank = bankIndex;
        // Rebuild UI
        if (window.rebuildEmojiMixerUI) window.rebuildEmojiMixerUI();
        if (window.rebuildSequencerGrid) window.rebuildSequencerGrid();
        if (window.updateBankButtonStates) window.updateBankButtonStates();
        console.log(`🎹 MIDI pad ${cc} → Bank ${bankIndex + 1} loaded`);
      }
    }
  }
});

// Phase 11.7.23/11.7.24: Note on/off routing (pads → emoji swap per ring)
onNote(({ note, velocity, noteOn, device }) => {
  console.log(`🎹 Note ${noteOn ? 'ON' : 'OFF'} ${note} from ${device}: velocity=${velocity}`);

  // Phase 11.7.23/11.7.24: Pads swap emoji in mandala rings
  if (state.emojiMandala?.enabled && noteOn && velocity > 0) {
    const controller = getMandalaController?.();
    const { layout, rings } = state.emojiMandala;

    // Map pads 36-43 (common drum pads) to rings 0-7
    if (note >= 36 && note <= 43) {
      const ringIndex = note - 36;
      if (ringIndex < rings && ringIndex < layout.length) {
        // Cycle through some preset emoji options for quick swapping
        const emojiOptions = ['🍕', '🌶️', '🍄', '🌟', '💎', '🔥', '💧', '🌈'];
        const currentEmoji = layout[ringIndex];
        const currentIndex = emojiOptions.indexOf(currentEmoji);
        const nextIndex = (currentIndex + 1) % emojiOptions.length;
        const nextEmoji = emojiOptions[nextIndex];

        // Update via controller if available
        if (controller) {
          controller.swapEmoji(nextEmoji, ringIndex);
        } else {
          state.emojiMandala.layout[ringIndex] = nextEmoji;
          console.log(`🎛️ Ring ${ringIndex} emoji swap: ${currentEmoji} → ${nextEmoji}`);
        }
      }
    }

    // Phase 11.7.22: Musical mode - track active notes
    if (state.emojiMandala.musicalMode) {
      if (noteOn && velocity > 0) {
        state.emojiMandala.activeNotes.add(note);
        state.emojiMandala.notePulse[note] = velocity / 127;
      } else {
        state.emojiMandala.activeNotes.delete(note);
        state.emojiMandala.notePulse[note] = 0;
      }
    }
  }
});

// Phase 11.7.23/11.7.24: Pitch bend routing (wheel → mandala spin tempo)
onPitchBend(({ value, rawValue, device }) => {
  console.log(`🎹 Pitch bend from ${device}: ${value.toFixed(3)} (raw=${rawValue})`);

  // Phase 11.7.23/11.7.24: Wheel controls mandala global rotation speed
  if (state.emojiMandala?.enabled) {
    const controller = getMandalaController?.();
    // Map pitch bend (-1 to +1) to rotation speed multiplier (0.5x to 2x)
    const speedMultiplier = 1.0 + value; // -1→0x, 0→1x, +1→2x
    const baseSpeed = state.emojiMandala.rotationSpeed || 0.02;

    // Apply speed multiplier (clamp to reasonable range)
    const newSpeed = Math.max(0, Math.min(0.2, baseSpeed * speedMultiplier));

    if (controller) {
      controller.setRotationSpeed(newSpeed);
      console.log(`🎛️ Mandala wheel spin: ${speedMultiplier.toFixed(2)}x`);
    } else {
      state.emojiMandala.rotationSpeed = newSpeed;
      console.log(`🎛️ Mandala wheel spin: ${speedMultiplier.toFixed(2)}x (speed=${newSpeed.toFixed(3)})`);
    }
  }
});

console.log("🎹 MIDI routing configured (Phase 11.7.32: Mandala MIDI integration)");
console.log("🔗 Mandala MIDI bindings: CC40=ON/OFF | CC41=Rings | CC42=Symmetry");