import { readJSON, writeJSON } from './storage';

const KEY = 'cfc-demo-profile-v1';

export interface Profile {
  displayName: string;
  email: string;
  favouriteStand: string;
  favourites: { players: string[]; legends: string[]; moments: string[] };
  newsCategories: string[];
}

export const EMPTY_PROFILE: Profile = {
  displayName: '',
  email: '',
  favouriteStand: 'Matthew Harding Stand',
  favourites: { players: [], legends: [], moments: [] },
  newsCategories: [],
};

export function getProfile(): Profile {
  const p = readJSON<Partial<Profile>>(KEY, {});
  return { ...EMPTY_PROFILE, ...p, favourites: { ...EMPTY_PROFILE.favourites, ...p.favourites } };
}

export function saveProfile(p: Profile) {
  return writeJSON(KEY, p);
}

export function toggleFavourite(kind: keyof Profile['favourites'], id: string) {
  const p = getProfile();
  const list = p.favourites[kind];
  p.favourites[kind] = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  saveProfile(p);
  return p.favourites[kind].includes(id);
}
