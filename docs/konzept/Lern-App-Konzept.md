# Persönliche Lern-App für Wirtschaftskommunikation
## Recherche, Produktkonzept und Umsetzungsspezifikation
**Stand: 30. Oktober 2026 · Für Wirtschaftskommunikation an der HTW Berlin · 20 Minuten täglich · iPhone, Tablet und Computer**

## 1. Empfehlung und Entscheidungsgrundlage

Empfohlen wird eine **private, installierbare Web-App (PWA)** mit einem endlichen täglichen Lernfeed. Sie verbindet freies Abrufen, verteilte Wiederholungen, kurze mündliche Erklärungen und neue Fallaufgaben. Wöchentlich kommt ein zusammenhängender Anwendungsblock hinzu, der einen Teil der 20 Minuten ersetzt. Neue Unterlagen werden versioniert, mit vorhandenen Lernzielen abgeglichen und erst nach Qualitätsprüfung zu aktiven Aufgaben.

Die wichtigsten Entscheidungen:

1. **Lernziele führen, Aufgaben variieren.** Ein Begriff, seine Erklärung und seine Anwendung bekommen getrennte Leistungsnachweise. Neue Formulierungen erzeugen keinen künstlich neuen Wissensbestand.
2. **Antwort vor Lösung.** Freies Antworten ist der Standard für Definitionen und Erklärungen; Auswahlfragen dienen vor allem der Unterscheidung ähnlicher Konzepte. Bei mündlichen Prüfungen gehört tatsächliches Sprechen dazu.
3. **20 Minuten sind ein Budget.** Bei Überlastung reduziert die App neue Inhalte und zeigt ungedeckte Lernziele. Sie verspricht nicht, beliebig viel Stoff in dieser Zeit zu bewältigen.
4. **Zunächst transparente Wiederholungsregeln; FSRS als austauschbare spätere Option.** Der größte anfängliche Nutzen liegt in guten Aufgaben und verteiltem Üben. Eine Vermischung unterschiedlicher Aufgabenformate in einem vermeintlich präzisen Gedächtnismodell wäre verfrüht.
5. **Quellenbindung ist Pflicht.** Jede fachliche Musterlösung muss auf eine konkrete Dokumentversion und Fundstelle zurückführen. Unlesbares und Widersprüchliches bleibt gesperrt.
6. **Endliche Etappen statt Endlosfeed.** Ein sichtbarer Abschluss, flexible Ziele und ein freiwilliger Zusatzblock unterstützen selbstbestimmtes Lernen.
7. **Keine Shorts als automatische Belohnung.** Pausen und freiwillige Unterhaltung bleiben getrennt. Fachliche Videos können später gezielt eingebunden werden.
8. **Portierbare Daten ab Tag eins.** Aufgaben, Originaldateien, Quellenstellen, Bewertungen und Lernhistorie müssen gemeinsam exportierbar und wiederherstellbar sein.
9. **Technischer Standardpfad:** PWA mit verwalteter PostgreSQL-Datenbank, Anmeldung, Objektspeicher und serverseitiger KI-Verarbeitung. Sites ist eine echte alternative Hostingoption, deren Offline-Verhalten und längerfristige Kosten vor Festlegung praktisch geprüft werden müssen.

Diese Empfehlungen sind **Produktentscheidungen**, gestützt durch die nachstehende Forschung, aber kein Wirksamkeitsnachweis für genau diese App.

### Persönlicher Kontext und Annahmen

Bekannt sind Studienfach, Hochschule, Prüfungsarten, Zeitbudget und iPhone-Nutzung. Nicht bekannt sind Semester, aktuelle Module, Prüfungsdaten, zugelassene Hilfsmittel und konkrete Bewertungsraster. Die folgenden Beispiele zu Kommunikationsmodellen, Kampagnen, Statistik und Fallanalysen sind **Illustrationen, keine Behauptungen über deinen aktuellen HTW-Lehrplan**. Prüfungsrelevanz ergibt sich später aus deinen Unterlagen und Angaben.

20 Minuten werden als gesamtes tägliches App-Budget interpretiert, einschließlich kurzer Rückmeldung und regulärer Materialfreigabe. Umfangreiche einmalige Einrichtung und außergewöhnlich schlechte Scans sind gesonderter Aufwand.

## 2. Rechercheweg und Belastbarkeit

### Vorgehen

Recherchiert wurde am **30.10.2026** über Consensus sowie direkte Websuche nach wissenschaftlichen Originalpublikationen, Verlagsseiten, Autorenmanuskripten und offizieller technischer Dokumentation. Der gewünschte Consensus-Deep-Modus wurde wegen unzureichender verbleibender Monatscredits abgewiesen. Der anschließend ausgeführte Pro-Lauf wurde separat und unverändert gespeichert. Er deckt den Auftrag nicht ausreichend ab; der vorliegende Bericht ist eine **eigenständige Ergänzung auf Basis direkt recherchierter Quellen**, keine bloße Wiedergabe dieses Ergebnisses.

Es handelt sich um eine **gezielte, strukturierte Literaturrecherche und narrative Synthese**, nicht um eine vollständige systematische Übersichtsarbeit: kein vorregistriertes Protokoll, kein vollständiger Datenbankexport, keine doppelte unabhängige Auswahl, keine eigene Metaanalyse. Trefferzahlen oder ein PRISMA-Flussdiagramm werden deshalb nicht vorgetäuscht.

| Suchblock | Verwendete Suchbegriffe / Suchrichtung | Auswahl |
|---|---|---|
| Grundlagen | „Dunlosky 2013 effective learning techniques“, „Agarwal Nunes Blunt 2021 retrieval practice“ | Ausgangsarbeiten, bibliografische Prüfung |
| Abruf und Transfer | „retrieval practice meta-analysis 2025“, „Pan Rickard transfer 2018“, „covert overt retrieval meta-analysis“ | Reviews, reale Lernkontexte, neue Gegenbefunde |
| Verteilung und Mathematik | „Latimier Peyre Ramus spacing retrieval“, „Murray Horner Göbel mathematics 2025“ | Unterschied zwischen Fakten und Verfahren |
| Interleaving und Erklären | „Brunmair Richter 2019“, „Bisra self explanation meta analysis“, „Renkl worked examples fading“ | Moderatoren, Vorwissen, Grenzen |
| Feedback und Motivation | „Wisniewski Zierer Hattie feedback“, „Sailer Homner gamification“, „Howard self determination“, „habit formation systematic review 2024“ | Lernergebnis von Engagement trennen |
| Pausen und Medien | „Albulescu 2022 micro breaks“, „Chiossi 2023 prospective memory“ | Zielvariable und Übertragbarkeit prüfen |
| KI-Bewertung | „large language models automated short answer grading systematic review 2025 2026“ | Rubriken, Fehlbewertungen, Sprach-/Domänengrenzen |
| Technik | Originaldokumentation von SuperMemo, FSRS/Anki, Google/YouTube, Apple/WebKit, web.dev, Supabase, Cloudflare, OpenAI/Sites | Keine Blogpreise oder erfundenen Plattformfunktionen |

Priorisiert wurden systematische Reviews und Metaanalysen, danach einschlägige Originalstudien und wissenschaftliche Synthesen. Einzelstudien, Schulstudien und technische Benchmarks werden nicht wie Nachweise für deine konkrete Hochschul-App behandelt. Preprints, Suchtreffer ohne ausreichenden Inhalt und Herstellerbehauptungen tragen keine starken Wirksamkeitsurteile. Quellenzugang ist im Literaturverzeichnis ausgewiesen.

**Bewertungszeichen:** **G** = gut gestützter allgemeiner Befund; **K** = kontextabhängig oder widersprüchlich; **P** = plausible Produktentscheidung; **H** = offene, zu testende Hypothese. Das ist eine qualitative Einordnung, keine formale GRADE-Bewertung.

### Wichtige Einordnungen der Ausgangsarbeiten

