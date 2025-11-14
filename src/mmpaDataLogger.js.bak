// MMPA Data Logger
// Collects π/φ/synchronicity measurements for empirical analysis

console.log("📊 mmpaDataLogger.js loaded");

// Data storage
let dataLog = [];
let sessionStartTime = null;
let isLogging = false;
const MAX_LOG_ENTRIES = 60000; // 1000 entries/minute * 60 minutes = 1 hour max

/**
 * Start logging MMPA data
 */
export function startLogging() {
  isLogging = true;
  sessionStartTime = Date.now();
  dataLog = [];
  console.log("📊 MMPA logging started");
}

/**
 * Stop logging MMPA data
 */
export function stopLogging() {
  isLogging = false;
  console.log(`📊 MMPA logging stopped. Collected ${dataLog.length} samples`);
}

/**
 * Check if logging is active
 */
export function isActive() {
  return isLogging;
}

/**
 * Log a single MMPA measurement
 * @param {object} analysis - MMPA analysis result
 */
export function logData(analysis) {
  if (!isLogging) return;

  const timestamp = Date.now();
  const relativeTime = sessionStartTime ? (timestamp - sessionStartTime) / 1000 : 0;

  const entry = {
    timestamp,
    relativeTime,
    pi: analysis.pi || 0,
    phi: analysis.phi || 0,
    synchronicity: analysis.synchronicity || 0,
    balance: analysis.balance || 0.5,
    archetype: analysis.archetype || 'NEUTRAL_STATE',
    confidence: analysis.confidence || 0
  };

  dataLog.push(entry);

  // Limit log size
  if (dataLog.length > MAX_LOG_ENTRIES) {
    dataLog.shift(); // Remove oldest entry
  }
}

/**
 * Export logged data as JSON
 * @returns {string} - JSON string of logged data
 */
export function exportToJSON() {
  const exportData = {
    sessionStart: sessionStartTime,
    sessionDuration: sessionStartTime ? (Date.now() - sessionStartTime) / 1000 : 0,
    sampleCount: dataLog.length,
    samplingRate: dataLog.length / ((Date.now() - sessionStartTime) / 1000),
    data: dataLog
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Download logged data as JSON file
 */
export function downloadJSON() {
  const jsonData = exportToJSON();
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const filename = `mmpa_data_${timestamp}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log(`📊 Downloaded ${dataLog.length} samples to ${filename}`);
}

/**
 * Get current logging statistics
 */
export function getStats() {
  if (!sessionStartTime || dataLog.length === 0) {
    return {
      isLogging,
      sampleCount: 0,
      duration: 0,
      samplingRate: 0
    };
  }

  const duration = (Date.now() - sessionStartTime) / 1000;
  const samplingRate = dataLog.length / duration;

  return {
    isLogging,
    sampleCount: dataLog.length,
    duration,
    samplingRate: samplingRate.toFixed(2)
  };
}

/**
 * Clear all logged data
 */
export function clearLog() {
  dataLog = [];
  sessionStartTime = null;
  console.log("📊 MMPA log cleared");
}

// Make functions available globally for console access
if (typeof window !== 'undefined') {
  window.mmpaLogger = {
    start: startLogging,
    stop: stopLogging,
    download: downloadJSON,
    stats: getStats,
    clear: clearLog,
    isActive
  };

  console.log("📊 MMPA Data Logger ready");
  console.log("   Console commands:");
  console.log("   - mmpaLogger.start()    : Start logging");
  console.log("   - mmpaLogger.stop()     : Stop logging");
  console.log("   - mmpaLogger.download() : Download JSON");
  console.log("   - mmpaLogger.stats()    : Show statistics");
  console.log("   - mmpaLogger.clear()    : Clear log data");
}
