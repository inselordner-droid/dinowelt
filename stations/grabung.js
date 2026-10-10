/* =====================================================================
   DINO-INSELWELT · Station Ausgrabung
   Mit Schaufel & Pinsel graben, Knochen finden, Skelett zusammensetzen.
   ===================================================================== */
(function(){
"use strict";
let root, st=null, raf=0;
const DG=()=>{ const d=DW.state.dig=DW.state.dig||{done:{}}; d.done=d.done||{}; d.last=d.last||{}; return d; };
const planOf=id=>((ART.SPECIES||{})[ART.resolve((DATA.animal(id)||{}).art||id)]||{}).plan;
/* Tier für diese Grabung: passend zu Zeitalter/Bauplan der Fundstelle, nicht dasselbe wie beim letzten Mal */
function sitePool(site){
  const L=id=>DATA.lenM(id)||0;
  const pool=DATA.ANIMALS.filter(a=>SLOTS[a.id]&&ART.has(a.art)&&(!site.eras||site.eras.includes(a.era))&&(!site.plans||site.plans.includes(planOf(a.id)))
    &&(site.minM==null||L(a.id)>=site.minM)&&(site.maxM==null||L(a.id)<=site.maxM)).map(a=>a.id);
  if(site.animal&&!pool.includes(site.animal)&&SLOTS[site.animal]) pool.unshift(site.animal);
  return pool.length?pool:[site.animal||'trex'];
}
function pickAnimal(site){
  const g=DG(), pool=sitePool(site);
  if(!g.done[site.id]&&pool.includes(site.animal)) return site.animal;   // beim ersten Mal das bekannte Tier
  const fresh=pool.filter(id=>id!==g.last[site.id]);
  return DW.pick(fresh.length?fresh:pool);
}
const SLOTS={ // x%,y%,w%,h%,Drehung – Lage der Knochen im Bild des Tiers
 trex:{schaedel:[84,27,28,24,0],wirbel:[50,35,48,7,-6],rippen:[58,50,22,22,0],vorderbein:[69,53,8,13,25],hinterbein:[48,66,12,40,0],schwanz:[18,42,32,7,5]},
 triceratops:{schaedel:[84,46,28,34,0],wirbel:[55,30,44,7,-2],rippen:[57,50,28,22,0],vorderbein:[74,69,10,28,0],hinterbein:[47,70,10,28,0],schwanz:[16,48,30,7,12]},
 stegosaurus:{schaedel:[91,69,14,14,0],wirbel:[58,45,42,7,-6],rippen:[62,58,28,20,0],vorderbein:[84,78,10,30,0],hinterbein:[52,76,10,34,0],schwanz:[18,57,30,7,-16]},
 brachiosaurus:{schaedel:[89,11,14,11,0],wirbel:[73,40,44,7,-58],rippen:[52,62,26,22,0],vorderbein:[68,85,10,34,0],hinterbein:[43,84,10,34,0],schwanz:[22,69,30,7,22]},
 velociraptor:{schaedel:[85,31,22,18,0],wirbel:[52,40,44,7,-5],rippen:[62,52,20,16,0],vorderbein:[74,56,8,13,30],hinterbein:[52,72,9,32,0],schwanz:[17,43,32,7,2]},
 mammut:{schaedel:[84,40,22,28,0],wirbel:[48,24,48,7,0],rippen:[48,50,34,26,0],vorderbein:[75,76,10,32,0],hinterbein:[36,77,10,30,0],schwanz:[10,48,10,7,-50]},
 /* weitere Tiere (mehr Abwechslung beim Graben) – Lage passend zur Zeichnung ausgemessen */
 allosaurus:{schaedel:[86.9,22.3,20.2,18.2,0],wirbel:[52.2,34.2,34.8,7,-5],rippen:[54.6,45.1,19.3,22.9,0],vorderbein:[70,55,10,13,30],hinterbein:[51,65,12,42,0],schwanz:[13.6,40.9,26.8,7,0]},
 ceratosaurus:{schaedel:[86.9,22.7,20.2,20.3,0],wirbel:[52.1,35.5,34.8,7,-4],rippen:[54.7,46.1,19.3,21.4,0],vorderbein:[70,55,10,13,30],hinterbein:[51,65,12,42,0],schwanz:[13.5,41.4,27,7,0]},
 carnotaurus:{schaedel:[87.1,22.3,20.2,20.3,0],wirbel:[52.4,34.7,34.8,7,-4],rippen:[54.9,45.2,19.3,21.5,0],vorderbein:[70,55,10,13,30],hinterbein:[51,65,12,42,0],schwanz:[13.8,41.1,27,7,0]},
 giganotosaurus:{schaedel:[87.3,22,20.5,16.1,0],wirbel:[52.4,32,35.4,7,-10],rippen:[55.1,43.2,19.4,23.6,0],vorderbein:[70,55,10,13,30],hinterbein:[51,65,12,42,0],schwanz:[13.5,40.3,27,7,0]},
 styracosaurus:{schaedel:[89.8,34.5,21,43.1,0],wirbel:[53.9,23.2,37,7,-14],rippen:[57.7,39,20,24.5,0],vorderbein:[76,71,13,32,0],hinterbein:[51,71,14,32,0],schwanz:[13.9,48.2,27.8,7,0]},
 protoceratops:{schaedel:[88,36.5,20.5,42.4,0],wirbel:[53,27,35.2,7,-7],rippen:[56.7,41.3,19.5,22.9,0],vorderbein:[76,71,13,32,0],hinterbein:[51,71,14,32,0],schwanz:[14,48.7,27,7,0]},
 pachyrhinosaurus:{schaedel:[89.8,37.2,21,41,0],wirbel:[54,26.3,36,7,-6],rippen:[57.6,40.8,19.9,22.8,0],vorderbein:[76,71,13,32,0],hinterbein:[51,71,14,32,0],schwanz:[14.1,49.1,27.8,7,0]},
 kentrosaurus:{schaedel:[91,65,12,14,0],wirbel:[53.5,24.8,35.5,7,8],rippen:[57,39.1,19.6,32.4,0],vorderbein:[79,72,12,36,0],hinterbein:[55,75,13,40,0],schwanz:[14.4,56,27.3,7,0]},
 iguanodon:{schaedel:[88.3,38.5,20.5,34,0],wirbel:[52.9,30.7,35.3,7,2],rippen:[56.4,42.2,19.6,19.9,0],vorderbein:[74,66,11,26,0],hinterbein:[50,62,12,32,0],schwanz:[13.6,42.1,27.3,7,0]},
 edmontosaurus:{schaedel:[88.9,38.7,20.7,32.9,0],wirbel:[53.3,30.7,35.6,7,2],rippen:[56.6,42.2,19.8,20.1,0],vorderbein:[74,66,11,26,0],hinterbein:[50,62,12,32,0],schwanz:[13.8,41.9,27.5,7,0]},
 deinonychus:{schaedel:[86.5,28.5,19.9,26.3,0],wirbel:[52.5,34.8,34,7,-2],rippen:[56,44.6,18.9,19.1,0],vorderbein:[72,53,10,14,30],hinterbein:[51,64,10,40,0],schwanz:[14.6,38.1,26.3,7,0]},
 utahraptor:{schaedel:[87,28.7,19.9,25.2,0],wirbel:[52.9,34.3,34.2,7,-4],rippen:[56.4,44.1,19,19.4,0],vorderbein:[72,53,10,14,30],hinterbein:[51,64,10,40,0],schwanz:[15,38.8,26.5,7,0]},
 diplodocus:{schaedel:[88.9,22.3,20.7,16.1,0],wirbel:[53.3,30.3,35.6,7,-2],rippen:[55.8,43.9,19.8,22.3,0],vorderbein:[63,70,15,34,0],hinterbein:[44,70,15,34,0],schwanz:[13.8,47.9,27.5,7,0]},
 brontosaurus:{schaedel:[88.9,21.7,20.7,18.2,0],wirbel:[53.3,28,35.6,7,0],rippen:[55.7,43.2,19.8,23.8,0],vorderbein:[63,70,15,34,0],hinterbein:[44,70,15,34,0],schwanz:[13.8,47.3,27.5,7,0]},
 argentinosaurus:{schaedel:[88.8,21,20.5,16.1,0],wirbel:[53.4,27.3,35.3,7,2],rippen:[55.5,42,19.6,23.7,0],vorderbein:[63,70,15,34,0],hinterbein:[44,70,15,34,0],schwanz:[14.1,46.5,27.3,7,0]},
 wollnashorn:{schaedel:[90.1,36.2,20.2,34,0],wirbel:[55.5,18.2,34.8,7,5],rippen:[59.1,35.3,19.3,26.9,0],vorderbein:[71,68,15,36,0],hinterbein:[36,68,15,36,0],schwanz:[16.9,42.9,26.8,7,0]},
 smilodon:{schaedel:[88.1,37.7,19.7,41.3,0],wirbel:[54.4,18.3,33.8,7,1],rippen:[58.4,34.5,18.8,25.5,0],vorderbein:[71,68,15,36,0],hinterbein:[36,68,15,36,0],schwanz:[16.9,40.8,26.3,7,0]},
 hoehlenbaer:{schaedel:[88.4,37.3,19.7,35.7,0],wirbel:[54.9,18,33.7,7,4],rippen:[58.5,35.3,18.7,26.7,0],vorderbein:[71,68,15,36,0],hinterbein:[36,68,15,36,0],schwanz:[17.5,42.4,26,7,0]},
 megaloceros:{schaedel:[88.6,27.2,19.7,41,0],wirbel:[54.8,14.2,33.9,7,4],rippen:[58.8,31.8,18.8,29.2,0],vorderbein:[71,68,15,36,0],hinterbein:[36,68,15,36,0],schwanz:[17.1,37.2,26.3,7,0]},
 dimetrodon:{schaedel:[88.3,61.2,20.5,22.1,0],wirbel:[55,53,44,7,-2],rippen:[55,62,24,14,0],vorderbein:[69,78,12,24,0],hinterbein:[41,78,12,24,0],schwanz:[13.9,65.5,27.3,7,0]},
 edaphosaurus:{schaedel:[88.5,60.8,20.5,24.2,0],wirbel:[55,50,44,7,-3],rippen:[55,60,24,14,0],vorderbein:[71,80,12,24,0],hinterbein:[41,80,12,24,0],schwanz:[14.1,66,27.3,7,0]},
 ichthyosaurus:{schaedel:[89.1,47.5,20.2,12.3,0],wirbel:[54.2,42.5,35,7,-6],rippen:[58,49.9,19.4,18.9,0],vorderbein:[68,66,14,16,30],hinterbein:[42,67,10,12,30],schwanz:[15.5,55,27,7,0]},
 plesiosaurus:{schaedel:[88.9,22.2,20.7,8.8,0],wirbel:[53.4,31.8,35.7,7,-7],rippen:[53.3,42.8,19.7,19.9,0],vorderbein:[42,72,14,14,-35],hinterbein:[24,70,14,14,-35],schwanz:[8,55,12,6,0]},
};
function boneSVG(k,view=true){ const c='#efe4cc',s='#6e5a44';
  const b={schaedel:`<svg viewBox="0 0 100 70" preserveAspectRatio="none"><path d="M8 40Q6 18 30 14Q60 8 88 22Q98 28 94 38Q90 48 70 50L66 62Q52 66 44 58L40 50Q18 52 8 40Z" fill="${c}" stroke="${s}" stroke-width="4" stroke-linejoin="round"/><circle cx="68" cy="28" r="7" fill="${s}"/><circle cx="36" cy="32" r="9" fill="${s}" opacity=".5"/><path d="M50 50l4 8M60 49l3 8M70 48l2 7" stroke="${s}" stroke-width="4" stroke-linecap="round"/></svg>`,
   wirbel:`<svg viewBox="0 0 200 40" preserveAspectRatio="none"><path d="M6 20H194" stroke="${s}" stroke-width="6" stroke-linecap="round"/>${[...Array(8)].map((_,i)=>`<rect x="${10+i*23}" y="7" width="18" height="26" rx="7" fill="${c}" stroke="${s}" stroke-width="4"/>`).join('')}</svg>`,
   rippen:`<svg viewBox="0 0 120 80" preserveAspectRatio="none"><path d="M10 8H110" stroke="${s}" stroke-width="6" stroke-linecap="round"/>${[...Array(5)].map((_,i)=>`<path d="M${18+i*21} 10Q${8+i*21} 46 ${26+i*21} 70" fill="none" stroke="${s}" stroke-width="12" stroke-linecap="round"/><path d="M${18+i*21} 10Q${8+i*21} 46 ${26+i*21} 70" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`).join('')}</svg>`,
   schwanz:`<svg viewBox="0 0 200 40" preserveAspectRatio="none"><path d="M8 20Q60 12 190 22" stroke="${s}" stroke-width="5" fill="none" stroke-linecap="round"/>${[...Array(9)].map((_,i)=>`<rect x="${8+i*21}" y="${9+i*.7}" width="${17-i}" height="${22-i*1.4}" rx="6" fill="${c}" stroke="${s}" stroke-width="3.5"/>`).join('')}</svg>`,
   bein:`<svg viewBox="0 0 60 120" preserveAspectRatio="none"><path d="M30 10Q18 40 30 60Q40 84 26 110" fill="none" stroke="${s}" stroke-width="20" stroke-linecap="round"/><path d="M30 10Q18 40 30 60Q40 84 26 110" fill="none" stroke="${c}" stroke-width="13" stroke-linecap="round"/><circle cx="30" cy="10" r="10" fill="${c}" stroke="${s}" stroke-width="4"/><path d="M12 112H42" stroke="${s}" stroke-width="15" stroke-linecap="round"/><path d="M12 112H42" stroke="${c}" stroke-width="9" stroke-linecap="round"/></svg>`};
  return b[k==='vorderbein'||k==='hinterbein'?'bein':k]; }

/* Werkzeug-Knöpfe reagieren schon beim Loslassen des Fingers (pointerup). Auf „click“ allein ist direkt nach einem
   Wisch über die Grabungsfläche kein Verlass; „click“ bleibt als zweiter Weg (Tastatur), doppelt wird nicht ausgelöst. */
function fastTap(el,fn){ let dn=null, t=0;
  el.addEventListener('pointerdown',e=>{ if(e.button>0) return; dn={id:e.pointerId,x:e.clientX,y:e.clientY}; });
  el.addEventListener('pointerup',e=>{ const d=dn; dn=null; if(!d||d.id!==e.pointerId||Math.hypot(e.clientX-d.x,e.clientY-d.y)>16) return; t=performance.now(); fn(e); });
  el.addEventListener('pointercancel',()=>{ dn=null; });
  el.addEventListener('click',e=>{ if(performance.now()-t<700) return; fn(e); }); }
function mount(r){ root=r; sites(); }
function sites(){
  st=null; cancelAnimationFrame(raf);
  const done=Object.keys(DG().done).length;
  root.innerHTML=`<div class="fill col" style="overflow:auto"><p class="hand" style="text-align:center;font-size:28px;margin:4px 0">Wo wollen wir graben?</p>
    <div class="menu">${DATA.DIG_SITES.map(s=>{const lock=done<s.need, ok=DG().done[s.id];
      return `<button class="tile ${lock?'locked':''}" data-s="${s.id}"><div class="pic" style="border-radius:16px;overflow:hidden;background:${(window.ASSETS&&ASSETS.url('objekte/grabung_'+s.id))?`center/cover url('${ASSETS.url('objekte/grabung_'+s.id)}'),`:''}linear-gradient(${s.layers[0]} 0 34%,${s.layers[1]} 34% 67%,${s.layers[2]} 67%)">${ok?DW.animalImg(DG().last[s.id]||s.animal,{}):DW.iconImg('grabung')}</div><b>${s.n}</b><small>${lock?`nach ${s.need} Grabung${s.need>1?'en':''}`:ok?'geschafft!':''}</small>${lock?`<span class="lock">${ART.icon('schloss')}</span>`:ok?`<span class="done">${ART.icon('check')}</span>`:''}</button>`;}).join('')}</div></div>`;
  DW.$$('.tile',root).forEach(t=>t.onclick=()=>{ const s=DATA.DIG_SITES.find(x=>x.id===t.dataset.s); if(t.classList.contains('locked')){DW.sfx('no');DW.say('Diese Fundstelle ist noch nicht entdeckt. Grab erst woanders!');return;} DW.sfx('pop'); dig(Object.assign({},s,{animal:pickAnimal(s)})); });
  DW.say('Wo wollen wir graben? Tippe eine Fundstelle an.');
}

/* ---------------- Graben ---------------- */
function dig(site){
  root.innerHTML=`<div class="dg fill"><div class="dg-field" id="dgField"><canvas id="dgCv"></canvas><div class="dg-cursor" id="dgCur"></div></div>
    <div class="dg-side"><div class="dg-tools">
      <button class="dg-tool" data-t="schaufel">${ART.icon('schaufel',54)}<span>Schaufel</span></button>
      <button class="dg-tool" data-t="hammer">${ART.icon('hammer',54)}<span>Hammer</span></button>
      <button class="dg-tool" data-t="pinsel">${ART.icon('pinsel',54)}<span>Pinsel</span></button>
      <button class="dg-tool" data-t="lupe">${ART.icon('scanner',54)}<span>Scanner</span></button></div>
      <div class="dg-found card" id="dgFound"></div></div></div>`;
  const field=root.querySelector('#dgField'), cv=root.querySelector('#dgCv'), ctx=cv.getContext('2d');
  const R=field.getBoundingClientRect(); const W=Math.round(R.width), H=Math.round(R.height); cv.width=W; cv.height=H;
  const mk=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c;};
  const layers=site.layers.map((col,i)=>{ const c=mk(),x=c.getContext('2d',{willReadFrequently:true}); x.fillStyle=col;x.fillRect(0,0,W,H);
    for(let k=0;k<W*H/260;k++){x.fillStyle=`rgba(${i%2?255:40},${i%2?245:30},${i%2?220:20},${Math.random()*.18})`;const r=1+Math.random()*3;x.beginPath();x.arc(Math.random()*W,Math.random()*H,r,0,7);x.fill();}
    x.strokeStyle='rgba(60,45,30,.15)';x.lineWidth=2;for(let y=20;y<H;y+=26+Math.random()*20){x.beginPath();x.moveTo(0,y);for(let px=0;px<=W;px+=30)x.lineTo(px,y+Math.sin(px*.02+i)*6);x.stroke();}
    if(i===2){ for(let k=0;k<W*H/2600;k++){ const sx=Math.random()*W,sy=Math.random()*H,sr=8+Math.random()*22; x.fillStyle=ART.shade(col,.8+Math.random()*.3); x.beginPath(); for(let a=0;a<6;a++){const an=a/6*Math.PI*2,rr=sr*(.7+Math.random()*.5);a?x.lineTo(sx+Math.cos(an)*rr,sy+Math.sin(an)*rr):x.moveTo(sx+Math.cos(an)*rr,sy+Math.sin(an)*rr);} x.closePath(); x.fill(); x.strokeStyle='rgba(50,40,30,.25)'; x.lineWidth=1.5; x.stroke(); } }
    if(i===0){for(let k=0;k<30;k++){x.fillStyle='rgba(120,160,90,.5)';x.beginPath();x.ellipse(Math.random()*W,Math.random()*H,6,3,Math.random()*3,0,7);x.fill();}}
    return c; });
  // Grundgestein mit Knochen
  const base=mk(), bx=base.getContext('2d'); bx.fillStyle=ART.shade(site.layers[2],.75); bx.fillRect(0,0,W,H);
  for(let k=0;k<W*H/400;k++){bx.fillStyle=`rgba(0,0,0,${Math.random()*.12})`;bx.fillRect(Math.random()*W,Math.random()*H,2,2);}
  const items=[]; const place=(w,h)=>{ for(let t=0;t<200;t++){ const x=30+Math.random()*(W-w-60), y=30+Math.random()*(H-h-60); if(items.every(o=>x+w<o.x-14||x>o.x+o.w+14||y+h<o.y-14||y>o.y+o.h+14)) return [x,y]; } return [30+Math.random()*(W-w-60),30+Math.random()*(H-h-60)]; };
  const bs=Math.min(W,H)/5;
  DATA.BONES.forEach(b=>{ const leg=b.k.includes('bein'), wide=b.k==='wirbel'||b.k==='schwanz'; const w=leg?bs*.6:wide?bs*1.8:bs*1.2, h=leg?bs*1.2:wide?bs*.45:bs*.85; const [x,y]=place(w,h); items.push({kind:'bone',k:b.k,x,y,w,h,found:false}); });
  DW.shuffle(site.side.filter(f=>DATA.find(f))).slice(0,2).forEach(fid=>{ const w=bs*.8,h=bs*.8; const [x,y]=place(w,h); items.push({kind:'find',id:fid,x,y,w,h,found:false}); });
  let loaded=0; items.forEach(it=>{ const svg=it.kind==='bone'?boneSVG(it.k):ART.icon(DATA.find(it.id).icon); const img=new Image(); img.onload=()=>{ bx.save(); bx.shadowColor='rgba(0,0,0,.35)'; bx.shadowBlur=6; bx.drawImage(img,it.x,it.y,it.w,it.h); bx.restore(); loaded++; if(st) st.dirty=true; }; img.src=DW.svgURL(svg.includes('xmlns')?svg:svg.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"')); });
  st={site,field,cv,ctx,W,H,layers,base,items,tool:'schaufel',found:0,scan:0,last:0,down:false,soundT:0,dirty:true,ptr:new Set(),queue:[]};
  const setTool=t=>{ if(!st) return; if(t==='lupe'){ st.scan=performance.now(); DW.sfx('magic'); DW.say('Piep, piep! Der Scanner zeigt, wo noch etwas versteckt ist.'); return; } st.tool=t; DW.$$('.dg-tool',root).forEach(b=>b.classList.toggle('sel',b.dataset.t===t)); DW.sfx('tap');
    DW.say(t==='schaufel'?'Die Schaufel gräbt schnell die weiche Erde weg.':t==='hammer'?'Der Hammer bricht harten Stein auf. Aber Vorsicht bei den Knochen!':'Der Pinsel ist ganz vorsichtig. Damit legst du die Knochen frei, ohne sie kaputt zu machen.');
    root.querySelector('#dgCur').innerHTML=ART.icon(t,60); };
  DW.$$('.dg-tool',root).forEach(b=>fastTap(b,()=>setTool(b.dataset.t))); setTool('schaufel');
  // Bildschirm- → Canvas-Koordinaten (die Fläche kann sich nach dem Start in der Größe ändern, z. B. beim Drehen)
  const pos=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*st.W/Math.max(1,r.width),(e.clientY-r.top)*st.H/Math.max(1,r.height)];};
  /* Jeder Finger zählt für sich (st.ptr): hebt ein zweiter Finger ab, gräbt der erste weiter; der Werkzeug-Zeiger folgt dem ersten Finger. */
  const cur=root.querySelector('#dgCur'); let curId=null;
  GK.noFling(cv);
  cv.addEventListener('pointerdown',e=>{ if(!st||st.busy||e.button>0) return; e.preventDefault(); st.ptr.add(e.pointerId); st.down=true; if(curId===null) curId=e.pointerId; try{ cv.setPointerCapture(e.pointerId); }catch(err){} scrape(...pos(e),true); });
  cv.addEventListener('pointermove',e=>{ if(!st) return; const digging=st.ptr.has(e.pointerId);
    if(!st.ptr.size||e.pointerId===curId){ const r=cv.getBoundingClientRect(); cur.style.transform=`translate(${e.clientX-r.left}px,${e.clientY-r.top-50}px)`; cur.style.opacity=1; }
    if(digging&&!st.busy) scrape(...pos(e)); });
  const up=e=>{ if(!st) return; st.ptr.delete(e.pointerId); if(e.pointerId===curId) curId=st.ptr.size?st.ptr.values().next().value:null; st.down=st.ptr.size>0; };
  cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up); cv.addEventListener('lostpointercapture',up); cv.addEventListener('pointerleave',()=>{ cur.style.opacity=0; });
  foundBox();
  DW.say(`${site.n}. ${site.say} Nimm die Schaufel und fang an zu graben!`);
  /* nur neu malen, wenn sich etwas geändert hat (Graben, Scanner-Leuchten, Fund-Rahmen) – vier große Ebenen pro Bild sind auf Tablets teuer */
  const loop=t=>{ if(!st) return; const anim=(st.scan&&t-st.scan<2700)||st.items.some(it=>it.found&&(!it.glow||t-it.glow<1300));
    if(st.dirty||anim){ st.dirty=false; draw(t); } raf=requestAnimationFrame(loop); }; raf=requestAnimationFrame(loop);
}
function erase(i,x,y,r,str,chunky){ const c=st.layers[i].getContext('2d'); c.save(); c.globalCompositeOperation='destination-out';
  if(chunky){ c.fillStyle='#000'; c.beginPath(); for(let a=0;a<8;a++){const an=a/8*Math.PI*2,rr=r*(.55+Math.random()*.6);a?c.lineTo(x+Math.cos(an)*rr,y+Math.sin(an)*rr):c.moveTo(x+Math.cos(an)*rr,y+Math.sin(an)*rr);} c.closePath(); c.fill(); }
  else { const g=c.createRadialGradient(x,y,r*.2,x,y,r); g.addColorStop(0,'rgba(0,0,0,'+str+')'); g.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=g; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); }
  c.restore(); }
