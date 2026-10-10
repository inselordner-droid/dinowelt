/* =====================================================================
   DINO-INSELWELT · GAME 05 „Dino-Picknick“
   Dino-Gäste sitzen um die Picknickdecke. Das Kind zieht passendes Essen
   aus den Körben auf die Teller.
   Leicht: 1–2 Gäste, „Ich habe Hunger!“ – jedes passende Futter zählt.
   Mittel: 2–3 Gäste, Wunschblase zeigt Futter + Anzahl (z. B. 3 Blätter).
   Schwer: 3–4 Gäste, Anzahl 1–4, manche zeigen nur „?“ – dann muss man
           wissen, was der Dino frisst. Ähnliche Speisen im Korb.
   ===================================================================== */
(function(){
"use strict";
const ID='picknick';

/* ---------- Spieldaten ---------- */
// Gäste: was sie fressen (nur fachlich passende Speisen; kein Gras für Jura-Tiere)
const PK_GUESTS={
  trex:{eats:['fleisch','aas','kleintier'],like:'Ich bin ein Fleischfresser!'},
  allosaurus:{eats:['fleisch','aas','kleintier'],like:'Ich fresse Fleisch!'},
  velociraptor:{eats:['fleisch','kleintier','eier'],like:'Ich fresse Fleisch und kleine Tiere.'},
  compsognathus:{eats:['kleintier','insekten'],like:'Ich fange kleine Eidechsen und Insekten.'},
  archaeopteryx:{eats:['insekten','kleintier'],like:'Ich schnappe Insekten und kleine Tiere.'},
  spinosaurus:{eats:['fisch'],like:'Ich fange am liebsten Fische!'},
  brachiosaurus:{eats:['blaetter','zapfen','farn'],like:'Ich fresse nur Pflanzen.'},
  diplodocus:{eats:['farn','blaetter'],like:'Ich fresse nur Pflanzen.'},
  stegosaurus:{eats:['farn','moos','blaetter'],like:'Ich fresse nur Pflanzen.'},
  triceratops:{eats:['farn','blaetter','wurzeln'],like:'Ich fresse nur Pflanzen.'},
  ankylosaurus:{eats:['farn','blaetter','wurzeln'],like:'Ich fresse nur Pflanzen.'},
  parasaurolophus:{eats:['blaetter','zapfen','farn'],like:'Ich fresse nur Pflanzen.'},
  iguanodon:{eats:['farn','blaetter'],like:'Ich fresse nur Pflanzen.'},
  gallimimus:{eats:['insekten','eier','fruechte'],like:'Ich mag Insekten, Eier und Früchte.'},
};
const EASY_GUESTS=['trex','triceratops','stegosaurus','brachiosaurus','velociraptor','diplodocus','ankylosaurus','spinosaurus'];
/* Weitere Gäste datengetrieben aus DATA.ANIMALS (Landtiere mit Zeichnung): Futter nach Nahrung und Zeitalter.
   Gras erst ab dem Neogen, Früchte ab dem Paläogen – so bleibt es fachlich richtig. */
const PK_PLANTS={devon:['farn','moos'],karbon:['farn','moos','wurzeln'],perm:['farn','zapfen','wurzeln'],trias:['farn','zapfen','blaetter'],jura:['farn','zapfen','blaetter'],
  kreide:['farn','blaetter','wurzeln'],palaeogen:['blaetter','fruechte','wurzeln'],neogen:['gras','blaetter','fruechte'],quartaer:['gras','blaetter','moos']};
const PK_LIKE={pflanzen:'Ich fresse nur Pflanzen.',fleisch:'Ich bin ein Fleischfresser!',fisch:'Ich fange am liebsten Fische!',insekten:'Ich schnappe Insekten und kleine Tiere.',alles:'Ich mag Insekten, Eier und Früchte.',
  klein:'Ich fange kleine Eidechsen und Insekten.',mini:'Ich fresse am liebsten Insekten.'};
// Leicht: nur Tiere, denen man ihr Futter ansieht (große Zähne ↔ Hörner, Platten, Langhals, Panzer, Entenschnabel)
function pkEasy(id){ if(EASY_GUESTS.includes(id)) return true; const a=DATA.animal(id), sp=ART.SPECIES[ART.resolve(a.art)]||{};
  if(!DATA.isDino(id)) return false;
  if(a.food==='fleisch') return sp.plan==='theropod'&&sp.head==='rex';
  if(a.food==='pflanzen') return ['sauropod','ceratops','stego','ankylo','ornitho'].includes(sp.plan)&&!sp.prosauro;
  return false; }
// zählbare Wörter zum Vorlesen: [eins, mehrere]
const PK_UNIT={farn:['einen Farnwedel','Farnwedel'],blaetter:['ein Blatt','Blätter'],moos:['ein Moospolster','Moospolster'],wurzeln:['eine Wurzel','Wurzeln'],
  zapfen:['einen Zapfen','Zapfen'],fruechte:['eine Frucht','Früchte'],fleisch:['ein Stück Fleisch','Stücke Fleisch'],fisch:['einen Fisch','Fische'],
  kleintier:['eine Eidechse','Eidechsen'],eier:['ein Ei','Eier'],insekten:['ein Insekt','Insekten'],aas:['einen Knochen','Knochen'],gras:['ein Grasbüschel','Grasbüschel']};
(function(){ DATA.ANIMALS.forEach(a=>{ if(PK_GUESTS[a.id]||a.sea||!ART.has(a.art)||DATA.habitat(a.id)==='wasser') return;
  const L=DATA.lenM(a.id)||3, small=L<1.5; let eats=null, like=PK_LIKE[a.food]||PK_LIKE.pflanzen;
  if(a.food==='pflanzen') eats=PK_PLANTS[a.era];
  else if(a.food==='fleisch'){ eats=small?['kleintier','insekten']:['fleisch','aas','kleintier']; if(small) like=PK_LIKE.klein; }
  else if(a.food==='fisch') eats=['fisch'];
  else if(a.food==='insekten'){ eats=L<.5?['insekten']:['insekten','kleintier']; if(L<.5) like=PK_LIKE.mini; }
  // Allesfresser: Satz „Insekten, Eier und Früchte“ – Früchte gibt es erst ab der Kreidezeit
  else if(a.food==='alles'){ const early=['trias','jura'].includes(a.era); eats=['insekten','eier'].concat(early?[]:['fruechte']); if(early) like='Ich mag Insekten und Eier.'; }
  if(!eats||!eats.length) return;
  PK_GUESTS[a.id]={eats,like,auto:true}; }); })();
/* Was ein Gast ohne Wunschbild („?“) annimmt: Pflanzenfresser jede Pflanze (außer Gras vor der Eiszeit/Neogen),
   große Fleischfresser alles Fleischige außer Insekten und Fisch – so wird keine richtige Antwort abgelehnt. */
function pkOk(id){ const G=PK_GUESTS[id]; if(G.ok) return G.ok; const a=DATA.animal(id)||{}; let ok=G.eats.slice();
  if(G.eats.every(f=>foodArt(f)==='pflanze')) ok=DATA.FOODS.filter(f=>f.art==='pflanze'&&(f.id!=='gras'||G.eats.includes('gras'))&&(f.id!=='fruechte'||!['devon','karbon','perm','trias','jura'].includes(a.era))).map(f=>f.id);
  else if(G.eats.includes('fleisch')) ok=[...new Set(ok.concat(['fleisch','aas','kleintier','eier','fisch']))];
  return G.ok=ok; }
const NUM=['null','eins','zwei','drei','vier'];
const PLACES=[{k:'wiese',deco:['blume','gras','blume']},{k:'strand',deco:['palme','muschel','welle']},{k:'wald',deco:['farn','zapfen','farn']}];
// Runden je Stufe: Gäste, Anzahl, Wunsch-Art
const LV={1:[{g:1,c:[3,3],pic:0},{g:2,c:[2,2],pic:0},{g:2,c:[2,2],pic:0}],
          2:[{g:2,c:[1,3],pic:1},{g:3,c:[1,3],pic:1},{g:3,c:[2,3],pic:1}],
          3:[{g:3,c:[1,4],pic:.5},{g:4,c:[1,4],pic:.5},{g:4,c:[2,4],pic:.5}]};
const foodArt=f=>(DATA.FOODS.find(x=>x.id===f)||{}).art;
const plantEater=id=>PK_GUESTS[id].eats.every(f=>foodArt(f)==='pflanze');
const cnt=(n,f)=>n===1?PK_UNIT[f][0]:NUM[n]+' '+PK_UNIT[f][1];

let root,lv=1,S=null,waitT=null;
function mount(r){root=r;intro();}
function intro(){
  GK.intro(root,{id:ID,art:`<div class="ga-art">${GK.img('stegosaurus',{mood:'happy'})}${GK.icon('fruechte').replace('<img','<img style="flex:.5 1 0;height:50%"')}${GK.img('trex',{mood:'happy',flip:true})}</div>`,title:'Dino-Picknick',
    say:'Picknick-Zeit! Die Dinos haben Hunger. Zieh jedem Dino das richtige Essen auf den Teller.',onStart:l=>{lv=l;S={r:0,miss:0};round();}});
}
function pickGuests(n){
  const pool=Object.keys(PK_GUESTS).filter(id=>DATA.animal(id)&&ART.has(DATA.animal(id).art)&&(lv>1?(lv===3||!PK_GUESTS[id].auto||DATA.isDino(id)):pkEasy(id)));
  // gemischt: Pflanzen- und Fleischfresser
  let out; for(let t=0;t<30;t++){ out=GK.sample(pool,n); const p=out.filter(plantEater).length; if(n===1||(p>0&&p<n))break; }
  return out;
}
function round(){
  const R=LV[lv][S.r], ids=pickGuests(R.g);
  const guests=ids.map((id,i)=>{ const G=PK_GUESTS[id]; const pic=R.pic>=1||(R.pic>0&&(i%2===0));
    const count=Math.round(DW.rand(R.c[0],R.c[1]+.49)); return {id,G,pic,count,wish:pic?DW.pick(G.eats):null,got:[],done:false,i}; });
  // Körbe: alles, was gewünscht ist + Ablenker
  let foods=new Set(); guests.forEach(g=>{ if(g.wish) foods.add(g.wish); else foods.add(DW.pick(g.G.eats)); });
  const need=[...foods], onlyPlant=need.every(f=>foodArt(f)==='pflanze'), onlyMeat=need.every(f=>foodArt(f)!=='pflanze');
  const want=lv===1?4:lv===2?6:8;
  let rest=DW.shuffle(Object.keys(PK_UNIT).filter(f=>!foods.has(f)));
  // Leicht/Mittel: Ablenker zuerst aus der anderen Futtergruppe (deutlich falsch); Schwer: ähnliche Speisen gemischt
  if(lv<3&&(onlyPlant||onlyMeat)) rest=rest.filter(f=>(foodArt(f)==='pflanze')!==onlyPlant).concat(rest.filter(f=>(foodArt(f)==='pflanze')===onlyPlant));
  rest.forEach(f=>{ if(foods.size<want) foods.add(f); });
  foods=DW.shuffle([...foods]);
  S.guests=guests; S.foods=foods; S.wrongRow=0;
  const place=PLACES[S.r%PLACES.length];
  root.innerHTML=`<div class="pk fill pk-${place.k}">
    <div class="pk-deco">${place.deco.map((d,i)=>`<img class="pk-d${i}" src="${DW.svgURL(ART.icon(d))}" alt="">`).join('')}</div>
    <div class="pk-top">${GK.progress(S.r,3)}</div>
    <div class="pk-blanket"><div class="pk-guests n${guests.length}">${guests.map(g=>guestHTML(g)).join('')}</div></div>
    <div class="pk-baskets">${foods.map(f=>`<button class="pk-food" data-f="${f}" aria-label="${(DATA.FOODS.find(x=>x.id===f)||{}).n}">${GK.icon(f)}</button>`).join('')}</div></div>`;
  guests.forEach(g=>{ g.el=root.querySelector(`.pk-guest[data-i="${g.i}"]`); g.img=g.el.querySelector('.pk-ani img');
    g.el.onclick=()=>{ DW.sfx('tap'); sayWish(g); }; });
  DW.$$('.pk-food',root).forEach(b=>{ const f=b.dataset.f;
    DW.drag(b,{ghost:()=>GK.icon(f),onTap:()=>{DW.sfx('pop');GK.pulse(b);DW.say((DATA.FOODS.find(x=>x.id===f)||{}).n+'. Zieh es auf einen Teller!');},
      onDrop:(x,y)=>{ const g=S.guests.find(g=>DW.hit(x,y,g.el)); if(!g) return false; return give(g,f,b); }}); });
  // Warten: ungeduldig wippen
  clearInterval(waitT);   // nur EIN Wipp-Zeitgeber (sonst stapeln sie sich mit jeder Runde und die Gäste zappeln immer schneller)
  waitT=GK.every(2400,()=>{ if(!S||!S.guests) return; const w=S.guests.filter(g=>!g.done); if(!w.length)return; const g=DW.pick(w); g.el.classList.remove('pk-wait'); void g.el.offsetWidth; g.el.classList.add('pk-wait'); });
  const intro=S.r===0?(lv===1?'Hier ist die Picknickdecke. ':'Picknick-Zeit! '):DW.pick(['Neue Gäste! ','Da kommen neue Dinos zum Picknick! ']);
  const first=guests[0];
  DW.say(intro+(guests.length===1?wishText(first):'Tippe einen Dino an, dann sagt er dir, was er möchte. '+wishText(first)));
  GK.idle.set(()=>{ const g=S.guests.find(g=>!g.done); if(!g)return; const f=g.wish||g.G.eats.find(x=>S.foods.includes(x)); const b=root.querySelector(`.pk-food[data-f="${f}"]`); GK.pulse(g.el.querySelector('.pk-bubble')); b&&GK.pulse(b); },
    ()=>{ const g=S.guests.find(g=>!g.done); g&&sayWish(g); });
  if(window.DW_DEBUG) window.__picknick={S,solve:()=>S.guests.filter(g=>!g.done).map(g=>{const f=g.wish||g.G.eats.find(x=>S.foods.includes(x)); const n=g.count-g.got.length; for(let k=0;k<n;k++) give(g,f,null); return [g.id,f,n];})};
}
function slotsHTML(g){
  return [...Array(g.count)].map((_,k)=>{ const got=g.got[k]; return `<span class="pk-slot${got?' on':''}">${got?GK.icon(got):g.wish?GK.icon(g.wish,'ghost'):''}</span>`; }).join('');
}
function guestHTML(g){
  const bub=g.wish?`<span class="pk-wnum">${g.count}×</span>${GK.icon(g.wish)}`:`<span class="pk-wnum">${g.count}×</span><span class="pk-q">?</span>`;
  return `<div class="pk-guest" data-i="${g.i}"><div class="pk-bubble">${bub}</div>
    <div class="pk-ani">${GK.img(g.id,{},'')}</div>
    <div class="pk-plate"><div class="pk-slots">${slotsHTML(g)}</div></div><b class="pk-name">${DATA.nameOf(g.id)}</b></div>`;
}
function wishText(g){
  const n=DATA.nameOf(g.id);
  if(g.wish) return `${n} möchte ${cnt(g.count,g.wish)}.`;
  return `${n} hat Hunger${g.count>1?' und möchte '+NUM[g.count]+' Sachen':''}. Was frisst ${g.id==='trex'?'der T-Rex':n}?`;
}
function sayWish(g){
  if(g.done){ DW.say(DW.pick(['Ich bin satt. Danke!','Mmmh, das war lecker!'])); return; }
  const left=g.count-g.got.length;
  if(g.got.length&&g.wish) DW.say(`Ich möchte noch ${cnt(left,g.wish)}.`);
  else if(g.got.length) DW.say(`Noch ${left===1?'eine Sache':NUM[left]+' Sachen'}, bitte!`);
  else DW.say(wishText(g));
}
function refresh(g){ g.el.querySelector('.pk-slots').innerHTML=slotsHTML(g); }
/* Kauen: danach immer das normale (bzw. zufriedene) Bild – nie das zufällig gerade sichtbare (traurig/kauend), und nie zwei Kau-Zeitgeber zugleich */
function chew(g){ const a=DATA.animal(g.id).art; const c1=DW.svgURL(ART.animal(a,{mood:'chew',ph:.25,shadow:false})),c2=DW.svgURL(ART.animal(a,{mood:'chew',ph:.75,shadow:false})),n=DW.svgURL(ART.animal(a,{shadow:false}));
  clearInterval(g.chewT); let k=0; const t=g.chewT=GK.every(150,()=>{ g.img.src=k%2?c1:c2; if(++k>6){clearInterval(t); g.chewT=null; g.img.src=g.done?DW.svgURL(ART.animal(a,{mood:'happy',shadow:false})):n;} }); }
function give(g,f,btn){
  if(g.done){ DW.sfx('tap'); DW.say('Danke, ich bin schon satt!'); return false; }
  const inDiet=pkOk(g.id).includes(f);
  if(inDiet&&(!g.wish||g.wish===f)){
    g.got.push(f); S.wrongRow=0; DW.sfx('chew'); refresh(g); chew(g);
    const slot=g.el.querySelectorAll('.pk-slot')[g.got.length-1]; slot&&GK.ok(slot);
    if(g.got.length>=g.count){ g.done=true; g.el.classList.add('full'); GK.after(700,()=>{DW.sfx('ok');});
      DW.say(DW.pick(['Mmmh! Jetzt bin ich satt.','Lecker! Danke schön!','Hmm, das war gut!'])); DW.discover(g.id,true);
      if(S.guests.every(x=>x.done)) GK.after(1500,roundDone);
    } else { DW.say(g.count-g.got.length>1||!g.wish?DW.pick(['Mampf!','Lecker!','Mmmh!']):`Noch ${PK_UNIT[f][0]}!`); }
    return true;
  }
  // freundlicher Fehlversuch
  S.miss++; S.wrongRow++;
  const a=DATA.animal(g.id).art; g.img.src=DW.svgURL(ART.animal(a,{mood:'sad',shadow:false}));
  g.el.classList.remove('wiggle'); void g.el.offsetWidth; g.el.classList.add('wiggle'); DW.sfx('yuck');
  GK.after(900,()=>{ if(!g.done&&!g.chewT) g.img.src=DW.svgURL(ART.animal(a,{shadow:false})); });
  let t;
  if(inDiet) t=`Lecker, aber heute möchte ich lieber ${PK_UNIT[g.wish][1]}.`;
  else if(plantEater(g.id)&&foodArt(f)!=='pflanze') t=DW.pick(['Bäh! Ich fresse doch kein Fleisch!','Igitt! Ich bin ein Pflanzenfresser!']);
  else if(plantEater(g.id)&&f==='gras') t='Gras? Das gab es zu meiner Zeit fast noch nicht. '+g.G.like;
  else if(plantEater(g.id)&&f==='fruechte') t='Früchte? Die gab es zu meiner Zeit noch nicht. '+g.G.like;
  else if(!plantEater(g.id)&&f==='insekten'&&g.G.eats.includes('fleisch')) t='Insekten? Die sind mir viel zu klein! '+g.G.like;
  else if(!plantEater(g.id)&&foodArt(f)==='pflanze') t=DW.pick(['Pflanzen? Nein danke! ','Blätter? Da muss ich ja lachen! '])+g.G.like;
  else t='Hm, das mag ich nicht so. '+g.G.like;
  DW.say(t);
  // Hinweis nach mehreren Fehlern: passendes Futter kurz leuchten lassen
  if(S.wrongRow>=2){ const ok=g.wish||g.G.eats.find(x=>S.foods.includes(x)); const b=root.querySelector(`.pk-food[data-f="${ok}"]`); GK.after(600,()=>b&&GK.pulse(b)); }
  return false;
}
function roundDone(){
  DW.sfx('win'); DW.confetti(40);
  S.guests.forEach((g,i)=>GK.after(i*180,()=>g.el.classList.add('pk-cheer')));
  root.querySelector('.pk-top').innerHTML=GK.progress(S.r+1,3);
  DW.say(DW.pick(['Alle sind satt und glücklich!','Hurra! Alle Dinos sind satt!','Was für ein tolles Picknick!']));
  S.r++;
  GK.after(2600,()=>{ if(S.r>=3) return end(); round(); });
}
function end(){
  const stars=S.miss<=1?3:S.miss<=4?2:1;
  GK.finish(root,{id:ID,stars,art:`<div class="ga-art">${GK.img('triceratops',{mood:'happy'})}${GK.icon('fruechte').replace('<img','<img style="flex:.5 1 0;height:50%"')}${GK.img('trex',{mood:'happy',flip:true})}</div>`,
    say:'Das war ein wunderbares Picknick! Pflanzenfresser mögen Blätter und Farne, Fleischfresser mögen Fleisch.',again:()=>{S={r:0,miss:0};round();}});
}
DW.stations[ID]={title:(DATA.station(ID)||{}).n||'Dino-Picknick',mount,unmount(){S=null;delete window.__picknick;}};
})();
