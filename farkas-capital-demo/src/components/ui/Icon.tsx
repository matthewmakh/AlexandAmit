import type { SVGProps } from "react";

type Name =
  | "check" | "x" | "arrow-right" | "arrow-up-right" | "chevron-down" | "chevron-right" | "search" | "filter"
  | "download" | "mail" | "phone" | "wallet" | "shield" | "doc" | "pen" | "bank" | "coin" | "sparkle"
  | "bell" | "grid" | "users" | "chart" | "sliders" | "cash" | "megaphone" | "settings" | "home" | "building"
  | "lock" | "refresh" | "plus" | "info" | "warning" | "clock" | "link" | "apple" | "google" | "qr" | "tag" | "note" | "eye";

const paths: Record<Name, React.ReactNode> = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-up-right": <path d="M7 17L17 7M9 7h8v8" />,
  "chevron-down": <path d="M6 9l6 6 6-6" />,
  "chevron-right": <path d="M9 6l6 6-6 6" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  download: <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 8l9 6 9-6" /></>,
  phone: <path d="M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2z" />,
  wallet: <><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M3 10h18M16 14h2" /></>,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
  doc: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M9 13h7M9 17h7" /></>,
  pen: <path d="M4 20l4-1 11-11-3-3L5 16zM13 7l3 3" />,
  bank: <path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18" />,
  coin: <><circle cx="12" cy="12" r="8" /><path d="M12 7v10M9.5 9.5h3.5a1.75 1.75 0 0 1 0 3.5H9.5h4a1.75 1.75 0 0 1 0 3.5H9.5" /></>,
  sparkle: <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM19 15l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />,
  bell: <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0" />,
  grid: <><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M3 19a6 6 0 0 1 12 0M16 4.5a3.5 3.5 0 0 1 0 7M21 19a6 6 0 0 0-4-5.6" /></>,
  chart: <path d="M4 19V5M4 19h16M8 15l4-5 3 3 5-7" />,
  sliders: <path d="M4 7h10M18 7h2M4 17h4M12 17h8M14 4.5v5M8 14.5v5" />,
  cash: <><rect x="3" y="6" width="18" height="12" rx="2.5" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9.5h.01M18 14.5h.01" /></>,
  megaphone: <path d="M4 10v4h3l8 4V6l-8 4zM18 9a4 4 0 0 1 0 6" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" /></>,
  home: <path d="M4 11l8-7 8 7v9H4z M10 20v-6h4v6" />,
  building: <path d="M5 21V4h9v17M14 9h5v12M8 8h2M8 12h2M8 16h2M3 21h18" />,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  refresh: <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  warning: <path d="M12 4l9 16H3zM12 10v4M12 17h.01" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  link: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
  apple: <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.7 0 0-2.6-1-2.7-3.6zM14.1 5.8c.6-.8 1.1-1.9.9-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3z" />,
  google: <path d="M21 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3c1.8-1.7 2.8-4.1 2.8-7.1zM12 21c2.5 0 4.6-.8 6.1-2.3l-3-2.4c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H3.8v2.4A9 9 0 0 0 12 21zM6.9 13.4a5.4 5.4 0 0 1 0-3.5V7.5H3.8a9 9 0 0 0 0 8.2l3.1-2.3zM12 6.6c1.3 0 2.5.5 3.4 1.4l2.6-2.6A9 9 0 0 0 3.8 7.5l3.1 2.4C7.6 7.9 9.6 6.6 12 6.6z" />,
  qr: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" /></>,
  tag: <path d="M4 12V4h8l8 8-8 8zM8 8h.01" />,
  note: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" />,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
};

const filled: Name[] = ["apple", "google"];

export function Icon({ name, size = 18, className = "", strokeWidth = 1.8, ...rest }: { name: Name; size?: number; className?: string; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  const isFilled = filled.includes(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? "currentColor" : "none"}
      stroke={isFilled ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
