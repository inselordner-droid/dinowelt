# Dino-Inselwelt

Eine gemalte Dino-Insel für Kinder von 4 bis 8 Jahren. Sie verbindet die DINOPEDIA-Stationen, das Dino-Forscherbuch und den Plattentektonik-Globus zu einer App.

## Starten

- **Am Computer:** `index.html` doppelklicken. Alles läuft ohne Internet.
- **Auf dem Tablet (als App):** Den ganzen Ordner auf einen Webserver legen, z. B. Netlify Drop (Ordner ins Browserfenster ziehen). Dann die Adresse auf dem iPad in Safari öffnen und über **Teilen → Zum Home-Bildschirm** ablegen. Danach funktioniert die App auch offline.
- Zum Testen am Computer mit Offline-Speicher: im Ordner `python3 -m http.server 8000` ausführen und `http://localhost:8000` öffnen.

## So funktioniert die Insel

Das Kind wählt eine Forscherfigur und läuft mit dem kleinen Dino **Pip** über die Karte. Wer auf ein rundes Schild tippt, läuft dorthin und kann hineingehen. Die Tiere auf der Karte kann man antippen, dann erzählen sie etwas über sich.

| Ort | Was man macht | Stammt aus |
|---|---|---|
| **Zeitportal** | Aquarell-Globus mit echter Plattenbewegung über 1 Mrd. Jahre. Dazu das Spiel „Wer lebte wann?“: Tiere auf die richtige Zeit ziehen (3 Stufen) | Globus, Pangäa-Tisch (Station 01), Urzeit-Atlas |
| **Naturkundemuseum** | Eingangshalle, Dinosaurier-Saal (mit dem Berliner Brachiosaurus), Fossilien- & Kristallsaal und 9 Zeitalter-Säle (Paläogen mit Paläozän, Eozän, Oligozän). Tiere antippen, pro Saal einen Stempel sammeln | Station 02 |
| **Dino-Lauf** | 11 Dinos zum Freischalten (Ptera kann fliegen), 5 Landschaften, 12 Landschafts-Sticker zum Fangen. Ohne „Game over“ | DINO RUN (Station 03) |
| **Dino-Waage** | „Was ist schwerer?“ (ab 4), „Wie schwer ist er wohl?“ (Schätzen mit Katze, Hund, Pferd, Auto, Elefant …, ab 5) und „Mach die Waage gerade“ (ab 6, 6 Stufen) | Station 04 |
| **Futterwald** | Futter zum Maul ziehen, Zähne mit der Lupe anschauen | Station 05 |
| **Ausgrabung** | 4 Werkzeuge: Schaufel (weiche Erde), Hammer (harter Stein), Pinsel (vorsichtig an den Knochen), Scanner. Funde bestimmen, Schädel putzen, Skelett zusammensetzen. 6 Fundstellen | Station 06 |
| **Puzzle-Lichtung** | 12 gemalte Dino-Bilder, dein T-Rex-Foto und ein eigenes Bild (Foto vom Gerät), 4 bis 48 Teile | Dino-Puzzle |
| **Forscherhütte** | Alle 100 Experimente aus dem Forscherbuch: Mission, Vermutung, Plan, Ergebnis, Wissen. Ausmalen, Fotos, Sticker und Notizzettel aufkleben, Diktieren, eigene Experimente anlegen, Namen eintragen, Umblättern | Mein Dino-Forscherbuch |

### Die große Welt (neu)

Die Karte ist jetzt riesig: sechs Landgebiete und das offene Urzeit-Meer. Unerforschte Gegenden liegen unter Nebel, der sich lichtet, wenn man hinkommt. Wer auf einen Ort auf einer anderen Insel oder im Wasser tippt, läuft die Figur zum nächsten Steg, steigt ins **Boot** und segelt hin. Unterwegs gibt es glitzernde Fundstellen, raschelnde Büsche mit kleinen Dinos und Flaschenposten mit Kartenpäckchen. Unten links: „Wo bin ich?“ und „Ganze Karte“. Oben rechts: Musik an/aus.

