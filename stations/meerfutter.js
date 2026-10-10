/* =====================================================================
   DINO-INSELWELT · Station Meeres-Futter
   Wer frisst was im Urzeit-Meer? Futter zum Maul ziehen (DATA eats2),
   danach Futterketten bauen: Plankton → kleiner Fisch → … → Jäger.
   ===================================================================== */
(function(){
"use strict";
const ID='meerfutter';
const INK='#3d3226';

/* ---------- eigene Zeichnungen ---------- */
Object.assign(ART.ICONS,{
 mf_plankton:`${[[16,20,5,'#9cc98a'],[34,14,4,'#b7d98f'],[48,26,6,'#8fbf7a'],[22,40,6,'#a9d4a0'],[42,44,5,'#c3e0a2'],[30,28,3,'#e0c86a'],[52,48,3,'#e0c86a'],[12,52,4,'#9cc98a']].map(([x,y,r,c])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${INK}" stroke-width="1" stroke-opacity=".6"/><circle cx="${x-r*.3}" cy="${y-r*.3}" r="${r*.3}" fill="#fff" opacity=".6"/>`).join('')}<path d="M26 54l4-6 4 6M40 34l3-5 3 5" stroke="#6f97ad" stroke-width="1.5" fill="none"/>`,
 mf_tinte:`<path d="M8 30q0-10 16-10h18q8 0 12 10-4 10-12 10H24Q8 40 8 30z" fill="#d99a8a" stroke="${INK}" stroke-width="1.6"/><path d="M50 26l10-6M52 30h10M50 34l10 6M48 38l8 10" stroke="#c07a6a" stroke-width="3" stroke-linecap="round"/><circle cx="44" cy="28" r="2.4" fill="${INK}"/><path d="M8 30l-4-6v12z" fill="#c07a6a"/>`,
 mf_krebs:`<ellipse cx="32" cy="36" rx="14" ry="10" fill="#e08a5a" stroke="${INK}" stroke-width="1.6"/><path d="M18 30q-8-10-4-18q6 2 6 8M46 30q8-10 4-18q-6 2-6 8" stroke="#e08a5a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M22 44l-6 8M28 46l-3 9M36 46l3 9M42 44l6 8" stroke="${INK}" stroke-width="2"/><circle cx="28" cy="30" r="2" fill="${INK}"/><circle cx="36" cy="30" r="2" fill="${INK}"/>`,
 mf_wurm:`<path d="M8 44q8-16 16 0t16 0 16-6" stroke="#d9938a" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M8 44q8-16 16 0t16 0 16-6" stroke="${INK}" stroke-width="1" fill="none" stroke-opacity=".5"/><circle cx="54" cy="37" r="1.6" fill="${INK}"/>`,
 mf_gfisch:`<path d="M4 32q14-18 36-14 12 2 18 14-6 12-18 14Q18 50 4 32z" fill="#7d98a8" stroke="${INK}" stroke-width="1.8"/><path d="M4 32l-2-12 10 8zM4 32l-2 12 10-8z" fill="#6a8494" stroke="${INK}" stroke-width="1.4"/><path d="M28 18q6-8 12-6l-2 8z" fill="#6a8494"/><circle cx="48" cy="28" r="2.6" fill="${INK}"/><path d="M52 36q-4 2-8 0" stroke="${INK}" stroke-width="1.4" fill="none"/><path d="M8 34q20 10 44 4" stroke="#e3ecef" stroke-width="4" fill="none" opacity=".7"/>`,
});
const FICON={plankton:'mf_plankton',krebs:'mf_krebs',tintenfisch:'mf_tinte',wurm:'mf_wurm',trilobit:'animal:trilobit',schildkroete:'animal:archelon',wal:'wal',fisch:'fisch',muschel:'muschel',qualle:'qualle'};
const food=id=>DATA.SEA_FOODS.find(f=>f.id===id)||{id,n:id};
const foodImg=id=>GK.icon(FICON[id]||food(id).icon);

