/* =====================================================================
   DINO-INSELWELT · Station Schatten-Dino (GAME 20)
   Ein Schatten zieht im Abendlicht vorbei – welches Tier ist das?
   ===================================================================== */
(function(){
"use strict";
const ID='schatten';
/* Tiere mit deutlichen Körperformen; cue = worauf man achten kann; g = Formgruppe für „ähnliche“ Ablenker */
const SH=[
 {id:'trex',g:'raub',cue:'einen riesigen Kopf und winzige Ärmchen'},
 {id:'carnotaurus',g:'raub',cue:'zwei kleine Hörner über den Augen'},
 {id:'dilophosaurus',g:'raub',cue:'zwei Kämme auf dem Kopf'},
 {id:'velociraptor',g:'raub',cue:'einen kleinen Körper und einen langen, steifen Schwanz'},
 {id:'spinosaurus',g:'segel',cue:'ein großes Segel auf dem Rücken und eine lange Schnauze'},
 {id:'dimetrodon',g:'segel',cue:'ein Segel und kurze, krumme Beine',no:'Dimetrodon war übrigens kein Dinosaurier.'},
 {id:'edaphosaurus',g:'segel',cue:'ein Segel und einen ganz kleinen Kopf',no:'Edaphosaurus war übrigens kein Dinosaurier.'},
 {id:'gallimimus',g:'hals',cue:'einen langen dünnen Hals, wie ein Strauß'},
 {id:'therizinosaurus',g:'raub',cue:'lange Krallen an den Händen'},
 {id:'triceratops',g:'horn',cue:'drei Hörner und einen großen Nackenschild'},
 {id:'styracosaurus',g:'horn',cue:'lange Stacheln am Nackenschild'},
 {id:'protoceratops',g:'horn',cue:'einen Nackenschild, aber keine langen Hörner'},
 {id:'pachyrhinosaurus',g:'horn',cue:'einen dicken Knubbel auf der Nase'},
 {id:'stegosaurus',g:'platte',cue:'große Platten auf dem Rücken'},
 {id:'kentrosaurus',g:'platte',cue:'viele spitze Stacheln auf dem Rücken'},
 {id:'ankylosaurus',g:'platte',cue:'einen flachen Panzer und eine Keule am Schwanz'},
 {id:'parasaurolophus',g:'kamm',cue:'einen langen Knochenkamm am Hinterkopf'},
 {id:'corythosaurus',g:'kamm',cue:'einen runden Kamm wie einen Helm'},
 {id:'pachycephalosaurus',g:'kamm',cue:'einen dicken, runden Dickkopf'},
 {id:'brachiosaurus',g:'hals',cue:'einen langen Hals, der nach oben zeigt'},
 {id:'diplodocus',g:'hals',cue:'einen langen Hals und einen sehr langen Schwanz'},
 {id:'pteranodon',g:'flug',cue:'große Flügel und einen spitzen Kamm',no:'Pteranodon war ein Flugsaurier – kein Dinosaurier.'},
 {id:'plesiosaurus',g:'hals',cue:'Flossen und einen langen Hals',no:'Plesiosaurus war ein Meeresreptil – kein Dinosaurier.'},
 {id:'mammut',g:'fell',cue:'einen Rüssel und lange Stoßzähne',no:'Das Mammut lebte viel später als die Dinos.',nm:'ein Mammut',pr:'Es'},
 {id:'smilodon',g:'fell',cue:'lange Säbelzähne',no:'Die Säbelzahnkatze lebte viel später als die Dinos.',nm:'eine Säbelzahnkatze',pr:'Sie'},
 /* weitere Tiere mit gut erkennbarer Form (nm = Name mit Artikel, pr = Fürwort) */
 {id:'ceratosaurus',g:'raub',cue:'ein Horn auf der Nase und scharfe Zähne'},
 {id:'edmontosaurus',g:'kamm',cue:'einen flachen Entenschnabel und keinen Kamm'},
 {id:'argentinosaurus',g:'hals',cue:'einen langen Hals und einen riesigen, dicken Bauch'},
 {id:'quetzalcoatlus',g:'flug',cue:'riesige Flügel und einen langen Schnabel',no:'Quetzalcoatlus war ein Flugsaurier – kein Dinosaurier.'},
 {id:'archaeopteryx',g:'flug',cue:'Flügel mit Federn und einen langen Schwanz',no:'Archaeopteryx war ein Urvogel – ein kleiner Dinosaurier mit Federn.'},
 {id:'meganeura',g:'flug',cue:'vier lange, dünne Flügel wie eine Libelle',no:'Meganeura war eine Riesenlibelle – ein Insekt.',pr:'Sie'},
 {id:'mosasaurus',g:'meer',cue:'eine lange Schnauze, Flossen und einen Schwanz mit Flosse',no:'Mosasaurus war ein Meeresreptil – kein Dinosaurier.'},
 {id:'ichthyosaurus',g:'meer',cue:'eine Form wie ein Delfin',no:'Ichthyosaurus war ein Meeresreptil – kein Dinosaurier.'},
 {id:'megalodon',g:'meer',cue:'eine spitze Rückenflosse, wie ein Hai',no:'Megalodon war ein riesiger Hai.'},
 {id:'archelon',g:'meer',cue:'einen runden Panzer und große Flossen',no:'Archelon war eine riesige Meeresschildkröte.'},
 {id:'dunkleosteus',g:'meer',cue:'einen dicken Panzer am Kopf',no:'Dunkleosteus war ein Panzerfisch. Er lebte lange vor den Dinos.'},
 {id:'deinosuchus',g:'meer',cue:'eine lange, breite Schnauze und kurze Beine',no:'Deinosuchus war ein Riesenkrokodil – kein Dinosaurier.'},
 {id:'wollnashorn',g:'fell',cue:'zwei Hörner auf der Nase und dickes Fell',no:'Das Wollnashorn lebte in der Eiszeit, viel später als die Dinos.',nm:'ein Wollnashorn',pr:'Es'},
 {id:'megaloceros',g:'fell',cue:'ein riesiges Geweih',no:'Der Riesenhirsch lebte in der Eiszeit, viel später als die Dinos.',nm:'ein Riesenhirsch'},
 {id:'uintatherium',g:'fell',cue:'viele Knubbel-Hörner auf dem Kopf',no:'Uintatherium war ein Säugetier. Es lebte nach den Dinos.',pr:'Es'},
 {id:'titanoboa',g:'schlange',cue:'einen sehr langen Körper ohne Beine',no:'Titanoboa war eine Riesenschlange. Sie lebte nach den Dinos.',pr:'Sie'},
 {id:'diplocaulus',g:'krabbel',cue:'einen Kopf wie ein Bumerang',no:'Diplocaulus war ein Amphibium und lebte vor den Dinos.'},
 {id:'arthropleura',g:'krabbel',cue:'ganz viele Beine',no:'Arthropleura war ein Riesen-Tausendfüßer.',pr:'Es'},
 {id:'gastornis',g:'vogel',cue:'einen riesigen Schnabel und kurze Flügel',no:'Gastornis war ein Riesenvogel. Fliegen konnte er nicht.'},
].filter(s=>DATA.animal(s.id)&&ART.has(DATA.animal(s.id).art));
/* Name mit Artikel (für Sätze) und Fürwort */
const nmOf=s=>s.nm||DATA.nameOf(s.id), prOf=s=>s.pr||'Er', cap=t=>t.charAt(0).toUpperCase()+t.slice(1);
const LVS={1:{rounds:5,n:3,cover:0,flip:0},2:{rounds:6,n:3,cover:.28,flip:.3},3:{rounds:6,n:4,cover:.4,flip:.5}};
const SKY=[['#f6c28b','#e98f6f','#8e6fa3'],['#f8d8a0','#f0a878','#b07aa0'],['#cfe0f0','#e9c9d6','#9a8fc0']];
let root, lv=1, G=null;
function mount(r){ root=r; intro(); }
function intro(){
  GK.intro(root,{id:ID,title:'Schatten-Dino',art:`<span class="sh-introsil">${GK.img('stegosaurus')}</span>${GK.img('triceratops',{mood:'happy'})}`,
    say:'Psst! Da bewegt sich ein Schatten. Welches Tier ist das? Schau genau auf die Form!',onStart:l=>{lv=l;start();}});
}
function start(){
  const L=LVS[lv]; G={L,i:0,miss:0,used:[]};
  root.innerHTML=`<div class="sh fill">
    <div class="sh-top"><div id="shProg"></div><button class="sh-ask card" id="shAsk" type="button"><span class="sh-askic">${ART.icon('lautsprecher')}</span><span id="shAskT">Wessen Schatten ist das?</span></button></div>
    <div class="sh-scene" id="shScene"></div>
    <div class="sh-choices" id="shCh"></div></div>`;
  root.querySelector('#shAsk').onclick=()=>{DW.sfx('tap');DW.repeat();};
  round();
}
function round(){
  GK.idle.stop();
  if(G.i>=G.L.rounds) return end();
  root.querySelector('#shProg').innerHTML=GK.progress(G.i,G.L.rounds);
  const pool=SH.filter(s=>!G.used.includes(s.id)); const t=DW.pick(pool); G.used.push(t.id);
  let others;
  if(lv===1) others=GK.sample(SH.filter(s=>s.g!==t.g),G.L.n-1);
  else { const sim=DW.shuffle(SH.filter(s=>s.g===t.g&&s!==t)), dif=DW.shuffle(SH.filter(s=>s.g!==t.g));
    others=(lv===3?sim.slice(0,3):sim.slice(0,1)).concat(dif).slice(0,G.L.n-1); }
  const opts=DW.shuffle([t,...others]);
  const flip=Math.random()<G.L.flip, cover=G.L.cover?G.L.cover*DW.rand(.85,1.15):0, side=DW.pick(['l','r']);
  const sky=DW.pick(SKY), a=DATA.animal(t.id);
  G.r={t,wrong:0,done:false};
  const frames=[0,.25,.5,.75].map(ph=>DW.animalImg(t.id,{ph,flip,shadow:false}).match(/src="([^"]+)"/)[1]);
  const sc=root.querySelector('#shScene');
  const hab=DATA.habitat(t.id); sc.classList.toggle('sh-sea',hab==='wasser'); sc.classList.toggle('sh-air',hab==='luft');
  sc.style.setProperty('--s1',sky[0]); sc.style.setProperty('--s2',sky[1]); sc.style.setProperty('--s3',sky[2]);
  sc.innerHTML=`<div class="sh-sun"></div><div class="sh-hills"></div>
    <div class="sh-light" id="shLight"></div>
    <div class="sh-walk ${flip?'sh-fromr':''}" id="shWalk"><img class="sh-sil" id="shSil" src="${frames[0]}" alt="Schatten" draggable="false"></div>
    ${cover?`<div class="sh-cover sh-${side}" id="shCover" style="--c:${(cover*100).toFixed(0)}%">${ART.icon(DW.pick(['farn','palme']))}${ART.icon('farn')}</div>`:''}
    <div class="sh-grass"></div>`;
  // Schatten läuft herein
  const walk=sc.querySelector('#shWalk'), sil=sc.querySelector('#shSil'); let k=0;
  const tick=GK.every(140,()=>{ if(!walk.isConnected) return; if(walk.classList.contains('sh-stop')) return; sil.src=frames[k++%4]; if(hab==='land') DW.sfx('step'); });
  GK.after(60,()=>walk.classList.add('sh-go'));
  GK.after(2300,()=>{ walk.classList.add('sh-stop'); sil.src=frames[0]; clearInterval(tick); });
  const ch=root.querySelector('#shCh'); ch.className='sh-choices n'+opts.length;
  ch.innerHTML=opts.map(o=>`<button class="gk-choice sh-card" type="button" data-id="${o.id}">${DW.animalImg(o.id,{shadow:false})}<b>${DATA.nameOf(o.id)}</b></button>`).join('');
  DW.$$('.sh-card',ch).forEach(b=>b.onclick=()=>choose(b));
  const hl=flip?(hab==='land'?` ${prOf(t)} läuft andersherum!`:` ${prOf(t)} kommt von der anderen Seite!`):'';
  DW.say(DW.pick(['Psst! Wessen Schatten ist das?','Wer versteckt sich da im Abendlicht?','Da ist ein Schatten! Welches Tier ist das?'])+(cover?' Ein Teil ist versteckt.':'')+hl);
  GK.idle.set(()=>GK.pulse(sc.querySelector('#shSil')),()=>DW.say(`Schau genau: Das Tier hat ${t.cue}.`));
  G.r.auto=()=>choose(DW.$$('.sh-card',ch).find(b=>b.dataset.id===t.id));
}
function choose(b){
  const r=G.r; if(r.done||b.classList.contains('out')) return;
  const id=b.dataset.id, t=r.t, sc=root.querySelector('#shScene');
  if(id===t.id){ r.done=true; GK.idle.stop(); GK.ok(b); b.classList.add('sh-right');
    DW.$$('.sh-card',root).forEach(x=>{ if(x!==b) x.classList.add('out'); });
    sc.querySelector('#shLight').classList.add('on'); sc.querySelector('#shWalk').classList.add('sh-lit');
    const c=sc.querySelector('#shCover'); if(c) c.classList.add('away');
    DW.sfx('magic'); DW.discover(t.id);
    const a=DATA.animal(t.id);
    DW.say(`Ja! Das ist ${nmOf(t)}. ${prOf(t)} hat ${t.cue}. ${t.no||''}`);
    G.i++;
    /* nächster Schatten erst, wenn die Stimme fertig ist (sonst wird der Wissenssatz abgeschnitten) – höchstens 12 s */
    { const g=G, t0=performance.now(), go=()=>{ if(G!==g) return; if(DW.speaking()&&performance.now()-t0<12000){ GK.after(250,go); return; } round(); }; GK.after(4600,go); }
    return; }
  G.miss++; r.wrong++; b.classList.add('out'); DW.sfx('no');
  const w=SH.find(s=>s.id===id);
  DW.say(`Hm, nicht ganz. ${cap(nmOf(w))} hat ${w.cue}. Schau noch mal auf den Schatten!`);
  if(r.wrong>=2){ sc.querySelector('#shWalk').classList.add('sh-clear'); const c=sc.querySelector('#shCover'); if(c) c.classList.add('away'); GK.after(600,()=>DW.say(`Tipp: Das Tier hat ${t.cue}.`,{queue:true})); }
}
function end(){
  const stars=G.miss<=1?3:G.miss<=4?2:1;
  GK.finish(root,{id:ID,stars,title:'Schatten-Detektiv!',art:GK.img(G.used[G.used.length-1],{mood:'happy'}),
    say:'Super! Du hast alle Schatten erkannt. Du bist ein echter Schatten-Detektiv!',again:()=>start()});
}
if(window.DW_DEBUG) window.__schattenAuto=()=>{ if(G&&G.r&&!G.r.done) G.r.auto(); };
DW.stations[ID]={title:'Schatten-Dino',mount,unmount(){G=null;}};
})();