| Gebiet | Stationen |
|---|---|
| **Dschungelinsel** | Dino-Dschungel (Hüpfspiel), Forscher-Lager (echte Paläontologinnen und Paläontologen, Junior-Urkunde), Dino-Kindergarten |
| **Felseninsel / Muschelinsel** | Klanghöhle (Wer macht dieses Geräusch?), Kartenhaus (die 104 Dinokarten sammeln), Urzeit-Kino (Film „Ein Tag im Leben des Spinosaurus“), Modell-Werkstatt (Dino bauen, drehen, anmalen) |
| **Wüstenland** | Spurensuche, Dino-Tracker, Dino-Eier, Nestbau |
| **Eisland** | Dino-Memory, Groß oder klein?, Schatten-Dino, Forscherkamera |
| **Vulkanland** | Dino-Rennen, Vulkan-Expedition, Endlose Welt (Land → Meer → Luft) |
| **Fossilienebene** | Wie groß war er?, Welcher Dino bin ich?, Dino-Bildquiz (mit deinen Kartenbildern), Land, Luft oder Wasser? |
| **Expeditionsinsel** | Dino-Picknick, Dino-Rettung, Große Expedition |
| **Urzeit-Meer (nur mit dem Boot)** | Urzeit-Riff (Tauchstation), Forschungsschiff (Fisch, Reptil oder Säugetier?), Leuchtende Tiefsee, Mary-Anning-Klippe, Meeres-Futter, Tauchfahrt (als Fischsaurier), Ammoniten-Riff |

Jedes Spiel hat drei Stufen (Leicht, Mittel, Schwer), wird vorgelesen, gibt Hinweise, wenn das Kind nicht weiterkommt, und kennt kein „Game over“. Sterne aus allen Spielen bringen Kartenpäckchen fürs Kartenhaus (eins pro 8 Sterne).

Neu im Datenbestand: 19 Meerestiere (u. a. Anomalocaris, Orthoceras, Seeskorpion, Quastenflosser, Helicoprion, Liopleurodon, Elasmosaurus, Archelon, Livyatan) und die Zeitalter Kambrium, Ordovizium und Silur.


### Roter Faden, Stimmen und echte Welt (neu)

- **Pips Aufträge:** Jeden Tag gibt Pip drei kleine Bild-Aufträge (einer ist immer in der Nähe). Knopf unten links auf der Karte. Mit dem Fußspur-Knopf läuft oder segelt die Figur direkt hin. Kein Druck: Nicht erledigte Aufträge verschwinden am nächsten Tag einfach.
- **Pip wächst mit:** Mit erledigten Aufträgen und Sternen wächst Pip in fünf Stufen (Halstuch, Rucksack, Forscherhut, Lupe). Pip antippen zeigt die Wachstumskarte.
- **Mein Forscherhaus** (neben der Forscherhütte): Funde, Tiere, Sticker, Sammelkarten, Fotos und Modelle aus der Truhe in Regale und Bilderrahmen ziehen.
- **Tageszeit, Wetter, Jahreszeiten:** Die Karte folgt der Uhr des Geräts (Morgen, Tag, Abend, Nacht mit Glühwürmchen) und der Jahreszeit. Im Elternbereich abschaltbar.
- **Forscher-Ausflug** (am Weg zum Hafen): 13 Draußen-Aufträge (Fußspur im Sand, Vögel sind Dinosaurier, Steine sortieren …) mit Foto oder Erwachsenen-Bestätigung, ein Suchheft für das Museum für Naturkunde Berlin und eins für jedes Naturkundemuseum, Ausflugs-Pass mit Stempeln, Tipps und Druckvorlagen für Erwachsene (ⓘ).
- **Echte Stimmen:** Rund 930 Sätze sind mit ElevenLabs-Kinderstimmen aufgenommen (Pip: Julian, Erklärungen: Pixie), Dateien in `assets/voice`, Liste in `js/voice-map.js`. Sätze ohne Aufnahme liest die Gerätestimme. Wird ein Satz geändert, passt die Aufnahme nicht mehr – dann liest wieder die Gerätestimme.

