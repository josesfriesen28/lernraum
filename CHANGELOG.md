# Changelog

Alle nennenswerten Änderungen an Lernraum. Format nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionen nach [Semantic Versioning](https://semver.org/lang/de/).

Die Version steht an drei Stellen und muss übereinstimmen (prüft `tests/version.test.mjs`):
`package.json` → `version`, `lib/version.mjs` → `APP_VERSION`, und ein Abschnitt hier.

## [Unreleased]

## [0.10.1] – 2026-11-17

### Hinzugefügt
- Jede Lernkarte zeigt oben ihr Fach: farbiges Kürzel (B2, B3, EN …) plus Modulname – auch auf der nächsten Karte im Hintergrund. Im Verlauf steht das Modul bei jeder Antwort.

## [0.10.0] – 2026-11-17

Profile und Geräte-Sync – weiterhin ohne Server.

### Hinzugefügt
- Profile mit Name und kurzem Passwort; mehrere Profile pro Gerät mit getrennten Daten (je eine eigene Browser-Datenbank). Anmelden, „angemeldet bleiben“, Abmelden/Profil wechseln, Passwort ändern.
- Sync-Code: verschlüsselt (AES-GCM, Schlüssel aus dem Profil-Passwort) den Lernfortschritt zu allen Paketaufgaben. Auf einem anderen Gerät legt er das Profil an oder wird mit dem dortigen Stand zusammengeführt – in beide Richtungen, ohne etwas zu überschreiben. Kopieren, Teilen oder als Datei.
- Neuer Befehl `sync` im lokalen Backend, `lib/sync.mjs`, `lib/profiles.ts`, Tests für Verschlüsselung und Zusammenführen.

### Geändert
- Bestehende Daten eines Geräts gehören zum ersten angelegten Profil.

## [0.9.0] – 2026-11-17

Schaubilder zum Anschauen.

### Hinzugefügt
- 79 selbst nachgezeichnete B2-Schaubilder (SVG) – vom 4-Ebenen-Modell über BCG, TOWS, Five Forces und Führungsstile bis zu Bilanz, GuV und Kapitalflussrechnung. Erklärkarten zeigen das Schaubild direkt, Fragen nach dem Antworten (und bei „Quelle als Hilfe“). Antippen öffnet es groß.
- Jede Schaubild-Karte verlinkt die Original-Folie in Moodle auf der passenden Seite („Original-Folie ansehen“, Moodle-Login nötig).
- Paketformat: optionale Felder `image` und `sourceUrl`; der Build prüft, ob jedes Bild existiert, und liefert es mit. Die App lädt die Bilder einmal vor, damit sie offline da sind.

### Geändert
- Nach richtigen Antworten mit Schaubild geht es nicht mehr automatisch weiter – Zeit zum Anschauen.

## [0.8.0] – 2026-11-17

Schaubilder, alle B3-Folien und die Englisch-Vokabeln.

### Hinzugefügt
- B2: drei Schaubild-Pakete (283 Karten) zu allen Abbildungen aus den Vahs-Folien – Grundlagen, Standort/Rechtsform/Verbindungen, Unternehmensverfassung, Organisation, Personal, Controlling, externes Rechnungswesen und Finanzierungs-Exkurs. Pro Schaubild eine Erklärkarte plus Abfrage- und Nachzeichen-Karten; Rechenübungen aus den Zwischenübungen und Fallstudien.
- Englisch: Vokabelpakete aus dem Glossary (Marketing, Sales and distribution, Finance) – je Begriff „Definition → Begriff“ und „Begriff → Definition“.
- B3: alle bisher hochgeladenen Folien der Sitzungen 1–4 durchgearbeitet; deutlich mehr Karten zu interpersonaler Kommunikation, Journalismus/PR/Werbung und Öffentlichkeit.

### Geändert
- Antwortoptionen sind auch in den Paketdateien gemischt (die App mischt sie beim Anzeigen ohnehin).
- Auf den Folien durchgestrichene Kapitel sind als nicht prüfungsrelevant markiert.

## [0.7.0] – 2026-11-16

Erste echte Lerninhalte.

### Hinzugefügt
- 270 Karten in 13 Paketen für B2 (Grundlagen der BWL), B3 (Kommunikations- und Medienwissenschaften) und English for Business Communication, erstellt aus Moodle-Unterlagen und Notion-Notizen; Gewichtung nach den Prüfungsmarkierungen in Notion. Überblick und Lücken: `content/QUELLEN.md`.

### Geändert
- Hinweis über neue Inhalte fasst viele Pakete in einem Satz zusammen.

## [0.6.0] – 2026-11-16

Lerninhalte kommen mit der App.

### Hinzugefügt
- Ordner `content/`: Aufgabenpakete im Repository werden mit der App ausgeliefert und beim Öffnen automatisch übernommen – auf jedem Gerät, ohne Import von Hand. Module werden bei Bedarf angelegt.
- Paket-Updates: geänderte Aufgaben werden neue Versionen, neue kommen dazu, entfernte wandern in den Papierkorb; Antworten und Fortschritt unveränderter Aufgaben bleiben erhalten.
- Hinweis in der App, welche Inhalte neu übernommen wurden.
- Build prüft alle Pakete und erzeugt `content/index.json`.
- Anleitung `docs/Inhalte-erstellen.md` und Formatbeschreibung `content/README.md`.

### Geändert
- Service Worker lädt Lerninhalte zuerst aus dem Netz, damit Updates sofort ankommen (offline weiterhin aus dem Cache).
- Neue Varianten einer Aufgabe übernehmen nicht mehr die Paket-Kennung des Originals.

## [0.5.0] – 2026-11-16

Unabhängig von ChatGPT: Lernraum läuft komplett im Browser und wird über GitHub Pages veröffentlicht.

### Hinzugefügt
- Lokales Backend `lib/local-api.mjs`: alle bisherigen Server-Befehle (Import, Pakete, Versionen, Sitzungen, Papierkorb, Korrekturen, Restore) laufen jetzt im Browser.
- Speicherung in IndexedDB (`lib/browser-backend.ts`) inklusive Originaldateien; Bitte um dauerhaften Speicher.
- Offline-Fähigkeit per Service Worker, installierbar auf dem iPhone-Home-Bildschirm.
- Statischer Build mit esbuild (`npm run build` → `dist/`), lokale Vorschau (`npm run preview`).
- GitHub-Actions-Workflow: testet, baut und veröffentlicht bei jedem Push auf GitHub Pages.
- Backup-Erinnerung auf der Startseite, wenn das letzte Backup älter als eine Woche ist.
- Integrationstests des lokalen Backends (aus den früheren Server-API-Tests übernommen).
- Beispiel-Aufgabenpaket mit allen fünf Aufgabentypen (`docs/Beispiel-Aufgabenpaket.json`).

### Entfernt
- ChatGPT-„Sites“-Anmeldung, Cloudflare Worker, D1/R2, Next/Vinext/Vite, Drizzle-Migrationen und Sites-Hilfsskripte (im Tag `v0.4.0` weiterhin nachlesbar).
- Separate HTML-Demo (die App selbst ist jetzt die statische Seite).
- Ungenutzte shadcn-UI-Komponenten; Abhängigkeiten von 50+ auf 8 Pakete reduziert.

### Geändert
- Kein Geräteabgleich mehr: Daten liegen pro Gerät/Browser; Gerätewechsel über vollständiges Backup.
- Alle Pfade relativ, damit die App unter `https://<name>.github.io/lernraum/` läuft.
- Server-bezogene Texte in der Oberfläche angepasst; alte Betriebsdoku nach `docs/archiv/`.

## [0.4.0] – 2026-11-15

Lernfeed im Reel-Stil („Doomscrolling, aber fürs Lernen“).

### Hinzugefügt
- Neuer Vollbild-Lernfeed `components/learn-feed.tsx`: eine Karte pro Bildschirm, darunter liegt schon die nächste Karte als Stapel sichtbar.
- Single-Choice: Antippen = Antwort. Bei richtiger Antwort Konfetti, Glow, kurzer Spruch, Haptik (wo unterstützt) und automatisches Weiter nach 1,3 s mit Fortschrittsbalken im Button.
- Multiple-Choice: antippen, „Prüfen“, dann weiterwischen.
- Offene Aufgaben: Antwort tippen, „Abgleichen“, Selbstbewertung antippen – das Antippen der Bewertung wechselt direkt zur nächsten Karte.
- Erklärkarten zeigen den Inhalt sofort; Hochwischen = gelesen.
- Gesten: Hochwischen (mit Mitzieh-Effekt), Mausrad/Trackpad am Kartenende, Tastatur (↓/Leertaste weiter, 1–6 auswählen, Enter prüfen, Esc schließen).
- 🔥-Serienzähler für richtige Antworten in Folge mit Meilensteinen (3, 5, 10, 15, 20, 30, 50).
- Wechselnde Farbwelten pro Karte, Fortschrittsbalken oben, Pausen als eigene Karte.
- `lib/version.mjs` mit `APP_VERSION`; Version im Footer der App.
- `CHANGELOG.md`, Versionstest, GitHub-Actions-Workflow (Tests + Versionsprüfung).
- `scripts/build-demo.mjs` und `npm run demo:build` zum Neubauen der HTML-Demo.
- Demo-Beispieldaten mit Single-/Multiple-Choice, Anwendung und Erklärkarte.

### Geändert
- Paketname `site-creator-vinext-starter` → `lernraum`.
- Lernansicht aus `components/lernraum.tsx` in eigene Komponente ausgelagert.
- Repository-Struktur für GitHub: Quellcode im Wurzelverzeichnis, Dokumentation unter `docs/`, HTML-Demo unter `demo/`.

### Unverändert (bewusst)
- Überspringen zählt weiterhin nicht als Erfolg und setzt die Serie zurück.
- Offene Antworten müssen vor dem Weiterwischen selbst bewertet werden.
- Scheduler `rules-v1`, Datenmodell, API und Migrationen sind unverändert.

## [0.3.0] – 2026-11-10

Stand der Übergabe aus ChatGPT.

### Hinzugefügt
- Aktive Aufgaben löschen: Papierkorb mit Wiederherstellung, Entfernen aus offenen Sitzungen.
- Scrollfeed: Scrollen über das Kartenende hinaus wechselt zur nächsten Aufgabe; Karten werden nachgeladen.

## [0.2.0] – 2026-11-10

### Hinzugefügt
- Import fertiger JSON-Aufgabenpakete (`lernraum-package`, bis 500 Aufgaben je Datei, Schutz vor Doppelimport).
- Wiederverwendbarer ChatGPT-Prompt für Aufgabenpakete (`docs/Aufgabenpaket-Prompt.md`).
- Erster Feed-Modus mit Wischfläche und Animationen.

## [0.1.0] – 2026-10-31

### Hinzugefügt
- Erste Version: Module, PDF-/Textimport mit regelbasierten Entwürfen, fünf Aufgabenformate, Wiederholungsplan `rules-v1`, versionierte Quellen und Aufgaben, Lernverlauf mit Korrekturen, vollständiges Backup und Restore.

[Unreleased]: ../../compare/v0.7.0...HEAD
[0.7.0]: ../../compare/v0.6.0...v0.7.0
[0.6.0]: ../../compare/v0.5.0...v0.6.0
[0.5.0]: ../../compare/v0.4.0...v0.5.0
[0.4.0]: ../../compare/v0.3.0...v0.4.0
[0.3.0]: ../../releases/tag/v0.3.0
