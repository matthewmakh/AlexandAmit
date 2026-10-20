import type { ReactNode } from "react";

/**
 * A simplified iPhone frame: black body, Dynamic Island, status bar. Wraps
 * any screen content at a 393 × 852 point canvas scaled by `width`.
 */
export function IPhoneFrame({ children, width = 320, className = "", screenClassName = "bg-black" }: { children: ReactNode; width?: number; className?: string; screenClassName?: string }) {
  const s = width / 393;
  const h = 852 * s;
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: width + 24 * s, height: h + 24 * s, borderRadius: 64 * s, background: "linear-gradient(160deg, #3a3a3c, #0a0a0a)", padding: 12 * s, boxShadow: "0 40px 80px -24px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.08)" }}
    >
      <div className={`relative h-full w-full overflow-hidden ${screenClassName}`} style={{ borderRadius: 54 * s }}>
        {/* Status bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between text-white" style={{ padding: `${18 * s}px ${30 * s}px 0`, fontSize: 15 * s, fontWeight: 600 }}>
          <span>9:41</span>
          <span className="flex items-center" style={{ gap: 6 * s }}>
            <svg width={18 * s} height={12 * s} viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.8" /><rect x="5" y="5.5" width="3" height="6.5" rx="0.8" /><rect x="10" y="3" width="3" height="9" rx="0.8" /><rect x="15" y="0" width="3" height="12" rx="0.8" /></svg>
            <svg width={26 * s} height={12 * s} viewBox="0 0 26 12" fill="none" stroke="currentColor"><rect x="0.5" y="0.5" width="22" height="11" rx="3" strokeOpacity="0.5" /><rect x="2" y="2" width="19" height="8" rx="1.8" fill="currentColor" stroke="none" /><path d="M24 4v4" strokeOpacity="0.5" strokeWidth="1.5" /></svg>
          </span>
        </div>
        {/* Dynamic Island */}
        <div className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 rounded-full bg-black" style={{ top: 11 * s, width: 125 * s, height: 36 * s }} />
        <div className="h-full w-full" style={{ paddingTop: 54 * s }}>
          {children}
        </div>
        {/* Home indicator */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/80" style={{ width: 134 * s, height: 5 * s, marginBottom: 8 * s }} />
      </div>
    </div>
  );
}
