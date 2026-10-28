import { AnimatePresence, motion } from 'framer-motion';
import { Check, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';
import { Button, Img, PageHero, Reveal, SectionHeading } from '@/components/ui';
import { GLOSSARY, KITS, type Kit } from '@/data/culture';
import { cx } from '@/lib/format';
import { useMeta } from '@/lib/hooks';

/** Original flat illustration of a kit, coloured from data. Not a reproduction of any real shirt design. */
function KitSvg({ kit }: { kit: Kit }) {
  return (
    <svg viewBox="0 0 120 170" className="h-full w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" aria-hidden>
      <path d="M38 8 L22 14 L4 34 L16 52 L28 44 L28 98 L92 98 L92 44 L104 52 L116 34 L98 14 L82 8 Q60 22 38 8 Z" fill={kit.shirt} />
      {kit.pattern === 'collar' && <path d="M38 8 Q60 26 82 8 L76 6 Q60 18 44 6 Z" fill={kit.trim} />}
      {kit.pattern === 'vneck' && <path d="M44 9 L60 28 L76 9 L71 8 L60 21 L49 8 Z" fill={kit.trim} />}
      <path d="M4 34 L16 52 L19 50 L7 32 Z M116 34 L104 52 L101 50 L113 32 Z" fill={kit.trim} opacity="0.9" />
      <path d="M30 100 L90 100 L94 132 L64 132 L60 118 L56 132 L26 132 Z" fill={kit.shorts} />
      <rect x="30" y="136" width="20" height="30" rx="4" fill={kit.socks} />
      <rect x="70" y="136" width="20" height="30" rx="4" fill={kit.socks} />
    </svg>
  );
}

const QUIZ = [
  { q: 'In which year was the club founded?', options: ['1899', '1905', '1912', '1920'], a: 1, why: 'Chelsea were founded on 10 March 1905 at the Rising Sun pub.' },
  { q: 'Who scored the 88th-minute equaliser in the 2012 Champions League final?', options: ['Frank Lampard', 'Juan Mata', 'Didier Drogba', 'Fernando Torres'], a: 2, why: 'Drogba headed in from a corner, then scored the winning penalty.' },
  { q: 'Who holds the club record for appearances?', options: ['John Terry', 'Ron Harris', 'Frank Lampard', 'Peter Bonetti'], a: 1, why: 'Ron Harris made 795 appearances between 1961 and 1980.' },
  { q: 'Who did Chelsea beat 3–0 in the 2025 FIFA Club World Cup final?', options: ['Real Madrid', 'Bayern Munich', 'Paris Saint-Germain', 'Palmeiras'], a: 2, why: 'Palmer scored twice and João Pedro once at the MetLife Stadium.' },
  { q: 'Who is Chelsea’s all-time record goalscorer?', options: ['Bobby Tambling', 'Didier Drogba', 'Frank Lampard', 'Kerry Dixon'], a: 2, why: 'Lampard scored 211 goals, passing Tambling’s 202 in 2013.' },
  { q: 'Which stand is named after a former vice-chairman?', options: ['The Shed End', 'Matthew Harding Stand', 'West Stand', 'East Stand'], a: 1, why: 'The Matthew Harding Stand honours the vice-chairman who died in 1996.' },
];

function Quiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= QUIZ.length;
  const q = QUIZ[i];

  const choose = (k: number) => {
    if (picked !== null) return;
    setPicked(k);
    if (k === q.a) setScore((s) => s + 1);
  };

  return (
    <div className="surface rounded-[28px] p-6 sm:p-10" aria-live="polite">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p className="eyebrow">Your score</p>
            <p className="mt-3 font-display text-8xl text-gold-sheen">
              {score}/{QUIZ.length}
            </p>
            <p className="mt-3 text-ivory-muted">{score === QUIZ.length ? 'Perfect. True Blue.' : score >= 4 ? 'Strong — you know your Blues.' : 'A few more trips round the museum and you’ll be there.'}</p>
            <Button
              className="mt-6"
              variant="ghost"
              onClick={() => {
                setI(0);
                setScore(0);
                setPicked(null);
              }}
            >
              <RotateCcw className="h-4 w-4" /> Play again
            </Button>
          </motion.div>
        ) : (
          <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-silver">
              Question {i + 1} of {QUIZ.length}
            </p>
            <p className="mt-3 font-serif text-3xl leading-snug">{q.q}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {q.options.map((o, k) => {
                const state = picked === null ? 'idle' : k === q.a ? 'right' : k === picked ? 'wrong' : 'idle';
                return (
                  <li key={o}>
                    <button
                      type="button"
                      onClick={() => choose(k)}
                      disabled={picked !== null}
                      className={cx(
                        'flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left ring-1 transition-colors',
                        state === 'right' ? 'bg-emerald-400/15 ring-emerald-300/60' : state === 'wrong' ? 'bg-rose-400/15 ring-rose-300/60' : 'bg-white/[0.04] ring-white/10 hover:ring-white/40',
                      )}
                    >
                      {o}
                      {state === 'right' && <Check className="h-5 w-5 text-emerald-300" />}
                      {state === 'wrong' && <X className="h-5 w-5 text-rose-300" />}
                    </button>
                  </li>
                );
              })}
            </ul>
            {picked !== null && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-ivory/80">{q.why}</p>
                <Button
                  onClick={() => {
                    setI(i + 1);
                    setPicked(null);
                  }}
                >
                  {i + 1 === QUIZ.length ? 'See score' : 'Next question'}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FanZonePage() {
  useMeta('Fan Zone', 'Kit history, club traditions, a fan gallery and a quiz.');
  const [kit, setKit] = useState(KITS[0]);
  return (
    <>
      <PageHero eyebrow="Fan Zone" title={<>Blue is the colour</>} intro="Kits through the decades, the words every supporter knows, and a quiz to test what you’ve learned on this site." image="spurs-2016" />

      <section className="container-x" aria-labelledby="kits-title">
        <SectionHeading eyebrow="Kit history" title={<span id="kits-title">Shirts through the eras</span>} intro="Original illustrations based on documented colours — not reproductions of the real kits." />
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
            <div className="absolute inset-0 rounded-full bg-royal/30 blur-[90px]" aria-hidden />
            <AnimatePresence mode="wait">
              <motion.div key={kit.id} initial={{ opacity: 0, rotateY: -60 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: 60 }} transition={{ duration: 0.5 }} className="relative h-full" style={{ transformPerspective: 900 }}>
                <KitSvg kit={kit} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div>
            <p className="font-display text-7xl text-gold-sheen">{kit.era}</p>
            <p className="font-display text-4xl">{kit.title}</p>
            <p className="mt-3 max-w-lg text-ivory-muted">{kit.note}</p>
            <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Choose an era">
              {KITS.map((k) => (
                <button key={k.id} type="button" onClick={() => setKit(k)} aria-pressed={kit.id === k.id} className={cx('flex items-center gap-2 rounded-full py-1 pl-1 pr-4 text-sm ring-1', kit.id === k.id ? 'bg-ivory text-midnight ring-ivory' : 'ring-white/15 hover:ring-white/40')}>
                  <span className="h-7 w-7 rounded-full ring-2 ring-white/40" style={{ background: k.shirt }} />
                  {k.era}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x pt-28" aria-labelledby="gallery-title">
        <SectionHeading eyebrow="Fan gallery" title={<span id="gallery-title">Moments in the stands</span>} />
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {['fans-psg-2014', 'shed-end', 'osgood-statue', 'spurs-2016', 'ank-27', 'main-entrance', 'pitch-2013', 'ank-25'].map((id, i) => (
            <Reveal key={id} delay={(i % 3) * 0.05} className="mb-4 break-inside-avoid overflow-hidden rounded-[20px]">
              <Img id={id} credit className="w-full [&_img]:h-auto" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x pt-28" aria-labelledby="glossary-title">
        <SectionHeading eyebrow="Club identity" title={<span id="glossary-title">Speak Blue</span>} />
        <dl className="grid gap-px overflow-hidden rounded-[24px] bg-white/[0.06] ring-1 ring-white/[0.06] md:grid-cols-2">
          {GLOSSARY.map((g) => (
            <div key={g.term} className="bg-midnight p-6">
              <dt className="font-display text-3xl tracking-wide text-royal-300">{g.term}</dt>
              <dd className="mt-2 text-ivory-muted">{g.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-x pt-28" aria-labelledby="quiz-title">
        <SectionHeading eyebrow="Test yourself" title={<span id="quiz-title">The Blue quiz</span>} intro="Six questions, all answered somewhere on this site." />
        <Quiz />
      </section>
    </>
  );
}
