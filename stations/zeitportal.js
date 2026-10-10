/* =====================================================================
   DINO-INSELWELT · Station Zeitportal
   Aquarell-Globus mit Plattentektonik (1 Mrd. Jahre bis heute) +
   Spiel „Wer lebte wann?“ (Pangäa-Tisch & Urzeit-Atlas)
   ===================================================================== */
(function(){
"use strict";
/* EPOCHS */
const EPOCHS = [
 {k:"tonium", name:"Tonium", a:1000, b:720, col:"#f4cf8a",
  text:"Alle Länder kuscheln sich zu einem Riesen-Kontinent zusammen: Rodinia. Im Meer leben nur winzige Lebewesen. Manche bauen Hügel aus Schleim und Kalk – die Stromatolithen."},
 {k:"cryo", name:"Cryogenium", a:720, b:635, col:"#f6d78e",
  text:"Brrr! Die Erde friert fast ganz zu – wie ein riesiger Schneeball. Rodinia bricht auseinander. Unter dem Eis überleben winzige Lebewesen."},
 {k:"edi", name:"Ediacarium", a:635, b:539, col:"#f7e19c",
  text:"Das Eis schmilzt. Im Meer leben die ersten Tiere, die man sehen kann. Sie sind weich und flach – wie Blätter oder Pfannkuchen."},
 {k:"kamb", name:"Kambrium", a:539, b:485, col:"#a9c08d",
  text:"Plötzlich gibt es ganz viele neue Tiere! Trilobiten mit Panzer und Augen krabbeln über den Meeresboden. An Land ist noch alles kahl."},
 {k:"ord", name:"Ordovizium", a:485, b:444, col:"#79b99f",
  text:"Tintenfische mit langen, spitzen Häusern schwimmen im Meer. Die ersten winzigen Pflanzen wachsen an Land – so ähnlich wie Moos. Im Süden liegt der große Kontinent Gondwana."},
 {k:"sil", name:"Silur", a:444, b:419, col:"#c5e3c3",
  text:"Seeskorpione jagen im Wasser – manche fast so groß wie ein Mensch! An Land wachsen die ersten Pflanzen mit Stängeln."},
 {k:"dev", name:"Devon", a:419, b:359, col:"#dcae78",
  text:"Das Zeitalter der Fische! Manche tragen einen Panzer am Kopf. Einige Fische krabbeln mit kräftigen Flossen ans Ufer. Die ersten Wälder wachsen."},
 {k:"karb", name:"Karbon", a:359, b:299, col:"#95c0b5",
  text:"Riesige Wälder aus Farnen. Libellen so groß wie eine Taube fliegen umher. Aus diesen Wäldern wird später Kohle. Die Kontinente stoßen zusammen."},
 {k:"perm", name:"Perm", a:299, b:252, col:"#ee9a82",
  text:"Alle Kontinente bilden jetzt ein einziges Riesenland: Pangäa! Tiere mit einem Segel auf dem Rücken wärmen sich in der Sonne."},
 {k:"trias", name:"Trias", a:252, b:201, col:"#b58cbd",
  text:"Die ersten Dinosaurier flitzen über Pangäa – sie sind noch klein und schnell. Oft ist es heiß und trocken. Auch die ersten Säugetiere gibt es, winzig wie Mäuse."},
 {k:"jura", name:"Jura", a:201, b:145, col:"#8ccbd8",
  text:"Pangäa bricht auseinander, und dazwischen wächst ein neues Meer: der Atlantik. Riesige Langhals-Dinosaurier fressen Blätter von hohen Bäumen. Die ersten Vögel flattern."},
 {k:"kreide", name:"Kreide", a:145, b:66, col:"#b4d98f",
  text:"Die Kontinente wandern weiter auseinander. Die ersten Blumen blühen! Große Raubsaurier jagen. Am Ende schlägt ein riesiger Stein aus dem All ein, und die großen Dinos sterben aus."},
 {k:"palaeo", name:"Paläogen", a:66, b:23, col:"#f8bf8f",
  text:"Die Dinos sind weg – jetzt werden die Säugetiere groß. Die ersten Pferde sind nur so groß wie ein Hund. Indien schwimmt nach Norden und stößt an Asien."},
 {k:"neo", name:"Neogen", a:23, b:2.6, col:"#fbe78a",
  text:"Wo Indien gegen Asien drückt, wächst das höchste Gebirge der Welt: der Himalaya. Weite Graslandschaften entstehen. Die Vorfahren der Menschen gehen auf zwei Beinen."},
 {k:"quart", name:"Quartär", a:2.6, b:0, col:"#f6f2a4",
  text:"Die Eiszeit! Mammuts mit dickem Fell stapfen durch den Schnee. Menschen malen Bilder in Höhlen. Auch heute wandern die Kontinente noch – ungefähr so schnell, wie deine Fingernägel wachsen."}
];

/* ILL */
const S = 'stroke="#5a4630" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"';
const seaBg = '<path d="M8 70 Q10 18 70 14 Q140 8 185 30 Q198 70 186 110 Q140 136 70 132 Q14 126 8 70Z" fill="#bcdbe3"/><path d="M20 96 Q60 84 100 98 T190 92 L186 116 Q140 136 70 132 Q24 126 20 96Z" fill="#a8cbd6" opacity=".7"/>';
const landBg = '<path d="M8 72 Q12 20 72 14 Q140 8 186 32 Q198 72 186 110 Q140 136 72 132 Q14 126 8 72Z" fill="#e9e2c4"/><path d="M12 100 Q60 88 110 100 T192 96 L186 112 Q140 136 72 132 Q20 126 12 100Z" fill="#cfd9a6" opacity=".8"/>';
const ILL = {
tonium: seaBg+`
 <path d="M22 124 Q22 86 50 86 Q78 86 78 124Z" fill="#b8a57a" ${S}/>
 <path d="M70 124 Q70 72 104 72 Q138 72 138 124Z" fill="#9aa56e" ${S}/>
 <path d="M130 124 Q132 94 152 94 Q172 94 174 124Z" fill="#c2ae80" ${S}/>
 <path d="M32 112 Q50 98 68 112 M28 120 Q50 104 72 120 M80 110 Q104 88 128 110 M78 120 Q104 96 132 120 M140 116 Q152 106 166 116" fill="none" stroke="#6d5b3c" stroke-width="1.3" opacity=".7"/>
 <circle cx="44" cy="44" r="9" fill="#a9d3b0" ${S}/><circle cx="44" cy="44" r="3" fill="#5f9270"/>
 <circle cx="70" cy="30" r="6" fill="#c3e0a8" ${S}/><circle cx="71" cy="30" r="2" fill="#6c9a58"/>
 <ellipse cx="150" cy="44" rx="12" ry="7" fill="#b7d9c9" ${S}/><circle cx="148" cy="44" r="2.5" fill="#5f9270"/>
 <circle cx="120" cy="30" r="4" fill="#d8e7a8" ${S}/><circle cx="170" cy="66" r="5" fill="#a9d3b0" ${S}/>`,
cryo: `<path d="M8 70 Q10 18 70 14 Q140 8 185 30 Q198 70 186 110 Q140 136 70 132 Q14 126 8 70Z" fill="#dcebf1"/>
 <circle cx="100" cy="72" r="50" fill="#f4f8fa" ${S}/>
 <path d="M68 60 Q80 52 92 62 Q100 70 88 76 Q74 78 68 60Z M112 88 Q126 80 134 92 Q128 104 116 100Z M104 40 Q116 36 120 46 Q110 52 104 40Z" fill="#b9d6e4"/>
 <path d="M60 90 Q74 84 84 96 M120 60 Q130 66 142 62" fill="none" stroke="#8cb4c8" stroke-width="1.5"/>
 <g fill="none" stroke="#6f9ab3" stroke-width="2.2" stroke-linecap="round">
  <path d="M26 30v20M16 40h20M19 33l14 14M33 33L19 47"/>
  <path d="M170 22v16M162 30h16M164 24l12 12M176 24l-12 12"/>
  <path d="M172 100v14M165 107h14M167 102l10 10M177 102l-10 10"/>
  <path d="M30 104v12M24 110h12"/>
 </g>`,
edi: seaBg+`
 <ellipse cx="80" cy="84" rx="44" ry="28" fill="#e5b98f" ${S}/>
 <path d="M38 84H122" stroke="#8a6547" stroke-width="2" fill="none"/>
 <path d="M48 64Q52 84 48 104M58 59Q63 84 58 109M68 57Q72 84 68 111M78 56Q82 84 78 112M88 56Q92 84 88 112M98 58Q102 84 98 110M108 62Q112 84 108 106M116 68Q119 84 116 100" fill="none" stroke="#9a714d" stroke-width="1.4"/>
 <path d="M158 124 L158 110" ${S} fill="none"/>
 <path d="M158 112 Q140 80 150 34 Q158 22 166 34 Q176 80 158 112Z" fill="#d9a3a0" ${S}/>
 <path d="M158 104V36 M158 96l-9-8M158 86l-11-9M158 76l-11-9M158 66l-10-9M158 56l-8-8M158 96l9-8M158 86l11-9M158 76l11-9M158 66l10-9M158 56l8-8" fill="none" stroke="#9b5f5b" stroke-width="1.3"/>
 <ellipse cx="158" cy="124" rx="10" ry="4" fill="#b58c77"/>`,
kamb: seaBg+`
 <g transform="translate(100 74)">
  <path d="M-38-30 Q0-56 38-30 Q44-22 36-16 L-36-16 Q-44-22-38-30Z" fill="#c99a6b" ${S}/>
  <path d="M-36-16 Q-40 14-26 34 Q0 44 26 34 Q40 14 36-16Z" fill="#b68457" ${S}/>
  <path d="M-38-12H38M-38-3H38M-37 6H37M-34 15H34M-30 24H30" fill="none" stroke="#6e4a2e" stroke-width="1.4"/>
  <path d="M-11-40 Q-14 0-9 38M11-40 Q14 0 9 38" fill="none" stroke="#6e4a2e" stroke-width="1.6"/>
  <path d="M-11-40 Q0-46 11-40 L9-18 L-9-18Z" fill="#d6ab7c" stroke="#6e4a2e" stroke-width="1.2"/>
  <ellipse cx="-20" cy="-28" rx="5" ry="3.5" fill="#4a3b2a"/><ellipse cx="20" cy="-28" rx="5" ry="3.5" fill="#4a3b2a"/>
  <path d="M-38-24 Q-52-6-48 20M38-24 Q52-6 48 20" fill="none" ${S}/>
 </g>
 <path d="M20 124 Q60 116 100 124 T184 120" fill="none" stroke="#9fb89a" stroke-width="3"/>`,
ord: seaBg+`
 <g transform="rotate(-16 100 70)">
  <path d="M36 70 L150 54 Q162 70 150 86 Z" fill="#d7b58f" ${S}/>
  <path d="M60 67l2 13M80 64l3 17M100 61l3 22M120 58l3 26M138 56l2 28" fill="none" stroke="#9b7550" stroke-width="1.6"/>
  <path d="M150 58 Q166 56 172 64 Q176 70 172 76 Q166 84 150 82" fill="#e0a88f" ${S}/>
  <circle cx="160" cy="66" r="3" fill="#3d3226"/>
  <path d="M170 70 Q184 60 194 64M171 73 Q188 72 196 78M170 76 Q182 86 190 94M168 74 Q176 90 172 100" fill="none" stroke="#b77a64" stroke-width="3" stroke-linecap="round"/>
 </g>
 <path d="M24 128 Q30 112 36 128 M34 128 Q42 108 48 128 M44 128 Q50 116 56 128" fill="#8fae6a" stroke="#5f7a45" stroke-width="1.4"/>`,
sil: seaBg+`
 <g transform="translate(96 74)">
  <path d="M-10-34 Q0-44 10-34 L14-14 L-14-14Z" fill="#b97e5f" ${S}/>
  <path d="M-14-14 Q-20 10-12 30 L-6 50 L6 50 L12 30 Q20 10 14-14Z" fill="#a86d52" ${S}/>
  <path d="M-16-6H16M-17 4H17M-16 14H16M-13 24H13M-9 34H9M-7 42H7" fill="none" stroke="#6e4432" stroke-width="1.3"/>
  <path d="M-6 50 L0 66 L6 50" fill="#8e5a42" ${S}/>
  <path d="M-14-10 Q-44-4-52 16 Q-40 12-16 0Z M14-10 Q44-4 52 16 Q40 12 16 0Z" fill="#c99478" ${S}/>
  <path d="M-8-38 Q-20-54-34-52 Q-30-46-22-46 M8-38 Q20-54 34-52 Q30-46 22-46" fill="none" ${S}/>
  <path d="M-12-22 L-32-26 L-40-18M12-22 L32-26 L40-18M-13-16 L-34-14M13-16 L34-14" fill="none" stroke="#6e4432" stroke-width="2"/>
  <circle cx="-5" cy="-30" r="2.4" fill="#2d241a"/><circle cx="5" cy="-30" r="2.4" fill="#2d241a"/>
 </g>`,
dev: seaBg+`
 <path d="M30 76 Q60 40 116 50 Q150 56 176 72 Q150 92 112 98 Q60 104 30 76Z" fill="#9fb3b8" ${S}/>
 <path d="M30 76 Q40 50 76 46 Q84 70 78 98 Q46 98 30 76Z" fill="#7d8f94" ${S}/>
 <path d="M30 78 Q48 84 70 80" fill="none" stroke="#3d3226" stroke-width="2"/>
 <path d="M34 80 L38 86 L42 80 L46 86 L50 80" fill="#f2ead8" stroke="#3d3226" stroke-width="1"/>
 <circle cx="52" cy="62" r="5" fill="#f2ead8" ${S}/><circle cx="53" cy="62" r="2.3" fill="#2d241a"/>
 <path d="M176 72 L196 52 L190 72 L196 94Z" fill="#8ea2a8" ${S}/>
 <path d="M112 50 Q124 30 140 34 Q132 46 130 56Z M110 96 Q116 112 128 116 Q126 104 122 96Z" fill="#8ea2a8" ${S}/>
 <path d="M60 50 L64 60 M68 48 L70 60" stroke="#5a6a6e" stroke-width="1.4"/>`,
karb: landBg+`
 <path d="M40 132 Q44 90 36 50" fill="none" stroke="#6c7a45" stroke-width="3"/>
 <path d="M38 56 Q18 52 10 66 Q24 62 38 66Z M38 70 Q14 70 8 86 Q24 78 38 80Z M38 84 Q18 88 14 104 Q28 94 39 96Z M37 56 Q56 46 66 58 Q52 58 38 64Z M38 70 Q60 64 70 78 Q54 74 38 78Z M39 86 Q60 84 66 98 Q52 92 39 94Z" fill="#7fa66a" ${S}/>
 <path d="M36 50 Q30 34 40 26 Q48 36 38 50Z" fill="#94b878" ${S}/>
 <g transform="translate(126 56)">
  <path d="M-6 0 Q0-3 6 0 L4 52 Q0 56-4 52Z" fill="#4f8c8c" ${S}/>
  <path d="M-4 4 Q-40-22-60-14 Q-44 0-4 8Z M4 4 Q40-22 60-14 Q44 0 4 8Z" fill="#cfe4e8" opacity=".85" ${S}/>
  <path d="M-4 12 Q-38 6-56 20 Q-36 24-4 16Z M4 12 Q38 6 56 20 Q36 24 4 16Z" fill="#cfe4e8" opacity=".85" ${S}/>
  <circle cx="-4" cy="-3" r="4" fill="#3f6f70"/><circle cx="4" cy="-3" r="4" fill="#3f6f70"/>
 </g>`,
perm: landBg+`
 <path d="M20 104 Q36 92 60 94 L120 90 Q150 88 168 96 Q186 96 190 102 Q180 110 160 108 L120 108 Q80 112 60 110 Q34 114 20 104Z" fill="#c98a6a" ${S}/>
 <path d="M68 94 Q72 50 96 38 Q118 42 128 90Z" fill="#e8b087" ${S}/>
 <path d="M76 92L84 54M86 92L94 42M96 92L102 40M106 91L110 48M116 90L120 62" fill="none" stroke="#8e5a3e" stroke-width="1.6"/>
 <path d="M166 97 Q176 92 186 98" fill="none" stroke="#3d3226" stroke-width="1.4"/>
 <circle cx="176" cy="97" r="1.8" fill="#2d241a"/>
 <path d="M74 108 L66 124 L74 124M92 110 L90 126 L98 126M132 108 L128 124 L136 124M150 108 L152 124 L160 124" fill="none" ${S} stroke-width="3"/>
 <path d="M20 104 Q6 106 4 116" fill="none" ${S} stroke-width="3"/>`,
trias: landBg+`
 <path d="M30 60 Q50 58 70 72 Q92 66 108 72 Q120 58 126 44 Q134 34 146 36 Q156 40 152 46 L138 48 Q134 62 124 78 Q118 92 104 96 L100 124 L108 126 L92 126 L94 98 L84 98 L80 124 L88 126 L72 126 L76 96 Q66 90 62 80 Q46 70 30 60Z" fill="#9fb27a" ${S}/>
 <path d="M72 76 Q90 72 104 78" fill="none" stroke="#6d7d4c" stroke-width="1.4"/>
 <circle cx="142" cy="40" r="2" fill="#2d241a"/>
 <path d="M120 80 L128 90 L124 92M114 84 L120 94" fill="none" ${S}/>
 <path d="M160 128 Q162 104 176 94 Q170 112 172 128Z M150 128 Q146 110 136 104 Q142 118 144 128Z" fill="#6f9a5a" ${S}/>`,
jura: landBg+`
 <path d="M20 96 Q40 86 60 88 Q70 70 96 68 Q124 68 132 84 Q140 70 146 48 Q150 26 162 22 Q174 20 176 28 Q168 30 160 32 Q156 52 150 76 Q146 96 132 104 L130 126 L120 126 L118 106 L106 108 L106 126 L94 126 L94 108 L80 106 L78 126 L66 126 L68 102 Q40 104 20 96Z" fill="#8fa9b3" ${S}/>
 <circle cx="168" cy="26" r="1.9" fill="#2d241a"/>
 <path d="M76 78 Q96 72 118 80" fill="none" stroke="#5f7a84" stroke-width="1.4"/>
 <path d="M34 128 L36 60" stroke="#7a6247" stroke-width="4"/>
 <path d="M36 62 Q16 50 8 62 Q24 58 36 66Z M36 60 Q56 46 64 58 Q48 56 36 66Z M36 58 Q28 38 38 30 Q44 44 36 60Z M36 62 Q20 70 16 84 Q28 72 37 68Z" fill="#7fa66a" ${S}/>`,
kreide: landBg+`
 <path d="M18 70 Q40 60 64 64 Q80 58 92 62 L98 50 Q108 34 132 34 Q152 36 156 48 L150 54 L158 60 Q150 70 132 68 L118 72 Q116 86 104 94 L106 124 L114 126 L96 126 L94 98 L82 98 L84 124 L92 126 L74 126 L74 94 Q60 88 58 78 Q40 76 18 70Z" fill="#b39574" ${S}/>
 <circle cx="136" cy="44" r="2.4" fill="#2d241a"/>
 <path d="M130 56 L134 60 L138 56 L142 60 L146 56" fill="#fff6e6" stroke="#3d3226" stroke-width=".9"/>
 <path d="M112 76 L118 84 M108 78 L112 86" fill="none" ${S}/>
 <path d="M76 70 Q92 66 106 72" fill="none" stroke="#7d634a" stroke-width="1.4"/>
 <g transform="translate(168 104)">
  <path d="M0 22 V2" stroke="#5f7a45" stroke-width="2.5"/>
  <path d="M0 2 Q-14-4-12-16 Q-4-10 0 0Z M0 2 Q14-4 12-16 Q4-10 0 0Z M0 0 Q-6-14 0-22 Q6-14 0 0Z" fill="#f0c3cf" ${S}/>
  <path d="M0 14 Q-10 10-12 16 Q-6 18 0 16Z" fill="#8fae6a" ${S}/>
 </g>
 <g transform="translate(26 112) scale(.7)"><path d="M0 22 V2" stroke="#5f7a45" stroke-width="2.5"/><path d="M0 2 Q-14-4-12-16 Q-4-10 0 0Z M0 2 Q14-4 12-16 Q4-10 0 0Z M0 0 Q-6-14 0-22 Q6-14 0 0Z" fill="#f7e2a0" ${S}/></g>`,
palaeo: landBg+`
 <path d="M150 128 Q152 80 140 44" fill="none" stroke="#8a6d4a" stroke-width="5"/>
 <path d="M140 46 Q120 34 102 44 Q122 42 140 50Z M140 46 Q156 28 178 34 Q158 38 142 50Z M140 44 Q134 24 142 12 Q148 28 142 46Z M142 48 Q164 50 178 64 Q160 58 142 52Z M138 48 Q118 54 108 68 Q124 58 140 52Z" fill="#7fa66a" ${S}/>
 <path d="M40 84 Q48 70 72 72 L90 70 Q96 56 106 56 Q114 58 114 66 L106 72 Q100 88 90 92 L88 118 L82 118 L80 94 L60 94 L56 118 L50 118 L50 92 Q40 92 40 84Z" fill="#a8835f" ${S}/>
 <path d="M40 84 Q30 86 30 96" fill="none" ${S} stroke-width="2.5"/>
 <circle cx="104" cy="62" r="1.8" fill="#2d241a"/>
 <path d="M98 56 L100 48 L103 55" fill="#a8835f" ${S}/>
 <path d="M58 76 Q60 82 66 84M70 74 Q72 82 78 84" fill="none" stroke="#e6d0a8" stroke-width="2"/>`,
neo: `<path d="M8 72 Q12 20 72 14 Q140 8 186 32 Q198 72 186 110 Q140 136 72 132 Q14 126 8 72Z" fill="#e3ecf0"/>
 <path d="M14 102 L58 40 L80 70 L108 22 L150 84 L168 60 L192 100 Q150 110 100 106 Q50 110 14 102Z" fill="#9aa7b5" ${S}/>
 <path d="M58 40 L50 52 L58 50 L64 56 L70 54Z M108 22 L96 40 L106 36 L112 44 L118 36 L124 42Z M168 60 L162 70 L170 68 L176 72Z" fill="#fbfdfe" ${S}/>
 <path d="M10 104 Q60 94 110 104 T194 100 L186 112 Q140 136 72 132 Q18 126 10 104Z" fill="#d6c982" ${S}/>
 <path d="M30 120 L34 104 L38 120 M46 126 L52 106 L56 126 M120 124 L124 106 L128 124 M150 120 L156 104 L158 120 M86 126 L90 110 L94 126" fill="none" stroke="#9c8b44" stroke-width="1.8"/>
 <path d="M40 30 q6-6 12 0 q6-6 12 0" fill="none" stroke="#5a4630" stroke-width="1.8"/>`,
quart: `<path d="M8 72 Q12 20 72 14 Q140 8 186 32 Q198 72 186 110 Q140 136 72 132 Q14 126 8 72Z" fill="#e6eef2"/>
 <path d="M10 106 Q60 96 110 106 T194 102 L186 114 Q140 136 72 132 Q18 126 10 106Z" fill="#fbfdfe" ${S}/>
 <path d="M40 84 Q36 50 66 40 Q84 34 100 40 Q120 30 136 44 Q150 58 146 80 Q144 92 136 96 L136 120 L124 120 L122 98 L108 98 L108 122 L96 122 L94 96 L74 96 L72 120 L60 120 L58 94 L52 120 L42 120 Z" fill="#9a6d4c" ${S}/>
 <path d="M136 44 Q150 50 150 66 Q150 84 156 96 Q160 106 152 110" fill="none" stroke="#7b5236" stroke-width="7" stroke-linecap="round"/>
 <path d="M140 70 Q160 70 170 56 Q172 50 166 50" fill="none" stroke="#f5ecd8" stroke-width="4" stroke-linecap="round"/>
 <circle cx="130" cy="54" r="2" fill="#2d241a"/>
 <path d="M60 56 Q64 70 58 84 M76 50 Q80 66 76 84 M92 48 Q96 64 92 82 M110 46 Q114 62 110 80" fill="none" stroke="#6e4a30" stroke-width="1.4"/>
 <g fill="#ffffff" opacity=".9"><circle cx="30" cy="36" r="2.5"/><circle cx="52" cy="22" r="2"/><circle cx="160" cy="28" r="2.5"/><circle cx="178" cy="54" r="2"/><circle cx="20" cy="70" r="2"/><circle cx="104" cy="20" r="2"/></g>`
};
function illSVG(k){return `<svg viewBox="0 0 200 140" role="img" aria-hidden="true"><g filter="url(#wc)">${ILL[k]}</g></svg>`;}
/* ENGINE */
function createGlobe(cv){
  const DATA=window.PLATES;
  const ctx=cv.getContext('2d');
const QN = DATA.n, QSTEP = DATA.step;
const QUATS = DATA.quats.map(a => Float32Array.from(a, v => v / 1e4));
const D2R = Math.PI / 180;
function llToXYZ(lat, lon){const a=lat*D2R,o=lon*D2R,c=Math.cos(a);return [c*Math.cos(o),c*Math.sin(o),Math.sin(a)];}
function hash(i){let x=Math.sin(i*127.1+11.7)*43758.5453;return x-Math.floor(x);}
const decode = (p, idx) => {
  const [qi, begin, flat] = p, n = flat.length / 2, xyz = new Float32Array(n * 3);
  let la = 0, lo = 0, mx = 0, my = 0, mz = 0;
  for (let i = 0; i < n; i++) {
    la += flat[2*i]; lo += flat[2*i+1];
    const v = llToXYZ(la / 20, lo / 20);
    xyz[3*i] = v[0]; xyz[3*i+1] = v[1]; xyz[3*i+2] = v[2]; mx += v[0]; my += v[1]; mz += v[2];
  }
  const m = Math.hypot(mx, my, mz) || 1;
  return {qi, begin, n, xyz, c: [mx/m, my/m, mz/m], jit: hash(idx) - .5};
};
const POLYS = DATA.polys.map(decode), SHELF = DATA.shelf.map(decode);

/* ------------------------------------------------------------------ Mathe */
function plateQuat(qi, t){
  const q = QUATS[qi], f = Math.min(t, 1000) / QSTEP, i = Math.min(Math.floor(f), QN - 2), u = f - i;
  const a = i*4, b = a + 4;
  let w = q[a]*(1-u)+q[b]*u, x = q[a+1]*(1-u)+q[b+1]*u, y = q[a+2]*(1-u)+q[b+2]*u, z = q[a+3]*(1-u)+q[b+3]*u;
  const l = Math.hypot(w, x, y, z); return [w/l, x/l, y/l, z/l];
}
function qMat([w,x,y,z]){
  return [1-2*(y*y+z*z), 2*(x*y-w*z), 2*(x*z+w*y),
          2*(x*y+w*z), 1-2*(x*x+z*z), 2*(y*z-w*x),
          2*(x*z-w*y), 2*(y*z+w*x), 1-2*(x*x+y*y)];
}
function mMul(A,B){const C=new Array(9);for(let r=0;r<3;r++)for(let c=0;c<3;c++)C[r*3+c]=A[r*3]*B[c]+A[r*3+1]*B[3+c]+A[r*3+2]*B[6+c];return C;}
function mVec(M,v){return [M[0]*v[0]+M[1]*v[1]+M[2]*v[2], M[3]*v[0]+M[4]*v[1]+M[5]*v[2], M[6]*v[0]+M[7]*v[1]+M[8]*v[2]];}
function viewMatrix(lon0, pitch){
  const c=Math.cos(lon0*D2R), s=Math.sin(lon0*D2R), ca=Math.cos(pitch*D2R), sa=Math.sin(pitch*D2R);
  const f = v => { const x1=v[0]*c+v[1]*s, y1=-v[0]*s+v[1]*c, z1=v[2];
    const vx=y1, vy=z1, vz=x1; return [vx, vy*ca-vz*sa, vy*sa+vz*ca]; };
  const e1=f([1,0,0]), e2=f([0,1,0]), e3=f([0,0,1]);
  return [e1[0],e2[0],e3[0], e1[1],e2[1],e3[1], e1[2],e2[2],e3[2]];
}
const lerp=(a,b,u)=>a+(b-a)*u, clamp=(v,a,b)=>v<a?a:v>b?b:v, smooth=(a,b,x)=>{const u=clamp((x-a)/(b-a),0,1);return u*u*(3-2*u);};

/* ------------------------------------------------------------------ Klima-Farben */
function iceLat(t, lat){ // Breitengrad, ab dem Eis liegt (oder 99)
  if (t < 2.6) return lerp(68, 60, smooth(0.005, 0.03, t));
  if (t < 34) return lat < 0 ? 64 : 99;
  if (t > 280 && t < 340) return lat < 0 ? 55 : 99;
  if (t > 440 && t < 450) return lat < 0 ? 62 : 99;
  return 99;
}
function snowball(t){ return Math.max(smooth(722,712,t)*smooth(655,665,t), smooth(652,645,t)*smooth(630,638,t)); }
const C_TROP=[112,160,92], C_ARID=[216,180,110], C_TEMP=[146,172,98], C_COLD=[168,168,128], C_ICE=[240,244,246], C_BARE=[198,150,110], C_BARE2=[176,160,138];
function mix(a,b,u){return [lerp(a[0],b[0],u),lerp(a[1],b[1],u),lerp(a[2],b[2],u)];}
function landColor(lat, t, jit, sb){
  const L = Math.abs(lat);
  let c = C_TROP;
  c = mix(c, C_ARID, smooth(9,18,L));
  c = mix(c, C_TEMP, smooth(30,42,L));
  c = mix(c, C_COLD, smooth(56,68,L));
  const veg = smooth(470, 390, t); // vor den Landpflanzen: kahler Fels
  if (veg < 1) c = mix(mix(C_BARE, C_BARE2, smooth(10,40,L)), c, veg);
  const il = iceLat(t, lat); if (il < 90) c = mix(c, C_ICE, smooth(il-6, il+2, L));
  if (sb > 0) c = mix(c, C_ICE, sb*.92);
  const j = jit * 18;
  return `rgb(${c[0]+j|0},${c[1]+j*.6|0},${c[2]-j*.4|0})`;
}

/* ------------------------------------------------------------------ Rauschen & Texturen */
function makeNoise(seed){
  const P=new Uint8Array(512); const p=[...Array(256).keys()]; let s=seed;
  for(let i=255;i>0;i--){s=(s*16807)%2147483647;const j=s%(i+1);[p[i],p[j]]=[p[j],p[i]];}
  for(let i=0;i<512;i++)P[i]=p[i&255];
  const g=i=>P[i]/255;
  return (x,y)=>{const X=Math.floor(x),Y=Math.floor(y),fx=x-X,fy=y-Y,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
    const a=g(P[X&255]+(Y&255)),b=g(P[(X+1)&255]+(Y&255)),c=g(P[X&255]+((Y+1)&255)),d=g(P[(X+1)&255]+((Y+1)&255));
    return lerp(lerp(a,b,u),lerp(c,d,u),v);};
}
const N1=makeNoise(12345), N2=makeNoise(987);
function fbm(n,x,y,o=4){let s=0,a=.5,f=1;for(let i=0;i<o;i++){s+=a*n(x*f,y*f);a*=.5;f*=2;}return s/(1-Math.pow(.5,o));}
let W=0, R=0, CX=0, CY=0, DPR=1;
let oceanImg, iceImg, shadeImg, grainImg;
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h||w;return c;};
let Mf, Fc, Cc, Lm, Ec, Hc, Sm, lowS=4;
const hasFilter = (()=>{const t=mk(2).getContext('2d'); try{t.filter='blur(1px)';return t.filter==='blur(1px)';}catch(e){return false;}})();

function buildTextures(){
  // Ozean
  oceanImg=mk(W); iceImg=mk(W); grainImg=mk(W);
  const o=oceanImg.getContext('2d'), oi=o.createImageData(W,W);
  const ic=iceImg.getContext('2d'), ii=ic.createImageData(W,W);
  const gr=grainImg.getContext('2d'), gi=gr.createImageData(W,W);
  const sc=6/W;
  for(let j=0;j<W;j++)for(let i=0;i<W;i++){
    const k=(j*W+i)*4, dx=i-CX, dy=j-CY, d=Math.hypot(dx,dy)/R;
    const n=fbm(N1,i*sc,j*sc,4), m=fbm(N2,i*sc*2.3+50,j*sc*2.3,3), r=Math.random();
    const bl=clamp((n-.35)*1.8,0,1);
    // Ozean: Waschungen zwischen tief und hell
    let cr=lerp(122,84,bl), cg=lerp(172,138,bl), cb=lerp(190,170,bl);
    const lum=(m-.5)*22+(r-.5)*9 - smooth(.55,1,d)*10;
    oi.data[k]=cr+lum; oi.data[k+1]=cg+lum; oi.data[k+2]=cb+lum*.8; oi.data[k+3]=255;
    // Eis
    const e=fbm(N2,i*sc*1.5,j*sc*1.5,4);
    ii.data[k]=lerp(212,250,e)+(r-.5)*6; ii.data[k+1]=lerp(229,252,e)+(r-.5)*6; ii.data[k+2]=lerp(240,255,e); ii.data[k+3]=lerp(200,250,e);
    // Körnung (Pigment)
    const g=fbm(N1,i*.18,j*.18,2);
    gi.data[k]=70; gi.data[k+1]=52; gi.data[k+2]=30; gi.data[k+3]=clamp((g-.45)*260+(r-.5)*40,0,90);
  }
  o.putImageData(oi,0,0); ic.putImageData(ii,0,0); gr.putImageData(gi,0,0);
  // Schattierung
  shadeImg=mk(W); const s=shadeImg.getContext('2d');
  let gg=s.createRadialGradient(CX-R*.38,CY-R*.42,R*.05,CX-R*.2,CY-R*.2,R*1.1);
  gg.addColorStop(0,'rgba(255,253,240,.38)'); gg.addColorStop(.45,'rgba(255,250,235,.06)'); gg.addColorStop(1,'rgba(255,250,235,0)');
  s.fillStyle=gg; s.fillRect(0,0,W,W);
  gg=s.createRadialGradient(CX,CY,R*.62,CX,CY,R);
  gg.addColorStop(0,'rgba(40,60,80,0)'); gg.addColorStop(.8,'rgba(40,62,84,.16)'); gg.addColorStop(1,'rgba(30,50,72,.42)');
  s.fillStyle=gg; s.beginPath(); s.arc(CX,CY,R,0,7); s.fill();
  // Pinselrand
  for(let p=0;p<3;p++){
    s.beginPath();
    for(let a=0;a<=361;a+=2){const rr=R*(1+ (N1(a*.05+p*9,3)-.5)*.012) - p*1.2*DPR; const x=CX+Math.cos(a*D2R)*rr, y=CY+Math.sin(a*D2R)*rr; a?s.lineTo(x,y):s.moveTo(x,y);}
    s.strokeStyle=`rgba(62,92,110,${.28-p*.07})`; s.lineWidth=(2.4-p*.5)*DPR; s.stroke();
  }
  // Arbeits-Canvases
  const lw=Math.ceil(W/lowS);
  Mf=mk(W); Fc=mk(W); Sm=mk(Math.ceil(W/2)); Cc=mk(Math.ceil(W/3)); Lm=mk(lw); Ec=mk(lw); Hc=mk(lw);
}

/* Zeichenfläche begrenzen: der Globus wird in mehreren weichen Ebenen gemalt (Aquarell), die Kosten wachsen mit der Pixelzahl.
   Auf einem Tablet mit dpr 2 waren es 1256×1256 Pixel = über 100 ms Rechenzeit je Bild (ruckelt beim Drehen).
   · höchstens MAXW Pixel Kantenlänge (das weiche Bild verträgt das ohne sichtbaren Verlust)
   · QUAL sinkt schrittweise, wenn das Zeichnen trotzdem zu lange dauert (siehe loop) – langsame Geräte bleiben flüssig.
   DPR ist ab hier das tatsächliche Verhältnis Canvas-Pixel : CSS-Pixel (Strichstärken, Schrift und Zieh-Empfindlichkeit rechnen damit). */
const MAXW=960; let QUAL=createGlobe._q||1;   // einmal ermittelte Qualität gilt auch beim nächsten Öffnen
function resize(){
  const css=cv.clientWidth; if(css<10) return;
  const nw=Math.max(240,Math.round(Math.min(css*Math.min(window.devicePixelRatio||1,2),MAXW)*QUAL));
  if(nw===W)return;
  W=nw; DPR=W/css; cv.width=cv.height=W; CX=CY=W/2; R=W/2*0.93;
  buildTextures(); dirty=true;
}

/* ------------------------------------------------------------------ Zustand */
let T=0, lon0=15, pitch=18, vLon=0, vPitch=0, dirty=true, dragging=false, lastInteract=-1e9, showBerlin=false;
let flyTo=null;

/* ------------------------------------------------------------------ Projektion eines Polygons */
function projectPoly(poly, M){
  const n=poly.n, v=poly.xyz, X=new Float32Array(n), Y=new Float32Array(n), Z=new Float32Array(n);
  let s=-1;
  for(let i=0;i<n;i++){const a=v[3*i],b=v[3*i+1],c=v[3*i+2];
    X[i]=M[0]*a+M[1]*b+M[2]*c; Y[i]=M[3]*a+M[4]*b+M[5]*c; Z[i]=M[6]*a+M[7]*b+M[8]*c; if(s<0&&Z[i]>=0)s=i;}
  if(s<0) return null;
  const path=new Path2D(); let wind=0, pa=null;
  const add=(x,y,first)=>{ const a=Math.atan2(y,x);
    if(pa!==null){let d=a-pa; if(d>Math.PI)d-=2*Math.PI; else if(d<-Math.PI)d+=2*Math.PI; wind+=d;}
    pa=a; const sx=CX+x*R, sy=CY-y*R; first?path.moveTo(sx,sy):path.lineTo(sx,sy); };
  const arc=(a0,a1)=>{ let d=a1-a0; if(d>Math.PI)d-=2*Math.PI; else if(d<-Math.PI)d+=2*Math.PI;
    const k=Math.ceil(Math.abs(d)/0.08); for(let j=1;j<=k;j++){const a=a0+d*j/k; add(Math.cos(a),Math.sin(a));} return a0+d; };
  add(X[s],Y[s],true);
  let back=false, lastA=0;
  for(let k=1;k<=n;k++){
    const i=(s+k-1)%n, j=(s+k)%n;
    if(!back){
      if(Z[j]>=0){ add(X[j],Y[j]); }
      else { // Rand kreuzen
        const zi=Math.abs(Z[i]), zj=Math.abs(Z[j]); let cx=zi*X[j]+zj*X[i], cy=zi*Y[j]+zj*Y[i]; const l=Math.hypot(cx,cy)||1; cx/=l; cy/=l;
        add(cx,cy); lastA=Math.atan2(cy,cx); lastA=arc(lastA,Math.atan2(Y[j],X[j])); back=true; }
    } else {
      if(Z[j]<0){ lastA=arc(lastA,Math.atan2(Y[j],X[j])); }
      else { const zi=Math.abs(Z[i]), zj=Math.abs(Z[j]); let cx=zi*X[j]+zj*X[i], cy=zi*Y[j]+zj*Y[i]; const l=Math.hypot(cx,cy)||1; cx/=l; cy/=l;
        arc(lastA,Math.atan2(cy,cx)); add(X[j],Y[j]); back=false; }
    }
  }
  path.closePath();
  const w=Math.round(wind/(2*Math.PI));
  if(w!==0){ const cz=M[6]*poly.c[0]+M[7]*poly.c[1]+M[8]*poly.c[2];
    if(cz<0){ // Polygon enthält den Gegenpunkt: Kreis gegenläufig ergänzen
      path.moveTo(CX+R,CY); path.arc(CX,CY,R,0,2*Math.PI, w<0); } }
  return path;
}

/* ------------------------------------------------------------------ Beschriftungen */
const LABELS=[
 {t:'Rodinia',a:1000,b:760,lat:40,lon:-95,p:'lau',big:1},
 {t:'Gondwana',a:560,b:335,lat:-15,lon:25,p:'afr',big:1},
 {t:'Pangäa',a:330,b:185,lat:5,lon:10,p:'afr',big:1},
 {t:'Laurasia',a:180,b:110,lat:55,lon:40,p:'eur',big:1},
 {t:'Gondwana',a:180,b:125,lat:-25,lon:25,p:'afr',big:1},
 {t:'Afrika',a:60,b:0,lat:6,lon:20,p:'afr'},
 {t:'Europa',a:30,b:0,lat:50,lon:12,p:'eur'},
 {t:'Asien',a:40,b:0,lat:52,lon:95,p:'eur'},
 {t:'Indien',a:90,b:0,lat:20,lon:78,p:'ind'},
 {t:'Nordamerika',a:40,b:0,lat:45,lon:-100,p:'lau'},
 {t:'Südamerika',a:40,b:0,lat:-12,lon:-58,p:'sam'},
 {t:'Australien',a:40,b:0,lat:-25,lon:134,p:'aus'},
 {t:'Antarktis',a:40,b:0,lat:-80,lon:40,p:'ant'}
].map(l=>({...l,v:llToXYZ(l.lat,l.lon)}));
const BERLIN=llToXYZ(52.52,13.40);

function drawLabel(x,y,z,txt,size,alpha){
  ctx.globalAlpha=alpha*smooth(0.05,0.35,z);
  ctx.font=`${size}px "Patrick Hand", cursive`; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.lineJoin='round'; ctx.lineWidth=size*.22; ctx.strokeStyle='rgba(255,250,238,.75)'; ctx.strokeText(txt,x,y);
  ctx.fillStyle='#3d3226'; ctx.fillText(txt,x,y); ctx.globalAlpha=1;
}

/* ------------------------------------------------------------------ Rendern */
function render(){
  if(!W)return;
  const V=viewMatrix(lon0,pitch), t=T, sb=snowball(t);
  const mats=new Map(), plateM=qi=>{let m=mats.get(qi); if(!m){const P=qMat(plateQuat(qi,t)); m={P,M:mMul(V,P)}; mats.set(qi,m);} return m;};
  ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,W,W);
  ctx.save(); ctx.beginPath(); ctx.arc(CX,CY,R,0,7); ctx.clip();
  ctx.drawImage(oceanImg,0,0);

  // Gradnetz (Bleistift)
  ctx.strokeStyle='rgba(50,75,95,.16)'; ctx.lineWidth=1*DPR;
  const gline=(pts)=>{ctx.beginPath(); let on=false; for(const p of pts){const q=mVec(V,p); if(q[2]>0){const x=CX+q[0]*R,y=CY-q[1]*R; on?ctx.lineTo(x,y):ctx.moveTo(x,y); on=true;} else on=false;} ctx.stroke();};
  for(let lon=-180;lon<180;lon+=30){const pts=[];for(let la=-90;la<=90;la+=4)pts.push(llToXYZ(la,lon));gline(pts);}
  for(let la=-60;la<=60;la+=30){const pts=[];for(let lo=-180;lo<=180;lo+=3)pts.push(llToXYZ(la,lo)); if(la===0){ctx.strokeStyle='rgba(50,75,95,.28)';ctx.lineWidth=1.6*DPR;} gline(pts); ctx.strokeStyle='rgba(50,75,95,.16)'; ctx.lineWidth=1*DPR;}

  // Polygone projizieren
  const vis=[];
  for(const p of POLYS){ if(t>p.begin) continue; const m=plateM(p.qi); const path=projectPoly(p,m.M); if(!path)continue;
    const c=mVec(m.P,p.c); vis.push({path,col:landColor(Math.asin(clamp(c[2],-1,1))/D2R,t,p.jit,sb)}); }

  // Maske (volle Auflösung)
  const mf=Mf.getContext('2d'); mf.setTransform(1,0,0,1,0,0); mf.clearRect(0,0,W,W); mf.fillStyle='#fff';
  mf.strokeStyle='#fff'; mf.lineWidth=1.4*DPR; mf.lineJoin='round'; for(const v of vis){ mf.fill(v.path); mf.stroke(v.path); }
  const lw=Lm.width, lm=Lm.getContext('2d'); lm.clearRect(0,0,lw,lw); lm.drawImage(Mf,0,0,lw,lw);

  // Kontinentalschelf / Flachmeer (Kontinentalkruste)
  const sw=Sm.width, sm=Sm.getContext('2d'); sm.globalCompositeOperation='source-over'; sm.setTransform(1,0,0,1,0,0); sm.clearRect(0,0,sw,sw);
  sm.setTransform(sw/W,0,0,sw/W,0,0); sm.fillStyle='#fff';
  for(const p of SHELF){ if(t>p.begin) continue; const path=projectPoly(p,plateM(p.qi).M); if(path) sm.fill(path); }
  for(const v of vis) sm.fill(v.path);
  sm.setTransform(1,0,0,1,0,0);
  const hc=Hc.getContext('2d'); hc.globalCompositeOperation='source-over'; hc.clearRect(0,0,lw,lw);
  if(hasFilter){hc.filter=`blur(${2.5*DPR}px)`; hc.drawImage(Sm,0,0,lw,lw); hc.drawImage(Sm,0,0,lw,lw); hc.filter='none';}
  else { for(let dx=-2;dx<=2;dx+=2)for(let dy=-2;dy<=2;dy+=2) hc.drawImage(Sm,dx,dy,lw,lw); }
  hc.globalCompositeOperation='source-in'; hc.fillStyle=sb>.3?'rgb(236,244,248)':'rgb(160,208,210)'; hc.fillRect(0,0,lw,lw);
  ctx.globalAlpha=.6; ctx.drawImage(Hc,0,0,W,W); ctx.globalAlpha=1;
  sm.globalCompositeOperation='source-in'; sm.fillStyle=sb>.3?'rgb(240,246,250)':'rgb(186,222,212)'; sm.fillRect(0,0,sw,sw);
  ctx.globalAlpha=.85; ctx.drawImage(Sm,0,0,W,W); ctx.globalAlpha=1;

  // Farbschicht (nass-in-nass, weich)
  const cw=Cc.width, cc=Cc.getContext('2d'); cc.setTransform(1,0,0,1,0,0); cc.clearRect(0,0,cw,cw);
  cc.setTransform(cw/W,0,0,cw/W,0,0); cc.lineWidth=10*DPR; cc.lineJoin='round';
  for(const v of vis){cc.fillStyle=v.col; cc.strokeStyle=v.col; cc.fill(v.path); cc.stroke(v.path);}
  const fc=Fc.getContext('2d'); fc.globalCompositeOperation='source-over'; fc.clearRect(0,0,W,W);
  if(hasFilter){fc.filter=`blur(${3*DPR}px)`;} fc.drawImage(Cc,0,0,W,W); fc.filter='none';
  fc.globalCompositeOperation='destination-in'; fc.drawImage(Mf,0,0);
  // Randverdunklung
  const ec=Ec.getContext('2d'); ec.globalCompositeOperation='source-over'; ec.clearRect(0,0,lw,lw);
  ec.fillStyle=sb>.3?'rgb(120,150,170)':'rgb(84,70,44)'; ec.fillRect(0,0,lw,lw); ec.globalCompositeOperation='destination-out';
  if(hasFilter)ec.filter=`blur(${1*DPR}px)`; ec.drawImage(Lm,0,0); ec.filter='none';
  fc.globalCompositeOperation='source-atop'; fc.globalAlpha=.6; fc.drawImage(Ec,0,0,W,W);
  fc.globalAlpha=.45; fc.drawImage(grainImg,0,0); fc.globalAlpha=1; fc.globalCompositeOperation='source-over';
  ctx.drawImage(Fc,0,0);

  // Schneeball-Erde
  if(sb>0){ctx.globalAlpha=sb*.8; ctx.drawImage(iceImg,0,0); ctx.globalAlpha=1;}

  ctx.drawImage(shadeImg,0,0);
  // Beschriftungen
  for(const L of LABELS){ const alpha=L.b===0?smooth(L.a,L.a-10,t):smooth(L.a+8,L.a-4,t)*smooth(L.b-8,L.b+2,t); if(alpha<=0.01)continue;
    const qi=DATA.anch[L.p]; const q=mVec(plateM(qi).M,L.v); if(q[2]<=0)continue;
    drawLabel(CX+q[0]*R, CY-q[1]*R, q[2], L.t, (L.big?30:21)*DPR*(W/(560*DPR))**.5, alpha*(L.big?.9:.8)); }



  ctx.restore();
  // Berlin
  if(showBerlin){ const q=mVec(plateM(DATA.berlin).M,BERLIN);
    if(q[2]>0){ const x=CX+q[0]*R, y=CY-q[1]*R, r=8*DPR, pulse=1+.15*Math.sin(performance.now()/300);
      ctx.globalAlpha=smooth(0,.25,q[2]);
      ctx.fillStyle='rgba(200,85,61,.25)'; ctx.beginPath(); ctx.arc(x,y,r*2.2*pulse,0,7); ctx.fill();
      ctx.fillStyle='#c8553d'; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill();
      ctx.fillStyle='#fff5e8'; ctx.beginPath(); ctx.arc(x,y,r*.4,0,7); ctx.fill();
      ctx.globalAlpha=1; drawLabel(x, y-r*3.2, q[2], 'Berlin', 24*DPR, 1); }
  }
}

  let showB=false; let T_=0;
  function berlinLat(){ const P=qMat(plateQuat(DATA.berlin,T)); const q=mVec(P,BERLIN); return {lat:Math.asin(q[2])/D2R, lon:Math.atan2(q[1],q[0])/D2R}; }
  let lastX=0,lastY=0,lastTime=0,alive=true;
  /* Nur EIN Finger dreht den Globus: ein zweiter Finger (Kinder wollen „zoomen“) wird ignoriert – sonst sprang die Kugel
     bei jedem Ereignis zwischen beiden Fingern hin und her und schleuderte nach dem Loslassen los. */
  let ptrId=null;
  const pd=ev=>{ if(ev.button>0||(dragging&&ptrId!==null&&ev.pointerId!==ptrId)) return;
    dragging=true; ptrId=ev.pointerId; try{ cv.setPointerCapture(ev.pointerId); }catch(e){} lastX=ev.clientX; lastY=ev.clientY; lastTime=performance.now(); vLon=vPitch=0; flyTo=null; api.onTouch&&api.onTouch();};
  const pm=ev=>{ if(!dragging||ev.pointerId!==ptrId)return; const k=180/Math.PI/(R/DPR);
    const dx=ev.clientX-lastX, dy=ev.clientY-lastY, now=performance.now(), dt=Math.max(8,now-lastTime);
    lon0-=dx*k; pitch=clamp(pitch+dy*k,-80,80); vLon=-dx*k/dt*16; vPitch=dy*k/dt*16;
    lastX=ev.clientX; lastY=ev.clientY; lastTime=now; lastInteract=now; dirty=true; };
  const pu=ev=>{ if(!dragging||(ev&&ev.pointerId!==ptrId)) return; dragging=false; ptrId=null; lastInteract=performance.now();};
  GK.noFling(cv);   // sonst geht der erste Tipp auf einen Knopf direkt nach einem Globus-Wisch verloren
  cv.addEventListener('pointerdown',pd); cv.addEventListener('pointermove',pm); cv.addEventListener('pointerup',pu); cv.addEventListener('pointercancel',pu); cv.addEventListener('lostpointercapture',pu);
  let prevNow=performance.now(), slowN=0, slowMs=0;
  function loop(now){
    if(!alive) return;
    const dt=Math.min(50,now-prevNow)/16.67; prevNow=now;
    if(flyTo){ let d=((flyTo.lon-lon0+540)%360)-180; lon0+=d*.08*dt; pitch+=(flyTo.pitch-pitch)*.08*dt; dirty=true;
      if(Math.abs(d)<.2&&Math.abs(flyTo.pitch-pitch)<.2) flyTo=null; }
    else if(!dragging){
      if(Math.abs(vLon)>.01||Math.abs(vPitch)>.01){ lon0+=vLon*dt; pitch=clamp(pitch+vPitch*dt,-80,80); vLon*=Math.pow(.94,dt); vPitch*=Math.pow(.94,dt); dirty=true; }
      else if(now-lastInteract>5000 && !showBerlin){ lon0-=0.06*dt; dirty=true; }
    }
    if(showBerlin) dirty=true;
    if(dirty){ const t0=performance.now(); render(); dirty=false;
      /* dauert das Zeichnen im Mittel länger als ~40 ms, die Auflösung um 20 % senken (höchstens zweimal: 100 → 80 → 64 %) */
      const ms=performance.now()-t0; slowN++; slowMs=slowN<3?ms:slowMs*.8+ms*.2;
      if(slowN>10&&slowMs>40&&QUAL>.7&&!dragging){ QUAL*=.8; createGlobe._q=QUAL; slowN=0; slowMs=0; W=0; resize(); } }
    requestAnimationFrame(loop);
  }
  const api={
    setTime(t){T=clamp(t,0,1000);dirty=true;},
    get time(){return T;},
    resize(){W=0;resize();dirty=true;},
    setBerlin(b){showBerlin=b;dirty=true; if(b){const q=berlinLat(); flyTo={lon:q.lon,pitch:clamp(q.lat,-70,70)}; lastInteract=performance.now();}},
    berlinLat, snowball:()=>snowball(T),
    lookAt(lon,lat){flyTo={lon,pitch:clamp(lat,-70,70)};},
    destroy(){alive=false;},
    onTouch:null
  };
  if(window.DW_DEBUG) api._view=()=>({lon:lon0,pitch,vLon,vPitch,dragging});   // nur für Tests
  resize(); requestAnimationFrame(loop);
  return api;

}

