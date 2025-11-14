/**
 * Memory Leak Detector
 *
 * Monitors memory usage over time to detect potential leaks.
 * Tracks heap size, growth rate, and identifies suspicious patterns.
 *
 * Usage:
 *   const detector = new MemoryLeakDetector();
 *   detector.start();
 *   // Let run for 10+ minutes...
 *   const report = detector.getReport();
 *   detector.printReport();
 *
 * Features:
 * - Tracks heap size over time
 * - Detects linear growth (leak indicator)
 * - Monitors specific objects/arrays
 * - Checks event listener counts
 * - Validates Three.js resource disposal
 */

console.log("🔍 memoryLeakDetector.js loaded");

export class MemoryLeakDetector {
  constructor(options = {}) {
    this.sampleInterval = options.sampleInterval || 5000; // 5 seconds
    this.maxSamples = options.maxSamples || 120; // 10 minutes at 5s intervals
    this.enabled = false;
    this.intervalId = null;

    // Memory samples
    this.samples = [];
    this.startTime = 0;

    // Tracked objects/arrays
    this.trackedObjects = new Map();

    // Event listener tracking
    this.initialListenerCounts = null;

    // Three.js tracking
    this.initialThreeStats = null;

    console.log(`🔍 MemoryLeakDetector initialized (interval: ${this.sampleInterval}ms, samples: ${this.maxSamples})`);
  }

  start() {
    if (this.enabled) {
      console.warn("🔍 MemoryLeakDetector: Already running");
      return;
    }

    this.enabled = true;
    this.startTime = performance.now();
    this.samples = [];

    // Capture initial state
    this._captureInitialState();

    // Start sampling
    this.intervalId = setInterval(() => {
      this._takeSample();
    }, this.sampleInterval);

    console.log("🔍 MemoryLeakDetector: Started monitoring");
    console.log(`   Will collect ${this.maxSamples} samples over ${(this.maxSamples * this.sampleInterval / 1000 / 60).toFixed(1)} minutes`);
  }

  stop() {
    if (!this.enabled) return;

    this.enabled = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log(`🔍 MemoryLeakDetector: Stopped after ${this.samples.length} samples`);
  }

  _captureInitialState() {
    // Event listeners
    this.initialListenerCounts = this._countEventListeners();

    // Three.js resources
    this.initialThreeStats = this._getThreeStats();

    console.log("🔍 Initial state captured:", {
      listeners: this.initialListenerCounts.total,
      geometries: this.initialThreeStats?.geometries || 0,
      textures: this.initialThreeStats?.textures || 0
    });
  }

  _takeSample() {
    if (!this.enabled || this.samples.length >= this.maxSamples) {
      if (this.samples.length >= this.maxSamples) {
        console.log("🔍 MemoryLeakDetector: Max samples reached, auto-stopping");
        this.stop();
      }
      return;
    }

    const sample = {
      timestamp: performance.now() - this.startTime,
      memory: this._getMemoryStats(),
      listeners: this._countEventListeners(),
      three: this._getThreeStats(),
      tracked: this._getTrackedObjectSizes()
    };

    this.samples.push(sample);

    // Log progress every 10 samples
    if (this.samples.length % 10 === 0) {
      const memMB = sample.memory.usedJSHeapSize / 1048576;
      const elapsed = sample.timestamp / 1000 / 60;
      console.log(`🔍 Progress: ${this.samples.length}/${this.maxSamples} samples, ${elapsed.toFixed(1)}min, ${memMB.toFixed(1)}MB`);
    }
  }

