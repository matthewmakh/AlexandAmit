import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

/** A headline number that opens the records behind it. */
export function Tile({ label, value, hint, href, accent, className = "" }: { label: string; value: ReactNode; hint?: ReactNode; href?: string; accent?: string; className?: string }) {
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink-3">{label}</span>
        {href ? <Icon name="chevron-right" size={14} className="text-ink-4 transition-transform group-hover:translate-x-0.5" /> : null}
      </div>
      <div className="mt-2 text-[28px] font-semibold tabular tracking-[-0.02em] leading-none" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
      {hint ? <div className="mt-2 text-[12px] text-ink-4">{hint}</div> : null}
    </>
  );
  const cls = `card group block p-5 transition-shadow hover:shadow-lift ${className}`;
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export function Segmented({ options, value, className = "" }: { options: { label: string; href: string; key: string }[]; value: string; className?: string }) {
  return (
    <div className={`inline-flex rounded-full bg-ink/[0.06] p-0.5 ${className}`}>
      {options.map((o) => (
        <Link key={o.key} href={o.href} className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${o.key === value ? "bg-paper text-ink shadow-[0_1px_2px_rgba(0,0,0,0.1)]" : "text-ink-3 hover:text-ink"}`}>
          {o.label}
        </Link>
      ))}
    </div>
  );
}
