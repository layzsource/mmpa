#!/usr/bin/env node

/**
 * Automated Potential Memory Leak Finder
 *
 * Scans codebase for common memory leak patterns:
 * - Unbounded arrays (push without limits)
 * - Event listeners without cleanup
 * - Three.js resources without disposal
 * - Large allocations without cleanup
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../src');

console.log('🔍 Scanning for Potential Memory Leaks');
console.log('═'.repeat(70));

// Recursively get all .js files
function getAllJsFiles(dir) {
  const files = [];

  function scan(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.name.endsWith('.js') && !entry.name.endsWith('.backup')) {
        files.push(fullPath);
      }
    }
  }

  scan(dir);
  return files;
}

const files = getAllJsFiles(srcDir);
console.log(`\nScanning ${files.length} JavaScript files...\n`);

// === Pattern 1: Unbounded Arrays ===
console.log('📊 Pattern 1: Unbounded Arrays');
console.log('─'.repeat(70));

const unboundedArrays = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for .push( without nearby .shift(), .slice(), or length check
    if (line.includes('.push(')) {
      // Check surrounding context (±5 lines)
      const contextStart = Math.max(0, i - 5);
      const contextEnd = Math.min(lines.length, i + 5);
      const context = lines.slice(contextStart, contextEnd).join('\n');

      // If no cleanup patterns nearby, flag it
      if (!context.match(/\.shift\(|\.splice\(|\.slice\(|\.pop\(|\.length\s*>/)) {
        unboundedArrays.push({
          file: path.relative(srcDir, file),
          line: i + 1,
          code: line.trim()
        });
      }
    }
  }
}

if (unboundedArrays.length > 0) {
  console.log(`\x1b[33mFound ${unboundedArrays.length} potential unbounded arrays:\x1b[0m\n`);

  for (const item of unboundedArrays.slice(0, 15)) {
    console.log(`  ${item.file}:${item.line}`);
    console.log(`    ${item.code}`);
  }

  if (unboundedArrays.length > 15) {
    console.log(`\n  ... and ${unboundedArrays.length - 15} more`);
  }
} else {
  console.log('\x1b[32m✓ No obvious unbounded arrays found\x1b[0m');
}

// === Pattern 2: Event Listener Leaks ===
console.log('\n\n📡 Pattern 2: Event Listener Leaks');
console.log('─'.repeat(70));

const addListenerCalls = [];
const removeListenerCalls = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('addEventListener')) {
      // Extract event type
      const match = line.match(/addEventListener\s*\(\s*['"](\w+)['"]/);
      const eventType = match ? match[1] : 'unknown';

      addListenerCalls.push({
        file: path.relative(srcDir, file),
        line: i + 1,
        event: eventType,
        code: line.trim()
      });
    }

    if (line.includes('removeEventListener')) {
      const match = line.match(/removeEventListener\s*\(\s*['"](\w+)['"]/);
      const eventType = match ? match[1] : 'unknown';

      removeListenerCalls.push({
        file: path.relative(srcDir, file),
        line: i + 1,
        event: eventType
      });
    }
  }
}

console.log(`Found ${addListenerCalls.length} addEventListener calls`);
console.log(`Found ${removeListenerCalls.length} removeEventListener calls`);

// Check if adds >> removes
if (addListenerCalls.length > removeListenerCalls.length * 2) {
  console.log(`\n\x1b[33m⚠️  WARNING: ${addListenerCalls.length - removeListenerCalls.length} more adds than removes!\x1b[0m`);
  console.log('This suggests potential listener leaks.\n');

  // Show some examples
  console.log('Examples of addEventListener without matching removeEventListener:\n');
  for (const add of addListenerCalls.slice(0, 10)) {
    console.log(`  ${add.file}:${add.line} - ${add.event}`);
    console.log(`    ${add.code}`);
  }
} else {
  console.log(`\x1b[32m✓ Listener adds/removes ratio looks reasonable\x1b[0m`);
}

// === Pattern 3: Three.js Resources ===
console.log('\n\n🎨 Pattern 3: Three.js Resources Without Disposal');
console.log('─'.repeat(70));

const threeAllocations = [];
const disposeCallsCount = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for Three.js allocations
    if (line.match(/new THREE\.(BufferGeometry|Geometry|Texture|Material|Mesh)/)) {
      const match = line.match(/new THREE\.(\w+)/);
      const type = match ? match[1] : 'unknown';

      // Check if there's a corresponding .dispose() in the file
      const hasDispose = content.includes('.dispose()');

      if (!hasDispose) {
        threeAllocations.push({
          file: path.relative(srcDir, file),
          line: i + 1,
          type,
          code: line.trim()
        });
      }
    }
  }
}

if (threeAllocations.length > 0) {
  console.log(`\x1b[33mFound ${threeAllocations.length} Three.js allocations in files without .dispose():\x1b[0m\n`);

  // Group by file
  const byFile = {};
  for (const item of threeAllocations) {
    if (!byFile[item.file]) byFile[item.file] = [];
    byFile[item.file].push(item);
  }

  for (const [file, items] of Object.entries(byFile).slice(0, 10)) {
    console.log(`  ${file} - ${items.length} allocations without disposal`);
    console.log(`    Example: ${items[0].code}`);
  }
} else {
  console.log('\x1b[32m✓ All Three.js files appear to have dispose calls\x1b[0m');
}

// === Pattern 4: Large Array/Set/Map Allocations ===
console.log('\n\n💾 Pattern 4: Large Collection Allocations');
console.log('─'.repeat(70));

const largeAllocations = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for large allocations
    if (line.match(/new (Array|Set|Map)\s*\(/)) {
      // Check if it's in a loop (potential issue)
      const contextStart = Math.max(0, i - 3);
      const context = lines.slice(contextStart, i + 1).join('\n');

      const inLoop = context.match(/for\s*\(|while\s*\(|\.forEach\(|\.map\(/);

      if (inLoop) {
        largeAllocations.push({
          file: path.relative(srcDir, file),
          line: i + 1,
          code: line.trim(),
          warning: 'Allocation inside loop'
        });
      }
    }

    // Check for large array literals
    if (line.match(/=\s*\[\s*\]/)) {
      // Check if it looks like it might grow unboundedly
      const varName = line.match(/(\w+)\s*=\s*\[\]/)?.[1];
      if (varName) {
        // Search file for .push on this variable
        const pushPattern = new RegExp(`${varName}\\.push\\(`);
        if (content.match(pushPattern)) {
          largeAllocations.push({
            file: path.relative(srcDir, file),
            line: i + 1,
            code: line.trim(),
            warning: 'Array that gets .push() calls'
          });
        }
      }
    }
  }
}

if (largeAllocations.length > 0) {
  console.log(`\x1b[33mFound ${largeAllocations.length} potentially problematic allocations:\x1b[0m\n`);

  for (const item of largeAllocations.slice(0, 10)) {
    console.log(`  ${item.file}:${item.line}`);
    console.log(`    ${item.code}`);
    console.log(`    ⚠️  ${item.warning}`);
  }

  if (largeAllocations.length > 10) {
    console.log(`\n  ... and ${largeAllocations.length - 10} more`);
  }
} else {
  console.log('\x1b[32m✓ No obvious problematic allocations found\x1b[0m');
}

// === Summary ===
console.log('\n\n═'.repeat(70));
console.log('📊 SUMMARY');
console.log('═'.repeat(70));

const issues = [];

if (unboundedArrays.length > 0) {
  issues.push({
    severity: 'MEDIUM',
    count: unboundedArrays.length,
    description: 'Potential unbounded arrays'
  });
}

if (addListenerCalls.length > removeListenerCalls.length * 2) {
  issues.push({
    severity: 'HIGH',
    count: addListenerCalls.length - removeListenerCalls.length,
    description: 'Event listeners without cleanup'
  });
}

if (threeAllocations.length > 0) {
  issues.push({
    severity: 'HIGH',
    count: threeAllocations.length,
    description: 'Three.js resources without disposal'
  });
}

if (largeAllocations.length > 0) {
  issues.push({
    severity: 'LOW',
    count: largeAllocations.length,
    description: 'Potentially problematic allocations'
  });
}

if (issues.length === 0) {
  console.log('\n✅ \x1b[32mNo obvious memory leak patterns detected!\x1b[0m\n');
  console.log('However, runtime profiling is still recommended to confirm.');
} else {
  console.log('\n⚠️  Potential Issues Found:\n');

  for (const issue of issues) {
    const color = issue.severity === 'HIGH' ? '\x1b[31m' :
                  issue.severity === 'MEDIUM' ? '\x1b[33m' : '\x1b[36m';

    console.log(`${color}${issue.severity.padEnd(6)}\x1b[0m │ ${issue.count.toString().padStart(3)} ${issue.description}`);
  }

  console.log('\n💡 Recommendations:');
  console.log('   1. Review flagged code locations');
  console.log('   2. Run runtime memory profiler: window.memoryLeakDetector.start()');
  console.log('   3. Use Chrome DevTools heap snapshots for confirmation');
  console.log('   4. Add bounds/limits to growing arrays');
  console.log('   5. Ensure addEventListener has matching removeEventListener');
  console.log('   6. Call .dispose() on Three.js resources\n');
}

console.log('═'.repeat(70));
