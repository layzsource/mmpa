// src/destinationAuthoring.js
// Skybox Destination Authoring System
// Create, save, and navigate to authored destinations in 3D space

import * as THREE from 'three';
import { SignalDestination } from './destinations.js';
import { state } from './state.js';

console.log("🎨 destinationAuthoring.js loaded");

/**
 * AuthoredDestination - User-created destinations with full visual state
 * Extends SignalDestination with authoring capabilities
 */
export class AuthoredDestination extends SignalDestination {
  constructor(config) {
    super(
      config.type || 'authored_location',
      config.position || new THREE.Vector3(0, 0, 0),
      config.signalWeight || 0.5,
      config.category || 'authored'
    );

    // Core identity
    this.name = config.name || `Destination_${Date.now()}`;
    this.description = config.description || '';

    // Visual state snapshot (like preset system)
    this.visualState = config.visualState || null;

    // Skybox/environment
    this.skyboxTextureURL = config.skyboxTextureURL || null;
    this.skyboxColor = config.skyboxColor || '#000000';
    this.fogEnabled = config.fogEnabled || false;
    this.fogColor = config.fogColor || '#000000';
    this.fogDensity = config.fogDensity || 0.01;

    // Visual marker appearance
    this.markerShape = config.markerShape || 'sphere'; // 'sphere', 'cube', 'portal', 'beacon'
    this.markerSize = config.markerSize || 3.0;
    this.markerColor = config.markerColor || this.color;
    this.glowIntensity = config.glowIntensity || 1.0;

    // Navigation
    this.transitionType = config.transitionType || 'smooth'; // 'smooth', 'instant', 'fade'
    this.transitionDuration = config.transitionDuration || 2000; // ms

    // Access control
    this.locked = config.locked || false;
    this.unlockCondition = config.unlockCondition || null;
    this.visited = config.visited || false;
    this.visitCount = config.visitCount || 0;

    // Metadata
    this.tags = config.tags || [];
    this.createdBy = config.createdBy || 'user';
    this.createdAt = config.createdAt || Date.now();
    this.lastModified = config.lastModified || Date.now();

    // Clay Model Objects (Phase 13.22 - Clay Object Integration)
    this.clayObjects = config.clayObjects || [];

    // 3D marker mesh (created on demand)
    this.markerMesh = null;
  }

  /**
   * Serialize for storage
   */
  toJSON() {
    return {
      // Identity
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      category: this.category,

      // Position
      position: {
        x: this.position.x,
        y: this.position.y,
        z: this.position.z
      },

      // Visual state
      visualState: this.visualState,

      // Environment
      skyboxTextureURL: this.skyboxTextureURL,
      skyboxColor: this.skyboxColor,
      fogEnabled: this.fogEnabled,
      fogColor: this.fogColor,
      fogDensity: this.fogDensity,

      // Marker
      markerShape: this.markerShape,
      markerSize: this.markerSize,
      markerColor: this.markerColor,
      glowIntensity: this.glowIntensity,

      // Navigation
      transitionType: this.transitionType,
      transitionDuration: this.transitionDuration,

      // Access
      locked: this.locked,
      unlockCondition: this.unlockCondition,
      visited: this.visited,
      visitCount: this.visitCount,

      // Metadata
      tags: this.tags,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      lastModified: this.lastModified,

      // Clay Objects (Phase 13.22)
      clayObjects: this.clayObjects,

      // Signal properties
      signalWeight: this.signalWeight,
      radius: this.radius,
      color: this.color,
      active: this.active
    };
  }

  /**
   * Deserialize from storage
   */
  static fromJSON(data) {
    return new AuthoredDestination({
      ...data,
      position: new THREE.Vector3(data.position.x, data.position.y, data.position.z)
    });
  }

  /**
   * Create 3D marker mesh for visualization
   */
  createMarkerMesh() {
    if (this.markerMesh) return this.markerMesh;

    let geometry;

    switch (this.markerShape) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(this.markerSize, 32, 32);
        break;
      case 'cube':
        geometry = new THREE.BoxGeometry(this.markerSize * 2, this.markerSize * 2, this.markerSize * 2);
        break;
      case 'beacon':
        // Cone pointing upward
        geometry = new THREE.ConeGeometry(this.markerSize, this.markerSize * 3, 32);
        break;
      case 'portal':
        // Ring/torus shape
        geometry = new THREE.TorusGeometry(this.markerSize, this.markerSize * 0.3, 16, 32);
        break;
      default:
        geometry = new THREE.SphereGeometry(this.markerSize, 32, 32);
    }

