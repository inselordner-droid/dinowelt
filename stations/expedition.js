/* =====================================================================
   DINO-INSELWELT · Station Die große Dino-Expedition (GAME 30)
   Eine Reise auf einer gemalten Karte: Rucksack packen → Fluss über-
   queren → Fossil ausgraben → Fossil bestimmen → Foto machen → zurück
   ins Lager. Am Ende: das Reisetagebuch.
   Jede Etappe einzeln wiederholbar, kein Neustart wegen Fehlern.
   ===================================================================== */
(function(){
"use strict";
const ID='expedition';

/* Etappen-Daten */
const STAGES={
 pack:{icon:'rucksack',n:'Rucksack packen'},river:{icon:'welle',n:'Fluss überqueren'},dig:{icon:'schaufel',n:'Fossil ausgraben'},
 ident:{icon:'lupe',n:'Fossil bestimmen'},photo:{icon:'kamera',n:'Dino fotografieren'},camp:{icon:'zelt',n:'Zurück ins Lager'}};
const TOOLS={schaufel:'Schaufel',pinsel:'Pinsel',lupe:'Lupe',kamera:'Kamera',kompass:'Kompass',ballon:'Luftballon',musik:'Musik',melone:'Melone',sticker:'Sticker',auto:'Spielzeugauto'};
const NEED_ALL=['schaufel','pinsel','lupe','kamera','kompass'], DECOYS=['ballon','musik','melone','sticker','auto'];
const planOf=id=>(ART.SPECIES[ART.resolve(DATA.animal(id).art)]||{}).plan;
/* Fossilien: Landtiere mit gut erkennbarer Form (Dinos + bekannte Urzeit-Tiere); Sätze „von einem …“ passen zu allen */
const FOSSILS=GK.pool(a=>DATA.habitat(a.id)!=='wasser'&&(DATA.isDino(a.id)||['pteranodon','dimetrodon','mammut','megaloceros','wollnashorn'].includes(a.id))).map(a=>a.id);
/* Foto: Pflanzen- und Allesfresser-Dinos, die gemütlich vorbeilaufen */
const PHOTO=GK.pool(a=>DATA.isDino(a.id)&&a.food!=='fleisch'&&a.food!=='fisch'&&DATA.habitat(a.id)==='land').map(a=>a.id);
/* Auswahl beim Bestimmen: Leicht/Mittel andere Körperform, Schwer auch gleiche Form */
function identOpts(n){
  const f=E.fossil, other=FOSSILS.filter(x=>x!==f&&DATA.nameOf(x)!==DATA.nameOf(f));
  const diff=other.filter(x=>planOf(x)!==planOf(f)), same=other.filter(x=>planOf(x)===planOf(f));
  const pick=lv>=3&&same.length?[DW.pick(same),...GK.sample(diff,n-2)]:GK.sample(diff,n-1);
  return DW.shuffle([f,...pick]);
}
const LV={1:{stages:['pack','river','dig','ident'],need:3,decoy:2,list:'color',wobbly:false,choices:2,dig:.5,speed:90},
          2:{stages:['pack','river','dig','ident','photo'],need:3,decoy:3,list:'color',wobbly:false,choices:3,dig:.55,speed:120},
          3:{stages:['pack','river','dig','ident','photo','camp'],need:4,decoy:3,list:'shadow',wobbly:true,choices:3,dig:.6,speed:160}};
/* Route auf der Karte (viewBox 1000×620) */
const ROUTE='M150 520C260 520 300 440 380 420S520 400 560 350 690 270 760 260 900 200 860 130 700 90 600 110 420 110 330 170 170 250 150 380 140 470 170 520';
const AT={pack:.02,river:.2,dig:.36,ident:.52,photo:.7,camp:.86};

let root,lv=1,E=null;
/* Rückmeldungs-Klassen vor jeder neuen Rückmeldung abräumen – sonst gewinnt in der CSS-Reihenfolge immer dieselbe
   (nach einem Fehlversuch wackelte der Rucksack, ein späteres „richtig“ blieb ohne Hüpfer). */
const fb=el=>{ if(el) el.classList.remove('gk-good','gk-bad','gk-hint'); return el; };

function mount(r){ root=r; intro(); }
function intro(){
  E=null;
  GK.intro(root,{id:ID,art:'<div class="gc-art">'+(GK.icon('karte')+GK.icon('fernglas')+GK.img('triceratops'))+'</div>',title:'Große Expedition',
    say:'Heute wartet eine echte Expedition auf uns! Wir packen, klettern über den Fluss, graben ein Fossil aus und schreiben alles ins Tagebuch.',
    onStart:l=>{lv=l;start();}});
}
function start(){
  const L=LV[lv];
  const fossil=DW.pick(FOSSILS), photo=DW.pick(PHOTO.filter(p=>p!==fossil));
  const av=ART.AVATARS.find(a=>a.id===DW.state.avatar)||ART.AVATARS[0];
  E={L,i:0,fossil,photo,av,avURL:DW.svgURL(ART.avatar(av,{})),diary:{},tries:0};
  if(window.DW_DEBUG) window.__expeditionWin=()=>{ if(!E) return; E.L.stages.forEach(s=>{ E.diary[s]=E.diary[s]||{auto:1}; if(s==='pack') E.diary.pack={items:NEED_ALL.slice(0,E.L.need)}; }); E.i=E.L.stages.length; diary(); };
  if(window.DW_DEBUG) window.__expeditionGo=k=>{ if(!E) return; E.i=Math.max(0,E.L.stages.indexOf(k)); stage(); };
  if(window.DW_DEBUG) window.__expeditionState=()=>E&&{fossil:E.fossil,i:E.i,stage:E.L.stages[E.i]};
  map(true);
}

/* ---------- Karte ---------- */
/* Aquarell-Flecken der Karte (Fluss, Wiesen, Sand): Die wackeligen Kanten werden EINMAL als Pfad berechnet.
   Vorher machte das ein SVG-Filter (feTurbulence + feDisplacementMap) – der wurde bei jedem Schritt der Figur über die
   ganze Karte neu gerechnet, die Wanderung ruckelte. */
let MAPBG=null;
function mapBg(){ if(MAPBG) return MAPBG;
  const wob=(x,y)=>[x+5.5*(Math.sin(x*.021+y*.013+1)+.6*Math.sin(x*.047-y*.031+2.2)), y+5.5*(Math.sin(y*.019-x*.011+4)+.6*Math.sin(y*.043+x*.029+.7))];
  const f=v=>v.toFixed(1);
  const hs=k=>{ const v=Math.sin(k*127.1+3.7)*43758.5453; return (v-Math.floor(v))-.5; };   // feines „Papier-Riss“-Zittern
  const blob=(pts,k0=0)=>{ const q=pts.map((p,i)=>{ const w=wob(p[0],p[1]); return [w[0]+hs(k0+i*2)*4.4,w[1]+hs(k0+i*2+1)*4.4]; }), n=q.length, m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2], s0=m(q[n-1],q[0]); let d=`M${f(s0[0])} ${f(s0[1])}`;
    for(let i=0;i<n;i++){ const e=m(q[i],q[(i+1)%n]); d+=`Q${f(q[i][0])} ${f(q[i][1])} ${f(e[0])} ${f(e[1])}`; } return d+'Z'; };
  const ell=(cx,cy,rx,ry)=>{ const n=Math.round((rx+ry)/2.6); return [...Array(n)].map((_,i)=>[cx+Math.cos(i/n*2*Math.PI)*rx,cy+Math.sin(i/n*2*Math.PI)*ry]); };
  const cub=(p0,c1,c2,p3,n=44)=>[...Array(n)].map((_,i)=>{ const u=i/n,v=1-u; return [v*v*v*p0[0]+3*v*v*u*c1[0]+3*v*u*u*c2[0]+u*u*u*p3[0], v*v*v*p0[1]+3*v*v*u*c1[1]+3*v*u*u*c2[1]+u*u*u*p3[1]]; });
  const lin=(a,b,n=8)=>[...Array(n)].map((_,i)=>[a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n]);
  const river=[...cub([430,10],[470,120],[420,200],[470,300]),...cub([470,300],[520,400],[540,450],[500,610]),...lin([500,610],[560,610]),
    ...cub([560,610],[600,450],[530,360],[540,280]),...cub([540,280],[550,200],[520,110],[500,10]),...lin([500,10],[430,10])];
  return MAPBG=`<g opacity=".9"><path d="${blob(river,11)}" fill="#9cc6d3"/><path d="${blob(ell(780,420,170,110),500)}" fill="#b7cf9a"/><path d="${blob(ell(220,140,160,90),900)}" fill="#b7cf9a"/>
      <path d="${blob(ell(880,140,90,60),1300)}" fill="#c9b596"/><path d="${blob(ell(660,250,80,45),1700)}" fill="#d8c08c"/></g>`; }
function map(first){
  const L=E.L;
  root.innerHTML=`<div class="ex fill col"><div class="ex-mapbox"><svg class="ex-map" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet">
    <rect x="10" y="10" width="980" height="600" rx="40" fill="#efe2c2" stroke="#cdb994" stroke-width="4"/>
    ${mapBg()}
    <path d="${ROUTE}" fill="none" stroke="#b8926a" stroke-width="7" stroke-dasharray="4 16" stroke-linecap="round"/>
    <path id="exDone" d="${ROUTE}" fill="none" stroke="#c8553d" stroke-width="7" stroke-linecap="round" stroke-dasharray="0 9999"/>
    <image href="${DW.svgURL(ART.icon('zelt'))}" x="60" y="440" width="110" height="110"/>
    ${['palme','farn','palme','farn'].map((k,i)=>`<image href="${DW.svgURL(ART.icon(k))}" x="${[700,760,140,840][i]}" y="${[380,450,90,470][i]}" width="70" height="70"/>`).join('')}
    <g id="exMarks"></g><image id="exAv" href="${E.avURL}" width="64" height="94"/>
  </svg></div>
  <div class="ex-bar">${L.stages.map((s,i)=>`<span class="ex-chip ${i<E.i?'done':i===E.i?'now':''}">${GK.icon(STAGES[s].icon)}</span>`).join('')}</div></div>`;
  const svg=root.querySelector('.ex-map'), path=svg.querySelector('#exDone'), len=path.getTotalLength();
  const marks=svg.querySelector('#exMarks');
  L.stages.forEach((s,i)=>{ const p=path.getPointAtLength(len*AT[s]); const done=i<E.i;
    marks.insertAdjacentHTML('beforeend',`<g class="ex-mark ${done?'done':''} ${i===E.i?'now':''}" data-i="${i}" transform="translate(${p.x} ${p.y})"><circle r="40" fill="${done?'#a9cf8f':'#fbf6ea'}" stroke="#6b5a45" stroke-width="3"/>
      <image href="${DW.svgURL(ART.icon(done?'check':STAGES[s].icon))}" x="-28" y="-28" width="56" height="56"/></g>`); });
  const av=svg.querySelector('#exAv');
  const at=u=>{ const p=path.getPointAtLength(len*u); av.setAttribute('x',p.x-32); av.setAttribute('y',p.y-100); path.setAttribute('stroke-dasharray',`${len*u} 9999`); };
  const fin=E.i>=L.stages.length;
  const from=E.i===0?0:AT[L.stages[E.i-1]], to=fin?1:AT[L.stages[E.i]];
  at(from);
  if(first) DW.say('Das ist unsere Karte. Los geht’s im Lager!');
  let T=0; const dur=first?1.2:Math.max(1.2,(to-from)*6);
  GK.after(first?900:300,()=>{ GK.loop(dt=>{ if(!E) return false; T+=dt; const u=Math.min(1,T/dur), e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2; at(from+(to-from)*e); if(Math.floor(T*6)%2===0&&u<1&&Math.random()<.2) DW.sfx('step');
    if(u>=1){ GK.after(500,()=>{ if(!E) return; if(fin) diary(); else stage(); }); return false; } return true; }); });
  // Etappe per Tippen auch direkt starten
  marks.querySelectorAll('.ex-mark.now').forEach(m=>m.addEventListener('click',()=>{ if(E&&!fin){ DW.sfx('tap'); } }));
}
function next(){ E.i++; GK.idle.stop(); GK.after(1400,()=>{ if(E) map(false); }); }
function panel(kind,body){
  const s=STAGES[kind];
  root.innerHTML=`<div class="ex fill col"><div class="ex-head"><span class="ex-hic">${GK.icon(s.icon)}</span><h2 class="hand">${s.n}</h2>${GK.progress(E.i,E.L.stages.length)}</div>
    <div class="ex-body ex-${kind}">${body}</div></div>`;
  return root.querySelector('.ex-body');
}
function stage(){ const k=E.L.stages[E.i]; ({pack,river,dig,ident,photo,camp})[k](); }

/* ---------- 1) Rucksack packen ---------- */
function pack(){
  const L=E.L, need=GK.sample(NEED_ALL.filter(n=>E.L.stages.includes('photo')||n!=='kamera'),L.need), dec=GK.sample(DECOYS,L.decoy);
  const items=DW.shuffle([...need,...dec]); const got=[]; let full=false;
  const b=panel('pack',`<div class="ex-packrow"><div class="ex-note card">${need.map(n=>`<span class="ex-need ${L.list}" data-k="${n}">${GK.icon(n)}</span>`).join('')}</div>
    <div class="ex-bag" id="exBag">${GK.icon('rucksack')}</div></div><div class="ex-tray">${items.map(k=>`<button class="ex-item" data-k="${k}" aria-label="${TOOLS[k]}">${GK.icon(k)}</button>`).join('')}</div>`);
  const bag=b.querySelector('#exBag');
  DW.$$('.ex-item',b).forEach(el=>{ const k=el.dataset.k;
    DW.drag(el,{ghost:()=>GK.icon(k),onTap:()=>{DW.sfx('tap');DW.say(TOOLS[k]+'.');},
      onDrop:(x,y)=>{ if(full||!E||!bag.isConnected) return false;
        const r=bag.getBoundingClientRect(); if(!(x>r.left-40&&x<r.right+40&&y>r.top-40&&y<r.bottom+40)) return false;
        if(need.includes(k)){ got.push(k); el.style.visibility='hidden';   /* Platz bleibt frei – sonst rutschen Rucksack und Korb beim Einpacken */
          GK.ok(fb(bag)); DW.sfx('pop'); const n=b.querySelector(`.ex-need[data-k="${k}"]`); n.classList.add('in');
          if(got.length===need.length){ full=true; DW.$$('.ex-item',b).forEach(x=>{ x.style.pointerEvents='none'; x.style.opacity='.45'; });
            E.diary.pack={items:need}; DW.say('Alles eingepackt! Auf geht’s.'); DW.sfx('ok'); next(); } else DW.say(TOOLS[k]+'. Rein damit!');
          return true; }
        E.tries++; GK.no(fb(bag),DW.pick([`${TOOLS[k]}? Das brauchen wir heute nicht.`,`Hm, ${TOOLS[k]} hilft beim Forschen nicht.`])); return false; }}); });
  DW.say(L.list==='shadow'?'Was braucht eine Forscherin? Schau dir die Schatten auf dem Zettel an und pack die richtigen Sachen ein!':'Pack alles in den Rucksack, was auf dem Zettel ist!');
  GK.idle.set(()=>{ const k=need.find(n=>!got.includes(n)); GK.pulse(fb(b.querySelector(`.ex-item[data-k="${k}"]`))); },()=>DW.say('Zieh die Sachen vom Zettel in den Rucksack.'));
}

/* ---------- 2) Fluss überqueren ---------- */
const isTall=()=>root.clientHeight>root.clientWidth*1.1;
/* Nach Drehen/Größenänderung neu anordnen (Hoch- ↔ Querformat) */
function onRelayout(fn){ let t=0, was=isTall(); GK.listen(window,'resize',()=>{ clearTimeout(t); t=setTimeout(()=>{ if(!root||!E) return; const now=isTall(); if(now!==was){ was=now; fn(now); } },120); }); }
function river(){
  const L=E.L, cols=4; let tall=isTall();
  const P=(a,b)=>tall?`left:${b}%;top:${a}%`:`left:${a}%;top:${b}%`;
  const stones=[...Array(cols)].map((_,c)=>{ const n=L.wobbly?2:1, good=Math.floor(Math.random()*n); return [...Array(n)].map((_,j)=>({c,j,n,ok:j===good})); });
  const b=panel('river',`<div class="ex-rv"><div class="ex-bank l"></div><div class="ex-water"></div><div class="ex-bank r">${GK.icon('farn','ex-rvfarn')}</div>
    ${stones.flat().map(s=>`<button class="ex-stone ${s.ok?'flat':'round'}" data-c="${s.c}" data-j="${s.j}" style="${P(24+s.c*14.5,s.n===1?50:(s.j?68:32))}" aria-label="Stein"></button>`).join('')}
    <img class="ex-rvav" src="${E.avURL}" alt="" style="${P(9,50)}"></div>`);
  if(tall) b.querySelector('.ex-rv').classList.add('tall');
  let at=-1, fin=false; const avEl=b.querySelector('.ex-rvav');
  const setPos=(el,css)=>{ css.split(';').forEach(kv=>{ const [k,v]=kv.split(':'); el.style[k]=v; }); };
  onRelayout(t=>{ tall=t; b.querySelector('.ex-rv').classList.toggle('tall',tall);
    DW.$$('.ex-stone',b).forEach(el=>{ const st=stones[+el.dataset.c][+el.dataset.j]; setPos(el,P(24+st.c*14.5,st.n===1?50:(st.j?68:32))); });
    if(fin) setPos(avEl,P(90,50)); else if(at<0) setPos(avEl,P(9,50)); else { const cur=b.querySelector(`.ex-stone[data-c="${at}"].flat`)||b.querySelector(`.ex-stone[data-c="${at}"]`); avEl.style.left=cur.style.left; avEl.style.top=cur.style.top; } });
  const glow=()=>DW.$$('.ex-stone',b).forEach(s=>s.classList.toggle('next',+s.dataset.c===at+1));
  glow();
  DW.$$('.ex-stone',b).forEach(el=>el.onclick=()=>{ const c=+el.dataset.c, s=stones[c][+el.dataset.j];
    if(c!==at+1){ DW.sfx('tap'); DW.say('Immer zum nächsten Stein!'); GK.pulse(b.querySelector('.ex-stone.next')); return; }
    if(!s.ok){ E.tries++; el.classList.remove('wob');void el.offsetWidth;el.classList.add('wob'); DW.sfx('no'); DW.say('Huch, der wackelt! Nimm lieber den flachen Stein.'); return; }
    at=c; DW.sfx('jump'); avEl.style.left=el.style.left; avEl.style.top=el.style.top; avEl.classList.remove('hop');void avEl.offsetWidth;avEl.classList.add('hop'); glow();
    if(at===cols-1){ fin=true; GK.after(600,()=>{ setPos(avEl,P(tall?90:88,50)); DW.sfx('ok'); E.diary.river={}; DW.say('Geschafft! Trockene Füße!'); next(); }); } });
  DW.say(L.wobbly?'Hüpf über die Steine! Aber Vorsicht: Runde Steine wackeln. Die flachen sind sicher.':'Hüpf über den Fluss! Tippe immer auf den nächsten Stein.');
  GK.idle.set(()=>GK.pulse(b.querySelector('.ex-stone.next.flat')||b.querySelector('.ex-stone.next')),()=>DW.say('Tippe auf den leuchtenden Stein.'));
}

/* ---------- 3) Fossil ausgraben ---------- */
function fossilImg(cls){ return `<img class="${cls} ex-fossil" src="${DW.svgURL(ART.animal(DATA.animal(E.fossil).art||E.fossil,{shadow:false}))}" alt="Fossil">`; }
function dig(){
  const b=panel('dig',`<div class="ex-slab">${fossilImg('ex-fos')}<canvas class="ex-sand"></canvas><div class="ex-meter"><i></i></div></div>`);
  const cv=b.querySelector('canvas'), slab=b.querySelector('.ex-slab'), meter=b.querySelector('.ex-meter i'); let x, done=false, lastS=0;
  /* Fortschritt: grobes Raster merkt, wo schon gewischt wurde – ohne die Pixel der ganzen Fläche zurückzulesen */
  const GW=32, GH=20, grid=new Uint8Array(GW*GH); let cleared=0, CR=null;
  const pts=new Map();   // je Finger die letzte Stelle (für eine lückenlose Wischspur)
  const setup=()=>{ const r=slab.getBoundingClientRect(); cv.width=Math.max(10,Math.round(r.width)); cv.height=Math.max(10,Math.round(r.height)); x=cv.getContext('2d');
    x.fillStyle='#cda977';x.fillRect(0,0,cv.width,cv.height); for(let i=0;i<cv.width*cv.height/90;i++){x.fillStyle=Math.random()<.5?'rgba(120,85,45,.25)':'rgba(255,240,210,.3)';x.beginPath();x.arc(Math.random()*cv.width,Math.random()*cv.height,1+Math.random()*3,0,7);x.fill();}
    for(let i=0;i<14;i++){x.fillStyle='rgba(140,110,80,.6)';x.beginPath();x.ellipse(Math.random()*cv.width,Math.random()*cv.height,6+Math.random()*10,4+Math.random()*6,Math.random()*3,0,7);x.fill();} };
  requestAnimationFrame(setup);
  const mark=(px,py,r)=>{ const cw=cv.width/GW, ch=cv.height/GH, r2=r*r*.8;
    for(let j=Math.max(0,Math.floor((py-r)/ch));j<=Math.min(GH-1,Math.floor((py+r)/ch));j++) for(let i=Math.max(0,Math.floor((px-r)/cw));i<=Math.min(GW-1,Math.floor((px+r)/cw));i++){
      const k=j*GW+i; if(grid[k]) continue; const dx=(i+.5)*cw-px, dy=(j+.5)*ch-py; if(dx*dx+dy*dy<=r2){ grid[k]=1; cleared++; } } };
  const rub=e=>{ if(done||!x||!CR) return; const px=(e.clientX-CR.left)*cv.width/CR.width, py=(e.clientY-CR.top)*cv.height/CR.height, r=Math.max(28,cv.width*.07);
    const last=pts.get(e.pointerId)||[px,py], d=Math.hypot(px-last[0],py-last[1]), n=Math.max(1,Math.min(40,Math.ceil(d/(r*.5))));
    x.globalCompositeOperation='destination-out'; x.fillStyle='#000'; x.beginPath();
    for(let i=1;i<=n;i++){ const u=i/n, qx=last[0]+(px-last[0])*u, qy=last[1]+(py-last[1])*u; x.moveTo(qx+r,qy); x.arc(qx,qy,r,0,7); mark(qx,qy,r); }
    x.fill(); x.globalCompositeOperation='source-over'; pts.set(e.pointerId,[px,py]);
    const t=performance.now(); if(t-lastS>140){ lastS=t; DW.sfx('brush'); } };
  cv.addEventListener('pointerdown',e=>{e.preventDefault(); CR=cv.getBoundingClientRect(); pts.delete(e.pointerId); try{cv.setPointerCapture(e.pointerId);}catch(_){} rub(e);});
  cv.addEventListener('pointermove',e=>{ if(pts.has(e.pointerId)) rub(e); });
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>cv.addEventListener(ev,e=>pts.delete(e.pointerId)));
  let shown=-1;
  const check=()=>{ if(done||!x||!E) return; const f=cleared/(GW*GH), w=Math.round(Math.min(100,f/E.L.dig*100));
    if(w!==shown){ shown=w; meter.style.transform=`scaleX(${w/100})`; }
    if(f>=E.L.dig){ done=true; pts.clear(); cv.classList.add('gone'); DW.sfx('magic'); E.diary.dig={}; DW.say('Da ist es! Ein ganzes Skelett aus Stein!'); next(); } };
  GK.every(200,check);
  if(window.DW_DEBUG) window.__expeditionDig=()=>{ if(x){ x.clearRect(0,0,cv.width,cv.height); grid.fill(1); cleared=GW*GH; check(); } };
  DW.say('Hier liegt etwas im Sand! Wisch mit dem Finger den Sand weg.');
  GK.idle.set(()=>GK.pulse(slab),()=>DW.say('Reib mit dem Finger über den Sand, wie mit einem Pinsel.'));
}

