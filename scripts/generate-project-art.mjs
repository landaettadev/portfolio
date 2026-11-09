// Original vector product studies. These are concepts, not production screenshots.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const output = fileURLToPath(new URL('../public/assets/projects/', import.meta.url));
mkdirSync(output, { recursive: true });
const text = (x,y,value,size=16,color='#b8b0cd',weight=400) => `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" fill="${color}" font-weight="${weight}">${value}</text>`;
const rect = (x,y,w,h,fill='#191426',r=12,stroke='#3c334e') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
const line = (x1,y1,x2,y2,color='#3c334e',width=2) => `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
const dot = (x,y,r=4,color='#5eead4') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
const pill = (x,y,label,color='#5eead4',w=120) => rect(x,y,w,30,'#211b31',15)+dot(x+14,y+15,3,color)+text(x+25,y+20,label,12,color);
const bars = (x,y,widths,color='#4c405f') => widths.map((w,i)=>rect(x,y+i*15,w,5,color,2,color)).join('');
const chrome = (label,body) => rect(80,70,800,444,'#110e1d',18)+rect(80,70,800,44,'#20192e',18)+rect(81,94,798,20,'#20192e',0,'none')+dot(102,92,4,'#b78c9c')+dot(118,92,4,'#ccb183')+dot(134,92,4,'#77baa8')+text(160,97,label,13,'#cbc2da')+body;
function save(name,accent,body) {
 const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600"><defs><radialGradient id="halo"><stop stop-color="${accent}" stop-opacity=".2"/><stop offset="1" stop-color="#141026" stop-opacity="0"/></radialGradient><linearGradient id="glass" x2="1" y2="1"><stop stop-color="#302740"/><stop offset="1" stop-color="#151120"/></linearGradient><linearGradient id="cover" x2=".8" y2="1"><stop stop-color="${accent}"/><stop offset="1" stop-color="#282047"/></linearGradient></defs><rect width="960" height="600" fill="#141026"/><ellipse cx="480" cy="280" rx="510" ry="350" fill="url(#halo)"/><g>${body}</g></svg>`;
 writeFileSync(output+name+'.svg',svg);
}

save('reports','#a78bfa',chrome('Report studio / Google Cloud',
 text(112,154,'Business intelligence',25,'#eeeafb',600)+pill(676,132,'AI assisted','#bda6ff',160)+
 rect(112,181,452,264)+text(136,213,'Data overview',15,'#eeeafb')+
 [263,313,363,413].map(y=>line(140,y,536,y,'#30283f',1)).join('')+
 [54,90,67,119,102,156,132,185].map((h,i)=>rect(148+i*47,414-h,23,h,i>5?'#5eead4':'#71608e',4,'none')).join('')+
 rect(586,181,262,264,'#e8e2f1',12,'none')+rect(608,202,70,22,'#d3c6e5',4,'none')+text(616,217,'REPORT',10,'#5c4178',600)+
 text(608,255,'Business summary',19,'#30253f',600)+bars(608,275,[212,191,205],'#ada0bd')+
 text(608,340,'Key insights',14,'#4b385e',600)+bars(608,359,[199,180,211,156],'#b9adc7')+
 pill(112,465,'BigQuery','#8ab4f8',125)+line(241,480,269,480,'#7c6c99')+pill(278,465,'Cloud Run','#5eead4',133)+line(416,480,443,480,'#7c6c99')+pill(452,465,'Gemini','#c3a3ff',119)+line(577,480,607,480,'#7c6c99')+pill(616,465,'Cloud Storage','#f2c780',170)));

save('bitcoin','#d5a76c',
 '<ellipse cx="440" cy="523" rx="245" ry="23" fill="#08060e" opacity=".6"/>'+
 '<path d="M294 72H539L583 109V504H294Z" fill="#292334" stroke="#5b4c60"/><path d="M539 72L583 109V504L539 478Z" fill="#18131f"/>'+
 rect(310,89,212,388,'url(#glass)',17,'#51435f')+
 dot(416,132,23,'#d9ab69')+text(404,143,'₿',31,'#201629',600)+
 rect(328,177,177,192,'#0d0c16',9)+text(349,206,'Bitcoin ATM',18,'#eeeafb',600)+
 text(350,232,'Select a transaction',11)+rect(349,252,135,38,'#d9ab69',6,'none')+text(384,276,'Buy BTC',14,'#22172c',600)+
 rect(349,301,135,38,'#252033',6)+text(383,326,'Sell BTC',14,'#e5dced')+
 rect(354,394,124,9,'#07060b',3)+line(362,398,470,398,'#5eead4',2)+rect(377,431,78,19,'#100c17',4)+
 rect(604,167,248,114,'#191426',12,'#665039')+text(626,199,'CoinPayments',21,'#f0d4af',600)+text(626,227,'Crypto transaction API',13)+pill(625,240,'Connected','#d9ab69',130)+
 line(583,221,604,221,'#d9ab69',2)+
 rect(92,322,188,100)+text(114,354,'Transaction layer',16,'#eeeafb',600)+text(114,383,'C# / Web Forms',13)+text(114,404,'SQL Server',13)+line(280,372,310,372,'#d9ab69'));

