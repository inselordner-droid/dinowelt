/* =====================================================================
   DINO-INSELWELT · art.js
   Gemalte Aquarell-Grafiken als SVG: Dinos & Urzeittiere (parametrisch),
   Avatare, Symbole. Alles wird aus Formen erzeugt – keine Bilddateien nötig.
   ===================================================================== */
(function () {
"use strict";
const ART = {};
let UID = 0; let CUR=null; const creg=pts=>{if(CUR)pts.forEach(p=>CUR.push(p));return pts;};
const INK = '#4a3b2a';

/* ---------------- Farbwerkzeuge ---------------- */
function hex2rgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255];}
function rgb2hex(r,g,b){return'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');}
function shade(h,f){const[r,g,b]=hex2rgb(h);return f<1?rgb2hex(r*f,g*f,b*f):rgb2hex(r+(255-r)*(f-1),g+(255-g)*(f-1),b+(255-b)*(f-1));}
function mixc(a,b,u){const A=hex2rgb(a),B=hex2rgb(b);return rgb2hex(A[0]+(B[0]-A[0])*u,A[1]+(B[1]-A[1])*u,A[2]+(B[2]-A[2])*u);}
ART.shade=shade; ART.mix=mixc;

/* ---------------- Geometrie ---------------- */
const f1=v=>Math.round(v*10)/10;
function smooth(pts, closed=true, t=0.5){
  const n=pts.length; if(n<2) return '';
  const P=i=>closed?pts[(i+n)%n]:pts[Math.max(0,Math.min(n-1,i))];
  let d=`M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  const last=closed?n:n-1;
  for(let i=0;i<last;i++){
    const p0=P(i-1),p1=P(i),p2=P(i+1),p3=P(i+2);
    const c1=[p1[0]+(p2[0]-p0[0])*t/3,p1[1]+(p2[1]-p0[1])*t/3];
    const c2=[p2[0]-(p3[0]-p1[0])*t/3,p2[1]-(p3[1]-p1[1])*t/3];
    d+=`C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d+(closed?'Z':'');
}
ART.smooth=smooth;
/* Schlauch entlang einer Mittellinie: pts=[x,y,rOben,rUnten] */
function tube(pts){
  const top=[],bot=[],n=pts.length;
  for(let i=0;i<n;i++){
    const a=pts[Math.max(0,i-1)],b=pts[Math.min(n-1,i+1)];
    let tx=b[0]-a[0],ty=b[1]-a[1];const l=Math.hypot(tx,ty)||1;tx/=l;ty/=l;
    const nx=ty,ny=-tx; const p=pts[i];
    top.push([p[0]+nx*p[2],p[1]+ny*p[2]]); bot.push([p[0]-nx*p[3],p[1]-ny*p[3]]);
  }
  return top.concat(bot.reverse());
}
const rad=d=>d*Math.PI/180;
function rot(p,a,o=[0,0]){const c=Math.cos(a),s=Math.sin(a);return[o[0]+p[0]*c-p[1]*s,o[1]+p[0]*s+p[1]*c];}

/* Bein: Kette aus Gelenken, Winkel in Grad (0 = senkrecht nach unten, + = nach vorn) */
function limb(at,segs,angles,widths){
  const pts=[[at[0],at[1],widths[0],widths[0]]];let x=at[0],y=at[1],acc=0;
  for(let i=0;i<segs.length;i++){acc+=angles[i];const a=rad(acc);x+=Math.sin(a)*segs[i];y+=Math.cos(a)*segs[i];pts.push([x,y,widths[i+1],widths[i+1]]);}
  return pts;
}

/* ---------------- SVG-Filter ---------------- */
function filters(id,soft){
  return `<filter id="w${id}" x="-15%" y="-15%" width="130%" height="130%">
 <feTurbulence type="fractalNoise" baseFrequency="${soft?0.02:0.035}" numOctaves="3" seed="${id%9+3}" result="n"/>
 <feDisplacementMap in="SourceGraphic" in2="n" scale="${soft?4:5}" xChannelSelector="R" yChannelSelector="G" result="d"/>
 <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="2" result="g"/>
 <feColorMatrix in="g" type="matrix" values="0 0 0 0 .3  0 0 0 0 .22  0 0 0 0 .12  .9 0 0 0 -.33" result="ga"/>
 <feComposite in="ga" in2="d" operator="in" result="gi"/>
 <feMorphology in="d" operator="erode" radius="1.3" result="er"/>
 <feComposite in="d" in2="er" operator="out" result="edge"/>
 <feColorMatrix in="edge" type="matrix" values=".55 0 0 0 0  0 .5 0 0 0  0 0 .45 0 0  0 0 0 .5 0" result="ed"/>
 <feMerge><feMergeNode in="d"/><feMergeNode in="ed"/><feMergeNode in="gi"/></feMerge></filter>`;
}
ART.filterDef=filters;

/* =====================================================================
   ARTEN – Parameter
   plan: theropod | sauropod | ceratops | stego | ankylo | ornitho |
         ptero | plesio | swimmer | fish | lizard | amphib | mammal |
         bird | insect | trilo | ammonite | snake | whale | crawler
   ===================================================================== */
const SP = {
 trex:{plan:'theropod',col:'#9a7a52',belly:'#e3cfa3',pat:'stripes',patc:'#6d5334',head:'rex',hs:1.25,arms:'tiny',size:1},
 allosaurus:{plan:'theropod',col:'#b0754d',belly:'#ecd2a6',pat:'stripes',patc:'#7c4a2c',head:'rex',hs:1.05,crest:'horns',arms:'short'},
 carnotaurus:{plan:'theropod',col:'#b8574a',belly:'#efc9a8',pat:'spots',patc:'#7d3a33',head:'rex',hs:.95,crest:'bullhorns',arms:'tiny'},
 giganotosaurus:{plan:'theropod',col:'#8f8466',belly:'#e0d4b0',pat:'stripes',patc:'#5c5440',head:'rex',hs:1.15,arms:'short'},
 spinosaurus:{plan:'theropod',col:'#6f8f8a',belly:'#dfe3c6',pat:'spots',patc:'#4d6a66',head:'croc',hs:1.1,sail:'#d98b5f',arms:'short',tailfin:true},
 dilophosaurus:{plan:'theropod',col:'#9aa35e',belly:'#ece6b8',pat:'stripes',patc:'#6a7440',head:'raptor',hs:1,crest:'double',crestc:'#d4704f',arms:'short',slim:true},
 ceratosaurus:{plan:'theropod',col:'#a26a58',belly:'#ecd0b3',pat:'stripes',patc:'#6f4136',head:'rex',hs:1,crest:'nosehorn',arms:'short'},
 coelophysis:{plan:'theropod',col:'#c29a5c',belly:'#f1e2bb',pat:'stripes',patc:'#8a6a3c',head:'raptor',hs:.8,arms:'short',slim:true,small:true},
 herrerasaurus:{plan:'theropod',col:'#a98a5d',belly:'#eee0bd',pat:'spots',patc:'#6e5a3c',head:'raptor',hs:.9,arms:'short',slim:true},
 eoraptor:{plan:'theropod',col:'#c8a46e',belly:'#f4e6c2',pat:'spots',patc:'#8c7048',head:'raptor',hs:.85,arms:'short',slim:true,small:true},
 velociraptor:{plan:'theropod',col:'#b3884f',belly:'#f0dfb6',pat:'stripes',patc:'#7a5a33',head:'raptor',hs:.85,arms:'wing',feathers:'#8c5e3b',slim:true,small:true},
 deinonychus:{plan:'theropod',col:'#7e8a9a',belly:'#e0e2de',pat:'stripes',patc:'#50596a',head:'raptor',hs:.9,arms:'wing',feathers:'#4f5b70',slim:true},
 utahraptor:{plan:'theropod',col:'#9b6e58',belly:'#efd6bf',pat:'stripes',patc:'#65463a',head:'raptor',hs:.95,arms:'wing',feathers:'#6e4a3b',slim:true},
 microraptor:{plan:'theropod',col:'#3f5f78',belly:'#a9c1c9',pat:'none',head:'raptor',hs:.8,arms:'wing',feathers:'#27465e',slim:true,small:true},
 compsognathus:{plan:'theropod',col:'#9cab63',belly:'#eef0c2',pat:'stripes',patc:'#6c7a40',head:'raptor',hs:.8,arms:'short',slim:true,small:true},
 gallimimus:{plan:'theropod',col:'#c4a36d',belly:'#f4e9c9',pat:'none',head:'bird',hs:.75,arms:'short',slim:true,longneck:true,feathers:'#a8845a'},
 therizinosaurus:{plan:'theropod',col:'#8f7a5a',belly:'#e3d6b6',pat:'none',head:'small',hs:.7,arms:'claws',feathers:'#6f5c40',longneck:true,pot:true},
 archaeopteryx:{plan:'bird',col:'#5e6b86',belly:'#d2d7cf',head:'raptor',hs:.8,feathers:'#3c4a66',wing:true,tailfeathers:true},
 brachiosaurus:{plan:'sauropod',col:'#8fa3a9',belly:'#e4e6d2',pat:'spots',patc:'#687f86',neckUp:true,frontLong:true},
 diplodocus:{plan:'sauropod',col:'#9d9a6e',belly:'#e8e3c1',pat:'stripes',patc:'#6f6c4a',longtail:true},
 brontosaurus:{plan:'sauropod',col:'#8e8c7b',belly:'#e6e1cf',pat:'stripes',patc:'#65634f',thickneck:true},
 apatosaurus:{plan:'sauropod',col:'#8e8c7b',belly:'#e6e1cf',pat:'stripes',patc:'#65634f',thickneck:true},
 argentinosaurus:{plan:'sauropod',col:'#a58a6b',belly:'#eadcc4',pat:'spots',patc:'#735c45',big:true},
 mamenchisaurus:{plan:'sauropod',col:'#9aa47a',belly:'#e9ecd0',pat:'stripes',patc:'#6d7650',superneck:true},
 plateosaurus:{plan:'sauropod',col:'#b99a6a',belly:'#efe1c0',pat:'stripes',patc:'#86683f',prosauro:true},
 triceratops:{plan:'ceratops',col:'#a97b5f',belly:'#ecd3bb',pat:'none',frill:'#d7a262',horns:3},
 styracosaurus:{plan:'ceratops',col:'#8d8a5c',belly:'#e5e2bd',pat:'none',frill:'#c9894e',horns:'spiky'},
 protoceratops:{plan:'ceratops',col:'#c3a071',belly:'#f2e3c4',pat:'none',frill:'#dcb282',horns:0,small:true},
 pachyrhinosaurus:{plan:'ceratops',col:'#8f7f6a',belly:'#e6dccb',pat:'none',frill:'#b89060',horns:'boss'},
 stegosaurus:{plan:'stego',col:'#8ea06a',belly:'#e6e7c3',pat:'spots',patc:'#657846',plates:'#d98f5c'},
 kentrosaurus:{plan:'stego',col:'#a68f5f',belly:'#eee2c2',pat:'spots',patc:'#735f3c',plates:'#c96f4d',spiky:true},
 ankylosaurus:{plan:'ankylo',col:'#8c7457',belly:'#e3d4bb',armor:'#b39468'},
 borealopelta:{plan:'ankylo',col:'#9a5a3e',belly:'#e8c9ae',armor:'#c07d58',noclub:true},
 parasaurolophus:{plan:'ornitho',col:'#7f9f8a',belly:'#e5eadb',pat:'stripes',patc:'#577564',head:'duck',crest:'tube',crestc:'#c7704f'},
 corythosaurus:{plan:'ornitho',col:'#a2855c',belly:'#efe0c2',pat:'stripes',patc:'#6e5638',head:'duck',crest:'helmet',crestc:'#cf8a4d'},
 edmontosaurus:{plan:'ornitho',col:'#8e9a70',belly:'#e8ebcf',pat:'spots',patc:'#65704e',head:'duck'},
 iguanodon:{plan:'ornitho',col:'#8f9560',belly:'#e8e9c6',pat:'stripes',patc:'#666c40',head:'beak',thumb:true},
 pachycephalosaurus:{plan:'ornitho',col:'#a9865c',belly:'#efdfc0',pat:'spots',patc:'#735a3a',head:'dome',biped:true},
 pteranodon:{plan:'ptero',col:'#c49a6b',belly:'#f2e3c9',wingc:'#d9b48a',crest:'back'},
 quetzalcoatlus:{plan:'ptero',col:'#b8b0a0',belly:'#efece4',wingc:'#cfc5b2',crest:'tall',longneck:true},
 mosasaurus:{plan:'swimmer',col:'#5f7f95',belly:'#dfe7e6',pat:'none',head:'croc',flippers:true,tailfin:'down'},
 ichthyosaurus:{plan:'swimmer',col:'#6f8fa6',belly:'#e3ecef',pat:'none',head:'dolphin',fin:true,tailfin:'moon'},
 plesiosaurus:{plan:'plesio',col:'#6e8a8a',belly:'#e1e8df'},
 nothosaurus:{plan:'plesio',col:'#7d8a6e',belly:'#e4e8d4',short:true},
 dunkleosteus:{plan:'fish',col:'#7d8791',belly:'#d9dcd8',armorhead:'#9a8f7a',big:true},
 eusthenopteron:{plan:'fish',col:'#9a9a6e',belly:'#e3e3c8',lobe:true},
 bothriolepis:{plan:'fish',col:'#a08d6c',belly:'#e8dfc8',armorhead:'#b8a582',small:true},
 cladoselache:{plan:'fish',col:'#7c8fa1',belly:'#e3e9ec',shark:true},
 megalodon:{plan:'fish',col:'#71879a',belly:'#e6ecef',shark:true,big:true},
 tiktaalik:{plan:'amphib',col:'#8a946a',belly:'#e3e3c4',pat:'spots',patc:'#606a48',fishy:true},
 ichthyostega:{plan:'amphib',col:'#7f8c6a',belly:'#e1e2c8',pat:'spots',patc:'#58634a'},
 hynerpeton:{plan:'amphib',col:'#8c8f63',belly:'#e4e3c2',pat:'spots',patc:'#62653f'},
 proterogyrinus:{plan:'amphib',col:'#7a7f5c',belly:'#e0e0c4',pat:'stripes',patc:'#565a3e',long:true},
 diplocaulus:{plan:'amphib',col:'#8a9c7a',belly:'#e6ecd8',boomerang:true},
 meganeura:{plan:'insect',col:'#4f8a8e',wingc:'#cfe6ea'},
 arthropleura:{plan:'crawler',col:'#8a5a3e',belly:'#d9b594'},
 pulmonoscorpius:{plan:'crawler',col:'#5f4a3a',belly:'#a78a6e',scorpion:true},
 trilobit:{plan:'trilo',col:'#b68457'},
 ammonit:{plan:'ammonite',col:'#d7b58f'},
 hylonomus:{plan:'lizard',col:'#9a8a5e',belly:'#e8e0c2',pat:'stripes',patc:'#6d6240',small:true},
 dimetrodon:{plan:'lizard',col:'#b0735a',belly:'#efd2bd',pat:'spots',patc:'#7c4a3a',sail:'#e0a07a',bighead:true},
 edaphosaurus:{plan:'lizard',col:'#8f8a5f',belly:'#e6e2c3',pat:'spots',patc:'#65613f',sail:'#c9b46f'},
 coelurosauravus:{plan:'lizard',col:'#8a9e6a',belly:'#e3ead0',pat:'stripes',patc:'#607048',glider:true,small:true},
 gorgonops:{plan:'mammal',col:'#9c7a5c',belly:'#e8d8c4',pat:'stripes',patc:'#6a513c',saber:true,reptile:true},
 scutosaurus:{plan:'lizard',col:'#9a8468',belly:'#e3d6c2',pat:'spots',patc:'#6d5c46',bulky:true,bumps:true},
 lystrosaurus:{plan:'mammal',col:'#a39264',belly:'#ece2c5',pat:'none',tusks:true,reptile:true,short:true},
 moschops:{plan:'mammal',col:'#9d8a6a',belly:'#e8dfcb',pat:'none',reptile:true,bulky:true},
 postosuchus:{plan:'lizard',col:'#8a6a52',belly:'#e3d0bc',pat:'stripes',patc:'#5e4636',upright:true,bighead:true},
 cynognathus:{plan:'mammal',col:'#8c7a64',belly:'#e3d9ca',pat:'stripes',patc:'#62533f',reptile:true},
 titanoboa:{plan:'snake',col:'#7a8a5a',belly:'#e0e2c0',patc:'#4f5c38'},
 pantolambda:{plan:'mammal',col:'#8f7c64',belly:'#e3d8c8',pat:'none',short:true},
 gastornis:{plan:'bird',col:'#7a6a5a',belly:'#d9cfc0',head:'bigbeak',hs:1.2,feathers:'#5a4b3d',big:true,flightless:true},
 ptilodus:{plan:'mammal',col:'#9a8570',belly:'#eadfd0',pat:'none',small:true,rodent:true},
 basilosaurus:{plan:'whale',col:'#6f8292',belly:'#dfe6ea'},
 uintatherium:{plan:'mammal',col:'#857a6e',belly:'#e0d9cf',pat:'none',knobs:true,bulky:true,tusks:true},
 andrewsarchus:{plan:'mammal',col:'#8a6f58',belly:'#e3d4c4',pat:'none',bighead:true},
 ambulocetus:{plan:'mammal',col:'#7a7f78',belly:'#dfe1db',pat:'none',croc:true,short:true},
 paraceratherium:{plan:'mammal',col:'#9a8e7c',belly:'#e8e2d6',pat:'none',tall:true,longneck:true},
 hyaenodon:{plan:'mammal',col:'#8c7458',belly:'#e3d5c2',pat:'spots',patc:'#5f4d3a',bighead:true},
 mesohippus:{plan:'mammal',col:'#a88c64',belly:'#efe3cc',pat:'none',horse:true,small:true},
 entelodon:{plan:'mammal',col:'#6f625a',belly:'#d9d0c8',pat:'none',bighead:true,pig:true},
 mammut:{plan:'mammal',col:'#8a5e3e',belly:'#b98b62',pat:'fur',mammoth:true,big:true},
 smilodon:{plan:'mammal',col:'#c49a62',belly:'#f1e2c4',pat:'none',saber:true,cat:true},
 megaloceros:{plan:'mammal',col:'#9a7250',belly:'#e8d2b4',pat:'none',antlers:true,tall:true},
 wollnashorn:{plan:'mammal',col:'#8a6a4c',belly:'#b99876',pat:'fur',rhino:true,bulky:true},
 hoehlenbaer:{plan:'mammal',col:'#6e4e36',belly:'#94704f',pat:'fur',bear:true,bulky:true},
 elefant:{plan:'mammal',col:'#a3a19b',belly:'#c9c6bf',pat:'none',mammoth:true,nofur:true,big:true},
 katze:{plan:'mammal',col:'#d9a064',belly:'#f6e6cc',pat:'stripes',patc:'#b07a44',small:true,short:true,catears:true,longtail:true},
 hund:{plan:'mammal',col:'#b8905f',belly:'#efe0c6',pat:'none',small:true,dogears:true,longtail:true},
 pferd:{plan:'mammal',col:'#9a6a48',belly:'#c79a74',pat:'none',horse:true,tall:true,mane:true,longtail:true},
 kaninchen:{plan:'mammal',col:'#c9b8a4',belly:'#f3ece2',pat:'none',small:true,short:true,rabbit:true},
 giraffe:{plan:'mammal',col:'#e2b15c',belly:'#f6e6c0',pat:'spots',patc:'#a8683a',tall:true,giraffe:true},
 struthiomimus:{plan:'theropod',col:'#c9a36d',belly:'#f4e9c9',pat:'none',head:'bird',hs:.75,arms:'short',slim:true,longneck:true,feathers:'#a8845a'},
 huhn:{plan:'bird',col:'#c9a37a',belly:'#f3e5cf',head:'bird',hs:.9,feathers:'#a8805a',flightless:true,small:true,comb:true},
 // ---- Meerestiere (Urzeit-Meer) ----
 archelon:{plan:'turtle',col:'#6f8a86',belly:'#dfe6d6',shell:'#7d8f78'},
 elasmosaurus:{plan:'plesio',col:'#6f8f96',belly:'#e1e9e6',xlong:true},
 kronosaurus:{plan:'plesio',col:'#5e6f86',belly:'#dfe4ea',pliosaur:true},
 liopleurodon:{plan:'plesio',col:'#6a6f8e',belly:'#e2e2ec',pliosaur:true},
 helicoprion:{plan:'fish',col:'#7f8f9c',belly:'#e6ebee',shark:true,whorl:true},
 edestus:{plan:'fish',col:'#8a8f9a',belly:'#e8eaee',shark:true,scissor:true},
 xenacanthus:{plan:'fish',col:'#8a8a6a',belly:'#e8e6d0',eel:true},
 quastenflosser:{plan:'fish',col:'#3f5f86',belly:'#b9c9da',lobe:true,pat:'spots',patc:'#f3f6f8'},
 anomalocaris:{plan:'anomalo',col:'#c8745a',belly:'#efc3a8'},
 orthoceras:{plan:'orthocone',col:'#d8b98e',stripe:'#a8683a'},
 eurypterus:{plan:'eurypterid',col:'#8a6a4e',belly:'#d9bb98'},
 leedsichthys:{plan:'fish',col:'#6f8595',belly:'#e3e9ed',big:true,filter:true},
 shonisaurus:{plan:'swimmer',col:'#61809a',belly:'#dfe7ec',pat:'none',head:'dolphin',fin:true,tailfin:'moon',big:true},
 tylosaurus:{plan:'swimmer',col:'#6f8a6e',belly:'#e3e8d8',pat:'stripes',patc:'#566e55',head:'croc',flippers:true,tailfin:'down'},
 placodus:{plan:'lizard',col:'#7f8f9a',belly:'#e3e6e3',pat:'spots',patc:'#5f6f7a',bulky:true,bumps:true},
 livyatan:{plan:'whale',col:'#5d6b78',belly:'#d9dfe4',sperm:true},
 dorudon:{plan:'whale',col:'#7d8e9a',belly:'#e3e8eb',small:true},
 deinosuchus:{plan:'lizard',col:'#6f765a',belly:'#dcdcc4',pat:'stripes',patc:'#4f553e',long:true,bighead:true},
 seekuh:{plan:'whale',col:'#9a8f86',belly:'#e3ddd6',small:true,manatee:true},
};
ART.SPECIES=SP;

