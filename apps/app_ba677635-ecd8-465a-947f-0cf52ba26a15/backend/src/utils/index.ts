// ──────────────────────────────────────────────────────────────
// src/utils/index.ts
// Re‑export any helper you want app‑wide.  Never export test‑only
// helpers from here (keep those under tests/helpers/).
// ──────────────────────────────────────────────────────────────

export { log } from './logger.js';
export * from './date.js'; // isoNow, daysBetween, etc.
export * from './string.js'; // add more as you create them
