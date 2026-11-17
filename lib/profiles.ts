// Profile auf diesem Gerät (seit v0.10.0): Name + kurzes Passwort.
// Jedes Profil hat eine eigene Datenbank im Browser. Das Passwort trennt die
// Profile auf einem gemeinsam genutzten Gerät und verschlüsselt den Sync-Code;
// die Daten im Browser selbst sind nicht verschlüsselt.
import {passwordVerifier} from './sync.mjs';

export type Profile = {id: string; name: string; salt: string; verifier: string; db: string; created: string};
const KEY = 'lernraum:profiles', ACTIVE = 'lernraum:active';
const store = {
  get(k: string, session = false) {try {return (session ? sessionStorage : localStorage).getItem(k);} catch {return null;}},
  set(k: string, v: string, session = false) {try {(session ? sessionStorage : localStorage).setItem(k, v);} catch {}},
  del(k: string) {try {localStorage.removeItem(k); sessionStorage.removeItem(k);} catch {}},
};
const hex = (b: Uint8Array) => [...b].map(x => x.toString(16).padStart(2, '0')).join('');

export function listProfiles(): Profile[] {
  try {const l = JSON.parse(store.get(KEY) || '[]'); return Array.isArray(l) ? l : [];} catch {return [];}
}
function saveProfiles(l: Profile[]) {store.set(KEY, JSON.stringify(l));}
export const cleanName = (n: string) => n.trim().replace(/\s+/g, ' ').slice(0, 40);
export const sameName = (a: string, b: string) => cleanName(a).toLocaleLowerCase('de') === cleanName(b).toLocaleLowerCase('de');

export async function createProfile(name: string, password: string): Promise<Profile> {
  const n = cleanName(name);
  if (n.length < 2) throw Error('Bitte einen Namen mit mindestens 2 Zeichen eingeben.');
  if (password.length < 4) throw Error('Das Passwort braucht mindestens 4 Zeichen.');
  const list = listProfiles();
  if (list.some(p => sameName(p.name, n))) throw Error('Auf diesem Gerät gibt es schon ein Profil „' + n + '“. Bitte anmelden.');
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  const id = crypto.randomUUID();
  // Das erste Profil übernimmt die bisherigen Daten dieses Geräts (Datenbank „lernraum“).
  const db = list.some(p => p.db === 'lernraum') ? 'lernraum-' + id : 'lernraum';
  const profile = {id, name: n, salt, verifier: await passwordVerifier(password, salt), db, created: new Date().toISOString()};
  saveProfiles([...list, profile]);
  return profile;
}
export async function checkPassword(p: Profile, password: string) {
  return (await passwordVerifier(password, p.salt)) === p.verifier;
}
export async function login(id: string, password: string, remember: boolean): Promise<Profile> {
  const p = listProfiles().find(x => x.id === id);
  if (!p) throw Error('Profil nicht gefunden.');
  if (!await checkPassword(p, password)) throw Error('Passwort stimmt nicht.');
  setActive(p.id, remember);
  return p;
}
export function setActive(id: string, remember: boolean) {store.del(ACTIVE); store.set(ACTIVE, id, !remember);}
export function activeProfile(): Profile | null {
  const id = store.get(ACTIVE, true) || store.get(ACTIVE);
  return listProfiles().find(p => p.id === id) || null;
}
export function logout() {store.del(ACTIVE);}
export async function changePassword(id: string, oldPw: string, newPw: string) {
  const list = listProfiles(); const p = list.find(x => x.id === id);
  if (!p || !await checkPassword(p, oldPw)) throw Error('Bisheriges Passwort stimmt nicht.');
  if (newPw.length < 4) throw Error('Das neue Passwort braucht mindestens 4 Zeichen.');
  p.salt = hex(crypto.getRandomValues(new Uint8Array(16))); p.verifier = await passwordVerifier(newPw, p.salt);
  saveProfiles(list);
}

// Passwort nur im Arbeitsspeicher dieser Sitzung – damit der Sync-Code ohne erneute Eingabe erstellt werden kann.
let sessionPassword = '';
export function rememberPassword(pw: string) {sessionPassword = pw;}
export function currentPassword() {return sessionPassword;}