/* ---------------- Köpfe (lokal, Blick nach +x) ---------------- */
function headShape(type,L,H){
  switch(type){
    case 'rex': return {o:[[-4,-H*.46],[L*.3,-H*.62],[L*.72,-H*.5],[L*.98,-H*.18],[L,H*.18],[L*.75,H*.46],[L*.3,H*.52],[-4,H*.3]],
      jaw:[[L*.22,H*.14],[L*.6,H*.2],[L*.97,H*.12]],eye:[L*.36,-H*.24],nos:[L*.9,-H*.22],teeth:true};
    case 'raptor': return {o:[[-3,-H*.4],[L*.35,-H*.52],[L*.8,-H*.3],[L,H*.02],[L*.85,H*.3],[L*.3,H*.42],[-3,H*.3]],
      jaw:[[L*.25,H*.1],[L*.65,H*.14],[L*.98,H*.06]],eye:[L*.34,-H*.2],nos:[L*.92,-H*.14],teeth:true};
    case 'croc': return {o:[[-3,-H*.45],[L*.3,-H*.5],[L*.55,-H*.22],[L,-H*.12],[L*1.02,H*.12],[L*.55,H*.2],[L*.3,H*.46],[-3,H*.32]],
      jaw:[[L*.3,H*.05],[L*.99,H*.0]],eye:[L*.26,-H*.24],nos:[L*.95,-H*.08],teeth:true};
    case 'small': return {o:[[-2,-H*.42],[L*.45,-H*.56],[L*.9,-H*.3],[L,H*.1],[L*.7,H*.38],[-2,H*.36]],
      jaw:[[L*.45,H*.14],[L*.97,H*.12]],eye:[L*.42,-H*.14],nos:[L*.86,-H*.2]};
    case 'beak': return {o:[[-3,-H*.48],[L*.4,-H*.58],[L*.85,-H*.34],[L*1.05,-H*.02],[L*.9,H*.2],[L*.8,H*.34],[L*.3,H*.48],[-3,H*.34]],
      jaw:[[L*.4,H*.16],[L*.9,H*.12]],eye:[L*.38,-H*.22],nos:[L*.82,-H*.16]};
    case 'duck': return {o:[[-3,-H*.45],[L*.4,-H*.52],[L*.72,-H*.2],[L*1.05,-H*.12],[L*1.08,H*.14],[L*.72,H*.2],[L*.35,H*.44],[-3,H*.34]],
      jaw:[[L*.4,H*.12],[L*1.02,H*.06]],eye:[L*.34,-H*.22],nos:[L*.9,-H*.02]};
    case 'dome': return {o:[[-3,-H*.4],[L*.1,-H*.9],[L*.5,-H*1.05],[L*.85,-H*.6],[L,-H*.05],[L*.85,H*.3],[L*.3,H*.44],[-3,H*.32]],
      jaw:[[L*.45,H*.14],[L*.95,H*.1]],eye:[L*.46,-H*.24],nos:[L*.9,-H*.1],knobs:true};
    case 'bird': return {o:[[-2,-H*.45],[L*.45,-H*.58],[L*.78,-H*.28],[L*1.12,-H*.02],[L*.78,H*.18],[L*.4,H*.44],[-2,H*.34]],
      jaw:[[L*.7,H*.02],[L*1.08,H*.0]],eye:[L*.4,-H*.18],beak:true};
    case 'bigbeak': return {o:[[-2,-H*.5],[L*.35,-H*.62],[L*.85,-H*.45],[L*1.1,-H*.05],[L*.95,H*.38],[L*.45,H*.52],[-2,H*.36]],
      jaw:[[L*.4,H*.1],[L*1.05,H*.02]],eye:[L*.28,-H*.26],beak:true};
    case 'dolphin': return {o:[[-3,-H*.5],[L*.35,-H*.52],[L*.6,-H*.2],[L*1.1,-H*.05],[L*1.1,H*.08],[L*.6,H*.25],[L*.3,H*.48],[-3,H*.4]],
      jaw:[[L*.55,H*.08],[L*1.08,H*.02]],eye:[L*.34,-H*.14],teeth:true,bigeye:true};
    case 'mammal': return {o:[[-3,-H*.45],[L*.4,-H*.55],[L*.8,-H*.35],[L*1.02,-H*.05],[L*.95,H*.28],[L*.55,H*.4],[L*.2,H*.46],[-3,H*.32]],
      jaw:[[L*.55,H*.2],[L*.95,H*.16]],eye:[L*.42,-H*.2],nos:[L*.96,-H*.1],ear:true};
  }
  return headShape('rex',L,H);
}

/* ---------------- Hilfen zum Zusammensetzen ---------------- */
function P(d,fill,extra=''){const sw=/stroke-width/.test(extra)?'':' stroke-width="1.5"',st=/stroke=/.test(extra)?'':` stroke="${INK}"`;return `<path d="${d}" fill="${fill}"${st}${sw} stroke-linejoin="round" stroke-opacity=".75" ${extra}/>`;}
function Pn(d,fill,extra=''){return `<path d="${d}" fill="${fill}" ${extra}/>`;}
function L(d,c=INK,w=1.4,extra=''){return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;}
function eye(x,y,r=3.4,look=1){
  return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#fffdf6" stroke="${INK}" stroke-width="1.1"/>`+
   `<circle cx="${f1(x+r*.25*look)}" cy="${f1(y+r*.05)}" r="${f1(r*.58)}" fill="#2d241a"/>`+
   `<circle cx="${f1(x+r*.05*look)}" cy="${f1(y-r*.28)}" r="${f1(r*.22)}" fill="#fff"/>`;
}
function tp(pts,M){return pts.map(p=>M(p));}
function headAt(type,L0,H0,anchor,ang,col,opt){
  const h=headShape(type,L0,H0), M=p=>rot(p,rad(ang),anchor);
  const o=creg(tp(h.o,M));let s='';
  s+=P(smooth(o),col);
  if(h.jaw) s+=L(smooth(tp(h.jaw,M),false),shade(col,.55),1.3);
  if(h.teeth&&opt.carn){ const a=tp([[L0*.35,H0*.16],[L0*.52,H0*.2],[L0*.68,H0*.2],[L0*.84,H0*.16]],M);
    a.forEach(p=>{s+=`<path d="M${f1(p[0]-1.6)} ${f1(p[1]-1)}L${f1(p[0])} ${f1(p[1]+2.6)}L${f1(p[0]+1.6)} ${f1(p[1]-1)}Z" fill="#fffaf0" stroke="${INK}" stroke-width=".6"/>`;}); }
  if(h.beak){ const b=creg(tp([[L0*.72,-H0*.26],[L0*1.14,-H0*.02],[L0*.74,H0*.2]],M)); s+=P(smooth(b,true,.3),opt.beakc||'#e2b15c'); }
  if(h.knobs){ tp([[L0*.15,-H0*.7],[L0*.35,-H0*.9],[L0*.1,-H0*.35]],M).forEach(p=>s+=`<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="1.8" fill="${shade(col,.8)}"/>`); }
  if(h.nos){const n=M(h.nos);s+=`<circle cx="${f1(n[0])}" cy="${f1(n[1])}" r="1.1" fill="${INK}" opacity=".7"/>`;}
  const e=M(h.eye); opt.eyePos=e;
  return s;
}

/* =====================================================================
   HAUPTFUNKTION: Tier als SVG
   opts: {ph: Laufphase 0..1, mood:'happy'|'chew'|'sad', flip:true, bare:true}
   ===================================================================== */
