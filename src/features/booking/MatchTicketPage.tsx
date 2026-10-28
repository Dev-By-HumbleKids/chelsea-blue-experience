import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/components/Toaster';
import { Button, EmptyState, LinkButton, ProvenanceTag, TeamBadge } from '@/components/ui';
import { DEMO_BOOKING_FEE, MAX_MATCH_SEATS, PRICE_BANDS, SEAT_SECTIONS, type SeatSection } from '@/data/experiences';
import { FIXTURES } from '@/data/season';
import { cx, fmtDate, fmtTime, gbp } from '@/lib/format';
import { useMeta } from '@/lib/hooks';
import { addBooking, makeRef, sectionAvailability, seatPrice, seatTaken, type MatchBooking, type Visitor } from '@/services/bookings';
import { getProfile } from '@/services/profile';
import { isBookable } from '@/services/provider';
import { DemoNotice, PriceLines, Steps, validateVisitor, VisitorForm, type VisitorErrors } from './shared';

const STEPS = ['Seats', 'Your details', 'Review'];

const bandColour: Record<SeatSection['band'], string> = {
  Premium: '#C9A45C',
  A: '#2A6BC4',
  B: '#1E58A8',
  C: '#16457F',
};

/**
 * Stylised plan of the four stands, each split into two sections. Geometry is illustrative.
 * Layout: Matthew Harding (north) top, Shed End (south) bottom, West left, East right.
 */
const SHAPES: Record<string, { d: string; label: [number, number] }> = {
  'MH-L': { d: 'M110 70 H490 L470 100 H130 Z', label: [300, 88] },
  'MH-U': { d: 'M80 30 H520 L490 66 H110 Z', label: [300, 50] },
  'SH-L': { d: 'M130 400 H470 L490 430 H110 Z', label: [300, 418] },
  'SH-U': { d: 'M110 434 H490 L520 470 H80 Z', label: [300, 455] },
  'W-L': { d: 'M70 110 L100 130 V370 L70 390 Z', label: [86, 250] },
  'W-U': { d: 'M20 80 L64 108 V392 L20 420 Z', label: [42, 250] },
  'E-L': { d: 'M530 110 L500 130 V370 L530 390 Z', label: [514, 250] },
  'E-M': { d: 'M580 80 L536 108 V392 L580 420 Z', label: [558, 250] },
};

interface PickedSeat {
  section: string;
  row: number;
  seat: number;
  price: number;
}

