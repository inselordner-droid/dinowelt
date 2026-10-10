/* =====================================================================
   DINO-INSELWELT · Station Dino-Dschungel (Hüpf-Abenteuer)
   Ein kleiner Raptor hüpft durch den Urwald: über Äste, Baumstümpfe und
   Blätter. Er sammelt Früchte und Zapfen für seinen Pflanzenfresser-
   Freund und bringt verlorene Eier zurück ins Nest.
   3 kurze Etappen je Schwierigkeit. Wer herunterfällt, startet einfach
   auf der letzten sicheren Stelle neu – kein Game Over.
   ===================================================================== */
(function(){
"use strict";
const ID='dschungel';
/* Schwierigkeit: automatisch laufen?, Tempo, Lückenbreite, Muster, Doppelsprung */
const LV={1:{auto:true,speed:230,gap:[70,120],pat:['flat','gap','branch','stump'],dbl:true,len:2400},
          2:{auto:false,speed:290,gap:[90,160],pat:['flat','gap','branch','stump','pit','stairs'],dbl:true,len:2900},
          3:{auto:false,speed:310,gap:[110,190],pat:['gap','branch','stump','pit','stairs','moving','moving'],dbl:false,len:3400}};
/* Freunde am Ziel: Pflanzenfresser-Dinos (bekommen Früchte und Zapfen) – je Etappe ein anderer */
const FRIENDS=GK.pool(a=>DATA.isDino(a.id)&&a.food==='pflanzen'&&DATA.habitat(a.id)==='land').map(a=>a.id);
if(!FRIENDS.length) FRIENDS.push('parasaurolophus');
const GY=500, G=2500, JV=-880;

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
const icon=(n,h=128)=>bake('ic|'+n,()=>ART.icon(n),h);
/* Raptor-Laufbilder aus ART.frames (selbst gezeichnet), in Canvas-Bitmaps übertragen */
function raptorFrames(){ return ART.frames('velociraptor',8,{shadow:false}).map((im,i)=>{ const e={c:null}; const go=()=>{ if(!im.naturalWidth) return; const h=200,c=document.createElement('canvas'); c.height=h; c.width=Math.round(h*im.naturalWidth/im.naturalHeight); c.getContext('2d').drawImage(im,0,0,c.width,c.height); e.c=c; };
  if(im.complete&&im.naturalWidth) go(); else (im.ready||Promise.resolve()).then(go); return e; }); }
function band(w,h,col,base,amp,f,seed,grain){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  const y=(i,a)=>{const u=i/w*Math.PI*2;return base-amp*a*(.55*Math.sin(u*f+seed)+.3*Math.sin(u*f*2+seed*1.7)+.15*Math.sin(u*f*5+seed*.3));};
  x.fillStyle=col;for(let k=0;k<3;k++){x.globalAlpha=.45;x.beginPath();x.moveTo(0,h);for(let i=0;i<=w;i+=6)x.lineTo(i,y(i,1-k*.06)+k*7);x.lineTo(w,h);x.closePath();x.fill();}
  x.globalAlpha=.3;x.strokeStyle=ART.shade(col,.7);x.lineWidth=2.5;x.beginPath();for(let i=0;i<=w;i+=6)x.lineTo(i,y(i,1));x.stroke();
  x.globalAlpha=1;x.globalCompositeOperation='source-atop';for(let i=0;i<(grain||900);i++){x.fillStyle=Math.random()<.5?'rgba(20,40,20,.08)':'rgba(255,255,255,.08)';x.fillRect(Math.random()*w,Math.random()*h,2+Math.random()*3,2+Math.random()*3);}
  return c;}
function canopy(w,h){ // Blätterdach mit Lianen
  const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  for(let i=0;i<46;i++){x.globalAlpha=.35;x.fillStyle=['#5f8f55','#6f9f5f','#4f7f4a'][i%3];x.beginPath();x.ellipse((i*97)%w,20+(i*37)%60,60+(i*13)%50,34+(i*7)%20,0,0,7);x.fill();}
  x.globalAlpha=.8;x.strokeStyle='#5d7a3f';x.lineWidth=4;for(let i=0;i<9;i++){const vx=(i*191+60)%w,len=120+(i*67)%200;x.beginPath();x.moveTo(vx,30);x.bezierCurveTo(vx+20,len*.4,vx-20,len*.7,vx+6,len);x.stroke();
    x.fillStyle='#7fa66a';for(let k=1;k<6;k++){const t=k/6,ly=30+(len-30)*t;x.beginPath();x.ellipse(vx+Math.sin(t*6)*10+(k%2?8:-8),ly,9,5,k%2?.6:-.6,0,7);x.fill();}}
  x.globalAlpha=1;return c;}
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

let root,lv=1,S=null,stopLoop=null,cv,ctx,W=1,H=1,DPR=1,ART_BG=null;
const live=new Map(), carry=new Map();   // gehaltene Zeiger (id → Ort) · von der vorigen Etappe weiter gehaltene Knöpfe

function mount(r){ root=r;
  /* Gehaltene Finger merken: Jede Etappe baut die Knöpfe neu. Wer den Pfeil einfach weiter gedrückt hält, bekäme auf dem neuen
     Knopf nie ein pointerdown – der Dino bliebe am Start der nächsten Etappe stehen, obwohl der Finger auf dem Pfeil liegt. */
  live.clear();
  GK.listen(window,'pointerdown',e=>live.set(e.pointerId,[e.clientX,e.clientY]),true);
  GK.listen(window,'pointermove',e=>{ if(live.has(e.pointerId)) live.set(e.pointerId,[e.clientX,e.clientY]); },true);
  ['pointerup','pointercancel'].forEach(ev=>GK.listen(window,ev,e=>{ live.delete(e.pointerId); carry.forEach((c,key)=>{ if(c.id===e.pointerId){ carry.delete(key); if(S) S.in[key]=false; c.b.classList.remove('on'); } }); },true));
  const keys={ArrowLeft:'l',ArrowRight:'r',KeyA:'l',KeyD:'r'};
  GK.listen(window,'keydown',e=>{ if(!S) return; if(keys[e.code]){ S.in[keys[e.code]]=true; e.preventDefault(); } if(e.code==='Space'||e.code==='ArrowUp'||e.code==='KeyW'){ e.preventDefault(); if(!e.repeat) jumpPress(); S.in.j=true; } });
  GK.listen(window,'keyup',e=>{ if(!S) return; if(keys[e.code]) S.in[keys[e.code]]=false; if(e.code==='Space'||e.code==='ArrowUp'||e.code==='KeyW') S.in.j=false; });
  GK.listen(window,'resize',resize);
  intro(); }
function intro(){
  S=null;
  GK.intro(root,{id:ID,art:'<div class="gc-art">'+(GK.img('velociraptor')+GK.icon('fruechte')+GK.icon('palme'))+'</div>',title:'Dino-Dschungel',
    say:'Der kleine Raptor hüpft durch den Dschungel! Sammle Früchte für seinen Freund und bring die verlorenen Eier zurück ins Nest.',
    onStart:l=>{lv=l;begin();}});
}
function bgs(){ if(ART_BG) return ART_BG; ART_BG={far:band(1600,420,'#8fb58a',230,120,3,1.3,500),mid:band(1600,420,'#6f9a64',280,90,4,3.1),can:canopy(1600,360)}; return ART_BG; }

/* ---------- Level bauen ---------- */
function build(L,stage){
  const P=[],items=[]; let x=-200;
  const ground=(w)=>{P.push({x,y:GY,w,h:400,t:'ground',solid:true}); const s=x; x+=w; return s;};
  const fruitRow=(x0,y,n,arc)=>{for(let i=0;i<n;i++) items.push({x:x0+i*55,y:y-(arc?Math.sin(i/(n-1||1)*Math.PI)*arc:0),k:DW.pick(['fruechte','fruechte','zapfen'])});};
  ground(620); fruitRow(160,GY-60,4,0);
  const len=L.len+stage*400; let eggs=0;
  const gapW=()=>DW.rand(L.gap[0],L.gap[1])*(1+stage*.08);
  while(x<len){
    const p=DW.pick(L.pat);
    if(p==='flat'){ const s=ground(DW.rand(360,520)); fruitRow(s+80,GY-60,4,50); }
    else if(p==='gap'){ const g=gapW(); fruitRow(x+g/2-55,GY-150,3,30); x+=g; ground(DW.rand(300,460)); }
    else if(p==='branch'){ const s=ground(DW.rand(560,720)); const by=GY-130-(stage>0?20:0); P.push({x:s+120,y:by,w:220,h:24,t:'branch'}); fruitRow(s+150,by-50,3,0);
      if(!L.auto||stage>0){ P.push({x:s+380,y:by-120,w:190,h:24,t:'branch'}); if(eggs<3&&Math.random()<.7){items.push({x:s+475,y:by-175,k:'ei'});eggs++;} else fruitRow(s+400,by-170,3,0);} }
    else if(p==='stump'){ const s=ground(DW.rand(440,560)); const sh=DW.rand(60,95)+stage*8; P.push({x:s+170,y:GY-sh,w:90,h:sh,t:'stump',solid:true}); fruitRow(s+160,GY-sh-80,3,40); }
    else if(p==='pit'){ const g=DW.rand(300,380); const bx=x+g/2-80; P.push({x:bx,y:GY-60,w:160,h:24,t:'branch'}); fruitRow(bx+25,GY-120,3,0); x+=g; ground(DW.rand(320,440)); }
    else if(p==='stairs'){ const s=ground(DW.rand(640,760)); [0,1,2].forEach(i=>P.push({x:s+120+i*170,y:GY-100-i*95,w:150,h:24,t:'branch'})); if(eggs<3){items.push({x:s+120+2*170+75,y:GY-100-2*95-55,k:'ei'});eggs++;} fruitRow(s+140,GY-160,3,0); }
    else if(p==='moving'){ const g=DW.rand(360,440); P.push({x:x+g/2-75,y:GY-80,w:150,h:24,t:'leaf',mv:{bx:x+g/2-75,by:GY-80,ax:g/2-100,ay:0,sp:1.1+stage*.15,ph:Math.random()*6}}); fruitRow(x+g/2-55,GY-160,3,0); x+=g; ground(DW.rand(320,440)); }
  }
  // letzte Eier sicher unterbringen
  while(eggs<3){ const s=ground(420); P.push({x:s+120,y:GY-140,w:200,h:24,t:'branch'}); items.push({x:s+220,y:GY-195,k:'ei'}); eggs++; }
  const gx=ground(700)+300;
  return {P,items,goal:gx,total:items.filter(i=>i.k!=='ei').length};
}

function begin(){ S={stageI:0,fruits:0,total:0,eggs:0,falls:0}; stage(); }
function stage(){
  if(stopLoop)stopLoop(); GK.idle.stop();
  const L=LV[lv], lvl=build(L,S.stageI);
  root.innerHTML=`<div class="dj gc-wrap"><canvas class="gc-cv"></canvas><div class="gc-paper"></div>
    <div class="gc-hud dj-hud"><span class="gc-chip dj-f">${GK.icon('fruechte')}<b>${S.fruits}</b></span><span class="dj-stages">${[0,1,2].map(i=>`<i class="${i<S.stageI?'done':i===S.stageI?'on':''}"></i>`).join('')}</span><span class="gc-chip dj-e">${GK.icon('ei')}<b>${S.eggs}</b></span></div>
    ${L.auto?'':`<button class="gc-btn dj-l" type="button" aria-label="Nach links">${GK.icon('pfeil_l')}</button><button class="gc-btn dj-r" type="button" aria-label="Nach rechts">${GK.icon('pfeil_r')}</button>`}
    <button class="gc-btn dj-j" type="button" aria-label="Springen">${GK.icon('pfeil_r')}</button>
    <div class="gc-tip dj-tip"><span class="dj-hand">${GK.icon('hand')}</span>${GK.img('velociraptor')}</div></div>`;
  cv=root.querySelector('canvas'); ctx=cv.getContext('2d'); resize(); bgs(); paperOn();
  S.met=S.met||[]; const friend=DW.pick(FRIENDS.filter(f=>!S.met.includes(f)))||FRIENDS[0]; S.met.push(friend);
  Object.assign(S,{L,lvl,t:0,x:60,y:GY,vx:0,vy:0,face:1,gnd:null,coy:0,buf:0,air:0,jumps:0,ph:0,in:{l:false,r:false,j:false},
    safe:{x:60,y:GY},resp:0,parts:[],done:false,doneT:0,idleT:0,moved:false,friend,fallX:-1e9,fallN:0,camInit:false,
    hudF:root.querySelector('.dj-f'),hudE:root.querySelector('.dj-e'),
    fr:raptorFrames(),ic:{fruechte:icon('fruechte',96),zapfen:icon('zapfen',96),ei:icon('ei',96),farn:icon('farn',160),palme:icon('palme',260),blatt:icon('blatt',96),nest:icon('nest',140),moos:icon('moos',96)},
    fri:bake('djf|'+friend,()=>ART.animal(friend,{mood:'happy',shadow:false,flip:true}),220),camX:0});
  S.total+=lvl.total;
  const hold=(sel,key,down)=>{ const b=root.querySelector(sel); if(!b) return;
    b.addEventListener('pointerdown',e=>{e.preventDefault(); try{b.setPointerCapture(e.pointerId);}catch(_){} S.in[key]=true; b.classList.add('on'); if(down) down();});
    ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>{ if(S) S.in[key]=false; b.classList.remove('on'); }));
    carry.delete(key);
    if(key!=='j'){ const q=b.getBoundingClientRect(); for(const [id,[x,y]] of live){ if(x>=q.left&&x<=q.right&&y>=q.top&&y<=q.bottom){ S.in[key]=true; b.classList.add('on'); carry.set(key,{id,b}); break; } } } };
  hold('.dj-l','l'); hold('.dj-r','r'); hold('.dj-j','j',jumpPress);
  cv.addEventListener('pointerdown',e=>{ e.preventDefault(); if(L.auto){ jumpPress(); S.in.j=true; } });
  cv.addEventListener('pointerup',()=>{ if(S) S.in.j=false; });
  const nm=GK.name(friend);
  DW.say(S.stageI===0?(L.auto?'Der Raptor läuft von allein. Tippe, dann springt er!':'Mit den Pfeilen läufst du, mit dem großen Knopf springst du!')+` Am Ende wartet ${nm}.`:`Etappe ${S.stageI+1}! Weiter geht’s zu ${nm}.`);
  if(window.DW_DEBUG) window.__djState=()=>S&&{live:live.size,inp:Object.assign({},S.in),x:S.x,y:S.y,vx:S.vx,vy:S.vy,gnd:S.gnd?[S.gnd.x,S.gnd.y,S.gnd.w,S.gnd.t,S.gnd.mv?1:0]:null,done:S.done,stage:S.stageI,resp:S.resp>0,falls:S.falls,fruits:S.fruits,eggs:S.eggs,goal:S.lvl.goal,auto:S.L.auto,dbl:S.L.dbl,speed:S.L.speed,cam:S.camX,
    P:S.lvl.P.filter(p=>p.x+p.w>S.x-100&&p.x<S.x+900).map(p=>[Math.round(p.x),Math.round(p.y),Math.round(p.w),p.t,p.solid?1:0,p.mv?1:0])};
  if(window.DW_DEBUG) window.__dschungelWin=()=>{ if(!S) return; S.fruits+=S.lvl.items.filter(i=>!i.got&&i.k!=='ei').length; S.eggs+=S.lvl.items.filter(i=>!i.got&&i.k==='ei').length; S.lvl.items.forEach(i=>i.got=1); S.x=S.lvl.goal+1; S.y=GY; S.vy=0; };
  /* Physik in festen kleinen Schritten (1/120 s): gleiche Sprunghöhe und -weite bei 30, 60 oder 120 Bildern pro Sekunde */
  stopLoop=GK.loop(dt=>{ if(!S) return false; let left=dt, n=0; while(left>1e-6&&S&&n++<8){ const h=Math.min(left,1/120); step(h); left-=h; } if(!S) return false; draw(dt); return true; });
}
function jumpPress(){ if(!S||S.done) return; S.buf=.13; S.moved=true; hideTip(); }
function hideTip(){ const t=root.querySelector('.dj-tip'); if(t) t.classList.add('hide'); }

