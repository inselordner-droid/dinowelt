/* =====================================================================
   DINO-INSELWELT · GAME 08 „Modell-Werkstatt“
   Ein Dino-Modell aus Teilen bauen, auf der Drehscheibe drehen, anmalen.
   Eigenes kleines Pseudo-3D: Ellipsoide, Kegel und flache Platten werden
   projiziert (Maler-Algorithmus), mit weicher Aquarell-Schattierung und
   Tuschekontur gezeichnet. Keine fremden 3D-Dateien.
   Leicht:  Vorlage nachbauen (je 2 Teile zur Wahl, farbiger Bauplan), dann anmalen.
   Mittel:  Vorlage nachbauen (alle Teile, Bauplan nur als Schatten), dann frei ändern.
   Schwer:  Freies Bauen mit allen Teilen, Mustern und Vorlagen.
   Bis zu 6 Modelle kommen ins Regal (GK.st('werkstatt').models).
   ===================================================================== */
(function(){
"use strict";
const ID='werkstatt';

/* ---------------- Spieldaten ---------------- */
const WS_PARTS={
  body:[{k:'zwei',say:'Zwei Beine'},{k:'vier',say:'Vier Beine'},{k:'langhals',say:'Langer Hals'}],
  head:[{k:'rex',say:'Großes Maul'},{k:'kroko',say:'Lange Schnauze'},{k:'schnabel',say:'Schnabel'},{k:'ente',say:'Entenschnabel mit Röhre'},{k:'horn',say:'Hörner und Nackenschild'},{k:'rund',say:'Kleiner runder Kopf'}],
  tail:[{k:'lang',say:'Langer Schwanz'},{k:'keule',say:'Schwanzkeule'},{k:'stacheln',say:'Schwanzstacheln'}],
  back:[{k:'keine',say:'Glatter Rücken'},{k:'platten',say:'Rückenplatten'},{k:'segel',say:'Rückensegel'},{k:'federn',say:'Federn'},{k:'knubbel',say:'Panzer-Knubbel'}],
};
const WS_CATS=[{k:'body',n:'Körper'},{k:'head',n:'Kopf'},{k:'tail',n:'Schwanz'},{k:'back',n:'Rücken'},{k:'paint',n:'Farbe'}];
const WS_POTS=['#7fa66a','#4f7a45','#c8553d','#e8914f','#f0c35a','#8fbccb','#3b6f8a','#b58cbd','#9a7b55','#8b9aa3','#e7a1b0','#5c4a3a'];
const WS_PATS=[{k:'keins',say:'Ohne Muster'},{k:'streifen',say:'Streifen'},{k:'punkte',say:'Punkte'}];
const CLAY={main:'#cdb98f',acc:'#b9a178',pat:'keins',pc:'#a88f64'};
const WS_TPL={
  trex:{n:'Tyrannosaurus',der:'der Tyrannosaurus',animal:'trex',cfg:{head:'rex',body:'zwei',tail:'lang',back:'keine',main:'#7d8f55',acc:'#c8553d',pat:'streifen',pc:'#55623a'},
    fact:'Der Tyrannosaurus lief auf zwei starken Beinen. Seine Arme waren winzig, aber sein Biss war riesig stark.',
    hint:{body:'Er lief auf zwei Beinen.',head:'Er hatte ein großes Maul voller spitzer Zähne.',tail:'Sein Schwanz war lang und glatt.',back:'Sein Rücken war glatt – ohne Platten und ohne Segel.'}},
  triceratops:{n:'Triceratops',der:'der Triceratops',animal:'triceratops',cfg:{head:'horn',body:'vier',tail:'lang',back:'keine',main:'#9a7b55',acc:'#c8553d',pat:'keins',pc:'#6f5438'},
    fact:'Der Triceratops hatte drei Hörner und einen großen Nackenschild. Er lief auf vier Beinen und fraß Pflanzen.',
    hint:{body:'Er lief auf vier Beinen.',head:'Er hatte drei Hörner und einen Nackenschild.',tail:'Sein Schwanz war ganz einfach, ohne Keule und ohne Stacheln.',back:'Sein Rücken war glatt.'}},
  stegosaurus:{n:'Stegosaurus',der:'der Stegosaurus',animal:'stegosaurus',cfg:{head:'schnabel',body:'vier',tail:'stacheln',back:'platten',main:'#7fa66a',acc:'#e8914f',pat:'punkte',pc:'#4f7a45'},
    fact:'Der Stegosaurus hatte große Platten auf dem Rücken. Mit den Stacheln am Schwanz wehrte er sich gegen Räuber.',
    hint:{body:'Er lief auf vier Beinen.',head:'Er hatte einen kleinen Kopf mit Schnabel.',tail:'Am Schwanz hatte er vier spitze Stacheln.',back:'Auf dem Rücken hatte er große Platten.'}},
  brachiosaurus:{n:'Brachiosaurus',der:'der Brachiosaurus',animal:'brachiosaurus',cfg:{head:'rund',body:'langhals',tail:'lang',back:'keine',main:'#8b9aa3',acc:'#8fbccb',pat:'keins',pc:'#66757e'},
    fact:'Der Brachiosaurus hatte einen sehr langen Hals. Seine Vorderbeine waren länger als die Hinterbeine – so kam er an die höchsten Bäume.',
    hint:{body:'Er hatte einen sehr langen Hals.',head:'Er hatte einen kleinen runden Kopf.',tail:'Sein Schwanz war lang und glatt.',back:'Sein Rücken war glatt.'}},
  ankylosaurus:{n:'Ankylosaurus',der:'der Ankylosaurus',animal:'ankylosaurus',cfg:{head:'schnabel',body:'vier',tail:'keule',back:'knubbel',main:'#a08058',acc:'#6b5a45',pat:'keins',pc:'#7a5f40'},
    fact:'Der Ankylosaurus war gepanzert wie eine Schildkröte. Mit seiner schweren Schwanzkeule konnte er kräftig zuschlagen.',
    hint:{body:'Er lief auf vier kurzen Beinen.',head:'Er hatte einen kleinen Kopf mit Schnabel.',tail:'Am Schwanz hatte er eine dicke Keule.',back:'Sein Rücken war voller harter Panzer-Knubbel.'}},
  spinosaurus:{n:'Spinosaurus',der:'der Spinosaurus',animal:'spinosaurus',cfg:{head:'kroko',body:'zwei',tail:'lang',back:'segel',main:'#6f8a8a',acc:'#d9573d',pat:'keins',pc:'#4c6464'},
    fact:'Der Spinosaurus hatte ein großes Segel auf dem Rücken und eine lange Schnauze wie ein Krokodil. Er fing Fische.',
    hint:{body:'Er lief auf zwei Beinen.',head:'Er hatte eine lange Schnauze wie ein Krokodil.',tail:'Sein Schwanz war lang.',back:'Auf dem Rücken hatte er ein großes Segel.'}},
  velociraptor:{n:'Velociraptor',der:'der Velociraptor',animal:'velociraptor',cfg:{head:'kroko',body:'zwei',tail:'lang',back:'federn',main:'#9a7b55',acc:'#c8553d',pat:'streifen',pc:'#6f5438'},
    fact:'Der Velociraptor war so groß wie ein Truthahn und hatte Federn. Er lief schnell auf zwei Beinen.',
    hint:{body:'Er lief auf zwei Beinen.',head:'Er hatte eine lange, schmale Schnauze mit spitzen Zähnen.',tail:'Sein Schwanz war lang und glatt.',back:'Er hatte Federn – fast wie ein Vogel!'}},
  parasaurolophus:{n:'Parasaurolophus',der:'der Parasaurolophus',animal:'parasaurolophus',cfg:{head:'ente',body:'vier',tail:'lang',back:'keine',main:'#7fa66a',acc:'#c8553d',pat:'streifen',pc:'#4f7a45'},
    fact:'Der Parasaurolophus hatte einen langen, hohlen Kopfkamm. Damit konnte er laut tröten.',
    hint:{body:'Er lief meistens auf vier Beinen.',head:'Er hatte einen Entenschnabel und eine lange Röhre auf dem Kopf.',tail:'Sein Schwanz war lang und glatt.',back:'Sein Rücken war glatt.'}},
  gallimimus:{n:'Gallimimus',der:'der Gallimimus',animal:'gallimimus',cfg:{head:'schnabel',body:'zwei',tail:'lang',back:'federn',main:'#e8914f',acc:'#9a7b55',pat:'keins',pc:'#9a7b55'},
    fact:'Der Gallimimus sah aus wie ein Strauß. Er hatte einen Schnabel ohne Zähne und rannte sehr schnell.',
    hint:{body:'Er lief auf zwei langen Beinen.',head:'Er hatte einen Schnabel – wie ein Vogel.',tail:'Sein Schwanz war lang.',back:'Er hatte wahrscheinlich Federn.'}},
  pachycephalosaurus:{n:'Pachycephalosaurus',der:'der Pachycephalosaurus',animal:'pachycephalosaurus',cfg:{head:'rund',body:'zwei',tail:'lang',back:'keine',main:'#b58cbd',acc:'#e7a1b0',pat:'punkte',pc:'#8b6a90'},
    fact:'Der Pachycephalosaurus hatte einen dicken, runden Knochenkopf. Er lief auf zwei Beinen und fraß Pflanzen.',
    hint:{body:'Er lief auf zwei Beinen.',head:'Er hatte einen runden, dicken Kopf.',tail:'Sein Schwanz war lang.',back:'Sein Rücken war glatt.'}},
};
const WS_NAME={head:{rex:'Rexi',kroko:'Kroko',schnabel:'Schnabi',ente:'Tröti',horn:'Horni',rund:'Langi'},back:{keine:'',platten:'platten',segel:'segel',federn:'feder',knubbel:'knubbel'}};
const INK='#3d3226', HORN='#efe3c4', TOOTH='#fbf6ea', GHOST='#ddd3c1';

ART.ICONS.ws_regal='<path d="M9 14h46M9 35h46M9 56h46" stroke="#8a6a48" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M12 12v46M52 12v46" stroke="#8a6a48" stroke-width="4" stroke-linecap="round"/><ellipse cx="24" cy="28" rx="8" ry="5" fill="#7fa66a"/><circle cx="31" cy="24" r="3.5" fill="#7fa66a"/><ellipse cx="40" cy="49" rx="8" ry="5" fill="#c8553d"/><path d="M34 45l2-6 3 5 2-6 3 6" fill="#f0c35a"/>';

/* ---------------- Vektoren ---------------- */
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]], sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]], mul=(a,k)=>[a[0]*k,a[1]*k,a[2]*k];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2], cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const vlen=a=>Math.hypot(a[0],a[1],a[2]), norm=a=>{const l=vlen(a)||1;return [a[0]/l,a[1]/l,a[2]/l];};
const lerp=(a,b,t)=>a+(b-a)*t;

