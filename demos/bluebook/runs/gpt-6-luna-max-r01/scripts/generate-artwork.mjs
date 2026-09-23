import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const outputDirectory = fileURLToPath(new URL('../images/', import.meta.url));

const palettes = {
  coffee: { bg: '#ead7c1', pale: '#f6eadb', mid: '#bf8665', dark: '#573f39', accent: '#e8aa7c', green: '#82906b' },
  tulip: { bg: '#f1d8dd', pale: '#fff1ec', mid: '#d7869c', dark: '#563d4b', accent: '#e9a6b0', green: '#718b70' },
  coast: { bg: '#b9dce8', pale: '#e3f3f3', mid: '#77b4c7', dark: '#345d78', accent: '#f1cf98', green: '#6b9d9b' },
  room: { bg: '#eddfce', pale: '#fff5df', mid: '#b8c98e', dark: '#69584a', accent: '#e8ae85', green: '#738c67' },
  brunch: { bg: '#f1d6ba', pale: '#fff3dc', mid: '#dba36f', dark: '#694d43', accent: '#dd716f', green: '#829060' },
  cafe: { bg: '#d9c8b4', pale: '#f7ecda', mid: '#a97862', dark: '#493f3b', accent: '#e5b57a', green: '#84906b' },
  plant: { bg: '#d8e4ca', pale: '#f2f4e3', mid: '#89a57b', dark: '#465e50', accent: '#c49b76', green: '#678567' },
  cat: { bg: '#f0d6b6', pale: '#fff1d8', mid: '#e09c5f', dark: '#55433d', accent: '#f0c17f', green: '#8a9b73' },
  soda: { bg: '#e7e5ad', pale: '#faf3c8', mid: '#b7c875', dark: '#52645d', accent: '#f2bc63', green: '#7f9f79' },
  market: { bg: '#f1d9db', pale: '#fff0e5', mid: '#ce91a0', dark: '#60454d', accent: '#e8b46d', green: '#7e9c79' },
  dusk: { bg: '#d8d3e3', pale: '#f7e6dc', mid: '#9588aa', dark: '#454867', accent: '#efb785', green: '#6b8091' },
  library: { bg: '#e2d6c9', pale: '#fff0db', mid: '#bf8d71', dark: '#544746', accent: '#d9b577', green: '#87906f' },
  picnic: { bg: '#dce6c9', pale: '#f5f0d9', mid: '#d68c72', dark: '#59604d', accent: '#e0ba78', green: '#829564' },
  city: { bg: '#f1c5a6', pale: '#fde4ca', mid: '#db906f', dark: '#4d4859', accent: '#f3c06f', green: '#77816d' },
  vase: { bg: '#ead9ce', pale: '#fff1dd', mid: '#c09175', dark: '#56484b', accent: '#dfaa8d', green: '#798866' },
  noodle: { bg: '#e9d0bb', pale: '#fff2d7', mid: '#d9945d', dark: '#554449', accent: '#e0b36c', green: '#839069' },
  plans: { bg: '#d9d9ed', pale: '#f7eff2', mid: '#a39bc2', dark: '#4d4e68', accent: '#e2ad9b', green: '#7d967d' },
  rainy: { bg: '#cbdbe3', pale: '#edf0e8', mid: '#809ca9', dark: '#475568', accent: '#e3b986', green: '#80917d' },
  bakery: { bg: '#f0d9b0', pale: '#fff2d6', mid: '#d59b5c', dark: '#594844', accent: '#ebba70', green: '#83906a' },
  evening: { bg: '#d9d4e5', pale: '#f4e2da', mid: '#8d87a8', dark: '#444158', accent: '#f0bf87', green: '#718272' },
  fallback: { bg: '#eee8e9', pale: '#faf5f3', mid: '#d9c5c8', dark: '#7e727a', accent: '#e9a5af', green: '#a5b59c' },
};

