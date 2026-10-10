# Gemalte Grafiken, eigene Töne und eigene Sprache einbauen

Die App zeichnet alle Tiere, Symbole und Figuren selbst, macht ihre Töne selbst und hat 932 Sprachaufnahmen dabei. Alles davon kannst du ersetzen:

- **Bilder** legst du in den Ordner **`grafiken-neu/`**,
- **Töne, Sprache und Musik** in den Ordner **`sounds-neu/`**

(beide liegen neben `index.html`). Danach ein Doppelklick auf das Werkzeug – fertig. Was fehlt, bleibt einfach wie bisher. Du kannst also nach und nach ergänzen.

## So geht's (Bilder)

1. Bilder genau so benennen wie in den Tabellen `Dino-Inselwelt_Bildprompts_Teil1/2.xlsx` (Spalte „Dateiname“), z. B. `tiere/trex.png`, `tiere/baby_trex.png`, `symbole/lupe.png`, `stationen/hintergrund_futter_quer.png`.
   Die vollständige Liste steht auch in `tools/grafiken-liste.txt`.
2. Die Bilder in den passenden Unterordner von **`grafiken-neu/`** legen: `tiere`, `pflanzen`, `fossilien`, `figuren`, `ui`, `symbole`, `stationen`, `sticker`, `objekte`, `karte`, `karten`, `landschaften`, `zeitalter`, `experimente`.
3. Das Werkzeug starten – es schreibt die Liste `js/asset-map.js` neu:
   - **Mac:** Doppelklick auf `tools/Grafiken-einbinden.command`.
     Beim ersten Mal ggf. Rechtsklick → „Öffnen“ (macOS fragt einmal nach). Falls „keine Berechtigung“: im Terminal `chmod +x tools/Grafiken-einbinden.command`.
   - **Windows:** Doppelklick auf `tools/Grafiken-einbinden.bat`.
   Das Fenster zeigt, wie viele Bilder und Töne gefunden wurden und ob Dateinamen nicht in den Listen stehen (Tippfehler?).
   (`Grafiken-und-Sounds-einbinden.command` / `.bat` ist dasselbe Werkzeug mit längerem Namen.)
4. App neu laden. Bei GitHub Pages: `grafiken-neu/`, `sounds-neu/` **und** `js/asset-map.js` hochladen.

Ohne Schritt 3 sieht die App die neuen Dateien nicht (im Browser kann eine Seite von der Festplatte keine Ordner durchsuchen).

## Worauf achten (Bilder)

- **Hintergrund entfernen** (transparentes PNG). Sonst gibt es Kästen hinter den Tieren, und Schatten-Rätsel zeigen ein Rechteck.
- Tiere schauen nach **rechts**; die App spiegelt selbst. Bild eng zuschneiden (wenig leerer Rand), dann stimmen die Größenvergleiche.
- Nur `a–z`, `0–9`, `_` und `-` im Namen, keine Leerzeichen oder Umlaute. `.png` bevorzugt (`.jpg`/`.webp` gehen auch, z. B. für Hintergründe).
- Stationshintergründe: `hintergrund_<station>_quer.png` (Computer, Tablet quer) und `_hoch.png` (Handy); fehlt eine Variante, wird die andere genommen.
- Kauen, traurig schauen, Laufen: das Bild wippt/kaut sanft – ein Bild pro Tier genügt.

## Karte gestalten (Bäume, Berge, Vulkane, Knochen … auf der Insel)

Auch die Dinge auf der großen Karte kannst du durch eigene Bilder ersetzen. Alle Namen (mit empfohlener Größe) stehen in `tools/grafiken-liste.txt` im Abschnitt **„Karte gestalten“**.

1. **Bild malen:** PNG mit **durchsichtigem Hintergrund**, leicht von schräg oben (wie die Karte). Das Ding steht **unten in der Mitte** des Bildes – dort steht es auf dem Boden. Wenig leeren Rand lassen.
2. **Richtig benennen**, z. B. `baum_nadel.png`, `berg.png`, `vulkan.png`, `knochen_boden.png`, `wahrzeichen_museum.png`, `boot.png`, und in den Ordner **`grafiken-neu/karte/`** legen.
3. **Mehr Abwechslung:** `baum_nadel_1.png`, `baum_nadel_2.png` … bis `_4`. Jeder Baum auf der Karte bekommt dann fest eine davon (immer dieselbe an derselben Stelle).
4. **Werkzeug starten** (wie oben) und die App neu laden. Die Karte zeigt kurz die alte Zeichnung und tauscht dann still die Bilder ein.