/* ---------------- Grundformen ---------------- */
function E(c,r,rot=0){ const cs=Math.cos(rot),sn=Math.sin(rot); return {c,ax:[[cs*r[0],sn*r[0],0],[-sn*r[1],cs*r[1],0],[0,0,r[2]]]}; }
function sph(p,r,tg){ let n=cross([0,0,1],tg); if(vlen(n)<1e-4) n=[1,0,0]; n=norm(n); if(n[1]<0) n=mul(n,-1); const b=cross(tg,n); return {c:p,ax:[mul(tg,r),mul(n,r),mul(b,r)]}; }
function cr(p0,p1,p2,p3,t){ const t2=t*t,t3=t2*t; return [0,1,2].map(i=>.5*(2*p1[i]+(-p0[i]+p2[i])*t+(2*p0[i]-5*p1[i]+4*p2[i]-p3[i])*t2+(-p0[i]+3*p1[i]-3*p2[i]+p3[i])*t3)); }
function crd(p0,p1,p2,p3,t){ const t2=t*t; return [0,1,2].map(i=>.5*((-p0[i]+p2[i])+2*(2*p0[i]-5*p1[i]+4*p2[i]-p3[i])*t+3*(-p0[i]+3*p1[i]-3*p2[i]+p3[i])*t2)); }
function tube(pts,rad){
  const out=[], n=pts.length, P=i=>pts[Math.max(0,Math.min(n-1,i))];
  for(let i=0;i<n-1;i++){ const p0=P(i-1),p1=P(i),p2=P(i+1),p3=P(i+2), L=vlen(sub(p2,p1));
    const st=Math.max(2,Math.ceil(L/Math.max(.1,(rad[i]+rad[i+1])*.26)));
    for(let k=0;k<st;k++){ const t=k/st; out.push(sph(cr(p0,p1,p2,p3,t),lerp(rad[i],rad[i+1],t),norm(crd(p0,p1,p2,p3,t)))); } }
  out.push(sph(pts[n-1],rad[n-1],norm(sub(pts[n-1],pts[n-2])))); return out;
}
const cone=(b,t,r)=>({b,t,r});
function part(o){ return Object.assign({blobs:[],polys:[],cones:[],decals:[],role:'main',bias:0},o); }
// Punkt + Normale auf einem Ellipsoid (d = Richtung im lokalen Achsensystem)
function surf(bl,d){ const a=bl.ax; const p=add(bl.c,add(mul(a[0],d[0]),add(mul(a[1],d[1]),mul(a[2],d[2]))));
  const n=norm(add(mul(a[0],d[0]/dot(a[0],a[0])),add(mul(a[1],d[1]/dot(a[1],a[1])),mul(a[2],d[2]/dot(a[2],a[2]))))); return {p,n}; }
// alles in einem Teil verschieben/drehen (um z)/skalieren
function xf(pt,o,s,rot){
  const cs=Math.cos(rot),sn=Math.sin(rot), R=v=>[v[0]*cs-v[1]*sn,v[0]*sn+v[1]*cs,v[2]], P=v=>add(o,mul(R(v),s)), D=v=>mul(R(v),s);
  pt.blobs.forEach(b=>{b.c=P(b.c);b.ax=b.ax.map(D);});
  pt.polys.forEach(q=>{q.pts=q.pts.map(P); q.n=R(q.n); if(q.lines) q.lines=q.lines.map(l=>l.map(P));});
  pt.cones.forEach(c=>{c.b=P(c.b);c.t=P(c.t);c.r*=s;});
  pt.decals.forEach(d=>{d.p=P(d.p);d.n=R(d.n);d.u=D(d.u);d.v=D(d.v);});
  if(pt.face) pt.face=R(pt.face);
  return pt;
}
function eye(p,n,s){ n=norm(n); let t=norm(cross(n,[0,1,0])); if(!isFinite(t[0])||vlen(cross(n,[0,1,0]))<1e-3) t=[1,0,0]; const v=cross(n,t);
  return {kind:'eye',p,n,u:mul(t,s),v:mul(v,s)}; }

