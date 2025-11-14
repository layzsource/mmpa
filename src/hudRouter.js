import { onHUDUpdate } from './hud.js';
import { state, setMorphWeight, setMorphWeights, setColor, setHue } from './state.js';
import { scene, renderer, camera } from './geometry.js';
import { initParticles, destroyParticles } from './particles.js';

console.log("📟 hudRouter.js loaded");

// Phase 11.7.24: Import mandala controller getter
let getMandalaController;
setTimeout(() => {
  // Lazy import to avoid circular dependency
  import('./main.js').then(module => {
    getMandalaController = module.getMandalaController;
  });
}, 0);

// HUD updates to state routing
onHUDUpdate((update) => {
  // Phase 11.4.1: Handle reset action
  if (update.type === 'app:reset') {
    console.log("📟 HUD action: app:reset");
    // Reset is handled in presetRouter.js
    return;
  }

  if (update.idleSpin !== undefined) {
    state.idleSpin = update.idleSpin;
  }
  if (update.rotX !== undefined) {
    state.rotationX = update.rotX;
  }
  if (update.rotY !== undefined) {
    state.rotationY = update.rotY;
  }
  if (update.scale !== undefined) {
    state.scale = update.scale;
  }
  if (update.morphTarget !== undefined) {
    // Update morph state and reset weights to show only selected target
    state.morphState.previous = state.morphState.current;
    state.morphState.current = update.morphTarget;

    // Reset all weights and set current target to 1.0
    state.morphState.targets.forEach(target => {
      state.morphWeights[target] = 0;
    });
    state.morphWeights[update.morphTarget] = 1.0;

    // Phase 11.2: Sync to morphBaseWeights array [sphere, cube, pyramid, torus]
    const targetIndex = ['sphere', 'cube', 'pyramid', 'torus'].indexOf(update.morphTarget);
    state.morphBaseWeights = [0, 0, 0, 0];
    if (targetIndex >= 0) {
      state.morphBaseWeights[targetIndex] = 1.0;
    }
  }
  if (update.morphBlend !== undefined) {
    // Legacy morph blend support - blend between current and next target
    const targets = state.morphState.targets;
    const currentIndex = targets.indexOf(state.morphState.current);
    const nextIndex = (currentIndex + 1) % targets.length;
    const currentTarget = targets[currentIndex];
    const nextTarget = targets[nextIndex];

    // Reset all weights and blend between current and next
    targets.forEach(target => {
      state.morphWeights[target] = 0;
    });
    state.morphWeights[currentTarget] = 1 - update.morphBlend;
    state.morphWeights[nextTarget] = update.morphBlend;

    // Phase 11.2: Sync to morphBaseWeights array [sphere, cube, pyramid, torus]
    state.morphBaseWeights = [0, 0, 0, 0];
    state.morphBaseWeights[currentIndex] = 1 - update.morphBlend;
    state.morphBaseWeights[nextIndex] = update.morphBlend;
  }
  if (update.targetWeight !== undefined) {
    // Individual target weight control
    const { target, weight } = update.targetWeight;
    setMorphWeight(target, weight);
  }
  if (update.audioEnabled !== undefined) {
    state.audio.enabled = update.audioEnabled;
    state.audioReactive = update.audioEnabled;
    console.log(`🎵 Audio Reactive: ${update.audioEnabled}`);

    if (update.audioEnabled) {
      // Initialize microphone when first enabled
      console.log("🔍 Phase 13.1a: Calling enableAudio() from hudRouter");
      import('./audio.js').then(({ enableAudio }) => {
        console.log("🔍 Phase 13.1a: audio.js imported, invoking enableAudio()");
        enableAudio();
      });
    } else {
      // Reset audio values immediately when disabled
      state.audio.bass = 0;
      state.audio.mid = 0;
      state.audio.treble = 0;
    }
  }
  if (update.audioSensitivity !== undefined) {
    state.audio.sensitivity = update.audioSensitivity;
  }
  // Phase 13.30: Master reactivity gain
  if (update.audioGain !== undefined) {
    state.audio.audioGain = Number(update.audioGain) || 1;
  }
  if (update.ambientIntensity !== undefined) {
    state.lighting.ambientIntensity = update.ambientIntensity;
  }
  if (update.directionalIntensity !== undefined) {
    state.lighting.directionalIntensity = update.directionalIntensity;
  }
  if (update.directionalAngleX !== undefined) {
    state.lighting.directionalAngleX = update.directionalAngleX;
  }
  if (update.directionalAngleY !== undefined) {
    state.lighting.directionalAngleY = update.directionalAngleY;
  }
  if (update.color !== undefined) {
    setColor(update.color);
    // Ensure vessel color stays in sync with main color
    state.vessel.color = update.color;
    console.log(`🎨 Color updated: ${update.color} (vessel + particles)`);
  }
  if (update.particlesEnabled !== undefined) {
    console.log(`🚨 particlesEnabled changing: ${state.particlesEnabled} → ${update.particlesEnabled}`);
    console.trace('  ↳ Stack trace:');
    state.particlesEnabled = update.particlesEnabled;
    if (update.particlesEnabled) {
      initParticles(scene, state.particlesCount);
      console.log(`✨ Particles enabled (count: ${state.particlesCount})`);
    } else {
      destroyParticles(scene);
      console.log("✨ Particles disabled");
    }
  }
  if (update.particlesCount !== undefined) {
    state.particlesCount = update.particlesCount;
    state.particles.count = update.particlesCount;
    // If particles are currently enabled, recreate them with new count
    if (state.particlesEnabled) {
      const currentSize = state.particles.size || 0.5; // Phase 4.8: preserve current size
      const currentGain = state.particles.audioGain || 2.0; // Phase 4.8: preserve audio gain
      destroyParticles(scene);
      initParticles(scene, state.particlesCount);

      // Phase 4.8: Reapply size and audio gain after reinit
      import('./particles.js').then(({ getParticleSystemInstance }) => {
        const instance = getParticleSystemInstance();
        if (instance) {
          instance.setParticleSize(currentSize);
          instance.setAudioGain(currentGain);
        }
      });

      console.log(`✨ Particle count updated: ${state.particlesCount}`);
    }
  }
  if (update.particlesLayout !== undefined) {
    state.particles.layout = update.particlesLayout;
    console.log(`✨ Particles layout: ${update.particlesLayout}`);

    // Phase 4.1: Wire to ParticleSystem instance
    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setLayout(update.particlesLayout);
      }
    });
  }
  if (update.particlesHue !== undefined) {
    state.particles.hue = update.particlesHue;
    console.log(`✨ Hue shift: ${update.particlesHue}°`);

    // Phase 4.5: Wire to ParticleSystem instance
    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setHueShift(update.particlesHue);
      }
    });
  }
  if (update.particlesSize !== undefined) {
    state.particles.size = update.particlesSize;
    console.log(`✨ Particle size updated: ${update.particlesSize.toFixed(2)} world units`); // Phase 4.8: true 3D

    // Phase 4.8: Wire to ParticleSystem instance
    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setParticleSize(update.particlesSize);
      }
    });
  }
  if (update.particlesOpacity !== undefined) {
    state.particles.opacity = update.particlesOpacity;
    console.log(`✨ Opacity: ${update.particlesOpacity.toFixed(2)}`);

    // Phase 4.2: Wire to ParticleSystem instance
    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setOpacity(update.particlesOpacity);
      }
    });
  }
  if (update.particlesOrganicMotion !== undefined) {
    state.particles.organicMotion = update.particlesOrganicMotion;
    console.log(`✨ Organic motion: ${update.particlesOrganicMotion}`);
  }
  if (update.particlesOrganicStrength !== undefined) {
    state.particles.organicStrength = update.particlesOrganicStrength;
    console.log(`✨ Organic strength: ${update.particlesOrganicStrength.toFixed(2)}`);

    // Phase 4.2: Wire to ParticleSystem instance
    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setOrganicStrength(update.particlesOrganicStrength);
      }
    });
  }
  if (update.particlesAudioReactiveHue !== undefined) {
    state.particles.audioReactiveHue = update.particlesAudioReactiveHue;
    console.log(`✨ Audio-reactive hue: ${update.particlesAudioReactiveHue}`);

    // Phase 4.8: Wire to ParticleSystem instance
    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setAudioReactive(update.particlesAudioReactiveHue);
      }
    });
  }
  if (update.particlesAudioGain !== undefined) {
    state.particles.audioGain = update.particlesAudioGain;
    console.log(`✨ Audio gain: ${update.particlesAudioGain.toFixed(1)}`);

    // Phase 4.8: Wire to ParticleSystem instance
    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setAudioGain(update.particlesAudioGain);
      }
    });
  }
  if (update.particlesVelocity !== undefined) {
    state.particles.velocity = update.particlesVelocity;
    state.particles.orbitalSpeed = update.particlesVelocity; // Phase 4.1: wire to orbitalSpeed
    console.log(`✨ Orbital speed: ${update.particlesVelocity.toFixed(2)}`);

    // Wire to ParticleSystem instance if exists
    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setOrbitalSpeed(update.particlesVelocity);
      }
    });
  }
  if (update.particlesMotionSmoothness !== undefined) {
    state.particles.motionSmoothness = update.particlesMotionSmoothness;
    console.log(`✨ Smoothness: ${update.particlesMotionSmoothness.toFixed(2)}`);

    // Wire to ParticleSystem instance if exists
    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setSmoothness(update.particlesMotionSmoothness);
      }
    });
  }

  // Phase 2.3.2A: Particle trail controls
  if (update.particlesTrailEnabled !== undefined) {
    state.particles.trailEnabled = update.particlesTrailEnabled;
    console.log(`🌊 Trail enabled: ${update.particlesTrailEnabled}`);

    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setTrailEnabled(update.particlesTrailEnabled);
      }
    });
  }
  if (update.particlesTrailLength !== undefined) {
    state.particles.trailLength = update.particlesTrailLength;
    console.log(`🌊 Trail length: ${update.particlesTrailLength}`);

    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setTrailLength(update.particlesTrailLength);
      }
    });
  }
  if (update.particlesTrailOpacity !== undefined) {
    state.particles.trailOpacity = update.particlesTrailOpacity;
    console.log(`🌊 Trail opacity: ${update.particlesTrailOpacity.toFixed(2)}`);

    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setTrailOpacity(update.particlesTrailOpacity);
      }
    });
  }
  if (update.particlesTrailFade !== undefined) {
    state.particles.trailFade = update.particlesTrailFade;
    console.log(`🌊 Trail fade: ${update.particlesTrailFade.toFixed(2)}`);

    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setTrailFade(update.particlesTrailFade);
      }
    });
  }
  // Phase 2.3.2D: Audio-reactive trail length controls
  if (update.particlesTrailAudioReactive !== undefined) {
    state.particles.trailAudioReactive = update.particlesTrailAudioReactive;
    console.log(`🌊 Trail audio-reactive length: ${update.particlesTrailAudioReactive}`);

    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setTrailAudioReactive(update.particlesTrailAudioReactive);
      }
    });
  }
  if (update.particlesTrailLengthMin !== undefined) {
    state.particles.trailLengthMin = update.particlesTrailLengthMin;
    console.log(`🌊 Trail min length: ${update.particlesTrailLengthMin}`);

    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setTrailLengthMin(update.particlesTrailLengthMin);
      }
    });
  }
  if (update.particlesTrailLengthMax !== undefined) {
    state.particles.trailLengthMax = update.particlesTrailLengthMax;
    console.log(`🌊 Trail max length: ${update.particlesTrailLengthMax}`);

    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setTrailLengthMax(update.particlesTrailLengthMax);
      }
    });
  }
  if (update.particlesResetDefaults !== undefined) {
    // Phase 4.9.0: Reset particle system to defaults
    console.log('🔄 Resetting particle system to defaults');

    // Reset state
    state.particles.size = 0.5;
    state.particles.count = 5000;
    state.particles.orbitalSpeed = 0.05;
    state.particles.motionSmoothness = 0.5;
    state.particles.opacity = 1.0;
    state.particles.organicStrength = 0.2;
    state.particles.hue = 0.0;
    state.particles.audioReactiveHue = true;
    state.particles.audioGain = 2.0;
    state.particles.layout = 'orbit';

    // Reinit particle system
    import('./particles.js').then(({ destroyParticles, initParticles, getParticleSystemInstance }) => {
      destroyParticles(scene);
      initParticles(scene, 5000);

      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setParticleSize(0.5);
        instance.setAudioGain(2.0);
        instance.setHueShift(0.0);
        instance.setAudioReactive(true);
        instance.setOrbitalSpeed(0.05);
        instance.setSmoothness(0.5);
        instance.setOpacity(1.0);
        instance.setOrganicStrength(0.2);
        instance.setLayout('orbit');
      }
    });
  }

  // Phase 1: Bioacoustic Analysis (Sp(2,ℝ)/Z₂)
  if (update.bioacousticMode !== undefined) {
    if (!state.bioacoustic) state.bioacoustic = {};
    state.bioacoustic.mode = update.bioacousticMode;
    console.log(`🔬 Bioacoustic mode: ${update.bioacousticMode}`);

    if (update.bioacousticMode === 'analysis') {
      // Lazy-load and initialize symplectic manifold
      import('./bioacoustics/symplecticManifold.js').then(({ SymplecticManifold }) => {
        if (!window.symplecticManifold) {
          window.symplecticManifold = new SymplecticManifold();
          console.log('🔬 Sp(2,ℝ)/Z₂ manifold initialized');
        }
      });
    } else {
      console.log('🔬 Switched to Performance mode');
    }
  }
  if (update.bioacousticScale !== undefined) {
    if (!state.bioacoustic) state.bioacoustic = {};
    state.bioacoustic.scale = update.bioacousticScale;
    console.log(`🔬 Manifold scale: ${update.bioacousticScale.toFixed(2)}`);

    // Apply to manifold instance if exists
    if (window.symplecticManifold) {
      window.symplecticManifold.setScale(update.bioacousticScale);
    }
  }
  if (update.bioacousticParticleCount !== undefined) {
    if (!state.bioacoustic) state.bioacoustic = {};
    state.bioacoustic.particleCount = update.bioacousticParticleCount;
    console.log(`🔬 Manifold particle count: ${update.bioacousticParticleCount}`);

    // Apply to manifold instance if exists
    if (window.symplecticManifold) {
      window.symplecticManifold.setParticleCount(update.bioacousticParticleCount);
    }
  }
  if (update.bioacousticAudioReactive !== undefined) {
    if (!state.bioacoustic) state.bioacoustic = {};
    state.bioacoustic.audioReactive = update.bioacousticAudioReactive;
    console.log(`🔬 Audio-reactive evolution: ${update.bioacousticAudioReactive ? 'ON' : 'OFF'}`);
  }

  // Phase 2: Bioacoustic Analysis Controls
  if (update.bioacousticAnalysisRunning !== undefined) {
    if (!state.bioacoustic) state.bioacoustic = {};
    state.bioacoustic.analysisRunning = update.bioacousticAnalysisRunning;
    console.log(`🔬 Analysis ${update.bioacousticAnalysisRunning ? 'STARTED' : 'STOPPED'}`);

    // Initialize/control bioacoustic analyzer
    import('./bioacoustics/bioacousticAnalyzer.js').then(({ BioacousticAnalyzer }) => {
      if (!window.bioacousticAnalyzer) {
        // Get audio context from audio module
        import('./audio.js').then(({ getAudioContext }) => {
          const audioContext = getAudioContext();
          window.bioacousticAnalyzer = new BioacousticAnalyzer(audioContext);

          // Connect to microphone if available
          if (window.microphoneSource) {
            window.bioacousticAnalyzer.connect(window.microphoneSource);
          }

          if (update.bioacousticAnalysisRunning) {
            window.bioacousticAnalyzer.startAnalysis();
          }
        });
      } else {
        // Analyzer already exists
        if (update.bioacousticAnalysisRunning) {
          window.bioacousticAnalyzer.startAnalysis();
        } else {
          window.bioacousticAnalyzer.stopAnalysis();
        }
      }
    });
  }
  if (update.bioacousticCaptureSignature !== undefined) {
    console.log('🔬 Capturing bioacoustic signature...');

    if (window.bioacousticAnalyzer) {
      // Use first default species for now (example_bird_1)
      const success = window.bioacousticAnalyzer.captureSignature('example_bird_1');

      if (success) {
        console.log('🔬 ✓ Signature captured successfully');
      } else {
        console.error('🔬 ✗ Failed to capture signature');
      }
    } else {
      console.warn('🔬 Analyzer not initialized. Start analysis first.');
    }
  }
  if (update.bioacousticVerifyStokes !== undefined) {
    console.log('🔬 Verifying Stokes\' theorem: ⟨∂T, α⟩ = ⟨T, dα⟩');

    if (window.bioacousticAnalyzer) {
      const result = window.bioacousticAnalyzer.verifyStokesTheorem();

      if (result) {
        console.log(`🔬 Verification: ${result.verified ? '✓ PASSED' : '✗ FAILED'}`);
        console.log(`🔬 LHS (⟨∂T, α⟩): ${result.lhs}`);
        console.log(`🔬 RHS (⟨T, dα⟩): ${result.rhs}`);
        console.log(`🔬 Error: ${result.error}`);
      } else {
        console.warn('🔬 Verification unavailable. Need analysis data.');
      }
    } else {
      console.warn('🔬 Analyzer not initialized. Start analysis first.');
    }
  }

  // Dual Trail System: Motion Trails (postprocessing)
  if (update.motionTrailsEnabled !== undefined) {
    state.motionTrailsEnabled = update.motionTrailsEnabled;
    console.log(`🎞️ Motion Trails ${update.motionTrailsEnabled ? 'ON' : 'OFF'}`);
  }
  if (update.motionTrailIntensity !== undefined) {
    state.motionTrailIntensity = update.motionTrailIntensity;
    console.log(`🎞️ Motion Trail Intensity: ${update.motionTrailIntensity.toFixed(2)}`);
  }

  // Phase 2.3.3/4: Shadow Box controls
  if (update.shadowBoxProjectParticles !== undefined) {
    console.log(`📦 Shadow Box project particles: ${update.shadowBoxProjectParticles}`);

    import('./particles.js').then(({ getParticleSystemInstance }) => {
      const instance = getParticleSystemInstance();
      if (instance) {
        instance.setProjectParticlesToShadow(update.shadowBoxProjectParticles);
      }
    });
  }
  if (update.shadowBoxThreshold !== undefined) {
    console.log(`📦 Shadow Box threshold: ${update.shadowBoxThreshold.toFixed(2)}`);

    import('./main.js').then(({ getShadowBox }) => {
      const shadowBox = getShadowBox();
      if (shadowBox) {
        shadowBox.setThreshold(update.shadowBoxThreshold);
      }
    });
  }
  if (update.shadowBoxBleachGain !== undefined) {
    console.log(`📦 Shadow Box bleach gain: ${update.shadowBoxBleachGain.toFixed(2)}`);

    import('./main.js').then(({ getShadowBox }) => {
      const shadowBox = getShadowBox();
      if (shadowBox) {
        shadowBox.setGain(update.shadowBoxBleachGain);
      }
    });
  }
  // Phase 2.3.6: Shadow Box palette selector
  if (update.shadowBoxPalette !== undefined) {
    import('./main.js').then(({ getShadowBox }) => {
      const shadowBox = getShadowBox();
      if (shadowBox) {
        import('./state.js').then(({ state }) => {
          state.shadowBox.palette = update.shadowBoxPalette;

          if (update.shadowBoxPalette === 'Manual') {
            // Use manual color pickers
            const bgColor = state.shadowBox.bgColor || '#000000';
            const fgColor = state.shadowBox.fgColor || '#ffffff';
            shadowBox.setColors(bgColor, fgColor);
          } else {
            // Apply preset palette
            shadowBox.setPalette(update.shadowBoxPalette);
          }
        });
      }
    });
  }

  // Phase 2.3.5: Two-tone color controls (only apply in Manual mode)
  if (update.shadowBoxBgColor !== undefined || update.shadowBoxFgColor !== undefined) {
    import('./main.js').then(({ getShadowBox }) => {
      const shadowBox = getShadowBox();
      if (shadowBox) {
        // Get current or updated values
        import('./state.js').then(({ state }) => {
          const bgColor = update.shadowBoxBgColor || state.shadowBox.bgColor || '#000000';
          const fgColor = update.shadowBoxFgColor || state.shadowBox.fgColor || '#ffffff';

          // Update state
          if (!state.shadowBox) state.shadowBox = {};
          if (update.shadowBoxBgColor) state.shadowBox.bgColor = bgColor;
          if (update.shadowBoxFgColor) state.shadowBox.fgColor = fgColor;

          // Only apply if in Manual mode
          if (!state.shadowBox.palette || state.shadowBox.palette === 'Manual') {
            shadowBox.setColors(bgColor, fgColor);
          }
        });
      }
    });
  }
  // Legacy support
  if (update.shadowBoxGain !== undefined) {
    console.log(`📦 Shadow Box gain (legacy): ${update.shadowBoxGain.toFixed(2)}`);

    import('./main.js').then(({ getShadowBox }) => {
      const shadowBox = getShadowBox();
      if (shadowBox) {
        shadowBox.setShadowGain(update.shadowBoxGain);
      }
    });
  }

  if (update.vesselEnabled !== undefined) {
    state.vessel.enabled = update.vesselEnabled;
    console.log(`🚢 Vessel enabled: ${update.vesselEnabled}`);
  }
  if (update.vesselOpacity !== undefined) {
    state.vessel.opacity = update.vesselOpacity;
    console.log(`🚢 Vessel opacity: ${update.vesselOpacity}`);
  }
  if (update.vesselScale !== undefined) {
    state.vessel.scale = update.vesselScale;
    console.log(`🚢 Vessel scale: ${update.vesselScale}`);
  }
  if (update.vesselColor !== undefined) {
    state.vessel.color = update.vesselColor;
    console.log(`🚢 Vessel color: ${update.vesselColor}`);
  }
  if (update.vesselSpinEnabled !== undefined) {
    state.vessel.spinEnabled = update.vesselSpinEnabled;
    console.log(`🚢 Vessel spin enabled: ${update.vesselSpinEnabled}`);
  }
  if (update.vesselSpinSpeed !== undefined) {
    state.vessel.spinSpeed = update.vesselSpinSpeed;
    console.log(`🚢 Vessel spin speed: ${update.vesselSpinSpeed}`);
  }
  if (update.vesselSpinSpeedX !== undefined) {
    state.vessel.spinSpeedX = update.vesselSpinSpeedX;
    console.log(`🚢 Vessel spin speed X: ${update.vesselSpinSpeedX}`);
  }
  if (update.vesselSpinSpeedY !== undefined) {
    state.vessel.spinSpeedY = update.vesselSpinSpeedY;
    console.log(`🚢 Vessel spin speed Y: ${update.vesselSpinSpeedY}`);
  }
  if (update.vesselSpinSpeedZ !== undefined) {
    state.vessel.spinSpeedZ = update.vesselSpinSpeedZ;
    console.log(`🚢 Vessel spin speed Z: ${update.vesselSpinSpeedZ}`);
  }
  if (update.vesselMode !== undefined) {
    state.vessel.mode = update.vesselMode;
    console.log(`🚢 Vessel mode: ${update.vesselMode}`);
    // Phase 13.1.0: Reinitialize vessel when mode changes
    import('./vessel.js').then(({ reinitVessel }) => {
      import('./geometry.js').then(({ scene, renderer, camera }) => {
        reinitVessel(scene, renderer, camera);
      });
    });
  }
  // Phase 12.0: Compass rings visibility toggle
  if (update.vesselVisible !== undefined) {
    state.vessel.visible = update.vesselVisible;
    console.log(`🧭 Compass rings visible: ${update.vesselVisible}`);
    // Phase 2.2.0: Reinitialize vessel with new mode (pass renderer/camera)
    import('./vessel.js').then(({ reinitVessel }) => {
      reinitVessel(scene, renderer, camera);
    });
  }
  // Phase 13.2.0: Panel audio reactivity toggle
  if (update.vesselPanelAudioReactive !== undefined) {
    state.vessel.panelAudioReactive = update.vesselPanelAudioReactive;
    console.log(`🚢 Panel audio reactivity: ${update.vesselPanelAudioReactive ? 'ON' : 'OFF'}`);
  }
  if (update.vesselLayout !== undefined) {
    state.vessel.layout = update.vesselLayout;
    // Update layoutIndex to match
    const layouts = ["lattice", "hoops", "shells"];
    state.vessel.layoutIndex = layouts.indexOf(update.vesselLayout);
    console.log(`🚢 Vessel layout: ${update.vesselLayout} (index: ${state.vessel.layoutIndex})`);
    // Reinitialize vessel with new layout (only applies in gyre mode)
    if (state.vessel.mode === 'gyre') {
      import('./vessel.js').then(({ reinitVessel }) => {
        reinitVessel(scene, renderer, camera);
      });
    }
  }
  if (update.vesselAudioSmoothing !== undefined) {
    state.vessel.audioSmoothing = update.vesselAudioSmoothing;
    console.log(`🚢 Vessel audio smoothing: ${update.vesselAudioSmoothing}`);
  }
  if (update.vesselHueShiftRange !== undefined) {
    state.vessel.hueShiftRange = update.vesselHueShiftRange;
    console.log(`🚢 Vessel hue shift range: ${update.vesselHueShiftRange}°`);
  }
  if (update.shadowsEnabled !== undefined) {
    state.shadows.enabled = update.shadowsEnabled;
    // console.log(`🌑 Shadows);
  }
  if (update.shadowsGround !== undefined) {
    state.shadows.ground = update.shadowsGround;
    console.log(`🌑 Ground shadow: ${update.shadowsGround}`);
  }
  if (update.shadowsBackdrop !== undefined) {
    state.shadows.backdrop = update.shadowsBackdrop;
    console.log(`🌑 Backdrop shadow: ${update.shadowsBackdrop}`);
  }
  if (update.shadowsOpacity !== undefined) {
    state.shadows.opacity = update.shadowsOpacity;
    console.log(`🌑 Shadow opacity: ${update.shadowsOpacity}`);
  }
  if (update.shadowsColor !== undefined) {
    state.shadows.color = update.shadowsColor;
    console.log(`🌑 Shadow color: ${update.shadowsColor}`);
  }
  if (update.spritesEnabled !== undefined) {
    state.sprites.enabled = update.spritesEnabled;
    console.log(`✨ Sprites enabled: ${update.spritesEnabled}`);
  }
  if (update.spritesCount !== undefined) {
    state.sprites.count = update.spritesCount;
    console.log(`✨ Sprites count: ${update.spritesCount}`);
    // Reinitialize sprites with new count
    import('./sprites.js').then(({ reinitSprites }) => {
      import('./geometry.js').then(({ scene }) => {
        reinitSprites(scene);
      });
    });
  }

  // Phase 11.2.3: Per-layer color system routing via unified binding system
  if (update.colorLayer !== undefined) {
    const { colorLayer, property, value } = update;

    // Map property names: HUD sends 'audioIntensity', binding system uses 'audioIntensity'
    const mappedProperty = property; // Already aligned

    // Route through unified binding system instead of direct state mutation
    import('./controlBindings.js').then(({ applyBinding }) => {
      applyBinding(colorLayer, mappedProperty, value, "HUD");
    });
  }

  // Handle preset actions - these will be routed to the preset system
  if (update.presetAction !== undefined) {
    // This will be handled by the preset router
    if (update.presetAction === 'chain:start') {
      const loopMsg = update.chainLoop ? ' [LOOP]' : '';
      const shuffleMsg = update.chainShuffle ? ' [SHUFFLE]' : '';
      console.log(`📟 Chain action: start${loopMsg}${shuffleMsg}`, update.chainPresets, `(${update.chainDuration}ms)`);
    } else if (update.presetAction === 'chain:stop') {
      console.log("📟 Chain action: stop");
    } else if (update.presetAction === 'chain:save') {
      console.log("📟 Chain action: save", update.chainName, `(${update.chainPresets?.length || 0} presets)`);
    } else if (update.presetAction === 'chain:load') {
      console.log("📟 Chain action: load", update.chainName);
    } else if (update.presetAction === 'chain:delete') {
      console.log("📟 Chain action: delete", update.chainName);
    } else if (update.presetAction === 'chain:reset') {
      console.log("📟 Chain action: reset");
    } else {
      console.log("📟 Preset action:", update.presetAction, update.presetName);
    }
  }
  // Phase 11.7.31: Mandala HUD controls (simple toggles/sliders)
  if (update.mandalaEnabled !== undefined) {
    state.mandala.enabled = update.mandalaEnabled;
    state.emojiMandala.enabled = update.mandalaEnabled;
    console.log(`🎛️ Mandala HUD: ${update.mandalaEnabled ? 'ON' : 'OFF'}`);
  }
  if (update.mandalaRings !== undefined) {
    state.mandala.ringCount = update.mandalaRings;
    state.emojiMandala.rings = update.mandalaRings;
    // Route to controller if available
    const controller = getMandalaController?.();
    if (controller) {
      controller.setRings(update.mandalaRings);
    }
  }
  if (update.mandalaSymmetry !== undefined) {
    state.mandala.symmetry = update.mandalaSymmetry;
    state.emojiMandala.symmetry = update.mandalaSymmetry;
    // Route to controller if available
    const controller = getMandalaController?.();
    if (controller) {
      controller.setSymmetry(update.mandalaSymmetry);
    }
  }

  // Phase 11.7.24/11.7.26: Mandala Controller HUD routing
  if (update.mandala) {
    const mandala = update.mandala;
    const controller = getMandalaController?.();

    if (controller) {
      if (mandala.rings !== undefined) {
        controller.setRings(mandala.rings);
      }
      if (mandala.symmetry !== undefined) {
        controller.setSymmetry(mandala.symmetry);
      }
      if (mandala.scale !== undefined) {
        controller.setScale(mandala.scale, mandala.mode);
      }
      if (mandala.emoji !== undefined) {
        controller.swapEmoji(mandala.emoji, mandala.ringIndex);
      }
      if (mandala.rotationSpeed !== undefined) {
        controller.setRotationSpeed(mandala.rotationSpeed);
      }
      if (mandala.musicalMode !== undefined) {
        controller.setMusicalMode(mandala.musicalMode);
      }
      if (mandala.rootNote !== undefined) {
        controller.setRootNote(mandala.rootNote);
      }
      if (mandala.audioModulation !== undefined) {
        controller.setAudioModulation(mandala.audioModulation);
      }
      if (mandala.layeredAudio !== undefined) {
        controller.setLayeredAudio(mandala.layeredAudio);
      }
      if (mandala.differentialRotation !== undefined) {
        controller.setDifferentialRotation(mandala.differentialRotation);
      }
      if (mandala.scaleSequencing !== undefined) {
        controller.setScaleSequencing(mandala.scaleSequencing);
      }
      if (mandala.scaleSequence !== undefined) {
        controller.setScaleSequence(mandala.scaleSequence);
      }
      if (mandala.performanceMode !== undefined) {
        controller.setPerformanceMode(mandala.performanceMode);
      }
      // Phase 11.7.26: Layout mode routing
      if (mandala.layoutMode !== undefined) {
        controller.setLayout(mandala.layoutMode);
      }
      // Phase 11.7.27: Audio-reactive mandala routing
      if (mandala.mandalaAudioReactive !== undefined) {
        controller.setMandalaAudioReactive(mandala.mandalaAudioReactive);
      }
      if (mandala.mandalaSensitivity !== undefined) {
        controller.setMandalaSensitivity(mandala.mandalaSensitivity);
      }
      // Phase 11.7.34: Visual polish routing
      if (mandala.layoutPreset !== undefined) {
        // Apply layout preset via controller methods
        const preset = mandala.layoutPreset;
        if (preset === 'Classic') controller.applyClassic();
        else if (preset === 'Flower') controller.applyFlower();
        else if (preset === 'Spiral') controller.applySpiral();
        else if (preset === 'Dense') controller.applyDense();
      }
      if (mandala.ringSpacing !== undefined) {
        controller.setRingSpacing(mandala.ringSpacing);
      }
      if (mandala.baseRadius !== undefined) {
        controller.setBaseRadius(mandala.baseRadius);
      }
      if (mandala.globalScale !== undefined) {
        controller.setGlobalScale(mandala.globalScale);
      }
      if (mandala.rainbowMode !== undefined) {
        controller.setRainbowMode(mandala.rainbowMode);
      }
    }
  }
});

console.log("📟 HUD routing configured (Phase 11.7.24: MandalaController integration)");