/* ---------- 4) Fossil bestimmen ---------- */
function ident(){
  const L=E.L, opts=identOpts(L.choices);
  const b=panel('ident',`<div class="ex-idrow"><div class="ex-slab small">${fossilImg('ex-fos')}</div><span class="ex-q hand">?</span></div>
    <div class="gk-choices">${opts.map(id=>`<button class="gk-choice ex-ch" data-id="${id}">${GK.img(id)}<b>${DATA.animal(id).short||GK.name(id)}</b></button>`).join('')}</div>`);
  DW.$$('.ex-ch',b).forEach(el=>el.onclick=()=>{ const id=el.dataset.id;
    if(id===E.fossil){ GK.ok(fb(el)); b.querySelector('.ex-q').innerHTML=GK.img(id,{mood:'happy'}); DW.discover(id,true);
      E.diary.ident={id}; DW.say(`Richtig! Das Fossil ist von einem ${GK.name(id)}. ${DATA.animal(id).fact||''}`); DW.$$('.ex-ch',b).forEach(c=>c.disabled=true); E.i++; GK.idle.stop(); GK.after(4200,()=>{ if(E) map(false); }); return; }
    if(!el.classList.contains('out')) E.tries++; el.classList.add('out'); GK.no(fb(el),`Hm, schau mal genau hin: Passt die Form? ${DATA.animal(id).short||GK.name(id)} sieht anders aus.`); });
  DW.say('Wem gehört dieses Fossil? Vergleiche die Form!');
  GK.idle.set(()=>GK.pulse(b.querySelector(`.ex-ch[data-id="${E.fossil}"]`)),()=>DW.say('Schau auf den Kopf, den Schwanz und die Beine.'));
}

