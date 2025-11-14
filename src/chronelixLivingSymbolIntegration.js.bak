/**
 * 🌸 Chronelix Living Symbol - Integration Layer
 *
 * Connects Living Symbol visualization mode to MMPA data pipeline
 * Manages mode switching between Standard, Analysis, and Living Symbol
 *
 * Living Symbol Architecture:
 * - IVM Core: Stella Octangula (contraction) + Cuboctahedron (expansion)
 * - Flower of Life: Input base plate (data entry point)
 * - Dharma Wheel: Output consciousness symbol (data exit point)
 * - Enveloping Chestahedron: Field boundary
 * - Data Flow: Visible particle streams showing pipeline
 * - Double Vortex: True bidirectional toroidal flow
 */

import * as THREE from 'three';
import { state } from './state.js';
import {
  DataFlowManager,
  IVMDoubleVortex,
  SlicerPlane,
  LIVING_SYMBOL_CONFIG
} from './chronelixLivingSymbol.js';
import {
  createStellaOctangula,
  createCuboctahedron,
  createFlowerOfLifePlate,
  createDharmaWheel,
  createEnvelopingChestahedron,
  createPhiLine,
  createCenterAxis
} from './chronelixLivingSymbolGeometry.js';
import { getSynthArchetype, isSynthMode } from './synthPitchMapper.js';

console.log('🌸 chronelixLivingSymbolIntegration.js loaded');

const PHI = 1.618033988749;

/**
 * Chronelix visualization modes
 */
export const ChronelixMode = {
  STANDARD: 'STANDARD',           // Original AM/PM helix chains
  ANALYSIS: 'ANALYSIS',           // Analysis overlays (particles, gates, etc.)
  LIVING_SYMBOL: 'LIVING_SYMBOL'  // Living Symbol IVM cosmology
};

/**
 * Living Symbol Integration Manager
 * Manages the complete Living Symbol visualization mode
 */
export class LivingSymbolIntegration {
  constructor() {
    this.enabled = false;
    this.scene = null;
    this.chronelixGroup = null;
    this.livingSymbolGroup = null;

    // Geometry components
    this.stellaOctangula = null;
    this.cuboctahedron = null;
    this.flowerOfLifePlate = null;
    this.dharmaWheel = null;
    this.envelopingField = null;
    this.phiLine = null;
    this.centerAxis = null;

    // Dynamic systems
    this.dataFlowManager = null;
    this.ivmDoubleVortex = null;
    this.slicerPlane = null;

    // Animation state
    this.breathPhase = 0;
    this.breathRate = 0.5; // Hz
    this.time = 0;

    // Nested φ scaling for mathematical coherence
    this.scales = {
      ivmCore: 6.0,                    // Base IVM scale
      stellaInner: 6.0,                // Stella Octangula (contraction)
      cuboOuter: 6.0 * PHI,            // Cuboctahedron (expansion) - φ ratio
      flowerOfLifeRadius: 6.0 * PHI * PHI,  // Base plate - φ²
      dharmaWheelRadius: 6.0,          // Top wheel
      helixRadius: 6.0 * PHI,          // Data flow helix
      fieldScale: 1.0                  // Enveloping field scale factor
    };

    // Vertical positions (φ-based spacing)
    this.positions = {
      yBottom: -10.0,                  // Flower of Life base
      yIVMCore: 0.0,                   // IVM at center
      yTop: 10.0,                      // Dharma Wheel apex
      yFlowerOfLife: -10.5,            // Base plate slightly below
      yDharmaWheel: 10.5               // Top wheel slightly above
    };

    console.log('🌸 LivingSymbolIntegration initialized');
  }

  /**
   * Initialize Living Symbol mode
   * @param {THREE.Scene} scene - Three.js scene
   * @param {THREE.Group} chronelixGroup - Chronelix group container
   */
  init(scene, chronelixGroup) {
    if (!scene || !chronelixGroup) {
      console.error('❌ Cannot initialize Living Symbol: missing scene or chronelixGroup');
      return false;
    }

    this.scene = scene;
    this.chronelixGroup = chronelixGroup;

    // Create container group for all Living Symbol geometry
    this.livingSymbolGroup = new THREE.Group();
    this.livingSymbolGroup.visible = false; // Hidden by default
    this.livingSymbolGroup.name = 'LivingSymbol';
    this.chronelixGroup.add(this.livingSymbolGroup);

    // Build geometry
    this.buildGeometry();

    // Initialize dynamic systems
    this.initDynamicSystems();

    console.log('✅ Living Symbol mode initialized', {
      scales: this.scales,
      positions: this.positions
    });

    return true;
  }

