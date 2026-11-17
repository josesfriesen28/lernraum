# Lerninhalte (werden mit der App ausgeliefert)

Jede `.json`-Datei in diesem Ordner (auch in Unterordnern) ist ein Lernraum-Aufgabenpaket. Beim Build landen alle Pakete in der App; beim nächsten Öffnen übernimmt Lernraum neue und geänderte Pakete automatisch – auf jedem Gerät, ohne Import von Hand.

Ablage: `content/<modul>/<thema>.json`, z. B. `content/kommunikationspsychologie/01-vier-seiten-modell.json`.

Pflichtfelder zusätzlich zum normalen Paketformat (siehe `docs/Aufgabenpaket-Prompt.md`):

| Feld | Bedeutung |
|---|---|
| `course` | Modulname, wie er in der App erscheinen soll. Gibt es das Modul noch nicht, wird es angelegt. |
| `examType` | optional: `Klausur`, `Mündliche Prüfung` oder `Andere` |
| `packageId` | bleibt für immer gleich – darüber erkennt die App Updates. Nie wiederverwenden. |
| `tasks[].id` | bleibt pro Aufgabe gleich. Geänderter Text → neue Version der Aufgabe (Fortschritt beginnt für diese Aufgabe neu), gleicher Text → Fortschritt bleibt. |
| `tasks[].image` | optional: Schaubild zur Karte, Pfad relativ zu `content/`, z. B. `b2-bwl/bilder/abb9-15.svg` (svg, png, jpg, webp). Erklärkarten zeigen es sofort, Fragen erst nach dem Antworten. |
| `tasks[].sourceUrl` | optional: https-Link zur Originalquelle, z. B. Moodle-PDF mit `#page=29`. Erscheint als „Original-Folie ansehen“. |

Schaubilder liegen unter `content/<modul>/bilder/`. Wegen des öffentlichen Repositorys nur **selbst nachgezeichnete** Abbildungen ablegen, keine Scans oder Screenshots aus Büchern/Folien. Die B2-Schaubilder hat Claude als SVG gezeichnet.

Update-Regeln:
- Aufgabe neu im Paket → wird hinzugefügt und aktiviert.
- Aufgabe geändert (Frage, Lösung, Kriterien, Optionen, Typ) → alte Version wird ersetzt, Antworten bleiben im Verlauf.
- Aufgabe nicht mehr im Paket → wandert in den Papierkorb, Antworten bleiben erhalten.
- Aufgaben, die du in der App gelöscht hast, bleiben gelöscht, solange sie sich im Paket nicht ändern.

Der Build bricht ab, wenn ein Paket ungültig ist oder eine `packageId` doppelt vorkommt (`npm run build`).

**Achtung:** Das Repository ist öffentlich. Alles in diesem Ordner – Fragen, Lösungen, Zitate aus Skripten – ist für jeden lesbar. Längere wörtliche Auszüge aus Vorlesungsfolien oder Büchern deshalb vermeiden und nur kurze Belegstellen verwenden.
