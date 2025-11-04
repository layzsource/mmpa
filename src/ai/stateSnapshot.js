// src/ai/stateSnapshot.js
// State Snapshot System for AI-Aware Agents
// Captures complete scene state for AI analysis and prompt generation

console.log("🧠 stateSnapshot.js loaded");

/**
 * Scene State Snapshot
 * Complete capture of all relevant application state
 */
export class SceneStateSnapshot {
  constructor() {
    this.timestamp = Date.now();
    this.version = "1.0.0";

    // Core state categories
    this.portal = null;
    this.geometry = null;
    this.audio = null;
    this.waveforms = null;
    this.particles = null;
    this.myth = null;
    this.camera = null;
    this.destination = null;
    this.visual = null;
  }

  /**
   * Convert to JSON for storage/transmission
   */
  toJSON() {
    return {
      timestamp: this.timestamp,
      version: this.version,
      portal: this.portal,
      geometry: this.geometry,
      audio: this.audio,
      waveforms: this.waveforms,
      particles: this.particles,
      myth: this.myth,
      camera: this.camera,
      destination: this.destination,
      visual: this.visual
    };
  }

  /**
   * Get a natural language summary of the state
   */
  getSummary() {
    const parts = [];

    if (this.portal) {
      parts.push(`Portal: "${this.portal.name}" (${this.portal.type})`);
    }

    if (this.destination) {
      parts.push(`Location: ${this.destination.name}`);
    }

    if (this.geometry && this.geometry.objectCount > 0) {
      parts.push(`Geometry: ${this.geometry.objectCount} objects (${this.geometry.types.join(', ')})`);
    }

    if (this.waveforms && this.waveforms.count > 0) {
      parts.push(`Waveforms: ${this.waveforms.types.join(', ')}`);
    }

    if (this.audio && this.audio.isPlaying) {
      parts.push(`Audio: ${this.audio.activeNotes} notes, ${this.audio.tempo} BPM`);
    }

    if (this.particles) {
      parts.push(`Particles: ${this.particles.layout}, count=${this.particles.count}`);
    }

    if (this.myth) {
      parts.push(`Myth: "${this.myth.name}" at node "${this.myth.currentNode}"`);
    }

    return parts.length > 0 ? parts.join(' | ') : 'Empty scene';
  }

