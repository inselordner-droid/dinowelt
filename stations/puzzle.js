/* =====================================================================
   DINO-INSELWELT · Station Puzzle-Lichtung
   Gemalte Dino-Bilder als echtes Puzzle (4 bis 20 Teile).
   ===================================================================== */
(function(){
"use strict";
let root, P=null;
const PZ=()=>DW.state.puzzle;
const DIFFS=[{n:4,c:2,r:2,label:'4 Teile'},{n:6,c:3,r:2,label:'6 Teile'},{n:9,c:3,r:3,label:'9 Teile'},{n:12,c:4,r:3,label:'12 Teile'},{n:20,c:5,r:4,label:'20 Teile'},{n:24,c:6,r:4,label:'24 Teile'},{n:48,c:8,r:6,label:'48 Teile'}];
const IDB={open(){return new Promise(r=>{try{const q=indexedDB.open('dinoInselwelt',1);q.onupgradeneeded=()=>q.result.createObjectStore('bilder');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null);}catch(e){r(null);}});},
  async get(k){k=DW.profileKey(k);/* Bilder pro Profil (core.js) */const db=await this.open();if(!db)return null;return new Promise(r=>{try{const t=db.transaction('bilder').objectStore('bilder').get(k);t.onsuccess=()=>r(t.result||null);t.onerror=()=>r(null);}catch(e){r(null);}});},
  async set(k,v){k=DW.profileKey(k);const db=await this.open();if(!db)return;try{db.transaction('bilder','readwrite').objectStore('bilder').put(v,k);}catch(e){}}};
const PHOTOS=[{id:'foto-trex',n:'T-Rex (Foto)',src:'assets/puzzles/tyrannosaurus.jpg',fact:'Der T-Rex war einer der größten Fleischfresser aller Zeiten und hatte eine riesige Beißkraft.'}];
let ownURL=null;
const SCENE={trex:['#bfe0ea','#f3e6c4','#b9c98c'],triceratops:['#cfe6ee','#f6ecd2','#c9c98c'],stegosaurus:['#c9e3e6','#eef0d2','#a9c28a'],brachiosaurus:['#bfe0ea','#eef3dc','#9fbf7f'],
  velociraptor:['#f2dcb0','#fbeed4','#d9c08a'],ankylosaurus:['#cfe0e2','#f0ead0','#b9b98a'],parasaurolophus:['#cfe6ee','#f0f0dc','#9fbf8f'],spinosaurus:['#bfe0ea','#e3eef0','#8fbccb'],
  pteranodon:['#bcdff0','#f3f6f0','#8fbccb'],mammut:['#dfeaf0','#f4f8fa','#eef3f5'],plesiosaurus:['#bcdff0','#9fcfdc','#6fa3b8'],dimetrodon:['#f2d9a8','#fbeed4','#d9b88a']};
let diff=1;
/* Mehr Abwechslung: zu den festen Bildern kommen bei jedem Besuch ein paar zufällige Urzeittiere dazu.
   Hintergrund passend zum Lebensraum (Meer, Luft, Eiszeit, Land). */
const PZ_SCENE_BY={wasser:['#bcdff0','#9fcfdc','#6fa3b8'],luft:['#bcdff0','#f3f6f0','#a9c98a'],eis:['#dfeaf0','#f4f8fa','#eef3f5'],land:['#cfe6ee','#f6ecd2','#b9c98c'],alt:['#f2d9a8','#fbeed4','#d9b88a']};
function sceneOf(id){ if(SCENE[id]) return SCENE[id]; const a=DATA.animal(id)||{}, h=DATA.habitat(id);
  return h==='wasser'?PZ_SCENE_BY.wasser:h==='luft'?PZ_SCENE_BY.luft:a.era==='quartaer'?PZ_SCENE_BY.eis:['perm','karbon','devon','trias'].includes(a.era)?PZ_SCENE_BY.alt:PZ_SCENE_BY.land; }
function decoOf(id){ const a=DATA.animal(id)||{}, h=DATA.habitat(id); if(id==='mammut'||a.era==='quartaer') return 'schneeflocke'; if(h==='wasser'||['pteranodon','spinosaurus'].includes(id)) return 'welle';
  if(['velociraptor','dimetrodon','protoceratops'].includes(id)||['perm','trias'].includes(a.era)) return 'kaktus'; return h==='luft'?'wolke':'palme'; }
let extra=null;
function extraPool(){ const done=PZ().done; const all=GK.pool(a=>!DATA.PUZZLES.includes(a.id)&&a.era!=='heute').map(a=>a.id);
  const fresh=all.filter(id=>!done[id]); return DW.shuffle(fresh.length>=6?fresh:all).slice(0,6); }

function mount(r){ root=r; P=null; extra=extraPool(); diff=Math.min(PZ().diff??1,DIFFS.length-1);
  IDB.get('puzzle:eigen').then(u=>{ ownURL=u; if(!u||!root||P) return; const t=root.querySelector('#pzOwn'); if(t){ t.querySelector('.pic').innerHTML=`<img src="${u}" alt="" style="max-width:100%;max-height:110px;border-radius:12px">`; t.querySelector('small').textContent='Tippen zum Puzzeln'; } });
  GK.listen(window,'resize',onResize);
  pick(); }
/* Drehen / Größe ändern: Teile bleiben erreichbar, Zielplätze wandern mit dem Brett mit */
function onResize(){ if(!P||!root) return; const area=root.querySelector('#pzArea'); if(!area) return;
  const AR=area.getBoundingClientRect(), BR=P.board.getBoundingClientRect(), off={x:BR.left-AR.left,y:BR.top-AR.top};
  const dx=off.x-P.off.x, dy=off.y-P.off.y; P.off=off;
  P.pieces.forEach(pc=>{ pc.home.x+=dx; pc.home.y+=dy; if(pc.done){ pc.x=pc.home.x; pc.y=pc.home.y; }
    else { const w=pc.cv.width*(pc.s||1), h=pc.cv.height*(pc.s||1); pc.x=DW.clamp(pc.x,0,Math.max(0,AR.width-w)); pc.y=DW.clamp(pc.y,0,Math.max(0,AR.height-h)); }
    place(pc); }); }
function pick(){
  P=null;
  root.innerHTML=`<div class="fill col" style="overflow:auto">
    <div class="tabs" style="justify-content:center">${DIFFS.map((d,i)=>`<button data-d="${i}" class="${i===diff?'on':''}" style="min-height:48px">${d.label}</button>`).join('')}</div>
    <p class="hand" style="text-align:center;font-size:26px;margin:0">Welches Bild möchtest du puzzeln?</p>
    <div class="menu">${PHOTOS.map(p=>`<button class="tile" data-photo="${p.id}"><div class="pic"><img src="${p.src}" alt="" style="max-width:100%;max-height:110px;border-radius:12px"></div><b>${p.n}</b>${PZ().done[p.id]?`<span class="done">${ART.icon('check')}</span>`:''}</button>`).join('')}
      <button class="tile" id="pzOwn"><div class="pic">${ownURL?`<img src="${ownURL}" alt="" style="max-width:100%;max-height:110px;border-radius:12px">`:ART.icon('kamera',90)}</div><b>Eigenes Bild</b><small>${ownURL?'Tippen zum Puzzeln':'Foto oder Bild wählen'}</small></button>
      ${DATA.PUZZLES.concat(extra||[]).map(id=>{const d=PZ().done[id],sc=sceneOf(id);return `<button class="tile" data-id="${id}"><div class="pic" style="border-radius:14px;background:linear-gradient(${sc[0]},${sc[1]} 70%,${sc[2]} 70%)">${DW.animalImg(id,{})}</div><b>${DATA.nameOf(id)}</b>${d?`<small>geschafft: ${d} Teile</small><span class="done">${ART.icon('check')}</span>`:''}</button>`;}).join('')}</div></div>`;
  DW.$$('.tabs button',root).forEach(b=>b.onclick=()=>{diff=+b.dataset.d;PZ().diff=diff;DW.save();DW.sfx('tap');DW.say(DIFFS[diff].label);pick();});
  DW.$$('.tile[data-id]',root).forEach(t=>t.onclick=()=>{DW.sfx('pop');start(t.dataset.id);});
  DW.$$('.tile[data-photo]',root).forEach(t=>t.onclick=()=>{DW.sfx('pop');const p=PHOTOS.find(x=>x.id===t.dataset.photo);start(p.id,{src:p.src,n:p.n,fact:p.fact});});
  const inp=DW.h('<input type="file" accept="image/*" hidden>'); root.appendChild(inp);
  inp.onchange=()=>{ const f=inp.files[0]; if(!f) return; const rd=new FileReader(); rd.onload=()=>{ const im=new Image(); im.onload=()=>{ const c=document.createElement('canvas'),k=Math.min(1,1400/Math.max(im.width,im.height)); c.width=im.width*k; c.height=im.height*k; c.getContext('2d').drawImage(im,0,0,c.width,c.height); ownURL=c.toDataURL('image/jpeg',.85); IDB.set('puzzle:eigen',ownURL); DW.sfx('magic'); start('eigen',{src:ownURL,n:'dein Bild',fact:'Super, du hast dein eigenes Bild gepuzzelt!'}); }; im.src=rd.result; }; rd.readAsDataURL(f); };
  root.querySelector('#pzOwn').onclick=()=>{ DW.sfx('pop'); if(ownURL){ const m=DW.modal(`<div style="text-align:center"><h2>Eigenes Bild</h2><img src="${ownURL}" style="max-width:100%;max-height:40vh;border-radius:14px"><div class="row" style="justify-content:center;margin-top:12px;flex-wrap:wrap"><button class="btn go big" id="oPlay">${ART.icon('puzzle',36)}Puzzeln</button><button class="btn ghost big" id="oNew">${ART.icon('kamera',36)}Anderes Bild</button></div></div>`);
      m.querySelector('#oPlay').onclick=()=>{m.close();start('eigen',{src:ownURL,n:'dein Bild',fact:'Super, du hast dein eigenes Bild gepuzzelt!'});}; m.querySelector('#oNew').onclick=()=>{m.close();inp.click();}; }
    else inp.click(); };
  DW.say('Welches Dino-Bild möchtest du puzzeln? Oben kannst du aussuchen, wie viele Teile es hat.');
}
function sceneCanvas(id,W,H){
  return new Promise(res=>{ const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');const sc=sceneOf(id);
    const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,sc[0]);g.addColorStop(.68,sc[1]);g.addColorStop(.68,sc[2]);g.addColorStop(1,ART.shade(sc[2],.85));x.fillStyle=g;x.fillRect(0,0,W,H);
    x.fillStyle='rgba(255,245,210,.85)';x.beginPath();x.arc(W*.85,H*.16,H*.08,0,7);x.fill();
    x.fillStyle=ART.shade(sc[2],1.12);x.globalAlpha=.6;x.beginPath();x.moveTo(0,H*.68);for(let i=0;i<=W;i+=10)x.lineTo(i,H*.6-Math.sin(i/W*6)*H*.05-Math.sin(i/W*13)*H*.02);x.lineTo(W,H*.68);x.fill();x.globalAlpha=1;
    const deco=decoOf(id);
    const im=new Image(),d1=new Image();let n=0;const done=()=>{if(++n<2)return;
      [[.08,.34,.26],[.9,.4,.2]].forEach(([u,v,s])=>x.drawImage(d1,W*u-H*s/2,H*v,H*s,H*s));
      const r=Math.min(W*.82/im.naturalWidth,H*.8/im.naturalHeight);const w=im.naturalWidth*r,h=im.naturalHeight*r;x.drawImage(im,(W-w)/2,H*.93-h,w,h);
      const gr=x.createImageData(W,H);for(let i=0;i<gr.data.length;i+=4){gr.data[i]=60;gr.data[i+1]=45;gr.data[i+2]=30;gr.data[i+3]=Math.random()<.3?Math.random()*22:0;}const t=document.createElement('canvas');t.width=W;t.height=H;t.getContext('2d').putImageData(gr,0,0);x.drawImage(t,0,0);
      res(c);};
    im.onload=done;d1.onload=done;im.src=DW.svgURL(ART.animal(DATA.animal(id).art,{mood:'happy'}));d1.src=DW.svgURL(ART.icon(deco));
  });
}
function piecePath(x,c,r,w,h,t,E){ // E: Kanten-Richtungen
  const top=r===0?0:-E.h[r-1][c], bottom=r===E.rows-1?0:E.h[r][c], left=c===0?0:-E.v[r][c-1], right=c===E.cols-1?0:E.v[r][c];
  const edge=(x0,y0,dx,dy,d)=>{ // d: +1 raus, -1 rein; Normal nach außen = (dy,-dx)
    const L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=uy,ny=-ux; const P=(a,b)=>[x0+ux*a*L+nx*b*t*d,y0+uy*a*L+ny*b*t*d];
    if(!d){x.lineTo(x0+dx,y0+dy);return;}
    let p=P(.36,0);x.lineTo(p[0],p[1]);let c1=P(.40,.6),c2=P(.30,1.1),e=P(.5,1.1);x.bezierCurveTo(c1[0],c1[1],c2[0],c2[1],e[0],e[1]);
    c1=P(.70,1.1);c2=P(.60,.6);e=P(.64,0);x.bezierCurveTo(c1[0],c1[1],c2[0],c2[1],e[0],e[1]);x.lineTo(x0+dx,y0+dy);};
  x.beginPath();x.moveTo(t,t);edge(t,t,w,0,top);edge(t+w,t,0,h,right);edge(t+w,t+h,-w,0,bottom);edge(t,t+h,0,-h,left);x.closePath();
}
function photoCanvas(src,W,H){ return new Promise(res=>{ const im=new Image(); im.onload=()=>{ const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'); const k=Math.max(W/im.width,H/im.height); x.drawImage(im,(W-im.width*k)/2,(H-im.height*k)/2,im.width*k,im.height*k); res(c); }; im.src=src; }); }
async function start(id,photo){
  const D=DIFFS[diff];
  root.innerHTML=`<div class="pz fill" id="pzArea"><div class="pz-board card" id="pzBoard"><canvas id="pzGhost"></canvas></div>
    <div class="pz-ui"><button class="btn ghost" id="pzGhostBtn">${ART.icon('lupe',30)}Vorlage</button><span class="pill" id="pzCount" style="white-space:nowrap"></span></div></div>`;
  const area=root.querySelector('#pzArea'), board=root.querySelector('#pzBoard');
  const AR=area.getBoundingClientRect(); const bw=Math.min(AR.width*(AR.width>AR.height?.5:.86),(AR.height-90)*(AR.width>AR.height?.8:.5)*4/3), bh=bw*3/4;
  board.style.width=bw+'px'; board.style.height=bh+'px';
  const img=photo?await photoCanvas(photo.src,Math.round(bw),Math.round(bh)):await sceneCanvas(id,Math.round(bw),Math.round(bh));
  if(!root||!root.querySelector('#pzBoard')) return;
  const g=root.querySelector('#pzGhost'); g.width=img.width; g.height=img.height; g.getContext('2d').drawImage(img,0,0);
  const cols=D.c,rows=D.r,w=bw/cols,h=bh/rows,t=Math.min(w,h)*.2;
  const E={cols,rows,h:[...Array(rows-1)].map(()=>[...Array(cols)].map(()=>Math.random()<.5?1:-1)),v:[...Array(rows)].map(()=>[...Array(cols-1)].map(()=>Math.random()<.5?1:-1))};
  P={id,photo,D,pieces:[],placed:0,board,bw,bh,w,h,t};
  const BR=board.getBoundingClientRect(), off={x:BR.left-AR.left,y:BR.top-AR.top}; P.off=off;
  // Ablageplätze rund ums Brett
  const pw=w+2*t, ph=h+2*t; let SC=Math.min(.7,Math.max(.45,Math.sqrt(((AR.width*AR.height-bw*bh)*.55)/(cols*rows*pw*ph))));
  // Ablageplätze suchen; reichen sie nicht für alle Teile, Teile etwas kleiner machen (sonst liegen Teile verdeckt übereinander)
  const findSpots=sc=>{ const out=[], psw=pw*sc, psh=ph*sc;
    for(let y=6;y<AR.height-psh-72;y+=psh*.92) for(let x=6;x<AR.width-psw;x+=psw*.92){ const inB=x+psw>off.x-6&&x<off.x+bw+6&&y+psh>off.y-6&&y<off.y+bh+6; if(!inB) out.push([x,y]); }
    return out; };
  let spots=findSpots(SC); while(spots.length<cols*rows&&SC>.32){ SC*=.92; spots=findSpots(SC); }
  P.SC=SC;
  const sp=DW.shuffle(spots);
  let k=0;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const cv=document.createElement('canvas'); cv.width=pw; cv.height=ph; const x=cv.getContext('2d');
    piecePath(x,c,r,w,h,t,E); x.save(); x.clip(); x.drawImage(img,-(c*w-t),-(r*h-t)); x.restore();
    piecePath(x,c,r,w,h,t,E); x.strokeStyle='rgba(70,55,35,.55)'; x.lineWidth=2; x.stroke(); x.strokeStyle='rgba(255,255,255,.4)'; x.lineWidth=1; x.stroke();
    cv.className='pz-piece'; const home={x:off.x+c*w-t,y:off.y+r*h-t};
    const s=sp[k%Math.max(1,sp.length)]||[Math.random()*(AR.width-pw),AR.height-ph]; k++;
    const jit=[(Math.random()-.5)*20,(Math.random()-.5)*20];
    cv.dataset.hx=home.x; cv.dataset.hy=home.y; const pc={cv,home,x:s[0]+jit[0]*.4,y:s[1]+jit[1]*.4,done:false,s:SC}; P.pieces.push(pc); place(pc); area.appendChild(cv);
    drag(pc,area);
  }
  count();
  root.querySelector('#pzGhostBtn').onclick=()=>{ g.classList.toggle('show'); DW.sfx('tap'); };
  DW.say(`Ein Puzzle mit ${D.n} Teilen: ${photo?photo.n:DATA.nameOf(id)}. Zieh die Teile auf das Brett!`);
}
function place(pc){ pc.cv.style.transform=`translate(${pc.x}px,${pc.y}px) scale(${pc.s||1})`; }
function count(){ const el=root.querySelector('#pzCount'); if(el) el.textContent=`${P.placed} von ${P.pieces.length}`; }
let zTop=10;
function drag(pc,area){
  let st=null; GK.noFling(pc.cv);   // nach einem schnell gezogenen Teil kam der Tipp auf „Vorlage“ sonst nicht an
  /* Ein Teil gehört dem Finger, der es zuerst anfasst: ein zweiter Finger auf demselben Teil ließ es zwischen beiden hin- und herspringen */
  pc.cv.addEventListener('pointerdown',e=>{ if(pc.done||st||e.button>0) return; e.preventDefault(); try{ pc.cv.setPointerCapture(e.pointerId); }catch(err){} const A=area.getBoundingClientRect(),ax=e.clientX-A.left,ay=e.clientY-A.top; const rx=(ax-pc.x)/pc.s, ry=(ay-pc.y)/pc.s; pc.s=1; pc.x=ax-rx; pc.y=ay-ry; place(pc); st={id:e.pointerId,x:e.clientX,y:e.clientY,px:pc.x,py:pc.y}; pc.cv.style.zIndex=++zTop; pc.cv.classList.add('lift'); DW.sfx('pop'); });
  pc.cv.addEventListener('pointermove',e=>{ if(!st||e.pointerId!==st.id) return; pc.x=st.px+e.clientX-st.x; pc.y=st.py+e.clientY-st.y; place(pc); });
  const up=e=>{ if(!st||(e&&e.pointerId!==st.id)) return; st=null; pc.cv.classList.remove('lift'); if(!P) return;
    // nicht aus dem Spielfeld ziehen lassen (sonst ist das Teil verloren)
    { const A=area.getBoundingClientRect(), w=pc.cv.width*(pc.s||1), h=pc.cv.height*(pc.s||1); pc.x=DW.clamp(pc.x,-w*.3,Math.max(0,A.width-w*.7)); pc.y=DW.clamp(pc.y,-h*.3,Math.max(0,A.height-h*.7)); place(pc); }
    if(Math.hypot(pc.x-pc.home.x,pc.y-pc.home.y)<Math.max(26,P.w*.22)){ pc.x=pc.home.x; pc.y=pc.home.y; pc.done=true; pc.cv.classList.add('snap'); pc.cv.style.zIndex=2; place(pc); P.placed++; DW.sfx('click'); count();
      if(P.placed===P.pieces.length) GK.after(400,()=>{ if(P) finish(); }); }
  };
  pc.cv.addEventListener('pointerup',up); pc.cv.addEventListener('pointercancel',up); pc.cv.addEventListener('lostpointercapture',up);
}
function finish(){
  const id=P.id, a=P.photo?{n:P.photo.n,fact:P.photo.fact}:DATA.animal(id); DW.sfx('win'); DW.confetti(); P.board.classList.add('glow');
  const first=!PZ().done[id]||PZ().done[id]<P.D.n; PZ().done[id]=Math.max(PZ().done[id]||0,P.D.n); DW.save(); if(!P.photo) DW.discover(id,true);
  const stars=P.D.n>=12?3:P.D.n>=6?2:1; const photo=P.photo; DW.addStars('puzzle',first?stars:1); DW.addSticker('puzzle');
  GK.after(1200,()=>{ if(!P) return; const m=DW.modal(`<div style="text-align:center"><h2 style="margin:0">Geschafft!</h2><div>${DW.starRow(stars)}</div><p><b>${a.short||a.n}</b>: ${a.fact}</p>
     <div class="row" style="justify-content:center;flex-wrap:wrap"><button class="btn go big" id="pzMore">${ART.icon('puzzle',36)}Noch ein Puzzle</button>${diff<DIFFS.length-1?`<button class="btn sun big" id="pzHarder">${ART.icon('stern',36)}Mehr Teile</button>`:''}</div></div>`,{noclose:true});
    DW.say(`Geschafft! ${a.short||a.n}. ${a.fact}`);
    m.querySelector('#pzMore').onclick=()=>{m.close();pick();};
    const hh=m.querySelector('#pzHarder'); if(hh) hh.onclick=()=>{m.close();diff++;PZ().diff=diff;DW.save();start(id,photo);};
  });
}
function unmount(){ P=null; root=null; const o=DW.$('#overlay'); o.hidden=true; o.innerHTML=''; }
DW.stations.puzzle={title:'Puzzle-Lichtung',mount,unmount};
})();