/* ---------- Physik ---------- */
function step(dt){
  const s=S,L=s.L; s.t+=dt;
  // bewegliche Blätter
  s.lvl.P.forEach(p=>{ if(!p.mv) return; const m=p.mv, nx=m.bx+Math.sin(s.t*m.sp+m.ph)*m.ax, ny=m.by+Math.sin(s.t*m.sp*1.3+m.ph)*m.ay; p.dx=nx-p.x; p.dy=ny-p.y; p.x=nx; p.y=ny; });
  if(s.done){ s.doneT+=dt; s.ph=(s.ph+dt*1.5)%1; if(s.doneT>2.4) nextStage(); return; }
  if(s.resp>0){ s.resp-=dt; if(s.resp<=0){ s.x=s.safe.x; s.y=s.safe.y-2; s.vx=0; s.vy=0; } return; }
  // Eingabe
  let dir=L.auto?1:(s.in.r?1:0)-(s.in.l?1:0); if(dir) { s.face=dir; s.moved=true; hideTip(); }
  const target=dir*L.speed; s.vx+=(target-s.vx)*Math.min(1,dt*(s.gnd?12:6)); if(!dir&&Math.abs(s.vx)<.5) s.vx=0;   // steht ganz (sonst läuft der Wert endlos gegen 1e-323)
  if(s.gnd&&s.gnd.mv){ s.x+=s.gnd.dx||0; s.y+=s.gnd.dy||0; }
  // horizontal
  const hw=26, hh=62;
  s.x+=s.vx*dt; if(s.x<-150) s.x=-150;
  s.lvl.P.forEach(p=>{ if(!p.solid) return; if(s.y>p.y+4&&s.y-hh<p.y+p.h&&s.x+hw>p.x&&s.x-hw<p.x+p.w){ if(s.x<p.x+p.w/2) s.x=p.x-hw; else s.x=p.x+p.w+hw; s.vx=0; } });
  // Sprung
  if(s.buf>0) s.buf-=dt; if(s.coy>0) s.coy-=dt;
  if(s.buf>0&&(s.gnd||s.coy>0)){ s.vy=JV; s.gnd=null; s.coy=0; s.buf=0; s.jumps=1; DW.sfx('jump'); dust(4); }
  else if(s.buf>0&&!s.gnd&&L.dbl&&s.jumps<2){ s.vy=JV*.8; s.jumps=2; s.buf=0; DW.sfx('jump'); puff(s.x,s.y-30,'#e8f3d8',8); }
  // vertikal
  const prevY=s.y; s.vy+=(s.vy<0&&s.in.j?G*.72:G)*dt; s.vy=Math.min(s.vy,1300); s.y+=s.vy*dt;
  if(s.y<150){ s.y=150; s.vy=Math.max(s.vy,0); }
  const was=s.gnd; s.gnd=null;
  if(s.vy>=0) for(const p of s.lvl.P){ if(s.x+hw*.7>p.x&&s.x-hw*.7<p.x+p.w&&prevY<=p.y+2+(p.mv?Math.abs(p.dy||0)+2:0)&&s.y>=p.y){ s.y=p.y; s.vy=0; s.gnd=p; s.jumps=0; break; } }
  if(s.gnd&&!was&&s.air>.25){ DW.sfx('step'); dust(5); }
  /* letzte sichere Stelle merken. Läuft der Raptor von allein (Leicht), bleibt sie ein gutes Stück vor der Kante –
     sonst stand er nach dem Zurücksetzen direkt am Abgrund und fiel ohne Zeit zum Reagieren gleich wieder hinein. */
  if(s.gnd){ s.air=0; const g0=s.gnd, back=L.auto?Math.min(190,g0.w*.45):30;
    if(!g0.mv&&s.x>g0.x+30&&s.x<g0.x+g0.w-30){ const sx=Math.max(g0.x+30,Math.min(s.x,g0.x+g0.w-back)); if(!L.auto||sx>=s.safe.x||g0.y!==s.safe.y) s.safe={x:sx,y:g0.y}; } }
  else { s.air+=dt; if(was) s.coy=.1; }
  s.ph=(s.ph+dt*Math.abs(s.vx)/140)%1;
  // Herunterfallen → sanft zurück auf die letzte sichere Stelle
  if(s.y>GY+320){ s.resp=.8; S.falls++; DW.sfx('whoosh'); puff(s.safe.x,s.safe.y-40,'#fff6c8',14);
    /* zweimal an derselben Stelle gefallen: Sprungknopf zeigen und sagen, was hilft (im Selbstlauf gab es sonst nie einen Hinweis) */
    if(Math.abs(s.safe.x-s.fallX)<40) s.fallN++; else { s.fallN=1; s.fallX=s.safe.x; }
    if(s.fallN>=2&&s.fallN%2===0){ GK.pulse(root.querySelector('.dj-j')); const t=root.querySelector('.dj-tip'); if(t&&L.auto) t.classList.remove('hide'); DW.say('Tippe zum Springen!'); }
    else if(S.falls===1||Math.random()<.35) DW.say(DW.pick(['Hoppla! Nochmal von hier.','Platsch! Macht nichts – weiter geht’s.','Uii! Probier es nochmal.'])); }
  // Sammeln
  s.lvl.items.forEach(it=>{ if(it.got) return; if(Math.abs(it.x-s.x)<44&&Math.abs(it.y-(s.y-34))<52){ it.got=1;
    if(it.k==='ei'){ S.eggs++; DW.sfx('egg'); puff(it.x,it.y,'#f3ead6',12); if(S.eggs===1) DW.say('Ein verlorenes Ei! Das bringen wir ins Nest.'); upd('.dj-e',S.eggs); }
    else { S.fruits++; DW.sfx('pop'); puff(it.x,it.y,it.k==='zapfen'?'#c9a063':'#e07a5a',6); upd('.dj-f',S.fruits); if(it.k==='zapfen'&&!S.saidZ){S.saidZ=1;DW.say('Ein Zapfen! Viele Pflanzenfresser mochten Zapfen und Farn.');} } } });
  s.parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=600*dt;p.l-=dt;}); s.parts=s.parts.filter(p=>p.l>0);
  // Leerlauf-Hilfe
  if(Math.abs(s.vx)<5&&!s.done){ s.idleT+=dt; if(s.idleT>6.5){ s.idleT=-7; GK.pulse(root.querySelector(L.auto?'.dj-j':'.dj-r')); DW.say(L.auto?'Tippe zum Springen!':'Drück auf den Pfeil nach rechts!'); } } else s.idleT=0;
  // Ziel
  if(s.x>=s.lvl.goal-40&&s.gnd){ s.done=true; s.doneT=0; s.vx=0; DW.sfx('ok'); puff(s.lvl.goal+60,GY-80,'#f0c35a',16);
    DW.say(S.stageI<2?`Geschafft! ${GK.name(s.friend)} freut sich über die Früchte!`:'Hurra! Alle Etappen geschafft!'); }
}
function upd(sel,v){ const el=sel==='.dj-f'?S.hudF:S.hudE; if(el&&el.isConnected){ el.querySelector('b').textContent=v; GK.ok(el); } }
function dust(n){ puff(S.x,S.y,'rgba(150,120,80,.6)',n); }
function puff(x,y,c,n){ for(let i=0;i<n;i++) S.parts.push({x,y,vx:DW.rand(-160,160),vy:DW.rand(-260,-40),l:DW.rand(.4,.8),c,r:DW.rand(3,7)}); }
function nextStage(){
  if(!S) return;
  if(S.stageI<2){ S.stageI++; stage(); return; }
  if(stopLoop){stopLoop();stopLoop=null;}
  const r=S.total?S.fruits/S.total:0, stars=r>=.7&&S.eggs>=6?3:r>=.4?2:1, f=S.fruits, e=S.eggs, fr=S.friend; S=null;
  DW.discover('velociraptor',true);
  GK.finish(root,{id:ID,stars,art:'<div class="gc-art">'+(GK.img('velociraptor',{mood:'happy'})+GK.img(fr,{mood:'happy',flip:true}))+'</div>',title:'Dschungel-Held!',
    extra:`<p class="dj-sum">${GK.icon('fruechte','dj-ic')} ${f} &nbsp; ${GK.icon('ei','dj-ic')} ${e}</p>`,
    say:`Super gehüpft! Du hast ${f} Früchte und ${e} Eier gesammelt. Die Eier sind jetzt sicher im Nest.`,again:()=>begin()});
}