ART.animal=function(id,opts={}){
  const sp=SP[id]||SP[aliasOf(id)]||SP.trex;
  const uid=++UID, ph=opts.ph||0, sw=Math.sin(ph*2*Math.PI), cw=Math.cos(ph*2*Math.PI);
  const col=sp.col, bel=sp.belly||shade(col,1.5), far=shade(col,.78);
  const o={carn:false,beakc:null}, B=[]; let back='',body='',front='',over='',eyeS='';
  const all=[]; CUR=all; const reg=pts=>{pts.forEach(p=>all.push(p));return pts;};
  const clip='c'+uid;
  let bodyPath='';
  const drawBody=(pts,extraPattern)=>{
    const out=reg(tube(pts)); bodyPath=smooth(out);
    body+=P(bodyPath,col);
    // Bauch
    body+=`<g clip-path="url(#${clip})">`;
    const bl=pts.map(p=>[p[0],p[1]+p[3]*.72,p[2]*.55,p[3]*.55]);
    body+=Pn(smooth(tube(bl)),bel,'opacity=".9"');
    body+=pattern(sp,pts,uid);
    if(extraPattern) body+=extraPattern;
    body+=`</g>`;
  };
  const heavy=!['theropod','bird'].includes(sp.plan)&&!sp.biped;
  const leg=(at,segs,angs,ws,c,foot=true,claw=false)=>{
    const pts=limb(at,segs,angs,ws);reg(pts); let s=P(smooth(tube(pts)),c);
    if(foot&&heavy){const e=pts[pts.length-1],w=ws[ws.length-1];
      const pad=[[e[0]-w*1.05,e[1]-w*.3],[e[0]+w*1.25,e[1]-w*.3],[e[0]+w*1.2,e[1]+w*.55],[e[0]-w*1.0,e[1]+w*.55]];reg(pad);
      s+=P(smooth(pad,true,.5),shade(c,.92));
      s+=L(`M${f1(e[0]+w*.1)} ${f1(e[1]+w*.2)}l0 ${f1(w*.35)}M${f1(e[0]+w*.6)} ${f1(e[1]+w*.2)}l0 ${f1(w*.35)}`,shade(c,.6),.9);
    } else if(foot){const e=pts[pts.length-1],a=rad(angs.reduce((x,y)=>x+y,0)+90);
      const fx=Math.sin(a)*ws[ws.length-1]*1.8,fy=Math.cos(a)*ws[ws.length-1]*1.8;
      const toe=[[e[0]-ws[ws.length-1]*1.2,e[1]],[e[0]+ws[ws.length-1]*2.4+ (claw?2:0),e[1]+.5],[e[0]+ws[ws.length-1]*2.2,e[1]+ws[ws.length-1]*1.1],[e[0]-ws[ws.length-1]*1.1,e[1]+ws[ws.length-1]*1.1]];
      reg(toe); s+=P(smooth(toe,true,.4),c);}
    return s;
  };
  const plan=sp.plan;
  /* -------------------- THEROPODE -------------------- */
  if(plan==='theropod'||plan==='bird'){
    const small=sp.small?.8:1, slim=sp.slim?.8:1;
    const hipX=92,hipY=62, leanUp=sp.longneck?1:0;
    const pts=[[8,56+sw*1.5,0.6,0.6],[30,55+sw,4*slim,4*slim],[58,57,11*slim,11*slim],[hipX,hipY,20*slim,22*slim],[112,63,21*slim,24*slim],[128,57,15*slim,16*slim]];
    let neck,headA,headL=34*sp.hs,headH=24*sp.hs;
    if(sp.longneck){ neck=[[140,46,9,9],[150,30,6,6],[156,18,5,5]]; headA=-5; }
    else neck=[[138,48,11*slim,11*slim],[146,40,10*slim,10*slim]];
    const full=pts.concat(neck);
    if(sp.tailfin) back+=P(smooth(reg([[14,54],[30,34],[46,40],[58,50],[40,56]])),sp.sail||far);
    if(sp.sail){ const s=[[92,44],[100,8],[118,4],[132,18],[134,44]]; back+=P(smooth(reg(s)),sp.sail);
      for(let i=0;i<6;i++){const x=96+i*7; back+=L(`M${x} 44L${x+1+ i*.3} ${14+Math.abs(i-2.5)*2}`,shade(sp.sail,.7),1);} }
    if(sp.feathers&&plan!=='bird'){ // Schwanzfedern
      back+=P(smooth(reg([[4,58],[16,48],[30,50],[26,60],[10,64]])),sp.feathers); }
    // hinteres Bein (fern)
    const hk=18*small, hs=20*small, hf=10*small, ph2=(sw*22);
    back+=leg([hipX-4,hipY+6],[hk,hs,hf],[20-ph2,-45+cw*10,40],[8*slim,6*slim,4*slim,3*slim],far,true,sp.arms==='wing');
    if(plan==='bird'&&sp.wing) back+=P(smooth(reg([[104,58],[70,40],[48,36],[60,54],[96,70]])),shade(sp.feathers,.85));
    drawBody(full);
    if(sp.pot) body+='';
    // Kopf
    const hp=full[full.length-1];
    let hAng=sp.longneck?-4:-8, type=sp.head||'rex';
    o.carn=!['small','bird','bigbeak'].includes(type);
    over+=headAt(type,headL,headH,[hp[0]-4,hp[1]],hAng+sw*1.5,col,o); reg([[hp[0]+headL,hp[1]-headH*.6],[hp[0]-4,hp[1]+headH*.5]]);
    if(sp.crest) over=crest(sp,hp,headL,headH,hAng)+over;
    if(sp.comb) over=P(smooth([[hp[0]+4,hp[1]-headH*.5],[hp[0]+8,hp[1]-headH*.95],[hp[0]+14,hp[1]-headH*.7],[hp[0]+19,hp[1]-headH*.95],[hp[0]+22,hp[1]-headH*.5]]),'#c8553d')+over;
    // vorderes Bein
    front+=leg([hipX+2,hipY+8],[hk,hs,hf],[20+ph2,-45-cw*10,40],[9*slim,7*slim,4.5*slim,3.2*slim],col,true,sp.arms==='wing');
    // Arme
    const sh=[124,70];
    if(sp.arms==='tiny') front+=leg(sh,[8,6],[40+sw*6,40],[3.2,2.5,1.8],col,false);
    else if(sp.arms==='short') front+=leg(sh,[12,10],[35+sw*8,45],[4,3,2],col,false);
    else if(sp.arms==='claws') front+=leg(sh,[16,14,8],[30,40,40],[4,3.2,2.4,1],col,false);
    else if(sp.arms==='wing'){ front+=P(smooth(reg([[sh[0]-2,sh[1]-3],[sh[0]+9,sh[1]+6],[sh[0]+3,sh[1]+18],[sh[0]-12,sh[1]+12]])),shade(sp.feathers||far,1.25)); front+=leg(sh,[11,10],[40+sw*6,45],[3.6,3,2],col,false);}
    if(plan==='bird'&&sp.wing) front+=P(smooth(reg([[124,60],[96,52],[70,58],[92,74],[118,74]])),sp.feathers);
    if(plan==='bird'&&!sp.wing&&sp.feathers) front+=P(smooth(reg([[122,58],[100,60],[92,72],[112,76]])),sp.feathers);
    if(sp.tailfeathers) back+=P(smooth(reg([[0,52],[10,44],[34,50],[34,60],[8,62]])),sp.feathers);
    eyeS=eye(o.eyePos[0],o.eyePos[1],3.2*Math.max(.9,sp.hs));
  }
  /* -------------------- SAUROPODE -------------------- */
  else if(plan==='sauropod'){
    const big=sp.big?1.08:1, pro=sp.prosauro;
    const tailLen=sp.longtail?1.25:1;
    const pts=[[4-(tailLen-1)*30,88+sw*1.5,.6,.6],[26,78,6,6],[54,68,15,15],[84,62,26*big,30*big],[112,64,26*big,31*big],[134,58,18,19]];
    let neck;
    if(pro) neck=[[146,50,11,11],[156,42,8,8]];
    else if(sp.neckUp) neck=[[148,46,12,12],[158,24,8,8],[164,6,6.5,6.5]];
    else if(sp.superneck) neck=[[152,48,11,11],[172,34,7,7],[188,24,5.5,5.5]];
    else if(sp.thickneck) neck=[[150,50,14,14],[164,38,10,10],[176,30,7,7]];
    else neck=[[150,52,11,11],[166,40,7.5,7.5],[178,32,6,6]];
    const full=pts.concat(neck);
    const legW=pro?[7,5.5,4.5]:[10.5,9,8];
    const fl=sp.frontLong?1.2:1;
    // ferne Beine
    back+=leg([80,78],[pro?22:24,pro?22:22],[sw*14,pro?-35:-2],legW,far,true);
    back+=leg([126,76],[pro?16:24*fl,pro?16:22*fl],[-cw*12,pro?20:-2],pro?[5,4,3.5]:legW,far,true);
    drawBody(full);
    const hp=full[full.length-1];
    over+=headAt(pro?'small':'small',pro?20:17,pro?14:12,[hp[0]-2,hp[1]],pro?-4:6,col,o);
    front+=leg([88,80],[pro?22:24,pro?22:22],[-sw*14,pro?-35:-2],legW,col,true);
    front+=leg([122,80],[pro?16:24*fl,pro?16:22*fl],[cw*12,pro?20:-2],pro?[5,4,3.5]:legW,col,true);
    eyeS=eye(o.eyePos[0],o.eyePos[1],2.6);
  }
  /* -------------------- VIERBEINER (Pflanzenfresser) -------------------- */
  else if(plan==='ceratops'||plan==='stego'||plan==='ankylo'||plan==='ornitho'){
    const biped=sp.biped;
    let pts;
    if(plan==='stego') pts=[[8,74+sw,.6,.6],[30,68,8,8],[60,58,20,18],[92,52,30,28],[118,62,22,24],[136,72,12,12],[146,76,9,9]];
    else if(plan==='ankylo') pts=[[6,78+sw,.6,.6],[30,74,7,7],[58,66,20,19],[90,62,26,24],[118,64,24,24],[136,68,14,14],[144,70,11,11]];
    else if(plan==='ceratops') pts=[[10,72+sw,.6,.6],[32,68,7,7],[60,62,20,20],[92,60,26,26],[118,64,22,24],[134,66,14,14]];
    else pts=biped?[[8,56+sw,.6,.6],[34,56,6,6],[64,56,16,16],[94,58,22,24],[116,60,20,22],[130,52,12,12],[138,44,10,10]]
                  :[[6,62+sw,.6,.6],[32,62,6,6],[62,60,17,17],[92,60,24,25],[118,62,21,23],[134,56,13,13],[144,48,10,10]];
    const hipX=pts[3][0]-6, shX=pts[4][0]+8;
    const legH=plan==='ankylo'?[12,12]:plan==='stego'?[18,20]:[16,16];
    // Rückenschmuck hinten
    if(plan==='stego'){
      const topY=x=>{for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];if(x>=a[0]&&x<=b[0]){const u=(x-a[0])/(b[0]-a[0]);return a[1]-a[2]+(b[1]-b[2]-a[1]+a[2])*u;}}return 60;};
      const plates=[[36,10],[50,14],[64,18],[78,21],[92,22],[106,20],[120,16],[134,11]].map(([x,h])=>[x,topY(x)+5,h]);
      plates.forEach(([x,y,h],i)=>{const q=[[x-h*.55,y+6],[x-h*.2,y-h],[x+h*.3,y-h*1.1],[x+h*.6,y+6]];reg(q);back+=P(smooth(q,true,.4),i%2?sp.plates:shade(sp.plates,.88));});
      const tx=pts[0][0]+8,ty=pts[0][1]-2;
      [[tx+4,ty-2,-40],[tx+10,ty-3,-30],[tx+6,ty+3,-150]].forEach(([x,y,a])=>{const q=[[x-2,y],[x+Math.cos(rad(a))*14,y+Math.sin(rad(a))*14],[x+2,y]];reg(q);back+=P(smooth(q,true,.2),'#efe2c4');});
      if(sp.spiky) [[70,50],[86,46],[102,48]].forEach(([x,y])=>back+=P(`M${x-3} ${y}L${x} ${y-20}L${x+3} ${y}Z`,'#efe2c4'));
    }
    if(plan==='ankylo'&&!sp.noclub){ const c=[[2,72],[10,64],[20,68],[18,80],[6,82]];reg(c); back+=P(smooth(c),shade(sp.armor,.9)); }
    // ferne Beine
    const bip=biped;
    back+=leg([hipX,pts[3][1]+10],[legH[0]+(bip?4:0),legH[1]+(bip?4:0)],[sw*14,bip?-30:-4],[9,7.5,6],far,true);
    if(!bip) back+=leg([shX,pts[4][1]+10],[legH[0]-2,legH[1]-2],[-cw*12,-4],[8,6.5,5.5],far,true);
    drawBody(pts, plan==='ankylo'?armorDots(pts,sp):'');
    const hp=pts[pts.length-1];
    if(plan==='ceratops'){
      const fr=[[hp[0]-16,hp[1]-2],[hp[0]-18,hp[1]-26],[hp[0]-2,hp[1]-38],[hp[0]+10,hp[1]-28],[hp[0]+8,hp[1]-6]];reg(fr);
      over+=P(smooth(fr),sp.frill);
      if(sp.horns==='spiky') for(let i=0;i<5;i++){const a=rad(-150+i*22),x=hp[0]-6+Math.cos(a)*30,y=hp[1]-12+Math.sin(a)*30;over+=P(`M${f1(x-3)} ${f1(y+3)}L${f1(x+Math.cos(a)*14)} ${f1(y+Math.sin(a)*14)}L${f1(x+3)} ${f1(y-2)}Z`,'#efe2c4');}
      over+=L(smooth([[hp[0]-12,hp[1]-6],[hp[0]-8,hp[1]-26],[hp[0]+2,hp[1]-30]],false),shade(sp.frill,.7),1.2);
    }
    const hType=plan==='ceratops'?'beak':plan==='ornitho'?(sp.head||'duck'):plan==='stego'?'small':'small';
    const HL=plan==='ceratops'?34:plan==='ornitho'?30:plan==='ankylo'?24:18, HH=plan==='ceratops'?24:plan==='ornitho'?19:plan==='ankylo'?18:13;
    const hAng=plan==='stego'?20:plan==='ankylo'?8:plan==='ceratops'?14:4;
    if(sp.crest) over+=crest(sp,hp,HL,HH,hAng);
    over+=headAt(hType,HL,HH,[hp[0]-4,hp[1]],hAng+sw,col,o);
    if(plan==='ceratops'){ const hn=o.eyePos;
      if(sp.horns===3||sp.horns==='spiky'){ if(sp.horns===3){over+=P(`M${f1(hn[0]-2)} ${f1(hn[1]-3)}Q${f1(hn[0]+8)} ${f1(hn[1]-18)} ${f1(hn[0]+22)} ${f1(hn[1]-24)}Q${f1(hn[0]+10)} ${f1(hn[1]-10)} ${f1(hn[0]+5)} ${f1(hn[1]-1)}Z`,'#efe2c4');}
        over+=P(`M${f1(hn[0]+18)} ${f1(hn[1]+2)}L${f1(hn[0]+26)} ${f1(hn[1]-14)}L${f1(hn[0]+25)} ${f1(hn[1]+5)}Z`,'#efe2c4');}
      if(sp.horns==='boss') over+=P(smooth([[hn[0]+10,hn[1]-2],[hn[0]+18,hn[1]-8],[hn[0]+26,hn[1]-2],[hn[0]+22,hn[1]+4]]),shade(col,.85));
    }
    if(plan==='ankylo') over+=L(`M${f1(o.eyePos[0]-6)} ${f1(o.eyePos[1]-6)}l4 -5 4 5 4 -5`,shade(col,.6),1.2);
    front+=leg([hipX+6,pts[3][1]+12],[legH[0]+(bip?4:0),legH[1]+(bip?4:0)],[-sw*14,bip?-30:-4],[10,8,6.5],col,true);
    if(!bip) front+=leg([shX+4,pts[4][1]+12],[legH[0]-2,legH[1]-2],[cw*12,-4],[9,7,6],col,true);
    else front+=leg([pts[4][0]+2,pts[4][1]+8],[10,9],[30+sw*6,40],[3.6,3,2],col,false);
    if(sp.thumb) front+=P(`M${shX+10} ${pts[4][1]+34}l6 -6 1 7z`,'#efe2c4');
    eyeS=eye(o.eyePos[0],o.eyePos[1],3);
  }
  /* -------------------- FLUGSAURIER -------------------- */
  else if(plan==='ptero'){
    const flap=sw*14;
    const wingF=[[96,58],[60,40-flap],[20,34-flap*1.6],[4,44-flap*1.8],[40,58-flap*.6],[80,74]];reg(wingF);
    back+=P(smooth(wingF,true,.35),shade(sp.wingc,.85));
    const pts=[[70,66,.6,.6],[84,64,7,7],[100,62,11,12],[116,58,8,8]];
    const neck=sp.longneck?[[128,44,5,5],[136,26,4,4]]:[[126,50,6,6]];
    drawBody(pts.concat(neck));
    const hp=neck[neck.length-1];
    if(sp.crest==='back') over+=P(smooth(reg([[hp[0]+2,hp[1]-4],[hp[0]-26,hp[1]-20],[hp[0]-6,hp[1]+2]]),true,.3),shade(col,.8));
    if(sp.crest==='tall') over+=P(smooth(reg([[hp[0]+2,hp[1]-4],[hp[0]+6,hp[1]-24],[hp[0]+14,hp[1]-6]]),true,.3),'#c8553d');
    over+=headAt('bird',36,14,[hp[0]-2,hp[1]],6,col,o); o.beakc=null;
    const wingN=[[100,60],[128,40+flap],[166,30+flap*1.6],[190,42+flap*1.8],[150,56+flap*.6],[112,72]];reg(wingN);
    front+=P(smooth(wingN,true,.35),sp.wingc);
    front+=L(smooth([[104,62],[140,44+flap],[184,40+flap*1.7]],false),shade(sp.wingc,.7),1.2);
    front+=leg([92,72],[10,9],[40,20],[3,2.4,1.8],col,false);
    eyeS=eye(o.eyePos[0],o.eyePos[1],2.6);
  }
  /* -------------------- MEERESREPTILIEN & FISCHE -------------------- */
  else if(plan==='plesio'){
    const pts=[[10,86+sw*2,.6,.6],[32,80,7,7],[64,74,20,20],[92,74,22,22]];
    const neck=sp.pliosaur?[[110,68,15,15],[118,66,13,13]]:sp.short?[[112,66,10,10],[124,58,8,8]]:sp.xlong?[[114,64,10,10],[136,46,7,7],[160,30,6,6],[186,24,5.5,5.5],[206,26,5,5]]:[[114,64,10,10],[138,48,7,7],[160,40,6,6]];
    back+=P(smooth(reg([[60,88],[44,104+sw*6],[30,110+sw*8],[52,98],[70,90]])),far);
    back+=P(smooth(reg([[96,90],[86,106-sw*6],[74,114-sw*8],[96,100],[106,90]])),far);
    drawBody(pts.concat(neck));
    const hp=neck[neck.length-1];
    if(sp.pliosaur){ o.carn=true; over+=headAt('croc',54,30,[hp[0]-6,hp[1]],4,col,o); }
    else over+=headAt('croc',22,12,[hp[0]-2,hp[1]],6,col,o);
    front+=P(smooth(reg([[70,86],[62,104-sw*6],[46,114-sw*8],[68,100],[80,90]])),col);
    front+=P(smooth(reg([[104,88],[100,106+sw*6],[86,116+sw*8],[104,100],[114,90]])),col);
    eyeS=eye(o.eyePos[0],o.eyePos[1],2.4);
  }
  else if(plan==='swimmer'||plan==='fish'||plan==='whale'){
    const shark=sp.shark, big=sp.big?1.1:1, sm=sp.small?.8:1;
    const pts=plan==='whale'?[[8,70+sw*2,.6,.6],[40,68,6,6],[80,66,12,12],[120,64,16,16],[150,62,15,15]]
      :sp.eel?[[0,74+sw*5,.6,.6],[24,72+sw*3,5,5],[54,70+sw*1.5,9,9],[88,68,11,11],[118,67,11,11],[134,66,10,10]]
      :[[20,70+sw*3,.6,.6],[40,70+sw*1.5,6*sm,6*sm],[70,68,16*big*sm,16*big*sm],[104,66,20*big*sm,20*big*sm],[128,66,16*big*sm,16*big*sm]];
    const tail=pts[0];
    const tf=sp.tailfin==='moon'||shark?[[tail[0]+6,tail[1]],[tail[0]-10,tail[1]-22],[tail[0]-2,tail[1]],[tail[0]-12,tail[1]+20]]
      :plan==='whale'?[[tail[0]+6,tail[1]],[tail[0]-8,tail[1]-10],[tail[0]-4,tail[1]],[tail[0]-8,tail[1]+10]]
      :[[tail[0]+6,tail[1]],[tail[0]-12,tail[1]-12],[tail[0]-8,tail[1]],[tail[0]-12,tail[1]+14]];
    reg(tf); back+=P(smooth(tf,true,.3),far);
    if(sp.eel){ back+=P(smooth(reg([[20,68],[40,58],[80,54],[120,56],[110,62],[40,66]])),far); back+=P(smooth(reg([[20,78],[50,86],[80,82],[60,76]])),far); }
    else if(sp.fin||shark) back+=P(smooth(reg([[86,52],[98,30],[110,50]]),true,.3),far);
    else if(plan==='fish') back+=P(smooth(reg([[70,54],[86,42],[104,48],[96,56]])),far);
    if(sp.lobe&&plan==='fish'){ back+=P(smooth(reg([[50,58],[44,44],[58,48],[62,58]])),far); back+=P(smooth(reg([[54,78],[46,92+sw*3],[62,86],[64,76]])),far); }
    drawBody(pts);
    const hp=pts[pts.length-1];
    if(plan==='fish'){
      const HL=(sp.eel?18:26)*big*sm,HH=(sp.eel?20:30)*big*sm;
      const hd=[[hp[0]-10,hp[1]-HH*.5],[hp[0]+HL*.6,hp[1]-HH*.4],[hp[0]+HL,hp[1]],[hp[0]+HL*.6,hp[1]+HH*.4],[hp[0]-10,hp[1]+HH*.5]];reg(hd);
      over+=P(smooth(hd),sp.armorhead||col);
      if(sp.armorhead) over+=L(smooth([[hp[0]+2,hp[1]-HH*.4],[hp[0]+4,hp[1]],[hp[0]+2,hp[1]+HH*.4]],false),shade(sp.armorhead,.6),1.2);
      over+=L(smooth([[hp[0]+HL*.35,hp[1]+4],[hp[0]+HL*.95,hp[1]+2]],false),INK,1.4);
      if(sp.shark) over+=`<path d="M${hp[0]+HL*.45} ${hp[1]+5}l3 4 3-4 3 4 3-4" fill="#fff" stroke="${INK}" stroke-width=".6"/>`;
      o.eyePos=[hp[0]+HL*.45,hp[1]-HH*.12];
      if(sp.whorl){ const cx=hp[0]+HL*.55,cy=hp[1]+HH*.42; reg([[cx-12,cy-12],[cx+12,cy+12]]); over+=`<circle cx="${f1(cx)}" cy="${f1(cy)}" r="10" fill="#f5ecd8" stroke="${INK}" stroke-width="1.2"/>`;
        let d=`M${f1(cx)} ${f1(cy)}`; for(let a=0;a<3*Math.PI;a+=.3){const r=1+a*.95; d+=`L${f1(cx+Math.cos(a)*r)} ${f1(cy+Math.sin(a)*r)}`;} over+=L(d,'#b59c74',1);
        for(let i=0;i<10;i++){const a=i/10*2*Math.PI; over+=`<path d="M${f1(cx+Math.cos(a)*9)} ${f1(cy+Math.sin(a)*9)}l${f1(Math.cos(a+.6)*4)} ${f1(Math.sin(a+.6)*4)}" stroke="${INK}" stroke-width=".8"/>`;} }
      if(sp.scissor){ const x0=hp[0]+HL*.3,y0=hp[1]+4; reg([[x0+30,y0+10]]); over+=P(`M${f1(x0)} ${f1(y0)}q18 -2 26 8q-14 0 -26 -2z`,'#f5ecd8')+P(`M${f1(x0)} ${f1(y0+3)}q16 10 22 18q-12-6-22-14z`,'#f5ecd8'); }
      if(sp.eel){ const sx=hp[0]-4,sy=hp[1]-HH*.5; reg([[sx-26,sy-10]]); over+=P(`M${f1(sx)} ${f1(sy+2)}L${f1(sx-26)} ${f1(sy-8)}L${f1(sx-4)} ${f1(sy+6)}Z`,'#e8dcc0'); }
      if(sp.filter){ over+=P(`M${f1(hp[0]+HL*.3)} ${f1(hp[1]+2)}q${f1(HL*.4)} 10 ${f1(HL*.72)} -2`,'#3d3226','opacity=".75"'); }
      [[hp[0]-2,hp[1]-6],[hp[0]-6,hp[1]-2],[hp[0]-2,hp[1]+4]].forEach((p,i)=>over+=L(`M${p[0]} ${p[1]}q-3 5 0 10`,shade(col,.6),1));
      front+=P(smooth(reg([[104,76],[96,94+sw*4],[112,84]]),true,.3),sp.lobe?shade(col,.8):far);
    } else if(plan==='whale'){
      if(sp.sperm){ const hd=[[hp[0]-10,hp[1]-18],[hp[0]+30,hp[1]-20],[hp[0]+54,hp[1]-12],[hp[0]+56,hp[1]+6],[hp[0]+30,hp[1]+14],[hp[0]-10,hp[1]+16]];reg(hd);
        over+=P(smooth(hd,true,.4),col); over+=L(`M${f1(hp[0]+8)} ${f1(hp[1]+8)}L${f1(hp[0]+54)} ${f1(hp[1]+5)}`,INK,1.4);
        for(let i=0;i<7;i++) over+=`<path d="M${f1(hp[0]+14+i*6)} ${f1(hp[1]+7)}l2 5 2-5" fill="#fffaf0" stroke="${INK}" stroke-width=".6"/>`; o.eyePos=[hp[0]+14,hp[1]-4]; }
      else if(sp.manatee){ const hd=[[hp[0]-8,hp[1]-12],[hp[0]+14,hp[1]-12],[hp[0]+24,hp[1]-2],[hp[0]+22,hp[1]+12],[hp[0]-8,hp[1]+12]];reg(hd); over+=P(smooth(hd,true,.4),col); o.eyePos=[hp[0]+8,hp[1]-4];
        over+=`<circle cx="${f1(hp[0]+20)}" cy="${f1(hp[1]+2)}" r="1.2" fill="${INK}"/>`; }
      else over+=headAt('dolphin',sp.small?28:36,sp.small?20:26,[hp[0]-6,hp[1]],0,col,o);
      front+=P(smooth(reg([[120,76],[112,94+sw*4],[130,84]]),true,.3),far);
    } else {
      over+=headAt(sp.head||'croc',40,24,[hp[0]-6,hp[1]],0,col,o); o.carn=true;
      if(sp.flippers){ back+=P(smooth(reg([[78,74],[64,94-sw*4],[84,86]]),true,.3),far); front+=P(smooth(reg([[108,76],[98,98+sw*4],[122,86]]),true,.3),col); }
      else front+=P(smooth(reg([[110,78],[100,96+sw*4],[122,86]]),true,.3),far);
    }
    eyeS=eye(o.eyePos[0],o.eyePos[1],sp.head==='dolphin'?4:3);
  }
  /* -------------------- ECHSEN, AMPHIBIEN, SÄUGETIERE -------------------- */
  else if(plan==='lizard'||plan==='amphib'||plan==='mammal'){
    const mam=plan==='mammal', bulky=sp.bulky?1.15:1, sm=sp.small?.85:1, tall=sp.tall?1.25:1;
    let pts;
    if(mam) pts=[[36,62,11*bulky,12*bulky],[44,60,17*bulky,19*bulky],[58,59,21*bulky,23*bulky],[88,58,24*bulky,26*bulky],[116,58,22*bulky,24*bulky],[132,54,14,14]];
    else pts=[[4,82+sw*2,.6,.6],[26,80,5,5],[52,76,13*bulky,12*bulky],[84,74,17*bulky,17*bulky],[112,74,15*bulky,15*bulky],[128,72,10,10]];
    if(sp.mammoth) pts=[[26,60,.8,.8],[34,58,5,5],[56,54,26,28],[88,50,32,34],[118,52,28,30],[134,52,18,18]];
    if(sp.long) pts=[[0,82,.6,.6],[24,80,5,5],[52,78,10,10],[84,76,12,12],[112,76,11,11],[128,74,9,9]];
    if(mam&&sp.horse&&!sp.small) pts=pts.slice(0,5).concat([[130,44,12,12],[142,28,9,9]]);
    if(sp.giraffe||(mam&&sp.longneck)) pts=pts.slice(0,5).concat([[128,48,12,12],[138,22,8,8],[144,-2,7,7]]);
    if(mam&&!sp.mammoth){ const tl=sp.longtail?1:.45; back+=L(`M40 56Q${f1(40-26*tl)} ${f1(58+6*tl)} ${f1(40-30*tl)} ${f1(64+22*tl)}`,shade(col,.8),sp.horse?7:4.5); if(sp.horse) back+=L(`M40 56Q14 62 12 90`,'#4a3326',6); reg([[40-30*tl-4,64+22*tl+4]]); }
    const legL=mam?(sp.short?[14,12]:[20*tall,18*tall]):sp.upright?[16,14]:[10,9];
    const legW=mam?[8.5*bulky,7*bulky,5.5*bulky]:[5.5,4.5,3.8];
    const sprawl=mam||sp.upright?0:28;
    if(sp.sail){ const sa=[[56,70],[66,24],[86,14],[106,24],[114,68]]; back+=P(smooth(reg(sa)),sp.sail);
      for(let i=0;i<7;i++){const x=62+i*8; back+=L(`M${x} 70L${x+2} ${22+Math.abs(i-3)*3}`,shade(sp.sail,.7),1);} }
    if(sp.mammoth&&!sp.nofur) back+=P(smooth(reg([[70,30],[92,18],[120,24],[140,40],[100,40]])),shade(col,.9));
    back+=leg([pts[2][0]+10,pts[2][1]+8],legL,[sw*14-sprawl*.3,-6+sprawl],legW,far,true);
    back+=leg([pts[4][0]-4,pts[4][1]+8],legL,[-cw*12-sprawl*.3,-6+sprawl],legW,far,true);
    drawBody(pts, sp.bumps?armorDots(pts,{armor:shade(col,.85)}):'');
    const hp=pts[pts.length-1];
    let hType=mam?'mammal':'croc', HL=mam?30:26, HH=mam?24:16, hAng=mam?16:4;
    if(sp.giraffe){HL=24;HH=16;hAng=20;}
    if(sp.bighead){HL*=1.2;HH*=1.2;}
    if(sp.horse){hType='mammal';HL=30;HH=16;hAng=40;}
    if(plan==='amphib'){hType='croc';HL=24;HH=14;}
    if(sp.boomerang){ over+=P(smooth(reg([[hp[0]-4,hp[1]-6],[hp[0]-18,hp[1]-18],[hp[0]+10,hp[1]-6],[hp[0]+40,hp[1]-18],[hp[0]+26,hp[1]+8],[hp[0]-4,hp[1]+8]])),col); o.eyePos=[hp[0]+10,hp[1]-2]; }
    else if(sp.mammoth){
      const hd=[[hp[0]-10,hp[1]-20],[hp[0]+8,hp[1]-34],[hp[0]+26,hp[1]-26],[hp[0]+30,hp[1]-4],[hp[0]+18,hp[1]+16],[hp[0]-6,hp[1]+12]];reg(hd);
      over+=P(smooth(hd),col);
      const tr=[[hp[0]+24,hp[1]+4],[hp[0]+32,hp[1]+30+sw*3],[hp[0]+28,hp[1]+56+sw*4],[hp[0]+36,hp[1]+60],[hp[0]+40,hp[1]+32],[hp[0]+32,hp[1]-2]];reg(tr);
      over+=P(smooth(tr),col);
      over+=P(`M${hp[0]+18} ${hp[1]+10}Q${hp[0]+40} ${hp[1]+40} ${hp[0]+58} ${hp[1]+8}Q${hp[0]+42} ${hp[1]+30} ${hp[0]+24} ${hp[1]+18}Z`,'#f3ead6');
      reg([[hp[0]+58,hp[1]+4]]);
      o.eyePos=[hp[0]+14,hp[1]-12];
      over+=P(smooth([[hp[0]-2,hp[1]-14],[hp[0]-14,hp[1]-2],[hp[0]-6,hp[1]+14],[hp[0]+6,hp[1]+2]]),shade(col,.85));
    } else {
      over+=headAt(hType,HL,HH,[hp[0]-4,hp[1]],hAng+sw,col,o);
      o.carn=true;
      if(hType==='mammal'){ const e=o.eyePos; over=P(smooth([[e[0]-10,e[1]-4],[e[0]-8,e[1]-14],[e[0]-2,e[1]-6]],true,.3),shade(col,.85))+over; }
      if(sp.saber) over+=P(`M${f1(o.eyePos[0]+10)} ${f1(o.eyePos[1]+10)}q2 12 -1 18 q-2 -8 -4 -17z`,'#fffaf0');
      if(sp.tusks) over+=P(`M${f1(o.eyePos[0]+12)} ${f1(o.eyePos[1]+10)}q4 6 1 12 l-3-10z`,'#fffaf0');
      if(sp.knobs) [[0,-12],[8,-14],[16,-10]].forEach(([dx,dy])=>over+=P(`M${f1(o.eyePos[0]+dx-3)} ${f1(o.eyePos[1]+dy+4)}l3-8 3 8z`,shade(col,.9)));
      if(sp.rhino){ over+=P(`M${f1(o.eyePos[0]+18)} ${f1(o.eyePos[1]+2)}l6-20 4 20z`,'#e9dcc0'); over+=P(`M${f1(o.eyePos[0]+10)} ${f1(o.eyePos[1]-2)}l3-10 3 10z`,'#e9dcc0');}
      if(sp.antlers) over+=L(`M${f1(o.eyePos[0]-4)} ${f1(o.eyePos[1]-8)}q-6-20-24-26 m14 10 q-4-12 4-20 m-18 14 q-14-2-18 8`,'#d9c49a',3.5);
      if(sp.rabbit){ const e=o.eyePos; over=P(smooth([[e[0]-8,e[1]-6],[e[0]-14,e[1]-34],[e[0]-8,e[1]-38],[e[0]-2,e[1]-8]]),col)+P(smooth([[e[0]-2,e[1]-6],[e[0]-2,e[1]-34],[e[0]+4,e[1]-36],[e[0]+4,e[1]-8]]),shade(col,.92))+over; reg([[e[0]-14,e[1]-40]]); }
      if(sp.catears){ const e=o.eyePos; over=P(`M${f1(e[0]-10)} ${f1(e[1]-6)}l2-14 8 10z`,col)+P(`M${f1(e[0]-2)} ${f1(e[1]-8)}l5-12 5 12z`,col)+over; }
      if(sp.dogears){ const e=o.eyePos; over+=P(smooth([[e[0]-8,e[1]-8],[e[0]-16,e[1]+2],[e[0]-12,e[1]+14],[e[0]-4,e[1]-2]]),shade(col,.8)); }
      if(sp.giraffe){ const e=o.eyePos; over+=L(`M${f1(e[0]-4)} ${f1(e[1]-8)}l-2-10M${f1(e[0]+2)} ${f1(e[1]-8)}l0-10`,shade(col,.6),3); }
      if(sp.mane){ const a=pts[pts.length-2],b=pts[pts.length-1]; for(let i=0;i<5;i++){const u=i/5,x=b[0]+(a[0]-b[0])*u*1.4-6,y=b[1]+(a[1]-b[1])*u*1.4-8; back+=L(`M${f1(x)} ${f1(y)}q-6 4 -8 12`,'#4a3326',4);} }
      if(sp.pig) over+=P(`M${f1(o.eyePos[0]+22)} ${f1(o.eyePos[1]+2)}q6 0 6 6 -6 4 -6-6z`,shade(col,1.3));
    }
    front+=leg([pts[2][0]+16,pts[2][1]+10],legL,[-sw*14+sprawl*.3,-6+sprawl],legW.map(w=>w*1.05),col,true);
    front+=leg([pts[4][0]+2,pts[4][1]+10],legL,[cw*12+sprawl*.3,-6+sprawl],legW.map(w=>w*1.05),col,true);
    if(sp.pat==='fur'||(sp.mammoth&&!sp.nofur)){ for(let i=1;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];for(let k=0;k<4;k++){const u=k/4,x=a[0]+(b[0]-a[0])*u,y=a[1]+a[3]+(b[1]+b[3]-a[1]-a[3])*u; if(a[3]<8)continue; body+=L(`M${f1(x)} ${f1(y-8)}q2 5 -1 ${f1(9+(k%2)*3)}`,shade(col,.62),1.5);}}
      for(let i=0;i<10;i++){const x=50+i*8,y=pts[2][1]-8+(i%3)*6; body+=L(`M${x} ${y}q3 4 0 8`,shade(col,.7),1.1,'opacity=".6"');} }
    if(plan==='amphib'&&sp.fishy) front+=P(smooth(reg([[2,82],[-4,72],[14,78]]),true,.3),far);
    eyeS=eye(o.eyePos[0],o.eyePos[1],mam?3.3:2.8);
  }
  else if(plan==='snake'){
    const pts=[];for(let i=0;i<=10;i++){const x=10+i*15,y=80+Math.sin(i*.9+ph*6.28)*14;pts.push([x,y,i===0?.6:Math.min(9,2+i*1.2),i===0?.6:Math.min(9,2+i*1.2)]);}
    drawBody(pts);
    const hp=pts[pts.length-1]; over+=headAt('croc',22,16,[hp[0]-4,hp[1]],0,col,o);
    eyeS=eye(o.eyePos[0],o.eyePos[1],2.6);
    over+=L(`M${f1(hp[0]+18)} ${f1(hp[1]+2)}l8 0 m-2 0 l3 -2 m-3 2 l3 2`,'#c8553d',1.2);
  }
  else if(plan==='insect'){
    const flap=sw*12;
    back+=P(smooth(reg([[96,64],[70,30-flap],[30,24-flap],[40,40-flap*.5],[88,66]])),sp.wingc,'opacity=".85"');
    back+=P(smooth(reg([[90,68],[60,82+flap*.4],[26,86+flap*.6],[40,76],[84,66]])),sp.wingc,'opacity=".75"');
    const pts=[[10,70,.8,.8],[40,70,3.5,3.5],[80,68,5,5],[104,66,7,7],[116,66,8,8]];
    drawBody(pts,'');
    for(let i=0;i<6;i++) body+=L(`M${22+i*12} 66l0 8`,shade(col,.6),1);
    over+=`<circle cx="124" cy="64" r="9" fill="${shade(col,1.2)}" stroke="${INK}" stroke-width="1.2" stroke-opacity=".75"/>`;
    o.eyePos=[127,61]; reg([[134,56]]);
    front+=P(smooth(reg([[106,62],[140,26+flap],[180,20+flap],[168,36+flap*.5],[112,66]])),sp.wingc,'opacity=".85"');
    front+=P(smooth(reg([[108,70],[140,86-flap*.4],[176,94-flap*.6],[160,78],[112,68]])),sp.wingc,'opacity=".75"');
    for(let i=0;i<3;i++) front+=L(`M${104+i*6} 72l-4 12 -3 4`,INK,1.1);
    eyeS=eye(o.eyePos[0],o.eyePos[1],4.2);
  }
  else if(plan==='crawler'){
    const n=sp.scorpion?7:12;const pts=[];for(let i=0;i<=n;i++){pts.push([20+i*(130/n),84+Math.sin(i*.8+ph*6.28)*2,i===0?1:7,i===0?1:7]);}
    for(let i=1;i<n;i++){const p=pts[i];back+=L(`M${f1(p[0])} ${f1(p[1]+4)}l${f1(-3+Math.sin(ph*6.28+i)*3)} 12`,far,2);}
    drawBody(pts,'');
    for(let i=1;i<n;i++) body+=L(`M${f1(pts[i][0])} ${f1(pts[i][1]-7)}l0 14`,shade(col,.6),1);
    const hp=pts[n]; over+=`<ellipse cx="${f1(hp[0]+6)}" cy="${f1(hp[1])}" rx="10" ry="8" fill="${col}" stroke="${INK}" stroke-width="1.3" stroke-opacity=".75"/>`;
    if(sp.scorpion){ over+=L(smooth([[pts[0][0],pts[0][1]],[4,70],[10,50],[26,48]],false),col,6); over+=P(`M24 44l8 4-7 4z`,shade(col,.7));
      over+=P(smooth([[hp[0]+12,hp[1]-2],[hp[0]+28,hp[1]-12],[hp[0]+36,hp[1]-6],[hp[0]+28,hp[1]+2]]),col); }
    o.eyePos=[hp[0]+10,hp[1]-3]; reg([[hp[0]+40,hp[1]-14],[0,40]]);
    eyeS=eye(o.eyePos[0],o.eyePos[1],2.4);
  }
  else if(plan==='trilo'){
    const c=col; let s='';
    s+=P('M60 60Q100 26 140 60Q146 68 138 72L62 72Q54 68 60 60Z',shade(c,1.1));
    s+=P('M62 72Q56 104 72 118Q100 128 128 118Q144 104 138 72Z',c);
    for(let i=0;i<5;i++) s+=L(`M${60+i} ${80+i*8}L${140-i} ${80+i*8}`,shade(c,.6),1.2);
    s+=L('M90 50Q86 90 92 122M110 50Q114 90 108 122',shade(c,.6),1.4);
    s+=eye(84,58,3.2)+eye(116,58,3.2);
    s+=L('M60 64Q44 80 48 104M140 64Q156 80 152 104',INK,1.4);
    body=s; reg([[40,26],[160,130]]);
  }
  else if(plan==='ammonite'){
    let s=`<circle cx="100" cy="76" r="44" fill="${col}" stroke="${INK}" stroke-width="1.5" stroke-opacity=".75"/>`;
    let d='M100 76';for(let a=0;a<4*Math.PI;a+=.15){const r=3+a*3.2;d+=`L${f1(100+Math.cos(a)*r)} ${f1(76+Math.sin(a)*r)}`;}
    s+=L(d,shade(col,.55),1.8);
    for(let i=0;i<14;i++){const a=i/14*2*Math.PI;s+=L(`M${f1(100+Math.cos(a)*30)} ${f1(76+Math.sin(a)*30)}L${f1(100+Math.cos(a)*43)} ${f1(76+Math.sin(a)*43)}`,shade(col,.7),1.1);}
    body=s; reg([[52,28],[148,124]]);
  }
  else if(plan==='turtle'){
    const sh=sp.shell||shade(col,.9);
    back+=P(smooth(reg([[132,80],[154,100+sw*8],[176,112+sw*10],[160,92],[140,78]]),true,.35),far);
    back+=P(smooth(reg([[58,82],[44,96-sw*4],[36,102-sw*5],[52,94],[66,84]]),true,.35),far);
    back+=P(smooth(reg([[42,76],[28,78],[40,82]]),true,.3),far);
    const cara=[[42,80],[50,50],[80,34],[112,32],[140,42],[152,70],[146,82],[96,88]];reg(cara);
    body+=P(smooth(cara,true,.45),sh);
    body+=L('M50 72Q96 60 148 70M60 56Q96 44 140 54M80 40Q84 60 82 84M112 36Q114 60 112 86',shade(sh,.7),1.4);
    body+=P(smooth(reg([[44,80],[96,90],[146,82],[140,90],[96,96],[50,90]]),true,.4),bel);
    const nk=[[140,72],[158,70],[166,68]]; body+=L(`M140 74Q154 70 162 70`,col,11)+L(`M140 74Q154 70 162 70`,INK,1,'opacity=".25"');
    over+=headAt('beak',28,20,[160,70],4,col,o); o.beakc=shade(col,.8);
    front+=P(smooth(reg([[124,84],[144,108-sw*8],[168,120-sw*10],[150,96],[134,82]]),true,.35),col);
    front+=P(smooth(reg([[62,86],[52,102+sw*4],[44,110+sw*5],[60,98],[72,88]]),true,.35),col);
    eyeS=eye(o.eyePos[0],o.eyePos[1],2.8);
  }
  else if(plan==='anomalo'){
    // von oben gesehen: Körper, Seitenlappen, Schwanzfächer, Greifarme
    const lob=[];for(let i=0;i<9;i++){const x=40+i*12,w=16-Math.abs(i-4)*1.6,wv=Math.sin(ph*6.28+i*.8)*4;
      back+=P(`M${x-5} 68Q${x} ${50-w+wv} ${x+8} ${56-w*.3+wv}Q${x+9} 64 ${x+6} 70Z`,shade(col,.92));
      back+=P(`M${x-5} 82Q${x} ${100+w-wv} ${x+8} ${94+w*.3-wv}Q${x+9} 86 ${x+6} 80Z`,shade(col,.92)); lob.push([x,50-w],[x,100+w]);}
    reg(lob);
    [[26,62],[18,75],[26,88]].forEach(([x,y])=>back+=P(`M40 75L${x} ${y-6}Q${x-8} ${y} ${x} ${y+6}Z`,far)); reg([[10,56],[10,94]]);
    const bd=[[34,75],[60,64],[110,62],[146,66],[156,75],[146,84],[110,88],[60,86]];reg(bd);
    bodyPath=smooth(bd,true,.45); body+=P(bodyPath,col);
    for(let i=0;i<8;i++) body+=L(`M${50+i*12} 66Q${54+i*12} 75 ${50+i*12} 84`,shade(col,.7),1);
    // Greifarme
    const arm=(dy)=>{let d=`M150 ${75+dy*6}`;const pts=[[164,75+dy*14],[178,75+dy*18],[186,75+dy*12],[184,75+dy*4]];pts.forEach(p=>d+=`L${p[0]} ${p[1]}`);reg(pts);
      let s=L(d,shade(col,.85),5); pts.forEach(p=>s+=L(`M${p[0]} ${p[1]}l${-3} ${dy*-5}`,INK,1));return s;};
    over+=arm(-1)+arm(1);
    over+=L('M146 70L156 58M146 80L156 92',INK,1.6); o.eyePos=[157,57]; eyeS=eye(157,57,4)+eye(157,93,4); reg([[162,52],[162,98]]);
  }
  else if(plan==='orthocone'){
    const st=sp.stripe||shade(col,.6);
    const cone=[[8,72],[122,58],[132,62],[132,84],[122,88],[8,74]];reg(cone);
    bodyPath=smooth(cone,true,.2); body+=P(bodyPath,col);
    for(let i=0;i<9;i++){const x=20+i*12,h=(x-8)/124*14+1; body+=L(`M${x} ${73-h}q3 ${h} 0 ${h*2}`,shade(col,.7),1.1);}
    for(let i=0;i<5;i++){const x=16+i*22,h=(x-8)/124*14+1; body+=L(`M${x} ${73-h*.6}l14 ${-2}`,st,3,'opacity=".6"');}
    const hb=[[130,62],[146,62],[152,73],[146,84],[130,84]];reg(hb); over+=P(smooth(hb,true,.4),shade(col,1.12));
    for(let i=0;i<6;i++){const y=64+i*4,w=Math.sin(ph*6.28+i)*5; const t=[[150,y],[166,y-4+w],[182,y+2+w*1.3]]; reg(t); front+=L(`M${t[0][0]} ${t[0][1]}Q${t[1][0]} ${t[1][1]} ${t[2][0]} ${t[2][1]}`,shade(col,1.05),3.2);}
    o.eyePos=[142,68]; eyeS=eye(142,68,3.2);
  }
  else if(plan==='eurypterid'){
    // von oben: Kopfschild, Segmente, Schwanzstachel, Paddel
    const pd=Math.sin(ph*6.28)*8;
    back+=P(smooth(reg([[132,64],[112,40+pd],[98,34+pd],[108,52],[124,66]]),true,.35),far);
    back+=P(smooth(reg([[132,86],[112,110-pd],[98,116-pd],[108,98],[124,84]]),true,.35),far);
    for(let i=0;i<3;i++){const x=150+i*8; back+=L(`M${x} 66l${6-i*2} -12M${x} 84l${6-i*2} 12`,INK,1.6);} reg([[160,50],[160,100]]);
    const seg=[];for(let i=0;i<10;i++){const x=128-i*10,w=18-i*1.2; seg.push([x,75-w],[x,75+w]);}
    const bd=[[160,75],[156,58],[140,54],[128,57],[90,60],[40,68],[20,74],[40,82],[90,90],[128,93],[140,96],[156,92]];reg(bd);
    bodyPath=smooth(bd,true,.4); body+=P(bodyPath,col);
    for(let i=0;i<9;i++){const x=122-i*10,w=16-i*1.2; body+=L(`M${x} ${75-w}q-3 ${w} 0 ${w*2}`,shade(col,.65),1.1);}
    body+=P(smooth([[160,75],[156,60],[138,56],[130,75],[138,94],[156,90]],true,.4),shade(col,1.1));
    over+=P('M22 72L-6 75L22 78Z',shade(col,.8)); reg([[-8,75]]);
    o.eyePos=[148,68]; eyeS=eye(148,66,2.6)+eye(148,84,2.6);
  }
  // Mund / Stimmung
  if(o.eyePos&&!['trilo','ammonite','insect','crawler','anomalo','orthocone','eurypterid'].includes(plan)){
    const e=o.eyePos;
    if(opts.mood==='chew') over+=`<ellipse cx="${f1(e[0]+10)}" cy="${f1(e[1]+9)}" rx="3" ry="${1.5+Math.abs(sw)*2}" fill="#7a3b2e"/>`;
    if(opts.mood==='sad') over+=L(`M${f1(e[0]-4)} ${f1(e[1]-6)}l7 2`,INK,1.2);
    if(opts.mood==='happy') over+=`<circle cx="${f1(e[0]+1)}" cy="${f1(e[1]+6)}" r="2.2" fill="#e9967a" opacity=".6"/>`;
  }
  // Bounding Box
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; all.forEach(p=>{x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1]);});
  const pad=opts.pad??6; x0-=pad;y0-=pad;x1+=pad;y1+=pad;
  if(opts.box){[x0,y0,x1,y1]=opts.box;}
  const w=x1-x0,h=y1-y0;
  const flip=opts.flip?` transform="translate(${f1(x0+x1)} 0) scale(-1 1)"`:'';
  const shadow=opts.shadow===false?'':`<ellipse cx="${f1((x0+x1)/2)}" cy="${f1(y1-pad*.6)}" rx="${f1(w*.36)}" ry="${f1(Math.max(2.5,h*.03))}" fill="#3d3226" opacity=".13"/>`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f1(x0)} ${f1(y0)} ${f1(w)} ${f1(h)}" ${opts.attrs||''}>`+
   `<defs>${filters(uid)}<clipPath id="${clip}"><path d="${bodyPath}"/></clipPath></defs>`+
   `${['fish','swimmer','plesio','whale','insect','ptero','turtle','anomalo','orthocone','eurypterid'].includes(plan)?'':shadow}<g filter="url(#w${uid})"${flip}>${back}${body}${over}${front}${eyeS}</g></svg>`;
  return svg;
};
function aliasOf(id){const m={'tyrannosaurus':'trex','tyrannosaurus-rex':'trex','t-rex':'trex','rex':'trex','trike':'triceratops','brachi':'brachiosaurus','stego':'stegosaurus','velo':'velociraptor','ptera':'pteranodon','ankylo':'ankylosaurus','para':'parasaurolophus','spino':'spinosaurus','plesio':'plesiosaurus','mosa':'mosasaurus','bronto':'brontosaurus','trico':'triceratops','mammoth':'mammut','diplo':'diplodocus'};return m[id];}
ART.resolve=id=>SP[id]?id:(aliasOf(id)||null);
ART.has=id=>!!(SP[id]||aliasOf(id));

