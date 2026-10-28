import type { Fixture, Source, TableRow, Transfer } from './types';

/**
 * 2026/27 season snapshot. Verified against the sources below on the snapshot date.
 * Nothing here is live: the UI labels it with SNAPSHOT_DATE and never calls it a live score.
 */
export const SNAPSHOT_DATE = '2026-10-28';
export const SEASON = '2026/27';

const WIKI_SEASON: Source = { label: 'Wikipedia — 2026–27 Chelsea F.C. season', url: 'https://en.wikipedia.org/wiki/2026%E2%80%9327_Chelsea_F.C._season' };
const CFC_FIXTURES: Source = { label: 'chelseafc.com — Men’s fixtures & results', url: 'https://www.chelseafc.com/en/matches/mens-fixtures-and-results' };
const SKY_BOURNEMOUTH: Source = { label: 'Sky Sports — Chelsea v Bournemouth report', url: 'https://www.skysports.com/football/chelsea-vs-bmouth/report/559496' };

export const SEASON_SOURCES: Source[] = [WIKI_SEASON, CFC_FIXTURES, { label: 'NBC Sports — Premier League table 2026–27', url: 'https://www.nbcsports.com/soccer/news/premier-league-table-for-2026-27-season' }];

const SB = 'Stamford Bridge';

function upcoming(id: string, competition: Fixture['competition'], opponent: string, opponentShort: string, venue: 'H' | 'A', stadium: string, kickoff: string, round?: string): Fixture {
  return { id, competition, opponent, opponentShort, venue, stadium, kickoff, status: 'scheduled', round, sources: [WIKI_SEASON, CFC_FIXTURES] };
}