  /**
   * Build all Living Symbol geometry
   */
  buildGeometry() {
    // 1. IVM Core - Stella Octangula (contraction)
    this.stellaOctangula = createStellaOctangula(this.scales.stellaInner);
    this.stellaOctangula.position.y = this.positions.yIVMCore;
    this.stellaOctangula.name = 'StellaOctangula';
    this.livingSymbolGroup.add(this.stellaOctangula);

    // 2. IVM Core - Cuboctahedron (expansion)
    this.cuboctahedron = createCuboctahedron(this.scales.cuboOuter);
    this.cuboctahedron.position.y = this.positions.yIVMCore;
    this.cuboctahedron.name = 'Cuboctahedron';
    this.livingSymbolGroup.add(this.cuboctahedron);

    // 3. Flower of Life base plate (input)
    this.flowerOfLifePlate = createFlowerOfLifePlate(
      this.scales.flowerOfLifeRadius,
      this.positions.yFlowerOfLife
    );
    this.flowerOfLifePlate.name = 'FlowerOfLife';
    this.livingSymbolGroup.add(this.flowerOfLifePlate);

    // 4. Dharma Wheel top (output/consciousness)
    this.dharmaWheel = createDharmaWheel(
      this.scales.dharmaWheelRadius,
      this.positions.yDharmaWheel
    );
    this.dharmaWheel.name = 'DharmaWheel';
    this.livingSymbolGroup.add(this.dharmaWheel);

    // 5. Enveloping Chestahedron field
    this.envelopingField = createEnvelopingChestahedron(
      this.positions.yTop,
      this.positions.yBottom,
      this.scales.fieldScale
    );
    this.envelopingField.name = 'EnvelopingField';
    this.livingSymbolGroup.add(this.envelopingField);

    // 6. Phi line (golden ratio axis)
    this.phiLine = createPhiLine(this.positions.yBottom, this.positions.yTop);
    this.phiLine.name = 'PhiLine';
    this.livingSymbolGroup.add(this.phiLine);

    // 7. Center axis (reference)
    this.centerAxis = createCenterAxis(this.positions.yBottom, this.positions.yTop);
    this.centerAxis.name = 'CenterAxis';
    this.livingSymbolGroup.add(this.centerAxis);

    console.log('✅ Living Symbol geometry built', {
      children: this.livingSymbolGroup.children.length
    });
  }

  /**
   * Initialize dynamic systems (data flow, vortex, slicer)
   */
  initDynamicSystems() {
    // 1. Data Flow Manager - Particle streams
    this.dataFlowManager = new DataFlowManager(
      this.livingSymbolGroup,
      this.positions.yTop,
      this.positions.yBottom,
      this.scales.helixRadius
    );

    // 2. IVM Double Vortex - Contraction/expansion dynamics
    this.ivmDoubleVortex = new IVMDoubleVortex(
      this.stellaOctangula,
      this.cuboctahedron
    );

    // 3. Slicer Plane - Horizontal scanning visualization
    this.slicerPlane = new SlicerPlane(
      this.scales.helixRadius * 1.5,
      this.positions.yBottom,
      this.positions.yTop,
      this.livingSymbolGroup
    );

    console.log('✅ Living Symbol dynamic systems initialized');
  }

  /**
   * Enable Living Symbol mode
   */
  enable() {
    if (!this.livingSymbolGroup) {
      console.error('❌ Cannot enable: Living Symbol not initialized');
      return false;
    }

    this.livingSymbolGroup.visible = true;
    this.enabled = true;

    console.log('🌸 Living Symbol mode ENABLED');
    return true;
  }

  /**
   * Disable Living Symbol mode
   */
  disable() {
    if (!this.livingSymbolGroup) return;

    this.livingSymbolGroup.visible = false;
    this.enabled = false;

    console.log('🌸 Living Symbol mode DISABLED');
  }

  /**
   * Main update loop
   * @param {number} deltaTime - Time since last frame (seconds)
   */
  update(deltaTime) {
    if (!this.enabled) return;

    this.time += deltaTime;

    // 1. Update breath phase (global expansion/contraction cycle)
    this.breathPhase = Math.sin(this.time * this.breathRate * Math.PI * 2);

    // 2. Get current MMPA archetype
    const archetype = this.getCurrentArchetype();

    // 3. Update IVM Double Vortex (contraction/expansion)
    if (this.ivmDoubleVortex) {
      this.ivmDoubleVortex.updateFromArchetype(archetype);
      this.ivmDoubleVortex.update(this.breathPhase);
    }

    // 4. Update data flow (particle streams)
    if (this.dataFlowManager) {
      // Set data activity levels from MMPA sources
      const activity = this.getDataActivity();
      this.dataFlowManager.setDataActivity('AUDIO', activity.audio);
      this.dataFlowManager.setDataActivity('FINANCIAL', activity.financial);
      this.dataFlowManager.setDataActivity('SYNTH', activity.synth);

      // Update particles
      this.dataFlowManager.update(deltaTime);
    }

    // 5. Update slicer plane
    if (this.slicerPlane) {
      this.slicerPlane.update(this.time);
    }

    // 6. Rotate Dharma Wheel slowly
    if (this.dharmaWheel) {
      this.dharmaWheel.rotation.y += deltaTime * 0.1;
    }

    // 7. Subtle Flower of Life rotation
    if (this.flowerOfLifePlate) {
      this.flowerOfLifePlate.rotation.z += deltaTime * 0.05;
    }
  }

