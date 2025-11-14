import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use happy-dom for browser-like environment
    environment: 'happy-dom',

    // Global test setup
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        '**/*.config.js',
        '**/main.js',
        '**/preload.js',
        'scripts/',
        '**/*.test.js',
        '**/*.spec.js'
      ]
    },

    // Test file patterns
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    // Setup files
    setupFiles: ['./test/setup.js'],

    // Test timeout
    testTimeout: 10000,

    // Watch mode
    watch: false
  }
});
