/**
 * The demo runs against a fixed clock so seeded data, "age" badges and pass
 * timestamps are identical on the server and the client, on every reload,
 * and on every demo run. Swap for Date.now() when real providers are wired.
 */
export const DEMO_NOW = "2026-10-20T15:00:00.000Z";

export function nowIso(): string {
  return DEMO_NOW;
}

export function daysAgo(days: number, hour = 10, minute = 0): string {
  const d = new Date(DEMO_NOW);
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function hoursAgo(hours: number): string {
  return new Date(new Date(DEMO_NOW).getTime() - hours * 3_600_000).toISOString();
}

export function minutesAgo(minutes: number): string {
  return new Date(new Date(DEMO_NOW).getTime() - minutes * 60_000).toISOString();
}

export function addDays(iso: string, days: number, hour?: number): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  if (hour !== undefined) d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
}

export function dayKey(iso: string): string {
  return iso.slice(0, 10);
}
