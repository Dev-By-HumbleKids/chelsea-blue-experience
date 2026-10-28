/**
 * Shared data models. Every dataset carries an explicit provenance so the UI can show
 * whether something is verified reference content, a dated snapshot, or simulated demo data.
 */

export type Provenance = 'verified' | 'snapshot' | 'demo' | 'editorial';

export interface Source {
  label: string;
  url: string;
}

export type MediaLicense = 'CC0' | 'CC BY 2.0' | 'CC BY-SA 2.0' | 'CC BY-SA 3.0' | 'CC BY-SA 3.0 de' | 'CC BY-SA 4.0' | 'CC BY 4.0' | 'Original' | 'Restricted';

export interface MediaAsset {
  id: string;
  src: string;
  alt: string;
  credit: string;
  license: MediaLicense;
  sourceUrl: string;
  /** Focal point for object-position, e.g. "50% 30%". */
  focus?: string;
}

export type Competition = 'Premier League' | 'EFL Cup' | 'FA Cup' | 'Friendly';

export type MatchStatus = 'scheduled' | 'completed' | 'postponed' | 'unverified';

export interface Goal {
  player: string;
  minute: string;
  ownGoal?: boolean;
  penalty?: boolean;
  note?: string;
}

export interface Fixture {
  id: string;
  competition: Competition;
  round?: string;
  opponent: string;
  opponentShort: string;
  venue: 'H' | 'A';
  stadium: string;
  /** ISO 8601 in UTC. */
  kickoff: string;
  /** Kick-off time not verified — show the date only. */
  dateOnly?: boolean;
  status: MatchStatus;
  score?: { chelsea: number; opponent: number };
  chelseaScorers?: Goal[];
  opponentScorers?: Goal[];
  attendance?: number;
  referee?: string;
  report?: string;
  sources: Source[];
}

export interface TableRow {
  pos: number;
  team: string;
  short: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  pts: number;
}

export type Position = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';

export interface SquadPlayer {
  slug: string;
  number: number;
  name: string;
  position: Position;
  role: string;
  nationality: string;
  captain?: boolean;
  joined?: string;
  arrivedFrom?: string;
  /** Appearances as starts + sub appearances, all competitions, per the snapshot. */
  apps?: { starts: number; subs: number };
  goals?: number;
  bio?: string;
  image?: string;
}

export interface Transfer {
  player: string;
  position: string;
  club: string;
  fee: string;
  date?: string;
  direction: 'in' | 'out' | 'loan-out';
  status: 'confirmed' | 'agreed-future' | 'reported';
}

export type HonourCategory = 'European' | 'Worldwide' | 'Domestic League' | 'Domestic Cup';

export interface FinalMatch {
  season: string;
  date?: string;
  opponent: string;
  score: string;
  venue: string;
  scorers?: string;
  note?: string;
}

export interface Honour {
  slug: string;
  name: string;
  shortName: string;
  category: HonourCategory;
  count: number;
  seasons: string[];
  description: string;
  finals?: FinalMatch[];
  keyPlayers?: string[];
  /** Media id of a photograph of the trophy. */
  image?: string;
  sources: Source[];
}

export interface Legend {
  slug: string;
  name: string;
  position: string;
  era: string;
  years: string;
  appearances?: number;
  goals?: number;
  cleanSheets?: number;
  statNote?: string;
  headline: string;
  story: string[];
  achievements: string[];
  moments: { year: string; text: string }[];
  honours: string[];
  image?: string;
  quoteLine?: string;
  related: string[];
  sources: Source[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  year: number;
  era: Era;
  title: string;
  text: string;
  highlight?: boolean;
  honour?: string;
  image?: string;
  sources?: Source[];
}

export type Era = 'Foundations 1905–1952' | 'First Glory 1952–1979' | 'Cups & Kings 1980–2003' | 'The Golden Era 2003–2022' | 'New Blues 2022–';

export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  category: 'Official' | 'Men’s First Team' | 'Chelsea Women' | 'Match Report' | 'Transfers' | 'Club' | 'History';
  /** official = from the club; reported = third-party reporting. */
  kind: 'official' | 'reported';
  summary: string;
  body: string[];
  image?: string;
  source: Source;
  related?: string[];
}
