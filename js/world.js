/* =====================================================================
   DINO-INSELWELT · world.js — Pangäa (vor ca. 240 Mio. Jahren), gemalt
   Endlose Welt wie ein Globus: Ost–West UND Nord–Süd laufen im Kreis.
   Kachel-Rendering, Wegnetz + Boot, Nebel, Entdeckungen, Tiere.
   Küsten aus der Plattenrekonstruktion (data/plates.js, 240 Mio. J.,
   Lambert-Azimutalprojektion um die Mitte von Pangäa).
   ===================================================================== */
(function(){
"use strict";
const W = {};
const WW=9600, WH=7200, TAU=Math.PI*2, MAPV=4;
const MS=8, MW=WW/MS, MH=WH/MS;            // Land-/Laufmaske: 8 Einheiten pro Zelle
const WG=40, GW=WW/WG, GH=WH/WG;           // Wasserraster fürs Boot
const RG=24, RGW=WW/RG, RGH=WH/RG;         // Raster für Wegebau
const PG=16, PGW=WW/PG, PGH=WH/PG;         // Raster fürs Laufen abseits der Wege
const BG=32, BGW=WW/BG, BGH=WH/BG;         // Regionenraster
const FC=200, FW=WW/FC, FH=WH/FC;          // Nebelraster
const FCW=320, FCH=240, FPX=WW/FCW;        // Nebelbild (30 Einheiten/Pixel)
let RS=4711; const rnd=()=>{RS=(RS*16807)%2147483647;return RS/2147483647;};
const R=(a,b)=>a+rnd()*(b-a);
const RP=a=>a[Math.floor(rnd()*a.length)];
const smooth=(a,b,v)=>{const t=DW.clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
/* --- Welt ohne Rand: alle Abstände „um den Globus herum“ --- */
const md=(v,m)=>((v%m)+m)%m;
const wdx=(a,b)=>{const d=a-b;return d-WW*Math.round(d/WW);};
const wdy=(a,b)=>{const d=a-b;return d-WH*Math.round(d/WH);};
const dist=(a,b)=>Math.hypot(wdx(a[0],b[0]),wdy(a[1],b[1]));
const nearX=(px,ref)=>px-WW*Math.round((px-ref)/WW);
const nearY=(py,ref)=>py-WH*Math.round((py-ref)/WH);
const GEO={"lands":[[988,254,978,264,978,270,984,272,998,270,1020,260,1050,266,1076,260,1084,262,1088,266,1088,272,1082,280,1072,284,1052,288,1048,290,1046,298,1052,302,1074,308,1086,320,1088,330,1076,340,1074,346,1080,350,1094,352,1120,372,1122,382,1110,398,1112,412,1114,416,1136,416,1166,430,1188,428,1204,438,1216,456,1230,460,1238,466,1240,470,1238,484,1254,498,1256,514,1234,540,1220,544,1208,544,1176,534,1164,532,1144,552,1136,556,1120,556,1114,554,1108,546,1108,532,1092,520,1086,518,1074,524,1066,524,1050,516,1014,516,986,526,970,524,968,530,970,534,988,540,996,548,998,560,992,566,988,568,924,548,910,546,900,538,902,520,896,516,880,514,876,510,876,504,884,494,906,484,910,478,916,470,918,456,924,446,942,440,962,426,964,420,956,416,932,418,916,430,888,438,872,448,868,466,862,470,856,470,850,464,844,446,836,444,826,452,826,460,836,474,838,488,834,498,826,504,812,504,804,502,798,494,794,482,780,474,758,468,750,468,746,472,746,494,736,512,740,526,740,534,732,542,720,544,708,552,704,564,704,578,702,584,696,590,682,596,676,596,670,592,668,582,674,552,690,540,696,530,694,512,700,492,698,486,690,484,672,506,668,518,634,590,630,608,630,618,634,630,632,640,626,646,614,648,598,662,570,682,544,704,536,716,532,754,542,792,540,802,540,836,544,858,544,868,554,896,556,906,548,914,540,914,528,908,524,908,520,912,520,916,526,928,548,950,550,962,546,968,528,980,516,994,512,1004,514,1020,510,1030,510,1036,512,1046,528,1062,548,1098,562,1114,568,1128,582,1140,614,1154,638,1172,648,1202,648,1218,656,1236,656,1252,662,1270,668,1278,686,1288,692,1296,692,1304,686,1314,686,1318,694,1342,716,1360,748,1394,770,1402,782,1422,798,1428,810,1440,830,1444,868,1464,902,1466,940,1486,962,1486,976,1498,990,1504,996,1510,1006,1534,1016,1542,1038,1544,1058,1536,1064,1538,1072,1542,1084,1554,1116,1560,1130,1568,1148,1564,1174,1568,1216,1564,1230,1566,1238,1576,1238,1584,1232,1592,1208,1602,1200,1612,1200,1618,1206,1622,1232,1620,1244,1622,1276,1624,1280,1618,1284,1600,1278,1594,1258,1592,1252,1584,1252,1572,1262,1564,1280,1560,1288,1556,1298,1540,1316,1526,1324,1526,1338,1534,1360,1534,1374,1540,1378,1544,1388,1562,1388,1578,1396,1582,1416,1584,1432,1570,1438,1556,1444,1550,1454,1548,1466,1548,1474,1554,1474,1560,1472,1566,1464,1574,1464,1584,1468,1590,1478,1594,1486,1602,1500,1604,1516,1600,1578,1602,1608,1594,1632,1592,1664,1580,1686,1570,1702,1566,1720,1554,1752,1542,1782,1520,1850,1488,1864,1474,1876,1468,1878,1462,1874,1458,1850,1468,1840,1468,1834,1460,1836,1452,1860,1426,1896,1416,1898,1412,1900,1398,1906,1384,1906,1378,1902,1376,1880,1380,1872,1378,1868,1372,1868,1358,1866,1354,1860,1350,1834,1348,1812,1340,1788,1346,1772,1348,1730,1336,1696,1350,1680,1354,1652,1374,1616,1394,1604,1398,1586,1398,1578,1404,1570,1416,1564,1418,1556,1418,1544,1400,1504,1380,1482,1374,1450,1374,1434,1376,1424,1366,1416,1352,1412,1338,1414,1332,1420,1328,1426,1326,1468,1336,1480,1340,1496,1342,1510,1354,1520,1358,1534,1354,1556,1354,1592,1358,1612,1364,1620,1360,1624,1354,1624,1346,1612,1336,1604,1316,1590,1298,1582,1272,1586,1258,1612,1228,1616,1212,1616,1204,1614,1198,1600,1190,1586,1184,1540,1182,1492,1190,1484,1182,1484,1170,1494,1160,1512,1158,1544,1150,1556,1142,1570,1136,1578,1128,1578,1118,1564,1104,1564,1094,1576,1080,1574,1072,1550,1050,1538,1030,1516,1010,1504,988,1500,968,1484,956,1468,954,1434,960,1428,962,1422,972,1406,986,1388,996,1378,996,1372,992,1370,984,1366,976,1338,974,1314,962,1290,944,1270,942,1258,950,1248,950,1232,934,1224,922,1202,908,1200,898,1214,878,1216,866,1222,854,1230,848,1246,844,1254,834,1254,830,1250,826,1232,822,1192,806,1148,790,1124,792,1116,788,1104,776,1098,762,1098,748,1102,728,1090,708,1090,698,1096,692,1112,684,1126,668,1138,664,1162,646,1174,648,1190,662,1204,672,1222,676,1242,698,1240,706,1230,720,1224,724,1208,722,1180,710,1164,696,1156,694,1152,694,1148,700,1148,720,1138,736,1144,750,1148,754,1154,754,1168,746,1176,746,1200,770,1226,774,1240,784,1246,796,1266,800,1270,808,1270,812,1262,828,1274,842,1272,862,1280,870,1290,876,1302,876,1310,882,1310,906,1316,920,1322,922,1328,920,1344,910,1354,908,1386,922,1404,940,1410,940,1426,934,1464,928,1468,922,1466,914,1452,902,1442,898,1424,896,1410,900,1386,892,1352,896,1344,890,1342,884,1344,840,1334,824,1336,800,1328,788,1312,778,1310,764,1304,752,1304,740,1314,728,1336,712,1340,702,1346,696,1360,688,1386,684,1398,684,1408,694,1404,708,1404,714,1408,718,1422,716,1436,712,1444,704,1444,696,1438,684,1440,674,1448,668,1462,666,1474,652,1510,644,1524,644,1540,634,1550,630,1580,628,1582,620,1578,616,1556,616,1546,612,1540,606,1540,598,1546,592,1560,590,1582,600,1606,600,1620,604,1634,586,1658,578,1668,572,1674,556,1678,532,1678,524,1674,520,1660,516,1650,508,1642,500,1638,494,1638,486,1644,478,1666,476,1672,474,1682,464,1684,456,1684,438,1670,392,1668,346,1662,334,1646,316,1624,302,1606,286,1596,290,1588,296,1586,302,1576,310,1538,300,1520,300,1514,302,1504,314,1494,316,1466,302,1414,286,1384,282,1354,272,1326,274,1280,270,1248,262,1182,242,1154,238,1142,232,1124,234,1084,246,1018,246,996,250],[1744,210,1742,222,1746,230,1764,250,1776,258,1782,274,1788,286,1790,308,1776,322,1774,328,1776,330,1790,334,1818,334,1834,340,1856,362,1860,370,1860,382,1864,386,1906,398,1914,406,1918,418,1924,420,1956,424,2022,450,2032,448,2046,442,2048,438,2044,432,2022,414,2008,406,2000,396,1998,390,2000,376,2010,364,2012,358,1988,340,1978,324,1962,308,1958,296,1950,288,1868,228,1822,204,1780,186,1770,184,1766,186,1762,196],[1962,550,1956,556,1956,572,1962,596,1958,604,1932,630,1924,656,1924,688,1912,714,1922,720,1944,726,1964,740,1976,744,1984,748,1986,756,1972,772,1974,780,1984,784,2002,786,2018,796,2038,816,2060,826,2068,826,2078,818,2092,814,2106,806,2110,800,2110,794,2104,776,2098,756,2090,746,2076,740,2068,732,2070,712,2054,690,2046,636,2032,612,2032,606,2040,596,2040,588,2024,576,2004,578,1974,554],[1580,850,1580,854,1584,862,1612,884,1634,890,1660,908,1694,920,1710,930,1720,932,1736,930,1746,936,1748,942,1742,954,1742,976,1736,984,1722,984,1700,974,1694,974,1692,978,1692,982,1696,988,1722,1004,1738,1008,1750,1014,1760,1016,1770,1008,1780,992,1788,984,1796,982,1804,982,1812,986,1848,1014,1864,1024,1896,1032,1932,1036,1950,1034,1970,1044,1984,1058,1988,1058,1992,1052,1992,1040,1988,1028,1974,1016,1936,1004,1884,1004,1858,1000,1842,990,1834,982,1830,966,1830,954,1834,946,1834,942,1828,938,1774,920,1760,912,1742,906,1732,896,1724,872,1710,850,1700,844,1680,842,1656,852,1638,854,1624,850,1610,842,1602,840,1586,844],[1852,1082,1852,1090,1860,1112,1862,1118,1874,1124,1890,1128,1930,1132,1946,1140,1964,1136,1972,1138,1978,1146,1978,1174,1980,1180,2010,1198,2044,1230,2046,1234,2044,1254,2048,1262,2072,1264,2080,1260,2096,1252,2104,1242,2112,1222,2110,1200,2114,1192,2112,1186,2110,1184,2104,1184,2094,1188,2068,1186,2050,1172,2038,1138,2028,1132,2012,1116,2004,1112,1990,1114,1982,1112,1976,1106,1964,1088,1942,1072,1930,1066,1900,1070,1874,1082,1854,1080],[2022,1296,2016,1296,2012,1300,2012,1316,2004,1330,2000,1346,1990,1368,1976,1382,1968,1388,1958,1390,1954,1394,1952,1406,1940,1422,1942,1434,1952,1444,1956,1444,1962,1442,1988,1420,2006,1422,2012,1418,2044,1380,2060,1356,2058,1348,2050,1342,2042,1332,2040,1310],[1514,720,1510,714,1502,714,1494,718,1480,732,1460,740,1450,740,1442,738,1416,740,1412,742,1412,748,1418,754,1444,754,1460,762,1466,760,1480,746,1504,734,1512,726],[1942,1160,1938,1166,1936,1174,1936,1192,1940,1202,1950,1216,1956,1230,1964,1232,1972,1226,1974,1216,1962,1194,1950,1164],[1604,692,1602,688,1578,682,1564,682,1550,690,1542,708,1546,714,1586,710,1596,704,1604,696]],"shelf":[[1996,1324,1982,1324,1958,1336,1944,1336,1894,1308,1900,1322,1888,1334,1872,1332,1858,1318,1846,1326,1814,1332,1866,1344,1876,1356,1876,1370,1902,1366,1914,1374,1916,1386,1906,1418,1896,1426,1864,1434,1844,1456,1850,1458,1874,1450,1880,1452,1888,1460,1886,1470,1850,1498,1786,1528,1756,1550,1654,1594,1578,1610,1490,1612,1464,1598,1454,1586,1454,1576,1464,1556,1448,1558,1440,1574,1424,1590,1402,1592,1388,1590,1380,1582,1380,1568,1370,1548,1334,1542,1322,1534,1312,1538,1290,1566,1264,1572,1262,1584,1282,1586,1294,1598,1290,1620,1282,1630,1314,1628,1320,1616,1318,1600,1330,1592,1348,1612,1378,1614,1406,1626,1432,1628,1454,1644,1490,1650,1628,1622,1650,1610,1694,1598,1774,1584,1806,1562,1814,1548,1850,1522,1908,1460,1936,1458,1950,1452,1934,1438,1932,1420,1944,1404,1946,1388,1982,1364],[1086,394,1082,428,1066,450,1068,458,1086,474,1084,500,1076,510,1060,510,1068,514,1086,510,1098,512,1116,528,1122,548,1138,546,1164,524,1208,536,1224,534,1246,514,1246,502,1228,486,1232,472,1212,464,1200,448,1186,438,1166,438,1132,424,1116,424,1108,442,1094,440,1088,434,1088,422,1102,412,1100,396,1106,388],[2050,596,2042,610,2054,634,2064,688,2078,710,2078,730,2088,736,2090,730,2096,730,2106,740,2100,744,2108,756,2120,792,2120,802,2110,814,2072,834,2104,838,2154,806,2152,746,2120,676,2086,642,2076,618],[1210,900,1228,914,1250,940,1270,932,1294,936,1342,966,1370,968,1380,988,1408,974,1420,958,1420,944,1400,948,1384,932,1352,936,1350,928,1360,920,1354,918,1328,930,1312,928,1300,908,1300,886,1268,886,1246,874,1226,870,1222,884],[1098,700,1110,726,1108,760,1120,780,1152,782,1206,802,1216,798,1238,798,1230,786,1196,778,1174,756,1154,762,1142,760,1130,742,1140,718,1138,698,1148,686,1164,686,1196,708,1224,714,1232,700,1220,686,1194,678,1174,658,1164,656,1130,676,1116,692],[878,1474,936,1502,950,1516,1002,1546,1036,1560,1102,1574,1106,1580,1106,1594,1116,1602,1128,1600,1138,1584,1146,1582,1156,1606,1174,1610,1194,1624,1192,1610,1196,1602,1228,1582,1224,1572,1182,1578,1148,1574,1130,1578,1112,1568,1080,1562,1060,1546,1038,1552,1018,1552,998,1538,986,1512,972,1506,960,1494,936,1494,898,1474],[1014,438,1006,432,986,430,972,420,966,436,928,456,924,472,910,492,886,506,906,512,924,502,938,510,940,526,924,536,910,532,912,538,962,538,958,526,966,516,986,516,1014,508,988,510,928,500,926,490,978,474,1012,448]],"xf":{"sc":1880.389,"cx":4747.2,"cy":3564.3,"lon0":8.431,"sx":1.4}};

/* ---------------- Geografie von Pangäa ---------------- */
const blob=(cx,cy,rx,ry,n,seed)=>{const p=[];for(let i=0;i<n;i++){const a=i/n*TAU,r=1+Math.sin(i*2.1+seed)*.09+Math.cos(i*1.3+seed*2)*.07;p.push([cx+Math.cos(a)*rx*r,cy+Math.sin(a)*ry*r]);}return p;};
const unpack=a=>{const p=[];for(let i=0;i<a.length;i+=2)p.push([a[i]*4,a[i+1]*4]);return p;};
/* Stationen (Weltkoordinaten): kleiner Start im Forscher-Tal, alles andere über ganz Pangäa und alle Inseln verteilt */
const ST_POS={
  // Forscher-Tal (Start)
  forscher:[4450,4060],zuhause:[4060,4090],zeitportal:[4300,3770],ausflug:[4700,4330],
  // Laurasia (Wälder, Europa-Städtchen, Steppe im Westen)
  picknick:[2900,2500],expedition:[3500,2350],museum:[5350,2650],lauf:[2550,3250],
  // Sibirische Vulkane
  rennen:[5000,1400],vulkan:[5560,1720],
  // Tethys-Küste & Gondwana-Wälder
  dschungel:[5850,4200],lager:[5500,4750],kita:[6150,4750],werkstatt:[6800,5650],
  // Pangäa-Wüste
  spuren:[2600,4200],eier:[3100,4750],nest:[3650,4500],
  // Fossilien-Ebene & Gondwana-Süden
  grabung:[4150,5250],werbinich:[4550,5000],bildquiz:[4850,5400],wiegross:[3300,5350],
  // Gondwana-Hochland
  memory:[4450,5850],grossklein:[5100,6000],schatten:[5750,5850],kamera:[6200,6050],
  // Inseln (je mindestens eine Station an Land, nur mit dem Boot zu erreichen)
  karten:[7560,1340],kino:[7880,2650],futter:[6680,3510],puzzle:[8230,4870],waage:[8020,5445],ammoniten:[5890,2950],meerfutter:[7775,4745],lufwas:[6225,2775],
  anning:[6775,2945],klang:[960,2360],rettung:[820,5230],endlos:[3200,6950],tracker:[5935,285],
  // echte Meeresstationen (Plattformen, Schiff, Tiefsee)
  schiff:[7100,3170],tiefsee:[1100,3900],riff:[6880,4540],tauchfahrt:[5800,3430],
};
const ISLAND_ST={i1:'karten',i2:'kino',i3:'futter',i4:'puzzle',i5:'waage',i6:'ammoniten',i7:'meerfutter',i8:'lufwas',anning:'anning',pvulk:'klang',patoll:'rettung',psued:'endlos',pnord:'tracker'};
const ON_LAND=new Set(Object.values(ISLAND_ST));             // in den Daten „Meer“, hier aber auf einer Insel
const seaSt=s=>!!(s&&s.sea&&!ON_LAND.has(s.id));
const SEA_OFF={riff:[0,150],schiff:[-30,150],tiefsee:[0,150],anning:[0,200],meerfutter:[0,140],tauchfahrt:[-20,150],ammoniten:[-40,170]};
/* Inseln: aus den Daten (Kimmerien, China-Blöcke …) + gemalte Inseln */
const HAND_ISL=[
  {k:'anning',c:[6850,2830],rx:250,ry:170,seed:6,reg:'anning'},
  {k:'pvulk',c:[1150,2300],rx:360,ry:240,seed:3,reg:'pinsel'},
  {k:'patoll',c:[900,5250],rx:270,ry:190,seed:8,reg:'pinsel'},
  {k:'psued',c:[3300,6960],rx:290,ry:140,seed:5,reg:'pinsel'},
  {k:'pnord',c:[6100,290],rx:270,ry:150,seed:9,reg:'pinsel'},
];
const DATA_ISL_REG=['main','nordchina','suedchina','kimmerien','kimmerien','kimmerien','tinsel','kimmerien','tinsel'];
/* Gebirge: Kammlinien (Berge werden entlang gemalt, der Kern ist nicht begehbar) */
const RANGES=[
  {k:'zentral',pts:[[2230,3930],[2700,3790],[3200,3670],[3700,3570],[4150,3490],[4520,3390]],w:250,core:105,snow:true,pal:'M',n:44},
  {k:'ural',pts:[[4960,2290],[5350,2240],[5800,2190],[6250,2270]],w:170,core:70,snow:true,pal:'M',n:16},
  {k:'hoch',pts:[[4250,6180],[4800,6240],[5400,6250],[6000,6200],[6500,6050]],w:170,core:70,snow:true,pal:'ICE',n:22},
  {k:'gondw',pts:[[2560,5060],[2800,5480],[3150,5820],[3650,6080]],w:170,core:70,snow:false,pal:'R',n:18},
];
/* Flüsse (von den Bergen zur Küste) und Seen */
const RIVERS=[
  {pts:[[3980,3650],[4050,3810],[4170,3960],[4330,4190],[4560,4240],[4800,4070],[5100,3990],[5320,3930],[5480,3860]],w0:12,w1:32},
  {pts:[[3470,3440],[3560,3160],[3480,2920],[3610,2630],[3700,2420],[3740,2240],[3760,2080]],w0:12,w1:32},
  {pts:[[5480,2130],[5390,1850],[5250,1520],[5150,1230],[5080,960],[5060,820]],w0:12,w1:30},
  {pts:[[5260,5660],[5210,5920],[5280,6120],[5200,6330],[5210,6520]],w0:10,w1:26},
  {pts:[[2900,3790],[2650,3720],[2420,3590],[2180,3500],[2000,3470]],w0:10,w1:28},
  {pts:[[4520,5560],[4330,5480],[4120,5560],[3850,5660],[3560,5760],[3300,5790],[3080,5850],[2950,5900]],w0:10,w1:30},
];
const LAKES=[{x:3990,y:4160,rx:118,ry:70},{x:3290,y:4430,rx:210,ry:110,salt:true},{x:5360,y:5720,rx:130,ry:72,ice:true},{x:3060,y:2860,rx:150,ry:90},{x:6350,y:5620,rx:120,ry:70}];
const VOLCANO={x:5860,y:1360,w:760,h:520};
const LAVA=[[5876,844],[5950,1040],[6050,1240],[6160,1400],[6300,1500],[6430,1540],[6600,1560]];
const DEEP={x:1100,y:3700,r:260};              // Tiefsee-Kreis (Panthalassa)
/* Regionen (für Farben, Pflanzen, Begrüßung und Pips Aufträge) */
const REG_INFO={
  steppe:{n:'Pangäa',q:null,ground:'#c4c890'},
  tal:{n:'Forscher-Tal',q:'insel',ground:'#b9c98c'},
  gebirge:{n:'Zentralgebirge',q:'insel',ground:'#c9c09c',say:'Das Zentralgebirge! Hier sind zwei Kontinente zusammengestoßen. Deshalb sind die Berge so hoch.'},
  wueste:{n:'Pangäa-Wüste',q:'wueste',ground:'#e6c283',say:'Die Pangäa-Wüste! Mitten im Riesenland regnet es kaum. Hier ist es heiß und sandig.'},
  tethys:{n:'Tethys-Küste',q:'tethys',ground:'#9fc27c',say:'Die Tethys-Küste! Hier ist es warm und feucht. Überall wachsen Farne und Palmfarne.'},
  laurasia:{n:'Laurasia-Wälder',q:'exped',ground:'#a9bf84',say:'Die Laurasia-Wälder! Hier wachsen hohe Nadelbäume und Ginkgos.'},
  vulkan:{n:'Sibirische Vulkane',q:'vulkan',ground:'#a39e84',say:'Die Sibirischen Vulkane! Hier fließt heiße Lava aus der Erde. Der Boden ist ganz schwarz.'},
  eis:{n:'Gondwana-Hochland',q:'eis',ground:'#e3e9e4',say:'Das Gondwana-Hochland! Hier oben ist es kalt, auf den Bergen liegt Schnee.'},
  ebene:{n:'Fossilien-Ebene',q:'ebene',ground:'#d2cd92',say:'Die Fossilien-Ebene! Hier stecken überall alte Knochen im Boden.'},
  gondwald:{n:'Gondwana-Wälder',q:null,ground:'#abc486',say:'Die Gondwana-Wälder! Hier wachsen Samenfarne und Nadelbäume.'},
  nordchina:{n:'Nordchina-Insel',q:null,ground:'#b3c388',say:'Die Nordchina-Insel! Sie liegt ganz allein im großen Meer.'},
  suedchina:{n:'Südchina-Insel',q:null,ground:'#a4c47f',say:'Die Südchina-Insel! Hier ist es warm und grün.'},
  kimmerien:{n:'Kimmerische Inseln',q:null,ground:'#b5c585',say:'Die Kimmerischen Inseln! Sie wandern ganz langsam nach Norden.'},
  tinsel:{n:'Tethys-Inselchen',q:null,ground:'#b7c889'},
  anning:{n:'Klippen-Insel',q:null,ground:'#c6d19e'},
  pinsel:{n:'Panthalassa-Inseln',q:null,ground:'#b9c98c',say:'Eine Insel mitten in Panthalassa! Hierher kommen nur Seefahrer.'},
  tmeer:{n:'Tethys-Meer',q:'meer',say:'Wir sind im Tethys-Meer! Das Wasser ist warm. Hier schwimmen Nothosaurier.'},
  pmeer:{n:'Panthalassa',q:'meer',say:'Das ist Panthalassa, das riesige Urmeer! Es reicht einmal um die ganze Welt.'},
};
const REG_KEYS=Object.keys(REG_INFO);
// Reihenfolge = Malreihenfolge (spätere gewinnen); nur auf dem Hauptkontinent
const REGION_POLY=[
  ['laurasia',[[2300,2250],[2800,2050],[3400,1900],[4100,2150],[4500,2550],[4520,3000],[4300,3250],[3700,3300],[3000,3450],[2500,3500],[2250,3100]]],
  ['laurasia',[[4450,2350],[5000,2400],[5600,2450],[6300,2380],[6600,2600],[6200,2900],[5600,2950],[5200,3050],[4900,2900]]],
  ['vulkan',[[4500,1250],[4900,950],[5600,850],[6500,950],[6800,1400],[6700,1950],[6200,2120],[5500,2120],[4900,2150],[4550,1800]]],
  ['wueste',[[2450,3950],[2900,3880],[3500,3860],[3800,3980],[3860,4350],[3800,4800],[3450,5000],[2950,4950],[2550,4700],[2300,4300]]],
  ['ebene',[[3700,4800],[4250,4780],[4900,4880],[5150,5150],[4950,5470],[4300,5560],[3750,5450],[3550,5100]]],
  ['gondwald',[[5500,5150],[6200,5000],[7000,5200],[7700,5350],[7500,5800],[6700,6000],[6100,5700],[5700,5500]]],
  ['eis',[[4150,5560],[4800,5580],[5500,5520],[6200,5600],[6500,5900],[6200,6350],[5400,6500],[4600,6450],[4100,6200],[3950,5850]]],
  ['tethys',[[5250,3980],[5750,3900],[6150,4000],[6380,4450],[6400,5000],[6000,5120],[5550,5000],[5300,4700],[5280,4300]]],
  ['tal',[[3820,3760],[4250,3660],[4650,3720],[4850,3900],[5150,3980],[5330,4250],[5250,4600],[4900,4880],[4450,4850],[4050,4760],[3800,4450],[3700,4050]]],
];
const TETHYS_SEA=[[4400,2500],[5200,2350],[6300,2250],[7200,1900],[8800,1800],[9200,3500],[8900,5700],[7600,5900],[6600,5500],[6200,5300],[5400,4300],[4700,4000],[4400,3300]];
/* Wegnetz: Kreuzungen + Verbindungen (Wege werden beim Start um Berge, Seen und Flüsse herum geplant) */
const JUNC={jT1:[5360,4330],jW:[3720,4360],jPass:[3500,3280],jL:[3450,2900],jAus:[6560,5560],jL1:[4230,2640],jE2:[4560,2260],jE3:[4930,1920],jEu:[5330,2560]};
const ROAD_LINKS=[
  ['forscher','zeitportal'],['forscher','zuhause'],['zuhause','zeitportal'],['forscher','ausflug'],
  ['ausflug','jT1'],['jT1','dschungel'],['jT1','lager'],['lager','kita'],['dschungel','kita'],['kita','jAus'],['jAus','werkstatt'],
  ['zuhause','jW'],['jW','nest'],['nest','eier'],['eier','spuren'],['spuren','lauf'],
  ['ausflug','werbinich'],['werbinich','grabung'],['grabung','wiegross'],['eier','wiegross'],['werbinich','bildquiz'],
  ['bildquiz','memory'],['grabung','memory'],['memory','grossklein'],['grossklein','schatten'],['schatten','kamera'],['kamera','jAus'],
  ['zeitportal','jPass'],['jPass','jL'],['jL','expedition'],['jL','picknick'],['picknick','expedition'],['picknick','lauf'],
  ['expedition','jL1'],['jL1','jE2'],['jE2','jE3'],['jE3','rennen'],['rennen','vulkan'],['jE2','jEu'],['jEu','museum'],
];
/* Anleger: grobe Lage; die genaue Stelle an der Küste sucht der Aufbau selbst */
const DOCK_DEF=[
  {id:'dkHafen',near:[5820,3880],link:'dschungel'},{id:'dkTeth',near:[6280,4420],link:'kita'},{id:'dkWest',near:[2080,4300],link:'spuren'},
  {id:'dkSouth',near:[5320,6420],link:'grossklein'},{id:'dkNorth',near:[3720,2130],link:'expedition'},{id:'dkNW',near:[2300,2700],link:'picknick'},
  {id:'dkSib',near:[6700,1650],link:'vulkan'},{id:'dkEu',near:[5420,2860],link:'jEu'},{id:'dkAus',near:[7150,5480],link:'jAus'},{id:'dkArc',near:[5000,960],link:'rennen'},
];
/* ---------------- Zeichenhilfen ---------------- */
function polyPath(x,pts,close=true){x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));if(close)x.closePath();}
function smoothSub(x,pts,close=true){ // Catmull-Rom als Unterpfad
  const n=pts.length,P=i=>close?pts[(i+n)%n]:pts[Math.max(0,Math.min(n-1,i))];
  x.moveTo(pts[0][0],pts[0][1]);const last=close?n:n-1;
  for(let i=0;i<last;i++){const p0=P(i-1),p1=P(i),p2=P(i+1),p3=P(i+2);
    x.bezierCurveTo(p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6,p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6,p2[0],p2[1]);}
  if(close)x.closePath();
}
function smoothPath(x,pts,close=true){x.beginPath();smoothSub(x,pts,close);}
function catmull(pts,close,step=12){ // Kurvenpunkte (für Masken und Bootswege)
  const n=pts.length,P=i=>close?pts[(i+n)%n]:pts[Math.max(0,Math.min(n-1,i))],out=[pts[0].slice()];const last=close?n:n-1;
  for(let i=0;i<last;i++){const p0=P(i-1),p1=P(i),p2=P(i+1),p3=P(i+2);const k=Math.max(1,Math.ceil(dist(p1,p2)/step));
    for(let s=1;s<=k;s++){const t=s/k,t2=t*t,t3=t2*t;
      out.push([.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
                .5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)]);}}
  return out;
}
function wobble(pts,amp,seed=1){
  const out=[];const n=pts.length;
  for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];const steps=Math.max(2,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/40));
    for(let k=0;k<steps;k++){const u=k/steps;let x=a[0]+(b[0]-a[0])*u,y=a[1]+(b[1]-a[1])*u;
      const nn=DW.noise2(x*.012+seed,y*.012)-.5, nn2=DW.noise2(x*.05,y*.05+seed)-.5; out.push([x+nn*amp+nn2*amp*.3,y+(DW.noise2(y*.012,x*.012+seed)-.5)*amp+nn2*amp*.3]);}}
  return out;
}
function inPoly(x,y,pts){let c=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;}
function bbox(p){let a=1e9,b=1e9,c=-1e9,d=-1e9;p.forEach(q=>{a=Math.min(a,q[0]);b=Math.min(b,q[1]);c=Math.max(c,q[0]);d=Math.max(d,q[1]);});return[a,b,c,d];}
const hasFilter=(()=>{try{const t=document.createElement('canvas').getContext('2d');t.filter='blur(2px)';return t.filter==='blur(2px)';}catch(e){return false;}})();
const mkCanvas=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c;};
const rr=(x,a,b,w,h,r)=>{x.beginPath();x.roundRect?x.roundRect(a,b,w,h,r):x.rect(a,b,w,h);};

function noiseTile(size,scale,oct=4){
  const c=mkCanvas(size,size);const x=c.getContext('2d'),im=x.createImageData(size,size);
  for(let j=0;j<size;j++)for(let i=0;i<size;i++){const a=i/size*TAU,b=j/size*TAU;let n=0,amp=.5,f=1;
    for(let o=0;o<oct;o++){n+=amp*DW.noise2(20+Math.cos(a)*scale*f+o*7,20+Math.sin(a)*scale*f+Math.cos(b)*scale*f+Math.sin(b)*scale*f);amp*=.5;f*=2;}
    const k=(j*size+i)*4,v=n;im.data[k]=v*255;im.data[k+1]=v*255;im.data[k+2]=v*255;im.data[k+3]=255;}
  x.putImageData(im,0,0);return c;
}
function grainTile(size){
  const c=mkCanvas(size,size);const x=c.getContext('2d'),im=x.createImageData(size,size);
  for(let i=0;i<size*size;i++){const k=i*4,r=Math.random();im.data[k]=70;im.data[k+1]=52;im.data[k+2]=30;im.data[k+3]=r>.55?(r-.55)*120:0;}
  x.putImageData(im,0,0);return c;
}

/* ---------------- Landschaftsdetails (gemalt) ---------------- */
function conifer(x,cx,cy,s,col){
  x.save();x.translate(cx,cy);x.scale(s,s);
  x.fillStyle='rgba(60,50,30,.16)';x.beginPath();x.ellipse(6,2,18,6,0,0,TAU);x.fill();
  x.strokeStyle='#7a5236';x.lineWidth=3;x.beginPath();x.moveTo(0,0);x.lineTo(0,-16);x.stroke();
  const c1=col||'#5f7f52';
  for(let i=0;i<3;i++){const y=-14-i*14,w=18-i*4;x.fillStyle=i%2?ART.shade(c1,1.12):c1;x.beginPath();x.moveTo(-w,y);x.quadraticCurveTo(0,y-6,w,y);x.lineTo(1,y-24+i*2);x.closePath();x.fill();
    x.strokeStyle='rgba(60,50,30,.35)';x.lineWidth=1.2;x.stroke();}
  x.restore();
}
function snowConifer(x,cx,cy,s,col){
  conifer(x,cx,cy,s,col);x.save();x.translate(cx,cy);x.scale(s,s);x.fillStyle='#fbfcfa';
  for(let i=0;i<3;i++){const y=-14-i*14,w=18-i*4;x.beginPath();x.moveTo(1,y-24+i*2);x.lineTo(-w*.55,y-9);x.quadraticCurveTo(-w*.1,y-12,1,y-10);x.quadraticCurveTo(w*.3,y-12,w*.5,y-9);x.closePath();x.fill();}
  x.restore();
}
function fern(x,cx,cy,s,col){x.save();x.translate(cx,cy);x.scale(s,s);x.strokeStyle=col||'#7f9f5c';x.lineWidth=1.3;
  for(let k=-2;k<=2;k++){x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(k*6,-10,k*12,-14+Math.abs(k)*3);x.stroke();
    for(let j=1;j<5;j++){const u=j/5,px=k*12*u,py=(-14+Math.abs(k)*3)*u;x.beginPath();x.moveTo(px,py);x.lineTo(px-4,py-3);x.moveTo(px,py);x.lineTo(px+4,py-3);x.stroke();}}
  x.restore();}
function tuft(x,cx,cy,c){x.strokeStyle=c;x.lineWidth=1.6;x.beginPath();x.moveTo(cx-4,cy);x.lineTo(cx-6,cy-7);x.moveTo(cx,cy);x.lineTo(cx,cy-9);x.moveTo(cx+4,cy);x.lineTo(cx+6,cy-7);x.stroke();}
function rock(x,cx,cy,s,c='#b9ad98',snow){x.save();x.translate(cx,cy);x.scale(s,s);x.fillStyle='rgba(60,50,30,.16)';x.beginPath();x.ellipse(4,3,15,5,0,0,TAU);x.fill();
  x.fillStyle=c;x.beginPath();x.moveTo(-14,2);x.quadraticCurveTo(-12,-12,0,-14);x.quadraticCurveTo(14,-12,14,2);x.closePath();x.fill();x.strokeStyle='rgba(60,50,30,.4)';x.lineWidth=1.2;x.stroke();
  x.fillStyle=snow?'rgba(255,255,255,.9)':'rgba(255,255,255,.25)';x.beginPath();snow?x.ellipse(-1,-10,10,4,-.1,0,TAU):x.ellipse(-4,-8,5,3,-.4,0,TAU);x.fill();x.restore();}
function cactus(x,cx,cy,s){x.save();x.translate(cx,cy);x.scale(s,s);x.fillStyle='rgba(60,50,30,.14)';x.beginPath();x.ellipse(6,2,12,4,0,0,TAU);x.fill();
  x.fillStyle='#8fae6a';x.strokeStyle='rgba(60,70,40,.5)';x.lineWidth=1.2;
  const r=(a,b,w,h)=>{rr(x,a,b,w,h,w/2);x.fill();x.stroke();};
  r(-4,-30,8,30);r(-14,-20,6,12);r(-12,-14,8,5);r(8,-24,6,12);r(4,-16,8,5);x.restore();}
const PAL_M=['#b7a58c','#a8957a','#8f7d66','#80705c'], PAL_ICE=['#d3dde2','#bccad2','#9fb1bc','#8fa3b0'], PAL_V=['#8b7f72','#7a6e62','#5f554c','#51483f'], PAL_R=['#d9a577','#cf9567','#b87a50','#a86c45'];
function mountain(x,cx,cy,w,h,snow,pal=PAL_M){
  x.fillStyle='rgba(60,50,30,.12)';x.beginPath();x.ellipse(cx+10,cy+4,w*.6,h*.12,0,0,TAU);x.fill();
  const g=x.createLinearGradient(cx-w/2,0,cx+w/2,0);g.addColorStop(0,pal[0]);g.addColorStop(.5,pal[1]);g.addColorStop(.52,pal[2]);g.addColorStop(1,pal[3]);
  x.fillStyle=g;x.beginPath();x.moveTo(cx-w/2,cy);x.lineTo(cx-w*.08,cy-h);x.lineTo(cx+w*.06,cy-h*.96);x.lineTo(cx+w/2,cy);x.closePath();x.fill();
  x.strokeStyle='rgba(60,50,30,.45)';x.lineWidth=1.6;x.stroke();
  if(snow){x.fillStyle='#f7f8f6';x.beginPath();x.moveTo(cx-w*.08,cy-h);x.lineTo(cx-w*.2,cy-h*.66);x.lineTo(cx-w*.1,cy-h*.72);x.lineTo(cx-w*.02,cy-h*.62);x.lineTo(cx+w*.08,cy-h*.72);x.lineTo(cx+w*.2,cy-h*.66);x.lineTo(cx+w*.06,cy-h*.96);x.closePath();x.fill();}
  x.strokeStyle='rgba(90,75,55,.35)';x.lineWidth=1.2;for(let i=0;i<4;i++){x.beginPath();x.moveTo(cx+w*(.02+i*.08),cy-h*(.8-i*.18));x.lineTo(cx+w*(.1+i*.09),cy-h*(.62-i*.16));x.stroke();}
}
function dune(x,cx,cy,w,fl){x.save();x.translate(cx,cy);if(fl)x.scale(-1,1);
  x.fillStyle='rgba(150,105,50,.16)';x.beginPath();x.ellipse(w*.1,3,w*.95,w*.12,0,0,TAU);x.fill();
  x.fillStyle='#ecd39d';x.beginPath();x.moveTo(-w,0);x.quadraticCurveTo(-w*.35,-w*.42,w*.08,-w*.36);x.quadraticCurveTo(w*.55,-w*.2,w,0);x.closePath();x.fill();
  x.fillStyle='rgba(196,146,82,.42)';x.beginPath();x.moveTo(w*.08,-w*.36);x.quadraticCurveTo(w*.55,-w*.2,w,0);x.quadraticCurveTo(w*.45,-w*.05,w*.08,-w*.36);x.fill();
  x.strokeStyle='rgba(120,85,45,.45)';x.lineWidth=1.4;x.beginPath();x.moveTo(-w*.55,-w*.2);x.quadraticCurveTo(-w*.25,-w*.4,w*.08,-w*.36);x.quadraticCurveTo(w*.3,-w*.3,w*.5,-w*.14);x.stroke();
  x.strokeStyle='rgba(160,120,70,.3)';x.lineWidth=1;for(let i=1;i<3;i++){x.beginPath();x.moveTo(-w*.8+i*10,-w*.04*i);x.quadraticCurveTo(-w*.4,-w*.12*i,-w*.1,-w*.08*i);x.stroke();}
  x.restore();}
function rockArch(x,cx,cy,s){x.save();x.translate(cx,cy);x.scale(s,s);
  x.fillStyle='rgba(90,60,30,.18)';x.beginPath();x.ellipse(8,3,60,10,0,0,TAU);x.fill();
  x.fillStyle='#cf9567';x.beginPath();x.moveTo(-52,0);x.lineTo(-48,-50);x.quadraticCurveTo(-42,-88,0,-90);x.quadraticCurveTo(42,-88,48,-50);x.lineTo(52,0);x.lineTo(26,0);x.lineTo(24,-38);x.quadraticCurveTo(0,-64,-24,-38);x.lineTo(-26,0);x.closePath();x.fill();
  x.strokeStyle='rgba(80,50,30,.55)';x.lineWidth=1.6;x.stroke();
  x.fillStyle='rgba(120,70,40,.25)';x.beginPath();x.moveTo(26,0);x.lineTo(24,-38);x.quadraticCurveTo(40,-60,48,-50);x.lineTo(52,0);x.fill();
  x.strokeStyle='rgba(255,230,190,.45)';x.lineWidth=2;[-70,-56].forEach(y=>{x.beginPath();x.moveTo(-44,y+12);x.quadraticCurveTo(0,y-14,44,y+12);x.stroke();});
  x.restore();}
function bones(x,cx,cy,s,a){x.save();x.translate(cx,cy);x.rotate(a);x.scale(s,s);
  x.fillStyle='rgba(90,70,40,.18)';x.beginPath();x.ellipse(0,4,34,7,0,0,TAU);x.fill();
  x.strokeStyle='#f1e7d0';x.lineWidth=4;x.lineCap='round';x.beginPath();x.moveTo(-30,0);x.lineTo(30,0);x.stroke();
  for(let i=-2;i<=2;i++){x.beginPath();x.moveTo(i*11,0);x.quadraticCurveTo(i*11-8,-14,i*11-4,-22);x.stroke();}
  x.strokeStyle='rgba(90,70,40,.5)';x.lineWidth=1;x.beginPath();x.moveTo(-30,2.4);x.lineTo(30,2.4);x.stroke();
  x.fillStyle='#f1e7d0';x.beginPath();x.ellipse(36,-3,10,7,.3,0,TAU);x.fill();x.stroke();x.fillStyle='#6b5a45';x.beginPath();x.arc(38,-4,2,0,TAU);x.fill();
  x.restore();}
function flagDig(x,cx,cy,col){x.strokeStyle='#6e4a30';x.lineWidth=2;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx,cy-28);x.stroke();x.fillStyle=col;x.beginPath();x.moveTo(cx,cy-28);x.lineTo(cx+14,cy-23);x.lineTo(cx,cy-18);x.fill();}
function broadTree(x,cx,cy,s,col){x.save();x.translate(cx,cy);x.scale(s,s);
  x.fillStyle='rgba(60,50,30,.16)';x.beginPath();x.ellipse(8,2,24,7,0,0,TAU);x.fill();
  x.strokeStyle='#7a5a3c';x.lineWidth=5;x.beginPath();x.moveTo(0,0);x.lineTo(1,-22);x.stroke();
  const c=col||'#6f9a5a';[[-10,-30,14],[10,-32,15],[0,-44,16],[-2,-30,12]].forEach(([a,b,r],i)=>{x.fillStyle=i===2?ART.shade(c,1.12):c;x.beginPath();x.arc(a,b,r,0,TAU);x.fill();});
  x.strokeStyle='rgba(50,60,30,.35)';x.lineWidth=1.2;x.beginPath();x.arc(0,-44,16,Math.PI*1.05,Math.PI*1.95);x.stroke();
  x.fillStyle='rgba(255,255,230,.25)';x.beginPath();x.ellipse(-4,-50,6,4,-.4,0,TAU);x.fill();x.restore();}
function acacia(x,cx,cy,s){x.save();x.translate(cx,cy);x.scale(s,s);
  x.fillStyle='rgba(60,50,30,.15)';x.beginPath();x.ellipse(10,2,30,6,0,0,TAU);x.fill();
  x.strokeStyle='#7a5a3c';x.lineWidth=3.5;x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(2,-20,-6,-34);x.moveTo(1,-18);x.quadraticCurveTo(8,-26,12,-34);x.stroke();
  x.fillStyle='#8aa35f';x.beginPath();x.ellipse(2,-38,34,9,0,0,TAU);x.fill();x.fillStyle='#9bb56d';x.beginPath();x.ellipse(-2,-42,24,6,0,0,TAU);x.fill();
  x.strokeStyle='rgba(60,70,40,.35)';x.lineWidth=1;x.beginPath();x.ellipse(2,-38,34,9,0,0,TAU);x.stroke();x.restore();}
function bush(x,cx,cy,s,col){x.save();x.translate(cx,cy);x.scale(s,s);x.fillStyle='rgba(60,50,30,.15)';x.beginPath();x.ellipse(4,2,18,5,0,0,TAU);x.fill();
  x.fillStyle=col||'#7fa66a';[[-8,-8,9],[6,-9,10],[-1,-15,9]].forEach(([a,b,r])=>{x.beginPath();x.arc(a,b,r,0,TAU);x.fill();});x.strokeStyle='rgba(50,60,30,.3)';x.lineWidth=1;x.stroke();x.restore();}
function flowers(x,cx,cy,col){x.fillStyle=col;for(let k=0;k<3;k++){x.beginPath();x.arc(cx+k*6-6,cy-(k%2)*4,3,0,TAU);x.fill();}}
function iceFloe(x,pts){x.fillStyle='rgba(70,110,130,.18)';polyPath(x,pts.map(p=>[p[0]+4,p[1]+5]));x.fill();
  x.fillStyle='#f6f9f9';polyPath(x,pts);x.fill();x.strokeStyle='rgba(90,130,150,.55)';x.lineWidth=1.6;x.stroke();
  x.fillStyle='rgba(190,215,225,.6)';const c=pts.reduce((a,p)=>[a[0]+p[0]/pts.length,a[1]+p[1]/pts.length],[0,0]);x.beginPath();x.ellipse(c[0]+4,c[1]+3,8,3,0,0,TAU);x.fill();}
function coral(x,cx,cy,s,cols){x.save();x.translate(cx,cy);x.scale(s,s);x.globalAlpha=.6;
  cols.forEach((c,i)=>{x.fillStyle=c;x.beginPath();x.ellipse(Math.cos(i*2.4)*12,Math.sin(i*2.4)*6,9-i,6-i*.6,i,0,TAU);x.fill();});
  x.strokeStyle=cols[0];x.lineWidth=2;x.lineCap='round';for(let k=-1;k<=1;k++){x.beginPath();x.moveTo(k*8,2);x.lineTo(k*10,-8);x.lineTo(k*14,-12);x.moveTo(k*10,-8);x.lineTo(k*6,-14);x.stroke();}
  x.restore();}
function kelp(x,cx,cy,s){x.save();x.translate(cx,cy);x.scale(s,s);x.strokeStyle='rgba(70,120,80,.45)';x.lineWidth=2.4;x.lineCap='round';
  for(let k=-1;k<=1;k++){x.beginPath();x.moveTo(k*6,0);x.bezierCurveTo(k*6-8,-10,k*6+8,-18,k*6,-28-k*3);x.stroke();}x.restore();}
function wave(x,px,py){x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+10,py-7,px+20,py);x.quadraticCurveTo(px+30,py+7,px+40,py);x.stroke();}
function shadowE(x,cx,cy,rx,ry){x.fillStyle='rgba(60,50,30,.16)';x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,TAU);x.fill();}
function strokeInk(x,w=1.6){x.strokeStyle='rgba(70,55,35,.55)';x.lineWidth=w;x.stroke();}
function tent(x,cx,cy,w,h,col,door){x.fillStyle=col;x.beginPath();x.moveTo(cx-w/2,cy);x.lineTo(cx,cy-h);x.lineTo(cx+w/2,cy);x.closePath();x.fill();strokeInk(x);
  x.fillStyle=door||ART.shade(col,.62);x.beginPath();x.moveTo(cx-w*.12,cy);x.lineTo(cx,cy-h*.7);x.lineTo(cx+w*.12,cy);x.fill();}
function pennant(x,cx,cy,h,col){x.strokeStyle='#6e4a30';x.lineWidth=3;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx,cy-h);x.stroke();x.fillStyle=col;x.beginPath();x.moveTo(cx,cy-h);x.lineTo(cx+22,cy-h+7);x.lineTo(cx,cy-h+14);x.fill();}
function crate(x,cx,cy,s,col='#b8926a'){x.fillStyle=col;x.fillRect(cx-s/2,cy-s,s,s);x.strokeStyle='rgba(70,55,35,.5)';x.lineWidth=1.4;x.strokeRect(cx-s/2,cy-s,s,s);x.beginPath();x.moveTo(cx-s/2,cy-s);x.lineTo(cx+s/2,cy);x.stroke();}
function egg(x,cx,cy,r,col){x.fillStyle=col;x.beginPath();x.ellipse(cx,cy-r*1.2,r,r*1.3,0,0,TAU);x.fill();strokeInk(x,1.2);x.fillStyle='rgba(120,90,60,.35)';x.beginPath();x.arc(cx-r*.3,cy-r*1.5,r*.18,0,TAU);x.arc(cx+r*.35,cy-r*.9,r*.14,0,TAU);x.fill();}
function nestRing(x,cx,cy,rx,ry){x.fillStyle='#9a7448';x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,TAU);x.fill();x.fillStyle='#7a5a38';x.beginPath();x.ellipse(cx,cy-2,rx*.72,ry*.6,0,0,TAU);x.fill();
  x.strokeStyle='#c9a36d';x.lineWidth=2;for(let i=0;i<14;i++){const a=i/14*TAU;x.beginPath();x.moveTo(cx+Math.cos(a)*rx*.7,cy+Math.sin(a)*ry*.7);x.lineTo(cx+Math.cos(a+.5)*rx*1.02,cy+Math.sin(a+.5)*ry*1.02);x.stroke();}}
function ammoShell(x,cx,cy,r,col='#e9c79a'){x.fillStyle=col;x.beginPath();x.arc(cx,cy,r,0,TAU);x.fill();strokeInk(x,1.4);
  x.strokeStyle='rgba(120,80,40,.6)';x.lineWidth=1.3;x.beginPath();for(let t=0;t<12;t+=.2){const rr2=r*(1-t/13);const px=cx+Math.cos(t)*rr2*.9,py=cy+Math.sin(t)*rr2*.9;t?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();
  for(let i=0;i<10;i++){const a=i/10*TAU;x.beginPath();x.moveTo(cx+Math.cos(a)*r*.55,cy+Math.sin(a)*r*.55);x.lineTo(cx+Math.cos(a)*r*.95,cy+Math.sin(a)*r*.95);x.stroke();}}
function buoy(x,cx,cy){x.fillStyle='rgba(30,60,80,.2)';x.beginPath();x.ellipse(cx+3,cy+4,40,12,0,0,TAU);x.fill();
  x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=2;x.beginPath();x.ellipse(cx,cy+2,48,14,0,0,TAU);x.stroke();
  x.fillStyle='#b08a5c';x.beginPath();x.ellipse(cx,cy,36,11,0,0,TAU);x.fill();strokeInk(x,1.4);x.fillStyle='#c9a375';x.beginPath();x.ellipse(cx,cy-3,32,8,0,0,TAU);x.fill();
  x.strokeStyle='rgba(90,65,40,.5)';x.lineWidth=1;for(let i=-2;i<=2;i++){x.beginPath();x.moveTo(cx+i*11,cy-10);x.lineTo(cx+i*11,cy+4);x.stroke();}}
function lifering(x,cx,cy,r){x.lineWidth=r*.5;for(let i=0;i<4;i++){x.strokeStyle=i%2?'#fff8ee':'#c8553d';x.beginPath();x.arc(cx,cy,r,i*Math.PI/2,(i+1)*Math.PI/2);x.stroke();}}

/* ---------------- Wahrzeichen (gemalt) ---------------- */
function landmarkMuseum(x,cx,cy){
  shadowE(x,cx+10,cy+4,110,20);
  x.fillStyle='#e8dcc0';x.fillRect(cx-90,cy-10,180,14);x.strokeStyle='rgba(70,55,35,.5)';x.strokeRect(cx-90,cy-10,180,14);
  x.fillStyle='#f3ead6';x.fillRect(cx-80,cy-80,160,70);
  for(let i=0;i<6;i++){x.fillStyle='#fbf6ea';x.fillRect(cx-74+i*28,cy-76,14,66);x.strokeStyle='rgba(70,55,35,.35)';x.lineWidth=1.2;x.strokeRect(cx-74+i*28,cy-76,14,66);}
  x.fillStyle='#d9c49a';x.beginPath();x.moveTo(cx-96,cy-80);x.lineTo(cx,cy-128);x.lineTo(cx+96,cy-80);x.closePath();x.fill();strokeInk(x);
  x.fillStyle='#c8a86a';x.beginPath();x.arc(cx,cy-96,10,0,TAU);x.fill();
  x.fillStyle='#8a6d4a';x.fillRect(cx-12,cy-40,24,30);
  x.strokeStyle='#8a6d4a';x.lineWidth=3;x.beginPath();x.moveTo(cx+96,cy-80);x.lineTo(cx+96,cy-140);x.stroke();x.fillStyle='#c8553d';x.beginPath();x.moveTo(cx+96,cy-140);x.lineTo(cx+126,cy-132);x.lineTo(cx+96,cy-124);x.fill();
}
function landmarkCamp(x,cx,cy){
  shadowE(x,cx+10,cy+2,70,14);
  x.fillStyle='#d98b5f';x.beginPath();x.moveTo(cx-60,cy);x.lineTo(cx,cy-86);x.lineTo(cx+60,cy);x.closePath();x.fill();strokeInk(x);
  x.fillStyle='#8a4f35';x.beginPath();x.moveTo(cx-14,cy);x.lineTo(cx,cy-60);x.lineTo(cx+14,cy);x.fill();
  x.strokeStyle='#6e4a30';x.lineWidth=3;x.beginPath();x.moveTo(cx,cy-86);x.lineTo(cx,cy-104);x.stroke();x.fillStyle='#e9c46a';x.beginPath();x.moveTo(cx,cy-104);x.lineTo(cx+20,cy-98);x.lineTo(cx,cy-92);x.fill();
  const fx=cx+80,fy=cy+6;x.fillStyle='#8a6d4a';x.fillRect(fx-16,fy-3,32,6);x.fillStyle='#e07a4a';x.beginPath();x.moveTo(fx-10,fy-2);x.quadraticCurveTo(fx,fy-34,fx+10,fy-2);x.fill();
  x.fillStyle='#f5c85a';x.beginPath();x.moveTo(fx-5,fy-2);x.quadraticCurveTo(fx,fy-18,fx+5,fy-2);x.fill();
  x.fillStyle='#b8926a';x.fillRect(cx+26,cy-22,26,22);x.strokeStyle='rgba(70,55,35,.5)';x.lineWidth=1.4;x.strokeRect(cx+26,cy-22,26,22);
}
function landmarkPortal(x,cx,cy){
  shadowE(x,cx,cy+6,110,34);
  for(let i=0;i<9;i++){const a=i/9*TAU,sx=cx+Math.cos(a)*100,sy=cy+Math.sin(a)*34;x.fillStyle=i%2?'#b9ad98':'#a89c86';x.beginPath();x.moveTo(sx-10,sy);x.lineTo(sx-8,sy-40);x.quadraticCurveTo(sx,sy-48,sx+8,sy-40);x.lineTo(sx+10,sy);x.closePath();x.fill();strokeInk(x,1.2);}
}
function landmarkRun(x,cx,cy){
  shadowE(x,cx,cy+2,60,10);
  x.strokeStyle='#8a6d4a';x.lineWidth=4;x.beginPath();x.moveTo(cx-40,cy);x.lineTo(cx-40,cy-70);x.moveTo(cx+40,cy);x.lineTo(cx+40,cy-70);x.stroke();
  x.fillStyle='#f3ead6';x.fillRect(cx-44,cy-78,88,22);x.strokeStyle='rgba(70,55,35,.5)';x.lineWidth=1.4;x.strokeRect(cx-44,cy-78,88,22);
  for(let i=0;i<8;i++){x.fillStyle=i%2?'#3d3226':'#fffaf0';x.fillRect(cx-44+i*11,cy-78,11,11);}
  x.font='20px "Patrick Hand"';x.fillStyle='#3d3226';x.textAlign='center';x.fillText('START',cx,cy-60);
}
function landmarkDig(x,cx,cy){
  x.fillStyle='#b8926a';x.beginPath();x.ellipse(cx,cy,78,34,0,0,TAU);x.fill();x.fillStyle='#a07a52';x.beginPath();x.ellipse(cx,cy+4,62,24,0,0,TAU);x.fill();
  x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=1.2;for(let i=-2;i<=2;i++){x.beginPath();x.moveTo(cx+i*24,cy-30);x.lineTo(cx+i*24,cy+30);x.stroke();}x.beginPath();x.moveTo(cx-70,cy);x.lineTo(cx+70,cy);x.stroke();
  x.strokeStyle='#efe4cc';x.lineWidth=6;x.lineCap='round';x.beginPath();x.moveTo(cx-30,cy+6);x.lineTo(cx+10,cy-4);x.moveTo(cx+18,cy+8);x.lineTo(cx+36,cy+14);x.stroke();
  x.strokeStyle='#8a6d4a';x.lineWidth=4;x.beginPath();x.moveTo(cx+70,cy-10);x.lineTo(cx+96,cy-60);x.stroke();x.fillStyle='#9aa7b5';x.beginPath();x.moveTo(cx+90,cy-66);x.lineTo(cx+108,cy-62);x.lineTo(cx+100,cy-50);x.fill();
}
function landmarkScale(x,cx,cy){
  shadowE(x,cx,cy+2,70,10);
  x.strokeStyle='#7a5a3a';x.lineWidth=6;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx,cy-70);x.stroke();x.lineWidth=5;x.beginPath();x.moveTo(cx-70,cy-66);x.lineTo(cx+70,cy-74);x.stroke();
  x.fillStyle='#d9b36c';x.beginPath();x.ellipse(cx-70,cy-40,26,8,0,0,TAU);x.fill();strokeInk(x);x.beginPath();x.ellipse(cx+70,cy-48,26,8,0,0,TAU);x.fill();strokeInk(x);
  x.strokeStyle='#7a5a3a';x.lineWidth=1.4;x.beginPath();x.moveTo(cx-70,cy-66);x.lineTo(cx-92,cy-42);x.moveTo(cx-70,cy-66);x.lineTo(cx-48,cy-42);x.moveTo(cx+70,cy-74);x.lineTo(cx+48,cy-50);x.moveTo(cx+70,cy-74);x.lineTo(cx+92,cy-50);x.stroke();
}
function landmarkPuzzle(x,cx,cy){
  const cols=['#8fbccb','#e9b48a','#b58cbd','#8fbf7a'];
  [[-40,0,.3],[10,-14,-.2],[48,6,.5],[-6,22,-.4]].forEach(([dx,dy,r],i)=>{x.save();x.translate(cx+dx,cy+dy);x.rotate(r);shadowE(x,4,14,24,6);x.fillStyle=cols[i];
    x.beginPath();x.moveTo(-18,-14);x.lineTo(-4,-14);x.arc(0,-16,5,Math.PI,0);x.lineTo(18,-14);x.lineTo(18,-2);x.arc(20,2,5,-Math.PI/2,Math.PI/2);x.lineTo(18,14);x.lineTo(-18,14);x.closePath();x.fill();strokeInk(x,1.3);x.restore();});
}
function landmarkFeed(x,cx,cy){
  shadowE(x,cx,cy+2,56,10);
  x.fillStyle='#b08a5c';x.beginPath();x.moveTo(cx-50,cy-24);x.lineTo(cx+50,cy-24);x.lineTo(cx+40,cy);x.lineTo(cx-40,cy);x.closePath();x.fill();strokeInk(x);
  x.fillStyle='#8fb77a';for(let i=0;i<7;i++){x.beginPath();x.ellipse(cx-36+i*12,cy-28,9,6,i,0,TAU);x.fill();}
  x.fillStyle='#c8553d';x.beginPath();x.arc(cx+10,cy-32,6,0,TAU);x.fill();x.fillStyle='#d9a03f';x.beginPath();x.arc(cx-12,cy-32,6,0,TAU);x.fill();
}
/* frühere Baustellen, jetzt echte Orte */
function lmLiane(x,cx,cy){shadowE(x,cx+4,cy+3,64,11);
  [[-46,-96],[34,-92]].forEach(([dx,h])=>{x.fillStyle='#8a6a48';x.beginPath();x.moveTo(cx+dx,cy);x.lineTo(cx+dx+2,cy+h);x.lineTo(cx+dx+14,cy+h);x.lineTo(cx+dx+14,cy);x.closePath();x.fill();strokeInk(x,1.3);});
  x.strokeStyle='#5f8f4a';x.lineWidth=7;x.lineCap='round';x.beginPath();x.moveTo(cx-40,cy-90);x.quadraticCurveTo(cx,cy-140,cx+42,cy-88);x.stroke();
  x.lineWidth=2.4;[[-26,-104,40],[-6,-112,52],[16,-108,44],[30,-98,30]].forEach(([dx,dy,l])=>{x.beginPath();x.moveTo(cx+dx,cy+dy);x.quadraticCurveTo(cx+dx+6,cy+dy+l/2,cx+dx,cy+dy+l);x.stroke();});
  for(let i=0;i<12;i++){const t=i/11,px=cx-44+t*88,py=cy-90-Math.sin(t*Math.PI)*36;x.fillStyle=i%2?'#7fb069':'#6a9a58';x.beginPath();x.ellipse(px,py,11,6,t*2,0,TAU);x.fill();}
  x.fillStyle='#e07a8a';x.beginPath();x.arc(cx-10,cy-120,4,0,TAU);x.arc(cx+22,cy-116,4,0,TAU);x.fill();}
function lmLager(x,cx,cy){shadowE(x,cx+6,cy+3,80,12);tent(x,cx-30,cy,70,62,'#d9b36c');tent(x,cx+36,cy+8,54,46,'#8fb07a');pennant(x,cx-30,cy-62,26,'#c8553d');
  crate(x,cx+76,cy+8,20);crate(x,cx+62,cy+10,14,'#a57f58');x.fillStyle='#8a6d4a';x.fillRect(cx-86,cy+2,26,5);}
function lmKlang(x,cx,cy){const cols=['#b9c7d6','#d9b36c','#b58cbd','#8fbccb','#e7a17a'];shadowE(x,cx+6,cy+3,70,10);
  cols.forEach((c,i)=>{const h=30+i*9,px=cx-52+i*26;x.fillStyle=c;x.beginPath();x.moveTo(px-10,cy);x.quadraticCurveTo(px-12,cy-h,px,cy-h-6);x.quadraticCurveTo(px+12,cy-h,px+10,cy);x.closePath();x.fill();strokeInk(x,1.3);
    x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.ellipse(px-3,cy-h+6,3,6,0,0,TAU);x.fill();});
  x.fillStyle='#4a3b2a';x.strokeStyle='#4a3b2a';x.lineWidth=2;[[cx+64,cy-50],[cx+80,cy-66]].forEach(([a,b])=>{x.beginPath();x.ellipse(a,b,5,4,-.4,0,TAU);x.fill();x.beginPath();x.moveTo(a+4,b);x.lineTo(a+4,b-20);x.lineTo(a+10,b-16);x.stroke();});}
function lmPavillon(x,cx,cy){shadowE(x,cx+6,cy+3,62,12);x.strokeStyle='#8a6d4a';x.lineWidth=4;[-44,-15,15,44].forEach(d=>{x.beginPath();x.moveTo(cx+d,cy);x.lineTo(cx+d,cy-58);x.stroke();});
  x.fillStyle='#f3ead6';x.fillRect(cx-40,cy-50,80,36);x.strokeStyle='rgba(70,55,35,.4)';x.lineWidth=1.2;x.strokeRect(cx-40,cy-50,80,36);
  ['#e9c98a','#8fbccb','#e7a17a','#b58cbd','#8fbf7a'].forEach((c,i)=>{x.fillStyle=c;x.fillRect(cx-34+i*14,cy-44+(i%2)*6,11,16);});
  for(let i=0;i<6;i++){x.fillStyle=i%2?'#fff5e6':'#c8553d';x.beginPath();x.moveTo(cx,cy-96);x.lineTo(cx-56+i*18.6,cy-58);x.lineTo(cx-56+(i+1)*18.6,cy-58);x.closePath();x.fill();}
  x.beginPath();x.moveTo(cx,cy-96);x.lineTo(cx-56,cy-58);x.lineTo(cx+56,cy-58);x.closePath();strokeInk(x);x.fillStyle='#f0c35a';x.beginPath();x.arc(cx,cy-98,5,0,TAU);x.fill();}
function lmKino(x,cx,cy){shadowE(x,cx+6,cy+3,74,12);x.strokeStyle='#6e5a44';x.lineWidth=3;x.beginPath();x.moveTo(cx+10,cy);x.lineTo(cx+10,cy-78);x.moveTo(cx+86,cy);x.lineTo(cx+86,cy-78);x.stroke();
  x.fillStyle='#fbf7ee';x.fillRect(cx+6,cy-80,84,50);strokeInk(x);x.strokeRect(cx+6,cy-80,84,50);
  x.fillStyle='rgba(61,50,38,.75)';x.beginPath();x.ellipse(cx+50,cy-50,14,7,0,0,TAU);x.fill();x.lineWidth=4;x.strokeStyle='rgba(61,50,38,.75)';x.beginPath();x.moveTo(cx+60,cy-52);x.quadraticCurveTo(cx+72,cy-72,cx+78,cy-70);x.moveTo(cx+38,cy-50);x.lineTo(cx+22,cy-46);x.moveTo(cx+44,cy-44);x.lineTo(cx+44,cy-36);x.moveTo(cx+56,cy-44);x.lineTo(cx+56,cy-36);x.stroke();
  for(let i=0;i<5;i++){x.fillStyle=i%2?'#f3ead6':'#b58cbd';x.beginPath();x.moveTo(cx-40,cy-70);x.lineTo(cx-74+i*14,cy);x.lineTo(cx-74+(i+1)*14,cy);x.closePath();x.fill();}
  x.beginPath();x.moveTo(cx-40,cy-70);x.lineTo(cx-74,cy);x.lineTo(cx-4,cy);x.closePath();strokeInk(x);pennant(x,cx-40,cy-70,20,'#f0c35a');}
function lmShed(x,cx,cy){shadowE(x,cx+8,cy+3,66,12);x.fillStyle='#c9a375';x.fillRect(cx-46,cy-54,92,54);x.strokeStyle='rgba(90,65,40,.45)';x.lineWidth=1.2;for(let i=1;i<8;i++){x.beginPath();x.moveTo(cx-46+i*11.5,cy-54);x.lineTo(cx-46+i*11.5,cy);x.stroke();}
  x.strokeStyle='rgba(70,55,35,.55)';x.strokeRect(cx-46,cy-54,92,54);x.fillStyle='#8a5e3a';x.beginPath();x.moveTo(cx-56,cy-50);x.lineTo(cx-6,cy-84);x.lineTo(cx+56,cy-56);x.lineTo(cx+56,cy-48);x.lineTo(cx-56,cy-42);x.closePath();x.fill();strokeInk(x);
  x.fillStyle='#6e4a30';x.fillRect(cx-12,cy-34,24,34);x.fillStyle='#e9dcc0';x.fillRect(cx+18,cy-40,18,14);
  x.strokeStyle='#8a6d4a';x.lineWidth=3;x.beginPath();x.moveTo(cx+56,cy+4);x.lineTo(cx+64,cy-14);x.lineTo(cx+86,cy-14);x.lineTo(cx+92,cy+4);x.stroke();
  x.strokeStyle='#efe4cc';x.lineWidth=3;x.lineCap='round';x.beginPath();x.moveTo(cx+62,cy-22);x.quadraticCurveTo(cx+76,cy-34,cx+90,cy-26);x.stroke();}
function lmKita(x,cx,cy){x.fillStyle='#e7d3a2';x.beginPath();x.ellipse(cx,cy-6,70,26,0,0,TAU);x.fill();
  nestRing(x,cx-12,cy-6,30,12);egg(x,cx-22,cy-4,7,'#fff5e0');egg(x,cx-6,cy-6,7,'#f0c3cf');egg(x,cx+4,cy-2,6,'#cfe0ea');
  x.strokeStyle='#8a6d4a';x.lineWidth=2.4;for(let i=0;i<=12;i++){const a=Math.PI*.95+i/12*Math.PI*1.1,px=cx+Math.cos(a)*78,py=cy-6+Math.sin(a)*30;x.beginPath();x.moveTo(px,py);x.lineTo(px,py-16);x.stroke();}
  x.lineWidth=2;x.beginPath();x.ellipse(cx,cy-18,78,30,0,Math.PI*.95,Math.PI*2.05);x.stroke();
  x.fillStyle='#e7a17a';x.beginPath();x.moveTo(cx+34,cy-8);x.lineTo(cx+54,cy-40);x.lineTo(cx+62,cy-40);x.lineTo(cx+44,cy-6);x.closePath();x.fill();strokeInk(x,1.2);
  x.strokeStyle='#8a6d4a';x.lineWidth=2.4;x.beginPath();x.moveTo(cx+62,cy-40);x.lineTo(cx+64,cy-8);x.stroke();}
/* Wüstenland */
function lmSpuren(x,cx,cy){x.fillStyle='rgba(120,85,50,.55)';for(let i=0;i<7;i++){const px=cx-70+i*24,py=cy-8+(i%2?-8:8)+Math.sin(i)*4;x.save();x.translate(px,py);x.rotate(-.2);
  x.beginPath();x.ellipse(0,0,4,5,0,0,TAU);x.fill();[[-6,-8],[0,-10],[6,-8]].forEach(([a,b])=>{x.beginPath();x.moveTo(0,-2);x.lineTo(a,b);x.lineWidth=2.4;x.strokeStyle='rgba(120,85,50,.55)';x.stroke();});x.restore();}
  pennant(x,cx+100,cy,40,'#c8553d');}
function lmTracker(x,cx,cy){shadowE(x,cx+6,cy+3,40,9);x.strokeStyle='#7a6a58';x.lineWidth=3;x.beginPath();x.moveTo(cx-18,cy);x.lineTo(cx,cy-96);x.lineTo(cx+18,cy);x.stroke();
  x.lineWidth=1.4;for(let i=1;i<6;i++){const y=cy-i*16,w=18*(1-i/6.2);x.beginPath();x.moveTo(cx-w,y);x.lineTo(cx+w,y-8);x.stroke();}
  x.fillStyle='#e9e3d6';x.beginPath();x.ellipse(cx+8,cy-100,20,12,-.6,0,TAU);x.fill();strokeInk(x);x.strokeStyle='#c8553d';x.lineWidth=2;x.beginPath();x.moveTo(cx+8,cy-100);x.lineTo(cx+22,cy-112);x.stroke();
  x.strokeStyle='rgba(200,85,61,.5)';x.lineWidth=2;[10,18].forEach(r=>{x.beginPath();x.arc(cx+24,cy-114,r,-1.2,.2);x.stroke();});
  crate(x,cx+40,cy+2,20,'#9fb0a0');}
function lmEier(x,cx,cy){shadowE(x,cx+4,cy+4,60,14);nestRing(x,cx,cy-4,56,22);egg(x,cx-24,cy-2,11,'#fbf1dc');egg(x,cx,cy-8,13,'#e9d7b0');egg(x,cx+24,cy-2,11,'#d8e7cf');egg(x,cx+8,cy+6,9,'#f3d1c0');}
function lmNest(x,cx,cy){shadowE(x,cx+4,cy+4,70,14);nestRing(x,cx,cy-4,66,26);x.strokeStyle='#8a6a48';x.lineWidth=3;x.lineCap='round';
  for(let i=0;i<7;i++){x.beginPath();x.moveTo(cx+60+i*4,cy+6-i*2);x.lineTo(cx+96-i*2,cy-6+i*3);x.stroke();}
  x.fillStyle='#8fae6a';x.beginPath();x.ellipse(cx-50,cy-24,14,8,.4,0,TAU);x.fill();x.beginPath();x.ellipse(cx-40,cy-30,12,6,-.3,0,TAU);x.fill();}
/* Eisland */
function lmMemory(x,cx,cy){shadowE(x,cx+6,cy+4,76,12);for(let r=0;r<2;r++)for(let c=0;c<3;c++){const px=cx-60+c*42,py=cy-50+r*30;
  x.fillStyle='rgba(205,228,238,.95)';x.fillRect(px,py,34,26);x.strokeStyle='rgba(80,120,140,.6)';x.lineWidth=1.4;x.strokeRect(px,py,34,26);
  x.fillStyle='rgba(255,255,255,.7)';x.fillRect(px+3,py+3,10,5);x.fillStyle='#5f7f95';x.font='18px "Patrick Hand"';x.textAlign='center';x.fillText((r+c)%2?'?':'★',px+17,py+20);}}
function lmGross(x,cx,cy){shadowE(x,cx+4,cy+3,40,8);const H=130;for(let i=0;i<8;i++){x.fillStyle=i%2?'#fbfaf5':'#c8553d';x.fillRect(cx-7,cy-H+i*H/8,14,H/8);}x.strokeStyle='rgba(70,55,35,.6)';x.lineWidth=1.4;x.strokeRect(cx-7,cy-H,14,H);
  x.fillStyle='#4f6f8a';x.beginPath();x.arc(cx+28,cy-34,6,0,TAU);x.fill();x.fillRect(cx+23,cy-28,10,20);x.fillRect(cx+23,cy-10,4,10);x.fillRect(cx+29,cy-10,4,10);
  x.fillStyle='rgba(120,90,60,.5)';x.beginPath();x.ellipse(cx+62,cy-4,20,12,0,0,TAU);x.fill();[[-14,-14],[0,-18],[14,-14]].forEach(([a,b])=>{x.beginPath();x.ellipse(cx+62+a,cy-4+b,5,7,a*.04,0,TAU);x.fill();});}
function lmSchatten(x,cx,cy){shadowE(x,cx+4,cy+3,60,10);x.strokeStyle='#6e5a44';x.lineWidth=3;x.beginPath();x.moveTo(cx-40,cy);x.lineTo(cx-40,cy-80);x.moveTo(cx+40,cy);x.lineTo(cx+40,cy-80);x.stroke();
  x.fillStyle='#fbf3e0';x.fillRect(cx-40,cy-80,80,58);strokeInk(x);x.strokeRect(cx-40,cy-80,80,58);
  x.fillStyle='rgba(50,45,60,.8)';x.beginPath();x.ellipse(cx-2,cy-46,18,9,0,0,TAU);x.fill();x.lineWidth=6;x.strokeStyle='rgba(50,45,60,.8)';x.lineCap='round';x.beginPath();x.moveTo(cx+12,cy-50);x.quadraticCurveTo(cx+24,cy-70,cx+30,cy-66);x.moveTo(cx-16,cy-46);x.lineTo(cx-30,cy-40);x.moveTo(cx-8,cy-40);x.lineTo(cx-8,cy-30);x.moveTo(cx+6,cy-40);x.lineTo(cx+6,cy-30);x.stroke();
  x.fillStyle='#f0c35a';x.beginPath();x.arc(cx-70,cy-70,12,0,TAU);x.fill();x.strokeStyle='#f0c35a';x.lineWidth=2;for(let i=0;i<8;i++){const a=i/8*TAU;x.beginPath();x.moveTo(cx-70+Math.cos(a)*16,cy-70+Math.sin(a)*16);x.lineTo(cx-70+Math.cos(a)*22,cy-70+Math.sin(a)*22);x.stroke();}}
function lmKamera(x,cx,cy){shadowE(x,cx+4,cy+3,50,9);x.strokeStyle='#6e5a44';x.lineWidth=2.4;x.beginPath();x.moveTo(cx,cy-40);x.lineTo(cx-16,cy);x.moveTo(cx,cy-40);x.lineTo(cx+16,cy);x.moveTo(cx,cy-40);x.lineTo(cx+2,cy+2);x.stroke();
  x.fillStyle='#4a3b2a';rr(x,cx-18,cy-62,36,24,5);x.fill();x.fillStyle='#8fbccb';x.beginPath();x.arc(cx+14,cy-50,9,0,TAU);x.fill();x.strokeStyle='#2f2519';x.lineWidth=2;x.stroke();x.fillStyle='#e9dcc0';x.fillRect(cx-12,cy-68,10,6);
  x.fillStyle='#7f9f6a';x.beginPath();x.moveTo(cx+40,cy);x.quadraticCurveTo(cx+62,cy-58,cx+90,cy);x.closePath();x.fill();strokeInk(x,1.2);x.fillStyle='#4a3b2a';x.beginPath();x.ellipse(cx+64,cy-18,9,6,0,0,TAU);x.fill();}
/* Vulkanland */
function lmRennen(x,cx,cy){x.strokeStyle='rgba(70,55,35,.3)';x.lineWidth=34;x.beginPath();x.ellipse(cx,cy,120,52,0,0,TAU);x.stroke();x.strokeStyle='#c9a67e';x.lineWidth=28;x.stroke();
  x.strokeStyle='rgba(255,250,235,.8)';x.lineWidth=2;x.setLineDash([10,10]);x.stroke();x.setLineDash([]);
  x.fillStyle='#9faa78';x.beginPath();x.ellipse(cx,cy,104,38,0,0,TAU);x.fill();
  for(let i=0;i<6;i++){x.fillStyle=i%2?'#3d3226':'#fffaf0';x.fillRect(cx-6,cy+38+i*4.6,12,4.6);}
  [[-60,-60,'#c8553d'],[60,-60,'#f0c35a'],[0,-66,'#8fbccb']].forEach(([a,b,c])=>pennant(x,cx+a,cy+b+30,30,c));}
function lmVulkanCamp(x,cx,cy){shadowE(x,cx+6,cy+3,64,11);tent(x,cx-16,cy,70,56,'#e07a4a');crate(x,cx+36,cy+2,20);
  x.strokeStyle='#6e4a30';x.lineWidth=3;x.beginPath();x.moveTo(cx+62,cy+2);x.lineTo(cx+62,cy-46);x.stroke();x.fillStyle='#f3ead6';x.fillRect(cx+46,cy-66,32,24);strokeInk(x,1.2);x.strokeRect(cx+46,cy-66,32,24);
  x.fillStyle='#e07a4a';x.beginPath();x.moveTo(cx+62,cy-46);x.quadraticCurveTo(cx+52,cy-54,cx+60,cy-64);x.quadraticCurveTo(cx+64,cy-56,cx+70,cy-60);x.quadraticCurveTo(cx+72,cy-50,cx+62,cy-46);x.fill();
  x.fillStyle='#f0c35a';x.beginPath();x.ellipse(cx-50,cy+4,12,7,0,Math.PI,0);x.fill();strokeInk(x,1);}
function lmEndlos(x,cx,cy){x.strokeStyle='#ecdcb4';x.lineWidth=22;x.lineCap='round';x.beginPath();x.moveTo(cx-40,cy+10);x.quadraticCurveTo(cx+40,cy-10,cx+110,cy-30);x.stroke();x.lineWidth=10;x.beginPath();x.moveTo(cx+110,cy-30);x.lineTo(cx+150,cy-40);x.stroke();
  shadowE(x,cx+4,cy+3,30,8);x.strokeStyle='#7a5a3a';x.lineWidth=4;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx,cy-74);x.stroke();
  [['#8fbccb',-68,1],['#e7a17a',-50,-1],['#8fbf7a',-32,1]].forEach(([c,y,d])=>{x.fillStyle=c;x.beginPath();x.moveTo(cx,y+cy-8);x.lineTo(cx+d*34,y+cy-8);x.lineTo(cx+d*44,y+cy);x.lineTo(cx+d*34,y+cy+8);x.lineTo(cx,y+cy+8);x.closePath();x.fill();strokeInk(x,1.2);});}
/* Fossilienebene */
function lmWiegross(x,cx,cy){shadowE(x,cx+10,cy+3,90,12);const H=150;x.fillStyle='#e9d7b0';x.fillRect(cx-8,cy-H,16,H);x.strokeStyle='rgba(70,55,35,.6)';x.lineWidth=1.4;x.strokeRect(cx-8,cy-H,16,H);
  for(let i=1;i<10;i++){x.beginPath();x.moveTo(cx-8,cy-i*15);x.lineTo(cx+(i%2?0:6),cy-i*15);x.stroke();}
  x.fillStyle='#4f6f8a';x.beginPath();x.arc(cx+24,cy-30,5,0,TAU);x.fill();x.fillRect(cx+20,cy-25,8,17);x.fillRect(cx+20,cy-9,3,9);x.fillRect(cx+25,cy-9,3,9);
  x.fillStyle='#f0c35a';rr(x,cx+40,cy-30,58,26,6);x.fill();strokeInk(x,1.2);x.fillStyle='#bfe0ea';for(let i=0;i<4;i++)x.fillRect(cx+45+i*13,cy-26,9,9);x.fillStyle='#3d3226';x.beginPath();x.arc(cx+52,cy-3,5,0,TAU);x.arc(cx+86,cy-3,5,0,TAU);x.fill();}
function lmWerbinich(x,cx,cy){shadowE(x,cx+4,cy+4,50,11);x.fillStyle='#b9ad98';x.beginPath();x.moveTo(cx-38,cy);x.quadraticCurveTo(cx-44,cy-66,cx-4,cy-76);x.quadraticCurveTo(cx+40,cy-70,cx+38,cy);x.closePath();x.fill();strokeInk(x);
  x.fillStyle='#b58cbd';x.font='56px "Patrick Hand"';x.textAlign='center';x.fillText('?',cx,cy-18);tent(x,cx+72,cy+2,50,40,'#b58cbd');}
function lmBildquiz(x,cx,cy){shadowE(x,cx+4,cy+3,40,8);x.strokeStyle='#7a5a3a';x.lineWidth=3;x.beginPath();x.moveTo(cx-22,cy);x.lineTo(cx,cy-86);x.lineTo(cx+22,cy);x.moveTo(cx,cy-86);x.lineTo(cx+4,cy+2);x.stroke();
  x.fillStyle='#c9a375';x.fillRect(cx-36,cy-80,72,52);x.fillStyle='#bfe0ea';x.fillRect(cx-30,cy-74,60,40);x.fillStyle='#8fbf7a';x.fillRect(cx-30,cy-46,60,12);
  x.fillStyle='#6f9a5a';x.beginPath();x.ellipse(cx+2,cy-52,12,7,0,0,TAU);x.fill();x.lineWidth=4;x.strokeStyle='#6f9a5a';x.beginPath();x.moveTo(cx+10,cy-56);x.quadraticCurveTo(cx+16,cy-70,cx+22,cy-68);x.stroke();
  x.strokeStyle='rgba(70,55,35,.6)';x.lineWidth=1.6;x.strokeRect(cx-36,cy-80,72,52);}
function lmLufwas(x,cx,cy){shadowE(x,cx+4,cy+3,70,9);[['luft',-50,'#e8f1f6'],['land',0,'#cfe0b0'],['wasser',50,'#9ec7d6']].forEach(([k,dx,c],i)=>{
  x.strokeStyle='#7a5a3a';x.lineWidth=3;x.beginPath();x.moveTo(cx+dx,cy);x.lineTo(cx+dx,cy-46);x.stroke();x.fillStyle=c;x.beginPath();x.arc(cx+dx,cy-58,18,0,TAU);x.fill();strokeInk(x,1.2);
  if(i===0){x.fillStyle='#fff';x.beginPath();x.arc(cx+dx-5,cy-58,7,0,TAU);x.arc(cx+dx+5,cy-60,8,0,TAU);x.fill();}
  if(i===1){broadTree(x,cx+dx,cy-46,.4,'#6f9a5a');}
  if(i===2){x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.moveTo(cx+dx-12,cy-56);x.quadraticCurveTo(cx+dx-6,cy-62,cx+dx,cy-56);x.quadraticCurveTo(cx+dx+6,cy-50,cx+dx+12,cy-56);x.stroke();}});}
/* Expeditionsinsel */
function lmPicknick(x,cx,cy){x.save();x.translate(cx,cy);x.scale(1,.5);x.rotate(.3);for(let i=0;i<6;i++)for(let j=0;j<6;j++){x.fillStyle=(i+j)%2?'#fff5e8':'#d9674f';x.fillRect(-48+i*16,-48+j*16,16,16);}x.restore();
  x.fillStyle='#c9a375';rr(x,cx+10,cy-30,34,22,4);x.fill();strokeInk(x,1.2);x.strokeStyle='#8a6d4a';x.lineWidth=2.4;x.beginPath();x.arc(cx+27,cy-30,12,Math.PI,0);x.stroke();
  x.fillStyle='#c8553d';x.beginPath();x.arc(cx-20,cy-8,6,0,TAU);x.fill();x.fillStyle='#f0c35a';x.beginPath();x.ellipse(cx-6,cy+4,9,4,.5,0,TAU);x.fill();x.fillStyle='#8fb77a';x.beginPath();x.arc(cx-30,cy+6,5,0,TAU);x.fill();}
function lmRettung(x,cx,cy){shadowE(x,cx+6,cy+3,56,10);x.fillStyle='#f3ead6';x.fillRect(cx-36,cy-44,72,44);strokeInk(x,1.3);x.strokeRect(cx-36,cy-44,72,44);
  x.fillStyle='#c8553d';x.beginPath();x.moveTo(cx-46,cy-40);x.lineTo(cx,cy-74);x.lineTo(cx+46,cy-40);x.closePath();x.fill();strokeInk(x);x.fillStyle='#8a5e3a';x.fillRect(cx-10,cy-26,20,26);
  x.strokeStyle='#7a5a3a';x.lineWidth=3;x.beginPath();x.moveTo(cx+60,cy+2);x.lineTo(cx+60,cy-60);x.stroke();lifering(x,cx+60,cy-44,11);}
function lmExped(x,cx,cy){shadowE(x,cx+10,cy+3,90,12);tent(x,cx-44,cy,60,52,'#bcae8a');tent(x,cx+10,cy+6,54,46,'#8fb07a');
  x.strokeStyle='#7a5a3a';x.lineWidth=3;[[64,0,54,-90],[96,0,106,-90],[56,-40,104,-40],[58,-70,102,-70]].forEach(([a,b,c,d])=>{x.beginPath();x.moveTo(cx+a,cy+b);x.lineTo(cx+c,cy+d);x.stroke();});
  x.fillStyle='#c9a375';x.fillRect(cx+50,cy-100,60,14);strokeInk(x,1.2);x.strokeRect(cx+50,cy-100,60,14);pennant(x,cx+80,cy-100,30,'#c8553d');}
/* Urzeit-Meer */
function lmRiff(x,cx,cy){const ax=cx+40,ay=cy-10;
  x.fillStyle='rgba(190,235,225,.55)';x.beginPath();x.ellipse(ax,ay,190,105,0,0,TAU);x.fill();
  x.strokeStyle='rgba(240,225,190,.9)';x.lineWidth=22;x.beginPath();x.ellipse(ax,ay,190,105,0,0,TAU);x.stroke();x.strokeStyle='rgba(120,95,60,.3)';x.lineWidth=1.4;x.stroke();
  const cc=[['#f0a08a','#e98fa0'],['#f0c35a','#e7a17a'],['#b58cbd','#e98fa0'],['#e98f7a','#f5c7b0']];
  for(let i=0;i<26;i++){const a=i/26*TAU;coral(x,ax+Math.cos(a)*190,ay+Math.sin(a)*105,1.3,cc[i%4]);}for(let i=0;i<9;i++){const a=i*2.3,r=.35+(i%3)*.18;coral(x,ax+Math.cos(a)*190*r,ay+Math.sin(a)*105*r,1,cc[(i+1)%4]);}
  x.fillStyle='#efe0b4';x.beginPath();x.ellipse(cx,cy+4,62,22,0,0,TAU);x.fill();strokeInk(x,1.2);palm(x,cx+46,cy,1.1);}
function lmSchiff(x,cx,cy){const sx=cx+170,sy=cy+4;buoy(x,cx,cy);
  x.fillStyle='rgba(30,60,80,.22)';x.beginPath();x.ellipse(sx,sy+8,130,18,0,0,TAU);x.fill();
  x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=2;x.beginPath();x.ellipse(sx,sy+6,140,20,0,0,TAU);x.stroke();
  x.fillStyle='#c8553d';x.beginPath();x.moveTo(sx-120,sy-24);x.lineTo(sx+130,sy-24);x.lineTo(sx+104,sy+6);x.lineTo(sx-100,sy+6);x.closePath();x.fill();
  x.fillStyle='#fbf7ee';x.beginPath();x.moveTo(sx-124,sy-48);x.lineTo(sx+136,sy-48);x.lineTo(sx+130,sy-24);x.lineTo(sx-120,sy-24);x.closePath();x.fill();
  x.beginPath();x.moveTo(sx-124,sy-48);x.lineTo(sx+136,sy-48);x.lineTo(sx+104,sy+6);x.lineTo(sx-100,sy+6);x.closePath();strokeInk(x);
  x.fillStyle='#5f7f95';for(let i=0;i<7;i++){x.beginPath();x.arc(sx-90+i*30,sy-36,4,0,TAU);x.fill();}
  x.fillStyle='#f3ead6';x.fillRect(sx-40,sy-88,80,40);strokeInk(x,1.4);x.strokeRect(sx-40,sy-88,80,40);x.fillStyle='#8fbccb';for(let i=0;i<3;i++)x.fillRect(sx-32+i*24,sy-80,16,12);
  x.strokeStyle='#6e4a30';x.lineWidth=4;x.beginPath();x.moveTo(sx+70,sy-48);x.lineTo(sx+70,sy-140);x.moveTo(sx-80,sy-48);x.lineTo(sx-80,sy-120);x.stroke();
  x.lineWidth=2;x.beginPath();x.moveTo(sx+70,sy-140);x.lineTo(sx+130,sy-48);x.moveTo(sx-80,sy-110);x.lineTo(sx-130,sy-60);x.stroke();
  x.fillStyle='#f0c35a';x.fillRect(sx+70,sy-140,26,14);x.fillStyle='#5f7f95';x.fillRect(sx+70,sy-133,26,7);
  x.strokeStyle='rgba(70,55,35,.6)';x.lineWidth=2;x.setLineDash([3,4]);x.beginPath();x.moveTo(sx+120,sy-20);x.lineTo(sx+150,sy+18);x.stroke();x.setLineDash([]);}
function lmTiefsee(x,cx,cy){buoy(x,cx,cy);const bx=cx+140,by=cy+4;
  x.strokeStyle='rgba(180,220,235,.35)';x.lineWidth=3;for(let r=1;r<4;r++){x.beginPath();x.ellipse(cx+120,cy-20,90+r*40,40+r*18,0,0,TAU);x.stroke();}
  x.fillStyle='#8a8f96';x.fillRect(bx-44,by-10,88,14);strokeInk(x,1.2);x.strokeRect(bx-44,by-10,88,14);x.fillStyle='#e0b24a';x.fillRect(bx-40,by-16,20,6);
  x.strokeStyle='#5c5f66';x.lineWidth=4;x.beginPath();x.moveTo(bx-20,by-10);x.lineTo(bx+10,by-70);x.lineTo(bx+34,by-58);x.stroke();x.lineWidth=1.4;x.beginPath();x.moveTo(bx+34,by-58);x.lineTo(bx+34,by+10);x.stroke();
  x.fillStyle='#c9a24a';x.beginPath();x.moveTo(bx+20,by+30);x.quadraticCurveTo(bx+20,by+8,bx+34,by+6);x.quadraticCurveTo(bx+48,by+8,bx+48,by+30);x.closePath();x.fill();strokeInk(x,1.3);
  x.fillStyle='#bfe0ea';x.beginPath();x.arc(bx+34,by+18,5,0,TAU);x.fill();x.fillStyle='rgba(20,50,70,.35)';x.fillRect(bx+14,by+24,40,8);}
function lmFutter(x,cx,cy){x.fillStyle='rgba(30,60,80,.22)';x.beginPath();x.ellipse(cx+4,cy+8,96,22,0,0,TAU);x.fill();x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=2;x.beginPath();x.ellipse(cx,cy+6,104,26,0,0,TAU);x.stroke();
  x.fillStyle='#b08a5c';x.beginPath();x.moveTo(cx-86,cy-8);x.lineTo(cx+86,cy-8);x.lineTo(cx+76,cy+10);x.lineTo(cx-76,cy+10);x.closePath();x.fill();strokeInk(x,1.4);
  x.strokeStyle='rgba(90,65,40,.5)';x.lineWidth=1.2;for(let i=-6;i<=6;i++){x.beginPath();x.moveTo(cx+i*13,cy-8);x.lineTo(cx+i*12,cy+10);x.stroke();}
  [[-64,'#8a6d4a'],[62,'#8a6d4a']].forEach(([dx,c])=>{x.fillStyle=c;rr(x,cx+dx-10,cy-34,20,26,4);x.fill();strokeInk(x,1.2);x.strokeStyle='#5f4a34';x.beginPath();x.moveTo(cx+dx-10,cy-26);x.lineTo(cx+dx+10,cy-26);x.stroke();});
  x.fillStyle='#8fbccb';rr(x,cx+28,cy-24,26,16,4);x.fill();strokeInk(x,1.1);x.fillStyle='#e9967a';x.beginPath();x.ellipse(cx+36,cy-26,6,3,.3,0,TAU);x.ellipse(cx+46,cy-27,6,3,-.3,0,TAU);x.fill();}
function lmPonton(x,cx,cy){x.fillStyle='rgba(30,60,80,.22)';x.beginPath();x.ellipse(cx+4,cy+8,86,20,0,0,TAU);x.fill();
  [-50,50].forEach(dx=>{x.fillStyle='#e7e2d6';rr(x,cx+dx-30,cy-2,60,14,7);x.fill();strokeInk(x,1.2);});x.fillStyle='#9aa7b5';x.fillRect(cx-78,cy-12,156,12);strokeInk(x,1.3);x.strokeRect(cx-78,cy-12,156,12);
  x.strokeStyle='#6e7680';x.lineWidth=2.4;x.beginPath();x.moveTo(cx+70,cy-30);x.lineTo(cx+70,cy+22);x.moveTo(cx+84,cy-30);x.lineTo(cx+84,cy+22);for(let i=0;i<5;i++){x.moveTo(cx+70,cy-24+i*10);x.lineTo(cx+84,cy-24+i*10);}x.stroke();
  x.strokeStyle='#6e4a30';x.lineWidth=3;x.beginPath();x.moveTo(cx-60,cy-12);x.lineTo(cx-60,cy-66);x.stroke();x.fillStyle='#c8553d';x.fillRect(cx-60,cy-66,34,22);x.strokeStyle='#fff8ee';x.lineWidth=4;x.beginPath();x.moveTo(cx-60,cy-66);x.lineTo(cx-26,cy-44);x.stroke();
  x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=1.4;[[96,10,4],[104,0,3],[100,-10,2.4]].forEach(([a,b,r])=>{x.beginPath();x.arc(cx+a,cy+b,r,0,TAU);x.stroke();});}
function lmAmmon(x,cx,cy){x.fillStyle='rgba(255,245,215,.55)';x.beginPath();x.ellipse(cx+20,cy+10,210,82,0,0,TAU);x.fill();
  x.fillStyle='#ecdcb0';x.beginPath();x.ellipse(cx+20,cy+8,190,68,0,0,TAU);x.fill();x.strokeStyle='rgba(120,95,60,.35)';x.lineWidth=1.4;x.stroke();
  x.strokeStyle='rgba(180,150,100,.35)';x.lineWidth=1;for(let i=0;i<5;i++){x.beginPath();x.ellipse(cx+20,cy+8,170-i*30,58-i*10,0,.2,1.4);x.stroke();}
  ammoShell(x,cx+110,cy+6,22);ammoShell(x,cx-80,cy+20,15,'#dfb98a');ammoShell(x,cx+60,cy+36,11,'#e7c7a0');ammoShell(x,cx-120,cy-10,9);}
function compassRose(x,cx,cy){x.save();x.translate(cx,cy);x.globalAlpha=.75;x.strokeStyle='rgba(70,55,35,.6)';x.lineWidth=2;x.beginPath();x.arc(0,0,120,0,TAU);x.stroke();x.beginPath();x.arc(0,0,104,0,TAU);x.stroke();
  for(let i=0;i<8;i++){const a=i/8*TAU-Math.PI/2,L=i%2?70:118;x.fillStyle=i%2?'#d9c49a':(i===0?'#c8553d':'#8fbccb');x.beginPath();x.moveTo(Math.cos(a)*L,Math.sin(a)*L);x.lineTo(Math.cos(a+.35)*22,Math.sin(a+.35)*22);x.lineTo(0,0);x.lineTo(Math.cos(a-.35)*22,Math.sin(a-.35)*22);x.closePath();x.fill();strokeInk(x,1.3);}
  x.fillStyle='#3d3226';x.font='34px "Patrick Hand"';x.textAlign='center';x.fillText('N',0,-126);x.restore();}
function jetty(x,S,E,rowboatSide){const a=Math.atan2(E[1]-S[1],E[0]-S[0]),L=dist(S,E);x.save();x.translate(S[0],S[1]);x.rotate(a);
  x.fillStyle='rgba(30,50,60,.2)';x.fillRect(4,-10,L+6,28);
  x.fillStyle='#6e4a30';for(let i=18;i<=L;i+=34){x.beginPath();x.arc(i,-15,4.5,0,TAU);x.arc(i,15,4.5,0,TAU);x.fill();}
  x.fillStyle='#b8905f';x.fillRect(0,-13,L,26);x.strokeStyle='#7a5a3a';x.lineWidth=1.6;for(let i=6;i<L;i+=10){x.beginPath();x.moveTo(i,-13);x.lineTo(i,13);x.stroke();}
  x.lineWidth=3;x.beginPath();x.moveTo(0,-13);x.lineTo(L,-13);x.moveTo(0,13);x.lineTo(L,13);x.stroke();
  x.fillStyle='#5f4a34';x.beginPath();x.arc(L-6,-17,6,0,TAU);x.fill();x.restore();
  // Rettungsring am Pfosten
  lifering(x,E[0]-Math.cos(a)*12+Math.cos(a-Math.PI/2)*28,E[1]-Math.sin(a)*12+Math.sin(a-Math.PI/2)*28-4,7);
}
function rowboat(x,cx,cy,fl){x.save();x.translate(cx,cy);if(fl)x.scale(-1,1);x.fillStyle='rgba(30,60,80,.2)';x.beginPath();x.ellipse(0,6,46,9,0,0,TAU);x.fill();
  x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=1.6;x.beginPath();x.ellipse(0,5,52,10,0,0,TAU);x.stroke();
  x.fillStyle='#a8774e';x.beginPath();x.moveTo(-40,-10);x.lineTo(44,-12);x.quadraticCurveTo(34,8,24,8);x.lineTo(-30,8);x.quadraticCurveTo(-42,4,-40,-10);x.closePath();x.fill();strokeInk(x,1.3);
  x.fillStyle='#d9b27c';x.fillRect(-36,-12,76,4);x.strokeStyle='#7a5a3a';x.lineWidth=3;x.beginPath();x.moveTo(-8,-10);x.lineTo(-30,10);x.stroke();x.restore();}
/* Mein Forscherhaus: gemütliches Häuschen mit Schornstein */
function lmHaus(x,cx,cy){shadowE(x,cx+8,cy+4,82,14);
  x.fillStyle='#a8724a';x.fillRect(cx+24,cy-104,15,30);strokeInk(x,1.2);x.strokeRect(cx+24,cy-104,15,30);x.fillStyle='#8a5a3a';x.fillRect(cx+22,cy-108,19,6);
  x.fillStyle='#f1dcb0';x.fillRect(cx-52,cy-60,104,60);x.strokeStyle='rgba(70,55,35,.55)';x.lineWidth=1.6;x.strokeRect(cx-52,cy-60,104,60);
  x.strokeStyle='rgba(138,90,58,.55)';x.lineWidth=3;x.beginPath();x.moveTo(cx-52,cy-30);x.lineTo(cx+52,cy-30);x.moveTo(cx-18,cy-60);x.lineTo(cx-18,cy);x.moveTo(cx+18,cy-60);x.lineTo(cx+18,cy);x.stroke();
  x.fillStyle='#c8553d';x.beginPath();x.moveTo(cx-68,cy-54);x.quadraticCurveTo(cx-30,cy-86,cx,cy-106);x.quadraticCurveTo(cx+30,cy-86,cx+68,cy-54);x.closePath();x.fill();strokeInk(x,1.6);
  x.strokeStyle='rgba(120,40,25,.35)';x.lineWidth=1.3;for(let i=1;i<4;i++){const u=i/4;x.beginPath();x.moveTo(cx-68+u*30,cy-54-u*38);x.quadraticCurveTo(cx,cy-60-u*44,cx+68-u*30,cy-54-u*38);x.stroke();}
  x.fillStyle='#fbe7a8';x.beginPath();x.arc(cx,cy-74,8,0,TAU);x.fill();strokeInk(x,1.2);
  x.fillStyle='#8a5a3a';x.beginPath();x.moveTo(cx-11,cy);x.lineTo(cx-11,cy-24);x.quadraticCurveTo(cx,cy-36,cx+11,cy-24);x.lineTo(cx+11,cy);x.closePath();x.fill();strokeInk(x,1.2);
  x.fillStyle='#e9c46a';x.beginPath();x.arc(cx+6,cy-12,1.8,0,TAU);x.fill();
  [[-36,-44],[36,-44]].forEach(([dx,dy])=>{x.fillStyle='#fbe7a8';x.fillRect(cx+dx-9,cy+dy-9,18,18);x.strokeStyle='#8a5a3a';x.lineWidth=2;x.strokeRect(cx+dx-9,cy+dy-9,18,18);
    x.beginPath();x.moveTo(cx+dx,cy+dy-9);x.lineTo(cx+dx,cy+dy+9);x.moveTo(cx+dx-9,cy+dy);x.lineTo(cx+dx+9,cy+dy);x.stroke();
    x.fillStyle='#9a7448';x.fillRect(cx+dx-11,cy+dy+9,22,6);x.fillStyle='#e07a6a';x.beginPath();x.arc(cx+dx-5,cy+dy+8,3,0,TAU);x.arc(cx+dx+4,cy+dy+7,3,0,TAU);x.fill();});
  x.strokeStyle='#b8926a';x.lineWidth=3;for(let i=0;i<5;i++){const px=cx+60+i*12;x.beginPath();x.moveTo(px,cy+4);x.lineTo(px,cy-16);x.stroke();}x.beginPath();x.moveTo(cx+56,cy-10);x.lineTo(cx+112,cy-10);x.stroke();
  flowers(x,cx-66,cy+2,'#f0c3cf');flowers(x,cx-60,cy+10,'#f5e08a');
}
/* Forscher-Ausflug: Wegweiser, Rucksack und aufgerollte Karte */
function lmAusflug(x,cx,cy){shadowE(x,cx+10,cy+3,72,11);
  x.strokeStyle='#7a5a3a';x.lineWidth=6;x.beginPath();x.moveTo(cx-24,cy+2);x.lineTo(cx-24,cy-100);x.stroke();
  [[-92,1,'#e9c98a'],[-72,-1,'#b5c48a'],[-52,1,'#8fbccb']].forEach(([y,d,c])=>{const a=cx-24,L=46;x.fillStyle=c;x.beginPath();
    if(d>0){x.moveTo(a-6,cy+y-8);x.lineTo(a+L,cy+y-8);x.lineTo(a+L+10,cy+y);x.lineTo(a+L,cy+y+8);x.lineTo(a-6,cy+y+8);}else{x.moveTo(a+6,cy+y-8);x.lineTo(a-L,cy+y-8);x.lineTo(a-L-10,cy+y);x.lineTo(a-L,cy+y+8);x.lineTo(a+6,cy+y+8);}
    x.closePath();x.fill();strokeInk(x,1.3);});
  x.fillStyle='#a8724a';rr(x,cx+10,cy-38,34,38,9);x.fill();strokeInk(x,1.3);x.fillStyle='#c69063';rr(x,cx+14,cy-26,26,16,5);x.fill();
  x.strokeStyle='#6e4a30';x.lineWidth=2.5;x.beginPath();x.arc(cx+27,cy-38,7,Math.PI,0);x.stroke();x.fillStyle='#e9c46a';x.beginPath();x.arc(cx+27,cy-18,2.4,0,TAU);x.fill();
  x.save();x.translate(cx+64,cy-4);x.rotate(-.25);x.fillStyle='#f3ead6';rr(x,-20,-7,40,14,6);x.fill();strokeInk(x,1.2);x.strokeStyle='rgba(200,85,61,.7)';x.lineWidth=1.4;x.beginPath();x.moveTo(-12,-3);x.lineTo(6,3);x.stroke();x.restore();
}
function bigVolcano(x){const {x:cx,y:cy,w,h}=VOLCANO;
  x.save();x.translate(cx+40,cy+6);x.scale(1,.2);const sg=x.createRadialGradient(0,0,20,0,0,w*.7);sg.addColorStop(0,'rgba(50,40,30,.3)');sg.addColorStop(1,'rgba(50,40,30,0)');x.fillStyle=sg;x.fillRect(-w,-w,w*2,w*2);x.restore();
  const body=()=>{x.beginPath();x.moveTo(cx-w/2,cy);x.bezierCurveTo(cx-w*.3,cy-h*.12,cx-w*.14,cy-h*.5,cx-w*.09,cy-h);x.quadraticCurveTo(cx,cy-h*1.03,cx+w*.09,cy-h*.99);x.bezierCurveTo(cx+w*.14,cy-h*.5,cx+w*.3,cy-h*.12,cx+w/2,cy);
    for(let i=10;i>=0;i--){const u=i/10;x.lineTo(cx-w/2+u*w,cy+Math.sin(u*17)*6+4);}x.closePath();};
  const g=x.createLinearGradient(cx-w/2,0,cx+w/2,0);g.addColorStop(0,'#978b7c');g.addColorStop(.46,'#7f7366');g.addColorStop(.54,'#645a51');g.addColorStop(1,'#4f463e');
  body();x.fillStyle=g;x.fill();
  x.save();body();x.clip();
  const vg=x.createLinearGradient(0,cy-h,0,cy);vg.addColorStop(0,'rgba(70,40,30,.25)');vg.addColorStop(.6,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(120,140,90,.35)');x.fillStyle=vg;x.fillRect(cx-w,cy-h-20,w*2,h+40);
  for(let i=0;i<14;i++){const u=-1+i/6.5,top=cx+u*w*.07,bot=cx+u*w*.5;x.strokeStyle=i%2?'rgba(40,30,24,.28)':'rgba(255,240,220,.16)';x.lineWidth=i%2?2.2:3;
    x.beginPath();x.moveTo(top,cy-h*.97);x.bezierCurveTo(top+u*30,cy-h*.6,bot-u*40,cy-h*.3,bot,cy+4);x.stroke();}
  x.fillStyle='rgba(40,32,26,.25)';for(let i=0;i<22;i++){const u=Math.sin(i*12.9898)*.5,v=((i*.618)%1);x.beginPath();x.ellipse(cx+u*w*(.2+v*.7),cy-h*(1-v)*.9+10,6+v*6,3+v*2,0,0,TAU);x.fill();}
  x.restore();
  body();strokeInk(x,2);
  x.fillStyle='#3f352e';x.beginPath();x.ellipse(cx,cy-h,w*.095,h*.045,0,0,TAU);x.fill();x.fillStyle='#e0673a';x.beginPath();x.ellipse(cx,cy-h+2,w*.072,h*.028,0,0,TAU);x.fill();x.fillStyle='#f8c860';x.beginPath();x.ellipse(cx,cy-h+2,w*.035,h*.013,0,0,TAU);x.fill();
  x.lineCap='round';x.lineJoin='round';x.strokeStyle='rgba(120,40,20,.3)';x.lineWidth=40;smoothPath(x,LAVA,false);x.stroke();
  x.strokeStyle='#d95a32';x.lineWidth=26;x.stroke();x.strokeStyle='#f3964a';x.lineWidth=14;x.stroke();x.strokeStyle='#f8d26a';x.lineWidth=4;x.setLineDash([18,22]);x.stroke();x.setLineDash([]);
  x.strokeStyle='rgba(60,30,20,.45)';x.lineWidth=1.4;x.beginPath();smoothSub(x,LAVA.map(p=>[p[0]-13,p[1]+3]),false);x.stroke();
}
function lakeDraw(x,L){x.fillStyle='#e7d9b0';x.beginPath();x.ellipse(L.x,L.y,L.rx+16,L.ry+14,0,0,TAU);x.fill();
  x.fillStyle='#8cc3cf';x.beginPath();x.ellipse(L.x,L.y,L.rx,L.ry,0,0,TAU);x.fill();
  x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.ellipse(L.x-L.rx*.25,L.y-L.ry*.25,L.rx*.42,L.ry*.22,-.2,0,TAU);x.fill();
  x.strokeStyle='rgba(80,110,120,.4)';x.lineWidth=2;x.beginPath();x.ellipse(L.x,L.y,L.rx,L.ry,0,0,TAU);x.stroke();}
function bridge(x,A,B,w){x.save();const a=Math.atan2(B[1]-A[1],B[0]-A[0]),L=dist(A,B);x.translate(A[0],A[1]);x.rotate(a);
  x.fillStyle='rgba(60,50,30,.18)';x.fillRect(-4,-w/2+8,L+8,w);x.fillStyle='#b08a5c';x.fillRect(0,-w/2,L,w);
  x.strokeStyle='#7a5a3a';x.lineWidth=2;for(let i=6;i<L;i+=12){x.beginPath();x.moveTo(i,-w/2);x.lineTo(i,w/2);x.stroke();}
  x.lineWidth=4;x.beginPath();x.moveTo(0,-w/2);x.lineTo(L,-w/2);x.moveTo(0,w/2);x.lineTo(L,w/2);x.stroke();x.restore();}
function hangBridge(x,A,B){x.save();const a=Math.atan2(B[1]-A[1],B[0]-A[0]),L=dist(A,B);x.translate(A[0],A[1]);x.rotate(a);
  x.fillStyle='rgba(60,50,30,.18)';x.fillRect(0,4,L,26);
  for(let i=2;i<L-4;i+=11){x.fillStyle=i%22?'#b08a5c':'#a07a4c';x.fillRect(i,-12+Math.sin(i/L*Math.PI)*3,8,24);}
  x.strokeStyle='#8a6d4a';x.lineWidth=2;[-14,14].forEach(o=>{x.beginPath();x.moveTo(0,o);x.quadraticCurveTo(L/2,o+8,L,o);x.stroke();});
  x.strokeStyle='rgba(138,109,74,.6)';x.lineWidth=1;for(let i=10;i<L;i+=18){x.beginPath();x.moveTo(i,-14+Math.sin(i/L*Math.PI)*4);x.lineTo(i,-12);x.stroke();}
  x.fillStyle='#6e4a30';[[0,-16],[0,16],[L,-16],[L,16]].forEach(([a,b])=>{x.beginPath();x.arc(a,b,5,0,TAU);x.fill();});x.restore();}
const ANNING_TOP=(()=>{const p=[];for(let i=0;i<22;i++){const a=i/22*TAU,r=1+Math.sin(i*2.7)*.07+Math.cos(i*1.9)*.05;p.push([4310+Math.cos(a)*185*r,4020+Math.sin(a)*92*r]);}return p;})();
function lmAnning(x,cx,cy){const top=ANNING_TOP,H=46;
  // Klippenwand: Oberkante nach unten verschoben = weiße Kreidewand
  const south=top.filter(p=>p[1]>=4000).sort((a,b)=>a[0]-b[0]);
  x.fillStyle='rgba(60,50,30,.18)';x.beginPath();x.ellipse(4320,4020+H+40,200,26,0,0,TAU);x.fill();
  x.beginPath();x.moveTo(south[0][0],south[0][1]);south.forEach(p=>x.lineTo(p[0],p[1]));for(let i=south.length-1;i>=0;i--){const p=south[i];x.lineTo(p[0]+Math.sin(i*3.1)*3,p[1]+H+Math.sin(i*1.7)*6);}x.closePath();
  const cg=x.createLinearGradient(0,4020,0,4020+H+100);cg.addColorStop(0,'#fbf8f0');cg.addColorStop(1,'#d9d2c2');x.fillStyle=cg;x.fill();strokeInk(x,1.4);
  x.save();x.clip();x.strokeStyle='rgba(150,140,120,.4)';x.lineWidth=1.2;for(let i=0;i<14;i++){const lx=4135+i*27+Math.sin(i*5.3)*9,t=4040+Math.abs(Math.sin(i*2.3))*30;x.beginPath();x.moveTo(lx,t);x.lineTo(lx+Math.sin(i)*4,t+14+Math.abs(Math.cos(i*1.7))*26);x.lineTo(lx+Math.sin(i)*4+3,t+30+Math.abs(Math.cos(i*1.7))*30);x.stroke();}
    x.strokeStyle='rgba(120,110,95,.22)';x.lineWidth=3;[24].forEach(o=>{x.beginPath();south.forEach((p,i)=>i?x.lineTo(p[0],p[1]+o+Math.sin(i*2.1)*3):x.moveTo(p[0],p[1]+o));x.stroke();});x.restore();
  ammoShell(x,4205,4108,8,'#e6dac2');ammoShell(x,4415,4100,6,'#e6dac2');ammoShell(x,4300,4118,5,'#e6dac2');
  // Grasdecke oben
  x.fillStyle='#a9bf7c';smoothPath(x,top);x.fill();strokeInk(x,1.3);x.fillStyle='rgba(200,215,150,.6)';x.beginPath();x.ellipse(4280,4000,110,40,-.1,0,TAU);x.fill();
  [[4230,3990],[4370,4010],[4310,3970],[4180,4030]].forEach(([a,b])=>tuft(x,a,b,'#7f9a55'));
  x.fillStyle='#b08a5c';rr(x,cx+50,cy-14,22,14,4);x.fill();strokeInk(x,1);x.strokeStyle='#8a6d4a';x.lineWidth=2;x.beginPath();x.arc(cx+61,cy-14,8,Math.PI,0);x.stroke();
  rock(x,cx-70,cy,.6,'#d8d0bc');}
/* ---------------- Pflanzen der Trias (keine Blumen, Gräser, Kakteen oder Palmen – die gab es noch nicht) ---------------- */
function palm(x,cx,cy,s){ // Palmfarn (Cycadee): dicker Schuppenstamm, steife gefiederte Wedel
  x.save();x.translate(cx,cy);x.scale(s,s);
  x.fillStyle='rgba(60,50,30,.15)';x.beginPath();x.ellipse(8,2,22,6,0,0,TAU);x.fill();
  x.fillStyle='#8a6d4a';x.beginPath();x.moveTo(-7,0);x.quadraticCurveTo(-9,-14,-6,-24);x.lineTo(6,-24);x.quadraticCurveTo(9,-14,7,0);x.closePath();x.fill();
  x.strokeStyle='rgba(60,40,20,.45)';x.lineWidth=1;for(let i=0;i<5;i++){x.beginPath();x.moveTo(-7,-3-i*4.5);x.lineTo(0,-1-i*4.5);x.lineTo(7,-3-i*4.5);x.stroke();}
  const F=[[-34,-16],[34,-18],[-32,-34],[32,-36],[-18,-50],[20,-52],[0,-58]];
  F.forEach(([fx,fy],i)=>{const c=i%2?'#6f9a50':'#5f8a46';x.strokeStyle=c;x.lineWidth=2.2;x.lineCap='round';x.beginPath();x.moveTo(0,-24);x.quadraticCurveTo(fx*.45,fy-8,fx,fy);x.stroke();
    x.lineWidth=1.4;const dx=fx,dy=fy+24,l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;
    for(let k=1;k<7;k++){const u=k/7,px=fx*u,py=-24+dy*u-(1-u)*u*10,L=6*(1-u*.55);x.beginPath();x.moveTo(px-nx*L,py-ny*L);x.lineTo(px+nx*L+dx/l*2,py+ny*L+dy/l*2);x.stroke();}});
  x.fillStyle='#d9a03f';x.beginPath();x.ellipse(0,-27,5,6,0,0,TAU);x.fill();strokeInk(x,1);
  x.restore();}
function treeFern(x,cx,cy,s){ // Baumfarn
  x.save();x.translate(cx,cy);x.scale(s,s);shadowE(x,8,2,20,6);
  x.strokeStyle='#6e5238';x.lineWidth=4.5;x.lineCap='round';x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(4,-26,-1,-52);x.stroke();
  x.strokeStyle='rgba(50,35,20,.4)';x.lineWidth=1;for(let i=1;i<7;i++){x.beginPath();x.moveTo(-2,-i*7);x.lineTo(3,-i*7-2);x.stroke();}
  const F=[[-38,-38],[38,-40],[-30,-62],[30,-64],[0,-74],[-42,-52],[42,-54]];
  F.forEach(([fx,fy],i)=>{x.fillStyle=i%2?'#7fb069':'#6a9a58';x.beginPath();x.moveTo(-1,-52);x.quadraticCurveTo(fx*.55,fy-16,fx,fy+8);x.quadraticCurveTo(fx*.5,fy-2,-1,-49);x.closePath();x.fill();
    x.strokeStyle='rgba(50,80,40,.5)';x.lineWidth=1;x.beginPath();x.moveTo(-1,-52);x.quadraticCurveTo(fx*.55,fy-12,fx,fy+8);x.stroke();});
  x.strokeStyle='#8fbf72';x.lineWidth=2;x.beginPath();x.arc(4,-62,4,0,Math.PI*1.5);x.stroke();
  x.restore();}
function ginkgo(x,cx,cy,s,col){ // Ginkgo mit Fächerblättern
  x.save();x.translate(cx,cy);x.scale(s,s);shadowE(x,8,2,24,7);
  x.strokeStyle='#7a5a3c';x.lineWidth=5;x.lineCap='round';x.beginPath();x.moveTo(0,0);x.lineTo(1,-30);x.stroke();x.lineWidth=2.4;x.beginPath();x.moveTo(1,-22);x.lineTo(-12,-34);x.moveTo(1,-26);x.lineTo(13,-38);x.stroke();
  const c=col||'#8db35e';
  [[-14,-38,13],[12,-42,14],[0,-53,15],[-4,-35,11],[9,-30,9]].forEach(([a,b,r],i)=>{x.fillStyle=i===2?ART.shade(c,1.1):i===4?ART.shade(c,.92):c;x.beginPath();x.moveTo(a,b+r*.35);x.arc(a,b,r,Math.PI*.78,Math.PI*2.22);x.closePath();x.fill();});
  x.strokeStyle='rgba(60,80,30,.32)';x.lineWidth=1;[[-14,-38],[12,-42],[0,-53]].forEach(([a,b])=>{for(let k=-1;k<=1;k++){x.beginPath();x.moveTo(a,b+4);x.lineTo(a+k*7,b-7);x.stroke();}});
  x.fillStyle='rgba(255,255,230,.22)';x.beginPath();x.ellipse(-4,-58,6,4,-.4,0,TAU);x.fill();
  x.restore();}
function horsetail(x,cx,cy,s,col){ // Schachtelhalme
  x.save();x.translate(cx,cy);x.scale(s,s);x.strokeStyle=col||'#7f9a55';x.fillStyle='#9a7a4a';x.lineCap='round';
  [[-6,-20],[0,-28],[5,-23],[10,-16]].forEach(([dx,h])=>{x.lineWidth=2;x.beginPath();x.moveTo(dx,0);x.lineTo(dx+1,h);x.stroke();x.lineWidth=1;
    for(let y=-5;y>h+3;y-=5){x.beginPath();x.moveTo(dx-3,y+2);x.lineTo(dx+.5,y);x.lineTo(dx+4,y+2);x.stroke();}
    x.beginPath();x.ellipse(dx+1,h-2,1.6,3,0,0,TAU);x.fill();});x.restore();}
function dicroidium(x,cx,cy,s,col){ // Samenfarn-Busch (typisch für Gondwana)
  x.save();x.translate(cx,cy);x.scale(s,s);shadowE(x,4,2,20,5);const c=col||'#8aa35f';
  x.strokeStyle='#7a5a3c';x.lineWidth=2.5;x.beginPath();x.moveTo(0,0);x.lineTo(0,-12);x.stroke();x.lineCap='round';
  [[-20,-30],[18,-32],[-4,-40],[25,-18],[-25,-17]].forEach(([c2,d],i)=>{const mx=c2*.45,my=-12+(d+12)*.45;x.strokeStyle=i%2?ART.shade(c,1.1):c;x.lineWidth=5.5;
    x.beginPath();x.moveTo(0,-12);x.lineTo(mx,my);x.lineTo(c2-5,d);x.moveTo(mx,my);x.lineTo(c2+5,d+3);x.stroke();});
  x.restore();}
function mesa(x,cx,cy,w,h){ // roter Tafelberg
  shadowE(x,cx+w*.22,cy+4,w*.7,Math.max(6,h*.14));
  x.fillStyle='#cf9567';x.beginPath();x.moveTo(cx-w/2,cy);x.lineTo(cx-w*.4,cy-h);x.lineTo(cx+w*.38,cy-h*1.02);x.lineTo(cx+w/2,cy);x.closePath();x.fill();
  x.fillStyle='rgba(120,60,30,.26)';x.beginPath();x.moveTo(cx+w*.06,cy-h);x.lineTo(cx+w*.38,cy-h*1.02);x.lineTo(cx+w/2,cy);x.lineTo(cx+w*.14,cy);x.closePath();x.fill();
  x.fillStyle='#e0b184';x.beginPath();x.ellipse(cx-w*.01,cy-h,w*.39,Math.max(4,h*.1),0,0,TAU);x.fill();
  x.strokeStyle='rgba(255,225,190,.5)';x.lineWidth=2;for(let i=1;i<4;i++){const y=cy-h*i/4,k=.5-.1*i/4;x.beginPath();x.moveTo(cx-w*k,y);x.lineTo(cx+w*(k-.02),y);x.stroke();}
  x.beginPath();x.moveTo(cx-w/2,cy);x.lineTo(cx-w*.4,cy-h);x.lineTo(cx+w*.38,cy-h*1.02);x.lineTo(cx+w/2,cy);strokeInk(x,1.5);}
function cone(x,cx,cy,w,h,hot){mountain(x,cx,cy,w,h,false,PAL_V);const tx=cx-w*.01,ty=cy-h*.98;
  x.fillStyle='#3f352e';x.beginPath();x.ellipse(tx,ty,w*.08,h*.05,0,0,TAU);x.fill();if(hot){x.fillStyle='#e0673a';x.beginPath();x.ellipse(tx,ty+1,w*.055,h*.03,0,0,TAU);x.fill();}}
function lavaCrack(x,cx,cy,s,a){x.save();x.translate(cx,cy);x.rotate(a);x.scale(s,s);x.fillStyle='rgba(50,40,35,.32)';x.beginPath();x.ellipse(0,0,42,12,0,0,TAU);x.fill();
  x.lineCap='round';x.lineJoin='round';x.strokeStyle='#d95a32';x.lineWidth=3.2;x.beginPath();x.moveTo(-30,2);x.lineTo(-12,-3);x.lineTo(2,3);x.lineTo(16,-2);x.lineTo(30,1);x.moveTo(2,3);x.lineTo(6,9);x.stroke();
  x.strokeStyle='#f8c860';x.lineWidth=1.2;x.stroke();x.restore();}
function shrooms(x,cx,cy,col){for(let k=0;k<3;k++){const px=cx+k*6-6,py=cy-(k%2)*3;x.fillStyle='#f3ead6';x.fillRect(px-1,py-4,2,4);x.fillStyle=col;x.beginPath();x.ellipse(px,py-4,3.6,2.6,0,Math.PI,0);x.fill();}}
function saltDraw(x,L){ // Salzsee: weiße Kruste mit Rissmuster, in der Mitte ein flacher, türkiser Rest
  x.fillStyle='rgba(236,226,205,.9)';x.beginPath();x.ellipse(L.x,L.y,L.rx+18,L.ry+14,0,0,TAU);x.fill();
  x.fillStyle='#f7f2e6';x.beginPath();x.ellipse(L.x-6,L.y-2,L.rx+4,L.ry+2,0,0,TAU);x.fill();x.strokeStyle='rgba(170,150,115,.35)';x.lineWidth=1.4;x.stroke();
  x.strokeStyle='rgba(200,185,160,.55)';x.lineWidth=1.1;for(let i=0;i<16;i++){const a=i*.41,r1=.35+(i%3)*.12;x.beginPath();x.moveTo(L.x+Math.cos(a)*L.rx*r1,L.y+Math.sin(a)*L.ry*r1);x.lineTo(L.x+Math.cos(a+.3)*L.rx*.9,L.y+Math.sin(a+.3)*L.ry*.9);x.lineTo(L.x+Math.cos(a+.1)*L.rx*.98,L.y+Math.sin(a+.1)*L.ry*.98);x.stroke();}
  x.fillStyle='rgba(160,215,212,.85)';x.beginPath();x.ellipse(L.x+18,L.y+8,L.rx*.45,L.ry*.36,.1,0,TAU);x.fill();x.strokeStyle='rgba(110,160,160,.35)';x.stroke();
  x.fillStyle='rgba(255,255,255,.4)';x.beginPath();x.ellipse(L.x+6,L.y+2,L.rx*.18,L.ry*.1,.1,0,TAU);x.fill();}
function iceLakeDraw(x,L){lakeDraw(x,L);x.fillStyle='rgba(246,250,252,.88)';x.beginPath();x.ellipse(L.x-L.rx*.18,L.y-L.ry*.08,L.rx*.72,L.ry*.62,-.2,0,TAU);x.fill();
  x.strokeStyle='rgba(120,160,180,.5)';x.lineWidth=1.2;x.beginPath();x.moveTo(L.x-L.rx*.5,L.y);x.lineTo(L.x-L.rx*.1,L.y-L.ry*.3);x.lineTo(L.x+L.rx*.2,L.y+L.ry*.1);x.stroke();}
function steamVent(x,cx,cy){x.fillStyle='#d9c27a';x.beginPath();x.ellipse(cx,cy,16,6,0,0,TAU);x.fill();x.fillStyle='#8a7a52';x.beginPath();x.ellipse(cx,cy,7,3,0,0,TAU);x.fill();}

/* ---------------- Masken & Raster (alle „rund um den Globus“) ---------------- */
let LANDS=[], LAND=null, WALK=null, DIST=null, DIN=null, RIV=null, MNT=null, KEEP=null, REGG=null, NAV=null, NAVC=null, PWALK=null;
function fillPolyGrid(arr,GWn,GHn,cell,pts,val,pred){
  let y0=1e9,y1=-1e9;for(const p of pts){if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1];}
  const n=pts.length,xs=[];
  for(let j=Math.max(0,Math.floor(y0/cell));j<=Math.min(GHn-1,Math.ceil(y1/cell));j++){const y=(j+.5)*cell;xs.length=0;
    for(let i=0,k=n-1;i<n;k=i++){const a=pts[i],b=pts[k];if((a[1]>y)!==(b[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
    xs.sort((a,b)=>a-b);
    for(let q=0;q+1<xs.length;q+=2){const i0=Math.max(0,Math.ceil(xs[q]/cell-.5)),i1=Math.min(GWn-1,Math.floor(xs[q+1]/cell-.5));for(let i=i0;i<=i1;i++){const k=j*GWn+i;if(!pred||pred(k,(i+.5)*cell,y))arr[k]=val;}}}
}
const fillPolyMask=(arr,pts,val,pred)=>fillPolyGrid(arr,MW,MH,MS,pts,val,pred);
function fillEllipseMask(arr,cx,cy,rx,ry,val){for(let j=Math.floor((cy-ry)/MS);j<=Math.ceil((cy+ry)/MS);j++)for(let i=Math.floor((cx-rx)/MS);i<=Math.ceil((cx+rx)/MS);i++){
  const x=(i+.5)*MS,y=(j+.5)*MS;if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)arr[md(j,MH)*MW+md(i,MW)]=val;}}
function stampLine(arr,pts,w,val,wEnd){for(let s=1;s<pts.length;s++){const a=pts[s-1],b=pts[s],L=Math.hypot(b[0]-a[0],b[1]-a[1]),k=Math.max(1,Math.ceil(L/4));
  const r=(wEnd!=null?w+(wEnd-w)*(s/pts.length):w)/2;
  for(let t=0;t<=k;t++){const px=a[0]+(b[0]-a[0])*t/k,py=a[1]+(b[1]-a[1])*t/k;
    for(let j=Math.floor((py-r)/MS);j<=Math.floor((py+r)/MS);j++)for(let i=Math.floor((px-r)/MS);i<=Math.floor((px+r)/MS);i++){
      const x=(i+.5)*MS,y=(j+.5)*MS;if((x-px)**2+(y-py)**2<=r*r)arr[md(j,MH)*MW+md(i,MW)]=val;}}}}
const cellIdx=(x,y)=>md(Math.floor(x/MS),MW)+md(Math.floor(y/MS),MH)*MW;
function landAt(x,y){return LAND[cellIdx(x,y)];}
function walkAt(x,y){return WALK[cellIdx(x,y)]===1;}
const dsIdx=(x,y)=>md(Math.floor(x/DS),DW_)+md(Math.floor(y/DS),DH_)*DW_;
function distAt(x,y){return DIST[dsIdx(x,y)];}
function dinAt(x,y){return DIN[dsIdx(x,y)];}
function onLand(x,y){return walkAt(x,y);}
function lineWalk(a,b){const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/10);for(let i=0;i<=n;i++){const u=n?i/n:0;if(!walkAt(a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u))return false;}return true;}
const DS=16,DW_=WW/DS,DH_=WH/DS;                 // Abstandsfelder: 16 Einheiten pro Zelle
function chamfer(isZero){ // Abstand zur nächsten „Null“-Zelle, auch über die Ränder hinweg
  const MWd=DW_,MHd=DH_,D=new Float32Array(MWd*MHd),INF=1e9,o=DS,dg=DS*1.4142;
  for(let j=0;j<MHd;j++)for(let i=0;i<MWd;i++)D[j*MWd+i]=isZero((i+.5)*DS,(j+.5)*DS)?0:INF;
  for(let it=0;it<2;it++){
    for(let j=0;j<MHd;j++){const jm=(j-1+MHd)%MHd;for(let i=0;i<MWd;i++){const k=j*MWd+i;let v=D[k];if(!v)continue;const im=(i-1+MWd)%MWd,ip=(i+1)%MWd;
      let q=D[j*MWd+im]+o;if(q<v)v=q;q=D[jm*MWd+i]+o;if(q<v)v=q;q=D[jm*MWd+im]+dg;if(q<v)v=q;q=D[jm*MWd+ip]+dg;if(q<v)v=q;D[k]=v;}}
    for(let j=MHd-1;j>=0;j--){const jp=(j+1)%MHd;for(let i=MWd-1;i>=0;i--){const k=j*MWd+i;let v=D[k];if(!v)continue;const im=(i-1+MWd)%MWd,ip=(i+1)%MWd;
      let q=D[j*MWd+ip]+o;if(q<v)v=q;q=D[jp*MWd+i]+o;if(q<v)v=q;q=D[jp*MWd+ip]+dg;if(q<v)v=q;q=D[jp*MWd+im]+dg;if(q<v)v=q;D[k]=v;}}}
  return D;}
/* Regionen */
function regionAt(x,y){return REG_KEYS[REGG[md(Math.floor(y/BG),BGH)*BGW+md(Math.floor(x/BG),BGW)]];}
function segDist(px,py,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=DW.clamp(((px-a[0])*dx+(py-a[1])*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(px-a[0]-t*dx,py-a[1]-t*dy);}
function polyDist(px,py,pts){let d=1e9;for(let i=1;i<pts.length;i++)d=Math.min(d,segDist(px,py,pts[i-1],pts[i]));return d;}
function buildRegions(){REGG=new Uint8Array(BGW*BGH);const RI=k=>REG_KEYS.indexOf(k);
  const tm=new Uint8Array(BGW*BGH);fillPolyGrid(tm,BGW,BGH,BG,TETHYS_SEA,1);
  for(let j=0;j<BGH;j++)for(let i=0;i<BGW;i++){const k=j*BGW+i,x=(i+.5)*BG,y=(j+.5)*BG,l=landAt(x,y);
    REGG[k]=l?RI(LANDS[l-1].reg==='main'?'steppe':LANDS[l-1].reg):RI(tm[k]?'tmeer':'pmeer');}
  const onMain=(k,x,y)=>{const l=landAt(x,y);return l&&LANDS[l-1].reg==='main';};
  REGION_POLY.forEach(([key,pts])=>fillPolyGrid(REGG,BGW,BGH,BG,pts,RI(key),onMain));
  const Z=RANGES[0],zc=catmull(Z.pts,false,40);
  const zb=bboxPad(zc,Z.w);for(let j=Math.max(0,Math.floor(zb[1]/BG));j<=Math.min(BGH-1,Math.floor(zb[3]/BG));j++)for(let i=Math.max(0,Math.floor(zb[0]/BG));i<=Math.min(BGW-1,Math.floor(zb[2]/BG));i++){const x=(i+.5)*BG,y=(j+.5)*BG;if(!onMain(0,x,y))continue;if(polyDist(x,y,zc)<Z.w*.95)REGG[j*BGW+i]=RI('gebirge');}
}
/* Wasserraster fürs Boot */
let NAVMIN=+(window.__NAVMIN||46);
function buildNav(){NAV=new Uint8Array(GW*GH);NAVC=new Float32Array(GW*GH);
  for(let j=0;j<GH;j++)for(let i=0;i<GW;i++){const x=i*WG+WG/2,y=j*WG+WG/2,k=j*GW+i;const d=distAt(x,y);
    if(d>=(+window.__NAVMIN||NAVMIN)){NAV[k]=1;NAVC[k]=1+Math.max(0,170-d)/55;}}
  // Meeresstationen sind Hindernisse (das Boot fährt nicht durch Schiffe und Riffe)
  const block=(cx,cy,rx,ry)=>{for(let j=Math.floor((cy-ry)/WG);j<=Math.ceil((cy+ry)/WG);j++)for(let i=Math.floor((cx-rx)/WG);i<=Math.ceil((cx+rx)/WG);i++){const x=(i+.5)*WG,y=(j+.5)*WG;if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)NAV[md(j,GH)*GW+md(i,GW)]=0;}};
  DATA.STATIONS.forEach(s=>{if(!seaSt(s))return;const p=ST_POS[s.id];if(!p)return;
    if(s.id==='riff')block(p[0]+40,p[1]-10,200,105);else if(s.id==='schiff'){block(p[0],p[1],70,40);block(p[0]+170,p[1]-10,150,46);}
    else if(s.id==='ammoniten')block(p[0]+20,p[1]+8,190,62);else if(s.id==='tiefsee'){block(p[0],p[1],60,34);block(p[0]+140,p[1],60,30);}
    else if(s.id!=='anning')block(p[0],p[1],95,40);});
  // nur das zusammenhängende Weltmeer zählt (abgeschlossene Binnenmeere sind für das Boot tabu)
  const comp=new Int32Array(GW*GH).fill(-1);let best=-1,bn=0,c=0;
  for(let s=0;s<GW*GH;s++){if(!NAV[s]||comp[s]>=0)continue;let n=0;const st=[s];comp[s]=c;while(st.length){const k=st.pop();n++;const i=k%GW,j=Math.floor(k/GW);
      for(const q of [j*GW+(i+1)%GW,j*GW+(i-1+GW)%GW,((j+1)%GH)*GW+i,((j-1+GH)%GH)*GW+i])if(NAV[q]&&comp[q]<0){comp[q]=c;st.push(q);}}
    if(n>bn){bn=n;best=c;}c++;}
  for(let k=0;k<GW*GH;k++)if(NAV[k]&&comp[k]!==best)NAV[k]=0;STAT.navComps=c;}
const navAt=(x,y)=>NAV[md(Math.floor(y/WG),GH)*GW+md(Math.floor(x/WG),GW)]===1;
function nearestNavCell(x,y){const ci=md(Math.floor(x/WG),GW),cj=md(Math.floor(y/WG),GH);
  if(NAV[cj*GW+ci])return cj*GW+ci;
  for(let r=1;r<90;r++){let best=-1,bd=1e18;for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){if(Math.max(Math.abs(di),Math.abs(dj))!==r)continue;const i=md(ci+di,GW),j=md(cj+dj,GH),k=j*GW+i;if(!NAV[k])continue;
      const d=((ci+di+.5)*WG-x)**2+((cj+dj+.5)*WG-y)**2;if(d<bd){bd=d;best=k;}}if(best>=0)return best;}
  return -1;}
const cellPt=k=>[(k%GW)*WG+WG/2,Math.floor(k/GW)*WG+WG/2];
function nearestNavPt(x,y){if(navAt(x,y))return[x,y];const k=nearestNavCell(x,y);if(k<0)return[x,y];const c=cellPt(k);return[nearX(c[0],x),nearY(c[1],y)];}
/* A* auf dem Wasserraster – über die Ränder hinweg */
function astar(s,g){
  if(s<0||g<0)return null;if(s===g)return[s];
  const N=GW*GH,G=new Float32Array(N).fill(1e9),from=new Int32Array(N).fill(-1),closed=new Uint8Array(N);
  const heap=[],hf=[];const push=(k,f)=>{heap.push(k);hf.push(f);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(hf[p]<=hf[i])break;[heap[p],heap[i]]=[heap[i],heap[p]];[hf[p],hf[i]]=[hf[i],hf[p]];i=p;}};
  const pop=()=>{const top=heap[0],lk=heap.pop(),lf=hf.pop();if(heap.length){heap[0]=lk;hf[0]=lf;let i=0;for(;;){const l=2*i+1,r=l+1;let m=i;if(l<heap.length&&hf[l]<hf[m])m=l;if(r<heap.length&&hf[r]<hf[m])m=r;if(m===i)break;[heap[m],heap[i]]=[heap[i],heap[m]];[hf[m],hf[i]]=[hf[i],hf[m]];i=m;}}return top;};
  const gx=g%GW,gy=Math.floor(g/GW),H=k=>{let dx=Math.abs(k%GW-gx),dy=Math.abs(Math.floor(k/GW)-gy);dx=Math.min(dx,GW-dx);dy=Math.min(dy,GH-dy);return Math.max(dx,dy)+.414*Math.min(dx,dy);};
  G[s]=0;push(s,H(s));const DIRS=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]];
  while(heap.length){const k=pop();if(k===g)break;if(closed[k])continue;closed[k]=1;const ki=k%GW,kj=Math.floor(k/GW);
    for(const [di,dj,c] of DIRS){const i=(ki+di+GW)%GW,j=(kj+dj+GH)%GH;const n=j*GW+i;if(!NAV[n]||closed[n])continue;
      if(di&&dj&&(!NAV[kj*GW+i]||!NAV[j*GW+ki]))continue;
      const ng=G[k]+c*(NAVC[n]+NAVC[k])/2;if(ng<G[n]){G[n]=ng;from[n]=k;push(n,ng+H(n));}}}
  if(from[g]<0)return null;const out=[g];let k=g;while(k!==s){k=from[k];out.unshift(k);}return out;
}
function waterClear(a,b,minD){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(L/16);for(let i=1;i<n;i++){const u=i/n;if(distAt(a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u)<minD)return false;}return true;}
function sailPts(a,b){
  const sa=nearestNavCell(a[0],a[1]),sb=nearestNavCell(b[0],b[1]);
  let cells=astar(sa,sb);let ok=true;if(!cells){cells=[];ok=false;}
  const raw=[a.slice()];let prev=a;
  for(const k of cells){const c=cellPt(k),p=[nearX(c[0],prev[0]),nearY(c[1],prev[1])];raw.push(p);prev=p;}
  raw.push([nearX(b[0],prev[0]),nearY(b[1],prev[1])]);
  const pulled=[raw[0]];let i=0;
  while(i<raw.length-1){let j=i+1;while(j+1<raw.length&&waterClear(raw[i],raw[j+1],(i===0||j+1===raw.length-1)?30:52))j++;pulled.push(raw[j]);i=j;}
  // weich machen (Chaikin bleibt innerhalb der Sichtlinien); wo es doch ans Land käme, gerade Linie nehmen
  const clear=pts=>{for(let i=2;i<pts.length-1;i++){const a=pts[i-1],b=pts[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/12);for(let k=0;k<=n;k++){const u=k/n,px=a[0]+(b[0]-a[0])*u,py=a[1]+(b[1]-a[1])*u;if(distAt(px,py)<10||landAt(px,py))return false;}}return true;};
  let sm=pulled.length>2?chaikin(pulled,3):pulled.slice();
  if(!clear(sm))sm=pulled.slice();if(!clear(sm))sm=raw.length>2?chaikin(raw,2):raw.slice();if(!clear(sm))sm=raw.slice();
  sm.ok=ok;return sm;
}

/* ---------------- Wegnetz: Knoten + Kanten, Wege werden beim Aufbau um Hindernisse herum geplant ---------------- */
let NX=[],NY=[],NADJ=[],NNAME={},NCOMP=[],NLIST=[],ROADS=[],BRIDGES=[],DOCKS=[],RC=null,ISL_NODES=[];
function addNode(x,y,name){const i=NX.length;NX.push(x);NY.push(y);NADJ.push([]);if(name)NNAME[name]=i;return i;}
function linkN(a,b){const d=Math.hypot(NX[a]-NX[b],NY[a]-NY[b]);NADJ[a].push(b,d);NADJ[b].push(a,d);}
const nodePt=i=>[NX[i],NY[i]];
function lmCenter(id){const L=LM_OFF[id];const p=ST_POS[id];return L?[p[0]+L[0],p[1]+L[1]]:p;}
function buildRoadCost(){RC=new Float32Array(RGW*RGH);
  const lm=DATA.STATIONS.filter(s=>!seaSt(s)&&ST_POS[s.id]).map(s=>lmCenter(s.id));
  for(let j=0;j<RGH;j++)for(let i=0;i<RGW;i++){const x=(i+.5)*RG,y=(j+.5)*RG,k=j*RGW+i;
    if(!landAt(x,y)){RC[k]=Infinity;continue;}const rv=RIV[cellIdx(x,y)];if(rv===2){RC[k]=Infinity;continue;}
    if(((x-VOLCANO.x)/380)**2+((y-VOLCANO.y+160)/200)**2<1){RC[k]=Infinity;continue;}
    let c=1+.45*(DW.noise2(x*.004,y*.004)-.5)*2;if(c<.6)c=.6;
    if(rv===1)c+=26;if(MNT[cellIdx(x,y)])c+=6;const din=dinAt(x,y);if(din<34)c+=14;else if(din<90)c+=3*(1-din/90)*2;
    RC[k]=c;}
  for(const q of lm){for(let j=Math.floor((q[1]-95)/RG);j<=Math.floor((q[1]+95)/RG);j++)for(let i=Math.floor((q[0]-95)/RG);i<=Math.floor((q[0]+95)/RG);i++){if(i<0||j<0||i>=RGW||j>=RGH)continue;const k=j*RGW+i;if(RC[k]!==Infinity&&Math.hypot((i+.5)*RG-q[0],(j+.5)*RG-q[1])<95)RC[k]+=6;}}}
let RA=null;
function roadAstar(A,B){ // A* auf dem Wegebau-Raster
  const N=RGW*RGH;if(!RA)RA={G:new Float32Array(N),from:new Int32Array(N),gen:new Uint32Array(N),cl:new Uint32Array(N),g:0};RA.g++;const gen=RA.g,G=RA.G,from=RA.from;
  const ci=p=>DW.clamp(Math.floor(p[1]/RG),0,RGH-1)*RGW+DW.clamp(Math.floor(p[0]/RG),0,RGW-1);
  const s=ci(A),g=ci(B),gx=g%RGW,gy=Math.floor(g/RGW);const H=k=>{const dx=Math.abs(k%RGW-gx),dy=Math.abs(Math.floor(k/RGW)-gy);return(Math.max(dx,dy)+.414*Math.min(dx,dy))*.55;};
  const heap=[],hf=[];const push=(k,f)=>{heap.push(k);hf.push(f);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(hf[p]<=hf[i])break;[heap[p],heap[i]]=[heap[i],heap[p]];[hf[p],hf[i]]=[hf[i],hf[p]];i=p;}};
  const pop=()=>{const top=heap[0],lk=heap.pop(),lf=hf.pop();if(heap.length){heap[0]=lk;hf[0]=lf;let i=0;for(;;){const l=2*i+1,r=l+1;let m=i;if(l<heap.length&&hf[l]<hf[m])m=l;if(r<heap.length&&hf[r]<hf[m])m=r;if(m===i)break;[heap[m],heap[i]]=[heap[i],heap[m]];[hf[m],hf[i]]=[hf[i],hf[m]];i=m;}}return top;};
  const cost=k=>{const c=RC[k];return k===s||k===g?Math.min(c,3):c;};
  RA.gen[s]=gen;G[s]=0;from[s]=-1;push(s,H(s));let found=false,n=0;
  while(heap.length){const k=pop();if(k===g){found=true;break;}if(RA.cl[k]===gen)continue;RA.cl[k]=gen;if(++n>150000)break;const ki=k%RGW,kj=Math.floor(k/RGW);
    for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const i=ki+di,j=kj+dj;if(i<0||j<0||i>=RGW||j>=RGH)continue;const q=j*RGW+i;if(RA.cl[q]===gen)continue;const cq=cost(q);if(cq===Infinity)continue;
      if(di&&dj&&(RC[kj*RGW+i]===Infinity||RC[j*RGW+ki]===Infinity))continue;
      const ng=G[k]+(di&&dj?1.414:1)*(cost(k)+cq)/2;if(RA.gen[q]!==gen||ng<G[q]){RA.gen[q]=gen;G[q]=ng;from[q]=k;push(q,ng+H(q));}}}
  if(!found)return null;const cells=[];let k=g;while(k!==-1){cells.unshift(k);k=k===s?-1:from[k];}
  return cells;}
function chaikin(p,it){for(let t=0;t<it;t++){const o=[p[0]];for(let i=0;i<p.length-1;i++){const a=p[i],b=p[i+1];o.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75]);}o.push(p[p.length-1]);p=o;}return p;}
function buildRoad(aName,bName){const a=NNAME[aName],b=NNAME[bName];if(a==null||b==null)return false;const A=nodePt(a),B=nodePt(b);
  const cells=roadAstar(A,B);if(!cells){STAT.roadFail=(STAT.roadFail||[]).concat(aName+'-'+bName);return false;}
  let pts=[A];for(let i=2;i<cells.length-2;i+=2){const k=cells[i];pts.push([(k%RGW+.5)*RG,(Math.floor(k/RGW)+.5)*RG]);}pts.push(B);
  pts=chaikin(pts,3);
  cells.forEach(k=>{if(RC[k]!==Infinity)RC[k]=Math.min(RC[k],.55);});
  // gleichmäßig verteilte Knoten
  const res=[pts[0]];let acc=0;for(let i=1;i<pts.length;i++){acc+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);if(acc>=36||i===pts.length-1){res.push(pts[i]);acc=0;}}
  let prev=a;for(let i=1;i<res.length-1;i++){const n=addNode(res[i][0],res[i][1]);linkN(prev,n);prev=n;}linkN(prev,b);
  const st=roadStyle(A,B);ROADS.push({pts:res,bb:bboxPad(res,30),st,a:aName,b:bName});
  // Brücken über Flüsse
  let inR=false,sIdx=0;const smp=[];for(let i=1;i<res.length;i++){const p=res[i-1],q=res[i],L=Math.hypot(q[0]-p[0],q[1]-p[1]),n=Math.ceil(L/6);for(let t=0;t<n;t++)smp.push([p[0]+(q[0]-p[0])*t/n,p[1]+(q[1]-p[1])*t/n]);}smp.push(res[res.length-1]);
  for(let i=0;i<smp.length;i++){const r=RIV[cellIdx(smp[i][0],smp[i][1])]===1;if(r&&!inR){inR=true;sIdx=i;}if(!r&&inR){inR=false;addBridge(smp,sIdx,i);}}
  return true;}
function addBridge(smp,i0,i1){const a=smp[Math.max(0,i0-3)],b=smp[Math.min(smp.length-1,i1+2)],d=Math.hypot(b[0]-a[0],b[1]-a[1])||1,ux=(b[0]-a[0])/d,uy=(b[1]-a[1])/d;
  const A=[a[0]-ux*10,a[1]-uy*10],B=[b[0]+ux*10,b[1]+uy*10];const m=[(A[0]+B[0])/2,(A[1]+B[1])/2];
  BRIDGES.push({A,B,hang:regionAt(m[0],m[1])==='laurasia'});}
function bboxPad(p,pad){const b=bbox(p);return[b[0]-pad,b[1]-pad,b[2]+pad,b[3]+pad];}
const PATH_STD=['rgba(120,95,60,.28)','#ecdcb4','rgba(160,130,90,.5)'];
const PATH_STY={wueste:['rgba(150,110,60,.26)','#f4e6c4','rgba(170,130,80,.5)'],eis:['rgba(110,130,145,.25)','#fbfbf6','rgba(120,145,160,.45)'],vulkan:['rgba(60,48,36,.3)','#d6c4a4','rgba(120,95,70,.5)']};
function roadStyle(A,B){const r=regionAt((A[0]+B[0])/2,(A[1]+B[1])/2);return PATH_STY[r]||PATH_STD;}
/* Anleger an der Küste suchen: Küstenzelle in der Nähe, Blick aufs offene Wasser */
function placeDock(d,searchR){const cx=d.near[0],cy=d.near[1];let best=null,bs=-1e9;
  for(let j=Math.floor((cy-searchR)/MS);j<=Math.ceil((cy+searchR)/MS);j+=2)for(let i=Math.floor((cx-searchR)/MS);i<=Math.ceil((cx+searchR)/MS);i+=2){
    const x=(i+.5)*MS,y=(j+.5)*MS;if(!landAt(x,y)||dinAt(x,y)>24)continue;if(d.land&&landAt(x,y)!==d.land)continue;const dn=Math.hypot(x-cx,y-cy);if(dn>searchR)continue;
    for(let a=0;a<24;a++){const ang=a/24*TAU,ux=Math.cos(ang),uy=Math.sin(ang);
      if(landAt(x+ux*40,y+uy*40)||landAt(x+ux*110,y+uy*110)||landAt(x+ux*190,y+uy*190))continue;
      const ax=x-ux*38,ay=y-uy*38;if(!walkAt(ax,ay)||dinAt(ax,ay)<20)continue;
      const wp=[x+ux*200,y+uy*200];if(!navAt(wp[0],wp[1]))continue;if(wp[0]<0||wp[1]<0||wp[0]>=WW||wp[1]>=WH)continue;
      const sc=Math.min(260,distAt(x+ux*240,y+uy*240))-dn*(d.land?.25:.55);if(sc>bs){bs=sc;best={x,y,ux,uy};}}}
  if(!best)return false;const {x,y,ux,uy}=best;
  d.shore=[x,y];d.at=[x-ux*38,y-uy*38];d.start=[x-ux*30,y-uy*30];d.end=[x+ux*84,y+uy*84];d.dir=[ux,uy];d.ang=Math.atan2(uy,ux);
  d.wp=nearestNavPt(x+ux*200,y+uy*200);return true;}
/* Wege abseits der Straßen: A* auf dem 16er-Laufraster, auf einen Ausschnitt begrenzt */
function gridPath(A,B,partial){
  const pad=420,x0=Math.max(0,Math.floor((Math.min(A[0],B[0])-pad)/PG)),y0=Math.max(0,Math.floor((Math.min(A[1],B[1])-pad)/PG)),x1=Math.min(PGW-1,Math.ceil((Math.max(A[0],B[0])+pad)/PG)),y1=Math.min(PGH-1,Math.ceil((Math.max(A[1],B[1])+pad)/PG));
  const w=x1-x0+1,h=y1-y0+1,N=w*h;if(N>90000)return null;
  const G=new Float32Array(N).fill(1e9),from=new Int32Array(N).fill(-1),cl=new Uint8Array(N);
  const loc=p=>{const i=DW.clamp(Math.floor(p[0]/PG)-x0,0,w-1),j=DW.clamp(Math.floor(p[1]/PG)-y0,0,h-1);return j*w+i;};
  const ok=k=>PWALK[(Math.floor(k/w)+y0)*PGW+(k%w)+x0]===1;
  const s=loc(A),g=loc(B),gx=g%w,gy=Math.floor(g/w);const H=k=>{const dx=Math.abs(k%w-gx),dy=Math.abs(Math.floor(k/w)-gy);return Math.max(dx,dy)+.414*Math.min(dx,dy);};
  const heap=[],hf=[];const push=(k,f)=>{heap.push(k);hf.push(f);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(hf[p]<=hf[i])break;[heap[p],heap[i]]=[heap[i],heap[p]];[hf[p],hf[i]]=[hf[i],hf[p]];i=p;}};
  const pop=()=>{const top=heap[0],lk=heap.pop(),lf=hf.pop();if(heap.length){heap[0]=lk;hf[0]=lf;let i=0;for(;;){const l=2*i+1,r=l+1;let m=i;if(l<heap.length&&hf[l]<hf[m])m=l;if(r<heap.length&&hf[r]<hf[m])m=r;if(m===i)break;[heap[m],heap[i]]=[heap[i],heap[m]];[hf[m],hf[i]]=[hf[i],hf[m]];i=m;}}return top;};
  G[s]=0;push(s,H(s));let best=s,bh=H(s),found=false;
  while(heap.length){const k=pop();if(k===g){found=true;break;}if(cl[k])continue;cl[k]=1;const hk=H(k);if(hk<bh){bh=hk;best=k;}const ki=k%w,kj=Math.floor(k/w);
    for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const i=ki+di,j=kj+dj;if(i<0||j<0||i>=w||j>=h)continue;const q=j*w+i;if(cl[q]||!ok(q))continue;
      if(di&&dj&&(!ok(kj*w+i)||!ok(j*w+ki)))continue;const ng=G[k]+(di&&dj?1.414:1);if(ng<G[q]){G[q]=ng;from[q]=k;push(q,ng+H(q));}}}
  if(!found&&!partial)return null;const end=found?g:best;if(end===s&&!found)return null;
  const cells=[];let k=end;while(k!==-1){cells.unshift(k);k=from[k];}
  const raw=cells.map(k=>[(k%w+x0+.5)*PG,(Math.floor(k/w)+y0+.5)*PG]);raw[0]=A.slice();if(found)raw[raw.length-1]=B.slice();
  const out=[raw[0]];let i=0;while(i<raw.length-1){let j=i+1;while(j+1<raw.length&&lineWalk(raw[i],raw[j+1]))j++;out.push(raw[j]);i=j;}
  return out.slice(1);}
function pathLen(p,from){let L=0,q=from||p[0];for(const r of p){L+=Math.hypot(r[0]-q[0],r[1]-q[1]);q=r;}return L;}
/* Dijkstra mit Heap */
function dijkstra(src,target){const N=NX.length,D=new Float64Array(N).fill(1e18),prev=new Int32Array(N).fill(-1);D[src]=0;const heap=[src],hf=[0];
  const push=(k,f)=>{heap.push(k);hf.push(f);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(hf[p]<=hf[i])break;[heap[p],heap[i]]=[heap[i],heap[p]];[hf[p],hf[i]]=[hf[i],hf[p]];i=p;}};
  const pop=()=>{const top=heap[0],tf=hf[0],lk=heap.pop(),lf=hf.pop();if(heap.length){heap[0]=lk;hf[0]=lf;let i=0;for(;;){const l=2*i+1,r=l+1;let m=i;if(l<heap.length&&hf[l]<hf[m])m=l;if(r<heap.length&&hf[r]<hf[m])m=r;if(m===i)break;[heap[m],heap[i]]=[heap[i],heap[m]];[hf[m],hf[i]]=[hf[i],hf[m]];i=m;}}return[top,tf];};
  while(heap.length){const [u,du]=pop();if(du>D[u])continue;if(u===target)break;const A=NADJ[u];for(let q=0;q<A.length;q+=2){const v=A[q],nd=du+A[q+1];if(nd<D[v]){D[v]=nd;prev[v]=u;push(v,nd);}}}
  return{dist:D,prev};}
const DJC=new Map();
function dj(src){let r=DJC.get(src);if(!r){r=dijkstra(src);DJC.set(src,r);if(DJC.size>24)DJC.delete(DJC.keys().next().value);}return r;}
function route(a,b){const {prev}=dj(a);const out=[];let u=b;while(u!==-1){out.unshift(u);if(u===a)break;u=prev[u];}return out[0]===a?out:[a,b];}
function nearestNode(px,py,comp){let best=-1,bd=1e18;for(let i=0;i<NX.length;i++){if(comp!=null&&NCOMP[i]!==comp)continue;const d=(NX[i]-px)**2+(NY[i]-py)**2;if(d<bd){bd=d;best=i;}}return best;}
function entryNode(P,comp){const c=[];for(let i=0;i<NX.length;i++){if(comp!=null&&NCOMP[i]!==comp)continue;const d=Math.hypot(NX[i]-P[0],NY[i]-P[1]);if(d<1100)c.push([d,i]);}
  c.sort((a,b)=>a[0]-b[0]);for(let q=0;q<Math.min(10,c.length);q++){if(lineWalk(P,nodePt(c[q][1])))return{n:c[q][1],path:[nodePt(c[q][1])]};}
  const n=c.length?c[0][1]:nearestNode(P[0],P[1],comp);if(n<0)return null;const g=gridPath(P,nodePt(n),false);return{n,path:g||[nodePt(n)]};}
function compOfPoint(x,y){const l=landAt(x,y);if(l&&LANDS[l-1].comp!=null)return LANDS[l-1].comp;
  const n=nearestNode(md(x,WW),md(y,WH),null);if(n>=0&&Math.hypot(NX[n]-md(x,WW),NY[n]-md(y,WH))<420)return NCOMP[n];return null;}
function walkPts(A,B,bName,comp){
  const dd=Math.hypot(B[0]-A[0],B[1]-A[1]);if(dd<1)return[B.slice()];
  if(bName==null&&dd<600&&lineWalk(A,B))return[B.slice()];
  if(bName==null&&dd<900){const g=gridPath(A,B,false);if(g&&pathLen(g,A)<dd*1.7+120)return g;}
  const ea=entryNode(A,comp);if(!ea)return[B.slice()];
  let nb,exit=null;if(bName!=null)nb=NNAME[bName];else{const e=entryNode(B,comp);nb=e?e.n:ea.n;exit=e;}
  const r=route(ea.n,nb);let pts=ea.path.slice();for(let i=1;i<r.length;i++)pts.push(nodePt(r[i]));
  if(bName==null){const last=pts[pts.length-1];if(lineWalk(last,B))pts.push(B.slice());else{const g=gridPath(last,B,true);if(g)pts=pts.concat(g);}}
  return pts;}

/* ---------------- Wahrzeichen der Stationen (Versatz, Zeichnung, y-Sortierung, Maßstab) ---------------- */
const LM={museum:[90,-30,landmarkMuseum,-40],forscher:[-110,10,landmarkCamp,-10],zeitportal:[150,10,landmarkPortal,40],lauf:[90,70,landmarkRun,50],grabung:[110,30,landmarkDig,30],waage:[110,20,landmarkScale,20],puzzle:[100,30,landmarkPuzzle,20],futter:[100,30,landmarkFeed,20],
  dschungel:[110,26,lmLiane],lager:[120,26,lmLager],klang:[120,40,lmKlang],karten:[110,26,lmPavillon],kino:[120,26,lmKino],werkstatt:[110,26,lmShed],kita:[120,26,lmKita],
  spuren:[110,30,lmSpuren],tracker:[110,26,lmTracker],eier:[110,30,lmEier],nest:[120,30,lmNest],
  memory:[120,30,lmMemory],grossklein:[100,30,lmGross],schatten:[120,30,lmSchatten],kamera:[110,30,lmKamera],
  rennen:[170,40,lmRennen],vulkan:[-120,20,lmVulkanCamp],endlos:[110,30,lmEndlos],
  wiegross:[100,30,lmWiegross],werbinich:[110,30,lmWerbinich],bildquiz:[110,30,lmBildquiz],lufwas:[120,30,lmLufwas],
  picknick:[110,30,lmPicknick],rettung:[110,30,lmRettung],expedition:[120,30,lmExped],zuhause:[120,26,lmHaus],ausflug:[110,26,lmAusflug],
  riff:[0,0,lmRiff,null,1.2],schiff:[0,0,lmSchiff,null,1.25],tiefsee:[0,0,lmTiefsee,null,1.45],anning:[0,0,null],meerfutter:[0,0,lmFutter,null,1.35],tauchfahrt:[0,0,lmPonton,null,1.45],ammoniten:[0,0,lmAmmon,null,1.1]};
const LM_OFF={};for(const k in LM)LM_OFF[k]=[LM[k][0],LM[k][1]];

/* ---------------- Aufbau der Welt ---------------- */
let WASH=null, OV=null, OVS=.16, NT=null, GR=null, SEA_ITEMS=[], ITEMS=[], ANCHOR={}, STAT={}, IDX=null, SIDX=null;
const BK=600, BKW=WW/BK, BKH=WH/BK;
function buildGeo(){const T0=performance.now(),tm=k=>{STAT['t_'+k]=Math.round(performance.now()-T0);};
  const src=GEO.lands.map((a,i)=>({k:i?'i'+i:'main',pts:unpack(a),amp:i?16:24,seed:i*3+1,reg:DATA_ISL_REG[i]||'kimmerien'}));
  HAND_ISL.forEach(h=>src.push({k:h.k,pts:blob(h.c[0],h.c[1],h.rx,h.ry,h.k==='anning'?14:16,h.seed),amp:h.k==='anning'?18:16,seed:h.seed+30,reg:h.reg,hand:h}));
  LANDS=src.map((s,i)=>{const poly=wobble(s.pts,s.amp,s.seed);return{k:s.k,idx:i+1,poly,bb:bbox(poly),reg:s.reg,comp:null,main:i===0,hand:s.hand||null};});
  tm('wobble');LAND=new Uint8Array(MW*MH);LANDS.forEach(L=>fillPolyMask(LAND,L.poly,L.idx));tm('fill');
  DIST=chamfer((x,y)=>landAt(x,y)!==0);DIN=chamfer((x,y)=>landAt(x,y)===0);tm('chamfer');
  RIV=new Uint8Array(MW*MH);RIVERS.forEach(r=>{r.cp=catmull(r.pts,false,8);r.bb=bboxPad(r.cp,r.w1+20);stampLine(RIV,r.cp,r.w0+14,1,r.w1+14);});
  LAKES.forEach(L=>fillEllipseMask(RIV,L.x,L.y,L.rx+(L.salt?30:14),L.ry+(L.salt?24:12),2));
  MNT=new Uint8Array(MW*MH);RANGES.forEach(r=>{r.cp=catmull(r.pts,false,20);stampLine(MNT,r.cp,r.core*2,1);});
  fillEllipseMask(MNT,VOLCANO.x,VOLCANO.y-150,350,190,1);
  WALK=new Uint8Array(MW*MH);for(let k=0;k<WALK.length;k++)WALK[k]=LAND[k]&&!RIV[k]&&!MNT[k]?1:0;
  tm('masks');buildRegions();tm('regions');buildNav();tm('nav');
  // benannte Knoten: Stationen, Kreuzungen
  NX=[];NY=[];NADJ=[];NNAME={};ROADS=[];BRIDGES=[];DOCKS=[];ISL_NODES=[];
  DATA.STATIONS.forEach(s=>{const p=ST_POS[s.id];if(p&&!seaSt(s))addNode(p[0],p[1],s.id);});
  for(const k in JUNC)addNode(JUNC[k][0],JUNC[k][1],k);
  STAT.dockFail=[];
  const mkDock=(d,r)=>{if(!placeDock(d,r)&&!placeDock(d,r*2)){STAT.dockFail.push(d.id);return false;}
    addNode(d.at[0],d.at[1],d.id);addNode(d.end[0],d.end[1],d.id+'_e');linkN(NNAME[d.id],NNAME[d.id+'_e']);DOCKS.push(d);return true;};
  DOCK_DEF.forEach(d0=>mkDock(Object.assign({},d0),380));
  // Inseln: Mitte, Anleger, kleiner Rundweg
  LANDS.forEach(L=>{if(L.main)return;const [a,b,c,d]=L.bb;let best=null,bd=-1;
    for(let y=b;y<=d;y+=MS)for(let x=a;x<=c;x+=MS){if(landAt(x,y)!==L.idx||!walkAt(x,y))continue;const v=dinAt(x,y);if(v>bd){bd=v;best=[x,y];}}
    if(!best)return;const cn='c_'+L.k;addNode(best[0],best[1],cn);L.center=best;
    const dk={id:'dk_'+L.k,near:best,link:cn,land:L.idx,isl:L.k};if(!mkDock(dk,Math.max(c-a,d-b)))return;
    let far=null,fd=0;for(let y=b;y<=d;y+=MS*2)for(let x=a;x<=c;x+=MS*2){if(landAt(x,y)!==L.idx||dinAt(x,y)<44||!walkAt(x,y))continue;const q=Math.hypot(x-best[0],y-best[1])+Math.hypot(x-dk.at[0],y-dk.at[1])*.6;if(q>fd){fd=q;far=[x,y];}}
    if(far&&Math.hypot(far[0]-best[0],far[1]-best[1])>170){addNode(far[0],far[1],'x_'+L.k);ISL_NODES.push(['x_'+L.k,cn]);}
    ISL_NODES.push([cn,dk.id]);if(ISLAND_ST[L.k])ISL_NODES.push([cn,ISLAND_ST[L.k]]);});
  tm('docks');// Wege planen
  buildRoadCost();tm('rcost');STAT.roadFail=[];
  ROAD_LINKS.forEach(([a,b])=>buildRoad(a,b));
  DOCKS.forEach(d=>{if(!d.isl)buildRoad(d.link,d.id);});
  ISL_NODES.forEach(([a,b])=>buildRoad(a,b));
  tm('roads');// Wege, Brücken und Anleger begehbar machen
  ROADS.forEach(r=>stampLine(WALK,r.pts,34,1));
  BRIDGES.forEach(b=>stampLine(WALK,[b.A,b.B],38,1));
  DOCKS.forEach(d=>stampLine(WALK,[d.at,d.end],30,1));
  PWALK=new Uint8Array(PGW*PGH);for(let j=0;j<PGH;j++)for(let i=0;i<PGW;i++)PWALK[j*PGW+i]=walkAt((i+.5)*PG,(j+.5)*PG)?1:0;
  // Freihaltezonen für Pflanzen & Deko
  KEEP=new Uint8Array(MW*MH);
  ROADS.forEach(r=>stampLine(KEEP,r.pts,64,1));BRIDGES.forEach(b=>stampLine(KEEP,[b.A,b.B],70,1));
  DOCKS.forEach(d=>{stampLine(KEEP,[d.at,d.end],90,1);fillEllipseMask(KEEP,d.end[0],d.end[1],130,110,1);});
  DATA.STATIONS.forEach(s=>{const p=ST_POS[s.id];if(!p||seaSt(s))return;fillEllipseMask(KEEP,p[0],p[1],130,110,1);const c=lmCenter(s.id);fillEllipseMask(KEEP,c[0],c[1]-40,170,120,1);});
  // Zusammenhang
  NCOMP=new Int32Array(NX.length).fill(-1);let cc=0;
  for(let i=0;i<NX.length;i++){if(NCOMP[i]>=0)continue;const st=[i];NCOMP[i]=cc;while(st.length){const u=st.pop(),A=NADJ[u];for(let q=0;q<A.length;q+=2){const v=A[q];if(NCOMP[v]<0){NCOMP[v]=cc;st.push(v);}}}cc++;}
  for(let i=0;i<NX.length;i++){const l=landAt(NX[i],NY[i]);if(l&&LANDS[l-1].comp==null)LANDS[l-1].comp=NCOMP[i];}
  DOCKS.forEach(d=>d.comp=NCOMP[NNAME[d.id]]);
  DATA.STATIONS.forEach(s=>{const p=ST_POS[s.id];if(!p)return;if(seaSt(s)){const o=SEA_OFF[s.id]||[0,150];ANCHOR[s.id]=nearestNavPt(p[0]+o[0],p[1]+o[1]);}else ANCHOR[s.id]=p;});
  DJC.clear();tm('end');
}
const NCOMPOF=name=>NNAME[name]!=null?NCOMP[NNAME[name]]:null;

/* Weicher Aquarellfleck ins Wasch-Bild */
let SOFT_TMP={};
function softDraw(x,fn,blur,alpha=1){
  const k=Math.max(1,Math.round(blur/MS/1.3)),w=Math.ceil(MW/k),h=Math.ceil(MH/k);
  let t=SOFT_TMP[k];if(!t){t=SOFT_TMP[k]=mkCanvas(w,h);}const tx=t.getContext('2d');tx.setTransform(1,0,0,1,0,0);tx.clearRect(0,0,w,h);tx.setTransform(1/(MS*k),0,0,1/(MS*k),0,0);fn(tx);
  let src=t;
  if(k>=6){const k2=Math.max(1,Math.round(k/3)),w2=Math.ceil(MW/k2),h2=Math.ceil(MH/k2);let t2=SOFT_TMP['m'+k2];if(!t2)t2=SOFT_TMP['m'+k2]=mkCanvas(w2,h2);
    const x2=t2.getContext('2d');x2.setTransform(1,0,0,1,0,0);x2.clearRect(0,0,w2,h2);x2.imageSmoothingEnabled=true;x2.imageSmoothingQuality='high';x2.drawImage(t,0,0,w*k/k2,h*k/k2);src=t2;
    x.save();x.globalAlpha=alpha;x.setTransform(1,0,0,1,0,0);x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(src,0,0,w2*k2,h2*k2);x.restore();return;}
  x.save();x.globalAlpha=alpha;x.setTransform(1,0,0,1,0,0);x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(src,0,0,w*k,h*k);x.restore();
}
const REG_BLOBS={ // Farbflecken je Region: Farben, Anzahl pro Mio. Flächeneinheiten
  steppe:[['#c9cc92','#b7c283','#d3cf9a','#aebd7e'],6],tal:[['#a9c27c','#c7d79a','#b3cc86','#9fbf78'],9],gebirge:[['#cbbf9f','#bdb194','#d6cdb0'],7],
  wueste:[['#ecd49c','#d9b476','#e9c98a','#d49a6a'],8],tethys:[['#8fb574','#7fa866','#a3c483','#6f9a5a'],9],laurasia:[['#95ad74','#a9bd84','#86a26a','#b5c68f'],8],
  vulkan:[['#958b76','#8a8272','#7a7064','#98a874'],8],eis:[['#f3f6f5','#dde8ee','#e8eee9','#cfdcd9'],8],ebene:[['#d9d397','#bfc382','#e2d6a0','#c6cf8c'],9],
  gondwald:[['#a3bd80','#94b273','#b6c98f','#8aa86a'],8],nordchina:[['#a9bd84','#95ad74'],10],suedchina:[['#8fb574','#a3c483'],10],kimmerien:[['#b3c386','#c9cf94','#9fbf78'],10],
  tinsel:[['#c7d29a'],8],anning:[['#c6d19e'],8],pinsel:[['#a9c27c','#c7d79a'],10]};
function regionCells(){const c={};for(let k=0;k<REGG.length;k++){const key=REG_KEYS[REGG[k]];const i=k%BGW,j=Math.floor(k/BGW);let e=c[key];if(!e)e=c[key]={n:0,bb:[1e9,1e9,-1e9,-1e9]};e.n++;
  const x=i*BG,y=j*BG;if(x<e.bb[0])e.bb[0]=x;if(y<e.bb[1])e.bb[1]=y;if(x+BG>e.bb[2])e.bb[2]=x+BG;if(y+BG>e.bb[3])e.bb[3]=y+BG;}for(const k in c)c[k].area=c[k].n*BG*BG;return c;}
let RCELLS=null;
function buildWash(){
  const c=mkCanvas(MW,MH),x=c.getContext('2d');x.setTransform(1/MS,0,0,1/MS,0,0);
  x.fillStyle='#86bacb';x.fillRect(0,0,WW,WH);
  // Wasserfarben-Wolken im Meer (Muster, dessen Wiederholung genau in die Welt passt)
  const nts=mkCanvas(300,300);nts.getContext('2d').drawImage(NT,0,0,300,300);
  x.save();x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='multiply';x.globalAlpha=.32;x.fillStyle=x.createPattern(nts,'repeat');x.fillRect(0,0,MW,MH);x.restore();
  // Tiefe: weit weg vom Land dunkler, Panthalassa am tiefsten
  const im=x.getImageData(0,0,MW,MH),d=im.data,PI_=REG_KEYS.indexOf('pmeer');
  for(let k=0;k<MW*MH;k++){const i=k%MW,j=(k/MW)|0,dv=DIST[Math.floor(j*MS/DS)*DW_+Math.floor(i*MS/DS)];if(dv<=0)continue;const pm=REGG[Math.floor(j*MS/BG)*BGW+Math.floor(i*MS/BG)]===PI_;
    const f=smooth(120,1300,dv)*(pm?.3:.18);if(f<=0)continue;const q=k*4;d[q]=d[q]*(1-f*1.3);d[q+1]=d[q+1]*(1-f*.72);d[q+2]=d[q+2]*(1-f*.3);}
  x.putImageData(im,0,0);
  // warme, türkise Tethys; Schelfmeere; Tiefsee; helle Lagunen (Schichten mit gleicher Weichheit in einem Durchgang)
  softDraw(x,t=>{t.globalAlpha=.2;t.fillStyle='#5fb8b4';smoothPath(t,TETHYS_SEA);t.fill();},320,1);
  softDraw(x,t=>{t.globalAlpha=.55;t.fillStyle='#bfe6dc';GEO.shelf.forEach(a=>{smoothPath(t,unpack(a));t.fill();});
    t.globalAlpha=.35;t.fillStyle='#2a5f7c';t.beginPath();t.arc(DEEP.x,DEEP.y,DEEP.r+160,0,TAU);t.fill();
    t.globalAlpha=.7;t.fillStyle='#173f5a';t.beginPath();t.arc(DEEP.x,DEEP.y,DEEP.r,0,TAU);t.fill();
    t.globalAlpha=.7;t.fillStyle='#bfe6dc';const r=ST_POS.riff,a=ST_POS.ammoniten;t.beginPath();t.ellipse(r[0]+40,r[1]-10,260,160,0,0,TAU);t.fill();t.beginPath();t.ellipse(a[0]+20,a[1]+10,280,130,0,0,TAU);t.fill();},64,1);
  // Flachwasser um alle Küsten
  softDraw(x,t=>{t.strokeStyle='rgba(190,228,222,.9)';t.lineWidth=120;t.lineJoin='round';LANDS.forEach(L=>{smoothPath(t,L.poly);t.stroke();});},14,1);
  softDraw(x,t=>{t.strokeStyle='rgba(215,238,230,.8)';t.lineWidth=46;t.lineJoin='round';LANDS.forEach(L=>{smoothPath(t,L.poly);t.stroke();});},4,1);
  // Landfarbe
  LANDS.forEach(L=>{const col=REG_INFO[L.main?'steppe':L.reg].ground;x.fillStyle=col;x.strokeStyle=col;x.lineWidth=24;x.lineJoin='round';smoothPath(x,L.poly);x.fill();x.stroke();});
  const clipMain=fn=>{x.save();smoothPath(x,LANDS[0].poly);x.clip();fn();x.restore();};
  const clipAll=fn=>{x.save();x.beginPath();LANDS.forEach(L=>smoothSub(x,L.poly));x.clip();fn();x.restore();};
  RCELLS=regionCells();
  clipMain(()=>softDraw(x,t=>{t.globalAlpha=.95;REGION_POLY.forEach(([key,pts],i)=>{const w=wobble(pts,70,i*2+5);t.fillStyle=REG_INFO[key].ground;smoothPath(t,w);t.fill();});
    const Z=RANGES[0];t.globalAlpha=.9;t.strokeStyle=REG_INFO.gebirge.ground;t.lineCap='round';t.lineJoin='round';t.lineWidth=Z.w*1.7;smoothPath(t,Z.pts,false);t.stroke();},88,1));
  clipAll(()=>{
    // Farbflecken je Region, Schnee, rote Wüstenfelsen, Grabungsflächen, Asche
    softDraw(x,t=>{t.globalAlpha=.6;for(const key in REG_BLOBS){const e=RCELLS[key];if(!e)continue;const [cols,dens]=REG_BLOBS[key],n=Math.round(dens*e.area/1e6);
        for(let i=0,tr=0;i<n&&tr<n*6;tr++){const px=R(e.bb[0],e.bb[2]),py=R(e.bb[1],e.bb[3]);if(regionAt(px,py)!==key)continue;t.fillStyle=RP(cols);t.beginPath();t.ellipse(px,py,R(110,280),R(60,150),rnd()*3,0,TAU);t.fill();i++;}}
      t.globalAlpha=.75;t.fillStyle='#f3f6f5';for(let i=0;i<40;i++){const px=R(4100,6500),py=R(5500,6450);if(regionAt(px,py)!=='eis')continue;t.beginPath();t.ellipse(px,py,R(80,200),R(40,90),rnd()*3,0,TAU);t.fill();}
      t.globalAlpha=.45;t.fillStyle='#d49a6a';[[2800,4550],[3650,4250],[3050,4000]].forEach(([a,b])=>{t.beginPath();t.ellipse(a,b,240,120,rnd(),0,TAU);t.fill();});
      t.globalAlpha=.55;t.fillStyle='#dcc08e';[[4100,5150],[4650,5150],[4350,5420]].forEach(([a,b])=>{t.beginPath();t.ellipse(a,b,200,90,rnd(),0,TAU);t.fill();});
      t.globalAlpha=.5;t.fillStyle='#8a806f';LANDS.filter(L=>L.k==='pvulk').forEach(L=>{t.beginPath();t.ellipse(L.hand.c[0],L.hand.c[1]-30,180,110,0,0,TAU);t.fill();});},40,1);
    // grüne Flusstäler, Gebirgsfarben, Schnee auf den Kämmen, Asche am Vulkan
    softDraw(x,t=>{t.lineCap='round';t.lineJoin='round';t.globalAlpha=.4;t.strokeStyle='#8fb574';RIVERS.forEach(r=>{t.lineWidth=170;smoothPath(t,r.pts,false);t.stroke();});
      RANGES.forEach(r=>{t.globalAlpha=.55;t.strokeStyle=r.pal==='R'?'#d3a57a':'#b9ad92';t.lineWidth=r.w*1.3;smoothPath(t,r.pts,false);t.stroke();
        if(r.snow){t.globalAlpha=.6;t.strokeStyle='#f6f8f7';t.lineWidth=r.core*1.5;smoothPath(t,r.pts,false);t.stroke();}});
      t.globalAlpha=.45;t.fillStyle='#6f665c';t.beginPath();t.ellipse(VOLCANO.x+40,VOLCANO.y-40,520,260,0,0,TAU);t.fill();t.beginPath();t.ellipse(6250,1500,380,180,.3,0,TAU);t.fill();},60,1);
  });
  seasonWash(x);
  WASH=c;
}

/* ---------------- Eigene Bilder für die Karte (grafiken-neu/karte/…, siehe tools/LIESMICH-Grafiken.md) ----------------
   Jedes Landschafts-Element kennt seine Sorte (d.k = Namen, der erste vorhandene gilt; Funktion bei Jahreszeiten), seinen
   Fußpunkt (d.x,d.y), Maßstab (d.sx,d.sy), Spiegelung (d.fl) und Drehung (d.a). Liegt karte/<sorte>.png oder karte/<sorte>_1…_4.png
   vor, malt die Kachel statt der Zeichnung das Bild: Fußpunkt unten Mitte, so hoch wie die Zeichnung (Größe wird einmal an der
   Zeichnung gemessen), Variante fest aus der Position. Die Bilder werden beim Start geladen und einmal auf Kachelgröße
   heruntergerechnet; danach werden die Kacheln nach und nach (ohne Flackern) neu gemalt. Ohne Bilder bleibt alles wie bisher. */
const KM={on:false,sets:{},box:{},run:new Map(),tx:null,stale:false};
let KSC=.9, kmMC=null;                                  // Maßstab des gerade gemalten Ziels (Kachel/Übersicht)
const kHash=(x,y)=>{let h=Math.imul(Math.round(x)|0,73856093)^Math.imul(Math.round(y)|0,19349663);h^=h>>>13;h=Math.imul(h,1274126177);h^=h>>>16;return h>>>0;};
const K_PROBE={ // Zeichnung der Sorte am Fußpunkt (0,0), Maßstab 1 – daraus Breite/Höhe. w: flach (Breite zählt), c: mittig
  baum_nadel:{f:x=>conifer(x,0,0,1)}, baum_nadel_schnee:{f:x=>snowConifer(x,0,0,1)},
  baum_ginkgo:{f:x=>ginkgo(x,0,0,1)}, baum_ginkgo_herbst:{f:x=>ginkgo(x,0,0,1)}, baum_ginkgo_winter:{f:x=>ginkgo(x,0,0,1)},
  palmfarn:{f:x=>palm(x,0,0,1)}, baumfarn:{f:x=>treeFern(x,0,0,1)}, farn:{f:x=>fern(x,0,0,1)}, schachtelhalm:{f:x=>horsetail(x,0,0,1)},
  samenfarn:{f:x=>dicroidium(x,0,0,1)}, grasbueschel:{f:x=>tuft(x,0,0,'#7f9a55')}, pilze:{f:x=>shrooms(x,0,0,'#c8553d')},
  fels:{f:x=>rock(x,0,0,1)}, fels_schnee:{f:x=>rock(x,0,0,1,'#a9b4ba',true)}, fels_rot:{f:x=>rock(x,0,0,1,'#d9a577')}, fels_dunkel:{f:x=>rock(x,0,0,1,'#5f5650')},
  duene:{f:x=>dune(x,0,0,100,false),w:1}, tafelberg:{f:x=>mesa(x,0,0,100,100)}, felsbogen:{f:x=>rockArch(x,0,0,1)},
  knochen_boden:{f:x=>bones(x,0,0,1,0),w:1}, grabungsfahne:{f:x=>flagDig(x,0,0,'#c8553d')},
  berg:{f:x=>mountain(x,0,0,100,100,false,PAL_M)}, berg_schnee:{f:x=>mountain(x,0,0,100,100,true,PAL_M)},
  berg_eis:{f:x=>mountain(x,0,0,100,100,true,PAL_ICE)}, berg_rot:{f:x=>mountain(x,0,0,100,100,false,PAL_R)},
  vulkan:{f:x=>cone(x,0,0,100,100,false)}, vulkan_aktiv:{f:x=>cone(x,0,0,100,100,true)},
  vulkan_gross:{f:x=>{x.translate(-VOLCANO.x,-VOLCANO.y);bigVolcano(x);},m:.5,ox:300,oy:500},
  lavaspalte:{f:x=>lavaCrack(x,0,0,1,0),w:1}, dampfloch:{f:x=>steamVent(x,0,0),w:1},
  kompassrose:{f:x=>compassRose(x,0,0),c:1}, ruderboot:{f:x=>rowboat(x,0,0,false),w:1},
  welle:{f:x=>{x.strokeStyle='#fff';x.lineWidth=2.2;wave(x,0,0);},w:1}, koralle:{f:x=>coral(x,0,0,1,['#e98f7a','#f0a08a','#f5c7b0'])}, seetang:{f:x=>kelp(x,0,0,1)},
  herbstlaub:{f:x=>{x.fillStyle='#d9a03a';[0,1,2].forEach(k=>{x.beginPath();x.ellipse(Math.cos(k*2)*7,Math.sin(k*2)*3,3.6,2,k,0,TAU);x.fill();});},w:1},
  schneemann:{f:x=>snowman(x,0,0)},
};
const LM_ALIAS={tiefsee:['taucherglocke'],schiff:['forschungsschiff'],meerfutter:['futterfloss'],tauchfahrt:['ponton'],anning:['kreideklippe']};
function kmProbe(n){if(K_PROBE[n])return K_PROBE[n];if(n&&n.indexOf('wahrzeichen_')===0){const id=n.slice(12),L=LM[id];if(!L)return null;
  if(id==='anning')return{f:x=>{x.translate(-4250,-4190);lmAnning(x,4250,4190);},m:.75,oy:560};return L[2]?{f:x=>L[2](x,0,0),m:.75,oy:560}:null;}return null;}
/** Umriss der Zeichnung einer Sorte relativ zum Fußpunkt [links,oben,rechts,unten] (Schatten zählen nicht) */
function kmMeasure(n){if(!n)return null;if(n in KM.box)return KM.box[n];const P=kmProbe(n);if(!P){KM.box[n]=null;return null;}
  const S=800,m=P.m||1,ox=P.ox!=null?P.ox:400,oy=P.oy!=null?P.oy:600,c=kmMC||(kmMC=mkCanvas(S,S)),x=c.getContext('2d',{willReadFrequently:true});
  x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,S,S);x.setTransform(m,0,0,m,ox,oy);x.save();try{P.f(x);}catch(e){}x.restore();x.setTransform(1,0,0,1,0,0);
  const d=x.getImageData(0,0,S,S).data;let a=S,b=S,r=-1,u=-1;
  for(let j=0;j<S;j++)for(let i=0;i<S;i++)if(d[(j*S+i)*4+3]>=110){if(i<a)a=i;if(i>r)r=i;if(j<b)b=j;if(j>u)u=j;}
  return KM.box[n]=r<0?null:[(a-ox)/m,(b-oy)/m,(r+1-ox)/m,(u+1-oy)/m];}
const kmMode=(d,n)=>d.m||(K_PROBE[n]||K_PROBE[d.p]||{}).w&&'w'||(K_PROBE[n]||K_PROBE[d.p]||{}).c&&'c'||'h';
/** Rechteck [x,y,b,h] des Bildes v für Element d (Umriss b der Zeichnung) */
function kmRect(d,n,b,v){const sx=d.sx||1,sy=d.sy||sx,W=(b[2]-b[0])*sx,H=(b[3]-b[1])*sy,md=kmMode(d,n);
  const s=md==='w'?Math.min(W/v.w,1.6*H/v.h):md==='h'?Math.min(H/v.h,1.6*W/v.w):Math.min(W/v.w,H/v.h);
  const dw=v.w*s,dh=v.h*s;let cx=(b[0]+b[2])/2*sx;if(d.fl)cx=-cx;cx+=d.x;
  const by=md==='c'?d.y+(b[1]+b[3])/2*sy+dh/2:d.y+b[3]*sy;return[cx-dw/2,by-dh,dw,dh];}
function kmPick(d){const ks=typeof d.k==='function'?d.k():d.k;if(!ks)return null;
  for(const n of ks){const set=KM.sets[n];if(!set)continue;const b=kmMeasure(n)||kmMeasure(d.p);if(!b)return null;return[n,b,set[set.length>1?kHash(d.x,d.y)%set.length:0]];}return null;}
/** Element als Bild malen (true) – sonst malt der Aufrufer die Zeichnung */
function kmDraw(x,d){const p=kmPick(d);if(!p||!p[2].c)return false;const [n,b,v]=p,r=kmRect(d,n,b,v),img=KSC<.5&&v.cl?v.cl:v.c;
  if(d.a||d.fl){x.save();if(d.a){x.translate(d.x,d.y);x.rotate(d.a);x.translate(-d.x,-d.y);}if(d.fl){x.translate(2*(r[0]+r[2]/2),0);x.scale(-1,1);}x.drawImage(img,r[0],r[1],r[2],r[3]);x.restore();}
  else x.drawImage(img,r[0],r[1],r[2],r[3]);return true;}
/** Bild schrittweise verkleinern (sauberer als ein großer Sprung) */
function kmScale(src,w,h){let c=src,cw=src.naturalWidth||src.width,ch=src.naturalHeight||src.height;w=Math.max(1,Math.round(w));h=Math.max(1,Math.round(h));
  while(cw/2>=w*1.4&&ch/2>=h*1.4){const n=mkCanvas(cw/2,ch/2),q=n.getContext('2d');q.imageSmoothingQuality='high';q.drawImage(c,0,0,n.width,n.height);c=n;cw=n.width;ch=n.height;}
  const n=mkCanvas(w,h),q=n.getContext('2d');q.imageSmoothingQuality='high';q.drawImage(c,0,0,w,h);return n;}
/** Laufende Bilder (Boot, Funde, Brücken): Variante i einer Sorte, verkleinert auf höchstens hpx Pixel Höhe */
function kmRun(n,i,hpx){const set=KM.on&&KM.sets[n];if(!set)return null;const v=set[(i>>>0)%set.length],k=n+'|'+((i>>>0)%set.length)+'|'+hpx;
  let r=KM.run.get(k);if(!r){const h=Math.min(v.h,hpx);r={c:h<v.h?kmScale(v.im,v.w*h/v.h,h):v.im,w:v.w,h:v.h};KM.run.set(k,r);}return r;}
/** Brücke/Steg als Band von A nach B (Bild wird auf die Länge gestreckt) */
function kmBand(x,n,A,B,w){if(!KM.on||!KM.sets[n])return false;if(B[0]<A[0]){const t=A;A=B;B=t;}const r=kmRun(n,kHash(A[0]+B[0],A[1]+B[1]),Math.ceil(w*1.2));if(!r)return false;
  const a=Math.atan2(B[1]-A[1],B[0]-A[0]),L=Math.hypot(B[0]-A[0],B[1]-A[1]),h=w*1.2;x.save();x.translate(A[0],A[1]);x.rotate(a);x.drawImage(r.c,-4,-h/2,L+8,h);x.restore();return true;}
/** Flächen-Texturen (wiese/sand/meer/papier) als Muster in Weltkoordinaten; Kachelgröße teilt die Welt genau */
function kmTexPrep(){const T={};['wiese','sand','meer','papier'].forEach(k=>{const set=KM.sets[k+'_textur'];if(!set)return;const v=set[0];
  const tw=2400/Math.max(1,Math.round(2400/v.w)),th=2400/Math.max(1,Math.round(2400/v.h)),f=.9;T[k]={c:kmScale(v.im,tw*f,th*f),sx:tw/Math.round(tw*f),sy:th/Math.round(th*f)};});
  if(T.wiese||T.sand){const i=REGION_POLY.findIndex(([k])=>k==='wueste');T.wpoly=i>=0?wobble(REGION_POLY[i][1],70,i*2+5):null;T.wbb=T.wpoly&&bbox(T.wpoly);}
  KM.tx=Object.keys(T).some(k=>T[k]&&T[k].c)?T:null;}
function kmFill(x,k,x0,y0,x1,y1,al){const t=KM.tx[k];if(!t)return;x._kmp=x._kmp||{};let p=x._kmp[k];if(!p||p.src!==t.c){p={src:t.c,pat:x.createPattern(t.c,'repeat')};x._kmp[k]=p;}
  x.save();x.globalCompositeOperation='multiply';x.globalAlpha=al;x.fillStyle=p.pat;x.scale(t.sx,t.sy);x.fillRect(x0/t.sx,y0/t.sy,(x1-x0)/t.sx,(y1-y0)/t.sy);x.restore();}
function kmTex(x,x0,y0,x1,y1,ls){const T=KM.tx;
  if(T.meer){x.save();x.beginPath();x.rect(x0,y0,x1-x0,y1-y0);ls.forEach(L=>smoothSub(x,L.poly));x.clip('evenodd');kmFill(x,'meer',x0,y0,x1,y1,.4);x.restore();}
  if(!ls.length)return;const wd=T.wpoly&&hitBB(T.wbb,x0,y0,x1,y1);
  if(T.wiese){x.save();x.beginPath();ls.forEach(L=>smoothSub(x,L.poly));if(wd)smoothSub(x,T.wpoly);x.clip('evenodd');kmFill(x,'wiese',x0,y0,x1,y1,.4);x.restore();}
  if(T.sand&&wd){x.save();smoothPath(x,T.wpoly);x.clip();kmFill(x,'sand',x0,y0,x1,y1,.4);x.restore();}}
/** Beim Start: alle karte/*-Bilder aus js/asset-map.js laden; danach Größen messen, verkleinern, Kacheln erneuern */
KM.load=function(){const A=window.ASSETS,F=(window.ASSET_MAP&&window.ASSET_MAP.files)||{};if(!A||!A.has)return;
  const keys=Object.keys(F).filter(k=>k.indexOf('karte/')===0&&A.has(k));if(!keys.length)return;
  Promise.all(keys.map(k=>new Promise(res=>{const im=new Image();im.decoding='async';const bad=()=>{try{A.fail(k);}catch(e){}res(null);};
    im.onerror=bad;im.onload=()=>{const p=im.decode?im.decode():null;if(p&&p.then)p.then(()=>res([k,im]),()=>res(im.naturalWidth?[k,im]:null));else res([k,im]);};im.src=A.url(k);})))
  .then(l=>{try{kmBuild(l.filter(Boolean));}catch(e){KM.on=false;KM.sets={};}});};
function kmBuild(list){const sets={};
  list.sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0).forEach(([k,im])=>{if(!(im.naturalWidth>0&&im.naturalHeight>0))return;let n=k.slice(6);const m=/^(.+)_([1-4])$/.exec(n);if(m&&!kmProbe(n))n=m[1];
    (sets[n]=sets[n]||[]).push({im,w:im.naturalWidth,h:im.naturalHeight,c:null,cl:null});});
  if(!Object.keys(sets).length)return;KM.sets=sets;
  // Kachel-Rahmen der Elemente mit Bild vergrößern, größte Höhe je Sorte merken
  const maxH={};
  const grow=list=>list.forEach(it=>{const d=it.d;if(!d)return;const all=d.kk||(typeof d.k==='function'?null:d.k);if(!all)return;
    for(const n of all){const set=sets[n];if(!set)continue;const b=kmMeasure(n)||kmMeasure(d.p);if(!b)break;const v=set[set.length>1?kHash(d.x,d.y)%set.length:0],r=kmRect(d,n,b,v);
      maxH[n]=Math.max(maxH[n]||0,r[3]);let c=[[r[0],r[1]],[r[0]+r[2],r[1]],[r[0],r[1]+r[3]],[r[0]+r[2],r[1]+r[3]]];
      if(d.a){const ca=Math.cos(d.a),sa=Math.sin(d.a);c=c.map(([px,py])=>[d.x+(px-d.x)*ca-(py-d.y)*sa,d.y+(px-d.x)*sa+(py-d.y)*ca]);}
      c.forEach(([px,py])=>{it.bb[0]=Math.min(it.bb[0],px-2);it.bb[1]=Math.min(it.bb[1],py-2);it.bb[2]=Math.max(it.bb[2],px+2);it.bb[3]=Math.max(it.bb[3],py+2);});
      if(!d.kk)break;}});
  grow(ITEMS);grow(SEA_ITEMS);IDX=buildIndex(ITEMS);SIDX=buildIndex(SEA_ITEMS);
  for(const n in maxH)sets[n].forEach(v=>{const H=maxH[n];v.c=kmScale(v.im,v.w*Math.min(v.h,H*.9+2)/v.h,Math.min(v.h,H*.9+2));v.cl=H*.9>12?kmScale(v.c,v.c.width*.42,v.c.height*.42):v.c;});
  KM.on=true;kmTexPrep();kmClouds();kmRefresh();}
function kmClouds(){const set=KM.sets.wolke;if(!set)return;const C=set.map(v=>{const c=mkCanvas(360,180),x=c.getContext('2d'),s=Math.min(360/v.w,180/v.h);x.imageSmoothingQuality='high';
    x.drawImage(v.im,(360-v.w*s)/2,(180-v.h*s)/2,v.w*s,v.h*s);return c;});clouds.forEach((c,i)=>{c.img=C[i%C.length];});}
/** Neue Bilder sichtbar machen: sichtbare Kacheln werden nach und nach ersetzt (die alten bleiben so lange stehen), Übersicht im Hintergrund neu */
function kmRefresh(){const v=VW?viewRect(cam.x,cam.y,cam.z):null;
  [L1,L2].forEach(L=>{const keep=new Set();if(v){const r=tileRange(L,v);for(let j=r[1];j<=r[3];j++)for(let i=r[0];i<=r[2];i++)keep.add(tkey(L,i,j));}
    for(const [k,t] of [...L.map]){if(keep.has(k))t.stale=true;else{L.map.delete(k);L.pool.push(t.c);if(L.pool.length>2)L.pool.shift();}}});
  KM.stale=true;if(OV)buildOV(true);}

/* Datenliste aller Zeichen-Elemente */
function addItem(list,y,bb,f,small,d){list.push(d?{y,bb,f,s:!!small,d}:{y,bb,f,s:!!small});}
function buildItems(){
  const items=[],sea=[];
  const keepAt=(x,y)=>KEEP[cellIdx(x,y)]===1;
  const firm=(px,py)=>walkAt(px,py)&&walkAt(px-24,py)&&walkAt(px+24,py)&&walkAt(px,py-20)&&walkAt(px,py+12);
  const ok=(px,py)=>firm(px,py)&&!keepAt(px,py)&&!keepAt(px,py-30);
  const T_=(ext,s=1)=>(px,py)=>[px-ext[0]*s,py-ext[1]*s,px+ext[2]*s,py+ext[3]*s];
  const conBB=T_([22,72,26,8]),palmBB=T_([40,64,42,8]),fernBB=T_([28,18,28,4]),rockBB=T_([16,16,20,9]),treeBB=T_([28,70,34,10]),tfBB=T_([46,86,48,8]),hsBB=T_([10,32,14,3]),dcBB=T_([30,44,32,6]);
  const regAt=(px,py)=>regionAt(px,py);
  const seasonal=(px,py)=>{const r=regAt(px,py);return r==='tal'||r==='laurasia';};
  const KC=['baum_nadel'],KCS=['baum_nadel_schnee','baum_nadel'],KG=['baum_ginkgo'],KGH=['baum_ginkgo_herbst','baum_ginkgo'],KGW=['baum_ginkgo_winter','baum_ginkgo'],KGA=['baum_ginkgo_herbst','baum_ginkgo_winter','baum_ginkgo'];
  const DK=(k,px,py,s,o)=>Object.assign({k,x:px,y:py,sx:s,sy:s,p:Array.isArray(k)?k[0]:null},o); // Sorte & Fußpunkt fürs Ersatzbild
  const addCon=(px,py,s,col,snow)=>{const se=seasonal(px,py);addItem(items,py,conBB(px,py,s),x=>((snow||(se&&SEASON==='winter'))?snowConifer:conifer)(x,px,py,s,col),false,DK(snow?KCS:se?()=>SEASON==='winter'?KCS:KC:KC,px,py,s,{p:'baum_nadel',kk:se?KCS:null}));};
  const addPalm=(px,py,s)=>addItem(items,py,palmBB(px,py,s),x=>palm(x,px,py,s),false,DK(['palmfarn','palme'],px,py,s));
  const addTF=(px,py,s)=>addItem(items,py,tfBB(px,py,s),x=>treeFern(x,px,py,s),false,DK(['baumfarn'],px,py,s));
  const addFern=(px,py,s,col)=>addItem(items,py,fernBB(px,py,s),x=>fern(x,px,py,s,col),true,DK(['farn'],px,py,s));
  const addRock=(px,py,s,c,snow,kn)=>{const se=seasonal(px,py),K=[kn||'fels','fels'],KS=['fels_schnee','fels'];addItem(items,py,rockBB(px,py,s),x=>rock(x,px,py,s,c,snow||(se&&SEASON==='winter')),s<.9,DK(snow?KS:se?()=>SEASON==='winter'?KS:K:K,px,py,s,{p:'fels',kk:se?['fels_schnee',kn||'fels','fels']:null}));};
  const addTuft=(px,py,c)=>{const se=seasonal(px,py);addItem(items,py,[px-8,py-10,px+8,py+1],x=>tuft(x,px,py,se?seasonTuft(c,px):c),true,DK(['grasbueschel'],px,py,1));};
  const addHS=(px,py,s,c)=>addItem(items,py,hsBB(px,py,s),x=>horsetail(x,px,py,s,c),true,DK(['schachtelhalm'],px,py,s));
  const addGinkgo=(px,py,s,v)=>{const se=seasonal(px,py);addItem(items,py,treeBB(px,py,s),x=>se?seasonTree(x,px,py,s,v):ginkgo(x,px,py,s),false,DK(se?()=>SEASON==='herbst'?KGH:SEASON==='winter'?KGW:KG:KG,px,py,s,{p:'baum_ginkgo',kk:se?KGA:null}));};
  const addDicro=(px,py,s,c)=>addItem(items,py,dcBB(px,py,s),x=>dicroidium(x,px,py,s,c),s<.8,DK(['samenfarn'],px,py,s));
  const addShroom=(px,py,c)=>addItem(items,py,[px-10,py-8,px+10,py+2],x=>shrooms(x,px,py,c),true,DK(['pilze'],px,py,1));
  // Streuen je Region (Anzahl pro Mio. Flächeneinheiten)
  const scatterReg=(key,dens,fn)=>{const e=RCELLS[key];if(!e)return;const n=Math.round(dens*e.area/1e6);let k=0,t=0;
    while(k<n&&t<n*12){t++;const px=R(e.bb[0],e.bb[2]),py=R(e.bb[1],e.bb[3]);if(regAt(px,py)!==key||!ok(px,py))continue;fn(px,py);k++;}};
  const G=['#7f9a55','#96ad68','#8aa35f'];
  /* Forscher-Tal */
  scatterReg('tal',60,(px,py)=>addGinkgo(px,py,R(.95,1.35),rnd()));
  scatterReg('tal',24,(px,py)=>addCon(px,py,R(.9,1.35),RP(['#5f7f52','#6f8a5a'])));
  scatterReg('tal',12,(px,py)=>addTF(px,py,R(.9,1.2)));
  scatterReg('tal',45,(px,py)=>addFern(px,py,R(1,1.5)));
  scatterReg('tal',60,(px,py)=>addHS(px,py,R(.9,1.3)));
  scatterReg('tal',14,(px,py)=>addRock(px,py,R(.6,1.2)));
  scatterReg('tal',20,(px,py)=>addShroom(px,py,RP(['#c8553d','#e9b44a','#f3ead6'])));
  scatterReg('tal',330,(px,py)=>addTuft(px,py,RP(G)));
  /* Zentralgebirge */
  scatterReg('gebirge',30,(px,py)=>addRock(px,py,R(.7,1.5),RP(['#b9ad98','#a89c86'])));
  scatterReg('gebirge',22,(px,py)=>addCon(px,py,R(.8,1.2),RP(['#5b7a5a','#627f56'])));
  scatterReg('gebirge',60,(px,py)=>addTuft(px,py,RP(['#8f9a60','#9aa56a'])));
  /* Pangäa-Wüste */
  scatterReg('wueste',20,(px,py)=>{const w=R(50,115),fl=rnd()<.5;addItem(items,py,[px-w-4,py-w*.45,px+w+10,py+w*.14],x=>dune(x,px,py,w,fl),false,DK(['duene'],px,py,w/100,{fl}));});
  scatterReg('wueste',6,(px,py)=>{const w=R(90,190),h=R(50,110);if(!ok(px-w/2,py)||!ok(px+w/2,py))return;addItem(items,py,[px-w*.6,py-h*1.1-8,px+w*.75,py+14],x=>mesa(x,px,py,w,h),false,DK(['tafelberg'],px,py,w/100,{sy:h/100}));});
  scatterReg('wueste',26,(px,py)=>addRock(px,py,R(.7,1.6),RP(['#d9a577','#cf9f78','#c8906a']),false,'fels_rot'));
  scatterReg('wueste',4,(px,py)=>{const s=R(.8,1.1),a=R(-.3,.3);addItem(items,py,[px-50,py-40,px+60,py+14],x=>bones(x,px,py,s,a),false,DK(['knochen_boden'],px,py,s,{a}));});
  scatterReg('wueste',8,(px,py)=>addDicro(px,py,R(.55,.8),'#a8a060'));
  scatterReg('wueste',90,(px,py)=>addTuft(px,py,RP(['#b8a060','#a99a5a','#c2ad6c'])));
  [[2700,4450,1.1],[3900,4700,.9],[3350,4900,1],[2600,4100,.8]].forEach(([px,py,s])=>{if(ok(px,py))addItem(items,py,[px-60*s,py-95*s,px+64*s,py+12],x=>rockArch(x,px,py,s),false,DK(['felsbogen'],px,py,s));});
  /* Tethys-Küste */
  scatterReg('tethys',38,(px,py)=>addPalm(px,py,R(.9,1.4)));
  scatterReg('tethys',36,(px,py)=>addTF(px,py,R(.9,1.4)));
  scatterReg('tethys',70,(px,py)=>addFern(px,py,R(1.1,1.7),RP(['#6f9a50','#7f9f5c'])));
  scatterReg('tethys',40,(px,py)=>addHS(px,py,R(1,1.4)));
  scatterReg('tethys',200,(px,py)=>addTuft(px,py,RP(['#6f9a50','#7f9a55'])));
  /* Laurasia-Wälder */
  scatterReg('laurasia',80,(px,py)=>addCon(px,py,R(1,1.55),RP(['#5f7f52','#6f8a5a','#557552'])));
  scatterReg('laurasia',16,(px,py)=>addGinkgo(px,py,R(1,1.4),rnd()));
  scatterReg('laurasia',30,(px,py)=>addFern(px,py,R(1,1.5)));
  scatterReg('laurasia',10,(px,py)=>addRock(px,py,R(.6,1.2)));
  scatterReg('laurasia',14,(px,py)=>addShroom(px,py,RP(['#c8553d','#e9b44a'])));
  scatterReg('laurasia',180,(px,py)=>addTuft(px,py,RP(G)));
  /* Sibirische Vulkane */
  addItem(items,VOLCANO.y,[VOLCANO.x-VOLCANO.w*.62,VOLCANO.y-VOLCANO.h-20,LAVA[LAVA.length-1][0]+40,LAVA[LAVA.length-1][1]+40],x=>bigVolcano(x),false,DK(['vulkan_gross'],VOLCANO.x,VOLCANO.y,1));
  [[5350,1180,240,170,1],[6380,1180,220,150,0],[5150,2000,200,130,0],[6150,1950,180,120,1],[4900,1350,160,110,0]].forEach(([px,py,w,h,hot])=>{if(!walkAt(px,py)||keepAt(px,py))return;addItem(items,py,[px-w*.6-10,py-h-8,px+w*.6+20,py+h*.12+8],x=>cone(x,px,py,w,h,hot),false,DK(hot?['vulkan_aktiv','vulkan']:['vulkan'],px,py,w/100,{sy:h/100}));});
  scatterReg('vulkan',34,(px,py)=>addRock(px,py,R(.7,1.5),RP(['#5f5650','#6d625a','#544a44']),false,'fels_dunkel'));
  scatterReg('vulkan',10,(px,py)=>{const s=R(.8,1.3),a=R(-.4,.4);addItem(items,py,[px-44*s,py-14*s,px+44*s,py+14*s],x=>lavaCrack(x,px,py,s,a),true,DK(['lavaspalte'],px,py,s,{a}));});
  scatterReg('vulkan',8,(px,py)=>addItem(items,py,[px-18,py-8,px+18,py+8],x=>steamVent(x,px,py),true,DK(['dampfloch'],px,py,1)));
  scatterReg('vulkan',14,(px,py)=>addCon(px,py,R(.8,1.2),'#4f6a4e'));
  scatterReg('vulkan',22,(px,py)=>addFern(px,py,R(1.1,1.6),RP(['#6f9a50','#7f9f5c'])));
  scatterReg('vulkan',70,(px,py)=>addTuft(px,py,RP(['#7f8a5a','#6f7a50'])));
  /* Gondwana-Hochland */
  scatterReg('eis',34,(px,py)=>addCon(px,py,R(.9,1.4),RP(['#4f6f5a','#5b7a62']),true));
  scatterReg('eis',22,(px,py)=>addRock(px,py,R(.7,1.3),'#a9b4ba',true));
  scatterReg('eis',10,(px,py)=>addDicro(px,py,R(.7,1),'#8a9f78'));
  scatterReg('eis',90,(px,py)=>addTuft(px,py,RP(['#b9c9cf','#a7bcc4'])));
  /* Fossilien-Ebene */
  scatterReg('ebene',9,(px,py)=>{const s=R(.8,1.2),a=R(-.4,.4);addItem(items,py,[px-50,py-40,px+60,py+14],x=>bones(x,px,py,s,a),false,DK(['knochen_boden'],px,py,s,{a}));});
  scatterReg('ebene',8,(px,py)=>{const c=RP(['#c8553d','#f0c35a','#5f7f95']);addItem(items,py,[px-4,py-30,px+18,py+2],x=>flagDig(x,px,py,c),false,DK(['grabungsfahne'],px,py,1));});
  scatterReg('ebene',22,(px,py)=>addRock(px,py,R(.6,1.4),RP(['#c9b99a','#b9ad98','#d0c0a0'])));
  scatterReg('ebene',26,(px,py)=>addDicro(px,py,R(.8,1.3)));
  scatterReg('ebene',30,(px,py)=>addHS(px,py,R(.9,1.3),'#8f9a55'));
  scatterReg('ebene',6,(px,py)=>addCon(px,py,R(.9,1.3),'#6f8a5a'));
  scatterReg('ebene',260,(px,py)=>addTuft(px,py,RP(['#a9a060','#98a05a','#b5ad6a'])));
  /* Gondwana-Wälder und weite Steppe */
  scatterReg('gondwald',46,(px,py)=>addDicro(px,py,R(1.2,1.8),RP(['#8aa35f','#7f9a55','#95ad68'])));
  scatterReg('gondwald',30,(px,py)=>addCon(px,py,R(1,1.4),RP(['#5f7f52','#6f8a5a'])));
  scatterReg('gondwald',30,(px,py)=>addFern(px,py,R(1,1.5)));
  scatterReg('gondwald',10,(px,py)=>addTF(px,py,R(.9,1.2)));
  scatterReg('gondwald',160,(px,py)=>addTuft(px,py,RP(G)));
  scatterReg('steppe',14,(px,py)=>addCon(px,py,R(.9,1.3),RP(['#627f56','#71905f'])));
  scatterReg('steppe',14,(px,py)=>addDicro(px,py,R(.9,1.4)));
  scatterReg('steppe',14,(px,py)=>addFern(px,py,R(1,1.4)));
  scatterReg('steppe',10,(px,py)=>addRock(px,py,R(.6,1.2)));
  scatterReg('steppe',20,(px,py)=>addHS(px,py,R(.9,1.3)));
  scatterReg('steppe',150,(px,py)=>addTuft(px,py,RP(G)));
  /* Inseln */
  scatterReg('nordchina',60,(px,py)=>addCon(px,py,R(1,1.5),RP(['#5f7f52','#6f8a5a'])));scatterReg('nordchina',14,(px,py)=>addGinkgo(px,py,R(1,1.3),rnd()));
  scatterReg('nordchina',14,(px,py)=>addRock(px,py,R(.7,1.2)));scatterReg('nordchina',150,(px,py)=>addTuft(px,py,RP(G)));
  ['suedchina','kimmerien','tinsel','pinsel'].forEach(k=>{scatterReg(k,34,(px,py)=>addPalm(px,py,R(.9,1.3)));scatterReg(k,26,(px,py)=>addTF(px,py,R(.9,1.3)));scatterReg(k,40,(px,py)=>addFern(px,py,R(1,1.5)));
    scatterReg(k,14,(px,py)=>addRock(px,py,R(.6,1.1),'#d0c0a0'));scatterReg(k,160,(px,py)=>addTuft(px,py,RP(G)));});
  scatterReg('anning',60,(px,py)=>addTuft(px,py,'#96ad68'));
  LANDS.filter(L=>L.k==='pvulk').forEach(L=>{const [px,py]=[L.hand.c[0]+20,L.hand.c[1]-20];addItem(items,py,[px-150,py-190,px+170,py+20],x=>cone(x,px,py,230,170,true),false,DK(['vulkan_aktiv','vulkan'],px,py,2.3,{sy:1.7}));});
  /* Gebirge (entlang der Kämme) */
  RANGES.forEach(r=>{const cp=r.cp,L=[0];for(let i=1;i<cp.length;i++)L.push(L[i-1]+Math.hypot(cp[i][0]-cp[i-1][0],cp[i][1]-cp[i-1][1]));const tot=L[L.length-1];
    const pal=r.pal==='ICE'?PAL_ICE:r.pal==='R'?PAL_R:PAL_M;
    for(let q=0;q<r.n*3&&q<400;q++){const s=rnd()*tot;let i=1;while(i<L.length-1&&L[i]<s)i++;const u=(s-L[i-1])/(L[i]-L[i-1]||1),a=cp[i-1],b=cp[i];const nx=-(b[1]-a[1]),ny=b[0]-a[0],nl=Math.hypot(nx,ny)||1;
      const off=(rnd()*2-1)*r.w*.62,px=a[0]+(b[0]-a[0])*u+nx/nl*off,py=a[1]+(b[1]-a[1])*u+ny/nl*off+R(20,60);const big=1-Math.abs(off)/(r.w*.62);
      const w=R(130,200)+big*110,h=R(100,150)+big*110;if(!landAt(px,py)||dinAt(px,py)<50)continue;
      let blocked=false;for(const [dx,dy] of [[0,0],[-w*.35,0],[w*.35,0],[0,-h*.5]])if(keepAt(px+dx,py+dy)){blocked=true;break;}if(blocked)continue;
      const snow=r.snow&&(big>.35||r.pal==='ICE'),bk=r.pal==='ICE'?['berg_eis','berg_schnee','berg']:r.pal==='R'?(snow?['berg_rot','berg_schnee','berg']:['berg_rot','berg']):snow?['berg_schnee','berg']:['berg'];
      addItem(items,py,[px-w*.6-10,py-h-4,px+w*.6+20,py+h*.12+8],x=>mountain(x,px,py,w,h,snow,pal),false,DK(bk,px,py,w/100,{sy:h/100}));}});
  /* Wahrzeichen der Stationen */
  for(const id in LM){const p=ST_POS[id];if(!p)continue;const [dx,dy,fn,ys,sc]=LM[id];const cx=p[0]+dx,cy=p[1]+dy;const st=DATA.station(id);const k=sc||1;const big=seaSt(st)||k!==1;
    const lk=['wahrzeichen_'+id].concat(LM_ALIAS[id]||[]);
    if(id==='anning'){addItem(items,p[1]+60,[p[0]-280,p[1]-340,p[0]+320,p[1]+160],x=>{x.save();x.translate(p[0]-4250,p[1]-4190);lmAnning(x,4250,4190);x.restore();},false,DK(lk,p[0],p[1],1,{m:'b'}));continue;}
    addItem(items,ys!=null?p[1]+ys:cy,big?[cx-300*k,cy-320*k,cx+380*k,cy+160*k]:[cx-150,cy-180,cx+160,cy+60],k===1?x=>fn(x,cx,cy):x=>{x.save();x.translate(cx,cy);x.scale(k,k);x.translate(-cx,-cy);fn(x,cx,cy);x.restore();},false,DK(lk,cx,cy,k,{m:'b'}));}
  addItem(sea,6300,[1040,6140,1360,6460],x=>compassRose(x,1200,6300),false,DK(['kompassrose'],1200,6300,1));
  // festgemachte Ruderboote an den Anlegern
  DOCKS.forEach(d=>{const side=[-d.dir[1],d.dir[0]];const bx=d.end[0]-d.dir[0]*30+side[0]*54,by=d.end[1]-d.dir[1]*30+side[1]*54;const fl=d.dir[0]<-.3;
    if(landAt(bx,by))return;addItem(items,by,[bx-60,by-20,bx+60,by+16],x=>rowboat(x,bx,by,fl),false,DK(['ruderboot'],bx,by,1,{fl}));});
  /* Meer: Wellen, Korallen, Seetang, Ammoniten-Schalen */
  for(let i=0;i<3000;i++){const px=rnd()*WW,py=rnd()*WH;if(distAt(px,py)<40)continue;addItem(sea,py,[px-2,py-9,px+42,py+9],x=>wave(x,px,py),true,DK(['welle'],px,py,1));}
  const TM=REG_KEYS.indexOf('tmeer');
  for(let i=0,t=0;i<520&&t<20000;t++){const px=R(4400,9200),py=R(1800,5900),dv=distAt(px,py);if(dv<90||dv>700||regionAt(px,py)!=='tmeer'||!navAt(px,py)&&dv<64)continue;i++;const s=R(.8,1.6);
    if(rnd()<.6){const cols=RP([['#e98f7a','#f0a08a','#f5c7b0'],['#e98fa0','#b58cbd','#f0a08a'],['#f0c35a','#e7a17a','#e98f7a']]);addItem(sea,py,[px-20*s,py-16*s,px+22*s,py+10*s],x=>coral(x,px,py,s,cols),true,DK(['koralle'],px,py,s));}
    else addItem(sea,py,[px-14*s,py-34*s,px+14*s,py+4],x=>kelp(x,px,py,s),true,DK(['seetang'],px,py,s));}
  for(let i=0,t=0;i<160&&t<8000;t++){const px=rnd()*WW,py=rnd()*WH,dv=distAt(px,py);if(dv<80||dv>420||REGG[md(Math.floor(py/BG),BGH)*BGW+md(Math.floor(px/BG),BGW)]===TM)continue;i++;const s=R(.8,1.4);addItem(sea,py,[px-14*s,py-34*s,px+14*s,py+4],x=>kelp(x,px,py,s),true,DK(['seetang'],px,py,s));}
  seasonItems(items,{ok,regAt});
  items.sort((a,b)=>a.y-b.y);sea.sort((a,b)=>a.y-b.y);ITEMS=items;SEA_ITEMS=sea;
  IDX=buildIndex(ITEMS);SIDX=buildIndex(SEA_ITEMS);
}
function buildIndex(list){const cells=Array.from({length:BKW*BKH},()=>[]);
  list.forEach((it,i)=>{const i0=DW.clamp(Math.floor(it.bb[0]/BK),0,BKW-1),i1=DW.clamp(Math.floor(it.bb[2]/BK),0,BKW-1),j0=DW.clamp(Math.floor(it.bb[1]/BK),0,BKH-1),j1=DW.clamp(Math.floor(it.bb[3]/BK),0,BKH-1);
    for(let j=j0;j<=j1;j++)for(let q=i0;q<=i1;q++)cells[j*BKW+q].push(i);});return cells;}
let QSTAMP=1;const QSEEN=new Uint32Array(200000);
function query(list,index,x0,y0,x1,y1){QSTAMP++;const out=[];const i0=DW.clamp(Math.floor(x0/BK),0,BKW-1),i1=DW.clamp(Math.floor(x1/BK),0,BKW-1),j0=DW.clamp(Math.floor(y0/BK),0,BKH-1),j1=DW.clamp(Math.floor(y1/BK),0,BKH-1);
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){for(const k of index[j*BKW+i]){if(QSEEN[k]===QSTAMP)continue;QSEEN[k]=QSTAMP;out.push(k);}}
  out.sort((a,b)=>a-b);return out.map(k=>list[k]);}

/* ---------------- Zeichnen eines Weltausschnitts (für Kacheln & Übersicht), auch über die Ränder ---------------- */
function drawWash(x,x0,y0,x1,y1){const a=Math.max(0,x0),b=Math.max(0,y0),c=Math.min(WW,x1),d=Math.min(WH,y1);if(c<=a||d<=b)return; // an den Nähten 2 Einheiten Überlappung (deckend, daher unsichtbar)
  const ea=a===0?2:0,eb=b===0?2:0,ec=c===WW?2:0,ed=d===WH?2:0;x.drawImage(WASH,a/MS,b/MS,(c-a)/MS,(d-b)/MS,a-ea,b-eb,c-a+ea+ec,d-b+eb+ed);}
const hitBB=(bb,x0,y0,x1,y1)=>bb[2]>=x0&&bb[0]<=x1&&bb[3]>=y0&&bb[1]<=y1;
function drawWorld(x,x0,y0,x1,y1,sc){
  x.fillStyle='#7cb0c4';x.fillRect(x0,y0,x1-x0,y1-y0);
  for(let ky=Math.floor(y0/WH);ky<=Math.floor((y1-1e-6)/WH);ky++)for(let kx=Math.floor(x0/WW);kx<=Math.floor((x1-1e-6)/WW);kx++){
    const ox=kx*WW,oy=ky*WH,a=Math.max(0,x0-ox),b=Math.max(0,y0-oy),c=Math.min(WW,x1-ox),d=Math.min(WH,y1-oy);if(c<=a||d<=b)continue;
    x.save();x.translate(ox,oy);drawCanon(x,a,b,c,d,sc);x.restore();}
  if(KM.tx&&KM.tx.papier)kmFill(x,'papier',x0,y0,x1,y1,.3);
  // Papierkorn + Wasserfarben-Textur (Muster passt genau in die Welt: 800 Einheiten)
  x.save();x.globalCompositeOperation='multiply';x.globalAlpha=.18;x.fillStyle=x._nt||(x._nt=x.createPattern(NT,'repeat'));const ps=800/512;x.scale(ps,ps);x.fillRect(x0/ps,y0/ps,(x1-x0)/ps,(y1-y0)/ps);x.restore();
  x.save();x.setTransform(1,0,0,1,0,0);x.globalAlpha=.55*DW.clamp(sc/.9,.25,1);x.fillStyle=x._gr||(x._gr=x.createPattern(GR,'repeat'));x.fillRect(0,0,x.canvas.width,x.canvas.height);x.restore();
  // Falten der Karte
  x.save();x.strokeStyle='rgba(90,70,40,.07)';x.lineWidth=4;for(let v=Math.ceil((x0-1200)/2400)*2400+1200;v<=x1;v+=2400){x.beginPath();x.moveTo(v,y0);x.lineTo(v,y1);x.stroke();}
  for(let v=Math.ceil((y0-1200)/2400)*2400+1200;v<=y1;v+=2400){x.beginPath();x.moveTo(x0,v);x.lineTo(x1,v);x.stroke();}x.restore();
}
let NOITEMS=false;
function drawCanon(x,x0,y0,x1,y1,sc){
  const lod=sc>=.5;KSC=sc;
  drawWash(x,x0,y0,x1,y1);
  x.lineCap='round';x.lineJoin='round';x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=2.2;
  for(const it of query(SEA_ITEMS,SIDX,x0,y0,x1,y1)){if(it.s&&!lod)continue;if(!hitBB(it.bb,x0,y0,x1,y1))continue;if(!(KM.on&&it.d&&kmDraw(x,it.d)))it.f(x);x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=2.2;}
  const ls=LANDS.filter(l=>hitBB(l.bb,x0-60,y0-60,x1+60,y1+60));
  x.lineJoin='round';ls.forEach(L=>{x.strokeStyle=L.reg==='wueste'?'#efdcab':'#e7d3a2';x.lineWidth=44;smoothPath(x,L.poly);x.stroke();});
  if(ls.length){x.save();x.beginPath();ls.forEach(L=>smoothSub(x,L.poly));x.clip();drawWash(x,x0,y0,x1,y1);
    // Flüsse (werden zur Mündung breiter) und Seen
    for(const r of RIVERS){if(!hitBB(r.bb,x0,y0,x1,y1))continue;drawRiver(x,r);}
    x.restore();}
  ls.forEach(L=>{x.strokeStyle='rgba(110,88,58,.42)';x.lineWidth=2.2;smoothPath(x,L.poly);x.stroke();});
  for(const L of LAKES){if(!hitBB([L.x-L.rx-40,L.y-L.ry-40,L.x+L.rx+40,L.y+L.ry+40],x0,y0,x1,y1))continue;x.save();if(L.salt)saltDraw(x,L);else if(L.ice)iceLakeDraw(x,L);else lakeDraw(x,L);x.restore();}
  if(KM.tx)kmTex(x,x0,y0,x1,y1,ls); // eigene Flächen-Texturen (nur wenn Bilder da sind)
  // Wege
  x.save();x.lineCap='round';x.lineJoin='round';
  for(const r of ROADS){if(!hitBB(r.bb,x0,y0,x1,y1))continue;x.beginPath();r.pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));
    x.strokeStyle=r.st[0];x.lineWidth=26;x.stroke();x.strokeStyle=r.st[1];x.lineWidth=20;x.stroke();
    if(lod){x.strokeStyle=r.st[2];x.lineWidth=2.4;x.setLineDash([2,14]);x.stroke();x.setLineDash([]);}}
  x.restore();
  for(const b of BRIDGES){if(!hitBB([Math.min(b.A[0],b.B[0])-50,Math.min(b.A[1],b.B[1])-50,Math.max(b.A[0],b.B[0])+50,Math.max(b.A[1],b.B[1])+50],x0,y0,x1,y1))continue;b.hang?kmBand(x,'haengebruecke',b.A,b.B,32)||hangBridge(x,b.A,b.B):kmBand(x,'bruecke',b.A,b.B,32)||bridge(x,b.A,b.B,32);}
  DOCKS.forEach(d=>{if(hitBB([Math.min(d.start[0],d.end[0])-80,Math.min(d.start[1],d.end[1])-80,Math.max(d.start[0],d.end[0])+80,Math.max(d.start[1],d.end[1])+80],x0,y0,x1,y1)&&!kmBand(x,'steg',d.start,d.end,30))jetty(x,d.start,d.end);});
  if(!NOITEMS)for(const it of query(ITEMS,IDX,x0,y0,x1,y1)){if(it.s&&!lod)continue;if(!hitBB(it.bb,x0,y0,x1,y1))continue;if(!(KM.on&&it.d&&kmDraw(x,it.d)))it.f(x);}
}
function drawRiver(x,r){const p=r.cp,n=p.length,seg=6;
  const width=i=>r.w0+(r.w1-r.w0)*(i/(n-1));
  x.lineCap='round';x.lineJoin='round';
  for(let pass=0;pass<2;pass++)for(let i=0;i<n-1;i+=seg){const j=Math.min(n-1,i+seg);x.beginPath();x.moveTo(p[i][0],p[i][1]);for(let q=i+1;q<=j;q++)x.lineTo(p[q][0],p[q][1]);
    const w=width((i+j)/2);if(pass===0){x.strokeStyle='#e7d9b0';x.lineWidth=w+12;}else{x.strokeStyle='#8cc3cf';x.lineWidth=w;}x.stroke();}
  x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=4;x.setLineDash([12,16]);x.beginPath();p.forEach((q,i)=>i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]));x.stroke();x.setLineDash([]);}

/* ---------------- Kacheln (LRU), Kachelgrößen teilen die Welt exakt ---------------- */
const L2={size:800,sc:.9,pad:16,cap:20,map:new Map(),pool:[],ni:WW/800,nj:WH/800};
const L1={size:2400,sc:.36,pad:24,cap:12,map:new Map(),pool:[],ni:WW/2400,nj:WH/2400};
let frameNo=0, tileMs=[];
const tkey=(L,i,j)=>md(i,L.ni)+','+md(j,L.nj);
function tileRender(L,i,j){const t0=performance.now();i=md(i,L.ni);j=md(j,L.nj);
  const x0=i*L.size-L.pad,y0=j*L.size-L.pad,x1=(i+1)*L.size+L.pad,y1=(j+1)*L.size+L.pad,px=Math.ceil((L.size+2*L.pad)*L.sc);
  let c=L.pool.pop();if(!c||c.width!==px)c=mkCanvas(px,px);const x=c.getContext('2d');x.setTransform(L.sc,0,0,L.sc,-x0*L.sc,-y0*L.sc);x.imageSmoothingEnabled=true;
  drawWorld(x,x0,y0,x1,y1,L.sc);x.setTransform(1,0,0,1,0,0);
  L.map.set(i+','+j,{c,i,j,used:frameNo});
  while(L.map.size>L.cap){let ok=null,ou=1e18;for(const [k,v] of L.map)if(v.used<ou){ou=v.used;ok=k;}const v=L.map.get(ok);L.map.delete(ok);L.pool.push(v.c);if(L.pool.length>2)L.pool.shift();}
  const ms=performance.now()-t0;tileMs.push(ms);if(tileMs.length>60)tileMs.shift();STAT.tiles=(STAT.tiles||0)+1;return ms;}
function tileRange(L,v){return[Math.floor(v[0]/L.size),Math.floor(v[1]/L.size),Math.floor(v[2]/L.size),Math.floor(v[3]/L.size)];}
function drawTiles(L,v){const [i0,j0,i1,j1]=tileRange(L,v),e=1.5;
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const t=L.map.get(tkey(L,i,j));if(!t)continue;t.used=frameNo;
    ctx.drawImage(t.c,(L.pad-e)*L.sc,(L.pad-e)*L.sc,(L.size+2*e)*L.sc,(L.size+2*e)*L.sc,i*L.size-e,j*L.size-e,L.size+2*e,L.size+2*e);}}
function tileCount(L,v){const r=tileRange(L,v);return(r[2]-r[0]+1)*(r[3]-r[1]+1);}
function allTiles(L,v){const r=tileRange(L,v);for(let j=r[1];j<=r[3];j++)for(let i=r[0];i<=r[2];i++)if(!L.map.has(tkey(L,i,j)))return false;return true;}
function drawOV(x,v){ // Übersichtsbild, so oft wie nötig nebeneinander
  for(let ky=Math.floor(v[1]/WH);ky<=Math.floor(v[3]/WH);ky++)for(let kx=Math.floor(v[0]/WW);kx<=Math.floor(v[2]/WW);kx++){const ox=kx*WW,oy=ky*WH;
    const a=Math.max(ox,v[0]-4),b=Math.max(oy,v[1]-4),c=Math.min(ox+WW,v[2]+4),d=Math.min(oy+WH,v[3]+4);if(c<=a||d<=b)continue;
    x.drawImage(OV,(a-ox)*OVS,(b-oy)*OVS,(c-a)*OVS,(d-b)*OVS,a-.5,b-.5,c-a+1,d-b+1);}}

/* ---------------- Nebel (läuft über die Ränder weiter) ---------------- */
let FOG=new Uint8Array(FW*FH), SF=new Float32Array(FW*FH), FOGCV=null, FOGX=null, FOGIM=null, FN1=null, FN2=null, fogDirty=true, fogSaveT=0, fogPct=0;
function fogEnc(){let s='';for(let k=0;k<FOG.length;k+=4)s+=(FOG[k]|FOG[k+1]<<1|FOG[k+2]<<2|FOG[k+3]<<3).toString(16);return s;}
function fogDec(s){if(typeof s!=='string'||s.length!==FOG.length/4)return false;for(let i=0;i<s.length;i++){const v=parseInt(s[i],16)||0;for(let b=0;b<4;b++)FOG[i*4+b]=(v>>b)&1;}return true;}
function tileNoise(fn,x,y){ // nahtloses Rauschen: vier Kopien gemischt
  const u=x/WW,v=y/WH;return fn(x,y)*(1-u)*(1-v)+fn(x-WW,y)*u*(1-v)+fn(x,y-WH)*(1-u)*v+fn(x-WW,y-WH)*u*v;}
function fogBuild(){FOGCV=mkCanvas(FCW,FCH);FOGX=FOGCV.getContext('2d');FOGIM=FOGX.createImageData(FCW,FCH);FN1=new Float32Array(FCW*FCH);FN2=new Float32Array(FCW*FCH);
  const fb=(a,b)=>(DW.noise2(a,b)*.5+DW.noise2(a*2.1+3,b*2.1)*.3+DW.noise2(a*4.3,b*4.3+7)*.2);
  const n1=(x,y)=>fb(x*.004,y*.004),n2=(x,y)=>fb(x*.0017+40,y*.0017);
  for(let j=0;j<FCH;j++)for(let i=0;i<FCW;i++){const wx=(i+.5)*FPX,wy=(j+.5)*FPX,k=j*FCW+i;FN1[k]=.5+(tileNoise(n1,wx,wy)-.5)*1.3;FN2[k]=.5+(tileNoise(n2,wx,wy)-.5)*1.4;}}
function fogSmooth(){const K=[1,4,6,4,1],tmp=new Float32Array(FW*FH);
  for(let j=0;j<FH;j++)for(let i=0;i<FW;i++){let a=0;for(let q=-2;q<=2;q++)a+=FOG[j*FW+md(i+q,FW)]*K[q+2];tmp[j*FW+i]=a/16;}
  for(let j=0;j<FH;j++)for(let i=0;i<FW;i++){let a=0;for(let q=-2;q<=2;q++)a+=tmp[md(j+q,FH)*FW+i]*K[q+2];SF[j*FW+i]=a/16;}}
function sfAt(gx,gy){const i0=Math.floor(gx),j0=Math.floor(gy),fx=gx-i0,fy=gy-j0,a=md(i0,FW),b=md(i0+1,FW),c=md(j0,FH),d=md(j0+1,FH);
  return(SF[c*FW+a]*(1-fx)+SF[c*FW+b]*fx)*(1-fy)+(SF[d*FW+a]*(1-fx)+SF[d*FW+b]*fx)*fy;}
function fogRender(){fogSmooth();const d=FOGIM.data;
  for(let j=0;j<FCH;j++){const gy=(j+.5)*FPX/FC-.5;
    for(let i=0;i<FCW;i++){const r=sfAt((i+.5)*FPX/FC-.5,gy);
      const k=j*FCW+i,q=k*4,v=r+(FN1[k]-.5)*.55,a=1-smooth(.3,.62,v);
      if(a<=0.004){d[q+3]=0;continue;}
      const sh=FN2[k],rim=Math.max(0,1-Math.abs(a-.28)/.2)*.55;
      d[q]=251-(1-sh)*30-rim*38;d[q+1]=246-(1-sh)*27-rim*34;d[q+2]=233-(1-sh)*14-rim*24;d[q+3]=Math.min(1,a*1.3)*(200+sh*50);}}
  FOGX.putImageData(FOGIM,0,0);fogDirty=false;
  let n=0;for(let k=0;k<FOG.length;k++)n+=FOG[k];fogPct=n/FOG.length;}
function fogAt(x,y){return 1-sfAt(x/FC-.5,y/FC-.5);}
function reveal(x,y,r){let ch=false;const i0=Math.floor((x-r)/FC),i1=Math.floor((x+r)/FC),j0=Math.floor((y-r)/FC),j1=Math.floor((y+r)/FC);
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const k=md(j,FH)*FW+md(i,FW);if(FOG[k])continue;if(Math.hypot((i+.5)*FC-x,(j+.5)*FC-y)<r){FOG[k]=1;ch=true;}}
  if(ch){fogDirty=true;fogSaveT=1.5;}return ch;}
let VF=null;
function drawFog(x,v){ // Nebel pixelgenau in einen Ausschnitt-Puffer kopieren (keine Nähte), dann einmal weich vergrößern
  const i0=Math.floor(v[0]/FPX)-1,j0=Math.floor(v[1]/FPX)-1,i1=Math.ceil(v[2]/FPX)+1,j1=Math.ceil(v[3]/FPX)+1,w=i1-i0,h=j1-j0;
  if(!VF||VF.width<w||VF.height<h)VF=mkCanvas(Math.max(w,VF?VF.width:0),Math.max(h,VF?VF.height:0));const vx=VF.getContext('2d');vx.clearRect(0,0,w,h);
  for(let ky=Math.floor(j0/FCH);ky<=Math.floor(j1/FCH);ky++)for(let kx=Math.floor(i0/FCW);kx<=Math.floor(i1/FCW);kx++)vx.drawImage(FOGCV,kx*FCW-i0,ky*FCH-j0);
  x.drawImage(VF,0,0,w,h,i0*FPX,j0*FPX,w*FPX,h*FPX);}

/* ---------------- Zustand ---------------- */
let cv,ctx,DPR=1,VW=0,VH=0,worldEl=null;
const cam={x:4450,y:4000,z:.8,tx:4450,ty:4000,tz:.8,follow:true};
const hero={x:4450,y:4060,mode:'walk',comp:0,legs:[],leg:null,ph:0,flip:false,moving:false,trail:[],wake:[],heading:0,boatA:0,regK:null,ping:0,pending:null,trip:null,mult:1};
let heroFrames=[], pipFrames=[], ambient=[], clouds=[], markerImgs={}, lastT=0, running=false, onArrive=null, SPEED=1, disc=[], pops=[], labelW={};
const pointers=new Map(); let pan=null, pinch=null, tapStart=null;
let frameTimes=[], lastRegionCheck=0, curRegion=null, pipW=56, pangaeaNews=false, globeA=0, globeC=null, globeAt=null, wholeT=0;

function markerImage(st){
  const s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128">${ART.icon(st.icon).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg>`;
  return ART.toImage(s,'marker|'+st.id);
}
function artOf(id){const a=DATA.animal(id);return a?a.art:id;}
const cpPts=p=>p.map(q=>[q[0],q[1]]);

W.init=function(){
  const t0=performance.now();
  worldEl=DW.$('#world');cv=DW.$('#worldCanvas'); ctx=cv.getContext('2d');
  NT=noiseTile(512,3,4);GR=grainTile(256);
  buildGeo();STAT.geo=performance.now()-t0;
  envUpdate();SEASON=ENV.on?ENV.season:null;RS0=RS;
  buildWash();STAT.wash=performance.now()-t0;
  buildItems();STAT.items=performance.now()-t0;
  buildOV();STAT.overview=performance.now()-t0;
  const av=ART.AVATARS.find(a=>a.id===DW.state.avatar)||ART.AVATARS[0];
  heroFrames=ART.avatarFrames(av,8);
  pipFrames=ART.frames('protoceratops',6,{shadow:false});
  if(window.QUEST&&QUEST.applyPip) QUEST.applyPip();
  DATA.STATIONS.forEach(s=>markerImgs[s.id]=markerImage(s));
  // Kartenversion: alte Spielstände behalten alles außer Position, Boot und Nebel
  if(DW.state.mapVersion!==MAPV){const had=!!(DW.state.pos||DW.state.fog||DW.state.started&&DW.totalStars&&DW.totalStars()>0);
    DW.state.pos=null;DW.state.boat=false;DW.state.fog=null;DW.state.mapVersion=MAPV;DW.save();pangaeaNews=had;}
  buildLife();
  const p=DW.state.pos,st=ST_POS.forscher;hero.x=st[0];hero.y=st[1];
  if(p&&DW.state.boat){const q=nearestNavPt(md(p[0],WW),md(p[1],WH));hero.x=q[0];hero.y=q[1];hero.mode='boat';hero.comp=null;hero.boatA=1;}
  else if(p&&walkAt(p[0],p[1])&&compOfPoint(p[0],p[1])!=null){hero.x=md(p[0],WW);hero.y=md(p[1],WH);}
  if(hero.mode==='walk')hero.comp=compOfPoint(hero.x,hero.y);
  curRegion=heroRegion();hero.regK=regionAt(hero.x,hero.y);
  if(!fogDec(DW.state.fog)){FOG.fill(0);reveal(st[0],st[1]+60,1100);['zeitportal','zuhause','ausflug'].forEach(id=>reveal(ST_POS[id][0],ST_POS[id][1],560));}
  reveal(hero.x,hero.y,700);DW.state.fog=fogEnc();fogBuild();fogRender();
  cam.x=cam.tx=hero.x;cam.y=cam.ty=hero.y-40;
  resize(); window.addEventListener('resize',resize);
  cv.addEventListener('pointerdown',pDown); cv.addEventListener('pointermove',pMove); cv.addEventListener('pointerup',pUp); cv.addEventListener('pointercancel',pUp);
  cv.addEventListener('wheel',e=>{e.preventDefault();cam.tz=DW.clamp(cam.tz*(e.deltaY>0?.9:1.1),minZ(),1.6);userZoom();},{passive:false});
  const v=viewRect(cam.x,cam.y,cam.z),L=pickLevel(v);if(L){const [i0,j0,i1,j1]=tileRange(L,v);for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){if(performance.now()-t0>1150)break;tileRender(L,i,j);}}
  STAT.init=performance.now()-t0;
  if(document.fonts&&document.fonts.status!=='loaded')document.fonts.ready.then(()=>{L1.map.clear();L2.map.clear();}).catch(()=>{});
  if(pangaeaNews)setTimeout(()=>{const f=()=>DW.say('Oh! Unsere Insel hat sich verwandelt. Jetzt ist sie Pangäa, ein riesiger Kontinent!',{queue:true});tourBusy()?TOUR.later(f):f();},3800);
  running=true; lastT=performance.now(); initT=lastT; requestAnimationFrame(loop);
  KM.load(); // eigene Kartenbilder (grafiken-neu/karte/) laden – bis dahin malt die Karte wie bisher
};
W.setAvatar=function(){const av=ART.AVATARS.find(a=>a.id===DW.state.avatar)||ART.AVATARS[0];heroFrames=ART.avatarFrames(av,8);};
function baseZ(){return DW.clamp(Math.min(VW,VH)/900,.45,1.1);}
function minZ(){return Math.min(VW/WW,VH/WH)*.96;}
function resize(){DPR=Math.min(2,window.devicePixelRatio||1);VW=cv.clientWidth;VH=cv.clientHeight;cv.width=VW*DPR;cv.height=VH*DPR;
  if(!W._z0){cam.z=cam.tz=baseZ();W._z0=true;} cam.tz=Math.max(cam.tz,minZ());
  L2.sc=DPR>1.5?1.05:.9;const px=(L2.size+2*L2.pad)*L2.sc;L2.cap=DW.clamp(Math.floor(110e6/(px*px*4)),14,30);}
function cloudImg(i){const c=mkCanvas(360,180);const x=c.getContext('2d');
  if(hasFilter)x.filter='blur(6px)';x.fillStyle='rgba(255,255,255,.92)';const r=()=>Math.random();
  for(let k=0;k<7;k++){x.beginPath();x.ellipse(80+k*30+r()*20,90+(r()-.5)*30,40+r()*30,26+r()*18,0,0,TAU);x.fill();}
  return c;}

/* ---------------- Leben: Tiere der Trias & des Perms, Wolken, Entdeckungen ---------------- */
const LAND_ANIMALS=[
  ['plateosaurus',4300,4150,190,130,14],['plateosaurus',4380,4210,160,110,14],['coelophysis',4700,4050,80,110,30],['eoraptor',4550,4420,50,90,34],['cynognathus',3950,4250,60,90,22],['lystrosaurus',4850,4500,62,100,16],
  ['herrerasaurus',3350,3620,100,120,20],
  ['postosuchus',3300,4300,110,160,18],['coelophysis',3000,4450,90,200,32],['coelophysis',3080,4520,80,200,32],['scutosaurus',3700,4850,90,120,12],
  ['plateosaurus',5700,4400,170,140,14],['edaphosaurus',5950,4450,110,120,16],['eoraptor',5500,4300,50,100,34],['dimetrodon',6050,4850,100,110,16],
  ['plateosaurus',3500,2600,170,160,14],['coelophysis',3900,2500,80,140,30],['postosuchus',3200,2900,110,130,16],['cynognathus',4200,2750,60,120,22],
  ['scutosaurus',5200,1750,90,140,12],['scutosaurus',5320,1800,80,140,12],['gorgonops',5900,1850,90,140,22],['dimetrodon',5500,1400,100,120,16],['moschops',6300,1850,100,110,12],
  ['lystrosaurus',4900,5750,64,140,16],['lystrosaurus',5000,5800,58,140,16],['lystrosaurus',5700,6050,62,140,16],['cynognathus',5400,5650,62,120,22],
  ['lystrosaurus',4300,5150,62,130,16],['moschops',4600,5150,110,140,12],['moschops',4720,5200,95,140,12],['gorgonops',4000,5300,90,140,22],['cynognathus',4400,5400,60,120,22],
  ['herrerasaurus',6600,5600,110,150,20],['eoraptor',6900,5500,50,120,34],['lystrosaurus',6300,5400,60,120,16],
  ['coelophysis',7600,1300,80,160,30],['plateosaurus',7500,1100,160,140,14],['dimetrodon',8050,2700,100,140,16],['eoraptor',7100,3650,50,120,34],['diplocaulus',7800,4600,60,90,14],
  ['edaphosaurus',1150,2350,100,110,14],['diplocaulus',900,5250,55,80,14]];
const SEA_ANIMALS=[['nothosaurus',5900,3500,120,260,18],['nothosaurus',6500,3900,120,300,18],['nothosaurus',7000,2600,110,260,16],['placodus',6980,4450,80,140,10],['placodus',6600,4800,80,200,10],
  ['ichthyosaurus',6400,3000,90,300,26],['ichthyosaurus',6520,3080,80,300,26],['ammonit',7160,2800,40,120,8],['ammonit',7300,2860,36,120,8],['ammonit',6800,5000,36,140,8],
  ['shonisaurus',1300,3300,260,420,16],['shonisaurus',9000,4200,260,420,16],['helicoprion',1000,4300,150,300,18],['helicoprion',8800,1000,150,300,18],['xenacanthus',5200,3800,70,160,16],
  ['ichthyosaurus',1600,1200,90,300,24],['nothosaurus',8900,6600,110,300,16],['shonisaurus',4800,200,260,420,14],['helicoprion',3000,6800,150,300,18]];
const FLY_ANIMALS=[['meganeura',4300,4200,260,50,.09],['meganeura',5800,4300,300,50,.08],['coelurosauravus',3600,2600,300,60,.06],['meganeura',4400,5100,280,50,.09],
  ['coelurosauravus',5800,4600,340,60,.06],['meganeura',3300,4500,300,50,.08],['coelurosauravus',6900,5500,300,60,.06],['meganeura',5300,1700,260,50,.08]];
function buildLife(){
  ambient=[];
  LAND_ANIMALS.forEach(([id,x,y,w,r,sp])=>{if(!DATA.animal(id))return;let q=[x,y];if(!walkAt(x,y)){const n=nearestNode(x,y,null);if(n>=0)q=nodePt(n);}
    ambient.push({id,art:artOf(id),frames:null,x:q[0],y:q[1],hx:q[0],hy:q[1],w,r,speed:sp,tx:q[0],ty:q[1],ph:Math.random(),flip:false,wait:Math.random()*4});});
  SEA_ANIMALS.forEach(([id,x,y,w,r,sp])=>{if(!DATA.animal(id))return;const q=nearestNavPt(x,y);ambient.push({id,art:artOf(id),frames:null,swim:true,x:q[0],y:q[1],hx:q[0],hy:q[1],w,r,speed:sp,tx:q[0],ty:q[1],ph:Math.random(),flip:false,wait:Math.random()*3});});
  FLY_ANIMALS.forEach(([id,cx,cy,R_,w,sp],i)=>{if(!DATA.animal(id))return;ambient.push({id,art:artOf(id),frames:null,fly:true,cx,cy,R:R_,a:i*1.3,w,speed:sp,x:cx,y:cy});});
  clouds=[];for(let i=0;i<34;i++)clouds.push({x:Math.random()*WW,y:Math.random()*WH,s:.8+Math.random()*1.1,img:cloudImg(i)});
  disc=[];const R0=Math.random;
  const landSpot=()=>{for(let t=0;t<600;t++){const x=R0()*WW,y=R0()*WH;if(!walkAt(x,y)||!walkAt(x+30,y)||!walkAt(x-30,y)||!walkAt(x,y+20))continue;const c=compOfPoint(x,y);if(c==null)continue;
    if(Object.values(ST_POS).some(p=>Math.hypot(p[0]-x,p[1]-y)<220))continue;if(disc.some(d=>dist([d.x,d.y],[x,y])<600))continue;if(dist([hero.x,hero.y],[x,y])<300)continue;return[x,y];}return null;};
  for(let i=0;i<22;i++){const p=landSpot();if(p)disc.push({t:'glitzer',x:p[0],y:p[1],ph:R0()*6});}
  for(let i=0;i<9;i++){const p=landSpot();if(p)disc.push({t:'busch',x:p[0],y:p[1],ph:R0()*6});}
  for(let i=0,t=0;i<9&&t<800;t++){const x=R0()*WW,y=R0()*WH;if(!navAt(x,y)||distAt(x,y)<140)continue;if(Object.values(ST_POS).some(p=>dist(p,[x,y])<400))continue;if(disc.some(d=>dist([d.x,d.y],[x,y])<1100))continue;disc.push({t:'flasche',x,y,ph:R0()*6});i++;}
}
function frames(a){if(!a.frames)a.frames=ART.frames(a.art,6,a.swim||a.fly?{shadow:false}:undefined);return a.frames;}

/* ---------------- Eingabe ---------------- */
function toWorld(sx,sy){return[cam.x+(sx-VW/2)/cam.z,cam.y+(sy-VH/2)/cam.z];}
function userZoom(){if(hero.trip)hero.trip.user=true;}
function pDown(e){cv.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);
  if(pointers.size===1){tapStart={x:e.clientX,y:e.clientY,t:performance.now()};pan={x:e.clientX,y:e.clientY,cx:cam.tx,cy:cam.ty};}
  else if(pointers.size===2){const [a,b]=[...pointers.values()];pinch={d:Math.hypot(a[0]-b[0],a[1]-b[1]),z:cam.tz};pan=null;tapStart=null;}
  DW.emit('worldtouch');}
function pMove(e){if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,[e.clientX,e.clientY]);
  if(pinch&&pointers.size>=2){const [a,b]=[...pointers.values()];cam.tz=DW.clamp(pinch.z*Math.hypot(a[0]-b[0],a[1]-b[1])/pinch.d,minZ(),1.6);userZoom();return;}
  if(pan){const dx=e.clientX-pan.x,dy=e.clientY-pan.y;if(Math.hypot(dx,dy)>12){tapStart=null;cam.follow=false;cam.tx=pan.cx-dx/cam.z;cam.ty=pan.cy-dy/cam.z;cam.x=cam.tx;cam.y=cam.ty;}}}
function pUp(e){pointers.delete(e.pointerId);if(pointers.size<2)pinch=null;
  if(tapStart&&pointers.size===0){const r=cv.getBoundingClientRect();tap(e.clientX-r.left,e.clientY-r.top);}tapStart=null;if(pointers.size===0)pan=null;}
function normCam(){const sx=-WW*Math.floor(cam.x/WW),sy=-WH*Math.floor(cam.y/WH);if(!sx&&!sy)return;
  cam.x+=sx;cam.tx+=sx;cam.y+=sy;cam.ty+=sy;if(pan){pan.cx+=sx;pan.cy+=sy;}PART.forEach(p=>{p.x+=sx;p.y+=sy;});}
function normHero(){const sx=-WW*Math.floor(hero.x/WW),sy=-WH*Math.floor(hero.y/WH);if(!sx&&!sy)return;hero.x+=sx;hero.y+=sy;
  const L=hero.leg;if(L&&L.pts)L.pts.forEach(p=>{p[0]+=sx;p[1]+=sy;});hero.wake.forEach(p=>{p[0]+=sx;p[1]+=sy;});hero.trail.forEach(p=>{p[0]+=sx;p[1]+=sy;});STAT.seams=(STAT.seams||0)+1;}
const mScale=()=>DW.clamp(.62/cam.z,1,3.4);
function stationAt(wx,wy){const ms=mScale();let best=null,bd=1e9;
  for(const s of DATA.STATIONS){const p0=ST_POS[s.id];if(!p0)continue;const p=[nearX(p0[0],wx),nearY(p0[1],wy)];const fog=fogAt(p0[0],p0[1])>.5;const cy=p[1]-(fog?60:74)*ms;
    const d=Math.hypot(wx-p[0],wy-cy),rad=Math.max(52*ms,34/cam.z);if((d<rad||Math.hypot(wx-p[0],wy-p[1])<50)&&d<bd){bd=d;best=s;}}
  return best;}
function discAt(wx,wy){const r=Math.max(60,26/cam.z);let best=null,bd=r;for(const d of disc){if(d.done)continue;if(fogAt(d.x,d.y)>.6)continue;const q=Math.hypot(wdx(wx,d.x),wdy(wy,d.y-10));if(q<bd){bd=q;best=d;}}return best;}
function tap(sx,sy){
  const [wx,wy]=toWorld(sx,sy);
  DW.emit('closeSpot');
  const s=stationAt(wx,wy);
  if(s){DW.sfx('tap');goStation(s);return;}
  if(W._pip&&hero.mode==='walk'&&!hero.moving&&Math.hypot(wx-W._pip.x,wy-(W._pip.y-W._pip.h*.45))<Math.max(W._pip.h*.7,26/cam.z)){DW.sfx('pop');W._pip.hop=1;DW.emit('piptap');return;}
  const d=discAt(wx,wy);
  if(d){DW.sfx('tap');goTarget(targetAt(d.x,d.y),null);return;}
  for(const a of ambient){if(a.fly||!a.vis)continue;if(fogAt(a.x,a.y)>.5)continue;const ax=nearX(a.x,wx),ay=nearY(a.y,wy);if(wx>ax-a.w/2&&wx<ax+a.w/2&&wy>ay-a.w*.7&&wy<ay+10){DW.sfx('pop');const dd=DATA.animal(a.id);
      if(dd){DW.say(`Schau mal: ${dd.short||dd.n}! ${dd.fact}`);DW.discover(dd.id);} a.hop=1; DW.emit('animaltap',dd?dd.id:a.id); return;}}
  DW.sfx('step'); goTarget(targetAt(wx,wy),null);
}
function targetAt(wx,wy){
  wx=md(wx,WW);wy=md(wy,WH);
  if(walkAt(wx,wy)){const c=compOfPoint(wx,wy);if(c!=null)return{land:true,comp:c,x:wx,y:wy};}
  const l=landAt(wx,wy);
  if(l||distAt(wx,wy)<50){const q=nearestWalk(wx,wy,l?LANDS[l-1].comp:(hero.mode==='walk'?hero.comp:null));if(q)return{land:true,comp:q[2],x:q[0],y:q[1]};}
  const q=nearestNavPt(wx,wy);return{land:false,x:md(q[0],WW),y:md(q[1],WH)};
}
function nearestWalk(x,y,comp){if(comp==null)return null;const ci=Math.floor(x/MS),cj=Math.floor(y/MS);
  for(let r=1;r<50;r++){let best=null,bd=1e18;for(let j=cj-r;j<=cj+r;j+=1)for(let i=ci-r;i<=ci+r;i++){if(Math.max(Math.abs(i-ci),Math.abs(j-cj))!==r)continue;const k=md(j,MH)*MW+md(i,MW);if(WALK[k]!==1)continue;
      const px=(i+.5)*MS,py=(j+.5)*MS;if(compOfPoint(px,py)!==comp)continue;const d=(px-x)**2+(py-y)**2;if(d<bd){bd=d;best=[px,py,comp];}}if(best)return best;}
  return null;}
function stationTarget(s){const a=ANCHOR[s.id];if(seaSt(s))return{land:false,x:a[0],y:a[1],station:s};return{land:true,comp:NCOMPOF(s.id),x:a[0],y:a[1],node:s.id,station:s};}
function goStation(s){goTarget(stationTarget(s),()=>W.arrive(s));}
function goTarget(t,cb){
  if(hero.leg&&(hero.leg.t==='board'||hero.leg.t==='land')){hero.pending={t,cb};return;}
  const legs=plan(t);if(!legs){DW.sfx('no');return;}
  hero.legs=legs;hero.leg=null;onArrive=cb;cam.follow=true;hero.moving=true;hero.markTarget=t.station?null:[t.x,t.y];
  setupTrip(legs);
}
/* Lange Reisen gehen schneller: höchstens ~12 s für den weitesten Weg, sanft beschleunigen und abbremsen */
function setupTrip(legs){let tn=0;const at=[hero.x,hero.y];let prev=at;
  legs.forEach(L=>{if(L.pts&&L.pts.length){tn+=pathLen(L.pts,prev)/(L.t==='sail'?340:230);prev=L.pts[L.pts.length-1];}else if(L.t==='board'||L.t==='land'){tn+=.5;}});
  const T=tn<=4?tn:Math.min(12,4+(tn-4)*.5);hero.mult=Math.max(1,tn/Math.max(.1,T));STAT.lastTrip={tn:+tn.toFixed(2),mult:+hero.mult.toFixed(2)};
  if(hero.mult>1.45){if(!hero.trip)hero.trip={z0:cam.tz,user:false};cam.tz=Math.max(minZ(),Math.min(cam.tz,baseZ()*.7));}}
function endTrip(){if(hero.trip){if(!hero.trip.user)cam.tz=hero.trip.z0;hero.trip=null;}hero.mult=1;}
/* Routenplaner: laufen, einsteigen, segeln, aussteigen */
function plan(t){
  const hp=[hero.x,hero.y],legs=[],K=.72;
  if(hero.mode==='walk'){
    const H=hero.comp;
    const na=nearestNode(hp[0],hp[1],H);
    if(t.land&&t.comp===H){ // gleiches Land: laufen – außer das Boot ist deutlich kürzer
      const nt=t.node!=null?NNAME[t.node]:nearestNode(t.x,t.y,H),dH=na>=0?dj(na).dist:null,walkC=dH&&nt>=0?dH[nt]:0;let best=null,bc=1e18;
      if(walkC>2600){const D=DOCKS.filter(d=>d.comp===H),dT=dj(nt).dist;for(const a of D)for(const b of D){if(a===b)continue;const c=dH[NNAME[a.id]]+dist(a.wp,b.wp)*K+dT[NNAME[b.id]]+900;if(c<bc){bc=c;best=[a,b];}}}
      if(!best||bc>=walkC){legs.push({t:'walk',pts:cpPts(walkPts(hp,[t.x,t.y],t.node,H))});return legs;}
      const [a,b]=best;legs.push({t:'walk',pts:cpPts(walkPts(hp,a.end,a.id+'_e',H))},{t:'board',dock:a},{t:'sail',pts:cpPts([a.end].concat(sailPts(a.wp,b.wp)))},{t:'land',dock:b},{t:'walk',pts:cpPts(walkPts(b.end,[t.x,t.y],t.node,H))});
      const sl=legs[2].pts,last=sl[sl.length-1];sl.push([nearX(b.end[0],last[0]),nearY(b.end[1],last[1])]);return legs;}
    if(na<0)return null;const dH=dj(na).dist;const D1=DOCKS.filter(d=>d.comp===H);if(!D1.length)return null;
    if(t.land){const nt=t.node!=null?NNAME[t.node]:nearestNode(t.x,t.y,t.comp);if(nt==null||nt<0)return null;const dT=dj(nt).dist;const D2=DOCKS.filter(d=>d.comp===t.comp);let best=null,bc=1e18;
      for(const a of D1)for(const b of D2){const c=dH[NNAME[a.id]]+dist(a.wp,b.wp)*K+dT[NNAME[b.id]];if(c<bc){bc=c;best=[a,b];}}
      if(!best)return null;const [a,b]=best;
      legs.push({t:'walk',pts:cpPts(walkPts(hp,a.end,a.id+'_e',H))},{t:'board',dock:a},{t:'sail',pts:cpPts([a.end].concat(sailPts(a.wp,b.wp)))},{t:'land',dock:b},{t:'walk',pts:cpPts(walkPts(b.end,[t.x,t.y],t.node,t.comp))});
      const sl=legs[2].pts,last=sl[sl.length-1];sl.push([nearX(b.end[0],last[0]),nearY(b.end[1],last[1])]);
    }else{let best=null,bc=1e18;for(const a of D1){const c=dH[NNAME[a.id]]+dist(a.wp,[t.x,t.y])*K;if(c<bc){bc=c;best=a;}}
      legs.push({t:'walk',pts:cpPts(walkPts(hp,best.end,best.id+'_e',H))},{t:'board',dock:best},{t:'sail',pts:cpPts([best.end].concat(sailPts(best.wp,[t.x,t.y])))});}
  }else{
    if(!t.land){legs.push({t:'sail',pts:cpPts(sailPts(hp,[t.x,t.y]))});return legs;}
    const nt=t.node!=null?NNAME[t.node]:nearestNode(t.x,t.y,t.comp);if(nt==null||nt<0)return null;const dT=dj(nt).dist;const D2=DOCKS.filter(d=>d.comp===t.comp);let best=null,bc=1e18;
    for(const b of D2){const c=dist(hp,b.wp)*K+dT[NNAME[b.id]];if(c<bc){bc=c;best=b;}}if(!best)return null;
    const sp=sailPts(hp,best.wp),last=sp[sp.length-1];sp.push([nearX(best.end[0],last[0]),nearY(best.end[1],last[1])]);
    legs.push({t:'sail',pts:cpPts(sp)},{t:'land',dock:best},{t:'walk',pts:cpPts(walkPts(best.end,[t.x,t.y],t.node,t.comp))});
  }
  return legs;
}
W.arrive=function(s){hero.moving=false;DW.emit('arrive',s);};
/* Roter Faden: Regionen, Hinführen, Pip */
function regionOfPoint(x,y){const k=regionAt(x,y);return REG_INFO[k]?REG_INFO[k].q:null;}
function heroRegion(){return regionOfPoint(hero.x,hero.y);}
W.region=()=>curRegion;
W.regionName=()=>{const k=regionAt(hero.x,hero.y);return REG_INFO[k]?REG_INFO[k].n:'';};
W.regionOf=id=>{const s=DATA.station(id),p=ST_POS[id];if(!s||!p)return null;return (s.sea||ON_LAND.has(id)&&!REG_INFO[regionAt(p[0],p[1])].q)?'meer':regionOfPoint(p[0],p[1]);};
W.heroPos=()=>[hero.x,hero.y,hero.mode];
W.stationDist=id=>{const a=ANCHOR[id];if(!a)return 1e9;let d=dist(a,[hero.x,hero.y]);const s=DATA.station(id);
  if(hero.mode==='walk'&&(seaSt(s)||NCOMPOF(id)!==hero.comp))d+=1500;return d;};
W.needsBoat=id=>{const s=DATA.station(id);if(!s)return false;if(seaSt(s))return hero.mode!=='boat';return hero.mode==='boat'||NCOMPOF(id)!==hero.comp;};
W.goTo=id=>{const s=DATA.station(id);if(!s||!ANCHOR[id])return false;DW.emit('closeSpot');cam.follow=true;goStation(s);return true;};
W.goNearestDisc=()=>{let best=null,bd=1e18;for(const d of disc){if(d.done||fogAt(d.x,d.y)>.6)continue;if((d.t==='flasche')!==(hero.mode==='boat'))continue;const q=dist([d.x,d.y],[hero.x,hero.y]);if(q<bd){bd=q;best=d;}}
  if(!best||bd>4000)return false;cam.follow=true;goTarget(targetAt(best.x,best.y),null);pops.push({t:'ring',x:best.x,y:best.y,a:0,r:50});return true;};
W.showAnimal=pred=>{let best=null,bd=1e18;for(const a of ambient){if(a.fly||fogAt(a.x,a.y)>.5)continue;if(pred&&!pred(a.id))continue;const q=dist([a.x,a.y],[hero.x,hero.y]);if(q<bd){bd=q;best=a;}}
  if(!best)return null;cam.follow=false;cam.tx=nearX(best.x,cam.x);cam.ty=nearY(best.y-40,cam.y);cam.tz=Math.max(cam.tz,baseZ()*.9);best.hop=1;pops.push({t:'ring',x:best.x,y:best.y,a:0,r:Math.max(50,best.w*.55)});return best.id;};
W.setPip=(frames,w)=>{if(frames&&frames.length)pipFrames=frames;if(w)pipW=w;};
W.goHome=()=>{cam.follow=true;};
W.zoom=f=>{cam.tz=DW.clamp(cam.tz*f,minZ(),1.6);userZoom();};
W.whereAmI=()=>{cam.follow=true;cam.tz=Math.max(cam.tz,baseZ()*.9);hero.ping=2;globeA=Math.max(globeA,.01);wholeT=2.5;userZoom();};
W.wholeMap=()=>{cam.follow=false;const c=[4900,3650];cam.tx=nearX(c[0],cam.x);cam.ty=nearY(c[1],cam.y);cam.tz=minZ();hero.ping=3;wholeT=6;userZoom();};
W.stationScreenPos=id=>{const p=ST_POS[id];return[(nearX(p[0],cam.x)-cam.x)*cam.z+VW/2,(nearY(p[1],cam.y)-cam.y)*cam.z+VH/2];};
W.heroAtStation=()=>{for(const s of DATA.STATIONS){const p=ANCHOR[s.id];if(p&&dist([hero.x,hero.y],p)<60)return s;}return null;};
/* Kleine öffentliche Helfer für die geführte Tour (js/tour.js): Bildschirmpositionen, Blick lenken, Anleger zeigen.
   Während die Tour läuft (TOUR.busy()), halten sich Regionsbegrüßung, Wetter-Kommentar und Pangäa-Neuigkeit zurück. */
const tourBusy=()=>!!(window.TOUR&&TOUR.busy&&TOUR.busy());
W.toScreen=(wx,wy)=>[(nearX(wx,cam.x)-cam.x)*cam.z+VW/2,(nearY(wy,cam.y)-cam.y)*cam.z+VH/2,cam.z];
W.fromScreen=(sx,sy)=>toWorld(sx,sy);
W.heroScreenPos=()=>{const p=W.toScreen(hero.x,hero.y);p.push(!!hero.moving);return p;};                      // [x, y(Füße), Zoom, läuft?]
W.signScreenPos=id=>{const p=ST_POS[id];if(!p)return null;const k=mScale()*cam.z,q=W.toScreen(p[0],p[1]);return[q[0],q[1]-(fogAt(p[0],p[1])>.5?60:74)*k,44*k];};   // Mitte + Radius des runden Schilds
W.plainTapAt=(sx,sy)=>{const [wx,wy]=toWorld(sx,sy);if(stationAt(wx,wy)||discAt(wx,wy)||!walkAt(md(wx,WW),md(wy,WH)))return false;   // Tipp hier = einfach hinlaufen (kein Schild, Fund, Tier)?
  for(const a of ambient){if(a.fly||!a.vis)continue;const ax=nearX(a.x,wx),ay=nearY(a.y,wy);if(wx>ax-a.w/2-24&&wx<ax+a.w/2+24&&wy>ay-a.w*.7-24&&wy<ay+34)return false;}return true;};
W.lookAt=(wx,wy,z)=>{cam.follow=false;cam.tx=nearX(wx,cam.x);cam.ty=nearY(wy,cam.y);if(z){cam.tz=DW.clamp(z,minZ(),1.6);userZoom();}};
W.showDock=()=>{let best=null,bd=1e18;for(const d of DOCKS){if(hero.mode==='walk'&&d.comp!==hero.comp)continue;const q=dist(d.end,[hero.x,hero.y]);if(q<bd){bd=q;best=d;}}
  if(!best)return null;reveal(best.end[0],best.end[1],430);W.lookAt(best.end[0],best.end[1]-20,Math.max(cam.tz,baseZ()*.85));return best.end.slice();};   // nächster Anleger: Nebel dort lüften, hinschauen

/* ---------------- Schleife ---------------- */
function loop(t){
  const dt=Math.max(0,Math.min(.05,(t-lastT)/1000));const fdt=t-lastT;lastT=t;
  if(!worldEl.dataset.paused&&!worldEl.hidden){const a=performance.now();update(dt,t/1000);draw(t/1000);const w=performance.now()-a;
    frameTimes.push([fdt,w]);if(frameTimes.length>240)frameTimes.shift();}
  requestAnimationFrame(loop);
}
function startLeg(L){hero.leg=L;L.t0=0;if(L.pts)L.rem=pathLen(L.pts,[hero.x,hero.y]);
  if(L.t==='board'){hero.x=L.dock.end[0];hero.y=L.dock.end[1];hero.mode='boat';hero.comp=null;hero.boatA=0;hero.wake=[];DW.sfx('jump');setTimeout(()=>DW.sfx('whoosh'),160);
    splash(hero.x,hero.y);
    if(!DW.state.stickers.kapitaen){DW.addSticker('kapitaen');DW.say('Ahoi! Wir fahren mit dem Boot. Jetzt bist du Kapitän!');}
    else if(Math.random()<.45)DW.say(DW.pick(['Ab ins Boot!','Leinen los!','Ahoi, wir segeln los!']));
    DW.state.boat=true;DW.state.pos=[Math.round(hero.x),Math.round(hero.y)];DW.save();DW.emit('board');}
  if(L.t==='land'){DW.sfx('jump');splash(hero.x,hero.y);}
}
function splash(x,y){pops.push({t:'splash',x,y,a:0});}
function finishLeg(){const L=hero.leg;hero.leg=null;
  if(L.t==='land'){hero.mode='walk';hero.x=L.dock.end[0];hero.y=L.dock.end[1];hero.comp=L.dock.comp;hero.trail=[];DW.state.boat=false;DW.state.pos=[Math.round(hero.x),Math.round(hero.y)];DW.save();
    if(!hero.legs.length||Math.random()<.3)DW.say(DW.pick(['Land in Sicht!','Wir sind da. Alle Mann an Land!','Schön, wieder festen Boden unter den Füßen!']));}
  if(hero.pending){const p=hero.pending;hero.pending=null;goTarget(p.t,p.cb);return;}
  if(!hero.legs.length){hero.moving=false;hero.markTarget=null;endTrip();DW.state.pos=[Math.round(md(hero.x,WW)),Math.round(md(hero.y,WH))];DW.state.boat=hero.mode==='boat';DW.save();const cb=onArrive;onArrive=null;cb&&cb();}
}
function update(dt,T){
  if(!hero.leg&&hero.legs.length)startLeg(hero.legs.shift());
  const L=hero.leg;
  if(L){
    if(L.t==='walk'||L.t==='sail'){
      if(!L.pts.length){finishLeg();}
      else{L.t0+=dt;const base=L.t==='sail'?340:230,m=hero.mult,ramp=Math.min(1,L.t0/.7)*Math.min(1,Math.max(0,L.rem)/(base*m*.55)+.15);
        let sp=base*(1+(m-1)*Math.min(1,ramp))*dt*SPEED;const sp0=sp;
        while(sp>0&&L.pts.length){const p=L.pts[0],dx=p[0]-hero.x,dy=p[1]-hero.y,d=Math.hypot(dx,dy);
          if(Math.abs(dx)>2)hero.flip=dx<0;if(d>.5)hero.heading=Math.atan2(dy,dx);
          if(d<=sp){hero.x=p[0];hero.y=p[1];L.pts.shift();sp-=d;}else{hero.x+=dx/d*sp;hero.y+=dy/d*sp;sp=0;}}
        L.rem-=sp0-sp;
        if(L.t==='walk'){hero.ph=(hero.ph+dt*2.6*Math.min(1.6,1+(hero.mult-1)*.3))%1;if(Math.random()<dt*4)DW.sfx('step');hero.trail.push([hero.x,hero.y,hero.flip]);if(hero.trail.length>40)hero.trail.shift();}
        else{hero.ph=(hero.ph+dt)%1;if(!hero.wake.length||Math.hypot(hero.wake[hero.wake.length-1][0]-hero.x,hero.wake[hero.wake.length-1][1]-hero.y)>14)hero.wake.push([hero.x,hero.y,T]);}
        normHero();
        if(!L.pts.length)finishLeg();}
    }else{L.t0+=dt;if(L.t==='board')hero.boatA=Math.min(1,L.t0/.35);if(L.t==='land')hero.boatA=Math.max(0,1-L.t0/.4);if(L.t0>(L.t==='board'?.55:.45))finishLeg();}
  }else hero.ph=0;
  if(hero.mode==='boat'&&(!L||L.t!=='land'))hero.boatA=Math.min(1,hero.boatA+dt*3);
  while(hero.wake.length&&T-hero.wake[0][2]>1.8)hero.wake.shift();
  // Nebel aufdecken, Regionen begrüßen, Funde einsammeln
  lastRegionCheck-=dt;
  if(lastRegionCheck<=0){lastRegionCheck=.2;reveal(hero.x,hero.y,700);
    {const rk=heroRegion();if(rk!==curRegion){curRegion=rk;if(rk)DW.emit('region',rk);}}
    const k=regionAt(hero.x,hero.y),water=!landAt(hero.x,hero.y);
    if(k!==hero.regK&&(water===(hero.mode==='boat'))&&!tourBusy()){hero.regK=k;const seen=DW.state.regions=DW.state.regions||{},gk='pg_'+k,info=REG_INFO[k];
      if(info&&info.say&&!seen[gk]){seen[gk]=1;if(info.q)seen[info.q]=1;DW.save();setTimeout(()=>{if(!hero.legs.length&&!hero.leg)return;DW.say(info.say);},300);}}
    if(fogPct>=.6&&!DW.state.stickers.entdecker)DW.addSticker('entdecker');}
  if(fogSaveT>0){fogSaveT-=dt;if(fogSaveT<=0){DW.state.fog=fogEnc();DW.save();}}
  for(const d of disc){if(d.done)continue;const r=d.t==='flasche'?95:70;if(dist([d.x,d.y],[hero.x,hero.y])>r)continue;if((d.t==='flasche')!==(hero.mode==='boat'))continue;collect(d);}
  // Kamera (folgt dem nächsten Abbild der Figur)
  if(cam.follow){cam.tx=nearX(hero.x,cam.x);cam.ty=nearY(hero.y-40,cam.y);}
  const k=1-Math.pow(.02,dt); cam.x+=(cam.tx-cam.x)*k;cam.y+=(cam.ty-cam.y)*k;cam.z+=(cam.tz-cam.z)*(1-Math.pow(.05,dt));
  normCam();
  if(hero.ping>0)hero.ping-=dt;if(wholeT>0)wholeT-=dt;
  // Tiere (nur im sichtbaren Bereich)
  const hw=VW/2/cam.z+500,hh=VH/2/cam.z+500;
  ambient.forEach(a=>{
    if(a.fly){a.a+=a.speed*dt;a.x=a.cx+Math.cos(a.a)*a.R;a.y=a.cy+Math.sin(a.a)*a.R*.6;a.flip=Math.sin(a.a)>0;a.ph=(a.ph||0)+dt*.9;a.vis=Math.abs(wdx(a.x,cam.x))<hw&&Math.abs(wdy(a.y,cam.y))<hh+200;return;}
    a.vis=Math.abs(wdx(a.x,cam.x))<hw&&Math.abs(wdy(a.y,cam.y))<hh;if(!a.vis)return;
    if(a.hop){a.hop=Math.max(0,a.hop-dt*2);}
    if(a.wait>0){a.wait-=dt;return;}
    const dx=a.tx-a.x,dy=a.ty-a.y,d=Math.hypot(dx,dy);
    if(d<4){a.wait=2+Math.random()*5;let tries=0;do{a.tx=a.hx+(Math.random()-.5)*a.r*2;a.ty=a.hy+(Math.random()-.5)*a.r;tries++;}while(tries<12&&(a.swim?distAt(a.tx,a.ty)<70:!walkAt(a.tx,a.ty)||!lineWalk([a.x,a.y],[a.tx,a.ty])));if(tries>=12){a.tx=a.hx;a.ty=a.hy;}return;}
    a.x+=dx/d*a.speed*dt;a.y+=dy/d*a.speed*dt;a.flip=dx<0;a.ph=(a.ph+dt*.8)%1;
  });
  clouds.forEach(c=>{c.x+=dt*10*c.s;if(c.x>WW)c.x-=WW;});
  for(const p of pops)p.a+=dt;pops=pops.filter(p=>p.a<(p.t==='dino'?1.8:p.t==='burst'?1.2:p.t==='ring'?3:.9));
  if(fogDirty)fogRender();
  envT-=dt;if(envT<=0){envT=1;envUpdate();reseason();envComment();}
}
function collect(d){d.done=true;DW.emit('mapfind',d.t);
  if(d.t==='glitzer'){const f=DW.pick(DATA.FINDS);DW.addFind(f.id);pops.push({t:'burst',x:d.x,y:d.y,a:0});DW.say(DW.pick(['Oh, da glitzert etwas! ','Schau mal, was hier im Boden steckt! '])+f.n+'!');}
  if(d.t==='busch'){const all=DATA.ANIMALS.filter(a=>!a.sea&&DATA.habitat(a.id)==='land'&&(DATA.lenM(a.id)||9)<=3&&ART.resolve(a.art));
    const tri=all.filter(a=>a.era==='trias'||a.era==='perm'),pool=tri.length?tri:all.filter(a=>DATA.isDino(a.id));
    const fresh=pool.filter(a=>!DW.state.animals[a.id]);const a=DW.pick(fresh.length?fresh:pool);
    pops.push({t:'dino',x:d.x,y:d.y,a:0,art:a.art,fr:ART.frames(a.art,6),flip:Math.random()<.5});DW.sfx('jump');
    setTimeout(()=>{DW.discover(a.id);DW.say(`Huch! Ein kleiner ${a.short||a.n} hat sich im Busch versteckt!`);},450);}
  if(d.t==='flasche'){const c=DW.state.cards=DW.state.cards||{have:{},opened:0,bonus:0};c.bonus=(c.bonus||0)+1;DW.save();
    DW.toast(ART.icon('sticker'),'Kartenpäckchen gefunden!','Öffne es im Kartenhaus');DW.sfx('magic');pops.push({t:'burst',x:d.x,y:d.y,a:0});
    DW.say('Eine Flaschenpost! Darin steckt ein Kartenpäckchen. Öffne es im Kartenhaus!');}
}
function sprite(frames_,ph,x,y,w,flip,alpha=1){
  const img=frames_[Math.floor(ph*frames_.length)%frames_.length]; if(!img||!img.complete||!img.naturalWidth) return;
  const h=w*img.naturalHeight/img.naturalWidth; ctx.save(); if(alpha<1)ctx.globalAlpha=alpha; ctx.translate(x,y); if(flip)ctx.scale(-1,1); ctx.drawImage(img,-w/2,-h,w,h); ctx.restore();
}
function viewRect(cx,cy,z){const hw=VW/2/z,hh=VH/2/z;return[cx-hw,cy-hh,cx+hw,cy+hh];}
function pickLevel(v){const need=cam.z*DPR;
  if(need>=.5&&tileCount(L2,v)<=L2.cap-3)return L2;
  if(need>=.2&&tileCount(L1,v)<=L1.cap)return L1;return null;}
function scheduleTiles(level,v){
  if(!level)return;const t0=performance.now();const [i0,j0,i1,j1]=tileRange(level,v),cx=(v[0]+v[2])/2,cy=(v[1]+v[3])/2;const miss=[];
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)if(!level.map.has(tkey(level,i,j)))miss.push([i,j,Math.hypot((i+.5)*level.size-cx,(j+.5)*level.size-cy)]);
  miss.sort((a,b)=>a[2]-b[2]);let n=0;
  for(const [i,j] of miss){if(n>=2||(n>=1&&performance.now()-t0>7))break;tileRender(level,i,j);n++;}
  if(!miss.length&&KM.stale){let best=null,bd=1e18;for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const t=level.map.get(tkey(level,i,j));if(!t||!t.stale)continue;const q=Math.hypot((i+.5)*level.size-cx,(j+.5)*level.size-cy);if(q<bd){bd=q;best=[i,j];}}
    if(best){tileRender(level,best[0],best[1]);return;}} // neue Bilder: alte Kachel bleibt sichtbar, bis die neue fertig ist
  if(!miss.length&&frameNo%3===0){ // Vorrat: in Bewegungsrichtung / Ring um den Ausschnitt
    const w=(v[2]-v[0])*.35,h=(v[3]-v[1])*.35,[a,b,c,d]=tileRange(level,[v[0]-w,v[1]-h,v[2]+w,v[3]+h]);let best=null,bd=1e18;
    const room=level.cap-tileCount(level,v)-1;if(room>0){const fx=cam.follow&&hero.moving?nearX(hero.x,cx)+Math.cos(hero.heading)*600:cx,fy=cam.follow&&hero.moving?nearY(hero.y,cy)+Math.sin(hero.heading)*600:cy;
      for(let j=b;j<=d;j++)for(let i=a;i<=c;i++){if(level.map.has(tkey(level,i,j)))continue;const q=Math.hypot((i+.5)*level.size-fx,(j+.5)*level.size-fy);if(q<bd){bd=q;best=[i,j];}}
      if(best)tileRender(level,best[0],best[1]);}}
}
const I_=(px,py)=>[nearX(px,cam.x),nearY(py,cam.y)];
function draw(T){
  frameNo++;
  const x=ctx; x.setTransform(DPR,0,0,DPR,0,0);
  x.save(); x.translate(VW/2,VH/2); x.scale(cam.z,cam.z); x.translate(-cam.x,-cam.y);
  const v=viewRect(cam.x,cam.y,cam.z);
  const level=pickLevel(v);
  if(level===L2){if(!allTiles(L2,v)){drawOV(x,v);drawTiles(L1,v);}drawTiles(L2,v);}
  else if(level===L1){if(!allTiles(L1,v))drawOV(x,v);drawTiles(L1,v);}
  else drawOV(x,v);
  const tb=performance.now(),nt=STAT.tiles||0;scheduleTiles(level,v);if(OVQ&&(STAT.tiles||0)===nt)ovStep(level?3:6);
  const vis=(px,py,m=200)=>Math.abs(wdx(px,cam.x))<(v[2]-v[0])/2+m&&Math.abs(wdy(py,cam.y))<(v[3]-v[1])/2+m;
  drawLiveFx(x,T,vis);
  if(hero.markTarget){const [mx,my]=I_(hero.markTarget[0],hero.markTarget[1]);x.strokeStyle='rgba(200,85,61,.7)';x.lineWidth=3;x.beginPath();x.ellipse(mx,my,14+Math.sin(T*6)*3,6,0,0,TAU);x.stroke();}
  {const gp=ST_POS.zeitportal;if(vis(gp[0]+150,gp[1])){const [a,b]=I_(gp[0]+150,gp[1]-26);drawMiniGlobe(x,a,b,30,T);}}
  for(const d of disc)if(!d.done&&vis(d.x,d.y)){const [a,b]=I_(d.x,d.y);drawDisc(x,Object.assign({},d,{x:a,y:b,x0:d.x,y0:d.y}),T);}
  // Objekte nach y sortiert
  const objs=[];const [hx,hy]=I_(hero.x,hero.y);
  ambient.forEach(a=>{if(a.fly||!a.vis)return;const [ax,ay]=I_(a.x,a.y);objs.push({y:ay,draw:()=>{const fr=frames(a);if(a.swim){sprite(fr,a.ph,ax,ay,a.w,a.flip,.9);
        x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=2;x.beginPath();x.ellipse(ax,ay-4,a.w*.4,6,0,0,TAU);x.stroke();}
      else sprite(fr,a.ph,ax,ay-(a.hop?Math.sin(a.hop*Math.PI)*20:0),a.w,a.flip);}});});
  for(const p of pops)if(p.t==='dino'&&vis(p.x,p.y)){const [px,py]=I_(p.x,p.y);objs.push({y:py,draw:()=>{const u=p.a/1.8,hop=Math.abs(Math.sin(u*Math.PI*4))*30*(1-u);sprite(p.fr,(p.a*2)%1,px+(p.flip?-1:1)*u*220,py-hop,60,p.flip,Math.min(1,(1-u)*3));}});}
  if(hero.mode==='boat'||(hero.leg&&hero.leg.t==='land')){objs.push({y:hy,draw:()=>drawBoat(x,T,hx,hy)});}
  else{const tr=hero.trail.length>14?hero.trail[hero.trail.length-14]:null;const ox=hx-hero.x,oy=hy-hero.y;
    const pip=tr?{x:tr[0]+ox-(tr[2]?-18:18),y:tr[1]+oy+6,flip:tr[2]}:{x:hx-(hero.flip?-34:34),y:hy+6,flip:hero.flip};
    if(W._pip&&W._pip.hop)W._pip.hop=Math.max(0,W._pip.hop-.035);const hop=W._pip&&W._pip.hop?Math.sin(W._pip.hop*Math.PI)*22:0;
    W._pip={x:pip.x,y:pip.y,h:pipW*.62,hop:W._pip?W._pip.hop:0};
    objs.push({y:pip.y,draw:()=>sprite(pipFrames,hero.moving?hero.ph:0,pip.x,pip.y-hop,pipW,pip.flip)});
    objs.push({y:hy,draw:()=>{sprite(heroFrames,hero.ph,hx,hy+4,58,hero.flip);}});}
  objs.sort((a,b)=>a.y-b.y).forEach(o=>o.draw());
  for(const p of pops)if(p.t!=='dino'&&vis(p.x,p.y)){const [px,py]=I_(p.x,p.y);drawPop(x,Object.assign({},p,{x:px,y:py}));}
  ambient.forEach(a=>{if(!a.fly||!a.vis)return;const [ax,ay]=I_(a.x,a.y);x.fillStyle='rgba(40,50,60,.12)';x.beginPath();x.ellipse(ax+30,ay+90,a.w*.35,a.w*.1,0,0,TAU);x.fill();sprite(frames(a),a.ph%1,ax,ay,a.w,a.flip);});
  clouds.forEach(c=>{if(!vis(c.x+180*c.s,c.y+160,500))return;const [cx,cy]=I_(c.x,c.y);x.save();x.globalAlpha=.16;x.drawImage(c.img,cx+60,cy+140,360*c.s,180*c.s);x.globalAlpha=.5;x.drawImage(c.img,cx,cy,360*c.s,180*c.s);x.restore();});
  // Nebel
  if(fogPct<.999){x.save();x.imageSmoothingEnabled=true;drawFog(x,v);x.restore();}
  if(ENV.on){drawTint(x,v);drawAmbFx(x,T,Math.min(.05,T-(W._lastT||T)),v);}W._lastT=T;
  // Übersicht: nur EIN Pangäa hervorheben, die Nachbar-Abbilder blass (die Welt geht dort weiter)
  const ghost=DW.clamp((minZ()*1.9-cam.z)/(minZ()*.9),0,1);
  if(ghost>0){const kx=Math.floor(cam.x/WW)*WW,ky=Math.floor(cam.y/WH)*WH;x.save();x.fillStyle=`rgba(247,240,225,${(.5*ghost).toFixed(3)})`;
    x.beginPath();x.rect(v[0]-10,v[1]-10,v[2]-v[0]+20,v[3]-v[1]+20);x.rect(kx+WW,ky,-WW,WH);x.fill('evenodd');
    x.strokeStyle=`rgba(120,95,60,${(.35*ghost).toFixed(3)})`;x.lineWidth=3/cam.z;x.setLineDash([14/cam.z,10/cam.z]);x.strokeRect(kx,ky,WW,WH);x.setLineDash([]);x.restore();}
  // Held-Markierung beim Herauszoomen
  if(cam.z<.34||hero.ping>0){const al=hero.ping>0?Math.min(1,hero.ping):.9,r=(22+Math.sin(T*4)*5)/cam.z;x.strokeStyle=`rgba(200,85,61,${.8*al})`;x.lineWidth=4/cam.z;x.beginPath();x.arc(hx,hy-20,r,0,TAU);x.stroke();
    x.fillStyle=`rgba(255,251,243,${.9*al})`;x.beginPath();x.arc(hx,hy-20,10/cam.z,0,TAU);x.fill();x.fillStyle=`rgba(200,85,61,${al})`;x.beginPath();x.arc(hx,hy-20,6/cam.z,0,TAU);x.fill();}
  // Stationen
  const ms=mScale();
  DATA.STATIONS.forEach(s=>{const p0=ST_POS[s.id];if(!p0||!vis(p0[0],p0[1],260*ms))return;const p=I_(p0[0],p0[1]);if(fogAt(p0[0],p0[1])>.5)drawFogMarker(x,s,p,T,ms);else drawMarker(x,s,p,T,ms,p0);});
  x.restore();
  drawLabels(x);
  drawGlobeIcon(x,T);
}
function drawLiveFx(x,T,vis){
  const V=VOLCANO;if(vis(V.x,V.y-V.h,600)){const [vx,vy]=I_(V.x,V.y);x.save();for(let i=0;i<7;i++){const u=((T*.09+i/7)%1),r=30+u*120,px=vx+Math.sin(u*5+i)*30+u*140,py=vy-V.h-20-u*380;
      x.globalAlpha=(1-u)*.5;x.fillStyle=i%2?'#bdb4ab':'#d6cfc6';x.beginPath();x.arc(px,py,r,0,TAU);x.fill();}
    x.globalAlpha=.25+Math.sin(T*3)*.12;x.fillStyle='#ffb35a';x.beginPath();x.ellipse(vx,vy-V.h,70,24,0,0,TAU);x.fill();x.restore();}
  if(vis(LAVA[3][0],LAVA[3][1],500)){const [ox,oy]=I_(LAVA[3][0],LAVA[3][1]),dx=ox-LAVA[3][0],dy=oy-LAVA[3][1];x.save();x.translate(dx,dy);x.lineCap='round';x.lineJoin='round';x.globalAlpha=.3+Math.sin(T*2.4)*.15;x.strokeStyle='#ffd27a';x.lineWidth=8;x.setLineDash([22,40]);x.lineDashOffset=-T*40;smoothPath(x,LAVA,false);x.stroke();x.setLineDash([]);
    const e=LAVA[LAVA.length-1];for(let i=0;i<4;i++){const u=((T*.25+i/4)%1);x.globalAlpha=(1-u)*.55;x.fillStyle='#f4f1ec';x.beginPath();x.arc(e[0]-30+i*18,e[1]-u*120,16+u*30,0,TAU);x.fill();}x.restore();}
  const pv=LANDS.find(l=>l.k==='pvulk');if(pv&&vis(pv.hand.c[0],pv.hand.c[1],500)){const [px,py]=I_(pv.hand.c[0]+20,pv.hand.c[1]-20-168);x.save();for(let i=0;i<4;i++){const u=((T*.1+i/4)%1);x.globalAlpha=(1-u)*.4;x.fillStyle='#d6cfc6';x.beginPath();x.arc(px+u*60,py-u*200,18+u*50,0,TAU);x.fill();}x.restore();}
  if(vis(DEEP.x,DEEP.y,300)){const [dx,dy]=I_(DEEP.x,DEEP.y);x.save();x.globalAlpha=.18+Math.sin(T*1.3)*.08;x.fillStyle='#9fe3f0';for(let i=0;i<6;i++){const a=i/6*TAU+T*.15;x.beginPath();x.arc(dx+Math.cos(a)*140,dy+Math.sin(a)*80,6+Math.sin(T*2+i)*2,0,TAU);x.fill();}x.restore();}
}
function drawDisc(x,d,T){
  if(KM.on){const n={glitzer:'glitzer',busch:'busch',flasche:'flaschenpost'}[d.t],im=n&&kmRun(n,kHash(d.x0||0,d.y0||0),256);
    if(im){const H={glitzer:42,busch:56,flaschenpost:34}[n],s=Math.min(H/im.h,H*1.8/im.w),dw=im.w*s,dh=im.h*s;x.save();
      if(d.t==='glitzer'){const p=Math.sin((T*1.4+d.ph)*TAU)*.5+.5;x.fillStyle='rgba(120,90,50,.25)';x.beginPath();x.ellipse(d.x,d.y,18,6,0,0,TAU);x.fill();x.globalAlpha=.7+.3*p;x.translate(d.x,d.y+2);x.scale(.94+.1*p,.94+.1*p);x.drawImage(im.c,-dw/2,-dh,dw,dh);}
      else if(d.t==='busch'){const sh=Math.max(0,Math.sin((T+d.ph)*1.1))**8;x.translate(d.x+Math.sin(T*28)*sh*4,d.y+2);x.rotate(Math.sin(T*22)*sh*.04);x.drawImage(im.c,-dw/2,-dh,dw,dh);}
      else{x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=2;x.beginPath();x.ellipse(d.x,d.y+4,26+Math.sin(T*2)*3,7,0,0,TAU);x.stroke();x.translate(d.x,d.y+4+Math.sin(T*2+d.ph)*3);x.rotate(Math.sin(T*1.6+d.ph)*.25);x.drawImage(im.c,-dw/2,-dh*.7,dw,dh);}
      x.restore();return;}}
  if(d.t==='glitzer'){x.save();x.fillStyle='rgba(120,90,50,.25)';x.beginPath();x.ellipse(d.x,d.y,18,6,0,0,TAU);x.fill();
    for(let i=0;i<3;i++){const ph=(T*1.4+d.ph+i*.33)%1,s=Math.sin(ph*Math.PI),px=d.x+[-10,8,0][i],py=d.y-[10,16,28][i];x.globalAlpha=s;x.fillStyle=i===1?'#fff8d6':'#f5d36a';
      x.beginPath();const r=7+s*6;x.moveTo(px,py-r);x.quadraticCurveTo(px,py,px+r,py);x.quadraticCurveTo(px,py,px,py+r);x.quadraticCurveTo(px,py,px-r,py);x.quadraticCurveTo(px,py,px,py-r);x.fill();}
    x.restore();}
  if(d.t==='busch'){const sh=Math.max(0,Math.sin((T+d.ph)*1.1))**8,wig=Math.sin(T*28)*sh*4;x.save();x.translate(d.x+wig,d.y);bush(x,0,0,1.8,'#6f9a5a');x.fillStyle='#7fa66a';x.beginPath();x.arc(8,-24,9,0,TAU);x.fill();
    if(sh>.2){x.fillStyle='#8fb77a';for(let i=0;i<3;i++){x.beginPath();x.ellipse(-20+i*20,-40-sh*14-i*3,4,2.4,i,0,TAU);x.fill();}}x.restore();}
  if(d.t==='flasche'){const b=Math.sin(T*2+d.ph)*3,r=Math.sin(T*1.6+d.ph)*.25;x.save();x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=2;x.beginPath();x.ellipse(d.x,d.y+4,26+Math.sin(T*2)*3,7,0,0,TAU);x.stroke();
    x.translate(d.x,d.y+b);x.rotate(-.5+r);x.fillStyle='rgba(150,200,170,.85)';rr(x,-16,-8,28,16,7);x.fill();x.fillRect(10,-4,10,8);x.fillStyle='#b08a5c';x.fillRect(19,-4,5,8);
    x.fillStyle='#fbf3e0';x.fillRect(-10,-4,18,8);x.strokeStyle='rgba(60,80,70,.6)';x.lineWidth=1.4;rr(x,-16,-8,28,16,7);x.stroke();
    x.globalAlpha=.6+Math.sin(T*5+d.ph)*.4;x.fillStyle='#fff';x.beginPath();x.arc(-8,-10,3,0,TAU);x.fill();x.restore();}
}
function drawPop(x,p){if(p.t==='splash'){const u=p.a/.9;x.save();x.globalAlpha=1-u;x.strokeStyle='#fff';x.lineWidth=3;x.beginPath();x.ellipse(p.x,p.y,20+u*60,6+u*18,0,0,TAU);x.stroke();
    x.fillStyle='#e8f6fa';for(let i=0;i<6;i++){const a=Math.PI+i/5*Math.PI;x.beginPath();x.arc(p.x+Math.cos(a)*30*u*1.4,p.y-Math.sin(u*Math.PI)*30+Math.sin(a)*10,4,0,TAU);x.fill();}x.restore();}
  if(p.t==='ring'){const u=p.a/3;x.save();x.globalAlpha=Math.min(1,(1-u)*2);x.strokeStyle='#f0c35a';x.lineWidth=6/Math.max(.3,cam.z);
    for(let k=0;k<2;k++){const r=(p.r||60)*(1+((p.a*1.2+k*.5)%1)*.8);x.beginPath();x.ellipse(p.x,p.y-10,r,r*.5,0,0,TAU);x.stroke();}x.restore();}
  if(p.t==='burst'){const u=p.a/1.2;x.save();x.globalAlpha=1-u;x.fillStyle='#f5d36a';for(let i=0;i<10;i++){const a=i/10*TAU,r=10+u*70;x.beginPath();x.arc(p.x+Math.cos(a)*r,p.y-20+Math.sin(a)*r*.7,5*(1-u)+2,0,TAU);x.fill();}x.restore();}}
function drawBoat(x,T,bx,by){
  const A=hero.boatA,rock=Math.sin(T*2.2)*.05*(hero.leg&&hero.leg.t==='sail'?1:.6),bob=Math.sin(T*2.2+1)*2,fl=Math.cos(hero.heading)<0;
  const moving=hero.leg&&hero.leg.t==='sail';
  // Kielwasser
  if(hero.wake.length>1){x.save();x.translate(bx-hero.x,by-hero.y);x.lineCap='round';for(let i=1;i<hero.wake.length;i++){const p=hero.wake[i],q=hero.wake[i-1],age=T-p[2],u=age/1.8;if(u>=1)continue;
      const dx=p[0]-q[0],dy=p[1]-q[1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,w=14+u*46;x.strokeStyle=`rgba(255,255,255,${.55*(1-u)})`;x.lineWidth=2.4;
      x.beginPath();x.moveTo(q[0]+nx*w,q[1]+ny*w*.6+6);x.lineTo(p[0]+nx*w,p[1]+ny*w*.6+6);x.moveTo(q[0]-nx*w,q[1]-ny*w*.6+6);x.lineTo(p[0]-nx*w,p[1]-ny*w*.6+6);x.stroke();}x.restore();}
  x.save();x.translate(bx,by+bob);
  x.fillStyle='rgba(30,60,80,.2)';x.beginPath();x.ellipse(0,8,74*A,15*A,0,0,TAU);x.fill();
  x.strokeStyle='rgba(255,255,255,.65)';x.lineWidth=2;x.beginPath();x.ellipse(0,6,(80+Math.sin(T*3)*4)*A,16*A,0,0,TAU);x.stroke();
  x.scale(A,A);x.rotate(rock);if(fl)x.scale(-1,1);
  // Bugwelle
  if(moving){x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=2.4;x.beginPath();x.moveTo(62,-6);x.quadraticCurveTo(80,0,74,12);x.moveTo(70,-2);x.quadraticCurveTo(90,4,84,16);x.stroke();}
  // eigenes Bild karte/boot (hinter der Figur) und karte/boot_vorne (Bordwand davor, gleiche Bildgröße) – sonst Zeichnung
  const bi=kmRun('boot',0,440);if(bi){const s=Math.min(136/bi.h,170/bi.w),dw=bi.w*s,dh=bi.h*s;x.drawImage(bi.c,6-dw/2,14-dh,dw,dh);
    sprite(pipFrames,0,-34,-2,pipW*.9,false);sprite(heroFrames,0,14,26,56,false);const bv=kmRun('boot_vorne',0,440);if(bv)x.drawImage(bv.c,6-dw/2,14-dh,dw,dh);x.restore();return;}
  // Mast & Segel
  x.strokeStyle='#6e4a30';x.lineWidth=4;x.beginPath();x.moveTo(-4,-10);x.lineTo(-4,-122);x.stroke();
  const puff=moving?8:0;x.fillStyle='#fbf4e4';x.beginPath();x.moveTo(0,-118);x.quadraticCurveTo(44+puff,-84,40+puff*.5,-30);x.lineTo(0,-30);x.closePath();x.fill();
  x.save();x.clip();x.fillStyle='#e7a17a';x.fillRect(0,-78,60,14);x.fillStyle='#8fbccb';x.fillRect(0,-52,60,10);x.restore();
  x.strokeStyle='rgba(70,55,35,.6)';x.lineWidth=1.6;x.beginPath();x.moveTo(0,-118);x.quadraticCurveTo(44+puff,-84,40+puff*.5,-30);x.lineTo(0,-30);x.closePath();x.stroke();
  x.fillStyle='#c8553d';x.beginPath();x.moveTo(-4,-122);x.lineTo(-30,-116+Math.sin(T*6)*3);x.lineTo(-4,-110);x.fill();
  // Pip & Figur
  sprite(pipFrames,0,-34,-2,pipW*.9,false);
  sprite(heroFrames,0,14,26,56,false);
  // Rumpf
  const g=x.createLinearGradient(0,-18,0,16);g.addColorStop(0,'#b98857');g.addColorStop(1,'#8a5e3a');x.fillStyle=g;
  x.beginPath();x.moveTo(-64,-16);x.lineTo(64,-18);x.quadraticCurveTo(74,-22,76,-26);x.quadraticCurveTo(66,10,40,14);x.lineTo(-44,14);x.quadraticCurveTo(-66,8,-64,-16);x.closePath();x.fill();
  x.strokeStyle='rgba(90,60,35,.45)';x.lineWidth=1.2;[-6,4].forEach(y=>{x.beginPath();x.moveTo(-62,y);x.lineTo(70,y-6);x.stroke();});
  x.fillStyle='#e0bb84';x.beginPath();x.moveTo(-66,-20);x.lineTo(64,-22);x.quadraticCurveTo(74,-26,78,-30);x.lineTo(76,-24);x.quadraticCurveTo(72,-18,64,-15);x.lineTo(-64,-13);x.closePath();x.fill();
  x.beginPath();x.moveTo(-64,-16);x.lineTo(64,-18);x.quadraticCurveTo(74,-22,76,-26);x.quadraticCurveTo(66,10,40,14);x.lineTo(-44,14);x.quadraticCurveTo(-66,8,-64,-16);x.closePath();strokeInk(x,1.6);
  lifering(x,-36,-2,6);
  x.restore();
}
function drawMarker(x,s,p,T,ms,p0){
  const near=dist([hero.x,hero.y],ANCHOR[s.id]||p0)<90;
  x.save();x.translate(p[0],p[1]);x.scale(ms,ms);
  const bob=near?Math.sin(T*4)*4:0, R_=40, cy=-74+bob;
  x.strokeStyle='#6e5a44';x.lineWidth=3;x.beginPath();x.moveTo(-12,0);x.lineTo(0,cy+R_-4);x.lineTo(12,0);x.stroke();
  x.strokeStyle='#8a7e6c';x.lineWidth=2;x.beginPath();x.moveTo(-18,2);x.lineTo(18,2);x.stroke();
  x.fillStyle='rgba(60,50,30,.18)';x.beginPath();x.ellipse(4,4,26,7,0,0,TAU);x.fill();
  x.fillStyle='rgba(60,50,30,.2)';x.beginPath();x.arc(4,cy+5,R_,0,TAU);x.fill();
  x.fillStyle=s.col;x.beginPath();x.arc(0,cy,R_,0,TAU);x.fill();
  x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=4;x.beginPath();x.arc(0,cy,R_-5,0,TAU);x.stroke();
  x.strokeStyle='rgba(70,55,35,.6)';x.lineWidth=2;x.beginPath();x.arc(0,cy,R_,0,TAU);x.stroke();
  const img=markerImgs[s.id]; if(img&&img.complete&&img.naturalWidth) x.drawImage(img,-30,cy-30,60,60);
  if(s.sea){x.save();x.translate(R_-6,cy+R_-10);x.fillStyle='#fffaf0';x.beginPath();x.arc(0,0,13,0,TAU);x.fill();x.strokeStyle='rgba(70,55,35,.5)';x.lineWidth=1.4;x.stroke();
    x.strokeStyle='#3b6f8a';x.lineWidth=2.2;x.lineCap='round';x.beginPath();x.moveTo(0,-7);x.lineTo(0,7);x.moveTo(-5,-3);x.lineTo(5,-3);x.moveTo(-7,2);x.quadraticCurveTo(0,11,7,2);x.stroke();x.restore();}
  if(near){x.strokeStyle='rgba(240,195,90,'+(0.5+Math.sin(T*5)*.3)+')';x.lineWidth=6;x.beginPath();x.arc(0,cy,R_+7,0,TAU);x.stroke();}
  if(cam.z>.2){x.font='26px "Patrick Hand"';const tw=labelW[s.id]||(labelW[s.id]=x.measureText(s.n).width);x.fillStyle='rgba(255,251,243,.92)';
    const lx=-tw/2-12,ly=10;rr(x,lx,ly,tw+24,34,12);x.fill();x.strokeStyle='rgba(160,130,90,.4)';x.lineWidth=1.5;x.stroke();
    x.fillStyle='#3d3226';x.textAlign='center';x.textBaseline='middle';x.fillText(s.n,0,ly+18);}
  const n=DW.state.stars[s.id]||0; if(n>0&&STAR&&STAR.complete){ x.drawImage(STAR,R_-14,cy-R_-6,30,30); x.font='bold 17px Andika';x.fillStyle='#3d3226';x.textAlign='center';x.textBaseline='alphabetic';x.fillText(n,R_+1,cy-R_+10); }
  x.restore();
}
function drawFogMarker(x,s,p,T,ms){x.save();x.translate(p[0],p[1]-60*ms+Math.sin(T*1.6+p[0])*6*ms);x.scale(ms,ms);
  x.fillStyle='rgba(90,90,110,.14)';x.beginPath();x.ellipse(6,40,46,10,0,0,TAU);x.fill();
  x.fillStyle='#fffdf7';[[-26,6,22],[0,-6,28],[26,6,22],[0,14,24]].forEach(([a,b,r])=>{x.beginPath();x.arc(a,b,r,0,TAU);x.fill();});
  x.strokeStyle='rgba(120,110,100,.35)';x.lineWidth=1.6;x.beginPath();x.arc(0,-6,28,Math.PI*1.1,Math.PI*1.9);x.stroke();
  x.fillStyle=s.sea?'#3b6f8a':'#8a6d4a';x.font='44px "Patrick Hand"';x.textAlign='center';x.textBaseline='middle';x.fillText('?',0,6);x.restore();}
let STAR=null, TABLE=null, PAPER=null; setTimeout(()=>{const i=new Image();i.src=DW.paperURL;PAPER=i;},0); setTimeout(()=>{STAR=ART.toImage(ART.icon('stern'),'hudstar');},0);
function drawMiniGlobe(x,cx,cy,r,T){
  x.save();x.fillStyle='rgba(60,50,30,.18)';x.beginPath();x.ellipse(cx+6,cy+r+22,r*1.1,8,0,0,TAU);x.fill();
  x.fillStyle='#a89c86';x.fillRect(cx-12,cy+r-4,24,26);x.strokeStyle='rgba(70,55,35,.5)';x.strokeRect(cx-12,cy+r-4,24,26);
  const g=x.createRadialGradient(cx-r*.3,cy-r*.3,2,cx,cy,r);g.addColorStop(0,'#bfe0ea');g.addColorStop(1,'#5f97ad');
  x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,TAU);x.fill();
  x.save();x.clip();x.fillStyle='#8fb37a';for(let i=0;i<3;i++){const a=(T*.4+i*2.1)%TAU;x.globalAlpha=Math.max(0,Math.sin(a+Math.PI/2));x.beginPath();x.ellipse(cx+Math.sin(a)*r*.7,cy-6+i*10,10*Math.max(.2,Math.cos(a)),7,0,0,TAU);x.fill();}x.restore();
  x.strokeStyle='rgba(60,80,100,.6)';x.lineWidth=2;x.beginPath();x.arc(cx,cy,r,0,TAU);x.stroke();
  x.fillStyle='rgba(255,255,255,'+(0.25+Math.sin(T*2)*.1)+')';x.beginPath();x.arc(cx-r*.35,cy-r*.35,r*.25,0,TAU);x.fill();
  x.restore();
}
/* ---------------- Tageszeit, Wetter, Jahreszeiten ----------------
   Nach der Geräteuhr: Morgen, Tag, Abend, Nacht (sanfte Übergänge, Sonnenzeiten grob wie in Berlin),
   Wetter je 3 Stunden (Sonne, Wolken, leichter Regen, im Winter Schnee), Jahreszeit nach Monat.
   Nur leichte Tönung – Wege, Schilder und Figuren bleiben immer gut sichtbar. Elternbereich: „Tageszeit & Wetter“. */
let CLOCK=null, ENV={on:false,dark:0,warm:0,phase:'tag',weather:'sonne',season:null}, envT=0, SEASON=null, RS0=4711, lastSayT=0, initT=0, PART=[], RAIN=[];
DW.on('say',()=>{lastSayT=performance.now();});
const nowD=()=>CLOCK!=null?new Date(CLOCK):new Date();
const ambOn=()=>DW.state.settings.ambience!==false;
function seasonOf(d){const m=d.getMonth();return m>=2&&m<=4?'fruehling':m>=5&&m<=7?'sommer':m>=8&&m<=10?'herbst':'winter';}
function hash01(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0)/4294967296;}
function envUpdate(){
  const d=nowD(),on=ambOn(),season=seasonOf(d);
  const doy=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5),c=Math.cos(TAU*(doy+10)/365);
  const dst=(new Date(d.getFullYear(),0,1).getTimezoneOffset()-d.getTimezoneOffset())/60,rise=6+2.27*c+dst,set=18.22-2.3*c+dst,h=d.getHours()+d.getMinutes()/60+d.getSeconds()/3600;
  const dark=Math.max(1-smooth(rise-.9,rise+.6,h),smooth(set-.6,set+.9,h));
  const warm=Math.max(0,1-Math.abs(h-rise-.3)/1.3,1-Math.abs(h-set+.1)/1.3)*(1-dark*.7);
  const r=hash01(d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+'|'+Math.floor(h/3));
  const P={sommer:[.6,.28],fruehling:[.45,.33],herbst:[.42,.33],winter:[.36,.34]}[season];
  const weather=r<P[0]?'sonne':r<P[0]+P[1]?'wolken':(season==='winter'?'schnee':'regen');
  const phase=dark>.6?'nacht':warm>.35?(h<12?'morgen':'abend'):'tag';
  ENV=on?{on,dark:+dark.toFixed(3),warm:+warm.toFixed(3),phase,weather,season,h:+h.toFixed(2)}:{on:false,dark:0,warm:0,phase:'tag',weather:'sonne',season:null,h:+h.toFixed(2)};
  if(!ENV.on)PART=[];
}
function snowman(x,px,py){shadowE(x,px+6,py+2,20,5);x.fillStyle='#fbfcfa';x.strokeStyle='rgba(90,110,130,.5)';x.lineWidth=1.4;
  [[0,-12,14],[0,-34,10]].forEach(([a,b,r])=>{x.beginPath();x.arc(px+a,py+b,r,0,TAU);x.fill();x.stroke();});
  x.fillStyle='#3d3226';x.fillRect(px-8,py-48,16,4);x.fillRect(px-5,py-58,10,11);x.beginPath();x.arc(px-3,py-36,1.4,0,TAU);x.arc(px+3,py-36,1.4,0,TAU);x.fill();
  x.fillStyle='#e8914f';x.beginPath();x.moveTo(px,py-33);x.lineTo(px+10,py-31);x.lineTo(px,py-30);x.fill();
  x.strokeStyle='#c8553d';x.lineWidth=3;x.beginPath();x.moveTo(px-9,py-25);x.quadraticCurveTo(px,py-21,px+9,py-25);x.stroke();
  x.strokeStyle='#7a5a3c';x.lineWidth=1.6;x.beginPath();x.moveTo(px-10,py-16);x.lineTo(px-22,py-24);x.moveTo(px+10,py-16);x.lineTo(px+22,py-26);x.stroke();}
/* Tönung und Lichter (in Weltkoordinaten, nach dem Nebel, vor den Schildern) */
function drawTint(x,v){const E=ENV,L=[];
  if(E.dark>.01)L.push(`rgba(46,64,150,${(.5*E.dark).toFixed(3)})`);
  if(E.warm>.01)L.push(`rgba(250,160,120,${(.38*E.warm).toFixed(3)})`);
  if(E.weather==='wolken'||E.weather==='regen')L.push(`rgba(150,165,180,${E.weather==='regen'?.24:.14})`);
  if(E.weather==='schnee')L.push('rgba(200,215,235,.16)');
  if(!L.length)return;x.save();x.globalCompositeOperation='multiply';for(const c of L){x.fillStyle=c;x.fillRect(v[0]-10,v[1]-10,v[2]-v[0]+20,v[3]-v[1]+20);}x.restore();}
function glow(x,px,py,r,col,a){const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.fillRect(px-r,py-r,r*2,r*2);}
const LAMPS=(()=>{const z=ST_POS.zuhause,f=ST_POS.forscher;return[[z[0]+120-36,z[1]+26-44,46],[z[0]+120+36,z[1]+26-44,46],[z[0]+120,z[1]+26-74,30],[f[0]-110+80,f[1]+10-8,90]];})();
function partOK(k,px,py){
  if(k==='ff')return walkAt(px,py);
  if(k==='tw')return !landAt(px,py)&&distAt(px,py)>40;
  const r=regionAt(px,py);
  if(k==='sn'){if(ENV.weather==='schnee')return true;return r==='eis';}
  return r==='tal'||r==='laurasia'||r==='ebene'||r==='steppe'||r==='gondwald';}
function partSpawn(p,v,top){for(let t=0;t<4;t++){const px=R(v[0],v[2]),py=top?R(v[1]-(v[3]-v[1])*.1,v[1]+(v[3]-v[1])*.9):R(v[1],v[3]);if(partOK(p.k,px,py)){p.x=px;p.y=py;p.on=true;p.life=R(4,9);p.ph=Math.random()*TAU;return;}}p.on=false;p.life=R(.2,.8);}
function drawAmbFx(x,T,dt,v){const E=ENV,z=cam.z,vis=(px,py,m)=>px>v[0]-m&&px<v[2]+m&&py>v[1]-m&&py<v[3]+m;
  const want={ff:E.dark>.45&&E.season!=='winter'?34:0,tw:E.dark>.45?40:0,sn:(E.weather==='schnee'?80:0)||(E.season?46:0),pe:E.season==='fruehling'&&E.dark<.6?22:0,lf:E.season==='herbst'&&E.dark<.8?22:0};
  for(const k in want){const have=PART.filter(p=>p.k===k).length;for(let i=have;i<want[k];i++)PART.push({k,on:false,life:0});if(have>want[k]){let n=have-want[k];PART=PART.filter(p=>p.k!==k||n--<=0);}}
  // Nachtlichter
  if(E.dark>.05){x.save();x.globalCompositeOperation='lighter';const d=E.dark;
    glow(x,nearX(hero.x,cam.x),nearY(hero.y,cam.y)-30,170,'255,214,150',(.26*d).toFixed(3));
    for(const [lx0,ly0,r] of LAMPS){const lx=nearX(lx0,cam.x),ly=nearY(ly0,cam.y);if(vis(lx,ly,r))glow(x,lx,ly,r*(1+Math.sin(T*3+lx)*.05),'255,200,120',(.45*d).toFixed(3));}
    for(const a of ambient)if(a.swim&&a.vis)glow(x,nearX(a.x,cam.x),nearY(a.y,cam.y)-a.w*.12,a.w*.62,'120,230,240',(.34*d*(.75+Math.sin(T*1.7+a.hx)*.25)).toFixed(3));
    x.restore();}
  x.save();
  for(const p of PART){
    const top=p.k==='sn'||p.k==='pe'||p.k==='lf';
    if(!p.on){p.life-=dt;if(p.life<=0)partSpawn(p,v,top);continue;}
    if(p.life<=0||!vis(p.x,p.y,80)){partSpawn(p,v,top);continue;}
    p.life-=dt;p.ph+=dt;const fade=Math.min(1,p.life*1.5,(9-p.life)*1.5);
    if(p.k==='ff'){p.x+=Math.sin(p.ph*1.3)*16*dt/z;p.y+=Math.cos(p.ph*.9)*12*dt/z;const b=(.5+Math.sin(p.ph*3)*.5)*fade*E.dark;
      x.globalCompositeOperation='lighter';x.fillStyle=`rgba(230,250,140,${(.18*b).toFixed(3)})`;x.beginPath();x.arc(p.x,p.y,11/z,0,TAU);x.fill();x.fillStyle=`rgba(250,255,190,${(.9*b).toFixed(3)})`;x.beginPath();x.arc(p.x,p.y,2.6/z,0,TAU);x.fill();}
    else if(p.k==='tw'){const b=Math.max(0,Math.sin(p.ph*1.6))*fade*E.dark,r=(3+b*4)/z;x.globalCompositeOperation='lighter';x.fillStyle=`rgba(255,250,220,${(.8*b).toFixed(3)})`;
      x.beginPath();x.moveTo(p.x,p.y-r);x.quadraticCurveTo(p.x,p.y,p.x+r,p.y);x.quadraticCurveTo(p.x,p.y,p.x,p.y+r);x.quadraticCurveTo(p.x,p.y,p.x-r,p.y);x.quadraticCurveTo(p.x,p.y,p.x,p.y-r);x.fill();}
    else if(p.k==='sn'){p.y+=34*dt/z;p.x+=Math.sin(p.ph)*14*dt/z;x.globalCompositeOperation='source-over';x.fillStyle=`rgba(255,255,255,${(.85*fade).toFixed(3)})`;x.beginPath();x.arc(p.x,p.y,(2+(p.ph*7%1.6))/z,0,TAU);x.fill();}
    else{p.y+=26*dt/z;p.x+=(18+Math.sin(p.ph*1.4)*16)*dt/z;x.globalCompositeOperation='source-over';x.save();x.translate(p.x,p.y);x.rotate(p.ph*1.8);x.scale(1/z,1/z);
      x.fillStyle=p.k==='pe'?(p.ph%2<1?'rgba(238,222,120,.9)':'rgba(214,230,150,.9)'):['rgba(224,176,64,.9)','rgba(232,196,72,.9)','rgba(206,150,50,.9)'][Math.floor(Math.abs(p.x))%3];
      x.globalAlpha=fade;x.beginPath();x.ellipse(0,0,p.k==='pe'?4:5.5,p.k==='pe'?2.4:2.8,0,0,TAU);x.fill();x.restore();}
  }
  x.restore();
  // Regen (Bildschirm)
  if(E.weather==='regen'){if(RAIN.length<90)for(let i=RAIN.length;i<90;i++)RAIN.push([Math.random()*VW,Math.random()*VH,.6+Math.random()*.5]);
    x.save();x.setTransform(DPR,0,0,DPR,0,0);x.strokeStyle='rgba(235,243,250,.55)';x.lineWidth=1.3;x.lineCap='round';x.beginPath();
    for(const r of RAIN){r[1]+=620*r[2]*dt;r[0]-=90*r[2]*dt;if(r[1]>VH+20){r[1]=-20;r[0]=Math.random()*(VW+100);}if(r[0]<-20)r[0]+=VW+40;x.moveTo(r[0],r[1]);x.lineTo(r[0]-4*r[2],r[1]+18*r[2]);}
    x.stroke();x.restore();}else RAIN.length=0;
}
function envComment(){if(!ENV.on||DW.current||worldEl.hidden||worldEl.dataset.paused||tourBusy())return;const t=performance.now();if(t-lastSayT<9000||t-initT<8000)return;
  const k=(ENV.weather==='regen'||ENV.weather==='schnee')?ENV.weather:ENV.phase;if(k==='tag')return;
  const day=nowD().toDateString(),st=DW.state.envSaid=(DW.state.envSaid&&DW.state.envSaid.day===day)?DW.state.envSaid:{day,k:[]};if(st.k.includes(k))return;st.k.push(k);DW.save();
  DW.say({nacht:ENV.season==='winter'?'Es ist Nacht. Im Wasser glitzern die Sterne.':'Es ist Nacht. Schau mal, die Glühwürmchen leuchten!',morgen:'Guten Morgen! Die Sonne geht gerade auf.',
    abend:'Es wird Abend. Der Himmel wird ganz rot.',regen:'Es regnet ein bisschen. Die Pflanzen freuen sich!',schnee:'Es schneit! Alles wird weiß.'}[k]);}
W.env=()=>{envUpdate();return Object.assign({},ENV);};
W.setAmbience=()=>{envUpdate();PART=[];RAIN=[];if(OV)reseason();return Object.assign({},ENV);};
/* Übersichtsbild: erst Land, Meer und Wege (schnell), die Pflanzen & Wahrzeichen malen sich in ruhigen Momenten dazu */
let OVQ=null;
function buildOV(fresh){ // fresh: im Hintergrund in ein neues Bild malen (streifenweise) und erst fertig austauschen – kein Flackern
  if(fresh&&OV){OVQ={i:0,c:mkCanvas(WW*OVS,WH*OVS),y:0};return;}
  OV=OV&&OV.width===Math.round(WW*OVS)?OV:mkCanvas(WW*OVS,WH*OVS);const x=OV.getContext('2d');x.setTransform(OVS,0,0,OVS,0,0);NOITEMS=true;drawWorld(x,0,0,WW,WH,OVS);NOITEMS=false;OVQ={i:0,c:OV};}
function ovStep(ms){if(!OVQ)return;const x=OVQ.c.getContext('2d');x.setTransform(OVS,0,0,OVS,0,0);const t0=performance.now();
  if(OVQ.y!=null&&OVQ.y<WH){const y0=OVQ.y,y1=Math.min(WH,y0+600);x.save();x.beginPath();x.rect(0,y0,WW,y1-y0);x.clip();NOITEMS=true;drawWorld(x,0,y0,WW,y1,OVS);NOITEMS=false;x.restore();x.setTransform(1,0,0,1,0,0);OVQ.y=y1;return;}
  KSC=OVS;
  while(OVQ.i<ITEMS.length){const it=ITEMS[OVQ.i++];if(!it.s&&!(KM.on&&it.d&&kmDraw(x,it.d)))it.f(x);if((OVQ.i&15)===0&&performance.now()-t0>ms)break;}
  x.setTransform(1,0,0,1,0,0);if(OVQ.i>=ITEMS.length){OV=OVQ.c;OVQ=null;STAT.ovDone=Math.round(performance.now()-initT);}}
function reseason(){const s=ENV.on?ENV.season:null;if(s===SEASON)return false;SEASON=s;RS=RS0;buildWash();buildOV();L1.map.clear();L2.map.clear();return true;}
/* Jahreszeiten (nur im Forscher-Tal und in den Laurasia-Wäldern): eigener Zufall, damit die Grundkarte gleich bleibt */
let R2S=1;const r2=()=>{R2S=(R2S*16807)%2147483647;return R2S/2147483647;};const R2=(a,b)=>a+r2()*(b-a);
function seasonWash(x){if(!SEASON||SEASON==='sommer')return;R2S=97;
  const cols={winter:['#f7f9f9','#eef3f6','#ffffff','#e6eef3'],herbst:['#d9a45a','#c98a4a','#e2bb6a','#b8743f'],fruehling:['#dcebb0','#eef3c8','#cfe3a0']}[SEASON];
  const al={winter:.8,herbst:.22,fruehling:.3}[SEASON],dens={winter:26000,herbst:70000,fruehling:70000}[SEASON];
  const polys=REGION_POLY.filter(([k])=>k==='tal'||k==='laurasia').map(([,p])=>p);
  x.save();x.beginPath();polys.forEach(p=>smoothSub(x,p));x.clip();
  softDraw(x,t=>{polys.forEach(p=>{const [a,b,c2,d]=bbox(p),n=Math.max(4,Math.round((c2-a)*(d-b)/dens));
    for(let i=0;i<n;i++){t.fillStyle=cols[Math.floor(r2()*cols.length)];t.beginPath();t.ellipse(R2(a,c2),R2(b,d),R2(100,260),R2(60,160),r2()*3,0,TAU);t.fill();}});},30,al);
  x.restore();
}
function seasonTuft(c,px){if(SEASON==='herbst')return ['#b8963e','#c9a24a','#a88a44'][Math.floor(Math.abs(px))%3];if(SEASON==='winter')return '#b3bfba';return c;}
function seasonTree(x,px,py,s,v){ // Ginkgo: im Herbst goldgelb, im Winter kahl
  if(SEASON==='winter'){x.save();x.translate(px,py);x.scale(s,s);x.fillStyle='rgba(60,50,30,.14)';x.beginPath();x.ellipse(8,2,22,6,0,0,TAU);x.fill();
    x.strokeStyle='#7a5a3c';x.lineCap='round';x.lineWidth=5;x.beginPath();x.moveTo(0,0);x.lineTo(1,-30);x.stroke();x.lineWidth=2.6;
    [[1,-24,-16,-44],[1,-28,14,-50],[1,-30,2,-56],[-8,-36,-20,-40],[8,-40,20,-46]].forEach(([a,b,c,d])=>{x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke();});
    x.fillStyle='#fbfcfa';[[-16,-44],[14,-50],[2,-56],[-20,-40],[20,-46]].forEach(([a,b])=>{x.beginPath();x.ellipse(a,b+1,5,2.4,0,0,TAU);x.fill();});x.restore();return;}
  const col=SEASON==='herbst'?['#e0b040','#e8c34a','#d9a03a','#c9a23a'][Math.floor(v*4)]:SEASON==='fruehling'?'#a6cc6a':['#8db35e','#7fa655','#96b866'][Math.floor(v*3)];
  ginkgo(x,px,py,s,col);
  if(SEASON==='herbst'){x.fillStyle=col;for(let i=0;i<4;i++){x.beginPath();x.ellipse(px+(i*9-14)*s,py+(3+(i%2)*3)*s,3.4*s,1.8*s,i,0,TAU);x.fill();}}
}
function seasonItems(items,h){R2S=4242;const tb=bbox(REGION_POLY.find(([k])=>k==='tal')[1]);
  const place=(box,key,test)=>{for(let t=0;t<60;t++){const px=R2(box[0],box[2]),py=R2(box[1],box[3]);if(h.regAt(px,py)===key&&h.ok(px,py)&&(!test||test(px,py)))return[px,py];}return null;};
  for(let i=0;i<90;i++){const p=place(tb,'tal');if(!p)continue;const [px,py]=p,a=r2()*3;
    addItem(items,py,[px-12,py-6,px+12,py+6],x=>{if(SEASON!=='herbst')return;['#e0b040','#d9a03a','#e8c34a'].forEach((c,k)=>{x.fillStyle=c;x.beginPath();x.ellipse(px+Math.cos(a+k*2)*7,py+Math.sin(a+k*2)*3,3.6,2,a+k,0,TAU);x.fill();});},true,{k:()=>SEASON==='herbst'?['herbstlaub']:null,kk:['herbstlaub'],p:'herbstlaub',x:px,y:py,sx:1,sy:1,a});}
  [ST_POS.forscher,ST_POS.zuhause,ST_POS.puzzle].forEach(c=>{const p=place([c[0]-240,c[1]-170,c[0]+240,c[1]+170],'tal');if(!p)return;const [px,py]=p;
    addItem(items,py,[px-26,py-62,px+26,py+6],x=>{if(SEASON==='winter')snowman(x,px,py);},false,{k:()=>SEASON==='winter'?['schneemann']:null,kk:['schneemann'],p:'schneemann',x:px,y:py,sx:1,sy:1});});
}
/* Namen auf der Karte (nur weit herausgezoomt; bildschirmfest, gut lesbar für Eltern) */
const LABELS=[['Forscher-Tal',4450,4280],['Zentralgebirge',3000,3560],['Pangäa-Wüste',3150,4480],['Tethys-Küste',5850,4450],['Laurasia-Wälder',3500,2450],
  ['Sibirische Vulkane',5700,1250],['Gondwana-Hochland',5300,6050],['Fossilien-Ebene',4350,5200],['Gondwana-Wälder',6700,5700],
  ['Tethys-Meer',6600,3500,1],['Panthalassa',1300,3000,1],['Panthalassa',8900,4400,1],['Kimmerische Inseln',7300,4000,2],['Nordchina',7550,1250,2],['Südchina',8050,2750,2],['LAURASIA',4700,1750,3],['GONDWANA',4900,5550,3]];
function drawLabels(x){const z=cam.z,a=DW.clamp((.3-z)/.12,0,1);if(a<=0)return;
  x.save();x.setTransform(DPR,0,0,DPR,0,0);x.textAlign='center';x.textBaseline='middle';
  for(const [t,wx,wy,k] of LABELS){if((k===3||k===4)&&z>.14)continue;if(k===4&&z>.09)continue;const sx=(nearX(wx,cam.x)-cam.x)*z+VW/2,sy=(nearY(wy,cam.y)-cam.y)*z+VH/2;if(sx<-100||sx>VW+100||sy<-40||sy>VH+40)continue;
    if(!k&&fogAt(wx,wy)>.7)continue;
    const fs=k===4?30:k===3?20:k===1?19:k===2?14:16;x.font=`${k===1?'italic ':''}${fs}px "Patrick Hand"`;x.globalAlpha=a*(k===3?.55:k===4?.4:.92);
    x.lineWidth=4;x.strokeStyle='rgba(255,251,243,.85)';x.lineJoin='round';const tt=k>=3?t.split('').join(' '):t;x.strokeText(tt,sx,sy);x.fillStyle=k===1?'#2f5d73':k>=3?'#6e5a44':'#3d3226';x.fillText(tt,sx,sy);}
  x.restore();}
/* Kleiner Globus: zeigt, wo auf der Erde wir gerade sind (Pangäa-Projektion zurückgerechnet) */
const XF=GEO.xf, D2R=Math.PI/180;
function worldToLL(x,y){const X=(x-XF.cx)/XF.sc/XF.sx,Y=(XF.cy-y)/XF.sc;let rho=Math.hypot(X,Y);if(rho<1e-6)return[0,XF.lon0];const r=Math.min(rho,1.995),c=2*Math.asin(r/2);
  return[Math.asin(Y*Math.sin(c)/rho)/D2R,XF.lon0+Math.atan2(X*Math.sin(c),rho*Math.cos(c))/D2R];}
function llToWorld(lat,lon){const phi=lat*D2R,lam=(lon-XF.lon0)*D2R,den=1+Math.cos(phi)*Math.cos(lam);if(den<.02)return null;const k=Math.sqrt(2/den);
  return[XF.cx+k*Math.cos(phi)*Math.sin(lam)*XF.sc*XF.sx,XF.cy-k*Math.sin(phi)*XF.sc];}
let GLL=null;
function globeLand(){if(GLL)return GLL;GLL=new Uint8Array(180*90);for(let j=0;j<90;j++)for(let i=0;i<180;i++){const p=llToWorld(89-j*2,-179+i*2);if(!p||p[0]<0||p[1]<0||p[0]>=WW||p[1]>=WH)continue;GLL[j*180+i]=landAt(p[0],p[1])?1:0;}return GLL;}
function renderGlobe(lat0,lon0,S){const c=globeC||(globeC=mkCanvas(S,S));if(c.width!==S){c.width=c.height=S;}const x=c.getContext('2d'),im=x.createImageData(S,S),d=im.data,G=globeLand(),R_=S/2-1;
  const p0=lat0*D2R,sp=Math.sin(p0),cp=Math.cos(p0);
  for(let j=0;j<S;j++)for(let i=0;i<S;i++){const u=(i+.5-S/2)/R_,v=-(j+.5-S/2)/R_,r2_=u*u+v*v;if(r2_>1)continue;const w=Math.sqrt(1-r2_);
    const lat=Math.asin(v*cp+w*sp),lon=lon0*D2R+Math.atan2(u,w*cp-v*sp);const la=lat/D2R,lo=((lon/D2R+540)%360)-180;
    const gi=DW.clamp(Math.round((lo+179)/2),0,179),gj=DW.clamp(Math.round((89-la)/2),0,89),land=G[gj*180+gi];const sh=.78+.22*w,q=(j*S+i)*4;
    if(land){d[q]=150*sh;d[q+1]=180*sh;d[q+2]=112*sh;}else{d[q]=120*sh;d[q+1]=172*sh;d[q+2]=196*sh;}d[q+3]=255;}
  x.putImageData(im,0,0);return c;}
function drawGlobeIcon(x,T){const want=cam.z<.3||hero.ping>0||wholeT>0?1:0;globeA+=(want-globeA)*.12;if(globeA<.02)return;
  const S=Math.round(64*DPR);if(!globeAt||Math.hypot(hero.x-globeAt[0],hero.y-globeAt[1])>120){const [la,lo]=worldToLL(hero.x,hero.y);renderGlobe(la,lo,S);globeAt=[hero.x,hero.y];}
  const cx=46,cy=VW<600?112:118,r=32;x.save();x.setTransform(DPR,0,0,DPR,0,0);x.globalAlpha=globeA;
  x.fillStyle='rgba(60,50,30,.2)';x.beginPath();x.ellipse(cx+4,cy+r+6,r*.9,6,0,0,TAU);x.fill();
  x.fillStyle='rgba(255,251,243,.95)';x.beginPath();x.arc(cx,cy,r+6,0,TAU);x.fill();x.strokeStyle='rgba(160,130,90,.45)';x.lineWidth=1.5;x.stroke();
  x.drawImage(globeC,cx-r,cy-r,r*2,r*2);
  x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=1;x.beginPath();x.ellipse(cx,cy,r,r*.35,0,0,TAU);x.stroke();x.beginPath();x.ellipse(cx,cy,r*.35,r,0,0,TAU);x.stroke();
  x.fillStyle='rgba(255,255,255,.28)';x.beginPath();x.arc(cx-r*.35,cy-r*.38,r*.28,0,TAU);x.fill();
  x.strokeStyle='rgba(47,93,115,.6)';x.lineWidth=2;x.beginPath();x.arc(cx,cy,r,0,TAU);x.stroke();
  const pr=4+Math.sin(T*5)*1.2;x.fillStyle='#fffbf3';x.beginPath();x.arc(cx,cy,pr+2.5,0,TAU);x.fill();x.fillStyle='#c8553d';x.beginPath();x.arc(cx,cy,pr,0,TAU);x.fill();
  x.restore();}

/* ---------------- Test-Hilfen ---------------- */
function teleport(x,y,boat){hero.legs=[];hero.leg=null;hero.pending=null;onArrive=null;hero.moving=false;hero.markTarget=null;hero.wake=[];hero.trail=[];endTrip();
  x=md(x,WW);y=md(y,WH);
  if(boat){const q=nearestNavPt(x,y);hero.x=md(q[0],WW);hero.y=md(q[1],WH);hero.mode='boat';hero.comp=null;hero.boatA=1;}
  else{hero.x=x;hero.y=y;hero.mode='walk';hero.comp=compOfPoint(x,y);hero.regK=regionAt(x,y);}
  DW.state.pos=[Math.round(hero.x),Math.round(hero.y)];DW.state.boat=hero.mode==='boat';DW.save();cam.follow=true;cam.x=cam.tx=hero.x;cam.y=cam.ty=hero.y-40;reveal(hero.x,hero.y,700);}
function checkLegs(legs){const bad=[];if(!legs)return['noplan'];
  legs.forEach((L,li)=>{if(L.t==='walk'){for(let i=1;i<L.pts.length;i++){const a=L.pts[i-1],b=L.pts[i];const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/10);for(let k=0;k<=n;k++){const u=k/n,px=a[0]+(b[0]-a[0])*u,py=a[1]+(b[1]-a[1])*u;if(!walkAt(px,py)){bad.push('walk@'+Math.round(px)+','+Math.round(py));break;}}}}
    if(L.t==='sail'){if(L.pts.ok===false)bad.push('astar-fail');const n=L.pts.length;for(let i=1;i<n;i++){const a=L.pts[i-1],b=L.pts[i];const m=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/10);for(let k=0;k<=m;k++){const u=k/m,px=a[0]+(b[0]-a[0])*u,py=a[1]+(b[1]-a[1])*u;
        if(distAt(px,py)<(i<3||i>n-3?1:20)&&landAt(px,py)){bad.push('sail@'+Math.round(px)+','+Math.round(py));break;}}}
      for(let i=1;i<n;i++){const a=L.pts[i-1],b=L.pts[i];if(Math.hypot(b[0]-a[0],b[1]-a[1])>WW*.7)bad.push('jump@'+i);}}});
  return bad;}
function legsInfo(legs){return legs?{types:legs.map(L=>L.t),problems:checkLegs(legs),len:Math.round(legs.reduce((a,L)=>a+(L.pts?L.pts.reduce((q,p,i)=>i?q+Math.hypot(p[0]-L.pts[i-1][0],p[1]-L.pts[i-1][1]):q,0):0),0)),
  crossX:legs.some(L=>L.pts&&L.pts.some(p=>p[0]<0||p[0]>=WW)),crossY:legs.some(L=>L.pts&&L.pts.some(p=>p[1]<0||p[1]>=WH))}:null;}
W._debug={
  goto(id){const s=DATA.station(id);const a=ANCHOR[id];if(!s||!a)return false;teleport(a[0],a[1],seaSt(s));return true;},
  teleport(x,y,boat){teleport(x,y,!!boat);return[hero.x,hero.y,hero.mode];},
  planTo(id){const s=DATA.station(id);if(!s)return null;const legs=plan(stationTarget(s));if(!legs)return null;const out=[];legs.forEach(L=>{if(L.pts)L.pts.forEach(p=>out.push([Math.round(p[0]),Math.round(p[1])]));});return out;},
  legs(id){const s=DATA.station(id);return legsInfo(plan(stationTarget(s)));},
  legsTo(x,y){return legsInfo(plan(targetAt(x,y)));},
  sailDump(id){const legs=plan(stationTarget(DATA.station(id)));const L=legs.find(l=>l.t==='sail');return L.pts.map(p=>[Math.round(p[0]),Math.round(p[1]),Math.round(distAt(p[0],p[1])),landAt(p[0],p[1])]);},
  go(id){const s=DATA.station(id);goStation(s);return true;},
  goXY(x,y){goTarget(targetAt(x,y),null);return hero.legs.map(l=>l.t);},
  tapWorld(wx,wy){const s=[(nearX(wx,cam.x)-cam.x)*cam.z+VW/2,(nearY(wy,cam.y)-cam.y)*cam.z+VH/2];tap(s[0],s[1]);return s;},
  speed(k){SPEED=k;},
  hero(){return{x:Math.round(hero.x),y:Math.round(hero.y),mode:hero.mode,comp:hero.comp,moving:hero.moving,leg:hero.leg&&hero.leg.t,legs:hero.legs.map(l=>l.t),land:landAt(hero.x,hero.y)?LANDS[landAt(hero.x,hero.y)-1].k:null,region:regionAt(hero.x,hero.y),mult:+hero.mult.toFixed(2)};},
  cam(x,y,z){if(x!=null){cam.follow=false;cam.x=cam.tx=x;cam.y=cam.ty=y;cam.z=cam.tz=z||cam.z;}return{x:cam.x,y:cam.y,z:cam.z};},
  fog(){return{pct:fogPct,enc:DW.state.fog};},
  fogAt(x,y){return +fogAt(x,y).toFixed(3);},
  revealAll(){FOG.fill(1);fogDirty=true;fogSaveT=.1;},
  disc(){return disc.map(d=>({t:d.t,x:Math.round(d.x),y:Math.round(d.y),done:!!d.done}));},
  collectNear(){const d=disc.find(q=>!q.done&&q.t!=='flasche');if(d){teleport(d.x,d.y,false);}return d&&d.t;},
  validateNodes(){const bad=[];for(const k in NNAME){const i=NNAME[k];if(!walkAt(NX[i],NY[i]))bad.push(k);}
    for(const s of DATA.STATIONS){const p=ST_POS[s.id];if(!p)bad.push('nopos:'+s.id);else if(!seaSt(s)&&!walkAt(p[0],p[1]))bad.push('st:'+s.id);else if(seaSt(s)&&(!ANCHOR[s.id]||!navAt(ANCHOR[s.id][0],ANCHOR[s.id][1])))bad.push('anchor:'+s.id);
      else if(seaSt(s)&&landAt(p[0],p[1]))bad.push('sea-on-land:'+s.id);}
    DOCKS.forEach(d=>{if(!navAt(d.wp[0],d.wp[1]))bad.push('dockwp:'+d.id);});
    const comps={};for(let i=0;i<NX.length;i++)comps[NCOMP[i]]=(comps[NCOMP[i]]||0)+1;
    const mainC=NCOMPOF('forscher'),offMain=DATA.STATIONS.filter(s=>!seaSt(s)&&!ON_LAND.has(s.id)&&!Object.values(ISLAND_ST).includes(s.id)&&NCOMPOF(s.id)!==mainC).map(s=>s.id),islandSt=Object.entries(ISLAND_ST).map(([k,id])=>{const L=LANDS.find(l=>l.k===k);return k+':'+id+(L&&NCOMPOF(id)===L.comp?'':'-FAIL');});
    const islands=LANDS.filter(L=>!L.main).map(L=>({k:L.k,comp:L.comp,dock:DOCKS.some(d=>d.isl===L.k),center:L.center&&L.center.map(Math.round)}));
    return{bad,islandSt,comps:Object.keys(comps).length,nodes:NX.length,roads:ROADS.length,bridges:BRIDGES.length,roadFail:STAT.roadFail,dockFail:STAT.dockFail,offMain,islands,
      docks:DOCKS.map(d=>[d.id,d.comp,d.end.map(Math.round),d.wp.map(Math.round)])};},
  islands(){return LANDS.filter(L=>!L.main).map(L=>({k:L.k,reg:L.reg,center:L.center,dock:(DOCKS.find(d=>d.isl===L.k)||{}).id,comp:L.comp}));},
  stats(){const ft=frameTimes.map(f=>f[0]).filter(v=>v>0).sort((a,b)=>a-b),wt=frameTimes.map(f=>f[1]).sort((a,b)=>a-b);const q=(a,p)=>a.length?+a[Math.min(a.length-1,Math.floor(a.length*p))].toFixed(2):0;
    return{init:Math.round(STAT.init),geo:Math.round(STAT.geo),wash:Math.round(STAT.wash),items:Math.round(STAT.items),overview:Math.round(STAT.overview),nItems:ITEMS.length,nSea:SEA_ITEMS.length,
      tilesL2:L2.map.size,tilesL1:L1.map.size,capL2:L2.cap,tilesRendered:STAT.tiles,tileMsAvg:+(tileMs.reduce((a,b)=>a+b,0)/Math.max(1,tileMs.length)).toFixed(1),tileMsMax:+Math.max(0,...tileMs).toFixed(1),
      frameMed:q(ft,.5),frameP95:q(ft,.95),workMed:q(wt,.5),workP95:q(wt,.95),workMax:q(wt,1),fog:+fogPct.toFixed(3),z:+cam.z.toFixed(3),dpr:DPR,seams:STAT.seams||0,lastTrip:STAT.lastTrip,t:Object.keys(STAT).filter(k=>k.startsWith('t_')).map(k=>k.slice(2)+':'+STAT[k]).join(' ')};},
  profOV(){const c=mkCanvas(WW*OVS,WH*OVS),x=c.getContext('2d');x.setTransform(OVS,0,0,OVS,0,0);const r={};let t=performance.now();const T=k=>{x.getImageData(0,0,1,1);const n=performance.now();r[k]=Math.round(n-t);t=n;};
    drawWash(x,0,0,WW,WH);T('wash');const ls=LANDS;x.lineJoin='round';ls.forEach(L=>{x.strokeStyle='#e7d3a2';x.lineWidth=44;smoothPath(x,L.poly);x.stroke();});T('beach');
    x.save();x.beginPath();ls.forEach(L=>smoothSub(x,L.poly));x.clip();drawWash(x,0,0,WW,WH);T('clipwash');for(const rv of RIVERS)drawRiver(x,rv);x.restore();T('rivers');
    ls.forEach(L=>{x.strokeStyle='rgba(110,88,58,.42)';x.lineWidth=2.2;smoothPath(x,L.poly);x.stroke();});T('ink');
    for(const rd of ROADS){x.beginPath();rd.pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.strokeStyle=rd.st[0];x.lineWidth=26;x.stroke();x.strokeStyle=rd.st[1];x.lineWidth=20;x.stroke();}T('roads');
    x.save();x.globalCompositeOperation='multiply';x.globalAlpha=.18;x.fillStyle=x.createPattern(NT,'repeat');const ps=800/512;x.scale(ps,ps);x.fillRect(0,0,WW/ps,WH/ps);x.restore();T('paper');
    x.save();x.setTransform(1,0,0,1,0,0);x.globalAlpha=.3;x.fillStyle=x.createPattern(GR,'repeat');x.fillRect(0,0,c.width,c.height);x.restore();T('grain');
    let n=0;for(const it of SEA_ITEMS){if(it.s)continue;it.f(x);n++;}T('seaItems'+n);return r;},
  resetFrames(){frameTimes=[];tileMs=[];},
  km(){const n=Object.keys(K_PROBE).concat(Object.keys(LM).map(k=>'wahrzeichen_'+k));return{on:KM.on,sets:Object.keys(KM.sets),stale:KM.stale,tex:!!KM.tx,box:Object.fromEntries(n.map(k=>[k,(kmMeasure(k)||[]).map(v=>Math.round(v))]))};},
  _draw:drawWorld,
  clearTiles(){L1.map.clear();L2.map.clear();},
  clock(iso){CLOCK=iso==null?null:(typeof iso==='number'?iso:Date.parse(iso));envUpdate();reseason();PART=[];RAIN=[];envT=1;return Object.assign({season:SEASON},ENV);},
  env(){return Object.assign({season:SEASON,parts:PART.filter(p=>p.on).length,rain:RAIN.length},ENV);},
  region(){return curRegion;},
  regionAt(x,y){return regionAt(x,y);},
  walkAt(x,y){return walkAt(x,y);},
  distAt(x,y){return Math.round(distAt(x,y));},
  dockDbg(k){const L=LANDS.find(l=>l.k===k);if(!L)return null;const [a,b,c,d]=L.bb;let n={coast:0,ray:0,at:0,nav:0,bounds:0};const cx=L.center[0],cy=L.center[1],R_=Math.max(c-a,d-b);
    for(let j=Math.floor((cy-R_)/MS);j<=Math.ceil((cy+R_)/MS);j+=2)for(let i=Math.floor((cx-R_)/MS);i<=Math.ceil((cx+R_)/MS);i+=2){const x=(i+.5)*MS,y=(j+.5)*MS;if(landAt(x,y)!==L.idx||dinAt(x,y)>10)continue;n.coast++;
      for(let q=0;q<24;q++){const ang=q/24*TAU,ux=Math.cos(ang),uy=Math.sin(ang);if(landAt(x+ux*40,y+uy*40)||landAt(x+ux*110,y+uy*110)||landAt(x+ux*190,y+uy*190))continue;n.ray++;const ax=x-ux*38,ay=y-uy*38;if(!walkAt(ax,ay)||dinAt(ax,ay)<20)continue;n.at++;
        const wp=[x+ux*200,y+uy*200];if(!navAt(wp[0],wp[1]))continue;n.nav++;}}return n;},
  navAt(x,y){return navAt(x,y);},
  ll(x,y){return worldToLL(x,y).map(v=>+v.toFixed(1));},
  map(scale){scale=scale||.1;const c=mkCanvas(WW*scale,WH*scale),x=c.getContext('2d');x.drawImage(OV,0,0,c.width,c.height);x.scale(scale,scale);
    x.strokeStyle='rgba(200,40,40,.7)';x.lineWidth=2/scale;ROADS.forEach(r=>{x.beginPath();r.pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();});
    x.fillStyle='#00f';DOCKS.forEach(d=>{x.beginPath();x.arc(d.end[0],d.end[1],30,0,TAU);x.fill();x.fillStyle='#0a0';x.beginPath();x.arc(d.wp[0],d.wp[1],24,0,TAU);x.fill();x.fillStyle='#00f';});
    x.font=(12/scale)+'px sans-serif';x.fillStyle='#000';for(const s of DATA.STATIONS){const p=ST_POS[s.id];x.beginPath();x.arc(p[0],p[1],26,0,TAU);x.fill();x.fillText(s.id,p[0]+30,p[1]);const a=ANCHOR[s.id];if(s.sea&&a){x.fillStyle='#f0f';x.beginPath();x.arc(a[0],a[1],22,0,TAU);x.fill();x.fillStyle='#000';}}
    x.fillStyle='rgba(255,0,0,.25)';for(let j=0;j<GH;j+=1)for(let i=0;i<GW;i+=1)if(!NAV[j*GW+i]&&!LAND[cellIdx((i+.5)*WG,(j+.5)*WG)])x.fillRect(i*WG,j*WG,WG,WG);
    return c.toDataURL('image/png');},
};
window.WORLD=W;
})();
