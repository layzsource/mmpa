console.log("📊 dataLogger.js loaded");

/**
 * MMPA Data Logger - Training Data Collection
 *
 * Implements a circular buffer to record φ-coherence metrics
 * for training the Pattern Recognition module.
 *
 * Captures:
 * - Stability Metric (φ-coherence measure)
 * - Flux Metric (system activity/energy)
 * - Detected Archetype
 * - Timestamp
 *
 * Enables export to JSON/CSV formats with statistics.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const LOGGER_CONFIG = {
  BUFFER_SIZE: 500,              // Number of samples to retain
  AUTO_SAVE_INTERVAL: 60000,     // Auto-save every 60 seconds (optional)
  ENABLE_AUTO_SAVE: false        // Disable by default
};

// ============================================================================
// CIRCULAR BUFFER
// ============================================================================

class CircularBuffer {
  constructor(size) {
    this.size = size;
    this.buffer = [];
    this.writeIndex = 0;
    this.isFull = false;
  }

  /**
   * Add a sample to the buffer
   */
  push(sample) {
    if (this.isFull) {
      this.buffer[this.writeIndex] = sample;
    } else {
      this.buffer.push(sample);
    }

    this.writeIndex = (this.writeIndex + 1) % this.size;

    if (this.writeIndex === 0 && !this.isFull) {
      this.isFull = true;
    }
  }

  /**
   * Get all samples in chronological order
   */
  getAll() {
    if (!this.isFull) {
      return [...this.buffer];
    }

    // If buffer is full, reorder to return oldest-to-newest
    const older = this.buffer.slice(this.writeIndex);
    const newer = this.buffer.slice(0, this.writeIndex);
    return [...older, ...newer];
  }

  /**
   * Get the number of samples currently stored
   */
  getCount() {
    return this.isFull ? this.size : this.buffer.length;
  }

  /**
   * Clear the buffer
   */
  clear() {
    this.buffer = [];
    this.writeIndex = 0;
    this.isFull = false;
  }
}

// ============================================================================
// DATA LOGGER STATE
// ============================================================================

let loggerState = {
  buffer: new CircularBuffer(LOGGER_CONFIG.BUFFER_SIZE),
  isLogging: false,
  startTime: null,
  sampleCount: 0,
  autoSaveInterval: null
};

// ============================================================================
// LOGGING FUNCTIONS
// ============================================================================

/**
 * Add a sample to the log
 * @param {number} stabilityMetric - φ-coherence measure
 * @param {number} fluxMetric - System activity measure
 * @param {string} archetype - Detected archetype (PERFECT_FIFTH, WOLF_FIFTH, NEUTRAL_STATE)
 */
export function logSample(stabilityMetric, fluxMetric, archetype) {
  if (!loggerState.isLogging) return;

  const sample = {
    timestamp: performance.now(),
    stability: stabilityMetric,
    flux: fluxMetric,
    archetype: archetype,
    sampleIndex: loggerState.sampleCount++
  };

  loggerState.buffer.push(sample);
}

/**
 * Start logging
 */
export function startLogging() {
  if (loggerState.isLogging) {
    console.log("📊 Data logger already running");
    return;
  }

  loggerState.isLogging = true;
  loggerState.startTime = performance.now();
  loggerState.sampleCount = 0;

  console.log(`📊 Data logging started (buffer size: ${LOGGER_CONFIG.BUFFER_SIZE})`);

  // Optional auto-save
  if (LOGGER_CONFIG.ENABLE_AUTO_SAVE) {
    loggerState.autoSaveInterval = setInterval(() => {
      exportData('json', true); // Auto-save in background
    }, LOGGER_CONFIG.AUTO_SAVE_INTERVAL);
  }
}

/**
 * Stop logging
 */
export function stopLogging() {
  if (!loggerState.isLogging) {
    console.log("📊 Data logger not running");
    return;
  }

  loggerState.isLogging = false;

  if (loggerState.autoSaveInterval) {
    clearInterval(loggerState.autoSaveInterval);
    loggerState.autoSaveInterval = null;
  }

  console.log(`📊 Data logging stopped (${loggerState.sampleCount} samples collected)`);
}

/**
 * Check if logging is active
 */
export function isLogging() {
  return loggerState.isLogging;
}

/**
 * Clear all logged data
 */
