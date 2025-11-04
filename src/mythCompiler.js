// src/mythCompiler.js
// Myth Layer Compiler - Binds symbolic metadata to geometry and states
// Compiles JSON myths into executable narrative experiences

import { Myth, MythNode, Archetype, MythLibrary } from './mythCore.js';
import { state } from './state.js';

console.log("🌟 mythCompiler.js loaded");

/**
 * MythCompiler - Compiles and executes myths
 * Binds archetypes/nodes to presets, destinations, visual states
 */
export class MythCompiler {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    // Myth library
    this.library = new MythLibrary();

    // Current active myth
    this.activeMythId = null;

    // Binding systems (injected)
    this.presetSystem = null; // Reference to preset system
    this.destinationSystem = null; // Reference to destination system
    this.signalRouter = null; // Reference to signal router

    // Compilation cache
    this.compiledStates = new Map(); // nodeId -> compiled visual state

    // Event listeners
    this.nodeChangeListeners = new Set();
    this.mythChangeListeners = new Set();

    console.log("🌟 MythCompiler created");
  }

  /**
   * Set system references for binding
   */
  setPresetSystem(presetSystem) {
    this.presetSystem = presetSystem;
    console.log("🌟 Preset system bound to MythCompiler");
  }

  setDestinationSystem(destinationSystem) {
    this.destinationSystem = destinationSystem;
    console.log("🌟 Destination system bound to MythCompiler");
  }

  setSignalRouter(signalRouter) {
    this.signalRouter = signalRouter;
    console.log("🌟 Signal router bound to MythCompiler");
  }

  /**
   * Compile JSON myth file
   */
  async compileJSON(jsonData) {
    try {
      const myth = Myth.fromJSON(jsonData);
      this.library.addMyth(myth);

      // Pre-compile visual states for all nodes
      await this.compileMythNodes(myth);

      console.log(`🌟 Compiled myth: ${myth.name} (${myth.nodes.size} nodes)`);
      return myth;
    } catch (err) {
      console.error("🌟 Myth compilation error:", err);
      throw err;
    }
  }

  /**
   * Compile visual states for myth nodes
   */
  async compileMythNodes(myth) {
    for (const node of myth.getAllNodes()) {
      await this.compileNode(node);
    }

    console.log(`🌟 Compiled ${myth.nodes.size} nodes for myth "${myth.name}"`);
  }

  /**
   * Compile individual node to visual state
   */
  async compileNode(node) {
    let visualState = null;

    // Priority: explicit visualState > presetName > destinationId > archetype default
    if (node.visualState) {
      // Use explicit visual state
      visualState = node.visualState;
    } else if (node.presetName && this.presetSystem) {
      // Load from preset
      const preset = this.presetSystem.getPreset?.(node.presetName);
      if (preset) {
        visualState = preset;
      } else {
        console.warn(`🌟 Preset "${node.presetName}" not found for node "${node.name}"`);
      }
    } else if (node.destinationId && this.destinationSystem) {
      // Load from destination
      const destination = this.destinationSystem.getDestination?.(node.destinationId);
      if (destination?.visualState) {
        visualState = destination.visualState;
      } else {
        console.warn(`🌟 Destination "${node.destinationId}" not found for node "${node.name}"`);
      }
    } else if (node.archetype?.visualState) {
      // Use archetype's default visual state
      visualState = node.archetype.visualState;
    }

    // Cache compiled state
    if (visualState) {
      this.compiledStates.set(node.id, visualState);
    }

    return visualState;
  }

  /**
   * Activate myth (make it the current narrative)
   */
  activateMyth(mythId) {
    const myth = this.library.getMyth(mythId);
    if (!myth) {
      console.warn(`🌟 Myth ${mythId} not found`);
      return false;
    }

    this.activeMythId = mythId;

    // Emit myth change event
    this.emitMythChange(myth);

    console.log(`🌟 Activated myth: ${myth.name}`);
    return true;
  }

  /**
   * Get active myth
   */
  getActiveMy() {
    return this.activeMythId ? this.library.getMyth(this.activeMythId) : null;
  }

  /**
   * Navigate to node in active myth
   */
  navigateToNode(nodeId) {
    const myth = this.getActiveMyth();
    if (!myth) {
      console.warn("🌟 No active myth");
      return false;
    }

    const node = myth.getNode(nodeId);
    if (!node) {
      console.warn(`🌟 Node ${nodeId} not found`);
      return false;
    }

    // Navigate in myth
    myth.navigateToNode(nodeId);

    // Apply visual state
    this.applyNodeState(node);

    // Navigate to destination if specified
    if (node.destinationId && this.destinationSystem && window.destinationNavigator) {
      const destination = this.destinationSystem.getDestination(node.destinationId);
      if (destination) {
        window.destinationNavigator.navigateTo(destination);
      }
    }

    // Emit node change event
    this.emitNodeChange(node, myth);

    console.log(`🌟 Navigated to mythic node: ${node.name}`);
    return true;
  }

  /**
   * Apply node's visual state to the system
   */
  applyNodeState(node) {
    const visualState = this.compiledStates.get(node.id);
    if (!visualState) {
      console.warn(`🌟 No compiled state for node "${node.name}"`);
      return;
    }

    // Apply to state system (similar to preset loading)
    this.applyVisualState(visualState);

    // Apply signal mapping if specified
    if (node.signalMapping && this.signalRouter) {
      this.applySignalMapping(node.signalMapping);
    }

    console.log(`🌟 Applied visual state for node "${node.name}"`);
  }

  /**
   * Apply visual state to global state
   */
  applyVisualState(visualState) {
    // Morph weights
    if (visualState.morphWeights) {
      Object.assign(state.morphWeights, visualState.morphWeights);
    }

    // Geometry transforms
    if (visualState.rotationX !== undefined) state.rotationX = visualState.rotationX;
    if (visualState.rotationY !== undefined) state.rotationY = visualState.rotationY;
    if (visualState.scale !== undefined) state.scale = visualState.scale;
    if (visualState.idleSpin !== undefined) state.idleSpin = visualState.idleSpin;

    // Visual settings
    if (visualState.color) state.color = visualState.color;
    if (visualState.hue !== undefined) state.hue = visualState.hue;
    if (visualState.lighting) Object.assign(state.lighting, visualState.lighting);

    // Audio settings
    if (visualState.audio) Object.assign(state.audio, visualState.audio);

    // Color layers
    if (visualState.colorLayers) {
      Object.keys(visualState.colorLayers).forEach(layer => {
        if (state.colorLayers[layer]) {
          Object.assign(state.colorLayers[layer], visualState.colorLayers[layer]);
        }
      });
    }

    // Voxel wave
    if (visualState.voxelWave && state.voxelWave) {
      Object.assign(state.voxelWave, visualState.voxelWave);
    }

    // Mandala
    if (visualState.mandala && state.mandala) {
      Object.assign(state.mandala, visualState.mandala);
    }
  }

  /**
   * Apply signal mapping configuration
   */
  applySignalMapping(signalMapping) {
    // Set signal source weights
    if (signalMapping.weights) {
      Object.keys(signalMapping.weights).forEach(source => {
        this.signalRouter.setSourceWeight(source, signalMapping.weights[source]);
      });
    }

    // Set mix mode
    if (signalMapping.mode) {
      this.signalRouter.setMixMode(signalMapping.mode);
    }

    // Enable/disable sources
    if (signalMapping.enabledSources) {
      signalMapping.enabledSources.forEach(source => {
        this.signalRouter.enableSource(source);
      });
    }

    console.log("🌟 Applied signal mapping");
  }

  /**
   * Start mythic journey
   */
  startJourney(mythId) {
    if (!this.activateMyth(mythId)) {
      return false;
    }

    const myth = this.getActiveMyth();
    if (!myth) return false;

    // Start from beginning
    myth.startJourney();

    // Navigate to first node
    const firstNode = myth.getCurrentNode();
    if (firstNode) {
      this.applyNodeState(firstNode);
      this.emitNodeChange(firstNode, myth);
    }

    console.log(`🌟 Started journey: ${myth.name}`);
    return true;
  }

  /**
   * Advance to next node
   */
  advanceJourney() {
    const myth = this.getActiveMyth();
    if (!myth) {
      console.warn("🌟 No active myth journey");
      return false;
    }

    const nextNodes = myth.getNextNodes();
    if (nextNodes.length === 0) {
      console.log("🌟 Journey complete - no next nodes");
      return false;
    }

    // If multiple next nodes, choose first (branching handled elsewhere)
    const nextNode = nextNodes[0];
    return this.navigateToNode(nextNode.id);
  }

  /**
   * Go back to previous node
   */
  retreatJourney() {
    const myth = this.getActiveMyth();
    if (!myth) return false;

    const prevNodes = myth.getPreviousNodes();
    if (prevNodes.length === 0) {
      console.log("🌟 At journey start - no previous nodes");
      return false;
    }

    const prevNode = prevNodes[0];
    return this.navigateToNode(prevNode.id);
  }

  /**
   * Get journey progress
   */
  getProgress() {
    const myth = this.getActiveMyth();
    return myth ? myth.getProgress() : 0;
  }

  /**
   * Get current node
   */
  getCurrentNode() {
    const myth = this.getActiveMyth();
    return myth ? myth.getCurrentNode() : null;
  }

  /**
   * Create new myth programmatically
   */
  createMyth(config = {}) {
    const myth = new Myth(config);
    this.library.addMyth(myth);
    return myth;
  }

  /**
   * Load myth from JSON file
   */
  async loadMythFromFile(file) {
    try {
      const myth = await Myth.import(file);
      this.library.addMyth(myth);
      await this.compileMythNodes(myth);
      return myth;
    } catch (err) {
      console.error("🌟 Error loading myth from file:", err);
      throw err;
    }
  }

  /**
   * Event subscription
   */
  onNodeChange(callback) {
    this.nodeChangeListeners.add(callback);
  }

  offNodeChange(callback) {
    this.nodeChangeListeners.delete(callback);
  }

  onMythChange(callback) {
    this.mythChangeListeners.add(callback);
  }

  offMythChange(callback) {
    this.mythChangeListeners.delete(callback);
  }

  /**
   * Emit events
   */
  emitNodeChange(node, myth) {
    for (const listener of this.nodeChangeListeners) {
      try {
        listener(node, myth);
      } catch (e) {
        console.error("🌟 Node change listener error:", e);
      }
    }
  }

  emitMythChange(myth) {
    for (const listener of this.mythChangeListeners) {
      try {
        listener(myth);
      } catch (e) {
        console.error("🌟 Myth change listener error:", e);
      }
    }
  }

  /**
   * Save library
   */
  saveLibrary() {
    this.library.saveToStorage();
  }

  /**
   * Load library
   */
  loadLibrary() {
    this.library.loadFromStorage();
  }

  /**
   * Get library
   */
  getLibrary() {
    return this.library;
  }

  /**
   * Get compiler info
   */
  getInfo() {
    const myth = this.getActiveMyth();
    return {
      activeMythId: this.activeMythId,
      activeMythName: myth?.name || null,
      currentNode: this.getCurrentNode()?.name || null,
      progress: this.getProgress(),
      librarySize: this.library.myths.size,
      compiledStates: this.compiledStates.size,
      hasPresetSystem: !!this.presetSystem,
      hasDestinationSystem: !!this.destinationSystem,
      hasSignalRouter: !!this.signalRouter
    };
  }
}

// Helper: Get active myth (alias for backwards compatibility)
MythCompiler.prototype.getActiveMyth = MythCompiler.prototype.getActiveMy;

console.log("🌟 Myth compiler system ready");
