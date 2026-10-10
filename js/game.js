/* =====================================================================
   DINO-INSELWELT · game.js — gemeinsamer Baukasten für alle Minispiele
   Schema aus der Game Bible: INTRO → READY → PLAYING → (FEHLVERSUCH →
   HINWEIS → PLAYING) → SUCCESS → REWARD → EXIT. Kein Game Over.
   ===================================================================== */
(function(){
"use strict";
const GK = window.GK = {};
/* Gemalte Bilder (js/assets.js) an DW anschließen – core.js ist jetzt geladen */
if(window.ASSETS&&ASSETS.patchDW) ASSETS.patchDW();
const LV=[{k:1,n:'Leicht'},{k:2,n:'Mittel'},{k:3,n:'Schwer'}];
GK.LEVELS=LV;

/* ---------- Aufräumen: Timer, Schleifen, Listener ---------- */
let timers=new Set(), loops=new Set(), offs=[];
GK.after=(ms,fn)=>{const t=setTimeout(()=>{timers.delete(t);fn();},ms);timers.add(t);return t;};
GK.every=(ms,fn)=>{const t=setInterval(fn,ms);timers.add(t);return t;};
GK.loop=(fn)=>{ // fn(dt,T) → false beendet
  const L={on:true,last:performance.now()}; loops.add(L);
  const step=t=>{ if(!L.on) return; const dt=Math.max(0,Math.min(.05,(t-L.last)/1000)); L.last=t; if(fn(dt,t/1000)===false){L.on=false;loops.delete(L);return;} requestAnimationFrame(step); };
  requestAnimationFrame(step); return ()=>{L.on=false;loops.delete(L);};
};
GK.listen=(el,ev,fn,opt)=>{el.addEventListener(ev,fn,opt);offs.push(()=>el.removeEventListener(ev,fn,opt));};
GK.cleanup=()=>{timers.forEach(t=>{clearTimeout(t);clearInterval(t);});timers.clear();loops.forEach(L=>L.on=false);loops.clear();offs.forEach(f=>f());offs=[];GK.idle.stop();dropGhosts();};

/* ---------- Sicherheitsnetz fürs Ziehen (DW.drag) ----------
   Wird das gezogene Element WÄHREND eines Zuges aus dem Dokument entfernt (Neuaufbau per innerHTML: nächste Frage,
   Auflösung, Drehen des Geräts, Station schließen), bekommt DW.drag kein pointerup mehr: die Kopie blieb am Bildschirm
   kleben („doppelte Grafik“) und html.dw-dragging blieb gesetzt. Der Browser meldet genau diesen Fall mit
   lostpointercapture am Dokument – dann räumen wir auf. Zweites Netz: sind alle Finger oben und der Zug-Zustand
   steht noch, war es ebenfalls ein verwaister Zug. Kopien, die gerade zurückfliegen (transition), bleiben unberührt. */
function dropGhosts(){ const h=document.documentElement; if(!h.classList.contains('dw-dragging')) return;
  h.classList.remove('dw-dragging'); document.querySelectorAll('body > .dragging').forEach(c=>{ if(!c.style.transition) c.remove(); }); }
const ptrs=new Map();
document.addEventListener('pointerdown',e=>{ if(e.isPrimary) ptrs.forEach((ty,id)=>{ if(ty===e.pointerType) ptrs.delete(id); }); ptrs.set(e.pointerId,e.pointerType); },true);
const ptrEnd=e=>{ ptrs.delete(e.pointerId); if(!ptrs.size) setTimeout(()=>{ if(!ptrs.size) dropGhosts(); },0); };
document.addEventListener('pointerup',ptrEnd,true); document.addEventListener('pointercancel',ptrEnd,true);
document.addEventListener('lostpointercapture',e=>{ if(e.target===document) dropGhosts(); },true);

/* ---------- Spielstand pro Station ---------- */
GK.st=id=>{const S=DW.state; S.games=S.games||{}; return S.games[id]=S.games[id]||{level:1,plays:0,best:0,done:0};};

/* ---------- Leerlauf-Hinweise (5–8 s: sichtbar, danach Sprache) ---------- */
GK.idle=(()=>{let a=null,b=null,h1=null,h2=null,wait=6500;
  const busy=()=>{ try{ return !!(DW.speaking&&DW.speaking()); }catch(e){ return false; } };
  const api={set(hint1,hint2,ms=6500){api.stop();h1=hint1;h2=hint2;wait=ms>0?ms:6500;api.poke();},
    poke(){clearTimeout(a);clearTimeout(b); if(!h1&&!h2)return; a=setTimeout(()=>{ try{h1&&h1();}catch(e){}
      /* Sprach-Hinweis: nicht in eine noch laufende Erzählung hineinreden (höchstens 20 s warten) */
      let n=0; const talk=()=>{ if(busy()&&n++<8){ b=setTimeout(talk,2500); return; } try{h2&&h2();}catch(e){} }; b=setTimeout(talk,7000);},wait);},
    stop(){clearTimeout(a);clearTimeout(b);h1=h2=null;}};
  document.addEventListener('pointerdown',()=>api.poke(),true); return api;})();

/* Wisch-/Malflächen (Canvas, Globus, Puzzleteile): GK.noFling(el) verhindert per nicht-passivem touchstart.preventDefault,
   dass der Browser aus einem schnellen Wisch eine eigene Geste („Fling“) macht. Sonst verschluckt Chrome danach ~0,3 s lang
   den nächsten Tipp auf IRGENDEINEN Knopf (kein click). Zeigerereignisse (pointerdown/move/up) kommen weiterhin; nur der
   vom Browser erzeugte click auf der Fläche selbst entfällt bei Touch – Flächen also immer über Zeigerereignisse bedienen. */
GK.noFling=el=>{ if(el&&!el._gkNF){ el._gkNF=1; el.addEventListener('touchstart',e=>{ if(e.cancelable) e.preventDefault(); },{passive:false}); } return el; };
/* Kurze Tipp-Sperre (gegen Doppeltipps beim Bildschirmwechsel) */
function shield(el,ms){ if(!el) return; el.style.pointerEvents='none'; setTimeout(()=>{ el.style.pointerEvents=''; },ms); }
GK.shield=shield;   // für Stationen: nach „Weiter“ kurz sperren, damit ein Doppeltipp nicht gleich die nächste Frage beantwortet
/* ---------- Intro-Karte mit Schwierigkeit ----------
   GK.intro(root,{id, art:html, title, say, levels:true|false, play:'Los!', onStart(level)}) */
GK.intro=(root,o)=>{
  const st=GK.st(o.id); let lv=st.level||1;
  root.innerHTML=`<div class="gk-intro fill center"><div class="gk-icard card pop">
    <div class="gk-iart">${o.art||''}</div>
    ${o.title?`<h2 class="hand">${o.title}</h2>`:''}
    ${o.levels===false?'':`<div class="gk-levels" role="group" aria-label="Schwierigkeit">${LV.map(l=>`<button class="gk-lv ${l.k===lv?'on':''}" data-l="${l.k}" aria-label="${l.n}">${(window.ASSETS&&ASSETS.img('ui/level_'+['','leicht','mittel','schwer'][l.k],'dw-lv-img'))||'<span class="gk-dot"></span>'.repeat(l.k)}<small>${l.n}</small></button>`).join('')}</div>`}
    <div class="row" style="justify-content:center;gap:14px"><button class="btn big go gk-play" type="button">${ART.icon('pfeil_r',40)}${o.play||'Los geht’s!'}</button>
    <button class="ibtn big gk-say" type="button" aria-label="Vorlesen">${ART.icon('lautsprecher')}</button></div>
    ${st.done?`<p class="gk-best">${DW.starRow(Math.min(3,st.best||0))}</p>`:''}
  </div></div>`;
  DW.$$('.gk-lv',root).forEach(b=>b.onclick=()=>{lv=+b.dataset.l;st.level=lv;DW.save();DW.$$('.gk-lv',root).forEach(x=>x.classList.toggle('on',x===b));DW.sfx('tap');
    DW.say(['','Leicht. Für kleine Forscher.','Mittel.','Schwer! Für echte Profis.'][lv]);});
  let started=false;
  root.querySelector('.gk-play').onclick=()=>{ if(started) return; started=true; DW.sfx('pop');DW.hush();st.plays++;DW.save();
    /* Doppeltipp auf „Los“: der zweite Tipp darf nicht schon eine Antwort im Spiel auslösen */
    shield(root,450); o.onStart(lv);};
  root.querySelector('.gk-say').onclick=()=>DW.say(o.say);
  root.querySelector('.gk-play').classList.add('gk-glow');
  if(o.say) DW.say(o.say);
};

/* ---------- Ende mit Belohnung ----------
   GK.finish(root,{id, stars:1..3, say, art, again:fn, extra:html}) */
let lastFin={id:null,t:0};
GK.finish=(root,o)=>{
  GK.idle.stop();
  /* zweimal direkt hintereinander (zwei Zeitgeber, Doppeltipp) → nur einmal Sterne und Sticker */
  { const now=performance.now(); if(lastFin.id===o.id&&now-lastFin.t<1500&&root.querySelector('.gk-end')) return; lastFin={id:o.id,t:now}; }
  const st=GK.st(o.id), n=Math.max(1,Math.min(3,o.stars||3)); st.done++; st.best=Math.max(st.best||0,n); DW.save();
  DW.addStars(o.id,n); DW.emit('gamefinish',{id:o.id,stars:n,level:st.level||1});
  const first=st.done===1; if(first&&DATA.sticker(o.id)) setTimeout(()=>DW.addSticker(o.id),900);
  const packs=GK.newPack();
  root.innerHTML=`<div class="gk-end fill center"><div class="gk-icard card pop">
    <div class="gk-iart">${o.art||DW.animalImg('protoceratops',{mood:'happy'})}</div>
    <h2 class="hand">${o.title||DW.pick(['Super gemacht!','Toll geforscht!','Klasse!','Hurra, geschafft!'])}</h2>
    <div class="gk-endstars">${DW.starRow(n)}</div>${o.extra||''}
    ${packs?`<p class="pill gk-pack">${ART.icon('sticker',30).replace('<svg','<svg style="display:inline;vertical-align:middle;width:30px"')} Neues Kartenpäckchen im Kartenhaus!</p>`:''}
    <div class="row" style="justify-content:center;gap:14px;flex-wrap:wrap">
      <button class="btn big go gk-again" type="button">${ART.icon('pfeil_r',36)}Nochmal</button>
      <button class="btn big ghost gk-home" type="button">${ART.icon('karte',36)}Zur Insel</button></div></div></div>`;
  DW.sfx('win'); DW.confetti(); if(o.say) DW.say(o.say,{queue:false});
  /* Doppeltipp auf die letzte Spielaktion darf nicht gleich „Nochmal“ / „Zur Insel“ treffen */
  shield(root.querySelector('.gk-again').parentElement,700);
  root.querySelector('.gk-again').onclick=()=>{DW.sfx('pop');o.again&&o.again();};
  root.querySelector('.gk-home').onclick=()=>{DW.sfx('tap');DW.closeStation();};
};
/* Kartenpäckchen: je 8 Sterne eins (plus eins zum Start) */
GK.packsEarned=()=>1+Math.floor(DW.totalStars()/8)+((DW.state.cards||{}).bonus||0);
GK.packsLeft=()=>{const c=DW.state.cards=DW.state.cards||{have:{},opened:0,bonus:0};return Math.max(0,GK.packsEarned()-c.opened);};
/* Hinweis „Neues Kartenpäckchen“ nur, wenn seit dem letzten Hinweis eins dazukam UND wirklich eins ungeöffnet im Kartenhaus liegt */
GK.newPack=()=>{const c=DW.state.cards=DW.state.cards||{have:{},opened:0,bonus:0,seen:0}; const e=GK.packsEarned(); if(e>(c.seen||0)){c.seen=e;DW.save();return GK.packsLeft()>0;} return false;};

/* ---------- Kleine Hilfen ---------- */
GK.progress=(i,n)=>`<div class="gk-prog">${[...Array(n)].map((_,k)=>`<span class="${k<i?'on':''}${k===i?' now':''}"></span>`).join('')}</div>`;
/* Lob / Wackeln / Hinweis-Leuchten: GK.ok / GK.no / GK.pulse setzen gk-good / gk-bad / gk-hint. Die Keyframes (css/app.css)
   animieren die eigenständigen Eigenschaften scale / rotate – das transform des Elements bleibt unberührt, per transform
   platzierte Elemente (translate(-50%,-50%), translate(x,y) …) springen also nicht weg.
   · Die Klasse wird nach dem Ende wieder abgenommen (animationend, sonst nach Zeit). Sonst gewinnt eine stehen gebliebene
     Hinweis-Klasse (CSS-Reihenfolge hint > bad > good) und dasselbe Element wackelt/hüpft nie wieder.
   · Erneutes Auslösen startet die Animation neu (Klasse ab → Reflow → Klasse an).
   · scale/rotate drehen um transform-origin VOR dem transform: ein per translate verschobenes Element würde beim Pulsen
     um den Betrag (Maßstab−1)·Verschiebung seitlich wandern. Das gleicht eine mitlaufende translate-Animation genau aus
     (nur wenn das Element verschoben ist und translate nicht selbst benutzt). */
const FX={ 'gk-good':{ms:500,ease:'ease',n:1,k:[[0,1,0],[.4,1.15,0],[1,1,0]]},
  'gk-bad':{ms:450,ease:'ease',n:1,k:[[0,1,0],[.25,1,-7],[.75,1,7],[1,1,0]]},
  'gk-hint':{ms:1200,ease:'ease-in-out',n:2,k:[[0,1,0],[.5,1.08,0],[1,1,0]]} };   // [Zeitpunkt, scale, rotate°] wie in den Keyframes
const FXN=/g[kc](good|bad|hint)/i;
function fxEnd(el){ const s=el._gkFx; if(!s) return; el._gkFx=null; clearTimeout(s.t); el.removeEventListener('animationend',s.h);
  if(s.a){ try{ s.a.cancel(); }catch(e){} } el.classList.remove(s.c); }
function fx(el,cls){ fxEnd(el); el.classList.remove('gk-good','gk-bad','gk-hint');
  void el.offsetWidth;
  const s=el._gkFx={c:cls}, f=FX[cls];
  el.classList.add(cls);
  try{ const cs=getComputedStyle(el), m=/^matrix(3d)?\(([^)]+)\)$/.exec(cs.transform||''), v=m?m[2].split(',').map(parseFloat):null,
      dx=v?v[m[1]?12:4]:0, dy=v?v[m[1]?13:5]:0;
    if((Math.abs(dx)>.5||Math.abs(dy)>.5)&&el.animate&&FXN.test(cs.animationName||'')){
      /* benutzt das Element translate selbst (z. B. Räuber im Nestbau), wird der Ausgleich dazugezählt statt es zu ersetzen */
      const own=(cs.translate||'none')!=='none';
      s.a=el.animate(f.k.map(([o,sc,deg])=>{ const r=deg*Math.PI/180, c=Math.cos(r)*sc, n=Math.sin(r)*sc;
        return {offset:o,easing:f.ease,translate:(dx-(dx*c-dy*n)).toFixed(2)+'px '+(dy-(dx*n+dy*c)).toFixed(2)+'px'}; }),
        own?{duration:f.ms,iterations:f.n,composite:'add'}:{duration:f.ms,iterations:f.n}); } }catch(e){}
  s.h=e=>{ if(e.target===el&&el._gkFx===s&&FXN.test(e.animationName)) fxEnd(el); };
  el.addEventListener('animationend',s.h);
  s.t=setTimeout(()=>{ if(el._gkFx===s) fxEnd(el); },f.ms*f.n+150); }
GK.ok=(el)=>{DW.sfx('ok'); if(el) fx(el,'gk-good');};
GK.no=(el,say)=>{DW.sfx('no'); if(el) fx(el,'gk-bad'); if(say) DW.say(say);};
GK.pulse=(el)=>{ if(!el) return; fx(el,'gk-hint'); };
GK.name=id=>DATA.nameOf(id);
GK.img=(id,opt={},cls='')=>DW.animalImg(id,Object.assign({shadow:false},opt),cls);
GK.icon=(n,cls='')=>DW.iconImg(n,cls);
/* Tierlisten */
GK.pool=(f)=>DATA.ANIMALS.filter(a=>ART.has(a.art)&&(!f||f(a)));
GK.dinos=()=>GK.pool(a=>DATA.isDino(a.id));
GK.famous=['trex','triceratops','brachiosaurus','stegosaurus','velociraptor','ankylosaurus','spinosaurus','diplodocus','parasaurolophus','pteranodon','mammut','plesiosaurus'];
/* n verschiedene zufällige Elemente */
GK.sample=(arr,n,not=[])=>DW.shuffle(arr.filter(x=>!not.includes(x))).slice(0,n);
/* Zahlen als Bilder (für Kinder ohne Lesen) */
GK.dots=(n,icon='stern')=>[...Array(n)].map(()=>DW.iconImg(icon,'gk-num')).join('');
})();
