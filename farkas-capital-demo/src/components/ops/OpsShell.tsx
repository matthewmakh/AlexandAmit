"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FarkasLogo } from "@/components/brand/FarkasMark";
import { Icon } from "@/components/ui/Icon";

const NAV = [
  { href: "/ops", label: "Overview", icon: "grid" as const },
  { href: "/ops/issuers", label: "Issuers", icon: "building" as const },
  { href: "/ops/offerings", label: "Offerings", icon: "doc" as const },
  { href: "/ops/review", label: "Investor review", icon: "shield" as const },
  { href: "/ops/exceptions", label: "Exceptions", icon: "warning" as const },
  { href: "/ops/communications", label: "Communications", icon: "megaphone" as const },
  { href: "/ops/fees", label: "Fees", icon: "cash" as const },
  { href: "/ops/integrations", label: "Integrations", icon: "link" as const },
  { href: "/ops/audit", label: "Audit", icon: "eye" as const },
];

/** Dark shell for the broker-dealer's private console: slim rail, content column. */
export function OpsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-night-2 text-white">
      <aside className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col border-r border-white/[0.08] bg-night-3 px-4 py-6 lg:flex">
        <Link href="/ops" className="px-2">
          <FarkasLogo dark size={30} />
        </Link>
        <div className="mt-2 px-2 text-[11px] uppercase tracking-[0.08em] text-white/35">Operations console</div>
        <nav className="mt-7 flex flex-col gap-0.5">
          {NAV.map((n) => {
            const active = n.href === "/ops" ? pathname === "/ops" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-colors ${active ? "bg-white/[0.1] text-white" : "text-white/60 hover:bg-white/[0.06] hover:text-white"}`}
              >
                <Icon name={n.icon} size={16} className={active ? "text-gold" : ""} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/[0.08] p-3 text-[11.5px] leading-relaxed text-white/45">
          <div className="mb-1 flex items-center gap-1.5 font-semibold text-white/70"><Icon name="lock" size={12} className="text-gold" /> Staff only · MFA enforced</div>
          Company users cannot bypass compliance decisions or edit confirmed ownership.
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.08] bg-night-3/90 px-4 py-3 backdrop-blur lg:hidden">
          <Link href="/ops"><FarkasLogo dark size={26} /></Link>
          <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold">Ops</span>
        </div>
        <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-white/[0.08] px-3 py-2 lg:hidden">
          {NAV.map((n) => {
            const active = n.href === "/ops" ? pathname === "/ops" : pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium ${active ? "bg-white/[0.12] text-white" : "text-white/55"}`}>
                {n.label}
              </Link>
            );
          })}
        </div>
        <main className="mx-auto max-w-6xl px-5 py-8 pb-32 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
