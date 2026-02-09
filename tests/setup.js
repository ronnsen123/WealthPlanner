// tests/setup.js — Load global-scope scripts into the jsdom test environment
import { readFileSync } from 'fs';
import { resolve } from 'path';
import vm from 'vm';

const ROOT = resolve(import.meta.dirname, '..');

// Order matters: data → compute → helpers → render → goals (same as index.html)
const scripts = [
  'portfolio-data.js',
  'portfolio-compute.js',
  'render-helpers.js',
  'portfolio-render.js',
  'goals.js',
];

// In a browser, <script> tags execute in the global scope where `const`, `function`,
// and `var` all create global names. In Node/Vitest, we need to replicate this.
// We wrap each file's code to explicitly assign all declarations to globalThis.
for (const file of scripts) {
  let code = readFileSync(resolve(ROOT, file), 'utf-8');

  // Replace top-level `const ` and `let ` with `var ` so they become
  // properties of globalThis when evaluated via vm.runInThisContext
  // Only replace at the start of a line (top-level declarations)
  code = code.replace(/^(const|let) /gm, 'var ');

  // Also handle top-level `function name(` — these already work with runInThisContext

  const script = new vm.Script(code, { filename: file });
  script.runInThisContext();
}
