/* =====================================================================
   DINO-INSELWELT · app.js — Start, Inselkarte-Oberfläche, Rucksack, Eltern
   ===================================================================== */
(function(){
"use strict";
const $=DW.$, S=DW.state;
document.getElementById('paper').style.backgroundImage=`url(${DW.paperURL})`;
document.querySelector('#station .paperbg').style.backgroundImage=`url(${DW.paperURL})`;

/* ---------------- Symbole in Knöpfe ---------------- */
$('#btnBag').innerHTML=ART.icon('rucksack');
$('#btnParents').innerHTML=ART.icon('zahnrad');
$('#btnSay').innerHTML=ART.icon('lautsprecher');
$('#homeIcon').innerHTML=ART.icon('karte',40);
const PIP=ART.animal('protoceratops',{shadow:false,mood:'happy'});
$('#bubbleWho').innerHTML=window.QUEST?QUEST.pipSVG(QUEST.stage(),{mood:'happy'}):PIP;
function soundIcon(){ $('#btnSound').innerHTML=ART.icon(S.settings.sound?'lautsprecher':'stumm'); $('#startSound').innerHTML=(S.settings.sound?ART.icon('lautsprecher',34)+'Ton ist an':ART.icon('stumm',34)+'Ton ist aus'); }
soundIcon();
function starsHud(){ $('#hudStars').innerHTML=ART.icon('stern')+DW.totalStars(); }
starsHud(); DW.on('stars',starsHud);

/* ---------------- Sprechblase ---------------- */
let bubbleT=null;
function bubble(text,ms=7000){ const b=$('#bubble'); $('#bubbleText').textContent=text; b.classList.remove('hide'); clearTimeout(bubbleT); if(ms) bubbleT=setTimeout(()=>b.classList.add('hide'),ms); }
DW.on('say',t=>{ if(!DW.current) bubble(t,Math.max(5000,t.length*85)); });
$('#bubble').addEventListener('click',()=>DW.repeat());

/* ---------------- Start: Profile („Wer spielt?“), Figuren, eigene Figur ---------------- */
const esc=t=>String(t==null?'':t).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
const nameCase=t=>String(t||'').toLocaleLowerCase('de-DE').replace(/(^|[\s\-'])(\S)/g,(m,a,b)=>a+b.toLocaleUpperCase('de-DE'));
const cleanName=t=>String(t||'').replace(/[^\p{L}\s\-']/gu,'').replace(/\s+/g,' ').replace(/^\s+/,'').slice(0,14);
const figImg=(a,cls='',o={})=>`<img class="${cls}" src="${DW.svgURL(ART.avatarFront(a,o))}" alt="" draggable="false">`;
const PAGES=['startMain','whoPage','makerPage'];
function page(id){ PAGES.forEach(p=>{ $('#'+p).hidden=p!==id; }); $('#start').scrollTop=0; $('#start').dataset.page=id; }
function showStart(pg){ DW.hush(); $('#world').hidden=true; $('#station').hidden=true; $('#spot').hidden=true; $('#start').hidden=false;
  if(pg==='who') buildWho(); else if(pg==='maker') openMaker(); else buildStart(); }
DW.showStart=showStart;
/* Profil wechseln: vor dem ersten Kartenstart direkt, danach per Neuladen (Karte, Nebel, Position gehören zum Profil) */
function switchProfile(id,after,next='main'){
  if(id===DW.profileId()){ after&&after(); return; }
  if(window.__worldInit){ DW.useProfile(id); try{sessionStorage.setItem('dw.next',next);}catch(e){} location.reload(); return; }
  DW.useProfile(id); chosen=initialChoice(); after&&after();
}
const ownFig=()=>S.own&&ART.avatarById(S.own.avatar);
function initialChoice(){ if(S.own&&S.avatar&&S.own.avatar===S.avatar&&(S.name||'')===(S.own.name||'')) return 'own'; return S.avatar&&ART.PRESETS.includes(S.avatar)?S.avatar:(S.own?'own':null); }
let chosen=initialChoice();

function buildStart(){
  page('startMain');
  $('#startArt').innerHTML=DW.animalSVG('brachiosaurus')+DW.animalSVG('trex',{mood:'happy'})+DW.animalSVG('triceratops');
  const box=$('#avatarPick'); box.innerHTML='';
  ART.PRESETS.map(ART.avatarById).forEach(a=>{
    const b=DW.h(`<button type="button" class="${a.id===chosen?'sel':''}" data-id="${a.id}" aria-label="${a.name}, ${a.role}">${figImg(a,'pf-img')}<b>${a.name}</b><small>${a.role}</small></button>`);
    b.onclick=()=>{ chosen=a.id; DW.sfx('pop'); DW.say('Hallo '+a.name+'!'); DW.$$('#avatarPick button').forEach(x=>x.classList.remove('sel')); b.classList.add('sel','pop'); setTimeout(()=>b.classList.remove('pop'),500); updateGo(); };
    box.appendChild(b); });
  const of=ownFig();
  const own=DW.h(`<button type="button" class="pf-own ${chosen==='own'?'sel':''}" data-id="own" aria-label="Eigene Figur">
     ${of?figImg(of,'pf-img')+`<b>${esc(nameCase(S.own.name)||of.name)}</b><small>Meine Figur</small><span class="pf-edit" aria-hidden="true">${ART.icon('stift')}</span>`
         :`<span class="pf-plus">${ART.icon('stift')}<i>+</i></span><b>Eigene Figur</b><small>selbst gestalten</small>`}</button>`);
  own.onclick=()=>{ DW.sfx('pop'); if(of&&chosen!=='own'){ chosen='own'; DW.$$('#avatarPick button').forEach(x=>x.classList.toggle('sel',x===own)); updateGo(); DW.figSay('hallo',{now:true,fig:of,voice:S.own.figVoice||undefined}); } else openMaker(); };
  box.appendChild(own);
  whoChip(); updateGo();
}
function whoChip(){ const c=$('#startWho'), a=DW.figureOf(S);
  c.innerHTML=`${a?figImg(a,'wc-img'):`<span class="wc-img">${ART.icon('kind')}</span>`}<span>${DW.displayName(S)?`<b>${esc(DW.displayName(S))}</b><small>Wer spielt?</small>`:'<b>Wer spielt?</b>'}</span>`; }
$('#startWho').onclick=()=>{ DW.sfx('whoosh'); buildWho(); };
function updateGo(){ $('#startGo').innerHTML=ART.icon('karte',40)+(S.started?'Weiter forschen':'Los geht’s!'); $('#startGo').disabled=!chosen; $('#startGo').style.opacity=chosen?1:.5; }
function applyChoice(){ if(chosen==='own'&&S.own){ S.avatar=S.own.avatar; S.name=S.own.name||''; S.figVoice=S.own.figVoice||null; } else if(chosen){ S.avatar=chosen; S.name=''; S.figVoice=null; } }
/* Pip begrüßt das Kind mit Namen (Aufnahmen „Hallo Mia/Ben/Ayo/Lina!“ greifen automatisch, sonst Gerätestimme) */
async function pipHello(first){
  const n=DW.displayName(S);
  if(n) await DW.say('Hallo '+n+'!');
  if(first) return DW.say((n?'':'Hallo! ')+'Ich bin Pip, dein kleiner Dino-Freund. Willkommen auf der Dino-Insel! Tippe auf ein rundes Schild, dann laufen wir zusammen hin.');
  return DW.say('Schön, dass du wieder da bist! Wohin wollen wir heute?');
}
function enterWorld(){
  const first=!S.started; applyChoice(); S.started=true; DW.save();
  /* Geführte Tour (js/tour.js): 'new' = Pip bietet sie gleich an (erstes Mal für dieses Kind), 'run' = sie läuft schon und geht weiter, null = keine.
     Solange die Tour dran ist, warten Pips übliche Begrüßung und die Ankündigung der Aufträge – nichts redet durcheinander. */
  const tour=window.TOUR?TOUR.plan():null;
  $('#startGo').innerHTML='Die Insel wird gemalt …';
  setTimeout(()=>{ $('#start').hidden=true; $('#world').hidden=false;
  if(!window.__worldInit){ WORLD.init(); window.__worldInit=true; } else WORLD.setAvatar(); hudAvatar(); updateGo();
  if(window.QUEST){ QUEST.setupHud(); QUEST.applyPip(); } },40);
  DW.sfx('whoosh');
  setTimeout(()=>{
    if(tour==='run') return;
    const hi=DW.figSay('los',{now:true}).then(()=>tour==='new'?TOUR.offer({mode:first?'first':'back'}):pipHello(first));
    hi.then(how=>{ if(how==='stopped') return; const quests=()=>{ if(window.QUEST) setTimeout(()=>QUEST.enterWorld(),700); };
      /* ohne Tour gestartet: wenigstens der eine wichtige Tipp (Aufnahme vorhanden) */
      if(tour==='new'&&how==='skipped'&&first) DW.say('Tippe auf ein rundes Schild, dann laufen wir zusammen hin.',{queue:true}).then(quests); else quests(); });
  },600);
}
$('#startGo').onclick=()=>{
  if(!chosen){ DW.say('Tippe zuerst auf eine Forscherin oder einen Forscher.'); return; }
  enterWorld();
};
$('#startSound').onclick=()=>{S.settings.sound=!S.settings.sound;DW.save();soundIcon();DW.sfx('pop');};

/* ---- „Wer spielt?“ ---- */
function buildWho(){
  page('whoPage'); const W=$('#whoPage'); const list=DW.profiles();
  W.innerHTML=`<div class="who-art">${window.QUEST&&QUEST.pipSVG?QUEST.pipSVG(QUEST.stage(),{mood:'happy'}):PIP}</div><h1>Wer spielt?</h1><p class="sub">Tippe auf dein Bild.</p>
   <div class="who-grid">${list.map(p=>{ const a=ART.avatarById(p.avatar);
     return `<button type="button" class="who-tile ${p.active?'cur':''}" data-id="${p.id}" aria-label="${esc(p.display||'Neues Kind')}">
       ${a?figImg(a,'who-img'):`<span class="who-img who-q">${ART.icon('kind')}</span>`}
       <b>${esc(p.display||'Neu')}</b><span class="who-st">${ART.icon('stern')}${p.stars}</span></button>`;}).join('')}
     <button type="button" class="who-tile who-add" id="whoAdd" aria-label="Neues Kind"><span class="who-img who-q"><i>+</i></span><b>Neu</b><span class="who-st">&nbsp;</span></button></div>
   <div class="who-foot"><button class="ibtn" id="whoParents" type="button" aria-label="Für Erwachsene (gedrückt halten)">${ART.icon('zahnrad')}</button></div>`;
  DW.$$('.who-tile[data-id]',W).forEach(b=>b.onclick=()=>{ const id=b.dataset.id; DW.sfx('pop'); b.classList.add('pop');
    switchProfile(id,()=>{ buildStart(); if(!DW.figureOf(S)) return; DW.hush(); DW.figSay('hallo',{now:true}).then(()=>{ if(S.started&&$('#start').dataset.page==='startMain') DW.say('Hallo '+DW.displayName(S)+'!'); }); }); });
  $('#whoAdd').onclick=()=>{ DW.sfx('pop'); const id=DW.addProfile(); switchProfile(id,()=>openMaker(true),'maker'); };
  DW.holdButton($('#whoParents'),1500,parents);
  $('#whoParents').addEventListener('click',()=>{ if(!$('#overlay').hidden) return; DW.say('Für Erwachsene: Den Knopf lange gedrückt halten.'); });
  DW.say('Wer spielt? Tippe auf dein Bild.');
}

/* ---- Eigene Figur: 1 Figur · 2 Name · 3 Stimme ---- */
const KEYS='ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜß'.split('');
const SAYKEY={'ß':'scharfes S','J':'Jot','Y':'Ypsilon','Q':'Ku','V':'Vau','C':'Ze','-':'Strich'};
const MK={step:1,fig:null,name:'',voice:null,isNew:false};
function openMaker(isNew){
  const o=S.own||{}; MK.isNew=!!isNew; MK.step=1; MK.fig=o.avatar||S.avatar||null; MK.name=o.name||''; MK.voice=o.figVoice||null;
  page('makerPage'); const M=$('#makerPage');
  M.innerHTML=`<div class="mk-head">
     <button class="ibtn" id="mkBack" type="button" aria-label="Zurück">${ART.icon('pfeil_l')}</button>
     <div class="mk-steps">${[['1','kind','Figur'],['2','stift','Name'],['3','lautsprecher','Stimme']].map(([n,ic,t])=>`<button type="button" class="mk-step" data-s="${n}" aria-label="${t}">${ART.icon(ic)}<small>${t}</small></button>`).join('')}</div>
     <button class="ibtn" id="mkSay" type="button" aria-label="Vorlesen">${ART.icon('lautsprecher')}</button></div>
   <div class="mk-body" id="mkBody"></div>`;
  $('#mkBack').onclick=()=>{ DW.sfx('tap'); if(MK.step>1) mkStep(MK.step-1); else if(MK.isNew&&!S.own&&!S.avatar&&!S.started&&DW.profiles().length>1){ const id=DW.profileId(); DW.deleteProfile(id); chosen=initialChoice(); buildWho(); } else buildStart(); };
  $('#mkSay').onclick=()=>DW.repeat();
  DW.$$('.mk-step',M).forEach(b=>b.onclick=()=>{ const s=+b.dataset.s; if(s>1&&!MK.fig){ DW.sfx('no'); DW.say('Such dir zuerst eine Figur aus!'); return; } DW.sfx('tap'); mkStep(s); });
  mkStep(1);
}
const mkFig=()=>ART.avatarById(MK.fig);
const mkVoice=()=>MK.voice||({f:'w',m:'m'}[(mkFig()||{}).g]||'n');
function mkStep(n){
  MK.step=n; const B=$('#mkBody'); DW.$$('.mk-step').forEach(b=>{ b.classList.toggle('on',+b.dataset.s===n); b.classList.toggle('done',+b.dataset.s<n); });
  if(n===1){
    B.innerHTML=`<h2 class="mk-t">Such dir eine Figur aus!</h2><div class="mk-figs">${ART.AVATARS.map(a=>`<button type="button" class="mk-fig ${a.id===MK.fig?'sel':''}" data-id="${a.id}" aria-label="${a.name}">${figImg(a)}</button>`).join('')}</div>
      <div class="mk-nav"><button class="btn big go" id="mkNext" type="button">${ART.icon('pfeil_r',40)}Weiter</button></div>`;
    DW.$$('.mk-fig',B).forEach(b=>b.onclick=()=>{ MK.fig=b.dataset.id; DW.sfx('pop'); DW.$$('.mk-fig',B).forEach(x=>x.classList.toggle('sel',x===b)); b.classList.add('pop'); setTimeout(()=>b.classList.remove('pop'),450);
      DW.hush(); DW.figSay('hallo',{now:true,fig:mkFig(),voice:mkVoice()}); mkNext(); });
    $('#mkNext').onclick=()=>{ if(!MK.fig){ DW.sfx('no'); DW.say('Such dir zuerst eine Figur aus!'); return; } DW.sfx('pop'); mkStep(2); };
    mkNext(); DW.say('Such dir eine Figur aus!');
  }
  if(n===2){
    B.innerHTML=`<h2 class="mk-t">Wie heißt du?</h2>
      <div class="mk-namerow">${figImg(mkFig(),'mk-mini')}<input id="mkName" class="mk-name" type="text" readonly inputmode="none" autocomplete="off" autocapitalize="words" spellcheck="false" maxlength="14" aria-label="Name" value="${esc(nameCase(MK.name))}" placeholder="…">
        <button class="ibtn" id="mkDel" type="button" aria-label="Buchstabe löschen"><svg viewBox="0 0 64 64" width="40" height="40"><path d="M22 14h32v36H22L6 32z" fill="#e6a08e" stroke="#4a3b2a" stroke-width="2" stroke-linejoin="round"/><path d="M30 24l14 16M44 24L30 40" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg></button></div>
      <div class="mk-keys">${KEYS.map(k=>`<button type="button" class="mk-key" data-k="${k}">${k}</button>`).join('')}</div>
      <div class="mk-nav"><button class="btn ghost" id="mkKbd" type="button"><svg viewBox="0 0 64 64" width="34" height="34"><rect x="4" y="16" width="56" height="34" rx="6" fill="#fbf8f0" stroke="#4a3b2a" stroke-width="2.5"/>${[0,1,2,3,4,5].map(i=>`<rect x="${10+i*8}" y="22" width="6" height="6" rx="1.5" fill="#8a7e6c"/><rect x="${10+i*8}" y="31" width="6" height="6" rx="1.5" fill="#8a7e6c"/>`).join('')}<rect x="18" y="40" width="28" height="5" rx="2" fill="#8a7e6c"/></svg>Tastatur</button>
        <button class="btn ghost" id="mkSkip" type="button">Ohne Namen</button>
        <button class="btn big go" id="mkNext" type="button">${ART.icon('pfeil_r',40)}Weiter</button></div>`;
    const inp=$('#mkName');
    const sync=()=>{ inp.value=nameCase(MK.name); mkNext(); };
    DW.$$('.mk-key',B).forEach(b=>b.onclick=()=>{ const k=b.dataset.k; if(MK.name.length>=14){ DW.sfx('no'); return; }
      MK.name=cleanName(MK.name+(k==='ß'?'ß':k.toLocaleLowerCase('de-DE'))); DW.sfx('tap'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); b.onanimationend=()=>b.classList.remove('pop'); sync(); DW.say(SAYKEY[k]||k); if(!inp.readOnly) inp.focus({preventScroll:true}); });
    $('#mkDel').onclick=()=>{ MK.name=MK.name.slice(0,-1); DW.sfx('pop'); sync(); if(!inp.readOnly) inp.focus({preventScroll:true}); };
    inp.onclick=()=>{ if(inp.readOnly&&MK.name) DW.say(nameCase(MK.name)); };
    inp.oninput=()=>{ MK.name=cleanName(inp.value); const v=nameCase(MK.name); if(inp.value!==v){ const p=inp.selectionStart; inp.value=v; try{inp.setSelectionRange(p,p);}catch(e){} } mkNext(); };
    inp.onkeydown=e=>{ if(e.key==='Enter'){ inp.blur(); $('#mkNext').click(); } };
    $('#mkKbd').onclick=()=>{ DW.sfx('tap'); inp.readOnly=false; inp.setAttribute('inputmode','text'); inp.focus(); try{inp.setSelectionRange(inp.value.length,inp.value.length);}catch(e){} };
    /* Computer mit Maus: Namensfeld gleich bereit für die echte Tastatur (Umlaute, Eingabehilfen). Touch: erst über „Tastatur“. */
    if(matchMedia('(pointer:fine)').matches&&!matchMedia('(pointer:coarse)').matches){ inp.readOnly=false; inp.setAttribute('inputmode','text'); setTimeout(()=>{ try{inp.focus({preventScroll:true});}catch(e){} },60); }
    $('#mkSkip').onclick=()=>{ MK.name=''; DW.sfx('pop'); mkStep(3); };
    $('#mkNext').onclick=()=>{ DW.sfx('pop'); if(MK.name) DW.say(nameCase(MK.name)+'!'); mkStep(3); };
    mkNext(); DW.say('Wie heißt du? Tippe die Buchstaben. Du kannst das auch überspringen.');
  }
  if(n===3){
    const a=mkFig(), cur=mkVoice();
    B.innerHTML=`<h2 class="mk-t">Wie klingt deine Figur?</h2>
      <div class="mk-voices">${DW.VOICES.map(v=>`<button type="button" class="mk-voice ${v.id===cur?'sel':''}" data-v="${v.id}" aria-label="Stimme ${v.n}">
        ${figImg(a,'mk-vfig')}<svg class="mk-wave" viewBox="0 0 120 40" aria-hidden="true"><path d="${wave(v.id)}" fill="none" stroke="${{w:'#c8553d',m:'#3b6f8a',n:'#7fa66a'}[v.id]}" stroke-width="4" stroke-linecap="round"/></svg><b>${v.n}</b></button>`).join('')}</div>
      <div class="mk-nav"><button class="btn big go" id="mkDone" type="button">${ART.icon('check',40)}Fertig!</button></div>`;
    DW.$$('.mk-voice',B).forEach(b=>b.onclick=()=>{ MK.voice=b.dataset.v; DW.sfx('tap'); DW.$$('.mk-voice',B).forEach(x=>x.classList.toggle('sel',x===b)); b.classList.add('pop'); setTimeout(()=>b.classList.remove('pop'),450);
      DW.hush(); DW.figSay({t:'Hallo! Los geht’s!'},{now:true,fig:a,voice:MK.voice}); });
    $('#mkDone').onclick=()=>{ DW.sfx('win'); S.own={avatar:MK.fig,name:nameCase(MK.name).trim(),figVoice:mkVoice()}; chosen='own'; applyChoice(); DW.save();
      buildStart(); const n=DW.displayName(S); DW.figSay('hallo',{now:true}).then(()=>{ if(n) DW.say('Hallo '+n+'!'); }); };
    DW.say('Wie klingt deine Figur? Tippe auf eine Stimme.');
  }
}
function mkNext(){ const b=$('#mkNext'); if(b) b.classList.toggle('gk-glow',MK.step===1?!!MK.fig:MK.name.length>0); }
function wave(v){ const f={w:4.5,m:1.6,n:2.8}[v], amp={w:9,m:15,n:12}[v]; let d='M4 20'; for(let x=4;x<=116;x+=3) d+=`L${x} ${(20+Math.sin((x-4)/112*Math.PI*2*f)*amp*Math.sin((x-4)/112*Math.PI)).toFixed(1)}`; return d; }
/* Tastatur am Computer: Buchstaben direkt tippen, auch ohne Fokus */
document.addEventListener('keydown',e=>{ if($('#start').hidden||$('#makerPage').hidden||MK.step!==2) return; const inp=$('#mkName'); if(!inp||document.activeElement===inp&&!inp.readOnly) return;
  if(e.ctrlKey||e.metaKey||e.altKey) return;
  if(e.key==='Backspace'){ e.preventDefault(); $('#mkDel').click(); return; }
  if(e.key==='Enter'){ e.preventDefault(); $('#mkNext').click(); return; }
  if(e.key.length===1&&/[\p{L}\-' ]/u.test(e.key)){ e.preventDefault(); if(MK.name.length>=14) return; MK.name=cleanName(MK.name+e.key.toLocaleLowerCase('de-DE')); inp.value=nameCase(MK.name); mkNext(); DW.sfx('tap'); } });

/* Erster Bildschirm: mehrere Profile → „Wer spielt?“, sonst direkt die Figurenwahl */
(()=>{ let next=null; try{ next=sessionStorage.getItem('dw.next'); sessionStorage.removeItem('dw.next'); }catch(e){}
  if(next==='maker') openMaker(true); else if(next==='who'||(!next&&DW.profiles().length>1)) buildWho(); else buildStart(); })();

/* ---------------- Sprechblase der eigenen Figur ---------------- */
const figB=DW.h(`<div class="figbubble" aria-live="polite" hidden><span class="fb-av"></span><p></p></div>`); document.body.appendChild(figB);
let figBT=null;
DW.on('figsay',({text,fig})=>{ figB.querySelector('.fb-av').innerHTML=figImg(fig); figB.querySelector('p').textContent=text; figB.hidden=false;
  figB.classList.remove('in'); void figB.offsetWidth; figB.classList.add('in'); clearTimeout(figBT); figBT=setTimeout(()=>{figB.hidden=true;},Math.max(2200,text.length*110)); });
/* Die Figur spricht an passenden Stellen: Spiel geschafft (nach dem Erzähler) */
DW.on('gamefinish',()=>setTimeout(()=>DW.figSay('geschafft'),400));

/* ---------------- Inselkarte: Knöpfe ---------------- */
$('#btnSound').onclick=()=>{S.settings.sound=!S.settings.sound;DW.save();soundIcon();DW.sfx('pop');};
$('#btnZoomIn').onclick=()=>{WORLD.zoom(1.25);DW.sfx('tap');};
$('#btnZoomOut').onclick=()=>{WORLD.zoom(.8);DW.sfx('tap');};
$('#btnZoomIn').innerHTML='<span style="font:700 34px Andika">+</span>';
$('#btnZoomOut').innerHTML='<span style="font:700 34px Andika">−</span>';
$('#btnHome').onclick=()=>{DW.sfx('tap');DW.closeStation();};
function hudAvatar(){ const av=ART.AVATARS.find(a=>a.id===S.avatar)||ART.AVATARS[0]; $('#btnWhere').innerHTML=ART.avatar(av,{nohat:false}); }
$('#btnMap').innerHTML=ART.icon('karte');
$('#btnWhere').onclick=()=>{DW.sfx('tap');WORLD.whereAmI&&WORLD.whereAmI();DW.say('Hier bin ich!');};
$('#btnMap').onclick=()=>{DW.sfx('whoosh');WORLD.wholeMap&&WORLD.wholeMap();};
/* Hilfe („?“): Pip bietet die geführte Tour noch einmal an */
ART.ICONS.t_frage=`<circle cx="32" cy="32" r="25" fill="#f0c35a" stroke="#3d3226" stroke-width="1.6"/><path d="M23 25q0-10 9-10t9 9q0 5-5 8-4 3-4 7" stroke="#fffaf0" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="48.5" r="4" fill="#fffaf0"/>`;
{ const h=DW.h(`<button class="ibtn" id="btnHelp" type="button" aria-label="Hilfe: Pip zeigt dir alles noch einmal">${ART.icon('t_frage')}</button>`);
  $('#btnParents').parentNode.insertBefore(h,$('#btnParents'));
  h.onclick=()=>{ DW.sfx('pop'); if(window.TOUR) TOUR.offer({mode:'again'}); }; }

/* ---------------- Hintergrundmusik ---------------- */
const MUS=new Audio('assets/sounds/musik.mp3'); MUS.loop=true; MUS.preload='auto';
let musVol=0, duckUntil=0, musUnlocked=false, musGain=null;
const musOn=()=>S.settings.music!==false && !!S.settings.sound;
function musWanted(){ return musOn() && musUnlocked && !$('#world').hidden && !DW.current && !document.hidden; }
function musSet(v){ try{ if(musGain) musGain.gain.value=v; else MUS.volume=Math.max(0,Math.min(1,v)); }catch(e){} }
function musGraph(){ // iOS ignoriert audio.volume → über WebAudio regeln (nur über http/https, sonst CORS-Stille)
  if(musGain||!location.protocol.startsWith('http')) return;
  try{ const AC=new (window.AudioContext||window.webkitAudioContext)(); const src=AC.createMediaElementSource(MUS); musGain=AC.createGain(); musGain.gain.value=0; src.connect(musGain).connect(AC.destination); MUS.volume=1; DW._musAC=AC; }catch(e){ musGain=null; }
}
function musTick(){
  const want=musWanted(), target=want?(performance.now()<duckUntil?.07:.22):0;
  musVol+= (target-musVol)*.18; if(Math.abs(target-musVol)<.004) musVol=target; musSet(musVol);
  if(want&&MUS.paused){ const p=MUS.play(); if(p&&p.catch) p.catch(()=>{}); }
  if(!want&&musVol<=.005&&!MUS.paused) MUS.pause();
}
setInterval(musTick,100);
DW.on('say',t=>{ duckUntil=performance.now()+Math.max(1600,(t||'').length*75+700); });
DW.on('station',()=>setTimeout(musTick,0)); DW.on('world',()=>setTimeout(musTick,0));
document.addEventListener('pointerdown',()=>{ if(!musUnlocked){ musUnlocked=true; musGraph(); } if(DW._musAC&&DW._musAC.state==='suspended') DW._musAC.resume(); if(musWanted()&&MUS.paused){ const p=MUS.play(); if(p&&p.catch)p.catch(()=>{}); } },{capture:true});
function musicIcon(){ const on=S.settings.music!==false; $('#btnMusic').innerHTML=ART.icon('musik'); $('#btnMusic').classList.toggle('off',!on); $('#btnMusic').setAttribute('aria-pressed',on?'true':'false'); }
musicIcon();
$('#btnMusic').onclick=()=>{ S.settings.music=S.settings.music===false; DW.save(); musicIcon(); DW.sfx('pop'); musUnlocked=true; musGraph(); musTick(); };
DW.music={el:MUS,state:()=>({on:musOn(),wanted:musWanted(),paused:MUS.paused,vol:+musVol.toFixed(3)})};
$('#btnSay').onclick=()=>{DW.sfx('tap');DW.repeat();};

/* Ankunft an einer Station: Einladungskarte */
function spot(s){
  const sp=$('#spot'); const n=DW.state.stars[s.id]||0;
  sp.innerHTML=`<div class="art" style="background:${s.col}">${ART.icon(s.icon)}</div><h2>${s.n}</h2>
   ${s.sea?`<p class="w2-boat" title="Nur mit dem Boot">${ART.icon('anker')}${ART.icon('boot')}<span>Nur mit dem Boot</span></p>`:''}<p>${s.say}</p>
   <div class="row"><button class="btn big go" id="spotGo" type="button">${ART.icon('pfeil_r',36)}Hinein!</button>
   <button class="ibtn" id="spotSay" type="button" aria-label="Vorlesen">${ART.icon('lautsprecher')}</button>
   <button class="ibtn" id="spotX" type="button" aria-label="Schließen">${ART.icon('kreuz')}</button></div>
   ${n?`<p style="margin:12px 0 0">${ART.icon('stern',30).replace('<svg','<svg style="display:inline;vertical-align:middle"')} ${n} Sterne gesammelt</p>`:''}`;
  sp.hidden=false; sp.classList.remove('pop'); void sp.offsetWidth; sp.classList.add('pop');
  $('#spotGo').onclick=()=>{ const go=()=>{sp.hidden=true;DW.openStation(s.id);}; if(sp.dataset.going) return; sp.dataset.going='1';
    DW.hush(); DW.figSay('los',{now:true,cool:30000}).then(()=>{ delete sp.dataset.going; if(!sp.hidden) go(); }); };
  $('#spotSay').onclick=()=>DW.say(s.say);
  $('#spotX').onclick=()=>{sp.hidden=true;DW.sfx('tap');};
  DW.sfx('pop'); DW.figSay('was',{now:true,cool:60000}).then(()=>{ if(!sp.hidden&&!sp.dataset.going&&!(window.TOUR&&TOUR.mute('spot'))) DW.say(s.say); });
}
DW.on('arrive',s=>spot(s));
DW.on('closeSpot',()=>{$('#spot').hidden=true;});
DW.on('world',()=>{starsHud(); const s=WORLD.heroAtStation&&WORLD.heroAtStation(); setTimeout(()=>{ if(!DW.current&&!(window.QUEST&&QUEST.onWorld())&&!(window.TOUR&&TOUR.busy())){ const t=DW.pick(['Wohin geht’s als Nächstes?','Das war toll! Wollen wir noch woanders hin?','Tippe auf ein Schild, dann laufen wir hin.']); DW.say(t);} },500); });

/* ---------------- Rucksack (Sammlung) ---------------- */
$('#btnBag').onclick=()=>{DW.sfx('pop');openBag('tiere');};
function openBag(tab){
  const aCount=Object.keys(S.animals).length, fCount=Object.keys(S.finds).length, sCount=Object.keys(S.stickers).length;
  const m=DW.modal(`<h2>Mein Rucksack</h2>
   <div class="tabs"><button data-t="tiere">Tiere (${aCount}/${DATA.ANIMALS.length})</button><button data-t="funde">Funde (${fCount}/${DATA.FINDS.length})</button><button data-t="sticker">Sticker (${sCount}/${DATA.STICKERS.length})</button></div>
   <div id="bagBody"></div>`);
  const show=t=>{ DW.$$('.tabs button',m).forEach(b=>b.classList.toggle('on',b.dataset.t===t)); const body=m.querySelector('#bagBody');
    if(t==='tiere'){ body.innerHTML=`<p style="margin:0 0 10px;color:var(--ink2)">Tiere, die du entdeckt hast. Tippe eins an!</p><div class="grid">${DATA.ANIMALS.map(a=>`<button class="cell ${S.animals[a.id]?'':'no'}" data-id="${a.id}">${DW.animalImg(a.id,{shadow:false})}<b>${S.animals[a.id]?(a.short||a.n):'?'}</b></button>`).join('')}</div>`;
      DW.$$('.cell',body).forEach(c=>c.onclick=()=>{const a=DATA.animal(c.dataset.id); if(S.animals[a.id]) animalCard(a.id); else {DW.sfx('no');DW.say('Dieses Tier hast du noch nicht entdeckt. Vielleicht findest du es im Museum oder bei der Ausgrabung!');}}); }
    if(t==='funde'){ body.innerHTML=`<div class="grid">${DATA.FINDS.map(f=>`<button class="cell ${S.finds[f.id]?'':'no'}" data-id="${f.id}">${ART.icon(f.icon)}<b>${S.finds[f.id]?f.n+(S.finds[f.id]>1?' ×'+S.finds[f.id]:''):'?'}</b></button>`).join('')}</div>`;
      DW.$$('.cell',body).forEach(c=>c.onclick=()=>{const f=DATA.find(c.dataset.id); DW.say(S.finds[f.id]?f.n+'. '+f.say:'Diesen Fund hast du noch nicht. Grab weiter!');}); }
    if(t==='sticker'){ body.innerHTML=`<div class="grid">${DATA.STICKERS.map(s=>`<button class="cell ${S.stickers[s.id]?'':'no'}" data-id="${s.id}">${ART.icon(s.icon)}<b>${S.stickers[s.id]?s.n:'?'}</b></button>`).join('')}</div>`;
      DW.$$('.cell',body).forEach(c=>c.onclick=()=>{const s=DATA.sticker(c.dataset.id); DW.say(S.stickers[s.id]?'Sticker: '+s.n:'Diesen Sticker kannst du noch verdienen.');}); }
    DW.sfx('tap'); };
  DW.$$('.tabs button',m).forEach(b=>b.onclick=()=>show(b.dataset.t));
  show(tab);
}
/* Tier-Steckbrief (auch von Stationen aus nutzbar) */
function animalCard(id){
  DW.emit('animalcard',id);
  const a=DATA.animal(id), e=DATA.eraById(a.era)||{};
  const foods={fleisch:'Fleisch',pflanzen:'Pflanzen',alles:'fast alles',fisch:'Fisch',insekten:'Insekten'};
  const m=DW.modal(`<div style="display:flex;gap:18px;flex-wrap:wrap;align-items:center">
    <div style="flex:1 1 260px;min-width:220px">${DW.animalSVG(id,{mood:'happy'})}</div>
    <div style="flex:1 1 240px"><h2>${a.n}</h2>
     <p style="margin:6px 0 10px">${a.fact}</p>
     <p style="margin:0;line-height:1.8"><span class="pill" style="background:${e.col||'#eee'}">${e.n||''}</span>
     ${a.len?`<span class="pill">Größe: ${a.len}</span>`:''} ${a.place?`<span class="pill">Fundort: ${a.place}</span>`:''} <span class="pill">Futter: ${foods[a.food]||''}</span></p>
     <p style="margin-top:14px"><button class="btn" id="acSay">${ART.icon('lautsprecher',32)}Vorlesen</button></p></div></div>`);
  const txt=`${a.n}. ${a.fact} Er lebte in der Zeit ${e.n||''}.`;
  m.querySelector('#acSay').onclick=()=>DW.say(txt); DW.say(txt);
}
DW.animalCard=animalCard;

/* ---------------- Elternbereich ---------------- */
DW.holdButton($('#btnParents'),1500,parents);
$('#btnParents').addEventListener('click',()=>{ if(!$('#overlay').hidden) return; DW.say('Für Erwachsene: Den Knopf lange gedrückt halten.'); });
function parents(){
  const s=S.settings;
  const m=DW.modal(`<h2>Für Erwachsene</h2>
   <p style="margin:0 0 12px;color:var(--ink2)">Die Dino-Inselwelt verbindet DINOPEDIA, das Dino-Forscherbuch und den Plattentektonik-Globus. Alles läuft offline, ohne Konto, ohne Werbung. Der Spielstand bleibt nur auf diesem Gerät.</p>
   <div class="col" style="gap:12px">
    <label class="row"><input type="checkbox" id="pSound" ${s.sound?'checked':''} style="width:28px;height:28px"> Töne</label>
    <label class="row"><input type="checkbox" id="pVoice" ${s.voice?'checked':''} style="width:28px;height:28px"> Vorlesen (Sprachausgabe des Geräts)</label>
    <label class="row"><input type="checkbox" id="pAmb" ${s.ambience!==false?'checked':''} style="width:28px;height:28px"> Tageszeit &amp; Wetter auf der Karte (nach der Uhr des Geräts)</label>
    <label class="row">Vorlese-Tempo <input type="range" id="pRate" min=".7" max="1.2" step=".05" value="${s.rate}" style="flex:1"></label>
    <div class="row" style="flex-wrap:wrap"><button class="btn ghost" id="pAvatar">${ART.icon('rucksack',32)}Figur wechseln</button>
    <button class="btn ghost" id="pTour">${ART.icon('t_frage',32)}Tour noch einmal zeigen</button>
    <button class="btn warm" id="pReset">${ART.icon('kreuz',32)}Spielstand löschen</button></div>
    <p style="margin:0;font-size:15px;color:var(--ink2)">Gesammelt: ${Object.keys(S.animals).length} Tiere · ${Object.keys(S.finds).length} Funde · ${Object.keys(S.stickers).length} Sticker · ${DW.totalStars()} Sterne${window.QUEST?` · ${(S.quest&&S.quest.total)||0} Aufträge erledigt`:''}.<br>
    Pips Aufträge: jeden Tag drei kleine Aufgaben, ganz ohne Druck – nicht erledigte verfallen einfach, ohne Strafe.<br>
    Plattenmodell im Zeitportal: Merdith et al. (2021) / Müller et al. (2022), EarthByte/GPlates. Heutige Küsten, zurückgedreht – vereinfacht.</p>
    <section class="pp"><h3>Kinder &amp; Spielstände</h3>
     <p class="pp-note">Jedes Kind hat einen eigenen Spielstand mit Figur, Sternen, Sammlung und Bildern. „Spielstand löschen“ oben betrifft nur das aktive Kind.</p>
     <div class="pp-list" id="ppList"></div>
     <div class="row" style="flex-wrap:wrap;gap:10px"><button class="btn ghost" id="ppWho" type="button">${ART.icon('kind',32)}Wer spielt?</button><button class="btn ghost" id="ppNew" type="button"><b style="font-size:28px;line-height:0">+</b> Neues Kind</button></div>
    </section>
    <section class="pp"><h3>Sichern &amp; Wiederherstellen</h3>
     <p class="pp-note">Speichert die Spielstände als Datei (mit Fotos und Bildern aus dem Forscherbuch, Ausflug und Puzzle). Beim Laden kommen Kinder aus der Datei dazu; ein Kind, das es auf diesem Gerät schon gibt, wird nach Rückfrage auf den gesicherten Stand zurückgesetzt.</p>
     <div class="row" style="flex-wrap:wrap;gap:10px"><button class="btn sun" id="ppExpAll" type="button">${ART.icon('rucksack',32)}Alle sichern</button>
      <button class="btn ghost" id="ppImp" type="button">${ART.icon('kiste',32)}Sicherung laden …</button><input type="file" id="ppFile" accept=".json,application/json" hidden></div>
     <p class="pp-msg" id="ppMsg" role="status"></p>
     <p class="pp-hint"><b>Tipp für iPad/iPhone:</b> Safari kann Daten von Webseiten löschen, wenn die App 7 Tage lang nicht benutzt wurde. Über „Teilen → Zum Home-Bildschirm“ hinzugefügt, bleibt der Spielstand erhalten. Zur Sicherheit ab und zu „Alle sichern“ tippen.</p>
    </section>
   </div>`);
  m.classList.add('pp-modal');
  m.querySelector('#pSound').onchange=e=>{s.sound=e.target.checked;DW.save();soundIcon();};
  m.querySelector('#pVoice').onchange=e=>{s.voice=e.target.checked;DW.save();};
  m.querySelector('#pAmb').onchange=e=>{s.ambience=e.target.checked;DW.save();if(window.WORLD&&WORLD.setAmbience&&window.__worldInit)WORLD.setAmbience();};
  m.querySelector('#pRate').oninput=e=>{s.rate=+e.target.value;DW.save();};
  m.querySelector('#pRate').onchange=()=>DW.say('So schnell lese ich vor.');
  m.querySelector('#pAvatar').onclick=()=>{m.close();showStart('main');};
  /* Tour wiederholen: auf der Karte sofort (Pip fragt noch einmal), sonst beim nächsten Betreten der Karte */
  /* Das Zahnrad wird lange gedrückt. Beim Loslassen entsteht (Touch) noch ein Klick an der Stelle des Fingers – dort liegt jetzt dieses
     Fenster oder sein Hintergrund: Es ginge sofort wieder zu oder ein Knopf darin würde ausgelöst. Dieser eine Klick wird geschluckt;
     ab dem nächsten neuen Tipp (pointerdown) zählt alles wie gewohnt. */
  { const eat=e=>{ e.stopPropagation(); e.preventDefault(); }, off=()=>{ document.removeEventListener('click',eat,true); document.removeEventListener('pointerdown',off,true); };
    document.addEventListener('click',eat,true); document.addEventListener('pointerdown',off,true); }
  m.querySelector('#pTour').onclick=()=>{ if(!window.TOUR) return; m.close();
    if(window.__worldInit&&!$('#world').hidden&&!DW.current) TOUR.offer({mode:'again'});
    else { TOUR.forget(); DW.toast(ART.icon('t_frage'),'Tour','Pip zeigt beim nächsten Start alles noch einmal'); } };
  m.querySelector('#pReset').onclick=()=>{ if(confirm('Wirklich alles löschen? Alle Sterne, Tiere und Sticker gehen verloren.')){ DW.reset(); location.reload(); } };
  const msg=(t,ok)=>{ const e=m.querySelector('#ppMsg'); e.textContent=t; e.className='pp-msg '+(ok?'ok':'err'); };
  const stamp=()=>new Date().toISOString().slice(0,10);
  const fname=n=>'dino-inselwelt_'+String(n).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ß/g,'ss').replace(/[^A-Za-z0-9-]+/g,'-').replace(/^-|-$/g,'').toLowerCase()+'_'+stamp()+'.json';
  async function exp(ids,label){ msg('Wird gesichert …',true); try{ const o=await DW.exportProfiles(ids); DW.downloadJSON(o,fname(label)); const nImg=o.profiles.reduce((a,p)=>a+Object.keys(p.images||{}).length,0);
      msg(`Gesichert: ${o.profiles.length} ${o.profiles.length===1?'Kind':'Kinder'}${nImg?`, ${nImg} Bilder`:''}. Die Datei liegt jetzt im Download-Ordner.`,true); }catch(e){ msg('Sichern hat nicht geklappt.',false); } }
  function list(){ const L=m.querySelector('#ppList'); const ps=DW.profiles();
    L.innerHTML=ps.map(p=>{ const a=ART.avatarById(p.avatar); return `<div class="pp-row ${p.active?'cur':''}" data-id="${p.id}">
      ${a?figImg(a,'pp-av'):`<span class="pp-av">${ART.icon('kind')}</span>`}
      <div class="pp-who"><b>${esc(p.display||'Neu')}</b><small>${p.active?'spielt gerade · ':''}${p.stars} Sterne · ${p.animals} Tiere</small></div>
      <div class="pp-act">${p.active?'':`<button class="btn go pp-play" type="button">Spielen</button>`}
       <button class="btn ghost pp-exp" type="button" aria-label="Sichern">${ART.icon('rucksack',28)}<span>Sichern</span></button>
       <button class="btn warm pp-del" type="button" aria-label="Löschen (gedrückt halten)">${ART.icon('kreuz',28)}</button></div></div>`; }).join('');
    DW.$$('.pp-row',L).forEach(r=>{ const id=r.dataset.id, p=ps.find(x=>x.id===id);
      r.querySelector('.pp-play')?.addEventListener('click',()=>{ m.close(); switchProfile(id,()=>showStart('main')); });
      r.querySelector('.pp-exp').onclick=()=>exp([id],p.display||'kind');
      const del=r.querySelector('.pp-del');
      del.addEventListener('click',()=>msg('Zum Löschen den roten Knopf 2 Sekunden gedrückt halten.',false));
      DW.holdButton(del,2000,()=>{ if(!confirm(`Spielstand von „${p.display||'Neu'}“ wirklich löschen? Sterne, Sammlung und Bilder dieses Kindes gehen verloren.`)) return;
        const wasActive=p.active; DW.deleteProfile(id);
        if(wasActive&&window.__worldInit){ try{sessionStorage.setItem('dw.next','who');}catch(e){} location.reload(); return; }
        if(wasActive){ chosen=initialChoice(); }
        list(); msg('Gelöscht.',true); if(!$('#start').hidden) (DW.profiles().length>1?buildWho():buildStart()); }); });
  }
  list();
  m.querySelector('#ppWho').onclick=()=>{ m.close(); showStart('who'); };
  m.querySelector('#ppNew').onclick=()=>{ m.close(); const id=DW.addProfile(); switchProfile(id,()=>showStart('maker'),'maker'); };
  m.querySelector('#ppExpAll').onclick=()=>exp(null,'alle');
  const file=m.querySelector('#ppFile');
  m.querySelector('#ppImp').onclick=()=>{ file.value=''; file.click(); };
  file.onchange=()=>{ const f=file.files[0]; if(!f) return; const rd=new FileReader();
    rd.onload=async()=>{ let o=null; try{ o=JSON.parse(rd.result); }catch(e){}
      if(!DW.checkBackup(o)){ msg('Das ist keine Sicherung der Dino-Inselwelt.',false); return; }
      const plan=DW.importPlan(o), rep=plan.filter(x=>x.replace), add=plan.filter(x=>!x.replace), nm=a=>a.map(x=>x.name||'ohne Namen').join(', ');
      if(!confirm(`Sicherung laden?\n${add.length?`Neu dazu: ${nm(add)}\n`:''}${rep.length?`Wird durch den Stand aus der Datei ersetzt: ${nm(rep)}\n`:''}`)) return;
      try{ const r=await DW.importProfiles(o); msg(`Geladen: ${r.ids.length} ${r.ids.length===1?'Kind':'Kinder'}${r.replaced?` (${r.replaced} ersetzt)`:''}.`,true);
        if(window.__worldInit){ try{sessionStorage.setItem('dw.next','who');}catch(e){} setTimeout(()=>location.reload(),900); return; }
        chosen=initialChoice(); list(); if(!$('#start').hidden) buildWho();
      }catch(e){ msg('Laden hat nicht geklappt.',false); } };
    rd.readAsText(f); };
}

/* ---------------- Start / PWA ---------------- */
if(S.started&&S.avatar){ /* Startbildschirm zeigt „Weiter forschen“ */ }
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(()=>{});
document.addEventListener('visibilitychange',()=>{ if(document.hidden) DW.hush(); });
})();
