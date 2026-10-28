import { ArrowLeft, Heart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toast } from '@/components/Toaster';
import { Button, EmptyState, Img, LinkButton, ProvenanceTag, Reveal, Sources } from '@/components/ui';
import { SEASON_SOURCES } from '@/data/season';
import { SQUAD, SQUAD_UPDATED } from '@/data/squad';
import { NEWS } from '@/data/news';
import { fmtDate } from '@/lib/format';
import { useMeta, useStored } from '@/lib/hooks';
import { getProfile, toggleFavourite } from '@/services/profile';
import { PlayerCard } from './SquadPage';

export default function PlayerPage() {
  const { slug } = useParams();
  const p = SQUAD.find((x) => x.slug === slug);
  const profile = useStored(getProfile);
  useMeta(p ? p.name : 'Player not found');

  if (!p) {
    return (
      <div className="container-x pt-40">
        <EmptyState level="h1" title="Player not found" action={<LinkButton to="/squad">Back to the squad</LinkButton>} />
      </div>
    );
  }
  const fav = profile.favourites.players.includes(p.slug);
  const lastName = p.name.split(' ').slice(-1)[0];
  const news = NEWS.filter((n) => n.body.join(' ').includes(lastName) || n.title.includes(lastName));
  const teammates = SQUAD.filter((x) => x.position === p.position && x.slug !== p.slug).slice(0, 4);
  const apps = p.apps ? p.apps.starts + p.apps.subs : undefined;

  return (
    <article>
      <header className="relative isolate overflow-hidden pt-[calc(var(--nav-h)+40px)]">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-royal-700 via-midnight-800 to-midnight" />
        <span className="pointer-events-none absolute -right-10 top-10 -z-10 select-none font-display text-[44vw] leading-none text-white/[0.04] lg:text-[34vw]">{p.number}</span>
        <div className="container-x grid items-end gap-10 pb-16 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <Link to="/squad" className="inline-flex items-center gap-2 text-sm text-silver hover:text-ivory">
              <ArrowLeft className="h-4 w-4" /> The squad
            </Link>
            <p className="mt-10 font-display text-8xl leading-none text-gold-300">{p.number}</p>
            <h1 className="display mt-2 text-6xl sm:text-8xl">{p.name}</h1>
            <p className="mt-4 text-lg text-ivory/80">
              {p.role} · {p.nationality}
              {p.captain && ' · Club captain'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant={fav ? 'gold' : 'ghost'}
                onClick={() => {
                  const now = toggleFavourite('players', p.slug);
                  toast(now ? `${p.name} added to your favourites` : `${p.name} removed from favourites`);
                }}
                aria-pressed={fav}
              >
                <Heart className="h-4 w-4" fill={fav ? 'currentColor' : 'none'} /> {fav ? 'Favourite' : 'Add to favourites'}
              </Button>
            </div>
          </Reveal>
          {p.image && (
            <Reveal delay={0.1} className="mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[28px] ring-1 ring-white/10">
              <Img id={p.image} eager credit className="h-full w-full" />
            </Reveal>
          )}
        </div>
      </header>

      <div className="container-x grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-10">
          <section>
            <h2 className="eyebrow mb-4">Profile</h2>
            <p className="font-serif text-2xl leading-relaxed text-ivory/90">{p.bio ?? `${p.name} is part of the Chelsea men’s first-team squad for 2026/27.`}</p>
            {p.arrivedFrom && <p className="mt-4 text-ivory-muted">Joined from {p.arrivedFrom} in summer {p.joined}.</p>}
          </section>
          {news.length > 0 && (
            <section>
              <h2 className="eyebrow mb-4">In the news</h2>
              <ul className="space-y-3">
                {news.map((n) => (
                  <li key={n.slug}>
                    <Link to={`/news/${n.slug}`} className="link-underline font-serif text-xl hover:text-royal-300">
                      {n.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <Sources sources={SEASON_SOURCES.slice(0, 1)} />
        </div>
        <aside className="surface h-fit rounded-[24px] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="eyebrow">2026/27 so far</h2>
            <ProvenanceTag kind="snapshot">{fmtDate(SQUAD_UPDATED + 'T12:00:00Z', { day: 'numeric', month: 'short' })}</ProvenanceTag>
          </div>
          <dl className="grid grid-cols-3 gap-4 text-center">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-silver">Apps</dt>
              <dd className="font-display text-5xl">{apps ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-silver">Starts</dt>
              <dd className="font-display text-5xl">{p.apps?.starts ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-silver">Goals</dt>
              <dd className="font-display text-5xl">{p.goals ?? (p.apps ? 0 : '—')}</dd>
            </div>
          </dl>
          <p className="mt-5 text-xs text-silver">Premier League and EFL Cup. “—” means the figure isn’t in the verified snapshot.</p>
        </aside>
      </div>

      {teammates.length > 0 && (
        <section className="container-x pt-24">
          <h2 className="mb-6 font-display text-4xl">More {p.position.toLowerCase()}s</h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {teammates.map((t) => (
              <li key={t.slug}>
                <PlayerCard p={t} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
