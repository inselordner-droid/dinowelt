/* =====================================================================
   DINO-INSELWELT · GAME 26 „Groß oder klein?“
   Dinos und heutige Tiere (Kaninchen … Elefant) nach Größe ordnen.
   Die Bilder sind alle gleich groß – das Kind muss wissen/schätzen.
   Danach stehen alle im echten Maßstab nebeneinander auf der Wiese.
   Größe = Länge von der Nase bis zur Schwanzspitze (DATA.lenM).
   Leicht:  „Wer ist größer / kleiner?“ – 2 sehr verschiedene Tiere, tippen.
   Mittel:  3 Tiere auf die Größen-Treppe stellen (ziehen oder tippen).
   Schwer:  4–5 ähnlich große Tiere, manchmal andersherum (groß → klein).
   Nach einem Fehlversuch zeigt ein Maßband unter jeder Karte die Länge.
   ===================================================================== */
(function(){
"use strict";
const ID='grossklein';

/* ---------- Spieldaten ---------- */
// heutige Tiere: Länge Nase bis Schwanzspitze in Metern (ungefähr)
const GR_PET_LEN={kaninchen:.4,katze:.7,hund:1,pferd:2.4,giraffe:4.5,elefant:6,huhn:.4,seekuh:3};
// heutige Tiere, die nicht in DATA.PETS stehen, aber gezeichnet sind (Name hier)
const GR_TODAY={huhn:'Huhn',seekuh:'Seekuh'};
const GR_ART={kaninchen:'das',katze:'die',hund:'der',pferd:'das',giraffe:'die',elefant:'der',mammut:'das',smilodon:'die',wollnashorn:'das',huhn:'das',seekuh:'die'};
const GR_SKIP=['titanoboa','arthropleura','orthoceras','eurypterus','anomalocaris']; // Schlange/Tausendfüßer: Länge täuscht; unsichere Längen
// Flugtiere nur, wenn lenM wirklich die Körperlänge ist (nicht die Flügelspannweite)
const GR_AIR_OK=['archaeopteryx','microraptor'];
const GR_EASY=['trex','triceratops','brachiosaurus','stegosaurus','velociraptor','diplodocus','ankylosaurus','spinosaurus','compsognathus','parasaurolophus','argentinosaurus','protoceratops','mammut','iguanodon','megalodon','archelon','trilobit','ammonit','smilodon','archaeopteryx','plesiosaurus','mosasaurus','wollnashorn','dimetrodon'];
const GR_LV={
  1:{rounds:[2,2,2,2,2],dir:['up','up','up','up','up']},
  2:{rounds:[3,3,3,3],dir:['up','up','up','down']},
  3:{rounds:[4,4,5,5],dir:['up','down','up','down']},
};
const NUMW=['null','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn'];

const isPet=id=>id in GR_PET_LEN;
const len=id=>isPet(id)?GR_PET_LEN[id]:DATA.lenM(id);
const nm=id=>GR_TODAY[id]||DATA.nameOf(id);
const der=id=>(GR_ART[id]||'der')+' '+nm(id);
const Der=id=>{const s=der(id);return s[0].toUpperCase()+s.slice(1);};
const ist=id=>isPet(id)?'ist':'war';
const fmtM=m=>m<1?Math.round(m*100)+' cm':String(m).replace('.',',')+' m';
const sayM=m=>m<1?Math.round(m*100)+' Zentimeter':(m===1?'einen Meter':String(m).replace('.',',')+' Meter');

// Seitenverhältnis der Zeichnung (Höhe/Breite), Bildbreite ≈ Körperlänge
const aspect={};
function ratio(id){ if(aspect[id]) return aspect[id]; const s=ART.animal((DATA.animal(id)||{art:id}).art,{shadow:false,pad:0});
  const m=s.match(/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/); return aspect[id]=m?(+m[4])/(+m[3]):.6; }
const scaleSrc=id=>DW.animalImg(id,{shadow:false,pad:0}).match(/src="([^"]+)"/)[1];

let root,lv=1,S=null;
let rzT=null, revFit=null;
function mount(r){root=r;revFit=null;intro(); GK.listen(window,'resize',()=>{ if(revFit) revFit(); clearTimeout(rzT); rzT=setTimeout(relayout,150); });}
/* Drehen/Größenänderung: Aufgabe neu anordnen, schon gestellte Karten bleiben stehen */
function relayout(){
  if(!S||!root) return; const q=S.qs[S.i], st=root.querySelector('#grStage'); if(!q||!st||q.done||!st.querySelector('.gr-card')) return;
  if(lv===1){ const bars=st.classList.contains('gr-bars'); layoutDuo(q); if(bars) st.classList.add('gr-bars'); return; }
  const bars=st.classList.contains('gr-bars');
  const keep=DW.$$('.gr-slot',st).map(s=>{ const c=s.querySelector('.gr-card'); return c?{id:c.dataset.id,lock:c.classList.contains('gr-lock')}:null; });
  layoutStairs(q); if(bars) st.classList.add('gr-bars');
  const slots=DW.$$('.gr-slot',st);
  keep.forEach((k,i)=>{ if(!k) return; const c=st.querySelector(`.gr-card[data-id="${k.id}"]`); slots[i].querySelector('.gr-hole').appendChild(c); if(k.lock) c.classList.add('gr-lock'); });
}
function intro(){
  GK.intro(root,{id:ID,title:'Groß oder klein?',
    art:`<div class="gr-iart"><span style="--w:14%">${GK.img('katze')}</span><span style="--w:30%">${GK.img('stegosaurus')}</span><span style="--w:22%">${GK.img('elefant')}</span></div>`,
    say:'Groß oder klein? Hilf mir, die Tiere der Größe nach aufzustellen. Dinos und Tiere von heute!',
    onStart:l=>{lv=l;start();}});
}

/* ---------- Aufgaben auswählen ---------- */
function pool(){
  // Urzeit-Tiere aus allen Zeitaltern – an Land und im Meer
  const dinos=DATA.ANIMALS.filter(a=>a.lenM&&ART.has(a.art)&&(DATA.habitat(a.id)!=='luft'||GR_AIR_OK.includes(a.id))&&!GR_SKIP.includes(a.id)&&(lv>1||GR_EASY.includes(a.id))).map(a=>a.id);
  const pets=DATA.PETS.filter(id=>DATA.animal(id)&&ART.has(DATA.animal(id).art)).concat(Object.keys(GR_TODAY).filter(id=>ART.has(id)));
  return {dinos,pets};
}
function valid(ids){
  const s=ids.slice().sort((a,b)=>len(a)-len(b)), L=s.map(len);
  if(ids.includes('giraffe')&&ids.some(o=>o!=='giraffe'&&len(o)>2.4&&len(o)<20)) return false; // Giraffe ist hoch, aber nicht lang
  if(ids.includes('elefant')&&ids.includes('mammut')) return false;
  if(ids.includes('huhn')&&ids.includes('kaninchen')) return false;
  for(let i=1;i<L.length;i++){ const r=L[i]/L[i-1], pet=isPet(s[i])||isPet(s[i-1]);
    if(lv===1&&r<2.5) return false;
    if(lv===2&&r<1.6) return false;
    if(lv===3&&(r<1.25||r>2.4)) return false;
    if(pet&&r<1.45) return false; }
  if(L[L.length-1]/L[0]>(lv===1?30:40)) return false;
  return true;
}
function pickSet(n,used){
  const P=pool();
  for(let t=0;t<900;t++){
    const nPet=lv===1?(Math.random()<.65?1:0):lv===2?1:(Math.random()<.5?1:2);
    const fresh=P.dinos.filter(x=>!used.includes(x)), dp=fresh.length>=n?fresh:P.dinos;
    const ids=GK.sample(P.pets,nPet,t<500?used:[]).concat(GK.sample(dp,n-nPet));
    if(ids.length===n&&valid(ids)) return DW.shuffle(ids);
  }
  for(let t=0;t<900;t++){ const ids=GK.sample(P.dinos.concat(P.pets),n); if(valid(ids)) return ids; }
  return GK.sample(P.dinos,n);
}

/* ---------- Ablauf ---------- */
function start(){
  const C=GR_LV[lv], used=[];
  const qs=C.rounds.map((n,i)=>{ const ids=pickSet(n,used); used.push(...ids); return {ids,dir:C.dir[i]}; });
  if(lv===1) qs.forEach((q,i)=>q.ask=(i%3===2)?'klein':'gross');
  S={i:0,qs,miss:0};
  next();
}
function next(){
  GK.idle.stop(); revFit=null;
  if(S.i>=S.qs.length) return end();
  const q=S.qs[S.i]; q.tries=0; q.done=false;
  root.innerHTML=`<div class="gr fill col">
    <div class="gr-top"><button class="ibtn big gr-say" aria-label="Frage nochmal">${ART.icon('lautsprecher')}</button>
      <span class="hand gr-q"></span>${GK.progress(S.i,S.qs.length)}</div>
    <div class="gr-stage" id="grStage"></div></div>`;
  root.querySelector('.gr-say').onclick=()=>{DW.sfx('tap');ask();};
  if(lv===1) layoutDuo(q); else layoutStairs(q);
  ask();
}
function qText(q){
  if(lv===1) return q.ask==='gross'?'Wer ist größer?':'Wer ist kleiner?';
  return q.dir==='up'?'Von klein nach groß!':'Von groß nach klein!';
}
function ask(){
  const q=S.qs[S.i]; const el=root.querySelector('.gr-q'); if(el) el.textContent=qText(q);
  if(lv===1){ const [a,b]=q.ids; DW.say(`Wer ist ${q.ask==='gross'?'größer':'kleiner'}: ${der(a)} oder ${der(b)}?`); return; }
  DW.say(q.dir==='up'?'Stell die Tiere auf die Treppe: das kleinste nach unten, das größte ganz nach oben!'
    :'Diesmal andersrum! Das größte kommt nach links auf die hohe Stufe, das kleinste nach rechts.');
}
const lenBar=(id,max)=>`<i class="gr-bar" style="--l:${Math.max(4,Math.round(Math.sqrt(len(id)/max)*100))}%"><s></s></i>`;
const cardHTML=(id,max)=>`<button class="gr-card" data-id="${id}" aria-label="${nm(id)}"><span class="gr-pic">${GK.img(id)}</span><b>${nm(id)}</b>${lenBar(id,max)}</button>`;

/* ---------- Leicht: Wer ist größer? ---------- */
function layoutDuo(q){
  const st=root.querySelector('#grStage'), B=st.getBoundingClientRect(), land=B.width>B.height;
  const max=Math.max(...q.ids.map(len));
  const cw=Math.floor(Math.min(land?(B.width-90)/2:B.width-40, land?(B.height-50)/1.16:(B.height-90)/2/1.16, 440));
  st.innerHTML=`<div class="gr-duo ${land?'land':''}" style="--cw:${cw}px">${q.ids.map(id=>cardHTML(id,max)).join(`<span class="gr-or hand">?</span>`)}</div>`;
  const want=q.ids.slice().sort((a,b)=>len(a)-len(b))[q.ask==='gross'?1:0];
  DW.$$('.gr-card',st).forEach(b=>b.onclick=()=>{
    if(q.done) return; const id=b.dataset.id;
    if(id===want){ q.done=true; GK.ok(b); b.classList.add('gr-right'); GK.after(650,()=>reveal(q)); }
    else { q.tries++; S.miss++; GK.no(b,`Hm, schau mal genau. ${Der(id)} ${ist(id)} ${sayM(len(id))} lang.`); showBars(st); }
  });
  GK.idle.set(()=>DW.$$('.gr-card',st).forEach(GK.pulse),()=>DW.say(q.ask==='gross'?'Welches Tier ist länger – von der Nase bis zur Schwanzspitze?':'Welches Tier ist kürzer?'));
}
function showBars(st){ st.classList.add('gr-bars'); DW.sfx('whoosh'); }

/* ---------- Mittel/Schwer: Größen-Treppe ---------- */
function layoutStairs(q){
  const st=root.querySelector('#grStage'), B=st.getBoundingClientRect(), n=q.ids.length, gap=n>4?6:12;
  const max=Math.max(...q.ids.map(len));
  let cw=Math.min(210,(B.width-(B.width<500?22:44)-(n-1)*gap)/n);
  const need=w=>w*1.12*2+Math.min(w*.9,B.height*.2)+70;
  while(cw>58&&need(cw)>B.height) cw-=4;
  cw=Math.floor(cw); const ch=Math.round(cw*1.12), stepMax=Math.round(Math.min(cw*.9,B.height*.2));
  const s0=Math.max(16,Math.round(stepMax*.28)), steps=[...Array(n)].map((_,i)=>Math.round(s0+(stepMax-s0)*(q.dir==='up'?i:(n-1-i))/(n-1)));
  st.innerHTML=`<div class="gr-play" style="--cw:${cw}px;--ch:${ch}px;--gap:${gap}px">
    <div class="gr-stairs ${q.dir}">
      ${steps.map((h,i)=>`<div class="gr-slot" data-s="${i}"><div class="gr-hole"></div><div class="gr-step" style="height:${h}px"><span>${GK.dots(q.dir==='up'?i+1:n-i,'stern')}</span></div></div>`).join('')}
    </div>
    <div class="gr-bench" id="grBench">${q.ids.map(id=>cardHTML(id,max)).join('')}</div></div>`;
  const bench=st.querySelector('#grBench'), slots=DW.$$('.gr-slot',st);
  const holeOf=s=>s.querySelector('.gr-hole');
  const place=(card,slot)=>{
    const h=holeOf(slot), old=h.querySelector('.gr-card'), from=card.parentElement;
    if(old&&old!==card){ if(from.classList.contains('gr-hole')) from.appendChild(old); else bench.appendChild(old); }
    h.appendChild(card); card.classList.remove('gr-bad2'); DW.sfx('clink'); bump(card); checkFull(q,st);
  };
  const toBench=card=>{ bench.appendChild(card); DW.sfx('pop'); bump(card); };
  DW.$$('.gr-card',st).forEach(card=>{
    let rects=null;   // Trefferflächen der Stufen: einmal beim Start des Zuges messen (nicht bei jedem pointermove)
    DW.drag(card,{ghost:()=>card.outerHTML.replace('<button ',`<button style="--cw:${card.offsetWidth}px" `),   // die Kopie hängt am <body>: Kartenbreite mitgeben (Schriftgröße)
      onStart:()=>{ rects=slots.map(s=>s.getBoundingClientRect()); },
      onTap:()=>{ if(q.done||card.classList.contains('gr-lock')) return; DW.say(nm(card.dataset.id));
        if(card.parentElement.classList.contains('gr-hole')) toBench(card);
        else { const free=slots.find(s=>!holeOf(s).querySelector('.gr-card')); if(free) place(card,free); } },
      onMove:(x,y)=>{ if(!rects) rects=slots.map(s=>s.getBoundingClientRect()); slots.forEach((s,i)=>{ const r=rects[i]; s.classList.toggle('gr-over',x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom); }); },
      onCancel:()=>slots.forEach(s=>s.classList.remove('gr-over')),
      onDrop:(x,y)=>{ slots.forEach(s=>s.classList.remove('gr-over'));
        if(q.done||card.classList.contains('gr-lock')) return false;
        const s=slots.find(s=>DW.hit(x,y,s)); if(s){ const o=holeOf(s).querySelector('.gr-card'); if(o&&o.classList.contains('gr-lock')) return false; place(card,s); return true; }
        if(DW.hit(x,y,bench)&&card.parentElement.classList.contains('gr-hole')){ toBench(card); return true; }
        return false; }});
  });
  GK.idle.set(()=>{ const c=bench.querySelector('.gr-card'); if(c) GK.pulse(c); const h=slots.find(s=>!holeOf(s).querySelector('.gr-card')); if(h) GK.pulse(holeOf(h)); },
    ()=>DW.say(q.dir==='up'?'Such zuerst das kleinste Tier. Es kommt auf die unterste Stufe.':'Such zuerst das größte Tier. Es kommt auf die hohe Stufe links.'));
}
function bump(el){ el.classList.remove('gr-bump'); void el.offsetWidth; el.classList.add('gr-bump'); }
function wantOrder(q){ const s=q.ids.slice().sort((a,b)=>len(a)-len(b)); return q.dir==='up'?s:s.reverse(); }
function checkFull(q,st){
  const read=()=>DW.$$('.gr-slot',st).map(s=>{const c=s.querySelector('.gr-card');return c&&c.dataset.id;});
  if(read().some(x=>!x)) return;
  const tok=q.chk=(q.chk||0)+1;
  GK.after(450,()=>{
    // in der Zwischenzeit umgestellt? Dann erst beim nächsten Vollwerden prüfen
    if(q.done||q.chk!==tok||!st.isConnected) return;
    const slots=DW.$$('.gr-slot',st), got=read(); if(got.some(x=>!x)) return;
    const want=wantOrder(q);
    const bad=slots.filter((s,i)=>got[i]!==want[i]);
    slots.forEach((s,i)=>{ if(got[i]===want[i]) s.querySelector('.gr-card').classList.add('gr-lock'); });
    if(!bad.length){ q.done=true; GK.ok(st.querySelector('.gr-stairs')); DW.$$('.gr-card',st).forEach((c,i)=>GK.after(i*110,()=>bump(c))); GK.after(900,()=>reveal(q)); return; }
    q.tries++; S.miss++;
    DW.sfx('no');
    const bench=st.querySelector('#grBench');
    bad.forEach(s=>{ const c=s.querySelector('.gr-card'); c.classList.add('gr-bad2'); GK.after(700,()=>{ if(c.parentElement&&c.parentElement.classList.contains('gr-hole')&&!c.classList.contains('gr-lock')) bench.appendChild(c); c.classList.remove('gr-bad2'); bump(c); }); });
    const good=slots.length-bad.length;
    DW.say(good?`Fast! ${good===1?'Ein Tier steht':NUMW[good][0].toUpperCase()+NUMW[good].slice(1)+' Tiere stehen'} schon richtig. Schau aufs Maßband!`:'Hm, noch nicht. Schau aufs Maßband unter den Bildern!');
    showBars(st);
    if(q.tries>=2) GK.after(1500,()=>{ const i=slots.findIndex(s=>!s.querySelector('.gr-card')); if(i<0) return;
      GK.pulse(slots[i].querySelector('.gr-hole')); GK.pulse(st.querySelector(`#grBench .gr-card[data-id="${want[i]}"]`)); });
  });
}
/* ---------- Auflösung im echten Maßstab ---------- */
function reveal(q){
  GK.idle.stop();
  const ids=lv===1?q.ids.slice().sort((a,b)=>len(a)-len(b)):wantOrder(q);
  const st=root.querySelector('#grStage'); if(!st) return;
  st.innerHTML=`<div class="gr-scale pop"><div class="gr-meadow" id="grMeadow"><div class="gr-sky"></div><div class="gr-ground"></div>
    <div class="gr-row">${ids.map(id=>`<div class="gr-anim ${DATA.habitat(id)==='wasser'||id==='seekuh'?'sea':''}" data-id="${id}"><img src="${scaleSrc(id)}" alt="${nm(id)}"><span class="gr-lab"><b>${nm(id)}</b><em>${fmtM(len(id))}</em></span></div>`).join('')}</div></div>
    <div class="gr-foot"><button class="ibtn big gr-hear" aria-label="Nochmal hören">${ART.icon('lautsprecher')}</button>
    <button class="btn big go gr-next">${ART.icon('pfeil_r',36)}Weiter</button></div></div>`;
  const M=st.querySelector('#grMeadow');
  const box=st.querySelector('.gr-scale');
  const fit=()=>{ M.style.height=''; const W=M.clientWidth*.94-ids.length*10, avail=box.clientHeight-86, H=Math.min(avail-110,avail*.72); const sum=ids.reduce((a,id)=>a+len(id),0);
    let ppm=W/sum; ids.forEach(id=>{ ppm=Math.min(ppm,H/(len(id)*ratio(id))); });
    const top=Math.max(...ids.map(id=>len(id)*ratio(id)*ppm)); M.style.height=Math.min(avail,top+150)+'px';
    DW.$$('.gr-anim',M).forEach(a=>{ const w=Math.max(6,len(a.dataset.id)*ppm); a.style.setProperty('--w',w+'px'); a.classList.toggle('tiny',w<34); }); };
  fit(); revFit=()=>{ if(M.isConnected) fit(); };
  DW.$$('.gr-anim',M).forEach((a,i)=>GK.after(200+i*380,()=>{a.classList.add('grow');DW.sfx('whoosh');}));
  ids.forEach(id=>{ if(!isPet(id)&&DATA.animal(id)) DW.discover(id,true); });
  const txt=explain(ids, q.tries===0);
  DW.say(txt);
  st.querySelector('.gr-hear').onclick=()=>DW.say(explain(ids,false));
  st.querySelector('.gr-next').onclick=()=>{DW.sfx('tap');S.i++;next(); GK.shield(root,450); };   /* Doppeltipp auf „Weiter“ traf sonst gleich eine Karte der nächsten Frage */
  GK.idle.set(()=>GK.pulse(st.querySelector('.gr-next')),null);
}
function times(big,small){
  const f=len(big)/len(small);
  if(f<1.4) return 'ein bisschen länger als';
  if(f<2.5) return 'ungefähr doppelt so lang wie';
  if(f<=10.5) return `ungefähr ${NUMW[Math.round(f)]} mal so lang wie`;
  return 'viel, viel länger als';
}
function explain(ids,praise){
  const small=ids.reduce((a,b)=>len(a)<len(b)?a:b), big=ids.reduce((a,b)=>len(a)>len(b)?a:b);
  const pet=ids.find(isPet), ref=pet&&pet!==big?pet:small;
  let s=praise?DW.pick(['Richtig! ','Super sortiert! ','Genau! ']):'';
  s+=`${Der(big)} ${ist(big)} ${sayM(len(big))} lang. Das ist ${times(big,ref)} ${der(ref)}.`;
  if(ids.includes('giraffe')) s+=' Die Giraffe ist sehr hoch – aber nicht so lang.';
  return s;
}
function end(){
  const stars=S.miss<=1?3:S.miss<=3?2:1;
  GK.finish(root,{id:ID,stars,
    art:`<div class="gr-iart"><span style="--w:12%">${GK.img('kaninchen')}</span><span style="--w:22%">${GK.img('elefant')}</span><span style="--w:40%">${GK.img('brachiosaurus')}</span></div>`,
    say:stars===3?'Klasse! Du weißt genau, wer groß und wer klein ist!':'Toll gemacht! Groß und klein – das übst du wie ein echter Forscher.',
    again:()=>intro()});
}

/* Test-Hilfen */
if(window.DW_DEBUG) window.__grossWin=()=>{ if(!S) return; const q=S.qs[S.i]; if(!q) return; const nx=root.querySelector('.gr-next'); if(nx){nx.click();return 'next';}
  if(lv===1){ const want=q.ids.slice().sort((a,b)=>len(a)-len(b))[q.ask==='gross'?1:0]; root.querySelector(`.gr-card[data-id="${want}"]`).click(); return 'duo'; }
  const w=wantOrder(q), slots=DW.$$('.gr-slot',root), bench=root.querySelector('#grBench');
  DW.$$('.gr-hole .gr-card:not(.gr-lock)',root).forEach(c=>bench.appendChild(c));
  w.forEach((id,i)=>{ const c=root.querySelector(`.gr-card[data-id="${id}"]`); if(!c.classList.contains('gr-lock')) slots[i].querySelector('.gr-hole').appendChild(c); });
  checkFull(q,root.querySelector('#grStage')); return 'stairs'; };
if(window.DW_DEBUG) window.__grossWrong=()=>{ const q=S.qs[S.i];
  if(lv===1){ const w=q.ids.slice().sort((a,b)=>len(a)-len(b))[q.ask==='gross'?0:1]; root.querySelector(`.gr-card[data-id="${w}"]`).click(); return; }
  const w=wantOrder(q).slice().reverse(), slots=DW.$$('.gr-slot',root);
  w.forEach((id,i)=>slots[i].querySelector('.gr-hole').appendChild(root.querySelector(`.gr-card[data-id="${id}"]`)));
  checkFull(q,root.querySelector('#grStage')); };
DW.stations[ID]={title:'Groß oder klein?',mount,unmount(){S=null; revFit=null; clearTimeout(rzT);}};
})();
