/* =====================================================================
   DINO-INSELWELT · data.js — alle Inhalte an einem Ort
   Texte sind für Kinder von 4–8 Jahren geschrieben: kurz, anschaulich,
   zum Vorlesen. Hier kann alles geändert und ergänzt werden.
   ===================================================================== */
(function(){
"use strict";
const D = {};

/* ---------------- Erdzeitalter (für Stationen) ---------------- */
D.ERAS = [
 {id:'devon',    n:'Devon',    a:419, b:359, col:'#dcae78', icon:'animal:dunkleosteus', short:'Die Zeit der Fische',
  say:'Im Devon lebten ganz viele Fische. Manche hatten einen Panzer am Kopf. Die ersten Tiere krabbelten ans Land.'},
 {id:'karbon',   n:'Karbon',   a:359, b:299, col:'#95c0b5', icon:'animal:meganeura', short:'Riesige Farnwälder',
  say:'Im Karbon wuchsen riesige Wälder aus Farnen. Libellen waren so groß wie eine Taube!'},
 {id:'perm',     n:'Perm',     a:299, b:252, col:'#ee9a82', icon:'animal:dimetrodon', short:'Das Riesenland Pangäa',
  say:'Im Perm waren alle Länder zu einem einzigen Riesenland zusammengewachsen: Pangäa. Manche Tiere hatten ein Segel auf dem Rücken.'},
 {id:'trias',    n:'Trias',    a:252, b:201, col:'#b58cbd', icon:'animal:coelophysis', short:'Die ersten Dinosaurier',
  say:'In der Trias liefen die ersten Dinosaurier herum. Sie waren noch klein und flink.'},
 {id:'jura',     n:'Jura',     a:201, b:145, col:'#8ccbd8', icon:'animal:brachiosaurus', short:'Riesen mit langem Hals',
  say:'Im Jura lebten die riesigen Langhals-Dinosaurier. Und die ersten Vögel flatterten durch die Luft.'},
 {id:'kreide',   n:'Kreide',   a:145, b:66,  col:'#b4d98f', icon:'animal:trex', short:'T-Rex und die ersten Blumen',
  say:'In der Kreidezeit lebten der Tyrannosaurus und der Triceratops. Die ersten Blumen blühten.'},
 {id:'palaeogen',n:'Paläogen', a:66,  b:23,  col:'#f8bf8f', icon:'animal:mesohippus', short:'Die Säugetiere werden groß',
  say:'Nach den Dinosauriern wurden die Säugetiere groß. Die ersten Pferde waren so klein wie ein Hund.'},
 {id:'neogen',   n:'Neogen',   a:23,  b:2.6, col:'#fbe78a', icon:'animal:megalodon', short:'Hohe Berge, weites Grasland',
  say:'Im Neogen wuchsen hohe Berge und weite Graslandschaften. Im Meer schwamm der riesige Hai Megalodon.'},
 {id:'quartaer', n:'Eiszeit',  a:2.6, b:0,   col:'#f6f2a4', icon:'animal:mammut', short:'Mammuts im Schnee',
  say:'In der Eiszeit war es sehr kalt. Mammuts mit dickem Fell stapften durch den Schnee.'},
];
D.eraById = id => D.ERAS.find(e=>e.id===id);

/* ---------------- Tiere ----------------
   id, n=Name, art=Zeichnung, era, place=Fundort, len=Länge, kg=Gewicht,
   food: fleisch | pflanzen | alles | fisch | insekten,  fact=Satz zum Vorlesen */
D.ANIMALS = [
 // Devon
 {id:'dunkleosteus',n:'Dunkleosteus',era:'devon',place:'Nordamerika',len:'6 m',food:'fleisch',fact:'Ein riesiger Fisch mit einem Panzer am Kopf. Statt Zähnen hatte er scharfe Knochenplatten.'},
 {id:'eusthenopteron',n:'Eusthenopteron',era:'devon',place:'Kanada',len:'1,5 m',food:'fleisch',fact:'Ein Fisch mit ganz kräftigen Flossen. Er ist ein Verwandter der ersten Tiere mit Beinen.'},
 {id:'tiktaalik',n:'Tiktaalik',era:'devon',place:'Kanada',len:'2,5 m',food:'fleisch',fact:'Halb Fisch, halb Landtier! Er konnte sich mit seinen Flossen am Ufer abstützen.'},
 {id:'bothriolepis',n:'Bothriolepis',era:'devon',place:'überall auf der Welt',len:'30 cm',food:'pflanzen',fact:'Ein kleiner Fisch mit einem harten Panzer, wie eine Ritterrüstung.'},
 {id:'cladoselache',n:'Cladoselache',era:'devon',place:'Nordamerika',len:'2 m',food:'fisch',fact:'Einer der allerersten Haie. Er schwamm schon vor 370 Millionen Jahren durchs Meer.'},
 {id:'ichthyostega',n:'Ichthyostega',era:'devon',place:'Grönland',len:'1,5 m',food:'fleisch',fact:'Eines der ersten Tiere mit vier Beinen. Den Schwanz hatte es noch wie ein Fisch.'},
 {id:'hynerpeton',n:'Hynerpeton',era:'devon',place:'Nordamerika',len:'1 m',food:'fleisch',fact:'Es lebte im flachen Wasser und am Ufer – eines der ersten Vierbeiner.'},
 // Karbon
 {id:'meganeura',n:'Meganeura',era:'karbon',place:'Frankreich',len:'70 cm Flügel',food:'insekten',fact:'Eine Riesenlibelle! Ihre Flügel waren so groß wie die einer Taube.'},
 {id:'arthropleura',n:'Arthropleura',era:'karbon',place:'Europa',len:'2 m',food:'pflanzen',fact:'Ein Tausendfüßer so lang wie ein Auto. Er fraß Pflanzen im Farnwald.'},
 {id:'hylonomus',n:'Hylonomus',era:'karbon',place:'Kanada',len:'20 cm',food:'insekten',fact:'Eines der allerersten Reptilien. Es sah aus wie eine kleine Eidechse.'},
 {id:'diplocaulus',n:'Diplocaulus',era:'karbon',place:'Nordamerika',len:'1 m',food:'fleisch',fact:'Sein Kopf sah aus wie ein Bumerang! Damit glitt es gut durchs Wasser.'},
 {id:'pulmonoscorpius',n:'Pulmonoscorpius',era:'karbon',place:'Schottland',len:'70 cm',food:'insekten',fact:'Ein Riesenskorpion, fast so lang wie ein Kinderarm.'},
 {id:'proterogyrinus',n:'Proterogyrinus',era:'karbon',place:'Schottland',len:'1 m',food:'fleisch',fact:'Es jagte im Wasser und an Land – ein bisschen wie ein Krokodil.'},
 // Perm
 {id:'dimetrodon',n:'Dimetrodon',era:'perm',place:'Nordamerika',len:'3 m',food:'fleisch',fact:'Kein Dinosaurier! Er ist ein Vorfahre der Säugetiere – mit einem großen Segel auf dem Rücken.'},
 {id:'edaphosaurus',n:'Edaphosaurus',era:'perm',place:'Nordamerika',len:'3 m',food:'pflanzen',fact:'Auch er hatte ein Rückensegel. Damit konnte er sich in der Sonne aufwärmen.'},
 {id:'gorgonops',n:'Gorgonops',era:'perm',place:'Südafrika',len:'2 m',food:'fleisch',fact:'Ein Jäger mit langen Säbelzähnen – lange bevor es Säbelzahnkatzen gab.'},
 {id:'scutosaurus',n:'Scutosaurus',era:'perm',place:'Russland',len:'2,5 m',food:'pflanzen',fact:'Ein dicker Pflanzenfresser mit knubbeligen Knochenplatten in der Haut.'},
 {id:'lystrosaurus',n:'Lystrosaurus',era:'perm',place:'Afrika und Antarktis',len:'1 m',food:'pflanzen',fact:'Er hatte zwei kleine Stoßzähne und hat eine große Katastrophe überlebt.'},
 {id:'moschops',n:'Moschops',era:'perm',place:'Südafrika',len:'2,5 m',food:'pflanzen',fact:'Sein Schädel war ganz dick. Vielleicht stießen die Tiere mit den Köpfen gegeneinander.'},
 {id:'coelurosauravus',n:'Coelurosauravus',era:'perm',place:'Madagaskar',len:'40 cm',food:'insekten',fact:'Eine Echse, die von Baum zu Baum gleiten konnte.'},
 // Trias
 {id:'coelophysis',n:'Coelophysis',era:'trias',place:'Nordamerika',len:'3 m',food:'fleisch',kg:25,fact:'Ein schlanker, schneller Dinosaurier. Er jagte vielleicht in Gruppen.'},
 {id:'plateosaurus',n:'Plateosaurus',era:'trias',place:'Deutschland',len:'8 m',food:'pflanzen',kg:4000,fact:'Ein Dinosaurier aus Deutschland! Er konnte sich auf die Hinterbeine stellen.'},
 {id:'eoraptor',n:'Eoraptor',era:'trias',place:'Argentinien',len:'1 m',food:'alles',kg:10,fact:'Einer der allerersten Dinosaurier – klein, flink und neugierig.'},
 {id:'herrerasaurus',n:'Herrerasaurus',era:'trias',place:'Argentinien',len:'5 m',food:'fleisch',fact:'Ein früher Raubdinosaurier mit scharfen Zähnen und langen Beinen.'},
 {id:'postosuchus',n:'Postosuchus',era:'trias',place:'Nordamerika',len:'5 m',food:'fleisch',fact:'Ein Verwandter der Krokodile, der auf langen Beinen an Land jagte.'},
 {id:'nothosaurus',n:'Nothosaurus',era:'trias',place:'Deutschland',len:'4 m',food:'fisch',fact:'Ein Meeresreptil mit langem Hals. Es schnappte nach Fischen.'},
 {id:'cynognathus',n:'Cynognathus',era:'trias',place:'Südafrika',len:'1,2 m',food:'fleisch',fact:'Ein Tier mit Hundekopf – ein Vorfahre der Säugetiere.'},
 {id:'ichthyosaurus',n:'Ichthyosaurus',era:'jura',place:'England und Deutschland',len:'2 m',food:'fisch',fact:'Er sah aus wie ein Delfin, war aber ein Meeresreptil. Er hatte riesige Augen.'},
 // Jura
 {id:'allosaurus',n:'Allosaurus',era:'jura',place:'Nordamerika',len:'9 m',food:'fleisch',kg:2000,fact:'Der große Jäger im Jura – lange bevor es den T-Rex gab.'},
 {id:'stegosaurus',n:'Stegosaurus',era:'jura',place:'Nordamerika',len:'9 m',food:'pflanzen',kg:4000,eats:['farn','moos','blaetter'],teeth:'winzige Zähnchen',fact:'Er hatte große Platten auf dem Rücken und Stacheln am Schwanz. Sein Gehirn war nur so groß wie eine Walnuss.'},
 {id:'diplodocus',n:'Diplodocus',era:'jura',place:'Nordamerika',len:'26 m',food:'pflanzen',kg:15000,eats:['blaetter','farn','zapfen'],teeth:'Zähne wie Stifte',fact:'So lang wie zwei Busse hintereinander! Sein Schwanz war wie eine Peitsche.'},
 {id:'brachiosaurus',n:'Brachiosaurus',era:'jura',place:'Nordamerika und Afrika',len:'22 m',food:'pflanzen',kg:30000,eats:['blaetter','farn','zapfen'],teeth:'Löffelzähne',fact:'Mit seinem langen Hals kam er an die höchsten Baumwipfel – so hoch wie ein Haus mit vier Stockwerken.'},
 {id:'brontosaurus',n:'Brontosaurus',era:'jura',place:'Nordamerika',len:'22 m',food:'pflanzen',kg:15000,fact:'Sein Name heißt „Donner-Echse“. Wenn er lief, bebte vielleicht der Boden.'},
 {id:'mamenchisaurus',n:'Mamenchisaurus',era:'jura',place:'China',len:'26 m',food:'pflanzen',fact:'Er hatte einen der längsten Hälse überhaupt – halb so lang wie sein ganzer Körper.'},
 {id:'archaeopteryx',n:'Archaeopteryx',era:'jura',place:'Deutschland',len:'50 cm',food:'insekten',kg:1,eats:['insekten','kleintier'],teeth:'Kiefer mit kleinen spitzen Zähnen',fact:'Halb Dino, halb Vogel: Er hatte Federn wie ein Vogel und Zähne wie ein Dino. Gefunden in Bayern!'},
 {id:'ceratosaurus',n:'Ceratosaurus',era:'jura',place:'Nordamerika',len:'6 m',food:'fleisch',fact:'Ein Raubdinosaurier mit einem Horn auf der Nase.'},
 {id:'dilophosaurus',n:'Dilophosaurus',era:'jura',place:'Nordamerika',len:'6 m',food:'fleisch',kg:400,fact:'Er hatte zwei dünne Kämme auf dem Kopf, wie ein Hahn.'},
 {id:'compsognathus',n:'Compsognathus',era:'jura',place:'Deutschland',len:'1 m',food:'fleisch',kg:3,fact:'Einer der kleinsten Dinosaurier – kaum größer als ein Huhn.'},
 {id:'kentrosaurus',n:'Kentrosaurus',era:'jura',place:'Tansania',len:'5 m',food:'pflanzen',fact:'Ein Verwandter des Stegosaurus mit ganz vielen spitzen Stacheln.'},
 {id:'plesiosaurus',n:'Plesiosaurus',era:'jura',place:'England',len:'3,5 m',food:'fisch',fact:'Ein Meeresreptil mit langem Hals und vier Flossen wie Paddel.'},
 // Kreide
 {id:'trex',n:'Tyrannosaurus rex',short:'T-Rex',era:'kreide',place:'Nordamerika',len:'12 m',food:'fleisch',kg:6000,eats:['fleisch','aas','kleintier'],teeth:'spitze Reißzähne',fact:'Der berühmte König der Dinos! Ein einziger Zahn war so groß wie eine Banane.'},
 {id:'triceratops',n:'Triceratops',era:'kreide',place:'Nordamerika',len:'9 m',food:'pflanzen',kg:8000,eats:['farn','wurzeln','blaetter'],teeth:'Schnabel und Mahlzähne',fact:'Drei Hörner und ein großer Nackenschild. Er hatte über 400 Zähne!'},
 {id:'velociraptor',n:'Velociraptor',era:'kreide',place:'Mongolei',len:'2 m',food:'fleisch',kg:15,eats:['fleisch','eier','kleintier'],teeth:'scharfe Sägezähne',fact:'So groß wie ein Truthahn – und er hatte Federn!'},
 {id:'spinosaurus',n:'Spinosaurus',era:'kreide',place:'Nordafrika',len:'15 m',food:'fisch',kg:7000,eats:['fisch','fleisch','kleintier'],teeth:'spitze Fangzähne',fact:'Er schwamm viel und fing Fische. Auf dem Rücken trug er ein großes Segel.'},
 {id:'ankylosaurus',n:'Ankylosaurus',era:'kreide',place:'Nordamerika',len:'8 m',food:'pflanzen',kg:5000,eats:['farn','wurzeln','moos'],teeth:'kleine Blattzähne',fact:'Gepanzert wie ein Panzer – und am Schwanz eine dicke Keule.'},
 {id:'pteranodon',n:'Pteranodon',era:'kreide',place:'Nordamerika',len:'6 m Flügel',food:'fisch',kg:30,eats:['fisch','kleintier'],teeth:'Schnabel ohne Zähne',fact:'Kein Dinosaurier, sondern ein Flugsaurier. Er segelte übers Meer und fing Fische.'},
 {id:'parasaurolophus',n:'Parasaurolophus',era:'kreide',place:'Nordamerika',len:'10 m',food:'pflanzen',fact:'Mit seinem hohlen Kopfkamm konnte er laut tröten – wie eine Trompete.'},
 {id:'giganotosaurus',n:'Giganotosaurus',era:'kreide',place:'Südamerika',len:'12 m',food:'fleisch',fact:'Ein Riesen-Jäger, fast so groß wie der T-Rex.'},
 {id:'carnotaurus',n:'Carnotaurus',era:'kreide',place:'Südamerika',len:'8 m',food:'fleisch',fact:'Er hatte zwei Hörner über den Augen, wie ein Stier – und ganz winzige Arme.'},
 {id:'deinonychus',n:'Deinonychus',era:'kreide',place:'Nordamerika',len:'3 m',food:'fleisch',fact:'Er hatte eine große, gebogene Kralle an jedem Fuß.'},
 {id:'utahraptor',n:'Utahraptor',era:'kreide',place:'Nordamerika',len:'6 m',food:'fleisch',fact:'Der größte Raptor – mit Federn und einer riesigen Fußkralle.'},
 {id:'microraptor',n:'Microraptor',era:'kreide',place:'China',len:'80 cm',food:'fleisch',fact:'Ein kleiner Dino mit vier Flügeln! Er konnte von Baum zu Baum gleiten.'},
 {id:'argentinosaurus',n:'Argentinosaurus',era:'kreide',place:'Argentinien',len:'35 m',food:'pflanzen',kg:70000,fact:'Einer der größten Dinosaurier überhaupt – so schwer wie zehn Elefanten.'},
 {id:'styracosaurus',n:'Styracosaurus',era:'kreide',place:'Nordamerika',len:'5,5 m',food:'pflanzen',fact:'Sein Nackenschild hatte lange Stacheln wie eine Krone.'},
 {id:'protoceratops',n:'Protoceratops',era:'kreide',place:'Mongolei',len:'2 m',food:'pflanzen',fact:'Ein kleiner Verwandter des Triceratops, so groß wie ein Schaf.'},
 {id:'pachyrhinosaurus',n:'Pachyrhinosaurus',era:'kreide',place:'Kanada',len:'6 m',food:'pflanzen',fact:'Statt eines Horns hatte er einen dicken Knubbel auf der Nase.'},
 {id:'corythosaurus',n:'Corythosaurus',era:'kreide',place:'Kanada',len:'9 m',food:'pflanzen',fact:'Sein Kopfkamm sah aus wie ein halber Teller.'},
 {id:'edmontosaurus',n:'Edmontosaurus',era:'kreide',place:'Nordamerika',len:'12 m',food:'pflanzen',fact:'Ein Entenschnabel-Dino mit hunderten Zähnen zum Mahlen.'},
 {id:'iguanodon',n:'Iguanodon',era:'kreide',place:'Europa',len:'10 m',food:'pflanzen',fact:'Er hatte einen spitzen Dorn am Daumen. Auch in Deutschland wurde er gefunden.'},
 {id:'pachycephalosaurus',n:'Pachycephalosaurus',era:'kreide',place:'Nordamerika',len:'4,5 m',food:'pflanzen',fact:'Er hatte einen ganz dicken, runden Dickkopf aus Knochen.'},
 {id:'gallimimus',n:'Gallimimus',era:'kreide',place:'Mongolei',len:'6 m',food:'alles',kg:400,fact:'Er sah aus wie ein Strauß und war einer der schnellsten Dinos.'},
 {id:'therizinosaurus',n:'Therizinosaurus',era:'kreide',place:'Mongolei',len:'10 m',food:'pflanzen',fact:'Er hatte die längsten Krallen aller Tiere – aber er fraß Pflanzen!'},
 {id:'quetzalcoatlus',n:'Quetzalcoatlus',era:'kreide',place:'Nordamerika',len:'11 m Flügel',food:'fleisch',fact:'Der größte Flugsaurier. Wenn er stand, war er so groß wie eine Giraffe.'},
 {id:'mosasaurus',n:'Mosasaurus',era:'kreide',place:'Europa',len:'15 m',food:'fisch',fact:'Ein riesiges Meeresreptil mit starken Kiefern. Der erste wurde in Holland gefunden.'},
 // Paläogen
 {id:'titanoboa',n:'Titanoboa',era:'palaeogen',place:'Kolumbien',len:'13 m',food:'fleisch',fact:'Die größte Schlange aller Zeiten – so lang wie ein Bus!'},
 {id:'gastornis',n:'Gastornis',era:'palaeogen',place:'Europa',len:'2 m hoch',food:'pflanzen',fact:'Ein riesiger Vogel, der nicht fliegen konnte. Sein Schnabel war riesig.'},
 {id:'pantolambda',n:'Pantolambda',era:'palaeogen',place:'Nordamerika',len:'1 m',food:'pflanzen',fact:'Eines der ersten größeren Säugetiere nach den Dinosauriern.'},
 {id:'ptilodus',n:'Ptilodus',era:'palaeogen',place:'Nordamerika',len:'50 cm',food:'alles',fact:'Ein kleines Säugetier, das aussah wie ein Eichhörnchen.'},
 {id:'basilosaurus',n:'Basilosaurus',era:'palaeogen',place:'Ägypten',len:'18 m',food:'fisch',fact:'Ein Urwal – lang wie eine Seeschlange. Er hatte noch winzige Hinterbeine.'},
 {id:'uintatherium',n:'Uintatherium',era:'palaeogen',place:'Nordamerika',len:'4 m',food:'pflanzen',fact:'Ein großes Säugetier mit sechs Knubbeln auf dem Kopf.'},
 {id:'andrewsarchus',n:'Andrewsarchus',era:'palaeogen',place:'Mongolei',len:'3,5 m',food:'fleisch',fact:'Ein Raubsäugetier mit einem riesigen Kopf.'},
 {id:'ambulocetus',n:'Ambulocetus',era:'palaeogen',place:'Pakistan',len:'3 m',food:'fisch',fact:'Sein Name heißt „laufender Wal“: ein Wal, der noch Beine hatte!'},
 {id:'paraceratherium',n:'Paraceratherium',era:'palaeogen',place:'Asien',len:'8 m',food:'pflanzen',fact:'Das größte Säugetier, das je an Land lebte – ein Nashorn ohne Horn.'},
 {id:'hyaenodon',n:'Hyaenodon',era:'palaeogen',place:'Nordamerika und Europa',len:'1,5 m',food:'fleisch',fact:'Ein Jäger mit kräftigen Kiefern.'},
 {id:'mesohippus',n:'Mesohippus',era:'palaeogen',place:'Nordamerika',len:'60 cm hoch',food:'pflanzen',fact:'Ein Urpferd – nur so groß wie ein Hund und mit drei Zehen.'},
 {id:'entelodon',n:'Entelodon',era:'palaeogen',place:'Nordamerika und Asien',len:'2 m',food:'alles',fact:'Ein riesiges Urschwein, das fast alles fraß.'},
 // Neogen
 {id:'megalodon',n:'Megalodon',era:'neogen',place:'alle Meere',len:'16 m',food:'fleisch',fact:'Der größte Hai aller Zeiten. Seine Zähne waren so groß wie eine Hand.'},
 // Eiszeit
 {id:'mammut',n:'Mammut',era:'quartaer',place:'Europa und Asien',len:'3 m hoch',food:'pflanzen',kg:6000,eats:['gras','blaetter','moos'],teeth:'große Mahlzähne',fact:'Ein Elefant mit dickem Fell. Er fraß jeden Tag so viel Gras wie in eine Badewanne passt.'},
 {id:'smilodon',n:'Säbelzahnkatze',era:'quartaer',place:'Amerika',len:'2 m',food:'fleisch',kg:300,fact:'Eine große Katze mit zwei langen Säbelzähnen.'},
 {id:'megaloceros',n:'Riesenhirsch',era:'quartaer',place:'Europa',len:'2 m hoch',food:'pflanzen',fact:'Sein Geweih war so breit wie ein Auto lang ist.'},
 {id:'wollnashorn',n:'Wollnashorn',era:'quartaer',place:'Europa und Asien',len:'3,5 m',food:'pflanzen',fact:'Ein Nashorn mit dickem, wolligem Fell gegen die Kälte.'},
 {id:'hoehlenbaer',n:'Höhlenbär',era:'quartaer',place:'Europa',len:'3 m',food:'pflanzen',fact:'Ein großer Bär, der in Höhlen Winterschlaf hielt. Er fraß meistens Pflanzen.'},
];
// weitere Tiere nur für die Futter-Station
D.EXTRA = [
 {id:'struthiomimus',n:'Struthiomimus',era:'kreide',place:'Kanada',len:'4 m',food:'alles',kg:150,fact:'Er sah aus wie ein Strauß und konnte sehr schnell rennen.'},
 {id:'kaninchen',n:'Kaninchen',era:'heute',food:'pflanzen',kg:2,fact:'Ein Kaninchen wiegt ungefähr so viel wie zwei Packungen Mehl.'},
 {id:'katze',n:'Katze',era:'heute',food:'fleisch',kg:5,fact:'Eine Hauskatze ist etwa so schwer wie fünf Packungen Zucker.'},
 {id:'hund',n:'Hund',era:'heute',food:'alles',kg:30,fact:'Ein großer Hund wiegt ungefähr so viel wie ein Kind in der ersten Klasse.'},
 {id:'pferd',n:'Pferd',era:'heute',food:'pflanzen',kg:550,fact:'Ein Pferd wiegt etwa so viel wie ein kleines Auto.'},
 {id:'giraffe',n:'Giraffe',era:'heute',food:'pflanzen',kg:1200,fact:'Die Giraffe ist viel höher als ein Elefant – aber trotzdem viel leichter.'},
 {id:'elefant',n:'Elefant',era:'heute',food:'pflanzen',kg:5000,fact:'Der Afrikanische Elefant ist das schwerste Landtier, das heute lebt.'},
 {id:'oviraptor',n:'Oviraptor',art:'gallimimus',era:'kreide',food:'alles',eats:['eier','zapfen','kleintier'],teeth:'kräftiger Schnabel',fact:'Sein Name heißt „Eierdieb“. Dabei hat er wohl nur auf seine eigenen Eier aufgepasst.'},
];
D.byId = {};
D.ANIMALS.concat(D.EXTRA).forEach(a=>{ a.art=a.art||a.id; D.byId[a.id]=a; });
D.animal = id => D.byId[id];
D.nameOf = id => { const a=D.byId[id]; return a ? (a.short||a.n) : id; };
D.isDino = id => ['trias','jura','kreide'].includes((D.byId[id]||{}).era) && !['nothosaurus','ichthyosaurus','plesiosaurus','mosasaurus','pteranodon','quetzalcoatlus','postosuchus','cynognathus'].includes(id);

/* ---------------- Futter ---------------- */
D.FOODS = [
 {id:'farn',n:'Farn',art:'pflanze'},{id:'blaetter',n:'Blätter',art:'pflanze'},{id:'moos',n:'Moos',art:'pflanze'},
 {id:'gras',n:'Gras',art:'pflanze'},{id:'wurzeln',n:'Wurzeln',art:'pflanze'},{id:'zapfen',n:'Zapfen',art:'pflanze'},
 {id:'fruechte',n:'Früchte',art:'pflanze'},{id:'fleisch',n:'Fleisch',art:'fleisch'},{id:'fisch',n:'Fisch',art:'fleisch'},
 {id:'kleintier',n:'Kleines Tier',art:'fleisch'},{id:'eier',n:'Eier',art:'fleisch'},{id:'insekten',n:'Insekten',art:'fleisch'},
 {id:'aas',n:'Knochen & Aas',art:'fleisch'},
];
D.FEED_ORDER = ['trex','brachiosaurus','triceratops','velociraptor','stegosaurus','spinosaurus','ankylosaurus','diplodocus','pteranodon','archaeopteryx','oviraptor','mammut'];

/* ---------------- Funde (Fossilien) ---------------- */
D.FINDS = [
 {id:'zahn',n:'Dino-Zahn',icon:'zahn',say:'Ein Dino-Zahn! Spitze Zähne gehören zu Fleischfressern.'},
 {id:'knochen',n:'Knochen',icon:'knochen',say:'Ein versteinerter Knochen. Aus vielen Knochen wird ein Skelett.'},
 {id:'ammonit',n:'Ammonit',icon:'ammonit',say:'Ein Ammonit: ein Tintenfisch mit einem gedrehten Haus.'},
 {id:'spur',n:'Fußspur',icon:'spur',say:'Eine versteinerte Fußspur. Daran sieht man, wie schnell ein Dino lief.'},
 {id:'blatt',n:'Blattabdruck',icon:'blatt',say:'Auch Pflanzen werden zu Fossilien – als feiner Abdruck im Stein.'},
 {id:'bernstein',n:'Bernstein',icon:'bernstein',say:'Bernstein ist altes Baumharz. Manchmal steckt ein Urzeit-Insekt darin.'},
 {id:'ei',n:'Dino-Ei',icon:'ei',say:'Ein versteinertes Dino-Ei. Manche waren so groß wie ein Fußball.'},
 {id:'kristall',n:'Kristall',icon:'kristall',say:'Kristalle wachsen ganz langsam tief in der Erde.'},
 {id:'muschel',n:'Muschel',icon:'muschel',say:'Muscheln versteinern besonders gut, weil sie schon hart sind.'},
 {id:'holz',n:'Versteinertes Holz',icon:'holz',say:'Aus Holz ist in Millionen Jahren Stein geworden.'},
 {id:'fischfossil',n:'Fisch-Fossil',icon:'fischfossil',say:'Im Stein sieht man jede einzelne Gräte.'},
 {id:'trilobit',n:'Trilobit',icon:'animal:trilobit',say:'Ein Trilobit! Diese Tiere krabbelten schon vor 500 Millionen Jahren über den Meeresboden.'},
];
D.find = id => D.FINDS.find(f=>f.id===id);

/* ---------------- Sticker (Belohnungen) ---------------- */
D.STICKERS = [
 {id:'erste-reise',n:'Zeitreisende',icon:'globus'},{id:'alle-zeiten',n:'Urzeit-Profi',icon:'stern'},
 {id:'museum',n:'Museumsgast',icon:'museum'},{id:'museum-alle',n:'Museums-Kenner',icon:'lupe'},
 {id:'lauf',n:'Dino-Läufer',icon:'lauf'},
 // Landschafts-Sticker aus dem Dino-Lauf (je Landschaft zwei oder drei)
 {id:'r-palme',n:'Palme',icon:'palme',bio:'tal'},{id:'r-farn',n:'Farn',icon:'farn',bio:'tal'},{id:'r-wasserfall',n:'Wasserfall',icon:'wasserfall',bio:'tal'},
 {id:'r-muschel',n:'Muschel',icon:'muschel',bio:'kueste'},{id:'r-welle',n:'Welle',icon:'welle',bio:'kueste'},{id:'r-klippe',n:'Klippe',icon:'klippe',bio:'kueste'},
 {id:'r-vulkan',n:'Vulkan',icon:'vulkan',bio:'vulkan'},{id:'r-lava',n:'Lava',icon:'lava',bio:'vulkan'},
 {id:'r-kaktus',n:'Kaktus',icon:'kaktus',bio:'wueste'},{id:'r-duene',n:'Düne',icon:'duene',bio:'wueste'},
 {id:'r-mammut',n:'Mammut',icon:'animal:mammut',bio:'eis'},{id:'r-schnee',n:'Schneestern',icon:'schneeflocke',bio:'eis'},
 {id:'waage',n:'Waagen-Meister',icon:'waage'},{id:'futter',n:'Dino-Koch',icon:'futter'},{id:'satt',n:'Alle satt',icon:'herz'},
 {id:'grabung',n:'Ausgräber',icon:'grabung'},{id:'skelett',n:'Skelett-Bauer',icon:'knochen'},
 {id:'puzzle',n:'Puzzle-Held',icon:'puzzle'},{id:'forscher',n:'Forscher',icon:'buch'},
 {id:'blume',n:'Erste Blume',icon:'blume'},{id:'grabung-profi',n:'Fossilien-Profi',icon:'lupe'},{id:'eigenes',n:'Eigenes Experiment',icon:'stift'},
];
D.sticker = id => D.STICKERS.find(s=>s.id===id);

/* ---------------- Forscher-Figuren (Museum) ---------------- */
D.GUIDES = [
 {id:'elena',n:'Elena',role:'Pflanzen-Forscherin',skin:'#f1c9a5',hair:'#8a4a2a',coat:'#f3ead6',acc:'#8c4a36'},
 {id:'malik',n:'Malik',role:'Dino-Forscher',skin:'#8a5a3c',hair:'#1f1a16',coat:'#f3ead6',acc:'#3f6a4a'},
 {id:'sofia',n:'Sofia',role:'Meeres-Forscherin',skin:'#c89572',hair:'#2a1f18',coat:'#f3ead6',acc:'#3f7d82'},
 {id:'jonas',n:'Jonas',role:'Stein-Forscher',skin:'#f1c9a5',hair:'#d9b36c',coat:'#f3ead6',acc:'#9c7a34'},
];

/* ---------------- Stationen auf der Insel ---------------- */
D.STATIONS = [
 {id:'zeitportal',n:'Zeitportal',icon:'globus',col:'#8fbccb',say:'Das Zeitportal! Hier reist du mit der Weltkugel durch die Urzeit.'},
 {id:'museum',n:'Naturkundemuseum',icon:'museum',col:'#d9c49a',say:'Das Museum. Hier kannst du alle Urzeittiere anschauen.'},
 {id:'lauf',n:'Dino-Lauf',icon:'lauf',col:'#e7a17a',say:'Der Dino-Lauf! Hüpf mit deinem Dino über Steine und sammle Eier.'},
 {id:'waage',n:'Dino-Waage',icon:'waage',col:'#b58cbd',say:'Die Dino-Waage. Wie schwer ist ein Dinosaurier?'},
 {id:'futter',n:'Futterwald',icon:'futter',col:'#8fb77a',say:'Der Futterwald. Weißt du, was die Dinos fressen?'},
 {id:'grabung',n:'Ausgrabung',icon:'grabung',col:'#d9b36c',say:'Die Ausgrabung. Grab Knochen aus und bau ein Skelett!'},
 {id:'puzzle',n:'Puzzle-Lichtung',icon:'puzzle',col:'#9ec3d6',say:'Die Puzzle-Lichtung. Setz die Dino-Bilder zusammen!'},
 {id:'forscher',n:'Forscherhütte',icon:'buch',col:'#d98b5f',say:'Die Forscherhütte mit deinem Forscherbuch: 100 Experimente zum Ausprobieren!'},
 // geplante Orte (nächster Schritt) – bis dahin Baustelle
 {id:'dschungel',n:'Dino-Dschungel',icon:'palme',col:'#9fc28a',soon:true,say:'Der Dino-Dschungel. Hier entsteht gerade ein Hüpf-Abenteuer durch den Urwald.'},
 {id:'lager',n:'Forscher-Lager',icon:'zelt',col:'#d9c49a',soon:true,say:'Das Forscher-Lager. Bald erzählen dir hier echte Dino-Forscherinnen und -Forscher von ihrer Arbeit.'},
 {id:'klang',n:'Klanghöhle',icon:'lautsprecher',col:'#b9c7d6',soon:true,say:'Die Klanghöhle. Bald kannst du hier hören, wie Dinos vielleicht geklungen haben.'},
 {id:'karten',n:'Kartenhaus',icon:'sticker',col:'#e9c98a',soon:true,say:'Das Kartenhaus. Bald sammelst du hier Dino-Sammelkarten.'},
 {id:'kino',n:'Urzeit-Kino',icon:'kamera',col:'#c9b0d6',soon:true,say:'Das Urzeit-Kino. Bald laufen hier kleine Dino-Filme.'},
 {id:'werkstatt',n:'Modell-Werkstatt',icon:'hammer',col:'#c9b59a',soon:true,say:'Die Modell-Werkstatt. Bald kannst du hier Dinos von allen Seiten anschauen und drehen.'},
];

/* ---------------- Waage ---------------- */
D.WEIGH = [ // kg, Vergleich zum Vorlesen
 {id:'archaeopteryx',kg:1,cmp:'so schwer wie eine Packung Mehl'},
 {id:'compsognathus',kg:3,cmp:'so schwer wie eine Katze'},
 {id:'velociraptor',kg:15,cmp:'so schwer wie ein Kind im Kindergarten'},
 {id:'coelophysis',kg:25,cmp:'so schwer wie ein großer Hund'},
 {id:'pteranodon',kg:30,cmp:'so schwer wie ein Schulkind'},
 {id:'struthiomimus',kg:150,cmp:'so schwer wie zwei Erwachsene'},
 {id:'gallimimus',kg:400,cmp:'so schwer wie fünf Erwachsene'},
 {id:'dilophosaurus',kg:400,cmp:'so schwer wie ein Pony'},
 {id:'allosaurus',kg:2000,cmp:'so schwer wie ein großes Auto'},
 {id:'stegosaurus',kg:4000,cmp:'so schwer wie ein Elefant'},
 {id:'ankylosaurus',kg:5000,cmp:'so schwer wie ein Elefant'},
 {id:'trex',kg:6000,cmp:'so schwer wie ein großer Elefant'},
 {id:'mammut',kg:6000,cmp:'so schwer wie ein großer Elefant'},
 {id:'triceratops',kg:8000,cmp:'so schwer wie zwei Nashörner'},
 {id:'diplodocus',kg:15000,cmp:'so schwer wie drei Elefanten'},
 {id:'brachiosaurus',kg:30000,cmp:'so schwer wie sechs Elefanten'},
];
D.PETS = ['kaninchen','katze','hund','pferd','giraffe','elefant']; // heutige Tiere zum Vergleichen
D.THINGS = [ // Vergleichsdinge (gemalte Symbole)
 {id:'ballon',n:'Luftballon',kg:0.005,icon:'ballon'},{id:'karotte',n:'Karotte',kg:0.1,icon:'karotte'},{id:'banane',n:'Banane',kg:0.2,icon:'banane'},
 {id:'knochen',n:'Knochen',kg:3,icon:'knochen'},{id:'stein',n:'Stein',kg:8,icon:'stein'},{id:'rucksack',n:'Rucksack',kg:6,icon:'rucksack'},
 {id:'melone',n:'Melone',kg:12,icon:'melone'},{id:'fahrrad',n:'Fahrrad',kg:12,icon:'fahrrad'},{id:'kiste',n:'Kiste',kg:15,icon:'kiste'},
 {id:'wagen',n:'Einkaufswagen',kg:20,icon:'wagen'},{id:'kind',n:'Kind',kg:20,icon:'kind'},
 {id:'erwachsener',n:'Erwachsener',kg:75,icon:'mensch'},{id:'auto',n:'Auto',kg:1500,icon:'auto'},{id:'bus',n:'Bus',kg:12000,icon:'bus'},
];
D.REFS = ['kaninchen','katze','kind','hund','erwachsener','pferd','giraffe','auto','elefant','bus']; // für „Wie schwer ist er wohl?“

/* ---------------- Ausgrabung ---------------- */
D.BONES = [
 {k:'schaedel',n:'Schädel',say:'Das ist der Schädel.'},
 {k:'wirbel',n:'Wirbelsäule',say:'Das ist die Wirbelsäule.'},
 {k:'rippen',n:'Rippen',say:'Das sind die Rippen.'},
 {k:'vorderbein',n:'Vorderbein',say:'Das ist ein Vorderbein.'},
 {k:'hinterbein',n:'Hinterbein',say:'Das ist ein Hinterbein.'},
 {k:'schwanz',n:'Schwanz',say:'Das ist der Schwanz.'},
];
/* Fundstellen. animal = erstes Tier; danach wählt die Ausgrabung jedes Mal ein anderes passendes Tier aus DATA.ANIMALS
   (Zeitalter eras, Bauplan plans, Länge minM/maxM) – nur Tiere, deren Knochenfelder in stations/grabung.js ausgemessen sind. */
D.DIG_SITES = [
 {id:'wald',n:'Urzeitwald',need:0,animal:'trex',eras:['jura','kreide'],plans:['theropod'],minM:6,layers:['#8a6a48','#b08a5c','#c9a36d'],side:['blatt','holz','spur','bernstein'],say:'Weicher Waldboden. Ein guter Ort zum Anfangen!'},
 {id:'wueste',n:'Wüste',need:1,animal:'triceratops',eras:['kreide'],plans:['ceratops'],layers:['#e2c589','#d0a86a','#b88a54'],side:['zahn','ei','spur'],say:'Trockener Sand. Die Knochen liegen tiefer.'},
 {id:'fluss',n:'Flussufer',need:2,animal:'stegosaurus',eras:['jura','kreide'],plans:['stego','ornitho'],layers:['#b9a88a','#9a8a6e','#7f735f'],side:['fischfossil','muschel','blatt'],say:'Sand und Kies am Fluss. Hier findet man oft Fische.'},
 {id:'klippe',n:'Steilküste',need:3,animal:'ichthyosaurus',eras:['trias','jura'],plans:['swimmer','plesio'],layers:['#c9b99a','#a89878','#8a7e6c'],side:['ammonit','muschel','belemnit','fischfossil'],say:'Harte Felsen am Meer. Hier liegen Ammoniten!'},
 {id:'vulkan',n:'Vulkanland',need:4,animal:'velociraptor',eras:['kreide'],plans:['theropod'],maxM:6,layers:['#7a6a60','#5f524a','#8a6a5a'],side:['kristall','bernstein','zahn'],say:'Dunkles Vulkangestein – hart, aber mit seltenen Funden.'},
 {id:'eis',n:'Eishöhle',need:5,animal:'mammut',eras:['quartaer'],plans:['mammal'],layers:['#dfeaf0','#b9cdd8','#9ab0bf'],side:['knochen','zahn','kristall'],say:'Im ewigen Eis liegen die Knochen der Eiszeittiere.'},
 {id:'ebene',n:'Weite Ebene',need:6,animal:'brachiosaurus',eras:['jura','kreide'],plans:['sauropod'],layers:['#d6b98a','#c29a68','#a8835a'],side:['knochen','ei','spur'],say:'Eine weite, trockene Ebene. Hier liegen die Riesen unter den Dinos!'},
 {id:'sumpf',n:'Urzeit-Sumpf',need:7,animal:'dimetrodon',eras:['perm','karbon'],plans:['lizard','mammal'],layers:['#6f7a55','#5c6448','#4f5640'],side:['blatt','holz','zahn'],say:'Ein uralter Sumpf, noch viel älter als die Dinos. Mal sehen, wer hier lebte!'},
];

/* ---------------- Dino-Lauf ---------------- */
D.RUNNERS = [
 {id:'trex',n:'Rex',jump:1,need:0,say:'Rex springt kräftig. Der beste Dino zum Anfangen!'},
 {id:'brachiosaurus',n:'Bronto',jump:1.15,need:0,say:'Bronto ist gemütlich und springt besonders hoch.'},
 {id:'triceratops',n:'Trico',jump:.95,need:0,say:'Trico ist stark und robust.'},
 {id:'stegosaurus',n:'Stego',jump:1,need:30,say:'Stego ist freundlich und stark.'},
 {id:'velociraptor',n:'Raptor',jump:1.05,need:60,say:'Raptor ist superschnell!'},
 {id:'allosaurus',n:'Allo',jump:1,need:20,say:'Allo ist ein flinker Jäger aus dem Jura.'},
 {id:'ankylosaurus',n:'Anky',jump:.9,need:45,say:'Anky ist gepanzert wie ein Panzer. Ihn haut so schnell nichts um!'},
 {id:'diplodocus',n:'Diplo',jump:1.1,need:80,say:'Diplo hat einen ganz langen Hals und einen Peitschenschwanz.'},
 {id:'parasaurolophus',n:'Trööt',jump:1.05,need:100,say:'Trööt kann laut tröten.'},
 {id:'spinosaurus',n:'Spino',jump:1,need:120,say:'Spino hat ein Segel auf dem Rücken und liebt das Wasser.'},
 {id:'pteranodon',n:'Ptera',jump:1.25,need:150,fly:true,say:'Ptera kann fliegen! Tippe, dann flattert sie hoch.'},
];
D.BIOMES = [
 {id:'tal',n:'Grünes Tal',need:0,sky:['#bfe0ea','#f6ecd2'],far:'#a9c29a',mid:'#8fae7a',ground:'#c9a86a',grass:'#8fae6a',deco:['palme','farn'],obst:['busch','stein','stamm'],pick:'ei'},
 {id:'kueste',n:'Küste',need:25,sky:['#b3dcea','#fbf0d6'],far:'#9fb9c0',mid:'#c7b189',ground:'#e2cb96',grass:'#cbb886',deco:['palme','muschel'],obst:['stein','stamm','ptera'],pick:'muschel'},
 {id:'vulkan',n:'Vulkantal',need:60,sky:['#e9b08a','#f6dcb0'],far:'#8a6a60',mid:'#6f5a50',ground:'#8a6a58',grass:'#6f7a50',deco:['vulkan','farn'],obst:['stein','lava','stamm'],pick:'kristall'},
 {id:'wueste',n:'Wüste',need:100,sky:['#f2d9a8','#fbeed4'],far:'#d9b88a',mid:'#c9a06a',ground:'#e2c589',grass:'#c9b070',deco:['kaktus','duene'],obst:['kaktus','stein','ptera'],pick:'zahn'},
 {id:'eis',n:'Eisland',need:150,sky:['#d3e6ef','#f4f8fa'],far:'#c3d6e0',mid:'#a9c1cf',ground:'#eef3f5',grass:'#cfdde4',deco:['schneeflocke','stein'],obst:['eis','stein','stamm'],pick:'schneeflocke'},
];

/* ---------------- Puzzle ---------------- */
D.PUZZLES = ['trex','triceratops','stegosaurus','brachiosaurus','velociraptor','ankylosaurus','parasaurolophus','spinosaurus','pteranodon','mammut','plesiosaurus','dimetrodon'];

window.DATA = D;
})();
