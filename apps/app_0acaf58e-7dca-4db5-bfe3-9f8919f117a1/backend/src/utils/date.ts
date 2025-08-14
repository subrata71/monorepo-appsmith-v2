// src/utils/date.ts
// Return the current time as an ISO‑8601 string.
export const isoNow = () => new Date().toISOString();

// Calculate whole‑day distance between two dates (UTC).
export function daysBetween(a: Date, b: Date): number {
  const ms = Math.abs(a.getTime() - b.getTime());
  return Math.round(ms / 86_400_000); // 86 400 000 ms in a day
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Check if an entry can be edited (only today's entries can be edited)
 */
export function canEditEntry(entryDate: string): boolean {
  const today = getTodayDate();
  return entryDate === today;
}

/**
 * Parse a date string (YYYY-MM-DD) to Date object
 */
export function parseEntryDate(entryDate: string): Date {
  return new Date(entryDate + 'T00:00:00.000Z');
}

/**
 * Format a Date object to YYYY-MM-DD string
 */
export function formatEntryDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
