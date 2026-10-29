import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Emblem } from '@/components/Emblem';
import { usePrefersReducedMotion } from '@/lib/hooks';

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * Cinematic wipe on every route change: a royal-blue panel with the emblem lifts away to reveal
 * the new page. It mounts in the same commit as the new route, so the old page never flashes.
 */
export function RouteCurtain() {
  const { pathname } = useLocation();
  const reduce = usePrefersReducedMotion();
  const first = useRef(true);
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!reduce) setKey(pathname + Date.now());
  }, [pathname, reduce]);

  if (!key) return null;
  return (
    <div key={key} className="pointer-events-none fixed inset-0 z-[90]" aria-hidden>
      <motion.div
        className="absolute inset-0 bg-royal-700"
        initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        transition={{ duration: 0.9, ease, delay: 0.15 }}
        onAnimationComplete={() => setKey(null)}
      />
      <motion.div
        className="absolute inset-0 bg-midnight"
        initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        transition={{ duration: 0.75, ease }}
      />
      <motion.div className="absolute inset-0 grid place-items-center" initial={{ opacity: 1, scale: 1 }} animate={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.45, ease }}>
        <Emblem size={72} />
      </motion.div>
    </div>
  );
}
