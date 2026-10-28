import { FIXTURES, SEASON, SNAPSHOT_DATE, TABLE, TABLE_NOTE } from '@/data/season';
import type { Fixture, TableRow } from '@/data/types';

/**
 * Football data provider abstraction. The UI only talks to this interface, so a live provider
 * (behind a server-side proxy that holds the API key) can replace the snapshot without UI changes.
 */
export interface FootballDataProvider {
  readonly kind: 'snapshot' | 'live';
  readonly updatedAt: string;
  readonly season: string;
  getFixtures(): Promise<Fixture[]>;
  getFixture(id: string): Promise<Fixture | undefined>;
  getTable(): Promise<{ rows: TableRow[]; note: string }>;
}

class SnapshotProvider implements FootballDataProvider {
  readonly kind = 'snapshot' as const;
  readonly updatedAt = SNAPSHOT_DATE;
  readonly season = SEASON;
  async getFixtures() {
    return [...FIXTURES].sort((a, b) => a.kickoff.localeCompare(b.kickoff));
  }
  async getFixture(id: string) {
    return FIXTURES.find((f) => f.id === id);
  }
  async getTable() {
    return { rows: TABLE, note: TABLE_NOTE };
  }
}

export const dataProvider: FootballDataProvider = new SnapshotProvider();

/**
 * Status as seen from "now". A scheduled fixture whose kick-off has passed but which has no
 * verified result is shown as unverified rather than inventing a score.
 */
export function effectiveStatus(f: Fixture, now = new Date()): Fixture['status'] {
  if (f.status === 'scheduled' && new Date(f.kickoff).getTime() + 2.5 * 3600_000 < now.getTime()) return 'unverified';
  return f.status;
}

export function isBookable(f: Fixture, now = new Date()) {
  return f.venue === 'H' && effectiveStatus(f, now) === 'scheduled' && new Date(f.kickoff) > now;
}

export function nextFixture(fixtures: Fixture[], now = new Date()) {
  return fixtures.find((f) => effectiveStatus(f, now) === 'scheduled' && new Date(f.kickoff) > now);
}

export function form(fixtures: Fixture[], n = 5) {
  return fixtures
    .filter((f) => f.status === 'completed' && f.score)
    .slice(-n)
    .map((f) => (f.score!.chelsea > f.score!.opponent ? 'W' : f.score!.chelsea < f.score!.opponent ? 'L' : 'D'));
}
