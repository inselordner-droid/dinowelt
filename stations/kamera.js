/* =====================================================================
   DINO-INSELWELT · Station Forscherkamera (GAME 21)
   Foto-Safari: Sucher über die Landschaft ziehen, wenn das gesuchte Tier
   im Rahmen ist (Rahmen wird grün), auf den Auslöser tippen. Fotoalbum.
   ===================================================================== */
(function(){
"use strict";
const ID='kamera';
/* Suchaufträge nach Merkmalen – Tierlisten werden aus DATA/ART abgeleitet */
const planOf=id=>(ART.SPECIES[ART.resolve(DATA.animal(id).art)]||{}).plan;
const spOf=id=>ART.SPECIES[ART.resolve(DATA.animal(id).art)]||{};
const carni=id=>planOf(id)==='theropod'&&DATA.animal(id).food==='fleisch';
const ICE=['palaeogen','neogen','quartaer'];
/* avoid: Tiere, die als Ablenker verwirren würden (Liste oder Test) */
const TASKS=[
 {k:'horn',ask:'Fotografiere einen Dino mit Hörnern!',short:'Dino mit Hörnern',avoid:['carnotaurus','ceratosaurus','protoceratops','wollnashorn','uintatherium','megaloceros'],test:id=>planOf(id)==='ceratops'&&id!=='protoceratops'},
 {k:'hals',ask:'Fotografiere einen Dino mit langem Hals!',short:'Dino mit langem Hals',avoid:id=>!!spOf(id).longneck||id==='paraceratherium',test:id=>planOf(id)==='sauropod'&&DATA.isDino(id)},
 {k:'platte',ask:'Fotografiere einen Dino mit Platten auf dem Rücken!',short:'Dino mit Platten',avoid:['ankylosaurus','spinosaurus','dimetrodon','edaphosaurus'],test:id=>planOf(id)==='stego'},
 {k:'panzer',ask:'Fotografiere einen Dino mit Panzer!',short:'Dino mit Panzer',avoid:['stegosaurus','kentrosaurus'],test:id=>planOf(id)==='ankylo'},
 {k:'flug',ask:'Fotografiere einen Flugsaurier!',short:'Flugsaurier',avoid:['archaeopteryx','microraptor'],test:id=>planOf(id)==='ptero',fly:true},
 {k:'raub',ask:'Fotografiere einen Raubsaurier mit scharfen Zähnen!',short:'Raubsaurier',avoid:id=>carni(id)||['dimetrodon','smilodon','andrewsarchus','hyaenodon','gorgonops'].includes(id),test:id=>carni(id)&&DATA.lenM(id)>=5},
 {k:'kamm',ask:'Fotografiere einen Dino mit einem Kamm auf dem Kopf!',short:'Dino mit Kamm',avoid:['dilophosaurus','pachycephalosaurus'],test:id=>['parasaurolophus','corythosaurus'].includes(id)},
 /* neu */
 {k:'feder',ask:'Fotografiere einen Dino mit Federn!',short:'Dino mit Federn',avoid:id=>planOf(id)==='theropod'||planOf(id)==='bird',test:id=>DATA.isDino(id)&&!!spOf(id).feathers&&planOf(id)==='theropod'},
 {k:'segel',ask:'Fotografiere ein Tier mit einem Segel auf dem Rücken!',short:'Tier mit Segel',acc:'ein Tier mit Segel',avoid:['stegosaurus','kentrosaurus'],test:id=>['spinosaurus','dimetrodon','edaphosaurus'].includes(id)},
 {k:'fell',ask:'Fotografiere ein Tier mit Fell!',short:'Tier mit Fell',acc:'ein Tier mit Fell',avoid:id=>planOf(id)==='mammal',test:id=>planOf(id)==='mammal'&&ICE.includes(DATA.animal(id).era)&&DATA.habitat(id)==='land'&&DATA.lenM(id)>=1.5},
];
const avoids=(t,id)=>typeof t.avoid==='function'?t.avoid(id):(t.avoid||[]).includes(id);
const POOL=GK.pool(a=>DATA.habitat(a.id)!=='wasser'&&(DATA.isDino(a.id)||['ptero','mammal','lizard'].includes(planOf(a.id)))).map(a=>a.id);
TASKS.forEach(t=>t.ids=POOL.filter(t.test));
/* Raubsaurier gibt es als Ziel nur, wenn es nicht schon ein anderes Merkmal ist (z. B. Federn) */
const featOf=id=>TASKS.find(t=>t.ids.includes(id));
/* „Foto von …“ mit Artikel bei Tiernamen, die keine Gattungsnamen sind */
const VON={mammut:'einem Mammut',smilodon:'einer Säbelzahnkatze',wollnashorn:'einem Wollnashorn',megaloceros:'einem Riesenhirsch',hoehlenbaer:'einem Höhlenbären'};
const von=id=>VON[id]||DATA.nameOf(id);
const LVS={1:{rounds:3,others:1,box:.46,bush:0,rare:false},2:{rounds:4,others:3,box:.38,bush:2,rare:false},3:{rounds:5,others:4,box:.32,bush:3,rare:true}};
let root, lv=1, G=null;
function mount(r){ root=r; intro(); }
function intro(){
  GK.intro(root,{id:ID,title:'Forscherkamera',art:`${GK.icon('kamera')}${GK.img('triceratops',{mood:'happy'})}`,
    say:'Wir machen eine Foto-Safari! Schieb den Sucher auf das richtige Tier und drück auf den Auslöser.',onStart:l=>{lv=l;start();}});
}
function start(){
  const L=LVS[lv]; G={L,i:0,miss:0,shots:[],used:[]};
  root.innerHTML=`<div class="ka fill">
    <div class="ka-top"><div id="kaProg"></div><button class="ka-ask card" id="kaAsk" type="button"><span class="ka-want" id="kaWant"></span><span id="kaAskT"></span></button></div>
    <div class="ka-scene" id="kaScene">
      <div class="ka-sky"></div><div class="ka-far"></div><div class="ka-mid"></div><div class="ka-ground"></div>
      <div class="ka-plants" id="kaPlants"></div><div class="ka-actors" id="kaActors"></div><div class="ka-front" id="kaFront"></div>
      <div class="ka-finder" id="kaFinder"><i></i><i></i><i></i><i></i><span class="ka-dot"></span></div>
      <div class="ka-flash" id="kaFlash"></div>
    </div>
    <div class="ka-bar"><div class="ka-album" id="kaAlbum">${DW.iconImg('buch','ka-albic')}</div><button class="ka-shoot" id="kaShoot" type="button" aria-label="Foto machen">${ART.icon('kamera')}</button></div></div>`;
  root.querySelector('#kaAsk').onclick=()=>{DW.sfx('tap');DW.say(G.r?G.r.t.ask:'');};
  root.querySelector('#kaShoot').onclick=shoot;
  const sc=root.querySelector('#kaScene');
  let down=false;
  const move=e=>{ const r=sc.getBoundingClientRect(); G.fx=DW.clamp((e.clientX-r.left)/r.width,0,1); G.fy=DW.clamp((e.clientY-r.top)/r.height,0,1); placeFinder(); };
  GK.listen(sc,'pointerdown',e=>{ down=true; try{sc.setPointerCapture(e.pointerId);}catch(_){} move(e); DW.sfx('tap'); });
  GK.listen(sc,'pointermove',e=>{ if(down) move(e); });
  GK.listen(sc,'pointerup',()=>{down=false;}); GK.listen(sc,'pointercancel',()=>{down=false;});
  G.fx=.5; G.fy=.55;
  GK.listen(window,'resize',relayout);
  paintScene(); round();
  const tok=G; GK.loop((dt,T)=>{ if(G!==tok) return false; return step(dt,T); });
}
function paintScene(){
  const p=root.querySelector('#kaPlants');
  p.innerHTML=[[2,4,16,'palme'],[18,8,10,'farn'],[74,4,14,'palme'],[88,7,11,'palme'],[46,10,8,'farn'],[60,9,7,'blume']].map(([x,b,w,ic])=>`<img src="${DW.svgURL(ART.icon(ic))}" alt="" style="left:${x}%;bottom:calc(var(--gh,26%) + ${b-4}%);width:${w}%;max-width:${w*1.6}vh">`).join('');
}
function round(){
  GK.idle.stop();
  if(G.i>=G.L.rounds) return end();
  root.querySelector('#kaProg').innerHTML=GK.progress(G.i,G.L.rounds);
  const tasks=TASKS.filter(t=>t.ids.length&&!G.used.includes(t.k)); const t=DW.pick(tasks); G.used.push(t.k);
  const target=DW.pick(t.ids);
  const others=GK.sample(POOL.filter(id=>!t.test(id)&&featOf(id)&&!avoids(t,id)),G.L.others);
  G.r={t,target,done:false};
  root.querySelector('#kaWant').innerHTML=lv===3?`<img class="ka-silh" src="${DW.animalImg(target).match(/src="([^"]+)"/)[1]}" alt="">`:DW.animalImg(target,{shadow:false});
  root.querySelector('#kaAskT').textContent=t.short;
  // Tiere aufstellen
  const box=root.querySelector('#kaActors'); box.innerHTML=''; G.actors=[];
  const sc=root.querySelector('#kaScene'), W=sc.clientWidth, H=sc.clientHeight; G.W0=W; const gh=DW.clamp(.26+(H/W-.6)*.4,.26,.48); sc.style.setProperty('--gh',(gh*100).toFixed(0)+'%');
  DW.shuffle([target,...others]).forEach((id,k)=>{
    const fly=planOf(id)==='ptero', len=DATA.lenM(id)||5;
    const hh=actorH(fly,len,W,H);
    const lane=fly?DW.rand(.12,.3):DW.rand(1-gh-.06,.95);   // über den ganzen Boden verteilt
    const dir=Math.random()<.5?1:-1;
    const fr=[0,.25,.5,.75]; const R=fr.map(ph=>DW.animalImg(id,{ph,shadow:false}).match(/src="([^"]+)"/)[1]), L2=fr.map(ph=>DW.animalImg(id,{ph,flip:true,shadow:false}).match(/src="([^"]+)"/)[1]);
    const el=DW.h(`<img class="ka-actor" alt="${DATA.nameOf(id)}" draggable="false" src="${R[0]}">`);
    el.style.height=hh+'px'; el.style.zIndex=Math.round(lane*100); box.appendChild(el);
    G.actors.push({id,el,R,L:L2,x:DW.rand(.12,.88)*W,lane,dir,fly,len,sp:W*DW.rand(.035,.06)*(fly?1.4:1),ph:Math.random()*4,wait:0,out:false});
  });
  // Büsche im Vordergrund (verdecken teilweise)
  const fr=root.querySelector('#kaFront');
  fr.innerHTML=[...Array(G.L.bush)].map(()=>`<img src="${DW.svgURL(ART.icon(DW.pick(['farn','farn','palme'])))}" alt="" style="left:${DW.rand(0,85).toFixed(0)}%;width:${DW.rand(12,18).toFixed(0)}%">`).join('');
  DW.say(t.ask);
  GK.idle.set(()=>{ const a=G.actors.find(a=>a.id===target); if(a) glow(a.el); },()=>DW.say(`${t.ask} Schieb den Sucher darauf und drück auf die Kamera.`));
}
/* Hinweis-Leuchten am Tier: nur filter (kein transform – die Tiere werden per transform bewegt und würden sonst in die Ecke springen) */
function glow(el){ if(!el) return; el.classList.remove('ka-hint'); void el.offsetWidth; el.classList.add('ka-hint'); }
function actorH(fly,len,W,H){ return Math.min(H*(fly?.2:DW.clamp(.18+len/60,.2,.36)),W*(fly?.12:DW.clamp(.16+len/90,.18,.3))); }
/* Drehen / Fenstergröße ändern: Tiere, Boden und Sucher neu anpassen */
function relayout(){
  if(!G||!G.actors) return; const sc=root.querySelector('#kaScene'); if(!sc) return;
  const W=sc.clientWidth, H=sc.clientHeight, W0=G.W0||W; const gh=DW.clamp(.26+(H/W-.6)*.4,.26,.48); sc.style.setProperty('--gh',(gh*100).toFixed(0)+'%');
  G.actors.forEach(a=>{ a.x=a.x*W/W0; a.sp=a.sp*W/W0; a.el.style.height=actorH(a.fly,a.len,W,H)+'px'; if(!a.fly) a.lane=DW.clamp(a.lane,1-gh-.06,.95); });
  G.W0=W; placeFinder();
}
function placeFinder(){
  const f=root.querySelector('#kaFinder'), sc=root.querySelector('#kaScene'); if(!f) return;
  const W=sc.clientWidth,H=sc.clientHeight, s=Math.min(W,H)*G.L.box*(W<500?1.35:1), w=s*1.3, h=s;
  const x=DW.clamp(G.fx*W,w/2,W-w/2), y=DW.clamp(G.fy*H,h/2,H-h/2);
  f.style.width=w+'px'; f.style.height=h+'px'; f.style.transform=`translate(${x-w/2}px,${y-h/2}px)`;
  G.frame={l:x-w/2,t:y-h/2,r:x+w/2,b:y+h/2};
}
function inFrame(a){
  if(!G.frame||a.out) return 0; const sc=root.querySelector('#kaScene').getBoundingClientRect(), r=a.el.getBoundingClientRect();
  const l=r.left-sc.left,t=r.top-sc.top,rr=l+r.width,bb=t+r.height, F=G.frame;
  const ow=Math.max(0,Math.min(rr,F.r)-Math.max(l,F.l)), oh=Math.max(0,Math.min(bb,F.b)-Math.max(t,F.t));
  const area=r.width*r.height, fa=(F.r-F.l)*(F.b-F.t);
  return ow*oh/Math.max(1,Math.min(area,fa));
}
function step(dt,T){
  if(!G||!G.actors) return; const sc=root.querySelector('#kaScene'); if(!sc) return false;
  const W=sc.clientWidth,H=sc.clientHeight;
  G.actors.forEach(a=>{
    const w=a.el.offsetWidth||100;
    if(a.wait>0){ a.wait-=dt; if(a.wait<=0){ a.out=false; a.el.style.opacity=1; } return; }
    a.x+=a.dir*a.sp*dt; a.ph+=dt*(a.fly?5:6);
    const pad=G.L.rare?-w*.6:w*.5;
    if(a.x>W-pad&&a.dir>0||a.x<pad&&a.dir<0){
      if(G.L.rare){ a.out=true; a.wait=DW.rand(1,2.6); a.el.style.opacity=0; }
      a.dir*=-1; }
    const fi=Math.floor(a.ph)%4, src=(a.dir>0?a.R:a.L)[fi]; if(a.el.getAttribute('src')!==src) a.el.setAttribute('src',src);
    const y=a.lane*H+(a.fly?Math.sin(T*1.6+a.x*.01)*H*.03:0);
    a.el.style.transform=`translate(${a.x-w/2}px,${y-a.el.offsetHeight}px)`;
  });
  if(!G.frame) placeFinder();
  const t=G.r&&!G.r.done&&G.actors.find(a=>a.id===G.r.target);
  const ok=t&&inFrame(t)>=.55; root.querySelector('#kaFinder').classList.toggle('ka-ok',!!ok); G.ok=ok;
}
function shoot(){
  if(!G||!G.r||G.r.done||G.busy) return;
  G.busy=true; GK.after(700,()=>{ if(G) G.busy=false; });
  DW.sfx('click'); GK.after(60,()=>DW.sfx('whoosh'));
  const fl=root.querySelector('#kaFlash'); fl.classList.remove('on'); void fl.offsetWidth; fl.classList.add('on');
  const r=G.r, a=G.actors.find(a=>a.id===r.target);
  if(a&&inFrame(a)>=.55){ r.done=true; GK.idle.stop();
    const st=GK.st(ID); st.album=(st.album||[]); st.album.push({id:a.id,t:Date.now()}); if(st.album.length>40) st.album.shift(); DW.save();
    G.shots.push(a.id); DW.discover(a.id);
    const p=DW.h(`<div class="ka-photo">${DW.animalImg(a.id,{mood:'happy',shadow:false})}<b>${DATA.nameOf(a.id)}</b></div>`);
    root.querySelector('#kaScene').appendChild(p);
    GK.after(1500,()=>{ p.classList.add('fly'); });
    GK.after(2300,()=>{ p.remove(); const al=root.querySelector('#kaAlbum'); if(al) al.insertAdjacentHTML('beforeend',`<span class="ka-thumb pop">${DW.animalImg(a.id,{shadow:false})}</span>`); });
    DW.sfx('star');
    const f=DATA.animal(a.id).fact||'';
    DW.say(`Klick! Ein tolles Foto von ${von(a.id)}! ${f}`);
    G.i++; afterVoice(3400,round);
    return; }
  G.miss++;
  const other=G.actors.find(x=>x!==a&&inFrame(x)>=.55);
  if(other) DW.say(`Oh, ein schönes Foto von ${von(other.id)}! Aber wir suchen ${r.t.acc||'einen '+r.t.short}.`);
  else DW.say(DW.pick(['Hm, da ist kein Tier im Rahmen. Versuch es nochmal!','Klick! Nur Blätter auf dem Foto. Schieb den Sucher auf das Tier!']));
  if(a&&G.miss%2===0) glow(a.el);
}
/* fn nach ms – aber erst, wenn die Stimme fertig ist (höchstens 12 s länger): sonst schneidet der nächste Satz den Wissenssatz ab */
function afterVoice(ms,fn){ const g=G, t0=performance.now(), go=()=>{ if(G!==g||!G) return; if(DW.speaking()&&performance.now()-t0<ms+12000){ GK.after(250,go); return; } fn(); }; GK.after(ms,go); }
function end(){
  const stars=G.miss<=1?3:G.miss<=4?2:1;
  const extra=`<div class="ka-endalbum">${G.shots.map(id=>`<span class="ka-thumb">${DW.animalImg(id,{shadow:false})}</span>`).join('')}</div>`;
  GK.finish(root,{id:ID,stars,title:'Tolle Fotos!',art:GK.icon('kamera'),extra,
    say:'Super! Dein Fotoalbum ist voller Dinos. Du bist ein echter Tierfotograf!',again:()=>start()});
}
if(window.DW_DEBUG) window.__kameraAuto=()=>{ if(!G||!G.r||G.r.done) return; const a=G.actors.find(a=>a.id===G.r.target); if(!a) return;
  if(a.out){ a.wait=0; a.out=false; a.el.style.opacity=1; }
  const sc=root.querySelector('#kaScene').getBoundingClientRect(), r=a.el.getBoundingClientRect();
  G.fx=(r.left+r.width/2-sc.left)/sc.width; G.fy=(r.top+r.height/2-sc.top)/sc.height; placeFinder();
  a.sp=0; shoot(); };
DW.stations[ID]={title:'Forscherkamera',mount,unmount(){G=null;}};
})();
