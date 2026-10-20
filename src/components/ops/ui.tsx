import type { ReactNode } from "react";
import type { Tone } from "@/components/ui/Badge";

export function OpsHeader({ eyebrow, title, lede, action }: { eyebrow?: string; title: ReactNode; lede?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        {eyebrow ? <div className="text-eyebrow text-gold">{eyebrow}</div> : null}
        <h1 className="text-display-sm mt-2 text-white">{title}</h1>
        {lede ? <p className="mt-2 max-w-2xl text-[14px] text-white/55">{lede}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function OpsCard({ children, className = "", padded = true }: { children: ReactNode; className?: string; padded?: boolean }) {
  return <div className={`rounded-[24px] border border-white/[0.08] bg-white/[0.04] ${padded ? "p-5 sm:p-6" : ""} ${className}`}>{children}</div>;
}

export function OpsCardTitle({ title, hint, action }: { title: ReactNode; hint?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <div className="text-[15px] font-semibold text-white">{title}</div>
        {hint ? <div className="mt-0.5 text-[12.5px] text-white/45">{hint}</div> : null}
      </div>
      {action}
    </div>
  );
}

export function OpsStat({ label, value, hint, tone = "neutral" }: { label: string; value: ReactNode; hint?: ReactNode; tone?: "neutral" | "gold" | "red" | "green" }) {
  const c = { neutral: "text-white", gold: "text-gold", red: "text-[#ff6b61]", green: "text-[#5ad67d]" }[tone];
  return (
    <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.04] p-4">
      <div className="text-[12px] text-white/45">{label}</div>
      <div className={`mt-1 text-[24px] font-semibold tabular tracking-[-0.02em] ${c}`}>{value}</div>
      {hint ? <div className="mt-0.5 text-[12px] text-white/40">{hint}</div> : null}
    </div>
  );
}

const darkTones: Record<Tone, string> = {
  neutral: "bg-white/[0.08] text-white/70",
  blue: "bg-[#2b5cff]/20 text-[#8db0ff]",
  green: "bg-[#34c759]/15 text-[#5ad67d]",
  orange: "bg-[#ff9f0a]/15 text-[#ffb547]",
  red: "bg-[#ff3b30]/15 text-[#ff6b61]",
  purple: "bg-[#af52de]/15 text-[#c98ae6]",
  teal: "bg-[#30b0c7]/15 text-[#5ec9db]",
  gold: "bg-gold/15 text-gold",
  dark: "bg-white text-ink",
};

export function DarkBadge({ tone = "neutral", children, dot = false }: { tone?: Tone; children: ReactNode; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium leading-none ${darkTones[tone]}`}>
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

export function OpsTable({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="no-scrollbar overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-[13.5px]">
        <thead>
          <tr className="text-[11px] uppercase tracking-[0.06em] text-white/40">
            {head.map((h, i) => (
              <th key={i} className="pb-3 pr-4 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.07]">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className = "", muted = false }: { children: ReactNode; className?: string; muted?: boolean }) {
  return <td className={`py-3 pr-4 align-top ${muted ? "text-white/50" : "text-white/85"} ${className}`}>{children}</td>;
}

/** Visual-only action button for the console. */
export function OpsButton({ children, tone = "ghost", className = "" }: { children: ReactNode; tone?: "gold" | "ghost" | "red" | "white"; className?: string }) {
  const c = {
    gold: "bg-gold text-ink hover:brightness-105",
    ghost: "bg-white/[0.08] text-white hover:bg-white/[0.14]",
    red: "bg-[#ff3b30]/20 text-[#ff8a82] hover:bg-[#ff3b30]/30",
    white: "bg-white text-ink hover:bg-canvas",
  }[tone];
  return (
    <button type="button" className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition-colors ${c} ${className}`}>
      {children}
    </button>
  );
}