### Neu: Pangäa, Figuren, Spielstände, eigene Grafiken

- **Pangäa-Karte:** Die Welt hat jetzt die Form des Urkontinents Pangäa vor etwa 240 Millionen Jahren (aus echten Plattendaten), mit Laurasia, Gondwana, Zentralgebirge, Pangäa-Wüste, Tethys-Meer und Inseln. Jede Insel hat einen Steg und Wege. Die Karte hat keinen Rand: Wer immer weiter fährt oder läuft, kommt wie auf einem Globus wieder am Anfang an – in alle Richtungen.
- **Figuren:** vier Paläontolog:innen (Frida, Amara, Kenji, Omar) und „Eigene Figur“: aus 12 Figuren wählen, eigenen Namen eingeben (große Buchstaben-Tastatur mit Vorlesen), Stimme weiblich/männlich/neutral. Die Figur sagt kurze Sätze wie „Los geht’s!“ oder „Geschafft!“.
- **Mehrere Kinder:** Jedes Kind hat einen eigenen Spielstand („Wer spielt?“). Löschen nur im Elternbereich.
- **Spielstand sichern:** Im Elternbereich ein Kind oder alle Kinder als Datei sichern und wieder laden (inklusive Fotos und Bilder). Tipp: Auf iPad/iPhone die App zum Home-Bildschirm hinzufügen, sonst kann Safari nach 7 Tagen ohne Nutzung die Daten löschen.
- **Eigene Grafiken einbauen:** Bilder mit den Dateinamen aus den Prompt-Tabellen in `grafiken-neu/…` legen und `tools/Grafiken-einbinden.command` (Mac) bzw. `.bat` (Windows) doppelklicken. Fehlt ein Bild, zeichnet die App wie bisher. Details: `tools/LIESMICH-Grafiken.md`.
- **Testhilfen** sind nur noch mit `?debug=1` in der Adresse aktiv.

Alles, was das Kind findet, landet im **Rucksack** (oben rechts): entdeckte Tiere, Fossilien-Funde und Sticker. Die Sterne zählen oben neben dem Rucksack.

**Elternbereich:** Das Zahnrad oben rechts **lange gedrückt halten**. Dort kann man Töne und Vorlesen einstellen, das Vorlese-Tempo ändern, die Figur wechseln und den Spielstand löschen.

### Neu: Großes Forscherhaus, geführte Tour, eigene Töne

- **Geführte Tour:** Beim ersten Start fragt Pip, ob er die Insel zeigen soll (zwei Bild-Knöpfe: Fußspuren = Tour, Kreuz = ohne Tour). Die Tour hat 10 kurze Mitmach-Schritte (ca. 1½ Minuten) und lässt sich jederzeit mit „Tour beenden“ (✕) oder Esc abbrechen. Wiederholen: Fragezeichen am Kartenrand oder Elternbereich → „Tour noch einmal zeigen“. Jedes Kind (Profil) bekommt sie einmal angeboten.
- **Mein Forscherhaus** hat jetzt 15 Zimmer: Flur, Wohnzimmer, Küche, Schlafzimmer, Badezimmer, Arbeitszimmer, Dachboden, Keller, Garten und die Themenräume Sternwarte, Urzeit-Meerzimmer, Vulkan-Labor, Fossilien-Galerie, Eiszeit-Zimmer und Dschungel-Gewächshaus. Einstieg ist das aufgeschnittene Haus; im Zimmer blättern die Pfeile weiter, der Haus-Knopf führt zurück. Sachen aus der Truhe hineinziehen **oder** erst die Sache, dann den Platz antippen; belegte Plätze tauschen, auf die Truhe ziehen räumt zurück. Viele Dinge im Zimmer reagieren beim Antippen. Bisher Aufgestelltes steht im Arbeitszimmer.
- **Zimmer später durch Bilder ersetzen:** `grafiken-neu/stationen/haus_<zimmer>.png` (quer 1920×1200) und `haus_<zimmer>_hoch.png` (hoch 1350×1800); Rahmen, Regale und Bodenstellen im Bild leer lassen. Alle Namen stehen in `tools/grafiken-liste.txt`.
- **Experimentebuch:** Radierer repariert (dazu Rückgängig und „Alles wegwischen“); alle Bilder dort sind ersetzbar (`grafiken-neu/experimente/…`).
- **Eigene Töne, Sprache und Musik:** Dateien in `sounds-neu/toene/`, `sounds-neu/sprache/` oder `sounds-neu/musik/` legen und danach wie bei den Bildern `tools/Grafiken-einbinden.command` (Mac) bzw. `.bat` (Windows) doppelklicken. Welche Datei wie heißen muss, steht in `tools/toene-liste.txt`, `tools/sprache-liste.csv` (alle bisherigen Aufnahmen) und `tools/sprache-liste-experimente.txt` (Experimentebuch und Tour). Ganz neue Sätze: Datei frei benennen und in `sounds-neu/sprache/saetze.txt` eintragen. Anleitung: `tools/LIESMICH-Grafiken.md`.
- **Fehlerrunde:** Ziehen & Ablegen neu gebaut (kein Verrutschen, keine doppelten Bilder, flüssiger), Nest bleibt beim Buddeln in der Mitte, alle 42 Stationen in allen Stufen durchgespielt und viele kleine Fehler behoben (springende Figuren, verschluckte Tipps, abgeschnittene Knöpfe im Handy-Querformat, Ruckeln in den Lauf- und Tauchspielen).

