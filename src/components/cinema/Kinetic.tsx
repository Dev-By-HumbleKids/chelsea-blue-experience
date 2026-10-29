import { animate, motion, useInView, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';
import { cx } from '@/lib/format';
import { usePrefersReducedMotion } from '@/lib/hooks';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Letter-by-letter rise from behind a mask. `play` lets the hero wait for the intro curtain;
 * otherwise it plays when scrolled into view.
 */
export function KineticText({ text, className, delay = 0, stagger = 0.03, play }: { text: string; className?: string; delay?: number; stagger?: number; play?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduce = usePrefersReducedMotion();
  const go = play ?? inView;
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span ref={ref} className={cx('inline-block', className)} aria-label={text}>
      {text.split(' ').map((word, w, words) => (
        <span key={w} className="inline-block whitespace-nowrap" aria-hidden>
          {word.split('').map((ch, i) => {
            const index = words.slice(0, w).join(' ').length + i;
            return (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block will-change-transform"
                  initial={{ y: '105%', rotate: 8 }}
                  animate={go ? { y: '0%', rotate: 0 } : undefined}
                  transition={{ duration: 0.9, ease, delay: delay + index * stagger }}
                >
                  {ch}
                </motion.span>
              </span>
            );
          })}
          {w < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
}

/** Block mask reveal: content rises from behind a clip line, with a touch of blur. */
export function MaskReveal({ children, className, delay = 0, play }: { children: ReactNode; className?: string; delay?: number; play?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  const reduce = usePrefersReducedMotion();
  const go = play ?? inView;
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <div ref={ref} className={cx('overflow-hidden', className)}>
      <motion.div initial={{ y: '100%', filter: 'blur(6px)' }} animate={go ? { y: '0%', filter: 'blur(0px)' } : undefined} transition={{ duration: 1.1, ease, delay }}>
        {children}
      </motion.div>
    </div>
  );
}

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span className="inline-block" style={{ opacity, y }}>
      {word}&nbsp;
    </motion.span>
  );
}

/** Words light up one by one as the paragraph scrolls through the viewport. */
export function WordReveal({ text, className, highlight = [] }: { text: string; className?: string; highlight?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');
  if (reduce) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className={highlight.some((h) => w.toLowerCase().startsWith(h)) ? 'text-gold-300' : undefined}>
          <Word word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
        </span>
      ))}
    </p>
  );
}

/** Counts up to `to` once visible. */
export function Counter({ to, className, duration = 2.2, format = (n: number) => Math.round(n).toLocaleString('en-GB') }: { to: number; className?: string; duration?: number; format?: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduce = usePrefersReducedMotion();
  const value = useMotionValue(reduce ? to : 0);
  const text = useTransform(value, format);
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(value, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, reduce, to, duration, value]);
  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}

/** Image reveal: a rounded window opens while the picture settles from a slight zoom. */
export function ClipReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = usePrefersReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={cx('overflow-hidden', className)}
      initial={{ clipPath: 'inset(14% 14% 14% 14% round 28px)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1.3, ease, delay }}
    >
      <motion.div className="h-full w-full" initial={{ scale: 1.3 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 1.6, ease, delay }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
