import type { ReactNode } from "react";

/* Small SVG vocabulary shared by the diagrams: boxes, labels, arrows. */

export const INK = "#1d1d1f";
export const INK3 = "#6e6e73";
export const LINE = "#d2d2d7";
export const BLUE = "#0071e3";
export const LUMEN = "#2B5CFF";
export const GOLD = "#C9A227";
export const GREEN = "#34c759";
export const ORANGE = "#ff9f0a";
export const RED = "#ff3b30";

export function Defs() {
  return (
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill={INK3} />
      </marker>
      <marker id="arrow-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill={BLUE} />
      </marker>
      <marker id="arrow-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill={RED} />
      </marker>
      <marker id="arrow-gold" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill={GOLD} />
      </marker>
      <filter id="soft" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.08" />
      </filter>
    </defs>
  );
}

export function Box({ x, y, w, h, title, sub, accent = BLUE, fill = "#fff", stroke = LINE, children, titleSize = 14, dark = false }: { x: number; y: number; w: number; h: number; title: string; sub?: string | string[]; accent?: string; fill?: string; stroke?: string; children?: ReactNode; titleSize?: number; dark?: boolean }) {
  const subs = Array.isArray(sub) ? sub : sub ? [sub] : [];
  const fg = dark ? "#fff" : INK;
  const fg3 = dark ? "rgba(255,255,255,0.65)" : INK3;
  return (
    <g filter="url(#soft)">
      <rect x={x} y={y} width={w} height={h} rx="14" fill={fill} stroke={stroke} />
      <rect x={x} y={y + 10} width="4" height={h - 20} rx="2" fill={accent} />
      <text x={x + 16} y={y + 24} fontSize={titleSize} fontWeight="600" fill={fg} fontFamily="var(--font-sans)">
        {title}
      </text>
      {subs.map((s, i) => (
        <text key={i} x={x + 16} y={y + 44 + i * 16} fontSize="11.5" fill={fg3} fontFamily="var(--font-sans)">
          {s}
        </text>
      ))}
      {children}
    </g>
  );
}

export function Arrow({ d, color = INK3, dashed = false, label, lx, ly, marker = "arrow", width = 1.6 }: { d: string; color?: string; dashed?: boolean; label?: string; lx?: number; ly?: number; marker?: "arrow" | "arrow-blue" | "arrow-red" | "arrow-gold"; width?: number }) {
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dashed ? "5 5" : undefined} markerEnd={`url(#${marker})`} />
      {label && lx !== undefined && ly !== undefined ? (
        <g>
          <rect x={lx - label.length * 3.2 - 6} y={ly - 10} width={label.length * 6.4 + 12} height="18" rx="9" fill="#fff" stroke={LINE} />
          <text x={lx} y={ly + 3} fontSize="10.5" fill={INK3} textAnchor="middle" fontFamily="var(--font-sans)">
            {label}
          </text>
        </g>
      ) : null}
    </g>
  );
}

export function Lane({ x, y, w, h, label, color = "#f5f5f7" }: { x: number; y: number; w: number; h: number; label: string; color?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="20" fill={color} />
      <text x={x + 18} y={y + 24} fontSize="11" fontWeight="600" letterSpacing="0.08em" fill={INK3} fontFamily="var(--font-sans)">
        {label.toUpperCase()}
      </text>
    </g>
  );
}

export function Frame({ viewBox, children, className = "", label }: { viewBox: string; children: ReactNode; className?: string; label: string }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className={`h-auto w-full ${className}`} style={{ fontFamily: "var(--font-sans)" }}>
      <Defs />
      {children}
    </svg>
  );
}