/* ---------------- Baukasten: Körper ---------------- */
function mkBody(k){
  const B={parts:[]}; const legs=[];
  const leg=(blobs,z)=>legs.push(part({cat:'body',grp:'leg'+legs.length,blobs,pat:false}));
  if(k==='zwei'){
    B.torso=part({cat:'body',grp:'torso',blobs:[E([0,2.1,0],[1.25,.78,.62],.12),Object.assign(E([.12,1.84,0],[.98,.5,.52],.12),{belly:1})],pat:true});
    B.neck=part({cat:'body',grp:'neck',blobs:tube([[.75,2.3,0],[1.25,2.7,0],[1.55,2.95,0]],[.52,.4,.34]),pat:true});
    B.headAt=[1.6,2.95,0]; B.headS=1; B.headRot=.04; B.tailBase=[-.95,2.2,0]; B.tailR=.56; B.tailL=3.3; B.droop=[.1,-.38]; B.back=[1.0,-2.3];
    [.42,-.42].forEach(z=>{ leg([E([-.2,1.65,z],[.45,.6,.28],.35),...tube([[-.05,1.3,z],[-.35,.75,z],[-.15,.22,z]],[.26,.17,.14]),E([.1,.1,z],[.36,.1,.17])],z);
      leg(tube([[.85,1.95,z*1.05],[1.05,1.62,z*1.12],[1.25,1.5,z*1.12]],[.13,.1,.07]),z); });
  } else if(k==='vier'){
    B.torso=part({cat:'body',grp:'torso',blobs:[E([0,1.75,0],[1.55,.88,.85],.02),Object.assign(E([.05,1.45,0],[1.3,.55,.74]),{belly:1})],pat:true});
    B.neck=part({cat:'body',grp:'neck',blobs:tube([[1.2,1.9,0],[1.65,1.92,0],[1.92,1.88,0]],[.55,.45,.38]),pat:true});
    B.headAt=[1.98,1.86,0]; B.headS=.95; B.headRot=-.2; B.tailBase=[-1.3,1.95,0]; B.tailR=.55; B.tailL=2.9; B.droop=[-.1,-.55]; B.back=[1.25,-2.4];
    [.55,-.55].forEach(z=>{ leg([...tube([[.95,1.5,z],[1.0,.8,z],[1.0,.22,z]],[.36,.27,.25]),E([1.08,.1,z],[.3,.1,.25])],z);
      leg([E([-.95,1.35,z],[.5,.62,.34]),...tube([[-.95,1.0,z],[-.9,.55,z],[-.9,.2,z]],[.3,.27,.26]),E([-.82,.1,z],[.32,.1,.27])],z); });
  } else {
    B.torso=part({cat:'body',grp:'torso',blobs:[E([0,2.3,0],[1.6,.95,.9],.1),Object.assign(E([.05,1.98,0],[1.35,.6,.75],.1),{belly:1})],pat:true});
    B.neck=part({cat:'body',grp:'neck',blobs:tube([[1.2,2.75,0],[1.85,3.6,0],[2.2,4.5,0],[2.4,5.3,0]],[.55,.42,.32,.26]),pat:true});
    B.headAt=[2.42,5.34,0]; B.headS=.7; B.headRot=-.3; B.tailBase=[-1.4,2.35,0]; B.tailR=.55; B.tailL=4.2; B.droop=[-.2,-.9]; B.back=[1.3,-2.4];
    [.55,-.55].forEach(z=>{ leg([...tube([[1.0,2.4,z],[1.0,1.2,z],[1.0,.25,z]],[.42,.33,.32]),E([1.06,.12,z],[.34,.12,.32])],z);
      leg([...tube([[-1.0,2.2,z],[-1.0,1.1,z],[-1.0,.25,z]],[.46,.34,.33]),E([-.94,.12,z],[.34,.12,.32])],z); });
  }
  B.parts.push(B.torso,B.neck,...legs);
  return B;
}
/* ---------------- Köpfe (lokal: x nach vorn, Ursprung am Halsende) ---------------- */
function mkHead(k){
  const H=part({cat:'head',grp:'head',pat:true}), extra=[];
  const eyes=(x,y,z,s=.085)=>[1,-1].forEach(sd=>H.decals.push(eye([x,y,z*sd],[.25,.35,.9*sd],s)));
  const teeth=(x0,x1,y,z)=>[1,-1].forEach(sd=>{ const T=part({cat:'head',grp:'head',role:'tooth',face:[0,0,sd],bias:.01});
    for(let x=x0;x<=x1;x+=.13) T.cones.push(cone([x,y,z*sd],[x+.02,y-.11,z*sd],.035)); extra.push(T); });
  const hornP=(b,t,r)=>extra.push(part({cat:'head',grp:'head',role:'horn',cones:[cone(b,t,r)]}));
  if(k==='rex'){ H.blobs.push(E([.25,.12,0],[.55,.42,.36],-.05),E([.78,0,0],[.5,.3,.3],-.12),E([.55,-.26,0],[.58,.14,.27],.1),E([.45,.34,0],[.22,.1,.3]));
    eyes(.48,.32,.28); teeth(.45,1.1,-.12,.25); }
  else if(k==='kroko'){ H.blobs.push(E([.15,.12,0],[.45,.36,.34]),E([.85,0,0],[.72,.17,.2],-.04),E([.75,-.15,0],[.66,.1,.18],.02),E([.35,.34,0],[.18,.12,.1]));
    eyes(.3,.3,.24,.075); teeth(.55,1.45,-.1,.17); }
  else if(k==='schnabel'){ H.blobs.push(E([.25,.06,0],[.42,.32,.3]),E([.6,-.02,0],[.3,.22,.24])); eyes(.32,.2,.24,.075); hornP([.76,-.04,0],[1.12,-.15,0],.17); }
  else if(k==='ente'){ H.blobs.push(E([.2,.1,0],[.45,.33,.3]),E([.75,-.06,0],[.42,.12,.24],-.08)); eyes(.3,.25,.25,.075);
    extra.push(part({cat:'head',grp:'head',role:'acc',blobs:tube([[.12,.3,0],[-.35,.62,0],[-.95,.8,0]],[.16,.14,.11])})); }
  else if(k==='horn'){ H.blobs.push(E([.3,0,0],[.6,.42,.42]),E([.75,-.08,0],[.35,.28,.3])); eyes(.5,.22,.36,.08);
    hornP([.92,-.1,0],[1.25,-.3,0],.16); hornP([.88,.2,0],[1.05,.55,0],.09); [1,-1].forEach(s=>hornP([.45,.36,.2*s],[1.25,.95,.3*s],.1));
    const C=[-.05,.5,0], u=[0,0,.95], v=mul(norm([-.5,.85,0]),.9), pts=[];
    for(let i=0;i<40;i++){ const a=i/40*Math.PI*2, kk=1+.07*Math.max(0,Math.cos(a*12)); pts.push(add(C,add(mul(u,Math.cos(a)*kk),mul(v,Math.sin(a)*kk)))); }
    extra.push(part({cat:'head',grp:'head',role:'acc',polys:[{pts,n:norm(cross(u,v))}]})); }
  else { H.blobs.push(E([.2,.02,0],[.42,.3,.3]),E([.58,-.06,0],[.3,.22,.25]),E([.28,.28,0],[.2,.2,.18])); eyes(.3,.18,.26,.075); }
  return [H,...extra];
}
/* ---------------- Schwänze ---------------- */
function mkTail(k,B){
  const L=B.tailL*(k==='lang'?1:.85), b=B.tailBase, pts=[], rad=[];
  for(let i=0;i<=4;i++){ const t=i/4; pts.push([b[0]-L*t,b[1]+B.droop[0]*t+B.droop[1]*t*t,0]); rad.push(B.tailR*(1-t*.86)); }
  const T=part({cat:'tail',grp:'tail',blobs:tube(pts,rad),pat:true}), out=[T];
  const at=t=>{ const i=Math.min(3,Math.floor(t*4)), f=t*4-i; return [lerp(pts[i][0],pts[i+1][0],f),lerp(pts[i][1],pts[i+1][1],f),0]; };
  if(k==='keule'){ const e=pts[4]; out.push(part({cat:'tail',grp:'tail',role:'acc',blobs:[E([e[0]-.12,e[1],0],[.45,.27,.48]),E([e[0]-.05,e[1],.25],[.25,.2,.2]),E([e[0]-.05,e[1],-.25],[.25,.2,.2])]})); }
  if(k==='stacheln') [1,-1].forEach(s=>{ const S=part({cat:'tail',grp:'tail',role:'horn'});
    [.78,.93].forEach((t,j)=>{ const p=at(t), r=B.tailR*(1-t*.86); const bs=[p[0],p[1]+r*.3,s*r*.6]; S.cones.push(cone(bs,add(bs,[-.3-.15*j,.5,s*.62]),.085)); });
    out.push(S); });
  return out;
}
/* ---------------- Rücken ---------------- */
function mkBack(k,B,all){
  if(k==='keine') return [];
  const main=all.filter(p=>['torso','neck','tail'].includes(p.grp)&&p.role==='main').flatMap(p=>p.blobs.filter(b=>!b.belly));
  const top=x=>{ let y=0; main.forEach(b=>{ const rx=Math.abs(b.ax[0][0])+Math.abs(b.ax[1][0])*.3, ry=Math.hypot(b.ax[0][1],b.ax[1][1]), dx=(x-b.c[0])/(rx||1e-3); if(Math.abs(dx)<1) y=Math.max(y,b.c[1]+ry*Math.sqrt(1-dx*dx)); }); return y; };
  const [xs,xe]=B.back, out=[];
  if(k==='platten'){ const N=9; for(let i=0;i<N;i++){ const t=i/(N-1), x=lerp(xs,xe,t), y=top(x)-.1, h=.32+.62*Math.sin(Math.PI*(.12+.76*t)), w=h*.82, z=i%2?.07:-.07, pts=[];
      for(let j=0;j<=12;j++){ const a=j/12*Math.PI; pts.push([x+w/2*Math.cos(a)*(1-.25*Math.sin(a)),y+h*Math.pow(Math.sin(a),1.3),z]); }
      out.push(part({cat:'back',grp:'torso',role:'acc',bias:50,polys:[{pts,n:[0,0,1]}]})); } }
  if(k==='segel'){ const N=16, H=B.back[0]>1.2?1.3:1.55, pts=[], base=[], lines=[];
    for(let i=0;i<=N;i++){ const t=i/N, x=lerp(xs,xe,t), y=top(x)-.12, h=H*Math.pow(Math.sin(Math.PI*t),.75)+.05; pts.push([x,y+h,0]); base.unshift([x,y,0]); if(i%2===0&&i>0&&i<N) lines.push([[x,y,0],[x,y+h,0]]); }
    out.push(part({cat:'back',grp:'torso',role:'acc',bias:50,polys:[{pts:pts.concat(base),n:[0,0,1],lines}]})); }
  if(k==='federn'){ const F=part({cat:'back',grp:'torso',role:'acc',bias:50}); const N=14;
    for(let i=0;i<N;i++){ const t=i/(N-1), x=lerp(xs+.2,xe,t), y=top(x), l=.22+.16*Math.sin(Math.PI*t), a=2.05+.25*t;
      F.blobs.push(E([x+Math.cos(a)*l*.8,y+Math.sin(a)*l*.8-.05,(i%2?.06:-.06)],[l,.075,.06],a)); }
    out.push(F); }
  if(k==='knubbel'){ const K=part({cat:'back',grp:'torso',role:'acc',bias:50,cull:true}); const tb=B.torso.blobs[0];
    [-.72,-.45,-.18,.09,.36,.62].forEach((u,i)=>[0,.55,-.55,1.1,-1.1].forEach(ph=>{ const s=Math.sqrt(1-u*u), {p,n}=surf(tb,[u+(i%2?.04:0),s*Math.cos(ph),s*Math.sin(ph)]);
      let t=norm(cross(n,[1,0,0])); const v=cross(n,t); K.blobs.push({c:add(p,mul(n,.02)),ax:[mul(n,.11),mul(t,.14),mul(v,.14)],n}); }));
    out.push(K); }
  return out;
}
/* ---------------- Muster (Aufkleber auf der Oberfläche) ---------------- */
function rng(seed){ let s=seed*9301+49297; return ()=>{ s=(s*9301+49297)%233280; return s/233280; }; }
function addPattern(parts,pat){
  if(pat==='keins') return;
  parts.filter(p=>p.pat).forEach((p,pi)=>{ const R=rng(pi*31+7);
    p.blobs.forEach((b,bi)=>{ if(b.belly) return; const r0=vlen(b.ax[0]), r1=vlen(b.ax[1]), r2=vlen(b.ax[2]); if(Math.min(r1,r2)<.1) return;
      const axis=norm(b.ax[0]);
      if(pat==='punkte'){ if(p.blobs.length>6&&bi%3) return; const n=Math.max(1,Math.min(7,Math.round(r0*r1*4)));
        for(let i=0;i<n;i++){ let d=[R()*2-1,R()*1.3-.3,R()*2-1]; d=norm(d); const {p:pp,n:nn}=surf(b,d); const s=Math.min(.17,.33*Math.min(r1,r2))*(.7+.5*R());
          let t=norm(cross(nn,[0,1,0])); if(!isFinite(t[0])) t=[1,0,0]; p.decals.push({kind:'pat',p:pp,n:nn,u:mul(t,s),v:mul(cross(nn,t),s*.85)}); } }
      else { const us=p.blobs.length>3?(bi%3?null:[0]):[-.62,-.31,0,.31,.62]; if(!us) return;
        us.forEach(u=>[0,.55,-.55,1.1,-1.1].forEach(ph=>{ const s=Math.sqrt(1-u*u), {p:pp,n:nn}=surf(b,[u,s*Math.cos(ph),s*Math.sin(ph)]);
          const around=norm(cross(axis,nn)), along=norm(cross(nn,around)); p.decals.push({kind:'pat',p:pp,n:nn,u:mul(around,.36*Math.min(r1,r2)),v:mul(along,Math.min(.085,.3*r0))}); })); }
    }); });
}
/* ---------------- Modell aus Konfiguration ---------------- */
function build(cfg){
  if(!cfg.body) return {parts:[],cx:0,R:2,ymax:3};
  const B=mkBody(cfg.body); let parts=B.parts.slice();
  if(cfg.head) parts.push(...mkHead(cfg.head).map(p=>xf(p,B.headAt,B.headS,B.headRot)));
  if(cfg.tail) parts.push(...mkTail(cfg.tail,B));
  if(cfg.back) parts.push(...mkBack(cfg.back,B,parts));
  addPattern(parts,cfg.pat||'keins');
  let x0=1e9,x1=-1e9,ymax=0;
  parts.forEach(p=>{ p.blobs.forEach(b=>{const r=vlen(b.ax[0]);x0=Math.min(x0,b.c[0]-r);x1=Math.max(x1,b.c[0]+r);ymax=Math.max(ymax,b.c[1]+Math.max(vlen(b.ax[1]),r));});
    p.polys.forEach(q=>q.pts.forEach(v=>{x0=Math.min(x0,v[0]);x1=Math.max(x1,v[0]);ymax=Math.max(ymax,v[1]);}));
    p.cones.forEach(c=>{[c.b,c.t].forEach(v=>{x0=Math.min(x0,v[0]);x1=Math.max(x1,v[0]);ymax=Math.max(ymax,v[1]);});}); });
  const cx=(x0+x1)/2; return {parts,cx,R:(x1-x0)/2+.3,ymax};
}

