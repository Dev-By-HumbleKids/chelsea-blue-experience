import { useInView } from 'framer-motion';
import { lazy, Suspense, useRef } from 'react';
import { Counter, KineticText, MaskReveal } from '@/components/cinema/Kinetic';
import { Magnetic } from '@/components/cinema/Magnetic';
import { Img, LinkButton } from '@/components/ui';
import { HONOURS } from '@/data/honours';
import { usePrefersReducedMotion } from '@/lib/hooks';

const TrophyStage = lazy(() => import('./TrophyStage'));

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

const HIGHLIGHTS = ['champions-league', 'fifa-club-world-cup', 'europa-league', 'conference-league'].map((s) => HONOURS.find((h) => h.slug === s)!);

/** Glory section: a 3D gold trophy you can turn, beside the European and world honours. */
export function CabinetSpotlight() {
  const ref = useRef<HTMLElement>(null);
  const near = useInView(ref, { once: true, margin: '400px 0px' });
  const reduce = usePrefersReducedMotion();
  const webgl = typeof window !== 'undefined' && hasWebGL();

  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-36" aria-labelledby="glory-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,164,92,0.18),transparent_55%)]" aria-hidden />
      <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <MaskReveal>
            <p className="eyebrow mb-5 flex items-center gap-4 text-gold-300">
              <span className="h-px w-12 bg-gold" /> Munich · Porto · New Jersey
            </p>
          </MaskReveal>
          <h2 id="glory-title" className="display text-[15vw] leading-[0.85] sm:text-8xl lg:text-[112px]">
            <KineticText text="Champions" stagger={0.03} />
            <br />
            <KineticText text="of Europe." delay={0.25} stagger={0.03} className="text-royal-300" />
            <br />
            <KineticText text="Of the world." delay={0.5} stagger={0.03} />
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-8">
            {HIGHLIGHTS.map((h) => (
              <li key={h.slug}>
                <Counter to={h.count} duration={1.6} className="block font-display text-6xl leading-none text-gold-sheen" />
                <p className="mt-2 text-sm font-semibold">{h.shortName}</p>
                <p className="text-xs text-silver">{h.seasons.join(' · ')}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Magnetic>
              <LinkButton to="/trophies" variant="gold">
                Enter the Trophy Room
              </LinkButton>
            </Magnetic>
          </div>
        </div>
        <div className="relative h-[460px] sm:h-[600px]" data-cursor={webgl && !reduce ? 'Drag' : undefined}>
          <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-[100px]" aria-hidden />
          {webgl && !reduce ? (
            near && (
              <Suspense fallback={null}>
                <TrophyStage />
              </Suspense>
            )
          ) : (
            <Img id="trophy-ucl" className="h-full w-full rounded-[32px]" />
          )}
          <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.3em] text-silver">Drag to turn · illustrative trophy</p>
        </div>
      </div>
    </section>
  );
}
