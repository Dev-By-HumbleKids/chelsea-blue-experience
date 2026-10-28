import { motion } from 'framer-motion';
import { CheckCircle2, Printer } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button, EmptyState, LinkButton } from '@/components/ui';
import { EXPERIENCES, SEAT_SECTIONS, TICKET_TYPES } from '@/data/experiences';
import { FIXTURES } from '@/data/season';
import { fmtDate, fmtDay, fmtTime } from '@/lib/format';
import { useMeta } from '@/lib/hooks';
import { getBooking, type Booking } from '@/services/bookings';
import { DemoCode, DemoNotice, PriceLines } from './shared';

export function bookingTitle(b: Booking) {
  if (b.type === 'tour') return EXPERIENCES.find((e) => e.id === b.experienceId)?.name ?? 'Stadium experience';
  const f = FIXTURES.find((x) => x.id === b.fixtureId);
  return f ? `Chelsea v ${f.opponent}` : 'Matchday';
}

export function bookingWhen(b: Booking) {
  if (b.type === 'tour') return `${fmtDay(b.date)} · ${b.slot}`;
  const f = FIXTURES.find((x) => x.id === b.fixtureId);
  return f ? `${fmtDate(f.kickoff, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${fmtTime(f.kickoff)}` : '';
}

export function bookingLines(b: Booking) {
  if (b.type === 'tour') {
    const exp = EXPERIENCES.find((e) => e.id === b.experienceId);
    return TICKET_TYPES.filter((t) => b.tickets[t.id]).map((t) => ({ label: `${b.tickets[t.id]} × ${t.label}`, amount: (exp?.prices[t.id] ?? 0) * (b.tickets[t.id] ?? 0) }));
  }
  return b.seats.map((s) => ({ label: `${SEAT_SECTIONS.find((x) => x.id === s.section)?.label} · Row ${String.fromCharCode(64 + s.row)} · Seat ${s.seat}`, amount: s.price }));
}

export default function ConfirmationPage() {
  const { ref = '' } = useParams();
  const b = getBooking(ref);
  useMeta('Demo booking confirmed');
  if (!b) {
    return (
      <div className="container-x pt-40">
        <EmptyState level="h1" title="Booking not found" text="Demo bookings live only in the browser where they were made." action={<LinkButton to="/account">My demo bookings</LinkButton>} />
      </div>
    );
  }
  return (
    <div className="container-x max-w-4xl pt-[calc(var(--nav-h)+48px)]">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }} className="no-print mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-400/15 ring-1 ring-emerald-300/40">
        <CheckCircle2 className="h-10 w-10 text-emerald-300" />
      </motion.div>
      <h1 className="display mt-6 text-center text-6xl sm:text-7xl">{b.status === 'cancelled' ? 'Booking cancelled' : 'You’re booked in'}</h1>
      <p className="mt-3 text-center text-ivory-muted">This is a demonstration booking. No payment was taken and no real reservation exists.</p>

      <section className="relative mt-10 overflow-hidden rounded-[28px] bg-gradient-to-br from-royal-600 via-royal-700 to-midnight-800 ring-1 ring-white/10" aria-label="Booking summary">
        <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow text-ivory/70">Demo booking reference</p>
            <p className="mt-1 font-display text-4xl tracking-wider text-gold-300">{b.ref}</p>
            <p className="mt-6 font-display text-4xl leading-none">{bookingTitle(b)}</p>
            <p className="mt-2 text-ivory/80">{bookingWhen(b)}</p>
            <p className="mt-1 text-sm text-ivory/60">
              Lead name: {b.visitor.firstName} {b.visitor.lastName}
            </p>
            <div className="mt-8 max-w-sm">
              <PriceLines lines={bookingLines(b)} fee={b.fee} total={b.total} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <DemoCode seed={b.ref} />
          </div>
        </div>
        <div className="border-t border-dashed border-white/20 bg-midnight/40 px-6 py-4 text-xs text-ivory/70 sm:px-10">Status: {b.status === 'confirmed' ? 'Confirmed (demo)' : 'Cancelled (demo)'} · Saved in this browser only</div>
      </section>

      <DemoNotice className="mt-6" />

      <div className="no-print mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="ghost" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print confirmation
        </Button>
        <LinkButton to="/account">Go to my bookings</LinkButton>
        <LinkButton to="/stadium" variant="quiet">
          Explore the stadium
        </LinkButton>
      </div>
    </div>
  );
}
