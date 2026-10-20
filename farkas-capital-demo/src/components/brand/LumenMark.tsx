/** The Lumen Robotics mark: an open ring with a point of light in the gap.
 *  Same geometry as scripts/make-pass-assets.py so the pass and site match. */
export function LumenMark({ size = 28, color = "currentColor", className = "" }: { size?: number; color?: string; className?: string }) {
  const r = 34;
  const c = 50;
  // Arc from -10deg to 280deg (SVG angles measured clockwise from +x).
  const toXY = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return [c + r * Math.cos(a), c + r * Math.sin(a)];
  };
  const [sx, sy] = toXY(-10);
  const [ex, ey] = toXY(280);
  const [dx, dy] = toXY(-45);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden>
      <path d={`M ${sx} ${sy} A ${r} ${r} 0 1 1 ${ex} ${ey}`} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" />
      <circle cx={dx} cy={dy} r="7.5" fill={color} />
    </svg>
  );
}

export function LumenTile({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center bg-lumen-gradient text-white ${className}`}
      style={{ width: size, height: size, borderRadius: size * 0.24 }}
    >
      <LumenMark size={size * 0.62} color="#fff" />
    </span>
  );
}

export function LumenLogo({ size = 28, dark = false, className = "" }: { size?: number; dark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LumenTile size={size} />
      <span
        className={`whitespace-nowrap font-display font-semibold tracking-[-0.02em] ${dark ? "text-white" : "text-ink"}`}
        style={{ fontSize: size * 0.68 }}
      >
        Lumen Robotics
      </span>
    </span>
  );
}
