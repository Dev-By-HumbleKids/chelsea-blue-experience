import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Heart } from 'lucide-react';
import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from '@/components/Toaster';
import { Button, EmptyState, Img, LinkButton, ProvenanceTag, Reveal, Sources } from '@/components/ui';
import { HONOURS } from '@/data/honours';
import { LEGEND_STAT_NOTE, legendBySlug } from '@/data/legends';
import { num } from '@/lib/format';
import { useMeta, useStored } from '@/lib/hooks';
import { getProfile, toggleFavourite } from '@/services/profile';
import { TrophyIcon } from './TrophyIcon';

export default function LegendPage() {
  const { slug = '' } = useParams();
  const l = legendBySlug(slug);
  const profile = useStored(getProfile);
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  useMeta(l ? l.name : 'Legend not found', l?.headline);

  if (!l) {
    return (
      <div className="container-x pt-40">
        <EmptyState level="h1" title="Legend not found" action={<LinkButton to="/legends">All legends</LinkButton>} />
      </div>
    );
  }
  const fav = profile.favourites.legends.includes(l.slug);
  const stats = [
    l.appearances !== undefined && ['Appearances', l.appearances],
    l.goals !== undefined && ['Goals', l.goals],
    l.cleanSheets !== undefined && ['Clean sheets', l.cleanSheets],
  ].filter(Boolean) as [string, number][];

  return (
    <article>
      <header ref={hero} className="relative isolate min-h-[88svh] overflow-hidden pt-[calc(var(--nav-h)+40px)]">
        {l.image && (
          <motion.div style={{ y: imgY }} className="absolute inset-y-0 right-0 -z-10 w-full md:w-[55%]">
            <Img id={l.image} eager credit className="h-full w-full opacity-70 md:opacity-100" />
          </motion.div>
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/85 to-midnight/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-midnight via-transparent to-transparent" />
        <div className="container-x flex min-h-[calc(88svh-var(--nav-h)-40px)] flex-col justify-end pb-16">
          <Link to="/legends" className="mb-auto inline-flex w-fit items-center gap-2 text-sm text-silver hover:text-ivory">
            <ArrowLeft className="h-4 w-4" /> Legends
          </Link>
          <Reveal>
            <p className="eyebrow text-gold-300">
              {l.position} · {l.years}
            </p>
            <h1 className="display mt-3 max-w-3xl text-7xl sm:text-9xl">{l.name}</h1>
            <p className="mt-5 max-w-xl font-serif text-2xl italic text-ivory/85">{l.headline}</p>
            <div className="mt-8 flex flex-wrap items-end gap-10">
              {stats.map(([label, v]) => (
                <div key={label}>
                  <p className="font-display text-6xl leading-none text-gold-sheen">{num(v)}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-silver">{label}</p>
                </div>
              ))}
              <Button
                variant={fav ? 'gold' : 'ghost'}
                aria-pressed={fav}
                onClick={() => toast(toggleFavourite('legends', l.slug) ? `${l.name} saved to your favourites` : 'Removed from favourites')}
              >
                <Heart className="h-4 w-4" fill={fav ? 'currentColor' : 'none'} /> {fav ? 'Saved' : 'Save legend'}
              </Button>
            </div>
          </Reveal>
        </div>
      </header>

      <div className="container-x grid gap-14 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="eyebrow mb-6">The story</h2>
          <div className="space-y-6 font-serif text-xl leading-relaxed text-ivory/90 md:text-2xl">
            {l.story.map((p, i) => (
              <Reveal key={i}>
                <p className={i === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-gold-300' : ''}>{p}</p>
              </Reveal>
            ))}
          </div>

          <h2 className="eyebrow mb-6 mt-16">Defining moments</h2>
          <ol className="relative space-y-8 border-l border-white/10 pl-8">
            {l.moments.map((m) => (
              <Reveal key={m.year + m.text}>
                <li className="relative">
                  <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full bg-gold ring-4 ring-midnight" aria-hidden />
                  <p className="font-display text-3xl text-gold-300">{m.year}</p>
                  <p className="text-lg text-ivory/85">{m.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <aside className="space-y-6">
          <div className="surface rounded-[24px] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="eyebrow">Key achievements</h2>
              <ProvenanceTag kind="verified" />
            </div>
            <ul className="space-y-3">
              {l.achievements.map((a) => (
                <li key={a} className="flex gap-3 text-sm">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface rounded-[24px] p-6">
            <h2 className="eyebrow mb-4">Trophy connections</h2>
            <ul className="grid grid-cols-2 gap-3">
              {l.honours.map((s) => {
                const h = HONOURS.find((x) => x.slug === s);
                if (!h) return null;
                return (
                  <li key={s}>
                    <Link to={`/trophies/${s}`} className="flex items-center gap-2 rounded-xl bg-white/[0.04] p-3 text-xs font-semibold ring-1 ring-white/10 hover:ring-gold/40">
                      <TrophyIcon slug={s} className="h-8 w-8 shrink-0" /> {h.shortName}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          {l.related.length > 0 && (
            <div className="surface rounded-[24px] p-6">
              <h2 className="eyebrow mb-4">Related legends</h2>
              <ul className="space-y-2">
                {l.related.map((r) => {
                  const rl = legendBySlug(r);
                  return rl ? (
                    <li key={r}>
                      <Link to={`/legends/${r}`} className="link-underline font-display text-2xl hover:text-royal-300">
                        {rl.name}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          )}
          <p className="text-xs text-silver">{LEGEND_STAT_NOTE}</p>
          <Sources sources={l.sources} />
        </aside>
      </div>
    </article>
  );
}
