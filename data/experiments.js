/* ============================================================
   MEIN DINO-FORSCHERBUCH – Inhaltsdaten
   100 Experimente in 10 Kapiteln.
   Alle Texte hier ändern – die App liest nur aus dieser Datei.

   Feldnamen:
   k  = Kapitelnummer (1-10)
   t  = Titel
   i  = Symbol (Emoji oder später eigene Grafik)
   f  = Forscherfrage (wird vorgelesen)
   m  = Material
   s  = Schritte
   w  = Dino-Wissen (Fakt zum Staunen)
   ty = Art: photo | draw | build | observe | measure | own
   v  = Vermutungs-Auswahl (Kind tippt vorher auf eine Karte)
   ============================================================ */

const KAPITEL = [
  { n: 1,  t: 'Spuren & Fossilien',      i: '👣', farbe: '#a8724a' },
  { n: 2,  t: 'Riesig & Winzig',         i: '📏', farbe: '#7d8f4f' },
  { n: 3,  t: 'Schnell & Stark',         i: '🦵', farbe: '#c0793a' },
  { n: 4,  t: 'Zähne & Futter',          i: '🦷', farbe: '#a4573f' },
  { n: 5,  t: 'Eier & Nester',           i: '🥚', farbe: '#b58f3e' },
  { n: 6,  t: 'Dino-Sinne',              i: '👂', farbe: '#6f8a86' },
  { n: 7,  t: 'Tarnung & Farben',        i: '🎨', farbe: '#5f7f52' },
  { n: 8,  t: 'Wasser, Luft & Fliegen',  i: '🪶', farbe: '#5b7d99' },
  { n: 9,  t: 'Urzeit-Welt',             i: '🌋', farbe: '#96513f' },
  { n: 10, t: 'Dinos heute',             i: '🐦', farbe: '#7a6ba0' }
];

