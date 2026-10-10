/* =====================================================================
   DINO-INSELWELT · Station Dino-Rennen (GAME 12)
   Dino aussuchen, im Takt tippen (oder gedrückt halten), über Hindernisse
   hüpfen, durch Blätter-Boosts sausen. Danach: Wie schnell waren sie in echt?
   Kein Game Over: Hindernisse bremsen nur kurz.
   ===================================================================== */
(function(){
"use strict";
const ID='rennen';

/* Höchstgeschwindigkeiten: grobe Schätzungen der Forschung (km/h),
   berechnet aus Beinlänge, Knochenbau und versteinerten Fußspuren. */
const RACERS_ALL=[
 {id:'gallimimus',kmh:50},{id:'struthiomimus',kmh:50},{id:'velociraptor',kmh:40},{id:'allosaurus',kmh:30},
 {id:'trex',kmh:25},{id:'triceratops',kmh:25},{id:'ankylosaurus',kmh:10},{id:'stegosaurus',kmh:7},
 /* weitere veröffentlichte Schätzungen (Computermodelle): Compsognathus ~64 km/h (Sellers & Manning 2007),
    Carnotaurus ~48–56 km/h (Mazzetta u. a. 2004), Edmontosaurus ~45 km/h (Sellers u. a. 2009),
    Argentinosaurus ~7 km/h (Sellers u. a. 2013) */
 {id:'compsognathus',kmh:60},{id:'carnotaurus',kmh:50},{id:'edmontosaurus',kmh:45},{id:'argentinosaurus',kmh:7}
].filter(r=>DATA.animal(r.id)&&ART.has(DATA.animal(r.id).art));
/* Auswahl für eine Runde: 8 Läufer, immer schnelle und langsame dabei */
let RACERS=RACERS_ALL.slice(0,8);
function drawRacers(){
  const fast=DW.shuffle(RACERS_ALL.filter(r=>r.kmh>=40)).slice(0,3), slow=DW.shuffle(RACERS_ALL.filter(r=>r.kmh<=10)).slice(0,2);
  const rest=DW.shuffle(RACERS_ALL.filter(r=>!fast.includes(r)&&!slow.includes(r)));
  RACERS=[...fast,...slow,...rest].slice(0,8).sort((a,b)=>RACERS_ALL.indexOf(a)-RACERS_ALL.indexOf(b));
}
/* Bildvergleich für die Geschwindigkeit */
const CMP=[{max:8,icon:'mensch',t:'so schnell wie ein Mensch, der gemütlich joggt'},
 {max:15,icon:'kind',t:'so schnell wie ein Kind, das rennt'},
 {max:32,icon:'fahrrad',t:'so schnell wie ein Fahrrad'},
 {max:47,icon:'auto',t:'fast so schnell wie ein Auto in der Stadt'},
 {max:999,icon:'auto',t:'so schnell wie ein Auto in der Stadt'}];
const cmpOf=k=>CMP.find(c=>k<=c.max);
/* Schwierigkeit: Gegner, Tempo der Gegner, Streckenlänge (m), Hindernisse, Boost-Felder */
const LV={1:{riv:3,f:.62,len:190,obst:0,boost:5,bw:10,win:.17,beat:.5},
          2:{riv:3,f:.76,len:230,obst:4,boost:4,bw:7,win:.13,beat:.46},
          3:{riv:4,f:.87,len:270,obst:7,boost:3,bw:5,win:.1,beat:.42}};
const LANE_COL=['#c8553d','#8fbccb','#b58cbd','#7fa66a','#d9b36c'];

/* ---------- Canvas-Hilfen ---------- */
const BK=new Map();
function vbA(s){const m=/viewBox="([-\d.]+)[ ,]+([-\d.]+)[ ,]+([-\d.]+)[ ,]+([-\d.]+)"/.exec(s);return m?(+m[3])/(+m[4]):1;}
function bake(key,svg,h){const k=key+'@'+h;let e=BK.get(k);if(e)return e;e={c:null};BK.set(k,e);
  const s=typeof svg==='function'?svg():svg,a=vbA(s),im=new Image();
  im.onload=()=>{const c=document.createElement('canvas');c.height=h;c.width=Math.max(2,Math.round(h*a));const g=c.getContext('2d'),ia=im.naturalWidth/im.naturalHeight;
    /* gemalte Bilder (grafiken-neu) haben ihr eigenes Seitenverhältnis: unten mittig einpassen statt in den Rahmen der Zeichnung zu zerren */
    if(!/^data:/.test(im.src)&&ia>0&&Math.abs(ia/(c.width/c.height)-1)>.02){let w=c.width,hh=w/ia;if(hh>c.height){hh=c.height;w=hh*ia;}g.drawImage(im,(c.width-w)/2,c.height-hh,w,hh);}
    else g.drawImage(im,0,0,c.width,c.height);e.c=c;};
  im.src=DW.svgURL(s);return e;}
function spr(x,e,cx,by,h,flip){const c=e&&e.c;if(!c)return;const w=h*c.width/c.height;
  if(flip){x.save();x.translate(cx,by);x.scale(-1,1);x.drawImage(c,-w/2,-h,w,h);x.restore();}else x.drawImage(c,cx-w/2,by-h,w,h);}
function boxOf(id){const s=ART.animal(id,{shadow:false,ph:0}),m=/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/.exec(s);
  const x=+m[1],y=+m[2],w=+m[3],h=+m[4];return [x-w*.05,y-h*.12,x+w*1.05,y+h*1.02];}
function frames(id,n,h){const box=boxOf(id);return [...Array(n)].map((_,i)=>bake(`dr|${id}|${i}`,()=>ART.animal(id,{shadow:false,ph:i/n,box}),h));}
const icon=(n,h=128)=>bake('ic|'+n,()=>ART.icon(n),h);
function band(w,h,col,base,amp,f,seed,grain){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  const y=(i,a)=>{const u=i/w*Math.PI*2;return base-amp*a*(.55*Math.sin(u*f+seed)+.3*Math.sin(u*f*2+seed*1.7)+.15*Math.sin(u*f*5+seed*.3));};
  x.fillStyle=col;for(let k=0;k<3;k++){x.globalAlpha=.42;x.beginPath();x.moveTo(0,h);for(let i=0;i<=w;i+=6)x.lineTo(i,y(i,1-k*.06)+k*7);x.lineTo(w,h);x.closePath();x.fill();}
  x.globalAlpha=.3;x.strokeStyle=ART.shade(col,.7);x.lineWidth=2.5;x.beginPath();for(let i=0;i<=w;i+=6)x.lineTo(i,y(i,1));x.stroke();
  x.globalAlpha=1;x.globalCompositeOperation='source-atop';for(let i=0;i<(grain||900);i++){x.fillStyle=Math.random()<.5?'rgba(60,40,20,.08)':'rgba(255,255,255,.1)';x.fillRect(Math.random()*w,Math.random()*h,2+Math.random()*3,2+Math.random()*3);}
  return c;}
/* Papier-Korn: einmal als halbdurchsichtige Kachel berechnet, liegt als ruhende Ebene (.gc-paper) ÜBER dem Canvas.
   Vorher wurde es bei JEDEM Bild per „multiply“ über die ganze Fläche gerechnet – über die Hälfte der Rechenzeit pro Bild. */
const gcPaper=()=>window.__gcPaper||(window.__gcPaper=new Promise(res=>{const im=new Image();
  im.onload=()=>{try{const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,c.width,c.height),p=d.data;
    /* wie „multiply“ mit 45 %: das Korn als reines Abdunkeln (Faktor g, auf allen Farben gleich stark – vorher war es je nach Farbe nur
       5–75 % so kräftig), darunter der warme Grundton des Papiers (3,9 % Deckung). Beides in EINER Kachel verrechnet. */
    for(let i=0;i<p.length;i+=4){const g=Math.min(1,(1+.00179*(p[i]-247))/1.0143),A=1-g*.961,q=.039*g/A;p[i]=170*q;p[i+1]=116*q;p[i+2]=0;p[i+3]=Math.round(A*255);}x.putImageData(d,0,0);res(c.toDataURL());}catch(e){res('');}};
  im.onerror=()=>res('');im.src=DW.paperURL;}));
function paperOn(){gcPaper().then(u=>{const el=root&&root.querySelector('.gc-paper');if(el&&u)el.style.backgroundImage=`url(${u})`;});}
/* Canvas-Auflösung begrenzen: höchstens ~2,6 Mio. Bildpunkte (großes Tablet mit dpr 2 wären sonst 5,6 Mio. pro Bild) */
const dprFor=(w,h)=>Math.min(2,window.devicePixelRatio||1,Math.sqrt(2.6e6/Math.max(1,w*h)));

let root,lv=1,pick=null,G=null,stopLoop=null,cv,ctx,W=1,H=1,DPR=1;

function mount(r){ root=r;
  GK.listen(window,'keydown',e=>{ if(!G||G.state!=='race')return;
    if(e.code==='Space'||e.code==='ArrowRight'){e.preventDefault(); if(!e.repeat) tapRun();}
    if(e.code==='ArrowUp'){e.preventDefault(); jump();} });
  GK.listen(window,'resize',resize);
  intro(); }
function intro(){
  G=null;
  GK.intro(root,{id:ID,art:'<div class="gc-art">'+(GK.img('gallimimus')+GK.icon('flagge')+GK.img('stegosaurus',{flip:true}))+'</div>',title:'Dino-Rennen',
    say:'Auf die Plätze! Such dir einen Dino aus. Tippe schnell im Takt, dann rennt er los!',
    onStart:l=>{lv=l;choose();}});
}

/* ---------- Dino auswählen ---------- */
function choose(){
  G=null; if(stopLoop)stopLoop(); drawRacers();
  root.innerHTML=`<div class="dr-pick fill col"><h2 class="hand dr-h">Wer soll für dich rennen?</h2>
    <div class="dr-grid">${RACERS.map(r=>`<button class="dr-tile" data-id="${r.id}" aria-label="${GK.name(r.id)}">${GK.img(r.id)}<b>${DATA.animal(r.id).short||GK.name(r.id)}</b></button>`).join('')}</div></div>`;
  DW.$$('.dr-tile',root).forEach(b=>b.onclick=()=>{DW.sfx('pop');pick=b.dataset.id;DW.say(`${GK.name(pick)}! Auf geht's zur Rennbahn.`);race();});
  DW.say('Welcher Dino ist wohl schnell? Tippe einen an!');
  GK.idle.set(()=>GK.pulse(DW.$('.dr-tile',root)),()=>DW.say('Tippe auf einen Dino. Der rennt dann für dich.'));
}

/* ---------- Rennen ---------- */
function race(){
  GK.idle.stop(); if(stopLoop)stopLoop();
  const L=LV[lv], me=RACERS.find(r=>r.id===pick);
  const others=DW.shuffle(RACERS.filter(r=>r.id!==pick));
  // Leicht: eher gemütliche Gegner
  if(lv===1) others.sort((a,b)=>a.kmh-b.kmh+(Math.random()-.5)*30);
  const riv=others.slice(0,L.riv);
  root.innerHTML=`<div class="dr gc-wrap"><canvas class="gc-cv"></canvas><div class="gc-paper"></div>
    <button class="gc-btn dr-run" type="button" aria-label="Rennen – im Takt tippen"><span class="dr-ring"></span>${GK.icon('fussabdruck')}</button>
    ${L.obst?`<button class="gc-btn dr-jump" type="button" aria-label="Springen">${GK.icon('pfeil_r')}</button>`:''}
    <div class="dr-count hand" hidden></div></div>`;
  cv=root.querySelector('canvas'); ctx=cv.getContext('2d'); resize(); paperOn();
  const all=[me,...riv];
  // Bahnen: Spieler vorn (unterste Bahn)
  const n=all.length;
  const racers=all.map((r,i)=>{const a=DATA.animal(r.id)||{},len=DATA.lenM?DATA.lenM(r.id):parseFloat(a.len)||4;
    return {id:r.id,kmh:r.kmh,me:i===0,lane:i===0?n-1:i-1,x:0,v:0,ph:Math.random(),jump:0,stum:0,boost:0,fin:0,place:0,
      sc:DW.clamp(.58+.42*Math.sqrt(Math.min(12,len)/12),.58,1),
      vmax:i===0?13*(.92+.18*r.kmh/50):13*(.55+.45*Math.min(1,r.kmh/50))*L.f*DW.rand(.96,1.04),
      fr:frames(r.id,8,220),col:LANE_COL[i%LANE_COL.length],wob:Math.random()*6};});
  // Hindernisse (über alle Bahnen) und Boost-Felder (je Bahn)
  const obst=[],boosts=[];
  for(let k=0;k<L.obst;k++){const x=40+(k+.5)*(L.len-70)/L.obst+DW.rand(-8,8);obst.push({x,kind:DW.pick(['stein','holz','pfuetze'])});}
  for(let k=0;k<L.boost;k++){const x=25+(k+.5)*(L.len-50)/L.boost+DW.rand(-6,6);if(!obst.some(o=>Math.abs(o.x-x)<L.bw+6))boosts.push({x,w:L.bw});}
  G={state:'count',t:0,cnt:3.4,L,racers,me:racers[0],obst,boosts,effort:0,hold:false,beatT:0,lastBeat:-9,parts:[],shake:0,finT:0,place:0,
     far:band(1600,420,'#b9b3a6',260,120,2,1.3,500),mid:band(1600,420,'#9cb98a',300,90,3,4.1),crowd:GK.sample(GK.pool(a=>DATA.isDino(a.id)&&a.food==='pflanzen'&&DATA.habitat(a.id)==='land'&&!all.some(r=>r.id===a.id)).map(a=>a.id),5).map(id=>bake('drc|'+id,()=>ART.animal(id,{shadow:false,flip:true}),160)),
     ic:{stein:icon('stein'),holz:icon('holz'),farn:icon('farn'),palme:icon('palme',200),flagge:icon('flagge'),blatt:icon('blatt',64)},
     said:{},tips:0,hits:0,perfect:0,lastTap:0,ringK:-1,ringOk:null};
  const run=root.querySelector('.dr-run'),jb=root.querySelector('.dr-jump');
  const down=e=>{e.preventDefault();G.hold=true;run.classList.add('on');tapRun();};
  const up=()=>{if(G){G.hold=false;}run.classList.remove('on');};
  run.addEventListener('pointerdown',down);['pointerup','pointercancel','pointerleave'].forEach(ev=>run.addEventListener(ev,up));
  cv.addEventListener('pointerdown',e=>{e.preventDefault();tapRun();});
  if(jb) jb.addEventListener('pointerdown',e=>{e.preventDefault();jump();});
  G.run=run; G.jb=jb; G.ring=run.querySelector('.dr-ring'); G.cntEl=root.querySelector('.dr-count');
  DW.say(L.obst?'Tippe im Takt auf den Fuß! Mit dem Pfeil springst du über Steine.':'Tippe im Takt auf den Fuß. Je schöner der Takt, desto schneller!');
  if(window.DW_DEBUG) window.__rennenWin=()=>{ if(!G)return; G.me.x=G.L.len+1; };
  if(window.DW_DEBUG) window.__rennenInfo=()=>G&&{state:G.state,t:G.t,x:G.me.x,v:G.me.v,len:G.L.len,beat:G.L.beat,beatT:G.beatT,place:G.me.place,hits:G.hits,tips:G.tips,perfect:G.perfect,nextObst:(G.obst.find(o=>o.x>G.me.x)||{}).x||null,jump:G.me.jump,riv:G.racers.filter(r=>!r.me).map(r=>+r.x.toFixed(1))};
  let lastN=4;
  stopLoop=GK.loop((dt)=>{ if(!G) return false;
    if(G.state==='count'){ G.cnt-=dt; const k=Math.ceil(G.cnt-0.4);
      if(k!==lastN){lastN=k; const el=G.cntEl; el.hidden=false; el.textContent=k>0?k:'Los!'; el.classList.remove('dr-pop');void el.offsetWidth;el.classList.add('dr-pop');
        if(k>0)DW.sfx('click'); else {DW.sfx('trumpet');}}
      if(G.cnt<=0){G.state='race';G.cntEl.hidden=true;G.beatT=0;}
    } else if(G.state==='race'||G.state==='fin') step(dt);
    draw(dt); return true; });
}
function tapRun(){ if(!G||G.state!=='race') return;
  const L=G.L, ph=G.beatT%L.beat, d=Math.min(ph,L.beat-ph);
  if(d<=L.win){ G.effort=Math.min(1.25,G.effort+.3); G.me.boost=Math.max(G.me.boost,.45); G.perfect++; DW.sfx('step'); puff(G.me,'#f0c35a',5);
    if(G.perfect===4&&!G.said.beat){G.said.beat=1;DW.say('Toller Takt!');} }
  else { G.effort=Math.min(1.1,G.effort+.17); DW.sfx('step'); }
  G.tips++; G.lastTap=G.t;
}
function jump(){ if(!G||G.state!=='race') return; const m=G.me; if(m.jump>0) return; m.jump=.001; DW.sfx('jump'); }
function puff(r,c,n){for(let i=0;i<n;i++)G.parts.push({x:r.x-.6,lane:r.lane,y:-DW.rand(.2,1.2),vx:DW.rand(-4,-1),vy:DW.rand(-2,.5),l:DW.rand(.4,.8),c,s:DW.rand(3,7)});}
function step(dt){
  const g=G,L=g.L; g.t+=dt; g.beatT+=dt;
  const prevBeat=Math.floor((g.beatT-dt)/L.beat), nowBeat=Math.floor(g.beatT/L.beat); if(nowBeat!==prevBeat) g.lastBeat=g.t;
  // Einsatz: tippen treibt an, festhalten = gleichmäßiger Trab
  if(g.hold) g.effort+=(.72-g.effort)*Math.min(1,dt*3); else g.effort=Math.max(0,g.effort-.5*dt);
  g.racers.forEach(r=>{
    let target;
    if(r.me){ target=r.vmax*Math.min(1,g.effort)+(r.boost>0?3.2:0); }
    else { const ramp=Math.min(1,g.t/1.6); target=r.vmax*ramp*(1+.05*Math.sin(g.t*1.3+r.wob))+(r.boost>0?2.6:0); }
    if(r.fin) target=Math.max(2,target*.4);
    if(r.stum>0){ r.stum-=dt; target*=.35; }
    r.v+=(target-r.v)*Math.min(1,dt*(target>r.v?2.6:3.5));
    const px=r.x; r.x+=r.v*dt; r.ph=(r.ph+r.v*dt/(3.2*r.sc))%1; if(r.boost>0)r.boost-=dt;
    if(r.jump>0){ r.jump+=dt/.62; if(r.jump>=1) r.jump=0; }
    // KI springt meistens rechtzeitig
    if(!r.me&&!r.jump&&!r.fin) g.obst.forEach(o=>{ const d=o.x-r.x; if(d>0&&d<r.v*.32+.4&&!o['j'+r.lane]){ o['j'+r.lane]=1; if(Math.random()<[0,.85,.85,.9][lv]) r.jump=.001; } });
    // Hindernisse
    g.obst.forEach(o=>{ if(px<o.x&&r.x>=o.x&&!r.fin){ if(r.jump>.12&&r.jump<.9&&o.kind!=='pfuetze'||r.jump>.05&&o.kind==='pfuetze'){ if(r.me){DW.sfx('pop');} }
        else { r.stum=o.kind==='pfuetze'?.7:.9; if(r.me){ g.hits++; DW.sfx(o.kind==='pfuetze'?'dig':'bump'); g.shake=.25; puff(r,'#b9a07a',10);
          if(g.hits===1||Math.random()<.4) DW.say(DW.pick(o.kind==='pfuetze'?['Platsch! Weiter geht’s!','Matsch! Nicht schlimm.']:['Hoppla! Weiter geht’s!','Uff! Nächstes Mal hüpfen!','Stolper – und weiter!'])); } } } });
    // Boost-Felder
    g.boosts.forEach(b=>{ if(px<b.x-b.w/2&&r.x>=b.x-b.w/2){ r.boost=1.3; if(r.me){DW.sfx('whoosh');puff(r,'#9fd07a',12); if(!g.said.boost){g.said.boost=1;DW.say('Blätter-Boost! Wusch!');}} } });
    if(!r.fin&&r.x>=L.len){ r.fin=g.t; r.place=++g.place; if(r.me) finishMe(); }
    if(r.me&&Math.random()<dt*r.v*.6) puff(r,'rgba(190,160,110,.7)',1);
  });
  // Hinweis vor Hindernis: Sprungknopf leuchtet
  if(g.jb){ const nx=g.obst.find(o=>o.x>g.me.x); const near=nx&&nx.x-g.me.x<Math.max(6,g.me.v*.8); g.jb.classList.toggle('dr-hot',!!near);
    if(near&&!g.said.jump){g.said.jump=1;DW.say('Achtung, Stein! Tippe auf den Pfeil zum Springen!');} }
  if(g.t>5&&g.tips<2&&!g.said.idle){ g.said.idle=1; g.lastTap=g.t; GK.pulse(g.run); DW.say('Tippe ganz oft auf den Fuß!'); }
  /* steht der Dino länger still (kein Tippen, kein Halten), kommt die Hilfe wieder – sonst bliebe das Rennen stumm stehen */
  if(g.state==='race'&&!g.hold&&g.t-g.lastTap>9&&g.me.v<1.5){ g.lastTap=g.t+4; GK.pulse(g.run); DW.say('Tippe ganz oft auf den Fuß!'); }
  g.parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=3*dt;p.l-=dt;}); g.parts=g.parts.filter(p=>p.l>0);
  if(g.shake>0)g.shake-=dt;
  if(g.state==='fin'){ g.finT+=dt; if(g.finT>2.6||g.racers.every(r=>r.fin)&&g.finT>1.4) results(); }
  // Takt-Ring am Knopf
  const u=(g.beatT%L.beat)/L.beat, near=Math.min(u,1-u)*L.beat<=L.win;
  const rk=Math.round(u*40); if(rk!==g.ringK){ g.ringK=rk; g.ring.style.transform=`scale(${(1.55-u*.55).toFixed(3)})`; g.ring.style.opacity=(0.35+u*.65).toFixed(2); }
  if(near!==g.ringOk){ g.ringOk=near; g.ring.classList.toggle('ok',near); }
}
function finishMe(){ const g=G; g.state='fin'; g.finT=0; DW.sfx('win'); DW.confetti(40);
  DW.say(g.me.place===1?'Erster! Hurra!':g.me.place===2?'Zweiter! Super gerannt!':'Im Ziel! Toll gekämpft!'); }

