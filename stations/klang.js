/* =====================================================================
   DINO-INSELWELT · Station Klanghöhle (GAME 16 – Dino-Sounds)
   Rätsel „Wer war das?“: Laut hören, Tier wählen. Dino-Orchester zum
   freien Spielen mit Klangsteinen und Kristallen. Ehrlich erklärt:
   Niemand weiß genau, wie Dinos klangen – Forscher vergleichen mit
   Vögeln und Krokodilen. Laute: 3 Dateien + WebAudio-Synthese.
   ===================================================================== */
(function(){
"use strict";
const ID='klang';
/* ---------- Klangdaten ----------
   fam: Klangfamilie (nie zwei gleiche in einer Runde) · big: groß/klein
   lab: forscher = Forscher-Idee, heute = so klingt es heute, fantasie = Film-Fantasie */
const LABELS={forscher:{n:'Forscher-Idee',c:'#8fbf7a',say:'Das ist eine Idee von Forschern.'},heute:{n:'So klingt es heute',c:'#8fbccb',say:'So klingt es heute wirklich.'},fantasie:{n:'Fantasie-Laut',c:'#e9a0b0',say:'Das ist ein Fantasie-Laut, wie im Film.'}};
const SOUNDS=[
 {id:'trex',an:'trex',n:'Tyrannosaurus',file:'roar',from:9.3,to:12,fam:'roar',big:1,lab:'fantasie',col:'#c8553d',
  say:'So brüllen Dinos im Film. Echte Forscher glauben: Vielleicht hat der T-Rex eher tief gebrummt, mit geschlossenem Maul – wie ein Krokodil.',hint:'Das war ein lautes, riesiges Brüllen!'},
 {id:'carno',an:'carnotaurus',n:'Carnotaurus',file:'carnotaurus',from:15.6,to:17.4,fam:'roar',big:1,lab:'fantasie',col:'#b8584a',
  say:'Ein Fantasie-Brüllen für den Carnotaurus, den Stier-Dino mit den Hörnern. Wie er wirklich klang, weiß niemand.',hint:'Das war ein wildes Brüllen!'},
 {id:'spino',an:'spinosaurus',n:'Spinosaurus',file:'dinosound',from:0,to:3.9,fam:'roar',big:1,lab:'fantasie',col:'#d9763f',
  say:'Ein Fantasie-Knurren für den Spinosaurus. Seine echte Stimme kennt niemand.',hint:'Das war ein tiefes Knurren.'},
 {id:'para',an:'parasaurolophus',n:'Parasaurolophus',syn:'para',fam:'horn',big:1,lab:'forscher',col:'#6fae9a',
  say:'Parasaurolophus hatte einen hohlen Knochenkamm. Forscher haben ihn im Computer nachgebaut. Heraus kam ein tiefes Tuten – wie eine Tuba!',hint:'Das klang wie eine tiefe Tuba. Wer hat einen langen, hohlen Kamm auf dem Kopf?'},
 {id:'brachio',an:'brachiosaurus',n:'Brachiosaurus',syn:'boom',fam:'boom',big:1,lab:'forscher',col:'#8aa3b8',
  say:'Vielleicht brummten große Dinos ganz tief mit geschlossenem Maul. So machen es heute Krokodile und manche Vögel.',hint:'Ein ganz tiefes Wummern. Das war jemand sehr Großes.'},
 {id:'trike',an:'triceratops',n:'Triceratops',syn:'coo',fam:'coo',big:1,lab:'forscher',col:'#c79a6a',
  say:'Vielleicht gurrte der Triceratops tief – wie ein Emu oder eine Taube, nur viel größer. Sicher weiß das niemand.',hint:'Das klang wie ein tiefes Gurren: huu, huu.'},
 {id:'micro',an:'microraptor',n:'Microraptor',syn:'chirp',fam:'chirp',big:0,lab:'forscher',col:'#5f7fa8',
  say:'Kleine gefiederte Dinos piepten vielleicht wie Vögel. Vögel sind ja die Nachfahren der Dinosaurier!',hint:'Das piepte hoch und klein – wie ein Vogel.'},
 {id:'huhn',an:'huhn',n:'Huhn',syn:'cluck',fam:'cluck',big:0,lab:'heute',col:'#e0b44c',
  say:'Ein Huhn! Vögel stammen von Dinosauriern ab. Man kann sagen: Hühner sind kleine, lebende Dinos!',hint:'Tok, tok, tok! Das kennst du vom Bauernhof.'},
 {id:'mammut',an:'mammut',n:'Mammut',syn:'trumpet',fam:'trumpet',big:1,lab:'forscher',col:'#a8724a',
  say:'Mammuts waren Verwandte der Elefanten. Sie trompeteten bestimmt ganz ähnlich – durch ihren langen Rüssel.',hint:'Törööö! Wer hat einen Rüssel?'},
 // weitere Tiere mit ähnlichen Forscher-Ideen (im Rätsel nie zusammen mit ihrem „Klang-Zwilling“, nicht im Orchester)
 {id:'cory',an:'corythosaurus',n:'Corythosaurus',syn:'para',fam:'horn',big:1,lab:'forscher',col:'#7fae8a',alt:1,
  say:'Auch der Corythosaurus hatte einen hohlen Kopfkamm. Vielleicht tutete er so ähnlich – wie eine tiefe Tuba.',hint:'Das klang wie eine tiefe Tuba. Wer hat einen hohlen Kamm auf dem Kopf?'},
 {id:'diplo',an:'diplodocus',n:'Diplodocus',syn:'boom',fam:'boom',big:1,lab:'forscher',col:'#9aa6a0',alt:1,
  say:'Vielleicht brummten große Dinos ganz tief mit geschlossenem Maul. So machen es heute Krokodile und manche Vögel.',hint:'Ein ganz tiefes Wummern. Das war jemand sehr Großes.'},
 {id:'archae',an:'archaeopteryx',n:'Archaeopteryx',syn:'chirp',fam:'chirp',big:0,lab:'forscher',col:'#6f8fb0',alt:1,
  say:'Kleine gefiederte Dinos piepten vielleicht wie Vögel. Vögel sind ja die Nachfahren der Dinosaurier!',hint:'Das piepte hoch und klein – wie ein Vogel.'},
 {id:'croc',an:'deinosuchus',n:'Riesenkrokodil',syn:'croc',fam:'croc',big:1,lab:'heute',col:'#6f8a4f',
  say:'Krokodile brüllen heute so tief und rau. Sie sind nahe Verwandte der Dinosaurier – deshalb hören Forscher genau hin.',hint:'Ein raues, blubberndes Brummen – aus dem Wasser.'},
];
const ROUNDS=5, CRYSTALS=[{f:523.25,c:'#f0a0c0'},{f:587.33,c:'#f0c35a'},{f:659.25,c:'#9fd18a'},{f:783.99,c:'#8fd0e0'},{f:880,c:'#b8a0e8'},{f:1046.5,c:'#f7f0e1'}];
const INK='#3d3226';
ART.ICONS.kl_frage=`<circle cx="32" cy="32" r="24" fill="#f0c35a" stroke="${INK}" stroke-width="1.5" stroke-opacity=".75"/><path d="M24 25q0-9 9-9t9 8q0 6-7 8-3 1-3 6" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="46" r="3" fill="${INK}"/>`;

let gameId=0, root, ui, lv=1, ctx=null, master=null, analyser=null, buses=[], clips={}, playingUntil=0, fakeUntil=0, waveLoop=null, ambT=null, lastOrch=null;
const snd=()=>!!DW.state.settings.sound;
const byId=id=>SOUNDS.find(s=>s.id===id);
const ART_DE={huhn:'das',mammut:'das',croc:'das'};   // „das Huhn“, nicht „der Huhn“
const derN=s=>(ART_DE[s.id]||'der')+' '+s.n;

/* ---------- Audio ---------- */
function ac(){ if(!ctx){ try{ ctx=new (window.AudioContext||window.webkitAudioContext)(); master=ctx.createGain(); master.gain.value=.9;
  const comp=ctx.createDynamicsCompressor(); analyser=ctx.createAnalyser(); analyser.fftSize=1024; master.connect(comp); comp.connect(analyser); analyser.connect(ctx.destination); }catch(e){ ctx=null; } }
  if(ctx&&ctx.state==='suspended') ctx.resume().catch(()=>{}); return ctx; }
function bus(){ const g=ctx.createGain(); g.connect(master); buses.push(g); return g; }
function stopAll(){ const t=ctx?ctx.currentTime:0; buses.forEach(g=>{ try{ g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(0,t,.03); setTimeout(()=>{try{g.disconnect();}catch(e){}},300); }catch(e){} }); buses=[];
  Object.values(clips).forEach(a=>{ try{ a.pause(); }catch(e){} }); playingUntil=fakeUntil=0; playNo++; }
function osc(type,f,t0,t1,out){ const o=ctx.createOscillator(); o.type=type; o.frequency.setValueAtTime(f,t0); o.connect(out); o.start(t0); o.stop(t1+.05); return o; }
function env(g,t,a,h,r,v){ g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+a); g.gain.setValueAtTime(v,t+a+h); g.gain.exponentialRampToValueAtTime(.0008,t+a+h+r); }
function noiseSrc(t0,dur){ const b=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*dur),ctx.sampleRate), d=b.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  const s=ctx.createBufferSource(); s.buffer=b; s.start(t0); return s; }
function filt(type,f,q){ const x=ctx.createBiquadFilter(); x.type=type; x.frequency.value=f; x.Q.value=q||1; return x; }
const SYN={
  para(t,out){ // tiefes Tuten durch den hohlen Kamm
    const g=ctx.createGain(); env(g,t,.35,1.5,.5,.55); const lp=filt('lowpass',650,7); lp.connect(g); g.connect(out);
    const o=osc('sawtooth',80,t,t+2.4,lp); o.frequency.linearRampToValueAtTime(95,t+.5); o.frequency.linearRampToValueAtTime(88,t+1.5); o.frequency.linearRampToValueAtTime(70,t+2.3);
    const o2=osc('sine',160,t,t+2.4,lp); o2.frequency.linearRampToValueAtTime(190,t+.5); o2.frequency.linearRampToValueAtTime(140,t+2.3);
    const l=ctx.createOscillator(), lg=ctx.createGain(); l.frequency.value=5; lg.gain.value=2.5; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t+2.4); return 2.4; },
  boom(t,out){ // Brummen mit geschlossenem Maul
    [0,.8,1.6].forEach((d,k)=>{ const g=ctx.createGain(); env(g,t+d,.12,.3,.35,.7-k*.08); g.connect(out); const lp=filt('lowpass',420,2); lp.connect(g);
      [[66,1],[132,.5],[198,.22]].forEach(([f,v])=>{ const vg=ctx.createGain(); vg.gain.value=v; vg.connect(lp); const o=osc(f===66?'sine':'triangle',f,t+d,t+d+.8,vg); o.frequency.exponentialRampToValueAtTime(f*.86,t+d+.75); }); });
    return 2.5; },
  coo(t,out){ // tiefes Gurren
    [[0,.45,185,160],[.6,.45,185,160],[1.2,.9,190,140]].forEach(([d,len,f1,f2])=>{ const g=ctx.createGain(); env(g,t+d,.08,len-.2,.18,.5); g.connect(out); const lp=filt('lowpass',600,3); lp.connect(g);
      const o=osc('sine',f1,t+d,t+d+len,lp); o.frequency.exponentialRampToValueAtTime(f2,t+d+len); const o2=osc('triangle',f1*2,t+d,t+d+len,lp); o2.frequency.exponentialRampToValueAtTime(f2*2,t+d+len);
      const l=ctx.createOscillator(), lg=ctx.createGain(); l.frequency.value=14; lg.gain.value=.25; l.connect(lg); lg.connect(g.gain); l.start(t+d); l.stop(t+d+len); });
    return 2.2; },
  chirp(t,out){ // Piepen & Tirilieren
    for(let k=0;k<8;k++){ const d=k*.13+(k>4?.25:0); const g=ctx.createGain(); env(g,t+d,.01,.03,.05,.28); g.connect(out);
      const o=osc('sine',2300+k%3*250,t+d,t+d+.1,g); o.frequency.exponentialRampToValueAtTime(3500+k%2*300,t+d+.07); }
    const g=ctx.createGain(); env(g,t+1.35,.03,.4,.15,.2); g.connect(out); const o=osc('sine',3000,t+1.35,t+1.95,g);
    const l=ctx.createOscillator(), lg=ctx.createGain(); l.frequency.value=28; lg.gain.value=400; l.connect(lg); lg.connect(o.frequency); l.start(t+1.35); l.stop(t+1.95); return 2; },
  cluck(t,out){ // Tok-tok-tok, Gaaak!
    [0,.24,.46,.66].forEach(d=>{ const g=ctx.createGain(); env(g,t+d,.008,.03,.06,.5); const bp=filt('bandpass',950,2.5); bp.connect(g); g.connect(out);
      const o=osc('square',430,t+d,t+d+.1,bp); o.frequency.exponentialRampToValueAtTime(300,t+d+.09); });
    const g=ctx.createGain(); env(g,t+.95,.04,.3,.15,.45); const bp=filt('bandpass',1300,1.5); bp.connect(g); g.connect(out);
    const o=osc('sawtooth',520,t+.95,t+1.5,bp); o.frequency.linearRampToValueAtTime(820,t+1.1); o.frequency.linearRampToValueAtTime(600,t+1.45); return 1.6; },
  trumpet(t,out){ // Trompeten durch den Rüssel
    const g=ctx.createGain(); env(g,t,.12,1,.35,.42); const bp=filt('bandpass',1250,.9); bp.connect(g); g.connect(out);
    const l=ctx.createOscillator(), lg=ctx.createGain(); l.frequency.value=7; lg.gain.value=18; l.connect(lg); l.start(t); l.stop(t+1.6);
    [0,6].forEach(dt=>{ const o=osc('sawtooth',400+dt,t,t+1.5,bp); o.frequency.exponentialRampToValueAtTime(760+dt,t+.25); o.frequency.linearRampToValueAtTime(700,t+1.1); o.frequency.exponentialRampToValueAtTime(520,t+1.45); lg.connect(o.frequency); });
    const n=noiseSrc(t,1.5), ng=ctx.createGain(); env(ng,t,.1,.9,.3,.12); n.connect(filt('bandpass',2400,1)).connect(ng); ng.connect(out); return 1.6; },
  croc(t,out){ // raues Krokodil-Brüllen
    const g=ctx.createGain(); env(g,t,.2,1.3,.4,.8); const lp=filt('lowpass',380,3); lp.connect(g); g.connect(out);
    const am=ctx.createGain(); am.gain.value=.5; am.connect(lp); const l=ctx.createOscillator(), lg=ctx.createGain(); l.type='square'; l.frequency.value=21; lg.gain.value=.45; l.connect(lg); lg.connect(am.gain); l.start(t); l.stop(t+2);
    osc('sawtooth',48,t,t+1.95,am); osc('sawtooth',97,t,t+1.95,am).detune.value=12;
    const n=noiseSrc(t,1.9), ng=ctx.createGain(); env(ng,t,.2,1.2,.4,.25); n.connect(filt('lowpass',260,1)).connect(ng); ng.connect(out); return 2; },
};
/* Eigene Aufnahme der Nutzerin: sounds-neu/toene/klang_<id>.mp3 (Eintrag "toene/klang_<id>" in js/asset-map.js, siehe js/assets.js).
   Gibt es sie, wird die GANZE Datei gespielt (kein Ausschnitt, keine Synthese). Lässt sie sich nicht laden → Original. */
