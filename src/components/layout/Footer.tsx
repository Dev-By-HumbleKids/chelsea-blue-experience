import { Link } from 'react-router-dom';
import { Emblem } from '@/components/Emblem';
import { PUBLIC_SAFE } from '@/data/media';
import { SNAPSHOT_DATE } from '@/data/season';
import { fmtDate } from '@/lib/format';

const COLS = [
  { title: 'Matchday', links: [['/matches', 'Fixtures & Results'], ['/tickets', 'Tickets & Tours'], ['/account', 'My Demo Bookings']] },
  { title: 'The Club', links: [['/squad', 'Squad'], ['/news', 'News'], ['/stadium', 'Stamford Bridge']] },
  { title: 'Heritage', links: [['/history', 'Club History'], ['/trophies', 'Trophy Room'], ['/legends', 'Legends'], ['/fan-zone', 'Fan Zone']] },
  { title: 'Project', links: [['/about', 'About this demo'], ['/about#credits', 'Image credits'], ['/about#data', 'Data sources']] },
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/[0.06] bg-midnight">
      <div className="pointer-events-none absolute inset-x-0 -top-10 select-none text-center font-display text-[22vw] leading-none text-white/[0.025]" aria-hidden>
        LONDON IS BLUE
      </div>
      <div className="container-x relative grid gap-12 py-16 md:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div>
          <div className="flex items-center gap-3">
            <Emblem size={48} />
            <div>
              <p className="font-display text-2xl tracking-wide">THE BLUE EXPERIENCE</p>
              <p className="text-xs text-silver">One club. One city. One pride.</p>
            </div>
          </div>
          <p className="mt-6 max-w-xs text-sm text-ivory-muted">A digital tribute to the matchdays, legends and history of Stamford Bridge.</p>
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="eyebrow mb-4">{c.title}</p>
            <ul className="space-y-2.5 text-sm">
              {c.links.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="link-underline text-ivory/75 hover:text-ivory">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-silver md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl">
            <strong className="text-ivory/80">Unofficial portfolio project.</strong> Inspired by Chelsea FC, but not affiliated with, endorsed by or operated by Chelsea Football Club. Club names are used only to identify the real-world subject.
            Bookings are simulated and no payments are taken. Photographs are used under their stated Creative Commons licences.
            {!PUBLIC_SAFE && ' Club crests are trademarks of their respective clubs and appear only in this private preview build.'}
          </p>
          <p className="shrink-0">Season data snapshot: {fmtDate(SNAPSHOT_DATE + 'T12:00:00Z', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>
    </footer>
  );
}
