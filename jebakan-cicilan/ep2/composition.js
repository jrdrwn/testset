// Motion video 9:16 sebagai fungsi murni dari waktu: render(ctx, t). Dipakai preview, export MP4, dan thumbnail.
// Generik: isi video ada di scenes.js, style di config.js, naskah di vo/lines.js. File ini jarang perlu diubah.
(function () {
  const W = 1080, H = 1920, FPS = 30;
  const V = window.VIDEO, S = window.STYLES[window.STYLE_ID];
  if (!S) throw new Error('STYLE_ID tidak dikenal: ' + window.STYLE_ID);
  const C = S.colors, DURATION = V.duration;

  // ---------- helpers ----------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const p = (t, a, b) => clamp((t - a) / (b - a));            // progres 0..1 dari detik a ke b
  const eOut = x => 1 - Math.pow(1 - x, 3);
  const eIn = x => x * x * x;
  const eIO = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const eBack = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rp = n => 'Rp' + Math.round(n).toLocaleString('id-ID');

  // txt(c, teks, x, y, {size, weight, font:'head'|'body', color, align, ls, scale, rot, alpha, maxW, stroke, sw, glow, blur})
  function txt(c, s, x, y, o = {}) {
    const body = o.font === 'body', size = o.size || 60;
    const weight = o.weight || (body ? S.bodyWeight : S.headWeight);
    c.save();
    c.font = `${weight} ${size}px ${body ? 'BODY' : 'HEAD'}`;
    c.textAlign = o.align || 'center'; c.textBaseline = 'middle';
    c.letterSpacing = (o.ls || 0) + 'px';
    let sc = o.scale ?? 1;
    if (o.maxW) { const w = c.measureText(s).width; if (w > o.maxW) sc *= o.maxW / w; }
    c.translate(x, y); if (o.rot) c.rotate(o.rot); c.scale(sc, sc);
    c.globalAlpha *= o.alpha ?? 1;
    if (o.stroke) { c.lineJoin = 'round'; c.lineWidth = o.sw || 10; c.strokeStyle = o.stroke; c.strokeText(s, 0, 0); }
    if (o.glow) { c.shadowColor = o.glow; c.shadowBlur = o.blur || 30; }
    c.fillStyle = o.color || C.text; c.fillText(s, 0, 0);
    c.restore();
  }
  function rrect(c, x, y, w, h, r, fill, stroke, lw = 4) {
    c.beginPath(); c.roundRect(x, y, w, h, r);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.lineWidth = lw; c.strokeStyle = stroke; c.stroke(); }
  }
  // kartu panel dengan bayangan lembut (style terang) atau garis tepi (style gelap)
  function card(c, x, y, w, h, o = {}) {
    c.save(); c.globalAlpha *= o.alpha ?? 1;
    c.shadowColor = 'rgba(0,0,0,0.18)'; c.shadowBlur = 40; c.shadowOffsetY = 14;
    rrect(c, x, y, w, h, o.r ?? 30, o.fill || C.panel);
    c.shadowColor = 'transparent';
    if (o.stroke !== false) rrect(c, x, y, w, h, o.r ?? 30, null, o.stroke || C.line, 3);
    c.restore();
  }
  // stamp miring yang "dibanting" masuk; k = progres 0..1
  function stamp(c, s, x, y, k, o = {}) {
    if (k <= 0) return;
    const size = o.size || 110, col = o.color || C.accent;
    const sc = lerp(2.2, 1, eOut(clamp(k * 1.4)));
    c.save(); c.translate(x, y); c.rotate(o.rot ?? -0.13); c.scale(sc, sc);
    c.globalAlpha *= clamp(k * 3);
    c.font = `${S.headWeight} ${size}px HEAD`; c.letterSpacing = '4px';
    const w = c.measureText(s).width + size * 0.7, h = size * 1.35;
    rrect(c, -w / 2, -h / 2, w, h, 18, o.fill || 'rgba(0,0,0,0.78)', col, size * 0.09);
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = col;
    c.shadowColor = col; c.shadowBlur = 25; c.fillText(s, 0, size * 0.04);
    c.restore();
  }
  // label pil di atas adegan
  function tag(c, s, y, col = C.accent, alpha = 1) {
    c.save(); c.globalAlpha *= alpha;
    c.font = `${S.bodyWeight} 38px BODY`; c.letterSpacing = '6px';
    const w = c.measureText(s).width + 110;
    rrect(c, 540 - w / 2, y - 38, w, 76, 38, col);
    c.fillStyle = '#fff'; c.beginPath(); c.arc(540 - w / 2 + 38, y, 9, 0, 7); c.fill();
    c.restore();
    txt(c, s, 540 + 18, y + 2, { size: 38, ls: 6, color: '#fff', alpha, font: 'body' });
  }
  // angka yang menghitung naik: counter(c, dari, ke, progres, x, y, {format, ...opsi txt})
  function counter(c, a, b, k, x, y, o = {}) {
    const v = lerp(a, b, eOut(clamp(k)));
    txt(c, (o.format || (n => String(Math.round(n))))(v), x, y, o);
  }
  // checklist; items = [{t: detik muncul, text, sub}], gaya centang/silang
  function checklist(c, items, lt, o = {}) {
    const x = o.x ?? 110, y0 = o.y ?? 360, gap = o.gap ?? 150, bad = !!o.bad;
    items.forEach((it, i) => {
      const k = p(lt, it.t, it.t + 0.35); if (k <= 0) return;
      const y = y0 + i * gap, a = eOut(k), dx = (1 - a) * 60;
      c.save(); c.globalAlpha *= a;
      c.fillStyle = bad ? C.accent : C.good; c.beginPath(); c.arc(x + 34 + dx, y, 34, 0, 7); c.fill();
      c.restore();
      txt(c, bad ? '✕' : '✓', x + 34 + dx, y + 2, { size: 44, color: '#fff', alpha: a, font: 'body', weight: 900 });
      txt(c, it.text, x + 100 + dx, y - (it.sub ? 16 : 0), { size: 50, align: 'left', alpha: a, maxW: 830 });
      if (it.sub) txt(c, it.sub, x + 100 + dx, y + 34, { size: 30, align: 'left', alpha: a, color: C.muted, font: 'body', maxW: 830 });
    });
  }
  // perbandingan batang; bars = [{label, value, color}], k = progres tumbuh
  function bars(c, list, k, o = {}) {
    const base = o.base ?? 1180, maxH = o.maxH ?? 520, x0 = o.x0 ?? 150, x1 = o.x1 ?? 930;
    const mx = Math.max(...list.map(b => b.value)), bw = (x1 - x0) / list.length;
    c.strokeStyle = C.muted; c.globalAlpha = 0.5; c.lineWidth = 4;
    c.beginPath(); c.moveTo(x0 - 30, base); c.lineTo(x1 + 30, base); c.stroke(); c.globalAlpha = 1;
    list.forEach((b, i) => {
      const kk = eOut(clamp(k * 1.3 - i * 0.15)), h = Math.max(10, maxH * (b.value / mx) * kk), cx = x0 + bw * (i + 0.5);
      rrect(c, cx - bw * 0.3, base - h, bw * 0.6, h, 14, b.color || C.accent2);
      txt(c, b.text || String(b.value), cx, base - h - 50, { size: 54, color: b.color || C.accent2, alpha: kk });
      txt(c, b.label, cx, base + 50, { size: 32, color: C.muted, font: 'body', maxW: bw * 0.95 });
    });
  }
  // notifikasi ala ponsel; muncul di detik t
  function notif(c, lt, t, y, title, body, o = {}) {
    const k = p(lt, t, t + 0.3); if (k <= 0) return;
    const a = eBack(k), x = 90, w = 900, h = 150;
    c.save(); c.translate(0, (1 - a) * -80); c.globalAlpha *= clamp(k * 2);
    card(c, x, y, w, h, { r: 32 });
    c.fillStyle = o.color || C.accent; c.beginPath(); c.roundRect(x + 30, y + 35, 80, 80, 20); c.fill();
    c.restore();
    txt(c, o.icon || '!', x + 70, y + 77 + (1 - a) * -80, { size: 50, color: '#fff', alpha: clamp(k * 2) });
    txt(c, title, x + 140, y + 52 + (1 - a) * -80, { size: 36, align: 'left', alpha: clamp(k * 2), maxW: 720 });
    txt(c, body, x + 140, y + 102 + (1 - a) * -80, { size: 30, align: 'left', color: C.muted, font: 'body', alpha: clamp(k * 2), maxW: 720 });
  }

  const K = { W, H, FPS, DURATION, C, S, clamp, lerp, p, eOut, eIn, eIO, eBack, rng, rp, txt, rrect, card, stamp, tag, counter, checklist, bars, notif };
  const { SCENES, EV } = window.makeScenes(K);
  EV.boom = EV.boom || []; EV.hit = EV.hit || []; EV.whoosh = EV.whoosh || SCENES.slice(1).map(s => s.t0);
  EV.ding = EV.ding || []; EV.blip = EV.blip || []; EV.stamp = EV.stamp || []; EV.riser = EV.riser || [];

  // ---------- caption (waktu per kata dari VO, fallback proporsional huruf) ----------
  const CAP = S.caption;
  const CAPTIONS = (window.VO_LINES || []).map((ln, li) => {
    const vo = window.VO_DATA && window.VO_DATA[li];
    const words = ln.cap.split(' '), vd = vo ? vo.dur : (ln.t1 - ln.t0) * 0.85;
    const total = ln.cap.length; let acc = 0;
    const times = vo && vo.wt && vo.wt.length === words.length
      ? vo.wt.map(x => ln.t0 + x)
      : words.map(w => { const tt = ln.t0 + (acc / total) * vd; acc += w.length + 1; return tt; });
    const groups = []; let g = [];
    words.forEach((w, i) => { g.push(i); if (g.length === CAP.maxWords || /[.,?:!;]$/.test(w)) { groups.push(g); g = []; } });
    if (g.length) groups.push(g);
    const next = window.VO_LINES[li + 1];
    return { t0: ln.t0, t1: next ? next.t0 - 0.05 : DURATION, words, times, groups };
  });
  function drawCaptions(c, t) {
    const cap = CAPTIONS.find(k => t >= k.t0 && t < k.t1); if (!cap) return;
    let cur = 0; cap.times.forEach((tt, i) => { if (t >= tt) cur = i; });
    const g = cap.groups.find(gr => gr.includes(cur));
    const gStart = cap.times[g[0]], pop = eBack(p(t, gStart, gStart + 0.14));
    c.save();
    c.font = `${S.headWeight} ${CAP.size}px HEAD`;
    const words = g.map(i => (CAP.upper ? cap.words[i].toUpperCase() : cap.words[i]));
    const sp = CAP.size * 0.36, grow = CAP.mode === 'pop' ? 1.12 : 1;
    const widths = words.map((w, j) => c.measureText(w).width * (g[j] === cur ? grow : 1));
    const total = widths.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
    const fit = Math.min(1, 900 / total), sc = fit * lerp(0.85, 1, pop);
    c.translate(540, CAP.y); c.scale(sc, sc);
    if (CAP.backdrop) rrect(c, -total / 2 - 34, -CAP.size * 0.78, total + 68, CAP.size * 1.56, 16, CAP.backdrop);
    let x = -total / 2;
    words.forEach((w, j) => {
      const idx = g[j], active = idx === cur, wp = active ? eBack(p(t, cap.times[idx], cap.times[idx] + 0.12)) : 1;
      c.save(); c.translate(x + widths[j] / 2, 0);
      if (active && CAP.mode === 'box') rrect(c, -widths[j] / 2 - 16, -CAP.size * 0.68, widths[j] + 32, CAP.size * 1.36, 18, CAP.boxColor || C.accent);
      if (active && CAP.mode === 'underline') rrect(c, -widths[j] / 2 * wp, CAP.size * 0.52, widths[j] * wp, 12, 6, CAP.active);
      const s = active && CAP.mode === 'pop' ? lerp(1, 1.12, wp) : 1; c.scale(s, s);
      c.textAlign = 'center'; c.textBaseline = 'middle';
      if (CAP.stroke && !(active && CAP.mode === 'box')) { c.lineJoin = 'round'; c.lineWidth = CAP.sw; c.strokeStyle = CAP.stroke; c.strokeText(w, 0, 0); }
      c.fillStyle = active && CAP.mode !== 'underline' ? CAP.active : CAP.color;
      if (active && CAP.mode === 'underline') c.fillStyle = CAP.active;
      c.fillText(w, 0, 0);
      c.restore();
      x += widths[j] + sp;
    });
    c.restore();
  }

  // ---------- background per style ----------
  function background(c, t, accent) {
    c.fillStyle = C.bg; c.fillRect(0, 0, W, H);
    const rg = c.createRadialGradient(540, 700, 50, 540, 700, 1100);
    rg.addColorStop(0, accent + '33'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = rg; c.fillRect(0, 0, W, H);
    c.strokeStyle = C.line; c.fillStyle = C.line; c.lineWidth = 2;
    if (S.bg === 'grid') {
      const off = (t * 25) % 90;
      for (let x = 0; x <= W; x += 90) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
      for (let y = -90 + off; y <= H; y += 90) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    } else if (S.bg === 'dots') {
      const off = (t * 12) % 60;
      for (let y = -60 + off; y <= H; y += 60) for (let x = 30; x <= W; x += 60) { c.beginPath(); c.arc(x, y, 4, 0, 7); c.fill(); }
    } else if (S.bg === 'scanlines') {
      for (let y = 0; y <= H; y += 6) c.fillRect(0, y, W, 2);
      const sy = (t * 300) % (H + 400) - 200, sg = c.createLinearGradient(0, sy - 200, 0, sy + 200);
      sg.addColorStop(0, 'rgba(0,0,0,0)'); sg.addColorStop(0.5, accent + '22'); sg.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = sg; c.fillRect(0, sy - 200, W, 400);
    } else if (S.bg === 'stripes') {
      const off = (t * 40) % 120;
      c.save(); c.rotate(-0.35);
      for (let x = -1200 + off; x <= 2200; x += 120) c.fillRect(x, -400, 40, 3200);
      c.restore();
      c.fillStyle = C.accent; c.fillRect(0, 0, W, 14); c.fillRect(0, H - 14, W, 14);
    } else if (S.bg === 'paper') {
      const r = rng(7);
      for (let i = 0; i < 260; i++) { const x = r() * W, y = r() * H, l = 20 + r() * 80; c.globalAlpha = 0.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + l, y + (r() - 0.5) * 8); c.stroke(); }
      c.globalAlpha = 1;
    }
  }

  // ---------- compositor ----------
  let buf, bctx, noise = [];
  function init() {
    buf = document.createElement('canvas'); buf.width = W; buf.height = H; bctx = buf.getContext('2d');
    const r = rng(99);
    for (let n = 0; n < 4; n++) {
      const cv = document.createElement('canvas'); cv.width = 360; cv.height = 640;
      const cx = cv.getContext('2d'), im = cx.createImageData(360, 640);
      for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
      cx.putImageData(im, 0, 0); noise.push(cv);
    }
  }
  const sumEnv = (t, list, decay, win = 0.7) => list.reduce((acc, [ti, s]) => (t >= ti && t - ti < win ? acc + s * Math.exp(-(t - ti) * decay) : acc), 0);

  // pil akun brand (mis. @wanadiary.id); k = progres muncul, s = skala
  function drawHandle(c, x, y, k, s) {
    if (k <= 0) return;
    const size = 40 * s, a = eOut(k);
    c.save(); c.globalAlpha *= a;
    c.font = `${S.bodyWeight} ${size}px BODY`;
    const w = c.measureText(V.handle).width + size * 1.6, h = size * 1.7;
    rrect(c, x - w / 2, y - h / 2 + (1 - a) * 20, w, h, h / 2, C.panel, C.accent, 3 * s);
    c.restore();
    txt(c, V.handle, x, y + 2 * s + (1 - a) * 20, { size, font: 'body', color: C.text, alpha: a });
  }

  // gambar adegan (tanpa efek kamera) ke buffer; caption opsional
  function drawFrame(t, withCaptions = true) {
    if (!buf) init();
    const scene = SCENES.find(s => t >= s.t0 && t < s.t1) || SCENES[SCENES.length - 1];
    const c = bctx;
    c.save(); background(c, t, scene.accent || C.accent); c.restore();
    c.save(); scene.draw(c, t - scene.t0, t); c.restore();
    if (V.disclaimer && V.disclaimerFrom != null && t >= V.disclaimerFrom)
      txt(c, V.disclaimer, 540, 1560, { size: 26, font: 'body', color: C.muted, alpha: p(t, V.disclaimerFrom, V.disclaimerFrom + 0.4), maxW: 900 });
    if (V.handle && scene === SCENES[SCENES.length - 1]) drawHandle(c, 540, 1205, p(t - scene.t0, 0.3, 0.6), 1);
    if (withCaptions) { c.save(); drawCaptions(c, t); c.restore(); }
    return scene;
  }

  function post(main, t) {
    // film grain + vignette
    if (S.vignette > 0) {
      const vg = main.createRadialGradient(540, 960, 500, 540, 960, 1250);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${S.vignette})`);
      main.fillStyle = vg; main.fillRect(0, 0, W, H);
    }
    if (S.grain > 0) {
      main.save(); main.globalAlpha = S.grain; main.globalCompositeOperation = 'overlay';
      main.drawImage(noise[Math.floor(t * FPS) % 4], 0, 0, W, H); main.restore();
    }
  }

  function render(main, t) {
    drawFrame(t, true);
    const A = (sumEnv(t, EV.boom.map(([a, s]) => [a, s * 1.3]), 9) + sumEnv(t, EV.hit, 10) + sumEnv(t, EV.stamp, 10)) * S.shake;
    const dx = A * 26 * Math.sin(t * 91 + 1), dy = A * 20 * Math.cos(t * 77), zs = 1 + 0.035 * Math.min(A, 1.5);
    // transisi di awal tiap adegan
    let tr = 0; SCENES.slice(1).forEach(s => { const d = t - s.t0; if (d >= 0 && d < 0.3) tr = 1 - d / 0.3; });
    let ox = 0, zz = 1, fade = 0;
    if (S.transition === 'slide') ox = -W * 0.12 * eIn(tr);
    if (S.transition === 'zoom') zz = 1 + 0.18 * eIn(tr);
    if (S.transition === 'fade') fade = tr;
    main.save(); main.fillStyle = C.bg; main.fillRect(0, 0, W, H);
    main.translate(W / 2 + dx + ox, H / 2 + dy); main.scale(zs * zz, zs * zz); main.drawImage(buf, -W / 2, -H / 2);
    main.restore();
    if (S.transition === 'glitch') {
      let g = 0;
      SCENES.slice(1).forEach(s => { const d = Math.abs(t - s.t0); if (d < 0.15) g = Math.max(g, 1 - d / 0.15); });
      EV.boom.forEach(([b]) => { if (t >= b && t - b < 0.22) g = Math.max(g, 1 - (t - b) / 0.22); });
      if (g > 0) {
        const r = rng(Math.floor(t * FPS) * 13 + 7), n = Math.ceil(8 * g);
        for (let i = 0; i < n; i++) { const y = r() * H, h = 20 + r() * 140, sx = (r() - 0.5) * 160 * g; main.drawImage(buf, 0, y, W, h, sx, y, W, h); }
        main.save(); main.globalCompositeOperation = 'screen';
        for (let i = 0; i < n; i++) { main.fillStyle = i % 2 ? `rgba(255,30,70,${0.35 * g})` : `rgba(0,230,255,${0.25 * g})`; main.fillRect(r() * W * 0.6, r() * H, 100 + r() * 600, 6 + r() * 30); }
        main.restore();
      }
    }
    const fl = S.transition === 'flash' ? tr * 0.6 : 0;
    const fw = sumEnv(t, EV.hit.map(([a]) => [a, 0.28]), 22, 0.3) * S.shake + fl;
    const fr = sumEnv(t, EV.boom.map(([a]) => [a, 0.4]), 14, 0.4) * S.shake;
    if (fw > 0.005) { main.fillStyle = `rgba(255,255,255,${Math.min(0.6, fw)})`; main.fillRect(0, 0, W, H); }
    if (fr > 0.005) { main.fillStyle = `rgba(255,20,50,${Math.min(0.5, fr)})`; main.fillRect(0, 0, W, H); }
    if (fade > 0.005) { main.fillStyle = C.bg; main.globalAlpha = fade; main.fillRect(0, 0, W, H); main.globalAlpha = 1; }
    post(main, t);
    // watermark handle: samar, diam (tidak ikut guncang/glitch), menghilang saat pil handle di adegan terakhir muncul
    const WM = V.watermark;
    if (V.handle && WM) {
      const last = SCENES[SCENES.length - 1], hide = p(t - last.t0, 0.3, 0.6);
      if (hide < 1) txt(main, V.handle, 540, WM.y, { size: WM.size, font: 'body', color: C.text, alpha: WM.opacity * (1 - hide), ls: 2 });
    }
  }

  // ---------- thumbnail / cover ----------
  // renderThumb(ctx, 'A'|'B'|'C'); ukuran canvas bebas (1080x1920 cover, 1280x720 YouTube)
  function renderThumb(main, variant = 'A') {
    const T = window.THUMB, TS = S.thumb, w = main.canvas.width, h = main.canvas.height, land = w > h;
    drawFrame(T.bgTime, false);
    const sc = Math.max(w / W, h / H);                    // cover-fit
    // latar = frame video yang di-blur supaya teks adegan tidak bersaing dengan judul thumbnail
    main.save(); main.fillStyle = C.bg; main.fillRect(0, 0, w, h);
    main.filter = `blur(${Math.round((T.blur ?? 14) * sc)}px)`;
    const z = 1.06; // sedikit zoom agar tepi blur tidak terlihat
    main.drawImage(buf, (w - W * sc * z) / 2, (h - H * sc * z) / 2 + (land ? -H * sc * 0.08 : 0), W * sc * z, H * sc * z);
    main.filter = 'none';
    main.restore();
    const g = land ? main.createLinearGradient(0, 0, w, 0) : main.createLinearGradient(0, 0, 0, h);
    if (land) { g.addColorStop(0, TS.overlay); g.addColorStop(0.62, TS.overlay); g.addColorStop(1, 'rgba(0,0,0,0)'); }
    else if (variant === 'C') { g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.45, 'rgba(0,0,0,0)'); g.addColorStop(0.62, TS.overlay); g.addColorStop(1, TS.overlay); }
    else { g.addColorStop(0, TS.overlay); g.addColorStop(1, TS.overlay); }
    main.fillStyle = g; main.fillRect(0, 0, w, h);
    // area teks
    const box = land ? { x: w * 0.06, y: h * 0.14, w: w * 0.56, h: h * 0.72, align: 'left' }
      : variant === 'B' ? { x: w * 0.08, y: h * 0.12, w: w * 0.84, h: h * 0.30, align: 'center' }
      : variant === 'C' ? { x: w * 0.08, y: h * 0.58, w: w * 0.84, h: h * 0.24, align: 'center' }
      : { x: w * 0.08, y: h * 0.28, w: w * 0.84, h: h * 0.34, align: 'center' };
    const lines = T.lines, n = lines.length;
    let size = Math.min(box.h / (n + (T.sub ? 0.9 : 0)) * 0.86, land ? 150 : 210);
    main.save(); main.font = `${S.headWeight} ${size}px HEAD`;
    const widest = Math.max(...lines.map(l => main.measureText(l).width));
    if (widest > box.w) size *= box.w / widest;
    main.restore();
    const ax = box.align === 'left' ? box.x : box.x + box.w / 2;
    let y = box.y + size * 0.6;
    lines.forEach(l => {
      const hl = (T.highlight || []).includes(l);
      main.save(); main.font = `${S.headWeight} ${size}px HEAD`; main.textAlign = box.align; main.textBaseline = 'middle';
      main.lineJoin = 'round'; main.lineWidth = size * 0.12; main.strokeStyle = TS.stroke; main.strokeText(l, ax, y);
      if (hl) { main.shadowColor = TS.hl; main.shadowBlur = size * 0.25; }
      main.fillStyle = hl ? TS.hl : TS.textColor; main.fillText(l, ax, y); main.restore();
      y += size * 1.02;
    });
    if (T.sub) {
      const ss = size * 0.34;
      main.save(); main.font = `${S.bodyWeight} ${ss}px BODY`; main.textAlign = box.align; main.textBaseline = 'middle';
      const sw = Math.min(box.w, main.measureText(T.sub).width), k = sw / main.measureText(T.sub).width;
      main.translate(ax, y + ss * 0.2); main.scale(k, k);
      main.lineJoin = 'round'; main.lineWidth = ss * 0.18; main.strokeStyle = TS.stroke; main.strokeText(T.sub, 0, 0);
      main.fillStyle = TS.textColor; main.fillText(T.sub, 0, 0); main.restore();
      y += ss * 1.2;
    }
    // handle brand di bawah teks; 9:16 dijaga di dalam area potong grid profil IG 3:4 (y ≤ 0,86 h)
    if (V.handle) {
      const hs = land ? h / 720 : w / 1080, hy = land ? h * 0.88 : Math.min(y + 70 * hs, h * 0.86);
      const hx = land ? box.x + 160 * hs : w / 2;
      drawHandle(main, hx, hy, 1, hs);
    }
    if (T.badge) {
      const big = variant === 'B' && !land, bs = (land ? h * 0.075 : big ? h * 0.07 : h * 0.04);
      const bx = land ? w * 0.80 : w / 2, by = land ? h * 0.18 : big ? h * 0.56 : box.y - bs * 1.4;
      main.save(); main.scale(1, 1); stamp(main, T.badge, bx, by, 1, { size: bs, color: TS.badge, rot: land ? 0.1 : -0.08 }); main.restore();
    }
  }

  // ---------- audio (deterministik, 48 kHz stereo): musik sintetis + SFX + VO + ducking ----------
  function synthAudio(sr = 48000) {
    const N = Math.ceil(DURATION * sr), L = new Float32Array(N), R = new Float32Array(N), r = rng(5);
    const add = (i, v, pan = 0) => { if (i >= 0 && i < N) { L[i] += v * (1 - pan * 0.5); R[i] += v * (1 + pan * 0.5); } };
    const beat = 60 / S.bpm;
    const kick = (t0, g) => { const s0 = Math.floor(t0 * sr); let ph = 0; for (let j = 0; j < sr * 0.35; j++) { const tt = j / sr; ph += 2 * Math.PI * (48 + 110 * Math.exp(-tt * 35)) / sr; add(s0 + j, Math.sin(ph) * Math.exp(-tt * 9) * g); } };
    const hat = (t0, g) => { const s0 = Math.floor(t0 * sr); let prev = 0; for (let j = 0; j < sr * 0.05; j++) { const tt = j / sr, n = r() * 2 - 1, hp = n - prev; prev = n; add(s0 + j, hp * Math.exp(-tt * 90) * g, 0.3); } };
    const pluck = (t0, f, g, pan = 0) => { const s0 = Math.floor(t0 * sr); for (let j = 0; j < sr * 0.4; j++) { const tt = j / sr; add(s0 + j, (Math.sin(2 * Math.PI * f * tt) + 0.3 * Math.sin(4 * Math.PI * f * tt)) * Math.exp(-tt * 7) * g, pan); } };
    const pad = (f, g) => { for (let i = 0; i < N; i++) { const t = i / sr, lfo = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.1 * t); const v = (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 1.5 * t + 1) + 0.3 * Math.sin(2 * Math.PI * f * 2.01 * t)) * g * (0.6 + 0.4 * lfo); L[i] += v; R[i] += v * (1 - 0.1 * Math.sin(t)); } };
    const prog = [0, 5, 3, 4], scale = [0, 2, 4, 5, 7, 9, 11, 12];
    const note = (root, deg) => root * Math.pow(2, scale[deg % 8] / 12);
    if (S.music === 'tension') {
      let lp = 0;
      for (let i = 0; i < N; i++) {
        const t = i / sr, lfo = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.18 * t);
        const d = 0.07 * Math.sin(2 * Math.PI * 55 * t) + 0.045 * Math.sin(2 * Math.PI * 55.6 * t + 1) + 0.025 * lfo * Math.sin(2 * Math.PI * 110.4 * t);
        lp += 0.02 * ((r() * 2 - 1) - lp); const v = d + lp * 0.12; L[i] += v; R[i] += v;
      }
      for (let t = 0; t < DURATION - 0.5; t += beat * 2) kick(t, 0.26);
    } else if (S.music === 'upbeat' || S.music === 'synth') {
      for (let t = 0, b = 0; t < DURATION - 0.3; t += beat, b++) {
        kick(t, 0.22); hat(t + beat / 2, S.music === 'synth' ? 0.10 : 0.07);
        const root = 110 * Math.pow(2, [0, 7, 3, 5][Math.floor(b / 4) % 4] / 12);
        pluck(t, root, 0.09); if (S.music === 'synth') pluck(t + beat / 2, root * 2, 0.05, 0.4);
      }
      pad(S.music === 'synth' ? 110 : 220, 0.012);
    } else if (S.music === 'news') {
      for (let t = 0; t < DURATION - 0.3; t += beat) { kick(t, 0.2); hat(t + beat / 2, 0.06); }
      for (let t = 0; t < DURATION; t += beat / 2) pluck(t, 880, 0.015, 0.5);
      pad(73.4, 0.02);
    } else if (S.music === 'calm') {
      pad(130.8, 0.022);
      for (let t = 0, b = 0; t < DURATION - 0.3; t += beat * 2, b++) pluck(t, note(261.6, prog[b % 4] + 2 * (b % 2)), 0.05, (b % 2) - 0.5);
    }
    // SFX
    EV.boom.forEach(([t0, s]) => { const s0 = Math.floor(t0 * sr); let ph = 0, n = 0; for (let j = 0; j < sr * 1.6; j++) { const tt = j / sr; ph += 2 * Math.PI * (32 + 90 * Math.exp(-tt * 6)) / sr; n += 0.15 * ((r() * 2 - 1) - n); add(s0 + j, (Math.sin(ph) * Math.exp(-tt * 2.6) * 0.75 + n * Math.exp(-tt * 10) * 1.2) * s); } });
    EV.hit.forEach(([t0, s]) => { const s0 = Math.floor(t0 * sr); let ph = 0, n = 0; for (let j = 0; j < sr * 0.7; j++) { const tt = j / sr; ph += 2 * Math.PI * (45 + 80 * Math.exp(-tt * 18)) / sr; n += 0.3 * ((r() * 2 - 1) - n); add(s0 + j, (Math.sin(ph) * Math.exp(-tt * 5) * 0.55 + n * Math.exp(-tt * 25) * 0.6) * s); } });
    EV.stamp.forEach(([t0, s]) => { const s0 = Math.floor(t0 * sr); let n = 0, ph = 0; for (let j = 0; j < sr * 0.5; j++) { const tt = j / sr; n += 0.5 * ((r() * 2 - 1) - n); ph += 2 * Math.PI * (70 + 60 * Math.exp(-tt * 20)) / sr; add(s0 + j, (n * Math.exp(-tt * 30) * 0.9 + Math.sin(ph) * Math.exp(-tt * 8) * 0.5) * s); } });
    EV.whoosh.forEach(t1 => { const len = 0.35, s0 = Math.floor((t1 - len) * sr); let n = 0, prev = 0; for (let j = 0; j < sr * len; j++) { const x = j / (sr * len), w = r() * 2 - 1; n += (0.05 + 0.5 * x) * (w - n); const hp = n - prev; prev = n; add(s0 + j, hp * Math.pow(x, 2) * 0.9, Math.sin(x * 3)); } });
    EV.ding.forEach((t0, i) => { const s0 = Math.floor(t0 * sr), f = 880 * Math.pow(2, [0, 2, 4, 7, 9, 12][i % 6] / 12); for (let j = 0; j < sr * 0.6; j++) { const tt = j / sr; add(s0 + j, (Math.sin(2 * Math.PI * f * tt) + 0.4 * Math.sin(2 * Math.PI * f * 1.5 * tt)) * 0.12 * Math.exp(-tt * 6), 0.2); } });
    EV.blip.forEach(t0 => { const s0 = Math.floor(t0 * sr); for (let j = 0; j < sr * 0.09; j++) { const tt = j / sr; add(s0 + j, Math.sin(2 * Math.PI * (1200 - 4000 * tt) * tt) * 0.1 * Math.exp(-tt * 30)); } });
    EV.riser.forEach(([a, b]) => { const s0 = Math.floor(a * sr), len = (b - a) * sr; let ph = 0, n = 0; for (let j = 0; j < len; j++) { const x = j / len; ph += 2 * Math.PI * (200 + 900 * x * x) / sr; n += 0.3 * ((r() * 2 - 1) - n); add(s0 + j, (Math.sin(ph) * 0.05 + n * 0.12) * x * x); } });
    // VO: letakkan tiap baris di t0, normalisasi, bed musik/SFX diturunkan (ducking) saat VO bicara
    if (window.VO_DATA) {
      const VO = new Float32Array(N), act = new Uint8Array(N);
      window.VO_LINES.forEach((ln, li) => {
        const d = window.VO_DATA[li]; if (!d) return;
        const bin = atob(d.b64), pcm = new Int16Array(bin.length >> 1);
        for (let k = 0; k < pcm.length; k++) pcm[k] = (bin.charCodeAt(2 * k) | (bin.charCodeAt(2 * k + 1) << 8)) << 16 >> 16;
        const ratio = d.sr / sr, s0 = Math.floor(ln.t0 * sr), len = Math.floor(pcm.length / ratio);
        for (let j = 0; j < len && s0 + j < N; j++) {
          const x = j * ratio, k = Math.floor(x), f = x - k;
          VO[s0 + j] = (pcm[k] * (1 - f) + (pcm[Math.min(k + 1, pcm.length - 1)] || 0) * f) / 32768; act[s0 + j] = 1;
        }
      });
      let peak = 1e-6; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(VO[i]));
      const vg = 0.95 / peak; let duck = 1;
      for (let i = 0; i < N; i++) {
        const target = act[Math.min(N - 1, i + Math.floor(sr * 0.04))] ? 0.38 : 1;
        duck += (target < duck ? 0.0008 : 0.00012) * (target - duck);
        const v = VO[i] * vg; L[i] = L[i] * duck + v; R[i] = R[i] * duck + v;
      }
    }
    for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i] * 1.3) * 0.88; R[i] = Math.tanh(R[i] * 1.3) * 0.88; }
    return { sr, L, R };
  }

  window.COMP = { W, H, FPS, DURATION, render, renderThumb, synthAudio, SCENES };
})();
