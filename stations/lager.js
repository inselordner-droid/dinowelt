/* =====================================================================
   DINO-INSELWELT · Station Forscher-Lager
   Zeltlager mit Lagerfeuer und Kartentisch. Echte Paläontologinnen und
   Paläontologen erzählen in Bildgeschichten (4 Bilder). Danach die
   Mission „Junior-Paläontologe“: Rucksack packen, 3 Bildfragen,
   Urkunde (Canvas, als PNG speicherbar oder druckbar).
   ===================================================================== */
(function(){
"use strict";
const ID='lager';
const INK='#3d3226';
/* ---------- Forscherinnen & Forscher (Fakten bewusst einfach und gesichert) ----------
   Bild-Elemente: p = Person, an = Tier, ic = Symbol, x = Mitte in %, y = Abstand unten in %, w = Breite in % (Person: h = Höhe in %) */
const PEOPLE=[
 {id:'anning',n:'Mary Anning',yrs:'1799–1847',land:'England',photo:'assets/mary_anning.jpg',
  av:{skin:'#f3d6bd',hair:'#6b3f22',shirt:'#6d5a78',pants:'#4a3b52',hat:'#3d3226',style:'pony'},opt:{},
  panels:[
   {bg:'kueste',t:'Mary Anning lebte vor über 200 Jahren an der Küste von England, im Ort Lyme Regis.',it:[{p:1,x:38,y:6,h:46},{ic:'ammonit',x:62,y:7,w:10},{ic:'muschel',x:74,y:6,w:8}]},
   {bg:'sturm',t:'Nach Stürmen brachen Stücke von den Klippen ab. Dann suchte Mary mit Hammer und Korb nach Fossilien.',it:[{p:1,x:55,y:6,h:46,flip:1},{ic:'hammer',x:40,y:20,w:10},{ic:'ammonit',x:70,y:5,w:9}]},
   {bg:'kueste',t:'Als Mädchen fand sie mit ihrem Bruder Joseph das Skelett eines Fischsauriers. Ganz vorsichtig legte sie es frei.',it:[{an:'ichthyosaurus',x:62,y:10,w:42,fos:1},{p:1,x:24,y:6,h:44},{ic:'pinsel',x:38,y:16,w:9}]},
   {bg:'museum',t:'Später fand sie auch den ersten ganzen Plesiosaurier. Damals durften Frauen nicht in die Forscher-Clubs. Heute ist Mary weltberühmt!',it:[{an:'plesiosaurus',x:60,y:26,w:46,fos:1},{p:1,x:22,y:6,h:44}]},
  ]},
 {id:'janensch',n:'Werner Janensch',yrs:'1878–1969',land:'Deutschland',
  av:{skin:'#f1c9a5',hair:'#8a857c',shirt:'#e8dcc0',pants:'#8a6d4a',hat:'#efe6cf',style:'short'},opt:{glasses:true},
  panels:[
   {bg:'museum',t:'Werner Janensch war ein Dino-Forscher aus Berlin. Er arbeitete im Naturkundemuseum.',it:[{p:1,x:30,y:6,h:48},{ic:'knochen',x:62,y:30,w:16},{ic:'buch',x:78,y:8,w:10}]},
   {bg:'savanne',t:'Ab 1909 grub er mit einem großen Team in Tendaguru. Das liegt im heutigen Tansania in Afrika.',it:[{p:1,x:26,y:8,h:44},{ic:'schaufel',x:44,y:10,w:10},{ic:'knochen',x:64,y:8,w:16},{ic:'knochen',x:80,y:6,w:12}]},
   {bg:'weg',t:'Hunderte Menschen aus Tansania gruben die riesigen Knochen aus. Sie trugen sie zu Fuß bis zur Küste – vier Tage lang!',it:[{h2:1,x:22,y:8,h:40,c:0},{h2:1,x:46,y:8,h:40,c:1},{h2:1,x:70,y:8,h:40,c:2}]},
   {bg:'museum',t:'Ein Riesen-Langhals aus Tendaguru steht heute im Naturkundemuseum in Berlin. Er ist eines der höchsten Dino-Skelette der Welt!',it:[{an:'brachiosaurus',x:60,y:8,w:60,fos:1},{p:1,x:16,y:6,h:36}]},
  ]},
 {id:'brown',n:'Barnum Brown',yrs:'1873–1963',land:'USA',
  av:{skin:'#efc6a2',hair:'#3d2b1f',shirt:'#6f7f8f',pants:'#4a3b2a',hat:'#6e4a30',style:'short'},opt:{},
  panels:[
   {bg:'badlands',t:'Barnum Brown suchte in Amerika nach Dinosauriern. Er war einer der besten Fossilien-Sucher seiner Zeit.',it:[{p:1,x:34,y:6,h:46},{ic:'fernglas',x:52,y:28,w:10}]},
   {bg:'badlands',t:'Im Jahr 1902 fand er in Montana riesige Knochen, die aus dem Felsen schauten.',it:[{p:1,x:26,y:6,h:44},{ic:'knochen',x:58,y:14,w:16},{ic:'zahn',x:74,y:10,w:9},{ic:'hammer',x:42,y:16,w:9}]},
   {bg:'museum',t:'Es war das erste Skelett eines Tyrannosaurus rex! Seinen Namen bekam der T-Rex im Jahr 1905.',it:[{an:'trex',x:60,y:10,w:54,fos:1},{p:1,x:20,y:6,h:42}]},
   {bg:'badlands',t:'Übrigens: Seinen Vornamen Barnum bekam er nach einem berühmten Zirkus-Chef.',it:[{p:1,x:40,y:6,h:46},{ic:'stern',x:60,y:40,w:10},{ic:'stern',x:70,y:30,w:7}]},
  ]},
 {id:'hendrickson',n:'Sue Hendrickson',yrs:'geboren 1949',land:'USA',
  av:{skin:'#f1c9a5',hair:'#e0c080',shirt:'#8fb0c8',pants:'#5f7f95',hat:'#d9b36c',style:'pony'},opt:{},
  panels:[
   {bg:'kueste',t:'Sue Hendrickson sucht ihr Leben lang nach Schätzen – sogar als Taucherin im Meer und nach Bernstein.',it:[{p:1,x:30,y:6,h:46},{ic:'taucher',x:60,y:30,w:12},{ic:'bernstein',x:76,y:8,w:9}]},
   {bg:'badlands',t:'Im Sommer 1990 in South Dakota, in Amerika: Das Auto ihres Teams hatte einen Platten. Sue ging solange zu den Felsen.',it:[{ic:'auto',x:24,y:6,w:22},{p:1,x:62,y:6,h:42}]},
   {bg:'badlands',t:'Da sah sie Knochen aus dem Felsen schauen. Riesige Knochen – von einem Tyrannosaurus rex!',it:[{p:1,x:26,y:6,h:44,lupe:1},{ic:'knochen',x:58,y:20,w:18},{ic:'zahn',x:76,y:14,w:9}]},
   {bg:'museum',t:'Der T-Rex bekam ihren Namen: Sue. Er ist einer der vollständigsten T-Rex der Welt und steht heute in einem Museum in Chicago.',it:[{an:'trex',x:60,y:10,w:54,fos:1},{p:1,x:20,y:6,h:42}]},
  ]},
 {id:'andrews',n:'Roy Chapman Andrews',yrs:'1884–1960',land:'USA',
  av:{skin:'#f1c9a5',hair:'#6b4a2a',shirt:'#c9b48a',pants:'#8a6d4a',hat:'#a8724a',style:'short'},opt:{},
  panels:[
   {bg:'wueste',t:'Roy Chapman Andrews reiste in den 1920er Jahren in die Wüste Gobi in der Mongolei – mit Autos und Kamelen.',it:[{ic:'auto',x:66,y:6,w:22},{p:1,x:32,y:6,h:44}]},
   {bg:'wueste',t:'Im Jahr 1923 fand sein Team an roten Felsen ein Nest mit Dino-Eiern. Die ganze Welt staunte!',it:[{p:1,x:26,y:6,h:44,flip:0},{ic:'nest',x:62,y:6,w:24}]},
   {bg:'wueste',t:'Neben Eiern lag ein kleiner Dino. Man dachte, er wollte die Eier klauen. Darum nannte man ihn Oviraptor: Eierdieb.',it:[{ic:'eier',x:40,y:8,w:14},{ic:'knochen',x:62,y:8,w:16},{ic:'lupe',x:78,y:20,w:10}]},
   {bg:'labor',t:'Viel später merkten Forscher: Diese Dinos brüteten ihre eigenen Eier aus – so wie ein Vogel! Er war gar kein Dieb.',it:[{ic:'nest',x:56,y:10,w:26},{ic:'babydino',x:56,y:18,w:12},{ic:'herz',x:72,y:40,w:8}]},
  ]},
 {id:'xu',n:'Xu Xing',yrs:'Forscher von heute',land:'China',
  av:{skin:'#f0cfa6',hair:'#1f1a16',shirt:'#f3ead6',pants:'#3f4f6a',hat:'#fff',style:'short'},opt:{nohat:true,coat:true,glasses:true},
  panels:[
   {bg:'labor',t:'Xu Xing ist ein Dino-Forscher aus China. Er arbeitet in Peking.',it:[{p:1,x:34,y:6,h:48},{ic:'lupe',x:56,y:26,w:10}]},
   {bg:'labor',t:'Er hat mehr als 50 neue Dinosaurier-Arten beschrieben. So viele wie kaum ein anderer!',it:[{p:1,x:26,y:6,h:46},{ic:'buch',x:52,y:12,w:12},{ic:'knochen',x:70,y:14,w:14}]},
   {bg:'labor',t:'Viele davon hatten Federn. Der kleine Microraptor hatte sogar vier Flügel!',it:[{an:'microraptor',x:60,y:18,w:40},{p:1,x:22,y:6,h:44},{ic:'feder',x:84,y:40,w:8}]},
   {bg:'labor',t:'Solche Funde zeigen: Vögel stammen von Dinosauriern ab. Das Huhn ist ein Dino-Verwandter!',it:[{an:'huhn',x:66,y:8,w:26},{p:1,x:30,y:6,h:44}]},
  ]},
];
const HELPERS=[{skin:'#6e4630',hair:'#1f1a16',shirt:'#e0b44c',pants:'#5f6f7f',hat:'#fff',style:'short'},{skin:'#5a3a26',hair:'#1f1a16',shirt:'#c8553d',pants:'#8a6d4a',hat:'#fff',style:'braids'},{skin:'#7a5038',hair:'#1f1a16',shirt:'#7fa66a',pants:'#4f6f7f',hat:'#fff',style:'curly'}];
/* Rucksack: richtige Werkzeuge und lustige Dinge */
const TOOLS=[
 {ic:'pinsel',n:'Pinsel',say:'Mit dem Pinsel fegst du Sand ganz vorsichtig von den Knochen.'},
 {ic:'hammer',n:'Hammer',say:'Mit dem Hammer löst du Steine vom Felsen.'},
 {ic:'meissel',n:'Meißel',say:'Mit dem Meißel klopfst du ganz genau um das Fossil herum.'},
 {ic:'lupe',n:'Lupe',say:'Mit der Lupe siehst du winzige Zähne und Spuren.'},
 {ic:'buch',n:'Notizbuch',say:'Ins Notizbuch schreibst du, wo du etwas gefunden hast.'},
 {ic:'kamera',n:'Kamera',say:'Mit der Kamera fotografierst du die Fundstelle, bevor du etwas bewegst.'},
 {ic:'schaufel',n:'Schaufel',say:'Mit der Schaufel räumst du viel Erde weg.'},
 {ic:'karte',n:'Karte',say:'Auf der Karte trägst du ein, wo die Fundstelle liegt.'},
];
const SILLY=[
 {ic:'ballon',n:'Luftballon',say:'Ein Luftballon? Der hilft beim Graben leider nicht!'},
 {ic:'fahrrad',n:'Fahrrad',say:'Ein Fahrrad passt doch nicht in den Rucksack!'},
 {ic:'kaktus',n:'Kaktus',say:'Autsch! Ein Kaktus pikst nur im Rucksack.'},
 {ic:'bus',n:'Bus',say:'Ein ganzer Bus? Der ist viel zu groß!'},
 {ic:'melone',n:'Melone',say:'Eine Melone ist lecker, aber schwer. Die lassen wir im Lager.'},
];
const QUESTIONS=[
 {q:'Was ist ein Fossil?',ch:[{ic:'fischfossil',n:'Versteinerter Rest'},{ic:'banane',n:'Banane'},{ic:'ballon',n:'Luftballon'}],yes:'Richtig! Ein Fossil ist ein Rest von einem Tier oder einer Pflanze, der zu Stein geworden ist.',hint:'Fossilien sind ganz alt und aus Stein.'},
 {q:'Womit legst du einen Knochen ganz vorsichtig frei?',ch:[{ic:'pinsel',n:'Pinsel'},{ic:'bus',n:'Bus'},{ic:'hammer',n:'Großer Hammer'}],yes:'Genau! Mit dem Pinsel geht es ganz sanft.',hint:'Womit kann man ganz sanft fegen?'},
 {q:'Wer fand als Mädchen einen Fischsaurier?',ch:[{pp:'anning',n:'Mary Anning'},{pp:'brown',n:'Barnum Brown'},{pp:'andrews',n:'Roy Chapman Andrews'}],yes:'Ja! Mary Anning, an der Küste von England.',hint:'Sie lebte an der Küste von England.'},
 {q:'Wo findet man Dino-Knochen?',ch:[{ic:'klippe',n:'Im Felsen'},{ic:'wolke',n:'In den Wolken'},{ic:'haus',n:'Im Kühlschrank'}],yes:'Genau! Dino-Knochen stecken im Gestein.',hint:'Knochen werden zu Stein.'},
 {q:'Was fand Roy Chapman Andrews in der Wüste Gobi?',ch:[{ic:'nest',n:'Dino-Eier'},{ic:'schneeflocke',n:'Schnee'},{ic:'fahrrad',n:'Ein Fahrrad'}],yes:'Richtig! Ein Nest mit Dino-Eiern.',hint:'Etwas, aus dem Babys schlüpfen.'},
 {q:'Wie heißt der T-Rex, den Sue Hendrickson fand?',ch:[{pp:'hendrickson',n:'Sue'},{an:'trex',n:'Rexi'},{ic:'stern',n:'Stern'}],yes:'Ja! Der T-Rex heißt Sue – wie die Forscherin.',hint:'Er hat denselben Namen wie die Forscherin.'},
];
/* eigene Symbole */
const S=`stroke="${INK}" stroke-width="1.5" stroke-opacity=".75" stroke-linejoin="round"`;
ART.ICONS.la_tisch=`<path d="M6 30h52l-4 6H10z" fill="#a8724a" ${S}/><path d="M14 36v22M50 36v22" stroke="#6e4a30" stroke-width="4" stroke-linecap="round"/><path d="M12 30l6-12h30l6 12z" fill="#f3e3bf" ${S}/><path d="M20 26q6-6 12 0t12-2" fill="none" stroke="#c8553d" stroke-width="1.6" stroke-dasharray="3 2"/><path d="M42 22l3 3m0-3l-3 3" stroke="#c8553d" stroke-width="1.6"/>`;
if(!ART.ICONS.melone) ART.ICONS.melone=`<path d="M8 30a24 24 0 0 0 48 0z" fill="#7fa66a" ${S}/><path d="M12 30a20 20 0 0 0 40 0z" fill="#e5675a"/><circle cx="24" cy="38" r="1.6" fill="${INK}"/><circle cx="32" cy="42" r="1.6" fill="${INK}"/><circle cx="40" cy="38" r="1.6" fill="${INK}"/>`;

let root, lv=1, story=null, fitT=null;
const esc=s=>String(s).replace(/[<&"]/g,c=>({'<':'&lt;','&':'&amp;','"':'&quot;'}[c]));
const LST=()=>{ const s=GK.st(ID); s.heard=s.heard||{}; return s; };
const personSVG=(p,o={})=>(window.ASSETS&&ASSETS.svg('figuren/forscher_'+({xu:'xuxing'}[p.id]||p.id),[20,0,60,88]))||ART.avatar(p.av,Object.assign({},p.opt,o));
const me=()=>ART.AVATARS.find(a=>a.id===DW.state.avatar)||ART.AVATARS[0];
const childName=()=>(DW.state.name||(DW.state.forscher&&DW.state.forscher.name)||'').trim();

/* ---------- Hintergründe der Bildgeschichten (400×300) ---------- */
function stripes(y0,n,c,x0=0,x1=400,dy=9){ return [...Array(n)].map((_,i)=>`<path d="M${x0} ${y0+i*dy}q${(x1-x0)/2} ${i%2?3:-3} ${x1-x0} 0" stroke="${c}" stroke-width="1.4" fill="none" opacity=".55"/>`).join(''); }
const BG={
 kueste:`<rect width="400" height="300" fill="#d7e8ee"/><rect y="150" width="400" height="60" fill="#8fbccb"/><path d="M0 60q30-8 60 0l30 10 20 80H0z" fill="#8c9aa4"/>${stripes(80,7,'#5f6f7a',0,100)}<path d="M0 205q200-20 400 0v95H0z" fill="#ead9ae"/><path d="M110 168q20-4 40 0M200 176q24-4 48 0M300 164q18-3 36 0" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>`,
 sturm:`<rect width="400" height="300" fill="#9aa6b2"/><path d="M40 40q20-20 50-6 30-16 50 6 20 0 16 14H30q-6-10 10-14zM240 30q20-16 46-4 26-12 44 6 16 2 12 14H236q-8-8 4-16z" fill="#7d8894"/><rect y="150" width="400" height="60" fill="#6f94a3"/><path d="M0 50q30-8 60 0l40 12 20 90H0z" fill="#77858f"/>${stripes(74,8,'#4f5c66',0,110)}<path d="M150 130l12 20 10-6 14 22" stroke="#5f6f7a" stroke-width="2" fill="none"/><path d="M0 205q200-20 400 0v95H0z" fill="#d8c79d"/>${[...Array(18)].map((_,i)=>`<path d="M${i*23+8} ${10+(i*37)%60}l-6 16" stroke="#e6eef2" stroke-width="1.4" opacity=".7"/>`).join('')}`,
 wueste:`<rect width="400" height="300" fill="#f6dfb0"/><circle cx="330" cy="60" r="26" fill="#f7c85a" opacity=".9"/><path d="M0 120q40-30 90-20t80-6 70 10l10 100H0z" fill="#d9763f"/><path d="M180 140q50-40 110-26t110-4v90H170z" fill="#c8553d"/>${stripes(130,6,'#a8432f',0,240,11)}${stripes(150,5,'#8e3525',180,400,11)}<path d="M0 210q200-26 400 0v90H0z" fill="#eac27f"/>`,
 badlands:`<rect width="400" height="300" fill="#dbe9ee"/><path d="M0 150l30-60h60l20 60zM120 150l40-80h70l30 80zM280 150l20-50h60l40 50z" fill="#d9c49a"/>${stripes(100,6,'#b39a6a',20,110,9)}${stripes(92,7,'#a88e60',150,250,9)}${stripes(112,5,'#b39a6a',290,390,9)}<path d="M0 150h400v150H0z" fill="#cdb98a"/><path d="M0 210q200-20 400 0v90H0z" fill="#bfa877"/>${[40,160,300].map(x=>`<path d="M${x} 230q4-10 8 0M${x+12} 232q3-8 6 0" stroke="#8a8a4a" stroke-width="1.6" fill="none"/>`).join('')}`,
 savanne:`<rect width="400" height="300" fill="#f5e6bd"/><circle cx="80" cy="60" r="24" fill="#f7c85a"/><path d="M0 170q100-20 200-6t200-4v140H0z" fill="#d6c27a"/><path d="M300 120v50M280 122q20-18 44-2" stroke="#6e4a30" stroke-width="4" fill="none"/><path d="M262 118q40-26 80-2q-40 12-80 2z" fill="#7fa66a" ${S}/><path d="M40 130v40M28 132q16-14 30 0" stroke="#6e4a30" stroke-width="3" fill="none"/><path d="M16 128q28-18 54 0q-28 8-54 0z" fill="#8fae6a" ${S}/><path d="M150 250q60-24 140 0q-70 18-140 0z" fill="#a8724a" opacity=".7"/>`,
 weg:`<rect width="400" height="300" fill="#f7e2b8"/><rect y="120" width="400" height="26" fill="#8fbccb"/><path d="M0 146h400v154H0z" fill="#d8c47e"/><path d="M180 146q-10 60-160 154h120q60-90 60-154z" fill="#e8d4a0"/><circle cx="330" cy="70" r="22" fill="#f7c85a"/><path d="M350 146v-30M340 118q10-12 22 0" stroke="#6e4a30" stroke-width="3" fill="none"/><path d="M330 116q20-14 40 0q-20 6-40 0z" fill="#7fa66a"/>`,
 museum:`<rect width="400" height="300" fill="#efe4cc"/>${[40,160,280].map(x=>`<path d="M${x} 190v-110q40-40 80 0v110" fill="#e4d6b6" stroke="#cdb994" stroke-width="3"/>`).join('')}<path d="M0 200h400v100H0z" fill="#d9c49a"/><path d="M0 200h400" stroke="#b39a6a" stroke-width="3"/><path d="M180 60h40v14h-40z" fill="#c8553d" opacity=".5"/>`,
 labor:`<rect width="400" height="300" fill="#e9e2d2"/><path d="M230 40h150v8H230zM230 100h150v8H230z" fill="#a8724a"/>${[250,290,330].map((x,i)=>`<circle cx="${x+10}" cy="${30-i%2*4}" r="9" fill="${['#d7b58f','#efe4cc','#c9b88f'][i]}" stroke="${INK}" stroke-width="1.2" stroke-opacity=".6"/>`).join('')}<path d="M246 96l10-18 12 18zM300 96h30v-14h-30z" fill="#d9c49a" stroke="${INK}" stroke-width="1.2" stroke-opacity=".6"/><rect x="20" y="30" width="90" height="70" rx="6" fill="#dfeef0" stroke="#a8724a" stroke-width="5"/><path d="M0 210h400v90H0z" fill="#cdbfa0"/><path d="M40 200h320v12H40z" fill="#a8724a"/>`,
};

/* ---------- Lager ---------- */
function mount(r){ root=r; camp(); }
function camp(){
  story=null; GK.idle.stop(); const st=LST();
  const tent=`<svg viewBox="0 0 200 150"><path d="M10 140L100 14l90 126z" fill="#d98b5f" ${S}/><path d="M100 14l-30 126h60z" fill="#a8583a" ${S}/><path d="M100 60l-16 80h32z" fill="#3d3226" opacity=".7"/><path d="M100 14v-10M100 4l20 6-20 6" fill="#c8553d" stroke="${INK}" stroke-width="1.5"/><path d="M0 142h200" stroke="#6e4a30" stroke-width="3"/></svg>`;
  const fire=`<svg viewBox="0 0 120 110"><ellipse cx="60" cy="98" rx="46" ry="10" fill="#6e4a30" opacity=".35"/><path d="M22 96l76-18M26 80l72 18" stroke="#7a4a2a" stroke-width="9" stroke-linecap="round"/>${[[30,92],[44,98],[60,100],[76,98],[90,92]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="#9a9a90" ${S}/>`).join('')}
    <g class="la-fl"><path class="f1" d="M60 88q-26-14-14-40 4 10 10 12-2-22 14-36 0 18 10 26 8-8 6-18 14 18 4 40-8 18-30 16z" fill="#e9763f"/><path class="f2" d="M60 88q-14-8-8-24 4 6 8 6 0-12 8-20 2 12 6 16 6 10-2 18-4 6-12 4z" fill="#f0c35a"/></g></svg>`;
  root.innerHTML=`<div class="la fill"><div class="la-sky"></div>
    <div class="la-scene"><button class="la-tent" id="laTent" type="button" aria-label="Zelt">${tent}</button><button class="la-fire" id="laFire" type="button" aria-label="Lagerfeuer">${fire}<span class="la-spark"></span><span class="la-spark s2"></span></button>
      <button class="la-table" id="laMission" type="button">${ART.icon('la_tisch')}<b class="hand">Mission</b><small>Junior-Paläontologe</small></button></div>
    <div class="la-people">${PEOPLE.map(p=>`<button class="la-person" data-id="${p.id}" type="button"><span class="la-pimg"><img src="${DW.svgURL(personSVG(p))}" alt=""></span><b class="hand">${p.n}</b>${st.heard[p.id]?`<span class="la-heard">${ART.icon('check',30)}</span>`:''}</button>`).join('')}</div></div>`;
  DW.$$('.la-person',root).forEach(b=>b.onclick=()=>{ DW.sfx('pop'); openStory(b.dataset.id); });
  root.querySelector('#laMission').onclick=()=>{ DW.sfx('pop'); missionIntro(); };
  root.querySelector('#laFire').onclick=()=>{ DW.sfx('whoosh'); const f=root.querySelector('#laFire'); f.classList.remove('boost'); void f.offsetWidth; f.classList.add('boost'); DW.say(DW.pick(['Knister, knister! Am Lagerfeuer erzählen sich Forscher abends ihre Geschichten.','Das Feuer wärmt. In der Wüste Gobi wird es nachts ganz kalt!'])); };
  root.querySelector('#laTent').onclick=()=>{ DW.sfx('tap'); DW.say('Im Zelt schlafen die Forscher nach einem langen Grabungstag. Pssst!'); };
  const n=Object.keys(st.heard).length;
  DW.say(n?'Willkommen zurück im Forscher-Lager! Tippe auf eine Person oder starte die Mission am Kartentisch.':'Willkommen im Forscher-Lager! Hier sitzen berühmte Fossilien-Forscherinnen und -Forscher am Feuer. Tippe auf eine Person, dann erzählt sie dir ihre Geschichte. Am Kartentisch wartet deine Mission!');
  GK.idle.set(()=>GK.pulse(root.querySelector(n>=2?'#laMission':'.la-person')),()=>DW.say(n>=2?'Bist du bereit für die Mission? Tippe auf den Kartentisch!':'Tippe auf eine Person am Feuer!'));
}

/* ---------- Bildgeschichte ---------- */
function openStory(id){
  const p=PEOPLE.find(x=>x.id===id); story={p,i:0}; GK.idle.stop();
  root.innerHTML=`<div class="la-story fill">
    <div class="la-shead"><button class="ibtn big" id="laBack" type="button" aria-label="Zurück zum Lager">${ART.icon('zelt')}</button>
      <span class="la-portrait">${p.photo?`<img src="${p.photo}" alt="${esc(p.n)}">`:`<img class="av" src="${DW.svgURL(personSVG(p))}" alt="">`}</span>
      <div class="la-who"><b class="hand">${p.n}</b><small>${p.yrs} · ${p.land}</small></div></div>
    <div class="la-pwrap" id="laPwrap"><div class="la-panel" id="laPanel"></div></div>
    <div class="la-text card" id="laText"></div>
    <div class="la-snav"><button class="ibtn big" id="laPrev" type="button" aria-label="Zurück">${ART.icon('pfeil_l')}</button><div class="la-dots" id="laDots"></div>
      <button class="ibtn big" id="laSay" type="button" aria-label="Vorlesen">${ART.icon('lautsprecher')}</button><button class="ibtn big" id="laNext" type="button" aria-label="Weiter">${ART.icon('pfeil_r')}</button></div></div>`;
  root.querySelector('#laBack').onclick=()=>{ DW.sfx('tap'); DW.hush(); camp(); };
  root.querySelector('#laPrev').onclick=()=>{ if(story.i>0){ DW.sfx('whoosh'); story.i--; panel(); } };
  root.querySelector('#laNext').onclick=()=>{ DW.sfx('whoosh'); if(story.i<p.panels.length-1){ story.i++; panel(); } else storyEnd(); };
  root.querySelector('#laSay').onclick=()=>DW.say(p.panels[story.i].t);
  GK.listen(window,'resize',()=>{ clearTimeout(fitT); fitT=setTimeout(fitPanel,120); });
  panel(true);
}
function fitPanel(){ const w=root&&root.querySelector('#laPwrap'), pn=root&&root.querySelector('#laPanel'); if(!w||!pn) return;
  let W=w.clientWidth, H=w.clientHeight, pw=Math.min(W,H*4/3,900); pn.style.width=pw+'px'; pn.style.height=(pw*.75)+'px'; }
function itemHTML(it,p){
  const pos=`left:${it.x}%;bottom:${it.y}%;`;
  if(it.p) return `<img class="la-it la-per" style="${pos}height:${it.h}%" src="${DW.svgURL(personSVG(p,{flip:!!it.flip,lupe:!!it.lupe}))}" alt="">`;
  if(it.h2){ const h=HELPERS[it.c%HELPERS.length]; return `<span class="la-it la-carry" style="${pos}height:${it.h}%"><img class="la-cb" src="${DW.svgURL(ART.icon('knochen'))}" alt=""><img class="la-ch" src="${DW.svgURL(ART.avatar(h,{nohat:true,ph:(it.c*.3)%1}))}" alt=""></span>`; }
  if(it.an) return `<img class="la-it ${it.fos?'la-fos':''}" style="${pos}width:${it.w}%" src="${DW.svgURL(DW.animalSVG(it.an,{shadow:false}))}" alt="">`;
  return `<img class="la-it" style="${pos}width:${it.w}%" src="${DW.svgURL(ART.icon(it.ic))}" alt="">`;
}
function panel(first){
  const {p,i}=story, pn=p.panels[i], el=root.querySelector('#laPanel');
  el.innerHTML=`<svg class="la-bg" viewBox="0 0 400 300" preserveAspectRatio="none">${BG[pn.bg]||BG.museum}</svg>${pn.it.map(it=>itemHTML(it,p)).join('')}<span class="la-num hand">${i+1}</span>`;
  el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
  root.querySelector('#laText').textContent=pn.t;
  root.querySelector('#laDots').innerHTML=p.panels.map((_,k)=>`<i class="${k===i?'on':k<i?'seen':''}"></i>`).join('');
  root.querySelector('#laPrev').style.visibility=i?'visible':'hidden';
  fitPanel();
  const nx=root.querySelector('#laNext');
  DW.say((first?`Hallo! Ich bin ${p.n}. `:'')+pn.t).then(()=>{ if(root&&story&&story.i===i&&story.p===p) GK.pulse(nx); });
  GK.idle.set(()=>GK.pulse(nx),()=>DW.say('Tippe auf den Pfeil, dann geht die Geschichte weiter.'));
}
function storyEnd(){
  const {p}=story, st=LST(), first=!st.heard[p.id]; st.heard[p.id]=Date.now(); DW.save();
  if(first){ DW.sfx('star'); DW.toast(`<img src="${DW.svgURL(personSVG(p))}" alt="" style="width:100%">`,p.n,'Geschichte gehört!'); }
  const n=Object.keys(st.heard).length;
  DW.say(n>=PEOPLE.length?`Toll! Du kennst jetzt alle ${PEOPLE.length} Geschichten!`:'Danke fürs Zuhören! Wer erzählt als Nächstes?');
  camp();
}

/* ---------- Mission ---------- */
function missionIntro(){
  GK.idle.stop();
  GK.intro(root,{id:ID,title:'Junior-Paläontologe',art:GK.icon('rucksack')+`<img src="${DW.svgURL(ART.avatar(me(),{lupe:true}))}" alt="">`+GK.icon('lupe'),
    say:'Deine Mission: Werde Junior-Paläontologin oder Junior-Paläontologe! Pack deinen Rucksack, beantworte drei Fragen und hol dir deine Urkunde.',play:'Mission starten',onStart:l=>{lv=l;pack();}});
}
let miss=0;
function stepBar(k){ return `<div class="la-steps">${['rucksack','kl_q','stern'].map((ic,j)=>`<span class="${j<k?'done':j===k?'now':''}">${j<k?ART.icon('check',34):ART.icon(ic==='kl_q'?'lupe':ic,34)}</span>`).join('<i></i>')}</div>`; }
function pack(){
  miss=0; const nT=lv===1?4:lv===2?5:6, nS=lv===1?2:lv===2?3:4;
  const need=GK.sample(TOOLS,nT), items=DW.shuffle(need.concat(GK.sample(SILLY,nS))); let got=0;
  root.innerHTML=`<div class="la-mis fill">${stepBar(0)}<p class="hand la-q">Was braucht man für eine Ausgrabung? Pack es in den Rucksack!</p>
    <div class="la-pack"><div class="la-bag" id="laBag">${ART.icon('rucksack')}<div class="la-inbag" id="laIn"></div><b class="hand" id="laCnt">0 / ${nT}</b></div>
      <div class="la-items">${items.map((it,k)=>`<button class="la-item" data-k="${k}" type="button">${GK.icon(it.ic)}<b class="hand">${it.n}</b></button>`).join('')}</div></div></div>`;
  const bag=root.querySelector('#laBag');
  DW.say(`Was braucht man für eine Ausgrabung? Tippe auf die richtigen Dinge oder zieh sie in den Rucksack. Du brauchst ${nT} Sachen.`);
  GK.idle.set(()=>{ const b=DW.$$('.la-item',root).find(x=>!x.classList.contains('in')&&need.includes(items[+x.dataset.k])); GK.pulse(b); },()=>DW.say('Was braucht ein Forscher zum Graben? Einen Pinsel, eine Lupe …?'));
  const put=(b,it)=>{
    if(!root||b.classList.contains('in')||got>=nT) return false;
    if(!need.includes(it)){ if(!b.dataset.no){ b.dataset.no=1; miss++; } GK.no(b); GK.no(bag); DW.say(it.say); return false; }   // derselbe Quatsch zählt nur einmal
    b.classList.add('in'); b.disabled=true; got++; GK.ok(bag); DW.sfx('pop');
    const r=b.getBoundingClientRect(), rb=bag.getBoundingClientRect(); const fly=DW.h(`<div class="la-fly">${GK.icon(it.ic)}</div>`); document.body.appendChild(fly);
    fly.style.left=r.left+r.width/2+'px'; fly.style.top=r.top+r.height/2+'px';
    try{ fly.animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:`translate(calc(-50% + ${rb.left+rb.width/2-r.left-r.width/2}px),calc(-50% + ${rb.top+rb.height/2-r.top-r.height/2}px)) scale(.3)`,opacity:.3}],{duration:520,easing:'ease-in',fill:'forwards'}); }catch(e){}
    setTimeout(()=>fly.remove(),540);
    root.querySelector('#laIn').insertAdjacentHTML('beforeend',GK.icon(it.ic)); root.querySelector('#laCnt').textContent=`${got} / ${nT}`;
    DW.say(it.say);
    if(got===nT){ GK.idle.stop(); DW.$$('.la-item',root).forEach(x=>x.disabled=true); GK.after(2600,()=>{ DW.sfx('win'); let went=false; const go=()=>{ if(went||!root||!root.querySelector('#laBag')) return; went=true; quiz(); };
      DW.say('Super! Dein Rucksack ist fertig gepackt!').then(()=>GK.after(400,go)); GK.after(4500,go); }); }
    return true;
  };
  DW.$$('.la-item',root).forEach(b=>{ const it=items[+b.dataset.k];
    b.__put=()=>put(b,it); DW.drag(b,{ghost:()=>GK.icon(it.ic),onTap:()=>put(b,it),onDrop:(x,y)=>DW.hit(x,y,bag)?put(b,it):false}); });
}
function quiz(){
  const qs=GK.sample(QUESTIONS,3), n=lv===1?2:3; let qi=0;
  const pic=c=>c.pp?`<img src="${DW.svgURL(personSVG(PEOPLE.find(x=>x.id===c.pp)))}" alt="">`:c.an?GK.img(c.an,{mood:'happy'}):GK.icon(c.ic);
  function ask(){
    if(qi>=qs.length) return nameStep();
    const q=qs[qi], ch=DW.shuffle(q.ch.slice(0,n).map((c,k)=>({...c,ok:k===0})));
    root.innerHTML=`<div class="la-mis fill">${stepBar(1)}${GK.progress(qi,qs.length)}<div class="la-qq card"><h2 class="hand">${q.q}</h2><button class="ibtn" id="laQs" type="button" aria-label="Vorlesen">${ART.icon('lautsprecher')}</button></div>
      <div class="gk-choices la-qch">${ch.map((c,k)=>`<button class="gk-choice" data-k="${k}" type="button">${pic(c)}<b>${c.n}</b></button>`).join('')}</div></div>`;
    const say=()=>DW.say(q.q+' '+ch.map(c=>c.n).join('? Oder ')+'?'); root.querySelector('#laQs').onclick=say; say();
    const right=root.querySelector(`.gk-choice[data-k="${ch.findIndex(c=>c.ok)}"]`); let m=0;
    GK.idle.set(()=>GK.pulse(root.querySelector('.gk-choice:not(.out)')),()=>DW.say(q.hint));
    DW.$$('.gk-choice',root).forEach(b=>b.onclick=()=>{ const c=ch[+b.dataset.k];
      if(c.ok){ GK.ok(b); GK.idle.stop(); DW.$$('.gk-choice',root).forEach(x=>x.onclick=null); qi++; let went=false; const go=()=>{ if(went||!root||!root.querySelector('.la-qq')) return; went=true; ask(); }; DW.say(q.yes).then(()=>GK.after(400,go)); GK.after(1800+q.yes.length*85,go); }
      else { miss++; m++; b.classList.add('out'); GK.no(b,'Hm, noch nicht. '+q.hint); if(m>=2) GK.pulse(right); } });
  }
  ask();
}
/* Name mit großer Bildschirm-Tastatur (freiwillig) */
function nameStep(){
  if(childName()) return certificate();
  let name='';
  const keys='ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ'.split('');
  root.innerHTML=`<div class="la-mis fill">${stepBar(2)}<p class="hand la-q">Wie heißt du? Dein Name kommt auf die Urkunde.</p>
    <div class="la-name card hand" id="laName">&nbsp;</div>
    <div class="la-kb">${keys.map(k=>`<button class="la-key" data-k="${k}" type="button">${k}</button>`).join('')}<button class="la-key wide" data-k=" " type="button">Leerzeichen</button><button class="la-key" data-k="del" type="button" aria-label="Löschen">⌫</button></div>
    <div class="row" style="justify-content:center;flex-wrap:wrap"><button class="btn big go" id="laOk" type="button">${ART.icon('check',36)}Fertig</button><button class="btn ghost" id="laSkip" type="button">Ohne Namen</button></div></div>`;
  const out=root.querySelector('#laName'); const show=()=>{ out.innerHTML=name?esc(name):'&nbsp;'; };
  DW.$$('.la-key',root).forEach(b=>b.onclick=()=>{ const k=b.dataset.k; DW.sfx('click');
    if(k==='del') name=name.slice(0,-1); else if(name.length<20){ const low=name.length&&name[name.length-1]!==' '; name+=low?k.toLowerCase():k; }
    show(); });
  root.querySelector('#laOk').onclick=()=>{ DW.sfx('pop'); if(name.trim()){ DW.state.name=name.trim(); DW.save(); DW.say(`Hallo ${name.trim()}!`); } certificate(); };
  root.querySelector('#laSkip').onclick=()=>{ DW.sfx('tap'); certificate(); };
  DW.say('Wie heißt du? Tippe die Buchstaben. Ein Erwachsener kann dir helfen. Du kannst auch ohne Namen weitermachen.');
  GK.idle.set(()=>GK.pulse(root.querySelector('#laOk')),null);
}
/* ---------- Urkunde ---------- */
const loadImg=src=>new Promise(r=>{ const i=new Image(); let done=false; const fin=()=>{ if(!done){ done=true; r(i); } }; i.onload=fin; i.onerror=fin; setTimeout(fin,2500); i.src=src; });
async function drawCert(cv,female){
  const x=cv.getContext('2d'), W=cv.width=1400, H=cv.height=990;
  try{ await Promise.all([document.fonts.load('80px "Patrick Hand"'),document.fonts.load('32px "Andika"'),document.fonts.load('bold 32px "Andika"')]); }catch(e){}
  /* Von der Festplatte (file://) dürfen gemalte PNG-Bilder nicht in ein speicherbares Bild – dann die Zeichnungen nehmen */
  const Dr=location.protocol==='file:'&&window.ASSETS&&ASSETS.drawn?ASSETS.drawn:null;
  const avS=Dr?Dr.avatar.call(ART,me(),{lupe:true}):ART.avatar(me(),{lupe:true}), icS=n=>Dr?Dr.icon.call(ART,n):ART.icon(n);
  const [paper,av,dino,st,...tools]=await Promise.all([loadImg(DW.paperURL),loadImg(DW.svgURL(avS)),loadImg(DW.svgURL(DW.animalSVG('protoceratops',{mood:'happy',shadow:false,drawn:!!Dr}))),loadImg(DW.svgURL(icS('stern'))),
    ...['pinsel','hammer','lupe','buch','kamera'].map(n=>loadImg(DW.svgURL(icS(n))))]);
  x.fillStyle='#f8f0dc'; x.fillRect(0,0,W,H);
  try{ x.fillStyle=x.createPattern(paper,'repeat'); x.fillRect(0,0,W,H); }catch(e){}
  // Aquarell-Rand
  let seed=7; const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const cols=['#8fbccb','#7fa66a','#f0c35a','#d98b5f','#b58cbd'];
  for(let k=0;k<260;k++){ const side=k%4, t=rnd(); let px,py; if(side===0){px=t*W;py=rnd()*50;} else if(side===1){px=t*W;py=H-rnd()*50;} else if(side===2){px=rnd()*50;py=t*H;} else {px=W-rnd()*50;py=t*H;}
    x.globalAlpha=.10+rnd()*.12; x.fillStyle=cols[Math.floor(rnd()*cols.length)]; x.beginPath(); x.ellipse(px,py,26+rnd()*40,18+rnd()*30,rnd()*3,0,7); x.fill(); }
  x.globalAlpha=1; x.strokeStyle='rgba(61,50,38,.55)'; x.lineWidth=4; x.strokeRect(70,70,W-140,H-140); x.lineWidth=1.5; x.strokeRect(82,82,W-164,H-164);
  x.textAlign='center'; x.fillStyle='#3d3226';
  x.font='110px "Patrick Hand", cursive'; x.fillText('Urkunde',W/2,200);
  x.fillStyle='#c8553d'; x.font='72px "Patrick Hand", cursive'; x.fillText(female?'Junior-Paläontologin':'Junior-Paläontologe',W/2,290);
  x.fillStyle='#6b5a45'; x.font='32px Andika, sans-serif'; x.fillText('Das Forscher-Lager der Dino-Inselwelt bestätigt:',W/2,360);
  const nm=childName(); x.fillStyle='#3d3226'; x.font='96px "Patrick Hand", cursive'; x.fillText(nm||' ',W/2,470);
  x.strokeStyle='rgba(61,50,38,.5)'; x.lineWidth=2; x.beginPath(); x.moveTo(W/2-300,492); x.lineTo(W/2+300,492); x.stroke();
  x.fillStyle='#3d3226'; x.font='31px Andika, sans-serif';
  x.fillText(`${female?'Sie':'Er'} kennt die Werkzeuge der Fossilien-Forscher,`,W/2,560); x.fillText('hat den Rucksack richtig gepackt und alle Fragen gelöst.',W/2,602);
  // Bilder
  if(av.naturalWidth) x.drawImage(av,110,470,240,352);
  if(dino.naturalWidth){ const r=dino.naturalHeight/dino.naturalWidth; x.drawImage(dino,1000,700-260*r+40,300,300*r); }
  tools.forEach((t,k)=>{ if(t.naturalWidth) x.drawImage(t,W/2-230+k*96,640,82,82); });
  // Stempel
  x.save(); x.translate(1180,230); x.rotate(-.2); x.strokeStyle='rgba(200,85,61,.8)'; x.fillStyle='rgba(200,85,61,.12)'; x.lineWidth=6; x.beginPath(); x.arc(0,0,92,0,7); x.fill(); x.stroke();
  x.lineWidth=2; x.beginPath(); x.arc(0,0,76,0,7); x.stroke(); if(st.naturalWidth) x.drawImage(st,-44,-60,88,88);
  x.fillStyle='rgba(200,85,61,.9)'; x.font='26px "Patrick Hand", cursive'; x.fillText('Forscher-Lager',0,52); x.restore();
  // Datum & Unterschrift
  const d=new Date().toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'});
  x.textAlign='left'; x.fillStyle='#3d3226'; x.font='30px Andika, sans-serif'; x.fillText('Datum: '+d,400,860);
  x.textAlign='center'; x.font='40px "Patrick Hand", cursive'; x.fillStyle='#3b6f8a'; x.fillText('Dino-Forscher-Team',860,850);
  x.strokeStyle='rgba(61,50,38,.5)'; x.beginPath(); x.moveTo(700,866); x.lineTo(1020,866); x.stroke();
  x.fillStyle='#6b5a45'; x.font='22px Andika, sans-serif'; x.fillText('Leitung Forscher-Lager',860,896);
}
async function certificate(){
  GK.idle.stop(); let female=((DW.figureOf(DW.state)||{}).g==='f')||['mia','lina'].includes(DW.state.avatar);
  const first=!DW.state.stickers.junior;
  root.innerHTML=`<div class="la-mis la-certv fill">${stepBar(3)}
    <div class="la-cwrap"><canvas class="la-cert" id="laCert" width="1400" height="990"></canvas></div>
    <div class="row la-cbtns"><span class="la-g"><button class="btn ${female?'sun':'ghost'}" data-f="1" type="button">-in</button><button class="btn ${female?'ghost':'sun'}" data-f="0" type="button">-e</button></span>
      <a class="btn big go" id="laDl" download="Urkunde-Junior-Palaeontologie.png" href="#">${ART.icon('pfeil_r',34)}Speichern</a>
      <button class="btn big ghost" id="laPrint" type="button">${ART.icon('buch',34)}Drucken</button>
      <button class="btn big sun" id="laDone" type="button">${ART.icon('stern',34)}Fertig</button></div></div>`;
  const cv=root.querySelector('#laCert'), dl=root.querySelector('#laDl');
  const redraw=async()=>{ await drawCert(cv,female); if(!root) return; try{ dl.href=cv.toDataURL('image/png'); dl.classList.remove('off'); }catch(e){ dl.classList.add('off'); } };
  await redraw(); if(!root||!root.querySelector('#laCert')) return;
  DW.$$('.la-g .btn',root).forEach(b=>b.onclick=async()=>{ female=b.dataset.f==='1'; DW.$$('.la-g .btn',root).forEach(x=>{ x.classList.toggle('sun',x===b); x.classList.toggle('ghost',x!==b); }); DW.sfx('tap'); await redraw(); });
  dl.onclick=e=>{ if(dl.classList.contains('off')){ e.preventDefault(); DW.say('Speichern geht hier leider nicht.'); return; } DW.sfx('magic'); DW.say('Deine Urkunde wird gespeichert.'); };
  root.querySelector('#laPrint').onclick=()=>{ DW.sfx('tap'); let img; try{ img=cv.toDataURL('image/png'); }catch(e){ return; }
    const el=DW.h(`<img class="la-printimg" alt="Urkunde" src="${img}">`); document.body.appendChild(el); document.body.classList.add('la-printing');
    const done=()=>{ document.body.classList.remove('la-printing'); el.remove(); window.removeEventListener('afterprint',done); };
    window.addEventListener('afterprint',done); setTimeout(()=>{ try{ window.print(); }catch(e){} setTimeout(done,1500); },100); };
  root.querySelector('#laDone').onclick=()=>{ DW.sfx('pop'); finish(); };
  if(first) GK.after(600,()=>DW.addSticker('junior'));
  DW.sfx('win'); DW.confetti(80);
  const nm=childName();
  DW.say(`Herzlichen Glückwunsch${nm?', '+nm:''}! Du bist jetzt ${female?'Junior-Paläontologin':'Junior-Paläontologe'}! Hier ist deine Urkunde. Du kannst sie speichern oder ausdrucken.`);
  GK.idle.set(()=>GK.pulse(root.querySelector('#laDone')),null);
}
function finish(){
  GK.finish(root,{id:ID,stars:miss===0?3:miss<=3?2:1,title:'Mission geschafft!',art:`<img src="${DW.svgURL(ART.avatar(me(),{lupe:true}))}" alt="">`+GK.icon('rucksack'),
    extra:`<div class="row" style="justify-content:center;flex-wrap:wrap"><button class="btn ghost" id="laCertAgain" type="button">${ART.icon('stern',30)}Urkunde</button><button class="btn ghost" id="laCamp" type="button">${ART.icon('zelt',30)}Zum Lager</button></div>`,
    say:'Mission geschafft! Echte Forscher arbeiten genau so: sorgfältig, neugierig und mit den richtigen Werkzeugen.',again:()=>pack()});
  const c=root.querySelector('#laCertAgain'); if(c) c.onclick=()=>{ DW.sfx('pop'); certificate(); };
  const k=root.querySelector('#laCamp'); if(k) k.onclick=()=>{ DW.sfx('tap'); camp(); };
}

function unmount(){ clearTimeout(fitT); story=null; document.body.classList.remove('la-printing'); DW.$$('.la-printimg,.la-fly').forEach(e=>e.remove()); root=null; }
DW.stations[ID]={title:'Forscher-Lager',mount,unmount};
})();
