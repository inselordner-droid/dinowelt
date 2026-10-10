/* =====================================================================
   DINO-INSELWELT · core.js
   Spielstand, Vorlesen, Töne, Belohnungen, Ziehen & Ablegen, Navigation
   ===================================================================== */
(function(){
"use strict";
const DW = window.DW = {stations:{}};
const $ = (s,r=document)=>r.querySelector(s);
DW.$=$; DW.$$=(s,r=document)=>[...r.querySelectorAll(s)];
DW.h = (html)=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild;};
DW.clamp=(v,a,b)=>v<a?a:v>b?b:v; DW.lerp=(a,b,u)=>a+(b-a)*u;
DW.rand=(a,b)=>a+Math.random()*(b-a); DW.pick=a=>a[Math.floor(Math.random()*a.length)];
DW.shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
DW.wait=ms=>new Promise(r=>setTimeout(r,ms));

/* ---------------- Spielstand & Profile ----------------
   Mehrere Kinder auf einem Gerät: jedes Profil hat einen eigenen, vollständigen DW.state.
   · Profil „p1“ nutzt weiter den alten Schlüssel (alte Spielstände werden so automatisch zu Profil 1).
   · Einstellungen (Ton, Vorlesen, Tempo …) gelten fürs ganze Gerät und werden zwischen Profilen geteilt.
   · DW.state bleibt beim Profilwechsel DASSELBE Objekt (Inhalt wird ersetzt) – Module, die sich
     DW.state gemerkt haben, sehen also immer das aktive Profil. Nach Wechsel auf der Karte lädt die App neu.
   · Bilder in IndexedDB (Datenbank 'dinoInselwelt', Speicher 'bilder') pro Profil: Schlüssel immer über
     DW.profileKey('paint:'+id) bilden (p1 → unverändert, andere → 'p3|paint:…'). */
const KEY='dinoInselwelt.v1', PKEY='dinoInselwelt.profiles';
const skey=id=>id==='p1'?KEY:KEY+'.'+id;
const DEFAULT={v:1,uid:'',avatar:null,name:'',figVoice:null,own:null,started:false,pos:null,animals:{},finds:{},stickers:{},stars:{},
  portal:{right:{},visited:false},museum:{seen:{}},run:{eggs:0,best:0,dino:'trex',biome:'tal'},weigh:{level:1,done:0},
  feed:{fed:{}},dig:{done:{}},puzzle:{done:{}},forscher:{done:{},guess:{},result:{},note:{}},
  settings:{sound:true,voice:true,rate:.95,autoSpeak:true}};
const clone=o=>JSON.parse(JSON.stringify(o));
function deep(a,b){for(const k in b){if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])){a[k]=deep(a[k]&&typeof a[k]==='object'?a[k]:{},b[k]);}else if(!(k in a))a[k]=b[k];}return a;}
function lsGet(k){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}
let PS=lsGet(PKEY);
if(!PS||!Array.isArray(PS.list)) PS={v:1,active:'p1',next:2,list:[{id:'p1',created:Date.now()}],settings:null};
if(!PS.list.length){ const id='p'+(PS.next++); PS.list.push({id,created:Date.now()}); }
if(!PS.list.some(p=>p.id===PS.active)) PS.active=PS.list[0].id;
const writePS=()=>lsSet(PKEY,PS);
function readState(id){ const s=deep(lsGet(skey(id))||{},clone(DEFAULT)); if(PS.settings) s.settings=deep(clone(PS.settings),s.settings); return s; }
/* Inhalt von DW.state ersetzen, Objekt-Identität (auch settings) behalten */
function assignState(ns){ const cur=DW.state; if(!cur){ DW.state=ns; return ns; }
  const set=cur.settings||{}; Object.keys(cur).forEach(k=>delete cur[k]); Object.assign(cur,ns);
  Object.keys(set).forEach(k=>delete set[k]); Object.assign(set,ns.settings); cur.settings=set; return cur; }
let lastSet='';
const newUid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
DW.load=()=>{ assignState(readState(PS.active)); lastSet=JSON.stringify(DW.state.settings); if(!PS.settings){PS.settings=clone(DW.state.settings);writePS();}
  const st=DW.state; let ch=false;
  if(!st.uid){ st.uid=newUid(); ch=true; }
  /* frühere Figuren (Mia, Ben, Ayo, Lina) sind jetzt „Meine Figur“ */
  if(st.avatar&&!st.own&&window.ART&&ART.PRESETS&&!ART.PRESETS.includes(st.avatar)){ st.own={avatar:st.avatar,name:st.name||'',figVoice:st.figVoice||null}; ch=true; }
  if(ch) lsSet(skey(PS.active),st); return st; };
DW.save=()=>{ lsSet(skey(PS.active),DW.state); const s=JSON.stringify(DW.state.settings); if(s!==lastSet){ lastSet=s; PS.settings=JSON.parse(s); writePS(); } };
/* Spielstand des aktiven Profils löschen – Figur, Name und Stimme bleiben */
DW.reset=()=>{ const keep={avatar:DW.state.avatar,name:DW.state.name,figVoice:DW.state.figVoice};
  try{localStorage.removeItem(skey(PS.active));}catch(e){} DW.load(); Object.assign(DW.state,keep); DW.save(); DW.idb.clear(PS.active); };
DW.load();
DW.totalStars=(st=DW.state)=>Object.values(st.stars||{}).reduce((a,b)=>a+b,0);
DW.addStars=(station,n)=>{DW.state.stars[station]=(DW.state.stars[station]||0)+n;DW.save();DW.emit('stars',station);};

/* ---- Profile ---- */
DW.profileId=()=>PS.active;
DW.profileKey=k=>PS.active==='p1'?k:PS.active+'|'+k;
DW.figureOf=st=>(window.ART&&ART.avatarById(st&&st.avatar))||null;
DW.displayName=(st=DW.state)=>((st.name||'').trim())||(DW.figureOf(st)||{}).name||'';
DW.profiles=()=>PS.list.map(p=>{ const st=p.id===PS.active?DW.state:(lsGet(skey(p.id))||{});
  return {id:p.id,created:p.created,active:p.id===PS.active,avatar:st.avatar||null,name:(st.name||'').trim(),display:DW.displayName(st),
    uid:st.uid||'',figVoice:st.figVoice||null,stars:DW.totalStars(st),started:!!st.started,animals:Object.keys(st.animals||{}).length}; });
