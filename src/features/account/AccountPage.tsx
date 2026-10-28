import { CalendarCheck, Heart, Save, Ticket, Trash2, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/Toaster';
import { Button, EmptyState, LinkButton, PageHero, Pill } from '@/components/ui';
import { LEGENDS } from '@/data/legends';
import { NEWS_CATEGORIES } from '@/data/news';
import { STADIUM } from '@/data/stadium';
import { SQUAD } from '@/data/squad';
import { TIMELINE } from '@/data/timeline';
import { cx, gbp } from '@/lib/format';
import { useMeta, useStored } from '@/lib/hooks';
import { canCancel, cancelBooking, listBookings } from '@/services/bookings';
import { getProfile, saveProfile, type Profile } from '@/services/profile';
import { bookingTitle, bookingWhen } from '@/features/booking/ConfirmationPage';

type Tab = 'bookings' | 'favourites' | 'profile';

export default function AccountPage() {
  useMeta('My demo account');
  const bookings = useStored(listBookings);
  const stored = useStored(getProfile);
  const [tab, setTab] = useState<Tab>('bookings');
  const [draft, setDraft] = useState<Profile>(stored);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');

  const save = () => {
    if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(draft.email)) {
      setEmailError('Enter a valid email address or leave it blank.');
      return;
    }
    setEmailError('');
    saveProfile(draft);
    toast('Demo profile saved');
  };

  const favPlayers = SQUAD.filter((p) => stored.favourites.players.includes(p.slug));
  const favLegends = LEGENDS.filter((l) => stored.favourites.legends.includes(l.slug));
  const favMoments = TIMELINE.filter((t) => stored.favourites.moments.includes(t.id));

  return (
    <>
      <PageHero eyebrow="Demo account" title={<>{stored.displayName ? `Welcome, ${stored.displayName.split(' ')[0]}` : 'My Blue account'}</>} intro="Your demo bookings, favourites and preferences. Everything is stored only in this browser — there is no real login." />
      <div className="container-x">
        <div className="mb-8 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Account sections">
          {(
            [
              ['bookings', 'Bookings', Ticket],
              ['favourites', 'Favourites', Heart],
              ['profile', 'Profile', UserRound],
            ] as const
          ).map(([id, label, Icon]) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={cx('flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-semibold', tab === id ? 'bg-ivory text-midnight' : 'text-ivory/70 ring-1 ring-white/15 hover:text-ivory')}>
              <Icon className="h-4 w-4" /> {label}
              {id === 'bookings' && bookings.length > 0 && <span className="rounded-full bg-royal px-2 text-xs text-ivory">{bookings.length}</span>}
            </button>
          ))}
        </div>

        {tab === 'bookings' &&
          (bookings.length === 0 ? (
            <EmptyState title="No bookings yet" text="Book a stadium tour or pick demo matchday seats and they will appear here." action={<LinkButton to="/tickets">Browse tickets & tours</LinkButton>} />
          ) : (
            <ul className="space-y-4">
              {bookings.map((b) => (
                <li key={b.ref} className={cx('grid gap-4 rounded-[24px] p-6 ring-1 md:grid-cols-[auto_1fr_auto] md:items-center', b.status === 'cancelled' ? 'bg-white/[0.02] opacity-60 ring-white/5' : 'surface')}>
                  <span className={cx('grid h-12 w-12 place-items-center rounded-full', b.type === 'tour' ? 'bg-gold/15 text-gold-300' : 'bg-royal/40 text-royal-300')}>{b.type === 'tour' ? <CalendarCheck className="h-5 w-5" /> : <Ticket className="h-5 w-5" />}</span>
                  <div>
                    <p className="flex flex-wrap items-center gap-2 text-xs text-silver">
                      <span className="font-mono">{b.ref}</span>
                      <span className={cx('rounded-full px-2 py-0.5 font-semibold uppercase tracking-wider', b.status === 'confirmed' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/10 text-silver')}>{b.status}</span>
                      <span>{b.type === 'tour' ? 'Stadium experience' : 'Matchday seats'}</span>
                    </p>
                    <p className="mt-1 font-display text-3xl leading-none">{bookingTitle(b)}</p>
                    <p className="mt-1 text-sm text-ivory/75">
                      {bookingWhen(b)} · {gbp(b.total)} (simulated)
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <LinkButton to={`/tickets/confirmation/${b.ref}`} variant="ghost" size="sm">
                      Details
                    </LinkButton>
                    {canCancel(b) &&
                      (confirming === b.ref ? (
                        <>
                          <Button
                            size="sm"
                            className="bg-rose-500 hover:bg-rose-400"
                            onClick={() => {
                              cancelBooking(b.ref);
                              setConfirming(null);
                              toast('Demo booking cancelled');
                            }}
                          >
                            Confirm cancel
                          </Button>
                          <Button size="sm" variant="quiet" onClick={() => setConfirming(null)}>
                            Keep
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="quiet" onClick={() => setConfirming(b.ref)}>
                          <Trash2 className="h-4 w-4" /> Cancel
                        </Button>
                      ))}
                  </div>
                </li>
              ))}
            </ul>
          ))}

        {tab === 'favourites' && (
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ['Players', favPlayers.map((p) => ({ to: `/squad/${p.slug}`, label: p.name })), '/squad'],
              ['Legends', favLegends.map((l) => ({ to: `/legends/${l.slug}`, label: l.name })), '/legends'],
              ['Moments', favMoments.map((m) => ({ to: `/history#${m.id}`, label: `${m.year} · ${m.title}` })), '/history'],
            ].map(([title, items, browse]) => (
              <div key={title as string} className="surface rounded-[24px] p-6">
                <p className="eyebrow mb-4">{title as string}</p>
                {(items as { to: string; label: string }[]).length === 0 ? (
                  <p className="text-sm text-silver">
                    Nothing saved yet.{' '}
                    <Link to={browse as string} className="text-ivory underline-offset-4 hover:underline">
                      Browse {(title as string).toLowerCase()}
                    </Link>
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {(items as { to: string; label: string }[]).map((i) => (
                      <li key={i.to}>
                        <Link to={i.to} className="link-underline font-display text-2xl hover:text-royal-300">
                          {i.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'profile' && (
          <form
            className="surface max-w-2xl space-y-6 rounded-[24px] p-6 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-silver">Display name</span>
                <input value={draft.displayName} onChange={(e) => setDraft({ ...draft, displayName: e.target.value })} autoComplete="name" className="h-12 w-full rounded-xl bg-white/[0.05] px-4 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-gold/70" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-silver">Email (pre-fills bookings)</span>
                <input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} autoComplete="email" aria-invalid={!!emailError} className="h-12 w-full rounded-xl bg-white/[0.05] px-4 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-gold/70" />
                {emailError && (
                  <span className="mt-1.5 block text-xs text-rose-300" role="alert">
                    {emailError}
                  </span>
                )}
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-silver">Favourite stand</span>
                <select value={draft.favouriteStand} onChange={(e) => setDraft({ ...draft, favouriteStand: e.target.value })} className="h-12 w-full rounded-xl bg-white/[0.05] px-4 outline-none ring-1 ring-white/15">
                  {STADIUM.stands.map((s) => (
                    <option key={s.id} className="bg-midnight">
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <fieldset>
              <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-silver">News I care about</legend>
              <div className="flex flex-wrap gap-2">
                {NEWS_CATEGORIES.filter((c) => c !== 'All').map((c) => {
                  const on = draft.newsCategories.includes(c);
                  return (
                    <Pill key={c} active={on} onClick={() => setDraft({ ...draft, newsCategories: on ? draft.newsCategories.filter((x) => x !== c) : [...draft.newsCategories, c] })}>
                      {c}
                    </Pill>
                  );
                })}
              </div>
            </fieldset>
            <Button type="submit">
              <Save className="h-4 w-4" /> Save profile
            </Button>
            <p className="text-xs text-silver">Stored in this browser’s local storage. Clearing site data removes it.</p>
          </form>
        )}
      </div>
    </>
  );
}
