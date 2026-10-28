import { ArrowRight, Building2, Crown, Landmark, Ticket, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Img, LinkButton, PageHero, ProvenanceTag, Reveal, SectionHeading } from '@/components/ui';
import { EXPERIENCES } from '@/data/experiences';
import { fmtDate, fmtTime, gbp } from '@/lib/format';
import { useFixtures, useMeta } from '@/lib/hooks';
import { isBookable } from '@/services/provider';
import { TeamBadge } from '@/components/ui';
import { DemoNotice } from './shared';

const kindIcon = { tour: Landmark, museum: Building2, vip: Crown, group: Users };

export default function TicketsPage() {
  useMeta('Tickets & Stadium Booking', 'Demo booking for Stamford Bridge tours, the museum and simulated matchday seats.');
  const { fixtures } = useFixtures();
  const home = (fixtures ?? []).filter((f) => isBookable(f)).slice(0, 6);

  return (
    <>
      <PageHero eyebrow="Tickets & stadium booking" title={<>Your seat at the Bridge</>} intro="Two kinds of booking, kept separate: stadium experiences (tours and museum), and simulated matchday seats. Everything here is a working demonstration." image="ank-08">
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton to="/tickets/tours/stadium-tour">Book a stadium tour</LinkButton>
          <a href="#matchdays" className="inline-flex h-12 items-center rounded-full px-6 text-[13px] font-semibold uppercase tracking-[0.14em] ring-1 ring-white/25 hover:ring-white/60">
            Matchday seats
          </a>
        </div>
      </PageHero>

      <div className="container-x">
        <DemoNotice />
      </div>

      <section className="container-x pt-20" aria-labelledby="exp-title">
        <SectionHeading eyebrow="Stadium experiences" title={<span id="exp-title">Tours & museum</span>} intro="Choose an experience, pick a date and time slot, and complete the full booking journey. Prices are illustrative demo prices." />
        <ul className="grid gap-5 md:grid-cols-2">
          {EXPERIENCES.map((e, i) => {
            const Icon = kindIcon[e.kind];
            return (
              <Reveal key={e.id} delay={(i % 2) * 0.08}>
                <li className="h-full">
                  <Link to={`/tickets/tours/${e.id}`} className="group relative flex h-full min-h-[320px] flex-col justify-end overflow-hidden rounded-[28px] ring-1 ring-white/10">
                    <Img id={e.image} className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/70 to-midnight/10" />
                    <div className="relative p-7">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur">
                          <Icon className="h-5 w-5 text-gold-300" />
                        </span>
                        <span className="text-xs text-silver">{e.duration}</span>
                        {e.featured && <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-midnight">Most popular</span>}
                      </div>
                      <h3 className="mt-4 font-display text-4xl leading-none tracking-wide">{e.name}</h3>
                      <p className="mt-2 text-ivory/80">{e.tagline}</p>
                      <div className="mt-5 flex items-center justify-between">
                        <p className="text-sm">
                          From <span className="font-display text-3xl text-gold-300">{gbp(Math.min(...Object.values(e.prices).filter(Boolean)))}</span> <span className="text-xs text-silver">demo price</span>
                        </p>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-royal transition-transform group-hover:translate-x-1">
                          <ArrowRight className="h-5 w-5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <section id="matchdays" className="container-x scroll-mt-24 pt-24" aria-labelledby="md-title">
        <SectionHeading eyebrow="Upcoming matchdays at Stamford Bridge" title={<span id="md-title">Matchday seats</span>} intro="Real fixtures, simulated seats. Choosing seats here never creates a real ticket — real tickets are subject to the club’s own ticketing rules." />
        {home.length === 0 ? (
          <p className="text-ivory-muted">No upcoming home fixtures are confirmed in the current snapshot.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {home.map((f, i) => (
              <Reveal key={f.id} delay={(i % 3) * 0.06}>
                <li className="surface flex h-full flex-col rounded-[24px] p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">{f.competition}</p>
                    <ProvenanceTag kind="demo">Simulated seats</ProvenanceTag>
                  </div>
                  <div className="mt-5 flex items-center gap-4">
                    <TeamBadge short="CHE" home size={52} />
                    <span className="font-display text-xl text-silver">v</span>
                    <TeamBadge short={f.opponentShort} size={52} />
                    <p className="font-display text-2xl leading-none">{f.opponent}</p>
                  </div>
                  <p className="mt-5 text-sm text-ivory/80">
                    {fmtDate(f.kickoff, { weekday: 'long', day: 'numeric', month: 'long' })} · {fmtTime(f.kickoff)}
                  </p>
                  <LinkButton to={`/tickets/match/${f.id}`} size="sm" className="mt-6 w-full">
                    <Ticket className="h-4 w-4" /> Choose seats
                  </LinkButton>
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </section>

      <section className="container-x pt-24" aria-labelledby="more-title">
        <SectionHeading eyebrow="Also available" title={<span id="more-title">Hospitality & groups</span>} />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-[28px] bg-gradient-to-br from-gold/20 to-midnight-800 p-8 ring-1 ring-gold/30">
            <Crown className="h-8 w-8 text-gold-300" />
            <h3 className="mt-4 font-display text-4xl">Premium hospitality</h3>
            <p className="mt-2 text-ivory-muted">This demo does not simulate hospitality packages. For real packages, see the official hospitality site.</p>
            <a href="https://hospitality.chelseafc.com/" target="_blank" rel="noreferrer noopener" className="mt-6 inline-block text-sm font-semibold text-gold-300 underline-offset-4 hover:underline">
              Official hospitality ↗
            </a>
          </div>
          <div className="surface rounded-[28px] p-8">
            <Users className="h-8 w-8 text-royal-300" />
            <h3 className="mt-4 font-display text-4xl">Group & school visits</h3>
            <p className="mt-2 text-ivory-muted">Bring 10 or more people on a dedicated demo tour slot with a group guide.</p>
            <LinkButton to="/tickets/tours/group-visit" variant="ghost" size="sm" className="mt-6">
              Book a group visit (demo)
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
