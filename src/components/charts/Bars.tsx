import type { ReactNode } from "react";

/** Horizontal bars with labels and values; used for funnels and breakdowns. */
export function BarRows({
  rows,
  max,
  color = "var(--color-blue)",
  format = (v: number) => v.toLocaleString(),
  className = "",
}: {
  rows: { label: ReactNode; value: number; hint?: ReactNode; color?: string }[];
  max?: number;
  color?: string;
  format?: (v: number) => string;
  className?: string;
}) {
  const m = max ?? Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className={`space-y-3 ${className}`}>
      {rows.map((r, i) => (
        <div key={i}>
          <div className="mb-1.5 flex items-baseline justify-between gap-4 text-[13px]">
            <span className="font-medium text-ink">{r.label}</span>
            <span className="tabular text-ink-3">
              {format(r.value)}
              {r.hint ? <span className="ml-2 text-ink-4">{r.hint}</span> : null}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ink/[0.06]">
            <div className="h-full rounded-full transition-[width] duration-700 ease-[var(--ease-apple)]" style={{ width: `${Math.max(1.5, (r.value / m) * 100)}%`, background: r.color ?? color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Vertical funnel: each step as a column with its drop-off. */
export function Funnel({ steps, format = (v: number) => v.toLocaleString() }: { steps: { label: string; count: number }[]; format?: (v: number) => string }) {
  const max = Math.max(1, ...steps.map((s) => s.count));
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      {steps.map((s, i) => {
        const prev = i === 0 ? s.count : steps[i - 1].count;
        const rate = prev ? s.count / prev : 0;
        const h = Math.max(6, (Math.sqrt(s.count) / Math.sqrt(max)) * 100);
        return (
          <div key={s.label} className="flex flex-col">
            <div className="flex h-40 items-end">
              <div className="w-full rounded-t-2xl rounded-b-md bg-gradient-to-t from-blue to-[#5ea0ff] transition-[height] duration-700 ease-[var(--ease-apple)]" style={{ height: `${h}%` }} />
            </div>
            <div className="mt-3 text-[20px] font-semibold tabular tracking-[-0.02em]">{format(s.count)}</div>
            <div className="text-[12px] leading-snug text-ink-3">{s.label}</div>
            {i > 0 ? (
              <div className={`mt-1 text-[11px] font-medium ${rate < 0.4 ? "text-orange" : "text-ink-4"}`}>{Math.round(rate * 100)}% of prior</div>
            ) : (
              <div className="mt-1 text-[11px] font-medium text-ink-4">baseline</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** A thin segmented progress bar: committed vs cleared vs released. */
export function StackedBar({ segments, total, className = "" }: { segments: { label: string; value: number; color: string }[]; total: number; className?: string }) {
  return (
    <div className={className}>
      <div className="flex h-3 overflow-hidden rounded-full bg-ink/[0.06]">
        {segments.map((s) => (
          <div key={s.label} className="h-full first:rounded-l-full" style={{ width: `${(s.value / total) * 100}%`, background: s.color }} title={s.label} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-ink-3">
        {segments.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Donut({ value, size = 120, stroke = 12, color = "var(--color-blue)", track = "rgba(0,0,0,0.06)", children }: { value: number; size?: number; stroke?: number; color?: string; track?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${c}`} strokeDashoffset={`${c * (1 - Math.min(1, value))}`} className="transition-[stroke-dashoffset] duration-1000 ease-[var(--ease-apple)]" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
