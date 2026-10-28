import { useEffect, useState, useSyncExternalStore } from 'react';
import { dataProvider } from '@/services/provider';
import type { Fixture, TableRow } from '@/data/types';

/** Returns a value derived from localStorage that refreshes on every demo-store write (this tab or another). */
export function useStored<T>(read: () => T): T {
  const [state, setState] = useState(read);
  useEffect(() => {
    const refresh = () => setState(read());
    window.addEventListener('cfc-storage', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('cfc-storage', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}

export function useFixtures() {
  const [fixtures, setFixtures] = useState<Fixture[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    dataProvider
      .getFixtures()
      .then((f) => alive && setFixtures(f))
      .catch(() => alive && setError('Fixtures could not be loaded.'));
    return () => {
      alive = false;
    };
  }, []);
  return { fixtures, error };
}

export function useTable() {
  const [table, setTable] = useState<{ rows: TableRow[]; note: string } | null>(null);
  useEffect(() => {
    dataProvider.getTable().then(setTable);
  }, []);
  return table;
}

export function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

const SITE = 'The Blue Experience';

/** Page title, description and Open Graph tags. Never claims to be the official club site. */
export function useMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE} — Unofficial Chelsea-inspired portfolio project`;
    const set = (sel: string, attr: string, key: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(sel);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = value;
    };
    const desc = description ?? 'An independent, unofficial portfolio project inspired by Chelsea FC. Not affiliated with Chelsea FC.';
    set('meta[name="description"]', 'name', 'description', desc);
    set('meta[property="og:title"]', 'property', 'og:title', document.title);
    set('meta[property="og:description"]', 'property', 'og:description', desc);
    set('meta[property="og:type"]', 'property', 'og:type', 'website');
  }, [title, description]);
}