const artworks = [
  { id: 'morning-coffee', scene: 'coffee', h: 760, label: 'SLOW MORNING', art: coffeeArt },
  { id: 'tulip-letter', scene: 'tulip', h: 1020, label: 'PETALS & DAYS', art: tulipArt },
  { id: 'blue-coast', scene: 'coast', h: 720, label: 'COASTAL BLUE', art: coastArt },
  { id: 'sunny-room', scene: 'room', h: 980, label: 'A LITTLE SUNROOM', art: roomArt },
  { id: 'strawberry-brunch', scene: 'brunch', h: 800, label: 'SUNDAY BRUNCH', art: brunchArt },
  { id: 'corner-cafe', scene: 'cafe', h: 960, label: 'THE CORNER CAFE', art: cafeArt },
  { id: 'green-corner', scene: 'plant', h: 720, label: 'GREEN CORNER', art: plantArt },
  { id: 'sunny-cat', scene: 'cat', h: 930, label: 'CAT NAP CLUB', art: catArt },
  { id: 'lemon-soda', scene: 'soda', h: 760, label: 'CITRUS BREAK', art: sodaArt },
  { id: 'flower-market', scene: 'market', h: 1040, label: 'FLOWER MARKET', art: marketArt },
  { id: 'dusk-mountains', scene: 'dusk', h: 730, label: 'AFTERGLOW', art: duskArt },
  { id: 'little-library', scene: 'library', h: 950, label: 'PAPER & STORIES', art: libraryArt },
  { id: 'picnic-afternoon', scene: 'picnic', h: 780, label: 'PICNIC NOTES', art: picnicArt },
  { id: 'orange-city', scene: 'city', h: 920, label: 'GOLDEN HOUR', art: cityArt },
  { id: 'handmade-vase', scene: 'vase', h: 860, label: 'MADE BY HAND', art: vaseArt },
  { id: 'noodle-night', scene: 'noodle', h: 760, label: 'COMFORT BOWL', art: noodleArt },
  { id: 'paper-plans', scene: 'plans', h: 1000, label: 'A PAGE OF IDEAS', art: plansArt },
  { id: 'rainy-walk', scene: 'rainy', h: 730, label: 'RAINY DAY WALK', art: rainyArt },
  { id: 'bakery-croissant', scene: 'bakery', h: 880, label: 'FRESH FROM OVEN', art: bakeryArt },
  { id: 'quiet-evening', scene: 'evening', h: 990, label: 'SOFT EVENING', art: eveningArt },
  { id: 'fallback', scene: 'fallback', h: 760, label: 'A LITTLE MOMENT', art: fallbackArt },
];

function coffeeArt(c) {
  return `<ellipse cx="455" cy="565" rx="270" ry="54" fill="${c.dark}" opacity=".12"/><path d="M254 354h324v141c0 69-52 119-120 119h-84c-68 0-120-50-120-119V354Z" fill="${c.pale}" stroke="${c.dark}" stroke-width="10"/><path d="M578 386h53c51 0 66 92 8 112l-63 22" fill="none" stroke="${c.pale}" stroke-width="30"/><path d="M578 386h53c51 0 66 92 8 112l-63 22" fill="none" stroke="${c.dark}" stroke-width="9"/><ellipse cx="416" cy="355" rx="162" ry="36" fill="${c.dark}"/><ellipse cx="416" cy="350" rx="141" ry="25" fill="${c.mid}"/><path d="M356 284c-26-26 22-42-2-75m83 75c-26-26 22-42-2-75m81 75c-26-26 22-42-2-75" fill="none" stroke="${c.dark}" stroke-width="8" stroke-linecap="round" opacity=".45"/><circle cx="220" cy="585" r="18" fill="${c.accent}"/><circle cx="672" cy="576" r="13" fill="${c.mid}"/>`;
}

function tulipArt(c) {
  return `<path d="M260 680h385l-38 85H298l-38-85Z" fill="${c.mid}"/><path d="M272 682c44-80 280-80 361 0" fill="${c.pale}" opacity=".9"/><path d="M348 636V298m103 338V245m103 390V330m-152 302c-60-57-99-58-128-35 26 52 77 72 128 51m150-15c55-48 91-48 121-26-25 46-73 62-120 44m-76-311c-3-71 38-111 82-112 23 47 5 88-82 112Zm-2 3c-53-57-107-60-133-32 17 55 69 77 132 56Zm50 100c-48-60-45-113-11-147 44 29 57 76 14 147Zm-1 7c-67-35-119-21-135 17 39 42 93 43 137-8Zm82 3c-37-62-26-114 15-141 39 37 43 85-10 142Z" fill="${c.green}" stroke="${c.dark}" stroke-width="7" stroke-linejoin="round"/><path d="M275 681c79 35 278 35 364 0" fill="none" stroke="${c.dark}" stroke-width="8" opacity=".35"/>`;
}