  /**
   * Get detailed description for AI prompt
   */
  getDetailedDescription() {
    const lines = [];

    lines.push("=== SCENE STATE ===");
    lines.push(`Timestamp: ${new Date(this.timestamp).toISOString()}`);
    lines.push("");

    if (this.portal) {
      lines.push("PORTAL:");
      lines.push(`  Name: ${this.portal.name}`);
      lines.push(`  Type: ${this.portal.type}`);
      lines.push(`  Tags: ${this.portal.tags.join(', ')}`);
      if (this.portal.description) {
        lines.push(`  Description: ${this.portal.description}`);
      }
      lines.push("");
    }

    if (this.destination) {
      lines.push("DESTINATION:");
      lines.push(`  Name: ${this.destination.name}`);
      lines.push(`  Category: ${this.destination.category}`);
      lines.push(`  Position: (${this.destination.position.join(', ')})`);
      lines.push("");
    }

    if (this.geometry) {
      lines.push("GEOMETRY:");
      lines.push(`  Object count: ${this.geometry.objectCount}`);
      lines.push(`  Types: ${this.geometry.types.join(', ')}`);
      lines.push(`  Morph weights: ${JSON.stringify(this.geometry.morphWeights)}`);
      if (this.geometry.objects.length > 0) {
        lines.push(`  Objects:`);
        this.geometry.objects.slice(0, 5).forEach(obj => {
          lines.push(`    - ${obj.type} at (${obj.position.map(n => n.toFixed(1)).join(', ')}), ${obj.audioReactive ? 'audio-reactive' : 'static'}`);
        });
        if (this.geometry.objects.length > 5) {
          lines.push(`    ... and ${this.geometry.objects.length - 5} more`);
        }
      }
      lines.push("");
    }

    if (this.waveforms) {
      lines.push("WAVEFORMS:");
      lines.push(`  Count: ${this.waveforms.count}`);
      lines.push(`  Types: ${this.waveforms.types.join(', ')}`);
      this.waveforms.fields.forEach(field => {
        lines.push(`    - ${field.type}: amplitude=${field.amplitude}, audioBand=${field.audioBand}`);
      });
      lines.push("");
    }

    if (this.audio) {
      lines.push("AUDIO:");
      lines.push(`  Playing: ${this.audio.isPlaying ? 'Yes' : 'No'}`);
      lines.push(`  Active notes: ${this.audio.activeNotes}`);
      lines.push(`  Tempo: ${this.audio.tempo} BPM`);
      lines.push(`  Frequencies: bass=${this.audio.frequencies.bass.toFixed(2)}, mid=${this.audio.frequencies.mid.toFixed(2)}, treble=${this.audio.frequencies.treble.toFixed(2)}`);
      lines.push("");
    }

    if (this.particles) {
      lines.push("PARTICLES:");
      lines.push(`  Layout: ${this.particles.layout}`);
      lines.push(`  Count: ${this.particles.count}`);
      lines.push(`  Size: ${this.particles.size}`);
      lines.push(`  Organic flow: ${this.particles.organicFlow}`);
      lines.push("");
    }

    if (this.myth) {
      lines.push("MYTH/NARRATIVE:");
      lines.push(`  Name: ${this.myth.name}`);
      lines.push(`  Current node: ${this.myth.currentNode}`);
      lines.push(`  Archetypes: ${this.myth.archetypes.join(', ')}`);
      lines.push(`  Progress: ${this.myth.progress}%`);
      lines.push("");
    }

    if (this.camera) {
      lines.push("CAMERA:");
      lines.push(`  Position: (${this.camera.position.map(n => n.toFixed(1)).join(', ')})`);
      lines.push(`  Rotation: (${this.camera.rotation.map(n => n.toFixed(2)).join(', ')})`);
      lines.push("");
    }

    if (this.visual) {
      lines.push("VISUAL PARAMETERS:");
      lines.push(`  Background: ${this.visual.backgroundColor}`);
      lines.push(`  Morph input: ${this.visual.morphInput}`);
      lines.push(`  Rotation: ${this.visual.rotation.toFixed(2)}`);
      lines.push("");
    }

    return lines.join('\n');
  }
}

/**
 * State Snapshot Capturer
 * Captures state from all active systems
 */
export class StateSnapshotCapturer {
  constructor() {
    this.history = [];
    this.maxHistorySize = 50; // Keep last 50 snapshots

    console.log("🧠 StateSnapshotCapturer initialized");
  }

  /**
   * Capture current scene state
   */
  captureState() {
    const snapshot = new SceneStateSnapshot();

    // Capture portal state
    if (window.portalManager) {
      snapshot.portal = this.capturePortalState();
    }

    // Capture geometry state
    if (window.geometryBuilder || window.vessel) {
      snapshot.geometry = this.captureGeometryState();
    }

    // Capture audio state
    if (window.audioRouter || window.audio) {
      snapshot.audio = this.captureAudioState();
    }

    // Capture waveform state
    if (window.waveformEditor) {
      snapshot.waveforms = this.captureWaveformState();
    }

    // Capture particle state
    if (window.particles) {
      snapshot.particles = this.captureParticleState();
    }

    // Capture myth state
    if (window.mythCompiler) {
      snapshot.myth = this.captureMythState();
    }

    // Capture camera state
    if (window.camera) {
      snapshot.camera = this.captureCameraState();
    }

    // Capture destination state
    if (window.destinationNavigation) {
      snapshot.destination = this.captureDestinationState();
    }

    // Capture visual state
    if (window.vessel || window.state) {
      snapshot.visual = this.captureVisualState();
    }

    // Add to history
    this.history.push(snapshot);
    if (this.history.length > this.maxHistorySize) {
      this.history.shift(); // Remove oldest
    }

    console.log("🧠 State snapshot captured:", snapshot.getSummary());

    return snapshot;
  }

