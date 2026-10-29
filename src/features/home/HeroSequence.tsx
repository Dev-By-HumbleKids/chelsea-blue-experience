import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { DustField } from '@/components/cinema/DustField';
import { useIntroDone } from '@/components/cinema/intro';
import { KineticText } from '@/components/cinema/Kinetic';
import { Magnetic } from '@/components/cinema/Magnetic';
import { Img, LinkButton } from '@/components/ui';
import { cx } from '@/lib/format';
import { usePrefersReducedMotion } from '@/lib/hooks';

/**
 * Scroll-driven cinematic hero. Frame source, in order of preference:
 *   1. An image sequence in /public/frames (manifest.json) — e.g. extracted from a video with
 *      `npm run frames -- path/to/video.mp4`. Dropping frames in switches the hero over; no code change.
 *   2. A live, scroll-scrubbed fly-through of the procedural 3D stadium (WebGL).
 *   3. A static photograph (reduced motion, or no WebGL).
 * Layered on top: letterbox bars, light leaks, a lens streak, floodlight dust, pointer parallax
 * and four scroll chapters with a chapter index.
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

const CHAPTERS = [
  { label: 'London is Blue', range: [-0.1, 0, 0.12, 0.2] },
  { label: '1905', range: [0.2, 0.27, 0.38, 0.45] },
  { label: '40,044', range: [0.45, 0.52, 0.62, 0.69] },
  { label: 'The Legacy', range: [0.7, 0.78, 1.05, 1.1] },
] as const;

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

function Chapter({ progress, range, children, className }: { progress: MotionValue<number>; range: readonly [number, number, number, number]; children: React.ReactNode; className?: string }) {
  const r = range as unknown as number[];
  const opacity = useTransform(progress, r, [0, 1, 1, 0]);
  const y = useTransform(progress, r, [60, 0, 0, -60]);
  const scale = useTransform(progress, r, [0.94, 1, 1, 1.04]);
  const filter = useTransform(progress, r, ['blur(14px)', 'blur(0px)', 'blur(0px)', 'blur(14px)']);
  const pointer = useTransform(opacity, (o) => (o > 0.5 ? 'auto' : 'none'));
  return (
    <motion.div style={{ opacity, y, scale, filter, pointerEvents: pointer }} className={className}>
      {children}
    </motion.div>
  );
}

function ChapterIndex({ progress }: { progress: MotionValue<number> }) {
  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, 'change', (p) => {
    const i = p < 0.2 ? 0 : p < 0.45 ? 1 : p < 0.7 ? 2 : 3;
    setActive(i);
  });
  return (
    <ol className="absolute right-5 top-1/2 hidden -translate-y-1/2 space-y-5 sm:block lg:right-12" aria-hidden>
      {CHAPTERS.map((c, i) => (
        <li key={c.label} className="flex items-center justify-end gap-3">
          <span className={cx('text-[10px] font-semibold uppercase tracking-[0.25em] transition-all duration-500', i === active ? 'text-ivory opacity-100' : 'translate-x-2 text-ivory/40 opacity-0')}>{c.label}</span>
          <span className="font-display text-sm tabular-nums text-ivory/50">0{i + 1}</span>
          <span className={cx('h-px transition-all duration-500', i === active ? 'w-10 bg-gold' : 'w-4 bg-white/30')} />
        </li>
      ))}
    </ol>
  );
}

function CapacityCounter({ progress }: { progress: MotionValue<number> }) {
  const n = useTransform(progress, [0.45, 0.56], [0, 40044], { clamp: true });
  const text = useTransform(n, (v) => Math.round(v).toLocaleString('en-GB'));
  return <motion.span>{text}</motion.span>;
}

export function HeroSequence() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const introDone = useIntroDone();
  const [source, setSource] = useState<Source>('checking');
  const [manifest, setManifest] = useState<FrameManifest | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const dim = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.3, 0.1, 0.12, 0.45]);
  // Letterbox bars open as the camera enters the stadium.
  const letterbox = useTransform(scrollYProgress, [0, 0.14], ['10vh', '0vh']);

  // Pointer parallax for the type layer.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const tx = useTransform(sx, (v) => v * -18);
  const ty = useTransform(sy, (v) => v * -12);

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
    <section
      ref={ref}
      className="relative h-[480vh]"
      aria-label="London is Blue — scroll to enter Stamford Bridge"
      onPointerMove={(e) => {
        px.set(e.clientX / window.innerWidth - 0.5);
        py.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-midnight">
        {source === 'frames' && manifest && <FrameCanvas manifest={manifest} progress={scrollYProgress} />}
        {source === 'live' && (
          <Suspense fallback={<Img id="bowl-spurs" eager className="absolute inset-0 h-full w-full opacity-60" />}>
            <LiveFlythrough progress={scrollYProgress} />
          </Suspense>
        )}

        {/* Grade: dim, vignette, light leaks, lens streak, dust */}
        <motion.div className="pointer-events-none absolute inset-0 bg-midnight" style={{ opacity: dim }} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(11,23,54,0.75)_100%)]" />
        <div className="light-leak light-leak-a -left-[10%] top-[5%] h-[55vh] w-[55vw] bg-royal-400/60" />
        <div className="light-leak light-leak-b -right-[15%] bottom-[0%] h-[50vh] w-[45vw] bg-gold/40" />
        <div className="lens-streak pointer-events-none absolute left-[5%] right-[5%] top-[34%] h-[2px]" />
        <DustField count={110} />
        <div className="grain pointer-events-none absolute inset-0" />

        <motion.div className="container-x relative flex h-full items-center" style={{ x: tx, y: ty }}>
          <Chapter progress={scrollYProgress} range={CHAPTERS[0].range} className="absolute inset-x-5 sm:inset-x-8 lg:inset-x-12">
            <motion.p className="eyebrow mb-6 flex items-center gap-4 text-ivory/85" initial={{ opacity: 0, x: -20 }} animate={introDone ? { opacity: 1, x: 0 } : undefined} transition={{ duration: 1, delay: 0.2 }}>
              <span className="h-px w-12 bg-gold" /> Fulham Road · London SW6 · Est. 1905
            </motion.p>
            <h1 className="display text-[19vw] leading-[0.8] sm:text-[15vw] lg:text-[13.5vw]">
              <KineticText text="London" play={introDone} delay={0.15} stagger={0.05} />
              <br />
              <KineticText text="is" play={introDone} delay={0.5} stagger={0.05} className="text-royal-300" /> <KineticText text="Blue" play={introDone} delay={0.62} stagger={0.05} />
            </h1>
          </Chapter>

          <Chapter progress={scrollYProgress} range={CHAPTERS[1].range} className="absolute inset-x-5 max-w-3xl sm:inset-x-8 lg:inset-x-12">
            <p className="eyebrow mb-5 flex items-center gap-4 text-gold-300">
              <span className="h-px w-12 bg-gold" /> Chapter 02 · 10 March 1905
            </p>
            <p className="font-serif text-4xl font-light leading-tight sm:text-6xl">
              It began in a pub on Fulham Road, <em className="text-royal-300">opposite a stadium with no team.</em>
            </p>
          </Chapter>

          <Chapter progress={scrollYProgress} range={CHAPTERS[2].range} className="absolute inset-x-5 sm:inset-x-8 lg:inset-x-12">
            <p className="eyebrow mb-3 flex items-center gap-4 text-gold-300">
              <span className="h-px w-12 bg-gold" /> Chapter 03 · Stamford Bridge
            </p>
            <p className="display text-[22vw] leading-none text-gold-sheen sm:text-[16vw]">
              <CapacityCounter progress={scrollYProgress} />
            </p>
            <p className="mt-2 font-serif text-3xl font-light sm:text-5xl">voices. One sound.</p>
          </Chapter>

          <Chapter progress={scrollYProgress} range={CHAPTERS[3].range} className="absolute inset-x-5 sm:inset-x-8 lg:inset-x-12">
            <HeroCopy />
          </Chapter>
        </motion.div>

        <ChapterIndex progress={scrollYProgress} />

        {/* Letterbox */}
        <motion.div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-black" style={{ height: letterbox }} />
        <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-black" style={{ height: letterbox }} />

        <motion.div style={{ opacity: hintOpacity }} className="pointer-events-none absolute bottom-[12vh] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-ivory/80">
          <span className="relative h-10 w-6 rounded-full border border-ivory/50">
            <motion.span className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded-full bg-gold" animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
          </span>
          Scroll to enter the Bridge
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-white/10">
          <motion.div className="h-full origin-left bg-gradient-to-r from-royal-300 via-ivory to-gold" style={{ scaleX: barScale }} />
        </div>
      </div>
    </section>
  );
}

function HeroCopy() {
  return (
    <div className="max-w-4xl">
      <p className="eyebrow mb-5 flex items-center gap-4 text-gold-300">
        <span className="h-px w-12 bg-gold" /> One club · One city · One pride
      </p>
      <h2 className="display text-[15vw] leading-[0.85] sm:text-8xl lg:text-[136px]">
        More than a club.
        <br />
        <span className="stroke-text">A legacy.</span>
      </h2>
      <p className="mt-6 max-w-xl text-lg text-ivory/85">Matchdays, legends, silverware and the stadium that has been home since 1905 — all in one place, wherever in the world you are.</p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Magnetic>
          <LinkButton to="/matches">Explore matches</LinkButton>
        </Magnetic>
        <Magnetic>
          <LinkButton to="/stadium" variant="ghost">
            Enter Stamford Bridge
          </LinkButton>
        </Magnetic>
        <LinkButton to="/history" variant="quiet" className="hidden sm:inline-flex">
          Discover our legacy
        </LinkButton>
      </div>
    </div>
  );
}
