/* =====================================================================
   DINO-INSELWELT · Station Kartenhaus (GAME 13 – Dino-Sammelkarten)
   Sammelalbum für 104 Karten, nach Erdzeitaltern geordnet. Päckchen
   aufreißen, Karten umdrehen, groß ansehen (Rückseite mit Wissen).
   Päckchen: 1 pro 8 Sterne (alle Spiele), Flaschenpost, Bonus-Spiel.
   ===================================================================== */
(function(){
"use strict";
const ID='karten';
const INK='#3d3226';
/* ---------- Spieldaten ---------- */
const RARE=['Tyrannosaurus','Spinosaurus','Triceratops','Brachiosaurus','Quetzalcoatlus','Megalodon','Mammut','Dreadnoughtus','Stegosaurus','Titanoboa','Giganotosaurus','Säbelzahnkatze','Archaeopteryx'];
const FOOD={fleisch:{ic:['fleisch'],t:'frisst Fleisch'},pflanzen:{ic:['farn'],t:'frisst Pflanzen'},fisch:{ic:['fisch'],t:'frisst Fische'},
  alles:{ic:['fruechte','fleisch'],t:'frisst fast alles'},insekten:{ic:['insekten'],t:'frisst Insekten'}};
const PER_PACK=3, NEW_BIAS=.72, KID_M=1.2, BONUS_ROUNDS=3;
/* eigene Symbole (64×64) */
const S=`stroke="${INK}" stroke-width="1.5" stroke-opacity=".75" stroke-linejoin="round"`;
ART.ICONS.kh_flasche=`<path d="M27 5h10v9l5 7q4 6 4 13v20q0 5-5 5H23q-5 0-5-5V34q0-7 4-13l5-7z" fill="#bfe0da" ${S}/><rect x="25" y="3" width="14" height="7" rx="2" fill="#a8724a" ${S}/><g transform="rotate(-10 32 40)"><path d="M23 31h18v18H23z" fill="#f3e3bf" stroke="#a8724a" stroke-width="1.3"/><path d="M26 36h11M26 40h12M26 44h8" stroke="#a8724a" stroke-width="1.3"/></g><path d="M22 26q2-4 4-5" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>`;
ART.ICONS.kh_pack=`<path d="M14 12l4-5 4 5 4-5 4 5 4-5 4 5 4-5 4 5 4-5 4 5v40l-4 5-4-5-4 5-4-5-4 5-4-5-4 5-4-5-4 5-4-5z" fill="#e9a03f" ${S}/><path d="M14 18h36" stroke="#c8553d" stroke-width="2.4" stroke-dasharray="3 3"/><circle cx="32" cy="36" r="12" fill="#f7f0e1" ${S}/><path d="M26 40q0-8 6-10 5-1 7 3l3-1-2 4q-2 5-8 6z" fill="#7fa66a" ${S}/><circle cx="36" cy="33" r="1.2" fill="${INK}"/>`;
ART.ICONS.kh_album=`<path d="M10 12q10-4 22 2v42q-12-6-22-2z" fill="#d98b5f" ${S}/><path d="M54 12q-10-4-22 2v42q12-6 22-2z" fill="#e9a978" ${S}/><rect x="15" y="20" width="10" height="16" rx="2" fill="#f7f0e1" ${S}/><rect x="39" y="20" width="10" height="16" rx="2" fill="#f7f0e1" ${S}/><rect x="39" y="38" width="10" height="12" rx="2" fill="#f7f0e1" ${S} opacity=".6"/>`;

let root, pageIdx=0, pages=[], bonusDone=false, fresh=new Set(), viewList=[], resizeT=null;
const C=()=>{ GK.packsLeft(); const c=DW.state.cards; c.have=c.have||{}; c.opened=c.opened||0; return c; };
const cardByNo=no=>DATA.CARDS[no-1];
const has=no=>(C().have[no]||0)>0;
const ownedN=()=>DATA.CARDS.filter(c=>has(c.no)).length;
const eraOf=c=>DATA.eraById(c.era)||DATA.eraById('kreide');
const isRare=c=>RARE.includes(c.n);
const esc=s=>String(s).replace(/</g,'&lt;');
const ERAS=()=>DATA.ERAS.filter(e=>DATA.CARDS.some(c=>eraOf(c).id===e.id));
const avatar=()=>ART.AVATARS.find(a=>a.id===DW.state.avatar)||ART.AVATARS[0];

/* ---------- Größe lesen & vergleichen ---------- */
function parseLen(s){ const m=/([\d]+(?:,\d+)?)\s*(cm|m)\b/.exec(s||''); if(!m) return null; let v=parseFloat(m[1].replace(',','.')); if(m[2]==='cm') v/=100;
  return {m:v,kind:/Flügel/.test(s)?'fl':/hoch/.test(s)?'hoch':'lang'}; }
function fmtM(v){ return v<1?`${Math.round(v*100)} Zentimeter`:`${String(Math.round(v*10)/10).replace('.',',')} Meter`; }
function sizeSay(c){ const p=parseLen(c.len); if(!p) return ''; const n=fmtM(p.m);
  if(p.kind==='fl') return `Von Flügelspitze zu Flügelspitze: ${n}.`;
  if(p.kind==='hoch') return `So hoch: ${n}.${p.m>KID_M*1.5?' Viel größer als du!':''}`;
  if(p.m<KID_M) return `Nur ${n} lang. Kleiner als du!`;
  const k=Math.round(p.m/KID_M); return `Etwa ${n} lang. ${k>=2?`So lang wie ${k} Kinder hintereinander!`:'Ungefähr so lang, wie du groß bist.'}`; }
function sizeHTML(c,w){
  const p=parseLen(c.len); if(!p) return '';
  const bw=w*.84, bh=w*.44, kidH=Math.max(14,Math.min(bh*.9, bh/1.25*KID_M)), ppm0=kidH/KID_M;
  const ppm=Math.min(ppm0,(bw-kidH*.8-16)/Math.max(p.m,.2));
  const kh=Math.max(14,KID_M*ppm), len=Math.max(10,p.m*ppm);
  const kid=`<img class="kh-kid" src="${DW.svgURL(ART.avatar(avatar(),{}))}" style="height:${kh}px" alt="Du">`;
  let dino;
  if(p.kind==='hoch') dino=`<span class="kh-bar-v" style="height:${Math.min(bh,len)}px"></span>`;
  else if(c.id&&p.kind==='lang') dino=`<img class="kh-sdino" src="${DW.svgURL(DW.animalSVG(c.id,{shadow:false}))}" style="width:${len}px" alt="">`;
  else dino=`<span class="kh-bar-h ${p.kind==='fl'?'fl':''}" style="width:${len}px"></span>`;
  const hh=Math.min(bh,Math.max(kh,p.kind==='hoch'?len:(c.id&&p.kind==='lang')?len*.6:w*.05))+26;
  return `<div class="kh-size" style="height:${hh}px">${kid}${dino}<small>${esc(c.len)}</small></div>`;
}

/* ---------- Mount & Hauptansicht ---------- */
function mount(r){
  root=r; fresh=new Set(); C();   // bonusDone bleibt für diesen Besuch der App bestehen (sonst endlose Päckchen durch Raus-und-Rein)
  root.innerHTML=`<div class="kh fill">
    <div class="kh-top">
      <button class="kh-packbtn" id="khPack" type="button" aria-label="Päckchen öffnen"><span class="kh-pkic">${ART.icon('kh_pack')}</span><span class="kh-badge" id="khBadge"></span><b class="hand">Päckchen</b></button>
      <div class="kh-prog card" id="khProg"></div>
      <button class="ibtn big kh-bonus" id="khBonus" type="button" aria-label="Bonus-Spiel">${ART.icon('puzzle')}</button>
      <button class="ibtn big" id="khInfo" type="button" aria-label="Woher kommen Päckchen?">${ART.icon('kh_flasche')}</button>
    </div>
    <div class="kh-eras" id="khEras"></div>
    <div class="kh-book card" id="khBook"><div class="kh-phead" id="khHead"></div><div class="kh-grid" id="khGrid"></div></div>
    <div class="kh-nav"><button class="ibtn big" id="khPrev" type="button" aria-label="Seite zurück">${ART.icon('pfeil_l')}</button><div class="kh-dots" id="khDots"></div><button class="ibtn big" id="khNext" type="button" aria-label="Seite weiter">${ART.icon('pfeil_r')}</button></div>
  </div>`;
  root.querySelector('#khPack').onclick=()=>{ if(GK.packsLeft()>0) openPack(); else { DW.sfx('no'); info(); } };
  root.querySelector('#khBonus').onclick=()=>{ if(bonusDone){ DW.sfx('tap'); DW.say('Das Bonus-Spiel hast du heute schon geschafft. Komm später wieder!'); return; } DW.sfx('pop'); bonusGame(); };
  root.querySelector('#khInfo').onclick=()=>{ DW.sfx('pop'); info(); };
  root.querySelector('#khPrev').onclick=()=>turn(-1);
  root.querySelector('#khNext').onclick=()=>turn(1);
  // Wischen zum Umblättern
  const book=root.querySelector('#khBook'); let sx=null;
  let sid=null;   // Wischen zählt nur für den Finger, der angefangen hat (zwei Finger blätterten sonst zufällig)
  GK.listen(book,'pointerdown',e=>{ if(sx!=null&&e.pointerType==='touch'&&e.pointerId!==sid) return; sx=e.clientX; sid=e.pointerId; });
  GK.listen(book,'pointerup',e=>{ if(sx==null||e.pointerId!==sid) return; const dx=e.clientX-sx; sx=null; sid=null; if(Math.abs(dx)>70) turn(dx<0?1:-1); });
  GK.listen(book,'pointercancel',e=>{ if(e.pointerId===sid){ sx=null; sid=null; } });
  GK.listen(window,'resize',()=>{ clearTimeout(resizeT); resizeT=setTimeout(()=>{ if(root&&root.querySelector('#khGrid')) render(true); },150); });
  const c=C(); const firstNo=DATA.CARDS.find(x=>has(x.no)); pageIdx=0; render(); if(firstNo) goToCard(firstNo.no,true);
  const n=GK.packsLeft();
  if(!c.opened) DW.say('Willkommen im Kartenhaus! Hier ist dein Sammelalbum für 104 Dino-Karten. Tippe auf das Päckchen und reiß es auf!');
  else if(n) DW.say(n===1?'Du hast ein neues Kartenpäckchen! Tippe darauf.':`Du hast ${n} neue Kartenpäckchen! Tippe darauf.`);
  else DW.say('Dein Sammelalbum! Neue Päckchen bekommst du für Sterne aus allen Spielen. Für acht Sterne gibt es ein Päckchen.');
  idleAlbum();
}
function idleAlbum(){ GK.idle.set(()=>{ const b=root&&root.querySelector(GK.packsLeft()>0?'#khPack':bonusDone?'.kh-slot.own':'#khBonus'); GK.pulse(b); },
  ()=>DW.say(GK.packsLeft()>0?'Tippe auf das Päckchen!':bonusDone?'Tippe auf eine Karte, dann siehst du sie groß.':'Spiel das Bonus-Spiel mit dem Puzzle-Knopf. Dann bekommst du ein Päckchen!')); }

function calcGrid(){
  const g=root.querySelector('#khGrid'); const W=g.clientWidth, H=g.clientHeight, gap=W<500||H<260?8:12, minW=W<500||H<260?64:92;
  let best={cap:1,w:Math.min(W,H*.555),cols:1,rows:1,sc:0};
  for(let cols=2;cols<=12;cols++) for(let rows=1;rows<=8;rows++){
    const w=Math.floor(Math.min(180,(W-(cols-1)*gap)/cols,((H-(rows-1)*gap)/rows)*.555)); if(w<minW) continue;
    const cap=cols*rows, sc=cap*w*w; if(sc>best.sc*1.02) best={cap,w,cols,rows,sc};
  }
  best.gap=gap; return best;
}
function buildPages(cap){ pages=[]; ERAS().forEach(e=>{ const list=DATA.CARDS.filter(c=>eraOf(c).id===e.id);
  for(let i=0;i<list.length;i+=cap) pages.push({era:e,cards:list.slice(i,i+cap),part:Math.floor(i/cap),parts:Math.ceil(list.length/cap)}); }); }
function render(keep,target){
  const firstNo=target||(keep&&pages[pageIdx]?pages[pageIdx].cards[0].no:null);
  const L=calcGrid(); buildPages(L.cap);
  if(firstNo) pageIdx=Math.max(0,pages.findIndex(p=>p.cards.some(c=>c.no===firstNo)));
  pageIdx=DW.clamp(pageIdx,0,pages.length-1);
  const pg=pages[pageIdx], e=pg.era, g=root.querySelector('#khGrid');
  g.style.gridTemplateColumns=`repeat(${Math.min(L.cols,pg.cards.length)},${L.w}px)`; g.style.gap=L.gap+'px'; g.style.setProperty('--cw',L.w+'px');
  g.innerHTML=pg.cards.map(c=>slotHTML(c)).join('');
  DW.$$('.kh-slot',g).forEach(b=>b.onclick=()=>{ const c=cardByNo(+b.dataset.no); if(has(c.no)){ DW.sfx('pop'); view(c.no,pg.cards.filter(x=>has(x.no)).map(x=>x.no)); } else { DW.sfx('tap'); GK.pulse(b); DW.say(`Karte Nummer ${c.no} fehlt noch. Öffne Päckchen, dann findest du sie vielleicht!`); } });
  root.querySelector('#khHead').innerHTML=`<span class="kh-eradot" style="background:${e.col}"></span><b class="hand">${e.n}</b><small>vor ${fmtMio(e.a)} bis ${fmtMio(e.b)} Mio. Jahren${pg.parts>1?` · Seite ${pg.part+1} von ${pg.parts}`:''}</small>`;
  root.querySelector('#khBook').style.setProperty('--era',e.col);
  // Zeitalter-Reiter
  root.querySelector('#khEras').innerHTML=ERAS().map(x=>{ const list=DATA.CARDS.filter(c=>eraOf(c).id===x.id), n=list.filter(c=>has(c.no)).length;
    return `<button class="kh-era ${x.id===e.id?'on':''}" data-e="${x.id}" style="--ec:${x.col}" type="button">${DW.iconImg(x.icon)}<b>${x.n}</b><small>${n}/${list.length}</small></button>`; }).join('');
  DW.$$('.kh-era',root).forEach(b=>b.onclick=()=>{ DW.sfx('tap'); pageIdx=pages.findIndex(p=>p.era.id===b.dataset.e); render(); const er=DATA.eraById(b.dataset.e); DW.say(`${er.n}. ${er.short}.`); });
  const on=root.querySelector('.kh-era.on'); if(on&&on.scrollIntoView) on.scrollIntoView({block:'nearest',inline:'center'});
  // Seitenpunkte
  const start=pages.findIndex(p=>p.era.id===e.id);
  root.querySelector('#khDots').innerHTML=`<span class="kh-pg hand">${pageIdx+1} / ${pages.length}</span>`+(pg.parts>1?`<span class="kh-pgd">${[...Array(pg.parts)].map((_,i)=>`<i class="${start+i===pageIdx?'on':''}"></i>`).join('')}</span>`:'');
  top();
}
const fmtMio=v=>String(v).replace('.',',');
function slotHTML(c){
  const e=eraOf(c);
  if(has(c.no)){ const n=C().have[c.no];
    return `<button class="kh-slot own ${isRare(c)?'rare':''} ${fresh.has(c.no)?'fresh':''}" data-no="${c.no}" type="button" aria-label="${esc(c.n)}"><img src="${c.img}" alt="" loading="lazy" decoding="async" draggable="false">${n>1?`<span class="kh-cnt">×${n}</span>`:''}</button>`; }
  const sil=c.id?DW.animalImg(c.id,{shadow:false},'kh-sil'):`<span class="kh-q hand">?</span>`;
  return `<button class="kh-slot empty" data-no="${c.no}" style="--ec:${e.col}" type="button" aria-label="Karte ${c.no} fehlt">${sil}<b class="hand">${c.no}</b></button>`;
}
function top(){
  const n=GK.packsLeft(), have=ownedN(), b=root.querySelector('#khBadge'), pb=root.querySelector('#khPack');
  b.textContent=n; b.hidden=!n; pb.classList.toggle('has',n>0); pb.classList.toggle('gk-glow',n>0);
  root.querySelector('#khProg').innerHTML=`<span class="kh-alb">${ART.icon('kh_album')}</span><div class="kh-pgt"><b class="hand">${have} / ${DATA.CARDS.length}</b><div class="kh-bar"><i style="width:${have/DATA.CARDS.length*100}%"></i></div></div>`;
  root.querySelector('#khBonus').classList.toggle('done',bonusDone);
}
function turn(d){ const n=DW.clamp(pageIdx+d,0,pages.length-1); if(n===pageIdx){ DW.sfx('bump'); return; } pageIdx=n; DW.sfx('whoosh');
  const g=root.querySelector('#khBook'); g.classList.remove('flipL','flipR'); void g.offsetWidth; g.classList.add(d>0?'flipR':'flipL'); render(); }
function goToCard(no){ render(false,no); }

/* ---------- Karte groß ansehen (mit Rückseite) ---------- */
function view(no,list){
  viewList=list&&list.length?list:[no]; let i=Math.max(0,viewList.indexOf(no));
  const ov=DW.h(`<div class="kh-view fill"><div class="kh-vstage"></div>
    <button class="ibtn big kh-vx" type="button" aria-label="Schließen">${ART.icon('kreuz')}</button>
    <button class="ibtn big kh-vp" type="button" aria-label="Vorherige Karte">${ART.icon('pfeil_l')}</button>
    <button class="ibtn big kh-vn" type="button" aria-label="Nächste Karte">${ART.icon('pfeil_r')}</button>
    <div class="kh-vbtns"></div></div>`);
  root.appendChild(ov); GK.idle.stop();
  const close=()=>{ DW.sfx('tap'); DW.hush(); ov.remove(); idleAlbum(); };
  ov.querySelector('.kh-vx').onclick=close;
  ov.addEventListener('click',e=>{ if(e.target===ov||e.target.classList.contains('kh-vstage')) close(); });
  ov.querySelector('.kh-vp').onclick=()=>{ i=(i+viewList.length-1)%viewList.length; DW.sfx('whoosh'); show(false); };
  ov.querySelector('.kh-vn').onclick=()=>{ i=(i+1)%viewList.length; DW.sfx('whoosh'); show(false); };
  ov.querySelector('.kh-vp').hidden=ov.querySelector('.kh-vn').hidden=viewList.length<2;
  function show(back){
    const c=cardByNo(viewList[i]), e=eraOf(c), f=FOOD[c.food]||FOOD.pflanzen;
    const W=ov.clientWidth, H=ov.clientHeight, side=W>=720;
    let h=Math.min(H-(side?40:104), 860), w=h*.555; if(w>W-(side?260:40)){ w=W-(side?260:40); h=w/.555; }
    const st=ov.querySelector('.kh-vstage'); st.style.setProperty('--w',w+'px'); st.style.setProperty('--h',h+'px'); st.style.setProperty('--u',(w/100)+'px');
    ov.classList.toggle('side',side);
    st.innerHTML=`<div class="kh-vcard ${isRare(c)?'rare':''}"><div class="kh-flip ${back?'flipped':''}">
      <div class="kh-face kh-front"><img src="${c.img}" alt="${esc(c.n)}" draggable="false"></div>
      <div class="kh-face kh-back" style="--ec:${e.col}">
        <div class="kh-bhead"><span class="kh-no">Nr. ${c.no}</span><b class="hand">${esc(c.n)}</b></div>
        <div class="kh-brow kh-chip">${DW.iconImg(e.icon)}<span><b>${e.n}</b><small>vor ${fmtMio(e.a)}–${fmtMio(e.b)} Mio. Jahren</small></span></div>
        <div class="kh-brow">${f.ic.map(x=>DW.iconImg(x,'kh-fic')).join('')}<span>${f.t}</span></div>
        ${sizeHTML(c,w)}
        <p class="kh-fact">${esc(c.fact)}</p>
        ${isRare(c)?`<span class="kh-rare hand">✦ Glitzerkarte ✦</span>`:''}
      </div></div></div>`;
    ov.querySelector('.kh-vbtns').innerHTML=`<button class="btn big sun" id="khTurn" type="button">${ART.icon('pfeil_r',36)}<span class="kh-lbl">Umdrehen</span></button>
      <button class="ibtn big" id="khSay" type="button" aria-label="Vorlesen">${ART.icon('lautsprecher')}</button>
      ${c.id?`<button class="btn big ghost" id="khSteck" type="button">${DW.iconImg('buch','kh-bi')}<span class="kh-lbl">Steckbrief</span></button>`:''}
      ${C().have[c.no]>1?`<span class="pill">doppelt ×${C().have[c.no]}</span>`:''}`;
    const flip=ov.querySelector('.kh-flip');
    const say=()=>DW.say(`${c.n}. ${c.fact} ${sizeSay(c)}`);
    ov.querySelector('#khTurn').onclick=()=>{ flip.classList.toggle('flipped'); DW.sfx('whoosh'); if(flip.classList.contains('flipped')){ sparkle(flip,14); say(); } else DW.say(c.n); };
    flip.onclick=()=>ov.querySelector('#khTurn').click();
    ov.querySelector('#khSay').onclick=say;
    const sb=ov.querySelector('#khSteck'); if(sb) sb.onclick=()=>{ DW.sfx('pop'); DW.animalCard(c.id); };
    if(back) say(); else DW.say(`${c.n}. Tippe auf die Karte, dann dreht sie sich um!`);
  }
  show(false);
}

/* ---------- Glitzer ---------- */
function sparkle(el,n=18,host){
  host=host||root; if(!host||!el) return; const r=el.getBoundingClientRect(), h=host.getBoundingClientRect();
  const cx=r.left-h.left+r.width/2, cy=r.top-h.top+r.height/2;
  for(let k=0;k<n;k++){ const s=document.createElement('span'); s.className='kh-spark'; const a=Math.random()*Math.PI*2, d=r.width*.45+Math.random()*r.width*.5;
    s.style.left=cx+'px'; s.style.top=cy+'px'; s.style.setProperty('--dx',Math.cos(a)*d+'px'); s.style.setProperty('--dy',Math.sin(a)*d+'px');
    s.style.setProperty('--s',(.6+Math.random()*.9).toFixed(2)); s.style.background=DW.pick(['#f0c35a','#fff3c4','#e9a03f','#ffffff','#b58cbd']);
    host.appendChild(s); setTimeout(()=>s.remove(),1000); }
}

/* ---------- Päckchen öffnen ---------- */
function draw3(){ const have=C().have, out=[];
  for(let i=0;i<PER_PACK;i++){ const pool=DATA.CARDS.filter(c=>!out.includes(c)), nw=pool.filter(c=>!have[c.no]);
    out.push(DW.pick(nw.length&&Math.random()<NEW_BIAS?nw:pool)); }
  return out; }
function openPack(){
  GK.idle.stop(); DW.sfx('pop');
  const hero=DW.pick(['trex','triceratops','spinosaurus','stegosaurus','brachiosaurus','parasaurolophus','ankylosaurus']);
  const ov=DW.h(`<div class="kh-open fill"><div class="kh-rays"></div>
    <button class="kh-pk" type="button" aria-label="Päckchen aufreißen">
      <span class="kh-pktop"><svg viewBox="0 0 200 44" preserveAspectRatio="none"><path d="M0 44V10l10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10v34z" fill="#c8553d" stroke="${INK}" stroke-opacity=".6" stroke-width="2"/><path d="M6 36h188" stroke="#f7f0e1" stroke-width="3" stroke-dasharray="6 6"/></svg></span>
      <span class="kh-pkbody"><span class="kh-pkshine"></span><span class="kh-pkdino">${DW.animalImg(hero,{mood:'happy',shadow:false})}</span><b class="hand">Dino-Karten</b><small class="hand">${PER_PACK} Karten</small></span>
    </button>
    <div class="kh-otxt hand">Tippe zum Aufreißen!</div>
    <div class="kh-ocards"></div><div class="kh-obtns"></div></div>`);
  root.appendChild(ov);
  const pk=ov.querySelector('.kh-pk');
  DW.say('Ein Kartenpäckchen! Tippe darauf und reiß es auf!');
  GK.idle.set(()=>GK.pulse(pk),()=>DW.say('Tippe auf das Päckchen!'));
  let torn=false;
  pk.onclick=()=>{ if(torn) return; torn=true; GK.idle.stop();
    // Karten ziehen & sofort speichern
    const c=C(), got=draw3(), info=got.map(x=>{ const nw=!has(x.no); c.have[x.no]=(c.have[x.no]||0)+1; return {c:x,nw}; });
    c.opened++; DW.save();
    if(c.opened===1) GK.after(2200,()=>DW.addSticker('karten'));
    pk.classList.add('tear'); DW.sfx('whoosh'); GK.after(160,()=>DW.sfx('pop')); ov.querySelector('.kh-otxt').textContent='';
    GK.after(650,()=>{ pk.classList.add('gone'); dealCards(ov,info); });
  };
}
function dealCards(ov,info){
  const box=ov.querySelector('.kh-ocards'); const W=ov.clientWidth, H=ov.clientHeight;
  const w=Math.min(220,(W-48)/3,(H-200)*.555); box.style.setProperty('--w',w+'px'); box.style.setProperty('--h',(w/.555)+'px');
  box.innerHTML=info.map((o,k)=>`<button class="kh-oc ${isRare(o.c)?'rare':''}" data-k="${k}" style="--k:${k-1}" type="button" aria-label="Karte umdrehen">
      <span class="kh-oflip"><span class="kh-oface kh-cback"><span class="kh-cbemb">${DW.animalImg('trex',{shadow:false})}</span><b class="hand">Dino-Inselwelt</b></span>
      <span class="kh-oface kh-ofront"><img src="${o.c.img}" alt="${esc(o.c.n)}" draggable="false"></span></span>
      <span class="kh-otag ${o.nw?'new':'dup'} hand">${o.nw?'NEU!':'doppelt'}</span></button>`).join('');
  const cards=DW.$$('.kh-oc',box);
  cards.forEach((el,k)=>GK.after(80+k*170,()=>{ el.classList.add('in'); DW.sfx('whoosh'); }));
  let open=0;
  GK.after(900,()=>{ DW.say('Drei Karten! Tippe jede Karte an, dann dreht sie sich um.'); GK.idle.set(()=>GK.pulse(box.querySelector('.kh-oc:not(.rev)')),()=>DW.say('Tippe auf eine Karte!')); });
  cards.forEach(el=>el.onclick=()=>{ const o=info[+el.dataset.k];
    if(el.classList.contains('rev')){ DW.sfx('pop'); view(o.c.no,info.map(x=>x.c.no)); return; }
    el.classList.add('rev'); open++; GK.idle.poke();
    DW.sfx(o.nw?'magic':'star'); GK.after(260,()=>sparkle(el,isRare(o.c)?30:16));
    if(isRare(o.c)) GK.after(500,()=>sparkle(el,20));
    DW.say(o.nw?`${isRare(o.c)?'Eine Glitzerkarte! ':'Neu: '}${o.c.n}!`:`${o.c.n}. Die hast du schon. Doppelt ist auch schön!`);
    if(open===info.length) GK.after(1300,()=>done());
  });
  function done(){
    GK.idle.stop(); const nNew=info.filter(o=>o.nw).length;
    ov.querySelector('.kh-obtns').innerHTML=`<button class="btn big go" id="khIn" type="button">${ART.icon('kh_album',40)}Ins Album kleben</button>`;
    const b=ov.querySelector('#khIn'); b.classList.add('gk-glow');
    const say=nNew?`Toll! ${nNew===1?'Eine neue Karte':nNew+' neue Karten'} für dein Album.`:'Lauter Karten, die du schon hast. Die tauschst du einfach im Kopf!';
    DW.say(say+' Tippe auf eine Karte, dann siehst du sie groß. Oder kleb sie ins Album!');
    GK.idle.set(()=>GK.pulse(b),()=>DW.say('Tippe auf: Ins Album kleben!'));
    b.onclick=()=>{ GK.idle.stop(); DW.sfx('whoosh'); cards.forEach(el=>el.classList.add('fly'));
      info.forEach(o=>{ if(o.nw) fresh.add(o.c.no); });
      GK.after(600,()=>{ ov.remove(); const first=info.find(o=>o.nw)||info[0]; goToCard(first.c.no); DW.sfx('clink');
        const have=ownedN();
        if(have>=10&&!DW.state.stickers['karten-10']) GK.after(500,()=>{ DW.addSticker('karten-10'); DW.confetti(60); DW.say('Wow, schon zehn verschiedene Karten! Du bekommst den Sticker Kartensammler.'); });
        else if(have===DATA.CARDS.length){ DW.confetti(120); DW.say('Unglaublich! Du hast alle 104 Karten gesammelt!'); }
        else { const n=GK.packsLeft(); DW.say(n?`Du hast noch ${n===1?'ein Päckchen':n+' Päckchen'}!`:`Jetzt hast du ${have} von 104 Karten. Für neue Päckchen sammelst du Sterne in allen Spielen.`); }
        idleAlbum(); });
    };
  }
}

/* ---------- Woher kommen Päckchen? ---------- */
function info(){
  const st=DW.totalStars(), rest=8-(st%8), n=GK.packsLeft();
  const pk=ART.icon('kh_pack',64);
  const m=DW.modal(`<h2>Woher kommen Päckchen?</h2>
    <div class="kh-info">
      <div class="kh-irow"><span class="kh-istars">${[...Array(8)].map((_,i)=>`<i class="${i<st%8?'on':''}">${ART.icon('stern',30)}</i>`).join('')}</span><span class="kh-arrow">→</span>${pk}<p>Für <b>8 Sterne</b> aus allen Spielen gibt es ein Päckchen. Noch <b>${rest}</b> ${rest===1?'Stern':'Sterne'}!</p></div>
      <div class="kh-irow">${ART.icon('kh_flasche',64)}<span class="kh-arrow">→</span>${pk}<p>Findest du auf dem Meer eine <b>Flaschenpost</b>? Da steckt ein Päckchen drin!</p></div>
      <div class="kh-irow">${ART.icon('puzzle',64)}<span class="kh-arrow">→</span>${pk}<p>Das <b>Bonus-Spiel</b> hier im Kartenhaus schenkt dir einmal pro Besuch ein Päckchen.</p></div>
    </div>
    <p class="hand" style="font-size:24px;text-align:center;margin:8px 0 0">${n?`Du hast jetzt ${n} ${n===1?'Päckchen':'Päckchen'} zum Öffnen!`:'Gerade ist kein Päckchen da.'}</p>`);
  DW.say(`Päckchen bekommst du so: Für acht Sterne aus allen Spielen gibt es ein Päckchen. Dir fehlen noch ${rest===1?'ein Stern':rest+' Sterne'}. Auf dem Meer kannst du Flaschenpost finden. Und das Bonus-Spiel hier schenkt dir einmal pro Besuch ein Päckchen.`);
  return m;
}

/* ---------- Bonus-Spiel: Finde die passende Karte ---------- */
function bonusGame(){
  GK.idle.stop();
  const pool=DATA.CARDS.filter(c=>c.id&&ART.has((DATA.animal(c.id)||{}).art||c.id));
  const plan=c=>{ const a=DATA.animal(c.id); const sp=ART.SPECIES[ART.resolve(a.art||a.id)]||{}; return sp.plan||a.id; };
  const targets=GK.sample(pool,BONUS_ROUNDS); let round=0, miss=0;
  const ov=DW.h(`<div class="kh-game fill"><button class="ibtn big kh-vx" type="button" aria-label="Schließen">${ART.icon('kreuz')}</button><div class="kh-gin"></div></div>`);
  root.appendChild(ov);
  ov.querySelector('.kh-vx').onclick=()=>{ DW.sfx('tap'); GK.idle.stop(); ov.remove(); idleAlbum(); };
  function next(){
    if(!ov.isConnected||!root) return;   // Spiel wurde geschlossen
    if(round>=targets.length) return win();
    const t=targets[round]; const others=DW.shuffle(pool.filter(c=>c!==t&&plan(c)!==plan(t)));
    const opts=[t]; others.forEach(c=>{ if(opts.length<3&&!opts.some(o=>plan(o)===plan(c))) opts.push(c); });
    const ch=DW.shuffle(opts);
    ov.querySelector('.kh-gin').innerHTML=`${GK.progress(round,targets.length)}
      <div class="kh-gq"><div class="kh-gdraw card" data-t="${t.no}">${DW.animalImg(t.id,{mood:'happy'})}</div><p class="hand">Welche Karte zeigt diesen Dino?</p></div>
      <div class="kh-gch">${ch.map(c=>`<button class="kh-gc" data-no="${c.no}" type="button"><img src="${c.img}" alt="" draggable="false"></button>`).join('')}</div>`;
    DW.say(round===0?'Bonus-Spiel! Schau dir die Zeichnung an. Welche Karte zeigt denselben Dino? Tippe sie an!':'Und welche Karte passt zu diesem Dino?');
    const right=ov.querySelector(`.kh-gc[data-no="${t.no}"]`);
    GK.idle.set(()=>GK.pulse(ov.querySelector('.kh-gdraw')),()=>DW.say('Schau genau: Hat er Hörner, einen langen Hals oder Flügel? Welche Karte passt?'));
    DW.$$('.kh-gc',ov).forEach(b=>b.onclick=()=>{
      if(b===right){ GK.idle.stop(); GK.ok(b); sparkle(b,14); DW.say(`Ja! Das ist ${t.n}.`); DW.$$('.kh-gc',ov).forEach(x=>x.onclick=null); round++; GK.after(1600,next); }
      else { miss++; b.classList.add('out'); GK.no(b,'Hm, der sieht anders aus. Schau noch mal genau hin!'); if(miss>2) GK.pulse(right); }
    });
  }
  function win(){
    bonusDone=true; const c=C(); c.bonus=(c.bonus||0)+1; DW.save();
    DW.sfx('win'); DW.confetti(60);
    ov.querySelector('.kh-gin').innerHTML=`<div class="kh-gwin card pop"><div class="kh-gpk">${ART.icon('kh_pack')}</div><h2 class="hand">Bonus-Päckchen!</h2>
      <button class="btn big go" id="khGo" type="button">${ART.icon('pfeil_r',36)}Gleich öffnen</button></div>`;
    DW.say('Super! Du hast alle Karten gefunden. Dafür bekommst du ein Bonus-Päckchen!');
    ov.querySelector('#khGo').onclick=()=>{ ov.remove(); top(); openPack(); };
    GK.idle.set(()=>GK.pulse(ov.querySelector('#khGo')),null);
  }
  next();
}

function unmount(){ GK.idle.stop(); clearTimeout(resizeT); root=null; }
if(window.DW_DEBUG) window.__kartenGive=n=>{ const c=C(); c.bonus=(c.bonus||0)+(n||1); DW.save(); if(root&&root.querySelector('#khGrid')) top(); };
DW.stations[ID]={title:'Kartenhaus',mount,unmount};
})();
