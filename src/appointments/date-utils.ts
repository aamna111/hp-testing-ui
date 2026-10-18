export const pad = (n: number) => String(n).padStart(2, "0");

export const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromKey = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);

/** Weeks start on Monday. */
export const startOfWeek = (d: Date) => addDays(d, -((d.getDay() + 6) % 7));

export const isSameDay = (a: Date, b: Date) => toKey(a) === toKey(b);

/** Every day shown in a month grid, padded out to whole Mon-Sun weeks. */
export function monthGrid(d: Date): Date[] {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const start = startOfWeek(first);
  const end = addDays(startOfWeek(last), 6);
  const days: Date[] = [];
  for (let c = start; c <= end; c = addDays(c, 1)) days.push(c);
  return days;
}

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function ordinal(n: number) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

export const longDay = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "long" });

/** "14:30" -> "2:30 PM" */
export function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
}

export function endTime(t: string, durationMin: number) {
  const [h, m] = t.split(":").map(Number);
  const total = h * 60 + m + durationMin;
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`;
}
