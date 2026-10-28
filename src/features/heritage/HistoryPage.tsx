import { motion, useScroll, useSpring } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/Toaster';
import { Img, PageHero, Pill, Reveal } from '@/components/ui';
import { HONOURS } from '@/data/honours';
import { ERAS, TIMELINE } from '@/data/timeline';
import type { Era } from '@/data/types';
import { cx } from '@/lib/format';
import { useMeta, useStored } from '@/lib/hooks';
import { getProfile, toggleFavourite } from '@/services/profile';
import { TrophyIcon } from './TrophyIcon';

export default function HistoryPage() {
  useMeta('Club History', 'From the Rising Sun pub in 1905 to champions of the world — an interactive timeline of verified moments.');
  const [era, setEra] = useState<Era | 'All'>('All');
  const profile = useStored(getProfile);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 70%'] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const events = TIMELINE.filter((e) => era === 'All' || e.era === era);

  return (
    <>
      <PageHero eyebrow="Since 1905" title={<>A history written in blue</>} intro="Founded in a pub, champions of the world. Explore the verified moments that shaped the club, era by era." image="shed-wall" />

      <div className="container-x">
        <div className="sticky top-[var(--nav-h)] z-20 -mx-5 flex gap-2 overflow-x-auto bg-midnight/90 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12" role="group" aria-label="Filter by era">
          {(['All', ...ERAS] as const).map((e) => (
            <Pill key={e} active={era === e} onClick={() => setEra(e)}>
              {e === 'All' ? 'All eras' : e}
            </Pill>
          ))}
        </div>

        <div ref={ref} className="relative mt-12">
          <div className="absolute bottom-0 left-[19px] top-0 w-px bg-white/10 md:left-1/2" aria-hidden />
          <motion.div className="absolute left-[19px] top-0 w-px origin-top bg-gradient-to-b from-gold via-royal-300 to-royal md:left-1/2" style={{ scaleY: line, height: '100%' }} aria-hidden />
          <ol className="space-y-16 md:space-y-24">
            {events.map((e, i) => {
              const honour = e.honour ? HONOURS.find((h) => h.slug === e.honour) : undefined;
              const fav = profile.favourites.moments.includes(e.id);
              const left = i % 2 === 0;
              return (
                <li key={e.id} id={e.id} className="relative scroll-mt-40 pl-14 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
                  <span className={cx('absolute left-[12px] top-2 h-4 w-4 rounded-full ring-4 ring-midnight md:left-1/2 md:-translate-x-1/2', e.highlight ? 'bg-gold' : 'bg-royal-300')} aria-hidden />
                  <Reveal className={cx(left ? 'md:col-start-1 md:text-right' : 'md:col-start-2')} y={20}>
                    <p className="font-display text-6xl leading-none text-white/15 md:text-8xl">{e.year}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">{e.date}</p>
                    <h2 className={cx('mt-3 font-display tracking-wide', e.highlight ? 'text-4xl md:text-5xl' : 'text-3xl')}>{e.title}</h2>
                    <p className={cx('mt-3 max-w-lg text-ivory-muted', left && 'md:ml-auto')}>{e.text}</p>
                    <div className={cx('mt-4 flex flex-wrap items-center gap-3', left && 'md:justify-end')}>
                      {honour && (
                        <Link to={`/trophies/${honour.slug}`} className="inline-flex items-center gap-2 rounded-full bg-gold/10 py-1 pl-1 pr-3 text-xs font-semibold text-gold-300 ring-1 ring-gold/30 hover:bg-gold/20">
                          <TrophyIcon slug={honour.slug} className="h-6 w-6" /> {honour.shortName}
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => toast(toggleFavourite('moments', e.id) ? 'Moment saved to your profile' : 'Moment removed')}
                        aria-pressed={fav}
                        className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ring-1', fav ? 'bg-rose-400/15 text-rose-300 ring-rose-300/30' : 'text-silver ring-white/15 hover:text-ivory')}
                      >
                        <Heart className="h-3.5 w-3.5" fill={fav ? 'currentColor' : 'none'} /> {fav ? 'Saved' : 'Save moment'}
                      </button>
                    </div>
                  </Reveal>
                  {e.image && (
                    <Reveal className={cx('mt-6 md:mt-0', left ? 'md:col-start-2 md:row-start-1' : 'md:col-start-1 md:row-start-1')} delay={0.1}>
                      <div className="aspect-[4/3] overflow-hidden rounded-[24px] ring-1 ring-white/10">
                        <Img id={e.image} credit className="h-full w-full" />
                      </div>
                    </Reveal>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
        <p className="mt-16 text-xs text-silver">
          Sources: chelseafc.com/en/history, UEFA.com, FIFA.com and Wikipedia’s Chelsea F.C. history articles. Dates are given where they could be verified; month-only dates mark events without a single agreed day.
        </p>
      </div>
    </>
  );
}