  /**
   * Get current MMPA archetype
   * Priority: Synth (if active) > Audio MMPA > Default
   */
  getCurrentArchetype() {
    // Check if synth is active
    if (isSynthMode()) {
      const synthArchetype = getSynthArchetype();
      if (synthArchetype) {
        return synthArchetype;
      }
    }

    // Fall back to audio MMPA
    if (state.mmpaFeatures?.enabled) {
      const recipe = state.recipeInterpretation;
      if (recipe?.interpretation?.archetype) {
        return recipe.interpretation.archetype;
      }
    }

    // Default
    return 'NEUTRAL_STATE';
  }

  /**
   * Get data activity levels (0-1) for particle spawning
   */
  getDataActivity() {
    const activity = {
      audio: 0,
      financial: 0,
      synth: 0
    };

    // Audio activity from spectral energy
    if (state.mmpaFeatures?.enabled) {
      const spectral = state.mmpaFeatures.spectral;
      if (spectral) {
        const totalEnergy = (spectral.bass || 0) + (spectral.mid || 0) + (spectral.treble || 0);
        activity.audio = Math.min(1.0, totalEnergy / 3);
      }
    }

    // Financial activity from change rate
    if (state.financialData?.BTC?.price) {
      const btcPrice = state.financialData.BTC.price;
      const priceChange = Math.abs(state.financialData.BTC.change24h || 0);
      // Normalize to 0-1 (10% change = full activity)
      activity.financial = Math.min(1.0, priceChange / 10);
    }

    // Synth activity (always max when active)
    if (isSynthMode()) {
      activity.synth = 1.0;
    }

    return activity;
  }

  /**
   * Set breath rate (Hz)
   */
  setBreathRate(rate) {
    this.breathRate = Math.max(0.1, Math.min(2.0, rate));
    console.log(`🌸 Breath rate: ${this.breathRate.toFixed(2)} Hz`);
  }

  /**
   * Set field scale
   */
  setFieldScale(scale) {
    this.scales.fieldScale = Math.max(0.5, Math.min(2.0, scale));

    // Rebuild enveloping field with new scale
    if (this.envelopingField) {
      this.livingSymbolGroup.remove(this.envelopingField);
      this.envelopingField = createEnvelopingChestahedron(
        this.positions.yTop,
        this.positions.yBottom,
        this.scales.fieldScale
      );
      this.envelopingField.name = 'EnvelopingField';
      this.livingSymbolGroup.add(this.envelopingField);
    }

    console.log(`🌸 Field scale: ${this.scales.fieldScale.toFixed(2)}`);
  }

  /**
   * Toggle slicer visibility
   */
  toggleSlicer() {
    if (this.slicerPlane) {
      this.slicerPlane.mesh.visible = !this.slicerPlane.mesh.visible;
      console.log(`🌸 Slicer: ${this.slicerPlane.mesh.visible ? 'visible' : 'hidden'}`);
    }
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    const activity = this.getDataActivity();
    const archetype = this.getCurrentArchetype();

    return {
      enabled: this.enabled,
      mode: 'LIVING_SYMBOL',
      archetype: archetype,
      breathPhase: this.breathPhase.toFixed(3),
      breathRate: this.breathRate.toFixed(2) + ' Hz',
      time: this.time.toFixed(1) + 's',
      dataActivity: {
        audio: (activity.audio * 100).toFixed(0) + '%',
        financial: (activity.financial * 100).toFixed(0) + '%',
        synth: (activity.synth * 100).toFixed(0) + '%'
      },
      particles: this.dataFlowManager ? {
        active: this.dataFlowManager.particles.length,
        total: this.dataFlowManager.stats.totalSpawned,
        processed: this.dataFlowManager.stats.processed
      } : null,
      ivmDoubleVortex: this.ivmDoubleVortex ? {
        harmony: this.ivmDoubleVortex.currentHarmony.toFixed(3),
        chaos: this.ivmDoubleVortex.currentChaos.toFixed(3)
      } : null
    };
  }
}

/**
 * Chronelix Mode Manager
 * Manages switching between visualization modes
 */
export class ChronelixModeManager {
  constructor() {
    this.currentMode = ChronelixMode.STANDARD;
    this.livingSymbolIntegration = null;
    this.standardGroup = null; // Original AM/PM chains
    this.analysisVisible = false;

    console.log('🌸 ChronelixModeManager initialized');
  }

