// src/chronelixPhaseTransition.js
// Phase Transition Detection and Monitoring
// Detects critical points, bifurcations, and emergent state changes in the bibibinary system

import * as THREE from 'three';

console.log("🌊 chronelixPhaseTransition.js loaded");

/**
 * Phase Transition Event
 * Records a detected transition in the system
 */
class PhaseTransitionEvent {
  constructor(timestamp, transitionType, metrics, phaseSpaceState) {
    this.timestamp = timestamp;
    this.transitionType = transitionType; // 'order-disorder', 'bifurcation', 'synchronization', etc.
    this.metrics = { ...metrics };
    this.phaseSpaceState = phaseSpaceState;

    // Severity/significance (0 to 1)
    this.significance = this.computeSignificance();

    // Event properties
    this.duration = 0; // Will be updated if transition persists
    this.resolved = false;
  }

  computeSignificance() {
    // Significance based on how extreme the metrics are
    let sig = 0;

    // High variance indicates strong transition
    sig += this.metrics.variance * 0.3;

    // Order parameter near 0.5 (maximum uncertainty)
    const orderUncertainty = 1 - Math.abs(this.metrics.orderParameter - 0.5) * 2;
    sig += orderUncertainty * 0.3;

    // Critical slowing (transformation → 0)
    sig += this.metrics.criticalSlowing * 0.2;

    // Rapid coherence change
    if (this.metrics.coherenceRate !== undefined) {
      sig += Math.abs(this.metrics.coherenceRate) * 0.2;
    }

    return Math.min(sig, 1.0);
  }
}

/**
 * Phase Transition Detector
 * Monitors 12D bibibinary system for phase transitions and critical phenomena
 */
export class ChronelixPhaseTransitionDetector {
  constructor() {
    // Detection state
    this.currentState = 'stable'; // 'stable', 'critical', 'transitioning'
    this.transitionInProgress = false;
    this.transitionStartTime = null;

    // Metrics history for derivative calculations
    this.metricsHistory = [];
    this.maxHistoryLength = 60; // 1 second at 60fps

    // Detected transitions
    this.transitionEvents = [];
    this.maxEventHistory = 100;

    // Thresholds for detection
    this.thresholds = {
      orderCritical: 0.5,           // Order parameter at critical point
      orderTolerance: 0.15,         // ±0.15 around critical point
      varianceHigh: 0.7,            // High complexity threshold
      slowingThreshold: 0.75,       // Critical slowing detection
      coherenceRateHigh: 0.2,       // Rapid coherence change per frame
      synchronicityJump: 0.3,       // Sudden sync change
      bifurcationSensitivity: 0.05  // Lyapunov exponent change
    };

    // Current metrics (from phase space)
    this.orderParameter = 0;
    this.variance = 0;
    this.coherence = 0;
    this.criticalSlowing = 0;
    this.synchronicity = 0;
    this.lyapunovExponent = 0;

    // Derivative metrics (rates of change)
    this.orderRate = 0;
    this.varianceRate = 0;
    this.coherenceRate = 0;
    this.synchronicityRate = 0;

    // Visualization
    this.visualizationGroup = null;
    this.transitionIndicator = null;

    // Statistics
    this.totalTransitionsDetected = 0;
    this.transitionTypeCounts = {
      'order-disorder': 0,
      'bifurcation': 0,
      'synchronization': 0,
      'desynchronization': 0,
      'complexity-spike': 0
    };

    // Callbacks
    this.onTransitionDetected = null;
    this.onTransitionResolved = null;
  }

