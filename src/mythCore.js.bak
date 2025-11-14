// src/mythCore.js
// Myth Layer Compiler - Core system for symbolic metadata
// Maps archetypes, myths, and glyphs onto geometry and states

console.log("🌟 mythCore.js loaded");

/**
 * Archetype - Universal symbolic patterns (Jung, Campbell, etc.)
 */
export class Archetype {
  constructor(config = {}) {
    this.id = config.id || `archetype_${Date.now()}`;
    this.name = config.name || 'Unnamed Archetype';
    this.category = config.category || 'universal'; // universal | hero | shadow | anima | trickster | sage | etc.
    this.description = config.description || '';

    // Visual attributes
    this.color = config.color || '#ffffff';
    this.glyph = config.glyph || '○';  // Unicode character or emoji
    this.geometry = config.geometry || 'sphere'; // Preferred morph shape

    // Symbolic attributes
    this.qualities = config.qualities || []; // ['wisdom', 'transformation', etc.]
    this.opposites = config.opposites || []; // Dialectical pairs
    this.associations = config.associations || {}; // { element: 'fire', direction: 'east', etc. }

    // Narrative role
    this.narrativeFunction = config.narrativeFunction || 'neutral'; // helper | threshold | mentor | shadow

    // State mapping
    this.visualState = config.visualState || null; // Preset or visual configuration

    console.log(`🌟 Archetype created: ${this.name} (${this.category})`);
  }

  /**
   * Check if this archetype resonates with qualities
   */
  hasQuality(quality) {
    return this.qualities.includes(quality);
  }

  /**
   * Get dialectical opposite
   */
  getOpposite() {
    return this.opposites[0] || null;
  }

  /**
   * Serialize to JSON
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      description: this.description,
      color: this.color,
      glyph: this.glyph,
      geometry: this.geometry,
      qualities: this.qualities,
      opposites: this.opposites,
      associations: this.associations,
      narrativeFunction: this.narrativeFunction,
      visualState: this.visualState
    };
  }

  /**
   * Load from JSON
   */
  static fromJSON(data) {
    return new Archetype(data);
  }
}

/**
 * MythNode - A moment in a mythic narrative
 * Binds archetype + visual state + narrative metadata
 */
export class MythNode {
  constructor(config = {}) {
    this.id = config.id || `node_${Date.now()}`;
    this.name = config.name || 'Unnamed Node';
    this.description = config.description || '';

    // Archetype binding
    this.archetypeId = config.archetypeId || null;
    this.archetype = null; // Set by MythCompiler

    // Visual state (preset name or full state object)
    this.visualState = config.visualState || null;
    this.presetName = config.presetName || null;
    this.destinationId = config.destinationId || null;

    // Narrative metadata
    this.narrativeStage = config.narrativeStage || 'threshold'; // departure | initiation | return | etc.
    this.mytheme = config.mytheme || null; // Core symbolic theme
    this.transformation = config.transformation || null; // What changes at this node

    // Glyph overlay
    this.glyph = config.glyph || null; // Override archetype glyph
    this.glyphPosition = config.glyphPosition || 'center'; // center | top | bottom | left | right
    this.glyphScale = config.glyphScale || 1.0;

    // Connections
    this.nextNodes = config.nextNodes || []; // Array of node IDs
    this.previousNodes = config.previousNodes || [];
    this.branchCondition = config.branchCondition || null; // For non-linear myths

    // Audio / Signal associations
    this.soundscape = config.soundscape || null;
    this.signalMapping = config.signalMapping || null;

    // Duration / Timing
    this.duration = config.duration || null; // ms, or null for manual navigation
    this.autoAdvance = config.autoAdvance || false;

    console.log(`🌟 MythNode created: ${this.name}`);
  }

  /**
   * Serialize to JSON
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      archetypeId: this.archetypeId,
      visualState: this.visualState,
      presetName: this.presetName,
      destinationId: this.destinationId,
      narrativeStage: this.narrativeStage,
      mytheme: this.mytheme,
      transformation: this.transformation,
      glyph: this.glyph,
      glyphPosition: this.glyphPosition,
      glyphScale: this.glyphScale,
      nextNodes: this.nextNodes,
      previousNodes: this.previousNodes,
      branchCondition: this.branchCondition,
      soundscape: this.soundscape,
      signalMapping: this.signalMapping,
      duration: this.duration,
      autoAdvance: this.autoAdvance
    };
  }

  /**
   * Load from JSON
   */
  static fromJSON(data) {
    return new MythNode(data);
  }
}