Gut zu wissen:
- **Größe macht die App:** jedes Bild wird so hoch wie die bisherige Zeichnung, das Seitenverhältnis bleibt. Große Bäume bleiben groß, kleine klein.
- **Fehlt ein Bild, bleibt die Zeichnung.** Du kannst also mit einer Sorte anfangen (z. B. nur Nadelbäume) und nach und nach ergänzen.
- **Ersatz-Namen:** fehlt `baum_nadel_schnee.png`, nimmt die App `baum_nadel.png`; fehlt `fels_rot.png`, nimmt sie `fels.png` usw.
- **Brücken und Stege** (`bruecke`, `haengebruecke`, `steg`) waagerecht malen – sie werden auf die passende Länge gestreckt.
- **Boot:** `boot.png` von der Seite, Bug nach rechts; die Kinderfigur und Pip sitzen davor. Wer mag, malt zusätzlich `boot_vorne.png` (nur die vordere Bordwand, gleiche Bildgröße).
- **Flächen-Muster** (`wiese_textur`, `sand_textur`, `meer_textur`, `papier_textur`): ein kachelbares, helles Muster; es wird leicht über die Farben gelegt.
- Küsten, Flüsse, Seen und Wege bleiben gezeichnet.

**Lauf- und Rennspiele:** Die Hintergründe liegen in `grafiken-neu/landschaften/` (`<welt>_himmel`, `_hinten`, `_mitte`, `_boden`). `hinten`, `mitte` und `boden` werden nebeneinander wiederholt – der rechte Bildrand muss nahtlos an den linken passen. Welche Welt welches Spiel benutzt, steht in der Liste.
**Zeitalter-Abzeichen:** `grafiken-neu/zeitalter/kreide.png` usw. ersetzt das Symbol des Erdzeitalters überall (Zeitportal, Kartenhaus, Museum).
**Dino-Eier:** `grafiken-neu/objekte/ei_oviraptor.png` usw. (Liste unter „Dino-Eier“) – auch als Bild bricht das Ei beim Schlüpfen in zwei Hälften auf.

## Bilder im Experimentebuch (Forscherhütte)

Alle Bilder des Experimentebuchs liegen in **`grafiken-neu/experimente/`**. Die Namen mit empfohlener Größe stehen am Ende von `tools/grafiken-liste.txt` (Abschnitt „Experimentebuch“). Die wichtigsten:

| Datei | Wofür | Größe |
|---|---|---|
| `exp001.png` … `exp100.png` | Bild des Experiments: Malvorlage auf dem Blatt und Kachel im Kapitel | 2000 × 1300 (quer) |
| `exp001_schritt1.png` … | Bild zu Schritt 1, 2, 3 im Plan | 600 × 600 |
| `exp001_vermutung1.png` … | Bild auf der 1., 2., … Vermutungs-Karte (statt Emoji) | 400 × 400 |
| `exp001_wissen.png` | Bild auf der Seite „Dino-Wissen“ | 800 × 600 |
| `material_lupe.png`, `material_sand.png` … | Material unter „Du brauchst“ | 300 × 300 |
| `buch_umschlag.png`, `kapitel_01.png` … `kapitel_11.png` | Buch und runde Kapitel-Bilder im Regal | 600 × 600 / 400 × 400 |
| `seite_leer.png`, `seite_hintergrund.png` | leeres Blatt für eigene Experimente, Papier der Buchseiten | 2000 × 1300 / 1200 × 1600 |
| `werkzeug_radierer.png`, `werkzeug_pinsel.png`, `werkzeug_zurueck.png`, `werkzeug_leeren.png`, `werkzeug_sticker.png`, `werkzeug_notiz.png`, `werkzeug_foto.png` | Knöpfe unter dem Blatt | 200 × 200 |
| `reiter_mission.png`, `reiter_vermutung.png`, `reiter_plan.png`, `reiter_ergebnis.png`, `reiter_wissen.png` | Symbole an den Reitern | 120 × 120 |
| `stempel_geschafft.png`, `eigenes.png`, `eigenes_neu.png` | Stempel, Kacheln bei „Meine Experimente“ | siehe Liste |

Die Nummer ist die Nummer des Experiments (steht auf der Seite: „Experiment 1“ → `exp001`). Malvorlagen am besten hell lassen: Die Wasserfarben der Kinder liegen wie auf Papier darüber, und der Radierer löscht nur die Farbe der Kinder, nie dein Bild.
Der Hintergrund hinter dem Buch heißt wie bei allen Stationen `stationen/hintergrund_forscher_quer.png` / `_hoch.png`. Andere Symbole (Pfeile, Haken, Mikrofon …) kommen wie überall aus `symbole/`.

## Töne und Sprache ersetzen

Das geht genauso wie bei den Bildern – nur mit dem Ordner **`sounds-neu/`**. Am besten **mp3** (m4a, wav und ogg gehen meistens auch).

### Schritt für Schritt (Mac)

1. Ton aufnehmen oder aussuchen und als mp3 sichern.
2. Die Datei richtig benennen und in den richtigen Unterordner von `sounds-neu/` legen (siehe unten).
3. Doppelklick auf **`tools/Grafiken-einbinden.command`**. Im Fenster steht, wie viele Ton- und Sprachdateien gefunden wurden – und ob ein Name unbekannt ist.
4. Die App neu laden (Browser: ⌘R).

