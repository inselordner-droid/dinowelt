/* =====================================================================
   DINO-INSELWELT · Station Dino-Tracker (GAME 22)
   Mit dem Tracker über das Gelände fahren: je näher am Dino, desto
   stärker piept es und desto heller leuchten die Ringe. Spuren lesen,
   Versteck antippen, Dino entdecken.
   ===================================================================== */
(function(){
"use strict";
const ID='tracker';
const planOf=id=>(ART.SPECIES[ART.resolve(DATA.animal(id).art)]||{}).plan;
/* Fußspuren-Typen nach Körperbau (echte Spurfossil-Merkmale, vereinfacht) */
const FOOT={
 raub:{say:'Drei lange, spitze Zehen mit Krallen. Hier lief ein Raubsaurier auf zwei Beinen!'},
 drei:{say:'Drei schlanke Zehen. Hier lief ein flinker Dino auf zwei Beinen. Er fraß auch Pflanzen.'},
 ente:{say:'Drei kurze, runde Zehen. Hier lief ein Pflanzenfresser – vielleicht ein Entenschnabel-Dino.'},
 riese:{say:'Riesige runde Abdrücke, größer als ein Autoreifen! Das war ein schwerer Langhals-Dino.'},
 vier:{say:'Breite Füße mit kurzen, stumpfen Zehen. Ein schwerer Pflanzenfresser auf vier Beinen!'},
};
const spOf=id=>ART.SPECIES[ART.resolve(DATA.animal(id).art)]||{};
/* Spurtyp aus Körperbau + Futter (Therizinosaurier hatten vier Zehen, Pachycephalosaurus-Spuren kennt man nicht → nicht dabei) */
const footOf=id=>{ const p=planOf(id), a=DATA.animal(id);
  if(p==='theropod') return ['fleisch','fisch'].includes(a.food)?'raub':id==='therizinosaurus'?null:'drei';
  if(p==='ornitho') return id==='pachycephalosaurus'?null:'ente';
  if(p==='sauropod') return DATA.lenM(id)>=15?'riese':null;
  if(['ceratops','stego','ankylo'].includes(p)) return 'vier';
  return null; };
const FEATHER=id=>!!spOf(id).feathers;
const DINOS=GK.dinos().map(a=>a.id).filter(id=>DATA.habitat(id)==='land'&&footOf(id));
const LVS={1:{rounds:3,spots:5,dinos:1,range:.62,prints:6,branch:true},2:{rounds:3,spots:7,dinos:1,range:.5,prints:4,branch:true},3:{rounds:3,spots:9,dinos:2,range:.4,prints:3,branch:false}};
const HIDE=['farn','palme','stein','blaetter','farn','palme'];
let root, lv=1, G=null;
function mount(r){ root=r; intro(); }
function intro(){
  GK.intro(root,{id:ID,title:'Dino-Tracker',art:`${devSVG(3)}${GK.img('parasaurolophus',{mood:'happy'})}`,
    say:'Psst! Hier versteckt sich ein Dino. Schieb den Tracker herum. Je lauter es piept, desto näher bist du!',onStart:l=>{lv=l;start();}});
}
function devSVG(bars){ return `<svg class="tr-devsvg" viewBox="0 0 64 80" aria-hidden="true"><g filter="url(#wc)"><rect x="8" y="10" width="48" height="64" rx="12" fill="#d9b36c" stroke="#5a4630" stroke-width="3"/><rect x="14" y="18" width="36" height="28" rx="5" fill="#2f4a3c"/>
  ${[0,1,2,3,4].map(i=>`<rect class="tr-bar" x="${17+i*6.4}" y="${40-i*4.5}" width="4.4" height="${4+i*4.5}" rx="1.2" fill="${i<bars?'#9ff08a':'#4d6a58'}"/>`).join('')}
  <circle cx="24" cy="58" r="5" fill="#c8553d" stroke="#5a4630" stroke-width="2"/><circle cx="40" cy="58" r="5" fill="#8fbccb" stroke="#5a4630" stroke-width="2"/><path d="M44 10 L50 0" stroke="#5a4630" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="0" r="3" fill="#c8553d"/></g></svg>`; }
function footSVG(k){
  const c='#6e5236';
  if(k==='raub'||k==='drei') return `<svg viewBox="0 0 40 50"><path d="M20 30 L8 6 M20 30 L20 2 M20 30 L32 6" stroke="${c}" stroke-width="6" stroke-linecap="round"/><ellipse cx="20" cy="34" rx="9" ry="10" fill="${c}"/></svg>`;
  if(k==='ente') return `<svg viewBox="0 0 40 50"><ellipse cx="9" cy="14" rx="6" ry="9" fill="${c}" transform="rotate(-18 9 14)"/><ellipse cx="20" cy="10" rx="6.5" ry="10" fill="${c}"/><ellipse cx="31" cy="14" rx="6" ry="9" fill="${c}" transform="rotate(18 31 14)"/><ellipse cx="20" cy="34" rx="12" ry="11" fill="${c}"/></svg>`;
  if(k==='riese') return `<svg viewBox="0 0 40 50"><ellipse cx="20" cy="28" rx="17" ry="16" fill="${c}"/><circle cx="8" cy="12" r="3.5" fill="${c}"/><circle cx="16" cy="9" r="3.5" fill="${c}"/><circle cx="24" cy="9" r="3.5" fill="${c}"/><circle cx="32" cy="12" r="3.5" fill="${c}"/></svg>`;
  return `<svg viewBox="0 0 40 50"><ellipse cx="20" cy="30" rx="14" ry="13" fill="${c}"/>${[6,14,26,34].map((x,i)=>`<ellipse cx="${x}" cy="${i%3?11:14}" rx="4" ry="5" fill="${c}"/>`).join('')}</svg>`;
}
function start(){
  G={L:LVS[lv],i:0,miss:0,used:[]};
  root.innerHTML=`<div class="tr fill">
    <div class="tr-top"><div id="trProg"></div><button class="tr-ask card" id="trAsk" type="button"><span class="tr-askic">${ART.icon('lautsprecher')}</span><span id="trAskT">Finde den Dino!</span></button></div>
    <div class="tr-field" id="trField"><div class="tr-hill"></div><div class="tr-clues" id="trClues"></div><div class="tr-spots" id="trSpots"></div>
      <div class="tr-dev" id="trDev"><span class="tr-ring"></span><span class="tr-ring r2"></span><span class="tr-ring r3"></span><div class="tr-devin" id="trDevIn">${devSVG(0)}</div></div></div>
    <div class="tr-found" id="trFound"></div></div>`;
  root.querySelector('#trAsk').onclick=()=>{DW.sfx('tap');DW.repeat();};
  const f=root.querySelector('#trField'), dev=root.querySelector('#trDev');
  let drag=false;
  const to=(e,now)=>{ const r=f.getBoundingClientRect(); G.tx=DW.clamp(e.clientX-r.left,20,r.width-20); G.ty=DW.clamp(e.clientY-r.top,20,r.height-20); if(now){G.dx=G.tx;G.dy=G.ty;} };
  GK.listen(dev,'pointerdown',e=>{ e.stopPropagation(); drag=true; try{dev.setPointerCapture(e.pointerId);}catch(_){} dev.classList.add('grab'); });
  GK.listen(dev,'pointermove',e=>{ if(drag) to(e,true); });
  const up=()=>{ if(!drag) return; drag=false; dev.classList.remove('grab'); checkSearch(true); };
  GK.listen(dev,'pointerup',up); GK.listen(dev,'pointercancel',up);
  GK.listen(f,'pointerdown',e=>{ if(e.target.closest('.tr-spot,.tr-clue,.tr-dev')) return; to(e,false); DW.sfx('tap'); });
  const tok=G; GK.loop((dt,T)=>{ if(G!==tok) return false; tick(dt,T); });
  GK.listen(window,'resize',()=>{ if(G===tok) relayout(); });
  round();
}
function round(){
  GK.idle.stop();
  if(G.i>=G.L.rounds) return end();
  root.querySelector('#trProg').innerHTML=GK.progress(G.i,G.L.rounds);
  const f=root.querySelector('#trField'), W=f.clientWidth, H=f.clientHeight;
  // Verstecke verteilen (3 Reihen, hinten kleiner)
  const n=G.L.spots, rows=[.36,.6,.84], per=Math.ceil(n/3), S=Math.min(W,H);
  const spots=[]; let k=0;
  rows.forEach((ry,ri)=>{ const m=Math.min(per,n-k); for(let j=0;j<m;j++,k++){ const x=(j+.5+(ri%2?.25:-.1)+DW.rand(-.12,.12))/m*W; const sz=Math.max(56,S*(.25+ri*.06)*(W<500?1.05:1));   // Handy quer: Feld ist sehr flach – Versteck trotzdem mind. 56 px
    spots.push({x:DW.clamp(x,sz/2+4,W-sz/2-4),y:ry*H,s:sz,icon:DW.pick(HIDE)}); } });   // Versteck ganz im Feld (wurde am Rand abgeschnitten)
  const pool=DINOS.filter(d=>!G.used.includes(d)); const dinos=GK.sample(pool,G.L.dinos); G.used.push(...dinos);
  const hide=GK.sample(spots.map((_,i)=>i),dinos.length);
  // Tracker startet weit weg vom ersten Versteck
  const far=spots.slice().sort((a,b)=>Math.hypot(b.x-spots[hide[0]].x,b.y-spots[hide[0]].y)-Math.hypot(a.x-spots[hide[0]].x,a.y-spots[hide[0]].y))[0];
  G.dx=G.tx=DW.clamp(W-far.x,40,W-40)*.2+far.x*.8; G.dy=G.ty=DW.clamp(far.y-S*.05,40,H-40);
  G.r={spots,dinos:dinos.map((id,j)=>({id,spot:hide[j],found:false})),done:false,hold:0,beep:0,W0:W,H0:H};
  root.querySelector('#trSpots').innerHTML=spots.map((s,i)=>`<button class="tr-spot" type="button" data-i="${i}" style="left:${s.x}px;top:${s.y}px;width:${s.s}px;height:${s.s}px;z-index:${Math.round(s.y)}"><span class="tr-dino"></span>${ART.icon(s.icon)}</button>`).join('');
  DW.$$('.tr-spot',root).forEach(b=>b.onclick=()=>tapSpot(+b.dataset.i));
  // Hinweise: Fußspuren zum Versteck, abgeknickter Ast, Feder
  const cl=root.querySelector('#trClues'); cl.innerHTML=[...Array(7)].map(()=>`<img class="tr-gras" src="${DW.svgURL(ART.icon(DW.pick(['gras','moos','blume','gras'])))}" alt="" style="left:${DW.rand(3,93).toFixed(0)}%;top:${DW.rand(25,92).toFixed(0)}%">`).join('');
  G.r.dinos.forEach(d=>{ const s=spots[d.spot], fk=footOf(d.id), side=s.x<W/2?1:-1;
    const sx=s.x+side*W*.42, sy=DW.clamp(s.y+DW.rand(-.15,.15)*H,H*.3,H*.95), cnt=G.L.prints;
    const ang=Math.atan2(s.y-sy,s.x-sx)*180/Math.PI+90;
    for(let q=0;q<cnt;q++){ const u=q/(cnt+1.4); const x=sx+(s.x-sx)*u+(q%2?8:-8), y=sy+(s.y-sy)*u; const sz=(fk==='riese'?1.5:1)*S*.07;
      cl.insertAdjacentHTML('beforeend',`<button class="tr-clue tr-print" type="button" data-say="${FOOT[fk].say}" style="left:${x}px;top:${y}px;width:${sz}px;height:${sz*1.25}px;transform:translate(-50%,-50%) rotate(${ang.toFixed(0)}deg);opacity:${(.45+.5*(1-u)).toFixed(2)}">${footSVG(fk)}</button>`); }
    if(G.L.branch) cl.insertAdjacentHTML('beforeend',`<button class="tr-clue tr-branch" type="button" data-say="Ein abgeknickter Ast! Hier ist jemand Großes vorbeigekommen." style="left:${DW.clamp(s.x-side*s.s*.7,S*.05+24,W-S*.05-24)}px;top:${s.y+s.s*.1}px;width:${S*.09}px;height:${S*.09}px">${ART.icon('zweig')}</button>`);
    if(FEATHER(d.id)&&lv<3) cl.insertAdjacentHTML('beforeend',`<button class="tr-clue" type="button" data-say="${footOf(d.id)==='raub'?'Eine Feder! Viele Raubsaurier hatten Federn.':'Eine Feder! Viele Dinos hatten Federn.'}" style="left:${DW.clamp(s.x+side*s.s*.6,S*.04+24,W-S*.04-24)}px;top:${s.y-s.s*.1}px;width:${S*.07}px;height:${S*.07}px">${ART.icon('feder')}</button>`);
  });
  DW.$$('.tr-clue',root).forEach(c=>c.onclick=()=>{ DW.sfx('pop'); glow(c); DW.say(c.dataset.say); });
  root.querySelector('#trFound').innerHTML=G.r.dinos.map(()=>`<span class="tr-slot">?</span>`).join('');
  const two=G.r.dinos.length>1;
  const t=two?'Zwei Dinos haben sich versteckt! Schieb den Tracker herum. Piept es schneller, bist du ganz nah.':'Ein Dino hat sich versteckt! Schieb den Tracker herum. Je schneller es piept, desto näher bist du. Schau auch auf die Spuren!';
  root.querySelector('#trAskT').textContent=two?'Finde zwei Dinos!':'Finde den Dino!';
  DW.say(t);
  GK.idle.set(()=>{ GK.pulse(root.querySelector('#trDevIn')); glow(root.querySelector('.tr-print')); },()=>DW.say('Zieh den Tracker zu den Fußspuren. Wo piept es am schnellsten? Dann tippe auf das Versteck.'));
}
/* Drehen / Größe ändern: Verstecke, Spuren und Tracker mitskalieren */
function relayout(){
  const f=root.querySelector('#trField'); if(!f||!G.r||!G.r.W0) return; const W=f.clientWidth, H=f.clientHeight, sx=W/G.r.W0, sy=H/G.r.H0; if(!sx||!sy) return;
  G.r.spots.forEach(s=>{ s.x*=sx; s.y*=sy; });
  DW.$$('.tr-spot,.tr-clue',f).forEach(el=>{ el.style.left=(parseFloat(el.style.left)*sx)+'px'; el.style.top=(parseFloat(el.style.top)*sy)+'px'; });
  G.tx*=sx; G.ty*=sy; G.dx*=sx; G.dy*=sy; G.r.W0=W; G.r.H0=H;
}
/* Hinweis-Leuchten an Spuren: nur filter (Spuren sind per transform platziert und gedreht) */
function glow(el){ if(!el) return; el.classList.remove('tr-hint'); void el.offsetWidth; el.classList.add('tr-hint'); }
function sigAt(x,y){ const r=G.r, f=root.querySelector('#trField'); const D=Math.hypot(f.clientWidth,f.clientHeight)*G.L.range; let best=0,bd=null;
  r.dinos.forEach(d=>{ if(d.found) return; const s=r.spots[d.spot]; const v=DW.clamp(1-Math.hypot(x-s.x,y-s.y)/D,0,1); if(v>best){best=v;bd=d;} }); return [best,bd]; }
function tick(dt,T){
  if(!G.r) return; const dev=root.querySelector('#trDev'); if(!dev) return;
  G.dx+=(G.tx-G.dx)*Math.min(1,dt*6); G.dy+=(G.ty-G.dy)*Math.min(1,dt*6);
  dev.style.transform=`translate(${G.dx}px,${G.dy}px)`;
  if(G.r.done) return;
  let [sig,d]=sigAt(G.dx,G.dy);
  if(lv===3) sig=DW.clamp(sig+Math.sin(T*7)*.04,0,1);
  const bars=Math.round(sig*5); if(bars!==G.bars){ G.bars=bars; root.querySelector('#trDevIn').innerHTML=devSVG(bars); }
  dev.style.setProperty('--sig',sig.toFixed(2)); dev.style.setProperty('--p',(1.6-sig*1.25).toFixed(2)+'s');
  dev.classList.toggle('hot',sig>.82);
  G.r.beep-=dt; if(G.r.beep<=0&&sig>0){ G.r.beep=DW.lerp(1.5,.16,sig); DW.sfx(sig>.82?'clink':'click'); }
  // nah am Versteck: Busch raschelt
  DW.$$('.tr-spot',root).forEach((b,i)=>b.classList.toggle('rustle',!!(d&&d.spot===i&&sig>.82)));
  G.sig=sig; G.near=d;
}
function checkSearch(fromDrop){
  const r=G.r; if(!r||r.done) return; const d=G.near;
  if(d&&G.sig>.82){ const s=r.spots[d.spot]; if(Math.hypot(G.dx-s.x,G.dy-s.y)<s.s*.8) reveal(d); else if(fromDrop) DW.say('Ganz nah! Tippe auf das Versteck!'); }
}
function tapSpot(i){
  const r=G.r; if(!r||r.done) return; const d=r.dinos.find(d=>!d.found&&d.spot===i);
  const b=root.querySelector(`.tr-spot[data-i="${i}"]`);
  G.tx=r.spots[i].x; G.ty=r.spots[i].y;
  if(d){ reveal(d); return; }
  /* schon gefundener Dino steht hier: kein Fehlversuch, er sagt nur noch einmal seinen Namen */
  const was=r.dinos.find(x=>x.found&&x.spot===i); if(was){ DW.sfx('pop'); DW.say(DATA.nameOf(was.id)); return; }
  /* Busch wackelt: am gezeichneten Busch (Kind-Element) – der Knopf selbst ist per transform platziert */
  const sv=b.querySelector(':scope > svg')||b;
  G.miss++; sv.classList.remove('tr-wig'); void b.offsetWidth; sv.classList.add('tr-wig'); DW.sfx('brush');
  DW.say(DW.pick(['Raschel, raschel – hier ist nur ein Käfer. Hör auf den Tracker!','Hier ist niemand. Wo piept es schneller?','Nichts! Folge den Fußspuren.']));
}
function reveal(d){
  const r=G.r; if(d.found) return; d.found=true; GK.idle.stop();
  const b=root.querySelector(`.tr-spot[data-i="${d.spot}"]`), dn=b.querySelector('.tr-dino');
  dn.innerHTML=DW.animalImg(d.id,{mood:'happy',shadow:false}); b.classList.add('open'); if(r.spots[d.spot].x>root.querySelector('#trField').clientWidth/2) b.classList.add('toL'); b.style.zIndex=999; b.classList.remove('rustle');
  DW.sfx('magic'); if(DATA.lenM(d.id)>=8) DW.roar(); DW.discover(d.id);
  const slot=DW.$$('.tr-slot',root).find(s=>!s.classList.contains('ok')); if(slot){ slot.classList.add('ok'); slot.innerHTML=DW.animalImg(d.id,{shadow:false}); }
  const a=DATA.animal(d.id), left=r.dinos.filter(x=>!x.found).length;
  DW.say(`Gefunden! Das ist ${DATA.nameOf(d.id)}. ${a.fact||''}${left?' Einer versteckt sich noch!':''}`);
  if(!left){ r.done=true; G.i++; afterVoice(3600,round); }
  else GK.after(4000,()=>GK.idle.set(()=>GK.pulse(root.querySelector('#trDevIn')),()=>DW.say('Noch ein Dino! Schieb den Tracker weiter.')));
}
function end(){
  const stars=G.miss<=2?3:G.miss<=5?2:1;
  GK.finish(root,{id:ID,stars,title:'Super Spurenleser!',art:`${devSVG(5)}${GK.img(G.used[G.used.length-1],{mood:'happy'})}`,
    say:'Toll! Du hast alle Dinos aufgespürt. Du bist ein echter Dino-Tracker!',again:()=>start()});
}
/* fn nach ms – aber erst, wenn die Stimme fertig ist (höchstens 12 s länger): sonst schneidet der nächste Satz den Wissenssatz ab */
function afterVoice(ms,fn){ const g=G, t0=performance.now(), go=()=>{ if(G!==g||!G) return; if(DW.speaking()&&performance.now()-t0<ms+12000){ GK.after(250,go); return; } fn(); }; GK.after(ms,go); }
if(window.DW_DEBUG) window.__trackerAuto=()=>{ const r=G&&G.r; if(!r||r.done) return; const d=r.dinos.find(d=>!d.found); const s=r.spots[d.spot]; G.tx=s.x; G.ty=s.y+2; GK.after(900,()=>tapSpot(d.spot)); };
DW.stations[ID]={title:'Dino-Tracker',mount,unmount(){G=null;}};
})();
