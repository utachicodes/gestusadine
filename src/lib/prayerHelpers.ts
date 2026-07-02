/** Strip anything after/including a space in an API time string ("05:19 (GMT)" → "05:19") */
export function stripTimeSuffix(raw: string): string {
  return raw.slice(0, 5);
}

/** Parse "HH:MM" into total minutes from midnight */
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Add `delta` minutes to an "HH:MM" string; wraps at 24h */
export function addMinutes(hhmm: string, delta: number): string {
  const total = (toMinutes(hhmm) + delta + 1440) % 1440;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Format "HH:MM" (24h) → "h:mm AM/PM" */
export function to12h(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr;
  const suffix = h < 12 ? "AM" : "PM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${suffix}`;
}
