import { Icon } from "@/components/ui/Icon";

/** Apple's black "Add to Apple Wallet" badge, drawn in code. */
export function AddToAppleWallet({ onClick, href, className = "" }: { onClick?: () => void; href?: string; className?: string }) {
  const inner = (
    <>
      <span className="relative flex h-7 w-9 items-center justify-center">
        <span className="absolute h-5 w-7 rounded-[4px] bg-[#f7b500]" style={{ top: 1 }} />
        <span className="absolute h-5 w-7 rounded-[4px] bg-[#ff5a3c]" style={{ top: 4.5 }} />
        <span className="absolute h-5 w-7 rounded-[4px] bg-[#2b8cff]" style={{ top: 8 }} />
        <span className="absolute h-4 w-7 rounded-[4px] bg-[#34c759]" style={{ top: 12 }} />
      </span>
      <span className="flex flex-col items-start">
        <span className="text-[10px] leading-[11px] font-medium opacity-90">Add to</span>
        <span className="text-[15px] leading-[18px] font-semibold tracking-[-0.01em]">Apple Wallet</span>
      </span>
    </>
  );
  const cls = `inline-flex h-12 items-center gap-2.5 rounded-[10px] bg-black pl-3 pr-4 text-white shadow-[0_1px_2px_rgba(0,0,0,0.25)] ring-1 ring-white/15 transition-transform hover:scale-[1.02] active:scale-[0.98] ${className}`;
  if (href) return <a href={href} className={cls}>{inner}</a>;
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function AddToGoogleWallet({ onClick, className = "" }: { onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-12 items-center gap-2.5 rounded-[10px] bg-black pl-3 pr-4 text-white shadow-[0_1px_2px_rgba(0,0,0,0.25)] ring-1 ring-white/15 transition-transform hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
        <Icon name="google" size={18} className="text-[#4285F4]" />
      </span>
      <span className="flex flex-col items-start">
        <span className="text-[10px] leading-[11px] font-medium opacity-90">Add to</span>
        <span className="text-[15px] leading-[18px] font-semibold tracking-[-0.01em]">Google Wallet</span>
      </span>
    </button>
  );
}
