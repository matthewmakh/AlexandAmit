"use client";

import { useId, useMemo, useState } from "react";

export interface Series {
  key: string;
  label: string;
  color: string;
  values: number[];
}

/**
 * A clean area chart with a hover crosshair. Values are drawn on a shared
 * y-scale; the x-axis takes date labels.
 */
export function AreaChart({
  labels,
  series,
  height = 240,
  format = (v: number) => v.toLocaleString(),
  className = "",
}: {
  labels: string[];
  series: Series[];
  height?: number;
  format?: (v: number) => string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);
  const W = 800;
  const H = height;
  const padL = 8;
  const padR = 8;
  const padT = 16;
  const padB = 28;

  const max = useMemo(() => Math.max(1, ...series.flatMap((s) => s.values)) * 1.08, [series]);
  const n = labels.length;
  const x = (i: number) => padL + (i / Math.max(1, n - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v / max) * (H - padT - padB);

  const paths = series.map((s) => {
    const pts = s.values.map((v, i) => [x(i), y(v)] as const);
    const d = pts.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
    const area = `${d} L${x(n - 1).toFixed(1)},${(H - padB).toFixed(1)} L${x(0).toFixed(1)},${(H - padB).toFixed(1)} Z`;
    return { d, area, s };
  });

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({ v: max * t, y: y(max * t) }));
  const labelEvery = Math.max(1, Math.round(n / 6));

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full overflow-visible"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - rect.left) / rect.width) * W;
          const i = Math.round(((px - padL) / (W - padL - padR)) * (n - 1));
          setHover(Math.min(n - 1, Math.max(0, i)));
        }}
      >
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`${id}-${s.key}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={t.y} y2={t.y} stroke="rgba(0,0,0,0.06)" strokeDasharray={i === 0 ? undefined : "2 4"} />
            {i > 0 ? (
              <text x={W - padR} y={t.y - 4} textAnchor="end" fontSize="11" fill="#86868b">
                {format(t.v)}
              </text>
            ) : null}
          </g>
        ))}
        {paths.map(({ area, d, s }) => (
          <g key={s.key}>
            <path d={area} fill={`url(#${id}-${s.key})`} />
            <path d={d} fill="none" stroke={s.color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
          </g>
        ))}
        {labels.map((l, i) =>
          i % labelEvery === 0 || i === n - 1 ? (
            <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fontSize="11" fill="#86868b">
              {l}
            </text>
          ) : null,
        )}
        {hover !== null ? (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={H - padB} stroke="rgba(0,0,0,0.18)" />
            {series.map((s) => (
              <circle key={s.key} cx={x(hover)} cy={y(s.values[hover])} r="4.5" fill="#fff" stroke={s.color} strokeWidth="2.2" />
            ))}
          </g>
        ) : null}
      </svg>
      {hover !== null ? (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-[150px] rounded-2xl bg-ink px-3.5 py-2.5 text-[12px] text-white shadow-lift"
          style={{ left: `calc(${(x(hover) / W) * 100}% + 12px)`, transform: hover > n * 0.7 ? "translateX(calc(-100% - 24px))" : undefined }}
        >
          <div className="mb-1 font-medium text-white/70">{labels[hover]}</div>
          {series.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="tabular font-semibold">{format(s.values[hover])}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