DW.addProfile=(init={})=>{ const id='p'+(PS.next++); PS.list.push({id,created:Date.now()}); writePS();
  const st=clone(DEFAULT); delete st.settings; Object.assign(st,init); if(!st.uid) st.uid=newUid(); lsSet(skey(id),st); return id; };
DW.useProfile=id=>{ if(!PS.list.some(p=>p.id===id)) return false; if(id!==PS.active){ DW.save(); PS.active=id; writePS(); DW.load(); DW.emit('profile',id); } return true; };
DW.deleteProfile=id=>{ const i=PS.list.findIndex(p=>p.id===id); if(i<0) return false;
  PS.list.splice(i,1); try{localStorage.removeItem(skey(id));}catch(e){} DW.idb.clear(id);
  if(!PS.list.length) PS.list.push({id:'p'+(PS.next++),created:Date.now()});
  if(PS.active===id){ PS.active=PS.list[0].id; writePS(); DW.load(); DW.emit('profile',PS.active); } else writePS();
  return true; };

/* kleine Ereignisse */
const L={}; DW.on=(e,f)=>(L[e]=L[e]||[]).push(f); DW.emit=(e,d)=>(L[e]||[]).forEach(f=>f(d));

/* ---------------- Vorlesen ---------------- */
let voice=null, lastSaid='';
function pickVoice(){ if(!('speechSynthesis' in window))return; const vs=speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.toLowerCase().startsWith('de'));
  voice=vs.find(v=>/Anna|Helena|Petra|Marlene|Vicki|Google Deutsch|Katja/i.test(v.name))||vs[0]||null; }
if('speechSynthesis' in window){pickVoice(); speechSynthesis.onvoiceschanged=pickVoice;}
/* Echte Sprachaufnahmen (assets/voice, Liste in js/voice-map.js): Wenn es für jeden Satz eine Aufnahme gibt,
   wird sie abgespielt – sonst liest die Gerätestimme vor.
   Ersatz & neue Aufnahmen aus sounds-neu/sprache (js/assets.js → ASSETS.voice): Eigene Dateien der Nutzerin werden
   IMMER gespielt – fehlt für andere Sätze desselben Textes eine Aufnahme, liest die Gerätestimme nur diese Sätze.
   DW.say nimmt auch eine Liste von Textteilen: DW.say(['Deine Vermutung:', name, '.', 'Jetzt probieren wir es aus!']).
   Jeder Teil kann eine eigene Aufnahme haben; Satzzeichen-Teile hängen ohne Leerzeichen an. Ohne Aufnahmen wird
   der zusammengesetzte Text wie bisher in einem Stück vorgelesen. */
