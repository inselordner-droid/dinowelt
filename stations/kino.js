/* =====================================================================
   DINO-INSELWELT · Station Urzeit-Kino
   Film „Ein Tag im Leben des Spinosaurus“: 20 Bilder als Ken-Burns-
   Diashow mit Überblendung, Erzählstimme, leiser Musik, Untertiteln
   und Popcorn. Danach ein kleines Bilder-Quiz.
   ===================================================================== */
(function(){
"use strict";
const ID='kino';
const INK='#3d3226';
/* ---------- Drehbuch: Bild, Erzähltext, Kamerafahrt (Zoom s, Verschiebung x/y in %) ---------- */
const SCENES=[
 {t:'Vor ungefähr 95 Millionen Jahren, im Norden von Afrika. Die Sonne geht über einem großen Fluss auf.',a:{s:1.02,x:0,y:2},b:{s:1.16,x:0,y:-3}},
 {t:'Am Ufer wachsen Farne, Palmen und hohe Bäume. Hier lebt ein ganz besonderer Dinosaurier.',a:{s:1.15,x:4,y:0},b:{s:1.04,x:-1,y:0}},
 {t:'Da kommt er! Der Spinosaurus stapft am Flussufer entlang.',a:{s:1.04,x:0,y:0},b:{s:1.18,x:-4,y:2}},
 {t:'Auf dem Rücken trägt er ein großes Segel. Darin stecken lange Knochenstacheln, mit Haut überzogen.',a:{s:1.2,x:-2,y:4},b:{s:1.06,x:0,y:0}},
 {t:'Spinosaurus war einer der längsten Raubsaurier. Forscher schätzen: etwa 14 Meter – länger als ein Bus!',a:{s:1.04,x:3,y:0},b:{s:1.16,x:-3,y:2}},
 {t:'Er läuft durch die Farne hinunter zum Wasser. Er hat Hunger!',a:{s:1.14,x:0,y:3},b:{s:1.03,x:0,y:0}},
 {t:'Schau mal, sein Kopf! Die Schnauze ist lang und schmal – ein bisschen wie bei einem Krokodil.',a:{s:1.02,x:0,y:0},b:{s:1.2,x:3,y:1}},
 {t:'Das Wasser im Fluss ist ganz klar. Viele Fische schwimmen darin.',a:{s:1.16,x:-3,y:3},b:{s:1.04,x:2,y:0}},
 {t:'Der Spinosaurus watet ins Wasser. Jetzt ist er ganz still und wartet.',a:{s:1.03,x:0,y:0},b:{s:1.15,x:3,y:-2}},
 {t:'Platsch! Ein großer Fisch springt aus dem Wasser!',a:{s:1.18,x:-4,y:0},b:{s:1.05,x:0,y:0}},
 {t:'Schnapp! Der Spinosaurus reißt das Maul auf.',a:{s:1.05,x:0,y:0},b:{s:1.2,x:4,y:0}},
 {t:'Er hat den Fisch gefangen! Mit seinen spitzen, kegelförmigen Zähnen hält er ihn gut fest.',a:{s:1.18,x:4,y:0},b:{s:1.06,x:0,y:0}},
 {t:'Spinosaurus fraß vor allem Fische. Vielleicht manchmal auch andere Tiere.',a:{s:1.04,x:0,y:0},b:{s:1.14,x:3,y:2}},
 {t:'Jetzt taucht er unter! Spinosaurus konnte schwimmen. Sein breiter Schwanz half ihm dabei.',a:{s:1.02,x:0,y:0},b:{s:1.16,x:-3,y:0}},
 {t:'Nur Kopf und Segel schauen noch heraus. Wie viel Zeit er im Wasser verbrachte, erforschen Wissenschaftler bis heute.',a:{s:1.15,x:3,y:0},b:{s:1.03,x:-1,y:0}},
 {t:'Nach dem Schwimmen klettert er wieder ans Ufer.',a:{s:1.04,x:0,y:0},b:{s:1.16,x:3,y:0}},
 {t:'Jetzt steht er am Ufer und ruht sich in der warmen Sonne aus.',a:{s:1.14,x:-3,y:0},b:{s:1.04,x:0,y:0}},
 {t:'Es wird Abend. Flugsaurier fliegen über den Fluss. Sie waren keine Dinosaurier, aber nahe Verwandte.',a:{s:1.16,x:0,y:5},b:{s:1.04,x:0,y:0}},
 {t:'Die Sonne geht unter. Der Himmel leuchtet orange.',a:{s:1.03,x:0,y:0},b:{s:1.15,x:-4,y:2}},
 {t:'Der Spinosaurus ist satt und müde. Gute Nacht, Spinosaurus!',a:{s:1.15,x:-3,y:0},b:{s:1.06,x:0,y:2}},
];
const IMG=i=>`assets/kino/szene${String(i+1).padStart(2,'0')}.jpg`;
const MIN_MS=7000, FADE_MS=1100, MUSIC_VOL=.22, MUSIC_DUCK=.07;
/* ---------- Quiz (Bild-Antworten; die erste ist richtig) ---------- */
const QUIZ=[
 {id:'futter',must:true,q:'Was hat der Spinosaurus am liebsten gefressen?',ch:[{ic:'fisch',n:'Fische'},{ic:'blaetter',n:'Blätter'},{ic:'fruechte',n:'Früchte'}],
  yes:'Genau! Spinosaurus fraß vor allem Fische.',hint:'Denk an den Film: Was hat er im Fluss gefangen?'},
 {id:'star',q:'Welcher Dino war der Filmstar?',ch:[{an:'spinosaurus',n:'Spinosaurus'},{an:'trex',n:'Tyrannosaurus'},{an:'stegosaurus',n:'Stegosaurus'}],
  yes:'Richtig! Der Spinosaurus mit dem großen Segel.',hint:'Der Filmstar hatte ein Segel auf dem Rücken.'},
 {id:'ort',q:'Wo hat der Spinosaurus im Film gelebt?',ch:[{img:7,n:'Am Fluss'},{ic:'schneeflocke',n:'Im Schnee'},{ic:'vulkan',n:'Am Vulkan'}],
  yes:'Ja! An großen Flüssen im Norden von Afrika. Heute ist dort die Wüste Sahara.',hint:'Wo hat er die Fische gefangen?'},
 {id:'kann',q:'Was konnte der Spinosaurus gut?',ch:[{img:13,n:'Schwimmen'},{ic:'luft',n:'Fliegen'},{ic:'schaufel',n:'Tunnel graben'}],
  yes:'Richtig! Er konnte schwimmen. Wie gut, erforschen Forscher noch.',hint:'Weißt du noch, wie er untergetaucht ist?'},
 {id:'abend',q:'Wer flog am Abend über den Fluss?',ch:[{an:'pteranodon',n:'Flugsaurier'},{an:'triceratops',n:'Triceratops'},{an:'mammut',n:'Mammut'}],
  yes:'Genau! Flugsaurier – nahe Verwandte der Dinosaurier.',hint:'Wer hat Flügel?'},
 {id:'ruecken',q:'Was hatte der Spinosaurus auf dem Rücken?',ch:[{img:14,n:'Ein Segel'},{an:'ankylosaurus',n:'Einen Panzer'},{ic:'rucksack',n:'Einen Rucksack'}],
  yes:'Ja! Ein großes Segel aus Knochenstacheln und Haut.',hint:'Schau dir das Bild genau an: Was ragt aus dem Wasser?'},
];
/* eigene Symbole */
const S=`stroke="${INK}" stroke-width="1.5" stroke-opacity=".75" stroke-linejoin="round"`;
ART.ICONS.ki_popcorn=`${[[22,18],[32,13],[42,18],[27,11],[37,10],[17,24],[47,24],[32,21]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7" fill="#fbf3dc" ${S}/>`).join('')}<path d="M14 26h36l-5 32H19z" fill="#fbf8f0" ${S}/><path d="M20 26l3 32M28 26l1 32M36 26l-1 32M44 26l-3 32" stroke="#c8553d" stroke-width="4"/><path d="M14 26h36l-5 32H19z" fill="none" ${S}/>`;
ART.ICONS.ki_cc=`<rect x="6" y="12" width="52" height="34" rx="9" fill="#fbf8f0" ${S}/><path d="M18 46l-4 10 12-10" fill="#fbf8f0" ${S}/><path d="M14 24h24M14 32h36M42 24h8" stroke="#3b6f8a" stroke-width="4" stroke-linecap="round"/>`;
ART.ICONS.ki_pause=`<rect x="16" y="12" width="11" height="40" rx="4" fill="#3d3226"/><rect x="37" y="12" width="11" height="40" rx="4" fill="#3d3226"/>`;
ART.ICONS.ki_play=`<path d="M20 10l34 22-34 22z" fill="#3d3226" stroke="#3d3226" stroke-width="3" stroke-linejoin="round"/>`;

let root, lv=1, cur=-1, playing=false, tok=0, layer=0, music=null, subs=false, kb=null, popN=0, volT=null, ended=false;
const wait=ms=>new Promise(r=>GK.after(ms,r));
const st=()=>GK.st(ID);

function mount(r){ root=r; ended=false;
  GK.intro(root,{id:ID,art:`<img src="${IMG(4)}" alt="" style="border-radius:16px;box-shadow:var(--shadow);height:100%;width:auto">`,title:'Urzeit-Kino',
    say:'Willkommen im Urzeit-Kino! Heute läuft der Film: Ein Tag im Leben des Spinosaurus. Danach gibt es ein kleines Quiz.',play:'Film ab!',onStart:l=>{lv=l;cinema();}});
}

/* ---------- Musik ---------- */
function musicStart(){ if(!DW.state.settings.sound) return; try{ if(!music){ music=new Audio('assets/sounds/musik.mp3'); music.loop=true; music.volume=MUSIC_VOL; }
  const p=music.play(); if(p&&p.catch) p.catch(()=>{}); }catch(e){} }
function musicPause(){ try{ music&&music.pause(); }catch(e){} }
function musicVol(v){ if(!music) return; clearInterval(volT); volT=setInterval(()=>{ if(!music){clearInterval(volT);return;} const d=v-music.volume; if(Math.abs(d)<.012){ music.volume=v; clearInterval(volT); } else music.volume=DW.clamp(music.volume+Math.sign(d)*.012,0,1); },30); }
// Erzählen: endet spätestens nach geschätzter Sprechdauer – auch wenn die Stimme unterbrochen wird (z. B. Untertitel-Knopf)
function narrate(txt){ musicVol(MUSIC_DUCK); const est=new Promise(r=>GK.after(1500+txt.length*85,r));
  return Promise.race([DW.say(txt),est]).then(()=>{ if(playing) musicVol(MUSIC_VOL); }); }

/* ---------- Kinosaal ---------- */
function cinema(){
  tok++; cur=-1; playing=false; ended=false; layer=0; kb=null; popN=0;
  subs=st().subs!=null?st().subs:!DW.state.settings.voice;
  const av=ART.AVATARS.find(a=>a.id===DW.state.avatar)||ART.AVATARS[0];
  root.innerHTML=`<div class="ki fill">
    <div class="ki-drape l"></div><div class="ki-drape r"></div><div class="ki-valance"></div>
    <div class="ki-beam" id="kiBeam"></div>
    <div class="ki-main">
      <div class="ki-box" id="kiBox">
        <div class="ki-screen" id="kiScreen"><img class="ki-img" alt=""><img class="ki-img" alt="">
          <div class="ki-leader" id="kiLeader" hidden><span></span></div><div class="ki-end hand" id="kiEnd" hidden>Ende</div></div>
        <div class="ki-curtain l"></div><div class="ki-curtain r"></div>
        <div class="ki-ctitle hand" id="kiCTitle">Ein Tag im Leben des Spinosaurus</div>
      </div>
      <div class="ki-cap hand" id="kiCap"></div>
      <div class="ki-time" id="kiTime">${SCENES.map((_,i)=>`<button class="ki-dot" data-i="${i}" type="button" aria-label="Szene ${i+1}"></button>`).join('')}</div>
      <div class="ki-ctrl">
        <button class="ibtn big" id="kiPrev" type="button" aria-label="Zurück">${ART.icon('pfeil_l')}</button>
        <button class="ki-play" id="kiPlay" type="button" aria-label="Abspielen">${ART.icon('ki_play')}</button>
        <button class="ibtn big" id="kiNext" type="button" aria-label="Weiter">${ART.icon('pfeil_r')}</button>
        <button class="ibtn big ki-cc" id="kiCC" type="button" aria-label="Untertitel">${ART.icon('ki_cc')}</button>
        <button class="ibtn big ki-pc" id="kiPop" type="button" aria-label="Popcorn">${ART.icon('ki_popcorn')}</button>
      </div>
    </div>
    <div class="ki-seats"><img class="ki-me" src="${DW.svgURL(ART.avatar(av,{}))}" alt=""></div>
  </div>`;
  const A=DW.$$('.ki-img',root);
  root.querySelector('#kiPlay').onclick=()=>{ DW.sfx('click'); if(ended) return replay(); if(cur<0) return; playing?pause():resume(); };
  root.querySelector('#kiPrev').onclick=()=>{ DW.sfx('tap'); if(cur>0) go(cur-1); };
  root.querySelector('#kiNext').onclick=()=>{ DW.sfx('tap'); if(cur<0) return; if(cur<SCENES.length-1) go(cur+1); else finale(); };
  root.querySelector('#kiCC').onclick=()=>{ subs=!subs; st().subs=subs; DW.save(); DW.sfx('click'); capShow(); DW.say(subs?'Untertitel an.':'Untertitel aus.'); };
  root.querySelector('#kiPop').onclick=popcorn;
  DW.$$('.ki-dot',root).forEach(b=>b.onclick=()=>{ if(cur<0) return; DW.sfx('tap'); go(+b.dataset.i); });
  GK.listen(window,'resize',fit); GK.listen(document,'visibilitychange',()=>{ if(document.hidden&&playing) pause(); });
  fit(); capShow(); setPlayIcon();
  // Licht aus, Vorhang auf, Countdown
  GK.after(300,()=>root.querySelector('.ki').classList.add('dark'));
  DW.say('Pssst! Der Film fängt an.');
  GK.after(1500,()=>{ root.querySelector('.ki').classList.add('open'); DW.sfx('whoosh'); musicStart(); });
  GK.after(2900,countdown);
}
function fit(){
  const box=root&&root.querySelector('#kiBox'); if(!box) return; const main=root.querySelector('.ki-main');
  const W=main.clientWidth-8, H=main.clientHeight-root.querySelector('#kiCap').offsetHeight-root.querySelector('#kiTime').offsetHeight-root.querySelector('.ki-ctrl').offsetHeight-30;
  let w=Math.min(W,1100), h=w/1.5; if(h>H){ h=Math.max(120,H); w=h*1.5; }
  box.style.width=Math.round(w)+'px'; box.style.height=Math.round(h)+'px';
}
function countdown(){
  const L=root.querySelector('#kiLeader'), sp=L.querySelector('span'); L.hidden=false; let n=3;
  const tick=()=>{ if(n===0){ L.hidden=true; playing=true; setPlayIcon(); playScene(0); return; } sp.textContent=n; L.classList.remove('go'); void L.offsetWidth; L.classList.add('go'); DW.sfx('click'); n--; GK.after(850,tick); };
  tick();
}
function setPlayIcon(){ const b=root.querySelector('#kiPlay'); if(!b) return; b.innerHTML=ART.icon(playing?'ki_pause':'ki_play'); b.setAttribute('aria-label',playing?'Pause':'Abspielen'); b.classList.toggle('paused',!playing&&cur>=0&&!ended); }
function capShow(){ const c=root.querySelector('#kiCap'); c.classList.toggle('off',!subs); root.querySelector('#kiCC').classList.toggle('on',subs); c.textContent=subs&&cur>=0?SCENES[cur].t:''; }
const T=o=>`scale(${o.s}) translate(${o.x}%,${o.y}%)`;
function showImage(i){
  const A=DW.$$('.ki-img',root); const nxt=A[layer^1], old=A[layer]; layer^=1;
  nxt.getAnimations().forEach(a=>a.cancel()); nxt.src=IMG(i); nxt.style.transform=T(SCENES[i].a);
  const go=()=>{ if(!root) return; nxt.classList.add('on'); old.classList.remove('on');
    try{ kb=nxt.animate([{transform:T(SCENES[i].a)},{transform:T(SCENES[i].b)}],{duration:MIN_MS+4000,fill:'forwards',easing:'ease-in-out'}); if(!playing) kb.pause(); }catch(e){ kb=null; } };
  if(nxt.decode) nxt.decode().then(go,go); else go();
  // Vorladen
  if(i+1<SCENES.length){ const p=new Image(); p.src=IMG(i+1); }
}
function mark(i){ DW.$$('.ki-dot',root).forEach((d,k)=>{ d.classList.toggle('seen',k<i); d.classList.toggle('now',k===i); }); }
async function playScene(i){
  if(!root) return; const t=++tok; cur=i; ended=false; showImage(i); mark(i); capShow(); setPlayIcon();
  GK.idle.set(()=>GK.pulse(root.querySelector(playing?'#kiPop':'#kiPlay')),null);
  await Promise.all([narrate(SCENES[i].t),wait(MIN_MS)]);
  if(t!==tok||!playing||!root) return;
  await wait(500); if(t!==tok||!playing) return;
  if(i+1<SCENES.length) playScene(i+1); else finale();
}
async function resumeScene(){ const t=++tok, i=cur; await Promise.all([narrate(SCENES[i].t),wait(MIN_MS*.6)]); if(t!==tok||!playing) return; await wait(400); if(t!==tok||!playing) return; if(i+1<SCENES.length) playScene(i+1); else finale(); }
function go(i){ if(ended){ root.querySelector('.ki').classList.add('open'); root.querySelector('#kiEnd').hidden=true; ended=false; }
  if(playing) playScene(i); else { tok++; cur=i; showImage(i); mark(i); capShow(); setPlayIcon(); DW.say(SCENES[i].t); } }
function pause(){ playing=false; tok++; DW.hush(); if(kb) try{kb.pause();}catch(e){} musicPause(); setPlayIcon(); DW.sfx('click'); }
function resume(){ playing=true; if(kb) try{kb.play();}catch(e){} musicStart(); musicVol(MUSIC_VOL); setPlayIcon(); resumeScene(); }
function replay(){ ended=false; root.querySelector('#kiEnd').hidden=true; const e=root.querySelector('.ki-endwrap'); if(e) e.remove(); root.querySelector('.ki').classList.add('open'); playing=true; musicStart(); musicVol(MUSIC_VOL); playScene(0); }
function finale(){
  tok++; playing=false; ended=true; setPlayIcon(); mark(SCENES.length); musicVol(.1);
  root.querySelector('#kiEnd').hidden=false; GK.after(1600,()=>{ if(!root) return; root.querySelector('.ki').classList.remove('open'); DW.sfx('whoosh'); });
  DW.sfx('win');
  GK.after(2600,()=>{ if(!root||!ended) return;
    const b=DW.h(`<div class="ki-endwrap"><div class="ki-endbox card pop"><h2 class="hand">Das war der Film!</h2><div class="row" style="justify-content:center;flex-wrap:wrap">
      <button class="btn big go" id="kiQuiz" type="button">${ART.icon('stern',36)}Zum Film-Quiz</button>
      <button class="btn big ghost" id="kiAgain" type="button">${ART.icon('film',36)}Nochmal ansehen</button></div></div></div>`);
    root.querySelector('.ki').appendChild(b);
    b.querySelector('#kiQuiz').onclick=()=>{ DW.sfx('pop'); quiz(); };
    b.querySelector('#kiAgain').onclick=()=>{ DW.sfx('pop'); replay(); };
    DW.say('Das war der Film! Weißt du noch, was der Spinosaurus erlebt hat? Komm, wir machen ein kleines Quiz!');
    GK.idle.set(()=>GK.pulse(b.querySelector('#kiQuiz')),()=>DW.say('Tippe auf: Zum Film-Quiz!'));
  });
}
/* ---------- Popcorn ---------- */
function popcorn(){
  const hall=root.querySelector('.ki'), btn=root.querySelector('#kiPop'); popN++;
  const h=hall.getBoundingClientRect(), r=btn.getBoundingClientRect(); const x0=r.left-h.left+r.width/2, y0=r.top-h.top+10;
  btn.classList.remove('gk-good'); void btn.offsetWidth; btn.classList.add('gk-good');
  for(let k=0;k<9;k++){ const p=document.createElement('span'); p.className='ki-pop'; p.style.left=x0+'px'; p.style.top=y0+'px'; hall.appendChild(p);
    const dx=DW.rand(-160,160), up=DW.rand(90,220), fall=DW.rand(80,200), rot=DW.rand(-400,400);
    try{ p.animate([{transform:'translate(0,0) rotate(0) scale(.4)'},{transform:`translate(${dx*.6}px,${-up}px) rotate(${rot/2}deg) scale(1)`,offset:.45},{transform:`translate(${dx}px,${fall}px) rotate(${rot}deg) scale(.9)`,opacity:0}],{duration:DW.rand(900,1400),easing:'cubic-bezier(.2,.6,.4,1)',fill:'forwards'}); }catch(e){}
    GK.after(1500,()=>p.remove()); if(k<4) GK.after(k*70,()=>DW.sfx('pop')); }
  const me=root.querySelector('.ki-me'); if(me){ me.classList.remove('munch'); void me.offsetWidth; me.classList.add('munch'); GK.after(500,()=>DW.sfx('chew')); }
  if(popN===1&&!playing&&!ended&&cur<0) DW.say('Popcorn! Lecker.');
}

/* ---------- Quiz ---------- */
function quiz(){
  playing=false; tok++; musicVol(.12); GK.idle.stop();
  const qs=[QUIZ[0]].concat(GK.sample(QUIZ.slice(1),2)); let qi=0, miss=0;
  const n=lv===1?2:3;
  const ov=DW.h(`<div class="ki-quiz fill"><div class="ki-qin"></div></div>`); root.querySelector('.ki').appendChild(ov);
  const pic=c=>c.img!=null?`<img class="ki-qimg" src="${IMG(c.img)}" alt="">`:c.an?GK.img(c.an,{mood:'happy'}):GK.icon(c.ic);
  function ask(){
    if(qi>=qs.length) return end();
    const q=qs[qi], ch=DW.shuffle(q.ch.slice(0,n).map((c,k)=>({...c,ok:k===0})));
    ov.querySelector('.ki-qin').innerHTML=`${GK.progress(qi,qs.length)}<div class="ki-qq card"><h2 class="hand">${q.q}</h2><button class="ibtn" id="kiQs" type="button" aria-label="Vorlesen">${ART.icon('lautsprecher')}</button></div>
      <div class="gk-choices ki-qch">${ch.map((c,k)=>`<button class="gk-choice" data-k="${k}" type="button">${pic(c)}<b>${c.n}</b></button>`).join('')}</div>`;
    const say=()=>DW.say(q.q+' '+ch.map(c=>c.n).join('? Oder ')+'?');
    ov.querySelector('#kiQs').onclick=say; say();
    const right=ov.querySelector(`.gk-choice[data-k="${ch.findIndex(c=>c.ok)}"]`);
    GK.idle.set(()=>GK.pulse(ov.querySelector('.gk-choice:not(.out)')),()=>DW.say(q.hint));
    DW.$$('.gk-choice',ov).forEach(b=>b.onclick=()=>{ const c=ch[+b.dataset.k];
      if(c.ok){ GK.ok(b); GK.idle.stop(); DW.$$('.gk-choice',ov).forEach(x=>x.onclick=null); DW.confetti(25); qi++; let went=false; const go=()=>{ if(went||!ov.isConnected) return; went=true; ask(); }; DW.say(q.yes).then(()=>GK.after(500,go)); GK.after(1800+q.yes.length*85,go); }
      else { miss++; b.classList.add('out'); GK.no(b,'Hm, noch nicht. '+q.hint); if(miss>=3) GK.pulse(right); } });
  }
  function end(){ ov.remove(); musicVol(.16);
    GK.finish(root,{id:ID,stars:miss===0?3:miss<=2?2:1,art:`<img src="${IMG(19)}" alt="" style="border-radius:16px;height:100%;width:auto">`,title:'Film-Profi!',
      say:'Super! Du hast gut aufgepasst. Spinosaurus: der Fischjäger mit dem Segel!',again:()=>{ musicPause(); cinema(); }});
    const home=root.querySelector('.gk-home'); if(home){ const h0=home.onclick; home.onclick=()=>{ musicPause(); h0(); }; } }
  ask();
}

function unmount(){ tok++; playing=false; clearInterval(volT); try{ if(music){ music.pause(); music.removeAttribute('src'); music.load(); } }catch(e){} music=null; kb=null; cur=-1; root=null; }
if(window.DW_DEBUG) window.__kinoJump=i=>{ if(root) playScene(i); };
if(window.DW_DEBUG) window.__kinoEnd=()=>{ if(root) finale(); };
DW.stations[ID]={title:'Urzeit-Kino',mount,unmount};
})();
