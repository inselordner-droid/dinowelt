/* =====================================================================
   DINO-INSELWELT · assets.js — Grafik-Einbau (gemalte Bilder statt Zeichnung)
   ---------------------------------------------------------------------
   Liegt ein Bild in grafiken-neu/ (und steht es in js/asset-map.js, die das
   Werkzeug tools/Grafiken-einbinden.command bzw. .bat erzeugt), benutzt die
   App überall das Bild. Fehlt es, bleibt die bisherige Zeichnung.

   Wie es funktioniert
   - ART.animal / ART.icon / ART.avatar / ART.avatarFront liefern bei vorhandenem
     Bild ein kleines SVG mit <image>. Es trägt data-dwpng="<png>#dw-…".
   - DW.svgURL und ART.toImage erkennen dieses SVG und geben direkt den PNG-Pfad
     zurück (Daten-URL-SVGs können keine externen Bilder laden).
     Steckt ein Bild-SVG IN einem größeren SVG, das zur Daten-URL wird, wird an
     seiner Stelle wieder die Zeichnung eingesetzt – nichts bleibt leer.
   - Stimmungen/Laufbilder (chew/sad/ph/flip) hängen als #dw-…-Fragment am
     PNG-Pfad: CSS (für <img>) und ein kleiner drawImage-Aufsatz (für Canvas)
     lassen das statische Bild sanft wippen, kauen, spiegeln.
   - Stationshintergründe, Sticker, Knöpfe, Pip: siehe unten.
   - Töne, Sprache, Musik: Dateien in sounds-neu/ (Abschnitt „Töne & Sprache“):
     ASSETS.sound('toene/pop'), ASSETS.voice('Ein Satz.'), ASSETS.music().
   Test-Hooks der Stationen gibt es nur mit ?debug=1 (window.DW_DEBUG).
   ===================================================================== */
