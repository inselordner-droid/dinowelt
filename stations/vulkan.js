/* =====================================================================
   DINO-INSELWELT · Station Vulkan-Expedition (GAME 28)
   Pfad-Netz am Vulkan: Stein für Stein zum verirrten Dino-Baby.
   Lava-Bäche glühen und kühlen im Takt ab, Steine rollen vorbei –
   warten und beobachten! Kristalle und Fossilien einsammeln.
   Kein Game Over: An einer Gefahr kehrt man sanft zurück.
   ===================================================================== */
(function(){
"use strict";
const ID='vulkan';
/* Level-Daten: Reihen, Knoten je Reihe, Gefahren, Fundstücke (Ziel = need) */
const LV={1:{rows:5,per:[1,1],haz:1,items:3,need:3,hot:2.2,cool:3.6,lat:false},
          2:{rows:5,per:[1,2],haz:3,items:4,need:3,hot:2.4,cool:3,lat:false},
          3:{rows:6,per:[2,3],haz:5,items:6,need:4,hot:2.6,cool:2.5,lat:true}};
const ITEMS=['kristall','kristall','knochen','zahn','bernstein'];
/* Dino-Babys: alle Pflanzenfresser-Dinos an Land mit Zeichnung */
const BABIES=GK.pool(a=>DATA.isDino(a.id)&&a.food==='pflanzen'&&DATA.habitat(a.id)==='land').map(a=>a.id);
if(!BABIES.length) BABIES.push('protoceratops');
const SAY_ITEM={kristall:'Ein Kristall! Er ist ganz langsam im heißen Gestein gewachsen.',knochen:'Ein Knochen! Vulkanasche kann Tiere ganz fein versteinern.',
  zahn:'Ein versteinerter Zahn!',bernstein:'Bernstein! Das ist uraltes Baumharz.'};

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

let root,lv=1,G=null,stopLoop=null,cv,ctx,W=1,H=1,DPR=1,lastBaby=null;

function mount(r){ root=r; GK.listen(window,'resize',resize); intro(); }
function intro(){
  G=null;
  GK.intro(root,{id:ID,art:'<div class="gc-art">'+(GK.icon('vulkan')+GK.img('protoceratops',{mood:'sad'}))+'</div>',title:'Vulkan-Expedition',
    say:'Am Vulkan hat sich ein Dino-Baby verirrt! Geh Stein für Stein zu ihm. Pass auf die heiße Lava auf und sammle Kristalle.',
    onStart:l=>{lv=l;start();}});
}

/* ---------- Karte erzeugen ---------- */
function makeMap(L){
  const rows=[]; rows.push([1]);
  let prev=[1];
  for(let r=1;r<L.rows-1;r++){ const n=L.per[0]+Math.floor(Math.random()*(L.per[1]-L.per[0]+1));
    let cols=n===1?[DW.pick([0,1,2].filter(c=>prev.some(p=>Math.abs(p-c)<=1)))]:n===2?DW.pick([[0,1],[1,2],[0,2]]):[0,1,2];
    rows.push(cols.slice().sort()); prev=cols; }
  rows.push([1]);
  const nodes=[],E=[];
  rows.forEach((cols,r)=>cols.forEach(c=>nodes.push({id:nodes.length,r,c,item:null,nb:[]})));
  const at=(r)=>nodes.filter(n=>n.r===r);
  const link=(a,b)=>{ if(a.nb.includes(b.id))return; const e={a:a.id,b:b.id,bend:DW.rand(-.25,.25),haz:null}; E.push(e); a.nb.push(b.id); b.nb.push(a.id); };
  for(let r=0;r<rows.length-1;r++){ const A=at(r),B=at(r+1);
    A.forEach(a=>{ const near=B.filter(b=>Math.abs(b.c-a.c)<=1); (near.length?near:[B.reduce((m,b)=>Math.abs(b.c-a.c)<Math.abs(m.c-a.c)?b:m)]).forEach(b=>link(a,b)); });
    B.forEach(b=>{ if(!b.nb.some(id=>nodes[id].r===r)){ link(A.reduce((m,a)=>Math.abs(b.c-a.c)<Math.abs(m.c-a.c)?a:m),b); } });
    if(L.lat){ const R=at(r+1); for(let i=0;i<R.length-1;i++) if(r+1<rows.length-1&&Math.random()<.5) link(R[i],R[i+1]); } }
  // Gefahren auf Wegen (nie am Start)
  const cand=DW.shuffle(E.filter(e=>nodes[e.a].r>0||nodes[e.b].r>0));
  cand.slice(0,L.haz).forEach((e,i)=>{ e.haz={kind:i%2&&lv>1?'rock':'lava',t:Math.random()*(L.hot+L.cool),hot:L.hot,cool:L.cool}; });
  // Fundstücke auf Zwischenknoten
  const mid=DW.shuffle(nodes.filter(n=>n.r>0&&n.r<rows.length-1));
  const pool=DW.shuffle(ITEMS);
  mid.slice(0,L.items).forEach((n,i)=>n.item=pool[i%pool.length]);
  // Leicht: genug Fundstücke auf dem einzigen Weg – sonst Zusatz auf leeren Knoten
  return {nodes,E,rows:rows.length,start:0,goal:nodes.length-1,total:mid.slice(0,L.items).length};
}

function start(){
  if(stopLoop)stopLoop(); GK.idle.stop();
  const L=LV[lv], M=makeMap(L);
  const av=ART.AVATARS.find(a=>a.id===DW.state.avatar)||ART.AVATARS[0];
  const baby=DW.pick(BABIES.filter(b=>b!==lastBaby))||BABIES[0]; lastBaby=baby;
  root.innerHTML=`<div class="vk gc-wrap"><canvas class="gc-cv"></canvas><div class="gc-paper"></div>
    <div class="gc-hud vk-hud"><span class="gc-chip vk-got">${GK.icon('kristall')}<b>0</b>/${Math.min(M.total,L.need)}</span></div></div>`;
  cv=root.querySelector('canvas'); ctx=cv.getContext('2d'); resize(); paperOn();
  const need=Math.min(M.total,L.need);
  G={L,M,need,got:0,bumps:0,t:0,cur:0,walk:null,av:[...Array(8)].map((_,i)=>bake(`vkav|${av.id}|${i}`,()=>ART.avatar(av,{ph:i/8}),200)),
     avStand:bake('vkav|'+av.id+'|s',()=>ART.avatar(av,{}),200),baby,babyS:bake('vkb|'+baby+'s',()=>ART.animal(baby,{mood:'sad',shadow:false,baby:true}),160),babyH:bake('vkb|'+baby+'h',()=>ART.animal(baby,{mood:'happy',shadow:false,baby:true}),160),
     ic:{kristall:icon('kristall'),knochen:icon('knochen'),zahn:icon('zahn'),bernstein:icon('bernstein'),farn:icon('farn'),stein:icon('stein')},
     smoke:[],parts:[],fly:[],rumble:DW.rand(6,9),shake:0,said:{},hint:-1,hintT:0,face:1,done:false,deco:[...Array(14)].map(()=>({x:Math.random(),y:Math.random(),k:Math.random()<.5?'farn':'stein',s:DW.rand(.6,1.1)}))};
  cv.addEventListener('pointerdown',onTap);
  DW.say(`Da oben ist das kleine ${GK.name(baby)}-Baby! Tippe auf einen leuchtenden Stein, dann gehst du hin.`);
  GK.idle.set(()=>{ G&&(G.hint=nextHint(),G.hintT=3); },()=>DW.say('Tippe auf den leuchtenden Stein. Bei roter Lava kurz warten!'));
  if(window.DW_DEBUG) window.__vulkanWin=()=>{ if(!G)return; G.M.nodes.forEach(n=>{if(n.item){n.item=null;G.got++;}}); G.cur=G.M.goal; root.querySelector('.vk-got b').textContent=G.got; arrive(G.M.goal); };
  if(window.DW_DEBUG) window.__vulkanStep=()=>{ if(!G)return -1; const id=nextHint(); if(id<0)return -1; const p=pos(G.M.nodes[id]),r=cv.getBoundingClientRect(); onTap({clientX:r.left+p[0],clientY:r.top+p[1],preventDefault(){}}); return [id,G.cur,G.got,G.bumps]; };
  if(window.DW_DEBUG) window.__vulkanInfo=()=>{ if(!G) return null; const id=nextHint(), r=cv.getBoundingClientRect(), o={cur:G.cur,got:G.got,need:G.need,bumps:G.bumps,done:G.done,walk:!!G.walk,goal:G.M.goal,next:id};
    if(id>=0){ const p=pos(G.M.nodes[id]), e=edge(G.cur,id); o.x=r.left+p[0]; o.y=r.top+p[1]; o.hot=hot(e.haz); o.warn=!!e.haz&&warn(e.haz); o.R=R(); }
    const far=G.M.nodes.find(n=>n.id!==G.cur&&!G.M.nodes[G.cur].nb.includes(n.id)); if(far){ const p=pos(far); o.farX=r.left+p[0]; o.farY=r.top+p[1]; } return o; };
  stopLoop=GK.loop(dt=>{ if(!G) return false; step(dt); draw(); return true; });
}

/* ---------- Geometrie ---------- */
function resize(){ if(!cv||!cv.isConnected||!cv.clientWidth||!cv.clientHeight) return; W=cv.clientWidth; H=cv.clientHeight; DPR=dprFor(W,H);
  const w=Math.round(W*DPR), h=Math.round(H*DPR); if(cv.width!==w||cv.height!==h){ cv.width=w; cv.height=h; } }
function R(){ return Math.max(30,Math.min(46,W*.08,H*.05)); }
function pos(n){ const g=G, rows=g.M.rows, top=H*(H>W?.3:.34), bot=H-Math.max(70,R()*1.9);
  const spread=Math.min(W*.3,H*.42), cx=W/2+(n.c-1)*spread+Math.sin(n.r*1.7)*spread*.12;
  return [cx, bot-(bot-top)*n.r/(rows-1)]; }
function curve(e,u){ const a=pos(G.M.nodes[e.a]),b=pos(G.M.nodes[e.b]); const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1];
  const cx=mx-dy*e.bend,cy=my+dx*e.bend; const v=1-u; return [v*v*a[0]+2*v*u*cx+u*u*b[0],v*v*a[1]+2*v*u*cy+u*u*b[1]]; }
function edge(a,b){ return G.M.E.find(e=>e.a===a&&e.b===b||e.a===b&&e.b===a); }
function hot(h){ if(!h) return false; const p=h.t%(h.hot+h.cool); return p>=h.cool; }
function warn(h){ const p=h.t%(h.hot+h.cool); return p<h.cool&&p>h.cool-1; }

/* ---------- Eingabe ---------- */
function onTap(e){
  const g=G; if(!g||g.done) return; e.preventDefault();
  const r=cv.getBoundingClientRect(), px=e.clientX-r.left, py=e.clientY-r.top;
  let best=null,bd=1e9; g.M.nodes.forEach(n=>{const p=pos(n),d=Math.hypot(p[0]-px,p[1]-py);if(d<bd){bd=d;best=n;}});
  if(!best||bd>R()*1.7) return;
  if(g.walk) return;
  if(best.id===g.cur){ DW.sfx('tap'); return; }
  const cur=g.M.nodes[g.cur];
  if(!cur.nb.includes(best.id)){ DW.sfx('tap'); g.hint=-2; g.hintT=2.5; if(!g.said.far){g.said.far=1;} DW.say('Schritt für Schritt! Tippe auf einen Stein direkt neben dir.'); return; }
  const ed=edge(cur.id,best.id); const blocked=hot(ed.haz);
  g.walk={e:ed,from:cur.id,to:best.id,u:0,back:blocked,dir:ed.a===cur.id?1:-1};
  const bp=pos(best),cp=pos(cur); g.face=bp[0]>=cp[0]?1:-1;
  DW.sfx('step');
}
function nextHint(){ // kürzester Weg zum nächsten Fundstück bzw. zum Ziel
  const g=G; if(!g) return -1; const need=g.got<g.need;
  const Q=[g.cur],prev={[g.cur]:-1};
  while(Q.length){ const id=Q.shift(), n=g.M.nodes[id];
    if(id!==g.cur&&(need?n.item:id===g.M.goal)){ let k=id; while(prev[k]!==g.cur&&prev[k]!==-1) k=prev[k]; return k; }
    n.nb.forEach(j=>{ if(!(j in prev)){prev[j]=id;Q.push(j);} }); }
  return -1; }

/* ---------- Ablauf ---------- */
function step(dt){
  const g=G; g.t+=dt;
  // Gefahren laufen im Takt – aber nie, während man gerade auf dem Weg ist
  g.M.E.forEach(e=>{ const h=e.haz; if(!h) return; const onIt=g.walk&&g.walk.e===e&&!g.walk.back;
    const p=h.t%(h.hot+h.cool); if(onIt&&p<h.cool&&p+dt>=h.cool-.01) return; h.t+=dt; });
  if(g.walk){ const w=g.walk; w.u+=dt/(w.back?.6:.85);
    if(w.back&&w.u>=.5&&!w.bumped){ w.bumped=1; g.bumps++; DW.sfx('bump'); g.shake=.2; const hz=w.e.haz;
      const at=curve(w.e,.5); for(let i=0;i<10;i++) g.parts.push({x:at[0],y:at[1],vx:DW.rand(-80,80),vy:DW.rand(-140,-40),l:.8,c:hz.kind==='lava'?'#f0a060':'#a89478',r:DW.rand(3,6)});
      DW.say(hz.kind==='lava'?DW.pick(['Heiß! Warte, bis die Lava dunkel wird.','Autsch, zu heiß! Wenn die Lava grau ist, kannst du gehen.']):'Achtung, ein rollender Stein! Warte, bis er vorbei ist.');
      if(!g.said.lavafact&&hz.kind==='lava'){ g.said.lavafact=1; GK.after(3200,()=>{ if(G===g) DW.say('Lava ist flüssiges Gestein. Wenn sie abkühlt, wird sie zu hartem, dunklem Stein.'); }); } }
    if(w.u>=1){ g.walk=null; if(!w.back) arrive(w.to); } }
  // Vulkan grummelt
  g.rumble-=dt; if(g.rumble<=0){ g.rumble=DW.rand(12,18); g.shake=.9; DW.sfx('thud');
    for(let i=0;i<8;i++) g.smoke.push({x:W/2+DW.rand(-20,20),y:vtop()+10,r:DW.rand(14,26),vy:-DW.rand(30,50),vx:DW.rand(-10,10),l:6});
    if(!g.said.rumble){ g.said.rumble=1; DW.say('Der Vulkan grummelt. Keine Angst, wir bleiben auf dem Weg.'); } }
  if(Math.random()<dt*3) g.smoke.push({x:W/2+DW.rand(-14,14),y:vtop()+14,r:DW.rand(10,18),vy:-DW.rand(18,30),vx:DW.rand(-4,10),l:7});
  g.smoke.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.r+=dt*6;s.l-=dt;}); g.smoke=g.smoke.filter(s=>s.l>0&&s.y>-60);
  g.parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt;p.l-=dt;}); g.parts=g.parts.filter(p=>p.l>0);
  g.fly.forEach(f=>{f.u+=dt*1.6;}); g.fly=g.fly.filter(f=>f.u<1);
  if(g.shake>0) g.shake-=dt; if(g.hintT>0) g.hintT-=dt;
}
function vtop(){ return H*(H>W?.07:.05); }
function arrive(id){
  const g=G, n=g.M.nodes[id]; g.cur=id; DW.sfx('pop');
  if(n.item){ const k=n.item; n.item=null; g.got++; const p=pos(n); g.fly.push({k,x:p[0],y:p[1],u:0}); DW.sfx('clink');
    const el=root.querySelector('.vk-got'); el.querySelector('b').textContent=g.got; el.classList.remove('gk-good','gk-bad','gk-hint'); GK.ok(el);
    if(!g.said[k]){ g.said[k]=1; DW.say(SAY_ITEM[k]); } else DW.say(DW.pick(['Noch einer!','Toll gefunden!','Super!'])); }
  if(id===g.M.goal){
    if(g.got>=g.need) return win();
    const k=g.need-g.got; DW.say(`Das Baby freut sich! Aber wir brauchen noch ${k===1?'einen Schatz':k+' Schätze'}. Da unten glitzert noch etwas.`); }
}
function win(){
  const g=G; if(g.done) return; g.done=true; GK.idle.stop();
  DW.say(`Gefunden! Das kleine ${GK.name(g.baby)}-Baby ist in Sicherheit. Du bist ein echter Vulkanforscher!`); DW.sfx('win');
  GK.after(2600,()=>{ if(G!==g) return; if(stopLoop){stopLoop();stopLoop=null;}
    const all=g.M.nodes.every(n=>!n.item), stars=all?3:2; DW.discover(g.baby,true);
    const f=DW.pick(['kristall','knochen','zahn']); DW.addFind(f);
    G=null;
    GK.finish(root,{id:ID,stars,art:'<div class="gc-art">'+(GK.icon('vulkan')+GK.img(g.baby,{mood:'happy',baby:true}))+'</div>',title:'Vulkanforscher!',
      extra:`<p class="vk-sum">${GK.icon('kristall','vk-ic')} ${g.got} &nbsp; ${GK.icon('fussabdruck','vk-ic')} ${GK.name(g.baby)}</p>`,
      say:all?'Du hast alle Schätze gefunden und das Baby gerettet! Hier ist ein Fossil für deine Sammlung.':'Das Baby ist gerettet! Beim nächsten Mal findest du bestimmt alle Schätze.',
      again:()=>start()}); });
}