/* ---------------- Farben ---------------- */
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const mixC=(a,b,t)=>{const A=hex(a),B=hex(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');};
const rgba=(h,a)=>{const c=hex(h);return `rgba(${c[0]},${c[1]},${c[2]},${a})`;};
function roleCol(role,cfg,blob){
  if(role==='main') return blob&&blob.belly?mixC(cfg.main,'#f6ead0',.5):cfg.main;
  if(role==='acc') return cfg.acc; if(role==='horn') return HORN; if(role==='tooth') return TOOTH; return cfg.main;
}

/* ---------------- Projektion + Zeichnen ---------------- */
let NOISE=null;
function noise(){
  if(NOISE) return NOISE; const c=document.createElement('canvas'); c.width=c.height=192; const g=c.getContext('2d'); const R=rng(3);
  for(let i=0;i<60;i++){ const x=R()*192,y=R()*192,r=10+R()*34; const gr=g.createRadialGradient(x,y,0,x,y,r); const a=.03+R()*.05;
    gr.addColorStop(0,R()<.6?`rgba(90,60,30,${a})`:`rgba(255,250,235,${a})`); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(0,0,192,192); }
  for(let i=0;i<1400;i++){ g.fillStyle=`rgba(70,50,30,${R()*.05})`; g.fillRect(R()*192,R()*192,1.3,1.3); }
  return NOISE=c;
}
function camera(v){
  const cy=Math.cos(v.yaw),sy=Math.sin(v.yaw),cp=Math.cos(v.pitch),sp=Math.sin(v.pitch), sq=v.sq||1, hop=v.hop||0;
  const rot=a=>{ const x1=a[0]*cy+a[2]*sy, z1=-a[0]*sy+a[2]*cy, y=a[1]; return [x1,y*cp-z1*sp,z1*cp+y*sp]; };
  return { P:p=>{ const r=rot([p[0]-v.cx,p[1]*sq+hop,p[2]]); return {x:v.ox+r[0]*v.S,y:v.oy-r[1]*v.S,z:r[2]}; },
    D:a=>{ const r=rot([a[0],a[1]*sq,a[2]]); return [r[0]*v.S,-r[1]*v.S,r[2]]; }, rot };
}
function ellFrom(C,cols){ let m00=0,m11=0,m01=0; cols.forEach(a=>{m00+=a[0]*a[0];m11+=a[1]*a[1];m01+=a[0]*a[1];});
  const tr=(m00+m11)/2, df=Math.sqrt(((m00-m11)/2)**2+m01*m01); return {x:C.x,y:C.y,z:C.z,a:Math.sqrt(tr+df),b:Math.sqrt(Math.max(1e-6,tr-df)),th:.5*Math.atan2(2*m01,m00-m11)}; }
function project(model,v,now){
  const cam=camera(v), items=[];
  model.parts.forEach(p=>{
    let k=1; if(p.born&&now!=null){ const t=Math.min(1,(now-p.born)/420); k=t>=1?1:(1+2.2*Math.pow(t-1,3)+1.2*Math.pow(t-1,2))*t+.001; }
    const piv=p.pivot, sc=q=>k===1?q:add(piv,mul(sub(q,piv),k));
    const it={p,els:[],polys:[],cones:[],decals:[],z:0,w:0};
    if(p.face&&cam.rot(p.face)[2]<-.15) return;
    p.blobs.forEach(b=>{ if(p.cull&&b.n&&cam.rot(b.n)[2]<-.25) return; const e=ellFrom(cam.P(sc(b.c)),b.ax.map(a=>cam.D(mul(a,k)))); e.blob=b; it.els.push(e); it.z+=e.z*e.a; it.w+=e.a; });
    p.polys.forEach(q=>{ const P=q.pts.map(x=>cam.P(sc(x))); const n=cam.rot(q.n); it.polys.push({P,f:Math.abs(n[2]),lines:q.lines&&q.lines.map(l=>l.map(x=>cam.P(sc(x))))}); P.forEach(x=>{it.z+=x.z;it.w+=1;}); });
    p.cones.forEach(c=>{ const B=cam.P(sc(c.b)),T=cam.P(sc(c.t)); it.cones.push({B,T,r:c.r*v.S*k}); it.z+=(B.z+T.z)/2; it.w+=1; });
    p.decals.forEach(d=>{ const n=cam.rot(d.n); if(n[2]<.06) return; const e=ellFrom(cam.P(sc(d.p)),[cam.D(mul(d.u,k)),cam.D(mul(d.v,k))]); e.kind=d.kind; e.f=n[2]; e.nz=n; it.decals.push(e); });
    it.z=it.w?it.z/it.w:0; items.push(it);
  });
  // Gruppen nach Tiefe, in der Gruppe nach eigener Tiefe (+bias)
  const G={}; items.forEach(it=>{ const g=G[it.p.grp]=G[it.p.grp]||{list:[],z:0,n:0}; g.list.push(it); if(!it.p.bias&&it.p.role!=='tooth'){g.z+=it.z;g.n++;} });
  return Object.values(G).map(g=>{g.z=g.n?g.z/g.n:g.list[0].z;return g;}).sort((a,b)=>a.z-b.z).flatMap(g=>g.list.sort((a,b)=>(a.z+a.p.bias)-(b.z+b.p.bias)));
}
function ellPath(ctx,e,grow=0){ ctx.moveTo(e.x+Math.cos(e.th)*(e.a+grow),e.y+Math.sin(e.th)*(e.a+grow)); ctx.ellipse(e.x,e.y,e.a+grow,e.b+grow,e.th,0,Math.PI*2); }
function conePath(ctx,c){ const dx=c.T.x-c.B.x, dy=c.T.y-c.B.y, L=Math.hypot(dx,dy)||1, nx=-dy/L*c.r, ny=dx/L*c.r, ux=dx/L, uy=dy/L;
  ctx.moveTo(c.B.x+nx,c.B.y+ny); ctx.quadraticCurveTo(c.B.x+nx*.55+dx*.55,c.B.y+ny*.55+dy*.55,c.T.x,c.T.y); ctx.quadraticCurveTo(c.B.x-nx*.55+dx*.55,c.B.y-ny*.55+dy*.55,c.B.x-nx,c.B.y-ny);
  ctx.quadraticCurveTo(c.B.x-ux*c.r*1.1,c.B.y-uy*c.r*1.1,c.B.x+nx,c.B.y+ny); }
function polyPath(ctx,P){ P.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y)); ctx.closePath(); }
const LX=-.45, LY=-.6;
function draw(ctx,items,cfg,o={}){
  const lw=o.lw||2, hits=[];
  items.forEach(it=>{
    const p=it.p, ghost=o.hi&&p.cat!==o.hi, col0=ghost?GHOST:null, ink=ghost?rgba(INK,.35):INK;
    const colOf=b=>col0||roleCol(p.role,cfg,b);
    ctx.lineJoin='round'; ctx.lineCap='round';
    if(it.els.length){
      ctx.fillStyle=ink; ctx.beginPath(); it.els.forEach(e=>ellPath(ctx,e,lw)); ctx.fill();
      it.els.forEach(e=>{ ctx.fillStyle=mixC(colOf(e.blob),'#3a3140',.3); ctx.beginPath(); ellPath(ctx,e); ctx.fill(); });
      it.els.forEach(e=>{ const c=colOf(e.blob), m=Math.min(e.a,e.b);
        ctx.save(); ctx.translate(e.x,e.y); ctx.rotate(e.th); ctx.scale(e.a,e.b);
        const cs=Math.cos(-e.th), sn=Math.sin(-e.th), ox=(LX*cs-LY*sn)*m/e.a*.42, oy=(LX*sn+LY*cs)*m/e.b*.42;
        let g=ctx.createRadialGradient(ox*.6,oy*.6,0,ox*.3,oy*.3,1.08); g.addColorStop(0,c); g.addColorStop(.62,c); g.addColorStop(1,rgba(c,0));
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,1,0,Math.PI*2); ctx.fill();
        g=ctx.createRadialGradient(ox,oy,0,ox,oy,.62); g.addColorStop(0,'rgba(255,252,240,.34)'); g.addColorStop(1,'rgba(255,252,240,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,1,0,Math.PI*2); ctx.fill(); ctx.restore(); });
      if(it.decals.length){ ctx.save(); ctx.beginPath(); it.els.forEach(e=>ellPath(ctx,e)); ctx.clip();
        it.decals.forEach(d=>{ const a=Math.min(1,d.f*3);
          if(d.kind==='pat'){ if(ghost) return; ctx.globalAlpha=a*.85; ctx.fillStyle=cfg.pc; ctx.beginPath(); ellPath(ctx,d); ctx.fill(); }
          else { ctx.globalAlpha=a; ctx.fillStyle=ghost?GHOST:TOOTH; ctx.strokeStyle=ink; ctx.lineWidth=lw*.8; ctx.beginPath(); ellPath(ctx,d); ctx.fill(); ctx.stroke();
            const s=d.a*.55, px=d.x+d.nz[0]*d.a*.35, py=d.y-d.nz[1]*d.a*.2; ctx.fillStyle=ghost?rgba(INK,.35):'#2b2118'; ctx.beginPath(); ctx.arc(px,py,s,0,Math.PI*2); ctx.fill();
            ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(px-s*.35,py-s*.35,s*.32,0,Math.PI*2); ctx.fill(); } });
        ctx.globalAlpha=1; ctx.restore(); }
      it.els.forEach(e=>hits.push({p,e}));
    }
    it.polys.forEach(q=>{ const c=col0||roleCol(p.role,cfg); ctx.beginPath(); polyPath(ctx,q.P); ctx.strokeStyle=ink; ctx.lineWidth=lw*2; ctx.stroke();
      ctx.fillStyle=mixC(mixC(c,'#3a3140',.35),c,.35+.65*q.f); ctx.fill();
      let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; q.P.forEach(v=>{x0=Math.min(x0,v.x);y0=Math.min(y0,v.y);x1=Math.max(x1,v.x);y1=Math.max(y1,v.y);});
      const g=ctx.createLinearGradient(x0,y0,x1*.3+x0*.7,y1); g.addColorStop(0,'rgba(255,250,235,.3)'); g.addColorStop(1,'rgba(255,250,235,0)'); ctx.fillStyle=g; ctx.fill();
      if(q.lines){ ctx.strokeStyle=rgba(INK,ghost?.15:.4); ctx.lineWidth=lw*.8; q.lines.forEach(l=>{ctx.beginPath();ctx.moveTo(l[0].x,l[0].y);ctx.lineTo(l[1].x,l[1].y);ctx.stroke();}); }
      const path=new Path2D(); polyPath(path,q.P); hits.push({p,path}); });
    it.cones.forEach(cn=>{ const c=col0||roleCol(p.role,cfg); ctx.beginPath(); conePath(ctx,cn); ctx.strokeStyle=ink; ctx.lineWidth=lw*(p.role==='tooth'?1.1:2); ctx.stroke();
      const g=ctx.createLinearGradient(cn.B.x,cn.B.y,cn.T.x,cn.T.y); g.addColorStop(0,mixC(c,'#6b5a45',.3)); g.addColorStop(1,mixC(c,'#ffffff',.35)); ctx.fillStyle=g; ctx.fill();
      const path=new Path2D(); conePath(path,cn); hits.push({p,path}); });
  });
  return hits;
}
function texture(ctx,W,H){ ctx.save(); ctx.globalCompositeOperation='source-atop'; ctx.fillStyle=ctx.createPattern(noise(),'repeat'); ctx.fillRect(0,0,W,H); ctx.restore(); }

/* Momentaufnahme (für Knöpfe, Bauplan, Regal) → PNG-URL */
const snapCache=new Map();
function snap(cfg,o={}){
  const w=o.w||200,h=o.h||150, key=JSON.stringify([cfg,o]); if(snapCache.has(key)) return snapCache.get(key);
  const model=build(cfg), c=document.createElement('canvas'); c.width=w; c.height=h; const ctx=c.getContext('2d');
  if(model.parts.length){
    const v={yaw:o.yaw!=null?o.yaw:-.35,pitch:o.pitch!=null?o.pitch:.22,cx:model.cx,S:1,ox:0,oy:0};
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; const its=project(model,v), foc=o.focus&&its.some(it=>it.p.cat===o.hi)?its.filter(it=>it.p.cat===o.hi):its;
    foc.forEach(it=>{ it.els.forEach(e=>{x0=Math.min(x0,e.x-e.a);x1=Math.max(x1,e.x+e.a);y0=Math.min(y0,e.y-e.a);y1=Math.max(y1,e.y+e.a);});
      it.polys.forEach(q=>q.P.forEach(p=>{x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y);}));
      it.cones.forEach(q=>[q.B,q.T].forEach(p=>{x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y);})); });
    if(foc!==its){ const mx=(x1-x0)*.18+.25, my=(y1-y0)*.18+.25; x0-=mx; x1+=mx; y0-=my; y1+=my; }
    const S=Math.min(w*.9/(x1-x0),h*.88/(y1-y0)); v.S=S; v.ox=w/2-(x0+x1)/2*S; v.oy=h/2-(y0+y1)/2*S;
    draw(ctx,project(model,v),cfg,{lw:Math.max(1.1,S*.03),hi:o.hi}); texture(ctx,w,h);
  }
  const url=c.toDataURL(); snapCache.set(key,url); if(snapCache.size>160) snapCache.delete(snapCache.keys().next().value); return url;
}