  /**
   * Initialize mode manager
   * @param {THREE.Scene} scene - Three.js scene
   * @param {THREE.Group} chronelixGroup - Chronelix group
   */
  init(scene, chronelixGroup) {
    if (!scene || !chronelixGroup) {
      console.error('❌ Cannot initialize mode manager: missing scene or chronelixGroup');
      return false;
    }

    // Store reference to standard visualization (AM/PM chains)
    this.standardGroup = chronelixGroup;

    // Initialize Living Symbol integration
    this.livingSymbolIntegration = new LivingSymbolIntegration();
    const success = this.livingSymbolIntegration.init(scene, chronelixGroup);

    if (!success) {
      console.error('❌ Failed to initialize Living Symbol mode');
      return false;
    }

    // Start in standard mode
    this.setMode(ChronelixMode.STANDARD);

    console.log('✅ Chronelix Mode Manager initialized');
    return true;
  }

  /**
   * Set visualization mode
   * @param {string} mode - ChronelixMode value
   */
  setMode(mode) {
    if (!Object.values(ChronelixMode).includes(mode)) {
      console.error(`❌ Invalid mode: ${mode}`);
      return false;
    }

    console.log(`🌸 Switching to ${mode} mode`);

    // Update visibility based on mode
    switch (mode) {
      case ChronelixMode.STANDARD:
        this.showStandard();
        this.hideAnalysis();
        this.hideLivingSymbol();
        break;

      case ChronelixMode.ANALYSIS:
        this.showStandard();
        this.showAnalysis();
        this.hideLivingSymbol();
        break;

      case ChronelixMode.LIVING_SYMBOL:
        this.hideStandard();
        this.hideAnalysis();
        this.showLivingSymbol();
        break;
    }

    this.currentMode = mode;
    console.log(`✅ Mode switched to ${mode}`);
    return true;
  }

  /**
   * Toggle to next mode (cycle through modes)
   */
  toggleMode() {
    const modes = Object.values(ChronelixMode);
    const currentIndex = modes.indexOf(this.currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex];

    this.setMode(nextMode);
  }

  /**
   * Show standard AM/PM chains
   */
  showStandard() {
    if (!this.standardGroup) return;

    // Show AM and PM chains
    this.standardGroup.children.forEach(child => {
      if (child.name !== 'LivingSymbol') {
        child.visible = true;
      }
    });
  }

  /**
   * Hide standard AM/PM chains
   */
  hideStandard() {
    if (!this.standardGroup) return;

    // Hide AM and PM chains (but not Living Symbol)
    this.standardGroup.children.forEach(child => {
      if (child.name !== 'LivingSymbol') {
        child.visible = false;
      }
    });
  }

  /**
   * Show analysis overlays (particles, gates, etc.)
   */
  showAnalysis() {
    // Analysis overlays are managed by chronelixMMPAIntegrator
    // This would enable visibility of particle streams, gates, etc.
    this.analysisVisible = true;
    console.log('🌸 Analysis overlays visible');
  }

  /**
   * Hide analysis overlays
   */
  hideAnalysis() {
    this.analysisVisible = false;
    console.log('🌸 Analysis overlays hidden');
  }

  /**
   * Show Living Symbol mode
   */
  showLivingSymbol() {
    if (this.livingSymbolIntegration) {
      this.livingSymbolIntegration.enable();
    }
  }

  /**
   * Hide Living Symbol mode
   */
  hideLivingSymbol() {
    if (this.livingSymbolIntegration) {
      this.livingSymbolIntegration.disable();
    }
  }

  /**
   * Update current mode
   * @param {number} deltaTime - Time since last frame (seconds)
   */
  update(deltaTime) {
    // Update Living Symbol if in that mode
    if (this.currentMode === ChronelixMode.LIVING_SYMBOL && this.livingSymbolIntegration) {
      this.livingSymbolIntegration.update(deltaTime);
    }
  }

  /**
   * Get current mode
   */
  getMode() {
    return this.currentMode;
  }

  /**
   * Get Living Symbol integration (for direct access)
   */
  getLivingSymbol() {
    return this.livingSymbolIntegration;
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    const info = {
      currentMode: this.currentMode,
      analysisVisible: this.analysisVisible
    };

    if (this.currentMode === ChronelixMode.LIVING_SYMBOL && this.livingSymbolIntegration) {
      info.livingSymbol = this.livingSymbolIntegration.getDebugInfo();
    }

    return info;
  }
}

// Create singleton instance
export const chronelixModeManager = new ChronelixModeManager();

// Expose globally for debugging
if (typeof window !== 'undefined') {
  window.chronelixModeManager = chronelixModeManager;
  window.ChronelixMode = ChronelixMode;
}

console.log('✅ chronelixLivingSymbolIntegration.js ready');
