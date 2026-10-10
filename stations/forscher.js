/* =====================================================================
   DINO-INSELWELT · Station Forscherhütte (Mein Dino-Forscherbuch / Experimentebuch)
   100 Experimente in 10 Kapiteln: Frage – Vermutung – Plan – Ergebnis – Wissen.
   Die Szenen kann man mit Wasserfarben ausmalen und Fotos dazulegen.

   Ersetzbare Bilder (grafiken-neu/experimente/…, siehe tools/grafiken-liste.txt):
     exp001 … exp100            Bild des Experiments (Malvorlage + Kachel im Kapitel)
     exp001_schritt1 …          Bild zu einem Schritt im Plan
     exp001_vermutung1 …        Bild auf einer Vermutungs-Karte (statt Emoji)
     exp001_wissen              Bild auf der Seite „Dino-Wissen“
     material_<name>            Bild eines Materials („Du brauchst“)
     buch_umschlag, kapitel_01 … kapitel_11, seite_leer, seite_hintergrund, stempel_geschafft,
     eigenes, eigenes_neu, werkzeug_<pinsel|radierer|zurueck|leeren|sticker|notiz|foto>,
     reiter_<mission|vermutung|plan|ergebnis|wissen>
   Ersetzbare Sprache (sounds-neu/sprache/…, siehe tools/sprache-liste-experimente.txt):
     jeder feste Satz hat einen Dateinamen (fb_…, exp001_…, material_…, kapitel_…), der unten angemeldet wird.
   ===================================================================== */