/* ---------- Zeichnen ---------- */
function resize(){ if(!cv||!cv.isConnected||!cv.clientWidth||!cv.clientHeight) return; W=cv.clientWidth; H=cv.clientHeight; DPR=dprFor(W,H);
  const w=Math.round(W*DPR), h=Math.round(H*DPR); if(cv.width!==w||cv.height!==h){ cv.width=w; cv.height=h; } }
function draw(){
  const g=G,x=ctx; if(!g) return; x.setTransform(DPR,0,0,DPR,0,0);
  const n=g.racers.length, portrait=H>W*1.1;
  const top=H*(portrait?.32:.46), bot=H*(portrait?.8:.84), laneH=(bot-top)/n;
  const S=Math.min(W*(portrait?.3:.17),laneH*(portrait?1.6:2.3),190); // Sprite-Höhe für Maßstab 1
  const ppm=S/3.1, camX=g.me.x-(W*(portrait?.36:.3))/ppm;
  const sx=v=>(v-camX)*ppm;
  let shx=g.shake>0?Math.sin(g.t*70)*3*g.shake/.25:0; x.save(); x.translate(shx,0);
  // Himmel
  // eigene Landschaft: grafiken-neu/landschaften/rennen_… (sonst tal_…) himmel|hinten|mitte; Rennbahn nur rennen_boden (sonst Zeichnung)
  const A=window.ASSETS, LY=k=>A&&A.layer?A.layer(['rennen','tal'],k):null, ls=LY('himmel'), lf=LY('hinten'), lm=LY('mitte'), lb=A&&A.layer?A.layer('rennen','boden'):null;
  if(ls) A.drawCover(x,ls,-10,0,W+20,top+4);
  else{ const sk=x.createLinearGradient(0,0,0,top);sk.addColorStop(0,'#bcdbe3');sk.addColorStop(1,'#f4e7c8');x.fillStyle=sk;x.fillRect(-10,0,W+20,top+4);
  x.fillStyle='rgba(255,240,200,.75)';x.beginPath();x.arc(W*.82,top*.28,Math.min(46,W*.08),0,7);x.fill(); }
  // Wolken
  x.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<4;i++){const cx=((i*420-camX*ppm*.05)%(W+400)+W+400)%(W+400)-200,cy=top*(.15+.12*(i%2));x.beginPath();x.ellipse(cx,cy,70,18,0,0,7);x.ellipse(cx+40,cy-10,40,16,0,0,7);x.fill();}
  const par=(img,f,y,h)=>{const w=img.width*h/img.height,off=-((camX*ppm*f)%w+w)%w;for(let px=off;px<W;px+=w)x.drawImage(img,px,y,w,h);};
  if(lf) A.drawLayer(x,lf,camX*ppm*.12,top-H*.3,H*.36,W+20,-10); else par(g.far,.12,top-H*.3,H*.36);
  // Zuschauer-Dinos am Hügel
  g.crowd.forEach((e,i)=>{const gap=W*.9+i*120,off=(((-(camX*ppm*.3)+i*330)%gap)+gap)%gap-150;spr(x,e,off,top-H*.05+i%2*6,S*(.36+(i===0||i===3?.18:0)));});
  if(lm) A.drawLayer(x,lm,camX*ppm*.3,top-H*.16,H*.2,W+20,-10); else par(g.mid,.3,top-H*.16,H*.2);
  // Palmen
  for(let i=-1;i<W/260+2;i++){const wx=Math.floor(camX*ppm*.55/260)+i,px=wx*260-camX*ppm*.55+((wx*97)%80);spr(x,g.ic.palme,px,top+4,S*1.1*(.8+((wx*37)%10)/25));}
  // Bahn
  if(lb) A.drawLayer(x,lb,camX*ppm,top-6,bot-top+6,W+20,-10);
  else{ const tg=x.createLinearGradient(0,top,0,bot);tg.addColorStop(0,'#d9bf8c');tg.addColorStop(1,'#c9a570');x.fillStyle=tg;x.fillRect(-10,top,W+20,bot-top);
  x.fillStyle='#8fb06f';x.beginPath();x.moveTo(-10,top+6);for(let px=-10;px<=W+20;px+=16)x.lineTo(px,top-3+Math.sin((px+camX*ppm)*.07)*3);x.lineTo(W+20,top+6);x.fill(); }
  // Bahnlinien
  x.strokeStyle='rgba(255,250,235,.75)';x.lineWidth=3;x.setLineDash([22,16]);x.lineDashOffset=camX*ppm;
  for(let i=1;i<n;i++){const y=top+i*laneH;x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke();}x.setLineDash([]);
  // Spur des Spielers leicht betont
  const my=top+g.me.lane*laneH; x.fillStyle='rgba(240,195,90,.18)';x.fillRect(0,my,W,laneH);
  // Bodenkrümel
  x.fillStyle='rgba(90,60,30,.12)';for(let i=0;i<40;i++){const wx=(i*53.3)%(W+60),px=((wx-camX*ppm)%(W+60)+W+60)%(W+60)-30;x.fillRect(px,top+((i*37)%100)/100*(bot-top),10,3);}
  // Meter-Schilder, Start, Ziel
  for(let m=50;m<g.L.len;m+=50){const px=sx(m);if(px<-60||px>W+60)continue;x.fillStyle='#8a6d4a';x.fillRect(px-2,top-40,4,40);x.fillStyle='#fbf6ea';x.beginPath();x.roundRect(px-24,top-62,48,26,8);x.fill();x.strokeStyle='#8a6d4a';x.lineWidth=2;x.stroke();x.fillStyle='#3d3226';x.font='700 15px Andika,sans-serif';x.textAlign='center';x.fillText(m+' m',px,top-44);}
  line(x,sx(0),top,bot,false); line(x,sx(g.L.len),top,bot,true,g,S);
  // Boost-Felder
  g.boosts.forEach(b=>{const a=sx(b.x-b.w/2),c=sx(b.x+b.w/2);if(c<-20||a>W+20)return;for(let l=0;l<n;l++){const y=top+l*laneH;x.fillStyle=`rgba(159,208,122,${.35+.15*Math.sin(g.t*6+l)})`;x.beginPath();x.roundRect(a,y+laneH*.2,c-a,laneH*.6,laneH*.3);x.fill();
    for(let k=0;k<4;k++)spr(x,g.ic.blatt,a+(k+.5)*(c-a)/4,y+laneH*.72,laneH*.4);
    x.fillStyle='rgba(255,255,255,.6)';for(let k=0;k<3;k++){const ax=a+(c-a)*(k+.5)/3;x.beginPath();x.moveTo(ax-8,y+laneH*.35);x.lineTo(ax+6,y+laneH*.5);x.lineTo(ax-8,y+laneH*.65);x.fill();}}});
  // Objekte pro Bahn von hinten nach vorn
  let mark=null;
  for(let l=0;l<n;l++){ const y=top+(l+.82)*laneH, ls=.82+.18*(l/(n-1||1));
    g.obst.forEach(o=>{const px=sx(o.x);if(px<-80||px>W+80)return; if(o.kind==='pfuetze'){x.fillStyle='rgba(110,85,55,.65)';x.beginPath();x.ellipse(px,y-2,S*.36*ls,laneH*.22,0,0,7);x.fill();x.fillStyle='rgba(170,210,220,.5)';x.beginPath();x.ellipse(px-6,y-5,S*.18*ls,laneH*.08,0,0,7);x.fill();}
      else { if(l===g.me.lane&&o.x>g.me.x&&o.x-g.me.x<12){x.fillStyle=`rgba(240,195,90,${.3+.2*Math.sin(g.t*10)})`;x.beginPath();x.ellipse(px,y-S*.12,S*.3,S*.24,0,0,7);x.fill();}
        spr(x,g.ic[o.kind],px,y+4,S*(o.kind==='holz'?.3:.36)*ls);} });
    g.racers.filter(r=>r.lane===l).forEach(r=>{ const px=sx(r.x); if(px<-S*2||px>W+S*2) return;
      const h=S*r.sc*ls, jy=r.jump>0?Math.sin(r.jump*Math.PI)*S*.55:0, f=r.fr[Math.floor(r.ph*8)%8];
      x.fillStyle='rgba(60,45,25,.2)';x.beginPath();x.ellipse(px,y+2,h*.42*(1-jy/(S*1.4)),6,0,0,7);x.fill();
      if(r.boost>0){x.fillStyle='rgba(159,208,122,.35)';x.beginPath();x.ellipse(px-h*.3,y-h*.35-jy,h*.6,h*.28,0,0,7);x.fill();}
      const tilt=r.stum>0?Math.sin(r.stum*20)*.06:0; x.save();x.translate(px,y+6-jy);x.rotate(tilt);spr(x,f,0,0,h);x.restore();
      if(r.me) mark=[px,y-h-jy-8+Math.sin(g.t*5)*4];
      if(r.fin&&r.place<=3){ x.fillStyle=['#f0c35a','#d8d8d8','#d9a06c'][r.place-1];x.beginPath();x.arc(px,y-h-jy-(r.me?44:8),16,0,7);x.fill();x.fillStyle='#3d3226';x.font='700 18px Andika,sans-serif';x.textAlign='center';x.fillText(r.place,px,y-h-jy-(r.me?38:2)); }
    });
    g.parts.filter(p=>p.lane===l).forEach(p=>{x.globalAlpha=Math.min(1,p.l*2);x.fillStyle=p.c;x.beginPath();x.arc(sx(p.x),y+p.y*ppm*.4,p.s,0,7);x.fill();});x.globalAlpha=1;
  }
  if(mark){const [px,ay]=mark;x.fillStyle='#f0c35a';x.strokeStyle='#3d3226';x.lineWidth=2;x.beginPath();x.moveTo(px-14,ay-22);x.lineTo(px+14,ay-22);x.lineTo(px,ay);x.closePath();x.fill();x.stroke();}
  // Vordergrund-Farne
  x.fillStyle='#b2935f';x.fillRect(-10,bot,W+20,H-bot);
  for(let i=-1;i<W/150+2;i++){const wx=Math.floor(camX*ppm*1.25/150)+i,px=wx*150-camX*ppm*1.25;spr(x,g.ic.farn,px,H+10,Math.min(120,(H-bot)*1.1)*(.8+((wx*29)%10)/30));}
  x.restore();
  // Fortschritt oben
  const pw=Math.min(460,W*.72),px0=(W-pw)/2,py=26; x.fillStyle='rgba(255,251,243,.9)';x.beginPath();x.roundRect(px0-18,py-18,pw+36,38,19);x.fill();
  x.fillStyle='#e8dcc0';x.beginPath();x.roundRect(px0,py-3,pw,8,4);x.fill();
  spr(x,g.ic.flagge,px0+pw+4,py+14,34);
  g.racers.slice().sort((a,b)=>a.me-b.me).forEach(r=>{const u=Math.min(1,r.x/g.L.len);x.fillStyle=r.me?'#c8553d':'rgba(107,90,69,.55)';x.beginPath();x.arc(px0+pw*u,py+1,r.me?9:6,0,7);x.fill();if(r.me){x.strokeStyle='#fff';x.lineWidth=2;x.stroke();}});
}
function line(x,px,top,bot,fin,g,S){ if(px<-120||px>W+120) return;
  const sq=12; for(let y=top,k=0;y<bot;y+=sq,k++)for(let j=0;j<2;j++){x.fillStyle=(k+j)%2?'#3d3226':'#fbf6ea';x.fillRect(px+j*sq-sq,y,sq,sq);}
  if(fin){ // Zielbogen mit Wimpeln
    x.fillStyle='#8a6d4a';x.fillRect(px-sq-5,top-S*1.25,8,bot-top+S*1.25);x.fillRect(px+sq-3,top-S*1.25,8,S*1.25);
    x.strokeStyle='#8a6d4a';x.lineWidth=2;x.beginPath();x.moveTo(px-sq-80,top-S*1.2);x.quadraticCurveTo(px,top-S*.9,px+sq+80,top-S*1.2);x.stroke();
    for(let i=0;i<9;i++){const u=i/8,wx=px-sq-80+u*(2*sq+160),wy=top-S*1.2+Math.sin(u*Math.PI)*S*.3*.9*(1)-0;x.fillStyle=LANE_COL[i%5];x.beginPath();x.moveTo(wx-8,wy);x.lineTo(wx+8,wy);x.lineTo(wx,wy+18+Math.sin(g.t*6+i)*2);x.fill();}
  }
}