function coastArt(c) {
  return `<circle cx="662" cy="305" r="91" fill="${c.accent}"/><path d="m105 532 210-235 166 175 128-137 195 197v142H105V532Z" fill="${c.mid}"/><path d="m105 574 214-168 164 135 139-93 182 149v94H105v-117Z" fill="${c.green}"/><path d="M105 590c79-24 142-24 214 0s142 24 214 0 142-24 214 0 58 20 91 18v161H105V590Z" fill="${c.pale}"/><path d="M105 632c79-24 142-24 214 0s142 24 214 0 142-24 214 0 58 20 91 18" fill="none" stroke="${c.mid}" stroke-width="12" stroke-linecap="round"/><path d="M105 686c79-24 142-24 214 0s142 24 214 0 142-24 214 0 58 20 91 18" fill="none" stroke="${c.mid}" stroke-width="8" stroke-linecap="round" opacity=".65"/><path d="M286 522h92m-68-19 48 38" stroke="${c.dark}" stroke-width="8" stroke-linecap="round" opacity=".65"/>`;
}

function roomArt(c) {
  return `<rect x="171" y="215" width="462" height="378" rx="15" fill="${c.dark}"/><rect x="193" y="237" width="418" height="334" rx="7" fill="${c.pale}"/><rect x="209" y="253" width="386" height="302" rx="4" fill="${c.bg}"/><path d="M402 253v302M209 400h386" stroke="${c.pale}" stroke-width="15"/><circle cx="505" cy="322" r="57" fill="${c.accent}"/><path d="m215 452 120-103 116 127 96-88 48 53v114H215V452Z" fill="${c.green}" opacity=".8"/><path d="M135 616h539v35H135z" fill="${c.dark}"/><path d="M324 649h166l-20 94H345l-21-94Z" fill="${c.mid}"/><path d="M400 650v-88m0 42c-58-52-100-46-113-17 29 35 68 40 113 17Zm0-23c38-59 78-64 101-39-18 41-52 54-101 39Z" fill="${c.green}" stroke="${c.dark}" stroke-width="6" stroke-linejoin="round"/><path d="M181 215c-42 47-39 167 0 214m440-214c42 47 39 167 0 214" fill="none" stroke="${c.accent}" stroke-width="23" opacity=".65"/>`;
}

function brunchArt(c) {
  return `<ellipse cx="457" cy="566" rx="293" ry="71" fill="${c.dark}" opacity=".14"/><circle cx="451" cy="483" r="211" fill="${c.pale}" stroke="${c.dark}" stroke-width="9"/><circle cx="451" cy="483" r="160" fill="#fff8eb" stroke="${c.accent}" stroke-width="5"/><path d="M306 475c21-95 63-131 145-131s125 38 146 131c-76 59-211 62-291 0Z" fill="${c.mid}" stroke="${c.dark}" stroke-width="8"/><path d="M355 393c19 12 28 31 24 54m55-104c17 18 21 39 10 60m64-56c16 17 19 35 8 55" fill="none" stroke="${c.pale}" stroke-width="10" stroke-linecap="round"/><path d="M442 376c-4-48 24-77 60-76 19 35 6 64-60 76Zm0 4c-42-34-81-29-95-4 22 34 54 40 95 15Z" fill="${c.accent}" stroke="${c.dark}" stroke-width="5"/><circle cx="463" cy="386" r="8" fill="${c.green}"/><path d="m672 341 86 202m-51-219 57-23" stroke="${c.dark}" stroke-width="11" stroke-linecap="round"/><path d="m670 341 40-17m-28 47 42-17m-29 47 42-17" stroke="${c.pale}" stroke-width="7" stroke-linecap="round"/>`;
}

