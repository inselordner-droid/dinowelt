/* =====================================================================
   DINO-INSELWELT · Station Land, Luft oder Wasser? (GAME 23)
   Tiere in Himmel, Land oder Meer ziehen. Nebenbei: Flugsaurier und
   Meeresreptilien waren keine Dinosaurier.
   ===================================================================== */
(function(){
"use strict";
const ID='lufwas';
const planOf=id=>(ART.SPECIES[ART.resolve(DATA.animal(id).art)]||{}).plan;
const ZONES={luft:{n:'Luft',icon:'luft'},land:{n:'Land',icon:'land'},wasser:{n:'Wasser',icon:'meer'}};
/* Grundmenge (klare Beispiele) und knifflige Fälle mit Erklärung; ok = akzeptierte Zonen */
const EASY=['trex','triceratops','stegosaurus','brachiosaurus','ankylosaurus','parasaurolophus','mammut','pteranodon','quetzalcoatlus','meganeura','plesiosaurus','mosasaurus','megalodon','ichthyosaurus','elasmosaurus','dunkleosteus'];
/* Mittel/Schwer: alle Tiere mit eindeutigem Lebensraum aus DATA (Amphibien, Schlangen im Sumpf u. Ä. ausgenommen) */
const SEA_PLANS=['fish','plesio','swimmer','whale','turtle','ammonite','trilo','anomalo','orthocone','eurypterid'];
const NOT_CLEAR=['titanoboa','placodus','hylonomus','pulmonoscorpius'];
const TRICKY={
 spinosaurus:{ok:['land','wasser'],say:'Spinosaurus lief an Land, war aber oft im Wasser und fing dort Fische. Beides passt!'},
 archaeopteryx:{ok:['luft'],say:'Archaeopteryx hatte Federn und Flügel und konnte flattern. Er war ein Dinosaurier – ein Urvogel!'},
 microraptor:{ok:['luft'],say:'Microraptor war ein kleiner Dinosaurier mit vier gefiederten Flügeln. Er glitt von Baum zu Baum.'},
 tiktaalik:{ok:['wasser','land'],say:'Tiktaalik lebte im flachen Wasser. Mit seinen kräftigen Flossen konnte er sich schon ans Ufer stemmen.'},
 ambulocetus:{ok:['wasser','land'],say:'Ambulocetus heißt „laufender Wal“. Er schwamm im Wasser und konnte auch an Land laufen.'},
 deinosuchus:{ok:['wasser','land'],say:'Deinosuchus war ein Riesenkrokodil. Es lauerte im Wasser und kam auch ans Ufer.'},
 coelurosauravus:{ok:['luft'],say:'Coelurosauravus war eine Gleit-Echse. Mit Hautflügeln segelte sie von Baum zu Baum. Kein Dinosaurier!'},
 gastornis:{ok:['land'],say:'Gastornis war ein riesiger Vogel – aber er konnte nicht fliegen! Er lief an Land.'},
 dimetrodon:{ok:['land'],say:'Dimetrodon lief an Land. Er sieht aus wie ein Dino, war aber keiner. Er lebte sogar schon vor den Dinos.'},
 basilosaurus:{ok:['wasser'],say:'Basilosaurus war ein Urwal. Ein Säugetier, das im Meer lebte – wie Wale heute.'},
 archelon:{ok:['wasser'],say:'Archelon war die größte Meeresschildkröte aller Zeiten. Nur zum Eierlegen kam sie an Land.'},
 nothosaurus:{ok:['wasser','land'],say:'Nothosaurus jagte im Wasser und ruhte am Ufer – ein bisschen wie eine Robbe. Kein Dinosaurier!'},
};
/* Tiernamen, die normale Hauptwörter sind, brauchen einen Artikel („der Riesenhirsch lebte …“) */
const ART_DE={mammut:'das Mammut',smilodon:'die Säbelzahnkatze',megaloceros:'der Riesenhirsch',wollnashorn:'das Wollnashorn',hoehlenbaer:'der Höhlenbär',
  trilobit:'der Trilobit',ammonit:'der Ammonit',quastenflosser:'der Quastenflosser'};
const nmA=id=>ART_DE[id]||DATA.nameOf(id), cap=t=>t.charAt(0).toUpperCase()+t.slice(1);
const has=id=>DATA.animal(id)&&ART.has(DATA.animal(id).art);
const okOf=id=>TRICKY[id]?TRICKY[id].ok:(DATA.habitats?DATA.habitats(id):[DATA.habitat(id)]);
function explain(id){
  if(TRICKY[id]) return TRICKY[id].say;
  const n=cap(nmA(id)), p=planOf(id), h=DATA.habitat(id);
  if(p==='ptero') return `${n} flog durch die Luft. Ein Flugsaurier – ein Verwandter der Dinos, aber kein Dinosaurier!`;
  if(['plesio','swimmer','turtle'].includes(p)) return `${n} schwamm im Meer. Ein Meeresreptil – kein Dinosaurier!`;
  if(p==='fish') return `${n} war ein Fisch und schwamm im Wasser.`;
  if(p==='insect') return `${n} war ein Insekt und flog durch die Luft.`;
  if(p==='whale') return `${n} war ein Urwal. Wale sind Säugetiere, die im Meer leben.`;
  if(h==='wasser') return `${n} lebte im Wasser.`;
  if(DATA.isDino(id)) return `${n} lief an Land. Ein echter Dinosaurier!`;
  return `${n} lebte an Land.`;
}
const HINT={luft:'Hm. Schau mal: Hat es Flügel? Dann fliegt es durch die Luft.',wasser:'Hm. Schau mal: Hat es Flossen? Damit schwimmt man im Wasser.',land:'Hm. Schau auf die Beine. Damit läuft man an Land.'};
const LVS={1:{n:3,tricky:0},2:{n:6,tricky:1},3:{n:9,tricky:4}};
let root, lv=1, G=null;
function mount(r){ root=r; intro(); }
function intro(){
  GK.intro(root,{id:ID,title:'Land, Luft oder Wasser?',art:`<span class="lw-iart">${GK.icon('luft')}${GK.icon('land')}${GK.icon('meer')}</span>`,
    say:'Wo hat das Tier gelebt? In der Luft, an Land oder im Wasser? Zieh jedes Tier an seinen Platz!',onStart:l=>{lv=l;start();}});
}
function pickAnimals(){
  const L=LVS[lv], tr=Object.keys(TRICKY).filter(has);
  const clear=id=>{ const p=planOf(id), h=DATA.habitat(id); if(TRICKY[id]||NOT_CLEAR.includes(id)||p==='amphib') return false;
    return h==='wasser'?SEA_PLANS.includes(p):h==='luft'?['ptero','insect'].includes(p):true; };
  const easy=lv===1?EASY.filter(has):GK.pool(a=>clear(a.id)).map(a=>a.id);
  const out=GK.sample(tr,L.tricky);
  // aus jeder Zone gleich viele
  const per=Math.ceil((L.n-out.length)/3);
  ['luft','land','wasser'].forEach(z=>{ out.push(...GK.sample(easy.filter(id=>okOf(id)[0]===z),per,out)); });
  return DW.shuffle(out.slice(0,L.n));
}
function start(){
  G={list:pickAnimals(),i:0,miss:0,notDino:false};
  root.innerHTML=`<div class="lw fill">
    <div class="lw-top"><div id="lwProg"></div><button class="lw-ask card" id="lwAsk" type="button"><span class="lw-askic">${ART.icon('lautsprecher')}</span><span>Luft, Land oder Wasser?</span></button></div>
    <div class="lw-scene" id="lwScene">
      <div class="lw-zone lw-luft" data-z="luft"><span class="lw-cloud c1"></span><span class="lw-cloud c2"></span><span class="lw-sun"></span><span class="lw-zic">${ART.icon('luft')}</span><div class="lw-pl"></div></div>
      <div class="lw-zone lw-land" data-z="land"><span class="lw-hill"></span><img class="lw-palm" src="${DW.svgURL(ART.icon('palme'))}" alt=""><span class="lw-zic">${ART.icon('land')}</span><div class="lw-pl"></div></div>
      <div class="lw-zone lw-wasser" data-z="wasser"><span class="lw-wave"></span><span class="lw-wave w2"></span><span class="lw-zic">${ART.icon('meer')}</span><div class="lw-pl"></div></div>
    </div>
    <div class="lw-tray" id="lwTray"></div></div>`;
  root.querySelector('#lwAsk').onclick=()=>{DW.sfx('tap');DW.repeat();};
  next();
}
function next(){
  GK.idle.stop();
  root.querySelector('#lwProg').innerHTML=GK.progress(G.i,G.list.length);
  if(G.i>=G.list.length) return finale();
  const id=G.list[G.i], tray=root.querySelector('#lwTray');
  tray.innerHTML=`<button class="lw-animal pop" type="button" id="lwA">${DW.animalImg(id,{shadow:false})}<b>${DATA.nameOf(id)}</b></button><span class="lw-left">${G.list.length-G.i-1>0?GK.dots(Math.min(8,G.list.length-G.i-1),'fussabdruck'):''}</span>`;
  const b=tray.querySelector('#lwA'); G.wrong=0;
  const zones=DW.$$('.lw-zone',root);
  /* Trefferflächen einmal je Zug messen (nicht bei jedem Bild), Hervorheben nur beim Wechsel der Zone */
  let boxes=[], hov=null;
  const zoneAt=(x,y)=>{ const q=boxes.find(q=>x>=q.l&&x<=q.r&&y>=q.t&&y<=q.b); return q?q.z:null; };
  const hover=z=>{ if(z===hov) return; if(hov) hov.classList.remove('over'); hov=z; if(z) z.classList.add('over'); };
  DW.drag(b,{ghost:()=>DW.animalImg(id,{shadow:false}),
    onTap:()=>{ DW.sfx('tap'); DW.say(`${DATA.nameOf(id)}. Wo hat es gelebt? Zieh es hin!`); },
    onStart:()=>{ boxes=zones.map(z=>{ const r=z.getBoundingClientRect(); return {z,l:r.left,t:r.top,r:r.right,b:r.bottom}; }); hov=null; },
    onMove:(x,y)=>hover(zoneAt(x,y)),
    onCancel:()=>hover(null),
    onDrop:(x,y)=>{ hover(null); zones.forEach(z=>z.classList.remove('over')); const z=zones.find(z=>DW.hit(x,y,z)); if(!z) return false; return drop(id,z,x,y); }});
  DW.say(G.i===0?`Wo hat ${nmA(id)} gelebt? Zieh es in die Luft, aufs Land oder ins Wasser!`:`Und ${nmA(id)}?`);
  const right=okOf(id)[0];
  GK.idle.set(()=>{ if(!document.documentElement.classList.contains('dw-dragging')) GK.pulse(b); },()=>DW.say(HINT[right].replace('Hm. ','')));
  G.auto=()=>{ const z=zones.find(z=>z.dataset.z===right), r=z.getBoundingClientRect(); drop(id,z,r.left+r.width/2,r.top+r.height/2); };
}
function drop(id,z,x,y){
  const zk=z.dataset.z, ok=okOf(id);
  if(ok.includes(zk)){
    GK.ok(z); G.auto=null; GK.idle.stop();
    const r=z.getBoundingClientRect(), pl=z.querySelector('.lw-pl');
    const px=DW.clamp((x-r.left)/r.width*100,12,88), py=DW.clamp((y-r.top)/r.height*100,zk==='land'?45:22,zk==='luft'?70:82);
    const w=Math.min(r.width*.34,zk==='luft'?150:170);
    pl.insertAdjacentHTML('beforeend',`<span class="lw-put ${zk} pop" style="left:${px}%;top:${py}%;width:${w}px;--d:${DW.rand(0,2).toFixed(1)}s">${DW.animalImg(id,{shadow:false,flip:Math.random()<.5})}</span>`);
    DW.sfx(zk==='wasser'?'whoosh':zk==='luft'?'magic':'step'); DW.discover(id);
    const tx=explain(id); if(/kein Dinosaurier|keiner/.test(tx)) G.notDino=true;
    root.querySelector('#lwTray').innerHTML='';
    DW.say((G.wrong?'':DW.pick(['Richtig! ','Genau! ','Super! ']))+tx);
    G.i++; afterVoice(1800,next);
    return true;
  }
  G.miss++; G.wrong++; GK.no(z); DW.say(HINT[ok[0]]);
  if(G.wrong>=2) GK.after(500,()=>GK.pulse(DW.$$('.lw-zone',root).find(q=>q.dataset.z===ok[0])));
  return false;
}
function finale(){
  const stars=G.miss<=1?3:G.miss<=3?2:1;
  const extra='<p class="lw-note">Flugsaurier und Meeresreptilien lebten zur Zeit der Dinos – aber sie waren keine Dinosaurier!</p>';
  GK.finish(root,{id:ID,stars,title:'Alle am richtigen Platz!',art:`<span class="lw-iart">${GK.icon('luft')}${GK.icon('land')}${GK.icon('meer')}</span>`,extra,
    say:'Super sortiert! Übrigens: Flugsaurier und Meeresreptilien lebten zur Zeit der Dinos. Aber sie waren keine Dinosaurier!',again:()=>start()});
}
/* fn nach ms – aber erst, wenn die Stimme fertig ist (höchstens 12 s länger): sonst schneidet der nächste Satz den Wissenssatz ab */
function afterVoice(ms,fn){ const g=G, t0=performance.now(), go=()=>{ if(G!==g||!G) return; if(DW.speaking()&&performance.now()-t0<ms+12000){ GK.after(250,go); return; } fn(); }; GK.after(ms,go); }
if(window.DW_DEBUG) window.__lufwasAuto=()=>{ if(G&&G.auto) G.auto(); };
DW.stations[ID]={title:'Land, Luft, Wasser',mount,unmount(){ /* Ziehen mitten im Spiel abgebrochen: Geist-Bild entfernen */ DW.$$('body>.dragging').forEach(n=>n.remove()); G=null;}};
})();
