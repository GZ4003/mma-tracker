// Week helpers. The whole app reasons about days and weeks in ONE fixed
// timezone (Argentina), so "today" and "this week" never depend on the user's
// device timezone or on the server (Vercel runs in UTC). This is what prevents
// an evening training from being recorded on the wrong day/week.
//
// Weeks run Monday–Sunday. Shared between the client hook and the server-side
// cron routes so both agree on day and week boundaries.

export const APP_TIME_ZONE = "America/Argentina/Buenos_Aires";

// "YYYY-MM-DD" for the given instant, as seen in the app's fixed timezone.
// Defaults to right now. (en-CA formats as YYYY-MM-DD.)
export function toISODate(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

// Parse a "YYYY-MM-DD" string into a date-only anchor (midnight) usable for
// weekday/week math. The anchor's calendar date is exactly y/m/d, so weekday
// math on it is timezone-independent.
export function parseLocalDate(s: string): Date {
  const [y, m, day] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, day ?? 1);
}

// Today's calendar date in the app's timezone, as a date-only anchor. Use this
// instead of `new Date()` whenever you need "today" or "this week" for
// comparisons, so results never shift with the device or server timezone.
export function appToday(): Date {
  return parseLocalDate(toISODate());
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Monday (date-only anchor) of the week containing `d`. Pass a date-only anchor
// (from parseLocalDate / appToday), not a raw instant, so the weekday is read
// from the intended calendar date rather than from a timezone-dependent one.
export function getWeekStart(d: Date): Date {
  const s = startOfDay(d);
  const day = s.getDay(); // 0 = Sunday ... 6 = Saturday
  const diff = day === 0 ? -6 : 1 - day;
  s.setDate(s.getDate() + diff);
  return s;
}

export function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}