/* ================= Spiel ================= */
let root,lv=1,W=null;
const st=()=>{ const s=GK.st(ID); s.models=s.models||[]; return s; };
function mount(r){root=r;intro();}
function intro(){
  const saved=st().models;
  const art=saved.length?`<div class="ws-iart">${saved.slice(-3).map(m=>`<img src="${snap(m,{w:220,h:160})}" alt="">`).join('')}</div>`
    :`<div class="ws-iart"><img src="${snap(WS_TPL.stegosaurus.cfg,{w:260,h:180})}" alt=""><img src="${snap(WS_TPL.trex.cfg,{w:260,h:180,yaw:-.7})}" alt=""></div>`;
  GK.intro(root,{id:ID,title:'Modell-Werkstatt',art,
    say:'Willkommen in der Werkstatt! Hier baust du Dino-Modelle, drehst sie und malst sie an.',
    onStart:l=>{lv=l; if(lv<3) choose(); else editor(Object.assign({head:'rex',body:'zwei',tail:'lang',back:'keine'},{main:'#7fa66a',acc:'#e8914f',pat:'keins',pc:'#4f7a45'}),null);}});
  DW.$$('.gk-lv',root).forEach(b=>b.addEventListener('click',()=>setTimeout(()=>DW.say(['','Leicht: Wir bauen einen echten Dino nach.','Mittel: Nachbauen mit allen Teilen.','Schwer: Du baust ganz frei!'][+b.dataset.l]),30)));
}

