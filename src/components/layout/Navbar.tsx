import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, Ticket, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Emblem } from '@/components/Emblem';
import { cx } from '@/lib/format';
import { SearchDialog } from './SearchDialog';

const NAV = [
  { to: '/matches', label: 'Matches' },
  { to: '/squad', label: 'Squad' },
  {
    label: 'History',
    children: [
      { to: '/history', label: 'Club History', text: 'From the Rising Sun to world champions' },
      { to: '/trophies', label: 'Trophy Room', text: 'Every major honour, verified' },
      { to: '/legends', label: 'Legends', text: 'The players who made the club' },
    ],
  },
  { to: '/news', label: 'News' },
  { to: '/stadium', label: 'Stamford Bridge' },
  { to: '/fan-zone', label: 'Fan Zone' },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdown(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setDropdown(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const historyActive = ['/history', '/trophies', '/legends'].some((p) => pathname.startsWith(p));

  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded bg-gold px-4 py-2 text-midnight focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] transition-[background-color,backdrop-filter,box-shadow] duration-500',
          scrolled || open ? 'bg-midnight/80 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl' : 'bg-gradient-to-b from-midnight/70 to-transparent',
        )}
      >
        <nav className="container-x flex h-full items-center gap-6" aria-label="Main">
          <Link to="/" className="group flex items-center gap-3" aria-label="The Blue Experience — home">
            <Emblem size={40} className="transition-transform duration-500 group-hover:rotate-[8deg]" />
            <span className="hidden leading-none sm:block">
              <span className="block font-display text-[22px] tracking-wide">THE BLUE</span>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.34em] text-silver">Experience</span>
            </span>
          </Link>

          <ul className="ml-auto hidden items-center gap-1 lg:flex">
            {NAV.map((item) =>
              'children' in item ? (
                <li key={item.label} className="relative" onMouseEnter={() => setDropdown(true)} onMouseLeave={() => setDropdown(false)}>
                  <button
                    type="button"
                    aria-expanded={dropdown}
                    aria-haspopup="true"
                    onClick={() => setDropdown((d) => !d)}
                    className={cx('whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition-colors xl:px-4', historyActive ? 'text-ivory' : 'text-ivory/70 hover:text-ivory')}
                  >
                    {item.label}
                    {historyActive && <span className="mx-auto mt-0.5 block h-px w-4 bg-gold" />}
                  </button>
                  <AnimatePresence>
                    {dropdown && (
                      <motion.ul
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 top-full w-[320px] -translate-x-1/2 rounded-2xl bg-midnight-800/95 p-2 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl"
                      >
                        {item.children.map((c) => (
                          <li key={c.to}>
                            <NavLink to={c.to} className="block rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06]">
                              <span className="block text-sm font-semibold">{c.label}</span>
                              <span className="block text-xs text-silver">{c.text}</span>
                            </NavLink>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink to={item.to} className={({ isActive }) => cx('block whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition-colors xl:px-4', isActive ? 'text-ivory' : 'text-ivory/70 hover:text-ivory')}>
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive && <span className="mx-auto mt-0.5 block h-px w-4 bg-gold" />}
                      </>
                    )}
                  </NavLink>
                </li>
              ),
            )}
          </ul>

          <div className="ml-auto flex items-center gap-1 lg:ml-2">
            <button type="button" onClick={() => setSearchOpen(true)} className="grid h-10 w-10 place-items-center rounded-full text-ivory/80 transition-colors hover:bg-white/[0.08] hover:text-ivory" aria-label="Search (Ctrl+K)">
              <Search className="h-[18px] w-[18px]" />
            </button>
            <NavLink to="/account" className="grid h-10 w-10 place-items-center rounded-full text-ivory/80 transition-colors hover:bg-white/[0.08] hover:text-ivory" aria-label="My demo account">
              <UserRound className="h-[18px] w-[18px]" />
            </NavLink>
            <Link to="/tickets" className="ml-1 hidden h-10 items-center gap-2 rounded-full bg-royal px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ivory shadow-[0_8px_30px_-10px_rgba(3,70,148,1)] transition-colors hover:bg-royal-400 sm:inline-flex">
              <Ticket className="h-4 w-4" /> Book
            </Link>
            <button type="button" onClick={() => setOpen((o) => !o)} className="grid h-10 w-10 place-items-center rounded-full text-ivory lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-x-0 bottom-0 top-[var(--nav-h)] overflow-y-auto bg-midnight/[0.98] backdrop-blur-xl lg:hidden"
            >
              <ul className="container-x flex flex-col py-6">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/matches', label: 'Matches' },
                  { to: '/tickets', label: 'Tickets & Tours' },
                  { to: '/squad', label: 'The Squad' },
                  { to: '/history', label: 'Club History' },
                  { to: '/trophies', label: 'Trophy Room' },
                  { to: '/legends', label: 'Legends' },
                  { to: '/news', label: 'News' },
                  { to: '/stadium', label: 'Stamford Bridge' },
                  { to: '/fan-zone', label: 'Fan Zone' },
                  { to: '/account', label: 'My Demo Account' },
                ].map((l, i) => (
                  <motion.li key={l.to} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                    <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => cx('flex items-center justify-between border-b border-white/[0.06] py-4 font-display text-4xl tracking-wide', isActive ? 'text-gold-300' : 'text-ivory')}>
                      {l.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
