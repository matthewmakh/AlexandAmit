import type { ReactNode } from "react";

export function Table({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[640px] border-collapse text-[14px]">{children}</table>
    </div>
  );
}

export function Th({ children, align = "left", className = "" }: { children?: ReactNode; align?: "left" | "right" | "center"; className?: string }) {
  return (
    <th className={`whitespace-nowrap border-b border-line-2 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-4 first:pl-0 last:pr-0 text-${align} ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, align = "left", className = "", mono = false }: { children?: ReactNode; align?: "left" | "right" | "center"; className?: string; mono?: boolean }) {
  return <td className={`border-b border-line-2 px-3 py-3 align-middle first:pl-0 last:pr-0 text-${align} ${mono ? "tabular" : ""} ${className}`}>{children}</td>;
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-[20px] border border-dashed border-line px-6 py-10 text-center">
      <div className="text-[15px] font-medium">{title}</div>
      {hint ? <div className="mt-1 text-[13px] text-ink-4">{hint}</div> : null}
    </div>
  );
}
