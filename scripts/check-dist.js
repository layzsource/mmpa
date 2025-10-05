#!/usr/bin/env node
// Phase 13.31: Check if dist is stale

const fs = require('fs');
const path = require('path');

const distIndex = path.join(__dirname, '..', 'dist', 'index.html');

// Check if dist/index.html exists
if (!fs.existsSync(distIndex)) {
  console.error('❌ dist/index.html not found');
  process.exit(1);
}

const distMtime = fs.statSync(distIndex).mtimeMs;

// Check all src files
const srcDir = path.join(__dirname, '..', 'src');
const indexHtml = path.join(__dirname, '..', 'index.html');

function getAllFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (entry.isFile() && /\.(js|html|css)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const srcFiles = getAllFiles(srcDir);
if (fs.existsSync(indexHtml)) {
  srcFiles.push(indexHtml);
}

// Check if any src file is newer than dist
for (const file of srcFiles) {
  const srcMtime = fs.statSync(file).mtimeMs;
  if (srcMtime > distMtime) {
    console.error(`❌ ${path.relative(process.cwd(), file)} is newer than dist/index.html`);
    process.exit(1);
  }
}

console.log('✅ dist is up to date');
process.exit(0);