  _getMemoryStats() {
    if (!performance.memory) {
      return {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0,
        available: false
      };
    }

    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      available: true
    };
  }

  _countEventListeners() {
    // Count event listeners on common targets
    const counts = {
      window: 0,
      document: 0,
      body: 0,
      total: 0
    };

    // This is an approximation - exact listener counts are not exposed
    // We can check for known patterns in your codebase
    if (typeof window !== 'undefined') {
      // Estimate based on getEventListeners (Chrome DevTools only)
      if (window.getEventListeners) {
        try {
          const windowListeners = window.getEventListeners(window);
          counts.window = Object.values(windowListeners).reduce((sum, arr) => sum + arr.length, 0);

          const docListeners = window.getEventListeners(document);
          counts.document = Object.values(docListeners).reduce((sum, arr) => sum + arr.length, 0);

          if (document.body) {
            const bodyListeners = window.getEventListeners(document.body);
            counts.body = Object.values(bodyListeners).reduce((sum, arr) => sum + arr.length, 0);
          }
        } catch (e) {
          // getEventListeners not available
        }
      }

      counts.total = counts.window + counts.document + counts.body;
    }

    return counts;
  }

  _getThreeStats() {
    // Check Three.js renderer info if available
    if (typeof window === 'undefined' || !window.renderer) {
      return null;
    }

    try {
      const info = window.renderer.info;
      return {
        geometries: info.memory?.geometries || 0,
        textures: info.memory?.textures || 0,
        programs: info.programs?.length || 0,
        calls: info.render?.calls || 0,
        triangles: info.render?.triangles || 0,
        points: info.render?.points || 0
      };
    } catch (e) {
      return null;
    }
  }

  _getTrackedObjectSizes() {
    const sizes = {};

    for (const [name, ref] of this.trackedObjects.entries()) {
      const obj = ref.deref ? ref.deref() : ref;
      if (!obj) {
        sizes[name] = 0;
        continue;
      }

      if (Array.isArray(obj)) {
        sizes[name] = obj.length;
      } else if (obj instanceof Set) {
        sizes[name] = obj.size;
      } else if (obj instanceof Map) {
        sizes[name] = obj.size;
      } else if (typeof obj === 'object') {
        sizes[name] = Object.keys(obj).length;
      } else {
        sizes[name] = 1;
      }
    }

    return sizes;
  }

  /**
   * Track a specific object/array for growth
   * @param {string} name - Identifier for the object
   * @param {Object|Array} obj - Object to track
   */
  track(name, obj) {
    this.trackedObjects.set(name, obj);
    console.log(`🔍 Now tracking: ${name}`);
  }

  untrack(name) {
    this.trackedObjects.delete(name);
    console.log(`🔍 Stopped tracking: ${name}`);
  }

  /**
   * Analyze samples for memory leaks
   */
  getReport() {
    if (this.samples.length < 2) {
      return { error: 'Not enough samples collected yet' };
    }

    const report = {
      duration: this.samples[this.samples.length - 1].timestamp,
      sampleCount: this.samples.length,
      memory: this._analyzeMemoryGrowth(),
      listeners: this._analyzeListenerGrowth(),
      three: this._analyzeThreeResources(),
      tracked: this._analyzeTrackedObjects(),
      leaks: []
    };

    // Detect potential leaks
    if (report.memory.growthRate > 0.1) {
      report.leaks.push({
        type: 'memory',
        severity: 'high',
        description: `Heap growing at ${report.memory.growthRate.toFixed(2)} MB/min`,
        recommendation: 'Check for unbounded arrays, leaked closures, or undisposed resources'
      });
    }

    if (report.listeners.growth > 10) {
      report.leaks.push({
        type: 'listeners',
        severity: 'medium',
        description: `${report.listeners.growth} new event listeners detected`,
        recommendation: 'Ensure removeEventListener is called when components unmount'
      });
    }

    if (report.three?.geometryGrowth > 100) {
      report.leaks.push({
        type: 'three.js',
        severity: 'high',
        description: `${report.three.geometryGrowth} geometries not disposed`,
        recommendation: 'Call geometry.dispose() and material.dispose() after use'
      });
    }

    for (const [name, growth] of Object.entries(report.tracked)) {
      if (growth.rate > 10) {
        report.leaks.push({
          type: 'tracked',
          severity: 'medium',
          description: `${name} growing at ${growth.rate.toFixed(1)} items/min`,
          recommendation: `Check if ${name} needs a maximum size or cleanup logic`
        });
      }
    }

    return report;
  }

  _analyzeMemoryGrowth() {
    if (!this.samples[0].memory.available) {
      return { available: false };
    }

    const firstSample = this.samples[0];
    const lastSample = this.samples[this.samples.length - 1];

    const startMB = firstSample.memory.usedJSHeapSize / 1048576;
    const endMB = lastSample.memory.usedJSHeapSize / 1048576;
    const deltaMB = endMB - startMB;
    const durationMin = (lastSample.timestamp - firstSample.timestamp) / 1000 / 60;
    const growthRate = deltaMB / durationMin; // MB/min

    // Calculate linear regression to detect consistent growth
    const times = this.samples.map(s => s.timestamp);
    const values = this.samples.map(s => s.memory.usedJSHeapSize / 1048576);

    const n = times.length;
    const sumX = times.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = times.reduce((sum, x, i) => sum + x * values[i], 0);
    const sumX2 = times.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const r2 = this._calculateR2(times, values, slope);

    return {
      available: true,
      startMB,
      endMB,
      deltaMB,
      durationMin,
      growthRate,
      slope,
      r2,
      isLinearGrowth: r2 > 0.7 && slope > 0.01,
      samples: this.samples.map(s => ({
        time: s.timestamp / 1000 / 60,
        mb: s.memory.usedJSHeapSize / 1048576
      }))
    };
  }

  _calculateR2(x, y, slope) {
    const n = x.length;
    const meanY = y.reduce((a, b) => a + b, 0) / n;
    const intercept = (y.reduce((a, b) => a + b, 0) - slope * x.reduce((a, b) => a + b, 0)) / n;

    const ssRes = y.reduce((sum, yi, i) => {
      const predicted = slope * x[i] + intercept;
      return sum + Math.pow(yi - predicted, 2);
    }, 0);

    const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);

    return 1 - (ssRes / ssTot);
  }

  _analyzeListenerGrowth() {
    const first = this.samples[0].listeners;
    const last = this.samples[this.samples.length - 1].listeners;

    return {
      initial: first.total,
      current: last.total,
      growth: last.total - first.total,
      window: last.window - first.window,
      document: last.document - first.document,
      body: last.body - first.body
    };
  }

  _analyzeThreeResources() {
    if (!this.samples[0].three) {
      return null;
    }

    const first = this.samples[0].three;
    const last = this.samples[this.samples.length - 1].three;

    return {
      geometries: {
        initial: first.geometries,
        current: last.geometries,
        growth: last.geometries - first.geometries
      },
      textures: {
        initial: first.textures,
        current: last.textures,
        growth: last.textures - first.textures
      },
      programs: {
        initial: first.programs,
        current: last.programs,
        growth: last.programs - first.programs
      },
      geometryGrowth: last.geometries - first.geometries,
      textureGrowth: last.textures - first.textures
    };
  }

  _analyzeTrackedObjects() {
    const analysis = {};

    for (const name of this.trackedObjects.keys()) {
      const first = this.samples[0].tracked[name] || 0;
      const last = this.samples[this.samples.length - 1].tracked[name] || 0;
      const growth = last - first;
      const durationMin = (this.samples[this.samples.length - 1].timestamp - this.samples[0].timestamp) / 1000 / 60;
      const rate = growth / durationMin;

      analysis[name] = {
        initial: first,
        current: last,
        growth,
        rate
      };
    }

    return analysis;
  }

  /**
   * Print formatted report to console
   */
  printReport() {
    const report = this.getReport();

    if (report.error) {
      console.warn('🔍 Memory Leak Detector: Not enough data yet');
      return;
    }

    console.log('\n🔍 ═══════════════════════════════════════════════════════════');
    console.log('🔍 MEMORY LEAK DETECTION REPORT');
    console.log('🔍 ═══════════════════════════════════════════════════════════');

    console.log(`\n⏱️  Session Stats:`);
    console.log(`   Duration: ${(report.duration / 1000 / 60).toFixed(1)} minutes`);
    console.log(`   Samples: ${report.sampleCount}`);

    if (report.memory.available) {
      console.log(`\n💾 Memory Analysis:`);
      console.log(`   Start: ${report.memory.startMB.toFixed(1)} MB`);
      console.log(`   End: ${report.memory.endMB.toFixed(1)} MB`);
      console.log(`   Change: ${report.memory.deltaMB > 0 ? '+' : ''}${report.memory.deltaMB.toFixed(1)} MB`);
      console.log(`   Growth Rate: ${report.memory.growthRate > 0 ? '+' : ''}${report.memory.growthRate.toFixed(2)} MB/min`);
      console.log(`   Linear Growth: ${report.memory.isLinearGrowth ? '⚠️  YES (R² = ' + report.memory.r2.toFixed(3) + ')' : '✓ No'}`);

      if (report.memory.isLinearGrowth) {
        console.log(`   \x1b[33m⚠️  WARNING: Linear memory growth detected - likely memory leak!\x1b[0m`);
      }
    } else {
      console.log(`\n💾 Memory Analysis: \x1b[33mNot available (performance.memory not supported)\x1b[0m`);
    }

    console.log(`\n📡 Event Listeners:`);
    console.log(`   Initial: ${report.listeners.initial}`);
    console.log(`   Current: ${report.listeners.current}`);
    console.log(`   Growth: ${report.listeners.growth > 0 ? '+' : ''}${report.listeners.growth}`);

    if (report.listeners.growth > 10) {
      console.log(`   \x1b[33m⚠️  WARNING: ${report.listeners.growth} new listeners - potential leak!\x1b[0m`);
    }

    if (report.three) {
      console.log(`\n🎨 Three.js Resources:`);
      console.log(`   Geometries: ${report.three.geometries.initial} → ${report.three.geometries.current} (${report.three.geometryGrowth > 0 ? '+' : ''}${report.three.geometryGrowth})`);
      console.log(`   Textures: ${report.three.textures.initial} → ${report.three.textures.current} (${report.three.textureGrowth > 0 ? '+' : ''}${report.three.textureGrowth})`);

      if (report.three.geometryGrowth > 100 || report.three.textureGrowth > 10) {
        console.log(`   \x1b[33m⚠️  WARNING: Resources not being disposed properly!\x1b[0m`);
      }
    }

    if (Object.keys(report.tracked).length > 0) {
      console.log(`\n📊 Tracked Objects:`);
      for (const [name, data] of Object.entries(report.tracked)) {
        const color = data.rate > 10 ? '\x1b[33m' : '\x1b[32m';
        console.log(`${color}   ${name}: ${data.initial} → ${data.current} (+${data.growth}, ${data.rate.toFixed(1)}/min)\x1b[0m`);
      }
    }

    if (report.leaks.length > 0) {
      console.log(`\n🚨 POTENTIAL LEAKS DETECTED:`);
      console.log('─'.repeat(63));

      for (const leak of report.leaks) {
        const severityColor = leak.severity === 'high' ? '\x1b[31m' : '\x1b[33m';
        console.log(`${severityColor}${leak.severity.toUpperCase().padEnd(6)}\x1b[0m │ ${leak.type}`);
        console.log(`       │ ${leak.description}`);
        console.log(`       │ 💡 ${leak.recommendation}`);
        console.log('─'.repeat(63));
      }
    } else {
      console.log(`\n✅ \x1b[32mNo obvious leaks detected!\x1b[0m`);
    }

    console.log('\n═'.repeat(63));
  }

  /**
   * Export data for external analysis
   */
  exportData() {
    return {
      samples: this.samples,
      report: this.getReport()
    };
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  window.memoryLeakDetector = new MemoryLeakDetector();
}

console.log("🔍 MemoryLeakDetector class ready");
