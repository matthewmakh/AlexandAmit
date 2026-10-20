import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "dark" | "ghost" | "link" | "brand" | "danger" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 ease-[var(--ease-apple)] focus-ring disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-blue-deep active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.12)]",
  secondary: "bg-ink/[0.06] text-ink hover:bg-ink/[0.1] active:scale-[0.98]",
  dark: "bg-ink text-white hover:bg-night-4 active:scale-[0.98]",
  white: "bg-white text-ink hover:bg-canvas active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.12)]",
  ghost: "bg-transparent text-ink hover:bg-ink/[0.06] active:scale-[0.98]",
  brand: "bg-lumen text-white hover:bg-lumen-deep active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.12)]",
  danger: "bg-red text-white hover:brightness-95 active:scale-[0.98]",
  link: "bg-transparent text-blue hover:underline px-0 rounded-none",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-10 px-5 text-[15px]",
  lg: "h-12 px-6 text-[17px]",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
  external?: boolean;
}

export function Button({ variant = "primary", size = "md", href, className = "", children, external, ...rest }: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${variant === "link" ? "" : sizes[size]} ${className}`;
  if (href) {
    if (external) {
      return (
        <a href={href} className={cls} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

export function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none" className={className} aria-hidden>
      <path d="M2 1.5l5 5.5-5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Apple's "Learn more ›" style text link. */
export function TextLink({ href, children, className = "", tone = "blue" }: { href: string; children: ReactNode; className?: string; tone?: "blue" | "white" | "ink" }) {
  const color = tone === "white" ? "text-white" : tone === "ink" ? "text-ink" : "text-blue";
  return (
    <Link href={href} className={`group inline-flex items-center gap-1.5 font-medium ${color} hover:underline ${className}`}>
      {children}
      <Chevron className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
