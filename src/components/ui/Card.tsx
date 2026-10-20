import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className = "", children, tint = false, padded = true, ...rest }: HTMLAttributes<HTMLDivElement> & { tint?: boolean; padded?: boolean; children: ReactNode }) {
  return (
    <div className={`${tint ? "card-tint" : "card"} ${padded ? "p-6 sm:p-7" : ""} ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = "" }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={`mb-5 flex items-start justify-between gap-4 ${className}`}>
      <div>
        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-[13px] text-ink-3">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Eyebrow({ children, className = "", tone = "ink" }: { children: ReactNode; className?: string; tone?: "ink" | "blue" | "white" | "gold" | "lumen" }) {
  const c = { ink: "text-ink-3", blue: "text-blue", white: "text-white/60", gold: "text-gold", lumen: "text-lumen" }[tone];
  return <div className={`text-eyebrow ${c} ${className}`}>{children}</div>;
}

export function SectionTitle({ eyebrow, title, lede, align = "left", dark = false, className = "" }: { eyebrow?: ReactNode; title: ReactNode; lede?: ReactNode; align?: "left" | "center"; dark?: boolean; className?: string }) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow ? <Eyebrow tone={dark ? "white" : "blue"} className="mb-3">{eyebrow}</Eyebrow> : null}
      <h2 className={`text-display-md text-balance ${dark ? "text-white" : "text-ink"}`}>{title}</h2>
      {lede ? <p className={`text-lede mt-4 ${dark ? "text-white/70" : "text-ink-3"}`}>{lede}</p> : null}
    </div>
  );
}