const EXPERIMENTS = [

/* ── Kapitel 1 · Spuren & Fossilien ───────────────────────── */
{k:1,t:'Spuren lesen',i:'👣',f:'Wer ist hier gelaufen?',m:['Lupe'],s:['Suche draußen einen Abdruck im Sand, Schlamm oder Schnee.','Fotografiere ihn von oben.','Male einen Pfeil in die Laufrichtung.'],w:'Forscher nennen versteinerte Fußspuren Ichnofossilien. Sie verraten, wie schnell ein Dino lief.',ty:'photo',v:[{e:'🐦',l:'Ein Vogel'},{e:'🐕',l:'Ein Hund'},{e:'👟',l:'Ein Mensch'},{e:'❓',l:'Ein Rätsel'}]},
{k:1,t:'Mein eigener Abdruck',i:'🦶',f:'Wie sieht dein Fußabdruck aus?',m:['Sand oder Knete','Wasser'],s:['Drücke deinen Fuß fest in feuchten Sand.','Fotografiere den Abdruck.','Zähle die Zehen und male sie nach.'],w:'Viele Dinos liefen auf drei kräftigen Zehen – so wie Hühner heute.',ty:'photo',v:[{e:'3️⃣',l:'3 Zehen'},{e:'5️⃣',l:'5 Zehen'},{e:'🐾',l:'Ballen'}]},
{k:1,t:'Fossil aus Salzteig',i:'🪨',f:'Wie kommt ein Abdruck in den Stein?',m:['Mehl','Salz','Wasser','Muschel oder Blatt'],s:['Knete einen flachen Teigfladen.','Drücke eine Muschel oder ein Blatt hinein.','Nimm sie vorsichtig heraus und lass alles trocknen.'],w:'Echte Fossilien brauchen Millionen Jahre. Dein Teig-Fossil ist morgen fertig.',ty:'build',v:[{e:'🐚',l:'Muschel'},{e:'🍃',l:'Blatt'},{e:'🌿',l:'Zweig'}]},
{k:1,t:'Schichten der Erde',i:'🧱',f:'Warum liegen alte Dinge ganz unten?',m:['Glas','Sand','Erde','Kies'],s:['Fülle das Glas schichtweise: erst Kies, dann Erde, dann Sand.','Lege in jede Schicht ein winziges Fundstück.','Zeichne die Schichten ab und beschrifte die älteste.'],w:'Je tiefer eine Gesteinsschicht liegt, desto älter ist sie meistens.',ty:'build',v:[{e:'⬆️',l:'Oben'},{e:'⬇️',l:'Unten'},{e:'🤷',l:'Egal'}]},
{k:1,t:'Blattdruck',i:'🍃',f:'Kann ein Blatt eine Spur hinterlassen?',m:['Blätter','Papier','Wachsmalstift'],s:['Lege ein Blatt unter das Papier.','Male mit der flachen Seite des Stifts darüber.','Vergleiche zwei verschiedene Blätter.'],w:'Auch Pflanzen werden zu Fossilien. So wissen wir, was Dinos gefressen haben.',ty:'draw',v:[{e:'🌳',l:'Eiche'},{e:'🍁',l:'Ahorn'},{e:'🌿',l:'Farn'}]},
{k:1,t:'Wie groß war der Läufer?',i:'📐',f:'Verrät die Spur die Größe des Tieres?',m:['Maßband oder Schnur'],s:['Miss die Länge eines Fußabdrucks.','Rechne: Abdruck mal vier ist ungefähr die Beinlänge.','Schreibe dein Ergebnis auf.'],w:'Paläontologen schätzen die Höhe eines Dinos aus der Länge seines Fußabdrucks.',ty:'measure',v:[{e:'🐁',l:'Winzig'},{e:'🐕',l:'Mittel'},{e:'🦕',l:'Riesig'}]},
{k:1,t:'Ausgrabung',i:'⛏️',f:'Was liegt unter dem Sand versteckt?',m:['Sandkiste','Pinsel','Löffel'],s:['Lass jemanden kleine Gegenstände vergraben.','Grabe vorsichtig mit dem Pinsel, nicht mit den Händen.','Fotografiere jeden Fund, bevor du ihn hochhebst.'],w:'Echte Forscher fotografieren jeden Knochen, bevor sie ihn bewegen. Sonst geht die Information verloren.',ty:'photo',v:[{e:'🦴',l:'Knochen'},{e:'🪨',l:'Stein'},{e:'🐚',l:'Muschel'}]},
{k:1,t:'Steine untersuchen',i:'🔎',f:'Sind alle Steine gleich?',m:['Lupe','5 Steine'],s:['Sammle fünf verschiedene Steine.','Schau jeden mit der Lupe an.','Sortiere sie von rau nach glatt.'],w:'Glatte Steine sind oft lange im Wasser gerollt. Raue Steine sind frisch abgebrochen.',ty:'observe',v:[{e:'🪨',l:'Rau'},{e:'⚪',l:'Glatt'},{e:'✨',l:'Glitzernd'}]},
{k:1,t:'Wer lief schneller?',i:'💨',f:'Verraten Schritte die Geschwindigkeit?',m:['Sand oder Kreide'],s:['Gehe langsam zehn Schritte und markiere sie.','Renne dieselbe Strecke und markiere wieder.','Vergleiche die Abstände.'],w:'Große Abstände zwischen Spuren bedeuten: Das Tier rannte.',ty:'measure',v:[{e:'🐢',l:'Langsam'},{e:'🚶',l:'Normal'},{e:'🏃',l:'Schnell'}]},
{k:1,t:'Meine Fundkarte',i:'🗺️',f:'Wo hast du etwas entdeckt?',m:['Stift'],s:['Zeichne eine Karte von deinem Forschungsort.','Male ein Kreuz an jede Fundstelle.','Schreibe dazu, was du dort gefunden hast.'],w:'Ohne Fundkarte weiß niemand mehr, wo ein Fossil gelegen hat.',ty:'draw',v:[{e:'🏡',l:'Zuhause'},{e:'🌳',l:'Park'},{e:'🏖️',l:'Sandkiste'}]},

/* ── Kapitel 2 · Riesig & Winzig ──────────────────────────── */
{k:2,t:'So lang wie ein Brachiosaurus',i:'📏',f:'Wie lang sind 23 Meter?',m:['Schnur oder Schritte'],s:['Gehe 30 große Schritte geradeaus.','Schau zurück – so lang war ein Brachiosaurus.','Fotografiere die Strecke.'],w:'Brachiosaurus war etwa so lang wie zwei Busse hintereinander.',ty:'measure',v:[{e:'🚗',l:'Wie ein Auto'},{e:'🚌',l:'Wie ein Bus'},{e:'🏠',l:'Wie ein Haus'}]},
{k:2,t:'Größenvergleich',i:'🧍',f:'Wie klein bist du neben einem Dino?',m:['Stift'],s:['Male dich selbst an den Rand der Seite.','Male daneben einen Dino, der zehnmal größer ist.','Zähle, wie oft du hineinpasst.'],w:'Ein T-Rex war etwa so hoch wie ein Doppeldeckerbus.',ty:'draw',v:[{e:'2️⃣',l:'2 mal'},{e:'5️⃣',l:'5 mal'},{e:'🔟',l:'10 mal'}]},
{k:2,t:'Wie groß war ein Dino-Ei?',i:'🥚',f:'Passt ein Dino-Ei in deine Hand?',m:['Ball','Apfel','Hühnerei'],s:['Lege einen Ball, einen Apfel und ein Ei nebeneinander.','Fotografiere sie mit deiner Hand daneben.','Kreise das ein, was du für ein Dino-Ei hältst.'],w:'Selbst die größten Dino-Eier waren kaum größer als ein Fußball.',ty:'photo',v:[{e:'🥚',l:'Hühnerei'},{e:'🍎',l:'Apfel'},{e:'⚽',l:'Fußball'}]},
{k:2,t:'Fußabdruck in Lebensgröße',i:'🎨',f:'Wie groß war ein Dino-Fuß wirklich?',m:['Kreide','Draußen-Platz'],s:['Male mit Kreide einen Fuß von einem Meter Länge.','Stelle dich hinein.','Fotografiere dich im Abdruck.'],w:'In den Fußabdruck eines Sauropoden passt ein ganzes Kind zum Sitzen.',ty:'photo',v:[{e:'👣',l:'Kleiner'},{e:'🦶',l:'Genau'},{e:'🦕',l:'Größer'}]},
{k:2,t:'Waage bauen',i:'⚖️',f:'Was ist schwerer?',m:['Bügel oder Lineal','Schnur','2 Becher'],s:['Hänge zwei Becher an ein Lineal und balanciere es aus.','Lege links und rechts verschiedene Dinge hinein.','Notiere, was schwerer war.'],w:'Argentinosaurus wog so viel wie zehn Elefanten.',ty:'build',v:[{e:'🪨',l:'Stein'},{e:'🍎',l:'Apfel'},{e:'🪶',l:'Feder'}]},
{k:2,t:'Der kleinste Dino',i:'🐦',f:'Waren alle Dinos riesig?',m:['Lineal'],s:['Miss 30 Zentimeter ab – so groß war ein kleiner Raubdino.','Suche etwas in deinem Zimmer, das genauso groß ist.','Fotografiere es.'],w:'Der kleinste bekannte Dino war ungefähr so groß wie eine Taube.',ty:'measure',v:[{e:'🐁',l:'Wie eine Maus'},{e:'🐦',l:'Wie ein Vogel'},{e:'🐈',l:'Wie eine Katze'}]},
{k:2,t:'Der lange Hals',i:'🦒',f:'Wozu braucht man einen langen Hals?',m:['Papprollen','Klebeband'],s:['Klebe Rollen zu einem langen Hals zusammen.','Halte ihn hoch – was kannst du damit erreichen?','Male, was oben zu fressen wäre.'],w:'Mamenchisaurus hatte einen Hals von zwölf Metern – halb so lang wie sein ganzer Körper.',ty:'build',v:[{e:'🍃',l:'Hohe Blätter'},{e:'💧',l:'Wasser'},{e:'👀',l:'Weit sehen'}]},
{k:2,t:'Wie viele Kinder?',i:'👧',f:'Wie schwer ist ein T-Rex?',m:['Stift'],s:['Ein T-Rex wog etwa 7000 Kilo.','Ein Kind wiegt etwa 25 Kilo. Schätze, wie viele Kinder das sind.','Male eine Reihe Strichmännchen als Antwort.'],w:'Es wären ungefähr 280 Kinder nötig, um einen T-Rex aufzuwiegen.',ty:'draw',v:[{e:'🔟',l:'Etwa 10'},{e:'💯',l:'Etwa 100'},{e:'🌟',l:'Über 200'}]},
{k:2,t:'Ein Zahn so groß wie...',i:'🍌',f:'Wie groß war ein T-Rex-Zahn?',m:['Banane','Lineal'],s:['Ein großer T-Rex-Zahn war 20 Zentimeter lang.','Lege eine Banane daneben und miss sie.','Zeichne den Zahn in Originalgröße.'],w:'Ein T-Rex verlor ständig Zähne – und es wuchsen sofort neue nach.',ty:'measure',v:[{e:'🌰',l:'Wie eine Nuss'},{e:'🍌',l:'Wie eine Banane'},{e:'🥕',l:'Wie eine Möhre'}]},
{k:2,t:'Mein Dino-Maßband',i:'🧵',f:'Wie misst man ohne Lineal?',m:['Schnur','Schere','Stift'],s:['Schneide eine Schnur so lang wie dein Arm ab.','Miss damit drei Dinge im Raum.','Schreibe auf: Wie viele Armlängen?'],w:'Früher maßen Menschen mit Füßen, Ellen und Schritten – jeder hatte andere Maße.',ty:'measure',v:[{e:'1️⃣',l:'1 Arm'},{e:'3️⃣',l:'3 Arme'},{e:'🔟',l:'10 Arme'}]},

/* ── Kapitel 3 · Schnell & Stark ──────────────────────────── */
{k:3,t:'Wie schnell bist du?',i:'🏃',f:'Wärst du schneller als ein Raubdino?',m:['Stoppuhr','Freie Strecke'],s:['Miss zehn Meter ab.','Laufe los und lass jemanden stoppen.','Notiere deine Zeit.'],w:'Ein Velociraptor lief etwa 40 km/h – ungefähr so schnell wie ein Fahrrad bergab.',ty:'measure',v:[{e:'🐢',l:'Langsam'},{e:'🚶',l:'Mittel'},{e:'🏃',l:'Schnell'},{e:'🚀',l:'Superschnell'}]},
{k:3,t:'Zwei Beine oder vier?',i:'🦵',f:'Womit kommst du schneller voran?',m:['Freie Fläche'],s:['Laufe eine kurze Strecke auf zwei Beinen.','Krabbele dieselbe Strecke auf allen vieren.','Vergleiche und schreibe auf, was leichter war.'],w:'Viele Dinos wechselten: Sie grasten auf vier Beinen und rannten auf zwei.',ty:'observe',v:[{e:'🧍',l:'Zwei Beine'},{e:'🐾',l:'Vier Beine'},{e:'🤝',l:'Gleich'}]},
{k:3,t:'Der Schwanz als Balance',i:'⚖️',f:'Hilft ein Schwanz beim Balancieren?',m:['Besenstiel oder Stab','Linie am Boden'],s:['Balanciere auf einer Linie mit hängenden Armen.','Balanciere noch einmal mit ausgestrecktem Stab.','Was war leichter?'],w:'Der schwere Schwanz eines T-Rex war das Gegengewicht zu seinem Kopf.',ty:'observe',v:[{e:'🙌',l:'Mit Stab'},{e:'🙆',l:'Ohne Stab'},{e:'🤝',l:'Gleich'}]},
{k:3,t:'Schritte zählen',i:'👣',f:'Wie viele Schritte brauchst du?',m:['Zimmer oder Weg'],s:['Zähle deine Schritte durch den Raum.','Mache jetzt Riesenschritte und zähle noch einmal.','Male beide Zahlen auf.'],w:'Ein Sauropode brauchte für dieselbe Strecke nur wenige Schritte – seine Beine waren so lang wie ein Auto.',ty:'measure',v:[{e:'5️⃣',l:'Unter 10'},{e:'🔟',l:'10 bis 20'},{e:'💯',l:'Über 20'}]},
{k:3,t:'Wer zieht stärker?',i:'🪢',f:'Wie stark bist du?',m:['Weiches Seil oder Tuch'],s:['Zieht zu zweit vorsichtig an einem Tuch.','Probiert es mit einer Hand und mit beiden.','Notiert, was den Unterschied macht.'],w:'Triceratops schob mit seinem Nackenschild Gegner zur Seite – wie ein Bulldozer.',ty:'observe',v:[{e:'✋',l:'Eine Hand'},{e:'🙌',l:'Zwei Hände'},{e:'🦵',l:'Ganzer Körper'}]},
{k:3,t:'Weitsprung',i:'🦘',f:'Wie weit springst du?',m:['Kreide','Maßband'],s:['Springe aus dem Stand so weit du kannst.','Markiere die Landung mit Kreide.','Miss die Strecke und schreibe sie auf.'],w:'Kleine Raubdinos sprangen wahrscheinlich weiter als jeder Mensch.',ty:'measure',v:[{e:'📏',l:'Unter 1 m'},{e:'📐',l:'Etwa 1 m'},{e:'🌟',l:'Über 1 m'}]},
{k:3,t:'Panzer-Test',i:'🛡️',f:'Welcher Schutz hält am besten?',m:['Ei oder Ball','Papier','Tuch','Karton'],s:['Wickle einen Ball einmal in Papier, einmal in ein Tuch.','Lass ihn aus kleiner Höhe fallen.','Male, welcher Schutz gewonnen hat.'],w:'Ankylosaurus trug Knochenplatten auf dem Rücken – wie ein lebender Panzer.',ty:'build',v:[{e:'📄',l:'Papier'},{e:'🧣',l:'Tuch'},{e:'📦',l:'Karton'}]},
{k:3,t:'Stampf-Erschütterung',i:'💥',f:'Kann man Schritte im Wasser sehen?',m:['Glas Wasser','Tisch'],s:['Stelle ein halbvolles Glas auf den Tisch.','Stampfe daneben auf den Boden.','Beobachte die Wellen und male sie.'],w:'Schwere Dinos ließen den Boden vibrieren. Andere Tiere spürten sie, bevor sie sie sahen.',ty:'observe',v:[{e:'💧',l:'Kleine Wellen'},{e:'🌊',l:'Große Wellen'},{e:'😐',l:'Nichts'}]},
{k:3,t:'Schwere Last tragen',i:'🎒',f:'Wie viel kannst du tragen?',m:['Rucksack','Bücher'],s:['Packe erst ein Buch in den Rucksack und gehe zehn Schritte.','Packe drei Bücher dazu und gehe wieder.','Beschreibe den Unterschied.'],w:'Die Beine der Sauropoden waren Säulen aus dickem Knochen – nur so trugen sie ihr Gewicht.',ty:'observe',v:[{e:'😊',l:'Leicht'},{e:'😮',l:'Geht so'},{e:'😅',l:'Ganz schön schwer'}]},
{k:3,t:'Ausdauer-Test',i:'⏱️',f:'Wie lange hältst du durch?',m:['Stoppuhr'],s:['Stehe auf einem Bein und lass die Zeit laufen.','Probiere es mit geschlossenen Augen noch einmal.','Notiere beide Zeiten.'],w:'Flamingos stehen stundenlang auf einem Bein – auch sie sind Dino-Verwandte.',ty:'measure',v:[{e:'⏱️',l:'Unter 10 s'},{e:'⏰',l:'10 bis 30 s'},{e:'🏆',l:'Über 30 s'}]},

/* ── Kapitel 4 · Zähne & Futter ───────────────────────────── */
{k:4,t:'Spitz oder flach?',i:'🦷',f:'Was verraten Zähne über das Futter?',m:['Spiegel'],s:['Schau dir deine Zähne im Spiegel an.','Finde die spitzen vorne und die flachen hinten.','Male beide Formen auf.'],w:'Spitze Zähne reißen Fleisch. Flache Zähne mahlen Pflanzen. Du hast beides.',ty:'draw',v:[{e:'📌',l:'Spitz'},{e:'⬜',l:'Flach'},{e:'🤝',l:'Beides'}]},
{k:4,t:'Blätter rupfen',i:'🍃',f:'Wie frisst man Blätter ohne Hände?',m:['Blätter oder Salat','Kamm'],s:['Ziehe einen Kamm durch die Blätter, ohne die Hände zu benutzen.','Probiere es dann nur mit den Lippen.','Was hat besser funktioniert?'],w:'Diplodocus hatte Zähne wie einen Rechen: Er streifte Blätter von Zweigen ab.',ty:'observe',v:[{e:'🪥',l:'Kamm'},{e:'👄',l:'Lippen'},{e:'✋',l:'Hände'}]},
{k:4,t:'Reißen oder mahlen',i:'🥕',f:'Wie zerkleinerst du dein Essen?',m:['Möhre','Apfel'],s:['Beiße vorsichtig ein Stück Möhre ab.','Achte darauf, welche Zähne du benutzt.','Male die Zähne, die am meisten arbeiten.'],w:'Hadrosaurier hatten über 1000 Zähne, die wie eine Mühle zusammenarbeiteten.',ty:'observe',v:[{e:'😬',l:'Vorne'},{e:'😁',l:'Hinten'},{e:'🤝',l:'Beides'}]},
{k:4,t:'Magensteine',i:'🪨',f:'Warum schlucken Tiere Steine?',m:['Flasche','Wasser','Kieselsteine','Salatblatt'],s:['Fülle Wasser und ein Blatt in eine Flasche und schüttle.','Gib Kieselsteine dazu und schüttle wieder.','Vergleiche, was mit dem Blatt passiert.'],w:'Sauropoden schluckten Steine, die im Magen das Futter zerrieben. Sie hießen Gastrolithen.',ty:'observe',v:[{e:'🍃',l:'Bleibt ganz'},{e:'✂️',l:'Zerfällt'},{e:'❓',l:'Weiß nicht'}]},
{k:4,t:'Fressende Tiere beobachten',i:'👀',f:'Wie frisst ein Tier heute?',m:['Geduld','Kamera'],s:['Beobachte einen Vogel, ein Eichhörnchen oder ein Haustier beim Fressen.','Fotografiere oder male, wie es das Futter hält.','Beschreibe, was der Schnabel oder das Maul tut.'],w:'Vögel haben keine Zähne. Sie zerkleinern Futter in einem Muskelmagen.',ty:'photo',v:[{e:'🐦',l:'Vogel'},{e:'🐿️',l:'Eichhörnchen'},{e:'🐈',l:'Haustier'}]},
{k:4,t:'Zahnabdruck in Knete',i:'🍪',f:'Hinterlässt jeder Biss dieselbe Spur?',m:['Knete','Apfel'],s:['Beiße vorsichtig in einen Apfel und schau dir die Spur an.','Drücke eine Gabel in Knete.','Vergleiche beide Muster.'],w:'An Bissspuren in Fossilien erkennen Forscher, welcher Dino wen gefressen hat.',ty:'observe',v:[{e:'🍎',l:'Apfel'},{e:'🍴',l:'Gabel'},{e:'🤝',l:'Ähnlich'}]},
{k:4,t:'Ein Berg Futter',i:'🥗',f:'Wie viel frisst ein Riese am Tag?',m:['Salat','Schüssel'],s:['Fülle eine Schüssel mit Salat.','Ein Sauropode fraß etwa 500 Kilo am Tag.','Male, wie hoch dieser Berg wäre.'],w:'Ein großer Pflanzenfresser fraß fast den ganzen Tag – zum Kauen blieb kaum Zeit.',ty:'draw',v:[{e:'🥗',l:'Eine Schüssel'},{e:'🛒',l:'Ein Wagen'},{e:'🚛',l:'Ein Lastwagen'}]},
{k:4,t:'Schnabel-Werkzeuge',i:'🥄',f:'Welcher Schnabel passt zu welchem Futter?',m:['Pinzette','Löffel','Reis','Wasser'],s:['Hole Reiskörner mit der Pinzette heraus.','Schöpfe Wasser mit dem Löffel.','Notiere, welches Werkzeug wozu passt.'],w:'Jeder Vogelschnabel ist ein Spezialwerkzeug – vom Nussknacker bis zum Sieb.',ty:'observe',v:[{e:'🥢',l:'Pinzette'},{e:'🥄',l:'Löffel'},{e:'🤝',l:'Beides'}]},
{k:4,t:'Kauen zählen',i:'🔢',f:'Wie oft kaust du?',m:['Apfelstück'],s:['Nimm einen Bissen und zähle deine Kaubewegungen.','Probiere es mit Brot noch einmal.','Vergleiche die Zahlen.'],w:'Der T-Rex kaute überhaupt nicht. Er schluckte große Stücke im Ganzen.',ty:'measure',v:[{e:'5️⃣',l:'Unter 10'},{e:'🔟',l:'10 bis 20'},{e:'💯',l:'Über 20'}]},
{k:4,t:'Mein Dino-Menü',i:'📋',f:'Was würde dein Dino fressen?',m:['Stift'],s:['Erfinde einen Dino und gib ihm einen Namen.','Male drei Dinge auf seinen Speiseplan.','Male seine passenden Zähne dazu.'],w:'Manche Dinos fraßen beides: Pflanzen und Fleisch. Sie heißen Allesfresser.',ty:'draw',v:[{e:'🍃',l:'Pflanzen'},{e:'🍖',l:'Fleisch'},{e:'🍽️',l:'Alles'}]},

/* ── Kapitel 5 · Eier & Nester ────────────────────────────── */
{k:5,t:'Nest bauen',i:'🪹',f:'Woraus baut man ein gutes Nest?',m:['Zweige','Gras','Moos','Blätter'],s:['Sammle draußen weiche und feste Materialien.','Baue eine runde Mulde.','Fotografiere dein Nest von oben.'],w:'Manche Dinos bauten Nester dicht nebeneinander – wie eine Möwenkolonie.',ty:'build',v:[{e:'🌿',l:'Gras'},{e:'🪵',l:'Zweige'},{e:'🍂',l:'Blätter'}]},
{k:5,t:'Ei-Fall-Test',i:'📦',f:'Welche Polsterung schützt am besten?',m:['Ei aus Plastik','Watte','Papier','Tuch'],s:['Polstere dein Ei auf drei verschiedene Arten.','Lass es aus Tischhöhe auf eine weiche Unterlage fallen.','Male ein Häkchen bei der besten Polsterung.'],w:'Dino-Eier lagen weich in Pflanzen gebettet – das hielt sie warm und heil.',ty:'build',v:[{e:'☁️',l:'Watte'},{e:'📄',l:'Papier'},{e:'🧣',l:'Tuch'}]},
{k:5,t:'Warum rollt ein Ei im Kreis?',i:'🥚',f:'Rollt ein Ei geradeaus?',m:['Ei','Ball','Tisch'],s:['Rolle ein Ei über den Tisch.','Rolle danach einen Ball.','Male beide Wege auf.'],w:'Weil Eier spitz zulaufen, rollen sie im Kreis zurück – und nicht aus dem Nest.',ty:'observe',v:[{e:'➡️',l:'Geradeaus'},{e:'🔄',l:'Im Kreis'},{e:'❓',l:'Weiß nicht'}]},
{k:5,t:'Die Kraft der Kuppel',i:'🏛️',f:'Wie stark ist eine Eierschale?',m:['Eierschalenhälften','Bücher'],s:['Stelle vier Schalenhälften mit der Wölbung nach oben auf.','Lege vorsichtig ein Buch darauf.','Zähle, wie viele Bücher sie tragen.'],w:'Die Kuppelform verteilt das Gewicht – deshalb sind auch Brücken gewölbt.',ty:'build',v:[{e:'1️⃣',l:'1 Buch'},{e:'3️⃣',l:'3 Bücher'},{e:'5️⃣',l:'Mehr'}]},
{k:5,t:'Warm bleiben',i:'🌡️',f:'Was hält ein Ei warm?',m:['2 Eier','Tuch','Schüssel'],s:['Wickle ein Ei in ein Tuch, lass das andere frei liegen.','Warte zehn Minuten.','Fühle beide und beschreibe den Unterschied.'],w:'Oviraptor saß auf seinem Nest wie ein Vogel und wärmte die Eier mit dem Körper.',ty:'observe',v:[{e:'🧣',l:'Eingepackt'},{e:'❄️',l:'Frei'},{e:'🤝',l:'Gleich'}]},
{k:5,t:'Nest verstecken',i:'🍂',f:'Wie versteckt man ein Nest?',m:['Nest','Naturmaterial'],s:['Lege dein Nest an eine Stelle draußen.','Tarne es mit Blättern und Gras.','Fotografiere es und lass jemanden suchen.'],w:'Gut getarnte Nester werden von Räubern seltener gefunden.',ty:'photo',v:[{e:'👀',l:'Sofort gefunden'},{e:'🤔',l:'Gedauert'},{e:'🙈',l:'Nicht gefunden'}]},
{k:5,t:'Wie viele passen hinein?',i:'🔢',f:'Wie viele Eier fasst dein Nest?',m:['Nest','Bälle oder Steine'],s:['Lege so viele runde Dinge ins Nest, wie hineinpassen.','Zähle sie.','Male sie in dein Buch.'],w:'Manche Dino-Nester enthielten über 30 Eier – kreisförmig angeordnet.',ty:'measure',v:[{e:'3️⃣',l:'Bis 5'},{e:'🔟',l:'Bis 10'},{e:'💯',l:'Mehr'}]},
{k:5,t:'Schwimmt ein Ei?',i:'💧',f:'Geht ein Ei unter?',m:['Glas Wasser','Ei','Salz'],s:['Lege ein Ei in klares Wasser und beobachte.','Rühre viel Salz ins Wasser.','Male, was jetzt passiert.'],w:'In Salzwasser schwimmt ein Ei, weil salziges Wasser schwerer ist.',ty:'observe',v:[{e:'⬇️',l:'Sinkt'},{e:'⬆️',l:'Schwimmt'},{e:'↔️',l:'Schwebt'}]},
{k:5,t:'Vogelnest suchen',i:'🐣',f:'Wo bauen Vögel heute ihre Nester?',m:['Fernglas','Kamera'],s:['Suche draußen nach einem Nest – schau nach oben.','Fotografiere aus der Ferne, ohne zu stören.','Male, wo es gebaut wurde.'],w:'Vögel sind die einzigen Dinosaurier, die heute noch leben.',ty:'photo',v:[{e:'🌳',l:'Im Baum'},{e:'🏠',l:'Am Haus'},{e:'🌾',l:'Am Boden'}]},
{k:5,t:'Mein Dino schlüpft',i:'🐲',f:'Wie sieht ein Dino-Baby aus?',m:['Stift'],s:['Male ein Ei mit einem Riss.','Male das Baby, das herausschaut.','Gib ihm einen Namen.'],w:'Frisch geschlüpfte Dinos waren winzig – manche passten in eine Hand.',ty:'draw',v:[{e:'🥚',l:'Noch drin'},{e:'🐣',l:'Halb raus'},{e:'🦖',l:'Ganz draußen'}]},

/* ── Kapitel 6 · Dino-Sinne ───────────────────────────────── */
{k:6,t:'Eine Minute lauschen',i:'👂',f:'Wie viele Geräusche hörst du?',m:['Stoppuhr'],s:['Setz dich still hin und schließe die Augen.','Zähle eine Minute lang alle Geräusche.','Male für jedes Geräusch ein Symbol.'],w:'Dinosaurier hörten tiefe Töne besonders gut – die tragen weit durch den Wald.',ty:'observe',v:[{e:'1️⃣',l:'1 bis 3'},{e:'5️⃣',l:'4 bis 8'},{e:'🔟',l:'Mehr als 8'}]},
{k:6,t:'Große Ohren bauen',i:'📢',f:'Hört man mit größeren Ohren mehr?',m:['Papier','Klebeband'],s:['Halte die Hände hinter deine Ohren und lausche.','Forme einen Papiertrichter und lausche noch einmal.','Beschreibe den Unterschied.'],w:'Parasaurolophus hatte einen hohlen Kamm auf dem Kopf – vermutlich ein Tröte und ein Verstärker.',ty:'build',v:[{e:'✋',l:'Hände'},{e:'📄',l:'Trichter'},{e:'🤝',l:'Gleich'}]},
{k:6,t:'Riech-Dosen',i:'👃',f:'Erkennst du Dinge mit der Nase?',m:['3 Becher','Zitrone','Zimt','Seife'],s:['Lass jemanden drei Becher mit Duftproben füllen.','Rieche mit geschlossenen Augen.','Male, was du erkannt hast.'],w:'Der T-Rex hatte riesige Riechzentren im Gehirn. Er roch Beute vermutlich kilometerweit.',ty:'observe',v:[{e:'🍋',l:'Zitrone'},{e:'🌰',l:'Zimt'},{e:'🧼',l:'Seife'}]},
{k:6,t:'Jäger oder Gejagter?',i:'👁️',f:'Wozu sitzen Augen vorn oder seitlich?',m:['Spiegel'],s:['Schau in den Spiegel: Wo sitzen deine Augen?','Halte die Hände seitlich ans Gesicht – was siehst du noch?','Male beide Augenstellungen.'],w:'Jäger haben Augen vorn, um Entfernungen zu schätzen. Beutetiere haben sie seitlich, um alles zu sehen.',ty:'draw',v:[{e:'🐺',l:'Vorn: Jäger'},{e:'🐇',l:'Seitlich: Beute'},{e:'🤝',l:'Beides'}]},
{k:6,t:'Wie weit siehst du zur Seite?',i:'🔭',f:'Wie groß ist dein Blickfeld?',m:['Ein Helfer'],s:['Schau geradeaus und bewege nichts.','Lass jemanden langsam von hinten nach vorn winken.','Ruf Stopp, sobald du die Hand siehst.'],w:'Triceratops sah fast rundum – nur direkt hinter sich war ein blinder Fleck.',ty:'observe',v:[{e:'👀',l:'Sehr weit'},{e:'🙂',l:'Mittel'},{e:'🙈',l:'Nur vorn'}]},
{k:6,t:'Fühl-Beutel',i:'🤲',f:'Erkennst du Dinge nur mit den Händen?',m:['Beutel','5 Gegenstände'],s:['Lass jemanden fünf Dinge in einen Beutel legen.','Ertaste sie ohne zu schauen.','Male auf, was du erkannt hast.'],w:'Die Schnauze mancher Dinos war voller Nerven – wie die Fingerspitzen eines Menschen.',ty:'observe',v:[{e:'1️⃣',l:'1 bis 2'},{e:'3️⃣',l:'3 bis 4'},{e:'5️⃣',l:'Alle 5'}]},
{k:6,t:'Sehen im Dunkeln',i:'🌙',f:'Was siehst du bei wenig Licht?',m:['Dunkler Raum','Taschenlampe'],s:['Verdunkle einen Raum und warte zwei Minuten.','Schau dich um: Welche Farben erkennst du noch?','Male, was du siehst.'],w:'Manche kleinen Dinos hatten sehr große Augenringe – ein Hinweis auf Nachtaktivität.',ty:'observe',v:[{e:'🌈',l:'Alle Farben'},{e:'⚪',l:'Nur grau'},{e:'⬛',l:'Fast nichts'}]},
{k:6,t:'Vibration spüren',i:'📳',f:'Kann man mit dem Körper hören?',m:['Tisch'],s:['Lege dein Ohr flach auf den Tisch.','Lass jemanden am anderen Ende leise klopfen.','Vergleiche mit dem Hören durch die Luft.'],w:'Elefanten hören Erschütterungen mit den Füßen. Große Dinos konnten das wahrscheinlich auch.',ty:'observe',v:[{e:'👂',l:'Durch Luft'},{e:'🪵',l:'Durch Tisch'},{e:'🤝',l:'Gleich'}]},
{k:6,t:'Dino-Rufe erfinden',i:'🔊',f:'Wie klang ein Dinosaurier?',m:['Deine Stimme','Röhre'],s:['Rufe durch eine Papprolle.','Probiere hohe und tiefe Töne.','Male, welcher Ton zu welchem Dino passt.'],w:'Niemand weiß, wie Dinos klangen. Im Film sind es Geräusche von Elefanten und Krokodilen.',ty:'observe',v:[{e:'🔉',l:'Tief'},{e:'🔊',l:'Laut'},{e:'🎵',l:'Hoch'}]},
{k:6,t:'Was fällt sofort auf?',i:'🌈',f:'Welche Farbe siehst du zuerst?',m:['Bunte Gegenstände'],s:['Lege fünf verschiedenfarbige Dinge nebeneinander.','Tritt zurück und schau kurz hin.','Male die Farbe, die dir zuerst auffiel.'],w:'Auffällige Farben warnen oder locken an – beides gab es schon in der Urzeit.',ty:'draw',v:[{e:'🔴',l:'Rot'},{e:'🟡',l:'Gelb'},{e:'🟢',l:'Grün'},{e:'🔵',l:'Blau'}]},

/* ── Kapitel 7 · Tarnung & Farben ─────────────────────────── */
{k:7,t:'Verstecken üben',i:'🫥',f:'Wo verschwindet ein Gegenstand?',m:['Kleiner Gegenstand','Kamera'],s:['Suche einen Untergrund, auf dem dein Gegenstand kaum auffällt.','Fotografiere ihn dort.','Lass jemanden auf dem Foto suchen.'],w:'Tarnung funktioniert nur am passenden Ort. Auf falschem Untergrund fällt sie sofort auf.',ty:'photo',v:[{e:'🌿',l:'Im Grün'},{e:'🪨',l:'Auf Stein'},{e:'🏖️',l:'Im Sand'}]},
{k:7,t:'Streifen oder Flecken?',i:'🎨',f:'Welches Muster tarnt besser?',m:['Papier','Stifte'],s:['Male einen Dino mit Streifen und einen mit Flecken.','Lege beide auf gemustertes Papier.','Male ein Häkchen beim besseren Versteck.'],w:'Streifen lösen die Körperform auf. Flecken imitieren Lichtflecken im Blätterdach.',ty:'draw',v:[{e:'🦓',l:'Streifen'},{e:'🐆',l:'Flecken'},{e:'⬜',l:'Einfarbig'}]},
{k:7,t:'Blätter-Tarnung',i:'🍃',f:'Kannst du dich selbst tarnen?',m:['Naturmaterial','Kamera'],s:['Sammle Blätter, Gras und Zweige.','Verstecke deine Hand darunter.','Fotografiere und schau, ob man sie noch sieht.'],w:'Manche Insekten sehen aus wie Blätter – Tarnung ist uralt.',ty:'photo',v:[{e:'👀',l:'Gut sichtbar'},{e:'🤔',l:'Kaum'},{e:'🙈',l:'Unsichtbar'}]},
{k:7,t:'Farbe wechseln',i:'🦎',f:'Wie wirkt dieselbe Farbe auf verschiedenem Grund?',m:['Buntes Papier','Kleiner Zettel'],s:['Lege einen grünen Zettel auf grünen Grund.','Lege ihn auf braunen Grund.','Male beide Wirkungen.'],w:'Ein Chamäleon wechselt die Farbe nicht nur zur Tarnung, sondern auch aus Stimmung.',ty:'observe',v:[{e:'🟢',l:'Fällt auf'},{e:'🟤',l:'Verschwindet'},{e:'🤷',l:'Kein Unterschied'}]},
{k:7,t:'Welche Farbe hatte ein Dino?',i:'🖌️',f:'Weiß man, wie Dinos aussahen?',m:['Stifte'],s:['Male denselben Dino dreimal in verschiedenen Farben.','Überlege, welche Farbe zu seinem Lebensraum passt.','Kreise deine Wahl ein.'],w:'Aus winzigen Farbkörnern in Fossilfedern kennen Forscher die Farbe einiger Dinos wirklich.',ty:'draw',v:[{e:'🟤',l:'Braun'},{e:'🟢',l:'Grün'},{e:'🔴',l:'Bunt'}]},
{k:7,t:'Hell oben, dunkel unten',i:'🌗',f:'Warum sind viele Tiere unten heller?',m:['Ball','Lampe'],s:['Leuchte von oben auf einen Ball.','Schau, wo der Schatten liegt.','Male den Ball so an, dass er flach aussieht.'],w:'Helle Bäuche gleichen den Schatten aus. Dadurch wirken Tiere flach und fallen weniger auf.',ty:'draw',v:[{e:'⬆️',l:'Oben hell'},{e:'⬇️',l:'Unten hell'},{e:'⚪',l:'Ganz gleich'}]},
{k:7,t:'Warnfarben suchen',i:'⚠️',f:'Welche Farben sagen: Achtung!',m:['Kamera'],s:['Suche draußen etwas Auffälliges: Beere, Blüte, Käfer.','Fotografiere es aus sicherem Abstand.','Male die Farbe daneben.'],w:'Rot und Gelb heißen im Tierreich oft: Ich bin giftig oder wehrhaft.',ty:'photo',v:[{e:'🔴',l:'Rot'},{e:'🟡',l:'Gelb'},{e:'⚫',l:'Schwarz-gelb'}]},
{k:7,t:'Kopfschmuck bauen',i:'👑',f:'Wozu trägt ein Dino einen Kamm?',m:['Papier','Schere','Gummiband'],s:['Schneide einen Kamm oder ein Nackenschild aus.','Setze es auf.','Fotografiere dich als Dino.'],w:'Kämme und Hörner dienten oft nicht dem Kampf, sondern dem Beeindrucken.',ty:'build',v:[{e:'🛡️',l:'Zum Schutz'},{e:'✨',l:'Zum Angeben'},{e:'📢',l:'Zum Rufen'}]},
{k:7,t:'Wer sieht mich zuerst?',i:'🙈',f:'Wie gut versteckst du dich?',m:['Ein Helfer','Stoppuhr'],s:['Verstecke dich draußen oder im Zimmer.','Lass jemanden suchen und stoppe die Zeit.','Notiere, welches Versteck am längsten hielt.'],w:'Stillhalten hilft mehr als jede Farbe. Bewegung verrät Tiere sofort.',ty:'measure',v:[{e:'⏱️',l:'Unter 10 s'},{e:'⏰',l:'Bis 1 min'},{e:'🏆',l:'Länger'}]},
{k:7,t:'Mein Dino-Steckbrief',i:'📇',f:'Wie sieht dein Forscher-Dino aus?',m:['Stifte'],s:['Male deinen erfundenen Dino.','Schreibe Name, Größe und Lieblingsfutter dazu.','Male seinen Lebensraum in den Hintergrund.'],w:'Neue Dino-Arten werden bis heute entdeckt – etwa alle zwei Wochen eine.',ty:'draw',v:[{e:'🦕',l:'Pflanzenfresser'},{e:'🦖',l:'Räuber'},{e:'🐊',l:'Wasserdino'}]},

/* ── Kapitel 8 · Wasser, Luft & Fliegen ───────────────────── */
{k:8,t:'Schwimmt oder sinkt?',i:'💧',f:'Was bleibt oben?',m:['Schüssel Wasser','5 Gegenstände'],s:['Vermute zuerst bei jedem Gegenstand.','Lege sie nacheinander ins Wasser.','Male zwei Spalten: schwimmt und sinkt.'],w:'Manche Meeressaurier hatten leichte, luftgefüllte Knochen – andere schwere, um zu tauchen.',ty:'observe',v:[{e:'⬆️',l:'Schwimmt'},{e:'⬇️',l:'Sinkt'},{e:'🤔',l:'Kommt drauf an'}]},
{k:8,t:'Flossen testen',i:'🤚',f:'Was schiebt mehr Wasser?',m:['Schüssel Wasser'],s:['Ziehe die Hand mit gespreizten Fingern durchs Wasser.','Ziehe sie mit geschlossenen Fingern durch.','Beschreibe, was mehr Kraft brauchte.'],w:'Plesiosaurier ruderten mit vier großen Paddeln – wie ein Meeresschildkröte, nur größer.',ty:'observe',v:[{e:'🖐️',l:'Gespreizt'},{e:'✋',l:'Geschlossen'},{e:'🤝',l:'Gleich'}]},
{k:8,t:'Papier-Flugsaurier',i:'🛩️',f:'Welche Form fliegt am weitesten?',m:['Papier'],s:['Falte zwei verschiedene Flieger.','Wirf beide von derselben Stelle.','Miss die Weiten und male den Sieger.'],w:'Quetzalcoatlus hatte zwölf Meter Spannweite – so breit wie ein kleines Flugzeug.',ty:'build',v:[{e:'✈️',l:'Schmal'},{e:'🪁',l:'Breit'},{e:'🤝',l:'Gleich weit'}]},
{k:8,t:'Feder und Stein',i:'🪶',f:'Was fällt schneller?',m:['Feder','Stein'],s:['Lass beide gleichzeitig aus Schulterhöhe fallen.','Beobachte genau.','Male, was zuerst unten war.'],w:'Ohne Luft würden Feder und Stein gleich schnell fallen. Die Luft bremst die Feder.',ty:'observe',v:[{e:'🪶',l:'Feder'},{e:'🪨',l:'Stein'},{e:'🤝',l:'Gleichzeitig'}]},
{k:8,t:'Der Zauber der Tragfläche',i:'💨',f:'Warum hebt ein Flügel ab?',m:['Papierstreifen'],s:['Halte einen Papierstreifen an die Unterlippe.','Puste kräftig darüber hinweg.','Male, wohin sich das Papier bewegt.'],w:'Schnelle Luft über einem Flügel zieht ihn nach oben. So fliegen Vögel und Flugzeuge.',ty:'observe',v:[{e:'⬆️',l:'Nach oben'},{e:'⬇️',l:'Nach unten'},{e:'😐',l:'Bleibt liegen'}]},
{k:8,t:'Wasserabdruck',i:'🌊',f:'Kann man im Wasser Spuren hinterlassen?',m:['Wasserschüssel','Papier'],s:['Tauche deine Hand kurz ins Wasser.','Drücke sie auf trockenes Papier.','Beobachte, wie schnell die Spur verschwindet.'],w:'Es gibt Fossilspuren von Dinos, die nur mit den Zehenspitzen den Grund berührten – sie schwammen.',ty:'observe',v:[{e:'⏱️',l:'Sofort weg'},{e:'⏰',l:'Nach einer Weile'},{e:'♾️',l:'Bleibt'}]},
{k:8,t:'Fallschirm bauen',i:'🪂',f:'Was macht den Fall langsam?',m:['Tuch oder Tüte','Schnur','Kleines Gewicht'],s:['Binde vier Schnüre an die Ecken und ein Gewicht daran.','Lass den Fallschirm fallen.','Probiere eine kleinere Fläche und vergleiche.'],w:'Große Flächen fangen mehr Luft. Deshalb gleiten Flugsaurier mit riesigen Flügeln.',ty:'build',v:[{e:'🟦',l:'Groß'},{e:'🔹',l:'Klein'},{e:'🤝',l:'Gleich'}]},
{k:8,t:'Segel im Wind',i:'🌬️',f:'Was macht der Wind mit einem Kamm?',m:['Karton','Stift'],s:['Schneide eine Rückensegelform aus.','Halte sie in den Wind, längs und quer.','Beschreibe den Unterschied.'],w:'Spinosaurus trug ein riesiges Segel auf dem Rücken – vielleicht zum Kühlen, vielleicht zum Imponieren.',ty:'observe',v:[{e:'↔️',l:'Quer stärker'},{e:'↕️',l:'Längs stärker'},{e:'🤝',l:'Gleich'}]},
{k:8,t:'Blubbern',i:'🫧',f:'Wie sieht Atmen unter Wasser aus?',m:['Glas Wasser','Strohhalm'],s:['Puste vorsichtig durch den Halm ins Wasser.','Puste einmal sanft, einmal kräftig.','Male die Blasen in beiden Größen.'],w:'Meeressaurier atmeten Luft. Sie mussten regelmäßig auftauchen wie Wale.',ty:'observe',v:[{e:'🫧',l:'Kleine Blasen'},{e:'💨',l:'Große Blasen'},{e:'🌊',l:'Sprudel'}]},
{k:8,t:'Wellen machen',i:'〰️',f:'Wie entstehen Wellen?',m:['Wanne oder Schüssel'],s:['Tippe mit einem Finger ins Wasser und beobachte die Ringe.','Wische mit der ganzen Hand.','Male beide Wellenbilder.'],w:'Ein schwimmender Riesendino machte Wellen, die andere Tiere schon von weitem spürten.',ty:'observe',v:[{e:'⭕',l:'Ringe'},{e:'〰️',l:'Lange Wellen'},{e:'🌊',l:'Chaos'}]},

/* ── Kapitel 9 · Urzeit-Welt ──────────────────────────────── */
{k:9,t:'Vulkanausbruch',i:'🌋',f:'Was passiert, wenn ein Vulkan ausbricht?',m:['Natron','Essig','Becher','Schale'],s:['Stelle einen Becher in eine Schale und fülle Natron hinein.','Gieße Essig dazu und tritt zurück.','Fotografiere den Ausbruch.'],w:'Vulkanasche hat viele Fossilien schlagartig eingeschlossen und für uns aufbewahrt.',ty:'build',v:[{e:'🫧',l:'Schaum'},{e:'💥',l:'Fontäne'},{e:'😐',l:'Nichts'}]},
{k:9,t:'Erdschichten im Glas',i:'🫙',f:'Wie sortiert sich Erde im Wasser?',m:['Glas mit Deckel','Erde','Sand','Wasser'],s:['Fülle Erde, Sand und Wasser ins Glas und schüttle.','Stelle es hin und warte eine Stunde.','Male die Schichten ab.'],w:'Schwere Körner sinken zuerst. So entstehen über Jahrtausende Gesteinsschichten.',ty:'observe',v:[{e:'🪨',l:'Kies unten'},{e:'🏖️',l:'Sand unten'},{e:'🟤',l:'Erde unten'}]},
{k:9,t:'Pangäa puzzeln',i:'🧩',f:'Passen die Kontinente zusammen?',m:['Weltkarte','Papier','Schere'],s:['Male Afrika und Südamerika ab und schneide sie aus.','Schiebe sie aneinander.','Male, wie gut sie passen.'],w:'Zur Dino-Zeit lagen alle Kontinente in einem einzigen Superkontinent: Pangäa.',ty:'build',v:[{e:'✅',l:'Passt genau'},{e:'🤏',l:'Fast'},{e:'❌',l:'Gar nicht'}]},
{k:9,t:'Einschlagkrater',i:'☄️',f:'Was macht ein Meteorit mit dem Boden?',m:['Schüssel Mehl','Kakao','Murmel'],s:['Streue Kakao über eine Schüssel Mehl.','Lass eine Murmel aus verschiedenen Höhen fallen.','Fotografiere die Krater.'],w:'Vor 66 Millionen Jahren schlug ein Asteroid ein. Das war das Ende der großen Dinos.',ty:'photo',v:[{e:'🔽',l:'Niedrig: klein'},{e:'⬆️',l:'Hoch: groß'},{e:'🤝',l:'Immer gleich'}]},
{k:9,t:'Regen und Erosion',i:'🌧️',f:'Kann Wasser Land verändern?',m:['Sandhaufen','Gießkanne'],s:['Baue einen kleinen Sandberg.','Gieße vorsichtig Wasser darüber.','Fotografiere vorher und nachher.'],w:'Erosion legt Fossilien frei. Viele Funde entdeckt man nach starkem Regen.',ty:'photo',v:[{e:'😐',l:'Bleibt gleich'},{e:'〰️',l:'Rillen'},{e:'💥',l:'Fällt zusammen'}]},
{k:9,t:'Urzeitpflanzen finden',i:'🌿',f:'Welche Pflanzen gab es schon damals?',m:['Kamera','Lupe'],s:['Suche Farne, Moose oder Schachtelhalme.','Fotografiere eine Pflanze aus der Nähe.','Male die Blattform nach.'],w:'Farne und Schachtelhalme wuchsen schon, bevor es Dinos gab – und wachsen heute noch.',ty:'photo',v:[{e:'🌿',l:'Farn'},{e:'🍀',l:'Moos'},{e:'🌾',l:'Schachtelhalm'}]},
{k:9,t:'Schatten wandert',i:'☀️',f:'Bewegt sich ein Schatten?',m:['Stock','Kreide','Sonniger Platz'],s:['Stelle einen Stock in die Sonne und male den Schatten nach.','Komme eine Stunde später wieder und male erneut.','Vergleiche beide Linien.'],w:'Auch die Dinos lebten nach Sonne und Schatten – Uhren gab es nicht.',ty:'draw',v:[{e:'➡️',l:'Wandert'},{e:'📏',l:'Wird länger'},{e:'😐',l:'Bleibt gleich'}]},
{k:9,t:'Insekt im Bernstein',i:'🟠',f:'Wie bleibt etwas Millionen Jahre erhalten?',m:['Gelatine oder Honig','Kleines Glas','Blatt'],s:['Lege ein kleines Blatt in ein Glas.','Gieße Gelatine oder Honig darüber.','Warte, bis es fest ist, und schau von der Seite hinein.'],w:'Bernstein ist versteinertes Baumharz. Darin stecken manchmal Insekten und sogar Federn.',ty:'build',v:[{e:'🍃',l:'Blatt'},{e:'🐜',l:'Insekt'},{e:'🪶',l:'Feder'}]},
{k:9,t:'Sonnenplatz',i:'🦎',f:'Wo wird es am schnellsten warm?',m:['Zwei Steine'],s:['Lege einen Stein in die Sonne, einen in den Schatten.','Warte 20 Minuten.','Fühle beide und schreibe auf, welcher wärmer war.'],w:'Reptilien wärmen sich in der Sonne. Viele Dinos konnten ihre Wärme dagegen selbst erzeugen.',ty:'observe',v:[{e:'☀️',l:'Sonne'},{e:'🌥️',l:'Schatten'},{e:'🤝',l:'Gleich'}]},
{k:9,t:'Urzeit-Sumpf',i:'🫗',f:'Was passiert mit Schlamm im Glas?',m:['Glas','Erde','Wasser','Zweige'],s:['Rühre Erde in Wasser und gib Zweige dazu.','Stelle das Glas an einen ruhigen Ort.','Male nach einem Tag, was du siehst.'],w:'In Sümpfen sinken tote Tiere schnell ein. Deshalb wurden dort besonders viele Fossilien.',ty:'observe',v:[{e:'⬆️',l:'Zweige oben'},{e:'⬇️',l:'Zweige unten'},{e:'🌫️',l:'Alles trüb'}]},

/* ── Kapitel 10 · Dinos heute ─────────────────────────────── */
{k:10,t:'Vögel beobachten',i:'🐦',f:'Bewegen sich Vögel wie Dinos?',m:['Fernglas','Kamera'],s:['Beobachte einen Vogel fünf Minuten lang.','Achte auf Kopf, Beine und Schwanz.','Male oder fotografiere seine Haltung.'],w:'Vögel sind Dinosaurier. Sie stammen von kleinen, gefiederten Raubdinos ab.',ty:'photo',v:[{e:'🚶',l:'Läuft'},{e:'🦘',l:'Hüpft'},{e:'🕊️',l:'Fliegt'}]},
{k:10,t:'Der Gabelknochen',i:'🦴',f:'Welchen Knochen teilen Huhn und T-Rex?',m:['Bild oder Knochen'],s:['Suche ein Bild vom Gabelbein eines Huhns.','Male die V-Form nach.','Male denselben Knochen in einen Dino hinein.'],w:'Das Gabelbein gab es schon beim T-Rex. Es hält die Schultern beim Flügelschlag zusammen.',ty:'draw',v:[{e:'🔤',l:'V-Form'},{e:'⭕',l:'Rund'},{e:'📏',l:'Gerade'}]},
{k:10,t:'Federn untersuchen',i:'🪶',f:'Wie ist eine Feder gebaut?',m:['Feder','Lupe'],s:['Schau eine gefundene Feder durch die Lupe an.','Streiche einmal gegen die Richtung und wieder zurück.','Male die feinen Härchen auf.'],w:'Die Häkchen an den Federästen greifen ineinander wie ein Reißverschluss.',ty:'observe',v:[{e:'🪶',l:'Weich'},{e:'📏',l:'Steif'},{e:'🤝',l:'Beides'}]},
{k:10,t:'Reptil beobachten',i:'🦎',f:'Was macht eine Eidechse den ganzen Tag?',m:['Geduld','Kamera'],s:['Suche eine Eidechse an einer warmen Mauer.','Beobachte still aus der Ferne.','Male, was sie tat.'],w:'Eidechsen sind keine Dinos, aber nahe Verwandte aus derselben großen Reptilienfamilie.',ty:'photo',v:[{e:'☀️',l:'Sonnen'},{e:'🏃',l:'Flitzen'},{e:'🍽️',l:'Jagen'}]},
{k:10,t:'Vogelstimmen sammeln',i:'🎙️',f:'Wie viele verschiedene Rufe hörst du?',m:['Handy zum Aufnehmen'],s:['Nimm draußen eine Minute Vogelgesang auf.','Höre die Aufnahme noch einmal an.','Male für jeden Ruf ein Symbol.'],w:'Vogelgesang funktioniert über einen eigenen Stimmkopf tief im Brustkorb, die Syrinx.',ty:'observe',v:[{e:'1️⃣',l:'Einen'},{e:'3️⃣',l:'Zwei bis drei'},{e:'🔟',l:'Viele'}]},
{k:10,t:'Krokodil-Vergleich',i:'🐊',f:'Was hat ein Krokodil mit Dinos gemeinsam?',m:['Bilder','Stift'],s:['Schau dir ein Krokodil-Bild genau an.','Male Zähne, Haut und Beine ab.','Schreibe drei Gemeinsamkeiten mit einem Dino auf.'],w:'Krokodile und Vögel sind die nächsten lebenden Verwandten der Dinosaurier.',ty:'draw',v:[{e:'🦷',l:'Zähne'},{e:'🥚',l:'Eier'},{e:'🦵',l:'Beine seitlich'}]},
{k:10,t:'Vogelspuren',i:'🐾',f:'Wie sieht ein Vogelabdruck aus?',m:['Sand oder Schnee','Kamera'],s:['Suche Vogelspuren am Boden oder streue Sand aus.','Fotografiere einen Abdruck.','Zähle die Zehen und vergleiche mit Dino-Spuren.'],w:'Vogel- und Dinospuren sehen sich so ähnlich, dass Forscher sie manchmal verwechseln.',ty:'photo',v:[{e:'3️⃣',l:'3 Zehen'},{e:'4️⃣',l:'4 Zehen'},{e:'❓',l:'Unklar'}]},
{k:10,t:'Museumsbesuch',i:'🏛️',f:'Wie groß ist ein echtes Skelett?',m:['Kamera','Museumsbesuch'],s:['Besuche ein Naturkundemuseum.','Stelle dich neben ein Skelett und lass dich fotografieren.','Male auf, welcher Knochen dich am meisten beeindruckt hat.'],w:'Das Skelett im Berliner Naturkundemuseum ist der höchste montierte Dino der Welt.',ty:'photo',v:[{e:'🦴',l:'Beinknochen'},{e:'💀',l:'Schädel'},{e:'🦷',l:'Zähne'}]},
{k:10,t:'Forscher-Interview',i:'🎤',f:'Was wissen andere über Dinos?',m:['Stift','Ein Gesprächspartner'],s:['Frage jemanden: Welcher Dino gefällt dir am besten?','Frage: Was möchtest du über Dinos wissen?','Schreibe oder male die Antworten auf.'],w:'Auch Forscher wissen nicht alles. Gute Fragen sind wichtiger als fertige Antworten.',ty:'observe',v:[{e:'🦖',l:'T-Rex'},{e:'🦕',l:'Langhals'},{e:'🦴',l:'Ein anderer'}]},
{k:10,t:'Mein eigenes Experiment',i:'⭐',f:'Welche Frage möchtest DU beantworten?',m:['Alles, was du brauchst'],s:['Schreibe oder male deine eigene Forscherfrage.','Überlege, wie du sie testen kannst.','Führe dein Experiment durch und dokumentiere alles.'],w:'Jede große Entdeckung begann mit einer Frage, die noch niemand gestellt hatte.',ty:'own',v:[{e:'🤔',l:'Neugierig'},{e:'🔬',l:'Bereit'},{e:'🚀',l:'Los geht es'}]}

];

