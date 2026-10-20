import type { CSSProperties, ReactNode } from "react";

/**
 * A labelled placeholder for an image that will be supplied later. Renders a
 * soft frame with the intended subject so the layout reads correctly in the
 * demo and the brief for each image is visible in place.
 *
 * Swap for <Image> once the asset exists; the `aspect` keeps the layout stable.
 */
export function ImageSlot({
  label,
  brief,
  aspect = "16/9",
  tone = "light",
  className = "",
  rounded = "rounded-[28px]",
  children,
  style,
}: {
  /** Short name of the image, e.g. "Hero: robot on warehouse floor". */
  label: string;
  /** What the image should show, in one or two sentences. */
  brief?: string;
  /** CSS aspect ratio, e.g. "16/9", "4/5", "1/1". */
  aspect?: string;
  tone?: "light" | "dark" | "brand";
  className?: string;
  rounded?: string;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const palette =
    tone === "dark"
      ? "bg-night-2 text-white/80 border-white/15"
      : tone === "brand"
        ? "bg-lumen-gradient text-white/90 border-white/25"
        : "bg-canvas text-ink-3 border-line";
  return (
    <div
      className={`relative overflow-hidden border border-dashed ${palette} ${rounded} ${className}`}
      style={{ aspectRatio: aspect, ...style }}
      role="img"
      aria-label={`Image placeholder: ${label}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 0 48%, currentColor 48% 52%, transparent 52%)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(60% 60% at 50% 50%, transparent 40%, black 100%)",
          WebkitMaskImage: "radial-gradient(60% 60% at 50% 50%, transparent 40%, black 100%)",
          opacity: 0.12,
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-current/30">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <circle cx="9" cy="10" r="1.8" />
            <path d="M21 16l-5.2-5.2a1.5 1.5 0 0 0-2.1 0L6 18.5" />
          </svg>
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] opacity-80">Image · {label}</span>
        {brief ? <span className="mt-1.5 max-w-[42ch] text-[13px] leading-snug opacity-70">{brief}</span> : null}
        <span className="mt-2 font-mono text-[10px] opacity-50">aspect {aspect}</span>
      </div>
      {children}
    </div>
  );
}
