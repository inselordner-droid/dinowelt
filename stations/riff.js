/* =====================================================================
   DINO-INSELWELT · Station Urzeit-Riff (Tauchstation)
   Im gemalten Riff verstecken sich Meerestiere. Finde das Tier, das
   gesucht wird – erst nach Bild und Namen, später nach Merkmal.
   Jeder Tauchgang führt in ein anderes Erdzeitalter.
   ===================================================================== */
(function(){
"use strict";
const ID='riff';

/* ---------- Spieldaten ---------- */
// Riffe je Zeitalter: welche Tiere dort lebten, welche Pflanzen/Korallen und Farben
const SCENES={
 kambrium:{n:'Kambrium',ids:['anomalocaris','trilobit'],flora:['rf_schwamm','rf_becher','seetang','rf_stein','rf_matte'],top:'#a9d6cf',bot:'#3f7f86',sand:'#d8c79c',fish:false,
   say:'Wir tauchen ins Kambrium. Vor über 500 Millionen Jahren lebten alle Tiere im Meer.'},
 ordsil:{n:'Ordovizium und Silur',ids:['orthoceras','eurypterus','trilobit'],flora:['seelilie','rf_waben','rf_schwamm','seetang','rf_stein'],top:'#a3cfd8',bot:'#3a7188',sand:'#d6c8a0',fish:false,
   say:'Wir tauchen ins Ordovizium und Silur. Hier wuchsen die ersten Korallenriffe.'},
 devon:{n:'Devon',ids:['dunkleosteus','bothriolepis','eusthenopteron','cladoselache','quastenflosser','trilobit','ammonit'],flora:['seelilie','rf_waben','rf_horn','rf_schwamm','seetang'],top:'#9fd0c8',bot:'#2f6c7c',sand:'#d3c49b',fish:true,
   say:'Wir tauchen ins Devon. Das ist die Zeit der Fische.'},
 // Karbon & Perm: Haie mit seltsamen Zahnreihen, dazu die letzten Trilobiten
 perm:{n:'Karbon und Perm',ids:['edestus','helicoprion','quastenflosser','ammonit','trilobit'],flora:['seelilie','rf_horn','rf_waben','seetang','rf_stein'],top:'#a2d2cc',bot:'#2e667e',sand:'#d9c89c',fish:true,
   say:'Wir tauchen ins Meer von Karbon und Perm. Hier schwammen Haie mit ganz seltsamen Zähnen.'},
 // Trias: das Muschelkalk-Meer, das auch Deutschland bedeckte
 trias:{n:'Trias',ids:['nothosaurus','placodus','shonisaurus','ammonit','quastenflosser'],flora:['seelilie','rf_schwamm','seetang','rf_stein','rf_waben'],top:'#a4d8d0',bot:'#2d6680',sand:'#e0d0a4',fish:true,
   say:'Wir tauchen ins Meer der Trias. Damals lag sogar Deutschland unter Wasser.'},
 jura:{n:'Jura',ids:['ichthyosaurus','plesiosaurus','liopleurodon','leedsichthys','ammonit','quastenflosser'],flora:['koralle','rf_hirn','seelilie','rf_schwamm','seetang','rf_stein'],top:'#9ed7d6',bot:'#2c6a86',sand:'#e0cfa2',fish:true,
   say:'Wir tauchen ins Jura-Meer. Hier schwammen Fischsaurier und Ammoniten.'},
 kreide:{n:'Kreidezeit',ids:['mosasaurus','tylosaurus','elasmosaurus','kronosaurus','archelon','ammonit','quastenflosser'],flora:['koralle','rf_hirn','rf_faecher','seetang','rf_stein'],top:'#a6dad2',bot:'#2b6284',sand:'#e3d2a6',fish:true,
   say:'Wir tauchen ins Meer der Kreidezeit. Hier lebten riesige Meeresreptilien.'},
 // Nach den Dinos: Urwale und Riesenhaie
 kaeno:{n:'Zeit der Urwale',ids:['basilosaurus','dorudon','ambulocetus','megalodon','livyatan','quastenflosser'],flora:['koralle','rf_hirn','rf_faecher','seetang','rf_stein'],top:'#a9dcd6',bot:'#2a6386',sand:'#e5d5aa',fish:true,
   say:'Wir tauchen in die Zeit nach den Dinosauriern. Jetzt schwammen Urwale und Riesenhaie im Meer.'},
};
// Tiere, die sich zum Verwechseln ähnlich sehen – nie zusammen im selben Riff (fair für kleine Kinder)
const TWINS=[['kronosaurus','liopleurodon'],['mosasaurus','tylosaurus'],['ichthyosaurus','shonisaurus'],['basilosaurus','dorudon'],['plesiosaurus','elasmosaurus'],['megalodon','cladoselache'],['edestus','helicoprion']];
const twinOf=id=>{ const t=TWINS.find(t=>t.includes(id)); return t?t.filter(x=>x!==id):[]; };
// Merkmale für Suchaufträge („Finde ein Tier mit …“)
const FEATS=[
 {k:'panzer',say:'Finde ein Tier mit einem Panzer!',ok:'hat einen harten Panzer.',ids:['trilobit','eurypterus','dunkleosteus','bothriolepis','archelon']},
 {k:'fisch',say:'Finde einen Fisch!',ok:'ist ein Fisch. Fische atmen mit Kiemen.',test:a=>a.grp==='fisch'},
 {k:'hals',say:'Finde ein Tier mit einem langen Hals!',ok:'hat einen langen Hals.',ids:['elasmosaurus','plesiosaurus','nothosaurus']},
 {k:'schale',say:'Finde einen Tintenfisch mit Schale!',ok:'ist ein Tintenfisch mit einer harten Schale.',ids:['ammonit','orthoceras']},
 {k:'arme',say:'Finde ein Tier mit zwei Greifarmen!',ok:'packt Beute mit zwei stacheligen Greifarmen.',ids:['anomalocaris']},
 {k:'wal',say:'Finde einen Urwal!',ok:'ist ein Urwal. Wale atmen Luft und trinken als Baby Milch.',ids:['basilosaurus','dorudon','ambulocetus','livyatan']},
];
const featHas=(f,id)=>f.ids?f.ids.includes(id):f.test(DATA.animal(id)||{});
// Ablauf je Schwierigkeit: Tauchgänge (Zeitalter), Aufgaben pro Tauchgang, versteckte Tiere, Verdeckung
const PLAN={
 1:{dives:[['kambrium','ordsil','trias'],['jura','kreide','kaeno']],rounds:[2,2],hide:[3,4],cover:.35,feat:0,size:1},
 2:{dives:[['ordsil','kambrium','perm','trias'],['jura','kreide','kaeno']],rounds:[3,3],hide:[4,5],cover:.5,feat:.34,size:.92},
 3:{dives:[['devon','perm','trias'],['kreide','jura','kaeno']],rounds:[3,4],hide:[6,7],cover:.62,feat:.6,size:.85},
};

/* ---------- eigene Zeichnungen (64×64) ---------- */
const INK='#3d3226';
Object.assign(ART.ICONS,{
 rf_schwamm:`<path d="M20 60L13 12q19-7 38 0l-7 48z" fill="#d99a5e" stroke="${INK}" stroke-opacity=".5" stroke-width="1.5"/><ellipse cx="32" cy="12" rx="19" ry="4" fill="#9a5f34"/>${[18,28,38,24,34,44].map((y,i)=>`<circle cx="${22+(i%3)*9}" cy="${y+i*3}" r="2.2" fill="#b0703e"/>`).join('')}`,
 rf_becher:`${[[14,26],[30,14],[46,24]].map(([x,t])=>`<path d="M${x-7} ${t}q7-4 14 0l-3 ${60-t}h-8z" fill="#e0b57a" stroke="${INK}" stroke-opacity=".45" stroke-width="1.3"/><ellipse cx="${x}" cy="${t}" rx="7" ry="2.4" fill="#8e6a3e"/><path d="M${x-4} ${t+10}h8M${x-4} ${t+20}h8M${x-3} ${t+30}h6" stroke="#b58a54" stroke-width="1.4"/>`).join('')}`,
 rf_matte:`<path d="M4 60q2-16 14-14q4-12 14-10q10-8 18 4q12 0 10 20z" fill="#9fae78" stroke="${INK}" stroke-opacity=".4" stroke-width="1.4"/><path d="M12 56q6-6 12 0t12 0 12 0" stroke="#7d8e5a" stroke-width="2" fill="none"/>`,
 rf_waben:`<path d="M4 60q0-26 28-28t28 28z" fill="#c9b27e" stroke="${INK}" stroke-opacity=".45" stroke-width="1.5"/>${[[16,52],[26,46],[38,46],[48,52],[22,56],[32,54],[42,56],[32,40]].map(([x,y])=>`<path d="M${x-4} ${y}l2-3.5h4l2 3.5-2 3.5h-4z" fill="#a88d5c"/>`).join('')}`,
 rf_horn:`${[[16,60,-18],[32,60,6],[48,60,22]].map(([x,y,r])=>`<g transform="rotate(${r} ${x} ${y})"><path d="M${x-3} ${y}q-6-22 2-40l10 2q-6 20-6 38z" fill="#d6a16c" stroke="${INK}" stroke-opacity=".5" stroke-width="1.3"/><ellipse cx="${x+4}" cy="${y-39}" rx="5.5" ry="2.4" fill="#8e5f3a"/><path d="M${x-4} ${y-12}h8M${x-3} ${y-24}h8" stroke="#a9744a" stroke-width="1.2"/></g>`).join('')}`,
 rf_hirn:`<path d="M6 60q-2-30 26-32t26 32z" fill="#e6a585" stroke="${INK}" stroke-opacity=".45" stroke-width="1.5"/><path d="M12 54q4-10 10-2t10-4 10 4 10-2M16 44q6-8 10 0t10-4 10 2M22 36q6-4 10 0t10 0" stroke="#b86d55" stroke-width="2" fill="none"/>`,
 rf_faecher:`<path d="M32 62V40" stroke="#9c5a78" stroke-width="3"/><path d="M32 42Q6 36 10 12Q32 0 54 12Q58 36 32 42z" fill="#c98aa8" fill-opacity=".85" stroke="${INK}" stroke-opacity=".4" stroke-width="1.4"/>${[-30,-15,0,15,30].map(a=>`<path d="M32 42L${32+Math.sin(a*Math.PI/180)*26} ${42-Math.cos(a*Math.PI/180)*30}" stroke="#9c5a78" stroke-width="1.4"/>`).join('')}<path d="M14 26q18 6 36 0M18 16q14 5 28 0" stroke="#9c5a78" stroke-width="1.1" fill="none"/>`,
 rf_stein:`<path d="M4 60q2-18 16-22q10-10 24-4q14 4 16 26z" fill="#a8a294" stroke="${INK}" stroke-opacity=".5" stroke-width="1.5"/><path d="M18 46q8-4 14 0M38 42q6 2 10 8" stroke="#8a8476" stroke-width="2" fill="none"/>`,
 rf_panzer:`<path d="M10 40q0-24 22-24t22 24q-10 8-22 8t-22-8z" fill="#9a8a5a" stroke="${INK}" stroke-width="2"/><path d="M22 22l-2 20M42 22l2 20M12 34h40M32 16v30" stroke="#6b5a35" stroke-width="2"/><path d="M10 40l-4 6M54 40l4 6" stroke="${INK}" stroke-width="2"/>`,
 rf_hals:`<path d="M6 52q14-10 26-8q8-26 16-34q6-4 10 0l-6 4q-8 10-12 32q12 2 16 8q-24 8-50-2z" fill="#7ea3a8" stroke="${INK}" stroke-width="1.8"/><circle cx="54" cy="12" r="1.6" fill="${INK}"/>`,
 rf_arme:`<path d="M10 40q10-26 26-24q16 2 18 16" fill="none" stroke="#c8553d" stroke-width="8" stroke-linecap="round"/><path d="M18 30l-6-4M24 22l-4-6M32 18l0-6M40 18l4-5" stroke="#c8553d" stroke-width="3" stroke-linecap="round"/><path d="M10 40q10-26 26-24q16 2 18 16" fill="none" stroke="${INK}" stroke-width="1.2" stroke-opacity=".6"/>`,
});
const FEAT_ICON={panzer:'rf_panzer',fisch:'fisch',hals:'rf_hals',schale:'ammonit',arme:'rf_arme',wal:'wal'};

/* ---------- gemeinsamer Unterwasser-Hintergrund ---------- */
function wash(top,bot,seed){
  const w=192,h=192,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,top);g.addColorStop(1,bot);x.fillStyle=g;x.fillRect(0,0,w,h);
  const N=DW.noise2||(()=>.5), im=x.getImageData(0,0,w,h), d=im.data;
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const n=N(i/34+seed,j/30+seed)*.65+N(i/11+seed*3,j/11)*.35, v=(n-.5)*46, k=(j*w+i)*4; d[k]+=v*.8;d[k+1]+=v;d[k+2]+=v*.9;}
  x.putImageData(im,0,0);
  for(let i=0;i<9;i++){const cx=Math.random()*w,cy=Math.random()*h,r=18+Math.random()*40;const rg=x.createRadialGradient(cx,cy,r*.6,cx,cy,r);
    rg.addColorStop(0,'rgba(255,255,255,0.05)');rg.addColorStop(.9,'rgba(20,60,80,.10)');rg.addColorStop(1,'rgba(20,60,80,0)');x.fillStyle=rg;x.beginPath();x.arc(cx,cy,r,0,7);x.fill();}
  return c.toDataURL();
}
function seaBG(sc,opt={}){
  const rays=[...Array(opt.rays??5)].map((_,i)=>`<i style="left:${8+i*19+DW.rand(-4,4)}%;animation-delay:${-i*1.7}s;animation-duration:${8+i}s"></i>`).join('');
  const bubs=[...Array(opt.bubs??9)].map(()=>{const s=DW.rand(8,20);return `<span class="sd-bub" style="left:${DW.rand(3,97)}%;width:${s}px;height:${s}px;animation-duration:${DW.rand(7,14)}s;animation-delay:${-DW.rand(0,14)}s"></span>`;}).join('');
  return `<div class="sd-bg"><div class="sd-wash" style="background-image:url(${wash(sc.top,sc.bot,Math.random()*50)})"></div><div class="sd-rays">${rays}</div>${bubs}<div class="sd-grain" style="background-image:url(${DW.paperURL})"></div></div>`;
}

