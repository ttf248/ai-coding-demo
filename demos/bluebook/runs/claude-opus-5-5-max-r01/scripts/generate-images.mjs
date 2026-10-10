// Generates the mock illustration set used by the feed (public/images/*.svg).
// Run with `npm run images`; output is committed so builds do not depend on this script.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');
fs.mkdirSync(outDir, { recursive: true });

const rng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const f = (n) => Math.round(n * 10) / 10;
const grad = (id, stops, vertical = true) => `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">${stops.map((c, i) => `<stop offset="${f(i / (stops.length - 1))}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const ridge = (r, W, base, amp, steps, H) => {
  let d = `M0 ${H} L0 ${f(base)}`;
  for (let i = 1; i <= steps; i++) {
    const x = (W * i) / steps;
    const y = base - amp * (0.35 + 0.65 * r()) * (i % 2 ? 1 : 0.45);
    d += ` L${f(x - W / steps / 2)} ${f(y)} L${f(x)} ${f(base - amp * 0.2 * r())}`;
  }
  return d + ` L${W} ${H} Z`;
};

const scenes = {
  mountain(W, H, p, r) {
    const birds = Array.from({ length: 4 }, () => { const x = 80 + r() * 400, y = H * (0.12 + r() * 0.15), s = 8 + r() * 8; return `<path d="M${f(x - s)} ${f(y)} q${f(s / 2)} ${f(-s / 2)} ${f(s)} 0 q${f(s / 2)} ${f(-s / 2)} ${f(s)} 0" fill="none" stroke="${p.ink}" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>`; }).join('');
    return `<defs>${grad('s', p.sky)}${grad('l', [p.m3, p.sky[0]])}</defs><rect width="${W}" height="${H}" fill="url(#s)"/>
<circle cx="${f(W * (0.3 + r() * 0.4))}" cy="${f(H * 0.36)}" r="${f(W * 0.12)}" fill="${p.sun}" opacity=".95"/>${birds}
<path d="${ridge(r, W, H * 0.55, H * 0.2, 5, H)}" fill="${p.m1}"/><path d="${ridge(r, W, H * 0.66, H * 0.16, 7, H)}" fill="${p.m2}"/>
<path d="${ridge(r, W, H * 0.78, H * 0.1, 9, H)}" fill="${p.m3}"/><rect y="${f(H * 0.86)}" width="${W}" height="${f(H * 0.14)}" fill="url(#l)" opacity=".85"/>
${Array.from({ length: 5 }, (_, i) => `<rect x="${f(60 + r() * 420)}" y="${f(H * 0.88 + i * H * 0.022)}" width="${f(40 + r() * 80)}" height="2" rx="1" fill="#fff" opacity=".45"/>`).join('')}`;
  },
  sea(W, H, p, r) {
    const hz = H * 0.5;
    const waves = Array.from({ length: 6 }, (_, i) => { const y = hz + 18 + i * (H * 0.045); return `<path d="M0 ${f(y)} q75 -10 150 0 t150 0 t150 0 t150 0" fill="none" stroke="#fff" stroke-width="2" opacity="${f(0.5 - i * 0.06)}"/>`; }).join('');
    const tx = W * 0.78;
    return `<defs>${grad('s', p.sky)}${grad('w', p.sea)}</defs><rect width="${W}" height="${H}" fill="url(#s)"/>
<circle cx="${f(W * 0.32)}" cy="${f(hz - 10)}" r="${f(W * 0.1)}" fill="${p.sun}"/><rect y="${f(hz)}" width="${W}" height="${f(H - hz)}" fill="url(#w)"/>${waves}
<path d="M0 ${f(H * 0.84)} Q${f(W * 0.5)} ${f(H * 0.76)} ${W} ${f(H * 0.82)} L${W} ${H} L0 ${H} Z" fill="${p.sand}"/>
<path d="M${f(tx)} ${f(H * 0.86)} Q${f(tx - 10)} ${f(H * 0.6)} ${f(tx - 40)} ${f(H * 0.42)}" fill="none" stroke="${p.palm}" stroke-width="12" stroke-linecap="round"/>
${[[-120, -10], [-90, 50], [10, 40], [40, -20], [-30, -60]].map(([dx, dy]) => `<path d="M${f(tx - 40)} ${f(H * 0.42)} q${f(dx * 0.4)} ${f(dy * 0.2 - 40)} ${dx} ${dy}" fill="none" stroke="${p.palm}" stroke-width="10" stroke-linecap="round"/>`).join('')}`;
  },
  coffee(W, H, p, r) {
    const cx = W / 2, cy = H * 0.48;
    const beans = Array.from({ length: 9 }, () => { const x = 40 + r() * (W - 80), y = r() < 0.5 ? H * (0.08 + r() * 0.12) : H * (0.82 + r() * 0.12), a = f(r() * 180); return `<g transform="translate(${f(x)} ${f(y)}) rotate(${a})"><ellipse rx="13" ry="9" fill="#6b4226"/><path d="M-10 0 q10 -5 20 0" stroke="#3b2414" stroke-width="2" fill="none"/></g>`; }).join('');
    const stripes = Array.from({ length: 7 }, (_, i) => `<rect y="${f((H / 7) * i)}" width="${W}" height="2" fill="${p.ink}" opacity=".08"/>`).join('');
    return `<rect width="${W}" height="${H}" fill="${p.bg}"/>${stripes}<circle cx="${f(cx + 16)}" cy="${f(cy + 18)}" r="170" fill="${p.ink}" opacity=".12"/>
<circle cx="${cx}" cy="${f(cy)}" r="165" fill="${p.plate}"/><circle cx="${cx}" cy="${f(cy)}" r="118" fill="${p.cup}"/>
<path d="M${f(cx + 112)} ${f(cy - 20)} q60 0 60 30 t-60 30" fill="none" stroke="${p.cup}" stroke-width="18"/>
<circle cx="${cx}" cy="${f(cy)}" r="96" fill="${p.coffee}"/>
<path d="M${cx} ${f(cy + 52)} C${f(cx - 70)} ${f(cy + 5)} ${f(cx - 52)} ${f(cy - 58)} ${cx} ${f(cy - 22)} C${f(cx + 52)} ${f(cy - 58)} ${f(cx + 70)} ${f(cy + 5)} ${cx} ${f(cy + 52)} Z" fill="${p.foam}"/>
<path d="M${cx} ${f(cy + 40)} L${cx} ${f(cy - 8)}" stroke="${p.coffee}" stroke-width="4" opacity=".5"/>${beans}`;
  },
  plant(W, H, p, r) {
    const px = W / 2, py = H * 0.7;
    const leaves = Array.from({ length: 9 }, (_, i) => {
      const a = -150 + i * 15 + r() * 10, len = H * (0.2 + r() * 0.16), rad = (a * Math.PI) / 180;
      const ex = px + Math.cos(rad) * len, ey = py - 10 + Math.sin(rad) * len;
      return `<path d="M${px} ${f(py - 10)} Q${f(px + Math.cos(rad) * len * 0.4)} ${f(py + Math.sin(rad) * len * 0.5)} ${f(ex)} ${f(ey)}" stroke="${p.stem}" stroke-width="4" fill="none"/>
<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="${f(26 + r() * 14)}" ry="${f(46 + r() * 20)}" transform="rotate(${f(a + 90)} ${f(ex)} ${f(ey)})" fill="${i % 2 ? p.leaf1 : p.leaf2}"/>`;
    }).join('');
    return `<defs>${grad('s', p.wall)}</defs><rect width="${W}" height="${H}" fill="url(#s)"/>
<rect x="${f(W * 0.08)}" y="${f(H * 0.08)}" width="${f(W * 0.38)}" height="${f(H * 0.3)}" rx="8" fill="#fff" opacity=".55"/><path d="M${f(W * 0.27)} ${f(H * 0.08)} V${f(H * 0.38)} M${f(W * 0.08)} ${f(H * 0.23)} H${f(W * 0.46)}" stroke="${p.wall[1]}" stroke-width="6"/>
${leaves}<rect y="${f(H * 0.86)}" width="${W}" height="${f(H * 0.14)}" fill="${p.shelf}"/>
<path d="M${f(px - 85)} ${f(py)} L${f(px + 85)} ${f(py)} L${f(px + 62)} ${f(H * 0.88)} L${f(px - 62)} ${f(H * 0.88)} Z" fill="${p.pot}"/><rect x="${f(px - 92)}" y="${f(py - 12)}" width="184" height="24" rx="8" fill="${p.potRim}"/>`;
  },
  city(W, H, p, r) {
    const stars = Array.from({ length: 40 }, () => `<circle cx="${f(r() * W)}" cy="${f(r() * H * 0.45)}" r="${f(0.8 + r() * 1.6)}" fill="#fff" opacity="${f(0.3 + r() * 0.6)}"/>`).join('');
    let x = 0, b = '';
    while (x < W) {
      const w = 50 + r() * 60, h = H * (0.25 + r() * 0.35), y = H * 0.82 - h;
      b += `<rect x="${f(x)}" y="${f(y)}" width="${f(w - 4)}" height="${f(h)}" fill="${p.bld[Math.floor(r() * p.bld.length)]}"/>`;
      for (let wy = y + 12; wy < H * 0.8 - 10; wy += 18) for (let wx = x + 8; wx < x + w - 14; wx += 14) if (r() < 0.42) b += `<rect x="${f(wx)}" y="${f(wy)}" width="7" height="9" fill="${p.win}" opacity="${f(0.55 + r() * 0.45)}"/>`;
      x += w;
    }
    return `<defs>${grad('s', p.sky)}${grad('w', [p.bld[0], p.sky[0]])}</defs><rect width="${W}" height="${H}" fill="url(#s)"/>${stars}
<circle cx="${f(W * 0.76)}" cy="${f(H * 0.16)}" r="34" fill="${p.moon}"/><circle cx="${f(W * 0.76 + 14)}" cy="${f(H * 0.16 - 8)}" r="30" fill="${p.sky[0]}" opacity="${p.crescent}"/>
${b}<rect y="${f(H * 0.82)}" width="${W}" height="${f(H * 0.18)}" fill="url(#w)"/>
${Array.from({ length: 10 }, () => `<rect x="${f(r() * W)}" y="${f(H * (0.84 + r() * 0.14))}" width="${f(20 + r() * 50)}" height="3" rx="1.5" fill="${p.win}" opacity=".35"/>`).join('')}`;
  },
  dessert(W, H, p, r) {
    const cx = W / 2, cy = H * 0.6;
    const sprinkles = Array.from({ length: 26 }, () => { const x = f(r() * W), y = f(r() * H); return `<rect x="${x}" y="${y}" width="12" height="4" rx="2" fill="${p.spr[Math.floor(r() * p.spr.length)]}" transform="rotate(${f(r() * 180)} ${x} ${y})" opacity=".8"/>`; }).join('');
    const layers = [0, 1, 2].map((i) => `<rect x="${f(cx - 150)}" y="${f(cy - 120 + i * 62)}" width="300" height="${i === 2 ? 70 : 40}" fill="${i % 2 ? p.cream : p.sponge}"/>`).join('');
    const berries = [-95, -30, 35, 100].map((dx) => `<g transform="translate(${f(cx + dx)} ${f(cy - 140)})"><path d="M-20 -6 Q0 40 20 -6 Q0 -18 -20 -6 Z" fill="#e8364f"/><path d="M-10 -12 L0 -4 L10 -12 L4 -16 L0 -10 L-4 -16 Z" fill="#3fa34d"/></g>`).join('');
    return `<rect width="${W}" height="${H}" fill="${p.bg}"/>${sprinkles}<ellipse cx="${cx}" cy="${f(cy + 92)}" rx="230" ry="52" fill="#fff"/><ellipse cx="${cx}" cy="${f(cy + 92)}" rx="190" ry="38" fill="${p.plate}"/>
${layers}<path d="M${f(cx - 158)} ${f(cy - 120)} q20 -30 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 v12 h-316 Z" fill="${p.cream}"/>${berries}`;
  },
  flowers(W, H, p, r) {
    const vx = W / 2, vy = H * 0.66;
    const stems = Array.from({ length: 7 }, (_, i) => {
      const ex = vx - 150 + i * 50 + (r() - 0.5) * 30, ey = H * (0.16 + r() * 0.22), c = p.petals[i % p.petals.length];
      return `<path d="M${vx} ${f(vy)} Q${f((vx + ex) / 2 + (r() - 0.5) * 60)} ${f((vy + ey) / 2)} ${f(ex)} ${f(ey + 30)}" stroke="#4f9a5c" stroke-width="5" fill="none"/>
<path d="M${f(ex - 26)} ${f(ey)} Q${f(ex - 30)} ${f(ey + 44)} ${f(ex)} ${f(ey + 46)} Q${f(ex + 30)} ${f(ey + 44)} ${f(ex + 26)} ${f(ey)} L${f(ex + 13)} ${f(ey + 14)} L${f(ex)} ${f(ey - 4)} L${f(ex - 13)} ${f(ey + 14)} Z" fill="${c}"/>`;
    }).join('');
    return `<defs>${grad('s', p.bg)}</defs><rect width="${W}" height="${H}" fill="url(#s)"/><circle cx="${f(W * 0.82)}" cy="${f(H * 0.14)}" r="70" fill="#fff" opacity=".35"/>
${stems}<path d="M${f(vx - 60)} ${f(vy - 10)} L${f(vx + 60)} ${f(vy - 10)} L${f(vx + 85)} ${f(H * 0.92)} L${f(vx - 85)} ${f(H * 0.92)} Z" fill="${p.vase}" opacity=".92"/>
<rect x="${f(vx - 66)}" y="${f(vy - 22)}" width="132" height="16" rx="6" fill="${p.vase}"/><rect y="${f(H * 0.92)}" width="${W}" height="${f(H * 0.08)}" fill="${p.table}"/>`;
  },
  cat(W, H, p, r) {
    const cx = W / 2, cy = H * 0.52;
    return `<rect width="${W}" height="${H}" fill="${p.bg}"/><circle cx="${f(W * 0.15)}" cy="${f(H * 0.85)}" r="46" fill="${p.yarn}"/>
<path d="M${f(W * 0.15 - 40)} ${f(H * 0.85 - 10)} q40 -30 80 0 M${f(W * 0.15 - 44)} ${f(H * 0.85 + 8)} q44 -26 88 0" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>
<path d="M${f(W * 0.15 + 40)} ${f(H * 0.85)} q80 20 140 -30" stroke="${p.yarn}" stroke-width="3" fill="none"/>
<ellipse cx="${cx}" cy="${f(cy + 150)}" rx="170" ry="120" fill="${p.fur}"/>
<path d="M${f(cx - 130)} ${f(cy - 40)} L${f(cx - 110)} ${f(cy - 170)} L${f(cx - 40)} ${f(cy - 100)} Z M${f(cx + 130)} ${f(cy - 40)} L${f(cx + 110)} ${f(cy - 170)} L${f(cx + 40)} ${f(cy - 100)} Z" fill="${p.fur}"/>
<path d="M${f(cx - 112)} ${f(cy - 70)} L${f(cx - 104)} ${f(cy - 140)} L${f(cx - 62)} ${f(cy - 100)} Z M${f(cx + 112)} ${f(cy - 70)} L${f(cx + 104)} ${f(cy - 140)} L${f(cx + 62)} ${f(cy - 100)} Z" fill="${p.ear}"/>
<ellipse cx="${cx}" cy="${f(cy)}" rx="150" ry="125" fill="${p.fur}"/>${p.patch ? `<path d="M${f(cx - 150)} ${f(cy)} Q${f(cx - 120)} ${f(cy - 110)} ${f(cx - 20)} ${f(cy - 120)} Q${f(cx - 50)} ${f(cy - 30)} ${f(cx - 150)} ${f(cy)} Z" fill="${p.patch}"/>` : ''}
<ellipse cx="${f(cx - 55)}" cy="${f(cy - 5)}" rx="20" ry="26" fill="#2b2b2b"/><ellipse cx="${f(cx + 55)}" cy="${f(cy - 5)}" rx="20" ry="26" fill="#2b2b2b"/>
<circle cx="${f(cx - 48)}" cy="${f(cy - 14)}" r="7" fill="#fff"/><circle cx="${f(cx + 62)}" cy="${f(cy - 14)}" r="7" fill="#fff"/>
<path d="M${f(cx - 12)} ${f(cy + 30)} L${f(cx + 12)} ${f(cy + 30)} L${cx} ${f(cy + 44)} Z" fill="#ff8fa3"/><path d="M${cx} ${f(cy + 44)} q-14 18 -30 8 M${cx} ${f(cy + 44)} q14 18 30 8" stroke="#2b2b2b" stroke-width="3" fill="none" stroke-linecap="round"/>
${[-1, 1].map((s) => [0, 1, 2].map((k) => `<path d="M${f(cx + s * 70)} ${f(cy + 36 + k * 10)} l${s * 80} ${(k - 1) * 14}" stroke="#2b2b2b" stroke-width="2" opacity=".5"/>`).join('')).join('')}
<ellipse cx="${f(cx - 95)}" cy="${f(cy + 40)}" rx="20" ry="11" fill="#ff8fa3" opacity=".45"/><ellipse cx="${f(cx + 95)}" cy="${f(cy + 40)}" rx="20" ry="11" fill="#ff8fa3" opacity=".45"/>`;
  },
};