/* ---------- 5) Foto machen ---------- */
function photo(){
  const b=panel('photo',`<div class="ex-ph"><div class="ex-jungle">${GK.icon('palme','ex-p1')}${GK.icon('palme','ex-p2')}${GK.icon('farn','ex-p3')}</div>
    <img class="ex-walker" src="${DW.svgURL(ART.animal(DATA.animal(E.photo).art||E.photo,{shadow:false}))}" alt="">
    <div class="ex-frame"></div><div class="ex-flash"></div></div><button class="btn big go ex-shoot" type="button">${ART.icon('kamera',44)}Klick!</button>`);
  const ph=b.querySelector('.ex-ph'), w=b.querySelector('.ex-walker'), fr=b.querySelector('.ex-frame'); let X=-.3, got=false, T=0, PW=0, WW=0;
  /* Größen einmal messen (und nach Drehen/Größenänderung), der Dino wandert per transform – kein Layout pro Bild */
  const measure=()=>{ PW=ph.clientWidth; WW=w.offsetWidth||PW*.3; };
  const put=()=>{ w.style.transform=`translate3d(${(X*PW-WW/2).toFixed(1)}px,${(Math.abs(Math.sin(T*6))*-4).toFixed(1)}px,0)`; };
  measure(); put(); w.addEventListener('load',()=>{ measure(); put(); });
  { let t=0; GK.listen(window,'resize',()=>{ clearTimeout(t); t=setTimeout(()=>{ if(ph.isConnected){ measure(); put(); } },120); }); }
  GK.loop(dt=>{ if(!E||got||!ph.isConnected) return false; T+=dt; X+=dt*E.L.speed/Math.max(300,PW); if(X>1.15) X=-.35; put(); return true; });
  const shoot=()=>{ if(got) return; DW.sfx('click'); const fl=b.querySelector('.ex-flash'); fl.classList.remove('on');void fl.offsetWidth;fl.classList.add('on');
    const a=w.getBoundingClientRect(), f=fr.getBoundingClientRect(), cx=a.left+a.width/2;
    if(cx>f.left&&cx<f.right){ got=true; GK.ok(fb(fr)); E.diary.photo={id:E.photo}; DW.discover(E.photo,true); DW.say(`Klick! Ein tolles Foto von ${GK.name(E.photo)}!`); next(); }
    else { E.tries++; DW.say(cx<f.left?'Noch nicht! Warte, bis der Dino im Rahmen ist.':'Oh, zu spät! Er kommt gleich wieder.'); } };
  b.querySelector('.ex-shoot').onclick=shoot;
  if(window.DW_DEBUG) window.__expeditionShot=()=>{ X=.5; measure(); put(); shoot(); };
  DW.say(`Da kommt ein ${GK.name(E.photo)}! Drück auf Klick, wenn er im Rahmen ist.`);
  GK.idle.set(()=>GK.pulse(b.querySelector('.ex-shoot')),()=>DW.say('Warte, bis der Dino im Rahmen ist, dann drück auf Klick!'));
}

