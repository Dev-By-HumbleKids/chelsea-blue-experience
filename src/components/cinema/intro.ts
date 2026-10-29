import { useEffect, useState } from 'react';

/**
 * Shared "intro finished" signal. The preloader plays once per browser session; hero animations
 * wait for it so the title reveal isn't hidden behind the curtain.
 */
const KEY = 'cfc-intro-played';

function alreadyPlayed() {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return true;
  }
}

let done = alreadyPlayed();

export function introWillPlay() {
  return !done;
}

export function markIntroDone() {
  if (done) return;
  done = true;
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* storage blocked — the intro simply plays again next visit */
  }
  window.dispatchEvent(new Event('cfc-intro-done'));
}

export function useIntroDone() {
  const [ready, setReady] = useState(done);
  useEffect(() => {
    if (done) {
      setReady(true);
      return;
    }
    const on = () => setReady(true);
    window.addEventListener('cfc-intro-done', on);
    return () => window.removeEventListener('cfc-intro-done', on);
  }, []);
  return ready;
}
