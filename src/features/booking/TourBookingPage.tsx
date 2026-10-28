import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/components/Toaster';
import { Button, Img } from '@/components/ui';
import { BOOKING_WINDOW_DAYS, EXPERIENCES, TICKET_TYPES, type TicketType } from '@/data/experiences';
import { FIXTURES } from '@/data/season';
import { cx, fmtDay, gbp, isoDay } from '@/lib/format';
import { useMeta } from '@/lib/hooks';
import { addBooking, isClosedDay, makeRef, priceTour, slotRemaining, type TourBooking, type Visitor } from '@/services/bookings';
import { getProfile } from '@/services/profile';
import { DemoNotice, PriceLines, Steps, validateVisitor, VisitorForm, type VisitorErrors } from './shared';

const STEPS = ['Experience', 'Date', 'Time', 'Tickets', 'Your details', 'Review'];

const homeMatchDays = FIXTURES.filter((f) => f.venue === 'H').map((f) => f.kickoff.slice(0, 10));

function Calendar({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const last = new Date(today.getFullYear(), today.getMonth(), today.getDate() + BOOKING_WINDOW_DAYS);
  const [cursor, setCursor] = useState(() => new Date(first.getFullYear(), first.getMonth(), 1));
  const days = useMemo(() => {
    const start = new Date(cursor);
    const offset = (start.getDay() + 6) % 7; // Monday-first
    const out: (Date | null)[] = Array.from({ length: offset }, () => null);
    const n = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= n; d++) out.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    return out;
  }, [cursor]);
  const canPrev = cursor > new Date(first.getFullYear(), first.getMonth(), 1);
  const canNext = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1) <= last;

  return (
    <div className="max-w-md">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" disabled={!canPrev} onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/15 disabled:opacity-30" aria-label="Previous month">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="font-display text-2xl tracking-wide" aria-live="polite">
          {cursor.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </p>
        <button type="button" disabled={!canNext} onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/15 disabled:opacity-30" aria-label="Next month">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] uppercase tracking-wider text-silver" aria-hidden>
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1.5" role="grid" aria-label="Choose a date">
        {days.map((d, i) => {
          if (!d) return <span key={i} />;
          const iso = isoDay(d);
          const out = d < first || d > last;
          const closed = isClosedDay(iso, homeMatchDays);
          const disabled = out || closed;
          const selected = value === iso;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso)}
              aria-pressed={selected}
              aria-label={`${fmtDay(iso)}${closed && !out ? ' — closed (matchday)' : ''}`}
              className={cx(
                'relative aspect-square rounded-xl text-sm font-semibold transition-colors',
                selected ? 'bg-gold text-midnight' : disabled ? 'cursor-not-allowed text-white/20' : 'bg-white/[0.04] ring-1 ring-white/10 hover:bg-royal/40',
              )}
            >
              {d.getDate()}
              {closed && !out && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-rose-300/70" aria-hidden />}
            </button>
          );
        })}
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-silver">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-300/70" aria-hidden /> Closed for tours on and the day before home matches (demo rule)
      </p>
    </div>
  );
}