  /**
   * Capture portal state
   */
  capturePortalState() {
    if (!window.portalManager) return null;

    const activePortalId = window.portalManager.activePortalId;
    if (!activePortalId) return null;

    const portal = window.portalManager.getPortal(activePortalId);
    if (!portal) return null;

    return {
      id: portal.id,
      name: portal.name,
      type: portal.type,
      tags: portal.tags || [],
      description: portal.description || '',
      geometryCount: portal.geometry ? portal.geometry.length : 0,
      hasWavefield: portal.wavefield && portal.wavefield.enabled,
      hasSkybox: !!portal.skybox,
      locked: portal.locked || false,
      visited: portal.visited || false
    };
  }

  /**
   * Capture geometry state
   */
  captureGeometryState() {
    const state = {
      objectCount: 0,
      objects: [],
      types: [],
      morphWeights: {},
      audioReactiveCount: 0
    };

    // Get objects from geometry builder
    if (window.geometryBuilder && window.geometryBuilder.getAllObjects) {
      const objects = window.geometryBuilder.getAllObjects();
      state.objectCount = objects.length;

      objects.forEach(obj => {
        state.objects.push({
          id: obj.id,
          type: obj.type,
          position: obj.position || [0, 0, 0],
          material: obj.material ? {
            color: obj.material.color,
            wireframe: obj.material.wireframe
          } : null,
          audioReactive: obj.audioReactive || false
        });

        if (obj.type && !state.types.includes(obj.type)) {
          state.types.push(obj.type);
        }

        if (obj.audioReactive) {
          state.audioReactiveCount++;
        }
      });
    }

    // Get morph weights from vessel
    if (window.vessel && window.vessel.morphWeights) {
      state.morphWeights = { ...window.vessel.morphWeights };
    }

    return state;
  }

  /**
   * Capture audio state
   */
  captureAudioState() {
    const state = {
      isPlaying: false,
      activeNotes: 0,
      tempo: 120,
      frequencies: {
        bass: 0,
        mid: 0,
        treble: 0
      },
      volume: 1.0
    };

    // Get audio data from audioRouter
    if (window.audioRouter) {
      if (window.audioRouter.getActiveNotes) {
        const notes = window.audioRouter.getActiveNotes();
        state.activeNotes = notes ? notes.length : 0;
        state.isPlaying = state.activeNotes > 0;
      }

      if (window.audioRouter.getTempo) {
        state.tempo = window.audioRouter.getTempo() || 120;
      }

      if (window.audioRouter.getFrequencyData) {
        const freqData = window.audioRouter.getFrequencyData();
        if (freqData) {
          state.frequencies.bass = freqData.bass || 0;
          state.frequencies.mid = freqData.mid || 0;
          state.frequencies.treble = freqData.treble || 0;
        }
      }
    }

    // Fallback to audio module
    if (window.audio) {
      state.volume = window.audio.volume || 1.0;
    }

    return state;
  }

  /**
   * Capture waveform state
   */
  captureWaveformState() {
    if (!window.waveformEditor) return null;

    const fields = window.waveformEditor.getAllFields ?
                   window.waveformEditor.getAllFields() : [];

    const state = {
      count: fields.length,
      types: [],
      fields: []
    };

    fields.forEach(field => {
      if (field.type && !state.types.includes(field.type)) {
        state.types.push(field.type);
      }

      state.fields.push({
        id: field.id,
        type: field.type,
        amplitude: field.amplitude || 0.8,
        frequency: field.frequency || 1.2,
        audioBand: field.audioBand || 'bass',
        color: field.color || '#00FFFF'
      });
    });

    return state;
  }

  /**
   * Capture particle state
   */
  captureParticleState() {
    if (!window.particles) return null;

    return {
      layout: window.particles.layout || 'orbit',
      count: window.particles.count || 5000,
      size: window.particles.size || 0.5,
      speed: window.particles.speed || 0.05,
      organicFlow: window.particles.organicFlow || 0,
      color: window.particles.color || '#ffffff'
    };
  }

