// src/destinationNavigation.js
// Navigation system for traveling to authored destinations

import * as THREE from 'three';
import { state } from './state.js';

console.log("🚀 destinationNavigation.js loaded");

/**
 * DestinationNavigator - Handles camera transitions and visual state changes
 */
export class DestinationNavigator {
  constructor(camera, authoringSystem) {
    this.camera = camera;
    this.authoringSystem = authoringSystem;

    // Navigation state
    this.isNavigating = false;
    this.currentDestination = null;
    this.navigationStartTime = 0;
    this.navigationDuration = 2000; // ms

    // Start/end states for smooth interpolation
    this.startPosition = new THREE.Vector3();
    this.targetPosition = new THREE.Vector3();
    this.startRotation = new THREE.Euler();
    this.targetRotation = new THREE.Euler();

    // Visual state interpolation
    this.startVisualState = null;
    this.targetVisualState = null;

    console.log("🚀 DestinationNavigator initialized");
  }

  /**
   * Navigate to destination
   */
  navigateTo(destination) {
    if (this.isNavigating) {
      console.warn('🚀 Already navigating, canceling previous navigation');
      this.cancelNavigation();
    }

    console.log(`🚀 Navigating to "${destination.name}"`);

    // Mark as visited
    destination.visited = true;
    destination.visitCount++;

    // Store current state
    this.startPosition.copy(this.camera.position);
    this.startRotation.copy(this.camera.rotation);
    this.startVisualState = this.authoringSystem.captureCurrentState();

    // Set target state
    this.targetPosition.copy(destination.position);
    this.targetVisualState = destination.visualState;

    // Calculate target rotation (look at destination from current position)
    const direction = new THREE.Vector3().subVectors(destination.position, this.camera.position).normalize();
    this.targetRotation.x = Math.asin(-direction.y);
    this.targetRotation.y = Math.atan2(direction.x, direction.z);
    this.targetRotation.z = 0;

    // Start navigation
    this.currentDestination = destination;
    this.navigationDuration = destination.transitionDuration;
    this.navigationStartTime = performance.now();
    this.isNavigating = true;

    // Apply transition type
    switch (destination.transitionType) {
      case 'instant':
        this.instantTransition();
        break;
      case 'fade':
        this.fadeTransition();
        break;
      case 'smooth':
      default:
        // Smooth transition handled in update loop
        break;
    }

    // Emit event
    window.dispatchEvent(new CustomEvent('navigationStarted', {
      detail: { destination }
    }));

    return true;
  }

  /**
   * Instant teleport to destination
   */
  instantTransition() {
    // Snap to destination
    this.camera.position.copy(this.targetPosition);
    this.camera.rotation.copy(this.targetRotation);

    // Apply visual state immediately
    if (this.targetVisualState) {
      this.applyVisualState(this.targetVisualState);
    }

    // Complete navigation
    this.completeNavigation();
  }

  /**
   * Fade transition (screen fade to black, then fade in)
   */
  fadeTransition() {
    // Create fade overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: black;
      opacity: 0;
      transition: opacity 0.5s;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(overlay);

    // Fade to black
    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 10);

    // Teleport at mid-fade
    setTimeout(() => {
      this.camera.position.copy(this.targetPosition);
      this.camera.rotation.copy(this.targetRotation);

      if (this.targetVisualState) {
        this.applyVisualState(this.targetVisualState);
      }
    }, 500);

    // Fade back in
    setTimeout(() => {
      overlay.style.opacity = '0';
    }, 600);

