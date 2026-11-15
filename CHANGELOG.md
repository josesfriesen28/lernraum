# Changelog

Alle nennenswerten Änderungen an Lernraum. Format nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionen nach [Semantic Versioning](https://semver.org/lang/de/).

Die Version steht an drei Stellen und muss übereinstimmen (prüft `tests/version.test.mjs`):
`package.json` → `version`, `lib/version.mjs` → `APP_VERSION`, und ein Abschnitt hier.

## [Unreleased]

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

[Unreleased]: ../../compare/v0.4.0...HEAD
[0.4.0]: ../../compare/v0.3.0...v0.4.0
[0.3.0]: ../../releases/tag/v0.3.0