/* ---------- Zeichnen ---------- */
function draw(){
  const g=G,x=ctx; if(!g) return; x.setTransform(DPR,0,0,DPR,0,0);
  const sh=g.shake>0?Math.sin(g.t*60)*1.5:0; x.save(); x.translate(sh,0);
  // Himmel & Vulkan
  // eigene Landschaft: grafiken-neu/landschaften/vulkan_himmel | _hinten (Hügel hinter dem Vulkan) | _boden – der Spiel-Vulkan bleibt gezeichnet
  const A=window.ASSETS, LY=k=>A&&A.layer?A.layer('vulkan',k):null, ls=LY('himmel'), lf=LY('hinten'), lb=LY('boden');
  const vt=vtop(), vb=H*(H>W?.34:.42), vw=Math.min(W*.9,(vb-vt)*2.6);
  if(ls) A.drawCover(x,ls,-4,0,W+8,vb+40);
  else{ const sk=x.createLinearGradient(0,0,0,H*.5);sk.addColorStop(0,'#e9c7b0');sk.addColorStop(1,'#f5e3c6');x.fillStyle=sk;x.fillRect(-4,0,W+8,H); }
  if(lf){ const h=Math.max(40,(vb-vt)*.7); A.drawLayer(x,lf,0,vb+30-h,h,W+20,-10); }
  else{ x.fillStyle='#b9a192';x.beginPath();x.moveTo(-10,vb+30);x.quadraticCurveTo(W*.2,vb-40,W*.35,vb-20);x.lineTo(W*.65,vb-10);x.quadraticCurveTo(W*.85,vb-50,W+10,vb+30);x.fill(); }
  for(let k=0;k<3;k++){x.globalAlpha=k?.45:.9;x.fillStyle=k?'#6f5a50':'#8a6d60';x.beginPath();x.moveTo(W/2-vw/2+k*8,vb+20);x.quadraticCurveTo(W/2-vw*.18,vt+(vb-vt)*.25,W/2-vw*.08+k*3,vt);x.lineTo(W/2+vw*.08-k*3,vt);x.quadraticCurveTo(W/2+vw*.18,vt+(vb-vt)*.25,W/2+vw/2-k*8,vb+20);x.fill();}x.globalAlpha=1;
  // glühende Rinnen
  const glow=.55+.25*Math.sin(g.t*2);x.strokeStyle=`rgba(232,120,70,${glow})`;x.lineWidth=5;x.lineCap='round';
  [[-.04,.5],[.05,.7],[.02,.35]].forEach(([dx,len],i)=>{x.beginPath();x.moveTo(W/2+vw*dx,vt+4);x.quadraticCurveTo(W/2+vw*(dx*3+.03*i),vt+(vb-vt)*len*.5,W/2+vw*(dx*5),vt+(vb-vt)*len);x.stroke();});
  x.fillStyle=`rgba(240,140,80,${glow})`;x.beginPath();x.ellipse(W/2,vt+2,vw*.08,6,0,0,7);x.fill();
  g.smoke.forEach(s=>{x.fillStyle=`rgba(200,195,190,${Math.min(.55,s.l*.12)})`;x.beginPath();x.arc(s.x,s.y,s.r,0,7);x.fill();});
  // Boden
  const gt=vb;
  if(lb) A.drawLayer(x,lb,0,gt,H-gt,W+8,-4);
  else{ const gg=x.createLinearGradient(0,gt,0,H);gg.addColorStop(0,'#a58a6c');gg.addColorStop(1,'#8b7058');x.fillStyle=gg;x.fillRect(-4,gt,W+8,H-gt);
  x.fillStyle='rgba(60,40,25,.08)';for(let i=0;i<60;i++){const px=(i*137.5)%W,py=gt+((i*71)%100)/100*(H-gt);x.beginPath();x.ellipse(px,py,10+(i%5)*4,4+(i%3),0,0,7);x.fill();} }
  g.deco.forEach(d=>{const px=d.x*W,py=gt+30+d.y*(H-gt-40);spr(x,g.ic[d.k],px,py,(d.k==='farn'?46:30)*d.s);});
  // Wege
  const hintId=g.hintT>0?g.hint:-1;
  g.M.E.forEach(e=>{ x.strokeStyle='rgba(235,215,170,.9)';x.lineWidth=R()*.55;x.lineCap='round';x.beginPath();for(let u=0;u<=1.001;u+=.05){const p=curve(e,u);u?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]);}x.stroke();
    x.strokeStyle='rgba(120,90,60,.25)';x.lineWidth=2;x.setLineDash([4,10]);x.stroke();x.setLineDash([]); });
  // Gefahren
  g.M.E.forEach(e=>{ const h=e.haz; if(!h) return; const m=curve(e,.5),a=curve(e,.42),b=curve(e,.58),ang=Math.atan2(b[1]-a[1],b[0]-a[0])+Math.PI/2, L=R()*1.9, isHot=hot(h), wr=warn(h);
    x.save();x.translate(m[0],m[1]);x.rotate(ang);
    if(h.kind==='lava'){ x.fillStyle=isHot?'#e0703f':wr?'#7a4a3a':'#5d534e';x.beginPath();x.roundRect(-L,-R()*.36,L*2,R()*.72,R()*.36);x.fill();
      if(isHot){ x.fillStyle='rgba(250,200,110,.8)';for(let i=0;i<5;i++){const u=((g.t*.6+i/5)%1)*2-1;x.beginPath();x.ellipse(u*L,Math.sin(i*2+g.t*3)*4,8,4,0,0,7);x.fill();}
        x.fillStyle='rgba(240,130,70,.25)';x.beginPath();x.ellipse(0,0,L*1.1,R()*.8,0,0,7);x.fill(); }
      else { x.strokeStyle=wr?'rgba(240,130,70,.9)':'rgba(40,30,25,.4)';x.lineWidth=2;for(let i=-2;i<=2;i++){x.beginPath();x.moveTo(i*L*.35-6,-6);x.lineTo(i*L*.35+4,2);x.lineTo(i*L*.35-2,8);x.stroke();}
        x.fillStyle='rgba(235,235,235,.45)';const st=(g.t*.8)%1;x.beginPath();x.arc(Math.sin(g.t)*L*.3,-st*30,6+st*6,0,7);x.fill(); } }
    else { x.fillStyle='rgba(95,72,50,.5)';x.beginPath();x.roundRect(-L*1.1,-R()*.32,L*2.2,R()*.64,R()*.32);x.fill();x.fillStyle='rgba(255,240,210,.35)';for(let i=-2;i<=2;i++){x.beginPath();x.arc(i*L*.4,0,3,0,7);x.fill();}
      const p=h.t%(h.hot+h.cool), u=isHot?(p-h.cool)/h.hot:-1; const rx=isHot?-L*1.2+u*L*2.4:-L*1.25;
      x.save();x.translate(rx,0);x.rotate(isHot?u*8:0);spr(x,g.ic.stein,0,R()*.6,R()*1.3);x.restore();
      if(wr){x.fillStyle='rgba(240,195,90,.8)';x.beginPath();x.arc(-L*1.25,-R()*.7,5+Math.sin(g.t*14)*2,0,7);x.fill();} }
    x.restore(); });
  // Knoten
  const cur=g.M.nodes[g.cur];
  g.M.nodes.forEach(n=>{ const [px,py]=pos(n), r=R(), reach=!g.walk&&!g.done&&cur.nb.includes(n.id);
    if(reach||n.id===hintId){ x.fillStyle=`rgba(240,195,90,${n.id===hintId?.55+.3*Math.sin(g.t*8):.35+.15*Math.sin(g.t*4)})`;x.beginPath();x.ellipse(px,py,r*1.35,r*.95,0,0,7);x.fill(); }
    x.fillStyle='#6d5d52';x.beginPath();x.ellipse(px,py+4,r,r*.62,0,0,7);x.fill();
    x.fillStyle=n.id===g.M.start?'#d9c29a':'#b8a894';x.beginPath();x.ellipse(px,py,r,r*.6,0,0,7);x.fill();
    x.strokeStyle='rgba(61,50,38,.45)';x.lineWidth=2;x.stroke();
    if(n.item){ const bob=Math.sin(g.t*3+n.id)*4; x.fillStyle='rgba(255,245,200,.5)';x.beginPath();x.arc(px,py-r*.6+bob,r*.62,0,7);x.fill();spr(x,g.ic[n.item],px,py-r*.05+bob,r*1.1);
      if(Math.sin(g.t*5+n.id*2)>.93){x.fillStyle='#fff';x.beginPath();x.arc(px+r*.3,py-r*.9+bob,3,0,7);x.fill();} }
  });
  // Baby am Ziel
  const gp=pos(g.M.nodes[g.M.goal]); const bh=R()*2.1, happy=g.done||g.cur===g.M.goal;
  spr(x,happy?g.babyH:g.babyS,gp[0]+R()*1.25,gp[1]+R()*.35+(happy?-Math.abs(Math.sin(g.t*6))*8:0),bh,true);
  if(!happy){x.fillStyle='rgba(255,251,243,.92)';x.beginPath();x.arc(gp[0]+R()*2.3,gp[1]-bh*.9,14,0,7);x.fill();x.fillStyle='#c8553d';x.font='700 20px Andika,sans-serif';x.textAlign='center';x.fillText('?',gp[0]+R()*2.3,gp[1]-bh*.9+7);}
  // Forscher
  let ap=pos(cur), moving=false;
  if(g.walk){ const w=g.walk, u=w.back?(w.u<.5?w.u*.6:(1-w.u)*.6):w.u; const eu=w.dir>0?u:1-u; ap=curve(w.e,eu); moving=true; }
  const ah=R()*2.2, f=moving?g.av[Math.floor(g.t*10)%8]:g.avStand;
  x.fillStyle='rgba(40,30,20,.25)';x.beginPath();x.ellipse(ap[0],ap[1]+2,ah*.22,5,0,0,7);x.fill();
  spr(x,f,ap[0],ap[1]+4,ah,g.face<0);
  g.parts.forEach(p=>{x.globalAlpha=Math.min(1,p.l*1.5);x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill();});x.globalAlpha=1;
  // eingesammelte Dinge fliegen zur Anzeige
  g.fly.forEach(f=>{const e=f.u*f.u,tx=W/2-40,ty=26;spr(x,g.ic[f.k],DW.lerp(f.x,tx,e),DW.lerp(f.y,ty,e)-Math.sin(f.u*Math.PI)*60+20,R()*1.2*(1-f.u*.4));});
  x.restore();
}
DW.stations[ID]={title:'Vulkan-Expedition',mount,unmount(){ if(stopLoop)stopLoop(); stopLoop=null; G=null; delete window.__vulkanWin; delete window.__vulkanStep; delete window.__vulkanInfo; }};
})();
