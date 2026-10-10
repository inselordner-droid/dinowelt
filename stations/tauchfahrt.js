/* =====================================================================
   DINO-INSELWELT · Station Tauchfahrt
   Seitlich scrollendes Schwimmspiel: Du bist ein Ichthyosaurus, frisst
   Fische und musst regelmäßig zum Luftholen auftauchen – denn
   Meeresreptilien atmeten Luft. Anstoßen bremst nur, kein Game Over.
   ===================================================================== */
(function(){
"use strict";
const ID='tauchfahrt';
const LV={1:{dur:60,air:22,speed:170,obst:.25,goal:14},2:{dur:75,air:17,speed:200,obst:.45,goal:22},3:{dur:90,air:13,speed:230,obst:.65,goal:30}};

let root, lv=1, G=null, cv, ctx, DPR=1, W=0, H=0, plays=0, bound=false, CR=null, rzT=null;
/* Bilder (SVG/PNG) einmal in der gebrauchten Größe rastern – nicht bei jedem Bild neu skalieren */
const BMP=new WeakMap();
function bmp(im,w){ if(!im||!im.complete||!im.naturalWidth) return null; const pw=Math.max(4,Math.round(w*DPR)); let e=BMP.get(im);
  if(!e||e.width!==pw){ e=document.createElement('canvas'); e.width=pw; e.height=Math.max(4,Math.round(pw*im.naturalHeight/im.naturalWidth)); e.getContext('2d').drawImage(im,0,0,e.width,e.height); BMP.set(im,e); }
  return e; }
// Luftatmer, die Fische fraßen: beim ersten Mal der Fischsaurier, danach abwechselnd andere
const SWIM=[
 {id:'ichthyosaurus',hi:'',breath:'Pfff! Luft holen! Fischsaurier atmeten mit Lungen, genau wie wir.',end:'Und du weißt jetzt: Fischsaurier mussten zum Atmen auftauchen.'},
 {id:'plesiosaurus',hi:'Diesmal bist du ein Plesiosaurus! Auch er musste zum Atmen auftauchen.',breath:'Pfff! Luft holen! Plesiosaurier waren Reptilien und atmeten mit Lungen.',end:'Und du weißt jetzt: Plesiosaurier mussten zum Atmen auftauchen.'},
 {id:'mosasaurus',hi:'Diesmal bist du ein Mosasaurus! Auch er musste zum Atmen auftauchen.',breath:'Pfff! Luft holen! Mosasaurier waren Meeres-Echsen und atmeten mit Lungen.',end:'Und du weißt jetzt: Mosasaurier mussten zum Atmen auftauchen.'},
 {id:'dorudon',hi:'Diesmal bist du ein Urwal! Wale atmen Luft – auch er musste auftauchen.',breath:'Pfff! Luft holen! Wale atmen durch ein Blasloch.',end:'Und du weißt jetzt: Wale müssen zum Atmen auftauchen.'},
 {id:'liopleurodon',hi:'Diesmal bist du ein Liopleurodon! Auch er musste zum Atmen auftauchen.',breath:'Pfff! Luft holen! Liopleurodon war ein Reptil und atmete mit Lungen.',end:'Und du weißt jetzt: Meeresreptilien mussten zum Atmen auftauchen.'},
];
const img=(svg,k)=>ART.toImage(svg,'tf|'+k);
function mount(r){ root=r; plays=0; bound=false; intro(); }
function intro(){
  GK.intro(root,{id:ID, art:`<div class="sd-iart">${GK.img('ichthyosaurus')}${GK.icon('blase')}${GK.icon('fisch')}</div>`, title:'Tauchfahrt',
    say:'Du bist ein Fischsaurier! Friss viele Fische. Aber denk daran: Fischsaurier atmeten Luft. Schwimm immer wieder nach oben zum Luftholen!',
    onStart:l=>{ lv=l; play(); }});
}
function play(){
  const P=LV[lv], sw=plays++===0?SWIM[0]:DW.pick(SWIM.slice(1).filter(x=>ART.has((DATA.animal(x.id)||{}).art)));
  root.innerHTML=`<div class="sd-stage tf" id="tfStage"><canvas id="tfCv"></canvas>
    <div class="tf-hud"><div class="tf-air" id="tfAir" aria-label="Luft">${[...Array(5)].map(()=>`<span>${ART.icon('blase')}</span>`).join('')}</div>
      <div class="stars tf-fish" id="tfFish">${ART.icon('fisch')}<b>0</b></div></div>
    <div class="bubble tf-tip" id="tfTip"><div class="who">${DW.animalSVG(sw.id,{shadow:false})}</div><p>Zieh den Finger hoch und runter. Oben an der Luft holst du Atem!</p></div></div>`;
  cv=root.querySelector('#tfCv'); ctx=cv.getContext('2d');
  resize(); if(!bound){ bound=true; GK.listen(window,'resize',()=>{ clearTimeout(rzT); rzT=setTimeout(resize,100); });
    GK.listen(window,'keydown',e=>{ if(!G||G.done) return; if(e.code==='ArrowUp'){G.ty=Math.max(H*.08,G.ty-H*.12);e.preventDefault();} if(e.code==='ArrowDown'){G.ty=Math.min(H*.9,G.ty+H*.12);e.preventDefault();} }); }
  G={P,t:0,dist:0,y:H*.5,ty:H*.5,vy:0,air:1,fish:0,outs:0,slow:0,hurt:0,items:[],parts:[],next:1.2,low:false,breathSaid:false,done:false,lastIn:0,lastPoke:0,
    hud:{air:root.querySelector('#tfAir'),spans:DW.$$('#tfAir span',root),fish:root.querySelector('#tfFish b'),n:5,low:false,f:0},
    sw,frames:ART.frames(sw.id,8,{shadow:false}),ph:0,
    im:{fisch:img(ART.icon('fisch'),'fisch'),fisch2:img(ART.icon('fisch').replace(/#8fb0c8/g,'#e0a86a'),'fisch2'),qualle:img(ART.icon('qualle'),'qualle'),
      tinte:img(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M8 30q0-10 16-10h18q8 0 12 10-4 10-12 10H24Q8 40 8 30z" fill="#d99a8a" stroke="#3d3226" stroke-width="1.6"/><path d="M50 26l10-6M52 30h10M50 34l10 6" stroke="#c07a6a" stroke-width="3" stroke-linecap="round"/><circle cx="44" cy="28" r="2.4" fill="#3d3226"/></svg>`,'tinte'),
      amm:img(ART.animal('ammonit',{shadow:false}),'amm')},
    far:layer('#2f6f86',.55,3), mid:layer('#245c70',.75,5)};
  /* Lage der Fläche merken statt bei jeder Bewegung zu messen; Bewegung zählt als „Kind spielt“ (Leerlauf-Hilfe schweigt) */
  const setY=e=>{ if(!G) return; if(!CR) CR=cv.getBoundingClientRect(); G.ty=DW.clamp(e.clientY-CR.top,H*.08,H*.9); G.lastIn=G.t;
    if(G.t-G.lastPoke>2){ G.lastPoke=G.t; GK.idle.poke(); } };
  GK.listen(cv,'pointerdown',e=>{ e.preventDefault(); CR=cv.getBoundingClientRect(); setY(e); try{cv.setPointerCapture(e.pointerId);}catch(_){} const t=root.querySelector('#tfTip'); if(t) t.classList.add('hide'); });
  GK.listen(cv,'pointermove',e=>{ if(e.buttons||e.pointerType==='mouse') setY(e); });
  GK.after(4500,()=>{ const t=root.querySelector('#tfTip'); if(t) t.classList.add('hide'); });
  if(sw.hi) DW.say(sw.hi);
  DW.say('Zieh den Finger hoch und runter. Friss die Fische! Und oben an der Luft holst du Atem.',{queue:!!sw.hi});
  /* Hilfe nur, wenn wirklich nichts passiert (vorher kam der Satz nach 13 s mitten ins Spiel, auch wenn das Kind steuerte) */
  GK.idle.set(()=>{},()=>{ if(G&&!G.done&&G.t-G.lastIn>9) DW.say('Zieh den Finger nach oben oder unten!'); });
  GK.loop((dt,T)=>{ if(!G||G.done) return false; step(dt); draw(T); });
}
function resize(){ if(!cv||!cv.isConnected||!cv.clientWidth||!cv.clientHeight) return; const H0=H; W=cv.clientWidth; H=cv.clientHeight; CR=cv.getBoundingClientRect();
  /* Auflösung begrenzen: höchstens ~2,6 Mio. Bildpunkte pro Bild */
  DPR=Math.min(2,devicePixelRatio||1,Math.sqrt(2.6e6/(W*H))); cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR);
  // beim Drehen alles mitskalieren, damit Felsen am Boden bleiben
  if(G&&H0&&H&&H0!==H){ const k=H/H0; G.y*=k; G.ty*=k; G.items.forEach(it=>{ it.y*=k; if(it.t==='rock') it.h*=k; }); } }
function layer(col,base,freq){ const w=1200,h=300,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle=col;x.beginPath();x.moveTo(0,h);
  for(let i=0;i<=w;i+=10){const u=i/w*Math.PI*2;x.lineTo(i,h*base-h*.25*(.5+.3*Math.sin(u*freq)+.2*Math.sin(u*freq*2.7+1)));}x.lineTo(w,h);x.fill();
  for(let k=0;k<14;k++){ // Seelilien / Tang
    const px=Math.random()*w, py=h*base-h*.05; x.strokeStyle=ART.shade(col,1.25); x.lineWidth=3; x.beginPath(); x.moveTo(px,h); x.quadraticCurveTo(px+10,py,px+Math.random()*16-8,py-40-Math.random()*50); x.stroke(); }
  return c; }
const surf=()=>H*.14;
function spawn(){
  const g=G, P=g.P, x0=W+80, sy=surf();
  const r=Math.random();
  if(r<P.obst*.45){ // Fels vom Boden
    const hgt=H*DW.rand(.2,.36); g.items.push({t:'rock',x:x0,y:H-hgt,w:DW.rand(70,120),h:hgt,seed:Math.random()});
    const fy=DW.rand(sy+60,H-hgt-60); for(let i=0;i<3;i++) g.items.push({t:'food',k:'fisch',x:x0+i*58,y:fy+Math.sin(i)*14,w:54,h:36});
  } else if(r<P.obst){ // Quallen
    const qy=DW.rand(sy+80,H*.8); g.items.push({t:'jelly',x:x0,y:qy,w:58,h:58,ph:Math.random()*6});
    const fy=qy>H*.5?qy-120:qy+120; for(let i=0;i<3;i++) g.items.push({t:'food',k:'fisch',x:x0+60+i*58,y:fy,w:54,h:36});
  } else { // Fischschwarm oder Tintenfische
    const fy=DW.rand(sy+50,H*.85), k=Math.random()<.25?(Math.random()<.5?'tinte':'amm'):'fisch', n=k==='fisch'?DW.pick([3,4,5]):2;
    for(let i=0;i<n;i++) g.items.push({t:'food',k:k==='fisch'&&i%2?'fisch2':k,x:x0+i*56,y:fy+Math.sin(i*1.3)*22,w:k==='amm'?48:54,h:k==='amm'?48:36});
  }
  const k=Math.max(.8,Math.min(200,W*.28)/170); g.items.forEach(it=>{ if(!it.sc&&it.t!=='rock'){ it.sc=1; it.w*=k; it.h*=k; } });
  g.next=DW.rand(1.1,1.9)*(200/P.speed);
}
function step(dt){
  const g=G, P=g.P; g.t+=dt;
  const sp=P.speed*(g.slow>0?.45:1)*(g.air<=0?.6:1); g.dist+=sp*dt; g.ph=(g.ph+dt*1.6)%1;
  g.next-=dt; if(g.next<=0) spawn();
  if(g.slow>0) g.slow-=dt; if(g.hurt>0) g.hurt-=dt;
  // Steuerung
  let ty=g.ty; if(g.air<=0) ty=surf()-6;
  g.vy+=(ty-g.y)*6*dt; g.vy*=Math.pow(.02,dt); g.y+=g.vy*dt*4; g.y=DW.clamp(g.y,surf()-14,H*.93);
  // Luft
  const atTop=g.y<surf()+18;
  if(atTop){ if(g.air<.98&&!g.breathing){ g.breathing=true; DW.sfx('whoosh'); for(let i=0;i<10;i++) g.parts.push({x:W*.22+30,y:surf()-6,vx:DW.rand(-40,40),vy:DW.rand(-180,-80),l:.8,c:'#ffffff'});
      if(!g.breathSaid){ g.breathSaid=true; DW.say(g.sw.breath); } }
    g.air=Math.min(1,g.air+dt*.9); if(g.air>=1) g.breathing=false; g.low=false; }
  else { g.breathing=false; const before=g.air; g.air=Math.max(0,g.air-dt/P.air);
    if(g.air<.3&&!g.low){ g.low=true; DW.say(DW.pick(['Die Luft wird knapp! Schwimm nach oben!','Luft holen! Ab nach oben!'])); }
    if(before>0&&g.air<=0){ g.outs++; DW.sfx('bump'); DW.say('Puh, schnell nach oben zum Atmen!'); } }
  // Gegenstände
  const pw=Math.min(200,W*.28), hx=W*.22+pw*.34, hy=g.y;
  g.items.forEach(it=>{ it.x-=sp*dt; if(it.t==='jelly') it.y+=Math.sin(g.t*1.5+it.ph)*20*dt;
    if(it.hit) return;
    if(it.t==='food'){ if(Math.abs(it.x-hx)<it.w*.6+pw*.12&&Math.abs(it.y-hy)<it.h*.6+pw*.1){ it.hit=true; g.fish++; DW.sfx('chew'); burst(it.x,it.y,'#f3ead6'); if(g.fish%10===0) DW.say(g.fish+' Fische! Lecker!'); } }
    else { const bx=W*.22-pw*.35, bw=pw*.8, by=g.y-pw*.1, bh=pw*.2;
      const ox=it.t==='rock'?it.x-it.w/2:it.x-it.w*.35, ow=it.t==='rock'?it.w:it.w*.7, oy=it.t==='rock'?it.y+10:it.y-it.h*.35, oh=it.t==='rock'?it.h:it.h*.7;
      if(g.hurt<=0&&ox<bx+bw&&ox+ow>bx&&oy<by+bh&&oy+oh>by){ it.hit=true; g.slow=1.2; g.hurt=1.4; DW.sfx('bump'); DW.say(DW.pick(['Hoppla!','Autsch, langsam!','Uff! Weiter geht’s.'])); } } });
  g.items=g.items.filter(it=>it.x>-160&&!(it.hit&&it.t==='food'));
  g.parts.forEach(p=>{p.x+=p.vx*dt-sp*dt*.3;p.y+=p.vy*dt;p.vy+=300*dt;p.l-=dt;}); g.parts=g.parts.filter(p=>p.l>0);
  // HUD – nur anfassen, wenn sich etwas geändert hat (kein Schreiben ins Dokument pro Bild)
  const hd=g.hud, n=Math.ceil(g.air*5), low=g.air<.3;
  if(n!==hd.n){ hd.n=n; hd.spans.forEach((s,i)=>s.classList.toggle('off',i>=n)); }
  if(low!==hd.low){ hd.low=low; hd.air&&hd.air.classList.toggle('low',low); }
  if(g.fish!==hd.f){ hd.f=g.fish; if(hd.fish) hd.fish.textContent=g.fish; }
  if(g.t>=P.dur) end();
}
function burst(x,y,c){ for(let i=0;i<8;i++) G.parts.push({x,y,vx:DW.rand(-150,150),vy:DW.rand(-160,40),l:.5,c}); }
function draw(T){
  const g=G, x=ctx, sy=surf(); x.setTransform(DPR,0,0,DPR,0,0);
  // Himmel
  const sk=x.createLinearGradient(0,0,0,sy); sk.addColorStop(0,'#cfe4ea'); sk.addColorStop(1,'#eef0e2'); x.fillStyle=sk; x.fillRect(0,0,W,sy+2);
  // Meer
  const sg=x.createLinearGradient(0,sy,0,H); sg.addColorStop(0,'#8ccbd0'); sg.addColorStop(.5,'#4c93a8'); sg.addColorStop(1,'#245a72'); x.fillStyle=sg; x.fillRect(0,sy,W,H-sy);
  // Lichtstrahlen
  x.save(); x.globalAlpha=.16; x.fillStyle='#fffbe0'; for(let i=0;i<5;i++){ const px=((i*260-g.dist*.1)%(W+300)+W+300)%(W+300)-150; x.beginPath(); x.moveTo(px,sy); x.lineTo(px+60,sy); x.lineTo(px+180+Math.sin(T+i)*20,H); x.lineTo(px+80,H); x.fill(); } x.restore();
  const par=(im,f,y,h)=>{const w=im.width*h/im.height,off=-(g.dist*f)%w;for(let px=off;px<W;px+=w)x.drawImage(im,px,y,w,h);};
  x.globalAlpha=.55; par(g.far,.2,H*.45,H*.55); x.globalAlpha=.8; par(g.mid,.45,H*.6,H*.4); x.globalAlpha=1;
  // Wasseroberfläche
  x.fillStyle='rgba(255,255,255,.55)'; x.beginPath(); x.moveTo(0,sy); for(let px=0;px<=W;px+=12) x.lineTo(px,sy+Math.sin(px*.03+T*2+g.dist*.02)*4); x.lineTo(W,sy+10); x.lineTo(0,sy+10); x.fill();
  // Gegenstände
  g.items.forEach(it=>{
    if(it.t==='rock'){ x.fillStyle='#6f7a74'; x.strokeStyle='#3d3226'; x.lineWidth=2; x.beginPath(); const s=it.seed; x.moveTo(it.x-it.w/2,H+4);
      x.lineTo(it.x-it.w*.45,it.y+it.h*.3); x.quadraticCurveTo(it.x-it.w*(.3+s*.1),it.y,it.x,it.y+10); x.quadraticCurveTo(it.x+it.w*.3,it.y+it.h*.1,it.x+it.w*.5,it.y+it.h*.45); x.lineTo(it.x+it.w/2,H+4); x.fill(); x.stroke();
      x.strokeStyle='#8a948e'; x.lineWidth=3; x.beginPath(); x.moveTo(it.x-it.w*.2,it.y+it.h*.4); x.lineTo(it.x+it.w*.15,it.y+it.h*.35); x.stroke(); }
    else if(it.x-it.w>W||it.x+it.w<0) return;
    else if(it.t==='jelly'){ const im=bmp(g.im.qualle,it.w); if(im) x.drawImage(im,it.x-it.w/2,it.y-it.h/2+Math.sin(T*3+it.ph)*3,it.w,it.h); }
    else { const im=bmp(g.im[it.k],it.w); if(im){ const by=it.y+Math.sin(T*4+it.x*.03)*3; if(it.k==='tinte'){ x.save(); x.translate(it.x,by); x.scale(-1,1); x.drawImage(im,-it.w/2,-it.h/2,it.w,it.h); x.restore(); } else x.drawImage(im,it.x-it.w/2,by-it.h/2,it.w,it.h); } } });
  // Ichthyosaurus
  const pw=Math.min(200,W*.28), f=bmp(g.frames[Math.floor(g.ph*8)%8],pw);
  if(f&&!(g.hurt>0&&Math.floor(g.hurt*10)%2)){ const ph=pw*f.height/f.width; x.save(); x.translate(W*.22,g.y); x.rotate(DW.clamp(g.vy*.0025,-.35,.35)); x.drawImage(f,-pw/2,-ph/2,pw,ph); x.restore(); }
  // Blasen beim Atmen / Partikel
  g.parts.forEach(p=>{ x.globalAlpha=Math.max(0,p.l*1.5); x.fillStyle=p.c; x.beginPath(); x.arc(p.x,p.y,4,0,7); x.fill(); }); x.globalAlpha=1;
  // Fortschritt
  const bw=Math.min(360,W*.4), bx=(W-bw)/2, by=10; x.fillStyle='rgba(255,251,243,.85)'; x.beginPath(); x.roundRect?x.roundRect(bx-8,by-6,bw+16,22,11):x.rect(bx-8,by-6,bw+16,22); x.fill();
  x.fillStyle='#e8dcc0'; x.fillRect(bx,by+2,bw,6); x.fillStyle='#8fbf7a'; x.fillRect(bx,by+2,bw*Math.min(1,g.t/g.P.dur),6);
}
function end(){
  const g=G; if(!g||g.done) return; g.done=true; GK.idle.stop();
  const goal=g.P.goal, stars=1+(g.fish>=goal*.5?1:0)+(g.fish>=goal&&g.outs<=1?1:0);
  DW.discover(g.sw.id,true);
  GK.finish(root,{id:ID,stars,art:`<div class="sd-iart">${GK.img(g.sw.id,{mood:'happy'})}</div>`,
    extra:`<p class="pill">${ART.icon('fisch',30).replace('<svg','<svg style="display:inline;vertical-align:middle"')} ${g.fish} Fische gefressen</p>`,
    say:`Toll geschwommen! Du hast ${g.fish} Fische gefressen. ${g.sw.end}`,again:()=>play()});
}
if(window.DW_DEBUG) window.__tf={end:()=>{ if(G) G.t=G.P.dur; },state:()=>G&&{t:G.t,dur:G.P.dur,air:G.air,fish:G.fish,outs:G.outs,y:G.y,H,surf:surf(),done:G.done,dist:G.dist,
    food:G.items.filter(it=>it.t==='food'&&!it.hit&&it.x>W*.25&&it.x<W*.9).map(it=>[Math.round(it.x),Math.round(it.y)]),bad:G.items.filter(it=>it.t!=='food'&&it.x>W*.1&&it.x<W*.8).map(it=>[Math.round(it.x),Math.round(it.y),it.t,Math.round(it.h)])},aim:y=>{ if(G) G.ty=H*y; }};
DW.stations[ID]={title:'Tauchfahrt',mount,unmount(){ G=null; cv=null; CR=null; clearTimeout(rzT); }};
})();