let playNo=0;
function ownClip(s){ try{ return (window.ASSETS&&ASSETS.sound&&ASSETS.sound('toene/klang_'+s.id))||null; }catch(e){ return null; } }
function playOwn(s,u){ const key='own:'+s.id, no=playNo; let a=clips[key];
  if(!a||a.__u!==u){ a=clips[key]=new Audio(u); a.__u=u; a.preload='auto';
    a.addEventListener('error',()=>{ try{ ASSETS.audioFail&&ASSETS.audioFail(u); }catch(e){} if(clips[key]===a) delete clips[key]; if(a.__no===playNo) play(s); });
    /* Länge erst nach dem Laden bekannt → Wellenbild so lange zeigen, wie die Datei wirklich läuft */
    a.addEventListener('loadedmetadata',()=>{ if(a.__no===playNo&&!a.paused&&isFinite(a.duration)) fakeUntil=performance.now()+Math.max(0,a.duration-a.currentTime)*1000; });
    a.addEventListener('ended',()=>{ if(a.__no===playNo) fakeUntil=0; }); }
  a.__no=no;
  try{ a.currentTime=0; }catch(e){}
  try{ a.volume=.9; const p=a.play(); if(p&&p.catch) p.catch(()=>{}); }catch(e){}
  const dur=isFinite(a.duration)&&a.duration>0?a.duration:(s.file?s.to-s.from:2.4); fakeUntil=performance.now()+dur*1000; return Math.min(dur,8); }
