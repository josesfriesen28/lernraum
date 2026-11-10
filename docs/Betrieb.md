# Betrieb, Daten und Weiterentwicklung

## Übernommene Forschungsentscheidungen

Aktiver Abruf, verteilte Wiederholung, erklärendes Feedback und Quellenkontrolle bilden den Kern. Unterschiedliche Kompetenzspuren trennen Wiedererkennen, Erinnern, Verstehen und Anwenden. Die Oberfläche zeigt endliche Etappen und tatsächliche Lernereignisse statt eines unbelegten Prüfungsbereitschafts-Prozentsatzes. Ein Tagesbudget von 20 Minuten ist der persönliche Ausgangspunkt; Pausentakt und Intervallfolge sind technische Produktannahmen.

Die Umsetzung folgt dem vorliegenden Recherchebericht `Lern-App-Konzept.md` und `Prompt-2-Umsetzungsspezifikation.md`. Es handelt sich nicht um eine neue unabhängige wissenschaftliche Validierung der App. Der Regel-Scheduler heißt ausdrücklich `rules-v1`; er behauptet keine FSRS-Implementierung und keine individuelle Retentionsprognose.

## Dienste und Grenzen der Architektur

Sites stellt den privaten Worker, ChatGPT-Anmeldung, D1 und R2 bereit. D1 speichert strukturierte, nutzergebundene Datensätze; R2 die Originaldateien. Browserlokale Speicherung dient ausschließlich noch nicht bestätigten Antworten und lokalen Antwortentwürfen. Der Server ist die maßgebliche Quelle für bestätigte Lernereignisse.

Es wurden keine Zusatzabonnements, externen KI-Konten, OCR-Dienste, E-Mail-Dienste, Analysedienste oder öffentlichen Freigaben eingerichtet. Es fallen in der App keine LLM-API-Aufrufe an. Hosting-, Speicher- und Kontingentbedingungen hängen vom Sites-/ChatGPT-Konto ab; ein verbindlicher Preis und eine mehrjährige Speicherzusage wurden nicht ermittelt. Deshalb wird kein kostenfreier Dauerbetrieb versprochen.

Die erste Version lädt strukturierte Daten als vollständigen Snapshot. Die Wiederholungslogik verwendet einen nach Familie/Epoche/Kompetenz indizierten Verlauf, damit nicht pro Aufgabe die gesamte Historie sortiert werden muss. Dennoch fehlen Lasttests mit einem realen mehrjährigen Bestand. Vor sehr großen Sammlungen sind paginierte Ansichten, serverseitige Abfragen, ein gestufter Backup-Import und gegebenenfalls persistierte Scheduler-Projektionen nachzurüsten. Die Historie ist schon jetzt migrationsfähig und exportierbar; drei bis fünf Jahre störungsfreier Betrieb sind damit noch nicht nachgewiesen.

## Tabellen und Entitäten

| Tabelle | Zweck |
|---|---|
| `workspaces(owner, revision)` | Monoton steigende Datenrevision je angemeldeter Identität. |
| `entities(owner, kind, id, data)` | Einzelne JSON-Entitäten mit zusammengesetztem Primärschlüssel; kein einzelnes Browser-Snapshot als dauerhafte Datenbank. |
| `commands(owner, id, expected, created)` | Idempotenzschlüssel und erwartete Revision. |

Entitätsarten: `course`, `document`, `source`, `objective`, `task`, `attempt`, `correction`, `session`, `settings`, `issue`.