/* ============================ STATION: ZEITPORTAL ============================ */
const ERA2EPOCH={kambrium:'kamb',ordovizium:'ord',silur:'sil',devon:'dev',karbon:'karb',perm:'perm',trias:'trias',jura:'jura',kreide:'kreide',palaeogen:'palaeo',neogen:'neo',quartaer:'quart'};
const WTS=EPOCHS.map(e=>Math.max(5,Math.sqrt(e.a-e.b))); const WSUM=WTS.reduce((a,b)=>a+b,0);
{let cum=0; EPOCHS.forEach((e,i)=>{ e.u0=cum/WSUM; cum+=WTS[i]; e.u1=cum/WSUM; });}
const clampU=(v,a,b)=>v<a?a:v>b?b:v, lerpU=(a,b,u)=>a+(b-a)*u;
function tToU(t){ for(const e of EPOCHS){ if(t<=e.a && t>=e.b) return lerpU(e.u0,e.u1,(e.a-t)/(e.a-e.b)); } return t>=1000?0:1; }
function uToT(u){ u=clampU(u,0,1); for(const e of EPOCHS){ if(u<=e.u1) return lerpU(e.a,e.b,(u-e.u0)/(e.u1-e.u0)); } return 0; }
function epochOf(t){ for(const e of EPOCHS) if(t>=e.b) return e; return EPOCHS[EPOCHS.length-1]; }
function fmt(t){
  if(t<0.05) return 'Heute';
  if(t<1) return `vor ${Math.round(t*1000)} Tausend Jahren`;
  if(t<10) return `vor ${t.toFixed(1).replace('.',',')} Millionen Jahren`;
  if(t>=999.5) return 'vor 1 Milliarde Jahren';
  return `vor ${Math.round(t)} Millionen Jahren`;
}
function loadPlates(){ return new Promise((res,rej)=>{ if(window.PLATES) return res(); const s=document.createElement('script'); s.src='data/plates.js'; s.onload=()=>res(); s.onerror=rej; document.head.appendChild(s); }); }