export const FIXTURES: Fixture[] = [
  {
    id: 'pl-01-fulham-a', competition: 'Premier League', opponent: 'Fulham', opponentShort: 'FUL', venue: 'A', stadium: 'Craven Cottage',
    kickoff: '2026-08-24T12:00:00Z', dateOnly: true, status: 'completed', score: { chelsea: 3, opponent: 2 },
    chelseaScorers: [{ player: 'João Pedro', minute: "1'" }, { player: 'Morgan Rogers', minute: "41'" }, { player: 'Cole Palmer', minute: "49'" }],
    attendance: 27461, sources: [WIKI_SEASON],
  },
  {
    id: 'efl-r2-luton-h', competition: 'EFL Cup', round: 'Second round', opponent: 'Luton Town', opponentShort: 'LUT', venue: 'H', stadium: SB,
    kickoff: '2026-08-27T12:00:00Z', dateOnly: true, status: 'completed', score: { chelsea: 2, opponent: 0 },
    chelseaScorers: [{ player: 'Danny Welbeck', minute: "50'" }, { player: 'Odoffin', minute: "79'", ownGoal: true }],
    attendance: 32210, referee: 'Elliot Bell', sources: [WIKI_SEASON],
  },
  {
    id: 'pl-02-brighton-h', competition: 'Premier League', opponent: 'Brighton & Hove Albion', opponentShort: 'BHA', venue: 'H', stadium: SB,
    kickoff: '2026-08-30T12:00:00Z', dateOnly: true, status: 'completed', score: { chelsea: 4, opponent: 3 },
    chelseaScorers: [{ player: 'Roméo Lavia', minute: "4'" }, { player: 'Pedro Neto', minute: "14'" }, { player: 'João Pedro', minute: "32'" }, { player: 'Cole Palmer', minute: "74'" }],
    attendance: 39494, sources: [WIKI_SEASON],
  },
  {
    id: 'pl-03-arsenal-a', competition: 'Premier League', opponent: 'Arsenal', opponentShort: 'ARS', venue: 'A', stadium: 'Emirates Stadium',
    kickoff: '2026-09-06T12:00:00Z', dateOnly: true, status: 'completed', score: { chelsea: 1, opponent: 2 },
    chelseaScorers: [{ player: 'Morgan Rogers', minute: "2'" }], attendance: 60240, sources: [WIKI_SEASON],
  },
  {
    id: 'efl-r3-leeds-h', competition: 'EFL Cup', round: 'Third round', opponent: 'Leeds United', opponentShort: 'LEE', venue: 'H', stadium: SB,
    kickoff: '2026-09-09T12:00:00Z', dateOnly: true, status: 'completed', score: { chelsea: 6, opponent: 3 },
    chelseaScorers: [
      { player: 'Cole Palmer', minute: "53'", penalty: true }, { player: 'Cole Palmer', minute: "55'" }, { player: 'Pedro Neto', minute: "60'" },
      { player: 'Danny Welbeck', minute: "65'" }, { player: 'Valentín Barco', minute: "80'" }, { player: 'Danny Welbeck', minute: "90+4'" },
    ],
    attendance: 35696, referee: 'Jarred Gillett', sources: [WIKI_SEASON],
  },
  {
    id: 'pl-04-hull-h', competition: 'Premier League', opponent: 'Hull City', opponentShort: 'HUL', venue: 'H', stadium: SB,
    kickoff: '2026-09-12T12:00:00Z', dateOnly: true, status: 'completed', score: { chelsea: 2, opponent: 2 },
    chelseaScorers: [{ player: 'Morgan Rogers', minute: "7'" }, { player: 'João Pedro', minute: "66'" }], attendance: 39352, sources: [WIKI_SEASON],
  },
  {
    id: 'pl-05-brentford-a', competition: 'Premier League', opponent: 'Brentford', opponentShort: 'BRE', venue: 'A', stadium: 'Gtech Community Stadium',
    kickoff: '2026-09-18T12:00:00Z', dateOnly: true, status: 'completed', score: { chelsea: 0, opponent: 3 }, attendance: 17193, sources: [WIKI_SEASON],
  },
  {
    id: 'pl-07-bournemouth-h', competition: 'Premier League', opponent: 'AFC Bournemouth', opponentShort: 'BOU', venue: 'H', stadium: SB,
    kickoff: '2026-10-10T12:00:00Z', dateOnly: true, status: 'completed', score: { chelsea: 5, opponent: 1 },
    chelseaScorers: [
      { player: 'Jordan Henderson', minute: "2'" },
      { player: 'Unattributed', minute: "3'", note: 'Sources differ: Sky Sports credits Morgan Rogers; Football Web Pages records an António Silva own goal.' },
      { player: 'João Pedro', minute: "46'" }, { player: 'João Pedro', minute: "67'" }, { player: 'Jordan Henderson', minute: "70'" },
    ],
    opponentScorers: [{ player: 'Evanilson', minute: "51'" }],
    attendance: 39767, referee: 'Sam Barrott',
    report: 'Jordan Henderson struck twice — inside two minutes and again after the hour — as Chelsea ended a four-match winless league run in emphatic fashion. João Pedro added a second-half brace in front of the season’s highest home crowd.',
    sources: [WIKI_SEASON, SKY_BOURNEMOUTH],
  },
  {
    id: 'pl-08-everton-a', competition: 'Premier League', opponent: 'Everton', opponentShort: 'EVE', venue: 'A', stadium: 'Hill Dickinson Stadium',
    kickoff: '2026-10-17T12:00:00Z', dateOnly: true, status: 'completed', score: { chelsea: 2, opponent: 0 },
    chelseaScorers: [{ player: 'Pedro Neto', minute: "46'" }, { player: 'Pedro Neto', minute: "90'" }], attendance: 52271, referee: 'Paul Tierney', sources: [WIKI_SEASON],
  },
  {
    id: 'pl-09-tottenham-h', competition: 'Premier League', opponent: 'Tottenham Hotspur', opponentShort: 'TOT', venue: 'H', stadium: SB,
    kickoff: '2026-10-24T12:00:00Z', dateOnly: true, status: 'completed', score: { chelsea: 0, opponent: 2 },
    opponentScorers: [{ player: 'Mike Penders', minute: "77'", ownGoal: true }, { player: 'Mathys Tel', minute: "87'" }],
    attendance: 39402, referee: 'Chris Kavanagh',
    report: 'A London derby defeat at the Bridge: Cole Palmer was sent off for a second yellow card, and Spurs scored twice late on.',
    sources: [WIKI_SEASON, { label: 'Sky Sports — Chelsea news', url: 'https://www.skysports.com/chelsea' }],
  },
  upcoming('efl-r4-liverpool-a', 'EFL Cup', 'Liverpool', 'LIV', 'A', 'Anfield', '2026-10-28T20:00:00Z', 'Fourth round'),
  upcoming('pl-10-manutd-h', 'Premier League', 'Manchester United', 'MUN', 'H', SB, '2026-10-31T12:30:00Z'),
  upcoming('pl-11-sunderland-a', 'Premier League', 'Sunderland', 'SUN', 'A', 'Stadium of Light', '2026-11-08T14:00:00Z'),
  upcoming('pl-12-leeds-h', 'Premier League', 'Leeds United', 'LEE', 'H', SB, '2026-11-21T15:00:00Z'),
  upcoming('pl-13-forest-a', 'Premier League', 'Nottingham Forest', 'NFO', 'A', 'City Ground', '2026-11-27T20:00:00Z'),
  upcoming('pl-14-palace-h', 'Premier League', 'Crystal Palace', 'CRY', 'H', SB, '2026-12-02T19:30:00Z'),
  upcoming('pl-15-liverpool-h', 'Premier League', 'Liverpool', 'LIV', 'H', SB, '2026-12-05T12:30:00Z'),
  upcoming('pl-16-mancity-a', 'Premier League', 'Manchester City', 'MCI', 'A', 'Etihad Stadium', '2026-12-12T17:30:00Z'),
  upcoming('pl-17-villa-h', 'Premier League', 'Aston Villa', 'AVL', 'H', SB, '2026-12-21T20:00:00Z'),
  upcoming('pl-18-coventry-a', 'Premier League', 'Coventry City', 'COV', 'A', 'Coventry Building Society Arena', '2026-12-27T14:00:00Z'),
  upcoming('pl-19-ipswich-a', 'Premier League', 'Ipswich Town', 'IPS', 'A', 'Portman Road', '2026-12-30T20:15:00Z'),
  upcoming('pl-20-newcastle-h', 'Premier League', 'Newcastle United', 'NEW', 'H', SB, '2027-01-03T14:00:00Z'),
  upcoming('pl-21-palace-a', 'Premier League', 'Crystal Palace', 'CRY', 'A', 'Selhurst Park', '2027-01-06T19:30:00Z'),
  upcoming('pl-22-sunderland-h', 'Premier League', 'Sunderland', 'SUN', 'H', SB, '2027-01-16T15:00:00Z'),
  upcoming('pl-23-leeds-a', 'Premier League', 'Leeds United', 'LEE', 'A', 'Elland Road', '2027-01-23T15:00:00Z'),
  upcoming('pl-24-forest-h', 'Premier League', 'Nottingham Forest', 'NFO', 'H', SB, '2027-01-30T15:00:00Z'),
  upcoming('pl-25-manutd-a', 'Premier League', 'Manchester United', 'MUN', 'A', 'Old Trafford', '2027-02-06T15:00:00Z'),
  upcoming('pl-26-newcastle-a', 'Premier League', 'Newcastle United', 'NEW', 'A', 'St James’ Park', '2027-02-10T20:00:00Z'),
  upcoming('pl-27-ipswich-h', 'Premier League', 'Ipswich Town', 'IPS', 'H', SB, '2027-02-20T15:00:00Z'),
  upcoming('pl-28-villa-a', 'Premier League', 'Aston Villa', 'AVL', 'A', 'Villa Park', '2027-02-27T15:00:00Z'),
  upcoming('pl-29-coventry-h', 'Premier League', 'Coventry City', 'COV', 'H', SB, '2027-03-03T20:00:00Z'),
  upcoming('pl-30-arsenal-h', 'Premier League', 'Arsenal', 'ARS', 'H', SB, '2027-03-13T15:00:00Z'),
  upcoming('pl-31-hull-a', 'Premier League', 'Hull City', 'HUL', 'A', 'MKM Stadium', '2027-03-20T15:00:00Z'),
  upcoming('pl-32-fulham-h', 'Premier League', 'Fulham', 'FUL', 'H', SB, '2027-04-10T14:00:00Z'),
  upcoming('pl-33-brighton-a', 'Premier League', 'Brighton & Hove Albion', 'BHA', 'A', 'Amex Stadium', '2027-04-17T14:00:00Z'),
  upcoming('pl-34-mancity-h', 'Premier League', 'Manchester City', 'MCI', 'H', SB, '2027-04-24T14:00:00Z'),
  upcoming('pl-35-liverpool-a', 'Premier League', 'Liverpool', 'LIV', 'A', 'Anfield', '2027-05-01T14:00:00Z'),
  upcoming('pl-36-tottenham-a', 'Premier League', 'Tottenham Hotspur', 'TOT', 'A', 'Tottenham Hotspur Stadium', '2027-05-08T14:00:00Z'),
  upcoming('pl-37-everton-h', 'Premier League', 'Everton', 'EVE', 'H', SB, '2027-05-15T14:00:00Z'),
  upcoming('pl-38-bournemouth-a', 'Premier League', 'AFC Bournemouth', 'BOU', 'A', 'Vitality Stadium', '2027-05-23T14:00:00Z'),
  upcoming('pl-39-brentford-h', 'Premier League', 'Brentford', 'BRE', 'H', SB, '2027-05-30T15:00:00Z'),
];