/* ---------- Futterketten (vom Kleinsten zum größten Jäger) ---------- */
const LINKS={
 plankton:{n:'Plankton',nom:'Das Plankton',dat:'vom Plankton',img:()=>GK.icon('mf_plankton')},
 kfisch:{n:'kleiner Fisch',nom:'Der kleine Fisch',dat:'vom kleinen Fisch',img:()=>GK.icon('fisch')},
 gfisch:{n:'großer Fisch',nom:'Der große Fisch',dat:'vom großen Fisch',img:()=>GK.icon('mf_gfisch')},
 tinte:{n:'Tintenfisch',nom:'Der Tintenfisch',dat:'vom Tintenfisch',img:()=>GK.icon('mf_tinte')},
 qualle:{n:'Qualle',nom:'Die Qualle',dat:'von der Qualle',img:()=>GK.icon('qualle')},
 krebs:{n:'kleiner Krebs',nom:'Der kleine Krebs',dat:'vom kleinen Krebs',img:()=>GK.icon('mf_krebs')},
};
const linkOf=k=>LINKS[k]||{n:DATA.nameOf(k),nom:'Der '+DATA.nameOf(k),dat:'vom '+DATA.nameOf(k),img:()=>GK.img(k),animal:true};
const CHAINS=[
 ['plankton','tinte','ichthyosaurus'],
 ['plankton','kfisch','plesiosaurus'],
 ['plankton','qualle','archelon'],
 ['plankton','kfisch','gfisch','mosasaurus'],
 ['plankton','kfisch','dorudon'],
 ['plankton','kfisch','gfisch','megalodon'],
 ['plankton','tinte','gfisch','kronosaurus'],
 ['plankton','kfisch','ichthyosaurus'],
 ['plankton','tinte','plesiosaurus'],
 ['plankton','kfisch','elasmosaurus'],
 ['plankton','kfisch','basilosaurus'],
 ['plankton','kfisch','quastenflosser'],
 ['plankton','krebs','dunkleosteus'],
 ['plankton','krebs','ammonit'],
 ['plankton','kfisch','gfisch','livyatan'],
 ['plankton','kfisch','gfisch','tylosaurus'],
 ['plankton','kfisch','tinte','liopleurodon'],
 ['plankton','krebs','kfisch','plesiosaurus'],
 ['plankton','krebs','kfisch','ichthyosaurus'],
 ['plankton','qualle','archelon','tylosaurus'],     // Mosasaurier fraßen auch Meeresschildkröten
];
const PLAN={1:{feed:4,need:1,tray:3,chains:[3]},2:{feed:4,need:2,tray:4,chains:[3]},3:{feed:3,need:2,tray:5,chains:[3,4]}};
const SKIP=['ambulocetus','bothriolepis','eusthenopteron','anomalocaris'];
// Falsches Futter muss eindeutig falsch sein: Große Jäger bekommen Winziges angeboten, Kleinfresser großes Futter.
// Krebse/Trilobiten sind nie „falsch“ (viele Jäger fraßen auch die).
const BIG=['fisch','tintenfisch','schildkroete','wal'], SMALL=['plankton','wurm','muschel','qualle'];
const NOT_WRONG={eurypterus:['fisch'],orthoceras:['fisch'],archelon:['fisch','tintenfisch'],ammonit:['fisch'],placodus:['fisch']};
function wrongFor(a){ const eats=a.eats2, big=eats.some(e=>BIG.includes(e));
  let w=(big?SMALL:BIG).filter(f=>!eats.includes(f)&&!(NOT_WRONG[a.id]||[]).includes(f));
  return DW.shuffle(w); }