(function(){
"use strict";
window.DW_DEBUG=/[?&]debug=1(&|$)/.test(location.search);

/* Manifest (vom Werkzeug erzeugt) direkt hinter diesem Skript laden */
if(!window.ASSET_MAP&&document.readyState==='loading'){
  try{ document.write('<script src="js/asset-map.js"><\/script>'); }catch(e){}
}

const BASE='grafiken-neu/';
const A=window.ASSETS={base:BASE};
const files=()=>(window.ASSET_MAP&&window.ASSET_MAP.files)||{};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const f1=n=>Math.round(n*10)/10;
const norm=k=>String(k||'').toLowerCase().replace(/^grafiken-neu\//,'').replace(/\.(png|webp|jpe?g)$/,'');
const broken=new Set();

/** Eintrag [datei,breite,höhe] oder null. Schlüssel ohne Endung, z. B. 'tiere/trex'. */
A.has=k=>{ k=norm(k); const e=files()[k]; return e&&!broken.has(k)?e:null; };
/** Pfad (relativ zu index.html) oder null */
A.url=k=>{ const e=A.has(k); return e?BASE+e[0]:null; };
/** [breite,höhe] (0 = unbekannt) */
A.dims=k=>{ const e=A.has(k); return e?[+e[1]||0,+e[2]||0]:[0,0]; };
/** erster vorhandener Schlüssel aus einer Liste */
A.first=list=>{ for(const k of list) if(k&&A.has(k)) return norm(k); return null; };
/** <img>-HTML für ein Bild (oder '' wenn nicht vorhanden) */
A.img=(k,cls='',alt='')=>{ const u=A.url(k); return u?`<img class="${esc(cls)}" src="${esc(u)}" alt="${esc(alt)}" draggable="false">`:''; };
/** Image-Objekt (gecacht) oder null */
const imgs=new Map();
A.image=k=>{ const u=A.url(k); if(!u) return null; if(!imgs.has(u)){ const im=new Image(); im.decoding='async'; im.src=u; im.ready=new Promise(r=>{im.onload=()=>r(im);im.onerror=()=>{broken.add(norm(k));r(im);};}); imgs.set(u,im);} return imgs.get(u); };
A.count=()=>Object.keys(files()).length;
/** Bild als kaputt merken (Datei fehlt trotz Eintrag) – danach gilt wieder die Zeichnung */
A.fail=k=>{ broken.add(norm(k)); };
/** Dino-Ei als Bild: erster vorhandener Name objekte/ei_<name> → Pfad oder null (dann bleibt die Zeichnung) */
A.egg=(...names)=>{ const k=A.first(names.filter(Boolean).map(n=>'objekte/ei_'+n)); return k?A.url(k):null; };

/* ---------------- Landschaften der Lauf-/Renn-Spiele (grafiken-neu/landschaften/) ----------------
   landschaften/<welt>_himmel | _hinten | _mitte | _boden  ersetzt die gezeichnete Schicht (waagerecht nahtlos wiederholt,
   Parallaxe wie bisher). welt darf eine Liste sein (erste vorhandene gilt). Liefert ein fertig geladenes Bild oder null. */
A.layer=(welt,schicht)=>{ const W=Array.isArray(welt)?welt:[welt]; const k=A.first(W.map(w=>'landschaften/'+w+'_'+schicht)); if(!k) return null;
  const im=A.image(k); return im&&im.complete&&im.naturalWidth>0?im:null; };
/** Schicht nebeneinander wiederholt zeichnen: off = Verschiebung in px (Parallaxe), y/h = Bereich (Höhe), w = Breite des Bildschirms */
A.drawLayer=(x,im,off,y,h,w,x0=0)=>{ const iw=im.naturalWidth*h/im.naturalHeight; if(!(iw>0)||!(h>0)) return; for(let px=x0-(((off%iw)+iw)%iw);px<x0+w;px+=iw) x.drawImage(im,px,y,iw+.6,h); };
/** Bild füllt ein Rechteck (seitenverhältnistreu, überstehende Ränder abgeschnitten) – z. B. Himmel */
A.drawCover=(x,im,X,Y,w,h)=>{ const s=Math.max(w/im.naturalWidth,h/im.naturalHeight), dw=im.naturalWidth*s, dh=im.naturalHeight*s; x.save(); x.beginPath(); x.rect(X,Y,w,h); x.clip(); x.drawImage(im,X+(w-dw)/2,Y+(h-dh)/2,dw,dh); x.restore(); };

/* ---------------- Töne & Sprache (sounds-neu/) ----------------
   js/asset-map.js darf zusätzlich enthalten (beide Angaben sind freiwillig – alte Dateien ohne sie gelten weiter):
     "sounds":{"toene/pop":"toene/pop.mp3","sprache/v0012":"sprache/v0012.mp3","musik/musik":"musik/musik.mp3"}
     "saetze":{"Genauer Satz.":"sprache/mein_satz.mp3"}
   · toene/<name>     ersetzt den Ton DW.sfx('<name>') bzw. assets/sounds/<name>.mp3
   · sprache/<datei>  ersetzt die Aufnahme assets/voice/<datei>.mp3 (z. B. v0012) oder trägt einen Namen,
                      den eine Station für einen Satz vorschlägt (ASSETS.voiceName, z. B. exp001_frage)
   · saetze           vertont beliebige (auch neue) Sätze: Satz → Datei
   · musik/musik      ersetzt die Kartenmusik assets/sounds/musik.mp3 */
const SBASE='sounds-neu/';
A.soundBase=SBASE;
const sounds=()=>(window.ASSET_MAP&&window.ASSET_MAP.sounds)||{};
const SEXT=/\.(mp3|m4a|wav|ogg|oga|aac)$/i;
const snorm=k=>String(k||'').toLowerCase().replace(/^sounds-neu\//,'').replace(SEXT,'');
const encPath=p=>String(p).split('/').map(encodeURIComponent).join('/');
const sbroken=new Set();
/** Pfad einer Ersatz-Tondatei oder null. Schlüssel ohne Endung, z. B. 'toene/pop', 'sprache/v0012'. */
A.sound=k=>{ const f=sounds()[snorm(k)]; if(!f||typeof f!=='string') return null; const u=SBASE+encPath(f); return sbroken.has(u)?null:u; };
/** Ersatzdatei ließ sich nicht laden → ab jetzt wieder das Original benutzen */
A.audioFail=u=>{ if(u) sbroken.add(String(u)); };
A.soundCount=()=>Object.keys(sounds()).length+Object.keys((window.ASSET_MAP&&window.ASSET_MAP.saetze)||{}).length;
/** Kartenmusik (Ersatz oder Original) */
A.MUSIC='assets/sounds/musik.mp3';
A.music=()=>{ let u=A.sound('musik/musik'); if(!u){ const k=Object.keys(sounds()).filter(x=>x.indexOf('musik/')===0).sort()[0]; u=k?A.sound(k):null; } return u||A.MUSIC; };
/** Original-Pfad → Ersatz-Pfad, wenn es einen gibt (sonst unverändert). Für Musik und Sprachaufnahmen. */
A.audio=path=>{ const p=String(path||''); let m;
  if(/(^|\/)assets\/sounds\/musik\.mp3$/.test(p)){ const u=A.music(); return u===A.MUSIC?p:u; }
  if((m=/(?:^|\/)assets\/voice\/([^\/?#]+)$/.exec(p))) return A.sound('sprache/'+m[1])||p;
  return p; };
/* Sätze vergleichen: Groß/Klein, Anführungszeichen, Apostrophe, Leerzeichen und Satzzeichen am Rand sind egal */
const satzNorm=s=>{ s=String(s==null?'':s); try{ s=s.normalize('NFC'); }catch(e){}
  return s.toLowerCase().replace(/[’‘´`]/g,"'").replace(/[„“”«»]/g,'"').replace(/[–—]/g,'-').replace(/…/g,'...').replace(/\s+/g,' ')
    .replace(/^[\s"'.,;:!?-]+|[\s"'.,;:!?-]+$/g,''); };
A.satzNorm=satzNorm;
let szSrc=null, szMap=new Map();
function saetze(){ const o=(window.ASSET_MAP&&window.ASSET_MAP.saetze)||null; if(o!==szSrc){ szSrc=o; szMap=new Map(); if(o) for(const k in o){ const n=satzNorm(k); if(n&&typeof o[k]==='string') szMap.set(n,o[k]); } } return szMap; }
/* Dateinamen, die Stationen für ihre Sätze vorschlagen (ohne Eintrag in saetze.txt nutzbar) */
const vnames=new Map();
/** Station meldet: für diesen Satz darf die Datei sounds-neu/sprache/<name>.mp3 abgelegt werden */
A.voiceName=(satz,name)=>{ const n=satzNorm(satz); if(!n||!name) return; const k='sprache/'+snorm(name); const l=vnames.get(n); if(!l) vnames.set(n,[k]); else if(!l.includes(k)) l.push(k); };
A.voiceNames=()=>vnames;
/** Aufnahme zu einem Satz: {url, alt (Original als Rückfall oder null), user (true = Datei aus sounds-neu)} oder null */
A.voice=satz=>{ const M=window.VOICE_MAP||{}; const t=String(satz==null?'':satz).replace(/\s+/g,' ').trim(); if(!t) return null;
  const orig=M[t]?'assets/voice/'+M[t]:null, n=satzNorm(t);
  if(n){ const f=saetze().get(n); if(f){ const u=SBASE+encPath(f); if(!sbroken.has(u)) return {url:u,alt:orig,user:true}; }
    const l=vnames.get(n); if(l) for(const k of l){ const u=A.sound(k); if(u) return {url:u,alt:orig,user:true}; } }
  if(!orig) return null;
  const rep=A.sound('sprache/'+M[t]);
  return rep?{url:rep,alt:orig,user:true}:{url:orig,alt:null,user:false}; };
/* new Audio('assets/sounds/musik.mp3') / new Audio('assets/voice/…') nehmen von selbst die Ersatzdatei
   (app.js, kino.js … müssen dafür nichts wissen). Lässt sie sich nicht laden, spielt das Original weiter. */
const NA=window.Audio;
if(typeof NA==='function'&&!NA.__dw){
  const W=function(src){
    if(!arguments.length||src==null) return new NA();
    const orig=String(src), rep=A.audio(orig), a=new NA(rep);
    if(rep!==orig){ const h=ev=>{ a.removeEventListener('error',h,true); A.audioFail(rep); try{ ev.stopImmediatePropagation(); }catch(e){}
        const want=!a.paused||a.autoplay, loop=a.loop; a.src=orig; a.loop=loop; if(want){ try{ const p=a.play(); if(p&&p.catch) p.catch(()=>{}); }catch(e){} } };
      a.addEventListener('error',h,true); }
    return a; };
  W.prototype=NA.prototype; W.__dw=NA; try{ window.Audio=W; }catch(e){}
}

/* ---------------- Zuordnung: Name → Bild ---------------- */
const PIP_STAGE=['pip_baby','pip_halstuch','pip_rucksack','pip_hut','pip_forscher'];
/* Symbole mit anderem Dateinamen (Futter, Funde, Knöpfe). Sonst gilt symbole/<name>, danach objekte/<name>. */
const ICON_ALIAS={
  farn:['pflanzen/futter_farn'], blaetter:['pflanzen/futter_blaetter'], moos:['pflanzen/futter_moos'], gras:['pflanzen/futter_gras'],
  wurzeln:['pflanzen/futter_wurzeln'], zapfen:['pflanzen/futter_zapfen'], fruechte:['pflanzen/futter_fruechte'],
  zahn:['fossilien/zahn'], knochen:['fossilien/knochen'], ammonit:['fossilien/ammonit'], spur:['fossilien/spur'], blatt:['fossilien/blattabdruck'],
  bernstein:['fossilien/bernstein'], ei:['fossilien/dino_ei'], kristall:['fossilien/kristall'], muschel:['fossilien/muschel'], holz:['fossilien/holz'],
  fischfossil:['fossilien/fischfossil'], an_belemnit:['fossilien/belemnit'], belemnit:['fossilien/belemnit'], stein:['fossilien/steinplatte','objekte/stein'],
  lavastein:['fossilien/lavastein'], koprolith:['fossilien/koprolith'],
  stern:['ui/stern_voll'], herz:['ui/herz'], schloss:['ui/schloss'],
  rucksack:['symbole/ruecksack','objekte/rucksack'], mikrofon:['symbole/mikrofon','symbole/mikro'],
  koralle:['pflanzen/koralle_rot'], seelilie:['pflanzen/seelilie'], seetang:['pflanzen/seetang'],
};
const iconKey=name=>{
  if(!name||typeof name!=='string') return null;
  if(ICON_ALIAS[name]) return A.first(ICON_ALIAS[name]);
  if(!/^[a-z0-9_\-]+$/i.test(name)) return null;
  return A.first(['symbole/'+name,'objekte/'+name]);
};
A.iconKey=iconKey;
const resolveId=id=>{ try{ return (window.ART&&ART.resolve&&ART.resolve(id))||id; }catch(e){ return id; } };
const animalKey=(id,o)=>{
  if(!id||(o&&o.drawn)) return null; const r=resolveId(id);
  if(o&&o.baby){ const b=A.first(['tiere/baby_'+r,'tiere/baby_'+id]); if(b) return b; }
  return A.first(['tiere/'+r,'tiere/'+id]);
};
A.animalKey=animalKey;
A.animalURL=(id,o)=>{ const k=animalKey(id,o||{}); return k?A.url(k):null; };
const avatarKey=(a,pose)=>{ if(!a||!a.id) return null; const id=String(a.id).toLowerCase();
  const alt={laufen1:'stehen',laufen2:'stehen',lupe:'stehen',boot:'stehen',winken:'stehen'}[pose];
  return A.first([`figuren/kind_${id}_${pose}`,`figuren/${id}_${pose}`].concat(alt?[`figuren/kind_${id}_${alt}`,`figuren/${id}_${alt}`]:[])); };
A.avatarKey=avatarKey;

/* ---------------- Bild-SVG bauen ---------------- */
/* Fragment am PNG-Pfad: #dw~<token>~<token>  (f = gespiegelt, ca/cb = kauen, s = traurig, p0…p7 = Laufphase) */
function frag(o){ const t=[];
  if(o.flip) t.push('f');
  if(o.mood==='chew') t.push((o.ph||0)%1<.5?'ca':'cb');
  else if(o.mood==='sad') t.push('s');
  if(o.walk) t.push('p'+(Math.round(((o.ph||0)%1)*8)%8));
  return '#dw'+t.map(x=>'~'+x).join(''); }
const bobOf=ph=>-Math.abs(Math.sin((ph||0)*2*Math.PI))*.035; // Anteil der Bildhöhe (nach oben)
/* Bild in ein Rechteck einpassen: unten bündig, waagerecht mittig */
function fit(box,d){ let [x,y,w,h]=box; if(!(d[0]>0&&d[1]>0)) return [x,y,w,h];
  const ar=d[0]/d[1]; if(w/h>ar){ const w2=h*ar; return [x+(w-w2)/2,y,w2,h]; } const h2=w/ar; return [x,y+h-h2,w,h2]; }
function wrap(key,src,box,rect,o){
  const url=A.url(key), fr=frag(o), [x,y,w,h]=rect;
  let tr=''; if(o.flip) tr=`translate(${f1(2*x+w)} 0) scale(-1 1)`;
  let inner=`<image data-dwsrc="${esc(src)}" href="${esc(url)}" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" preserveAspectRatio="xMidYMax meet"/>`;
  if(o.walk&&o.ph) inner=`<g transform="translate(0 ${f1(bobOf(o.ph)*h)})">${inner}</g>`;
  if(o.mood==='chew') inner=`<g>${inner}<animateTransform attributeName="transform" type="translate" values="0 0;0 ${f1(h*.012)};0 0" dur=".45s" repeatCount="indefinite"/></g>`;
  if(o.mood==='sad') inner=`<g transform="rotate(3 ${f1(x+w/2)} ${f1(y+h)})" opacity=".92">${inner}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" data-dwpng="${esc(url+fr)}" viewBox="${f1(box[0])} ${f1(box[1])} ${f1(box[2])} ${f1(box[3])}" ${o.attrs||''}>${tr?`<g transform="${tr}">${inner}</g>`:inner}</svg>`;
}
const vbOf=s=>{ const m=/viewBox="([-\d.e]+)[ ,]+([-\d.e]+)[ ,]+([-\d.e]+)[ ,]+([-\d.e]+)"/.exec(s||''); return m?[+m[1],+m[2],+m[3],+m[4]]:null; };
const enc=o=>encodeURIComponent(JSON.stringify(o||{}));
const dec=s=>{ try{ return JSON.parse(decodeURIComponent(s)); }catch(e){ return {}; } };

/* ---------------- ART-Aufsätze ---------------- */
const ART=window.ART; if(!ART){ return; }
const O={animal:ART.animal, icon:ART.icon, avatar:ART.avatar, avatarFront:ART.avatarFront, toImage:ART.toImage};
A.drawn=O; // Originale (z. B. für Ausgrabung: Knochenfelder passen nur zur Zeichnung)
const boxCache=new Map();
function baseBox(id){ const k=resolveId(id); if(!boxCache.has(k)) boxCache.set(k,vbOf(O.animal.call(ART,id,{shadow:false}))||[0,0,200,120]); return boxCache.get(k); }

ART.animal=function(id,opts={}){
  opts=opts||{}; const key=animalKey(id,opts);
  if(!key) return O.animal.call(ART,id,opts);
  let box;
  if(opts.box){ const b=opts.box; box=[b[0],b[1],b[2]-b[0],b[3]-b[1]]; }
  else { const b=baseBox(id), d=(opts.pad??6)-6; box=[b[0]-d,b[1]-d,b[2]+2*d,b[3]+2*d]; }
  const rect=fit(box,A.dims(key));
  if(!opts.box) box=rect.slice(); // Seitenverhältnis des Bildes übernehmen
  const o={flip:opts.flip,mood:opts.mood,ph:opts.ph,walk:opts.ph!=null&&opts.mood!=='chew',attrs:opts.attrs};
  const so=Object.assign({},opts); delete so.attrs;
  return wrap(key,'a|'+id+'|'+enc(so),box,rect,o);
};
ART.icon=function(name,size){
  if(typeof name==='string'&&name.startsWith('animal:')) return O.icon.call(ART,name,size);
  const key=iconKey(name);
  if(!key&&ERA_ORIG[name]) return O.icon.call(ART,ERA_ORIG[name],size); // Zeitalter-Abzeichen ohne (ladbares) Bild → bisherige Zeichnung
  if(!key){ const s=O.icon.call(ART,name,size); return typeof name==='string'&&/^[\w\-]+$/.test(name)?s.replace('<svg ',`<svg data-ic="${name}" `):s; }
  const box=[0,0,64,64], rect=fit([2,2,60,60],A.dims(key));
  return wrap(key,'i|'+name+'|'+(size||''),box,rect,{attrs:(size?`width="${size}" height="${size}" `:'')+`aria-hidden="true" data-ic="${esc(name)}"`});
};
if(O.avatar) ART.avatar=function(a,opts={}){
  opts=opts||{}; const walk='ph' in opts&&opts.ph!=null;
  const pose=opts.lupe?'lupe':opts.boot?'boot':opts.wave?'winken':walk?(((opts.ph||0)%1)<.5?'laufen1':'laufen2'):'stehen';
  const key=avatarKey(a,pose); if(!key) return O.avatar.call(ART,a,opts);
  const box=[20,0,60,88], rect=fit([22,2,56,84],A.dims(key));
  const so=Object.assign({},opts); delete so.attrs;
  return wrap(key,'v|'+a.id+'|'+enc(so),box,rect,{flip:opts.flip,ph:opts.ph,walk,attrs:opts.attrs});
};
if(O.avatarFront) ART.avatarFront=function(a,opts={}){
  opts=opts||{}; const key=avatarKey(a,'winken'); if(!key) return O.avatarFront.call(ART,a,opts);
  const box=[0,0,100,130], rect=fit([4,4,92,122],A.dims(key));
  const so=Object.assign({},opts); delete so.attrs;
  return wrap(key,'w|'+a.id+'|'+enc(so),box,rect,{attrs:opts.attrs});
};

/** Bild-SVG für beliebige Grafik (z. B. Figuren) in einem Rahmen box=[x,y,b,h]; null wenn das Bild fehlt */
A.svg=(k,box=[0,0,100,100],attrs='')=>{ k=A.first([k]); if(!k) return null; const pad=Math.min(box[2],box[3])*.03;
  return wrap(k,'x|'+k,box,fit([box[0]+pad,box[1]+pad,box[2]-2*pad,box[3]-2*pad],A.dims(k)),{attrs}); };

/* Zeichnung für ein eingebettetes Bild (wenn es in einer Daten-URL landet) */
function drawnFor(src){
  const [t,id,rest]=src.split('|');
  try{
    if(t==='a'){ const o=dec(rest); delete o.flip; return O.animal.call(ART,id,o); }
    if(t==='i') return O.icon.call(ART,ERA_ORIG[id]||id,rest?+rest:undefined);
    if(t==='v'||t==='w'){ const a=(ART.AVATARS||[]).find(x=>x.id===id); const o=dec(rest); delete o.flip; return a?(t==='v'?O.avatar:O.avatarFront).call(ART,a,o):''; }
    if(t==='p'&&window.QUEST&&pipOrig) return pipOrig(+id,dec(rest));
  }catch(e){}
  return '';
}
const IMG_RE=/<image data-dwsrc="([^"]*)" href="[^"]*" x="([^"]*)" y="([^"]*)" width="([^"]*)" height="([^"]*)"[^>]*\/>/g;
/** Eingebettete Bilder durch die Zeichnung ersetzen (für Daten-URLs) */
A.restore=svg=>{
  if(typeof svg!=='string'||svg.indexOf('data-dwsrc=')<0) return svg;
  // Hülle entfernen: <svg data-dwpng…>…</svg> behält nur den Inhalt (Rahmen-Transform bleibt korrekt)
  return svg.replace(IMG_RE,(m,src,x,y,w,h)=>{ const s=drawnFor(src.replace(/&amp;/g,'&').replace(/&quot;/g,'"'));
    if(!s) return ''; return (s.indexOf('data-dwsrc=')>=0&&src[0]==='p'?A.restore(s):s).replace(/^\s*<svg\b([^>]*)>/,(all,at)=>`<svg${at.replace(/\s(width|height|x|y)="[^"]*"/g,'')} x="${x}" y="${y}" width="${w}" height="${h}">`); });
};
const WHOLE=/^\s*<svg\b[^>]*\sdata-dwpng="([^"]+)"[^>]*>((?!<svg\b)[\s\S])*<\/svg>\s*$/;
/** PNG-Pfad (mit #dw-Fragment), wenn das SVG genau ein Bild-SVG ist */
A.urlOf=svg=>{ if(typeof svg!=='string'||svg.indexOf('data-dwpng=')<0) return null; const m=WHOLE.exec(svg); return m?m[1].replace(/&amp;/g,'&'):null; };

ART.toImage=function(svg,key){
  const u=A.urlOf(svg);
  if(!u) return O.toImage.call(ART,A.restore(svg),key);
  const k='png|'+(key||u);
  if(imgs.has(k)) return imgs.get(k);
  const img=new Image(); img.decoding='async'; img.src=u;
  img.ready=new Promise(res=>{img.onload=()=>res(img);img.onerror=()=>res(img);});
  imgs.set(k,img); return img;
};

/* ---------------- Canvas: Spiegeln & Wippen für Bilder mit #dw-Fragment ---------------- */
const CP=window.CanvasRenderingContext2D&&CanvasRenderingContext2D.prototype;
if(CP&&!CP.__dwDraw){
  const DI=CP.drawImage; CP.__dwDraw=DI;
  const info=img=>{ if(!img||img.tagName!=='IMG') return null; const s=img.getAttribute('src')||'';
    if(img._dwS===s) return img._dwI; img._dwS=s; const i=s.indexOf('#dw'); let r=null;
    if(i>=0){ const t=s.slice(i+3).split('~'); r={f:t.includes('f'),b:0,c:0,s:t.includes('s')};
      const p=t.find(x=>/^p\d$/.test(x)); if(p) r.b=bobOf(+p[1]/8); if(t.includes('ca')) r.c=.012; if(t.includes('cb')) r.c=-.006;
      if(!r.f&&!r.b&&!r.c&&!r.s) r=null; }
    img._dwI=r; return r; };
  CP.drawImage=function(img,...a){
    const I=info(img); if(!I) return DI.call(this,img,...a);
    let dx,dy,dw,dh,src=null;
    if(a.length<=2){ dx=a[0];dy=a[1];dw=img.naturalWidth;dh=img.naturalHeight; }
    else if(a.length<=4){ [dx,dy,dw,dh]=a; }
    else { src=a.slice(0,4); [dx,dy,dw,dh]=a.slice(4); }
    this.save();
    dy+=(I.b+I.c)*dh;
    if(I.f){ this.translate(dx+dw/2,0); this.scale(-1,1); this.translate(-(dx+dw/2),0); }
    if(I.s){ this.translate(dx+dw/2,dy+dh); this.rotate(.05); this.translate(-(dx+dw/2),-(dy+dh)); }
    try{ src?DI.call(this,img,...src,dx,dy,dw,dh):DI.call(this,img,dx,dy,dw,dh); } finally { this.restore(); }
  };
}

/* ---------------- CSS: Stimmungen für <img>, Knöpfe, Hintergründe ---------------- */
function css(){
  /* Gemalte Bilder haben (anders als die SVG-Zeichnungen) eine feste Pixelgröße: nie größer als ihr Platz */
  let s=`img[src*="#dw"]{max-width:100%;max-height:100%;object-fit:contain}
img[src*=".png#dw"]{transition:translate .12s,rotate .3s,filter .3s}
img[src*="#dw~"][src*="~f"]{scale:-1 1}
img[src*="#dw~"][src*="~ca"]{translate:0 2%}
img[src*="#dw~"][src*="~cb"]{translate:0 -1%}
img[src*="#dw~"][src*="~s"]{rotate:4deg;filter:saturate(.7) brightness(.97)}
${[0,1,2,3,4,5,6,7].map(i=>`img[src*="#dw~"][src*="~p${i}"]{translate:0 ${f1(bobOf(i/8)*100)}%}`).join('\n')}
.dw-lv-img{width:46px;height:46px;object-fit:contain;display:block;margin:0 auto}
#station .paperbg.dw-bg{background-size:cover!important;background-position:center!important;opacity:1}
`;
  const UI=[['btn_rucksack','#btnBag'],['btn_eltern','#btnParents'],['btn_vorlesen','#btnSay,.gk-say,#spotSay,.qc-say'],
    ['btn_ton_an','#btnSound'],['btn_ton_aus','#btnSound:has(svg[data-ic="stumm"])'],['btn_musik','#btnMusic'],
    ['btn_zoom_plus','#btnZoomIn'],['btn_zoom_minus','#btnZoomOut'],['btn_wobinich','#btnWhere'],['btn_ganzekarte','#btnMap'],
    ['btn_schliessen','#spotX,.modal>.ibtn.x']];
  UI.forEach(([k,sel])=>{ const u=A.url('ui/'+k); if(!u) return;
    s+=`${sel}{background:url("${u}") center/contain no-repeat!important;border-color:transparent!important;box-shadow:none!important;color:transparent!important}\n`+
       sel.split(',').map(x=>`${x}>svg,${x}>img`).join(',')+`{opacity:0}\n`; });
  const home=A.url('ui/btn_zurinsel');
  if(home) s+=`#btnHome{background:url("${home}") center/100% 100% no-repeat!important;border-color:transparent!important;box-shadow:none!important}#btnHome #homeIcon{visibility:hidden}\n`;
  let el=document.getElementById('dw-assets-css'); if(!el){ el=document.createElement('style'); el.id='dw-assets-css'; (document.head||document.documentElement).appendChild(el); }
  el.textContent=s;
}
A.refreshCSS=css;

/* Stationshintergrund (quer/hoch je nach Ausrichtung) */
let curStation=null;
A.stationBg=id=>{ if(!id) return null; const quer=innerWidth>=innerHeight;
  return A.url(A.first(quer?[`stationen/hintergrund_${id}_quer`,`stationen/hintergrund_${id}_hoch`]:[`stationen/hintergrund_${id}_hoch`,`stationen/hintergrund_${id}_quer`])||''); };
function applyBg(){ const bg=document.querySelector('#station .paperbg'); if(!bg) return;
  const u=curStation&&A.stationBg(curStation);
  if(u){ bg.style.backgroundImage=`linear-gradient(rgba(247,240,225,.28),rgba(247,240,225,.28)),url("${u}")`; bg.classList.add('dw-bg'); }
  else if(bg.classList.contains('dw-bg')){ bg.style.backgroundImage=''; bg.classList.remove('dw-bg'); } }
let rsT=0; addEventListener('resize',()=>{ clearTimeout(rsT); rsT=setTimeout(applyBg,150); });

/* ---------------- Aufsätze auf DW / DATA / QUEST (von game.js aufgerufen, core.js ist dann geladen) ---------------- */
let patched=false;
A.patchDW=function(){
  if(patched||!window.DW) return; patched=true;
  const DW=window.DW, svgURL0=DW.svgURL;
  DW.svgURL=svg=>{ const u=A.urlOf(svg); return u||svgURL0(A.restore(svg)); };
  if(DW.on){ DW.on('station',id=>{curStation=id;applyBg();}); DW.on('world',()=>{curStation=null;applyBg();}); }
  stickers(); eras(); css();
};
/* Sticker: eigenes Bild pro Sticker, wenn vorhanden (sonst bleibt das Symbol) */
function stickers(){
  const D=window.DATA; if(!D||!D.STICKERS) return;
  D.STICKERS.forEach(s=>{ if(!s||!s.id||String(s.icon).startsWith('stk_')) return; const k=A.first(['sticker/'+s.id]); if(!k) return;
    const nm='stk_'+s.id; ICON_ALIAS[nm]=[k]; if(ART.ICONS&&!ART.ICONS[nm]) ART.ICONS[nm]=ART.ICONS[s.icon]||''; s.icon=nm; });
}
A.stickers=stickers;
/* Zeitalter-Abzeichen: zeitalter/<id> ersetzt überall das Symbol des Erdzeitalters (DATA.ERAS[].icon, z. B. Zeitportal, Kartenhaus, Museum) */
const ERA_ORIG={};
function eras(){ const D=window.DATA; if(!D||!D.ERAS) return;
  D.ERAS.forEach(e=>{ if(!e||!e.id||String(e.icon).startsWith('era_')) return; const k=A.first(['zeitalter/'+e.id]); if(!k) return;
    const nm='era_'+e.id; ERA_ORIG[nm]=e.icon; ICON_ALIAS[nm]=[k]; e.icon=nm; }); }
A.eras=eras;

/* Pip (quest.js): bei vorhandenem Bild die ganze Figur ersetzen – Rahmen 176×116 bleibt gleich */
let pipOrig=null;
function hookPip(Q){
  let fn=Q.pipSVG;
  const wrapPip=orig=>{ pipOrig=orig; return (stage,o={})=>{ const k=typeof stage==='number'?stage:(Q.stage?Q.stage():0);
    const key=A.first([`figuren/${PIP_STAGE[Math.max(0,Math.min(PIP_STAGE.length-1,k))]}`]);
    if(!key) return orig(stage,o);
    const box=[0,0,176,116], rect=fit([4,4,168,110],A.dims(key));
    return wrap(key,'p|'+k+'|'+enc(o),box,rect,{ph:o&&o.ph,walk:!!(o&&o.ph),attrs:'width="352" height="232"'}); }; };
  Object.defineProperty(Q,'pipSVG',{configurable:true,enumerable:true,get(){return fn;},set(v){ fn=typeof v==='function'?wrapPip(v):v; }});
  if(fn) Q.pipSVG=fn;
}
if(!('QUEST' in window)){
  let q; Object.defineProperty(window,'QUEST',{configurable:true,enumerable:true,get(){return q;},set(v){ q=v; if(v&&typeof v==='object') hookPip(v); }});
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{ stickers(); eras(); css(); });
})();
