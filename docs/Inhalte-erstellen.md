# Wie neue Lerninhalte in die App kommen

1. **Bescheid sagen:** „In Modul X gibt es Neues.“ Claude holt die Unterlagen selbst aus Moodle (im Browser der Claude-App, in dem du bei Moodle angemeldet bist) und liest die Prüfungsmarkierungen aus deinen Notion-Notizen. Alternativ Material direkt im Chat hochladen.
2. **Claude erstellt Aufgaben:** Aus dem Material entstehen möglichst viele sinnvolle Aufgaben in allen fünf Formaten (Single-/Multiple-Choice, freier Abruf, Anwendung auf neue Fälle, Erklärkarten). Jede Aufgabe hat Lösung, Bewertungskriterien und eine kurze Belegstelle mit Seitenzahl.
3. **Ablage im Repository:** Die Pakete landen als JSON unter `content/<modul>/<thema>.json` (Format: [content/README.md](../content/README.md)). Pro Thema ein Paket, höchstens 500 Aufgaben.
4. **Prüfen und Version anheben:** `npm test` und `npm run build` (prüft jedes Paket), Version und CHANGELOG anheben, committen.
5. **Hochladen:** In GitHub Desktop „Push origin“. GitHub baut und veröffentlicht die App automatisch.
6. **Lernen:** Beim nächsten Öffnen übernimmt Lernraum die neuen Aufgaben auf jedem Gerät von selbst und zeigt kurz an, was neu ist.

Korrekturen funktionieren genauso: Aufgabe in der JSON-Datei verbessern (gleiche `id` behalten), hochladen – die App ersetzt die alte Version und behält deinen Verlauf.

Eigene Pakete von Hand (z. B. aus einem anderen Chat) lassen sich weiterhin unter *Material* importieren; die landen dann nur auf dem einen Gerät.

## Qualitätsregeln für die Aufgaben

- Nur Inhalte aus dem Material; nichts dazuerfinden. Unklare Stellen im Paket als offene Frage markieren statt raten.
- Mischung: Begriffe wiedererkennen (Choice), frei erklären (Abruf), auf neue Fälle anwenden (Anwendung) – für mündliche Prüfungen besonders viele Erklär- und Anwendungsaufgaben.
- Falsche Antwortoptionen müssen plausibel sein (typische Verwechslungen), keine Scherzantworten.
- Belegstellen kurz halten (ein bis zwei Sätze) – das Repository ist öffentlich.
- Stabile IDs: `packageId` = `<modul>-<thema>`, Aufgaben-IDs fortlaufend (`q1`, `q2`, …) und nie neu vergeben.