export default function TourBookingPage() {
  const { experienceId } = useParams();
  const navigate = useNavigate();
  const initial = EXPERIENCES.find((e) => e.id === experienceId);
  useMeta('Book a stadium experience', 'A complete demo booking flow for Stamford Bridge tours and the museum.');
  const [step, setStep] = useState(initial ? 1 : 0);
  const [expId, setExpId] = useState(initial?.id ?? '');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [tickets, setTickets] = useState<Partial<Record<TicketType['id'], number>>>({ adult: 0, concession: 0, junior: 0, under5: 0 });
  const profile = getProfile();
  const [visitor, setVisitor] = useState<Visitor>({ firstName: profile.displayName.split(' ')[0] ?? '', lastName: profile.displayName.split(' ').slice(1).join(' '), email: profile.email, phone: '' });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<VisitorErrors>({});
  const [ticketError, setTicketError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const exp = EXPERIENCES.find((e) => e.id === expId);
  const price = priceTour(expId, tickets);
  const remaining = exp && date && slot ? slotRemaining(exp.id, date, slot) : 0;

  const validateTickets = () => {
    if (!exp) return 'Choose an experience first.';
    if (price.count === 0) return 'Add at least one ticket.';
    const adults = (tickets.adult ?? 0) + (tickets.concession ?? 0);
    if (adults === 0) return 'Juniors and under-5s must be accompanied by at least one adult or concession ticket.';
    if (price.count > exp.maxPerBooking) return `A maximum of ${exp.maxPerBooking} tickets can be booked at once for this experience.`;
    if (price.count > remaining) return `Only ${remaining} places are left in this slot. Reduce the quantity or choose another time.`;
    if (exp.kind === 'group' && price.count < 10) return 'Group visits need at least 10 people.';
    return '';
  };

  const next = () => {
    if (step === 0 && !exp) return;
    if (step === 1 && !date) return;
    if (step === 2 && !slot) return;
    if (step === 3) {
      const e = validateTickets();
      setTicketError(e);
      if (e) return;
    }
    if (step === 4) {
      const e = validateVisitor(visitor, consent);
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirm = () => {
    if (!exp) return;
    // Re-check availability at submit time; another demo booking may have taken places.
    const err = validateTickets();
    if (err) {
      setTicketError(err);
      setStep(3);
      return;
    }
    setSubmitting(true);
    const booking: TourBooking = {
      type: 'tour',
      ref: makeRef('TR'),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      visitor,
      experienceId: exp.id,
      date,
      slot,
      tickets,
      subtotal: price.subtotal,
      fee: price.fee,
      total: price.total,
    };
    try {
      addBooking(booking);
      toast('Demo booking confirmed');
      navigate(`/tickets/confirmation/${booking.ref}`);
    } catch (e) {
      toast((e as Error).message, 'info');
      setSubmitting(false);
    }
  };

  const canContinue = [!!exp, !!date, !!slot, price.count > 0, true, true][step];

  return (
    <div className="container-x pt-[calc(var(--nav-h)+40px)]">
      <button type="button" onClick={() => (step > 0 ? setStep(step - 1) : navigate('/tickets'))} className="inline-flex items-center gap-2 text-sm text-silver hover:text-ivory">
        <ArrowLeft className="h-4 w-4" /> {step > 0 ? 'Back' : 'Tickets & tours'}
      </button>
      <h1 className="display mt-6 text-6xl sm:text-7xl">Book a stadium experience</h1>
      <div className="mt-8">
        <Steps steps={STEPS} current={step} onJump={setStep} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <motion.section key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} aria-labelledby="step-title" className="min-w-0">
            <h2 id="step-title" className="mb-6 font-display text-4xl tracking-wide">
              {['Choose your experience', 'Choose a date', 'Choose a time', 'Tickets', 'Your details', 'Review & confirm'][step]}
            </h2>

            {step === 0 && (
              <ul className="grid gap-4 sm:grid-cols-2">
                {EXPERIENCES.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setExpId(e.id);
                        setSlot('');
                      }}
                      aria-pressed={expId === e.id}
                      className={cx('group relative flex h-56 w-full flex-col justify-end overflow-hidden rounded-[22px] p-5 text-left ring-2 transition-shadow', expId === e.id ? 'ring-gold' : 'ring-transparent hover:ring-white/30')}
                    >
                      <Img id={e.image} className="absolute inset-0 h-full w-full" />
                      <span className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/60 to-transparent" />
                      <span className="relative">
                        <span className="block font-display text-3xl leading-none">{e.name}</span>
                        <span className="mt-1 block text-sm text-ivory/80">
                          {e.duration} · from {gbp(Math.min(...Object.values(e.prices).filter(Boolean)))}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {step === 1 && <Calendar value={date} onChange={(d) => { setDate(d); setSlot(''); }} />}

            {step === 2 && exp && (
              <div>
                <p className="mb-4 text-ivory-muted">{fmtDay(date)}</p>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {exp.slots.map((t) => {
                    const left = slotRemaining(exp.id, date, t);
                    const sold = left === 0;
                    return (
                      <li key={t}>
                        <button
                          type="button"
                          disabled={sold}
                          onClick={() => setSlot(t)}
                          aria-pressed={slot === t}
                          className={cx('w-full rounded-2xl p-4 text-left ring-1 transition-colors', slot === t ? 'bg-gold text-midnight ring-gold' : sold ? 'cursor-not-allowed opacity-40 ring-white/10' : 'bg-white/[0.04] ring-white/10 hover:bg-royal/30')}
                        >
                          <span className="block font-display text-3xl">{t}</span>
                          <span className={cx('text-xs', slot === t ? 'text-midnight/70' : left < 6 ? 'text-amber-300' : 'text-silver')}>{sold ? 'Sold out' : `${left} places left`}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {step === 3 && exp && (
              <div>
                <ul className="divide-y divide-white/[0.08] rounded-2xl bg-white/[0.03] ring-1 ring-white/10">
                  {TICKET_TYPES.map((t) => {
                    const q = tickets[t.id] ?? 0;
                    return (
                      <li key={t.id} className="flex items-center gap-4 p-4">
                        <div className="flex-1">
                          <p className="font-semibold">{t.label}</p>
                          <p className="text-xs text-silver">
                            {t.note} · {exp.prices[t.id] ? gbp(exp.prices[t.id]) : 'Free'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => setTickets({ ...tickets, [t.id]: Math.max(0, q - 1) })} disabled={q === 0} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/20 disabled:opacity-30" aria-label={`Remove one ${t.label} ticket`}>
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-6 text-center font-display text-2xl tabular-nums" aria-live="polite" aria-label={`${q} ${t.label} tickets`}>
                            {q}
                          </span>
                          <button type="button" onClick={() => setTickets({ ...tickets, [t.id]: q + 1 })} disabled={price.count >= exp.maxPerBooking} className="grid h-10 w-10 place-items-center rounded-full bg-royal disabled:opacity-30" aria-label={`Add one ${t.label} ticket`}>
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-xs text-silver">
                  Up to {exp.maxPerBooking} tickets per booking · {remaining} places left at {slot}
                </p>
                {ticketError && (
                  <p className="mt-4 rounded-xl bg-rose-400/10 p-3 text-sm text-rose-200 ring-1 ring-rose-300/30" role="alert">
                    {ticketError}
                  </p>
                )}
              </div>
            )}

            {step === 4 && <VisitorForm value={visitor} onChange={setVisitor} errors={errors} consent={consent} onConsent={setConsent} />}

            {step === 5 && exp && (
              <div className="space-y-6">
                <dl className="grid gap-4 rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/10 sm:grid-cols-2">
                  {[
                    ['Experience', exp.name],
                    ['Date', fmtDay(date)],
                    ['Time', slot],
                    ['Lead visitor', `${visitor.firstName} ${visitor.lastName}`],
                    ['Email', visitor.email],
                    ['Tickets', TICKET_TYPES.filter((t) => tickets[t.id]).map((t) => `${tickets[t.id]} × ${t.label}`).join(', ')],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-silver">{k}</dt>
                      <dd className="mt-1">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="rounded-2xl bg-white/[0.03] p-6 text-sm text-ivory-muted ring-1 ring-white/10">
                  <p className="font-semibold text-ivory">Demo booking policy</p>
                  <p className="mt-2">You can cancel this demo booking from your demo account at any time before the tour starts. Nothing is charged, so there is nothing to refund.</p>
                </div>
                <DemoNotice />
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              {step < 5 ? (
                <Button onClick={next} disabled={!canContinue}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={confirm} disabled={submitting} variant="gold">
                  {submitting ? 'Confirming…' : `Confirm demo booking · ${gbp(price.total)}`}
                </Button>
              )}
            </div>
        </motion.section>

        <aside className="h-fit rounded-[24px] bg-gradient-to-b from-midnight-700 to-midnight-800 p-6 ring-1 ring-white/10 lg:sticky lg:top-[calc(var(--nav-h)+24px)]">
          <p className="eyebrow mb-4">Your booking</p>
          {exp ? (
            <>
              <div className="aspect-[16/9] overflow-hidden rounded-2xl">
                <Img id={exp.image} className="h-full w-full" />
              </div>
              <p className="mt-4 font-display text-3xl leading-none">{exp.name}</p>
              <p className="mt-1 text-sm text-silver">
                {date ? fmtDay(date) : 'Date not chosen'}
                {slot && ` · ${slot}`}
              </p>
              <ul className="mt-4 space-y-1 text-xs text-ivory/70">
                {exp.includes.map((x) => (
                  <li key={x}>✓ {x}</li>
                ))}
              </ul>
              <div className="mt-6">
                <PriceLines
                  lines={TICKET_TYPES.filter((t) => tickets[t.id]).map((t) => ({ label: `${tickets[t.id]} × ${t.label}`, amount: exp.prices[t.id] * (tickets[t.id] ?? 0) }))}
                  fee={price.fee}
                  total={price.total}
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-silver">Choose an experience to start.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
