/* =====================================================================
   DINO-INSELWELT · quest.js — Roter Faden: Pips Aufträge & Pip wächst mit
   Jeden Tag drei kleine Bild-Aufträge (einer immer leicht und in der Nähe,
   einer mittel, einer lockt in ein fernes Land). Fortschritt über Ereignisse.
   Kein Druck: keine Serien, kein „verpasst“ – neue Aufträge kommen einfach.
   Erledigte Aufträge lassen Pip wachsen (Halstuch, Rucksack, Hut, Lupe) und
   bringen Stempel ins Auftragsbuch; alle drei = Geschenk fürs Forscherhaus.
   Spielstand: DW.state.quest
   ===================================================================== */
(function(){
"use strict";
const Q=window.QUEST={};

/* ---------- eigene Symbole (64×64) ---------- */
const INK='#3d3226';
Object.assign(ART.ICONS,{
  q_rolle:`<path d="M14 14q0-6 6-6h30q6 0 6 6v4H20v32q0 6-6 6t-6-6V20q0-6 6-6z" fill="#e9d2a4" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><path d="M20 18h36v30q0 8-8 8H14q6 0 6-6z" fill="#f6ead0" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><path d="M27 28h20M27 35h20M27 42h13" stroke="#b59b72" stroke-width="2.4" stroke-linecap="round"/><circle cx="46" cy="47" r="7" fill="#c8553d" stroke="${INK}" stroke-width="1.4"/><path d="M43 47l2 2 4-4" stroke="#fbe9d6" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  q_pflanze:`<path d="M20 40h24l-4 18H24z" fill="#c8764a" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><path d="M18 38h28v5H18z" fill="#b8653c" stroke="${INK}" stroke-width="1.4"/><path d="M32 38q-2-14-14-20 4 12 14 20zM32 38q2-18 16-24-4 16-16 24zM32 38q0-12 0-26" fill="#7fa66a" stroke="#4f7a45" stroke-width="1.4"/><path d="M32 38q-8-6-18-4 8 6 18 4z" fill="#8fbf7a" stroke="#4f7a45" stroke-width="1.2"/>`,
  q_lampe:`<path d="M30 20h4v28h-4z" fill="#8a6d4a"/><path d="M20 58h24l-3-8H23z" fill="#8a6d4a" stroke="${INK}" stroke-width="1.4"/><path d="M18 24L24 6h16l6 18z" fill="#f0c35a" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><path d="M22 24h20" stroke="#fff3c4" stroke-width="3"/>`,
  q_truhe:`<path d="M6 30h52v24q0 4-4 4H10q-4 0-4-4z" fill="#a8724a" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 30q0-16 26-16t26 16z" fill="#c08a58" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 36h52M16 22v34M48 22v34" stroke="#6e4a30" stroke-width="3"/><rect x="27" y="32" width="10" height="10" rx="2" fill="#e9c46a" stroke="${INK}" stroke-width="1.4"/>`,
  q_stempel:`<circle cx="32" cy="32" r="24" fill="#fbe9e4" stroke="#c8553d" stroke-width="3.5" stroke-dasharray="5 3"/><circle cx="32" cy="32" r="16" fill="none" stroke="#c8553d" stroke-width="2"/>`,
});

/* ---------- Regionen (Pangäa-Karte; Schlüssel bleiben gleich, damit alte Spielstände passen) ---------- */
const REG={
  insel:{n:'Forscher-Tal',icon:'zelt',col:'#cfe0a8'},
  tethys:{n:'Tethys-Küste',icon:'palme',col:'#c3dfa6'},
  wueste:{n:'Pangäa-Wüste',icon:'duene',col:'#f0d7a2'},
  eis:{n:'Gondwana-Hochland',icon:'schneeflocke',col:'#dfeef5'},
  vulkan:{n:'Sibirische Vulkane',icon:'vulkan',col:'#e7c4b0'},
  ebene:{n:'Fossilien-Ebene',icon:'knochen',col:'#e6d8b4'},
  exped:{n:'Laurasia-Wälder',icon:'fernglas',col:'#c9dca8'},
  meer:{n:'Meer & Inseln',icon:'welle',col:'#b6d8e4'},
};
const ST_REG={tethys:['dschungel','lager','kita','werkstatt'],wueste:['spuren','eier','nest'],eis:['memory','grossklein','schatten','kamera'],vulkan:['rennen','vulkan'],
  ebene:['grabung','wiegross','werbinich','bildquiz'],exped:['picknick','expedition','museum','lauf'],
  meer:['riff','schiff','tiefsee','tauchfahrt','anning','ammoniten','meerfutter','karten','kino','futter','puzzle','waage','lufwas','klang','rettung','endlos','tracker']};
const regionOf=id=>{for(const k in ST_REG)if(ST_REG[k].includes(id))return k;return DATA.station(id)?'insel':null;};
const stationsIn=r=>DATA.STATIONS.map(s=>s.id).filter(id=>regionOf(id)===r&&id!=='zuhause'&&id!=='ausflug');
const PLAY_SAY={insel:'Spiel ein Spiel im Forscher-Tal.',tethys:'Spiel ein Spiel an der Tethys-Küste.',wueste:'Spiel ein Spiel in der Pangäa-Wüste.',eis:'Spiel ein Spiel im Gondwana-Hochland.',vulkan:'Spiel ein Spiel bei den Sibirischen Vulkanen.',
  ebene:'Spiel ein Spiel auf der Fossilien-Ebene.',exped:'Spiel ein Spiel in den Laurasia-Wäldern.',meer:'Spiel ein Spiel auf einer Insel oder im Meer.'};
const VISIT_SAY={insel:'Besuche das Forscher-Tal.',tethys:'Besuche die Tethys-Küste.',wueste:'Besuche die Pangäa-Wüste.',eis:'Besuche das Gondwana-Hochland.',vulkan:'Besuche die Sibirischen Vulkane.',ebene:'Besuche die Fossilien-Ebene.',
  exped:'Besuche die Laurasia-Wälder.',meer:'Fahr mit dem Boot ins Urzeit-Meer.'};

/* ---------- Aufgaben-Vorlagen (Daten) ----------
   lvl 1 = leicht & nah, 2 = mittel, 3 = weit weg · k = Art des Fortschritts
   pic: a = Tierbild, i = Symbol, b = kleines Abzeichen, n = Anzahl Symbole */
const TPL=[
  {id:'pet',lvl:1,k:'ev',ev:'animaltap',say:'Tippe auf einen Dino auf der Karte.',pic:{a:'triceratops',b:'hand'},go:'animal'},
  {id:'stern1',lvl:1,k:'stars',n:1,say:'Sammle einen Stern.',pic:{i:'stern',n:1},go:'near'},
  {id:'schatz',lvl:1,k:'ev',ev:'mapfind',say:'Finde einen Schatz auf der Karte.',pic:{i:'kristall',b:'lupe'},go:'disc'},
  {id:'neu',lvl:1,k:'newanimal',say:'Entdecke ein neues Tier.',pic:{a:'velociraptor',q:true,b:'rucksack'},go:'newanimal'},
  {id:'haus',lvl:1,k:'ev',ev:'homeplace',say:'Stell etwas in dein Forscherhaus.',pic:{i:'haus',b:'stern'},go:'zuhause'},
  {id:'hausbesuch',lvl:1,k:'station',st:'zuhause',say:'Besuche dein Forscherhaus.',pic:{i:'haus',b:'fussabdruck'},go:'zuhause',only:'first'},
  {id:'stern3',lvl:2,k:'stars',n:3,say:'Sammle drei Sterne.',pic:{i:'stern',n:3},go:'near'},
  {id:'futter',lvl:2,k:'play',st:['futter','meerfutter','picknick'],say:'Füttere einen Dino.',pic:{a:'brachiosaurus',b:'futter'},go:'st'},
  {id:'horn',lvl:2,k:'horn',say:'Finde im Museum einen Dino mit Hörnern.',pic:{a:'triceratops',b:'museum'},go:'museum',region:'exped'},
  {id:'boot',lvl:2,k:'ev',ev:'board',say:'Fahr mit dem Boot.',pic:{i:'boot',b:'welle'},go:'boat'},
  {id:'grabung',lvl:2,k:'play',st:['grabung'],say:'Grab ein Dino-Skelett aus.',pic:{i:'knochen',b:'schaufel'},go:'st'},
  {id:'puzzle',lvl:2,k:'play',st:['puzzle','memory'],say:'Leg ein Dino-Puzzle.',pic:{i:'puzzle',b:'stern'},go:'st'},
  {id:'karten',lvl:2,k:'cards',say:'Öffne ein Kartenpäckchen.',pic:{i:'sticker',b:'stern'},go:'karten'},
  {id:'modell',lvl:2,k:'model',say:'Bau ein Dino-Modell in der Werkstatt.',pic:{a:'stegosaurus',b:'hammer'},go:'werkstatt'},
  {id:'babys',lvl:2,k:'play',st:['kita','eier','nest','rettung'],say:'Hilf den Dino-Babys.',pic:{i:'babydino',b:'herz'},go:'st'},
  {id:'foto',lvl:3,k:'photo',say:'Mach ein Foto mit der Forscherkamera.',pic:{a:'lystrosaurus',b:'kamera'},go:'kamera',region:'eis'},
];
Object.keys(REG).forEach(r=>{
  TPL.push({id:'spiel_'+r,lvl:r==='insel'?2:3,k:'play',region:r,say:PLAY_SAY[r],pic:{i:REG[r].icon,b:'stern',bg:REG[r].col},go:'region'});
  if(r!=='insel') TPL.push({id:'besuch_'+r,lvl:3,k:'visit',region:r,say:VISIT_SAY[r],pic:{i:REG[r].icon,b:r==='meer'?'boot':'fussabdruck',bg:REG[r].col},go:'region'});
});
const tpl=id=>TPL.find(t=>t.id===id);

/* ---------- Pip wächst mit ---------- */
const STAGES=[
  {n:'Baby-Pip',need:0,w:48,say:''},
  {n:'Pip mit Halstuch',need:3,w:54,say:'Schau mal, mein neues Halstuch!'},
  {n:'Pip mit Rucksack',need:7,w:60,say:'Schau mal, mein neuer Rucksack!'},
  {n:'Großer Pip',need:12,w:68,say:'Schau mal, mein neuer Forscherhut!'},
  {n:'Forscher-Pip',need:18,w:76,say:'Jetzt habe ich sogar eine Lupe. Ich bin ein echter Forscher-Pip!'},
];
Q.STAGES=STAGES;
/* Geschenke fürs Forscherhaus (Start-Ausstattung + je eins für alle drei Aufträge) */
Q.DECO=[
  {id:'pflanze',icon:'q_pflanze',n:'Blumentopf',start:1},{id:'globus',icon:'globus',n:'Globus',start:1},{id:'buecher',icon:'buch',n:'Bücher',start:1},
  {id:'kuschel',icon:'babydino',n:'Kuschel-Dino',start:1},
  {id:'lampe',icon:'q_lampe',n:'Lampe'},{id:'fernglas',icon:'fernglas',n:'Fernglas'},{id:'kompass',icon:'kompass',n:'Kompass'},{id:'muschel',icon:'muschel',n:'Muschel'},
  {id:'kristall',icon:'kristall',n:'Kristall'},{id:'ballon',icon:'ballon',n:'Ballon'},{id:'dinoei',icon:'ei',n:'Dino-Ei'},{id:'anker',icon:'anker',n:'Anker'},
  {id:'goldstern',icon:'stern',n:'Goldstern'},{id:'kaktus',icon:'kaktus',n:'Kaktus'},{id:'bernstein',icon:'bernstein',n:'Bernstein'},{id:'blume',icon:'blume',n:'Blume'},
];

/* ---------- Spielstand ---------- */
let NOW=null;
const now=()=>NOW!=null?new Date(NOW):new Date();
const dayKey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const QS=()=>{const s=DW.state; s.quest=s.quest||{day:null,tasks:[],total:0,log:[],stageSeen:0,seen:null,gifts:0}; return s.quest;};
/* Forscherhaus: home.rooms[raum].spots = {platz: schlüssel}. Das frühere Einzelzimmer (home.spots) ist jetzt das Arbeitszimmer:
   alte Spielstände werden einmal verlustfrei übernommen (home.v=2); home.spots bleibt als Verweis auf die Plätze des Arbeitszimmers erhalten. */
const HS=()=>{const s=DW.state; const h=s.home=s.home||{}; h.deco=h.deco||{}; h.rooms=h.rooms||{};
  const a=h.rooms.arbeit=h.rooms.arbeit||{}; a.spots=a.spots||{};
  if(h.spots!==a.spots){ if(h.v!==2&&h.spots) for(const k in h.spots) if(!(k in a.spots)) a.spots[k]=h.spots[k]; h.spots=a.spots; }
  h.v=2; return h;};
Q.home=HS; Q.state=QS;
Q.points=()=>QS().total+Math.floor(DW.totalStars()/10);
Q.stage=()=>{const p=Q.points();let k=0;STAGES.forEach((s,i)=>{if(p>=s.need)k=i;});return k;};
Q.nextNeed=()=>{const k=Q.stage();return k<STAGES.length-1?STAGES[k+1].need-Q.points():0;};

/* ---------- Zufall pro Tag ---------- */
function seeded(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}let s=(h>>>0)%2147483646+1;
  return ()=>{s=(s*16807)%2147483647;return s/2147483647;};}
const wpick=(arr,w,r)=>{const tot=arr.reduce((a,x)=>a+w(x),0);let v=r()*tot;for(const x of arr){v-=w(x);if(v<=0)return x;}return arr[arr.length-1];};

/* ---------- Messgrößen für Aufgaben ---------- */
const metric={
  stars:()=>DW.totalStars(),
  newanimal:()=>Object.keys(DW.state.animals).length,
  cards:()=>((DW.state.cards||{}).opened||0),
  model:()=>{const m=(GK.st('werkstatt').models||[]);return m.length?(m[m.length-1].t||0):0;},
  photo:()=>{const a=(GK.st('kamera').album||[]);return a.length?(a[a.length-1].t||0):0;},
};
function makeTask(T,extra){const t=Object.assign({id:T.id,have:0,n:T.n||1,done:false,t0:Date.now()},extra||{});if(metric[T.k])t.base=metric[T.k]();return t;}

/* Drei Aufgaben für heute: 1 nah & leicht, 1 mittel, 1 weit weg (lieber in noch unbekannte Länder) */
function hereRegion(){const r=window.WORLD&&WORLD.region?WORLD.region():null;return r||'insel';}
function generate(dk){
  const q=QS(),r=seeded('pip|'+dk),here=hereRegion(),first=!q.log.length&&!q.total;
  if(first) return ['pet','stern1','hausbesuch'].map(id=>makeTask(tpl(id)));
  const used=new Set(), seen=DW.state.regions||{}, recent=new Set(q.log.slice(-2).flatMap(l=>l.ids||[]));
  const ok=T=>!used.has(T.id)&&T.only!=='first'&&!(T.id==='boot'&&here==='meer');
  const w=T=>recent.has(T.id)?.3:1;
  const near=TPL.filter(T=>ok(T)&&(T.lvl===1||(T.k==='play'&&T.region===here)||(T.region===here&&T.lvl===2)));
  const A=wpick(near,T=>w(T)*(T.k==='play'?1.5:1),r);used.add(A.id);
  const mid=TPL.filter(T=>ok(T)&&T.lvl===2&&T.k!==A.k&&(!T.region||T.region==='insel'||T.region===here));
  const B=wpick(mid,w,r);used.add(B.id);
  const far=TPL.filter(T=>ok(T)&&T.lvl===3&&T.region!==here&&T.id!=='besuch_'+here);
  const C=wpick(far,T=>w(T)*(T.k==='visit'?(seen[T.region==='meer'?'meer':T.region]?1:3):1.2),r);
  return [A,B,C].map(T=>makeTask(T));
}
function ensureDay(){const q=QS(),dk=dayKey(now());
  if(q.day!==dk){q.day=dk;q.tasks=generate(dk);q.seen=null;DW.save();refreshHud();return true;}
  return false;}
Q.tasks=()=>{ensureDay();return QS().tasks;};

/* ---------- Fortschritt ---------- */
const HORN_X=['carnotaurus','wollnashorn','arsinoitherium'];
function horned(id){const a=DATA.animal(id),art=a?a.art:id,sp=ART.SPECIES[ART.resolve(art)];return HORN_X.includes(id)||!!(sp&&sp.plan==='ceratops'&&sp.horns&&sp.horns!=='boss');}
Q.horned=horned;
function bump(pred,amount=1){ensureDay();QS().tasks.forEach(t=>{if(t.done)return;const T=tpl(t.id);if(!T||!pred(T,t))return;t.have=Math.min(t.n,t.have+amount);if(t.have>=t.n)complete(t);else{DW.save();refreshHud();}});}
function check(){if(!QS().day)return;ensureDay();QS().tasks.forEach(t=>{if(t.done)return;const T=tpl(t.id);if(!T||!metric[T.k])return;
  const m=metric[T.k](),d=(T.k==='model'||T.k==='photo')?(m>t.t0?1:0):Math.max(0,m-(t.base||0));
  if(d!==t.have){t.have=Math.min(t.n,d);if(t.have>=t.n)complete(t);else{DW.save();refreshHud();}}});
  growCheck();}
const matchPlay=(T,id)=>T.st?T.st.includes(id):regionOf(id)===T.region;
DW.on('stars',id=>{bump(T=>T.k==='play'&&matchPlay(T,id));check();});
DW.on('animaltap',()=>bump(T=>T.k==='ev'&&T.ev==='animaltap'));
DW.on('mapfind',()=>bump(T=>T.k==='ev'&&T.ev==='mapfind'));
DW.on('board',()=>bump(T=>T.k==='ev'&&T.ev==='board'));
DW.on('homeplace',()=>bump(T=>T.k==='ev'&&T.ev==='homeplace'));
DW.on('region',r=>bump(T=>T.k==='visit'&&T.region===r));
DW.on('arrive',s=>{if(!s)return;const r=regionOf(s.id);bump(T=>(T.k==='visit'&&T.region===r)||(T.k==='station'&&T.st===s.id));});
DW.on('station',id=>bump(T=>T.k==='station'&&T.st===id));
DW.on('animalcard',id=>{if(DW.current&&DW.current.id==='museum'&&horned(id))bump(T=>T.k==='horn');});
DW.on('collect',()=>check());
DW.on('world',()=>check());
setInterval(()=>{if(DW.state.started)check();},3000);

/* ---------- Belohnung ---------- */
const QUEUE=[];
function onMap(){const w=document.getElementById('world');return !DW.current&&w&&!w.hidden;}
function complete(t){
  if(t.done)return; t.done=true; t.have=t.n; const q=QS(); q.total=(q.total||0)+1;
  let L=q.log.find(l=>l.d===q.day); if(!L){L={d:q.day,ids:[]};q.log.push(L);} L.ids.push(t.id); while(q.log.length>60)q.log.shift();
  DW.save(); DW.sfx('magic');
  DW.toast(`<span class="qt-ic">${picHTML(tpl(t.id),true)}</span>`,'Auftrag geschafft!','Ein Stempel für dein Auftragsbuch');
  QUEUE.push({type:'done',t});
  if(q.tasks.every(x=>x.done)){const g=giveGift();QUEUE.push({type:'all',gift:g});}
  growCheck(); refreshHud(true);
  if(onMap()) setTimeout(flush,700);
}
function growCheck(){const q=QS(),k=Q.stage();if(k>(q.stageSeen||0)){const from=q.stageSeen||0;q.stageSeen=k;DW.save();QUEUE.push({type:'grow',from,to:k});Q.applyPip();if(onMap())setTimeout(flush,700);}}
function giveGift(){const h=HS();const g=Q.DECO.find(d=>!d.start&&!h.deco[d.id]);if(!g)return null;h.deco[g.id]=Date.now();QS().gifts=(QS().gifts||0)+1;DW.save();return g;}
let flushing=false, flushT=0;
function flush(){
  if(flushing&&document.getElementById('overlay').hidden&&Date.now()-flushT>4000)flushing=false;
  if(flushing||!QUEUE.length||!onMap())return false;
  if(!document.getElementById('overlay').hidden||!document.getElementById('spot').hidden){setTimeout(flush,1200);return true;}
  flushing=true;flushT=Date.now();
  // Reihenfolge: kurze Meldungen zuerst, dann Wachsen, dann „alle geschafft“
  const done=QUEUE.filter(e=>e.type==='done'),grow=QUEUE.filter(e=>e.type==='grow'),all=QUEUE.filter(e=>e.type==='all');QUEUE.length=0;
  const rest=QS().tasks.filter(t=>!t.done).length;
  const next=()=>{ if(grow.length){const g=grow.shift();const to=grow.length?grow.pop().to:g.to;growModal(g.from,to,next);return;}
    if(all.length){allModal(all[all.length-1].gift,()=>{flushing=false;});all.length=0;return;} flushing=false; };
  if(done.length){flyStamp();DW.say('Auftrag geschafft!').then(()=>{if(!grow.length&&!all.length&&rest)DW.say(rest===2?'Noch zwei Aufträge.':'Noch ein Auftrag.',{queue:true});});
    setTimeout(next,grow.length||all.length?1600:0);}
  else next();
  return true;
}
Q.onWorld=()=>{check();if(QUEUE.length){setTimeout(flush,650);return true;}return false;};
function flyStamp(){const b=document.getElementById('btnQuest');if(!b)return;const r=b.getBoundingClientRect();
  const el=DW.h(`<div class="q-fly">${ART.icon('q_stempel')}${ART.icon('check')}</div>`);document.body.appendChild(el);
  el.style.left=(innerWidth/2)+'px';el.style.top=(innerHeight*.42)+'px';
  requestAnimationFrame(()=>requestAnimationFrame(()=>{el.style.left=(r.left+r.width/2)+'px';el.style.top=(r.top+r.height/2)+'px';el.classList.add('go');}));
  setTimeout(()=>{el.remove();b.classList.remove('q-bump');void b.offsetWidth;b.classList.add('q-bump');DW.sfx('star');},1150);}

/* ---------- Pip zeichnen (mit Zubehör je Stufe) ---------- */
const ACC=[
  // 1 Halstuch
  `<path d="M120 60 Q128 72 126 88" stroke="#6b2f22" stroke-width="13" stroke-linecap="round" fill="none" opacity=".35"/><path d="M120 60 Q128 72 126 88" stroke="#c8553d" stroke-width="11" stroke-linecap="round" fill="none"/><circle cx="122.5" cy="65" r="1.5" fill="#fbe9d6"/><circle cx="126" cy="72" r="1.5" fill="#fbe9d6"/><circle cx="126.5" cy="80" r="1.5" fill="#fbe9d6"/><path d="M125 86 l-11 11 l8 3 z M126 87 l-2 14 l7 -2 z" fill="#c8553d" stroke="#6b2f22" stroke-width="1.1" stroke-linejoin="round"/>`,
  // 2 Rucksack
  `<path d="M86 54 Q89 62 93 66" stroke="#6e4a30" stroke-width="3" fill="none"/><g transform="rotate(-10 86 44)"><rect x="70" y="30" width="32" height="26" rx="8" fill="#a8724a" stroke="${INK}" stroke-width="1.6"/><rect x="74" y="40" width="24" height="11" rx="4" fill="#c69063" stroke="${INK}" stroke-width="1.2"/><circle cx="86" cy="45" r="2" fill="#e9c46a"/><path d="M79 30 q7 -8 14 0" stroke="#6e4a30" stroke-width="2.6" fill="none"/></g>`,
  // 3 Hut
  `<g transform="rotate(10 146 50)"><ellipse cx="146" cy="51" rx="19" ry="5" fill="#caa25e" stroke="${INK}" stroke-width="1.4"/><path d="M134 51 Q134 35 146 34 Q158 35 158 51 Z" fill="#e0bf7a" stroke="${INK}" stroke-width="1.4"/><path d="M134.5 46 Q146 49 157.5 46 L158 50 Q146 53 134 50 Z" fill="#8a6d4a"/></g>`,
  // 4 Lupe + Stern
  `<path d="M99 35 L108 18" stroke="#8a6d4a" stroke-width="4" stroke-linecap="round"/><circle cx="112" cy="10" r="7.5" fill="rgba(210,236,245,.8)" stroke="#8a6d4a" stroke-width="2.6"/><path d="M109 7 q2 -2 5 -1" stroke="#fff" stroke-width="1.6" fill="none"/><path d="M121 84 l2.4 5 5.4 .6 -4 3.7 1.1 5.3 -4.9 -2.7 -4.8 2.7 1.1 -5.3 -4 -3.7 5.4 -.6z" fill="#f0c35a" stroke="${INK}" stroke-width="1"/>`,
];
const pipCache=new Map();
Q.pipSVG=(stage=Q.stage(),o={})=>{const key=stage+'|'+(o.ph||0)+'|'+(o.mood||'');if(pipCache.has(key))return pipCache.get(key);
  let a=ART.animal('protoceratops',{ph:o.ph||0,shadow:false,mood:o.mood});
  const m=/<svg[^>]*viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"[^>]*>/.exec(a);
  if(m) a=a.replace(m[0],`<svg x="${m[1]}" y="${m[2]}" width="${m[3]}" height="${m[4]}" viewBox="${m[1]} ${m[2]} ${m[3]} ${m[4]}" overflow="visible">`);
  let acc='';for(let i=1;i<=stage;i++)acc+=ACC[i-1];
  // Rucksack hinter dem Körper? – liegt oben drauf; Halstuch vor dem Hals
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176 116" width="352" height="232">${a}${acc}</svg>`;
  pipCache.set(key,svg);return svg;};
Q.pipImg=(stage=Q.stage(),cls='')=>`<img class="${cls}" src="${DW.svgURL(Q.pipSVG(stage,{mood:'happy'}))}" alt="Pip" draggable="false">`;
const EGG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="58" rx="18" ry="4" fill="rgba(60,50,30,.15)"/><path d="M32 6C20 6 12 26 12 38a20 20 0 0 0 40 0C52 26 44 6 32 6z" fill="#f3e6c8" stroke="${INK}" stroke-width="1.6"/><circle cx="24" cy="30" r="3" fill="#d9b36c"/><circle cx="38" cy="22" r="2.4" fill="#d9b36c"/><circle cx="40" cy="42" r="3.4" fill="#d9b36c"/><path d="M14 34l6 4 5-5 6 5 5-5 6 5 5-4 5 3" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linejoin="round"/></svg>`;
Q.applyPip=()=>{const k=Q.stage();
  const who=document.getElementById('bubbleWho'); if(who) who.innerHTML=Q.pipSVG(k,{mood:'happy'});
  if(window.WORLD&&WORLD.setPip){const fr=[];for(let i=0;i<6;i++)fr.push(ART.toImage(Q.pipSVG(k,{ph:i/6}),'pip|'+k+'|'+i));WORLD.setPip(fr,STAGES[k].w*176/167);}
  refreshHud();};

/* ---------- Bilder der Aufgaben ---------- */
function picHTML(T,small){if(!T)return '';const p=T.pic||{};
  let main='';
  if(p.a) main=`<span class="qp-a${p.q?' qp-q':''}">${DW.animalImg(p.a,{shadow:false})}</span>${p.q?'<b class="qp-qm">?</b>':''}`;
  else if(p.n) main=`<span class="qp-n qp-n${p.n}">${ART.icon(p.i).repeat(p.n)}</span>`;
  else main=`<span class="qp-i">${ART.icon(p.i)}</span>`;
  return `<span class="qp${small?' sm':''}" style="${p.bg?`--qbg:${p.bg}`:''}">${main}${p.b&&!small?`<span class="qp-b">${ART.icon(p.b)}</span>`:''}</span>`;}
Q.picHTML=id=>picHTML(tpl(id));
Q.taskSay=id=>(tpl(id)||{}).say||'';

/* ---------- Hinführen ---------- */
function nearest(ids){let best=null,bd=1e18;ids.forEach(id=>{const d=WORLD.stationDist?WORLD.stationDist(id):0;if(d<bd){bd=d;best=id;}});return best;}
function targetOf(t){const T=tpl(t.id);if(!T||!window.WORLD)return null;
  switch(T.go){
    case 'st':return nearest(T.st);
    case 'region':{const ids=stationsIn(T.region),fresh=ids.filter(id=>!DW.state.stars[id]);return nearest(fresh.length&&T.k==='play'?fresh:ids);}
    case 'near':{const ids=DATA.STATIONS.map(s=>s.id).filter(id=>!['zuhause','ausflug','karten','museum'].includes(id));return nearest(ids);}
    case 'boat':return nearest(ST_REG.meer);
    case 'animal':case 'newanimal':case 'disc':return '@'+T.go;
    default:return T.go;}}
Q.guide=t=>{const T=tpl(t.id),tg=targetOf(t);if(!tg)return false;
  if(tg==='@animal'){const id=WORLD.showAnimal&&WORLD.showAnimal();if(id){DW.say('Da ist ein Dino. Tippe ihn an!');return true;}return false;}
  if(tg==='@newanimal'){const id=WORLD.showAnimal&&WORLD.showAnimal(a=>{const d=DATA.animal(a);return d&&!DW.state.animals[d.id];});
    if(id){DW.say('Da ist ein Tier, das du noch nicht kennst. Tippe es an!');return true;}WORLD.goTo('museum');DW.say('Im Museum gibt es viele Tiere zu entdecken.');return true;}
  if(tg==='@disc'){if(WORLD.goNearestDisc&&WORLD.goNearestDisc()){DW.say('Da glitzert etwas! Wir laufen hin.');return true;}WORLD.goTo('grabung');DW.say('Bei der Ausgrabung findest du bestimmt einen Schatz.');return true;}
  WORLD.goTo(tg);DW.sfx('whoosh');DW.say(DW.pick(['Komm, wir gehen hin!','Los geht’s, ich zeige dir den Weg!']));return true;};

/* ---------- Oberfläche: Knopf auf der Karte ---------- */
function refreshHud(bump){const b=document.getElementById('btnQuest');if(!b)return;const q=QS();
  const tasks=q.day?q.tasks:[];const done=tasks.filter(t=>t.done).length;
  b.querySelector('.q-dots').innerHTML=tasks.map(t=>`<i class="${t.done?'on':''}"></i>`).join('');
  b.classList.toggle('q-new',!!q.day&&q.seen!==q.day&&done<tasks.length);
  b.classList.toggle('q-alldone',tasks.length&&done===tasks.length);
  const pp=b.querySelector('.q-pip');if(pp&&pp.dataset.k!==String(Q.stage())){pp.dataset.k=Q.stage();pp.innerHTML=Q.pipImg(Q.stage());}}
function setupHud(){const bl=document.querySelector('#world .hud.bl');if(!bl||document.getElementById('btnQuest'))return;
  const b=DW.h(`<button class="ibtn q-btn" id="btnQuest" type="button" aria-label="Pips Aufträge"><span class="q-roll">${ART.icon('q_rolle')}</span><span class="q-pip"></span><span class="q-dots"></span></button>`);
  bl.insertBefore(b,bl.firstChild);b.onclick=()=>{DW.sfx('pop');Q.open();};refreshHud();}
Q.setupHud=setupHud;
/* Beim Betreten der Karte: neue Aufträge ankündigen (ohne Druck) */
Q.enterWorld=()=>{setupHud();const fresh=ensureDay();Q.applyPip();refreshHud();
  const q=QS();if(q.seen!==q.day&&q.tasks.some(t=>!t.done))setTimeout(()=>{if(onMap()&&document.getElementById('overlay').hidden)DW.say('Ich habe neue Aufträge für dich! Tippe auf die Schriftrolle.',{queue:true});},fresh?200:0);};

/* ---------- Auftragskarte ---------- */
Q.open=()=>{ensureDay();const q=QS();q.seen=q.day;DW.save();refreshHud();
  const tasks=q.tasks,k=Q.stage(),left=tasks.filter(t=>!t.done).length;
  const m=DW.modal(`<div class="qc">
    <div class="qc-head"><button class="qc-pipbtn" type="button" aria-label="Pip">${Q.pipImg(k,'qc-pip')}</button><h2>Pips Aufträge</h2>
      <button class="ibtn qc-say" type="button" aria-label="Vorlesen">${ART.icon('lautsprecher')}</button></div>
    <div class="qc-list">${tasks.map((t,i)=>{const T=tpl(t.id);const tg=targetOf(t);const boat=tg&&tg[0]!=='@'&&WORLD.needsBoat&&WORLD.needsBoat(tg);
      return `<div class="qc-task${t.done?' done':''}" data-i="${i}">
        <button class="qc-pic" type="button" aria-label="${T.say}">${picHTML(T)}${t.done?`<span class="qc-stamp">${ART.icon('q_stempel')}${ART.icon('check')}</span>`:''}</button>
        <div class="qc-mid"><p>${T.say}</p><div class="qc-prog">${t.n>1?[...Array(t.n)].map((_,j)=>`<i class="${j<t.have?'on':''}">${ART.icon('stern')}</i>`).join(''):''}</div></div>
        ${t.done?`<span class="qc-ok">${ART.icon('check')}</span>`:tg?`<button class="btn go qc-go" type="button" aria-label="Hinbringen">${ART.icon(boat?'boot':'fussabdruck',36)}</button>`:''}
      </div>`;}).join('')}</div>
    <div class="qc-foot"><button class="qc-grow" type="button" aria-label="So groß ist Pip">${growDots()}</button>
      <button class="btn ghost qc-home" type="button">${ART.icon('haus',30)}<span>Forscherhaus</span></button></div>
  </div>`);
  m.classList.add('qc-modal');
  const intro=left?'Das sind meine Aufträge für heute. Tippe auf ein Bild, dann lese ich es vor.':'Alle Aufträge sind geschafft! Morgen gibt es neue.';
  DW.say(intro);
  m.querySelector('.qc-say').onclick=()=>{DW.sfx('tap');DW.say(tasks.map(t=>tpl(t.id).say).join(' '));};
  DW.$$('.qc-task',m).forEach(row=>{const t=tasks[+row.dataset.i];
    row.querySelector('.qc-pic').onclick=()=>{DW.sfx('tap');const el=row.querySelector('.qp');el.classList.remove('gk-good');void el.offsetWidth;el.classList.add('gk-good');
      DW.say(tpl(t.id).say+(t.done?' Das hast du schon geschafft!':''));};
    const g=row.querySelector('.qc-go');if(g)g.onclick=()=>{m.close();Q.guide(t);};});
  m.querySelector('.qc-pipbtn').onclick=()=>{m.close();Q.pipCard();};
  m.querySelector('.qc-grow').onclick=()=>{m.close();Q.pipCard();};
  m.querySelector('.qc-home').onclick=()=>{m.close();if(window.WORLD&&WORLD.goTo)WORLD.goTo('zuhause');DW.say('Wir gehen in dein Forscherhaus!');};
};
function growDots(){const k=Q.stage(),p=Q.points();if(k>=STAGES.length-1)return `${Q.pipImg(k,'qg-pip')}<span class="qg-dots full">${ART.icon('stern')}</span>`;
  const a=STAGES[k].need,b=STAGES[k+1].need;
  return `${Q.pipImg(k,'qg-pip')}<span class="qg-dots">${[...Array(b-a)].map((_,i)=>`<i class="${a+i<p?'on':''}"></i>`).join('')}</span>${Q.pipImg(k+1,'qg-pip next')}`;}
Q.growDots=growDots;

/* ---------- Pip-Karte: Wachstum ---------- */
Q.pipCard=()=>{const k=Q.stage();
  const m=DW.modal(`<div class="pc">
    <div class="pc-top"><div class="pc-big">${Q.pipImg(k)}</div><div><h2>${STAGES[k].n}</h2><p class="pc-sub">${k<STAGES.length-1?'Mit jedem Auftrag wachse ich ein Stück.':'Ich bin groß geworden – danke!'}</p>
      <div class="qc-grow pc-grow">${growDots()}</div>
      <button class="btn pc-say" type="button">${ART.icon('lautsprecher',30)}Vorlesen</button></div></div>
    <div class="pc-chart" aria-label="So bin ich gewachsen">
      <div class="pc-st done"><span class="pc-img" style="--s:.42">${EGG}</span><small>Ei</small></div>
      ${STAGES.map((s,i)=>`<div class="pc-st${i<=k?' done':''}${i===k?' now':''}"><span class="pc-img" style="--s:${(.5+i*.125).toFixed(3)}">${Q.pipImg(i)}</span><small>${i<=k?s.n:'?'}</small></div>`).join('')}
    </div></div>`);
  m.classList.add('pc-modal');
  const txt='Das bin ich, Pip! '+(k<STAGES.length-1?'Mach Aufträge, dann wachse ich weiter.':'Ich bin jetzt ein echter Forscher-Pip.');
  DW.say(txt);m.querySelector('.pc-say').onclick=()=>DW.say(txt);
  DW.$$('.pc-st',m).forEach((el,i)=>el.onclick=()=>{DW.sfx('tap');if(i===0)DW.say('So klein war ich mal: ein Ei!');else if(i-1<=k)DW.say(STAGES[i-1].n+'.');else DW.say('Das bin ich später. Mach Aufträge, dann wachse ich weiter.');});
};

/* ---------- Feiern ---------- */
function growModal(from,to,done){
  const m=DW.modal(`<div class="qg">
    <div class="qg-stage"><span class="qg-old">${Q.pipImg(from)}</span><span class="qg-new">${Q.pipImg(to)}</span><span class="qg-spark">${ART.icon('stern').repeat(5)}</span></div>
    <h2>${STAGES[to].n}</h2><button class="btn big go qg-ok" type="button">${ART.icon('check',36)}Toll!</button></div>`,{onClose:()=>done&&done()});
  m.classList.add('qg-modal');DW.sfx('magic');setTimeout(()=>{DW.confetti(90);DW.sfx('win');},900);
  DW.say('Hurra, ich bin gewachsen!').then(()=>{if(STAGES[to].say)DW.say(STAGES[to].say,{queue:true});});
  m.querySelector('.qg-ok').onclick=()=>{DW.sfx('tap');m.close();};
  DW.emit('pipgrow',to);}
function allModal(gift,done){const k=Q.stage();
  const m=DW.modal(`<div class="qa">
    <div class="qa-art">${Q.pipImg(k,'qa-pip')}<div class="qa-stamps">${QS().tasks.map(t=>`<span class="qa-st">${picHTML(tpl(t.id),true)}<span class="qc-stamp">${ART.icon('q_stempel')}${ART.icon('check')}</span></span>`).join('')}</div></div>
    <h2>Alle Aufträge geschafft!</h2>
    ${gift?`<div class="qa-gift"><span class="qa-box">${decoHTML(gift)}</span><p>Ein Geschenk für dein Forscherhaus!</p></div>`:''}
    <div class="row" style="justify-content:center;gap:12px;flex-wrap:wrap">${gift?`<button class="btn big go qa-home" type="button">${ART.icon('haus',36)}Zum Forscherhaus</button>`:''}
    <button class="btn big ghost qa-ok" type="button">${ART.icon('check',36)}Weiter</button></div></div>`,{onClose:()=>done&&done()});
  m.classList.add('qa-modal');DW.confetti(110);DW.sfx('win');
  DW.say('Alle Aufträge geschafft! Du bist super!').then(()=>{if(gift)DW.say('Pip hat ein Geschenk für dein Forscherhaus.',{queue:true});});
  m.querySelector('.qa-ok').onclick=()=>{DW.sfx('tap');m.close();};
  const h=m.querySelector('.qa-home');if(h)h.onclick=()=>{m.close();WORLD.goTo('zuhause');};}
function decoHTML(d){return d.animal?DW.animalImg(d.animal,{shadow:false,mood:'happy'}):ART.icon(d.icon);}
Q.decoHTML=decoHTML;

/* ---------- Auftragsbuch (Verlauf) ---------- */
Q.book=()=>{const q=QS();const log=q.log.slice().reverse();
  const m=DW.modal(`<div class="qb"><h2>${ART.icon('buch',44)}Mein Auftragsbuch</h2>
    <p class="qb-sum">${ART.icon('q_stempel',34)}<b>${q.total||0}</b></p>
    ${log.length?`<div class="qb-days">${log.map(l=>{const [y,mo,d]=l.d.split('-');return `<div class="qb-day"><span class="qb-date">${+d}.${+mo}.</span><span class="qb-st">${l.ids.map(id=>`<span class="qa-st" data-id="${id}">${picHTML(tpl(id),true)}<span class="qc-stamp">${ART.icon('q_stempel')}</span></span>`).join('')}</span></div>`;}).join('')}</div>`
      :`<div class="qb-empty">${ART.icon('q_rolle')}<p>Hier kommen deine Stempel hin.</p></div>`}</div>`);
  m.classList.add('qb-modal');
  DW.say(log.length?'Das ist dein Auftragsbuch. Für jeden Auftrag gibt es einen Stempel.':'Hier kommen deine Stempel hin. Schau in Pips Aufträge!');
  DW.$$('.qa-st',m).forEach(s=>s.onclick=()=>{DW.sfx('tap');DW.say(tpl(s.dataset.id).say);});};

/* ---------- Test-Hilfen ---------- */
Q._debug={
  setNow(iso){NOW=iso==null?null:Date.parse(iso);return ensureDay();},
  tasks(){ensureDay();return QS().tasks.map(t=>({id:t.id,have:t.have,n:t.n,done:t.done,target:targetOf(t)}));},
  set(ids){const q=QS();q.day=dayKey(now());q.tasks=ids.map(id=>makeTask(tpl(id)));DW.save();refreshHud();return Q._debug.tasks();},
  finish(i){const t=QS().tasks[i];if(t)complete(t);return Q._debug.tasks();},
  points(n){QS().total=n;DW.save();growCheck();return Q.stage();},
  queue(){return QUEUE.map(e=>e.type);},
  gen(dk,here){return generate(dk).map(t=>t.id);},
  all:()=>TPL.map(t=>t.id),
};
})();
