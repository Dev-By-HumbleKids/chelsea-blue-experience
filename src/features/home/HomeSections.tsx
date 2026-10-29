import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipReveal, Counter, KineticText, MaskReveal, WordReveal } from '@/components/cinema/Kinetic';
import { Magnetic } from '@/components/cinema/Magnetic';
import { DustField } from '@/components/cinema/DustField';
import { TiltCard } from '@/components/TiltCard';
import { Img, LinkButton, ProvenanceTag, Reveal, SectionHeading } from '@/components/ui';
import { HONOURS, MAJOR_HONOUR_SLUGS, MAJOR_TROPHY_COUNT } from '@/data/honours';
import { LEGENDS } from '@/data/legends';
import { NEWS } from '@/data/news';
import { TrophyArt } from '@/features/heritage/TrophyIcon';
import { fmtDate } from '@/lib/format';
import { usePrefersReducedMotion } from '@/lib/hooks';

export { VelocityMarquee as Marquee } from '@/components/cinema/VelocityMarquee';

/** A big serif statement whose words light up as it scrolls through the viewport. */
export function Manifesto() {
  return (
    <section className="container-x relative py-28 md:py-40" aria-label="Our story">
      <div className="light-leak light-leak-a left-[20%] top-[10%] h-72 w-72 bg-royal-400/40" />
      <p className="eyebrow mb-10 flex items-center gap-4">
        <span className="h-px w-12 bg-gold" /> The story so far
      </p>
      <WordReveal
        className="max-w-6xl font-serif text-[34px] font-light leading-[1.15] sm:text-5xl lg:text-[68px]"
        highlight={['blue', 'munich', 'porto', 'world.']}
        text="Born in a Fulham Road pub in 1905. Champions of England six times. Kings of Europe in Munich and Porto. Champions of the world. Every matchday, forty thousand voices remind London that its heart is blue."
      />
    </section>
  );
}

export function ExperienceIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 70]);
  const rot = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  return (
    <section ref={ref} className="container-x grid items-center gap-14 py-24 md:py-36 lg:grid-cols-2">
      <div>
        <SectionHeading
          eyebrow="The Chelsea experience"
          title={
            <>
              Built on <span className="text-royal-300">Fulham Road.</span> Known around the world.
            </>
          }
        />
        <Reveal className="space-y-5 text-lg text-ivory-muted">
          <p>
            In 1905 Gus Mears owned a stadium but had no club to play in it. So he founded one. More than a century later, the club born in the Rising Sun pub has been champions of England six times, of Europe twice and of the world twice.
          </p>
          <p>This is a place to walk the tunnel, relive the nights in Munich and Porto, meet the legends who built it and follow the team that carries it on.</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 grid grid-cols-3 gap-6 border-t border-white/[0.08] pt-8">
          {[
            [1905, 'Founded', (n: number) => String(Math.round(n))],
            [MAJOR_TROPHY_COUNT, 'Major trophies', undefined],
            [40044, 'Capacity', undefined],
          ].map(([v, l, f]) => (
            <div key={l as string}>
              <Counter to={v as number} format={f as ((n: number) => string) | undefined} className="block font-display text-4xl text-gold-sheen md:text-6xl" />
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-silver">{l as string}</p>
            </div>
          ))}
        </Reveal>
      </div>
      <div className="relative h-[520px] md:h-[660px]">
        <motion.div style={{ y: y1, rotate: rot }} className="absolute right-0 top-0 h-[72%] w-[78%] shadow-2xl">
          <ClipReveal className="h-full w-full rounded-[28px] ring-1 ring-white/10">
            <Img id="fans-psg-2014" className="h-full w-full" credit />
          </ClipReveal>
        </motion.div>
        <motion.div style={{ y: y2 }} className="absolute bottom-0 left-0 h-[48%] w-[52%] shadow-2xl">
          <ClipReveal className="h-full w-full rounded-[28px] ring-1 ring-white/10" delay={0.2}>
            <Img id="shed-wall" className="h-full w-full" credit />
          </ClipReveal>
        </motion.div>
        <motion.div style={{ y: y2 }} className="absolute bottom-[8%] right-[6%] rounded-2xl bg-midnight/80 px-5 py-4 shadow-2xl ring-1 ring-gold/30 backdrop-blur-md">
          <p className="font-display text-4xl leading-none text-gold-sheen">Est. 1905</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-silver">The Rising Sun, Fulham Road</p>
        </motion.div>
      </div>
    </section>
  );
}

