import Link from "next/link";
import type { ReactNode } from "react";
import { LumenLogo } from "@/components/brand/LumenMark";
import { Avatar } from "@/components/ui/Avatar";
import { DashPillNav, DashSidebarNav } from "./DashNav";
import { Icon } from "@/components/ui/Icon";

/** Dashboard shell: fixed sidebar on desktop, top bar with pill nav on mobile. */
export function DashShell({ children, eyebrow = "Issuer dashboard" }: { children: ReactNode; eyebrow?: string }) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-line-2 bg-canvas-2/60 px-4 py-5 backdrop-blur lg:flex">
        <Link href="/issuer" className="flex items-center gap-2.5 px-2">
          <LumenLogo size={28} />
        </Link>
        <div className="mt-1 px-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-4">{eyebrow}</div>
        <div className="mt-7 flex-1 overflow-y-auto">
          <DashSidebarNav />
        </div>
        <div className="mt-6 border-t border-line-2 pt-4">
          <Link href="/issuer/settings" className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-ink/[0.05]">
            <Avatar first="Avery" last="Lindqvist" size={34} />
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold">Avery Lindqvist</div>
              <div className="truncate text-[11px] text-ink-4">Company admin · MFA on</div>
            </div>
          </Link>
          <Link href="/lumen" className="mt-1 flex items-center gap-2 px-3 py-1.5 text-[12px] text-ink-4 hover:text-ink">
            <Icon name="arrow-up-right" size={13} /> lumenrobotics.com
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 border-b border-line-2 bg-canvas/85 px-4 pb-2 pt-3 backdrop-blur lg:hidden">
        <div className="mb-2 flex items-center justify-between">
          <LumenLogo size={24} />
          <Avatar first="Avery" last="Lindqvist" size={30} />
        </div>
        <DashPillNav />
      </div>

      <main className="lg:pl-[248px]">
        <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10 pb-28">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions, eyebrow }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <div className="text-eyebrow mb-2 text-ink-4">{eyebrow}</div> : null}
        <h1 className="text-display-md">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-[15px] text-ink-3">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
