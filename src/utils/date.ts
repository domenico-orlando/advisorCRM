/**
 * Local-date helpers. Dates are passed around as `YYYY-MM-DD` strings and
 * times as 24-hour `HH:MM` strings, so nothing depends on a timezone offset:
 * every Date built here uses the local-midnight constructor.
 */

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DOW_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function toIso(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function fromIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayIso(): string {
  return toIso(new Date());
}

export function addDays(iso: string, n: number): string {
  const d = fromIso(iso);
  d.setDate(d.getDate() + n);
  return toIso(d);
}

export function addMonths(iso: string, n: number): string {
  const d = fromIso(iso);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  // Clamp to the last day of the target month (31 Jan + 1 month → 28/29 Feb).
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, lastDay));
  return toIso(d);
}

/** Monday of the week containing `iso`. */
export function startOfWeek(iso: string): string {
  const d = fromIso(iso);
  const shift = (d.getDay() + 6) % 7; // Monday = 0
  return addDays(iso, -shift);
}

export function startOfMonth(iso: string): string {
  const d = fromIso(iso);
  return toIso(new Date(d.getFullYear(), d.getMonth(), 1));
}

export function daysBetween(from: string, to: string): number {
  const ms = fromIso(to).getTime() - fromIso(from).getTime();
  return Math.round(ms / 86400000);
}

export function isToday(iso: string): boolean {
  return iso === todayIso();
}

export function isWeekend(iso: string): boolean {
  const day = fromIso(iso).getDay();
  return day === 0 || day === 6;
}

export function isSameMonth(iso: string, other: string): boolean {
  return iso.slice(0, 7) === other.slice(0, 7);
}

export function dowShort(iso: string): string {
  return DOW_SHORT[fromIso(iso).getDay()];
}

export function dowLong(iso: string): string {
  return DOW_LONG[fromIso(iso).getDay()];
}

export function dayNum(iso: string): string {
  return String(fromIso(iso).getDate());
}

/** "12 Sep" */
export function shortDate(iso: string): string {
  const d = fromIso(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** "12 Sep 2026" */
export function mediumDate(iso: string): string {
  return `${shortDate(iso)} ${fromIso(iso).getFullYear()}`;
}

/** "Saturday, 12 September 2026" */
export function longDate(iso: string): string {
  const d = fromIso(iso);
  return `${DOW_LONG[d.getDay()]}, ${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

/** "September 2026" */
export function monthLabel(iso: string): string {
  const d = fromIso(iso);
  return `${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Week of 7 September 2026" */
export function weekLabel(iso: string): string {
  const start = fromIso(startOfWeek(iso));
  return `Week of ${start.getDate()} ${MONTHS_LONG[start.getMonth()]} ${start.getFullYear()}`;
}

/** Relative wording for task due dates: "Today", "Tomorrow", "12 Sep". */
export function dueLabel(iso: string): string {
  const delta = daysBetween(todayIso(), iso);
  if (delta === 0) return "Today";
  if (delta === 1) return "Tomorrow";
  if (delta === -1) return "Yesterday";
  return shortDate(iso);
}

/** Six Monday-first weeks covering the month containing `iso`. */
export function monthGrid(iso: string): string[][] {
  const first = startOfWeek(startOfMonth(iso));
  const weeks: string[][] = [];
  for (let w = 0; w < 6; w += 1) {
    const week: string[] = [];
    for (let d = 0; d < 7; d += 1) week.push(addDays(first, w * 7 + d));
    weeks.push(week);
  }
  return weeks;
}

/** "09:00" → "9:00" for display; times are stored 24-hour so they sort. */
export function displayTime(hhmm: string): string {
  const [h, m] = hhmm.split(":");
  return `${Number(h)}:${m}`;
}

export function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** "09:00" + 45 → "09:45", for the end time shown in confirmation emails. */
export function addMinutes(hhmm: string, minutes: number): string {
  const total = timeToMinutes(hhmm) + minutes;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