const VSPLIT=/(?<=[.!?…])\s+(?=[A-ZÄÖÜ„"])/;
const sentences=t=>String(t).replace(/\s+/g,' ').trim().split(VSPLIT).map(p=>p.trim()).filter(Boolean);
DW.sentences=sentences;
const PUNCT=/^[\s.,;:!?…]*$/;
const joinParts=a=>a.filter(p=>p!=null&&p!=='').map(String).reduce((t,p)=>t+(t&&!/^[.,;:!?…]/.test(p)?' ':'')+p,'').replace(/\s+/g,' ').trim();
DW.joinParts=joinParts;
let vAudio=null, vToken=0, lastParts=null;
function recOf(s){ const A=window.ASSETS; if(A&&A.voice) return A.voice(s); const M=window.VOICE_MAP; return M&&M[s]?{url:'assets/voice/'+M[s],alt:null,user:false}:null; }
/* Text(teile) → Abschnitte: {rec,text} = Aufnahme, {tts} = Gerätestimme */
function voicePlan(parts){ const segs=[]; let buf=[], files=0, tts=0, user=false;
  const flush=()=>{ const t=joinParts(buf).replace(/^[\s.,;:!?…]+/,''); buf=[]; if(t&&!PUNCT.test(t)){ segs.push({tts:t}); tts++; } };
  const unit=p=>{ const r=recOf(p); if(!r) return false; flush(); segs.push({rec:r,text:p}); files++; if(r.user) user=true; return true; };
  if(DW.state.settings.realVoice===false) return {segs:[],files:0,tts:1,user:false};
  for(const p of parts){ if(PUNCT.test(p)){ if(buf.length) buf.push(p); continue; }
    if(unit(p)) continue;
    const ss=sentences(p); if(ss.length<2){ buf.push(p); continue; }
    for(const x of ss){ if(!unit(x)) buf.push(x); } }
  flush(); return {segs,files,tts,user}; }
let vChain=Promise.resolve(), vWake=null;
function ttsUtter(text){ const u=new SpeechSynthesisUtterance(text.replace(/[–—]/g,', ')); u.lang='de-DE'; u.rate=DW.state.settings.rate||.95; u.pitch=1.05; if(voice)u.voice=voice; return u; }
/* ein Abschnitt mit der Gerätestimme (innerhalb einer Abspielkette) */
function speakSeg(text,tok){ return new Promise(res=>{ if(tok!==vToken||!('speechSynthesis' in window)) return res();
  let d=false; const f=()=>{ if(d) return; d=true; if(vWake===f) vWake=null; res(); }; vWake=f;
  try{ const u=ttsUtter(text); u.onend=u.onerror=f; speechSynthesis.speak(u); setTimeout(f,400+text.length*90); }catch(e){ f(); } }); }
/* eine Aufnahme; lässt sie sich nicht laden: Original (rec.alt), sonst Gerätestimme für diesen Satz */
function playRec(rec,text,tok){ return new Promise(res=>{ let done=false;
  const fin=()=>{ if(done) return; done=true; if(vWake===fin) vWake=null; res(); };
  const urls=[rec.url]; if(rec.alt) urls.push(rec.alt);
  const go=i=>{ if(done) return; if(tok!==vToken) return fin();
    if(i>=urls.length){ if(text) speakSeg(text,tok).then(fin); else fin(); return; }
    let bad=false; const a=vAudio=new Audio(urls[i]); vWake=fin; a.onended=fin;
    const fail=()=>{ if(bad||done) return; bad=true; a.onended=null; try{a.pause();}catch(e){}
      if(rec.user&&i===0&&window.ASSETS&&ASSETS.audioFail) ASSETS.audioFail(urls[0]); go(i+1); };
    a.onerror=fail;
    try{ const p=a.play(); if(p&&p.catch) p.catch(e=>{ const n=e&&e.name; if(n==='NotAllowedError'||n==='AbortError') fin(); else fail(); }); }catch(e){ fail(); } };
  go(0); }); }
function playSegs(segs,queue){ if(!queue) vChain=Promise.resolve(); const tok=vToken;
  const run=async()=>{ for(const s of segs){ if(tok!==vToken) return; await (s.rec?playRec(s.rec,s.text,tok):speakSeg(s.tts,tok)); } };
  vChain=vChain.then(run); return vChain; }
function sayRaw(text,opt={}){
  const parts=Array.isArray(text)?text.filter(p=>p!=null&&p!=='').map(String):null; if(parts) text=joinParts(parts);
  if(!text) return Promise.resolve(); lastSaid=text; lastParts=parts; DW.emit('say',text);
  if(!DW.state.settings.voice) return Promise.resolve();
  const pl=voicePlan(parts||[text]);
  if(pl.files&&(!pl.tts||pl.user)){ if(opt.queue!==true) stopVoice(); try{speechSynthesis.cancel();}catch(e){} return playSegs(pl.segs,opt.queue===true); }
  if(!('speechSynthesis' in window)) return Promise.resolve();
  stopVoice();
  return new Promise(res=>{ try{
    if(opt.queue!==true) speechSynthesis.cancel();
    const u=ttsUtter(text);
    u.onend=u.onerror=()=>res(); speechSynthesis.speak(u); setTimeout(res, 400+text.length*90);
  }catch(e){res();} });
}
DW.say=(text,opt={})=>track(sayRaw(text,opt));
function stopVoice(){ vToken++; if(vAudio){try{vAudio.pause();}catch(e){} vAudio=null;} const w=vWake; vWake=null; if(w) w(); }
DW.hush=()=>{stopVoice();try{speechSynthesis.cancel();}catch(e){}};
DW.repeat=()=>DW.say(lastParts||lastSaid);

/* ---------------- Bilder (IndexedDB) pro Profil ---------------- */
DW.idb=(()=>{ let dbp=null;
  const open=()=>dbp||(dbp=new Promise(r=>{ try{ const q=indexedDB.open('dinoInselwelt',1); q.onupgradeneeded=()=>q.result.createObjectStore('bilder'); q.onsuccess=()=>r(q.result); q.onerror=()=>r(null); q.onblocked=()=>r(null);}catch(e){r(null);} }));
  const req=(mode,fn)=>open().then(db=>new Promise(r=>{ if(!db) return r(null); try{ const q=fn(db.transaction('bilder',mode).objectStore('bilder')); q.onsuccess=()=>r(q.result===undefined?null:q.result); q.onerror=()=>r(null);}catch(e){r(null);} }));
  const pre=id=>id==='p1'?'':id+'|';
  const mine=(id,k)=>id==='p1'?!/^p\d+\|/.test(k):k.startsWith(pre(id));
  const api={
    get:k=>req('readonly',s=>s.get(k)), set:(k,v)=>req('readwrite',s=>s.put(v,k)), del:k=>req('readwrite',s=>s.delete(k)),
    keys:()=>req('readonly',s=>s.getAllKeys()).then(a=>(a||[]).map(String)),
    /* alle Bilder eines Profils → {kurzerSchlüssel: dataURL} */
    async dump(id){ const out={}; for(const k of (await api.keys()).filter(k=>mine(id,k))){ let v=await api.get(k); if(v instanceof Blob) v=await blobURL(v); if(typeof v==='string') out[k.slice(pre(id).length)]=v; } return out; },
    async restore(id,imgs){ for(const k in imgs||{}) if(typeof imgs[k]==='string'&&imgs[k].startsWith('data:')) await api.set(pre(id)+k,imgs[k]); },
    async clear(id){ for(const k of (await api.keys()).filter(k=>mine(id,k))) await api.del(k); }
  };
  const blobURL=b=>new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.onerror=()=>r(null);f.readAsDataURL(b);});
  return api; })();

/* ---------------- Sichern & Wiederherstellen ----------------
   Datei: {app:'dino-inselwelt', type:'spielstand', v:1, created, profiles:[{name, state, images:{schlüssel:dataURL}}]} */
DW.exportProfiles=async(ids)=>{ DW.save(); ids=ids&&ids.length?ids:PS.list.map(p=>p.id); const out=[];
  for(const id of ids){ if(!PS.list.some(p=>p.id===id)) continue; const st=id===PS.active?clone(DW.state):(lsGet(skey(id))||{});
    let images={}; try{ images=await DW.idb.dump(id); }catch(e){}
    out.push({name:DW.displayName(st),state:st,images}); }
  return {app:'dino-inselwelt',type:'spielstand',v:1,created:new Date().toISOString(),profiles:out}; };
DW.downloadJSON=(obj,name)=>{ const b=new Blob([JSON.stringify(obj)],{type:'application/json'}); const u=URL.createObjectURL(b);
  const a=document.createElement('a'); a.href=u; a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),4000); };
DW.checkBackup=obj=>!!(obj&&obj.app==='dino-inselwelt'&&Array.isArray(obj.profiles)&&obj.profiles.every(p=>p&&p.state&&typeof p.state==='object'));
/* Importiert Profile aus einer Sicherung. Ein Kind, das es auf diesem Gerät schon gibt (gleiche interne Kennung),
   wird durch den Stand aus der Datei ersetzt; alle anderen kommen neu dazu. Leere, nie gespielte Profile verschwinden.
   → {ids:[…], added:n, replaced:n} */