let G=null, root=null, mode='reise', T=0, curEpoch=null, sayT=null, anim=null, raf=0, showB=false, quiz=null;

function mount(r){
  root=r; mode='reise';
  root.innerHTML='<div class="fill center"><p class="loading">Das Zeitportal öffnet sich …</p></div>';
  if(!DW.state.portal.visited){ DW.state.portal.visited=true; DW.save(); GK.after(1500,()=>DW.addSticker('erste-reise')); }
  loadPlates().then(()=>{ if(root===r) build(); }).catch(()=>{root.innerHTML='<p class="loading">Die Weltkarte konnte nicht geladen werden.</p>';});
}
function build(){
  root.innerHTML=`<div class="zp fill">
    <div class="zp-modes"><button class="btn" data-m="reise">${ART.icon('globus',34)}Zeitreise</button><button class="btn" data-m="quiz">${ART.icon('animal:stegosaurus',40)}Wer lebte wann?</button></div>
    <div class="zp-main">
      <div class="zp-globe"><canvas aria-label="Weltkugel zum Drehen"></canvas><div class="zp-hint hand">Dreh mich mit dem Finger!</div></div>
      <div class="zp-side card" id="zpSide"></div>
    </div>
    <div class="zp-bottom" id="zpBottom"></div>
  </div>`;
  G=createGlobe(root.querySelector('canvas')); if(window.DW_DEBUG) window.__zpGlobe=G;
  G.onTouch=()=>{const h=root.querySelector('.zp-hint'); if(h) h.style.opacity=0;};
  DW.$$('.zp-modes button',root).forEach(b=>b.onclick=()=>{DW.sfx('tap');setMode(b.dataset.m);});
  window.addEventListener('resize',onResize);
  setMode('reise');
  const tick=now=>{ if(!G) return; if(anim){ const u=Math.min(1,(now-anim.t0)/anim.d), e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2; setTime(uToT(lerpU(anim.u0,anim.u1,e)),true); if(u>=1){anim=null; anim_done&&anim_done(); anim_done=null;} } raf=requestAnimationFrame(tick); };
  raf=requestAnimationFrame(tick);
}
let anim_done=null;
function onResize(){ if(G){G.resize(); fitLabels(); setTime(T);} }
function travelTo(t,ms=1300,done){ anim={u0:tToU(T),u1:tToU(t),t0:performance.now(),d:ms}; anim_done=done; DW.sfx('whoosh'); }

