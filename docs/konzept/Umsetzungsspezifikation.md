## 12. Umsetzungsspezifikation für Prompt 2

Die folgende Spezifikation ist eigenständig verständlich und kann als nächster Arbeitsauftrag verwendet werden. Sie beschreibt die zu entwickelnde erste Version; in dieser Recherche wurde noch keine Software implementiert.

### Zweck und Nutzer

Entwickle eine private persönliche Lern-App für eine Person im Studiengang Wirtschaftskommunikation an der HTW Berlin. Prüfungsformen sind vor allem Klausuren und mündliche Prüfungen. Primärgerät ist ein iPhone, ergänzend Tablet und Computer. Standardbudget: 20 Minuten täglich. Die App soll drei bis fünf Jahre an Materialien und Lernhistorie verwalten. Sie optimiert verzögert verfügbares und anwendbares Wissen pro Lernzeit. Vorlesungen und ausführliche Prüfungsvorbereitung werden nicht vollständig ersetzt.

### Verbindliche Entscheidungen

- Responsive, installierbare PWA; zunächst online nutzbarer Pilot, vor regulärer mobiler Nutzung Offline-Tagespaket und robuste Synchronisation.
- Standardarchitektur: PWA + verwaltetes PostgreSQL/Auth/Objektspeicher-Backend, serverseitige Jobverarbeitung und austauschbarer KI-Adapter. Supabase ist die geprüfte Ausgangsoption.
- Sites ist eine Alternative nur nach expliziter technischer Verifikation von Anmeldung, Offlinebetrieb, Export und Kontingenten. Bei Sites D1/R2 und Plattformanmeldung verwenden, kein zweites Auth-System hinzufügen.
- MVP-Scheduler: nachvollziehbare Regeln mit konfigurierbaren Beispielabständen 1/3/7/14/30/60 Tage; keine Behauptung wissenschaftlicher Optimalität. FSRS zunächst nur als spätere austauschbare Implementierung.
- Anfangs PDF und Text/Markdown. Andere Unterlagen gegebenenfalls als PDF; unsichere Extraktion wird gesperrt.
- Jede neue Aufgabenfamilie und fachlich veränderte Version wird vor Aktivierung vom Nutzer freigegeben.
- Kein persönlicher YouTube-Feed, keine Shorts-Belohnung, keine Ranglisten und keine Pflichtstreaks.
- Fachliche Beispiele sind erst nach Abgleich mit echten Unterlagen prüfungsrelevant.

### Datenmodell

Alle persönlichen Entitäten tragen `owner_id`, stabile IDs und Erstellungs-/Änderungszeitpunkte. Datenbankzeiten werden in UTC gespeichert; Tagesgrenzen für diesen Nutzer standardmäßig Europe/Berlin.

| Entität | Erforderliche Felder / Beziehungen |
|---|---|
| UserSettings | Zeitzone, Tagesbudget, aktive Kurse, Erinnerungsoption, Exportpräferenz |
| Course / Exam | Name, Prüfungsform, Datum optional, Relevanzangaben mit Herkunft |
| Document | stabile ID, Kurs, Titel, Status |
| DocumentVersion | Document-ID, Hash, Version, Uploadzeit, Originalpfad, Dateityp, Extraktionsstatus |
| SourceSpan | Dokumentversion, PDF-Seite, Druckseitenzahl optional, Abschnitt, Text, Bildkoordinaten optional, Prüfstatus |
| LearningObjective | Kurs, Beschreibung, Quellenbeziehungen, Voraussetzungen, Relevanz, aktiv/archiviert |
| CompetencyTrack | Lernziel, Stufe: Erkennen/Abrufen/Erklären/Anwenden, erforderliche Kriterien |
| TaskFamily | Zielspur(en), Anforderung, Variantenregeln, Ähnlichkeitsgruppe |
| TaskVersion | Familie, Variante, Version, Format, Prompt, Optionen mit IDs, Rubrik, Musterlösung, Feedback, Quellen, externe Herkunft, Freigabestatus, ersetzt-Version |
| AttemptEvent | UUID, Gerät, Aufgabe/Version, Zeitpunkt, aktive Dauer, Antwort, Hilfe, Sicherheitsurteil, Sitzung, Offline-/Syncstatus |
| AssessmentEvent | Versuch, Rubrikpunkte, Ergebnis, Bewertungsart, Modell/Promptversion, Unsicherheit, Korrektur-von, Nutzerbegründung |
| ReviewState | Zielspur bzw. homogene Familie, Regelstufe, Fälligkeit, letzte unabhängige Leistung, Algorithmusversion; aus Ereignissen rekonstruierbar |
| SessionPlan | Budget, Ziele/Aufgaben, Prioritätsgründe, geplante Zeit, Abschluss/Abbruch |
| ContentChange / Issue | betroffene Versionen, Typ, Konflikt, Meldung, Entscheidung und Begründung |
| ProcessingJob | Quelle, Stufe, Status, Versuchszahl, Idempotenzschlüssel, Fehler, Verbrauch |
| ExportManifest | Schemasversion, Zeitpunkt, Objektliste, Prüfsummen, Ereignisgrenze, Restore-Ergebnis |