/* ---------- 6) Zurück ins Lager ---------- */
function camp(){
  const n=6; let tall=isTall();
  /* quer: von rechts nach links zum Zelt; hoch: von unten nach oben */
  const pp=i=>tall?{left:50+Math.sin(i*1.3)*22,top:86-i*12.5,rot:Math.cos(i*1.3)*20}:{left:84-i*12,top:50+Math.sin(i*1.3)*20,rot:-90+Math.cos(i*1.3)*20};
  const place=(el,i)=>{ const q=pp(i); el.style.left=q.left+'%'; el.style.top=q.top+'%'; el.style.transform=`rotate(${q.rot}deg)`; };
  const start=()=>tall?{left:'50%',top:'97%'}:{left:'94%',top:'50%'}, goal=()=>tall?{left:'50%',top:'16%'}:{left:'8%',top:'50%'};
  const b=panel('camp',`<div class="ex-cp${tall?' tall':''}">${[...Array(n)].map((_,i)=>`<button class="ex-print" data-i="${i}" aria-label="Fußspur">${GK.icon('fussabdruck')}</button>`).join('')}
    <span class="ex-tent">${GK.icon('zelt')}</span><img class="ex-cpav" src="${E.avURL}" alt=""></div>`);
  let at=-1, fin=false; const av=b.querySelector('.ex-cpav');
  const layout=()=>{ DW.$$('.ex-print',b).forEach(p=>place(p,+p.dataset.i)); const q=fin?goal():at<0?start():null;
    if(q){ av.style.left=q.left; av.style.top=q.top; } else { const p=b.querySelector(`.ex-print[data-i="${at}"]`); av.style.left=p.style.left; av.style.top=p.style.top; } };
  layout();
  onRelayout(t=>{ tall=t; b.querySelector('.ex-cp').classList.toggle('tall',tall); layout(); });
  const glow=()=>DW.$$('.ex-print',b).forEach(p=>p.classList.toggle('next',+p.dataset.i===at+1));
  glow();
  DW.$$('.ex-print',b).forEach(p=>p.onclick=()=>{ const i=+p.dataset.i; if(i!==at+1){ DW.sfx('tap'); GK.pulse(b.querySelector('.ex-print.next')); DW.say('Folge der Spur – Schritt für Schritt!'); return; }
    at=i; DW.sfx('step'); p.classList.add('on'); av.style.left=p.style.left; av.style.top=p.style.top; glow();
    if(at===n-1){ GK.after(500,()=>{ fin=true; const q=goal(); av.style.left=q.left; av.style.top=q.top; DW.sfx('ok'); E.diary.camp={}; DW.say('Zurück im Lager! Was für ein Tag!'); next(); }); } });
  DW.say('Es wird Abend. Folge unserer Fußspur zurück zum Zelt!');
  GK.idle.set(()=>GK.pulse(b.querySelector('.ex-print.next')),()=>DW.say('Tippe auf die leuchtende Fußspur.'));
}

