/* =====================================================================
   DINO-INSELWELT · Station Dino-Bildquiz (GAME 25)
   Mit den 104 gemalten Sammelkarten: „Wo ist der Stegosaurus?“
   Leicht: 2 Karten · Mittel: 3–4 Karten + „Wer versteckt sich?“ (Kärtchen
   wegtippen, Zeichnung wählen) · Schwer: 4 ähnliche Tiere, Lupen-Ausschnitt.
   Der Name auf der Karte ist abgeschnitten – Kinder lösen nur über Bild + Ohr.
   ===================================================================== */
(function(){
"use strict";
const ID='bildquiz';
let root, lv=1, R=null;

/* ---------- Spieldaten: Tiergruppen (für „ähnliche“ Antworten) ---------- */
const GROUPS={
  raub:['Albertosaurus','Tyrannosaurus','Carnotaurus','Concavenator','Giganotosaurus','Mapusaurus','Nanotyrannus','Nanuqsaurus','Rugops','Proceratosaurus','Eustreptospondylus','Dilophosaurus'],
  segel:['Spinosaurus','Oxalaia','Dimetrodon','Amargasaurus'],
  raptor:['Microraptor','Troodon','Dromaeosaurus','Sinornithosaurus','Utahraptor','Velociraptor','Deinonychus','Compsognathus','Procompsognathus','Ozraptor','Scansoriopteryx','Archaeopteryx','Eoraptor','Incisivosaurus'],
  strauss:['Gallimimus','Pelecanimimus','Deinocheirus','Gigantoraptor','Therizinosaurus','Suzhousaurus','Titanis'],
  langhals:['Dreadnoughtus','Massospondylus','Amygdalodon','Brachiosaurus','Bellusaurus','Diplodocus','Europasaurus'],
  horn:['Aquilops','Diabloceratops','Triceratops','Kosmoceratops','Torosaurus','Psittacosaurus','Styracosaurus','Yinlong'],
  panzer:['Euoplocephalus','Ankylosaurus','Animantarx','Zuul','Glyptodon'],
  stego:['Stegosaurus','Gigantspinosaurus','Kentrosaurus','Ankylosaurus'],
  ente:['Parasaurolophus','Corythosaurus','Edmontosaurus','Maiasaura','Tsintaosaurus','Ugrunaaluk','Rhinorex','Iguanodon','Hippodraco'],
  dickkopf:['Dracorex','Stygimoloch','Pachycephalosaurus','Pegomastax'],
  flug:['Quetzalcoatlus','Pterodaustro','Pterodactylus','Meganeura','Mazothairos','Microraptor'],
  meer:['Archelon','Plesiosaurier','Dunkleosteus','Edestus','Xenacanthus','Megalodon','Livyatan','Basilosaurus','Dorudon'],
  urzeit:['Arthropleura','Pulmonoscorpius','Eryops','Diplocaulus','Ichthyostega','Deinosuchus','Titanoboa'],
  saeuger:['Säbelzahnkatze','Mammut','Megacerops','Proconsul','Merychippus','Hyaenodon','Andrewsarchus','Megatherium','Paraceratherium','Glyptodon','Gomphotherium'],
};
const GROUP_OF={}; Object.entries(GROUPS).forEach(([g,l])=>l.forEach(n=>{ if(!GROUP_OF[n]) GROUP_OF[n]=g; }));
const groupsOf=c=>Object.keys(GROUPS).filter(g=>GROUPS[g].includes(c.n));
const ARTIKEL={Säbelzahnkatze:'die',Mammut:'das',Maiasaura:'die',Titanoboa:'die',Meganeura:'die',Arthropleura:'die',Megatherium:'das',Paraceratherium:'das',Gomphotherium:'das'};
const der=c=>(ARTIKEL[c.n]||'der')+' '+c.n;
const Der=c=>{const s=der(c);return s[0].toUpperCase()+s.slice(1);};
const grp=c=>GROUP_OF[c.n]||'andere';
const hasArt=c=>c.id&&DATA.animal(c.id)&&ART.has(DATA.animal(c.id).art);
/* Runden-Baupläne je Stufe: w = „Wo ist …?“, r = aufdecken, z = Lupe */
const PLAN={1:['w','w','w','w','w','w'],2:['w','w','r','w','r','w'],3:['w','z','r','w','z','r']};
const OPTS={1:{w:2,r:3,z:3},2:{w:3,r:3,z:3},3:{w:4,r:4,z:4}};

let rzT=null;
function mount(r){ root=r; intro(); GK.listen(window,'resize',()=>{ clearTimeout(rzT); rzT=setTimeout(relayout,150); }); }
function intro(){
  const c=DATA.CARDS.find(x=>x.n==='Stegosaurus')||DATA.CARDS[0];
  GK.intro(root,{id:ID,title:'Dino-Bildquiz',
    art:`<div class="bq-introcards">${[DATA.CARDS[5],c,DATA.CARDS[23]].map((k,i)=>`<div class="bq-mini" style="--r:${(i-1)*9}deg">${cardImg(k)}</div>`).join('')}</div>`,
    say:'Das Bildquiz! Ich sage dir einen Dino-Namen. Tippe auf das richtige Bild.',
    onStart:l=>{lv=l;start();}});
}
const cardImg=(c,cls='')=>`<img class="bq-img ${cls}" src="${c.img}" alt="" draggable="false">`;

/* ---------- Auswahl der Karten ---------- */
// Zuletzt gefragte Karten werden gemerkt, damit jede Runde neue Tiere bringt (alle 104 Karten kommen dran)
const recent=()=>{ const s=GK.st(ID); s.recent=s.recent||[]; return s.recent; };
function pickTarget(used,needArt){
  let pool=DATA.CARDS.filter(c=>!used.includes(c.n)&&(!needArt||hasArt(c)));
  if(lv===1){ const fam=pool.filter(c=>hasArt(c)); if(fam.length>5) pool=fam; }   // Leicht: Tiere mit Zeichnung (Tipp-Bild möglich)
  const rec=recent(), fresh=pool.filter(c=>!rec.includes(c.n)); if(fresh.length>=3) pool=fresh;
  const t=DW.pick(pool); rec.push(t.n); while(rec.length>60) rec.shift(); return t;
}
function distractors(t,n,needArt){
  const base=DATA.CARDS.filter(c=>c!==t&&(!needArt||hasArt(c)));
  let res=[];
  if(lv>=3){ const gs=groupsOf(t); res=GK.sample(base.filter(c=>groupsOf(c).some(g=>gs.includes(g))),n); }
  if(lv===1){ // deutlich verschieden: jede Karte aus einer anderen Gruppe
    const gs=new Set([grp(t)]); for(const c of DW.shuffle(base)){ if(res.length>=n) break; if(!gs.has(grp(c))){gs.add(grp(c));res.push(c);} }
  }
  if(lv===2){ const gs=new Set([grp(t)]); for(const c of DW.shuffle(base)){ if(res.length>=n) break; if(!gs.has(grp(c))||Math.random()<.35){gs.add(grp(c));res.push(c);} } }
  for(const c of DW.shuffle(base)){ if(res.length>=n) break; if(!res.includes(c)) res.push(c); }
  return res.slice(0,n);
}

function start(){
  const plan=PLAN[lv], used=[];
  const qs=plan.map((k,i)=>{ const n=(k==='w'&&lv===2&&i===3)?4:OPTS[lv][k];
    const t=pickTarget(used,k==='r'); used.push(t.n);
    return {k,t,opts:DW.shuffle([t,...distractors(t,n-1,k==='r')])}; });
  R={i:0,qs,right:0,miss:0}; DW.save();
  next();
}
function next(){
  GK.idle.stop();
  if(R.i>=R.qs.length) return end();
  const q=R.qs[R.i]; q.wrong=0; q.done=false; q.shown=false;
  root.innerHTML=`<div class="bq fill col">
    <div class="bq-top"><div class="bq-q"><button class="ibtn big bq-say" aria-label="Frage nochmal">${ART.icon('lautsprecher')}</button><span class="hand" id="bqQ"></span></div>${GK.progress(R.i,R.qs.length)}</div>
    <div class="bq-stage" id="bqStage"></div></div>`;
  root.querySelector('.bq-say').onclick=()=>{DW.sfx('tap');ask();};
  if(q.k==='w') layoutWo(q); else if(q.k==='r') layoutReveal(q); else layoutZoom(q);
  ask();
}
function qText(q){ return q.k==='w'?`Wo ist ${der(q.t)}?`:q.k==='r'?'Wer versteckt sich hier?':'Zu welchem Bild gehört das?'; }
function ask(){
  const q=R.qs[R.i]; const el=root.querySelector('#bqQ'); if(el) el.textContent=qText(q);
  const s=q.k==='w'?`Wo ist ${der(q.t)}? Tippe auf das Bild.`:q.k==='r'?'Wer versteckt sich hinter den Kärtchen? Tippe Kärtchen weg und rate!':'Schau durch die Lupe! Zu welchem Bild gehört das?';
  DW.say(s);
}

/* ---------- Kartengröße passend zum Platz ---------- */
const AR=336/(605*.82);
function fit(W,H,n,gap=14,maxH=620){
  let best={h:0,c:1};
  for(let c=1;c<=n;c++){ const r=Math.ceil(n/c); const h=Math.min((H-gap*(r-1))/r,((W-gap*(c-1))/c)/AR,maxH); if(h>=best.h-1) best={h,c}; }
  return best;
}
function cardBtn(c,i,h){ return `<button class="bq-card" data-i="${i}" style="height:${h}px;width:${Math.round(h*AR)}px" aria-label="Bild ${i+1}"><div class="bq-crop">${cardImg(c)}</div></button>`; }

/* ---------- Typ 1: Wo ist …? ---------- */
function layoutWo(q){
  const st=root.querySelector('#bqStage'), B=st.getBoundingClientRect();
  const f=fit(B.width-20,B.height-16,q.opts.length);
  st.innerHTML=`<div class="bq-grid" style="max-width:${Math.ceil(f.c*(f.h*AR+18))}px">${q.opts.map((c,i)=>cardBtn(c,i,Math.floor(f.h))).join('')}</div>`;
  bindCards(st,q);
  GK.idle.set(()=>{ if(q.wrong) GK.pulse(st.querySelector(`.bq-card[data-i="${q.opts.indexOf(q.t)}"]`)); else DW.$$('.bq-card',st).forEach(GK.pulse); },()=>ask());
}
function bindCards(st,q,onRight){
  DW.$$('.bq-card',st).forEach(b=>b.onclick=()=>{
    if(q.done) return; const c=q.opts[+b.dataset.i];
    if(c===q.t){ q.done=true; b.classList.add('bq-right'); GK.ok(b); (onRight||(()=>{}))(); answer(q,b); }
    else { q.wrong++; b.classList.add('bq-off'); GK.no(b); if(q.onWrong) q.onWrong();
      let s=`Hm, das ist ${der(c)}.`;
      if(q.k==='w') s+=` Wo ist ${der(q.t)}?`; else s+=' Die Lupe zeigt jetzt mehr. Schau nochmal!';
      DW.say(s);
      if(q.wrong>=2) GK.after(1400,()=>GK.pulse(st.querySelector(`.bq-card[data-i="${q.opts.indexOf(q.t)}"]`)));
      if(lv===1&&q.k==='w'&&hasArt(q.t)&&!st.querySelector('.bq-tip')) showTip(q); }
  });
}
/* Leicht: nach einem Fehlversuch zeigt eine kleine Zeichnung, wie der Dino aussieht */
function showTip(q){
  const top=root.querySelector('.bq-q'); if(!top) return;
  top.appendChild(DW.h(`<span class="bq-tip pop" title="Tipp">${GK.img(q.t.id)}</span>`));
}

/* ---------- Typ 2: Wer versteckt sich? (Kärtchen wegtippen) ---------- */
function layoutReveal(q){
  const st=root.querySelector('#bqStage'), B=st.getBoundingClientRect(), land=B.width>B.height*1.05;
  const n=q.opts.length;
  let ch, ow;
  if(land){ ch=Math.min(B.height-20,(B.width*.5)/AR,470); ow=Math.min(210,(B.width-ch*AR-60)/(n>3?2:1)-14, (B.height-20)/(n>3?2:n)*1.1); }
  else { const pc=(n>3&&B.width<620)?2:n, pr=Math.ceil(n/pc); ow=Math.min(170,(B.width-24)/pc-14); const oh=pr*(ow*.8+12);
    ch=Math.min(B.height-oh-24,(B.width-30)/AR,470); if(ch<B.height*.45){ ch=B.height*.45; ow=Math.min(ow,((B.height-ch-24)/pr-12)/.8); } }
  ch=Math.floor(ch); ow=Math.floor(Math.max(70,ow));
  const cols=5, rows=6;
  st.innerHTML=`<div class="bq-rev ${land?'land':''}">
    <div class="bq-hide" style="height:${ch}px;width:${Math.round(ch*AR)}px"><div class="bq-crop">${cardImg(q.t)}</div>
      <div class="bq-tiles" style="grid-template-columns:repeat(${cols},1fr)">${[...Array(cols*rows)].map((_,i)=>`<button class="bq-tile" data-t="${i}" style="--d:${(i*37)%11}" aria-label="Kärtchen"></button>`).join('')}</div></div>
    <div class="bq-opts ${n>3&&(land||B.width<620)?'two':''}">${q.opts.map((c,i)=>`<button class="bq-draw" data-i="${i}" style="width:${ow}px;height:${Math.round(ow*.8)}px" aria-label="Tier ${i+1}">${GK.img(c.id)}</button>`).join('')}</div></div>`;
  const tiles=DW.$$('.bq-tile',st);
  const pop=t=>{ if(!t||t.classList.contains('gone')) return; t.classList.add('gone'); DW.sfx('pop'); };
  tiles.forEach(t=>t.onclick=()=>{ pop(t); });
  // am Anfang zwei Kärtchen schon weg, damit man etwas sieht
  DW.shuffle(tiles).slice(0,lv===3?1:3).forEach(t=>t.classList.add('gone'));
  DW.$$('.bq-draw',st).forEach(b=>b.onclick=()=>{
    if(q.done) return; const c=q.opts[+b.dataset.i];
    if(c===q.t){ q.done=true; tiles.forEach((t,i)=>setTimeout(()=>t.classList.add('gone'),i*18)); b.classList.add('bq-right'); GK.ok(b); answer(q,b); }
    else { q.wrong++; b.classList.add('bq-off'); GK.no(b,`Hm, das ist ${der(c)}. Tippe noch mehr Kärtchen weg!`);
      DW.shuffle(tiles.filter(t=>!t.classList.contains('gone'))).slice(0,3).forEach(pop); }
  });
  // Leerlauf: ein Kärtchen fällt von allein
  GK.idle.set(()=>{ pop(DW.pick(tiles.filter(t=>!t.classList.contains('gone')))); GK.pulse(st.querySelector('.bq-tile:not(.gone)')); },()=>DW.say('Tippe auf die Kärtchen. Dann siehst du mehr!'));
}

/* ---------- Typ 3: Lupe – Ausschnitt einer Karte ---------- */
function layoutZoom(q){
  const st=root.querySelector('#bqStage'), B=st.getBoundingClientRect(), land=B.width>B.height;
  const n=q.opts.length;
  const L=Math.floor(Math.min(land?B.height*.72:B.width*.5, land?B.width*.3:B.height*.34, 320));
  const aW=land?B.width-L-110:B.width-20, aH=land?B.height-16:B.height-L-104;
  const f=fit(aW,aH,n,12,380);
  const px=DW.rand(.4,.6), py=DW.rand(.42,.6), Z=lv===3?2.4:2.1;
  st.innerHTML=`<div class="bq-zoom ${land?'land':''}">
    <div class="bq-lens" style="width:${L}px;height:${L}px"><div class="bq-lensimg" style="background-image:url('${q.t.img}');background-size:${Z*100}% auto;background-position:${px*100}% ${py*100}%"></div><div class="bq-lensglass"></div></div>
    <div class="bq-grid" style="max-width:${Math.ceil(f.c*(f.h*AR+16))}px">${q.opts.map((c,i)=>cardBtn(c,i,Math.floor(f.h))).join('')}</div></div>`;
  q.Z=Z; q.onWrong=()=>{ const li=st.querySelector('.bq-lensimg'); q.Z=Math.max(1.25,q.Z-.45); li.style.backgroundSize=(q.Z*100)+'% auto'; };
  bindCards(st,q,()=>{ const li=st.querySelector('.bq-lensimg'); li.style.backgroundSize='100% auto'; li.style.backgroundPosition='50% 0%'; });
  GK.idle.set(()=>GK.pulse(st.querySelector('.bq-lens')),()=>DW.say('Schau genau: Welche Farbe hat das Tier? Was siehst du in der Lupe?'));
}

/* ---------- Richtige Antwort: ganze Karte + Fakt ---------- */
function answer(q,btn){
  GK.idle.stop(); if(!q.wrong) R.right++; else R.miss++;
  if(q.t.id) DW.discover(q.t.id,true);
  q.praise=DW.pick(['Richtig!','Super!','Genau!','Toll erkannt!']);
  GK.after(700,()=>showAnswer(q,false));
}
function showAnswer(q,quiet){
  const st=root.querySelector('#bqStage'); if(!st||!R||R.qs[R.i]!==q) return;
  const old=st.querySelector('.bq-show'); if(old) old.remove();
  const B=st.getBoundingClientRect(), land=B.width>B.height;
  const h=Math.floor(Math.min(land?B.height-24:B.height*.52,(land?B.width*.4:B.width-40)*605/336,500));
  const ov=DW.h(`<div class="bq-show ${land?'land':''}"><div class="bq-full ${quiet?'':'pop'}" style="height:${h}px;width:${Math.round(h*336/605)}px">${cardImg(q.t)}</div>
    <div class="bq-info card"><h3 class="hand">${q.t.n}</h3><p>${q.t.fact}</p>
    <div class="row bq-infobtns"><button class="ibtn big bq-hear" aria-label="Nochmal hören">${ART.icon('lautsprecher')}</button>
    <button class="btn big go bq-next">${ART.icon('pfeil_r',36)}Weiter</button></div></div></div>`);
  st.appendChild(ov); q.shown=true;
  if(!quiet){ DW.sfx('magic'); DW.say(`${q.praise} Das ist ${der(q.t)}. ${q.t.fact}`); }
  ov.querySelector('.bq-hear').onclick=()=>DW.say(`${Der(q.t)}. ${q.t.fact}`);
  ov.querySelector('.bq-next').onclick=()=>{DW.sfx('tap');R.i++;next(); GK.shield(root,450); };   /* Doppeltipp auf „Weiter“ darf nicht gleich die nächste Frage beantworten */
  GK.idle.set(()=>GK.pulse(ov.querySelector('.bq-next')),null);
}
/* Drehen/Größenänderung: aktuelle Aufgabe neu anordnen (ohne neue Frage) */
function relayout(){
  if(!R||!root) return; const q=R.qs[R.i], st=root.querySelector('#bqStage'); if(!q||!st) return;
  /* Auflösung steht schon da: die Karten darunter haben noch die alte Größe und ragten nach dem Drehen über Titel und Rand → ausblenden */
  if(q.shown){ [...st.children].forEach(e=>{ if(!e.classList.contains('bq-show')) e.style.display='none'; }); return showAnswer(q,true); }
  if(q.done) return;
  if(q.k==='w') layoutWo(q); else if(q.k==='r') layoutReveal(q); else layoutZoom(q);
}
function end(){
  const n=R.qs.length, stars=R.right>=n-1?3:R.right>=n/2?2:1;
  const faces=R.qs.map(q=>q.t).slice(0,3);
  GK.finish(root,{id:ID,stars,
    art:`<div class="bq-introcards">${faces.map((k,i)=>`<div class="bq-mini" style="--r:${(i-1)*9}deg">${cardImg(k)}</div>`).join('')}</div>`,
    say:stars===3?'Wow! Du kennst die Dinos wirklich gut!':'Toll geraten! Beim nächsten Mal kennst du noch mehr.',
    again:()=>intro()});
}
/* Test-Hilfe: aktuelle Frage richtig beantworten */
if(window.DW_DEBUG) window.__bildquizWin=()=>{ if(!R) return; const q=R.qs[R.i]; if(!q) return; const st=root.querySelector('#bqStage'); const nx=root.querySelector('.bq-next'); if(nx){nx.click();return 'next';}
  const sel=q.k==='r'?'.bq-draw':'.bq-card'; const b=st.querySelector(`${sel}[data-i="${q.opts.indexOf(q.t)}"]`); b&&b.click(); return 'answer'; };
if(window.DW_DEBUG) window.__bildquizWrong=()=>{ const q=R.qs[R.i]; const st=root.querySelector('#bqStage'); const sel=q.k==='r'?'.bq-draw':'.bq-card'; const j=q.opts.findIndex(c=>c!==q.t); st.querySelector(`${sel}[data-i="${j}"]`).click(); };
DW.stations[ID]={title:'Dino-Bildquiz',mount,unmount(){R=null; clearTimeout(rzT);}};
})();