    // Create material with glow
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.markerColor),
      emissive: new THREE.Color(this.markerColor),
      emissiveIntensity: this.glowIntensity,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: 0.8
    });

    this.markerMesh = new THREE.Mesh(geometry, material);
    this.markerMesh.position.copy(this.position);
    this.markerMesh.userData.destinationId = this.id;
    this.markerMesh.userData.isDestinationMarker = true;

    // Add glow sprite (additive billboard)
    const glowGeometry = new THREE.PlaneGeometry(this.markerSize * 4, this.markerSize * 4);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.markerColor),
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const glowSprite = new THREE.Mesh(glowGeometry, glowMaterial);
    glowSprite.position.copy(this.position);
    this.markerMesh.add(glowSprite);

    // Animate marker (gentle pulse and rotation)
    this.markerMesh.userData.animateMarker = (time) => {
      // Pulse scale
      const pulse = 1.0 + Math.sin(time * 2) * 0.1;
      this.markerMesh.scale.setScalar(pulse);

      // Slow rotation
      this.markerMesh.rotation.y = time * 0.5;

      // Billboard glow toward camera
      if (glowSprite && window.camera) {
        glowSprite.lookAt(window.camera.position);
      }
    };

    console.log(`🎨 Created marker mesh for "${this.name}" at (${this.position.x.toFixed(1)}, ${this.position.y.toFixed(1)}, ${this.position.z.toFixed(1)})`);

    return this.markerMesh;
  }

  /**
   * Update marker mesh (e.g., when destination is modified)
   */
  updateMarkerMesh() {
    if (!this.markerMesh) return;

    this.markerMesh.position.copy(this.position);
    this.markerMesh.material.color.set(this.markerColor);
    this.markerMesh.material.emissive.set(this.markerColor);
    this.markerMesh.material.emissiveIntensity = this.glowIntensity;
  }

  /**
   * Remove marker mesh from scene
   */
  disposeMarkerMesh() {
    if (this.markerMesh) {
      this.markerMesh.geometry.dispose();
      this.markerMesh.material.dispose();
      if (this.markerMesh.parent) {
        this.markerMesh.parent.remove(this.markerMesh);
      }
      this.markerMesh = null;
    }
  }
}

/**
 * DestinationAuthoringSystem - Manages authored destination lifecycle
 */
export class DestinationAuthoringSystem {
  constructor(destinationManager, scene, camera) {
    this.destinationManager = destinationManager;
    this.scene = scene;
    this.camera = camera;

    // Marker group for all destination markers
    this.markerGroup = new THREE.Group();
    this.markerGroup.name = 'DestinationMarkers';
    this.scene.add(this.markerGroup);

    // Active authored destinations
    this.authoredDestinations = new Map(); // id → AuthoredDestination

    // Storage key
    this.STORAGE_KEY = 'morphing_interface_authored_destinations';

    // Load saved destinations
    this.loadFromStorage();

    console.log("🎨 DestinationAuthoringSystem initialized");
  }

  /**
   * Capture current visual state (like preset save)
   */
  captureCurrentState() {
    return {
      // Camera state
      cameraPosition: {
        x: this.camera.position.x,
        y: this.camera.position.y,
        z: this.camera.position.z
      },
      cameraRotation: {
        x: this.camera.rotation.x,
        y: this.camera.rotation.y,
        z: this.camera.rotation.z
      },

      // Morph system
      morphWeights: { ...state.morphWeights },
      morphState: { ...state.morphState },

      // Geometry transforms
      rotationX: state.rotationX,
      rotationY: state.rotationY,
      scale: state.scale,
      idleSpin: state.idleSpin,

      // Visual settings
      color: state.color,
      hue: state.hue,
      lighting: { ...state.lighting },

      // Audio settings
      audio: { ...state.audio },

      // Color layers
      colorLayers: JSON.parse(JSON.stringify(state.colorLayers)),

      // Voxel wave
      voxelWave: state.voxelWave ? { ...state.voxelWave } : null,

      // Mandala
      mandala: state.mandala ? {
        enabled: state.mandala.enabled,
        ringCount: state.mandala.ringCount,
        symmetry: state.mandala.symmetry,
        audioReactive: state.mandala.audioReactive
      } : null
    };
  }