function play(s){
  if(!snd()) return 0; stopAll(); playNo++;
  const u=ownClip(s); if(u) return playOwn(s,u);
  if(s.file){ let a=clips[s.id]; if(!a){ a=clips[s.id]=new Audio(`assets/sounds/${s.file}.mp3`); a.preload='auto';
      // Ausschnitt sicher beenden, auch wenn die Datei verspätet startet
      a.addEventListener('timeupdate',()=>{ if(a.__to&&a.currentTime>=a.__to) a.pause(); }); }
    try{ a.__to=s.to; a.currentTime=s.from; a.volume=.9; const p=a.play(); if(p&&p.catch) p.catch(()=>{}); }catch(e){}
    const dur=s.to-s.from; fakeUntil=performance.now()+dur*1000;
    GK.after(dur*1000,()=>{ try{ if(a.currentTime>=s.to-.25||a.currentTime<s.from) a.pause(); }catch(e){} }); return dur; }
  if(!ac()) return 0; const b=bus(); const d=SYN[s.syn](ctx.currentTime+.03,b); playingUntil=performance.now()+d*1000; return d;
}
function crystal(k){ if(!snd()||!ac()) return; const c=CRYSTALS[k], t=ctx.currentTime+.01, b=bus();
  const dl=ctx.createDelay(); dl.delayTime.value=.26; const fb=ctx.createGain(); fb.gain.value=.35; dl.connect(fb); fb.connect(dl); dl.connect(b);
  const g=ctx.createGain(); env(g,t,.005,.02,1.4,.35); g.connect(b); g.connect(dl); osc('sine',c.f,t,t+1.6,g); const g2=ctx.createGain(); g2.gain.value=.25; g2.connect(g); osc('triangle',c.f*2.01,t,t+.5,g2);
  playingUntil=Math.max(playingUntil,performance.now()+900); }
