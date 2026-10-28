import { build } from 'esbuild';
import fs from 'node:fs';
await build({ entryPoints: ['src/main.js'], bundle: true, minify: true, format: 'iife', target: 'es2020', outfile: 'js/app.js', legalComments: 'none' });
const b64 = fs.readFileSync('assets/teko.glb').toString('base64');
fs.writeFileSync('js/teko-model.js', 'window.__TEKO_GLB__="' + b64 + '";');
console.log('built', (fs.statSync('js/app.js').size / 1024).toFixed(0) + 'KB app,', (b64.length / 1048576).toFixed(1) + 'MB embedded model');
