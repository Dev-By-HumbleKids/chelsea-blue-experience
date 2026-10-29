import { AnimatePresence, motion } from 'framer-motion';
import { Box, ChevronLeft, ChevronRight, Expand, Images, Volume2, VolumeX, X } from 'lucide-react';
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Img, LinkButton, PageHero, ProvenanceTag, Reveal, SectionHeading, Sources } from '@/components/ui';
import { STADIUM, TOUR_STOPS, type TourStop } from '@/data/stadium';
import { cx, num } from '@/lib/format';
import { useMeta } from '@/lib/hooks';
import { createCrowdAudio } from './crowdAudio';

const StadiumScene = lazy(() => import('./StadiumScene'));

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function Lightbox({ id, onClose }: { id: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/95" role="dialog" aria-modal="true" aria-label="Photo viewer">
      <div ref={ref} tabIndex={-1} data-lenis-prevent className="h-full w-full cursor-grab overflow-auto outline-none active:cursor-grabbing">
        {/* Drag-to-explore: the photo is shown larger than the viewport and can be panned. */}
        <Img id={id} eager credit className="h-[130vh] min-w-[130vw]" />
      </div>
      <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-xs text-white/80">Scroll or drag to explore · Esc to close</p>
      <button type="button" onClick={onClose} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close photo viewer">
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  );
}

