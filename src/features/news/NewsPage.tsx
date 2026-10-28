import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, Img, PageHero, Pill, ProvenanceTag, Reveal } from '@/components/ui';
import { NEWS, NEWS_CATEGORIES } from '@/data/news';
import { fmtDate } from '@/lib/format';
import { useMeta } from '@/lib/hooks';

export default function NewsPage() {
  useMeta('News', 'Chelsea news, match reports and transfers — original summaries with dated sources.');
  const [cat, setCat] = useState<(typeof NEWS_CATEGORIES)[number]>('All');
  const list = NEWS.filter((n) => cat === 'All' || n.category === cat);
  const [lead, ...rest] = list;

  return (
    <>
      <PageHero eyebrow="Newsroom" title="The latest from the Bridge" intro="Original summaries of verified reporting. Official club announcements and third-party reports are labelled, and every story links to its source." />
      <section className="container-x">
        <div className="mb-10 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter news by category">
          {NEWS_CATEGORIES.map((c) => (
            <Pill key={c} active={cat === c} onClick={() => setCat(c)}>
              {c}
            </Pill>
          ))}
        </div>
        {!lead && <EmptyState title="No stories here yet" text="Nothing in this category has been verified for the current snapshot." />}
        {lead && (
          <Reveal>
            <Link to={`/news/${lead.slug}`} className="group grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div className="aspect-[16/9] overflow-hidden rounded-[28px]">
                <Img id={lead.image} className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-semibold uppercase tracking-[0.16em] text-gold-300">{lead.category}</span>
                  <span className="text-silver">{fmtDate(lead.date + 'T12:00:00Z')}</span>
                  <ProvenanceTag kind={lead.kind === 'official' ? 'verified' : 'editorial'}>{lead.kind === 'official' ? 'Official' : 'Reported'}</ProvenanceTag>
                </div>
                <h2 className="mt-4 font-serif text-4xl leading-tight group-hover:text-royal-300 md:text-5xl">{lead.title}</h2>
                <p className="mt-4 text-lg text-ivory-muted">{lead.summary}</p>
                <p className="mt-4 text-xs text-silver">Source: {lead.source.label}</p>
              </div>
            </Link>
          </Reveal>
        )}
        {rest.length > 0 && (
          <ul className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((n, i) => (
              <Reveal key={n.slug} delay={(i % 3) * 0.06}>
                <li>
                  <Link to={`/news/${n.slug}`} className="group block">
                    <div className="aspect-[4/3] overflow-hidden rounded-[20px]">
                      <Img id={n.image} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                      <span className="font-semibold uppercase tracking-[0.16em] text-gold-300">{n.category}</span>
                      <span className="text-silver">{fmtDate(n.date + 'T12:00:00Z')}</span>
                      {n.kind === 'reported' && <span className="text-silver">· Reported</span>}
                    </div>
                    <h3 className="mt-2 font-serif text-2xl leading-snug group-hover:text-royal-300">{n.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-ivory-muted">{n.summary}</p>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
