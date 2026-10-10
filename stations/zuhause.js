/* =====================================================================================================
   DINO-INSELWELT · Station „Mein Forscherhaus“ (zuhause)
   Ein ganzes Haus zum Einrichten: Haus-Übersicht (aufgeschnittenes Puppenhaus) → 15 Zimmer.
   In jedem Zimmer: gezeichnete Einrichtung, antippbare Dinge (Ton + kurzer Satz), viele Plätze
   (Rahmen, Regale, Boden), auf die Sachen aus der Truhe gezogen oder getippt werden.

   RÄUME (ID · Name)
     Wohnräume:   flur Flur · wohn Wohnzimmer · kueche Küche · schlaf Schlafzimmer · bad Badezimmer ·
                  arbeit Arbeitszimmer (früheres Einzelzimmer: Schreibtisch, Messlatte, Pip, Auftragsbuch, Wetter-Fenster) ·
                  dach Dachboden · keller Keller · garten Garten
     Themenräume: stern Sternwarte · meer Urzeit-Meerzimmer · vulkan Vulkan-Labor · fossil Fossilien-Galerie ·
                  eis Eiszeit-Zimmer · dschungel Dschungel-Gewächshaus

   SPIELSTAND   DW.state.home = { v:2, deco:{…Pips Geschenke}, rooms:{ <raum>:{ spots:{ <platz>: <schlüssel> } } }, spots → rooms.arbeit.spots }
                Schlüssel: deco:<id> · animal:<id> · find:<id> · sticker:<id> · card:<nr> · photo:<id> · model:<t> · skel:<ort>
                Alte Spielstände (home.spots) landen verlustfrei im Arbeitszimmer (siehe js/quest.js HS()).

   EIGENE BILDER (später ersetzbar, über js/assets.js · Ordner grafiken-neu/)
     Jedes Zimmer hat EINE Hintergrund-Ebene. Liegt ein Bild vor, wird es statt der Zeichnung gezeigt; Plätze und
     antippbare Dinge bleiben an denselben Prozent-Positionen (Tabelle unten).
       stationen/haus_<raum>          quer  16:10  (empfohlen 1920×1200 px)   – Desktop / Tablet quer
       stationen/haus_<raum>_hoch     hoch   3:4   (empfohlen 1350×1800 px)   – Handy / Tablet hoch
       stationen/haus_uebersicht      quer  16:10  (1920×1200) · stationen/haus_uebersicht_hoch  hoch 3:4 (1350×1800)
     Gibt es nur eine der beiden Ausrichtungen, wird diese in beiden Lagen benutzt (das Zimmer wird dann kleiner eingepasst).
     Im Bild die Plätze frei lassen (leere Rahmen, leere Regalfächer, freie Bodenstellen) – die Sachen des Kindes liegen darüber.
     Kleine bewegte Figuren (optional, quadratisch 256×256, transparent):  objekte/haus_<name>
       ente · schaukel · spinne · trommel · maus · vogel · schaukelbrett · kuckuck · rakete · planeten · falter · frosch · hase
     Zimmer-Symbole (optional, 128×128): symbole/zh_sofa, zh_tisch, zh_tuer, zh_bett, zh_wanne, zh_topf, zh_fass, zh_dach,
       zh_stern, zh_meer, zh_vulkan, zh_fossil, zh_eis, zh_dschungel

   LAYOUT       Das Zimmer hat ein festes Seitenverhältnis (quer 16:10 = 160×100 Einheiten, hoch 3:4 = 90×120 Einheiten) und
                feste Pixelmaße, die nur bei Größenänderung neu berechnet werden – beim Ziehen, Blättern und Kategoriewechsel
                bewegt sich nichts. Eigene Zustandsklasse beim Ziehen: .zh-dragon (nie „dragging“).

   PLATZ-KOORDINATEN in Prozent des Zimmerbildes (x0 y0 x1 y1 = links oben rechts unten), je Platz „quer / hoch“.
   Art: F Rahmen (Bild hängt mittig) · R Regal/Möbel (Sache steht unten auf) · B Boden · W Wasser (schwimmt)
   flur (11 Plätze)
     h1 R 31 10 41 24 / 52 10 70 21      h2 R 41 10 51 24 / 70 10 88 21      b1 R 33 46 41 59 / 62 71 77 82      b2 R 41 46 50 59 / 77 71 92 82
     f1 F 70 13 77 26 / 5 14 17 25       f2 F 81 5 88 18 / 23 9 35 20        t1 R 69 52 76 65 / 52 60 63 70      t2 R 76 46 83 59 / 63 55 74 65
     t3 R 83 39 89 52 / 74 50 85 60      g1 B 26 74 39 97 / 16 80 37 97      g2 B 58 74 70 97 / 38 83 57 98
   wohn (14 Plätze)
     a1 R 7 56 15 69 / 20 38 33 49       a2 R 15 56 23 69 / 33 38 47 49      f1 F 37 16 43 29 / 46 8 58 19       f2 F 47 12 55 27 / 63 5 77 17
     f3 F 58 16 65 29 / 83 8 95 19       s1 R 41 43 52 58 / 10 55 26 65      s2 R 53 43 64 58 / 27 55 43 65      f4 F 82 12 89 25 / 67 26 79 37
     k1 R 74 29 86 43 / 54 39 74 50      k2 R 86 29 97 43 / 74 39 94 50      t1 R 45 64 53 77 / 20 68 33 79      t2 R 53 64 60 77 / 33 68 47 79
     g1 B 13 73 26 97 / 72 76 97 93      g2 B 81 74 94 97 / 51 81 71 98
   kueche (12 Plätze)
     k1 R 4 13 14 26 / 3 26 21 37        c1 R 31 31 39 44 / 46 41 60 52      c2 R 39 31 46 44 / 60 41 73 52      a1 R 42 13 49 26 / 53 19 66 29
     a2 R 50 13 58 26 / 68 19 81 29      a3 R 58 13 66 26 / 83 19 96 29      f1 F 70 28 77 41 / 4 9 16 20        t1 R 70 45 78 58 / 22 68 36 79
     t2 R 78 45 85 58 / 36 68 49 79      t3 R 85 45 93 58 / 49 68 62 79      g1 B 18 74 30 97 / 1 79 19 96       g2 B 49 74 61 97 / 71 78 96 96
   schlaf (13 Plätze)
     f1 F 5 17 12 30 / 43 33 55 43       f2 F 15 13 22 26 / 8 38 20 48       n1 R 5 45 13 58 / 4 66 18 77        a1 R 25 20 33 33 / 50 11 63 22
     a2 R 33 20 40 33 / 63 11 77 22      a3 R 40 20 48 33 / 77 11 90 22      b1 R 28 43 38 57 / 25 53 42 63      b2 R 38 43 48 57 / 42 53 58 63
     k1 R 56 46 69 59 / 33 68 56 79      s1 R 79 7 88 20 / 69 26 83 36       s2 R 88 7 97 20 / 83 26 97 36       g1 B 14 74 26 97 / 69 77 91 94
     g2 B 69 74 81 97 / 15 89 34 99
   bad (11 Plätze)
     h1 R 3 54 12 67 / 6 72 21 84        w1 R 14 23 22 36 / 8 35 21 46       w2 R 22 23 29 36 / 21 35 34 46      w3 R 29 23 37 36 / 34 35 48 46
     f1 F 63 11 70 24 / 41 11 53 22      a1 R 88 26 95 39 / 64 7 77 18       a2 R 80 40 87 54 / 79 7 92 18       a3 R 80 55 87 69 / 64 19 77 31
     a4 R 88 55 95 69 / 79 19 92 31      g1 B 13 76 25 98 / 32 78 53 96      g2 B 64 74 76 97 / 58 78 79 96
   arbeit (19 Plätze)
     d1 R 11 35 19 48 / 28 49 41 58      f1 F 38 14 45 27 / 46 7 58 17       f2 F 48 10 56 25 / 63 3 77 16       f3 F 59 14 66 27 / 83 7 95 17
     a1 R 37 35 44 48 / 42 23 56 33      a2 R 44 35 52 48 / 56 23 69 33      a3 R 52 35 59 48 / 69 23 82 33      a4 R 59 35 67 48 / 82 23 96 33
     c1 R 40 57 47 69 / 53 49 65 60      c2 R 57 57 64 69 / 53 61 65 73      b1 R 80 26 88 39 / 70 40 82 50      b2 R 89 26 96 39 / 83 40 95 50
     b3 R 80 41 88 54 / 70 51 82 61      b4 R 89 41 96 54 / 83 51 95 61      b5 R 80 56 88 69 / 70 62 82 73      b6 R 89 56 96 69 / 83 62 95 73
     g1 B 48 74 60 96 / 48 78 68 94      g2 B 62 74 73 96 / 70 78 90 94      g3 B 78 74 93 97 / 2 80 20 96
   dach (12 Plätze)
     f1 F 24 19 30 32 / 14 32 26 42      f2 F 33 22 40 35 / 74 32 86 42      a1 R 60 27 68 40 / 30 34 43 45      a2 R 68 27 75 40 / 43 34 57 45
     a3 R 75 27 83 40 / 57 34 70 45      u1 R 7 42 15 55 / 5 50 20 61        u2 R 15 42 23 55 / 20 50 35 61      k1 R 27 37 38 50 / 42 46 60 57
     c1 R 64 45 76 58 / 72 52 92 63      g1 B 11 75 24 97 / 33 79 53 96      g2 B 69 75 81 97 / 54 79 74 96      g3 B 85 77 98 98 / 76 79 96 96
   stern (14 Plätze)
     f1 F 13 17 20 30 / 83 23 95 34      f2 F 23 20 30 33 / 6 32 18 42       k1 R 15 41 23 54 / 85 51 97 61      k2 R 7 56 15 69 / 71 62 83 73
     k3 R 15 56 23 69 / 85 62 97 73      s1 R 54 50 64 65 / 40 56 57 68      a1 R 67 56 75 69 / 30 45 43 56      a2 R 76 56 83 69 / 43 45 57 56
     a3 R 84 56 92 69 / 57 45 70 56      t1 R 44 65 51 78 / 11 73 24 84      t2 R 51 65 59 78 / 24 73 38 84      g1 B 11 75 24 97 / 42 83 60 98
     g2 B 73 75 85 97 / 61 83 79 98      g3 B 86 76 99 98 / 80 83 98 98
   keller (11 Plätze)
     r1 R 23 26 31 39 / 3 40 15 50       r2 R 7 40 14 54 / 17 40 29 50       r3 R 23 40 31 54 / 3 51 15 61       r4 R 15 55 23 69 / 17 51 29 61
     w1 R 43 35 51 48 / 67 47 81 57      w2 R 52 35 60 48 / 81 47 95 57      m1 R 67 32 80 46 / 33 42 56 53      f1 R 86 37 97 51 / 77 65 96 77
     x1 R 30 67 43 80 / 6 71 29 82       g1 B 51 75 64 97 / 32 81 52 98      g2 B 76 75 89 97 / 53 81 73 98
   meer (17 Plätze)
     f1 F 18 15 25 28 / 35 18 47 29      f2 F 28 12 35 25 / 53 18 65 29      f3 F 62 14 68 27 / 7 30 19 41       a1 R 39 29 46 42 / 42 32 56 43
     a2 R 46 29 54 42 / 56 32 69 43      a3 R 54 29 61 42 / 69 32 82 43      q1 W 9 42 19 56 / 4 49 21 61        q2 W 19 42 29 56 / 22 49 39 61
     m1 R 46 51 55 64 / 57 59 72 69      k1 R 64 42 73 55 / 6 67 21 78       k2 R 73 42 81 55 / 21 67 36 78      b1 R 88 29 97 43 / 83 43 97 53
     b2 R 88 44 97 57 / 83 54 97 63      b3 R 88 58 97 71 / 83 64 97 74      g1 B 28 75 40 97 / 46 80 65 97      g2 B 59 75 71 97 / 65 80 84 97
     g3 B 81 75 94 97 / 85 79 99 95
   vulkan (16 Plätze)
     f1 F 54 16 61 29 / 5 30 17 41       a1 R 63 21 70 34 / 53 34 67 45      a2 R 70 21 78 34 / 67 34 80 45      a3 R 78 21 85 34 / 80 34 93 45
     f2 F 90 16 97 29 / 23 30 35 41      r1 R 5 41 13 54 / 4 49 17 60        r2 R 22 41 30 54 / 19 49 32 60      r3 R 14 56 21 69 / 4 61 17 72
     r4 R 22 56 30 69 / 19 61 32 72      l1 R 74 35 82 48 / 78 50 89 59      l2 R 82 35 89 48 / 89 50 99 59      d1 R 91 45 99 58 / 3 71 19 82
     x1 R 21 69 34 82 / 25 74 46 84      g1 B 41 75 54 97 / 47 83 64 98      g2 B 58 75 70 97 / 66 83 82 98      g3 B 74 75 86 97 / 84 83 99 98
   fossil (16 Plätze)
     f1 F 10 14 17 27 / 6 11 18 22       f2 F 20 17 27 30 / 6 29 18 40       f3 F 86 15 94 30 / 81 10 95 22      a1 R 39 33 46 46 / 30 29 43 40
     a2 R 46 33 54 46 / 43 29 57 40      a3 R 54 33 61 46 / 57 29 70 40      v1 R 11 46 19 59 / 4 53 19 64       v2 R 19 46 27 59 / 19 53 33 64
     s1 R 34 45 43 58 / 2 73 18 84       t1 R 46 45 54 58 / 42 52 58 63      u1 R 57 45 66 58 / 82 73 98 84      w1 R 73 46 81 59 / 67 53 81 64
     w2 R 81 46 89 59 / 81 53 96 64      g1 B 30 76 43 98 / 21 83 39 98      g2 B 58 76 70 98 / 41 84 59 99      g3 B 78 75 92 97 / 61 83 79 98
   eis (16 Plätze)
     f1 F 10 21 17 34 / 7 23 19 33       f2 F 85 21 92 34 / 81 23 93 33      a1 R 39 32 46 45 / 30 31 43 41      a2 R 46 32 54 45 / 43 31 57 41
     a3 R 54 32 61 45 / 57 31 70 41      r1 R 8 42 16 56 / 4 50 17 61        r2 R 17 42 24 56 / 19 50 32 61      r3 R 8 57 16 71 / 4 62 17 74
     r4 R 17 57 24 71 / 19 62 32 74      x1 R 73 46 82 60 / 79 53 96 65      y1 R 84 48 93 62 / 79 71 96 82      s1 R 16 74 23 87 / 8 75 21 86
     s2 R 23 74 31 87 / 21 75 34 86      g1 B 2 76 13 97 / 24 86 43 99       g2 B 63 75 75 97 / 46 87 65 99      g3 B 77 76 91 98 / 68 84 87 99
   dschungel (18 Plätze)
     f1 F 28 20 35 33 / 6 28 18 38       a1 R 39 20 46 33 / 30 17 43 28      a2 R 46 20 54 33 / 43 17 57 28      a3 R 54 20 61 33 / 57 17 70 28
     f2 F 65 20 72 33 / 82 28 94 38      t1 R 19 37 27 50 / 23 46 37 57      t2 R 27 37 35 50 / 37 46 51 57      t3 R 35 37 43 50 / 51 46 66 57
     k1 R 55 41 62 54 / 71 51 83 61      k2 R 63 41 70 54 / 84 51 96 61      k3 R 55 56 62 69 / 71 62 83 73      k4 R 63 56 70 69 / 84 62 96 73
     s1 R 3 75 13 89 / 2 73 20 84        e1 W 20 81 30 96 / 29 85 45 97      m1 R 45 74 53 87 / 62 75 75 85      m2 R 53 74 61 87 / 75 75 88 85
     g1 B 69 78 81 99 / 57 86 74 100     g2 B 84 78 96 99 / 78 86 97 100
   garten (10 Plätze)
     z1 R 40 48 48 61 / 49 55 64 66      z2 R 48 48 57 61 / 64 55 78 66      z3 R 57 48 65 61 / 78 55 93 66      t1 R 73 58 82 72 / 60 72 73 83
     t2 R 83 58 92 72 / 73 72 87 83      s1 R 2 73 11 86 / 43 67 59 79       k1 B 24 74 35 96 / 16 81 33 97      k2 B 35 74 46 96 / 33 81 50 97
     e1 W 55 81 65 96 / 64 85 82 98      g1 B 85 78 98 99 / 0 75 15 90
   ===================================================================================================== */
