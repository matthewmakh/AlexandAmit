"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/Icon";

const SURFACES = [
  { href: "/", label: "Pitch", icon: "sparkle" as const },
  { href: "/lumen", label: "Company site", icon: "building" as const },
  { href: "/lumen/invest", label: "Invest", icon: "cash" as const },
  { href: "/wallet/pass_jordan_1", label: "Wallet pass", icon: "wallet" as const },
  { href: "/lumen/investors", label: "Investor dashboard", icon: "users" as const },
  { href: "/issuer", label: "Issuer dashboard", icon: "chart" as const },
  { href: "/ops", label: "Farkas ops", icon: "shield" as const },
  { href: "/build-plan", label: "Build plan", icon: "doc" as const },
];

const HIDDEN_KEY = "fc-dock-hidden";
const HIDDEN_EVENT = "fc-dock-hidden-change";

function readHidden(): boolean {
  try {
    return window.localStorage.getItem(HIDDEN_KEY) === "1";
  } catch {
    return false;
  }
}

function subscribeHidden(cb: () => void): () => void {
  window.addEventListener(HIDDEN_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(HIDDEN_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/**
 * A small floating switcher for walking a room through the demo. Collapses
 * to a single pill; hidden on print.
 */
export function DemoDock() {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (fn: (v: boolean) => boolean) => setOpenOn(fn(open) ? pathname : null);
  const hidden = useSyncExternalStore(subscribeHidden, readHidden, () => false);

  if (hidden) return null;
  const current = [...SURFACES].sort((a, b) => b.href.length - a.href.length).find((s) => (s.href === "/" ? pathname === "/" : pathname === s.href || pathname.startsWith(s.href + "/")));

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-3 print:hidden">
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        {open ? (
          <div className="glass-dark w-[min(92vw,540px)] rounded-[24px] p-2 text-white shadow-float">
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
              {SURFACES.map((s) => {
                const active = current?.href === s.href;
                return (
                  <Link
                    key={s.href}
                    href={s.href}
                    className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 text-[13px] font-medium transition-colors ${active ? "bg-white/15" : "hover:bg-white/10 text-white/80"}`}
                  >
                    <Icon name={s.icon} size={16} />
                    {s.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-1 flex items-center justify-between px-3 pb-1 pt-2 text-[11px] text-white/50">
              <span>Demo navigator · every surface in one place</span>
              <button
                className="hover:text-white"
                onClick={() => {
                  try {
                    window.localStorage.setItem(HIDDEN_KEY, "1");
                  } catch {}
                  window.dispatchEvent(new Event(HIDDEN_EVENT));
                }}
              >
                Hide for this browser
              </button>
            </div>
          </div>
        ) : null}
        <button
          onClick={() => setOpen((v) => !v)}
          className="glass-dark flex h-11 items-center gap-2.5 rounded-full pl-3 pr-4 text-[13px] font-medium text-white shadow-float transition-transform hover:scale-[1.02] active:scale-[0.98]"
          aria-expanded={open}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
            <Icon name={open ? "x" : "grid"} size={14} />
          </span>
          {current ? current.label : "Demo"}
          <span className="ml-1 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">Demo</span>
        </button>
      </div>
    </div>
  );
}
