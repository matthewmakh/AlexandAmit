import { initials } from "@/lib/data/format";

const palette = ["#2B5CFF", "#5E5CE6", "#30B0C7", "#34C759", "#FF9F0A", "#AF52DE", "#FF375F", "#0071E3"];

export function Avatar({ first, last, size = 36, className = "" }: { first: string; last: string; size?: number; className?: string }) {
  const code = (first.charCodeAt(0) + last.charCodeAt(0)) % palette.length;
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{ width: size, height: size, background: palette[code], fontSize: size * 0.38 }}
      aria-hidden
    >
      {initials(first, last)}
    </span>
  );
}
