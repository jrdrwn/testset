// Usage: node render.js stills 0.3,1.6,...   |   node render.js mp4
const path = require('path'), fs = require('fs');
const { chromium } = require(process.env.PW || 'playwright-core');
const CHROME = process.env.CHROME || '/inner_container/opt/playwright/chromium-1232/chrome-linux64/chrome';
(async () => {
  const [mode, arg] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: CHROME, chromiumSandbox: false, args: ['--disable-crash-reporter', '--disable-breakpad', '--no-zygote', '--disable-dev-shm-usage'] });
  const page = await b.newPage();
  page.on('console', m => console.log('[page]', m.text()));
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.evaluate(() => document.fonts.load('900 40px NS'));
  const out = path.join(__dirname, mode === 'mp4' ? 'out' : 'previews');
  if (mode === 'stills') {
    for (const t of arg.split(',').map(Number)) {
      const data = await page.evaluate(t => { const c = document.getElementById('c'); COMP.render(c.getContext('2d'), t); return c.toDataURL('image/jpeg', 0.8); }, t);
      const f = path.join(out, `t${t.toFixed(2).padStart(5, '0')}.jpg`);
      fs.writeFileSync(f, Buffer.from(data.split(',')[1], 'base64')); console.log(f);
    }
  } else {
    await page.exposeFunction('nodeLog', m => console.log(m));
    if (process.env.BITRATE) await page.evaluate(b => (window.EXPORT_BITRATE = b), Number(process.env.BITRATE));
    const parts = await page.evaluate(async () => {
      const bytes = await exportMP4(document.getElementById('c').getContext('2d'), m => nodeLog(m));
      const chunks = []; const CH = 1 << 22;
      for (let o = 0; o < bytes.length; o += CH) {
        const s = bytes.subarray(o, o + CH); let bin = '';
        for (let i = 0; i < s.length; i += 0x8000) bin += String.fromCharCode.apply(null, s.subarray(i, i + 0x8000));
        chunks.push(btoa(bin));
      }
      return chunks;
    });
    const f = path.join(out, process.env.OUT || 'sisi-gelap-forex.mp4');
    fs.writeFileSync(f, Buffer.concat(parts.map(p => Buffer.from(p, 'base64'))));
    console.log('wrote', f, fs.statSync(f).size);
  }
  await b.close();
})();
