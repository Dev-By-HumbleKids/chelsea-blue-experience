import type { Position, SquadPlayer } from './types';

/**
 * Men's first-team squad as listed on 24 October 2026 (Wikipedia season article, cross-checked
 * against the summer transfer list). Appearances are starts + substitute appearances across the
 * Premier League and EFL Cup up to that date. Goals are counted from verified match reports.
 */
export const SQUAD_UPDATED = '2026-10-24';

type Row = [number, string, Position, string, string, Partial<SquadPlayer>?];

const rows: Row[] = [
  [1, 'Emiliano Martínez', 'Goalkeeper', 'GK', 'Argentina', { apps: { starts: 6, subs: 0 }, joined: '2026', arrivedFrom: 'Aston Villa', bio: 'A World Cup winner with Argentina, signed on deadline weekend to bring authority and experience to the back line.' }],
  [28, 'Teddy Sharman-Lowe', 'Goalkeeper', 'GK', 'England', { apps: { starts: 0, subs: 0 } }],
  [39, 'Mike Penders', 'Goalkeeper', 'GK', 'Belgium', { bio: 'The young Belgian goalkeeper, signed from Genk, has stepped into first-team action this season.' }],
  [44, 'Gabriel Slonina', 'Goalkeeper', 'GK', 'United States'],
  [2, 'Marco Palestra', 'Defender', 'Right-back', 'Italy', { apps: { starts: 0, subs: 3 }, joined: '2026', arrivedFrom: 'Atalanta', bio: 'An athletic, front-foot Italian full-back who arrived from Atalanta in the summer on a long-term deal.' }],
  [3, 'Wesley Fofana', 'Defender', 'Centre-back', 'France', { apps: { starts: 4, subs: 1 } }],
  [5, 'Maxence Lacroix', 'Defender', 'Centre-back', 'France', { apps: { starts: 9, subs: 1 }, joined: '2026', arrivedFrom: 'Crystal Palace', bio: 'Rapid and composed, Lacroix has started almost every match since his £52m move from Crystal Palace.' }],
  [6, 'Levi Colwill', 'Defender', 'Centre-back', 'England', { apps: { starts: 8, subs: 0 }, bio: 'An academy graduate and left-footed centre-back, Colwill was part of the side that won the 2025 FIFA Club World Cup.' }],
  [21, 'Jorrel Hato', 'Defender', 'Left-back', 'Netherlands', { apps: { starts: 6, subs: 1 } }],
  [24, 'Reece James', 'Defender', 'Right-back', 'England', { captain: true, apps: { starts: 4, subs: 2 }, bio: 'Club captain and Cobham graduate. A Champions League winner in 2021 who lifted the FIFA Club World Cup as captain in 2025.' }],
  [27, 'Malo Gusto', 'Defender', 'Right-back', 'France', { apps: { starts: 5, subs: 2 } }],
  [29, 'Pep Chavarría', 'Defender', 'Left-back', 'Spain', { apps: { starts: 4, subs: 4 }, joined: '2026', arrivedFrom: 'Rayo Vallecano' }],
  [30, 'Aarón Anselmino', 'Defender', 'Centre-back', 'Argentina'],
  [34, 'Josh Acheampong', 'Defender', 'Right-back / Centre-back', 'England', { apps: { starts: 7, subs: 2 }, bio: 'A versatile academy defender who has become a regular this season.' }],
  [37, 'Olutayo Subuloye', 'Defender', 'Centre-back', 'England'],
  [4, 'Valentín Barco', 'Midfielder', 'Central midfield', 'Argentina', { apps: { starts: 3, subs: 2 }, goals: 1, joined: '2026', arrivedFrom: 'Strasbourg' }],
  [10, 'Cole Palmer', 'Midfielder', 'Attacking midfield / Right wing', 'England', { apps: { starts: 9, subs: 1 }, goals: 4, image: 'palmer', bio: 'The creative heartbeat of the side. Scored twice in the 2025 FIFA Club World Cup final against Paris Saint-Germain and wears the No.10.' }],
  [14, 'Jordan Henderson', 'Midfielder', 'Central midfield', 'England', { apps: { starts: 4, subs: 0 }, goals: 2, joined: '2026', arrivedFrom: 'Brentford', bio: 'The vastly experienced midfielder joined on a free transfer and scored twice in the 5–1 win over Bournemouth.' }],
  [17, 'Morgan Rogers', 'Midfielder', 'Attacking midfield / Left wing', 'England', { apps: { starts: 9, subs: 1 }, goals: 3, joined: '2026', arrivedFrom: 'Aston Villa', bio: 'The club-record £117m summer signing, already among the season’s scorers.' }],
  [25, 'Moisés Caicedo', 'Midfielder', 'Defensive midfield', 'Ecuador', { apps: { starts: 3, subs: 1 }, bio: 'A ball-winning anchor who scored in the 2025 Conference League final.' }],
  [31, 'Reggie Watson', 'Midfielder', 'Central midfield', 'England', { apps: { starts: 1, subs: 0 } }],
  [32, 'Mahdi Nicoll-Jazuli', 'Midfielder', 'Central midfield', 'England', { apps: { starts: 0, subs: 1 } }],
  [45, 'Roméo Lavia', 'Midfielder', 'Defensive midfield', 'Belgium', { goals: 1 }],
  [7, 'Pedro Neto', 'Forward', 'Right / Left wing', 'Portugal', { apps: { starts: 7, subs: 3 }, goals: 4, bio: 'Direct and relentless, Neto scored both goals in the 2–0 win at Everton.' }],
  [9, 'João Pedro', 'Forward', 'Striker', 'Brazil', { apps: { starts: 6, subs: 1 }, goals: 5, bio: 'The season’s top scorer so far. Scored in the 2025 FIFA Club World Cup final, days after joining from Brighton.' }],
  [11, 'Jamie Gittens', 'Forward', 'Left / Right wing', 'England', { apps: { starts: 1, subs: 1 } }],
  [18, 'Danny Welbeck', 'Forward', 'Striker', 'England', { apps: { starts: 3, subs: 5 }, goals: 3, joined: '2026', arrivedFrom: 'Brighton & Hove Albion' }],
  [22, 'Emmanuel Emegha', 'Forward', 'Striker', 'Netherlands', { apps: { starts: 0, subs: 0 }, joined: '2026', arrivedFrom: 'Strasbourg' }],
  [23, 'Geovany Quenda', 'Forward', 'Right wing', 'Portugal', { apps: { starts: 1, subs: 3 }, joined: '2026', arrivedFrom: 'Sporting CP' }],
  [41, 'Estêvão', 'Forward', 'Right wing', 'Brazil', { bio: 'The Brazilian teenager joined from Palmeiras in 2025.' }],
];

const slugify = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const SQUAD: SquadPlayer[] = rows.map(([number, name, position, role, nationality, extra]) => ({
  slug: slugify(name),
  number,
  name,
  position,
  role,
  nationality,
  ...extra,
}));

export const POSITIONS: Position[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

export const MANAGER = {
  name: 'Xabi Alonso',
  title: 'Manager',
  appointed: '2026-05-17',
  note: 'Appointed on a four-year contract, taking charge on 1 July 2026.',
};