/* ---------- Ergebnis: Wie schnell in echt? ---------- */
function results(){
  const g=G; if(!g||g.state==='done') return; g.state='done'; if(stopLoop){stopLoop();stopLoop=null;}
  g.racers.forEach(r=>{ if(!r.fin){ r.place=++g.place; } });
  const byPlace=g.racers.slice().sort((a,b)=>a.place-b.place), bySpeed=g.racers.slice().sort((a,b)=>b.kmh-a.kmh);
  const me=g.me, c=cmpOf(me.kmh), fast=bySpeed[0], cf=cmpOf(fast.kmh);
  const nm=id=>DATA.animal(id).short||GK.name(id);
  root.innerHTML=`<div class="dr-res fill col"><div class="dr-podium">${byPlace.slice(0,3).map(r=>`<div class="dr-pod p${r.place} ${r.me?'dr-me':''}">${GK.img(r.id,{mood:'happy'})}<span class="dr-medal">${r.place}</span></div>`).join('')}</div>
    <div class="card dr-real"><h3 class="hand">${GK.icon('lupe','dr-ic')} Wie schnell in echt?</h3>
    ${bySpeed.map(r=>{const cc=cmpOf(r.kmh);return `<div class="dr-row ${r.me?'dr-me':''}"><span class="dr-rimg">${GK.img(r.id)}</span><span class="dr-bar"><i style="width:${Math.round(12+88*r.kmh/Math.max(50,fast.kmh))}%"></i><em>${nm(r.id)} · etwa ${r.kmh} km/h</em></span><span class="dr-cmp">${GK.icon(cc.icon)}</span></div>`;}).join('')}
    <p class="dr-note">${nm(me.id)} war ${c.t}.</p></div>
    <button class="btn big go dr-next" type="button">${ART.icon('pfeil_r',40)}Weiter</button></div>`;
  const place=me.place;
  DW.say(`${place===1?'Du hast gewonnen!':'Du bist Platz '+place+'!'} In echt war ${nm(me.id)} ${c.t}. ${fast.id===me.id?'Dein Dino war der Schnellste!':'Am schnellsten war '+nm(fast.id)+': '+cf.t+'.'}`);
  const stars=place===1?3:place===2?2:1;
  root.querySelector('.dr-next').onclick=()=>{DW.sfx('pop');
    const st=GK.st(ID); st.races=(st.races||0)+1; if(place===1) st.wins=(st.wins||0)+1;
    GK.finish(root,{id:ID,stars,art:'<div class="gc-art">'+(GK.img(me.id,{mood:'happy'}))+'</div>',title:place===1?'Sieg!':'Im Ziel!',
      extra:`<p class="dr-fin">${GK.icon(c.icon,'dr-ic')} ${nm(me.id)}: ${c.t}</p>`,
      say:place===1?'Rennabzeichen für dich! Du warst am schnellsten im Ziel.':'Toll gerannt! Nochmal? Vielleicht mit einem schnelleren Dino!',
      again:()=>choose()}); };
  GK.idle.set(()=>GK.pulse(root.querySelector('.dr-next')),null);
}

DW.stations[ID]={title:'Dino-Rennen',mount,unmount(){ if(stopLoop)stopLoop(); stopLoop=null; G=null; delete window.__rennenWin; delete window.__rennenInfo; }};
})();
