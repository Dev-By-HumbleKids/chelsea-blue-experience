import { useId } from 'react';

/** Original line illustrations of trophy silhouettes (not reproductions of the real trophies). */
export function TrophyIcon({ slug, className }: { slug: string; className?: string }) {
  const id = useId().replace(/:/g, '');
  const fill = `url(#tg-${id})`;
  const shape = (() => {
    switch (slug) {
      case 'champions-league':
        // Tall cup with large looping handles.
        return (
          <>
            <path d="M22 10h20c0 14-3 24-10 28-7-4-10-14-10-28z" fill={fill} />
            <path d="M22 13c-12-2-14 14-2 18M42 13c12-2 14 14 2 18" fill="none" stroke={fill} strokeWidth="3.2" strokeLinecap="round" />
            <path d="M29 38h6v8h-6z" fill={fill} />
            <path d="M23 46h18l2 8H21z" fill={fill} />
          </>
        );
      case 'league-titles':
        // Trophy with a crown on top.
        return (
          <>
            <path d="M24 12l3 4 5-6 5 6 3-4v6H24z" fill={fill} />
            <path d="M20 20h24c0 10-4 17-12 19-8-2-12-9-12-19z" fill={fill} />
            <path d="M18 22c-5 1-4 9 2 9M46 22c5 1 4 9-2 9" fill="none" stroke={fill} strokeWidth="2.6" />
            <path d="M29 39h6v7h-6z" fill={fill} />
            <path d="M22 46h20v8H22z" fill={fill} />
          </>
        );
      case 'fa-cup':
      case 'league-cup':
        // Classic lidded cup with slim handles.
        return (
          <>
            <ellipse cx="32" cy="10" rx="5" ry="3" fill={fill} />
            <path d="M22 13h20v3c0 9-4 15-10 17-6-2-10-8-10-17z" fill={fill} />
            <path d="M22 16c-6 0-6 9 1 10M42 16c6 0 6 9-1 10" fill="none" stroke={fill} strokeWidth="2.4" />
            <path d="M30 33h4v9h-4z" fill={fill} />
            <path d="M24 42h16l2 4H22z" fill={fill} />
            <path d="M21 47h22v7H21z" fill={fill} />
          </>
        );
      case 'fifa-club-world-cup':
        // Globe-topped trophy.
        return (
          <>
            <circle cx="32" cy="18" r="9" fill={fill} />
            <path d="M23 18h18M32 9c-4 5-4 13 0 18M32 9c4 5 4 13 0 18" stroke="#050B1A" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M27 27c2 6 2 12 1 19h8c-1-7-1-13 1-19z" fill={fill} />
            <path d="M22 46h20l2 8H20z" fill={fill} />
          </>
        );
      case 'conference-league':
      case 'europa-league':
        // Wide-bowl cup on a slim stem.
        return (
          <>
            <path d="M16 14h32c-1 12-7 20-16 22-9-2-15-10-16-22z" fill={fill} />
            <path d="M30 36h4v10h-4z" fill={fill} />
            <path d="M23 46h18l2 8H21z" fill={fill} />
          </>
        );
      default:
        return (
          <>
            <path d="M20 12h24c0 13-5 20-12 22-7-2-12-9-12-22z" fill={fill} />
            <path d="M20 15c-7 0-7 10 1 11M44 15c7 0 7 10-1 11" fill="none" stroke={fill} strokeWidth="2.6" />
            <path d="M29 34h6v10h-6z" fill={fill} />
            <path d="M22 44h20l2 10H20z" fill={fill} />
          </>
        );
    }
  })();
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id={`tg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F1DCAA" />
          <stop offset="0.5" stopColor="#C9A45C" />
          <stop offset="1" stopColor="#7E5E2A" />
        </linearGradient>
      </defs>
      {shape}
    </svg>
  );
}
