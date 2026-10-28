import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState, PageHero, Pill, ProvenanceTag, Reveal, SectionHeading, Skeleton, Sources } from '@/components/ui';
import { SEASON, SEASON_SOURCES, SNAPSHOT_DATE } from '@/data/season';
import type { Competition, Fixture } from '@/data/types';
import { cx, fmtDate } from '@/lib/format';
import { useFixtures, useMeta, useTable } from '@/lib/hooks';
import { effectiveStatus, form } from '@/services/provider';
import { FormDot, MatchRow } from './MatchCard';

type Tab = 'upcoming' | 'results';

function scorers(fixtures: Fixture[]) {
  const tally = new Map<string, number>();
  for (const f of fixtures) for (const g of f.chelseaScorers ?? []) if (!g.ownGoal && g.player !== 'Unattributed') tally.set(g.player, (tally.get(g.player) ?? 0) + 1);
  return [...tally.entries()].sort((a, b) => b[1] - a[1]);
}

export default function MatchesPage() {
  useMeta('Matches', 'Fixtures, results and the 2026/27 season tracker — a dated, verified snapshot.');
  const { fixtures, error } = useFixtures();
  const table = useTable();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [comp, setComp] = useState<Competition | 'All'>('All');
  const [venue, setVenue] = useState<'All' | 'H' | 'A'>('All');
  const [month, setMonth] = useState('All');
  const [q, setQ] = useState('');

  const months = useMemo(() => {
    const set = new Set((fixtures ?? []).map((f) => f.kickoff.slice(0, 7)));
    return ['All', ...set];
  }, [fixtures]);

  const list = useMemo(() => {
    if (!fixtures) return [];
    return fixtures
      .filter((f) => (tab === 'results' ? effectiveStatus(f) !== 'scheduled' : effectiveStatus(f) === 'scheduled'))
      .filter((f) => comp === 'All' || f.competition === comp)
      .filter((f) => venue === 'All' || f.venue === venue)
      .filter((f) => month === 'All' || f.kickoff.startsWith(month))
      .filter((f) => !q || f.opponent.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => (tab === 'results' ? b.kickoff.localeCompare(a.kickoff) : a.kickoff.localeCompare(b.kickoff)));
  }, [fixtures, tab, comp, venue, month, q]);

  const completed = (fixtures ?? []).filter((f) => f.status === 'completed');
  const top = scorers(completed);

  return (
    <>
      <PageHero eyebrow={`Season ${SEASON}`} title={<>Matches</>} intro="Every fixture and result from the men’s first team, plus the league picture. Data is a verified snapshot, not a live feed." image="bowl-spurs">
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ProvenanceTag kind="snapshot">Last updated {fmtDate(SNAPSHOT_DATE + 'T12:00:00Z', { day: 'numeric', month: 'long', year: 'numeric' })}</ProvenanceTag>
          <span className="text-xs text-silver">Times shown in UK time</span>
        </div>
      </PageHero>

      <section className="container-x">
        <div className="sticky top-[var(--nav-h)] z-20 -mx-5 flex flex-col gap-4 bg-midnight/90 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Fixture view">
            {(['upcoming', 'results'] as Tab[]).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cx('relative px-1 pb-2 font-display text-3xl tracking-wide transition-colors sm:text-4xl', tab === t ? 'text-ivory' : 'text-ivory/35 hover:text-ivory/70')}
              >
                {t === 'upcoming' ? 'Fixtures' : 'Results'}
                {tab === t && <span className="absolute inset-x-1 bottom-0 h-[2px] bg-gold" />}
              </button>
            ))}
            <span className="mx-2 hidden h-8 w-px bg-white/10 sm:block" />
            <label className="relative ml-auto w-full sm:w-64">
              <span className="sr-only">Search by opponent</span>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-silver" aria-hidden />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search opponent" className="h-10 w-full rounded-full bg-white/[0.06] pl-9 pr-4 text-sm outline-none ring-1 ring-white/10 placeholder:text-silver focus:ring-gold/60" />
            </label>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(['All', 'Premier League', 'EFL Cup'] as const).map((c) => (
              <Pill key={c} active={comp === c} onClick={() => setComp(c)}>
                {c}
              </Pill>
            ))}
            <span className="mx-1 w-px shrink-0 bg-white/10" />
            {(['All', 'H', 'A'] as const).map((v) => (
              <Pill key={v} active={venue === v} onClick={() => setVenue(v)}>
                {v === 'All' ? 'Home & away' : v === 'H' ? 'Home' : 'Away'}
              </Pill>
            ))}
            <span className="mx-1 w-px shrink-0 bg-white/10" />
            <label className="sr-only" htmlFor="month">
              Month
            </label>
            <select id="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-9 shrink-0 rounded-full bg-white/[0.06] px-4 text-[12px] font-semibold uppercase tracking-[0.12em] ring-1 ring-white/15">
              {months.map((m) => (
                <option key={m} value={m} className="bg-midnight">
                  {m === 'All' ? 'All months' : fmtDate(m + '-15T12:00:00Z', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6" aria-live="polite">
          {error && <EmptyState title="Couldn’t load fixtures" text={error} />}
          {!fixtures && !error && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          )}
          {fixtures && list.length === 0 && <EmptyState title="No matches found" text="Try a different opponent, competition or month." />}
          {list.length > 0 && <ul className="divide-y divide-white/[0.06]">{list.map((f) => <MatchRow key={f.id} fixture={f} />)}</ul>}
        </div>
        <Sources sources={SEASON_SOURCES} className="mt-8" />
      </section>

      <section id="table" className="container-x scroll-mt-28 pt-28">
        <SectionHeading eyebrow="Season tracker" title="The league picture" intro={table?.note} />
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <Reveal className="surface overflow-x-auto rounded-[24px] p-2">
            <table className="w-full min-w-[520px] text-sm">
              <caption className="sr-only">Premier League table excerpt</caption>
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.16em] text-silver">
                  {['Pos', 'Club', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].map((h) => (
                    <th key={h} scope="col" className={cx('px-3 py-3 font-semibold', h !== 'Club' && 'text-center')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table?.rows.map((r) => (
                  <tr key={r.team} className={cx('border-t border-white/[0.06]', r.short === 'CHE' && 'bg-royal/25')}>
                    <td className="px-3 py-3 text-center font-display text-lg">{r.pos}</td>
                    <th scope="row" className={cx('px-3 py-3 text-left font-semibold', r.short === 'CHE' && 'text-royal-300')}>
                      {r.team}
                    </th>
                    {[r.p, r.w, r.d, r.l, r.gf, r.ga].map((v, i) => (
                      <td key={i} className="px-3 py-3 text-center tabular-nums text-ivory/80">
                        {v}
                      </td>
                    ))}
                    <td className="px-3 py-3 text-center tabular-nums text-ivory/80">{r.gf - r.ga > 0 ? `+${r.gf - r.ga}` : r.gf - r.ga}</td>
                    <td className="px-3 py-3 text-center font-display text-lg">{r.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <div className="grid gap-6">
            <Reveal className="surface rounded-[24px] p-6">
              <p className="eyebrow">Form · last five (all competitions)</p>
              <div className="mt-4 flex gap-2">{fixtures && form(fixtures).map((r, i) => <FormDot key={i} r={r} />)}</div>
            </Reveal>
            <Reveal delay={0.1} className="surface rounded-[24px] p-6">
              <p className="eyebrow">Top scorers · all competitions</p>
              <ol className="mt-4 space-y-3">
                {top.slice(0, 6).map(([name, goals], i) => (
                  <li key={name} className="flex items-center gap-3">
                    <span className="w-5 text-right font-display text-lg text-silver">{i + 1}</span>
                    <span className="flex-1">{name}</span>
                    <span className="h-1.5 rounded-full bg-gradient-to-r from-royal to-royal-300" style={{ width: `${goals * 18}px` }} aria-hidden />
                    <span className="w-6 text-right font-display text-xl">{goals}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-silver">Counted from verified match reports. One goal against Bournemouth is unattributed because sources disagree.</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