function drip(){ if(!snd()||!ac()) return; const t=ctx.currentTime, g=ctx.createGain(); env(g,t,.005,.01,.12,.08); g.connect(master); const o=osc('sine',DW.rand(900,1500),t,t+.18,g); o.frequency.exponentialRampToValueAtTime(500,t+.12); }
function waitSound(d){ return new Promise(r=>GK.after(d*1000+250,r)); }

/* ---------- Höhle & Wellenform ---------- */
function cave(){
  const drops=[...Array(9)].map((_,i)=>`<path d="M${i*12+2} 0q2 ${14+(i*7)%18} 4 ${22+(i*11)%26}q2-${10+(i*5)%10} 5-${22+(i*11)%26}z" fill="#2c3550"/>`).join('');
  const flies=[...Array(14)].map((_,i)=>`<i style="left:${(i*37)%97}%;top:${(i*53)%88}%;animation-delay:${(i*0.37)%3}s"></i>`).join('');
  root.innerHTML=`<div class="kl fill"><svg class="kl-stal" viewBox="0 0 108 50" preserveAspectRatio="none">${drops}</svg>
    <div class="kl-cr l"></div><div class="kl-cr r"></div><div class="kl-flies">${flies}</div><div class="kl-ui fill" id="klUi"></div></div>`;
  ui=root.querySelector('#klUi');
}
function startWave(cv){
  if(waveLoop) waveLoop(); const x=cv.getContext('2d'); const buf=new Uint8Array(1024); let ph=0;
  waveLoop=GK.loop((dt,T)=>{ if(!cv.isConnected) return false; const W=cv.width=cv.clientWidth*devicePixelRatio, H=cv.height=cv.clientHeight*devicePixelRatio; x.clearRect(0,0,W,H);
    const now=performance.now(), synth=now<playingUntil, fake=now<fakeUntil; ph+=dt*6;
    x.lineWidth=4*devicePixelRatio; x.lineCap='round'; x.strokeStyle='rgba(160,240,230,.9)'; x.shadowColor='#8ff0e0'; x.shadowBlur=14*devicePixelRatio; x.beginPath();
    if(synth&&analyser){ analyser.getByteTimeDomainData(buf); for(let i=0;i<W;i+=3){ const v=(buf[Math.floor(i/W*buf.length)]-128)/128; const y=H/2+v*H*.45; i?x.lineTo(i,y):x.moveTo(i,y); } }
    else { const a=fake?(.35+.25*Math.sin(T*9)*Math.sin(T*3.1)):.03; for(let i=0;i<W;i+=3){ const u=i/W; const y=H/2+Math.sin(u*28+ph*2)*a*H*.35*Math.sin(u*Math.PI)+(fake?Math.sin(u*71+ph*5)*a*H*.12:0); i?x.lineTo(i,y):x.moveTo(i,y); } }
    x.stroke(); });
}
function soundOffNote(){ return snd()?'':`<div class="kl-off card"><span>${ART.icon('stumm',44)}</span><p>Der Ton ist aus. Hier geht es ums Hören!</p><button class="btn go" id="klOn" type="button">${ART.icon('lautsprecher',32)}Ton an</button></div>`; }
function bindOff(after){ const b=ui.querySelector('#klOn'); if(b) b.onclick=()=>{ DW.state.settings.sound=true; DW.save(); DW.sfx('pop'); after(); }; }

