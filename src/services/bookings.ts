import { readJSON, writeJSON } from './storage';
import { DEMO_BOOKING_FEE, EXPERIENCES, PRICE_BANDS, SEAT_SECTIONS, type TicketType } from '@/data/experiences';

/**
 * Demo booking store (frontend only, localStorage). Nothing leaves the browser, nothing is paid
 * and no card details are collected. Availability is generated deterministically so that it is
 * stable between visits but clearly simulated.
 */

const KEY = 'cfc-demo-bookings-v1';

export type BookingStatus = 'confirmed' | 'cancelled';

export interface Visitor {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface BookingBase {
  ref: string;
  createdAt: string;
  status: BookingStatus;
  visitor: Visitor;
  subtotal: number;
  fee: number;
  total: number;
}

export interface TourBooking extends BookingBase {
  type: 'tour';
  experienceId: string;
  date: string;
  slot: string;
  tickets: Partial<Record<TicketType['id'], number>>;
}

export interface MatchBooking extends BookingBase {
  type: 'match';
  fixtureId: string;
  seats: { section: string; row: number; seat: number; price: number }[];
}

export type Booking = TourBooking | MatchBooking;

export function listBookings(): Booking[] {
  return readJSON<Booking[]>(KEY, []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getBooking(ref: string) {
  return listBookings().find((b) => b.ref === ref);
}

function save(all: Booking[]) {
  return writeJSON(KEY, all);
}

export function makeRef(prefix: 'TR' | 'MD') {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  for (const b of bytes) s += alphabet[b % alphabet.length];
  return `DEMO-${prefix}-${s}`;
}

export function addBooking(b: Booking) {
  const ok = save([b, ...listBookings()]);
  if (!ok) throw new Error('Your browser blocked local storage, so the demo booking could not be saved.');
  return b;
}

/** Only future, confirmed bookings can be cancelled. */
export function canCancel(b: Booking, now = new Date()) {
  if (b.status !== 'confirmed') return false;
  const when = b.type === 'tour' ? new Date(`${b.date}T${b.slot}:00`) : null;
  return when ? when > now : true;
}

export function cancelBooking(ref: string) {
  const all = listBookings().map((b) => (b.ref === ref ? { ...b, status: 'cancelled' as const } : b));
  save(all);
}

export function priceTour(experienceId: string, tickets: TourBooking['tickets']) {
  const exp = EXPERIENCES.find((e) => e.id === experienceId);
  if (!exp) return { subtotal: 0, fee: 0, total: 0, count: 0 };
  let subtotal = 0;
  let count = 0;
  for (const [type, qty] of Object.entries(tickets) as [TicketType['id'], number][]) {
    subtotal += exp.prices[type] * (qty || 0);
    count += qty || 0;
  }
  const fee = count > 0 ? DEMO_BOOKING_FEE : 0;
  return { subtotal, fee, total: subtotal + fee, count };
}

// ---- Simulated availability -------------------------------------------------------------

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

/** Remaining places for a tour slot: simulated base load minus places held by local demo bookings. */
export function slotRemaining(experienceId: string, date: string, slot: string) {
  const exp = EXPERIENCES.find((e) => e.id === experienceId);
  if (!exp) return 0;
  const day = new Date(`${date}T12:00:00`).getDay();
  const load = hash(`${experienceId}|${date}|${slot}`) * (day === 0 || day === 6 ? 1.05 : 0.8);
  const base = Math.max(0, Math.round(exp.capacityPerSlot * (1 - load)));
  const held = listBookings()
    .filter((b): b is TourBooking => b.type === 'tour' && b.status === 'confirmed' && b.experienceId === experienceId && b.date === date && b.slot === slot)
    .reduce((n, b) => n + Object.values(b.tickets).reduce((a, q) => a + (q || 0), 0), 0);
  return Math.max(0, base - held);
}

/** Simulated closed days: the demo treats the day before each home match as closed for tours. */
export function isClosedDay(date: string, homeMatchDates: string[]) {
  const d = new Date(`${date}T12:00:00`);
  const next = new Date(d.getTime() + 86400000).toISOString().slice(0, 10);
  return homeMatchDates.includes(date) || homeMatchDates.includes(next);
}

export function seatTaken(fixtureId: string, section: string, row: number, seat: number) {
  const simulated = hash(`${fixtureId}|${section}|${row}|${seat}`) < 0.58;
  if (simulated) return true;
  return listBookings().some(
    (b) => b.type === 'match' && b.status === 'confirmed' && b.fixtureId === fixtureId && b.seats.some((s) => s.section === section && s.row === row && s.seat === seat),
  );
}

export function seatPrice(sectionId: string) {
  const section = SEAT_SECTIONS.find((s) => s.id === sectionId);
  return section ? PRICE_BANDS[section.band].price : 0;
}

export function sectionAvailability(fixtureId: string, sectionId: string) {
  const s = SEAT_SECTIONS.find((x) => x.id === sectionId);
  if (!s) return 0;
  let free = 0;
  for (let r = 1; r <= s.rows; r++) for (let n = 1; n <= s.seatsPerRow; n++) if (!seatTaken(fixtureId, sectionId, r, n)) free++;
  return free;
}
