/** Club culture: kit history (drawn as original illustrations) and a glossary of traditions. */

export interface Kit {
  id: string;
  era: string;
  title: string;
  shirt: string;
  trim: string;
  shorts: string;
  socks: string;
  pattern?: 'plain' | 'collar' | 'vneck' | 'pinstripe';
  note: string;
}

export const KITS: Kit[] = [
  { id: '1905', era: '1905', title: 'Eton Blue', shirt: '#7FB2E5', trim: '#FFFFFF', shorts: '#FFFFFF', socks: '#0B1A3A', pattern: 'collar', note: 'The first kit took its light blue from the racing colours of the club president, Earl Cadogan, worn with white shorts.' },
  { id: '1964', era: '1964', title: 'All Blue', shirt: '#0A3D91', trim: '#FFFFFF', shorts: '#0A3D91', socks: '#FFFFFF', pattern: 'vneck', note: 'Under Tommy Docherty, Chelsea switched to blue shorts as well as blue shirts — the look that defines the club to this day.' },
  { id: '1970', era: '1970', title: 'Cup Kings', shirt: '#0A3D91', trim: '#FFFFFF', shorts: '#0A3D91', socks: '#FFFFFF', pattern: 'collar', note: 'The era of Osgood, Hudson and Harris — FA Cup winners in 1970 and Cup Winners’ Cup winners in 1971.' },
  { id: '1997', era: '1997', title: 'Wembley Blue', shirt: '#034694', trim: '#FFFFFF', shorts: '#034694', socks: '#FFFFFF', pattern: 'collar', note: 'The Umbro era of Zola, Vialli and Wise, as the club won the 1997 FA Cup.' },
  { id: '2005', era: '2004–05', title: 'Centenary Champions', shirt: '#034694', trim: '#FFFFFF', shorts: '#034694', socks: '#FFFFFF', pattern: 'vneck', note: 'Umbro made the kit for the first title in fifty years, won in the club’s centenary season.' },
  { id: '2012', era: '2011–12', title: 'Munich', shirt: '#034694', trim: '#FFFFFF', shorts: '#034694', socks: '#FFFFFF', pattern: 'plain', note: 'The adidas shirt worn on the night Drogba and Čech brought home the Champions League.' },
  { id: '2021', era: '2020–21', title: 'Porto', shirt: '#0446A6', trim: '#FFFFFF', shorts: '#0446A6', socks: '#FFFFFF', pattern: 'vneck', note: 'Made by Nike, the club’s kit supplier since 2017; the season of the 2021 Champions League win in Porto.' },
];

export interface GlossaryItem {
  term: string;
  meaning: string;
}

export const GLOSSARY: GlossaryItem[] = [
  { term: 'The Blues', meaning: 'The club’s main nickname, from the royal blue shirts.' },
  { term: 'The Pensioners', meaning: 'The original nickname, after the Chelsea Pensioners — veteran soldiers of the nearby Royal Hospital Chelsea.' },
  { term: 'The Bridge', meaning: 'Stamford Bridge, home since the club’s foundation in 1905.' },
  { term: 'The Shed', meaning: 'The south terrace, named after its corrugated-iron roof. Today’s Shed End stand keeps the name.' },
  { term: 'The Rising Sun', meaning: 'The Fulham Road pub, opposite the ground and now called The Butcher’s Hook, where the club was founded on 10 March 1905.' },
  { term: 'Blue Is the Colour', meaning: 'The song recorded by the squad for the 1972 League Cup final, still sung at the Bridge.' },
  { term: 'Carefree', meaning: 'The terrace anthem: “Carefree, wherever you may be…”' },
  { term: 'Cobham', meaning: 'The club’s training ground and academy base in Surrey.' },
  { term: 'The Lion', meaning: 'The lion on the crest comes from the arms of Viscount Chelsea, the club’s first president, Earl Cadogan.' },
  { term: 'London Is Blue', meaning: 'Our project’s creative line — a nod to Chelsea’s place as the capital’s first Champions League winners.' },
];
