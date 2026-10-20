import { DEMO_NOW } from "./clock";

const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const usd2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const num0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const num2 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function money(n: number, cents = false): string {
  return cents ? usd2.format(n) : usd0.format(n);
}

/** Compact money for tiles: $5.4M, $820K, $12,500 */
export function moneyCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `$${trim((n / 1_000_000).toFixed(abs >= 10_000_000 ? 1 : 2))}M`;
  if (abs >= 10_000) return `$${trim((n / 1_000).toFixed(0))}K`;
  return usd0.format(n);
}

function trim(s: string): string {
  return s.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

export function number(n: number, decimals: 0 | 2 = 0): string {
  return decimals === 2 ? num2.format(n) : num0.format(n);
}

export function pct(n: number, decimals = 0): string {
  return `${(n * 100).toFixed(decimals)}%`;
}

export function shares(n: number): string {
  return `${num0.format(n)} ${n === 1 ? "share" : "shares"}`;
}

export function date(iso: string, style: "short" | "long" | "medium" = "medium"): string {
  const d = new Date(iso);
  if (style === "short") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  }
  if (style === "long") {
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function dateTime(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) +
    ", " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }) +
    " UTC"
  );
}

/** Relative to the demo clock so server and client agree. */
export function ago(iso: string, now: string = DEMO_NOW): string {
  const ms = new Date(now).getTime() - new Date(iso).getTime();
  const m = Math.round(ms / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.round(d / 30);
  return `${mo}mo ago`;
}

export function ageDays(iso: string, now: string = DEMO_NOW): number {
  return Math.max(0, Math.floor((new Date(now).getTime() - new Date(iso).getTime()) / 86_400_000));
}

export function initials(first: string, last: string): string {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  return `${user.slice(0, 2)}•••@${domain}`;
}
