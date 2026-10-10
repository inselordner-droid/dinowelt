/* =====================================================================
   DINO-INSELWELT · Station Forschungsschiff
   Tiere kommen im Netz an Bord. Sortiere sie in die Becken:
   Fisch · Reptil · Säugetier (schwer: + Ohne Knochen).
   ===================================================================== */
(function(){
"use strict";
const ID='schiff';

/* ---------- Spieldaten ---------- */
// Tier-Auswahl je Schwierigkeit (leicht: eindeutige Beispiele; mittel: Verwechsler; schwer: + Tiere ohne Knochen)
// Pools werden aus DATA.SEA_IDS gebildet (nur Tiere mit Zeichnung und Gruppe). Leicht: eindeutige Beispiele.
const EASY=['quastenflosser','megalodon','leedsichthys','dunkleosteus','cladoselache','archelon','plesiosaurus','elasmosaurus','deinosuchus','nothosaurus','placodus','livyatan','basilosaurus','ambulocetus'];
const seaPool=f=>DATA.SEA_IDS.filter(id=>{ const a=DATA.animal(id); return a&&a.grp&&ART.has(a.art)&&(!f||f(a)); });
const POOL={
 1:{groups:['fisch','reptil','saeuger'],n:5,ids:()=>seaPool(a=>EASY.includes(a.id))},
 2:{groups:['fisch','reptil','saeuger'],n:7,must:['ichthyosaurus','dorudon'],ids:()=>seaPool(a=>a.grp!=='wirbellos')},
 3:{groups:['fisch','reptil','saeuger','wirbellos'],n:9,must:['ichthyosaurus','basilosaurus','helicoprion'],ids:()=>seaPool()},
};
// Erklärungen (nach dem richtigen Einsortieren)
const WHY={
 ichthyosaurus:'Er sieht aus wie ein Delfin oder ein Fisch. Aber er war ein Reptil! Fischsaurier mussten zum Atmen auftauchen.',
 shonisaurus:'Ein Fischsaurier sieht aus wie ein Fisch. Aber er war ein Reptil und musste zum Atmen auftauchen.',
 dorudon:'Das ist ein Urwal. Wale sind Säugetiere: Sie atmen Luft, und ihre Babys trinken Milch.',
 basilosaurus:'Sein Name heißt Königs-Echse. Die Forscher hielten ihn zuerst für ein Reptil. Aber er war ein Urwal – ein Säugetier!',
 livyatan:'Ein Verwandter der Pottwale. Wale sind Säugetiere und atmen Luft durch ein Blasloch.',
 megalodon:'Megalodon war ein Riesenhai. Haie sind Fische und atmen mit Kiemen.',
 cladoselache:'Ein Urzeit-Hai. Haie sind Fische mit Kiemen.',
 xenacanthus:'Ein Urzeit-Hai. Haie sind Fische mit Kiemen.',
 helicoprion:'Ein Knorpelfisch mit Kiemen, entfernt verwandt mit den Haien.',
 edestus:'Ein Knorpelfisch mit Kiemen, entfernt verwandt mit den Haien.',
 dunkleosteus:'Ein Panzerfisch. Trotz Panzer atmete er mit Kiemen – ein Fisch!',
 bothriolepis:'Ein kleiner Panzerfisch. Er atmete mit Kiemen.',
 quastenflosser:'Ein Fisch mit dicken, fleischigen Flossen. Er atmet mit Kiemen.',
 leedsichthys:'Ein Riesenfisch. Mit seinen Kiemen siebte er winziges Plankton aus dem Wasser.',
 archelon:'Schildkröten sind Reptilien. Sie atmen Luft.',
 deinosuchus:'Krokodile sind Reptilien. Sie atmen Luft.',
 mosasaurus:'Mosasaurier waren riesige Meeres-Echsen – Reptilien, verwandt mit Waranen und Schlangen.',
 tylosaurus:'Tylosaurus war ein Mosasaurier – eine riesige Meeres-Echse. Ein Reptil!',
 trilobit:'Trilobiten hatten keine Knochen im Körper. Ihr harter Panzer war außen.',
 ammonit:'Ammoniten waren Tintenfische. Die haben keine Knochen, nur eine harte Schale.',
 orthoceras:'Orthoceras war ein Tintenfisch mit langer Schale. Er hatte keine Knochen.',
 eurypterus:'Ein Seeskorpion hat keine Knochen. Sein Panzer ist außen.',
 anomalocaris:'Anomalocaris hatte keine Knochen. Er war ein Verwandter der Krebse und Insekten.',
 ambulocetus:'Ambulocetus war ein Urwal mit Beinen. Er konnte laufen und schwimmen – und er war ein Säugetier!',
 nothosaurus:'Nothosaurus war ein Meeresreptil mit langem Hals. Er kam zum Atmen an die Oberfläche.',
 placodus:'Placodus war ein Meeresreptil. Mit seinen flachen Zähnen knackte er Muscheln.',
 elasmosaurus:'Elasmosaurus hatte einen riesig langen Hals. Er war ein Reptil und atmete Luft.',
 plesiosaurus:'Plesiosaurier waren Meeresreptilien mit vier Flossen. Sie atmeten Luft.',
 kronosaurus:'Kronosaurus war ein riesiges Meeresreptil mit großem Kopf. Er atmete Luft.',
 liopleurodon:'Liopleurodon war ein Meeresreptil mit kräftigen Kiefern. Er atmete Luft.',
 eusthenopteron:'Ein Fisch mit kräftigen Flossen. Er atmete mit Kiemen.',
};
const CLUE={fisch:'Tipp: Er atmet mit Kiemen unter Wasser.',reptil:'Tipp: Er musste zum Luftholen auftauchen. Er war mit Schildkröten und Echsen verwandt.',
  saeuger:'Tipp: Er atmete Luft, und seine Babys tranken Milch.',wirbellos:'Tipp: Er hat keine Knochen im Körper.'};
const TUBCOL={fisch:'#8fc2cf',reptil:'#a9c98e',saeuger:'#b9b2d8',wirbellos:'#e7c08f'};

/* ---------- Zeichnungen ---------- */
Object.assign(ART.ICONS,{
 sc_kiemen:`<path d="M6 34q14-16 34-12q10 2 16 10l4-6v18l-4-6q-8 8-28 8T6 34z" fill="#8fbccb" stroke="#3d3226" stroke-width="1.5"/><path d="M26 26q-3 8 0 16M31 25q-3 9 0 18M36 26q-3 8 0 16" stroke="#c8553d" stroke-width="2.4" fill="none"/><circle cx="16" cy="31" r="2" fill="#3d3226"/>`,
 sc_luft:`<circle cx="22" cy="40" r="12" fill="#dff1f5" stroke="#6f97ad" stroke-width="2"/><circle cx="42" cy="22" r="9" fill="#dff1f5" stroke="#6f97ad" stroke-width="2"/><circle cx="50" cy="46" r="6" fill="#dff1f5" stroke="#6f97ad" stroke-width="2"/><path d="M18 36a5 5 0 0 1 6-4" stroke="#fff" stroke-width="2" fill="none"/>`,
 sc_milch:`<path d="M22 14h20v8l6 8v26H16V30l6-8z" fill="#fbf7ee" stroke="#3d3226" stroke-width="1.8"/><path d="M16 38h32" stroke="#8fbccb" stroke-width="2"/><path d="M22 14h20" stroke="#c8553d" stroke-width="4"/>`,
 sc_schale:`<path d="M8 40q2-24 24-26t24 26q-24 10-48 0z" fill="#e2c08e" stroke="#3d3226" stroke-width="1.8"/><path d="M18 36q14-16 28 0M32 16v22" stroke="#9a7447" stroke-width="2" fill="none"/>`,
});
const TUBHINT={fisch:'sc_kiemen',reptil:'sc_luft',saeuger:'sc_milch',wirbellos:'sc_schale'};
function tubSVG(col){ return `<svg viewBox="0 0 120 90" class="sc-tubsvg" aria-hidden="true"><path d="M8 22L18 84Q60 92 102 84L112 22z" fill="#b98a58" stroke="#3d3226" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M12 44Q60 52 108 44M15 66Q60 74 105 66" stroke="#6e4a30" stroke-width="5" fill="none"/><ellipse cx="60" cy="22" rx="52" ry="12" fill="${col}" stroke="#3d3226" stroke-width="2.5"/>
  <path d="M26 22q10-5 20 0t20 0 20 0" stroke="#fff" stroke-width="2" fill="none" opacity=".75"/></svg>`; }

/* ---------- Spiel ---------- */
let root, lv=1, G=null;
const nm=id=>DATA.nameOf(id);
/* Rückmeldungs-Klassen vor jeder neuen Rückmeldung abräumen (sonst gewinnt in der CSS-Reihenfolge immer dieselbe) */
const fb=el=>{ if(el) el.classList.remove('gk-good','gk-bad','gk-hint'); return el; };

function mount(r){ root=r; intro(); }
function intro(){
  GK.intro(root,{id:ID, art:`<div class="sd-iart">${GK.img('megalodon')}${GK.icon('schiff')}${GK.img('ichthyosaurus')}</div>`, title:'Forschungsschiff',
    say:'Ahoi! Unser Netz fängt Urzeit-Tiere. Ist es ein Fisch, ein Reptil oder ein Säugetier? Zieh jedes Tier ins richtige Becken!',
    onStart:l=>{ lv=l; start(); }});
}
function start(){
  const P=POOL[lv];
  // jede Gruppe mindestens einmal, Pflicht-Tiere dabei
  const pool=P.ids(); let ids=(P.must||[]).filter(i=>pool.includes(i));
  P.groups.forEach(g=>{ if(!ids.some(i=>DATA.animal(i).grp===g)){ const c=pool.filter(i=>DATA.animal(i).grp===g&&!ids.includes(i)); if(c.length) ids.push(DW.pick(c)); } });
  ids=ids.concat(GK.sample(pool,P.n-ids.length,ids));
  G={ids:DW.shuffle(ids),i:0,miss:0,tries:0,groups:P.groups,busy:false};
  build();
  next();
}
function build(){
  const waves=[0,1,2].map(i=>`<path d="M0 ${14+i*16}q25-8 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0V120H0z" fill="rgba(255,255,255,${.1+i*.05})"/>`).join('');
  root.innerHTML=`<div class="sd-stage sc" id="scStage">
    <div class="sc-sky"><div class="sc-sun"></div><div class="sc-cloud" style="left:12%;top:18%"></div><div class="sc-cloud" style="left:62%;top:8%;transform:scale(.7)"></div></div>
    <div class="sc-sea"><svg viewBox="0 0 450 120" preserveAspectRatio="none">${waves}</svg></div>
    <div class="sc-rail"></div>
    <div class="sc-deck"><div class="sd-grain" style="background-image:url(${DW.paperURL})"></div></div>
    <div class="sc-crane"><div class="sc-rope"></div><div class="sc-net" id="scNet"><svg class="sc-mesh" viewBox="0 0 100 80" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 6Q50 0 96 6L84 74Q50 82 16 74z" fill="rgba(210,190,140,.25)" stroke="#8a6d4a" stroke-width="1.6"/>${[...Array(7)].map((_,i)=>`<path d="M${10+i*13} 4Q${14+i*11} 40 ${18+i*11} 78" stroke="#8a6d4a" stroke-width="1" fill="none"/>`).join('')}${[...Array(5)].map((_,i)=>`<path d="M${6+i*2.4} ${16+i*14}Q50 ${22+i*14} ${94-i*2.4} ${16+i*14}" stroke="#8a6d4a" stroke-width="1" fill="none"/>`).join('')}</svg>
      <button class="sc-catch" id="scCatch" type="button"></button></div></div>
    <div class="sc-tubs ${G.groups.length>3?'four':''}" id="scTubs">${G.groups.map(g=>{const d=DATA.SEA_GROUPS[g];return `<button class="sc-tub" data-g="${g}" type="button" aria-label="${d.n}">
      <div class="sc-sign">${GK.icon(d.icon.replace('animal:','animal:'))}${GK.icon(TUBHINT[g],'sc-hint')}</div>${tubSVG(TUBCOL[g])}<div class="sc-in"></div><b>${d.n}</b></button>`;}).join('')}</div>
    <div class="sd-ask sc-ask" id="scAsk"></div></div>`;
  DW.$$('.sc-tub',root).forEach(t=>t.onclick=()=>{ const g=DATA.SEA_GROUPS[t.dataset.g]; DW.sfx('tap'); GK.pulse(fb(t)); DW.say(g.n+'. '+g.say); });
  const c=root.querySelector('#scCatch');
  /* Becken beim Greifen EINMAL messen; beim Ziehen nur noch Zahlen vergleichen (kein Layout pro Bewegung) */
  let tubs=[], over=null;
  const setOver=t=>{ if(t===over) return; if(over) over.classList.remove('over'); over=t; if(t) t.classList.add('over'); };
  const tubAt=(x,y)=>{ const h=tubs.find(q=>x>=q.l&&x<=q.r&&y>=q.t&&y<=q.b); return h?h.el:null; };
  DW.drag(c,{ghost:()=>G&&!G.busy&&G.ids[G.i]?GK.img(G.ids[G.i]):'',
    onTap:()=>{ const id=G&&!G.busy&&G.ids[G.i]; if(id) DW.say(`Das ist ${nm(id)}. Fisch, Reptil oder Säugetier?`); },
    onStart:()=>{ tubs=DW.$$('.sc-tub',root).map(el=>{ const r=el.getBoundingClientRect(); return {el,l:r.left,r:r.right,t:r.top,b:r.bottom}; }); over=null; },
    onMove:(x,y)=>setOver(tubAt(x,y)),
    onCancel:()=>setOver(null),
    onDrop:(x,y)=>{ const t=tubAt(x,y); setOver(null); if(!t||!G) return false; return sort(t.dataset.g); }});
}
function ask(){
  const a=root.querySelector('#scAsk');
  a.innerHTML=`<div><div class="txt">Wohin gehört das Tier?</div>${GK.progress(G.i,G.ids.length)}</div><button class="ibtn" type="button" aria-label="Nochmal hören">${ART.icon('lautsprecher')}</button>`;
  a.querySelector('.ibtn').onclick=()=>DW.say(line());
}
const line=()=>`Im Netz ist ${nm(G.ids[G.i])}. Ist das ein Fisch, ein Reptil${G.groups.length>3?', ein Säugetier oder ein Tier ohne Knochen?':' oder ein Säugetier?'}`;
function next(){
  if(G.i>=G.ids.length) return finish();
  G.tries=0; G.busy=false;
  const id=G.ids[G.i], net=root.querySelector('#scNet'), c=root.querySelector('#scCatch');
  c.innerHTML=GK.img(id); c.style.opacity=''; c.style.pointerEvents='';
  net.classList.remove('up','down'); void net.offsetWidth; net.classList.add('down'); DW.sfx('whoosh');
  ask();
  GK.after(700,()=>{ DW.sfx('pop'); DW.say(line()); });
  GK.idle.set(()=>GK.pulse(fb(c)),()=>{ GK.pulse(fb(c)); DW.say('Zieh das Tier aus dem Netz in ein Becken. '+CLUE[DATA.animal(G.ids[G.i]).grp]); });
}
function sort(g){
  if(G.busy) return false;
  const id=G.ids[G.i], a=DATA.animal(id), tub=root.querySelector(`.sc-tub[data-g="${g}"]`);
  if(a.grp!==g){
    G.miss++; G.tries++; GK.no(fb(tub));
    DW.say(G.tries>=2?`Hm, noch nicht. ${nm(id)} gehört zu: ${DATA.SEA_GROUPS[a.grp].n}. ${WHY[id]||DATA.SEA_GROUPS[a.grp].say}`:`Hm, noch nicht. ${CLUE[a.grp]}`);
    if(G.tries>=2) GK.pulse(fb(root.querySelector(`.sc-tub[data-g="${a.grp}"]`)));
    return false;
  }
  G.busy=true; GK.idle.stop(); GK.ok(fb(tub)); DW.sfx('whoosh');
  const c=root.querySelector('#scCatch'); c.innerHTML=''; c.style.pointerEvents='none';
  const inn=tub.querySelector('.sc-in'); const mini=DW.h(`<span class="sc-mini">${GK.img(id)}</span>`); inn.appendChild(mini);
  splash(tub); DW.discover(id,true);
  root.querySelector('#scNet').classList.add('up');
  G.i++; ask();
  const txt=`Ja! ${nm(id)} ist ${g==='wirbellos'?'ein Tier ohne Knochen':g==='saeuger'?'ein Säugetier':g==='reptil'?'ein Reptil':'ein Fisch'}. ${WHY[id]||DATA.SEA_GROUPS[g].say}`;
  // weiter, wenn die Erklärung fertig ist (Sicherheitsnetz, falls die Sprachausgabe unterbrochen wird)
  const g0=G, at=G.i, t0=Date.now(); let went=false;
  const go=()=>{ if(went||G!==g0||!G.busy||G.i!==at) return; went=true; next(); };
  DW.say(txt).then(()=>GK.after(Math.max(300,1600-(Date.now()-t0)),go)); GK.after(1800+txt.length*85,go);
  return true;
}
function splash(tub){
  const R=tub.getBoundingClientRect(), S=root.querySelector('#scStage').getBoundingClientRect();
  for(let k=0;k<9;k++){ const d=DW.h(`<span class="sc-drop" style="left:${R.left-S.left+R.width/2}px;top:${R.top-S.top+R.height*.35}px;--dx:${DW.rand(-50,50)}px;--dy:${DW.rand(-70,-30)}px"></span>`); root.querySelector('#scStage').appendChild(d); GK.after(700,()=>d.remove()); }
}
function finish(){
  const stars=G.miss===0?3:G.miss<=3?2:1;
  GK.finish(root,{id:ID,stars,art:`<div class="sd-iart">${GK.img('ichthyosaurus',{mood:'happy'})}${GK.icon('schiff')}${GK.img('dorudon',{mood:'happy'})}</div>`,
    say:'Alle Tiere sind sortiert! Fische atmen mit Kiemen. Meeresreptilien und Wale müssen zum Atmen auftauchen.',again:()=>start()});
}
if(window.DW_DEBUG) window.__scInfo=()=>G&&{id:G.ids[G.i]||null,grp:G.ids[G.i]?DATA.animal(G.ids[G.i]).grp:null,busy:G.busy,i:G.i,n:G.ids.length,miss:G.miss,groups:G.groups,ids:G.ids};
if(window.DW_DEBUG) window.__scSolve=()=>{ if(!G||G.i>=G.ids.length) return 'none'; if(G.busy){ next(); return 'skip'; } const g=DATA.animal(G.ids[G.i]).grp; sort(g); return 'sorted '+g; };
if(window.DW_DEBUG) window.__scWrong=()=>{ if(!G) return; const g=G.groups.find(x=>x!==DATA.animal(G.ids[G.i]).grp); return sort(g); };
DW.stations[ID]={title:'Forschungsschiff',mount,unmount(){ G=null; }};
})();
