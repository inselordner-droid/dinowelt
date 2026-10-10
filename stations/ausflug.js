/* =====================================================================
   DINO-INSELWELT · Station Forscher-Ausflug („Brücke in die echte Welt“)
   A) Draußen-Forscher: Bild-Missionen für echte Ausflüge (Foto oder
      Erwachsene bestätigen durch Gedrückthalten) → Stempel im Ausflugs-Pass
   B) Museumsbesuch: Suchheft für das Museum für Naturkunde Berlin und
      eine Variante für jedes Naturkundemuseum
   C) Eltern-Infos (ⓘ) mit Tipps, Sicherheit und Druckvorlagen
   ===================================================================== */
(function(){
"use strict";
const ID='ausflug';
const INK='#3d3226';

/* ---------------------------------------------------------------------
   A) Draußen-Missionen (datengetrieben)
   ic = Bild der Karte, col = Farbe, say = Auftrag (vorgelesen),
   steps = 3 Bild-Schritte, safe = Sicherheitshinweis (oder null),
   an = Tier/Fossil der Dino-Brücke, dino = Dino-Wissen, tool = Extra-Werkzeug
   --------------------------------------------------------------------- */
const MISSIONS=[
 {id:'spur',t:'Fußspur-Detektiv',ic:'fussabdruck',col:'#c9a36b',
  say:'Mach deine eigene Fußspur! Drück deinen Fuß in Sand oder Matsch. Sieht deine Spur aus wie eine Dino-Spur?',
  steps:[{ic:'duene',t:'Such weichen Sand oder Matsch.'},{ic:'fussabdruck',t:'Drück deinen Fuß hinein und steig vorsichtig wieder heraus.'},{ic:'hand',t:'Vergleiche: Ist deine Spur größer oder kleiner als deine Hand?'}],
  safe:null,an:'trex',dino:'Dino-Spuren sind Abdrücke im Stein. Daran sehen Forscher, wie groß ein Dino war und wie schnell er lief. Die größten Dino-Spuren sind über einen Meter lang!'},
 {id:'voegel',t:'Vögel sind Dinosaurier!',ic:'au_vogel',col:'#8fbccb',
  say:'Wusstest du das? Vögel sind Dinosaurier! Such einen Vogel und schau ihn dir ganz genau an.',
  steps:[{ic:'fernglas',t:'Such einen Vogel, zum Beispiel eine Taube, einen Spatz oder eine Amsel.'},{ic:'au_beine',t:'Zähl seine Beine. Wie viele sind es?'},{ic:'au_zehen',t:'Schau auf die Füße: Wie viele Zehen zeigen nach vorne?'}],
  safe:'Nur anschauen, nicht anfassen. Wenn du leise bist, bleibt der Vogel da.',an:'huhn',dino:'Vögel laufen auf zwei Beinen – genau wie der T-Rex. Viele Vögel haben drei Zehen nach vorne. Die Spuren von Raubdinos sehen ganz ähnlich aus!'},
 {id:'steine',t:'Steine-Sammler',ic:'au_steine',col:'#9aa6b2',
  say:'Sammle fünf verschiedene Steine. Dann sortierst du sie wie ein echter Forscher.',
  steps:[{ic:'au_steine',t:'Such fünf Steine, die ganz verschieden aussehen.'},{ic:'lupe',t:'Schau genau: Welche Farbe? Glatt oder rau?'},{ic:'au_reihe',t:'Leg sie in eine Reihe: vom kleinsten bis zum größten.'}],
  safe:'Steine nicht in den Mund nehmen. Danach Hände waschen.',an:'ammonit',dino:'Fossilien stecken in Steinen. Darum schauen Fossilien-Forscher jeden Stein ganz genau an.'},
 {id:'blatt',t:'Blatt-Fossil',ic:'au_frottage',col:'#7fa66a',
  say:'Mach ein Blatt-Bild, das aussieht wie ein Fossil!',
  steps:[{ic:'blatt',t:'Such ein Blatt mit vielen Adern.'},{ic:'au_papier',t:'Leg ein Papier darauf.'},{ic:'stift',t:'Mal mit einem Wachsmalstift ganz flach darüber. Schau, das Blatt erscheint!'}],
  safe:null,an:'farn',dino:'Auch Pflanzen können zu Fossilien werden. Farne und Ginkgo-Bäume gab es schon zur Zeit der Dinosaurier – und es gibt sie heute noch!'},
 {id:'mauer',t:'Muscheln im Stein',ic:'au_mauer',col:'#c9b48a',
  say:'Manche Steine an Häusern, Treppen und Mauern haben Fossilien! Geh auf Fossilien-Suche in der Stadt.',
  steps:[{ic:'haus',t:'Schau dir helle Steine an: an Treppen, Mauern oder Fensterbänken.'},{ic:'lupe',t:'Such kleine Muscheln, Schnecken oder Kringel im Stein.'},{ic:'kamera',t:'Gefunden? Mach ein Foto. Das Fossil bleibt im Stein!'}],
  safe:'Nicht am Stein kratzen oder klopfen. Nur schauen und fotografieren.',an:'ammonit',dino:'Viele helle Steine sind Kalkstein. Er ist vor sehr langer Zeit im Meer entstanden. Darum stecken oft Muscheln darin – manche sind älter als die Dinosaurier!'},
 {id:'schnecke',t:'Schneckenhaus-Suche',ic:'au_schnecke',col:'#e0b27a',
  say:'Such ein leeres Schneckenhaus. Schau dir die Spirale an!',
  steps:[{ic:'blume',t:'Such im Gras, unter Büschen oder am Wegrand.'},{ic:'au_schnecke',t:'Nimm nur ein leeres Schneckenhaus.'},{ic:'hand',t:'Fahr mit dem Finger die Spirale entlang – immer rundherum.'}],
  safe:'Lebende Schnecken bleiben draußen. Danach Hände waschen.',an:'ammonit',dino:'Zur Zeit der Dinosaurier schwammen Ammoniten im Meer. Ihr Haus war auch eine Spirale. Heute findet man sie als Fossilien.'},
 {id:'nest',t:'Nest-Baumeister',ic:'nest',col:'#a8724a',
  say:'Bau ein Nest – so wie es auch manche Dinosaurier gemacht haben!',
  steps:[{ic:'zweig',t:'Sammle kleine Zweige, Gras und Blätter.'},{ic:'nest',t:'Leg alles im Kreis und drück in der Mitte eine Mulde hinein.'},{ic:'eier',t:'Leg runde Steine als Eier hinein.'}],
  safe:'Echte Vogelnester nicht anfassen.',an:'oviraptor',dino:'Manche Dinosaurier legten ihre Eier in Nester. Forscher haben sogar einen Verwandten des Oviraptor gefunden, der versteinert auf seinem Nest sitzt – wie ein brütender Vogel!'},
 {id:'trex',t:'Wie lang ist ein T-Rex?',ic:'au_schritte',col:'#c8553d',tool:'count',
  say:'Ein T-Rex war etwa 12 Meter lang. Wie viele Schritte sind das? Probier es aus!',
  steps:[{ic:'mensch',t:'Ein Erwachsener macht 12 große Schritte. Das ist ungefähr so lang wie ein T-Rex.'},{ic:'kind',t:'Jetzt gehst du die gleiche Strecke mit deinen Schritten.'},{ic:'fussabdruck',t:'Zähl mit! Tippe bei jedem Schritt unten auf den Fuß.'}],
  safe:'Such dir einen Platz ohne Autos, zum Beispiel eine Wiese.',an:'trex',dino:'Ein T-Rex war so lang wie ein Bus! Kinder brauchen dafür meistens mehr als 20 Schritte.'},
 {id:'sandkasten',t:'Ausgrabung im Sandkasten',ic:'au_sandkasten',col:'#d9b36c',
  say:'Ein Erwachsener versteckt einen Schatz im Sand. Du gräbst ihn aus wie ein echter Fossilien-Forscher!',
  steps:[{ic:'mensch',t:'Ein Erwachsener versteckt eine Muschel, einen Stein oder einen Spielzeug-Dino im Sand.'},{ic:'pinsel',t:'Grab ganz vorsichtig mit einem Pinsel oder einem Löffel.'},{ic:'kamera',t:'Gefunden? Erst fotografieren, dann herausnehmen – wie echte Forscher!'}],
  safe:'Danach Hände waschen.',an:'brachiosaurus',dino:'Echte Fossilien-Forscher graben ganz langsam. Mit Pinseln und kleinen Werkzeugen, damit kein Knochen kaputtgeht.'},
 {id:'hoeren',t:'Vogel-Konzert',ic:'ohr',col:'#b58cbd',
  say:'Mach die Augen zu und hör genau hin. Wie viele Vögel singen?',
  steps:[{ic:'ohr',t:'Setz dich hin, mach die Augen zu und sei ganz still.'},{ic:'hand',t:'Zähl an den Fingern: Wie viele verschiedene Vogelstimmen hörst du?'},{ic:'musik',t:'Mach eine Stimme nach! Kann ein Erwachsener raten, welcher Vogel das war?'}],
  safe:null,an:'parasaurolophus',dino:'Wie Dinosaurier geklungen haben, weiß niemand genau. Der Parasaurolophus hatte einen hohlen Kopfkamm. Vielleicht tönte er damit wie eine Trompete!'},
 {id:'knete',t:'Knete-Fossil',ic:'au_knete',col:'#dd8f8a',
  say:'Mach dein eigenes Fossil aus Knete!',
  steps:[{ic:'au_knete',t:'Drück ein Stück Knete flach wie einen Keks.'},{ic:'muschel',t:'Drück eine Muschel, ein Blatt oder einen Spielzeug-Dino fest hinein.'},{ic:'lupe',t:'Nimm es vorsichtig wieder heraus. Siehst du den Abdruck?'}],
  safe:null,an:'trilobit',dino:'Viele Fossilien sind Abdrücke. Das Tier ist längst verschwunden, aber seine Form ist im Stein geblieben – genau wie in deiner Knete.'},
 {id:'kreide',t:'Kreide-Raptor',ic:'au_kreide',col:'#e3b23c',
  say:'Mal einen Velociraptor in echter Größe! Er war ungefähr zwei Meter lang, mit Schwanz.',
  steps:[{ic:'mensch',t:'Ein Erwachsener macht zwei große Schritte. So lang war der Velociraptor.'},{ic:'au_kreide',t:'Mal mit Kreide den Körper, den langen Schwanz und den Kopf.'},{ic:'kind',t:'Leg dich daneben. Wer ist länger – du oder der Raptor?'}],
  safe:'Nur dort malen, wo keine Autos fahren. Kreide geht mit Wasser wieder weg.',an:'velociraptor',dino:'Der Velociraptor war viel kleiner, als viele denken – ungefähr so groß wie ein Truthahn. Und er hatte Federn!'},
 {id:'krabbeln',t:'Krabbeltier-Safari',ic:'au_kaefer',col:'#6f9a5c',
  say:'Such kleine Krabbeltiere! Unter Steinen und Blättern wohnen viele.',
  steps:[{ic:'au_steine',t:'Heb mit einem Erwachsenen einen Stein oder ein Stück Holz vorsichtig hoch.'},{ic:'lupe',t:'Zähl die Beine: Käfer haben sechs, Spinnen haben acht.'},{ic:'hand',t:'Leg den Stein danach genau so zurück. Darunter wohnen die Tiere.'}],
  safe:'Tiere nicht mitnehmen. Lieber mit der Lupe schauen als anfassen.',an:'meganeura',dino:'Insekten gab es schon lange vor den Dinosauriern. Die Riesenlibelle Meganeura hatte Flügel so groß wie eine Taube.'},
];

/* ---------------------------------------------------------------------
   B) Museums-Suchhefte. Nur gesicherte Inhalte; Ausstellungen können sich
   ändern – darum Hinweis „Frag an der Information“.
   pic: 'an:<tier>' (fos = als Skelett/Fossil gefärbt) oder Symbolname
   --------------------------------------------------------------------- */
const MUSEUMS={
 berlin:{n:'Museum für Naturkunde Berlin',short:'Berlin',ic:'museum',col:'#b58cbd',
  say:'Willkommen im Museum für Naturkunde in Berlin! Tippe auf ein Bild, dann sage ich dir deinen Suchauftrag. Hast du es gefunden? Dann tippe auf den Haken.',
  ask:'Wenn du etwas nicht findest, frag an der Kasse oder an der Information. Manchmal wird eine Ausstellung umgebaut.',
  tasks:[
   {id:'riese',pic:'an:brachiosaurus',fos:1,t:'Finde den Riesen',say:'Finde das riesige Langhals-Skelett im Dinosaurier-Saal. Wie viele Erwachsene müssten aufeinander stehen, um bis zu seinem Kopf zu kommen?',fact:'Er heißt Giraffatitan. Früher nannte man ihn Brachiosaurus. Sein Skelett ist über 13 Meter hoch – eines der höchsten Dino-Skelette der Welt!'},
   {id:'urvogel',pic:'an:archaeopteryx',fos:1,t:'Finde den Urvogel',say:'Finde den Urvogel Archaeopteryx. Er liegt in einer Steinplatte. Kannst du seine Federn sehen?',fact:'Der Berliner Archaeopteryx ist eines der berühmtesten Fossilien der Welt. Er wurde in Bayern gefunden.'},
   {id:'stacheln',pic:'an:kentrosaurus',fos:1,t:'Finde den Stachel-Dino',say:'Finde den Kentrosaurus. Er hat viele spitze Stacheln auf dem Rücken und am Schwanz. Zähl ein paar Stacheln!',fact:'Kentrosaurus ist ein Verwandter des Stegosaurus. Er wurde in Tendaguru in Afrika ausgegraben.'},
   {id:'tendaguru',pic:'knochen',t:'Zähle die Skelette',say:'Viele Skelette im Dinosaurier-Saal kommen aus Tendaguru in Tansania. Zähle: Wie viele große Skelette siehst du?',fact:'Vor über hundert Jahren gruben dort Hunderte Menschen aus Tansania die Knochen aus. Sie trugen sie zu Fuß bis zur Küste.'},
   {id:'glaeser',pic:'au_glas',t:'Tiere in Gläsern',say:'Finde den Raum mit ganz vielen Tieren in Gläsern. Kannst du einen Fisch entdecken?',fact:'Das ist die Nasssammlung. Die Tiere liegen in Alkohol, damit sie sehr lange erhalten bleiben. Forscher untersuchen sie bis heute.'},
   {id:'meteorit',pic:'au_meteorit',t:'Stein aus dem Weltall',say:'Finde einen Meteoriten. Das ist ein Stein, der aus dem Weltall auf die Erde gefallen ist!',fact:'In vielen Meteoriten steckt Eisen. Darum sind sie oft schwerer, als sie aussehen.'},
   {id:'kristall',pic:'kristall',t:'Glitzer-Kristalle',say:'Finde die Steine und Kristalle. Welcher Kristall gefällt dir am besten? Welche Farbe hat er?',fact:'Kristalle wachsen tief in der Erde, oft ganz langsam.'},
   {id:'wand',pic:'au_wand',t:'Die Tier-Wand',say:'Finde die große Wand mit ganz vielen Tieren. Kannst du drei Vögel zählen?',fact:'So viele verschiedene Tiere gibt es auf der Erde! Forscher nennen das Artenvielfalt.'},
   {id:'liebling',pic:'kamera',t:'Mein Lieblingsstück',say:'Was gefällt dir im Museum am besten? Zeig es einem Erwachsenen und macht zusammen ein Foto.',fact:'Auch echte Forscher haben ein Lieblingsfossil!'},
  ]},
 any:{n:'Jedes Naturkundemuseum',short:'Jedes Museum',ic:'globus',col:'#7fa66a',
  say:'Dieses Suchheft passt in jedes Naturkundemuseum. Tippe auf ein Bild, dann sage ich dir deinen Suchauftrag. Hast du es gefunden? Dann tippe auf den Haken.',
  ask:'Wenn du etwas nicht findest, ist das nicht schlimm. Nicht jedes Museum hat alles. Frag einfach an der Information.',
  tasks:[
   {id:'skelett',pic:'an:trex',fos:1,t:'Finde ein Skelett',say:'Finde ein großes Skelett. Hat es zwei Beine oder vier Beine?',fact:'Ein Skelett besteht aus vielen Knochen. Forscher setzen sie zusammen wie ein Puzzle.'},
   {id:'schale',pic:'ammonit',t:'Fossil mit Schale',say:'Finde ein Fossil mit einer Schale, zum Beispiel einen Ammoniten oder eine Muschel.',fact:'Ammoniten lebten im Meer, als es Dinosaurier gab.'},
   {id:'zahn',pic:'zahn',t:'Der größte Zahn',say:'Such den größten Zahn, den du finden kannst. Ist er größer als deine Hand?',fact:'Zähne sind sehr hart. Darum findet man sie besonders oft als Fossilien.'},
   {id:'spur',pic:'spur',t:'Spur im Stein',say:'Findest du eine Fußspur im Stein? Wie viele Zehen hat sie?',fact:'Eine Spur zeigt, wo ein Tier vor sehr langer Zeit gelaufen ist.'},
   {id:'trilobit',pic:'an:trilobit',t:'Älter als Dinos',say:'Finde einen Trilobiten. Er sieht ein bisschen aus wie eine große Assel.',fact:'Trilobiten lebten im Meer – schon lange, bevor es Dinosaurier gab.'},
   {id:'pflanze',pic:'farn',t:'Pflanze aus Stein',say:'Finde eine versteinerte Pflanze, zum Beispiel ein Blatt oder einen Farn.',fact:'Auch Pflanzen können zu Stein werden.'},
   {id:'kristall',pic:'kristall',t:'Glitzerstein',say:'Finde einen Kristall. Welche Farbe hat er?',fact:'Kristalle wachsen tief in der Erde, oft ganz langsam.'},
   {id:'vogel',pic:'au_vogel',t:'Dino-Verwandte',say:'Finde einen Vogel im Museum. Schau dir seine Füße an. Sehen sie aus wie Dino-Füße?',fact:'Vögel stammen von Dinosauriern ab.'},
   {id:'liebling',pic:'kamera',t:'Mein Lieblingsstück',say:'Was gefällt dir im Museum am besten? Zeig es einem Erwachsenen und macht zusammen ein Foto.',fact:'Auch echte Forscher haben ein Lieblingsfossil!'},
  ]},
};

/* ---------------------------------------------------------------------
   Eigene Symbole (64×64)
   --------------------------------------------------------------------- */
const S=`stroke="${INK}" stroke-width="1.5" stroke-opacity=".75" stroke-linejoin="round"`;
const IC=ART.ICONS;
IC.au_vogel=`<path d="M14 30q2-12 16-12 10 0 14 8l10-2-8 6q2 10-8 14-12 4-20-2l-10 4 6-8q-2-4 0-8z" fill="#a8805a" ${S}/><path d="M22 34q8 6 18 0" fill="#f1e2c6" stroke="${INK}" stroke-opacity=".4"/><path d="M26 24q6-3 10 2" fill="none" stroke="#6e4a30" stroke-width="2"/><circle cx="41" cy="23" r="1.8" fill="${INK}"/><path d="M28 44v10M36 44v10" stroke="#8a6d4a" stroke-width="2.4" stroke-linecap="round"/><path d="M28 54l6 0M28 54l5 3M28 54l2 5M28 54l-5 1M36 54l6 0M36 54l5 3M36 54l2 5M36 54l-5 1" stroke="#8a6d4a" stroke-width="1.8" stroke-linecap="round"/>`;
IC.au_beine=`<path d="M16 22q2-12 16-12 10 0 14 8l8-2-6 6q0 8-8 12-12 4-20-2z" fill="#a8805a" ${S}/><circle cx="42" cy="16" r="1.8" fill="${INK}"/><path d="M26 34v18M38 34v18" stroke="#8a6d4a" stroke-width="3" stroke-linecap="round"/><circle cx="22" cy="58" r="5" fill="#f0c35a" ${S}/><circle cx="42" cy="58" r="5" fill="#f0c35a" ${S}/><path d="M22 55v6M40 56q2-2 3 0t-3 4h4" stroke="${INK}" stroke-width="1.4" fill="none"/>`;
IC.au_zehen=`<path d="M32 50V26" stroke="#c98a4a" stroke-width="5" stroke-linecap="round"/><path d="M32 50L14 22M32 50V14M32 50L50 22M32 50l-6 10" stroke="#c98a4a" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M14 22l-3-3M32 14v-4M50 22l3-3" stroke="${INK}" stroke-width="2" stroke-linecap="round"/><circle cx="32" cy="50" r="5" fill="#d99b5a" ${S}/>`;
IC.au_steine=`<ellipse cx="16" cy="46" rx="10" ry="7" fill="#9aa6b2" ${S}/><ellipse cx="34" cy="48" rx="8" ry="6" fill="#d9c49a" ${S}/><ellipse cx="50" cy="45" rx="9" ry="8" fill="#a8724a" ${S}/><ellipse cx="24" cy="32" rx="7" ry="5" fill="#e6ddd0" ${S}/><ellipse cx="42" cy="31" rx="6" ry="5" fill="#6f7f8f" ${S}/><path d="M12 44q4-2 8 0M46 42q3-2 6 0" stroke="#fff" stroke-opacity=".6" stroke-width="1.5" fill="none"/>`;
IC.au_reihe=`<ellipse cx="10" cy="44" rx="4" ry="3" fill="#6f7f8f" ${S}/><ellipse cx="21" cy="43" rx="5.5" ry="4" fill="#e6ddd0" ${S}/><ellipse cx="34" cy="42" rx="7" ry="5" fill="#d9c49a" ${S}/><ellipse cx="50" cy="40" rx="9" ry="7" fill="#9aa6b2" ${S}/><path d="M6 54h52M52 50l6 4-6 4" stroke="#c8553d" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
IC.au_papier=`<path d="M10 14l40-4 4 42-40 4z" fill="#fffdf5" ${S}/><path d="M16 22h30M17 30h30M18 38h30M18 46h22" stroke="#d9cdb0" stroke-width="1.4"/>`;
IC.au_frottage=`<path d="M8 12l42-4 6 44-42 4z" fill="#fffdf5" ${S}/><path d="M18 46q2-22 26-32-2 24-26 32z" fill="#7fa66a" opacity=".55"/><path d="M18 46L42 16M26 36l-4-6M30 31l-2-8M34 27l0-7M28 36l8 0M32 31l8-1" stroke="#4f7a45" stroke-width="1.4" opacity=".8"/><path d="M40 58l18-20 4 4-18 20z" fill="#c8553d" ${S}/><path d="M40 58l-2 4 6-2" fill="#f3e3bf" ${S}/>`;
IC.au_mauer=`<path d="M4 12h56v44H4z" fill="#e8dcc0" ${S}/><path d="M4 26h56M4 40h56M22 12v14M44 12v14M12 26v14M34 26v14M54 26v14M24 40v16M46 40v16" stroke="#b9a57a" stroke-width="1.8"/><path d="M28 34a5 5 0 1 1 5-5 3 3 0 1 1-3-3" fill="none" stroke="#8a6d4a" stroke-width="1.8"/><path d="M10 48q3-5 6 0M50 18q3-4 6 0" stroke="#8a6d4a" stroke-width="1.6" fill="none"/><path d="M36 48l3 3 3-3 3 3" stroke="#8a6d4a" stroke-width="1.4" fill="none"/>`;
IC.au_schnecke=`<path d="M8 50q0-6 10-6h26q10 0 12 6z" fill="#d9c49a" ${S}/><circle cx="32" cy="30" r="18" fill="#e0b27a" ${S}/><path d="M32 30a4 4 0 1 1 4 4 8 8 0 1 1-8-8 12 12 0 1 1 12 12" fill="none" stroke="#8a5a2a" stroke-width="2.2" stroke-linecap="round"/>`;
IC.au_schritte=`<path d="M4 50h56" stroke="#c8553d" stroke-width="2.4" stroke-dasharray="4 3"/>${[10,24,38,52].map((x,i)=>`<ellipse cx="${x}" cy="${i%2?40:30}" rx="5" ry="8" fill="#8a6d4a" transform="rotate(12 ${x} ${i%2?40:30})"/><circle cx="${x+1}" cy="${i%2?29:19}" r="2" fill="#8a6d4a"/>`).join('')}<path d="M4 44v12M60 44v12" stroke="#c8553d" stroke-width="2.4"/>`;
IC.au_sandkasten=`<path d="M4 36l8-10h40l8 10v18H4z" fill="#a8724a" ${S}/><path d="M8 38q24-10 48 0v12H8z" fill="#ead9ae" ${S}/><path d="M22 40l12-4" stroke="#f3ead6" stroke-width="5" stroke-linecap="round"/><circle cx="21" cy="40" r="3" fill="#f3ead6" ${S}/><circle cx="35" cy="35" r="3" fill="#f3ead6" ${S}/><path d="M46 12l-4 22" stroke="#6e4a30" stroke-width="3" stroke-linecap="round"/><path d="M38 32l8 2-2 8-8-2z" fill="#c8553d" ${S}/>`;
IC.au_knete=`<path d="M6 42q0-16 26-16t26 16q0 12-26 12T6 42z" fill="#e39aa0" ${S}/><path d="M22 42q10-14 20 0-10 6-20 0z" fill="#c9737a" opacity=".8"/><path d="M32 32v14M26 38l6 8 6-8" stroke="#b25e66" stroke-width="1.4" fill="none"/><path d="M12 36q4-4 8-4" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none"/>`;
IC.au_kreide=`<path d="M6 50q12-18 24-6t26-14" fill="none" stroke="#fffdf5" stroke-width="4" stroke-linecap="round" filter="none"/><path d="M6 50q12-18 24-6t26-14" fill="none" stroke="#8fbccb" stroke-width="1.2" opacity=".6"/><path d="M34 22l16-12 6 7-16 12z" fill="#f0c35a" ${S}/><path d="M34 22l6 7-4 2-4-5z" fill="#fffdf5" ${S}/>`;
IC.au_kaefer=`<path d="M20 22l-8-6M44 22l8-6M18 32H6M46 32h12M20 42l-8 8M44 42l8 8" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="32" cy="36" rx="14" ry="17" fill="#4f7a45" ${S}/><path d="M32 20v33" stroke="${INK}" stroke-width="1.4"/><circle cx="32" cy="18" r="7" fill="#3d3226"/><path d="M28 12l-4-6M36 12l4-6" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/><circle cx="26" cy="32" r="2.4" fill="#8fbf7a"/><circle cx="38" cy="40" r="2.4" fill="#8fbf7a"/>`;
IC.au_glas=`<path d="M18 10h28v6H18z" fill="#a8724a" ${S}/><path d="M16 16h32q2 0 2 4v34q0 4-4 4H18q-4 0-4-4V20q0-4 2-4z" fill="#dfeef0" ${S}/><path d="M16 24h32v30q0 3-3 3H19q-3 0-3-3z" fill="#f2e6a8" opacity=".6"/><path d="M22 40q8-8 16 0-8 7-16 0zM38 40l6-5v10z" fill="#8fbccb" ${S}/><circle cx="26" cy="39" r="1.4" fill="${INK}"/><path d="M20 20v30" stroke="#fff" stroke-width="2.4" opacity=".8"/>`;
IC.au_meteorit=`<path d="M8 10l24 22M4 22l22 16M20 4l18 22" stroke="#f0c35a" stroke-width="3" stroke-linecap="round" opacity=".8"/><path d="M30 30q6-8 18-6 12 4 10 16-2 14-16 14-14 0-16-10-2-8 4-14z" fill="#5f5a55" ${S}/><circle cx="42" cy="36" r="3" fill="#8a847c"/><circle cx="48" cy="46" r="2" fill="#8a847c"/><circle cx="36" cy="46" r="2.4" fill="#8a847c"/>`;
IC.au_wand=`<path d="M6 8h52v48H6z" fill="#f3ead6" ${S}/>${[0,1,2].map(r=>[0,1,2].map(c=>`<rect x="${10+c*16}" y="${12+r*14}" width="13" height="11" rx="2" fill="${['#8fbccb','#e0b27a','#b58cbd','#7fa66a','#f0c35a','#c8553d','#d9c49a','#8fbf7a','#9aa6b2'][r*3+c]}" opacity=".85"/>`).join('')).join('')}<path d="M13 19q3-4 7 0M30 32q3-3 6 0M46 46l3-4 3 4" stroke="${INK}" stroke-width="1.3" fill="none"/>`;
IC.au_eltern=`<circle cx="22" cy="12" r="7" fill="#e8b88f" stroke="${INK}" stroke-width="1.3"/><path d="M12 22q10-4 20 0l2 22H10z" fill="#7fa66a" ${S}/><path d="M17 44v16M27 44v16" stroke="#5a4630" stroke-width="5"/><circle cx="46" cy="28" r="6" fill="#f1c9a5" stroke="${INK}" stroke-width="1.3"/><path d="M38 36q8-3 16 0l1 14H37z" fill="#d98b5f" ${S}/><path d="M42 50v10M50 50v10" stroke="#5f7f95" stroke-width="4"/><path d="M32 28q4 8 8 10" stroke="#e8b88f" stroke-width="4" stroke-linecap="round" fill="none"/>`;
IC.au_pass=`<path d="M12 6h36q4 0 4 4v46q0 4-4 4H12z" fill="#6f8a86" ${S}/><path d="M16 10h30v46H16z" fill="#fffdf5" opacity=".9"/><circle cx="31" cy="26" r="10" fill="none" stroke="#c8553d" stroke-width="2.4"/><circle cx="31" cy="26" r="6.5" fill="none" stroke="#c8553d" stroke-width="1.2"/><path d="M27 26l3 3 5-6" stroke="#c8553d" stroke-width="2" fill="none"/><path d="M21 42h20M21 48h14" stroke="#b9a57a" stroke-width="2"/>`;
IC.au_stempel=`<path d="M24 6h16q4 0 4 4v4q0 4-4 6l-2 10H26l-2-10q-4-2-4-6v-4q0-4 4-4z" fill="#a8724a" ${S}/><path d="M12 32h40v10H12z" fill="#6e4a30" ${S}/><path d="M10 44h44v6H10z" fill="#c8553d" ${S}/><path d="M8 58h48" stroke="#c8553d" stroke-width="3" stroke-dasharray="5 3" opacity=".7"/>`;
IC.au_drucker=`<path d="M16 6h32v18H16z" fill="#fffdf5" ${S}/><path d="M6 22h52q2 0 2 2v20q0 2-2 2H6q-2 0-2-2V24q0-2 2-2z" fill="#9aa6b2" ${S}/><path d="M16 38h32v20H16z" fill="#fffdf5" ${S}/><path d="M20 44h24M20 50h18" stroke="#b9a57a" stroke-width="2"/><circle cx="50" cy="30" r="2.6" fill="#8fbf7a"/>`;
IC.au_sonne_weg=`<circle cx="46" cy="16" r="9" fill="#f0c35a" ${S}/><path d="M4 56q20-26 56-20v20z" fill="#b9c98c" ${S}/><path d="M26 60q6-12 18-22" stroke="#ead9ae" stroke-width="7" fill="none" stroke-linecap="round"/>`;

/* ---------------------------------------------------------------------
   Spielstand & Foto-Ablage
   --------------------------------------------------------------------- */
const AS=()=>{ const s=DW.state.ausflug=DW.state.ausflug||{}; s.done=s.done||{}; s.photo=s.photo||{}; s.mus=s.mus||{}; s.musDone=s.musDone||{}; s.count=s.count||0;
  Object.keys(MUSEUMS).forEach(k=>{ s.mus[k]=s.mus[k]||{}; }); return s; };
const IDB={db:null,open(){return new Promise(r=>{ if(this.db) return r(this.db); try{ const q=indexedDB.open('dinoInselwelt',1); q.onupgradeneeded=()=>q.result.createObjectStore('bilder'); q.onsuccess=()=>{this.db=q.result;r(this.db);}; q.onerror=()=>r(null);}catch(e){r(null);} });},
  async get(k){k=DW.profileKey(k);/* Bilder pro Profil (core.js) */const db=await this.open(); if(!db) return null; return new Promise(r=>{try{const t=db.transaction('bilder').objectStore('bilder').get(k);t.onsuccess=()=>r(t.result||null);t.onerror=()=>r(null);}catch(e){r(null);}});},
  async set(k,v){k=DW.profileKey(k);const db=await this.open(); if(!db) return; try{db.transaction('bilder','readwrite').objectStore('bilder').put(v,k);}catch(e){}}};

let root=null, view='home', curM=null, curMus='berlin', printEl=null, stepCount=0;
/* Rückmeldungs-Klassen vor jeder neuen Rückmeldung abräumen (sonst gewinnt in der CSS-Reihenfolge immer dieselbe) */
const fb=el=>{ if(el) el.classList.remove('gk-good','gk-bad','gk-hint'); return el; };
const esc=s=>String(s).replace(/[<&"]/g,c=>({'<':'&lt;','&':'&amp;','"':'&quot;'}[c]));
const mById=id=>MISSIONS.find(m=>m.id===id);
const ic=(n,cls='')=>DW.iconImg(n,cls);
function picHTML(p,fos){ // Bild für Museumsaufgaben / Dino-Brücke
  if(p.startsWith('an:')) return DW.animalImg(p.slice(3),{shadow:false},fos?'au-fos':'');
  if(!IC[p]&&(DATA.animal(p)||ART.has(p))) return DW.animalImg(p,{shadow:false},fos?'au-fos':'');
  return ic(p);
}
const me=()=>ART.AVATARS.find(a=>a.id===DW.state.avatar)||ART.AVATARS[0];
function stampHTML(icon,col,small){ return `<span class="au-stamp${small?' sm':''}" style="--c:${col}"><span class="au-sring"></span>${ic(icon)}</span>`; }
function head(title,back){
  DW.setStationTitle(title);
  return `<div class="au-head">${back?`<button class="ibtn au-back" type="button" aria-label="Zurück">${ART.icon('pfeil_l')}</button>`:''}
    <span class="au-sp"></span>
    <button class="ibtn au-passbtn" type="button" aria-label="Ausflugs-Pass">${ART.icon('au_pass')}<span class="au-badge">${stampCount()}</span></button>
    <button class="au-info" type="button" aria-label="Infos für Erwachsene">i</button></div>`;
}
function wireHead(back){
  const b=root.querySelector('.au-back'); if(b) b.onclick=()=>{ DW.sfx('tap'); DW.hush(); back(); };
  root.querySelector('.au-passbtn').onclick=()=>{ DW.sfx('pop'); pass(); };
  root.querySelector('.au-info').onclick=()=>{ DW.sfx('tap'); parents(); };
}
const stampCount=()=>{ const s=AS(); return Object.keys(s.done).filter(mById).length+Object.keys(s.musDone).length; };
const stampMax=()=>MISSIONS.length+Object.keys(MUSEUMS).length;

/* ---------------------------------------------------------------------
   Start: drei große Türen
   --------------------------------------------------------------------- */
function mount(r){ root=r; AS(); home(true); }
function home(first){
  view='home'; curM=null; GK.idle.stop(); const s=AS();
  const outN=Object.keys(s.done).filter(mById).length, musN=Object.keys(s.musDone).length;
  root.innerHTML=`<div class="au fill">${head('Forscher-Ausflug')}
   <div class="au-doors">
    <button class="au-door au-d-out" type="button" style="--c:#8fbf7a">
      <span class="au-dpic"><span class="au-blob"></span>${ic('au_sonne_weg','au-d1')}${ic('fussabdruck','au-d2')}${ic('au_vogel','au-d3')}${ic('blatt','au-d4')}</span>
      <b class="hand">Draußen-Forscher</b><span class="au-dots">${MISSIONS.map(m=>`<i class="${s.done[m.id]?'on':''}"></i>`).join('')}</span></button>
    <button class="au-door au-d-mus" type="button" style="--c:#b58cbd">
      <span class="au-dpic"><span class="au-blob"></span>${ic('museum','au-d1')}${DW.animalImg('brachiosaurus',{shadow:false},'au-d2 au-fos')}${ic('ammonit','au-d4')}</span>
      <b class="hand">Museumsbesuch</b><span class="au-dots">${Object.keys(MUSEUMS).map(k=>{const M=MUSEUMS[k],n=Object.keys(s.mus[k]).length;return `<i class="${s.musDone[k]?'on':n?'half':''}"></i>`;}).join('')}</span></button>
    <button class="au-door au-d-pass" type="button" style="--c:#d9b36c">
      <span class="au-dpic"><span class="au-blob"></span>${ic('au_pass','au-d1')}${ic('au_stempel','au-d2')}<img class="au-d3 au-av" src="${DW.svgURL(ART.avatar(me(),{}))}" alt=""></span>
      <b class="hand">Mein Ausflugs-Pass</b><span class="au-cnt hand">${stampCount()} / ${stampMax()}</span></button>
   </div></div>`;
  wireHead();
  root.querySelector('.au-d-out').onclick=()=>{ DW.sfx('pop'); outList(); };
  root.querySelector('.au-d-mus').onclick=()=>{ DW.sfx('pop'); museum(curMus); };
  root.querySelector('.au-d-pass').onclick=()=>{ DW.sfx('pop'); pass(); };
  DW.say(first&&!outN&&!musN?'Jetzt geht es raus in die echte Welt! Draußen warten Forscher-Aufträge für dich. Im Museum gibt es ein Suchheft. Und für jeden Auftrag bekommst du einen Stempel in deinen Ausflugs-Pass.'
    :'Wohin geht dein Ausflug? Nach draußen, ins Museum, oder schaust du deinen Pass an?');
  GK.idle.set(()=>GK.pulse(root.querySelector('.au-d-out')),()=>DW.say('Tippe auf ein Bild!'));
}

/* ---------------------------------------------------------------------
   A) Draußen-Forscher: Kartenübersicht
   --------------------------------------------------------------------- */
function outList(){
  view='out'; curM=null; GK.idle.stop(); const s=AS();
  root.innerHTML=`<div class="au fill">${head('Draußen-Forscher',true)}
    <div class="au-scroll"><div class="au-grid">${MISSIONS.map(m=>`<button class="au-mcard ${s.done[m.id]?'done':''}" data-id="${m.id}" type="button" style="--c:${m.col}">
      <span class="au-mpic"><span class="au-blob"></span>${ic(m.ic)}</span><b class="hand">${m.t}</b>
      ${m.safe?`<span class="au-msafe" title="Mit einem Erwachsenen">${ic('au_eltern')}</span>`:''}
      ${s.done[m.id]?stampHTML(m.ic,m.col,true):''}</button>`).join('')}</div></div></div>`;
  wireHead(home);
  DW.$$('.au-mcard',root).forEach(b=>b.onclick=()=>{ DW.sfx('pop'); mission(b.dataset.id); });
  const n=Object.keys(s.done).filter(mById).length;
  DW.say(n?'Welcher Auftrag ist heute dran? Tippe auf eine Karte!':'Hier sind deine Forscher-Aufträge für draußen. Tippe auf eine Karte, dann erkläre ich dir alles.');
  GK.idle.set(()=>GK.pulse(root.querySelector('.au-mcard:not(.done)')||root.querySelector('.au-mcard')),()=>DW.say('Tippe auf eine Karte!'));
}

/* ---------------------------------------------------------------------
   A) Eine Mission: 3 Bild-Schritte, Dino-Brücke, Foto oder Erwachsene halten
   --------------------------------------------------------------------- */
function mission(id,quiet){
  const m=mById(id); if(!m) return outList(); view='mission'; curM=m; stepCount=0; GK.idle.stop();
  const done=!!AS().done[m.id];
  root.innerHTML=`<div class="au fill au-mis" style="--c:${m.col}">${head(m.t,true)}
    <div class="au-scroll"><div class="au-mbody">
      <button class="au-hero" type="button" aria-label="Auftrag vorlesen"><span class="au-blob"></span>${ic(m.ic)}<span class="au-say">${ART.icon('lautsprecher')}</span></button>
      <ol class="au-steps">${m.steps.map((st,j)=>`<li><button class="au-step" data-j="${j}" type="button"><span class="au-num hand">${j+1}</span><span class="au-sic">${ic(st.ic)}</span><span class="au-stx">${st.t}</span></button></li>`).join('')}</ol>
      ${m.tool==='count'?`<div class="au-count card"><button class="au-cbtn" type="button" aria-label="Ein Schritt">${ic('fussabdruck')}</button><div class="au-cnum hand" id="auCnum">0</div><div class="au-cprints" id="auPrints"></div><button class="ibtn au-creset" type="button" aria-label="Von vorne zählen">${ART.icon('radierer')}</button></div>`:''}
      <div class="au-extra">
        ${m.safe?`<button class="au-safe" type="button">${ic('au_eltern')}<span>${m.safe}</span></button>`:''}
        <button class="au-dino card" type="button"><span class="au-dimg">${picHTML(m.an)}</span><span class="au-dtx"><b class="hand">Dino-Brücke</b>${m.dino}</span></button>
      </div>
      <div class="au-finish" id="auFinish"></div>
    </div></div></div>`;
  wireHead(outList);
  const speakAll=()=>{ DW.say(m.say); m.steps.forEach((st,j)=>DW.say(st.t,{queue:true})); };
  root.querySelector('.au-hero').onclick=()=>{ DW.sfx('tap'); speakAll(); };
  DW.$$('.au-step',root).forEach(b=>b.onclick=()=>{ DW.sfx('click'); b.classList.add('seen'); GK.ok(fb(b)); DW.say(m.steps[+b.dataset.j].t); });
  const sf=root.querySelector('.au-safe'); if(sf) sf.onclick=()=>{ DW.sfx('tap'); DW.say(m.safe); };
  root.querySelector('.au-dino').onclick=()=>{ DW.sfx('pop'); DW.say(m.dino); };
  if(m.tool==='count') countTool();
  finishArea(m);
  /* quiet: Neuaufbau direkt nach dem Stempel – das Lob läuft noch, der Auftrag wird nicht noch einmal von vorn erzählt */
  if(!quiet) DW.say(m.say+(m.safe?' Mach das zusammen mit einem Erwachsenen.':'')+' Tippe auf die Bilder, dann erkläre ich dir jeden Schritt.');
  GK.idle.set(()=>GK.pulse(fb(root.querySelector('.au-step:not(.seen)')||root.querySelector('.au-cam'))),()=>DW.say(done?'Du hast diesen Auftrag schon geschafft! Du kannst ihn aber nochmal machen.':'Hast du es ausprobiert? Dann mach ein Foto oder ein Erwachsener drückt lange auf den grünen Knopf.'));
}
function countTool(){
  const num=root.querySelector('#auCnum'), pr=root.querySelector('#auPrints');
  /* nur die NEUE Fußspur anhängen (vorher wurden bei jedem Schritt alle neu aufgebaut und hüpften alle wieder) */
  const draw=()=>{ num.textContent=stepCount; const want=Math.min(stepCount,40);
    while(pr.children.length>want) pr.lastChild.remove();
    while(pr.children.length<want) pr.insertAdjacentHTML('beforeend',`<i class="${pr.children.length%2?'r':''}">${ic('fussabdruck')}</i>`); };
  root.querySelector('.au-cbtn').onclick=ev=>{ stepCount++; draw(); DW.sfx('step'); GK.ok(fb(ev.currentTarget)); DW.say(String(stepCount));
    if(stepCount===12) GK.after(700,()=>DW.say('Zwölf! So viele große Schritte braucht ein Erwachsener für einen T-Rex.',{queue:true})); };
  root.querySelector('.au-creset').onclick=()=>{ stepCount=0; draw(); DW.sfx('whoosh'); DW.say('Wir fangen von vorne an.'); };
  draw();
}
async function finishArea(m){
  const box=root.querySelector('#auFinish'); if(!box) return; const s=AS(), done=!!s.done[m.id];
  box.innerHTML=`${done?`<div class="au-donebadge">${stampHTML(m.ic,m.col)}<img class="au-photo" id="auPhoto" alt="Mein Foto" hidden></div>`:''}
    <div class="au-acts"><label class="btn sun big au-cam" aria-label="Foto machen">${ART.icon('kamera',40)}<span>${done?'Neues Foto':'Foto machen'}</span><input type="file" accept="image/*" capture="environment" hidden></label>
    <button class="btn go big au-hold" type="button"><span class="au-hfill"></span>${ART.icon('au_eltern',40)}<span class="au-hl"><b>Geschafft!</b><small>Erwachsene: lange drücken</small></span></button></div>`;
  const inp=box.querySelector('input'); inp.onchange=ev=>{ const f=ev.target.files&&ev.target.files[0]; if(f) photo(m,f); };
  const hb=box.querySelector('.au-hold');
  let heldAt=0;
  DW.holdButton(hb,1600,()=>{ heldAt=performance.now(); DW.sfx('ok'); complete(m,'hold'); });
  /* Loslassen nach dem Halten erzeugt noch einen Klick – der darf das Lob nicht mit dem Hinweis überreden */
  hb.addEventListener('click',()=>{ if(performance.now()-heldAt<1500) return; if(!hb.classList.contains('glow')) DW.say('Ein Erwachsener hält den Knopf lange gedrückt, bis er ganz grün ist.'); });
  hb.addEventListener('contextmenu',e=>e.preventDefault());
  if(done){ const url=await IDB.get('ausflug:'+m.id); const p=root.querySelector('#auPhoto'); if(url&&p&&curM===m){ p.src=url; p.hidden=false; p.onclick=()=>p.classList.toggle('big'); } }
}
function photo(m,file){
  const rd=new FileReader();
  rd.onload=()=>{ const im=new Image(); im.onload=()=>{ const c=document.createElement('canvas'), k=Math.min(1,360/Math.max(im.width,im.height));
      c.width=Math.round(im.width*k); c.height=Math.round(im.height*k); c.getContext('2d').drawImage(im,0,0,c.width,c.height);
      let url=''; try{ url=c.toDataURL('image/jpeg',.8); }catch(e){}
      if(url){ IDB.set('ausflug:'+m.id,url); AS().photo[m.id]=1; DW.save(); }
      DW.sfx('magic'); complete(m,'photo'); };
    im.onerror=()=>complete(m,'photo'); im.src=rd.result; };
  rd.onerror=()=>complete(m,'photo'); rd.readAsDataURL(file);
}
function complete(m,how){
  const s=AS(), first=!s.done[m.id]; s.done[m.id]=Date.now(); DW.save();
  if(first){ DW.addStars(ID,1); }
  DW.emit('collect');
  const n=Object.keys(s.done).filter(mById).length;
  if(view!=='mission'||curM!==m) return;
  stampFx(m.ic,m.col,()=>{ if(view==='mission'&&curM===m){ mission(m.id,true); } });
  DW.sfx('thud'); DW.confetti(50);
  if(first&&n===1) GK.after(1200,()=>DW.addSticker(ID));
  DW.say(how==='photo'?'Tolles Foto! ':'Super gemacht! ');
  DW.say(first?'Du bekommst einen Stempel in deinen Ausflugs-Pass.':'Du hast diesen Auftrag noch einmal geschafft!',{queue:true});
  if(first&&n===MISSIONS.length) DW.say('Wow! Du hast alle Draußen-Aufträge geschafft. Du bist ein echter Natur-Forscher!',{queue:true});
}
function stampFx(icon,col,after){
  const fx=DW.h(`<div class="au-stampfx">${stampHTML(icon,col)}</div>`); root.appendChild(fx);
  GK.after(2300,()=>{ fx.classList.add('out'); GK.after(400,()=>{ fx.remove(); after&&after(); after=null; }); });
  /* Wegtippen erst nach einem NEUEN Tipp auf den Stempel – das Loslassen des Halte-Knopfs landet sonst hier und
     der Stempel wäre sofort wieder weg (samt abgeschnittenem Lob) */
  const t0=performance.now(); let armed=false;
  fx.addEventListener('pointerdown',()=>{ armed=performance.now()-t0>600; });
  fx.onclick=()=>{ if(!armed) return; fx.remove(); after&&after(); after=null; };
}

/* ---------------------------------------------------------------------
   B) Museumsbesuch: Suchheft
   --------------------------------------------------------------------- */
function museum(k){
  const M=MUSEUMS[k]; curMus=k; view='museum'; GK.idle.stop(); const s=AS(), got=s.mus[k];
  root.innerHTML=`<div class="au fill au-mus" style="--c:${M.col}">${head('Museumsbesuch',true)}
    <div class="au-tabs">${Object.keys(MUSEUMS).map(q=>`<button class="au-tab ${q===k?'on':''}" data-k="${q}" type="button">${ic(MUSEUMS[q].ic)}<span>${MUSEUMS[q].short}</span>${s.musDone[q]?`<i class="au-tick">${ART.icon('check')}</i>`:''}</button>`).join('')}
      <button class="au-ask" type="button" aria-label="Nicht gefunden?">${ic('au_eltern')}<span>?</span></button></div>
    <div class="au-scroll"><p class="au-mname hand">${M.n}</p><div class="au-tgrid">${M.tasks.map(t=>`<div class="au-task ${got[t.id]?'found':''}" data-id="${t.id}">
      <button class="au-tpic" type="button" aria-label="${esc(t.t)}"><span class="au-blob"></span>${picHTML(t.pic,t.fos)}<span class="au-say">${ART.icon('lautsprecher')}</span></button>
      <b class="hand">${t.t}</b><button class="au-check" type="button" aria-label="Gefunden">${ART.icon('check')}</button></div>`).join('')}</div>
      <div class="au-mprog">${GK.progress(Object.keys(got).length,M.tasks.length)}</div></div></div>`;
  wireHead(home);
  DW.$$('.au-tab',root).forEach(b=>b.onclick=()=>{ if(b.dataset.k!==k){ DW.sfx('whoosh'); museum(b.dataset.k); } });
  root.querySelector('.au-ask').onclick=()=>{ DW.sfx('tap'); DW.say(M.ask); };
  DW.$$('.au-task',root).forEach(el=>{ const t=M.tasks.find(x=>x.id===el.dataset.id);
    el.querySelector('.au-tpic').onclick=()=>{ DW.sfx('tap'); DW.$$('.au-task.act',root).forEach(x=>x.classList.remove('act')); el.classList.add('act'); DW.say(t.say); };
    el.querySelector('.au-check').onclick=()=>toggleFound(k,t,el); });
  DW.say(M.say);
  GK.idle.set(()=>GK.pulse(root.querySelector('.au-task:not(.found) .au-tpic')),()=>DW.say('Tippe auf ein Bild, dann hörst du deinen Suchauftrag.'));
}
function toggleFound(k,t,el){
  const M=MUSEUMS[k], s=AS(), got=s.mus[k];
  if(got[t.id]){ delete got[t.id]; DW.save(); el.classList.remove('found'); DW.sfx('pop'); DW.say('Okay, dann such noch einmal.'); }
  else { got[t.id]=Date.now(); DW.save(); el.classList.add('found'); GK.ok(fb(el.querySelector('.au-check'))); DW.sfx('star');
    DW.say('Gefunden! ',{}); DW.say(t.fact,{queue:true}); }
  const n=Object.keys(got).length; const pg=root.querySelector('.au-mprog'); if(pg) pg.innerHTML=GK.progress(n,M.tasks.length);
  if(n===M.tasks.length&&!s.musDone[k]){
    s.musDone[k]=Date.now(); DW.save(); DW.emit('collect');
    GK.after(2600,()=>{ if(view!=='museum') return; view='finish';
      GK.finish(root,{id:ID,stars:3,title:'Museums-Stempel!',art:stampHTML(M.ic,M.col),
        say:'Du hast alle Suchaufträge im Museum gefunden! Dafür bekommst du den Museums-Stempel in deinen Ausflugs-Pass.',
        extra:`<p class="hand" style="font-size:24px;margin:4px 0">${M.n}</p>`,again:()=>home()}); });
  }
}

/* ---------------------------------------------------------------------
   Ausflugs-Pass
   --------------------------------------------------------------------- */
function pass(){
  view='pass'; curM=null; GK.idle.stop(); const s=AS(); const name=(DW.state.name||'').trim();
  const slots=MISSIONS.map(m=>({k:'m',id:m.id,ic:m.ic,col:m.col,t:m.t,done:s.done[m.id]}))
    .concat(Object.keys(MUSEUMS).map(k=>({k:'mu',id:k,ic:MUSEUMS[k].ic,col:MUSEUMS[k].col,t:MUSEUMS[k].short,done:s.musDone[k]})));
  root.innerHTML=`<div class="au fill">${head('Mein Ausflugs-Pass',true)}
    <div class="au-scroll"><div class="au-passbook card">
      <div class="au-pcover"><img src="${DW.svgURL(ART.avatar(me(),{lupe:true}))}" alt=""><div><b class="hand">${name?esc(name):'Forscher-Pass'}</b><span class="hand">${stampCount()} von ${stampMax()} Stempeln</span></div></div>
      <div class="au-slots">${slots.map((x,j)=>`<button class="au-slot ${x.done?'on':''}" data-k="${x.k}" data-id="${x.id}" type="button" style="--rot:${(j*37%11)-5}deg">
        ${x.done?stampHTML(x.ic,x.col):`<span class="au-empty">${ic(x.ic)}</span>`}${x.k==='m'&&s.photo[x.id]?'<img class="au-sph" alt="" hidden>':''}
        <small>${x.t}</small></button>`).join('')}</div></div></div></div>`;
  wireHead(()=>home());
  DW.$$('.au-slot',root).forEach(b=>b.onclick=()=>{ DW.sfx('pop'); if(b.dataset.k==='m') mission(b.dataset.id); else museum(b.dataset.id); });
  DW.$$('.au-slot',root).forEach(async b=>{ const im=b.querySelector('.au-sph'); if(!im) return; const u=await IDB.get('ausflug:'+b.dataset.id); if(u&&view==='pass'){ im.src=u; im.hidden=false; } });
  const n=stampCount();
  DW.say(n?`Das ist dein Ausflugs-Pass. Du hast schon ${n} ${n===1?'Stempel':'Stempel'}! Tippe auf einen leeren Platz, dann holst du dir den nächsten.`:'Das ist dein Ausflugs-Pass. Noch ist er leer. Für jeden Ausflugs-Auftrag bekommst du hier einen Stempel!');
}

/* ---------------------------------------------------------------------
   C) Infos für Erwachsene + Druckvorlagen
   --------------------------------------------------------------------- */
function parents(){
  DW.hush();
  const m=DW.modal(`<div class="au-parents"><h2>Für Erwachsene</h2>
    <p>Diese Station bringt die Dino-Welt nach draußen. Das Kind wählt einen Auftrag; die App liest alles vor. Lesen ist nicht nötig.</p>
    <h3>So funktioniert’s</h3><ul>
     <li><b>Draußen-Forscher:</b> Karte antippen, gemeinsam anhören, draußen ausprobieren. Danach ein Foto machen – oder Sie halten den grünen Knopf „Geschafft!“ etwa 2 Sekunden gedrückt. Dafür gibt es einen Stempel im Ausflugs-Pass.</li>
     <li><b>Museumsbesuch:</b> Suchheft vor Ort nutzen. Bild antippen = Auftrag hören, Haken = gefunden. Wenn alles gefunden ist, gibt es den Museums-Stempel.</li>
     <li>Fotos werden nur verkleinert auf diesem Gerät gespeichert und nirgendwohin gesendet.</li></ul>
    <h3>Sicherheit</h3><ul>
     <li>Alle Aufträge sind für Kinder in Begleitung eines Erwachsenen gedacht – besonders an Straßen, Gewässern und in Parks.</li>
     <li>Nichts in den Mund nehmen; nach Sand, Erde, Steinen und Schneckenhäusern Hände waschen.</li>
     <li>Tiere, Nester und lebende Schnecken nur anschauen. Steine nach dem Hochheben genau zurücklegen.</li>
     <li>Fossilien in Gebäuden, Mauern und Treppen nur ansehen und fotografieren – nicht klopfen oder kratzen.</li></ul>
    <h3>Zum Museum</h3><ul>
     <li>Öffnungszeiten, Eintritt und Fotoregeln bitte vorher auf der Website des Museums oder an der Kasse erfragen.</li>
     <li>Ausstellungen werden manchmal umgebaut. Wenn etwas fehlt: an der Information nachfragen oder die Aufgabe einfach überspringen.</li>
     <li>Das Suchheft „Jedes Naturkundemuseum“ funktioniert auch in anderen Museen.</li></ul>
    <h3>Tipps</h3><ul>
     <li>Helle Kalksteine an Treppen, Sockeln und Fensterbänken enthalten oft kleine Muschelschalen. Nicht jeder Stein hat Fossilien – das Suchen gehört dazu.</li>
     <li>Lassen Sie das Kind erzählen, was es sieht: Farbe, Form, groß oder klein. Beobachten ist wichtiger als „richtig“.</li></ul>
    <h3>Zum Ausdrucken</h3>
    <div class="au-prow"><button class="btn ghost" data-p="out" type="button">${ART.icon('au_drucker',34)}Draußen-Karten</button>
     <button class="btn ghost" data-p="berlin" type="button">${ART.icon('au_drucker',34)}Suchheft Berlin</button>
     <button class="btn ghost" data-p="any" type="button">${ART.icon('au_drucker',34)}Suchheft jedes Museum</button></div></div>`);
  DW.$$('[data-p]',m).forEach(b=>b.onclick=()=>{ DW.sfx('tap'); m.close(); printSheet(b.dataset.p); });
}
function printHTML(kind){
  const foot=`<p class="au-pfoot">Dino-Inselwelt · Forscher-Ausflug</p>`;
  if(kind==='out') return `<h1>Draußen-Forscher · Auftragskarten</h1><div class="au-pcards">${MISSIONS.map(m=>`<section class="au-pc" style="--c:${m.col}">
    <header><span class="au-pci">${ic(m.ic)}</span><h2>${m.t}</h2></header><p class="au-pcs">${m.say}</p>
    <ol>${m.steps.map(st=>`<li><span class="au-psi">${ic(st.ic)}</span><span>${st.t}</span></li>`).join('')}</ol>
    ${m.safe?`<p class="au-pcsafe"><b>Mit einem Erwachsenen:</b> ${m.safe}</p>`:''}
    <p class="au-pcdino"><b>Dino-Brücke:</b> ${m.dino}</p>
    <footer><span class="au-pbox"></span> Geschafft! <span class="au-pline">Datum:</span></footer></section>`).join('')}</div>${foot}`;
  const M=MUSEUMS[kind];
  return `<h1>Suchheft: ${M.n}</h1><p class="au-psub">Name: ______________________ &nbsp; Datum: ____________</p>
    <div class="au-ptasks">${M.tasks.map((t,j)=>`<section class="au-pt"><span class="au-pbox big"></span><span class="au-pci">${picHTML(t.pic,t.fos)}</span>
    <div><h2>${j+1}. ${t.t}</h2><p>${t.say}</p><p class="au-ptf">${t.fact}</p></div></section>`).join('')}</div>
    <p class="au-pcsafe">${M.ask}</p>${foot}`;
}
function printSheet(kind,preview){
  cleanPrint();
  printEl=DW.h(`<div class="au-print${preview?' au-preview':''}">${printHTML(kind)}</div>`);
  document.body.appendChild(printEl); document.body.classList.add('au-printing');
  if(preview) return;
  const done=()=>{ window.removeEventListener('afterprint',done); cleanPrint(); };
  window.addEventListener('afterprint',done);
  setTimeout(()=>{ try{ window.print(); }catch(e){} setTimeout(()=>{ if(!matchMedia('print').matches) done(); },1500); },300);
}
function cleanPrint(){ if(printEl){ printEl.remove(); printEl=null; } document.body.classList.remove('au-printing'); }

/* Test-Hilfen */
if(window.DW_DEBUG) window.__ausflugTest={mission,complete:id=>complete(mById(id),'hold'),museum,findAll:k=>{ const M=MUSEUMS[k]; M.tasks.forEach(t=>{ const el=root.querySelector(`.au-task[data-id="${t.id}"]`); if(el&&!el.classList.contains('found')) toggleFound(k,t,el); }); },
  pass,home,outList,print:k=>printSheet(k,true),cleanPrint,parents};

function unmount(){ GK.idle.stop(); cleanPrint(); view='home'; curM=null; root=null; }
DW.stations[ID]={title:'Forscher-Ausflug',mount,unmount};
})();