function pattern(sp,pts,uid){
  if(!sp.pat||sp.pat==='none'||sp.pat==='fur') return '';
  const c=sp.patc||shade(sp.col,.7); let s='';
  if(sp.pat==='stripes'){
    for(let i=1;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];for(let k=0;k<2;k++){const u=k/2,x=a[0]+(b[0]-a[0])*u,y=a[1]+(b[1]-a[1])*u,r=a[2]+(b[2]-a[2])*u;
      if(r<5) continue; s+=`<path d="M${f1(x-2)} ${f1(y-r-2)}q${f1(4)} ${f1(r*.6)} ${f1(1)} ${f1(r*.9)}" fill="none" stroke="${c}" stroke-width="${f1(Math.max(2,r*.28))}" stroke-linecap="round" opacity=".55"/>`;}}
  } else if(sp.pat==='spots'){
    let seed=sp.col.length*7+pts.length;const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280;};
    for(let i=1;i<pts.length-1;i++){const a=pts[i];if(a[2]<6)continue;for(let k=0;k<3;k++){const x=a[0]+(rnd()-.5)*a[2]*1.4,y=a[1]-a[2]*(.2+rnd()*.6);
      s+=`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(1.6+rnd()*a[2]*.12)}" ry="${f1(1.3+rnd()*a[2]*.09)}" fill="${c}" opacity=".5"/>`;}}
  }
  return s;
}
function armorDots(pts,sp){let s='';for(let i=2;i<pts.length-1;i++){const a=pts[i];for(let k=-2;k<=2;k++){const x=a[0]+k*a[2]*.32,y=a[1]-a[2]*.55-Math.abs(k)*-1.5;
  s+=`<path d="M${f1(x-3.5)} ${f1(y+2)}l3.5 -6 3.5 6z" fill="${sp.armor}" stroke="${INK}" stroke-width=".7" stroke-opacity=".6"/>`;}}return s;}