function cafeArt(c) {
  return `<rect x="175" y="296" width="550" height="379" rx="19" fill="${c.pale}" stroke="${c.dark}" stroke-width="10"/><rect x="223" y="414" width="190" height="181" rx="8" fill="${c.bg}" stroke="${c.dark}" stroke-width="8"/><rect x="455" y="414" width="220" height="261" rx="8" fill="${c.mid}" stroke="${c.dark}" stroke-width="8"/><path d="M198 326h506v97H198z" fill="${c.accent}" stroke="${c.dark}" stroke-width="8"/><path d="M198 326h84v97h-84m168-97h84v97h-84m168-97h84v97h-84" fill="${c.pale}"/><path d="M198 422h506" stroke="${c.dark}" stroke-width="8"/><rect x="490" y="449" width="145" height="120" rx="4" fill="${c.pale}" opacity=".87"/><path d="M222 462h190m-190 35h190m-190 35h190" stroke="${c.pale}" stroke-width="5" opacity=".6"/><path d="M144 674h614" stroke="${c.dark}" stroke-width="15" stroke-linecap="round"/><circle cx="341" cy="370" r="15" fill="${c.mid}"/><path d="M319 369h45" stroke="${c.dark}" stroke-width="6" stroke-linecap="round"/>`;
}

function plantArt(c) {
  return `<ellipse cx="458" cy="641" rx="205" ry="44" fill="${c.dark}" opacity=".12"/><path d="M321 509h276l-38 166H359l-38-166Z" fill="${c.mid}" stroke="${c.dark}" stroke-width="9"/><path d="M307 500h304v31H307z" rx="8" fill="${c.pale}" stroke="${c.dark}" stroke-width="9"/><path d="M458 503V246m0 188c-113-103-183-91-205-38 52 67 126 79 205 38Zm1-54c78-131 157-142 202-84-36 91-105 121-202 84Zm-2-79c-48-103-30-180 29-218 63 60 69 134-29 218Zm-1 162c-73-78-78-147-32-187 64 36 83 95 37 187Z" fill="${c.green}" stroke="${c.dark}" stroke-width="8" stroke-linejoin="round"/><path d="M404 605c36 15 77 15 112 0" fill="none" stroke="${c.pale}" stroke-width="8" stroke-linecap="round" opacity=".7"/>`;
}

function catArt(c) {
  return `<ellipse cx="451" cy="672" rx="240" ry="45" fill="${c.dark}" opacity=".11"/><path d="M293 642c-21-118 15-220 126-232 110-12 187 61 185 189-2 104-66 145-165 145-75 0-134-34-146-102Z" fill="${c.mid}" stroke="${c.dark}" stroke-width="10"/><path d="m324 431 3-143 112 94m47 1 105-98 11 151" fill="${c.mid}" stroke="${c.dark}" stroke-width="10" stroke-linejoin="round"/><path d="m353 367 1-42 53 43m99 5 49-45 4 57" fill="${c.accent}" opacity=".85"/><ellipse cx="386" cy="462" rx="12" ry="18" fill="${c.dark}"/><ellipse cx="511" cy="462" rx="12" ry="18" fill="${c.dark}"/><path d="M425 498q23 20 46 0m-23 0v25m-2-1c-31 29-52 31-80 28m80-28c31 29 52 31 80 28" fill="none" stroke="${c.dark}" stroke-width="7" stroke-linecap="round"/><path d="M300 543c-82-12-115 27-96 66 21 44 85 31 110-2m247 106c81 35 125 11 117-32-7-35-49-47-85-28" fill="none" stroke="${c.dark}" stroke-width="15" stroke-linecap="round"/><circle cx="345" cy="518" r="13" fill="${c.accent}" opacity=".85"/><circle cx="553" cy="518" r="13" fill="${c.accent}" opacity=".85"/>`;
}

function sodaArt(c) {
  return `<ellipse cx="462" cy="672" rx="164" ry="34" fill="${c.dark}" opacity=".1"/><path d="M353 323h221l-25 360c-3 40-25 60-62 60h-48c-37 0-59-20-62-60l-24-360Z" fill="${c.pale}" fill-opacity=".72" stroke="${c.dark}" stroke-width="10" stroke-linejoin="round"/><path d="m371 485 187-6-10 197c-2 23-14 36-38 36h-92c-25 0-37-13-39-36l-8-191Z" fill="${c.mid}" opacity=".9"/><path d="m475 319 58-117" stroke="${c.dark}" stroke-width="12" stroke-linecap="round"/><circle cx="428" cy="467" r="21" fill="${c.pale}"/><circle cx="500" cy="549" r="18" fill="${c.pale}"/><circle cx="437" cy="605" r="13" fill="${c.pale}"/><circle cx="628" cy="302" r="89" fill="${c.accent}" stroke="${c.dark}" stroke-width="8"/><circle cx="628" cy="302" r="24" fill="${c.pale}"/><path d="M628 216v172m-84-86h168m-143-61 119 122m0-122L569 363" stroke="${c.pale}" stroke-width="7" opacity=".9"/><path d="M270 395c-41 12-61 41-56 83m438 210c41-7 65-34 65-75" fill="none" stroke="${c.green}" stroke-width="9" stroke-linecap="round"/>`;
}

