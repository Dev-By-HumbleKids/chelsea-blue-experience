import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks';

/**
 * Floating floodlight dust: soft particles drifting upward with depth, nudged by the pointer.
 * A lightweight 2D canvas that pauses when off-screen.
 */
export function DustField({ count = 90, className }: { count?: number; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const c = canvas.current;
    if (!c || reduce) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const parts = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.2 + Math.random() * 0.8,
      r: 0.4 + Math.random() * 1.8,
      tw: Math.random() * Math.PI * 2,
      gold: Math.random() < 0.18,
    }));
    let mx = 0;
    let my = 0;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(50, t - last) / 1000;
      last = t;
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= dt * 0.018 * p.z;
        p.x += dt * 0.006 * Math.sin(t / 2400 + p.tw);
        if (p.y < -0.05) {
          p.y = 1.05;
          p.x = Math.random();
        }
        const px = (p.x + mx * 0.04 * p.z) * w;
        const py = (p.y + my * 0.03 * p.z) * h;
        const a = (0.25 + 0.55 * p.z) * (0.6 + 0.4 * Math.sin(t / 700 + p.tw));
        const r = p.r * (0.6 + p.z);
        const g = ctx.createRadialGradient(px, py, 0, px, py, r * 4);
        g.addColorStop(0, p.gold ? `rgba(242,214,150,${a})` : `rgba(220,232,255,${a})`);
        g.addColorStop(1, 'rgba(220,232,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, [count, reduce]);

  if (reduce) return null;
  return <canvas ref={canvas} className={className ?? 'pointer-events-none absolute inset-0 h-full w-full'} aria-hidden />;
}
