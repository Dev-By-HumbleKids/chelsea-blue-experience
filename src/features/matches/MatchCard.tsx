import { ArrowUpRight, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TeamBadge } from '@/components/ui';
import type { Fixture } from '@/data/types';
import { cx, fmtDate, fmtTime } from '@/lib/format';
import { effectiveStatus, isBookable } from '@/services/provider';

export function teams(f: Fixture) {
  const home = f.venue === 'H' ? { name: 'Chelsea', short: 'CHE', us: true } : { name: f.opponent, short: f.opponentShort, us: false };
  const away = f.venue === 'A' ? { name: 'Chelsea', short: 'CHE', us: true } : { name: f.opponent, short: f.opponentShort, us: false };
  return { home, away };
}

export function scoreline(f: Fixture) {
  if (!f.score) return null;
  return f.venue === 'H' ? `${f.score.chelsea} – ${f.score.opponent}` : `${f.score.opponent} – ${f.score.chelsea}`;
}

export function resultLetter(f: Fixture) {
  if (!f.score) return null;
  return f.score.chelsea > f.score.opponent ? 'W' : f.score.chelsea < f.score.opponent ? 'L' : 'D';
}

export function StatusBadge({ fixture }: { fixture: Fixture }) {
  const s = effectiveStatus(fixture);
  const map = {
    scheduled: ['Scheduled', 'text-sky-300 ring-sky-300/30'],
    completed: ['Full time', 'text-ivory/70 ring-white/20'],
    postponed: ['Postponed', 'text-amber-300 ring-amber-300/30'],
    unverified: ['Result pending', 'text-amber-300 ring-amber-300/30'],
  } as const;
  const [label, cls] = map[s];
  return <span className={cx('rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ring-1 ring-inset', cls)}>{label}</span>;
}

const letterCls = { W: 'bg-emerald-400/90 text-midnight', D: 'bg-silver/80 text-midnight', L: 'bg-rose-400/90 text-midnight' } as const;

export function FormDot({ r }: { r: 'W' | 'D' | 'L' }) {
  return (
    <span className={cx('grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold', letterCls[r])} aria-label={{ W: 'Win', D: 'Draw', L: 'Loss' }[r]}>
      {r}
    </span>
  );
}

export function MatchRow({ fixture }: { fixture: Fixture }) {
  const { home, away } = teams(fixture);
  const status = effectiveStatus(fixture);
  const letter = resultLetter(fixture);
  return (
    <li className="group relative">
      <Link
        to={`/matches/${fixture.id}`}
        className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl px-4 py-5 transition-colors hover:bg-white/[0.04] sm:grid-cols-[170px_1fr_auto] sm:px-6"
      >
        <div className="col-span-2 flex items-center gap-3 text-xs text-silver sm:col-span-1 sm:block">
          <p className="font-semibold uppercase tracking-[0.14em] text-ivory/80">{fmtDate(fixture.kickoff, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
          <p>{fixture.dateOnly ? fixture.competition : `${fmtTime(fixture.kickoff)} · ${fixture.competition}`}</p>
        </div>
        <div className="flex min-w-0 items-center justify-center gap-2 sm:gap-6">
          <span className={cx('min-w-0 flex-1 truncate text-right font-display text-lg tracking-wide sm:text-2xl', home.us && 'text-royal-300')}>{home.name}</span>
          <span className="hidden sm:block">
            <TeamBadge short={home.short} home={home.us} size={40} />
          </span>
          <span className="min-w-[56px] shrink-0 text-center font-display text-2xl tabular-nums sm:min-w-[76px]">{status === 'completed' ? scoreline(fixture) : <span className="text-base text-silver">vs</span>}</span>
          <span className="hidden sm:block">
            <TeamBadge short={away.short} home={away.us} size={40} />
          </span>
          <span className={cx('min-w-0 flex-1 truncate font-display text-lg tracking-wide sm:text-2xl', away.us && 'text-royal-300')}>{away.name}</span>
        </div>
        <div className="flex items-center justify-end gap-2">
          {letter && <FormDot r={letter} />}
          {isBookable(fixture) && (
            <span className="hidden items-center gap-1 rounded-full bg-royal/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-royal-300 ring-1 ring-royal-300/30 md:inline-flex">
              <Ticket className="h-3 w-3" /> Demo seats
            </span>
          )}
          <ArrowUpRight className="h-4 w-4 text-silver transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </div>
      </Link>
    </li>
  );
}