function marketArt(c) {
  return `<path d="M261 616h375l-37 96H298l-37-96Z" fill="${c.mid}" stroke="${c.dark}" stroke-width="9"/><path d="M285 619c29-49 296-49 329 0" fill="${c.pale}"/><path d="M348 610V369m91 240V298m104 312V372m-155 224c-53-57-94-67-129-43 26 51 78 73 129 49m111-16c51-56 95-62 127-36-27 51-77 68-127 45m-108-247c-15-76 16-123 60-134 32 45 21 91-60 134Z" fill="${c.green}" stroke="${c.dark}" stroke-width="7" stroke-linejoin="round"/><path d="M399 310c-27-73 0-123 44-137 42 37 36 86-44 137Zm96 76c-10-78 24-118 68-124 28 50 10 94-68 124Zm-211-47c-2-75 35-111 79-109 22 53-1 93-79 109Z" fill="${c.accent}" stroke="${c.dark}" stroke-width="7" stroke-linejoin="round"/><circle cx="443" cy="273" r="15" fill="${c.pale}"/><circle cx="562" cy="337" r="15" fill="${c.pale}"/><circle cx="359" cy="353" r="15" fill="${c.pale}"/><path d="M238 715h428" stroke="${c.dark}" stroke-width="10" stroke-linecap="round" opacity=".4"/>`;
}

function duskArt(c) {
  return `<circle cx="654" cy="326" r="104" fill="${c.accent}"/><path d="m105 626 220-280 155 189 133-162 182 253v59H105v-59Z" fill="${c.mid}"/><path d="m105 640 197-139 175 123 169-126 149 114v73H105v-45Z" fill="${c.dark}" opacity=".8"/><path d="M105 663h795v85H105z" fill="${c.pale}" opacity=".36"/><path d="M196 678h506m-440 22h360" stroke="${c.pale}" stroke-width="7" stroke-linecap="round" opacity=".6"/><path d="M257 295c26-33 60-33 85 0m285 10c23-28 52-28 74 0" fill="none" stroke="${c.dark}" stroke-width="7" stroke-linecap="round" opacity=".6"/>`;
}

function libraryArt(c) {
  return `<rect x="185" y="258" width="530" height="432" rx="14" fill="${c.pale}" stroke="${c.dark}" stroke-width="10"/><path d="M214 293h472v119H214z" fill="${c.bg}"/><path d="M235 412V310h74v102m14 0V279h91v133m14 0V326h67v86m15 0V291h87v121m17 0V312h62v100" fill="${c.mid}" stroke="${c.dark}" stroke-width="6"/><path d="M241 335h62m21-14h76m15 49h59m17-56h73m16 36h46" stroke="${c.accent}" stroke-width="8" stroke-linecap="round"/><path d="M214 452h472v116H214z" fill="${c.pale}"/><path d="M240 555h62V462h-62zm78 0h91V475h-91zm108 0h73V448h-73zm88 0h81V470h-81zm95 0h60V455h-60z" fill="${c.green}" stroke="${c.dark}" stroke-width="6"/><path d="M189 582h522" stroke="${c.dark}" stroke-width="9"/><path d="M378 686c11-38 32-61 66-68 10 39-13 65-66 68Zm1 1c32-35 65-49 97-45-10 34-42 50-97 45Z" fill="${c.green}" stroke="${c.dark}" stroke-width="5"/>`;
}

