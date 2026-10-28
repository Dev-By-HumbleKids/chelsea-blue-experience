import { ArrowDownLeft, ArrowUpRight, Repeat } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TiltCard } from '@/components/TiltCard';
import { Img, PageHero, Pill, ProvenanceTag, Reveal, SectionHeading, Sources } from '@/components/ui';
import { WOMEN_HONOURS } from '@/data/honours';
import { TRANSFER_SUMMARY, TRANSFERS } from '@/data/season';
import { MANAGER, POSITIONS, SQUAD, SQUAD_UPDATED } from '@/data/squad';
import type { Position, SquadPlayer } from '@/data/types';
import { cx, fmtDate } from '@/lib/format';
import { useMeta } from '@/lib/hooks';

export function PlayerCard({ p }: { p: SquadPlayer }) {
  return (
    <TiltCard max={6}>
      <Link to={`/squad/${p.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-[24px] bg-gradient-to-br from-royal-600 via-royal-700 to-midnight-800 ring-1 ring-white/10">
        {p.image ? (
          <>
            <Img id={p.image} className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/20 to-transparent" />
          </>
        ) : (
          <>
            <span className="absolute -right-4 -top-6 select-none font-display text-[200px] leading-none text-white/[0.07] transition-transform duration-700 group-hover:-translate-y-2">{p.number}</span>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(91,143,214,0.35),transparent_60%)]" />
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-display text-5xl leading-none text-gold-300">{p.number}</p>
          <p className="mt-2 font-display text-[28px] leading-[0.95] tracking-wide">{p.name}</p>
          <p className="mt-2 text-xs text-ivory/70">
            {p.role} · {p.nationality}
          </p>
          {p.captain && <span className="mt-3 inline-block rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-midnight">Captain</span>}
        </div>
      </Link>
    </TiltCard>
  );
}

const dirIcon = { in: ArrowDownLeft, out: ArrowUpRight, 'loan-out': Repeat };

export default function SquadPage() {
  useMeta('Squad', 'The 2026/27 men’s first-team squad, transfers and Chelsea Women honours.');
  const [pos, setPos] = useState<Position | 'All'>('All');
  const [dir, setDir] = useState<'in' | 'out' | 'loan-out'>('in');
  const players = SQUAD.filter((p) => pos === 'All' || p.position === pos);

  return (
    <>
      <PageHero eyebrow="Men’s first team · 2026/27" title="The Squad" intro="The players carrying the badge this season. Squad numbers and appearances come from a dated snapshot." image="inside-peterborough">
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ProvenanceTag kind="snapshot">Squad list {fmtDate(SQUAD_UPDATED + 'T12:00:00Z', { day: 'numeric', month: 'long', year: 'numeric' })}</ProvenanceTag>
        </div>
      </PageHero>

      <section className="container-x">
        <Reveal className="mb-12 grid items-center gap-6 rounded-[28px] bg-gradient-to-r from-royal-700 to-midnight-800 p-6 ring-1 ring-white/10 sm:grid-cols-[auto_1fr] sm:p-8">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-gold font-display text-3xl text-midnight">XA</span>
          <div>
            <p className="eyebrow">Manager</p>
            <p className="mt-1 font-display text-4xl tracking-wide">{MANAGER.name}</p>
            <p className="text-sm text-ivory/75">
              Appointed {fmtDate(MANAGER.appointed + 'T12:00:00Z', { day: 'numeric', month: 'long', year: 'numeric' })}. {MANAGER.note}
            </p>
          </div>
        </Reveal>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by position">
          {(['All', ...POSITIONS] as const).map((p) => (
            <Pill key={p} active={pos === p} onClick={() => setPos(p)}>
              {p === 'All' ? 'All players' : p + 's'}
            </Pill>
          ))}
        </div>

        {(pos === 'All' ? POSITIONS : [pos]).map((group) => (
          <div key={group} className="mb-14">
            <h2 className="mb-6 flex items-center gap-4 font-display text-3xl tracking-wide">
              {group}s<span className="h-px flex-1 bg-white/10" />
            </h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {players
                .filter((p) => p.position === group)
                .sort((a, b) => a.number - b.number)
                .map((p, i) => (
                  <Reveal key={p.slug} delay={(i % 5) * 0.04}>
                    <li>
                      <PlayerCard p={p} />
                    </li>
                  </Reveal>
                ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="container-x pt-16" aria-labelledby="transfers-title">
        <SectionHeading eyebrow={TRANSFER_SUMMARY.window} title={<span id="transfers-title">Transfers</span>} intro={`Spending ${TRANSFER_SUMMARY.spend} · income ${TRANSFER_SUMMARY.income}. Only officially completed deals are listed — no rumours.`} />
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {(
            [
              ['in', 'Arrivals'],
              ['out', 'Departures'],
              ['loan-out', 'Loans out'],
            ] as const
          ).map(([d, label]) => (
            <Pill key={d} active={dir === d} onClick={() => setDir(d)}>
              {label}
            </Pill>
          ))}
        </div>
        <ul className="grid gap-px overflow-hidden rounded-[24px] bg-white/[0.06] ring-1 ring-white/[0.06] md:grid-cols-2">
          {TRANSFERS.filter((t) => t.direction === dir).map((t) => {
            const Icon = dirIcon[t.direction];
            return (
              <li key={t.player} className="flex items-center gap-4 bg-midnight p-5">
                <span className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-full', t.direction === 'in' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/[0.06] text-silver')}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {t.player} <span className="text-xs font-normal text-silver">{t.position}</span>
                  </p>
                  <p className="truncate text-xs text-silver">
                    {t.direction === 'in' ? 'from' : 'to'} {t.club}
                    {t.date && ` · ${fmtDate(t.date + 'T12:00:00Z', { day: 'numeric', month: 'short' })}`}
                  </p>
                </div>
                <span className="shrink-0 text-right text-sm text-gold-300">{t.fee}</span>
              </li>
            );
          })}
        </ul>
        <Sources sources={[TRANSFER_SUMMARY.source]} className="mt-6" />
      </section>

      <section className="container-x pt-24" aria-labelledby="women-title">
        <Reveal className="relative overflow-hidden rounded-[28px] ring-1 ring-white/10">
          <Img id="fans-psg-2014" className="absolute inset-0 h-full w-full opacity-30" />
          <div className="relative grid gap-10 bg-gradient-to-r from-midnight via-midnight/90 to-midnight/60 p-8 md:grid-cols-[1fr_1.2fr] md:p-12">
            <div>
              <p className="eyebrow">Chelsea Women</p>
              <h2 id="women-title" className="display mt-3 text-6xl">
                Serial winners
              </h2>
              <p className="mt-4 text-ivory-muted">{WOMEN_HONOURS.note}</p>
              <Sources sources={WOMEN_HONOURS.sources} className="mt-4" />
            </div>
            <ul className="grid gap-4 sm:grid-cols-3">
              {WOMEN_HONOURS.items.map((h) => (
                <li key={h.name} className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
                  <p className="font-display text-6xl text-gold-sheen">{h.count}</p>
                  <p className="mt-1 font-semibold">{h.name}</p>
                  <p className="mt-2 text-xs text-silver">{h.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </>
  );
}
