// src/portalBuilder/portalManager.js
// Portal Manager - Core CRUD operations for destinations
// Manages portal lifecycle, persistence, and graph structure

console.log("🚪 portalManager.js loaded");

/**
 * Portal/Destination data structure
 */
export class Portal {
  constructor(config = {}) {
    this.id = config.id || `portal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = config.name || "Unnamed Portal";
    this.type = config.type || "Natural"; // Natural / Cosmic / Architectural / Mythic / Abstract
    this.tags = config.tags || [];

    // Visual configuration
    this.skybox = config.skybox || {
      type: 'image', // 'image' | 'procedural' | 'video' | 'layered'
      source: config.skybox?.source || null,
      rotation: config.skybox?.rotation || 0,
      scale: config.skybox?.scale || 1,
      brightness: config.skybox?.brightness || 1,
      hueShift: config.skybox?.hueShift || 0,
      layers: config.skybox?.layers || []
    };

    // Geometry field
    this.geometry = config.geometry || [];

    // Waveform field
    this.wavefield = config.wavefield || {
      enabled: false,
      gridSize: 64,
      amplitude: 0.8,
      frequency: 1.2,
      band: 'bass', // bass | mid | treble | all
      propagationSpeed: 1.0,
      color: '#00FFFF'
    };

    // Metadata & links
    this.presetLink = config.presetLink || null;
    this.mythNode = config.mythNode || null;
    this.audioTheme = config.audioTheme || null;
    this.description = config.description || "";

    // Portal graph connections
    this.connections = config.connections || []; // Array of portal IDs this connects to
    this.position = config.position || { x: 0, y: 0 }; // 2D map position

    // State
    this.locked = config.locked || false;
    this.visited = config.visited || false;

    // Creation metadata
    this.createdAt = config.createdAt || Date.now();
    this.modifiedAt = config.modifiedAt || Date.now();
    this.author = config.author || "User";
  }

  /**
   * Serialize to JSON
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      tags: this.tags,
      skybox: this.skybox,
      geometry: this.geometry,
      wavefield: this.wavefield,
      presetLink: this.presetLink,
      mythNode: this.mythNode,
      audioTheme: this.audioTheme,
      description: this.description,
      connections: this.connections,
      position: this.position,
      locked: this.locked,
      visited: this.visited,
      createdAt: this.createdAt,
      modifiedAt: this.modifiedAt,
      author: this.author
    };
  }

  /**
   * Create from JSON
   */
  static fromJSON(json) {
    return new Portal(json);
  }

  /**
   * Update metadata
   */
  update(changes) {
    Object.assign(this, changes);
    this.modifiedAt = Date.now();
  }

  /**
   * Add connection to another portal
   */
  connectTo(portalId) {
    if (!this.connections.includes(portalId)) {
      this.connections.push(portalId);
      this.modifiedAt = Date.now();
    }
  }

  /**
   * Remove connection
   */
  disconnectFrom(portalId) {
    const index = this.connections.indexOf(portalId);
    if (index > -1) {
      this.connections.splice(index, 1);
      this.modifiedAt = Date.now();
    }
  }
}

/**
 * Portal Manager - CRUD operations and graph management
 */
export class PortalManager {
  constructor() {
    this.portals = new Map(); // id -> Portal
    this._activePortalId = null; // Private backing field
    this.listeners = new Map();

    // Integration points
    this.scene = null;
    this.camera = null;
    this.destinationSystem = null;
    this.mythCompiler = null;
    this.presetManager = null;
    this.destinationNavigator = null;

    // Destination → Portal ID mapping
    this.destinationPortalMap = new Map();

    // Auto-sync control
    this.autoSyncEnabled = true; // Enabled - sync with destinations automatically
    this.manuallyEntered = false; // Track if user manually entered a portal

    // Setup navigation event listeners
    this.setupNavigationSync();

    console.log("🚪 PortalManager initialized (auto-sync enabled)");
  }

  /**
   * Getter/setter for activePortalId with logging
   */
  get activePortalId() {
    return this._activePortalId;
  }

  set activePortalId(value) {
    const oldValue = this._activePortalId;
    this._activePortalId = value;

    // Get stack trace to see who's setting it
    const stack = new Error().stack;
    const caller = stack.split('\n')[2]?.trim() || 'unknown';

    console.log(`🔍 activePortalId CHANGED: ${oldValue} → ${value}`);
    console.log(`🔍 Set by: ${caller}`);

    if (value) {
      const portal = this.portals.get(value);
      if (portal) {
        console.log(`🔍 Active portal is now: "${portal.name}" (${value})`);
      } else {
        console.warn(`🔍 WARNING: activePortalId set to ${value} but portal doesn't exist!`);
      }
    } else {
      console.log(`🔍 Active portal cleared (null)`);
    }
  }

  /**
   * Setup listeners for destination navigation events
   */
  setupNavigationSync() {
    // Listen for navigation completed
    window.addEventListener('navigationCompleted', (event) => {
      const destination = event.detail.destination;
      if (destination && this.autoSyncEnabled && !this.manuallyEntered) {
        console.log(`🚪 Navigation to "${destination.name}" - syncing to portal...`);
        this.syncWithDestination(destination);
      } else if (destination && this.manuallyEntered) {
        console.log(`🚪 Navigation to "${destination.name}" detected but manual entry is active - not overriding`);
        // Reset manual entry flag after navigation completes
        this.manuallyEntered = false;
      } else if (destination && !this.autoSyncEnabled) {
        console.log(`🚪 Navigation to "${destination.name}" detected but auto-sync is disabled`);
      }
    });

    console.log("🚪 Portal-Destination sync listeners installed (auto-sync: ON)");
  }

  /**
   * Enable or disable auto-sync with destinations
   */
  setAutoSync(enabled) {
    this.autoSyncEnabled = enabled;
    console.log(`🚪 Auto-sync ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  /**
   * Sync with a destination - find or create portal
   */
  syncWithDestination(destination) {
    // Check if we already have a portal for this destination
    let portalId = this.destinationPortalMap.get(destination.id);
    let portal = portalId ? this.portals.get(portalId) : null;

    if (!portal) {
      // Auto-create portal for this destination
      portal = this.createPortal({
        id: `dest_${destination.id}`,
        name: destination.name,
        type: destination.category || 'Natural',
        tags: ['auto-created', 'destination'],
        description: destination.description || `Auto-created from destination: ${destination.name}`,
        geometry: [],
        wavefield: { enabled: false }
      });

      this.destinationPortalMap.set(destination.id, portal.id);
      console.log(`🚪 Auto-created portal for destination: ${destination.name}`);
    }

    // Set as active portal
    this.activePortalId = portal.id;
    console.log(`🚪 Active portal synced to: ${portal.name}`);

    return portal;
  }

  /**
   * Set destination navigator for integration
   */
  setDestinationNavigator(navigator) {
    this.destinationNavigator = navigator;

    // If navigator already has a current destination, sync with it
    if (navigator.currentDestination) {
      this.syncWithDestination(navigator.currentDestination);
    }
  }

  /**
   * Set Three.js scene and camera
   */
  setScene(scene, camera) {
    this.scene = scene;
    this.camera = camera;
  }

  /**
   * Set destination system
   */
  setDestinationSystem(system) {
    this.destinationSystem = system;
  }

  /**
   * Set myth compiler
   */
  setMythCompiler(compiler) {
    this.mythCompiler = compiler;
  }

  /**
   * Set preset manager
   */
  setPresetManager(manager) {
    this.presetManager = manager;
  }

  /**
   * Create new portal
   */
  createPortal(config = {}) {
    console.log('🔍 DEBUG: createPortal() called with config:', config);

    const portal = new Portal(config);
    console.log('🔍 DEBUG: Portal instance created:', portal.id, portal.name);

    this.portals.set(portal.id, portal);
    console.log('🔍 DEBUG: Portal added to portals Map, total portals:', this.portals.size);

    // If this is a manual portal creation (not auto-created), set it as active
    const isAutoCreated = config.tags && config.tags.includes('auto-created');
    console.log('🔍 DEBUG: Is auto-created?', isAutoCreated);
    console.log('🔍 DEBUG: activePortalId BEFORE setting:', this.activePortalId);

    if (!isAutoCreated) {
      this.activePortalId = portal.id;
      this.manuallyEntered = true;
      console.log(`🚪 Portal created and set as ACTIVE: ${portal.name} (${portal.id})`);
      console.log('🔍 DEBUG: activePortalId AFTER setting:', this.activePortalId);
      console.log('🔍 DEBUG: manuallyEntered set to:', this.manuallyEntered);
    } else {
      console.log(`🚪 Portal created: ${portal.name} (${portal.id})`);
      console.log('🔍 DEBUG: activePortalId unchanged:', this.activePortalId);
    }

    this.emitEvent('portalCreated', portal);
    this.saveLibrary();
    console.log('🔍 DEBUG: Portal saved to library');

    return portal;
  }

  /**
   * Get portal by ID
   */
  getPortal(id) {
    return this.portals.get(id);
  }

  /**
   * Get all portals
   */
  getAllPortals() {
    return Array.from(this.portals.values());
  }

  /**
   * Update portal
   */
  updatePortal(id, changes) {
    const portal = this.portals.get(id);
    if (!portal) {
      console.warn(`🚪 Portal not found: ${id}`);
      return null;
    }

    portal.update(changes);
    this.emitEvent('portalUpdated', portal);
    this.saveLibrary();

    console.log(`🚪 Portal updated: ${portal.name}`);
    return portal;
  }

  /**
   * Delete portal
   */
  deletePortal(id) {
    const portal = this.portals.get(id);
    if (!portal) {
      console.warn(`🚪 Portal not found: ${id}`);
      return false;
    }

    // Remove all connections to this portal from other portals
    this.portals.forEach(p => {
      p.disconnectFrom(id);
    });

    this.portals.delete(id);

    // If this was the active portal, clear it
    if (this.activePortalId === id) {
      this.activePortalId = null;
    }

    this.emitEvent('portalDeleted', { id, name: portal.name });
    this.saveLibrary();

    console.log(`🚪 Portal deleted: ${portal.name}`);
    return true;
  }

  /**
   * Duplicate portal
   */
  duplicatePortal(id) {
    const original = this.portals.get(id);
    if (!original) {
      console.warn(`🚪 Portal not found: ${id}`);
      return null;
    }

    const duplicate = new Portal({
      ...original.toJSON(),
      id: undefined, // Generate new ID
      name: `${original.name} (Copy)`,
      visited: false,
      createdAt: undefined,
      modifiedAt: undefined,
      connections: [] // Don't copy connections
    });

    this.portals.set(duplicate.id, duplicate);
    this.emitEvent('portalCreated', duplicate);
    this.saveLibrary();

    console.log(`🚪 Portal duplicated: ${original.name} → ${duplicate.name}`);
    return duplicate;
  }

  /**
   * Enter/activate a portal
   */
  async enterPortal(id) {
    const portal = this.portals.get(id);
    if (!portal) {
      console.warn(`🚪 Portal not found: ${id}`);
      return { ok: false, error: 'Portal not found' };
    }

    if (portal.locked) {
      console.warn(`🚪 Portal is locked: ${portal.name}`);
      return { ok: false, error: 'Portal is locked' };
    }

    console.log(`🚪 Entering portal: ${portal.name}`);

    // Mark as visited
    portal.visited = true;
    portal.modifiedAt = Date.now();

    // Set as active portal
    const previousPortalId = this.activePortalId;
    this.activePortalId = id;

    // Mark as manually entered to prevent auto-sync from overriding
    this.manuallyEntered = true;
    console.log(`🚪 Portal manually entered - auto-sync will not override`);

    // Apply portal configuration
    await this.applyPortalConfiguration(portal);

    this.emitEvent('portalEntered', { portal, previousPortalId });
    this.saveLibrary();

    return { ok: true, portal };
  }

  /**
   * Apply portal configuration to the scene
   */
  async applyPortalConfiguration(portal) {
    try {
      // Apply skybox
      await this.applySkybox(portal.skybox);

      // Apply geometry field
      await this.applyGeometry(portal.geometry);

      // Apply waveform field
      await this.applyWavefield(portal.wavefield);

      // Apply linked preset
      if (portal.presetLink && this.presetManager) {
        await this.presetManager.loadPreset(portal.presetLink);
      }

      // Apply myth node state
      if (portal.mythNode && this.mythCompiler) {
        this.mythCompiler.activateNode(portal.mythNode);
      }

      console.log(`🚪 Portal configuration applied: ${portal.name}`);
      return { ok: true };
    } catch (err) {
      console.error(`🚪 Failed to apply portal configuration:`, err);
      return { ok: false, error: err.message };
    }
  }

  /**
   * Apply skybox configuration
   */
  async applySkybox(skyboxConfig) {
    if (!this.destinationSystem) {
      console.warn('🚪 Destination system not available for skybox application');
      return;
    }

    // Use existing destination system to apply skybox
    // This will be expanded with skybox editor features
    console.log('🚪 Applying skybox:', skyboxConfig);
  }

  /**
   * Apply geometry field
   */
  async applyGeometry(geometryConfig) {
    if (!this.scene) {
      console.warn('🚪 Scene not available for geometry application');
      return;
    }

    // Clear previous portal geometry
    this.clearPortalGeometry();

    // Add new geometry objects
    // This will be expanded with geometry builder features
    console.log('🚪 Applying geometry field:', geometryConfig);
  }

  /**
   * Apply waveform field
   */
  async applyWavefield(wavefieldConfig) {
    if (!wavefieldConfig.enabled) return;

    // Configure voxel floor or waveform system
    // This will be expanded with waveform editor features
    console.log('🚪 Applying wavefield:', wavefieldConfig);
  }

  /**
   * Clear portal-specific geometry
   */
  clearPortalGeometry() {
    if (!this.scene) return;

    // Remove objects tagged as portal geometry
    const toRemove = [];
    this.scene.traverse(obj => {
      if (obj.userData?.portalGeometry) {
        toRemove.push(obj);
      }
    });

    toRemove.forEach(obj => {
      this.scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  }

  /**
   * Search portals by name, tag, or type
   */
  searchPortals(query) {
    const lowerQuery = query.toLowerCase();

    return this.getAllPortals().filter(portal => {
      return portal.name.toLowerCase().includes(lowerQuery) ||
             portal.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
             portal.type.toLowerCase().includes(lowerQuery) ||
             portal.description.toLowerCase().includes(lowerQuery);
    });
  }

  /**
   * Get portals by type
   */
  getPortalsByType(type) {
    return this.getAllPortals().filter(portal => portal.type === type);
  }

  /**
   * Get portals by tag
   */
  getPortalsByTag(tag) {
    return this.getAllPortals().filter(portal => portal.tags.includes(tag));
  }

  /**
   * Get connected portals
   */
  getConnectedPortals(portalId) {
    const portal = this.portals.get(portalId);
    if (!portal) return [];

    return portal.connections
      .map(id => this.portals.get(id))
      .filter(p => p !== undefined);
  }

  /**
   * Get portal graph
   */
  getPortalGraph() {
    const nodes = this.getAllPortals().map(portal => ({
      id: portal.id,
      name: portal.name,
      type: portal.type,
      position: portal.position,
      locked: portal.locked,
      visited: portal.visited
    }));

    const edges = [];
    this.portals.forEach(portal => {
      portal.connections.forEach(targetId => {
        edges.push({
          source: portal.id,
          target: targetId
        });
      });
    });

    return { nodes, edges };
  }

  /**
   * Auto-generate portal graph from myth structure
   */
  generateGraphFromMyth(mythId) {
    if (!this.mythCompiler) {
      console.warn('🚪 Myth compiler not available');
      return { ok: false, error: 'Myth compiler not available' };
    }

    const myth = this.mythCompiler.getMyth(mythId);
    if (!myth) {
      console.warn(`🚪 Myth not found: ${mythId}`);
      return { ok: false, error: 'Myth not found' };
    }

    // Create a portal for each myth node
    const portalMap = new Map();

    myth.nodes.forEach((node, index) => {
      const portal = this.createPortal({
        name: node.name,
        type: 'Mythic',
        tags: [mythId, 'generated'],
        description: node.description,
        mythNode: node.id,
        position: {
          x: Math.cos(index * 2 * Math.PI / myth.nodes.length) * 200,
          y: Math.sin(index * 2 * Math.PI / myth.nodes.length) * 200
        }
      });

      portalMap.set(node.id, portal.id);
    });

    // Connect portals based on myth edges
    myth.nodes.forEach(node => {
      const portalId = portalMap.get(node.id);
      const portal = this.portals.get(portalId);

      if (node.next && node.next.length > 0) {
        node.next.forEach(nextNodeId => {
          const nextPortalId = portalMap.get(nextNodeId);
          if (nextPortalId) {
            portal.connectTo(nextPortalId);
          }
        });
      }
    });

    console.log(`🚪 Generated ${portalMap.size} portals from myth: ${myth.name}`);
    return { ok: true, count: portalMap.size };
  }

  /**
   * Save library to localStorage
   */
  saveLibrary() {
    try {
      const data = {
        portals: Array.from(this.portals.values()).map(p => p.toJSON()),
        activePortalId: this.activePortalId,
        version: '1.0.0'
      };

      console.log('🔍 DEBUG: Saving library to localStorage...');
      console.log('🔍 DEBUG: activePortalId being saved:', this.activePortalId);
      console.log('🔍 DEBUG: Total portals being saved:', this.portals.size);

      localStorage.setItem('portalLibrary', JSON.stringify(data));
      console.log(`🚪 Portal library saved (${this.portals.size} portals, active: ${this.activePortalId})`);
    } catch (err) {
      console.error('🚪 Failed to save portal library:', err);
    }
  }

  /**
   * Load library from localStorage
   */
  loadLibrary() {
    try {
      const saved = localStorage.getItem('portalLibrary');
      if (!saved) {
        console.log('🚪 No saved portal library found');
        return;
      }

      const data = JSON.parse(saved);

      console.log('🔍 DEBUG: Loading library from localStorage...');
      console.log('🔍 DEBUG: activePortalId from storage:', data.activePortalId);
      console.log('🔍 DEBUG: Portals from storage:', data.portals.length);

      this.portals.clear();
      data.portals.forEach(portalData => {
        const portal = Portal.fromJSON(portalData);
        this.portals.set(portal.id, portal);
      });

      this.activePortalId = data.activePortalId;
      console.log('🔍 DEBUG: activePortalId AFTER loading:', this.activePortalId);

      console.log(`🚪 Portal library loaded (${this.portals.size} portals, active: ${this.activePortalId})`);
      this.emitEvent('libraryLoaded', { count: this.portals.size });
    } catch (err) {
      console.error('🚪 Failed to load portal library:', err);
    }
  }

  /**
   * Export portal as JSON file
   */
  exportPortal(id) {
    const portal = this.portals.get(id);
    if (!portal) {
      console.warn(`🚪 Portal not found: ${id}`);
      return null;
    }

    const json = JSON.stringify(portal.toJSON(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${portal.name.replace(/\s+/g, '_')}.portal.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`🚪 Portal exported: ${portal.name}`);
    return json;
  }

  /**
   * Import portal from JSON
   */
  importPortal(json) {
    try {
      const portalData = typeof json === 'string' ? JSON.parse(json) : json;

      // Generate new ID to avoid conflicts
      delete portalData.id;

      const portal = this.createPortal(portalData);

      console.log(`🚪 Portal imported: ${portal.name}`);
      return { ok: true, portal };
    } catch (err) {
      console.error('🚪 Failed to import portal:', err);
      return { ok: false, error: err.message };
    }
  }

  /**
   * Event system
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  emitEvent(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`🚪 Event callback error (${event}):`, err);
      }
    });
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      totalPortals: this.portals.size,
      activePortalId: this.activePortalId,
      activePortalName: this.activePortalId ? this.portals.get(this.activePortalId)?.name : null,
      visitedCount: this.getAllPortals().filter(p => p.visited).length,
      lockedCount: this.getAllPortals().filter(p => p.locked).length,
      types: this.getAllPortals().reduce((acc, p) => {
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
      }, {}),
      totalConnections: this.getAllPortals().reduce((sum, p) => sum + p.connections.length, 0)
    };
  }
}

console.log("🚪 Portal Manager ready");
