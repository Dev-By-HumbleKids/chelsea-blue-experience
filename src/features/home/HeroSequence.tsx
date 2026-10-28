import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Img, LinkButton } from '@/components/ui';
import { usePrefersReducedMotion } from '@/lib/hooks';

/**
 * Scroll-driven cinematic hero. Frame source, in order of preference:
 *   1. An image sequence in /public/frames (manifest.json) — e.g. extracted from a video with
 *      `npm run frames -- path/to/video.mp4`. Dropping frames in switches the hero over; no code change.
 *   2. A live, scroll-scrubbed fly-through of the procedural 3D stadium (WebGL).
 *   3. A static photograph (reduced motion, or no WebGL).
 */

const LiveFlythrough = lazy(() => import('./LiveFlythrough'));

export interface FrameManifest {
  count: number;
  /** File name pattern, `{i}` is replaced with the zero-padded index (1-based). */
  pattern: string;
  pad: number;
  width: number;
  height: number;
}

type Source = 'checking' | 'frames' | 'live' | 'static';

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function FrameCanvas({ manifest, progress }: { manifest: FrameManifest; progress: MotionValue<number> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const current = useRef(-1);

  const draw = (index: number) => {
    const c = canvas.current;
    if (!c) return;
    // Use the nearest frame that has finished loading.
    let i = index;
    while (i >= 0 && !images.current[i]?.complete) i--;
    const img = images.current[i];
    if (!img || !img.naturalWidth) return;
    const ctx = c.getContext('2d')!;
    const scale = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
    current.current = index;
  };

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    const list: HTMLImageElement[] = [];
    for (let i = 1; i <= manifest.count; i++) {
      const img = new Image();
      img.decoding = 'async';
      // Load key frames first so scrubbing works before everything arrives.
      const delay = i % 8 === 1 ? 0 : 250;
      setTimeout(() => {
        img.src = `${base}frames/${manifest.pattern.replace('{i}', String(i).padStart(manifest.pad, '0'))}`;
      }, delay);
      if (i === 1) img.onload = () => draw(Math.max(0, current.current));
      list.push(img);
    }
    images.current = list;
    const resize = () => {
      const c = canvas.current;
      if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      draw(Math.max(0, current.current));
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
     
  }, [manifest]);

  useMotionValueEvent(progress, 'change', (p) => {
    const index = Math.min(manifest.count - 1, Math.max(0, Math.round(p * (manifest.count - 1))));
    if (index !== current.current) requestAnimationFrame(() => draw(index));
  });

  return <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />;
}

function Chapter({ progress, range, children, className }: { progress: MotionValue<number>; range: [number, number, number, number]; children: React.ReactNode; className?: string }) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, [range[0], range[1], range[2], range[3]], [40, 0, 0, -40]);
  const pointer = useTransform(opacity, (o) => (o > 0.5 ? 'auto' : 'none'));
  return (
    <motion.div style={{ opacity, y, pointerEvents: pointer }} className={className}>
      {children}
    </motion.div>
  );
}

export function HeroSequence() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const [source, setSource] = useState<Source>('checking');
  const [manifest, setManifest] = useState<FrameManifest | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const dim = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.28, 0.12, 0.12, 0.45]);

  useEffect(() => {
    if (reduce) {
      setSource('static');
      return;
    }
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}frames/manifest.json`, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((m: FrameManifest) => {
        if (!alive) return;
        if (!m.count) throw new Error('empty');
        setManifest(m);
        setSource('frames');
      })
      .catch(() => alive && setSource(hasWebGL() ? 'live' : 'static'));
    return () => {
      alive = false;
    };
  }, [reduce]);

  if (reduce || source === 'static') {
    return (
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-20 pt-32">
        <Img id="bowl-spurs" eager className="absolute inset-0 -z-10 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-midnight via-midnight/60 to-midnight/30" />
        <div className="container-x">
          <HeroCopy />
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[460vh]" aria-label="London is Blue — scroll to enter Stamford Bridge">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-midnight">
        {source === 'frames' && manifest && <FrameCanvas manifest={manifest} progress={scrollYProgress} />}
        {source === 'live' && (
          <Suspense fallback={<Img id="bowl-spurs" eager className="absolute inset-0 h-full w-full opacity-60" />}>
            <LiveFlythrough progress={scrollYProgress} />
          </Suspense>
        )}
        <motion.div className="pointer-events-none absolute inset-0 bg-midnight" style={{ opacity: dim }} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(23,36,64,0.6)_100%)]" />
        <div className="grain pointer-events-none absolute inset-0" />

        <div className="container-x relative flex h-full items-center">
          <Chapter progress={scrollYProgress} range={[-0.1, 0, 0.12, 0.2]} className="absolute inset-x-5 sm:inset-x-8 lg:inset-x-12">
            <p className="eyebrow mb-6 text-ivory/80">Fulham Road · London SW6 · Est. 1905</p>
            <h1 className="display text-[19vw] leading-[0.82] sm:text-[15vw] lg:text-[13.5vw]">
              London
              <br />
              <span className="text-royal-300">is</span> Blue
            </h1>
          </Chapter>

          <Chapter progress={scrollYProgress} range={[0.2, 0.27, 0.38, 0.45]} className="absolute inset-x-5 max-w-3xl sm:inset-x-8 lg:inset-x-12">
            <p className="eyebrow mb-5 text-gold-300">10 March 1905</p>
            <p className="font-serif text-4xl font-light leading-tight sm:text-6xl">
              It began in a pub on Fulham Road, <em className="text-royal-300">opposite a stadium with no team.</em>
            </p>
          </Chapter>

          <Chapter progress={scrollYProgress} range={[0.45, 0.52, 0.62, 0.69]} className="absolute inset-x-5 sm:inset-x-8 lg:inset-x-12">
            <p className="display text-[22vw] leading-none text-gold-sheen sm:text-[16vw]">40,044</p>
            <p className="mt-2 font-serif text-3xl font-light sm:text-5xl">voices. One sound.</p>
          </Chapter>

          <Chapter progress={scrollYProgress} range={[0.7, 0.78, 1.05, 1.1]} className="absolute inset-x-5 sm:inset-x-8 lg:inset-x-12">
            <HeroCopy />
          </Chapter>
        </div>

        <motion.div style={{ opacity: hintOpacity }} className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-ivory/70">
          Scroll to enter the Bridge
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
          <motion.div className="h-full origin-left bg-gradient-to-r from-royal-300 via-ivory to-gold" style={{ scaleX: barScale }} />
        </div>
      </div>
    </section>
  );
}

function HeroCopy() {
  return (
    <div className="max-w-4xl">
      <p className="eyebrow mb-5 text-gold-300">One club · One city · One pride</p>
      <h2 className="display text-[15vw] leading-[0.85] sm:text-8xl lg:text-[136px]">
        More than a club.
        <br />
        <span className="stroke-text">A legacy.</span>
      </h2>
      <p className="mt-6 max-w-xl text-lg text-ivory/85">Matchdays, legends, silverware and the stadium that has been home since 1905 — all in one place, wherever in the world you are.</p>
      <div className="mt-9 flex flex-wrap gap-3">
        <LinkButton to="/matches">Explore matches</LinkButton>
        <LinkButton to="/stadium" variant="ghost">
          Enter Stamford Bridge
        </LinkButton>
        <LinkButton to="/history" variant="quiet" className="hidden sm:inline-flex">
          Discover our legacy
        </LinkButton>
      </div>
    </div>
  );
}
