import type { Honour, Source } from './types';

/**
 * Men's first-team major honours. Counts and seasons follow the club's official trophy cabinet and
 * the Wikipedia honours list (cross-checked October 2026). No trophy was won in 2025–26
 * (FA Cup runners-up to Manchester City).
 */
const WIKI: Source = { label: 'Wikipedia — Chelsea F.C. honours', url: 'https://en.wikipedia.org/wiki/List_of_Chelsea_F.C._honours' };
const CFC: Source = { label: 'chelseafc.com — Men’s trophy cabinet', url: 'https://www.chelseafc.com/en/mens-trophy-cabinet-asia' };
const UEFA: Source = { label: 'UEFA.com — Chelsea', url: 'https://www.uefa.com/teamsandplayers/teams/52914--chelsea/' };
const FIFA: Source = { label: 'FIFA.com — Club World Cup', url: 'https://www.fifa.com/' };

export const HONOURS: Honour[] = [
  {
    slug: 'champions-league', name: 'UEFA Champions League', shortName: 'Champions League', category: 'European', count: 2,
    seasons: ['2011–12', '2020–21'],
    description: 'Europe’s ultimate prize, first won on a night in Munich that turned Chelsea into a global name, and won again nine years later in Porto.',
    finals: [
      { season: '2011–12', date: '19 May 2012', opponent: 'Bayern Munich', score: '1–1 (4–3 pens)', venue: 'Allianz Arena, Munich', scorers: 'Drogba 88′; Drogba scored the winning penalty' },
      { season: '2020–21', date: '29 May 2021', opponent: 'Manchester City', score: '1–0', venue: 'Estádio do Dragão, Porto', scorers: 'Havertz 42′' },
    ],
    keyPlayers: ['didier-drogba', 'petr-cech', 'frank-lampard', 'john-terry'], sources: [CFC, UEFA, WIKI],
  },
  {
    slug: 'fifa-club-world-cup', name: 'FIFA Club World Cup', shortName: 'Club World Cup', category: 'Worldwide', count: 2,
    seasons: ['2021', '2025'],
    description: 'Champions of the world twice: first in Abu Dhabi in February 2022, then at the first expanded 32-team tournament in the United States in July 2025.',
    finals: [
      { season: '2021', date: '12 Feb 2022', opponent: 'Palmeiras', score: '2–1 (a.e.t.)', venue: 'Mohammed bin Zayed Stadium, Abu Dhabi', scorers: 'Lukaku 55′, Havertz 117′ (pen)' },
      { season: '2025', date: '13 Jul 2025', opponent: 'Paris Saint-Germain', score: '3–0', venue: 'MetLife Stadium, East Rutherford', scorers: 'Palmer 22′, 30′, João Pedro 43′' },
    ],
    sources: [CFC, FIFA, WIKI],
  },
  {
    slug: 'europa-league', name: 'UEFA Europa League', shortName: 'Europa League', category: 'European', count: 2,
    seasons: ['2012–13', '2018–19'],
    description: 'Won in Amsterdam with a stoppage-time header, and in Baku with a dominant second-half display against Arsenal.',
    finals: [
      { season: '2012–13', date: '15 May 2013', opponent: 'Benfica', score: '2–1', venue: 'Amsterdam Arena', scorers: 'Torres 60′, Ivanović 90+3′' },
      { season: '2018–19', date: '29 May 2019', opponent: 'Arsenal', score: '4–1', venue: 'Baku Olympic Stadium', scorers: 'Giroud 49′, Pedro 60′, Hazard 65′ (pen), 72′' },
    ],
    keyPlayers: ['eden-hazard', 'frank-lampard', 'petr-cech'], sources: [UEFA, WIKI],
  },
  {
    slug: 'conference-league', name: 'UEFA Conference League', shortName: 'Conference League', category: 'European', count: 1,
    seasons: ['2024–25'],
    description: 'Won in Wrocław with four second-half goals, making Chelsea the first club to have won the Champions League, Europa League, Conference League, Cup Winners’ Cup and Super Cup.',
    finals: [
      { season: '2024–25', date: '28 May 2025', opponent: 'Real Betis', score: '4–1', venue: 'Stadion Wrocław, Poland', scorers: 'Fernández 65′, Jackson 70′, Sancho 83′, Caicedo 90+1′' },
    ],
    sources: [UEFA, WIKI],
  },
  {
    slug: 'cup-winners-cup', name: 'UEFA Cup Winners’ Cup', shortName: 'Cup Winners’ Cup', category: 'European', count: 2,
    seasons: ['1970–71', '1997–98'],
    description: 'Chelsea’s first European trophy came in an Athens replay against Real Madrid; the second came in Stockholm via a Zola strike seconds after he came on.',
    finals: [
      { season: '1970–71', date: '21 May 1971', opponent: 'Real Madrid', score: '2–1 (replay, after 1–1)', venue: 'Karaiskakis Stadium, Piraeus', scorers: 'Dempsey, Osgood' },
      { season: '1997–98', date: '13 May 1998', opponent: 'VfB Stuttgart', score: '1–0', venue: 'Råsunda Stadium, Stockholm', scorers: 'Zola 71′' },
    ],
    keyPlayers: ['peter-osgood', 'gianfranco-zola', 'dennis-wise'], sources: [UEFA, WIKI],
  },
  {
    slug: 'super-cup', name: 'UEFA Super Cup', shortName: 'Super Cup', category: 'European', count: 2,
    seasons: ['1998', '2021'],
    description: 'Beat Real Madrid in Monaco in 1998, and Villarreal on penalties in Belfast in 2021, with Kepa brought on for the shoot-out.',
    finals: [
      { season: '1998', date: '28 Aug 1998', opponent: 'Real Madrid', score: '1–0', venue: 'Stade Louis II, Monaco', scorers: 'Poyet 83′' },
      { season: '2021', date: '11 Aug 2021', opponent: 'Villarreal', score: '1–1 (6–5 pens)', venue: 'Windsor Park, Belfast', scorers: 'Ziyech 27′' },
    ],
    sources: [UEFA, WIKI],
  },
  {
    slug: 'league-titles', name: 'English League Champions', shortName: 'League Titles', category: 'Domestic League', count: 6,
    seasons: ['1954–55', '2004–05', '2005–06', '2009–10', '2014–15', '2016–17'],
    description: 'One First Division title in the club’s golden jubilee year and five Premier League crowns, including the record-breaking 95-point season of 2004–05.',
    finals: [
      { season: '1954–55', opponent: 'First Division', score: 'Champions', venue: 'Ted Drake’s side won the title in the club’s 50th year', note: 'Captain: Roy Bentley' },
      { season: '2004–05', opponent: 'Premier League', score: '95 points', venue: 'Won with 15 goals conceded — a then-record', note: 'Title sealed at Bolton, 30 April 2005' },
      { season: '2009–10', opponent: 'Premier League', score: '103 goals', venue: 'First top-flight side to score 100+ in the Premier League era', note: 'Also won the FA Cup — the club’s first Double' },
      { season: '2016–17', opponent: 'Premier League', score: '93 points', venue: '30 league wins — a record for a 38-game season at the time' },
    ],
    keyPlayers: ['john-terry', 'frank-lampard', 'petr-cech', 'didier-drogba', 'eden-hazard', 'roy-bentley'], sources: [CFC, WIKI],
  },
  {
    slug: 'fa-cup', name: 'FA Cup', shortName: 'FA Cup', category: 'Domestic Cup', count: 8,
    seasons: ['1969–70', '1996–97', '1999–2000', '2006–07', '2008–09', '2009–10', '2011–12', '2017–18'],
    description: 'Eight wins, from the bruising 1970 replay against Leeds to Hazard’s penalty against Manchester United in 2018. Drogba scored in four winning finals.',
    finals: [
      { season: '1969–70', date: '29 Apr 1970', opponent: 'Leeds United', score: '2–1 (replay, after 2–2)', venue: 'Old Trafford', scorers: 'Osgood, Webb' },
      { season: '1996–97', date: '17 May 1997', opponent: 'Middlesbrough', score: '2–0', venue: 'Wembley', scorers: 'Di Matteo (43 seconds), Newton' },
      { season: '1999–2000', date: '20 May 2000', opponent: 'Aston Villa', score: '1–0', venue: 'Wembley', scorers: 'Di Matteo' },
      { season: '2006–07', date: '19 May 2007', opponent: 'Manchester United', score: '1–0 (a.e.t.)', venue: 'Wembley', scorers: 'Drogba 116′' },
      { season: '2008–09', date: '30 May 2009', opponent: 'Everton', score: '2–1', venue: 'Wembley', scorers: 'Drogba, Lampard' },
      { season: '2009–10', date: '15 May 2010', opponent: 'Portsmouth', score: '1–0', venue: 'Wembley', scorers: 'Drogba' },
      { season: '2011–12', date: '5 May 2012', opponent: 'Liverpool', score: '2–1', venue: 'Wembley', scorers: 'Ramires, Drogba' },
      { season: '2017–18', date: '19 May 2018', opponent: 'Manchester United', score: '1–0', venue: 'Wembley', scorers: 'Hazard (pen)' },
    ],
    keyPlayers: ['didier-drogba', 'peter-osgood', 'dennis-wise', 'gianfranco-zola'], sources: [CFC, WIKI],
  },
  {
    slug: 'league-cup', name: 'League Cup', shortName: 'League Cup', category: 'Domestic Cup', count: 5,
    seasons: ['1964–65', '1997–98', '2004–05', '2006–07', '2014–15'],
    description: 'Five wins, including the 2005 final in Cardiff that delivered the first trophy of the José Mourinho era.',
    finals: [
      { season: '1964–65', opponent: 'Leicester City', score: '3–2 on aggregate', venue: 'Two legs' },
      { season: '1997–98', date: '29 Mar 1998', opponent: 'Middlesbrough', score: '2–0 (a.e.t.)', venue: 'Wembley', scorers: 'Sinclair, Di Matteo' },
      { season: '2004–05', date: '27 Feb 2005', opponent: 'Liverpool', score: '3–2 (a.e.t.)', venue: 'Millennium Stadium, Cardiff' },
      { season: '2006–07', date: '25 Feb 2007', opponent: 'Arsenal', score: '2–1', venue: 'Millennium Stadium, Cardiff', scorers: 'Drogba 2' },
      { season: '2014–15', date: '1 Mar 2015', opponent: 'Tottenham Hotspur', score: '2–0', venue: 'Wembley' },
    ],
    sources: [CFC, WIKI],
  },
  {
    slug: 'community-shield', name: 'FA Community Shield', shortName: 'Community Shield', category: 'Domestic Cup', count: 4,
    seasons: ['1955', '2000', '2005', '2009'],
    description: 'The traditional curtain-raiser, won four times.',
    sources: [WIKI],
  },
  {
    slug: 'second-division', name: 'Second Division', shortName: 'Second Division', category: 'Domestic League', count: 2,
    seasons: ['1983–84', '1988–89'],
    description: 'Promotion-winning title seasons that rebuilt the club before its modern rise.',
    sources: [WIKI],
  },
  {
    slug: 'full-members-cup', name: 'Full Members’ Cup', shortName: 'Full Members’ Cup', category: 'Domestic Cup', count: 2,
    seasons: ['1985–86', '1989–90'],
    description: 'Two Wembley wins in the short-lived Full Members’ Cup.',
    sources: [WIKI],
  },
];

/** The big trophies shown in the homepage cabinet. */
export const MAJOR_HONOUR_SLUGS = ['league-titles', 'champions-league', 'fifa-club-world-cup', 'europa-league', 'conference-league', 'cup-winners-cup', 'super-cup', 'fa-cup', 'league-cup'];

export const MAJOR_TROPHY_COUNT = HONOURS.filter((h) => MAJOR_HONOUR_SLUGS.includes(h.slug)).reduce((n, h) => n + h.count, 0);

export const WOMEN_HONOURS = {
  note: 'Chelsea Women are England’s most successful side of the WSL era. Counts to the end of 2025–26.',
  items: [
    { name: 'Women’s Super League', count: 8, detail: '2015, 2017–18, 2019–20, 2020–21, 2021–22, 2022–23, 2023–24, 2024–25 (plus 2017 Spring Series)' },
    { name: 'Women’s FA Cup', count: 6, detail: '2015, 2018, 2021, 2022, 2023, 2025' },
    { name: 'Women’s League Cup', count: 4, detail: '2020, 2021, 2025, 2026' },
  ],
  sources: [{ label: 'Wikipedia — Chelsea F.C. Women', url: 'https://en.wikipedia.org/wiki/Chelsea_F.C._Women' }],
};
