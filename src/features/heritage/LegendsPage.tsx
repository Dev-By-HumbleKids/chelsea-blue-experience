import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TiltCard } from '@/components/TiltCard';
import { Img, PageHero, Pill, Reveal } from '@/components/ui';
import { LEGEND_STAT_NOTE, LEGENDS } from '@/data/legends';
import { useMeta } from '@/lib/hooks';

const ERAS = ['All', 'First Glory', 'Cups & Kings', 'The Golden Era'] as const;

export default function LegendsPage() {
  useMeta('Legends', 'The players who built Chelsea — careers, verified achievements and defining moments.');
  const [era, setEra] = useState<(typeof ERAS)[number]>('All');
  const list = LEGENDS.filter((l) => era === 'All' || l.era === era);

  return (
    <>
      <PageHero eyebrow="Legends of the Blues" title={<>They wore it. They won it. They made it.</>} intro="Captains, goalscorers and match-winners from every era. These are historical players, not members of the current squad." image="osgood-statue" />
      <section className="container-x">
        <div className="mb-10 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter legends by era">
          {ERAS.map((e) => (
            <Pill key={e} active={era === e} onClick={() => setEra(e)}>
              {e === 'All' ? 'Every era' : e}
            </Pill>
          ))}
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((l, i) => (
            <Reveal key={l.slug} delay={(i % 3) * 0.06}>
              <li>
                <TiltCard max={5}>
                  <Link to={`/legends/${l.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[24px] bg-gradient-to-br from-royal-600 via-royal-700 to-midnight-800 ring-1 ring-white/10">
                    {l.image ? (
                      <Img id={l.image} className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center font-display text-[180px] leading-none text-white/[0.06]">
                        {l.name
                          .split(' ')
                          .map((w) => w[0])
                          .join('')}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                        {l.era} · {l.years}
                      </p>
                      <h2 className="mt-2 font-display text-4xl leading-none">{l.name}</h2>
                      <p className="mt-1 text-sm text-ivory/70">{l.position}</p>
                      <p className="mt-3 line-clamp-2 text-sm text-ivory/85">{l.headline}</p>
                    </div>
                  </Link>
                </TiltCard>
              </li>
            </Reveal>
          ))}
        </ul>
        <p className="mt-10 text-xs text-silver">{LEGEND_STAT_NOTE}</p>
      </section>
    </>
  );
}
