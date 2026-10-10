/* =====================================================================
   DINO-INSELWELT · Station Leuchtende Tiefsee
   Dunkles Wasser, eine Taschenlampe folgt dem Finger. Oben im Bullauge
   ist ein Umriss: Finde das passende Tier im Lichtkegel!
   ===================================================================== */
(function(){
"use strict";
const ID='tiefsee';

/* ---------- Spieldaten ---------- */
const LV={1:{rounds:4,n:3,light:.30,similar:false},2:{rounds:5,n:5,light:.25,similar:false},3:{rounds:6,n:7,light:.2,similar:true}};
const SKIP=['ambulocetus','deinosuchus','placodus','nothosaurus'];
// Zusatzwissen für die Tiefe (fachlich geprüft, kindgerecht)
const DEEP={
 quastenflosser:'Quastenflosser leben heute noch – tief im Meer, in dunklen Felshöhlen.',
 ichthyosaurus:'Fischsaurier hatten riesige Augen. Damit sahen sie auch im dunklen Wasser gut.',
 shonisaurus:'Fischsaurier hatten große Augen. Damit sahen sie auch im dunklen Wasser.',
 livyatan:'Seine Verwandten, die Pottwale, tauchen heute über tausend Meter tief.',
 megalodon:'Megalodon war einer der größten Haie, die es je gab.',
 leedsichthys:'Er schwamm mit offenem Maul und siebte winziges Plankton aus dem Wasser.',
};
// Umrisse, die praktisch gleich aussehen – nie gemeinsam in einer Runde
const TWINS=[['kronosaurus','liopleurodon'],['mosasaurus','tylosaurus'],['ichthyosaurus','shonisaurus'],['basilosaurus','dorudon'],['plesiosaurus','elasmosaurus'],['megalodon','cladoselache','edestus','helicoprion'],['quastenflosser','eusthenopteron']];
const twin=(a,b)=>TWINS.some(t=>t.includes(a)&&t.includes(b));
const GLOW_SAY='Diese Quallen leuchten ganz von selbst! Viele Tiere in der Tiefsee können leuchten.';

/* ---------- Zustand ---------- */
let root, lv=1, G=null, cv, ctx, DPR=1, W=0, H=0, CR=null, rzT=null;
const nm=id=>DATA.nameOf(id);
/* kleiner Zufallsgenerator mit Startwert: Hintergrund und Plätze bleiben bei Drehen/Größenänderung dieselben */
const rng=seed=>{ let a=seed>>>0; return ()=>{ a=(a+0x6D2B79F5)>>>0; let t=a; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; };
/* Größenänderung nur EINMAL anmelden (vorher bei jedem „Nochmal“ erneut) und gebündelt ausführen */
function mount(r){ root=r; GK.listen(window,'resize',()=>{ clearTimeout(rzT); rzT=setTimeout(resize,120); }); intro(); }
function intro(){
  GK.intro(root,{id:ID, art:`<div class="sd-iart">${GK.icon('taschenlampe')}${GK.img('quastenflosser')}</div>`, title:'Leuchtende Tiefsee',
    say:'Tief unten im Meer ist es dunkel. Nimm die Taschenlampe! Oben siehst du einen Schatten. Finde das passende Tier.',
    onStart:l=>{ lv=l; start(); }});
}
function pool(){ return DATA.SEA_IDS.filter(id=>!SKIP.includes(id)&&ART.has((DATA.animal(id)||{}).art||id)); }
function start(){
  const P=LV[lv];
  G={P,round:0,miss:0,targets:GK.sample(pool(),P.rounds),lx:0,ly:0,glowSaid:false,flash:0,items:[],snow:[],jel:[],busy:false,seed:(Math.random()*1e9)|0};
  root.innerHTML=`<div class="sd-stage ts" id="tsStage"><canvas id="tsCv"></canvas>
    <div class="sd-grain ts-grain" style="background-image:url(${DW.paperURL})"></div>
    <div class="sd-ask ts-ask" id="tsAsk"></div></div>`;
  cv=root.querySelector('#tsCv'); ctx=cv.getContext('2d');
  resize();
  G.lx=W/2; G.ly=H*.55;
  for(let i=0;i<70;i++) G.snow.push({x:Math.random()*W,y:Math.random()*H,r:DW.rand(.8,2.4),v:DW.rand(8,22),p:Math.random()*6});
  const jn=lv===1?3:4; for(let i=0;i<jn;i++) G.jel.push({x:DW.rand(.1,.9),y:DW.rand(.3,.9),ph:Math.random()*6,hue:DW.pick([190,280,160,320]),s:DW.rand(.7,1.1),spark:0});
  G.bg=bgCanvas();
  /* Lage der Fläche einmal merken (beim Start, beim Antippen, bei Größenänderung) – nicht bei jeder Bewegung messen */
  const move=e=>{ if(!G) return; if(!CR) CR=cv.getBoundingClientRect(); G.lx=e.clientX-CR.left; G.ly=e.clientY-CR.top; };
  let down=null;
  GK.listen(cv,'pointermove',e=>{ if(down&&e.pointerId!==down.id) return; move(e); });
  GK.listen(cv,'pointerdown',e=>{ e.preventDefault(); if(down&&!e.isPrimary) return;   // zweiter Finger: die Lampe bleibt beim ersten
    CR=cv.getBoundingClientRect(); move(e); down={x:e.clientX,y:e.clientY,id:e.pointerId}; try{cv.setPointerCapture(e.pointerId);}catch(_){} });
  // Tippen wählt aus; Ziehen bewegt nur die Lampe (Loslassen nach dem Suchen ist kein Fehlversuch)
  GK.listen(cv,'pointerup',e=>{ if(!down||e.pointerId!==down.id) return; move(e); const far=Math.hypot(e.clientX-down.x,e.clientY-down.y)>28; down=null; if(!far&&G) tap(G.lx,G.ly); });
  GK.listen(cv,'pointercancel',e=>{ if(down&&e.pointerId===down.id) down=null; });
  GK.loop((dt,T)=>{ if(!G) return false; step(dt,T); draw(T); });
  round();
}
function resize(){ if(!cv||!cv.isConnected) return; const w=cv.clientWidth, h=cv.clientHeight; if(!w||!h) return;
  const W0=W, H0=H; W=w; H=h; CR=cv.getBoundingClientRect();
  /* Auflösung begrenzen: höchstens ~2,6 Mio. Bildpunkte (großes Tablet mit dpr 2 wären sonst 5,6 Mio. pro Bild) */
  DPR=Math.min(2,devicePixelRatio||1,Math.sqrt(2.6e6/(W*H))); cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR);
  if(G){ G.bg=bgCanvas(); layout();
    if(W0&&H0&&(W0!==W||H0!==H)){ const kx=W/W0, ky=H/H0; G.lx*=kx; G.ly*=ky; G.snow.forEach(s=>{ s.x*=kx; s.y*=ky; }); } } }
function bgCanvas(){
  const c=document.createElement('canvas'); c.width=Math.max(1,Math.round(W/2)); c.height=Math.max(1,Math.round(H/2)); const x=c.getContext('2d'), w=c.width, h=c.height;
  const R=rng(G?G.seed:1), rr=(a,b)=>a+R()*(b-a);
  const g=x.createLinearGradient(0,0,0,h); g.addColorStop(0,'#2d6a86'); g.addColorStop(.35,'#1a4560'); g.addColorStop(1,'#0a2233'); x.fillStyle=g; x.fillRect(0,0,w,h);
  for(let i=0;i<14;i++){ const cx=R()*w, cy=R()*h, r=rr(.1,.3)*Math.max(w,h); const rg=x.createRadialGradient(cx,cy,r*.5,cx,cy,r);
    rg.addColorStop(0,`rgba(${['40,110,120','30,70,110','60,90,130'][Math.floor(R()*3)]},.18)`); rg.addColorStop(.92,'rgba(5,20,35,.16)'); rg.addColorStop(1,'rgba(5,20,35,0)'); x.fillStyle=rg; x.beginPath(); x.arc(cx,cy,r,0,7); x.fill(); }
  // Meeresboden mit Felsen
  x.fillStyle='#10303f'; x.beginPath(); x.moveTo(0,h); for(let i=0;i<=w;i+=w/12) x.lineTo(i,h*.9-Math.abs(Math.sin(i*.03))*h*.07); x.lineTo(w,h); x.fill();
  return c;
}

/* ---------- Runde ---------- */
function round(){
  const P=G.P, target=G.targets[G.round];
  let others=pool().filter(id=>id!==target&&!twin(id,target));
  if(P.similar){ const plan=(ART.SPECIES[ART.resolve(DATA.animal(target).art)]||{}).plan; const sim=others.filter(id=>(ART.SPECIES[ART.resolve(DATA.animal(id).art)]||{}).plan===plan);
    others=DW.shuffle(sim).concat(DW.shuffle(others.filter(i=>!sim.includes(i)))); } else others=DW.shuffle(others);
  const pickd=[]; others.forEach(id=>{ if(pickd.length<P.n-1&&!pickd.some(x=>twin(x,id))) pickd.push(id); });
  const ids=DW.shuffle([target].concat(pickd));
  G.target=target; G.busy=false;
  G.items=ids.map(id=>{ const flip=Math.random()<.5; return {id,flip,img:ART.toImage(ART.animal(DATA.animal(id).art,{flip,shadow:false}),'ts|'+id+flip),ph:Math.random()*6,gone:0,glow:0,jx:DW.rand(-.1,.1),jy:DW.rand(-.1,.1),bmp:null}; });
  G.rseed=(Math.random()*1e9)|0;
  layout();
  const a=root.querySelector('#tsAsk');
  a.innerHTML=`<div class="pic ts-port">${GK.img(target,{},'ts-sil')}</div><div><div class="txt">Wer ist das?</div>${GK.progress(G.round,P.rounds)}</div>
    <button class="ibtn" type="button" aria-label="Nochmal hören">${ART.icon('lautsprecher')}</button>`;
  a.classList.remove('sd-pop'); void a.offsetWidth; a.classList.add('sd-pop');
  const line=G.round===0?'Schau auf den Schatten im Bullauge. Leuchte mit der Lampe und tippe das passende Tier an!':DW.pick(['Wer gehört zu diesem Schatten? Leuchte mal!','Ein neuer Schatten! Such das Tier im Dunkeln.','Wer versteckt sich da? Leuchte und tippe es an!']);
  a.querySelector('.ibtn').onclick=()=>DW.say(line);
  DW.say(line);
  GK.idle.set(()=>{ GK.pulse(a.querySelector('.pic')); G.hint=2; },()=>{ G.hint=4; const t=G.items.find(i=>i.id===G.target); DW.say('Schau mal '+(t.y>H*.62?'unten':t.y<H*.4?'oben':'in der Mitte')+(t.x<W*.36?' links':t.x>W*.64?' rechts':'')+'!'); });
}
function layout(){
  if(!G||!G.items.length) return;
  const n=G.items.length, land=W>H, cols=land?Math.min(4,Math.ceil(n/2)):2, rows=Math.ceil(n/cols);
  const top=H*(land?.3:.22), ah=H*.9-top;
  const cw=W/cols, ch=ah/rows, base=Math.min(cw*.8,ch*1.25,280);
  /* Plätze mit festem Startwert würfeln: Bei Drehen/Größenänderung (auch wenn am Handy die Adressleiste verschwindet)
     bleiben die Tiere an ihrem Platz und springen nicht mehr durcheinander. */
  const R=rng(G.rseed), cells=[...Array(cols*rows).keys()]; for(let i=cells.length-1;i>0;i--){ const j=Math.floor(R()*(i+1)); [cells[i],cells[j]]=[cells[j],cells[i]]; }
  G.items.forEach((it,i)=>{ const c=cells[i]%cols, r=Math.floor(cells[i]/cols);
    const L=DATA.lenM(it.id)||2, sc=DW.clamp(.7+Math.log10(L+1)*.35,.7,1.1);
    it.w=Math.min(base*sc,W*.46); const m=it.w/2+W*.025; it.x=DW.clamp((c+.5)*cw+it.jx*cw,m,W-m); it.y=top+(r+.5)*ch+it.jy*ch; it.x0=it.x; it.y0=it.y; });
}
/* Tierbild einmal in passender Größe rastern (SVG/PNG bei jedem Bild neu zu skalieren kostet viel) */
function bmpOf(it){ const im=it.img; if(!im.complete||!im.naturalWidth) return null;
  const w=Math.max(8,Math.round(it.w*DPR)), h=Math.max(8,Math.round(w*im.naturalHeight/im.naturalWidth));
  if(!it.bmp||it.bmp.width!==w){ const c=document.createElement('canvas'); c.width=w; c.height=h; c.getContext('2d').drawImage(im,0,0,w,h); it.bmp=c; }
  return it.bmp; }
function step(dt,T){
  G.snow.forEach(s=>{ s.y+=s.v*dt; s.x+=Math.sin(T+s.p)*6*dt; if(s.y>H){s.y=-4;s.x=Math.random()*W;} });
  G.items.forEach(it=>{ it.x=it.x0+Math.sin(T*.4+it.ph)*W*.02; it.y=it.y0+Math.sin(T*.7+it.ph)*6; if(it.gone) it.gone=Math.min(1,it.gone+dt*.8); if(it.glow) it.glow=Math.max(0,it.glow-dt*.3); });
  G.jel.forEach(j=>{ j.y-=dt*.012; if(j.y<.12) j.y=.95; j.spark=Math.max(0,j.spark-dt); });
  G.flash=Math.max(0,G.flash-dt*.7);
}
function draw(T){
  const x=ctx; x.setTransform(DPR,0,0,DPR,0,0);
  x.drawImage(G.bg,0,0,W,H);
  // Tiere (unter der Dunkelheit)
  G.items.forEach(it=>{ if(it.gone>=1) return; const im=bmpOf(it); if(!im) return; const w=it.w, h=w*im.height/im.width;
    x.save(); x.globalAlpha=1-it.gone; x.translate(it.x+it.gone*W*.5*(it.flip?-1:1),it.y-it.gone*H*.2);
    if(it.glow){ x.shadowColor='rgba(255,225,130,.95)'; x.shadowBlur=30*it.glow; }
    x.drawImage(im,-w/2,-h/2,w,h); x.restore(); });
  // Dunkelheit mit Lichtkegel – weiche Verläufe, darum reicht die halbe Auflösung (wird beim Auftragen hochskaliert)
  const R=Math.min(W,H)*G.P.light*(G.hint?1.15:1), ox=W/2, oy=H+20, DK=.5;
  if(!G.dk){ G.dk=document.createElement('canvas'); }
  const dk=G.dk, dw=Math.max(2,Math.ceil(W*DK)), dh=Math.max(2,Math.ceil(H*DK)); if(dk.width!==dw||dk.height!==dh){dk.width=dw;dk.height=dh;}
  const d=dk.getContext('2d'); d.setTransform(DK,0,0,DK,0,0); d.globalCompositeOperation='source-over'; d.clearRect(0,0,W,H);
  d.fillStyle=`rgba(3,12,24,${[0,.9,.94,.96][lv]-G.flash*.8})`; d.fillRect(0,0,W,H);
  d.globalCompositeOperation='destination-out';
  // Strahl von der Lampe
  const ang=Math.atan2(G.ly-oy,G.lx-ox), px=Math.cos(ang+Math.PI/2), py=Math.sin(ang+Math.PI/2);
  const bg=d.createLinearGradient(ox,oy,G.lx,G.ly); bg.addColorStop(0,'rgba(0,0,0,.15)'); bg.addColorStop(1,'rgba(0,0,0,.5)');
  d.fillStyle=bg; d.beginPath(); d.moveTo(ox-px*14,oy-py*14); d.lineTo(G.lx-px*R*.8,G.ly-py*R*.8); d.lineTo(G.lx+px*R*.8,G.ly+py*R*.8); d.lineTo(ox+px*14,oy+py*14); d.fill();
  const rg=d.createRadialGradient(G.lx,G.ly,R*.25,G.lx,G.ly,R); rg.addColorStop(0,'rgba(0,0,0,1)'); rg.addColorStop(.7,'rgba(0,0,0,.85)'); rg.addColorStop(1,'rgba(0,0,0,0)');
  d.fillStyle=rg; d.beginPath(); d.arc(G.lx,G.ly,R,0,7); d.fill();
  x.imageSmoothingEnabled=true; x.drawImage(dk,0,0,dk.width,dk.height,0,0,dk.width/DK,dk.height/DK);
  // warmer Lichtschein
  x.globalCompositeOperation='lighter'; const wg=x.createRadialGradient(G.lx,G.ly,0,G.lx,G.ly,R); wg.addColorStop(0,'rgba(255,240,190,.16)'); wg.addColorStop(1,'rgba(255,240,190,0)');
  x.fillStyle=wg; x.beginPath(); x.arc(G.lx,G.ly,R,0,7); x.fill();
  // Meeresschnee
  for(let pass=0;pass<2;pass++){ x.fillStyle=pass?'rgba(220,240,235,.6)':'rgba(220,240,235,.16)'; x.beginPath();
    G.snow.forEach(s=>{ const dx=s.x-G.lx, dy=s.y-G.ly; if((dx*dx+dy*dy<R*R)===!!pass){ x.moveTo(s.x+s.r,s.y); x.arc(s.x,s.y,s.r,0,7); } }); x.fill(); }
  // leuchtende Quallen & Plankton
  G.jel.forEach(j=>{ const jx=j.x*W+Math.sin(T*.5+j.ph)*20, jy=j.y*H, s=Math.min(W,H)*.05*j.s, pulse=.75+.25*Math.sin(T*2+j.ph);
    const g=x.createRadialGradient(jx,jy,0,jx,jy,s*2.6); g.addColorStop(0,`hsla(${j.hue},90%,70%,${.35*pulse+j.spark*.4})`); g.addColorStop(1,`hsla(${j.hue},90%,60%,0)`);
    x.fillStyle=g; x.beginPath(); x.arc(jx,jy,s*2.6,0,7); x.fill();
    x.fillStyle=`hsla(${j.hue},80%,80%,${.75*pulse})`; x.beginPath(); x.ellipse(jx,jy,s,s*.7,0,Math.PI,0); x.quadraticCurveTo(jx,jy+s*.3,jx-s,jy); x.fill();
    x.strokeStyle=`hsla(${j.hue},80%,80%,${.55*pulse})`; x.lineWidth=2; for(let k=-2;k<=2;k++){ x.beginPath(); x.moveTo(jx+k*s*.35,jy); x.quadraticCurveTo(jx+k*s*.35+Math.sin(T*2+k)*6,jy+s*.9,jx+k*s*.3,jy+s*1.7); x.stroke(); }
    if(j.spark) for(let k=0;k<6;k++){ const a=k+T*3; x.fillStyle=`hsla(${j.hue},100%,90%,${j.spark})`; x.beginPath(); x.arc(jx+Math.cos(a)*s*1.8,jy+Math.sin(a)*s*1.8,3,0,7); x.fill(); } });
  for(let i=0;i<24;i++){ const px2=(i*97.3%1)*W+(Math.sin(T*.3+i)*20), py2=((i*0.618)%1)*H*.9+H*.05; const tw=.4+.6*Math.abs(Math.sin(T*1.3+i*1.7));
    x.fillStyle=`rgba(150,255,220,${.5*tw})`; x.beginPath(); x.arc(((px2%W)+W)%W,py2,1.8,0,7); x.fill(); }
  x.globalCompositeOperation='source-over';
  // Taschenlampe unten
  x.save(); x.translate(ox,H-6); x.rotate(ang+Math.PI/2); x.fillStyle='#e0b85a'; x.strokeStyle='#3d3226'; x.lineWidth=2;
  x.beginPath(); x.roundRect?x.roundRect(-13,-6,26,50,6):x.rect(-13,-6,26,50); x.fill(); x.stroke(); x.fillStyle='#fff3c4'; x.beginPath(); x.ellipse(0,-6,15,6,0,0,7); x.fill(); x.stroke(); x.restore();
}
function tap(px,py){
  if(!G||G.busy) return;
  // Qualle?
  const j=G.jel.find(j=>Math.hypot(j.x*W-px,j.y*H-py)<Math.min(W,H)*.08);
  const hit=G.items.filter(it=>!it.gone&&Math.abs(px-it.x)<it.w*.5&&Math.abs(py-it.y)<it.w*.28).sort((a,b)=>Math.hypot(px-a.x,py-a.y)-Math.hypot(px-b.x,py-b.y))[0];
  if(!hit){ if(j){ j.spark=1.2; DW.sfx('magic'); if(!G.glowSaid){G.glowSaid=true;DW.say(GLOW_SAY);} } return; }
  pick(hit);
}
function pick(it){
  if(it.id!==G.target){ G.miss++; DW.sfx('no'); it.glow=.5; DW.say(`Das ist ${nm(it.id)}. Schau noch mal genau auf den Schatten!`); if(G.miss%2===0) GK.pulse(root.querySelector('.ts-port')); return; }
  G.busy=true; GK.idle.stop(); G.hint=0; DW.sfx('magic'); it.glow=1; G.flash=1; G.lx=it.x; G.ly=it.y;
  const a=DATA.animal(it.id), first=DW.discover(it.id,true);
  const port=root.querySelector('.ts-sil'); if(port) port.classList.add('on');
  GK.after(900,()=>{
    const card=DW.h(`<div class="sd-card"><div class="card pop"><div class="ani">${GK.img(it.id,{mood:'happy'})}</div><h2>${nm(it.id)}</h2>
      ${first?`<span class="pill">Neu im Rucksack!</span>`:''}<p>${DEEP[it.id]||a.fact||''}</p><button class="btn big go" type="button">${ART.icon('pfeil_r',36)}Weiter</button></div></div>`);
    root.querySelector('#tsStage').appendChild(card); if(first) DW.sfx('star');
    DW.say(`Gefunden! Das ist ${nm(it.id)}. ${DEEP[it.id]||a.fact||''}`);
    const b=card.querySelector('.btn'); GK.idle.set(()=>GK.pulse(b),()=>{GK.pulse(b);DW.say('Tippe auf Weiter!');});
    b.onclick=()=>{ DW.sfx('tap'); card.remove(); it.gone=.01; G.round++; if(G.round>=G.P.rounds) finish(); else round(); };
  });
}
function finish(){
  const stars=G.miss<=1?3:G.miss<=4?2:1; const n=G.P.rounds; G=null;
  GK.finish(root,{id:ID,stars,art:`<div class="sd-iart">${GK.icon('taschenlampe')}${GK.img('quastenflosser',{mood:'happy'})}</div>`,
    say:`Super! Du hast im Dunkeln ${n} Tiere gefunden.`,again:()=>start()});
}
if(window.DW_DEBUG) window.__tsSolve=()=>{ if(!G) return 'none'; const b=root.querySelector('.sd-card .btn'); if(b){b.click();return 'next';} if(G.busy) return 'wait'; const it=G.items.find(i=>i.id===G.target); pick(it); return 'pick'; };
if(window.DW_DEBUG) window.__tsInfo=()=>{ if(!G||!G.items.length) return null; const t=G.items.find(i=>i.id===G.target), w=G.items.find(i=>i.id!==G.target); return {x:t.x,y:t.y,wx:w.x,wy:w.y,miss:G.miss,round:G.round,of:G.P.rounds,lv}; };
if(window.DW_DEBUG) window.__tsWrong=()=>{ const it=G&&G.items.find(i=>i.id!==G.target); if(it){ G.lx=it.x; G.ly=it.y; pick(it); } };
DW.stations[ID]={title:'Leuchtende Tiefsee',mount,unmount(){ G=null; cv=null; CR=null; clearTimeout(rzT); }};
})();
