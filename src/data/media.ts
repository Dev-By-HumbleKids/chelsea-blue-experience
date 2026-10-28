import type { MediaAsset, MediaLicense } from './types';

/**
 * Central media manifest. Components never hard-code image URLs; they ask for an id here.
 * Every asset records its creator, licence and source page (see also CREDITS.md).
 * Licence-restricted media (e.g. official club photography) may only be listed with
 * license "Restricted"; those are dropped automatically when VITE_PUBLIC_SAFE=true.
 */

const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file.replace(/ /g, '_')}`;
const base = import.meta.env.BASE_URL;

function asset(id: string, alt: string, credit: string, license: MediaLicense, commonsFile: string, focus?: string): MediaAsset {
  return { id, src: `${base}media/${id}.webp`, alt, credit, license, sourceUrl: commons(commonsFile), focus };
}

const ALL: MediaAsset[] = [
  asset('bowl-spurs', 'Stamford Bridge under floodlights during Chelsea v Tottenham', 'Brian Minkoff – London Pixels', 'CC BY-SA 3.0', 'Stamford Bridge Chelsea v Spurs.jpg'),
  asset('fans-psg-2014', 'Chelsea supporters in the stands at Stamford Bridge, April 2014', 'Ben Sutherland', 'CC BY 2.0', 'Chelsea FC v Paris Saint-Germain, 8 April 2014 (6).jpg'),
  asset('pitch-2013', 'The pitch and stands of Stamford Bridge', 'WorldTraveller101', 'CC BY-SA 3.0', 'Stamford Bridge Stadium Football Pitch, 2.22.2013.jpg'),
  asset('exterior-mueseler', 'Exterior of Stamford Bridge, London', 'Arne Müseler', 'CC BY-SA 3.0 de', 'London Stamford Bridge.jpg'),
  asset('shed-view', 'View across Stamford Bridge from the Shed End', 'Neil Theasby', 'CC BY-SA 2.0', 'Stamford Bridge Stadium - view from The Shed End - geograph.org.uk - 3610589.jpg'),
  asset('inside-peterborough', 'Inside Stamford Bridge on a matchday', 'Richard Humphrey', 'CC BY-SA 2.0', 'Inside Stamford Bridge Stadium - Chelsea v Peterborough - geograph.org.uk - 5253336.jpg'),
  asset('panorama-theodoritsis', 'Wide view of the Stamford Bridge bowl', 'theodoritsis', 'CC BY 2.0', 'Stamford Bridge, Chelsea Football Club (44879252174).jpg'),
  asset('shed-end', 'The Shed End stand at Stamford Bridge', 'wallyg (Flickr)', 'CC BY 2.0', 'Shed end.jpg'),
  asset('shed-wall', 'The historic Shed wall outside Stamford Bridge', 'Tom (Flickr)', 'CC BY-SA 2.0', 'Shed wall, Stamford Bridge.jpg'),
  asset('osgood-statue', 'The Peter Osgood statue outside the West Stand at Stamford Bridge', 'Ungry Young Man', 'CC BY 2.0', 'Peter Osgood statue outside Stamford Bridge.jpg', '50% 25%'),
  asset('main-entrance', 'Main entrance to Stamford Bridge', 'Stephane Dhalluin', 'CC BY-SA 2.0', 'Stamford Bridge Football Stadium Main Entrance - geograph.org.uk - 718259.jpg'),
  asset('ank-06', 'Looking up the players’ tunnel towards the pitch at Stamford Bridge', 'Ank Kumar', 'CC BY-SA 4.0', 'Chelsea Football Club, Stamford Bridge (Ank kumar) 06.jpg'),
  asset('ank-08', 'The players’ tunnel opening onto the pitch at Stamford Bridge', 'Ank Kumar', 'CC BY-SA 4.0', 'Chelsea Football Club, Stamford Bridge (Ank kumar) 08.jpg'),
  asset('ank-24', 'Match-worn shirts of Terry, Čech, Torres and Mata in the Chelsea museum', 'Ank Kumar', 'CC BY-SA 4.0', 'Chelsea Football Club, Stamford Bridge (Ank kumar) 24.jpg'),
  asset('ank-25', 'Museum photograph of Chelsea players celebrating with the Premier League trophy', 'Ank Kumar', 'CC BY-SA 4.0', 'Chelsea Football Club, Stamford Bridge (Ank kumar) 25.jpg'),
  asset('ank-27', 'The words “One life, one love, one club” on a wall inside Stamford Bridge', 'Ank Kumar', 'CC BY-SA 4.0', 'Chelsea Football Club, Stamford Bridge (Ank kumar) 27.jpg'),
  asset('spurs-2016', 'Matchday crowd at Stamford Bridge, May 2016', 'CFCUnofficial (Chelsea Debs)', 'CC BY-SA 2.0', 'Chelsea v Spurs 2 May 2016, Spurs scored.jpg'),
  asset('lampard', 'Frank Lampard in Chelsea kit, 2013–14 season', 'Ultraslansi', 'CC BY-SA 3.0', "Frank Lampard'13-14.JPG", '50% 20%'),
  asset('terry', 'John Terry in Chelsea kit, August 2013', 'Warrenfish', 'CC BY-SA 3.0', 'John Terry 01 Chelsea vs AS-Roma 10AUG2013.jpg', '50% 15%'),
  asset('drogba', 'Didier Drogba in Chelsea kit, 2014', 'Ultraslansi', 'CC BY-SA 4.0', "Didier Drogba'14.JPG", '50% 20%'),
  asset('drogba-ucl', 'Didier Drogba celebrating as a Champions League winner', 'rayand', 'CC BY 2.0', 'Didier Drogba Champions League Winner.jpg', '50% 25%'),
  asset('cech', 'Petr Čech in Chelsea kit, 2013', 'Warrenfish', 'CC BY-SA 3.0', 'Petr Čech Chelsea 2013.jpg', '50% 20%'),
  asset('hazard', 'Eden Hazard playing for Chelsea, 2017', 'CFCUnofficial (Chelsea Debs)', 'CC BY-SA 2.0', 'Eden Hazard 2017.jpg', '50% 25%'),
  asset('zola', 'Gianfranco Zola at Stamford Bridge, 2018', 'CFCUnofficial (Chelsea Debs)', 'CC BY-SA 2.0', 'Zola 2018 (cropped).jpg', '50% 25%'),
  asset('palmer', 'Cole Palmer in Chelsea kit, April 2025', 'Timmy96', 'CC0', 'Cole Palmer 20042025 (1).jpg', '50% 18%'),
];

const publicSafe = import.meta.env.VITE_PUBLIC_SAFE !== 'false';

export const MEDIA: Record<string, MediaAsset> = Object.fromEntries(
  ALL.filter((m) => !(publicSafe && m.license === 'Restricted')).map((m) => [m.id, m]),
);

export const ALL_MEDIA = Object.values(MEDIA);

export function media(id: string | undefined): MediaAsset | undefined {
  return id ? MEDIA[id] : undefined;
}
