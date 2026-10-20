/** Farkas Capital: a restrained monogram in gold on near-black. */
export function FarkasMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center bg-farkas text-gold ${className}`}
      style={{ width: size, height: size, borderRadius: size * 0.24 }}
      aria-hidden
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none">
        <path d="M5 3h14v3.2H8.6v4.1H17v3.2H8.6V21H5z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function FarkasLogo({ size = 28, dark = false, className = "" }: { size?: number; dark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <FarkasMark size={size} />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-semibold tracking-[0.14em] uppercase ${dark ? "text-white" : "text-ink"}`} style={{ fontSize: size * 0.46 }}>
          Farkas Capital
        </span>
        <span className={`mt-1 text-[10px] tracking-[0.08em] uppercase ${dark ? "text-white/50" : "text-ink-4"}`}>Broker-dealer</span>
      </span>
    </span>
  );
}