- **Dunlosky et al. (2013)** bewerten Übungstests und verteiltes Lernen als breit nützlich; Selbst-Erklärung und Interleaving sind stärker bedingungsabhängig. Die Arbeit ist eine grundlegende Übersicht, kein Beleg für ein bestimmtes App-Layout. [Q1](https://doi.org/10.1177/1529100612453266)
- **Agarwal, Nunes & Blunt (2021)** untersuchen Unterrichtsforschung: 50 Experimente, insgesamt 5.374 Lernende; die Mehrzahl der Effektgrößen lag im mittleren oder großen Bereich. Hier wurde der Verlagsabstract geprüft, nicht der kostenpflichtige Volltext. [Q2](https://doi.org/10.1007/s10648-021-09595-9)
- **Albulescu et al. (2022)** finden bei Mikropausen kleine Vorteile für Vitalität und Ermüdung; der Gesamteffekt auf Leistung war nicht statistisch signifikant. Das rechtfertigt Erholung, aber weder eine feste Fragenzahl noch einen garantierten Leistungsgewinn. [Q3](https://doi.org/10.1371/journal.pone.0272460)
- **Chiossi et al. (2023)** untersuchen prospektives Gedächtnis, also das Erinnern geplanter Handlungen, in einem Experiment mit 60 Personen. Die TikTok-Bedingung beeinträchtigte diese Leistung. Daraus folgt kein generelles Verbot kurzer Lehrvideos und kein Nachweis, dass ein thematisch kohärenter Lernfeed dieselbe Wirkung hätte. [Q4](https://doi.org/10.1145/3544548.3580778)

### Neuere und einschränkende Evidenz

Eine am 29.10.2026 veröffentlichte Metaanalyse von Ruitenburg et al. findet positive durchschnittliche Effekte von Abruf, Verteilung und Interleaving in Primar- und Sekundarschulen, aber deutliche Abhängigkeiten vom Lernkontext. Sie umfasst 53 Studien; ihre Aktualität ersetzt nicht die Prüfung ihrer Übertragbarkeit auf Hochschulen. [Q5](https://doi.org/10.1007/s10648-026-10225-5)

Murray, Horner & Göbel (2025) berichten für Mathematik einen positiven Spacing-Effekt, aber keinen belastbaren einheitlichen Vorteil von Testen gegenüber erneutem Studieren: Die Schätzung für Retrieval beruht auf nur sieben Studien und ihr Konfidenzintervall schließt null ein. Rechnen benötigt deshalb Lösungsbeispiele und ganze Aufgaben, nicht nur Formelabfragen. [Q6](https://doi.org/10.1007/s10648-025-10035-1)

Yu et al. (2025) finden in 18 Studien einen kleinen Vorteil offenen gegenüber verdecktem Abrufen. „Im Kopf beantworten“ bleibt eine niedrigschwellige Option, wird aber nicht als nachweislich gleichwertiger Standard behandelt. [Q7](https://doi.org/10.1007/s10648-025-10024-4)

## 3. Evidenztabelle und daraus abgeleitete Lernformate

| Methode | Lernziel | Befund und Evidenzstärke | Grenzen | Konsequenz für die App |
|---|---|---|---|---|
| Retrieval Practice | Begriffe, Fakten, Teile des Verständnisses | **G:** Vorteile gegenüber bloßer Wiederexposition in breiter Literatur und Unterrichtsforschung. Q1, Q2 | Erfolg hängt von Material, Abrufmöglichkeit und Vergleichsbedingung ab | Erst antworten, danach Lösung; Lesekarten sind Vorbereitung |
| Spaced Practice | Langfristige Verfügbarkeit | **G:** Verteiltes Abrufen besser als massiertes; **K:** expandierende Abstände nicht generell besser als gleichmäßige. Q8 | Kein universeller optimaler Abstand | Mehrere erfolgreiche Abrufe an getrennten Tagen; einfache Regeln als Start |
| Successive Relearning | Stabilisierung von Kernwissen | **G/K:** Erneuter erfolgreicher Abruf über Sitzungen ist sinnvoll; konkrete Wiederholungszahlen sind materialabhängig. Q1, Q8 | Sofortige Wiederholung kann Arbeitsgedächtnis statt dauerhafte Verfügbarkeit messen | Korrektur heute und unabhängiger Abruf später getrennt protokollieren |
| Interleaving | Ähnliche Begriffe/Verfahren unterscheiden | **K:** Metaanalyse insgesamt positiv; Vorteile u. a. für Kategorienlernen und Mathematik, unklare oder gegenteilige Befunde für andere Materialien. Q9 | Kein Argument für zufälligen Fachwechsel nach jeder Karte | Nach Einführung gezielt verwechselbare Modelle oder Aufgabentypen mischen |
| Selbst-Erklärung | Zusammenhänge und Begründungen | **G/K:** Metaanalyse von Bisra et al. unterstützt angeleitete Selbst-Erklärung. Q10 | Qualität der Erklärung und Vorwissen entscheidend | „Warum passt dieses Modell hier?“ mit Kriterien, nicht bloß „Erkläre alles“ |
| Elaborative Fragen und Beispiele | Bedeutung und Verknüpfungen | **K:** Nutzen hängt von Vorwissen und passenden Verbindungen ab. Q1 | Erfundenes oder falsches Vorwissen kann Fehler festigen | Begründung an Quelle und Gegenbeispiel prüfen |
| Worked Examples / Hilfenabbau | Rechnen, strukturierte Verfahren | **G/K:** Beispiele stützen anfänglichen Fertigkeitserwerb; Hilfen schrittweise abbauen. Q11 | Besonders für strukturierte Aufgaben belegt; freie Kommunikationskonzepte weniger eindeutig | Vollständiges Beispiel → fehlender Schritt → eigenständige Aufgabe |
| Inhaltliches Feedback | Fehlerkorrektur | **G/K:** Metaanalyse zeigt Nutzen, aber große Heterogenität; Informationsgehalt wichtig. Q12 | „Richtig!“ allein ist keine Erklärung; Timing nicht universell | Korrekte Lösung, Fehlergrund, nächster Schritt, Quelle; im Prüfungsmodus gebündelt |
| Sicherheit und Kalibrierung | Realistische Selbsteinschätzung | **K:** Schwierigkeit und Vertrautheit sind keine zuverlässigen Beherrschungsmaße; Q1 | Selbsteinschätzung darf richtige Leistung nicht ersetzen | Vor Lösung „sicher/unsicher/geraten“; Abgleich mit späteren Tests |
| Transferübungen | Neue Fälle, Anwendung | **K:** Abruf kann übertragen; Moderatoranalysen zeigen klare Bedingungen. Q13 | Wiederholung derselben Formulierung garantiert keinen Ferntransfer | Neue Fälle, andere Oberflächenmerkmale, Begründung der Modellwahl |
| Lautes/geschriebenes Abrufen | Überprüfbare Antworten, mündliche Prüfung | **K:** kleiner mittlerer Vorteil gegenüber gedanklichem Abruf. Q7 | Kein Beweis, dass Tippen stets effizienter als Sprechen ist | Kurze Stichpunkte oder Sprechen; gedanklich nur mit ehrlicher Selbstbewertung |
| Kognitive Entlastung | Einstieg und komplexe Aufgaben | **G/K:** Beispiele und dosierte Hilfen können Anfänger entlasten. Q11 | Zu starke Zerlegung entfernt den Zusammenhang | Eine Entscheidung pro Ansicht; bei komplexen Aufgaben zusammenhängender Arbeitsraum |
| Autonomie und Motivation | Freiwillige Nutzung | **K:** selbstbestimmte Motivation und persönlicher Wert sind mit günstigeren Ergebnissen verbunden. Q14 | Zusammenhänge sind kein kausaler Beweis für einzelne UI-Elemente | Tagesumfang wählen, pausieren, Sinn des Lernziels zeigen |
| Gamification | Engagement, teilweise Leistung | **K:** im Mittel positive Effekte, motivationale/Verhaltenseffekte weniger stabil in strengeren Studien. Q15 | Einzelne Spielmechaniken daraus nicht ableitbar | Lernbezogene Rätsel und Fortschritt testen; keine Pflichtstreaks |
| Mikropausen | Ermüdung und Vitalität | **G/K:** kleine Wohlbefindenseffekte; Leistungswirkung unsicher. Q3 | Kein optimaler Rhythmus für 20-Minuten-Lernen | Freiwillige ruhige Pause nach Belastung oder Block |
| Gewohnheitsbildung | Regelmäßiger Einstieg | **K:** große individuelle Unterschiede in Gesundheitsverhaltensstudien. Q16 | Übertragung auf Lern-App indirekt | Stabiler Alltagsauslöser, flexible Ziele; keine „21-Tage“-Garantie |
| KI-Bewertung | Schnelles formatives Feedback | **K:** stark schwankende Übereinstimmung mit Menschen. Q17 | Sprache, Fach, Rubrik und Modell verändern Ergebnis | Vorschlag mit Belegen; korrigierbar, bei Unsicherheit keine endgültige Wertung |

### Freie Antworten oder Auswahl?

**Freie Antworten** eignen sich, wenn du in der Klausur oder im Gespräch selbst formulieren, begründen oder eine Methode auswählen musst. Die Antwort kann aus drei Stichpunkten oder einer 60–90-sekündigen Erklärung bestehen. Diese Dauer ist eine Gestaltungsidee, kein wissenschaftlicher Optimalwert.

**Auswahlfragen** sind sinnvoll, um typische Fehlvorstellungen, Abgrenzungen und Diagnoseentscheidungen zu prüfen. Sie können anspruchsvoll sein: „Welcher Ansatz passt unter diesen Bedingungen – und warum scheiden zwei Alternativen aus?“ Eine Auswahlentscheidung allein liefert jedoch weniger Nachweis für freie Erklärung.

Gegen reines Wiedererkennen helfen semantisch unterschiedliche Fälle, wechselnde Beispiele, gelegentlich freie Antworten und begründete Entscheidungen. Die Positionen der Optionen werden gemischt und intern über stabile IDs gespeichert. Reine Wortumstellungen zählen nicht als neue Variante. Zahlenvarianten ändern relevante Anforderungen, nicht nur kosmetische Werte. Ein neuer Aufgabentyp wird zunächst eingeführt, nicht überraschend als Wissensverlust bewertet.

### Neue Inhalte und komplexe Leistungen

Ein unbekanntes Thema startet mit einer kompakten, quellengebundenen Erklärung oder einem Lösungsbeispiel. Danach folgt ein erster Abruf; bei Scheitern wird erklärt und vereinfacht. Alte fällige Ziele bleiben parallel im Plan.

Eine vollständige Kampagnenstrategie, argumentative Textanalyse, zusammenhängende Statistikaufgabe, Literaturkritik oder längere mündliche Argumentation darf nicht vollständig in isolierte Karten zerlegt werden. Karten bereiten Teilfertigkeiten vor. Ein wöchentlicher **10–15-minütiger Fallblock** integriert sie; für längere Prüfungsformate muss zusätzlich gelegentlich ein vollständiger Probelauf eingeplant werden. Das 20-Minuten-Budget ersetzt keine Vorlesung, Hausarbeit oder umfassende Prüfungssimulation.

## 4. Wiederholungsmodell

### Algorithmusvergleich

| Ansatz | Funktionsweise | Vorteile | Grenzen / Evidenz | Entscheidung |
|---|---|---|---|---|
| Einfache Regeln | Nach erfolgreichem unabhängigem Abruf nächste Stufe; Fehler lösen Korrektur und frühe erneute Prüfung aus | Verständlich, robust bei wenig Daten, leicht prüfbar | Konkrete Intervalle heuristisch; keine individuelle Gedächtniskurve | **MVP** |
| SM-2 | Bewertungsstufen 0–5, Leichtigkeitsfaktor, anfänglich 1 und 6 Tage, danach Multiplikation | Einfach, dokumentiert, verbreitet | Historisch heuristisch; keine vollständige Budget-/Lernzielplanung | Vergleichsbaseline, kein Grund für zusätzliche MVP-Komplexität |
| FSRS | Modelliert Schwierigkeit, Stabilität und Abrufwahrscheinlichkeit; Zielretention steuert Intervalle | Nutzerdaten können Vorhersagen verbessern; offene Implementierungen | Benchmarks messen überwiegend Abrufprognosen, keine umfassende Prüfungsleistung; gemischte Formate benötigen zusätzliche Modellierung | Später hinter austauschbarer Schnittstelle prüfen |

SM-2-Details stammen aus Wozniaks Originalbeschreibung. [T1](https://super-memory.com/english/ol/sm2.htm) FSRS-Dokumentation, Anki-Handbuch und Benchmark wurden direkt geprüft. Der aktuelle Benchmark führt bereits FSRS-7; das darf nicht mit einer überall ausgelieferten stabilen Version gleichgesetzt werden. Bei Implementierung Version und Parameter festschreiben. [T2](https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm), [T3](https://docs.ankiweb.net/manual/deck-options), [T4](https://github.com/open-spaced-repetition/srs-benchmark)

Die Forschung zu SSP-MMC von Ye, Su & Cao (2022) ist einschlägige Algorithmusforschung im Vokabellernen, aber kein direkter Nachweis für heutiges FSRS in deiner App. [Q18](https://github.com/maimemo/SSP-MMC) Ein niedrigerer Vorhersagefehler bedeutet nicht automatisch besseren Transfer oder mehr Wissen pro Minute.

### Drei Ebenen und getrennte Kompetenznachweise

- **Lernziel:** z. B. „Modell X erklären und gegenüber Y abgrenzen“; besitzt Quelle, Voraussetzungen, Relevanz und Status.
- **Kompetenzspur:** Wiedererkennen, freier Abruf, Erklärung, Anwendung/Transfer. Pro Ziel können mehrere Spuren nötig sein.
- **Aufgabenfamilie und Variante:** Die Familie beschreibt dieselbe Anforderung; die Variante hat einen konkreten Fall, Wortlaut und eine unveränderliche Version.

Jeder Versuch verweist auf alle Ebenen. Ein Erfolg in Wiedererkennen verändert die Anwendungsspur nicht. Ein Fall, der mehrere Ziele umfasst, erhält Teilbewertungen; die Gesamtpunktzahl darf nicht jedem Ziel identisch zugerechnet werden.

### MVP-Regeln – ausdrücklich Heuristiken

Als konfigurierbare Ausgangsfolge dienen **1, 3, 7, 14, 30, 60 Tage** nach qualifizierten Erfolgen. Das sind Beispiele, keine universell optimalen Abstände und keine FSRS-Ausgabe.

Ein qualifizierter Erfolg bedeutet: die Rubrik ist erfüllt, keine Hilfe und kein als Raten markierter Erfolg, gültige Quelle, noch keine Lösung in derselben Sitzung gesehen. Hohe Sicherheit allein zählt nicht. Unsicher, aber sachlich vollständig und unabhängig richtig kann als Erfolg zählen.

| Beobachtung | Sofortige Reaktion | Planung |
|---|---|---|
| Richtig, unabhängig | Kurze Begründung/Quelle optional vertiefen | Eine Stufe weiter, sofern zeitlich unabhängiger Abruf |
| Teilweise richtig | Fehlenden Teil konkret benennen | Spur bleibt offen, frühe erneute Abfrage, z. B. nächster Tag |
| Falsch | Diagnose: Wissen, Voraussetzung oder missverständliche Aufgabe? | Erklärung und später unabhängiger Abruf; wiederholte Fehler führen zur Aufgabenprüfung |
| Richtig geraten | Begründung nachfordern | Nicht als sichere Abrufleistung zählen; freie Variante früh einplanen |
| Mit Hilfe | Hilfestufe und Teilerfolg speichern | Unterstütztes Lernen, keine automatische Stufensteigerung |
| KI unsicher / Nutzer widerspricht | „Bewertung offen“, Rubrikvergleich | Kein negativer Scheduler-Schritt, bis aufgelöst |
| Übersprungen | Grund optional | Kein Fehler; Ziel bleibt planbar |

Antwortdauer dient zunächst nur der **Zeitplanung**. Unterbrechungen, Tippen am iPhone, Barrierefreiheit und Sprechdauer verhindern eine einfache Interpretation als Wissen. Lange Dauer kann eine Nachfrage auslösen, aber keine automatische Abwertung.

### Identische Aufgabe, Variante oder Reparatur

Identische Aufgaben erscheinen erneut, wenn der genaue Inhalt gelernt werden soll und die Aufgabe gültig ist, etwa eine Definition. Bei deutlichem Formulierungswiedererkennen wird eine echte Alternative gewählt. Anwendungen erhalten bevorzugt neue Fälle.

Nach einem Fehler kommt erklärendes Feedback sofort nach dem eigenen Versuch. Eine freiwillige kurze Reparatur kann nach anderen Aufgaben oder am Ende folgen; sie zählt als **unterstützte Korrektur**, nicht als verzögerter Lernerfolg. Ohne genug Abstand entfällt die erneute Abfrage heute. Später folgt eine andere Variante oder dieselbe Aufgabe ohne Hinweis. Geschwistervarianten derselben Anforderung werden innerhalb der Sitzung gesperrt; gezielte Vergleichsaufgaben sind eine ausdrücklich markierte Ausnahme.

### Zeitbudget, Prüfung und Rückstände

Der Plan verwendet ein 20-Minuten-Budget mit kleinen Reserven für Feedback und Abschluss. Er zieht keine neuen Ziele hinzu, wenn die vorhandenen voraussichtlich das Budget füllen. Als anfängliche Aufteilung sind 10 Minuten Wiederholung, 5 Minuten Neues, 3 Minuten Anwendung und 2 Minuten Start/Pause/Abschluss vorgesehen; die Aufteilung ist veränderbar.

Priorität ergibt sich transparent aus Fälligkeit, selbst festgelegter Prüfungsrelevanz, Nähe des Termins, ungelösten Fehlern, Voraussetzungen und bisheriger Vernachlässigung. Kurze Aufgaben werden nicht allein wegen ihrer Länge bevorzugt. Längere Anwendungsblöcke bekommen feste Plätze.

Mindestens ein kleiner Wochenanteil bleibt für aktive, weniger dringliche Themen reserviert. Ein Lernziel, das wiederholt verdrängt wurde, steigt in der Priorität. Wenn der Bedarf dennoch dauerhaft über 140 Minuten pro Woche liegt, zeigt die App: „Mit diesem Budget bleiben diese Ziele unbearbeitet.“ Dann werden aktiv Umfang, Zielniveau oder Zeit angepasst; kein Algorithmus löst die Kapazitätsgrenze.

Nach verpassten Tagen bleiben tatsächliche Zeitstempel und Fälligkeiten erhalten. Keine pauschalen Minuspunkte, keine künstlich vervielfachten Karten. Die nächste Sitzung beginnt mit wenigen diagnostischen Abrufen; neue Inhalte werden vorübergehend reduziert. Vor Prüfungen gibt es zusätzliche prüfungsähnliche Stichproben, ohne alle Langzeitintervalle dauerhaft auf einen Tag zu setzen. Nach der Prüfung bleiben ausgewählte Kernziele aktiv; anderes wird bewusst archiviert.

### Verständlicher Pseudocode

```text
plane_sitzung(person, jetzt, budget = 20 Minuten):
    kandidaten = gültige, freigegebene Aufgaben aktiver Lernziele
    entferne gesperrte, widersprüchliche und bereits beantwortete Geschwister
    reserviere Zeit für Feedback, Abschluss und ggf. Wochen-Fallblock

    für jede Lernziel-Kompetenzspur:
        ermittle Fälligkeit aus tatsächlichen Lernereignissen
        berechne Priorität aus:
            Fälligkeit + Prüfungsrelevanz + Terminnähe
            + ungeklärten Fehlern + Voraussetzungslücken
            + Vernachlässigung
        wähle passende Variante ohne kürzlich enthüllte Lösung

    plane zunächst geschützte Wochenabdeckung
    ergänze nach Priorität, solange geschätzte Gesamtdauer passt
    ergänze Neues nur bei freier Kapazität und erfüllten Voraussetzungen
    wenn Bedarf zu hoch: zeige Abdeckungslücke statt Überlastungsauftrag
    gib endlichen Plan zurück

verarbeite_antwort(versuch):
    speichere Antwort, Variante, Version, Hilfe, Sicherheit und aktive Zeit
    ermittle Rubrikbewertung oder lasse sie offen
    bei umstrittener/unsicherer Bewertung:
        speichere Klärfall; Scheduler unverändert
    sonst bei qualifiziertem, unabhängigem Erfolg:
        aktualisiere ausschließlich geprüfte Kompetenzspuren
        erhöhe Regelstufe; setze Fälligkeit ab tatsächlichem Versuch
    sonst:
        zeige gezielte Korrektur
        plane frühen unabhängigen Neuversuch
        bei wiederholtem Scheitern: prüfe Voraussetzung und Aufgabenqualität
    sperre Geschwister für diese Sitzung
    protokolliere Scheduler-Version und Entscheidungsgrund

korrigiere_bewertung(versuch, neue_bewertung):
    füge unveränderliches Korrekturereignis hinzu
    berechne betroffene Zustände aus Historie erneut
    zeige Auswirkung auf Fälligkeit
```

### Vier Wochen – illustrative Lernhistorie eines Ziels

Annahme: Ziel A verlangt freie Erklärung; Zielspur B verlangt Anwendung auf einen Fall. Alle Tage und Abstände sind Beispiele.

| Tag | Ereignis | Ergebnis | Konsequenz |
|---|---|---|---|
| 1 | Neue Quelle, Beispiel, freie Erklärung A | Teilweise, mit Hinweis | Keine Beherrschung; Korrektur, A an Tag 2 |
| 2 | A ohne Hinweis | Richtig | Regelstufe 1, A an Tag 3 |
| 3 | A in anderer Formulierung | Richtig | Nächster Abstand 3 Tage, Tag 6 |
| 4 | Neue Fallaufgabe B | Falsch, Modell verwechselt | Vergleichsbeispiel, B an Tag 5; A unverändert |
| 5 | Neuer einfacher Fall B | Mit Hilfe richtig | Weiter offen, B an Tag 6 |
| 6 | B frei richtig; A korrekt erklärt | Beide unabhängig | B an Tag 7; A nach 7 Tagen an Tag 13 |
| 7 | B in neuem Fall | Richtig | B an Tag 10 |
| 8–9 | Andere Ziele | Keine neuen Versuche A/B | Keine künstlichen Aktivitäten |
| 10–11 | Lernen ausgelassen | — | Fälligkeit B bleibt Tag 10 |
| 12 | Rückkehr, B | Teilrichtig | Feedback; B an Tag 13, kein Schuldhinweis |
| 13 | A richtig; B richtig | Unabhängig | A nach 14 Tagen an Tag 27; B konservativ an Tag 14 |
| 14 | B richtig | Unabhängig | B an Tag 17 |
| 15–16 | Andere Ziele | — | Zeit bleibt für andere Themen |
| 17 | B neuer Fall | Richtig | B an Tag 24 |
| 18 | Unterlage zu A präzisiert | Fachlich relevante Änderung | Alte Historie bleibt; A-Version erneuern und neu verifizieren |
| 19 | A mit geänderter Kernaussage | Teilweise | Neue Passage lernen; A an Tag 20 |
| 20 | A unabhängig | Richtig | Neustart betroffener Spur, Tag 21 |
| 21 | A richtig | Unabhängig | A an Tag 24 |
| 22–23 | Andere Ziele | — | Kein automatischer Reset von B |
| 24 | A richtig; B Transfer auf neuen Kontext | A richtig, B teilweise | A an Tag 31; B neue Transferanforderung separat nacharbeiten |
| 25 | Transfer B nach Erklärung | Richtig | Nächste unabhängige Prüfung an Tag 26 |
| 26 | B neuer Transferfall | Richtig | B an Tag 29 |
| 27–28 | Wochenrückblick / andere Ziele | — | Frühere A-Fälligkeit Tag 27 ist durch Änderung ersetzt; Historie nachvollziehbar |

Ein in Woche 4 erstmals gelöster Transferfall rechtfertigt die Anzeige „einmal selbstständig angewendet“, nicht „dauerhaft beherrscht“.

## 5. Wöchentliche Materialupdates und Fragenqualität

### Ablauf vom Dokument zur freigegebenen Aufgabe

| Schritt | Verarbeitung | Prüfschranke |
|---|---|---|
| Upload | Originaldatei, Dateityp, Datum, Kurs, Version, Hash speichern | Dateigröße/-typ prüfen; identischer Hash erzeugt keinen zweiten Import |
| Extraktion | Textschicht zuerst; OCR nur bei Bedarf; Seitenbilder und Layoutanker erhalten | Unlesbare Passagen, abgeschnittene Tabellen, unsichere Formeln markieren |
| Struktur | Abschnitte, Begriffe, Lernziele, Aufgaben und Voraussetzungen vorschlagen | Lernziel muss durch Fundstelle oder expliziten Nutzerauftrag gedeckt sein |
| Bestandsabgleich | Hashes, Textvergleich und semantische Ähnlichkeit als Kandidatensuche | Ähnlichkeit allein entscheidet nicht über Identität oder Wahrheit |
| Änderungsprüfung | „Neu“, „ergänzt“, „korrigiert“, „widersprüchlich“, „nur Format“ | Inhaltliche Konflikte blockieren betroffene Aufgaben |
| Generierung | Frage, Kompetenzspur, Rubrik, Musterlösung, Fehlvorstellungen, Zeitannahme | Quelle muss die Lösung tragen; externe Ergänzungen separat kennzeichnen |
| Qualitätsprüfung | Schema, Quellenanker, Lösbarkeit, Eindeutigkeit, Rechenprüfung, Duplikate | Ein zweites KI-Urteil allein ist keine unabhängige Wahrheitsgarantie |
| Freigabe | Nutzer sieht eine kleine Änderungsübersicht mit Quellenvergleich | Im MVP jede neue Familie und fachliche Änderung ausdrücklich freigeben |
| Planung | Aktive gültige Version wird für passende Lernziele verfügbar | Entwurf oder gesperrte Quelle erscheint nie im Lernfeed |

**MVP-Umfang beim Import:** zunächst PDFs und Text-/Markdown-Notizen. Präsentationen können als PDF hochgeladen werden; native PowerPoint- und Handschriftverarbeitung folgen später. Bildseiten werden verarbeitet oder klar als nicht sicher auswertbar zurückgegeben. Keine stillschweigende Behauptung, jedes Dateiformat zu beherrschen.

### Quellen und Änderungen

Jede Aufgabe enthält mindestens Dokument-ID, unveränderliche Dokumentversion, Dateihash, PDF-Seitenindex, gegebenenfalls gedruckte Seitenzahl, Abschnitt und relevante Textstelle. Für Grafiken kommen Bildausschnitt und Koordinaten hinzu. Der Nutzer kann die Originalstelle öffnen. Eine Seitenangabe ohne tatsächlich vorhandene Passage genügt nicht.

- **Identischer Upload:** vorhandenes Dokument anzeigen, kein erneutes Generieren.
- **Gleicher Inhalt in anderen Folien:** zusätzliche Quellenverknüpfung statt doppelter Aufgabe.
- **Nur sprachliche Überarbeitung:** neue Aufgabenrevision, Historie und Kompetenzstand bleiben.
- **Neue fachliche Anforderung:** neue oder erweiterte Kompetenzspur; kein Transfer einer alten Erfolgsserie ohne Prüfung.
- **Korrigierte Musterlösung:** alte Version schließen; betroffene Bewertungen als „nach alter Lösung“ markieren und aktuelle Spur zur Verifikation einplanen.
- **Widerspruch:** beide Fundstellen nebeneinander; neuestes Uploaddatum ist kein Wahrheitsbeweis. Auswahl durch Nutzer, gegebenenfalls Rückfrage an Lehrperson außerhalb der App.
- **Unlesbare Formel:** keine Rekonstruktion aus allgemeinem Modellwissen; Nutzer korrigiert Extraktion oder lädt eine bessere Datei hoch.
- **Fehlende Information:** Aufgabe nicht erzeugen oder ausdrücklich als unvollständig markieren.
- **Externe Ergänzung:** eigener Herkunftstyp mit Link und Datum; nicht automatisch prüfungsrelevant.

Dokumente und Antworten werden als Daten behandelt. Anweisungen innerhalb einer hochgeladenen Datei dürfen keine Systemregeln, Quellenprüfung oder Freigabe umgehen.

### Mindestqualität einer Aufgabe

Eine freigegebene Aufgabe prüft ein benanntes Lernziel auf einer benannten Stufe. Der Arbeitsauftrag sagt, was erwartet wird: etwa „Nenne zwei Merkmale und begründe eine Abgrenzung“. Musterlösungen enthalten die notwendigen Kernaussagen, erlaubte Alternativen und Teilpunktregeln. Eine sprachlich elegantere Antwort ist nicht automatisch sachlich besser.

Für Auswahlfragen sind Distraktoren fachlich plausible typische Fehler, nicht offenkundiger Unsinn. Optionen sollen ähnlich präzise und sprachlich vergleichbar sein; keine verräterische Länge, Grammatik oder stets gleiche Position. Bei Multiple-Choice ist klar, ob mehrere Antworten richtig sind und wie Teilpunkte entstehen. Eine begründete falsche Option soll diagnostisch auswertbar sein.

Feedback nennt zuerst den konkreten Treffer oder Fehler, erklärt den relevanten Unterschied und zeigt die Quellenstelle. Bei Rechenaufgaben werden Ansatz, Zwischenschritte, Einheiten und Ergebnis getrennt betrachtet. Zahlen müssen unabhängig nachgerechnet werden; ein Sprachmodell allein ist kein Rechenprüfer.

Jede Familie braucht mindestens einen Test mit einer richtigen, einer plausibel falschen und einer teilrichtigen Antwort. Bei offenen Fragen kommt eine korrekt paraphrasierte Antwort hinzu. Das prüft die Bewertung, nicht die allgemeine Lernwirksamkeit.

### KI bewertet als Assistent

Die Forschung zu automatischer Bewertung zeigt große Unterschiede zwischen Aufgaben und Modellen; hohe Korrelation mit menschlichen Noten garantiert nicht die Korrektheit einer einzelnen Bewertung. [Q17](https://doi.org/10.3390/app15105683)

Deshalb besteht die Bewertung aus Rubrikpunkten mit Antwortbelegen, fehlenden Punkten und erkannten Widersprüchen. „Nicht sicher beurteilbar“ ist ein erlaubtes Ergebnis. Bloßes Stichwortmatching genügt nicht. Bei Interpretation und Argumentation können mehrere Lösungen richtig sein; die KI darf keinen einzigen Mustertext erzwingen.

Der Nutzer kann „Bewertung stimmt nicht“ wählen, jeden Rubrikpunkt korrigieren und eine Begründung ergänzen. Originalurteil und Korrektur bleiben als Ereignisse erhalten. Eine korrigierte Bewertung aktualisiert den Plan nachvollziehbar; sie löscht nicht den früheren Versuch. Unsichere Bewertungen belasten den Lernstand nicht automatisch.

Im MVP reicht für Sprechaufgaben **laut antworten und anschließend anhand einer Rubrik selbst prüfen**. Aufnahme und automatische Transkription sind spätere Optionen. Selbstbewertung ist dann entsprechend gekennzeichnet und schwächer als ein unabhängig überprüfter Nachweis.

### Bearbeiten, Melden, Aussetzen, Löschen

Bearbeiten erzeugt eine neue Revision. Melden sperrt bei fachlichen Problemen die betroffene Aufgabe bis zur Klärung. Aussetzen entfernt sie aus der Planung, erhält aber die Daten. Normales Löschen archiviert die Aufgabe und erklärt, dass historische Versuche erhalten bleiben. Eine gesonderte endgültige Löschfunktion entfernt persönliche Inhalte und zugehörige Dateien; ein minimales technisches Löschereignis darf ohne Antwortinhalt bleiben. Historienerhalt darf kein Vorwand sein, ausdrücklich gewünschte Datenlöschung zu verhindern.

## 6. Feed, Motivation, Pausen und Unterhaltung

Die Feed-Oberfläche ist ein Bedienmodell, keine nachgewiesene Lernmethode. Wischen bedeutet „weiter“ oder „überspringen“, niemals automatisch „gewusst“. Zusätzlich gibt es sichtbare Schaltflächen für Touch, Tastatur und Screenreader. Die Antwort wird bewusst abgeschickt, die Lösung anschließend angezeigt; versehentliches Wischen vernichtet keine Eingabe.

### 16 konkrete Ideen

Bewertungen sind Produktschätzungen. „Evidenz“ bezieht sich entweder auf die zugrunde liegende Lernmethode oder ausdrücklich nur auf eine Hypothese; kein UI-Element gilt dadurch als experimentell bewiesen.

| Idee | Lernnutzen | Motivation | Ablenkungsrisiko | Aufwand | Evidenz / V1 |
|---|---|---|---|---|---|
| 1. Tageswahl 5/10/20 Minuten | Indirekt: realistische Planung | Hoch plausibel | Niedrig | Niedrig | P; **V1** |
| 2. Endlicher Block mit Abschluss | Indirekt: begrenzte Belastung | Hoch plausibel | Niedrig | Niedrig | P/H; **V1** |
| 3. Freie Stichpunkte vor Lösung | Hoch für passenden Abruf | Mittel | Niedrig | Mittel | G/K, Q2; **V1** |
| 4. 60–90 Sekunden laut erklären | Hoch für mündliches Üben plausibel | Mittel | Niedrig | Niedrig ohne Aufnahme | K/P, Q7; **V1** |
| 5. „Warum ist diese Alternative falsch?“ | Unterscheidung/Erklärung | Mittel | Niedrig | Mittel | K/P, Q9/Q10; **V1** |
| 6. Fehlerdetektiv im Fallbeispiel | Anwendung und Diagnose | Hoch plausibel | Niedrig | Mittel | P, Methode anschlussfähig; später |
| 7. Vergleich zweier Modelle | Verwechslungen erkennen | Mittel | Niedrig | Mittel | K, Q9; **V1 als Aufgabenform** |
| 8. Mini-Kampagnenentscheidung | Transfer | Hoch plausibel | Mittel | Mittel | P/H; **V1 einfacher Falltext** |
| 9. Wochenfall als „Challenge“ | Integration | Mittel bis hoch | Niedrig | Mittel | P, Q13; **V1** |
| 10. Fortschritt nach Kompetenzspur | Keine Scheinbeherrschung | Hoch plausibel | Niedrig | Mittel | P; **V1** |
| 11. Wochenziel statt Pflichtstreak | Nutzung ohne Schuld | Hoch plausibel | Niedrig | Niedrig | P, Q14; **V1** |
| 12. Ruhige Pause mit Blickwechsel | Erholung | Mittel | Sehr niedrig | Niedrig | K/P, Q3; **V1 optional** |
| 13. Kurz aufstehen/bewegen | Erholung plausibel | Mittel | Niedrig | Niedrig | Konkrete Lernwirkung hier ungeprüft; optionaler Text |
| 14. Thematisches Zuordnungsrätsel | Abruf/Unterscheidung, wenn echt gefordert | Hoch plausibel | Mittel | Mittel | K/P, Q15; später |
| 15. Kuratiertes Fachvideo mit Abruffrage | Erklärung, wenn erforderlich | Mittel | Mittel bis hoch | Mittel | P/H für dieses Produkt; später |
| 16. Persönliche Shorts-/Unterhaltungspause | Kein direkter Zielbeitrag | Kurzfristig attraktiv | Hoch | Hoch bei Integration | Keine Wirksamkeitsbasis; **zurückstellen** |

Die erste Version bündelt wenige Mechaniken: endlicher Plan, freie Antworten, mündliche Rubrikaufgabe, begründete Auswahl, ein Fallformat, ehrlicher Fortschritt und freiwillige Pause. Die Tabelle beschreibt Ideen, nicht 16 eigenständige Pflichtfunktionen.

### Pausen und Rückkehr

Nach einem inhaltlichen Block oder bei gemeldeter Ermüdung bietet die App eine kurze Pause an, z. B. eine Minute. Dauer und Zeitpunkt sind frei veränderbare Heuristiken. Kein Alarm unterbricht eine zusammenhängende Argumentation. Aufstehen, aus dem Fenster schauen oder ruhig sitzen sind einfache Optionen; ein weiterer Bildschirmreiz ist nicht nötig.

Vor der Pause steht eine Rückkehrnotiz: „Als Nächstes: das Modell auf einen neuen Fall anwenden.“ Danach bringt ein großer Knopf genau zu dieser Aufgabe zurück. Bei längerer Abwesenheit wird der verbleibende Umfang angepasst. Das ist eine testbare Gestaltungsidee, kein direkter Schluss aus Chiossis Experiment.

Fortschritt heißt beispielsweise „4 Ziele diese Woche nach mehreren Tagen frei erklärt; 2 Anwendungsspuren noch offen“. Ein exakter Prozentwert für „Wissen“ wird vermieden. Verpasste Tage erzeugen einen normalen Wiedereinstieg.

### YouTube: tatsächlich möglich und nicht vorauszusetzen

Die IFrame-API erlaubt die Einbettung konkreter Videos und Playlists sowie Ereignisse wie das Wiedergabeende. Für iOS ist Inline-Wiedergabe konfigurierbar. `rel=0` schaltet verwandte Videos **nicht** aus, sondern beschränkt sie auf denselben Kanal; `modestbranding` hat keine Wirkung mehr. [T5](https://developers.google.com/youtube/player_parameters), [T6](https://developers.google.com/youtube/iframe_api_reference)

Die geprüfte Data-API-Referenz bietet Ressourcen wie Suche, Videos und Playlists, aber keinen dokumentierten Zugriff auf deinen persönlichen Startseiten-/Shorts-Empfehlungsfeed. Ein solcher Zugriff wird daher nicht geplant. Ein einzelnes einbettbares Short kann über seine Video-ID behandelt werden; Verfügbarkeit und Freigabe sind pro Video zu prüfen, nicht pauschal zu garantieren. [T7](https://developers.google.com/youtube/data/reference/rest)

Falls später umgesetzt: nur bewusst ausgewählte Links, Laden erst nach Nutzeraktion, kein Autoplay, Rückkehrknopf außerhalb des Players, Lernfortschritt vorher speichern. Das Ende-Ereignis kann eine Rückkehr anbieten, aber externe Navigation oder App-Wechsel nicht zuverlässig verhindern. Gesperrte, entfernte oder altersbeschränkte Videos benötigen einen Text-/Bildersatz.

Der erweiterte Datenschutzmodus reduziert die Personalisierungswirkung eingebetteter Aufrufe; er bedeutet nicht, dass keinerlei Daten an Google übertragen werden. [T8](https://support.google.com/youtube/answer/171780) Empfehlung: zunächst selbst enthaltene Erklärung mit Grafik oder ein fachlicher Link nach Sitzungsende. Unterhaltung ist freiwillige Freizeit, kein Bestandteil des adaptiven Lernplans.

## 7. Ein typischer Tag und eine typische Woche

### Tag mit 20 Minuten

| Zeit | Erlebnis |
|---|---|
| 0:00–0:30 | „Heute 20 Minuten?“; optional „wenig Energie“ oder kürzerer Plan |
| 0:30–9:30 | Fällige freie Antworten und gezielte Auswahl mit kurzen Begründungen |
| 9:30–10:30 | Freiwilliger Blickwechsel; sonst ruhiger Übergang |
| 10:30–15:00 | Neues Lernziel anhand Quelle/Beispiel kennenlernen und erstmals abrufen |
| 15:00–19:00 | Eine kurze mündliche Erklärung oder ein neuer Fall |
| 19:00–20:00 | Korrektur klären, ehrlicher Abschluss, nächste Lerngelegenheit anzeigen |

Die Anzahl der Karten ist offen. Eine gründliche Vier-Minuten-Aufgabe ist nicht schlechter als sechs schnelle Klicks. Feedbackzeit zählt mit. Bei vielen fälligen Zielen ersetzt Wiederholung den Neublock; bei einer Fallwoche ersetzt der zusammenhängende Fall mehrere Kurzaufgaben.

### Woche innerhalb von ungefähr 140 Minuten

- **Montag, 20 Minuten:** 5 Minuten Materialübersicht und Freigabe einer kleinen Charge; 10 Minuten Wiederholung; 5 Minuten Einführung.
- **Dienstag, 20 Minuten:** regulärer Plan mit kurzer mündlicher Erklärung.
- **Mittwoch, 20 Minuten:** Wiederholung und gezielter Vergleich verwechselbarer Konzepte.
- **Donnerstag, 20 Minuten:** 5 Minuten Wiederholung, 12 Minuten zusammenhängender Fall, 3 Minuten Feedback.
- **Freitag, 20 Minuten:** regulärer Plan; kleine Fehlerkorrektur.
- **Samstag, 20 Minuten:** 8 Minuten verzögerter Test oder Prüfungssimulation, 12 Minuten Lernen/Feedback.
- **Sonntag, bis 20 Minuten:** Wochenrückblick, Materialkonflikte, freiwillige Erhaltung älterer Kernthemen.

Das ist ein Muster, keine Pflichtserie. Bei Ausfall wird nicht am Folgetag eine 40-Minuten-Schuld aufgebaut. Wenn Materialfreigabe dauerhaft mehr Zeit braucht, wird die Zahl automatisch generierter Aufgaben reduziert. Die App darf nicht mehr Verwaltungsarbeit erzeugen, als sie Lernzeit spart.

## 8. Technische Optionen und tatsächliche Sites-Fähigkeiten

Responsive Website und PWA sind keine vollständig getrennten Welten: Eine PWA ist eine Web-App mit zusätzlichen Installations- und gegebenenfalls Offline-Funktionen. Sites bezeichnet eine Entwicklungs-/Hostingumgebung und kann Web-Erlebnisse bereitstellen.

| Aspekt | Responsive Website | Installierbare PWA | Native / plattformübergreifend | Sites in dieser Umgebung |
|---|---|---|---|---|
| iPhone, Tablet, Computer | Ein Browserzugang | Gleiche Webbasis, Startsymbol | Mobile Apps plus separate/zusätzliche Weboberfläche | Webzugang; mobile Gestaltung selbst umsetzen |
| Installation | Nicht erforderlich | Auf Startbildschirm möglich | Store-/Testdistribution | PWA-Eigenschaften nicht automatisch nachgewiesen |
| Anmeldung | Externer/verwalteter Auth-Dienst | Wie Website | Plattform-/Backendintegration | ChatGPT-Anmeldung und private Zugriffsregeln dokumentiert |
| Sync | Backend nötig | Backend plus lokale Warteschlange | Ebenfalls Backend nötig | D1 kann zentral speichern; Sync-Logik ist App-Arbeit |
| Datenbank / Dateien | Dienst frei wählbar | Gleich | Gleich | D1 / R2 laut installierter Anleitung |
| KI-Verarbeitung | Serverseitiger Dienst | Online serverseitig | Online oder gesondertes lokales Modell | HTTP-Dienste/Secrets möglich; keine fertige OCR-/Bewertungsfunktion belegt |
| Offline | Ohne Zusatzarbeit eingeschränkt | Service Worker + IndexedDB implementierbar | Gute lokale Möglichkeiten, trotzdem Aufwand | Muss mit privater Anmeldung/Hostingroute praktisch geprüft werden |
| Erinnerungen | Browserabhängig | iPhone-Push für Home-Screen-Web-App mit Erlaubnis | Native Benachrichtigungen | Plattform-Push für diese App nicht automatisch gegeben |
| Wartung | Eine Webbasis | Zusätzlich Cache-/Sync-Versionen | OS-/SDK-/Storepflege | Runtime-/Plattformabhängigkeit plus eigener App-Code |
| Export / Backup | Selbst planen | Selbst planen | Selbst planen | Quellcodeversion ist kein Datenbank-/Dateibackup |

Apple dokumentiert Web Push ab iOS/iPadOS 16.4 für zum Home-Bildschirm hinzugefügte Web-Apps; die Erlaubnis muss im passenden Nutzerkontext angefragt werden. Android/Chromium bietet andere Installationsoberflächen und Browser-Push. Es wird keine identische Hintergrundausführung auf allen Geräten vorausgesetzt. [T9](https://webkit.org/blog/13878/), [T10](https://web.dev/learn/pwa/installation)

IndexedDB ist für lokale strukturierte Daten, Cache Storage für Ressourcen geeignet. Lokaler Speicher kann verloren gehen und ist kein Ersatz für serverseitige Sicherung. [T11](https://web.dev/learn/pwa/offline-data) Für zuverlässige Nutzung wird beim Öffnen und Zurückkehren synchronisiert, zusätzlich zu etwaigen Hintergrundmöglichkeiten.

### Was hier für Sites verifiziert wurde

Die installierte Sites-Anleitung, ihre Speicher- und Identitätsreferenzen sowie die verfügbaren Werkzeugschemata wurden gelesen. Dokumentiert sind privates Hosting, Versionen/Deployments, serverseitige Funktionen in Cloudflare Workers, D1-Daten, R2-Dateien, Secrets, Quellcodeablage und ChatGPT-Anmeldung. Worker-Code unterliegt laut lokaler Anleitung 128 MB Speicher und HTTP-basierten externen Verbindungen. Das spricht für ausgelagerte oder kleinteilige OCR-/KI-Jobs statt langer Vollverarbeitung großer Scans im Request.

Die öffentliche Sites-Dokumentation nennt 10 GB D1-Speicher pro Site und für R2 kein festes Speicherlimit; Nutzung bleibt kosten- und plangebunden. [T12](https://learn.chatgpt.com/docs/sites)

**Nicht praktisch verifiziert:** eine Lern-App auf Sites, deren Offline-Start nach Anmeldung, Service-Worker-Scope, Web-Push, automatischer vollständiger Restore, Langzeitverfügbarkeit und konkrete Kontingente deines Kontos. Es wurde absichtlich keine Site angelegt und keine Software entwickelt. Dokumentierte Bausteine sind keine getestete End-to-End-Funktion.

### Architekturentscheidung für zunächst eine Person

**Standardempfehlung:** eine kleine PWA, ein verwaltetes Backend mit PostgreSQL, Anmeldung und privatem Objektspeicher, eine serverseitige Jobverarbeitung für Extraktion und KI. Supabase ist hierfür eine konkret geprüfte Option; die Anbieterwahl bleibt austauschbar. Ein zusätzlicher Vektor-Datenbankanbieter oder ein eigener Servercluster ist für den Start unnötig.

1. **PWA:** Feed, Quellenansicht, Importprüfung, Rubrikbewertung und Fortschritt; lokaler vorbereiteter Tagesplan.
2. **Backend:** Benutzerautorisierung, Datenzugriff, Ereignisannahme, Planung, Export.
3. **Datenbank:** Quellenmetadaten, Lernziele, Versionen, Versuche, Bewertungen, Planungszustände.
4. **Objektspeicher:** Originale, Extraktionsartefakte und benötigte Grafiken; private, kurzlebige Abruflinks.
5. **Jobtabelle:** Uploadstatus, Extraktion, Generierung, Prüfung, Fehler und Wiederaufnahme; idempotente Jobs.
6. **KI-Adapter:** austauschbarer Anbieter, Modell-/Promptversionen, strukturiertes Ergebnis, Nutzungsprotokoll und Kostenbegrenzung.
7. **Backup/Export:** unabhängige Kopie von Datenbank und Dateien; regelmäßiger Restore-Test.

Supabase dokumentiert PostgreSQL als Grundlage von Auth, Storage, Realtime und Funktionen. [T13](https://supabase.com/docs/guides/database/overview) Die eigentliche App kann Synchronisation zunächst mit normalen API-Aufrufen umsetzen; ein dauerhafter Echtzeitkanal ist für eine Person nicht nötig.

**Sites-Alternative:** dieselben logischen Entitäten in D1, Originale in R2, Anmeldung über Sites. Für diese Variante wird kein zusätzliches Supabase-Auth-System eingebaut. Vor Auswahl müssen Offline-Pilot, Export und künftige Kontingente passen. Bei höherem Gewicht auf unkomplizierte Erstellung kann Sites sinnvoll sein; für drei bis fünf Jahre ist der portable Standardpfad derzeit besser kalkulierbar.

### Offline und Konflikte

Der Nutzer kann einen Tagesplan mit Lösungen und Quellenfragmenten herunterladen. Offene Antworten werden offline selbst anhand der Rubrik bewertet; KI-Feedback wartet bis zur Verbindung. Upload/OCR laufen online.

Jeder Versuch erhält eine global eindeutige Ereignis-ID und Gerätekennung. Wiederholtes Senden desselben Ereignisses erzeugt keinen zweiten Versuch. Gleichzeitige echte Versuche auf zwei Geräten bleiben erhalten, werden aber als zeitnah/abhängig markiert und nicht wie zwei unabhängige Lerntage gezählt. Die Serverplanung ist maßgeblich; die lokale Vorschau wird nach Synchronisation aktualisiert.

Quellen- und Aufgabenänderungen werden nicht per „letzter Schreibzugriff gewinnt“ über die Historie geschrieben. Konflikte benötigen Versionsvergleich. Ein Offlineversuch zur inzwischen zurückgezogenen Aufgabe bleibt dokumentiert, verändert aber die aktuelle Kompetenz nicht unbesehen.

### Langfristige Datenmenge, Sicherung und Anbieterwechsel

Planungsszenario, keine Prognose über deine Dateien: 100 neue Seiten pro Woche × 40 Studienwochen × 5 Jahre = 20.000 Seiten. Bei 0,5–2 MB je Seite entstehen etwa 10–40 GB Originalmaterial; Extrakte, Versionen und Backups kommen hinzu. 30 Lernereignisse pro Tag über fünf Jahre ergeben rund 54.750 Ereignisse. Die Rohereignisse sind klein; lange Antworten, Bilder und Kopien treiben die Größe.

Exportpaket: versioniertes Manifest, JSONL für Ereignisse, CSV/JSON für Stammdaten, sämtliche Dokumentversionen und Dateien, Quellenanker, Rubriken, Modell-/Scheduler-Versionen sowie Prüfsummen. Anki-kompatible Karten können ein Zusatzexport sein, ersetzen aber nicht dieses vollständige Format.

Täglich Daten sichern, neue Originaldateien unmittelbar in eine zweite unabhängige Sicherung übernehmen, wöchentlich vollständigen Export anbieten und quartalsweise einen Restore in eine leere Testumgebung prüfen. Zielwerte: höchstens ein Tag Verlust bei Serverdaten, Wiederanlauf innerhalb eines Arbeitstags; diese Werte sind zu testende Betriebsanforderungen.

Supabase-Datenbankbackups enthalten **nicht** die eigentlichen Storage-Dateien. Diese müssen zusätzlich gesichert werden. [T14](https://supabase.com/docs/guides/platform/backups) Ein Versionsrollback des App-Codes ersetzt ebenfalls kein Datenrestore.

### Aufwand und laufende Kosten

Preisabruf: **30.10.2026**, USD-Listenpreise, ohne Steuern und Wechselkursannahme. Anbieterpreise sind verifiziert; Arbeitszeit und Verbrauch sind Schätzungen.

| Baustein | Offizieller Bezug | Planungsannahme |
|---|---|---|
| Supabase Pro | Ab 25 USD/Monat; erstes Projekt mit üblicher Micro-Konfiguration, 8 GB DB, 100 GB Dateispeicher, tägliche DB-Backups 7 Tage | 25 USD/Monat bei Einpersonennutzung innerhalb der Limits |
| Cloudflare Workers Paid als Hosting/API-Option | Grundpreis 5 USD/Monat; statische Requests gesondert kostenlos | 5 USD/Monat bei kleinem Verbrauch |
| R2 als unabhängige Dateikopie | Standard 0,015 USD/GB-Monat; 10 GB-Monate frei, Operationen separat | Speicher von einigen zehn GB typischerweise unter wenigen USD; Backupversionen mitzählen |
| KI-Kalkulationsmodell GPT-5.6 Terra | 2 USD/Mio. Eingabetokens, 12 USD/Mio. Ausgabetokens bei Standardkontext | Nur Rechenreferenz, Modellqualität muss separat geprüft werden |
| Domain | Nicht erforderlich; kein konkreter Tarif geprüft | Optionaler eigener Kostenposten |
| OCR-Dienst | Noch nicht ausgewählt und nicht bepreist | Erst 20–50 echte Seiten benchmarken; eigenes Budget zusätzlich |

Quellen: [Supabase-Preise](https://supabase.com/pricing), [Workers-Preise](https://developers.cloudflare.com/workers/platform/pricing/), [R2-Preise](https://developers.cloudflare.com/r2/pricing/), [OpenAI-Modellpreise](https://developers.openai.com/api/docs/models/gpt-5.6-terra).

Beispielhafte KI-Monatsrechnung: 400 Seiten × 1.000 Tokens × 3 Verarbeitungspässe = 1,2 Mio. Eingabetokens; 600 Bewertungen × 1.500 Eingabetokens = 0,9 Mio.; insgesamt 2,1 Mio. Eingabetokens. Bei 0,25 Mio. Ausgabetokens ergibt das **2,1 × 2 + 0,25 × 12 = 7,20 USD**. Bildverarbeitung, zusätzliche Reasoning-Ausgabe, Fehlversuche, lange Quellenkontexte und OCR sind darin nicht belastbar abgebildet. Deshalb zunächst **10–40 USD KI-Budget** als betrieblicher Puffer, kein Preisversprechen.

Der Standardpfad liegt damit als Planungsrahmen bei etwa **40–80 USD monatlich plus eventuelle OCR-/Domainkosten**, bestehende ChatGPT-Abos und Entwicklung nicht eingerechnet. Kostenalarme bleiben sinnvoll, auch wenn Budget kein Hauptkriterium ist.

Sites-Hosting ist laut aktuell geöffneter Dokumentation bis 31.12.2026 kostenlos. Für 2027 sind ungefähre Credit-Raten angekündigt, noch als vorgeschlagen bezeichnet. Beispiel: Datenbank-Site 25 Credits + 0,1 GiB DB × 150 + 10 GiB Dateien × 3,75 + 10.000 Requests × 16/100.000 = **79,1 Credits/Monat vor Planfreibetrag**. Die konkrete Umrechnung und dein Freibetrag wurden nicht festgestellt; eine feste Eurozahl wäre erfunden. Das ist keine Zusage kostenloser mehrjähriger Nutzung. [Sites-Preise](https://learn.chatgpt.com/docs/sites)

Arbeitsaufwand als grobe Schätzung für eine erfahrene umsetzende Person mit KI-Unterstützung: 8–15 Personentage für einen online nutzbaren Kern; weitere 5–10 für robusten Offlinebetrieb, Sync, Restore und gründliche Qualitätsprüfung; zusammen **13–25 Personentage**, abhängig von Materialqualität und Umfang. Wartung zunächst etwa 1–3 Stunden monatlich plus vierteljährlichem Restore-/Updateblock; größere Plattform- oder Modelländerungen zusätzlich. Das sind keine Anbieterangebote.

## 9. Priorisierung, Risiken und offene Entscheidungen

### Erste Version

**Unverzichtbar:** private Anmeldung; versionierter PDF-/Textimport; Quellenansicht; manuelle Freigabe; Lernziel-/Kompetenzmodell; freie Kurzantwort, Sprech-Rubrik, begründete Auswahl und einfacher Fall; endlicher Tagesplan; Regel-Scheduler; korrigierbare Bewertung; Ereignishistorie; Geräteabgleich; vollständiger Export und Wiederherstellbarkeit.

**Vor regulärer mobiler Nutzung ergänzen:** installierbare Oberfläche, vorbereitetes Offline-Tagespaket, idempotente Synchronisation, klare Offlineanzeige und Wiederaufnahme. Online-Pilot und produktionsreife erste Version werden damit ausdrücklich unterschieden.

**Danach:** FSRS-Pilot für vergleichbare Abrufaufgaben, Audioaufnahme/Transkription, anspruchsvollere Rechenprüfung, native Präsentationsimporte, optionale Push-Erinnerungen, zielbezogene Rätsel.

**Zurückgestellt:** endloser Unterhaltungsfeed, persönlicher YouTube-Empfehlungsfeed, Multiplayer/Ranglisten, adaptive automatische Notenvergabe, automatisch veröffentlichte KI-Aufgaben ohne Freigabe, native App, komplexe agentische Infrastruktur.

### Risiken mit Gegenmaßnahmen

| Risiko | Folge | Gegenmaßnahme / Entscheidung |
|---|---|---|
| Zu viel Material für 20 Minuten | Rückstände und Scheinsicherheit | Aktiven Umfang begrenzen, Abdeckungslücken zeigen |
| KI ergänzt unbemerkt Stoff | Falsche Prüfungsinhalte | Quellenanker, gesperrte Lücken, externe Herkunft markieren |
| Rubrik bewertet gute Antwort falsch | Falscher Lernplan | Nutzerkorrektur, offene Bewertung, Testantworten |
| Wiedererkennen wird als Können gezählt | Schlechter Transfer | Kompetenzspuren, unbekannte Fälle, freie Tests |
| Feed zerlegt Zusammenhänge | Schwache Argumentation | Längere Fälle und vollständige Simulation |
| Neues Dokument überschreibt Historie | Verlust und unklare Bewertung | Unveränderliche Versionen und Ereignisse |
| Offline-/Sync-Duplikate | Falsche Erfolgsserie | Ereignis-IDs, Abhängigkeitskennzeichnung, Server-Replay |
| Anbieteränderung oder Verlust | Jahre Arbeit gefährdet | Vollständiger Export und unabhängige Sicherung |
| Spiele/Video verlängern Nutzung | Weniger Lernen pro Zeit | Keine automatische Unterhaltung, freiwillige getrennte Medien |
| Datenaufbereitung wird zum Hauptaufwand | App spart keine Zeit | Kleine Chargen, Qualitätsprobleme vor Generierung erkennen |

Offen für Prompt 2 bleiben konkrete erste Module, tatsächliche Prüfungsdaten, Beispielunterlagen, Umfang einer ersten Materialcharge und Entscheidung zwischen Standardbackend und Sites nach technischer Prüfung. Keine weiteren Rückfragen sind für dieses Konzept nötig. Ohne echte Unterlagen kann die Quellenpipeline spezifiziert, aber noch nicht mit deinen Daten abgenommen werden.

## 10. Evaluationsplan über zehn Wochen

**Ziel:** prüfen, ob die App mit vertretbarem Aufwand zuverlässiges verzögertes Abrufen, Erklären und Anwenden unterstützt. Nutzungshäufigkeit allein reicht nicht.

| Phase | Vorgehen | Auswertung |
|---|---|---|
| Woche 1 | 20–30 Lernziele aus einem tatsächlichen Modul definieren; Vorwissen prüfen; Testvarianten und Rubriken vorab festlegen | Ausgangsniveau, Materialqualität, tatsächliche Zeiten |
| Woche 2 | Einfacher Feed mit Regel-Scheduler; Bedienprobleme und Fehlbewertungen erfassen | Startzeit, Abbruch, Korrekturquote |
| Woche 3–4 | Regelmäßige Nutzung; freie Tests nach etwa 7 Tagen; erste unbekannte Fälle | Erinnern und Transfer getrennt |
| Woche 5–6 | Tests für ältere Ziele nach etwa 21 Tagen; wöchentliche mündliche Stichprobe | Zeitliche Stabilität, Sicherheit vs Leistung |
| Woche 7–8 | Nur eine gezielte Produktänderung, z. B. andere Einstiegslänge; restliches System stabil halten | Nutzen vs bloßer Neuheitseffekt |
| Woche 9 | Prüfungsähnlicher zusammenhängender Block, möglichst mit externer Rubrikprüfung | Grenzen von Kartenerfolg sichtbar machen |
| Woche 10 | Wiederholungstests, Daten-/Backupprüfung und persönliche Bilanz | Beibehalten, vereinfachen oder Umfang ändern |
| Optional 11–12 | Späte Tests und Bestätigung unter Alltagsbedingungen | Belastbarkeit jenseits der ersten Wochen |

### Messgrößen

- **Verzögertes Erinnern:** Anteil korrekt frei beantworteter Kernpunkte nach definiertem Abstand; immer Zeit seit letzter tatsächlicher Exposition dokumentieren.
- **Transfer:** neue, nicht im Feed geübte Fälle, bewertet nach vorab definierter Rubrik; Erklärung und Anwendung getrennt.
- **Mündliche Leistung:** fachliche Richtigkeit, Struktur, Begründung und Umgang mit Nachfragen; keine automatische Gleichsetzung von flüssigem Sprechen und Wissen.
- **Zeit:** Lernen, Feedback, Importfreigabe und Fehlerkorrektur getrennt; Pausen und freiwillige Extras sichtbar.
- **Freiwillige Nutzung:** Starts ohne Erinnerung, gewählte Zusatzblöcke, Gründe für Ausfälle.
- **Ermüdung:** kurze Skala 1–5 vor/nach ausgewählten Sitzungen, nicht nach jeder Karte.
- **Qualität:** fehlerhafte Quellenanker, zurückgewiesene KI-Aufgaben, korrigierte Bewertungen.
- **Effizienz:** verzögert erfüllte Rubrikpunkte je Lernminute innerhalb vergleichbarer Themen; kein einziger über alle Fachbereiche vermischter „Wissenswert“.

Testfragen werden vorab zurückgehalten. Sie dürfen weder während der Generierung als Training gezeigt noch vor dem verzögerten Test in fast identischer Form geübt werden. Ein Test ist selbst ein Lernereignis und wird danach protokolliert. Bei geplanten 21-Tage-Tests muss entweder eine entsprechende Untergruppe ohne Zwischenexposition reserviert werden oder der Test klar als „21 Tage nach Einführung, mit Zwischenübungen“ bezeichnet werden.

### Was bei einer Person kausal möglich ist

Eine zufällige Zuordnung vergleichbarer Lernziele zu zwei Varianten bei gleicher Zeit kann explorative Hinweise geben, z. B. auf freie gegenüber begründeter Auswahlübung. Durch Übertragung zwischen Zielen, unterschiedliche Schwierigkeit, Vorwissen und externe Vorlesungen bleibt die Interpretation begrenzt. Ein bloßer Vorher-nachher-Vergleich beweist keine App-Wirkung. Neue Klausurnoten sind besonders schwer vergleichbar. Tausende Antworten derselben Person sind keine Tausenden unabhängigen Versuchspersonen.

Für den Pilot deshalb keine gleichzeitig wechselnden Algorithmen, Spiele und Aufgabenformate. Zuerst Quellenqualität und Nutzung prüfen; später einen klaren Vergleich. Werte deskriptiv berichten, mit Anzahl der Ziele und Tests sowie Streuung, ohne übertriebene Signifikanzbehauptungen.

### Praktische Erfolgskriterien

Vorläufige Produktgrenzen, keine wissenschaftlichen Normen:

- Mindestens 80 % der gewählten Sitzungen bleiben im gewählten Zeitbudget plus zwei Minuten Toleranz.
- Keine ungekennzeichnete erfundene Quellenstelle in der geprüften Stichprobe.
- Wesentliche Fehlbewertungen werden erkannt, korrigiert und verändern den Plan richtig.
- Verzögerte freie Leistung und Transfer werden gegenüber dem Ausgangsniveau besser, ohne dass der Zeitaufwand unbemerkt steigt.
- Ermüdung und Verwaltungsaufwand sind für dich dauerhaft akzeptabel.
- Ein vollständiger Export lässt sich in eine leere Testumgebung einspielen.

Wenn Lernen oder Motivation nicht profitieren, zuerst Aufgaben, Umfang und Abläufe vereinfachen. Ein komplexerer Scheduler ist nicht die automatische Antwort.

## 11. Kommentierte wissenschaftliche Quellen

**Zugangskennzeichnung:** V = Volltext zugänglich und einschlägige Abschnitte geprüft; A = Abstract/Metadaten geprüft, kein Volltexturteil; E = nur indexierte Auszüge zusätzlich zum Abstract; D = technische Originaldokumentation. „V“ bedeutet nicht, dass jede Referenz und jede Analyse unabhängig repliziert wurde. Effektgrößen aus verschiedenen Reviews sind wegen unterschiedlicher Vergleiche nicht als Rangliste zu lesen.

| ID | Vollständige Referenz / Link | Zugang und Kommentar |
|---|---|---|
| Q1 | Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). **Improving Students’ Learning With Effective Learning Techniques: Promising Directions From Cognitive and Educational Psychology.** Psychological Science in the Public Interest, 14(1), 4–58. [DOI](https://doi.org/10.1177/1529100612453266), [Manuskript](https://acs.ist.psu.edu/ist521/dunloskyRMNW13.pdf) | V. Grundlegende Übersicht; hohe Nützlichkeit von Abruf und Verteilung, begrenztere Generalisierbarkeit anderer Verfahren. Keine App-Studie. |
| Q2 | Agarwal, P. K., Nunes, L. D., & Blunt, J. R. (2021). **Retrieval Practice Consistently Benefits Student Learning: a Systematic Review of Applied Research in Schools and Classrooms.** Educational Psychology Review, 33, 1409–1453. [DOI](https://doi.org/10.1007/s10648-021-09595-9) | A. Wichtige Ergänzung zur Laborliteratur; 50 Experimente. Die Volltextbeschränkung verhindert Detailprüfung aller Moderatoren. |
| Q3 | Albulescu, P., Macsinga, I., Rusu, A., Sulea, C., Bodnaru, A., & Tulbure, B. T. (2022). **“Give me a break!” A systematic review and meta-analysis on the efficacy of micro-breaks for increasing well-being and performance.** PLOS ONE, 17(8), e0272460. [DOI](https://doi.org/10.1371/journal.pone.0272460) | V. 22 unabhängige Stichproben, N=2.335. Erholung und Leistung getrennt betrachten; keine feste App-Pausenfrequenz ableitbar. |
| Q4 | Chiossi, F., Haliburton, L., Ou, C., Butz, A., & Schmidt, A. (2023). **Short-Form Videos Degrade Our Capacity to Retain Intentions: Effect of Context Switching On Prospective Memory.** CHI ’23, Article 30. [DOI](https://doi.org/10.1145/3544548.3580778), [Autoren-PDF](https://www.lukehaliburton.com/files/publications/Chiossi%20et%20al_2023_Short%20form%20videos.pdf) | V. Experiment mit N=60; kurzfristiges prospektives Gedächtnis, keine Langzeit-Klausurnoten. |
| Q5 | Ruitenburg, S. K., Goos, M., Lambert, G., Kirschner, P. A., Jarodzka, H., & Camp, G. (2026). **A Meta-Analysis of the Effectiveness and Boundary Conditions of Retrieval Practice, Distributed Practice, and Interleaved Practice in Authentic School Classrooms.** Educational Psychology Review, 38, 137. [DOI](https://doi.org/10.1007/s10648-026-10225-5) | V. Online 29.10.2026; 53 Studien, Schulpopulation. Aktueller Kontextbeleg, kein direkter Hochschulnachweis. |
| Q6 | Murray, E., Horner, A. J., & Göbel, S. M. (2025). **A Meta-analytic Review of the Effectiveness of Spacing and Retrieval Practice for Mathematics Learning.** Educational Psychology Review, 37, 75. [DOI](https://doi.org/10.1007/s10648-025-10035-1) | A; Autoren-PDF technisch nicht zuverlässig geöffnet. Spacing positiv; Retrieval-Schätzung unsicher. Wichtiges Gegengewicht zu pauschalen Lernversprechen. |
| Q7 | Yu, Y., Zhao, W., Li, A., Shanks, D. R., Hu, X., Luo, L., & Yang, C. (2025). **Is Covert Retrieval an Effective Learning Strategy? Is It as Effective as Overt Retrieval? Answers from a Meta-Analytic Review.** Educational Psychology Review, 37, 52. [DOI](https://doi.org/10.1007/s10648-025-10024-4), [UCL-Eintrag](https://discovery.ucl.ac.uk/id/eprint/10209574/) | A des institutionellen Repositoriums; Manuskript angeboten, hier nicht vollständig geprüft. Kleiner Vorteil offenen Abrufens; relativiert Gleichwertigkeitsbehauptungen aus einzelnen älteren Studien. |
| Q8 | Latimier, A., Peyre, H., & Ramus, F. (2021; online 2020). **A Meta-Analytic Review of the Benefit of Spacing out Retrieval Practice Episodes on Retention.** Educational Psychology Review, 33, 959–987. [DOI](https://doi.org/10.1007/s10648-020-09572-8) | A. 29 Studien; Abstand vorteilhaft, expandierende gegenüber gleichmäßigen Abständen nicht generell überlegen. Verlagskorrektur betrifft einen Abstract-Tippfehler. |
| Q9 | Brunmair, M., & Richter, T. (2019). **Similarity matters: A meta-analysis of interleaved learning and its moderators.** Psychological Bulletin, 145(11), 1029–1052. [DOI](https://doi.org/10.1037/bul0000209), [Abstract](https://pubmed.ncbi.nlm.nih.gov/31556629/) | A; ergänzende Autorenmanuskript-Auszüge gefunden. Besonders wichtig: Materialabhängigkeit und nicht durchgehend positive Befunde. |
| Q10 | Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). **Inducing Self-Explanation: a Meta-Analysis.** Educational Psychology Review, 30, 703–725. [DOI](https://doi.org/10.1007/s10648-018-9434-x), [ERIC](https://eric.ed.gov/?id=EJ1186664) | A über indexierten ERIC-/Verlagsinhalt. Unterstützt gezielte Erklärungsprompts; kein Beleg für beliebige KI-Nachfragen. |
| Q11 | Renkl, A. (2014; online 2013). **Toward an Instructionally Oriented Theory of Example-Based Learning.** Cognitive Science, 38(1), 1–37. [DOI](https://doi.org/10.1111/cogs.12086) | V. Forschungsintegrierende Theorie, keine neue Metaanalyse. Begründet Beispiele und Hilfenabbau, besonders in strukturierten Domänen. |
| Q12 | Wisniewski, B., Zierer, K., & Hattie, J. (2020). **The Power of Feedback Revisited: A Meta-Analysis of Educational Feedback Research.** Frontiers in Psychology, 10, 3087. [DOI](https://doi.org/10.3389/fpsyg.2019.03087), [Abstract](https://pubmed.ncbi.nlm.nih.gov/32038429/) | A geprüft; Volltext verlinkt, nicht vertieft ausgewertet. 435 Studien, starke Heterogenität; Feedbackinhalt ist zentral. |
| Q13 | Pan, S. C., & Rickard, T. C. (2018). **Transfer of Test-Enhanced Learning: Meta-Analytic Review and Synthesis.** Psychological Bulletin, 144(7), 710–756. [DOI](https://doi.org/10.1037/bul0000151), [Autoren-PDF](https://pdf.retrievalpractice.org/transfer/Pan_Rickard_2018.pdf) | E: Abstract und umfangreicher indexierter Manuskriptauszug. Transfer möglich, aber konditional; kein Versprechen universellen Ferntransfers. |
| Q14 | Howard, J. L., Bureau, J., Guay, F., Chong, J. X. Y., & Ryan, R. M. (2021). **Student Motivation and Associated Outcomes: A Meta-Analysis From Self-Determination Theory.** Perspectives on Psychological Science, 16(6), 1300–1323. [DOI](https://doi.org/10.1177/1745691620966789) | A. 344 Stichproben; Zusammenhänge von Motivation und Ergebnissen. Kausalität einzelner App-Mechaniken daraus nicht ableitbar. |
| Q15 | Sailer, M., & Homner, L. (2020; online 2019). **The Gamification of Learning: a Meta-analysis.** Educational Psychology Review, 32, 77–112. [DOI](https://doi.org/10.1007/s10648-019-09498-w) | V. Effekte heterogen; motivationale/Verhaltenseffekte in rigorosen Teilanalysen weniger stabil. Kein Freibrief für beliebige Minispiele. |
| Q16 | Singh, B., Murphy, A., Maher, C., et al. (2024). **Time to Form a Habit: A Systematic Review and Meta-Analysis of Health Behaviour Habit Formation and Its Determinants.** Healthcare, 12(23), 2488. [DOI](https://doi.org/10.3390/healthcare12232488), [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11641623/) | A/E; Volltextabruf durch Zugriffshürde begrenzt. Gesundheitsverhalten, große Variabilität; Lerntransfer ausdrücklich indirekt. |
| Q17 | Emirtekin, E. (2025). **Large Language Model-Powered Automated Assessment: A Systematic Review.** Applied Sciences, 15(10), 5683. [DOI](https://doi.org/10.3390/app15105683) | A/E: Verlagsauszüge und bibliografischer Eintrag; Volltextabruf mit HTTP-429 gescheitert. 49 Studien; inkonsistente Bewertungsübereinstimmung, Kontextabhängigkeit und Aufsicht. |
| Q18 | Ye, J., Su, J., & Cao, Y. (2022). **A Stochastic Shortest Path Algorithm for Optimizing Spaced Repetition Scheduling.** Proceedings of the 28th ACM SIGKDD Conference, 4381–4390. [DOI](https://doi.org/10.1145/3534678.3539092), [Originalrepository](https://github.com/maimemo/SSP-MMC) | D: Originalrepository und bibliografische Angaben geprüft; Paper-Volltext nicht ausgewertet. Forschungsherkunft von Gedächtnismodellen, kein direkter Vergleich aktueller App-Varianten. |

### Technische Primärquellen

Alle nachfolgenden Quellen wurden am 30.10.2026 geöffnet oder in Originaldokumentation geprüft; Implementierungsdetails und Preise sind veränderlich.

| ID | Quelle | Wofür verwendet |
|---|---|---|
| T1 | Piotr Wozniak (1990/1998), [SuperMemo 2: Algorithm](https://super-memory.com/english/ol/sm2.htm) | Historische SM-2-Regeln, heuristischer Ursprung |
| T2 | Open Spaced Repetition, [FSRS Algorithm](https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm) | Gedächtnismodell, Versionierung |
| T3 | Anki, [Deck Options](https://docs.ankiweb.net/manual/deck-options) | Retention, Parameter und Lern-/Wiederlernschritte |
| T4 | Open Spaced Repetition, [SRS Benchmark](https://github.com/open-spaced-repetition/srs-benchmark) | Prognosemetriken und Versionsunterschiede; kein RCT |
| T5–T7 | Google, [Player-Parameter](https://developers.google.com/youtube/player_parameters), [IFrame-API](https://developers.google.com/youtube/iframe_api_reference), [Data-API](https://developers.google.com/youtube/data/reference/rest) | Einbettung, Steuerung, Ressourcen und Grenzen |
| T8 | YouTube, [Embed videos & playlists](https://support.google.com/youtube/answer/171780) | Datenschutzmodus und Einbettungsbeschränkungen |
| T9 | Brady Eidson & Jen Simmons / WebKit (2023), [Web Push for Web Apps on iOS and iPadOS](https://webkit.org/blog/13878/) | iPhone-Push und Home-Screen-Voraussetzung |
| T10–T11 | Google web.dev, [Installation](https://web.dev/learn/pwa/installation), [Offline data](https://web.dev/learn/pwa/offline-data) | PWA-Installation und lokale Speichermechanismen |
| T12 | OpenAI, [Sites](https://learn.chatgpt.com/docs/sites) | Plattformgrenzen, Speicher und angekündigte Preise |
| T13–T14 | Supabase, [Database](https://supabase.com/docs/guides/database/overview), [Backups](https://supabase.com/docs/guides/platform/backups) | Backendbausteine und separate Dateisicherung |
| T15 | Supabase, [Pricing](https://supabase.com/pricing) | 25-USD-Basisszenario und Kontingente |
| T16 | Cloudflare, [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [R2 pricing](https://developers.cloudflare.com/r2/pricing/) | Hosting-/Backupkalkulation |
| T17 | OpenAI, [GPT-5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra) | Rechenbeispiel für KI-Kosten; keine Qualitätsgarantie |

Zusätzlich lokal geprüft: installierte Sites-Version **1.1.2**, `skills/sites/SKILL.md`, `references/storage.md`, `references/identity-and-secrets.md` und die in dieser Sitzung verfügbaren Sites-Werkzeuge. Die Prüfung war lesend; es wurden keine Hostingressourcen erzeugt.

### Einordnung der separaten Consensus-Anlage

Die Anlage bleibt unverändert, einschließlich ihrer Quellenmarker. Sie ist als begrenztes Rechercheergebnis zu lesen: unter anderem doppelte bibliografische Treffer, unzureichende Abdeckung der vier Ausgangsarbeiten und eine zu pauschale Gleichwertigkeitsaussage zum stillen Abrufen. Der aktuelle Bericht verwendet dafür die gezielt geprüften Quellen und die neuere Metaanalyse Q7. Auch die dortigen Motivation-/Feed-Verweise sind kein belastbarer Nachweis einer konkreten Oberfläche.

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