function setMode(m){
  mode=m; DW.$$('.zp-modes button',root).forEach(b=>b.classList.toggle('sun',b.dataset.m===m));
  const zp=root.querySelector('.zp'); if(zp){ zp.classList.toggle('quiz',m==='quiz'); requestAnimationFrame(()=>{ if(G) G.resize(); }); }
  if(m==='reise') buildReise(); else buildQuiz();
}

/* ------------------- Zeitreise ------------------- */
function buildReise(){
  curEpoch=null;
  const side=root.querySelector('#zpSide');
  side.innerHTML=`<div class="pill" id="zpWhen">Heute</div><h2 id="zpName" class="zp-name"></h2><div class="zp-ill" id="zpIll"></div><p id="zpText" class="zp-text"></p>
    <div class="row" style="flex-wrap:wrap"><button class="btn warm" id="zpBerlin">${ART.icon('haus',32)}Wo ist Berlin?</button></div><p id="zpBInfo" class="zp-binfo"></p>`;
  root.querySelector('#zpBerlin').onclick=function(){ showB=!showB; this.classList.toggle('sun',showB); G.setBerlin(showB); berlinInfo(true); DW.sfx('pop'); };
  const bot=root.querySelector('#zpBottom');
  bot.innerHTML=`<div class="zp-tl"><button class="ibtn" id="zpPrev" aria-label="Ein Zeitalter zurück">${ART.icon('pfeil_l')}</button>
    <div class="zp-track" id="zpTrack" tabindex="0" role="slider" aria-label="Zeit" aria-valuemin="0" aria-valuemax="1000"><div class="zp-segs" id="zpSegs"></div>
      <div class="zp-handle" id="zpHandle"><div class="zp-bub hand" id="zpBub">Heute</div>${ART.icon('globus',40)}</div></div>
    <button class="ibtn" id="zpNext" aria-label="Ein Zeitalter vor">${ART.icon('pfeil_r')}</button></div>
    <div class="zp-ends"><span>⟵ früher</span><span>heute ⟶</span></div>`;
  const segs=bot.querySelector('#zpSegs');
  EPOCHS.forEach((e,i)=>{ const d=document.createElement('div'); d.className='zp-seg hand'; d.style.width=(WTS[i]/WSUM*100)+'%'; d.style.background=e.col; d.innerHTML=`<span>${e.name}</span>`; e.el=d; segs.appendChild(d); });
  const track=bot.querySelector('#zpTrack'); let tDrag=false, tId=null, tRect=null;   // nur ein Finger schiebt; Leiste einmal je Zug messen
  GK.noFling(track);
  const tu=ev=>{const r=tRect||track.getBoundingClientRect();return (ev.clientX-r.left)/r.width;};
  track.addEventListener('pointerdown',ev=>{ if(ev.button>0||(tDrag&&ev.pointerId!==tId)) return; tDrag=true;tId=ev.pointerId;tRect=track.getBoundingClientRect();anim=null;try{track.setPointerCapture(ev.pointerId);}catch(e){}setTime(uToT(tu(ev)));});
  track.addEventListener('pointermove',ev=>{if(tDrag&&ev.pointerId===tId)setTime(uToT(tu(ev)));});
  const end=ev=>{ if(ev.pointerId!==tId) return; tDrag=false;tId=null;tRect=null;}; track.addEventListener('pointerup',end); track.addEventListener('pointercancel',end); track.addEventListener('lostpointercapture',end);
  track.addEventListener('keydown',ev=>{const u=tToU(T);let nu=null;if(ev.key==='ArrowLeft')nu=u-.01;if(ev.key==='ArrowRight')nu=u+.01;if(nu!==null){ev.preventDefault();setTime(uToT(nu));}});
  bot.querySelector('#zpPrev').onclick=()=>jump(-1); bot.querySelector('#zpNext').onclick=()=>jump(1);
  requestAnimationFrame(()=>{fitLabels(); setTime(T);});
}
function fitLabels(){ EPOCHS.forEach(e=>{ if(!e.el||!e.el.isConnected)return; const sp=e.el.firstChild; sp.style.visibility=sp.scrollWidth<=e.el.clientWidth-2?'visible':'hidden'; }); }
function jump(dir){ const i=EPOCHS.indexOf(epochOf(T)); const mid=e=>(e.a+e.b)/2; let target;
  if(dir<0) target = T < mid(EPOCHS[i])-1 ? mid(EPOCHS[i]) : (i>0?mid(EPOCHS[i-1]):1000);
  else target = T > mid(EPOCHS[i])+1 ? mid(EPOCHS[i]) : (i<EPOCHS.length-1?(i===EPOCHS.length-2?0:mid(EPOCHS[i+1])):0);
  DW.sfx('tap'); travelTo(target,900); }