## Aufbau

    index.html              Grundgerüst
    css/app.css             Gestaltung (Papier, Aquarell, große Knöpfe)
    js/art.js               alle Zeichnungen: ~110 Urzeittiere, Figuren, Symbole – als SVG erzeugt
    js/data.js              alle Inhalte: Zeitalter, Tiere mit Kindertexten, Futter, Funde, Sticker …
    js/core.js              Spielstand, Vorlesen, Töne, Belohnungen, Ziehen & Ablegen
    js/world.js             die gemalte Inselkarte
    js/app.js               Start, Rucksack, Elternbereich
    js/tour.js              die geführte Tour beim ersten Start
    js/assets.js            eigene Bilder und Töne einbinden (grafiken-neu/, sounds-neu/)
    js/data2.js             Meerestiere, Sammelkarten, neue Stationen
    js/game.js              gemeinsamer Spiele-Baukasten (Stufen, Hinweise, Belohnung)
    stations/*.js           alle 42 Orte
    css/games-*.css         Gestaltung der neuen Stationen
    data/plates.js          Plattentektonik-Daten für den Globus
    data/experiments.js     die 100 Experimente aus dem Forscherbuch (unverändert übernommen)
    assets/experiments/     die 100 Ausmal-Szenen aus dem Forscherbuch
    assets/puzzles/          dein T-Rex-Bild für das Foto-Puzzle
    assets/karten/           deine 104 Dinokarten
    assets/kino/             die 20 Spinosaurus-Filmbilder
    assets/fonts, sounds, icons

**Texte ändern:** fast alles steht in `js/data.js`. Die Experimente stehen weiterhin in `data/experiments.js`.

**Neues Tier ergänzen:** In `js/data.js` einen Eintrag in `ANIMALS` anlegen. Gibt es für die Art noch keine Zeichnung, `art:'…'` auf eine ähnliche Art setzen (z. B. `art:'allosaurus'`).

**Nach Änderungen online:** In `sw.js` die Versionsnummer (`dino-inselwelt-v8`) erhöhen, sonst zeigt das Tablet die alte Fassung.

## Hinweise

- Der Spielstand bleibt nur auf dem Gerät (Browser-Speicher). Gemalte Bilder und Fotos aus der Forscherhütte liegen im Browser-Speicher des Geräts.
- Vorlesen und Diktieren nutzen die Sprachfunktionen des Geräts.
- Globus: Plattenmodell Merdith et al. (2021) / Müller et al. (2022), EarthByte / GPlates. Es zeigt die heutigen Küstenlinien, zurückgedreht in die Vergangenheit – vereinfacht für Kinder.