/* ---------- Menü ---------- */
function mount(r){ root=r; cave(); menu(); }
function menu(){
  gameId++; stopAll(); clearInterval(ambT); GK.idle.stop();
  ui.innerHTML=`<div class="kl-menu"><h2 class="hand kl-title">Die Klanghöhle</h2>${soundOffNote()}
    <div class="kl-mstones">
      <button class="kl-mst" id="klQuiz" style="--c:#6fc3b5" type="button"><span class="kl-mic">${ART.icon('ohr')}${ART.icon('kl_frage')}</span><b class="hand">Wer war das?</b></button>
      <button class="kl-mst" id="klOrch" style="--c:#b58cbd" type="button"><span class="kl-mic">${ART.icon('musik')}</span><b class="hand">Dino-Orchester</b></button>
      <button class="kl-mst small" id="klWhy" style="--c:#f0c35a" type="button"><span class="kl-mic">${ART.icon('lupe')}</span><b class="hand">Wie klangen Dinos?</b></button>
    </div></div>`;
  bindOff(menu);
  ui.querySelector('#klQuiz').onclick=()=>{ DW.sfx('pop'); GK.intro(ui,{id:ID,title:'Wer war das?',art:GK.icon('ohr')+GK.img('parasaurolophus',{mood:'happy'}),
    say:'Hör genau hin! Ein Tier macht ein Geräusch. Tippe auf das Tier, das so klingen könnte.',onStart:l=>{lv=l;game();}}); };
  ui.querySelector('#klOrch').onclick=()=>{ DW.sfx('pop'); orchestra(); };
  ui.querySelector('#klWhy').onclick=()=>{ DW.sfx('pop'); why(); };
  DW.say('Willkommen in der Klanghöhle! Niemand hat je einen Dinosaurier gehört. Forscher vergleichen sie mit Vögeln und Krokodilen und überlegen, wie sie geklungen haben könnten. Was möchtest du machen?');
  GK.idle.set(()=>GK.pulse(ui.querySelector('#klQuiz')),()=>DW.say('Tippe auf einen leuchtenden Stein!'));
}
function why(){
  const m=DW.modal(`<h2>Wie klangen Dinos?</h2>
    <div class="kl-why"><button class="kl-wa" data-s="huhn" type="button">${GK.img('huhn')}<b>Vögel</b></button><span class="kl-plus">+</span>
      <button class="kl-wa" data-s="croc" type="button">${GK.img('deinosuchus')}<b>Krokodile</b></button><span class="kl-plus">→</span>
      <div class="kl-wa">${GK.img('trex')}<b>Dinos?</b></div></div>
    <p>Stimmen versteinern nicht. Darum weiß <b>niemand</b> genau, wie Dinosaurier klangen.</p>
    <p>Vögel stammen von Dinos ab, Krokodile sind ihre nahen Verwandten. Beide können mit geschlossenem Maul brummen oder gurren. Vielleicht konnten das viele Dinos auch.</p>
    <p>Beim <b>Parasaurolophus</b> haben Forscher den hohlen Kopfkamm nachgebaut – er tutete tief wie eine Tuba.</p>
    <p class="kl-labs">${Object.values(LABELS).map(l=>`<span class="pill" style="background:${l.c}">${l.n}</span>`).join(' ')}</p>`);
  DW.$$('.kl-wa[data-s]',m).forEach(b=>b.onclick=()=>{ play(byId(b.dataset.s)); b.classList.remove('gk-good'); void b.offsetWidth; b.classList.add('gk-good'); });
  DW.say('Stimmen versteinern nicht. Darum weiß niemand genau, wie Dinosaurier klangen. Vögel stammen von Dinos ab, und Krokodile sind ihre nahen Verwandten. Beide brummen oder gurren mit geschlossenem Maul. Vielleicht konnten das viele Dinos auch. Tippe auf das Huhn oder das Krokodil!');
}