DW.importPlan=obj=>{ const ps=DW.profiles(); return (obj.profiles||[]).map(p=>{ const u=p.state&&p.state.uid; const hit=u&&ps.find(x=>x.uid===u); return {name:p.name||DW.displayName(p.state)||'',replace:hit?hit.id:null}; }); };
DW.importProfiles=async(obj)=>{ if(!DW.checkBackup(obj)) throw new Error('Keine Dino-Inselwelt-Sicherung');
  const empty=DW.profiles().filter(p=>!p.started&&!p.name&&!p.stars&&!p.animals).map(p=>p.id);
  const plan=DW.importPlan(obj), ids=[]; let added=0, replaced=0;
  for(let i=0;i<obj.profiles.length;i++){ const p=obj.profiles[i], st=clone(p.state); delete st.settings; let id=plan[i].replace;
    if(id){ replaced++; const nst=deep(st,clone(DEFAULT)); delete nst.settings; if(id===PS.active){ nst.settings=DW.state.settings; assignState(nst); DW.save(); } else lsSet(skey(id),nst); try{ await DW.idb.clear(id); }catch(e){} }
    else { added++; id=DW.addProfile(st); }
    ids.push(id); try{ await DW.idb.restore(id,p.images); }catch(e){} }
  const drop=empty.filter(id=>!ids.includes(id));
  if(ids.length){ drop.forEach(id=>DW.deleteProfile(id)); if(drop.includes(PS.active)||!PS.list.some(p=>p.id===PS.active)) DW.useProfile(ids[0]); }
  return {ids,added,replaced}; };

/* ---------------- Stimme der eigenen Figur ----------------
   Kurze Sätze der Figur (Gerätestimme, passend zu weiblich / männlich / neutral). Pip & Erzähler bleiben unverändert.
   Aufnahmen später: assets/voice/figur_<w|m|n>_<nr>.mp3 ablegen und die Nummer in DW.FIG_REC.<w|m|n> eintragen. */
DW.FIG_LINES=[
  {n:1,k:'hallo',t:'Hallo!'},
  {n:2,k:'los',t:'Los geht’s!'},
  {n:3,k:'los',t:'Auf zur Forschung!'},
  {n:4,k:'geschafft',t:'Geschafft!'},
  {n:5,k:'geschafft',t:'Juhu, das hat Spaß gemacht!'},
  {n:6,k:'was',t:'Oh, was ist das?'},
  {n:7,k:'fund',t:'Wir haben es gefunden!'},
  {n:8,k:'fund',t:'Ein Fund für die Sammlung!'},
  {n:9,k:'neu',t:'Oh, ein neues Tier!'},
];
DW.FIG_REC={w:[],m:[],n:[]};
DW.VOICES=[{id:'w',n:'weiblich'},{id:'m',n:'männlich'},{id:'n',n:'neutral'}];
DW.figVoice=(st=DW.state)=>st.figVoice||({f:'w',m:'m'}[(DW.figureOf(st)||{}).g]||'n');
const FEM=/Anna|Helena|Petra|Marlene|Vicki|Katja|Hedda|Katharina|Amala|Seraphina|Louisa|Tanja|Elke|Sandy|Shelley|Grandma|Google Deutsch|female|weiblich|frau/i;
const MAL=/Markus|Yannick|Stefan|Conrad|Hans|Klaus|Viktor|Martin|Jonas|Killian|Florian|Ralf|Bernd|Eddy|Reed|Rocko|Grandpa|\bmale\b|männlich|mann/i;
function deVoices(){ try{ return speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.toLowerCase().startsWith('de')); }catch(e){ return []; } }
DW.figVoiceParams=(vid,fig)=>{ const vs=deVoices(), kid=!fig||fig.age!=='adult';
  const fem=vs.find(v=>FEM.test(v.name)&&!/\bmale\b/i.test(v.name.replace(/female/i,''))), mal=vs.find(v=>MAL.test(v.name)&&!/female/i.test(v.name));
  let v=voice, pitch=1.05;
  if(vid==='w'){ v=fem||voice; pitch=fem?1.15:1.35; if(kid) pitch+=.2; }
  else if(vid==='m'){ v=mal||voice; pitch=mal?.95:.7; if(kid) pitch+=.3; }
  else { v=voice; pitch=kid?1.2:1.0; }
  return {voice:v,pitch:DW.clamp(pitch,.5,2),rate:(DW.state.settings.rate||.95)*1.04}; };
