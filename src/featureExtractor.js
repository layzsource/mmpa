console.log("🔬 featureExtractor.js loaded");

/**
 * MMPA Feature Extractor - Dummy Module
 *
 * This module defines the data contract for the six universal features
 * that form the empirical foundation of the MMPA phenomenological instrument.
 *
 * Currently generates dummy data controlled by manual sliders.
 * Will be replaced by real signal analysis (Python/librosa) in Phase 1 completion.
 *
 * The Six Features:
 * 1. IDENTITY - What is it? (Frequency/pitch)
 * 2. RELATIONSHIP - How does it relate? (Ratios/intervals)
 * 3. COMPLEXITY - How dense is it? (Spectral centroid)
 * 4. TRANSFORMATION - How fast is it changing? (Flux/velocity)
 * 5. ALIGNMENT - How synchronized is it? (Coherence/phase)
 * 6. POTENTIAL - How unpredictable is it? (Entropy/freedom)
 */

// Current feature packet state (updated by sliders or real analysis)
let currentFeatures = {
  timestamp: Date.now(),
  signal: {
    source: "dummy",
    sampleRate: 44100,
    bufferSize: 2048
  },
  features: {
    // IDENTITY - "What is it?"
    identity: {
      fundamentalFreq: 440.0,      // Hz - the primary frequency
      harmonics: [440, 880, 1320], // Array of detected frequencies
      strength: 0.85               // Clarity of pitch (0-1)
    },

    // RELATIONSHIP - "How does it relate?"
    relationship: {
      ratios: ["2:1", "3:2", "4:3"], // Interval ratios present
      consonance: 0.72,               // How "in-tune" (0-1)
      complexity: 3                   // Number of simultaneous intervals
    },

    // COMPLEXITY - "How dense is it?"
    complexity: {
      centroid: 1500.0,    // Hz - spectral center of mass
      bandwidth: 2000.0,   // Hz - spread of energy
      brightness: 0.68     // Normalized centroid (0-1)
    },

    // TRANSFORMATION - "How fast is it changing?"
    transformation: {
      flux: 0.42,          // Rate of spectral change (0-1)
      velocity: 0.15,      // Speed of change in features
      acceleration: 0.03   // Rate of change of velocity
    },

    // ALIGNMENT - "How synchronized is it?"
    alignment: {
      coherence: 0.78,     // Phase alignment across frequencies (0-1)
      stability: 0.65,     // Consistency over time (0-1)
      synchrony: 0.82      // Temporal alignment (0-1)
    },

    // POTENTIAL - "How unpredictable is it?"
    potential: {
      entropy: 0.55,           // Spectral entropy/disorder (0-1)
      unpredictability: 0.48,  // Deviation from expected patterns
      freedom: 0.60            // Degrees of freedom in signal
    }
  }
};

/**
 * Get the current feature packet
 * @returns {Object} Complete feature data packet
 */
export function getCurrentFeatures() {
  currentFeatures.timestamp = Date.now();
  return JSON.parse(JSON.stringify(currentFeatures)); // Deep clone
}

/**
 * Update a specific feature value
 * @param {string} category - The feature category (e.g., 'identity', 'transformation')
 * @param {string} property - The property name (e.g., 'flux', 'coherence')
 * @param {number|string|array} value - The new value
 */
export function updateFeature(category, property, value) {
  if (currentFeatures.features[category] &&
      currentFeatures.features[category].hasOwnProperty(property)) {
    currentFeatures.features[category][property] = value;
    console.log(`🔬 Feature updated: ${category}.${property} = ${value}`);
  } else {
    console.warn(`⚠️ Invalid feature path: ${category}.${property}`);
  }
}

/**
 * Update multiple features at once from an object
 * @param {Object} updates - Object with category.property paths
 */
export function updateFeatures(updates) {
  Object.keys(updates).forEach(key => {
    const [category, property] = key.split('.');
    if (category && property) {
      updateFeature(category, property, updates[key]);
    }
  });
}

/**
 * Reset all features to default values
 */
export function resetFeatures() {
  currentFeatures = {
    timestamp: Date.now(),
    signal: {
      source: "dummy",
      sampleRate: 44100,
      bufferSize: 2048
    },
    features: {
      identity: {
        fundamentalFreq: 440.0,
        harmonics: [440, 880, 1320],
        strength: 0.85
      },
      relationship: {
        ratios: ["2:1", "3:2", "4:3"],
        consonance: 0.72,
        complexity: 3
      },
      complexity: {
        centroid: 1500.0,
        bandwidth: 2000.0,
        brightness: 0.68
      },
      transformation: {
        flux: 0.42,
        velocity: 0.15,
        acceleration: 0.03
      },
      alignment: {
        coherence: 0.78,
        stability: 0.65,
        synchrony: 0.82
      },
      potential: {
        entropy: 0.55,
        unpredictability: 0.48,
        freedom: 0.60
      }
    }
  };
  console.log("🔬 Features reset to defaults");
}

/**
 * Get a flattened list of all numeric features (for easy slider binding)
 * @returns {Object} Key-value pairs of all numeric features
 */
export function getFlatFeatures() {
  const flat = {};
  const features = currentFeatures.features;

  Object.keys(features).forEach(category => {
    Object.keys(features[category]).forEach(property => {
      const value = features[category][property];
      if (typeof value === 'number') {
        flat[`${category}.${property}`] = value;
      }
    });
  });

  return flat;
}

/**
 * Simulate real-time feature extraction (for testing without real audio)
 * Generates slowly evolving random values
 */
let simulationInterval = null;

export function startSimulation() {
  if (simulationInterval) return;

  console.log("🔬 Starting feature simulation...");

  simulationInterval = setInterval(() => {
    const features = currentFeatures.features;

    // Slowly evolve each numeric feature with smooth noise
    Object.keys(features).forEach(category => {
      Object.keys(features[category]).forEach(property => {
        const value = features[category][property];
        if (typeof value === 'number') {
          // Add small random change (-0.02 to +0.02 per frame)
          const change = (Math.random() - 0.5) * 0.04;
          const newValue = Math.max(0, Math.min(1, value + change));
          features[category][property] = newValue;
        }
      });
    });
  }, 100); // Update 10x per second
}

export function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log("🔬 Feature simulation stopped");
  }
}

console.log("🔬 Feature Extractor ready (DUMMY mode)");
console.log("📋 Feature contract established:", currentFeatures);
