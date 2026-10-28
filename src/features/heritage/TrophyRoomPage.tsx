import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHero, Pill, Reveal, Sources } from '@/components/ui';
import { HONOURS, MAJOR_TROPHY_COUNT } from '@/data/honours';
import type { HonourCategory } from '@/data/types';
import { useMeta } from '@/lib/hooks';
import { TrophyArt } from './TrophyIcon';

const ERA_FILTERS = [
  { id: 'all', label: 'All eras', from: 0, to: 9999 },
  { id: 'pre', label: 'Before 2003', from: 0, to: 2002 },
  { id: 'golden', label: '2003–2022', from: 2003, to: 2022 },
  { id: 'new', label: '2022–', from: 2022, to: 9999 },
] as const;

const startYear = (season: string) => parseInt(season.slice(0, 4), 10);

export default function TrophyRoomPage() {
  useMeta('Trophy Room', 'Every major Chelsea honour — competition, count and winning seasons, verified.');
  const [cat, setCat] = useState<HonourCategory | 'All'>('All');
  const [era, setEra] = useState<(typeof ERA_FILTERS)[number]['id']>('all');

  const items = useMemo(() => {
    const e = ERA_FILTERS.find((x) => x.id === era)!;
    return HONOURS.filter((h) => cat === 'All' || h.category === cat)
      .map((h) => ({ ...h, inEra: h.seasons.filter((s) => startYear(s) >= e.from && startYear(s) <= e.to) }))
      .filter((h) => h.inEra.length > 0);
  }, [cat, era]);

  return (
    <>
      <PageHero
        eyebrow="The digital museum"
        title={
          <>
            The Trophy <span className="text-gold-sheen">Room</span>
          </>
        }
        intro={`${MAJOR_TROPHY_COUNT} major honours across England, Europe and the world. Choose a trophy to relive the final.`}
        image="ank-24"
      />
      <section className="container-x">
        <div className="mb-10 flex flex-col gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by competition type">
            {(['All', 'European', 'Worldwide', 'Domestic League', 'Domestic Cup'] as const).map((c) => (
              <Pill key={c} active={cat === c} onClick={() => setCat(c)}>
                {c}
              </Pill>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by era">
            {ERA_FILTERS.map((e) => (
              <Pill key={e.id} active={era === e.id} onClick={() => setEra(e.id)}>
                {e.label}
              </Pill>
            ))}
          </div>
        </div>

        <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((h, i) => (
            <motion.li layout key={h.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Link
                to={`/trophies/${h.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-gradient-to-b from-midnight-700 to-midnight-800 p-8 ring-1 ring-white/[0.08] transition-shadow hover:shadow-[0_30px_80px_-30px_rgba(201,164,92,0.45)] hover:ring-gold/40"
              >
                <div className="relative -mx-8 -mt-8 mb-2 aspect-[4/3] overflow-hidden">
                  <TrophyArt slug={h.slug} image={h.image} className="h-full w-full transition-transform duration-700 group-hover:scale-105" iconClassName="h-32 w-32" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-800 via-transparent to-transparent" />
                </div>
                <div className="relative mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-silver">{h.category}</p>
                    <h2 className="mt-1 font-display text-3xl leading-none tracking-wide">{h.name}</h2>
                  </div>
                  <span className="font-display text-6xl leading-none text-gold-sheen">{era === 'all' ? h.count : h.inEra.length}</span>
                </div>
                <p className="relative mt-4 text-xs leading-relaxed text-silver">{h.inEra.join(' · ')}</p>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
        <Reveal className="mt-12">
          <Sources sources={HONOURS[0].sources} />
        </Reveal>
      </section>
    </>
  );
}