Quelle und Aufgabe haben eine Viele-zu-viele-Beziehung. Voraussetzungen bilden einen gerichteten Graphen ohne unaufgelöste Zyklen. ReviewState ist ein Cache; unveränderliche Ereignisse sind die maßgebliche Historie. Historie darf nicht durch neue Musterlösungen rückwirkend umgeschrieben werden.

### Kernabläufe

**Import:** Datei speichern → exakte Duplikate abfangen → Text/OCR mit Seitenankern → Extraktionsprobleme zeigen → Lernziele vorschlagen → Bestandsabgleich → Änderungen/Konflikte prüfen → Fragen und Rubriken erzeugen → automatische Prüfungen → Nutzerfreigabe → Planung.

**Lernen:** Budget wählen → endlichen Plan öffnen → eigene Antwort abgeben → Sicherheit/Hilfe erfassen → Rubrikfeedback → Bewertung korrigieren können → nur geprüfte Kompetenzspur aktualisieren → Geschwistervarianten sperren → sichtbarer Abschluss.

**Fehler:** sachliche Korrektur → gegebenenfalls vereinfachtes Beispiel → freiwillige spätere Reparatur in derselben Sitzung, ausdrücklich ohne Langzeiterfolgswertung → unabhängiger Neuversuch an einem späteren Tag.

**Änderung:** alte Version erhalten → fachliche Tragweite feststellen → betroffene aktuelle Aufgaben sperren oder ersetzen → betroffene Lernspur neu verifizieren → unveränderte Spuren und frühere Versuche bewahren.

**Offline:** Tagespaket bewusst herunterladen → lokal antworten und gegebenenfalls selbst bewerten → Ereignisse mit UUID zwischenspeichern → beim Wiederöffnen/Netzzugang idempotent synchronisieren → Konflikte und veraltete Aufgaben kenntlich machen.

**Export/Restore:** konsistente Ereignisgrenze wählen → Daten und sämtliche Dateien mit Prüfsummen ausgeben → in leere Testumgebung importieren → Beziehungen, Dateihashes und rekonstruierte Fälligkeiten vergleichen.

### Planungsregeln

Priorität kombiniert Fälligkeit, Prüfungsrelevanz, Terminnähe, Voraussetzungslücken, Fehlermuster und Vernachlässigung. Keine versteckte Bevorzugung leicht klickbarer Karten. Wochenanteile für weniger dringliche aktive Ziele schützen; bei echter Überlastung Umfangslücken anzeigen. Neue Aufgaben nur bei freier Kapazität. Sprech-/Fallblock bleibt als zusammenhängende Einheit erhalten.

Qualifizierter Erfolg: sachlich ausreichend, unabhängig, ohne Hilfe und nicht geraten; nach enthüllter Lösung in derselben Sitzung kein Langzeiterfolg. Teilrichtig/falsch/mit Hilfe werden getrennt gespeichert. Unsichere KI-Bewertung bleibt offen. Antwortzeit ist im MVP kein Korrektheitskriterium.

### Oberfläche

Start zeigt Zeitwahl, Lernplan und zuletzt erreichten sinnvollen Fortschritt. Eine Aufgabe pro Ansicht; „Antworten“, „Lösung“, „Quelle“, „Hilfe“, „Melden“, „Überspringen“ sind explizit. Wischen allein wertet nichts. Texte skalieren, Kontraste und Fokuszustände sind zugänglich, Animationen reduzierbar. Lange Aufgaben haben einen zusammenhängenden Arbeitsraum.

Fortschritt unterscheidet „gesehen“, „mit Hilfe gelöst“, „unabhängig abgerufen“, „nach Abstand erneut geschafft“ und „auf neuen Fall angewendet“. Keine pauschale Beherrschung aus einer einzelnen Auswahlfrage.

### Überprüfbare Abnahmekriterien

