/* =====================================================================
   DINO-INSELWELT · Station Endlose Welt (GAME 24 „Dinopedia Endless World“)
   Die Welt zieht vorbei: LAND → MEER → LUFT … Für jeden Lebensraum
   übernimmt das passende Tier (Läufer, Schwimmer, Flieger).
   Eine Geste für alles: drücken. An Land = springen, im Wasser und in
   der Luft = gedrückt halten zum Aufsteigen. Anstoßen bremst nur.
   ===================================================================== */
(function(){
"use strict";
const ID='endlos';

/* Lebensräume mit passenden Tieren, Futter und Hindernissen */
const MODES={
 land:{n:'Land',icon:'land',animals:[
     {id:'velociraptor',say:'An Land rennt Velociraptor. Er war so groß wie ein Truthahn und hatte Federn.'},
     {id:'compsognathus',say:'An Land rennt Compsognathus. Er war kaum größer als ein Huhn.'},
     {id:'gallimimus',say:'An Land rennt Gallimimus. Er war einer der schnellsten Dinos.'},
     {id:'coelophysis',say:'An Land rennt Coelophysis. Er war schlank, leicht und sehr flink.'},
     {id:'deinonychus',say:'An Land rennt Deinonychus. Er hatte eine große Sichelkralle am Fuß.'},
     {id:'eoraptor',say:'An Land rennt Eoraptor. Er war einer der allerersten Dinosaurier.'},
     {id:'struthiomimus',say:'An Land rennt Struthiomimus. Er sah aus wie ein Strauß.'}],
   food:['kleintier','ei'],obst:['stein','holz','farn'],gest:'tap',help:'Tippen: springen!'},
 meer:{n:'Meer',icon:'meer',animals:[
     {id:'ichthyosaurus',say:'Ab ins Meer! Ichthyosaurus schwimmt wie ein Delfin. Er war kein Dinosaurier, sondern ein Meeresreptil.'},
     {id:'plesiosaurus',say:'Ab ins Meer! Plesiosaurus paddelt mit vier Flossen. Zum Atmen musste er auftauchen.'},
     {id:'mosasaurus',say:'Ab ins Meer! Mosasaurus war ein riesiges Meeresreptil mit einem kräftigen Flossenschwanz.'},
     {id:'elasmosaurus',say:'Ab ins Meer! Elasmosaurus hatte einen superlangen Hals. Er war ein Meeresreptil, kein Dinosaurier.'},
     {id:'liopleurodon',say:'Ab ins Meer! Liopleurodon hatte einen riesigen Kopf und paddelte mit vier Flossen.'},
     {id:'shonisaurus',say:'Ab ins Meer! Shonisaurus war ein riesiger Fischsaurier – so lang wie ein Bus.'},
     {id:'nothosaurus',say:'Ab ins Meer! Nothosaurus jagte Fische mit spitzen Zähnen. Er war ein Meeresreptil.'}],
   food:['fisch','ammonit'],obst:['qualle','koralle'],gest:'hold',help:'Halten: nach oben!'},
 luft:{n:'Luft',icon:'luft',animals:[
     {id:'pteranodon',say:'Hoch in die Luft! Pteranodon fliegt. Er war ein Flugsaurier – kein Dinosaurier.'},
     {id:'quetzalcoatlus',say:'Hoch in die Luft! Quetzalcoatlus war der größte Flugsaurier. Er war so groß wie eine Giraffe.'}],
   food:['fisch'],obst:['wolke','klippe'],gest:'hold',help:'Halten: nach oben!'}};
Object.values(MODES).forEach(m=>{ m.animals=m.animals.filter(a=>DATA.animal(a.id)&&ART.has(DATA.animal(a.id).art)); });
const ORDER=['land','meer','luft','land','meer','luft'];
const LV={1:{segs:3,seg:20,speed:250,obst:.45,gap:[430,620]},2:{segs:4,seg:19,speed:300,obst:.6,gap:[380,560]},3:{segs:5,seg:18,speed:350,obst:.75,gap:[340,500]}};
const GROUND=470, SURF=80, FLOOR=540, SEA2=525;   // Weltkoordinaten (Höhe 600)

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
function spr(x,e,cx,cy,h,rot){const c=e&&e.c;if(!c)return;const w=h*c.width/c.height;if(rot){x.save();x.translate(cx,cy);x.rotate(rot);x.drawImage(c,-w/2,-h/2,w,h);x.restore();}else x.drawImage(c,cx-w/2,cy-h/2,w,h);}
function boxOf(id){const s=ART.animal(id,{shadow:false,ph:0}),m=/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/.exec(s);
  const x=+m[1],y=+m[2],w=+m[3],h=+m[4];return [x-w*.05,y-h*.12,x+w*1.05,y+h*1.04];}
function frames(id,n,h){const box=boxOf(id);return [...Array(n)].map((_,i)=>bake(`ew|${id}|${i}`,()=>ART.animal(id,{shadow:false,ph:i/n,box}),h));}
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

let root,lv=1,G=null,stopLoop=null,cv,ctx,W=1,H=1,DPR=1,BG=null;

function mount(r){ root=r;
  GK.listen(window,'keydown',e=>{ if(!G)return; if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault(); if(!e.repeat) press(true);} });
  GK.listen(window,'keyup',e=>{ if(!G)return; if(e.code==='Space'||e.code==='ArrowUp') press(false); });
  GK.listen(window,'resize',resize);
  intro(); }
function intro(){
  G=null;
  GK.intro(root,{id:ID,art:'<div class="gc-art">'+(GK.img('velociraptor')+GK.img('ichthyosaurus')+GK.img('pteranodon'))+'</div>',title:'Endlose Welt',
    say:'Lauf, schwimm und flieg durch die Urzeit! Wo Wasser ist, schwimmt ein Meeresreptil. In der Luft fliegt ein Flugsaurier.',
    onStart:l=>{lv=l;start();}});
}
function backgrounds(){ if(BG) return BG;
  BG={land:{far:band(1600,420,'#c9b8a0',250,120,2,1.1,500),mid:band(1600,420,'#9cb98a',300,80,3,3.7)},
      meer:{far:band(1600,420,'#5f93a8',300,90,3,2.2,400),mid:band(1600,420,'#4f7f94',330,60,4,5.3,400)},
      luft:{far:band(1600,420,'#b7c9cf',320,90,2,.4,300),mid:band(1600,420,'#9fb98f',360,50,5,2.9,300)}};
  return BG; }

function start(){
  if(stopLoop)stopLoop(); GK.idle.stop();
  const L=LV[lv];
  const used=[]; const seq=ORDER.slice(0,L.segs).map(m=>{ const pool=MODES[m].animals.filter(a=>!used.includes(a.id)); const a=DW.pick(pool.length?pool:MODES[m].animals); used.push(a.id); return {m,a}; });
  root.innerHTML=`<div class="ew gc-wrap"><canvas class="gc-cv"></canvas><div class="gc-paper"></div>
    <div class="gc-hud ew-hud"><span class="gc-chip ew-dist">${GK.icon('fussabdruck')}<b>0</b> m</span>
      <span class="ew-modes">${seq.map((s,i)=>`<i data-i="${i}">${GK.icon(MODES[s.m].icon)}</i>`).join('')}</span>
      <span class="gc-chip ew-got">${GK.icon('stern')}<b>0</b></span></div>
    <div class="gc-tip ew-tip hide"><span class="ew-hand">${GK.icon('hand')}</span><span class="ew-tiptxt"></span></div></div>`;
  cv=root.querySelector('canvas'); ctx=cv.getContext('2d'); resize(); backgrounds(); paperOn();
  const sprites={}; seq.forEach(s=>{ if(!sprites[s.a.id]) sprites[s.a.id]=frames(s.a.id,8,220); });
  const ic={}; ['kleintier','ei','fisch','ammonit','stein','holz','farn','qualle','koralle','wolke','klippe','stern','palme','seetang','muschel'].forEach(n=>ic[n]=icon(n));
  G={L,seq,si:0,mode:seq[0].m,animal:seq[0].a,sprites,ic,t:0,dur:L.segs*L.seg,x:0,speed:L.speed,slow:0,y:GROUND,vy:0,jumps:0,hold:false,hurt:0,
     items:[],next:600,got:0,spawned:0,parts:[],bound:null,done:false,ph:0,tipShown:{},endT:0,bubT:0,hits:0,
     hud:{d:root.querySelector('.ew-dist b'),c:root.querySelector('.ew-got b'),dv:0,cv:0}};
  /* mehrere Finger: erst wenn ALLE oben sind, gilt „losgelassen“ (ein zweiter Finger ließ das Tier sonst absacken) */
  const fingers=new Set();
  cv.addEventListener('pointerdown',e=>{e.preventDefault();fingers.add(e.pointerId);try{cv.setPointerCapture(e.pointerId);}catch(_){}press(true);});
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>cv.addEventListener(ev,e=>{ if(!fingers.delete(e.pointerId)) return; if(!fingers.size) press(false); }));
  showMode(true);
  if(window.DW_DEBUG) window.__endlosInfo=()=>G&&{t:G.t,dur:G.dur,mode:G.mode,y:G.y,vy:G.vy,x:G.x,got:G.got,spawned:G.spawned,hits:G.hits,hold:G.hold,done:G.done,px:G.x+pX(),
    items:G.items.filter(it=>!it.hit&&it.x>G.x+pX()-40&&it.x<G.x+pX()+700).map(it=>[Math.round(it.x-(G.x+pX())),Math.round(it.y),it.good?1:0,it.r])};
  if(window.DW_DEBUG) window.__endlosWin=()=>{ if(G){ G.got+=12; G.spawned=Math.max(G.spawned,14); G.t=G.dur; } };
  stopLoop=GK.loop(dt=>{ if(!G) return false; step(dt); draw(); return true; });
}
function showMode(first){
  const g=G, m=MODES[g.mode];
  DW.discover(g.animal.id);
  DW.say(g.animal.say);
  const tip=root.querySelector('.ew-tip'); tip.querySelector('.ew-tiptxt').innerHTML=`${GK.img(g.animal.id)}<b>${m.help}</b>`;
  tip.classList.toggle('hold',m.gest==='hold'); tip.classList.remove('hide'); g.tipOn=true; g.tipT=0;
  DW.$$('.ew-modes i',root).forEach((el,i)=>{el.classList.toggle('on',i===g.si);el.classList.toggle('past',i<g.si);});
  if(!first) DW.sfx(g.mode==='meer'?'whoosh':g.mode==='luft'?'magic':'thud');
}
function press(on){ const g=G; if(!g||g.done) return; g.hold=on;
  if(on){ if(g.tipOn&&g.tipT>1.2){ g.tipOn=false; root.querySelector('.ew-tip').classList.add('hide'); }
    if(g.mode==='land'){ if(g.jumps<2){ g.vy=g.jumps?-720:-860; g.jumps++; DW.sfx('jump'); } }
    else if(g.mode==='luft'){ DW.sfx('whoosh'); }
  } }
