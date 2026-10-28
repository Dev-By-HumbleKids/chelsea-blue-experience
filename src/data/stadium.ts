/**
 * Stadium facts and the virtual-tour stops. A stop is marked `photo` only when a licensed photograph
 * of that real location is used; otherwise it is an `illustrative` stop built from the 3D model.
 */
export const STADIUM = {
  name: 'Stamford Bridge',
  address: 'Fulham Road, London SW6 1HS',
  opened: '28 April 1877',
  chelseaHomeSince: 1905,
  capacity: 40044,
  recordAttendance: { figure: 82905, match: 'Chelsea v Arsenal', date: '12 October 1935' },
  pitch: '103 m × 67 m',
  stands: [
    { id: 'matthew-harding', name: 'Matthew Harding Stand', side: 'North', note: 'Named after the late vice-chairman Matthew Harding; home of the loudest singing.' },
    { id: 'east', name: 'East Stand', side: 'East', note: 'The oldest of the current stands, opened in 1974; home to the dugouts and tunnel side media areas.' },
    { id: 'shed', name: 'Shed End', side: 'South', note: 'Named after the famous terrace roof. Peter Osgood’s ashes lie beneath its penalty spot.' },
    { id: 'west', name: 'West Stand', side: 'West', note: 'The largest stand. The Peter Osgood statue stands outside.' },
  ],
  sources: [
    { label: 'Wikipedia — Stamford Bridge', url: 'https://en.wikipedia.org/wiki/Stamford_Bridge_(stadium)' },
    { label: 'chelseafc.com — Stadium tours & museum', url: 'https://www.chelseafc.com/en/stadium-tours-and-museum' },
  ],
};

export type TourStopKind = 'photo' | 'illustrative';

export interface TourStop {
  id: string;
  name: string;
  kicker: string;
  kind: TourStopKind;
  image?: string;
  /** Camera position/target used by the 3D model view for this stop. */
  camera: { pos: [number, number, number]; target: [number, number, number] };
  /** Where the hotspot marker sits in the 3D model. */
  spot: [number, number, number];
  text: string;
  facts: string[];
}

export const TOUR_STOPS: TourStop[] = [
  {
    id: 'exterior', name: 'Fulham Road & the Main Entrance', kicker: 'Arrive', kind: 'photo', image: 'exterior-mueseler',
    camera: { pos: [40, 45, 180], target: [0, 10, 70] },
    spot: [0, 4, 76],
    text: 'Every matchday starts on Fulham Road. The Rising Sun pub where the club was founded in 1905 still stands opposite the ground, now called The Butcher’s Hook.',
    facts: ['Stadium opened in 1877 as an athletics ground', 'Chelsea’s home since 1905', 'Capacity: 40,044'],
  },
  {
    id: 'osgood', name: 'The Peter Osgood Statue', kicker: 'Pay respects', kind: 'photo', image: 'osgood-statue',
    camera: { pos: [26, 8, 108], target: [8, 5, 76] },
    spot: [8, 3, 76],
    text: 'Outside the West Stand, “The King of Stamford Bridge” keeps watch. Osgood scored 150 goals for Chelsea and won the 1970 FA Cup and 1971 Cup Winners’ Cup.',
    facts: ['Unveiled in 2010', 'Osgood scored in every round of the 1970 FA Cup'],
  },
  {
    id: 'bowl', name: 'The Bowl', kicker: 'Take it in', kind: 'photo', image: 'panorama-theodoritsis',
    camera: { pos: [-30, 28, 22], target: [25, 4, -8] },
    spot: [0, 1, 0],
    text: 'Four stands, one sound. From the Matthew Harding Stand in the north to the Shed End in the south, the Bridge wraps tight around the pitch.',
    facts: ['Record crowd: 82,905 v Arsenal, 1935', 'Pitch: 103 m × 67 m'],
  },
  {
    id: 'tunnel', name: 'The Players’ Tunnel', kicker: 'Walk out', kind: 'photo', image: 'ank-06',
    camera: { pos: [10, 3, -24], target: [0, 2, -38] },
    spot: [0, 2, -38],
    text: 'The last few steps before kick-off. The tunnel opens onto the pitch beside the dugouts on the East Stand side.',
    facts: ['Tunnel and dugouts sit on the East Stand side'],
  },
  {
    id: 'walls', name: 'One Life, One Love, One Club', kicker: 'Feel it', kind: 'photo', image: 'ank-27',
    camera: { pos: [-4, 3, -24], target: [-6, 3, -40] },
    spot: [-6, 3, -40],
    text: 'Words on the walls the players pass on the way out. A reminder of who they play for.',
    facts: ['Photographed on the stadium tour'],
  },
  {
    id: 'pitchside', name: 'Pitchside', kicker: 'Stand on the edge', kind: 'photo', image: 'ank-08',
    camera: { pos: [0, 2.2, 26], target: [0, 4, -20] },
    spot: [0, 1, 31],
    text: 'From the touchline, the stands feel close enough to touch — one of the reasons the Bridge is so intimidating for visitors.',
    facts: ['Pitch: 103 m × 67 m'],
  },
  {
    id: 'dugout', name: 'The Dugout', kicker: 'Take the manager’s seat', kind: 'illustrative',
    camera: { pos: [10, 3.5, -24], target: [-8, 1, -36.5] },
    spot: [-8, 2.4, -36.5],
    text: 'Where Mourinho, Ancelotti, Di Matteo, Conte, Tuchel and now Xabi Alonso have watched on. Shown here as an illustrative 3D view.',
    facts: ['Illustrative 3D view — not a photograph'],
  },
  {
    id: 'dressing-room', name: 'Home Dressing Room', kicker: 'Find your shirt', kind: 'illustrative',
    camera: { pos: [34, 16, -16], target: [22, 6, -44] },
    spot: [22, 6, -44],
    text: 'Visitors on the official tour can see the home dressing room. We have no licensed photograph, so this stop uses an illustrative view.',
    facts: ['Illustrative — visit in person on the official stadium tour'],
  },
  {
    id: 'press', name: 'Press Conference Room', kicker: 'Face the cameras', kind: 'illustrative',
    camera: { pos: [-12, 18, -14], target: [-26, 8, -44] },
    spot: [-26, 8, -44],
    text: 'Where managers face the media before and after every match. Illustrative only.',
    facts: ['Illustrative — not a photograph'],
  },
  {
    id: 'museum', name: 'The Museum', kicker: 'Touch history', kind: 'photo', image: 'ank-24',
    camera: { pos: [-120, 34, -120], target: [-72, 6, -62] },
    spot: [-72, 4, -62],
    text: 'Match-worn shirts from the golden era — Terry, Čech, Torres, Mata — sit alongside the trophies and stories from more than a century of football.',
    facts: ['Official museum and tours run separately from this demo'],
  },
  {
    id: 'shed', name: 'The Shed End', kicker: 'Hear the noise', kind: 'photo', image: 'shed-end',
    camera: { pos: [10, 14, 0], target: [64, 10, 0] },
    spot: [58, 6, 0],
    text: 'Named after the famous corrugated roof over the old terrace, the Shed has been the voice of the Bridge for generations.',
    facts: ['Peter Osgood’s ashes rest beneath the Shed End penalty spot'],
  },
];
