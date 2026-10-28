import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, Img, LinkButton, Reveal, Sources } from '@/components/ui';
import { HONOURS } from '@/data/honours';
import { LEGENDS } from '@/data/legends';
import { useMeta } from '@/lib/hooks';
import { TrophyIcon } from './TrophyIcon';

export default function TrophyDetailPage() {
  const { slug } = useParams();
  const h = HONOURS.find((x) => x.slug === slug);
  useMeta(h ? h.name : 'Trophy not found');
  if (!h) {
    return (
      <div className="container-x pt-40">
        <EmptyState level="h1" title="Trophy not found" action={<LinkButton to="/trophies">Back to the Trophy Room</LinkButton>} />
      </div>
    );
  }
  const players = LEGENDS.filter((l) => l.honours.includes(h.slug));
  const idx = HONOURS.indexOf(h);
  const next = HONOURS[(idx + 1) % HONOURS.length];

  return (
    <article>
      <header className="relative isolate overflow-hidden pb-16 pt-[calc(var(--nav-h)+40px)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,164,92,0.22),transparent_55%)]" />
        <div className="container-x">
          <Link to="/trophies" className="inline-flex items-center gap-2 text-sm text-silver hover:text-ivory">
            <ArrowLeft className="h-4 w-4" /> Trophy Room
          </Link>
          <div className="mt-8 grid items-center gap-10 md:grid-cols-[auto_1fr]">
            <Reveal>
              <TrophyIcon slug={h.slug} className="mx-auto h-56 w-56 drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] md:h-72 md:w-72" />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="eyebrow">{h.category}</p>
              <h1 className="display mt-3 text-6xl sm:text-8xl">{h.name}</h1>
              <p className="mt-4 font-display text-4xl text-gold-sheen">
                {h.count}× winners
              </p>
              <p className="mt-5 max-w-2xl text-lg text-ivory-muted">{h.description}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {h.seasons.map((s) => (
                  <li key={s} className="rounded-full bg-white/[0.05] px-3 py-1 text-sm ring-1 ring-white/10">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </header>

      {h.finals && (
        <section className="container-x">
          <h2 className="mb-6 font-display text-4xl">{h.slug === 'league-titles' ? 'Title seasons' : 'The finals'}</h2>
          <ol className="grid gap-4 md:grid-cols-2">
            {h.finals.map((f, i) => (
              <Reveal key={f.season + f.opponent} delay={(i % 2) * 0.06}>
                <li className="surface h-full rounded-[24px] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">{f.season}</p>
                      {f.date && <p className="text-xs text-silver">{f.date}</p>}
                    </div>
                    <p className="font-display text-3xl tabular-nums text-ivory">{f.score}</p>
                  </div>
                  <p className="mt-3 font-display text-2xl tracking-wide">{h.slug === 'league-titles' ? f.opponent : `Chelsea v ${f.opponent}`}</p>
                  <p className="text-sm text-ivory-muted">{f.venue}</p>
                  {f.scorers && <p className="mt-3 text-sm text-ivory/80">Chelsea scorers: {f.scorers}</p>}
                  {f.note && <p className="mt-2 text-xs text-silver">{f.note}</p>}
                </li>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {players.length > 0 && (
        <section className="container-x pt-20">
          <h2 className="mb-6 font-display text-4xl">Legends who lifted it</h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {players.map((l) => (
              <li key={l.slug}>
                <Link to={`/legends/${l.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[20px] bg-gradient-to-br from-royal-700 to-midnight-800 ring-1 ring-white/10">
                  {l.image && <Img id={l.image} className="absolute inset-0 h-full w-full opacity-80 transition-transform duration-700 group-hover:scale-105" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight to-transparent" />
                  <p className="absolute inset-x-0 bottom-0 p-4 font-display text-2xl leading-none">{l.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="container-x pt-16">
        <Sources sources={h.sources} />
        <LinkButton to={`/trophies/${next.slug}`} variant="ghost" className="mt-8">
          Next: {next.name}
        </LinkButton>
      </section>
    </article>
  );
}
