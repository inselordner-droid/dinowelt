/* =====================================================================
   DINO-INSELWELT · GAME 07 „Dino-Kindergarten“
   Baby-Dinos zeigen ihre Wünsche als Bild-Blase (Hunger, müde, schmutzig,
   Langeweile). Das Kind zieht die passende Sache auf das Baby.
   Zum Schluss: Abholzeit – welches Baby gehört zu welchen Eltern?
   Leicht: 1 Baby, 2 Wünsche nacheinander; 2 Eltern zur Auswahl.
   Mittel: 2 Babys, je 2 Wünsche; 3 Eltern.
   Schwer: 3 Babys, je 3 Wünsche; 4 Eltern, darunter ähnliche Arten.
   ===================================================================== */
(function(){
"use strict";
const ID='kita';

/* ---------- Spieldaten ---------- */
const KT_BABIES={
  triceratops:{food:'p',sim:['protoceratops','styracosaurus']},
  stegosaurus:{food:'p',sim:['kentrosaurus','ankylosaurus']},
  brachiosaurus:{food:'p',sim:['diplodocus','brontosaurus']},
  parasaurolophus:{food:'p',sim:['corythosaurus','edmontosaurus']},
  ankylosaurus:{food:'p',sim:['stegosaurus','kentrosaurus']},
  protoceratops:{food:'p',sim:['triceratops','pachyrhinosaurus']},
  diplodocus:{food:'p',sim:['brachiosaurus','mamenchisaurus']},
  trex:{food:'f',sim:['allosaurus','giganotosaurus']},
  velociraptor:{food:'f',sim:['deinonychus','utahraptor']},
  allosaurus:{food:'f',sim:['trex','ceratosaurus']},
};
const EASY=['triceratops','stegosaurus','brachiosaurus','trex','parasaurolophus','ankylosaurus'];
/* Weitere Babys datengetrieben: alle gezeichneten Land-Dinos, die Pflanzen oder Fleisch/Fisch fressen.
   „Ähnliche Eltern“ (für Schwer) = gleicher Körperbauplan. */
function ktPlan(id){ const a=DATA.animal(id), sp=ART.SPECIES[ART.resolve(a.art)]||{}; return sp.plan==='theropod'?(sp.head==='rex'?'rex':sp.feathers?'raptor':'theropod'):sp.plan; }
(function(){ const dinos=GK.dinos().filter(a=>!a.sea&&DATA.habitat(a.id)==='land'&&(a.food==='pflanzen'||a.food==='fleisch'||a.food==='fisch'));
  dinos.forEach(a=>{ if(KT_BABIES[a.id]) return; const pl=ktPlan(a.id);
    KT_BABIES[a.id]={food:a.food==='pflanzen'?'p':'f',sim:DW.shuffle(dinos.filter(b=>b.id!==a.id&&ktPlan(b.id)===pl).map(b=>b.id)).slice(0,3),auto:true}; }); })();
// Leicht: bekannte Dinos und alle mit sehr typischer Gestalt
function ktEasy(id){ if(EASY.includes(id)) return true; const pl=ktPlan(id); return ['ceratops','stego','ankylo','rex'].includes(pl)||(pl==='sauropod'&&id!=='plateosaurus'); }
const FOODOK={p:['blaetter','farn'],f:['fleisch']};
const NEEDS={
  hunger:{icon:'futter',say:'Ich habe Hunger!',tool:'food'},
  schlaf:{icon:'nacht',say:'Ich bin sooo müde.',tool:'kt_decke'},
  dreck:{icon:'kt_schwamm',say:'Ich bin ganz schmutzig!',tool:'kt_schwamm'},
  spiel:{icon:'kt_ball',say:'Mir ist langweilig. Spielst du mit mir?',tool:'kt_ball'},
};
const TOOLS=['blaetter','fleisch','kt_decke','kt_schwamm','kt_ball'];
const TOOLNAME={blaetter:'Blätter',farn:'Farn',fleisch:'Fleisch',kt_decke:'Kuscheldecke',kt_schwamm:'Schwamm',kt_ball:'Ball'};
const LV={1:{babies:1,needs:2,parents:2},2:{babies:2,needs:2,parents:3},3:{babies:3,needs:3,parents:4}};
ART.ICONS.kt_ball=`<circle cx="32" cy="34" r="22" fill="#f0c35a" stroke="#4a3b2a" stroke-width="2"/><path d="M12 28q20 8 40 0M14 44q18-8 36 0" stroke="#c8553d" stroke-width="5" fill="none"/><path d="M32 12q-8 22 0 44" stroke="#8fbccb" stroke-width="5" fill="none"/>`;
ART.ICONS.kt_decke=`<path d="M8 20q24-8 48 0l-2 34q-22 6-44 0z" fill="#b58cbd" stroke="#4a3b2a" stroke-width="2"/><path d="M14 28h36M14 38h36M14 48h36" stroke="#fff" stroke-width="2.5" opacity=".6" stroke-dasharray="4 4"/><path d="M10 20q22 10 46 0" fill="none" stroke="#8e6a98" stroke-width="3"/>`;
ART.ICONS.kt_schwamm=`<rect x="12" y="26" width="40" height="26" rx="8" fill="#f0d36a" stroke="#4a3b2a" stroke-width="2"/><circle cx="22" cy="36" r="2.5" fill="#c9a83c"/><circle cx="34" cy="42" r="2" fill="#c9a83c"/><circle cx="42" cy="33" r="2.5" fill="#c9a83c"/><circle cx="20" cy="16" r="6" fill="#dff0f4" stroke="#8fbccb" stroke-width="2"/><circle cx="34" cy="12" r="4" fill="#dff0f4" stroke="#8fbccb" stroke-width="2"/><circle cx="46" cy="18" r="5" fill="#dff0f4" stroke="#8fbccb" stroke-width="2"/>`;
const MUD=`<svg viewBox="0 0 100 60"><g fill="#8a6440" opacity=".75"><ellipse cx="30" cy="30" rx="9" ry="6"/><ellipse cx="55" cy="22" rx="7" ry="5"/><ellipse cx="68" cy="38" rx="10" ry="6"/><ellipse cx="42" cy="44" rx="6" ry="4"/><circle cx="20" cy="44" r="4"/></g></svg>`;

let root,lv=1,S=null;
const nm=id=>DATA.nameOf(id);
function mount(r){root=r;intro();}
function intro(){
  GK.intro(root,{id:ID,art:`<div class="ga-art">${GK.img('triceratops',{mood:'happy'})}${GK.img('triceratops',{mood:'happy',baby:true}).replace('<img','<img style="flex:.5 1 0;height:48%"')}</div>`,title:'Dino-Kindergarten',
    say:'Willkommen im Dino-Kindergarten! Die Dino-Babys brauchen deine Hilfe. Schau auf ihre Blasen!',onStart:l=>{lv=l;begin();}});
}
function begin(){ S={r:0,miss:0,babies:null}; care(); }
function pickBabies(n){ const pool=Object.keys(KT_BABIES).filter(id=>DATA.animal(id)&&ART.has(DATA.animal(id).art)&&(lv>1||ktEasy(id))); let out;
  for(let t=0;t<40;t++){ out=GK.sample(pool,n); const plans=new Set(out.map(ktPlan)); if(n<2||(plans.size===n||t>30)&&(out.some(x=>KT_BABIES[x].food==='f')&&out.some(x=>KT_BABIES[x].food==='p')||t>20)) break; } return out; }
function progress(){ return GK.progress(S.r,3); }

/* ---------------- Pflege-Runde ---------------- */
function care(){
  const cfg=LV[lv]; const ids=S.babies&&S.r===1?S.babies:pickBabies(cfg.babies); S.babies=ids;
  const babies=ids.map((id,i)=>{ let list=DW.shuffle(Object.keys(NEEDS)); if(S.r===0) list=['hunger'].concat(list.filter(x=>x!=='hunger'));
    return {id,i,needs:list.slice(0,cfg.needs),k:0,busy:false,dirty:false}; });
  S.list=babies; S.sel=null; S.selKid=null;
  root.innerHTML=`<div class="kt fill"><div class="kt-room"><div class="kt-wall"></div><div class="kt-floor"></div>
    <div class="kt-win"></div><div class="kt-top">${progress()}</div>
    <div class="kt-babies n${babies.length}">${babies.map(b=>`<div class="kt-spot" data-i="${b.i}"><div class="kt-bubble"></div>
      <div class="kt-baby"><img class="kt-img" src="" alt="${nm(b.id)}"><div class="kt-mud">${MUD}</div><div class="kt-fx"></div></div><div class="kt-bed"></div></div>`).join('')}</div></div>
    <div class="kt-tray">${TOOLS.map(t=>`<button class="kt-tool" data-t="${t}" aria-label="${TOOLNAME[t]}">${GK.icon(t)}</button>`).join('')}</div></div>`;
  babies.forEach(b=>{ b.el=root.querySelector(`.kt-spot[data-i="${b.i}"]`); b.img=b.el.querySelector('.kt-img'); setMood(b,'');
    b.el.onclick=()=>{ if(S.sel){ const t=S.sel; select(null); apply(b,t); } else { DW.sfx('tap'); talk(b); } }; showNeed(b); });
  DW.$$('.kt-tool',root).forEach(el=>{ const t=el.dataset.t;
    DW.drag(el,{ghost:()=>GK.icon(t),onTap:()=>{ DW.sfx('pop'); select(S.sel===t?null:t); if(S.sel) DW.say(TOOLNAME[t]+'. Tippe auf ein Baby!'); },
      onDrop:(x,y)=>{ const b=S.list.find(b=>DW.hit(x,y,b.el)); select(null); if(!b) return false; apply(b,t); return false; }}); });
  const b0=babies[0];
  DW.say(S.r===0?(babies.length>1?'Guten Morgen, Babys! Schau auf die Blasen: Was brauchen sie? Zieh die richtige Sache zum Baby.':`Guten Morgen, kleiner ${nm(b0.id)}! ${NEEDS[b0.needs[0]].say} Zieh die richtige Sache zum Baby.`):'Nach dem Mittagsschlaf haben die Babys neue Wünsche!');
  GK.idle.set(()=>{ const b=S.list.find(b=>b.k<b.needs.length&&!b.busy); if(!b)return; GK.pulse(b.el.querySelector('.kt-bubble')); const t=toolFor(b); const e=root.querySelector(`.kt-tool[data-t="${t}"]`); GK.after(900,()=>e&&GK.pulse(e)); },
    ()=>{ const b=S.list.find(b=>b.k<b.needs.length); b&&talk(b); });
  if(window.DW_DEBUG) window.__kita={S,step:()=>{ const b=S.list.find(b=>b.k<b.needs.length&&!b.busy); if(!b) return null; const t=toolFor(b); apply(b,t); return [b.id,t]; },
    wrong:()=>{ const b=S.list.find(b=>b.k<b.needs.length&&!b.busy); if(!b) return null; const t=TOOLS.find(t=>t!==toolFor(b)); apply(b,t); return t; }};
}
function select(t){ S.sel=t; DW.$$('.kt-tool',root).forEach(e=>e.classList.toggle('sel',e.dataset.t===t)); }
function toolFor(b){ const n=b.needs[b.k]; if(n==='hunger') return KT_BABIES[b.id].food==='p'?'blaetter':'fleisch'; return NEEDS[n].tool; }
function setMood(b,m){ const a=DATA.animal(b.id).art; b.img.src=DW.svgURL(ART.animal(a,{mood:m||undefined,shadow:false,ph:m==='chew'?.25:0,baby:true})); }
function showNeed(b){
  const bub=b.el.querySelector('.kt-bubble'); const n=b.needs[b.k];
  if(!n){ bub.innerHTML=GK.icon('herz'); bub.classList.add('ok'); return; }
  bub.classList.remove('ok'); bub.innerHTML=GK.icon(NEEDS[n].icon);
  bub.classList.remove('pop'); void bub.offsetWidth; bub.classList.add('pop');
  b.el.querySelector('.kt-mud').classList.toggle('on',n==='dreck');
  b.el.classList.toggle('sleepy',n==='schlaf');
}
function talk(b){ const n=b.needs[b.k]; DW.say(n?`Ich bin ${nm(b.id)}. ${NEEDS[n].say}`:'Mir geht es gut. Danke!'); b.el.classList.remove('kt-hop'); void b.el.offsetWidth; b.el.classList.add('kt-hop'); }
function fx(b,html,cls,ms){ const f=b.el.querySelector('.kt-fx'); f.className='kt-fx '+cls; f.innerHTML=html; GK.after(ms,()=>{f.className='kt-fx';f.innerHTML='';}); }
function apply(b,t){
  const n=b.needs[b.k]; if(!n||b.busy){ DW.sfx('tap'); if(!n) DW.say('Mir geht es gut. Danke!'); return; }
  const isFood=t==='blaetter'||t==='fleisch';
  if(n==='hunger'&&isFood){
    const ok=FOODOK[KT_BABIES[b.id].food].includes(t);
    if(!ok){ S.miss++; setMood(b,'sad'); DW.sfx('yuck'); b.el.classList.remove('wiggle'); void b.el.offsetWidth; b.el.classList.add('wiggle'); GK.after(900,()=>setMood(b,''));
      DW.say(KT_BABIES[b.id].food==='p'?'Bäh! Ich bin ein Pflanzenfresser-Baby. Ich mag Blätter!':'Blätter? Nein danke! Ich bin ein kleiner Fleischfresser.'); return; }
    b.busy=true; DW.sfx('chew'); let k=0; const a=DATA.animal(b.id).art, c1=DW.svgURL(ART.animal(a,{mood:'chew',ph:.25,shadow:false,baby:true})),c2=DW.svgURL(ART.animal(a,{mood:'chew',ph:.75,shadow:false,baby:true}));
    fx(b,GK.icon(t),'eat',1200); const iv=GK.every(160,()=>{b.img.src=k++%2?c1:c2; if(k>7)clearInterval(iv);});
    DW.say(DW.pick(['Mampf, mampf! Lecker!','Mmmh! Danke!','Jam jam!'])); return done(b,1400);
  }
  if(NEEDS[n].tool===t){
    b.busy=true;
    if(n==='schlaf'){ DW.sfx('magic'); b.el.classList.add('asleep'); fx(b,`${GK.icon('kt_decke','kt-blank')}<span class="kt-z">z</span><span class="kt-z">z</span><span class="kt-z">Z</span>`,'sleep',2600); DW.say('Psst! Das Baby schläft.'); GK.after(2500,()=>b.el.classList.remove('asleep')); return done(b,2700); }
    if(n==='dreck'){ DW.sfx('brush'); GK.after(300,()=>DW.sfx('brush')); fx(b,'<i></i><i></i><i></i><i></i><i></i>','wash',1600); GK.after(700,()=>b.el.querySelector('.kt-mud').classList.remove('on')); DW.say('Schrubb, schrubb! Jetzt bist du sauber.'); return done(b,1700); }
    if(n==='spiel'){ DW.sfx('jump'); fx(b,GK.icon('kt_ball','kt-balli'),'play',1800); b.el.classList.add('kt-play'); GK.after(1800,()=>b.el.classList.remove('kt-play')); DW.say(DW.pick(['Hui! Das macht Spaß!','Juhu, Ball spielen!'])); return done(b,1900); }
  }
  // falsche Sache: kurz reagieren, Blase leuchtet
  S.miss++; DW.sfx('no'); b.el.classList.remove('wiggle'); void b.el.offsetWidth; b.el.classList.add('wiggle');
  const why={hunger:'Ich habe doch Hunger!',schlaf:'Ich bin doch müde!',dreck:'Ich bin doch so schmutzig!',spiel:'Ich will doch spielen!'}[n];
  const nope={blaetter:'Ich habe keinen Hunger.',fleisch:'Ich habe keinen Hunger.',kt_decke:'Ich bin nicht müde.',kt_schwamm:'Ich bin nicht schmutzig.',kt_ball:'Ich will jetzt nicht spielen.'}[t];
  DW.say(`${nope} ${why} Schau auf meine Blase.`); GK.pulse(b.el.querySelector('.kt-bubble'));
}
function done(b,ms){
  GK.after(ms,()=>{ b.busy=false; b.k++; setMood(b,'happy'); DW.sfx('ok'); b.el.classList.remove('kt-hop'); void b.el.offsetWidth; b.el.classList.add('kt-hop');
    const bub=b.el.querySelector('.kt-bubble'); bub.innerHTML=GK.icon('herz'); bub.classList.add('ok');
    GK.after(900,()=>{ showNeed(b); if(b.needs[b.k]) setMood(b,''); });
    if(S.list.every(x=>x.k>=x.needs.length)) GK.after(1400,careDone); });
}
function careDone(){
  DW.confetti(40); DW.sfx('win'); S.r++; root.querySelector('.kt-top').innerHTML=progress();
  DW.say(S.r===1?'Alle Babys sind glücklich! Du bist ein super Dino-Betreuer.':'Toll! Und jetzt ist Abholzeit!');
  GK.after(2600,()=>S.r===1?care():pickup());
}

/* ---------------- Abholzeit: Baby zu den Eltern ---------------- */
function pickup(){
  const cfg=LV[lv], babies=S.babies.slice(0,Math.min(S.babies.length,cfg.parents-1));
  let parents=babies.slice();
  if(lv===3) babies.forEach(id=>DW.shuffle(KT_BABIES[id].sim).forEach(s=>{ if(parents.length<cfg.parents&&!parents.includes(s)&&DATA.animal(s)) parents.push(s); }));
  // Leicht/Mittel: keine Eltern, die fast gleich aussehen wie ein Baby
  const pool=Object.keys(KT_BABIES).filter(x=>!parents.includes(x)&&DATA.animal(x)&&(lv>1||ktEasy(x))&&(lv===3||!babies.some(b=>KT_BABIES[b].sim.includes(x)||ktPlan(b)===ktPlan(x))));
  DW.shuffle(pool).forEach(x=>{ if(parents.length<cfg.parents) parents.push(x); });
  parents=DW.shuffle(parents.slice(0,cfg.parents));
  S.pick={babies,left:babies.length,wrong:0};
  root.innerHTML=`<div class="kt fill"><div class="kt-room pickup"><div class="kt-wall"></div><div class="kt-floor"></div><div class="kt-top">${progress()}</div>
    <div class="kt-parents n${parents.length}">${parents.map(id=>`<div class="kt-parent" data-id="${id}">${GK.img(id)}<div class="kt-pslot"></div></div>`).join('')}</div>
    <div class="kt-kids">${babies.map(id=>`<button class="kt-kid" data-id="${id}" aria-label="Baby ${nm(id)}">${GK.img(id,{mood:'happy',baby:true})}</button>`).join('')}</div></div></div>`;
  DW.$$('.kt-kid',root).forEach(el=>{ const id=el.dataset.id;
    DW.drag(el,{ghost:()=>GK.img(id,{mood:'happy',baby:true}),onTap:()=>{ DW.sfx('pop'); S.selKid=el; DW.$$('.kt-kid',root).forEach(k=>k.classList.toggle('sel',k===el)); DW.say('Wo ist deine Mama? Wo ist dein Papa?'); },
      onDrop:(x,y)=>{ const p=DW.$$('.kt-parent',root).find(p=>DW.hit(x,y,p)); if(!p) return false; return match(el,p); }}); });
  DW.$$('.kt-parent',root).forEach(p=>p.onclick=()=>{ if(S.selKid){ const k=S.selKid; S.selKid=null; k.classList.remove('sel'); match(k,p);} else { DW.sfx('tap'); DW.say(`Ich bin ${nm(p.dataset.id)}. Wo ist mein Baby?`); } });
  DW.say(babies.length>1?'Abholzeit! Die Dino-Eltern sind da. Bring jedes Baby zu seiner Mama oder seinem Papa!':'Abholzeit! Wer ist die Mama oder der Papa von diesem Baby? Zieh das Baby hin!');
  GK.idle.set(()=>{ const k=root.querySelector('.kt-kid:not(.gone)'); if(k){ GK.pulse(k); const p=root.querySelector(`.kt-parent[data-id="${k.dataset.id}"]`); GK.after(900,()=>p&&GK.pulse(p)); } },
    ()=>DW.say('Schau genau: Das Baby sieht aus wie seine Eltern. Nur viel kleiner!'));
  if(window.DW_DEBUG) window.__kita={S,match:(ok)=>{ const k=root.querySelector('.kt-kid:not(.gone)'); if(!k) return null; const p=root.querySelector(ok?`.kt-parent[data-id="${k.dataset.id}"]`:`.kt-parent:not([data-id="${k.dataset.id}"])`); match(k,p); return k.dataset.id; }};
}
function match(k,p){
  if(k.classList.contains('gone')) return false;
  const id=k.dataset.id;
  if(p.dataset.id===id){
    k.classList.add('gone'); p.querySelector('.kt-pslot').innerHTML=GK.img(id,{mood:'happy',baby:true}); p.classList.add('happy'); GK.ok(p); DW.discover(id,true);
    DW.say(DW.pick(['Da bist du ja, mein Schatz!','Hurra, mein Baby!','Danke, dass du auf mein Baby aufgepasst hast!']));
    /* Schluss erst, wenn die Mama/der Papa ausgeredet hat (höchstens 6 s länger) */
    if(--S.pick.left<=0){ const s=S, t0=performance.now(), go=()=>{ if(S!==s||!S) return; if(DW.speaking()&&performance.now()-t0<7800){ GK.after(250,go); return; } end(); }; GK.after(1800,go); }
    return true;
  }
  S.miss++; GK.no(p); DW.say(`Hm, das ist nicht mein Baby. Ich bin ${nm(p.dataset.id)}. Schau genau hin!`);
  return false;
}
function end(){
  const stars=S.miss<=1?3:S.miss<=4?2:1;
  GK.finish(root,{id:ID,stars,art:`<div class="ga-art">${GK.img(S.babies[0],{mood:'happy'})}${GK.img(S.babies[0],{mood:'happy',baby:true}).replace('<img','<img style="flex:.5 1 0;height:48%"')}</div>`,
    say:'Was für ein schöner Tag im Dino-Kindergarten! Übrigens: Manche Dino-Eltern kümmerten sich um ihre Babys, wie die Maiasaura. Ihr Name heißt gute Mutter-Echse.',
    again:()=>begin()});
}
DW.stations[ID]={title:(DATA.station(ID)||{}).n||'Dino-Kindergarten',mount,unmount(){S=null;delete window.__kita;}};
})();