/* ---------- Rätsel „Wer war das?“ ---------- */
function game(){
  stopAll(); let round=0, miss=0, busy=false; const used=[];
  const targets=[]; DW.shuffle(SOUNDS).forEach(s=>{ const src=s.file||s.syn; if(targets.length<ROUNDS&&!targets.some(t=>(t.file||t.syn)===src)) targets.push(s); });
  const gid=++gameId;
  clearInterval(ambT); if(lv===3) ambT=GK.every(1400,()=>{ if(Math.random()<.6) drip(); });
  function pickCands(t){ const n=lv===1?2:lv===2?3:4; const out=[t];
    DW.shuffle(SOUNDS).forEach(s=>{ if(out.length>=n||out.some(o=>o.fam===s.fam)) return; if(lv===1&&out.length===1&&s.big===t.big) return; out.push(s); });
    DW.shuffle(SOUNDS).forEach(s=>{ if(out.length<n&&!out.some(o=>o.fam===s.fam)) out.push(s); });
    return DW.shuffle(out); }
  function next(){
    if(round>=targets.length) return end();
    const t=targets[round], cands=pickCands(t); busy=true;
    ui.innerHTML=`<div class="kl-game" data-t="${t.id}"><div class="kl-bar"><button class="ibtn kl-back" id="klBack" type="button" aria-label="Zurück">${ART.icon('pfeil_l')}</button>${GK.progress(round,targets.length)}</div>
      ${soundOffNote()}
      <div class="kl-listen"><canvas class="kl-wave"></canvas><button class="kl-stone" id="klPlay" type="button" aria-label="Noch einmal hören">${ART.icon('lautsprecher')}<small class="hand">Noch einmal</small></button></div>
      <div class="kl-cands n${cands.length}">${cands.map(s=>`<button class="kl-cand" data-id="${s.id}" style="--c:${s.col}" type="button">${GK.img(s.an,{mood:'happy'})}<b class="hand">${s.n}</b><span class="kl-lab"></span></button>`).join('')}</div></div>`;
    bindOff(next);
    ui.querySelector('#klBack').onclick=()=>{ DW.sfx('tap'); gameId++; menu(); };
    startWave(ui.querySelector('.kl-wave'));
    const stone=ui.querySelector('#klPlay');
    const listen=()=>{ stone.classList.add('on'); const d=play(t); GK.after(Math.max(600,d*1000),()=>stone.classList.remove('on')); return d; };
    stone.onclick=()=>{ DW.hush(); listen(); };
    DW.say(round===0?'Hör genau hin! Wer könnte das sein?':DW.pick(['Und jetzt? Hör mal!','Pssst! Wer ist das?','Was hörst du jetzt?'])).then(()=>{ if(!ui||gid!==gameId||!ui.contains(stone)) return; busy=false; const d=listen(); GK.after(d*1000+400,()=>{ if(ui&&ui.contains(stone)&&round<targets.length&&targets[round]===t) GK.idle.poke(); }); });
    GK.idle.set(()=>GK.pulse(stone),()=>DW.say('Tippe auf den leuchtenden Stein und hör noch einmal. Dann tippe auf das Tier!'));
    DW.$$('.kl-cand',ui).forEach(b=>b.onclick=()=>{ const s=byId(b.dataset.id);
      if(s===t){ DW.$$('.kl-cand',ui).forEach(x=>x.onclick=null); GK.idle.stop(); stopAll(); GK.ok(b); b.classList.add('win'); const L=LABELS[s.lab];
        const lab=b.querySelector('.kl-lab'); lab.textContent=L.n; lab.style.background=L.c; DW.confetti(20);
        round++; const txt=`Ja! ${s.n}. ${s.say}`; let went=false; const go=()=>{ if(went||gid!==gameId||!ui||!ui.contains(b)) return; went=true; next(); };
        DW.say(txt).then(()=>GK.after(700,go)); GK.after(2000+txt.length*85,go); }
      else { miss++; stopAll(); b.classList.add('nope'); GK.after(600,()=>b.classList.remove('nope')); GK.no(null);
        DW.say(`Hm, ${derN(s)} war es nicht. ${t.hint} Hör noch einmal!`).then(()=>{ if(ui&&gid===gameId&&ui.contains(stone)&&targets[round]===t) listen(); }); }
    });
  }
  function end(){ clearInterval(ambT); stopAll();
    GK.finish(ui,{id:ID,stars:miss===0?3:miss<=3?2:1,title:'Audio-Detektiv!',art:GK.icon('ohr')+GK.img('parasaurolophus',{mood:'happy'}),
      extra:`<p class="pill">${ART.icon('ohr',30).replace('<svg','<svg style="display:inline;vertical-align:middle;width:30px"')} Abzeichen: Audio-Detektiv</p>`,
      say:'Super zugehört! Du bist ein Audio-Detektiv. Denk daran: Wie Dinos wirklich klangen, weiß niemand genau.',again:()=>game()}); }
  next();
}