| Nr. | Prüffall | Bestanden, wenn … |
|---|---|---|
| A1 | Dasselbe PDF zweimal hochladen | nur eine Inhaltsversion/Generierung entsteht; beide Uploadversuche nachvollziehbar |
| A2 | Aufgabe aus freigegebenem Dokument öffnen | Originalversion und richtige Seite/Passage direkt erreichbar sind |
| A3 | Unlesbare Formel oder fehlende Seite | daraus keine unmarkierte aktive Fachaufgabe entsteht |
| A4 | Widersprüchliche Quellen | Konflikt sichtbar ist und betroffene neue Aufgaben bis zur Entscheidung gesperrt bleiben |
| A5 | Musterlösung fachlich ändern | alte Versuche unverändert bleiben, neue Version aktiv wird und nur betroffene Spuren neu geprüft werden |
| A6 | Leichte MC-Frage korrekt lösen | Anwendungsspur nicht automatisch auf „beherrscht“ springt |
| A7 | Frage paraphrasieren | bestehendes Lernziel wiederverwendet wird; keine neue Erfolgsserie allein durch Wortlaut |
| A8 | Richtig geraten / mit Hilfe | Hilfen und Raten gespeichert werden, ohne normalen unabhängigen Stufenaufstieg |
| A9 | Falsch beantworten und sofort korrigieren | Korrektur nicht als späterer unabhängiger Abruf zählt |
| A10 | Bewertung nachträglich korrigieren | Original und Korrektur bestehen bleiben und Fälligkeit reproduzierbar neu berechnet wird |
| A11 | Geschwistervarianten in einer Sitzung | keine unbeabsichtigte direkte Wiederholung desselben Lösungsinhalts erfolgt |
| A12 | Drei Tage auslassen | keine Strafpunkte entstehen; Budget eingehalten und tatsächliche Fälligkeit erhalten bleibt |
| A13 | Viele fällige Ziele | neue Ziele reduziert, Vernachlässigung berücksichtigt und verbleibende Lücke angezeigt wird |
| A14 | 20-Minuten-Plan | Feedback/Abschluss mitgeplant werden; kein unbegrenztes automatisches Nachladen |
| A15 | iPhone im Flugmodus nach Paketdownload | vorbereitete Aufgaben und Lösungen verfügbar sind, Antworten erhalten bleiben |
| A16 | Dasselbe Offlineereignis dreimal senden | genau ein Versuch gespeichert wird |
| A17 | Zwei Geräte gleichzeitig | echte Versuche erhalten bleiben, aber keine künstliche Verdoppelung unabhängiger Lerntage entsteht |
| A18 | Zugriff ohne Anmeldung / falscher Eigentümer | persönliche Daten und Dateien serverseitig geschützt sind |
| A19 | Vollständiger Export und Restore | Dateihashes, Aufgabenanzahl, Quellenbeziehungen und Ereignisanzahl übereinstimmen |
| A20 | Kein KI-Dienst erreichbar | vorhandenes Lernen weiter möglich ist, neue Bewertungen klar ausstehen und kein Datenverlust entsteht |
| A21 | Sprech-/Transferaufgabe | Rubrik und eigenes Ergebnis erfasst werden, ohne bloßes Abspielen als Erfolg zu zählen |
| A22 | Aussetzen und endgültiges Löschen | Planungsstopp bzw. erklärter Löschumfang korrekt umgesetzt werden |
| A23 | Evaluationsexport | verzögerte Tests, neue Transferaufgaben, Expositionsabstände, Zeiten und Ermüdung getrennt auswertbar sind |

Für Bewertungsqualität zunächst eine kleine geprüfte Sammlung von mindestens 30 Antworten erstellen, mit korrekten Paraphrasen, Teilantworten, falschen Fachbegriffen und begründeten Alternativen. Anzahl ist eine MVP-Prüfgröße, kein statistischer Nachweis. Offene Bewertungen und menschliche Korrekturen zählen in der Auswertung ausdrücklich mit.

### Reihenfolge der Umsetzung

1. Eine echte Materialcharge auswählen und Daten-/Quellenmodell validieren.
2. Import, Versionierung, Freigabe und Quellenansicht umsetzen.
3. Drei bis vier Kernformate, Ereignishistorie und korrigierbare Bewertung.
4. Regel-Scheduler, Budgetplan und ehrlicher Fortschritt.
5. Geräteabgleich, Export und Restore.
6. Installierbarkeit und Offlinepaket mit iPhone-Tests.
7. Zehnwöchigen Pilot durchführen; erst danach FSRS, Medien oder Spiele ausbauen.

**Bewusst zurückgestellt:** native Stores, automatisches Bewerten längerer mündlicher Prüfungen, persönlicher YouTube-Feed, selbstoptimierende Spielmechaniken, automatische Quellenkonfliktentscheidung und unbeaufsichtigte Veröffentlichung generierter Aufgaben.