    // Clean up and complete
    setTimeout(() => {
      overlay.remove();
      this.completeNavigation();
    }, 1100);
  }

  /**
   * Update smooth transition (called every frame)
   */
  update() {
    if (!this.isNavigating) return;

    // VCN Phase 1.5.2: Skip navigation update if user is actively controlling with gamepad
    // This allows gamepad control to override destination navigation smoothly
    if (window.fpControls && window.fpControls.lastGamepadInputTime) {
      const timeSinceGamepadInput = performance.now() - window.fpControls.lastGamepadInputTime;
      console.log('🚀 DestNav check:', {
        timeSinceGamepadInput: timeSinceGamepadInput.toFixed(0) + 'ms',
        threshold: '500ms',
        willSkip: timeSinceGamepadInput < 500
      });
      if (timeSinceGamepadInput < 500) {  // 500ms grace period
        console.log('🚀 Skipping destination navigation - gamepad active');
        // User is actively using gamepad - skip this frame
        return;
      }
    }

    const elapsed = performance.now() - this.navigationStartTime;
    const t = Math.min(elapsed / this.navigationDuration, 1.0);

    // Ease function (ease-in-out cubic)
    const eased = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Interpolate position
    this.camera.position.lerpVectors(this.startPosition, this.targetPosition, eased);

    // Interpolate rotation
    this.camera.rotation.x = THREE.MathUtils.lerp(this.startRotation.x, this.targetRotation.x, eased);
    this.camera.rotation.y = THREE.MathUtils.lerp(this.startRotation.y, this.targetRotation.y, eased);
    this.camera.rotation.z = THREE.MathUtils.lerp(this.startRotation.z, this.targetRotation.z, eased);

    // Interpolate visual state
    if (this.startVisualState && this.targetVisualState) {
      this.interpolateVisualState(this.startVisualState, this.targetVisualState, eased);
    }

    // Complete when done
    if (t >= 1.0) {
      this.completeNavigation();
    }
  }

  /**
   * Apply visual state (like preset load)
   */
  applyVisualState(visualState) {
    if (!visualState) return;

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

    console.log('🚀 Applied destination visual state');
  }

  /**
   * Interpolate between two visual states
   */
  interpolateVisualState(startState, targetState, t) {
    // Interpolate morph weights
    if (startState.morphWeights && targetState.morphWeights) {
      for (const key in state.morphWeights) {
        const start = startState.morphWeights[key] || 0;
        const target = targetState.morphWeights[key] || 0;
        state.morphWeights[key] = THREE.MathUtils.lerp(start, target, t);
      }
    }

    // Interpolate geometry transforms
    if (startState.rotationX !== undefined && targetState.rotationX !== undefined) {
      state.rotationX = THREE.MathUtils.lerp(startState.rotationX, targetState.rotationX, t);
    }
    if (startState.rotationY !== undefined && targetState.rotationY !== undefined) {
      state.rotationY = THREE.MathUtils.lerp(startState.rotationY, targetState.rotationY, t);
    }
    if (startState.scale !== undefined && targetState.scale !== undefined) {
      state.scale = THREE.MathUtils.lerp(startState.scale, targetState.scale, t);
    }

    // Interpolate lighting
    if (startState.lighting && targetState.lighting) {
      if (startState.lighting.ambientIntensity !== undefined && targetState.lighting.ambientIntensity !== undefined) {
        state.lighting.ambientIntensity = THREE.MathUtils.lerp(
          startState.lighting.ambientIntensity,
          targetState.lighting.ambientIntensity,
          t
        );
      }
      if (startState.lighting.directionalIntensity !== undefined && targetState.lighting.directionalIntensity !== undefined) {
        state.lighting.directionalIntensity = THREE.MathUtils.lerp(
          startState.lighting.directionalIntensity,
          targetState.lighting.directionalIntensity,
          t
        );
      }
    }

    // Color interpolation (hex colors)
    if (startState.color && targetState.color) {
      const startColor = new THREE.Color(startState.color);
      const targetColor = new THREE.Color(targetState.color);
      const interpolated = new THREE.Color().lerpColors(startColor, targetColor, t);
      state.color = '#' + interpolated.getHexString();
    }

    // Hue interpolation
    if (startState.hue !== undefined && targetState.hue !== undefined) {
      state.hue = THREE.MathUtils.lerp(startState.hue, targetState.hue, t);
    }
  }

  /**
   * Complete navigation
   */
  completeNavigation() {
    this.isNavigating = false;

    console.log(`🚀 Arrived at "${this.currentDestination.name}"`);

    // Save destination state
    this.authoringSystem.saveToStorage();

    // Emit event
    window.dispatchEvent(new CustomEvent('navigationCompleted', {
      detail: { destination: this.currentDestination }
    }));

    // DON'T clear currentDestination - we need to track where we are!
    // this.currentDestination = null;  // REMOVED - keep current location
  }

  /**
   * Get current destination (where you are now)
   */
  getCurrentDestination() {
    return this.currentDestination;
  }

  /**
   * Cancel navigation
   */
  cancelNavigation() {
    if (!this.isNavigating) return;

    console.log('🚀 Navigation canceled');

    this.isNavigating = false;
    this.currentDestination = null;

    // Emit event
    window.dispatchEvent(new CustomEvent('navigationCanceled'));
  }

  /**
   * Get distance to destination
   */
  getDistanceTo(destination) {
    return this.camera.position.distanceTo(destination.position);
  }

  /**
   * Get bearing to destination (-1 = behind, 0 = perpendicular, +1 = ahead)
   */
  getBearingTo(destination) {
    const vectorToTarget = new THREE.Vector3()
      .subVectors(destination.position, this.camera.position)
      .normalize();
    const cameraForward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    return vectorToTarget.dot(cameraForward);
  }

  /**
   * Get direction to destination (world-space vector)
   */
  getDirectionTo(destination) {
    return new THREE.Vector3()
      .subVectors(destination.position, this.camera.position)
      .normalize();
  }

  /**
   * Check if destination is in view
   */
  isDestinationInView(destination) {
    const bearing = this.getBearingTo(destination);
    return bearing > 0.5; // Within ~60° cone
  }

  /**
   * Get compass direction to destination (0-360 degrees, 0=North/+Z)
   */
  getCompassDirection(destination) {
    const direction = this.getDirectionTo(destination);
    const angle = Math.atan2(direction.x, direction.z);
    const degrees = THREE.MathUtils.radToDeg(angle);
    return (degrees + 360) % 360; // Normalize to 0-360
  }
}

console.log("🚀 Destination navigation system ready");
