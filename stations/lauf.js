/* =====================================================================
   DINO-INSELWELT · Station Dino-Lauf (DINO RUN)
   Hüpfen, Eier sammeln, neue Dinos und Landschaften freischalten.
   Kein „Game over“: Wer stolpert, läuft einfach weiter.
   ===================================================================== */
(function(){
"use strict";
let root,cv,ctx,raf=0,G=null,DPR=1,VW=0,VH=0,keyH=null;
const S=()=>DW.state.run;

function mount(r){ root=r; menu(); }
function menu(){
  cancelAnimationFrame(raf); G=null;
  const bank=S().eggs;
  root.innerHTML=`<div class="fill col" style="overflow:auto">
    <div class="row" style="justify-content:center;gap:10px;margin:4px 0 6px"><span class="stars">${ART.icon('ei')}${bank} Eier gesammelt</span></div>
    <h2 class="hand" style="text-align:center;font-size:30px;margin:0">1. Wähle deinen Dino</h2>
    <div class="menu" id="rnDinos" style="max-height:none;overflow:visible"></div>
    <h2 class="hand" style="text-align:center;font-size:30px;margin:0">2. Wähle eine Landschaft</h2>
    <div class="menu" id="rnBiomes" style="max-height:none;overflow:visible"></div>
    <p class="hand" style="text-align:center;font-size:22px;margin:0">Landschafts-Sticker: ${DATA.STICKERS.filter(s=>s.bio).map(s=>`<span title="${s.n}" style="display:inline-block;width:40px;vertical-align:middle;${DW.state.stickers[s.id]?'':'opacity:.2;filter:grayscale(1)'}">${ART.icon(s.icon,40)}</span>`).join('')}</p>
    <div style="text-align:center;padding:10px 0 14px;position:sticky;bottom:0;z-index:2;background:linear-gradient(rgba(247,240,225,0),#f7f0e1 45%)"><button class="btn big go" id="rnGo">${ART.icon('lauf',44)}Los geht’s!</button></div></div>`;
  const dBox=root.querySelector('#rnDinos'), bBox=root.querySelector('#rnBiomes');
  DATA.RUNNERS.forEach(d=>{ const lock=bank<d.need; const t=DW.h(`<button class="tile ${lock?'locked':''} ${S().dino===d.id?'sel':''}"><div class="pic">${DW.animalImg(d.id,{})}</div><b>${d.n}</b><small>${lock?`ab ${d.need} Eiern`:''}</small>${lock?`<span class="lock">${ART.icon('schloss')}</span>`:''}</button>`);
    t.onclick=()=>{ if(lock){DW.sfx('no');DW.say(`${d.n} ist noch im Ei. Sammle ${d.need} Eier, dann schlüpft er!`);return;} S().dino=d.id;DW.save();DW.sfx('pop');DW.say(d.say);DW.$$('.tile',dBox).forEach(x=>x.classList.remove('sel'));t.classList.add('sel'); };
    dBox.appendChild(t); });
  DATA.BIOMES.forEach(b=>{ const lock=bank<b.need; const t=DW.h(`<button class="tile ${lock?'locked':''} ${S().biome===b.id?'sel':''}"><div class="pic" style="border-radius:16px;overflow:hidden;background:linear-gradient(${b.sky[0]},${b.sky[1]})">${ART.icon(b.deco[0],90)}</div><b>${b.n}</b><small>${lock?`ab ${b.need} Eiern`:''}</small>${lock?`<span class="lock">${ART.icon('schloss')}</span>`:''}</button>`);
    t.onclick=()=>{ if(lock){DW.sfx('no');DW.say(`Das ${b.n} ist noch verschlossen. Sammle ${b.need} Eier!`);return;} S().biome=b.id;DW.save();DW.sfx('pop');DW.say(b.n);DW.$$('.tile',bBox).forEach(x=>x.classList.remove('sel'));t.classList.add('sel'); };
    bBox.appendChild(t); });
  root.querySelector('#rnGo').onclick=()=>{DW.sfx('tap');play();};
  DW.say('Wähle deinen Dino und eine Landschaft. Dann tippe auf Los!');
}

/* ---------------- Hintergrund-Ebenen ---------------- */
function layer(b,kind,w,h){
  const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  const hills=(base,amp,col,freq,seed)=>{x.fillStyle=col;x.beginPath();x.moveTo(0,h);for(let i=0;i<=w;i+=8){const u=i/w*Math.PI*2;x.lineTo(i,base-amp*(.5+.3*Math.sin(u*freq+seed)+.2*Math.sin(u*freq*2.3+seed*2)));}x.lineTo(w,h);x.closePath();x.fill();};
  if(kind==='far'){ x.filter='blur(2px)'; hills(h*.62,h*.28,b.far,2,1); x.filter='none'; }
  if(kind==='mid'){ hills(h*.8,h*.2,b.mid,3,4); }
  return c;
}
function iconImg(n){return ART.toImage(ART.icon(n),'ic|'+n);}

/* ---------------- Spiel ---------------- */
function play(){
  const b=DATA.BIOMES.find(x=>x.id===S().biome)||DATA.BIOMES[0], d=DATA.RUNNERS.find(x=>x.id===S().dino)||DATA.RUNNERS[0];
  root.innerHTML=`<div class="fill"><canvas id="rnCv" style="position:absolute;inset:0;width:100%;height:100%;touch-action:none"></canvas>
    <div style="position:absolute;z-index:3;left:max(14px,env(safe-area-inset-left));top:max(12px,env(safe-area-inset-top))"><span class="stars" id="rnEggs">${ART.icon('ei')}0</span></div>
    <div class="hud tr" style="position:absolute"><button class="ibtn" id="rnStop" aria-label="Aufhören">${ART.icon('kreuz')}</button></div>
    <div id="rnTip" class="bubble" style="position:absolute;top:70px;bottom:auto"><div class="who">${DW.animalSVG('protoceratops',{shadow:false})}</div><p>Tippe irgendwo hin, dann springt dein Dino! Zweimal tippen = Doppelsprung.</p></div></div>`;
  cv=root.querySelector('#rnCv'); ctx=cv.getContext('2d');
  root.querySelector('#rnStop').onclick=()=>{DW.sfx('tap');end(true);};
  resize(); window.addEventListener('resize',resize);
  const frames=ART.frames(d.id,8,{shadow:false});
  G={b,d,frames,ptera:ART.frames('pteranodon',6,{shadow:false}),t:0,dist:0,speed:320,eggs:0,y:0,vy:0,jumps:0,items:[],next:500,hurt:0,ph:0,dur:60,done:false,
    far:layer(b,'far',1600,400),mid:layer(b,'mid',1600,400),deco:b.deco.map(iconImg),obst:{},pick:iconImg(b.pick==='ei'?'ei':b.pick),egg:iconImg('ei'),star:iconImg('stern'),findT:0,parts:[],stk:DATA.STICKERS.filter(s=>s.bio===b.id),stkT:[18,38],stkImgs:{}};
  G.stk.forEach(s=>G.stkImgs[s.id]=iconImg(s.icon));
  ['farn','moos','stein','holz','kaktus','lava','kristall'].forEach(n=>G.obst[n]=iconImg(n));
  const jump=()=>{ if(!G||G.done) return; if(d.fly||G.jumps<2){ G.vy=d.fly?Math.min(G.vy,0)-620:(G.jumps?-760:-900)*d.jump; if(d.fly&&G.y<-VH*.55) G.vy=Math.max(G.vy,-100); G.jumps++; DW.sfx('jump'); const tip=root.querySelector('#rnTip'); if(tip) tip.classList.add('hide'); } };
  cv.addEventListener('pointerdown',e=>{e.preventDefault();jump();});
  keyH=e=>{ if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();jump();} }; window.addEventListener('keydown',keyH);
  DW.say(d.fly?'Tippe, dann flattert Ptera hoch!':'Tippe, dann springt dein Dino! Fang auch die leuchtenden Sticker.');
  let last=performance.now();
  const loop=t=>{ const dt=Math.max(0,Math.min(.04,(t-last)/1000)); last=t; if(!G) return; step(dt); draw(); raf=requestAnimationFrame(loop); };
  raf=requestAnimationFrame(loop);
}
// Dino-Größe: im Hochformat (Handy) etwas größer, sonst ist er winzig
const dWOf=(w,h)=>Math.min(180,w*(w<h?.3:.22));
function resize(){ if(!cv) return; const oh=VH; DPR=Math.min(2,devicePixelRatio||1); VW=cv.clientWidth; VH=cv.clientHeight; cv.width=VW*DPR; cv.height=VH*DPR;
  /* Drehen mitten im Lauf: Eier/Hindernisse wurden für die alte Bodenhöhe gesetzt und lagen danach unter dem Boden bzw. in der Luft → mit dem Boden mitnehmen */
  if(G&&!G.done&&oh&&oh!==VH){ const d=(VH-oh)*.8; G.items.forEach(it=>{ it.y+=d; }); G.parts.forEach(q=>{ q.y+=d; }); } }
function spawn(){
  const g=G, H=VH, gy=H*.8, x0=VW+80, r=Math.random(), types=g.b.obst;
  const obst=t=>{ const kind=t==='ptera'?'ptera':t; const map={busch:'moos',stein:'stein',stamm:'holz',kaktus:'kaktus',lava:'lava',eis:'kristall'};
    if(kind==='ptera') g.items.push({type:'ptera',x:x0,y:gy-120,w:110,h:60});
    else g.items.push({type:'obst',img:g.obst[map[kind]],x:x0,y:gy,w:kind==='stamm'?96:kind==='lava'?104:76,h:kind==='lava'?32:kind==='stamm'?48:70}); };
  if(r<.28){ for(let i=0;i<5;i++) g.items.push({type:'egg',x:x0+i*56,y:gy-40-Math.sin(i/4*Math.PI)*120,w:34,h:40}); }
  else if(r<.78){ const t=DW.pick(types); obst(t); for(let i=0;i<3;i++) g.items.push({type:'egg',x:x0-50+i*50,y:gy-150-(i===1?30:0),w:34,h:40}); }
  else { obst(DW.pick(types.filter(t=>t!=='ptera'))); g.items.push({type:'egg',x:x0+300,y:gy-40,w:34,h:40}); g.items.push({type:'pick',x:x0+380,y:gy-60,w:44,h:44}); }
  g.next=520+Math.random()*420+g.speed*.35;
}
function step(dt){
  const g=G; if(g.done) return;
  g.t+=dt; g.speed=320+g.t*3.2; const dx=g.speed*dt; g.dist+=dx; g.ph=(g.ph+dt*g.speed/260)%1;
  g.next-=dx; if(g.next<=0) spawn();
  // Sprung
  g.vy+=(g.d.fly?1500:2300)*dt; g.y+=g.vy*dt; if(g.y>0){g.y=0;g.vy=0;g.jumps=0;}
  // Flieger: nicht aus dem Bild flattern (schnelles Tippen)
  if(g.d.fly){ const top=-VH*.62; if(g.y<top){ g.y=top; g.vy=Math.max(g.vy,0); } g.vy=Math.max(g.vy,-900); }
  if(g.hurt>0) g.hurt-=dt;
  const H=VH, gy=H*.8, dW=dWOf(VW,VH), dx0=VW*.2;
  const box={x:dx0-dW*.3,y:gy+g.y-dW*.55,w:dW*.6,h:dW*.5};
  g.items.forEach(it=>{ it.x-=dx; if(it.type==='ptera') it.y+=Math.sin(g.t*3+it.x*.01)*.6;
    const ib={x:it.x-it.w/2,y:it.y-it.h,w:it.w,h:it.h};
    if(!it.hit&&ib.x<box.x+box.w&&ib.x+ib.w>box.x&&ib.y<box.y+box.h&&ib.y+ib.h>box.y){
      if(it.type==='egg'){ it.hit=1; g.eggs++; DW.sfx('egg'); burst(it.x,it.y-20,'#f3ead6'); }
      else if(it.type==='pick'){ it.hit=1; g.eggs+=3; DW.sfx('star'); burst(it.x,it.y-20,'#f0c35a'); }
      else if(it.type==='stk'){ it.hit=1; burst(it.x,it.y-20,'#f0c35a'); if(!DW.addSticker(it.id)){ g.eggs+=5; DW.sfx('star'); } }
      else if(g.hurt<=0){ it.hit=1; g.hurt=1.2; g.eggs=Math.max(0,g.eggs-2); DW.sfx('bump'); DW.say(DW.pick(['Hoppla!','Uff! Weiter geht’s!','Autsch, nicht schlimm!'])); } }
  });
  g.items=g.items.filter(it=>it.x>-150&&!(it.hit&&(it.type==='egg'||it.type==='pick'||it.type==='stk')));
  g.parts.forEach(p=>{p.x+=p.vx*dt-dx;p.y+=p.vy*dt;p.vy+=600*dt;p.l-=dt;}); g.parts=g.parts.filter(p=>p.l>0);
  // Fund alle 15 Eier
  if(g.stkT.length&&g.t>=g.stkT[0]){ g.stkT.shift(); const left=g.stk.filter(s=>!DW.state.stickers[s.id]); const s=DW.pick(left.length?left:g.stk); if(s) g.items.push({type:'stk',id:s.id,x:VW+60,y:VH*.8-170,w:64,h:64}); }
  if(g.eggs>=15*(g.findT+1)){ g.findT++; const f=DW.pick(DATA.FINDS); DW.addFind(f.id); }
  const el=root.querySelector('#rnEggs'); if(el) el.lastChild.textContent=g.eggs;
  if(g.t>=g.dur) end(false);
}
function burst(x,y,c){for(let i=0;i<8;i++)G.parts.push({x,y,vx:(Math.random()-.5)*300,vy:-Math.random()*300,l:.6,c});}
function draw(){
  const g=G,x=ctx,H=VH,W=VW,gy=H*.8; x.setTransform(DPR,0,0,DPR,0,0);
  // eigene Landschaft: grafiken-neu/landschaften/<biom>_himmel|hinten|mitte|boden (sonst Zeichnung)
  const A=window.ASSETS, LY=k=>A&&A.layer?A.layer(g.b.id,k):null, ls=LY('himmel'), lf=LY('hinten'), lm=LY('mitte'), lb=LY('boden');
  if(ls) A.drawCover(x,ls,0,0,W,gy+8);
  else{ const sk=x.createLinearGradient(0,0,0,H);sk.addColorStop(0,g.b.sky[0]);sk.addColorStop(1,g.b.sky[1]);x.fillStyle=sk;x.fillRect(0,0,W,H);
  x.fillStyle='rgba(255,245,210,.8)';x.beginPath();x.arc(W*.8,H*.18,40,0,7);x.fill(); }
  const par=(img,f,y,h)=>{const w=img.width*h/img.height,off=-(g.dist*f)%w;for(let px=off;px<W;px+=w)x.drawImage(img,px,y,w,h);};
  if(lf) A.drawLayer(x,lf,g.dist*.15,H*.2,H*.6,W); else par(g.far,.15,H*.2,H*.6);
  if(lm) A.drawLayer(x,lm,g.dist*.35,H*.35,H*.5,W); else par(g.mid,.35,H*.35,H*.5);
  // Deko
  g.deco.forEach((img,i)=>{ if(!img.complete) return; const sp=.5, gap=520+i*170, off=-(g.dist*sp+i*260)%gap; for(let px=off;px<W+gap;px+=gap){ x.globalAlpha=.5; x.drawImage(img,px,gy-200+i*14,110,110);} x.globalAlpha=1; });
  // Boden
  if(lb) A.drawLayer(x,lb,g.dist,gy-8,H-gy+8,W);
  else{ x.fillStyle=g.b.ground;x.fillRect(0,gy,W,H-gy);
  x.fillStyle=g.b.grass;x.beginPath();x.moveTo(0,gy+8);for(let px=0;px<=W;px+=20){x.lineTo(px,gy-4+Math.sin((px+g.dist)*.05)*3);}x.lineTo(W,gy+8);x.fill();
  x.fillStyle='rgba(60,50,30,.12)';for(let px=-((g.dist*1)%60);px<W;px+=60){x.fillRect(px,gy+26,22,4);x.fillRect(px+30,gy+56,14,3);} }
  // Gegenstände
  g.items.forEach(it=>{ if(it.type==='stk'){ const im=g.stkImgs[it.id]; const bob=Math.sin(g.t*4)*6; x.fillStyle='rgba(255,236,160,.55)';x.beginPath();x.arc(it.x,it.y-it.h/2+bob,it.w*.75,0,7);x.fill(); if(im&&im.complete) x.drawImage(im,it.x-it.w/2,it.y-it.h+bob,it.w,it.h); return; }
    if(it.type==='egg'||it.type==='pick'){ const img=it.type==='egg'?g.egg:g.pick; if(img.complete) x.drawImage(img,it.x-it.w/2,it.y-it.h+Math.sin(g.t*5+it.x*.02)*3,it.w,it.h); }
    else if(it.type==='ptera'){ const f=g.ptera[Math.floor(g.t*8)%g.ptera.length]; if(f.complete){x.save();x.translate(it.x,it.y);x.scale(-1,1);x.drawImage(f,-it.w/2,-it.h,it.w,it.w*f.naturalHeight/f.naturalWidth);x.restore();} }
    else if(it.img&&it.img.complete){ x.fillStyle='rgba(60,50,30,.15)';x.beginPath();x.ellipse(it.x,it.y+2,it.w*.5,6,0,0,7);x.fill(); x.drawImage(it.img,it.x-it.w/2,it.y-it.h-it.h*.1,it.w,it.h*1.15); } });
  // Dino
  const dW=dWOf(W,H), f=g.frames[Math.floor(g.ph*8)%8];
  x.fillStyle='rgba(60,50,30,.18)';x.beginPath();x.ellipse(W*.2,gy+4,dW*.35*(1+g.y/400),7,0,0,7);x.fill();
  if(f.complete&&!(g.hurt>0&&Math.floor(g.hurt*10)%2)){ const h=dW*f.naturalHeight/f.naturalWidth; x.drawImage(f,W*.2-dW/2,gy+g.y-h+6,dW,h); }
  g.parts.forEach(p=>{x.globalAlpha=Math.max(0,p.l*1.6);x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,5,0,7);x.fill();});x.globalAlpha=1;
  // Fortschritt
  const pw=Math.min(420,W*.5),px=(W-pw)/2,py=18; x.fillStyle='rgba(255,251,243,.85)';x.beginPath();x.roundRect?x.roundRect(px-8,py-8,pw+16,30,15):x.rect(px-8,py-8,pw+16,30);x.fill();
  x.fillStyle='#e8dcc0';x.fillRect(px,py+4,pw,6);x.fillStyle='#8fbf7a';x.fillRect(px,py+4,pw*Math.min(1,g.t/g.dur),6);
  if(g.star.complete) x.drawImage(g.star,px+pw-12,py-8,28,28);
  const hd=g.frames[0]; if(hd.complete) x.drawImage(hd,px+pw*Math.min(1,g.t/g.dur)-16,py-10,32,32*hd.naturalHeight/hd.naturalWidth);
}
function end(aborted){
  const g=G; if(!g||g.done) return; g.done=true; cancelAnimationFrame(raf); window.removeEventListener('keydown',keyH); window.removeEventListener('resize',resize);
  const before=S().eggs; S().eggs+=g.eggs; S().best=Math.max(S().best||0,g.eggs); DW.save();
  const stars=aborted?0:g.eggs>=30?3:g.eggs>=18?2:g.eggs>=6?1:1;
  if(stars) DW.addStars('lauf',stars);
  if(!aborted){ DW.addSticker('lauf'); DW.sfx('win'); DW.confetti(); }
  const unl=[...DATA.RUNNERS,...DATA.BIOMES].filter(u=>u.need>before&&u.need<=S().eggs);
  const m=DW.modal(`<div style="text-align:center"><h2 style="margin:0">${aborted?'Pause!':'Ziel erreicht!'}</h2>
    ${stars?`<div style="margin:8px 0">${DW.starRow(stars)}</div>`:''}
    <p style="font-size:22px">${ART.icon('ei',40).replace('<svg','<svg style="display:inline;vertical-align:middle"')} ${g.eggs} Eier gesammelt</p>
    ${unl.length?`<p><b>Neu freigeschaltet:</b> ${unl.map(u=>u.n).join(', ')}!</p>`:''}
    <div class="row" style="justify-content:center;flex-wrap:wrap"><button class="btn go big" id="rnAgain">${ART.icon('lauf',40)}Nochmal</button><button class="btn ghost big" id="rnMenu">${ART.icon('karte',36)}Andere Wahl</button></div></div>`,{noclose:true});
  DW.say(aborted?`Du hast ${g.eggs} Eier gesammelt.`:`Geschafft! Du hast ${g.eggs} Eier gesammelt.${unl.length?' Neu freigeschaltet: '+unl.map(u=>u.n).join(' und ')+'!':''}`);
  m.querySelector('#rnAgain').onclick=()=>{m.close();play();};
  m.querySelector('#rnMenu').onclick=()=>{m.close();menu();};
}
function unmount(){ cancelAnimationFrame(raf); if(G&&!G.done){ S().eggs+=G.eggs; DW.save(); } G=null; window.removeEventListener('keydown',keyH); window.removeEventListener('resize',resize); const o=DW.$('#overlay'); o.hidden=true; o.innerHTML=''; }
DW.stations.lauf={title:'Dino-Lauf',mount,unmount};
})();
