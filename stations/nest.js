/* =====================================================================
   DINO-INSELWELT · Station Nestbau (GAME 18)
   Der Maiasaura-Mama helfen: Mulde graben, Rand bauen, weich polstern,
   Eier im Kreis ablegen, mit Pflanzen zudecken, Eier beschützen.
   ===================================================================== */
(function(){
"use strict";
const ID='nest';
ART.ICONS.ne_erde='<path d="M6 50q0-14 14-17q4-13 18-11q14-3 18 11q9 6 3 17z" fill="#8a6440" stroke="#4a3b2a" stroke-width="2.4" stroke-linejoin="round"/><circle cx="22" cy="40" r="3" fill="#6e4f32"/><circle cx="40" cy="34" r="2.4" fill="#6e4f32"/><circle cx="46" cy="45" r="2.8" fill="#a07a50"/><path d="M14 46q10-4 20 0" stroke="#a88258" stroke-width="2" fill="none"/>';
/* Maiasaura: Nester aus Erde/Schlamm mit Mulde, Eier im Kreis, mit Pflanzen bedeckt (Wärme beim Verrotten). */
const MAMA={art:'edmontosaurus',n:'Maiasaura'};
const MAT={
 erde:{n:'Erde',icon:'ne_erde',say:'Erde. Damit bauen wir einen festen Rand.'},
 zweig:{n:'Zweige',icon:'zweig',say:'Zweige. Die machen den Rand stabil.'},
 blaetter:{n:'Blätter',icon:'blaetter',say:'Weiche Blätter. Ein gutes Polster für die Eier.'},
 moos:{n:'Moos',icon:'moos',say:'Weiches Moos. Schön kuschelig.'},
 farn:{n:'Farn',icon:'farn',say:'Farn. Damit decken wir die Eier zu.'},
 stein:{n:'Stein',icon:'stein',deco:true,say:'Ein Stein. Zu hart für die Eier – aber schön als Deko.'},
 blume:{n:'Blume',icon:'blume',deco:true,say:'Eine Blume. Hübsch als Deko am Nestrand.'},
};
/* Nest-Rezept je Stufe */
const LV={1:{mats:['erde','blaetter','farn'],need:2,dig:5,eggs:6,thief:0,big:false},
          2:{mats:['erde','zweig','blaetter','farn','stein'],need:3,dig:6,eggs:8,thief:1,big:false},
          3:{mats:['erde','zweig','blaetter','moos','farn','stein','blume'],need:4,dig:8,eggs:12,thief:2,big:true}};
const PHASES=[
 {k:'dig',ask:'Grab eine Mulde!',say:'Hilf mir, ein Nest zu bauen! Zuerst graben wir eine Mulde. Tippe immer wieder auf den Boden.'},
 {k:'rim',use:['erde','zweig'],ask:'Bau einen Rand aus Erde!',say:'Jetzt bauen wir einen hohen Rand. Zieh Erde zum Nest! Dann rollen die Eier nicht weg.'},
 {k:'bed',use:['blaetter','moos'],ask:'Mach es weich!',say:'Jetzt machen wir es schön weich. Zieh Blätter ins Nest.'},
 {k:'eggs',ask:'Leg die Eier im Kreis!',say:'Ich habe Eier gelegt! Zieh sie ins Nest. Im Kreis haben alle Platz.'},
 {k:'cover',use:['farn'],ask:'Deck die Eier zu!',say:'Jetzt decken wir die Eier mit Pflanzen zu. Die halten sie warm, wie eine Decke.'},
 {k:'guard',ask:'Pass auf die Eier auf!',say:'Oh! Ein kleiner Räuber schleicht sich an. Tippe ihn an, dann läuft er weg!'},
];
/* kleine Nesträuber: kleine Raubsaurier (≤ 3 m) mit Zeichnung */
const THIEVES=GK.pool(a=>DATA.isDino(a.id)&&a.food==='fleisch'&&DATA.habitat(a.id)==='land'&&(DATA.lenM(a.id)||9)<=3).map(a=>a.id);
if(!THIEVES.length) THIEVES.push('velociraptor');
let root, lv=1, S=null, RO=null;
function mount(r){ root=r; intro(); }
function intro(){
  GK.intro(root,{id:ID,title:'Dino-Nestbau',art:GK.img(MAMA.art,{mood:'happy'}),
    say:'Ich bin Maiasaura, die gute Mutter-Echse. Hilfst du mir, ein sicheres Nest für meine Eier zu bauen?',
    onStart:l=>{lv=l;start();}});
}
function start(){
  const L=LV[lv];
  S={L,ph:0,dig:0,cnt:{rim:0,bed:0,cover:0},eggs:0,miss:0,thieves:0,phases:PHASES.filter(p=>p.k!=='guard'||L.thief>0)};
  const R=L.big?1.12:1; S.R=R;
  root.innerHTML=`<div class="ne fill">
    <div class="ne-top"><div id="neProg"></div><button class="ne-ask card" id="neAsk" type="button"><span class="ne-askic">${ART.icon('lautsprecher')}</span><span id="neAskT"></span></button></div>
    <div class="ne-scene" id="neScene">
      <div class="ne-sun"></div>
      <button class="ne-mama" id="neMama" type="button" aria-label="Maiasaura">${DW.animalImg(MAMA.art,{mood:'happy'})}</button>
      <div class="ne-nestwrap" id="neNest"><svg class="ne-svg" viewBox="0 0 400 240" aria-hidden="true">
        <ellipse class="ne-glow" id="neGlow" cx="200" cy="140" rx="200" ry="96" fill="none" stroke="#f0c35a" stroke-width="12"/>
        <g filter="url(#wc)"><ellipse cx="200" cy="140" rx="196" ry="92" fill="#b9c48a" opacity=".55"/><ellipse cx="200" cy="140" rx="170" ry="74" fill="#cdb98c"/></g>
        <g id="neDeco"></g>
        <g filter="url(#wc)"><ellipse id="neRim" cx="200" cy="140" rx="${158*R}" ry="${66*R}" fill="none" stroke="#8a6440" stroke-width="0"/></g><g id="neLumps"></g>
        <g filter="url(#wc)"><ellipse id="neHole" cx="200" cy="140" rx="0" ry="0" fill="#6e5236"/><ellipse id="neHole2" cx="200" cy="146" rx="0" ry="0" fill="#5c432c" opacity=".6"/></g>
        <g id="neBed"></g><g id="neSlots"></g><g id="neEggs"></g><g id="neBabies"></g><g id="neCover"></g><g id="neDust"></g>
        <g class="ne-tip" id="neTip"><circle cx="200" cy="140" r="30" fill="none" stroke="#f0c35a" stroke-width="6"/><image href="${DW.svgURL(ART.icon('hand'))}" x="182" y="128" width="56" height="56"/></g>
      </svg></div>
    </div>
    <div class="ne-tray" id="neTray"><div class="ne-mats" id="neMats"></div><div class="ne-eggtray" id="neEggTray"></div></div></div>`;
  root.querySelector('#neAsk').onclick=()=>{DW.sfx('tap');DW.repeat();};
  root.querySelector('#neMama').onclick=()=>{DW.sfx('tap');bounceMama();DW.say(S.phases[S.ph]?S.phases[S.ph].say:'Danke, du bist toll!');};
  digInput(root.querySelector('#neNest'));
  fit(); if(RO) RO.disconnect();
  if(window.ResizeObserver){ RO=new ResizeObserver(fit); RO.observe(root.querySelector('#neScene')); } else GK.listen(window,'resize',fit);
  tray(); phase();
}
/* Das Nest sitzt mit festen, ganzen Pixelmaßen genau in der Mitte der Spielfläche (kein transform am Nest:
   Animationen wie gk-good/gk-hint überschreiben transform und ließen das Nest springen). */
function fit(){
  if(!S||!root) return; const sc=root.querySelector('#neScene'), n=root.querySelector('#neNest'); if(!sc||!n) return;
  const W=sc.clientWidth, H=sc.clientHeight; if(!W||!H) return;
  let w=Math.floor(Math.min(920,W*(W<=600?1.18:.94),H*.96*400/240)); if((W-w)%2) w--;
  const h=Math.round(w*.6);
  /* die gezeichnete Mulde (Mittelpunkt 200|140 im 400×240-Bild) liegt genau in der Mitte der Spielfläche */
  n.style.width=w+'px'; n.style.height=h+'px'; n.style.left=(W-w)/2+'px'; n.style.top=Math.round(H/2-h*140/240)+'px';
}
/* Buddeln: Tippen UND Rubbeln/Wischen zählen (auch mit zwei Fingern). Das Nest selbst bewegt sich dabei nie. */
function digInput(n){
  const P=new Map(); let last=0;
  n.addEventListener('pointerdown',e=>{ if(!S||cur().k!=='dig') return; e.preventDefault(); P.set(e.pointerId,{x:e.clientX,y:e.clientY,d:0}); last=performance.now(); digAt(e); });
  n.addEventListener('pointermove',e=>{ const q=P.get(e.pointerId); if(!q||!S||cur().k!=='dig') return;
    q.d+=Math.hypot(e.clientX-q.x,e.clientY-q.y); q.x=e.clientX; q.y=e.clientY;
    const t=performance.now(); if(q.d>=70&&t-last>=170){ q.d=0; last=t; digAt(e); } });
  const up=e=>P.delete(e.pointerId); n.addEventListener('pointerup',up); n.addEventListener('pointercancel',up); n.addEventListener('pointerleave',up);
}
/* Rückmeldung am Nest: nur Kind-Elemente (Leuchtring, Tipp-Hand) – nie der Nest-Container */
function fx(sel,cls){ const e=root&&root.querySelector(sel); if(!e) return; e.classList.remove(cls); void e.getBoundingClientRect(); e.classList.add(cls); }
function nestOk(){ DW.sfx('ok'); fx('#neGlow','ne-flash'); }
function nestHint(){ fx('#neGlow','ne-flash2'); fx('#neTip','ne-show'); }
const cur=()=>S.phases[S.ph]||{};
/* Der neue Auftrag wird HINTER das noch laufende Lob gesprochen (nicht hineingeredet) */
function ask(t,s){ const el=root.querySelector('#neAskT'); el.textContent=t; const a=el.parentNode; a.classList.remove('pop'); void a.offsetWidth; a.classList.add('pop'); DW.say(s||t,DW.speaking()?{queue:true}:undefined); }
/* fn erst, wenn die Stimme fertig ist (höchstens max ms warten) – sonst schneidet der nächste Satz den Wissenssatz ab */
function quiet(fn,max=10000){ const s=S, t0=performance.now(), go=()=>{ if(S!==s||!S) return; if(DW.speaking()&&performance.now()-t0<max){ GK.after(250,go); return; } fn(); }; go(); }
function bounceMama(){ const m=root.querySelector('#neMama'); m.classList.remove('ne-hop'); void m.offsetWidth; m.classList.add('ne-hop'); }
function svg(sel){ return root.querySelector(sel); }
function rnd(a,b){ return DW.rand(a,b); }

function phase(){
  GK.idle.stop();
  root.querySelector('#neProg').innerHTML=GK.progress(S.ph,S.phases.length);
  const p=cur(); if(!p.k) return hatch();
  tray();
  ask(p.ask,p.say);
  const need=needBtn();
  GK.idle.set(()=>{ if(p.k==='dig') nestHint(); else GK.pulse(needBtn()||root.querySelector('.ne-thief')); },
    ()=>DW.say(p.k==='dig'?'Tippe auf den Boden in der Mitte. So graben wir.':p.k==='guard'?'Tippe den kleinen Räuber an!':p.k==='eggs'?'Zieh ein Ei ins Nest.':`Zieh ${MAT[p.use.find(u=>S.L.mats.includes(u))].n} zum Nest!`));
  if(p.k==='guard') thief();
  void need;
}
function needBtn(){ const p=cur(); if(p.k==='eggs') return root.querySelector('.ne-eggbtn'); if(!p.use) return null; return DW.$$('#neMats .ne-mat',root).find(b=>p.use.includes(b.dataset.m)); }
/* Übergang zur nächsten Aufgabe (0,9 s): solange zählt weiteres Material nicht als Fehlversuch */
function nextPhase(){ S.ph++; S.busy=true; clearTimeout(S.pt); S.pt=GK.after(900,()=>{ if(S){ S.busy=false; phase(); } }); }

/* ---------- Materialkörbe ---------- */
function tray(){
  const t=root.querySelector('#neMats'), et=root.querySelector('#neEggTray'), p=cur(), eggs=p.k==='eggs';
  if(!t.dataset.built){
    t.dataset.built=1;
    t.innerHTML=DW.shuffle(S.L.mats).map(m=>`<button class="ne-mat" type="button" data-m="${m}">${ART.icon(MAT[m].icon)}<span>${MAT[m].n}</span></button>`).join('');
    DW.$$('.ne-mat',t).forEach(b=>{ const m=b.dataset.m; let box=null, over=false;
      DW.drag(b,{ghost:()=>ART.icon(MAT[m].icon),onTap:()=>{DW.say(MAT[m].say);},
        onStart:()=>{ box=nestBox(); over=false; },
        onMove:(x,y)=>{ const o=!!box&&inBox(x,y,box); if(o!==over){ over=o; nestOver(o); } },
        onCancel:()=>nestOver(false),
        onDrop:(x,y)=>{ nestOver(false); if(!S||!inBox(x,y,nestBox())) return false; return useMat(m,b); }}); });
    et.innerHTML=`<button class="ne-mat ne-eggbtn" type="button">${eggIcon()}<span>Eier</span><i class="ne-badge">${S.L.eggs-S.eggs}</i></button>`;
    DW.drag(et.firstChild,{ghost:()=>eggIcon(),onTap:()=>DW.say('Zieh ein Ei ins Nest!'),onDrop:(x,y)=>{ if(!S||cur().k!=='eggs'||!inBox(x,y,nestBox())) return false; placeEgg(); return true; }});
  }
  t.classList.toggle('ne-off',eggs||!p.k); et.classList.toggle('ne-on',eggs);
  DW.$$('.ne-mat',t).forEach(b=>b.classList.toggle('ne-need',!!(p.use&&p.use.includes(b.dataset.m))));
}
/* Trefferfläche des Nestes: einmal je Zug messen (nicht bei jedem Zeiger-Ereignis) */
function nestBox(){ const n=root&&root.querySelector('#neNest'); return n?n.getBoundingClientRect():null; }
function inBox(x,y,r){ return !!r&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom; }
function nestOver(on){ const g=root&&root.querySelector('#neGlow'); if(g) g.classList.toggle('ne-over',!!on); }
function eggIcon(){ const png=window.ASSETS&&ASSETS.egg?ASSETS.egg('nest','maiasaura'):null; // eigenes Bild objekte/ei_nest bzw. ei_maiasaura
  if(png) return `<svg viewBox="0 0 64 64"><image href="${png}" x="8" y="6" width="48" height="54" preserveAspectRatio="xMidYMax meet"/></svg>`;
  return `<svg viewBox="0 0 64 64"><g filter="url(#wc)"><ellipse cx="32" cy="34" rx="18" ry="23" fill="#e2cda4" stroke="#5a4630" stroke-width="2.4"/><ellipse cx="25" cy="24" rx="4" ry="6" fill="#fff" opacity=".5"/><circle cx="38" cy="40" r="2.4" fill="#b89a6a"/><circle cx="30" cy="46" r="1.8" fill="#b89a6a"/></g></svg>`; }

function useMat(m,b){
  const p=cur(), M=MAT[m];
  if(M.deco){ addDeco(m); DW.sfx('clink'); DW.say(M.say); return true; }
  if(S.busy||!p.k){ DW.sfx('pop'); return false; }   // gerade fertig geworden (Lob läuft noch) bzw. Nest ist fertig: Material fliegt einfach zurück
  if(p.k==='guard'){ DW.say('Schnell, tippe erst den kleinen Räuber an!'); GK.pulse(root.querySelector('.ne-thief')); return false; }
  if(!p.use||!p.use.includes(m)){
    S.miss++; const later=PHASES.findIndex(q=>q.use&&q.use.includes(m))>PHASES.indexOf(p);
    GK.no(b, p.k==='dig'?'Erst graben wir die Mulde. Tippe auf den Boden!':later?`${M.n} brauchen wir später. ${p.k==='eggs'?'Jetzt kommen die Eier.':'Jetzt brauchen wir '+MAT[p.use.find(u=>S.L.mats.includes(u))].n+'.'}`:`${M.n} haben wir schon genug.`);
    GK.after(700,()=>GK.pulse(needBtn())); return false; }
  const k=p.k; S.cnt[k]++;
  ({rim:addRim,bed:addBed,cover:addCover})[k](m);
  bounceMama();
  const need=S.L.need*(k==='bed'&&S.L.mats.includes('moos')?1:1);
  if(S.cnt[k]>=need){ nestOk();
    DW.say(k==='rim'?'Super, ein fester Rand! Da rollt kein Ei hinaus.':k==='bed'?'Schön weich! Jetzt kann ich meine Eier legen.':'Toll! Die Pflanzen werden warm, wie ein Komposthaufen. So bleiben die Eier kuschelig.');
    nextPhase(); }
  else DW.say(DW.pick(k==='cover'?['Noch mehr!','Die Eier müssen ganz zugedeckt sein.']:['Gut so! Noch mehr!','Prima! Weiter so!']));
  return true;
}
/* ---------- Bauen: jedes Teil verändert das Nest ---------- */
function digAt(){
  if(!S||S.dig>=S.L.dig) return;
  S.dig++; DW.sfx('dig'); bounceMama(); const tip=root.querySelector('#neTip'); if(tip) tip.classList.remove('ne-show');
  const u=S.dig/S.L.dig, R=S.R, rx=(40+u*100)*R, ry=rx*.42;
  const h=svg('#neHole'), h2=svg('#neHole2'); h.setAttribute('rx',rx); h.setAttribute('ry',ry); h2.setAttribute('rx',rx*.7); h2.setAttribute('ry',ry*.55);
  const d=svg('#neDust'); for(let i=0;i<6;i++){ const a=rnd(0,6.28); d.insertAdjacentHTML('beforeend',`<circle class="ne-dirt" cx="200" cy="140" r="${rnd(3,7).toFixed(1)}" fill="#8a6440" style="--dx:${(Math.cos(a)*rnd(60,120)).toFixed(0)}px;--dy:${(Math.sin(a)*rnd(30,60)-30).toFixed(0)}px"/>`); }
  GK.after(700,()=>{ const d2=svg('#neDust'); if(d2) d2.innerHTML=''; });
  if(S.dig>=S.L.dig){ DW.say('Eine schöne Mulde! Genau richtig für ein Nest.'); nestOk(); nextPhase(); }
  else if(S.dig===1) DW.say('Buddel, buddel! Weiter!');
}
function addRim(m){
  const u=S.cnt.rim/S.L.need, R=S.R; svg('#neRim').setAttribute('stroke-width',(8+u*18).toFixed(1));
  const g=svg('#neLumps'); const n=9;
  for(let i=0;i<n;i++){ const a=rnd(0,6.28), x=200+Math.cos(a)*158*R, y=140+Math.sin(a)*66*R;
    g.insertAdjacentHTML('beforeend', m==='zweig'?`<path class="ne-in" d="M${(x-18).toFixed(0)} ${y.toFixed(0)}l36 ${rnd(-8,8).toFixed(0)}" stroke="#6e5236" stroke-width="4" stroke-linecap="round"/>`
      :`<ellipse class="ne-in" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${rnd(8,14).toFixed(0)}" ry="${rnd(5,9).toFixed(0)}" fill="${DW.pick(['#8a6440','#7a5838','#9a724a'])}" stroke="#4a3b2a" stroke-width="1"/>`); }
  DW.sfx(m==='zweig'?'click':'thud');
}
function leaf(x,y,col,s=1,rot=0){ return `<path class="ne-in" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s})" d="M-12 0Q0 -9 12 0Q0 9 -12 0Z" fill="${col}" stroke="#4f6a3a" stroke-width="1"/>`; }
function addBed(m){
  const g=svg('#neBed'), R=S.R;
  for(let i=0;i<10;i++){ const a=rnd(0,6.28), r=Math.sqrt(Math.random()); const x=200+Math.cos(a)*r*118*R, y=142+Math.sin(a)*r*44*R;
    g.insertAdjacentHTML('beforeend', m==='moos'?`<circle class="ne-in" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rnd(6,10).toFixed(0)}" fill="#7fa66a" stroke="#4f6a3a" stroke-width="1"/>`:leaf(x,y,DW.pick(['#8fb77a','#a3c28a','#c9b56a','#7fa66a']),rnd(.9,1.4),rnd(0,180))); }
  DW.sfx('brush');
}
function slots(){ const n=S.L.eggs, R=S.R, out=[];
  const ring=(k,rx,ry,off)=>{ for(let i=0;i<k;i++){ const a=off+i/k*Math.PI*2; out.push([200+Math.cos(a)*rx,140+Math.sin(a)*ry]); } };
  if(n<=8) ring(n,82*R,32*R,.3); else { ring(8,96*R,38*R,.2); ring(n-8,40*R,15*R,.6); }
  return out.sort((a,b)=>a[1]-b[1]); }
function placeEgg(){
  const sl=slots(); if(S.eggs>=sl.length) return;
  const [x,y]=sl[S.eggs]; S.eggs++;
  svg('#neEggs').insertAdjacentHTML('beforeend',`<g class="ne-egg" transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><g class="ne-eggin">${(()=>{ const png=window.ASSETS&&ASSETS.egg?ASSETS.egg('nest','maiasaura'):null; return png?`<image href="${png}" x="-13" y="-25" width="26" height="30" preserveAspectRatio="xMidYMax meet"/>`:'<ellipse cx="0" cy="-10" rx="11" ry="14" fill="#e2cda4" stroke="#5a4630" stroke-width="2"/><ellipse cx="-4" cy="-15" rx="2.5" ry="4" fill="#fff" opacity=".5"/>'; })()}</g></g>`);
  DW.sfx('egg'); bounceMama();
  const b=root.querySelector('.ne-badge'); if(b) b.textContent=S.L.eggs-S.eggs;
  if(S.eggs>=S.L.eggs){ DW.say(`${S.L.eggs} Eier, schön im Kreis! So hat jedes Ei Platz.`); nestOk(); nextPhase(); }
  else if(S.eggs===1) DW.say('Sanft ablegen! Noch mehr Eier.');
}
function addCover(){
  const g=svg('#neCover'), R=S.R, per=Math.ceil(12/S.L.need)+2;
  for(let i=0;i<per;i++){ const a=rnd(0,6.28), r=.3+Math.random()*.8, x=200+Math.cos(a)*r*105*R, y=132+Math.sin(a)*r*40*R, rot=rnd(-60,60), s=rnd(.9,1.3);
    g.insertAdjacentHTML('beforeend',`<g class="ne-in" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s.toFixed(2)})"><path d="M-30 0Q0 -3 30 0" stroke="#4f6a3a" stroke-width="2" fill="none"/>${[...Array(6)].map((_,k)=>`<path d="M${-24+k*9} 0q-4 -10 2 -14q4 8 -2 14zM${-24+k*9} 0q-4 10 2 14q4 -8 -2 -14z" fill="${k%2?'#7fa66a':'#8fb77a'}" stroke="#4f6a3a" stroke-width=".8"/>`).join('')}</g>`); }
  DW.sfx('brush');
}
function addDeco(m){
  const g=svg('#neDeco'); const a=rnd(0,6.28), x=200+Math.cos(a)*182, y=140+Math.sin(a)*82;
  g.insertAdjacentHTML('beforeend',`<image class="ne-in" href="${DW.svgURL(ART.icon(MAT[m].icon))}" x="${(x-18).toFixed(0)}" y="${(y-24).toFixed(0)}" width="36" height="36"/>`);
}
/* ---------- Eier beschützen ---------- */
function thief(){
  const sc=root.querySelector('#neScene'); const fromR=S.thieves%2===1;
  const who=S.thiefId=DW.pick(THIEVES.filter(id=>id!==S.thiefId))||THIEVES[0];
  const t=DW.h(`<button class="ne-thief ${fromR?'ne-r':''}" type="button" aria-label="Kleiner Räuber">${DW.animalImg(who,{flip:fromR})}</button>`);
  sc.appendChild(t); GK.after(60,()=>t.classList.add('ne-in2'));
  DW.sfx('whoosh');
  let taps=0;
  t.onclick=()=>{ taps++; DW.sfx('bump'); bounceMama(); t.classList.remove('wiggle'); void t.offsetWidth; t.classList.add('wiggle');
    if(taps>=(lv===3?2:1)){ t.onclick=null; DW.roar(); t.classList.add('ne-run'); S.thieves++;
      DW.say('Geschafft! Der kleine Räuber läuft weg. Maiasaura-Eltern blieben nah beim Nest und passten gut auf.');
      GK.after(1400,()=>{ t.remove(); if(S.thieves<S.L.thief){ GK.after(1600,()=>quiet(()=>{ DW.say('Oh, da kommt noch einer!'); thief(); })); } else nextPhase(); }); }
    else DW.say('Noch einmal! Husch, husch!'); };
}
/* ---------- Schlüpfen ---------- */
function hatch(){
  GK.idle.stop(); root.querySelector('#neProg').innerHTML=GK.progress(S.phases.length,S.phases.length);
  tray(); ask('Die Babys schlüpfen!','Hör mal! Es knackt im Nest. Die Babys schlüpfen!');
  const cov=svg('#neCover'); cov.classList.add('ne-open');
  const eggs=DW.$$('.ne-egg',root), baby=DW.svgURL(ART.animal(MAMA.art,{mood:'happy',shadow:false,baby:true}));
  eggs.forEach((e,i)=>GK.after(800+i*260,()=>{ DW.sfx(i%2?'egg':'pop'); const tr=e.getAttribute('transform');
    e.innerHTML=`<path d="M-11 -6 Q0 12 11 -6 L7 -2 L3 -7 L-1 -2 L-5 -7 Z" fill="#e2cda4" stroke="#5a4630" stroke-width="1.6"/>`;
    svg('#neBabies').insertAdjacentHTML('beforeend',`<image class="ne-baby" href="${baby}" transform="${tr}" x="-30" y="-40" width="60" height="40"/>`); }));
  GK.after(1400+eggs.length*260,()=>quiet(()=>{ DW.confetti(40); DW.sfx('magic'); bounceMama(); DW.say('Hurra! Alle Babys sind geschlüpft. Maiasaura brachte ihnen Futter ins Nest – eine gute Mutter-Echse!');
    GK.after(4200,()=>quiet(end)); }));
}
function end(){
  const stars=S.miss<=1?3:S.miss<=4?2:1;
  GK.finish(root,{id:ID,stars,title:'Ein sicheres Nest!',art:GK.img(MAMA.art,{mood:'happy'}),
    say:'Danke! Du hast ein tolles Nest gebaut. Meine Babys sind sicher und warm.',again:()=>start()});
}
if(window.DW_DEBUG) window.__nestAuto=()=>{ if(!S) return; const p=cur();
  if(p.k==='dig') digAt(); else if(p.use){ const m=p.use.find(u=>S.L.mats.includes(u)); useMat(m,needBtn()); }
  else if(p.k==='eggs') placeEgg(); else if(p.k==='guard'){ const t=root.querySelector('.ne-thief'); if(t&&t.onclick) t.onclick(); } };
DW.stations[ID]={title:'Dino-Nestbau',mount,unmount(){ /* Ziehen mitten im Spiel abgebrochen: Geist-Bild entfernen */ DW.$$('body>.dragging').forEach(n=>n.remove()); if(RO){ RO.disconnect(); RO=null; } S=null;}};
})();
