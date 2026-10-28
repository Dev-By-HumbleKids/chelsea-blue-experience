import type { Legend, Source } from './types';

/**
 * Legends archive. Appearance and goal totals are all-competition figures as commonly published
 * by the club and by Wikipedia; descriptive passages are original editorial writing.
 */
const wiki = (page: string, label: string): Source => ({ label: `Wikipedia — ${label}`, url: `https://en.wikipedia.org/wiki/${page}` });
const CFC_LEGENDS: Source = { label: 'chelseafc.com — Club history', url: 'https://www.chelseafc.com/en/history' };

export const LEGENDS: Legend[] = [
  {
    slug: 'frank-lampard', name: 'Frank Lampard', position: 'Midfielder', era: 'The Golden Era', years: '2001–2014',
    appearances: 648, goals: 211,
    headline: 'The midfielder who became the club’s all-time leading scorer.',
    story: [
      'Signed from West Ham in 2001, Lampard turned the late run from midfield into an art form. Season after season he reached double figures, and in May 2013 he passed Bobby Tambling to become Chelsea’s record goalscorer.',
      'He scored both goals at Bolton that sealed the 2004–05 title, Chelsea’s first league crown in 50 years, and captained the side in the 2012 Champions League final in Munich.',
    ],
    achievements: ['Chelsea’s all-time record goalscorer (211)', 'FWA Footballer of the Year 2005', '3 Premier League titles', 'Champions League 2012 & Europa League 2013'],
    moments: [
      { year: '2005', text: 'Scores twice at the Reebok Stadium to win the first league title in half a century.' },
      { year: '2012', text: 'Captains the side in the Munich final.' },
      { year: '2013', text: 'Scores twice at Aston Villa to pass Bobby Tambling’s scoring record.' },
    ],
    honours: ['league-titles', 'champions-league', 'europa-league', 'fa-cup', 'league-cup'],
    image: 'lampard', related: ['john-terry', 'didier-drogba', 'bobby-tambling'],
    sources: [wiki('Frank_Lampard', 'Frank Lampard'), CFC_LEGENDS],
  },
  {
    slug: 'john-terry', name: 'John Terry', position: 'Centre-back', era: 'The Golden Era', years: '1998–2017',
    appearances: 717, goals: 67,
    headline: 'Captain. Leader. Legend. The most successful captain in the club’s history.',
    story: [
      'A product of the youth system, Terry made his debut in 1998 and went on to captain the club through its most successful era, lifting five Premier League titles.',
      'He remains the highest-scoring defender in the club’s history and made his final appearance in May 2017, leaving the pitch in the 26th minute — his shirt number — to a guard of honour.',
    ],
    achievements: ['5 Premier League titles as captain', 'Champions League 2012', '5 FA Cups', 'PFA Players’ Player of the Year 2005'],
    moments: [
      { year: '2005', text: 'Lifts the Premier League trophy as captain for the first time.' },
      { year: '2015', text: 'Plays every minute of the title-winning league campaign.' },
      { year: '2017', text: 'Signs off with a fifth title and a guard of honour in the 26th minute.' },
    ],
    honours: ['league-titles', 'champions-league', 'fa-cup', 'league-cup', 'europa-league'],
    image: 'terry', related: ['frank-lampard', 'petr-cech', 'ron-harris'],
    sources: [wiki('John_Terry', 'John Terry'), CFC_LEGENDS],
  },
  {
    slug: 'didier-drogba', name: 'Didier Drogba', position: 'Striker', era: 'The Golden Era', years: '2004–2012, 2014–2015',
    appearances: 381, goals: 164,
    headline: 'The man for the biggest night of all.',
    story: [
      'Drogba was built for finals. He scored in four winning FA Cup finals and in Munich in 2012 he headed the 88th-minute equaliser before stepping up to take, and score, the winning penalty.',
      'He returned for one more season in 2014–15 and added a fourth Premier League title to his collection.',
    ],
    achievements: ['Champions League 2012 — equaliser and winning penalty', 'Scored in four winning FA Cup finals', '4 Premier League titles', 'Premier League Golden Boot 2007 & 2010'],
    moments: [
      { year: '2007', text: 'Scores the extra-time winner in the first FA Cup final at the new Wembley.' },
      { year: '2012', text: '88th-minute header and the decisive penalty in Munich.' },
      { year: '2015', text: 'Returns to win the league one final time.' },
    ],
    honours: ['champions-league', 'league-titles', 'fa-cup', 'league-cup'],
    image: 'drogba', related: ['frank-lampard', 'petr-cech', 'john-terry'],
    sources: [wiki('Didier_Drogba', 'Didier Drogba'), CFC_LEGENDS],
  },
  {
    slug: 'petr-cech', name: 'Petr Čech', position: 'Goalkeeper', era: 'The Golden Era', years: '2004–2015',
    appearances: 494, cleanSheets: 228,
    headline: 'The club’s record clean-sheet keeper and the hero of the Munich shoot-out.',
    story: [
      'Čech arrived in 2004 and immediately helped the team concede just 15 league goals on the way to the title. Over eleven seasons he set the club record for clean sheets.',
      'In Munich he saved Arjen Robben’s extra-time penalty and two more in the shoot-out to bring the Champions League to west London.',
    ],
    achievements: ['Club-record 228 clean sheets', '4 Premier League titles', 'Champions League 2012', '15 goals conceded in the 2004–05 league season'],
    moments: [
      { year: '2005', text: 'Part of a defence that concedes just 15 league goals.' },
      { year: '2012', text: 'Saves a penalty in extra time and two in the shoot-out in Munich.' },
    ],
    honours: ['champions-league', 'league-titles', 'fa-cup', 'europa-league'],
    image: 'cech', related: ['john-terry', 'didier-drogba'],
    sources: [wiki('Petr_%C4%8Cech', 'Petr Čech'), CFC_LEGENDS],
  },
  {
    slug: 'eden-hazard', name: 'Eden Hazard', position: 'Winger / Forward', era: 'The Golden Era', years: '2012–2019',
    appearances: 352, goals: 110,
    headline: 'Seven years of magic, two league titles and a farewell in Baku.',
    story: [
      'Hazard could make Stamford Bridge rise with a single shift of balance. He was the PFA Players’ Player of the Year in the 2014–15 title season and the driving force again in 2016–17.',
      'His final game was the 2019 Europa League final in Baku, where he scored twice against Arsenal.',
    ],
    achievements: ['2 Premier League titles', 'PFA Players’ Player of the Year 2015', 'Europa League 2013 & 2019', 'FA Cup 2018 — scored the winning penalty'],
    moments: [
      { year: '2015', text: 'Heads the winner against Crystal Palace to clinch the title.' },
      { year: '2018', text: 'Wins and scores the penalty in the FA Cup final.' },
      { year: '2019', text: 'Two goals in his final appearance, the Europa League final.' },
    ],
    honours: ['league-titles', 'europa-league', 'fa-cup', 'league-cup'],
    image: 'hazard', related: ['frank-lampard', 'didier-drogba'],
    sources: [wiki('Eden_Hazard', 'Eden Hazard'), CFC_LEGENDS],
  },
  {
    slug: 'gianfranco-zola', name: 'Gianfranco Zola', position: 'Forward', era: 'Cups & Kings', years: '1996–2003',
    appearances: 312, goals: 80,
    headline: 'The little magician who taught a new generation to dream.',
    story: [
      'Zola brought Serie A artistry to Stamford Bridge. Within months he was named FWA Footballer of the Year, the first Chelsea player to win the award.',
      'In Stockholm in 1998 he came off the bench and scored the winner in the Cup Winners’ Cup final within seconds. In 2003 supporters voted him the club’s greatest-ever player.',
    ],
    achievements: ['FWA Footballer of the Year 1997', 'Cup Winners’ Cup 1998 — scored the winner', '2 FA Cups', 'Voted Chelsea’s greatest player (2003)'],
    moments: [
      { year: '1997', text: 'Wins the FA Cup in his first season.' },
      { year: '1998', text: 'Comes on and scores the Cup Winners’ Cup winner in Stockholm.' },
      { year: '2002', text: 'Scores his famous back-heeled flick volley against Norwich in the FA Cup.' },
    ],
    honours: ['cup-winners-cup', 'fa-cup', 'league-cup', 'super-cup'],
    image: 'zola', related: ['dennis-wise', 'peter-osgood'],
    sources: [wiki('Gianfranco_Zola', 'Gianfranco Zola'), CFC_LEGENDS],
  },
  {
    slug: 'peter-osgood', name: 'Peter Osgood', position: 'Striker', era: 'First Glory', years: '1964–1974, 1978–1979',
    appearances: 380, goals: 150,
    headline: 'The King of Stamford Bridge.',
    story: [
      'Osgood scored in every round of the 1970 FA Cup, including the replay against Leeds, and scored again in the 1971 Cup Winners’ Cup final replay against Real Madrid.',
      'His statue stands outside the West Stand, and his ashes are buried under the penalty spot at the Shed End.',
    ],
    achievements: ['FA Cup 1970 — scored in every round', 'Cup Winners’ Cup 1971', '150 goals for the club', 'Statue outside Stamford Bridge'],
    moments: [
      { year: '1970', text: 'Diving header in the FA Cup final replay at Old Trafford.' },
      { year: '1971', text: 'Scores in the Athens replay against Real Madrid.' },
    ],
    honours: ['fa-cup', 'cup-winners-cup'],
    image: 'osgood-statue', related: ['ron-harris', 'bobby-tambling'],
    sources: [wiki('Peter_Osgood', 'Peter Osgood'), CFC_LEGENDS],
  },
  {
    slug: 'dennis-wise', name: 'Dennis Wise', position: 'Midfielder', era: 'Cups & Kings', years: '1990–2001',
    appearances: 445, goals: 76,
    headline: 'The captain who lifted the trophies that started it all.',
    story: [
      'Wise arrived from Wimbledon and became the heartbeat of the 1990s revival, captaining the club to the FA Cup in 1997 and 2000, the League Cup and the Cup Winners’ Cup in 1998.',
    ],
    achievements: ['Captain: FA Cup 1997 & 2000', 'Cup Winners’ Cup 1998', 'League Cup 1998', 'UEFA Super Cup 1998'],
    moments: [
      { year: '1997', text: 'Lifts the FA Cup — the club’s first major trophy in 26 years.' },
      { year: '1998', text: 'Lifts the Cup Winners’ Cup in Stockholm.' },
    ],
    honours: ['fa-cup', 'cup-winners-cup', 'league-cup', 'super-cup'],
    related: ['gianfranco-zola'], sources: [wiki('Dennis_Wise', 'Dennis Wise')],
  },
  {
    slug: 'ron-harris', name: 'Ron Harris', position: 'Defender', era: 'First Glory', years: '1961–1980',
    appearances: 795,
    headline: '“Chopper” — the club’s record appearance maker.',
    story: [
      'No one has played more games for Chelsea. Harris captained the side to the 1970 FA Cup and the 1971 Cup Winners’ Cup, and his 795 appearances remain the club record.',
    ],
    achievements: ['Club-record 795 appearances', 'Captain: FA Cup 1970', 'Captain: Cup Winners’ Cup 1971', 'League Cup 1965'],
    moments: [{ year: '1970', text: 'Lifts the FA Cup after the Old Trafford replay.' }],
    honours: ['fa-cup', 'cup-winners-cup', 'league-cup'],
    related: ['peter-osgood', 'bobby-tambling'], sources: [wiki('Ron_Harris_(footballer)', 'Ron Harris')],
  },
  {
    slug: 'bobby-tambling', name: 'Bobby Tambling', position: 'Forward', era: 'First Glory', years: '1959–1970',
    appearances: 370, goals: 202,
    headline: 'Chelsea’s record goalscorer until 2013.',
    story: [
      'Tambling scored 202 goals for Chelsea, a club record that stood until Frank Lampard passed it in 2013. He was part of the side that won the 1965 League Cup.',
    ],
    achievements: ['202 goals — club record until 2013', 'League Cup 1965'],
    moments: [{ year: '1965', text: 'Wins the League Cup, the club’s first cup trophy.' }],
    honours: ['league-cup'],
    related: ['frank-lampard', 'peter-osgood'], sources: [wiki('Bobby_Tambling', 'Bobby Tambling')],
  },
  {
    slug: 'roy-bentley', name: 'Roy Bentley', position: 'Centre-forward', era: 'First Glory', years: '1948–1956',
    appearances: 367, goals: 150,
    headline: 'Captain of the first champions.',
    story: [
      'Bentley was captain and leading scorer when Chelsea won the First Division in 1954–55, the club’s 50th season.',
    ],
    achievements: ['Captain: First Division champions 1954–55', '150 goals for the club'],
    moments: [{ year: '1955', text: 'Leads Chelsea to the league title in the club’s jubilee year.' }],
    honours: ['league-titles', 'community-shield'],
    related: ['ron-harris'], sources: [wiki('Roy_Bentley', 'Roy Bentley')],
  },
];

export const LEGEND_STAT_NOTE = 'Appearances and goals are all-competition totals as published by the club and Wikipedia. Pre-1990s figures can differ slightly between sources.';

export function legendBySlug(slug: string) {
  return LEGENDS.find((l) => l.slug === slug);
}