function picnicArt(c) {
  return `<path d="M169 416h562v289H169z" rx="18" fill="${c.accent}" stroke="${c.dark}" stroke-width="9"/><path d="M169 489h562m-562 72h562m-562 72h562m-421-217v289m141-289v289m141-289v289" stroke="${c.pale}" stroke-width="12" opacity=".8"/><path d="M330 368h246l42 190H286l44-190Z" fill="${c.mid}" stroke="${c.dark}" stroke-width="9"/><path d="M319 427h270m-250 47h230m-210 47h190" stroke="${c.pale}" stroke-width="9"/><path d="M424 369c4-88 47-125 106-116 29 69-11 112-106 116Zm-2 2c-62-71-125-75-157-35 28 65 84 89 157 54Z" fill="${c.green}" stroke="${c.dark}" stroke-width="7"/><circle cx="267" cy="334" r="47" fill="${c.accent}" stroke="${c.dark}" stroke-width="7"/><circle cx="267" cy="334" r="15" fill="${c.pale}"/><path d="M640 348c38-28 75-20 93 18m-35-49 44-11" fill="none" stroke="${c.dark}" stroke-width="9" stroke-linecap="round"/>`;
}

function cityArt(c) {
  return `<circle cx="650" cy="311" r="109" fill="${c.accent}"/><path d="M132 492h130v277H132zm147-102h143v379H279zm161 62h111v317H440zm130-151h149v468H570zm167 125h103v343H737z" fill="${c.mid}" stroke="${c.dark}" stroke-width="8" stroke-linejoin="round"/><path d="M166 538h23m52 0h-23m86-97h22m65 0h-22m-73 76h22m60 0h-22m130-12h22m33 65h-22m102-248h22m71 0h-22m-55 79h22m54 0h-22m-81 87h22m74 0h-22m74 72h22m31-36h-22" stroke="${c.pale}" stroke-width="13" stroke-linecap="round"/><path d="M104 767h720" stroke="${c.dark}" stroke-width="14" stroke-linecap="round"/><path d="M185 378c19-29 43-29 62 0m405-132c18-26 39-26 56 0" fill="none" stroke="${c.dark}" stroke-width="7" stroke-linecap="round" opacity=".45"/>`;
}

function vaseArt(c) {
  return `<ellipse cx="460" cy="706" rx="226" ry="39" fill="${c.dark}" opacity=".12"/><path d="M388 437c-4 56-20 101-61 168-23 39-6 91 44 105 56 15 128 15 184 0 50-14 67-66 44-105-41-67-57-112-61-168H388Z" fill="${c.mid}" stroke="${c.dark}" stroke-width="10"/><ellipse cx="462" cy="437" rx="74" ry="21" fill="${c.pale}" stroke="${c.dark}" stroke-width="9"/><path d="M462 430V236m0 143c-78-54-125-48-144-13 37 45 83 57 144 32Zm1-66c63-83 119-87 149-52-34 59-85 76-149 52Zm-1-129c-47-46-47-94-9-126 47 18 61 59 9 126Z" fill="${c.green}" stroke="${c.dark}" stroke-width="7" stroke-linejoin="round"/><circle cx="318" cy="361" r="23" fill="${c.accent}"/><circle cx="607" cy="325" r="21" fill="${c.accent}"/><circle cx="453" cy="247" r="22" fill="${c.accent}"/><path d="M412 524c30 15 68 15 99 0" fill="none" stroke="${c.pale}" stroke-width="8" stroke-linecap="round" opacity=".6"/>`;
}

function noodleArt(c) {
  return `<ellipse cx="456" cy="635" rx="289" ry="58" fill="${c.dark}" opacity=".12"/><path d="M195 453h525c-10 167-102 253-263 253S205 620 195 453Z" fill="${c.mid}" stroke="${c.dark}" stroke-width="10"/><ellipse cx="457" cy="451" rx="263" ry="94" fill="${c.pale}" stroke="${c.dark}" stroke-width="10"/><ellipse cx="457" cy="452" rx="211" ry="62" fill="#f2c783"/><path d="M317 440c25-74 73-75 96 0s71 74 95 0 71-75 96 0m-330 18c26 65 66 65 91 0m202 0c24 66 66 66 92 0" fill="none" stroke="${c.accent}" stroke-width="13" stroke-linecap="round"/><ellipse cx="395" cy="443" rx="27" ry="19" fill="${c.green}"/><ellipse cx="522" cy="462" rx="25" ry="16" fill="${c.green}"/><circle cx="453" cy="434" r="26" fill="${c.accent}"/><path d="m557 223 132 207m-178-180 131 207" stroke="${c.dark}" stroke-width="11" stroke-linecap="round"/><path d="M262 560h390" stroke="${c.pale}" stroke-width="8" opacity=".6"/>`;
}

