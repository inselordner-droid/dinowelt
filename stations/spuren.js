/* =====================================================================
   DINO-INSELWELT · GAME 01 „Die Spurensuche“
   Fußspuren führen über den Dschungelpfad zu Büschen. Das Kind folgt einer
   Spur (tippen oder mit dem Finger darüberwischen). Am Busch: Wer war das?
   Leicht: 3 Spuren, 2 Antworten, sehr verschiedene Füße.
   Mittel: 3 Spuren, 3 Antworten.
   Schwer: 4 Spuren, teilweise verdeckt, 4 Antworten mit ähnlichen Füßen.
   ===================================================================== */
(function(){
"use strict";
const ID='spuren';

/* ---------- Spieldaten: Fußtypen ----------
   fam: zwei = Zweibeiner, vier = Vierbeiner (für „ähnliche“ Ablenker)
   Die Fährten richten sich nach echten Fossilspuren:
   Theropoden (Grallator/Eubrontes), Dromaeosaurier (zweizehig!),
   Ornithopoden (Iguanodontipus), Sauropoden (Brontopodus), Ceratopsier
   (Ceratopsipes), Thyreophoren (Deltapodus/Tetrapodosaurus). */
const FEET={
  raub:  {fam:'zwei',say:'Drei lange Zehen mit spitzen Krallen. So eine Spur macht ein großer Fleischfresser.'},
  raptor:{fam:'zwei',say:'Nur zwei Zehen im Boden! Die große Sichelkralle hielt er beim Laufen hoch.'},
  klein: {fam:'zwei',say:'Drei dünne Zehen und ganz klein, fast wie bei einem Vogel.'},
  stumpf:{fam:'zwei',say:'Drei breite, runde Zehen, wie ein Kleeblatt. Das war ein Pflanzenfresser.'},
  rund:  {fam:'vier',say:'Ein riesiger runder Fuß und vorne eine Hand wie ein Hufeisen. Ein Langhals!'},
  horn:  {fam:'vier',say:'Hinten vier kurze Zehen und vorne fünf Finger. Er lief auf vier Beinen.'},
  panzer:{fam:'vier',say:'Breite Füße mit drei kurzen, dicken Zehen. Er lief auf vier Beinen.'},
  // Urzeit-Säugetiere und Segelechsen (mehr Abwechslung)
  pfote: {fam:'vier',say:'Vier runde Zehenballen und keine Krallen. So schleicht eine große Katze.'},
  baer:  {fam:'vier',say:'Eine breite Sohle und fünf Zehen mit langen Krallen. So eine Spur macht ein Bär.'},
  huf:   {fam:'vier',say:'Zwei schmale Hufhälften nebeneinander. So eine Spur machen Hirsche.'},
  elefant:{fam:'vier',say:'Ein großer, runder Fuß mit kleinen Zehennägeln vorne. Wie bei einem Elefanten.'},
  echse: {fam:'vier',say:'Fünf dünne, gespreizte Zehen mit Krallen, wie bei einer Echse.'},
};
const SP_FOOT={trex:'raub',allosaurus:'raub',giganotosaurus:'raub',carnotaurus:'raub',ceratosaurus:'raub',dilophosaurus:'raub',
  velociraptor:'raptor',deinonychus:'raptor',utahraptor:'raptor',
  compsognathus:'klein',coelophysis:'klein',archaeopteryx:'klein',eoraptor:'klein',
  iguanodon:'stumpf',parasaurolophus:'stumpf',edmontosaurus:'stumpf',corythosaurus:'stumpf',
  brachiosaurus:'rund',diplodocus:'rund',brontosaurus:'rund',argentinosaurus:'rund',mamenchisaurus:'rund',
  triceratops:'horn',styracosaurus:'horn',protoceratops:'horn',pachyrhinosaurus:'horn',
  stegosaurus:'panzer',kentrosaurus:'panzer',ankylosaurus:'panzer',
  herrerasaurus:'raub',microraptor:'raptor',pachycephalosaurus:'stumpf',
  smilodon:'pfote',hoehlenbaer:'baer',megaloceros:'huf',mammut:'elefant',dimetrodon:'echse',edaphosaurus:'echse',
  entelodon:'huf',gorgonops:'echse',scutosaurus:'echse'};
const EASY_IDS=['trex','velociraptor','compsognathus','parasaurolophus','brachiosaurus','diplodocus','triceratops','stegosaurus','ankylosaurus','iguanodon','mammut','smilodon','megaloceros'];
const LV={1:{trails:3,ans:2,hide:0},2:{trails:3,ans:3,hide:0},3:{trails:4,ans:4,hide:.4}};

/* ---------- Fußabdrücke zeichnen (100×100, Zehen nach oben) ---------- */
const f1=v=>Math.round(v*10)/10;
function toe(bx,by,tx,ty,w,tip){
  const dx=tx-bx,dy=ty-by,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux,h=w/2;
  const p=(a,b)=>f1(bx+ux*a+nx*b)+','+f1(by+uy*a+ny*b);
  if(tip==='sharp') return `M${p(0,h)}Q${p(L*.35,h*1.08)} ${p(L*.62,h*.72)}Q${p(L*.84,h*.42)} ${p(L,0)}Q${p(L*.84,-h*.42)} ${p(L*.62,-h*.72)}Q${p(L*.35,-h*1.08)} ${p(0,-h)}Z`;
  return `M${p(0,h)}Q${p(L*.5,h*1.12)} ${p(L-h*.9,h*.95)}Q${p(L+h*.15,h*.8)} ${p(L,0)}Q${p(L+h*.15,-h*.8)} ${p(L-h*.9,-h*.95)}Q${p(L*.5,-h*1.12)} ${p(0,-h)}Z`;
}
const claw=(bx,by,tx,ty)=>{const dx=tx-bx,dy=ty-by,L=Math.hypot(dx,dy);return `M${f1(tx-dx/L*7)},${f1(ty-dy/L*7)}L${f1(tx+dx/L*3)},${f1(ty+dy/L*3)}`;};
const ell=(cx,cy,rx,ry)=>`M${cx-rx},${cy}a${rx},${ry} 0 1,0 ${rx*2},0a${rx},${ry} 0 1,0 ${-rx*2},0Z`;
function footShapes(t){
  let d='',c='';
  const T=(a,b,x,y,w,tip)=>{d+=toe(a,b,x,y,w,tip); if(tip==='sharp') c+=claw(a,b,x,y);};
  switch(t){
    case 'raub': d+=ell(50,72,15,13); T(50,66,50,8,15,'sharp'); T(45,70,19,27,13,'sharp'); T(55,70,81,27,13,'sharp'); break;
    case 'klein': d+=ell(50,72,8,7); T(50,69,50,16,8,'sharp'); T(47,71,25,33,7,'sharp'); T(53,71,75,33,7,'sharp'); T(49,76,43,94,5,'sharp'); break;
    case 'raptor': d+=ell(53,72,12,12)+ell(37,58,6,7); T(53,66,57,8,17,'sharp'); T(61,68,86,24,16,'sharp'); break;
    case 'stumpf': d+=ell(50,72,22,17); T(50,64,50,14,22,'blunt'); T(41,68,17,35,19,'blunt'); T(59,68,83,35,19,'blunt'); break;
    case 'rund': d+=`M50,36C74,36 80,58 78,72C76,90 62,97 50,97C36,97 22,90 21,72C20,56 28,36 50,36Z`+ell(33,45,4,5)+ell(43,40,4,5)+ell(55,40,4,5)
      +`M22,26Q50,-4 78,26Q76,33 68,31Q50,14 32,31Q24,33 22,26Z`; break;
    case 'horn': d+=ell(50,74,20,15); T(40,68,26,48,11,'blunt'); T(47,64,44,42,11,'blunt'); T(55,64,59,42,11,'blunt'); T(61,68,74,50,10,'blunt');
      d+=ell(50,26,14,9)+ell(35,19,4.5,5)+ell(42,13,4.5,5)+ell(50,11,4.5,5)+ell(58,13,4.5,5)+ell(65,19,4.5,5); break;
    case 'panzer': d+=ell(50,74,23,15); T(41,68,28,48,15,'blunt'); T(50,65,50,42,16,'blunt'); T(59,68,72,48,15,'blunt');
      d+=ell(50,24,17,9)+ell(35,18,4,4)+ell(42,15,4,4)+ell(50,14,4,4)+ell(58,15,4,4)+ell(65,18,4,4); break;
    case 'pfote': d+=`M50,56C64,56 74,66 72,78C70,88 62,86 58,90C54,94 46,94 42,90C38,86 30,88 28,78C26,66 36,56 50,56Z`
      +ell(27,44,7,9)+ell(40,33,7,9.5)+ell(60,33,7,9.5)+ell(73,44,7,9); break;
    case 'baer': d+=`M50,40C66,40 74,52 72,68C70,86 62,96 50,96C38,96 30,86 28,68C26,52 34,40 50,40Z`
      +ell(27,34,6,7)+ell(37,26,6,7)+ell(50,23,6,7)+ell(63,26,6,7)+ell(73,34,6,7);
      [[27,27,23,15],[37,19,35,7],[50,16,50,4],[63,19,65,7],[73,27,77,15]].forEach(([a,b,x,y])=>{c+=`M${a},${b}L${x},${y}`;}); break;
    case 'huf': d+=`M47,86Q31,82 33,46Q35,18 45,20Q50,38 48,86Z`+`M53,86Q69,82 67,46Q65,18 55,20Q50,38 52,86Z`+ell(38,95,3.5,3)+ell(62,95,3.5,3); break;
    case 'elefant': d+=ell(50,60,31,33)+ell(27,31,6,5)+ell(41,24,6,5)+ell(59,24,6,5)+ell(73,31,6,5); break;
    case 'echse': d+=ell(50,72,11,10); T(50,66,50,16,7,'sharp'); T(46,68,24,28,6.5,'sharp'); T(54,68,76,28,6.5,'sharp'); T(44,73,12,52,6,'sharp'); T(56,73,88,52,6,'sharp'); break;
  }
  return {d,c};
}
let UID=900;
function footSVG(t){
  const {d,c}=footShapes(t), u=++UID;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -8 112 112"><defs>${ART.filterDef(u,true)}
    <radialGradient id="g${u}" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#5a4029"/><stop offset="1" stop-color="#7f603f"/></radialGradient></defs>
    <g filter="url(#w${u})"><path d="${d}" fill="none" stroke="#fbf1d8" stroke-width="7" stroke-linejoin="round" opacity=".55"/>
    <path d="${d}" fill="url(#g${u})" stroke="#4a3522" stroke-width="1.6" stroke-linejoin="round" opacity=".86"/>
    ${c?`<path d="${c}" stroke="#2f2216" stroke-width="3.4" stroke-linecap="round" fill="none"/>`:''}</g></svg>`;
}
const footCache={};
const footURL=t=>footCache[t]||(footCache[t]=DW.svgURL(footSVG(t)));
function bushSVG(seed){
  let s=seed*97+13; const r=()=>{s=(s*9301+49297)%233280;return s/233280;};
  const cols=['#5f8a4f','#6f9a58','#7fa66a','#8fb77a','#4f7a45'];
  let out='';
  for(let i=0;i<9;i++){const x=18+r()*64,y=40+r()*34-i*1.2,R=16+r()*12;out+=`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(R)}" fill="${cols[i%5]}"/>`;}
  for(let i=0;i<10;i++){const x=12+r()*76,y=24+r()*52,a=r()*360;out+=`<path d="M0,0q6,-9 0,-18q-6,9 0,18z" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a)})" fill="#a9c98a" opacity=".7"/>`;}
  const u=++UID;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs>${ART.filterDef(u,true)}</defs><g filter="url(#w${u})"><ellipse cx="50" cy="90" rx="42" ry="7" fill="#3d3226" opacity=".15"/>${out}</g></svg>`;
}
const BUSH=[0,1,2,3].map(i=>DW.svgURL(bushSVG(i+1)));
ART.ICONS.sp_spur=`<g transform="translate(6 4) scale(.52)"><path d="${footShapes('raub').d}" fill="#7f603f"/></g>`;

/* ---------- Zustand ---------- */
let root,lv=1,S=null;
const nameOf=id=>DATA.nameOf(id);
function mount(r){root=r;intro();}
function intro(){
  GK.intro(root,{id:ID,art:`<div class="ga-art"><img src="${footURL('raub')}" style="flex:.5 1 0;height:60%;transform:rotate(-12deg)" alt="">${GK.img('trex',{mood:'happy'})}</div>`,title:'Die Spurensuche',
    say:'Oh! Jemand war hier! Folge den Fußspuren und finde heraus, wer das war.',onStart:l=>{lv=l;start();}});
}
function pickTrails(n){
  const pool=Object.keys(SP_FOOT).filter(id=>DATA.animal(id)&&ART.has(DATA.animal(id).art)&&(lv>1||EASY_IDS.includes(id)));
  const out=[],used=new Set();
  for(const id of DW.shuffle(pool)){ const t=SP_FOOT[id]; if(used.has(t))continue; used.add(t); out.push(id); if(out.length>=n)break; }
  // Leicht: mindestens ein Zwei- und ein Vierbeiner
  return out;
}
function candidates(id){
  const t=SP_FOOT[id], fam=FEET[t].fam, n=LV[lv].ans-1;
  const pool=Object.keys(SP_FOOT).filter(x=>SP_FOOT[x]!==t&&DATA.animal(x)&&(lv>1||EASY_IDS.includes(x)));
  let pick=[];
  if(lv===1) pick=GK.sample(pool.filter(x=>FEET[SP_FOOT[x]].fam!==fam),n);
  else if(lv===3){ const same=DW.shuffle(pool.filter(x=>FEET[SP_FOOT[x]].fam===fam)); const types=new Set();
    same.forEach(x=>{if(pick.length<n&&!types.has(SP_FOOT[x])){types.add(SP_FOOT[x]);pick.push(x);}});
    DW.shuffle(pool).forEach(x=>{if(pick.length<n&&!types.has(SP_FOOT[x])){types.add(SP_FOOT[x]);pick.push(x);}}); }
  else { const types=new Set(); DW.shuffle(pool).forEach(x=>{if(pick.length<n&&!types.has(SP_FOOT[x])){types.add(SP_FOOT[x]);pick.push(x);}}); }
  return DW.shuffle([id].concat(pick));
}
const sizeU=id=>DW.clamp(5.4+Math.sqrt(DATA.lenM(id)||3)*1.8,6.6,13.5);

function start(){
  const cfg=LV[lv]; const ids=pickTrails(cfg.trails);
  S={ids,trails:[],done:0,miss:0,phase:'follow',ask:null,wrongHere:0};
  root.innerHTML=`<div class="sp fill"><div class="sp-stage" id="spStage">
    <svg class="sp-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M0,0H100V27Q88,33 76,28T52,29T28,27T0,30Z" fill="#9fc28a" opacity=".85"/>
      <path d="M0,0H100V20Q86,26 70,21T40,22T12,20T0,23Z" fill="#7fa66a" opacity=".7"/>
      <path d="M8,100Q20,60 26,34H74Q80,60 92,100Z" fill="#e8d4a2" opacity=".55"/></svg>
    <div class="sp-deco"></div><div class="sp-top">${GK.progress(0,ids.length)}</div>
    <img class="sp-lupe" id="spLupe" src="${DW.svgURL(ART.icon('lupe'))}" alt="" hidden></div></div>`;
  const stage=root.querySelector('#spStage');
  deco(stage); layout(stage);
  GK.listen(window,'resize',()=>setU(stage));
  // Spuren nacheinander „eintreten“
  let delay=500;
  S.trails.forEach((tr,j)=>{ tr.prints.forEach((p,k)=>{ GK.after(delay,()=>{p.el.classList.add('in'); if(k%2===0)DW.sfx('step');}); delay+=110; }); delay+=220; });
  GK.after(delay+100,()=>{ S.trails.forEach(tr=>tr.prints[0].el.classList.add('next')); S.ready=true; });
  DW.say(lv===3?'Oh! Hier waren viele! Manche Spuren sind unter Blättern versteckt. Folge einer Spur bis zum Busch.':'Oh! Jemand war hier! Tippe auf die Fußspuren, eine nach der anderen, bis zum Busch.');
  // Fingerwischen und Tippen
  let down=false;
  GK.listen(stage,'pointerdown',e=>{down=true;touch(e.clientX,e.clientY);});
  GK.listen(stage,'pointermove',e=>{if(down||e.pointerType==='mouse'&&e.buttons)touch(e.clientX,e.clientY);});
  GK.listen(window,'pointerup',()=>{down=false;});
  GK.idle.set(()=>{ if(S.phase==='follow'){ const tr=S.trails.find(t=>!t.done); if(tr&&tr.prints[tr.k]) tr.prints[tr.k].el.classList.add('next'); } else if(S.ask) GK.pulse(S.ask.querySelector('.sp-close')); },
    ()=>{ if(S.phase==='follow') DW.say('Tippe auf die leuchtende Fußspur. Dann auf die nächste.'); else if(S.cur) DW.say('Schau dir die Spur genau an. '+FEET[SP_FOOT[S.cur.id]].say); });
  if(window.DW_DEBUG) window.__spuren={S,followAll:()=>{const tr=S.trails.find(t=>!t.done); if(!tr)return null; while(!tr.done) mark(tr,tr.k); return tr.id;},answer:()=>S.cur&&S.cur.id};
}
const uOf=r=>Math.min(r.width,r.height)/100*(r.width<r.height?1.3:1.05);
function setU(stage){ stage.style.setProperty('--u',uOf(stage.getBoundingClientRect())+'px'); }
function deco(stage){
  const d=stage.querySelector('.sp-deco'); const items=[['palme',-3,4,20],['farn',-2,52,11],['farn',92,40,11],['palme',86,2,19],['gras',4,82,9],['gras',90,86,9],['stein',10,66,6],['stein',84,70,5],['farn',94,72,10],['farn',-3,88,10]];
  d.innerHTML=items.map(([ic,x,y,s],i)=>`<img class="sp-plant${i%2?' b':''}" src="${DW.svgURL(ART.icon(ic))}" style="left:${x}%;top:${y}%;width:calc(var(--u)*${s})" alt="">`).join('');
}
function layout(stage){
  setU(stage);
  const R=stage.getBoundingClientRect(), W=R.width, H=R.height, u=uOf(R), cfg=LV[lv], n=S.ids.length;
  const bushY=.19, startY=.95;
  S.ids.forEach((id,j)=>{
    const colW=1/n, xs=colW*(j+.5)+(Math.random()-.5)*colW*.2, xe=colW*(j+.5)+(Math.random()-.5)*colW*.25;
    const bx=W*xe, by=H*bushY;
    const bush=DW.h(`<div class="sp-bush" style="left:${xe*100}%;top:${bushY*100}%"><img class="sp-hid" src="${DW.animalImg(id,{mood:'happy'}).match(/src="([^"]+)"/)[1]}" alt=""><img class="sp-bimg" src="${BUSH[j%4]}" alt=""></div>`);
    stage.appendChild(bush);
    // Pfad (kubische Kurve) in Pixeln
    const P0=[W*xs,H*startY], P3=[bx,by+u*9], wig=W*colW*.28;
    const P1=[P0[0]+(Math.random()-.5)*wig*2,H*.72], P2=[P3[0]+(Math.random()-.5)*wig*2,H*.46];
    const pts=[]; for(let i=0;i<=200;i++){const t=i/200,a=(1-t)**3,b=3*(1-t)**2*t,c=3*(1-t)*t*t,e=t**3; pts.push([a*P0[0]+b*P1[0]+c*P2[0]+e*P3[0],a*P0[1]+b*P1[1]+c*P2[1]+e*P3[1]]);}
    const acc=[0]; for(let i=1;i<pts.length;i++) acc.push(acc[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
    const Ltot=acc[acc.length-1], s=sizeU(id)*u, cnt=DW.clamp(Math.floor(Ltot/(s*1.25)),5,9), step=Ltot/(cnt-.3);
    const t=SP_FOOT[id], quad=FEET[t].fam==='vier', prints=[];
    for(let k=0;k<cnt;k++){
      const L=k*step; let i=acc.findIndex(v=>v>=L); if(i<1)i=1;
      const p=pts[i], q=pts[i-1], ang=Math.atan2(p[1]-q[1],p[0]-q[0]), side=k%2?1:-1, off=s*(quad?.42:.3)*side;
      const x=p[0]+Math.cos(ang+Math.PI/2)*off, y=p[1]+Math.sin(ang+Math.PI/2)*off, rot=ang*180/Math.PI+90;
      const hidden=cfg.hide&&k>0&&k<cnt-1&&(k%3!==0?Math.random()<cfg.hide*1.4:false);
      const su=f1(s/u);
      const el=DW.h(`<div class="sp-print${hidden?' hid':''}" style="left:${x/W*100}%;top:${y/H*100}%;width:calc(var(--u)*${su});height:calc(var(--u)*${su});--r:${f1(rot)}deg;--m:${side<0&&!quad?-1:1}">
        <img src="${footURL(t)}" alt="">${hidden?`<img class="sp-leaf" src="${DW.svgURL(ART.icon(k%2?'blaetter':'farn'))}" alt="" style="--lr:${Math.round(Math.random()*80-40)}deg">`:''}</div>`);
      stage.appendChild(el); prints.push({el,fx:x/W,fy:y/H,su:s/u});
    }
    S.trails.push({id,t,prints,k:0,done:false,bush,j});
  });
}
function touch(cx,cy){
  if(!S||!S.ready||S.phase!=='follow') return;
  const R=root.querySelector('#spStage').getBoundingClientRect(), x=cx-R.left, y=cy-R.top, u=uOf(R);
  let best=null,bd=1e9;
  S.trails.forEach(tr=>{ if(tr.done)return; for(let k=tr.k;k<Math.min(tr.prints.length,tr.k+3);k++){const p=tr.prints[k],d=Math.hypot(p.fx*R.width-x,p.fy*R.height-y),R0=Math.max(46,p.su*u*.85);
    if(d<R0&&d-(k-tr.k)*8<bd){bd=d-(k-tr.k)*8;best=[tr,k];}} });
  if(best) mark(best[0],best[1]);
}
function mark(tr,k){
  for(let i=tr.k;i<=k;i++){ const p=tr.prints[i]; p.el.classList.remove('next'); p.el.classList.add('on'); }
  tr.k=k+1; DW.sfx('step');
  S.trails.forEach(o=>o.prints.forEach(p=>p.el.classList.remove('next')));
  const lupe=root.querySelector('#spLupe'), p=tr.prints[k]; lupe.hidden=false; lupe.style.left=p.el.style.left; lupe.style.top=p.el.style.top;
  if(tr.k>=tr.prints.length){ tr.done=true; S.phase='ask'; tr.bush.classList.add('rustle'); DW.sfx('whoosh');
    /* kurzes Lob („Toll! Da ist noch eine Spur.“) erst ausreden lassen, wenn das Kind sehr schnell am Ende der Spur ist – höchstens 2,6 s */
    const st=S, t0=performance.now(), go=()=>{ if(S!==st) return; if(DW.speaking()&&performance.now()-t0<2600){ GK.after(200,go); return; } ask(tr); };
    GK.after(650,go); }
  else { tr.prints[tr.k].el.classList.add('next'); }
}
function ask(tr){
  S.cur=tr; S.wrongHere=0; const ids=candidates(tr.id);
  const box=DW.h(`<div class="sp-ask card"><div class="sp-askl"><button class="sp-close" aria-label="Spur anschauen"><img src="${footURL(tr.t)}" alt=""></button>
      <h3 class="hand">Wer war das?</h3></div>
    <div class="gk-choices sp-ch">${ids.map(id=>`<button class="gk-choice" data-id="${id}">${GK.img(id)}<b>${nameOf(id)}</b></button>`).join('')}</div></div>`);
  root.querySelector('#spStage').appendChild(box); S.ask=box;
  DW.say('Die Spur hört hier auf. Im Busch versteckt sich jemand! Wer hat diese Spur gemacht?');
  box.querySelector('.sp-close').onclick=()=>{DW.sfx('pop');GK.pulse(box.querySelector('.sp-close'));DW.say(FEET[tr.t].say);};
  DW.$$('.gk-choice',box).forEach(b=>b.onclick=()=>choose(b,tr));
}
function choose(b,tr){
  if(S.phase!=='ask'||b.classList.contains('out')) return;
  const id=b.dataset.id;
  if(id===tr.id){
    S.phase='anim'; GK.ok(b); DW.sfx('magic');
    GK.after(500,()=>{ S.ask.remove(); S.ask=null; reveal(tr); });
    return;
  }
  if(b.dataset.tried) return; b.dataset.tried='1';   // Doppeltipp auf dieselbe falsche Karte zählt nur einmal
  S.miss++; S.wrongHere++;
  GK.no(b); GK.after(450,()=>b.classList.add('out'));
  const my=FEET[SP_FOOT[id]];
  DW.say(`Hm, ${nameOf(id)} war es nicht. ${my.fam!==FEET[tr.t].fam?(my.fam==='vier'?'Der läuft auf vier Beinen. ':'Der läuft auf zwei Beinen. '):''}Schau genau: ${FEET[tr.t].say}`);
  GK.pulse(S.ask.querySelector('.sp-close'));
  // Hinweis 3: nach zwei Fehlversuchen einen weiteren falschen Kandidaten entfernen
  if(S.wrongHere>=2){ const rest=DW.$$('.gk-choice:not(.out)',S.ask).filter(x=>x.dataset.id!==tr.id&&x!==b); if(rest.length) GK.after(900,()=>rest[0].classList.add('out')); }
}
function reveal(tr){
  tr.bush.classList.remove('rustle'); tr.bush.classList.add('open'); DW.sfx('pop');
  tr.prints.forEach(p=>p.el.classList.add('solved'));
  S.done++; DW.discover(tr.id,true);
  if(!DW.state.finds.spur) GK.after(900,()=>DW.addFind('spur'));
  const top=root.querySelector('.sp-top'); top.innerHTML=GK.progress(S.done,S.ids.length);
  DW.say(`Richtig! Das war ${nameOf(tr.id)}. ${FEET[tr.t].say}`).then(()=>{});
  /* erst weiter, wenn die Stimme den Satz zu Ende gesprochen hat (sonst schneidet der nächste Satz ihn ab) – höchstens 12 s */
  const st=S, t0=performance.now(), go=()=>{ if(S!==st) return; if(DW.speaking()&&performance.now()-t0<12000){ GK.after(250,go); return; }
    if(S.done>=S.ids.length) return end();
    S.phase='follow'; S.trails.forEach(o=>{ if(!o.done) o.prints[o.k].el.classList.add('next'); });
    DW.say(DW.pick(['Super! Und wer war noch hier? Folge der nächsten Spur.','Toll! Da ist noch eine Spur.','Klasse Spürnase! Weiter geht’s.']));
  };
  GK.after(2600,go);
}
function end(){
  const stars=S.miss===0?3:S.miss<=2?2:1;
  GK.after(600,()=>GK.finish(root,{id:ID,stars,art:`<div class="ga-art">${S.ids.slice(0,3).map(id=>GK.img(id,{mood:'happy'})).join('')}</div>`,
    say:stars===3?'Wow! Du hast alle Spuren richtig gelesen. Du bist eine echte Spürnase!':'Toll! Du hast alle Tiere gefunden. Forscher lesen Fußspuren genauso wie du!',
    again:()=>start()}));
}
DW.stations[ID]={title:(DATA.station(ID)||{}).n||'Spurensuche',mount,unmount(){S=null;delete window.__spuren;}};
})();