- **course:** Modul, Prüfungsform und optionaler Termin. Themen werden am Dokument geführt.
- **document:** unveränderliche Originaldatei, SHA-256, normalisierter Texthash, rootId, previousId, Version und Importzeit. Jeder Quellenstand bleibt erhalten.
- **source:** Dokumentbezug, Seite, Abschnittsposition, extrahierter Text. Text ist Lernmaterial, kein ausführbarer Prompt.
- **objective:** stabile ID, Modul, editierbares Lernziel. Automatische Erstlabels sind Abschnittsbezeichnungen; keine semantisch validierte Lernzielanalyse.
- **task:** stabile Versions-ID, familyId, objectiveId, epoch, Quellenbezug, Form, Kompetenzspur, Frage, Lösung, Kriterien, Antwortoptionen, erwartete Zeit, Status und previousId.
- **attempt:** Antwort/Optionen, Originalbewertung, taskId, Familie/Epoche/Spur, Hilfen, vorzeitig gezeigte Lösung, Sicherheit, Dauer, Serverzeit und lokale Erfassungszeit, Sitzungsbezug, Bewertungsart und Scheduler-Version.
- **correction:** zusätzliche Korrektur mit Grund, Zeit und attemptId; überschreibt das Original nicht.
- **session:** endliche ausgewählte Aufgaben mit Begründung, Index, Beginn, Abschluss und Zeitbudget.
- **issue:** manuelle Fehlermeldung mit Aufgabenbezug.

Aufgabenvarianten können dieselbe Familie und Epoche teilen. Eine zusätzliche Anwendung erhält standardmäßig eine neue Familie unter demselben Lernziel. Geänderte freigegebene Aufgaben werden neue Versionen; ersetzte Versionen sind unveränderlich. Bei nur redaktionellen Änderungen wäre im API-Vertrag unter strengen Gleichheitsbedingungen ein Erhalt der Epoche möglich; die Benutzeroberfläche setzt konservativ eine neue Epoche.

## Scheduler rules-v1

Der Scheduler-Zustand und die nächste Fälligkeit werden deterministisch aus dauerhaft gespeicherten Ereignissen abgeleitet. Die Projektion wird nicht redundant als zusätzliche Tabelle gespeichert. Export enthält Ereignisse und Regelkennung; nach dem Restore wird dieselbe Projektion wieder berechnet.

Ein Erfolg verlängert nur, wenn `result=correct`, keine Hilfe genutzt, die Lösung nicht vor der Antwort geöffnet und nicht „geraten“ angegeben wurde. Pro Berliner Kalendertag zählt höchstens ein Fortschrittsschritt. Fehler, Teilantworten, Hilfen und Raten setzen auf einen Tag zurück. Überspringen, Lesen und ungeklärte Ereignisse ändern die Evidenz nicht. Nach 60 Tagen bleibt das Intervall gedeckelt. Der Algorithmus ist bewusst konservativ und nicht auf individuelle Vergessenskurven trainiert.

Die Tagesauswahl priorisiert Überfälligkeit, Fehler und Prüfungsnähe, plant neue Inhalte ein und reserviert soweit möglich einen Platz für ein in der letzten Woche nicht bearbeitetes Modul. Eine Familie erscheint pro normalem Lerntag höchstens einmal. Aufgabenzeit plus 30 Sekunden Feedback müssen ins Budget abzüglich einer Minute Reserve passen. Direkt gewähltes Üben kann die Tagesauswahl umgehen; es erzeugt trotzdem keine unabhängigen Erfolge am selben Tag.

## Konsistenz und Zugriffsschutz

Alle API-Aufrufe verlangen die von Sites gesetzte Nutzeridentität. Jede Datenabfrage filtert nach owner; jede Originaldatei liegt unter `owner/SHA-256`. Originalantworten verwenden `Cache-Control: no-store`; Downloads sind ebenfalls nutzergebunden. Fremde Origin-Header werden bei Schreibzugriffen abgewiesen. Die lokale Testanmeldung ist ausschließlich Entwicklungs-Middleware auf Loopback. Die produktive Vertrauensgrenze ist der Sites-Authentifizierungsproxy; der Worker darf nicht außerhalb dieses Proxys öffentlich erreichbar gemacht werden.