/* ---------- Hintergrund ---------- */
function wash(top,bot){ const w=160,h=160,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,top);g.addColorStop(1,bot);x.fillStyle=g;x.fillRect(0,0,w,h);
  const N=DW.noise2||(()=>.5),im=x.getImageData(0,0,w,h),d=im.data,s=Math.random()*40;for(let j=0;j<h;j++)for(let i=0;i<w;i++){const v=(N(i/30+s,j/26+s)*.7+N(i/9,j/9+s)*.3-.5)*44,k=(j*w+i)*4;d[k]+=v*.8;d[k+1]+=v;d[k+2]+=v*.9;}x.putImageData(im,0,0);return c.toDataURL(); }
let WASH=null;
function seaBG(){ if(!WASH) WASH=wash('#a8dbd3','#3c7a8e'); const rays=[...Array(4)].map((_,i)=>`<i style="left:${10+i*24}%;animation-delay:${-i*2}s"></i>`).join(''), bubs=[...Array(8)].map(()=>{const s=DW.rand(8,18);return `<span class="sd-bub" style="left:${DW.rand(2,98)}%;width:${s}px;height:${s}px;animation-duration:${DW.rand(7,13)}s;animation-delay:${-DW.rand(0,13)}s"></span>`;}).join('');
  return `<div class="sd-bg"><div class="sd-wash" style="background-image:url(${WASH})"></div><div class="sd-rays">${rays}</div>${bubs}<div class="sd-grain" style="background-image:url(${DW.paperURL})"></div></div>`; }

/* Sprechen, dann weiter – mit Sicherheitsnetz, falls die Sprachausgabe unterbrochen wird */
function sayThen(t,min,fn){ const t0=Date.now(); let done=false; const go=()=>{ if(done) return; done=true; fn(); };
  DW.say(t).then(()=>GK.after(Math.max(200,min-(Date.now()-t0)),go)); GK.after(Math.max(min,1800+t.length*85),go); }
/* ---------- Zustand ---------- */
let root, lv=1, G=null;
const nm=id=>DATA.nameOf(id);
/* Rückmeldungs-Klassen vor jeder neuen Rückmeldung abräumen (sonst gewinnt in der CSS-Reihenfolge immer dieselbe) */
const fb=el=>{ if(el) el.classList.remove('gk-good','gk-bad','gk-hint'); return el; };

function mount(r){ root=r; intro(); }
function intro(){
  GK.intro(root,{id:ID, art:`<div class="sd-iart">${GK.icon('mf_plankton')}${GK.icon('fisch')}${GK.img('ichthyosaurus')}</div>`, title:'Meeres-Futter',
    say:'Im Urzeit-Meer haben alle Hunger! Zieh jedem Tier das richtige Futter zum Maul. Danach bauen wir eine Futterkette.',
    onStart:l=>{ lv=l; start(); }});
}
function start(){
  const P=PLAN[lv];
  const pool=DATA.SEA_IDS.filter(id=>{const a=DATA.animal(id);return a&&!SKIP.includes(id)&&(a.eats2||[]).length&&ART.has(a.art);});
  const ids=GK.sample(pool,P.feed);
  const chains=P.chains.map(n=>DW.pick(CHAINS.filter(c=>c.length===n)));
  G={P,ids,chains,step:0,total:P.feed+chains.length,miss:0};
  next();
}
function next(){
  GK.idle.stop();
  const i=G.step;
  if(i<G.ids.length) return feedRound(G.ids[i]);
  const c=i-G.ids.length;
  if(c<G.chains.length) return chainRound(G.chains[c]);
  finish();
}

