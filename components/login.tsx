'use client';
// Anmeldung (seit v0.10.0): Profil wählen, neues Profil anlegen oder
// mit einem Sync-Code von einem anderen Gerät einsteigen.
import {useState} from 'react';
import {listProfiles, createProfile, login, setActive, sameName, rememberPassword, type Profile} from '../lib/profiles';
import {decodeSync} from '../lib/sync.mjs';

type Any = any;
export default function Login({hasLegacyData, onDone}: {hasLegacyData: boolean; onDone: (p: Profile, pendingSync?: Any) => void}) {
  const profiles = listProfiles();
  const [mode, Mode] = useState<'pick' | 'new' | 'code'>(profiles.length ? 'pick' : 'new');
  const [picked, Pick] = useState<string>(profiles.length === 1 ? profiles[0].id : '');
  const [name, Name] = useState('');
  const [pw, Pw] = useState('');
  const [code, Code] = useState('');
  const [remember, Remember] = useState(true);
  const [busy, Busy] = useState(false);
  const [error, E] = useState('');
  const run = async (fn: () => Promise<void>) => {Busy(true); E(''); try {await fn();} catch (x: Any) {E(x.message || String(x));} finally {Busy(false);}};

  const doLogin = () => run(async () => {const p = await login(picked, pw, remember); rememberPassword(pw); onDone(p);});
  const doCreate = () => run(async () => {const p = await createProfile(name, pw); setActive(p.id, remember); rememberPassword(pw); onDone(p);});
  const doCode = () => run(async () => {
    const payload = await decodeSync(code, pw);
    if (listProfiles().some(p => sameName(p.name, payload.name))) throw Error('Das Profil „' + payload.name + '“ gibt es auf diesem Gerät schon. Melde dich dort an und füge den Code unter Einstellungen → Profil & Geräte ein.');
    const p = await createProfile(payload.name || 'Profil', pw); setActive(p.id, remember); rememberPassword(pw); onDone(p, payload);
  });

  return (
    <main className="login">
      <img src="favicon.svg" width="56" height="56" alt=""/>
      <p className="eyebrow">DEIN PERSÖNLICHER LERNRAUM</p>
      <h1>{mode === 'pick' ? 'Wer lernt heute?' : mode === 'new' ? 'Profil anlegen' : 'Von anderem Gerät'}</h1>

      {mode === 'pick' && <form onSubmit={e => {e.preventDefault(); doLogin();}}>
        <div className="login-profiles" role="radiogroup" aria-label="Profil">
          {profiles.map(p => <button type="button" role="radio" aria-checked={picked === p.id} key={p.id} className={picked === p.id ? 'on' : ''} onClick={() => {Pick(p.id); E('');}}>
            <span className="avatar">{p.name.slice(0, 1).toUpperCase()}</span>{p.name}
          </button>)}
        </div>
        {picked && <>
          <label>Passwort<input type="password" autoComplete="current-password" value={pw} onChange={e => Pw(e.target.value)} autoFocus/></label>
          <label className="check"><input type="checkbox" checked={remember} onChange={e => Remember(e.target.checked)}/> Auf diesem Gerät angemeldet bleiben</label>
          <button className="primary" disabled={busy || !pw}>{busy ? 'Prüft …' : 'Anmelden'}</button>
        </>}
      </form>}

      {mode === 'new' && <form onSubmit={e => {e.preventDefault(); doCreate();}}>
        <label>Name<input value={name} onChange={e => Name(e.target.value)} autoComplete="username" maxLength={40} autoFocus placeholder="z. B. Josef"/></label>
        <label>Passwort (mind. 4 Zeichen)<input type="password" autoComplete="new-password" value={pw} onChange={e => Pw(e.target.value)}/></label>
        <label className="check"><input type="checkbox" checked={remember} onChange={e => Remember(e.target.checked)}/> Auf diesem Gerät angemeldet bleiben</label>
        {hasLegacyData && !profiles.length && <p className="login-note">Deine bisherigen Lerndaten auf diesem Gerät gehören dann zu diesem Profil.</p>}
        <button className="primary" disabled={busy || !name.trim() || pw.length < 4}>{busy ? 'Legt an …' : 'Profil anlegen'}</button>
      </form>}

      {mode === 'code' && <form onSubmit={e => {e.preventDefault(); doCode();}}>
        <p className="login-note">Auf dem anderen Gerät: Einstellungen → Profil & Geräte → „Sync-Code erstellen“. Den Code hier einfügen und dasselbe Passwort eingeben.</p>
        <label>Sync-Code<textarea rows={4} value={code} onChange={e => Code(e.target.value)} placeholder="LR1.…" spellCheck={false}/></label>
        <label>Passwort des Profils<input type="password" autoComplete="current-password" value={pw} onChange={e => Pw(e.target.value)}/></label>
        <label className="check"><input type="checkbox" checked={remember} onChange={e => Remember(e.target.checked)}/> Auf diesem Gerät angemeldet bleiben</label>
        <button className="primary" disabled={busy || !code.trim() || !pw}>{busy ? 'Entschlüsselt …' : 'Profil übernehmen'}</button>
      </form>}

      {error && <p className="login-error" role="alert">{error}</p>}

      <nav className="login-switch">
        {mode !== 'pick' && profiles.length > 0 && <button onClick={() => {Mode('pick'); E(''); Pw('');}}>Zu meinem Profil</button>}
        {mode !== 'new' && <button onClick={() => {Mode('new'); E(''); Pw('');}}>Neues Profil</button>}
        {mode !== 'code' && <button onClick={() => {Mode('code'); E(''); Pw('');}}>Mit Sync-Code von anderem Gerät</button>}
      </nav>
      <small className="login-foot">Profile liegen nur auf diesem Gerät. Das Passwort trennt Profile auf einem gemeinsam genutzten Gerät und schützt deinen Sync-Code – vergessen lässt es sich nicht zurücksetzen.</small>
    </main>
  );
}