let sayBusy=0, figLast=0;
const track=p=>{ sayBusy++; let d=false; const f=()=>{ if(!d){ d=true; sayBusy--; } }; p.then(f,f); setTimeout(f,15000); return p; };
DW.speaking=()=>sayBusy>0||(('speechSynthesis' in window)&&speechSynthesis.speaking)||(!!vAudio&&!vAudio.paused&&!vAudio.ended);
/* DW.figSay(kind|{t}, {now:true = sofort, sonst nach dem Erzähler; cool:ms Mindestabstand; voice, fig für Vorschau}) */
DW.figSay=(k,opt={})=>{
  const fig=opt.fig||DW.figureOf(DW.state); if(!fig) return Promise.resolve();
  const pool=typeof k==='object'?[k]:DW.FIG_LINES.filter(l=>l.k===k); if(!pool.length) return Promise.resolve();
  const now=Date.now(); if(opt.cool&&now-figLast<opt.cool) return Promise.resolve(); figLast=now;
  const line=DW.pick(pool), vid=opt.voice||DW.figVoice();
  const go=()=>{ DW.emit('figsay',{text:line.t,fig,line}); if(!DW.state.settings.voice) return Promise.resolve();
    const own=line.n&&window.ASSETS&&ASSETS.sound?ASSETS.sound(`sprache/figur_${vid}_${line.n}`):null;   // eigene Aufnahme aus sounds-neu/sprache
    const rec=line.n&&(own||(DW.FIG_REC[vid]||[]).includes(line.n));
    const tts=()=>new Promise(res=>{ if(!('speechSynthesis' in window)) return res(); try{
      const u=new SpeechSynthesisUtterance(line.t); const pr=DW.figVoiceParams(vid,fig); u.lang='de-DE'; if(pr.voice) u.voice=pr.voice; u.pitch=pr.pitch; u.rate=pr.rate;
      u.onend=u.onerror=()=>res(); speechSynthesis.speak(u); setTimeout(res,600+line.t.length*95); }catch(e){res();} });
    if(rec) return new Promise(res=>{ let fb=false; const back=()=>{ if(fb) return; fb=true; if(own) ASSETS.audioFail(own); tts().then(res); };
      const a=new Audio(own||`assets/voice/figur_${vid}_${line.n}.mp3`); a.onended=()=>res(); a.onerror=back; a.play().catch(e=>{ if(e&&e.name==='NotAllowedError') res(); else back(); }); });
    return tts(); };
  if(opt.now||!DW.speaking()) return go();
  return new Promise(res=>{ const t0=Date.now(); const iv=setInterval(()=>{ if(!DW.speaking()){ clearInterval(iv); setTimeout(()=>go().then(res),250); } else if(Date.now()-t0>9000){ clearInterval(iv); res(); } },200); });
};

/* ---------------- Töne (synthetisch; eine Datei sounds-neu/toene/<name>.mp3 hat Vorrang) ---------------- */
let AC=null;
function ac(){ if(!AC){ try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){} } if(AC&&AC.state==='suspended')AC.resume(); return AC; }
function tone(f,t0,dur,type='sine',vol=.2,f2=null){const a=ac();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,a.currentTime+t0);
  if(f2)o.frequency.exponentialRampToValueAtTime(f2,a.currentTime+t0+dur);g.gain.setValueAtTime(0,a.currentTime+t0);g.gain.linearRampToValueAtTime(vol,a.currentTime+t0+.012);
  g.gain.exponentialRampToValueAtTime(.001,a.currentTime+t0+dur);o.connect(g).connect(a.destination);o.start(a.currentTime+t0);o.stop(a.currentTime+t0+dur+.05);}
function noise(t0,dur,vol=.2,freq=1200,q=1){const a=ac();if(!a)return;const b=a.createBuffer(1,a.sampleRate*dur,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const s=a.createBufferSource();s.buffer=b;const fl=a.createBiquadFilter();fl.type='bandpass';fl.frequency.value=freq;fl.Q.value=q;const g=a.createGain();
  g.gain.setValueAtTime(vol,a.currentTime+t0);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+t0+dur);s.connect(fl).connect(g).connect(a.destination);s.start(a.currentTime+t0);}
const SFX={
  tap:()=>tone(660,0,.08,'triangle',.12),
  pop:()=>{tone(520,0,.09,'sine',.18,900);},
  ok:()=>{tone(523,0,.12,'triangle',.16);tone(659,.09,.12,'triangle',.16);tone(784,.18,.22,'triangle',.18);},
  no:()=>{tone(300,0,.16,'sine',.12,240);tone(240,.14,.2,'sine',.1,200);},
  star:()=>{[784,988,1175,1568].forEach((f,i)=>tone(f,i*.07,.18,'sine',.12));},
  win:()=>{[523,659,784,1047,784,1047].forEach((f,i)=>tone(f,i*.11,.24,'triangle',.15));},
  whoosh:()=>noise(0,.35,.12,800,.7),
  step:()=>noise(0,.06,.05,500,2),
  jump:()=>tone(300,0,.2,'sine',.14,700),
  bump:()=>{tone(140,0,.2,'sine',.2,80);noise(0,.12,.1,300,1);},
  chew:()=>{noise(0,.07,.12,700,3);noise(.14,.07,.12,650,3);noise(.28,.07,.1,700,3);},
  yuck:()=>{tone(260,0,.25,'sawtooth',.06,180);},
  dig:()=>noise(0,.12,.14,400,1.2),
  brush:()=>noise(0,.1,.06,2400,.8),
  clink:()=>{tone(1400,0,.08,'sine',.1);tone(2100,.02,.1,'sine',.06);},
  click:()=>tone(900,0,.04,'square',.05),
  egg:()=>{tone(880,0,.07,'sine',.12);tone(1320,.06,.1,'sine',.1);},
  thud:()=>{tone(90,0,.3,'sine',.25,50);noise(0,.15,.12,200,1);},
  magic:()=>{[1047,1319,1568,2093,1568,2093].forEach((f,i)=>tone(f,i*.06,.3,'sine',.07));},
  trumpet:()=>{tone(220,0,.5,'sawtooth',.07,330);tone(330,.1,.6,'sawtooth',.05,440);},
};
DW.SFX_NAMES=Object.keys(SFX);
/* Ton aus einer Datei (ASSETS.sound('toene/<name>')): kleiner Vorrat an Audio-Elementen je Ton, damit schnelle
   Wiederholungen nicht abreißen. Lässt sich die Datei nicht laden, klingt wieder der eingebaute Ton. */
const sfxPool={};
function sfxEl(u,n){ const a=new Audio(u); a.preload='auto'; a.volume=.8;
  a.onerror=()=>{ if(a._bad) return; a._bad=true; window.ASSETS.audioFail(u); delete sfxPool[u]; if(a._want){ try{(SFX[n]||SFX.tap)();}catch(e){} } }; return a; }
function sfxFile(n){ const A=window.ASSETS, u=A&&A.sound?A.sound('toene/'+n):null; if(!u) return false;
  const P=sfxPool[u]||(sfxPool[u]={l:[],i:0}); let a=P.l.find(x=>x.paused||x.ended);
  if(!a){ if(P.l.length<4){ a=sfxEl(u,n); P.l.push(a); } else a=P.l[P.i++%P.l.length]; }
  a._want=true;
  try{ a.currentTime=0; }catch(e){}
  try{ const p=a.play(); if(p&&p.catch) p.catch(()=>{}); }catch(e){}
  return true; }
