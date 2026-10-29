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

/**
 * Club crests are registered trademarks. They live in public/media/restricted and are
 * shown when VITE_PUBLIC_SAFE=false (the GitHub Pages build sets this).
 */
const CRESTS: Record<string, [club: string, file: string]> = {
  CHE: ['Chelsea FC', 'Chelsea FC.svg'],
  FUL: ['Fulham', 'Fulham FC.svg'],
  LUT: ['Luton Town', 'Luton Town logo.svg'],
  BHA: ['Brighton & Hove Albion', 'Brighton and Hove Albion FC crest.svg'],
  ARS: ['Arsenal', 'Arsenal FC.svg'],
  LEE: ['Leeds United', 'Leeds United F.C. logo.svg'],
  HUL: ['Hull City', 'Hull City A.F.C. logo.svg'],
  BRE: ['Brentford', 'Brentford FC crest.svg'],
  BOU: ['AFC Bournemouth', 'AFC Bournemouth (2013).svg'],
  EVE: ['Everton', 'Everton FC logo.svg'],
  TOT: ['Tottenham Hotspur', 'Tottenham Hotspur.svg'],
  LIV: ['Liverpool', 'Liverpool FC.svg'],
  MUN: ['Manchester United', 'Manchester United FC crest.svg'],
  SUN: ['Sunderland', 'Logo Sunderland.svg'],
  NFO: ['Nottingham Forest', 'Nottingham Forest F.C. logo.svg'],
  CRY: ['Crystal Palace', 'Crystal Palace FC logo (2022).svg'],
  MCI: ['Manchester City', 'Manchester City FC badge.svg'],
  AVL: ['Aston Villa', 'Aston Villa FC new crest.svg'],
  COV: ['Coventry City', 'Coventry City FC crest.svg'],
  IPS: ['Ipswich Town', 'Ipswich Town.svg'],
  NEW: ['Newcastle United', 'Newcastle United FC 2026 crest.svg'],
};

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
  asset('trophy-ucl', 'The UEFA Champions League trophy', 'Melon5541', 'CC BY-SA 4.0', 'Champions league trophy.jpg', '50% 40%'),
  asset('trophy-pl', 'The Premier League trophy on display', 'Ank Kumar', 'CC BY-SA 4.0', "Premier League Trophy at Manchester's National Football Museum (Ank Kumar) 01.jpg", '50% 45%'),
  asset('trophy-fa', 'The FA Cup trophy', 'Carlos yo', 'CC BY-SA 4.0', 'The FA Cup Trophy.jpg', '50% 45%'),
  asset('trophy-uel', 'The UEFA Europa League trophy on display', 'Damine178', 'CC BY-SA 4.0', 'Europa league trophy.jpg', '78% 60%'),
  asset('trophy-uecl', 'The UEFA Conference League trophy', 'Totti', 'CC BY-SA 4.0', 'UEFA Europa Conference League Trophy.jpg', '50% 45%'),
  asset('trophy-cwc', 'The UEFA Cup Winners’ Cup trophy on display', 'Ank Kumar', 'CC BY-SA 4.0', "UEFA Cup Winners' Cup trophy at Manchester National Football Museum (Ank Kumar) 01.jpg", '50% 55%'),
  asset('trophy-shield', 'The FA Community Shield', 'Seth Whales', 'CC BY-SA 3.0', 'FA Community Shield.JPG'),
  asset('trophy-lc', 'The League Cup trophy on display', 'FYI2023', 'CC0', 'EFL Cup trophy displyed in Liverpool FC museum.jpg', '50% 55%'),
  asset('trophy-usc', 'The UEFA Super Cup trophy', 'Rafael Curtinaz Severo', 'CC BY 2.0', 'Troféu da UEFA Super Cup.jpg', '50% 45%'),
  asset('trophy-fcwc', 'Chelsea players lift the FIFA Club World Cup in New Jersey, July 2025', 'The White House', 'Public domain', 'F20250713AH-3842 President Donald Trump and First Lady Melania Trump attend the FIFA Club World Cup Final soccer match.jpg', '85% 35%'),
  asset('p-martinez', "Emiliano Martínez playing for Argentina, July 2026", "Bryan Berlin", "CC BY-SA 4.0", "Emiliano Martinez Argentina v Spain 19 July 2026-269.jpg", '50% 18%'),
  asset('p-sharman-lowe', "Teddy Sharman-Lowe in goal, January 2025", "Mtaylor848", "CC BY-SA 4.0", "Doncaster Rovers v Harrogate Town (25th January 2025) 013.jpg", '50% 18%'),
  asset('p-penders', "Mike Penders playing for Belgium, July 2026", "Bryan Berlin", "CC BY-SA 4.0", "Mike Penders Belgium v USA 6 July 2026-155.jpg", '50% 18%'),
  asset('p-lacroix', "Maxence Lacroix playing for France, June 2026", "Bryan Berlin", "CC BY-SA 4.0", "Maxence Lacroix France v Norway 26 June 26-031 (cropped).jpg", '50% 18%'),
  asset('p-colwill', "Levi Colwill at the 2025 FIFA Club World Cup final", "The White House", "Public domain", "Levi Colwill FIFA Club World Cup final extraction.jpg", '50% 18%'),
  asset('p-hato', "Jorrel Hato warming up for Chelsea", "Oscar0123", "CC BY 4.0", "Jorrel Hato Chelsea AC Milan warm up.jpg", '50% 18%'),
  asset('p-james', "Reece James playing for England, June 2026", "Bryan Berlin", "CC BY-SA 4.0", "Reece James England v Ghana 23 June 2026-248 (cropped).jpg", '50% 18%'),
  asset('p-gusto', "Malo Gusto playing for France, June 2026", "Bryan Berlin", "CC BY-SA 4.0", "Malo Gusto France v Senegal 16 June 2026-399.jpg", '50% 18%'),
  asset('p-anselmino', "Aarón Anselmino warming up for Chelsea", "Oscar0123", "CC BY 4.0", "Aaron Anselmino Chelsea AC Milan warm up.jpg", '50% 18%'),
  asset('p-barco', "Valentín Barco playing for Argentina, July 2026", "Bryan Berlin", "CC BY-SA 4.0", "Valentin Barco Argentina v Egypt 7 July 2026-028.jpg", '50% 18%'),
  asset('p-henderson', "Jordan Henderson playing for England, June 2026", "Bryan Berlin", "CC BY-SA 4.0", "Jordan Henderson England v Ghana 23 June 2026-029 (cropped).jpg", '50% 18%'),
  asset('p-rogers', "Morgan Rogers playing for England, June 2026", "Bryan Berlin", "CC BY-SA 4.0", "Morgan Rogers England v Panama 27 June 26-144 (cropped).jpg", '50% 18%'),
  asset('p-caicedo', "Moisés Caicedo playing for Ecuador, June 2026", "Bryan Berlin", "CC BY-SA 4.0", "Moises Caicedo Ecuador v Germany 25 June 2026-051 (cropped).jpg", '50% 18%'),
  asset('p-lavia', "Roméo Lavia in Chelsea kit, April 2025", "Timmy96", "CC0", "Roméo Lavia 20042025 (1) cropped.jpg", '50% 18%'),
  asset('p-neto', "Pedro Neto playing for Portugal, July 2026", "Bryan Berlin", "CC BY-SA 4.0", "Pedro Neto Croatia v Portugal 2 July 2026-113.jpg", '50% 18%'),
  asset('p-joao-pedro', "João Pedro at the 2025 FIFA Club World Cup final", "DHSgov", "Public domain", "João Pedro, 2025 FIFA Club World Cup final (54654843615).jpg", '50% 18%'),
  asset('p-welbeck', "Danny Welbeck, June 2018", "Кирилл Венедиктов", "CC BY-SA 3.0", "Danny Welbeck 2018-06-13 1.jpg", '50% 18%'),
  asset('p-emegha', "Emmanuel Emegha playing for Sturm Graz, May 2023", "Werner100359", "CC BY-SA 4.0", "FC RB Salzburg gegen SK Sturm Graz(2023-05-21) 35 (Emanuel Emegha).jpg", '50% 18%'),
  asset('p-estevao', "Estêvão playing for Palmeiras, April 2024", "NullReason", "CC BY-SA 4.0", "Estevao-Palmeiras-Liverpool-abr24 (cropped).jpg", '50% 18%'),
  asset('p-alonso', "Xabi Alonso", "DONOSTIA KULTURA", "CC BY-SA 2.0", "Los Caminos del fútbol. Xabi Alonso (39666778464) (cropped).jpg", '50% 18%'),
  asset('l-wise', "Dennis Wise playing in a Chelsea Legends match", "@cfcunofficial (Chelsea Debs) London fro", "CC BY-SA 2.0", "Chelsea Legends 1 Inter Forever 4 (28453485028) (cropped).jpg", '50% 18%'),
  asset('l-tambling', "Bobby Tambling", "John Dobson", "CC BY-SA 2.0", "Bobby Tambling (cropped).jpg", '50% 18%'),
  ...Object.entries(CRESTS).map(([code, [club, file]]) => ({
    id: `crest-${code}`,
    src: `${base}media/restricted/crest-${code}.png`,
    alt: `${club} crest`,
    credit: `${club} (trademark)`,
    license: 'Restricted' as const,
    sourceUrl: `https://en.wikipedia.org/wiki/File:${file.replace(/ /g, '_')}`,
  })),
];

const publicSafe = import.meta.env.VITE_PUBLIC_SAFE !== 'false';

/** True for public builds: no trademarked crests, only CC / original media. */
export const PUBLIC_SAFE = publicSafe;

export const MEDIA: Record<string, MediaAsset> = Object.fromEntries(
  ALL.filter((m) => !(publicSafe && m.license === 'Restricted')).map((m) => [m.id, m]),
);

export const ALL_MEDIA = Object.values(MEDIA);

export function media(id: string | undefined): MediaAsset | undefined {
  return id ? MEDIA[id] : undefined;
}