const variants = [
  ['mountain', 'dawn', 760, { sky: ['#ffcf9f', '#ffe8d1'], sun: '#fff4e0', m1: '#b9a3c9', m2: '#8d7bb0', m3: '#5f5a8f', ink: '#5f5a8f' }],
  ['mountain', 'lake', 600, { sky: ['#8ccff7', '#e3f5ff'], sun: '#ffffff', m1: '#9fc5d9', m2: '#5f9bb5', m3: '#2f6f8a', ink: '#2f6f8a' }],
  ['mountain', 'dusk', 900, { sky: ['#3d2c6e', '#f3a683'], sun: '#ffd8a8', m1: '#6a4c93', m2: '#4b3a75', m3: '#2b2350', ink: '#1d1838' }],
  ['sea', 'tropic', 800, { sky: ['#7fd3f7', '#dff6ff'], sun: '#fffbe0', sea: ['#28b8cc', '#0b6e99'], sand: '#f4dfb2', palm: '#2f5d50' }],
  ['sea', 'sunset', 680, { sky: ['#ff8f70', '#ffd3a5'], sun: '#fff1c9', sea: ['#5a77b8', '#2b3a67'], sand: '#e9c79c', palm: '#3b2f4a' }],
  ['sea', 'mint', 450, { sky: ['#bff2e4', '#f2fffb'], sun: '#ffffff', sea: ['#58d0c0', '#1f8f8a'], sand: '#fbe9c8', palm: '#2c6e5a' }],
  ['coffee', 'oak', 750, { bg: '#d9b38c', ink: '#5a3b22', plate: '#f7f2ec', cup: '#ffffff', coffee: '#8a5a36', foam: '#f3e2cc' }],
  ['coffee', 'slate', 600, { bg: '#4a5560', ink: '#11161b', plate: '#e9edf1', cup: '#f6f7f8', coffee: '#7b4a2a', foam: '#f1dcc0' }],
  ['coffee', 'rose', 820, { bg: '#f3c6c6', ink: '#8c4a54', plate: '#ffffff', cup: '#fff7f4', coffee: '#9a6141', foam: '#fbe8d6' }],
  ['plant', 'sage', 880, { wall: ['#e8efe1', '#cfdcc4'], stem: '#3e6b48', leaf1: '#3f8f5a', leaf2: '#5bb075', shelf: '#b88b62', pot: '#e07a5f', potRim: '#c9644b' }],
  ['plant', 'cream', 640, { wall: ['#fbf3e4', '#efe0c4'], stem: '#386641', leaf1: '#6a994e', leaf2: '#a7c957', shelf: '#8d6346', pot: '#f2e8cf', potRim: '#d8c9a3' }],
  ['plant', 'blue', 760, { wall: ['#dbe9f6', '#b9d2ea'], stem: '#2d6a4f', leaf1: '#40916c', leaf2: '#74c69d', shelf: '#7d5a44', pot: '#355070', potRim: '#28405a' }],
  ['city', 'night', 840, { sky: ['#0f1530', '#3a3f7a'], moon: '#fff4d6', crescent: 0.9, bld: ['#1a1f3c', '#232a4f', '#2c3460'], win: '#ffd66b' }],
  ['city', 'neon', 620, { sky: ['#1b0f2e', '#7b2f73'], moon: '#ffd1f2', crescent: 0, bld: ['#2a1640', '#341b52', '#24113a'], win: '#ff7ad9' }],
  ['city', 'blue', 980, { sky: ['#14274e', '#9bb5d8'], moon: '#ffffff', crescent: 0.6, bld: ['#1c2e52', '#24406b', '#30507f'], win: '#a8e1ff' }],
  ['dessert', 'berry', 700, { bg: '#ffe3ea', plate: '#ffd0dc', sponge: '#f7d79c', cream: '#fff8f0', spr: ['#ff6b8b', '#7ad3f5', '#ffd166'] }],
  ['dessert', 'matcha', 820, { bg: '#e6f2dd', plate: '#d3e8c4', sponge: '#a7c97a', cream: '#fbfff5', spr: ['#7fb069', '#e6aace', '#f4d35e'] }],
  ['dessert', 'choco', 600, { bg: '#f1e4d8', plate: '#e4cdb7', sponge: '#6b3e26', cream: '#fff3e6', spr: ['#e76f51', '#2a9d8f', '#e9c46a'] }],
  ['flowers', 'tulip', 860, { bg: ['#fde2e4', '#fad2e1'], petals: ['#ff6b81', '#ffb3c1', '#ff8fab', '#f25c78'], vase: '#7ec4cf', table: '#e3c9b4' }],
  ['flowers', 'sun', 700, { bg: ['#fff3c4', '#ffe29a'], petals: ['#ff9f1c', '#ffbf69', '#f4a261', '#e76f51'], vase: '#2a9d8f', table: '#d4a373' }],
  ['flowers', 'lilac', 780, { bg: ['#ece4ff', '#d9ccff'], petals: ['#9d79d6', '#c3a6ff', '#7b5cc4', '#e0c3fc'], vase: '#f2f2f2', table: '#b8a6d9' }],
  ['cat', 'ginger', 720, { bg: '#ffe8cc', fur: '#f4a259', ear: '#ffb5a7', patch: '#e07a3f', yarn: '#5a9bd4' }],
  ['cat', 'gray', 840, { bg: '#e3eef7', fur: '#9aa5b1', ear: '#f7c6cf', patch: '#7b8794', yarn: '#ef6f6c' }],
  ['cat', 'snow', 640, { bg: '#fef6f0', fur: '#ffffff', ear: '#ffc9d6', patch: null, yarn: '#8bc34a' }],
];

const list = [];
variants.forEach(([scene, name, H, palette], i) => {
  const W = 600, file = `${String(i + 1).padStart(2, '0')}-${scene}-${name}.svg`;
  const body = scenes[scene](W, H, palette, rng(1000 + i * 97));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body.replace(/\n/g, '')}</svg>\n`;
  fs.writeFileSync(path.join(outDir, file), svg);
  list.push({ file, w: W, h: H, scene });
});

fs.writeFileSync(path.join(outDir, 'fallback.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="#f0f0f2"/><g fill="none" stroke="#c4c4cc" stroke-width="14" stroke-linejoin="round" stroke-linecap="round"><rect x="190" y="200" width="220" height="170" rx="18"/><path d="M200 350 L270 280 L320 330 L350 300 L400 350"/><circle cx="350" cy="250" r="16"/></g><text x="300" y="440" text-anchor="middle" font-family="system-ui, sans-serif" font-size="34" fill="#a0a0aa">图片加载失败</text></svg>\n`);
console.log(JSON.stringify(list));
