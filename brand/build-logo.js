// Membuat logo @wanadiary.id (SVG) dan export PNG lewat Chromium.
// Pemakaian: node brand/build-logo.js   (env CHROME dan PW sama seperti render.js)
// Konsep: monogram "wd" geometris (garis tebal, ujung bulat) + garis bawah kuning,
// seperti kata yang di-highlight di caption video. Logo lama ("w" + titik merah) ada di alternatif/w-titik.svg.
const fs = require('fs'), path = require('path');
const DIR = __dirname;
const FONT = fs.readFileSync(path.join(DIR, 'wordmark-font.woff2')).toString('base64'); // subset Noto Sans (OFL)

const C = { dark: '#06070a', light: '#f4f5f7', red: '#ff2d4a', yellow: '#ffd60a', yellowDeep: '#e6b800' };

// monogram "wd" di kanvas 1080; semua elemen di dalam lingkaran r≈410 agar aman untuk foto profil bulat
// jarak huruf ke garis bawah dijaga ≥ 90 px: kalau terlalu dekat, di ukuran kecil "wd" terbaca seperti "PM"
function mark(fg, hl) {
  return `<g transform="translate(0,-35)">
  <polyline points="215,445 300,655 385,505 470,655 555,445" fill="none" stroke="${fg}" stroke-width="88" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="725" cy="560" r="100" fill="none" stroke="${fg}" stroke-width="88"/>
  <line x1="825" y1="320" x2="825" y2="655" stroke="${fg}" stroke-width="88" stroke-linecap="round"/>
  </g>
  <rect x="215" y="790" width="610" height="34" rx="17" fill="${hl}"/>`;
}
function icon(bg, fg, dot, round = false) {
  const shape = round ? `<circle cx="540" cy="540" r="540" fill="${bg}"/>` : `<rect width="1080" height="1080" rx="240" fill="${bg}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  ${shape}
  ${mark(fg, dot)}
</svg>
`;
}
// wordmark horizontal: ikon kecil + "wanadiary"
function wordmark(bg, fg, dot, sub, subColor = dot) {
  const s = 0.32; // skala ikon (1080 -> ~346)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 480" width="1600" height="480">
  <defs><style>@font-face{font-family:WD;src:url(data:font/woff2;base64,${FONT}) format('woff2');font-weight:100 900;}</style></defs>
  <rect width="1600" height="480" fill="${bg}"/>
  <g transform="translate(70,67) scale(${s})"><rect width="1080" height="1080" rx="240" fill="${fg}"/>${mark(bg, dot)}</g>
  <text x="480" y="${sub ? 262 : 292}" font-family="WD" font-weight="800" font-size="150" letter-spacing="-2" fill="${fg}">wanadiary</text>
  ${sub ? `<text x="486" y="352" font-family="WD" font-weight="600" font-size="52" letter-spacing="10" fill="${subColor}">@WANADIARY.ID</text>` : ''}
</svg>
`;
}

// di latar terang, kuning digelapkan sedikit supaya garis bawah tetap terlihat
const files = {
  'logo-dark.svg': icon(C.dark, C.light, C.yellow),
  'logo-light.svg': icon(C.light, C.dark, C.yellowDeep),
  'logo-profile.svg': icon(C.dark, C.light, C.yellow, true),
  'wordmark-dark.svg': wordmark(C.dark, C.light, C.yellow, true),
  'wordmark-light.svg': wordmark(C.light, C.dark, C.yellowDeep, true, C.dark), // teks kuning kurang kontras di latar terang
};
for (const [f, s] of Object.entries(files)) fs.writeFileSync(path.join(DIR, f), s);
console.log('svg:', Object.keys(files).join(', '));

(async () => {
  const { chromium } = require(process.env.PW || 'playwright-core');
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/inner_container/opt/playwright/chromium-1232/chrome-linux64/chrome', chromiumSandbox: false, args: ['--disable-crash-reporter', '--disable-breakpad', '--no-zygote', '--disable-dev-shm-usage'] });
  const page = await b.newPage();
  const jobs = [['logo-dark.svg', 1080, 1080], ['logo-light.svg', 1080, 1080], ['logo-profile.svg', 1080, 1080], ['wordmark-dark.svg', 1600, 480], ['wordmark-light.svg', 1600, 480]];
  for (const [f, w, h] of jobs) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('file://' + path.join(DIR, f));
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(150);
    const png = path.join(DIR, f.replace('.svg', '.png'));
    await page.screenshot({ path: png, omitBackground: f.startsWith('logo-') }); // sudut ikon transparan
    console.log('png:', path.basename(png));
  }
  await b.close();
})();
