import { PageHero, ProvenanceTag, SectionHeading } from '@/components/ui';
import { ALL_MEDIA, PUBLIC_SAFE } from '@/data/media';
import { SEASON_SOURCES, SNAPSHOT_DATE } from '@/data/season';
import { fmtDate } from '@/lib/format';
import { useMeta } from '@/lib/hooks';

const REAL = [
  ['Club history, honours and legends', 'Verified against chelseafc.com, UEFA.com, FIFA.com and Wikipedia.'],
  ['2026/27 fixtures, results, table and squad', `Snapshot dated ${fmtDate(SNAPSHOT_DATE + 'T12:00:00Z', { day: 'numeric', month: 'long', year: 'numeric' })}. Not live.`],
  ['Transfers', 'Completed summer 2026 deals only — no rumours.'],
  ['News', 'Original summaries with source links and dates.'],
];

const DEMO = [
  ['Tour and museum booking', 'Prices, time slots and availability are simulated.'],
  ['Matchday seat selection', 'Seat maps, availability and prices are simulated. Never a real ticket.'],
  ['Booking confirmations and codes', 'The QR-style code is decorative and labelled “Not a ticket”.'],
  ['Demo account, favourites and profile', 'Stored in this browser’s localStorage only. No login, no server.'],
  ['Stadium 3D model and illustrative tour stops', 'A stylised model, not a survey-accurate reconstruction.'],
];

export default function AboutPage() {
  useMeta('About this project');
  return (
    <>
      <PageHero eyebrow="About" title="About this project" intro="The Blue Experience is an independent portfolio project inspired by Chelsea FC. It is not affiliated with, endorsed by or operated by Chelsea Football Club." />
      <div className="container-x max-w-5xl space-y-24">
        <section id="data" className="scroll-mt-28">
          <SectionHeading eyebrow="Honest functionality" title="What’s real, what’s demo" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="surface rounded-[24px] p-6">
              <ProvenanceTag kind="verified">Real, sourced data</ProvenanceTag>
              <ul className="mt-5 space-y-4">
                {REAL.map(([t, d]) => (
                  <li key={t}>
                    <p className="font-semibold">{t}</p>
                    <p className="text-sm text-ivory-muted">{d}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface rounded-[24px] p-6">
              <ProvenanceTag kind="demo">Simulated / demo</ProvenanceTag>
              <ul className="mt-5 space-y-4">
                {DEMO.map(([t, d]) => (
                  <li key={t}>
                    <p className="font-semibold">{t}</p>
                    <p className="text-sm text-ivory-muted">{d}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm text-ivory-muted">
            Season data sources:{' '}
            {SEASON_SOURCES.map((s, i) => (
              <span key={s.url}>
                <a className="underline underline-offset-4 hover:text-ivory" href={s.url} target="_blank" rel="noreferrer noopener">
                  {s.label}
                </a>
                {i < SEASON_SOURCES.length - 1 ? ', ' : '.'}
              </span>
            ))}
          </p>
        </section>

        <section id="credits" className="scroll-mt-28">
          <SectionHeading eyebrow="Image credits" title="Photography" intro={PUBLIC_SAFE ? 'All photographs come from Wikimedia Commons under the Creative Commons licences listed. Club crests are not reproduced; the site emblem is an original design.' : 'Photographs come from Wikimedia Commons under the Creative Commons licences listed. Club crests are trademarks of their clubs, shown for illustration only in this unofficial portfolio project.'} />
          <ul className="divide-y divide-white/[0.06] rounded-[24px] ring-1 ring-white/[0.06]">
            {ALL_MEDIA.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-sm">
                <span className="min-w-0 flex-1">{m.alt}</span>
                <span className="text-silver">{m.credit}</span>
                <a href={m.sourceUrl} target="_blank" rel="noreferrer noopener" className="text-gold-300 underline-offset-4 hover:underline">
                  {m.license}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading eyebrow="Built with" title="The stack" />
          <p className="text-ivory-muted">React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Three.js with React Three Fiber, and Lucide icons. Data flows through a provider interface, so a live football-data API can replace the snapshot without UI changes.</p>
        </section>
      </div>
    </>
  );
}