/* ---------- Zustand ---------- */
let root, lv=1, P, G;
const aname=id=>DATA.nameOf(id);
/* Rückmeldungs-Klassen vor jeder neuen Rückmeldung abräumen (sonst gewinnt in der CSS-Reihenfolge immer dieselbe) */
const fb=el=>{ if(el) el.classList.remove('gk-good','gk-bad','gk-hint'); return el; };

let rzT=null;
function mount(r){ root=r; intro(); GK.listen(window,'resize',()=>{ clearTimeout(rzT); rzT=setTimeout(place,120); }); }
function intro(){
  GK.intro(root,{id:ID, art:`<div class="sd-iart">${GK.img('trilobit')}${GK.icon('taucher')}${GK.img('ichthyosaurus')}</div>`, title:'Urzeit-Riff',
    say:'Tauch mit mir ins Urzeit-Riff! Im Riff verstecken sich Tiere. Findest du sie?',
    onStart:l=>{ lv=l; start(); }});
}
function start(){
  P=PLAN[lv]; G={dive:0,done:0,total:P.rounds.reduce((a,b)=>a+b,0),miss:0};
  dive();
}

/* ---------- Tauchgang: Riff aufbauen ---------- */
function dive(){
  const key=DW.pick(P.dives[G.dive]), sc=SCENES[key];
  G.sc=sc; G.key=key; G.round=0;
  // versteckte Tiere: Arten des Zeitalters (keine Verwechsler-Paare; bei wenigen Arten Trilobit/Ammonit doppelt)
  const n=P.hide[G.dive]; let ids=[];
  DW.shuffle(sc.ids).forEach(id=>{ if(ids.length<n&&!ids.some(x=>twinOf(id).includes(x))) ids.push(id); });
  const dup=ids.filter(x=>x==='trilobit'||x==='ammonit');
  while(ids.length<n) ids.push(DW.pick(dup.length?dup:ids));
  ids=DW.shuffle(ids);
  root.innerHTML=`<div class="sd-stage rf" id="rfStage">${seaBG(sc)}
    <svg class="rf-far" viewBox="0 0 400 100" preserveAspectRatio="none"><path d="M0 100V70C20 40 50 40 70 62C90 30 130 28 150 58C175 44 200 46 215 66C240 34 285 30 300 60C320 46 350 44 370 64C385 56 395 58 400 62V100z" fill="#1f5a6e"/></svg>
    <div id="rfShoals"></div>
    <svg class="rf-sand" viewBox="0 0 400 100" preserveAspectRatio="none"><path d="M0 100V30q50-22 100-8t100-6 100 10 100-14V100z" fill="${sc.sand}"/><path d="M0 100V52q60-14 120-2t140-4 140 6V100z" fill="${ART.shade(sc.sand,.93)}"/>
      <path d="M30 62q20-6 40 0M160 70q24-6 48 0M280 60q18-5 36 0M90 84q20-5 40 0M330 86q16-4 32 0" stroke="${ART.shade(sc.sand,.78)}" stroke-width="2" fill="none"/></svg>
    <div id="rfSpots"></div>
    <div class="sd-ask" id="rfAsk"></div>
    <div class="rf-era">${sc.n}</div></div>`;
  const stage=root.querySelector('#rfStage');
  if(sc.fish){ const sh=root.querySelector('#rfShoals'); for(let i=0;i<2;i++){ sh.insertAdjacentHTML('beforeend',`<div class="rf-shoal" style="top:${22+i*20}%;animation-duration:${26+i*9}s;animation-delay:${-i*11}s">${[[0,10],[30,40],[55,0],[70,55],[20,70]].map(([x,y])=>`<span style="position:absolute;left:${x}%;top:${y}%;width:28%">${DW.iconImg('fisch')}</span>`).join('')}</div>`);} }
  // Verstecke im Gitter verteilen (Raster je nach Bildschirm; bei Drehen/Größenänderung neu angeordnet)
  const nSpots=ids.length+(lv===1?1:2);
  const slots=DW.shuffle([...Array(nSpots).keys()]);
  while(ids.length<nSpots) ids.push(null);
  const spots=root.querySelector('#rfSpots');
  G.spots=[]; G.cells=[];
  ids.forEach((id,i)=>{
    const el=DW.h(`<div class="rf-spot"></div>`);
    const cell={el,slot:slots[i],jx:DW.rand(-.06,.06),jy:DW.rand(-.06,.06),peek:0};
    if(id){
      const flip=Math.random()<.5, peek=DW.pick([-1,1]);
      const off=peek*P.cover*22; cell.peek=Math.abs(off);
      const b=DW.h(`<button class="rf-ani" type="button" aria-label="${aname(id)}" style="--sw:${-peek*DW.rand(5,10)}%;--t:${DW.rand(4,7)}s;left:${off}%;right:${-off}%">${GK.img(id,{flip})}</button>`);
      b.onclick=()=>tapAnimal(id,b);
      el.appendChild(b); G.spots.push({id,b,el,found:false});
    } else {
      const e=DW.h(`<button class="rf-empty" type="button" aria-label="Koralle"></button>`); e.onclick=ev=>puff(ev); el.appendChild(e);
    }
    el.appendChild(DW.h(`<div class="rf-clump">${clump(sc,!!id)}</div>`));
    spots.appendChild(el); G.cells.push(cell);
  });
  place();
  // Übergang ins Zeitalter
  const tr=DW.h(`<div class="rf-trans">${GK.icon('taucher')}<div>${sc.n}</div><small style="font-size:.55em;opacity:.85">${G.dive?'Wir tauchen weiter …':'Abtauchen …'}</small></div>`);
  stage.appendChild(tr); DW.sfx('whoosh');
  const g=G; let gone=false;
  const go=()=>{ if(gone||G!==g||!tr.isConnected) return; gone=true; tr.style.transition='opacity .6s'; tr.style.opacity=0; GK.after(600,()=>{ if(!tr.isConnected||G!==g) return; tr.remove(); ask(); }); };
  DW.say(sc.say).then(go); GK.after(2200+sc.say.length*75,go);
  tr.onclick=()=>{ DW.hush(); go(); };
}
/* Verstecke auf die aktuelle Bühnengröße verteilen */
function place(){
  const stage=root&&root.querySelector('#rfStage'); if(!stage||!G||!G.cells) return;
  const W=stage.clientWidth, H=stage.clientHeight, land=W>H*1.15, n=G.cells.length;
  const top=land?.27:.2, bottom=.95, AH=H*(bottom-top);
  let best=null; for(let c=1;c<=5;c++){ const r=Math.ceil(n/c), s=Math.min(W/c*.95,AH/r*1.3); if(!best||s>best.s) best={c,r,s}; }
  const cols=best.c, rows=best.r, cellW=W/cols, cellH=AH/rows;
  const sw=Math.min(cellW*.95, cellH*1.3, 340)*P.size, sh=sw*.78;
  // freie Zellen gleichmäßig nutzen: Slot-Nummer → Zelle
  const cells=[]; for(let r=0;r<rows;r++)for(let c=0;c<cols;c++) cells.push([c,r]);
  G.cells.forEach(k=>{ const [c,r]=cells[k.slot%cells.length];
    const shift=(r%2?.18:-.08)*cellW, m=sw*(.5+k.peek/100)+4;
    const cx=DW.clamp((c+.5)*cellW+shift+k.jx*cellW, m, W-m), cy=H*top+(r+.55)*cellH+k.jy*cellH;
    k.el.style.cssText=`left:${cx}px;top:${cy}px;--w:${sw}px;--h:${sh}px`; });
}
function clump(sc,withAni){
  // 2–4 Pflanzen/Korallen vor dem Tier; je schwerer, desto mehr ist verdeckt
  const k=withAni?(lv===1?2:3):2, out=[], cov=P.cover;
  const pos=k===2?[28,70]:[18,50,82];
  for(let i=0;i<k;i++){
    const ic=DW.pick(sc.flora), wide=['rf_hirn','rf_waben','rf_stein','rf_matte','rf_faecher'].includes(ic);
    const h=(wide?.5:.78)*(0.62+cov*.75)*DW.rand(.9,1.08)*100;
    const w=(wide?1.25:.7)*h*0.8, left=pos[i]-w/2+DW.rand(-5,5);
    out.push(`<img src="${DW.svgURL(ART.icon(ic))}" alt="" draggable="false" style="left:${left}%;height:${Math.min(h,100)}%;width:${w}%;animation-delay:${-DW.rand(0,5)}s">`);
  }
  return out.join('');
}
function puff(ev){
  const st=root.querySelector('#rfStage'); if(!st) return; const R=st.getBoundingClientRect();
  const p=DW.h(`<span class="rf-puff" style="left:${ev.clientX-R.left}px;top:${ev.clientY-R.top}px"></span>`); st.appendChild(p); GK.after(750,()=>p.remove());
  DW.sfx('pop'); if(G.task) DW.say(DW.pick(['Nur Korallen.','Hier ist niemand.','Blubb! Such weiter.']));
}