function alphaAt(i,x,y){ return st.layers[i].getContext('2d').getImageData(Math.round(x),Math.round(y),1,1).data[3]; }
function hint(tool,txt){ const now=performance.now(); if(now-(st.warn||0)<3500) return; st.warn=now; DW.say(txt); const b=root.querySelector(`[data-t=${tool}]`); if(b){b.classList.add('glow'); GK.after(3000,()=>b.classList.remove('glow'));} }
function scrape(x,y,first){
  const t=st.tool, M=Math.min(st.W,st.H), now=performance.now();
  const overFind=st.items.find(it=>!it.found&&x>it.x-12&&x<it.x+it.w+12&&y>it.y-12&&y<it.y+it.h+12);
  if(t==='schaufel'){ const rs=Math.max(M*.085,34); erase(0,x,y,rs,1); erase(1,x,y,rs,1);
    if(now-st.soundT>120){ DW.sfx('dig'); st.soundT=now; }
    if(alphaAt(1,x,y)<40&&alphaAt(2,x,y)>120) hint('hammer','Jetzt kommt harter Stein. Der ist zu hart für die Schaufel. Nimm den Hammer!');
  }
  if(t==='hammer'){
    if(!first&&Math.hypot(x-(st.hx||-99),y-(st.hy||-99))<M*.06) return;
    st.hx=x; st.hy=y;
    if(overFind&&alphaAt(2,x,y)>40){ DW.sfx('no'); hint('pinsel','Vorsicht! Hier liegt etwas darunter. Mit dem Hammer könnte es kaputtgehen. Nimm den Pinsel!'); return; }
    if(alphaAt(1,x,y)>120) { hint('schaufel','Hier ist noch weiche Erde. Die geht mit der Schaufel viel schneller weg.'); }
    [0,1,2].forEach(i=>erase(i,x,y,Math.max(M*.065,28),1,true)); DW.sfx('thud');
  }
  if(t==='pinsel'){ [0,1,2].forEach(i=>erase(i,x,y,Math.max(M*.05,24),.35)); if(now-st.soundT>120){ DW.sfx('brush'); st.soundT=now; } }
  st.dirty=true;
  if(now-st.last>200){ st.last=now; check(); }
}
function check(){
  const ds=st.layers.map(l=>l.getContext('2d'));
  st.items.forEach(it=>{ if(it.found) return; let clear=0,n=0;
    for(let i=0;i<5;i++)for(let j=0;j<3;j++){ const px=Math.round(it.x+it.w*(.15+i*.175)), py=Math.round(it.y+it.h*(.2+j*.3)); n++; if(ds.every(c=>c.getImageData(px,py,1,1).data[3]<70)) clear++; }
    if(clear/n>=.66){ it.found=true; st.found+=it.kind==='bone'?1:0; DW.sfx('clink'); DW.confetti(14);
      if(it.kind==='bone'){ const b=DATA.BONES.find(b=>b.k===it.k); DW.say(`Ein Knochen! ${b.say}`); }
      else { identify(it.id); }
      foundBox();
      if(st.found>=6&&!st.cleanT){ st.cleanT=1; const my=st; GK.after(1600,()=>{ if(st!==my) return; if(!st.busy&&!st.queue.length) clean(st.site); else st.after=true; }); }
    } });
}
function foundBox(){ const el=root.querySelector('#dgFound'); if(!el) return;
  el.innerHTML=`<b class="hand" style="font-size:24px">Knochen: ${st.found} von 6</b><div class="dg-bones">${st.items.filter(i=>i.kind==='bone').map(i=>`<span class="${i.found?'':'no'}">${boneSVG(i.k)}</span>`).join('')}</div>`; }