  /**
   * Capture myth/narrative state
   */
  captureMythState() {
    if (!window.mythCompiler) return null;

    const currentMyth = window.mythCompiler.currentMyth;
    if (!currentMyth) return null;

    const state = {
      name: currentMyth.name,
      author: currentMyth.author,
      category: currentMyth.category,
      currentNode: null,
      archetypes: [],
      progress: 0
    };

    // Get current node
    if (window.mythCompiler.currentNode) {
      state.currentNode = window.mythCompiler.currentNode.name;
    }

    // Get archetypes
    if (window.mythCompiler.getActiveArchetypes) {
      const archetypes = window.mythCompiler.getActiveArchetypes();
      state.archetypes = archetypes.map(a => a.name);
    }

    // Calculate progress (rough estimate)
    if (currentMyth.nodes && window.mythCompiler.currentNode) {
      const totalNodes = Object.keys(currentMyth.nodes).length;
      const visitedNodes = window.mythCompiler.visitedNodes ?
                          window.mythCompiler.visitedNodes.size : 0;
      state.progress = Math.round((visitedNodes / totalNodes) * 100);
    }

    return state;
  }

  /**
   * Capture camera state
   */
  captureCameraState() {
    if (!window.camera) return null;

    return {
      position: [
        window.camera.position.x,
        window.camera.position.y,
        window.camera.position.z
      ],
      rotation: [
        window.camera.rotation.x,
        window.camera.rotation.y,
        window.camera.rotation.z
      ]
    };
  }

  /**
   * Capture destination state
   */
  captureDestinationState() {
    if (!window.destinationNavigation) return null;

    const currentDest = window.destinationNavigation.currentDestination;
    if (!currentDest) return null;

    return {
      id: currentDest.id,
      name: currentDest.name,
      category: currentDest.category,
      description: currentDest.description || '',
      position: currentDest.position || [0, 0, 0],
      color: currentDest.color || '#ffffff'
    };
  }

  /**
   * Capture visual state
   */
  captureVisualState() {
    const state = {};

    if (window.state) {
      state.backgroundColor = window.state.backgroundColor || '#000000';
      state.morphInput = window.state.morphInput || 'manual';
    }

    if (window.vessel) {
      state.rotation = window.vessel.rotation || 0;
      state.scale = window.vessel.scale || 1;
    }

    return state;
  }

  /**
   * Get the most recent snapshot
   */
  getLastSnapshot() {
    return this.history.length > 0 ?
           this.history[this.history.length - 1] : null;
  }

  /**
   * Get snapshot history
   */
  getHistory(count = 10) {
    return this.history.slice(-count);
  }

  /**
   * Compare two snapshots and get differences
   */
  compareSnapshots(snapshot1, snapshot2) {
    const differences = [];

    // Compare portal
    if (snapshot1.portal?.id !== snapshot2.portal?.id) {
      differences.push({
        category: 'portal',
        change: 'switched',
        from: snapshot1.portal?.name,
        to: snapshot2.portal?.name
      });
    }

    // Compare geometry count
    if (snapshot1.geometry?.objectCount !== snapshot2.geometry?.objectCount) {
      differences.push({
        category: 'geometry',
        change: 'object count',
        from: snapshot1.geometry?.objectCount,
        to: snapshot2.geometry?.objectCount
      });
    }

    // Compare waveform count
    if (snapshot1.waveforms?.count !== snapshot2.waveforms?.count) {
      differences.push({
        category: 'waveforms',
        change: 'field count',
        from: snapshot1.waveforms?.count,
        to: snapshot2.waveforms?.count
      });
    }

    // Compare audio state
    if (snapshot1.audio?.isPlaying !== snapshot2.audio?.isPlaying) {
      differences.push({
        category: 'audio',
        change: 'playback',
        from: snapshot1.audio?.isPlaying ? 'playing' : 'stopped',
        to: snapshot2.audio?.isPlaying ? 'playing' : 'stopped'
      });
    }

    return differences;
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.history = [];
    console.log("🧠 State snapshot history cleared");
  }
}

// Create global instance
export const stateSnapshotCapturer = new StateSnapshotCapturer();

// Add to window for easy access
if (typeof window !== 'undefined') {
  window.stateSnapshotCapturer = stateSnapshotCapturer;
}

console.log("🧠 State Snapshot System ready");
