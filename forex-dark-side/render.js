// Usage: node render.js stills 0.3,1.6,...   |   node render.js mp4
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const { chromium } = require(process.env.PW || 'playwright-core');

// MP4 dari browser berisi audio Opus; TikTok menolaknya ("encode error"). Encode ulang ke format upload standar:
// H.264 High@4.1 yuv420p 30 fps CFR, GOP 2 dtk, AAC-LC 192 kbps 44,1 kHz stereo, moov di depan (faststart). Butuh env FFMPEG.
function finalize(raw, final) {
  const FF = process.env.FFMPEG;
  if (!FF) throw new Error('FFMPEG belum di-set: file tanpa finalisasi (audio Opus) akan ditolak TikTok.');
  execFileSync(FF, ['-y', '-loglevel', 'error', '-i', raw,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-maxrate', '15M', '-bufsize', '30M',
    '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p', '-r', '30', '-g', '60',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2',
    '-movflags', '+faststart', '-brand', 'mp42', final]);
  fs.unlinkSync(raw);
}
const CHROME = process.env.CHROME || '/inner_container/opt/playwright/chromium-1232/chrome-linux64/chrome';
(async () => {
  const [mode, arg] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: CHROME, chromiumSandbox: false, args: ['--disable-crash-reporter', '--disable-breakpad', '--no-zygote', '--disable-dev-shm-usage'] });
  const page = await b.newPage();
  page.on('console', m => console.log('[page]', m.text()));
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.evaluate(() => document.fonts.load('900 40px NS'));
  const out = path.join(__dirname, mode === 'stills' ? 'previews' : 'out');
  fs.mkdirSync(out, { recursive: true });
  if (mode === 'thumb') {
    // out/thumb-A|B|C-916.jpg (1080x1920 cover Reels/TikTok/Shorts) + out/thumb-169.jpg (1280x720 YouTube)
    for (const [v, w, h, name] of [['A', 1080, 1920, 'thumb-A-916'], ['B', 1080, 1920, 'thumb-B-916'], ['C', 1080, 1920, 'thumb-C-916'], ['A', 1280, 720, 'thumb-169']]) {
      const data = await page.evaluate(([v, w, h]) => {
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        COMP.renderThumb(c.getContext('2d'), v); return c.toDataURL('image/jpeg', 0.9);
      }, [v, w, h]);
      const f = path.join(out, name + '.jpg');
      fs.writeFileSync(f, Buffer.from(data.split(',')[1], 'base64')); console.log(f);
    }
  } else if (mode === 'stills') {
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
    const raw = f.replace(/\.mp4$/, '.raw.mp4');
    fs.writeFileSync(raw, Buffer.concat(parts.map(p => Buffer.from(p, 'base64'))));
    finalize(raw, f);
    console.log('wrote', f, fs.statSync(f).size);
  }
  await b.close();
})();
