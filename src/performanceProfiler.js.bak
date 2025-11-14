/**
 * Performance Profiler for MMPA Animation Loop
 *
 * Instruments the animation loop to measure time spent in each subsystem.
 * Provides empirical data about performance bottlenecks.
 *
 * Usage:
 *   import { PerformanceProfiler } from './performanceProfiler.js';
 *
 *   const profiler = new PerformanceProfiler();
 *
 *   // In animation loop:
 *   profiler.startFrame();
 *
 *   profiler.mark('audio');
 *   updateAudio();
 *
 *   profiler.mark('particles');
 *   updateParticles();
 *
 *   profiler.endFrame();
 *
 *   // Get results:
 *   const report = profiler.getReport();
 *   console.log(report);
 */

export class PerformanceProfiler {
  constructor(options = {}) {
    this.enabled = options.enabled !== false;
    this.sampleSize = options.sampleSize || 300; // ~5 seconds at 60fps
    this.autoReport = options.autoReport !== false;
    this.reportInterval = options.reportInterval || 5000; // 5 seconds

    this.frames = [];
    this.currentFrame = null;
    this.lastMarkTime = 0;
    this.lastReportTime = 0;

    // Track memory if available
    this.trackMemory = !!performance.memory;

    console.log(`📊 Performance Profiler initialized (samples: ${this.sampleSize}, memory: ${this.trackMemory})`);
  }

  startFrame() {
    if (!this.enabled) return;

    this.currentFrame = {
      timestamp: performance.now(),
      marks: [],
      memory: this.trackMemory ? performance.memory.usedJSHeapSize : null,
      totalTime: 0
    };

    this.lastMarkTime = performance.now();
  }

  mark(name) {
    if (!this.enabled || !this.currentFrame) return;

    const now = performance.now();
    const duration = now - this.lastMarkTime;

    this.currentFrame.marks.push({
      name,
      duration
    });

    this.lastMarkTime = now;
  }

  endFrame() {
    if (!this.enabled || !this.currentFrame) return;

    const now = performance.now();
    this.currentFrame.totalTime = now - this.currentFrame.timestamp;

    // Add final mark for rendering
    this.currentFrame.marks.push({
      name: '_untracked',
      duration: now - this.lastMarkTime
    });

    this.frames.push(this.currentFrame);

    // Keep only last N frames
    if (this.frames.length > this.sampleSize) {
      this.frames.shift();
    }

    // Auto-report if enabled
    if (this.autoReport && now - this.lastReportTime > this.reportInterval) {
      this.printReport();
      this.lastReportTime = now;
    }

    this.currentFrame = null;
  }

  getReport() {
    if (this.frames.length === 0) {
      return { error: 'No frames collected yet' };
    }

    const report = {
      frameCount: this.frames.length,
      timeRange: {
        start: this.frames[0].timestamp,
        end: this.frames[this.frames.length - 1].timestamp,
        duration: this.frames[this.frames.length - 1].timestamp - this.frames[0].timestamp
      },
      fps: {
        average: 0,
        min: Infinity,
        max: 0
      },
      subsystems: {},
      memory: null
    };

    // Calculate FPS
    const frameTimes = this.frames.map(f => f.totalTime);
    report.fps.average = 1000 / (frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length);
    report.fps.min = 1000 / Math.max(...frameTimes);
    report.fps.max = 1000 / Math.min(...frameTimes);

    // Aggregate subsystem times
    const subsystemTotals = {};
    const subsystemCounts = {};
    const subsystemMin = {};
    const subsystemMax = {};

    for (const frame of this.frames) {
      for (const mark of frame.marks) {
        if (!subsystemTotals[mark.name]) {
          subsystemTotals[mark.name] = 0;
          subsystemCounts[mark.name] = 0;
          subsystemMin[mark.name] = Infinity;
          subsystemMax[mark.name] = 0;
        }

        subsystemTotals[mark.name] += mark.duration;
        subsystemCounts[mark.name]++;
        subsystemMin[mark.name] = Math.min(subsystemMin[mark.name], mark.duration);
        subsystemMax[mark.name] = Math.max(subsystemMax[mark.name], mark.duration);
      }
    }

    // Calculate averages and percentages
    const totalFrameTime = frameTimes.reduce((a, b) => a + b, 0);

    for (const name in subsystemTotals) {
      const avg = subsystemTotals[name] / subsystemCounts[name];
      const total = subsystemTotals[name];
      const percentage = (total / totalFrameTime) * 100;

      report.subsystems[name] = {
        average: avg,
        min: subsystemMin[name],
        max: subsystemMax[name],
        total: total,
        percentage: percentage,
        calls: subsystemCounts[name]
      };
    }

    // Memory stats
    if (this.trackMemory) {
      const memSamples = this.frames.map(f => f.memory).filter(m => m !== null);
      report.memory = {
        current: memSamples[memSamples.length - 1] / 1048576, // MB
        min: Math.min(...memSamples) / 1048576,
        max: Math.max(...memSamples) / 1048576,
        average: memSamples.reduce((a, b) => a + b, 0) / memSamples.length / 1048576
      };
    }

    return report;
  }