function burst(x,y,c,n,sp){for(let i=0;i<n;i++)G.parts.push({x,y,vx:(Math.random()-.5)*(sp||300),vy:-Math.random()*(sp||300)*.8,l:.7,c,r:DW.rand(3,7)});}

/* ---------- Spielablauf ---------- */
function step(dt){
  const g=G; g.t+=dt;
  const segLen=g.L.seg, idx=Math.min(g.seq.length-1,Math.floor(g.t/segLen));
  // Übergang: neue Welt kommt von rechts herein (Grenze in Weltkoordinaten)
  if(!g.bound&&idx<g.seq.length-1&&g.t>(idx+1)*segLen-2.2&&g.si===idx){ const vw=W/scale(); g.bound={x:g.x+vw+80,to:idx+1}; }
  const sp=g.speed*(1+g.t/g.dur*.25)*(g.slow>0?.45+.55*(1-g.slow):1)*(g.done?Math.max(0,1-g.endT/1.6):1);
  g.x+=sp*dt; if(g.slow>0) g.slow=Math.max(0,g.slow-dt*.9);
  g.ph=(g.ph+dt*(g.mode==='land'?sp/150:g.mode==='meer'?1.4:(g.hold?3:1.2)))%1;
  const px=g.x+pX();
  if(g.bound&&px>=g.bound.x){ g.si=g.bound.to; g.mode=g.seq[g.si].m; g.animal=g.seq[g.si].a; g.bound=null;
    if(g.mode==='land'){ g.y=Math.min(g.y,GROUND-40); g.vy=-300; } else if(g.mode==='meer'){ g.vy=240; } else { g.vy=-420; }
    burst(px,g.y,g.mode==='meer'?'#cfe8f0':g.mode==='luft'?'#ffffff':'#c9a570',18,420); showMode(false); }
  // Bewegung je Lebensraum
  if(g.mode==='land'){ g.vy+=(g.hold&&g.vy<0?1500:2400)*dt; g.y+=g.vy*dt; if(g.y>=GROUND){g.y=GROUND;g.vy=0;g.jumps=0;} if(g.y<60){g.y=60;g.vy=Math.max(g.vy,0);} }
  else if(g.mode==='meer'){ g.vy+=(g.hold?-900:520)*dt; g.vy*=Math.pow(.25,dt); g.y+=g.vy*dt;
    if(g.y<SURF+40){g.y=SURF+40;g.vy=Math.max(g.vy,40);} if(g.y>FLOOR-30){g.y=FLOOR-30;g.vy=Math.min(g.vy,0);}
    g.bubT-=dt; if(g.bubT<=0){g.bubT=.25;g.parts.push({x:px+40,y:g.y-10,vx:-30,vy:-60,l:1.4,c:'rgba(230,245,250,.8)',r:DW.rand(3,6),bub:1});} }
  else { g.vy+=(g.hold?-1100:420)*dt; g.vy*=Math.pow(.3,dt); g.y+=g.vy*dt;
    if(g.y<50){g.y=50;g.vy=Math.max(g.vy,0);} if(g.y>SEA2-40){g.y=SEA2-40;g.vy=Math.min(g.vy,-60);} }
  if(g.tipOn) g.tipT+=dt;
  if(g.tipOn&&g.tipT>5){ g.tipOn=false; root.querySelector('.ew-tip').classList.add('hide'); }
  // Nachschub
  g.next-=sp*dt; if(g.next<=0&&!g.done&&g.t<g.dur-2) spawn();
  // Kollisionen
  if(g.hurt>0) g.hurt-=dt;
  g.items.forEach(it=>{ if(it.vy!==undefined){ it.vy+=900*dt; it.y+=it.vy*dt; }
    if(it.bob) it.y=it.y0+Math.sin(g.t*2+it.bob)*it.amp;
    if(it.hit) return; const dx=it.x-px, dy=it.y-g.y; if(Math.abs(dx)>it.r+60) return;
    if(dx*dx+dy*dy<(it.r+34)*(it.r+34)){
      if(it.good){ it.hit=1; g.got+=it.star?3:1; DW.sfx(it.star?'star':'egg'); burst(it.x,it.y,it.star?'#f0c35a':'#fbf6ea',10); }
      else if(g.hurt<=0){ it.hit=1; g.hurt=1; g.slow=1; g.hits++; DW.sfx('bump'); burst(px,g.y,'rgba(120,100,80,.6)',8);
        if(g.hits===1||Math.random()<.25) DW.say(DW.pick(['Hoppla! Weiter geht’s!','Uff! Nicht schlimm.','Bumm! Kurz langsamer.'])); } } });
  g.items=g.items.filter(it=>it.x>g.x-200&&!(it.hit&&it.good));
  g.parts.forEach(p=>{p.x+=p.vx*dt-(p.bub?0:0);p.y+=p.vy*dt;if(!p.bub)p.vy+=500*dt;p.l-=dt;}); g.parts=g.parts.filter(p=>p.l>0);
  // HUD – nur schreiben, wenn sich die Zahl ändert (kein Schreiben ins Dokument pro Bild)
  const hd=g.hud, dv=Math.floor(g.x/50); if(dv!==hd.dv){ hd.dv=dv; if(hd.d) hd.d.textContent=dv; }
  if(g.got!==hd.cv){ hd.cv=g.got; if(hd.c) hd.c.textContent=g.got; }
  // Ende: ruhig ausrollen
  if(!g.done&&g.t>=g.dur){ g.done=true; g.endT=0; DW.say('Geschafft! Was für eine Reise durch Land, Meer und Luft!'); DW.sfx('win'); }
  if(g.done){ g.endT+=dt; if(g.endT>2.2) finish(); }
}
function modeAt(wx){ const g=G; return g.bound&&wx>=g.bound.x?g.seq[g.bound.to].m:g.mode; }
function spawn(){
  const g=G,L=g.L,vw=W/scale(),x0=g.x+vw+60,m=modeAt(x0),M=MODES[m];
  const food=()=>DW.pick(M.food);
  const add=o=>{g.items.push(o);if(o.good&&!o.star)g.spawned++;};
  const obst=Math.random()<L.obst;
  if(m==='land'){
    if(obst){ const k=DW.pick(M.obst); add({x:x0,y:GROUND-(k==='holz'?22:30),r:k==='holz'?30:34,k,good:false});
      for(let i=0;i<3;i++) add({x:x0-90+i*90,y:GROUND-150-(i===1?40:0),r:24,k:food(),good:true}); }
    else { const n=4+Math.floor(Math.random()*3),hy=Math.random()<.5?GROUND-40:GROUND-180; for(let i=0;i<n;i++) add({x:x0+i*70,y:hy-Math.sin(i/(n-1)*Math.PI)*(hy<GROUND-100?60:110),r:24,k:food(),good:true}); }
  } else if(m==='meer'){
    if(obst){ if(Math.random()<.5){ const y=DW.rand(SURF+90,FLOOR-120); add({x:x0,y0:y,y,bob:Math.random()*6,amp:50,r:34,k:'qualle',good:false}); add({x:x0+160,y:y>300?y-150:y+150,r:24,k:food(),good:true}); }
      else { add({x:x0,y:FLOOR-60,r:48,k:'koralle',good:false,big:1.8}); for(let i=0;i<3;i++) add({x:x0-70+i*70,y:FLOOR-200-i*20,r:24,k:food(),good:true}); } }
    else { const y=DW.rand(SURF+80,FLOOR-80),n=5; for(let i=0;i<n;i++) add({x:x0+i*70,y0:y+Math.sin(i)*30,y:y,bob:i*.8,amp:18,r:24,k:food(),good:true}); }
  } else {
    if(obst){ if(Math.random()<.55){ const y=DW.rand(90,SEA2-160); add({x:x0,y,r:44,k:'wolke',good:false,big:1.9,dark:1}); add({x:x0+170,y:y>260?y-160:y+170,r:24,k:'fisch',good:true}); }
      else { add({x:x0,y:SEA2-70,r:50,k:'klippe',good:false,big:2}); add({x:x0,y:SEA2-230,r:24,k:'fisch',good:true}); } }
    else { for(let i=0;i<3;i++) add({x:x0+i*140,y:SEA2,vy:-DW.rand(560,700),r:24,k:'fisch',good:true,leap:1}); }
  }
  if(Math.random()<.12) add({x:x0+220,y:m==='land'?GROUND-230:DW.rand(150,420),r:26,k:'stern',good:true,star:1});
  g.next=DW.rand(L.gap[0],L.gap[1]);
}

