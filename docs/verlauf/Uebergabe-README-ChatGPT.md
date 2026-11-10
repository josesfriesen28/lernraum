# Lernraum – Übergabe an die Weiterentwicklung

Stand: 15. November 2026. Dieses Verzeichnis kann vollständig als ZIP weitergegeben werden. Es ist ein lokales Übergabepaket, keine Sites-Freigabe.

## Schnellstart

**`website-html/index.html` doppelklicken.** Die eigenständige HTML-Datei enthält die tatsächliche React-Oberfläche, CSS und JavaScript. Keine Installation, kein CDN und kein Sites-Konto erforderlich. Sie startet mit klar gekennzeichneten Beispieldaten. Ein Beispiel-Aufgabenpaket liegt daneben.

Die HTML-Ausgabe ist eine interaktive lokale Demo mit einem vereinfachten Browser-Backend. Navigation, Beispiel-Lernsitzungen, Aufgabenpaket-Import, Bewertungen und Papierkorb lassen sich damit ausprobieren. Daten bleiben im lokalen Browserspeicher, sofern der Browser diesen bei file:// zulässt. Bei Bedarf das Verzeichnis mit `python3 -m http.server 8000` bereitstellen und im Browser öffnen.

**Die HTML-Datei ist kein vollständiger Ersatz für das produktive Backend.** Private Anmeldung, serverseitige Datenhaltung, geräteübergreifende Synchronisation, PDF-/Textextraktion sowie die produktiven Transaktions- und Versionsgarantien benötigen das vollständige Programm. Der lokale Adapter bildet nicht sämtliche API-Validierungen ab. Seine Backup-/Restore-Funktionen sind nicht als produktive Sicherung geprüft. Keine echten privaten Lernbestände darin verwenden.

## Inhalt

- `chat/Chatverlauf.md`: gespeicherte Nutzernachrichten und sichtbare Antworten; keine internen Werkzeugprotokolle, Zugangsdaten oder Gedankengänge. Automatischer Umgebungskontext wurde entfernt. Lokale Benutzerpfade wurden neutralisiert. Dies ist der lesbare Gesprächsexport, kein vollständiger Rohprotokoll-Export aller technischen Vorgänge.
- `chat/Aufgabenstellung-*.txt`: ursprüngliche längere Recherche- und Entwicklungsaufträge.
- `website-html/index.html`: portable HTML-Demo der tatsächlichen Oberfläche mit lokalem Demo-Adapter.
- `programm/`: vollständiger versionierter Quellcode einschließlich Lockdatei, Tests, SQL-Migrationen, PDF.js und Lizenzen; ohne node_modules, Build-Ausgaben, Zugangsdaten, Git-Historie und private Datenbanken.
- `dokumentation/`: Recherche, Konzept, Umsetzungsspezifikation, Bedienung, Betrieb, Tests, bekannte Grenzen und der Aufgabenpaket-Prompt. Ältere Dokumente beschreiben teils frühere Ausbaustufen; maßgeblich für den letzten Stand sind der Quellcode sowie Scrollfeed-und-Papierkorb.md und Aufgabenpaket-Prompt.md.
- `referenzen/`: historische Screenshots aus der ersten Abnahme, keine Screenshots des letzten Feed-Updates.
- `DATEIEN-SHA256.txt`: Integritätsliste aller enthaltenen Dateien.

## Produktstand und Entscheidungen

Zielgruppe: persönliches Studium Wirtschaftskommunikation an der HTW Berlin, Klausuren und mündliche Prüfungen, überwiegend iPhone, Ausgangsbudget 20 Minuten täglich.

Die App besitzt Quellen-/Aufgabenversionen, Kompetenzspuren, regelbasierte Wiederholungen, fünf Aufgabenformate, Aufgabenpakete aus ChatGPT, kontinuierlich nachladenden Scrollfeed und einen wiederherstellbaren Papierkorb. Lesen und Überspringen zählen nicht als Abruf-Erfolg. Offene Antworten bewertet der Nutzer anhand von Musterlösungen und Kriterien. Die ursprüngliche Dateiverarbeitung erzeugt regelbasierte Entwürfe, keine KI-Ausarbeitung. Fertige JSON-Pakete werden direkt importiert.

Der Scheduler heißt rules-v1 und ist keine FSRS-Implementierung. Die Startintervalle und Pausenregeln sind technische Heuristiken. Keine Behauptung garantierter Prüfungsbereitschaft oder einer bestimmten Dopaminausschüttung.

