# Abnahme – Stand 31. Oktober 2026

Die lokale Abnahme verwendet ausschließlich mit TEST gekennzeichnete, erfundene Inhalte. Sie ist kein Nachweis für mehrjährigen Betrieb oder fachlich korrekte automatisch erzeugte Aufgaben.

## Automatisiert geprüft

**13 Domänentests** in `tests/core.test.mjs`:

- Unterschiedliche Fälligkeiten nach richtigen und falschen Antworten.
- Überspringen, Lesen und ungeklärte Ereignisse erzeugen keinen Erfolg.
- Hilfen, vorzeitig gezeigte Lösungen und Raten verlängern das Intervall nicht.
- Keine mehrfachen unabhängigen Erfolge am selben Kalendertag.
- Neue Quellen-Epochen und Kompetenzspuren übernehmen keine unpassende Evidenz.
- Korrekturen verändern die abgeleitete Fälligkeit, ohne Originalversuche zu überschreiben.
- Zeitbudget, Variantenabstand, Wiedereinstieg nach verpassten Tagen.
- Exakte Multiple-Choice-Bewertung, Ablehnung ungültiger Auswahlaufgaben.
- Backup-Referenzen, doppelte IDs, Berliner Tagesgrenze.
- Reproduzierbare, über Sitzungen wechselnde Antwortreihenfolge.

**19 Integrationsprüfungen** in `tests/api.test.mjs`, mit echter lokaler D1-/R2-Laufzeit und HTTP:

- Nicht angemeldete Datenabfragen und gefälschte Nutzerheader abgewiesen.
- Einstellbarer Pausentakt wird gespeichert.
- Textdatei hochladen, Quellen und Entwürfe erstellen.
- Wiederholter Datei-/Textimport ohne Aufgabendubletten.
- Wiederholter Antwort-Request mit derselben ID ohne doppelten Versuch.
- Sitzung nach erneutem Abruf an derselben Position.
- Überspringen bleibt Überspringen.
- Geänderte Quelle erhält alte Historie, vermeidet neue Aufgaben für unveränderte Abschnitte und setzt betroffene alte Aufgaben aus.
- Neue freigegebene Epoche startet ohne übernommene Abruf-Evidenz.
- Single-Choice, Multiple-Choice, Erklärung und Anwendung speichern passende Ergebnisse.
- Ersetzte Aufgabenversionen lassen sich nicht überschreiben.
- Vollständiger struktureller Restore.
- Zwei gleichzeitige Änderungen auf derselben Revision: genau eine angenommen, die andere mit Konflikt zurückgegeben.
- Fremde Origins abgewiesen und Originaldateien ohne Anmeldung unzugänglich.

TypeScript-Prüfung ohne Ausgabe und Produktionsbuild werden vor der Veröffentlichung ausgeführt.

## Im Browser durchgeführt

- Mobile Ansicht mit 390 × 844 CSS-Pixeln; kein horizontaler Überlauf (`scrollWidth = innerWidth = 390`).
- Anmeldung über die lokale, ausschließlich für die Entwicklung verfügbare Testanmeldung.
- Modul anlegen → Text importieren → Entwürfe mit Originalbelegen prüfen → Fragen präzisieren → freigeben → Sitzung starten.
- Antwort eintippen → Seite neu laden → Sitzung fortsetzen → denselben Antwortentwurf wiederfinden.
- Musterlösung erst nach Antwortabgleich sichtbar.
- Lokalen Server während einer Bewertung stoppen: „Antwort vorgemerkt“ erscheint, kein bestätigter Erfolg wird behauptet. Server wieder starten → Seite neu laden → erneut senden → Sitzung steht genau einen Schritt weiter.
- Zweite Aufgabe überspringen → Abschlussansicht zeigt einen tatsächlichen Antwortversuch statt zwei Erfolgen.
- PDF ohne Textebene ausgewählt: verständliche Fehlermeldung mit dem Ersatzweg Text einfügen; kein Quellenimport angelegt.
- Ein Text-PDF über den Dateidialog hochladen und im Browser auslesen; ein neuer Quellenstand und ein Entwurf entstehen.
- Vollständiges Backup über die Oberfläche herunterladen, dieselbe Datei wieder auswählen und erfolgreich mit Originaldateien wiederherstellen.

## Umgesetzte Funktionen

Privater Zugang, serverseitige Daten, Modul-/Themen-/Prüfungsverwaltung, PDF/Text, Quellenarchiv, Versionsvergleich, Entwurfsfreigabe, fünf Aufgabenformate, längere gezielte Übung, Variantenbezüge, Lernzielbearbeitung, regelbasierte Fälligkeit, Wochenanzeige, Antwortkorrektur, Aussetzen, endliche Sitzungen, Pausenangebot, Backup/Restore, lokale Antwortvormerkung und kontrollierte Konfliktbehandlung.

## Noch offen / bewusst begrenzt

- Keine KI-Generierung, KI-Bewertung, OCR oder semantische Widerspruchs-/Dublettenanalyse. Der Import liefert einfache, manuell zu präzisierende Abrufentwürfe.
- Keine automatische fachliche Vollständigkeitsprüfung. Quellenvergleich ist text- und positionsbasiert.
- Kein vollständig offline startbarer Modus und keine Push-/E-Mail-Erinnerungen.
- Kein eigener mathematischer Formeleditor; komplexe Formeln, Grafiken und Tabellen müssen am Original geprüft werden.
- Keine Prüfung auf einem physischen iPhone, kein praktischer Test mit zwei physischen Geräten und unterschiedlichen angemeldeten Nutzerkonten. Zwei konkurrierende Clients und die lokale Zugriffstrennung wurden technisch geprüft.
- Keine Langzeit-/großen Lasttests; Snapshot-Abfragen und Browser-Restore haben dokumentierte Grenzen. Keine Zusage für drei bis fünf Jahre unterbrechungsfreien Hostingbetrieb.
- Keine automatische Löschung unreferenzierter Originaldateien und kein automatisches externes Backup.
- Kein Minispiel und kein Videofeed; beide sind für den Kernablauf nicht erforderlich.

Der lokale Testnutzer und seine TEST-Inhalte werden nicht in die produktive Datenbank übertragen. Die produktive Site startet ohne vorab importierte Studienunterlagen.
