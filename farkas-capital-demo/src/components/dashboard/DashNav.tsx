"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

export const DASH_GROUPS: { title: string; items: { href: string; label: string; icon: Parameters<typeof Icon>[0]["name"] }[] }[] = [
  {
    title: "Raise",
    items: [
      { href: "/issuer", label: "Overview", icon: "chart" },
      { href: "/issuer/actions", label: "Action center", icon: "bell" },
      { href: "/issuer/analytics", label: "Conversion", icon: "sparkle" },
    ],
  },
  {
    title: "Investors",
    items: [
      { href: "/issuer/investors", label: "Investor CRM", icon: "users" },
      { href: "/issuer/relations", label: "Investor relations", icon: "megaphone" },
    ],
  },
  {
    title: "Offering",
    items: [
      { href: "/issuer/offering", label: "Offering controls", icon: "sliders" },
      { href: "/issuer/money", label: "Money & ownership", icon: "cash" },
      { href: "/issuer/settings", label: "Team & settings", icon: "settings" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/issuer") return pathname === "/issuer" || pathname.startsWith("/issuer/orders");
  return pathname === href || pathname.startsWith(href + "/");
}

export function DashSidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-6">
      {DASH_GROUPS.map((g) => (
        <div key={g.title}>
          <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-4">{g.title}</div>
          <ul className="space-y-0.5">
            {g.items.map((it) => {
              const active = isActive(pathname, it.href);
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-[14px] font-medium transition-colors ${active ? "bg-blue text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "text-ink-2 hover:bg-ink/[0.05]"}`}
                  >
                    <Icon name={it.icon} size={17} className={active ? "text-white" : "text-ink-3"} />
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DashPillNav() {
  const pathname = usePathname();
  const items = DASH_GROUPS.flatMap((g) => g.items);
  return (
    <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
      {items.map((it) => {
        const active = isActive(pathname, it.href);
        return (
          <Link key={it.href} href={it.href} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium ${active ? "bg-ink text-white" : "bg-paper text-ink-2 ring-hair"}`}>
            {it.label}
          </Link>
        );
      })}
    </div>
  );
}