## Technische Orientierung

- `programm/components/lernraum.tsx`: Oberfläche und Feed; derzeit eine große Komponente, guter Kandidat für Aufteilung.
- `programm/lib/core.mjs`: Scheduler, Auswahl, Bewertung und Backup-Prüfung.
- `programm/lib/package.mjs`: Vertrag für ChatGPT-Aufgabenpakete.
- `programm/app/api/data/route.ts`: authentifizierte Datenbefehle, Versionen, Papierkorb, Import und Restore.
- `programm/app/api/file/route.ts`: geschützte Originaldateien.
- `programm/db/` und `programm/drizzle/`: Datenmodell und SQL-Migrationen.
- `programm/handoff-entry.tsx`: nur der Browser-Adapter dieser HTML-Demo. Er gehört nicht zur produktiven App-Route.

Die produktive Implementierung verwendet React/TypeScript, Vinext, Cloudflare Workers, D1 und R2 mit Sites-Authentifizierung. Für unabhängigen Betrieb müssen Identitätsprüfung, Worker-Bindings und Deployment ersetzt bzw. konfiguriert werden. Die vorhandene Site-ID wurde aus `.openai/hosting.json` entfernt, damit nicht versehentlich auf die private Original-Site veröffentlicht wird. Die logischen DB-/BUCKET-Bindings bleiben erhalten.

## Lokal am vollständigen Programm arbeiten

Node.js >=22.13 und npm installieren. In `programm` mit `npm ci` die festgeschriebenen Abhängigkeiten installieren. README.md und docs/Betrieb.md enthalten Aufbau, lokale Migrationen und Startbefehle. Die mitgelieferten Helferskripte können von der ursprünglichen Sites-Umgebung abhängen; bei anderem Hosting entsprechend anpassen. Lokale und produktive Datenbanken sind getrennt. Keine Migration mehrfach blind anwenden.

Reine Tests: `node --test tests/core.test.mjs tests/package.test.mjs`. Typprüfung: `node node_modules/typescript/bin/tsc --noEmit`. Die API-Tests brauchen den lokalen Entwicklungsserver und verwenden erfundene Daten. Sie sichern und restaurieren den lokalen Teststand; keine echten Daten in dieser Testumgebung verwenden.

Die HTML-Demo wurde aus dem Original-Frontend mit esbuild gebündelt und mit dem CSS inline zusammengesetzt. Ihr Adapter liegt als handoff-entry.tsx bei. Der Export ist eine zusätzliche Demo-Ausgabe; an der gehosteten Website wurde durch diese Übergabe nichts geändert.

## Sinnvolle nächste Verbesserungen

1. Scroll-/Swipe-Übergänge auf echtem iPhone prüfen: lange Lösungen, Bildschirmtastatur, reduziertes Bewegen, langsames Netz, Mehrfachereignisse und Wiederaufnahme.
2. Komponenten und API-Befehle aufteilen, TypeScript-Typen statt weitreichendem any einführen.
3. Mehrgeräte-Konflikte, Papierkorb und Restore aus verschiedenen Datenständen ausbauen und testen.
4. Große Datenmengen paginieren, langfristige Lasttests und robustere gestufte Backups.
5. Paketvorschau, inhaltliche Dublettenerkennung und Aktualisierung bereits importierter Pakete verbessern.
6. Optional OCR, KI-Bewertung mit Korrekturmöglichkeit und echter Offline-Modus; bisher nicht angeschlossen.

Der letzte Website-Stand bestand 24 lokale Integrationsprüfungen, Typprüfung und Produktionsbuild. Die letzte Scrollfeed-Änderung konnte wegen fehlendem Browserzugriff nicht visuell geprüft werden. Die HTML-Demo dieser Übergabe ist zusätzlich erstellt; erfolgreiche Bündelung ist kein vollständiger Browser-Funktionstest.

## Datenschutz und Weitergabe

Enthalten sind die projektbezogenen Gesprächsinhalte einschließlich Studienpräferenzen, nicht deine produktiven Lernbestände. Es wurden keine Daten aus der gehosteten Datenbank exportiert. Keine API-Schlüssel, Tokens, Cookies oder privaten Betriebsdateien sind Bestandteil des Pakets. Vor dem Weiterleiten kannst du chat/ und dokumentation/ selbst durchsehen. Lizenzen eingebundener Bibliotheken bleiben im Quellcode erhalten.
