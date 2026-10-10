/* =====================================================================
   DINO-INSELWELT · Station Futterwald („Was frisst der Dino?“)
   Futter zum Maul ziehen, Zähne mit der Lupe anschauen, alle satt machen.
   ===================================================================== */
(function(){
"use strict";
let root, cur=null, group='alle';
const F=()=>DW.state.feed;
const GROUPS=[{k:'alle',n:'Alle'},{k:'dino',n:'Dinos'},{k:'flug',n:'Flieger'},{k:'eis',n:'Eiszeit'},{k:'ur',n:'Urzeit'}];
/* Weitere hungrige Tiere: Futter (IDs aus DATA.FOODS) und Zähne – fachlich geprüft, Gras erst ab dem Neogen */
const FU_MORE={
  allosaurus:{eats:['fleisch','aas','kleintier'],teeth:'scharfe Sägezähne'},
  giganotosaurus:{eats:['fleisch','aas','kleintier'],teeth:'scharfe Sägezähne'},
  carnotaurus:{eats:['fleisch','kleintier','aas'],teeth:'spitze Reißzähne'},
  dilophosaurus:{eats:['fleisch','fisch','kleintier'],teeth:'spitze Reißzähne'},
  coelophysis:{eats:['kleintier','fisch','insekten'],teeth:'spitze Sägezähne'},
  compsognathus:{eats:['kleintier','insekten','eier'],teeth:'kleine spitze Zähne'},
  parasaurolophus:{eats:['blaetter','farn','zapfen'],teeth:'hunderte Mahlzähne'},
  edmontosaurus:{eats:['blaetter','zapfen','farn'],teeth:'hunderte Mahlzähne'},
  iguanodon:{eats:['farn','blaetter','zapfen'],teeth:'Schnabel und Mahlzähne'},
  protoceratops:{eats:['farn','wurzeln','blaetter'],teeth:'Papageienschnabel'},
  pachycephalosaurus:{eats:['blaetter','farn','fruechte'],teeth:'kleine Blattzähne'},
  brontosaurus:{eats:['blaetter','farn','zapfen'],teeth:'Zähne wie Stifte'},
  plateosaurus:{eats:['farn','blaetter','zapfen'],teeth:'kleine Blattzähne'},
  kentrosaurus:{eats:['farn','moos','blaetter'],teeth:'winzige Zähnchen'},
  gallimimus:{eats:['insekten','eier','fruechte'],teeth:'Schnabel ohne Zähne'},
  quetzalcoatlus:{eats:['kleintier','fisch'],teeth:'Schnabel ohne Zähne'},
  dimetrodon:{eats:['fleisch','fisch','kleintier'],teeth:'spitze Reißzähne'},
  mesohippus:{eats:['blaetter','fruechte'],teeth:'Mahlzähne'},
  smilodon:{eats:['fleisch','aas'],teeth:'zwei lange, spitze Säbelzähne'},
  megaloceros:{eats:['gras','blaetter','moos'],teeth:'große Mahlzähne'},
  wollnashorn:{eats:['gras','moos','wurzeln'],teeth:'große Mahlzähne'},
  hoehlenbaer:{eats:['fruechte','wurzeln','gras'],teeth:'breite Mahlzähne'},
  styracosaurus:{eats:['farn','blaetter','wurzeln'],teeth:'Schnabel und Mahlzähne'},
  corythosaurus:{eats:['blaetter','farn','zapfen'],teeth:'hunderte Mahlzähne'},
  mamenchisaurus:{eats:['blaetter','farn','zapfen'],teeth:'Löffelzähne'},
  argentinosaurus:{eats:['blaetter','farn','zapfen'],teeth:'Zähne wie Stifte'},
  therizinosaurus:{eats:['blaetter','fruechte','farn'],teeth:'kleine Blattzähne'},
  ceratosaurus:{eats:['fleisch','fisch','kleintier'],teeth:'scharfe Sägezähne'},
  deinonychus:{eats:['fleisch','kleintier','eier'],teeth:'scharfe Sägezähne'},
  microraptor:{eats:['kleintier','fisch','insekten'],teeth:'kleine spitze Zähne'},
  edaphosaurus:{eats:['farn','zapfen','wurzeln'],teeth:'kleine Blattzähne'},
  lystrosaurus:{eats:['farn','wurzeln','moos'],teeth:'einen Schnabel und zwei Hauer'},
  titanoboa:{eats:['fisch','kleintier'],teeth:'spitze Fangzähne'},
  hyaenodon:{eats:['fleisch','aas','kleintier'],teeth:'scharfe Reißzähne'},
  paraceratherium:{eats:['blaetter','fruechte','zapfen'],teeth:'große Mahlzähne'},
  uintatherium:{eats:['blaetter','wurzeln','fruechte'],teeth:'Mahlzähne'},
};
/* Korrekturen zu den Grunddaten: Im Jura gab es noch kein Gras; Archaeopteryx hatte keinen Schnabel, sondern Zähne im Kiefer */
const FU_FIX={diplodocus:{eats:['blaetter','farn','zapfen']},archaeopteryx:{teeth:'kleine spitze Zähne'}};
const FU_ANIMALS=DATA.FEED_ORDER.concat(Object.keys(FU_MORE).filter(id=>!DATA.FEED_ORDER.includes(id)&&DATA.animal(id)&&ART.has(DATA.animal(id).art)));
const fuA=id=>{ const a=DATA.animal(id); return Object.assign({},a,FU_MORE[id]&&!a.eats?FU_MORE[id]:{},FU_FIX[id]||{}); };
/* Ablenker im Korb: eindeutig falsches Futter (Pflanzenfresser → Fleischiges, Fleischfresser → Pflanzen),
   damit keine eigentlich passende Nahrung abgelehnt wird */
function fuWrong(a,eats){ const P=f=>f.art==='pflanze'; let c;
  if(a.food==='pflanzen') c=DATA.FOODS.filter(f=>!P(f));
  else if(a.food==='alles') c=DATA.FOODS.filter(f=>['gras','moos','aas','farn'].includes(f.id));
  else c=DATA.FOODS.filter(f=>P(f)&&f.id!=='fruechte');
  return DW.shuffle(c.filter(f=>!eats.includes(f.id))).slice(0,3); }
const grpOf=id=>{ const h=DATA.habitat(id); if(h==='luft') return 'flug'; const a=DATA.animal(id)||{}; if(a.era==='quartaer') return 'eis'; return DATA.isDino(id)?'dino':'ur'; };
const teethType=t=>/Reiß|Säge|Fang|spitz/i.test(t)?'spitz':/Schnabel ohne|zahnlos/i.test(t)?'schnabel':/Schnabel/i.test(t)?'schnabel':/Mahl/i.test(t)?'mahl':'stift';
const TEETH_SAY={spitz:'Spitze, scharfe Zähne! Damit kann man Fleisch packen und reißen. Solche Tiere fressen Fleisch.',
  stift:'Kleine, stumpfe Zähne wie Stifte oder Löffel. Damit rupft man Blätter und Pflanzen ab.',
  mahl:'Breite, flache Mahlzähne. Damit zermahlt man Gras und Pflanzen, wie mit einem Mühlstein.',
  schnabel:'Ein Schnabel! Mit einem Schnabel kann man picken und schnappen.'};

function mount(r){ root=r; pick(); }
function pick(){
  cur=null;
  const list=FU_ANIMALS.filter(id=>group==='alle'||grpOf(id)===group);
  root.innerHTML=`<div class="fill col" style="overflow:auto"><div class="tabs" style="justify-content:center">${GROUPS.map(g=>`<button data-g="${g.k}" class="${g.k===group?'on':''}" style="min-height:48px">${g.n}</button>`).join('')}</div>
    <p class="hand" style="text-align:center;font-size:26px;margin:0">Wer hat Hunger? Tippe ein Tier an!</p>
    <div class="menu">${list.map(id=>`<button class="tile" data-id="${id}"><div class="pic">${DW.animalImg(id,{})}</div><b>${DATA.nameOf(id)}</b>${F().fed[id]?`<span class="done">${ART.icon('herz')}</span>`:''}</button>`).join('')}</div></div>`;
  DW.$$('.tabs button',root).forEach(b=>b.onclick=()=>{group=b.dataset.g;DW.sfx('tap');pick();});
  DW.$$('.tile',root).forEach(t=>t.onclick=()=>{DW.sfx('pop');play(t.dataset.id);});
  DW.say('Im Futterwald haben alle Hunger! Tippe ein Tier an.');
}
function foodIcon(id){ return DW.iconImg(id); }
function play(id){
  const a=fuA(id), eats=a.eats||[];
  const tray=DW.shuffle(eats.map(e=>DATA.FOODS.find(f=>f.id===e)).concat(fuWrong(a,eats)));
  cur={id,a,fed:0,need:Math.min(3,eats.length),miss:0};
  root.innerHTML=`<div class="fu fill">
    <div class="fu-scene"><div class="fu-jungle"></div>${DW.iconImg('palme','fu-deco').replace('class="fu-deco"','class="fu-deco" style="left:3%;bottom:28%;width:18%"')}${DW.iconImg('palme','fu-deco').replace('class="fu-deco"','class="fu-deco" style="right:12%;bottom:30%;width:14%"')}${DW.iconImg('farn','fu-deco').replace('class="fu-deco"','class="fu-deco" style="left:22%;bottom:6%;width:10%"')}${DW.iconImg('farn','fu-deco').replace('class="fu-deco"','class="fu-deco" style="right:22%;bottom:4%;width:9%"')}
      <div class="fu-animal" id="fuA"><img id="fuImg" src="" alt="${a.short||a.n}"><div class="fu-mouth" id="fuMouth"></div></div>
      <div class="fu-speech card hand" id="fuSay">Ich habe Hunger!</div>
      <div class="fu-meter" id="fuMeter"></div>
      <button class="ibtn big fu-lupe" id="fuLupe" aria-label="Zähne anschauen">${ART.icon('lupe')}</button>
    </div>
    <div class="fu-tray" id="fuTray">${tray.map(f=>`<button class="fu-food" data-f="${f.id}">${foodIcon(f.id)}<span>${f.n}</span></button>`).join('')}</div></div>`;
  const imgN=DW.svgURL(ART.animal(a.art,{mood:'happy'})), imgC=DW.svgURL(ART.animal(a.art,{mood:'chew',ph:.25})), imgC2=DW.svgURL(ART.animal(a.art,{mood:'chew',ph:.75})), imgS=DW.svgURL(ART.animal(a.art,{mood:'sad'}));
  const img=root.querySelector('#fuImg'); img.src=imgN; cur.imgs={imgN,imgC,imgC2,imgS};
  meter();
  DW.$$('.fu-food',root).forEach(b=>{ const fid=b.dataset.f;
    DW.drag(b,{ghost:()=>foodIcon(fid),onTap:()=>{ DW.say(DATA.FOODS.find(f=>f.id===fid).n+'. Zieh es zum Maul!'); },
      onDrop:(x,y)=>{ const A=root&&root.querySelector('#fuA'); if(!A||!cur||!DW.hit(x,y,A)) return false; return feed(fid,b); }}); });   /* !A: mitten im Zug geschlossen */
  root.querySelector('#fuLupe').onclick=teeth;
  root.querySelector('#fuA').onclick=()=>DW.say(`Ich bin ${a.short||a.n}. Was fresse ich wohl?`);
  DW.say(`Ich bin ${cur.a.short||cur.a.n} und habe großen Hunger! Was fresse ich? Zieh mir das richtige Futter zum Maul.`);
}
function meter(){ const m=root.querySelector('#fuMeter'); m.innerHTML=[...Array(cur.need)].map((_,i)=>`<span style="opacity:${i<cur.fed?1:.25}">${ART.icon('herz',44)}</span>`).join(''); }
function say(t){ const s=root.querySelector('#fuSay'); s.textContent=t; s.classList.remove('pop'); void s.offsetWidth; s.classList.add('pop'); }
function feed(fid,btn){
  if(!cur||cur.fed>=cur.need) return false;
  const img=root.querySelector('#fuImg'), A=root.querySelector('#fuA');
  if((cur.a.eats||[]).includes(fid)){
    cur.fed++; btn.style.visibility='hidden'; btn.dataset.gone=1; DW.sfx('chew');
    let k=0; const im=cur.imgs; const t=GK.every(160,()=>{img.src=k%2?im.imgC:im.imgC2;k++; if(k>5){clearInterval(t);img.src=im.imgN;}});
    const f=DATA.FOODS.find(x=>x.id===fid); meter();
    if(cur.fed>=cur.need){ GK.after(1100,()=>{ if(cur) done(); }); say('Mmmh, satt!'); }
    else { say(DW.pick(['Mmmh, lecker!','Mampf! Mehr davon!','Yummi!'])); DW.say(`Mmmh, ${f.n}! Lecker!`); }
    return true;
  }
  cur.miss++; DW.sfx('yuck'); img.src=cur.imgs.imgS; img.classList.remove('wiggle'); void img.offsetWidth; img.classList.add('wiggle');   /* am Bild wackeln, nicht am (per transform zentrierten) Rahmen – der sprang sonst zur Seite */
  const im=cur.imgs; GK.after(900,()=>{img.src=im.imgN;});
  const meat=DATA.FOODS.find(x=>x.id===fid).art==='fleisch';
  const txt=cur.a.food==='pflanzen'&&meat?'Bäh! Ich fresse kein Fleisch. Ich mag Pflanzen!':cur.a.food!=='pflanzen'&&cur.a.food!=='alles'&&!meat?'Bäh! Pflanzen mag ich nicht.':'Bäh! Das mag ich nicht.';
  say('Bäh!'); DW.say(txt+(cur.miss>=2?' Tipp: Schau dir meine Zähne mit der Lupe an!':''));
  if(cur.miss>=2) root.querySelector('#fuLupe').classList.add('glow');
  return false;
}
function teeth(){
  DW.sfx('pop'); const tt=teethType(cur.a.teeth||'');
  const sv={spitz:'<path d="M10 20h100" stroke="#b56a5c" stroke-width="10"/>'+[0,1,2,3,4].map(i=>`<path d="M${14+i*20} 24l8 34 8-34z" fill="#fffaf0" stroke="#4a3b2a" stroke-width="2"/>`).join(''),
    stift:'<path d="M10 20h100" stroke="#b56a5c" stroke-width="10"/>'+[0,1,2,3,4,5,6].map(i=>`<rect x="${14+i*14}" y="24" width="9" height="22" rx="4" fill="#fffaf0" stroke="#4a3b2a" stroke-width="2"/>`).join(''),
    mahl:'<path d="M10 20h100" stroke="#b56a5c" stroke-width="10"/>'+[0,1,2,3].map(i=>`<path d="M${14+i*24} 24h20v18q-10 6-20 0z" fill="#fffaf0" stroke="#4a3b2a" stroke-width="2"/><path d="M${18+i*24} 32h12" stroke="#c9b88f" stroke-width="2"/>`).join(''),
    schnabel:'<path d="M14 20q60-10 94 18q-40 4-94 12z" fill="#e2b15c" stroke="#4a3b2a" stroke-width="2.4"/><path d="M14 50q50 0 90-10" stroke="#4a3b2a" stroke-width="2" fill="none"/>'}[tt];
  const m=DW.modal(`<div style="text-align:center"><h2>Zähne anschauen</h2><div class="fu-zoom"><svg viewBox="0 0 120 70" style="width:100%;height:100%">${sv}</svg></div>
    <p><b>${cur.a.short||cur.a.n}</b> hat ${cur.a.teeth}.</p><p>${TEETH_SAY[tt]}</p></div>`);
  DW.say(`${cur.a.short||cur.a.n} hat ${cur.a.teeth}. ${TEETH_SAY[tt]}`);
}
function done(){
  const first=!F().fed[cur.id]; F().fed[cur.id]=1; DW.save(); DW.discover(cur.id,true);
  const stars=cur.miss===0?3:cur.miss<=2?2:1; DW.addStars('futter',first?stars:1);
  DW.sfx('win'); DW.confetti(50); DW.addSticker('futter');
  if(DATA.FEED_ORDER.every(id=>F().fed[id])) GK.after(1500,()=>DW.addSticker('satt'));
  const m=DW.modal(`<div style="text-align:center"><div style="max-width:320px;margin:0 auto">${DW.animalImg(cur.id,{mood:'happy'})}</div><h2 style="margin:4px 0">Satt und glücklich!</h2>
    <div>${DW.starRow(stars)}</div><p>${cur.a.fact}</p><div class="row" style="justify-content:center;flex-wrap:wrap"><button class="btn go big" id="fNext">${ART.icon('pfeil_r',36)}Nächstes Tier</button><button class="btn ghost big" id="fPick">${ART.icon('futter',36)}Alle Tiere</button></div></div>`,{noclose:true});
  DW.say(`Danke! Jetzt bin ich satt. ${cur.a.fact}`);
  const ids=FU_ANIMALS, i=ids.indexOf(cur.id), nx=ids.find((x,k)=>k>i&&!F().fed[x])||ids.find(x=>!F().fed[x])||ids[(i+1)%ids.length];
  m.querySelector('#fNext').onclick=()=>{m.close();play(nx);};
  m.querySelector('#fPick').onclick=()=>{m.close();pick();};
}
function unmount(){ cur=null; const o=DW.$('#overlay'); o.hidden=true; o.innerHTML=''; }
DW.stations.futter={title:'Futterwald',mount,unmount};
})();