function TrophySlide({ slug, index, total }: { slug: string; index: number; total: number }) {
  const h = HONOURS.find((x) => x.slug === slug)!;
  return (
    <Link
      to={`/trophies/${h.slug}`}
      data-cursor="View"
      className="group relative flex h-[64vh] w-[78vw] shrink-0 flex-col justify-end overflow-hidden rounded-[32px] ring-1 ring-white/10 sm:w-[46vw] lg:w-[30vw]"
    >
      <TrophyArt slug={h.slug} image={h.image} className="absolute inset-0 h-full w-full transition-transform duration-[1.4s] ease-out group-hover:scale-110" iconClassName="h-40 w-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,164,92,0.25),transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      <span className="absolute left-6 top-6 font-display text-sm tracking-[0.3em] text-ivory/60">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
      <div className="relative p-7">
        <p className="font-display text-[110px] leading-[0.8] text-gold-sheen drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]">{h.count}</p>
        <p className="mt-3 font-display text-4xl leading-none tracking-wide">{h.name}</p>
        <p className="mt-2 text-sm text-ivory/70">{h.seasons.join(' · ')}</p>
      </div>
      <ArrowUpRight className="absolute right-6 top-6 h-5 w-5 text-gold transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}

/** Pinned horizontal gallery: vertical scrolling slides the trophy cabinet sideways. */
export function TrophyShowcase() {
  const reduce = usePrefersReducedMotion();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useLayoutEffect(() => {
    const measure = () => {
      const t = track.current;
      if (t) setDistance(Math.max(0, t.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const heading = (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="eyebrow mb-4">The trophy cabinet</p>
        <h2 id="trophy-title" className="display text-[44px] sm:text-6xl lg:text-7xl">
          <span className="text-gold-sheen">{MAJOR_TROPHY_COUNT}</span> major honours
        </h2>
      </div>
      <LinkButton to="/trophies" variant="ghost">
        Enter the Trophy Room
      </LinkButton>
    </div>
  );

  if (reduce) {
    return (
      <section className="container-x py-24" aria-labelledby="trophy-title">
        {heading}
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MAJOR_HONOUR_SLUGS.map((s, i) => (
            <li key={s}>
              <TrophySlide slug={s} index={i} total={MAJOR_HONOUR_SLUGS.length} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section ref={section} className="relative" style={{ height: `calc(100vh + ${distance}px)` }} aria-labelledby="trophy-title">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,164,92,0.16),transparent_60%)]" aria-hidden />
        <div className="container-x relative mb-8 pt-[var(--nav-h)]">{heading}</div>
        <motion.div ref={track} className="flex gap-6 pl-5 pr-[10vw] sm:pl-8 lg:pl-[max(3rem,calc((100vw-1320px)/2+3rem))]" style={{ x }}>
          {MAJOR_HONOUR_SLUGS.map((s, i) => (
            <TrophySlide key={s} slug={s} index={i} total={MAJOR_HONOUR_SLUGS.length} />
          ))}
        </motion.div>
        <div className="container-x mt-8">
          <div className="h-px w-full bg-white/10">
            <motion.div className="h-px origin-left bg-gold" style={{ scaleX: bar }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function LegendsRail() {
  const featured = LEGENDS.filter((l) => l.image).slice(0, 9);
  return (
    <section className="py-24 md:py-32" aria-labelledby="legends-title">
      <div className="container-x flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Legends of the Blues" title={<span id="legends-title">They made the club</span>} className="mb-0 md:mb-0" />
        <LinkButton to="/legends" variant="ghost" className="mb-2">
          All legends
        </LinkButton>
      </div>
      <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:px-8 lg:px-[max(3rem,calc((100vw-1320px)/2+3rem))]" tabIndex={0} aria-label="Legends carousel — scroll horizontally">
        {featured.map((l, i) => (
          <motion.div
            key={l.slug}
            className="shrink-0 snap-start"
            initial={{ opacity: 0, y: 60, rotate: 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-5% 0px' }}
            transition={{ duration: 0.9, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <TiltCard className="w-[280px] sm:w-[320px]">
              <Link to={`/legends/${l.slug}`} data-cursor="View" className="group relative block aspect-[3/4] overflow-hidden rounded-[24px] ring-1 ring-white/10">
                <Img id={l.image} className="h-full w-full grayscale-[60%] transition-[transform,filter] duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/30 to-transparent" />
                <span className="absolute right-5 top-4 font-display text-6xl text-white/10">{String(i + 1).padStart(2, '0')}</span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                    {l.position} · {l.years}
                  </p>
                  <p className="mt-2 font-display text-4xl leading-none">{l.name}</p>
                  <p className="mt-3 line-clamp-2 text-sm text-ivory/80">{l.headline}</p>
                  {(l.goals ?? l.cleanSheets) !== undefined && (
                    <p className="mt-4 flex gap-5 text-xs text-silver">
                      {l.appearances && (
                        <span>
                          <strong className="font-display text-xl text-ivory">{l.appearances}</strong> apps
                        </span>
                      )}
                      {l.goals !== undefined && (
                        <span>
                          <strong className="font-display text-xl text-ivory">{l.goals}</strong> goals
                        </span>
                      )}
                      {l.cleanSheets !== undefined && (
                        <span>
                          <strong className="font-display text-xl text-ivory">{l.cleanSheets}</strong> clean sheets
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </Link>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function LatestNews() {
  const [lead, ...rest] = NEWS.slice(0, 4);
  return (
    <section className="container-x py-24 md:py-32" aria-labelledby="news-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Newsroom" title={<span id="news-title">Latest from the Bridge</span>} className="mb-0 md:mb-0" />
        <LinkButton to="/news" variant="ghost" className="mb-2">
          All news
        </LinkButton>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <Link to={`/news/${lead.slug}`} data-cursor="Read" className="group block">
            <ClipReveal className="aspect-[16/10] rounded-[24px]">
              <Img id={lead.image} className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]" />
            </ClipReveal>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-silver">
              <span className="font-semibold uppercase tracking-[0.16em] text-gold-300">{lead.category}</span>
              <span>{fmtDate(lead.date + 'T12:00:00Z')}</span>
              <ProvenanceTag kind={lead.kind === 'official' ? 'verified' : 'editorial'}>{lead.kind === 'official' ? 'Official' : 'Reported'}</ProvenanceTag>
            </div>
            <h3 className="mt-3 font-serif text-3xl leading-tight transition-colors group-hover:text-royal-300 md:text-4xl">{lead.title}</h3>
            <p className="mt-3 text-ivory-muted">{lead.summary}</p>
          </Link>
        </Reveal>
        <ul className="divide-y divide-white/[0.08]">
          {rest.map((n, i) => (
            <Reveal key={n.slug} delay={i * 0.08}>
              <li>
                <Link to={`/news/${n.slug}`} data-cursor="Read" className="group grid grid-cols-[120px_1fr] gap-5 py-5 first:pt-0">
                  <div className="aspect-square overflow-hidden rounded-2xl">
                    <Img id={n.image} className="h-full w-full transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300">{n.category}</p>
                    <h3 className="mt-2 font-serif text-xl leading-snug transition-colors group-hover:text-royal-300">{n.title}</h3>
                    <p className="mt-2 text-xs text-silver">{fmtDate(n.date + 'T12:00:00Z')}</p>
                  </div>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function StadiumTeaser() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.3, 1]);
  const inset = useTransform(scrollYProgress, [0, 0.42], ['inset(8% 6% 8% 6% round 48px)', 'inset(0% 0% 0% 0% round 0px)']);
  const textY = useTransform(scrollYProgress, [0.2, 0.6], [120, 0]);
  return (
    <section ref={ref} className="relative py-12" aria-labelledby="stadium-teaser-title">
      <motion.div style={{ clipPath: inset }} className="relative mx-auto h-[92svh] max-w-[1800px] overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0">
          <Img id="ank-08" className="h-full w-full" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-midnight/10" />
        <div className="lens-streak pointer-events-none absolute left-0 right-0 top-[22%] h-[2px]" />
        <DustField count={60} />
        <motion.div style={{ y: textY }} className="container-x relative flex h-full flex-col justify-end pb-16">
          <p className="eyebrow mb-5 flex items-center gap-4 text-gold-300">
            <span className="h-px w-12 bg-gold" /> The Digital Stamford Bridge
          </p>
          <h2 id="stadium-teaser-title" className="display max-w-5xl text-[13vw] sm:text-8xl lg:text-[128px]">
            <KineticText text="Your home." stagger={0.025} /> <KineticText text="Your history." delay={0.25} stagger={0.025} /> <KineticText text="Your Bridge." delay={0.55} stagger={0.025} className="text-royal-300" />
          </h2>
          <p className="mt-6 max-w-xl text-lg text-ivory/85">Walk the tunnel, stand pitchside and explore a 3D Stamford Bridge — from anywhere in the world.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <LinkButton to="/stadium">
                Start the virtual tour <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </Magnetic>
            <LinkButton to="/tickets/tours/stadium-tour" variant="ghost">
              Book a tour (demo)
            </LinkButton>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function Closing() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const orb = useTransform(scrollYProgress, [0, 1], [0.6, 1.25]);
  return (
    <section ref={ref} className="relative overflow-hidden py-32 text-center md:py-48">
      <motion.div style={{ scale: orb }} className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[960px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal/35 blur-[160px]" aria-hidden />
      <div className="light-leak light-leak-b right-[10%] top-[20%] h-80 w-80 bg-gold/30" />
      <DustField count={50} />
      <div className="container-x relative">
        <MaskReveal>
          <p className="eyebrow mb-8">Wherever you are</p>
        </MaskReveal>
        <h2 className="display mx-auto max-w-5xl text-[12vw] sm:text-7xl lg:text-[120px]">
          <KineticText text="No matter where you stand," stagger={0.02} /> <KineticText text="the blue runs deep." delay={0.5} stagger={0.03} className="text-gold-sheen" />
        </h2>
        <Reveal delay={0.4} className="mt-12 flex flex-wrap justify-center gap-3">
          <Magnetic>
            <LinkButton to="/tickets">Plan your visit</LinkButton>
          </Magnetic>
          <Magnetic>
            <LinkButton to="/fan-zone" variant="ghost">
              Join the Fan Zone
            </LinkButton>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