/**
 * League table excerpt as of 25 October 2026 (after 8 matches each). Only rows that could be
 * verified are included; the UI states that this is a partial snapshot.
 */
export const TABLE_NOTE = 'Snapshot after 8 matches (25 Oct 2026). Manchester City and Arsenal led on 21 points; full rows shown only where verified.';
export const TABLE: TableRow[] = [
  { pos: 3, team: 'Brighton & Hove Albion', short: 'BHA', p: 8, w: 5, d: 1, l: 2, gf: 23, ga: 7, pts: 16 },
  { pos: 4, team: 'Liverpool', short: 'LIV', p: 8, w: 4, d: 3, l: 1, gf: 11, ga: 8, pts: 15 },
  { pos: 5, team: 'Chelsea', short: 'CHE', p: 8, w: 4, d: 1, l: 3, gf: 17, ga: 15, pts: 13 },
  { pos: 6, team: 'Brentford', short: 'BRE', p: 8, w: 2, d: 5, l: 1, gf: 14, ga: 9, pts: 11 },
  { pos: 7, team: 'Leeds United', short: 'LEE', p: 8, w: 2, d: 5, l: 1, gf: 9, ga: 6, pts: 11 },
];

export const TRANSFERS: Transfer[] = [
  { player: 'Morgan Rogers', position: 'AM', club: 'Aston Villa', fee: '£117m (club record)', date: '2026-07-21', direction: 'in', status: 'confirmed' },
  { player: 'Maxence Lacroix', position: 'CB', club: 'Crystal Palace', fee: '£52m', date: '2026-07-30', direction: 'in', status: 'confirmed' },
  { player: 'Marco Palestra', position: 'RB', club: 'Atalanta', fee: '£43m', date: '2026-07-01', direction: 'in', status: 'confirmed' },
  { player: 'Geovany Quenda', position: 'RW', club: 'Sporting CP', fee: '£40m', date: '2026-07-08', direction: 'in', status: 'confirmed' },
  { player: 'Valentín Barco', position: 'CM', club: 'Strasbourg', fee: '£34m', date: '2026-08-02', direction: 'in', status: 'confirmed' },
  { player: 'Emmanuel Emegha', position: 'ST', club: 'Strasbourg', fee: '£22m (agreed 2025)', date: '2026-07-01', direction: 'in', status: 'confirmed' },
  { player: 'Pep Chavarría', position: 'LB', club: 'Rayo Vallecano', fee: '£16.3m + add-ons', date: '2026-08-12', direction: 'in', status: 'confirmed' },
  { player: 'Emiliano Martínez', position: 'GK', club: 'Aston Villa', fee: '£7.5m', date: '2026-08-30', direction: 'in', status: 'confirmed' },
  { player: 'Danny Welbeck', position: 'ST', club: 'Brighton & Hove Albion', fee: '£5m', date: '2026-08-01', direction: 'in', status: 'confirmed' },
  { player: 'Jordan Henderson', position: 'CM', club: 'Brentford', fee: 'Free', date: '2026-08-03', direction: 'in', status: 'confirmed' },
  { player: 'Enzo Fernández', position: 'CM', club: 'Manchester City', fee: '£125m', direction: 'out', status: 'confirmed' },
  { player: 'Andrey Santos', position: 'CM', club: 'Manchester United', fee: '£48m + add-ons', date: '2026-07-13', direction: 'out', status: 'confirmed' },
  { player: 'Marc Cucurella', position: 'LB', club: 'Real Madrid', fee: '£47.5m + add-ons', date: '2026-07-01', direction: 'out', status: 'confirmed' },
  { player: 'Nicolas Jackson', position: 'ST', club: 'Aston Villa', fee: '£47.5m + add-ons', date: '2026-08-28', direction: 'out', status: 'confirmed' },
  { player: 'Liam Delap', position: 'ST', club: 'Nottingham Forest', fee: '£45m + add-ons', date: '2026-08-27', direction: 'out', status: 'confirmed' },
  { player: 'Trevoh Chalobah', position: 'CB', club: 'Como', fee: '£25.7m + add-ons', date: '2026-08-09', direction: 'out', status: 'confirmed' },
  { player: 'Tyrique George', position: 'RW', club: 'Everton', fee: '£18m + add-ons', date: '2026-07-06', direction: 'out', status: 'confirmed' },
  { player: 'Alejandro Garnacho', position: 'LW', club: 'Aston Villa', fee: 'Loan', date: '2026-07-23', direction: 'loan-out', status: 'confirmed' },
  { player: 'Robert Sánchez', position: 'GK', club: 'Como', fee: 'Loan', direction: 'loan-out', status: 'confirmed' },
  { player: 'Mykhailo Mudryk', position: 'LW', club: 'Tottenham Hotspur', fee: 'Loan', direction: 'loan-out', status: 'confirmed' },
];

export const TRANSFER_SUMMARY = { spend: '£348.8m', income: '£402.8m', window: 'Summer 2026 (closed 1 Sep 2026)', source: WIKI_SEASON };
