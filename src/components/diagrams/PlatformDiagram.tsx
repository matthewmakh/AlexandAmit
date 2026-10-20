import { Frame, INK, INK3, LINE } from "./primitives";

/** One platform, many branded surfaces. */
export function PlatformDiagram({ className = "" }: { className?: string }) {
  const sites = [
    { name: "Lumen Robotics", color: "#2B5CFF", deep: "#0B2A8A", x: 40 },
    { name: "Harbor Coffee Roasters", color: "#B45309", deep: "#6B2E05", x: 300 },
    { name: "Verdant Grid", color: "#15803D", deep: "#064E27", x: 560 },
  ];
  return (
    <Frame viewBox="0 0 800 600" label="Three branded company websites on one platform" className={className}>
      {sites.map((s) => (
        <g key={s.name} filter="url(#soft)">
          {/* browser window */}
          <rect x={s.x} y={60} width={200} height={300} rx="16" fill="#fff" stroke={LINE} />
          <rect x={s.x} y={60} width={200} height={28} rx="16" fill="#f5f5f7" />
          <rect x={s.x} y={74} width={200} height={14} fill="#f5f5f7" />
          <circle cx={s.x + 16} cy={74} r="4" fill="#ff5f57" />
          <circle cx={s.x + 30} cy={74} r="4" fill="#febc2e" />
          <circle cx={s.x + 44} cy={74} r="4" fill="#28c840" />
          {/* nav */}
          <rect x={s.x + 16} y={104} width={60} height="8" rx="4" fill={s.color} />
          <rect x={s.x + 130} y={102} width={54} height="12" rx="6" fill={s.color} />
          <text x={s.x + 157} y={111} fontSize="7" fontWeight="600" fill="#fff" textAnchor="middle">Invest</text>
          {/* hero */}
          <rect x={s.x + 16} y={126} width={120} height={10} rx="3" fill={INK} opacity="0.85" />
          <rect x={s.x + 16} y={142} width={90} height={10} rx="3" fill={INK} opacity="0.85" />
          <rect x={s.x + 16} y={160} width={150} height={5} rx="2.5" fill={LINE} />
          <rect x={s.x + 16} y={170} width={120} height={5} rx="2.5" fill={LINE} />
          {/* pass */}
          <rect x={s.x + 40} y={196} width={120} height={140} rx="10" fill={`url(#g-${s.x})`} />
          <defs>
            <linearGradient id={`g-${s.x}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={s.color} />
              <stop offset="1" stopColor={s.deep} />
            </linearGradient>
          </defs>
          <circle cx={s.x + 54} cy={212} r="6" fill="none" stroke="#fff" strokeWidth="2" />
          <rect x={s.x + 66} y={208} width={46} height={7} rx="3" fill="#fff" opacity="0.9" />
          <rect x={s.x + 52} y={232} width={70} height={14} rx="3" fill="#fff" />
          <rect x={s.x + 52} y={254} width={40} height={5} rx="2.5" fill="#fff" opacity="0.6" />
          <rect x={s.x + 108} y={254} width={40} height={5} rx="2.5" fill="#fff" opacity="0.6" />
          <rect x={s.x + 82} y={282} width={36} height={36} rx="4" fill="#fff" />
          <text x={s.x + 100} y={384} fontSize="12" fontWeight="600" fill={INK} textAnchor="middle">{s.name}</text>
          <text x={s.x + 100} y={400} fontSize="10" fill={INK3} textAnchor="middle">own domain · own brand · own pass</text>
          <path d={`M${s.x + 100} 410 L${s.x + 100} 440`} stroke={LINE} strokeWidth="2" strokeDasharray="4 4" />
        </g>
      ))}
      {/* platform layer */}
      <g filter="url(#soft)">
        <rect x={40} y={444} width={720} height={120} rx="22" fill="#111" />
        <text x={70} y={480} fontSize="15" fontWeight="600" fill="#fff">One platform · Farkas Capital, registered broker-dealer</text>
        <text x={70} y={504} fontSize="11.5" fill="rgba(255,255,255,0.65)">Compliance decisions · KYC/AML and accreditation · escrow and funds release · transfer-agent sync</text>
        <text x={70} y={522} fontSize="11.5" fill="rgba(255,255,255,0.65)">Wallet pass service · reconciliation · audit · required disclosures where counsel requires them</text>
        <rect x={70} y={536} width={10} height={10} rx="2" fill="#C9A227" />
        <text x={88} y={545} fontSize="10.5" fill="#C9A227">No Powered-by badge. No shared marketplace.</text>
      </g>
    </Frame>
  );
}