  /**
   * Initialize detector
   */
  init(scene) {
    // Create visualization group
    this.visualizationGroup = new THREE.Group();
    scene.add(this.visualizationGroup);

    // Create transition indicator (sphere that changes color/size)
    const indicatorGeometry = new THREE.SphereGeometry(2, 32, 32);
    const indicatorMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.6
    });

    this.transitionIndicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
    this.transitionIndicator.position.set(0, 0, 0); // Center of system
    this.visualizationGroup.add(this.transitionIndicator);

    console.log("🌊 Phase transition detector initialized");
  }

  /**
   * Update detection system
   */
  update(phaseSpace, timestamp) {
    if (!phaseSpace) return;

    // Extract current metrics from phase space
    this.orderParameter = phaseSpace.orderParameter;
    this.variance = phaseSpace.variance;
    this.coherence = phaseSpace.coherence;
    this.criticalSlowing = phaseSpace.criticalSlowing;
    this.synchronicity = phaseSpace.synchronicity;
    this.lyapunovExponent = phaseSpace.lyapunovExponent;

    // Store metrics in history
    const metrics = {
      timestamp,
      orderParameter: this.orderParameter,
      variance: this.variance,
      coherence: this.coherence,
      criticalSlowing: this.criticalSlowing,
      synchronicity: this.synchronicity,
      lyapunovExponent: this.lyapunovExponent
    };

    this.metricsHistory.push(metrics);
    if (this.metricsHistory.length > this.maxHistoryLength) {
      this.metricsHistory.shift();
    }

    // Compute rate of change metrics
    this.computeRates();

    // Detect phase transitions
    this.detectTransitions(phaseSpace, timestamp);

    // Update visualization
    this.updateVisualization();
  }

  /**
   * Compute rates of change for metrics
   */
  computeRates() {
    if (this.metricsHistory.length < 2) return;

    const current = this.metricsHistory[this.metricsHistory.length - 1];
    const previous = this.metricsHistory[this.metricsHistory.length - 2];
    const dt = current.timestamp - previous.timestamp;

    if (dt === 0) return;

    this.orderRate = (current.orderParameter - previous.orderParameter) / dt;
    this.varianceRate = (current.variance - previous.variance) / dt;
    this.coherenceRate = (current.coherence - previous.coherence) / dt;
    this.synchronicityRate = (current.synchronicity - previous.synchronicity) / dt;
  }

  /**
   * Detect phase transitions
   */
  detectTransitions(phaseSpace, timestamp) {
    // 1. Order-Disorder Transition
    this.detectOrderDisorderTransition(phaseSpace, timestamp);

    // 2. Bifurcation (Lyapunov exponent change)
    this.detectBifurcation(phaseSpace, timestamp);

    // 3. Synchronization/Desynchronization
    this.detectSynchronizationChange(phaseSpace, timestamp);

    // 4. Complexity Spike
    this.detectComplexitySpike(phaseSpace, timestamp);

    // Update system state
    this.updateSystemState();

    // Update ongoing transitions
    this.updateTransitionDurations(timestamp);
  }

  /**
   * Detect order-disorder phase transition
   * Occurs when order parameter crosses critical point with high variance
   */
  detectOrderDisorderTransition(phaseSpace, timestamp) {
    const orderNearCritical = Math.abs(this.orderParameter - this.thresholds.orderCritical)
                              < this.thresholds.orderTolerance;
    const varianceHigh = this.variance > this.thresholds.varianceHigh;
    const slowingDetected = this.criticalSlowing > this.thresholds.slowingThreshold;

    // Transition criteria: near critical point + high variance OR critical slowing
    if (orderNearCritical && (varianceHigh || slowingDetected)) {
      // Check if we're not already tracking this transition
      const recentTransition = this.getRecentTransition('order-disorder', 2.0);

      if (!recentTransition) {
        const event = new PhaseTransitionEvent(
          timestamp,
          'order-disorder',
          {
            orderParameter: this.orderParameter,
            variance: this.variance,
            criticalSlowing: this.criticalSlowing,
            orderRate: this.orderRate,
            varianceRate: this.varianceRate
          },
          phaseSpace.state
        );

        this.recordTransition(event);
      }
    }
  }

  /**
   * Detect bifurcation
   * Sudden change in Lyapunov exponent indicates bifurcation
   */
  detectBifurcation(phaseSpace, timestamp) {
    if (this.metricsHistory.length < 30) return;

    // Get Lyapunov exponent from 30 frames ago
    const oldMetrics = this.metricsHistory[this.metricsHistory.length - 30];
    const lyapunovChange = Math.abs(this.lyapunovExponent - oldMetrics.lyapunovExponent);

    // Significant change in Lyapunov exponent
    if (lyapunovChange > this.thresholds.bifurcationSensitivity) {
      const recentTransition = this.getRecentTransition('bifurcation', 1.0);

      if (!recentTransition) {
        const event = new PhaseTransitionEvent(
          timestamp,
          'bifurcation',
          {
            lyapunovExponent: this.lyapunovExponent,
            lyapunovChange: lyapunovChange,
            attractorType: phaseSpace.attractorType
          },
          phaseSpace.state
        );

        this.recordTransition(event);
      }
    }
  }

  /**
   * Detect synchronization/desynchronization
   * Rapid change in synchronicity metric
   */
  detectSynchronizationChange(phaseSpace, timestamp) {
    const syncJump = Math.abs(this.synchronicityRate);

    if (syncJump > this.thresholds.synchronicityJump) {
      const transitionType = this.synchronicityRate > 0 ? 'synchronization' : 'desynchronization';
      const recentTransition = this.getRecentTransition(transitionType, 1.0);

      if (!recentTransition) {
        const event = new PhaseTransitionEvent(
          timestamp,
          transitionType,
          {
            synchronicity: this.synchronicity,
            synchronicityRate: this.synchronicityRate,
            phaseCoherence: phaseSpace.phaseCoherence
          },
          phaseSpace.state
        );

        this.recordTransition(event);
      }
    }
  }

  /**
   * Detect complexity spike
   * Sudden increase in variance (complexity)
   */
  detectComplexitySpike(phaseSpace, timestamp) {
    const varianceSpiking = this.varianceRate > 0.5; // Rapid increase
    const varianceHigh = this.variance > 0.8;

    if (varianceSpiking && varianceHigh) {
      const recentTransition = this.getRecentTransition('complexity-spike', 1.0);

      if (!recentTransition) {
        const event = new PhaseTransitionEvent(
          timestamp,
          'complexity-spike',
          {
            variance: this.variance,
            varianceRate: this.varianceRate,
            orderParameter: this.orderParameter
          },
          phaseSpace.state
        );

        this.recordTransition(event);
      }
    }
  }

  /**
   * Record transition event
   */
  recordTransition(event) {
    this.transitionEvents.push(event);

    if (this.transitionEvents.length > this.maxEventHistory) {
      this.transitionEvents.shift();
    }

    // Update counters
    this.totalTransitionsDetected++;
    if (this.transitionTypeCounts[event.transitionType] !== undefined) {
      this.transitionTypeCounts[event.transitionType]++;
    }

    // Log event
    console.log(`🌊 Phase transition detected: ${event.transitionType}`, {
      significance: event.significance.toFixed(3),
      timestamp: event.timestamp.toFixed(2),
      metrics: event.metrics
    });

    // Trigger callback
    if (this.onTransitionDetected) {
      this.onTransitionDetected(event);
    }

    // Mark transition in progress
    if (!this.transitionInProgress) {
      this.transitionInProgress = true;
      this.transitionStartTime = event.timestamp;
    }
  }

  /**
   * Get recent transition of a given type
   */
  getRecentTransition(type, withinSeconds) {
    if (this.transitionEvents.length === 0) return null;

    const latestEvent = this.transitionEvents[this.transitionEvents.length - 1];
    const timeSince = performance.now() / 1000 - latestEvent.timestamp;

    if (latestEvent.transitionType === type && timeSince < withinSeconds) {
      return latestEvent;
    }

    return null;
  }

  /**
   * Get recent transitions (last N transitions)
   * @param {number} count - Number of recent transitions to retrieve
   * @returns {Array} Array of recent transition events
   */
  getRecentTransitions(count) {
    if (this.transitionEvents.length === 0) return [];

    // Return last N transitions
    const startIndex = Math.max(0, this.transitionEvents.length - count);
    return this.transitionEvents.slice(startIndex);
  }

  /**
   * Update durations of ongoing transitions
   */
  updateTransitionDurations(timestamp) {
    for (const event of this.transitionEvents) {
      if (!event.resolved) {
        event.duration = timestamp - event.timestamp;

        // Auto-resolve transitions after 5 seconds
        if (event.duration > 5.0) {
          event.resolved = true;

          if (this.onTransitionResolved) {
            this.onTransitionResolved(event);
          }
        }
      }
    }

    // Check if we should exit transition state
    if (this.transitionInProgress) {
      const timeSinceStart = timestamp - this.transitionStartTime;

      // Exit transition state if stable for 2 seconds
      if (this.currentState === 'stable' && timeSinceStart > 2.0) {
        this.transitionInProgress = false;
      }
    }
  }

  /**
   * Update system state classification
   */
  updateSystemState() {
    // Classify current state based on metrics
    const orderNearCritical = Math.abs(this.orderParameter - 0.5) < 0.2;
    const varianceHigh = this.variance > 0.6;
    const slowingDetected = this.criticalSlowing > 0.6;

    if ((orderNearCritical && varianceHigh) || slowingDetected) {
      this.currentState = 'critical';
    } else if (this.transitionInProgress) {
      this.currentState = 'transitioning';
    } else {
      this.currentState = 'stable';
    }
  }

  /**
   * Update visualization
   */
  updateVisualization() {
    if (!this.transitionIndicator) return;

    // Color based on state
    let color, emissive, opacity, scale;

    switch (this.currentState) {
      case 'stable':
        color = new THREE.Color(0x10b981); // Green
        emissive = new THREE.Color(0x10b981);
        opacity = 0.4;
        scale = 1.0;
        break;

      case 'critical':
        color = new THREE.Color(0xf59e0b); // Amber
        emissive = new THREE.Color(0xf59e0b);
        opacity = 0.7;
        scale = 1.5;
        break;

      case 'transitioning':
        color = new THREE.Color(0xef4444); // Red
        emissive = new THREE.Color(0xef4444);
        opacity = 0.9;
        scale = 2.0;
        break;

      default:
        color = new THREE.Color(0x6b7280); // Gray
        emissive = new THREE.Color(0x6b7280);
        opacity = 0.3;
        scale = 1.0;
    }

    // Apply to material
    this.transitionIndicator.material.color.copy(color);
    this.transitionIndicator.material.emissive.copy(emissive);
    this.transitionIndicator.material.opacity = opacity;
    this.transitionIndicator.material.emissiveIntensity = 0.5 + (this.variance * 0.5);

    // Scale based on state
    this.transitionIndicator.scale.setScalar(scale);

    // Pulse effect based on variance
    const pulse = 1 + Math.sin(performance.now() * 0.005) * this.variance * 0.2;
    this.transitionIndicator.scale.multiplyScalar(pulse);
  }

  /**
   * Get current state info
   */
  getStateInfo() {
    return {
      currentState: this.currentState,
      transitionInProgress: this.transitionInProgress,
      orderParameter: this.orderParameter.toFixed(3),
      variance: this.variance.toFixed(3),
      coherence: this.coherence.toFixed(3),
      criticalSlowing: this.criticalSlowing.toFixed(3),
      synchronicity: this.synchronicity.toFixed(3),
      lyapunovExponent: this.lyapunovExponent.toFixed(4),

      // Rates
      orderRate: this.orderRate.toFixed(4),
      coherenceRate: this.coherenceRate.toFixed(4),
      synchronicityRate: this.synchronicityRate.toFixed(4)
    };
  }

  /**
   * Get transition statistics
   */
  getStatistics() {
    return {
      totalTransitions: this.totalTransitionsDetected,
      transitionsByType: { ...this.transitionTypeCounts },
      recentTransitions: this.transitionEvents.slice(-10).map(e => ({
        type: e.transitionType,
        timestamp: e.timestamp.toFixed(2),
        significance: e.significance.toFixed(3),
        duration: e.duration.toFixed(2),
        resolved: e.resolved
      }))
    };
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      ...this.getStateInfo(),
      totalTransitions: this.totalTransitionsDetected,
      activeTransitions: this.transitionEvents.filter(e => !e.resolved).length
    };
  }

  /**
   * Reset detector
   */
  reset() {
    this.currentState = 'stable';
    this.transitionInProgress = false;
    this.transitionStartTime = null;
    this.metricsHistory = [];
    this.transitionEvents = [];
    this.totalTransitionsDetected = 0;

    for (const key in this.transitionTypeCounts) {
      this.transitionTypeCounts[key] = 0;
    }
  }

  /**
   * Dispose resources
   */
  dispose() {
    if (this.transitionIndicator) {
      this.transitionIndicator.geometry.dispose();
      this.transitionIndicator.material.dispose();
    }

    if (this.visualizationGroup) {
      this.visualizationGroup.parent?.remove(this.visualizationGroup);
    }
  }
}

// Singleton instance
export const phaseTransitionDetector = new ChronelixPhaseTransitionDetector();

console.log("🌊 Phase transition detection system ready");
