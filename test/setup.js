/**
 * Vitest Global Setup
 *
 * This file runs before all tests and sets up the test environment.
 */

import { vi } from 'vitest';

// Mock browser APIs that aren't available in happy-dom
global.performance = global.performance || {
  now: () => Date.now(),
  memory: {
    usedJSHeapSize: 100 * 1024 * 1024,
    totalJSHeapSize: 200 * 1024 * 1024,
    jsHeapSizeLimit: 2048 * 1024 * 1024
  }
};

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((callback) => {
  return setTimeout(() => callback(performance.now()), 16);
});

global.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id);
});

// Mock console methods for cleaner test output
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
};

// Restore console.error for actual errors during tests
global.console.error = console.error;