function setTime(t,fromAnim){
  T=clampU(t,0,1000); G&&G.setTime(T);
  if(mode!=='reise') return;
  const handle=root.querySelector('#zpHandle'); if(!handle) return;
  const u=tToU(T); handle.style.left=(u*100)+'%'; const bub=root.querySelector('#zpBub'); bub.textContent=fmt(T);
  const track=root.querySelector('#zpTrack'), bw=bub.offsetWidth, tw=track.clientWidth, px=u*tw; let off=0;
  if(px-bw/2<-50) off=-50-(px-bw/2); if(px+bw/2>tw+50) off=tw+50-(px+bw/2); bub.style.transform=`translateX(calc(-50% + ${off}px))`;
  track.setAttribute('aria-valuetext',fmt(T));
  root.querySelector('#zpWhen').textContent=fmt(T);
  const e=epochOf(T);
  if(e!==curEpoch){ if(curEpoch&&curEpoch.el)curEpoch.el.classList.remove('cur'); e.el&&e.el.classList.add('cur'); curEpoch=e;
    root.querySelector('#zpName').textContent=e.name; root.querySelector('#zpText').textContent=e.text; root.querySelector('#zpIll').innerHTML=illSVG(e.k);
    DW.hush(); clearTimeout(sayT); sayT=setTimeout(()=>{ if(mode==='reise'&&curEpoch===e) DW.say(`${e.name}. ${e.text}`); },1100);
    if(e.k==='kreide') DW.addSticker('blume');
  }
  berlinInfo(false);
}
function berlinInfo(speak){
  const el=root.querySelector('#zpBInfo'); if(!el) return; if(!showB){el.innerHTML='';return;}
  let txt;
  if(T<0.05) txt='Hier wohnen wir heute: Berlin.';
  else { const {lat}=G.berlinLat(), L=Math.abs(lat), hemi=lat<0?' auf der Südhalbkugel':''; let where;
    if(G.snowball()>.5) where='unter Eis und Schnee'; else if(L<12) where='ganz nah am Äquator, wo es immer warm ist'; else if(L<33) where='da, wo es heiß und trocken ist, wie in einer Wüste'; else if(L<58) where='da, wo es Sommer und Winter gibt'; else where='ganz nah am Pol, wo es kalt ist';
    txt=`Das Land, auf dem heute Berlin steht, lag damals${hemi} ${where}.`; }
  el.textContent=txt; if(speak) DW.say(txt);
}

