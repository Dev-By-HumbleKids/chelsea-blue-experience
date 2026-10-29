import Lenis from 'lenis';
import { useEffect } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks';

/**
 * Inertial smooth scrolling (Lenis) for mouse and trackpad users. Touch devices and reduced-motion
 * users keep native scrolling. Lenis drives the real document scroll, so framer-motion's
 * useScroll and position: sticky keep working unchanged.
 */
let instance: Lenis | null = null;

export const getLenis = () => instance;

export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
}

export function scrollToElement(el: HTMLElement) {
  if (instance) instance.scrollTo(el, { offset: -96, duration: 1.4 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function SmoothScroll() {
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce || window.matchMedia('(pointer: coarse)').matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 0.95 });
    instance = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Dialogs and menus lock the page by setting body overflow; pause Lenis while they are open.
    const sync = () => (document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start());
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      lenis.destroy();
      instance = null;
    };
  }, [reduce]);

  return null;
}
