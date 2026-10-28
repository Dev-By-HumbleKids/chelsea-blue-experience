import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { LinkButton, ProvenanceTag, Reveal, Skeleton, TeamBadge } from '@/components/ui';
import { SNAPSHOT_DATE } from '@/data/season';
import { fmtDate, fmtTime } from '@/lib/format';
import { useFixtures, useNow } from '@/lib/hooks';
import { form, isBookable, nextFixture } from '@/services/provider';
import { FormDot, scoreline, teams } from '@/features/matches/MatchCard';

function Countdown({ to }: { to: string }) {
  const now = useNow(1000);
  const ms = Math.max(0, new Date(to).getTime() - now.getTime());
  const parts = [
    ['Days', Math.floor(ms / 86400000)],
    ['Hrs', Math.floor(ms / 3600000) % 24],
    ['Min', Math.floor(ms / 60000) % 60],
    ['Sec', Math.floor(ms / 1000) % 60],
  ] as const;
  return (
    <div className="flex gap-2 sm:gap-3" role="timer" aria-label="Time until kick-off">
      {parts.map(([label, v]) => (
        <div key={label} className="w-[64px] rounded-xl bg-white/[0.05] py-3 text-center ring-1 ring-white/10 sm:w-[76px]">
          <span className="block font-display text-3xl tabular-nums sm:text-4xl">{String(v).padStart(2, '0')}</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-silver">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function NextMatch() {
  const { fixtures } = useFixtures();
  if (!fixtures) return <Skeleton className="container-x h-[380px]" />;
  const next = nextFixture(fixtures);
  const last = [...fixtures].reverse().find((f) => f.status === 'completed');
  const recent = form(fixtures);

  return (
    <section className="container-x relative -mt-px py-24 md:py-32" aria-labelledby="next-match-title">
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Reveal className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-royal-600 via-royal-700 to-midnight-800 p-6 ring-1 ring-white/10 sm:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-royal-300/30 blur-[90px]" aria-hidden />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p id="next-match-title" className="eyebrow text-ivory/80">
              Next match
            </p>
            <ProvenanceTag kind="snapshot">Fixture list · {fmtDate(SNAPSHOT_DATE + 'T12:00:00Z', { day: 'numeric', month: 'short' })}</ProvenanceTag>
          </div>
          {next ? (
            <>
              <div className="mt-10 flex items-center justify-between gap-4">
                {(() => {
                  const { home, away } = teams(next);
                  return (
                    <>
                      <div className="flex flex-1 flex-col items-center gap-3 text-center">
                        <TeamBadge short={home.short} home={home.us} size={84} />
                        <span className="font-display text-2xl tracking-wide sm:text-4xl">{home.name}</span>
                      </div>
                      <span className="font-display text-3xl text-ivory/40">VS</span>
                      <div className="flex flex-1 flex-col items-center gap-3 text-center">
                        <TeamBadge short={away.short} home={away.us} size={84} />
                        <span className="font-display text-2xl tracking-wide sm:text-4xl">{away.name}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
              <div className="mt-10 flex flex-col items-center gap-8">
                <Countdown to={next.kickoff} />
                <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ivory/80">
                  <li className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gold-300" /> {fmtDate(next.kickoff, { weekday: 'long', day: 'numeric', month: 'long' })}
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gold-300" /> {fmtTime(next.kickoff)}
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gold-300" /> {next.stadium}
                  </li>
                  <li className="text-silver">
                    {next.competition}
                    {next.round ? ` · ${next.round}` : ''}
                  </li>
                </ul>
                <div className="flex flex-wrap justify-center gap-3">
                  <LinkButton to={`/matches/${next.id}`} variant="ghost">
                    Match details
                  </LinkButton>
                  {isBookable(next) ? (
                    <LinkButton to={`/tickets/match/${next.id}`}>Choose demo seats</LinkButton>
                  ) : (
                    <LinkButton to="/tickets" variant="quiet">
                      Away match — book a stadium tour
                    </LinkButton>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="mt-10 text-ivory-muted">No upcoming fixture is confirmed in the current data snapshot. Check back once the next fixtures are published.</p>
          )}
        </Reveal>

        <div className="grid gap-6">
          {last && (
            <Reveal delay={0.1} className="surface rounded-[28px] p-6 sm:p-8">
              <p className="eyebrow">Last result</p>
              <p className="mt-4 text-sm text-silver">
                {last.competition} · {fmtDate(last.kickoff, { day: 'numeric', month: 'short' })}
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="font-display text-2xl">{teams(last).home.name}</span>
                <span className="font-display text-4xl tabular-nums text-gold-300">{scoreline(last)}</span>
                <span className="text-right font-display text-2xl">{teams(last).away.name}</span>
              </div>
              <LinkButton to={`/matches/${last.id}`} variant="quiet" size="sm" className="mt-4 -ml-4">
                Match report
              </LinkButton>
            </Reveal>
          )}
          <Reveal delay={0.2} className="surface rounded-[28px] p-6 sm:p-8">
            <p className="eyebrow">Form · last five</p>
            <div className="mt-4 flex gap-2">
              {recent.map((r, i) => (
                <FormDot key={i} r={r} />
              ))}
            </div>
            <p className="mt-6 text-sm text-ivory-muted">
              Premier League: <strong className="text-ivory">5th</strong> after eight matches, 13 points (25 Oct).
            </p>
            <LinkButton to="/matches#table" variant="quiet" size="sm" className="mt-3 -ml-4">
              Season tracker
            </LinkButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