function plansArt(c) {
  return `<g transform="rotate(-5 450 470)"><rect x="228" y="244" width="438" height="462" rx="21" fill="${c.pale}" stroke="${c.dark}" stroke-width="10"/><rect x="253" y="272" width="388" height="405" rx="8" fill="#fffaf3"/><path d="M289 350h316m-316 54h316m-316 54h316m-316 54h316m-316 54h252" stroke="${c.bg}" stroke-width="6"/><path d="M290 320h146" stroke="${c.accent}" stroke-width="14" stroke-linecap="round"/><path d="M291 381c26-30 47 28 76-1 26-27 40 17 63 0m-133 63c25 15 44-22 67-3 19 16 41 7 58-10" fill="none" stroke="${c.mid}" stroke-width="8" stroke-linecap="round"/><path d="M540 553c31-56 71-59 103-28-17 58-55 76-103 28Zm1 1c-14-66 9-103 52-106 24 43 9 78-52 106Z" fill="${c.green}" stroke="${c.dark}" stroke-width="6"/></g><path d="m703 291 48 330" stroke="${c.dark}" stroke-width="24" stroke-linecap="round"/><path d="m703 291 48 330" stroke="${c.accent}" stroke-width="12" stroke-linecap="round"/><path d="M726 626c3 26 9 44 21 63 13-21 16-41 8-67" fill="${c.dark}"/>`;
}

function rainyArt(c) {
  return `<path d="M225 431c0-126 99-224 231-224s229 98 229 224H225Z" fill="${c.mid}" stroke="${c.dark}" stroke-width="10"/><path d="M225 431c60 1 82-45 115-45 37 0 46 45 116 45 67 0 83-45 116-45s54 45 113 45" fill="${c.accent}" stroke="${c.dark}" stroke-width="9" stroke-linejoin="round"/><path d="M456 431v199c0 40 59 42 59 4" fill="none" stroke="${c.dark}" stroke-width="11" stroke-linecap="round"/><path d="M292 531c-9 28-10 56-2 83m99-64c-10 31-11 61-2 89m212-114c-8 29-7 58 2 84" stroke="${c.mid}" stroke-width="10" stroke-linecap="round"/><path d="M245 681c59-24 105-24 164 0s105 24 164 0 105-24 164 0" fill="none" stroke="${c.dark}" stroke-width="9" stroke-linecap="round" opacity=".4"/><path d="M660 301c28-20 56-20 84 0" fill="none" stroke="${c.pale}" stroke-width="8" stroke-linecap="round"/><circle cx="228" cy="326" r="13" fill="${c.pale}"/><circle cx="707" cy="526" r="11" fill="${c.pale}"/>`;
}

function bakeryArt(c) {
  return `<ellipse cx="453" cy="639" rx="258" ry="58" fill="${c.dark}" opacity=".11"/><ellipse cx="453" cy="546" rx="256" ry="115" fill="${c.pale}" stroke="${c.dark}" stroke-width="10"/><path d="M271 539c-8-95 34-162 108-166 40-2 66 22 74 59 22-49 65-68 106-48 61 31 81 105 49 186-41 64-286 62-337-31Z" fill="${c.mid}" stroke="${c.dark}" stroke-width="9"/><path d="M335 439c27 45 26 91 0 137m81-151c26 45 27 92 2 148m78-142c25 45 23 92-3 139m77-120c23 39 24 80 4 119" fill="none" stroke="${c.accent}" stroke-width="14" stroke-linecap="round"/><circle cx="292" cy="279" r="49" fill="${c.accent}" opacity=".74"/><circle cx="635" cy="340" r="32" fill="${c.green}"/><path d="M616 339c19-21 38-25 57-14" fill="none" stroke="${c.dark}" stroke-width="6" stroke-linecap="round"/><path d="M179 691h550" stroke="${c.dark}" stroke-width="8" stroke-linecap="round" opacity=".35"/>`;
}