DW.sfx=n=>{ if(!DW.state.settings.sound) return; try{ if(sfxFile(n)) return; (SFX[n]||SFX.tap)(); }catch(e){} };
/* Brüllen: sounds-neu/toene/roar.mp3, sonst assets/sounds/roar.mp3 */
let roarAudio=null, roarSrc='';
DW.roar=()=>{ if(!DW.state.settings.sound) return; try{
  const A=window.ASSETS, u=(A&&A.sound&&A.sound('toene/roar'))||'assets/sounds/roar.mp3';
  if(!roarAudio||roarSrc!==u){ roarSrc=u; const a=roarAudio=new Audio(u); a.preload='none'; a.volume=.45;
    if(u.indexOf('assets/')!==0) a.onerror=()=>{ if(roarAudio!==a) return; A.audioFail(u); roarAudio=null; DW.roar(); }; }
  roarAudio.currentTime=0; roarAudio.play().catch(()=>{}); }catch(e){} };
/* Ersatz-Töne nach dem ersten Tippen vorladen (sonst käme der erste Ton verspätet) */
document.addEventListener('pointerdown',()=>{ try{ const A=window.ASSETS, M=(window.ASSET_MAP&&window.ASSET_MAP.sounds)||{};
  Object.keys(M).forEach(k=>{ if(k.indexOf('toene/')!==0) return; const n=k.slice(6), u=A.sound(k); if(!u||!SFX[n]||sfxPool[u]) return;
    const a=sfxEl(u,n); sfxPool[u]={l:[a],i:0}; try{ a.load(); }catch(e){} }); }catch(e){} },{once:true});
document.addEventListener('pointerdown',()=>ac(),{once:true});

/* ---------------- Papier-Hintergrund ---------------- */
DW.paperURL=(()=>{ const c=document.createElement('canvas');c.width=c.height=320;const x=c.getContext('2d'),im=x.createImageData(320,320);
  const N=(()=>{const P=new Uint8Array(512);const p=[...Array(256).keys()];let s=12345;for(let i=255;i>0;i--){s=(s*16807)%2147483647;const j=s%(i+1);[p[i],p[j]]=[p[j],p[i]];}for(let i=0;i<512;i++)P[i]=p[i&255];
    const g=i=>P[i]/255;return (x,y)=>{const X=Math.floor(x),Y=Math.floor(y),fx=x-X,fy=y-Y,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);const a=g(P[X&255]+(Y&255)),b=g(P[(X+1)&255]+(Y&255)),c=g(P[X&255]+((Y+1)&255)),d=g(P[(X+1)&255]+((Y+1)&255));return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;};})();
  DW.noise2=N;
  for(let j=0;j<320;j++)for(let i=0;i<320;i++){const a=i/320*2*Math.PI,b=j/320*2*Math.PI;let n=0,amp=.5,f=1;for(let o=0;o<4;o++){n+=amp*N(8+Math.cos(a)*3*f,8+Math.sin(a)*3*f+Math.cos(b)*3*f+Math.sin(b)*3*f);amp*=.5;f*=2;}
    const k=(j*320+i)*4,v=(n-.47)*12+(Math.random()-.5)*9+(Math.random()<.004?-14:0);im.data[k]=247+v;im.data[k+1]=240+v;im.data[k+2]=225+v*1.1;im.data[k+3]=255;}
  x.putImageData(im,0,0); return c.toDataURL(); })();

/* ---------------- Belohnungen ---------------- */
function toast(icon,title,sub){
  const t=DW.h(`<div class="toast"><div class="ic">${icon}</div><div><b>${title}</b>${sub?`<small>${sub}</small>`:''}</div></div>`);
  $('#toasts').appendChild(t); setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),600);},2600);
}
DW.toast=toast;
DW.discover=(id,quiet)=>{ if(!id||DW.state.animals[id])return false; DW.state.animals[id]=Date.now(); DW.save();
  if(!quiet){toast(ART.animal(DATA.animal(id)?.art||id,{shadow:false}),DATA.nameOf(id),'Neu im Rucksack!');DW.sfx('star');DW.figSay('neu',{cool:25000});} DW.emit('collect'); return true; };
DW.addFind=(id,quiet)=>{ const f=DATA.find(id); if(!f)return; const first=!DW.state.finds[id]; DW.state.finds[id]=(DW.state.finds[id]||0)+1; DW.save();
  if(!quiet){toast(ART.icon(f.icon),f.n,first?'Neuer Fund im Rucksack!':'Noch einer für die Sammlung');DW.sfx('clink');if(first)DW.figSay('fund',{cool:25000});} DW.emit('collect'); return first; };
DW.addSticker=(id)=>{ if(DW.state.stickers[id])return false; const s=DATA.sticker(id); if(!s)return false; DW.state.stickers[id]=Date.now(); DW.save();
  toast(ART.icon(s.icon),'Sticker: '+s.n,'Klebt jetzt in deinem Rucksack'); DW.sfx('magic'); DW.emit('collect'); return true; };

/* Konfetti (gemalte Tupfen) */
DW.confetti=(n=70)=>{
  const c=document.createElement('canvas');c.className='confetti';document.body.appendChild(c);
  const W=c.width=innerWidth,H=c.height=innerHeight,x=c.getContext('2d');
  const cols=['#c8553d','#f0c35a','#8fbf7a','#8fbccb','#b58cbd','#e9967a'];
  const P=[...Array(n)].map(()=>({x:W/2+(Math.random()-.5)*W*.3,y:H*.45,vx:(Math.random()-.5)*14,vy:-Math.random()*14-6,r:5+Math.random()*7,c:DW.pick(cols),a:Math.random()*6}));
  let t=0;(function f(){t++;x.clearRect(0,0,W,H);P.forEach(p=>{p.vy+=.45;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.a+=.1;x.globalAlpha=Math.max(0,1-t/110);
    x.fillStyle=p.c;x.beginPath();x.ellipse(p.x,p.y,p.r,p.r*.6,p.a,0,7);x.fill();});if(t<110)requestAnimationFrame(f);else c.remove();})();
};