export default function StadiumPage() {
  useMeta('Stamford Bridge', 'Explore a 3D Stamford Bridge and a photo tour of the tunnel, pitchside and museum — from anywhere in the world.');
  const [params, setParams] = useSearchParams();
  const initial = TOUR_STOPS.find((s) => s.id === params.get('stop')) ?? TOUR_STOPS[0];
  const [stop, setStop] = useState<TourStop>(initial);
  const canWebGL = useMemo(webglAvailable, []);
  const [mode, setMode] = useState<'3d' | 'photo'>(canWebGL ? '3d' : 'photo');
  const [sound, setSound] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const audio = useRef<ReturnType<typeof createCrowdAudio> | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const idx = TOUR_STOPS.indexOf(stop);

  const select = useCallback(
    (s: TourStop) => {
      setStop(s);
      setParams({ stop: s.id }, { replace: true });
    },
    [setParams],
  );
  const go = useCallback((d: number) => select(TOUR_STOPS[(TOUR_STOPS.indexOf(stop) + d + TOUR_STOPS.length) % TOUR_STOPS.length]), [select, stop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,textarea,select')) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  useEffect(() => () => audio.current?.stop(), []);

  const toggleSound = () => {
    if (sound) {
      audio.current?.stop();
      audio.current = null;
    } else {
      try {
        audio.current = createCrowdAudio();
      } catch {
        return;
      }
    }
    setSound(!sound);
  };

  const fullscreen = () => {
    const el = stage.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.().catch(() => undefined);
  };

  return (
    <>
      <PageHero eyebrow="The Digital Stamford Bridge" title={<>Enter the Bridge</>} intro="Fly around a 3D model of the stadium, then step into the real places with licensed photographs. Use the numbered hotspots, the arrows or your keyboard." image="panorama-theodoritsis">
        <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            ['Capacity', num(STADIUM.capacity)],
            ['Opened', '1877'],
            ['Home since', String(STADIUM.chelseaHomeSince)],
            ['Record crowd', num(STADIUM.recordAttendance.figure)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-silver">{k}</dt>
              <dd className="font-display text-4xl text-gold-sheen">{v}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="container-x" aria-label="Virtual stadium tour">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10" role="tablist" aria-label="Tour mode">
            {canWebGL && (
              <button role="tab" aria-selected={mode === '3d'} onClick={() => setMode('3d')} className={cx('flex h-9 items-center gap-2 rounded-full px-4 text-xs font-semibold uppercase tracking-[0.12em]', mode === '3d' ? 'bg-ivory text-midnight' : 'text-ivory/70')}>
                <Box className="h-4 w-4" /> 3D stadium
              </button>
            )}
            <button role="tab" aria-selected={mode === 'photo'} onClick={() => setMode('photo')} className={cx('flex h-9 items-center gap-2 rounded-full px-4 text-xs font-semibold uppercase tracking-[0.12em]', mode === 'photo' ? 'bg-ivory text-midnight' : 'text-ivory/70')}>
              <Images className="h-4 w-4" /> Photo tour
            </button>
          </div>
          <div className="ml-auto flex gap-2">
            <button type="button" onClick={toggleSound} aria-pressed={sound} className="flex h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold ring-1 ring-white/15 hover:ring-white/40">
              {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />} {sound ? 'Ambience on' : 'Ambience off'}
            </button>
            <button type="button" onClick={fullscreen} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/15 hover:ring-white/40" aria-label="Toggle full screen">
              <Expand className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={stage} className="relative h-[78svh] min-h-[520px] overflow-hidden rounded-[28px] bg-midnight-800 ring-1 ring-white/10">
          {mode === '3d' ? (
            <Suspense fallback={<div className="grid h-full place-items-center font-display tracking-[0.3em] text-silver">BUILDING THE BRIDGE…</div>}>
              <StadiumScene stop={stop} onSelect={select} />
            </Suspense>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={stop.id} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
                {stop.image ? (
                  <button type="button" className="h-full w-full" onClick={() => setLightbox(stop.image!)} aria-label="Open photo full screen to explore">
                    <Img id={stop.image} eager credit className="h-full w-full" />
                  </button>
                ) : (
                  <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_50%_40%,#16295A,#050B1A)] p-10 text-center">
                    <div>
                      <p className="font-display text-6xl text-white/20">Illustrative stop</p>
                      <p className="mt-3 text-silver">No licensed photograph of this area is available. Switch to the 3D stadium to see it modelled.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Info panel */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={stop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="pointer-events-auto ml-auto max-w-md rounded-[22px] bg-midnight/85 p-5 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl"
                aria-live="polite"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                    Stop {idx + 1} / {TOUR_STOPS.length} · {stop.kicker}
                  </p>
                  <ProvenanceTag kind={stop.kind === 'photo' ? 'verified' : 'editorial'}>{stop.kind === 'photo' ? 'Real photo' : 'Illustrative'}</ProvenanceTag>
                </div>
                <h2 className="mt-2 font-display text-3xl leading-none tracking-wide">{stop.name}</h2>
                <p className="mt-3 text-sm text-ivory/80">{stop.text}</p>
                <ul className="mt-3 space-y-1 text-xs text-silver">
                  {stop.facts.map((f) => (
                    <li key={f}>— {f}</li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-2">
                  <button type="button" onClick={() => go(-1)} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/20 hover:bg-white/10" aria-label="Previous stop">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={() => go(1)} className="grid h-10 w-10 place-items-center rounded-full bg-royal hover:bg-royal-400" aria-label="Next stop">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  {stop.image && mode === '3d' && (
                    <button type="button" onClick={() => setLightbox(stop.image!)} className="ml-auto flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ring-1 ring-white/20 hover:bg-white/10">
                      <Images className="h-4 w-4" /> See the real place
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          {mode === '3d' && <p className="pointer-events-none absolute left-5 top-5 rounded-full bg-midnight/70 px-3 py-1 text-[11px] text-silver backdrop-blur">Drag to orbit · scroll to zoom · stylised model, not to scale</p>}
        </div>

        {/* Stop strip */}
        <ol className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2" aria-label="Tour stops">
          {TOUR_STOPS.map((s, i) => (
            <li key={s.id} className="snap-start">
              <button
                type="button"
                onClick={() => select(s)}
                aria-current={s.id === stop.id}
                className={cx('flex h-16 w-56 items-center gap-3 rounded-2xl p-2 pr-4 text-left ring-1 transition-colors', s.id === stop.id ? 'bg-royal/40 ring-gold/60' : 'bg-white/[0.03] ring-white/10 hover:ring-white/30')}
              >
                <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-midnight-700">{s.image ? <Img id={s.image} className="h-full w-full" /> : <span className="grid h-full place-items-center font-display text-xl text-silver">{i + 1}</span>}</span>
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.16em] text-silver">{s.kicker}</span>
                  <span className="block truncate text-sm font-semibold">{s.name}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-x pt-28" aria-labelledby="stands-title">
        <SectionHeading eyebrow="Four sides, one home" title={<span id="stands-title">The stands</span>} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STADIUM.stands.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06}>
              <li className="surface h-full rounded-[24px] p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300">{s.side}</p>
                <h3 className="mt-2 font-display text-3xl leading-none">{s.name}</h3>
                <p className="mt-3 text-sm text-ivory-muted">{s.note}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-x pt-28" aria-labelledby="atmos-title">
        <SectionHeading eyebrow="Matchday atmosphere" title={<span id="atmos-title">Feel the noise</span>} intro="Turn on the ambience above and imagine the walk up Fulham Road, the floodlights and 40,000 voices." />
        <div className="grid gap-4 md:grid-cols-3">
          {['fans-psg-2014', 'spurs-2016', 'inside-peterborough'].map((id, i) => (
            <Reveal key={id} delay={i * 0.08} className={cx('overflow-hidden rounded-[24px]', i === 0 ? 'md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto' : 'aspect-[4/3]')}>
              <Img id={id} credit className="h-full w-full" />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-[28px] bg-gradient-to-r from-royal-600 to-midnight-700 p-8 ring-1 ring-white/10">
          <div>
            <p className="font-display text-4xl">Want to see it for real?</p>
            <p className="text-ivory/80">Try the demo tour booking flow — or visit the official tours site to plan a real visit.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton to="/tickets/tours/stadium-tour">Book a tour (demo)</LinkButton>
            <a href="https://tours.chelseafc.com/" target="_blank" rel="noreferrer noopener" className="inline-flex h-12 items-center rounded-full px-6 text-[13px] font-semibold uppercase tracking-[0.14em] ring-1 ring-white/30 hover:ring-white/60">
              Official tours ↗
            </a>
          </div>
        </div>
        <Sources sources={STADIUM.sources} className="mt-6" />
      </section>

      <AnimatePresence>{lightbox && <Lightbox id={lightbox} onClose={() => setLightbox(null)} />}</AnimatePresence>
    </>
  );
}