  getTopBottlenecks(count = 5) {
    const report = this.getReport();
    if (report.error) return [];

    const subsystems = Object.entries(report.subsystems)
      .filter(([name]) => name !== '_untracked')
      .sort((a, b) => b[1].average - a[1].average)
      .slice(0, count);

    return subsystems.map(([name, stats]) => ({
      name,
      avgTime: stats.average,
      percentage: stats.percentage,
      maxTime: stats.max
    }));
  }

  printReport() {
    const report = this.getReport();

    if (report.error) {
      console.warn('📊 Performance Report: Not enough data yet');
      return;
    }

    console.log('\n📊 ═══════════════════════════════════════════════════════════');
    console.log('📊 PERFORMANCE PROFILER REPORT');
    console.log('📊 ═══════════════════════════════════════════════════════════');

    console.log(`\n⏱️  Frame Statistics (${report.frameCount} frames):`);
    console.log(`   Average FPS: ${report.fps.average.toFixed(1)}`);
    console.log(`   Min FPS: ${report.fps.min.toFixed(1)}`);
    console.log(`   Max FPS: ${report.fps.max.toFixed(1)}`);

    if (report.memory) {
      console.log(`\n💾 Memory Usage:`);
      console.log(`   Current: ${report.memory.current.toFixed(1)} MB`);
      console.log(`   Average: ${report.memory.average.toFixed(1)} MB`);
      console.log(`   Range: ${report.memory.min.toFixed(1)} - ${report.memory.max.toFixed(1)} MB`);
    }

    console.log(`\n🔥 Top 10 Subsystems by Time:`);
    console.log('─'.repeat(63));
    console.log('Rank | Subsystem                  | Avg(ms) | Max(ms) |  % Frame');
    console.log('─'.repeat(63));

    const sorted = Object.entries(report.subsystems)
      .filter(([name]) => name !== '_untracked')
      .sort((a, b) => b[1].average - a[1].average)
      .slice(0, 10);

    sorted.forEach(([name, stats], index) => {
      const rank = (index + 1).toString().padStart(4);
      const subsystem = name.padEnd(26);
      const avg = stats.average.toFixed(3).padStart(7);
      const max = stats.max.toFixed(3).padStart(7);
      const pct = stats.percentage.toFixed(1).padStart(6);

      // Color code by severity
      let color = '\x1b[32m'; // Green
      if (stats.average > 5) color = '\x1b[33m'; // Yellow
      if (stats.average > 10) color = '\x1b[31m'; // Red

      console.log(`${color}${rank} | ${subsystem} | ${avg} | ${max} | ${pct}%\x1b[0m`);
    });

    // Untracked time
    const untracked = report.subsystems['_untracked'];
    if (untracked) {
      console.log('─'.repeat(63));
      console.log(`     | Untracked overhead         | ${untracked.average.toFixed(3).padStart(7)} | ${untracked.max.toFixed(3).padStart(7)} | ${untracked.percentage.toFixed(1).padStart(6)}%`);
    }

    console.log('═'.repeat(63));

    // Warnings
    const bottlenecks = this.getTopBottlenecks(3);
    const slowestSubsystem = bottlenecks[0];

    if (slowestSubsystem && slowestSubsystem.avgTime > 10) {
      console.log(`\n⚠️  WARNING: "${slowestSubsystem.name}" is taking ${slowestSubsystem.avgTime.toFixed(2)}ms/frame`);
      console.log(`   This subsystem is consuming ${slowestSubsystem.percentage.toFixed(1)}% of frame time!`);
    }

    const totalAverageFrameTime = Object.values(report.subsystems)
      .reduce((sum, s) => sum + s.average, 0);

    if (totalAverageFrameTime > 16.67) {
      const targetFPS = 1000 / totalAverageFrameTime;
      console.log(`\n⚠️  WARNING: Frame time (${totalAverageFrameTime.toFixed(2)}ms) exceeds 60fps budget (16.67ms)`);
      console.log(`   Current effective FPS: ${targetFPS.toFixed(1)}`);
    }

    console.log('\n');
  }

  reset() {
    this.frames = [];
    this.currentFrame = null;
    console.log('📊 Performance profiler reset');
  }

  enable() {
    this.enabled = true;
    console.log('📊 Performance profiler enabled');
  }

  disable() {
    this.enabled = false;
    console.log('📊 Performance profiler disabled');
  }
}

// Singleton instance for easy global access
export const globalProfiler = new PerformanceProfiler({
  enabled: false, // Disabled by default
  autoReport: true,
  reportInterval: 10000 // 10 seconds
});

// Expose to window for debugging
if (typeof window !== 'undefined') {
  window.performanceProfiler = globalProfiler;
}

console.log('📊 performanceProfiler.js loaded');
