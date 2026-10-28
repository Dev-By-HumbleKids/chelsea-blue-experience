import type { NewsItem } from './types';

/**
 * Newsroom. Every item is an original summary of reporting that was checked on the snapshot
 * date and links to its source. Nothing here is reproduced from the original articles.
 */
export const NEWS: NewsItem[] = [
  {
    slug: 'chelsea-0-2-tottenham', title: 'Derby defeat at the Bridge as Palmer is sent off', date: '2026-10-24', category: 'Match Report', kind: 'reported',
    summary: 'Tottenham won 2–0 at Stamford Bridge. Cole Palmer was shown a second yellow card, and both Spurs goals came in the final quarter of an hour.',
    body: [
      'Chelsea’s run of results ended with a 2–0 home defeat to Tottenham Hotspur in the London derby. Cole Palmer was sent off after a second booking.',
      'The deadlock was broken in the 77th minute when the ball went in off goalkeeper Mike Penders, and Mathys Tel added a second three minutes from time.',
      'The result left Chelsea fifth after eight league games, with a home game against Manchester United to come on 31 October.',
    ],
    image: 'bowl-spurs', source: { label: 'Sky Sports', url: 'https://www.skysports.com/chelsea' }, related: ['everton-0-2-chelsea', 'chelsea-5-1-bournemouth'],
  },
  {
    slug: 'everton-0-2-chelsea', title: 'Neto double settles it at Everton', date: '2026-10-17', category: 'Match Report', kind: 'reported',
    summary: 'Pedro Neto scored at the start of the second half and again in the 90th minute as Chelsea won 2–0 at Everton’s new stadium.',
    body: [
      'Pedro Neto was the difference at the Hill Dickinson Stadium, scoring a minute after half-time and again in the 90th minute.',
      'It was a second straight league win and a second straight clean sheet away from home.',
    ],
    image: 'inside-peterborough', source: { label: 'Wikipedia — 2026–27 Chelsea F.C. season', url: 'https://en.wikipedia.org/wiki/2026%E2%80%9327_Chelsea_F.C._season' }, related: ['chelsea-5-1-bournemouth'],
  },
  {
    slug: 'chelsea-5-1-bournemouth', title: 'Henderson rolls back the years in five-goal win', date: '2026-10-10', category: 'Match Report', kind: 'reported',
    summary: 'Jordan Henderson scored twice and João Pedro added a brace as Chelsea beat Bournemouth 5–1, ending a four-match winless league run.',
    body: [
      'Jordan Henderson scored inside two minutes and again in the 70th as Chelsea swept Bournemouth aside in front of 39,767 — the season’s biggest home crowd so far.',
      'João Pedro scored either side of an Evanilson goal for the visitors. Reports differ on the third-minute goal: Sky Sports credits Morgan Rogers, while other records list an own goal.',
    ],
    image: 'panorama-theodoritsis', source: { label: 'Sky Sports — match report', url: 'https://www.skysports.com/football/chelsea-vs-bmouth/report/559496' }, related: ['everton-0-2-chelsea'],
  },
  {
    slug: 'boehly-steps-down', title: 'Todd Boehly steps down as chairman', date: '2026-09-17', category: 'Club', kind: 'reported',
    summary: 'Reports say Todd Boehly has left the chairman’s role after agreeing to sell his stake to affiliates of majority owner Clearlake Capital.',
    body: [
      'Todd Boehly, chairman since the 2022 takeover, has stepped down after agreeing to sell his ownership interest, according to multiple reports in September 2026.',
      'Clearlake Capital, already the majority owner, is reported to take fuller control of the club. In a statement, Boehly called the role an honour and thanked staff, players and supporters.',
      'This item is based on third-party reporting; check the club’s official channels for the confirmed details.',
    ],
    image: 'exterior-mueseler', source: { label: 'Gulf News', url: 'https://gulfnews.com/sport/todd-boehly-quits-chelsea-selling-ownership-stake-1.500677929' },
  },
  {
    slug: 'summer-window-2026', title: 'Summer 2026: every arrival and departure', date: '2026-09-02', category: 'Transfers', kind: 'official',
    summary: 'A club-record £117m deal for Morgan Rogers led a busy window, alongside Maxence Lacroix, Marco Palestra and Geovany Quenda. Enzo Fernández left for Manchester City.',
    body: [
      'Morgan Rogers joined from Aston Villa for a reported club-record fee, and Maxence Lacroix arrived from Crystal Palace to strengthen the defence.',
      'Marco Palestra (Atalanta), Geovany Quenda (Sporting CP), Valentín Barco (Strasbourg), Pep Chavarría (Rayo Vallecano), Danny Welbeck (Brighton), Jordan Henderson (free) and Emiliano Martínez (Aston Villa) also signed.',
      'Departures included Enzo Fernández to Manchester City, Marc Cucurella to Real Madrid, and Nicolas Jackson and Liam Delap to Aston Villa and Nottingham Forest.',
    ],
    image: 'shed-end', source: { label: 'chelseafc.com — Summer transfers 2026', url: 'https://www.chelseafc.com/en/news/article/summer-transfers-2026-all-the-chelsea-ins-outs-and-new-contracts-so-far' },
  },
  {
    slug: 'xabi-alonso-appointed', title: 'Xabi Alonso appointed manager', date: '2026-05-17', category: 'Official', kind: 'official',
    summary: 'The club confirmed Xabi Alonso as manager of the men’s team on a four-year contract, starting on 1 July 2026.',
    body: [
      'Chelsea announced Xabi Alonso as manager on a four-year contract, a day after the 1–0 FA Cup final defeat to Manchester City.',
      'Alonso is the first permanent appointment under the current ownership to carry the title of manager rather than head coach.',
    ],
    image: 'ank-27', source: { label: 'Sports Mole — club announcement', url: 'https://www.sportsmole.co.uk/football/chelsea/news/chelsea-announce-alonso-appointment-outline-six-reasons-for-spaniards-arrival-contract-length-revealed_597720.html' },
  },
  {
    slug: 'club-world-cup-anniversary', title: 'Champions of the world: remembering New Jersey', date: '2025-07-13', category: 'History', kind: 'official',
    summary: 'Palmer scored twice and set up João Pedro as Chelsea beat Paris Saint-Germain 3–0 to win the first 32-team FIFA Club World Cup.',
    body: [
      'At the MetLife Stadium, Cole Palmer scored twice in eight minutes and then set up João Pedro to make it 3–0 before half-time against the European champions.',
      'It was the club’s second Club World Cup, after the 2021 edition in Abu Dhabi.',
    ],
    image: 'palmer', source: { label: 'FIFA.com', url: 'https://www.fifa.com/' },
  },
];

export const NEWS_CATEGORIES = ['All', 'Official', 'Match Report', 'Transfers', 'Club', 'History'] as const;
