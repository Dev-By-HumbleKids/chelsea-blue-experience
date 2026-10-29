import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks';

const INTERACTIVE = 'a,button,[role="button"],input,select,textarea,label,[data-cursor]';

/**
 * A soft follower ring + dot for fine pointers. The native cursor stays visible for accessibility;
 * the ring grows over interactive elements and shows a label from `data-cursor="View"` etc.
 * Also feeds `--mx/--my` to `.surface` cards for the spotlight hover.
 */
export function Cursor() {
  const reduce = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState('');
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });

  useEffect(() => {
    setEnabled(!reduce && window.matchMedia('(pointer: fine)').matches);
  }, [reduce]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>('.surface');
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(INTERACTIVE);
      setHover(!!el);
      setLabel(el?.dataset.cursor ?? '');
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = label ? 84 : hover ? 56 : 30;

  return (
    <div className="pointer-events-none fixed inset-0 z-[95]" aria-hidden style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms' }}>
      <motion.div className="absolute left-0 top-0" style={{ x: rx, y: ry }}>
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] transition-[width,height,background-color,border-color] duration-300 ease-out"
          style={{
            width: size,
            height: size,
            borderColor: hover ? 'rgba(226,200,142,0.9)' : 'rgba(245,242,234,0.45)',
            backgroundColor: label ? 'rgba(201,164,92,0.92)' : hover ? 'rgba(201,164,92,0.12)' : 'transparent',
            color: '#0b1736',
          }}
        >
          {label}
        </div>
      </motion.div>
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
      </motion.div>
    </div>
  );
}