/* ---------- Füttern ---------- */
function feedRound(id){
  const a=DATA.animal(id), eats=a.eats2.slice(), need=Math.min(G.P.need,eats.length);
  const wrong=wrongFor(a);
  const tray=DW.shuffle(DW.shuffle(eats).slice(0,Math.max(need,Math.min(eats.length,G.P.tray-2))).concat(wrong).slice(0,G.P.tray));
  G.cur={id,a,eats,need,fed:0,tries:0};
  const imgs={n:DW.svgURL(ART.animal(a.art,{mood:'happy',shadow:false})),c1:DW.svgURL(ART.animal(a.art,{mood:'chew',ph:.25,shadow:false})),c2:DW.svgURL(ART.animal(a.art,{mood:'chew',ph:.75,shadow:false})),s:DW.svgURL(ART.animal(a.art,{mood:'sad',shadow:false}))};
  G.cur.imgs=imgs;
  root.innerHTML=`<div class="sd-stage mf" id="mfStage">${seaBG()}
    <div class="sd-ask mf-ask" id="mfAsk"><div><div class="txt">Was frisst ${nm(id)}?</div>${GK.progress(G.step,G.total)}</div><button class="ibtn" type="button" aria-label="Nochmal hören">${ART.icon('lautsprecher')}</button></div>
    <div class="mf-animal" id="mfA"><img id="mfImg" src="${imgs.n}" alt="${nm(id)}" draggable="false"></div>
    <div class="mf-hearts" id="mfHearts"></div>
    <div class="mf-bubble card hand" id="mfSay">Ich habe Hunger!</div>
    <div class="mf-tray" id="mfTray">${tray.map(f=>`<button class="mf-food" data-f="${f}" type="button">${foodImg(f)}<span>${food(f).n}</span></button>`).join('')}</div></div>`;
  hearts();
  const line=`Ich bin ${nm(id)} und habe Hunger! Was fresse ich? Zieh mir das Futter zum Maul.`;
  root.querySelector('#mfAsk .ibtn').onclick=()=>DW.say(line);
  root.querySelector('#mfA').onclick=()=>DW.say(`Ich bin ${nm(id)}. Was fresse ich wohl?`);
  /* Maul-Fläche beim Greifen EINMAL messen; beim Ziehen nur noch Zahlen vergleichen (kein Layout pro Bewegung) */
  const A=root.querySelector('#mfA'), cur=G.cur; let AR=null, isOver=false;
  const inA=(x,y)=>!!AR&&x>=AR.left&&x<=AR.right&&y>=AR.top&&y<=AR.bottom;
  const setOver=v=>{ if(v!==isOver){ isOver=v; A.classList.toggle('over',v); } };
  DW.$$('.mf-food',root).forEach(b=>{ const f=b.dataset.f;
    DW.drag(b,{ghost:()=>foodImg(f),onTap:()=>DW.say(food(f).n+'. Zieh es zum Maul!'),
      onStart:()=>{ AR=A.getBoundingClientRect(); isOver=false; },
      onMove:(x,y)=>setOver(inA(x,y)),
      onCancel:()=>setOver(false),
      onDrop:(x,y)=>{ const hit=inA(x,y); setOver(false); if(!hit||!G||G.cur!==cur||!A.isConnected) return false; return feed(f,b); }}); });
  DW.say(line);
  GK.idle.set(()=>{ const b=DW.$$('.mf-food',root).find(b=>b.style.visibility!=='hidden'); if(b) GK.pulse(fb(b)); },
    ()=>{ const b=DW.$$('.mf-food',root).find(b=>G.cur.eats.includes(b.dataset.f)&&b.style.visibility!=='hidden'); if(b){ GK.pulse(fb(b)); DW.say('Probier mal das hier!'); } });
}
function hearts(){ root.querySelector('#mfHearts').innerHTML=[...Array(G.cur.need)].map((_,i)=>`<span style="opacity:${i<G.cur.fed?1:.25}">${ART.icon('herz',44)}</span>`).join(''); }
function bubble(t){ const s=root.querySelector('#mfSay'); s.textContent=t; s.classList.remove('pop'); void s.offsetWidth; s.classList.add('pop'); }
function feed(f,btn){
  const c=G.cur, img=root.querySelector('#mfImg'), A=root.querySelector('#mfA');
  if(c.fed>=c.need) return false;   // schon satt – weiteres Futter fliegt zurück
  if(c.eats.includes(f)){
    c.fed++; btn.style.visibility='hidden'; DW.sfx('chew');
    let k=0; const t=GK.every(160,()=>{ img.src=k%2?c.imgs.c1:c.imgs.c2; k++; if(k>5){ clearInterval(t); img.src=c.imgs.n; } });
    hearts();
    if(c.fed>=c.need){ GK.idle.stop(); bubble('Mmmh, satt!'); DW.discover(c.id,true);
      DW.$$('.mf-food',root).forEach(b=>b.style.pointerEvents='none');
      sayThen(`Mmmh, ${food(f).n}! Jetzt bin ich satt. ${c.a.fact||''}`,1500,()=>{ if(G&&G.cur===c){ G.step++; next(); } }); }
    else { bubble(DW.pick(['Mmmh, lecker!','Mampf! Mehr!','Yummi!'])); DW.say(`Mmmh, ${food(f).n}! Lecker! Ich möchte noch etwas.`); }
    return true;
  }
  G.miss++; c.tries++; DW.sfx('yuck'); img.src=c.imgs.s; A.classList.remove('wiggle'); void A.offsetWidth; A.classList.add('wiggle');
  GK.after(900,()=>{ if(G&&G.cur===c) img.src=c.imgs.n; });
  bubble('Nein danke!');
  const like=c.eats.filter(e=>DW.$$('.mf-food',root).some(b=>b.dataset.f===e&&b.style.visibility!=='hidden')).map(e=>food(e).n);
  DW.say(c.tries>=2&&like.length?`Hm, ${food(f).n} mag ich nicht. Ich fresse ${like.join(' und ')}.`:`Hm, ${food(f).n} mag ich nicht. Probier etwas anderes!`);
  if(c.tries>=2){ const b=DW.$$('.mf-food',root).find(b=>c.eats.includes(b.dataset.f)&&b.style.visibility!=='hidden'); GK.pulse(fb(b)); }
  return false;
}