/* ---------- Aufgabe stellen ---------- */
function ask(){
  const open=G.spots.filter(s=>!s.found);
  let task=null;
  if(Math.random()<P.feat && G.round>0){
    const opts=DW.shuffle(FEATS).filter(f=>open.some(s=>featHas(f,s.id))&&open.some(s=>!featHas(f,s.id)));
    if(opts.length) task={type:'feat',f:opts[0]};
  }
  if(!task){ const s=DW.pick(open); task={type:'name',id:s.id}; }
  G.task=task;
  // Umriss nur, wenn kein anderes offenes Tier denselben Körperbau hat – sonst wäre es unlösbar
  const plan=id=>(ART.SPECIES[ART.resolve((DATA.animal(id)||{}).art||id)]||{}).plan;
  const sil=lv===3&&task.type==='name'&&!open.some(s=>s.id!==task.id&&plan(s.id)===plan(task.id));
  const pic=task.type==='feat'?GK.icon(FEAT_ICON[task.f.k]):GK.img(task.id,{},sil?'':'');
  const txt=task.type==='feat'?task.f.say:`Wo ist ${sil?'dieses Tier':'der '+aname(task.id)}?`;
  const ask=root.querySelector('#rfAsk');
  ask.innerHTML=`<div class="pic" ${sil?'style="background:rgba(40,80,100,.25)"':''}>${pic}</div><div><div class="txt">${txt}</div>${GK.progress(G.done,G.total)}</div>
    <button class="ibtn" type="button" aria-label="Nochmal hören">${ART.icon('lautsprecher')}</button>`;
  if(sil) ask.querySelector('.pic img').style.filter='brightness(0) opacity(.75)';
  ask.classList.remove('sd-pop'); void ask.offsetWidth; ask.classList.add('sd-pop');
  const line=task.type==='feat'?task.f.say:sil?`Wo ist dieses Tier? Schau auf den Umriss!`:`Wo versteckt sich der ${aname(task.id)}? Tippe ihn an!`;
  ask.querySelector('.ibtn').onclick=()=>DW.say(line);
  DW.say(line);
  GK.idle.set(()=>{ const t=targets()[0]; if(t) GK.pulse(fb(t.b)); },()=>{ const t=targets()[0]; if(t){ GK.pulse(fb(t.b)); DW.say(where(t)+' '+(task.type==='feat'?task.f.say:'')); } });
}
function targets(){ const t=G.task; return G.spots.filter(s=>!s.found&&(t.type==='name'?s.id===t.id:featHas(t.f,s.id))); }
function where(s){ const st=root.querySelector('#rfStage').getBoundingClientRect(), r=s.el.getBoundingClientRect();
  const x=(r.left+r.width/2-st.left)/st.width, y=(r.top+r.height/2-st.top)/st.height;
  return 'Schau mal '+(y>.66?'unten':y<.45?'oben':'in der Mitte')+(x<.36?' links':x>.64?' rechts':'')+'!'; }