/* ---------- Zeichnen ---------- */
function resize(){ if(!cv||!cv.isConnected||!cv.clientWidth||!cv.clientHeight) return; W=cv.clientWidth; H=cv.clientHeight; DPR=dprFor(W,H);
  const w=Math.round(W*DPR), h=Math.round(H*DPR); if(cv.width!==w||cv.height!==h){ cv.width=w; cv.height=h; } }
function scale(){ return Math.min(H/620,W/640); }
function pX(){ return W/scale()*(H>W?.38:.26); }
function scene(x,m,cam,s,oy){
  // Hintergrund eines Lebensraums (Bildschirmkoordinaten), cam = Weltposition links
  const b=BG[m], par=(img,f,y,h)=>{const w=img.width*h/img.height,off=-((cam*s*f)%w+w)%w;for(let px=off;px<W;px+=w)x.drawImage(img,px,y,w,h);};
  const Y=v=>oy+v*s;
  // eigene Landschaft (grafiken-neu/landschaften/): Land = tal_…, Unter Wasser = unterwasser_…, Flug übers Meer = luft_… (sonst Zeichnung)
  const A=window.ASSETS, wl={land:'tal',meer:'unterwasser',luft:'luft'}[m]||m, LY=k=>A&&A.layer?A.layer(wl,k):null, ls=LY('himmel'), lf=LY('hinten'), lm=LY('mitte'), lb=LY('boden');
  const P=(im,img,f,y,h)=>im?A.drawLayer(x,im,cam*s*f,y,h,W):par(img,f,y,h);
  if(m==='land'){
    if(ls) A.drawCover(x,ls,0,0,W,Y(GROUND)+2);
    else{ const sk=x.createLinearGradient(0,0,0,Y(GROUND));sk.addColorStop(0,'#c5dfe4');sk.addColorStop(1,'#f5e6c4');x.fillStyle=sk;x.fillRect(0,0,W,Y(GROUND)+2);
    x.fillStyle='rgba(255,240,200,.8)';x.beginPath();x.arc(W*.78,Y(110),38*s+10,0,7);x.fill(); }
    P(lf,b.far,.12,Y(GROUND-330),330*s*1.1); P(lm,b.mid,.3,Y(GROUND-200),220*s);
    for(let i=-1;i<W/(300*s)+2;i++){const k=Math.floor(cam*s*.55/(300*s))+i,px=k*300*s-cam*s*.55+((k*71)%90)*s;spr(x,G.ic.palme,px,Y(GROUND-95),190*s*(.85+((k*37)%10)/40));}
    if(lb) A.drawLayer(x,lb,cam*s,Y(GROUND)-8,H-Y(GROUND)+8,W);
    else{ x.fillStyle='#b8976a';x.fillRect(0,Y(GROUND),W,H);
    x.fillStyle='#8fb06f';x.beginPath();x.moveTo(0,Y(GROUND)+8);for(let px=0;px<=W+16;px+=16)x.lineTo(px,Y(GROUND)-4+Math.sin((px+cam*s)*.06)*3);x.lineTo(W,Y(GROUND)+8);x.fill();
    x.fillStyle='rgba(80,55,30,.14)';for(let i=0;i<30;i++){const px=((i*97-cam*s)%(W+80)+W+80)%(W+80)-40;x.fillRect(px,Y(GROUND+20+(i*23)%90),14,4);} }
  } else if(m==='meer'){
    const sk=x.createLinearGradient(0,0,0,Y(SURF));sk.addColorStop(0,'#cfe6ec');sk.addColorStop(1,'#eaf2ea');x.fillStyle=sk;x.fillRect(0,0,W,Y(SURF)+1);
    if(ls) A.drawCover(x,ls,0,Y(SURF),W,Y(FLOOR)-Y(SURF)+2); // himmel = Wasser-Hintergrund
    else{ const sg=x.createLinearGradient(0,Y(SURF),0,Y(FLOOR));sg.addColorStop(0,'#8fc3d2');sg.addColorStop(1,'#3f7690');x.fillStyle=sg;x.fillRect(0,Y(SURF),W,Y(FLOOR)-Y(SURF)+2); }
    // Lichtstrahlen
    x.fillStyle='rgba(255,255,255,.09)';for(let i=0;i<5;i++){const px=((i*260-cam*s*.2)%(W+300)+W+300)%(W+300)-150;x.beginPath();x.moveTo(px,Y(SURF));x.lineTo(px+60*s,Y(SURF));x.lineTo(px+220*s,Y(FLOOR));x.lineTo(px+120*s,Y(FLOOR));x.fill();}
    P(lf,b.far,.15,Y(FLOOR-260),280*s); P(lm,b.mid,.3,Y(FLOOR-160),180*s);
    if(lb) A.drawLayer(x,lb,cam*s,Y(FLOOR)-8,H-Y(FLOOR)+8,W);
    else{ x.fillStyle='#d8c49a';x.fillRect(0,Y(FLOOR),W,H);
    x.fillStyle='#c9b184';x.beginPath();x.moveTo(0,Y(FLOOR)+6);for(let px=0;px<=W+20;px+=20)x.lineTo(px,Y(FLOOR)-4+Math.sin((px+cam*s)*.04)*5);x.lineTo(W,Y(FLOOR)+10);x.fill(); }
    for(let i=-1;i<W/(170*s)+2;i++){const k=Math.floor(cam*s*.8/(170*s))+i,px=k*170*s-cam*s*.8;spr(x,k%3?G.ic.seetang:G.ic.muschel,px,Y(FLOOR-(k%3?40:4)),(k%3?110:44)*s);}
    // Wasseroberfläche
    x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=3;x.beginPath();for(let px=0;px<=W+10;px+=10)x.lineTo(px,Y(SURF)+Math.sin((px+cam*s)*.03+G.t*2)*4);x.stroke();
  } else {
    if(ls) A.drawCover(x,ls,0,0,W,Y(SEA2)+2);
    else{ const sk=x.createLinearGradient(0,0,0,Y(SEA2));sk.addColorStop(0,'#a9d2e2');sk.addColorStop(1,'#f3ecd6');x.fillStyle=sk;x.fillRect(0,0,W,Y(SEA2)+2); }
    P(lf,b.far,.08,Y(SEA2-150),160*s); P(lm,b.mid,.18,Y(SEA2-90),100*s);
    x.fillStyle='rgba(255,255,255,.78)';for(let i=0;i<6;i++){const px=((i*330-cam*s*(.25+i%3*.12))%(W+400)+W+400)%(W+400)-200,cy=Y(60+(i*83)%260);x.beginPath();x.ellipse(px,cy,90*s+20,22*s+6,0,0,7);x.ellipse(px+50*s,cy-14*s,50*s+10,20*s+6,0,0,7);x.fill();}
    if(lb) A.drawLayer(x,lb,cam*s*.6,Y(SEA2)-4,H-Y(SEA2)+4,W); // boden = Meer unter dem Flieger
    else{ const sg=x.createLinearGradient(0,Y(SEA2),0,H);sg.addColorStop(0,'#7fb3c4');sg.addColorStop(1,'#4f8aa2');x.fillStyle=sg;x.fillRect(0,Y(SEA2),W,H); }
    x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=2.5;for(let r=0;r<3;r++){x.beginPath();for(let px=0;px<=W+10;px+=10)x.lineTo(px,Y(SEA2+6+r*22)+Math.sin((px+cam*s*(1+r*.3))*.04+G.t*2+r)*3);x.stroke();}
  }
}
function draw(){
  const g=G,x=ctx; if(!g) return; x.setTransform(DPR,0,0,DPR,0,0);
  const s=scale(), oy=(H-600*s)/2+(H>W?40:0), cam=g.x, SX=wx=>(wx-cam)*s, SY=wy=>oy+wy*s;
  if(g.bound){ const bx=SX(g.bound.x);
    if(bx<W){ x.save();x.beginPath();x.rect(0,0,Math.max(0,bx),H);x.clip();scene(x,g.mode,cam,s,oy);x.restore();
      x.save();x.beginPath();x.rect(bx,0,W-bx,H);x.clip();scene(x,g.seq[g.bound.to].m,cam,s,oy);x.restore();
      const gr=x.createLinearGradient(bx-50,0,bx+50,0);gr.addColorStop(0,'rgba(255,251,243,0)');gr.addColorStop(.5,'rgba(255,251,243,.75)');gr.addColorStop(1,'rgba(255,251,243,0)');x.fillStyle=gr;x.fillRect(bx-50,0,100,H);
    } else scene(x,g.mode,cam,s,oy);
  } else scene(x,g.mode,cam,s,oy);
  // Gegenstände
  g.items.forEach(it=>{ const px=SX(it.x); if(px<-120||px>W+120) return; const py=SY(it.y);
    if(it.good){ const bob=it.leap?0:Math.sin(g.t*4+it.x*.02)*4*s; x.fillStyle=it.star?'rgba(255,230,150,.55)':'rgba(255,251,235,.45)';x.beginPath();x.arc(px,py+bob,it.r*s*1.25,0,7);x.fill();
      spr(x,g.ic[it.k],px,py+bob,it.r*2.1*s,it.leap?Math.atan2(it.vy,300)*.8:0); }
    else { const hs=it.r*2.3*s*(it.big||1); if(it.dark){x.globalAlpha=.9;} spr(x,g.ic[it.k],px,py,hs); x.globalAlpha=1;
      if(it.dark){x.fillStyle='rgba(110,120,140,.35)';x.beginPath();x.ellipse(px,py+hs*.12,hs*.42,hs*.2,0,0,7);x.fill();} } });
  // Spielertier
  const fr=g.sprites[g.animal.id], f=fr[Math.floor(g.ph*8)%8], px=SX(g.x+pX()), py=SY(g.y);
  if(!(g.hurt>0&&Math.floor(g.hurt*12)%2)){
    if(g.mode==='land'){ x.fillStyle='rgba(60,45,25,.2)';x.beginPath();x.ellipse(px,SY(GROUND)+3,55*s*(1-(GROUND-g.y)/700),7*s,0,0,7);x.fill();
      const h=(g.animal.id==='compsognathus'?110:140)*s; spr(x,f,px,py-h/2+8*s,h); }
    else { const rot=DW.clamp(g.vy/900,-.45,.45), h=(g.mode==='luft'?(H>W?110:150):(H>W?100:120))*s; spr(x,f,px,py,h,rot); }
  }
  g.parts.forEach(p=>{x.globalAlpha=Math.min(1,p.l*1.5);x.fillStyle=p.c;x.beginPath();x.arc(SX(p.x),SY(p.y),p.r*s+1,0,7);x.fill();if(p.bub){x.strokeStyle='rgba(255,255,255,.9)';x.lineWidth=1;x.stroke();}});x.globalAlpha=1;
  if(g.done){ x.fillStyle=`rgba(255,251,243,${Math.min(.5,g.endT*.3)})`;x.fillRect(0,0,W,H); }
}
function finish(){
  const g=G; if(!g||g.fin) return; g.fin=true; if(stopLoop){stopLoop();stopLoop=null;}
  const m=Math.floor(g.x/50), ratio=g.spawned?g.got/g.spawned:0, stars=ratio>=.55?3:ratio>=.28?2:1;
  const st=GK.st(ID), best=Math.max(st.bestM||0,m), rec=m>(st.bestM||0)&&st.bestM; st.bestM=best; DW.save();
  const used=[...new Set(g.seq.map(s=>s.a.id))];
  G=null;
  GK.finish(root,{id:ID,stars,art:'<div class="gc-art">'+(GK.img(g.seq[g.seq.length-1].a.id,{mood:'happy'}))+'</div>',title:rec?'Neuer Rekord!':'Tolle Reise!',
    extra:`<p class="ew-sum">${GK.icon('fussabdruck','ew-ic')} ${m} m &nbsp; ${GK.icon('stern','ew-ic')} ${g.got}</p>
      <p class="ew-habs">${g.seq.map(s=>`<span>${GK.icon(MODES[s.m].icon)}${GK.img(s.a.id)}</span>`).join('')}</p>`,
    say:`Du bist ${m} Meter weit gereist und hast ${g.got} Sachen gesammelt. An Land rennen Dinos, im Meer schwimmen Meeresreptilien, in der Luft fliegen Flugsaurier.`,
    again:()=>start()});
}
DW.stations[ID]={title:'Endlose Welt',mount,unmount(){ if(stopLoop)stopLoop(); stopLoop=null; G=null; delete window.__endlosWin; delete window.__endlosInfo; }};
})();