/* ---------- Dino-Orchester ---------- */
function orchestra(){
  stopAll(); clearInterval(ambT); GK.idle.stop();
  ui.innerHTML=`<div class="kl-orch"><div class="kl-bar"><button class="ibtn kl-back" id="klBack" type="button" aria-label="Zurück">${ART.icon('pfeil_l')}</button><h2 class="hand">Dino-Orchester</h2>
      <button class="ibtn" id="klInfo" type="button" aria-label="Was wissen Forscher?">${ART.icon('kl_frage')}</button></div>
    ${soundOffNote()}
    <canvas class="kl-wave small"></canvas>
    <div class="kl-ogrid">${SOUNDS.filter(s=>!s.alt).map(s=>`<button class="kl-os" data-id="${s.id}" style="--c:${s.col}" type="button">${GK.img(s.an,{mood:'happy'})}<b class="hand">${s.n}</b><i style="background:${LABELS[s.lab].c}"></i></button>`).join('')}</div>
    <div class="kl-cap hand" id="klCap">Tippe auf die Steine!</div>
    <div class="kl-crys">${CRYSTALS.map((c,k)=>`<button class="kl-crystal" data-k="${k}" style="--c:${c.c};--h:${54+k*8}px" type="button" aria-label="Kristall ${k+1}"></button>`).join('')}</div></div>`;
  bindOff(orchestra);
  startWave(ui.querySelector('.kl-wave'));
  ui.querySelector('#klBack').onclick=()=>{ DW.sfx('tap'); menu(); };
  ui.querySelector('#klInfo').onclick=()=>{ const s=lastOrch; if(s) DW.say(`${s.n}. ${LABELS[s.lab].say} ${s.say}`); else DW.say('Tippe erst auf einen Klangstein. Dann erzähle ich dir, was Forscher darüber wissen.'); };
  DW.$$('.kl-os',ui).forEach(b=>b.onclick=()=>{ const s=byId(b.dataset.id); DW.hush(); lastOrch=s; const d=play(s);
    DW.$$('.kl-os',ui).forEach(x=>x.classList.remove('on')); b.classList.add('on'); GK.after(Math.max(700,d*1000),()=>b.classList.remove('on'));
    const L=LABELS[s.lab]; ui.querySelector('#klCap').innerHTML=`${s.n} <span class="pill" style="background:${L.c}">${L.n}</span>`; GK.pulse(ui.querySelector('#klInfo')); });
  DW.$$('.kl-crystal',ui).forEach(b=>{ const hit=e=>{ e.preventDefault(); crystal(+b.dataset.k); b.classList.remove('ring'); void b.offsetWidth; b.classList.add('ring'); }; b.addEventListener('pointerdown',hit); });
  DW.say('Das Dino-Orchester! Tippe auf die Klangsteine und die Kristalle. Mit dem Fragezeichen erfährst du, was Forscher wissen.');
  GK.idle.set(()=>GK.pulse(ui.querySelector('.kl-os')),()=>DW.say('Tippe auf einen Stein!'));
}

function unmount(){ stopAll(); clearInterval(ambT); if(waveLoop) waveLoop(); waveLoop=null; Object.values(clips).forEach(a=>{ try{ a.pause(); a.removeAttribute('src'); a.load(); }catch(e){} }); clips={};
  if(ctx){ try{ ctx.close(); }catch(e){} } ctx=null; master=null; analyser=null; root=ui=null; }
DW.stations[ID]={title:'Klanghöhle',mount,unmount};
})();