### Welche Datei wohin?

**Töne** → `sounds-neu/toene/`
Jeder Ton der App hat einen Namen: `pop`, `tap`, `ok`, `win`, `magic`, `whoosh` … Die ganze Liste mit Beschreibung steht in `tools/toene-liste.txt`.
Beispiel: `sounds-neu/toene/pop.mp3` ersetzt das „Plopp“ in der ganzen App. Kurze Töne nehmen (unter 1 Sekunde), ohne Stille am Anfang.

**Musik** → `sounds-neu/musik/musik.mp3` ersetzt die Musik der Inselkarte (sie läuft in Schleife).

**Vorhandene Sprachaufnahme ersetzen** → `sounds-neu/sprache/`
Die 932 Aufnahmen heißen `v0000.mp3`, `v0001.mp3` … Welcher Satz zu welcher Nummer gehört, steht in **`tools/sprache-liste.csv`** (mit Doppelklick in Numbers oder Excel öffnen: Dateiname – Satz – Station). Dort den Satz suchen, die eigene Aufnahme genauso nennen, z. B. `sounds-neu/sprache/v0012.mp3`.

**Sätze im Experimentebuch vertonen** → `sounds-neu/sprache/`
Alle Sätze der Forscherhütte stehen mit ihrem Dateinamen in **`tools/sprache-liste-experimente.txt`**, zum Beispiel:

```
fb_willkommen_1.mp3 = Willkommen in der Forscherhütte!
exp001_frage.mp3 = Wer ist hier gelaufen?
exp001_schritt1.mp3 = Suche draußen einen Abdruck im Sand, Schlamm oder Schnee.
```

Datei mit genau diesem Namen ablegen – mehr ist nicht nötig. Du musst nicht alles aufnehmen: Jede vorhandene Aufnahme wird gespielt, die übrigen Sätze liest weiter die Gerätestimme.

**Ganz neue Sätze vertonen** (für die es noch keine Aufnahme und keinen Namen gibt) → `sounds-neu/sprache/` + eine Zeile in **`sounds-neu/sprache/saetze.txt`**
Die Datei darfst du nennen, wie du willst. In `saetze.txt` schreibst du pro Satz eine Zeile:

```
hallo_mia.mp3 = Hallo Mia!
```

Links der Dateiname, dann `=`, dann der Satz, so wie die App ihn sagt (Groß-/Kleinschreibung und der Punkt am Ende sind egal). `saetze.txt` mit TextEdit öffnen; falls TextEdit sie als „formatierten Text“ sichern will: Menü „Format“ → „In reinen Text umwandeln“.

**Stimme der eigenen Figur:** `sounds-neu/sprache/figur_w_1.mp3` (weiblich), `figur_m_1.mp3` (männlich), `figur_n_1.mp3` (neutral) usw. – die Sätze dazu stehen am Ende von `tools/sprache-liste.csv`.

### Gut zu wissen

- Stimmt etwas mit einer Datei nicht (gelöscht, kaputt), nimmt die App von selbst wieder den alten Ton bzw. die alte Aufnahme.
- Spricht die App einen Text aus mehreren Sätzen und nur für einige gibt es deine Aufnahme, hört man deine Aufnahme und dazwischen die Gerätestimme.
- Dateinamen nur mit `a–z`, `0–9`, `_` und `-`. Mit Leerzeichen oder Umlauten klappt es am eigenen Computer meist trotzdem, im Internet (GitHub Pages) oft nicht – das Werkzeug warnt dann.
- Eine Datei wieder loswerden: aus `sounds-neu/` löschen und das Werkzeug noch einmal starten.
- „Ton aus“ und „Vorlesen aus“ gelten auch für deine Dateien.

## Was wird schon benutzt?

Tiere und Dino-Babys (Kindergarten, Eier, Nest, Rettung, Vulkan), alle Symbole (auch Futter und Funde), Sticker, Stationshintergründe, Knöpfe der Karte und „Vorlesen/Schließen/Zur Insel“, Schwierigkeits-Knöpfe, Sterne, Pip (Stufen `pip_baby` … `pip_forscher`), Figuren `kind_mia_…` usw., Forscher im Forscher-Lager, Museums-Guides, Skelette im Forscherhaus, Grabungsböden, alle Bilder des Experimentebuchs (`experimente/…`).
Töne: alle Töne aus `tools/toene-liste.txt`, alle Sprachaufnahmen, die Musik der Inselkarte.
Für weitere Stellen gibt es im Code `ASSETS.url('ordner/name')`, `ASSETS.img(…)`, `ASSETS.image(…)` (Bilder) und `ASSETS.sound('toene/name')`, `ASSETS.voice('Satz.')`, `ASSETS.music()` (Töne).

Zum Testen der Spiele: `index.html?debug=1` schaltet Test-Hilfen (`window.__…`) frei.
