#!/usr/bin/env node

/**
 * Remove Performance Profiling Instrumentation
 *
 * This script removes profiler marks from geometry.js
 * and restores the original version.
 *
 * Usage:
 *   node scripts/remove_profiling.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const geometryPath = path.join(__dirname, '../src/geometry.js');
const backupPath = path.join(__dirname, '../src/geometry.js.backup');

console.log('📊 Removing Performance Profiling Instrumentation');
console.log('═'.repeat(60));

// Check if backup exists
if (!fs.existsSync(backupPath)) {
  console.log('⚠️  No backup found. geometry.js may not be instrumented.');
  console.log('   If you want to restore, manually remove profiler calls.');
  process.exit(1);
}

// Restore from backup
const backup = fs.readFileSync(backupPath, 'utf8');
fs.writeFileSync(geometryPath, backup);
console.log('✓ Restored original geometry.js from backup');

// Remove backup file
fs.unlinkSync(backupPath);
console.log('✓ Removed backup file');

console.log('\n═'.repeat(60));
console.log('✅ Instrumentation removed!');
console.log('\ngeometry.js has been restored to its original state.');
