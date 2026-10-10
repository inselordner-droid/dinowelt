/* =====================================================================
   DINO-INSELWELT · Station Dino-Rettung (GAME 29)
   Ein Dino-Baby hat sich verlaufen und will zu seiner Mama.
   Auf dem Heimweg warten Hindernisse: Fels, Fluss, Stufe, Hunger, Durst.
   Das passende Ding aus dem Korb auf das Problem ziehen.
   Falsches Ding? Es fliegt freundlich zurück – nichts geht kaputt.
   ===================================================================== */
(function(){
"use strict";
const ID='rettung';

/* Eigenes Symbol: Blatt mit Wasser */
ART.ICONS.rt_wblatt=ART.ICONS.blatt+'<ellipse cx="30" cy="34" rx="10" ry="12" fill="#8fc3d6" stroke="#3d3226" stroke-opacity=".55" stroke-width="1.5"/><ellipse cx="27" cy="30" rx="3" ry="4" fill="#fff" opacity=".7"/>';

/* Werkzeuge im Korb */
const TOOLS={zweig:{n:'langer Ast',icon:'zweig'},holz:{n:'Baumstamm',icon:'holz'},stein:{n:'Stein',icon:'stein'},blatt:{n:'großes Blatt',icon:'blatt'},
  wblatt:{n:'Blatt mit Wasser',icon:'rt_wblatt'},farn:{n:'Farn',icon:'farn'},blaetter:{n:'Blätter',icon:'blaetter'},zapfen:{n:'Zapfen',icon:'zapfen'},
  fleisch:{n:'Fleisch',icon:'fleisch'},fisch:{n:'Fisch',icon:'fisch'},feder:{n:'Feder',icon:'feder'},muschel:{n:'Muschel',icon:'muschel'}};
/* Probleme: Schritte (Werkzeug → Ziel) und Ansagen */
const PROBLEMS={
 fels:{say:'Oh nein! Ein großer Fels versperrt den Weg. Was hilft?',steps:[{tool:'zweig',target:'obj',ok:'Mit dem Ast als Hebel rollt der Fels weg!'}],decoy:['feder','muschel','blatt','fisch']},
 fluss:{say:'Ein Fluss! Das Baby kann nicht schwimmen. Wie kommt es rüber?',steps:[{tool:'holz',target:'obj',ok:'Der Baumstamm ist eine Brücke!'}],decoy:['feder','blatt','zweig','muschel']},
 stufe:{say:'Die Stufe ist zu hoch für das Baby. Was hilft beim Hochklettern?',steps:[{tool:'stein',target:'obj',ok:'Eine Treppe aus Stein! Hopp, hoch!'}],decoy:['feder','blatt','fisch','muschel']},
 hunger:{say:'Das Baby hat Hunger. Was frisst es?',steps:[{tool:'FOOD',target:'baby',ok:'Mampf! Lecker Pflanzen. Jetzt hat es wieder Kraft.'}],decoy:['fleisch','fisch']},
 durst:{say:'Das Baby hat Durst. Hol Wasser vom Teich – mit einem großen Blatt!',steps:[{tool:'blatt',target:'obj',ok:'Das Blatt ist voll Wasser. Jetzt bring es dem Baby!'},{tool:'wblatt',target:'baby',ok:'Schlürf! Ahh, das tut gut.'}],decoy:['zweig','stein','feder']}};
/* Babys: Pflanzenfresser-Dinos an Land (Hunger-Aufgabe: frisst Pflanzen) */
const planOf=id=>(ART.SPECIES[ART.resolve(DATA.animal(id).art)]||{}).plan;
const BABIES=GK.pool(a=>DATA.isDino(a.id)&&a.food==='pflanzen'&&DATA.habitat(a.id)==='land').map(a=>a.id);
if(!BABIES.length) BABIES.push('triceratops');
let lastBaby=null;
/* Schwierigkeit: Anzahl Hindernisse, Mama-Wahl */
const LV={1:{probs:2,pool:['fels','fluss','stufe'],mom:false,tray:3},2:{probs:3,pool:['fels','fluss','stufe','hunger','durst'],mom:true,tray:3},3:{probs:4,pool:['fels','fluss','stufe','hunger','durst'],mom:true,tray:4}};

let root,lv=1,S=null;
/* Rückmeldungs-Klassen vor jeder neuen Rückmeldung abräumen (sonst gewinnt in der CSS-Reihenfolge immer dieselbe) */
const fb=el=>{ if(el) el.classList.remove('gk-good','gk-bad','gk-hint'); return el; };
/* Laufende Züge merken: Vor jedem Neuaufbau (innerHTML) werden sie sauber beendet – sonst bliebe die
   Zieh-Kopie am Bildschirm hängen („doppeltes Bild“), weil das gegriffene Element verschwindet. */
const live=new Map();
function drag(el,opt){
  el.addEventListener('pointerdown',e=>{ if(!(e.button>0)&&!live.has(el)) live.set(el,e.pointerId); });
  const off=e=>{ if(live.get(el)===e.pointerId) live.delete(el); };
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>el.addEventListener(ev,off));
  DW.drag(el,opt);
}
function endDrags(){
  live.forEach((id,el)=>{ try{ el.dispatchEvent(new PointerEvent('pointercancel',{pointerId:id,bubbles:true})); }catch(e){} });
  live.clear(); document.documentElement.classList.remove('dw-dragging');
}

function mount(r){ root=r; GK.listen(window,'resize',fit); intro(); }
function intro(){
  S=null;
  GK.intro(root,{id:ID,art:'<div class="gc-art">'+(GK.icon('babydino')+GK.icon('rettungsring'))+'</div>',title:'Dino-Rettung',
    say:'Ein Dino-Baby hat sich verlaufen! Helfen wir ihm nach Hause zu seiner Mama?',onStart:l=>{lv=l;start();}});
}
function start(){
  const L=LV[lv], baby=DW.pick(BABIES.filter(b=>b!==lastBaby))||BABIES[0], a=DATA.animal(baby)||{}; lastBaby=baby;
  const foods=(a.eats||['farn','blaetter']).filter(f=>['farn','blaetter','zapfen'].includes(f)); if(!foods.length) foods.push('farn');
  let probs=DW.shuffle(L.pool).slice(0,L.probs);
  // Hunger/Durst nicht gleich zu Beginn – erst unterwegs
  probs.sort((p,q)=>(['hunger','durst'].includes(p)?1:0)-(['hunger','durst'].includes(q)?1:0)+(Math.random()-.5)*.8);
  S={L,baby,food:DW.pick(foods),probs,pi:0,si:0,miss:0,wrongs:0,busy:false};
  root.innerHTML=`<div class="rt fill col"><div class="rt-top">${GK.progress(0,probs.length+(L.mom?1:0)+1)}</div>
    <div class="rt-box"><div class="rt-scene" id="rtScene"></div></div>
    <div class="rt-tray" id="rtTray"></div></div>`;
  if(window.DW_DEBUG) window.__rettungWin=()=>{ if(!S) return; S.cheat=true; solveAll(); };
  scene(true);
}
function fit(){ const box=root&&root.querySelector('.rt-box'), sc=root&&root.querySelector('.rt-scene'); if(!box||!sc) return;
  const bw=box.clientWidth, bh=box.clientHeight, ar=bw<bh*1.05?.85:1.7; let w=bw, h=w/ar; if(h>bh){h=bh;w=h*ar;} sc.style.width=w+'px'; sc.style.height=h+'px'; sc.classList.toggle('rt-tall',ar<1); }

/* ---------- Szene ---------- */
function bgSVG(kind){
  const ground=kind==='fluss'?`<path d="M0 450H400V600H0Z" fill="#b99b6c"/><path d="M600 450H1000V600H600Z" fill="#b99b6c"/><path d="M400 450q8 60 20 150h160q12-90 20-150z" fill="#8a7050"/><path d="M412 500h176v100H412z" fill="#7fb3c9"/><path d="M420 520q20-8 40 0t40 0 40 0 40 0" stroke="#fff" stroke-width="4" fill="none" opacity=".7"/><path d="M420 560q20-8 40 0t40 0 40 0 40 0" stroke="#fff" stroke-width="4" fill="none" opacity=".5"/>`
    :kind==='stufe'?`<path d="M0 450H560V600H0Z" fill="#b99b6c"/><path d="M560 340H1000V600H560Z" fill="#a98b5f"/><path d="M560 340H1000v14H560z" fill="#8fb06f"/>`
    :`<path d="M0 450H1000V600H0Z" fill="#b99b6c"/>`;
  return `<svg viewBox="0 0 1000 600" preserveAspectRatio="none" class="rt-bg"><defs><linearGradient id="rtsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfdde4"/><stop offset="1" stop-color="#f4e8cc"/></linearGradient></defs>
    <rect width="1000" height="600" fill="url(#rtsky)"/>
    <path d="M0 330q120-90 260-30t260-10 250-50 230 30V600H0z" fill="#c9d3b5" opacity=".8"/><path d="M0 400q160-70 320-20t330-10 350 10V600H0z" fill="#a9c28f" opacity=".85"/>
    ${ground}${kind==='fluss'?'':`<path d="M0 450h${kind==='stufe'?560:1000}v12H0z" fill="#8fb06f"/>`}${kind==='fluss'?'<path d="M0 450h400v12H0zM600 450h400v12H600z" fill="#8fb06f"/>':''}
    ${kind==='durst'?'<ellipse cx="700" cy="468" rx="130" ry="26" fill="#7fb3c9" stroke="#5f93a8" stroke-width="3"/><path d="M620 466q20-6 40 0t40 0 40 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>':''}
  </svg>`;
}
function scene(first){
  endDrags();
  const sc=root.querySelector('#rtScene'); const done=S.pi>=S.probs.length;
  const kind=done?'home':S.probs[S.pi];
  sc.innerHTML=bgSVG(kind)+`<i class="rt-sun"></i><div class="rt-deco">${GK.icon('palme','rt-palm')}${GK.icon('farn','rt-fern')}</div>`;
  const babyEl=DW.h(`<div class="rt-baby rt-enter"><img src="${DW.svgURL(ART.animal(DATA.animal(S.baby).art||S.baby,{mood:'sad',shadow:false,baby:true}))}" alt="Baby"><span class="rt-think" hidden></span></div>`);
  sc.appendChild(babyEl); S.babyEl=babyEl;
  requestAnimationFrame(()=>requestAnimationFrame(()=>babyEl.classList.remove('rt-enter')));
  fit();
  root.querySelector('.rt-top').innerHTML=GK.progress(S.pi,S.probs.length+(S.L.mom?1:0)+1);
  if(done) return home();
  const P=PROBLEMS[kind]; S.si=0; S.P=P; S.kind=kind; S.miss=0;
  let obj='';
  if(kind==='fels') obj=`<div class="rt-obj rt-rock">${GK.icon('stein')}</div>`;
  if(kind==='fluss') obj=`<div class="rt-obj rt-river"></div><div class="rt-log">${GK.icon('holz')}</div>`;
  if(kind==='stufe') obj=`<div class="rt-obj rt-step"></div><div class="rt-stones">${GK.icon('stein')}${GK.icon('stein')}</div>`;
  if(kind==='durst') obj=`<div class="rt-obj rt-pond"></div>`;
  if(obj) sc.insertAdjacentHTML('beforeend',obj);
  const think=babyEl.querySelector('.rt-think');
  if(kind==='hunger'){ think.hidden=false; think.innerHTML=`<b>?</b>`; }
  if(kind==='durst'){ think.hidden=false; think.innerHTML=`<i class="rt-drop"></i>`; }
  tray();
  DW.say((first?`Das kleine ${GK.name(S.baby)}-Baby möchte nach Hause. `:'')+(kind==='hunger'?`Das Baby hat Hunger. Was frisst ein ${GK.name(S.baby)}?`:P.say));
  GK.idle.set(()=>hintTool(),()=>DW.say(kind==='hunger'?`${GK.name(S.baby)} frisst Pflanzen. Zieh das Richtige zum Baby!`:'Zieh ein Ding aus dem Korb auf das Problem.'));
}
function need(){ const st=S.P.steps[S.si]; return st.tool==='FOOD'?S.food:st.tool; }
function tray(){
  endDrags();
  const tr=root.querySelector('#rtTray'); const n=need();
  let list=[n,...GK.sample(S.P.decoy.filter(d=>d!==n),S.L.tray-1)];
  if(S.kind==='hunger') list=[n,...GK.sample(['fleisch','fisch','muschel'],S.L.tray-1)];
  if(S.kind==='durst'&&S.si===1) list=['wblatt',...GK.sample(['zweig','stein','feder'],S.L.tray-1)];
  list=DW.shuffle(list);
  tr.innerHTML=`<span class="rt-basket">${GK.icon('rucksack')}</span>`+list.map(k=>`<button class="rt-tool" data-k="${k}" aria-label="${TOOLS[k].n}">${GK.icon(TOOLS[k].icon)}</button>`).join('');
  DW.$$('.rt-tool',tr).forEach(b=>{ const k=b.dataset.k;
    drag(b,{ghost:()=>GK.icon(TOOLS[k].icon),onTap:()=>{DW.sfx('tap');DW.say(TOOLS[k].n+'. Zieh es auf das Problem!');},
      onDrop:(x,y)=>drop(k,x,y,b)}); });
}
function hintTool(){ const b=root.querySelector(`.rt-tool[data-k="${need()}"]`); GK.pulse(fb(b)); const t=targetEl(); if(t) GK.pulse(fb(t)); }
function targetEl(){ const st=S.P.steps[S.si]; return st.target==='baby'?S.babyEl:root.querySelector('.rt-obj'); }
function near(x,y,el){ const r=el.getBoundingClientRect(); const cx=r.left+r.width/2, cy=r.top+r.height/2; return Math.abs(x-cx)<Math.max(70,r.width*.7)&&Math.abs(y-cy)<Math.max(70,r.height*.7); }
function drop(k,x,y,btn){
  if(!S||S.busy||!btn.isConnected) return false;
  const st=S.P.steps[S.si], tgt=targetEl(), other=st.target==='baby'?root.querySelector('.rt-obj'):S.babyEl;
  const onT=tgt&&near(x,y,tgt), onO=other&&near(x,y,other);
  if(!onT&&!onO) return false;
  if(onT&&k===need()){ btn.style.visibility='hidden'; /* Platz bleibt frei – die anderen Dinge rutschen nicht */ act(st); return true; }
  // freundlicher Fehlversuch
  S.miss++; S.wrongs++; GK.no(fb(onT?tgt:other));
  if(S.kind==='hunger'&&(k==='fleisch'||k==='fisch')) DW.say(`Bäh! Ein ${GK.name(S.baby)} frisst kein ${TOOLS[k].n}. Es frisst Pflanzen.`);
  else if(onO&&!onT) DW.say(st.target==='baby'?'Bring es zum Baby!':'Hm, das Baby braucht hier etwas anderes.');
  else DW.say(DW.pick(['Hm, das passt noch nicht. Probier etwas anderes!','Das hilft hier nicht. Schau mal im Korb!']));
  if(S.miss>=2) hintTool();
  return false;
}
function act(st){
  S.busy=true; GK.ok(); const sc=root.querySelector('#rtScene'), k=S.kind;
  if(k==='fels'){ const r=sc.querySelector('.rt-rock'); r.classList.add('rt-roll'); DW.sfx('thud'); }
  if(k==='fluss'){ sc.querySelector('.rt-log').classList.add('rt-lay'); DW.sfx('thud'); }
  if(k==='stufe'){ sc.querySelector('.rt-stones').classList.add('rt-build'); DW.sfx('clink'); }
  if(k==='durst'&&S.si===0){ const p=sc.querySelector('.rt-pond'); p.innerHTML=GK.icon('rt_wblatt'); DW.sfx('pop'); }
  if(k==='durst'&&S.si===1||k==='hunger'){ DW.sfx(k==='hunger'?'chew':'pop'); const t=S.babyEl.querySelector('.rt-think'); t.innerHTML=GK.icon(k==='hunger'?S.food:'rt_wblatt'); t.classList.add('rt-eat'); }
  DW.say(st.ok);
  S.si++;
  if(S.si<S.P.steps.length){ GK.after(900,()=>{S.busy=false;tray();}); return; }
  GK.idle.stop();
  GK.after(1300,()=>{ const img=S.babyEl.querySelector('img'); img.src=DW.svgURL(ART.animal(DATA.animal(S.baby).art||S.baby,{mood:'happy',shadow:false,baby:true}));
    S.babyEl.querySelector('.rt-think').hidden=true; S.babyEl.classList.add('rt-walk'); if(k==='stufe') S.babyEl.classList.add('rt-up'); if(k==='fluss') S.babyEl.classList.add('rt-cross'); DW.sfx('step');
    GK.after(1900,()=>{ S.busy=false; S.pi++; scene(false); }); });
}
if(window.DW_DEBUG) window.__rettungInfo=()=>{ if(!S) return null; const live=S.pi<S.probs.length&&S.P&&S.si<S.P.steps.length; return {kind:S.pi<S.probs.length?S.kind:'home',need:live?need():null,target:live?S.P.steps[S.si].target:null,busy:S.busy||!live&&S.pi<S.probs.length,pi:S.pi,n:S.probs.length,baby:S.baby,wrongs:S.wrongs,over:!!S.over}; };
if(window.DW_DEBUG) window.__rettungStep=()=>{ if(S&&!S.busy&&S.pi<S.probs.length){ act(S.P.steps[S.si]); return S.kind; } if(S&&S.momEl&&S.pi>=S.probs.length){ S.momEl.click(); return 'mom'; } return null; };
function solveAll(){ // Testhilfe
  const go=()=>{ if(!S||S.pi>=S.probs.length){ if(S&&S.momEl) S.momEl.click(); return; } if(S.busy){GK.after(400,go);return;} act(S.P.steps[S.si]); GK.after(500,go); }; go(); }

/* ---------- Zuhause: Mama finden ---------- */
function home(){
  const sc=root.querySelector('#rtScene'); sc.classList.add('rt-homes'); root.querySelector('#rtTray').innerHTML='';
  const art=id=>DATA.animal(id)&&DATA.animal(id).art||id;
  if(!S.L.mom){ const m=DW.h(`<button class="rt-mom rt-mom1">${GK.img(S.baby,{mood:'happy'})}</button>`); sc.appendChild(m); S.momEl=m;
    DW.say('Da ist die Mama! Tippe auf sie.'); m.onclick=()=>reunite(m); GK.idle.set(()=>GK.pulse(m),()=>DW.say('Tippe auf die Mama!')); return; }
  // Mittel: andere Körperform (leicht zu unterscheiden) · Schwer: auch ähnliche Tiere mit gleicher Körperform
  const cand=GK.dinos().map(a=>a.id).filter(i=>i!==S.baby&&DATA.habitat(i)==='land'&&DATA.nameOf(i)!==DATA.nameOf(S.baby));
  const diff=cand.filter(i=>planOf(i)!==planOf(S.baby)), same=cand.filter(i=>planOf(i)===planOf(S.baby));
  const others=lv>=3&&same.length?[DW.pick(same),...GK.sample(diff,1)]:GK.sample(diff,2);
  const opts=DW.shuffle([S.baby,...others]);
  sc.insertAdjacentHTML('beforeend',`<div class="rt-moms">${opts.map(id=>`<button class="rt-mom" data-id="${id}" aria-label="${GK.name(id)}">${GK.img(id,{mood:id===S.baby?'happy':undefined,flip:true})}</button>`).join('')}</div>`);
  DW.$$('.rt-mom',sc).forEach(b=>{ if(b.dataset.id===S.baby) S.momEl=b;
    b.onclick=()=>{ if(!S||S.over) return; if(b.dataset.id===S.baby) return reunite(b); S.wrongs++; GK.no(fb(b),`Das ist ein ${GK.name(b.dataset.id)}. Die Mama sieht aus wie das Baby!`); }; });
  DW.say('Welche Mama gehört zu dem Baby? Sie sieht genauso aus – nur größer!');
  GK.idle.set(()=>GK.pulse(fb(S.momEl)),()=>DW.say(`Such die Mama. Sie ist auch ein ${GK.name(S.baby)}.`));
}
function reunite(m){
  if(S.over) return; S.over=true; GK.idle.stop(); DW.sfx('ok');
  m.classList.add('rt-found'); S.babyEl.classList.add('rt-run');
  const img=S.babyEl.querySelector('img'); img.src=DW.svgURL(ART.animal(DATA.animal(S.baby).art||S.baby,{mood:'happy',shadow:false,baby:true}));
  const sc=root.querySelector('#rtScene'); for(let i=0;i<5;i++) sc.insertAdjacentHTML('beforeend',`<span class="rt-heart" style="left:${40+i*8}%;animation-delay:${i*.15}s">${GK.icon('herz')}</span>`);
  root.querySelector('.rt-top').innerHTML=GK.progress(99,S.probs.length+(S.L.mom?1:0)+1);
  DW.say('Hurra! Das Baby ist wieder bei seiner Mama!');
  DW.discover(S.baby,true);
  const stars=S.wrongs<=1?3:S.wrongs<=4?2:1;
  GK.after(S.cheat?600:2600,()=>{ if(!S) return; const baby=S.baby; S=null;
    GK.finish(root,{id:ID,stars,art:'<div class="gc-art">'+(GK.img(baby,{mood:'happy',baby:true}))+'</div>',title:'Gerettet!',
      say:'Rettungsabzeichen für dich! Du hast dem Baby sicher nach Hause geholfen.',again:()=>start()}); });
}
DW.stations[ID]={title:'Dino-Rettung',mount,unmount(){ /* Ziehen mitten im Spiel abgebrochen: Zug beenden, Geist-Bild entfernen */ endDrags(); DW.$$('body>.dragging').forEach(n=>n.remove());  S=null; delete window.__rettungWin; delete window.__rettungStep; }};
})();