const product = (x,label,kind,color) => rect(x,210,208,226,'#211a31',10)+
 (kind==='headphones' ? `<path d="M${x+61} 302V277a43 43 0 0 1 86 0v25" fill="none" stroke="${color}" stroke-width="12"/>`+rect(x+52,287,24,48,color,10,'none')+rect(x+133,287,24,48,color,10,'none') :
 kind==='bag' ? `<path d="M${x+82} 266v-14a22 22 0 0 1 44 0v14" fill="none" stroke="${color}" stroke-width="5"/>`+rect(x+63,264,83,87,color,14,'none')+rect(x+76,299,57,35,'#ffffff20',8,'none') :
 rect(x+91,229,28,131,'#646071',12,'none')+rect(x+75,265,60,62,color,16,'none')+rect(x+81,271,48,50,'#171527',12,'none')+line(x+105,295,x+105,280,color,3)+line(x+105,295,x+119,301,color,3))+
 text(x+18,391,label,16,'#eeeafb',600)+text(x+18,415,'Selected for you',12);
save('retail','#5eead4',chrome('Just for You / Recommendation engine',
 text(112,158,'Discover your next favorite.',27,'#eeeafb',600)+text(112,186,'A selection shaped around you.',14)+
 product(112,'Everyday audio','headphones','#c5a6ec')+product(344,'Carry essentials','bag','#74c8bc')+product(576,'Time, reimagined','watch','#edbb8b')+
 pill(112,465,'Teradata','#e9b28c',130)+line(249,480,284,480,'#5eead4')+pill(295,465,'Python / ML','#5eead4',150)+line(452,480,487,480,'#5eead4')+pill(498,465,'Node.js + React','#bda6ff',185)));

const cover=(x,title,index,color)=>rect(x,228,204,201,'#211b33',10)+
 `<svg x="${x+8}" y="236" width="188" height="144" viewBox="0 0 188 144"><rect width="188" height="144" rx="6" fill="url(#cover)"/><circle cx="${90+index*17}" cy="64" r="40" fill="none" stroke="${color}" stroke-width="2"/><circle cx="${90+index*17}" cy="64" r="29" fill="${color}" opacity=".25"/><path d="M0 144L60 64L120 144M57 144L131 41L188 144" fill="#141026" stroke="${color}" stroke-width="1.5"/><path d="M0 119H188M0 129H188" stroke="${color}" opacity=".3"/></svg>`+text(x+18,409,title,15,'#eeeafb',600);
save('games','#9c7bea',chrome('PopularKeys / Digital games',
 text(112,160,'PopularKeys',28,'#eeeafb',600)+text(112,192,'Game keys, ready when you are.',17,'#c2afd9')+pill(686,144,'Kinguin API','#bda6ff',160)+
 cover(112,'ORBIT / EXPLORER',0,'#b9a0ff')+cover(334,'AFTERLIGHT',1,'#6fe3d0')+cover(556,'THE LAST HORIZON',2,'#e5b986')+
 rect(113,452,660,42,'#251d38',8)+text(133,479,'Catalog',13,'#eeeafb')+text(269,479,'Checkout',13,'#eeeafb')+text(422,479,'Payment gateways',13,'#eeeafb')+text(652,479,'Game keys',13,'#bda6ff')));

save('social','#77bfce',chrome('1popularity / Service workspace',
 text(112,158,'1popularity',26,'#eeeafb',600)+pill(680,135,'Provider APIs','#5eead4',167)+
 rect(112,184,170,284)+text(132,219,'Workspace',15,'#eeeafb',600)+
 rect(125,241,144,36,'#313047',6,'none')+text(141,264,'Orders',14,'#83e6db')+text(141,307,'Services',14)+text(141,349,'Providers',14)+text(141,391,'Payments',14)+
 rect(302,184,546,107)+text(326,216,'Service orchestration',17,'#eeeafb',600)+
 pill(326,237,'Request','#bda6ff',127)+line(461,252,487,252,'#5eead4')+pill(497,237,'Provider','#5eead4',127)+line(633,252,659,252,'#5eead4')+pill(668,237,'Delivery','#e5bd86',155)+
 rect(302,308,546,160)+text(326,338,'Service',12)+text(563,338,'Provider',12)+text(726,338,'Status',12)+
 [0,1,2].map((i)=>line(325,350+i*35,823,350+i*35,'#30283f',1)+text(326,373+i*35,['Content promotion','Social engagement','Channel services'][i],13,'#e2d9ed')+text(563,373+i*35,'API connection',12)+dot(733,369+i*35,4,['#5eead4','#bda6ff','#e5bd86'][i])+text(747,373+i*35,['Delivered','Processing','Queued'][i],11)).join('')));

const node=(x,y,title,sub,color)=>rect(x,y,210,94,'url(#glass)',12,'#544369')+dot(x+23,y+28,5,color)+text(x+40,y+34,title,19,'#eeeafb',600)+text(x+22,y+66,sub,13);
save('enterprise','#9182c6',
 text(82,102,'Enterprise systems',30,'#eeeafb',600)+text(82,134,'Interfaces. Business logic. Connected data.',16)+
 '<path d="M290 263H368M578 263H660M472 310V394M186 310V440H367M765 310V440H578" fill="none" stroke="#796591" stroke-width="2"/>'+
 node(80,216,'Angular','Application interface','#c8a1ed')+node(368,216,'.NET / C#','Business services','#5eead4')+node(660,216,'SQL','Data layer','#d9b98d')+
 node(368,394,'Integrations','MVC / PROXY','#a7b8f0')+
 dot(330,263,5,'#c8a1ed')+dot(621,263,5,'#5eead4')+dot(473,351,5,'#a7b8f0')+
 text(82,536,'APPLICATION',11,'#9589ac')+text(370,536,'SERVICES',11,'#9589ac')+text(663,536,'DATA',11,'#9589ac'));
