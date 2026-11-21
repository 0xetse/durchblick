/**
 * Strict calendar dates (YYYY-MM-DD). The content schema only checks the
 * format; this also rejects impossible dates such as 2026-02-30 or 29 February
 * outside leap years. Only UTC methods are used, so the local time zone plays
 * no role. setUTCFullYear instead of Date.UTC, because Date.UTC maps the years
 * 0–99 to 1900–1999.
 */
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

/** The parts of a real calendar date, or null. */
export function parseCalendarDate(value: unknown): CalendarDate | null {
  if (typeof value !== 'string') return null;
  const m = ISO_DATE.exec(value);
  if (!m) return null;
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return { year, month, day };
}

export function isCalendarDate(value: unknown): value is string {
  return parseCalendarDate(value) !== null;
}