(function(){
"use strict";
let root, cur=null, view=null;
const FS=()=>DW.state.forscher;
const CH_ICON=['spur','waage','lauf','zahn','ei','lupe','blume','animal:pteranodon','vulkan','animal:huhn','stift'];
const COLORS=['#c8553d','#e9a03f','#f0c35a','#8fbf7a','#4f7a45','#8fbccb','#3b6f8a','#b58cbd','#a8724a','#3d3226'];
const CW=1000, CH=650;               // feste Malfläche (unabhängig von Bildschirm und Pixeldichte)
const SIZES=[14,26,40];
const X='experimente/';
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const pad2=n=>String(n).padStart(2,'0');
const slug=s=>String(s).toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
  .normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');

/* eigene Symbole */
ART.ICONS.fb_undo='<path d="M26 14L12 26l14 12" fill="none" stroke="#5a4630" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 26h22q16 0 16 12T36 50H24" fill="none" stroke="#5a4630" stroke-width="6" stroke-linecap="round"/>';
ART.ICONS.fb_schwamm='<rect x="10" y="30" width="44" height="24" rx="9" fill="#f0c35a" stroke="#4a3b2a" stroke-width="1.6"/><circle cx="22" cy="40" r="3" fill="#d9a53f"/><circle cx="34" cy="46" r="2.4" fill="#d9a53f"/><circle cx="43" cy="38" r="3.4" fill="#d9a53f"/><path d="M16 22q4-6 0-12M30 22q4-6 0-12M44 22q4-6 0-12" fill="none" stroke="#8fbccb" stroke-width="3.2" stroke-linecap="round"/>';

/* ---- kleine Bild-Ablage (IndexedDB, sonst nichts) ---- */
const IDB={db:null,open(){return new Promise(r=>{ if(this.db) return r(this.db); try{ const q=indexedDB.open('dinoInselwelt',1); q.onupgradeneeded=()=>q.result.createObjectStore('bilder'); q.onsuccess=()=>{this.db=q.result;r(this.db);}; q.onerror=()=>r(null);}catch(e){r(null);} });},
  async get(k){k=DW.profileKey(k);/* Bilder pro Profil (core.js) */const db=await this.open(); if(!db) return null; return new Promise(r=>{try{const t=db.transaction('bilder').objectStore('bilder').get(k);t.onsuccess=()=>r(t.result||null);t.onerror=()=>r(null);}catch(e){r(null);}});},
  set(k,v){k=DW.profileKey(k);const put=db=>{ if(!db) return; try{db.transaction('bilder','readwrite').objectStore('bilder').put(v,k);}catch(e){} };
    if(this.db){ put(this.db); return Promise.resolve(); }   // schon offen: sofort schreiben (wichtig beim Schließen der App)
    return this.open().then(put); }};

const BLANK="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 650'%3E%3Crect width='1000' height='650' fill='%23fffdf5'/%3E%3Cg stroke='%23d9cdb0' stroke-width='2'%3E%3Cpath d='M40 90H960'/%3E%3Cpath d='M40 150H960'/%3E%3Cpath d='M40 210H960'/%3E%3Cpath d='M40 270H960'/%3E%3Cpath d='M40 330H960'/%3E%3Cpath d='M40 390H960'/%3E%3Cpath d='M40 450H960'/%3E%3Cpath d='M40 510H960'/%3E%3Cpath d='M40 570H960'/%3E%3Cpath d='M40 630H960'/%3E%3C/g%3E%3C/svg%3E";
const OWN={n:11,t:'Meine Experimente',farbe:'#6f8a86'};
function own(){ FS().own=FS().own||[]; return FS().own; }
const BASE_E=()=>(typeof EXPERIMENTS!=='undefined'?EXPERIMENTS:[]);
const BASE_K=()=>(typeof KAPITEL!=='undefined'?KAPITEL:[]);
function exps(){ return BASE_E().concat(own()); }
function chapters(){ return BASE_K().concat([OWN]); }

/* ---------------- Ersetzbare Bilder ---------------- */
const AS=()=>window.ASSETS;
/** {k,u} des ersten vorhandenen Bildes oder null */
function picOf(keys){ const A=AS(); if(!A||!A.first) return null; const k=A.first([].concat(keys)); return k?{k,u:A.url(k)}:null; }
/** <img> mit dem Ersatzbild – oder die bisherige Zeichnung (fallback-HTML) */
function pic(keys,fallback,cls){ const p=picOf(keys); return p?`<img class="fb-pic ${cls||''}" src="${esc(p.u)}" data-fbk="${esc(p.k)}" alt="" draggable="false">`:(fallback||''); }
/** Symbol eines Werkzeugs/Reiters: experimente/<name>, sonst das gezeichnete Symbol (das seinerseits symbole/<icon> benutzt) */
const sym=(name,icon,size)=>pic(X+name,ART.icon(icon,size),'fb-sym');
/* Bild fehlt trotz Eintrag (Datei gelöscht/umbenannt): merken und die bisherige Zeichnung zeigen */
function onImgError(ev){ const t=ev.target; if(!t||t.tagName!=='IMG'||!t.dataset||!t.dataset.fbk) return;
  const k=t.dataset.fbk; delete t.dataset.fbk; if(AS()&&AS().fail) AS().fail(k);
  if(t.dataset.fb){ t.src=t.dataset.fb; return; }
  if(view&&root){ const v=view; setTimeout(()=>{ if(root&&view===v) v(); },0); } }

/* ---------------- Sätze (jeder feste Satz steht einzeln → einzeln vertonbar) ---------------- */
const F={
  willkommen:['Willkommen in der Forscherhütte!','Hier ist dein Forscherbuch mit vielen Experimenten.','Such dir ein Kapitel aus.'],
  name:['Wie heißt du?','Ein Erwachsener kann dir beim Schreiben helfen.'],
  name_fertig:['Das ist jetzt dein Forscherbuch.'],
  tippen:['Tippe ein Experiment an!'],
  zuerst:['Zuerst die Vermutung!','Was glaubst du, kommt heraus?'],
  was_glaubst_du:['Was glaubst du?'],
  oder:['oder'],
  deine_vermutung:['Deine Vermutung:'],
  ausprobieren:['Jetzt probieren wir es aus!'],
  du_brauchst:['Du brauchst:'],
  ergebnis:['Was ist herausgekommen?','Hat deine Vermutung gestimmt?'],
  gestimmt:['Super!','Deine Vermutung hat gestimmt!'],
  anders:['Spannend!','Forscher lernen gerade dann etwas, wenn es anders kommt.'],
  dino_wissen:['Hier ist noch Dino-Wissen für dich.'],
  dino_rekord:['Dino-Rekord:'],
  naechste_frage:['Nächste Forscherfrage:'],
  eigenes_wissen:['Das war dein eigenes Experiment.','Toll, dass du selbst eine Forscherfrage hattest!'],
  foto:['Tolles Foto!','Es klebt jetzt in deinem Forscherbuch.'],
  sticker:['Aufgeklebt!','Du kannst ihn verschieben.'],
  notiz:['Schreib oder sprich, was du beobachtet hast.'],
  eigene:['Hier sind deine eigenen Experimente.','Hast du eine Forscherfrage?','Dann leg ein neues Experiment an!'],
  anlegen:['Leg dein eigenes Experiment an.','Du kannst schreiben oder ins Mikrofon sprechen.'],
  /* neu in Phase 5 */
  radierer:['Das ist der Radierer.','Wisch über deine Farbe, dann ist sie wieder weg.'],
  leeren:['Alles weggewischt!','Mit dem Pfeil holst du dein Bild zurück.'],
};
const F_WO={willkommen:'Bücherregal (Start)',name:'Namen eintragen',name_fertig:'Namen eintragen (nach „Hallo …!“)',tippen:'Kapitel (nach dem Kapitelnamen)',
  zuerst:'Reiter „Ergebnis“ ohne Vermutung',was_glaubst_du:'Reiter „Vermutung“',oder:'Reiter „Vermutung“ (zwischen den Antworten)',deine_vermutung:'Vermutung gewählt (davor)',
  ausprobieren:'Vermutung gewählt (danach)',du_brauchst:'Reiter „Plan“ (vor dem Material)',ergebnis:'Reiter „Ergebnis“',gestimmt:'Ergebnis: Hat gestimmt',anders:'Ergebnis: Es war anders',
  dino_wissen:'Ergebnis (letzter Satz)',dino_rekord:'Reiter „Wissen“ (vor dem Rekord)',naechste_frage:'Reiter „Wissen“ (vor der nächsten Frage)',eigenes_wissen:'Reiter „Wissen“ bei eigenen Experimenten',
  foto:'Foto aufgenommen',sticker:'Aufkleber aufgeklebt',notiz:'Notizzettel',eigene:'Kapitel „Meine Experimente“',anlegen:'Eigenes Experiment anlegen',
  radierer:'Radierer gewählt (einmal pro Besuch)',leeren:'Alles weggewischt'};
const stepWord=j=>`Schritt ${j+1}:`;
const chapterLine=k=>`Kapitel ${k.n}: ${k.t}.`;
/* Dateinamen für die Sätze anmelden (sounds-neu/sprache/<name>.mp3 genügt dann – ohne Eintrag in saetze.txt) */
const VOX=[], voxSeen=new Map();
function vreg(name,satz,wo){ const A=AS(); satz=String(satz||'').replace(/\s+/g,' ').trim(); if(!satz||!A||!A.voiceName) return;
  const n=A.satzNorm(satz); if(!n) return; const old=voxSeen.get(n);
  if(old){ old.n++; if(old.n<=3&&old.wo.indexOf(wo)<0) old.wo+=' · '+wo; return; }
  const en={name,satz,wo,n:1}; voxSeen.set(n,en); VOX.push(en); A.voiceName(satz,name); }
(function register(){
  Object.keys(F).forEach(k=>F[k].forEach((s,i)=>vreg('fb_'+k+(F[k].length>1?'_'+(i+1):''),s,F_WO[k]||'')));
  for(let j=0;j<9;j++) vreg('fb_schritt_'+(j+1),stepWord(j),'Reiter „Plan“ (vor jedem Schritt)');
  BASE_K().forEach(k=>vreg('kapitel_'+pad2(k.n),chapterLine(k),'Kapitel '+k.n+' geöffnet'));
  BASE_E().forEach((e,i)=>{ const wo=`Experiment ${i+1} „${e.t}“`;
    vreg(e.id+'_titel',e.t+'.',wo+' · Titel');
    vreg(e.id+'_frage',e.f,wo+' · Forscherfrage');
    (e.v||[]).forEach((v,j)=>vreg(e.id+'_vermutung'+(j+1),v.l,wo+' · Vermutung '+(j+1)));
    (e.m||[]).forEach(m=>vreg('material_'+slug(m),m,'Material (Reiter „Plan“)'));
    (e.s||[]).forEach((s,j)=>vreg(e.id+'_schritt'+(j+1),s,wo+' · Schritt '+(j+1)));
    vreg(e.id+'_wissen',e.w,wo+' · Dino-Wissen');
    if(e.r) vreg(e.id+'_rekord',e.r,wo+' · Dino-Rekord');
    if(e.n) vreg(e.id+'_naechste_frage',e.n,wo+' · nächste Forscherfrage'); });
})();
const say=(parts,opt)=>DW.say(parts,opt);

function mount(r){ root=r; GK.listen(root,'error',onImgError,true); eraserTold=false; shelf(); }

/* Tippen ohne Umweg über „click“: Nach einem Wisch auf der Malfläche liefern Browser für den nächsten schnellen Tipp
   kein click-Ereignis – die Werkzeuge müssen trotzdem sofort reagieren. click bleibt für Tastatur und Vorlese-Hilfen. */
function eatClick(){ const kill=e=>{ e.stopPropagation(); e.preventDefault(); }; document.addEventListener('click',kill,{capture:true,once:true}); setTimeout(()=>document.removeEventListener('click',kill,true),350); }
function tap(el,fn){ if(!el) return; let down=false, t=0;
  el.addEventListener('pointerdown',ev=>{ if(ev.button>0) return; down=true; });
  /* das „click“, das der Browser gleich nachliefert, schlucken: es träfe sonst ein Fenster, das fn gerade geöffnet hat */
  el.addEventListener('pointerup',ev=>{ if(!down) return; down=false; t=performance.now(); eatClick(); fn(ev); });
  el.addEventListener('pointercancel',()=>{ down=false; });
  el.addEventListener('pointerleave',()=>{ down=false; });
  el.addEventListener('click',ev=>{ if(performance.now()-t<700) return; fn(ev); }); }

/* ---------------- Bücherregal ---------------- */
function shelf(){
  leave(); cur=null; view=shelf; const E=exps();
  const doneN=Object.keys(FS().done).length;
  root.innerHTML=`<div class="fill col fb-scroll">
    <div class="fb-head"><div class="fb-cover card"><div class="fb-coverpic">${pic(X+'buch_umschlag',DW.animalImg('trex',{mood:'happy'}))}</div><div><h2 class="hand fb-h">Mein Dino-Forscherbuch</h2><p style="margin:0 0 4px">Forscherin oder Forscher: <button class="linkname" id="fbName">${DW.state.name?esc(DW.state.name):'Namen eintragen'}</button></p>
      <p style="margin:0">${E.length} Experimente zum Ausprobieren, Malen und Entdecken.</p><p style="margin:4px 0 0"><b>${doneN}</b> geschafft</p></div></div></div>
    <p class="hand" style="text-align:center;font-size:26px;margin:6px 0">Such dir ein Kapitel aus!</p>
    <div class="fb-shelf">${chapters().map((k,i)=>{const list=E.filter(e=>e.k===k.n);const d=list.filter(e=>FS().done[e.id]).length;
      return `<button class="fb-book" data-k="${k.n}" style="--c:${k.farbe}"><span class="fb-spine"></span><span class="fb-ic">${pic(X+'kapitel_'+pad2(k.n),ART.icon(CH_ICON[i]||'buch'))}</span><b>${k.t}</b><small>${d} / ${list.length}</small></button>`;}).join('')}</div></div>`;
  DW.$$('.fb-book',root).forEach(b=>b.onclick=()=>{DW.sfx('pop');chapter(+b.dataset.k);});
  root.querySelector('#fbName').onclick=()=>{ const m=DW.modal(`<h2>Wie heißt du?</h2><div class="row"><input id="nmIn" class="fb-note" style="font-size:24px" maxlength="30" value="${esc(DW.state.name||'')}" placeholder="Dein Name">${micOK()?`<button class="ibtn" id="nmMic" aria-label="Diktieren">${ART.icon('mikrofon')}</button>`:''}</div><p><button class="btn go big" id="nmOk">${ART.icon('check',34)}Fertig</button></p>`);
    const inp=m.querySelector('#nmIn'); const mic=m.querySelector('#nmMic'); if(mic) mic.onclick=()=>dictate(inp,mic,true);
    m.querySelector('#nmOk').onclick=()=>{ DW.state.name=inp.value.trim().slice(0,30); DW.save(); m.close(); if(DW.state.name) say([`Hallo ${DW.state.name}!`].concat(F.name_fertig)); if(root) shelf(); }; say(F.name); };
  say(F.willkommen);
}
function chapter(n){
  leave(); cur=null;
  if(n===11) return ownChapter();
  const k=chapters().find(x=>x.n===n); if(!k) return shelf();
  const list=exps().filter(e=>e.k===n); view=()=>chapter(n);
  root.innerHTML=`<div class="fill col fb-scroll">
    <div class="row fb-chead"><button class="btn ghost" id="fbBack">${ART.icon('pfeil_l',30)}Alle Kapitel</button><h2 class="hand" style="font-size:34px;color:${k.farbe}">${k.t}</h2></div>
    <div class="menu fb-menu">${list.map(e=>`<button class="tile fb-exp" data-id="${e.id}"><div class="pic">${pic(X+e.id,`<img src="${e.bild}" alt="" draggable="false">`)}</div><b style="font-size:20px">${e.t}</b><small>${e.f}</small>${FS().done[e.id]?`<span class="done">${ART.icon('check')}</span>`:''}</button>`).join('')}</div></div>`;
  root.querySelector('#fbBack').onclick=()=>{DW.sfx('tap');shelf();};
  DW.$$('.fb-exp',root).forEach(b=>b.onclick=()=>{DW.sfx('pop');page(b.dataset.id);});
  say([chapterLine(k)].concat(F.tippen));
}

/* ---------------- Experiment-Seite ---------------- */
const MARKS=[{k:'mission',n:'Mission',ic:'stern'},{k:'guess',n:'Vermutung',ic:'lupe',f:'vermutung'},{k:'plan',n:'Plan',ic:'karte'},{k:'result',n:'Ergebnis',ic:'check',f:'ergebnis'},{k:'know',n:'Wissen',ic:'animal:trex',f:'wissen'}];
const artOf=e=>{ const p=picOf(e.bild?[X+e.id]:[X+e.id,X+'seite_leer']); const fb=e.bild||BLANK; return p?`<img src="${esc(p.u)}" data-fbk="${esc(p.k)}" data-fb="${esc(fb)}" alt="" class="fb-art" draggable="false">`:`<img src="${fb}" alt="" class="fb-art" draggable="false">`; };
async function page(id,keep){
  const E=exps(), i=E.findIndex(e=>e.id===id); if(i<0) return shelf();
  leave();
  const e=E[i], k=chapters().find(x=>x.n===e.k)||OWN, prev=cur;
  const my=cur={e,i,mark:'mission',undo:[],col:(prev&&prev.col)||COLORS[3],size:(prev&&prev.size)||SIZES[1],erase:false,dirty:false,ready:false,pid:null};
  view=()=>page(id,{mark:cur&&cur.e===e?cur.mark:'mission'});
  const bg=picOf(X+'seite_hintergrund'), bgS=bg?` style="background-image:url('${esc(bg.u)}')"`:'';
  root.innerHTML=`<div class="fb-page fill">
    <div class="fb-left card${bg?' fb-bg':''}"${bgS}><div class="fb-box" id="fbBox"><div class="fb-sheet" id="fbSheet">${artOf(e)}<canvas id="fbPaint" class="fb-paint" width="${CW}" height="${CH}" aria-label="Malfläche"></canvas><div class="fb-objs" id="fbObjs"></div>
        <div class="fb-photo" id="fbPhotoBox" hidden><img id="fbPhoto" alt="Foto" draggable="false"><button class="fb-photox" id="fbPhotoX" type="button" aria-label="Foto wegnehmen">${ART.icon('kreuz',30)}</button></div>
        ${FS().done[e.id]?stampHTML(''):''}<div class="fb-ring" id="fbRing" hidden></div></div></div>
      <div class="fb-tools" id="fbTools"><div class="fb-pal">${COLORS.map(c=>`<button class="fb-col ${c===cur.col?'sel':''}" type="button" data-c="${c}" style="background:${c}" aria-label="Farbe"></button>`).join('')}</div>
        <div class="fb-tl"><button class="fb-t" type="button" data-t="size" aria-label="Pinselgröße">${sym('werkzeug_pinsel','pinsel',22)}<span class="fb-dot" id="fbDot"></span></button>
        <button class="fb-t" type="button" data-t="erase" aria-label="Radierer" aria-pressed="false">${sym('werkzeug_radierer','radierer',40)}</button>
        <button class="fb-t" type="button" data-t="undo" aria-label="Rückgängig">${sym('werkzeug_zurueck','fb_undo',36)}</button>
        <button class="fb-t" type="button" data-t="clear" aria-label="Alles wegwischen">${sym('werkzeug_leeren','fb_schwamm',40)}</button>
        <button class="fb-t" type="button" data-t="stick" aria-label="Sticker aufkleben">${pic(X+'werkzeug_sticker',ART.icon('animal:triceratops',42),'fb-sym')}</button>
        <button class="fb-t" type="button" data-t="note" aria-label="Notizzettel">${sym('werkzeug_notiz','stift',38)}</button>
        <label class="fb-t" aria-label="Foto">${sym('werkzeug_foto','kamera',38)}<input type="file" accept="image/*" capture="environment" id="fbCam" hidden></label></div></div></div>
    <div class="fb-right card${bg?' fb-bg':''}"${bgS}><div class="fb-marks">${MARKS.map(m=>`<button class="fb-mark" type="button" data-m="${m.k}">${sym('reiter_'+(m.f||m.k),m.ic,28)}<span>${m.n}</span></button>`).join('')}</div>
      <div class="fb-body" id="fbBody"></div>
      <div class="fb-nav"><button class="ibtn" id="fbPrev" type="button" aria-label="Vorheriges Experiment">${ART.icon('pfeil_l')}</button><span class="hand" style="font-size:20px;color:${k.farbe}">${k.t} · ${e.k===11?'eigenes':(i+1)+'/'+BASE_E().length}</span><button class="ibtn" id="fbNext" type="button" aria-label="Nächstes Experiment">${ART.icon('pfeil_r')}</button><button class="btn ghost" id="fbCh" type="button" style="min-height:var(--tap)">${ART.icon('buch',30)}Kapitel</button></div></div></div>`;
  DW.$$('.fb-mark',root).forEach(b=>b.onclick=()=>{DW.sfx('tap');show(b.dataset.m);});
  root.querySelector('#fbPrev').onclick=()=>{DW.sfx('tap');turn(-1,()=>page(E[(i+E.length-1)%E.length].id));};
  root.querySelector('#fbNext').onclick=()=>{DW.sfx('tap');turn(1,()=>page(E[(i+1)%E.length].id));};
  root.querySelector('#fbCh').onclick=()=>{DW.sfx('tap');chapter(e.k);};
  paintSetup(e); objsSetup(e); fitSheet();
  if(window.ResizeObserver){ let rq=0; const ro=new ResizeObserver(()=>{ if(cur!==my){ ro.disconnect(); return; } if(!rq) rq=requestAnimationFrame(()=>{ rq=0; if(cur===my) fitSheet(); }); }); ro.observe(root.querySelector('#fbBox')); ro.observe(root.querySelector('.fb-page')); my.ro=ro; }
  else GK.listen(window,'resize',()=>{ if(cur===my) fitSheet(); });
  show(keep&&keep.mark||'mission',keep?{quiet:true}:null);
  /* gespeichertes Bild und Foto laden – erst danach darf gemalt werden (sonst würde „Rückgängig“ das alte Bild verlieren) */
  if(paintMem.has(e.id)){ const old=paintMem.get(e.id); if(old&&old!==my.cv){ try{ my.ctx.drawImage(old,0,0,CW,CH); }catch(err){} } }
  else { const saved=await IDB.get('paint:'+e.id);
    if(cur!==my||!root) return;
    if(saved&&typeof saved==='string') await new Promise(res=>{ const im=new Image(); im.onload=()=>{ if(cur===my) my.ctx.drawImage(im,0,0,CW,CH); res(); }; im.onerror=()=>res(); im.src=saved; });
    if(cur!==my||!root) return; }
  my.ready=true;
  const ph=await IDB.get('photo:'+e.id); if(cur!==my||!root||!root.querySelector('#fbPhoto')) return;
  if(ph) setPhoto(ph);
}
const stampHTML=cls=>`<div class="fb-stamp hand ${cls}">${pic(X+'stempel_geschafft','Geschafft!')}</div>`;
/* Blatt so groß wie möglich, aber immer im Verhältnis 1000:650 (sonst würden Bild und Pinsel verzerrt) */
function fitSheet(){ if(!root) return; const box=root.querySelector('#fbBox'), sh=root.querySelector('#fbSheet'), pg=root.querySelector('.fb-page'), tl=root.querySelector('#fbTools'); if(!box||!sh||!pg) return;
  const colMode=getComputedStyle(pg).flexDirection==='column'; pg.classList.toggle('fb-colmode',colMode);
  const bw=box.clientWidth, bh=colMode?Math.max(170,pg.clientHeight*.52):box.clientHeight; if(bw<20||bh<20) return;
  const w=Math.floor(Math.max(120,Math.min(bw,bh*CW/CH)));
  sh.style.width=w+'px'; sh.style.height=Math.round(w*CH/CW)+'px'; sh.style.setProperty('--u',(w/CW)+'px');
  if(tl) tl.classList.toggle('fb-narrow',tl.clientWidth<600);
  const ring=root.querySelector('#fbRing'); if(ring) ring.hidden=true; }
function marksState(){ const e=cur.e; DW.$$('.fb-mark',root).forEach(b=>{ const m=b.dataset.m; b.classList.toggle('on',m===cur.mark);
  b.classList.toggle('ok',(m==='guess'&&FS().guess[e.id]!=null)||(m==='result'&&FS().result[e.id]!=null)||(m==='mission')); }); }
const micOK=()=>!!(window.SpeechRecognition||window.webkitSpeechRecognition);
function show(m,opt){
  if(!cur||!root) return; const e=cur.e, body=root.querySelector('#fbBody'), id=e.id; if(!body) return;
  let parts=null, quiet=opt&&opt.quiet;
  if(m==='result'&&FS().guess[id]==null){ m='guess'; if(!quiet){ say(F.zuerst); quiet=true; } }
  cur.mark=m; marksState(); body.scrollTop=0;
  const labels=(e.v||[]).map(v=>v.l);
  if(m==='mission'){ body.innerHTML=`<div class="pill">${e.k===11?'Mein Experiment':'Experiment '+(cur.i+1)}</div><h2 class="hand fb-title">${esc(e.t)}</h2><p class="fb-q">${esc(e.f)}</p>
      <p style="color:var(--ink2)">So geht’s: Erst vermuten, dann ausprobieren, dann aufschreiben oder malen, was herauskam.</p>
      <button class="btn go big" id="fbStart" type="button">${ART.icon('pfeil_r',36)}Los geht’s!</button>`;
    body.querySelector('#fbStart').onclick=()=>{DW.sfx('tap');show('guess');}; parts=[e.t+'.',e.f]; }
  if(m==='guess'){ const g=FS().guess[id];
    body.innerHTML=`<h2 class="hand fb-title">Was glaubst du?</h2><p class="fb-q">${esc(e.f)}</p><div class="fb-choices">${(e.v||[]).map((v,j)=>`<button class="fb-choice ${g===j?'sel':''}" type="button" data-j="${j}"><span class="fb-emo">${pic(X+id+'_vermutung'+(j+1),esc(v.e))}</span><span>${esc(v.l)}</span></button>`).join('')}</div>
      ${g!=null?`<button class="btn go" id="fbToPlan" type="button">${ART.icon('pfeil_r',32)}Weiter zum Plan</button>`:''}`;
    DW.$$('.fb-choice',body).forEach(b=>b.onclick=()=>{ const j=+b.dataset.j; FS().guess[id]=j; DW.save(); DW.sfx('pop'); show('guess',{quiet:true}); say(F.deine_vermutung.concat([e.v[j].l,'.'],F.ausprobieren)); });
    const tp=body.querySelector('#fbToPlan'); if(tp) tp.onclick=()=>{DW.sfx('tap');show('plan');};
    parts=F.was_glaubst_du.concat([e.f]); labels.forEach((l,j)=>{ if(j) parts.push(', '+F.oder[0]); parts.push(l); }); parts.push('?'); }
  if(m==='plan'){ const mats=e.m||[], steps=e.s||[];
    body.innerHTML=`<h2 class="hand fb-title">Der Plan</h2>${mats.length?`<p class="fb-mats"><b>Du brauchst:</b> ${mats.map((x,j)=>{ const im=pic(X+'material_'+slug(x),''); return im?`<span class="fb-mat">${im}${esc(x)}</span>`:esc(x)+(j<mats.length-1?',':''); }).join(' ')}</p>`:''}
      <ol class="fb-steps">${steps.map((s,j)=>`<li><button class="fb-step" type="button" data-j="${j}"><span class="fb-num">${j+1}</span>${pic(X+id+'_schritt'+(j+1),'','fb-stepimg')}<span>${esc(s)}</span></button></li>`).join('')}</ol>
      <button class="btn go" id="fbToRes" type="button">${ART.icon('check',32)}Ausprobiert!</button>`;
    DW.$$('.fb-step',body).forEach(b=>b.onclick=()=>{b.classList.toggle('done');DW.sfx('click');say([steps[+b.dataset.j]]);});
    body.querySelector('#fbToRes').onclick=()=>{DW.sfx('tap');show('result');};
    parts=[]; if(mats.length){ parts=F.du_brauchst.slice(); mats.forEach((x,j)=>{ if(j) parts.push(','); parts.push(x); }); parts.push('.'); }
    steps.forEach((s,j)=>parts.push(stepWord(j),s)); }
  if(m==='result'){ const g=FS().guess[id], r=FS().result[id], note=FS().note[id]||'';
    body.innerHTML=`<h2 class="hand fb-title">Was ist herausgekommen?</h2><p>Deine Vermutung war: <b>${e.v&&e.v[g]?`<span class="fb-emo small">${pic(X+id+'_vermutung'+(g+1),esc(e.v[g].e))}</span> `+esc(e.v[g].l):''}</b></p>
      <div class="row" style="flex-wrap:wrap"><button class="btn ${r===1?'go':'ghost'} big" type="button" data-r="1">${ART.icon('check',36)}Hat gestimmt!</button><button class="btn ${r===0?'sun':'ghost'} big" type="button" data-r="0">${ART.icon('stern',36)}Es war anders!</button></div>
      <p style="margin:10px 0 4px">Mal es auf die Seite oder mach ein Foto. Hier kannst du etwas dazuschreiben:</p>
      <div class="row"><textarea id="fbNote" class="fb-note" rows="3" placeholder="Meine Beobachtung …">${esc(note)}</textarea>${micOK()?`<button class="ibtn" id="fbMic" type="button" aria-label="Diktieren">${ART.icon('mikrofon')}</button>`:''}</div>`;
    DW.$$('[data-r]',body).forEach(b=>b.onclick=()=>{ if(cur.finT&&Date.now()-cur.finT<1200) return; cur.finT=Date.now(); FS().result[id]=+b.dataset.r; DW.save();
      DW.$$('[data-r]',body).forEach(x=>{ const on=x===b; x.classList.toggle('ghost',!on); x.classList.toggle('go',on&&x.dataset.r==='1'); x.classList.toggle('sun',on&&x.dataset.r==='0'); }); marksState(); finish(); });
    body.querySelector('#fbNote').oninput=ev=>{FS().note[id]=ev.target.value;DW.save();};
    const mic=body.querySelector('#fbMic'); if(mic) mic.onclick=()=>dictate(body.querySelector('#fbNote'),mic);
    parts=F.ergebnis; }
  if(m==='know'){ const dino=cur.dino||(cur.dino=DW.pick(GK.dinos().map(a=>a.id)));
    body.innerHTML=`<h2 class="hand fb-title">Dino-Wissen</h2><div class="fb-knowpic">${pic(X+id+'_wissen',DW.animalImg(dino,{mood:'happy'}))}</div>
      <p class="fb-q">${e.w?esc(e.w):F.eigenes_wissen.join(' ')}</p>${e.r?`<p><b>Dino-Rekord:</b> ${esc(e.r)}</p>`:''}${e.n?`<p style="color:var(--ink2)"><b>Nächste Forscherfrage:</b> ${esc(e.n)}</p><button class="btn warm" id="fbNextQ" type="button">${ART.icon('stift',32)}Als eigenes Experiment ausprobieren</button>`:''}`;
    const nq=body.querySelector('#fbNextQ'); if(nq) nq.onclick=()=>{DW.sfx('tap');editOwn({f:e.n,t:e.n.replace(/\?$/,'')});};
    parts=e.w?[e.w]:F.eigenes_wissen.slice(); if(e.r) parts=parts.concat(F.dino_rekord,[e.r]); if(e.n) parts=parts.concat(F.naechste_frage,[e.n]); }
  if(!quiet&&parts) say(parts);
}
function finish(){
  const e=cur.e, my=cur, first=!FS().done[e.id]; FS().done[e.id]=Date.now(); DW.save();
  DW.sfx('win'); DW.confetti(50);
  if(first){ DW.addStars('forscher',1); const n=Object.keys(FS().done).length; if(n>=1) DW.addSticker('forscher'); if(n%5===0){ const f=DW.pick(DATA.FINDS); DW.addFind(f.id);} }
  const sh=root.querySelector('#fbSheet'); if(sh&&!sh.querySelector('.fb-stamp')) sh.insertAdjacentHTML('beforeend',stampHTML('pop'));
  /* erst ausreden lassen, dann zum Dino-Wissen blättern (früher wurde der Satz nach 2,6 s abgeschnitten) */
  const t0=Date.now(); let fired=false;
  const go=()=>{ if(cur===my&&root&&root.querySelector('#fbBody')&&cur.mark==='result') show('know'); };
  const once=()=>{ if(fired) return; fired=true; GK.after(Math.max(300,2600-(Date.now()-t0)),go); };
  const p=say((FS().result[e.id]?F.gestimmt:F.anders).concat(F.dino_wissen)); if(p&&p.then) p.then(once,once); GK.after(9000,once);
}
function dictate(ta,btn,replace){ const R=window.SpeechRecognition||window.webkitSpeechRecognition; if(!R||!ta) return; try{ const r=new R(); r.lang='de-DE'; r.interimResults=false; btn.classList.add('glow');
  r.onresult=ev=>{ const t=ev.results[0][0].transcript; ta.value=replace?t:(ta.value?ta.value+' ':'')+t; ta.dispatchEvent(new Event('input')); };
  r.onend=r.onerror=()=>btn.classList.remove('glow'); r.start(); }catch(e){ btn.classList.remove('glow'); } }

/* ---------------- Malen (Wasserfarben) ----------------
   Zwei Ebenen: unten die Vorlage (<img class="fb-art">), darüber die eigene Zeichnung (<canvas>, 1000×650).
   Der Radierer löscht nur auf der Zeichen-Ebene – die Vorlage bleibt immer stehen. */
let eraserTold=false;
const paintMem=new Map();            // zuletzt gemalte Seiten als Malfläche (sofort da – auch wenn IndexedDB fehlt oder noch schreibt)
function isBlank(ctx){ try{ const d=ctx.getImageData(0,0,CW,CH).data; for(let i=3;i<d.length;i+=4) if(d[i]>6) return false; return true; }catch(e){ return false; } }
function paintSetup(e){
  const cv=root.querySelector('#fbPaint'), sheet=root.querySelector('#fbSheet'), ring=root.querySelector('#fbRing'), tools=root.querySelector('#fbTools');
  const ctx=cv.getContext('2d',{willReadFrequently:true}); const my=cur; my.cv=cv; my.ctx=ctx;
  const eraseR=()=>my.size*1.15, R=()=>my.erase?eraseR():my.size;
  const ui=()=>{ const d=root.querySelector('#fbDot'), eb=root.querySelector('[data-t=erase]'); if(!d||!eb) return;
    const px=Math.round(10+SIZES.indexOf(my.size)*8); d.style.width=d.style.height=px+'px'; d.style.background=my.erase?'#fff':my.col;
    tools.classList.toggle('fb-erasing',my.erase); eb.classList.toggle('sel',my.erase); eb.setAttribute('aria-pressed',my.erase?'true':'false');
    DW.$$('.fb-col',root).forEach(b=>b.classList.toggle('sel',b.dataset.c===my.col));
    cv.classList.toggle('fb-erasecur',my.erase); };
  ui();
  DW.$$('.fb-col',root).forEach(b=>tap(b,()=>{ my.col=b.dataset.c; my.erase=false; ui(); DW.sfx('click'); }));
  const undoBtn=root.querySelector('[data-t=undo]');
  const pushUndo=()=>{ try{ if(my.undo.length>=10) my.undo.shift(); my.undo.push(ctx.getImageData(0,0,CW,CH)); }catch(err){} };
  const nope=b=>{ b.classList.remove('fb-nope'); void b.offsetWidth; b.classList.add('fb-nope'); };
  tap(root.querySelector('[data-t=size]'),()=>{ my.size=SIZES[(SIZES.indexOf(my.size)+1)%SIZES.length]; ui(); DW.sfx('click'); });
  tap(root.querySelector('[data-t=erase]'),()=>{ my.erase=!my.erase; ui(); DW.sfx('click'); if(my.erase&&!eraserTold){ eraserTold=true; say(F.radierer); } });
  tap(undoBtn,()=>{ if(my.pid!=null) return; const u=my.undo.pop(); if(!u){ nope(undoBtn); return; } ctx.clearRect(0,0,CW,CH); ctx.putImageData(u,0,0); undoBtn.classList.remove('glow'); DW.sfx('pop'); save(); });
  tap(root.querySelector('[data-t=clear]'),ev=>{ if(!my.ready||my.pid!=null) return; if(isBlank(ctx)){ nope(ev.currentTarget||root.querySelector('[data-t=clear]')); return; }
    pushUndo(); ctx.clearRect(0,0,CW,CH); DW.sfx('whoosh'); undoBtn.classList.add('glow'); GK.after(4000,()=>undoBtn.classList.remove('glow')); save(); say(F.leeren); });
  root.querySelector('#fbCam').onchange=ev=>{ const f=ev.target.files[0]; ev.target.value=''; if(!f) return; const rd=new FileReader(); rd.onload=()=>{ const im=new Image(); im.onload=()=>{ if(cur!==my||!root) return; const c=document.createElement('canvas'), s=Math.min(1,900/Math.max(im.width,im.height)); c.width=Math.max(1,Math.round(im.width*s)); c.height=Math.max(1,Math.round(im.height*s)); c.getContext('2d').drawImage(im,0,0,c.width,c.height);
      const url=c.toDataURL('image/jpeg',.82); setPhoto(url); IDB.set('photo:'+my.e.id,url); DW.sfx('magic'); say(F.foto); }; im.src=rd.result; }; rd.readAsDataURL(f); };
  const pb=root.querySelector('#fbPhotoBox');
  root.querySelector('#fbPhoto').onclick=()=>pb.classList.toggle('big');
  root.querySelector('#fbPhotoX').onclick=ev=>{ ev.stopPropagation(); pb.hidden=true; pb.classList.remove('big'); root.querySelector('#fbPhoto').removeAttribute('src'); IDB.set('photo:'+my.e.id,''); DW.sfx('pop'); };

  /* Zeiger → Koordinaten der Malfläche (stimmt bei jeder Größe, Drehung und Pixeldichte) */
  const pos=ev=>{ const r=cv.getBoundingClientRect(); return [(ev.clientX-r.left)*CW/(r.width||1),(ev.clientY-r.top)*CH/(r.height||1)]; };
  const ringAt=ev=>{ const r=sheet.getBoundingClientRect(), s=r.width/CW, d=Math.max(10,2*R()*s);
    ring.style.width=ring.style.height=d+'px'; ring.style.transform=`translate(${ev.clientX-r.left-d/2}px,${ev.clientY-r.top-d/2}px)`;
    ring.style.borderColor=my.erase?'#4a3b2a':my.col; ring.classList.toggle('er',my.erase); ring.hidden=false; };
  let last=null;
  const stroke=(a,b)=>{ const n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/4));
    for(let k=1;k<=n;k++){ const x=a[0]+(b[0]-a[0])*k/n, y=a[1]+(b[1]-a[1])*k/n;
      if(my.erase){ const r=eraseR(); ctx.save(); ctx.globalCompositeOperation='destination-out';
        /* WICHTIG: eigene, deckende Füllung. Ohne sie blieb der letzte (fast durchsichtige) Wasserfarben-Verlauf als
           Füllung stehen – der Radierer löschte dann so gut wie nichts. */
        const g=ctx.createRadialGradient(x,y,r*.78,x,y,r); g.addColorStop(0,'rgba(0,0,0,1)'); g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); ctx.restore(); continue; }
      const r=my.size*(.85+Math.random()*.3); const g=ctx.createRadialGradient(x,y,r*.2,x,y,r); g.addColorStop(0,hexA(my.col,.10)); g.addColorStop(.75,hexA(my.col,.08)); g.addColorStop(1,hexA(my.col,0));
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x+(Math.random()-.5)*3,y+(Math.random()-.5)*3,r,0,7); ctx.fill(); } };
  cv.addEventListener('pointerdown',ev=>{ if(ev.button>0||!my.ready||cur!==my) return; ev.preventDefault();
    if(my.pid!=null) return;                                   // zweiter Finger: ignorieren (sonst Striche quer übers Blatt)
    my.pid=ev.pointerId; try{ cv.setPointerCapture(ev.pointerId); }catch(err){}
    pushUndo(); my.dirty=true;                                 // ab jetzt gibt es etwas zu sichern (auch wenn mitten im Strich geschlossen wird)
    last=pos(ev); stroke(last,last); ringAt(ev); });
  cv.addEventListener('pointermove',ev=>{
    if(my.pid==null){ if(ev.pointerType==='mouse') ringAt(ev); return; }
    if(ev.pointerId!==my.pid) return;
    const list=ev.getCoalescedEvents?ev.getCoalescedEvents():null;
    (list&&list.length?list:[ev]).forEach(c=>{ const p=pos(c); stroke(last,p); last=p; }); ringAt(ev); });
  const up=ev=>{ if(my.pid==null||ev.pointerId!==my.pid) return; my.pid=null; last=null; if(ev.pointerType!=='mouse'||ev.type!=='pointerup') ring.hidden=true; save(); };
  cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up); cv.addEventListener('lostpointercapture',up);
  cv.addEventListener('pointerleave',()=>{ if(my.pid==null) ring.hidden=true; });
}
function setPhoto(url){ const pb=root&&root.querySelector('#fbPhotoBox'); if(!pb) return; root.querySelector('#fbPhoto').src=url; pb.hidden=false; }
/* ---------------- Aufkleber & Notizzettel ---------------- */
const STICK=['trex','triceratops','stegosaurus','brachiosaurus','velociraptor','pteranodon','ankylosaurus','parasaurolophus','mammut','plesiosaurus'];
// Aufkleber: die bekannten Tiere plus alle, die schon im Rucksack sind
function stickList(){ const have=Object.keys(DW.state.animals||{}).filter(id=>DATA.animal(id)&&ART.has(DATA.animal(id).art)&&!STICK.includes(id)); return STICK.concat(have.slice(0,40)); }
function objsSetup(e){
  FS().obj=FS().obj||{}; const my=cur, box=root.querySelector('#fbObjs'); const list=()=>FS().obj[e.id]=FS().obj[e.id]||[];
  const render=()=>{ if(!box.isConnected) return; box.innerHTML=list().map((o,j)=>o.t==='note'?`<div class="fb-o fb-notez hand" data-j="${j}" style="left:${o.x}%;top:${o.y}%">${esc(o.v||'')}</div>`:`<div class="fb-o fb-stk" data-j="${j}" style="left:${o.x}%;top:${o.y}%">${DW.animalImg(o.v,{shadow:false})}</div>`).join('');
    DW.$$('.fb-o',box).forEach(el=>{ const o=list()[+el.dataset.j]; let st=null,moved=false;
      el.addEventListener('pointerdown',ev=>{ ev.stopPropagation(); if(ev.button>0||st) return; ev.preventDefault(); try{ el.setPointerCapture(ev.pointerId); }catch(err){} st={id:ev.pointerId,x:ev.clientX,y:ev.clientY,ox:o.x,oy:o.y}; moved=false; el.classList.add('fb-lift'); });
      el.addEventListener('pointermove',ev=>{ if(!st||ev.pointerId!==st.id) return; const r=box.getBoundingClientRect(); if(Math.hypot(ev.clientX-st.x,ev.clientY-st.y)>8) moved=true; if(!moved) return;
        const dx=(ev.clientX-st.x)/r.width*100, dy=(ev.clientY-st.y)/r.height*100; o.x=DW.clamp(st.ox+dx,-5,95); o.y=DW.clamp(st.oy+dy,-5,95); el.style.left=o.x+'%'; el.style.top=o.y+'%'; });
      const end=ev=>{ if(!st||ev.pointerId!==st.id) return; const tapped=ev.type==='pointerup'&&!moved; st=null; el.classList.remove('fb-lift'); DW.save(); if(!tapped) return; eatClick();
        const m=DW.modal(`<div style="text-align:center"><h2>${o.t==='note'?'Notizzettel':'Aufkleber'}</h2>${o.t==='note'?`<textarea id="oTx" class="fb-note" rows="3" style="width:100%">${esc(o.v||'')}</textarea>`:`<div class="fb-stkbig">${DW.animalImg(o.v,{shadow:false})}</div>`}<div class="row" style="justify-content:center;margin-top:10px;flex-wrap:wrap">${o.t==='note'?`<button class="btn go" id="oOk" type="button">${ART.icon('check',30)}Fertig</button>`:''}<button class="btn warm" id="oDel" type="button">${ART.icon('radierer',30)}Wegnehmen</button></div></div>`);
        const ok=m.querySelector('#oOk'); if(ok) ok.onclick=()=>{ const v=m.querySelector('#oTx').value.trim(); if(v) o.v=v; else { const ix=list().indexOf(o); if(ix>=0) list().splice(ix,1); } DW.save(); m.close(); render(); };
        m.querySelector('#oDel').onclick=()=>{ const ix=list().indexOf(o); if(ix>=0) list().splice(ix,1); DW.save(); m.close(); render(); DW.sfx('pop'); }; };
      el.addEventListener('pointerup',end); el.addEventListener('pointercancel',end); el.addEventListener('lostpointercapture',end);
    }); };
  render();
  tap(root.querySelector('[data-t=stick]'),()=>{ if(cur!==my) return; DW.sfx('pop'); const m=DW.modal(`<h2>Aufkleber</h2><div class="grid fb-stickgrid">${stickList().map(id=>`<button class="cell" type="button" data-id="${id}">${DW.animalImg(id,{shadow:false})}<b>${DATA.nameOf(id)}</b></button>`).join('')}</div>`);
    DW.$$('.cell',m).forEach(c=>c.onclick=()=>{ if(list().length>=40) list().shift(); list().push({t:'dino',v:c.dataset.id,x:35+Math.random()*20,y:30+Math.random()*20}); DW.save(); m.close(); render(); DW.sfx('pop'); say(F.sticker); }); });
  tap(root.querySelector('[data-t=note]'),()=>{ if(cur!==my) return; DW.sfx('pop'); const m=DW.modal(`<h2>Notizzettel</h2><div class="row"><textarea id="nTx" class="fb-note" rows="3" maxlength="140" placeholder="Was hast du beobachtet?"></textarea>${micOK()?`<button class="ibtn" id="nMic" type="button" aria-label="Diktieren">${ART.icon('mikrofon')}</button>`:''}</div><p><button class="btn go big" id="nOk" type="button">${ART.icon('check',34)}Aufkleben</button></p>`);
    const mic=m.querySelector('#nMic'); if(mic) mic.onclick=()=>dictate(m.querySelector('#nTx'),mic);
    m.querySelector('#nOk').onclick=()=>{ const v=m.querySelector('#nTx').value.trim(); if(v){ list().push({t:'note',v,x:8+Math.random()*10,y:16+Math.random()*10}); DW.save(); render(); } m.close(); }; say(F.notiz); });
}
/* ---------------- Umblättern ---------------- */
function turn(dir,cb){ flush(); const p=root.querySelector('.fb-page'); if(!p||matchMedia('(prefers-reduced-motion: reduce)').matches) return cb();
  if(p.dataset.turning) return; p.dataset.turning='1';
  p.classList.add(dir>0?'turn-next':'turn-prev'); DW.sfx('whoosh'); GK.after(330,()=>{ if(!root) return; cb(); const q=root.querySelector('.fb-page'); if(q){ q.classList.add(dir>0?'turn-in-next':'turn-in-prev'); } }); }