function tapAnimal(id,b){
  if(!G.task||b.dataset.busy) return;
  const t=G.task, ok=t.type==='name'?id===t.id:featHas(t.f,id);
  if(!ok){
    G.miss++; GK.no(fb(b));
    const hint=t.type==='feat'?`Das ist der ${aname(id)}. Der passt nicht ganz. Such weiter!`:`Das ist der ${aname(id)}. Schau noch mal auf das Bild!`;
    DW.say(hint); return;
  }
  const s=G.spots.find(x=>x.b===b); s.found=true; G.task=null; GK.idle.stop();
  GK.ok(fb(b)); b.dataset.busy=1; DW.sfx('magic');
  GK.after(450,()=>b.classList.add('gone'));
  G.done++; G.round++;
  const a=DATA.animal(id), first=DW.discover(id,true), era={n:G.sc.n,col:G.sc.top};
  const lead=t.type==='feat'?`Ja! Der ${aname(id)} ${t.f.ok}`:`Gefunden! Das ist der ${aname(id)}.`;
  const stage=root.querySelector('#rfStage');
  const card=DW.h(`<div class="sd-card"><div class="card pop"><div class="ani">${GK.img(id,{mood:'happy'})}</div>
    <h2>${aname(id)}</h2>${era?`<span class="era" style="background:${era.col}">${era.n}</span>`:''}
    ${first?`<span class="pill">${ART.icon('rucksack',26).replace('<svg','<svg style="display:inline;vertical-align:middle"')} Neu im Rucksack!</span>`:''}
    <p>${a.fact||''}</p><button class="btn big go" type="button">${ART.icon('pfeil_r',36)}Weiter</button></div></div>`);
  stage.appendChild(card);
  if(first) DW.sfx('star');
  DW.say(lead+' '+(a.fact||''));
  const go=card.querySelector('.btn');
  GK.idle.set(()=>GK.pulse(go),()=>{GK.pulse(go);DW.say('Tippe auf Weiter!');});
  go.onclick=()=>{ DW.sfx('tap'); card.remove(); next(); };
}
function next(){
  GK.idle.stop();
  if(G.round>=P.rounds[G.dive]){
    G.dive++;
    if(G.dive>=P.dives.length) return finish();
    return dive();
  }
  ask();
}
function finish(){
  const stars=G.miss<=1?3:G.miss<=4?2:1;
  GK.finish(root,{id:ID,stars,art:`<div class="sd-iart">${GK.img('ichthyosaurus',{mood:'happy'})}${GK.img('trilobit',{mood:'happy'})}</div>`,
    say:`Toll getaucht! Du hast ${G.total} Tiere im Urzeit-Riff gefunden.`,again:()=>start()});
}
if(window.DW_DEBUG) window.__rfInfo=()=>{ if(!G) return null; const rc=b=>{ const r=b.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height}; };
  const t=G.task&&targets()[0], w=G.task&&G.spots.find(s=>!s.found&&!targets().includes(s));
  return {task:G.task?G.task.type:null,target:t?rc(t.b):null,wrong:w?rc(w.b):null,done:G.done,total:G.total,miss:G.miss,dive:G.dive,era:G.key,card:!!root.querySelector('.sd-card'),trans:!!root.querySelector('.rf-trans'),ids:G.spots.map(s=>s.id)}; };
// Testhilfe: richtige Lösung antippen
if(window.DW_DEBUG) window.__rfSolve=()=>{ const c=root&&root.querySelector('.sd-card .btn'); if(c){c.click();return 'next';} const tr=root&&root.querySelector('.rf-trans'); if(tr){tr.remove();ask();return 'trans';} const t=G&&G.task&&targets()[0]; if(t){t.b.click();return 'tap';} return 'none'; };
DW.stations[ID]={title:'Urzeit-Riff',mount,unmount(){ G=null; clearTimeout(rzT); }};
})();
