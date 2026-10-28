import { motion, useScroll } from 'framer-motion';
import { ArrowLeft, ExternalLink, Link2, Share2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toast } from '@/components/Toaster';
import { EmptyState, Img, LinkButton, ProvenanceTag, Reveal } from '@/components/ui';
import { NEWS } from '@/data/news';
import { fmtDate } from '@/lib/format';
import { useMeta } from '@/lib/hooks';

export default function ArticlePage() {
  const { slug } = useParams();
  const n = NEWS.find((x) => x.slug === slug);
  const { scrollYProgress } = useScroll();
  useMeta(n ? n.title : 'Article not found', n?.summary);

  if (!n) {
    return (
      <div className="container-x pt-40">
        <EmptyState level="h1" title="Story not found" text="This story isn’t in the newsroom." action={<LinkButton to="/news">Back to news</LinkButton>} />
      </div>
    );
  }
  const related = NEWS.filter((x) => x.slug !== n.slug && (n.related?.includes(x.slug) || x.category === n.category)).slice(0, 3);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: n.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast('Link copied to clipboard', 'info');
      }
    } catch {
      /* user cancelled share */
    }
  };

  return (
    <article>
      <motion.div className="fixed left-0 right-0 top-[var(--nav-h)] z-40 h-[2px] origin-left bg-gold" style={{ scaleX: scrollYProgress }} aria-hidden />
      <header className="container-x max-w-4xl pt-[calc(var(--nav-h)+48px)]">
        <Link to="/news" className="inline-flex items-center gap-2 text-sm text-silver hover:text-ivory">
          <ArrowLeft className="h-4 w-4" /> Newsroom
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold uppercase tracking-[0.16em] text-gold-300">{n.category}</span>
          <time dateTime={n.date} className="text-silver">
            {fmtDate(n.date + 'T12:00:00Z', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </time>
          <ProvenanceTag kind={n.kind === 'official' ? 'verified' : 'editorial'}>{n.kind === 'official' ? 'Official announcement' : 'Third-party reporting'}</ProvenanceTag>
        </div>
        <h1 className="mt-5 font-serif text-4xl leading-[1.1] sm:text-6xl">{n.title}</h1>
        <p className="mt-5 text-xl text-ivory-muted">{n.summary}</p>
      </header>
      <Reveal className="container-x mt-10 max-w-6xl">
        <div className="aspect-[16/8] overflow-hidden rounded-[28px]">
          <Img id={n.image} eager credit className="h-full w-full" />
        </div>
        <p className="mt-2 text-xs text-silver">Illustrative photograph — not from the reported event unless stated.</p>
      </Reveal>
      <div className="container-x mt-12 max-w-3xl">
        <div className="space-y-6 text-lg leading-relaxed text-ivory/90">
          {n.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-white/10 pt-8">
          <a href={n.source.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 text-sm ring-1 ring-white/10 hover:ring-white/30">
            <ExternalLink className="h-4 w-4" /> Read the source: {n.source.label}
          </a>
          <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-silver ring-1 ring-white/10 hover:text-ivory">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button
            type="button"
            onClick={() =>
              navigator.clipboard
                .writeText(window.location.href)
                .then(() => toast('Link copied', 'info'))
                .catch(() => toast('Could not copy the link', 'info'))
            }
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-silver ring-1 ring-white/10 hover:text-ivory"
          >
            <Link2 className="h-4 w-4" /> Copy link
          </button>
        </div>
        <p className="mt-6 text-xs text-silver">This is an original summary written for this portfolio project. It does not reproduce the source article.</p>
      </div>
      {related.length > 0 && (
        <section className="container-x pt-20">
          <h2 className="mb-6 font-display text-4xl">More stories</h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link to={`/news/${r.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden rounded-[20px]">
                    <Img id={r.image} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="mt-3 font-serif text-xl group-hover:text-royal-300">{r.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