/* ---------- Geführt: Vorlage wählen ---------- */
function choose(){
  GK.idle.stop();
  const keys=GK.sample(Object.keys(WS_TPL),6);   // jedes Mal eine andere Auswahl
  root.innerHTML=`<div class="ws-choose fill col"><div class="ws-chead"><button class="ibtn big ws-csay" aria-label="Vorlesen">${ART.icon('lautsprecher')}</button><span class="hand">Welchen Dino bauen wir?</span></div>
    <div class="ws-cgrid">${keys.map(k=>`<button class="ws-tpl" data-k="${k}" aria-label="${WS_TPL[k].n}"><img src="${snap(WS_TPL[k].cfg,{w:260,h:190})}" alt=""><b class="hand">${WS_TPL[k].n}</b></button>`).join('')}</div></div>`;
  const q='Welchen Dino wollen wir nachbauen? Tippe auf ein Bild!';
  DW.say(q); root.querySelector('.ws-csay').onclick=()=>DW.say(q);
  DW.$$('.ws-tpl',root).forEach(b=>b.onclick=()=>{ DW.sfx('pop'); GK.ok(b); const k=b.dataset.k; GK.after(350,()=>editor(Object.assign({},CLAY),k)); });
  GK.idle.set(()=>DW.$$('.ws-tpl',root).forEach(GK.pulse),()=>DW.say(q));
}

/* ---------- Werkstatt (Bühne + Leiste) ---------- */
function editor(cfg,tpl){
  GK.idle.stop(); if(W&&W.ro) W.ro.disconnect();
  W={cfg,tpl,step:tpl?0:-1,miss:0,cat:tpl?'body':(lv<3?'paint':'body'),view:{yaw:-.55,pitch:.26,vel:0},drag:null,brush:null,painted:false,
     model:null,dirty:true,anim:{bounce:0,spin:0,hop:0},hits:[],turned:false};
  root.innerHTML=`<div class="ws fill">
    <div class="ws-stage" id="wsStage"><canvas id="wsCv"></canvas>
      <div class="ws-tools">${lv===3?`<button class="ibtn big ws-tplbtn" aria-label="Vorlagen">${ART.icon('buch')}</button>`:''}<button class="ibtn big ws-shelfbtn" aria-label="Regal">${ART.icon('ws_regal')}</button></div>
      <div class="ws-plan" hidden></div>
      <div class="ws-hand">${ART.icon('hand')}</div>
      <button class="btn big go ws-done" hidden>${ART.icon('check',36)}<span>Fertig</span></button>
    </div>
    <div class="ws-panel card"><div class="ws-tabs"></div><div class="ws-opts"></div></div></div>`;
  const cv=root.querySelector('#wsCv'), stage=root.querySelector('#wsStage');
  W.cv=cv; W.ctx=cv.getContext('2d'); W.hand=root.querySelector('.ws-hand');
  const size=()=>{ const r=stage.getBoundingClientRect(), d=Math.min(2,window.devicePixelRatio||1); cv.width=Math.round(r.width*d); cv.height=Math.round(r.height*d); cv.style.width=r.width+'px'; cv.style.height=r.height+'px'; W.dpr=d; W.dirty=true; };
  size(); GK.listen(window,'resize',()=>panel());
  if(window.ResizeObserver){ const ro=new ResizeObserver(()=>{ if(W&&W.cv===cv) size(); }); ro.observe(stage); W.ro=ro; }
  rebuild(null);
  bindStage(cv);
  root.querySelector('.ws-shelfbtn').onclick=()=>{DW.sfx('tap');shelf();};
  const tb=root.querySelector('.ws-tplbtn'); if(tb) tb.onclick=()=>{DW.sfx('tap');templates();};
  root.querySelector('.ws-done').onclick=()=>{DW.sfx('pop');save();};
  GK.loop(tick);
  if(tpl){ const T=WS_TPL[tpl]; const plan=root.querySelector('.ws-plan'); plan.hidden=false;
    plan.innerHTML=`<img src="${snap(T.cfg,{w:240,h:170,yaw:-.2})}" alt="Bauplan" class="${lv===2?'shadow':''}">`;
    plan.onclick=()=>{DW.sfx('tap');DW.say(`Das ist der Bauplan. So sah ${T.der} aus.`);};
    DW.say(`Wir bauen ${T.der}! ${stepQ()}`);
  } else {
    root.querySelector('.ws-done').hidden=false;
    DW.say(lv===3?'Bau deinen eigenen Dino! Tippe unten auf Körper, Kopf, Schwanz und Rücken. Mit dem Finger drehst du ihn.':'Jetzt malen!');
  }
  panel(); idle();
}
function stepQ(){ const c=['body','head','tail','back'][W.step], T=WS_TPL[W.tpl];
  return {body:`Welchen Körper hatte ${T.der}?`,head:`Welchen Kopf hatte ${T.der}?`,tail:`Welchen Schwanz hatte ${T.der}?`,back:`Und wie sah sein Rücken aus?`}[c]; }
