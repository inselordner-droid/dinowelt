/* =====================================================================
   DINO-INSELWELT · tour.js — Geführte Einführungstour mit Pip
   Startet beim ersten Betreten der Karte (pro Profil), fragt zuerst mit
   zwei großen Bild-Knöpfen, ist jederzeit abbrechbar (Knopf oben links,
   Esc) und kommt ganz ohne Lesen aus: Pip spricht, ein Lichtkreis und
   eine wippende Hand zeigen, wohin getippt wird. Mitmach-Schritte warten
   auf die echte Aktion (über DW-Ereignisse), „Weiter“ geht immer.
   Freies Spielen ist erlaubt: öffnet das Kind ein Fenster oder eine
   Station, macht die Tour Pause und danach weiter.
   Spielstand: DW.state.tour = {done:true,how:'done'|'skipped'|'aborted'|'played',t} | {done:false,step,t}
                (Feld fehlt = noch nie gesehen)
   Öffentlich: TOUR.plan(), TOUR.offer({mode}), TOUR.busy(), TOUR.active(),
               TOUR.step(), TOUR.end(), TOUR.forget(), TOUR.later(fn), TOUR.mute(was)
   ===================================================================== */
(function(){
"use strict";
const T=window.TOUR={};
const D=document, INK='#3d3226';
const q=s=>D.querySelector(s);

/* ---------- eigene Symbole (64×64) ---------- */
const GLOVE=`<path d="M26 45V10.5a6.5 6.5 0 0 1 13 0V35h4.5a9 9 0 0 1 9 9v10.5C52.5 63 46 69 37 69h-9c-9 0-15.5-6-15.5-14.5V50c0-6 5-8 13.5-5z" fill="#fffaf0" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/><path d="M39 45v7M46 47v6" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".45"/><rect x="15" y="65" width="35" height="16" rx="7.5" fill="#f0c35a" stroke="${INK}" stroke-width="2.6"/>`;
Object.assign(ART.ICONS,{
  t_finger:`<g transform="translate(9 1) scale(.74)">${GLOVE}</g><path d="M14 10l-6-5M11 20H3M46 10l6-5M49 20h8" stroke="#f0c35a" stroke-width="3.4" stroke-linecap="round"/>`,
  t_go:`<circle cx="32" cy="32" r="25" fill="#8fbf7a" stroke="${INK}" stroke-width="1.6"/><path d="M26 18l14 14-14 14" stroke="#fffaf0" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  t_zoom:`<circle cx="19" cy="32" r="15" fill="#fffaf0" stroke="${INK}" stroke-width="1.6"/><path d="M11 32h16" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/><circle cx="46" cy="32" r="15" fill="#fffaf0" stroke="${INK}" stroke-width="1.6"/><path d="M38 32h16M46 24v16" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`,
  t_spuren:`<g fill="#6e5236"><g transform="translate(1 24) rotate(-18 16 20) scale(.6)"><path d="M32 56q-12 0-12-12t12-10 12 10-12 12z"/><path d="M18 28q-6-14 0-18t8 8-8 10zM32 22q-2-16 4-16t4 14-8 2zM46 28q4-14 10-12t-2 12-8 0z"/></g><g transform="translate(27 1) rotate(14 16 20) scale(.6)"><path d="M32 56q-12 0-12-12t12-10 12 10-12 12z"/><path d="M18 28q-6-14 0-18t8 8-8 10zM32 22q-2-16 4-16t4 14-8 2zM46 28q4-14 10-12t-2 12-8 0z"/></g></g>`,
});
const HAND_SVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 84" width="64" height="84" aria-hidden="true">${GLOVE}</svg>`;
/* handgemalter, leicht welliger Ring (wird auf die Größe des Lichtkreises gestreckt) */
const RING_SVG=(()=>{ let d=''; const n=40; for(let i=0;i<=n;i++){ const a=i/n*Math.PI*2, r=100+Math.sin(a*3+.6)*2.4+Math.sin(a*7)*1.3; d+=(i?'L':'M')+(Math.cos(a)*r).toFixed(1)+' '+(Math.sin(a)*r).toFixed(1); }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-110 -110 220 220" preserveAspectRatio="none" aria-hidden="true"><path class="r1" d="${d}Z"/><path class="r2" d="${d}Z"/></svg>`; })();

/* ---------- Pips Sätze: jeder Satz ein eigener DW.say-Aufruf (später einzeln vertonbar) ---------- */
const L={
  ich:'Ich bin Pip, dein kleiner Dino-Freund.',          // Aufnahme vorhanden
  wieder:'Schön, dass du wieder da bist!',                // Aufnahme vorhanden
  frage:'Soll ich dir die Insel zeigen?',
  frageNochmal:'Soll ich dir alles noch einmal zeigen?',
  frageWeiter:'Wollen wir die Tour weitermachen?',
  ja:'Tippe auf die Fußspuren, dann geht es los.',
  nein:'Oder tippe auf das Kreuz, dann spielst du gleich allein.',
  tipp:'Tippe irgendwo auf die Insel, dann laufen wir dorthin!',
  tipp1:'Tippe mit dem Finger irgendwo auf die Insel.',
  prima:'Super!',                                         // Aufnahme vorhanden
  du:'Schau, das bist du!',
  schild:'Siehst du das runde Schild?',
  schildHaus:'Siehst du das runde Schild mit dem Haus?',
  haus:'Das ist dein Forscherhaus.',
  schildKurz:'Tippe auf das Schild!',
  schildTipp:'Tippe auf das Schild, dann laufen wir hin!',
  da:'Wir sind da!',
  rein:'Mit dem grünen Pfeil gehst du nachher hinein.',
  rolle1:'Das ist meine Schriftrolle.',
  rolle3:'Tippe auf die Schriftrolle.',
  sack:'Tippe auf deinen Rucksack!',
  sack3:'Hier sammelst du Tiere, Funde und Sticker.',
  zu:'Mit dem Kreuz geht es zurück zur Insel.',
  karte1:'Mit der Karte siehst du die ganze Welt.',
  karte2:'Tippe auf die Karte!',
  wo1:'Und wo sind wir?',
  wo2:'Tippe auf dein Bild!',
  zoom:'Mit Plus wird alles größer, mit Minus kleiner.',
  boot1:'Schau, hier liegt unser Boot!',
  boot2:'Damit fahren wir über das Meer.',
  fertig:'Geschafft!',                                    // Aufnahme vorhanden
  hilfe:'Wenn du Hilfe brauchst, tippe auf das Fragezeichen.',
  dran:'Jetzt bist du dran!',
  okay:'Okay! Viel Spaß beim Entdecken!',
};
T.LINES=L;
/* Dateinamen für spätere Aufnahmen: sounds-neu/sprache/tour_<schritt>_<nr>.mp3 (ASSETS.voiceName).
   Sätze, die es schon als Aufnahme gibt (ich, wieder, prima, fertig), behalten ihre Datei und werden nicht angemeldet. */
const VN={ start:['frage','frageNochmal','frageWeiter','ja','nein'], laufen:['tipp','tipp1','du'], schild:['schild','schildHaus','schildKurz','schildTipp'], spot:['haus','da','rein'],
  auftraege:['rolle1','rolle3'], rucksack:['sack','sack3'], fenster:['zu'], karte:['karte1','karte2'], wo:['wo1','wo2'], zoom:['zoom'],
  boot:['boot1','boot2'], ende:['hilfe','dran'], abbruch:['okay'] };
T.VOICE={};
Object.keys(VN).forEach(k=>VN[k].forEach((id,i)=>{ const n='tour_'+k+'_'+(i+1); T.VOICE[n]=L[id]; try{ if(window.ASSETS&&ASSETS.voiceName) ASSETS.voiceName(L[id],n); }catch(e){} }));

/* ---------- Zustand ---------- */
let phase='off';            // off | pending (reserviert, Figur spricht noch) | intro | run | outro
let pendT=0, pauseT0=0, paused=false, why='', mode='first', idx=-1, cur=null, startIdx=0;
let layer=null, EL={}, raf=0, offerP=null, offerRes=null;
let flowTok=0, sayTok=0, expect=null, talking=false, talkJob=null, retries=0;
let lastMine=false, achieved=false, hintN=0, hintId=0, lockT=0, expectSpot=false, zuSaid=false, introHints=0;
let tgtFn=null, tgtFrom=null, tgtT0=0, sm=null, lastKey='';
const stepT=new Set(), pauseT=new Set(), sayT=new Set(), flowT=new Set(), laters=[];
const stepLis=[], baseLis=[];
const after=(ms,fn,set=stepT)=>{ const id=setTimeout(()=>{ set.delete(id); fn(); },ms); set.add(id); return id; };
const clearSet=set=>{ set.forEach(id=>clearTimeout(id)); set.clear(); };
const listen=(el,ev,fn,arr=stepLis,o)=>{ if(!el) return; el.addEventListener(ev,fn,o); arr.push([el,ev,fn,o]); };
const unlisten=arr=>{ arr.forEach(([el,ev,fn,o])=>el.removeEventListener(ev,fn,o)); arr.length=0; };
const W=()=>window.WORLD;
let LONG_PLAY=120000;
const autoOff=()=>!!window.DW_DEBUG&&!/[?&]tour=1(&|$)/.test(location.search);

/* ---------- Sprechen: Pip redet nie dazwischen und lässt sich nicht doppelt hören ---------- */
const minMs=t=>DW.state.settings.voice?450:900+t.length*55;
function sayMine(t){ expect=t; let p; try{ p=DW.say(t); }catch(e){ p=Promise.resolve(); } expect=null; return p; }
function cancelTalk(){ sayTok++; talking=false; clearSet(sayT); }
function speak(lines){ const tok=++sayTok; talking=true; clearSet(sayT);
  return new Promise(res=>{ let i=0;
    const step=()=>{ if(tok!==sayTok) return res(false); if(i>=lines.length){ talking=false; return res(true); }
      const o=typeof lines[i]==='string'?{t:lines[i]}:lines[i]; i++; if(o.fx){ try{ o.fx(); }catch(e){} }
      let n=2; const one=()=>{ if(--n>0) return; if(tok!==sayTok) return res(false); after(120,step,sayT); };
      sayMine(o.t).then(one,one); after(minMs(o.t),one,sayT); };
    step(); }); }
/* erst sprechen, wenn gerade niemand spricht (Figur, Auftrags-Jubel, Vorlesen) */
function quiet(min=300,max=5000){ const tok=flowTok; let pend=false;
  try{ pend=phase==='run'&&!!(window.QUEST&&QUEST.onWorld&&QUEST.onWorld()); }catch(e){}
  const need=pend?1300:min, t0=performance.now(); let calm=0;
  return new Promise(res=>{ const chk=()=>{ if(tok!==flowTok) return res(false); const t=performance.now()-t0;
      calm=DW.speaking()?0:calm+1; if(t>=need&&(calm>=2||t>max)) return res(true); after(140,chk,flowT); };
    after(Math.min(need,140),chk,flowT); }); }
function setText(lines){ if(EL.text) EL.text.textContent=lines.map(l=>typeof l==='string'?l:l.t).join(' '); }
function talk(lines,cont){ talkJob={lines,cont}; setText(lines); const tok=flowTok;
  speak(lines).then(ok=>{ if(!ok||tok!==flowTok) return; talkJob=null; cont&&cont(); }); }
/* jemand anderes spricht (Tier angetippt, Auftrag geschafft …): Pip wartet und fängt seinen Satz danach neu an */
DW.on('say',t=>{ if(expect!==null&&t===expect){ lastMine=true; return; } lastMine=false; if(!(phase==='intro'||phase==='run')||paused) return;
  if(talking&&talkJob){ const job=talkJob, tok=flowTok; cancelTalk();
    after(700,()=>quiet(200).then(ok=>{ if(!ok||tok!==flowTok) return; if(retries<2){ retries++; talk(job.lines,job.cont); } else { talkJob=null; job.cont&&job.cont(); } }),flowT); }
  else if(hintId) armHint(); });

DW.on('figsay',()=>{ lastMine=false; });

/* ---------- Aufbau ---------- */
function pipURL(){ let s; try{ s=window.QUEST&&QUEST.pipSVG?QUEST.pipSVG(QUEST.stage(),{mood:'happy'}):null; }catch(e){ s=null; }
  return DW.svgURL(s||ART.animal('protoceratops',{shadow:false,mood:'happy'})); }
function build(){
  const pip=pipURL();
  layer=DW.h(`<div id="tour" class="notarget" data-phase="intro" data-step="">
    <div class="tour-dim"></div>
    <div class="tour-ring">${RING_SVG}</div>
    <div class="tour-hand"><div class="tour-hand-in">${HAND_SVG}</div></div>
    <button class="tour-x" id="tourEnd" type="button" aria-label="Tour beenden">${ART.icon('kreuz',44)}<span>Tour beenden</span></button>
    <div class="tour-bubble" role="group" aria-label="Pip zeigt dir die Insel">
      <div class="tour-pip"><img src="${pip}" alt="Pip" draggable="false"></div>
      <div class="tour-mid"><div class="tour-pic" id="tourPic"></div><p class="tour-text" id="tourText" aria-live="polite"></p><div class="tour-dots" id="tourDots" aria-hidden="true"></div></div>
      <div class="tour-btns"><button class="ibtn tour-say" id="tourSay" type="button" aria-label="Nochmal hören">${ART.icon('lautsprecher')}</button>
        <button class="tour-next" id="tourNext" type="button" aria-label="Weiter">${ART.icon('pfeil_r',44)}</button></div>
    </div>
    <div class="tour-intro" role="dialog" aria-label="Tour starten?">
      <button class="ibtn tour-say" id="tourIntroSay" type="button" aria-label="Nochmal hören">${ART.icon('lautsprecher')}</button>
      <div class="tour-intro-pip"><img src="${pip}" alt="Pip" draggable="false"></div>
      <p class="tour-q" id="tourQ" aria-live="polite"></p>
      <div class="tour-choices">
        <button class="tour-choice go" id="tourYes" type="button" aria-label="Tour starten"><span class="tour-cic">${ART.icon('t_spuren')}</span><b>Tour starten</b></button>
        <button class="tour-choice no" id="tourNo" type="button" aria-label="Ohne Tour spielen"><span class="tour-cic">${ART.icon('kreuz')}</span><b>Ohne Tour spielen</b></button>
      </div>
    </div></div>`);
  D.body.appendChild(layer);
  EL={dim:layer.querySelector('.tour-dim'),ring:layer.querySelector('.tour-ring'),hand:layer.querySelector('.tour-hand'),x:layer.querySelector('#tourEnd'),bubble:layer.querySelector('.tour-bubble'),
    pip:layer.querySelector('.tour-pip'),pic:layer.querySelector('#tourPic'),text:layer.querySelector('#tourText'),dots:layer.querySelector('#tourDots'),say:layer.querySelector('#tourSay'),next:layer.querySelector('#tourNext'),
    intro:layer.querySelector('.tour-intro'),q:layer.querySelector('#tourQ'),yes:layer.querySelector('#tourYes'),no:layer.querySelector('#tourNo'),introSay:layer.querySelector('#tourIntroSay')};
  listen(EL.x,'click',()=>{ DW.sfx('tap'); end('aborted'); },baseLis);
  listen(EL.next,'click',()=>{ DW.sfx('pop'); next(true); },baseLis);
  listen(EL.say,'click',()=>{ DW.sfx('tap'); again(); },baseLis);
  listen(EL.introSay,'click',()=>{ DW.sfx('tap'); introTalk(); },baseLis);
  listen(EL.yes,'click',()=>{ DW.sfx('ok'); begin(); },baseLis);
  listen(EL.no,'click',()=>{ DW.sfx('tap'); end('skipped'); },baseLis);
  listen(EL.dim,'pointerdown',()=>{ if(phase!=='intro') return; EL.intro.classList.remove('nudge'); void EL.intro.offsetWidth; EL.intro.classList.add('nudge'); },baseLis);
  listen(D,'keydown',e=>{ if(e.key!=='Escape'||paused||!(phase==='intro'||phase==='run')) return; e.preventDefault(); end(phase==='intro'?'skipped':'aborted'); },baseLis);
  sm=null; lastKey=''; tgtFn=null; tgtFrom=null;
  raf=requestAnimationFrame(frame);
}

/* ---------- Pause, wenn etwas anderes vorne ist (Station, Fenster, Startbildschirm, Stationskarte) ---------- */
function blocked(){ if(DW.current) return 'station'; const w=q('#world'), s=q('#start'); if(!w||w.hidden||(s&&!s.hidden)) return 'start';
  const o=q('#overlay'); if(o&&!o.hidden) return 'modal';
  const sp=q('#spot'); if(sp&&!sp.hidden&&!(phase==='run'&&(expectSpot||(cur&&cur.spot)))) return 'spot'; return ''; }
function pause(r){ paused=true; why=r; pauseT0=performance.now(); flowTok++; cancelTalk(); clearSet(stepT); clearSet(flowT); hintId=0; talkJob=null;
  /* Pip verstummt mitten im Satz, sobald ein Fenster oder eine Station aufgeht – dort spricht jetzt jemand anderes */
  if(lastMine&&DW.speaking()) DW.hush();
  layer.classList.add('paused'); D.body.classList.remove('tour-on');
  if(phase!=='run'||!cur) return;
  if(cur.onPause) cur.onPause(r);
  if(r==='modal'&&achieved) after(cur.zuWait||9000,function hint(){ if(!paused||why!=='modal') return; D.body.classList.add('tour-xhint');
    if(zuSaid) return; if(DW.speaking()){ after(1500,hint,pauseT); return; } zuSaid=true; sayMine(L.zu); },pauseT); }
function resume(){ const was=why, dur=performance.now()-pauseT0;
  /* lange in einer Station gespielt: Das Kind kennt sich aus – die Tour endet still (das Fragezeichen bringt sie zurück) */
  if(phase==='run'&&was==='station'&&dur>LONG_PLAY){ end('played'); return; }
  /* Pips Satz zum offenen Fenster („Mit dem Kreuz geht es zurück …“) ist überholt, sobald das Fenster zu ist */
  if(lastMine&&DW.speaking()) DW.hush();
  paused=false; why=''; clearSet(pauseT); D.body.classList.remove('tour-xhint'); layer.classList.remove('paused'); D.body.classList.add('tour-on'); lastKey='';
  if(phase==='intro'){ introTalk(true); return; }
  if(phase!=='run'||!cur) return;
  if(achieved||(cur.spot&&q('#spot').hidden)){ flowTok++; const tok=flowTok; if(achieved&&!cur.spot){ DW.sfx('ok'); pipJump(); } after(400,()=>{ if(tok===flowTok) next(); },flowT); }
  else enterStep(idx,{again:true}); }

/* ---------- Lichtkreis und Hand folgen dem Ziel ---------- */
function setTarget(fn){ tgtFrom=sm?{x:sm.x,y:sm.y,rx:sm.rx,ry:sm.ry}:null; tgtT0=performance.now(); tgtFn=fn||null; }
function frame(){ raf=requestAnimationFrame(frame); if(!layer) return;
  const b=blocked();
  if(b&&!paused) pause(b); else if(!b&&paused) resume(); else if(b) why=b;
  if(paused||!layer) return;
  if(phase==='run'&&cur&&cur.tick){ cur.tick(); if(paused||!layer) return; }
  place(); }
function place(){ let t=null; try{ t=tgtFn?tgtFn():null; }catch(e){ t=null; }
  if(!t||!isFinite(t.x)||!isFinite(t.y)){ if(sm||lastKey!=='-'){ sm=null; lastKey='-'; layer.classList.add('notarget'); } return; }
  const rx=t.rx||t.r||60, ry=t.ry||t.r||60;
  /* Ziel (noch) nicht im Bild – z. B. während die Karte zum Anleger schwenkt: Lichtkreis und Hand warten */
  if(t.x<-rx*.4||t.x>innerWidth+rx*.4||t.y<-ry*.4||t.y>innerHeight+ry*.4){ if(sm||lastKey!=='-'){ sm=null; lastKey='-'; layer.classList.add('notarget'); } return; }
  let x=t.x, y=t.y, ax=rx, ay=ry;
  if(tgtFrom){ const u=Math.min(1,(performance.now()-tgtT0)/480), e=1-Math.pow(1-u,3); x=tgtFrom.x+(x-tgtFrom.x)*e; y=tgtFrom.y+(y-tgtFrom.y)*e; ax=tgtFrom.rx+(rx-tgtFrom.rx)*e; ay=tgtFrom.ry+(ry-tgtFrom.ry)*e; if(u>=1) tgtFrom=null; }
  sm={x,y,rx:ax,ry:ay};
  /* Hand: Spitze am Ziel, kommt von der freien Seite (Richtung Bildschirmmitte) */
  let hx=t.hx, hy=t.hy, dx, dy;
  if(hx==null){ dx=innerWidth/2-x; dy=innerHeight/2-y; const n=Math.hypot(dx,dy); if(n<50){ dx=.7; dy=.72; } else { dx/=n; dy/=n; }
    if(Math.abs(dy)<.3){ dy=dy<0?-.3:.3; const m=Math.hypot(dx,dy); dx/=m; dy/=m; }
    /* die Hand soll weder unter Pips Sprechblase noch unter „Tour beenden“ oder am Rand verschwinden */
    const br=rectOf(EL.bubble), xr=rectOf(EL.x), free=(ux,uy)=>{ const bx=x+ux*(ax*.6+58), by=y+uy*(ay*.6+58);
      return bx>14&&bx<innerWidth-14&&by>14&&by<innerHeight-14&&![br,xr].some(r=>r&&bx>r.left-16&&bx<r.right+16&&by>r.top-16&&by<r.bottom+16); };
    if(!free(dx,dy)){ const c=[[0,1],[0,-1],[.7,.71],[-.7,.71],[.7,-.71],[-.7,-.71]].find(d=>free(d[0],d[1])); if(c){ dx=c[0]; dy=c[1]; } }
    hx=x+dx*ax*.6; hy=y+dy*ay*.6; }
  else { dx=t.hdx==null?.62:t.hdx; dy=t.hdy==null?.78:t.hdy; }
  const key=[x,y,ax,ay,hx,hy].map(v=>Math.round(v*2)).join(',')+(t.nohand?'n':'');
  if(key===lastKey) return; lastKey=key;
  layer.classList.remove('notarget');
  const s=layer.style; s.setProperty('--tx',x.toFixed(1)+'px'); s.setProperty('--ty',y.toFixed(1)+'px'); s.setProperty('--rx',(ax*1.62).toFixed(1)+'px'); s.setProperty('--ry',(ay*1.62).toFixed(1)+'px');
  const r=EL.ring.style; r.width=(ax*2+10).toFixed(1)+'px'; r.height=(ay*2+10).toFixed(1)+'px'; r.transform=`translate3d(${(x-ax-5).toFixed(1)}px,${(y-ay-5).toFixed(1)}px,0)`;
  EL.hand.style.display=t.nohand?'none':'';
  EL.hand.style.transform=`translate3d(${hx.toFixed(1)}px,${hy.toFixed(1)}px,0) rotate(${Math.atan2(-dx,dy).toFixed(3)}rad)`;
}
const rectOf=el=>{ if(!el||el.hidden) return null; const r=el.getBoundingClientRect(); return r.width&&r.height?r:null; };
const elTarget=(sel,pad=12)=>()=>{ const r=rectOf(q(sel)); if(!r) return null; const R=Math.max(r.width,r.height)/2+pad; return {x:r.left+r.width/2,y:r.top+r.height/2,r:R}; };
const heroTarget=big=>()=>{ const w=W(); if(!w||!w.heroScreenPos) return null; const p=w.heroScreenPos(), z=p[2]||1;
  return {x:p[0],y:p[1]-30*z,r:big?DW.clamp(Math.min(innerWidth,innerHeight)*.3,120,230):Math.max(62,74*z)}; };

/* ---------- Bildchen in der Sprechblase ---------- */
function pics(list){ EL.pic.innerHTML=(list||[]).map(p=>`<span class="tour-pc">${p.charAt(0)==='<'?p:ART.icon(p)}</span>`).join(''); }
function myFigure(){ try{ const av=ART.AVATARS.find(a=>a.id===DW.state.avatar)||ART.AVATARS[0]; return ART.avatar(av,{nohat:false}); }catch(e){ return ART.icon('kind'); } }
function dots(){ const n=STEPS[STEPS.length-1].dot+1, k=cur?cur.dot:0; EL.dots.innerHTML=[...Array(n)].map((_,i)=>`<i class="${i<k?'done':i===k?'on':''}"></i>`).join(''); }
function pipJump(){ if(!EL.pip) return; EL.pip.classList.remove('jump'); void EL.pip.offsetWidth; EL.pip.classList.add('jump'); }

/* ---------- Schritte ---------- */
function nearSign(){ const w=W(); if(!w||!w.stationDist||!w.signScreenPos) return null;
  const at=w.heroAtStation&&w.heroAtStation();
  const ids=DATA.STATIONS.map(s=>s.id).filter(id=>!(at&&at.id===id)&&w.signScreenPos(id));
  if(ids.includes('zuhause')&&w.stationDist('zuhause')<1300) return 'zuhause';
  ids.sort((a,b)=>w.stationDist(a)-w.stationDist(b)); return ids[0]||null; }
/* freie Stelle neben der Figur, auf die die Hand beim „Lauf“-Schritt zeigt (nicht auf ein Schild) */
function tapOk(sx,sy){ const w=W(), VW=innerWidth, VH=innerHeight, br=rectOf(EL.bubble);
  if(sx<56||sx>VW-96||sy<110||sy>VH-130) return false;
  if(br&&sx>br.left-40&&sx<br.right+40&&sy>br.top-40&&sy<br.bottom+70) return false;
  if(DATA.STATIONS.some(s=>{ const p=w.signScreenPos(s.id); return p&&(Math.hypot(p[0]-sx,p[1]-sy)<p[2]+56||Math.hypot(p[0]-sx,p[1]+p[2]*1.9-sy)<64); })) return false;
  return !w.plainTapAt||w.plainTapAt(sx,sy); }
function tapPoint(){ const w=W(), h=w.heroScreenPos(), z=h[2]||1;
  for(const R of [128,96,160]) for(const [ax,ay] of [[1,.5],[-1,.55],[.95,-.5],[-.95,-.5],[0,1],[1.35,0],[-1.35,0],[.4,-1],[-.4,1]]){ const sx=h[0]+ax*R, sy=h[1]-22*z+ay*R;
    if(tapOk(sx,sy)) return w.fromScreen(sx,sy); }
  return w.fromScreen(h[0]+110,h[1]+70); }
const tapWatch=sel=>function(){ listen(q(sel),'click',()=>{ this.tapped=performance.now(); },stepLis,true); };
const STEPS=[
  { id:'laufen', dot:0, act:true, pic:['t_finger','t_spuren'],
    lines:[L.tipp], hint:[L.tipp1],
    enter(){ const w=W(); if(!w||!w.heroScreenPos) return false; this.p0=w.heroPos(); this.touch=false; this.pt=null; w.goHome&&w.goHome();
      const big=heroTarget(true); let chk=0;
      setTarget(()=>{ const t=big(); if(!t) return null; if(!this.pt) this.pt=tapPoint(); let s=w.toScreen(this.pt[0],this.pt[1]);
        if(++chk%45===0&&!tapOk(s[0],s[1])){ this.pt=tapPoint(); s=w.toScreen(this.pt[0],this.pt[1]); }      // Tiere wandern: Stelle ab und zu prüfen
        t.hx=s[0]; t.hy=s[1]; return t; }); },
    on:{ worldtouch(){ this.touch=true; } },
    tick(){ if(achieved||!this.touch) return; const p=W().heroPos(); if(Math.hypot(p[0]-this.p0[0],p[1]-this.p0[1])<22) return;
      win(); pics([myFigure(),'<img src="'+pipURL()+'" alt="">']); const sm_=heroTarget(false); setTarget(()=>{ const t=sm_(); if(t) t.nohand=true; return t; });
      talk([L.prima,L.du],()=>after(350,()=>next())); } },
  { id:'schild', dot:1, act:true,
    lines(){ return [this.st==='zuhause'?L.schildHaus:L.schild,L.schildKurz]; }, hint:[L.schildTipp],
    enter(o){ const w=W(); this.st=nearSign(); if(!this.st) return false; this.offT=0; this.tries=0; this.down=false; this.show();
      if(!o.again||!w.heroScreenPos()[3]) this.look();
      setTarget(()=>{ const p=w.signScreenPos(this.st); return p?{x:p[0],y:p[1],r:Math.max(48,p[2]*1.5)}:null; });
      listen(D,'pointerdown',()=>{ this.down=true; this.offT=0; },stepLis,true);
      ['pointerup','pointercancel'].forEach(ev=>listen(D,ev,()=>{ this.down=false; this.offT=0; },stepLis,true)); },
    show(){ const s=DATA.station(this.st); pics([`<span class="tour-sign" style="background:${s.col}">${ART.icon(s.icon)}</span>`,'t_finger']); },
    /* freier Bereich für das Schild (nicht unter Sprechblase, „Tour beenden“ oder den Knöpfen am Rand) */
    box(){ const w=W(), p=w.signScreenPos(this.st), VW=innerWidth, VH=innerHeight, br=rectOf(EL.bubble);
      const top=br&&br.top<VH/2?br.bottom+50:110, bot=br&&br.top>=VH/2?br.top-60:VH-130, R=Math.max(48,p[2]*1.5);
      return {p,top,bot,R,ok:p[0]>R+44&&p[0]<VW-R-96&&p[1]>top+R*.4&&p[1]<bot}; },
    /* Figur und Schild gemeinsam ins Bild holen (nur wenn das Schild ungünstig liegt); alone = nur das Schild in die Mitte */
    look(alone){ const w=W(), b=this.box(), p=b.p, h=w.heroScreenPos(), VW=innerWidth, VH=innerHeight; if(b.ok) return;
      const dy=VH/2-(b.top+b.bot)/2;
      if(alone){ const m=w.fromScreen(p[0],p[1]+dy); w.lookAt(m[0],m[1],0); return; }
      const sep=Math.hypot(p[0]-h[0],p[1]-h[1])/h[2], fit=.62*Math.min(VW,b.bot-b.top)/Math.max(1,sep);
      const m=w.fromScreen((p[0]+h[0])/2,(p[1]+h[1])/2+dy); w.lookAt(m[0],m[1],fit<h[2]?fit:0); },
    /* freies Spielen: ist das Kind weggelaufen oder hat die Karte verschoben, kommt das Schild nach kurzer Ruhe wieder ins Bild
       (liegt inzwischen ein anderes Schild näher, zeigt Pip auf dieses) */
    tick(){ const w=W(), now=performance.now(); if(w.heroScreenPos()[3]){ this.offT=0; if(hintId) armHint(); return; }
      if(achieved||this.down) return; if(this.box().ok){ this.offT=0; this.tries=0; return; }
      if(!this.offT){ this.offT=now; return; } if(now-this.offT<(this.tries?1500:2400)) return; this.offT=0;
      const n=nearSign(); if(n&&n!==this.st){ this.st=n; this.tries=0; this.show(); setText(this.lines()); }
      this.look(this.tries>0); this.tries++; } },
  { id:'spot', dot:2, spot:true, auto:1100, pic:['t_go'],
    lines(){ const w=W(), at=w&&w.heroAtStation&&w.heroAtStation(); return [at&&at.id==='zuhause'?L.haus:L.da,L.rein]; },
    enter(){ const sp=q('#spot'); if(sp.hidden) return false; this.downT=-1e9;
      /* Das Kind greift gerade nach der Karte („Hinein!“, Lautsprecher …): dann geht sie nicht unter dem Finger zu */
      listen(sp,'pointerdown',()=>{ this.downT=performance.now(); },stepLis,true);
      setTarget(()=>{ const r=rectOf(q('#spot')); if(!r) return null; const g=rectOf(q('#spotGo')); const t={x:r.left+r.width/2,y:r.top+r.height/2,rx:r.width*.7,ry:r.height*.72};
        if(g){ t.hx=g.left+g.width*.72; t.hy=g.top+g.height*.7; } else t.nohand=true; return t; }); },
    hold(){ return performance.now()-this.downT<900||!!q('#spot').dataset.going; },
    tick(){ if(q('#spot').hidden&&!DW.current) next(); },
    onPause(r){ if(r==='station') achieved=true; },
    /* schließt die Tour die Karte von selbst, schluckt die Ebene kurz alle Tipps – ein verspäteter Tipp auf „Hinein!“ soll die Figur nicht weglaufen lassen */
    leave(){ const sp=q('#spot'); if(sp&&!sp.hidden&&!sp.dataset.going){ DW.emit('closeSpot'); guard(700); } } },
  { id:'auftraege', dot:3, act:true, pic:['q_rolle'], lines:[L.rolle1,L.rolle3], hint:[L.rolle3], zuWait:10000,
    enter(){ if(!rectOf(q('#btnQuest'))) return false; setTarget(elTarget('#btnQuest',10)); tapWatch('#btnQuest').call(this); },
    onPause(r){ if(r==='modal'&&performance.now()-(this.tapped||-1e9)<1500) achieved=true; } },
  { id:'rucksack', dot:4, act:true, pic:['rucksack'], lines:[L.sack], hint:[L.sack], zuWait:6500,
    enter(){ if(!rectOf(q('#btnBag'))) return false; setTarget(elTarget('#btnBag')); tapWatch('#btnBag').call(this); },
    onPause(r){ if(r!=='modal'||performance.now()-(this.tapped||-1e9)>1500) return; achieved=true;
      after(350,()=>{ if(paused&&why==='modal') sayMine(L.sack3); },pauseT); } },
  { id:'karte', dot:5, act:true, pic:['karte','globus'], lines:[L.karte1,L.karte2], hint:[L.karte2],
    enter(){ if(!rectOf(q('#btnMap'))) return false; setTarget(elTarget('#btnMap'));
      listen(q('#btnMap'),'click',()=>{ if(achieved) return; win(); clearSet(stepT); const tok=flowTok; setTarget(null);
        after(1500,()=>{ if(tok===flowTok) next(); }); },stepLis,true); } },
  { id:'wo', dot:5, act:true, lines:[L.wo1,L.wo2], hint:[L.wo2],
    enter(){ if(!rectOf(q('#btnWhere'))) return false; pics([myFigure(),'t_finger']); setTarget(elTarget('#btnWhere'));
      listen(q('#btnWhere'),'click',()=>{ if(achieved) return; win(); clearSet(stepT); const big=heroTarget(false); setTarget(()=>{ const t=big(); if(t) t.nohand=true; return t; }); after(1300,()=>next()); },stepLis,true); },
    leave(){ if(!achieved){ const w=W(); w&&w.whereAmI&&w.whereAmI(); } } },
  { id:'zoom', dot:5, auto:800, pic:['t_zoom'], lines:[L.zoom],
    enter(){ const a=q('#btnZoomOut'), b=q('#btnZoomIn'); if(!rectOf(a)||!rectOf(b)) return false;
      setTarget(()=>{ const r=rectOf(a), s=rectOf(b); if(!r||!s) return null; const l=Math.min(r.left,s.left), t=Math.min(r.top,s.top), R=Math.max(r.right,s.right), B=Math.max(r.bottom,s.bottom);
        return {x:(l+R)/2,y:(t+B)/2,rx:(R-l)/2+14,ry:(B-t)/2+14,hx:(l+R)/2,hy:t-6,hdx:-.42,hdy:-.9}; });
      [a,b].forEach(el=>listen(el,'click',()=>{ achieved=true; clearSet(stepT); hintId=0; layer.dataset.next='1'; after(1800,()=>next()); },stepLis,true)); } },
  { id:'boot', dot:6, auto:1100, pic:['boot','welle'], lines:[L.boot1,L.boot2],
    enter(){ const w=W(); this.d=w&&w.showDock?w.showDock():null; if(!this.d) return false;
      setTarget(()=>{ const s=w.toScreen(this.d[0],this.d[1]); return {x:s[0],y:s[1]-6*s[2],r:Math.max(86,118*s[2])}; }); },
    leave(){ const w=W(); w&&w.whereAmI&&w.whereAmI(); } },
  { id:'ende', dot:7, pic:['stern','herz','stern'],
    lines:[L.fertig,{t:L.hilfe,fx:()=>{ if(rectOf(q('#btnHelp'))) setTarget(elTarget('#btnHelp')); }},{t:L.dran,fx:()=>setTarget(null)}],
    enter(){ setTarget(null); DW.confetti(90); DW.sfx('win'); pipJump(); },
    done(){ after(600,()=>end('done')); } },
];
const stepIndex=id=>STEPS.findIndex(s=>s.id===id);

function win(){ achieved=true; flowTok++; clearSet(flowT); cancelTalk(); talkJob=null; clearHint(); DW.sfx('ok'); pipJump(); layer.dataset.hint=''; EL.ring.classList.remove('yes'); void EL.ring.offsetWidth; EL.ring.classList.add('yes'); }
let guardT=0;
function guard(ms){ if(!layer) return; layer.classList.add('catch'); clearTimeout(guardT); guardT=setTimeout(()=>{ guardT=0; layer&&layer.classList.remove('catch'); },ms); }
function clearHint(){ if(hintId){ clearTimeout(hintId); stepT.delete(hintId); hintId=0; } }
function armHint(){ clearHint(); if(!cur||!cur.act||achieved||paused||hintN>=2) return; hintId=after(hintN?11000:7500,doHint); }
function doHint(){ hintId=0; if(!cur||achieved) return; if(DW.speaking()||talking){ armHint(); return; }
  hintN++; layer.dataset.hint=String(hintN); if(hintN>=2) layer.dataset.next='1'; DW.sfx('pop');
  talk(cur.hint||[],armHint); }
function leaveStep(){ clearSet(stepT); clearSet(flowT); hintId=0; unlisten(stepLis); cancelTalk(); talkJob=null;
  if(cur&&cur.leave){ try{ cur.leave(); }catch(e){} }
  if(layer){ layer.dataset.hint=''; layer.dataset.next=''; } }
function saveStep(){ DW.state.tour={done:false,step:cur.id,t:Date.now()}; DW.save(); }
function enterStep(i,o={}){ if(phase!=='run'||!layer) return;
  leaveStep(); flowTok++;
  if(i>=STEPS.length){ end('done'); return; }
  idx=i; cur=STEPS[i]; achieved=false; hintN=0; retries=0; expectSpot=false; cur.tapped=0;
  layer.dataset.step=cur.id; EL.ring.classList.remove('yes');
  if(cur.pic) pics(cur.pic);
  let ok=true; try{ ok=cur.enter?cur.enter(o):true; }catch(e){ ok=false; }
  if(ok===false){ unlisten(stepLis); cur=null; setTarget(null); enterStep(i+1); return; }   // Schritt passt gerade nicht (Knopf fehlt, keine Stationskarte offen …)
  saveStep(); dots();
  EL.bubble.classList.remove('pop'); void EL.bubble.offsetWidth; EL.bubble.classList.add('pop');
  const lines=typeof cur.lines==='function'?cur.lines(o):cur.lines, tok=flowTok; setText(lines);
  quiet(o.first?120:300).then(okq=>{ if(!okq||tok!==flowTok) return;
    talk(lines,()=>{ if(tok!==flowTok) return;
      if(cur.done){ cur.done(); return; }
      if(cur.act){ if(!achieved) armHint(); return; }
      layer.dataset.next='1'; if(cur.auto&&!achieved) after(cur.auto,()=>next()); }); });
}
/* user = Tipp auf „Weiter“: kurz gesperrt nach jedem Wechsel (Doppeltipp; Tipp genau in dem Moment, in dem es von selbst weitergeht) */
function next(user){ if(phase!=='run'||paused) return; const t=performance.now(); if(user&&t<lockT) return;
  if(!user&&cur&&cur.hold&&cur.hold()){ after(500,()=>next()); return; } lockT=t+(user?350:750); enterStep(idx+1); }
function again(){ if(phase!=='run'||!cur||paused) return; clearHint(); const lines=typeof cur.lines==='function'?cur.lines({again:true}):cur.lines;
  const tok=flowTok; talk(lines.map(l=>typeof l==='string'?l:{t:l.t}),()=>{ if(tok===flowTok&&cur.act&&!achieved) armHint(); }); }

/* Ereignisse der Karte */
['worldtouch','arrive','station','world','board','closeSpot'].forEach(ev=>DW.on(ev,d=>{ if(phase!=='run'||!cur||paused) return;
  if(ev==='arrive'&&!cur.spot&&(cur.id==='laufen'||cur.id==='schild')){ expectSpot=true; win(); clearSet(stepT); const tok=flowTok;
    after(40,()=>{ if(tok!==flowTok) return; enterStep(stepIndex('spot')); },flowT); return; }
  const h=cur.on&&cur.on[ev]; if(h) h.call(cur,d); }));
DW.on('profile',()=>{ if(phase!=='off') stop(); });

/* ---------- Anfang: Pip fragt ---------- */
function introLines(){ const n=DW.displayName(DW.state), hi=n?['Hallo '+n+'!']:[];
  const yes={t:L.ja,fx:()=>pulse(EL.yes)}, no={t:L.nein,fx:()=>pulse(EL.no)};
  if(mode==='again') return {q:L.frageNochmal,a:[L.frageNochmal,yes,no]};
  if(mode==='resume') return {q:L.frageWeiter,a:hi.concat([L.wieder,L.frageWeiter,yes,no])};
  if(mode==='back') return {q:L.frage,a:hi.concat([L.wieder,L.frage,yes,no])};
  return {q:L.frage,a:hi.concat([L.ich,L.frage,yes,no])}; }
function pulse(b){ [EL.yes,EL.no].forEach(x=>x&&x.classList.toggle('say',x===b)); }
function introTalk(short){ if(phase!=='intro'||paused) return; flowTok++; cancelTalk(); clearSet(stepT); clearSet(flowT); pulse(null);
  const I=introLines(), tok=flowTok, lines=short?I.a.slice(-3):I.a; EL.q.textContent=I.q;
  quiet(short?400:150).then(ok=>{ if(!ok||tok!==flowTok) return;
    talk(lines,()=>{ pulse(null);
      if(introHints<2) after(9000,()=>{ if(tok!==flowTok||phase!=='intro'||paused||DW.speaking()) return; introHints++; introTalk(true); }); }); }); }
function begin(){ if(phase!=='intro') return; flowTok++; cancelTalk(); clearSet(stepT); clearSet(flowT); pulse(null); DW.hush();
  phase='run'; layer.dataset.phase='run'; D.body.classList.remove('tour-ask'); zuSaid=false; enterStep(startIdx,{first:true}); }

/* ---------- öffentliche Schnittstelle ---------- */
T.busy=()=>{ if(phase==='pending'&&performance.now()-pendT>30000) phase='off'; return phase!=='off'; };
T.active=()=>phase==='intro'||phase==='run';
T.paused=()=>paused;
T.step=()=>phase==='run'&&cur?cur.id:(phase==='intro'?'intro':null);
T.seen=()=>!!(DW.state.tour&&DW.state.tour.done);
/* Beim Betreten der Karte: Soll die Tour angeboten werden? 'new' reserviert Pips Stimme sofort (nichts anderes redet dazwischen). */
T.plan=()=>{ if(T.busy()) return 'run'; if(T.seen()||autoOff()) return null; phase='pending'; pendT=performance.now(); return 'new'; };
T.later=fn=>{ if(T.busy()) laters.push(fn); else fn(); };
/* Stationskarte: Die Tour erklärt die Ankunft selbst – der Stationssatz wird dann nicht zusätzlich vorgelesen. */
T.mute=what=>what==='spot'&&phase==='run'&&!paused&&!!cur&&(expectSpot||!!cur.spot);
T.forget=()=>{ delete DW.state.tour; DW.save(); };
/* Pip fragt, ob er die Insel zeigen soll. mode: 'first' | 'back' | 'again'. → Promise('done'|'aborted'|'skipped') */
T.offer=(o={})=>{
  if(phase==='intro'||phase==='run'||phase==='outro') return offerP||Promise.resolve('run');
  const s=DW.state.tour; mode=o.mode||'first'; startIdx=0; introHints=0; paused=false; why=''; cur=null; idx=-1;
  if(mode!=='again'&&s&&!s.done&&s.step&&Date.now()-(s.t||0)<30*60000){ const k=stepIndex({spot:'auftraege',wo:'karte',zoom:'karte',ende:'boot'}[s.step]||s.step); if(k>0){ startIdx=k; mode='resume'; } }
  phase='intro'; offerP=new Promise(r=>{ offerRes=r; });
  build(); D.body.classList.add('tour-on','tour-ask'); introTalk();
  return offerP; };
T.end=()=>end('aborted');

/* ---------- Ende: alles restlos aufräumen ---------- */
function teardown(){ if(cur&&phase==='run'){ try{ leaveStep(); }catch(e){} }
  flowTok++; cancelTalk(); talkJob=null; [stepT,pauseT,sayT,flowT].forEach(clearSet); hintId=0;
  if(raf){ cancelAnimationFrame(raf); raf=0; } clearTimeout(guardT); guardT=0;
  unlisten(stepLis); unlisten(baseLis);
  if(layer){ layer.remove(); layer=null; } EL={};
  D.body.classList.remove('tour-on','tour-ask','tour-xhint'); tgtFn=null; tgtFrom=null; sm=null; cur=null; idx=-1; paused=false; why=''; expectSpot=false; }
function finish(how){ phase='off'; const r=offerRes; offerRes=null; offerP=null; r&&r(how); laters.splice(0).forEach((f,i)=>setTimeout(f,500+i*400)); }
function end(how){ if(!(phase==='intro'||phase==='run')) return;
  teardown(); DW.state.tour={done:true,how,t:Date.now()}; DW.save();
  phase='outro';
  if(how==='done'||how==='played'){ finish(how); return; }
  DW.hush();
  /* wartet gerade ein Auftrags-Stempel (z. B. Abbruch an der Stationskarte)? Dann jubelt gleich die Schriftrolle – Pip redet nicht dazwischen */
  let pend=false; try{ pend=!!(window.QUEST&&QUEST.onWorld&&QUEST.onWorld()); }catch(e){}
  if(pend){ finish(how); return; }
  let fin=false; const f=()=>{ if(fin) return; fin=true; if(phase==='outro') finish(how); };
  sayMine(L.okay).then(f,f); setTimeout(f,6000); }
/* stiller Abbruch ohne Speichern (Profil gewechselt) */
function stop(){ teardown(); phase='off'; const r=offerRes; offerRes=null; offerP=null; r&&r('stopped'); laters.length=0; }

if(window.DW_DEBUG) T._debug={ state:()=>({phase,paused,why,step:cur&&cur.id,idx,achieved,hintN,talking,timers:stepT.size+pauseT.size+sayT.size+flowT.size,lis:stepLis.length+baseLis.length,raf:!!raf,layer:!!layer,target:sm&&{x:Math.round(sm.x),y:Math.round(sm.y),rx:Math.round(sm.rx),ry:Math.round(sm.ry)}}),
  go:id=>{ if(phase==='intro') begin(); enterStep(stepIndex(id)); }, steps:()=>STEPS.map(s=>s.id), longPlay:ms=>{ LONG_PLAY=ms; } };
})();