/* ------------------- Wer lebte wann? ------------------- */
/* Tiere, die in mehreren Zeitaltern lebten: diese Antworten sind auch richtig */
const ZQ_ALSO={lystrosaurus:['trias'],xenacanthus:['devon','karbon','trias'],mammut:['neogen'],helicoprion:['trias'],
  quastenflosser:['karbon','perm','trias','jura','kreide','palaeogen','neogen','quartaer'],ammonit:['devon','karbon','perm','trias','kreide'],
  trilobit:['ordovizium','silur','devon','karbon','perm'],arthropleura:['perm'],diplocaulus:['perm'],edaphosaurus:['karbon'],
  paraceratherium:['neogen'],hyaenodon:['neogen']};
const ZQ_SKIP=[]; // bei Bedarf Tiere ausschließen
const zqDer=id=>({mammut:'das',wollnashorn:'das',smilodon:'die',titanoboa:'die',arthropleura:'die',meganeura:'die'})[id]||'der';
const LEVELS=[
 {n:'Dinozeit',eras:['trias','jura','kreide'],pool:a=>['trias','jura','kreide'].includes(a.era)},
 {n:'Mehr Zeiten',eras:['perm','trias','jura','kreide','palaeogen','quartaer'],pool:a=>['perm','trias','jura','kreide','palaeogen','quartaer'].includes(a.era)},
 {n:'Alle Zeiten',eras:['kambrium','ordovizium','silur','devon','karbon','perm','trias','jura','kreide','palaeogen','neogen','quartaer'],pool:a=>!!DATA.eraById(a.era)},
];
function buildQuiz(){
  DW.hush(); clearTimeout(sayT);
  const lv=Math.min(2,DW.state.portal.level||0);
  const side=root.querySelector('#zpSide');
  side.innerHTML=`<div class="row" style="justify-content:space-between"><span class="pill" id="zqLevel"></span><span id="zqDots"></span></div>
    <div class="zq-animal" id="zqAnimal"></div><h2 class="zp-name" id="zqName"></h2><p class="zp-text" id="zqAsk"></p>
    <div class="row" style="flex-wrap:wrap;gap:8px">${LEVELS.map((l,i)=>`<button class="btn ghost zq-lv" data-l="${i}" style="min-height:48px;font-size:17px">${'★'.repeat(i+1)} ${l.n}</button>`).join('')}</div>`;
  DW.$$('.zq-lv',side).forEach(b=>b.onclick=()=>{DW.sfx('tap');startRound(+b.dataset.l);});
  startRound(lv);
}
function startRound(lv){
  const L=LEVELS[lv]; const pool=DW.shuffle(DATA.ANIMALS.filter(a=>L.pool(a)&&ART.has(a.art)&&!ZQ_SKIP.includes(a.id)));
  // möglichst viele verschiedene Zeitalter pro Runde (reihum), damit es abwechslungsreich bleibt
  const byEra={}; pool.forEach(a=>(byEra[a.era]=byEra[a.era]||[]).push(a)); const eras=DW.shuffle(Object.keys(byEra)), list=[];
  while(list.length<8&&eras.some(e=>byEra[e].length)) eras.forEach(e=>{ if(list.length<8&&byEra[e].length) list.push(byEra[e].shift()); });
  quiz={lv,L,list:DW.shuffle(list),i:0,miss:0,tries:0};
  root.querySelector('#zqLevel').textContent=`${'★'.repeat(lv+1)} ${L.n}`;
  DW.$$('.zq-lv',root).forEach(b=>b.classList.toggle('sun',+b.dataset.l===lv));
  const bot=root.querySelector('#zpBottom');
  bot.innerHTML=`<div class="eras" id="zqEras">${L.eras.map(id=>{const e=DATA.eraById(id);return `<button class="era" data-e="${id}" style="background:${e.col}">${ART.icon(e.icon)}<span>${e.n}</span></button>`;}).join('')}</div>`;
  DW.$$('.era',bot).forEach(b=>b.onclick=()=>answer(b.dataset.e,b));
  nextQ();
}
function dots(){ root.querySelector('#zqDots').innerHTML=quiz.list.map((a,i)=>`<span style="display:inline-block;width:14px;height:14px;border-radius:50%;margin:0 2px;background:${i<quiz.i?'#8fbf7a':i===quiz.i?'#f0c35a':'rgba(160,130,90,.25)'}"></span>`).join(''); }
function nextQ(){
  if(quiz.i>=quiz.list.length) return finish();
  quiz.tries=0; dots();
  const a=quiz.list[quiz.i]; const box=root.querySelector('#zqAnimal');
  box.innerHTML=`<div class="zq-card" id="zqCard">${DW.animalSVG(a.id,{mood:'happy'})}</div>`;
  root.querySelector('#zqName').textContent=a.short||a.n;
  root.querySelector('#zqAsk').textContent='Wann lebte dieses Tier? Zieh es auf die richtige Zeit!';
  const card=box.querySelector('#zqCard'); card.classList.add('pop');
  /* Trefferflächen der Zeit-Knöpfe einmal beim Start des Zuges messen (onMove läuft bei jedem pointermove → dort keine Layout-Abfragen) */
  let eras=[], rects=null, over=-1;
  const meas=()=>{ eras=DW.$$('.era',root); rects=eras.map(b=>b.getBoundingClientRect()); };
  const at=(x,y)=>{ if(!rects) meas(); return rects.findIndex(r=>x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom); };
  const clr=()=>{ eras.forEach(b=>b.classList.remove('over')); over=-1; rects=null; };
  DW.drag(card,{ghost:()=>DW.animalSVG(a.id),onStart:meas,
    onMove:(x,y)=>{ const k=at(x,y); if(k===over) return; if(eras[over]) eras[over].classList.remove('over'); if(eras[k]) eras[k].classList.add('over'); over=k; },
    onDrop:(x,y)=>{ meas(); const b=eras[at(x,y)]; clr(); if(!b)return false; return answer(b.dataset.e,b);},
    onCancel:clr,
    onTap:()=>DW.say(`${a.short||a.n}. Wann lebte dieses Tier?`)});
  DW.say(`Wann lebte ${zqDer(a.id)} ${a.short||a.n}?`);
}
function answer(eraId,btn){
  if(!quiz||quiz.busy||!btn) return false;
  const a=quiz.list[quiz.i]; if(!a) return false;
  if(eraId===a.era||(ZQ_ALSO[a.id]||[]).includes(eraId)){
    quiz.busy=true; DW.sfx('ok'); btn.classList.add('pop');
    DW.$$('.era',root).forEach(b=>b.classList.remove('hint'));
    const e=DATA.eraById(a.era), ep=EPOCHS.find(x=>x.k===ERA2EPOCH[a.era]);
    root.querySelector('#zqAsk').textContent=`Richtig! ${a.fact}`;
    DW.discover(a.id);
    const e2=DATA.eraById(eraId)||e; const zd=zqDer(a.id);
    DW.say(`Richtig! ${zd[0].toUpperCase()+zd.slice(1)} ${a.short||a.n} lebte im ${e2.n}. ${a.fact}`.replace('im Eiszeit','in der Eiszeit').replace('im Kreide','in der Kreidezeit').replace('im Trias','in der Trias'));
    DW.state.portal.right[a.id]=true; DW.save();
    travelTo((ep.a+ep.b)/2,1400);
    const q=quiz; GK.after(3600,()=>{ if(quiz!==q||mode!=='quiz'||!root) return; quiz.busy=false; quiz.i++; nextQ(); });
    return true;
  }
  quiz.tries++; quiz.miss++; DW.sfx('no'); btn.classList.remove('wiggle'); void btn.offsetWidth; btn.classList.add('wiggle');
  const e=DATA.eraById(a.era);
  if(quiz.tries>=2){ const hb=DW.$$('.era',root).find(b=>b.dataset.e===a.era); hb&&hb.classList.add('hint'); DW.say(`Fast! Schau mal, die leuchtende Zeit: ${e.short}.`); }
  else DW.say('Hmm, das war eine andere Zeit. Probier es nochmal!');
  return false;
}
function finish(){
  const stars=quiz.miss<=1?3:quiz.miss<=4?2:1;
  quiz.busy=true; const box=root.querySelector('#zqAnimal'); if(box) box.innerHTML=`<div class="zq-card">${DW.animalSVG('protoceratops',{mood:'happy'})}</div>`;
  DW.addStars('zeitportal',stars); DW.emit&&DW.emit('gamefinish',{id:'zeitportal',stars,level:quiz.lv+1}); DW.sfx('win'); DW.confetti();
  const lv=quiz.lv; if(stars>=2&&lv<2){ DW.state.portal.level=Math.max(DW.state.portal.level||0,lv+1); DW.save(); }
  if(lv===2&&stars>=2) DW.addSticker('alle-zeiten');
  const m=DW.modal(`<div style="text-align:center"><h2 style="margin:0">Super gemacht!</h2><div style="margin:10px 0">${DW.starRow(stars)}</div>
    <p>Du hast ${quiz.list.length} Tiere ihrer Zeit zugeordnet.</p>
    <div class="row" style="justify-content:center;flex-wrap:wrap"><button class="btn go big" id="zqAgain">${ART.icon('pfeil_r',36)}Nochmal</button>
    ${lv<2?`<button class="btn sun big" id="zqNext">${ART.icon('stern',36)}Schwerer</button>`:''}</div></div>`,{onClose:()=>{}});
  DW.say(`Super gemacht! Du bekommst ${stars} Sterne.`);
  m.querySelector('#zqAgain').onclick=()=>{m.close();startRound(lv);};
  const nx=m.querySelector('#zqNext'); if(nx) nx.onclick=()=>{m.close();startRound(lv+1);};
}

function unmount(){ const o=DW.$('#overlay'); if(o){ o.hidden=true; o.innerHTML=''; } cancelAnimationFrame(raf); if(G){G.destroy();G=null;} window.removeEventListener('resize',onResize); clearTimeout(sayT); quiz=null; showB=false; root=null; }
DW.stations.zeitportal={title:'Zeitportal',mount,unmount};

})();
