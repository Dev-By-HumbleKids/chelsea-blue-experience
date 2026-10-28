/**
 * Original project emblem: a lion-head mark inside a roundel. Deliberately NOT the Chelsea FC
 * crest (a registered trademark) — it only nods to the club's lion heritage.
 */
export function Emblem({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} role="img" aria-label="The Blue Experience emblem">
      <defs>
        <linearGradient id="em-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E2C88E" />
          <stop offset="1" stopColor="#9C7A3C" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="#034694" />
      <circle cx="32" cy="32" r="27.5" fill="none" stroke="url(#em-g)" strokeWidth="1.5" />
      {/* Stylised lion head: mane as a ring of strokes, simple face */}
      <g fill="none" stroke="#F5F2EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 14c-3 2-6 2-8 1 0 3-2 5-4 6 2 2 2 5 1 7 3 0 4 2 4 4" />
        <path d="M32 14c3 2 6 2 8 1 0 3 2 5 4 6-2 2-2 5-1 7-3 0-4 2-4 4" />
        <path d="M25 32c0 6 3 11 7 13 4-2 7-7 7-13" />
        <path d="M28.5 31.5h.01M35.5 31.5h.01" strokeWidth="3" />
        <path d="M30 38c1 1 3 1 4 0" />
        <path d="M32 35v3" />
      </g>
      <text x="32" y="55" textAnchor="middle" fontFamily="Bebas Neue, Impact, sans-serif" fontSize="7" letterSpacing="1.5" fill="url(#em-g)">
        LONDON
      </text>
    </svg>
  );
}