export default function MatchTicketPage() {
  const { fixtureId } = useParams();
  const fixture = FIXTURES.find((f) => f.id === fixtureId);
  const navigate = useNavigate();
  useMeta(fixture && isBookable(fixture) ? `Seats: Chelsea v ${fixture.opponent}` : 'Seats not available');
  const [step, setStep] = useState(0);
  const [section, setSection] = useState<string>('E-L');
  const [picked, setPicked] = useState<PickedSeat[]>([]);
  const profile = getProfile();
  const [visitor, setVisitor] = useState<Visitor>({ firstName: profile.displayName.split(' ')[0] ?? '', lastName: profile.displayName.split(' ').slice(1).join(' '), email: profile.email, phone: '' });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<VisitorErrors>({});
  const [limitMsg, setLimitMsg] = useState('');

  const availability = useMemo(() => (fixture ? Object.fromEntries(SEAT_SECTIONS.map((s) => [s.id, sectionAvailability(fixture.id, s.id)])) : {}), [fixture]);

  if (!fixture || !isBookable(fixture)) {
    return (
      <div className="container-x pt-40">
        <EmptyState level="h1"
          title={fixture ? 'Seats not available' : 'Match not found'}
          text={fixture ? 'Demo seat selection is only offered for upcoming home matches in the current snapshot.' : undefined}
          action={<LinkButton to="/tickets">Back to tickets</LinkButton>}
        />
      </div>
    );
  }

  const sec = SEAT_SECTIONS.find((s) => s.id === section)!;
  const subtotal = picked.reduce((n, s) => n + s.price, 0);
  const fee = picked.length ? DEMO_BOOKING_FEE : 0;

  const toggleSeat = (row: number, seat: number) => {
    const exists = picked.find((p) => p.section === section && p.row === row && p.seat === seat);
    if (exists) {
      setPicked(picked.filter((p) => p !== exists));
      setLimitMsg('');
      return;
    }
    if (picked.length >= MAX_MATCH_SEATS) {
      setLimitMsg(`You can select up to ${MAX_MATCH_SEATS} seats per booking.`);
      return;
    }
    setPicked([...picked, { section, row, seat, price: seatPrice(section) }]);
  };

  const confirm = () => {
    const stillFree = picked.every((p) => !seatTaken(fixture.id, p.section, p.row, p.seat));
    if (!stillFree) {
      toast('One of your seats was just taken. Please choose again.', 'info');
      setPicked([]);
      setStep(0);
      return;
    }
    const booking: MatchBooking = {
      type: 'match',
      ref: makeRef('MD'),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      visitor,
      fixtureId: fixture.id,
      seats: picked,
      subtotal,
      fee,
      total: subtotal + fee,
    };
    try {
      addBooking(booking);
      toast('Demo seats reserved');
      navigate(`/tickets/confirmation/${booking.ref}`);
    } catch (e) {
      toast((e as Error).message, 'info');
    }
  };

  const next = () => {
    if (step === 0 && picked.length === 0) return;
    if (step === 1) {
      const e = validateVisitor(visitor, consent);
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-x pt-[calc(var(--nav-h)+40px)]">
      <Link to="/tickets#matchdays" className="inline-flex items-center gap-2 text-sm text-silver hover:text-ivory">
        <ArrowLeft className="h-4 w-4" /> Matchdays
      </Link>
      <div className="mt-6 flex flex-wrap items-center gap-5">
        <TeamBadge short="CHE" home size={60} />
        <div>
          <h1 className="display text-5xl sm:text-6xl">Chelsea v {fixture.opponent}</h1>
          <p className="text-ivory/80">
            {fixture.competition} · {fmtDate(fixture.kickoff, { weekday: 'long', day: 'numeric', month: 'long' })} · {fmtTime(fixture.kickoff)} · Stamford Bridge
          </p>
        </div>
        <ProvenanceTag kind="demo">Simulated seats & prices</ProvenanceTag>
      </div>
      <div className="mt-8">
        <Steps steps={STEPS} current={step} onJump={setStep} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <section aria-labelledby="seat-step" className="min-w-0">
          <h2 id="seat-step" className="sr-only">
            {STEPS[step]}
          </h2>
          {step === 0 && (
            <>
              <div className="rounded-[24px] bg-midnight-800 p-4 ring-1 ring-white/10">
                <svg viewBox="0 0 600 500" className="mx-auto w-full max-w-2xl" role="group" aria-label="Stadium sections. Choose a section to see its seats.">
                  <rect x="130" y="130" width="340" height="240" rx="6" fill="#1f6b2e" />
                  <rect x="140" y="140" width="320" height="220" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                  <line x1="300" y1="140" x2="300" y2="360" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                  <circle cx="300" cy="250" r="30" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                  <text x="300" y="255" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.55)" fontFamily="Inter">
                    PITCH
                  </text>
                  {SEAT_SECTIONS.map((s) => {
                    const shape = SHAPES[s.id];
                    const active = section === s.id;
                    const free = availability[s.id] ?? 0;
                    return (
                      <g
                        key={s.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={active}
                        aria-label={`${s.label}, ${s.stand}, ${PRICE_BANDS[s.band].label} ${gbp(PRICE_BANDS[s.band].price)}, ${free} seats free`}
                        onClick={() => setSection(s.id)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSection(s.id))}
                        className="cursor-pointer outline-none [&:focus-visible>path]:stroke-gold"
                      >
                        <path d={shape.d} fill={bandColour[s.band]} opacity={active ? 1 : 0.6} stroke={active ? '#F5F2EA' : 'rgba(5,11,26,0.8)'} strokeWidth={active ? 3 : 2} className="transition-opacity hover:opacity-100" />
                        <text x={shape.label[0]} y={shape.label[1]} textAnchor="middle" fontSize="11" fontWeight="700" fill="#F5F2EA" fontFamily="Inter" pointerEvents="none" transform={s.id.startsWith('W') || s.id.startsWith('E') ? `rotate(-90 ${shape.label[0]} ${shape.label[1]})` : undefined}>
                          {s.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <ul className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-silver">
                  {(Object.keys(PRICE_BANDS) as SeatSection['band'][]).map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded" style={{ background: bandColour[b] }} /> {PRICE_BANDS[b].label} · {gbp(PRICE_BANDS[b].price)}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-[24px] bg-midnight-800 p-5 ring-1 ring-white/10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-3xl">{sec.label}</p>
                    <p className="text-xs text-silver">
                      {sec.stand} · {PRICE_BANDS[sec.band].label} · {gbp(PRICE_BANDS[sec.band].price)} per seat · {availability[sec.id]} free
                    </p>
                  </div>
                  <ul className="flex flex-wrap gap-4 text-xs text-silver">
                    <li className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-royal-400" /> Available
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-gold" /> Selected
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-white/10" /> Unavailable
                    </li>
                  </ul>
                </div>
                <p className="mt-4 rounded-full bg-[#1f6b2e]/40 py-1 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-ivory/70">Pitch this way</p>
                <div className="mt-3 overflow-x-auto pb-2">
                  <div className="mx-auto w-max space-y-1.5" role="grid" aria-label={`Seats in ${sec.label}`}>
                    {Array.from({ length: sec.rows }, (_, r) => r + 1).map((row) => (
                      <div key={row} role="row" className="flex items-center gap-1.5">
                        <span className="w-6 text-right text-[10px] text-silver" aria-hidden>
                          {String.fromCharCode(64 + row)}
                        </span>
                        {Array.from({ length: sec.seatsPerRow }, (_, n) => n + 1).map((seat) => {
                          const taken = seatTaken(fixture.id, section, row, seat);
                          const sel = picked.some((p) => p.section === section && p.row === row && p.seat === seat);
                          return (
                            <button
                              key={seat}
                              type="button"
                              role="gridcell"
                              disabled={taken}
                              aria-pressed={sel}
                              aria-label={`Row ${String.fromCharCode(64 + row)}, seat ${seat}${taken ? ', unavailable' : sel ? ', selected' : ''}`}
                              onClick={() => toggleSeat(row, seat)}
                              className={cx('h-6 w-6 rounded-t-md rounded-b-sm transition-transform sm:h-7 sm:w-7', taken ? 'cursor-not-allowed bg-white/10' : sel ? 'scale-110 bg-gold' : 'bg-royal-400 hover:bg-royal-300')}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                {limitMsg && (
                  <p className="mt-3 text-sm text-amber-300" role="alert">
                    {limitMsg}
                  </p>
                )}
              </div>
            </>
          )}

          {step === 1 && <VisitorForm value={visitor} onChange={setVisitor} errors={errors} consent={consent} onConsent={setConsent} />}

          {step === 2 && (
            <div className="space-y-6">
              <dl className="grid gap-4 rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/10 sm:grid-cols-2">
                {[
                  ['Match', `Chelsea v ${fixture.opponent}`],
                  ['Kick-off', `${fmtDate(fixture.kickoff)} · ${fmtTime(fixture.kickoff)}`],
                  ['Lead name', `${visitor.firstName} ${visitor.lastName}`],
                  ['Email', visitor.email],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-silver">{k}</dt>
                    <dd className="mt-1">{v}</dd>
                  </div>
                ))}
              </dl>
              <DemoNotice />
              <p className="text-sm text-ivory-muted">This simulated reservation does not guarantee entry to any Chelsea match. Real match tickets are sold only through the club’s official ticketing channels.</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {step < 2 ? (
              <Button onClick={next} disabled={step === 0 && picked.length === 0}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="gold" onClick={confirm}>
                Confirm demo reservation · {gbp(subtotal + fee)}
              </Button>
            )}
            {step > 0 && (
              <Button variant="quiet" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
          </div>
        </section>

        <aside className="h-fit rounded-[24px] bg-gradient-to-b from-midnight-700 to-midnight-800 p-6 ring-1 ring-white/10 lg:sticky lg:top-[calc(var(--nav-h)+24px)]" aria-live="polite">
          <p className="eyebrow mb-4">
            Your seats ({picked.length}/{MAX_MATCH_SEATS})
          </p>
          {picked.length === 0 ? (
            <p className="text-sm text-silver">Choose a section on the plan, then pick up to {MAX_MATCH_SEATS} seats.</p>
          ) : (
            <ul className="mb-6 space-y-2">
              {picked.map((p) => {
                const s = SEAT_SECTIONS.find((x) => x.id === p.section)!;
                return (
                  <li key={`${p.section}-${p.row}-${p.seat}`} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-3 py-2 text-sm">
                    <span>
                      {s.label} · Row {String.fromCharCode(64 + p.row)} · Seat {p.seat}
                    </span>
                    <span className="flex items-center gap-2">
                      {gbp(p.price)}
                      {step === 0 && (
                        <button type="button" onClick={() => setPicked(picked.filter((x) => x !== p))} className="grid h-6 w-6 place-items-center rounded-full hover:bg-white/10" aria-label="Remove seat">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          {picked.length > 0 && <PriceLines lines={[{ label: `${picked.length} seat${picked.length > 1 ? 's' : ''}`, amount: subtotal }]} fee={fee} total={subtotal + fee} />}
        </aside>
      </div>
    </div>
  );
}
