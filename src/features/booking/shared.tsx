import { Check, Info } from 'lucide-react';
import { useId, useMemo, type ReactNode } from 'react';
import { DEMO_DISCLAIMER } from '@/data/experiences';
import { cx, gbp } from '@/lib/format';
import type { Visitor } from '@/services/bookings';

export function DemoNotice({ className }: { className?: string }) {
  return (
    <p className={cx('flex gap-3 rounded-2xl bg-amber-300/[0.08] p-4 text-sm text-amber-100/90 ring-1 ring-amber-300/25', className)} role="note">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
      {DEMO_DISCLAIMER}
    </p>
  );
}

export function Steps({ steps, current, onJump }: { steps: string[]; current: number; onJump?: (i: number) => void }) {
  return (
    <ol className="flex gap-2 overflow-x-auto pb-2" aria-label="Booking progress">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              disabled={!done || !onJump}
              onClick={() => onJump?.(i)}
              aria-current={active ? 'step' : undefined}
              className={cx(
                'flex h-9 items-center gap-2 rounded-full pl-1 pr-4 text-xs font-semibold transition-colors',
                active ? 'bg-ivory text-midnight' : done ? 'bg-royal/40 text-ivory hover:bg-royal/60' : 'text-ivory/40 ring-1 ring-white/10',
              )}
            >
              <span className={cx('grid h-7 w-7 place-items-center rounded-full text-[11px]', active ? 'bg-midnight text-ivory' : done ? 'bg-gold text-midnight' : 'bg-white/[0.06]')}>{done ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
              {s}
            </button>
            {i < steps.length - 1 && <span className="h-px w-4 bg-white/10" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

export interface VisitorErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  consent?: string;
}

export function validateVisitor(v: Visitor, consent: boolean): VisitorErrors {
  const e: VisitorErrors = {};
  if (!v.firstName.trim()) e.firstName = 'Enter a first name.';
  if (!v.lastName.trim()) e.lastName = 'Enter a last name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter a valid email address, like name@example.com.';
  if (v.phone && !/^[+\d][\d\s()-]{6,}$/.test(v.phone.trim())) e.phone = 'Enter a valid phone number or leave it blank.';
  if (!consent) e.consent = 'Please confirm you understand this is a demo booking.';
  return e;
}

function Field({ label, error, children, hint }: { label: string; error?: string; hint?: string; children: (id: string, describedBy?: string) => ReactNode }) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-silver">
        {label}
      </label>
      {children(id, error ? errId : undefined)}
      {hint && !error && <p className="mt-1.5 text-xs text-silver">{hint}</p>}
      {error && (
        <p id={errId} className="mt-1.5 text-xs text-rose-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (err?: string) =>
  cx('h-12 w-full rounded-xl bg-white/[0.05] px-4 text-[15px] outline-none ring-1 transition-shadow placeholder:text-silver/60 focus:ring-2', err ? 'ring-rose-300/60 focus:ring-rose-300' : 'ring-white/15 focus:ring-gold/70');

export function VisitorForm({ value, onChange, errors, consent, onConsent }: { value: Visitor; onChange: (v: Visitor) => void; errors: VisitorErrors; consent: boolean; onConsent: (c: boolean) => void }) {
  const set = (k: keyof Visitor) => (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...value, [k]: e.target.value });
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="First name" error={errors.firstName}>
        {(id, d) => <input id={id} aria-describedby={d} aria-invalid={!!errors.firstName} autoComplete="given-name" value={value.firstName} onChange={set('firstName')} className={inputCls(errors.firstName)} />}
      </Field>
      <Field label="Last name" error={errors.lastName}>
        {(id, d) => <input id={id} aria-describedby={d} aria-invalid={!!errors.lastName} autoComplete="family-name" value={value.lastName} onChange={set('lastName')} className={inputCls(errors.lastName)} />}
      </Field>
      <Field label="Email" error={errors.email} hint="Stored only in this browser. No email is sent.">
        {(id, d) => <input id={id} type="email" aria-describedby={d} aria-invalid={!!errors.email} autoComplete="email" value={value.email} onChange={set('email')} className={inputCls(errors.email)} placeholder="name@example.com" />}
      </Field>
      <Field label="Phone (optional)" error={errors.phone}>
        {(id, d) => <input id={id} type="tel" aria-describedby={d} aria-invalid={!!errors.phone} autoComplete="tel" value={value.phone ?? ''} onChange={set('phone')} className={inputCls(errors.phone)} />}
      </Field>
      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input type="checkbox" checked={consent} onChange={(e) => onConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#C9A45C]" aria-invalid={!!errors.consent} />
          <span>I understand this is a portfolio demonstration: no payment is taken, no real ticket or reservation is created, and nothing guarantees entry to Stamford Bridge.</span>
        </label>
        {errors.consent && (
          <p className="mt-1.5 text-xs text-rose-300" role="alert">
            {errors.consent}
          </p>
        )}
      </div>
    </div>
  );
}

export function PriceLines({ lines, fee, total }: { lines: { label: string; amount: number }[]; fee: number; total: number }) {
  return (
    <dl className="space-y-2 text-sm">
      {lines.map((l) => (
        <div key={l.label} className="flex justify-between gap-4">
          <dt className="text-ivory/80">{l.label}</dt>
          <dd className="tabular-nums">{gbp(l.amount)}</dd>
        </div>
      ))}
      {fee > 0 && (
        <div className="flex justify-between gap-4 text-silver">
          <dt>Demo booking fee</dt>
          <dd className="tabular-nums">{gbp(fee)}</dd>
        </div>
      )}
      <div className="flex justify-between gap-4 border-t border-white/10 pt-3 text-base font-semibold">
        <dt>Total (simulated)</dt>
        <dd className="font-display text-3xl tabular-nums text-gold-300">{gbp(total)}</dd>
      </div>
    </dl>
  );
}

/** A QR-like pattern generated from the booking reference. Deliberately NOT a scannable or valid ticket. */
export function DemoCode({ seed, size = 168 }: { seed: string; size?: number }) {
  const cells = 25;
  const grid = useMemo(() => {
    let h = 2166136261;
    const out: boolean[] = [];
    for (let i = 0; i < cells * cells; i++) {
      h ^= seed.charCodeAt(i % seed.length) + i;
      h = Math.imul(h, 16777619);
      out.push(((h >>> 0) & 7) < 3);
    }
    return out;
  }, [seed]);
  const finder = (x: number, y: number) => {
    const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
    for (const [ox, oy] of [
      [0, 0],
      [cells - 7, 0],
      [0, cells - 7],
    ]) {
      if (inBox(ox, oy)) {
        const dx = x - ox;
        const dy = y - oy;
        return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) ? 1 : 0;
      }
    }
    return -1;
  };
  const s = size / cells;
  return (
    <figure className="inline-block rounded-2xl bg-ivory p-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Demonstration code — not a valid ticket">
        {grid.map((on, i) => {
          const x = i % cells;
          const y = Math.floor(i / cells);
          const f = finder(x, y);
          const fill = f === -1 ? on : f === 1;
          return fill ? <rect key={i} x={x * s} y={y * s} width={s} height={s} fill="#050B1A" /> : null;
        })}
        <rect x={size / 2 - 38} y={size / 2 - 11} width={76} height={22} rx={4} fill="#C9A45C" />
        <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#050B1A" fontFamily="Inter, sans-serif">
          DEMO
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-midnight">Not a ticket</figcaption>
    </figure>
  );
}