/* Sterne-Anzeige in einem Container */
DW.starRow=(n,max=3)=>`<span class="starrow">${[...Array(max)].map((_,i)=>`<span style="display:inline-block;width:44px;opacity:${i<n?1:.25}">${ART.icon('stern',44)}</span>`).join('')}</span>`;

/* ---------------- Ziehen & Ablegen ---------------- */
document.addEventListener('dragstart',e=>{ const t=e.target; if(t&&(t.tagName==='IMG'||t.tagName==='svg'||t.closest&&t.closest('#station,#world,#overlay,#start'))) e.preventDefault(); });
/* DW.drag(el,{ghost:html|fn, onStart(), onMove(x,y,clone), onDrop(x,y,clone)->true|false|'keep', onTap(), onCancel()})
   Robust gegen: zweiten Finger, verlorene Zeiger-Erfassung, pointercancel, entfernte/neu aufgebaute Elemente,
   schnelle Folgezüge (alte zurückfliegende Kopie wird sofort entfernt). Es gibt immer nur EINEN Zug und EINE Kopie.
   Bewegen/Loslassen werden am Fenster abgehört (nicht am Element) – so geht kein pointerup verloren.
   onMove kommt höchstens einmal pro Bild (requestAnimationFrame), zusammen mit dem Verschieben der Kopie.
   Achtung: auf Zieh-Elementen gibt es bei Touch keinen click (touchstart wird verhindert) – Tippen immer über onTap behandeln. */
const dragLive=new Map(); let dragNow=null;
window.addEventListener('pointerdown',e=>{
  if(e.isPrimary) dragLive.forEach((ty,id)=>{ if(ty===e.pointerType) dragLive.delete(id); });   // neuer erster Finger: ältere Zeiger dieser Art sind sicher weg
  if(dragNow&&(!dragNow.el.isConnected||!dragLive.has(dragNow.id)||dragNow.id===e.pointerId)) dragNow.abort();  // hängengebliebenen Zug aufräumen
  dragLive.set(e.pointerId,e.pointerType); },true);
const dragGone=e=>{ dragLive.delete(e.pointerId); };
window.addEventListener('pointerup',dragGone,true); window.addEventListener('pointercancel',dragGone,true);
const dragAbort=()=>{ if(dragNow) dragNow.abort(); };
window.addEventListener('blur',dragAbort); document.addEventListener('visibilitychange',()=>{ if(document.hidden){ dragAbort(); dragLive.clear(); } });
DW.drag=(el,opt)=>{
  let st=null, back=null;
  el.style.touchAction='none';
  el.addEventListener('dragstart',e=>e.preventDefault());              // kein Browser-eigenes Bild-Ziehen (sonst doppelte Bilder)
  /* Nicht-passiv + preventDefault: der Browser erkennt aus dem Zug keine eigene Geste (Wurf/„Fling“). Sonst verschluckt er nach einem
     schnellen Zug den nächsten Tipp (kein click, ~0,3 s lang). Zeigerereignisse – und damit onTap/onDrop – kommen weiterhin;
     nur der vom Browser erzeugte click auf dem Zieh-Element entfällt bei Touch (dafür gibt es onTap). */
  el.addEventListener('touchstart',e=>{ if(e.cancelable) e.preventDefault(); },{passive:false});
  el.querySelectorAll&&el.querySelectorAll('img').forEach(i=>i.draggable=false);
  const TF=(x,y,sc)=>`translate3d(${Math.round(x)}px,${Math.round(y)}px,0) translate(-50%,-50%) scale(${sc})`;
  const endBack=()=>{ if(!back) return; clearTimeout(back.t); back.clone.remove(); back=null; el.style.opacity=''; };   // zurückfliegende Kopie sofort beenden
  const place=()=>{ const s=st; if(!s||!s.clone) return; s.raf=0;
    if(!el.isConnected){ st=null; finish(s,false); return; }           // Element wurde mitten im Zug ersetzt
    s.clone.style.transform=TF(s.x,s.y,1.08);
    if(opt.onMove){ try{ opt.onMove(s.x,s.y,s.clone); }catch(e){ console.error(e); } } };
  const unbind=()=>{ window.removeEventListener('pointermove',move,true); window.removeEventListener('pointerup',up,true); window.removeEventListener('pointercancel',cancel,true); };
  const finish=(s,drop,x,y)=>{
    unbind();
    if(dragNow===s){ dragNow=null; document.documentElement.classList.remove('dw-dragging'); }
    if(s.raf) cancelAnimationFrame(s.raf);
    try{ el.releasePointerCapture(s.id); }catch(e){}
    if(!s.moved){ if(drop&&!s.dead) opt.onTap&&opt.onTap(); return; }
    const clone=s.clone; let r=false;
    if(drop){ try{ r=opt.onDrop?opt.onDrop(x,y,clone):false; }catch(e){ console.error(e); r=false; } }
    else { try{ opt.onCancel&&opt.onCancel(); }catch(e){ console.error(e); } }
    if(r==='keep') return;
    if(r||!el.isConnected){ clone.remove(); el.style.opacity=''; }
    else { const bb=el.getBoundingClientRect(); clone.style.transition='transform .3s'; clone.style.transform=TF(bb.left+bb.width/2,bb.top+bb.height/2,1);
      const b={clone,t:0}; b.t=setTimeout(()=>{ clone.remove(); if(back===b){ back=null; el.style.opacity=''; } },320); back=b; }
  };
  const move=e=>{
    const s=st; if(!s||e.pointerId!==s.id||s.dead) return;
    const dx=e.clientX-s.x0,dy=e.clientY-s.y0; s.x=e.clientX; s.y=e.clientY;
    if(!s.moved&&Math.hypot(dx,dy)>8){
      if(dragNow&&dragNow!==s){ s.dead=true; return; }                 // es läuft schon ein Zug (anderer Finger): diesen ignorieren
      if(!el.isConnected){ st=null; finish(s,false); return; }
      s.moved=true; dragNow=s; endBack();
      document.querySelectorAll('body > .dragging').forEach(c=>{ if(!c.style.transition) c.remove(); });   // verwaiste Kopien aufräumen
      const g=opt.ghost?(typeof opt.ghost==='function'?opt.ghost():opt.ghost):el.outerHTML;
      s.clone=DW.h(`<div class="dragging">${g}</div>`); const r=el.getBoundingClientRect();
      s.clone.querySelectorAll('img').forEach(i=>{ i.draggable=false; i.decoding='sync'; });
      s.clone.style.width=r.width+'px'; s.clone.style.height=r.height+'px'; s.clone.style.transform=TF(s.x,s.y,1.08); document.body.appendChild(s.clone);
      document.documentElement.classList.add('dw-dragging');
      el.style.opacity=.35; DW.sfx('pop'); try{ opt.onStart&&opt.onStart(); }catch(err){ console.error(err); } }
    if(s.moved&&!s.raf) s.raf=requestAnimationFrame(place);
  };
  const up=e=>{ const s=st; if(!s||e.pointerId!==s.id) return; st=null; if(s.moved){ s.x=e.clientX; s.y=e.clientY; } finish(s,true,e.clientX,e.clientY); };
  const cancel=e=>{ const s=st; if(!s||e.pointerId!==s.id) return; st=null; finish(s,false); };
  el.addEventListener('pointerdown',e=>{
    if(e.button>0) return; e.preventDefault();
    if(st){ if(e.pointerId!==st.id&&dragLive.has(st.id)&&el.isConnected) return;   // zweiter Finger auf demselben Element: ignorieren
      const s=st; st=null; finish(s,false); }                                        // alter Zug hing fest (kein pointerup angekommen): aufräumen, neu beginnen
    st={id:e.pointerId,el,x0:e.clientX,y0:e.clientY,x:e.clientX,y:e.clientY,moved:false,dead:false,clone:null,raf:0,abort:()=>{ const s=st; if(s){ st=null; finish(s,false); } }};
    try{ el.setPointerCapture(e.pointerId); }catch(err){}
    unbind(); window.addEventListener('pointermove',move,true); window.addEventListener('pointerup',up,true); window.addEventListener('pointercancel',cancel,true);
  });
};
DW.hit=(x,y,node)=>{const r=node.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;};

