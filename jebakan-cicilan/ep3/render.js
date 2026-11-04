// Pemakaian:
//   node render.js mp4                     -> out/<slug>-vo.mp4 (pakai NOVO=1 untuk versi tanpa VO -> out/<slug>.mp4)
//   node render.js stills 0.5,3.2,8        -> previews/tXX.XX.jpg (cek visual per detik)
//   node render.js thumb                   -> out/thumb-<varian>-916.jpg (1080x1920) dan -169.jpg (1280x720)
// Env: CHROME (path chrome), PW (path modul playwright-core), BITRATE, NOVO=1.
// Env tambahan: FFMPEG (WAJIB untuk mp4) -> hasil akhir di-encode ulang ke H.264 + AAC agar diterima TikTok/IG/YouTube.
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const { chromium } = require(process.env.PW || 'playwright-core');
const CHROME = process.env.CHROME || '/inner_container/opt/playwright/chromium-1232/chrome-linux64/chrome';

// MP4 dari browser berisi audio Opus; TikTok menolaknya ("encode error"). Encode ulang ke format upload standar:
// H.264 High@4.1 yuv420p 30 fps CFR, GOP 2 dtk, AAC-LC 192 kbps 44,1 kHz stereo, moov di depan (faststart).
function finalize(raw, final) {
  const FF = process.env.FFMPEG;
  if (!FF) throw new Error('FFMPEG belum di-set: file tanpa finalisasi (audio Opus) akan ditolak TikTok. Lihat setup 2.7.');
  execFileSync(FF, ['-y', '-loglevel', 'error', '-i', raw,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-maxrate', '8M', '-bufsize', '16M',
    '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p', '-r', '30', '-g', '60',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2',
    '-movflags', '+faststart', '-brand', 'mp42', final]);
  fs.unlinkSync(raw);
}

(async () => {
  const [mode, arg] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: CHROME, chromiumSandbox: false, args: ['--disable-crash-reporter', '--disable-breakpad', '--no-zygote', '--disable-dev-shm-usage'] });
  const page = await b.newPage();
  page.on('console', m => console.log('[page]', m.text()));
  page.on('pageerror', e => { console.log('[pageerror]', e.message); process.exitCode = 1; });
  if (process.env.NOVO) await page.addInitScript(() => Object.defineProperty(window, 'VO_DATA', { get: () => undefined, set: () => {} }));
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.evaluate(() => fontsReady());
  const slug = await page.evaluate(() => VIDEO.slug);
  const outDir = path.join(__dirname, 'out'), prevDir = path.join(__dirname, 'previews');
  fs.mkdirSync(outDir, { recursive: true }); fs.mkdirSync(prevDir, { recursive: true });
  const jpg = (f, data) => { fs.writeFileSync(f, Buffer.from(data.split(',')[1], 'base64')); console.log(f); };
  if (mode === 'stills') {
    for (const t of arg.split(',').map(Number)) {
      const data = await page.evaluate(t => { const c = document.getElementById('c'); COMP.render(c.getContext('2d'), t); return c.toDataURL('image/jpeg', 0.85); }, t);
      jpg(path.join(prevDir, `t${t.toFixed(2).padStart(5, '0')}.jpg`), data);
    }
  } else if (mode === 'thumb') {
    const variants = await page.evaluate(() => THUMB.variants || ['A']);
    // 9:16 untuk tiap varian; 16:9 (YouTube) satu layout: teks kiri + badge kanan atas
    const jobs = variants.map(v => [v, 1080, 1920, '916']).concat([[variants[0], 1280, 720, '169']]);
    for (const [v, w, h, tag] of jobs) {
      const data = await page.evaluate(([v, w, h]) => {
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        COMP.renderThumb(c.getContext('2d'), v); return c.toDataURL('image/jpeg', 0.9);
      }, [v, w, h]);
      jpg(path.join(outDir, tag === '169' ? 'thumb-169.jpg' : `thumb-${v}-916.jpg`), data);
    }
  } else if (mode === 'mp4') {
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
    const f = path.join(outDir, process.env.OUT || `${slug}${process.env.NOVO ? '' : '-vo'}.mp4`);
    const raw = f.replace(/\.mp4$/, '.raw.mp4');
    fs.writeFileSync(raw, Buffer.concat(parts.map(p => Buffer.from(p, 'base64'))));
    finalize(raw, f);
    console.log('wrote', f, fs.statSync(f).size);
  } else { console.log('mode: mp4 | stills <t,..> | thumb'); }
  await b.close();
})();