/* ---------- Zeichnen ---------- */
function resize(){ if(!cv||!cv.isConnected||!cv.clientWidth||!cv.clientHeight) return; W=cv.clientWidth; H=cv.clientHeight; DPR=dprFor(W,H);
  const w=Math.round(W*DPR), h=Math.round(H*DPR); if(cv.width!==w||cv.height!==h){ cv.width=w; cv.height=h; } }
function draw(dt){
  const s=S,x=ctx; if(!s) return; x.setTransform(DPR,0,0,DPR,0,0);
  const portrait=H>W*1.05, sc=portrait?Math.min(W/520,(H-150)/620):Math.min(H/620,W/700), vw=W/sc;
  const oy=portrait?Math.max(0,H-150-600*sc):(H-600*sc)*.6;
  /* Kamera folgt zeitbasiert (vorher fester Anteil pro Bild: bei 30 Hz träge, bei 120 Hz hektisch) */
  const want=s.x-vw*(portrait?.3:.36); if(!s.camInit||Math.abs(want-s.camX)>400){ s.camX=want; s.camInit=true; } else s.camX+=(want-s.camX)*(1-Math.pow(.88,(dt||1/60)*60));
  const cam=s.camX, X=v=>(v-cam)*sc, Y=v=>oy+v*sc;
  // Himmel & Licht
  // eigene Landschaft: grafiken-neu/landschaften/dschungel_himmel|hinten|mitte|boden (boden = Sumpf unten; Plattformen bleiben gezeichnet)
  const A=window.ASSETS, LY=k=>A&&A.layer?A.layer('dschungel',k):null, ls=LY('himmel'), lf=LY('hinten'), lm=LY('mitte'), lb=LY('boden');
  if(ls) A.drawCover(x,ls,0,0,W,H);
  else{ const sk=x.createLinearGradient(0,0,0,H);sk.addColorStop(0,'#d8e8c8');sk.addColorStop(.6,'#eef0d2');sk.addColorStop(1,'#cfdcb0');x.fillStyle=sk;x.fillRect(0,0,W,H); }
  x.fillStyle='rgba(255,250,210,.22)';for(let i=0;i<4;i++){const px=((i*380-cam*sc*.1)%(W+500)+W+500)%(W+500)-250;x.beginPath();x.moveTo(px,0);x.lineTo(px+90,0);x.lineTo(px+260,H);x.lineTo(px+150,H);x.fill();}
  const par=(img,f,y,h)=>{const w=img.width*h/img.height,off=-((cam*sc*f)%w+w)%w;for(let px=off;px<W;px+=w)x.drawImage(img,px,y,w,h);};
  if(lf) A.drawLayer(x,lf,cam*sc*.15,Y(GY-380),420*sc,W); else par(ART_BG.far,.15,Y(GY-380),420*sc);
  for(let i=-1;i<vw/260+2;i++){const k=Math.floor(cam*.4/260)+i,px=(k*260-cam*.4)*sc;spr(x,s.ic.palme,px+40*sc,Y(GY-150),300*sc*(.8+((k*37)%10)/30));}
  if(lm) A.drawLayer(x,lm,cam*sc*.3,Y(GY-260),300*sc,W); else par(ART_BG.mid,.3,Y(GY-260),300*sc);
  // Sumpf in den Lücken
  if(lb) A.drawLayer(x,lb,cam*sc*.6,Y(GY+40),H-Y(GY+40),W); else{ x.fillStyle='#5d7a5a';x.fillRect(0,Y(GY+40),W,H);x.fillStyle='#6f9fae';x.fillRect(0,Y(GY+150),W,H); }
  x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=2;x.beginPath();for(let px=0;px<=W;px+=12)x.lineTo(px,Y(GY+150)+Math.sin(px*.05+s.t*2)*3);x.stroke();
  // Plattformen
  s.lvl.P.forEach(p=>{ const a=X(p.x),b=X(p.x+p.w); if(b<-60||a>W+60) return;
    if(p.t==='ground'){ x.fillStyle='#8a6b4a';x.beginPath();x.roundRect(a,Y(p.y),b-a,H-Y(p.y)+20,[18*sc,18*sc,0,0]);x.fill();
      x.fillStyle='rgba(60,40,20,.15)';for(let k=0;k<(b-a)/60;k++){x.beginPath();x.ellipse(a+30+k*60,Y(p.y+60+(k%3)*40),14*sc,5*sc,0,0,7);x.fill();}
      x.fillStyle='#7fa66a';x.beginPath();x.roundRect(a-4,Y(p.y)-6*sc,b-a+8,22*sc,10*sc);x.fill();
      x.fillStyle='#8fbf6a';for(let k=0;k<(b-a)/26;k++){x.beginPath();x.moveTo(a+k*26,Y(p.y)-4);x.lineTo(a+k*26+6,Y(p.y)-16*sc);x.lineTo(a+k*26+12,Y(p.y)-4);x.fill();} }
    else if(p.t==='stump'){ x.fillStyle='#8a6d4a';x.beginPath();x.roundRect(a,Y(p.y),b-a,Y(GY)-Y(p.y)+6,6*sc);x.fill();x.strokeStyle='rgba(60,40,20,.3)';x.lineWidth=2;for(let k=1;k<3;k++){x.beginPath();x.moveTo(a+(b-a)*k/3,Y(p.y)+8);x.lineTo(a+(b-a)*k/3,Y(GY));x.stroke();}
      x.fillStyle='#d9b88a';x.beginPath();x.ellipse((a+b)/2,Y(p.y),(b-a)/2,10*sc,0,0,7);x.fill();x.strokeStyle='#a8845a';x.beginPath();x.ellipse((a+b)/2,Y(p.y),(b-a)/4,5*sc,0,0,7);x.stroke(); }
    else if(p.t==='branch'){ x.fillStyle='rgba(110,85,60,.8)';x.fillRect((a+b)/2-7*sc,Y(p.y),14*sc,Y(GY+40)-Y(p.y));
      x.fillStyle='#8a6d4a';x.beginPath();x.roundRect(a,Y(p.y)-4*sc,b-a,20*sc,10*sc);x.fill();x.fillStyle='rgba(255,240,210,.25)';x.fillRect(a+8,Y(p.y)-1,b-a-16,4*sc);
      spr(x,s.ic.blatt,a+4,Y(p.y)+6*sc,40*sc);spr(x,s.ic.blatt,b-4,Y(p.y)+4*sc,36*sc,true); }
    else { x.fillStyle='#7fb36a';x.beginPath();x.ellipse((a+b)/2,Y(p.y)+6*sc,(b-a)/2+8,16*sc,0,0,7);x.fill();x.strokeStyle='#4f7a45';x.lineWidth=2;x.beginPath();x.moveTo(a,Y(p.y)+6*sc);x.lineTo(b,Y(p.y)+6*sc);x.stroke(); }
  });
  // Ziel: Nest und Freund
  const gx=X(s.lvl.goal); if(gx>-200&&gx<W+300){ spr(x,s.ic.nest,gx+70*sc,Y(GY)+6*sc,90*sc); spr(x,s.fri,gx+250*sc,Y(GY)+4*sc,170*sc*(s.done?1+Math.abs(Math.sin(s.doneT*8))*.04:1));
    x.fillStyle='#c8553d';x.fillRect(gx-60*sc,Y(GY-190),5*sc,190*sc);x.beginPath();x.moveTo(gx-55*sc,Y(GY-190));x.lineTo(gx+10*sc,Y(GY-170)+Math.sin(s.t*5)*4);x.lineTo(gx-55*sc,Y(GY-150));x.fill(); }
  // Sammelsachen
  s.lvl.items.forEach(it=>{ if(it.got) return; const px=X(it.x); if(px<-40||px>W+40) return; const bob=Math.sin(s.t*4+it.x*.03)*5*sc;
    if(it.k==='ei'){x.fillStyle='rgba(255,240,180,.45)';x.beginPath();x.arc(px,Y(it.y)+bob,34*sc,0,7);x.fill();}
    spr(x,s.ic[it.k],px,Y(it.y)+22*sc+bob,(it.k==='ei'?50:44)*sc); });
  // Raptor
  if(s.resp<=0||Math.floor(s.resp*10)%2){ const f=s.gnd?(Math.abs(s.vx)>20?s.fr[Math.floor(s.ph*8)%8]:s.fr[0]):s.fr[s.vy<0?2:6];
    const rx=s.resp>0?X(s.safe.x):X(s.x), ry=s.resp>0?Y(s.safe.y):Y(s.y);
    x.fillStyle='rgba(40,30,20,.2)';if(s.gnd){x.beginPath();x.ellipse(rx,ry+2,40*sc,6*sc,0,0,7);x.fill();}
    spr(x,f,rx,ry+6*sc,95*sc,s.face<0); }
  s.parts.forEach(p=>{x.globalAlpha=Math.min(1,p.l*1.6);x.fillStyle=p.c;x.beginPath();x.arc(X(p.x),Y(p.y),p.r*sc+1,0,7);x.fill();});x.globalAlpha=1;
  // Vordergrund: Lianen oben, Farne unten
  par(ART_BG.can,.9,-20*sc+Math.min(0,oy-40),260*sc+Math.max(0,oy*.3));
  for(let i=-1;i<vw/420+2;i++){const k=Math.floor(cam*1.3/420)+i,px=(k*420-cam*1.3)*sc;spr(x,s.ic.farn,px,H+20,150*sc*(.9+((k*29)%10)/25));}
  // Fortschritt
  const pw=Math.min(300,W*.5),px0=(W-pw)/2,py=68; const u=DW.clamp(s.x/s.lvl.goal,0,1);
  x.fillStyle='rgba(255,251,243,.75)';x.beginPath();x.roundRect(px0-8,py-8,pw+16,16,8);x.fill();x.fillStyle='#8fbf7a';x.beginPath();x.roundRect(px0,py-3,pw*u,6,3);x.fill();
}
DW.stations[ID]={title:'Dino-Dschungel',mount,unmount(){ if(stopLoop)stopLoop(); stopLoop=null; S=null; delete window.__dschungelWin; delete window.__djState; }};
})();
