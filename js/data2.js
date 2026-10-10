/* =====================================================================
   DINO-INSELWELT · data2.js — Erweiterung: Urzeit-Meer, Sammelkarten,
   neue Stationen, Größen und Lebensräume für die Minispiele.
   ===================================================================== */
(function(){
"use strict";
const D=window.DATA;

/* ---------------- ältere Zeitalter (für die Meerestiere) ---------------- */
D.ERAS.unshift(
 {id:'kambrium',n:'Kambrium',a:539,b:485,col:'#b7cfc4',icon:'animal:anomalocaris',short:'Leben im Urmeer',
  say:'Im Kambrium lebten alle Tiere im Meer. Es gab Trilobiten und seltsame Jäger wie Anomalocaris. An Land war noch alles kahl.'},
 {id:'ordovizium',n:'Ordovizium',a:485,b:444,col:'#a9c6d6',icon:'animal:orthoceras',short:'Tintenfische mit Spitzhut',
  say:'Im Ordovizium schwammen Tintenfische mit langen, spitzen Schalen durchs Meer. Die ersten Korallenriffe wuchsen.'},
 {id:'silur',n:'Silur',a:444,b:419,col:'#c9c0a4',icon:'animal:eurypterus',short:'Seeskorpione',
  say:'Im Silur krabbelten Seeskorpione über den Meeresboden. Die ersten kleinen Pflanzen wuchsen an Land.'});

/* ---------------- Meerestiere ----------------
   grp: fisch | reptil | saeuger | wirbellos   (für „Fisch, Reptil oder Säugetier?“)
   eats: Futter im Meer (für „Meeres-Futter“) · deep: lebte (auch) in tiefem Wasser */
const SEA=[
 {id:'anomalocaris',n:'Anomalocaris',era:'kambrium',place:'Kanada, China, Australien',len:'1 m',lenM:1,food:'fleisch',grp:'wirbellos',eats:['trilobit','wurm'],fact:'Der größte Jäger im Kambrium. Mit zwei stacheligen Greifarmen packte er seine Beute.'},
 {id:'trilobit',n:'Trilobit',era:'kambrium',place:'überall auf der Welt',len:'5 cm',lenM:.05,food:'pflanzen',grp:'wirbellos',eats:['plankton'],fact:'Trilobiten krabbelten über den Meeresboden. Sie konnten sich wie eine Rollassel einrollen.'},
 {id:'orthoceras',n:'Orthoceras',era:'ordovizium',place:'Europa',len:'30 cm',lenM:.3,food:'fleisch',grp:'wirbellos',eats:['trilobit','krebs'],fact:'Ein Tintenfisch in einer langen, geraden Schale – wie eine Eistüte.'},
 {id:'eurypterus',n:'Eurypterus',era:'silur',place:'Nordamerika und Europa',len:'20 cm',lenM:.2,food:'fleisch',grp:'wirbellos',eats:['wurm','krebs'],fact:'Ein Seeskorpion. Mit seinen Paddelbeinen konnte er schwimmen.'},
 {id:'quastenflosser',n:'Quastenflosser',era:'devon',place:'alle Meere – bis heute!',len:'2 m',lenM:2,food:'fisch',grp:'fisch',eats:['fisch','tintenfisch'],deep:true,fact:'Man dachte, er sei ausgestorben. Aber 1938 wurde ein lebender Quastenflosser gefangen!'},
 {id:'xenacanthus',n:'Xenacanthus',era:'perm',place:'Europa und Nordamerika',len:'1 m',lenM:1,food:'fleisch',grp:'fisch',eats:['fisch','krebs'],fact:'Ein Hai, der im Süßwasser lebte. Hinten am Kopf hatte er einen langen Stachel.'},
 {id:'helicoprion',n:'Helicoprion',era:'perm',place:'weltweit',len:'8 m',lenM:8,food:'fleisch',grp:'fisch',eats:['tintenfisch','fisch'],fact:'Seine Zähne wuchsen in einer Spirale – wie eine Kreissäge im Unterkiefer.'},
 {id:'edestus',n:'Edestus',era:'karbon',place:'Nordamerika und Europa',len:'6 m',lenM:6,food:'fleisch',grp:'fisch',eats:['fisch','tintenfisch'],fact:'Ein Hai mit Zähnen wie eine Schere. Oben und unten ragten gebogene Zahnreihen heraus.'},
 {id:'placodus',n:'Placodus',era:'trias',place:'Deutschland',len:'2 m',lenM:2,food:'fleisch',grp:'reptil',eats:['muschel'],fact:'Ein Meeresreptil aus Deutschland. Mit flachen Zähnen knackte es Muscheln.'},
 {id:'shonisaurus',n:'Shonisaurus',era:'trias',place:'Nordamerika',len:'15 m',lenM:15,food:'fleisch',grp:'reptil',eats:['tintenfisch','fisch'],deep:true,fact:'Ein Riesen-Fischsaurier – so lang wie ein Bus!'},
 {id:'liopleurodon',n:'Liopleurodon',era:'jura',place:'Europa',len:'7 m',lenM:7,food:'fleisch',grp:'reptil',eats:['fisch','tintenfisch'],fact:'Ein Meeresreptil mit kurzem Hals und riesigem Kopf voller Zähne.'},
 {id:'leedsichthys',n:'Leedsichthys',era:'jura',place:'Europa',len:'16 m',lenM:16,food:'pflanzen',grp:'fisch',eats:['plankton'],fact:'Einer der größten Fische aller Zeiten. Er fraß nur winziges Plankton – wie ein Walhai.'},
 {id:'kronosaurus',n:'Kronosaurus',era:'kreide',place:'Australien',len:'10 m',lenM:10,food:'fleisch',grp:'reptil',eats:['fisch','schildkroete','tintenfisch'],fact:'Sein Kopf war so lang wie ein Erwachsener groß ist.'},
 {id:'elasmosaurus',n:'Elasmosaurus',era:'kreide',place:'Nordamerika',len:'14 m',lenM:14,food:'fisch',grp:'reptil',eats:['fisch','tintenfisch'],fact:'Sein Hals war länger als sein ganzer restlicher Körper – mit über 70 Halswirbeln!'},
 {id:'tylosaurus',n:'Tylosaurus',era:'kreide',place:'Nordamerika',len:'13 m',lenM:13,food:'fleisch',grp:'reptil',eats:['fisch','schildkroete'],fact:'Ein Mosasaurier mit spitzer Schnauze. Damit rammte er vielleicht seine Beute.'},
 {id:'archelon',n:'Archelon',era:'kreide',place:'Nordamerika',len:'4 m',lenM:4,food:'alles',grp:'reptil',eats:['qualle','muschel'],fact:'Die größte Meeresschildkröte aller Zeiten – so groß wie ein kleines Auto.'},
 {id:'deinosuchus',n:'Deinosuchus',era:'kreide',place:'Nordamerika',len:'11 m',lenM:11,food:'fleisch',grp:'reptil',eats:['fisch','schildkroete'],fact:'Ein Riesenkrokodil! Es lauerte an Flussmündungen und im flachen Meer.'},
 {id:'dorudon',n:'Dorudon',era:'palaeogen',place:'Ägypten',len:'5 m',lenM:5,food:'fisch',grp:'saeuger',eats:['fisch'],fact:'Ein Urwal, so groß wie ein Delfin. Er hatte noch winzige Hinterbeine.'},
 {id:'livyatan',n:'Livyatan',era:'neogen',place:'Peru',len:'15 m',lenM:15,food:'fleisch',grp:'saeuger',eats:['wal','fisch'],deep:true,fact:'Ein Pottwal mit riesigen Zähnen – jeder so lang wie ein Unterarm.'},
];
SEA.forEach(a=>{a.art=a.art||a.id;a.sea=true;D.ANIMALS.push(a);D.byId[a.id]=a;});
// schon vorhandene Meerestiere markieren
const OLD={dunkleosteus:['fisch',['fisch','krebs']],eusthenopteron:['fisch',['fisch','krebs']],bothriolepis:['fisch',['plankton','wurm']],cladoselache:['fisch',['fisch','tintenfisch']],
  nothosaurus:['reptil',['fisch']],ichthyosaurus:['reptil',['tintenfisch','fisch']],plesiosaurus:['reptil',['fisch','tintenfisch']],mosasaurus:['reptil',['fisch','schildkroete','tintenfisch']],
  basilosaurus:['saeuger',['fisch','wal']],megalodon:['fisch',['wal','fisch']],ambulocetus:['saeuger',['fisch']]};
Object.entries(OLD).forEach(([id,[g,e]])=>{const a=D.byId[id];if(a){a.sea=true;a.grp=g;a.eats2=e;}});
SEA.forEach(a=>{a.eats2=a.eats;delete a.eats;});
D.SEA_IDS=D.ANIMALS.filter(a=>a.sea).map(a=>a.id);
D.SEA_GROUPS={fisch:{n:'Fisch',icon:'fisch',say:'Ein Fisch atmet mit Kiemen unter Wasser.'},reptil:{n:'Reptil',icon:'animal:plesiosaurus',say:'Ein Meeresreptil muss zum Atmen auftauchen – wie eine Schildkröte.'},
  saeuger:{n:'Säugetier',icon:'wal',say:'Ein Meeressäugetier atmet Luft und trinkt als Baby Milch – wie ein Wal.'},wirbellos:{n:'Ohne Knochen',icon:'animal:trilobit',say:'Tiere ohne Knochen im Inneren, wie Tintenfische und Krebse.'}};
D.SEA_FOODS=[{id:'fisch',n:'Fisch',icon:'fisch'},{id:'tintenfisch',n:'Tintenfisch',icon:'animal:ammonit'},{id:'muschel',n:'Muscheln',icon:'muschel'},{id:'qualle',n:'Qualle',icon:'qualle'},
  {id:'plankton',n:'Plankton',icon:'blase'},{id:'krebs',n:'Krebse',icon:'animal:trilobit'},{id:'wurm',n:'Würmer',icon:'seetang'},{id:'schildkroete',n:'Schildkröte',icon:'animal:archelon'},{id:'wal',n:'Wal',icon:'wal'},{id:'trilobit',n:'Trilobiten',icon:'animal:trilobit'}];
// Ammonit als Tier (für Riff & Museum)
const amm={id:'ammonit',n:'Ammonit',art:'ammonit',era:'jura',place:'überall auf der Welt',len:'20 cm',lenM:.2,food:'fleisch',grp:'wirbellos',sea:true,eats2:['plankton','krebs'],fact:'Ein Tintenfisch mit gedrehtem Schneckenhaus. Ammoniten gab es über 300 Millionen Jahre lang.'};
D.ANIMALS.push(amm);D.byId.ammonit=amm;D.SEA_IDS.push('ammonit');
const NOTDINO=['archelon','elasmosaurus','kronosaurus','liopleurodon','tylosaurus','shonisaurus','placodus','deinosuchus','ammonit'];
const isDino0=D.isDino; D.isDino=id=>isDino0(id)&&!NOTDINO.includes(id)&&!(D.byId[id]||{}).sea;

/* ---------------- Größen in Metern (für „Wie groß war er?“ usw.) ---------------- */
const M={trex:12,triceratops:9,velociraptor:2,brachiosaurus:22,stegosaurus:9,diplodocus:26,spinosaurus:15,ankylosaurus:8,pteranodon:6,parasaurolophus:10,giganotosaurus:12,
  carnotaurus:8,deinonychus:3,utahraptor:6,microraptor:.8,argentinosaurus:35,styracosaurus:5.5,protoceratops:2,pachyrhinosaurus:6,corythosaurus:9,edmontosaurus:12,iguanodon:10,
  pachycephalosaurus:4.5,gallimimus:6,therizinosaurus:10,quetzalcoatlus:11,mosasaurus:15,coelophysis:3,plateosaurus:8,eoraptor:1,herrerasaurus:5,allosaurus:9,brontosaurus:22,
  mamenchisaurus:26,archaeopteryx:.5,ceratosaurus:6,dilophosaurus:6,compsognathus:1,kentrosaurus:5,plesiosaurus:3.5,ichthyosaurus:2,nothosaurus:4,mammut:4,smilodon:2,
  megalodon:16,dunkleosteus:6,dimetrodon:3,titanoboa:13,basilosaurus:18,paraceratherium:8,arthropleura:2,meganeura:.7,wollnashorn:3.5,megaloceros:3,hoehlenbaer:3,gastornis:2,mesohippus:.6};
Object.entries(M).forEach(([id,m])=>{if(D.byId[id]&&D.byId[id].lenM==null)D.byId[id].lenM=m;});
D.lenM=id=>(D.byId[id]||{}).lenM;
/* Lebensraum: land | luft | wasser */
/* Tiere zwischen Wasser und Land: erster Eintrag = Hauptlebensraum, alle gelten als richtig (D.habitats) */
const HAB={tiktaalik:['wasser','land'],ichthyostega:['wasser','land'],hynerpeton:['wasser','land'],diplocaulus:['wasser','land'],proterogyrinus:['land','wasser'],
  ambulocetus:['wasser','land'],deinosuchus:['wasser','land'],nothosaurus:['wasser','land'],spinosaurus:['land','wasser']};
D.habitats=id=>HAB[id]?HAB[id].slice():[D.habitat(id)];
D.habitat=id=>{const a=D.byId[id];if(!a)return 'land';if(HAB[id])return HAB[id][0];if(a.sea)return 'wasser';const sp=ART.SPECIES[ART.resolve(a.art)]||{};
  if(sp.plan==='ptero'||sp.plan==='insect'||['archaeopteryx','microraptor','coelurosauravus'].includes(id))return 'luft';return 'land';};

/* ---------------- Sammelkarten (104 Karten aus dem Dinokarten-Ordner) ----------------
   [Name, Tier-ID in der App oder null, Zeitalter, Futter, Größe, Kindertext] – bei vorhandener ID
   werden Größe und Text aus den Tierdaten übernommen, wenn hier nichts steht. */
const C=[
 ['Albertosaurus',null,'kreide','fleisch','9 m','Ein Verwandter des T-Rex, aber schlanker und schneller. Vielleicht jagten mehrere zusammen.'],
 ['Amargasaurus',null,'kreide','pflanzen','10 m','Er hatte zwei Reihen langer Stacheln am Hals. Vielleicht war dazwischen Haut gespannt.'],
 ['Euoplocephalus',null,'kreide','pflanzen','6 m','Sogar seine Augenlider waren gepanzert! Am Schwanz trug er eine dicke Keule.'],
 ['Microraptor','microraptor'],['Parasaurolophus','parasaurolophus'],['Tyrannosaurus','trex'],
 ['Dracorex',null,'kreide','pflanzen','3 m','Sein Name heißt „Drachenkönig“. Sein Kopf war voller Hörnchen und Knubbel.'],
 ['Incisivosaurus',null,'kreide','pflanzen','1 m','Er hatte vorne große Nagezähne – fast wie ein Hase!'],
 ['Quetzalcoatlus','quetzalcoatlus'],['Archelon','archelon'],['Deinosuchus','deinosuchus'],
 ['Stygimoloch',null,'kreide','pflanzen','3 m','Ein Dickkopf-Dino mit langen Stacheln hinten am Kopf.'],
 ['Plesiosaurier','plesiosaurus'],['Ankylosaurus','ankylosaurus'],['Archaeopteryx','archaeopteryx'],['Spinosaurus','spinosaurus'],
 ['Animantarx',null,'kreide','pflanzen','3 m','Ein kleiner Panzer-Dino. Er wurde mit einem Messgerät entdeckt, weil seine Knochen ein bisschen strahlten.'],
 ['Aquilops',null,'kreide','pflanzen','60 cm','Ein Horn-Dino, nicht größer als ein Kaninchen – ein früher Verwandter des Triceratops.'],
 ['Carnotaurus','carnotaurus'],
 ['Concavenator',null,'kreide','fleisch','6 m','Er hatte einen spitzen Buckel auf dem Rücken, kurz vor dem Schwanz.'],
 ['Corythosaurus','corythosaurus'],
 ['Deinocheirus',null,'kreide','alles','11 m','Seine Arme waren über zwei Meter lang! Er fraß Pflanzen und auch Fische.'],
 ['Diabloceratops',null,'kreide','pflanzen','5,5 m','Zwei lange Hörner oben am Nackenschild – deshalb heißt er „Teufels-Horngesicht“.'],
 ['Triceratops','triceratops'],
 ['Troodon',null,'kreide','alles','2 m','Er hatte große Augen und ein großes Gehirn. Vielleicht war er in der Dämmerung unterwegs.'],
 ['Dreadnoughtus',null,'kreide','pflanzen','26 m','Ein riesiger Langhals. Sein Name heißt „Fürchtet nichts“.'],
 ['Edmontosaurus','edmontosaurus'],
 ['Maiasaura',null,'kreide','pflanzen','9 m','Ihr Name heißt „gute Mutter-Echse“. Sie kümmerte sich um ihre Babys im Nest.'],
 ['Dromaeosaurus',null,'kreide','fleisch','2 m','Ein flinker, gefiederter Jäger mit einer großen Kralle am Fuß.'],
 ['Kosmoceratops',null,'kreide','pflanzen','4,5 m','Er hatte 15 Hörner am Kopf – mehr als jeder andere Dino!'],
 ['Gallimimus','gallimimus'],
 ['Zuul',null,'kreide','pflanzen','6 m','Ein Panzer-Dino mit Stachelkeule. Man hat sogar Abdrücke seiner Haut gefunden.'],
 ['Pterodaustro',null,'kreide','fleisch','2,5 m Flügel','Ein Flugsaurier mit einem Schnabel wie ein Kamm. Damit siebte er kleine Krebse aus dem Wasser – wie ein Flamingo.'],
 ['Tsintaosaurus',null,'kreide','pflanzen','8 m','Ein Entenschnabel-Dino mit einem Kamm, der nach vorne zeigte – wie ein Einhorn.'],
 ['Gigantoraptor',null,'kreide','alles','8 m','Ein riesiger Vogel-Dino mit Schnabel und Federn, so schwer wie ein Nashorn.'],
 ['Torosaurus',null,'kreide','pflanzen','8 m','Er hatte einen der größten Köpfe aller Landtiere – mit riesigem Nackenschild.'],
 ['Pachycephalosaurus','pachycephalosaurus'],
 ['Sinornithosaurus',null,'kreide','fleisch','1 m','Ein kleiner gefiederter Dino. Seine Federn waren vielleicht rotbraun.'],
 ['Therizinosaurus','therizinosaurus'],
 ['Pegomastax',null,'jura','pflanzen','60 cm','Klein wie eine Katze, mit einem Papageienschnabel und Borsten am Körper.'],
 ['Proceratosaurus',null,'jura','fleisch','3 m','Ein früher Verwandter des T-Rex mit einem kleinen Kamm auf der Nase.'],
 ['Procompsognathus',null,'trias','fleisch','1 m','Ein kleiner, schneller Jäger aus Deutschland. Er fing Insekten und Echsen.'],
 ['Psittacosaurus',null,'kreide','pflanzen','2 m','„Papageien-Echse“! Er hatte einen Schnabel und Borsten am Schwanz.'],
 ['Utahraptor','utahraptor'],
 ['Ugrunaaluk',null,'kreide','pflanzen','9 m','Ein Entenschnabel-Dino aus Alaska. Dort war es im Winter lange dunkel.'],
 ['Suzhousaurus',null,'kreide','pflanzen','6 m','Ein Verwandter von Therizinosaurus, mit dickem Bauch und langen Krallen.'],
 ['Styracosaurus','styracosaurus'],
 ['Scansoriopteryx',null,'jura','insekten','20 cm','Ein winziger Dino, so klein wie ein Spatz. Er kletterte vielleicht auf Bäume.'],
 ['Rhinorex',null,'kreide','pflanzen','9 m','„Nasen-König“! Er hatte eine große, dicke Nase.'],
 ['Rugops',null,'kreide','fleisch','6 m','Sein Gesicht war ganz runzelig. Vielleicht fraß er oft Aas.'],
 ['Massospondylus',null,'jura','pflanzen','4 m','Man fand ein Nest mit seinen Eiern – und winzigen Babys darin.'],
 ['Nanotyrannus',null,'kreide','fleisch','5 m','Ein schlanker Tyrannosaurier. Forscher streiten noch: eigene Art oder junger T-Rex?'],
 ['Nanuqsaurus',null,'kreide','fleisch','6 m','„Eisbär-Echse“! Ein Verwandter des T-Rex aus dem hohen Norden.'],
 ['Oxalaia',null,'kreide','fisch','13 m','Ein Verwandter des Spinosaurus aus Brasilien. Er fing Fische mit seiner langen Schnauze.'],
 ['Ozraptor',null,'jura','fleisch','2 m','Ein kleiner Jäger aus Australien. Man kennt von ihm nur ein Stück Bein.'],
 ['Velociraptor','velociraptor'],
 ['Mapusaurus',null,'kreide','fleisch','11 m','Ein riesiger Jäger aus Argentinien. Man fand viele zusammen – vielleicht lebten sie in Gruppen.'],
 ['Iguanodon','iguanodon'],
 ['Hippodraco',null,'kreide','pflanzen','4,5 m','„Pferde-Drache“! Sein Kopf sah ein bisschen aus wie ein Pferdekopf.'],
 ['Gigantspinosaurus',null,'jura','pflanzen','4,5 m','Ein Stegosaurier mit riesigen Stacheln an den Schultern.'],
 ['Giganotosaurus','giganotosaurus'],
 ['Pelecanimimus',null,'kreide','alles','2 m','Er hatte über 200 winzige Zähne und vielleicht einen Kehlsack wie ein Pelikan.'],
 ['Deinonychus','deinonychus'],['Stegosaurus','stegosaurus'],
 ['Amygdalodon',null,'jura','pflanzen','12 m','Ein früher Langhals-Dino. Seine Zähne sahen aus wie Mandeln.'],
 ['Brachiosaurus','brachiosaurus'],
 ['Bellusaurus',null,'jura','pflanzen','5 m','Man fand 17 junge Bellusaurier zusammen. Es waren noch Kinder.'],
 ['Compsognathus','compsognathus'],['Dilophosaurus','dilophosaurus'],['Diplodocus','diplodocus'],['Kentrosaurus','kentrosaurus'],
 ['Europasaurus',null,'jura','pflanzen','6 m','Ein Zwerg-Langhals aus Deutschland! Er lebte auf einer kleinen Insel und blieb deshalb klein.'],
 ['Eustreptospondylus',null,'jura','fleisch','6 m','Ein Jäger aus England. Vielleicht schwamm er von Insel zu Insel.'],
 ['Yinlong',null,'jura','pflanzen','1,2 m','Einer der ältesten Horn-Dinos. Er lief auf zwei Beinen.'],
 ['Pterodactylus',null,'jura','fisch','1 m Flügel','Ein kleiner Flugsaurier aus Bayern. Er fing kleine Fische und Insekten.'],
 ['Meganeura','meganeura'],['Dimetrodon','dimetrodon'],['Eoraptor','eoraptor'],['Arthropleura','arthropleura'],['Pulmonoscorpius','pulmonoscorpius'],
 ['Mazothairos',null,'karbon','pflanzen','55 cm Flügel','Ein riesiges Urzeit-Insekt. Mit seinem Rüssel saugte es Pflanzensaft.'],
 ['Eryops',null,'perm','fleisch','2 m','Ein großer Urzeit-Lurch mit breitem Kopf. Er lauerte im Wasser auf Fische.'],
 ['Diplocaulus','diplocaulus'],['Ichthyostega','ichthyostega'],['Dunkleosteus','dunkleosteus'],['Edestus','edestus'],['Xenacanthus','xenacanthus'],
 ['Megalodon','megalodon'],['Livyatan','livyatan'],['Säbelzahnkatze','smilodon'],['Mammut','mammut'],
 ['Megacerops',null,'palaeogen','pflanzen','5 m','Ein riesiges Säugetier mit einem Y-förmigen Horn auf der Nase.'],
 ['Titanoboa','titanoboa'],
 ['Titanis',null,'neogen','fleisch','2,5 m hoch','Ein Schreckensvogel! Er konnte nicht fliegen, aber schnell laufen.'],
 ['Basilosaurus','basilosaurus'],['Dorudon','dorudon'],
 ['Proconsul',null,'neogen','pflanzen','1 m','Ein früher Verwandter von Affen und Menschen. Er hatte keinen Schwanz.'],
 ['Merychippus',null,'neogen','pflanzen','1 m hoch','Ein Urpferd mit drei Zehen, das schon gut rennen konnte.'],
 ['Hyaenodon','hyaenodon'],['Andrewsarchus','andrewsarchus'],
 ['Megatherium',null,'quartaer','pflanzen','6 m','Ein Riesenfaultier, so groß wie ein Elefant! Es konnte sich auf die Hinterbeine stellen.'],
 ['Paraceratherium','paraceratherium'],
 ['Glyptodon',null,'quartaer','pflanzen','3 m','Ein Riesengürteltier mit einem Panzer so groß wie ein kleines Auto.'],
 ['Gomphotherium',null,'neogen','pflanzen','3 m hoch','Ein Urelefant mit vier Stoßzähnen: zwei oben und zwei unten.'],
];
D.CARDS=C.map((c,i)=>{const a=c[1]?D.byId[c[1]]:null;return {no:i+1,n:c[0],id:c[1]||null,era:c[2]||(a&&a.era),food:c[3]||(a&&a.food),len:c[4]||(a&&a.len)||'',fact:c[5]||(a&&a.fact)||'',
  img:'assets/karten/karte'+String(i+1).padStart(3,'0')+'.jpg',sea:!!(a&&a.sea)};});

/* ---------------- Stationen (ersetzt die Baustellen) ----------------
   region: in welchem Gebiet der Karte · sea: nur mit dem Boot erreichbar */
const NEW=[
 // Dschungelinsel
 {id:'dschungel',n:'Dino-Dschungel',icon:'palme',col:'#9fc28a',say:'Der Dino-Dschungel! Hüpf mit dem kleinen Raptor über Äste und sammle Früchte.'},
 {id:'lager',n:'Forscher-Lager',icon:'zelt',col:'#d9c49a',say:'Das Forscher-Lager. Hier erzählen dir echte Dino-Forscherinnen und -Forscher, wie sie gearbeitet haben.'},
 {id:'kita',n:'Dino-Kindergarten',icon:'babydino',col:'#f0c3cf',say:'Der Dino-Kindergarten. Die Dino-Babys brauchen deine Hilfe!'},
 // Felseninsel
 {id:'klang',n:'Klanghöhle',icon:'lautsprecher',col:'#b9c7d6',say:'Die Klanghöhle. Hör genau hin: Wer macht dieses Geräusch?'},
 // Muschelinsel
 {id:'karten',n:'Kartenhaus',icon:'sticker',col:'#e9c98a',say:'Das Kartenhaus. Öffne Kartenpäckchen und sammle alle 104 Dino-Karten!'},
 {id:'kino',n:'Urzeit-Kino',icon:'film',col:'#c9b0d6',say:'Das Urzeit-Kino. Heute läuft der Film: Ein Tag im Leben des Spinosaurus.'},
 {id:'werkstatt',n:'Modell-Werkstatt',icon:'hammer',col:'#c9b59a',say:'Die Modell-Werkstatt. Bau dir deinen eigenen Dino, dreh ihn und mal ihn an!'},
 // Wüste (Osten)
 {id:'spuren',n:'Spurensuche',icon:'fussabdruck',col:'#e2c589',say:'Die Spurensuche. Oh! Jemand war hier! Folge der Spur.'},
 {id:'tracker',n:'Dino-Tracker',icon:'kompass',col:'#d9b36c',say:'Der Dino-Tracker. Finde heraus, wo sich der Dino versteckt!'},
 {id:'eier',n:'Dino-Eier',icon:'ei',col:'#efe0b8',say:'Das Eier-Nest. Welches Baby schlüpft aus welchem Ei?'},
 {id:'nest',n:'Nestbau',icon:'nest',col:'#c9a36d',say:'Beim Nestbau hilfst du einer Dino-Mama, ein sicheres Nest zu bauen.'},
 // Eisland (Nordosten)
 {id:'memory',n:'Dino-Memory',icon:'puzzle',col:'#cfe0ea',say:'Dino-Memory! Finde immer zwei gleiche Karten.'},
 {id:'grossklein',n:'Groß oder klein?',icon:'waage',col:'#dfeaf0',say:'Groß oder klein? Hilf mir, die Tiere zu sortieren!'},
 {id:'schatten',n:'Schatten-Dino',icon:'schatten',col:'#9fb0c2',say:'Der Schatten-Dino. Wessen Schatten ist das?'},
 {id:'kamera',n:'Forscherkamera',icon:'kamera',col:'#b9ccd6',say:'Die Forscherkamera. Mach ein schönes Foto von den Dinos für dein Album!'},
 // Vulkanland (Südosten)
 {id:'rennen',n:'Dino-Rennen',icon:'flagge',col:'#e7a17a',say:'Das Dino-Rennen! Welcher Dino ist am schnellsten?'},
 {id:'vulkan',n:'Vulkan-Expedition',icon:'vulkan',col:'#e08a64',say:'Die Vulkan-Expedition. Bring die Tiere sicher am Vulkan vorbei!'},
 {id:'endlos',n:'Endlose Welt',icon:'globus',col:'#c9b0a0',say:'Die endlose Welt. Lauf, flieg und schwimm, so weit du kannst!'},
 // Fossilienebene (Südwesten)
 {id:'wiegross',n:'Wie groß war er?',icon:'mensch',col:'#d7c29c',say:'Wie groß war der Dino? Vergleiche ihn mit einem Kind, einem Bus oder einem Haus!'},
 {id:'werbinich',n:'Welcher Dino bin ich?',icon:'lupe',col:'#b58cbd',say:'Welcher Dino bin ich? Hör gut zu und rate!'},
 {id:'bildquiz',n:'Dino-Bildquiz',icon:'kamera',col:'#9ec3d6',say:'Das Bildquiz. Ein Bild – welcher Dino ist das?'},
 {id:'lufwas',n:'Land, Luft, Wasser',icon:'luft',col:'#a9cfe0',say:'Land, Luft oder Wasser? Wo hat das Tier gelebt?'},
 // Expeditionsinsel (Süden)
 {id:'picknick',n:'Dino-Picknick',icon:'fruechte',col:'#f2c4a0',say:'Das Dino-Picknick! Deck den Tisch für hungrige Dinos.'},
 {id:'rettung',n:'Dino-Rettung',icon:'rettungsring',col:'#e6a08e',say:'Die Dino-Rettung. Ein Dino-Baby hat sich verlaufen – hilf ihm nach Hause!'},
 {id:'expedition',n:'Große Expedition',icon:'fernglas',col:'#bcae8a',say:'Die große Dino-Expedition! Eine Reise mit vielen Aufgaben.'},
 // Urzeit-Meer (nur mit dem Boot)
 {id:'riff',n:'Urzeit-Riff',icon:'koralle',col:'#f0a08a',sea:true,say:'Die Tauchstation am Urzeit-Riff. Tauch ab und entdecke die Tiere im Riff!'},
 {id:'schiff',n:'Forschungsschiff',icon:'schiff',col:'#8fbccb',sea:true,say:'Das Forschungsschiff. Fisch, Reptil oder Säugetier? Hilf beim Sortieren!'},
 {id:'tiefsee',n:'Leuchtende Tiefsee',icon:'taschenlampe',col:'#4f6f8a',sea:true,say:'Die Tiefsee ist dunkel. Mit der Taschenlampe findest du die Tiere!'},
 {id:'anning',n:'Mary-Anning-Klippe',icon:'klippe',col:'#c9b99a',sea:true,say:'Die Klippe von Mary Anning. Such am Strand nach Fossilien – so wie Mary vor 200 Jahren!'},
 {id:'meerfutter',n:'Meeres-Futter',icon:'fisch',col:'#9ccbb8',sea:true,say:'Meeres-Futter. Wer frisst was im Urzeit-Meer?'},
 {id:'tauchfahrt',n:'Tauchfahrt',icon:'taucher',col:'#6f97ad',sea:true,say:'Die Tauchfahrt! Schwimm als Fischsaurier durchs Meer.'},
 {id:'ammoniten',n:'Ammoniten-Riff',icon:'ammonit',col:'#e9c79a',sea:true,say:'Das Ammoniten-Riff. Zähle die Ammoniten und finde die Muster!'},
];
D.STATIONS=D.STATIONS.filter(s=>!s.soon).concat(NEW);
D.station=id=>D.STATIONS.find(s=>s.id===id);

/* Sticker für jede neue Station (beim ersten Mal) */
NEW.forEach(s=>{ if(!D.sticker(s.id)) D.STICKERS.push({id:s.id,n:s.n,icon:s.icon}); });
D.STICKERS.push({id:'kapitaen',n:'Kapitänin/Kapitän',icon:'anker'},{id:'entdecker',n:'Weltentdecker',icon:'kompass'},{id:'karten-10',n:'Kartensammler',icon:'sticker'},{id:'junior',n:'Junior-Paläontologe',icon:'lupe'});

/* Länge in Metern auch aus dem Text („9 m“, „1,5 m“) für alle Tiere ohne lenM */
D.ANIMALS.concat(D.EXTRA).forEach(a=>{ if(a.lenM!=null||!a.len) return; const m=/^([\d,]+)\s*(m|cm)$/.exec(a.len.trim()); if(m){ const v=parseFloat(m[1].replace(',','.')); a.lenM=m[2]==='cm'?v/100:v; } });
/* Stationen für Roten Faden und echte Welt */
D.STATIONS.push(
 {id:'zuhause',n:'Mein Forscherhaus',icon:'haus',col:'#e9c79a',say:'Dein Forscherhaus! Hier stellst du deine Funde, Fotos und Modelle aus.'},
 {id:'ausflug',n:'Forscher-Ausflug',icon:'rucksack',col:'#b5c48a',say:'Der Forscher-Ausflug. Hier gibt es Aufträge für draußen und für den Besuch im Museum.'});
['zuhause','ausflug'].forEach(id=>{const s=D.station(id); if(!D.sticker(id)) D.STICKERS.push({id,n:s.n,icon:s.icon});});
})();