/* ---------------- Modale Fenster ---------------- */
DW.modal=(html,opt={})=>{
  const ov=$('#overlay'); ov.innerHTML=''; const m=DW.h(`<div class="modal card">${opt.noclose?'':`<button class="ibtn x" aria-label="Schließen">${ART.icon('kreuz')}</button>`}${html}</div>`);
  ov.appendChild(m); ov.hidden=false;
  const close=()=>{ov.hidden=true;ov.innerHTML='';opt.onClose&&opt.onClose();};
  m.querySelector('.x')?.addEventListener('click',()=>{DW.sfx('tap');close();});
  ov.onclick=e=>{if(e.target===ov&&!opt.noclose)close();};
  m.close=close; return m;
};

/* ---------------- Navigation ---------------- */
DW.current=null;
DW.openStation=(id,arg)=>{
  const st=DW.stations[id]; if(!st) return;
  DW.hush(); DW.sfx('whoosh');
  const S=$('#station'); S.hidden=false; $('#stationTitle').textContent=st.title;
  try{ window.GK&&GK.cleanup(); }catch(e){}
  const root=$('#stationRoot'); root.innerHTML='';
  DW.current={id,st}; DW.emit('station',id);
  $('#world').dataset.paused='1';
  try{ st.mount(root,arg); }catch(e){ console.error(e); root.innerHTML='<p class="loading center fill">Hoppla, hier ist etwas schiefgegangen.</p>'; }
};
DW.closeStation=()=>{
  if(!DW.current) return; const {st}=DW.current;
  try{ st.unmount&&st.unmount(); }catch(e){console.error(e);}
  try{ window.GK&&GK.cleanup(); }catch(e){}
  DW.hush(); DW.current=null; $('#station').hidden=true; $('#stationRoot').innerHTML=''; document.querySelectorAll('body > .dragging').forEach(e=>e.remove());
  delete $('#world').dataset.paused; DW.emit('world'); DW.sfx('whoosh');
};

/* Wiederverwendbarer Stations-Kopf: Knöpfe rechts (Vorlesen) */
DW.setStationTitle=t=>{$('#stationTitle').textContent=t;};

/* Eltern-Tor: 2 Sekunden gedrückt halten */
DW.holdButton=(btn,ms,fn)=>{let t=null;const start=e=>{e.preventDefault();btn.classList.add('glow');t=setTimeout(()=>{btn.classList.remove('glow');fn();},ms);};
  const stop=()=>{clearTimeout(t);btn.classList.remove('glow');};btn.addEventListener('pointerdown',start);['pointerup','pointerleave','pointercancel'].forEach(ev=>btn.addEventListener(ev,stop));};

/* Bild eines Tiers für DOM (mit Cache) */
const svgCache=new Map();
DW.svgURL=svg=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
const imgCache2=new Map();
DW.animalImg=(id,opts={},cls='')=>{const a=DATA.animal(id); const art=a?a.art:id; const k=art+JSON.stringify(opts); if(!imgCache2.has(k)) imgCache2.set(k,DW.svgURL(ART.animal(art,opts))); return `<img class="${cls}" src="${imgCache2.get(k)}" alt="${a?(a.short||a.n):''}" draggable="false">`;};
DW.iconImg=(name,cls='')=>`<img class="${cls}" src="${DW.svgURL(ART.icon(name))}" alt="" draggable="false">`;
DW.animalSVG=(id,opts={})=>{const a=DATA.animal(id); const art=a?a.art:id; const k=art+JSON.stringify(opts); if(!svgCache.has(k)) svgCache.set(k,ART.animal(art,opts)); return svgCache.get(k);};

})();
