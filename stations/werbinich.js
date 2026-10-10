/* =====================================================================
   DINO-INSELWELT · GAME 15 „Welcher Dino bin ich?“
   Ein versteckter Dino gibt gesprochene Hinweise, einen nach dem anderen
   (Futter, Beine, Größe, Fundort, besonderes Merkmal). Das Kind darf jederzeit
   raten. Falsch → Karte wird blass, der nächste Hinweis kommt. Kein Game Over.
   Je weniger Hinweise gebraucht, desto mehr Sterne.
   Leicht: 3 sehr verschiedene Dinos, Silhouette von Anfang an (verschwommen).
   Mittel: 4 Dinos, Silhouette ab dem 3. Hinweis.
   Schwer: 4 ähnliche Dinos, 5 Hinweise, Silhouette erst ganz zum Schluss.
   ===================================================================== */
(function(){
"use strict";
const ID='werbinich';

/* ---------- Spieldaten: Merkmale ---------- */
const WB_FEAT={
  arms:{say:'Meine Arme waren winzig klein.',icon:'wb_arm'},
  bigteeth:{say:'Ich hatte einen riesigen Kopf mit großen, spitzen Zähnen.',icon:'zahn'},
  eyehorns:{say:'Über meinen Augen hatte ich kleine Hörnchen.',icon:'wb_horn'},
  bullhorns:{say:'Ich hatte zwei Hörner über den Augen, wie ein Stier.',icon:'wb_horn'},
  sail:{say:'Auf meinem Rücken trug ich ein großes Segel.',icon:'wb_sail'},
  swim:{say:'Ich war oft im Wasser und fing dort Fische.',icon:'welle'},
  twocrests:{say:'Auf meinem Kopf hatte ich zwei dünne Kämme.',icon:'wb_crest'},
  nosehorn:{say:'Ich hatte ein Horn auf der Nase.',icon:'wb_horn'},
  slim:{say:'Ich war schlank und flink, mit langem Hals und langem Schwanz.',icon:'lauf'},
  feathers:{say:'Ich hatte Federn!',icon:'feder'},
  sickle:{say:'An jedem Fuß hatte ich eine große, gebogene Sichelkralle.',icon:'wb_claw'},
  fourwings:{say:'Ich hatte Federn an Armen und Beinen, wie vier Flügel.',icon:'feder'},
  ostrich:{say:'Ich sah aus wie ein Strauß und konnte sehr schnell rennen.',icon:'lauf'},
  bigclaws:{say:'Ich hatte riesige Krallen an den Händen, so lang wie ein Arm.',icon:'wb_claw'},
  longneck:{say:'Ich hatte einen sehr langen Hals.',icon:'wb_neck'},
  highfront:{say:'Meine Vorderbeine waren länger als meine Hinterbeine. So kam ich hoch hinauf.',icon:'wb_neck'},
  whiptail:{say:'Mein Schwanz war lang und dünn wie eine Peitsche.',icon:'wb_neck'},
  thickneck:{say:'Mein langer Hals war besonders dick und kräftig.',icon:'wb_neck'},
  heaviest:{say:'Ich war einer der schwersten Dinosaurier überhaupt, so schwer wie zehn Elefanten.',icon:'waage'},
  superneck:{say:'Mein Hals war so lang wie der halbe Körper.',icon:'wb_neck'},
  early:{say:'Ich war einer der allerersten Dinosaurier.',icon:'stern'},
  earlyneck:{say:'Ich hatte schon einen langen Hals, lief aber auf zwei Beinen.',icon:'wb_neck'},
  threehorns:{say:'Ich hatte drei Hörner im Gesicht.',icon:'wb_horn'},
  frill:{say:'Hinten am Kopf hatte ich einen großen Nackenschild.',icon:'wb_frill'},
  spikyfrill:{say:'Mein Nackenschild hatte lange Stacheln, wie eine Krone.',icon:'wb_frill'},
  nohorn:{say:'Ich hatte einen Nackenschild, aber keine großen Hörner.',icon:'wb_frill'},
  nosebump:{say:'Statt eines Horns hatte ich einen dicken Knubbel auf der Nase.',icon:'wb_frill'},
  plates:{say:'Auf meinem Rücken hatte ich große, spitze Platten.',icon:'wb_plates'},
  tailspikes:{say:'Am Schwanz hatte ich vier spitze Stacheln.',icon:'wb_plates'},
  spikes:{say:'Ich hatte ganz viele lange, spitze Stacheln auf dem Rücken und am Schwanz.',icon:'wb_plates'},
  club:{say:'Am Ende meines Schwanzes hatte ich eine dicke Keule.',icon:'wb_club'},
  armor:{say:'Mein Körper war mit Knochenplatten gepanzert, wie eine Rüstung.',icon:'wb_club'},
  tubecrest:{say:'Auf dem Kopf hatte ich einen langen, hohlen Kamm. Damit konnte ich tröten.',icon:'wb_crest'},
  helmetcrest:{say:'Mein Kopfkamm sah aus wie ein halber Teller.',icon:'wb_crest'},
  duckbill:{say:'Ich hatte einen breiten Schnabel wie eine Ente.',icon:'wb_crest'},
  thumbspike:{say:'An meinem Daumen hatte ich einen spitzen Dorn.',icon:'wb_claw'},
  dome:{say:'Mein Kopf war oben ganz dick und rund, wie ein Helm aus Knochen.',icon:'wb_dome'},
  wings:{say:'Ich hatte Federn und Flügel wie ein Vogel, aber auch Zähne.',icon:'feder'},
};
// legs: 2 | 4 | 24 (zwei oder vier)
const WB={trex:[2,['bigteeth','arms']],allosaurus:[2,['eyehorns']],carnotaurus:[2,['bullhorns','arms']],giganotosaurus:[2,['bigteeth']],
  spinosaurus:[2,['sail','swim']],dilophosaurus:[2,['twocrests']],ceratosaurus:[2,['nosehorn']],coelophysis:[2,['slim']],
  velociraptor:[2,['sickle','feathers']],deinonychus:[2,['sickle','feathers']],utahraptor:[2,['sickle','feathers']],microraptor:[2,['fourwings']],
  compsognathus:[2,['slim']],gallimimus:[2,['ostrich']],therizinosaurus:[2,['bigclaws','feathers']],archaeopteryx:[2,['wings']],eoraptor:[2,['early']],
  brachiosaurus:[4,['highfront','longneck']],diplodocus:[4,['whiptail','longneck']],brontosaurus:[4,['thickneck','longneck']],argentinosaurus:[4,['heaviest','longneck']],
  mamenchisaurus:[4,['superneck','longneck']],plateosaurus:[2,['earlyneck']],
  triceratops:[4,['threehorns','frill']],styracosaurus:[4,['spikyfrill','nosehorn']],protoceratops:[4,['nohorn','frill']],pachyrhinosaurus:[4,['nosebump','frill']],
  stegosaurus:[4,['plates','tailspikes']],kentrosaurus:[4,['spikes']],ankylosaurus:[4,['club','armor']],
  parasaurolophus:[24,['tubecrest']],corythosaurus:[24,['helmetcrest']],edmontosaurus:[24,['duckbill']],iguanodon:[24,['thumbspike']],pachycephalosaurus:[2,['dome']],
  herrerasaurus:[2,['earlyhunter']],struthiomimus:[2,['ostrich']],
  /* andere Urzeittiere (keine Dinosaurier): Beine 'fl' = Flossen, 'wing' = Flügel */
  mammut:[4,['trunk','fur']],smilodon:[4,['sabre','fur']],wollnashorn:[4,['twohorns']],megaloceros:[4,['antlers']],dimetrodon:[4,['sailnodino']],
  pteranodon:['wing',['crestwing','notdino']],quetzalcoatlus:['wing',['giantflyer','notdino']],meganeura:['wing',['dragonfly']],
  plesiosaurus:['fl',['longneckswim','notdino']],elasmosaurus:['fl',['superlongneckswim','notdino']],ichthyosaurus:['fl',['dolphin']],
  mosasaurus:['fl',['seagiant','notdino']],megalodon:['fl',['shark']],archelon:['fl',['shell']],deinosuchus:[4,['croc']]};
// zusätzliche Hinweise (Mittel/Schwer): Zeitalter, Gewicht – so klingen die Rätsel bei jeder Runde etwas anders
Object.assign(WB_FEAT,{
  trunk:{say:'Ich hatte einen langen Rüssel und riesige, gebogene Stoßzähne.',icon:'zahn'},
  fur:{say:'Ich hatte ein dickes, zotteliges Fell gegen die Kälte.',icon:'schneeflocke'},
  sabre:{say:'Ich hatte zwei riesige Eckzähne, lang wie Säbel.',icon:'zahn'},
  twohorns:{say:'Ich hatte zwei Hörner auf der Nase und ein dickes Fell.',icon:'wb_horn'},
  antlers:{say:'Ich hatte ein riesiges Geweih – über drei Meter breit!',icon:'zweig'},
  sailnodino:{say:'Auf meinem Rücken trug ich ein Segel. Ich lebte schon vor den Dinosauriern!',icon:'wb_sail'},
  crestwing:{say:'Ich hatte einen langen Knochenkamm hinten am Kopf und einen Schnabel ohne Zähne.',icon:'wb_crest'},
  giantflyer:{say:'Ich war eines der größten fliegenden Tiere aller Zeiten. Am Boden war ich so groß wie eine Giraffe.',icon:'luft'},
  dragonfly:{say:'Ich war eine riesige Libelle, so groß wie eine Taube.',icon:'luft'},
  notdino:{say:'Ich sehe ein bisschen aus wie ein Dino, aber ich bin kein Dinosaurier!',icon:'wb_q'},
  longneckswim:{say:'Ich hatte einen langen Hals und vier große Flossen wie Paddel.',icon:'wb_neck'},
  superlongneckswim:{say:'Mein Hals war länger als mein ganzer Körper. Ich paddelte mit vier Flossen.',icon:'wb_neck'},
  dolphin:{say:'Ich sah aus wie ein Delfin, war aber ein Reptil.',icon:'welle'},
  seagiant:{say:'Ich war ein riesiges Meeresreptil mit einer Schwanzflosse und einem Kopf voller Zähne.',icon:'zahn'},
  shark:{say:'Ich war ein riesiger Hai. Meine Zähne waren so groß wie eine Hand.',icon:'hai'},
  shell:{say:'Ich hatte einen großen Panzer und paddelte mit Flossen durchs Meer.',icon:'welle'},
  croc:{say:'Ich war ein riesiges Krokodil und lauerte im Wasser.',icon:'zahn'},
});
WB_FEAT.earlyhunter={say:'Ich war einer der ersten großen Jäger unter den Dinosauriern.',icon:'zahn'};
const WB_ERA={trias:['Ich lebte in der Trias, ganz am Anfang der Dinozeit.','animal:coelophysis'],jura:['Ich lebte im Jura, zur Zeit der riesigen Langhälse.','animal:brachiosaurus'],
  kreide:['Ich lebte in der Kreidezeit, als die ersten Blumen blühten.','blume'],
  karbon:['Ich lebte im Karbon, lange vor den Dinosauriern.','farn'],perm:['Ich lebte im Perm, noch vor den Dinosauriern.','vulkan'],
  palaeogen:['Ich lebte nach den Dinosauriern, als die Säugetiere groß wurden.','animal:mesohippus'],neogen:['Ich lebte lange nach den Dinosauriern.','animal:mesohippus'],
  quartaer:['Ich lebte in der Eiszeit, lange nach den Dinosauriern.','schneeflocke']};
function weightClue(kg){ if(!kg) return null;
  if(kg<=5) return ['Ich war ganz leicht, nicht schwerer als eine Katze.','animal:katze'];
  if(kg<=50) return ['Ich war ungefähr so schwer wie ein Kind.','kind'];
  if(kg<=800) return ['Ich war ungefähr so schwer wie ein Pferd.','animal:pferd'];
  if(kg<=9000) return ['Ich war ungefähr so schwer wie ein Elefant.','animal:elefant'];
  return ['Ich war schwerer als mehrere Elefanten zusammen!','animal:elefant']; }
// Verwechslungsgruppen: diese Tiere teilen ihr Hauptmerkmal (z. B. alle Entenschnabel-Dinos haben einen Entenschnabel,
// alle Dromaeosaurier eine Sichelkralle) – nie gemeinsam in einer Runde, damit der letzte Hinweis eindeutig ist.
const WB_SIM=[['trex','giganotosaurus','allosaurus'],['allosaurus','ceratosaurus','carnotaurus'],['velociraptor','deinonychus','utahraptor','microraptor'],
  ['archaeopteryx','microraptor'],['compsognathus','coelophysis'],['gallimimus','struthiomimus'],['eoraptor','herrerasaurus','coelophysis'],
  ['edmontosaurus','parasaurolophus','corythosaurus'],['protoceratops','pachyrhinosaurus'],['triceratops','styracosaurus'],['diplodocus','brontosaurus'],
  ['stegosaurus','kentrosaurus'],['spinosaurus','dimetrodon'],['plesiosaurus','elasmosaurus'],['ichthyosaurus','mosasaurus'],['pteranodon','quetzalcoatlus'],
  ['mammut','wollnashorn']];
const wbSim=(a,b)=>WB_SIM.some(g=>g.includes(a)&&g.includes(b));
const EASY=['trex','triceratops','stegosaurus','brachiosaurus','velociraptor','ankylosaurus','spinosaurus','parasaurolophus','diplodocus','pachycephalosaurus',
  'gallimimus','therizinosaurus','styracosaurus','dilophosaurus','archaeopteryx','carnotaurus','corythosaurus','mamenchisaurus','kentrosaurus','microraptor',
  'mammut','smilodon','pteranodon','plesiosaurus','megalodon'];
const LV={1:{ch:3,clues:3,sil:0},2:{ch:4,clues:4,sil:2},3:{ch:4,clues:5,sil:4}};
const ROUNDS=4;
const INK='#3d3226';
Object.assign(ART.ICONS,{
  wb_horn:`<path d="M14 56Q18 30 46 8Q38 34 34 58Z" fill="#f3ead6" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M22 44q8-2 14 2M26 32q7-1 11 3" stroke="#c9b88f" stroke-width="2" fill="none"/>`,
  wb_neck:`<path d="M8 50q4-16 22-16q8 0 12-12q4-12 12-12q6 0 4 4l-6 2q-4 10-8 22q-2 8-2 12z" fill="#8fa3a9" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M16 48v10M34 48v10" stroke="#687f86" stroke-width="6" stroke-linecap="round"/>`,
  wb_sail:`<path d="M8 50Q32 0 58 50z" fill="#d98b5f" stroke="${INK}" stroke-width="2.2"/><path d="M20 50L24 26M32 50V14M44 50L40 26" stroke="#8a4a2a" stroke-width="2"/><path d="M4 52h56" stroke="#6f8f8a" stroke-width="6" stroke-linecap="round"/>`,
  wb_plates:`<path d="M4 50q28-14 56 0" stroke="#8ea06a" stroke-width="10" fill="none" stroke-linecap="round"/>${[[12,38],[24,30],[36,28],[48,32]].map(([x,y])=>`<path d="M${x-7} ${y+10}L${x} ${y-12}L${x+7} ${y+10}z" fill="#d98f5c" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`).join('')}`,
  wb_club:`<path d="M4 38q24-6 40-2" stroke="#8c7457" stroke-width="9" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="36" rx="11" ry="9" fill="#b39468" stroke="${INK}" stroke-width="2"/><path d="M10 34l3-6 3 6M22 32l3-6 3 6M34 31l3-6 3 6" fill="#b39468" stroke="${INK}" stroke-width="1.4"/>`,
  wb_crest:`<path d="M14 52q0-18 16-18h14q10 0 12 8l-12 4H30q-6 0-8 6z" fill="#7f9f8a" stroke="${INK}" stroke-width="2"/><path d="M28 36Q20 16 6 6q2-2 6 0q16 10 22 28z" fill="#c7704f" stroke="${INK}" stroke-width="2"/><circle cx="36" cy="40" r="2.5" fill="${INK}"/>`,
  wb_dome:`<path d="M10 50q0-34 26-34q20 0 20 22q0 8-8 12z" fill="#a9865c" stroke="${INK}" stroke-width="2.2"/><path d="M14 30q10-16 30-12" stroke="#e8d0a8" stroke-width="3" fill="none"/><circle cx="40" cy="40" r="2.6" fill="${INK}"/>`,
  wb_claw:`<path d="M10 20Q46 14 50 54Q40 34 14 30z" fill="#efe6d2" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`,
  wb_arm:`<path d="M6 30q20-14 40-6l10 10" stroke="#9a7a52" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M40 34q4 8 2 12M44 32q6 6 6 10" stroke="#9a7a52" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  wb_legs2:`<path d="M4 20q14 2 22 8q8-8 18-10q6-6 12-4q6 2 4 6l-8 2q-2 8-10 12q-10 4-18 0q-10-6-20-14z" fill="#b3884f" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M28 36l-2 12l-4 8h8M38 36l2 12l-2 8h8" stroke="#8a653a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  wb_legs4:`<path d="M4 22q10 0 16 4q10-8 24-6q8 0 10-4q6 0 6 4q0 6-6 8q-2 8-12 10H20q-8-4-16-16z" fill="#8ea06a" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M20 38v16M28 38v16M40 38v16M48 36v18" stroke="#657846" stroke-width="6" stroke-linecap="round"/>`,
  wb_legs24:`<path d="M4 18q14 2 20 8q10-8 22-6q6-4 10-2q6 2 4 6l-6 2q-2 8-10 12H22q-10-6-18-20z" fill="#7f9f8a" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M26 38l-2 18M36 38l2 18" stroke="#577564" stroke-width="6" stroke-linecap="round"/><path d="M46 36l2 12" stroke="#577564" stroke-width="4" stroke-linecap="round" stroke-dasharray="3 3"/>`,
  wb_frill:`<path d="M12 50Q8 14 40 10Q30 30 30 50z" fill="#d7a262" stroke="${INK}" stroke-width="2"/><path d="M28 36q10-6 22 0q6 4 4 10H28z" fill="#a97b5f" stroke="${INK}" stroke-width="2"/>`,
  wb_q:`<circle cx="32" cy="32" r="24" fill="#b58cbd" opacity=".35"/><path d="M24 24q0-10 9-10t9 9q0 6-7 9q-3 2-3 7" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="32" cy="48" r="3.4" fill="${INK}"/>`,
});
const FOOD={pflanzen:['Ich habe Pflanzen gefressen.','farn'],fleisch:['Ich habe Fleisch gefressen. Ich war ein Jäger.','fleisch'],fisch:['Ich habe am liebsten Fische gefangen.','fisch'],
  alles:['Ich habe Pflanzen und kleine Tiere gefressen.','fruechte'],insekten:['Ich habe Insekten und kleine Tiere gefressen.','insekten']};
function sizeClue(m){
  if(m<=1.2) return ['Ich war ganz klein, nicht größer als ein Huhn.','animal:huhn'];
  if(m<=3.5) return ['Ich war ungefähr so lang wie ein Sofa, also etwas länger als ein Erwachsener groß ist.','mensch'];
  if(m<=7) return ['Ich war ungefähr so lang wie ein Auto oder etwas länger.','auto'];
  if(m<=10.5) return ['Ich war groß: fast so lang wie ein Bus.','bus'];
  if(m<=18) return ['Ich war riesig: so lang wie ein Bus oder noch länger!','bus'];
  return ['Ich war gigantisch: länger als zwei Busse!','bus'];
}
function legClue(l){ if(l==='fl') return ['Ich hatte keine Beine, sondern Flossen zum Schwimmen.','welle'];
  if(l==='wing') return ['Ich hatte große Flügel und konnte fliegen.','luft'];
  return l===2?['Ich bin auf zwei Beinen gelaufen.','wb_legs2']:l===4?['Ich bin auf vier Beinen gelaufen.','wb_legs4']:['Ich konnte auf zwei und auf vier Beinen laufen.','wb_legs24']; }
const place=a=>a.place?['Man hat meine Knochen in '+a.place.replace(/^in /,'')+' gefunden.','globus']:null;
function planOf(id){ const sp=ART.SPECIES[ART.resolve(DATA.animal(id).art)]||{}; return sp.plan; }

let root,lv=1,S=null;
const nm=id=>DATA.nameOf(id);
function mount(r){root=r;intro();}
function intro(){
  GK.intro(root,{id:ID,art:`<div class="ga-art"><img class="wb-sil0" src="${DW.animalImg('stegosaurus').match(/src="([^"]+)"/)[1]}" alt="">${GK.icon('wb_q')}</div>`,title:'Welcher Dino bin ich?',
    say:'Ich bin ein versteckter Dino! Hör gut zu. Ich gebe dir Hinweise, einen nach dem anderen. Weißt du, wer ich bin?',onStart:l=>{lv=l;S={r:0,pts:0,used:[]};round();}});
  DW.say('Manchmal verstecke ich mich auch als anderes Urzeittier.',{queue:true});
}
function pickRound(){
  const cfg=LV[lv]; const pool=Object.keys(WB).filter(id=>DATA.animal(id)&&ART.has(DATA.animal(id).art)&&(lv>1||EASY.includes(id)));
  const target=DW.pick(pool.filter(id=>!S.used.includes(id))); S.used.push(target);
  const tf=WB[target][1][0], tp=planOf(target);
  // Ablenker: anderes Hauptmerkmal; Leicht: anderer Bauplan; Schwer: gleicher Bauplan bevorzugt
  let cand=DW.shuffle(pool.filter(id=>id!==target&&!wbSim(id,target)&&!WB[id][1].includes(tf)&&!WB[target][1].includes(WB[id][1][0])));
  let pick=[];
  if(lv===1){ const plans=new Set([tp]); cand.forEach(id=>{ const p=planOf(id); if(pick.length<cfg.ch-1&&!plans.has(p)){plans.add(p);pick.push(id);} }); }
  else if(lv===3){ cand.filter(id=>planOf(id)===tp).forEach(id=>{ if(pick.length<cfg.ch-1) pick.push(id); }); }
  cand.forEach(id=>{ if(pick.length<cfg.ch-1&&!pick.includes(id)) pick.push(id); });
  return {target,choices:DW.shuffle([target].concat(pick))};
}
function cluesFor(id){
  const a=DATA.animal(id), [legs,feats]=WB[id], cfg=LV[lv];
  const food=FOOD[a.food]||FOOD.pflanzen, size=legs==='wing'?null:sizeClue(DATA.lenM(id)||3);
  let generic=[food,legClue(legs),size].filter(Boolean); const pl=place(a); if(pl&&lv===3) generic.push(pl);
  if(lv>1){ const extra=[WB_ERA[a.era],weightClue(a.kg)].filter(Boolean); if(extra.length) generic.push(DW.pick(extra)); }
  generic=DW.shuffle(generic);
  const featC=feats.map(k=>[WB_FEAT[k].say,WB_FEAT[k].icon]);
  // Hinweise: allgemeine zuerst, das wichtigste Merkmal zuletzt
  const n=cfg.clues; const extra=featC.slice(1);
  let list=generic.slice(0,Math.max(1,n-1-Math.min(extra.length,lv===3?1:0)));
  if(lv===3&&extra.length) list.push(extra[0]);
  list=list.slice(0,n-1); list.push(featC[0]);
  return list;
}
function round(){
  if(S.r>=ROUNDS) return end();
  const {target,choices}=pickRound(), clues=cluesFor(target), cfg=LV[lv];
  S.cur={target,choices,clues,k:0,wrong:0,done:false,pend:0};
  const src=DW.animalImg(target).match(/src="([^"]+)"/)[1], dino=DATA.isDino(target);
  DW.setStationTitle&&DW.setStationTitle(dino?'Welcher Dino bin ich?':'Welches Urzeittier bin ich?');
  root.innerHTML=`<div class="wb fill"><div class="wb-top">${GK.progress(S.r,ROUNDS)}</div>
    <div class="wb-stage"><div class="wb-mys"><div class="wb-spot"></div><img class="wb-sil" id="wbSil" src="${src}" alt="${dino?'Versteckter Dino':'Verstecktes Urzeittier'}"><div class="wb-cover" id="wbCover">${GK.icon('wb_q')}</div></div>
      <div class="wb-clues" id="wbClues">${clues.map((c,i)=>`<button class="wb-clue" data-i="${i}" aria-label="Hinweis ${i+1}"><span class="wb-n">${i+1}</span>${GK.icon(c[1])}</button>`).join('')}
      <button class="wb-more" id="wbMore" aria-label="Noch ein Hinweis">${GK.icon('lupe')}<b>+</b></button></div></div>
    <div class="gk-choices wb-ch">${choices.map(id=>`<button class="gk-choice" data-id="${id}">${GK.img(id)}<b>${nm(id)}</b></button>`).join('')}</div></div>`;
  DW.$$('.wb-clue',root).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; if(i<S.cur.k){ DW.sfx('tap'); DW.say(S.cur.clues[i][0]); GK.pulse(b); } });
  const t0=performance.now(), fresh=()=>performance.now()-t0<450;   // Doppeltipp auf „Weiter“: zählt in der neuen Runde nicht
  root.querySelector('#wbMore').onclick=()=>{ if(fresh()) return; DW.sfx('pop'); nextClue(); };
  DW.$$('.wb-ch .gk-choice',root).forEach(b=>b.onclick=()=>{ if(fresh()) return; guess(b); });
  updateSil();
  const hello=S.r===0?'Hör gut zu! Hier kommt der erste Hinweis. ':DW.pick(['Neues Rätsel! ','Wer versteckt sich jetzt? ']);
  if(dino) GK.after(300,()=>nextClue(hello));
  else GK.after(300,()=>{ DW.say('Welches Urzeittier bin ich?'); nextClue(hello,true); });
  GK.idle.set(()=>GK.pulse(root.querySelector('#wbMore')),()=>DW.say(dino?'Tippe auf einen Dino, wenn du es weißt. Oder auf die Lupe für noch einen Hinweis.':'Tippe auf ein Tier, wenn du es weißt. Oder auf die Lupe für noch einen Hinweis.'));
  if(window.DW_DEBUG) window.__werbinich={S,answer:()=>S.cur&&S.cur.target,clue:()=>nextClue()};
}
function updateSil(){
  const c=S.cur, cfg=LV[lv], sil=root.querySelector('#wbSil'), cov=root.querySelector('#wbCover');
  if(c.done){ sil.style.filter='none'; sil.style.opacity=1; sil.classList.add('show'); cov.classList.add('gone'); return; }
  const visible=c.k>=cfg.sil;
  cov.classList.toggle('gone',visible);
  const blur=Math.max(0,(lv===1?9:7)-(c.k-cfg.sil)*3);
  sil.style.filter=`brightness(0) opacity(.75) blur(${blur}px)`; sil.style.opacity=visible?1:0;
}
function nextClue(prefix,queue){
  const c=S.cur; if(!c||c.done) return;
  if(c.k>=c.clues.length){ DW.say('Das waren alle Hinweise. Schau dir den Schatten genau an! '+c.clues[c.clues.length-1][0]); const cl=DW.$$('.wb-clue',root); GK.pulse(cl[cl.length-1]); return; }
  const b=root.querySelector(`.wb-clue[data-i="${c.k}"]`); b.classList.add('on'); DW.sfx('magic');
  DW.say((prefix||'')+c.clues[c.k][0],queue?{queue:true}:undefined); c.k++; updateSil();
  if(c.k>=c.clues.length) root.querySelector('#wbMore').classList.add('out');
}
function guess(b){
  const c=S.cur; if(!c||c.done||b.classList.contains('out')) return;
  const id=b.dataset.id;
  if(id===c.target){
    c.done=true; GK.ok(b); DW.sfx('win'); updateSil(); root.querySelector('.wb-mys').classList.add('win');
    DW.$$('.wb-ch .gk-choice',root).forEach(x=>{ if(x!==b) x.classList.add('out'); });
    const used=Math.max(1,c.k), pts=used<=(lv===3?3:2)?3:used<=(lv===3?4:3)?2:1; S.pts+=pts; DW.discover(id,true);
    DW.say(`Richtig! Ich bin ${nm(id)}. ${(DATA.animal(id)||{}).fact||''}`);
    root.querySelector('.wb-top').innerHTML=GK.progress(S.r+1,ROUNDS)+`<span class="wb-pts">${DW.starRow(pts)}</span>`;
    const nb=DW.h(`<button class="btn big go wb-next">${ART.icon('pfeil_r',36)}Weiter</button>`); root.querySelector('.wb-clues').replaceWith(nb);
    nb.onclick=()=>{ DW.sfx('tap'); S.r++; round(); };
    GK.idle.set(()=>GK.pulse(nb),null);
    if(window.DW_DEBUG) window.__werbinich={S,answer:()=>null,next:()=>nb.click()};
    return;
  }
  if(b.dataset.tried) return; b.dataset.tried='1';
  c.wrong++; GK.no(b); GK.after(400,()=>b.classList.add('out'));
  const pend=++c.pend;
  DW.say(`Hm, ${nm(id)} bin ich nicht.`).then(()=>{ if(S&&S.cur===c&&!c.done&&c.pend===pend) nextClue('Noch ein Hinweis: '); });
}
function end(){
  const stars=DW.clamp(Math.round(S.pts/ROUNDS),1,3);
  GK.finish(root,{id:ID,stars,art:`<div class="ga-art">${S.used.slice(-3).map(id=>GK.img(id,{mood:'happy'})).join('')}</div>`,
    say:S.used.every(id=>DATA.isDino(id))?(stars===3?'Wow! Du hast alle Dinos ganz schnell erraten. Du bist ein echter Dino-Detektiv!':'Super geraten! Du bist ein Dino-Detektiv!')
      :(stars===3?'Wow! Du hast alle Urzeittiere ganz schnell erraten. Du bist ein echter Urzeit-Detektiv!':'Super geraten! Du bist ein Urzeit-Detektiv!'),again:()=>{S={r:0,pts:0,used:[]};round();}});
}
DW.stations[ID]={title:(DATA.station(ID)||{}).n||'Welcher Dino bin ich?',mount,unmount(){S=null;delete window.__werbinich;}};
})();
