/**
 * Build script: copies docs/site-example/code.html to out/index.html
 * for Azure Static Web Apps deployment (no Next.js, static HTML only).
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'docs', 'site-example', 'code.html');
const outDir = path.join(root, 'out');
const dest = path.join(outDir, 'index.html');

if (!fs.existsSync(src)) {
  console.error('Source not found:', src);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log('Build OK: out/index.html');
