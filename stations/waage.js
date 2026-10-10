/* =====================================================================
   DINO-INSELWELT · Station Dino-Waage
   Modus 1: „Was ist schwerer?“ – vermuten, dann wiegen (ab 4 Jahren)
   Modus 2: „Mach die Waage gerade“ – Gewichte auflegen (ab 6 Jahren)
   ===================================================================== */
(function(){
"use strict";
let root, round=null;
const W=()=>DW.state.weigh;
const fmtKg=kg=>kg>=1000?(kg/1000).toLocaleString('de-DE')+' Tonnen':kg<1?Math.round(kg*1000)+' Gramm':kg.toLocaleString('de-DE')+' Kilo';
/* Weitere Tiere mit geschätztem Gewicht (kg, Durchschnittswerte aus der Fachliteratur) – für mehr Abwechslung */
const WG_KG={giganotosaurus:7000,carnotaurus:1500,ceratosaurus:700,herrerasaurus:250,deinonychus:75,utahraptor:500,microraptor:1,eoraptor:10,
  parasaurolophus:3000,corythosaurus:3500,edmontosaurus:4000,iguanodon:3500,pachycephalosaurus:450,protoceratops:180,styracosaurus:2700,pachyrhinosaurus:3000,
  kentrosaurus:1000,brontosaurus:15000,argentinosaurus:70000,plateosaurus:700,therizinosaurus:5000,quetzalcoatlus:250,
  smilodon:300,megaloceros:600,wollnashorn:2500,hoehlenbaer:500,titanoboa:1100,dimetrodon:250,mesohippus:30,
  // Meerestiere und Urzeit-Säuger (vorsichtige, gerundete Schätzungen)
  mosasaurus:10000,plesiosaurus:450,megalodon:50000,basilosaurus:6000,archelon:2200,deinosuchus:5000,elasmosaurus:2000,
  paraceratherium:15000,uintatherium:2000,gastornis:150,arthropleura:50};
const REFN=[['kaninchen',2],['katze',5],['kind',20],['hund',30],['erwachsener',75],['pferd',550],['auto',1500],['elefant',5000],['bus',12000]];
const NUMW=['','ein','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn'];
const ART_REF={kaninchen:'Kaninchen',katze:'Katzen',kind:'Kinder',hund:'Hunde',erwachsener:'Erwachsene',pferd:'Pferde',auto:'Autos',elefant:'Elefanten',bus:'Busse'};
const ART_ONE={kaninchen:'ein Kaninchen',katze:'eine Katze',kind:'ein Kind',hund:'ein Hund',erwachsener:'ein Erwachsener',pferd:'ein Pferd',auto:'ein Auto',elefant:'ein Elefant',bus:'ein Bus'};
function cmpFor(kg){ let best=null; REFN.forEach(([id,r])=>{ const n=Math.round(kg/r); if(n<1||n>10) return; const err=Math.abs(Math.log(kg/(n*r))); const sc=err+(n-1)*.02; if(!best||sc<best.sc) best={id,n,sc}; });
  if(!best) return ''; return 'so schwer wie '+(best.n===1?ART_ONE[best.id]:NUMW[best.n]+' '+ART_REF[best.id]); }
function weighList(){ const have=new Set(DATA.WEIGH.map(w=>w.id));
  return DATA.WEIGH.concat(Object.entries(WG_KG).filter(([id])=>!have.has(id)&&DATA.animal(id)&&ART.has(DATA.animal(id).art)).map(([id,kg])=>({id,kg:DATA.animal(id).kg||kg,cmp:cmpFor(DATA.animal(id).kg||kg)}))); }
const derOf=id=>({mammut:'das',wollnashorn:'das',smilodon:'die',titanoboa:'die'})[id]||'der';
const proOf=id=>({der:'er',die:'sie',das:'es'})[derOf(id)];
const DerOf=id=>{const d=derOf(id);return d[0].toUpperCase()+d.slice(1);};
const DENOMS=kg=>kg<=5?[1,2,5]:kg<=40?[1,5,10,20]:kg<=500?[50,100,200]:kg<=8000?[500,1000,2000,5000]:[1000,5000,10000];

function mount(r){ root=r; menu(); if(window.DW_DEBUG) window.__waage={get round(){return round;},weighList}; }
function menu(){
  root.innerHTML=`<div class="fill center col" style="gap:18px;padding:16px;overflow:auto">
    <div class="wg-hero">${scaleHTML('<div class="wg-item">'+DW.animalImg('stegosaurus',{})+'</div>','<div class="wg-item">'+thingImg('elefant')+'</div>')}</div>
    <div class="menu" style="padding:0">
      <button class="tile" id="wgM1" style="width:min(300px,41vw)"><div class="pic">${ART.icon('waage',100)}</div><b>Was ist schwerer?</b><small>Raten und wiegen</small></button>
      <button class="tile" id="wgM3" style="width:min(300px,41vw)"><div class="pic">${DW.animalImg('triceratops',{})}</div><b>Wie schwer ist er wohl?</b><small>Schätzen und prüfen</small></button>
      <button class="tile" id="wgM2" style="width:min(300px,41vw)"><div class="pic">${weightHTML(100,true)}</div><b>Mach die Waage gerade</b><small>Gewichte auflegen · Stufe ${W().level}</small></button>
    </div></div>`;
  {const sc0=root.querySelector('.wg-scale'); requestAnimationFrame(()=>tilt(sc0,.2));}
  root.querySelector('#wgM1').onclick=()=>{DW.sfx('tap');startGuess();};
  root.querySelector('#wgM2').onclick=()=>{DW.sfx('tap');startBalance();};
  root.querySelector('#wgM3').onclick=()=>{DW.sfx('tap');startEstimate();};
  DW.say('Willkommen an der Dino-Waage! Was möchtest du spielen?');
}
function thingImg(id){ const t=DATA.THINGS.find(x=>x.id===id); return t?DW.iconImg(t.icon):DW.animalImg(id,{}); }
const refItem=id=>{ const t=DATA.THINGS.find(x=>x.id===id); if(t) return {kind:'thing',id,kg:t.kg,n:t.n}; const a=DATA.animal(id); return {kind:'pet',id,kg:a.kg,n:a.n}; };
const artikel=it=>({kaninchen:'ein Kaninchen',katze:'eine Katze',hund:'ein Hund',pferd:'ein Pferd',giraffe:'eine Giraffe',elefant:'ein Elefant',kind:'ein Kind',erwachsener:'ein Erwachsener',auto:'ein Auto',bus:'ein Bus'})[it.id]||it.n;
function scaleHTML(left,right){
  return `<div class="wg-scale"><div class="wg-post"></div><div class="wg-base"></div>
    <div class="wg-beam"></div>
    <div class="wg-pan L"><svg class="wg-strings" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 0L6 100M50 0L94 100" stroke="#7a5a3a" stroke-width="2" vector-effect="non-scaling-stroke" fill="none"/></svg><div class="wg-load">${left}</div><div class="wg-dish"></div></div>
    <div class="wg-pan R"><svg class="wg-strings" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 0L6 100M50 0L94 100" stroke="#7a5a3a" stroke-width="2" vector-effect="non-scaling-stroke" fill="none"/></svg><div class="wg-load">${right}</div><div class="wg-dish"></div></div></div>`;
}
function tilt(sc,v){ // v: -1 (links schwer) .. +1 (rechts schwer)
  if(!sc||!sc.isConnected) return; sc._v=v; watch(sc); const a=DW.clamp(v,-1,1)*14; const beam=sc.querySelector('.wg-beam'); beam.style.transform=`translateX(-50%) rotate(${a}deg)`;
  const w=beam.offsetWidth/2, dy=Math.sin(a*Math.PI/180)*w; sc.querySelector('.wg-pan.L').style.transform=`translateY(${-dy}px)`; sc.querySelector('.wg-pan.R').style.transform=`translateY(${dy}px)`;
}
/* Die Schalen hängen in Pixeln am Balken: ändert sich die Größe der Waage (Drehen, Fenster, Text darunter), neu ausrichten */
let wgRO=null;
function watch(sc){ if(sc._w||!window.ResizeObserver) return; sc._w=1; if(wgRO) wgRO.disconnect();
  let w0=sc.offsetWidth; wgRO=new ResizeObserver(()=>{ if(!sc.isConnected){ wgRO.disconnect(); wgRO=null; return; } const w=sc.offsetWidth; if(Math.abs(w-w0)<1) return; w0=w; if(sc._v!=null) tilt(sc,sc._v); }); wgRO.observe(sc); }
function weightHTML(kg,big){ const h=big?90:Math.round(DW.clamp(30+Math.log10(kg+1)*14,34,90)); const w=Math.round(h*1.05);
  return `<div class="wg-w" style="width:${w}px;height:${h}px"><svg viewBox="0 0 100 90" width="${w}" height="${h}"><path d="M40 6h20v10H40z" fill="#8a7e6c" stroke="#4a3b2a" stroke-width="2"/><path d="M18 18h64l14 66H4z" fill="#7d8791" stroke="#4a3b2a" stroke-width="2.4" stroke-linejoin="round"/><path d="M24 24h14l-8 54H14z" fill="#fff" opacity=".18"/></svg><span>${kg>=1000?(kg/1000)+' t':kg+' kg'}</span></div>`; }

/* ---------------- Modus 1: Was ist schwerer? ---------------- */
function pool(){ return weighList().map(w=>({kind:'animal',id:w.id,kg:w.kg,n:DATA.nameOf(w.id),cmp:w.cmp})).concat(DATA.THINGS.map(t=>({kind:'thing',id:t.id,kg:t.kg,n:t.n})),DATA.PETS.map(id=>({kind:'pet',id,kg:DATA.animal(id).kg,n:DATA.animal(id).n,cmp:DATA.animal(id).fact}))); }
function startGuess(){
  round={mode:1,i:0,n:8,right:0,pairs:[]};
  const P=pool();
  for(let k=0;k<round.n;k++){ let a,b; do{ a=DW.pick(P); b=DW.pick(P);}while(a===b||a.kg===b.kg||Math.max(a.kg,b.kg)/Math.min(a.kg,b.kg)<1.8||!(a.kind==='animal'||b.kind==='animal')); round.pairs.push(Math.random()<.5?[a,b]:[b,a]); }
  nextGuess();
}
function itemHTML(it){ return `<div class="wg-item">${it.kind==='thing'?thingImg(it.id):DW.animalImg(it.id,{})}</div>`; }
function nextGuess(){
  if(round.i>=round.n) return finish();
  const [a,b]=round.pairs[round.i];
  root.innerHTML=`<div class="fill col wg-round" style="align-items:center;padding:8px 12px;gap:6px">
    <div class="row">${[...Array(round.n)].map((_,i)=>`<span style="width:14px;height:14px;border-radius:50%;background:${i<round.i?'#8fbf7a':i===round.i?'#f0c35a':'rgba(160,130,90,.25)'}"></span>`).join('')}</div>
    <h2 class="hand" style="font-size:34px;margin:0">Was ist schwerer?</h2>
    <div class="wg-stage">${scaleHTML(itemHTML(a),itemHTML(b))}</div>
    <div class="row" style="gap:18px;flex-wrap:wrap;justify-content:center"><button class="btn big warm" id="gA">${a.n}</button><span class="hand" style="font-size:26px">oder</span><button class="btn big plum" id="gB">${b.n}</button></div>
    <p id="gMsg" class="hand wg-msg" style="font-size:24px;margin:4px;text-align:center"></p>
    <button class="btn go big wg-next" id="gNext" data-wait="1" style="visibility:hidden">${ART.icon('pfeil_r',36)}Weiter</button></div>`;
  const sc=root.querySelector('.wg-scale'); tilt(sc,0);
  const pick=(isA)=>{ DW.$$('#gA,#gB',root).forEach(b=>b.disabled=true);
    const heavyA=a.kg>b.kg, ok=isA===heavyA; const r=Math.log10(b.kg/a.kg); DW.sfx('thud');
    GK.after(200,()=>{ tilt(sc,DW.clamp(r/1.2,-1,1)*(Math.abs(r)<.2?.5:1)); });
    const H=heavyA?a:b, L=heavyA?b:a;
    const txt=`${ok?'Richtig! ':'Oh, knapp daneben! '}${H.n} wiegt ${fmtKg(H.kg)}${H.cmp&&H.kind==='animal'?', '+H.cmp:''}. ${L.n} wiegt ${fmtKg(L.kg)}.`;
    GK.after(1100,()=>{ if(!root.querySelector('#gMsg')) return; root.querySelector('#gMsg').textContent=txt; DW.say(txt); if(ok){round.right++;DW.sfx('ok');} else DW.sfx('no');
      if(a.kind==='animal')DW.discover(a.id,true); if(b.kind==='animal')DW.discover(b.id,true);
      const nb=root.querySelector('#gNext'); nb.style.visibility=''; delete nb.dataset.wait; nb.onclick=()=>{ if(!round) return; DW.sfx('tap');round.i++;nextGuess(); GK.shield(root,450);}; });
  };
  root.querySelector('#gA').onclick=()=>pick(true); root.querySelector('#gB').onclick=()=>pick(false);
  DW.$$('.wg-load',root).forEach((el,i)=>el.onclick=()=>DW.say([a,b][i].n));
  DW.say(`Was ist schwerer: ${a.n} oder ${b.n}?`);
}

/* ---------------- Modus 3: Wie schwer ist er wohl? ---------------- */
function startEstimate(){
  // nur Tiere, zu denen es einen wirklich passenden Vergleich gibt (höchstens Faktor 1,8 daneben)
  const refs=DATA.REFS.map(refItem), fit=w=>refs.some(r=>Math.abs(Math.log10(r.kg/w.kg))<=Math.log10(1.8));
  round={mode:3,i:0,n:6,right:0,list:DW.shuffle(weighList().filter(fit)).slice(0,6)};
  nextEstimate();
}
function nextEstimate(){
  if(round.i>=round.n) return finish();
  const w=round.list[round.i], refs=DATA.REFS.map(refItem);
  const best=refs.slice().sort((a,b)=>Math.abs(Math.log10(a.kg/w.kg))-Math.abs(Math.log10(b.kg/w.kg)))[0];
  const others=DW.shuffle(refs.filter(r=>Math.abs(Math.log10(r.kg/best.kg))>=.9)).slice(0,2);
  const opts=DW.shuffle([best,...others]);
  root.innerHTML=`<div class="fill col wg-round" style="align-items:center;padding:8px 12px;gap:6px">
    <div class="row">${[...Array(round.n)].map((_,i)=>`<span style="width:14px;height:14px;border-radius:50%;background:${i<round.i?'#8fbf7a':i===round.i?'#f0c35a':'rgba(160,130,90,.25)'}"></span>`).join('')}</div>
    <h2 class="hand" style="font-size:32px;margin:0;text-align:center">Wie schwer ist ${derOf(w.id)} ${DATA.nameOf(w.id)} wohl?</h2>
    <div class="wg-stage">${scaleHTML(`<div class="wg-item">${DW.animalImg(w.id,{})}</div>`,'<div class="wg-item" id="esR"></div>')}</div>
    <p class="hand" style="font-size:22px;margin:0">${proOf(w.id)==='er'?'Er':proOf(w.id)==='sie'?'Sie':'Es'} ist ungefähr so schwer wie …</p>
    <div class="row" style="gap:12px;flex-wrap:wrap;justify-content:center">${opts.map((o,j)=>`<button class="tile es-opt" data-j="${j}" style="width:150px"><div class="pic" style="height:80px">${o.kind==='thing'?thingImg(o.id):DW.animalImg(o.id,{})}</div><b style="font-size:20px">${artikel(o)}</b></button>`).join('')}</div>
    <p id="esMsg" class="hand wg-msg" style="font-size:22px;margin:0;text-align:center"></p>
    <button class="btn go big wg-next" id="esNext" data-wait="1" style="visibility:hidden">${ART.icon('pfeil_r',36)}Weiter</button></div>`;
  const sc=root.querySelector('.wg-scale'); tilt(sc,-1);
  DW.$$('.es-opt',root).forEach(b=>b.onclick=()=>{
    const o=opts[+b.dataset.j]; DW.$$('.es-opt',root).forEach(x=>x.disabled=true);
    root.querySelector('#esR').innerHTML=o.kind==='thing'?thingImg(o.id):DW.animalImg(o.id,{}); DW.sfx('thud');
    const r=Math.log10(o.kg/w.kg); GK.after(200,()=>tilt(sc,Math.abs(r)<.25?0:DW.clamp(r,-1,1)));
    const ok=o===best; if(ok) round.right++;
    const txt=ok?`Gut geschätzt! ${DerOf(w.id)} ${DATA.nameOf(w.id)} wiegt ${fmtKg(w.kg)}${w.cmp?', '+w.cmp:''}.`:`${o.kg>w.kg?'Zu schwer':'Zu leicht'} geschätzt! ${DerOf(w.id)} ${DATA.nameOf(w.id)} wiegt ${fmtKg(w.kg)}. Das ist ungefähr so schwer wie ${artikel(best)}.`;
    GK.after(1000,()=>{ if(!root.querySelector('#esMsg')) return; root.querySelector('#esMsg').textContent=txt; DW.say(txt); DW.sfx(ok?'ok':'no'); b.classList.add(ok?'sel':'wiggle'); DW.discover(w.id,true);
      const nb=root.querySelector('#esNext'); nb.style.visibility=''; delete nb.dataset.wait; nb.onclick=()=>{ if(!round) return; DW.sfx('tap');round.i++;nextEstimate(); GK.shield(root,450);}; });
  });
  DW.say(`Wie schwer ist ${derOf(w.id)} ${DATA.nameOf(w.id)} wohl? Ist ${proOf(w.id)} so schwer wie ${opts.map(artikel).join(', wie ')}?`);
}

/* ---------------- Modus 2: Waage gerade machen ---------------- */
function startBalance(){
  const lv=W().level; const list=weighList().filter(w=>w.kg%Math.min(...DENOMS(w.kg))===0).filter(w=>lv<=2?w.kg<=40:lv<=4?w.kg<=6000:true);
  round={mode:2,i:0,n:5,right:0,list:DW.shuffle(list).slice(0,5),fails:0};
  nextBalance();
}
function nextBalance(){
  if(round.i>=round.n) return finish();
  const w=round.list[round.i], den=DENOMS(w.kg); round.on=[]; round.solved=false;
  root.innerHTML=`<div class="fill col wg-round" style="align-items:center;padding:8px 12px;gap:6px">
    <div class="row">${[...Array(round.n)].map((_,i)=>`<span style="width:14px;height:14px;border-radius:50%;background:${i<round.i?'#8fbf7a':i===round.i?'#f0c35a':'rgba(160,130,90,.25)'}"></span>`).join('')}</div>
    <h2 class="hand" style="font-size:30px;margin:0;text-align:center">Mach die Waage gerade!</h2>
    <div class="wg-stage">${scaleHTML(`<div class="wg-item">${DW.animalImg(w.id,{})}</div>`,'<div class="wg-stack" id="wgStack"></div>')}</div>
    <div class="row wg-bar" style="gap:14px"><span class="pill" id="wgSum">0 kg</span><button class="btn ghost" id="wgClear">${ART.icon('radierer',30)}Leeren</button><button class="btn ghost" id="wgHint">${ART.icon('lupe',30)}Tipp</button></div>
    <div class="wg-tray" id="wgTray">${den.map(k=>`<button class="wg-src" data-kg="${k}">${weightHTML(k)}</button>`).join('')}</div>
    <p class="hand" style="font-size:20px;margin:0;color:var(--ink2)">Zieh Gewichte auf die rechte Schale. Antippen legt sie auch drauf.</p></div>`;
  const sc=root.querySelector('.wg-scale'); update();
  const add=kg=>{ if(round.solved) return; round.on.push(kg); DW.sfx('clink'); update(); };
  DW.$$('.wg-src',root).forEach(b=>{ const kg=+b.dataset.kg;
    DW.drag(b,{ghost:()=>weightHTML(kg),onTap:()=>add(kg),onDrop:(x,y)=>{ const pan=root&&root.querySelector('.wg-pan.R'); if(!pan||!round) return false;   /* Station wurde mitten im Zug geschlossen/neu aufgebaut */
      const pr=pan.getBoundingClientRect(), sr=root.querySelector('.wg-scale').getBoundingClientRect(); if(DW.hit(x,y,pan)||(x>sr.left+sr.width*.5&&y<pr.bottom+40)){ add(kg); return true;} return false; }}); });
  root.querySelector('#wgClear').onclick=()=>{ if(round.solved) return; round.on=[];DW.sfx('pop');update();};
  root.querySelector('#wgHint').onclick=()=>{ const s=round.on.reduce((a,b)=>a+b,0); DW.say(s<w.kg?'Die Seite mit dem Dino ist noch schwerer. Leg mehr Gewichte dazu!':s>w.kg?'Jetzt ist die rechte Seite zu schwer. Tippe ein Gewicht auf der Schale an, um es wegzunehmen.':'Perfekt!'); };
  root.querySelector('.wg-pan.L .wg-load').onclick=()=>DW.say(`${DATA.nameOf(w.id)}. Wie schwer ist ${proOf(w.id)} wohl?`);
  DW.say(`Wie schwer ist ${derOf(w.id)} ${DATA.nameOf(w.id)}? Leg Gewichte auf die andere Seite, bis die Waage gerade ist.`);
  function update(){
    const s=round.on.reduce((a,b)=>a+b,0), st=root.querySelector('#wgStack');
    st.innerHTML=round.on.map((k,i)=>`<button class="wg-on" data-i="${i}">${weightHTML(k)}</button>`).join('');
    DW.$$('.wg-on',st).forEach(b=>b.onclick=e=>{e.stopPropagation(); if(round.solved) return; round.on.splice(+b.dataset.i,1);DW.sfx('pop');update();});
    root.querySelector('#wgSum').textContent=s.toLocaleString('de-DE')+' kg';
    const r=s===0?-1:Math.log10(s/w.kg); tilt(sc,s===w.kg?0:DW.clamp(r*1.6,-1,1)*(Math.abs(r)<.05?.3:1));
    if(s===w.kg&&!round.solved){ round.solved=true; DW.sfx('ok'); DW.confetti(30); round.right++;
      const txt=`Die Waage ist gerade! ${DerOf(w.id)} ${DATA.nameOf(w.id)} wiegt ${fmtKg(w.kg)}${w.cmp?', '+w.cmp:''}.`; DW.say(txt); DW.discover(w.id,true);
      DW.$$('.wg-src',root).forEach(b=>b.style.pointerEvents='none');
      const nb=DW.h(`<button class="btn go big">${ART.icon('pfeil_r',36)}Weiter</button>`); nb.onclick=()=>{ if(nb.dataset.wait) return; DW.sfx('tap');round.i++;nextBalance(); GK.shield(root,450);};
      // Der Knopf erscheint dort, wo eben ein Gewicht angetippt wurde: kurz sperren, sonst „klickt“ derselbe Fingertipp gleich weiter
      nb.dataset.wait='1'; GK.after(600,()=>{ delete nb.dataset.wait; });
      const tray=root.querySelector('#wgTray'); tray.classList.add('wg-solved'); tray.appendChild(nb); }
  }
}

function finish(){
  const pct=round.right/round.n, stars=pct>=.9?3:pct>=.6?2:1;
  DW.addStars('waage',stars); DW.sfx('win'); DW.confetti();
  if(round.mode===2&&stars>=2){ W().level=Math.min(6,W().level+1); W().done++; DW.save(); if(W().done>=2) DW.addSticker('waage'); }
  if(round.mode!==2&&stars===3) DW.addSticker('waage');
  const m=DW.modal(`<div style="text-align:center"><h2 style="margin:0">Toll gewogen!</h2><div style="margin:8px 0">${DW.starRow(stars)}</div>
    <p>${round.right} von ${round.n} geschafft.</p><div class="row" style="justify-content:center;flex-wrap:wrap"><button class="btn go big" id="wAgain">${ART.icon('pfeil_r',36)}Nochmal</button><button class="btn ghost big" id="wMenu">${ART.icon('waage',36)}Anderes Spiel</button></div></div>`,{noclose:true});
  DW.say(`Toll gewogen! Du hast ${round.right} von ${round.n} geschafft.`);
  const mode=round.mode;
  GK.shield(m.querySelector('#wAgain').parentElement,700);   // Doppeltipp auf das letzte „Weiter“ darf nicht gleich „Nochmal“ treffen
  m.querySelector('#wAgain').onclick=()=>{m.close(); mode===1?startGuess():mode===3?startEstimate():startBalance();};
  m.querySelector('#wMenu').onclick=()=>{m.close(); menu();};
}
function unmount(){ round=null; delete window.__waage; if(wgRO){ wgRO.disconnect(); wgRO=null; } const o=DW.$('#overlay'); o.hidden=true; o.innerHTML=''; }
DW.stations.waage={title:'Dino-Waage',mount,unmount};
})();