  /**
   * Create destination at current camera position
   */
  createDestinationHere(config = {}) {
    const currentState = this.captureCurrentState();

    const destination = new AuthoredDestination({
      name: config.name || `Destination ${this.authoredDestinations.size + 1}`,
      description: config.description || '',
      position: this.camera.position.clone(),
      visualState: currentState,
      markerShape: config.markerShape || 'sphere',
      markerSize: config.markerSize || 3.0,
      markerColor: config.markerColor || '#00ffff',
      glowIntensity: config.glowIntensity || 1.0,
      tags: config.tags || [],
      ...config
    });

    // Add to system
    this.addDestination(destination);

    console.log(`🎨 Created destination "${destination.name}" at current position`);
    return destination;
  }

  /**
   * Create destination at specific position
   */
  createDestinationAt(position, config = {}) {
    const currentState = this.captureCurrentState();

    const destination = new AuthoredDestination({
      name: config.name || `Destination ${this.authoredDestinations.size + 1}`,
      description: config.description || '',
      position: position.clone(),
      visualState: currentState,
      ...config
    });

    this.addDestination(destination);

    console.log(`🎨 Created destination "${destination.name}" at (${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)})`);
    return destination;
  }

  /**
   * Add authored destination to system
   */
  addDestination(destination) {
    // Add to local map
    this.authoredDestinations.set(destination.id, destination);

    // Add to destination manager
    this.destinationManager.add(destination);

    // Create and add marker mesh
    const marker = destination.createMarkerMesh();
    this.markerGroup.add(marker);

    // Save to storage
    this.saveToStorage();

    // Emit event
    window.dispatchEvent(new CustomEvent('destinationCreated', {
      detail: { destination }
    }));
  }

  /**
   * Remove destination
   */
  removeDestination(id) {
    const destination = this.authoredDestinations.get(id);
    if (!destination) return false;

    // Remove marker mesh
    destination.disposeMarkerMesh();

    // Remove from destination manager
    this.destinationManager.remove(id);

    // Remove from local map
    this.authoredDestinations.delete(id);

    // Save to storage
    this.saveToStorage();

    console.log(`🎨 Removed destination "${destination.name}"`);

    // Emit event
    window.dispatchEvent(new CustomEvent('destinationRemoved', {
      detail: { id, destination }
    }));

    return true;
  }

  /**
   * Update destination
   */
  updateDestination(id, updates) {
    const destination = this.authoredDestinations.get(id);
    if (!destination) return false;

    // Apply updates
    Object.assign(destination, updates);
    destination.lastModified = Date.now();

    // Update marker
    destination.updateMarkerMesh();

    // Save to storage
    this.saveToStorage();

    console.log(`🎨 Updated destination "${destination.name}"`);

    return true;
  }

  /**
   * Get all authored destinations
   */
  getAllDestinations() {
    return Array.from(this.authoredDestinations.values());
  }

  /**
   * Get destination by ID
   */
  getDestination(id) {
    return this.authoredDestinations.get(id);
  }

  /**
   * Find nearest destination to position
   */
  findNearestDestination(position) {
    let nearest = null;
    let minDistance = Infinity;

    for (const dest of this.authoredDestinations.values()) {
      const distance = position.distanceTo(dest.position);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = dest;
      }
    }