function idle(){
  if(W.step>=0) GK.idle.set(()=>{ const T=WS_TPL[W.tpl], c=['body','head','tail','back'][W.step]; const b=root.querySelector(`.ws-opt[data-v="${T.cfg[c]}"]`);
      if(lv===1&&b&&W.stepMiss) GK.pulse(b); else GK.pulse(root.querySelector('.ws-plan')); },()=>DW.say(stepQ()+' Schau auf den Bauplan!'));
  else GK.idle.set(()=>{ if(!W.turned) GK.pulse(root.querySelector('.ws-hand')); else if(!W.painted&&W.cat==='paint') DW.$$('.ws-pot',root).slice(0,3).forEach(GK.pulse); else GK.pulse(root.querySelector('.ws-done')); },
    ()=>DW.say(!W.turned?'Dreh deinen Dino mit dem Finger auf der Drehscheibe!':W.cat==='paint'?'Tippe auf eine Farbe. Dann tippe auf den Dino!':'Wenn du fertig bist, tippe auf den grünen Haken.'));
}
function rebuild(changedCat){
  const m=build(W.cfg); const now=performance.now();
  if(changedCat) m.parts.forEach(p=>{ if(p.cat===changedCat||(changedCat==='body')){ p.born=now; const b=p.blobs[0]||{c:p.polys[0]?p.polys[0].pts[0]:p.cones[0]?p.cones[0].b:[0,0,0]}; p.pivot=b.c; } });
  // Ankerpunkt für das Einblenden: Mittelpunkt des Teils
  m.parts.forEach(p=>{ if(p.born){ let s=[0,0,0],n=0; p.blobs.forEach(b=>{s=add(s,b.c);n++;}); p.polys.forEach(q=>q.pts.forEach(x=>{s=add(s,x);n++;})); p.cones.forEach(c=>{s=add(s,c.b);n++;}); if(n) p.pivot=mul(s,1/n); } });
  if(W.model&&W.model.parts.length){ m.fitR=W.model.fitR; m.fitY=W.model.fitY; }
  W.model=m; W.dirty=true;
}
function tick(dt){
  if(!W||!W.cv.isConnected) return false;
  const V=W.view, A=W.anim;
  if(!W.drag&&Math.abs(V.vel)>.01){ V.yaw+=V.vel*dt; V.vel*=Math.exp(-2.6*dt); W.dirty=true; }
  if(A.spin>0){ const d=Math.min(A.spin,dt*6.5); V.yaw+=d; A.spin-=d; W.dirty=true; }
  if(A.bounce>0){ A.bounce=Math.max(0,A.bounce-dt*2.2); W.dirty=true; }
  if(A.hop>0){ A.hop=Math.max(0,A.hop-dt*1.6); W.dirty=true; }
  if(W.model.parts.some(p=>p.born&&performance.now()-p.born<460)) W.dirty=true;
  const m=W.model; const tR=m.R||2, tY=m.ymax||3; m.fitR=m.fitR?lerp(m.fitR,tR,Math.min(1,dt*6)):tR; m.fitY=m.fitY?lerp(m.fitY,tY,Math.min(1,dt*6)):tY;
  if(Math.abs(m.fitR-tR)>.005||Math.abs(m.fitY-tY)>.005) W.dirty=true;
  if(W.dirty){ W.dirty=false; render(); }
}
function render(){
  const {cv,ctx,model:m,view:V,anim:A,cfg}=W, w=cv.width, h=cv.height;
  ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,w,h);
  const sp=Math.sin(V.pitch), cp=Math.cos(V.pitch), R=Math.max(2.9,m.fitR||2.9), Y=Math.max(3.2,m.fitY||3.2);
  const S=Math.min(w*.44/R,h*.84/(Y*cp+2*R*sp+.5)), ox=w/2, oy=h/2+((Y*cp+R*sp)-(R*sp+.22*cp))*S/2;
  const t=A.bounce, sq=1+Math.sin(t*14)*t*.12, hop=Math.sin(Math.min(1,A.hop)*Math.PI)*.9;
  const v={yaw:V.yaw,pitch:V.pitch,cx:m.cx||0,S,ox,oy,sq,hop};
  // Drehscheibe
  const tr=R*S*.98, ty=oy, th=.22*S*cp, ry=tr*sp;
  ctx.fillStyle='#8a6a48'; ctx.beginPath(); ctx.ellipse(ox,ty+th,tr,ry,0,0,Math.PI*2); ctx.fill(); ctx.fillRect(ox-tr,ty,tr*2,th);
  ctx.strokeStyle=INK; ctx.lineWidth=Math.max(1.5,S*.03); ctx.beginPath(); ctx.ellipse(ox,ty+th,tr,ry,0,0,Math.PI); ctx.moveTo(ox-tr,ty); ctx.lineTo(ox-tr,ty+th); ctx.moveTo(ox+tr,ty); ctx.lineTo(ox+tr,ty+th); ctx.stroke();
  let g=ctx.createRadialGradient(ox-tr*.3,ty-ry*.4,0,ox,ty,tr); g.addColorStop(0,'#e8d3a8'); g.addColorStop(1,'#c9a874'); ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(ox,ty,tr,ry,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle='rgba(120,90,50,.35)'; ctx.lineWidth=Math.max(1,S*.02); ctx.beginPath(); ctx.ellipse(ox,ty,tr*.8,ry*.8,0,0,Math.PI*2); ctx.stroke();
  const cam=camera(v); ctx.fillStyle='rgba(90,60,30,.5)';
  for(let i=0;i<12;i++){ const a=i/12*Math.PI*2; const p=cam.P([m.cx+Math.cos(a)*R*.9,0,Math.sin(a)*R*.9]); if(p.z>-.1*R){ ctx.beginPath(); ctx.ellipse(p.x,p.y,S*.07,S*.07*sp,0,0,Math.PI*2); ctx.fill(); } }
  if(W.hand){ W.hand.style.top=((ty+ry*.35)/W.dpr)+'px'; }
  // Schatten
  ctx.fillStyle='rgba(60,40,20,.2)'; ctx.beginPath(); ctx.ellipse(ox,ty,R*S*.62*(1-hop*.25),R*S*.62*sp*(1-hop*.25)*.9,0,0,Math.PI*2); ctx.fill();
  if(!m.parts.length) return;
  const items=project(m,v,performance.now());
  ctx.save(); W.hits=draw(ctx,items,cfg,{lw:Math.max(1.4,S*.032)}); ctx.restore();
  texture(ctx,w,h);
}
/* Drehen mit Schwung, Tippen = anmalen / Dino hüpft */
function bindStage(cv){
  GK.noFling(cv);   // nach schnellem Drehen ging der nächste Tipp auf einen Reiter/ein Teil sonst verloren
  /* nur ein Finger dreht das Modell (ein zweiter ließ es flackern und danach wild weiterschleudern) */
  cv.addEventListener('pointerdown',e=>{ if(!W||W.drag||e.button>0) return; e.preventDefault(); try{ cv.setPointerCapture(e.pointerId); }catch(err){} W.drag={id:e.pointerId,x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,t:performance.now(),moved:false}; W.view.vel=0; });
  cv.addEventListener('pointermove',e=>{ const d=W&&W.drag; if(!d||e.pointerId!==d.id) return; const dx=e.clientX-d.x, dy=e.clientY-d.y, now=performance.now();
    if(!d.moved&&Math.hypot(e.clientX-d.x0,e.clientY-d.y0)>7){ d.moved=true; if(!W.turned){W.turned=true;root.querySelector('.ws-hand').classList.add('gone');} }
    if(d.moved){ W.view.yaw+=dx*.011; W.view.pitch=DW.clamp(W.view.pitch+dy*.004,.04,.62); const ddt=Math.max(.008,(now-d.t)/1000); W.view.vel=lerp(W.view.vel,dx*.011/ddt,.5); W.dirty=true; if(Math.random()<.12) DW.sfx('click'); }
    d.x=e.clientX; d.y=e.clientY; d.t=now; });
  const up=e=>{ const d=W&&W.drag; if(!d||e.pointerId!==d.id) return; W.drag=null; if(performance.now()-d.t>90) W.view.vel=0; W.view.vel=DW.clamp(W.view.vel,-9,9);
    if(!d.moved&&e.type==='pointerup'){ const r=cv.getBoundingClientRect(); tapModel((e.clientX-r.left)*W.dpr,(e.clientY-r.top)*W.dpr); } };
  cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up); cv.addEventListener('lostpointercapture',up);
}
function hitAt(x,y){
  for(let i=W.hits.length-1;i>=0;i--){ const h=W.hits[i];
    if(h.e){ const e=h.e, dx=x-e.x, dy=y-e.y, c=Math.cos(e.th), s=Math.sin(e.th), u=(dx*c+dy*s)/e.a, v=(-dx*s+dy*c)/e.b; if(u*u+v*v<=1) return h.p; }
    else if(W.ctx.isPointInPath(h.path,x,y)) return h.p; }
  return null;
}
function tapModel(x,y){
  const p=hitAt(x,y); if(!p) return;
  if(W.brush&&W.step<0&&(p.role==='main'||p.role==='acc')){ const key=p.role==='acc'?'acc':(W.target==='pc'&&W.cfg.pat!=='keins'?'pc':'main');
    W.cfg[key]=W.brush; W.target=key; W.painted=true; DW.sfx('brush'); W.anim.bounce=.6; W.dirty=true; panel(); return; }
  DW.sfx('jump'); W.anim.hop=1; W.anim.bounce=.5;
  if(W.step<0&&W.cat==='paint'&&!W.brush) DW.say('Tippe zuerst auf eine Farbe!');
}

