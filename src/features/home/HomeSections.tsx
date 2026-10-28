import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Img, LinkButton, ProvenanceTag, Reveal, SectionHeading } from '@/components/ui';
import { HONOURS, MAJOR_HONOUR_SLUGS, MAJOR_TROPHY_COUNT } from '@/data/honours';
import { LEGENDS } from '@/data/legends';
import { NEWS } from '@/data/news';
import { fmtDate } from '@/lib/format';
import { TrophyIcon } from '@/features/heritage/TrophyIcon';
import { TiltCard } from '@/components/TiltCard';

export function Marquee({ text = 'LONDON IS BLUE', className }: { text?: string; className?: string }) {
  const items = Array.from({ length: 8 });
  return (
    <div className={`relative flex overflow-hidden border-y border-white/[0.06] py-5 ${className ?? ''}`} aria-hidden>
      <div className="animate-marquee flex shrink-0 gap-10 whitespace-nowrap pr-10">
        {[...items, ...items].map((_, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-5xl tracking-wide md:text-7xl">
            <span className={i % 2 ? 'stroke-text' : 'text-ivory'}>{text}</span>
            <span className="h-3 w-3 rotate-45 bg-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function ExperienceIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 50]);
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
            ['1905', 'Founded'],
            [String(MAJOR_TROPHY_COUNT), 'Major trophies'],
            ['40,044', 'Capacity'],
          ].map(([v, l]) => (
            <div key={l}>
              <p className="font-display text-4xl text-gold-sheen md:text-5xl">{v}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-silver">{l}</p>
            </div>
          ))}
        </Reveal>
      </div>
      <div className="relative h-[520px] md:h-[640px]">
        <motion.div style={{ y: y1 }} className="absolute right-0 top-0 h-[72%] w-[78%] overflow-hidden rounded-[28px] shadow-2xl ring-1 ring-white/10">
          <Img id="fans-psg-2014" className="h-full w-full" credit />
        </motion.div>
        <motion.div style={{ y: y2 }} className="absolute bottom-0 left-0 h-[48%] w-[52%] overflow-hidden rounded-[28px] shadow-2xl ring-1 ring-white/10">
          <Img id="shed-wall" className="h-full w-full" credit />
        </motion.div>
      </div>
    </section>
  );
}

export function TrophyShowcase() {
  const majors = MAJOR_HONOUR_SLUGS.map((s) => HONOURS.find((h) => h.slug === s)!);
  return (
    <section className="relative overflow-hidden py-24 md:py-36" aria-labelledby="trophy-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,164,92,0.14),transparent_60%)]" aria-hidden />
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="The trophy cabinet"
            title={
              <span id="trophy-title">
                <span className="text-gold-sheen">{MAJOR_TROPHY_COUNT}</span> major honours
              </span>
            }
            intro="Every count and season verified against the club’s official trophy cabinet."
            className="mb-0 md:mb-0"
          />
          <LinkButton to="/trophies" variant="ghost" className="mb-2">
            Enter the Trophy Room
          </LinkButton>
        </div>
        <ul className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-white/[0.06] ring-1 ring-white/[0.06] sm:grid-cols-3 lg:grid-cols-3">
          {majors.map((h, i) => (
            <Reveal key={h.slug} delay={(i % 3) * 0.06}>
              <li className="h-full">
                <Link to={`/trophies/${h.slug}`} className="group relative flex h-full flex-col justify-between gap-8 bg-midnight p-6 transition-colors hover:bg-midnight-800 sm:p-8">
                  <div className="flex items-start justify-between">
                    <TrophyIcon slug={h.slug} className="h-14 w-14 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105 sm:h-16 sm:w-16" />
                    <span className="font-display text-6xl leading-none text-gold-sheen sm:text-7xl">{h.count}</span>
                  </div>
                  <div>
                    <p className="font-display text-2xl tracking-wide sm:text-3xl">{h.shortName}</p>
                    <p className="mt-1 text-xs text-silver">{h.seasons.slice(-3).join(' · ')}</p>
                  </div>
                  <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 text-gold opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function LegendsRail() {
  const featured = LEGENDS.filter((l) => l.image).slice(0, 7);
  return (
    <section className="py-24 md:py-32" aria-labelledby="legends-title">
      <div className="container-x flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Legends of the Blues" title={<span id="legends-title">They made the club</span>} className="mb-0 md:mb-0" />
        <LinkButton to="/legends" variant="ghost" className="mb-2">
          All legends
        </LinkButton>
      </div>
      <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:px-8 lg:px-[max(3rem,calc((100vw-1320px)/2+3rem))]" tabIndex={0} aria-label="Legends carousel — scroll horizontally">
        {featured.map((l) => (
          <TiltCard key={l.slug} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
            <Link to={`/legends/${l.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-[24px] ring-1 ring-white/10">
              <Img id={l.image} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/30 to-transparent" />
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
          <Link to={`/news/${lead.slug}`} className="group block">
            <div className="aspect-[16/10] overflow-hidden rounded-[24px]">
              <Img id={lead.image} className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-silver">
              <span className="font-semibold uppercase tracking-[0.16em] text-gold-300">{lead.category}</span>
              <span>{fmtDate(lead.date + 'T12:00:00Z')}</span>
              <ProvenanceTag kind={lead.kind === 'official' ? 'verified' : 'editorial'}>{lead.kind === 'official' ? 'Official' : 'Reported'}</ProvenanceTag>
            </div>
            <h3 className="mt-3 font-serif text-3xl leading-tight group-hover:text-royal-300 md:text-4xl">{lead.title}</h3>
            <p className="mt-3 text-ivory-muted">{lead.summary}</p>
          </Link>
        </Reveal>
        <ul className="divide-y divide-white/[0.08]">
          {rest.map((n, i) => (
            <Reveal key={n.slug} delay={i * 0.08}>
              <li>
                <Link to={`/news/${n.slug}`} className="group grid grid-cols-[120px_1fr] gap-5 py-5 first:pt-0">
                  <div className="aspect-square overflow-hidden rounded-2xl">
                    <Img id={n.image} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300">{n.category}</p>
                    <h3 className="mt-2 font-serif text-xl leading-snug group-hover:text-royal-300">{n.title}</h3>
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
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.18, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.45], [48, 0]);
  return (
    <section ref={ref} className="relative py-12" aria-labelledby="stadium-teaser-title">
      <motion.div style={{ borderRadius: radius }} className="relative mx-auto h-[86svh] max-w-[1600px] overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0">
          <Img id="ank-08" className="h-full w-full" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-midnight/10" />
        <div className="container-x relative flex h-full flex-col justify-end pb-16">
          <Reveal>
            <p className="eyebrow mb-5 text-gold-300">The Digital Stamford Bridge</p>
            <h2 id="stadium-teaser-title" className="display max-w-4xl text-[13vw] sm:text-8xl lg:text-[120px]">
              Your home. Your history. <span className="text-royal-300">Your Bridge.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg text-ivory/85">Walk the tunnel, stand pitchside and explore a 3D Stamford Bridge — from anywhere in the world.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton to="/stadium">
                Start the virtual tour <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton to="/tickets/tours/stadium-tour" variant="ghost">
                Book a tour (demo)
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
}

export function Closing() {
  return (
    <section className="relative overflow-hidden py-28 text-center md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal/30 blur-[160px]" aria-hidden />
      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow mb-8">Wherever you are</p>
          <h2 className="display mx-auto max-w-5xl text-[12vw] sm:text-7xl lg:text-[112px]">
            No matter where you stand, <span className="text-gold-sheen">the blue runs deep.</span>
          </h2>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <LinkButton to="/tickets">Plan your visit</LinkButton>
            <LinkButton to="/fan-zone" variant="ghost">
              Join the Fan Zone
            </LinkButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