/* ---------------- Eigene Experimente ---------------- */
function ownChapter(){
  view=ownChapter;
  root.innerHTML=`<div class="fill col fb-scroll">
    <div class="row fb-chead"><button class="btn ghost" id="fbBack">${ART.icon('pfeil_l',30)}Alle Kapitel</button><h2 class="hand" style="font-size:34px;color:${OWN.farbe}">${OWN.t}</h2></div>
    <div class="menu fb-menu"><button class="tile" id="ownNew"><div class="pic">${pic(X+'eigenes_neu',ART.icon('stift',90))}</div><b>Neues Experiment</b><small>Deine eigene Forscherfrage</small></button>
    ${own().map(e=>`<button class="tile fb-exp" data-id="${e.id}"><div class="pic">${pic([X+e.id,X+'eigenes'],ART.icon('lupe',80))}</div><b style="font-size:20px">${esc(e.t)}</b><small>${esc(e.f||'')}</small>${FS().done[e.id]?`<span class="done">${ART.icon('check')}</span>`:''}</button>`).join('')}</div></div>`;
  root.querySelector('#fbBack').onclick=()=>{DW.sfx('tap');shelf();};
  root.querySelector('#ownNew').onclick=()=>{DW.sfx('pop');editOwn({});};
  DW.$$('.fb-exp',root).forEach(b=>b.onclick=()=>{DW.sfx('pop');page(b.dataset.id);});
  say(F.eigene);
}
function editOwn(pre){
  const fld=(id,lab,val,rows)=>`<label style="display:block;margin:8px 0 2px;font-weight:700" for="${id}">${lab}</label><div class="row"><textarea id="${id}" class="fb-note" rows="${rows}" maxlength="${rows>2?600:160}">${esc(val||'')}</textarea>${micOK()?`<button class="ibtn" type="button" data-mic="${id}" aria-label="Diktieren">${ART.icon('mikrofon')}</button>`:''}</div>`;
  const m=DW.modal(`<h2>Mein Experiment</h2>${fld('oT','Wie heißt dein Experiment?',pre.t,1)}${fld('oF','Deine Forscherfrage',pre.f,2)}${fld('oS','Was machst du? (jede Zeile ein Schritt)',pre.s?pre.s.join('\n'):'',4)}
    <p><button class="btn go big" id="oSave" type="button">${ART.icon('check',34)}Speichern</button></p>`);
  DW.$$('[data-mic]',m).forEach(b=>b.onclick=()=>dictate(m.querySelector('#'+b.dataset.mic),b));
  m.querySelector('#oSave').onclick=()=>{ if(!root) return; const t=m.querySelector('#oT').value.trim()||'Mein Experiment', f=m.querySelector('#oF').value.trim()||t+'?', st=m.querySelector('#oS').value.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,9);
    const e={id:'own'+Date.now(),k:11,t,f,s:st.length?st:['Probier es aus!','Schau genau hin.','Mal oder schreib auf, was passiert.'],m:[],v:[{e:'👍',l:'Ja, bestimmt'},{e:'👎',l:'Nein'},{e:'🤔',l:'Mal sehen'}],w:'',bild:null};
    own().push(e); DW.save(); m.close(); DW.sfx('magic'); DW.addSticker('eigenes'); page(e.id); };
  say(F.anlegen);
}
function hexA(h,a){const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`;}
/* ---------------- Speichern der Zeichnung ----------------
   save() = bald sichern (während des Malens), flush() = jetzt (Blättern, Kapitel, Schließen),
   flush(true) = sofort und ohne Umweg (App geht in den Hintergrund).
   Das PNG wird nebenher erzeugt (toBlob) – sonst ruckelt das Malen bei vollen Bildern (bis 0,2 s Pause pro Strich). */
let saveT=null; const saveSeq={}, pend=new Map();   // pend: Seiten, deren PNG gerade noch erzeugt wird
function leave(){ flush(); if(cur&&cur.ro){ try{cur.ro.disconnect();}catch(e){} cur.ro=null; } }
function writeNow(id,cv){ saveSeq[id]=(saveSeq[id]||0)+1; pend.delete(id); try{ IDB.set('paint:'+id,cv.toDataURL('image/png')); }catch(e){} }
function flush(now){ clearTimeout(saveT); saveT=null; const c=cur;
  if(c&&c.cv&&c.dirty){ c.dirty=false;
    const id=c.e.id, cv=c.cv, key='paint:'+id, blank=isBlank(c.ctx);
    paintMem.delete(id); paintMem.set(id,blank?null:cv); if(paintMem.size>6) paintMem.delete(paintMem.keys().next().value);
    if(blank){ saveSeq[id]=(saveSeq[id]||0)+1; pend.delete(id); IDB.set(key,''); }
    else if(now===true||!cv.toBlob) writeNow(id,cv);
    else { const n=saveSeq[id]=(saveSeq[id]||0)+1; pend.set(id,cv);
      try{ cv.toBlob(bl=>{ if(saveSeq[id]!==n) return; if(!bl) return writeNow(id,cv);
        const rd=new FileReader(); rd.onload=()=>{ if(saveSeq[id]!==n) return; pend.delete(id); IDB.set(key,rd.result); }; rd.onerror=()=>{ if(saveSeq[id]===n) writeNow(id,cv); }; rd.readAsDataURL(bl); },'image/png'); }catch(e){ writeNow(id,cv); } } }
  if(now===true) [...pend].forEach(([id,cv])=>writeNow(id,cv)); }
/* App geht in den Hintergrund / wird geschlossen: alles Offene sofort schreiben (auch nach dem Verlassen der Station) */
document.addEventListener('visibilitychange',()=>{ if(document.hidden) flush(true); });
window.addEventListener('pagehide',()=>flush(true));
function save(){ if(!cur||!cur.cv) return; cur.dirty=true; clearTimeout(saveT); saveT=setTimeout(flush,400); }
function unmount(){ flush(true); leave(); cur=null; root=null; view=null; const o=DW.$('#overlay'); if(o){ o.hidden=true; o.innerHTML=''; } }
DW.stations.forscher={title:'Forscherhütte',mount,unmount};
/* nur zum Testen und zum Erzeugen der Sprachliste (index.html?debug=1) */
if(window.DW_DEBUG) window.__fb={voiceList:()=>VOX.map(v=>[v.name,v.satz,v.wo,v.n]),cur:()=>cur,slug,flush};
})();
