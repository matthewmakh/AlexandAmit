"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

export interface NavLink {
  href: string;
  label: string;
}

/**
 * The floating glass pill that sits over every surface. Shrinks slightly on
 * scroll, collapses to a menu on phones.
 */
export function FloatingNav({
  brand,
  links,
  cta,
  dark = false,
  align = "center",
}: {
  brand: ReactNode;
  links: NavLink[];
  cta?: ReactNode;
  dark?: boolean;
  align?: "center" | "wide";
}) {
  const [scrolled, setScrolled] = useState(false);
  // The menu remembers the path it was opened on, so navigating closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const pathname = usePathname();
  const open = openOn === pathname;
  const setOpen = (fn: (v: boolean) => boolean) => setOpenOn(fn(open) ? pathname : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const surface = dark ? "glass-dark text-white" : "glass text-ink";
  const linkBase = "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors";
  const active = dark ? "bg-white/15 text-white" : "bg-ink/[0.07] text-ink";
  const idle = dark ? "text-white/70 hover:text-white hover:bg-white/10" : "text-ink-3 hover:text-ink hover:bg-ink/[0.05]";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4">
      <nav
        className={`pointer-events-auto flex w-full items-center justify-between gap-3 rounded-full pl-4 pr-2 transition-all duration-300 ease-[var(--ease-apple)] ${surface} ${
          align === "wide" ? "max-w-6xl" : "max-w-3xl"
        } ${scrolled ? "h-12 shadow-float" : "h-14"}`}
        aria-label="Primary"
      >
        <div className="flex min-w-0 items-center">{brand}</div>
        <div className="hidden items-center gap-0.5 md:flex">
          {links.map((l) => {
            const isActive = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href + "/")) || (l.href !== "/" && pathname === l.href);
            return (
              <Link key={l.href} href={l.href} className={`${linkBase} ${isActive ? active : idle}`}>
                {l.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          {cta ? <div className="hidden sm:block">{cta}</div> : null}
          <button
            className={`md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full ${dark ? "hover:bg-white/10" : "hover:bg-ink/[0.06]"}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </nav>
      {open ? (
        <div className={`pointer-events-auto absolute left-3 right-3 top-[68px] rounded-[24px] p-2 md:hidden ${surface} shadow-float`}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`block rounded-2xl px-4 py-3 text-[15px] font-medium ${dark ? "hover:bg-white/10" : "hover:bg-ink/[0.05]"}`}>
              {l.label}
            </Link>
          ))}
          {cta ? <div className="p-2 pt-1">{cta}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