function eveningArt(c) {
  return `<path d="M191 647h521v34H191z" fill="${c.dark}"/><path d="M245 681h413v32H245z" fill="${c.mid}"/><path d="M316 647V379h271v268" fill="${c.pale}" stroke="${c.dark}" stroke-width="9"/><path d="M350 410h202v99H350zm0 121h202v84H350z" fill="${c.bg}" stroke="${c.dark}" stroke-width="7"/><path d="M365 485h172m-172 113h172" stroke="${c.mid}" stroke-width="7"/><path d="M451 344c2-53 28-88 73-99v63l52 29" fill="${c.accent}" stroke="${c.dark}" stroke-width="8" stroke-linejoin="round"/><path d="M524 308h124l-26 45H550l-26-45Z" fill="${c.accent}" stroke="${c.dark}" stroke-width="8"/><path d="M585 352v36" stroke="${c.dark}" stroke-width="8"/><path d="M699 647V477m0 89c-55-52-95-44-110-12 25 39 64 49 110 25Zm0-23c41-61 83-63 105-34-23 44-57 58-105 40Z" fill="${c.green}" stroke="${c.dark}" stroke-width="7" stroke-linejoin="round"/><circle cx="674" cy="281" r="40" fill="${c.pale}"/><path d="M662 276c22-19 41-18 57 1m-51 20c15-11 30-10 43 2" fill="none" stroke="${c.accent}" stroke-width="6" stroke-linecap="round"/>`;
}

function fallbackArt(c) {
  return `<rect x="193" y="232" width="514" height="396" rx="38" fill="${c.pale}" stroke="${c.dark}" stroke-width="10" stroke-dasharray="15 17"/><circle cx="584" cy="315" r="51" fill="${c.accent}"/><path d="m252 568 119-133 91 96 70-72 112 109H252Z" fill="${c.green}" opacity=".82"/><path d="M352 679h196m-158 22h120" stroke="${c.mid}" stroke-width="10" stroke-linecap="round"/><circle cx="449" cy="426" r="20" fill="${c.mid}"/>`;
}

function svgFor({ id, scene, h, label, art }) {
  const c = palettes[scene];
  const bodyOffset = Math.max(-20, Math.round((h - 760) / 2));
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${h}" viewBox="0 0 900 ${h}" role="img" aria-labelledby="title desc">
  <title id="title">${label}</title>
  <desc id="desc">A locally stored vector illustration for the 小蓝书 inspiration feed.</desc>
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c.pale}"/><stop offset="1" stop-color="${c.bg}"/></linearGradient>
    <pattern id="grain" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1.2" fill="${c.dark}" opacity=".055"/><circle cx="19" cy="17" r=".9" fill="${c.dark}" opacity=".045"/></pattern>
  </defs>
  <rect width="900" height="${h}" fill="url(#paper)"/>
  <rect width="900" height="${h}" fill="url(#grain)"/>
  <circle cx="752" cy="160" r="130" fill="${c.accent}" opacity=".15"/>
  <circle cx="121" cy="${Math.round(h * 0.71)}" r="91" fill="${c.green}" opacity=".09"/>
  <path d="M0 ${Math.round(h * 0.81)}c160-58 271 26 430-5s284-76 470-1v${Math.round(h * 0.2)}H0V${Math.round(h * 0.81)}Z" fill="${c.pale}" opacity=".38"/>
  <text x="65" y="87" fill="${c.dark}" font-family="Avenir Next,Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="5" opacity=".77">${label}</text>
  <path d="M65 115h66" stroke="${c.accent}" stroke-width="6" stroke-linecap="round"/>
  <g transform="translate(0 ${bodyOffset})">${art(c)}</g>
  <text x="65" y="${h - 66}" fill="${c.dark}" font-family="Avenir Next,Arial,sans-serif" font-size="19" font-weight="600" letter-spacing="3" opacity=".65">A SMALL JOY TO KEEP</text>
  <circle cx="832" cy="${h - 73}" r="12" fill="${c.accent}" opacity=".8"/>
</svg>`;
}

await mkdir(outputDirectory, { recursive: true });
for (const artwork of artworks) {
  await writeFile(`${outputDirectory}${artwork.id}.svg`, svgFor(artwork), 'utf8');
}
console.log(`Generated ${artworks.length} local SVG illustrations in images/.`);
