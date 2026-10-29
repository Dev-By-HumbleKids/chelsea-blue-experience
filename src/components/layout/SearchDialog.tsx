import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownLeft, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HONOURS } from '@/data/honours';
import { LEGENDS } from '@/data/legends';
import { NEWS } from '@/data/news';
import { FIXTURES } from '@/data/season';
import { SQUAD } from '@/data/squad';
import { TOUR_STOPS } from '@/data/stadium';
import { TIMELINE } from '@/data/timeline';
import { cx, fmtDate } from '@/lib/format';

type Kind = 'Player' | 'Legend' | 'Match' | 'News' | 'Trophy' | 'Moment' | 'Stadium';

interface Result {
  kind: Kind;
  title: string;
  sub: string;
  to: string;
  hay: string;
}

const INDEX: Result[] = [
  ...SQUAD.map((p) => ({ kind: 'Player' as const, title: p.name, sub: `#${p.number} · ${p.role} · ${p.nationality}`, to: `/squad/${p.slug}`, hay: `${p.name} ${p.role} ${p.position} ${p.nationality}` })),
  ...LEGENDS.map((l) => ({ kind: 'Legend' as const, title: l.name, sub: `${l.position} · ${l.years}`, to: `/legends/${l.slug}`, hay: `${l.name} ${l.position} legend ${l.years}` })),
  ...FIXTURES.map((f) => ({ kind: 'Match' as const, title: `${f.venue === 'H' ? 'Chelsea v ' + f.opponent : f.opponent + ' v Chelsea'}`, sub: `${f.competition} · ${fmtDate(f.kickoff)}`, to: `/matches/${f.id}`, hay: `${f.opponent} ${f.competition} ${f.stadium}` })),
  ...NEWS.map((n) => ({ kind: 'News' as const, title: n.title, sub: `${n.category} · ${fmtDate(n.date)}`, to: `/news/${n.slug}`, hay: `${n.title} ${n.summary} ${n.category}` })),
  ...HONOURS.map((h) => ({ kind: 'Trophy' as const, title: h.name, sub: `${h.count}× · ${h.seasons.join(', ')}`, to: `/trophies/${h.slug}`, hay: `${h.name} ${h.shortName} ${h.seasons.join(' ')} trophy` })),
  ...TIMELINE.map((t) => ({ kind: 'Moment' as const, title: t.title, sub: t.date, to: `/history#${t.id}`, hay: `${t.title} ${t.text} ${t.year}` })),
  ...TOUR_STOPS.map((s) => ({ kind: 'Stadium' as const, title: s.name, sub: 'Virtual stadium tour', to: `/stadium?stop=${s.id}`, hay: `${s.name} ${s.text} stadium tour` })),
];

const KINDS: (Kind | 'All')[] = ['All', 'Player', 'Legend', 'Match', 'News', 'Trophy', 'Moment', 'Stadium'];

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<Kind | 'All'>('All');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return INDEX.filter((r) => (kind === 'All' || r.kind === kind) && terms.every((t) => norm(r.hay).includes(t))).slice(0, 30);
  }, [q, kind]);

  useEffect(() => {
    if (open) {
      setTimeout(() => input.current?.focus(), 30);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  useEffect(() => setActive(0), [q, kind]);

  const go = (r: Result) => {
    onClose();
    setQ('');
    navigate(r.to);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
    if (e.key === 'Enter' && results[active]) go(results[active]);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onKey}
            initial={{ y: 16, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-midnight-800 shadow-2xl ring-1 ring-white/10"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-5">
              <Search className="h-5 w-5 text-silver" aria-hidden />
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search players, matches, trophies, moments…"
                className="h-16 flex-1 bg-transparent text-lg outline-none placeholder:text-silver/70"
                aria-label="Search query"
                aria-controls="search-results"
              />
              <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10" aria-label="Close search">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto border-b border-white/[0.06] px-5 py-3">
              {KINDS.map((k) => (
                <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k} className={cx('rounded-full px-3 py-1 text-xs font-semibold', kind === k ? 'bg-ivory text-midnight' : 'text-ivory/70 ring-1 ring-white/15')}>
                  {k}
                </button>
              ))}
            </div>
            <ul id="search-results" role="listbox" data-lenis-prevent className="max-h-[50vh] overflow-y-auto p-2">
              {q && results.length === 0 && <li className="px-4 py-10 text-center text-silver">No results for “{q}”. Try a player, an opponent or a year.</li>}
              {!q && <li className="px-4 py-10 text-center text-silver">Try “Drogba”, “Munich”, “Arsenal” or “tunnel”.</li>}
              {results.map((r, i) => (
                <li key={r.kind + r.to + r.title} role="option" aria-selected={i === active}>
                  <button type="button" onMouseEnter={() => setActive(i)} onClick={() => go(r)} className={cx('flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left', i === active && 'bg-white/[0.07]')}>
                    <span className="w-16 shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">{r.kind}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{r.title}</span>
                      <span className="block truncate text-xs text-silver">{r.sub}</span>
                    </span>
                    {i === active && <CornerDownLeft className="h-4 w-4 text-silver" aria-hidden />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
