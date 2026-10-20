/** Simple marks for the two other fictional issuers on the pass stack. */
export function HarborMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <path d="M22 40c0-6 5-10 10-10h36c5 0 10 4 10 10v10c0 16-12 28-28 28S22 66 22 50z" fill="none" stroke="#fff" strokeWidth="9" />
      <path d="M78 44h6c6 0 10 4 10 10s-4 10-10 10h-6" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

export function VerdantMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <path d="M50 82C50 50 60 30 84 20c0 32-12 54-34 62z" fill="#fff" />
      <path d="M50 82C50 58 42 42 18 34c2 28 12 44 32 48z" fill="#fff" opacity="0.7" />
    </svg>
  );
}