function draw(t){
  const {ctx,W,H}=st; ctx.clearRect(0,0,W,H); ctx.drawImage(st.base,0,0); for(let i=2;i>=0;i--) ctx.drawImage(st.layers[i],0,0);
  if(st.scan&&t-st.scan<2600){ const a=1-(t-st.scan)/2600; st.items.forEach(it=>{ if(it.found) return; const cx=it.x+it.w/2, cy=it.y+it.h/2, r=Math.max(it.w,it.h)*.6*(1+.2*Math.sin(t/120));
    const g=ctx.createRadialGradient(cx,cy,2,cx,cy,r); g.addColorStop(0,`rgba(255,230,120,${.7*a})`); g.addColorStop(1,'rgba(255,230,120,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,r,0,7); ctx.fill(); }); }
  st.items.forEach(it=>{ if(it.found&&!it.glow){ it.glow=t; } if(it.glow&&t-it.glow<1200){ ctx.strokeStyle=`rgba(240,195,90,${1-(t-it.glow)/1200})`; ctx.lineWidth=5; ctx.strokeRect(it.x-6,it.y-6,it.w+12,it.h+12);} });
}

/* ---------------- Fund bestimmen ---------------- */
function identify(id){
  if(st.busy){ st.queue.push(id); return; }     // zwei Funde im selben Augenblick: nacheinander bestimmen (sonst ging der erste verloren)
  const f=DATA.find(id); st.busy=true; st.down=false; st.ptr.clear();
  const opts=DW.shuffle([f,...DW.shuffle(DATA.FINDS.filter(x=>x.id!==id)).slice(0,3)]);
  const m=DW.modal(`<div style="text-align:center"><h2 style="margin:0">Was haben wir gefunden?</h2>
    <div style="width:150px;margin:8px auto;filter:sepia(.6) brightness(.85)">${ART.icon(f.icon)}</div>
    <p>Schau genau hin! Was ist das?</p><div class="row" style="justify-content:center;flex-wrap:wrap;gap:10px">${opts.map(o=>`<button class="tile id-opt" data-id="${o.id}" style="width:140px"><div class="pic" style="height:70px">${DW.iconImg(o.icon)}</div><b style="font-size:19px">${o.n}</b></button>`).join('')}</div></div>`,{noclose:true});
  DW.say('Da ist noch etwas! Was haben wir gefunden? Schau genau hin.');
  let tries=0;
  DW.$$('.id-opt',m).forEach(b=>b.onclick=()=>{ if(b.dataset.id===id){ DW.sfx('ok'); m.close(); DW.addFind(id); DW.say(`Richtig! ${f.n}. ${f.say}`); st.busy=false; if(st.queue.length){ const nx=st.queue.shift(), my=st; GK.after(1600,()=>{ if(st===my&&!st.busy) identify(nx); else if(st===my) st.queue.unshift(nx); }); return; } if(st.after){st.after=false; const my=st; GK.after(1800,()=>{ if(st===my) clean(my.site); });} }
    else { tries++; DW.sfx('no'); b.classList.remove('wiggle'); void b.offsetWidth; b.classList.add('wiggle'); DW.say(tries>1?`Tipp: ${f.say}`:'Hmm, das ist es nicht. Schau nochmal genau hin!'); } });
}

/* ---------------- Fund reinigen ---------------- */
function clean(site){
  cancelAnimationFrame(raf);
  root.innerHTML=`<div class="fill col" style="align-items:center;padding:8px 12px;gap:10px">
    <p class="hand" style="font-size:28px;margin:0;text-align:center">Alle Knochen gefunden! Jetzt putzen wir den Schädel.</p>
    <div class="cl-board card" id="clBoard"><div class="cl-bone">${boneSVG('schaedel')}</div><canvas id="clCv"></canvas></div>
    <div class="row"><span class="pill" id="clPct">0 % sauber</span></div></div>`;
  const board=root.querySelector('#clBoard'), cv=root.querySelector('#clCv'), R=board.getBoundingClientRect(); cv.width=R.width; cv.height=R.height; const x=cv.getContext('2d',{willReadFrequently:true});
  x.fillStyle='rgba(150,115,75,.92)'; x.fillRect(0,0,cv.width,cv.height);
  for(let k=0;k<900;k++){ {const r=Math.random(); x.fillStyle=`rgba(${110+r*50},${82+r*36},${50+r*24},${.55+Math.random()*.45})`;} x.beginPath(); x.arc(Math.random()*cv.width,Math.random()*cv.height,2+Math.random()*6,0,7); x.fill(); }
  let down=false, done=false, lastS=0;
  const pos=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*cv.width/Math.max(1,r.width),(e.clientY-r.top)*cv.height/Math.max(1,r.height)];};
  /* Pinselgröße wächst mit dem Brett (Handy 34 px wie bisher, Tablet/Desktop bis ~60 px) – sonst muss man auf großen Schirmen endlos rubbeln */
  const BR=Math.round(DW.clamp(Math.min(cv.width,cv.height)*.1,34,64));
  const wipe=(px,py)=>{ x.save(); x.globalCompositeOperation='destination-out'; const g=x.createRadialGradient(px,py,4,px,py,BR); g.addColorStop(0,'rgba(0,0,0,.6)'); g.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=g; x.beginPath(); x.arc(px,py,BR,0,7); x.fill(); x.restore();
    const now=performance.now(); if(now-lastS>150){ lastS=now; DW.sfx('brush');
      const d=x.getImageData(0,0,cv.width,cv.height).data; let n=0,c=0; for(let i=3;i<d.length;i+=4*97){n++; if(d[i]<60)c++;} const pct=Math.round(c/n*100);
      root.querySelector('#clPct').textContent=pct+' % sauber';
      if(pct>=80&&!done){ done=true; x.clearRect(0,0,cv.width,cv.height); DW.sfx('magic'); DW.confetti(30); DW.say('Blitzblank! Jetzt sieht man den Schädel ganz genau. Auf zum Skelett!'); GK.after(2200,()=>{ if(root&&root.querySelector('#clBoard')) skeleton(site); }); } } };
  const ids=new Set();
  GK.noFling(cv);
  cv.addEventListener('pointerdown',e=>{ if(e.button>0) return; e.preventDefault(); ids.add(e.pointerId); down=true; try{ cv.setPointerCapture(e.pointerId); }catch(err){} if(!done) wipe(...pos(e)); });
  cv.addEventListener('pointermove',e=>{ if(ids.has(e.pointerId)&&!done) wipe(...pos(e)); });
  const cup=e=>{ ids.delete(e.pointerId); down=ids.size>0; }; cv.addEventListener('pointerup',cup); cv.addEventListener('pointercancel',cup); cv.addEventListener('lostpointercapture',cup);
  DW.say('Der Schädel ist noch ganz staubig. Wisch mit dem Finger vorsichtig den Staub weg, wie mit einem Pinsel!');
}

/* ---------------- Skelett zusammensetzen ---------------- */
function skeleton(site){
  cancelAnimationFrame(raf); const id=site.animal, slots=SLOTS[id]||SLOTS.trex;
  root.innerHTML=`<div class="fill col" style="align-items:center;padding:8px 12px;gap:8px">
    <p class="hand" style="font-size:28px;margin:0;text-align:center">Alle Knochen gefunden! Setz das Skelett zusammen.</p>
    <div class="sk-board card" id="skBoard"><div class="sk-img">${DW.animalImg(id,{shadow:false,pad:4,drawn:true},'sk-sil')}${DW.animalImg(id,{shadow:false,pad:4,drawn:true},'sk-real')}</div>
      ${DATA.BONES.map(b=>{const s=slots[b.k];return `<div class="sk-slot" data-k="${b.k}" style="left:${s[0]}%;top:${s[1]}%;width:${s[2]}%;height:${s[3]}%;transform:translate(-50%,-50%) rotate(${s[4]}deg)"></div>`;}).join('')}</div>
    <div class="sk-tray" id="skTray">${DW.shuffle(DATA.BONES).map(b=>`<button class="sk-bone" data-k="${b.k}"><span>${boneSVG(b.k)}</span><small>${b.n}</small></button>`).join('')}</div></div>`;
  let placed=0;
  DW.$$('.sk-bone',root).forEach(el=>{ const k=el.dataset.k;
    DW.drag(el,{ghost:()=>boneSVG(k),onTap:()=>{const b=DATA.BONES.find(x=>x.k===k);DW.say(b.say+' Zieh ihn an die richtige Stelle!'); const s=root&&root.querySelector(`.sk-slot[data-k="${k}"]`); if(!s) return; s.classList.add('hint'); GK.after(1500,()=>s.classList.remove('hint'));},
      onDrop:(x,y)=>{ if(!root||!root.querySelector('#skBoard')) return false;   // mitten im Zug geschlossen/neu aufgebaut
        // Felder überlappen sich (Rippen/Beine): passendes Feld bevorzugen, sonst das nächstgelegene freie
        const near=s=>{const r=s.getBoundingClientRect(),m=30;return x>r.left-m&&x<r.right+m&&y>r.top-m&&y<r.bottom+m;};
        const dist=s=>{const r=s.getBoundingClientRect();return Math.hypot(x-(r.left+r.width/2),y-(r.top+r.height/2));};
        const cand=DW.$$('.sk-slot:not(.filled)',root).filter(near).sort((a,b)=>dist(a)-dist(b));
        const slot=cand.find(s=>s.dataset.k===k)||cand[0];
        if(slot&&slot.dataset.k===k){ slot.innerHTML=boneSVG(k); slot.classList.add('filled'); const sv=slot.firstElementChild; sv&&sv.classList.add('pop'); /* nicht das Feld selbst animieren: seine Drehung/Verschiebung steckt im transform */ el.remove(); placed++; DW.sfx('ok');
          if(placed>=6) GK.after(700,()=>{ if(root&&root.querySelector('#skBoard')) complete(site); }); else DW.say(DW.pick(['Passt genau!','Super!','Richtig!']));
          return true; }
        if(slot){ GK.no(slot,'Hier passt ein anderer Knochen hin. Probier eine andere Stelle!'); }   /* GK.no addiert das Wackeln zum transform des Feldes (Lage/Drehung) – „wiggle“ ließ das Feld springen */
        return false; }}); });
  DW.say('Alle Knochen gefunden! Jetzt setzen wir das Skelett zusammen. Zieh jeden Knochen an die richtige Stelle.');
}
function complete(site){
  const a=DATA.animal(site.animal), board=root.querySelector('#skBoard'); board.classList.add('done');
  DW.sfx('win'); DW.confetti(); DW.roar();
  const first=!DG().done[site.id]; DG().done[site.id]=1; DG().last[site.id]=a.id; DG().found=DG().found||{}; DG().found[a.id]=1; DW.save(); DW.discover(a.id);
  DW.addStars('grabung',first?3:1); DW.addSticker('grabung'); if(Object.keys(DG().done).length>=3) GK.after(1500,()=>DW.addSticker('skelett')); if(Object.keys(DG().done).length>=DATA.DIG_SITES.length) GK.after(3000,()=>DW.addSticker('grabung-profi'));
  GK.after(2200,()=>{ if(!root) return; const m=DW.modal(`<div style="text-align:center"><h2 style="margin:0">Das ist ein ${a.short||a.n}!</h2><div style="max-width:360px;margin:6px auto">${DW.animalImg(a.id,{mood:'happy'})}</div>
      <div>${DW.starRow(3)}</div><p>${a.fact}</p><p style="color:var(--ink2)">Er steht jetzt auch im Museum!</p>
      <div class="row" style="justify-content:center;flex-wrap:wrap"><button class="btn go big" id="dgMore">${ART.icon('grabung',36)}Weiter graben</button></div></div>`,{noclose:true});
    DW.say(`Wow! Das ist ein ${a.short||a.n}! ${a.fact}`); m.querySelector('#dgMore').onclick=()=>{m.close();sites();}; });
}
function unmount(){ cancelAnimationFrame(raf); st=null; root=null; const o=DW.$('#overlay'); o.hidden=true; o.innerHTML=''; }
DW.stations.grabung={title:'Ausgrabung',mount,unmount};
if(window.DW_DEBUG) Object.assign(DW.stations.grabung,{_skel:(id,an)=>{ const s=DATA.DIG_SITES.find(s=>s.id===id); skeleton(Object.assign({},s,{animal:an||pickAnimal(s)})); },_clean:id=>clean(DATA.DIG_SITES.find(s=>s.id===id)),_pool:id=>sitePool(DATA.DIG_SITES.find(s=>s.id===id)),_st:()=>st});
})();
