#!/usr/bin/env node

/**
 * Automated Performance Profiling Instrumentation
 *
 * This script adds performance profiler marks to geometry.js
 * without manual editing.
 *
 * Usage:
 *   node scripts/add_profiling.js
 *
 * This will:
 *   1. Backup original geometry.js
 *   2. Add profiler import
 *   3. Inject profiler.mark() calls at strategic points
 *   4. Save instrumented version
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const geometryPath = path.join(__dirname, '../src/geometry.js');
const backupPath = path.join(__dirname, '../src/geometry.js.backup');

console.log('📊 Performance Profiling Instrumentation');
console.log('═'.repeat(60));

// Read geometry.js
let code = fs.readFileSync(geometryPath, 'utf8');

// Check if already instrumented
if (code.includes('globalProfiler')) {
  console.log('⚠️  geometry.js is already instrumented!');
  console.log('   Remove instrumentation first with: node scripts/remove_profiling.js');
  process.exit(1);
}

// Backup original
fs.writeFileSync(backupPath, code);
console.log(`✓ Backed up original to: ${path.basename(backupPath)}`);

// 1. Add import at the top (after existing imports)
const importStatement = `import { globalProfiler } from './performanceProfiler.js';`;

// Find the last import statement
const lastImportMatch = code.match(/import.*from.*['"]\.[^'"]+['"];?\n(?!import)/);
if (lastImportMatch) {
  const insertPosition = lastImportMatch.index + lastImportMatch[0].length;
  code = code.slice(0, insertPosition) + importStatement + '\n' + code.slice(insertPosition);
  console.log('✓ Added profiler import');
} else {
  console.error('❌ Could not find import section');
  process.exit(1);
}

// 2. Add profiler.startFrame() at the beginning of animate()
code = code.replace(
  /(function animate\(\) \{[\s\n]+requestAnimationFrame\(animate\);[\s\n]+try \{)/,
  `$1\n    globalProfiler.startFrame();`
);
console.log('✓ Added startFrame() call');

// 3. Add profiler.endFrame() before the catch block
code = code.replace(
  /(consecutiveAnimationErrors = 0;[\s\n]+)(  \} catch)/,
  `$1    globalProfiler.endFrame();\n\n$2`
);
console.log('✓ Added endFrame() call');

// 4. Add profiler.mark() calls for major subsystems
const marks = [
  { pattern: /(updateSpatialGrammar\(\);)/, mark: 'spatial-grammar', position: 'before' },
  { pattern: /(window\.gamepadManager\.update\(\);)/, mark: 'gamepad', position: 'before' },
  { pattern: /(orbitControls\.update\(\);)/, mark: 'orbit-controls', position: 'before' },
  { pattern: /(updateInterpolation\(\);)/, mark: 'interpolation', position: 'before' },
  { pattern: /(updateChain\(\);)/, mark: 'morph-chain', position: 'before' },
  { pattern: /(const mmpaVisuals = mapFeaturesToVisuals)/, mark: 'mmpa-mapping', position: 'before' },
  { pattern: /(if \(mmpaVisuals && ambientLight\))/, mark: 'mmpa-apply', position: 'before' },
  { pattern: /(morphMesh\.rotation\.x \+= rotX;)/, mark: 'geometry-transform', position: 'before' },
  { pattern: /(if \(state\.audioReactive\) updateAudio\(\);)/, mark: 'audio-update', position: 'before' },
  { pattern: /(updateGeometryFromState\(\);)/, mark: 'geometry-state', position: 'before' },
  { pattern: /(updatePlatonicMorph\(state\.geometry\.activeNotes)/, mark: 'platonic-morph', position: 'before' },
  { pattern: /(updateShadows\(state\.audioReactive\);)/, mark: 'shadows', position: 'before' },
  { pattern: /(if \(state\.particlesEnabled\) \{[\s\n]+updateParticles)/, mark: 'particles', position: 'before' },
  { pattern: /(updateSprites\(\);)/, mark: 'sprites', position: 'before' },
  { pattern: /(updateVisual\(camera, mmpaVisuals\);)/, mark: 'visual-background', position: 'before' },
  { pattern: /(updateCellularAutomata\(renderer\);)/, mark: 'cellular-automata', position: 'before' },
  { pattern: /(updateVoxelFloor\(performance\.now)/, mark: 'voxel-floor', position: 'before' },
  { pattern: /(updateVoxelMist\(performance\.now)/, mark: 'voxel-mist', position: 'before' },
  { pattern: /(if \(window\.emojiParticles\))/, mark: 'emoji-particles', position: 'before' },
  { pattern: /(if \(window\.emojiStreamManager\))/, mark: 'emoji-streams', position: 'before' },
  { pattern: /(if \(window\.emojiSequencer\))/, mark: 'emoji-sequencer', position: 'before' },
  { pattern: /(if \(window\.mandalaController\))/, mark: 'mandala', position: 'before' },
  { pattern: /(updateVessel\(camera\);)/, mark: 'vessel', position: 'before' },
  { pattern: /(updateHumanoid\(morphMesh\.position\);)/, mark: 'humanoid', position: 'before' },
  { pattern: /(updateArchetypeMorph\(deltaTime\);)/, mark: 'archetype-morph', position: 'before' },
  { pattern: /(renderShadowProjection\(\);)/, mark: 'shadow-projection', position: 'before' },
  { pattern: /(if \(window\.fpControls\))/, mark: 'navigation', position: 'before' },
  { pattern: /(if \(window\.perceptionState\))/, mark: 'perception-state', position: 'before' },
  { pattern: /(if \(window\.gameMode\))/, mark: 'game-mode', position: 'before' },
  { pattern: /(if \(window\.destinationAuthoring\))/, mark: 'destination-authoring', position: 'before' },
  { pattern: /(if \(window\.glyphRenderer\))/, mark: 'glyph-renderer', position: 'before' },
  { pattern: /(const shadowBox = getShadowBox\(\);)/, mark: 'shadow-box', position: 'before' },
  { pattern: /(composer\.render\(\);)/, mark: 'compositor-render', position: 'before' },
  { pattern: /(if \(typeof window\.renderShadowLayer === 'function'\))/, mark: 'shadow-layer', position: 'before' },
  { pattern: /(if \(window\.captureTimelineFrame\))/, mark: 'timeline-capture', position: 'before' },
];

let marksAdded = 0;
for (const { pattern, mark, position } of marks) {
  const match = code.match(pattern);
  if (match) {
    const markCall = `    globalProfiler.mark('${mark}');\n`;

    if (position === 'before') {
      code = code.replace(pattern, `${markCall}$1`);
    } else {
      code = code.replace(pattern, `$1\n${markCall}`);
    }

    marksAdded++;
  }
}

console.log(`✓ Added ${marksAdded} profiler marks`);

// Write instrumented version
fs.writeFileSync(geometryPath, code);
console.log(`✓ Wrote instrumented geometry.js`);

console.log('\n═'.repeat(60));
console.log('✅ Instrumentation complete!');
console.log('\nNext steps:');
console.log('  1. Launch the application');
console.log('  2. Open DevTools console (Cmd+Option+I)');
console.log('  3. Run: window.performanceProfiler.enable()');
console.log('  4. Wait 10 seconds for auto-report');
console.log('\nTo remove instrumentation:');
console.log('  node scripts/remove_profiling.js');