/* ---------- Leiste: Kategorien, Teile, Farben ---------- */
function panel(){
  if(!W) return;
  const tabs=root.querySelector('.ws-tabs'), opts=root.querySelector('.ws-opts'); if(!tabs) return;
  const guided=W.step>=0;
  const cats=guided?[]:(lv===1?['paint']:WS_CATS.map(c=>c.k));
  tabs.innerHTML=guided?`<div class="ws-steps">${GK.progress(W.step,4)}</div>`:cats.length>1?cats.map(k=>`<button class="ws-tab ${k===W.cat?'on':''}" data-c="${k}" aria-label="${WS_CATS.find(c=>c.k===k).n}">${k==='paint'?ART.icon('pinsel'):`<img src="${snap(W.cfg,{w:120,h:90,hi:k,yaw:-.25})}" alt="">`}</button>`).join(''):'';
  tabs.hidden=!tabs.innerHTML;
  DW.$$('.ws-tab',tabs).forEach(b=>b.onclick=()=>{ W.cat=b.dataset.c; DW.sfx('tap'); DW.say(WS_CATS.find(c=>c.k===W.cat).n); panel(); });
  const cat=guided?['body','head','tail','back'][W.step]:W.cat;
  if(cat==='paint'){
    opts.className='ws-opts paint';
    const hasAcc=W.model.parts.some(p=>p.role==='acc'), tg=W.target==='acc'&&!hasAcc?'main':(W.target||'main');
    opts.innerHTML=`<div class="ws-pats"><button class="ws-pat ${tg==='main'?'on':''}" data-t="main" aria-label="Körper">${patIcon('keins')}</button>
      <button class="ws-pat ${tg==='pc'?'on':''}" data-t="pc" aria-label="Muster">${patIcon(W.cfg.pat==='keins'?'streifen':W.cfg.pat,W.cfg.pat==='keins')}</button>
      ${hasAcc?`<button class="ws-pat ${tg==='acc'?'on':''}" data-t="acc" aria-label="Platten, Hörner und Kamm">${accIcon()}</button>`:''}</div>
      <div class="ws-pots">${WS_POTS.map(c=>`<button class="ws-pot ${W.brush===c?'on':''}" data-c="${c}" style="--c:${c}" aria-label="Farbe"></button>`).join('')}</div>`;
    DW.$$('.ws-pat',opts).forEach(b=>b.onclick=()=>{ const t=b.dataset.t; DW.sfx('tap');
      if(t==='pc'){ const order=['keins','streifen','punkte']; const k=W.target==='pc'?order[(order.indexOf(W.cfg.pat)+1)%3]:(W.cfg.pat==='keins'?'streifen':W.cfg.pat);
        W.cfg.pat=k; if(W.cfg.pc===W.cfg.main||hex(W.cfg.pc).join()===hex(CLAY.pc).join()&&W.cfg.main!==CLAY.main) W.cfg.pc=mixC(W.cfg.main,INK,.4); rebuild(null); W.anim.bounce=.6; W.painted=true; DW.sfx('brush');
        DW.say(WS_PATS.find(p=>p.k===k).say+(k!=='keins'?'! Welche Farbe?':'.')); }
      else DW.say(t==='main'?'Körper. Welche Farbe?':'Platten, Hörner und Kamm. Welche Farbe?');
      W.target=t; panel(); });
    DW.$$('.ws-pot',opts).forEach(b=>b.onclick=()=>{ const c=b.dataset.c; W.brush=c; const key=tg==='pc'&&W.cfg.pat==='keins'?'main':tg; W.cfg[key]=c; W.painted=true;
      DW.sfx('brush'); W.anim.bounce=.6; W.dirty=true; if(!W.saidBrush){W.saidBrush=1;DW.say('Schön! Tippe auf den Dino, um Platten, Hörner oder Kamm anzumalen.');} panel(); });
    return;
  }
  opts.className='ws-opts parts';
  let list=WS_PARTS[cat];
  if(guided){ const T=WS_TPL[W.tpl], want=T.cfg[cat];
    if(!W.stepOpts){ W.stepOpts=lv===1?DW.shuffle([want,DW.pick(list.filter(o=>o.k!==want)).k]):list.map(o=>o.k); }
    list=W.stepOpts.map(k=>list.find(o=>o.k===k)); }
  const base=guided?Object.assign({},W.cfg):W.cfg;
  opts.innerHTML=list.map(o=>`<button class="ws-opt ${!guided&&W.cfg[cat]===o.k?'on':''} ${W.off&&W.off.includes(o.k)?'off':''} ${o.k==='keine'?'none':''}" data-v="${o.k}" aria-label="${o.say}">
    <img src="${snap(Object.assign({},base,{[cat]:o.k},cat!=='body'&&!base.body?{body:WS_TPL[W.tpl||'trex'].cfg.body}:{}),{w:170,h:120,hi:cat,yaw:-.25,focus:cat!=='body'})}" alt=""></button>`).join('');
  const land=root.querySelector('.ws').clientWidth>root.querySelector('.ws').clientHeight; opts.style.setProperty('--cols',land?(list.length<=2?1:2):Math.min(list.length,3));
  DW.$$('.ws-opt',opts).forEach(b=>b.onclick=()=>pickPart(cat,b.dataset.v,b));
}
function accIcon(){ const a=W.cfg.acc; return `<svg viewBox="0 0 64 64"><path d="M8 50h48" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>${[[14,22],[27,12],[40,16],[52,26]].map(([x,y])=>`<path d="M${x-7} 50Q${x-7} ${y+10} ${x} ${y}Q${x+7} ${y+10} ${x+7} 50Z" fill="${a}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`).join('')}</svg>`; }
function patIcon(k,faint){
  const c=W.cfg.main, pc=W.cfg.pat==='keins'?mixC(c,INK,.4):W.cfg.pc;
  const inner=k==='streifen'?[18,30,42].map(x=>`<path d="M${x} 13q-4 19 0 38" stroke="${pc}" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')
    :k==='punkte'?[[22,24,6],[40,22,5],[30,40,7],[45,40,4],[18,42,4]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${pc}"/>`).join(''):'';
  return `<svg viewBox="0 0 64 64"><defs><clipPath id="wsc${k}"><circle cx="32" cy="32" r="24"/></clipPath></defs><circle cx="32" cy="32" r="24" fill="${c}"/><g clip-path="url(#wsc${k})" opacity="${faint?.35:1}">${inner}</g><circle cx="32" cy="32" r="24" fill="none" stroke="${INK}" stroke-width="3"/></svg>`;
}
function pickPart(cat,v,btn){
  if(W.step>=0){
    const T=WS_TPL[W.tpl]; if(W.off&&W.off.includes(v)) return;
    if(v!==T.cfg[cat]){ W.miss++; W.stepMiss=1; W.off=(W.off||[]).concat(v); btn.classList.add('off'); GK.no(btn,`Hm, noch nicht. ${T.hint[cat]} Schau auf den Bauplan!`); GK.pulse(root.querySelector('.ws-plan')); return; }
    GK.ok(btn); W.cfg[cat]=v; rebuild(cat); DW.sfx('pop'); W.anim.bounce=.8;
    W.step++; W.stepOpts=null; W.off=null; W.stepMiss=0;
    if(W.step>=4){ W.step=-1; W.cat='paint'; W.cfg=Object.assign(W.cfg,{}); root.querySelector('.ws-done').hidden=false;
      DW.say(`Genau! ${T.hint[cat]} Fertig gebaut – das ist ${T.der}! ${T.fact} Jetzt darfst du ihn anmalen.`); if(DW.discover) DW.discover(T.animal,true);
      GK.after(700,()=>{W.anim.spin=Math.PI*2;}); }
    else DW.say(`Genau! ${T.hint[cat]} ${stepQ()}`);
    panel(); idle(); return;
  }
  if(W.cfg[cat]===v){ DW.say(WS_PARTS[cat].find(o=>o.k===v).say); return; }
  W.cfg[cat]=v; rebuild(cat); DW.sfx('pop'); W.anim.bounce=.8; W.painted=true;
  DW.say(DW.pick(['Oh, schön!','Toll!','Cool!','Super!'])+' '+WS_PARTS[cat].find(o=>o.k===v).say+'.');
  panel();
}

/* ---------- Vorlagen, Regal, Speichern ---------- */
function templates(){
  const m=DW.modal(`<div class="ws-modal"><h2 class="hand">Vorlagen</h2><div class="ws-mgrid">${Object.keys(WS_TPL).map(k=>`<button class="ws-tpl" data-k="${k}" aria-label="${WS_TPL[k].n}"><img src="${snap(WS_TPL[k].cfg,{w:240,h:170})}" alt=""><b class="hand">${WS_TPL[k].n}</b></button>`).join('')}</div></div>`);
  DW.say('Welche Vorlage möchtest du?');
  DW.$$('.ws-tpl',m).forEach(b=>b.onclick=()=>{ const T=WS_TPL[b.dataset.k]; m.close(); W.cfg=Object.assign({},T.cfg); W.tplLoaded=b.dataset.k; rebuild('body'); W.anim.spin=Math.PI*2; DW.sfx('magic');
    DW.say(`Das ist ${T.der}. ${T.fact}`); panel(); });
}
function shelf(){
  const ms=st().models;
  const m=DW.modal(`<div class="ws-modal"><h2 class="hand">Dein Regal</h2>
    <div class="ws-shelf big">${[...Array(6)].map((_,i)=>ms[i]?`<button class="ws-sm" data-i="${i}" aria-label="${ms[i].n}"><img src="${snap(ms[i],{w:200,h:140})}" alt=""><small>${ms[i].n}</small></button>`:`<span class="ws-sm empty"></span>`).join('')}</div></div>`);
  DW.say(ms.length?'Das sind deine Modelle. Tippe auf eins, dann kannst du es ansehen und ändern.':'Dein Regal ist noch leer. Bau einen Dino und tippe auf den Haken!');
  DW.$$('.ws-sm[data-i]',m).forEach(b=>b.onclick=()=>{ const d=ms[+b.dataset.i]; m.close(); if(W.step>=0) return DW.say(d.n);
    W.cfg=Object.assign({},d); delete W.cfg.n; delete W.cfg.t; rebuild('body'); W.anim.spin=Math.PI*2; DW.sfx('magic'); DW.say(`Da ist ${d.n}!`); panel(); });
}
function nameOf(cfg){
  const t=Object.entries(WS_TPL).find(([k,T])=>['head','body','tail','back'].every(c=>T.cfg[c]===cfg[c]));
  if(t) return t[1].n;
  const a=WS_NAME.head[cfg.head]||'Dino', b=WS_NAME.back[cfg.back]||''; let n=a+b+'saurus'; if(!b) n=a.replace(/i$/,'o')+'saurus'; return n;
}
function save(){
  if(!W||W.saving) return; W.saving=true; GK.idle.stop();
  const s=st(), T0=W.tpl&&WS_TPL[W.tpl], n=T0&&['head','body','tail','back'].every(c=>T0.cfg[c]===W.cfg[c])?T0.n:nameOf(W.cfg), rec=Object.assign({},W.cfg,{n,t:Date.now()});
  s.models.push(rec); while(s.models.length>6) s.models.shift(); DW.save();
  W.anim.spin=Math.PI*2; W.anim.hop=1; DW.sfx('magic'); DW.confetti&&DW.confetti();
  const tplName=Object.values(WS_TPL).find(T=>T.n===n);
  DW.say(tplName?`Toll! ${tplName.der[0].toUpperCase()+tplName.der.slice(1)} steht jetzt in deinem Regal!`:`Hurra! Das ist dein ${n}! Er steht jetzt in deinem Regal.`);
  const stars=W.tpl?(W.miss<=1?3:W.miss<=3?2:2):3;
  GK.after(1700,()=>{ const ms=st().models;
    GK.finish(root,{id:ID,stars,title:n,
      art:`<div class="ws-endart"><img src="${snap(rec,{w:320,h:220,yaw:-.45})}" alt=""></div>`,
      extra:`<div class="ws-shelf">${ms.map(m=>`<img src="${snap(m,{w:120,h:86})}" alt="" class="${m===rec?'new':''}">`).join('')}</div>`,
      say:'',again:()=>intro()}); });
}
/* Test-Hilfen */
if(window.DW_DEBUG) window.__werkstatt={
  get W(){return W;},
  solve(){ if(!W||W.step<0) return 'nostep'; const T=WS_TPL[W.tpl], c=['body','head','tail','back'][W.step]; const b=root.querySelector(`.ws-opt[data-v="${T.cfg[c]}"]`); b.click(); return c; },
  wrong(){ const T=WS_TPL[W.tpl], c=['body','head','tail','back'][W.step]; const b=DW.$$('.ws-opt',root).find(x=>x.dataset.v!==T.cfg[c]); b&&b.click(); },
  spin(a){ W.view.yaw+=a; W.dirty=true; }, save, tapCenter(){ const r=W.cv; tapModel(r.width/2,r.height*.45); }
};
DW.stations[ID]={title:'Modell-Werkstatt',mount,unmount(){ if(W&&W.ro) W.ro.disconnect(); W=null; }};
})();
