/**
 * Bookable products for the DEMO booking system. Names describe the kinds of experience a stadium
 * offers; every price, schedule and seat in this file is simulated and is not an official Chelsea
 * price or availability. Real tours: https://tours.chelseafc.com/
 */
export const DEMO_DISCLAIMER = 'Demo data: prices, schedules and availability are simulated and are not official Chelsea FC prices. No payment is taken and no real reservation is made.';

export interface TicketType {
  id: 'adult' | 'concession' | 'junior' | 'under5';
  label: string;
  note: string;
}

export const TICKET_TYPES: TicketType[] = [
  { id: 'adult', label: 'Adult', note: '18–64' },
  { id: 'concession', label: 'Concession', note: '65+ / student' },
  { id: 'junior', label: 'Junior', note: '5–17' },
  { id: 'under5', label: 'Under 5', note: 'Free, with an adult' },
];

export interface Experience {
  id: string;
  name: string;
  kind: 'tour' | 'museum' | 'vip' | 'group';
  duration: string;
  tagline: string;
  description: string;
  includes: string[];
  prices: Record<TicketType['id'], number>;
  slots: string[];
  capacityPerSlot: number;
  maxPerBooking: number;
  image: string;
  featured?: boolean;
}

export const EXPERIENCES: Experience[] = [
  {
    id: 'stadium-tour', name: 'Stadium Tour & Museum', kind: 'tour', duration: '≈ 60 min tour + museum', featured: true,
    tagline: 'Walk the tunnel. Sit in the dugout.',
    description: 'A guided route through the dressing room, the tunnel, pitchside and the dugouts, followed by free time in the museum.',
    includes: ['Guided tour', 'Home dressing room', 'Players’ tunnel & dugout', 'Museum entry'],
    prices: { adult: 32, concession: 24, junior: 18, under5: 0 },
    slots: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'], capacityPerSlot: 30, maxPerBooking: 10, image: 'ank-08',
  },
  {
    id: 'legends-tour', name: 'Legends Tour', kind: 'vip', duration: '≈ 90 min',
    tagline: 'Hear the stories from someone who lived them.',
    description: 'An extended tour format hosted by a former player, with stories from the golden era and time for photos.',
    includes: ['Hosted by a former player', 'Extended route', 'Photo opportunity', 'Museum entry'],
    prices: { adult: 85, concession: 75, junior: 60, under5: 0 },
    slots: ['11:30', '14:30'], capacityPerSlot: 20, maxPerBooking: 6, image: 'ank-24',
  },
  {
    id: 'museum-only', name: 'Museum Visit', kind: 'museum', duration: 'Self-guided',
    tagline: 'More than a century of silverware and stories.',
    description: 'Self-guided entry to the museum: trophies, shirts and interactive exhibits.',
    includes: ['Museum entry', 'Interactive exhibits'],
    prices: { adult: 14, concession: 10, junior: 8, under5: 0 },
    slots: ['09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30'], capacityPerSlot: 60, maxPerBooking: 12, image: 'ank-25',
  },
  {
    id: 'group-visit', name: 'Group & School Visit', kind: 'group', duration: '≈ 75 min',
    tagline: 'For clubs, schools and teams of 10+.',
    description: 'A tour adapted for groups, with a dedicated guide.',
    includes: ['Dedicated guide', 'Tour + museum', 'Group photo'],
    prices: { adult: 26, concession: 20, junior: 14, under5: 0 },
    slots: ['10:15', '13:15'], capacityPerSlot: 40, maxPerBooking: 40, image: 'inside-peterborough',
  },
];

/** Demo booking fee per booking, shown on the price breakdown. */
export const DEMO_BOOKING_FEE = 1.5;

/** Days within which tours are bookable, starting tomorrow. */
export const BOOKING_WINDOW_DAYS = 60;

/** Matchday seating for the simulated seat map. */
export interface SeatSection {
  id: string;
  stand: 'Matthew Harding Stand' | 'East Stand' | 'Shed End' | 'West Stand';
  label: string;
  band: 'A' | 'B' | 'C' | 'Premium';
  rows: number;
  seatsPerRow: number;
}

export const PRICE_BANDS: Record<SeatSection['band'], { label: string; price: number }> = {
  Premium: { label: 'Premium', price: 120 },
  A: { label: 'Band A', price: 75 },
  B: { label: 'Band B', price: 58 },
  C: { label: 'Band C', price: 42 },
};

export const SEAT_SECTIONS: SeatSection[] = [
  { id: 'MH-L', stand: 'Matthew Harding Stand', label: 'MH Lower', band: 'B', rows: 8, seatsPerRow: 18 },
  { id: 'MH-U', stand: 'Matthew Harding Stand', label: 'MH Upper', band: 'C', rows: 8, seatsPerRow: 18 },
  { id: 'E-L', stand: 'East Stand', label: 'East Lower', band: 'A', rows: 8, seatsPerRow: 22 },
  { id: 'E-M', stand: 'East Stand', label: 'East Middle', band: 'Premium', rows: 6, seatsPerRow: 22 },
  { id: 'SH-L', stand: 'Shed End', label: 'Shed Lower', band: 'B', rows: 8, seatsPerRow: 18 },
  { id: 'SH-U', stand: 'Shed End', label: 'Shed Upper', band: 'C', rows: 8, seatsPerRow: 18 },
  { id: 'W-L', stand: 'West Stand', label: 'West Lower', band: 'A', rows: 8, seatsPerRow: 22 },
  { id: 'W-U', stand: 'West Stand', label: 'West Upper', band: 'B', rows: 8, seatsPerRow: 22 },
];

export const MAX_MATCH_SEATS = 4;
