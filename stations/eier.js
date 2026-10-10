/* =====================================================================
   DINO-INSELWELT · Station Dino-Eier (GAME 17)
   Eier ausbrüten, Babys zur Mama bringen, Eier erkennen, zählen, vergleichen.
   ===================================================================== */
(function(){
"use strict";
const ID='eier';
/* ---- Spieldaten: Eier mit gesicherten Grundformen (Form/Oberfläche aus Fossilfunden;
   Farben sind nur bei Oviraptor-Verwandten belegt (blaugrün), sonst neutrale Töne). ---- */
const EGGS=[
 {id:'titan',par:'argentinosaurus',n:'Langhals-Riese',me:'ein Langhals-Riese',grp:'rund',rx:38,ry:40,cm:18,col:'#eee4cf',pat:'knubbel',
  clue:'Mein Ei ist groß, kugelrund und knubbelig.',
  fact:'Riesige Langhals-Dinos legten runde Eier. Die waren nicht größer als ein Fußball – und die Babys wuchsen dann riesig!'},
 {id:'theri',par:'therizinosaurus',n:'Therizinosaurus',me:'Therizinosaurus',grp:'rund',rx:35,ry:38,cm:12,col:'#e3dac8',pat:'poren',
  clue:'Mein Ei ist rund, aber kleiner. Es hat viele feine Pünktchen.',
  fact:'Therizinosaurier legten runde Eier. Viele Mamas bauten ihre Nester nah beieinander – wie ein Nest-Dorf.'},
 {id:'ovi',par:'oviraptor',n:'Oviraptor',me:'Oviraptor',grp:'lang',rx:23,ry:50,cm:18,col:'#8fc3b5',pat:'rillen',
  clue:'Mein Ei ist lang und blaugrün, mit feinen Rillen.',
  fact:'Oviraptor-Mamas legten lange, blaugrüne Eier im Kreis. Dann setzten sie sich darauf und wärmten sie – wie ein Vogel.'},
 {id:'proto',par:'protoceratops',n:'Protoceratops',me:'Protoceratops',grp:'lang',rx:26,ry:44,cm:12,col:'#e6ddd0',pat:'weich',
  clue:'Mein Ei ist länglich und hell, mit weicher, runzeliger Schale.',
  fact:'Protoceratops-Eier hatten eine weiche Schale – so ähnlich wie die Eier von Eidechsen heute.'},
 {id:'maia',par:'edmontosaurus',n:'Maiasaura',me:'Maiasaura',grp:'oval',rx:33,ry:42,cm:14,col:'#e2cda4',pat:'glatt',
  clue:'Mein Ei ist oval, wie ein dicker Ball, und sandfarben.',
  fact:'Maiasaura heißt „gute Mutter-Echse“. Die Eltern kümmerten sich um ihre Babys im Nest.'},
 {id:'huhn',par:'huhn',n:'Huhn',me:'ein Huhn',grp:'oval',rx:30,ry:40,cm:6,col:'#d9a57a',pat:'fein',
  clue:'Mein Ei ist klein, glatt und braun.',
  fact:'Vögel sind Dinosaurier, die bis heute leben! Auch ein Küken schlüpft aus einem Ei.'},
 /* weitere Eier (Schalentypen belegt: Flugsaurier-Eier weich/biegsam, z. B. Hamipterus;
    Schildkröten- und Krokodil-Eier wie bei heutigen Verwandten) */
 {id:'flug',par:'pteranodon',n:'Flugsaurier',me:'ein Flugsaurier',grp:'lang',rx:24,ry:40,cm:7,col:'#efe6d6',pat:'weich',
  clue:'Mein Ei ist klein, länglich und weich wie Leder.',
  fact:'Flugsaurier-Eier hatten eine weiche, biegsame Schale. Die Mamas vergruben sie im Sand.'},
 {id:'kroete',par:'archelon',n:'Archelon',me:'Archelon, eine Riesen-Schildkröte',grp:'rund',rx:36,ry:38,cm:5,col:'#f6f1e6',pat:'glatt',
  clue:'Mein Ei ist klein, kugelrund und weiß – wie ein Tischtennisball.',
  fact:'Meeresschildkröten kommen zum Eierlegen an den Strand. Sie vergraben ihre Eier im warmen Sand.'},
 {id:'kroko',par:'deinosuchus',n:'Deinosuchus',me:'Deinosuchus, ein Riesenkrokodil',grp:'oval',rx:29,ry:42,cm:8,col:'#f3eee2',pat:'fein',
  clue:'Mein Ei ist weiß, hart und länglich-oval.',
  fact:'Krokodile legen harte, weiße Eier in ein Nest aus Pflanzen und Schlamm. Die Mama passt gut darauf auf.'},
];
/* Langhals-Riesen: mehrere Eltern-Bilder möglich (Sauropoden legten runde Eier) */
const TITAN_PARS=['argentinosaurus','brachiosaurus','diplodocus','mamenchisaurus'].filter(id=>DATA.animal(id)&&ART.has(DATA.animal(id).art));
EGGS.forEach(e=>{ if(e.par!=='huhn'&&!(DATA.animal(e.par)&&ART.has(DATA.animal(e.par).art))) e.skip=true; });
const EGGS_OK=()=>EGGS.filter(e=>!e.skip);
const GIANT={id:'riesen',n:'Riesen-Oviraptor',grp:'lang',rx:22,ry:52,cm:45,col:'#9cc5b9',pat:'rillen',
  fact:'Die längsten Dino-Eier waren fast einen halben Meter lang! Sie kamen von riesigen Oviraptor-Verwandten.'};
const egg=id=>EGGS.find(e=>e.id===id)||(id==='riesen'?GIANT:null);
const nameN=e=>e.n;
/* Rundenpläne je Stufe */
const PLAN={1:[['hatch',2],['count',[2,4]],['mine',2],['size',3],['hatch',3]],
            2:[['hatch',3],['mine',3],['count',[3,6]],['size',4],['mine',3],['hatch',4]],
            3:[['hatch',4],['mine',4],['count',[6,10]],['size',4],['mine',4],['hatch',5]]};
const NUMW=['null','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf'];

let root, lv=1, G=null;
function mount(r){ root=r; intro(); }
function intro(){
  GK.intro(root,{id:ID, title:'Dino-Eier',
    art:`<span class="ei-introegg">${eggSVG(EGGS[2],1)}</span>${GK.img('protoceratops',{mood:'happy'})}<span class="ei-introegg">${eggSVG(EGGS[0],2)}</span>`,
    say:'Im Nest liegen Dino-Eier! Klopf an, dann schlüpfen die Babys. Bring jedes Baby zu seiner Mama.',
    onStart:l=>{ lv=l; start(); }});
}
function start(){
  G={plan:PLAN[lv].slice(), i:0, miss:0};
  if(TITAN_PARS.length) EGGS[0].par=DW.pick(TITAN_PARS);
  // Aufgabenreihenfolge leicht mischen (erste Runde bleibt „Schlüpfen“)
  const rest=DW.shuffle(G.plan.slice(1,-1)); G.plan=[G.plan[0],...rest,G.plan[G.plan.length-1]];
  root.innerHTML=`<div class="ei fill">
    <div class="ei-top"><div id="eiProg"></div><button class="ei-ask card" id="eiAsk" type="button"><span class="ei-askic">${ART.icon('lautsprecher')}</span><span id="eiAskT"></span></button></div>
    <div class="ei-stage" id="eiStage"></div>${DW.iconImg('farn','ei-deco').replace('class="ei-deco"','class="ei-deco" style="left:-10px"')}${DW.iconImg('palme','ei-deco').replace('class="ei-deco"','class="ei-deco" style="right:-10px;bottom:4%"')}</div>`;
  root.querySelector('#eiAsk').onclick=()=>{DW.sfx('tap');DW.repeat();};
  next();
}
function prog(){ root.querySelector('#eiProg').innerHTML=GK.progress(G.i,G.plan.length); }
function ask(t,s){ const el=root.querySelector('#eiAskT'); if(el){ el.textContent=t; const a=el.parentNode; a.classList.remove('pop'); void a.offsetWidth; a.classList.add('pop'); } DW.say(s||t); }
function next(){
  GK.idle.stop();
  if(G.i>=G.plan.length) return end();
  prog(); const [type,arg]=G.plan[G.i];
  G.round={type};
  ({hatch:rHatch,mine:rMine,count:rCount,size:rSize})[type](arg);
}
/* nächste Runde erst, wenn die Stimme fertig ist (sonst wird der Wissenssatz abgeschnitten) */
function roundDone(delay=1600){ G.round.done=true; GK.idle.stop(); const g=G, t0=performance.now();
  const go=()=>{ if(G!==g) return; if(DW.speaking()&&performance.now()-t0<15000){ GK.after(250,go); return; } g.i++; next(); };
  GK.after(delay,go); }

/* ---------- Ei zeichnen (Inline-SVG, 100×130) ---------- */
function rng(seed){ let s=seed*9301+49297; return ()=>{ s=(s*9301+49297)%233280; return s/233280; }; }
function eggPath(e){ const cx=50,cy=74,pts=[]; for(let k=0;k<=48;k++){ const t=k/48*Math.PI*2; const x=cx+e.rx*Math.sin(t)*(1-.13*Math.cos(t)); const y=cy-e.ry*Math.cos(t); pts.push((k?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)); } return pts.join('')+'Z'; }
/* eigenes Ei-Bild: grafiken-neu/objekte/ei_<name>.png (Schale bricht trotzdem in zwei Hälften auf) */
const EGG_IMG={titan:'sauropode',theri:'therizinosaurus',ovi:'oviraptor',proto:'protoceratops',maia:'maiasaura',huhn:'huhn',flug:'flugsaurier',kroete:'archelon',kroko:'krokodil',riesen:'riesig'};
const eggPng=e=>{ try{ return window.ASSETS&&ASSETS.egg?ASSETS.egg(EGG_IMG[e.id],e.id):null; }catch(err){ return null; } };
function eggSVG(e,seed=1){
  const R=rng(seed+e.id.length*7), d=eggPath(e), cy=74, top=cy-e.ry, dk=ART.shade(e.col,.78), lt=ART.shade(e.col,1.12);
  let pat='';
  const inside=()=>{ for(let t=0;t<30;t++){ const x=50+(R()*2-1)*e.rx*.8, y=cy+(R()*2-1)*e.ry*.85; const nx=(x-50)/e.rx, ny=(y-cy)/e.ry; if(nx*nx+ny*ny<.72) return [x,y]; } return [50,cy]; };
  if(e.pat==='knubbel') for(let i=0;i<34;i++){ const [x,y]=inside(); pat+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(2+R()*2.4).toFixed(1)}" fill="${lt}" stroke="${dk}" stroke-width=".8" opacity=".85"/>`; }
  if(e.pat==='poren') for(let i=0;i<60;i++){ const [x,y]=inside(); pat+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(.7+R()*.9).toFixed(1)}" fill="${dk}" opacity=".7"/>`; }
  if(e.pat==='rillen') for(let i=-3;i<=3;i++){ const x=50+i*e.rx*.24; pat+=`<path d="M${x.toFixed(1)} ${top+10} Q${(x+i*1.6).toFixed(1)} ${cy} ${x.toFixed(1)} ${cy+e.ry-8}" fill="none" stroke="${dk}" stroke-width="1.6" stroke-dasharray="5 3" opacity=".6"/>`; }
  if(e.pat==='weich') for(let i=0;i<7;i++){ const y=top+14+i*(e.ry*1.7/7), w=e.rx*.7; pat+=`<path d="M${(50-w).toFixed(1)} ${y.toFixed(1)} q${(w/2).toFixed(1)} ${(3+R()*3).toFixed(1)} ${w.toFixed(1)} 0 t${w.toFixed(1)} 0" fill="none" stroke="${dk}" stroke-width="1.1" opacity=".45"/>`; }
  if(e.pat==='glatt') for(let i=0;i<9;i++){ const [x,y]=inside(); pat+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(2+R()*3).toFixed(1)}" ry="${(1.5+R()*2).toFixed(1)}" fill="${dk}" opacity=".35"/>`; }
  if(e.pat==='fein') for(let i=0;i<20;i++){ const [x,y]=inside(); pat+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(.6+R()*.8).toFixed(1)}" fill="${dk}" opacity=".45"/>`; }
  const u='e'+Math.floor(Math.random()*1e9), zy=cy-e.ry*.18;
  let zig=`M0 ${zy}`; for(let x=0;x<=100;x+=8) zig+=` L${x} ${(zy+(x/8%2?-6:6)).toFixed(1)}`;
  const png=eggPng(e);
  const body=png?`<image href="${png}" x="${(50-e.rx*1.12).toFixed(1)}" y="${(cy-e.ry-1).toFixed(1)}" width="${(e.rx*2.24).toFixed(1)}" height="${(e.ry*2+2).toFixed(1)}" preserveAspectRatio="xMidYMax meet"/>`:`<path d="${d}" fill="${e.col}"/>${pat}<path d="${d}" fill="none" stroke="#5a4630" stroke-width="2.4"/><ellipse cx="${50-e.rx*.38}" cy="${cy-e.ry*.45}" rx="${(e.rx*.18).toFixed(1)}" ry="${(e.ry*.22).toFixed(1)}" fill="#fff" opacity=".45"/>`;
  return `<svg class="ei-svg" viewBox="0 0 100 130" aria-hidden="true"><defs>
    <clipPath id="${u}t"><path d="${zig} L100 0 L0 0Z"/></clipPath><clipPath id="${u}b"><path d="${zig} L100 130 L0 130Z"/></clipPath></defs>
    <ellipse cx="50" cy="${cy+e.ry-2}" rx="${e.rx*.9}" ry="5" fill="#3d3226" opacity=".15"/>
    <g ${png?'':'filter="url(#wc)"'}><g class="ei-bot" clip-path="url(#${u}b)">${body}</g><g class="ei-tp" clip-path="url(#${u}t)">${body}</g></g>
    <path class="ei-crack" pathLength="100" d="${zig.replace(/^M0/,'M'+(50-e.rx*.7).toFixed(0))}" fill="none" stroke="#5a4630" stroke-width="2" stroke-linejoin="round" clip-path="url(#${u}c)"/>
    <clipPath id="${u}c"><path d="${d}"/></clipPath></svg>`;
}
function eggEl(e,px,seed){
  const pad=Math.max(0,Math.round((64-px)/2));   // kleine Eier: Trefferfläche mind. 64 px
  const b=DW.h(`<button class="ei-egg" type="button" data-e="${e.id}" style="--w:${px}px;--pad:${pad}px" aria-label="Ei">${eggSVG(e,seed)}<span class="ei-baby">${babyImg(e)}</span></button>`);
  return b;
}
function babyImg(e){ return e.par?DW.animalImg(e.par,{mood:'happy',shadow:false,baby:true}):''; }
function parentImg(e,mood){ return DW.animalImg(e.par,{mood:mood||'happy',shadow:false}); }
const sizePx=(e,base)=>Math.round(base*Math.pow(e.cm/18,.55));
function nestHTML(){ const tw=(n,y0,ry,w)=>[...Array(n)].map((_,i)=>{const a=i/n*Math.PI*2,x=200+Math.cos(a)*176,y=y0+Math.sin(a)*ry;return `<path d="M${(x-26).toFixed(0)} ${(y+Math.sin(i)*5).toFixed(0)}l52 ${(Math.cos(i*1.7)*9).toFixed(0)}" stroke="${i%3?'#8a6d4a':'#6e5236'}" stroke-width="${w+i%3}" stroke-linecap="round"/>`;}).join('');
  return `<svg class="ei-nestsvg" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true"><g filter="url(#wc)">
  <ellipse cx="200" cy="64" rx="196" ry="50" fill="#a07a4f"/><ellipse cx="200" cy="56" rx="168" ry="32" fill="#6e5236"/><ellipse cx="200" cy="60" rx="150" ry="24" fill="#7d6040" opacity=".7"/>${tw(22,56,40,5)}</g></svg>
  <svg class="ei-nestfront" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true"><g filter="url(#wc)"><path d="M4 8 Q200 58 396 8 L396 26 Q200 72 4 26Z" fill="#9a744b"/>${[...Array(12)].map((_,i)=>{const x=20+i*31,y=18+Math.sin(i/11*Math.PI)*22;return `<path d="M${x-22} ${(y+Math.cos(i*2.1)*4).toFixed(0)}l46 ${(Math.sin(i*1.3)*8).toFixed(0)}" stroke="${i%2?'#8a6d4a':'#6e5236'}" stroke-width="${5+i%3}" stroke-linecap="round"/>`;}).join('')}</g></svg>`; }
function baseFor(n,k=.34){ const st=root.querySelector('#eiStage'); const H=st.clientHeight, W=st.clientWidth; return Math.max(60,Math.min(230,H*k,(W-40)/(n*.95+.3))); }
function wobble(el){ el.classList.remove('ei-wob'); void el.offsetWidth; el.classList.add('ei-wob'); }
function crackSound(){ DW.sfx('egg'); GK.after(90,()=>DW.sfx('click')); }

/* ---------- Runde: Schlüpfen & zur Mama bringen ---------- */
function rHatch(n){
  const nPar=lv===1?Math.min(n,2):Math.min(3+(n>=5?1:0),n);
  let types;
  for(let t=0;t<40;t++){
    const ids=EGGS_OK().map(e=>e.id);
    if(lv===3){ const pair=DW.pick([['titan','theri'],['ovi','proto'],['maia','huhn'],['flug','proto'],['kroko','huhn'],['kroete','theri']].filter(p=>p.every(i=>ids.includes(i)))); types=pair.concat(GK.sample(ids,nPar-2,pair)); }
    else types=GK.sample(ids,nPar);
    if(!(types.includes('ovi')&&types.includes('theri'))) break; } // Eltern sehen sich zu ähnlich
  const list=DW.shuffle(types.concat([...Array(n-types.length)].map(()=>DW.pick(types))));
  const st=root.querySelector('#eiStage');
  st.innerHTML=`<div class="ei-parents">${types.map(id=>{const e=egg(id);return `<div class="ei-par" data-e="${id}"><div class="ei-parimg">${parentImg(e)}</div><b>${nameN(e)}</b><div class="ei-kids"></div></div>`;}).join('')}</div>
    <div class="ei-nest">${nestHTML()}<div class="ei-eggs" id="eiEggs"></div></div>`;
  const box=st.querySelector('#eiEggs'), base=baseFor(n,.3);
  /* zum Ziehen nie winzig (Handy): mindestens 58 px breit – die Größe ist in dieser Runde kein Hinweis */
  list.forEach((id,i)=>{ const e=egg(id), b=eggEl(e,Math.max(58,sizePx(e,base)),i+1); b.style.animationDelay=(i*.15)+'s'; b.classList.add('ei-roll'); box.appendChild(b); setup(b,e); });
  G.round.left=n;
  /* Trefferflächen der Mamas: einmal je Zug messen (nicht bei jedem Zeiger-Ereignis) */
  let boxes=[], hov=null;
  const measure=()=>{ boxes=DW.$$('.ei-par',st).map(p=>{ const r=p.getBoundingClientRect(); return {p,l:r.left,t:r.top,r:r.right,b:r.bottom}; }); };
  /* Mama unter dem Finger; kleine Lücken zwischen den Karten zählen zur nächsten Karte (kein „toter“ Streifen) */
  const parAt=(x,y)=>{ let best=null,bd=1e9; for(const q of boxes){ const dx=Math.max(q.l-x,0,x-q.r), dy=Math.max(q.t-y,0,y-q.b), d=Math.hypot(dx,dy); if(d<bd){bd=d;best=q.p;} } return bd<=26?best:null; };
  const hover=p=>{ if(p===hov) return; if(hov) hov.classList.remove('ei-over'); hov=p; if(p) p.classList.add('ei-over'); };
  function setup(b,e){ b.dataset.state='0'; let knock=false, tok=0;
    const home=()=>{ const k=++tok; GK.after(310,()=>{ if(k===tok) b.classList.remove('ei-away'); }); };   // Baby sitzt wieder in der Schale, sobald das Bild zurückgeflogen ist
    DW.drag(b,{ghost:()=>b.dataset.state==='2'?`<div class="ei-ghost">${babyImg(e)}</div>`:'',
      onTap:()=>tapEgg(b,e),
      onStart:()=>{ tok++; b.style.opacity='';                     // kein halb durchsichtiges Doppel: das Baby verlässt die Schale wirklich
        knock=b.dataset.state!=='2';
        if(knock){ tapEgg(b,e); return; }                          // noch nicht geschlüpft: Wischen zählt als Klopfen, es wird nichts gezogen
        b.classList.add('ei-away'); measure(); hov=null; },
      onMove:(x,y)=>{ if(!knock) hover(parAt(x,y)); },
      onCancel:()=>{ hover(null); if(!knock) home(); },
      onDrop:(x,y)=>{ hover(null);
        if(knock) return true;
        measure(); const p=parAt(x,y);
        if(p&&bring(b,e,p)) return true;
        home(); return false; }});
  }
  function tapEgg(b,e){
    const s=+b.dataset.state;
    if(s===0){ b.dataset.state='1'; b.classList.add('ei-cracked'); wobble(b); crackSound(); DW.say(DW.pick(['Knacks! Noch mal klopfen!','Es knackt! Klopf noch einmal!'])); }
    else if(s===1){ b.dataset.state='2'; b.classList.add('ei-hatched'); DW.sfx('pop'); GK.after(120,()=>DW.sfx('egg'));
      DW.say(DW.pick(['Hallo, Baby! Zu wem gehörst du? Zieh es zu seiner Mama.','Ein Baby! Bring es zu seiner Mama.']));
      G.round.hatched=(G.round.hatched||0)+1; }
    else { wobble(b); DW.say('Zieh das Baby zu seiner Mama!'); }
  }
  function bring(b,e,p){
    if(p.dataset.e===e.id){
      GK.ok(p); b.classList.remove('ei-away'); b.classList.add('ei-gone');   // die leere Schale bleibt liegen – die anderen Eier rutschen nicht zur Seite
      p.querySelector('.ei-kids').insertAdjacentHTML('beforeend',`<span class="ei-kid pop">${babyImg(e)}</span>`);
      const img=p.querySelector('.ei-parimg'); img.classList.remove('ei-hop'); void img.offsetWidth; img.classList.add('ei-hop');
      discover(e); G.round.left--;
      if(!p.dataset.told){ p.dataset.told=1; DW.say(e.fact); } else DW.say(DW.pick(['Noch ein Baby! Hurra!','Da freut sich die Mama!']));
      if(G.round.left<=0) roundDone(3800);
      return true;
    }
    G.miss++; GK.no(p); DW.say('Hm, das ist nicht mein Baby. Schau mal: wie sieht das Baby aus?');
    const right=DW.$$('.ei-par',st).find(q=>q.dataset.e===e.id); GK.after(900,()=>GK.pulse(right));
    return false;
  }
  ask('Klopf auf die Eier! Bring die Babys zur Mama.','Klopf zweimal auf ein Ei, dann schlüpft ein Baby! Bring jedes Baby zu seiner Mama.');
  GK.idle.set(()=>{ if(document.documentElement.classList.contains('dw-dragging')) return;   // mitten im Zug nicht dazwischenleuchten
    const b=DW.$$('.ei-egg:not(.ei-gone)',st)[0]; GK.pulse(b); if(b&&b.dataset.state==='2'){ GK.pulse(DW.$$('.ei-par',st).find(p=>p.dataset.e===b.dataset.e)); } },
    ()=>DW.say('Tippe auf ein Ei. Dann ziehst du das Baby zu der Mama, die genauso aussieht.'));
  G.round.auto=()=>{ const b=DW.$('.ei-egg:not(.ei-gone)',st); if(!b) return; const e=egg(b.dataset.e); while(b.dataset.state!=='2') tapEgg(b,e); bring(b,e,DW.$$('.ei-par',st).find(p=>p.dataset.e===e.id)); };
}
function discover(e){ if(e.par&&DATA.animal(e.par)&&e.id!=='maia') DW.discover(e.par); }

/* ---------- Runde: Welches Ei ist meins? ---------- */
function rMine(n){
  const t=DW.pick(EGGS_OK());
  let others=EGGS_OK().filter(e=>e!==t);
  if(lv===1) others=others.filter(e=>e.grp!==t.grp);
  const sim=others.filter(e=>e.grp===t.grp), dif=others.filter(e=>e.grp!==t.grp);
  const pick=lv===3?DW.shuffle(sim).concat(DW.shuffle(dif)).slice(0,n-1):DW.shuffle(others).slice(0,n-1);
  const list=DW.shuffle([t,...pick]);
  const st=root.querySelector('#eiStage');
  st.innerHTML=`<div class="ei-mine"><button class="ei-mom card" id="eiMom" type="button"><div class="ei-momimg">${parentImg(t)}</div><b>${nameN(t)}</b><span class="ei-bubble">${ART.icon('ei')}<i>?</i></span></button></div>
    <div class="ei-nest">${nestHTML()}<div class="ei-eggs" id="eiEggs"></div></div>`;
  const box=st.querySelector('#eiEggs'), base=baseFor(n,.3);
  list.forEach((e,i)=>{ const b=eggEl(e,sizePx(e,base),i+3); b.classList.add('ei-roll'); b.style.animationDelay=(i*.15)+'s'; box.appendChild(b);
    b.onclick=()=>choose(b,e); });
  const say=`Ich bin ${t.me}. ${t.clue} Welches Ei ist meins?`;
  st.querySelector('#eiMom').onclick=()=>{ DW.sfx('tap'); DW.say(t.clue); };
  let wrong=0;
  function choose(b,e){
    if(G.round.done) return;
    if(e===t){ b.classList.add('ei-cracked'); crackSound(); wobble(b);
      GK.after(450,()=>{ b.classList.add('ei-hatched'); DW.sfx('pop'); GK.ok(st.querySelector('#eiMom')); discover(t); DW.say('Ja, das ist mein Ei! '+t.fact); });
      DW.$$('.ei-egg',st).forEach(x=>{ if(x!==b) x.classList.add('ei-dim'); });
      roundDone(5200); return; }
    if(b.classList.contains('ei-dim')){ wobble(b); DW.sfx('tap'); return; }   // schon probiert: zählt nicht noch einmal
    G.miss++; wrong++; wobble(b); DW.sfx('no'); b.classList.add('ei-dim');
    DW.say(`Hm, das ist nicht meins. ${e.clue.replace('Mein Ei','Dieses Ei')} ${wrong>=2?'Hör noch mal: '+t.clue:''}`);
    if(wrong>=2) GK.pulse(DW.$$('.ei-egg',st).find(x=>x.dataset.e===t.id));
  }
  ask('Welches Ei gehört mir?',say);
  GK.idle.set(()=>GK.pulse(st.querySelector('#eiMom')),()=>DW.say(t.clue+' Tippe auf das richtige Ei.'));
  G.round.auto=()=>choose(DW.$$('.ei-egg',st).find(x=>x.dataset.e===t.id),t);
}

/* ---------- Runde: Zählen ---------- */
function rCount([a,b]){
  const n=Math.round(DW.rand(a,b)), t=DW.pick(EGGS_OK()), list=[...Array(n)].map(()=>lv===3&&Math.random()<.4?DW.pick(EGGS_OK()):t);
  let opts=[n]; while(opts.length<3){ const k=n+DW.pick([-2,-1,1,2]); if(k>=1&&!opts.includes(k)) opts.push(k); } opts=opts.sort((x,y)=>x-y);
  const st=root.querySelector('#eiStage');
  st.innerHTML=`<div class="ei-nest ei-big">${nestHTML()}<div class="ei-eggs ei-wrap" id="eiEggs"></div></div>
    <div class="ei-nums">${opts.map(k=>`<button class="ei-num" type="button" data-n="${k}"><b>${k}</b><span>${GK.dots(k,'ei')}</span></button>`).join('')}</div>`;
  const box=st.querySelector('#eiEggs'), base=n>7?baseFor(6,.18):n>4?baseFor(n,.24):baseFor(n,.3); let counted=0;
  list.forEach((e,i)=>{ const b=eggEl(e,sizePx(e,base)*(e.cm<10?1.3:1),i+5); b.classList.add('ei-roll'); b.style.animationDelay=(i*.1)+'s'; box.appendChild(b);
    b.onclick=()=>{ if(b.dataset.k) { wobble(b); return; } counted++; b.dataset.k=counted; b.insertAdjacentHTML('beforeend',`<i class="ei-tag pop">${counted}</i>`); DW.sfx('tap'); DW.say(NUMW[counted]||String(counted)); wobble(b); }; });
  DW.$$('.ei-num',st).forEach(btn=>btn.onclick=()=>{
    if(G.round.done) return; const k=+btn.dataset.n;
    if(k===n){ GK.ok(btn); btn.classList.add('ei-right'); DW.say(`Ja! ${NUMW[n]} Eier! Dino-Mamas legten oft viele Eier auf einmal.`); DW.$$('.ei-egg',st).forEach((x,i)=>GK.after(i*120,()=>wobble(x))); roundDone(3000); }
    else { if(!btn.classList.contains('ei-dim')) G.miss++; GK.no(btn,'Hm, noch nicht. Tippe jedes Ei an und zähle mit!'); btn.classList.add('ei-dim');
      DW.$$('.ei-egg',st).forEach((x,i)=>GK.after(400+i*260,()=>GK.pulse(x))); }
  });
  ask('Wie viele Eier sind im Nest?','Wie viele Eier liegen im Nest? Tippe die Eier an und zähle mit!');
  GK.idle.set(()=>DW.$$('.ei-egg',st).forEach((x,i)=>GK.after(i*250,()=>GK.pulse(x))),()=>DW.say('Zähl die Eier! Tippe jedes einmal an.'));
  G.round.auto=()=>DW.$$('.ei-num',st).find(x=>+x.dataset.n===n).click();
}

/* ---------- Runde: Größtes / kleinstes Ei ---------- */
function rSize(n){
  let pool=EGGS_OK(); if(lv>=2) pool.push(GIANT);
  const small=lv===3&&Math.random()<.5, gap=lv===3?1.12:1.25;
  /* gültig: genau EIN größtes und EIN kleinstes Ei, und das gesuchte ist sichtbar größer/kleiner als das nächste */
  const okList=l=>{ const c=l.map(e=>e.cm).sort((a,b)=>a-b), k=c.length; return c[0]<c[1]&&c[k-1]>c[k-2]&&(lv>1||c[k-1]/c[0]>=2.5)&&(small?c[1]/c[0]:c[k-1]/c[k-2])>=gap; };
  let list=null; for(let t=0;t<80;t++){ const l=GK.sample(pool,n); if(okList(l)){ list=l; break; } }
  if(!list){ const byCm=pool.slice().sort((a,b)=>b.cm-a.cm), l=[byCm[0],byCm[byCm.length-1]];            // Rückfall: größtes + kleinstes + mittlere
    for(const e of DW.shuffle(byCm.slice(1,-1))){ if(l.length>=n) break; const t2=l.concat([e]); if(okList(t2)||t2.length<3) l.push(e); }
    list=DW.shuffle(l); }
  const target=list.slice().sort((a,b)=>small?a.cm-b.cm:b.cm-a.cm)[0];
  const st=root.querySelector('#eiStage');
  st.innerHTML=`<div class="ei-nest ei-big">${nestHTML()}<div class="ei-eggs" id="eiEggs"></div></div><div class="ei-ruler" id="eiRuler"></div>`;
  const box=st.querySelector('#eiEggs'), base=baseFor(n,.42);
  const maxcm=Math.max(...list.map(e=>e.cm));
  list.forEach((e,i)=>{ const px=Math.round(base*1.15*Math.pow(e.cm/maxcm,.75)); const b=eggEl(e,px,i+9); b.classList.add('ei-roll'); b.style.animationDelay=(i*.12)+'s'; box.appendChild(b); b.onclick=()=>choose(b,e); });
  function choose(b,e){ if(G.round.done) return;
    if(e===target){ GK.ok(b); b.classList.add('ei-right'); wobble(b);
      const f=e.id==='riesen'?GIANT.fact:e.id==='huhn'?'Das Hühnerei ist das kleinste. Und ein Huhn ist auch ein kleiner Dinosaurier!':e.id==='titan'?'Überraschung: Selbst die riesigsten Dinos hatten gar nicht so große Eier. Nicht größer als ein Fußball!':'';
      DW.say((small?'Ja, das ist das kleinste Ei! ':'Ja, das ist das größte Ei! ')+f); roundDone(f?5200:2200); }
    else { const now=performance.now(); if(now-(b._no||0)<700){ wobble(b); return; } b._no=now;   // Doppeltipp auf dasselbe falsche Ei zählt nur einmal
      G.miss++; wobble(b); DW.sfx('no'); DW.say(small?'Hm, gibt es ein noch kleineres Ei?':'Hm, gibt es ein noch größeres Ei? Vergleiche genau!'); }
  }
  const t=small?'Tippe auf das kleinste Ei!':'Tippe auf das größte Ei!';
  ask(t,t);
  GK.idle.set(()=>DW.$$('.ei-egg',st).forEach((x,i)=>GK.after(i*300,()=>GK.pulse(x))),()=>DW.say(t));
  G.round.auto=()=>choose(DW.$$('.ei-egg',st).find(x=>x.dataset.e===target.id),target);
}

function end(){
  const stars=G.miss<=1?3:G.miss<=4?2:1;
  GK.finish(root,{id:ID,stars,title:'Alle Babys sind geschlüpft!',
    art:`${GK.img('protoceratops',{mood:'happy'})}<span class="ei-introegg">${eggSVG(EGGS[4],4)}</span>`,
    say:'Super! Alle Dino-Babys sind geschlüpft. Du bist ein echter Eier-Experte!',again:()=>start()});
}
if(window.DW_DEBUG) window.__eierAuto=()=>{ if(G&&G.round&&!G.round.done&&G.round.auto) G.round.auto(); };
DW.stations[ID]={title:'Dino-Eier',mount,unmount(){ /* Ziehen mitten im Spiel abgebrochen: Geist-Bild entfernen */ DW.$$('body>.dragging').forEach(n=>n.remove());  G=null; }};
})();