/**
 * Myth - A complete mythic narrative structure
 */
export class Myth {
  constructor(config = {}) {
    this.id = config.id || `myth_${Date.now()}`;
    this.name = config.name || 'Unnamed Myth';
    this.description = config.description || '';
    this.author = config.author || 'Unknown';
    this.version = config.version || '1.0.0';

    // Myth categorization
    this.category = config.category || 'universal'; // creation | hero | trickster | seasonal | etc.
    this.culture = config.culture || 'universal'; // greek | norse | celtic | universal | etc.
    this.tags = config.tags || [];

    // Structure
    this.nodes = new Map(); // nodeId -> MythNode
    this.archetypes = new Map(); // archetypeId -> Archetype
    this.startNodeId = config.startNodeId || null;
    this.endNodeId = config.endNodeId || null;

    // Metadata
    this.created = config.created || Date.now();
    this.modified = config.modified || Date.now();

    // State
    this.currentNodeId = null;
    this.journeyHistory = []; // Track progression through nodes

    console.log(`🌟 Myth created: ${this.name} (${this.category})`);
  }

  /**
   * Add archetype to myth
   */
  addArchetype(archetype) {
    this.archetypes.set(archetype.id, archetype);
    console.log(`🌟 Added archetype "${archetype.name}" to myth "${this.name}"`);
  }

  /**
   * Add node to myth
   */
  addNode(node) {
    this.nodes.set(node.id, node);

    // Bind archetype reference
    if (node.archetypeId && this.archetypes.has(node.archetypeId)) {
      node.archetype = this.archetypes.get(node.archetypeId);
    }

    console.log(`🌟 Added node "${node.name}" to myth "${this.name}"`);
  }

  /**
   * Get node by ID
   */
  getNode(nodeId) {
    return this.nodes.get(nodeId);
  }

  /**
   * Get current node
   */
  getCurrentNode() {
    return this.currentNodeId ? this.nodes.get(this.currentNodeId) : null;
  }

  /**
   * Navigate to node
   */
  navigateToNode(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node) {
      console.warn(`🌟 Node ${nodeId} not found in myth ${this.name}`);
      return false;
    }

    this.currentNodeId = nodeId;
    this.journeyHistory.push({
      nodeId,
      timestamp: Date.now()
    });

