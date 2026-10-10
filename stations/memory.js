/* =====================================================================
   DINO-INSELWELT · GAME 14 „Dino-Memory“
   Klassisches Paare-Suchen mit gemalten Tieren. Beim Umdrehen wird der
   Name vorgelesen.
   Leicht: 6 Karten (3 Paare). Mittel: 12 Karten (6 Paare).
   Schwer: 16 Karten (8 Paare) – Zeichnung + passende Foto-Sammelkarte.
   ===================================================================== */
(function(){
"use strict";
const ID='memory';
const LV={1:{pairs:3},2:{pairs:6},3:{pairs:8,photo:true}};
const EASY=['trex','triceratops','stegosaurus','brachiosaurus','velociraptor','ankylosaurus','spinosaurus','parasaurolophus','pteranodon','mammut','diplodocus','pachycephalosaurus',
  'dimetrodon','plesiosaurus','mosasaurus','megalodon','smilodon','titanoboa','meganeura','trilobit','ammonit','archelon','dunkleosteus','gallimimus','therizinosaurus','quetzalcoatlus',
  'megaloceros','wollnashorn','arthropleura','anomalocaris','orthoceras','diplocaulus','archaeopteryx','dilophosaurus','carnotaurus'];
// Aussehens-Familie: Tiere mit (fast) gleicher Zeichnung nie gemeinsam in einer Runde
function meFam(id){ const a=DATA.animal(id)||{}, sp=ART.SPECIES[ART.resolve(a.art||id)]||{}, p=sp.plan||id;
  if(p==='theropod') return sp.sail?'spino':sp.head==='rex'?'rex':sp.head==='bird'?'strauss':sp.head==='small'?'krallen':sp.feathers?'raptor':'klein';
  if(p==='sauropod') return sp.neckUp?'brachio':sp.prosauro?'plateo':'lang';
  if(p==='ornitho') return sp.head==='dome'?'dome':sp.crest?'kamm':'ente';
  if(p==='mammal'){ const k=['mammoth','saber','antlers','rhino','bear','horse','giraffe','cat','catears','rabbit','dogears','knobs','pig','croc','rodent','tall','tusks'].find(k=>sp[k]); return 'm-'+(k||'x'); }
  if(p==='fish') return sp.shark?'hai':sp.armorhead?'panzerfisch':sp.eel?'aal':'fisch';
  if(p==='lizard') return sp.sail?'segel':sp.glider?'gleiter':'echse';
  if(p==='plesio') return sp.pliosaur?'pliosaur':'plesio';
  if(p==='amphib') return sp.boomerang?'bumerang':'amphib';
  return p; }
// n Tiere mit lauter verschiedenen Familien (Leicht: auch verschiedene Körperbaupläne)
function meDistinct(pool,n,byPlan){ const used=new Set(), out=[];
  for(const id of DW.shuffle(pool)){ const a=DATA.animal(id), sp=ART.SPECIES[ART.resolve(a.art)]||{}; const k=byPlan?(sp.plan||id):meFam(id); if(used.has(k)) continue; used.add(k); out.push(id); if(out.length>=n) break; }
  return out.length>=n?out:GK.sample(pool,n); }
const BACK_ICONS=['fussabdruck','ammonit','knochen','farn'];

let root,lv=1,S=null;
const nm=id=>DATA.nameOf(id);
function mount(r){root=r;intro();}
function intro(){
  GK.intro(root,{id:ID,art:`<div class="me-iart"><span class="me-mini back"></span><span class="me-mini">${GK.img('triceratops')}</span><span class="me-mini">${GK.img('triceratops')}</span></div>`,title:'Dino-Memory',
    say:'Dino-Memory! Dreh immer zwei Karten um. Findest du zwei gleiche Dinos?',onStart:l=>{lv=l;start();}});
}
function photoPool(){ return DATA.CARDS.filter(c=>c.id&&DATA.animal(c.id)&&ART.has(DATA.animal(c.id).art)&&!DATA.animal(c.id).sea); }
function start(){
  const cfg=LV[lv]; let ids;
  if(cfg.photo){ ids=meDistinct(photoPool().map(c=>c.id),cfg.pairs); }
  else { const pool=lv===1?EASY.filter(id=>DATA.animal(id)&&ART.has(DATA.animal(id).art)):GK.pool(a=>a.era!=='heute').map(a=>a.id); ids=meDistinct(pool,cfg.pairs,lv===1); }
  const cards=[]; ids.forEach(id=>{ cards.push({id,kind:'draw'}); cards.push({id,kind:cfg.photo?'photo':'draw'}); });
  S={ids,cards:DW.shuffle(cards),open:[],found:0,miss:0,missRow:0,lock:true};
  const back=DW.pick(BACK_ICONS);
  root.innerHTML=`<div class="me fill"><div class="me-top">${GK.progress(0,cfg.pairs)}</div><div class="me-board" id="meBoard">${S.cards.map((c,i)=>{
      const card=cfg.photo&&c.kind==='photo'?DATA.CARDS.find(x=>x.id===c.id):null;
      return `<button class="me-card" data-i="${i}" aria-label="Karte"><span class="me-in"><span class="me-back">${GK.icon(back)}</span>
        <span class="me-front${card?' photo':''}">${card?`<img src="${card.img}" alt="${nm(c.id)}" draggable="false">`:GK.img(c.id,{mood:'happy'})}</span></span></button>`; }).join('')}</div></div>`;
  const board=root.querySelector('#meBoard');
  layout(board); GK.listen(window,'resize',()=>layout(board));
  DW.$$('.me-card',board).forEach(b=>b.onclick=()=>flip(+b.dataset.i));
  // die ersten Sekunden: ein Paar kurz zeigen
  const k=S.cards.findIndex(c=>c.id===S.ids[0]), k2=S.cards.findIndex((c,j)=>c.id===S.ids[0]&&j!==k);
  GK.after(500,()=>{ [k,k2].forEach(j=>card(j).classList.add('open')); DW.sfx('whoosh'); DW.say(cfg.photo?'Schau: das Bild und das Foto gehören zusammen! Such immer zwei, die zusammenpassen.':'Schau: zwei gleiche Karten! Jetzt drehen sie sich um. Finde alle Paare!'); });
  GK.after(2600,()=>{ [k,k2].forEach(j=>card(j).classList.remove('open')); S.lock=false; });
  GK.idle.set(()=>{ const b=board.querySelector('.me-card:not(.done)'); b&&GK.pulse(b); },()=>DW.say('Tippe auf eine Karte, um sie umzudrehen.'));
  if(window.DW_DEBUG) window.__memory={S,solve:()=>{ const out=[]; if(!root.querySelector("#meBoard")) return out; S.ids.forEach(id=>{ S.cards.forEach((c,i)=>{ if(c.id===id&&!card(i).classList.contains('done')) out.push(i); }); }); return out; }};
}
const card=i=>root.querySelector(`.me-card[data-i="${i}"]`);
function layout(board){
  const n=S.cards.length, W=board.clientWidth, H=board.clientHeight, gap=10, ar=.78;
  const opts=[];
  for(let c=2;c<=n;c++){ const r=Math.ceil(n/c); opts.push({c,s:Math.min((W-gap*(c-1))/c,((H-gap*(r-1))/r)*ar),even:n%c===0}); }
  const mx=Math.max(...opts.map(o=>o.s)); const best=opts.filter(o=>o.even&&o.s>=mx*.85).sort((x,y)=>y.s-x.s)[0]||opts.sort((x,y)=>y.s-x.s)[0];
  board.style.setProperty('--cw',Math.floor(best.s)+'px'); board.style.setProperty('--cols',best.c);
}
function flip(i){
  const b=card(i); if(!S||S.lock||b.classList.contains('open')||b.classList.contains('done')) return;
  b.classList.add('open'); DW.sfx('click'); S.open.push(i);
  DW.say(nm(S.cards[i].id));
  if(S.open.length<2) return;
  S.lock=true; const [a,c]=S.open; S.open=[];
  if(S.cards[a].id===S.cards[c].id){
    S.found++; S.missRow=0;
    GK.after(450,()=>{ [a,c].forEach(j=>{card(j).classList.add('done');GK.ok(card(j));}); DW.sfx('star'); DW.discover(S.cards[a].id,true);
      root.querySelector('.me-top').innerHTML=GK.progress(S.found,S.ids.length);
      const f=(DATA.animal(S.cards[a].id)||{}).fact;
      if(S.found>=S.ids.length){ GK.after(900,end); } else { DW.say(DW.pick(['Ein Paar! ','Super, ein Paar! ','Gefunden! '])+nm(S.cards[a].id)+'!'); }
      S.lock=false; });
  } else {
    S.miss++; S.missRow++;
    GK.after(1300,()=>{ [a,c].forEach(j=>card(j).classList.remove('open')); DW.sfx('pop'); S.lock=false;
      if(S.missRow>=3){ S.missRow=0; const id=S.cards.find((x,j)=>!card(j).classList.contains('done')).id; S.cards.forEach((x,j)=>{ if(x.id===id) GK.pulse(card(j)); }); DW.say('Ein kleiner Tipp: Die zwei leuchtenden Karten gehören zusammen.'); } });
  }
}
function end(){
  const p=S.ids.length, stars=S.miss<=p*.6?3:S.miss<=p*1.6?2:1;
  GK.finish(root,{id:ID,stars,art:`<div class="ga-art">${S.ids.slice(0,3).map(id=>GK.img(id,{mood:'happy'})).join('')}</div>`,
    say:DW.pick(['Du hast alle Paare gefunden! Was für ein tolles Gedächtnis!','Alle Paare gefunden! Du bist ein Memory-Profi!']),again:()=>start()});
}
DW.stations[ID]={title:(DATA.station(ID)||{}).n||'Dino-Memory',mount,unmount(){S=null;delete window.__memory;}};
})();
