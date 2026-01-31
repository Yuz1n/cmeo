// src/lib/polyfill.ts
import * as path from 'path';

if (typeof global !== 'undefined' && !(global as any).__dirname) {
  (global as any).__dirname = process.cwd();
}

if (typeof global !== 'undefined' && !(global as any).__filename) {
  (global as any).__filename = path.join(process.cwd(), 'index.js');
}

export {}; // Torna o arquivo um módulo