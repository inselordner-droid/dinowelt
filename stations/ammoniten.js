/* =====================================================================
   DINO-INSELWELT · Station Ammoniten-Riff
   Zählen (1–10), Muster fortsetzen und nach Größe ordnen – mit
   Ammoniten, den Tintenfisch-Verwandten mit der Spiralschale.
   ===================================================================== */
(function(){
"use strict";
const ID='ammoniten';
const INK='#3d3226';

/* ---------- Spieldaten ---------- */
const COLS=[{c:'#e2a36b',n:'orange'},{c:'#8fbccb',n:'blau'},{c:'#b58cbd',n:'lila'},{c:'#8fbf7a',n:'grün'},{c:'#f0c35a',n:'gelb'}];
const WORDS=['null','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn'];
const PLAN={
 1:{rounds:['count','pattern','sort','count','pattern'],max:5,sort:3,pats:['AB'],size:false},
 2:{rounds:['count','pattern','sort','count','pattern','sort'],max:7,sort:4,pats:['AB','ABB','AAB'],size:true},
 3:{rounds:['count','pattern','sort','pattern','count','sort','pattern'],max:10,sort:5,pats:['ABC','ABB','AABB','ABC'],size:true},
};
const FACTS=[
 'Ammoniten waren Verwandte der Tintenfische. Sie wohnten in einer Spiralschale.',
 'In der Schale waren viele Kammern mit Gas. So konnte der Ammonit im Wasser schweben.',
 'Ammoniten lebten über 300 Millionen Jahre lang in allen Meeren.',
 'Vor 66 Millionen Jahren starben die Ammoniten aus – zusammen mit den großen Dinosauriern.',
 'Manche Ammoniten waren winzig. Andere waren größer als ein Autoreifen!',
 'Heute findet man Ammoniten als Fossilien, zum Beispiel am Strand.',
];

/* ---------- Zeichnung: lebender Ammonit ---------- */
function amSVG(col,cls=''){
  const cx=30,cy=34,R=24; let sp='';
  for(let t=0;t<=6*Math.PI;t+=.2){ const r=2.5+t/(6*Math.PI)*(R-3); sp+=(t?'L':'M')+(cx+Math.cos(t)*r).toFixed(1)+' '+(cy+Math.sin(t)*r).toFixed(1); }
  let ribs=''; for(let a=0;a<360;a+=18){ const t=a*Math.PI/180, r1=R*.62, r2=R-1; ribs+=`<path d="M${(cx+Math.cos(t)*r1).toFixed(1)} ${(cy+Math.sin(t)*r1).toFixed(1)}L${(cx+Math.cos(t+.12)*r2).toFixed(1)} ${(cy+Math.sin(t+.12)*r2).toFixed(1)}" stroke="${ART.shade(col,.72)}" stroke-width="1.6"/>`; }
  return `<svg class="${cls}" viewBox="0 0 84 64" aria-hidden="true">
    ${[0,1,2,3,4].map(i=>`<path d="M52 ${36+i*2}q12 ${-6+i*4} ${24+i} ${-4+i*5}" stroke="#d99a8a" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}
    <path d="M44 28q14-4 16 8t-14 10z" fill="#e8b0a0" stroke="${INK}" stroke-width="1.4"/><circle cx="52" cy="33" r="3.2" fill="#fff" stroke="${INK}" stroke-width="1"/><circle cx="53" cy="33" r="1.6" fill="${INK}"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="${col}" stroke="${INK}" stroke-width="1.8"/>${ribs}
    <path d="${sp}" stroke="${ART.shade(col,.6)}" stroke-width="2" fill="none"/><path d="M14 22q8-10 20-8" stroke="rgba(255,255,255,.55)" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>`;
}

/* ---------- Hintergrund ---------- */
function wash(top,bot){ const w=160,h=160,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,top);g.addColorStop(1,bot);x.fillStyle=g;x.fillRect(0,0,w,h);
  const N=DW.noise2||(()=>.5),im=x.getImageData(0,0,w,h),d=im.data,s=Math.random()*40;for(let j=0;j<h;j++)for(let i=0;i<w;i++){const v=(N(i/30+s,j/26+s)*.7+N(i/9,j/9+s)*.3-.5)*44,k=(j*w+i)*4;d[k]+=v*.8;d[k+1]+=v;d[k+2]+=v*.9;}x.putImageData(im,0,0);return c.toDataURL(); }
let WASH=null;
function seaBG(){ if(!WASH) WASH=wash('#b5e0d6','#4d8c9a'); const rays=[...Array(4)].map((_,i)=>`<i style="left:${6+i*25}%;animation-delay:${-i*2}s"></i>`).join(''), bubs=[...Array(8)].map(()=>{const s=DW.rand(8,18);return `<span class="sd-bub" style="left:${DW.rand(2,98)}%;width:${s}px;height:${s}px;animation-duration:${DW.rand(7,13)}s;animation-delay:${-DW.rand(0,13)}s"></span>`;}).join('');
  const reef=`<svg class="am-reef" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 60V34q30-18 60-4t60-10 70 8 60-12 80 10 70-8V60z" fill="#d9c79c"/><path d="M0 60V46q60-10 120 0t140-6 140 4V60z" fill="#cbb98c"/></svg>`;
  return `<div class="sd-bg"><div class="sd-wash" style="background-image:url(${WASH})"></div><div class="sd-rays">${rays}</div>${bubs}${reef}<div class="sd-grain" style="background-image:url(${DW.paperURL})"></div></div>`; }

/* ---------- Zustand ---------- */
let root, lv=1, G=null, rzT=null;
/* Rückmeldungs-Klassen vor jeder neuen Rückmeldung abräumen (sonst gewinnt in der CSS-Reihenfolge immer dieselbe) */
const fb=el=>{ if(el) el.classList.remove('gk-good','gk-bad','gk-hint'); return el; };
function mount(r){ root=r; intro(); GK.listen(window,'resize',()=>{ clearTimeout(rzT); rzT=setTimeout(layCount,120); }); }
function intro(){
  GK.intro(root,{id:ID, art:`<div class="sd-iart">${amSVG('#e2a36b')}${amSVG('#8fbccb')}${amSVG('#b58cbd')}</div>`, title:'Ammoniten-Riff',
    say:'Das sind Ammoniten! Sie waren Verwandte der Tintenfische und wohnten in einer Spiralschale. Vor 66 Millionen Jahren starben sie aus, zusammen mit den Dinosauriern. Komm, wir zählen und ordnen sie!',
    onStart:l=>{ lv=l; start(); }});
}
function start(){ const P=PLAN[lv]; G={P,i:0,miss:0,facts:DW.shuffle(FACTS),lastN:0}; round(); }
function frame(title,body,choices=''){
  root.innerHTML=`<div class="sd-stage am" id="amStage">${seaBG()}
    <div class="sd-ask" id="amAsk"><div><div class="txt">${title}</div>${GK.progress(G.i,G.P.rounds.length)}</div><button class="ibtn" type="button" aria-label="Nochmal hören">${ART.icon('lautsprecher')}</button></div>
    <div class="am-main" id="amMain">${body}</div><div class="am-choices" id="amCh">${choices}</div></div>`;
}
function setLine(t){ root.querySelector('#amAsk .ibtn').onclick=()=>DW.say(t); DW.say(t); }
function round(){
  GK.idle.stop();
  if(G.i>=G.P.rounds.length) return finish();
  const k=G.P.rounds[G.i];
  if(k==='count') count(); else if(k==='pattern') pattern(); else sort();
}
function success(){
  GK.idle.stop(); G.busy=true; DW.sfx('ok');
  const f=G.facts[G.i%G.facts.length], card=DW.h(`<div class="am-fact card pop">${amSVG(COLS[G.i%5].c,'am-fsvg')}<p>${f}</p><button class="btn go big" type="button">${ART.icon('pfeil_r',36)}Weiter</button></div>`);
  root.querySelector('#amStage').appendChild(card);
  DW.say(DW.pick(['Richtig!','Super!','Genau!'])+' '+f);
  const b=card.querySelector('.btn'); b.onclick=()=>{ DW.sfx('tap'); G.busy=false; G.i++; round(); };
  GK.idle.set(()=>GK.pulse(fb(b)),()=>{GK.pulse(fb(b));DW.say('Tippe auf Weiter!');});
}

/* ---------- Zählen ---------- */
function count(){
  const P=G.P; let n; do{ n=1+Math.floor(Math.random()*P.max); }while(n===G.lastN||(lv>1&&n<3)); G.lastN=n;
  const opts=DW.shuffle([n].concat(DW.shuffle([n-2,n-1,n+1,n+2].filter(x=>x>=1&&x<=Math.max(P.max,n+1))).slice(0,2)));
  const col=DW.pick(COLS).c;
  frame('Wie viele Ammoniten?','',opts.map(v=>`<button class="am-num" data-v="${v}" type="button"><b>${v}</b><span>${[...Array(v)].map(()=>'<i></i>').join('')}</span></button>`).join(''));
  const main=root.querySelector('#amMain');
  G.tapped=0; G.cnt=[...Array(n)].map((_,i)=>{
    const b=DW.h(`<button class="am-a" type="button" style="--d:${(-Math.random()*3).toFixed(2)}s" aria-label="Ammonit">${amSVG(col)}<em></em></button>`);
    b.onclick=()=>{ if(b.classList.contains('on')||G.busy) return; G.tapped++; b.classList.add('on'); b.querySelector('em').textContent=G.tapped; DW.sfx('pop'); DW.say(WORDS[G.tapped]||String(G.tapped)); };
    main.appendChild(b); return {b,r:Math.random(),jx:DW.rand(-.1,.1),jy:DW.rand(-.1,.1)}; });
  layCount();
  G.ans=n;
  DW.$$('.am-num',root).forEach(b=>b.onclick=()=>{ if(G.busy) return; const v=+b.dataset.v;
    if(v===n){ GK.ok(fb(b)); let k=G.tapped; DW.$$('.am-a',root).filter(a=>!a.classList.contains('on')).forEach((a,i)=>{ const num=++k; GK.after(i*80,()=>{ a.querySelector('em').textContent=num; a.classList.add('on'); }); }); success(); }
    else { G.miss++; GK.no(fb(b)); DW.say('Hm, zähl noch mal! Tippe jeden Ammoniten einmal an.'); DW.$$('.am-a',root).forEach(a=>{a.classList.remove('on');a.querySelector('em').textContent='';}); G.tapped=0; } });
  setLine('Wie viele Ammoniten schwimmen hier? Tippe jeden an und zähle mit!');
  GK.idle.set(()=>GK.pulse(fb(root.querySelector('.am-a:not(.on)'))),()=>{ GK.pulse(fb(root.querySelector('.am-a:not(.on)'))); DW.say('Tippe die Ammoniten an. Ich zähle mit!'); });
}
/* Zähl-Ammoniten im Raster verteilen – passt sich an Drehen/Größenänderung an (vorher feste Pixelgrößen vom Start) */
function layCount(){
  const main=root&&root.querySelector('#amMain'); if(!main||!G||!G.cnt||!G.cnt.length||!G.cnt[0].b.isConnected) return;
  const W=main.clientWidth, H=main.clientHeight, n=G.cnt.length, land=W>H;
  const cols=Math.ceil(Math.sqrt(n*(land?1.8:.7))), rows=Math.ceil(n/cols), cw=W/cols, ch=H/rows, sz=Math.min(cw*.8,ch*.9,160);
  // feste, zufällige Reihenfolge der Zellen (bleibt beim Drehen erhalten, solange das Raster gleich groß ist)
  const order=[...Array(cols*rows).keys()].map(c=>({c,k:Math.sin((c+1)*12.9898+G.cnt[0].r*78.233)*43758.5453%1})).sort((a,b)=>a.k-b.k).map(o=>o.c);
  G.cnt.forEach((o,i)=>{ const c=order[i], x=(c%cols+.5)*cw+o.jx*cw, y=(Math.floor(c/cols)+.5)*ch+o.jy*ch;
    Object.assign(o.b.style,{left:(x/W*100).toFixed(2)+'%',top:(y/H*100).toFixed(2)+'%',width:sz.toFixed(1)+'px',height:(sz*.76).toFixed(1)+'px'}); });
}

/* ---------- Muster ---------- */
function pattern(){
  const P=G.P, pat=DW.pick(P.pats), letters=[...new Set(pat)];
  const bySize=P.size&&Math.random()<.4&&letters.length===2;
  const cols=GK.sample(COLS,letters.length), base=DW.pick(COLS);
  const kind={}; letters.forEach((l,i)=>kind[l]=bySize?{c:base.c,s:i?.62:1}:{c:cols[i].c,s:1});
  // Länge der gezeigten Reihe variiert, damit die Lösung nicht immer das erste Muster-Element ist
  const minL=pat.length+1, maxL=Math.min(7,pat.length*2+1);
  const seq=(pat.repeat(4)).split('');
  const shown=seq.slice(0,minL+Math.floor(Math.random()*(maxL-minL+1)));
  const ans=seq[shown.length];
  const item=(k,cls='')=>`<span class="am-p ${cls}" style="--s:${kind[k].s}">${amSVG(kind[k].c)}</span>`;
  // Auswahl: richtige + andere Varianten
  const opts=letters.map(l=>({k:l,html:item(l)}));
  if(opts.length<3){ const extra=bySize?{c:DW.pick(COLS.filter(c=>c.c!==base.c)).c,s:1}:{c:COLS.find(c=>!Object.values(kind).some(k=>k.c===c.c)).c,s:1}; kind.X=extra; opts.push({k:'X',html:item('X')}); }
  frame('Wie geht es weiter?',`<div class="am-row">${shown.map(k=>item(k)).join('')}<span class="am-p am-q" id="amQ">?</span></div>`,
    DW.shuffle(opts).map(o=>`<button class="am-opt" data-k="${o.k}" type="button">${o.html}</button>`).join(''));
  G.ans=ans;
  DW.$$('.am-opt',root).forEach(b=>b.onclick=()=>{ if(G.busy) return;
    if(b.dataset.k===ans){ const q=root.querySelector('#amQ'); q.outerHTML=item(ans,'am-new'); GK.ok(fb(b)); success(); }
    else { G.miss++; GK.no(fb(b)); DW.say(bySize?'Hm, noch nicht. Schau: groß, klein … Was kommt jetzt?':'Hm, noch nicht. Schau auf die Farben. Was kommt als Nächstes?'); } });
  setLine(bySize?'Groß, klein, groß … Welcher Ammonit kommt als Nächstes?':'Schau auf die Farben! Welcher Ammonit kommt als Nächstes?');
  GK.idle.set(()=>GK.pulse(fb(root.querySelector('#amQ'))),()=>{ GK.pulse(fb(root.querySelector(`.am-opt[data-k="${ans}"]`))); DW.say('Sprich mit: '+shown.map(k=>bySize?(kind[k].s<1?'klein':'groß'):COLS.find(c=>c.c===kind[k].c).n).join(', ')+' … und dann?'); });
}

/* ---------- Ordnen ---------- */
function sort(){
  const n=G.P.sort, col=DW.pick(COLS).c;
  const sizes=[...Array(n)].map((_,i)=>.5+i*(.5/(n-1))), wv=`min(170px,${Math.floor(92/n)}cqw,24cqh)`;
  const order=DW.shuffle(sizes.map((s,i)=>({s,i})));
  frame('Vom kleinsten zum größten!',`<div class="am-pool" id="amPool">${order.map(o=>`<button class="am-s" data-i="${o.i}" type="button" style="--s:${o.s};width:${wv}" aria-label="Ammonit">${amSVG(col)}</button>`).join('')}</div>
    <div class="am-shelf" id="amShelf">${sizes.map((s,i)=>`<div class="am-slot" style="--s:${s};width:${wv}"></div>`).join('')}<div class="am-grow">${ART.icon('pfeil_r')}</div></div>`);
  G.next=0;
  DW.$$('.am-s',root).forEach(b=>b.onclick=()=>{ if(G.busy||b.classList.contains('used')) return; const i=+b.dataset.i;
    if(i===G.next){ const slot=DW.$$('.am-slot',root)[G.next]; slot.innerHTML=amSVG(col); slot.classList.add('full'); b.classList.add('used'); DW.sfx('pop'); G.next++;
      if(G.next>=n) success(); else DW.say(DW.pick(['Gut!','Und jetzt?','Weiter so!'])); }
    else { G.miss++; GK.no(fb(b)); DW.say('Hm, gibt es einen, der noch kleiner ist?'); } });
  setLine('Tippe die Ammoniten der Reihe nach an: zuerst den kleinsten, zum Schluss den größten!');
  GK.idle.set(()=>GK.pulse(fb(root.querySelector(`.am-s[data-i="${G.next}"]`))),()=>{ GK.pulse(fb(root.querySelector(`.am-s[data-i="${G.next}"]`))); DW.say('Welcher ist jetzt der kleinste?'); });
}
function finish(){
  const stars=G.miss<=1?3:G.miss<=4?2:1;
  DW.discover('ammonit',true);
  GK.finish(root,{id:ID,stars,art:`<div class="sd-iart">${amSVG('#8fbf7a')}${amSVG('#f0c35a')}${amSVG('#e2a36b')}</div>`,
    say:'Toll gezählt und sortiert! Du bist ein Ammoniten-Profi.',again:()=>start()});
}
if(window.DW_DEBUG) window.__amInfo=()=>G&&{i:G.i,n:G.P.rounds.length,kind:G.P.rounds[G.i]||null,ans:G.ans,next:G.next,busy:!!G.busy,miss:G.miss,tapped:G.tapped};
if(window.DW_DEBUG) window.__amSolve=()=>{ if(!G||G.i>=G.P.rounds.length) return 'none'; const nb=root.querySelector('.am-fact .btn'); if(nb){ nb.click(); return 'next'; }
  const k=G.P.rounds[G.i];
  if(k==='count'){ root.querySelector(`.am-num[data-v="${G.ans}"]`).click(); return 'count'; }
  if(k==='pattern'){ root.querySelector(`.am-opt[data-k="${G.ans}"]`).click(); return 'pattern'; }
  root.querySelector(`.am-s[data-i="${G.next}"]`).click(); return 'sort'; };
if(window.DW_DEBUG) window.__amWrong=()=>{ const k=G.P.rounds[G.i]; if(k==='count'){ const b=DW.$$('.am-num',root).find(b=>+b.dataset.v!==G.ans); b&&b.click(); } else if(k==='pattern'){ const b=DW.$$('.am-opt',root).find(b=>b.dataset.k!==G.ans); b&&b.click(); } else { const b=DW.$$('.am-s',root).find(b=>+b.dataset.i!==G.next&&!b.classList.contains('used')); b&&b.click(); } };
DW.stations[ID]={title:'Ammoniten-Riff',mount,unmount(){ G=null; WASH=null; clearTimeout(rzT); }};
})();
