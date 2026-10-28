import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, useState, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import { media } from '@/data/media';
import type { Provenance, Source } from '@/data/types';
import { cx } from '@/lib/format';
import { usePrefersReducedMotion } from '@/lib/hooks';

// ---- Buttons ---------------------------------------------------------------------------

type Variant = 'primary' | 'ghost' | 'gold' | 'quiet';

const variants: Record<Variant, string> = {
  primary: 'bg-royal text-ivory hover:bg-royal-400 shadow-[0_10px_40px_-12px_rgba(3,70,148,0.9)]',
  ghost: 'text-ivory ring-1 ring-inset ring-white/25 hover:ring-white/60 hover:bg-white/[0.04]',
  gold: 'bg-gold text-midnight hover:bg-gold-300',
  quiet: 'text-ivory/80 hover:text-ivory hover:bg-white/[0.06]',
};

const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 h-12 text-[13px] font-semibold uppercase tracking-[0.14em] transition-[background-color,box-shadow,color,transform] duration-200 ease-out active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none';

export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'md' | 'sm' }>(
  ({ variant = 'primary', size = 'md', className, ...rest }, ref) => (
    <button ref={ref} className={cx(btnBase, variants[variant], size === 'sm' && 'h-10 px-4 text-[12px]', className)} {...rest} />
  ),
);
Button.displayName = 'Button';

export function LinkButton({ variant = 'primary', size = 'md', className, ...rest }: LinkProps & { variant?: Variant; size?: 'md' | 'sm' }) {
  return <Link className={cx(btnBase, variants[variant], size === 'sm' && 'h-10 px-4 text-[12px]', className)} {...rest} />;
}

// ---- Media -----------------------------------------------------------------------------

export function Img({ id, className, sizes, eager, credit = false }: { id?: string; className?: string; sizes?: string; eager?: boolean; credit?: boolean }) {
  const m = media(id);
  const [failed, setFailed] = useState(false);
  if (!m || failed) {
    return (
      <div className={cx('flex items-center justify-center bg-gradient-to-br from-midnight-700 to-royal-700', className)} role="img" aria-label={m?.alt ?? 'Image unavailable'}>
        <ImageOff className="h-6 w-6 text-white/30" aria-hidden />
      </div>
    );
  }
  return (
    <figure className={cx('relative overflow-hidden', className)}>
      <img
        src={m.src}
        alt={m.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        sizes={sizes}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
        style={{ objectPosition: m.focus ?? '50% 50%' }}
      />
      {credit && (
        <figcaption className="absolute bottom-2 right-2 rounded bg-black/55 px-2 py-0.5 text-[10px] text-white/70 backdrop-blur-sm">
          {m.credit} · {m.license}
        </figcaption>
      )}
    </figure>
  );
}

// ---- Motion ----------------------------------------------------------------------------

export function Reveal({ children, delay = 0, y = 28, className, ...rest }: { children: ReactNode; delay?: number; y?: number; className?: string } & HTMLMotionProps<'div'>) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ---- Typography ------------------------------------------------------------------------

export function SectionHeading({ eyebrow, title, intro, align = 'left', className }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; align?: 'left' | 'center'; className?: string }) {
  return (
    <Reveal className={cx('mb-10 md:mb-14', align === 'center' && 'mx-auto max-w-3xl text-center', className)}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="display text-[44px] sm:text-6xl lg:text-7xl">{title}</h2>
      {intro && <p className={cx('mt-5 max-w-2xl text-ivory-muted md:text-lg', align === 'center' && 'mx-auto')}>{intro}</p>}
    </Reveal>
  );
}

export function PageHero({ eyebrow, title, intro, image, children }: { eyebrow: string; title: ReactNode; intro?: ReactNode; image?: string; children?: ReactNode }) {
  return (
    <header className="relative isolate overflow-hidden pb-14 pt-[calc(var(--nav-h)+56px)] md:pb-20 md:pt-[calc(var(--nav-h)+88px)]">
      {image && (
        <div className="absolute inset-0 -z-10">
          <Img id={image} eager className="h-full w-full opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-midnight/80 to-midnight" />
        </div>
      )}
      <div className="absolute -left-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-royal/25 blur-[140px]" aria-hidden />
      <div className="container-x">
        <Reveal>
          <p className="eyebrow mb-5">{eyebrow}</p>
          <h1 className="display max-w-5xl text-[56px] sm:text-7xl lg:text-[112px]">{title}</h1>
          {intro && <p className="mt-6 max-w-2xl text-lg text-ivory-muted">{intro}</p>}
        </Reveal>
        {children}
      </div>
    </header>
  );
}

// ---- Labels ----------------------------------------------------------------------------

const provenanceStyle: Record<Provenance, { label: string; cls: string }> = {
  verified: { label: 'Verified', cls: 'text-emerald-300 ring-emerald-300/30' },
  snapshot: { label: 'Snapshot', cls: 'text-sky-300 ring-sky-300/30' },
  demo: { label: 'Demo data', cls: 'text-amber-300 ring-amber-300/30' },
  editorial: { label: 'Editorial', cls: 'text-silver ring-white/20' },
};

export function ProvenanceTag({ kind, children }: { kind: Provenance; children?: ReactNode }) {
  const s = provenanceStyle[kind];
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ring-1 ring-inset', s.cls)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {children ?? s.label}
    </span>
  );
}

export function Pill({ children, active, onClick, className }: { children: ReactNode; active?: boolean; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'h-9 whitespace-nowrap rounded-full px-4 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors',
        active ? 'bg-ivory text-midnight' : 'text-ivory/70 ring-1 ring-inset ring-white/15 hover:text-ivory hover:ring-white/40',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Sources({ sources, className }: { sources: Source[]; className?: string }) {
  if (!sources.length) return null;
  return (
    <p className={cx('text-xs text-silver', className)}>
      Sources:{' '}
      {sources.map((s, i) => (
        <span key={s.url}>
          <a href={s.url} target="_blank" rel="noreferrer noopener" className="link-underline text-ivory/80 hover:text-ivory">
            {s.label}
          </a>
          {i < sources.length - 1 && ' · '}
        </span>
      ))}
    </p>
  );
}

export function EmptyState({ title, text, action, level = 'p' }: { title: string; text?: string; action?: ReactNode; level?: 'h1' | 'p' }) {
  const Title = level;
  return (
    <div className="surface rounded-2xl px-6 py-14 text-center">
      <Title className="display text-3xl">{title}</Title>
      {text && <p className="mx-auto mt-3 max-w-md text-ivory-muted">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('animate-pulse rounded-xl bg-white/[0.06]', className)} />;
}

/** Club crest from the media manifest (private builds); falls back to a text badge in public builds. */
export function TeamBadge({ short, home, size = 56 }: { short: string; home?: boolean; size?: number }) {
  const crest = media(`crest-${short}`);
  if (crest) {
    return (
      <span className="inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
        <img src={crest.src} alt={crest.alt} className="h-full w-full object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]" loading="lazy" />
      </span>
    );
  }
  return (
    <span
      className={cx('inline-flex shrink-0 items-center justify-center rounded-full font-display tracking-wider', home ? 'bg-royal text-ivory ring-2 ring-gold/70' : 'bg-white/[0.06] text-ivory ring-1 ring-white/20')}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden
    >
      {short}
    </span>
  );
}