function crest(sp,hp,HL,HH,ang){
  const c=sp.crestc||shade(sp.col,.8), M=p=>rot(p,rad(ang),[hp[0]-4,hp[1]]);
  let pts;
  switch(sp.crest){
    case 'tube': pts=[[HL*.3,-HH*.4],[-HL*.5,-HH*1.3],[-HL*1.1,-HH*1.8],[-HL*1.15,-HH*1.5],[-HL*.3,-HH*.9],[HL*.5,-HH*.2]];break;
    case 'helmet': pts=[[HL*.05,-HH*.3],[HL*.1,-HH*1.3],[HL*.55,-HH*1.4],[HL*.75,-HH*.3]];break;
    case 'double': return P(smooth(creg(tp([[HL*.2,-HH*.35],[HL*.25,-HH*1.2],[HL*.85,-HH*.5],[HL*.9,-HH*.2]],M))),c)+P(smooth(tp([[HL*.1,-HH*.3],[HL*.05,-HH*1.1],[HL*.7,-HH*.45],[HL*.75,-HH*.2]],M)),shade(c,.85));
    case 'horns': pts=[[HL*.28,-HH*.45],[HL*.34,-HH*.78],[HL*.44,-HH*.45]];break;
    case 'bullhorns': pts=[[HL*.2,-HH*.45],[HL*.1,-HH*.95],[HL*.38,-HH*.5]];break;
    case 'nosehorn': pts=[[HL*.72,-HH*.35],[HL*.8,-HH*.8],[HL*.88,-HH*.35]];break;
    default: return '';
  }
  return P(smooth(creg(tp(pts,M)),true,.4),c);
}

/* =====================================================================
   AVATARE – Forscherinnen & Forscher (Kinder und Erwachsene)
   Seitenansicht mit Laufanimation (ART.avatar, für Karte & Stationen) und
   Vorderansicht (ART.avatarFront, für Startbildschirm, Profile, Figur-Baukasten).
   Felder einer Figur (alle optional außer skin/hair/shirt/pants):
     age:'kid'|'adult', g:'f'|'m'|'n' (Vorschlag für die Stimme),
     style: short|pony|braids|curly|bun|long|afro|bob|buzz|scarf,
     hatType: safari|cap|bucket|bandana|wide|none, hat (Farbe),
     vest (Farbe der Forscherweste), tool: pinsel|hammer|lupe, beard, glasses, scarf (Farbe Kopftuch)
   ===================================================================== */
ART.AVATARS=[
 /* Paläontologinnen & Paläontologen (Startbildschirm) */
 {id:'frida', name:'Frida', g:'f', age:'adult', skin:'#f3d2b8', hair:'#b5562e', shirt:'#8fb0c8', pants:'#6b5a45', vest:'#c9ae74', hat:'#d9b36c', hatType:'safari', style:'braids', tool:'pinsel', role:'Paläontologin'},
 {id:'amara', name:'Amara', g:'f', age:'adult', skin:'#7a4e33', hair:'#1f1a16', shirt:'#f3ead6', pants:'#8a6d4a', vest:'#7fa66a', hat:'#e0b44c', hatType:'bucket', style:'afro', tool:'lupe', glasses:true, role:'Paläontologin'},
 {id:'kenji', name:'Kenji', g:'m', age:'adult', skin:'#ecc9a0', hair:'#1f1a16', shirt:'#d98b5f', pants:'#4f6f7f', vest:'#c9a45c', hat:'#3b6f8a', hatType:'cap', style:'short', tool:'hammer', glasses:true, role:'Paläontologe'},
 {id:'omar', name:'Omar', g:'m', age:'adult', skin:'#b07a55', hair:'#3d2b1f', shirt:'#e9c46a', pants:'#5f6f5a', vest:'#9a8a72', hat:'#a8784a', hatType:'wide', style:'short', tool:'pinsel', beard:true, role:'Paläontologe'},
 /* Forscherkinder (bisherige Figuren – IDs bleiben für alte Spielstände) */
 {id:'mia', name:'Mia', g:'f', age:'kid', skin:'#f1c9a5', hair:'#7a4a2a', shirt:'#d98b5f', pants:'#5f7f95', hat:'#d9b36c', hatType:'safari', style:'pony'},
 {id:'ben', name:'Ben', g:'m', age:'kid', skin:'#e8b88f', hair:'#3d2b1f', shirt:'#7fa66a', pants:'#8a6d4a', hat:'#c9a45c', hatType:'safari', style:'short'},
 {id:'ayo', name:'Ayo', g:'m', age:'kid', skin:'#9a6848', hair:'#2a1f18', shirt:'#e0b44c', pants:'#4f6f7f', hat:'#d98b5f', hatType:'safari', style:'curly'},
 {id:'lina', name:'Lina', g:'f', age:'kid', skin:'#c89572', hair:'#1f1a16', shirt:'#8fb0c8', pants:'#b56a5c', hat:'#8fae6a', hatType:'safari', style:'braids'},
 /* weitere Figuren für „Eigene Figur“ */
 {id:'kim', name:'Kim', g:'n', age:'kid', skin:'#e3b48a', hair:'#5a3a26', shirt:'#b58cbd', pants:'#5f7f95', hat:'#8fbf7a', hatType:'cap', style:'bob', tool:'lupe'},
 {id:'sam', name:'Sam', g:'n', age:'kid', skin:'#5e3d28', hair:'#1f1a16', shirt:'#e07a6a', pants:'#6b5a45', hat:'#f0c35a', hatType:'bandana', style:'buzz', tool:'pinsel'},
 {id:'robin', name:'Robin', g:'n', age:'adult', skin:'#d9a47f', hair:'#9a9187', shirt:'#f0d8a8', pants:'#5f7f95', vest:'#6f8f9f', hat:'#c9b88f', hatType:'none', style:'bun', tool:'lupe', glasses:true, role:'Forscher·in'},
 {id:'leyla', name:'Leyla', g:'f', age:'adult', skin:'#d6a27c', hair:'#2a1f18', shirt:'#b56a5c', pants:'#4f5f6f', vest:'#d9b36c', hat:'#d9b36c', hatType:'none', style:'scarf', scarf:'#5f9a95', tool:'hammer', role:'Paläontologin'},
];
ART.PRESETS=['frida','amara','kenji','omar'];
ART.avatarById=id=>ART.AVATARS.find(a=>a.id===id)||null;