/* ---------- Reisetagebuch ---------- */
function diary(){
  GK.idle.stop();
  const d=E.diary, L=E.L, nm=id=>DATA.animal(id).short||GK.name(id);
  const entry=(k,pic,txt)=>`<div class="ex-entry">${pic}<p>${txt}</p></div>`;
  const ents=L.stages.map(s=>{
    if(s==='pack') return entry(s,`<span class="ex-pics">${(d.pack&&d.pack.items||[]).map(i=>GK.icon(i)).join('')}</span>`,'Rucksack gepackt');
    if(s==='river') return entry(s,`<span class="ex-pics">${GK.icon('welle')}${GK.icon('stein')}</span>`,'Über den Fluss gehüpft');
    if(s==='dig') return entry(s,`<span class="ex-pics ex-fosbox">${fossilImg('ex-fos')}</span>`,'Fossil ausgegraben');
    if(s==='ident') return entry(s,`<span class="ex-pics">${GK.img(E.fossil)}</span>`,`Es war ein ${nm(E.fossil)}!`);
    if(s==='photo') return entry(s,`<span class="ex-pics ex-polar">${GK.img(E.photo)}</span>`,`Foto: ${nm(E.photo)}`);
    return entry(s,`<span class="ex-pics">${GK.icon('zelt')}${GK.icon('nacht')}</span>`,'Zurück im Lager'); }).join('');
  root.innerHTML=`<div class="ex fill col"><div class="ex-book card"><h2 class="hand">${GK.icon('buch','ex-bic')} Mein Reisetagebuch</h2><div class="ex-ents">${ents}</div></div>
    <button class="btn big go ex-done" type="button">${ART.icon('stern',40)}Fertig!</button></div>`;
  DW.say(`Unser Reisetagebuch! Wir haben ein Fossil von einem ${GK.name(E.fossil)} gefunden${E.diary.photo?' und '+GK.name(E.photo)+' fotografiert':''}. Du bist eine echte Forscherin, ein echter Forscher!`);
  const stars=E.tries<=2?3:E.tries<=6?2:1;
  root.querySelector('.ex-done').onclick=()=>{ DW.sfx('pop'); const st=GK.st(ID); st.master=true; DW.save(); DW.addFind(DW.pick(['knochen','zahn','spur']));
    const f=E.fossil; E=null;
    GK.finish(root,{id:ID,stars,art:'<div class="gc-art">'+(GK.img(f,{mood:'happy'}))+'</div>',title:'Meister-Forscher!',
      say:'Du hast die große Expedition geschafft! Das Meister-Forscher-Abzeichen gehört dir.',again:()=>start()}); };
  GK.idle.set(()=>GK.pulse(root.querySelector('.ex-done')),null);
}
DW.stations[ID]={title:'Große Expedition',mount,unmount(){ /* Ziehen mitten im Spiel abgebrochen: Geist-Bild entfernen */ DW.$$('body>.dragging').forEach(n=>n.remove());  E=null; ['__expeditionWin','__expeditionDig','__expeditionShot','__expeditionState','__expeditionGo'].forEach(k=>delete window[k]); }};
})();
