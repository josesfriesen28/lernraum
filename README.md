# Lernraum

Persönliche Lern-Web-App für Wirtschaftskommunikation, mit 20 Minuten als Standard. Deutsche, mobile Oberfläche; ChatGPT-Anmeldung; Quellen in R2; Lernereignisse in D1. Erstellt auf Grundlage des begleitenden Rechercheberichts und seiner Umsetzungsspezifikation.

## Start

1. Auf der privaten Sites-Adresse mit dem eigenen ChatGPT-Konto anmelden.
2. Unter **Material** ein Modul mit optionalem Prüfungstermin anlegen.
3. PDF oder Text importieren. Unter **Aufgaben → Entwürfe** Lernziel, Frage, Lösung, Kriterien und Quelle prüfen. Erst danach freigeben.
4. Unter **Heute** das Zeitbudget wählen und lernen. Offene Antworten selbst an den Kriterien beurteilen.
5. Unter **Einstellungen** regelmäßig ein vollständiges Backup herunterladen.

Ausführliche Hinweise: [Bedienung](docs/Bedienung.md), [Betrieb und Datenmodell](docs/Betrieb.md), [Abnahme und Grenzen](docs/Abnahme.md).

## Lokale Entwicklung

Node.js >=22.13, npm und der Sites-Plugin-Workflow werden benötigt. Projektprofil: `portable`.

```sh
npm run install:ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_reflective_scalphunter.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_command_guard.sql
npm run dev -- --host 127.0.0.1
```

Die SQL-Befehle nur einmal auf eine frische lokale Datenbank anwenden; bei Updates nur ausstehende Migrationen. Der Entwicklungsserver bietet ausschließlich auf Loopback eine Testanmeldung (`local_seedy`), die nicht im Produktiv-Worker enthalten ist. Lokale Testdaten liegen in `.wrangler/` und werden weder eingecheckt noch veröffentlicht.

```sh
node node_modules/typescript/bin/tsc --noEmit
node --test tests/core.test.mjs
# Mit laufendem lokalen Entwicklungsserver, ausschließlich lokale Testdaten:
node tests/api.test.mjs
```

Die Integrationstests sichern den vorhandenen lokalen Datensatz, verwenden erfundene Inhalte und spielen den ursprünglichen Datensatz am Ende zurück. Die API-Testadresse ist fest auf `127.0.0.1` begrenzt. Ein erzwungener Prozessabbruch kann den Teststand hinterlassen; echte Daten gehören nicht in diese Testumgebung.

## Veröffentlichung

Die bestehende Sites-ID in `.openai/hosting.json` wiederverwenden. Nie für ein Update eine zweite Site erzeugen. Die logischen Bindings `DB` und `BUCKET` werden von Sites bereitgestellt. Über den Sites-Source-Helper den geprüften Stand bauen, committen, pushen und paketieren; dann genau diesen Commit und dieses Archiv privat veröffentlichen. Die SQL-Migrationen werden von Sites bei der Bereitstellung angewendet. Zugangsdaten ausschließlich über den vorgesehenen kurzlebigen Workflow, niemals im Repository.

## Architektur

- `lib/core.mjs`: reine Wiederholungs-, Auswahl-, Bewertungs- und Backup-Validierungslogik.
- `app/api/data/route.ts`: authentifizierte Befehle, Revisionen, atomare Änderungen.
- `app/api/file/route.ts`: authentifizierte, nutzergebundene Originaldateien.
- `lib/server.ts`: Identität, Datenzugriff, konsistente Snapshots.
- `components/lernraum.tsx`: Oberfläche, lokale Antwortvormerkung, Import, Export.
- `lib/pdf-loader.ts` und `public/pdf/`: PDF.js im Browser, ohne externen CDN-Aufruf.
- `db/schema.ts`, `drizzle/`: deklaratives Schema und unveränderliche Migrationen.

Keine LLM-Anbindung, keine KI-Bewertung, keine OCR und keine externen Analysedienste. Es werden keine kostenpflichtigen Dienste zusätzlich eingerichtet.

## Lizenzen

PDF.js 5.6.205 ist unter Apache-2.0 eingebunden; Lizenz unter `public/pdf/LICENSE`. Die Sites-Vorlage enthält ihre eigenen Lizenzhinweise. Weitere Abhängigkeiten und festgeschriebene Versionen stehen in `package.json` und der Lockdatei.
