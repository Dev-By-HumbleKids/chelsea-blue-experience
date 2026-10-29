import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks';

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/** A marquee row whose speed and skew react to scroll velocity, reversing with scroll direction. */
function Row({ children, baseVelocity }: { children: React.ReactNode; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const skew = useTransform(smooth, [-2000, 2000], [8, -8]);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    if (factor.get() < 0) dir.current = -1;
    else if (factor.get() > 0) dir.current = 1;
    move += dir.current * move * factor.get();
    baseX.set(baseX.get() + move);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className="flex shrink-0 gap-10 pr-10" style={{ x, skewX: skew }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function VelocityMarquee() {
  const reduce = usePrefersReducedMotion();
  const one = (
    <>
      <span className="font-display text-6xl tracking-wide md:text-8xl">London is Blue</span>
      <span className="h-3 w-3 rotate-45 bg-gold" />
      <span className="stroke-text font-display text-6xl tracking-wide md:text-8xl">Since 1905</span>
      <span className="h-3 w-3 rotate-45 bg-gold" />
    </>
  );
  const two = (
    <>
      <span className="font-serif text-3xl italic text-ivory/70 md:text-5xl">One club</span>
      <span className="text-gold">✦</span>
      <span className="font-serif text-3xl italic text-ivory/70 md:text-5xl">One city</span>
      <span className="text-gold">✦</span>
      <span className="font-serif text-3xl italic text-ivory/70 md:text-5xl">One pride</span>
      <span className="text-gold">✦</span>
    </>
  );
  if (reduce) {
    return (
      <div className="border-y border-white/[0.06] py-6 text-center font-display text-5xl" aria-hidden>
        London is Blue
      </div>
    );
  }
  return (
    <div className="relative space-y-4 overflow-hidden border-y border-white/[0.06] py-8" aria-hidden>
      <Row baseVelocity={-2.2}>{one}</Row>
      <Row baseVelocity={1.6}>{two}</Row>
    </div>
  );
}