/* ---------- Futterkette ---------- */
function chainRound(chain){
  G.cur={chain,n:0,tries:0};
  root.innerHTML=`<div class="sd-stage mf mf-chainv" id="mfStage">${seaBG()}
    <div class="sd-ask mf-ask" id="mfAsk"><div class="pic">${GK.icon('mf_plankton')}</div><div><div class="txt">Bau die Futterkette!</div>${GK.progress(G.step,G.total)}</div><button class="ibtn" type="button" aria-label="Nochmal hören">${ART.icon('lautsprecher')}</button></div>
    <div class="mf-chain" id="mfChain">${chain.map((k,i)=>`${i?`<div class="mf-arrow">${ART.icon('pfeil_r')}</div>`:''}<div class="mf-slot" data-i="${i}"><span class="mf-num">${i+1}</span></div>`).join('')}</div>
    <p class="mf-legend hand">${GK.icon('pfeil_r','mf-li')} = wird gefressen von</p>
    <div class="mf-tray" id="mfTray">${DW.shuffle(chain).map(k=>`<button class="mf-card" data-k="${k}" type="button">${linkOf(k).img()}<span>${linkOf(k).n}</span></button>`).join('')}</div></div>`;
  const line=`Wer frisst wen? Fang mit dem Kleinsten an! Wer wird zuerst gefressen?`;
  root.querySelector('#mfAsk .ibtn').onclick=()=>DW.say(line); DW.say(line);
  slotGlow();
  DW.$$('.mf-card',root).forEach(b=>{ const k=b.dataset.k;
    DW.drag(b,{ghost:()=>linkOf(k).img(),onTap:()=>DW.say(linkOf(k).n),
      onDrop:(x,y)=>{ const C=root.querySelector('#mfChain'); if(!C||!G||G.cur.chain!==chain||!DW.hit(x,y,C)) return false; return link(k,b); }}); });
  GK.idle.set(()=>{ const s=root.querySelector('.mf-slot.next'); GK.pulse(fb(s)); },()=>{ const k=G.cur.chain[G.cur.n], b=root.querySelector(`.mf-card[data-k="${k}"]`); GK.pulse(fb(b)); DW.say(G.cur.n?`Wer frisst ${linkOf(G.cur.chain[G.cur.n-1]).n}?`:'Was ist ganz, ganz klein?'); });
}
function slotGlow(){ DW.$$('.mf-slot',root).forEach((s,i)=>s.classList.toggle('next',i===G.cur.n)); }
function link(k,b){
  const c=G.cur, want=c.chain[c.n];
  if(k!==want){ G.miss++; c.tries++; GK.no(fb(root.querySelector('.mf-slot.next')));
    DW.say(c.n===0?'Hm, noch nicht. Fang mit dem Kleinsten an!':`Hm, noch nicht. Wer frisst ${linkOf(c.chain[c.n-1]).n}?`); return false; }
  const slot=root.querySelector(`.mf-slot[data-i="${c.n}"]`); slot.innerHTML=linkOf(k).img()+`<span>${linkOf(k).n}</span>`; slot.classList.add('full'); GK.ok(fb(slot));
  b.style.visibility='hidden'; c.n++; slotGlow();
  if(c.n>=c.chain.length){ GK.idle.stop(); DW.sfx('magic');
    DW.$$('.mf-arrow',root).forEach((a,i)=>GK.after(400+i*700,()=>a.classList.add('go')));
    const txt=c.chain.slice(0,-1).map((x,i)=>`${linkOf(x).nom} wird ${linkOf(c.chain[i+1]).dat} gefressen.`).join(' ');
    const last=c.chain[c.chain.length-1]; DW.discover(last,true);
    sayThen('Super! '+txt,2000,()=>{ if(G&&G.cur===c){ G.step++; next(); } });
  } else DW.say(linkOf(k).n+'!');
  return true;
}
function finish(){
  const stars=G.miss<=1?3:G.miss<=4?2:1;
  GK.finish(root,{id:ID,stars,art:`<div class="sd-iart">${GK.icon('mf_plankton')}${GK.icon('fisch')}${GK.img('mosasaurus',{mood:'happy'})}</div>`,
    say:'Alle sind satt! Im Meer fressen die Kleinen das Plankton, und die Großen fressen die Kleinen. Das ist eine Futterkette.',again:()=>start()});
}
if(window.DW_DEBUG) window.__mfInfo=()=>G&&G.cur&&{step:G.step,total:G.total,miss:G.miss,id:G.cur.id||null,eats:G.cur.eats||null,need:G.cur.need,fed:G.cur.fed,chain:G.cur.chain||null,n:G.cur.n,ids:G.ids};
if(window.DW_DEBUG) window.__mfSolve=()=>{ if(!G||!G.cur) return 'none';
  const c=G.cur;
  if(c.chain){ if(c.n>=c.chain.length){ G.step++; next(); return 'skip'; } const b=root.querySelector(`.mf-card[data-k="${c.chain[c.n]}"]`); link(c.chain[c.n],b); return 'link'; }
  if(c.fed>=c.need){ G.step++; next(); return 'skip'; }
  const b=DW.$$('.mf-food',root).find(b=>c.eats.includes(b.dataset.f)&&b.style.visibility!=='hidden'); feed(b.dataset.f,b); return 'feed'; };
if(window.DW_DEBUG) window.__mfWrong=()=>{ const c=G&&G.cur; if(!c) return; if(c.chain){ const k=c.chain.find((x,i)=>i!==c.n&&root.querySelector(`.mf-card[data-k="${x}"]`).style.visibility!=='hidden'); if(k) link(k,root.querySelector(`.mf-card[data-k="${k}"]`)); return; }
  const b=DW.$$('.mf-food',root).find(b=>!c.eats.includes(b.dataset.f)); if(b) feed(b.dataset.f,b); };
DW.stations[ID]={title:'Meeres-Futter',mount,unmount(){ G=null; WASH=null; }};
})();