Eine Datenänderung enthält eine Command-ID und die erwartete Revision. Ein Datenbanktrigger prüft diese Revision und erhöht sie in derselben atomaren D1-Batch wie die eigentlichen Änderungen. Bereits bestätigte Command-IDs werden wiedergegeben, statt den Vorgang erneut auszuführen. Bei Konflikten werden normale Bearbeitungen nicht automatisch über neuere Inhalte geschrieben. Antworten können nach Aktualisierung erneut gesendet werden, sofern ihre Sitzung noch passend steht. Konfliktantworten lassen sich als ungeklärte Ereignisse erhalten.

Eingabedaten werden als Text behandelt und React maskiert die Anzeige. Es werden keine Dokumentanweisungen ausgeführt. PDF.js wird lokal ausgeliefert, mit `isEvalSupported:false` verwendet und extrahiert ausschließlich Text. Es gibt keine externe Dokumentübertragung für KI-Verarbeitung.

## Backup-Schema 1

```json
{
  "format": "lernraum",
  "schema": 1,
  "exportedAt": "ISO-8601",
  "entities": {
    "course": [], "document": [], "source": [], "objective": [],
    "task": [], "attempt": [], "correction": [], "session": [],
    "settings": [], "issue": []
  },
  "files": [{"hash": "SHA-256", "type": "application/pdf", "data": "Base64"}]
}
```

IDs und Quellenreferenzen bleiben unverändert; interne owner-Identitäten werden nicht exportiert. Beim Restore werden die Daten dem aktuell angemeldeten Konto zugeordnet. Dateibytes werden lokal gegen SHA-256 geprüft und serverseitig erneut gehasht. Nach erfolgreichen Dateiübertragungen werden die Entitäten in einer atomaren Batch ersetzt. Ein fehlendes Original oder ein ungültiger Bezug verhindert den Austausch. Bereits hochgeladene, aber nicht referenzierte Dateien können nach abgebrochenen Importen/Restores im Speicher verbleiben; Garbage Collection ist noch nicht implementiert. Es werden keine Originale automatisch gelöscht.

## Migrationen und Updates

Bereits angewendete Dateien `drizzle/0000_…sql`, `0001_command_guard.sql` und ihre Metadaten nicht ändern. Neue Schemaänderungen in `db/schema.ts` definieren, mit `npm run db:generate` eine neue Migration erzeugen, SQL prüfen und lokal anwenden. Sites führt ausstehende Migrationen beim Deploy vor der Worker-Bereitstellung aus. Eine fehlgeschlagene Veröffentlichung kann Migrationen bereits angewendet haben: Zustand prüfen und ausschließlich vorwärts reparieren.

Änderungen am Entitätsformat benötigen eine explizite Versionsmigration und einen Importpfad für ältere Backups. `schema:1` nicht stillschweigend umdeuten. Scheduler-Wechsel brauchen neue Kennungen und einen reproduzierbaren Migrations-/Vergleichstest gegen dieselbe Ereignishistorie. Vor Update, Restore und größerem Import ein vollständiges Backup sichern.

## KI-Anbieter später ergänzen

Derzeit gibt es keinen angeschlossenen Anbieter und keinen API-Key. Die Inhaltsverarbeitung ist serverseitig von Oberfläche und Scheduler getrennt. Eine spätere Integration sollte aus Textabschnitten strukturierte, validierte Entwürfe mit Source-IDs liefern, gegen vorhandene Inhalte deduplizieren und immer den Prüfstatus beibehalten. Anbieter und Modell gehören hinter eine kleine austauschbare Server-Schnittstelle; Schlüssel in Sites-Secrets, niemals in Clientcode oder Hosting-Manifest. Kostenlimit, maximale Dokumentmengen, Wiederverwendung gleicher Inhalte und ausdrücklich freigegebener Empfänger sind vor Aktivierung festzulegen. Offene Antworten bleiben bei Unsicherheit korrigierbar.
