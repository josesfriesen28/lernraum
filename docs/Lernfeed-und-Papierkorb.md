# Lernfeed und Papierkorb

## Lernfeed im Reel-Stil (seit v0.4.0)

Code: `components/learn-feed.tsx`, Styles: Abschnitt „Reel-Lernfeed“ am Ende von `app/globals.css`.

„Heute lernen“ öffnet einen Vollbild-Feed. Eine Karte füllt den Bildschirm, die nächste liegt sichtbar dahinter.

| Kartentyp | Ablauf |
|---|---|
| Single-Choice | Antwort antippen → sofortige Auflösung. Richtig: Konfetti, Spruch, 🔥+1, automatisch weiter nach 1,3 s (jede Berührung stoppt das). Falsch: Wackeln, richtige Antwort grün, Erklärung scrollt ins Bild, dann hochwischen. |
| Multiple-Choice | Antippen, „Prüfen“, hochwischen. Nur die vollständig richtige Auswahl zählt. |
| Freier Abruf / Anwendung | Antwort tippen, „Abgleichen“, Musterlösung lesen, Selbstbewertung antippen → nächste Karte. |
| Erklärkarte | Inhalt sofort sichtbar, hochwischen = gelesen (kein Abruf-Erfolg). |

Weiter geht es per Hochwischen (Karte folgt dem Finger, ab 90 px oder schnellem Wisch), per Mausrad/Trackpad am Kartenende, per „Weiter“-Knopf oder Tastatur (↓/Leertaste, 1–6 für Optionen bzw. 1–3 für die Bewertung, Enter, Esc).

Lernregeln, die der Feed absichtlich nicht aufweicht:

- Wischen vor dem Antworten = **Überspringen**: zählt nicht als Erfolg und setzt die Serie zurück.
- Offene Antworten lassen sich erst nach der Selbstbewertung wegwischen.
- „🎲 Ich rate“ und „Quelle als Hilfe“ werden gespeichert; solche Versuche verlängern den Wiederholungsabstand nicht.
- Der 🔥-Zähler gilt pro Sitzung (sessionStorage) und hat keinen Einfluss auf den Scheduler.
- Pausenangebote (Einstellung „Pausenangebot“) erscheinen als eigene Karte.
- `prefers-reduced-motion` schaltet Animationen und das automatische Weiter ab.

Wenn das Speichern fehlschlägt, springt die Karte zurück und die Fehlermeldung steht unter dem Knopf; die Antwort bleibt im Postausgang vorgemerkt.

Noch nicht auf echtem iPhone geprüft (nur Chromium mit iPhone-Emulation, Touch-Events per CDP). Haptik (`navigator.vibrate`) gibt es in iOS Safari nicht; dort entfällt sie stillschweigend.

## Papierkorb

Unter Aufgaben eine aktive Aufgabe öffnen und unten „Aufgabe löschen“ wählen. Sie wird in den Papierkorb verschoben, aus noch offenen Sitzungspositionen entfernt und nicht mehr geplant. Vorherige Antworten und Quellen bleiben erhalten. Im Statusfilter „Papierkorb“ lässt sie sich wiederherstellen. Dies ist eine wiederherstellbare Löschung, keine endgültige Datenvernichtung.

Weitere Karten werden bei Bedarf aus dem Aufgabenpool nachgeladen, ohne dieselbe Familie innerhalb der Sitzung erneut einzureihen.