    return { destination: nearest, distance: minDistance };
  }

  /**
   * Phase 13.22 - Clay Object Integration
   * Add a clay object to the nearest destination
   */
  addClayObjectToNearestDestination(clayObjectData) {
    const { destination } = this.findNearestDestination(this.camera.position);

    if (!destination) {
      console.warn('🏗️ No destination found to add clay object');
      return null;
    }

    return this.addClayObjectToDestination(destination.id, clayObjectData);
  }

  /**
   * Add a clay object to a specific destination
   */
  addClayObjectToDestination(destinationId, clayObjectData) {
    const destination = this.authoredDestinations.get(destinationId);
    if (!destination) {
      console.warn(`🏗️ Destination not found: ${destinationId}`);
      return null;
    }

    // Add unique ID to clay object
    const clayObject = {
      ...clayObjectData,
      id: `clay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    };

    destination.clayObjects.push(clayObject);
    destination.lastModified = Date.now();

    this.saveToStorage();

    console.log(`🏗️ Added clay object "${clayObject.name}" to destination "${destination.name}"`);

    // Emit event
    window.dispatchEvent(new CustomEvent('clayObjectAdded', {
      detail: { destinationId, clayObject }
    }));

    return clayObject;
  }

  /**
   * Remove a clay object from a destination
   */
  removeClayObjectFromDestination(destinationId, clayObjectId) {
    const destination = this.authoredDestinations.get(destinationId);
    if (!destination) {
      console.warn(`🏗️ Destination not found: ${destinationId}`);
      return false;
    }

    const initialLength = destination.clayObjects.length;
    destination.clayObjects = destination.clayObjects.filter(obj => obj.id !== clayObjectId);

    if (destination.clayObjects.length === initialLength) {
      console.warn(`🏗️ Clay object not found: ${clayObjectId}`);
      return false;
    }

    destination.lastModified = Date.now();
    this.saveToStorage();

    console.log(`🏗️ Removed clay object ${clayObjectId} from destination "${destination.name}"`);

    // Emit event
    window.dispatchEvent(new CustomEvent('clayObjectRemoved', {
      detail: { destinationId, clayObjectId }
    }));

    return true;
  }

  /**
   * Get all clay objects for a destination
   */
  getClayObjectsForDestination(destinationId) {
    const destination = this.authoredDestinations.get(destinationId);
    return destination ? destination.clayObjects : [];
  }

  /**
   * Clear all clay objects from a destination
   */
  clearClayObjectsFromDestination(destinationId) {
    const destination = this.authoredDestinations.get(destinationId);
    if (!destination) return false;

    destination.clayObjects = [];
    destination.lastModified = Date.now();
    this.saveToStorage();

    console.log(`🏗️ Cleared all clay objects from destination "${destination.name}"`);
    return true;
  }

  /**
   * Update marker animations
   */
  updateMarkers(time) {
    this.markerGroup.children.forEach(marker => {
      if (marker.userData.animateMarker) {
        marker.userData.animateMarker(time);
      }
    });
  }

  /**
   * Save to localStorage
   */
  saveToStorage() {
    try {
      const data = {};
      for (const [id, dest] of this.authoredDestinations) {
        data[id] = dest.toJSON();
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      console.log(`💾 Saved ${this.authoredDestinations.size} destinations to storage`);
    } catch (err) {
      console.error('❌ Failed to save destinations:', err);
    }
  }

  /**
   * Load from localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return;

      const data = JSON.parse(stored);
      let count = 0;

      for (const [id, destData] of Object.entries(data)) {
        const destination = AuthoredDestination.fromJSON(destData);

        // Add to local map
        this.authoredDestinations.set(destination.id, destination);

        // Add to destination manager
        this.destinationManager.add(destination);

        // Create marker mesh
        const marker = destination.createMarkerMesh();
        this.markerGroup.add(marker);

        count++;
      }

      console.log(`💾 Loaded ${count} destinations from storage`);
    } catch (err) {
      console.error('❌ Failed to load destinations:', err);
    }
  }

  /**
   * Export destinations as JSON
   */
  exportDestinations() {
    const data = {};
    for (const [id, dest] of this.authoredDestinations) {
      data[id] = dest.toJSON();
    }

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `destinations_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`🎨 Exported ${this.authoredDestinations.size} destinations`);
  }

  /**
   * Import destinations from JSON file
   */
  importDestinations(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        let count = 0;

        for (const [id, destData] of Object.entries(data)) {
          const destination = AuthoredDestination.fromJSON(destData);
          this.addDestination(destination);
          count++;
        }

        console.log(`🎨 Imported ${count} destinations from ${file.name}`);
      } catch (err) {
        console.error('❌ Failed to import destinations:', err);
        alert(`Failed to import destinations: ${err.message}`);
      }
    };

    reader.onerror = () => {
      console.error('❌ Failed to read file:', file.name);
      alert(`Failed to read file: ${file.name}`);
    };

    reader.readAsText(file);
  }

  /**
   * Clear all destinations
   */
  clearAll() {
    for (const dest of this.authoredDestinations.values()) {
      dest.disposeMarkerMesh();
      this.destinationManager.remove(dest.id);
    }

    this.authoredDestinations.clear();
    this.markerGroup.clear();
    this.saveToStorage();

    console.log('🎨 Cleared all destinations');
  }
}

console.log("🎨 Destination authoring system ready");
