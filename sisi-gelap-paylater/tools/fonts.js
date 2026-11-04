// Unduh font untuk style aktif ke fonts/HEAD.ttf dan fonts/BODY.ttf (sumber: github.com/google/fonts, lisensi OFL).
const fs = require('fs'), path = require('path');
global.window = {}; require('../config.js');
const BASE = 'https://github.com/google/fonts/raw/main/ofl/';
const URLS = {
  NotoSans: 'notosans/NotoSans%5Bwdth,wght%5D.ttf',
  Montserrat: 'montserrat/Montserrat%5Bwght%5D.ttf',
  JetBrainsMono: 'jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf',
  PlayfairDisplay: 'playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf',
  'Poppins-Black': 'poppins/Poppins-Black.ttf',
  'Poppins-Bold': 'poppins/Poppins-Bold.ttf',
  Anton: 'anton/Anton-Regular.ttf',
  BebasNeue: 'bebasneue/BebasNeue-Regular.ttf',
};
(async () => {
  const S = window.STYLES[window.STYLE_ID], dir = path.join(__dirname, '..', 'fonts');
  fs.mkdirSync(dir, { recursive: true });
  for (const [slot, name] of [['HEAD', S.fonts.head], ['BODY', S.fonts.body]]) {
    if (!URLS[name]) throw new Error('font tidak ada di daftar: ' + name);
    const r = await fetch(BASE + URLS[name]); if (!r.ok) throw new Error(`${name}: HTTP ${r.status}`);
    const b = Buffer.from(await r.arrayBuffer()); fs.writeFileSync(path.join(dir, slot + '.ttf'), b);
    console.log(`${slot}.ttf <- ${name} (${b.length} bytes)`);
  }
})().catch(e => { console.error(e.message); process.exit(1); });
