'use client';
// Einstellungen → Profil & Geräte (seit v0.10.0)
import {useState} from 'react';
import {activeProfile, checkPassword, currentPassword, rememberPassword, logout, changePassword} from '../lib/profiles';
import {buildSync, encodeSync, decodeSync} from '../lib/sync.mjs';

type Any = any;
export default function ProfileSync({onSynced}: {onSynced: (d: Any) => void}) {
  const profile = activeProfile();
  const [pw, Pw] = useState('');
  const [code, Code] = useState('');
  const [incoming, In] = useState('');
  const [inPw, InPw] = useState('');
  const [msg, M] = useState('');
  const [error, E] = useState('');
  const [busy, B] = useState(false);
  const [pwOld, PwOld] = useState(''); const [pwNew, PwNew] = useState(''); const [showPw, ShowPw] = useState(false);
  if (!profile) return null;
  const run = async (fn: () => Promise<void>) => {B(true); E(''); M(''); try {await fn();} catch (x: Any) {E(x.message || String(x));} finally {B(false);}};

  const create = () => run(async () => {
    const password = currentPassword() || pw;
    if (!password) throw Error('Bitte dein Profil-Passwort eingeben.');
    if (!currentPassword() && !await checkPassword(profile, password)) throw Error('Passwort stimmt nicht.');
    rememberPassword(password);
    const fresh = await (await fetch('/api/data')).json();
    const payload = buildSync(fresh.state, profile.name);
    Code(await encodeSync(payload, password));
    M(`Sync-Code mit ${payload.attempts.length} Antworten erstellt.` + (payload.skipped ? ` ${payload.skipped} Antworten zu eigenem Material sind nicht enthalten – dafür das vollständige Backup nutzen.` : ''));
  });
  const copy = () => run(async () => {await navigator.clipboard.writeText(code); M('Kopiert. Jetzt auf dem anderen Gerät einfügen (z. B. per Notizen, AirDrop oder Nachricht an dich selbst).');});
  const share = () => run(async () => {
    const file = new File([code], `lernraum-sync-${profile.name}.txt`, {type: 'text/plain'});
    if ((navigator as Any).canShare?.({files: [file]})) await navigator.share({files: [file], title: 'Lernraum Sync-Code'});
    else await navigator.share({text: code, title: 'Lernraum Sync-Code'});
  });
  const save = () => {const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([code], {type: 'text/plain'})); a.download = `lernraum-sync-${profile.name}.txt`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);};
  const merge = () => run(async () => {
    const payload = await decodeSync(incoming, inPw || currentPassword());
    const fresh = await (await fetch('/api/data')).json();
    const r = await fetch('/api/data', {method: 'POST', body: JSON.stringify({id: crypto.randomUUID(), revision: fresh.revision, command: 'sync', payload: {sync: payload}})});
    const d = await r.json(); if (!r.ok) throw Error(d.error);
    onSynced(d); In(''); M(d.notice + (payload.name && payload.name !== profile.name ? ` (Code von Profil „${payload.name}“)` : ''));
  });
  const readFile = async (f?: File | null) => {if (f) In((await f.text()).trim());};
  const changePw = () => run(async () => {await changePassword(profile.id, pwOld, pwNew); rememberPassword(pwNew); PwOld(''); PwNew(''); ShowPw(false); M('Passwort geändert. Ältere Sync-Codes brauchen weiter das alte Passwort.');});

  return (
    <section className="card profile-sync">
      <h2>Profil & Geräte</h2>
      <p>Angemeldet als <b>{profile.name}</b>. Deine Daten liegen auf diesem Gerät; mit einem Sync-Code nimmst du deinen Fortschritt auf ein anderes Gerät mit – in beide Richtungen, nichts wird überschrieben.</p>

      <h3>1 · Sync-Code erstellen (dieses Gerät → anderes)</h3>
      {!currentPassword() && !code && <label>Profil-Passwort<input type="password" value={pw} onChange={e => Pw(e.target.value)} autoComplete="current-password"/></label>}
      {!code ? <button className="soft" disabled={busy} onClick={create}>Sync-Code erstellen</button> : <>
        <textarea readOnly rows={3} value={code} onFocus={e => e.target.select()} aria-label="Sync-Code"/>
        <div className="row">
          <button className="soft" disabled={busy} onClick={copy}>Kopieren</button>
          {typeof navigator !== 'undefined' && 'share' in navigator && <button disabled={busy} onClick={share}>Teilen …</button>}
          <button disabled={busy} onClick={save}>Als Datei</button>
          <button disabled={busy} onClick={() => {Code(''); M('');}}>Neu</button>
        </div>
      </>}

      <h3>2 · Sync-Code einlesen (anderes Gerät → dieses)</h3>
      <textarea rows={3} value={incoming} onChange={e => In(e.target.value)} placeholder="LR1.… hier einfügen" spellCheck={false} aria-label="Sync-Code einfügen"/>
      <div className="row">
        <label className="file-label">oder Datei wählen<input type="file" accept=".txt,text/plain" onChange={e => readFile(e.target.files?.[0])}/></label>
      </div>
      {!currentPassword() && <label>Passwort des Codes<input type="password" value={inPw} onChange={e => InPw(e.target.value)} autoComplete="current-password"/></label>}
      <button className="soft" disabled={busy || !incoming.trim()} onClick={merge}>{busy ? 'Gleicht ab …' : 'Zusammenführen'}</button>

      {msg && <p className="notice" role="status">{msg}</p>}
      {error && <p className="notice error" role="alert">{error}</p>}

      <div className="row profile-actions">
        <button onClick={() => ShowPw(!showPw)}>Passwort ändern</button>
        <button onClick={() => {logout(); location.reload();}}>Abmelden / Profil wechseln</button>
      </div>
      {showPw && <div className="pw-change">
        <label>Bisheriges Passwort<input type="password" value={pwOld} onChange={e => PwOld(e.target.value)} autoComplete="current-password"/></label>
        <label>Neues Passwort (mind. 4 Zeichen)<input type="password" value={pwNew} onChange={e => PwNew(e.target.value)} autoComplete="new-password"/></label>
        <button className="soft" disabled={busy || !pwOld || pwNew.length < 4} onClick={changePw}>Speichern</button>
      </div>}
      <small>Tipp: Lernst du auf zwei Geräten, erstelle nach dem Lernen kurz einen Code und lies ihn auf dem anderen Gerät ein. Eigenes Material (selbst hochgeladene PDFs) überträgt das vollständige Backup weiter unten.</small>
    </section>
  );
}