/* Hilfszugriffe für die App */
const NAECHSTE_FRAGEN = [
  'Findest du eine zweite Spur vom selben Tier?',
  'Wie verändert sich dein Abdruck, wenn du rennst?',
  'Welches Material gibt den schärfsten Abdruck?',
  'Was passiert mit den Schichten, wenn oben Wasser dazukommt?',
  'Erkennst du den Baum allein am Abdruck?',
  'Stimmt die Rechnung auch bei einem Hund?',
  'Findest du auch mit geschlossenen Augen etwas?',
  'Woher kommt der glatteste Stein, den du hast?',
  'Wie sehen deine Spuren aus, wenn du hüpfst?',
  'Findest du deine Stelle mit der Karte wieder?',
  'Wie lange brauchst du für diese Strecke?',
  'Welches Tier von heute kommt einem Dino am nächsten?',
  'Wie viele Hühnereier ergeben zusammen ein Dino-Ei?',
  'Wie viele deiner Abdrücke passen in den großen hinein?',
  'Wie viele Steine wiegen so viel wie ein Apfel?',
  'Welches Tier in deiner Nähe ist genauso groß?',
  'Wie lang darf dein Papierhals werden, bevor er umkippt?',
  'Wie viele Kinder wiegen zusammen so viel wie du?',
  'Wie lang wäre ein Zahn, der zu deiner Größe passt?',
  'Ist dein Arm ein zuverlässiges Maß? Miss zweimal.',
  'Bist du mit Anlauf schneller?',
  'Ist es auf Gras anders als auf Stein?',
  'Hilft ein schwererer Stab noch mehr?',
  'Wie viele Schritte braucht ein Erwachsener für dieselbe Strecke?',
  'Ändert sich das Ergebnis mit rutschigen Schuhen?',
  'Springst du mit Anlauf wirklich weiter?',
  'Welche Polsterung ist leicht und schützt trotzdem?',
  'Spürst du das Stampfen auch durch eine Wand?',
  'Wie weit kommst du mit doppeltem Gewicht?',
  'Hilft es, einen festen Punkt anzuschauen?',
  'Welche Zähne hat ein Haustier, das du kennst?',
  'Welches Blatt reißt am leichtesten ab?',
  'Was ändert sich bei hartem Brot?',
  'Wie viele Steine braucht es, bis es schneller geht?',
  'Wie lange braucht ein Vogel für ein einzelnes Korn?',
  'Erkennst du an der Bissspur, wer gebissen hat?',
  'Wie viel isst du selbst an einem Tag?',
  'Welches Werkzeug holt Wasser aus einer engen Flasche?',
  'Kaust du bei deinem Lieblingsessen anders?',
  'Welche Zähne bräuchte dein Dino für harte Nüsse?',
  'Hält dein Nest auch im Wind?',
  'Aus welcher Höhe hält die Polsterung nicht mehr?',
  'Rollt eine Kugel anders als ein Ei?',
  'Trägt eine umgedrehte Schale genauso viel?',
  'Welcher Stoff hält die Wärme am längsten?',
  'Findet jemand dein Nest aus zehn Schritten Entfernung?',
  'Passen mehr Eier hinein, wenn du sie anders legst?',
  'Wie viel Salz braucht es genau, bis das Ei schwimmt?',
  'Aus welchem Material ist das Vogelnest gebaut?',
  'Wie sieht dein Dino als Erwachsener aus?',
  'Hörst du drinnen andere Geräusche als draußen?',
  'Hilft der Trichter auch beim Rufen?',
  'Erkennst du Gerüche noch mit zugehaltener Nase?',
  'Wo sitzen die Augen bei einem Vogel?',
  'Ändert eine Mütze dein Blickfeld?',
  'Erkennst du die Dinge auch mit Handschuhen?',
  'Nach wie vielen Minuten siehst du am meisten?',
  'Durch welches Material kommt das Klopfen am besten?',
  'Welcher Ton trägt am weitesten nach draußen?',
  'Ist es im Halbdunkeln dieselbe Farbe?',
  'Welcher Ort tarnt am schlechtesten?',
  'Welches Muster würde im Schnee tarnen?',
  'Funktioniert die Tarnung auch aus großer Entfernung?',
  'Welcher Untergrund passt zu deiner Kleidung?',
  'Welche Farben hat ein Vogel in deiner Nähe?',
  'Sieht der Ball von unten anders aus?',
  'Welche Farben tragen Warnschilder auf der Straße?',
  'Wie klingt es, wenn du in deinen Kamm hineinrufst?',
  'Hilft Stillhalten wirklich mehr als Wegducken?',
  'Wie würde dein Dino auf Latein heißen?',
  'Ändert sich das Ergebnis mit Salzwasser?',
  'Was schiebt mehr Wasser: Hand oder Löffel?',
  'Was ändert eine Büroklammer an der Nase des Fliegers?',
  'Was passiert mit zusammengeknülltem Papier?',
  'Wie stark musst du pusten, damit es reicht?',
  'Wie lange hält die nasse Spur auf einem Stein?',
  'Was ändert ein Loch in der Mitte des Fallschirms?',
  'Wie groß darf das Segel werden, bevor es umfällt?',
  'Wie tief kannst du den Halm halten?',
  'Was passiert mit zwei Fingern gleichzeitig?',
  'Wird der Ausbruch mit warmem Essig größer?',
  'Wie lange dauert es, bis das Wasser klar ist?',
  'Welche anderen Küsten passen zusammen?',
  'Was ändert eine schwerere Kugel am Krater?',
  'Schützen Pflanzen deinen Sandberg?',
  'Wo in deiner Umgebung wachsen die meisten Farne?',
  'Wann am Tag ist der Schatten am kürzesten?',
  'Sieht man das Blatt nach einer Woche noch?',
  'Welche Farbe wird in der Sonne am schnellsten warm?',
  'Was schwimmt nach zwei Tagen oben?',
  'Wie oft schaut ein Vogel sich in einer Minute um?',
  'Welche Knochenformen findest du bei einem Hähnchen?',
  'Schwimmt eine Feder auf Wasser?',
  'Bei welchem Wetter siehst du Eidechsen am häufigsten?',
  'Antwortet ein Vogel, wenn du zurückpfeifst?',
  'Was hat ein Krokodil, was kein Vogel hat?',
  'Laufen alle Vögel gleich?',
  'Welcher Knochen fehlt in dem Skelett?',
  'Was weiß jemand, der viel älter ist als du?',
  'Welche Frage kommt als Nächstes?'
];

