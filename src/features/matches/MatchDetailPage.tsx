import { ArrowLeft, CalendarDays, Gavel, MapPin, Ticket, Users } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, Img, LinkButton, ProvenanceTag, Reveal, Sources, TeamBadge } from '@/components/ui';
import { NEWS } from '@/data/news';
import type { Goal } from '@/data/types';
import { fmtDate, fmtTime, num } from '@/lib/format';
import { useMeta } from '@/lib/hooks';
import { FIXTURES } from '@/data/season';
import { effectiveStatus, isBookable } from '@/services/provider';
import { scoreline, StatusBadge, teams } from './MatchCard';

function GoalList({ goals, align }: { goals?: Goal[]; align: 'left' | 'right' }) {
  if (!goals?.length) return null;
  return (
    <ul className={`space-y-1 text-sm text-ivory/80 ${align === 'right' ? 'text-right' : ''}`}>
      {goals.map((g, i) => (
        <li key={i} title={g.note}>
          {g.player}
          {g.ownGoal && ' (o.g.)'}
          {g.penalty && ' (pen)'} <span className="text-silver">{g.minute}</span>
          {g.note && <span className="text-amber-300"> *</span>}
        </li>
      ))}
    </ul>
  );
}

export default function MatchDetailPage() {
  const { id } = useParams();
  const f = FIXTURES.find((x) => x.id === id);
  useMeta(f ? `${teams(f).home.name} v ${teams(f).away.name}` : 'Match not found');

  if (!f) {
    return (
      <div className="container-x pt-40">
        <EmptyState level="h1" title="Match not found" text="This fixture isn’t in the current data snapshot." action={<LinkButton to="/matches">All matches</LinkButton>} />
      </div>
    );
  }

  const { home, away } = teams(f);
  const status = effectiveStatus(f);
  const ours = f.chelseaScorers;
  const theirs = f.opponentScorers;
  const homeGoals = f.venue === 'H' ? ours : theirs;
  const awayGoals = f.venue === 'H' ? theirs : ours;
  const notes = [...(ours ?? []), ...(theirs ?? [])].filter((g) => g.note);
  const related = NEWS.filter((n) => n.title.toLowerCase().includes(f.opponent.split(' ')[0].toLowerCase()) && Math.abs(new Date(n.date).getTime() - new Date(f.kickoff).getTime()) < 5 * 86400000);

  return (
    <article>
      <header className="relative isolate overflow-hidden pb-16 pt-[calc(var(--nav-h)+40px)]">
        <Img id={f.venue === 'H' ? 'bowl-spurs' : 'pitch-2013'} eager className="absolute inset-0 -z-10 h-full w-full opacity-30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-midnight/70 via-midnight/85 to-midnight" />
        <div className="container-x">
          <Link to="/matches" className="inline-flex items-center gap-2 text-sm text-silver hover:text-ivory">
            <ArrowLeft className="h-4 w-4" /> All matches
          </Link>
          <Reveal className="mt-10 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <p className="eyebrow">
                {f.competition}
                {f.round ? ` · ${f.round}` : ''}
              </p>
              <StatusBadge fixture={f} />
            </div>
            <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-start gap-4 sm:gap-10">
              <div className="flex flex-col items-center gap-4">
                <TeamBadge short={home.short} home={home.us} size={96} />
                <h1 className="font-display text-3xl tracking-wide sm:text-5xl">{home.name}</h1>
                <GoalList goals={homeGoals} align="right" />
              </div>
              <div className="pt-6">
                {status === 'completed' ? (
                  <p className="font-display text-6xl tabular-nums sm:text-8xl">{scoreline(f)}</p>
                ) : (
                  <p className="font-display text-4xl text-silver sm:text-6xl">{f.dateOnly ? 'vs' : fmtTime(f.kickoff).replace(/ (GMT|BST)/, '')}</p>
                )}
              </div>
              <div className="flex flex-col items-center gap-4">
                <TeamBadge short={away.short} home={away.us} size={96} />
                <p className="font-display text-3xl tracking-wide sm:text-5xl">{away.name}</p>
                <GoalList goals={awayGoals} align="left" />
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      <div className="container-x grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-10">
          {status === 'unverified' && (
            <p className="rounded-2xl bg-amber-300/10 p-5 text-sm text-amber-100 ring-1 ring-amber-300/30">This match should have been played, but its result is not in the verified snapshot yet. We don’t show a score until it can be confirmed.</p>
          )}
          {f.report ? (
            <section>
              <h2 className="eyebrow mb-4">Match report</h2>
              <p className="font-serif text-2xl leading-relaxed text-ivory/90">{f.report}</p>
            </section>
          ) : (
            <section>
              <h2 className="eyebrow mb-4">Match report</h2>
              <p className="text-ivory-muted">{status === 'completed' ? 'A written report for this match is not included in this snapshot. The score, scorers and attendance above come from the cited sources.' : 'Preview and team news will appear here closer to kick-off.'}</p>
            </section>
          )}
          {notes.length > 0 && (
            <ul className="space-y-2 text-xs text-amber-200/90">
              {notes.map((g, i) => (
                <li key={i}>* {g.note}</li>
              ))}
            </ul>
          )}
          <section>
            <h2 className="eyebrow mb-4">Line-ups & statistics</h2>
            <p className="text-ivory-muted">Verified line-ups and match statistics are not part of this snapshot. A live data provider can populate this section without UI changes.</p>
          </section>
          {related.length > 0 && (
            <section>
              <h2 className="eyebrow mb-4">Related news</h2>
              <ul className="space-y-3">
                {related.map((n) => (
                  <li key={n.slug}>
                    <Link to={`/news/${n.slug}`} className="link-underline font-serif text-xl hover:text-royal-300">
                      {n.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <Sources sources={f.sources} />
        </div>

        <aside className="space-y-6">
          <div className="surface rounded-[24px] p-6">
            <h2 className="eyebrow mb-5">Match information</h2>
            <dl className="space-y-4 text-sm">
              <div className="flex gap-3">
                <CalendarDays className="h-4 w-4 shrink-0 text-gold-300" />
                <div>
                  <dt className="sr-only">Date</dt>
                  <dd>
                    {fmtDate(f.kickoff, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    {!f.dateOnly && ` · ${fmtTime(f.kickoff)}`}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-gold-300" />
                <div>
                  <dt className="sr-only">Venue</dt>
                  <dd>{f.stadium}</dd>
                </div>
              </div>
              {f.attendance && (
                <div className="flex gap-3">
                  <Users className="h-4 w-4 shrink-0 text-gold-300" />
                  <div>
                    <dt className="sr-only">Attendance</dt>
                    <dd>Attendance {num(f.attendance)}</dd>
                  </div>
                </div>
              )}
              {f.referee && (
                <div className="flex gap-3">
                  <Gavel className="h-4 w-4 shrink-0 text-gold-300" />
                  <div>
                    <dt className="sr-only">Referee</dt>
                    <dd>Referee: {f.referee}</dd>
                  </div>
                </div>
              )}
            </dl>
          </div>
          <div className="rounded-[24px] bg-gradient-to-br from-royal-600 to-midnight-700 p-6 ring-1 ring-white/10">
            <h2 className="eyebrow mb-3 text-ivory/80">Booking</h2>
            {isBookable(f) ? (
              <>
                <p className="text-sm text-ivory/85">Try the simulated seat selector for this home match.</p>
                <ProvenanceTag kind="demo">Simulated · not a real ticket</ProvenanceTag>
                <LinkButton to={`/tickets/match/${f.id}`} className="mt-5 w-full">
                  <Ticket className="h-4 w-4" /> Choose demo seats
                </LinkButton>
              </>
            ) : (
              <p className="text-sm text-ivory/85">{f.venue === 'A' ? 'Away fixture — allocations are handled by the home club.' : 'Booking is closed for this match.'} You can still book a stadium tour (demo).</p>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