    console.log(`🌟 Navigated to node: ${node.name}`);
    return true;
  }

  /**
   * Get next nodes from current position
   */
  getNextNodes() {
    const current = this.getCurrentNode();
    if (!current) return [];

    return current.nextNodes
      .map(id => this.nodes.get(id))
      .filter(n => n); // Filter out invalid references
  }

  /**
   * Get previous nodes
   */
  getPreviousNodes() {
    const current = this.getCurrentNode();
    if (!current) return [];

    return current.previousNodes
      .map(id => this.nodes.get(id))
      .filter(n => n);
  }

  /**
   * Start journey from beginning
   */
  startJourney() {
    if (!this.startNodeId) {
      console.warn(`🌟 Myth ${this.name} has no start node`);
      return false;
    }

    this.currentNodeId = null;
    this.journeyHistory = [];
    return this.navigateToNode(this.startNodeId);
  }

  /**
   * Get journey progress (0-1)
   */
  getProgress() {
    if (!this.startNodeId || !this.endNodeId) return 0;

    const totalNodes = this.nodes.size;
    const visitedNodes = new Set(this.journeyHistory.map(h => h.nodeId)).size;

    return visitedNodes / totalNodes;
  }

  /**
   * Get all archetypes used in this myth
   */
  getAllArchetypes() {
    return Array.from(this.archetypes.values());
  }

  /**
   * Get all nodes
   */
  getAllNodes() {
    return Array.from(this.nodes.values());
  }

  /**
   * Serialize to JSON
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      author: this.author,
      version: this.version,
      category: this.category,
      culture: this.culture,
      tags: this.tags,
      startNodeId: this.startNodeId,
      endNodeId: this.endNodeId,
      created: this.created,
      modified: this.modified,
      archetypes: Array.from(this.archetypes.values()).map(a => a.toJSON()),
      nodes: Array.from(this.nodes.values()).map(n => n.toJSON())
    };
  }

  /**
   * Export to JSON file
   */
  export() {
    const json = JSON.stringify(this.toJSON(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `myth_${this.id}_${this.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`🌟 Exported myth: ${this.name}`);
  }

  /**
   * Load from JSON
   */
  static fromJSON(data) {
    const myth = new Myth({
      id: data.id,
      name: data.name,
      description: data.description,
      author: data.author,
      version: data.version,
      category: data.category,
      culture: data.culture,
      tags: data.tags,
      startNodeId: data.startNodeId,
      endNodeId: data.endNodeId,
      created: data.created,
      modified: data.modified
    });

    // Load archetypes
    if (data.archetypes) {
      data.archetypes.forEach(archetypeData => {
        const archetype = Archetype.fromJSON(archetypeData);
        myth.addArchetype(archetype);
      });
    }

    // Load nodes
    if (data.nodes) {
      data.nodes.forEach(nodeData => {
        const node = MythNode.fromJSON(nodeData);
        myth.addNode(node);
      });
    }

    return myth;
  }

  /**
   * Import from JSON file
   */
  static async import(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const myth = Myth.fromJSON(data);
          console.log(`🌟 Imported myth: ${myth.name}`);
          resolve(myth);
        } catch (err) {
          console.error('🌟 Myth import error:', err);
          reject(err);
        }
      };

      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
}

/**
 * MythLibrary - Collection of myths
 */
export class MythLibrary {
  constructor() {
    this.myths = new Map(); // mythId -> Myth
    this.tags = new Set();
    this.categories = new Set();

    console.log("🌟 MythLibrary created");
  }

  /**
   * Add myth to library
   */
  addMyth(myth) {
    this.myths.set(myth.id, myth);

    // Index tags and categories
    myth.tags.forEach(tag => this.tags.add(tag));
    this.categories.add(myth.category);

    console.log(`🌟 Added myth "${myth.name}" to library`);
  }

  /**
   * Get myth by ID
   */
  getMyth(mythId) {
    return this.myths.get(mythId);
  }

  /**
   * Get all myths
   */
  getAllMyths() {
    return Array.from(this.myths.values());
  }

  /**
   * Search myths by tag
   */
  getMythsByTag(tag) {
    return this.getAllMyths().filter(m => m.tags.includes(tag));
  }

  /**
   * Search myths by category
   */
  getMythsByCategory(category) {
    return this.getAllMyths().filter(m => m.category === category);
  }

  /**
   * Search myths by culture
   */
  getMythsByCulture(culture) {
    return this.getAllMyths().filter(m => m.culture === culture);
  }

  /**
   * Get all tags
   */
  getAllTags() {
    return Array.from(this.tags);
  }

  /**
   * Get all categories
   */
  getAllCategories() {
    return Array.from(this.categories);
  }

  /**
   * Remove myth
   */
  removeMyth(mythId) {
    const myth = this.myths.get(mythId);
    if (myth) {
      this.myths.delete(mythId);
      console.log(`🌟 Removed myth "${myth.name}" from library`);
      return true;
    }
    return false;
  }

  /**
   * Clear library
   */
  clear() {
    this.myths.clear();
    this.tags.clear();
    this.categories.clear();
    console.log("🌟 Myth library cleared");
  }

  /**
   * Save library to localStorage
   */
  saveToStorage() {
    const data = {
      myths: this.getAllMyths().map(m => m.toJSON())
    };

    localStorage.setItem('morphing_interface_myth_library', JSON.stringify(data));
    console.log(`🌟 Saved ${this.myths.size} myths to localStorage`);
  }

  /**
   * Load library from localStorage
   */
  loadFromStorage() {
    const stored = localStorage.getItem('morphing_interface_myth_library');
    if (!stored) {
      console.log("🌟 No stored myth library found");
      return;
    }

    try {
      const data = JSON.parse(stored);

      if (data.myths) {
        data.myths.forEach(mythData => {
          const myth = Myth.fromJSON(mythData);
          this.addMyth(myth);
        });
      }

      console.log(`🌟 Loaded ${this.myths.size} myths from localStorage`);
    } catch (err) {
      console.error("🌟 Error loading myth library:", err);
    }
  }
}

console.log("🌟 Myth core system ready");
