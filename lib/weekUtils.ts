// Week helpers (weeks run Monday–Sunday, using local time). Shared between
// the client hook and the server-side weekly-check route so both agree on
// week boundaries.

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Monday (at local midnight) of the week containing `d`.
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

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Parse a "YYYY-MM-DD" string as a LOCAL date (avoids UTC off-by-one at midnight).
export function parseLocalDate(s: string): Date {
  const [y, m, day] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, day ?? 1);
}