(function(){
"use strict";
const ID='zuhause';
const Q=()=>window.QUEST;
const U={L:[160,100],P:[90,120]};           /* Zeichen-Einheiten je Layout (quer 16:10, hoch 3:4) */
const AR={L:1.6,P:.75};
const FLOOR={L:71,P:89};                    /* Bodenlinie (Einheiten von oben) */

/* =====================================================================
   1 · Zeichen-Werkzeug (alles selbst gezeichnet, Aquarell-Töne)
   ===================================================================== */
const C={paper:'#fbf3e0',cream:'#f6ead0',ink:'#3d3226',w0:'#ecd0a4',w1:'#d9ae80',w2:'#b8845a',w3:'#8a5a3a',w4:'#6e4a30',terra:'#c8553d',sun:'#f0c35a',
  moss:'#7fa66a',leaf:'#5f8f55',dleaf:'#4a7648',sea:'#8fbccb',dsea:'#5f97ad',plum:'#b58cbd',rose:'#e8a9a0',sky:'#b6d8e4',stone:'#b9ae9c',dstone:'#8f8676',
  white:'#fffaf0',gold:'#e0b860',metal:'#aeb9bd',dmetal:'#7d8a90',glass:'#d6ecf0',brick:'#c98a6a',sand:'#e8d3a2'};
const f2=v=>Math.round(v*100)/100;
const sh=(c,f)=>ART.shade(c,f), mx=(a,b,u)=>ART.mix(a,b,u);
const NO='stroke="none"';
/* weiche Kontur in dunklerer Eigenfarbe (wie Aquarell, das am Rand zusammenläuft) */
const ol=(c,w=.32,o=.8)=>`stroke="${sh(c,.6)}" stroke-width="${w}" stroke-opacity="${o}" stroke-linejoin="round" stroke-linecap="round"`;
const ex=(c,e)=>e==null?(c[0]==='#'?ol(c):NO):e;
const rc=(x,y,w,h,c,r=.6,e)=>`<rect x="${f2(x)}" y="${f2(y)}" width="${f2(w)}" height="${f2(h)}" rx="${r}" fill="${c}" ${ex(c,e)}/>`;
const pa=(d,c,e)=>`<path d="${d}" fill="${c}" ${ex(c,e)}/>`;
const ci=(x,y,r,c,e)=>`<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${c}" ${ex(c,e)}/>`;
const el=(x,y,rx,ry,c,e)=>`<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${c}" ${ex(c,e)}/>`;
const ln=(d,c,w=.4,o=1,e='')=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-opacity="${o}" stroke-linecap="round" stroke-linejoin="round" ${e}/>`;
const gr=(inner,tf)=>`<g transform="${tf}">${inner}</g>`;
const op=(inner,o)=>`<g opacity="${o}">${inner}</g>`;
/* weicher Schatten am Boden */
const shadow=(cx,y,rx,ry=1.2,o=.16)=>el(cx,y,rx,ry,'#3c2814',`${NO} opacity="${o}"`);
/* Glanzlicht */
const hi=(d,w=.5,o=.55)=>ln(d,'#ffffff',w,o);

let GID=0, DEFS='';
const gid=()=>'zh'+(++GID);
function grad(stops,x2=0,y2=1){const id=gid();DEFS+=`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a!=null?` stop-opacity="${a}"`:''}/>`).join('')}</linearGradient>`;return `url(#${id})`;}
function rgrad(stops,cx=.5,cy=.5,r=.5){const id=gid();DEFS+=`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a!=null?` stop-opacity="${a}"`:''}/>`).join('')}</radialGradient>`;return `url(#${id})`;}
function clip(shape){const id=gid();DEFS+=`<clipPath id="${id}">${shape}</clipPath>`;return `clip-path="url(#${id})"`;}
function pattern(w,h,body,tf){const id=gid();DEFS+=`<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse"${tf?` patternTransform="${tf}"`:''}>${body}</pattern>`;return `url(#${id})`;}
/* fester Zufall, damit jede Zeichnung bei jedem Aufbau gleich aussieht */
function rng(seed){let s=seed%2147483646+1;return()=>{s=(s*16807)%2147483647;return s/2147483647;};}

/* ---------- Himmel (Tageszeit + Wetter wie auf der Karte) ---------- */
let ENVV={night:false,warm:false,weather:'sonne',season:'',sig:'0'};
function readEnv(){const E=(window.WORLD&&WORLD.env)?WORLD.env():{dark:0,warm:0,weather:'sonne',season:null};
  const night=E.dark>.55, warm=!night&&E.warm>.3;
  ENVV={night,warm,weather:E.weather||'sonne',season:E.season||'',sig:(night?'n':warm?'w':'t')+(E.weather||'sonne')+(E.season||'')};return ENVV;}
const leafCols=()=>({herbst:['#d9893a','#c8653a','#e0b040'],fruehling:['#8fbf6a','#f6c9d4','#a5cf85'],winter:['#f4f7f5','#e3ecee','#f4f7f5']}[ENVV.season]||['#6f9a5a','#7fa66a','#8fbf7a']);
const grassCol=()=>ENVV.season==='winter'?'#e9f0f1':ENVV.night?'#4d6e58':ENVV.season==='herbst'?'#a8b56c':'#9fc37c';
/* Inhalt eines Himmels (Standard 40×40); o.night erzwingt Nacht, o.bare ohne Hügel und Baum */
function skyInner(o={},W=40,H=40){
  const E=o.night?{night:true,warm:false,weather:'sonne',season:ENVV.season}:ENVV,u=Math.min(W,H)/40,X=v=>v/40*W,Y=v=>v/40*H;
  const wet=E.weather==='regen'||E.weather==='wolken'||E.weather==='schnee';
  const col=E.night?['#232f5a','#4a5b90']:E.warm?['#f0a07c','#f8d9a6']:wet?['#a6bac7','#dfe7e7']:['#9ccde1','#e8f4ef'];
  let s=rc(0,0,W,H,grad([[0,col[0]],[1,col[1]]]),0,NO);
  if(E.night){s+=ci(X(29),Y(10),4*u,'#fbf1c8',NO)+ci(X(29)+1.8*u,Y(10)-1.2*u,3.5*u,col[0],NO);
    [[6,6],[14,13],[22,5],[10,20],[34,20],[4,15],[18,9],[36,5],[26,17],[31,3]].forEach(([x,y],i)=>s+=ci(X(x),Y(y),(i%3?.45:.65)*u,'#fff8d8',NO));}
  else if(E.weather==='sonne')s+=ci(X(30),Y(9),7*u,'#f7dc7a',`${NO} opacity=".3"`)+ci(X(30),Y(9),4.6*u,E.warm?'#f6b25e':'#f5d36a',NO);
  if(wet)s+=`<g opacity=".92">${el(X(12),Y(10),7.5*u,3.2*u,'#fbfbf7',NO)}${el(X(12)+6*u,Y(10)-1.6*u,5.4*u,3.6*u,'#fbfbf7',NO)}${el(X(31),Y(14),6*u,2.6*u,'#fbfbf7',NO)}${W>60?el(X(22),Y(6),6*u,2.4*u,'#fbfbf7',NO):''}</g>`;
  else if(!E.night)s+=op(el(X(10),Y(12),5.5*u,2.2*u,'#ffffff',NO)+el(X(10)+4*u,Y(12)-1.2*u,4*u,2.4*u,'#ffffff',NO)+(W>60?el(X(21),Y(7),4.6*u,1.8*u,'#ffffff',NO):''),.75);
  const nP=Math.round(10*W/H);
  if(E.weather==='regen')for(let i=0;i<nP;i++)s+=ln(`M${f2(W*(i+.4)/nP)} ${f2(Y(15+(i%3)*6))}l${f2(-1.2*u)} ${f2(3.4*u)}`,'#eef4f8',.5*u,.9);
  if(E.weather==='schnee'||(E.season==='winter'&&!E.night))for(let i=0;i<nP+2;i++)s+=ci(W*((i*.37)%1),Y(13+(i*7)%22),.7*u,'#ffffff',NO);
  if(!o.bare){const g=E.season==='winter'?'#eef3f5':E.night?'#3e5a4a':'#9fbf7a',lf=leafCols();
    s+=pa('M0 34Q10 29 22 32T40 30V40H0z',sh(g,.9),NO)+pa('M0 36Q14 32 26 35T40 34V40H0z',g,NO);
    s+=ln('M5 38Q6 30 7.5 25','#7a5a3c',1.5)+[[7,23,5],[11.5,26,4],[3.5,27,3.8],[9,19.5,3.6]].map(([x,y,r],i)=>ci(x,y,r,lf[i%3],NO)).join('');}
  return s;}
const skyBox=(x,y,w,h,o)=>`<svg x="${f2(x)}" y="${f2(y)}" width="${f2(w)}" height="${f2(h)}" viewBox="0 0 40 40" preserveAspectRatio="xMidYMid slice">${skyInner(o)}</svg>`;

/* Blatt-/Wedel-Form: von (x,y) im Winkel a (Grad, 0 = nach oben) mit Länge l und Breite b, leicht gebogen (k) */
function leafD(x,y,a,l,b,k=.25){const r=a*Math.PI/180,dx=Math.sin(r),dy=-Math.cos(r),nx=dy,ny=-dx,tx=x+dx*l+nx*l*k,ty=y+dy*l+ny*l*k,
  mx1=x+dx*l*.5+nx*(l*k*.4+b),my1=y+dy*l*.5+ny*(l*k*.4+b),mx2=x+dx*l*.5+nx*(l*k*.4-b),my2=y+dy*l*.5+ny*(l*k*.4-b);
  return `M${f2(x)} ${f2(y)}Q${f2(mx1)} ${f2(my1)} ${f2(tx)} ${f2(ty)}Q${f2(mx2)} ${f2(my2)} ${f2(x)} ${f2(y)}z`;}
const leaf=(x,y,a,l,b,c,k)=>pa(leafD(x,y,a,l,b,k),c,ol(c,.25,.7));
/* Farnwedel: Mittelrippe mit Fiederblättchen */
function frond(x,y,a,l,c,k=.3,n=7){const r=a*Math.PI/180,dx=Math.sin(r),dy=-Math.cos(r),nx=dy,ny=-dx;let s='',px=x,py=y,d=`M${f2(x)} ${f2(y)}`;
  for(let i=1;i<=n;i++){const t=i/n,cx=x+dx*l*t+nx*l*k*t*t,cy=y+dy*l*t+ny*l*k*t*t,ang=a+Math.atan2(k*2*t,1)*-57.3*(k>0?1:1),sz=l*.2*(1-t*.75);
    const tang=Math.atan2(cx-px,-(cy-py))*57.3; s+=leaf(cx,cy,tang+68,sz,sz*.28,c,.1)+leaf(cx,cy,tang-68,sz,sz*.28,c,-.1); d+=`L${f2(cx)} ${f2(cy)}`; px=cx;py=cy;}
  return ln(d,sh(c,.75),.45,.9)+s;}

/* =====================================================================
   2 · Möbel-Bibliothek
   Jedes Möbel: F.name(o) → {w,h,svg,spots,hots} in eigenen Einheiten (links oben = 0,0).
   spots: [Zusatz-ID, Art, x0,y0,x1,y1] · hots: {t:Art, r:[x0,y0,x1,y1], id, …}
   Im Zimmer steht es als [name, Mitte-x, Unterkante-y, Maßstab, Optionen].
   ===================================================================== */
const F={};
const PC=(w,h,svg,spots,hots)=>({w,h,svg,spots:spots||[],hots:hots||[]});

/* freier Platz ohne Möbel (Boden, Fensterbank …) */
F.spot=o=>PC(o.w||18,o.h||24,'',[['',o.k||'floor',0,0,o.w||18,o.h||24]]);

/* Fenster · o.c Vorhangfarbe (0 = ohne) · o.s 'rund' | 'tief' | 'bogen' · o.sea Blick ins Meer · o.night immer Nacht */
F.win=o=>{const fc=o.f||C.white,c=o.c;
  if(o.s==='rund'){const rim=o.f||C.gold;let s=ci(11,11,11,rim)+ci(11,11,8.6,sh(rim,.75),NO);
    s+=`<g ${clip('<circle cx="11" cy="11" r="8.2"/>')}>${o.sea?seaView(2.8,2.8,16.4,16.4):skyBox(2.8,2.8,16.4,16.4,o)}</g>`;
    if(!o.sea)s+=ln('M11 2.8v16.4M2.8 11h16.4',rim,.9); else for(let i=0;i<8;i++){const a=i*Math.PI/4;s+=ci(11+Math.cos(a)*9.8,11+Math.sin(a)*9.8,.55,sh(rim,.7),NO);}
    s+=hi('M5.2 9.5q1.2-3.4 4.4-4.4',.6,.5);
    return PC(22,22,s,[],o.hot?[{t:'weather',r:[0,0,22,22]}]:[]);}
  if(o.s==='tief'){let s=rc(0,0,24,13,fc,.8)+skyBox(1.4,1.4,21.2,10.2,o)+ln('M8.4 1.4v10.2M15.6 1.4v10.2',fc,.9)+hi('M3 8l3-4.6',.5,.4);
    return PC(24,13,s);}
  let s=shadow(14,31.4,13,.9,.1);
  s+=rc(3,3.5,22,25.6,fc,1)+skyBox(4.6,5.1,18.8,22.4,o)+ln('M14 5.1v22.4M4.6 15.4h18.8',fc,1.1)+ln('M14 5.1v22.4M4.6 15.4h18.8',sh(fc,.7),.2,.5);
  s+=hi('M6.4 12.5l4.2-6M6.8 16.2l2-2.9',.6,.4);
  if(o.pot)s+=pa('M17.6 25.4h4.4l-.6 3.4h-3.2z',C.terra)+leaf(19.8,25.4,-25,4.5,1,C.leaf)+leaf(19.8,25.4,20,5,1,C.moss)+ci(19.4,20.4,1,C.rose)+ci(21,21.4,.9,C.sun);
  s+=rc(1.6,28.8,24.8,2,o.sill||C.w1,.8);
  if(c){const cur=pa('M-.6 1.9h10q.4 9.6-3.6 14T.6 31.6H-.6z',c)+ln('M2.2 2.4q.6 12-1.4 26M5.4 2.4q.2 9-2.8 14',sh(c,.72),.3,.7)+pa('M-.6 17.6q3 .6 5.2-2.2l1.2 1.4q-2.6 3.2-6.4 2.8z',sh(c,1.25));
    s+=cur+gr(cur,'translate(28 0) scale(-1 1)');
    s+=rc(-1.8,.6,31.6,1.1,C.w3,.55)+ci(-1.8,1.15,1,C.w3)+ci(29.8,1.15,1,C.w3);}
  return PC(28,32,s,[],o.hot?[{t:'weather',r:[3,3.5,25,29]}]:[]);};
/* Blick ins Urzeit-Meer (Bullauge) */
function seaView(x,y,w,h){let s=rc(0,0,40,40,grad([[0,'#7fc4d4'],[1,'#2f6f8c']]),0,NO);
  s+=pa('M0 34Q10 30 20 33T40 31V40H0z','#d9c79a',NO)+ln('M6 36q-2-7 1-12M9 36q2-6 0-10','#5f9a6a',1.1,.9)+ln('M33 34q1-6-1-10','#5f9a6a',1,.9);
  s+=pa('M22 14q5-4 10 0-5 4-10 0zM32 14l3.4-2.6v5.2z','#f2c56a',NO)+ci(24.4,13.6,.6,'#3d3226',NO);
  s+=pa('M8 22q3-2.4 6 0-3 2.4-6 0zM14 22l2-1.6v3.2z','#e8a9a0',NO);
  [[30,26,1],[31.5,22,.7],[29,19,.5],[12,10,.8],[13,6,.5]].forEach(([a,b,r])=>s+=ci(a,b,r,'#ffffff',`${NO} opacity=".55"`));
  return `<svg x="${f2(x)}" y="${f2(y)}" width="${f2(w)}" height="${f2(h)}" viewBox="0 0 40 40" preserveAspectRatio="xMidYMid slice">${s}</svg>`;}

/* Bilderrahmen (Platz) · o.w,o.h Größe · o.s holz | gold | weiss | dunkel | rund */
F.frame=o=>{const W=o.w||13,H=o.h||15,fc={gold:C.gold,weiss:C.white,dunkel:C.w3,gruen:'#8faa7c',blau:'#8fb3c4',rot:'#c9705c'}[o.s]||C.w2;
  let s=ln(`M${W*.28} .4L${W/2} -2L${W*.72} .4`,C.ink,.25,.5)+ci(W/2,-2,.35,C.ink,NO);
  if(o.s==='rund'){s+=el(W/2,H/2,W/2,H/2,C.gold)+el(W/2,H/2,W/2-1.4,H/2-1.4,'#fdf8ec')+el(W/2,H/2,W/2-1.4,H/2-1.4,'none',`stroke="${sh(C.gold,.6)}" stroke-width=".25" stroke-opacity=".7"`);}
  else s+=rc(.3,.5,W,H,'#3c2814',.6,`${NO} opacity=".13"`)+rc(0,0,W,H,fc,.6)+rc(1.5,1.5,W-3,H-3,'#fdf8ec',.25,`stroke="${sh(fc,.55)}" stroke-width=".3" stroke-opacity=".8"`)+hi(`M.8 .9h${W-1.6}`,.3,.45);
  return PC(W,H,s,[['','frame',1.1,1.1,W-1.1,H-1.1]]);};

/* Wandbrett mit n Plätzen */
F.board=o=>{const n=o.n||3,sw=o.sw||12,sH=o.sh||13,W=n*sw+2,c=o.c||C.w2;
  let s=pa(`M2.6 ${sH+1.6}v2.8l3-2.8zM${W-2.6} ${sH+1.6}v2.8l-3-2.8z`,sh(c,.8))+rc(.2,sH+1.75,W,.7,'#3c2814',.3,`${NO} opacity=".14"`)+rc(0,sH,W,1.7,c,.5)+hi(`M.8 ${sH+.45}h${W-1.6}`,.28,.4);
  return PC(W,sH+4.4,s,[...Array(n)].map((_,i)=>[String(i+1),'shelf',1+i*sw,0,1+(i+1)*sw,sH]));};

/* Fächer füllen (Deko, kein Platz): b Bücher · j Gläser · k Korb · g Globus · p Teller · r Steine · f Handtücher · t Töpfe · w Werkzeug */
function cellDeco(t,x,y,w,h,seed){const R=rng(seed*7+3),B=y+h;let s='';
  const cols=['#c8553d','#7fa66a','#d9b36c','#8fbccb','#b58cbd','#e8a9a0','#6f8fa8','#a8724a'];
  if(t==='b'){let px=x+.7;while(px<x+w-2.6){const bw=1.1+R()*1.1,bh=h*(.55+R()*.33),c=cols[Math.floor(R()*cols.length)];s+=rc(px,B-bh,bw,bh,c,.25)+ln(`M${f2(px+.25)} ${f2(B-bh+1.2)}h${f2(bw-.5)}`,'#fff7e0',.22,.7);px+=bw+.12;}
    if(x+w-px>2.2){const c=cols[Math.floor(R()*cols.length)];s+=gr(rc(px+.4,B-h*.6,1.4,h*.6,c,.25),`rotate(14 ${f2(px+1.1)} ${f2(B)})`);}}
  else if(t==='j'){const n=w>10?3:2,jw=(w-1.6)/n;for(let i=0;i<n;i++){const jx=x+.8+i*jw,c=['#c8553d','#e0b040','#8f5a8a','#7fa66a'][Math.floor(R()*4)],jh=h*(.5+R()*.2);
      s+=rc(jx+.3,B-jh,jw-.8,jh,'#e4f0ee',.9,`stroke="#7d8a90" stroke-width=".25" stroke-opacity=".7"`)+rc(jx+.55,B-jh*.68,jw-1.3,jh*.66,c,.7,`${NO} opacity=".8"`)+rc(jx+.1,B-jh-.9,jw-.4,1.1,'#d9b36c',.3)+hi(`M${f2(jx+.9)} ${f2(B-jh+1)}v${f2(jh*.5)}`,.3,.6);}}
  else if(t==='k'){s+=pa(`M${x+1.2} ${B-h*.5}h${w-2.4}l-.9 ${f2(h*.5)}h${-(w-4.2)}z`,'#d9b36c')+ln(`M${x+1.6} ${B-h*.34}h${w-3.2}M${x+1.9} ${B-h*.18}h${w-3.8}`,'#a8824a',.25,.8)+ln(`M${x+2.6} ${B-h*.5}q${f2(w/2-2.6)} ${-h*.42} ${w-5.2} 0`,'#a8824a',.5);}
  else if(t==='g'){const cx=x+w/2,r=Math.min(w,h)*.3;s+=rc(cx-r*.7,B-1,r*1.4,1,C.w3,.3)+ln(`M${cx} ${B-1}v${-r*.4}`,C.w3,.5)+ci(cx,B-1-r*1.35,r,'#8fbccb')+pa(`M${f2(cx-r*.5)} ${f2(B-1-r*1.7)}q${f2(r*.5)}-${f2(r*.3)} ${f2(r*.8)} ${f2(r*.1)}t-${f2(r*.2)} ${f2(r*.6)}q-${f2(r*.6)} ${f2(r*.1)}-${f2(r*.6)}-${f2(r*.7)}z`,'#8fbf7a',NO)+ln(`M${f2(cx-r*1.1)} ${f2(B-1-r*1.9)}A${f2(r*1.25)} ${f2(r*1.25)} 0 0 0 ${f2(cx+r*.6)} ${f2(B-1-r*.3)}`,C.gold,.3);}
  else if(t==='p'){for(let i=0;i<3;i++)s+=el(x+w*.36,B-.5-i*.75,w*.26,.55,i%2?'#dfeaf0':'#fffaf0');s+=rc(x+w*.64,B-h*.36,w*.2,h*.36,'#e8a9a0',.5)+ln(`M${f2(x+w*.84)} ${f2(B-h*.28)}q1.3 .2 0 ${f2(h*.16)}`,'#c8857c',.35);}
  else if(t==='r'){s+=pa(`M${x+1} ${B}l1.4-${f2(h*.3)} 2.4-.6 1.6 ${f2(h*.3+.6)}z`,'#b9ae9c')+pa(`M${f2(x+w*.5)} ${B}l.8-${f2(h*.5)} 1.8-${f2(h*.12)} 1.4 ${f2(h*.2)} .6 ${f2(h*.42)}z`,'#c9a9d6')+hi(`M${f2(x+w*.5+1.2)} ${f2(B-h*.5)}l.9 ${f2(h*.3)}`,.25,.6);}
  else if(t==='f'){['#8fbccb','#fffaf0','#e8a9a0'].forEach((c,i)=>s+=rc(x+1.2,B-(i+1)*h*.2,w-2.4,h*.19,c,.7));}
  else if(t==='t'){s+=rc(x+1,B-h*.42,w*.5,h*.42,'#aeb9bd',.8)+ln(`M${f2(x+1+w*.5)} ${f2(B-h*.3)}h1.6`,'#7d8a90',.5)+rc(x+.6,B-h*.48,w*.5+.8,.9,'#7d8a90',.4)+pa(`M${f2(x+w*.62)} ${B}v-${f2(h*.3)}q${f2(w*.13)}-${f2(h*.18)} ${f2(w*.26)} 0V${B}z`,'#c8553d');}
  else if(t==='w'){s+=rc(x+1,B-h*.3,w-2,h*.3,'#c8553d',.5)+ln(`M${x+w*.3} ${B-h*.3}q${f2(w*.2)}-${f2(h*.3)} ${f2(w*.4)} 0`,'#7d8a90',.5)+rc(x+w*.42,B-h*.2,w*.16,h*.1,'#e9c46a',.2);}
  return s;}
/* Regal/Schrank mit c×r Fächern; o.fill {Fachnummer: Deko} – alle anderen Fächer sind Plätze */
F.kasten=o=>{const c=o.c||2,r=o.r||3,cw=o.cw||12,ch=o.ch||13.5,t=1.4,col=o.col||C.w2,back=o.back||sh(mx(col,'#f6ead0',.55),1),fill=o.fill||{},ft=o.ft==null?1.4:o.ft,W=c*cw+(c+1)*t,H=r*ch+(r+1)*t+ft;
  let s=shadow(W/2,H,W*.52,1,.14)+rc(0,0,W,H-ft,col,.9);const spots=[];let k=0;
  for(let j=0;j<r;j++)for(let i=0;i<c;i++){const x=t+i*(cw+t),y=t+j*(ch+t),idx=j*c+i;
    s+=rc(x,y,cw,ch,back,.3,`stroke="${sh(col,.55)}" stroke-width=".25" stroke-opacity=".7"`)+rc(x,y,cw,1.5,'#3c2814',0,`${NO} opacity=".1"`);
    if(fill[idx])s+=cellDeco(fill[idx],x,y,cw,ch,idx+c*7+r); else spots.push([String(++k),'shelf',x,y,x+cw,y+ch]);}
  if(ft)s+=rc(1,H-ft,2.2,ft,sh(col,.8),.3)+rc(W-3.2,H-ft,2.2,ft,sh(col,.8),.3);
  s+=hi(`M.9 .7h${W-1.8}`,.3,.4);
  return PC(W,H,s,spots);};

/* Sofa (2 Plätze auf der Sitzfläche) */
F.sofa=o=>{const c=o.c||'#8fae8a',c2=sh(c,.86),cl=sh(c,1.18),pc=o.p||C.sun,pc2=o.p2||C.terra;
  let s=shadow(24,24.4,25,1.3)+rc(4.5,22.2,2.4,2,C.w3,.4)+rc(41,22.2,2.4,2,C.w3,.4);
  s+=pa('M5 14V5.4Q5 1 9.4 1h29.2Q43 1 43 5.4V14z',c)+ln('M24 1.6V12',c2,.3,.7);
  s+=rc(5,13.6,38,9.2,c2,1.6)+rc(6.6,11.4,17,5.2,cl,2.2)+rc(24.4,11.4,17,5.2,cl,2.2);
  s+=rc(0,8.4,7.4,14.6,c,3.2)+rc(40.6,8.4,7.4,14.6,c,3.2)+hi('M2 10.6q1.6-1.2 3.4 0M42.6 10.6q1.6-1.2 3.4 0',.4,.35);
  s+=gr(rc(7.6,3.6,8,7.4,pc,1.8)+ln('M9.4 5.6h4.4M9.4 7.4h4.4M9.4 9.2h4.4',sh(pc,.75),.3,.7),'rotate(-10 11.6 7.4)')+gr(rc(32.6,3.8,7.6,7.2,pc2,1.8)+ci(36.4,7.4,1.2,sh(pc2,1.4),NO),'rotate(9 36.4 7.4)');
  return PC(48,24.4,s,[['1','shelf',8,-1.5,23.4,12.2],['2','shelf',24.6,-1.5,40,12.2]]);};
/* Sessel (1 Platz) */
F.sessel=o=>{const c=o.c||'#d98b6a',c2=sh(c,.86),cl=sh(c,1.18);
  let s=shadow(12,24.4,13,1.2)+rc(3.6,22.2,2.2,2,C.w3,.4)+rc(18.2,22.2,2.2,2,C.w3,.4);
  s+=pa('M4 14V5Q4 1 8 1h8q4 0 4 4v9z',c)+rc(4,13.6,16,9.2,c2,1.6)+rc(5.4,11.4,13.2,5.2,cl,2.2)+rc(0,8.4,6,14.6,c,2.8)+rc(18,8.4,6,14.6,c,2.8);
  s+=ln('M9 4.4h6M9 6.6h6',c2,.3,.6);
  return PC(24,24.4,s,[['1','shelf',5,-1.5,19,12.2]]);};
/* Tisch · o.n Plätze · o.w Breite je Platz · o.s rund */
F.tisch=o=>{const n=o.n||2,sw=o.sw||12,W=n*sw+3,c=o.c||C.w2,H=o.h||10,sH=o.sh||13;
  let s=shadow(W/2,H,W*.5,1.1)+rc(2.2,1.6,1.8,H-1.6,sh(c,.78),.4)+rc(W-4,1.6,1.8,H-1.6,sh(c,.78),.4)+rc(2.2,3.4,W-4.4,1.3,sh(c,.86),.3)+rc(0,0,W,2,c,.9)+hi(`M1 .6h${W-2}`,.28,.4);
  if(o.cloth)s+=pa(`M${W*.2} 0h${W*.6}v3.2l-${f2(W*.1)}-1-${f2(W*.1)} 1-${f2(W*.1)}-1-${f2(W*.1)} 1-${f2(W*.1)}-1-${f2(W*.1)} 1z`,o.cloth);
  return PC(W,H,s,[...Array(n)].map((_,i)=>[String(i+1),'shelf',1.5+i*sw,-sH,1.5+(i+1)*sw,.2]));};
/* Hocker / Beistelltisch (1 Platz) */
F.hocker=o=>{const c=o.c||C.w1;let s=shadow(7,11,7,1)+ln('M3 2l-1.4 9M11 2l1.4 9',sh(c,.7),1.1)+ln('M2.4 7h9.2',sh(c,.7),.6)+el(7,1.6,7,1.6,c)+hi('M2.4 1.2q4.6-1 9.2 0',.25,.4);
  return PC(14,11,s,[['1','shelf',0,-12.5,14,1.4]]);};
/* Teppich · o.w,o.h · o.s oval | eck · o.c,o.c2 */
F.rug=o=>{const W=o.w||60,H=o.h||9,c=o.c||C.terra,c2=o.c2||'#e9c79a';let s='';
  if(o.s==='eck'){s+=rc(0,0,W,H,c,1)+rc(2,1.2,W-4,H-2.4,'none',.6,`stroke="${c2}" stroke-width=".8"`)+rc(4.4,2.6,W-8.8,H-5.2,c2,.4,`${NO} opacity=".55"`);
    for(let i=0;i<W;i+=1.6)s+=ln(`M${i+.4} 0v-1M${i+.4} ${H}v1`,c2,.3,.9);}
  else if(o.s==='fell'){s+=pa(`M${W*.1} ${H*.5}q-${W*.12}-${H*.6} ${W*.1}-${H*.42}q${W*.1}-${H*.3} ${W*.3}-${H*.04}q${W*.3}-${H*.2} ${W*.34} ${H*.06}q${W*.2}-${H*.06} ${W*.1} ${H*.42}q${W*.1} ${H*.5}-${W*.12} ${H*.4}q-${W*.2} ${H*.2}-${W*.34} ${H*.04}q-${W*.3} ${H*.1}-${W*.3}-${H*.06}q-${W*.2} ${H*.1}-${W*.08}-${H*.4}z`,c);}
  else {s+=el(W/2,H/2,W/2,H/2,c)+el(W/2,H/2,W*.42,H*.4,c2)+el(W/2,H/2,W*.34,H*.31,sh(c,1.15))+el(W/2,H/2,W*.22,H*.2,c2)+el(W/2,H/2,W*.12,H*.1,c);}
  return PC(W,H,op(s,.88));};
/* Stehlampe (antippbar) */
F.lampe=o=>{const c=o.c||C.sun;let s=shadow(7,44,5,.9)+el(7,43.4,4.4,1,C.w3)+rc(6.5,13,1,30,C.w3,.4)+pa('M1 14L4.4 2.6h5.2L13 14z',c)+ln('M1.6 13h10.8',sh(c,1.3),.5,.8)+ln('M9.6 14v3.4',C.w3,.3)+ci(9.6,17.8,.5,C.gold,NO);
  return PC(14,44,s,[],[{t:'lamp',r:[-3,-2,17,19],g:[7,9,15]}]);};
/* Hängelampe · o.cord Kabellänge */
F.haengelampe=o=>{const c=o.c||C.terra,L=o.cord==null?8:o.cord;let s=ln(`M8 ${-L}V1.4`,C.ink,.3,.7)+pa('M1 9.4Q1.4 1.4 8 1.4t7 8z',c)+el(8,9.4,7,1.3,sh(c,.75))+ci(8,10,1.6,'#fff3c4')+hi('M3.4 6q.8-2.6 3-3.4',.4,.4);
  return PC(16,11.6,s,[],[{t:'lamp',r:[-2,-2,18,14],g:[8,11,15]}]);};
/* Tischlampe */
F.tischlampe=o=>{const c=o.c||C.rose;let s=el(4.5,11.5,2.6,.7,C.w3)+rc(4,6,1,5.4,C.gold,.3)+pa('M.6 6.4L2.6.6h3.8l2 5.8z',c)+ln('M1.2 5.6h6.6',sh(c,1.3),.35,.8);
  return PC(9,12,s,[],[{t:'lamp',r:[-3,-3,12,12],g:[4.5,4,10]}]);};

/* Zimmerpflanze · o.k farn | monstera | palme | kaktus | gummi | blume | schwert · o.pot Topffarbe */
F.pflanze=o=>{const k=o.k||'farn',pc=o.pot||C.terra;let s='',g1=C.leaf,g2=C.moss,g3='#8fbf7a';
  if(k==='farn')[-78,-52,-28,-6,16,40,66].forEach((a,i)=>s+=frond(8,20.6,a,13+((i*5)%4),i%2?g2:g1,a<0?.28:-.28,6));
  else if(k==='monstera'){[[-50,13],[-18,16],[14,15],[46,12]].forEach(([a,l],i)=>{const r=a*Math.PI/180,x=8+Math.sin(r)*l,y=20.6-Math.cos(r)*l;s+=ln(`M8 20.6Q${f2(8+Math.sin(r)*l*.4)} ${f2(20.6-l*.7)} ${f2(x)} ${f2(y)}`,g1,.4);
      s+=pa(`M${f2(x)} ${f2(y)}q-4.4-1-4.6-5.4q3.6-2.6 6.4 0q1.4 3.6-1.8 5.4z`,i%2?g2:g1)+ln(`M${f2(x)} ${f2(y)}l-1-5M${f2(x-3)} ${f2(y-3)}l1.4 .6M${f2(x+1.4)} ${f2(y-3.2)}l-1.6 .4`,sh(g1,.7),.25,.7);});}
  else if(k==='palme')[-80,-58,-36,-14,8,30,52,74].forEach((a,i)=>s+=leaf(8,20.4,a,14+(i%3)*2,1.1,i%2?g2:g1,a<0?.34:-.34));
  else if(k==='kaktus'){s+=rc(5.6,7,4.8,14,g2,2.4)+pa('M5.6 15H3.8q-1.6 0-1.6-1.8V10.6q0-1 1-1t1 1v2.2h1.4zM10.4 13h1.8q1.6 0 1.6-1.8V8.4q0-1-1-1t-1 1V11h-1.4z',g2);
    for(let i=0;i<5;i++)s+=ln(`M8 ${9+i*2.4}h.01M6.6 ${10+i*2.4}h.01M9.4 ${10+i*2.4}h.01`,'#f7f0d8',.4,.9);s+=ci(8,6.6,1.5,C.rose)+ci(8,6.6,.5,C.sun,NO);}
  else if(k==='gummi'){s+=ln('M8 20.6Q7.4 12 8.6 4',sh(g1,.7),.55);[[7.8,17,-62],[8,14.4,58],[7.8,11.6,-56],[8.2,9,52],[8.4,6.4,-40],[8.6,4.4,20]].forEach(([x,y,a],i)=>s+=leaf(x,y,a,6.4,1.9,i%2?g2:g1,.1));}
  else if(k==='blume'){[[-24,11,C.rose],[4,14,C.sun],[30,10,'#c9a9d6']].forEach(([a,l,fc])=>{const r=a*Math.PI/180,x=8+Math.sin(r)*l,y=20.6-Math.cos(r)*l;s+=ln(`M8 20.6L${f2(x)} ${f2(y)}`,g1,.45)+leaf(8+Math.sin(r)*l*.45,20.6-Math.cos(r)*l*.45,a+60,3.4,.9,g2);
      for(let i=0;i<5;i++){const b=i*1.2566;s+=ci(x+Math.cos(b)*1.5,y+Math.sin(b)*1.5,1.15,fc);}s+=ci(x,y,.9,'#fbe9a8',NO);});}
  else if(k==='schwert')[-20,-8,3,14,24].forEach((a,i)=>s+=leaf(8,20.6,a,12+(i%2)*4,1.2,i%2?g2:g1,0)+ln(`M8 20.6L${f2(8+Math.sin(a*Math.PI/180)*(11+(i%2)*4))} ${f2(20.6-Math.cos(a*Math.PI/180)*(11+(i%2)*4))}`,'#e9e2a8',.2,.6));
  s+=shadow(8,28,5.4,.9)+pa('M4.2 21.4h7.6l-1 6.6H5.2z',pc)+rc(3.6,20,8.8,1.9,sh(pc,.9),.5)+hi('M5.4 22.4l.5 4',.35,.3);
  return PC(16,28,s);};

/* Kuckucksuhr (antippbar) */
F.kuckuck=o=>{let s=ln('M4.2 17.6v6.2M9.8 17.6v4.6',C.ink,.2,.6)+pa('M4.2 23.4l-1.2 3.4h2.4z',C.w3)+pa('M9.8 21.8l-1.2 3.4h2.4z',C.w3)+ln('M7 17.6v5.6',C.w4,.3)+ci(7,24.2,1.3,C.gold);
  s+=pa('M2 8.4L7 3.6l5 4.8V18H2z',C.w2)+pa('M-.4 8.6L7 .8l7.4 7.8-1.3 1.2L7 3.4.9 9.8z',C.w3)+pa('M5.5 8.9q1.5-2.6 3 0v1.5h-3z',C.w4);
  s+=ci(7,13.8,3.1,C.paper)+ln('M7 13.8V11.9M7 13.8l1.4 .8',C.ink,.3,.8)+leaf(2.4,17.4,-110,2.4,.7,C.leaf)+leaf(11.6,17.4,110,2.4,.7,C.leaf);
  return PC(14,27,s,[],[{t:'kuckuck',r:[-2,-1,16,19],sp:[3.4,4.6,7.2,7.2]}]);};
/* Kamin (Plätze auf dem Sims, Feuer antippbar) */
F.kamin=o=>{const n=o.n||2,st=o.c||'#c9b9a2';const br=pattern(5,2.6,rc(0,0,5,2.6,st,0,NO)+ln('M0 0h5M0 1.3h5M1.2 0v1.3M3.7 1.3v1.3',sh(st,.72),.18,.7));
  let s=shadow(19,36,20,1.2)+rc(2.5,9.2,33,26.8,br,.8,`stroke="${sh(st,.6)}" stroke-width=".3"`)+pa('M9 36V22q0-7.4 10-7.4T29 22v14z','#4a3428')+pa('M10.4 36V22.4q0-6 8.6-6t8.6 6V36z','#33241c',NO);
  s+=gr(rc(11.6,31.6,14,2.4,C.w3,1),'rotate(-7 18.6 32.8)')+gr(rc(12.4,32,14,2.4,C.w2,1),'rotate(8 19.4 33.2)');
  s+=pa('M19 20.4q5.4 5.6 2.4 10.4q-2 2.6-5.2 1.4q-4.2-2.6-1.2-7.2q.4 2.4 1.8 2.6q-.6-4 2.2-7.2z','#f08a3c',NO)+pa('M18.8 25.4q2.8 3 1.2 5.6q-1.4 1.6-3 .4q-1.6-1.8 .2-3.6q.6 1 1.2 1q-.2-1.8 .4-3.4z','#f7d36a',NO);
  s+=rc(0,6.6,38,2.8,C.w2,.8)+hi('M1 7.3h36',.28,.4)+rc(.6,34.6,36.8,1.6,sh(st,.8),.5);
  const sw=(38-2)/n;
  return PC(38,36.2,s,[...Array(n)].map((_,i)=>[String(i+1),'shelf',1+i*sw,-6.6,1+(i+1)*sw,6.8]),[{t:'fire',r:[8,14,30,36],g:[19,27,16]}]);};
/* Radio */
F.radio=o=>{let s=rc(0,1.6,13,7.4,o.c||'#c9705c',1.4)+rc(1.4,3,5.6,4.6,'#f6ead0',.8)+ln('M2.4 4.2h3.6M2.4 5.3h3.6M2.4 6.4h3.6',C.w3,.25,.7)+ci(9.8,4.4,1.2,C.cream)+ci(9.8,7,.7,C.cream)+ln('M10.6 1.6L12.6-2',C.dmetal,.3);
  return PC(13,9,s,[],[{t:'notes',r:[-2,-4,15,10]}]);};
/* kleine Deko ohne Funktion */
F.buecher=o=>PC(10,8,cellDeco('b',0,0,10,8,o.seed||3));
F.vase=o=>{const c=o.c||C.sea;let s=ln('M3 6.4Q2 3 1.2 1.2M3 6.4V.6M3 6.4q1-3 2-4.6','#5f8f55',.35)+ci(1.2,1,1,C.rose)+ci(3,.2,1.1,C.sun)+ci(5,1.6,1,'#c9a9d6')+pa('M1.8 6.2h2.4q1.8 2.4 0 5.8H1.8q-1.8-3.4 0-5.8z',c)+hi('M2 8l-.2 2.4',.3,.5);
  return PC(6,12,s);};
F.bild=o=>{const W=o.w||12,H=o.h||9,fc=o.c||C.w2;let s=rc(0,0,W,H,fc,.5)+rc(1.1,1.1,W-2.2,H-2.2,o.sea?'#b6d8e4':'#e6efd6',.2,NO);
  if(o.k==='karte')s=rc(0,0,W,H,'#ead9b0',.4)+pa(`M${W*.2} ${H*.5}q${W*.1}-${H*.36} ${W*.3}-${H*.2}q${W*.2}-${H*.2} ${W*.3} ${H*.1}q${W*.04} ${H*.4}-${W*.2} ${H*.34}q-${W*.3} ${H*.2}-${W*.4}-${H*.24}z`,'#a9c58a')+ln(`M${W*.14} ${H*.8}q${W*.2}-${H*.1} ${W*.3} 0`,C.terra,.3,.8,'stroke-dasharray=".6 .6"')+ci(W*.78,H*.24,.7,C.terra,NO)+rc(0,-.5,W,1,C.w3,.4)+rc(0,H-.5,W,1,C.w3,.4);
  else if(o.k==='spur')s+=[[.34,.62],[.62,.38]].map(([a,b])=>pa(`M${f2(W*a)} ${f2(H*b)}l-.9-1.9 .6-.2 .5 1.2 .2-1.6h.6l.2 1.6 .5-1.2 .6 .2-.9 1.9q-.5 1-1 0z`,'#a8824a',NO)).join('');
  else s+=pa(`M1.1 ${H-1.1}V${H*.62}q${W*.2}-${H*.2} ${W*.36} 0t${W*.44}-${H*.06}V${H-1.1}z`,'#9fc37c',NO)+ci(W*.72,H*.3,H*.12,C.sun,NO);
  return PC(W,H,s);};
F.korb=o=>PC(12,8,cellDeco('k',0,0,12,8,1));
F.kloetze=o=>PC(10,7,rc(0,3.6,3.4,3.4,C.terra,.4)+rc(3.4,3.6,3.4,3.4,C.sea,.4)+rc(6.8,3.6,3.2,3.4,C.sun,.4)+rc(1.8,.3,3.3,3.3,C.moss,.4)+pa('M5.4 3.6L7.2.4 9 3.6z',C.plum));
F.ball=o=>PC(6,6,shadow(3,6,3,.6)+ci(3,3,3,o.c||C.terra)+pa('M.3 3Q3 1 5.7 3Q3 5 .3 3z','#fbf3e0',NO)+hi('M1.4 1.8q.8-1 2-.9',.3,.6));
F.kissen=o=>{const c=o.c||C.plum;return PC(10,6,rc(0,0,10,6,c,2.2)+ln('M2.4 2h5.2M2.4 4h5.2',sh(c,1.3),.3,.7));};

/* ---------- Arbeitszimmer ---------- */
/* Schreibtisch: Platz d…1 auf der Platte, darauf liegt das Auftragsbuch (lebendig, antippbar) */
F.schreibtisch=o=>{const c=o.c||C.w2;let s=shadow(18,24,19,1.2)+rc(32.4,2,2,22,sh(c,.78),.4)+rc(12.6,6,20,1.4,sh(c,.82),.3)+rc(1.4,2,11.4,22,sh(c,.92),.7);
  [3.4,10,16.6].forEach(y=>s+=rc(2.4,y,9.4,5.6,c,.5)+ci(7.1,y+2.8,.7,C.gold));
  s+=rc(0,0,36,2.3,c,.8)+hi('M1 .7h34',.28,.4);
  s+=rc(29.4,-4.6,3.2,4.6,'#8fbccb',.6)+ln('M30.2 -4.6l-.6-3.4M31 -4.6v-4M31.8 -4.6l.8-3',C.terra,.45)+ln('M31 -4.6v-4',C.sun,.45);
  return PC(36,24,s,[['1','shelf',14,-13,27,.3]],[{t:'book',r:[1.6,-9.4,12.6,.4]}]);};
/* Messlatte für Pip (die Striche zeichnet die App darüber) */
F.messlatte=o=>{let s=rc(.3,.3,5,58,'#3c2814',.8,`${NO} opacity=".12"`)+rc(0,0,5,58,'#fbf3e0',.8,`stroke="${C.w2}" stroke-width=".35"`);
  for(let i=1;i<29;i++)s+=ln(`M0 ${i*2}h${i%5?1.4:2.6}`,i%5?'#d9b36c':C.terra,.25,.9);
  s+=pa('M2.6 3.2l-.7-1.5 .5-.2 .4 1 .1-1.3h.5l.1 1.3 .4-1 .5 .2-.7 1.5q-.6.7-1.1 0z','#c8a878',NO);
  return PC(5,58,s,[],[{t:'ruler',r:[-3.5,0,8.5,58]}]);};
/* Pips Platz (Pip zeichnet die App) */
F.pip=o=>PC(20,16,shadow(10,15.6,8,1.1,.14),[],[{t:'pip',r:[0,0,20,16]}]);

/* ---------- Flur ---------- */
F.tuer=o=>{const c=o.c||'#5f9a94',fr=o.f||C.white;let s=shadow(13,46,15,1.1)+rc(0,0,26,46,fr,1)+rc(2.2,2.2,21.6,43.8,c,.6);
  s+=`<g ${clip('<path d="M5.4 16V9.6q0-4.2 7.6-4.2t7.6 4.2V16z"/>')}>${skyBox(5.4,5,15.2,11.4,{bare:1})}</g>`+pa('M5.4 16V9.6q0-4.2 7.6-4.2t7.6 4.2V16z','none',`stroke="${sh(c,.6)}" stroke-width=".5"`)+ln('M13 5.4V16M5.4 11.4h15.2',sh(c,1.3),.5,.9);
  s+=rc(5.4,19.4,6.6,10,sh(c,1.12),.5)+rc(14,19.4,6.6,10,sh(c,1.12),.5)+rc(5.4,32,15.2,10.6,sh(c,1.12),.5)+rc(9.4,25.4,7.2,1.7,C.gold,.4)+ci(20.4,26.4,1.2,C.gold)+hi('M3.2 3.4v40',.3,.25);
  s+=ln('M27.6 9.4h2.2',C.w3,.5)+pa('M29.8 9.2q2.6 .2 2.6 3.2h-5.2q0-3 2.6-3.2z',C.gold)+ci(29.8,12.9,.6,C.w3,NO);
  return PC(26,46,s,[],[{t:'bell',r:[22,5,35,17],e:[29.8,10]}]);};
F.garderobe=o=>{const c=o.c||C.w2;let s=pa('M3 7.4v3l3-3zM31 7.4v3l-3-3z',sh(c,.8))+rc(0,5.8,34,1.7,c,.5)+hi('M.8 6.3h32.4',.28,.4)+rc(1,10.4,32,1.5,sh(c,.9),.5);
  [5,13,21,29].forEach(x=>s+=ln(`M${x} 11.2v2.2q0 1.2 1.2 1.2`,C.w4,.6));
  s+=pa('M2.4 14.6q2.8-2.4 5.6 0l2 3.4-1.6 1.2V29H1.8V19.2L.2 18z','#7fa66a')+ln('M5.2 14.4V29',sh('#7fa66a',.7),.3,.7)+ci(5.2,19.4,.45,C.gold,NO)+ci(5.2,23.4,.45,C.gold,NO);
  s+=pa('M11.6 14.4q1.6-1 3.2 0v11.8h-1.4v2.2h-1.8z',C.terra)+ln('M11.6 17.4h3.2M11.6 20.4h3.2M11.6 23.4h3.2','#fbf3e0',.5,.85);
  s+=ln('M19.4 14.2q1.8-2.4 3.6 0',C.w4,.5)+rc(17.6,16,7.2,7.6,'#c08a58',1.2)+pa('M17.6 17.2h7.2v2.6q-3.6 2-7.2 0z','#a8724a')+rc(20.6,18.8,1.2,1.8,C.gold,.3);
  return PC(34,29.4,s,[['1','shelf',1,-7.4,17,6],['2','shelf',17,-7.4,33,6]]);};
F.bank=o=>{const c=o.c||C.w1,n=o.n||2,sw=(o.w||30)/n-1.5,W=o.w||30;let s=shadow(W/2,13,W*.5,1.1)+rc(1.6,1.6,2,11.4,sh(c,.78),.4)+rc(W-3.6,1.6,2,11.4,sh(c,.78),.4)+rc(1.6,8.6,W-3.2,1.2,sh(c,.86),.3)+rc(0,0,W,2.4,c,.9)+hi(`M1 .7h${W-2}`,.28,.4);
  if(!o.leer)s+=pa('M6 8.6V4.4q0-.8 1.4-.8t1.4 .8v2.4l2.6 .6q.8 .3 .8 1.2z',C.sun)+pa('M12.8 8.6V4.4q0-.8 1.4-.8t1.4 .8v2.4l2.6 .6q.8 .3 .8 1.2z',C.sun)+pa(`M${W-10} 8.6q0-2.2 2.4-2.2h1.6l2.6 1q.8 .4 .8 1.2z`,C.terra);
  return PC(W,13,s,[...Array(n)].map((_,i)=>[String(i+1),'shelf',1.5+i*sw,-13,1.5+(i+1)*sw,.3]));};
F.spiegel=o=>{const W=o.w||12,H=o.h||17,c=o.c||C.gold;let s=ln(`M${W*.3} .6L${W/2} -1.8L${W*.7} .6`,C.ink,.25,.5)+el(W/2,H/2,W/2,H/2,c)+el(W/2,H/2,W/2-1.3,H/2-1.3,'#dcecee',`stroke="${sh(c,.6)}" stroke-width=".25"`)+hi(`M${W*.3} ${H*.36}l${W*.22}-${H*.16}M${W*.32} ${H*.5}l${W*.12}-${H*.09}`,.6,.75);
  return PC(W,H,s);};
F.schirm=o=>{let s=shadow(4.5,20,4.6,.9)+ln('M3.4 9L2.4 1.6q-.2-1.6 1.2-1.6',C.terra,.7)+ln('M5.6 9l1.2-6.4',C.dsea,.7)+pa('M5.4 9l.6-4 2.2 .3-1 3.9z',C.sea)+pa('M1.4 8.6h6.2l-.7 11.4H2.1z','#b9ae9c')+ln('M1.8 11.6h5.4M2 16h5',C.dstone,.3,.8);
  return PC(9,20,s);};
/* Treppe: drei Stufen sind Plätze */
F.treppe=o=>{const c=o.c||C.w2,st=11,hh=6.5,W=44,H=42;let s=shadow(22,H,23,1.2);
  s+=ln(`M1 ${H-18}L${W} ${H-18-26}`,C.w3,1.3)+[0,1,2,3].map(i=>ln(`M${i*st+5.5} ${H-(i+1)*hh}v-${14.6}`,C.w3,.6)).join('')+rc(-.2,H-20,2.6,20,C.w3,.5)+ci(1.1,H-21,1.7,C.w3);
  for(let i=0;i<4;i++){const y=H-(i+1)*hh;s+=rc(i*st,y,W-i*st,hh+.2,i%2?sh(c,.93):c,.3)+rc(i*st-.4,y-.2,st+1,1.3,sh(c,1.2),.4);}
  s+=rc(30,H-13,10,13,sh(c,.86),.6)+ci(32,H-6.6,.6,C.gold,NO)+rc(31.4,H-11.4,7.2,9.8,'none',.4,`stroke="${sh(c,.6)}" stroke-width=".25"`);
  return PC(W,H,s,[0,1,2].map(i=>[String(i+1),'shelf',i*st,H-(i+1)*hh-13,(i+1)*st,H-(i+1)*hh+.2]));};
F.schluessel=o=>{let s=rc(0,0,11,3,C.w1,.6);[2.4,5.5,8.6].forEach((x,i)=>s+=ci(x,1.5,.4,C.w4,NO)+ln(`M${x} 1.9v2`,C.dmetal,.25)+ci(x,4.8,.9,'none',`stroke="${[C.gold,C.dmetal,C.terra][i]}" stroke-width=".5"`)+ln(`M${x} 5.7v2.3h.8M${x} 7.1h.6`,[C.gold,C.dmetal,C.terra][i],.45));
  return PC(11,8.2,s);};

/* ---------- Küche ---------- */
F.herd=o=>{const c=o.c||'#f3ead8';let s=shadow(11,30,12,1.1)+rc(0,3.6,22,26.4,c,.9)+rc(-.6,2.4,23.2,1.8,'#5a5048',.5)+rc(2.6,11.6,16.8,13.4,sh(c,.9),.8)+rc(4.6,14,12.8,7.4,'#4a3428',.6)+rc(5.6,15,10.8,5.4,'#e9a23a',.4,`${NO} opacity=".5"`)+ln('M4.6 12.8h12.8',C.dmetal,.7);
  [4.5,8.8,13.2,17.5].forEach(x=>s+=ci(x,7.8,1.1,'#5a5048'));
  s+=rc(5.2,-3.6,11.6,6,C.terra,1)+rc(4.6,-4.6,12.8,1.5,sh(C.terra,.8),.6)+ci(11,-5.2,.8,C.w4)+ln('M5.2 -1.6H3.6M16.8 -1.6h1.6',C.w4,.8)+hi('M6.6 -2.4v3.4',.4,.35)+rc(1.2,28.6,2,1.4,'#5a5048',.3)+rc(18.8,28.6,2,1.4,'#5a5048',.3);
  return PC(22,30,s,[],[{t:'steam',r:[2,-14,20,3],e:[11,-6]}]);};
F.kuehl=o=>{const c=o.c||'#cfe3df';let s=shadow(9,46,10,1.1)+rc(0,0,18,45,c,1.6)+ln('M0 14.4h18',sh(c,.7),.35,.8)+rc(14.4,5,1.1,6.6,C.dmetal,.5)+rc(14.4,17.6,1.1,9,C.dmetal,.5)+hi('M1.6 2v41',.35,.4);
  s+=rc(3.4,19.6,6.6,7.6,'#fffaf0',.3)+pa('M4.4 25.6l1.6-3 1.2 1.6 1-1.2 1 2.6z','#9fc37c',NO)+ci(8.2,21.4,.7,C.sun,NO)+ci(6.7,19.6,.6,C.terra,NO);
  s+=pa('M4.6 32.4l.5 1 1.1.2-.8.8.2 1.1-1-.5-1 .5.2-1.1-.8-.8 1.1-.2z',C.sun,NO)+ci(9.4,34,1,C.plum,NO)+rc(4,6,3,2.2,C.terra,.4)+rc(1.6,44.6,2.2,1.4,'#7d8a90',.3)+rc(14.2,44.6,2.2,1.4,'#7d8a90',.3);
  return PC(18,46,s,[['1','shelf',.8,-13,17.2,.3]],[{t:'fridge',r:[0,3,18,44],e:[9,16]}]);};
/* Küchenzeile mit Spüle: Wasserhahn antippbar, 2 Plätze auf der Arbeitsplatte */
F.spuele=o=>{const c=o.c||'#9fbfa6',top=o.top||'#e6d7bd';let s=shadow(22,28,23,1.1)+rc(1,2,42,25,c,.7);
  [1.8,15.4,29].forEach(x=>s+=rc(x+.6,4.6,12.2,20.2,sh(c,1.1),.6)+ci(x+10.8,13.6,.7,C.gold));
  s+=rc(2.2,26.6,39.6,1.4,sh(c,.7),.3)+rc(0,0,44,2.3,top,.7)+hi('M1 .7h42',.28,.45)+rc(4.4,.2,14.4,1.4,'#aeb9bd',.6)+rc(5.4,.5,12.4,.9,'#7d8a90',.4,NO);
  s+=ln('M11.6 .2V-5.6q0-2.2 2.2-2.2t2.2 2v1',C.dmetal,1.1)+ln('M11.6 .2V-5.6q0-2.2 2.2-2.2t2.2 2v1','#dfe7ea',.4,.8)+ln('M9.6 -1.6h4',C.dmetal,.8);
  return PC(44,28,s,[['1','shelf',19.6,-13,31.6,.3],['2','shelf',31.6,-13,43.6,.3]],[{t:'water',r:[5,-10,19,2],e:[16,-4]}]);};
F.wanduhr=o=>{const c=o.c||C.terra;return PC(10,10,ci(5,5,5,c)+ci(5,5,3.9,'#fffaf0')+[0,1,2,3].map(i=>ln(`M${5+Math.cos(i*1.571)*3.2} ${5+Math.sin(i*1.571)*3.2}h.01`,C.ink,.5,.8)).join('')+ln('M5 5V2.8M5 5l1.8 1',C.ink,.4,.9)+ci(5,5,.4,C.ink,NO));};
F.toepfe=o=>{let s='';[0,6,12].forEach((x,i)=>s+=leaf(x+3,5,-30,4.4,1,C.leaf)+leaf(x+3,5,24,4.8,1,C.moss)+leaf(x+3,5,0,5.4,.9,'#8fbf7a')+pa(`M${x+.8} 5h4.4l-.6 4H${x+1.4}z`,i%2?'#e9dcc6':C.terra));return PC(18,9,s);};
F.obst=o=>PC(12,7,ci(4,2.6,2,C.terra)+ci(7.4,2.4,2,C.sun)+ci(5.8,1.4,1.8,'#9fc37c')+pa('M8.6 2.2q2.4-2 3.4-.4-1.4 2.2-3.4 .4z',C.sun)+pa('M.6 3.4h10.8q-.4 3.6-5.4 3.6T.6 3.4z','#8fbccb')+ln('M2.4 5h7.2','#fffaf0',.3,.7));
F.leiste=o=>{let s=ln('M0 1h26',C.dmetal,.6)+ci(0,1,.6,C.dmetal,NO)+ci(26,1,.6,C.dmetal,NO);
  s+=ln('M4 1v5.4',C.w3,.5)+el(4,8,1.6,2,C.dmetal)+ln('M10 1v3',C.w3,.5)+ci(10,7.2,3.2,'#5a5048')+ci(10,7.2,2.2,'#3d3632',NO)+ln('M16.4 1v4',C.w3,.5)+pa('M15.2 5h2.4l.6 4.6h-3.6z','#e9dcc6')+ln('M22 1v3.4',C.w3,.5)+pa('M20.6 4.4h2.8q.6 3-1.4 5.2-2-2.2-1.4-5.2z',C.terra);
  return PC(26,10.4,s);};

/* ---------- Schlafzimmer ---------- */
F.bett=o=>{const c=o.c||'#8fb3c4',wd=o.w||C.w2;let s=shadow(28,30,29,1.3)+rc(1,26,2.4,4,sh(wd,.75),.4)+rc(52.6,26,2.4,4,sh(wd,.75),.4);
  s+=pa('M0 28V7Q0 1.6 3 1.6T6 7v21z',wd)+hi('M1.4 6v20',.3,.3)+rc(52,14,4,14,wd,1.2)+rc(4,22.6,49,4.6,sh(wd,.9),.5);
  s+=rc(4.6,16.4,48,7,'#fffaf0',1.6)+rc(6,10.6,13,6.6,'#fffaf0',2.6)+ln('M8 13.2q4-1.4 9 0',sh('#fffaf0',.82),.3,.8);
  s+=pa('M19 14.8h33.6v9.6H17.6q-1.6-5 1.4-9.6z',c)+pa('M19 14.8h4.6q-2.6 4.6-1.4 9.6h-4.6q-1.6-5 1.4-9.6z','#fffaf0');
  [[27,18],[33,21.6],[39,17.6],[45,21.4],[49.4,17.6],[26,22.4]].forEach(([x,y],i)=>s+=pa(`M${x} ${y}l.5 1 1.1.2-.8.8.2 1.1-1-.5-1 .5.2-1.1-.8-.8 1.1-.2z`,i%2?'#fbe9a8':'#fffaf0',NO));
  return PC(56,30,s,[['1','shelf',20,1.6,36,15.2],['2','shelf',36,1.6,52,15.2]]);};
F.nachttisch=o=>{const c=o.c||C.w2;let s=shadow(7,14,7.6,1)+rc(1.4,11,1.6,3,sh(c,.75),.3)+rc(11,11,1.6,3,sh(c,.75),.3)+rc(.6,1.6,12.8,10,c,.8)+rc(2,3.4,10,5.4,sh(c,1.12),.5)+ci(7,6.1,.7,C.gold)+rc(0,0,14,2,sh(c,.92),.7);
  return PC(14,14,s,[['1','shelf',.4,-13,13.6,.3]]);};
F.schrank=o=>{const c=o.c||'#c9a580';let s=shadow(15,52,16,1.2)+rc(1.6,49.6,2.4,2.4,sh(c,.7),.3)+rc(26,49.6,2.4,2.4,sh(c,.7),.3)+rc(.8,1.4,28.4,48.6,c,.8);
  s+=rc(2.4,4,12.2,34,sh(c,1.1),.6)+rc(15.4,4,12.2,34,sh(c,1.1),.6)+rc(4.2,6,8.6,13.4,'none',.5,`stroke="${sh(c,.68)}" stroke-width=".28"`)+rc(17.2,6,8.6,13.4,'none',.5,`stroke="${sh(c,.68)}" stroke-width=".28"`)
    +rc(4.2,21.6,8.6,14.4,'none',.5,`stroke="${sh(c,.68)}" stroke-width=".28"`)+rc(17.2,21.6,8.6,14.4,'none',.5,`stroke="${sh(c,.68)}" stroke-width=".28"`);
  s+=ci(13.2,22,.75,C.gold)+ci(16.8,22,.75,C.gold)+rc(2.4,40,25.2,8,sh(c,1.1),.6)+ci(10,44,.7,C.gold)+ci(20,44,.7,C.gold)+rc(0,0,30,2.2,sh(c,.88),.7)+hi('M1 .7h28',.28,.4);
  return PC(30,52,s,[['1','shelf',1,-13,15,.3],['2','shelf',15,-13,29,.3]]);};
F.kiste=o=>{const c=o.c||C.sea,W=o.w||22;let s=shadow(W/2,13,W*.52,1)+rc(.6,2.6,W-1.2,10.4,c,.9)+rc(0,0,W,3.2,sh(c,.86),1)+ln(`M3 6v5M${W-3} 6v5`,sh(c,.7),.3,.7);
  s+=o.k==='holz'?ln(`M.8 6.4h${W-1.6}M.8 9.6h${W-1.6}`,sh(c,.7),.3,.7):pa(`M${W/2} 5l.9 1.9 2.1.3-1.5 1.5.4 2.1-1.9-1-1.9 1 .4-2.1L${W/2-2.5} 7.2l2.1-.3z`,C.sun,NO);
  return PC(W,13,s,[['1','shelf',.6,-13,W-.6,.3]]);};
F.nachtlicht=o=>{let s=ci(5,5,5,'#fbe9a8')+ci(7,3.8,4,'#3c2814',`${NO} opacity="0"`)+pa('M5 0a5 5 0 1 0 4.6 7A4.4 4.4 0 0 1 5 0z','#f5d36a')+ci(3.6,4.6,.45,C.ink,NO)+ln('M3.4 6.6q.9 .8 1.9 .2',C.ink,.3,.8);
  s=pa('M5 0a5 5 0 1 0 4.6 7A4.4 4.4 0 0 1 5 0z','#f5d36a')+ci(3.6,4.6,.45,C.ink,NO)+ln('M3.4 6.6q.9 .8 1.9 .2',C.ink,.3,.8)+pa('M8.6 1.4l.4 .9 1 .1-.7 .7 .2 1-.9-.5-.9 .5 .2-1-.7-.7 1-.1z','#fbe9a8',NO);
  return PC(10,10,s,[],[{t:'lamp',r:[-2,-2,12,12],g:[5,5,13]}]);};
F.girlande=o=>{const W=o.w||60,n=Math.round(W/6),cs=[C.terra,C.sun,C.moss,C.sea,C.plum,C.rose];let s=ln(`M0 0Q${W/2} ${W*.11} ${W} 0`,C.ink,.25,.6);
  for(let i=0;i<n;i++){const t=(i+.5)/n,x=W*t,y=2*W*.055*t*(1-t)*2;s+=pa(`M${f2(x-2.2)} ${f2(y)}h4.4l-2.2 4.6z`,cs[i%6]);}
  return PC(W,W*.06+5,s);};

/* ---------- Bad ---------- */
F.wanne=o=>{const c='#fffaf0';let s=shadow(23,24,24,1.2)+pa('M7 21.4l-1.6 2.6h3zM39 21.4l1.6 2.6h-3z',C.gold);
  s+=ln('M40 6V-2.4q0-2.4-2.4-2.4t-2.4 2.2v.8',C.dmetal,1.1)+ln('M40 6V-2.4q0-2.4-2.4-2.4t-2.4 2.2v.8','#dfe7ea',.4,.8);
  s+=pa('M2 6.4h42q0 12-6.4 15.4H8.4Q2 18.4 2 6.4z',c)+ln('M5 9q.6 8 4.6 10.4',sh(c,.84),.6)+rc(0,4.4,46,2.4,c,1.2);
  [[9,3,2.6],[13.4,2,2.2],[17.6,3.2,2.4],[22,2.2,2.8],[26.6,3.2,2.2],[30.4,2.4,2.4],[5.6,3.6,1.8],[34,3.6,1.8],[19.6,.6,1.6],[25,0,1.3]].forEach(([x,y,r])=>s+=ci(x,y,r,'#ffffff',`stroke="#bcd3da" stroke-width=".22"`));
  s+=rc(36,10,6,1.6,'#8fbccb',.6)+rc(36,13,6,1.6,'#8fbccb',.6);
  return PC(46,24,s,[],[{t:'ente',r:[3,-9,19,5],sp:[7,-5.6,8,8]},{t:'water',r:[29,-10,45,5],e:[35.2,-.6]}]);};
F.waschbecken=o=>{const c='#fffaf0';let s=shadow(9,30,7,1)+pa('M6.4 11h5.2l-.8 19H7.2z',c)+ln('M9 4.2V-1.4q0-2 2-2t2 1.8v.8',C.dmetal,1.1)+ln('M9 4.2V-1.4q0-2 2-2t2 1.8v.8','#dfe7ea',.4,.8)+ln('M6.6 2.8h2.6',C.dmetal,.8);
  s+=pa('M0 4.2h18q0 7.6-6 8.2H6Q0 11.8 0 4.2z',c)+rc(-.4,3.2,18.8,1.8,c,.9)+hi('M2 6.4q.6 3.4 3.4 4.4',.4,.5);
  return PC(18,30,s,[],[{t:'water',r:[2,-7,16,10],e:[13,-.2]}]);};
F.klo=o=>{const c='#fffaf0';let s=shadow(8.5,22,8,1)+rc(1,0,9.4,11,c,1.2)+rc(.4,-.8,10.6,1.8,sh(c,.94),.8)+ci(5.7,3.4,.9,C.dmetal)+pa('M3.4 16.4h8l-1 5.6H5z',c)+pa('M2 11h13q1.2 0 1.2 1.2 0 4.6-5.6 4.6H5.4Q2 16.8 2 11z',c)+rc(1.4,10,15.2,1.7,sh(c,.94),.85);
  return PC(17,22,s,[],[{t:'flush',r:[0,-1,17,22],e:[8,9]}]);};
F.handtuch=o=>{const c=o.c||C.sea;let s=ln('M0 1.2h18',C.dmetal,.7)+ci(0,1.2,.7,C.dmetal,NO)+ci(18,1.2,.7,C.dmetal,NO)+rc(2.4,.6,6.4,12,c,.6)+ln('M2.4 9.4h6.4M2.4 10.8h6.4','#fffaf0',.4,.85)+rc(10,.6,5.6,9,o.c2||C.rose,.6)+ln('M10 7h5.6','#fffaf0',.4,.85);
  return PC(18,13,s);};

/* ---------- Dachboden ---------- */
F.truhe=o=>{const c=o.c||'#a8724a';let s=shadow(14,17,15,1.1)+rc(.6,4,26.8,13,c,1)+rc(0,0,28,5.4,sh(c,.9),1.4)+ln('M6.4 .4V17M21.6 .4V17',C.w4,1.3,.85)+rc(11.6,4,4.8,4.4,C.gold,.6)+ci(14,6.4,.6,C.w4,NO);
  [[.6,13.6],[24.6,13.6]].forEach(([x,y])=>s+=rc(x,y,2.8,3.4,C.gold,.4));s+=hi('M1.4 1.2h25.2',.3,.35);
  return PC(28,17,s,[['1','shelf',.6,-13,14,.3],['2','shelf',14,-13,27.4,.3]]);};
F.kartons=o=>{const c='#d2b48a';let s=shadow(12,22,13,1.1)+rc(0,9.4,24,12.6,c,.5)+ln('M0 12.6h24',sh(c,.74),.3,.8)+rc(9.6,9.4,4.8,3.2,'#e9dcc0',.2)+ln('M4 17h5M4 18.8h3.4',sh(c,.66),.4,.8);
  s+=gr(rc(3.4,0,17,9.4,sh(c,1.08),.5)+rc(9.8,0,4.2,9.4,'#e9dcc0',.2,`${NO} opacity=".8"`)+pa('M6 6.4l1.4-2.2 1.4 2.2zM7 6.4h.8v1.6H7z',sh(c,.6),NO),'rotate(-2 12 9.4)');
  return PC(24,22,s,[['1','shelf',3.6,-13,20.4,.6]]);};
F.koffer=o=>{let s=shadow(11,14,12,1)+rc(0,6.4,22,7.6,'#c9705c',1.2)+ln('M5 6.4v7.6M17 6.4v7.6',sh('#c9705c',.66),.6,.8)+rc(8.6,8.6,4.8,1.6,C.gold,.4)+ci(3,11.6,1,'#f6ead0')+rc(18,10,2.4,2.4,C.sea,.3);
  s+=rc(2,0,18,6.4,'#5f9a94',1.2)+ln('M6 0v6.4M16 0v6.4',sh('#5f9a94',.66),.6,.8)+ln('M9 0q2-1.8 4 0',C.w4,.6)+pa('M12.4 2.6l.5 1 1.1.2-.8.8.2 1.1-1-.5-1 .5.2-1.1-.8-.8 1.1-.2z',C.sun,NO);
  return PC(22,14,s,[['1','shelf',2,-13,20,.3]]);};
F.schaukeldino=o=>PC(28,24,shadow(14,23.6,12,1),[],[{t:'rock',r:[1,0,27,24],sp:[0,0,28,24]}]);
F.spinnweb=o=>{let s='';[8,22,38,56,74,86].forEach(a=>{const r=a*Math.PI/180;s+=ln(`M0 0L${f2(Math.cos(r)*16)} ${f2(Math.sin(r)*16)}`,'#fffaf0',.2,.75);});
  [5,9,13].forEach(r=>{let d='';[8,22,38,56,74,86].forEach((a,i)=>{const q=a*Math.PI/180,x=Math.cos(q)*r,y=Math.sin(q)*r;d+=i?`Q${f2(Math.cos((a-7)*Math.PI/180)*r*.86)} ${f2(Math.sin((a-7)*Math.PI/180)*r*.86)} ${f2(x)} ${f2(y)}`:`M${f2(x)} ${f2(y)}`;});s+=ln(d,'#fffaf0',.2,.75);});
  return PC(16,16,o.flip?gr(s,'translate(16 0) scale(-1 1)'):s,[],[{t:'spinne',r:[1,1,15,17],sp:o.flip?[5.4,5,5,5]:[5.6,5,5,5]}]);};
F.grammophon=o=>{let s=shadow(8,18,8,.9)+pa('M8.4 10.6Q9 5 4.6 2.4L1.2 .2Q-.6 3.4 .4 7.6L4.2 6.4Q6.6 7.6 7 10.6z',C.gold)+ln('M1 .9Q.2 3.8 .9 7M2.6 1.6Q2 4 2.6 6.6',sh(C.gold,.7),.25,.7)+el(8,11,5.4,1.2,'#3d3632')+ci(8,11,1,C.terra,NO)+rc(2,11.4,12,6,C.w2,.8)+ln('M14 14h1.8v-2.2',C.dmetal,.5)+ci(15.8,11.6,.6,C.w4,NO)+ln('M3.4 13.4h9.2',sh(C.w2,.7),.25,.7);
  return PC(16,18,s,[],[{t:'notes',r:[-2,-3,17,18],e:[2,3]}]);};
F.rolle=o=>{const c=o.c||C.terra;return PC(6,26,shadow(3,26,3.4,.8)+rc(.4,1,5.2,25,c,2)+el(3,1.4,2.6,1.2,sh(c,1.2))+ln('M3 1.4q1.2 0 1 .5t-1.6 .1',sh(c,.6),.25)+ln('M.4 8h5.2M.4 17h5.2','#e9c79a',.5,.9));};

/* ---------- Keller ---------- */
F.fass=o=>{const c=o.c||'#a8724a';let s=shadow(9,22,9.6,1.1)+pa('M2.4 .8h13.2q3.2 10.2 0 20.6H2.4Q-.8 11 2.4 .8z',c)+ln('M6 .8q-1.4 10.2 0 20.6M12 .8q1.4 10.2 0 20.6M9 .8v20.6',sh(c,.66),.28,.7);
  s+=pa('M1.4 4.6h15.2l.4 2H1z',C.dmetal)+pa('M1 15.4h16l-.4 2H1.4z',C.dmetal)+el(9,.9,6.6,.9,sh(c,1.16))+rc(7.8,10,2.4,1.4,C.gold,.3)+ln('M9 11.4v1.6',C.gold,.6);
  return PC(18,22,s,[['1','shelf',.6,-12.8,17.4,.9]]);};
F.waschmaschine=o=>{const c='#f1efe8';let s=shadow(11,26,12,1.1)+rc(0,0,22,25.4,c,1.2)+rc(0,0,22,5,sh(c,.9),1.2)+ci(4,2.5,1.1,C.terra)+ci(7.6,2.5,1.1,C.sea)+rc(12.6,1.4,7.4,2.2,'#5a5048',.4)+rc(1.4,25.2,2.4,1.2,'#7d8a90',.3)+rc(18.2,25.2,2.4,1.2,'#7d8a90',.3);
  s+=ci(11,15,7.4,C.metal)+ci(11,15,5.8,'#31434f');
  return PC(22,26.4,s,[['1','shelf',.8,-13,21.2,.3]],[{t:'wash',r:[2.5,6.5,19.5,23.5],sp:[5.4,9.4,11.2,11.2]}]);};
F.werkbank=o=>{const c=o.c||'#b08a5e';let s=shadow(21,24,22,1.2)+rc(2,3,3,21,sh(c,.74),.4)+rc(37,3,3,21,sh(c,.74),.4)+rc(2,15.6,38,1.6,sh(c,.82),.3)+rc(0,0,42,3.4,c,.7)+hi('M1 .8h40',.28,.4);
  s+=rc(8,9.6,13,6,C.terra,.6)+ln('M11.4 9.6q3-3.4 6.2 0',C.dmetal,.6)+rc(13.2,11.6,2.6,1.6,C.gold,.3)+rc(25.4,11,9,4.6,'#d2b48a',.4);
  s+=rc(1,-3.6,5.2,3.6,C.dmetal,.5)+rc(.2,-5,2,1.6,C.dmetal,.3)+rc(5,-5,2,1.6,C.dmetal,.3)+ln('M-1.2 -1.8h3',C.w4,.7);
  return PC(42,24,s,[['1','shelf',9,-13,23,.3],['2','shelf',23.6,-13,37.6,.3]]);};
F.werkzeug=o=>{let s=rc(0,0,30,16,'#d9c7a2',.6)+[...Array(5)].map((_,i)=>[...Array(3)].map((_,j)=>ci(3+i*6,3+j*5,.3,'#a8946e',NO)).join('')).join('');
  s+=rc(4.4,3,1.2,9.6,C.w2,.4)+rc(2.4,2,5.2,2.6,C.dmetal,.4)+pa('M11 3h9l-1.4 3.4H11z',C.metal)+ln('M11.6 6.4l.6-.9 .6 .9 .6-.9 .6 .9 .6-.9 .6 .9 .6-.9 .6 .9 .6-.9 .6 .9',C.dmetal,.25)+rc(9,2.6,2.6,4,C.terra,.6);
  s+=ln('M24 3v8',C.dmetal,.9)+ci(24,3.2,1.6,'none',`stroke="${C.dmetal}" stroke-width=".9"`)+rc(12.6,9.4,1.2,5,C.sun,.4)+ln('M13.2 9.4v-2',C.dmetal,.5)+rc(17,9.6,1.4,4.6,C.sea,.4)+ln('M17.7 9.6V7.4',C.dmetal,.5);
  return PC(30,16,s);};
F.rohre=o=>{const W=o.w||60;let s=ln(`M0 2h${W}`,'#8f9a9e',2)+ln(`M0 1.4h${W}`,'#c3cdd0',.5,.8)+ln(`M0 5.6h${W*.62}v6`,'#b98b5e',1.4)+ln(`M0 5.2h${W*.6}`,'#dbb88a',.35,.8);
  [W*.2,W*.55,W*.85].forEach(x=>s+=rc(x-.9,.4,1.8,3.2,'#6f7a7e',.3));s+=ci(W*.62,8.4,2.2,'none',`stroke="${C.terra}" stroke-width=".8"`)+ln(`M${W*.62-2.2} 8.4h4.4M${W*.62} 6.2v4.4`,C.terra,.5);
  return PC(W,12,s);};
F.mauseloch=o=>PC(8,6.4,pa('M.6 6.4V3.4Q.6 .4 4 .4t3.4 3v3z','#2c211b'),[],[{t:'maus',r:[-3,-4,11,7],sp:[1,.6,6,6]}]);
F.sack=o=>{const c='#c9b28a';return PC(12,14,shadow(6,14,6.4,.9)+pa('M2.4 3.6Q-1 9 1.4 13.6h9.2Q13 9 9.6 3.6z',c)+pa('M3 3.6q3-2 6 0l1-2.6q-4-1.4-8 0z',sh(c,1.1))+ln('M2.8 3.7h6.4',C.w4,.5)+ln('M4 7q2 3 0 5M7.6 6.6q1.6 3 .2 5.6',sh(c,.74),.3,.7)+ci(5.4,1,1,'#b08a5e')+ci(7.4,1.4,.9,'#a87c54'));};

/* ---------- Garten ---------- */
F.baum=o=>{const lf=leafCols(),tr='#8a6548';let s=shadow(22,62,13,1.4)+pa('M18.6 62Q21 44 19.4 30h6q-1.2 14 1.6 32z',tr)+ln('M21.4 34q.6 12-.6 24M24 40q.4 8 1.2 16',sh(tr,.7),.3,.7);
  s+=ln('M24.6 35Q34 31 42 33',tr,1.8)+ln('M20 33Q12 28 7 29',tr,1.5);
  [[22,17,13],[11,22,9.4],[33,21,10],[16,10,8.4],[28,9,8.6],[22,26,9],[6,28,6],[39,28,6.4]].forEach(([x,y,r],i)=>s+=ci(x,y,r,lf[i%3]));
  [[14,16],[25,12],[31,22],[19,24],[9,24],[35,17]].forEach(([x,y],i)=>s+=ln(`M${x} ${y}q1.4-1.8 3 0`,sh(lf[0],.72),.3,.6));
  if(ENVV.season!=='winter')[[13,20],[29,16],[23,25],[34,26]].forEach(([x,y])=>s+=ci(x,y,1.3,C.terra));
  s+=rc(16.2,38,6.4,7,C.w1,.5)+pa('M15.2 38.4L19.4 34l4.2 4.4z',C.terra)+ci(19.4,41,1.3,'#3d3226',NO)+ln('M17.6 44h3.6',C.w3,.4);
  s+=ln('M33 32.4V50M40 32.8V50',C.w4,.3,.8);
  return PC(44,62,s,[],[{t:'vogel',r:[11,33,27,48],sp:[16.6,38.4,5.6,5.6]},{t:'swing',r:[29,36,44,56],sp:[31.4,32.4,10.2,20]}]);};
F.mauer=o=>{const n=o.n||3,sw=13,W=n*sw+2,st='#c9bca6';const br=pattern(7,4,rc(0,0,7,4,st,0,NO)+ln('M0 0h7M0 2h7M2 0v2M5.5 2v2',sh(st,.72),.22,.8));
  let s=shadow(W/2,12,W*.52,1)+rc(.6,1.6,W-1.2,10.4,br,.5,`stroke="${sh(st,.6)}" stroke-width=".3"`)+rc(0,0,W,2.2,sh(st,1.1),.6);
  for(let x=3;x<W-2;x+=7)s+=leaf(x,12,-20,3.4,.8,C.leaf)+leaf(x+1,12,18,3,.8,C.moss)+ci(x+2.6,9.6,.9,x%2?C.rose:C.sun)+ln(`M${x+2.6} 10.4v1.6`,C.leaf,.3);
  return PC(W,12,s,[...Array(n)].map((_,i)=>[String(i+1),'shelf',1+i*sw,-13,1+(i+1)*sw,.3]));};
F.gartentisch=o=>{const c=o.c||C.terra;let s=shadow(20,44,17,1.3)+ln('M20 6V43',C.w3,1)+el(20,43.4,5,1,C.w3);
  s+=pa('M0 13Q2 1 20 .6Q38 1 40 13q-3.4-2-6.6 0-3.4-2-6.8 0-3.2-2-6.6 0-3.4-2-6.6 0-3.4-2-6.8 0Q3.4 11 0 13z',c)+pa('M13.4 13Q14 3 20 .6Q26 3 26.6 13q-3.2-2-6.6 0-3.4-2-6.6 0z','#fbf3e0')+ci(20,.4,.9,C.gold);
  s+=ln('M9 31.6l-2.4 12M31 31.6l2.4 12',C.w3,1)+el(20,31,16,2.2,C.w1)+hi('M7 30.4q13-1.6 26 0',.3,.4);
  return PC(40,44,s,[['1','shelf',4.4,17.4,18.6,30.6],['2','shelf',21.4,17.4,35.6,30.6]]);};
F.beet=o=>{const W=o.w||34;let s=el(W/2,8.6,W/2,1.8,'#8a6548');const cs=[C.rose,C.sun,'#c9a9d6',C.terra,'#fffaf0'];
  for(let i=0,x=3;x<W-2;x+=4.4,i++){const h=4+((i*7)%4);s+=ln(`M${x} 8.4V${f2(8.4-h)}`,C.leaf,.4)+leaf(x,8,-50,2.6,.7,C.moss)+leaf(x,8,50,2.6,.7,C.leaf);
    for(let k=0;k<5;k++){const b=k*1.2566;s+=ci(x+Math.cos(b)*1.1,8.4-h+Math.sin(b)*1.1,.85,cs[i%5],NO);}s+=ci(x,8.4-h,.6,'#f0c35a',NO);}
  return PC(W,10.4,s);};
F.giesskanne=o=>{const c=o.c||'#7fb0a8';let s=shadow(6,10,5.4,.8)+ln('M9.2 5.6L12.6 2',sh(c,.8),1)+pa('M12 .6l2 1.6-1.4 1.2z',sh(c,.8))+ln('M2.4 3.4Q-.8 5.6 2.4 8',sh(c,.8),.8)+rc(2.2,2.6,7.2,7.4,c,1)+el(5.8,2.6,3.6,.8,sh(c,.8))+hi('M3.4 4.6v4',.35,.4);
  return PC(14,10,s,[],[{t:'water',r:[0,-4,16,11],e:[13.4,2.6]}]);};
F.stumpf=o=>{const c='#a8825a';let s=shadow(8,9,8.6,1)+pa('M1.6 2h12.8l1.6 7H0z',c)+ln('M4 3.4l-.6 5M11.4 3.4l.8 5M7.6 4v4.4',sh(c,.66),.3,.7)+el(8,2,6.6,1.9,'#dcc09a')+el(8,2,4,1.1,'none',`stroke="#b89468" stroke-width=".25"`)+el(8,2,1.6,.5,'none',`stroke="#b89468" stroke-width=".25"`);
  return PC(16,9,s,[['1','shelf',1,-11.4,15,2.4]]);};
F.sandkasten=o=>{const c='#c99a68';let s=shadow(20,9,21,1)+pa('M2 3.4Q20 .4 38 3.4L36 7.6H4z','#ecd9a8')+pa('M9 3.4q2-1.4 4 0M24 4q3-1.6 6 0','#d9c38e',`${NO}`)+rc(0,2.6,40,2,c,.6)+rc(.6,6.6,38.8,2.4,sh(c,.9),.6)+rc(0,2.6,1.8,6.4,sh(c,.82),.4)+rc(38.2,2.6,1.8,6.4,sh(c,.82),.4);
  s+=pa('M30.4 3h4l-.6 3.6h-2.8z',C.terra)+ln('M30.6 3q1.8-2.2 3.6 0',C.terra,.4)+ln('M26.6 5.6l1.8-3.6',C.sun,.6)+pa('M26 5.2l1.6 .8-.9 1.4-1.3-.6z',C.sun);
  return PC(40,9,s,[['1','floor',3,-15,20,6.6],['2','floor',20,-15,37,6.6]]);};
F.teich=o=>{const W=o.w||34,c=o.c||'#8fc4d6';let s=el(W/2,5.4,W/2,4.6,o.rim||'#b9ae9c')+el(W/2,5.4,W/2-1.6,3.6,c)+el(W/2-3,4.6,W/4,1.2,'#ffffff',`${NO} opacity=".3"`);
  s+=el(W*.76,6,3,1.1,'#7fa66a')+ci(W*.78,5.6,.9,C.rose)+ln(`M3.4 5V-1M5 5.4V-2.6M6.4 5V0`,C.leaf,.5)+el(5,-2.8,.6,1.4,'#8a6548');
  return PC(W,10,s,[['1','float',W*.2,-7,W*.68,7.6]]);};
F.busch=o=>{const c=o.c||C.leaf;return PC(20,13,ci(5,8.6,4.6,c)+ci(10,6,6,sh(c,1.1))+ci(15.4,8.8,4.4,c)+ln('M7 6q1.6-1.6 3 0M12 8.4q1.4-1.4 2.6 0',sh(c,.7),.3,.6)+(o.b?ci(6,7,.8,C.terra,NO)+ci(12,4.4,.8,C.terra,NO)+ci(15,8,.8,C.terra,NO):''));};
F.terrasse=o=>{const W=o.w||60,H=o.h||14,c='#c9a57a';let s=pa(`M${W*.08} 0h${W*.84}L${W} ${H}H0z`,c);for(let i=1;i<7;i++){const t=i/7;s+=ln(`M${f2(W*.08+W*.84*t)} 0L${f2(W*t)} ${H}`,sh(c,.72),.25,.7);}
  return PC(W,H,s+ln(`M${W*.04} ${H/2}h${W*.92}`,sh(c,.72),.2,.5));};

/* ---------- Themenräume: Fossilien-Galerie ---------- */
const starD=(x,y,r,k=.45)=>{let d='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*k:r;d+=(i?'L':'M')+f2(x+Math.cos(a)*q)+' '+f2(y+Math.sin(a)*q);}return d+'z';};
/* Sockel (1 Platz) */
F.sockel=o=>{const c=o.c||'#eadfc8',H=o.h||14,W=o.w||14;
  let s=shadow(W/2,H,W*.56,1)+rc(1.4,2,W-2.8,H-3.8,c,.3)+rc(0,0,W,2.4,sh(c,1.05),.6)+rc(.3,H-2.2,W-.6,2.2,sh(c,.9),.5)+rc(W/2-2.8,5,5.6,2.6,C.gold,.3)+ln(`M${W/2-1.6} 6.3h3.2`,sh(C.gold,.6),.25,.8)+hi(`M3 3.4v${H-6.4}`,.35,.4);
  return PC(W,H,s,[['1','shelf',0,-13,W,.3]]);};
/* Vitrine: n Plätze hinter Glas */
F.vitrine=o=>{const n=o.n||2,sw=13,W=n*sw+3,c=o.c||C.w3,gh=15.4,bh=o.bh==null?11:o.bh,H=gh+bh;
  let s=shadow(W/2,H,W*.52,1.1)+rc(.8,gh,W-1.6,bh,c,.6)+rc(2.6,gh+2.8,W-5.2,bh-4.8,sh(c,1.14),.5)+ci(W/2,gh+bh/2+.5,.7,C.gold);
  s+=rc(1,0,W-2,gh,'#e6f2f0',.8,`stroke="${sh(c,.75)}" stroke-width=".5"`)+rc(1.5,gh-2.1,W-3,1.7,'#b8605a',.3,NO)+ln(`M${W/2} .4v${gh-2.4}`,sh(c,.75),.3,.6)+hi(`M3 ${gh-4}L6.6 2M5.4 ${gh-4}l2-3.6`,.55,.7)+hi(`M${W/2+2} ${gh-4}l3.6-9`,.5,.5);
  s+=rc(0,gh-.6,W,1.9,sh(c,.9),.6)+rc(.4,-.9,W-.8,1.6,sh(c,.9),.5);
  return PC(W,H,s,[...Array(n)].map((_,i)=>[String(i+1),'shelf',1.5+i*sw,.5,1.5+(i+1)*sw,gh-1.9]));};
/* Steinplatte mit Dino-Skelett (antippbar) */
F.fossilwand=o=>{const W=46,H=23,st=o.c||'#d8c8a6',bn='#fbf4e2',dk=sh(st,.58);
  let s=rc(.5,.7,W,H,'#3c2814',1,`${NO} opacity=".14"`)+rc(0,0,W,H,C.w3,1)+rc(1.3,1.3,W-2.6,H-2.6,st,.5,`stroke="${dk}" stroke-width=".3"`);
  [[8,5,5,1.6],[30,18,7,1.8],[39,7,3.6,1.3],[13,19,5,1.3],[24,4.4,4,1]].forEach(([x,y,a,b])=>s+=el(x,y,a,b,sh(st,.92),NO));
  const B=(d,w=.9)=>ln(d,dk,w+.5,.5)+ln(d,bn,w);
  s+=B('M4 15.6Q10 11.4 17 12.2Q24 9.4 30 10.4Q33.4 8.4 35.2 6',1);
  for(let i=0;i<6;i++)s+=B(`M${19+i*2} ${f2(11.7-i*.3)}q-1.3 3 .5 5.2`,.45);
  s+=B('M18 12.4l-1.4 4.2 2 3.2h2.4',.8)+B('M17.4 12.6l1.6 3.6-1 3.4h2',.6)+B('M29.6 10.6l1.4 3.4-1.4 1.8',.55);
  s+=pa('M34 6.6q.4-3.2 4.2-3.4 3.8 .2 4.6 2.4l-3.8 .7-.5 1.7q-2.7 .6-4.5-1.4z',bn,`stroke="${dk}" stroke-width=".3"`)+ci(37.4,5,.65,dk,NO)+ln('M38.8 6.5h3',dk,.25,.8)+ln('M39.4 6.5v.7M40.4 6.5v.7M41.4 6.5v.6',dk,.2,.8);
  for(let i=0;i<5;i++)s+=ci(5.4+i*2.3,f2(14.9-i*.62),.5,bn,NO);
  s+=rc(W/2-6,H-.7,12,2.5,C.gold,.4)+ln(`M${W/2-3.6} ${H+.55}h7.2`,sh(C.gold,.6),.3,.8);
  return PC(W,H+2,s,[],[{t:'bones',r:[2,1,W-2,H-1]}]);};
/* großer Ammonit an der Wand */
F.ammonit=o=>{const r=o.r||7,st=o.c||'#cdbb98';let s=ci(r+.3,r+.4,r,'#3c2814',`${NO} opacity=".13"`)+ci(r,r,r,st),d='';
  for(let i=0;i<=40;i++){const a=i*.42,q=r*.84*(1-i/46);d+=(i?'L':'M')+f2(r+Math.cos(a)*q)+' '+f2(r+Math.sin(a)*q);}
  s+=ln(d,sh(st,.6),.45,.9);for(let i=0;i<14;i++){const a=i*.45;s+=ln(`M${f2(r+Math.cos(a)*r*.84)} ${f2(r+Math.sin(a)*r*.84)}L${f2(r+Math.cos(a)*r*.62)} ${f2(r+Math.sin(a)*r*.62)}`,sh(st,.68),.25,.7);}
  return PC(2*r,2*r,s+hi(`M${f2(r*.4)} ${f2(r*.5)}q${f2(r*.3)} -${f2(r*.3)} ${f2(r*.7)} -${f2(r*.3)}`,.35,.4));};
/* Absperr-Kordel wie im Museum */
F.kordel=o=>{const W=o.w||40;let s='';[1.2,W/2,W-1.2].forEach(x=>s+=shadow(x,12,2,.6)+rc(x-.5,1.6,1,10,C.gold,.3)+ci(x,1.2,1.1,C.gold)+el(x,11.8,1.8,.6,sh(C.gold,.8)));
  s+=ln(`M1.2 2.6Q${W/4} 8 ${W/2} 2.6Q${W*.75} 8 ${W-1.2} 2.6`,'#b23c3c',1)+ln(`M1.2 2.4Q${W/4} 7.8 ${W/2} 2.4Q${W*.75} 7.8 ${W-1.2} 2.4`,'#e08070',.3,.8);return PC(W,12.4,s);};
/* Grabungskiste mit Sand, Knochen und Pinsel (antippbar) */
F.grabkiste=o=>{const c='#b08a5e';let s=shadow(13,11,14,1)+rc(0,3,26,8,c,.6)+pa('M1.4 3.6Q13 .8 24.6 3.6V5.2H1.4z','#ecd9a8')+ln('M.6 7h24.8',sh(c,.7),.3,.7)+ln('M4 8.6h4M17 9h5',sh(c,.7),.3,.6);
  s+=ln('M6.4 3.2q3.2-2 6.4 0','#fbf4e2',1.2)+ci(6.2,3.2,1,'#fbf4e2')+ci(13,3.2,1,'#fbf4e2');
  s+=gr(rc(18.3,-3.6,1.5,5.4,C.terra,.5)+rc(17.9,1.6,2.3,1.2,C.dmetal,.2)+pa('M17.8 2.8h2.5l.4 2.4h-3.3z','#e9d7a8'),'rotate(24 19 2)');
  return PC(26,11,s,[],[{t:'dust',r:[1,-5,25,8],e:[10,2]}]);};

/* ---------- Urzeit-Meerzimmer ---------- */
/* Aquarium: zwei Plätze im Wasser, Blubber-Stein antippbar */
F.aquarium=o=>{const W=44,gh=24,bh=10,H=gh+bh,c=o.c||'#5f8a8c';
  let s=shadow(W/2,H,W*.52,1.1)+rc(1.6,gh,W-3.2,bh,c,.6)+rc(3.6,gh+2.8,W/2-5,bh-4.6,sh(c,1.14),.5)+rc(W/2+1.4,gh+2.8,W/2-5,bh-4.6,sh(c,1.14),.5)+ci(W/2-2.4,gh+bh/2+.5,.6,C.gold)+ci(W/2+2.4,gh+bh/2+.5,.6,C.gold);
  s+=rc(.6,.6,W-1.2,gh-.4,grad([[0,'#c4e8ef'],[1,'#72b4ca']]),1,`stroke="${C.dmetal}" stroke-width=".5"`);
  s+=pa(`M1 ${gh-3.2}q6-2 11-.4t10-.6 9 .2 12-.6V${gh}H1z`,'#ecd9a8',NO);
  s+=ln(`M4 ${gh-3}q-2-5 .6-9.6M6.2 ${gh-3}q2-4-.2-7`,'#5f9a6a',.9,.9)+ln(`M${W-10} ${gh-3}q2-5-.4-9M${W-12} ${gh-3}q-1.6-3 .2-5.4`,'#6fae74',.9,.9);
  s+=ln(`M${W-6.6} ${gh-2.4}v-3.6M${W-6.6} ${gh-4}q-1.8-.4-1.8-2.4M${W-6.6} ${gh-4.6}q1.8-.6 1.8-2.6`,'#e8857a',1)+el(W-3.6,gh-2.4,2.2,1.2,'#b9ae9c');
  s+=pa('M21 20.4q1-1.6 2.6-1.2 1.6-.6 2.6 1.2z','#c9bca6')+ci(22.8,20.6,.5,'#3d4f63',NO);
  s+=[[W-3.8,gh-6,.7],[W-3.2,gh-9.6,.5],[W-4.4,gh-12.8,.9],[W-3.4,gh-16.4,.6],[W-4.2,gh-19.6,.5]].map(([x,y,r])=>ci(x,y,r,'#ffffff',`stroke="#ffffff" stroke-width=".2" fill-opacity=".4"`)).join('');
  s+=rc(.9,.9,W-1.8,2,'#ffffff',.6,`${NO} opacity=".35"`)+hi(`M3.4 ${gh-6}L8 4`,.6,.45)+rc(0,-.7,W,1.7,C.dmetal,.5)+rc(0,gh-.6,W,1.8,sh(c,.85),.5);
  return PC(W,H,s,[['1','float',3,3.6,18,18],['2','float',19,3.6,34,18]],[{t:'bub',r:[W-9,2,W,gh],e:[W-4,gh-7]}]);};
/* Muschel-Sessel (1 Platz) */
F.muschelsessel=o=>{const c=o.c||'#f0b8a8',c2=sh(c,.82);let s=shadow(13,24,13,1.2);
  s+=pa('M13 22Q-1 20 1 9Q3 1 13 .6Q23 1 25 9Q27 20 13 22z',c)+[-3,-2,-1,0,1,2,3].map(i=>ln(`M13 20Q${f2(13+i*2.6)} 12 ${f2(13+i*3.6)} ${f2(3.2+Math.abs(i)*1.3)}`,c2,.35,.8)).join('');
  s+=rc(3.4,14.6,19.2,6.4,sh(c,1.1),2.6)+rc(2.6,19.6,20.8,3.4,c2,1.4)+rc(5,22.6,2,1.6,C.w3,.3)+rc(19,22.6,2,1.6,C.w3,.3);
  return PC(26,24.2,s,[['1','shelf',5.6,2.4,20.4,15.6]]);};
/* Regal aus einem alten Boot (3 Plätze) */
F.bootregal=o=>{const c=o.c||'#5f97ad',W=18,H=46;
  let s=shadow(W/2,H,W*.56,1)+pa(`M0 ${H}V12Q0 0 ${W/2} -3Q${W} 0 ${W} 12V${H}z`,c)+pa(`M1.7 ${H-1.2}V12.4Q1.7 2.4 ${W/2} -.6Q${W-1.7} 2.4 ${W-1.7} 12.4V${H-1.2}z`,'#f3e6c8',`stroke="${sh(c,.6)}" stroke-width=".3"`);
  s+=rc(1.7,2,W-3.4,3,'#3c2814',0,`${NO} opacity=".08"`)+[16.6,31].map(y=>rc(1.7,y,W-3.4,1.3,c,.2)+rc(1.7,y+1.3,W-3.4,1,'#3c2814',0,`${NO} opacity=".1"`)).join('');
  s+=rc(0,H-4.4,1.7,1.4,'#fffaf0',0,NO)+rc(W-1.7,H-4.4,1.7,1.4,'#fffaf0',0,NO)+rc(0,H-1.2,W,1.2,sh(c,.8),.3)+hi(`M.8 ${H-6}V13`,.3,.35);
  return PC(W,H,s,[['1','shelf',2,3.4,16,16.6],['2','shelf',2,17.9,16,31],['3','shelf',2,32.3,16,45]]);};
/* Fischernetz mit Seestern und Muscheln */
F.netz=o=>{const W=34,H=16;let s='';
  for(let i=0;i<=8;i++){const x=i*W/8,y0=1+Math.sin(i/8*Math.PI)*3.2;s+=ln(`M${f2(x)} ${f2(y0)}Q${f2(x+(4-i)*.5)} ${f2(H*.6)} ${f2(W/2+(i-4)*2.4)} ${f2(H-1-Math.abs(i-4)*.5)}`,'#b59b72',.22,.8);}
  for(let j=1;j<5;j++)s+=ln(`M${f2(j*1.6)} ${f2(j*2.6+1)}Q${W/2} ${f2(j*3+5)} ${f2(W-j*1.6)} ${f2(j*2.6+1)}`,'#b59b72',.22,.8);
  s+=ln(`M0 1Q${W/2} 7.4 ${W} 1`,'#8a6548',.6)+ci(0,1,.9,C.w3)+ci(W,1,.9,C.w3);
  s+=pa(starD(11,8.4,2.8,.5),'#e8857a')+pa(starD(23.6,10.6,2,.5),'#f0c35a')+pa('M16 9.6q1.6-2.6 3.2 0l-.5 1.6h-2.2z','#f6e6d4')+ln('M17.6 8.6v2.4M16.8 9.2l.4 1.8M18.4 9.2l-.4 1.8','#d9b8a0',.2,.8);
  s+=ci(6,5.4,1,C.terra)+ci(28.6,5.8,1,'#fffaf0')+ci(17,5.6,.9,C.sea);
  return PC(W,H,s);};
/* Korallen-Lampe */
F.koralle=o=>{const c=o.c||'#f08a7a';const d='M6 17V9M6 13Q2.6 11.6 2.4 7M6 11Q9.6 9.6 9.8 5M6 9Q4.6 6 5.4 2.6M2.4 9.6Q.8 8.6 .8 6.6M9.8 8Q11.4 7 11.4 5';
  let s=shadow(6,20,5,.8)+ln(d,sh(c,.7),2,.5)+ln(d,c,1.5)+ln('M6 16.6V9.4M5.2 5.6l.2-2.4',sh(c,1.3),.4,.6)+pa('M2 16.6h8l-1 3.6H3z','#e9dcc6')+rc(1.6,15.8,8.8,1.4,'#d9c8ac',.5);
  return PC(12,20.2,s,[],[{t:'lamp',r:[-3,-2,15,18],g:[6,8,13]}]);};
/* große Muschel (antippbar: Meeresrauschen) */
F.muschel=o=>{let s=shadow(7,9,7,.8)+pa('M1 6.4Q2 1 8 .8q5 .4 5.4 4.4.2 3-3 3.6H3.4Q1 8.6 1 6.4z','#f6d9c4')+ln('M4 8.4Q3.4 4.6 6.6 2.2M6.4 8.6Q6 5 9 2.4M9 8.6q0-3 2.4-4.6','#d9a890',.3,.8)+pa('M10.2 5.4q2.8-.4 3.6 1.6-1.4 1.6-3.8 1.6z','#f0b0a0');
  return PC(14,9,s,[],[{t:'muschel',r:[-2,-3,16,10]}]);};
F.anker=o=>{const c=o.c||'#6f7f88';let s=ci(6,1.8,1.5,'none',`stroke="${c}" stroke-width=".8"`)+ln('M6 3.3V14M2.8 6h6.4M1 10q.6 4 5 4t5-4M1 10l-.8 1.6M1 10l1.6 .8M11 10l.8 1.6M11 10l-1.6 .8',c,1)+ln('M6 4v9',sh(c,1.4),.3,.5);return PC(12,14.6,s);};

/* ---------- Dschungel-Gewächshaus ---------- */
/* Pflanztisch (3 Plätze), unten Töpfe und ein Sack Erde */
F.pflanztisch=o=>{const c=o.c||'#9a7a56',W=40,sw=(W-2)/3;let s=shadow(W/2,22,W*.52,1.1)+rc(2,2.6,2.4,19.4,sh(c,.74),.4)+rc(W-4.4,2.6,2.4,19.4,sh(c,.74),.4)+rc(1.4,13.6,W-2.8,1.6,sh(c,.86),.3);
  [[6,C.terra],[12.6,'#e9dcc6'],[19.2,C.terra]].forEach(([x,pc],i)=>s+=leaf(x+2.5,9.6,-24,4,.9,C.leaf)+leaf(x+2.5,9.6,22,4.4,.9,C.moss)+(i===1?ci(x+2.5,5.6,1,C.rose)+ci(x+2.5,5.6,.4,C.sun,NO):'')+pa(`M${x} 9.4h5l-.7 4.2h-3.6z`,pc));
  s+=pa(`M${W-14} 13.6l.8-6h8.4l.8 6z`,'#c9b28a')+ln(`M${W-12} 10.4h6`,sh('#c9b28a',.7),.3,.7)+leaf(W-9,7.6,0,2.4,.8,C.leaf,0);
  s+=rc(0,0,W,2.8,c,.7)+hi(`M1 .8h${W-2}`,.28,.4)+ln(`M${W*.33} .4v2M${W*.66} .4v2`,sh(c,.7),.25,.6);
  return PC(W,22,s,[0,1,2].map(i=>[String(i+1),'shelf',1+i*sw,-13,1+(i+1)*sw,.3]));};
/* Blumenampel */
F.ampel=o=>{const L=o.cord==null?8:o.cord,c=o.c||C.terra;let s=ln(`M8 ${-L}L3 4M8 ${-L}L13 4M8 ${-L}V3`,C.w4,.25,.8)+ci(8,-L,.5,C.w4,NO);
  s+=ln('M3.4 6q-2.4 4-1 9M12.8 6q2.6 5 .6 11M6.4 8.6q-.6 4 .4 7',C.leaf,.4,.9)+[[2.3,10,-70],[2.5,14,70],[13.6,10.6,70],[13.9,15,-70],[6,12,70],[6.5,15.4,-70]].map(([x,y,a],i)=>leaf(x,y,a,2,.7,i%2?C.moss:C.leaf,0)).join('');
  [-74,-44,-14,14,44,74].forEach((a,i)=>s+=leaf(8,4.6,a,6+(i%2)*2,1,i%2?C.moss:C.leaf,a<0?.3:-.3));
  s+=pa('M2.4 4h11.2q-.6 5-5.6 5T2.4 4z',c)+rc(2,3.4,12,1.3,sh(c,.86),.5)+(o.f===0?'':ci(5,1.4,1,o.fc||C.rose)+ci(10.6,.8,1,o.fc||C.sun)+ci(8,-.4,.9,'#fffaf0'));
  return PC(16,17,s);};
/* Bananenstaude (groß) */
F.staude=o=>{const g1='#5f9a5a',g2='#7fb06a',st='#8fae6a';let s=shadow(12,44,8,1)+pa('M10.2 44Q11 30 10.6 20h3q-.4 10 .6 24z',st)+ln('M11.6 22q.4 10-.2 20M12.6 24q.2 8 .6 16',sh(st,.7),.3,.6);
  [[-66,19,4],[-36,23,4.6],[-9,26,4.4],[20,24,4.6],[50,21,4.2],[78,16,3.4]].forEach(([a,l,b],i)=>{const r=a*Math.PI/180,k=a<0?.2:-.2,nx=-Math.cos(r),ny=-Math.sin(r),tx=12+Math.sin(r)*l+nx*l*k,ty=21-Math.cos(r)*l+ny*l*k;
    s+=leaf(12,21,a,l,b,i%2?g2:g1,k)+ln(`M12 21Q${f2(12+Math.sin(r)*l*.5+nx*l*k*.4)} ${f2(21-Math.cos(r)*l*.5+ny*l*k*.4)} ${f2(tx)} ${f2(ty)}`,'#d6e8a8',.3,.7);});
  s+=pa('M9.4 22q2.6-2 5.2 0l-.6 3h-4z',sh(st,.86))+(o.b===0?'':el(15.4,27,1.2,2.6,'#f0c35a')+el(17,26.6,1.1,2.4,'#e9b93a')+el(13.8,27.4,1.1,2.4,'#f5d36a'));
  return PC(24,44,s);};
/* Liane von der Decke */
F.liane=o=>{const H=o.h||30,g=C.leaf;let s=ln(`M2 0Q7 ${f2(H*.3)} 3 ${f2(H*.6)}T5 ${H}`,sh(g,.78),.5);
  for(let i=1;i<9;i++){const t=i/9,y=H*t,x=3.2+Math.sin(t*5.4)*1.9;s+=leaf(x,y,i%2?72:-72,3.2,1,i%2?C.moss:g,.1);}return PC(8,H,s);};
F.frosch=o=>PC(8,6,el(4,5,4,1.3,'#6fa05a')+ln('M4 5l3-1',sh('#6fa05a',.7),.25,.7),[],[{t:'frosch',r:[-3,-5,11,7],sp:[1,-.6,6,6]}]);
F.falter=o=>PC(10,10,'',[],[{t:'falter',r:[0,0,10,10],sp:[2,2,6,6]}]);
/* Felsbrocken (1 Platz) */
F.fels=o=>{const c=o.c||'#b9ae9c',W=o.w||18;let s=shadow(W/2,9,W*.55,1)+pa(`M.6 9Q0 4 3 2.4l${f2(W*.3)}-1.6 ${f2(W*.36)} .6Q${W} 4 ${f2(W-.6)} 9z`,c)+ln(`M4 4l2 3M${W-6} 3l-1.6 3.6`,sh(c,.72),.3,.6)+el(W*.3,8.4,2.4,.8,'#7fa66a',`${NO} opacity=".8"`)+hi(`M4 2.6l${f2(W*.26)}-1.2`,.35,.4);
  return PC(W,9,s,[['1','shelf',1,-12,W-1,1.6]]);};
/* liegender Baumstamm (2 Plätze) */
F.stamm=o=>{const W=o.w||30,c='#a8825a';let s=shadow(W/2,10,W*.52,1)+rc(2,1,W-4,9,c,3)+el(W-3,5.5,2.6,4.5,'#dcc09a')+el(W-3,5.5,1.4,2.6,'none',`stroke="#b89468" stroke-width=".25"`)+ln(`M5 3.6h${W-12}M6 7h${W-14}`,sh(c,.7),.3,.6)+el(7,1.4,3,.8,'#7fa66a')+leaf(4,1.4,-40,3,.8,C.leaf)+ci(W*.6,1.2,.8,C.terra)+rc(W*.6-.3,1.2,.6,1.4,'#f6ead0',.2,NO);
  return PC(W,10,s,[['1','shelf',1,-12.4,W/2-1,1.2],['2','shelf',W/2-1,-12.4,W-3,1.2]]);};

/* ---------- Eiszeit-Zimmer ---------- */
F.eisblock=o=>{const W=o.w||15,H=o.h||11,c='#cfeaf2';let s=shadow(W/2,H,W*.56,.9,.1)+pa(`M1 ${H}L0 2.6 2.4 0H${W-2.4}L${W} 2.6 ${W-1} ${H}z`,c,ol('#8fbccb',.3,.8))+pa(`M0 2.6L2.4 0H${W-2.4}L${W} 2.6z`,'#f1fafc',NO)+ln(`M3.6 4.6l2 4M${W-5} 4l-1.4 5`,'#ffffff',.4,.7)+hi(`M2 4v${H-5.4}`,.5,.6);
  return PC(W,H,s,[['1','shelf',0,-13,W,.6]]);};
/* Iglu – ein Schneehase schaut heraus */
F.iglu=o=>{const c='#f6fbfd',l='#a9cfdc';let s=shadow(17,20,18,1.1,.12)+pa('M1 20Q1 2 17 2T33 20z',c,ol(l,.35,.9));
  [15.4,10.8,6.4].forEach((y,j)=>{const hw=16*Math.sqrt(1-Math.pow((20-y)/18,2));s+=ln(`M${f2(17-hw)} ${y}H${f2(17+hw)}`,l,.3,.8);
    const n=6-j;for(let i=1;i<n;i++)s+=ln(`M${f2(17-hw+hw*2*(i+(j%2?.5:0))/n)} ${y}v${j===0?4.4:4.4}`,l,.3,.8);});
  for(let i=1;i<4;i++)s+=ln(`M${f2(6+i*5.6)} 2.6v3.6`,l,.3,.6);
  s+=pa('M10.6 20v-6.4q0-5.4 6.4-5.4t6.4 5.4V20z','#e3f1f5',ol(l,.35,.9))+pa('M12.6 20v-6q0-3.8 4.4-3.8t4.4 3.8v6z','#3d4f63',NO);
  return PC(34,20,s,[],[{t:'iglu',r:[9,6,25,20],sp:[13,11.4,8,8.6]}]);};
/* Höhlenbild: Mammut (antippbar) */
F.hoehlenbild=o=>{const c='#a8553a';let s=pa('M2 10Q0 2 9 2q6-3 13-.6 8-1 7.6 6.6.8 7-6 8-8 3-16 .6Q1 16 2 10z','#ead9bc',`${NO} opacity=".8"`);
  s+=pa('M6 15.4V10Q5.6 5 10.6 4.4q2.6-2.2 6-1.4 3.6-.6 5 2.2 1.8 1.8 1.6 5 0 3-1.4 4.6-.2-3.2-1.4-4.4l-.6 5H17l-.4-3.6h-4.8l-.4 3.6H8.8l-.6-4z',c,`${NO} opacity=".88"`);
  s+=ln('M21.6 9.2q1 3 4 1.6',c,.7,.88)+ci(20,6.4,.4,'#ead9bc',NO)+ln('M9 5q3-2 7-.8',sh(c,.7),.3,.6);
  s+=pa(starD(4.6,5,1.4,.5),'none',`stroke="${c}" stroke-width=".35" opacity=".7"`)+ln('M25.6 14.6l1-1.4M27 15.2l.2-1.6M24.6 15.6l-.6-1.4',c,.4,.7);
  return PC(30,18,s,[],[{t:'mammut',r:[1,0,29,18]}]);};
F.lagerfeuer=o=>{let s=shadow(9,13.6,9.6,1,.14);[[2.4,12.2],[5.6,13],[9,13.3],[12.4,13],[15.6,12.2]].forEach(([x,y],i)=>s+=el(x,y,2,1.3,i%2?'#a9a096':'#8f8676'));
  s+=gr(rc(3,9.6,12,2,C.w3,.9),'rotate(-12 9 10.6)')+gr(rc(3,9.6,12,2,C.w2,.9),'rotate(12 9 10.6)');
  s+=pa('M9 .6q5 5.2 2.2 9.6-1.8 2.4-4.8 1.3Q2.6 9.1 5.4 4.9q.4 2.2 1.6 2.4Q6.4 3.6 9 .6z','#f08a3c',NO)+pa('M8.8 5.2q2.6 2.8 1.1 5.2-1.3 1.5-2.8 .4-1.5-1.7 .2-3.3 .5 .9 1.1 .9-.2-1.7 .4-3.2z','#f7d36a',NO);
  return PC(18,14,s,[],[{t:'fire',r:[0,-2,18,14],g:[9,7,13]}]);};
/* Schlitten (2 Plätze) */
F.schlitten=o=>{const c=o.c||C.w2;let s=shadow(15,11,15,.9,.12)+ln('M2 10.4h24q3.4 0 3.4-3.2',C.w3,1)+ln('M6 10V5.4M14 10V5.4M22 10V5.4',C.w3,.9)+rc(2,3.4,24,2.2,c,.7)+ln('M3 4.5h22',sh(c,.7),.25,.7)+ln('M26 4.4q5 .6 4-2.4',C.terra,.4);
  return PC(30,11,s,[['1','shelf',2,-9.4,14,3.8],['2','shelf',14,-9.4,26,3.8]]);};
F.schneemann=o=>{const c='#fbfdfd',l='#a9cfdc';let s=shadow(8,25,8,1,.12)+ln('M3 15.6l-4-3M13 15.6l4-3M-1 12.6l-.4-1.6M17 12.6l.4-1.6',C.w3,.5)+ci(8,18.6,6.4,c,ol(l,.3,.9))+ci(8,9.6,4.6,c,ol(l,.3,.9))+rc(4.6,2,6.8,3.6,'#4a4a52',.5)+rc(3.4,5,9.2,1.1,'#4a4a52',.4)+rc(4.6,4,6.8,.9,C.terra,0,NO);
  s+=ci(6.4,8.8,.5,C.ink,NO)+ci(9.6,8.8,.5,C.ink,NO)+pa('M8 10l3.6 .9L8 11.4z','#e9873a')+ln('M6 12q2 1.4 4 0',C.ink,.3,.8)+pa('M4 13.2q4 1.8 8 0l.4 1.6q-4.4 1.8-8.8 0z',C.terra)+rc(10.4,14,1.8,4.4,C.terra,.5)+ci(8,17.4,.5,C.ink,NO)+ci(8,20.2,.5,C.ink,NO);
  return PC(16,25,s,[],[{t:'schneemann',r:[-2,0,18,25],e:[8,5]}]);};
F.tanne=o=>{const g=o.c||'#5f8f6a';let s=shadow(9,30,7,1,.12)+rc(7.8,24,2.4,6,'#8a6548',.4);[[9,2,5,9],[9,8,7,10],[9,15,9,11]].forEach(([x,y,w,h])=>s+=pa(`M${x} ${y}L${x+w} ${y+h}H${x-w}z`,g)+pa(`M${x} ${y}l${f2(w*.5)} ${f2(h*.5)}q-${f2(w*.25)} -1.4 -${f2(w*.5)} 0t-${f2(w*.5)} 0z`,'#fbfdfd',NO));
  return PC(18,30,s);};
F.eiszapfen=o=>{let s='';[[2,9],[6,14],[10,8],[14,12],[18,7]].forEach(([x,h])=>s+=pa(`M${x-1.8} 0h3.6L${x} ${h}z`,'#e6f5f9',ol('#8fbccb',.25,.8))+hi(`M${f2(x-.6)} 1v${f2(h*.5)}`,.3,.7));return PC(20,14,s,[],[{t:'eiszapfen',r:[-1,-1,21,15],e:[10,10]}]);};

/* ---------- Vulkan-Labor ---------- */
/* Vulkan-Modell auf einem Tischchen (antippbar: Ausbruch) */
F.vulkanmodell=o=>{const c=C.w2,rk='#8a6f5e';let s=shadow(15,30,16,1.1)+rc(2.6,20,2,10,sh(c,.76),.4)+rc(25.4,20,2,10,sh(c,.76),.4)+rc(2.6,22.6,24.8,1.2,sh(c,.86),.3)+rc(0,17.6,30,2.6,c,.7)+hi('M1 18.3h28',.28,.4);
  s+=pa('M2 17.8Q9 15 11.6 5.4L13 2.6h4l1.4 2.8Q21 15 28 17.8z',rk)+ln('M8.6 15q2.6-4 3.6-9M21.4 15q-2.6-4-3.6-9M6 17q3-2 4.4-5M24 17q-3-2-4.4-5',sh(rk,.72),.3,.6);
  s+=pa('M12.8 3q2.2-1.6 4.4 0l.5 1.6q-1.2 3.4-.6 6.4-1 1.6-2 .2.6-3.4-.8-5-1 2.6-.4 5.4-1.2 .8-1.8-.6.6-3.4-.2-6.2z','#f0703c',NO)+pa('M13.4 3q1.6-1 3.2 0-.4 1.6-1.6 1.6T13.4 3z','#f7d36a',NO);
  s+=el(6,17.5,3,.9,'#7fa66a')+el(24.4,17.4,2.6,.8,'#7fa66a')+ln('M5 17.2v-2.6',C.w3,.4)+ci(5,13.8,1.4,C.leaf)+ln('M25.4 17.2v-2',C.w3,.4)+ci(25.4,14.4,1.2,C.moss);
  return PC(30,30,s,[],[{t:'vulkan',r:[5,-8,25,18],e:[15,2],g:[15,3,10]}]);};
/* Labortisch: Glaskolben antippbar, 2 Plätze */
F.labortisch=o=>{const c=o.c||'#8a9aa0',W=42;let s=shadow(W/2,24,W*.52,1.2)+rc(2,3,2.4,21,sh(c,.74),.4)+rc(W-4.4,3,2.4,21,sh(c,.74),.4)+rc(2,14,W-4,1.4,sh(c,.82),.3);
  s+=rc(7,8,10,6,'#c9705c',.6)+ln('M9 8q3-2.6 6 0',C.dmetal,.5)+rc(20,9.4,12,4.6,'#d2b48a',.4)+ln('M20 11.6h12',sh('#d2b48a',.7),.25,.7);
  s+=rc(0,0,W,3,'#efe7d6',.7)+hi(`M1 .8h${W-2}`,.28,.4);
  s+=pa('M4.4 0l2.2-5.2v-2.6h2v2.6L10.8 0z','#e3f2ee',ol('#7d8a90',.3,.8))+pa('M5.3-.5l1.2-2.8h2.2l1.2 2.8z','#8fcf7a',NO)+rc(6.2,-8.6,2.8,.8,'#7d8a90',.3);
  s+=rc(13.6,-8,1.6,3,'#e3f2ee',.3,ol('#7d8a90',.3,.8))+ci(14.4,-3,3,'#e3f2ee',ol('#7d8a90',.3,.8))+pa('M11.7 -2.4q2.7 1.4 5.4 0-.4 2.2-2.7 2.2t-2.7-2.2z','#e8857a',NO)+hi('M12.6 -4.4q.6-1 1.4-1.2',.3,.7);
  return PC(W,24,s,[['1','shelf',18,-13,30,.3],['2','shelf',30,-13,W-.4,.3]],[{t:'kolben',r:[2,-10,18,1],e:[10,-8]}]);};
/* Tafel mit Vulkan-Zeichnung */
F.tafel=o=>{const W=o.w||30,H=o.h||20;let s=rc(.4,.6,W,H,'#3c2814',.6,`${NO} opacity=".14"`)+rc(0,0,W,H,C.w2,.6)+rc(1.3,1.3,W-2.6,H-2.6,'#4f6a5c',.3,NO);
  s+=ln(`M4 ${H-3.6}L${f2(W*.42)} 6h${f2(W*.16)}L${W-4} ${H-3.6}`,'#f4efe0',.4,.9)+ln(`M${W/2} ${H-3.6}V6`,'#f08a6a',.8,.9)+el(W/2,H-3.8,4.4,1.5,'none',`stroke="#f08a6a" stroke-width=".5" opacity=".9"`);
  s+=ln(`M${W/2-1.4} 5q-1.6-1.4-.6-2.6M${W/2+1.4} 5q1.6-1.4 .6-2.6M${W/2} 4.6V2.4`,'#f7d36a',.4,.9)+ln(`M4.4 5h4M4.4 6.6h2.6M${W-8} 4.6h3.6`,'#f4efe0',.3,.6);
  s+=rc(W*.3,H-.6,W*.4,1.2,C.w3,.4)+rc(W*.34,H-1.3,2.6,.8,'#fffaf0',.2,NO)+rc(W*.5,H-1.3,2,.8,'#f08a6a',.2,NO);
  return PC(W,H+.6,s);};
F.lavalampe=o=>{let s=el(4,15.4,3.4,.8,C.dmetal)+pa('M1.6 15L2.6 11h2.8l1 4z',C.dmetal)+pa('M2.4 11L3 2.4h2L5.6 11z','#f7c8a0',ol('#c8553d',.3,.7))+ci(4,8.6,1,'#e8553d',NO)+ci(3.8,5.8,.7,'#e8553d',NO)+ci(4.2,3.8,.5,'#e8553d',NO)+pa('M2.8 2.4h2.4L4.8 .6H3.2z',C.dmetal);
  return PC(8,16,s,[],[{t:'lamp',r:[-3,-2,11,16],g:[4,7,10]}]);};
F.kristall=o=>{const c=o.c||'#c9a9d6';let s=shadow(8,13,8,.9)+pa('M3 13L1.4 7l2.2-2.4L6 7.4 5.4 13z',sh(c,.9))+pa('M5.6 13L5 4l3-4 3 4-.6 9z',c)+pa('M10.6 13l.2-5 2.4-2 1.8 2.6-.8 4.4z',sh(c,1.12))+ln('M8 0v13M3.6 4.6V13M13.2 6v7','#ffffff',.25,.5)+hi('M6.4 4.4l1-1.6',.4,.7);
  return PC(16,13,s,[],[{t:'kristall',r:[-2,-2,18,14],e:[8,3]}]);};

/* ---------- Sternwarte ---------- */
/* großes Kuppelfenster mit Nachthimmel (antippbar) */
F.kuppelfenster=o=>{const W=44,H=32,fc=o.f||'#8a94b8',d=(a,b)=>`M${a} ${H-b}V${f2(H*.62)}Q${a} ${a} ${W/2} ${a}T${W-a} ${f2(H*.62)}V${H-b}z`;
  let s=pa(d(0,0),fc)+`<g ${clip(`<path d="${d(2,2)}"/>`)}><svg x="0" y="0" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${skyInner({night:1,bare:1},W,H)}</svg>`;
  s+=ln('M6 9l5-3.4',  '#fff8d8',.4,.9)+ci(5.6,9.2,.6,'#fff8d8',NO)+ln('M9 21l3.4-2 3 1.6 3.6-3',  '#cfd8f4',.2,.7)+[[9,21],[12.4,19],[15.4,20.6],[19,17.6]].map(([x,y])=>ci(x,y,.5,'#fff8d8',NO)).join('');
  s+=pa(`M0 ${H}v-5q8-4 16-1.6t14-1.4 14 .6V${H}z`,'#2a3558',NO)+pa(`M30 ${H-5.4}l1.6-3.4 1.6 3.4z`,'#1f2846',NO)+rc(31.2,H-5.4,.8,1.6,'#1f2846',0,NO)+'</g>';
  s+=ln(`M${W/2} 2V${H-2}M2 ${f2(H*.62)}H${W-2}M${W*.25} ${f2(H*.2)}V${H-2}M${W*.75} ${f2(H*.2)}V${H-2}`,fc,.8)+rc(-1.4,H-1.4,W+2.8,2.2,sh(fc,.85),.7)+hi(`M4 ${H*.5}Q5 8 14 4.4`,.5,.3);
  return PC(W,H+1,s,[],[{t:'sterne',r:[3,3,W-3,H-3],e:[W/2,H*.4]}]);};
F.teleskop=o=>{const c='#c9a04a';let s=shadow(11,30,9,1)+ln('M11 14L4 30M11 14l7 16M11 14v15',C.w3,1)+ln('M6.6 24h8.8',C.w3,.5)
  +gr(rc(-9,-2.6,18,5.2,c,1.2)+rc(8,-3.4,5.4,6.8,sh(c,.85),.8)+rc(-12.4,-1.6,3.6,3.2,sh(c,.8),.6)+rc(-3,-2.6,1.4,5.2,sh(c,.7),0,NO)+hi('M-8 -1.4h15',.4,.5),'translate(11 12) rotate(-32)')+ci(11,14,1.4,C.w4);
  return PC(22,30,s,[],[{t:'teleskop',r:[-2,-6,24,20],e:[21,-2]}]);};
F.sitzsack=o=>{const c=o.c||'#6f7fb8';let s=shadow(11,14,11.6,1.1)+pa('M2 13.6Q-1 8 3.4 4.4 7 .6 11.4 2.6q5.6-1.2 8.2 3.4 2.6 5-1 7.6z',c)+ln('M5 6.4q5 2.6 12 .4',sh(c,.78),.35,.7)+ln('M11 2.8q-.6 2 .4 4',sh(c,.78),.3,.6);
  [[5.4,10],[15.6,10.6],[10.6,11.6],[17.4,7]].forEach(([x,y],i)=>s+=pa(starD(x,y,i%2?.8:1.1,.45),'#f5e3a0',NO));
  return PC(22,14,s,[['1','shelf',3.4,-8.6,18.6,6]]);};
F.rakete=o=>PC(12,24,shadow(6,23.6,5,.9)+el(6,23,4.6,1,'#8f8676'),[],[{t:'rakete',r:[0,0,12,24],sp:[.5,0,11,23]}]);
F.mobile=o=>PC(26,20,'',[],[{t:'mobile',r:[0,0,26,20],sp:[0,0,26,20]}]);
F.sternkarte=o=>{const W=o.w||20,H=o.h||14;let s=rc(.3,.5,W,H,'#3c2814',.5,`${NO} opacity=".14"`)+rc(0,0,W,H,C.gold,.5)+rc(1.1,1.1,W-2.2,H-2.2,'#2f3c6e',.2,NO);
  const P=[[.18,.62],[.3,.36],[.46,.5],[.6,.28],[.78,.4],[.7,.7],[.5,.76]];s+=ln('M'+P.map(([a,b])=>f2(W*a)+' '+f2(H*b)).join('L'),'#cfd8f4',.2,.8)+P.map(([a,b],i)=>ci(W*a,H*b,i%3?.45:.65,'#fff8d8',NO)).join('');
  return PC(W,H,s+ci(W*.84,H*.24,1.2,'#fbf1c8',NO)+ci(W*.84+.6,H*.24-.4,1,'#2f3c6e',NO));};

/* =====================================================================
   3 · Wände und Böden
   ===================================================================== */
const WALL={}, BODEN={};
/* gemeinsame Lasur: Licht von oben, Schatten an Decke und Ecken, Fußleiste */
function wallWash(UW,FY,base){let s=rc(0,0,UW,FY,rgrad([[0,'#fffaf0',.42],[1,'#fffaf0',0]],.5,.3,.62),0,NO);
  s+=rc(0,0,UW,7,grad([[0,'#3c2814',.16],[1,'#3c2814',0]]),0,NO)+rc(0,0,9,FY,grad([[0,'#3c2814',.1],[1,'#3c2814',0]],1,0),0,NO)+rc(UW-9,0,9,FY,grad([[0,'#3c2814',0],[1,'#3c2814',.1]],1,0),0,NO);
  if(base)s+=rc(0,FY-2.2,UW,2.2,base,0)+hi(`M0 ${FY-1.9}h${UW}`,.25,.35);
  return s;}
WALL.streifen=(UW,UH,FY,a,b,base)=>rc(0,0,UW,FY,pattern(8,8,rc(0,0,8,8,a,0,NO)+rc(0,0,3.4,8,b,0,NO)),0,NO)+wallWash(UW,FY,base||C.w2);
WALL.punkte=(UW,UH,FY,a,b,base)=>rc(0,0,UW,FY,pattern(7,7,rc(0,0,7,7,a,0,NO)+ci(1.75,1.75,.62,b,NO)+ci(5.25,5.25,.62,b,NO)),0,NO)+wallWash(UW,FY,base||C.w2);
WALL.rauten=(UW,UH,FY,a,b,base)=>rc(0,0,UW,FY,pattern(8,10,rc(0,0,8,10,a,0,NO)+pa('M4 1L7 5 4 9 1 5z','none',`stroke="${b}" stroke-width=".4"`)+ci(4,5,.45,b,NO)),0,NO)+wallWash(UW,FY,base||C.w2);
WALL.blumen=(UW,UH,FY,a,b,base)=>rc(0,0,UW,FY,pattern(11,11,rc(0,0,11,11,a,0,NO)+[[2.6,2.8],[8.1,8.3]].map(([x,y])=>[0,1,2,3,4].map(i=>ci(x+Math.cos(i*1.2566)*.9,y+Math.sin(i*1.2566)*.9,.6,b,NO)).join('')+ci(x,y,.45,'#fbe9a8',NO)).join('')+leaf(8.2,3,40,1.6,.5,sh(a,.86),0)+leaf(2.6,8.4,-40,1.6,.5,sh(a,.86),0)),0,NO)+wallWash(UW,FY,base||C.w2);
/* halbhoch gefliest (Bad, Küche): a Wandfarbe oben, b Fliese, c Bordüre */
WALL.fliesen=(UW,UH,FY,a,b,c)=>{const y0=FY*.46;return rc(0,0,UW,FY,a,0,NO)+rc(0,y0,UW,FY-y0,pattern(6,6,rc(0,0,6,6,b,0,NO)+ln('M0 0h6M0 0v6',sh(b,1.25),.35,.9)+ci(3,3,.3,sh(b,.9),NO)),0,NO)
  +rc(0,y0-1.4,UW,1.8,c||C.sea,0)+wallWash(UW,FY,sh(b,.8));};
/* Holzvertäfelung unten, Farbe oben */
WALL.paneel=(UW,UH,FY,a,b,base)=>{const y0=FY*.6;let s=rc(0,0,UW,FY,a,0,NO)+rc(0,y0,UW,FY-y0,b,0,NO);for(let x=4;x<UW;x+=13)s+=rc(x,y0+2.4,9,FY-y0-6,sh(b,1.08),.5,`stroke="${sh(b,.78)}" stroke-width=".25"`);
  return s+rc(0,y0-.9,UW,1.5,sh(b,.9),0)+wallWash(UW,FY,base||sh(b,.8));};

function floorShade(UW,FY){return rc(0,FY,UW,5.5,grad([[0,'#3c2814',.2],[1,'#3c2814',0]]),0,NO);}
/* Holzdielen, leicht aufgefächert (Tiefe) */
BODEN.dielen=(UW,UH,FY,a)=>{const R=rng(7),k=.42;let s=rc(0,FY,UW,UH-FY,a,0,NO),i=0;
  for(let x=-30;x<UW+30;x+=9.5,i++){const X=t=>x+(x-UW/2)*k*t;if(i%2)s+=pa(`M${f2(x)} ${FY}L${f2(X(1))} ${UH}h${f2(9.5*(1+k))}L${f2(x+9.5)} ${FY}z`,sh(a,1.07),`${NO} opacity=".6"`);
    s+=ln(`M${f2(x)} ${FY}L${f2(X(1))} ${UH}`,sh(a,.74),.28,.75);const t=.2+R()*.7,y=FY+(UH-FY)*t;s+=ln(`M${f2(X(t))} ${f2(y)}h${f2(9.5*(1+k*t))}`,sh(a,.74),.22,.6);}
  return s+floorShade(UW,FY);};
/* Schachbrett-Fliesen */
BODEN.fliesen=(UW,UH,FY,a,b)=>{const k=.42,rows=[0,.2,.46,.74,1.08],cw=10;let s=rc(0,FY,UW,UH-FY,a,0,NO),i=0;
  for(let x=-40;x<UW+40;x+=cw,i++)for(let j=0;j<4;j++){if((i+j)%2)continue;const y0=FY+(UH-FY)*rows[j],y1=FY+(UH-FY)*rows[j+1],X=(xx,t)=>xx+(xx-UW/2)*k*t;
    s+=pa(`M${f2(X(x,rows[j]))} ${f2(y0)}L${f2(X(x+cw,rows[j]))} ${f2(y0)}L${f2(X(x+cw,rows[j+1]))} ${f2(y1)}L${f2(X(x,rows[j+1]))} ${f2(y1)}z`,b,NO);}
  return s+floorShade(UW,FY);};
/* Teppichboden */
BODEN.teppich=(UW,UH,FY,a,b)=>rc(0,FY,UW,UH-FY,pattern(3,3,rc(0,0,3,3,a,0,NO)+ci(.8,.8,.3,b||sh(a,.9),NO)+ci(2.3,2.3,.3,b||sh(a,1.1),NO)),0,NO)+floorShade(UW,FY);

/* =====================================================================
   4 · Zimmer zusammenbauen: Zeichnung + Plätze + antippbare Dinge
   ===================================================================== */
const BUILT=new Map();
function build(id,lay){
  const key=id+'|'+lay+'|'+ENVV.sig; if(BUILT.has(key))return BUILT.get(key);
  const R=ROOMS[id],[UW,UH]=U[lay],FY=FLOOR[lay]; GID=0; DEFS='';
  let body=(WALL[R.wall[0]]||WALL.streifen)(UW,UH,FY,R.wall[1],R.wall[2],R.wall[3],lay)+(BODEN[R.floor[0]]||BODEN.dielen)(UW,UH,FY,R.floor[1],R.floor[2],lay);
  const spots=[],hots=[]; const px=v=>f2(v/UW*100),py=v=>f2(v/UH*100);
  (R[lay]||[]).forEach(([t,cx,yb,sc,o],n)=>{o=o||{};sc=sc||1;const p=F[t](o,lay),x=cx-p.w*sc/2,y=yb-p.h*sc;
    if(p.svg)body+=`<g transform="translate(${f2(x)} ${f2(y)})${sc!==1?` scale(${sc})`:''}">${p.svg}</g>`;
    p.spots.forEach(([sid,k,a,b,c,d])=>spots.push({id:(o.id||t)+sid,k,x0:px(x+a*sc),y0:py(y+b*sc),x1:px(x+c*sc),y1:py(y+d*sc)}));
    p.hots.forEach((h,i)=>{const r=h.r,H=Object.assign({},h,o.hot||{},{id:(o.id||t+n)+(i||''),x0:px(x+r[0]*sc),y0:py(y+r[1]*sc),x1:px(x+r[2]*sc),y1:py(y+r[3]*sc)});
      if(h.g)H.g=[px(x+h.g[0]*sc),py(y+h.g[1]*sc),px(h.g[2]*sc)];
      if(h.sp)H.sp=[px(x+h.sp[0]*sc),py(y+h.sp[1]*sc),px(h.sp[2]*sc),py(h.sp[3]*sc)];
      if(h.e)H.e=[px(x+h.e[0]*sc),py(y+h.e[1]*sc)];
      hots.push(H);});});
  const out={key,spots,hots,svg:`<svg xmlns="http://www.w3.org/2000/svg" width="${UW*10}" height="${UH*10}" viewBox="0 0 ${UW} ${UH}"><defs>${DEFS}</defs>${body}</svg>`};
  if(BUILT.size>40)BUILT.clear(); BUILT.set(key,out); return out;}

/* Zeichnung einmal als Bild laden und auf eine Leinwand malen (danach ist das Zimmer nur noch ein Bild → ruckelfrei) */
const IMGS=new Map();
function sceneImg(key,svgFn){
  if(!IMGS.has(key)){const o={im:new Image(),ok:false};o.im.decoding='async';
    o.ready=new Promise(res=>{o.im.onload=()=>{o.ok=true;res(o);};o.im.onerror=()=>res(o);});
    o.im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgFn());
    if(IMGS.size>5)IMGS.delete(IMGS.keys().next().value); IMGS.set(key,o);}
  return IMGS.get(key);}
let GRAIN=null;
/* Papier-Körnung und Aquarell-Wolken: die Wolken entstehen klein (1/8) und werden weich hochgezogen – das kostet fast nichts */
function grain(x,w,h,seed){
  if(!GRAIN){GRAIN=document.createElement('canvas');GRAIN.width=GRAIN.height=192;const g=GRAIN.getContext('2d'),im=g.createImageData(192,192),R=rng(11);
    for(let i=0;i<im.data.length;i+=4){const v=R()>.5;im.data[i]=v?255:80;im.data[i+1]=v?250:56;im.data[i+2]=v?236:34;im.data[i+3]=Math.floor(R()*R()*30);}g.putImageData(im,0,0);}
  const R=rng(seed||5),lw=Math.max(8,Math.round(w/8)),lh=Math.max(8,Math.round(h/8)),c=document.createElement('canvas');c.width=lw;c.height=lh;const q=c.getContext('2d');
  for(let i=0;i<14;i++){const cx=R()*lw,cy=R()*lh,r=(.12+R()*.2)*lw,g=q.createRadialGradient(cx,cy,0,cx,cy,r),col=i%2?'255,250,236':'90,62,34';
    g.addColorStop(0,`rgba(${col},${i%2?.07:.045})`);g.addColorStop(1,`rgba(${col},0)`);q.fillStyle=g;q.fillRect(cx-r,cy-r,r*2,r*2);}
  x.imageSmoothingEnabled=true;x.drawImage(c,0,0,w,h);
  x.fillStyle=x.createPattern(GRAIN,'repeat');x.fillRect(0,0,w,h);}
/* Fertig gemalte Leinwände bleiben (für die zuletzt besuchten Zimmer) erhalten: zurückkommen kostet nichts.
   Größe = Anzeigegröße × Pixeldichte, höchstens ~2,2 Megapixel (reicht für die weiche Zeichnung, schont Speicher und Zeit).
   Speicher-Deckel: höchstens 6 Leinwände UND zusammen höchstens ~9 Megapixel (≈ 36 MB) – auf einem iPad also 4 Zimmer, nie alle 15. */
const CVS=new Map(), CV_MAX=6, CV_PIX=2.2e6, CV_SUM=9e6;
function bgCanvas(key,svgFn,w,h){
  const dpr=Math.min(2,window.devicePixelRatio||1);let W=w*dpr,Hh=h*dpr;if(W*Hh>CV_PIX){const f=Math.sqrt(CV_PIX/(W*Hh));W*=f;Hh*=f;}
  W=Math.max(2,Math.round(W));Hh=Math.max(2,Math.round(Hh));const k=key+'|'+W+'|'+Hh;
  let cv=CVS.get(k);if(cv){CVS.delete(k);CVS.set(k,cv);return cv;}
  cv=document.createElement('canvas');cv.className='zh-bg';cv.width=W;cv.height=Hh;CVS.set(k,cv);
  for(let n=CVS.size;n>1;n--){let sum=0;CVS.forEach(c=>{sum+=c.width*c.height;});if(CVS.size<=CV_MAX&&(sum<=CV_SUM||CVS.size<=3))break;
    const old=CVS.keys().next().value,oc=CVS.get(old);CVS.delete(old);if(!oc.isConnected)oc.width=oc.height=1;}
  const o=sceneImg(key,svgFn);
  o.ready.then(()=>{if(!o.ok||!CVS.has(k))return;const x=cv.getContext('2d');
    try{x.drawImage(o.im,0,0,W,Hh);let s=0;for(let i=0;i<key.length;i++)s=(s*31+key.charCodeAt(i))%9973;grain(x,W,Hh,s+3);}catch(e){}
    cv.classList.add('rdy');});
  return cv;}
function freeCanvases(){CVS.forEach(c=>{c.width=c.height=1;});CVS.clear();IMGS.clear();}
/* gemaltes Bild aus grafiken-neu (falls vorhanden) – ersetzt die Zeichnung, Plätze bleiben gleich */
const A=()=>window.ASSETS&&ASSETS.url?ASSETS:null;
const artKey=(name,l)=>'stationen/haus_'+name+(l==='P'?'_hoch':'');
function artURL(name,l){const a=A();return a?a.url(artKey(name,l)):null;}
/* Welches Layout zeigt ein Raum? Gibt es nur das Bild der anderen Ausrichtung, wird diese genommen (dann passt das Bild). */
function layFor(name,m){const o=m==='L'?'P':'L';return !artURL(name,m)&&artURL(name,o)?o:m;}

/* =====================================================================
   5 · Die Zimmer
   n Name · icon Bild-Symbol · wall/floor · L/P: [Möbel, Mitte-x, Unterkante-y, Maßstab, Optionen]
   Wichtig: Plätze haben in L und P dieselben IDs (o.id + Nummer), nur andere Koordinaten.
   ===================================================================== */
const ROOMS={
wohn:{n:'Wohnzimmer',icon:'zh_sofa',base:'#f1dfc0',wall:['streifen','#f3e3c4','#eed9b4','#b98b5e'],floor:['dielen','#c99a68'],
 L:[['win',24,46,1,{c:'#c8553d',pot:1}],['kasten',24,72,1,{id:'a',c:2,r:1,col:'#b8845a'}],
   ['frame',64,30,1,{id:'f1',s:'gruen'}],['frame',81,28,1,{id:'f2',w:15,h:17,s:'gold'}],['frame',98,30,1,{id:'f3',s:'rot'}],
   ['lampe',47,72,1],['sofa',84,72,1.12,{id:'s'}],['kuckuck',112,41,1],
   ['frame',137,26,1,{id:'f4',s:'rund'}],['kamin',137,72,1,{id:'k',n:2}],
   ['rug',84,96,1,{w:74,h:15}],['tisch',84,87,1,{id:'t',n:2}],
   ['pflanze',7,78,1.15,{k:'monstera'}],['spot',31,97,1,{id:'g1',w:20,h:24}],['spot',140,97,1,{id:'g2',w:22,h:23}]],
 P:[['win',19,40,1,{c:'#c8553d',pot:1}],['frame',47,24,1,{id:'f1',s:'gruen'}],['frame',63,22,1,{id:'f2',w:15,h:17,s:'gold'}],['frame',80,24,1,{id:'f3',s:'rot'}],
   ['frame',66,45,1,{id:'f4',s:'rund'}],['board',30,63,1,{id:'a',n:2}],['kuckuck',8,69,1],
   ['kamin',67,89.6,1,{id:'k',n:2}],['sofa',24,89.6,.92,{id:'s'}],
   ['rug',40,116,1,{w:64,h:13}],['tisch',30,105,1,{id:'t',n:2}],
   ['spot',76,112,1,{id:'g1',w:22,h:21}],['spot',55,117,1,{id:'g2',w:18,h:20}],['pflanze',7,118,1,{k:'monstera'}]]},
arbeit:{n:'Arbeitszimmer',icon:'zh_tisch',base:'#f3e2c2',wall:['streifen','#f3e2c2','#efdcb8','#b98b5e'],floor:['dielen','#c99a68'],
 L:[['win',21,43,1,{c:'#c8553d',hot:1,id:'win'}],['schreibtisch',22,72,1,{id:'d'}],['tischlampe',33,48,1],['messlatte',47,70,1],
   ['frame',66,28,1,{id:'f1'}],['frame',83,26,1,{id:'f2',w:15,h:17}],['frame',100,28,1,{id:'f3'}],
   ['board',83,52.4,1,{id:'a',n:4}],['kasten',83,72,1,{id:'c',c:3,r:1,ch:12.5,fill:{1:'b'}}],
   ['lampe',118,72,1,{c:'#e8a9a0'}],['bild',141,21,1.2,{k:'karte'}],['kasten',141,72,1,{id:'b',c:2,r:3}],
   ['rug',100,97,1,{w:72,h:13}],['pip',60,90,1],['spot',86,96,1,{id:'g1',w:19,h:22}],['spot',108,96,1,{id:'g2',w:19,h:22}],['spot',136,97,1,{id:'g3',w:24,h:23}]],
 P:[['win',19,38,1,{c:'#c8553d',hot:1,id:'win'}],['frame',47,22,1,{id:'f1'}],['frame',63,20,1,{id:'f2',w:15,h:17}],['frame',80,22,1,{id:'f3'}],
   ['board',62,44.4,1,{id:'a',n:4}],['messlatte',5.5,88,.8],
   ['kasten',74.5,89.6,.9,{id:'b',c:2,r:3}],['kasten',53.5,89.6,.9,{id:'c',c:1,r:2,ch:15}],
   ['schreibtisch',29,89.6,.84,{id:'d'}],['tischlampe',37,69.4,.9],
   ['rug',58,117,1,{w:58,h:11}],['pip',30,111,1],['spot',52,113,1,{id:'g1',w:18,h:20}],['spot',72,113,1,{id:'g2',w:18,h:20}],['spot',10,115,1,{id:'g3',w:16,h:19}]]},
flur:{n:'Flur',icon:'zh_tuer',base:'#f4e7cc',wall:['paneel','#f4e7cc','#a9c2ae','#8aa692'],floor:['fliesen','#ecdcc0','#c98a6a'],
 L:[['tuer',24,71.6,1,{id:'tuer'}],['rug',24,81,1,{w:26,h:6,s:'eck',c:'#b8845a',c2:'#e9c79a'}],
   ['garderobe',66,47,1,{id:'h'}],['bank',66,71.6,1,{id:'b'}],['spiegel',96,40,1],['schluessel',96,52,1],['schirm',93,72.4,1],
   ['haengelampe',96,13,1,{cord:4,c:'#e9c46a'}],
   ['frame',117,27,1,{id:'f1',s:'gruen'}],['frame',135,19,1,{id:'f2',s:'gold'}],['treppe',132,71.6,1,{id:'t'}],
   ['rug',78,94,1,{w:66,h:11,s:'eck',c:'#b85a44',c2:'#e9c79a'}],['pflanze',6,74,1.2,{k:'palme'}],
   ['spot',52,97,1,{id:'g1',w:20,h:23}],['spot',102,97,1,{id:'g2',w:20,h:23}]],
 P:[['tuer',18,89.6,1,{id:'tuer'}],['rug',18,98,1,{w:24,h:6,s:'eck',c:'#b8845a',c2:'#e9c79a'}],
   ['frame',10,31,1,{id:'f1',s:'gruen'}],['frame',26,25,1,{id:'f2',s:'gold'}],['haengelampe',38,12,1,{cord:4,c:'#e9c46a'}],['schluessel',38,45,1],
   ['garderobe',63,49,1,{id:'h'}],['treppe',67,89.6,.9,{id:'t'}],['schirm',38,90.4,1],
   ['bank',69,111,1,{id:'b'}],['pflanze',7,118,1,{k:'palme'}],
   ['spot',24,116,1,{id:'g1',w:19,h:20}],['spot',43,118,1,{id:'g2',w:17,h:19}]]},
kueche:{n:'Küche',icon:'zh_topf',base:'#f6ecd6',wall:['fliesen','#f6ecd6','#bcd9d6','#7fb0a8'],floor:['fliesen','#efe3cc','#9fbfa6'],
 L:[['kuehl',14,71.6,1,{id:'k'}],['win',42,36,1,{c:'#e9c46a',pot:1}],['spuele',52,71.6,1,{id:'c'}],
   ['toepfe',86,11.8,1],['kasten',86,27.2,1,{id:'a',c:3,r:1,ch:12.5,ft:0,col:'#9fbfa6'}],['herd',88,71.6,1],
   ['frame',117,42,1,{id:'f1',s:'rot'}],['haengelampe',130,21,1,{cord:9,c:'#c8553d'}],['wanduhr',151,34,1],
   ['rug',62,94,1,{w:58,h:10,s:'eck',c:'#7fa66a',c2:'#f6ead0'}],['tisch',130,75,1,{id:'t',n:3,h:17,cloth:'#c8553d'}],
   ['spot',38,97,1,{id:'g1',w:20,h:23}],['spot',88,97,1,{id:'g2',w:20,h:23}]],
 P:[['kuehl',11,89.6,1,{id:'k'}],['frame',9,25,1,{id:'f1',s:'rot'}],['win',31,44,.9,{c:'#e9c46a',pot:1}],
   ['toepfe',67,20.8,1],['kasten',67,36.2,1,{id:'a',c:3,r:1,ch:12.5,ft:0,col:'#9fbfa6'}],['wanduhr',78,51,1],
   ['spuele',44,89.6,1,{id:'c'}],['herd',78,89.6,1],
   ['rug',42,117,1,{w:56,h:9,s:'eck',c:'#7fa66a',c2:'#f6ead0'}],['tisch',38,111,1,{id:'t',n:3,h:17,cloth:'#c8553d'}],
   ['spot',9,115,1,{id:'g1',w:16,h:20}],['spot',75,115,1,{id:'g2',w:22,h:22}]]},
schlaf:{n:'Schlafzimmer',icon:'zh_bett',base:'#dfe8f0',wall:['blumen','#dfe8f0','#f0b8b0','#b98b5e'],floor:['dielen','#cfa778'],
 L:[['frame',14,31,1,{id:'f1',s:'blau'}],['frame',29,27,1,{id:'f2',s:'weiss'}],['nachttisch',14,71.6,1,{id:'n'}],
   ['girlande',58,13,1,{w:44}],['board',58,37,1,{id:'a',n:3,c:'#fffaf0'}],['bett',52,71.6,1,{id:'b'}],
   ['win',100,44,1,{c:'#b58cbd'}],['kiste',100,71.6,1,{id:'k'}],['nachtlicht',119,32,1],
   ['schrank',141,71.6,1,{id:'s'}],
   ['rug',72,96,1,{w:70,h:14,c:'#b58cbd',c2:'#f6ead0'}],['kloetze',96,89,1],['ball',124,80,1,{c:'#e9c46a'}],
   ['spot',32,97,1,{id:'g1',w:20,h:23}],['spot',120,97,1,{id:'g2',w:20,h:23}]],
 P:[['win',20,40,1,{c:'#b58cbd'}],['girlande',63,11,1,{w:40}],['board',63,31,1,{id:'a',n:3,c:'#fffaf0'}],
   ['frame',44,53,1,{id:'f1',s:'blau'}],['frame',13,59,1,{id:'f2',s:'weiss'}],['nachtlicht',29,56,1],
   ['schrank',75,89.6,.9,{id:'s'}],['bett',30,89.6,.92,{id:'b'}],
   ['rug',45,117,1,{w:60,h:10,c:'#b58cbd',c2:'#f6ead0'}],['nachttisch',10,106,1,{id:'n'}],['kiste',40,108,1,{id:'k'}],
   ['spot',72,113,1,{id:'g1',w:20,h:21}],['spot',22,119,1,{id:'g2',w:17,h:12}]]},
bad:{n:'Badezimmer',icon:'zh_wanne',base:'#eef4f2',wall:['fliesen','#eef4f2','#a9d3d6','#5f97ad'],floor:['fliesen','#f4f6f2','#8fbccb'],
 L:[['win',12,31,1,{s:'rund',f:'#fffaf0'}],['hocker',12,77,1,{id:'h'}],['board',41,40,1,{id:'w',n:3,c:'#fffaf0'}],['wanne',43,71.6,1],
   ['haengelampe',84,12,1,{cord:3,c:'#fffaf0'}],['spiegel',84,37,1,{c:'#fffaf0'}],['waschbecken',84,71.6,1],
   ['frame',106,25,1,{id:'f1',s:'blau'}],['handtuch',106,43,1],['klo',106,71.6,1],
   ['pflanze',140,25.4,.8,{k:'palme',pot:'#fffaf0'}],['kasten',140,71.6,1,{id:'a',c:2,r:3,col:'#fffaf0',back:'#dcecee',fill:{0:'f',3:'f'}}],
   ['rug',72,89,1,{w:42,h:8,s:'eck',c:'#8fbccb',c2:'#fffaf0'}],['spot',30,98,1,{id:'g1',w:20,h:22}],['spot',112,97,1,{id:'g2',w:20,h:23}]],
 P:[['win',16,33,1,{s:'rund',f:'#fffaf0'}],['frame',42,27,1,{id:'f1',s:'blau'}],['kasten',70,38,1,{id:'a',c:2,r:2,ft:0,col:'#fffaf0',back:'#dcecee'}],
   ['board',25,59,1,{id:'w',n:3,c:'#fffaf0'}],['spiegel',60,59,1,{c:'#fffaf0'}],['handtuch',80,62,1],
   ['wanne',26,89.6,1],['waschbecken',60,89.6,1],['klo',80,89.6,1],
   ['rug',54,117,1,{w:44,h:8,s:'eck',c:'#8fbccb',c2:'#fffaf0'}],['hocker',12,110,1,{id:'h'}],['pflanze',84,118,1,{k:'palme',pot:'#fffaf0'}],
   ['spot',38,115,1,{id:'g1',w:19,h:21}],['spot',62,115,1,{id:'g2',w:19,h:21}]]},
dach:{n:'Dachboden',icon:'zh_dach',base:'#d9b98c',wall:['dach','#d9b98c','#8a6548'],floor:['dielen','#b88a5e'],
 L:[['win',80,36,1,{s:'rund',f:'#8a6548'}],['spinnweb',89.6,18.6,1],['haengelampe',58,17,1,{cord:8,c:'#e9c46a'}],
   ['frame',43,33,1,{id:'f1',s:'dunkel'}],['frame',58.6,36,1,{id:'f2',s:'gold'}],['board',114,44,1,{id:'a',n:3,c:'#8a6548'}],
   ['truhe',24,71.6,1,{id:'u'}],['kartons',52,71.6,1,{id:'k'}],['koffer',112,71.6,1,{id:'c'}],['grammophon',140,72,1],['rolle',154,72,1],
   ['rug',82,95,1,{w:52,h:9,s:'eck',c:'#a8724a',c2:'#e0c9a0'}],['schaukeldino',82,91,1],
   ['spot',28,97,1,{id:'g1',w:20,h:22}],['spot',120,97,1,{id:'g2',w:20,h:22}],['spot',146,98,1,{id:'g3',w:20,h:21}]],
 P:[['win',45,38,1,{s:'rund',f:'#8a6548'}],['spinnweb',54.6,18.6,1],['haengelampe',30,20,1,{cord:6,c:'#e9c46a'}],
   ['frame',18,52,1,{id:'f1',s:'dunkel'}],['frame',72,52,1,{id:'f2',s:'gold'}],['board',45,58,1,{id:'a',n:3,c:'#8a6548'}],
   ['truhe',18,89.6,1,{id:'u'}],['kartons',46,89.6,1,{id:'k'}],['koffer',74,89.6,1,{id:'c'}],
   ['rug',16,116,1,{w:30,h:7,s:'eck',c:'#a8724a',c2:'#e0c9a0'}],['schaukeldino',15,113,1],
   ['spot',39,115,1,{id:'g1',w:18,h:20}],['spot',58,115,1,{id:'g2',w:18,h:20}],['spot',77,115,1,{id:'g3',w:18,h:20}]]},
keller:{n:'Keller',icon:'zh_fass',base:'#b3a794',wall:['stein','#b3a794','#857a6a'],floor:['stein','#a39886','#6f675c'],
 L:[['rohre',80,13,1,{w:160}],['haengelampe',56,25,1,{cord:11,c:'#e9c46a'}],['win',124,27,1,{s:'tief',f:'#6e5a48'}],
   ['kasten',30,71.6,1,{id:'r',c:3,r:3,col:'#8a6548',back:'#c9b99c',fill:{0:'j',1:'j',4:'j',6:'k',8:'j'}}],
   ['werkzeug',80,33,1],['werkbank',80,71.6,1,{id:'w'}],['mauseloch',104,71.4,1],
   ['waschmaschine',118,71.6,1,{id:'m'}],['fass',146,71.6,1,{id:'f'}],
   ['sack',9,86,1],['kiste',58,93,1,{id:'x',k:'holz',c:'#b08a5e'}],
   ['spot',92,97,1,{id:'g1',w:20,h:22}],['spot',132,97,1,{id:'g2',w:20,h:22}]],
 P:[['rohre',45,13,1,{w:90}],['win',20,31,1,{s:'tief',f:'#6e5a48'}],['haengelampe',48,29,1,{cord:11,c:'#e9c46a'}],
   ['werkzeug',71,52,1],['kasten',14.4,89.6,.9,{id:'r',c:2,r:3,col:'#8a6548',back:'#c9b99c',fill:{4:'j',5:'k'}}],
   ['waschmaschine',40,89.6,1,{id:'m'}],['werkbank',71,89.6,.9,{id:'w'}],
   ['kiste',16,111,1,{id:'x',k:'holz',c:'#b08a5e'}],['fass',78,113,1,{id:'f'}],
   ['spot',38,117,1,{id:'g1',w:18,h:20}],['spot',57,117,1,{id:'g2',w:18,h:20}]]},
garten:{n:'Garten',icon:'blume',base:'#cfe6ee',wall:['himmel'],floor:['gras'],
 L:[['baum',24,77,1],['mauer',84,73,1,{id:'z',n:3}],['busch',154,73,1,{b:1}],
   ['terrasse',132,93,1,{w:58,h:15}],['gartentisch',132,85,1,{id:'t'}],['giesskanne',104,84,1],
   ['stumpf',10,93,1,{id:'s'}],['sandkasten',56,98,1,{id:'k'}],['teich',98,98,1,{id:'e'}],['spot',146,99,1,{id:'g1',w:20,h:21}]],
 P:[['girlande',62,47,1,{w:52}],['baum',20,93,.9],['mauer',64,91,1,{id:'z',n:3}],['busch',82,90,.8,{b:1}],
   ['stumpf',46,101,1,{id:'s'}],['tisch',66,109,1,{id:'t',n:2,c:'#d9ae80'}],['giesskanne',83,108,1],
   ['sandkasten',29.4,118.4,.9,{id:'k'}],['teich',68,119.4,1,{id:'e'}],['spot',6.8,108,1,{id:'g1',w:13.6,h:18}]]},
};
const ORDER=['flur','wohn','kueche','schlaf','bad','arbeit','dach','keller','garten'];

/* =====================================================================
   6 · Antippbare Dinge im Zimmer (Lampe, Wasserhahn, Kuckucksuhr …)
   Sie liegen als durchsichtige Knöpfe über der Zeichnung (gleiche Prozent-Position
   wie in der Zeichnung) – funktionieren also auch über einem gemalten Bild.
   Kleine bewegte Figuren (Kuckuck, Ente …) zeichnet die App darüber; liegt ein Bild
   objekte/haus_<name> vor, wird es benutzt.
   ===================================================================== */
const SPR={
  ente:()=>el(7.6,11,5.6,3.6,'#f5d36a')+pa('M2.4 10.2q-1.6-1.6-2-3.2 2.4 .4 3.6 2z','#f5d36a')+ci(11,6.6,3.1,'#f5d36a')+pa('M13.6 6.2l2.4 .6-2.2 1.3z','#e9873a')+ci(11.8,5.8,.55,C.ink,NO)+pa('M5 10.6q2.6-1.6 4.8 .6-2.6 1.6-4.8-.6z','#e9b93a'),
  schaukel:Object.assign(()=>pa('M2 19.6q12 6 24 0l-1.3-1.7q-10.7 4.6-21.4 0z',C.w2)+rc(9.6,14,2.6,6,'#6f9a5a',1)+rc(16.4,14,2.6,6,'#6f9a5a',1)+pa('M8.4 10.6Q4 10 1.4 6.6q2.6 5.4 7.2 7.2z','#7fa66a')+el(13.6,11.6,7,4.6,'#7fa66a')+pa('M17.6 10q1.6-5 3.8-6.6q3-.9 3.6 1.5q0 2-2.9 2.3q-1 3.2-2.3 5.4z','#7fa66a')+ci(22.8,4.6,.5,C.ink,NO)+ln('M23.4 6q.8 .1 1.2-.4',C.ink,.25,.8)+pa('M9.4 7.4l1.4-2.2 1.2 2zM12.8 6.8l1.4-2.2 1.2 2zM16 7.2l1.2-2 1 1.8z','#e9c46a')+rc(11.4,8,5.4,3.4,C.terra,1),{vb:'0 0 28 24'}),
  spinne:Object.assign(()=>ln('M5 -30V4','#fffaf0',.3,.9)+ln('M3.2 5.4L.8 4M3 6.4L.4 6.6M3.2 7.4L1 9M6.8 5.4L9.2 4M7 6.4l2.6 .2M6.8 7.4L9 9',C.ink,.35,.9)+ci(5,6.6,2.3,'#5a4a42')+ci(5,4.2,1.3,'#5a4a42')+ci(4.5,4,.35,'#fffaf0',NO)+ci(5.5,4,.35,'#fffaf0',NO),{vb:'0 0 10 10'}),
  trommel:Object.assign(()=>ci(6,6,5.6,'#3d5361')+pa('M3 4q2-2 4-.6q-1 2.4-3.4 2.4z',C.terra)+pa('M7.4 6.4q2.4-.4 2.6 2q-1.6 1.6-3.4 .6z',C.sun)+pa('M3 7.4q1.6-.6 2.6 1q-.6 1.6-2.2 1.2z','#8fbccb')+hi('M2.4 3.4q1.2-1.6 3-2',.5,.5),{vb:'0 0 12 12'}),
  maus:Object.assign(()=>ln('M2.4 9.6Q-.4 9.4 .6 6.6','#b79a94',.5)+el(6,8.6,4,2.6,'#b9b0a8')+ci(9.4,7.6,2.2,'#b9b0a8')+ci(8.6,5.4,1.5,'#b9b0a8')+ci(8.6,5.4,.8,'#e8a9a0',NO)+ci(10.2,7.2,.42,C.ink,NO)+ci(11.5,8.2,.42,'#e8a9a0',NO)+ln('M11 8.6l1 .6M11 8.2l1.2-.2',C.ink,.15,.6),{vb:'0 0 12 12'}),
  vogel:Object.assign(()=>el(6,7.6,4,3.4,'#c9705c')+ci(6.4,4.6,2.8,'#8a6548')+pa('M8.8 4.4l2.6 .7-2.4 1.1z','#e9a23a')+ci(7.2,4,.5,C.ink,NO)+pa('M3 7q2.2-1 3.6 1q-2 1.6-3.6-1z','#8a6548'),{vb:'0 0 12 12'}),
  schaukelbrett:Object.assign(()=>ln('M1.6 0V17.4M8.6 0V17.4',C.w4,.45,.9)+rc(0,17,10.2,2,C.terra,.6),{vb:'0 0 10.2 20'}),
  kuckuck:()=>pa('M3 9l-2.6 1.4L3 11z','#e9a23a')+el(8,10,5.4,4.4,'#8fb7c9')+ci(5.6,8.4,3,'#8fb7c9')+ci(4.9,7.8,.6,C.ink,NO)+pa('M8 9.4q3.4-.6 4.6 2.4q-3 1.6-4.6-2.4z','#6f97ad')+pa('M12.6 9.6l3.2-1.6-.6 3.4z','#6f97ad'),
};
const sprCache=new Map();
function sprite(name){const a=A(),u=a&&a.url('objekte/haus_'+name);
  if(!u&&!sprCache.has(name))sprCache.set(name,'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SPR[name].vb||'0 0 16 16'}">${SPR[name]()}</svg>`));
  return `<img src="${u||sprCache.get(name)}" alt="" draggable="false">`;}
const parts=(cls,n)=>`<span class="zh-fx zh-fx-${cls}">${'<i></i>'.repeat(n)}</span>`;
function burst(el,ms){el.classList.remove('go');void el.offsetWidth;el.classList.add('go');clearTimeout(el._t);el._t=GK.after(ms,()=>el.classList.remove('go'));}
function sfxSeq(list){let t=0;list.forEach(x=>{if(typeof x==='number')t+=x;else if(t)GK.after(t,()=>DW.sfx(x));else DW.sfx(x);});}
const LAMPS=new Set();
/* n = Name (für Vorleser/Screenreader) · inner = Inhalt des Knopfs · tap = was beim Antippen passiert */
const fx=(n,cls,cnt,ms,snd,say,spr,an)=>({n,spr,an,inner:()=>(cls?parts(cls,cnt):''),tap(el,h){burst(el,ms);sfxSeq(snd);const t=h.say||say;if(t)DW.say(Array.isArray(t)?DW.pick(t):t);}});
const HOT={
  lamp:{n:'Lampe',inner:()=>'<i class="zh-glow"></i>',tap(el,h){const k=cur+'|'+h.id,on=!LAMPS.has(k);on?LAMPS.add(k):LAMPS.delete(k);el.classList.toggle('on',on);DW.sfx('click');DW.say(on?'Licht an!':'Licht aus!');}},
  kuckuck:fx('Kuckucksuhr','',0,1700,['egg',330,'egg'],'Kuckuck! Kuckuck!','kuckuck','peek'),
  fire:fx('Kaminfeuer','spark',6,1800,['brush',160,'brush',200,'brush'],'Knister, knister! Schön warm.'),
  notes:fx('Radio','notes',3,2000,['star'],'La, la, la! Musik!'),
  water:fx('Wasserhahn','drops',4,1500,['pop',150,'egg',170,'pop',160,'egg'],'Plitsch, platsch!'),
  steam:fx('Kochtopf','steam',3,2000,['brush',300,'brush'],'Mmh, das duftet!'),
  fridge:fx('Kühlschrank','cold',5,1600,['click',120,'clink'],'Brrr, ist das kalt!'),
  bell:fx('Türglocke','notes',3,1600,['clink',260,'clink'],'Ding, dong!'),
  ente:fx('Quietsche-Ente','',0,900,['egg',180,'egg'],'Quak, quak!','ente','hop'),
  flush:fx('Toilette','drops',4,1500,['whoosh'],'Wusch! Alles sauber.'),
  rock:fx('Schaukel-Dino','',0,1900,['step',300,'step',300,'step',300,'step'],'Hoppe, hoppe, Dino!','schaukel','rock'),
  spinne:fx('Spinne','',0,2300,['pop'],'Huch, eine kleine Spinne! Die tut nichts.','spinne','drop'),
  wash:fx('Waschmaschine','',0,2400,['bump',400,'bump',400,'bump'],'Rumpel, rumpel! Die Wäsche dreht sich.','trommel','spin'),
  maus:fx('Mauseloch','',0,1900,['egg'],'Piep! Eine kleine Maus.','maus','peekr'),
  vogel:fx('Vogelhaus','notes',2,1700,['star'],'Piep, piep, piep!','vogel','peekb'),
  swing:fx('Schaukel','',0,2400,['whoosh',700,'whoosh'],'Hui, die Schaukel schwingt!','schaukelbrett','sway'),
  weather:{n:'Fenster',inner:()=>'',tap(){DW.sfx('tap');const E=(window.WORLD&&WORLD.env)?WORLD.env():{dark:0,weather:'sonne'};
    DW.say(E.dark>.55?'Draußen ist es Nacht.':E.weather==='regen'?'Draußen regnet es.':E.weather==='schnee'?'Draußen schneit es.':E.weather==='wolken'?'Draußen ist es wolkig.':'Draußen scheint die Sonne.');}},
  ruler:{n:'Messlatte',live:1,inner:()=>{const k=Q().stage(),n=Q().STAGES.length;return `<span class="zh-scale">${Q().STAGES.map((s,i)=>`<i class="${i<=k?'on':''}${i===k?' now':''}" style="bottom:${(8+i*(84/(n-1))).toFixed(1)}%"></i>`).join('')}</span>`;},tap(){pipGo();}},
  pip:{n:'Pip',live:1,inner:()=>`<span class="zh-pipw" style="width:${68+Q().stage()*8}%">${Q().pipImg(Q().stage())}</span>`,tap(){pipGo();}},
  book:{n:'Auftragsbuch',live:1,inner:()=>`${ART.icon('buch')}<span class="zh-bst">${ART.icon('q_stempel')}</span>`,tap(){DW.sfx('pop');Q().book();}},
};
function pipGo(){DW.sfx('pop');const p=root&&root.querySelector('.zh-pipw');if(p){p.classList.remove('hop');void p.offsetWidth;p.classList.add('hop');}GK.after(450,()=>Q().pipCard());}

/* ---------- besondere Wände und Böden (Dachboden, Keller, Garten, Themenräume) ---------- */
/* Dachboden: Bretterwand, links und rechts die Dachschrägen mit Sparren */
WALL.dach=(UW,UH,FY,a,b)=>{const bw=pattern(40,7,rc(0,0,40,7,a,0,NO)+ln('M0 0h40',sh(a,.72),.3,.8)+ln('M13 0v7M31 3.5',sh(a,.78),.22,.6)+el(24,3.6,1.1,.6,sh(a,.8),NO)),sx=UW*(UW>100?.26:.3),sy=FY*.66;
  let s=rc(0,0,UW,FY,bw,0,NO)+rc(0,0,UW,FY,rgrad([[0,'#fff3d0',.5],[1,'#fff3d0',0]],.5,.36,.5),0,NO);
  const slope=pa(`M0 0H${sx}L0 ${sy}z`,b)+[.25,.5,.75].map(t=>ln(`M${f2(sx*t)} 0L0 ${f2(sy*t)}`,sh(b,.7),.4,.7)).join('')+ln(`M${sx} 0L0 ${sy}`,sh(b,.62),1.6)+ln(`M${sx} 0L0 ${sy}`,sh(b,1.2),.4,.5);
  s+=slope+gr(slope,`translate(${UW} 0) scale(-1 1)`)+rc(0,0,UW,2.6,sh(b,.8),0)+rc(UW/2-1.6,0,3.2,FY*.16,sh(b,.86),.3);
  return s+rc(0,0,UW,FY,grad([[0,'#3c2814',.2],[.5,'#3c2814',0]]),0,NO)+rc(0,FY-2,UW,2,sh(b,.8),0);};
/* Keller: Bruchsteinmauer */
WALL.stein=(UW,UH,FY,a,b)=>{const st=pattern(22,13,rc(0,0,22,13,b,0,NO)+rc(.5,.5,9.4,5.6,a,1.4,NO)+rc(10.9,.5,10.6,5.6,sh(a,.93),1.4,NO)+rc(-5,7,10.4,5.5,sh(a,1.06),1.4,NO)+rc(6.4,7,8.6,5.5,sh(a,.9),1.4,NO)+rc(16,7,11,5.5,sh(a,1.06),1.4,NO));
  let s=rc(0,0,UW,FY,st,0,NO)+rc(0,0,UW,FY,rgrad([[0,'#ffe9b8',.34],[1,'#ffe9b8',0]],.5,.3,.5),0,NO)+rc(0,0,UW,FY,grad([[0,'#1c1410',.32],[.4,'#1c1410',0],[1,'#1c1410',.18]]),0,NO);
  [[.12,.9],[.5,.94],[.83,.88]].forEach(([x,y])=>s+=el(UW*x,FY*y,7,2.4,'#7f9a6a',`${NO} opacity=".35"`));
  return s+rc(0,0,9,FY,grad([[0,'#1c1410',.26],[1,'#1c1410',0]],1,0),0,NO)+rc(UW-9,0,9,FY,grad([[0,'#1c1410',0],[1,'#1c1410',.26]],1,0),0,NO);};
BODEN.stein=(UW,UH,FY,a,b)=>{const R=rng(31),k=.42,rows=[0,.22,.5,.8,1.12];let s=rc(0,FY,UW,UH-FY,a,0,NO);
  for(let j=0;j<4;j++){const y0=FY+(UH-FY)*rows[j],y1=FY+(UH-FY)*rows[j+1];let x=-30-(j%2)*7;while(x<UW+30){const w=11+R()*8,X=(xx,t)=>xx+(xx-UW/2)*k*t;
      s+=pa(`M${f2(X(x,rows[j])+.3)} ${f2(y0+.3)}L${f2(X(x+w,rows[j])-.3)} ${f2(y0+.3)}L${f2(X(x+w,rows[j+1])-.3)} ${f2(y1-.3)}L${f2(X(x,rows[j+1])+.3)} ${f2(y1-.3)}z`,sh(a,.9+R()*.24),`stroke="${b||sh(a,.66)}" stroke-width=".4" stroke-opacity=".8" stroke-linejoin="round"`);x+=w;}}
  return s+floorShade(UW,FY);};
/* Garten: Himmel, Hügel, Hecke */
WALL.himmel=(UW,UH,FY)=>{const g=grassCol(),hd=ENVV.season==='winter'?'#dfe9e6':ENVV.night?'#35523f':'#5f8f55';let s=`<svg x="0" y="0" width="${UW}" height="${FY}" viewBox="0 0 ${UW} ${FY}">${skyInner({bare:1},UW,FY)}</svg>`;
  s+=pa(`M0 ${FY-22}Q${UW*.2} ${FY-32} ${UW*.45} ${FY-23}T${UW} ${FY-27}V${FY}H0z`,mx(g,'#b6d8e4',.5),NO)+pa(`M0 ${FY-15}Q${UW*.3} ${FY-22} ${UW*.6} ${FY-15}T${UW} ${FY-17}V${FY}H0z`,mx(g,'#b6d8e4',.22),NO);
  let d=`M0 ${FY}V${FY-9}`;for(let x=0;x<UW;x+=6)d+=`q3-${3+(x*7%5)*.5} 6 0`;s+=pa(d+`V${FY}z`,hd,NO);
  for(let x=2;x<UW;x+=5)s+=ln(`M${x} ${FY-5-(x*3%4)}q1.2-1.2 2.4 0`,sh(hd,.8),.3,.6);
  return s;};
BODEN.gras=(UW,UH,FY)=>{const g=grassCol(),R=rng(17);let s=rc(0,FY-.4,UW,UH-FY+.4,grad([[0,sh(g,.9)],[1,g]]),0,NO);
  for(let i=0;i<70;i++){const x=R()*UW,y=FY+1+R()*(UH-FY-2);s+=ln(`M${f2(x)} ${f2(y)}l-.6-1.6M${f2(x+.6)} ${f2(y)}l.2-2M${f2(x+1.2)} ${f2(y)}l.8-1.4`,sh(g,.78),.25,.75);}
  if(ENVV.season!=='winter')for(let i=0;i<16;i++){const x=R()*UW,y=FY+2+R()*(UH-FY-4);s+=ci(x,y,.7,i%3?'#fffaf0':'#f6c9d4',NO)+ci(x,y,.28,C.sun,NO);}
  return s+rc(0,FY-.4,UW,4,grad([[0,'#22361e',.22],[1,'#22361e',0]]),0,NO);};

/* =====================================================================
   5b · Themenräume: Wände/Böden, Zimmer, antippbare Dinge
   ===================================================================== */
const sideShade=(UW,FY,c='#1c1e3a',o=.22)=>rc(0,0,UW,7,grad([[0,c,o],[1,c,0]]),0,NO)+rc(0,0,9,FY,grad([[0,c,o*.7],[1,c,0]],1,0),0,NO)+rc(UW-9,0,9,FY,grad([[0,c,0],[1,c,o*.7]],1,0),0,NO);
/* Meerzimmer: oben hell, unten Wasser mit Wellenkante und Luftblasen */
WALL.welle=(UW,UH,FY,a,b,base)=>{const y0=FY*.5,R=rng(5);let d=`M0 ${f2(y0)}`,d2=`M0 ${f2(y0+6)}`,d3=`M0 ${f2(y0+13)}`;for(let x=0;x<UW;x+=8){d+='q2-2.4 4 0t4 0';d2+='q2-1.6 4 0t4 0';d3+='q2-1.4 4 0t4 0';}
  let s=rc(0,0,UW,FY,a,0,NO)+pa(d+`V${FY}H0z`,grad([[0,sh(b,1.08)],[1,sh(b,.86)]]),NO)+ln(d,'#fffaf0',.55,.8)+ln(d2,sh(b,1.2),.4,.6)+ln(d3,sh(b,1.14),.35,.45);
  for(let i=0;i<UW/7;i++){const x=R()*UW,y=y0+9+R()*(FY-y0-14),r=.35+R()*.6;s+=ci(x,y,r,'#ffffff',`${NO} opacity=".3"`);}
  [[.2,.2],[.62,.14],[.86,.26]].forEach(([x,y],i)=>s+=ln(`M${f2(UW*x)} ${f2(FY*y)}q1.6-1.8 3.2 0q1.6-1.8 3.2 0`,sh(a,.8),.35,.7));
  return s+wallWash(UW,FY,base||sh(b,.72));};
/* Gewächshaus: Glaswände mit Sprossen, dahinter Himmel und Dschungel, unten Mäuerchen */
WALL.glas=(UW,UH,FY,a,b)=>{const fr=a||'#f3f6ee',R=rng(9),lf=ENVV.night?['#2f5a44','#3a6a4c','#447656']:['#4f8a5a','#6a9f62','#7fb074'],n=Math.round(UW/20),mh=7;
  let s=`<svg x="0" y="0" width="${UW}" height="${FY}" viewBox="0 0 ${UW} ${FY}">${skyInner({bare:1},UW,FY)}</svg>`;
  for(let i=0;i<UW/6;i++){const x=i*6+R()*4,h=FY*(.34+R()*.42);s+=el(x,FY-h*.45,5+R()*4,h*.55,lf[i%3],`${NO} opacity=".62"`);}
  for(let i=0;i<UW/16;i++){const x=R()*UW,y=FY*(.3+R()*.3);s+=leaf(x,y,-60+R()*120,7+R()*4,1.6,lf[(i+1)%3],.2);}
  s+=rc(0,0,UW,FY,'#eaf6f0',0,`${NO} opacity=".3"`);
  for(let i=0;i<n;i++)s+=hi(`M${f2(i*UW/n+3)} ${f2(FY*.27)}l4.4-7.4M${f2(i*UW/n+5.4)} ${f2(FY*.29)}l2.2-3.8`,.6,.3);
  for(let i=0;i<=n;i++)s+=rc(i*UW/n-.7,0,1.4,FY,fr,0,`stroke="${sh(fr,.72)}" stroke-width=".2"`);
  [FY*.3,FY*.62].forEach(y=>s+=rc(0,y-.6,UW,1.2,fr,0,`stroke="${sh(fr,.72)}" stroke-width=".2"`));
  s+=rc(0,0,UW,2.4,fr,0,`stroke="${sh(fr,.72)}" stroke-width=".2"`);
  s+=rc(0,FY-mh,UW,mh,pattern(7,3.5,rc(0,0,7,3.5,b||'#c98a6a',0,NO)+ln('M0 0h7M0 1.75h7M2 0v1.75M5.5 1.75v1.75',sh(b||'#c98a6a',.7),.22,.8)),0,NO)+rc(0,FY-mh-.9,UW,1.5,'#e3d6c0',0);
  return s+rc(0,0,UW,6,grad([[0,'#22361e',.16],[1,'#22361e',0]]),0,NO);};
/* Eiszeit: Eiswand mit Zapfen, unten Schneewehe */
WALL.eis=(UW,UH,FY,a,b)=>{const R=rng(13);let s=rc(0,0,UW,FY,grad([[0,b],[.62,a],[1,'#f4fbfd']]),0,NO);
  for(let i=0;i<UW/8;i++){const x=R()*UW,y=R()*FY*.86,w=8+R()*12,h=10+R()*14;s+=pa(`M${f2(x)} ${f2(y)}l${f2(w*.6)} ${f2(-h*.3)} ${f2(w*.4)} ${f2(h*.5)} ${f2(-w*.5)} ${f2(h*.5)}z`,i%2?'#ffffff':sh(b,.88),`${NO} opacity="${i%2?.24:.15}"`);}
  for(let i=0;i<UW/22;i++){const x=R()*UW,y=10+R()*FY*.6;s+=ln(`M${f2(x)} ${f2(y)}l2.4 4.6-1.6 3.4 2 4`,'#ffffff',.3,.55);}
  let d='M0 0',x=0;while(x<UW){const w=2.4+R()*3,h=2.6+R()*6;d+=`L${f2(x)} 2.2L${f2(x+w/2)} ${f2(2.2+h)}L${f2(x+w)} 2.2`;x+=w+R()*2.4;}
  s+=pa(d+`L${UW} 2.2V0z`,'#f4fbfd',`stroke="${sh(b,.8)}" stroke-width=".25" stroke-opacity=".7"`);
  s+=pa(`M0 ${FY}V${FY-4}Q${f2(UW*.2)} ${FY-8} ${f2(UW*.4)} ${FY-4}T${f2(UW*.75)} ${FY-5}T${UW} ${FY-3}V${FY}z`,'#fbfdfd',NO);
  return s+sideShade(UW,FY,'#2c4a5a',.2);};
BODEN.schnee=(UW,UH,FY,a)=>{const R=rng(23);let s=rc(0,FY-.4,UW,UH-FY+.4,grad([[0,sh(a,.92)],[1,a]]),0,NO);
  for(let i=0;i<26;i++){const x=R()*UW,y=FY+2+R()*(UH-FY-4);s+=el(x,y,3+R()*5,.6+R()*.6,'#cfe3ea',`${NO} opacity=".55"`);}
  for(let i=0;i<34;i++)s+=ci(R()*UW,FY+1+R()*(UH-FY-2),.3,'#ffffff',NO);
  return s+rc(0,FY-.4,UW,4,grad([[0,'#2c4a5a',.14],[1,'#2c4a5a',0]]),0,NO);};
/* Sternwarte: Nachtblau mit Sternen, unten Holzvertäfelung */
WALL.sterne=(UW,UH,FY,a,b,base)=>{const R=rng(41),y0=FY*.7;let s=rc(0,0,UW,FY,grad([[0,sh(a,.78)],[1,a]]),0,NO);
  for(let i=0;i<UW*.55;i++){const x=R()*UW,y=R()*(y0-3)+1.5,r=R();s+=r>.88?pa(starD(x,y,.9+R()*.7,.42),b,`${NO} opacity=".9"`):ci(x,y,.16+r*.3,'#fff8d8',`${NO} opacity="${f2(.45+r*.5)}"`);}
  s+=rc(0,0,UW,y0,rgrad([[0,'#8f9be0',.22],[1,'#8f9be0',0]],.5,.4,.6),0,NO);
  s+=rc(0,y0,UW,FY-y0,base,0,NO);for(let x=4;x<UW;x+=13)s+=rc(x,y0+2.4,9,FY-y0-5.8,sh(base,1.1),.5,`stroke="${sh(base,.74)}" stroke-width=".25"`);
  return s+rc(0,y0-.9,UW,1.5,sh(base,.84),0)+rc(0,FY-2.2,UW,2.2,sh(base,.8),0)+sideShade(UW,FY);};
/* Vulkan-Labor: dunkle Basaltwand mit Glut-Adern */
WALL.basalt=(UW,UH,FY,a,b)=>WALL.stein(UW,UH,FY,a,b)+rc(0,FY*.5,UW,FY*.5,grad([[0,'#f08a3c',0],[1,'#f08a3c',.13]]),0,NO);

Object.assign(ROOMS,{
stern:{n:'Sternwarte',icon:'zh_stern',base:'#39477d',ovc:['#39477d','#7a5f4c'],wall:['sterne','#3f4d86','#f3dc8a','#8a6a52'],floor:['dielen','#a07a5a'],
 L:[['kuppelfenster',80,44,1],['mobile',124,26,1],['nachtlicht',150,24,1],
   ['frame',26,31,1,{id:'f1',s:'gold'}],['frame',42,34,1,{id:'f2',s:'blau'}],['sternkarte',127,48,1],
   ['kasten',24,72,1,{id:'k',c:2,r:2,col:'#7a6a9a',back:'#d9d3ea',fill:{0:'b'}}],
   ['sitzsack',94,73,1,{id:'s'}],['teleskop',58,74,1.1],
   ['kasten',127,72,1,{id:'a',c:3,r:1,col:'#8a6a52',back:'#e6dcc8'}],['rakete',153.4,73,1],
   ['rug',82,96,1,{w:66,h:14,c:'#4a5a9a',c2:'#f0d98a'}],['tisch',82,88,1,{id:'t',n:2,c:'#8a6a52'}],
   ['spot',28,97,1,{id:'g1',w:20,h:22}],['spot',126,97,1,{id:'g2',w:20,h:22}],['spot',148,98,1,{id:'g3',w:20,h:22}]],
 P:[['kuppelfenster',45,40,1],['mobile',12,30,.8],['nachtlicht',80,20,1],
   ['frame',80,42,1,{id:'f1',s:'gold'}],['frame',11,52,1,{id:'f2',s:'blau'}],['sternkarte',45,53,.8],
   ['board',45,71,1,{id:'a',n:3,c:'#8a6a52'}],
   ['kasten',75.5,89.6,.9,{id:'k',c:2,r:2,col:'#7a6a9a',back:'#d9d3ea',fill:{0:'b'}}],['teleskop',13,90.5,1],['sitzsack',44,90,1,{id:'s'}],
   ['rug',56,117,1,{w:60,h:11,c:'#4a5a9a',c2:'#f0d98a'}],['tisch',22,110,1,{id:'t',n:2,c:'#8a6a52'}],['rakete',59,91,.7],
   ['spot',46,118,1,{id:'g1',w:16,h:19}],['spot',63,118,1,{id:'g2',w:16,h:19}],['spot',80,118,1,{id:'g3',w:16,h:19}]]},
meer:{n:'Urzeit-Meerzimmer',icon:'zh_meer',base:'#cfe6ea',ovc:['#b9dfe6','#d9c49a'],wall:['welle','#e6f2ee','#8fc6d4','#5f97ad'],floor:['dielen','#dcc79c'],
 L:[['win',12,34,1,{s:'rund',sea:1,f:'#c9a04a'}],['win',126,34,1,{s:'rund',sea:1,f:'#c9a04a'}],['netz',80,19,1],
   ['frame',34,29,1,{id:'f1',s:'blau'}],['frame',50,26,1,{id:'f2',s:'weiss'}],['frame',104,28,1,{id:'f3',s:'gold'}],
   ['board',80,46.4,1,{id:'a',n:3,c:'#fffaf0'}],
   ['aquarium',34,72,1,{id:'q'}],['koralle',62,72,1],['muschelsessel',81,72.4,1,{id:'m'}],['truhe',116,72,1,{id:'k',c:'#8a6a4a'}],['bootregal',148,72,1,{id:'b'}],
   ['rug',80,96,1,{w:70,h:14,c:'#5f97ad',c2:'#e6f2ee'}],['muschel',28,90,1],['pflanze',6,76,1,{k:'schwert',pot:'#e9dcc6'}],
   ['spot',54,97,1,{id:'g1',w:20,h:22}],['spot',104,97,1,{id:'g2',w:20,h:22}],['spot',140,97,1,{id:'g3',w:22,h:22}]],
 P:[['win',13,30,1,{s:'rund',sea:1,f:'#c9a04a'}],['win',77,30,1,{s:'rund',sea:1,f:'#c9a04a'}],['netz',45,17,1],
   ['frame',37,36,1,{id:'f1',s:'blau'}],['frame',53,36,1,{id:'f2',s:'weiss'}],['frame',12,50,1,{id:'f3',s:'gold'}],['anker',28,52,1],
   ['board',56,56,1,{id:'a',n:3,c:'#fffaf0'}],
   ['aquarium',23,89.6,1,{id:'q'}],['muschelsessel',58,90,.9,{id:'m'}],['bootregal',81,89.6,.9,{id:'b'}],
   ['rug',54,117,1,{w:58,h:10,c:'#5f97ad',c2:'#e6f2ee'}],['truhe',19,110,1,{id:'k',c:'#8a6a4a'}],['muschel',36,118,1],
   ['spot',50,116,1,{id:'g1',w:17,h:20}],['spot',67,116,1,{id:'g2',w:17,h:20}],['spot',83,114,1,{id:'g3',w:13,h:19}]]},
vulkan:{n:'Vulkan-Labor',icon:'zh_vulkan',base:'#9a8576',ovc:['#9a8576','#8f8273'],wall:['basalt','#a08a7a','#6f5d52'],floor:['stein','#958878','#5f554c'],
 L:[['rohre',80,13,1,{w:160}],['win',28,28,1,{s:'tief',f:'#6e5a48'}],['haengelampe',47,25,1,{cord:11,c:'#e9c46a'}],
   ['tafel',68,38,1],['frame',92,30,1,{id:'f1',s:'dunkel'}],['board',118,38,1,{id:'a',n:3,c:'#6e5a48'}],['frame',150,30,1,{id:'f2',s:'gold'}],
   ['kasten',28,72,1,{id:'r',c:3,r:2,col:'#7a5f4c',back:'#cdbfa8',fill:{1:'r',3:'j'}}],['lavalampe',12,39.6,1],
   ['vulkanmodell',76,72,1],['labortisch',122,72,1,{id:'l'}],['sockel',152,72,1,{id:'d',c:'#b9ae9c'}],
   ['rug',92,96,1,{w:76,h:10,s:'eck',c:'#8a3f34',c2:'#e0b070'}],['kristall',14,90,1],['kiste',44,95,1,{id:'x',k:'holz',c:'#b08a5e'}],['sack',150,90,1],
   ['spot',76,97,1,{id:'g1',w:20,h:22}],['spot',102,97,1,{id:'g2',w:20,h:22}],['spot',128,97,1,{id:'g3',w:20,h:22}]],
 P:[['rohre',45,13,1,{w:90}],['win',17,30,1,{s:'tief',f:'#6e5a48'}],['haengelampe',42,28,1,{cord:11,c:'#e9c46a'}],
   ['tafel',70,38,1],['frame',10,50,1,{id:'f1',s:'dunkel'}],['frame',26,50,1,{id:'f2',s:'gold'}],['board',66,58,1,{id:'a',n:3,c:'#6e5a48'}],
   ['kasten',16,89.6,1,{id:'r',c:2,r:2,col:'#7a5f4c',back:'#cdbfa8'}],
   ['vulkanmodell',43,89.6,.8],['labortisch',72.5,89.6,.8,{id:'l'}],
   ['sockel',10,112,1,{id:'d',c:'#b9ae9c'}],['kiste',32,112,.9,{id:'x',k:'holz',c:'#b08a5e'}],['kristall',22,119.4,.8],
   ['spot',50,118,1,{id:'g1',w:15,h:19}],['spot',66.5,118,1,{id:'g2',w:15,h:19}],['spot',82.5,118,1,{id:'g3',w:14,h:19}]]},
fossil:{n:'Fossilien-Galerie',icon:'zh_fossil',base:'#efe6d2',ovc:['#e9e0cc','#d9cdb4'],wall:['paneel','#efe6d2','#86a394','#5f7a6c'],floor:['fliesen','#ece2cf','#bfae90'],
 L:[['fossilwand',80,30,1],['haengelampe',48,13,1,{cord:4,c:'#f0d98a'}],['haengelampe',112,13,1,{cord:4,c:'#f0d98a'}],
   ['frame',22,28,1,{id:'f1',s:'gold'}],['frame',38,31,1,{id:'f2',s:'dunkel'}],['ammonit',126,29,1],['frame',144,31,1,{id:'f3',w:15,h:17,s:'gold'}],
   ['board',80,50,1,{id:'a',n:3,c:'#8a6a4a'}],
   ['vitrine',30,72,1,{id:'v'}],['sockel',62,72,1,{id:'s'}],['sockel',80,72,1,{id:'t'}],['sockel',98,72,1,{id:'u'}],['vitrine',130,72,1,{id:'w'}],['pflanze',153,73.4,1,{k:'farn',pot:'#e9dcc6'}],
   ['rug',80,96,1,{w:72,h:10,s:'eck',c:'#9a3f3a',c2:'#e9c79a'}],['kordel',80,83,1,{w:58}],['grabkiste',22,93,1],
   ['spot',58,98,1,{id:'g1',w:20,h:22}],['spot',102,98,1,{id:'g2',w:20,h:22}],['spot',136,97,1,{id:'g3',w:22,h:22}]],
 P:[['fossilwand',45,30,.9],['frame',11,27,1,{id:'f1',s:'gold'}],['frame',79,28,1,{id:'f3',w:15,h:17,s:'gold'}],
   ['frame',11,49,1,{id:'f2',s:'dunkel'}],['ammonit',79,47,.9],['board',45,52,1,{id:'a',n:3,c:'#8a6a4a'}],
   ['vitrine',17,89.6,1,{id:'v'}],['sockel',45,89.6,1,{id:'t'}],['vitrine',73,89.6,1,{id:'w'}],
   ['rug',45,117,1,{w:52,h:9,s:'eck',c:'#9a3f3a',c2:'#e9c79a'}],['kordel',45,99,1,{w:34}],
   ['sockel',9,115,1,{id:'s'}],['sockel',81,115,1,{id:'u'}],
   ['spot',27,118,1,{id:'g1',w:17,h:19}],['spot',45,119,1,{id:'g2',w:17,h:18}],['spot',63,118,1,{id:'g3',w:17,h:19}]]},
eis:{n:'Eiszeit-Zimmer',icon:'zh_eis',base:'#dff1f6',ovc:['#cfe8f0','#f4fafb'],wall:['eis','#dff1f6','#a3cfe0'],floor:['schnee','#f6fbfc'],
 L:[['eiszapfen',40,16,1],['eiszapfen',124,16,1],['hoehlenbild',80,27,1.1],
   ['frame',22,35,1,{id:'f1',s:'blau'}],['frame',142,35,1,{id:'f2',s:'weiss'}],['board',80,49,1,{id:'a',n:3,c:'#cfeaf2'}],
   ['kasten',26,72,1,{id:'r',c:2,r:2,ft:0,col:'#a9d3e2',back:'#eef8fb'}],['tanne',52,73,1],['iglu',80,73,1],['tanne',108,74,.9],
   ['eisblock',124,72.4,1,{id:'x',h:13}],['eisblock',142,72.4,1,{id:'y'}],['schneemann',151,80,1],
   ['rug',122,97,1,{w:50,h:10,s:'fell',c:'#e9dcc6'}],['schlitten',38,94,1,{id:'s'}],['lagerfeuer',80,92,1],
   ['spot',12,97,1,{id:'g1',w:18,h:21}],['spot',110,97,1,{id:'g2',w:20,h:22}],['spot',134,98,1,{id:'g3',w:22,h:22}]],
 P:[['eiszapfen',18,16,1],['eiszapfen',72,16,1],['hoehlenbild',45,31,1],
   ['frame',12,41,1,{id:'f1',s:'blau'}],['frame',78,41,1,{id:'f2',s:'weiss'}],['board',45,54,1,{id:'a',n:3,c:'#cfeaf2'}],
   ['kasten',16,89.6,1,{id:'r',c:2,r:2,ft:0,col:'#a9d3e2',back:'#eef8fb'}],['iglu',51,90.6,.9],['eisblock',79,90,1,{id:'x',h:13}],
   ['schlitten',20,110,1,{id:'s'}],['lagerfeuer',50,103,.9],['eisblock',79,109,1,{id:'y'}],['schneemann',9,119.4,.7],
   ['spot',30,119,1,{id:'g1',w:17,h:16}],['spot',50,119,1,{id:'g2',w:17,h:15}],['spot',70,119,1,{id:'g3',w:17,h:18}]]},
dschungel:{n:'Dschungel-Gewächshaus',t:'Gewächshaus',icon:'zh_dschungel',base:'#cfe6d8',wall:['glas','#f3f6ee','#c98a6a'],floor:['fliesen','#dcb692','#c9976e'],
 L:[['ampel',30,25,1,{cord:7}],['ampel',130,25,1,{cord:7,c:'#e9dcc6'}],['liane',4,34,1,{h:32}],['liane',156,30,1,{h:28}],
   ['frame',50,34,1,{id:'f1',s:'gruen'}],['board',80,37,1,{id:'a',n:3,c:'#f3f6ee'}],['frame',110,34,1,{id:'f2',s:'weiss'}],
   ['staude',14,73,1],['pflanztisch',50,72,1,{id:'t'}],['kasten',100,72,1,{id:'k',c:2,r:2,col:'#f3f6ee',back:'#dfeee0'}],
   ['pflanze',128,73.4,1.25,{k:'palme'}],['pflanze',147,75,1.35,{k:'monstera',pot:'#e9dcc6'}],['falter',136,52,1],
   ['fels',12,96,1,{id:'s'}],['teich',42,98,1,{id:'e'}],['frosch',54,94.6,1],['stamm',86,96,1,{id:'m'}],['beet',136,86,1,{w:34}],['giesskanne',67,80.4,1],
   ['spot',120,99,1,{id:'g1',w:18,h:21}],['spot',144,99,1,{id:'g2',w:20,h:21}]],
 P:[['ampel',15,25,1,{cord:7}],['ampel',75,25,1,{cord:7,c:'#e9dcc6'}],['liane',87,34,1,{h:30}],
   ['board',45,38,1,{id:'a',n:3,c:'#f3f6ee'}],['frame',11,47,1,{id:'f1',s:'gruen'}],['frame',79,47,1,{id:'f2',s:'weiss'}],
   ['staude',9,90,.9],['pflanztisch',40,89.6,1,{id:'t'}],['kasten',75,89.6,.9,{id:'k',c:2,r:2,col:'#f3f6ee',back:'#dfeee0'}],['falter',76,58,1],
   ['fels',10,108,1,{id:'s'}],['teich',35,118.6,1,{id:'e',w:30}],['frosch',46,115.4,1],['stamm',68,110,.9,{id:'m'}],
   ['spot',59,119.4,1,{id:'g1',w:15,h:16}],['spot',79,119.4,1,{id:'g2',w:17,h:16}]]},
});
ORDER.splice(ORDER.indexOf('dach')+1,0,'stern');
ORDER.splice(ORDER.indexOf('keller')+1,0,'meer','vulkan','fossil','eis','dschungel');

/* kurzer Satz beim ersten Besuch · Lieblingsdinge der Themenräume (leuchten dort besonders) */
const SAYS={flur:'Hier kommst du ins Haus.',wohn:'Hier ist es gemütlich.',kueche:'Hier wird gekocht.',schlaf:'Hier träumst du von Dinos.',bad:'Hier wird geplanscht.',
  arbeit:'Hier forschen wir. Pip wohnt auch hier.',dach:'Hier oben liegen alte Schätze.',keller:'Hier unten wird gebastelt.',garten:'Hier draußen ist es grün.',
  stern:'Hier schauen wir zu den Sternen.',meer:'Hier sieht es aus wie im Urzeit-Meer.',vulkan:'Hier forschen wir über Vulkane.',fossil:'Hier zeigen wir unsere Funde.',
  eis:'Brrr! Hier ist es kalt wie in der Eiszeit.',dschungel:'Hier wachsen Pflanzen wie im Dschungel.'};
Object.keys(SAYS).forEach(k=>{if(ROOMS[k])ROOMS[k].say=SAYS[k];});
const anOf=it=>it.cat==='tiere'?DATA.animal(it.id):null;
Object.assign(ROOMS.fossil,{match:it=>it.cat==='funde'||it.cat==='skelette',yay:['Das passt gut in die Galerie!']});
Object.assign(ROOMS.meer,{match:it=>!!anOf(it)&&DATA.habitat(it.id)==='wasser',yay:['Platsch! Hier fühlt es sich wohl.']});
Object.assign(ROOMS.eis,{match:it=>{const a=anOf(it);return !!a&&a.era==='quartaer';},yay:['Brrr! Das Tier mag den Schnee.']});
Object.assign(ROOMS.stern,{match:it=>!!anOf(it)&&DATA.habitat(it.id)==='luft',yay:['Hui! Hoch hinaus zu den Sternen.']});
Object.assign(ROOMS.dschungel,{match:it=>{const a=anOf(it);return !!a&&a.food==='pflanzen'&&DATA.habitat(it.id)==='land';},yay:['Mmh! Hier gibt es viele leckere Blätter.']});

/* ---------- kleine Figuren und antippbare Dinge der Themenräume ---------- */
Object.assign(SPR,{
  rakete:Object.assign(()=>pa('M1.2 17.4l1.8-4.4v5.6zM9.8 17.4L8 13v5.6z',C.terra)+pa('M5.5 .6Q9 5 9 12.4v5.6H2v-5.6Q2 5 5.5 .6z','#f6f1e6')+pa('M5.5 .6Q7.6 3.2 8.4 6.4H2.6Q3.4 3.2 5.5 .6z',C.terra)+ci(5.5,10,1.9,'#8fbccb',`stroke="${C.dmetal}" stroke-width=".5"`)+rc(2,16,7,1.4,C.sea,0)+pa('M3.6 18h3.8l-.6 2.6q-1.3 1.8-2.6 0z','#f7a53a',NO)+pa('M4.6 18h1.8l-.9 2.4z','#f7e08a',NO),{vb:'0 0 11 23'}),
  planeten:Object.assign(()=>rc(2,.6,22,.9,C.w3,.4)+ln('M5 1.4V7M13 1.4v9M21 1.4V6M9 1.4v13M17 1.4V14.6',C.ink,.2,.6)+ci(5,9.4,2.6,'#8fbccb')+pa('M3.4 8.6q1.4-.8 2.2 .4-.2 1.4-1.6 1.2z','#8fbf7a',NO)+ci(13,13,3,'#e9b06a')+el(13,13,5,1.2,'none',`stroke="#c98a5a" stroke-width=".6"`)+pa(starD(21,8.2,2.4,.48),'#f5d36a')+ci(9,15.6,1.3,'#c8553d')+pa('M17 14.6a2 2 0 1 0 1.9 2.7A1.8 1.8 0 0 1 17 14.6z','#fbf1c8'),{vb:'0 0 26 20'}),
  falter:Object.assign(()=>pa('M6 6Q2 0 .6 3.4T6 6.4zM6 6Q10 0 11.4 3.4T6 6.4z','#f0a53a')+pa('M6 6.4Q2.4 7 2.6 9.6T6 7.4zM6 6.4Q9.6 7 9.4 9.6T6 7.4z','#e8857a')+ci(2.6,3.6,.6,'#fffaf0',NO)+ci(9.4,3.6,.6,'#fffaf0',NO)+rc(5.6,4.4,.8,4.6,C.ink,.4,NO)+ln('M6 4.6L4.8 2.6M6 4.6l1.2-2',C.ink,.2,.8),{vb:'0 0 12 12'}),
  frosch:()=>el(8,11,5.4,3.6,'#7fb06a')+ci(5.4,7,2,'#7fb06a')+ci(10.6,7,2,'#7fb06a')+ci(5.4,6.8,.9,'#fffaf0',NO)+ci(10.6,6.8,.9,'#fffaf0',NO)+ci(5.6,6.9,.45,C.ink,NO)+ci(10.8,6.9,.45,C.ink,NO)+ln('M5.6 11.6q2.4 1.4 4.8 0',C.ink,.3,.8)+pa('M2.4 13.6q-1.6-.4-1.6 1h3zM13.6 13.6q1.6-.4 1.6 1h-3z','#6fa05a'),
  hase:()=>el(5.6,3.8,1,3.6,'#f4f1ea')+el(9.4,3.6,1,3.6,'#f4f1ea')+el(5.6,4,.4,2.4,'#f0c8c0',NO)+el(9.4,3.8,.4,2.4,'#f0c8c0',NO)+ci(7.6,10,4.6,'#f4f1ea')+ci(6,9.4,.5,C.ink,NO)+ci(9.2,9.4,.5,C.ink,NO)+pa('M7 10.8h1.2l-.6 .8z','#e8a9a0',NO)+ln('M7.6 11.6v.8M6.8 12.8q.8 .6 1.6 0',C.ink,.2,.8),
});
Object.assign(HOT,{
  bones:fx('Dino-Skelett','dust',5,1200,['clink',170,'clink',170,'clink'],'Klapper, klapper! Alte Dino-Knochen.'),
  dust:fx('Grabungskiste','dust',5,1400,['dig',220,'brush',220,'brush'],'Schrubb, schrubb! Da liegt ein Knochen im Sand.'),
  bub:fx('Aquarium','bub',5,1700,['pop',220,'pop',240,'pop'],'Blubb, blubb, blubb!'),
  muschel:fx('Muschel','',0,1500,['whoosh',600,'whoosh'],'Hörst du das Meer rauschen?'),
  frosch:fx('Frosch','',0,900,['jump',300,'egg'],'Quak! Der Frosch hüpft.','frosch','hop'),
  falter:fx('Schmetterling','',0,2400,['star'],'Oh, ein Schmetterling!','falter','flutter'),
  iglu:fx('Iglu','',0,1700,['pop'],'Huch! Im Iglu wohnt ein Schneehase.','hase','peekb'),
  mammut:fx('Höhlenbild','',0,1500,['trumpet'],'Töröö! Das ist ein Mammut.'),
  schneemann:fx('Schneemann','cold',5,1400,['pop',160,'clink'],'Brrr! Hallo, Schneemann.'),
  eiszapfen:fx('Eiszapfen','cold',5,1400,['clink',150,'clink',150,'clink'],'Kling, kling! Die Eiszapfen klingen.'),
  vulkan:fx('Vulkan-Modell','spark',6,1900,['bump',200,'whoosh'],'Rumms! Der kleine Vulkan spuckt Funken.'),
  kolben:fx('Glaskolben','bub',5,1700,['pop',200,'egg',200,'pop'],'Blubber, blubber! Es brodelt.'),
  kristall:fx('Kristall','stars',4,1500,['magic'],'Schau, der Kristall funkelt!'),
  sterne:fx('Sternenfenster','stars',5,1700,['magic'],'So viele Sterne am Himmel!'),
  teleskop:fx('Fernrohr','stars',4,1600,['star'],'Durch das Fernrohr sehe ich den Mond.'),
  rakete:fx('Rakete','',0,2000,['whoosh'],'Drei, zwei, eins, los!','rakete','fly'),
  mobile:fx('Planeten','',0,2400,['star'],'Die Planeten kreisen um die Sonne.','planeten','sway'),
});

/* ---------- Mini-Einrichtung für die Haus-Übersicht (Rahmen 24×18, Boden bei 14.4) ---------- */
const MINI={
  flur:[['tuer',6,15.4,.25],['treppe',17,15.4,.24]],
  wohn:[['win',5,10,.2,{c:'#c8553d'}],['sofa',12,15.6,.27],['kamin',20.6,15.4,.2]],
  kueche:[['kuehl',4,15.4,.24],['herd',10.4,15.4,.27],['tisch',18.6,15.8,.28,{n:2,cloth:'#c8553d'}]],
  schlaf:[['bett',10,15.8,.28],['win',20,10.4,.19,{c:'#b58cbd'}]],
  bad:[['wanne',8.6,15.8,.28],['waschbecken',17,15.4,.3],['klo',21.4,15.4,.3]],
  arbeit:[['frame',9,7.6,.3],['schreibtisch',7.4,15.6,.3],['kasten',18.4,15.6,.22,{c:2,r:3}]],
  dach:[['win',12,9.6,.24,{s:'rund',f:'#8a6548'}],['truhe',6.4,15.6,.3],['kartons',18,15.6,.3]],
  keller:[['fass',4.6,15.6,.34],['waschmaschine',12,15.4,.3],['kasten',19.6,15.6,.2,{c:2,r:2,col:'#8a6548',back:'#c9b99c',fill:{0:'j',3:'k'}}]],
  garten:[['baum',7,16.4,.26],['gartentisch',18,16.6,.24]],
  stern:[['kuppelfenster',13,10.8,.28],['teleskop',5.4,15.8,.32],['sitzsack',19,15.8,.32]],
  meer:[['win',19.6,8.6,.24,{s:'rund',sea:1,f:'#c9a04a'}],['aquarium',8.4,15.6,.3],['bootregal',20,15.6,.2]],
  vulkan:[['vulkanmodell',8,15.6,.34],['labortisch',18.4,15.6,.22]],
  fossil:[['fossilwand',12,8.4,.34],['sockel',5.4,15.6,.34],['vitrine',17.6,15.6,.26]],
  eis:[['iglu',9,15.8,.36],['tanne',20,16,.3]],
  dschungel:[['staude',5.4,16,.3],['pflanztisch',15.6,16,.26],['pflanze',21.4,16,.3,{k:'palme'}]],
};
Object.keys(MINI).forEach(k=>{if(ROOMS[k])ROOMS[k].mini=MINI[k];});
ROOMS.dach.ovc=['#d9b98c','#b88a5e']; ROOMS.keller.ovc=['#b3a794','#a39886'];
/* Garten und Gewächshaus stehen im Freien: eigene Zeichnung statt Wand */
const ovSky=(x,y,w,h)=>`<svg x="${x}" y="${y}" width="${w}" height="${f2(h*.8+.2)}" viewBox="0 0 40 32" preserveAspectRatio="xMidYMax slice">${skyInner({bare:1},40,32)}</svg>`;
ROOMS.garten.ov=(x,y,w,h,inside)=>{const g=grassCol(),fy=y+h*.8,hd=ENVV.season==='winter'?'#dfe9e6':ENVV.night?'#35523f':'#5f8f55';let s=inside?ovSky(x,y,w,h):'',d=`M${x} ${f2(fy)}v-3.4`;
  for(let i=0;i<Math.round(w/3);i++)d+='q1.5-1.6 3 0';s+=pa(d+`V${f2(fy)}z`,hd,NO)+rc(x,fy-.2,w,y+h-fy+.2,g,0,NO);
  for(let i=0;i<6;i++)s+=ci(x+w*(.1+i*.16),fy+1.4+(i%2)*1.2,.4,i%2?'#fffaf0':'#f6c9d4',NO);return s;};
ROOMS.dschungel.ov=(x,y,w,h,inside)=>{const fy=y+h*.8,fr='#f3f6ee',ry=y+h*.26,gl=`M${x} ${f2(fy)}V${f2(ry)}L${f2(x+w/2)} ${y}L${x+w} ${f2(ry)}V${f2(fy)}z`;let s=inside?ovSky(x,y,w,h):'';
  s+=`<g ${clip(`<path d="${gl}"/>`)}>`+rc(x,y,w,h,'#dff1ea',0,`${NO} opacity=".5"`);
  for(let i=0;i<5;i++)s+=el(x+w*(.1+i*.2),fy-h*.2,w*.12,h*.3,i%2?'#6a9f62':'#4f8a5a',`${NO} opacity=".55"`);
  s+='</g>'+rc(x,fy-.2,w,y+h-fy+.2,'#dcb692',0,NO)+rc(x,fy-2.2,w,2.2,'#c98a6a',0,NO);
  for(let i=1;i<4;i++)s+=rc(x+w*i/4-.3,i===2?y:ry-h*.13,.6,fy-(i===2?y:ry-h*.13),fr,0,NO);
  return s+rc(x,ry+h*.2,w,.6,fr,0,NO)+ln(gl,fr,.9)+ln(gl,sh(fr,.7),.2,.6);};

/* =====================================================================
   7 · Haus-Übersicht (aufgeschnittenes Puppenhaus)
   Zellen in Zeichen-Einheiten [x0,y0,x1,y1]; gemaltes Bild: stationen/haus_uebersicht (+ _hoch)
   ===================================================================== */
const OV={
 L:{gy:75,roof:'M24 30.4L42 6.4H111L129 30.4z',body:[30,29,123,75],chim:[58,-1],
   cells:{dach:[50,10,84,27.4],stern:[88,10,112,27.4],
     schlaf:[32,31,53,51],bad:[55,31,75,51],arbeit:[77,31,98,51],eis:[100,31,121,51],
     wohn:[32,54,59,74],flur:[61,54,77,74],kueche:[79,54,98,74],fossil:[100,54,121,74],
     keller:[32,79,59,97],meer:[61,79,90,97],vulkan:[92,79,121,97],
     garten:[3,51,27,74.6],dschungel:[127,48,157,74.6]}},
 P:{gy:88,roof:'M30 29.4L37 6.4H79L86 29.4z',body:[6,29,84,88],chim:[46,-1],
   cells:{dschungel:[8,11,30,28.6],dach:[35,10,58,27.4],stern:[61,10,81,27.4],
     schlaf:[8,31,31,47],bad:[33,31,57,47],arbeit:[59,31,82,47],
     wohn:[8,50,31,66],eis:[33,50,57,66],fossil:[59,50,82,66],
     kueche:[8,69,31,87],flur:[33,69,57,87],garten:[59,69,82,87.6],
     keller:[8,92,31,110],meer:[33,92,57,110],vulkan:[59,92,82,110]}},
};
const OUTSIDE={garten:1,dschungel:1};
/* kleines Zimmer in einer Zelle: Wand, Boden, ein paar Möbel im Kleinformat (Rahmen 24×18) */
function cellArt(id,x0,y0,x1,y1,inside){const R=ROOMS[id],w=x1-x0,h=y1-y0,fy=y1-h*.2;let s='';
  const wc=R.ovc||[R.wall[1],R.floor[1]];
  if(R.ov)s+=R.ov(x0,y0,w,h,inside);
  else s+=rc(x0,y0,w,h,wc[0],0,NO)+rc(x0,y0,w,h*.34,grad([[0,'#3c2814',.16],[1,'#3c2814',0]]),0,NO)+rc(x0,fy,w,y1-fy,wc[1],0,NO)+ln(`M${x0} ${f2(fy)}h${w}`,sh(wc[1],.7),.25,.7);
  const sc=Math.min(w/24,h/18),ox=x0+w/2-12*sc,oy=y1-18*sc;
  (R.mini||[]).forEach(([t,cx,yb,ms,o])=>{const p=F[t](o||{},'L'),k=sc*(ms||.4);s+=`<g transform="translate(${f2(ox+cx*sc-p.w*k/2)} ${f2(oy+yb*sc-p.h*k)}) scale(${f2(k)})">${p.svg}</g>`;});
  return `<g ${clip(`<rect x="${x0}" y="${y0}" width="${w}" height="${h}"/>`)}>${s}</g>`;}
function ovSVG(m){const [UW,UH]=U[m],O=OV[m],gy=O.gy,[bx0,by0,bx1,by1]=O.body;GID=0;DEFS='';const R=rng(21);
  let s=`<svg x="0" y="0" width="${UW}" height="${gy+1}" viewBox="0 0 ${UW} ${gy+1}">${skyInner({bare:1},UW,gy+1)}</svg>`;
  /* ferne Hügel, Wiese, Erde */
  const g=grassCol();
  s+=pa(`M0 ${gy-9}Q${UW*.2} ${gy-17} ${UW*.42} ${gy-10}T${UW} ${gy-13}V${gy}H0z`,mx(g,'#b6d8e4',.45),NO)+pa(`M0 ${gy-4}Q${UW*.3} ${gy-9} ${UW*.6} ${gy-5}T${UW} ${gy-6}V${gy}H0z`,sh(g,.94),NO);
  s+=rc(0,gy,UW,UH-gy,grad([[0,'#a9825a'],[1,'#7a5a3c']]),0,NO);
  for(let i=0;i<46;i++){const x=R()*UW,y=gy+2+R()*(UH-gy-3),r=.5+R()*1.3;s+=el(x,y,r*1.4,r,i%3?'#b9a184':'#8f7458',`${NO} opacity=".7"`);}
  /* Fossilien in der Erde */
  [[.08,.5],[.93,.62]].forEach(([fx,fy],i)=>{const x=UW*fx,y=gy+(UH-gy)*fy;s+=i?ln(`M${x-3} ${y}h6M${x-3} ${y-1}v2M${x+3} ${y-1}v2`,'#eadfc8',1,.9):ci(x,y,2.6,'#d9c8a8')+ln(`M${x} ${y}m-1.8 0a1.8 1.8 0 1 1 1.8 1.8a1.1 1.1 0 1 1 1.1-1.1`,'#8f7458',.4,.9);});
  s+=pa(`M0 ${gy+1.6}V${gy-1}Q${UW*.25} ${gy-2.2} ${UW*.5} ${gy-1}T${UW} ${gy-1.2}V${gy+1.6}z`,g,NO);
  for(let x=1;x<UW;x+=2.3)s+=ln(`M${f2(x)} ${gy-.6}l${f2(R()-.5)} -${f2(1+R()*1.2)}`,sh(g,.82),.3,.8);
  /* Keller-Schacht */
  const ce=Object.keys(O.cells).filter(k=>O.cells[k][1]>gy).map(k=>O.cells[k]);
  if(ce.length){const cx0=Math.min(...ce.map(c=>c[0]))-2,cx1=Math.max(...ce.map(c=>c[2]))+2,cy1=Math.max(...ce.map(c=>c[3]))+2;
    s+=rc(cx0,gy+.6,cx1-cx0,cy1-gy-.6,pattern(6,3.4,rc(0,0,6,3.4,'#9a9184',0,NO)+ln('M0 0h6M0 1.7h6M1.6 0v1.7M4.4 1.7v1.7','#6f675c',.22,.8)),.8,`stroke="#5f574c" stroke-width=".4"`);}
  /* Haus-Körper */
  s+=rc(bx0+.8,by0+.8,bx1-bx0,by1-by0,'#3c2814',1,`${NO} opacity=".14"`)+rc(bx0,by0,bx1-bx0,by1-by0,'#efe0c2',1,`stroke="${C.w3}" stroke-width=".5"`);
  /* Dach */
  const tiles=pattern(5,3.2,rc(0,0,5,3.2,'#c8654a',0,NO)+ln('M0 3.2q2.5-3 5 0M-2.5 1.6q2.5-3 5 0M2.5 1.6q2.5-3 5 0','#9a4634',.3,.75));
  s+=rc(O.chim[0],by0-23+O.chim[1]+6,6,12,'#c9a58a',.5)+rc(O.chim[0]-.8,by0-23+O.chim[1]+5,7.6,2,'#a8846a',.5);
  s+=pa(O.roof,tiles,`stroke="#8a3f2e" stroke-width=".5" stroke-linejoin="round"`)+hi(O.roof.replace(/L([\d.]+) ([\d.]+)H([\d.]+)L.*/,'M$1 $2H$3').replace(/^M[\d.]+ [\d.]+/,''),.4,.3);
  /* Zellen */
  Object.keys(O.cells).forEach(id=>{const [x0,y0,x1,y1]=O.cells[id];if(!ROOMS[id])return;
    if(!OUTSIDE[id])s+=rc(x0-1.1,y0-1.1,x1-x0+2.2,y1-y0+2.2,y0>gy?'#6f675c':(y1<by0?'#8a5a3a':C.w2),.6);
    const inside=x0>=bx0&&x1<=bx1&&y0>=by0&&y1<=by1;
    if(OUTSIDE[id]&&inside)s+=rc(x0-1.1,y0-1.1,x1-x0+2.2,y1-y0+2.2,C.w2,.6);
    s+=cellArt(id,x0,y0,x1,y1,inside);
    if(!OUTSIDE[id])s+=rc(x0,y0,x1-x0,y1-y0,'none',.2,`stroke="#3c2814" stroke-width=".3" stroke-opacity=".5"`);});
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${UW*10}" height="${UH*10}" viewBox="0 0 ${UW} ${UH}"><defs>${DEFS}</defs>${s}</svg>`;}

/* =====================================================================
   8 · Truhe: was das Kind gesammelt hat
   ===================================================================== */
const CATS=[
  {id:'deco',icon:'q_pflanze',n:'Schöne Sachen'},
  {id:'tiere',icon:'babydino',n:'Tiere',hint:'Hier ist noch kein Tier. Tippe auf der Karte Dinos an oder besuche das Museum!',go:'museum'},
  {id:'funde',icon:'ammonit',n:'Funde',hint:'Hier ist noch kein Fund. Such auf der Karte nach Glitzer oder grab bei der Ausgrabung!',go:'grabung'},
  {id:'sticker',icon:'sticker',n:'Sticker',hint:'Sticker bekommst du, wenn du ein Spiel zum ersten Mal schaffst.'},
  {id:'karten',icon:'zh_karte',n:'Karten',hint:'Öffne ein Kartenpäckchen im Kartenhaus!',go:'karten'},
  {id:'fotos',icon:'kamera',n:'Fotos',hint:'Mach Fotos mit der Forscherkamera im Eisland!',go:'kamera'},
  {id:'modelle',icon:'hammer',n:'Modelle',hint:'Bau ein Dino-Modell in der Modell-Werkstatt!',go:'werkstatt'},
  {id:'skelette',icon:'knochen',n:'Skelette',hint:'Grab ein Skelett bei der Ausgrabung aus!',go:'grabung'},
];
ART.ICONS.zh_karte=`<rect x="14" y="8" width="36" height="48" rx="5" fill="#fbf3e0" stroke="#3d3226" stroke-width="1.8"/><rect x="19" y="13" width="26" height="24" rx="3" fill="#b6d8e4"/><path d="M22 34q6-12 14-8 4-6 8 0v3H22z" fill="#7fa66a"/><path d="M20 43h24M20 49h16" stroke="#b59b72" stroke-width="2.4" stroke-linecap="round"/>`;

/* Modelle aus der Werkstatt → ähnliches Tier (die Werkstatt-Zeichnung selbst ist dort privat) */
const MODEL_AN={Tyrannosaurus:'trex',Triceratops:'triceratops',Stegosaurus:'stegosaurus',Brachiosaurus:'brachiosaurus',Ankylosaurus:'ankylosaurus',Spinosaurus:'spinosaurus'};
function modelAnimal(m){if(MODEL_AN[m.n])return MODEL_AN[m.n];if(m.body==='langhals')return'brachiosaurus';if(m.back==='platten')return'stegosaurus';if(m.tail==='keule')return'ankylosaurus';
  if(m.back==='segel')return'spinosaurus';if(m.head==='horn')return'triceratops';if(m.body==='zwei')return'trex';return'iguanodon';}

function catalog(){
  const S=DW.state,H=HS(),out=[];
  Q().DECO.forEach(d=>{if(d.start||H.deco[d.id])out.push({key:'deco:'+d.id,cat:'deco',id:d.id,n:d.n,html:()=>Q().decoHTML(d)});});
  Object.keys(S.animals).sort((a,b)=>S.animals[b]-S.animals[a]).forEach(id=>{if(!DATA.animal(id))return;out.push({key:'animal:'+id,cat:'tiere',id,n:DATA.nameOf(id),html:()=>DW.animalImg(id,{shadow:false})});});
  Object.keys(S.finds).forEach(id=>{const f=DATA.find(id);if(f)out.push({key:'find:'+id,cat:'funde',id,n:f.n,html:()=>`<span class="zh-find">${ART.icon(f.icon)}</span>`});});
  Object.keys(S.stickers).forEach(id=>{const s=DATA.sticker(id);if(s)out.push({key:'sticker:'+id,cat:'sticker',id,n:s.n,html:()=>`<span class="zh-stk">${ART.icon(s.icon)}</span>`});});
  const have=(S.cards||{}).have||{};Object.keys(have).filter(no=>have[no]>0).map(Number).sort((a,b)=>a-b).forEach(no=>{const c=DATA.CARDS[no-1];if(c)out.push({key:'card:'+no,cat:'karten',n:c.n,frame:1,html:()=>`<img class="zh-card" src="${c.img}" alt="" draggable="false">`});});
  const album=(GK.st('kamera').album||[]).slice().reverse(),seenP=new Set();album.forEach(p=>{if(seenP.has(p.id)||seenP.size>=16||!DATA.animal(p.id))return;seenP.add(p.id);
    out.push({key:'photo:'+p.id,cat:'fotos',id:p.id,n:DATA.nameOf(p.id),frame:1,html:()=>`<span class="zh-photo"><span>${DW.animalImg(p.id,{shadow:false})}</span></span>`});});
  (GK.st('werkstatt').models||[]).forEach(m=>{const a=modelAnimal(m);out.push({key:'model:'+(m.t||m.n),cat:'modelle',id:a,n:m.n,html:()=>`<span class="zh-model">${DW.animalImg(a,{shadow:false})}<i></i></span>`});});
  const skelHTML=id=>`<span class="zh-skel">${(window.ASSETS&&ASSETS.img('fossilien/skelett_'+id))||DW.animalImg(id,{shadow:false})}</span>`, seenS=new Set();
  Object.keys((S.dig||{}).done||{}).forEach(sid=>{const site=(DATA.DIG_SITES||[]).find(s=>s.id===sid);if(!site)return;
    const an=({klippe:'brachiosaurus'})[sid]&&!((S.dig.found||{}).ichthyosaurus)?'brachiosaurus':site.animal; /* ältere Spielstände: an der Steilküste lag früher ein Brachiosaurus */
    if(seenS.has(an))return;seenS.add(an);
    out.push({key:'skel:'+sid,cat:'skelette',id:an,n:DATA.nameOf(an)+'-Skelett',html:()=>skelHTML(an)});});
  Object.keys((S.dig||{}).found||{}).forEach(id=>{if(seenS.has(id)||!DATA.animal(id))return;seenS.add(id);
    out.push({key:'skel:a:'+id,cat:'skelette',id,n:DATA.nameOf(id)+'-Skelett',html:()=>skelHTML(id)});});
  return out;}
let CAT=[]; const byKey=k=>CAT.find(i=>i.key===k);

/* =====================================================================
   9 · Spielstand: DW.state.home.rooms[raum].spots = {platz: schlüssel}
   (alte home.spots des Einzelzimmers übernimmt quest.js → rooms.arbeit.spots)
   ===================================================================== */
const HS=()=>{const H=Q().home();H.rooms=H.rooms||{};return H;};
const spotsOf=id=>{const H=HS();const r=H.rooms[id]=H.rooms[id]||{};r.spots=r.spots||{};return r.spots;};
function placedMap(){const m=new Map();ORDER.forEach(r=>{const s=spotsOf(r);Object.keys(s).forEach(k=>{if(!m.has(s[k]))m.set(s[k],{room:r,spot:k});});});return m;}
/* aufräumen: unbekannte Schlüssel (z. B. altes Foto) und doppelt gestellte Sachen entfernen */
function cleanKeys(){const seen=new Set();ORDER.forEach(r=>{const s=spotsOf(r);Object.keys(s).forEach(k=>{if(!byKey(s[k])||seen.has(s[k]))delete s[k];else seen.add(s[k]);});});}
function cleanRoom(id,B){const ok=new Set(B.spots.map(s=>s.id)),s=spotsOf(id);let ch=false;Object.keys(s).forEach(k=>{if(!ok.has(k)){delete s[k];ch=true;}});if(ch)DW.save();}

/* =====================================================================
   10 · Oberfläche
   ===================================================================== */
let root=null, room=null, view='ov', cur='arbeit', mode='L', lay='L', cat='deco', page=0, per=4, sel=null, B=null, GEO={rw:0,rh:0}, dragG=null, placed=0, firstEver=false;
const $=s=>root.querySelector(s);
const pct=v=>v.toFixed(2)+'%';
const flash=el=>{if(!el)return;el.classList.remove('gk-good');void el.offsetWidth;el.classList.add('gk-good');};
const roomIcon=id=>ART.icon(ROOMS[id].icon);

function mount(r){
  root=r; const H=HS(); firstEver=!H.visited; H.visited=(H.visited||0)+1;
  CAT=catalog(); const nNew=CAT.length-(H.lastCount||0); H.lastCount=CAT.length; cleanKeys(); DW.save();
  readEnv(); sel=null; page=0; placed=0; view='ov';
  root.innerHTML=`<div class="zh fill">
    <div class="zh-ov"><div class="zh-house"><canvas class="zh-bg"></canvas><div class="zh-cells"></div></div></div>
    <div class="zh-rv" hidden>
      <button class="zh-nb zh-home" type="button" aria-label="Zum ganzen Haus">${ART.icon('haus')}</button>
      <button class="zh-nb zh-prev" type="button" aria-label="Zimmer davor">${ART.icon('pfeil_l')}<span class="zh-ni"></span></button>
      <button class="zh-chip" type="button"></button>
      <button class="zh-nb zh-next" type="button" aria-label="Nächstes Zimmer"><span class="zh-ni"></span>${ART.icon('pfeil_r')}</button>
      <div class="zh-roomwrap"><div class="zh-room"></div></div>
      <div class="zh-tray"><button class="zh-chest" type="button" aria-label="Schatztruhe">${ART.icon('q_truhe')}</button>
        <div class="zh-tcol"><div class="zh-cats" role="tablist"></div>
          <div class="zh-items"><button class="zh-pg prev" type="button" aria-label="Zurück">${ART.icon('pfeil_l')}</button><div class="zh-row"></div><button class="zh-pg next" type="button" aria-label="Weiter">${ART.icon('pfeil_r')}</button></div></div></div>
    </div></div>`;
  room=$('.zh-room');
  /* Eine schnell „geworfene“ Sache endet für den Browser als Schwung-Geste; der nächste Tipp kurz danach (Haus-Knopf, Pfeil, Truhe)
     würde dann verschluckt. Für ziehbare Sachen deshalb keine Browser-Gesten – Ziehen und Tippen laufen ohnehin über Zeigerereignisse. */
  $('.zh').addEventListener('touchstart',e=>{if(e.cancelable&&e.target.closest&&e.target.closest('.zh-ti,.zh-it'))e.preventDefault();},{passive:false});
  $('.zh-home').onclick=()=>{DW.sfx('whoosh');showOv();DW.say('Das ganze Haus.');};
  $('.zh-prev').onclick=()=>step(-1); $('.zh-next').onclick=()=>step(1);
  $('.zh-chip').onclick=()=>{DW.sfx('tap');GK.ok($('.zh-chip'));DW.say(ROOMS[cur].n+'.');};
  $('.zh-chest').onclick=()=>{if(sel&&sel.from){toChest(sel.key);return;}DW.sfx('pop');GK.ok($('.zh-chest'));DW.say('Das ist deine Schatztruhe. Hier liegt alles, was du gesammelt hast.');};
  $('.zh-pg.prev').onclick=()=>{DW.sfx('tap');page--;renderTray();};
  $('.zh-pg.next').onclick=()=>{DW.sfx('tap');page++;renderTray();};
  /* Antippen statt Ziehen: erst Gegenstand, dann Platz (oder Truhe) */
  room.addEventListener('click',e=>{if(!sel)return;if(e.target.closest('.zh-it,.zh-hot'))return;let sp=e.target.closest('.zh-spot');if(!sp){const n=nearSpot(e.clientX,e.clientY,22);sp=n&&n.el;}if(sp)placeSel(sp.dataset.s);else clearSel();});
  $('.zh-tray').addEventListener('click',e=>{if(sel&&sel.from&&!e.target.closest('.zh-ti,.zh-cat,.zh-pg,.zh-chest,.zh-go'))toChest(sel.key);});
  swipeSetup();
  GK.listen(window,'resize',onResize);
  showOv();
  if(firstEver){H.big=1;DW.say('Willkommen in deinem Forscherhaus! Dein Haus hat viele Zimmer. Tippe auf ein Zimmer!');}
  else if(!H.big){H.big=1;DW.say('Schön, dass du da bist! Dein Forscherhaus ist gewachsen. Es hat jetzt viele Zimmer!');}
  else if(nNew>0) DW.say('Schön, dass du da bist! In deiner Truhe liegen neue Sachen.');
  else DW.say('Schön, dass du da bist! Was stellen wir heute auf?');
  DW.save();
}
let rsT=0;
function onResize(){if(!root)return;endDrag();if(view==='ov')layoutOv();else{layoutRoom();renderRoom();renderCats();renderTray();}}

/* ---------- Haus-Übersicht ---------- */
function showOv(){
  view='ov'; clearSel(); $('.zh-rv').hidden=true; $('.zh-ov').hidden=false; DW.setStationTitle&&DW.setStationTitle('Mein Forscherhaus');
  layoutOv();
  GK.idle.set(()=>{const H=HS(),seen=H.seen||{};const id=ORDER.find(r=>!seen[r])||'arbeit';GK.pulse(root.querySelector(`.zh-cell[data-r="${id}"]`));},()=>DW.say('Tippe auf ein Zimmer!'));
}
function layoutOv(){
  const W=root.clientWidth,Hh=root.clientHeight;if(!W||!Hh)return;
  const m=W/Hh>=1.2?'L':'P',l=layFor('uebersicht',m),pad=W<600?6:12,ar=AR[l];
  let w=W-2*pad,h=w/ar;if(h>Hh-2*pad){h=Hh-2*pad;w=h*ar;}
  const house=$('.zh-house'),[UW,UH]=U[l],O=OV[l];house.style.width=Math.floor(w)+'px';house.style.height=Math.floor(h)+'px';house.dataset.l=l;
  const url=artURL('uebersicht',l);let bg=house.querySelector('.zh-bg');
  if(url){if(bg.tagName!=='IMG'||bg.getAttribute('src')!==url){const im=DW.h(`<img class="zh-bg rdy" src="${url}" alt="" draggable="false">`);bg.replaceWith(im);
      im.onerror=()=>{const a=A();if(!a||!a.fail||!root)return;a.fail(artKey('uebersicht',l));if(view==='ov')layoutOv();};}}
  else{const c=bgCanvas('ov|'+l+'|'+ENVV.sig,()=>ovSVG(l),Math.floor(w),Math.floor(h));if(c!==bg)bg.replaceWith(c);}
  const pm=placedMap(),inRoom={};pm.forEach((v,k)=>{(inRoom[v.room]=inRoom[v.room]||[]).push(k);});
  $('.zh-cells').innerHTML=ORDER.filter(id=>O.cells[id]).map(id=>{const [x0,y0,x1,y1]=O.cells[id],R=ROOMS[id],th=(inRoom[id]||[]).slice(0,3).map(k=>byKey(k)).filter(Boolean);
    return `<button class="zh-cell" type="button" data-r="${id}" aria-label="${R.n}" style="left:${pct(x0/UW*100)};top:${pct(y0/UH*100)};width:${pct((x1-x0)/UW*100)};height:${pct((y1-y0)/UH*100)}">
      <span class="zh-cic">${roomIcon(id)}</span><span class="zh-cth">${th.map(it=>`<span>${it.html()}</span>`).join('')}</span></button>`;}).join('');
  DW.$$('.zh-cell',root).forEach(b=>b.onclick=()=>{DW.sfx('pop');b.classList.add('go');const id=b.dataset.r;GK.after(180,()=>{if(root)enterRoom(id);});});
}

/* ---------- Zimmer ---------- */
function step(d){const i=ORDER.indexOf(cur);DW.sfx('whoosh');enterRoom(ORDER[(i+d+ORDER.length)%ORDER.length],d);}
function enterRoom(id,dir){
  if(!ROOMS[id])return; const H=HS(),R=ROOMS[id]; H.seen=H.seen||{}; const firstHere=!H.seen[id]; H.seen[id]=1;
  view='room'; cur=id; sel=null; $('.zh-ov').hidden=true; $('.zh-rv').hidden=false;
  layoutRoom(); renderRoom(dir); renderCats(); renderTray();
  let t=R.n+'.'; if(firstHere&&R.say)t+=' '+R.say;
  if(!H.tip){H.tip=1;t+=' In der Truhe liegen schon ein paar Sachen für dich. Zieh sie auf ein Regal oder an die Wand.';}
  DW.say(t); DW.save();
  GK.idle.set(()=>{const x=root.querySelector('.zh-ti:not(.placed)');GK.pulse(x||$('.zh-chest'));},()=>DW.say('Zieh etwas aus der Truhe auf ein Regal.'));
}
/* alle Maße einmal ausrechnen (feste Höhen → beim Ziehen, Blättern, Kategoriewechsel bewegt sich nichts) */
function layoutRoom(){
  const W=root.clientWidth,Hh=root.clientHeight;if(!W||!Hh)return;
  mode=W/Hh>=1.25?'L':'P'; lay=layFor(cur,mode);
  const small=W<600||Hh<520, pad=small?6:12, gap=small?6:10, nav=mode==='L'?(small?60:92):(small?56:72);
  const catH=Hh<520?40:56, tp=small?6:8, chest=W<600?0:(small?64:96), ar=AR[lay];
  let is=small?(W<600?62:56):(W<900?76:88), rows=1;
  const aw=mode==='L'?W-2*pad-2*(nav+gap):W-2*pad, ah0=mode==='L'?Hh-2*pad-gap:Hh-2*pad-2*gap-nav;
  const trayH=(n,s)=>tp*2+catH+6+n*s+(n-1)*6, fit=th=>Math.min(aw,(ah0-th)*ar);
  /* zweite Reihe in der Truhe, wenn das Zimmer dadurch (fast) nicht kleiner wird – notfalls mit etwas kleineren Kacheln, nie unter 56 px */
  const one=fit(trayH(1,is));
  for(const s of (W<600&&is>56?[is,56]:[is]))if(fit(trayH(2,s))>=one*.97){rows=2;is=s;break;}
  let rw=fit(trayH(rows,is)),rh=rw/ar;
  /* ganze Pixel und mittig ohne halbe Pixel (sonst wird die Zeichnung unscharf) */
  const wrapW=mode==='L'?aw:W-2*pad, wrapH=ah0-trayH(rows,is);
  rw=Math.floor(rw);if((wrapW-rw)%2)rw--;rh=Math.round(rw/ar);if((wrapH-rh)%2)rh--;
  const rv=$('.zh-rv');rv.className='zh-rv zh-m'+mode+(small?' zh-small':'')+(chest?'':' zh-nochest');
  const st=rv.style;st.setProperty('--pad',pad+'px');st.setProperty('--gap',gap+'px');st.setProperty('--nav',nav+'px');st.setProperty('--trayh',trayH(rows,is)+'px');st.setProperty('--cath',catH+'px');st.setProperty('--is',is+'px');st.setProperty('--tp',tp+'px');st.setProperty('--chest',chest+'px');
  room.style.width=rw+'px';room.style.height=rh+'px';room.style.setProperty('--u',(rw/U[lay][0]).toFixed(3)+'px');
  const pgMin=small?34:44, avail=W-2*pad-2*tp-(chest?chest+gap:0), cols=Math.max(1,Math.floor((avail-2*(pgMin+6)+8)/(is+8)));
  let pg=Math.max(pgMin,Math.min(64,Math.floor((avail-(cols*(is+8)-8))/2)-6)), pgg=6;     /* Blätter-Knöpfe füllen den Rest neben den Kacheln */
  if(pg<56&&pg>=52){pgg=6-(56-pg);pg=56;}                                                    /* fehlen nur wenige Pixel bis 56: Abstand verkleinern */
  per=cols*rows; st.setProperty('--cols',cols);st.setProperty('--pg',pg+'px');st.setProperty('--pgg',pgg+'px');st.setProperty('--pgh',(rows>1?rows*is+(rows-1)*6:Math.min(64,is))+'px');
  GEO={rw,rh,rows,maxCats:Math.max(3,Math.floor((W-2*pad-2*tp-(chest?chest+gap:0)+6)/62))};
}
function renderRoom(dir){
  const R=ROOMS[cur]; B=build(cur,lay); cleanRoom(cur,B);
  const {rw,rh}=GEO, url=artURL(cur,lay);
  room.className='zh-room zh-'+lay+' zh-r-'+cur+(dir?(dir>0?' zh-inr':' zh-inl'):' zh-in'); room.style.background=R.base||'#f1dfc0'; room.dataset.room=cur;
  room.innerHTML=(url?`<img class="zh-bg rdy" src="${url}" alt="" draggable="false">`:'')+
    B.hots.map((h,i)=>{const D=HOT[h.t];if(!D)return '';let l=h.x0*rw/100,t=h.y0*rh/100,w=(h.x1-h.x0)*rw/100,hh=(h.y1-h.y0)*rh/100;
      let hx='';
      if(!D.live){if(w<56){l-=(56-w)/2;w=56;}if(hh<56){t-=(56-hh)/2;hh=56;}
        w=Math.min(w,rw);hh=Math.min(hh,rh);l=Math.max(0,Math.min(l,rw-w));t=Math.max(0,Math.min(t,rh-hh));}   /* nie über den Zimmerrand hinaus */
      else if(w<56||hh<56)hx=`;--hx:${(-Math.max(0,(56-w)/2)).toFixed(1)}px;--hy:${(-Math.max(0,(56-hh)/2)).toFixed(1)}px`;   /* Bild bleibt klein, Trefferfläche ≥ 56 px */
      let inner=D.inner(h);
      if(h.g&&inner.indexOf('zh-glow')<0)inner='<i class="zh-glow"></i>'+inner;
      if(h.g){const r=h.g[2]*rw/100;inner=inner.replace('class="zh-glow"',`class="zh-glow" style="left:${(h.g[0]*rw/100-l-r).toFixed(1)}px;top:${(h.g[1]*rh/100-t-r).toFixed(1)}px;width:${(2*r).toFixed(1)}px;height:${(2*r).toFixed(1)}px"`);}
      if(D.spr&&h.sp)inner+=`<span class="zh-spw zh-an-${D.an||'hop'}" style="left:${(h.sp[0]*rw/100-l).toFixed(1)}px;top:${(h.sp[1]*rh/100-t).toFixed(1)}px;width:${(h.sp[2]*rw/100).toFixed(1)}px;height:${(h.sp[3]*rh/100).toFixed(1)}px">${sprite(D.spr)}</span>`;
      if(h.e)inner=inner.replace('class="zh-fx ',`style="left:${(h.e[0]*rw/100-l).toFixed(1)}px;top:${(h.e[1]*rh/100-t).toFixed(1)}px" class="zh-fx `);
      return `<button class="zh-hot zh-h-${h.t}${LAMPS.has(cur+'|'+h.id)?' on':''}${hx?' zh-hx':''}" type="button" data-i="${i}" aria-label="${D.n}" style="left:${l.toFixed(1)}px;top:${t.toFixed(1)}px;width:${w.toFixed(1)}px;height:${hh.toFixed(1)}px${hx}">${inner}</button>`;}).join('')+
    B.spots.map(s=>`<div class="zh-spot k-${s.k}" data-s="${s.id}" style="left:${pct(s.x0)};top:${pct(s.y0)};width:${pct(s.x1-s.x0)};height:${pct(s.y1-s.y0)}"></div>`).join('');
  if(!url)room.insertBefore(bgCanvas(B.key,()=>B.svg,rw,rh),room.firstChild);
  else{const im=room.querySelector('img.zh-bg'),k=artKey(cur,lay);    /* Bild gemeldet, aber Datei fehlt → wieder die Zeichnung */
    im.onerror=()=>{const a=A();if(!a||!a.fail||!root)return;a.fail(k);if(view==='room'){layoutRoom();renderRoom();renderCats();renderTray();}};}
  DW.$$('.zh-hot',room).forEach(b=>b.onclick=()=>{const h=B.hots[+b.dataset.i];HOT[h.t].tap(b,h);});
  /* Kopfleiste: Zimmer-Symbol und Nachbarn */
  const i=ORDER.indexOf(cur),pv=ORDER[(i-1+ORDER.length)%ORDER.length],nx=ORDER[(i+1)%ORDER.length];
  $('.zh-chip').innerHTML=roomIcon(cur); $('.zh-chip').setAttribute('aria-label',R.n);
  $('.zh-prev .zh-ni').innerHTML=roomIcon(pv); $('.zh-next .zh-ni').innerHTML=roomIcon(nx);
  DW.setStationTitle&&DW.setStationTitle(R.t||R.n);
  renderSpots();
}
function renderSpots(){const S=spotsOf(cur),R=ROOMS[cur];
  DW.$$('.zh-spot',room).forEach(sp=>{const key=S[sp.dataset.s],it=key&&byKey(key);sp.innerHTML='';sp.classList.toggle('full',!!it);sp.classList.toggle('match',!!(it&&R.match&&R.match(it)));
    if(!it)return; const el=DW.h(`<div class="zh-it${it.frame?' fr':''}${sel&&sel.key===it.key?' zh-pick':''}" data-k="${it.key}">${it.html()}</div>`);sp.appendChild(el);
    const sid=sp.dataset.s;
    DW.drag(el,{ghost:()=>`<div class="zh-ghost">${it.html()}</div>`,onStart:()=>startDrag(it.key,sid),onMove:(x,y)=>hover(x,y),onCancel:()=>endDrag(),
      onTap:()=>{if(sel&&sel.key!==it.key){placeSel(sid);return;}
        if(sel){clearSel();DW.sfx('tap');return;}
        DW.sfx('tap');el.classList.remove('wig');void el.offsetWidth;el.classList.add('wig');DW.say(it.n+'.');setSel({key:it.key,from:sid,room:1});},
      onDrop:(x,y)=>{const g=dragG;endDrag();if(!g)return false;
        if(inRect(x,y,g.tray)){toChest(it.key);return true;}
        const t=target(g,x,y);if(!t||t.id===sid)return false;place(it.key,t.id,true);return true;}});});}

/* ---------- Ziehen: Trefferflächen einmal messen, nächster freier Platz schnappt ein ---------- */
const inRect=(x,y,r)=>r&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;
function measure(key,from){const rr=room.getBoundingClientRect(),S=spotsOf(cur);
  return {key,from,room:rr,tray:$('.zh-tray').getBoundingClientRect(),hov:null,trayHov:false,
    spots:DW.$$('.zh-spot',room).map(el=>{const r=el.getBoundingClientRect();return {id:el.dataset.s,el,l:r.left,t:r.top,r:r.right,b:r.bottom,cx:(r.left+r.right)/2,cy:(r.top+r.bottom)/2,full:!!S[el.dataset.s]&&S[el.dataset.s]!==key};})};}
/* Ziel für einen Punkt: Platz direkt unter dem Finger (auch belegt → tauschen), sonst der nächste freie Platz im Zimmer */
function target(g,x,y){
  const m=14; if(x<g.room.left-m||x>g.room.right+m||y<g.room.top-m||y>g.room.bottom+m)return null;
  let best=null,bd=1e9,free=null,fd=1e9;
  g.spots.forEach(s=>{const dx=Math.max(s.l-x,0,x-s.r),dy=Math.max(s.t-y,0,y-s.b),d=Math.hypot(dx,dy),dc=Math.hypot(x-s.cx,y-s.cy)*.001;
    if(d<=6&&d+dc<bd){bd=d+dc;best=s;} if(!s.full&&d+dc<fd){fd=d+dc;free=s;}});
  return best||free;}
/* Tipp knapp neben einen Platz zählt noch (Plätze sind auf dem Handy kleiner als 56 px) */
function nearSpot(x,y,tol){let best=null,bd=1e9;DW.$$('.zh-spot',room).forEach(el=>{const r=el.getBoundingClientRect(),dx=Math.max(r.left-x,0,x-r.right),dy=Math.max(r.top-y,0,y-r.bottom),
    d=Math.hypot(dx,dy)+Math.hypot(x-(r.left+r.right)/2,y-(r.top+r.bottom)/2)*.001;if(Math.hypot(dx,dy)<=tol&&d<bd){bd=d;best={el,id:el.dataset.s};}});return best;}
function startDrag(key,from){clearSel();dragG=measure(key,from);room.classList.add('zh-dragon');if(from)$('.zh-tray').classList.add('zh-back');GK.idle.stop();}
function endDrag(){if(!root)return;room.classList.remove('zh-dragon');$('.zh-tray').classList.remove('zh-back','zh-trayhov');if(dragG&&dragG.hov)dragG.hov.el.classList.remove('hov');dragG=null;}
function hover(x,y){const g=dragG;if(!g)return;const overTray=!!g.from&&inRect(x,y,g.tray),t=overTray?null:target(g,x,y);
  if(t!==g.hov){g.hov&&g.hov.el.classList.remove('hov');t&&t.el.classList.add('hov');g.hov=t;}
  if(overTray!==g.trayHov){g.trayHov=overTray;$('.zh-tray').classList.toggle('zh-trayhov',overTray);}}

/* ---------- Antippen: auswählen, dann Platz antippen ---------- */
function setSel(s){sel=s;room.classList.add('zh-dragon','zh-sel');$('.zh-tray').classList.toggle('zh-back',!!s.from);
  DW.$$('.zh-pick',root).forEach(e=>e.classList.remove('zh-pick'));DW.$$(`[data-k="${s.key}"]`,root).forEach(e=>e.classList.add('zh-pick'));GK.idle.stop();}
function clearSel(){if(!sel)return;sel=null;if(!root)return;room.classList.remove('zh-dragon','zh-sel');$('.zh-tray').classList.remove('zh-back');DW.$$('.zh-pick',root).forEach(e=>e.classList.remove('zh-pick'));}
function placeSel(spotId){const s=sel;if(!s)return;const S=spotsOf(cur);clearSel();if(S[spotId]===s.key){DW.sfx('tap');return;}place(s.key,spotId,!!s.from);}

/* ---------- Hinstellen, Tauschen, Zurücklegen ---------- */
function place(key,spotId,moved){
  const S=spotsOf(cur),pm=placedMap(),prev=pm.get(key),there=S[spotId];
  if(prev)delete spotsOf(prev.room)[prev.spot];
  if(there&&there!==key&&prev&&prev.room===cur)S[prev.spot]=there;       /* im selben Zimmer: Plätze tauschen; sonst wandert das alte Stück in die Truhe */
  S[spotId]=key; DW.save(); placed++;
  DW.sfx('pop'); renderSpots(); renderTray();
  const sp=room.querySelector(`.zh-spot[data-s="${spotId}"]`); flash(sp); GK.after(650,()=>sp&&sp.classList.remove('gk-good'));
  const R=ROOMS[cur],it=byKey(key),hit=it&&R.match&&R.match(it);
  if(!moved)DW.emit('homeplace',key);
  if(hit&&R.yay){DW.sfx('magic');DW.say(DW.pick(R.yay));}
  else if(!moved&&(placed===1||Math.random()<.35))DW.say(DW.pick(['Schön!','Das passt gut!','Toll sieht das aus!','Super! Das sieht toll aus.']));
  GK.idle.set(()=>{const t=root.querySelector('.zh-ti:not(.placed)');t&&GK.pulse(t);},null);
}
function toChest(key){clearSel();const pm=placedMap().get(key);if(!pm)return;delete spotsOf(pm.room)[pm.spot];DW.save();DW.sfx('whoosh');renderSpots();renderTray();flash($(".zh-chest"));}

/* ---------- Truhen-Leiste ---------- */
function renderCats(){const box=$('.zh-cats');
  /* schmale Geräte: höchstens so viele Knöpfe, dass jeder ≥ 56 px breit bleibt – leere Kategorien weichen zuerst (nie die gewählte) */
  const cnt={};CAT.forEach(i=>cnt[i.cat]=(cnt[i.cat]||0)+1);let list=CATS;
  if(CATS.length>(GEO.maxCats||99)){const keep=new Set(CATS.filter(c=>cnt[c.id]||c.id===cat).map(c=>c.id));CATS.forEach(c=>{if(keep.size<GEO.maxCats)keep.add(c.id);});list=CATS.filter(c=>keep.has(c.id));}
  box.innerHTML=list.map(c=>{const n=cnt[c.id]||0;return `<button class="zh-cat${c.id===cat?' on':''}${n?'':' empty'}" data-c="${c.id}" type="button" aria-label="${c.n}">${ART.icon(c.icon)}${n?`<b>${n}</b>`:''}</button>`;}).join('');
  DW.$$('.zh-cat',box).forEach(b=>b.onclick=()=>{cat=b.dataset.c;page=0;DW.sfx('tap');renderCats();renderTray();const c=CATS.find(x=>x.id===cat);
    DW.say(CAT.some(i=>i.cat===cat)?c.n+'.':c.hint);});}
function renderTray(){const row=$('.zh-row'),items=CAT.filter(i=>i.cat===cat),c=CATS.find(x=>x.id===cat),pv=$('.zh-pg.prev'),nx=$('.zh-pg.next');
  const pm=placedMap();
  if(!items.length){row.className='zh-row zh-empty';row.innerHTML=`<div class="zh-hint">${ART.icon(c.icon)}<span>${c.hint||''}</span>${c.go?`<button class="btn go zh-go" type="button" aria-label="Hinbringen">${ART.icon('fussabdruck',32)}</button>`:''}</div>`;
    const g=row.querySelector('.zh-go');if(g)g.onclick=()=>{DW.sfx('whoosh');DW.closeStation();setTimeout(()=>window.WORLD&&WORLD.goTo(c.go),300);};
    pv.classList.add('off');nx.classList.add('off');return;}
  const pages=Math.ceil(items.length/per); page=DW.clamp(page,0,pages-1);
  pv.classList.toggle('off',page<=0); nx.classList.toggle('off',page>=pages-1);
  row.className='zh-row';
  row.innerHTML=items.slice(page*per,page*per+per).map(i=>{const p=pm.get(i.key);
    return `<div class="zh-ti${p?' placed':''}${i.frame?' fr':''}${sel&&sel.key===i.key?' zh-pick':''}" data-k="${i.key}">${i.html()}${p&&p.room!==cur?`<b class="zh-where">${roomIcon(p.room)}</b>`:''}</div>`;}).join('');
  DW.$$('.zh-ti',row).forEach(el=>{const it=byKey(el.dataset.k);
    DW.drag(el,{ghost:()=>`<div class="zh-ghost">${it.html()}</div>`,onStart:()=>startDrag(it.key,null),onMove:(x,y)=>hover(x,y),onCancel:()=>endDrag(),
      onTap:()=>{if(sel&&sel.from&&(sel.room||sel.key!==it.key)){toChest(sel.key);return;}   /* im Zimmer gewähltes Stück: Tipp in die Truhe legt es zurück */
        DW.sfx('tap');if(sel&&sel.key===it.key){clearSel();return;}GK.pulse(el);const p=placedMap().get(it.key);
        DW.say(it.n+'.'+(p&&p.room!==cur?' Das steht gerade hier: '+ROOMS[p.room].n+'.':''));setSel({key:it.key,from:p&&p.room===cur?p.spot:null});},
      onDrop:(x,y)=>{const g=dragG;endDrag();if(!g)return false;const t=target(g,x,y);if(!t)return false;
        if(spotsOf(cur)[t.id]===it.key)return false;place(it.key,t.id,false);return true;}});});}

/* ---------- Wischen im Zimmer (nur auf freier Wand/Boden, nie beim Ziehen von Sachen) ---------- */
function swipeSetup(){let s=null;
  room.addEventListener('pointerdown',e=>{s=null;if(e.target.closest('.zh-it,.zh-hot')||sel||dragG||document.documentElement.classList.contains('dw-dragging'))return;s={id:e.pointerId,x:e.clientX,y:e.clientY,t:Date.now()};});
  room.addEventListener('pointerup',e=>{const q=s;s=null;if(!q||q.id!==e.pointerId||dragG||document.documentElement.classList.contains('dw-dragging'))return;
    const dx=e.clientX-q.x,dy=e.clientY-q.y;if(Date.now()-q.t<700&&Math.abs(dx)>Math.max(70,GEO.rw*.18)&&Math.abs(dx)>2.2*Math.abs(dy))step(dx<0?1:-1);});
  room.addEventListener('pointercancel',()=>{s=null;});}

/* ---------- Zimmer-Symbole aus den Möbeln (64×64); ersetzbar über symbole/<name> ---------- */
function pieceIcon(t,o,pad){pad=pad==null?7:pad;const p=F[t](o||{},'L'),s=Math.min((64-2*pad)/p.w,(64-2*pad)/p.h);return `<g transform="translate(${f2(32-p.w*s/2)} ${f2(32-p.h*s/2)}) scale(${f2(s)})">${p.svg}</g>`;}
const icOf=(n,alt)=>ART.ICONS[n]||alt;
Object.assign(ART.ICONS,{zh_stern:pieceIcon('teleskop',{},8),zh_meer:icOf('muschel',pieceIcon('muschel')),zh_vulkan:icOf('vulkan',pieceIcon('vulkanmodell')),zh_fossil:icOf('ammonit',pieceIcon('ammonit')),zh_eis:icOf('schneeflocke',pieceIcon('iglu')),zh_dschungel:icOf('palme',pieceIcon('staude')),
  zh_sofa:pieceIcon('sofa'),zh_tisch:pieceIcon('schreibtisch',{},9),zh_tuer:pieceIcon('tuer',{},5),zh_bett:pieceIcon('bett'),zh_wanne:pieceIcon('wanne',{},8),zh_topf:pieceIcon('herd',{},8),zh_fass:pieceIcon('fass',{},9),
  zh_dach:`<path d="M6 34L32 10l26 24v4H6z" fill="#c8654a" stroke="#3d3226" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 38h40v16H12z" fill="#d9b98c" stroke="#3d3226" stroke-width="1.8" stroke-linejoin="round"/><circle cx="32" cy="28" r="7" fill="#b6d8e4" stroke="#3d3226" stroke-width="1.6"/><path d="M32 21v14M25 28h14" stroke="#3d3226" stroke-width="1.4"/><path d="M16 44h32M16 49h32" stroke="#b08a5e" stroke-width="1.4"/>`});

if(window.DW_DEBUG) window.__zuhause={
  place:(key,spot,r)=>{CAT=catalog();if(view!=='room'||(r&&r!==cur))enterRoom(r||'arbeit');place(key,spot,false);return spotsOf(cur);},
  items:()=>CAT.map(i=>i.key), cat:c=>{cat=c;page=0;renderCats();renderTray();}, layout:()=>lay, mode:()=>mode, view:()=>view, room:()=>cur,
  go:id=>{id?enterRoom(id):showOv();return view;}, rooms:()=>ORDER.slice(), refresh:()=>{CAT=catalog();if(view==='room'){renderSpots();renderCats();renderTray();}else layoutOv();return CAT.length;},
  spots:(id,l)=>build(id||cur,l||lay).spots, hots:(id,l)=>build(id||cur,l||lay).hots.map(h=>({id:h.id,t:h.t,x0:h.x0,y0:h.y0,x1:h.x1,y1:h.y1})),
  _svg:()=>B&&B.svg, _grain:grain, _build:build, _ov:ovSVG,
  state:()=>JSON.parse(JSON.stringify(HS())), sel:()=>sel&&sel.key, per:()=>per,
  /* Prüft: gleiche Platz-IDs in L und P, keine Überlappungen, Plätze im Bild */
  check:()=>{const out=[];ORDER.forEach(id=>{const sets={};['L','P'].forEach(l=>{const b=build(id,l);sets[l]=b.spots.map(s=>s.id).sort().join(',');
      const ids=new Set();b.spots.forEach(s=>{if(ids.has(s.id))out.push(id+' '+l+' doppelt '+s.id);ids.add(s.id);if(s.x0<0||s.y0<0||s.x1>100||s.y1>100)out.push(id+' '+l+' ausserhalb '+s.id+' '+[s.x0,s.y0,s.x1,s.y1]);});
      b.spots.forEach((a,i)=>b.spots.forEach((c,j)=>{if(j<=i)return;const ox=Math.min(a.x1,c.x1)-Math.max(a.x0,c.x0),oy=Math.min(a.y1,c.y1)-Math.max(a.y0,c.y0);if(ox>1.2&&oy>1.5)out.push(id+' '+l+' ueberlappt '+a.id+'/'+c.id+' '+ox.toFixed(1)+'x'+oy.toFixed(1));}));
      b.hots.forEach(h=>{if(HOT[h.t]&&HOT[h.t].live)return;b.spots.forEach(s=>{const ox=Math.min(h.x1,s.x1)-Math.max(h.x0,s.x0),oy=Math.min(h.y1,s.y1)-Math.max(h.y0,s.y0);if(ox>2&&oy>2&&ox*oy>.5*(h.x1-h.x0)*(h.y1-h.y0))out.push(id+' '+l+' hot '+h.id+' unter '+s.id);});});});
    if(sets.L!==sets.P)out.push(id+' IDs verschieden: L='+sets.L+' P='+sets.P);});return out;},
  table:()=>ORDER.map(id=>{const L=build(id,'L').spots,P=build(id,'P').spots;return id+' ('+ROOMS[id].n+', '+L.length+' Plätze)\n'+L.map(s=>{const p=P.find(x=>x.id===s.id)||{};const f=v=>v==null?'?':String(Math.round(v*10)/10);
      return '   '+(s.id+'      ').slice(0,6)+(s.k+'      ').slice(0,6)+' quer '+[s.x0,s.y0,s.x1,s.y1].map(f).join(' ')+'   hoch '+[p.x0,p.y0,p.x1,p.y1].map(f).join(' ');}).join('\n');}).join('\n'),
};
DW.stations[ID]={title:'Mein Forscherhaus',mount,unmount(){root=null;room=null;sel=null;dragG=null;B=null;freeCanvases();}};
})();