/* Kopf (Haare, Hut, Gesicht) in Kind-Koordinaten: Mitte 52/22, Radius 12 – Seitenansicht */
function avHeadSide(a,opts){
  let s=''; const st=a.style||'short', hc=a.hair||'#3d2b1f';
  // Haare hinter dem Kopf
  if(st==='afro') s+=`<g fill="${hc}" stroke="${INK}" stroke-width=".9" stroke-opacity=".5"><circle cx="46" cy="15" r="11"/><circle cx="41" cy="24" r="8"/><circle cx="56" cy="11" r="8"/></g>`;
  if(st==='long') s+=P('M40 17q-7 12-3 24l7-2q-3-10 1-19z',hc);
  if(st==='bun') s+=`<circle cx="${opts.nohat||a.hatType==='none'?42:39}" cy="${opts.nohat||a.hatType==='none'?10:19}" r="5" fill="${hc}" stroke="${INK}" stroke-width="1" stroke-opacity=".6"/>`;
  if(st==='scarf') s+=P('M38 20q-2-14 14-15t14 13q0 8-4 12l-2 8q-8 5-18 2-5-8-4-20z',a.scarf||'#5f9a95');
  s+=`<circle cx="52" cy="22" r="12" fill="${a.skin}" stroke="${INK}" stroke-width="1.4" stroke-opacity=".75"/>`;
  if(st==='pony') s+=P('M40 20q-8 6-4 16 2-6 6-8z',hc);
  if(st==='braids') s+=P('M41 24q-5 8-2 16l3-1q-2-7 2-13z',hc);
  if(st==='curly') s+=`<g fill="${hc}" stroke="${INK}" stroke-width=".8" stroke-opacity=".5"><circle cx="42" cy="18" r="4"/><circle cx="44" cy="25" r="3.6"/></g>`;
  if(st==='bob') s+=P('M40 16q-3 10 1 17l6-1q-3-7-1-14z',hc);
  if(st==='scarf'){ s+=P('M40 17q2-12 13-12t13 11q-7-4-13-3t-13 4z',a.scarf||'#5f9a95')+P('M41 20q-3 8 1 15l4-1q-2-6 0-12z',shade(a.scarf||'#5f9a95',.9)); }
  else if(st==='buzz') s+=P('M40 19q2-10 12-10t12 7q-6-2-12-1-6 1-12 4z',hc,'opacity=".85"');
  else s+=P('M40 18q2-9 12-9t12 8q-6-3-12-2-6 1-12 3z',hc);
  if(a.beard) s+=P('M50 27q1 7 7 8t8-6q-2 1-6 1t-9-3z',hc)+P('M58 29q3-1 6 0',hc);
  // Hut
  const ht=opts.nohat?'none':(a.hatType||'safari'), h=a.hat||'#d9b36c';
  if(ht==='safari'){ s+=P('M36 15q16-6 32 0l2 3q-18-4-36 0z',shade(h,.85))+P('M42 14q1-10 10-10t10 9q-10-3-20 1z',h)+L('M42.5 12.5q9.5-3 19 .5',shade(h,.7),1.6); }
  if(ht==='wide'){ s+=P('M31 16q21-7 42 0l3 3q-24-5-48 0z',shade(h,.85))+P('M42 14q1-11 10-11t10 10q-10-3-20 1z',h)+L('M42.5 12q9.5-3 19 .5',shade(h,.65),2); }
  if(ht==='cap'){ s+=P('M40 17q0-12 12-12t12 11z',h)+P('M62 15q8-1 10 3l-10 0z',shade(h,.85))+`<circle cx="51" cy="5.5" r="1.6" fill="${shade(h,.8)}"/>`; }
  if(ht==='bucket'){ s+=P('M42 15q0-11 10-11t10 11z',h)+P('M38 16q14-4 28 0l3 5q-17-5-34 0z',shade(h,.88)); }
  if(ht==='bandana'){ s+=P('M40 17q1-9 12-9t12 8q-12-3-24 1z',h)+P('M41 16l-7 3 1 3 7-3z',shade(h,.85))+`<circle cx="50" cy="12" r="1.2" fill="#fff" opacity=".7"/><circle cx="57" cy="11.5" r="1.2" fill="#fff" opacity=".7"/>`; }
  if(opts.glasses||a.glasses) s+=`<circle cx="58" cy="23" r="4.2" fill="rgba(223,240,244,.35)" stroke="${INK}" stroke-width="1.2"/><path d="M54 22l-6-1" stroke="${INK}" stroke-width="1"/>`;
  s+=eye(58,23,2.3)+`<path d="M58 30q3 2 5 0" fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round"/><circle cx="61" cy="27" r="2" fill="#e9967a" opacity=".45"/>`;
  return s;
}
/* Werkzeug in der Hand (Seitenansicht), hx/hy = Handposition */
function avTool(t,hx,hy){
  if(t==='lupe') return L(`M${f1(hx)} ${f1(hy)}l3 -3`,'#8a5e3e',2.4)+`<circle cx="${f1(hx+5)}" cy="${f1(hy-5)}" r="5" fill="#dff0f4" stroke="#5a4630" stroke-width="2"/>`;
  if(t==='pinsel') return L(`M${f1(hx-1)} ${f1(hy+2)}L${f1(hx+6)} ${f1(hy-9)}`,'#b8926a',2.4)+P(`M${f1(hx+5)} ${f1(hy-8)}l3 -6 3 2 -3 6z`,'#e0c28a','stroke-width="1"');
  if(t==='hammer') return L(`M${f1(hx-1)} ${f1(hy+3)}L${f1(hx+5)} ${f1(hy-10)}`,'#8a6d4a',2.6)+P(`M${f1(hx+1)} ${f1(hy-12)}l9 2 -1 4 -9 -2z`,'#7d8791','stroke-width="1"');
  return '';
}
ART.avatar=function(a,opts={}){
  const uid=++UID, ph=opts.ph||0, sw=Math.sin(ph*2*Math.PI), bob=Math.abs(Math.cos(ph*2*Math.PI))*1.5;
  const adult=a.age==='adult';
  // Körpermaße: Kind (Standard) bzw. Erwachsene (kleinerer Kopf, längere Beine)
  const T=adult?25:30, B=adult?60:66, HIP=adult?60:64, LEG=adult?20:16, AY=adult?34:40, ARM=adult?18:15;
  const legA=sw*(adult?22:24), armA=-sw*26;
  const lg=(x,an,c)=>{const k=rot([0,LEG],rad(an),[x,HIP]);return L(`M${x} ${HIP}L${f1(k[0])} ${f1(k[1])}`,c,adult?7:6.5)+`<ellipse cx="${f1(k[0]+2)}" cy="${f1(k[1]+1)}" rx="${adult?5:4.4}" ry="2.6" fill="#5a4630"/>`;};
  let s='';
  s+=`<ellipse cx="50" cy="82" rx="15" ry="3" fill="#3d3226" opacity=".15"/>`;
  s+=`<g transform="translate(0 ${f1(-bob)})">`;
  s+=lg(47,-legA,shade(a.pants,.8));
  // Rucksack (Erwachsene: großer Expeditionsrucksack mit Isomatte)
  if(adult) s+=P(`M35 ${T+6}q-9 2-9 14v12q0 6 7 6h7V${T+6}z`,'#a8724a')+P(`M27 ${T+4}q0-4 6-4h4q4 0 4 4t-4 4h-4q-6 0-6-4z`,'#8fae9a')+P(`M28 ${T+18}h8v8h-8z`,'#c69063','stroke-width="1"');
  else s+=P('M34 38q-6 2-6 12v10q0 5 6 5h6V38z','#a8724a');
  const armB=rot([0,ARM],rad(-armA),[44,AY]); s+=L(`M44 ${AY}L${f1(armB[0])} ${f1(armB[1])}`,shade(a.skin,.85),5);
  s+=P(`M38 ${T+6}q0-6 12-6t12 6l2 ${B-T-6}H36z`,a.shirt);
  s+=P(`M37 ${B-6}h26l1 8H36z`,a.pants);
  if(a.vest&&!opts.coat){ s+=P(`M37.5 ${T+6}q0-6 10-6h7l1.5 ${B-T-10}H36.5z`,a.vest)+P(`M40 ${T+14}h7v6h-7z`,shade(a.vest,.88),'stroke-width="1"')+L(`M55 ${T+2}l1 ${B-T-12}`,shade(a.vest,.7),1)+L(`M44 ${T+1}l-2 ${B-T-12}`,'#6e4a30',2.2); }
  else if(!opts.coat) s+=L(`M46 ${T+1}l-3 ${B-T-14}`,'#6e4a30',2);  // Rucksackgurt
  if(opts.coat) s+=P(`M37 ${T+4}q13-6 26 0l3 ${B-T+2}H34z`,'#fbf8f0')+L(`M50 ${T+6}v${B-T-6}`,shade('#fbf8f0',.8),1.2)+`<rect x="54" y="${T+12}" width="6" height="7" fill="${a.pants}" opacity=".7"/>`;
  s+=lg(53,legA,a.pants);
  // Kopf
  s+=adult?`<g transform="translate(52 15) scale(.84) translate(-52 -22)">${avHeadSide(a,opts)}</g>`:avHeadSide(a,opts);
  const armF=rot([0,ARM],rad(armA),[57,AY]); s+=L(`M57 ${AY}L${f1(armF[0])} ${f1(armF[1])}`,a.skin,5);
  const tool=opts.lupe?'lupe':(opts.notool?null:a.tool);
  if(tool) s+=avTool(tool,armF[0],armF[1]);
  s+=`</g>`;
  const flip=opts.flip?` transform="translate(100 0) scale(-1 1)"`:'';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 0 60 88" ${opts.attrs||''}><defs>${filters(uid,true)}</defs><g filter="url(#w${uid})"${flip}>${s}</g></svg>`;
};

/* ---------- Vorderansicht (Porträt, ganze Figur) · viewBox 0 0 100 130 ---------- */
function avHeadFront(a,opts){
  // Kopf-Koordinaten: Mitte 50/40, Radius 19
  let s=''; const st=a.style||'short', hc=a.hair||'#3d2b1f', ht=opts.nohat?'none':(a.hatType||'safari'), h=a.hat||'#d9b36c';
  const sc=a.scarf||'#5f9a95';
  // hinter dem Kopf
  if(st==='afro') s+=`<g fill="${hc}" stroke="${INK}" stroke-width="1" stroke-opacity=".5"><circle cx="50" cy="34" r="26"/><circle cx="28" cy="44" r="10"/><circle cx="72" cy="44" r="10"/></g>`;
  if(st==='long') s+=P('M30 38q-4 22 2 34h10q-4-14-2-30zM70 38q4 22-2 34H58q4-14 2-30z',hc);
  if(st==='bob') s+=P('M30 36q-3 16 2 24h9q-4-10-3-22zM70 36q3 16-2 24h-9q4-10 3-22z',hc);
  if(st==='pony') s+=P('M66 30q14 4 12 22-4 10-8 4 4-8 0-16z',hc);
  if(st==='braids') s+=P('M31 44q-5 12-1 24l5 0q-3-12 0-22zM69 44q5 12 1 24l-5 0q3-12 0-22z',hc)+`<circle cx="32.5" cy="70" r="3" fill="${a.hat||'#d98b5f'}" stroke="${INK}" stroke-width="1"/><circle cx="67.5" cy="70" r="3" fill="${a.hat||'#d98b5f'}" stroke="${INK}" stroke-width="1"/>`;
  if(st==='bun') s+=`<circle cx="50" cy="${ht==='none'?16:18}" r="8" fill="${hc}" stroke="${INK}" stroke-width="1.2" stroke-opacity=".6"/>`;
  if(st==='scarf') s+=P('M26 42q-2-26 24-27t24 27q1 16-6 24-8 6-18 6t-18-6q-7-8-6-24z',sc);
  // Gesicht
  s+=`<ellipse cx="50" cy="41" rx="18" ry="19" fill="${a.skin}" stroke="${INK}" stroke-width="1.5" stroke-opacity=".75"/>`;
  s+=`<ellipse cx="31.5" cy="43" rx="3" ry="4.5" fill="${a.skin}" stroke="${INK}" stroke-width="1.1" stroke-opacity=".6"/><ellipse cx="68.5" cy="43" rx="3" ry="4.5" fill="${a.skin}" stroke="${INK}" stroke-width="1.1" stroke-opacity=".6"/>`;
  // Haare vorne
  if(st==='scarf') s+=P('M30 36q2-18 20-18t20 18q-8-8-20-8t-20 8z',sc)+P('M31 38q-2 16 4 24 6 6 15 7 9-1 15-7 6-8 4-24 1 14-6 20-6 5-13 5t-13-5q-7-6-6-20z',shade(sc,.92));
  else if(st==='curly') s+=`<g fill="${hc}" stroke="${INK}" stroke-width=".9" stroke-opacity=".5">${[[33,32],[39,26],[46,24],[53,24],[60,26],[66,31],[31,39],[69,38]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5"/>`).join('')}</g>`;
  else if(st==='afro') s+=P('M32 34q4-12 18-12t18 12q-8-5-18-5t-18 5z',hc);
  else if(st==='buzz') s+=P('M32.5 34q3-13 17.5-13t17.5 13q-8-6-17.5-6t-17.5 6z',hc,'opacity=".85"');
  else s+=P('M31 38q0-17 19-17t19 17q-5-7-11-8-3 5-10 5t-10-4q-5 2-7 7z',hc);
  if(st==='short'&&!a.beard) s+='';
  // Hut
  if(ht==='safari') s+=`<ellipse cx="50" cy="27" rx="30" ry="6.5" fill="${shade(h,.85)}" stroke="${INK}" stroke-width="1.4" stroke-opacity=".75"/>`+P('M34 27q0-18 16-18t16 18q-16-4-32 0z',h)+P('M34.5 24q15.5-4 31 0l.5 3q-16-4-32 0z',shade(h,.7));
  if(ht==='wide') s+=`<ellipse cx="50" cy="27" rx="36" ry="7.5" fill="${shade(h,.85)}" stroke="${INK}" stroke-width="1.4" stroke-opacity=".75"/>`+P('M33 27q0-19 17-19t17 19q-17-4-34 0z',h)+P('M33.5 23.5q16.5-4 33 0l.5 3.5q-17-4-34 0z',shade(h,.65));
  if(ht==='cap') s+=P('M30 32q0-20 20-20t20 20q-20-5-40 0z',h)+P('M34 31q16-5 32 0l6 6q-22-6-44 0z',shade(h,.85))+`<circle cx="50" cy="12.5" r="2" fill="${shade(h,.8)}"/>`;
  if(ht==='bucket') s+=P('M34 29q0-17 16-17t16 17z',h)+P('M28 30q22-6 44 0l4 7q-26-7-52 0z',shade(h,.88));
  if(ht==='bandana') s+=P('M31 32q2-14 19-14t19 14q-19-6-38 0z',h)+P('M68 30l8 6-2 3-8-5z',shade(h,.85))+`<circle cx="42" cy="25" r="1.6" fill="#fff" opacity=".7"/><circle cx="52" cy="23" r="1.6" fill="#fff" opacity=".7"/><circle cx="60" cy="26" r="1.6" fill="#fff" opacity=".7"/>`;
  // Gesicht
  if(a.beard) s+=P('M34 46q2 16 16 17t16-17q-4 6-16 6t-16-6z',hc)+P('M43 51q7-3 14 0q-7 2-14 0z',hc);
  s+=eye(43,42,3.4)+eye(57,42,3.4);
  if(opts.glasses||a.glasses) s+=`<g fill="rgba(223,240,244,.3)" stroke="${INK}" stroke-width="1.3"><circle cx="43" cy="42" r="6"/><circle cx="57" cy="42" r="6"/></g>`+L('M49 42h2M37 41l-5-1M63 41l5-1',INK,1.2);
  s+=`<circle cx="37.5" cy="49" r="3" fill="#e9967a" opacity=".45"/><circle cx="62.5" cy="49" r="3" fill="#e9967a" opacity=".45"/>`;
  s+=`<path d="M44 ${a.beard?52:51}q6 5 12 0" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`;
  return s;
}
function avToolFront(t,hx,hy){
  if(t==='lupe') return L(`M${hx} ${hy+2}l6 -7`,'#8a5e3e',3.2)+`<circle cx="${hx+10}" cy="${hy-11}" r="8" fill="#dff0f4" stroke="#5a4630" stroke-width="3"/><circle cx="${hx+7}" cy="${hy-14}" r="2.2" fill="#fff" opacity=".8"/>`;
  if(t==='pinsel') return L(`M${hx-1} ${hy+4}L${hx+8} ${hy-12}`,'#b8926a',3.4)+P(`M${hx+6} ${hy-11}l4 -9 6 3 -5 8z`,'#e0c28a');
  if(t==='hammer') return L(`M${hx-1} ${hy+5}L${hx+7} ${hy-14}`,'#8a6d4a',3.6)+P(`M${hx} ${hy-17}l14 3 -1.5 6 -14 -3z`,'#7d8791');
  return '';
}
ART.avatarFront=function(a,opts={}){
  const uid=++UID, adult=a.age==='adult';
  // Maße: Kinder großer Kopf, Erwachsene schlanker & länger
  const T=adult?60:66, B=adult?94:96, LEGB=adult?121:120, HS=adult?.8:1, HY=adult?31:40;
  let s=`<ellipse cx="50" cy="123" rx="24" ry="4" fill="#3d3226" opacity=".15"/>`;
  // Rucksack hinter dem Körper
  s+=P(`M28 ${T+2}q0-6 7-6h30q7 0 7 6v${adult?24:20}q0 4-5 4H33q-5 0-5-4z`,'#a8724a');
  if(adult) s+=`<rect x="29" y="${T-10}" width="42" height="8" rx="4" fill="#8fae9a" stroke="${INK}" stroke-width="1.2" stroke-opacity=".6"/>`;
  // Beine
  s+=P(`M38 ${B-4}h10.5l-.5 ${LEGB-B}h-10z`,a.pants)+P(`M51.5 ${B-4}H62l0 ${LEGB-B}h-10z`,a.pants);
  s+=`<ellipse cx="42.5" cy="${LEGB}" rx="7" ry="3.6" fill="#5a4630"/><ellipse cx="57.5" cy="${LEGB}" rx="7" ry="3.6" fill="#5a4630"/>`;
  // Arme
  s+=L(`M33 ${T+4}q-6 12-5 ${adult?26:22}`,a.skin,7);
  const hx=73, hy=T+(adult?6:4);
  s+=L(`M67 ${T+4}q6 4 ${hx-67} ${hy-T-4}`,a.skin,7);
  // Körper
  s+=P(`M34 ${T+2}q0-4 16-4t16 4l3 ${B-T}H31z`,a.shirt);
  if(a.vest&&!opts.coat){
    s+=P(`M33.5 ${T+2}q4-4 12-4l1 ${B-T+2}H31z`,a.vest)+P(`M66.5 ${T+2}q-4-4-12-4l-1 ${B-T+2}H69z`,a.vest);
    s+=P(`M35 ${T+12}h8v7h-8z`,shade(a.vest,.88),'stroke-width="1"')+P(`M57 ${T+12}h8v7h-8z`,shade(a.vest,.88),'stroke-width="1"');
    s+=P(`M35 ${T+23}h8v6h-8z`,shade(a.vest,.88),'stroke-width="1"')+P(`M57 ${T+23}h8v6h-8z`,shade(a.vest,.88),'stroke-width="1"');
  } else {
    s+=L(`M38 ${T-1}l1 ${B-T-6}M62 ${T-1}l-1 ${B-T-6}`,'#6e4a30',2.6);   // Rucksackgurte
  }
  if(opts.coat) s+=P(`M33 ${T+2}q17-6 34 0l4 ${B-T+6}H29z`,'#fbf8f0');
  s+=P(`M31 ${B-4}h38l.5 6h-39z`,a.pants)+`<rect x="47" y="${B-3.5}" width="6" height="4" rx="1" fill="#c9a45c"/>`;
  // Hände
  s+=`<circle cx="28.5" cy="${T+4+(adult?26:22)}" r="4.2" fill="${a.skin}" stroke="${INK}" stroke-width="1" stroke-opacity=".6"/>`;
  const tool=opts.lupe?'lupe':(opts.notool?null:(a.tool||'lupe'));
  if(tool) s+=avToolFront(tool,hx,hy);
  s+=`<circle cx="${hx}" cy="${hy}" r="4.4" fill="${a.skin}" stroke="${INK}" stroke-width="1" stroke-opacity=".6"/>`;
  // Hals + Kopf
  s+=adult?`<rect x="46" y="44" width="8" height="${T-44}" fill="${shade(a.skin,.9)}"/>`:`<rect x="45" y="${T-8}" width="10" height="8" fill="${shade(a.skin,.9)}"/>`;
  const head=avHeadFront(a,opts);
  s+=HS===1?`<g transform="translate(0 ${HY-40})">${head}</g>`:`<g transform="translate(50 ${HY}) scale(${HS}) translate(-50 -40)">${head}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130" ${opts.attrs||''}><defs>${filters(uid,true)}</defs><g filter="url(#w${uid})">${s}</g></svg>`;
};

