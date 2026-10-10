/* =====================================================================
   DINO-INSELWELT · Station Mary-Anning-Klippe
   Kurze Bildergeschichte über Mary Anning (1799–1847), dann: Ebbe!
   Steine am Strand aufklopfen, Ammoniten, Belemniten und Knochen finden
   und aus den Knochen ein Ichthyosaurus-Skelett zusammensetzen.
   ===================================================================== */
(function(){
"use strict";
const ID='anning';
const INK='#3d3226', BONE='#efe2c4', BONED='#7a6248';

/* ---------- Belemnit als Fund (eigene Ergänzung) ---------- */
ART.ICONS.an_belemnit=`<path d="M14 50L44 14q8-6 10 2t-4 10L20 56q-6 2-6-6z" fill="#c98a4a" stroke="${INK}" stroke-width="1.6"/><path d="M20 50L48 18" stroke="#f0c88f" stroke-width="3" opacity=".8"/><path d="M40 20l8 8" stroke="#8a5a2e" stroke-width="1.5"/>`;
ART.ICONS.an_kiesel=`<ellipse cx="22" cy="42" rx="14" ry="10" fill="#a9a59a" stroke="${INK}" stroke-width="1.4"/><ellipse cx="42" cy="46" rx="12" ry="8" fill="#c2bdb0" stroke="${INK}" stroke-width="1.4"/><ellipse cx="34" cy="30" rx="10" ry="7" fill="#8f8b82" stroke="${INK}" stroke-width="1.4"/>`;
if(!DATA.find('belemnit')) DATA.FINDS.push({id:'belemnit',n:'Belemnit',icon:'an_belemnit',say:'Ein Belemnit! Das ist der harte Teil eines Urzeit-Tintenfischs. Man nennt ihn auch Donnerkeil.'});

/* ---------- Geschichte ---------- */
const STORY=[
 {pic:'portrait',say:'Das ist Mary Anning mit ihrem Hund Tray. Sie lebte vor über 200 Jahren in Lyme Regis, einem Ort am Meer in England.'},
 {pic:'kinder',say:'Schon als Kind suchte Mary mit ihrem Bruder Joseph Fossilien. Joseph fand einen riesigen Schädel. Mary grub danach das Skelett aus: einen Fischsaurier!'},
 {pic:'funde',say:'1823 fand Mary das erste ganze Skelett eines Plesiosauriers. Und 1828 fand sie einen Flugsaurier.'},
 {pic:'verkauf',say:'Mary verkaufte ihre Funde, damit ihre Familie genug Geld hatte. Die Forscher schrieben ihren Namen lange nicht dazu. Heute wissen wir: Mary Anning war eine große Forscherin!'},
];

/* ---------- Ichthyosaurus-Skelett (Koordinaten 400×160, Blick nach rechts) ---------- */
const vert=(pts,r0,r1)=>pts.map((p,i)=>{const r=r0+(r1-r0)*i/(pts.length-1||1);return `<ellipse cx="${p[0]}" cy="${p[1]}" rx="${r*.8}" ry="${r}" fill="${BONE}" stroke="${BONED}" stroke-width="1.4"/>`;}).join('');
const curve=(n,f)=>[...Array(n)].map((_,i)=>f(i/(n-1)));
const PARTS=[
 {k:'schaedel',n:'Schädel',box:[282,38,116,50],svg:`<path d="M286 60Q298 44 326 50L396 65Q398 69 392 71L328 80Q300 84 290 76Z" fill="${BONE}" stroke="${BONED}" stroke-width="2"/>
   <path d="M330 72L392 68" stroke="${BONED}" stroke-width="1.4"/>${[...Array(9)].map((_,i)=>`<path d="M${338+i*6} 70l1 3" stroke="${BONED}" stroke-width="1.2"/>`).join('')}
   <circle cx="312" cy="61" r="11" fill="#e6d6b2" stroke="${BONED}" stroke-width="2"/><circle cx="312" cy="61" r="7.5" fill="none" stroke="${BONED}" stroke-width="3" stroke-dasharray="3 1.6"/><circle cx="312" cy="61" r="3.5" fill="#5a4a38"/>`},
 {k:'wirbel',n:'Wirbelsäule mit Rippen',box:[112,54,178,62],svg:`${curve(9,u=>[150+u*120,78+u*6]).map(([x,y],i)=>`<path d="M${x} ${y}Q${x-10} ${y+20} ${x-3} ${y+34-Math.abs(i-4)*3}" stroke="${BONED}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M${x} ${y}Q${x-10} ${y+20} ${x-3} ${y+34-Math.abs(i-4)*3}" stroke="${BONE}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`).join('')}
   ${vert(curve(19,u=>[118+u*168,72-Math.sin(u*Math.PI)*6]),5,5.6)}`},
 {k:'schwanz',n:'Schwanz',box:[6,14,112,128],svg:`<path d="M116 70C82 66 58 48 40 18C48 52 52 70 54 82C46 104 32 124 12 140C46 128 82 102 116 78Z" fill="rgba(160,190,200,.35)" stroke="${BONED}" stroke-width="1.2" stroke-dasharray="4 3"/>
   ${vert(curve(14,u=>{const x=114-u*96;return [x,72+Math.pow(Math.max(0,u-.3)/.7,1.6)*62];}),5,2.2)}`},
 {k:'vflosse',n:'Vorderflosse',box:[222,84,52,62],svg:`<path d="M262 88Q270 118 244 144Q228 138 236 110Q240 94 262 88Z" fill="rgba(160,190,200,.35)" stroke="${BONED}" stroke-width="1.2"/>
   ${[[258,94],[250,96],[256,104],[248,106],[240,108],[252,114],[244,117],[248,124],[240,126],[244,133],[238,137]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.6" fill="${BONE}" stroke="${BONED}" stroke-width="1.2"/>`).join('')}`},
 {k:'hflosse',n:'Hinterflosse',box:[138,86,40,42],svg:`<path d="M170 90Q176 108 156 124Q146 118 152 104Q156 94 170 90Z" fill="rgba(160,190,200,.35)" stroke="${BONED}" stroke-width="1.2"/>
   ${[[166,95],[159,98],[163,105],[155,107],[158,114],[152,118]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="${BONE}" stroke="${BONED}" stroke-width="1.1"/>`).join('')}`},
];
const OUTLINE=`<path d="M40 74Q90 62 150 54L186 46Q198 18 212 12Q212 32 226 46Q272 46 300 50L398 66L300 84Q230 102 150 92Q100 86 40 80Z" fill="rgba(90,130,150,.13)" stroke="rgba(90,110,120,.35)" stroke-width="2" stroke-dasharray="6 5"/>
  <path d="M116 70C82 66 58 48 40 18C48 52 52 70 54 82C46 104 32 124 12 140C46 128 82 102 116 78Z" fill="rgba(90,130,150,.13)" stroke="rgba(90,110,120,.35)" stroke-width="2" stroke-dasharray="6 5"/>`;
const partSVG=(p,cls='')=>`<svg class="${cls}" viewBox="${p.box.join(' ')}" aria-hidden="true">${p.svg}</svg>`;
const NEED={1:['schaedel','wirbel','schwanz'],2:['schaedel','wirbel','schwanz','vflosse'],3:['schaedel','wirbel','schwanz','vflosse','hflosse']};
const LVL={1:{stones:8,hits:1,extra:3},2:{stones:10,hits:2,extra:4},3:{stones:12,hits:3,extra:4}};
// Was man am Strand von Lyme Regis wirklich findet (Jura): Ammoniten, Belemniten, Fisch-Fossilien, Muscheln
const BEACH=['ammonit','ammonit','belemnit','belemnit','fischfossil','muschel'];
const FIND_TXT={ammonit:'Ein Ammonit! Ein Tintenfisch mit Schneckenhaus.',belemnit:'Ein Belemnit! Der harte Teil eines Urzeit-Tintenfischs.',
  fischfossil:'Ein Fisch-Fossil! Im Stein sieht man jede einzelne Gräte.',muschel:'Eine versteinerte Muschel! Muscheln versteinern besonders gut.'};

/* ---------- Zustand ---------- */
let root, lv=1, G=null;
let rzT=null;
/* Rückmeldungs-Klassen vor jeder neuen Rückmeldung abräumen (sonst gewinnt in der CSS-Reihenfolge immer dieselbe) */
const fb=el=>{ if(el) el.classList.remove('gk-good','gk-bad','gk-hint'); return el; };
function mount(r){ root=r; intro(); GK.listen(window,'resize',()=>{ clearTimeout(rzT); rzT=setTimeout(layStones,120); }); }
function intro(){
  GK.intro(root,{id:ID, art:`<div class="sd-iart"><img src="assets/mary_anning.jpg" alt="Mary Anning" class="an-iport">${GK.icon('hammer')}${GK.img('ichthyosaurus')}</div>`, title:'Mary-Anning-Klippe',
    say:'Komm mit an den Strand von Mary Anning! Erst hörst du ihre Geschichte. Dann suchst du selbst Fossilien.',
    onStart:l=>{ lv=l; G={miss:0}; story(0); }});
}

/* ---------- Bildergeschichte ---------- */
function storyPic(k){
  if(k==='portrait') return `<img src="assets/mary_anning.jpg" alt="Mary Anning mit Hammer, Korb und Hund" class="an-photo">`;
  if(k==='kinder') return `<svg viewBox="0 0 300 200" class="an-scene" aria-hidden="true">${cliffSVG()}
    <g transform="translate(118 108)"><path d="M0 60L12 18h18l12 42z" fill="#6f8a5a" stroke="${INK}" stroke-width="1.6"/><circle cx="21" cy="10" r="10" fill="#f1c9a5" stroke="${INK}" stroke-width="1.4"/><path d="M11 8q10-14 20 0" fill="#b98a58"/><path d="M30 26l16 14" stroke="#f1c9a5" stroke-width="5" stroke-linecap="round"/></g>
    <g transform="translate(64 116)"><rect x="6" y="16" width="20" height="26" rx="4" fill="#8a6d4a" stroke="${INK}" stroke-width="1.5"/><path d="M8 42v12M24 42v12" stroke="#4a3b2a" stroke-width="5"/><circle cx="16" cy="8" r="9" fill="#f1c9a5" stroke="${INK}" stroke-width="1.4"/><path d="M7 6q9-12 18 0" fill="#6e4a30"/></g>
    <svg x="168" y="146" width="116" height="50" viewBox="282 38 116 50">${PARTS[0].svg}</svg></svg>`;
  if(k==='funde') return `<div class="an-duo">${GK.img('plesiosaurus')}${GK.img('ichthyosaurus')}</div>`;
  return `<div class="an-duo"><img src="assets/mary_anning.jpg" alt="" class="an-photo sm">${GK.icon('ammonit')}${GK.icon('an_belemnit')}</div>`;
}
function cliffSVG(){ return `<rect width="300" height="200" fill="#dbe7e6"/><path d="M0 40Q60 30 120 44T220 54 300 70V150H0z" fill="#8c8f8c"/>${[60,76,92,108,124].map((y,i)=>`<path d="M0 ${y}Q80 ${y-8} 160 ${y+4}T300 ${y+14+i*2}" stroke="${i%2?'#6f736f':'#a9aba3'}" stroke-width="${5-i*.5}" fill="none"/>`).join('')}
  <path d="M0 150Q100 140 200 150T300 148V200H0z" fill="#cfc2a2"/><path d="M200 160q50-8 100 0V200H190z" fill="#8fbccb"/>`; }
function story(i){
  if(i>=STORY.length) return beach();
  const s=STORY[i];
  root.innerHTML=`<div class="an-story fill"><div class="an-sbox card pop"><div class="an-pic">${storyPic(s.pic)}</div>
    <div class="an-stext"><p>${s.say}</p>${GK.progress(i,STORY.length)}
    <div class="row an-sbtns"><button class="btn big go" id="anNext" type="button">${ART.icon('pfeil_r',36)}Weiter</button>
      <button class="ibtn big" id="anSay" type="button" aria-label="Vorlesen">${ART.icon('lautsprecher')}</button>
      <button class="btn ghost" id="anSkip" type="button">Zum Strand</button></div></div></div></div>`;
  root.querySelector('#anNext').onclick=()=>{ DW.sfx('tap'); story(i+1); };
  root.querySelector('#anSkip').onclick=()=>{ DW.sfx('tap'); beach(); };
  root.querySelector('#anSay').onclick=()=>DW.say(s.say);
  DW.say(s.say);
  GK.idle.set(()=>GK.pulse(root.querySelector('#anNext')),null);
}

/* ---------- Strand bei Ebbe ---------- */
function stoneSVG(seed,stage){
  const r=n=>{const v=Math.sin(seed*12.9898+n*78.233)*43758.5453;return v-Math.floor(v);};
  const col=['#8e9594','#9c9a90','#7f8a8c','#a6a295'][Math.floor(r(1)*4)];
  const pts=[...Array(9)].map((_,i)=>{const a=i/9*Math.PI*2,rr=26+r(i+3)*6;return [50+Math.cos(a)*rr*1.3,40+Math.sin(a)*rr];});
  const d='M'+pts.map(p=>p.map(v=>v.toFixed(1)).join(' ')).join('L')+'Z';
  const cracks=['','M50 12L46 30L54 42L48 60','M50 12L46 30L54 42L48 60M46 30L30 26M54 42L74 46','M50 12L46 30L54 42L48 60M46 30L30 26M54 42L74 46M48 60L36 66M54 42L66 28'][Math.min(3,stage)];
  return `<svg viewBox="0 0 100 80" aria-hidden="true"><ellipse cx="50" cy="72" rx="36" ry="6" fill="rgba(60,50,30,.18)"/><path d="${d}" fill="${col}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M28 30q10-8 22-6" stroke="rgba(255,255,255,.4)" stroke-width="4" fill="none" stroke-linecap="round"/><path d="${cracks}" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`;
}
function beach(){
  GK.idle.stop();
  const L=LVL[lv], need=NEED[lv];
  let content=need.map(k=>({t:'bone',k})).concat(DW.shuffle(BEACH).slice(0,L.extra).map(f=>({t:'find',f})));
  while(content.length<L.stones) content.push({t:'leer'});
  content=DW.shuffle(content);
  G={...G,need,found:[],opened:0,L,content,phase:'beach'};
  root.innerHTML=`<div class="sd-stage an" id="anStage">
    <div class="an-sky"></div>
    <svg class="an-cliff" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H400V70Q340 60 300 80T200 86 100 76 0 90z" fill="#7d8583"/>
      ${[16,30,44,58,70].map((y,i)=>`<path d="M0 ${y}Q100 ${y-6} 200 ${y+3}T400 ${y-2}" stroke="${i%2?'#646c6b':'#9ca09b'}" stroke-width="${6-i*.6}" fill="none"/>`).join('')}
      <path d="M0 90Q100 76 200 86T400 70V120H0z" fill="#9aa09c" opacity=".6"/></svg>
    <div class="an-sand"><div class="sd-grain" style="background-image:url(${DW.paperURL})"></div></div>
    <div id="anStones"></div>
    <div class="an-sea" id="anSea"><svg viewBox="0 0 400 40" preserveAspectRatio="none"><path d="M0 10q25-10 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0V40H0z" fill="#8fbccb"/><path d="M0 12q25-8 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/></svg></div>
    <div class="sd-ask an-ask" id="anAsk"></div>
    <div class="an-hammer" id="anHammer">${ART.icon('hammer')}</div></div>`;
  const n=content.length, box=root.querySelector('#anStones');
  const order=DW.shuffle([...Array(n).keys()]);
  G.stones=content.map((c,i)=>{ const seed=i+Math.random()*9;
    const b=DW.h(`<button class="an-stone" type="button" aria-label="Stein">${stoneSVG(seed,0)}</button>`);
    const s={...c,b,hits:0,open:false,seed,cell:order[i],jx:DW.rand(-.12,.12),jy:DW.rand(-.1,.1)}; b.onclick=()=>hit(s); box.appendChild(b); return s; });
  layStones();
  updAsk();
  // Ebbe: das Wasser zieht sich zurück
  DW.sfx('whoosh');
  DW.say('Schau, Ebbe! Das Meer geht zurück. Jetzt klopfen wir die Steine auf. Tippe einen Stein an!');
  GK.after(60,()=>root.querySelector('#anSea').classList.add('low'));
  GK.idle.set(()=>{ const s=G.stones.find(s=>!s.open&&s.t==='bone'); if(s) GK.pulse(fb(s.b)); },()=>{ const s=G.stones.find(s=>!s.open&&s.t==='bone'); if(s){GK.pulse(fb(s.b));DW.say('Probier mal diesen Stein! Tippe ihn an.');} });
}
/* Steine im Raster verteilen – passt sich an Drehen/Größe an */
function layStones(){
  const st=root&&root.querySelector('#anStage'); if(!st||!G||!G.stones||G.phase!=='beach'&&G.phase!=='done') return;
  const W=st.clientWidth, H=st.clientHeight, land=W>H, n=G.stones.length;
  const cols=land?Math.ceil(n/2.4):3, rows=Math.ceil(n/cols);
  const top=land?.42:.36, bot=.88, cw=W/cols, ch=H*(bot-top)/rows, sz=Math.min(cw*.8,ch*1.1,150);
  G.stones.forEach(s=>{ const col=s.cell%cols, row=Math.floor(s.cell/cols);
    const x=DW.clamp((col+.5)*cw+s.jx*cw,sz*.55,W-sz*.55), y=H*top+(row+.5)*ch+s.jy*ch;
    Object.assign(s.b.style,{left:x+'px',top:y+'px',width:sz+'px',height:sz*.8+'px'}); });
}
function updAsk(){
  const a=root.querySelector('#anAsk'); if(!a) return;
  a.innerHTML=`<div class="pic">${GK.icon('knochen')}</div><div><div class="txt">Finde die Knochen!</div>${GK.progress(G.found.length,G.need.length)}</div>
    <div class="an-basket">${Object.entries(G.basket||{}).map(([f,n])=>`<span>${GK.icon(DATA.find(f).icon)}<b>${n}</b></span>`).join('')}</div>
    <button class="ibtn" type="button" aria-label="Nochmal hören">${ART.icon('lautsprecher')}</button>`;
  a.querySelector('.ibtn').onclick=()=>DW.say(`Tippe auf die Steine und klopf sie auf. Such ${G.need.length} Knochen vom Fischsaurier!`);
}
function hit(s){
  if(s.open||G.phase!=='beach') return;
  s.hits++; DW.sfx('dig');
  const hm=root.querySelector('#anHammer'), R=s.b.getBoundingClientRect(), S=root.querySelector('#anStage').getBoundingClientRect();
  hm.style.left=(R.left-S.left+R.width*.62)+'px'; hm.style.top=(R.top-S.top-R.height*.2)+'px'; hm.classList.remove('bang'); void hm.offsetWidth; hm.classList.add('bang');
  fb(s.b); void s.b.offsetWidth; s.b.classList.add('gk-bad');
  if(s.hits<G.L.hits){ s.b.innerHTML=stoneSVG(s.seed,s.hits); if(s.hits===1&&G.L.hits>1) DW.say('Klopf, klopf! Noch einmal!'); return; }
  s.open=true; G.opened++;
  GK.after(180,()=>reveal(s));
}
function reveal(s){
  s.b.classList.add('open'); DW.sfx('clink');
  let inner, txt;
  if(s.t==='bone'){ const p=PARTS.find(p=>p.k===s.k); inner=partSVG(p,'an-bone'); G.found.push(s.k); txt=`Ein Knochen! ${p.n} vom Fischsaurier.`; DW.addFind('knochen',true); }
  else if(s.t==='find'){ const f=DATA.find(s.f); inner=GK.icon(f.icon); G.basket=G.basket||{}; G.basket[s.f]=(G.basket[s.f]||0)+1; DW.addFind(s.f,true);
    txt=FIND_TXT[s.f]||f.say; }
  else { inner=GK.icon('an_kiesel'); txt=DW.pick(['Nur ein Kiesel. Versuch einen anderen Stein!','Hier ist nichts drin. Weiter suchen!']); }
  s.b.innerHTML=`<div class="an-open">${inner}</div>`;
  if(s.t!=='leer'){ GK.ok(fb(s.b)); DW.sfx('star'); }
  updAsk(); const said=DW.say(txt);
  /* nur EINMAL weiter (ein zweiter Stein kann fast gleichzeitig aufgehen) – und erst, wenn der Fund-Satz zu Ende ist */
  if(G.found.length>=G.need.length&&G.phase==='beach'){ G.phase='done'; GK.idle.stop();
    const g=G, t0=Date.now(); let told=false, built=false;
    const build=()=>{ if(built||G!==g||g.phase!=='done') return; built=true; skeleton(); };
    const tell=()=>{ if(told||G!==g||g.phase!=='done') return; told=true;
      DW.say('Super! Du hast alle Knochen. Jetzt bauen wir das Skelett zusammen – so wie Mary!').then(()=>{ if(G===g) GK.after(200,build); }); GK.after(7000,build); };
    said.then(()=>{ if(G===g) GK.after(Math.max(250,1400-(Date.now()-t0)),tell); }); GK.after(1800+txt.length*85,tell);
  }
}

/* ---------- Skelett zusammensetzen ---------- */
function skeleton(){
  G.phase='build'; G.placed=[];
  const need=G.need, pre=PARTS.filter(p=>!need.includes(p.k));
  root.innerHTML=`<div class="sd-stage an an-build" id="anStage">
    <div class="an-table"><div class="sd-grain" style="background-image:url(${DW.paperURL})"></div></div>
    <div class="sd-ask an-ask"><div class="pic">${GK.img('ichthyosaurus')}</div><div><div class="txt">Bau das Skelett!</div><div id="anProg">${GK.progress(0,need.length)}</div></div>
      <button class="ibtn" id="anSay2" type="button" aria-label="Nochmal hören">${ART.icon('lautsprecher')}</button></div>
    <div class="an-board" id="anBoard"><svg viewBox="0 0 400 160" class="an-outline" aria-hidden="true">${OUTLINE}${pre.map(p=>p.svg).join('')}</svg>
      ${need.map(k=>{const p=PARTS.find(p=>p.k===k),[x,y,w,h]=p.box;return `<div class="an-slot" data-k="${k}" style="left:${x/4}%;top:${y/1.6}%;width:${w/4}%;height:${h/1.6}%"></div>`;}).join('')}</div>
    <div class="an-tray" id="anTray">${DW.shuffle(need).map(k=>{ const p=PARTS.find(p=>p.k===k), rel=Math.round(Math.sqrt(Math.max(p.box[2],p.box[3])/178)*100);
      // Teile im Regal ungefähr in echter Größe zueinander – so unterscheiden sich Vorder- und Hinterflosse
      return `<button class="an-piece" data-k="${k}" type="button" aria-label="${p.n}" style="--rel:${rel}%">${partSVG(p)}</button>`; }).join('')}</div></div>`;
  const say='Zieh jeden Knochen an seinen Platz im Fischsaurier!';
  root.querySelector('#anSay2').onclick=()=>DW.say(say); DW.say(say);
  DW.$$('.an-piece',root).forEach(b=>{ const k=b.dataset.k, p=PARTS.find(p=>p.k===k);
    DW.drag(b,{ghost:()=>partSVG(p),onTap:()=>{ DW.say(p.n+'. Zieh ihn an den richtigen Platz!'); GK.pulse(fb(root.querySelector(`.an-slot[data-k="${k}"]`))); },
      onDrop:(x,y)=>place(k,x,y,b)}); });
  GK.idle.set(()=>{ const b=root.querySelector('.an-piece:not(.used)'); if(b) GK.pulse(b); },()=>{ const b=root.querySelector('.an-piece:not(.used)'); if(b){ GK.pulse(root.querySelector(`.an-slot[data-k="${b.dataset.k}"]`)); DW.say('Schau: Dort gehört dieser Knochen hin!'); } });
}
function place(k,x,y,b){
  const slot=root.querySelector(`.an-slot[data-k="${k}"]`), R=slot.getBoundingClientRect(), pad=34;
  const inSlot=x>R.left-pad&&x<R.right+pad&&y>R.top-pad&&y<R.bottom+pad;
  if(!inSlot){ const other=DW.$$('.an-slot',root).find(s=>DW.hit(x,y,s)), board=root.querySelector('#anBoard');
    if(other||(board&&DW.hit(x,y,board))) G.miss++;   // nur echte Fehlversuche zählen, nicht ein kurzes Anheben im Regal
    DW.sfx('no'); DW.say(other?'Hm, dieser Knochen passt da nicht. Schau auf die Form!':'Zieh den Knochen in das Fischsaurier-Bild.'); return false; }
  const p=PARTS.find(p=>p.k===k);
  slot.innerHTML=partSVG(p); slot.classList.add('done'); b.classList.add('used'); b.disabled=true; GK.ok(fb(slot));
  G.placed.push(k); root.querySelector('#anProg').innerHTML=GK.progress(G.placed.length,G.need.length);
  if(G.placed.length>=G.need.length){ GK.idle.stop(); GK.after(500,done); } else DW.say(DW.pick(['Passt genau!','Super, der sitzt!','Klick – passt!']));
  return true;
}
function done(){
  const b=root.querySelector('#anBoard'); if(b) b.classList.add('alive'); const tr=root.querySelector('#anTray'); if(tr) tr.style.visibility='hidden';
  DW.discover('ichthyosaurus',true); DW.sfx('magic');
  DW.say('Fertig! Ein ganzer Ichthyosaurus – genau so ein Skelett hat Mary Anning als Kind gefunden.');
  GK.after(3600,finish);
}
function finish(){
  const stars=G.miss<=1?3:G.miss<=3?2:1;
  GK.finish(root,{id:ID,stars,art:`<div class="sd-iart"><img src="assets/mary_anning.jpg" alt="Mary Anning" class="an-iport">${GK.img('ichthyosaurus',{mood:'happy'})}</div>`,
    title:'Wie Mary Anning!',say:'Du bist eine echte Fossilien-Jägerin, ein echter Fossilien-Jäger – wie Mary Anning!',again:()=>{G={miss:0};beach();}});
}
if(window.DW_DEBUG) window.__anInfo=()=>G&&{phase:G.phase||'story',need:G.need,found:G.found,miss:G.miss,stones:(G.stones||[]).map(s=>({t:s.t,k:s.k||s.f||'',open:s.open,hits:s.hits})),hits:G.L&&G.L.hits,placed:G.placed};
if(window.DW_DEBUG) window.__anSolve=()=>{
  if(!G) return 'none';
  const nx=root.querySelector('#anNext'); if(nx){ nx.click(); return 'story'; }
  if(G.phase==='beach'){ const s=G.stones.find(s=>!s.open&&s.t==='bone')||G.stones.find(s=>!s.open); if(s){ hit(s); return 'hit'; } }
  if(G.phase==='done'){ skeleton(); return 'build'; }
  if(G.phase==='build'){ const b=root.querySelector('.an-piece:not(.used)'); if(b){ const R=root.querySelector(`.an-slot[data-k="${b.dataset.k}"]`).getBoundingClientRect(); place(b.dataset.k,R.left+R.width/2,R.top+R.height/2,b); return 'place'; } }
  return 'wait';
};
if(window.DW_DEBUG) window.__anWrong=()=>{ const b=root.querySelector('.an-piece:not(.used)'); if(b) place(b.dataset.k,5,5,b); };
DW.stations[ID]={title:'Mary-Anning-Klippe',mount,unmount(){ G=null; clearTimeout(rzT); }};
})();