const DINO_REKORDE = {
  1: 'Ein T-Rex-Abdruck war etwa 80 Zentimeter lang.',
  6: 'Aus der Abdrucklänge mal vier schätzen Forscher die Beinlänge.',
  9: 'Ein rennender Raubdino ließ über vier Meter Lücke zwischen den Spuren.',
  11: 'Brachiosaurus: etwa 23 Meter lang.',
  12: 'T-Rex: etwa 4 Meter Hüfthöhe, 12 Meter Länge.',
  13: 'Das größte bekannte Dino-Ei misst rund 30 Zentimeter.',
  14: 'Ein Sauropoden-Abdruck war bis zu 1 Meter lang.',
  15: 'Argentinosaurus: etwa 70 Tonnen.',
  16: 'Der kleinste bekannte Dino war rund 35 Zentimeter lang.',
  17: 'Mamenchisaurus: 12 Meter Hals.',
  18: 'T-Rex: rund 7000 Kilo.',
  19: 'Ein T-Rex-Zahn wurde bis zu 20 Zentimeter lang.',
  21: 'Velociraptor: etwa 40 km/h. T-Rex: etwa 20 km/h. Mensch: etwa 15 km/h.',
  24: 'Ein großer Sauropode kam mit einem Schritt vier Meter weit.',
  26: 'Kleine Raubdinos sprangen mehrere Meter weit.',
  29: 'Die Beinknochen der Sauropoden waren dicker als ein Kinderkörper.',
  30: 'Flamingos stehen stundenlang auf einem Bein.',
  33: 'Hadrosaurier hatten über 1000 Zähne im Maul.',
  37: 'Ein großer Pflanzenfresser fraß etwa 500 Kilo am Tag.',
  39: 'Der T-Rex kaute gar nicht, er schluckte im Ganzen.',
  42: 'Dino-Eier lagen in weichem Pflanzenmaterial gebettet.',
  47: 'Manche Dino-Nester enthielten über 30 Eier.',
  51: 'Dinosaurier hörten besonders gut tiefe Töne.',
  55: 'Triceratops sah fast rundum.',
  73: 'Quetzalcoatlus: 12 Meter Spannweite.',
  74: 'Microraptor hatte Federn an Armen und Beinen.',
  84: 'Der Chicxulub-Krater ist rund 180 Kilometer breit.',
  91: 'Vögel sind die einzige heute lebende Dinosauriergruppe.',
  98: 'Das Berliner Brachiosaurus-Skelett ist 13,27 Meter hoch.'
};

EXPERIMENTS.forEach((e, i) => {
  e.id = 'exp' + String(i + 1).padStart(3, '0');
  e.bild = 'assets/experiments/' + e.id + '.svg';
  e.n = NAECHSTE_FRAGEN[i];                 // nächste Forscherfrage
  e.r = DINO_REKORDE[i + 1] || '';          // Dino-Rekord zum Vergleichen
});