/* =====================================================================
   SYMBOLE (gemalt, 64×64)
   ===================================================================== */
const IC={
 farn:`${P('M32 58Q30 34 36 8','none','stroke-width="2.4"')}${[0,1,2,3,4,5].map(i=>P(`M${33+i*.4} ${50-i*7}q-14 -2 -20 -10q10 0 20 6z`,'#7fa66a')+P(`M${34+i*.5} ${48-i*7}q14 -4 18 -12q-10 2 -18 8z`,'#8fb77a')).join('')}`,
 blaetter:`${P('M14 50Q10 20 40 12Q50 36 22 52Z','#8fb77a')}${L('M16 48Q26 30 38 16','#5f7a45',1.4)}${P('M34 56Q34 34 56 28Q58 50 36 58Z','#7fa66a')}${L('M36 56Q44 42 54 32','#5f7a45',1.4)}`,
 moos:`${[[16,44],[28,38],[40,42],[50,46],[22,50],[36,50],[46,52]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="8" fill="#7fa66a" stroke="${INK}" stroke-width="1" stroke-opacity=".5"/>`).join('')}`,
 gras:`${[10,18,26,34,42,50].map((x,i)=>P(`M${x} 56q${i%2?6:-4} -24 ${i%2?2:6} -40q2 22 4 40z`,i%2?'#a8b865':'#8fae6a')).join('')}`,
 wurzeln:`${P('M22 12q10 6 8 16l-4 28q-2 4-4 0l-4-30q-4-8 4-14z','#e2934f')}${L('M22 20l-6 -2M24 30l6 0M22 40l-5 1','#b86a34',1.3)}${P('M20 12q-6-8 0-10 4 4 4 10z','#7fa66a')}${P('M44 16q8 6 6 16l-4 24q-2 3-3 0l-3-26q-3-8 4-14z','#e9b05f')}`,
 zapfen:`${P('M32 8q14 10 12 30t-12 20q-12-2-12-20t12-30z','#9a6d4c')}${[0,1,2,3,4].map(i=>L(`M${22+i} ${20+i*8}q10 6 20 0`,'#6e4a30',1.4)).join('')}`,
 fruechte:`${P('M20 30q10-10 18 0t-4 24q-8 6-14-2t0-22z','#c8553d')}${P('M38 34q8-8 16 0t-4 20q-6 4-12-2t0-18z','#d9a03f')}${P('M28 24q2-8 8-10q-2 6-4 10z','#7fa66a')}<circle cx="26" cy="36" r="2" fill="#fff" opacity=".6"/>`,
 fleisch:`${P('M12 40q-2-18 18-22t26 12q2 16-18 20t-26-10z','#c96a5a')}${P('M18 38q4-10 14-10t14 8','none','stroke="#f0d2c0" stroke-width="3"')}${P('M48 36l8 8q4-2 6 2t-4 4q-2 6-6 2l-6-8z','#f3ead6')}`,
 fisch:`${P('M8 32q14-16 34-8l10-8v32l-10-8q-20 8-34-8z','#8fb0c8')}${eye(18,30,2.6)}${L('M28 24q-4 8 0 16','#5f7f95',1.3)}`,
 kleintier:`${P('M8 40q10-8 24-6t18 2l10-6q2 6-6 10q-6 4-22 4t-24-4z','#9aa35e')}${eye(50,34,2)}${L('M20 44l-4 8M34 44l2 8','#5a4630',2)}`,
 eier:`${P('M22 16q14 0 14 22t-14 20q-14 0-12-20t12-22z','#f3ead6')}${P('M44 22q10 0 10 16t-10 14q-10 0-9-14t9-16z','#e8dcc0')}<circle cx="18" cy="30" r="2" fill="#c9b88f"/><circle cx="26" cy="40" r="1.6" fill="#c9b88f"/>`,
 insekten:`${P('M24 30q8-8 16 0t0 16q-8 8-16 0t0-16z','#6f8a4f')}${P('M26 28q-10-14-16-6q4 8 16 10z','#dfeef0','opacity=".8"')}${P('M38 28q10-14 16-6q-4 8-16 10z','#dfeef0','opacity=".8"')}${L('M24 42l-8 6M40 42l8 6M32 46v8','#4a3b2a',1.5)}`,
 aas:`${P('M10 40l30-14q6-6 10 0t-2 8l-30 14q-6 4-8-2t0-6z','#efe4cc')}<circle cx="46" cy="24" r="5" fill="#efe4cc" stroke="${INK}" stroke-width="1.2"/><circle cx="54" cy="30" r="5" fill="#efe4cc" stroke="${INK}" stroke-width="1.2"/>`,
 knochen:`${P('M16 44l26-22','none','stroke="#efe4cc" stroke-width="8" stroke-linecap="round"')}${L('M16 44l26-22','#4a3b2a',1,'opacity=".3"')}<circle cx="12" cy="42" r="5" fill="#efe4cc" stroke="${INK}" stroke-width="1.2"/><circle cx="18" cy="50" r="5" fill="#efe4cc" stroke="${INK}" stroke-width="1.2"/><circle cx="42" cy="16" r="5" fill="#efe4cc" stroke="${INK}" stroke-width="1.2"/><circle cx="48" cy="24" r="5" fill="#efe4cc" stroke="${INK}" stroke-width="1.2"/>`,
 zahn:`${P('M22 12q14-4 20 2q2 20-8 42q-4 2-6-2q-8-22-6-42z','#f5ecd8')}${L('M26 18q4 16 4 34','#c9b88f',1.2)}`,
 ammonit:`<circle cx="32" cy="32" r="22" fill="#d7b58f" stroke="${INK}" stroke-width="1.5" stroke-opacity=".75"/>${L('M32 32q6-2 5 5t-10 7q-10-2-10-12t12-14q14-2 18 10t-6 20',"#8a6a44",1.6)}`,
 spur:`${P('M30 50q-8 0-8-8t8-8 8 8-8 8z','#b3895a')}${P('M18 30q-4-10 2-14t8 6-4 10z','#b3895a')}${P('M30 26q-2-12 4-14t6 8-6 8z','#b3895a')}${P('M42 30q2-10 8-10t4 10-8 6z','#b3895a')}`,
 blatt:`${P('M32 8q20 14 14 36t-14 12q-10-6-14-12t14-36z','#b5c48a')}${L('M32 10v46M32 24l8-6M32 34l-8-6M32 44l8-6','#7d8f4f',1.2)}`,
 bernstein:`${P('M20 16q16-8 28 4t4 30q-12 12-26 4t-6-38z','#e3a24a','opacity=".92"')}${P('M28 34q4-6 8 0t-4 6q-4-2-4-6z','#6e4a30')}${L('M26 30l-4-4M38 30l4-4','#6e4a30',1)}<circle cx="26" cy="22" r="3" fill="#fff" opacity=".5"/>`,
 ei:`${P('M32 8q16 0 16 26t-16 24q-16 0-16-24t16-26z','#e8dcc0')}<circle cx="26" cy="28" r="2.5" fill="#c9a877"/><circle cx="36" cy="38" r="2" fill="#c9a877"/><circle cx="30" cy="46" r="1.6" fill="#c9a877"/>`,
 kristall:`${P('M32 6l14 16-6 32H24l-6-32z','#a9c8de')}${L('M18 22h28M32 6l-8 16 8 32 8-32z','#6f8fa6',1.2)}`,
 holz:`${P('M10 26q0-8 22-8t22 8v14q0 8-22 8t-22-8z','#b8926a')}<ellipse cx="54" cy="33" rx="4" ry="7" fill="#e0c9a4" stroke="${INK}" stroke-width="1.2"/>${L('M14 30h30M16 38h28','#8a6a48',1.3)}`,
 muschel:`${P('M32 52L10 30q4-22 22-22t22 22z','#f0d2b8')}${L('M32 52L18 16M32 52L32 8M32 52L46 16M32 52L12 30M32 52L52 30','#c99a78',1.3)}`,
 fischfossil:`${P('M8 14h48v36H8z','#cfc2a6')}${L('M14 32q12-10 26-4l8-6v18l-8-6q-14 6-26-2M22 28v8M28 26v12M34 26v12','#6e5a44',1.4)}`,
 mikro:`${P('M8 12h48v40H8z','#d8cfb6')}${[[18,24],[30,34],[44,22],[40,42],[20,42]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="none" stroke="#6e5a44" stroke-width="1.2"/>`).join('')}`,
 insektfossil:`${P('M20 16q16-8 28 4t4 30q-12 12-26 4t-6-38z','#e3a24a','opacity=".92"')}${P('M28 34q4-6 8 0t-4 6q-4-2-4-6z','#6e4a30')}`,
 stein:`${P('M10 46q-2-18 14-26t26 2q10 12 2 24t-24 8-18-8z','#b9ad98')}${L('M20 34q8-2 14 4','#8a7e6c',1.3)}`,
 lupe:`<circle cx="26" cy="26" r="16" fill="#dff0f4" stroke="#5a4630" stroke-width="4"/>${L('M38 38l16 16','#8a5e3e',7)}<circle cx="20" cy="20" r="4" fill="#fff" opacity=".7"/>`,
 pinsel:`${L('M14 50l28-28','#b8926a',6)}${P('M40 16l10 -6 4 4-6 10z','#6e5a44')}${P('M42 20q10-10 14-6-2 8-8 10z','#e0c28a')}`,
 schaufel:`${L('M16 48l24-24','#8a6d4a',5)}${P('M36 16l12-8 10 10-8 12q-8 0-14-14z','#9aa7b5')}`,
 hammer:`${L('M18 50l22-22','#8a6d4a',5)}${P('M30 14l10-6 18 18-6 10z','#7d8791')}`,
 meissel:`${L('M14 52l20-20','#8a6d4a',6)}${P('M32 26l14-14 6 2-12 16z','#9aa7b5')}`,
 hand:`${P('M22 56q-10-10-10-22l2-4q4 0 6 8V14q0-4 4-4t4 4v14V8q0-4 4-4t4 4v20V10q0-4 4-4t4 4v18-12q0-4 4-4t4 4v26q0 14-10 20z','#f1c9a5')}`,
 scanner:`${P('M12 20h30v24H12z','#8fa3a9')}<rect x="16" y="24" width="22" height="14" fill="#cfe7c4" stroke="${INK}" stroke-width="1"/>${L('M20 32l4-4 4 6 4-8 4 6','#4f7a45',1.4)}${L('M42 28q8 4 0 12M46 24q14 8 0 20','#5f7f95',1.8)}`,
 stern:`${P('M32 6l7 16 18 2-13 12 4 18-16-9-16 9 4-18L7 24l18-2z','#f0c35a')}`,
 herz:`${P('M32 54Q8 38 10 22q2-12 14-12 6 0 8 8 2-8 8-8 12 0 14 12 2 16-22 32z','#e07a6a')}`,
 haus:`${P('M10 30L32 10l22 20v24H10z','#e8d2a8')}${P('M6 32L32 8l26 24-4 4L32 16 10 36z','#c8553d')}${P('M26 54V38h12v16z','#8a6d4a')}`,
 buch:`${P('M8 14q12-6 24 2v38q-12-8-24-2z','#c8553d')}${P('M56 14q-12-6-24 2v38q12-8 24-2z','#d98b5f')}${L('M12 22q8-4 16 0M12 30q8-4 16 0M36 22q8-4 16 0M36 30q8-4 16 0','#fbe9d6',1.4)}`,
 rucksack:`${P('M16 22q0-12 16-12t16 12v30q0 4-4 4H20q-4 0-4-4z','#a8724a')}${P('M22 30h20v14H22z','#c69063')}${L('M26 10q0-6 6-6t6 6','#6e4a30',2.5)}<circle cx="32" cy="37" r="2.2" fill="#e9c46a"/>`,
 lautsprecher:`${P('M10 24h10l12-10v36L20 40H10z','#3b6f8a')}${L('M40 22q6 10 0 20M46 16q12 16 0 32','#3b6f8a',3)}`,
 stumm:`${P('M10 24h10l12-10v36L20 40H10z','#8a7e6c')}${L('M40 24l14 16M54 24L40 40','#c8553d',3)}`,
 zahnrad:`<circle cx="32" cy="32" r="14" fill="#b9ad98" stroke="${INK}" stroke-width="1.4"/>${[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return`<rect x="${f1(32+Math.cos(a)*18-4)}" y="${f1(32+Math.sin(a)*18-4)}" width="8" height="8" rx="2" fill="#b9ad98" stroke="${INK}" stroke-width="1.2" transform="rotate(${i*45} ${f1(32+Math.cos(a)*18)} ${f1(32+Math.sin(a)*18)})"/>`}).join('')}<circle cx="32" cy="32" r="6" fill="#f7f0e1" stroke="${INK}" stroke-width="1.2"/>`,
 karte:`${P('M8 14l14-4 20 6 14-4v38l-14 4-20-6-14 4z','#e8dcc0')}${L('M22 10v38M42 16v38','#b9a47e',1.2)}${L('M14 36q8-10 14-4t12-6 12 4','#c8553d',1.8,'stroke-dasharray="3 3"')}`,
 globus:`<circle cx="32" cy="32" r="22" fill="#8fbccb" stroke="#4d6f80" stroke-width="2"/>${P('M20 20q8-6 14 0t4 10-8 8-6-8-4-10zM38 38q6-4 10 2t-4 10-6-12z','#8fb37a')}`,
 waage:`${L('M32 10v42M18 54h28M10 20h44','#8a6d4a',3)}${P('M4 22l6 14 6-14','none','stroke="#8a6d4a" stroke-width="1.6"')}${P('M4 36q6 6 12 0z','#d9b36c')}${P('M48 22l6 14 6-14','none','stroke="#8a6d4a" stroke-width="1.6"')}${P('M48 36q6 6 12 0z','#d9b36c')}`,
 puzzle:`${P('M10 14h16q-2-8 6-8t6 8h16v16q8-2 8 6t-8 6v14H38q2 8-6 8t-6-8H10V40q-8 2-8-6t8-6z','#8fbccb')}`,
 lauf:`${P('M8 50q20-4 48 0','none','stroke="#c9a45c" stroke-width="4" stroke-linecap="round"')}${P('M22 44q-2-14 10-18l10-2q6-8 12-2l-6 6-4 12q-4 6-14 6z','#8fae6a')}${eye(46,26,2)}`,
 museum:`${P('M8 24L32 8l24 16z','#d9c49a')}${P('M10 24h44v4H10zM8 50h48v6H8z','#e8dcc0')}${[14,24,34,44].map(x=>P(`M${x} 28h6v22h-6z`,'#f3ead6')).join('')}`,
 futter:`${P('M10 34h44q0 18-22 18T10 34z','#b8926a')}${P('M14 34q4-10 10-6 4-10 10-4 6-8 10 2 6-2 6 8z','#8fb77a')}`,
 grabung:`${P('M6 44q26-12 52 0v12H6z','#c9a36d')}${P('M22 44q4-8 10-2','none','stroke="#efe4cc" stroke-width="4" stroke-linecap="round"')}${L('M40 40l12-26','#8a6d4a',4)}${P('M46 10l12 2-2 8-10-2z','#9aa7b5')}`,
 zelt:`${P('M6 52L32 10l26 42z','#d98b5f')}${P('M32 10l-8 42h16z','#8a4f35')}${L('M32 10v-6','#6e4a30',2)}${P('M32 4l10 3-10 3z','#e9c46a')}`,
 check:`<circle cx="32" cy="32" r="24" fill="#8fbf7a" stroke="${INK}" stroke-width="1.5"/>${L('M20 32l9 9 16-18','#fff',5)}`,
 kreuz:`<circle cx="32" cy="32" r="24" fill="#e6a08e" stroke="${INK}" stroke-width="1.5"/>${L('M22 22l20 20M42 22L22 42','#fff',5)}`,
 pfeil_l:`${L('M40 12L20 32l20 20','#5a4630',6)}`,
 pfeil_r:`${L('M24 12l20 20-20 20','#5a4630',6)}`,
 kamera:`${P('M8 22h12l4-6h16l4 6h12v28H8z','#8a7e6c')}<circle cx="32" cy="36" r="9" fill="#cfe4ea" stroke="${INK}" stroke-width="1.5"/>`,
 stift:`${L('M14 50l30-30','#e9b05f',7)}${P('M42 16l6 6 6-12z','#5a4630')}${P('M10 54l4-10 6 6z','#f3ead6')}`,
 radierer:`${P('M10 40l20-20 18 18-20 20H18z','#e8a0a0')}${P('M10 40l8 8H28','none','stroke="#4a3b2a" stroke-width="1.4"')}`,
 mikrofon:`${P('M24 10q0-6 8-6t8 6v20q0 8-8 8t-8-8z','#8fa3a9')}${L('M18 28q0 14 14 14t14-14M32 42v10M24 54h16','#5a4630',2.5)}`,
 sticker:`${P('M12 10h40v34L40 56H12z','#f0c35a')}${P('M40 56V44h12z','#d9a03f')}${P('M32 18l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z','#fff8e6')}`,
 schloss:`${P('M16 28h32v26H16z','#c9a45c')}${L('M22 28v-8q0-10 10-10t10 10v8','#8a6d4a',4)}<circle cx="32" cy="40" r="4" fill="#5a4630"/>`,
 wolke:`${P('M14 44q-10 0-10-9t10-9q2-12 16-12t16 12q12-2 14 8t-10 10z','#fbfbf7')}`,
 sonne:`<circle cx="32" cy="32" r="12" fill="#f5c85a" stroke="${INK}" stroke-width="1.2"/>${[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return L(`M${f1(32+Math.cos(a)*17)} ${f1(32+Math.sin(a)*17)}L${f1(32+Math.cos(a)*24)} ${f1(32+Math.sin(a)*24)}`,'#e0a43c',3)}).join('')}`,
 vulkan:`${P('M6 54L24 20h16l18 34z','#8a6a5a')}${P('M24 20q8 6 16 0l-4 10q-4-4-8 0z','#e07a4a')}${P('M28 16q-6-10 2-12 4 4 8-2 6 4 0 12z','#bdb5ac')}`,
 palme:`${L('M32 58q-4-20 2-36','#8a6d4a',4)}${P('M34 22q-14-8-26 2 14-2 26 2zM34 22q10-14 24-8-14 0-24 8zM34 22q-6-14-18-14 12 4 18 14zM34 22q14-2 22 10-12-6-22-10z','#7fa66a')}`,
 schneeflocke:`${L('M32 8v48M11 20l42 24M11 44l42-24','#8fbccb',3.5)}`,
 wueste:`${P('M4 50q14-16 28-8t28-4v18H4z','#e2c589')}${P('M42 44V24q0-4 4-4t4 4v8h4v-6q0-3 3-3t3 3v10h-10v8z','#8fae6a')}`,
 welle:`${P('M4 40q8-12 16 0t16 0 16 0 12 0v16H4z','#8fbccb')}${L('M4 40q8-12 16 0t16 0 16 0','#4d6f80',2)}`,
 blume:`${[0,1,2,3,4].map(i=>{const a=i*Math.PI*2/5;return `<ellipse cx="${f1(32+Math.cos(a)*10)}" cy="${f1(26+Math.sin(a)*10)}" rx="8" ry="6" fill="#f0c3cf" stroke="${INK}" stroke-width="1" transform="rotate(${f1(a*180/Math.PI)} ${f1(32+Math.cos(a)*10)} ${f1(26+Math.sin(a)*10)})"/>`}).join('')}<circle cx="32" cy="26" r="5" fill="#f0c35a"/>${L('M32 36v20','#5f7a45',2.5)}`,
 wasserfall:`${P('M8 10h14v44H8zM42 10h14v44H42z','#9a8a72')}${P('M22 10h20v44H22z','#a9d3e0')}${L('M26 14v36M32 12v40M38 14v36','#fff',1.6)}`,
 klippe:`${P('M4 56V30l16-14 12 8 14-12 14 18v26z','#b9a48a')}${P('M4 56h56v-6q-28-6-56 0z','#8fbccb')}`,
 lava:`${P('M4 44q10-8 20 0t20 0 16 0v12H4z','#e07a4a')}${P('M10 44q6-4 10 0M34 44q6-4 10 0','none','stroke="#f5c85a" stroke-width="2.4"')}`,
 kaktus:`${P('M28 58V18q0-6 4-6t4 6v40zM28 36h-8v-12q0-4 3-4t3 4v6h2M36 30h8v-8q0-4-3-4t-3 4v4','#8fae6a')}`,
 duene:`${P('M4 50q16-22 34-6t22-4v14H4z','#e2c589')}${L('M14 44q10-8 18-2','#c9a36d',1.6)}`,
 achat:`<ellipse cx="32" cy="34" rx="24" ry="20" fill="#b56a5c" stroke="${INK}" stroke-width="1.5"/><ellipse cx="32" cy="34" rx="18" ry="14" fill="#e3b6a0"/><ellipse cx="32" cy="34" rx="12" ry="9" fill="#9a6a8a"/><ellipse cx="32" cy="34" rx="6" ry="4" fill="#dfe8ee"/>`,
 ballon:`${P('M32 6q16 0 16 18t-16 22q-16-4-16-22t16-18z','#e07a6a')}${L('M32 46q-4 8 2 16','#6e5a44',1.4)}<ellipse cx="26" cy="18" rx="4" ry="6" fill="#fff" opacity=".4"/>`,
 fahrrad:`<circle cx="16" cy="42" r="11" fill="none" stroke="#4a3b2a" stroke-width="3"/><circle cx="48" cy="42" r="11" fill="none" stroke="#4a3b2a" stroke-width="3"/>${L('M16 42l12-18h14l6 18M28 24l8 18h12M42 24l-2-6h-6','#3b6f8a',3)}`,
 wagen:`${P('M8 14h6l6 26h30l6-20H18','none','stroke="#8a7e6c" stroke-width="3"')}${[22,30,38,46].map(x=>L(`M${x} 22v16`,'#8a7e6c',1.6)).join('')}<circle cx="24" cy="50" r="5" fill="#4a3b2a"/><circle cx="46" cy="50" r="5" fill="#4a3b2a"/>`,
 kiste:`${P('M10 22h44v32H10z','#c69063')}${P('M10 22l6-10h44l-6 10z','#d9a878')}${L('M10 34h44M32 22v32','#8a5e3e',1.6)}`,
 melone:`${P('M6 34a26 20 0 0 0 52 0z','#7fa66a')}${P('M10 34a22 15 0 0 0 44 0z','#e07a6a')}${[18,26,34,42].map(x=>`<ellipse cx="${x}" cy="40" rx="1.5" ry="2.5" fill="#3d3226"/>`).join('')}`,
 banane:`${P('M10 20q6 30 44 30q4-2 0-6q-30 0-38-26z','#f0c35a')}${L('M12 20l-2-6','#6e5a44',3)}`,
 karotte:`${P('M18 22l30 32q2 2 0-2L26 16q-6-4-8 6z','#e2934f')}${P('M20 16q-8-8-4-12 6 2 8 10zM24 14q0-10 6-10 2 6-2 12z','#7fa66a')}`,
 kind:`<circle cx="32" cy="16" r="8" fill="#f1c9a5" stroke="${INK}" stroke-width="1.3"/>${P('M24 26q8-4 16 0l2 18H22z','#d98b5f')}${L('M27 44v14M37 44v14','#5f7f95',5)}${L('M24 30l-6 10M40 30l6 10','#f1c9a5',4)}`,
 mensch:`<circle cx="32" cy="10" r="7" fill="#e8b88f" stroke="${INK}" stroke-width="1.3"/>${P('M22 20q10-4 20 0l2 22H20z','#7fa66a')}${L('M27 42v18M37 42v18','#5a4630',5)}${L('M22 24l-6 14M42 24l6 14','#e8b88f',4)}`,
 auto:`${P('M6 40q0-8 8-10l8-10h20l10 10q8 2 8 10v6H6z','#c8553d')}${P('M24 22h8v8H18zM36 22h6l6 8H36z','#dff0f4')}<circle cx="18" cy="46" r="6" fill="#4a3b2a"/><circle cx="46" cy="46" r="6" fill="#4a3b2a"/>`,
 bus:`${P('M4 16h52q4 0 4 4v24H4z','#e0b44c')}${[8,20,32,44].map(x=>`<rect x="${x}" y="20" width="9" height="9" fill="#dff0f4" stroke="${INK}" stroke-width="1"/>`).join('')}<circle cx="16" cy="46" r="6" fill="#4a3b2a"/><circle cx="46" cy="46" r="6" fill="#4a3b2a"/>`,
 koralle:`${P('M32 58V40M32 44l-12-14V18M32 40l12-12V14M20 30l-8-6V14M44 28l8-4V16','none','stroke="#e0826a" stroke-width="6" stroke-linecap="round"')}${[[20,16],[12,14],[44,14],[52,16],[32,20]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="#f0a08a" stroke="${INK}" stroke-width="1" stroke-opacity=".5"/>`).join('')}`,
 seelilie:`${L('M32 58Q28 40 32 24','#b58c6a',4)}${[-3,-2,-1,0,1,2,3].map(i=>L(`M32 24q${i*5} -8 ${i*9} -18`,'#d9a97a',3)).join('')}<circle cx="32" cy="24" r="5" fill="#c99a6a" stroke="${INK}" stroke-width="1"/>`,
 seetang:`${[16,30,44].map((x,i)=>P(`M${x} 58q-8-14 2-24t-2-26q10 10 4 24t4 26z`,i%2?'#7f9f5c':'#6f8f4f')).join('')}`,
 qualle:`${P('M12 30q0-18 20-18t20 18q-10 4-20 0t-20 0z','#c9b0d6','opacity=".9"')}${[18,26,34,42].map(x=>L(`M${x} 32q-4 8 0 14t0 12`,'#b58cbd',2)).join('')}`,
 seestern:`${P('M32 6l6 18 20 2-16 12 6 20-16-12-16 12 6-20L6 26l20-2z','#e9967a')}<circle cx="32" cy="30" r="3" fill="#f5c8b0"/>`,
 anker:`${L('M32 10v42M20 22h24M14 40q4 14 18 14t18-14','#5f7f95',5)}<circle cx="32" cy="10" r="5" fill="none" stroke="#5f7f95" stroke-width="3"/>`,
 boot:`${P('M6 38h52l-8 14H14z','#b8804f')}${L('M32 38V8','#6e4a30',3)}${P('M34 10l18 24H34z','#fbf6ea')}${P('M30 14L16 34h14z','#f3e4c4')}${L('M6 56q8-4 16 0t16 0 16 0','#5f97ad',2.5)}`,
 schiff:`${P('M4 36h56l-10 16H12z','#8a6d4a')}${P('M14 36V24h28v12z','#f3ead6')}${[18,26,34].map(x=>`<circle cx="${x}" cy="30" r="2.5" fill="#8fbccb" stroke="${INK}" stroke-width=".8"/>`).join('')}${L('M44 36V14','#6e4a30',3)}${P('M44 14l12 5-12 5z','#c8553d')}`,
 taucher:`<circle cx="32" cy="30" r="20" fill="#d9a03f" stroke="${INK}" stroke-width="1.5"/><circle cx="32" cy="30" r="11" fill="#bfe0ea" stroke="#8a6d4a" stroke-width="3"/>${P('M14 50h36v8H14z','#b8864a')}<circle cx="28" cy="26" r="3" fill="#fff" opacity=".7"/>`,
 taschenlampe:`${P('M8 26h26v12H8z','#5f7f95')}${P('M34 22l10-6v32l-10-6z','#8fa3a9')}${P('M46 16l14-8v48l-14-8z','#f5e08a','opacity=".7"')}`,
 blase:`<circle cx="24" cy="38" r="12" fill="#dff0f4" stroke="#8fbccb" stroke-width="2"/><circle cx="42" cy="22" r="8" fill="#dff0f4" stroke="#8fbccb" stroke-width="2"/><circle cx="46" cy="44" r="5" fill="#dff0f4" stroke="#8fbccb" stroke-width="2"/><circle cx="20" cy="34" r="3" fill="#fff"/>`,
 perle:`${P('M32 52L10 34q4-20 22-20t22 20z','#e8d2c0')}<circle cx="32" cy="34" r="8" fill="#fbf8f2" stroke="${INK}" stroke-width="1.2"/><circle cx="29" cy="31" r="2.5" fill="#fff"/>`,
 fernglas:`<circle cx="20" cy="40" r="11" fill="#5f7f95" stroke="${INK}" stroke-width="1.4"/><circle cx="44" cy="40" r="11" fill="#5f7f95" stroke="${INK}" stroke-width="1.4"/><circle cx="20" cy="40" r="6" fill="#bfe0ea"/><circle cx="44" cy="40" r="6" fill="#bfe0ea"/>${P('M14 30l4-14h8l2 14zM50 30l-4-14h-8l-2 14z','#8a7e6c')}`,
 nest:`${P('M6 38q26 24 52 0q-4 14-26 16T6 38z','#a8784a')}${L('M8 40q24 10 48 0M10 44q22 8 44 0','#7a5230',1.6)}${[22,32,42].map(x=>`<ellipse cx="${x}" cy="36" rx="6" ry="8" fill="#f3ead6" stroke="${INK}" stroke-width="1"/>`).join('')}`,
 zweig:`${L('M8 52L56 12','#8a6d4a',4)}${L('M24 38l-8-8M36 28l6 10M44 20l-4-10','#8a6d4a',2.5)}`,
 feder:`${P('M50 8q-30 6-36 42l4 2q20-12 32-44z','#e0c28a')}${L('M50 8L16 52','#8a6d4a',1.6)}`,
 schatten:`${P('M8 44q8-20 22-18l12-12q6-2 8 4l-4 10q10 6 10 18z','#4a3b2a','opacity=".75"')}`,
 fussabdruck:`${P('M32 56q-12 0-12-12t12-10 12 10-12 12z','#8a6d4a')}${P('M18 28q-6-14 0-18t8 8-8 10zM32 22q-2-16 4-16t4 14-8 2zM46 28q4-14 10-12t-2 12-8 0z','#8a6d4a')}`,
 flagge:`${L('M16 58V8','#6e4a30',3)}${P('M16 10q14-6 22 0t22 0v20q-14 6-22 0t-22 0z','#c8553d')}`,
 rettungsring:`<circle cx="32" cy="32" r="22" fill="none" stroke="#fbf6ea" stroke-width="12"/>${[0,1,2,3].map(i=>`<path d="M${f1(32+Math.cos(i*Math.PI/2+.4)*22)} ${f1(32+Math.sin(i*Math.PI/2+.4)*22)}A22 22 0 0 1 ${f1(32+Math.cos(i*Math.PI/2+1.2)*22)} ${f1(32+Math.sin(i*Math.PI/2+1.2)*22)}" fill="none" stroke="#c8553d" stroke-width="12"/>`).join('')}<circle cx="32" cy="32" r="28" fill="none" stroke="${INK}" stroke-width="1" stroke-opacity=".5"/><circle cx="32" cy="32" r="16" fill="none" stroke="${INK}" stroke-width="1" stroke-opacity=".5"/>`,
 kompass:`<circle cx="32" cy="32" r="24" fill="#f3ead6" stroke="#8a6d4a" stroke-width="4"/>${P('M32 12l6 20-6 20-6-20z','#c8553d')}${P('M32 32l6 0-6 20-6-20z','#8a7e6c')}<circle cx="32" cy="32" r="3" fill="#4a3b2a"/>`,
 fackel:`${L('M32 58V30','#8a6d4a',6)}${P('M24 30q0-14 8-24 8 10 8 24z','#e07a4a')}${P('M28 30q0-8 4-14 4 6 4 14z','#f5c85a')}`,
 film:`${P('M8 14h48v36H8z','#4a3b2a')}${[12,22,32,42,50].map(x=>`<rect x="${x}" y="16" width="5" height="5" fill="#f3ead6"/><rect x="${x}" y="43" width="5" height="5" fill="#f3ead6"/>`).join('')}${P('M14 24h36v16H14z','#e9b48a')}`,
 musik:`${L('M22 46V14l28-6v32','#4a3b2a',3.5)}<ellipse cx="17" cy="47" rx="7" ry="5" fill="#4a3b2a"/><ellipse cx="45" cy="41" rx="7" ry="5" fill="#4a3b2a"/>`,
 ohr:`${P('M22 50q-10-8-10-24t20-18 18 16q0 10-10 14t-8 10q0 6-10 2z','#f1c9a5')}${L('M26 22q8-6 12 4t-6 10','#b98a6a',2)}`,
 zahnbuerste:`${L('M8 44L50 20','#8fbccb',5)}${P('M44 12l12-6 4 8-12 6z','#fbf6ea')}`,
 muscheltopf:`${P('M10 30h44l-6 24H16z','#b8926a')}${P('M14 30q-2-10 8-10h20q10 0 8 10z','#e8d2c0')}`,
 wal:`${P('M6 34q10-16 34-12q14 2 18 10l4-8v20l-4-6q-8 10-30 10T6 34z','#6f8292')}${eye(18,32,2)}`,
 hai:`${P('M4 36q16-14 36-10l6-14 6 16q6 2 10 8l-10 2q-10 8-30 8T4 36z','#7c8fa1')}${eye(14,34,2)}`,
 meer:`${P('M4 30q8-8 16 0t16 0 16 0 12 0v26H4z','#8fbccb')}${L('M4 30q8-8 16 0t16 0 16 0','#4d6f80',2)}${P('M10 48q6-4 12 0M36 46q6-4 12 0','none','stroke="#fff" stroke-width="2"')}`,
 land:`${P('M4 44q14-18 28-8t28-6v26H4z','#b9c98c')}${L('M40 34v-10','#6e4a30',3)}<circle cx="40" cy="20" r="8" fill="#7fa66a"/>`,
 luft:`${P('M10 36q-8 0-8-7t8-7q2-10 14-10t14 10q10-2 12 6t-8 8z','#fbfbf7','stroke="#8fbccb" stroke-width="1.5"')}${L('M8 48h30M20 56h34','#8fbccb',2.5)}`,
 eis:`${P('M8 50l10-30 10 12 8-22 10 18 10-8v30z','#dfeaf0')}${L('M18 20l4 14M36 10l2 16','#9ab0bf',1.4)}`,
 nacht:`${P('M40 8a24 24 0 1 0 16 34a20 20 0 1 1-16-34z','#f5e08a')}<circle cx="16" cy="14" r="2" fill="#f5e08a"/><circle cx="10" cy="30" r="1.6" fill="#f5e08a"/>`,
 babydino:`${P('M16 44q-4-14 8-18q4-12 16-12 12 0 12 12t-10 12l-2 8H16z','#8fb77a')}${eye(40,24,3)}${P('M10 46q10-8 22-6t22 6q-4 10-22 10T10 46z','#f3ead6')}${L('M14 46l6-4 6 4 6-4 6 4 6-4 6 4','#c9b88f',1.4)}`,
};
ART.icon=function(name,size){
  if(!IC[name]&&SP[name]) name='animal:'+name;
  if(name.startsWith('animal:')) return ART.animal(name.slice(7),{attrs:`width="${size||64}" height="${size||64}"`});
  const body=IC[name]||IC.stern; const uid=++UID;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" ${size?`width="${size}" height="${size}"`:''} aria-hidden="true"><defs>${filters(uid,true)}</defs><g filter="url(#w${uid})">${body}</g></svg>`;
};
ART.ICONS=IC;

/* SVG → Bild (für Canvas) */
const imgCache=new Map();
ART.toImage=function(svg,key){
  if(key&&imgCache.has(key)) return imgCache.get(key);
  const img=new Image(); img.decoding='async';
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  const p=new Promise(res=>{img.onload=()=>res(img);img.onerror=()=>res(img);});
  img.ready=p; if(key) imgCache.set(key,img); return img;
};
/* Laufanimation als Bildfolge */
ART.frames=function(id,n=6,opts={}){
  const out=[]; const sp=SP[ART.resolve(id)];
  // gemeinsame Box für alle Frames berechnen (erster Frame), damit nichts springt
  for(let i=0;i<n;i++){ out.push(ART.toImage(ART.animal(id,{...opts,ph:i/n,box:opts.box}),`${id}|${i}|${n}|${JSON.stringify(opts)}`)); }
  return out;
};
ART.avatarFrames=function(a,n=8){const out=[];for(let i=0;i<n;i++){out.push(ART.toImage(ART.avatar(a,{ph:i/n}),`av|${a.id}|${i}`));}return out;};

window.ART=ART;
})();
