// Date/time helpers mirroring the Angular DatePipe transforms used across the app.

export function fmtMMDDYYYY(d: Date | string): string {
  const dt = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(dt.getTime())) return typeof d === 'string' ? d : '';
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${mm}-${dd}-${dt.getFullYear()}`;
}

export function todayMMDDYYYY(): string {
  return fmtMMDDYYYY(new Date());
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// Local-date YYYY-MM-DD (avoids the UTC shift of Date.toISOString()).
export function fmtISODate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Parse an appointment date + time into a local Date, tolerant of BOTH stored
// formats: ISO "yyyy-mm-dd" and "MM-DD-YYYY" (and "/" separators). Returns an
// Invalid Date only if truly unparseable. `new Date("06-05-2026T..")` fails, so
// we split manually.
export function parseApptDateTime(dateStr: string, timeStr?: string): Date {
  if (!dateStr) return new Date(NaN);
  const [h = 0, mi = 0, s = 0] = String(timeStr || '00:00:00')
    .split(':')
    .map((n) => Number(n) || 0);
  const sep = dateStr.includes('/') ? '/' : '-';
  const parts = dateStr.split(sep).map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return new Date(NaN);
  }
  let y: number, mo: number, d: number;
  if (parts[0] > 31) {
    [y, mo, d] = parts; // yyyy-mm-dd
  } else {
    [mo, d, y] = parts; // mm-dd-yyyy
  }
  if (!y || !mo || !d) return new Date(NaN);
  return new Date(y, mo - 1, d, h, mi, s);
}

// Current time HH:mm:ss in a given timezone (matches DatePipe 'HH:mm:ss' on a tz-localized date)
export function nowTimeInZone(timeZone?: string): string {
  const date = timeZone
    ? new Date(new Date().toLocaleString('en-US', { timeZone }))
    : new Date();
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

// Derive the calendar's visible hour window from a doctor's check-in / check-out
// time strings ("HH:mm:ss" or "HH:mm"). The start hour is floored and the end
// hour ceiled so an appointment at e.g. 17:30 stays visible. Falls back to the
// given defaults when a time is missing/unparseable (e.g. legacy doctors that
// predate the check-in/out columns). Guarantees end > start.
export function calendarHourRange(
  checkIn?: string | null,
  checkOut?: string | null,
  fallbackStart = 7,
  fallbackEnd = 20,
): { startHour: number; endHour: number } {
  const toHour = (t?: string | null): number | null => {
    if (!t) return null;
    const m = /^(\d{1,2}):(\d{2})/.exec(String(t));
    if (!m) return null;
    return Number(m[1]) + Number(m[2]) / 60;
  };
  const ci = toHour(checkIn);
  const co = toHour(checkOut);
  let startHour = ci != null ? Math.floor(ci) : fallbackStart;
  let endHour = co != null ? Math.ceil(co) : fallbackEnd;
  startHour = Math.max(0, Math.min(23, startHour));
  endHour = Math.max(0, Math.min(23, endHour));
  if (endHour <= startHour) endHour = Math.min(23, startHour + 1);
  return { startHour, endHour };
}

export function parseDuration(duration: string) {
  const [hours, minutes, seconds] = (duration || '0:0:0')
    .split(':')
    .map(Number);
  return { hours: hours || 0, minutes: minutes || 0, seconds: seconds || 0 };
}

export function addDurations(d1: string, d2: string): string {
  const a = parseDuration(d1);
  const b = parseDuration(d2);
  let seconds = a.seconds + b.seconds;
  let minutes = a.minutes + b.minutes + Math.floor(seconds / 60);
  let hours = a.hours + b.hours + Math.floor(minutes / 60);
  seconds %= 60;
  minutes %= 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0',
  )}:${String(seconds).padStart(2, '0')}`;
}
