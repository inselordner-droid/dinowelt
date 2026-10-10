/* =====================================================================
   DINO-INSELWELT · Station Naturkundemuseum
   Durch die Säle laufen, Tiere & Fossilien antippen, Stempel sammeln.
   ===================================================================== */
(function(){
"use strict";
const FOSSILS=[
 {id:'megalodon-gebiss',n:'Megalodon-Gebiss',icon:'zahn',big:true,say:'Das Gebiss vom Megalodon, dem größten Hai aller Zeiten. Da würde ein Erwachsener hineinpassen!'},
 {id:'ammonit',n:'Ammonit',icon:'ammonit',say:'Ein Ammonit: ein Tintenfisch mit einem gedrehten Haus. Er lebte zur Zeit der Dinosaurier im Meer.'},
 {id:'trilobit',n:'Trilobit',icon:'animal:trilobit',say:'Ein Trilobit. Diese Tiere krabbelten über den Meeresboden, lange vor den Dinos.'},
 {id:'dino-ei',n:'Dino-Ei',icon:'ei',say:'Ein versteinertes Dino-Ei aus der Wüste Gobi.'},
 {id:'fussspur',n:'Fußspur',icon:'spur',say:'Eine versteinerte Dino-Fußspur. Hier ist vor 200 Millionen Jahren ein Dino gelaufen.'},
 {id:'fischfossil',n:'Fisch-Fossil',icon:'fischfossil',say:'Ein versteinerter Fisch aus einem Urzeit-See. Man sieht jede einzelne Gräte.'},
 {id:'blattabdruck',n:'Blattabdruck',icon:'blatt',say:'Ein Blatt, das zu Stein geworden ist.'},
 {id:'bernstein',n:'Bernstein',icon:'bernstein',say:'Bernstein ist altes Baumharz. Darin steckt ein Insekt, das 45 Millionen Jahre alt ist!'},
 {id:'quarz',n:'Quarz',icon:'kristall',say:'Ein Quarz-Kristall. Er glitzert wie Glas.'},
 {id:'pyrit',n:'Pyrit',icon:'kristall',hue:'sepia(1) saturate(4) hue-rotate(5deg)',say:'Pyrit heißt auch Katzengold. Er glänzt wie Gold, ist aber keins.'},
 {id:'amethyst',n:'Amethyst',icon:'kristall',hue:'hue-rotate(60deg) saturate(1.6)',say:'Ein Amethyst. Er ist lila und wächst in Stein-Höhlen.'},
 {id:'achat',n:'Achat',icon:'achat',say:'Ein Achat. Innen hat er bunte Ringe, fast wie ein Baumstamm. Man findet ihn zum Beispiel in Idar-Oberstein.'},
 {id:'meteorit',n:'Meteorit',icon:'stein',hue:'brightness(.7)',say:'Ein Stein aus dem Weltall! Er ist vom Himmel auf die Erde gefallen.'},
];
const GUIDE_BY_ERA={devon:'sofia',karbon:'elena',perm:'jonas',trias:'malik',jura:'malik',kreide:'malik',palaeogen:'elena',neogen:'sofia',quartaer:'jonas'};
const SIZE=a=>{const big=['brachiosaurus','diplodocus','argentinosaurus','mamenchisaurus','brontosaurus','spinosaurus','trex','giganotosaurus','mosasaurus','basilosaurus','titanoboa','paraceratherium','megalodon','quetzalcoatlus','therizinosaurus','edmontosaurus','parasaurolophus','mammut'];
  const small=['hylonomus','coelurosauravus','compsognathus','microraptor','archaeopteryx','eoraptor','bothriolepis','ptilodus','mesohippus','pulmonoscorpius','meganeura','protoceratops','velociraptor','cynognathus','lystrosaurus'];
  return big.includes(a.id)?360:small.includes(a.id)?190:260;};

let root,hall,view,av,avFrames=[],rooms=[],items=[],HW=0,ax=160,tx=160,raf=0,last=0,flip=false,ph=0,onReach=null,curRoom=-1,guideImgs={};
function guideSVG(gid){const g=DATA.GUIDES.find(x=>x.id===gid);const png=window.ASSETS&&ASSETS.svg('figuren/guide_'+gid,[20,0,60,88]);if(png)return png;return ART.avatar({skin:g.skin,hair:g.hair,shirt:'#f3ead6',pants:g.acc,hat:'#fff',style:g.id==='elena'||g.id==='sofia'?'pony':'short'},{nohat:true,coat:true,glasses:g.id==='jonas'||g.id==='elena',flip:true});}

function mount(r){
  root=r; const S=DW.state; S.museum.rooms=S.museum.rooms||{};
  if(!S.stickers.museum) GK.after(1200,()=>DW.addSticker('museum'));
  const av0=ART.AVATARS.find(a=>a.id===S.avatar)||ART.AVATARS[0];
  avFrames=[...Array(8)].map((_,i)=>DW.svgURL(ART.avatar(av0,{ph:i/8,lupe:true})));
  // Säle aufbauen
  const fos=ids=>ids.map(id=>FOSSILS.find(f=>f.id===id)).map(f=>({kind:'fossil',ref:f,w:f.big?220:150}));
  const HAUPT=['coelophysis','plateosaurus','eoraptor','allosaurus','stegosaurus','diplodocus','brachiosaurus','archaeopteryx','ceratosaurus','trex','triceratops','velociraptor','spinosaurus','ankylosaurus','pteranodon'];
  rooms=[{id:'eingang',n:'Eingangshalle',sub:'Willkommen!',col:'#e8dcc0',guide:'jonas',say:'Willkommen im Museum! Hier vorne liegen Fossilien. Das sind Reste von Tieren und Pflanzen, die zu Stein geworden sind.',items:fos(['megalodon-gebiss','ammonit','fischfossil','dino-ei','fussspur'])},
    {id:'haupt',n:'Dinosaurier-Saal',sub:'Die großen Stars',col:'#d9c49a',guide:'malik',say:'Das ist der große Dinosaurier-Saal! Hier stehen die berühmtesten Dinos. Der Brachiosaurus in der Mitte ist ein Star: Im Berliner Naturkundemuseum steht das größte Dino-Skelett der Welt.',
      items:HAUPT.map(id=>DATA.animal(id)).map(a=>({kind:'animal',ref:a,w:a.id==='brachiosaurus'?460:SIZE(a)})).concat(fos(['trilobit','blattabdruck']))},
    {id:'kristall',n:'Fossilien & Kristalle',sub:'Schätze aus der Erde',col:'#cdd7df',guide:'jonas',say:'Im Kristall-Saal glitzert es! Kristalle wachsen ganz langsam tief in der Erde. Und im Bernstein steckt ein uraltes Insekt.',items:fos(['bernstein','quarz','pyrit','amethyst','achat','meteorit'])}];
  const SUB={titanoboa:'Paläozän',gastornis:'Paläozän',pantolambda:'Paläozän',ptilodus:'Paläozän',basilosaurus:'Eozän',uintatherium:'Eozän',andrewsarchus:'Eozän',ambulocetus:'Eozän',paraceratherium:'Oligozän',hyaenodon:'Oligozän',mesohippus:'Oligozän',entelodon:'Oligozän'};
  const SUBT={'Paläozän':'vor 66–56 Mio. Jahren','Eozän':'vor 56–34 Mio. Jahren','Oligozän':'vor 34–23 Mio. Jahren'};
  const ALL=DATA.ANIMALS.concat((DATA.EXTRA||[]).filter(a=>a.era!=='heute'&&a.art===a.id&&!DATA.ANIMALS.includes(a)));
  DATA.ERAS.forEach(e=>{ const list=ALL.filter(a=>a.era===e.id&&!HAUPT.includes(a.id)&&ART.has(a.art)); if(!list.length) return;
    rooms.push({id:e.id,n:e.n,sub:e.short,col:e.col,era:e,guide:GUIDE_BY_ERA[e.id],say:e.say,items:list.map(a=>({kind:'animal',ref:a,w:SIZE(a),sub:SUB[a.id],subt:SUBT[SUB[a.id]]}))}); });
  let x=0; items=[];
  const html=rooms.map((rm,ri)=>{ const start=x; let cx=start+300, lastSub=null; const its=rm.items.map(it=>{ if(it.sub&&it.sub!==lastSub){cx+=60;it.subStart=true;lastSub=it.sub;} const px=cx; cx+=it.w+70; it.x=px+it.w/2; it.room=ri; items.push(it); return {it,px}; });
    rm.x0=start; rm.x1=Math.max(start+1100,cx+120); x=rm.x1; rm.gx=start+170;
    const wall=ART.mix(rm.col,'#f7f0e1',.45);
    return `<section class="mu-room" style="left:${rm.x0}px;width:${rm.x1-rm.x0}px;--wall:${wall};--wall2:${ART.shade(wall,.93)}">
      <div class="mu-arch" style="left:40px"></div>
      ${[...Array(Math.floor((rm.x1-rm.x0-500)/700))].map((_,k)=>`<div class="mu-arch" style="left:${700+k*700}px"></div>`).join('')}
      ${rm.era?[...Array(Math.max(0,Math.floor((rm.x1-rm.x0-900)/700)))].map((_,k)=>{const an=rm.items[(k*3+1)%rm.items.length].ref;return `<div class="mu-frame small" style="left:${1000+k*700}px">${DW.animalImg(an.id,{shadow:false})}</div>`;}).join(''):''}
      <div class="mu-plant" style="left:${rm.x1-rm.x0-90}px">${DW.iconImg('farn')}</div>
      <div class="mu-sign hand" style="left:${60}px"><b>${rm.n}</b><small>${rm.era?(rm.era.b?`vor ${String(rm.era.a).replace('.',',')}–${String(rm.era.b).replace('.',',')} Mio. Jahren`:`vor ${String(rm.era.a).replace('.',',')} Mio. Jahren bis heute`):rm.sub}</small></div>
      ${rm.era?`<div class="mu-frame" style="left:${(rm.x1-rm.x0)/2-60}px">${DW.iconImg(rm.era.icon)}</div>`:''}
      ${its.map(({it,px})=>(it.subStart?`<div class="mu-subsign hand" style="left:${px-rm.x0-30}px"><b>${it.sub}</b><small>${it.subt}</small></div>`:'')+exhibitHTML(it,px-rm.x0)).join('')}
      ${rm.guide?`<button class="mu-guide" data-room="${ri}" style="left:150px"><img src="${DW.svgURL(guideSVG(rm.guide))}" alt="Forscherin"></button>`:''}
    </section>`; }).join('');
  HW=x;
  root.innerHTML=`<div class="mu fill"><div class="mu-view" id="muView"><div class="mu-hall" id="muHall" style="width:${HW}px">${html}
      <img class="mu-av" id="muAv" src="${avFrames[0]}" alt="Du"></div></div>
    <div class="mu-ui"><button class="ibtn big" id="muL" aria-label="Nach links">${ART.icon('pfeil_l')}</button>
      <div class="mu-stamp card" id="muStamp"></div>
      <button class="btn ghost" id="muPlan">${ART.icon('karte',34)}Saalplan</button>
      <button class="ibtn big" id="muR" aria-label="Nach rechts">${ART.icon('pfeil_r')}</button></div></div>`;
  view=root.querySelector('#muView'); hall=root.querySelector('#muHall'); av=root.querySelector('#muAv');
  ax=tx=S.museum.x&&S.museum.x<HW?S.museum.x:160;
  hall.addEventListener('click',e=>{ if(e.target.closest('.mu-ex,.mu-guide')) return; const r=hall.getBoundingClientRect(); walk(e.clientX-r.left); DW.sfx('step'); });
  DW.$$('.mu-ex',hall).forEach(el=>el.onclick=()=>{const it=items[+el.dataset.i]; DW.sfx('tap'); walk(it.x-80,()=>openItem(it,el));});
  DW.$$('.mu-guide',hall).forEach(el=>el.onclick=()=>{const rm=rooms[+el.dataset.room]; DW.sfx('pop'); talkGuide(rm);});
  /* Pfeile: höchstens 80 % der sichtbaren Breite weitergehen – auf dem Handy (390 px) übersprang ein 500-px-Schritt sonst Schaukästen */
  const stepW=()=>Math.max(200,Math.min(500,view.clientWidth*.8));
  root.querySelector('#muL').onclick=()=>{DW.sfx('tap');walk(ax-stepW());};
  root.querySelector('#muR').onclick=()=>{DW.sfx('tap');walk(ax+stepW());};
  root.querySelector('#muPlan').onclick=plan;
  stamp(); last=performance.now(); raf=requestAnimationFrame(loop);
  GK.after(300,()=>DW.say('Willkommen im Naturkundemuseum! Tippe auf ein Tier oder einen Stein, dann schauen wir es uns an.'));
}
function exhibitHTML(it,px){
  const i=items.indexOf(it), seen=it.kind==='animal'?DW.state.museum.seen[it.ref.id]:DW.state.museum.seen['f:'+it.ref.id];
  if(it.kind==='fossil'){ const f=it.ref;
    return `<button class="mu-ex mu-case" data-i="${i}" style="left:${px}px;width:${it.w}px"><div class="mu-glass"><img src="${DW.svgURL(ART.icon(f.icon))}" style="${f.hue?`filter:${f.hue}`:''}" alt=""></div><div class="mu-plinth"></div><span class="mu-plaque">${f.n}${seen?' ✓':''}</span></button>`; }
  const a=it.ref;
  return `<button class="mu-ex mu-animal" data-i="${i}" style="left:${px}px;width:${it.w}px">${DW.animalImg(a.id,{},'mu-img')}<div class="mu-pedestal"></div><span class="mu-plaque">${a.short||a.n}${seen?' ✓':''}</span></button>`;
}
function walk(x,cb){ tx=DW.clamp(x,60,HW-60); onReach=cb||null; if(Math.abs(tx-ax)<6){const c=onReach;onReach=null;c&&c();} }
function loop(t){
  const dt=Math.max(0,Math.min(.05,(t-last)/1000)); last=t;
  if(Math.abs(tx-ax)>2){ const d=tx-ax, sp=380*dt; flip=d<0; ax+=Math.sign(d)*Math.min(Math.abs(d),sp); ph=(ph+dt*2.4)%1; if(Math.random()<dt*4)DW.sfx('step'); }
  else { ph=0; if(onReach){const c=onReach;onReach=null;c();} }
  av.src=avFrames[Math.floor(ph*8)%8]; av.style.transform=`translateX(${ax-45}px) scaleX(${flip?-1:1})`;
  const vw=view.clientWidth; const off=DW.clamp(ax-vw/2,0,Math.max(0,HW-vw)); hall.style.transform=`translateX(${-off}px)`;
  const ri=rooms.findIndex(r=>ax>=r.x0&&ax<r.x1); if(ri!==curRoom){curRoom=ri; enterRoom(ri);}
  raf=requestAnimationFrame(loop);
}
function enterRoom(ri){ const rm=rooms[ri]; if(!rm) return; stamp(); DW.state.museum.x=Math.round(ax); DW.save(); GK.after(ri===0?2600:350,()=>{ if(root&&curRoom===ri) talkGuide(rm,true); }); }
function talkGuide(rm,auto){ if(!rm.guide) return; const g=DATA.GUIDES.find(x=>x.id===rm.guide);
  const txt=`${auto?'':`Ich bin ${g.n}, ${g.role}. `}${rm.era?`Das ist der Saal ${rm.n}. `:''}${rm.say}`; DW.say(txt); }
function openItem(it,el){
  const S=DW.state; let key,txt;
  if(it.kind==='fossil'){ key='f:'+it.ref.id; txt=it.ref.say;
    DW.modal(`<div style="text-align:center"><div style="width:180px;margin:0 auto;${it.ref.hue?`filter:${it.ref.hue}`:''}">${ART.icon(it.ref.icon)}</div><h2 style="margin:0">${it.ref.n}</h2><p>${txt}</p>
      <button class="btn" id="fSay">${ART.icon('lautsprecher',32)}Vorlesen</button></div>`).querySelector('#fSay').onclick=()=>DW.say(txt);
    DW.say(it.ref.n+'. '+txt);
  } else { key=it.ref.id; DW.animalCard(it.ref.id); DW.discover(it.ref.id,true); }
  if(!S.museum.seen[key]){ S.museum.seen[key]=1; DW.save(); const p=el.querySelector('.mu-plaque'); if(p&&!p.textContent.endsWith('✓')) p.textContent+=' ✓'; DW.sfx('clink'); }
  checkRoom(it.room);
}
function roomDone(ri){ const rm=rooms[ri]; return rm.items.every(it=>DW.state.museum.seen[it.kind==='animal'?it.ref.id:'f:'+it.ref.id]); }
function checkRoom(ri){
  stamp(); const rm=rooms[ri];
  if(roomDone(ri)&&!DW.state.museum.rooms[rm.id]){ DW.state.museum.rooms[rm.id]=1; DW.save(); DW.addStars('museum',1);
    GK.after(900,()=>{DW.sfx('win');DW.confetti(40);DW.toast(ART.icon('stern'),'Saal '+rm.n+' geschafft!','Ein Stempel für deine Karte');});
    if(rooms.every((r,i)=>roomDone(i))) GK.after(2500,()=>DW.addSticker('museum-alle')); }
}
function stamp(){ const el=root&&root.querySelector('#muStamp'); if(!el) return; const rm=rooms[Math.max(0,curRoom)]; if(!rm) return;
  const n=rm.items.filter(it=>DW.state.museum.seen[it.kind==='animal'?it.ref.id:'f:'+it.ref.id]).length;
  el.innerHTML=`<b class="hand" style="font-size:24px">${rm.n}</b> <span>${n} von ${rm.items.length} angeschaut</span> ${DW.state.museum.rooms[rm.id]?ART.icon('check',30).replace('<svg','<svg style="display:inline;vertical-align:middle"'):''}`; }
function plan(){
  DW.sfx('pop');
  const m=DW.modal(`<h2>Saalplan</h2><p style="margin:0 0 10px;color:var(--ink2)">Wohin möchtest du gehen?</p><div class="grid">${rooms.map((rm,i)=>`<button class="cell" data-r="${i}" style="background:${ART.mix(rm.col,'#ffffff',.4)}">${rm.era?DW.iconImg(rm.era.icon):DW.iconImg(rm.id==='haupt'?'animal:brachiosaurus':rm.id==='kristall'?'kristall':'ammonit')}<b>${rm.n}</b>${DW.state.museum.rooms[rm.id]?ART.icon('check',26).replace('<svg','<svg style="height:26px;width:26px;margin:2px auto 0"'):''}</button>`).join('')}</div>`);
  DW.$$('.cell',m).forEach(c=>c.onclick=()=>{const rm=rooms[+c.dataset.r]; m.close(); ax=tx=rm.x0+120; DW.sfx('whoosh');});
}
function unmount(){ const o=DW.$('#overlay'); if(o){ o.hidden=true; o.innerHTML=''; } cancelAnimationFrame(raf); DW.state.museum.x=Math.round(ax); DW.save(); root=null; curRoom=-1; }
DW.stations.museum={title:'Naturkundemuseum',mount,unmount};
})();
