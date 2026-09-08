/**
 * Polyfills required for React Native 0.72 compatibility.
 * This file MUST be imported before any other module.
 */

// Define global.window pointing to global (the standard React Native polyfill environment).
// This must be done at the very beginning to avoid reference errors when modules evaluate.
if (typeof global.window === 'undefined') {
  global.window = global;
}

// Ensure performance.now() exists
if (typeof global.performance === 'undefined') {
  global.performance = {};
}
if (typeof global.performance.now !== 'function') {
  global.performance.now = () => Date.now();
}
