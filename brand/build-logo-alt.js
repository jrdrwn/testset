// Alternatif logo @wanadiary.id (ikon 1080x1080, semua elemen di dalam lingkaran r≈430 agar aman untuk foto profil bulat).
// Pemakaian: node brand/build-logo-alt.js   (env CHROME dan PW sama seperti render.js)
// Output: brand/alternatif/<nama>.svg + .png, dan perbandingan.png (semua opsi berdampingan, termasuk logo lama).
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, 'alternatif');
fs.mkdirSync(DIR, { recursive: true });
const C = { dark: '#06070a', panel: '#12151d', light: '#f4f5f7', grey: '#8a90a0', red: '#ff2d4a', yellow: '#ffd60a' };
const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <rect width="1080" height="1080" rx="240" fill="${C.dark}"/>
  ${body}
</svg>
`;

const LOGOS = {
  // 1. Buku diary dengan pita pembatas merah: "diary" paling harfiah, ramah, mudah dikenali di ukuran kecil
  'diary-pita': svg(`
  <rect x="300" y="230" width="480" height="620" rx="56" fill="${C.light}"/>
  <rect x="300" y="230" width="86" height="620" rx="40" fill="${C.grey}"/>
  <rect x="350" y="230" width="36" height="620" fill="${C.grey}"/>
  <rect x="450" y="420" width="250" height="34" rx="17" fill="${C.dark}"/>
  <rect x="450" y="500" width="250" height="34" rx="17" fill="${C.dark}"/>
  <rect x="450" y="580" width="160" height="34" rx="17" fill="${C.dark}"/>
  <path d="M610 230 H690 V400 L650 365 L610 400 Z" fill="${C.red}"/>`),

  // 2. Gelembung curhat dengan tanda seru: "keresahan" = curhatan; titik tanda seru berwarna merah
  'curhat-seru': svg(`
  <path d="M370 270 H710 A140 140 0 0 1 850 410 V600 A140 140 0 0 1 710 740 H470 L330 840 L360 728 A140 140 0 0 1 230 600 V410 A140 140 0 0 1 370 270 Z" fill="${C.light}"/>
  <line x1="540" y1="380" x2="540" y2="545" stroke="${C.dark}" stroke-width="92" stroke-linecap="round"/>
  <circle cx="540" cy="645" r="50" fill="${C.red}"/>`),

  // 3. Monogram "wd" dengan garis bawah kuning: seperti kata yang di-highlight di caption video
  'monogram-wd': svg(`
  <g transform="translate(0,-35)">
  <polyline points="215,445 300,655 385,505 470,655 555,445" fill="none" stroke="${C.light}" stroke-width="88" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="725" cy="560" r="100" fill="none" stroke="${C.light}" stroke-width="88"/>
  <line x1="825" y1="320" x2="825" y2="655" stroke="${C.light}" stroke-width="88" stroke-linecap="round"/>
  </g>
  <rect x="215" y="790" width="610" height="34" rx="17" fill="${C.yellow}"/>`),

  // 4. Setengah lingkaran "sisi gelap": separuh terang, separuh menyatu dengan latar; cocok untuk seri "Sisi Gelap ___"
  'sisi-gelap': svg(`
  <circle cx="540" cy="540" r="330" fill="none" stroke="${C.light}" stroke-width="22"/>
  <path d="M540 210 A330 330 0 0 0 540 870 Z" fill="${C.light}"/>
  <circle cx="800" cy="290" r="58" fill="${C.red}"/>`),

  // 5. Halaman bergaris dengan coretan "w": catatan harian yang ditulis tangan
  'halaman-w': svg(`
  <rect x="260" y="250" width="560" height="600" rx="48" fill="${C.light}"/>
  <line x1="330" y1="380" x2="750" y2="380" stroke="${C.grey}" stroke-width="10" stroke-opacity="0.45"/>
  <line x1="330" y1="740" x2="750" y2="740" stroke="${C.grey}" stroke-width="10" stroke-opacity="0.45"/>
  <line x1="350" y1="300" x2="350" y2="800" stroke="${C.red}" stroke-width="10"/>
  <polyline points="405,470 470,640 540,520 610,640 675,470" fill="none" stroke="${C.dark}" stroke-width="64" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="725" cy="420" r="34" fill="${C.red}"/>`),
};

for (const [n, s] of Object.entries(LOGOS)) fs.writeFileSync(path.join(DIR, n + '.svg'), s);
console.log('svg:', Object.keys(LOGOS).join(', '));

(async () => {
  const { chromium } = require(process.env.PW || 'playwright-core');
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/inner_container/opt/playwright/chromium-1232/chrome-linux64/chrome', chromiumSandbox: false, args: ['--disable-crash-reporter', '--disable-breakpad', '--no-zygote', '--disable-dev-shm-usage'] });
  const page = await b.newPage();
  await page.setViewportSize({ width: 1080, height: 1080 });
  for (const n of Object.keys(LOGOS)) {
    await page.goto('file://' + path.join(DIR, n + '.svg'));
    await page.screenshot({ path: path.join(DIR, n + '.png'), omitBackground: true });
    console.log('png:', n);
  }
  // perbandingan: tiap opsi sebagai kotak, bulat (foto profil), dan kecil 110 px (ukuran tampil di IG)
  const font = 'file://' + path.join(__dirname, '..', 'forex-dark-side', 'fonts', 'NotoSans-VF.ttf');
  const opts = [['0 · w-titik (logo lama)', path.join(DIR, 'w-titik.svg')], ...Object.keys(LOGOS).map((n, i) => [`${i + 1} · ${n}${n === 'monogram-wd' ? ' (dipakai)' : ''}`, path.join(DIR, n + '.svg')])];
  const cell = ([label, f]) => `<div class="c"><div class="row"><img class="sq" src="file://${f}"><img class="ci" src="file://${f}"><img class="sm" src="file://${f}"></div><p>${label}</p></div>`;
  await page.setViewportSize({ width: 1800, height: 1500 });
  const sheet = path.join(DIR, '_sheet.html');
  fs.writeFileSync(sheet, '<!doctype html><html></html>');
  await page.goto('file://' + sheet); // setContent butuh dokumen HTML (halaman sebelumnya SVG)
  await page.setContent(`<html><head><style>
    @font-face{font-family:NS;src:url(${font});font-weight:100 900}
    body{margin:0;background:#e9e7e2;font:700 30px NS;color:#14151a;display:grid;grid-template-columns:repeat(2,1fr);gap:24px;padding:40px}
    .c{background:#fff;border-radius:24px;padding:24px}.row{display:flex;align-items:center;gap:28px}
    .sq{width:300px;height:300px}.ci{width:220px;height:220px;border-radius:50%;object-fit:cover}.sm{width:110px;height:110px;border-radius:50%}
    p{margin:14px 0 0}</style></head><body>${opts.map(cell).join('')}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(DIR, 'perbandingan.png'), fullPage: true });
  fs.unlinkSync(sheet);
  console.log('png: perbandingan');
  await b.close();
})();
