/* =====================================================================
   DINO-INSELWELT · GAME 11 „Wie groß war der Dino?“
   Zwei Runden-Arten im Wechsel:
   • „Wer war größer?“ – gleich große Bilder, das Kind rät / sortiert.
     Danach zeigt die Messlinie die echte Länge im Maßstab (mit Kind).
   • „Leg Busse / Autos / Kinder hin!“ – der Dino steht im Maßstab auf der
     Wiese, das Kind legt so lange Vergleichsdinge darunter, bis sie so lang
     sind wie der Dino. Längen aus DATA.lenM (Nase bis Schwanzspitze).
   Leicht: 2 sehr verschiedene Dinos; wenige Dinge zum Legen.
   Mittel: 3 Dinos der Größe nach ordnen.
   Schwer: 4 Dinos mit ähnlicher Größe ordnen; mehr Dinge zählen.
   ===================================================================== */
(function(){
"use strict";
const ID='wiegross';

/* ---------- Spieldaten: Vergleichsdinge (Länge in Metern) ---------- */
const WI_REFS={
  bus:{m:12,n:['ein Bus','Busse'],box:'3 15 58 38'},
  auto:{m:4.5,n:['ein Auto','Autos'],box:'5 19 58 34'},
  kind:{m:1.2,n:['ein Kind','Kinder'],box:'7 -48 53 32',rot:true},
};
const KID_H=1.2; // ein Kindergartenkind ist etwa 1,2 m groß
const EASY=['trex','triceratops','brachiosaurus','stegosaurus','velociraptor','diplodocus','ankylosaurus','spinosaurus','compsognathus','parasaurolophus','argentinosaurus','protoceratops'];
const PLAN={1:['cmp','lay','cmp','lay'],2:['cmp','lay','cmp','lay'],3:['cmp','lay','cmp','lay']};
const NUM=['null','eins','zwei','drei','vier','fünf','sechs','sieben','acht'];
const fmtM=m=>(m<1?Math.round(m*100)+' cm':String(m).replace('.',',')+' m');

let UID=1400;
function refSVG(k){
  const r=WI_REFS[k], u=++UID, body=ART.ICONS[k];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r.box}"><defs>${ART.filterDef(u,true)}</defs><g filter="url(#w${u})">${r.rot?`<g transform="rotate(-90)">${body}</g>`:body}</g></svg>`;
}
const refURL={}; const refImg=k=>refURL[k]||(refURL[k]=DW.svgURL(refSVG(k)));
function kidSVG(){ const u=++UID; return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="16 7 32 53"><defs>${ART.filterDef(u,true)}</defs><g filter="url(#w${u})">${ART.ICONS.kind}</g></svg>`; }
const KID=DW.svgURL(kidSVG());
// Bildbreite eines Tiers ≈ Körperlänge; Seitenverhältnis aus der Zeichnung
const aspect={}; function ratio(id){ if(aspect[id]) return aspect[id]; const s=ART.animal(DATA.animal(id).art,{shadow:false,pad:0}); const m=s.match(/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/); return aspect[id]=m?(+m[4])/(+m[3]):.5; }
const imgSrc=id=>DW.animalImg(id,{shadow:false,pad:0}).match(/src="([^"]+)"/)[1];

let root,lv=1,S=null;
const nm=id=>DATA.nameOf(id), len=id=>DATA.lenM(id);
function mount(r){root=r;intro();}
function intro(){
  GK.intro(root,{id:ID,art:`<div class="ga-art"><img src="${KID}" style="flex:.15 1 0;height:30%" alt="">${GK.img('brachiosaurus')}</div>`,title:'Wie groß war der Dino?',
    say:'Wie groß waren die Dinosaurier wirklich? Komm, wir messen nach! Mit Kindern, Autos und Bussen.',onStart:l=>{lv=l;S={r:0,miss:0,used:[]};next();}});
}
// Leicht: bekannte Dinos plus alle mit sehr typischer Gestalt (Langhals, Horn, Platten, Panzer, Kamm)
function easyOk(id){ if(EASY.includes(id)) return true; const sp=ART.SPECIES[ART.resolve(DATA.animal(id).art)]||{}; return ['sauropod','ceratops','stego','ankylo'].includes(sp.plan)||(sp.plan==='ornitho'&&!!sp.crest); }
function pool(){ return GK.dinos().filter(a=>!a.sea).map(a=>a.id).filter(id=>len(id)&&(lv>1||easyOk(id))); }
// „Wer war größer?“: alle Landtiere mit Länge (auch Urzeit-Säuger, Echsen …); Leicht: typische Gestalten + bekannte Eiszeit-/Urzeit-Stars
const WI_EASY_X=['mammut','smilodon','dimetrodon','titanoboa','wollnashorn','megaloceros','paraceratherium','arthropleura'];
function poolCmp(){ return GK.pool(a=>!a.sea&&DATA.habitat(a.id)==='land'&&len(a.id)).map(a=>a.id).filter(id=>lv>1?true:(DATA.isDino(id)?easyOk(id):WI_EASY_X.includes(id))); }
function next(){ if(S.r>=PLAN[lv].length) return end(); S.t0=performance.now(); (PLAN[lv][S.r]==='cmp'?compare:lay)(); }
/* Doppeltipp auf „Weiter“: der zweite Tipp darf in der neuen Runde nicht schon als Antwort zählen */
const tooSoon=()=>!!S&&performance.now()-(S.t0||0)<450;
function shell(inner,prompt){
  root.innerHTML=`<div class="wi fill"><div class="wi-top">${GK.progress(S.r,PLAN[lv].length)}<p class="wi-q hand">${prompt}</p></div>${inner}</div>`;
}

/* ---------------- „Wer war größer?“ ---------------- */
function pickCompare(){
  const P=poolCmp(); const n=lv===1?2:lv===2?3:4;
  for(let t=0;t<400;t++){
    let s=GK.sample(P,n,S.used); if(s.length<n) s=GK.sample(P,n);
    const L=s.map(len).sort((a,b)=>a-b); let ok=true;
    for(let i=1;i<L.length;i++){ const r=L[i]/L[i-1];
      if(lv===1&&r<3) ok=false; if(lv===2&&r<1.4) ok=false; }
    if(L[L.length-1]/L[0]>(lv===1?25:10)) ok=false; for(let i=1;i<L.length;i++){ const r=L[i]/L[i-1]; if(lv===3&&(L[i]-L[i-1]<1||r>2.2)) ok=false; }
    if(ok) return s;
  }
  return GK.sample(P,n);
}
function compare(){
  const ids=pickCompare(); S.used.push(...ids);
  const order=ids.slice().sort((a,b)=>len(a)-len(b));
  const sortMode=ids.length>2;
  S.c={ids,order,k:0};
  shell(`<div class="wi-cards n${ids.length}">${ids.map(id=>`<button class="gk-choice wi-card" data-id="${id}"><span class="wi-badge"></span>${GK.img(id)}<b>${nm(id)}</b></button>`).join('')}</div>`,
    sortMode?'Vom kleinsten zum größten!':'Wer war größer?');
  DW.say(sortMode?(ids.every(DATA.isDino)?'Welcher Dino war am kleinsten? ':'Welches Tier war am kleinsten? ')+'Tippe sie der Reihe nach an: vom kleinsten bis zum größten. Von der Nase bis zur Schwanzspitze!':
    `Wer war größer: ${nm(ids[0])} oder ${nm(ids[1])}? Von der Nase bis zur Schwanzspitze!`);
  DW.$$('.wi-card',root).forEach(b=>b.onclick=()=>{ if(tooSoon()) return; pickCard(b,sortMode); });
  GK.idle.set(()=>DW.$$('.wi-card:not(.done)',root).forEach(b=>GK.pulse(b)),()=>{ const d=ids.every(DATA.isDino); DW.say(sortMode?(d?'Such zuerst den kleinsten Dino.':'Such zuerst das kleinste Tier.'):(d?'Tippe auf den Dino, der größer war.':'Tippe auf das Tier, das größer war.')); });
  if(window.DW_DEBUG) window.__wiegross={S,solve:()=>{ const want=sortMode?S.c.order.slice(S.c.k):[S.c.order[S.c.order.length-1]]; want.forEach(id=>pickCard(root.querySelector(`.wi-card[data-id="${id}"]`),sortMode)); return want; },
    wrong:()=>{ const want=sortMode?S.c.order[S.c.k]:S.c.order[S.c.order.length-1]; const b=DW.$$('.wi-card:not(.done)',root).find(x=>x.dataset.id!==want); b&&pickCard(b,sortMode); return b&&b.dataset.id; }};
}
function pickCard(b,sortMode){
  if(!S.c||b.classList.contains('done')||S.c.fin) return;
  const id=b.dataset.id, want=sortMode?S.c.order[S.c.k]:S.c.order[S.c.order.length-1];
  if(id!==want){ const now=performance.now(); if(now-(b._no||0)<700) return; b._no=now;   // Doppeltipp auf dieselbe falsche Karte zählt nur einmal
    S.miss++; GK.no(b);
    DW.say(sortMode?DW.pick(['Hm, noch nicht. Es gibt einen, der noch kleiner war.','Fast! Schau noch mal: Wer war kleiner?']):'Hm, noch nicht. Denk an den langen Hals und den Schwanz!'); return; }
  GK.ok(b); b.classList.add('done'); S.c.k++;
  if(sortMode){ b.querySelector('.wi-badge').textContent=S.c.k; DW.say(nm(id)); }
  if(!sortMode||S.c.k>=S.c.order.length){ S.c.fin=true; GK.after(700,revealCompare); }
}
function revealCompare(){
  const ids=S.c.order;
  shell(`<div class="wi-meadow wi-line" id="wiLanes"><div class="wi-sky"></div><div class="wi-ground"></div>
    <div class="wi-side"><img class="wi-kid" src="${KID}" alt="Kind">${ids.map((id,i)=>`<div class="wi-lane"><img class="wi-dino" src="${imgSrc(id)}" alt="${nm(id)}">
    <div class="wi-bar"><span></span><b>${fmtM(len(id))}</b></div></div>`).join('')}</div></div>
    <div class="wi-foot"><button class="btn big go" id="wiNext">${ART.icon('pfeil_r',36)}Weiter</button></div>`,'Die Messlinie zeigt es!');
  const M=root.querySelector('#wiLanes');
  const fit=()=>{ if(!M.isConnected) return;   /* Zuhörer einer alten Runde (bleibt bis zum Schließen angemeldet) */
    const CW=M.clientWidth, H=M.clientHeight;
    // Hochformat (Handy/Tablet): Tiere untereinander, jedes mit eigener Messlinie – sonst werden alle winzig
    const stack=H>CW*.9; M.classList.toggle('stack',stack);
    let ppm;
    if(stack){ const W=CW*.92-90, rowH=(H*.9-30)/ids.length-46; ppm=W/Math.max(...ids.map(len)); ids.forEach(id=>{ ppm=Math.min(ppm,rowH/(len(id)*ratio(id))); }); }
    else { const W=CW*.9; const sum=ids.reduce((a,id)=>a+len(id),0)+KID_H*1.2+ids.length*.6;
      ppm=W/sum; ids.forEach(id=>{ ppm=Math.min(ppm,H*.6/(len(id)*ratio(id))); }); }
    M.querySelector('.wi-kid').style.height=Math.max(12,KID_H*ppm)+'px';
    DW.$$('.wi-lane',M).forEach((l,i)=>{ const w=len(ids[i])*ppm; l.querySelector('.wi-dino').style.width=w+'px'; l.style.setProperty('--w',w+'px');
      l.querySelector('.wi-bar b').style.top=stack?'':(16+i*26)+'px'; }); };
  fit(); GK.listen(window,'resize',fit);
  DW.$$('.wi-lane',M).forEach((l,i)=>GK.after(250+i*450,()=>{l.classList.add('grow');DW.sfx('whoosh');}));
  const big=ids[ids.length-1], small=ids[0], f=Math.round(len(big)/len(small));
  const txt=`Richtig! ${nm(big)} war ${fmtM(len(big)).replace(' m',' Meter')} lang. ${f>=2?`Das ist ${f>8?'viel, viel länger als':'ungefähr '+(NUM[f]||f)+' mal so lang wie'} ${nm(small)}.`:''} Siehst du das kleine Kind? So groß bist du!`;
  DW.say(txt); ids.forEach(id=>DW.discover(id,true));
  root.querySelector('#wiNext').onclick=()=>{DW.sfx('tap');S.r++;next();};
  GK.idle.set(()=>GK.pulse(root.querySelector('#wiNext')),null);
  if(window.DW_DEBUG) window.__wiegross={S,solve:()=>root.querySelector('#wiNext').click()};
}

/* ---------------- „Leg Busse hin!“ ---------------- */
function unitFor(id){
  const L=len(id), order=lv===3?['kind','auto','bus']:['bus','auto','kind'], max=lv===1?4:lv===2?5:7;
  const cand=order.map(k=>{ const c=Math.max(1,Math.round(L/WI_REFS[k].m)); return {k,c,sc:Math.abs(L/(c*WI_REFS[k].m)-1)}; }).filter(o=>o.c>=2&&o.c<=max);
  const good=cand.find(o=>o.sc<=.2)||cand.sort((x,y)=>x.sc-y.sc)[0];
  return good?[good.k,good.c]:['kind',Math.max(1,Math.round(L/1.2))];
}
function lay(){
  const P=pool().filter(id=>len(id)>=2&&!S.used.includes(id)&&unitFor(id)[1]<=(lv===1?4:7));
  const id=DW.pick(P.length?P:pool().filter(x=>len(x)>=2)); S.used.push(id);
  const [k,cnt]=unitFor(id), R=WI_REFS[k];
  S.l={id,k,cnt,placed:0};
  shell(`<div class="wi-meadow" id="wiM"><div class="wi-sky"></div><div class="wi-ground"></div>
      <div class="wi-show"><img class="wi-kid" src="${KID}" alt="Kind"><img class="wi-dino" src="${imgSrc(id)}" alt="${nm(id)}"></div>
      <div class="wi-row" id="wiRow"></div><div class="wi-tape" id="wiTape"><span></span></div></div>
    <div class="wi-foot"><button class="wi-src" id="wiSrc" aria-label="${R.n[0]}"><img src="${refImg(k)}" alt=""><b>+</b></button><div class="wi-count" id="wiCount"></div></div>`,
    `Wie viele ${R.n[1]} lang war ${nm(id)}?`);
  const M=root.querySelector('#wiM');
  const fit=()=>{ if(!M.isConnected||!S||!S.l) return;   /* alte Runde: sonst Fehler „S.l ist null“ beim Drehen/Größe ändern */
    const H=M.clientHeight; const tot=Math.max(len(id),cnt*R.m);
    // Platz links für das Vergleichskind lassen (sonst wird es am Rand abgeschnitten)
    const kidW=r=>KID_H*r*32/53+14;
    let ppm=M.clientWidth*.86/tot; ppm=Math.min(ppm,(H*.5)/(len(id)*ratio(id))); ppm=Math.min(ppm,(M.clientWidth*.94-kidW(ppm))/tot); S.l.ppm=ppm;
    M.style.setProperty('--x0',Math.max(kidW(ppm),(M.clientWidth-tot*ppm)/2)+'px');
    M.querySelector('.wi-dino').style.width=len(id)*ppm+'px'; M.querySelector('.wi-kid').style.height=KID_H*ppm+'px';
    DW.$$('.wi-unit',M).forEach(u=>{u.style.width=R.m*ppm+'px';});
    M.querySelector('#wiTape').style.setProperty('--w',len(id)*ppm+'px'); };
  fit(); GK.listen(window,'resize',fit);
  GK.after(100,()=>{M.classList.add('in');DW.sfx('thud');});
  const src=root.querySelector('#wiSrc');
  DW.drag(src,{ghost:()=>`<img src="${refImg(k)}">`,onTap:()=>{ if(!tooSoon()) place(); },onDrop:(x,y)=>DW.hit(x,y,M)?(place(),true):false});
  DW.say(`Das ist ${nm(id)}. Wie lang war er? Leg ${R.n[1]} unter den Dino, bis sie genauso lang sind! Tippe auf ${k==='kind'?'das Kind':k==='bus'?'den Bus':'das Auto'}.`);
  GK.idle.set(()=>GK.pulse(src),()=>DW.say(`Tippe auf ${k==='kind'?'das Kind':k==='bus'?'den Bus':'das Auto'}. Leg noch eins dazu!`));
  if(window.DW_DEBUG) window.__wiegross={S,solve:()=>{ while(S.l&&S.l.placed<S.l.cnt&&!S.l.fin) place(); return S.l&&[S.l.id,S.l.k,S.l.cnt]; }};
}
function place(){
  const L=S.l; if(!L||L.fin) return; const R=WI_REFS[L.k];
  if(L.placed>=L.cnt){ return; }
  L.placed++; DW.sfx(L.k==='kind'?'pop':'thud');
  const row=root.querySelector('#wiRow');
  const u=DW.h(`<img class="wi-unit" src="${refImg(L.k)}" alt="" style="width:${R.m*L.ppm}px">`); row.appendChild(u);
  const c=root.querySelector('#wiCount'); c.innerHTML=[...Array(L.placed)].map((_,i)=>`<span>${i+1}</span>`).join('');
  DW.say(NUM[L.placed]||String(L.placed),{queue:false});
  if(L.placed>=L.cnt){ L.fin=true; GK.after(700,()=>{
    root.querySelector('#wiM').classList.add('measured'); DW.sfx('ok'); DW.discover(L.id,true);
    const q=len(L.id)/(L.cnt*R.m); const how=q>1.08?'etwas länger als':q<.8?'nicht ganz so lang wie':q<.93?'fast so lang wie':'so lang wie';
    const t=`${L.cnt} ${L.cnt===1?R.n[0].replace(/^ein /,''):R.n[1]}! ${nm(L.id)} war ${fmtM(len(L.id)).replace(' m',' Meter')} lang – ${how} ${L.cnt===1?R.n[0]:(NUM[L.cnt]||L.cnt)+' '+R.n[1]}.`;
    root.querySelector('.wi-q').textContent=`${nm(L.id)}: ${fmtM(len(L.id))}`;
    DW.say(t);
    const nb=DW.h(`<button class="btn big go" id="wiNext">${ART.icon('pfeil_r',36)}Weiter</button>`); root.querySelector('.wi-foot').appendChild(nb);
    nb.onclick=()=>{DW.sfx('tap');S.l=null;S.r++;next();}; GK.idle.set(()=>GK.pulse(nb),null);
    if(window.DW_DEBUG) window.__wiegross={S,solve:()=>nb.click()};
  }); }
}
function end(){
  const stars=S.miss===0?3:S.miss<=2?2:1;
  GK.finish(root,{id:ID,stars,art:`<div class="ga-art"><img src="${KID}" style="flex:.12 1 0;height:22%" alt="">${GK.img('diplodocus',{mood:'happy'})}</div>`,
    say:'Super gemessen! Der Diplodocus war so lang wie zwei Busse. Das ist über zwanzigmal so lang, wie du groß bist!',again:()=>{S={r:0,miss:0,used:[]};next();}});
}
DW.stations[ID]={title:(DATA.station(ID)||{}).n||'Wie groß war er?',mount,unmount(){S=null;delete window.__wiegross;}};
})();
