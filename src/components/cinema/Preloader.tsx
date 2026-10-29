import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Emblem } from '@/components/Emblem';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { introWillPlay, markIntroDone } from './intro';

const WORD = 'LONDON IS BLUE';
const ease = [0.76, 0, 0.24, 1] as const;

/**
 * Once-per-session cinematic intro: emblem, a counting loader and the slogan, then a split curtain
 * opens onto the site. Skipped for reduced motion. A timeout guarantees it never blocks the page.
 */
export function Preloader() {
  const reduce = usePrefersReducedMotion();
  const [show, setShow] = useState(introWillPlay);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!show) return;
    if (reduce) {
      setShow(false);
      return;
    }
    document.body.style.overflow = 'hidden';
    const start = performance.now();
    const total = 1900;
    const timer = window.setInterval(() => {
      const p = Math.min(1, (performance.now() - start) / total);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p >= 1) window.clearInterval(timer);
    }, 30);
    const close = window.setTimeout(() => setShow(false), total + 450);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(close);
    };
  }, [show, reduce]);

  useEffect(() => {
    if (show) return;
    document.body.style.overflow = '';
    markIntroDone();
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div key="intro" className="fixed inset-0 z-[100]" exit={{ pointerEvents: 'none' }} transition={{ duration: 1.1 }} aria-hidden>
          {/* Split curtain */}
          <motion.div className="absolute inset-x-0 top-0 h-1/2 bg-midnight" exit={{ y: '-100%' }} transition={{ duration: 1.05, ease }} />
          <motion.div className="absolute inset-x-0 bottom-0 h-1/2 bg-midnight" exit={{ y: '100%' }} transition={{ duration: 1.05, ease }} />
          <motion.div className="absolute left-0 right-0 top-1/2 h-px origin-center bg-gradient-to-r from-transparent via-gold to-transparent" initial={{ scaleX: 0 }} animate={{ scaleX: count / 100 }} exit={{ opacity: 0 }} />

          <motion.div className="absolute inset-0 flex flex-col items-center justify-center" exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }} transition={{ duration: 0.45 }}>
            <div className="relative">
              <svg className="absolute -inset-6 h-[calc(100%+48px)] w-[calc(100%+48px)] -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <circle cx="50" cy="50" r="47" fill="none" stroke="#C9A45C" strokeWidth="1.2" strokeLinecap="round" strokeDasharray={295} strokeDashoffset={295 - (295 * count) / 100} />
              </svg>
              <motion.div initial={{ scale: 0.6, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
                <Emblem size={112} />
              </motion.div>
            </div>
            <p className="mt-16 flex overflow-hidden font-display text-4xl tracking-[0.18em] sm:text-6xl">
              {WORD.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  className={ch === ' ' ? 'w-4 sm:w-6' : i >= 10 ? 'text-royal-300' : ''}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 + i * 0.045, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ch}
                </motion.span>
              ))}
            </p>
            <motion.p className="eyebrow mt-4 text-silver" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              Stamford Bridge · London SW6 · Est. 1905
            </motion.p>
          </motion.div>

          <motion.span className="absolute bottom-8 right-8 font-display text-7xl tabular-nums text-white/15 sm:text-9xl" exit={{ opacity: 0 }}>
            {String(count).padStart(3, '0')}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