export function clearLog() {
  loggerState.buffer.clear();
  loggerState.sampleCount = 0;
  console.log("📊 Data log cleared");
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Calculate statistics from the logged data
 * @returns {object} Statistics summary
 */
export function getStatistics() {
  const samples = loggerState.buffer.getAll();
  const count = samples.length;

  if (count === 0) {
    return {
      sampleCount: 0,
      duration: 0,
      stability: { mean: 0, min: 0, max: 0, stdDev: 0 },
      flux: { mean: 0, min: 0, max: 0, stdDev: 0 },
      archetypes: {}
    };
  }

  // Stability statistics
  const stabilityValues = samples.map(s => s.stability);
  const stabilityMean = stabilityValues.reduce((a, b) => a + b, 0) / count;
  const stabilityMin = Math.min(...stabilityValues);
  const stabilityMax = Math.max(...stabilityValues);
  const stabilityVariance = stabilityValues.reduce((sum, val) => sum + Math.pow(val - stabilityMean, 2), 0) / count;
  const stabilityStdDev = Math.sqrt(stabilityVariance);

  // Flux statistics
  const fluxValues = samples.map(s => s.flux);
  const fluxMean = fluxValues.reduce((a, b) => a + b, 0) / count;
  const fluxMin = Math.min(...fluxValues);
  const fluxMax = Math.max(...fluxValues);
  const fluxVariance = fluxValues.reduce((sum, val) => sum + Math.pow(val - fluxMean, 2), 0) / count;
  const fluxStdDev = Math.sqrt(fluxVariance);

  // Archetype distribution
  const archetypeCounts = {};
  samples.forEach(s => {
    archetypeCounts[s.archetype] = (archetypeCounts[s.archetype] || 0) + 1;
  });

  const archetypeDistribution = {};
  for (const [archetype, count] of Object.entries(archetypeCounts)) {
    archetypeDistribution[archetype] = {
      count: count,
      percentage: ((count / samples.length) * 100).toFixed(2)
    };
  }

  // Duration
  const duration = samples.length > 0 ?
    samples[samples.length - 1].timestamp - samples[0].timestamp : 0;

  return {
    sampleCount: count,
    duration: (duration / 1000).toFixed(2), // Convert to seconds
    stability: {
      mean: stabilityMean.toFixed(4),
      min: stabilityMin.toFixed(4),
      max: stabilityMax.toFixed(4),
      stdDev: stabilityStdDev.toFixed(4)
    },
    flux: {
      mean: fluxMean.toFixed(4),
      min: fluxMin.toFixed(4),
      max: fluxMax.toFixed(4),
      stdDev: fluxStdDev.toFixed(4)
    },
    archetypes: archetypeDistribution
  };
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

/**
 * Export data to JSON or CSV format
 * @param {string} format - 'json' or 'csv'
 * @param {boolean} silent - If true, don't trigger download (for auto-save)
 * @returns {string} Exported data string
 */
export function exportData(format = 'json', silent = false) {
  const samples = loggerState.buffer.getAll();
  const stats = getStatistics();

  if (samples.length === 0) {
    console.warn("📊 No data to export");
    return null;
  }

  let exportString = '';
  let filename = '';
  let mimeType = '';

  if (format === 'json') {
    const exportObject = {
      metadata: {
        exportDate: new Date().toISOString(),
        sampleCount: samples.length,
        bufferSize: LOGGER_CONFIG.BUFFER_SIZE,
        sessionStartTime: loggerState.startTime,
        statistics: stats
      },
      samples: samples
    };

    exportString = JSON.stringify(exportObject, null, 2);
    filename = `mmpa_training_data_${Date.now()}.json`;
    mimeType = 'application/json';

  } else if (format === 'csv') {
    // CSV Header
    const header = 'sampleIndex,timestamp,stability,flux,archetype\n';

    // CSV Rows
    const rows = samples.map(s =>
      `${s.sampleIndex},${s.timestamp.toFixed(2)},${s.stability.toFixed(4)},${s.flux.toFixed(4)},${s.archetype}`
    ).join('\n');

    exportString = header + rows;
    filename = `mmpa_training_data_${Date.now()}.csv`;
    mimeType = 'text/csv';
  } else {
    console.error(`📊 Unknown export format: ${format}`);
    return null;
  }

  // Trigger download (unless silent mode)
  if (!silent) {
    triggerDownload(exportString, filename, mimeType);
    console.log(`📊 Exported ${samples.length} samples as ${format.toUpperCase()}`);
  }

  return exportString;
}

/**
 * Trigger browser download
 */
function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================================
// CONFIGURATION UPDATES
// ============================================================================

/**
 * Update logger configuration
 */
export function updateConfig(newConfig) {
  if (newConfig.bufferSize !== undefined) {
    LOGGER_CONFIG.BUFFER_SIZE = newConfig.bufferSize;
    loggerState.buffer = new CircularBuffer(newConfig.bufferSize);
    console.log(`📊 Buffer size updated to ${newConfig.bufferSize}`);
  }

  if (newConfig.autoSaveInterval !== undefined) {
    LOGGER_CONFIG.AUTO_SAVE_INTERVAL = newConfig.autoSaveInterval;
    console.log(`📊 Auto-save interval updated to ${newConfig.autoSaveInterval}ms`);
  }

  if (newConfig.enableAutoSave !== undefined) {
    LOGGER_CONFIG.ENABLE_AUTO_SAVE = newConfig.enableAutoSave;
    console.log(`📊 Auto-save ${newConfig.enableAutoSave ? 'enabled' : 'disabled'}`);
  }
}

/**
 * Get current logger status
 */
export function getStatus() {
  const stats = getStatistics();
  return {
    isLogging: loggerState.isLogging,
    sampleCount: loggerState.sampleCount,
    bufferSize: LOGGER_CONFIG.BUFFER_SIZE,
    bufferUsage: `${loggerState.buffer.getCount()}/${LOGGER_CONFIG.BUFFER_SIZE}`,
    statistics: stats
  };
}

console.log("📊 dataLogger.js ready - Circular Buffer for Training Data Collection");
