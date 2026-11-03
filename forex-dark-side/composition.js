// "Sisi Gelap Trading Forex" — 9:16 motion video, 54 s @ 30 fps.
// Pure function of time: render(ctx, t). Same code drives preview + MP4 export.
(function () {
  const W = 1080, H = 1920, FPS = 30, DURATION = 55;
  const C = {
    bg: '#06070a', red: '#ff2d4a', green: '#1fe39a', yellow: '#ffd60a',
    white: '#f4f5f7', grey: '#8a90a0', panel: '#12151d', orange: '#ff8a1f',
  };

  // ---------- helpers ----------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const p = (t, a, b) => clamp((t - a) / (b - a));
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
  function mixHex(a, b, t) {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const r = Math.round(lerp(pa >> 16, pb >> 16, t)), g = Math.round(lerp((pa >> 8) & 255, (pb >> 8) & 255, t)), bl = Math.round(lerp(pa & 255, pb & 255, t));
    return `rgb(${r},${g},${bl})`;
  }

  function txt(c, s, x, y, o = {}) {
    const size = o.size || 60, weight = o.weight || 800;
    c.save();
    c.font = `${weight} ${size}px NS`;
    c.textAlign = o.align || 'center';
    c.textBaseline = 'middle';
    c.letterSpacing = (o.ls || 0) + 'px';
    let sc = o.scale ?? 1;
    if (o.maxW) { const w = c.measureText(s).width; if (w > o.maxW) sc *= o.maxW / w; }
    c.translate(x, y);
    if (o.rot) c.rotate(o.rot);
    c.scale(sc, sc);
    c.globalAlpha *= o.alpha ?? 1;
    if (o.stroke) { c.lineJoin = 'round'; c.lineWidth = o.sw || 10; c.strokeStyle = o.stroke; c.strokeText(s, 0, 0); }
    if (o.glow) { c.shadowColor = o.glow; c.shadowBlur = o.blur || 30; }
    c.fillStyle = o.color || C.white;
    c.fillText(s, 0, 0);
    c.restore();
  }
  function rrect(c, x, y, w, h, r, fill, stroke, lw = 4) {
    c.beginPath(); c.roundRect(x, y, w, h, r);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.lineWidth = lw; c.strokeStyle = stroke; c.stroke(); }
  }
  function stamp(c, s, x, y, k, o = {}) {
    // k: 0..1 slam progress
    if (k <= 0) return;
    const size = o.size || 110, col = o.color || C.red;
    const sc = lerp(2.2, 1, eOut(clamp(k * 1.4)));
    c.save();
    c.translate(x, y); c.rotate(o.rot ?? -0.13); c.scale(sc, sc);
    c.globalAlpha *= clamp(k * 3);
    c.font = `900 ${size}px NS`; c.letterSpacing = '4px';
    const w = c.measureText(s).width + size * 0.7, h = size * 1.35;
    rrect(c, -w / 2, -h / 2, w, h, 18, 'rgba(10,0,4,0.82)', col, size * 0.09);
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = col;
    c.shadowColor = col; c.shadowBlur = 25;
    c.fillText(s, 0, size * 0.04);
    c.restore();
  }
  function warnIcon(c, x, y, s, col) {
    c.save(); c.translate(x, y);
    c.beginPath(); c.moveTo(0, -s); c.lineTo(s * 0.95, s * 0.7); c.lineTo(-s * 0.95, s * 0.7); c.closePath();
    c.fillStyle = col; c.fill();
    c.fillStyle = '#000'; c.font = `900 ${s * 1.1}px NS`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('!', 0, s * 0.12);
    c.restore();
  }

  // ---------- timeline ----------
  const SCENES = [
    { id: 'hook', t0: 0, t1: 3, accent: C.red, draw: sHook },
    { id: 'lev', t0: 3, t1: 7.5, accent: C.yellow, draw: sLev },
    { id: 'wipe', t0: 7.5, t1: 11.5, accent: C.red, draw: sWipe },
    { id: 'margin', t0: 11.5, t1: 17, accent: C.red, draw: sMargin },
    { id: 'broker', t0: 17, t1: 23.5, accent: C.red, draw: sBroker },
    { id: 'flags', t0: 23.5, t1: 30, accent: C.yellow, draw: sFlags },
    { id: 'psy', t0: 30, t1: 36, accent: C.red, draw: sPsy },
    { id: 'cost', t0: 36, t1: 41.5, accent: C.yellow, draw: sCost },
    { id: 'check', t0: 41.5, t1: 51.5, accent: C.green, draw: sCheck },
    { id: 'outro', t0: 51.5, t1: 55, accent: C.yellow, draw: sOutro },
  ];
  const CHECK_T = window.VO_CHECK_T;
  const EV = {
    boom: [[0.62, 1], [1.35, 0.8], [9.9, 0.9], [20.2, 0.9], [51.5, 0.8]],
    hit: [[3, 0.6], [7.5, 0.6], [11.5, 0.6], [17, 0.7], [23.5, 0.6], [30, 0.6], [36, 0.6], [41.5, 0.5]],
    stamp: [[24.6, 0.7], [26.1, 0.7], [27.6, 0.7]],
    whoosh: [3, 7.5, 11.5, 17, 23.5, 30, 36, 41.5, 51.5],
    alert: [11.7, 12.9, 14.1],
    ding: CHECK_T.map(x => x + 0.3),
    blip: [23.8, 25.3, 26.8, 30.3, 30.9, 31.5, 32.1, 36.3, 37.1, 37.9, 38.7, 21.6],
    ticks: [[3.1, 4.0, 0.045], [4.2, 5.4, 0.06], [8.5, 9.9, 0.05], [11.7, 15.7, 0.09], [18.8, 20.2, 0.3]],
    riser: [[0, 0.62], [54.0, 55.0]],
    kick: [3, 51.5, 0.6],
  };
  const CAPTIONS = window.VO_LINES.map((ln, li) => {
    const vo = window.VO_DATA && window.VO_DATA[li];
    const words = ln.cap.split(' '), vd = vo ? vo.dur : (ln.t1 - ln.t0) * 0.85;
    const total = ln.cap.length; let acc = 0;
    // word timings from the voice (ElevenLabs alignment) when available, else spread by character count
    const times = vo && vo.wt && vo.wt.length === words.length
      ? vo.wt.map(x => ln.t0 + x)
      : words.map(w => { const tt = ln.t0 + (acc / total) * vd; acc += w.length + 1; return tt; });
    const groups = []; let g = [];
    words.forEach((w, i) => { g.push(i); if (g.length === 3 || /[.,?:!]$/.test(w)) { groups.push(g); g = []; } });
    if (g.length) groups.push(g);
    const next = window.VO_LINES[li + 1];
    return { t0: ln.t0, t1: next ? next.t0 - 0.05 : DURATION, words, times, groups };
  });

  // ---------- shared visuals ----------
  const HOOK = (() => {
    const r = rng(3); let price = 100; const a = [];
    for (let i = 0; i < 30; i++) { const o = price, c = o + (r() * 1.6 - 0.45) * 1.3; a.push({ o, c, h: Math.max(o, c) + r() * 0.9, l: Math.min(o, c) - r() * 0.9 }); price = c; }
    for (let i = 0; i < 8; i++) { const o = price, c = o - (3 + r() * 4); a.push({ o, c, h: o + r() * 0.6, l: c - r() * 1.6 }); price = c; }
    let mn = Infinity, mx = -Infinity;
    a.slice(0, 30).forEach(k => { mn = Math.min(mn, k.l); mx = Math.max(mx, k.h); });
    return { a, mn, mx };
  })();
  function drawHookChart(c, nGreen, crashK, alpha) {
    const x0 = 60, x1 = 1020, y0 = 420, y1 = 1150, n = 38, cw = (x1 - x0) / n;
    const Y = v => lerp(y1, y0, (v - HOOK.mn) / (HOOK.mx - HOOK.mn));
    c.save(); c.globalAlpha *= alpha;
    c.beginPath(); c.rect(0, y0 - 60, W, 1300 - y0 + 60); c.clip();
    const nC = crashK * 8, total = Math.min(30, nGreen) + (nGreen >= 30 ? nC : 0);
    const pts = [];
    for (let i = 0; i < Math.ceil(total); i++) {
      const k = HOOK.a[i], frac = Math.min(1, total - i), up = k.c >= k.o;
      const cx = x0 + cw * (i + 0.5), col = up ? C.green : C.red;
      const cl = lerp(k.o, k.c, frac);
      c.strokeStyle = col; c.lineWidth = 3;
      c.beginPath(); c.moveTo(cx, Y(lerp(k.o, k.h, frac))); c.lineTo(cx, Y(lerp(k.o, k.l, frac))); c.stroke();
      const yt = Y(Math.max(k.o, cl)), yb = Y(Math.min(k.o, cl));
      c.fillStyle = col; c.fillRect(cx - cw * 0.32, yt, cw * 0.64, Math.max(3, yb - yt));
      pts.push([cx, Y(cl)]);
    }
    if (pts.length > 1) {
      c.strokeStyle = crashK > 0 ? C.red : C.green; c.lineWidth = 5; c.shadowColor = c.strokeStyle; c.shadowBlur = 20;
      c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke();
    }
    c.restore();
  }

  // ---------- scenes ----------
  function tag(c, s, y, col, alpha = 1) {
    c.save(); c.globalAlpha *= alpha;
    c.font = '800 38px NS'; c.letterSpacing = '6px';
    const w = c.measureText(s).width + 110;
    rrect(c, 540 - w / 2, y - 38, w, 76, 38, col);
    c.restore();
    txt(c, s, 540 + 18, y + 2, { size: 38, ls: 6, color: '#fff', alpha });
    c.save(); c.globalAlpha *= alpha; c.fillStyle = '#fff'; c.beginPath(); c.arc(540 - w / 2 + 38, y, 9, 0, 7); c.fill(); c.restore();
  }

  function sHook(c, lt) {
    const greenN = 22 + 8 * eOut(p(lt, 0, 0.6));
    const crash = eIn(p(lt, 0.6, 1.25)) * 0.4 + eOut(p(lt, 0.6, 1.25)) * 0.6;
    drawHookChart(c, greenN, crash, lerp(1, 0.32, p(lt, 0.7, 1.1)));
    tag(c, 'SISI GELAP TRADING FOREX', 250, C.red);
    const k1 = p(lt, 0.62, 0.8);
    if (k1 > 0) txt(c, '7 DARI 10', 540, 760, { size: 200, weight: 900, scale: lerp(2.2, 1, eOut(k1)), alpha: clamp(k1 * 3), stroke: '#000', sw: 14 });
    const k2 = p(lt, 1.0, 1.25);
    if (k2 > 0) txt(c, 'AKUN TRADER RETAIL', 540, 905 + 30 * (1 - eOut(k2)), { size: 64, ls: 4, alpha: k2, stroke: '#000', sw: 10 });
    const k3 = p(lt, 1.35, 1.52);
    if (k3 > 0) txt(c, 'RUGI.', 540, 1075, { size: 250, weight: 900, color: C.red, scale: lerp(2.4, 1, eOut(k3)), alpha: clamp(k3 * 3), glow: C.red, blur: 40, stroke: '#000', sw: 14 });
    const k4 = p(lt, 1.7, 2.0);
    if (k4 > 0) txt(c, '*pengungkapan risiko broker CFD (regulasi ESMA): 70–89% akun retail rugi', 540, 1232, { size: 25, weight: 500, color: C.grey, alpha: k4, maxW: 900 });
  }

  function sLev(c, lt) {
    txt(c, 'LEVERAGE', 540, 300, { size: 56, ls: 14, color: C.grey });
    const v = Math.round(1 + 499 * eOut(p(lt, 0.1, 1.0)));
    txt(c, `1:${v}`, 540, 465, { size: 230, weight: 900, color: C.yellow, glow: 'rgba(255,214,10,.6)', blur: 40 });
    const base = 1190, maxH = 400;
    c.strokeStyle = '#2a2f3a'; c.lineWidth = 4; c.beginPath(); c.moveTo(110, base); c.lineTo(970, base); c.stroke();
    // modal
    rrect(c, 330 - 85, base - 14, 170, 14, 4, C.white);
    txt(c, 'MODALMU', 330, base - 110, { size: 34, ls: 4, color: C.grey });
    txt(c, 'Rp1 jt', 330, base - 60, { size: 60, weight: 900 });
    // posisi
    const g = eOut(p(lt, 1.2, 2.4)), h = Math.max(14, maxH * g), top = base - h;
    const grad = c.createLinearGradient(0, top, 0, base); grad.addColorStop(0, C.yellow); grad.addColorStop(1, '#a88400');
    rrect(c, 720 - 125, top, 250, h, 10, grad);
    c.save(); c.beginPath(); c.roundRect(720 - 125, top, 250, h, 10); c.clip();
    c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 18;
    for (let i = -10; i < 30; i++) { const yy = top + i * 50 + ((lt * 60) % 50); c.beginPath(); c.moveTo(595, yy); c.lineTo(845, yy - 120); c.stroke(); }
    c.restore();
    txt(c, 'POSISIMU', 720, top - 110, { size: 34, ls: 4, color: C.grey });
    txt(c, `Rp${Math.round(1 + 499 * g)} jt`, 720, top - 58, { size: 64, weight: 900, color: C.yellow });
    const kb = p(lt, 2.8, 3.1);
    if (kb > 0) {
      const flick = lt < 3.3 ? (Math.sin(lt * 90) > -0.3 ? 1 : 0.3) : 1;
      c.save(); c.globalAlpha = kb * flick;
      const s = lerp(1.3, 1, eBack(kb));
      c.translate(540, 600); c.scale(s, s);
      rrect(c, -420, -38, 840, 76, 38, 'rgba(255,45,74,.12)', C.red, 4);
      c.restore();
      txt(c, 'UNTUNG x500, RUGI JUGA x500', 540, 602, { size: 40, ls: 2, color: C.white, alpha: kb * flick, scale: lerp(1.3, 1, eBack(kb)) });
    }
  }

  function sWipe(c, lt) {
    txt(c, 'HARGA LAWAN ARAH', 540, 300, { size: 58, ls: 6 });
    const k = p(lt, 0.1, 0.3);
    txt(c, 'CUMA 0,2%', 540, 445, { size: 165, weight: 900, color: C.red, scale: lerp(1.8, 1, eOut(k)), alpha: clamp(k * 3), glow: C.red, blur: 30 });
    // line chart
    const x0 = 100, x1 = 980, yEntry = 650, yLow = 840, N = 120, r = rng(11);
    const ys = []; let y = yEntry;
    for (let i = 0; i < N; i++) {
      const target = i < 45 ? yEntry : lerp(yEntry, yLow, eIO((i - 45) / (N - 46)));
      y = target + (r() - 0.5) * 22; ys.push(y);
    }
    c.setLineDash([14, 12]); c.strokeStyle = C.grey; c.lineWidth = 3;
    c.beginPath(); c.moveTo(x0, yEntry); c.lineTo(x1, yEntry); c.stroke(); c.setLineDash([]);
    txt(c, 'ENTRY BUY', x0 + 10, yEntry - 28, { size: 26, ls: 3, color: C.grey, align: 'left' });
    const reveal = Math.max(2, Math.floor(N * eIO(p(lt, 0, 2.3))));
    c.strokeStyle = reveal > 50 ? C.red : C.green; c.lineWidth = 6; c.shadowColor = c.strokeStyle; c.shadowBlur = 18;
    c.beginPath();
    for (let i = 0; i < reveal; i++) { const xx = lerp(x0, x1, i / (N - 1)); i ? c.lineTo(xx, ys[i]) : c.moveTo(xx, ys[i]); }
    c.stroke(); c.shadowBlur = 0;
    const ex = lerp(x0, x1, (reveal - 1) / (N - 1));
    c.fillStyle = c.strokeStyle; c.beginPath(); c.arc(ex, ys[reveal - 1], 11, 0, 7); c.fill();
    if (reveal > 60) txt(c, '−0,2%', Math.min(ex, 900), ys[reveal - 1] + 46, { size: 34, weight: 900, color: C.red });
    // balance
    const dim = 1 - 0.45 * p(lt, 2.4, 2.6);
    c.save(); c.globalAlpha = dim;
    rrect(c, 90, 920, 900, 280, 30, C.panel, '#232837', 3);
    txt(c, 'SALDO AKUN', 130, 970, { size: 32, ls: 5, color: C.grey, align: 'left' });
    const f = 1 - eIn(p(lt, 1.0, 2.4));
    txt(c, rp(1000000 * f), 130, 1060, { size: 104, weight: 900, color: mixHex(C.white, C.red, 1 - f), align: 'left' });
    rrect(c, 130, 1135, 820, 26, 13, '#1d212b');
    if (f > 0.01) rrect(c, 130, 1135, 820 * f, 26, 13, mixHex(C.green, C.red, 1 - f));
    c.restore();
    stamp(c, 'MODAL HABIS', 540, 1060, p(lt, 2.4, 2.75), { size: 105 });
  }

  function sMargin(c, lt) {
    const cards = [
      { t: 0.2, title: 'MARGIN CALL', sub: 'Margin level 100%. Segera tambah dana.', col: C.yellow, time: '14:02' },
      { t: 1.4, title: 'PERINGATAN MARGIN', sub: 'Margin level 70%. Posisi berisiko.', col: C.orange, time: '14:05' },
      { t: 2.6, title: 'STOP OUT', sub: 'Margin 50%: posisi ditutup paksa.', col: C.red, time: '14:09' },
    ];
    txt(c, 'NOTIFIKASI', 540, 250, { size: 30, ls: 10, color: C.grey });
    cards.forEach((cd, i) => {
      const a = p(lt, cd.t, cd.t + 0.35); if (a <= 0) return;
      let slot = 0; for (let j = i + 1; j < cards.length; j++) slot += eOut(p(lt, cards[j].t, cards[j].t + 0.35));
      const y = 300 + slot * 175 - 70 * (1 - eOut(a));
      c.save(); c.globalAlpha = clamp(a * 2) * (1 - slot * 0.18);
      rrect(c, 90, y, 900, 150, 28, '#141821', '#262b38', 3);
      c.fillStyle = cd.col; c.beginPath(); c.roundRect(90, y, 14, 150, [28, 0, 0, 28]); c.fill();
      warnIcon(c, 168, y + 75, 32, cd.col);
      c.restore();
      const al = clamp(a * 2) * (1 - slot * 0.18);
      txt(c, cd.title, 230, y + 52, { size: 44, weight: 900, color: cd.col, align: 'left', alpha: al });
      txt(c, cd.sub, 230, y + 105, { size: 31, weight: 500, color: '#c5cad6', align: 'left', alpha: al, maxW: 720 });
      txt(c, cd.time, 960, y + 52, { size: 28, weight: 500, color: C.grey, align: 'right', alpha: al });
    });
    const k = p(lt, 0.2, 4.2), f = eIO(k);
    const wob = Math.sin(lt * 23) * 0.012 * (1 - f) * (k > 0 && k < 1 ? 1 : 0);
    const eq = 10000000 * (1 - 0.876 * clamp(f + wob));
    txt(c, 'EKUITAS', 540, 905, { size: 32, ls: 8, color: C.grey });
    txt(c, rp(eq), 540, 1010, { size: 118, weight: 900, color: mixHex(C.white, C.red, f), maxW: 900 });
    const pct = (1 - eq / 10000000) * 100;
    if (lt > 1.2) {
      const s = `−${pct.toFixed(1).replace('.', ',')}%`;
      rrect(c, 540 - 130, 1100, 260, 70, 35, 'rgba(255,45,74,.15)', C.red, 3);
      txt(c, s, 540, 1137, { size: 42, weight: 900, color: C.red });
    }
    const secs = Math.round(432 * f), mm = String(Math.floor(secs / 60)).padStart(2, '0'), ss = String(secs % 60).padStart(2, '0');
    txt(c, `waktu berlalu  00:${mm}:${ss}`, 540, 1225, { size: 32, weight: 600, color: C.grey, ls: 2 });
  }

  function sBroker(c, lt) {
    const k = p(lt, 0, 0.2);
    txt(c, 'BROKER ILEGAL', 540, 300, { size: 120, weight: 900, color: C.red, scale: lerp(1.5, 1, eOut(k)), alpha: clamp(k * 3), glow: C.red, blur: 30 });
    txt(c, 'deposit gampang. withdraw?', 540, 415, { size: 48, weight: 600, alpha: p(lt, 0.4, 0.7) });
    const rej = p(lt, 3.2, 3.5), gray = 1 - 0.5 * rej;
    c.save(); c.globalAlpha = gray;
    rrect(c, 170, 490, 740, 680, 50, '#0e1117', '#2a2f3a', 4);
    rrect(c, 470, 515, 140, 12, 6, '#2a2f3a');
    txt(c, 'SALDO', 540, 590, { size: 30, ls: 8, color: C.grey });
    txt(c, 'Rp25.000.000', 540, 665, { size: 84, weight: 900, color: rej > 0 ? C.grey : C.green });
    if (lt > 0.6) txt(c, 'Deposit berhasil', 540, 745, { size: 32, weight: 600, color: C.green, alpha: p(lt, 0.6, 0.9) });
    c.restore();
    // button / spinner
    if (lt < 1.8) {
      const press = lt > 1.5 && lt < 1.75 ? 0.93 : 1;
      c.save(); c.translate(540, 910); c.scale(press, press);
      rrect(c, -280, -60, 560, 120, 60, C.yellow);
      c.restore();
      txt(c, 'TARIK DANA', 540, 912, { size: 52, weight: 900, color: '#111', scale: press, ls: 3 });
      // finger
      const fk = eIO(p(lt, 0.9, 1.5)), fx = lerp(820, 600, fk), fy = lerp(1120, 930, fk);
      c.save(); c.globalAlpha = p(lt, 0.8, 1.0);
      c.strokeStyle = '#fff'; c.lineWidth = 6; c.beginPath(); c.arc(fx, fy, 34, 0, 7); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.arc(fx, fy, 24, 0, 7); c.fill();
      const rk = p(lt, 1.55, 1.8);
      if (rk > 0) { c.globalAlpha = 1 - rk; c.beginPath(); c.arc(fx, fy, 34 + rk * 90, 0, 7); c.stroke(); }
      c.restore();
    } else {
      c.save(); c.globalAlpha = gray;
      const a0 = lt * 7;
      c.strokeStyle = C.yellow; c.lineWidth = 10; c.lineCap = 'round';
      c.beginPath(); c.arc(540, 880, 50, a0, a0 + 4.2); c.stroke();
      c.restore();
      const msg = lt < 2.5 ? 'Memproses...' : 'Verifikasi tambahan...';
      txt(c, msg, 540, 985, { size: 36, weight: 600, color: C.grey, alpha: gray });
    }
    if (lt > 3.8) txt(c, 'Akun dibekukan.', 540, 1080, { size: 42, weight: 800, color: C.red, alpha: p(lt, 3.8, 4.1) });
    stamp(c, 'DITOLAK', 540, 880, p(lt, 3.2, 3.55), { size: 150 });
    const kp = p(lt, 4.6, 4.9);
    if (kp > 0) {
      c.save(); c.globalAlpha = kp;
      rrect(c, 120, 1198, 840, 76, 38, 'rgba(31,227,154,.12)', C.green, 3);
      c.restore();
      txt(c, 'CEK LEGALITAS:  bappebti.go.id', 540, 1238, { size: 38, weight: 800, color: C.white, alpha: kp, scale: lerp(1.2, 1, eBack(kp)) });
    }
  }

  function sFlags(c, lt) {
    txt(c, 'IMING-IMING MANIS', 540, 300, { size: 92, weight: 900, color: C.yellow, glow: 'rgba(255,214,10,.5)', blur: 25, maxW: 900 });
    const cards = [['PROFIT PASTI', '30% / BULAN'], ['ROBOT TRADING', 'ANTI-LOSS'], ['SINYAL VIP', 'AUTO CUAN']];
    cards.forEach(([l1, l2], i) => {
      const ta = 0.3 + 1.5 * i, a = p(lt, ta, ta + 0.35); if (a <= 0) return;
      const sk = p(lt, ta + 0.8, ta + 1.1), yc = 480 + 240 * i, dx = 800 * (1 - eOut(a));
      const sh = sk > 0 && sk < 1 ? Math.sin(lt * 80) * 10 * (1 - sk) : 0;
      c.save(); c.translate(dx + sh, 0);
      rrect(c, 100, yc - 95, 880, 190, 30, sk > 0 ? '#2a0b12' : '#0d2a1f', sk > 0 ? C.red : C.green, 4);
      c.restore();
      const col2 = sk > 0 ? '#8c4a55' : C.green;
      txt(c, l1, 150 + dx + sh, yc - 38, { size: 42, ls: 3, color: sk > 0 ? '#8a8f9c' : C.white, align: 'left' });
      txt(c, l2, 150 + dx + sh, yc + 30, { size: 74, weight: 900, color: col2, align: 'left', maxW: 560 });
      if (sk > 0) {
        c.save(); c.strokeStyle = C.red; c.lineWidth = 8;
        c.beginPath(); c.moveTo(140 + dx, yc + 30); c.lineTo(lerp(140, 700, eOut(sk)) + dx, yc + 30); c.stroke(); c.restore();
      } else if (a >= 1) {
        // sparkle
        for (let s = 0; s < 3; s++) {
          const ph = (lt * 2 + s * 0.33) % 1, sx = 800 + s * 50, sy = yc - 40 + s * 30;
          c.save(); c.globalAlpha = Math.sin(ph * Math.PI); c.fillStyle = C.green;
          c.translate(sx, sy); c.rotate(Math.PI / 4); c.fillRect(-7, -7, 14, 14); c.restore();
        }
      }
      stamp(c, 'RED FLAG', 790, yc, sk, { size: 54, rot: -0.16 });
    });
  }

  function sPsy(c, lt) {
    txt(c, 'LINGKARAN SETAN', 540, 300, { size: 100, weight: 900, color: C.red, glow: C.red, blur: 25, maxW: 920 });
    const cx = 540, cy = 800, R = 300;
    const nodes = [
      { a: -Math.PI / 2, l: ['RUGI'], col: C.red },
      { a: 0, l: ['BALAS', 'DENDAM'], col: C.yellow },
      { a: Math.PI / 2, l: ['LOT', 'DIGEDEIN'], col: C.yellow },
      { a: Math.PI, l: ['RUGI', 'MAKIN BESAR'], col: C.red },
    ];
    c.save(); c.globalAlpha = p(lt, 0, 0.4) * 0.5; c.setLineDash([6, 14]); c.strokeStyle = C.grey; c.lineWidth = 3;
    c.beginPath(); c.arc(cx, cy, R, 0, 7); c.stroke(); c.restore();
    // arrows
    for (let i = 0; i < 4; i++) {
      const tStart = 0.3 + 0.6 * ((i + 1) % 4 === 0 ? 3.5 : i + 1) - 0.25, k = eOut(p(lt, tStart, tStart + 0.4));
      if (k <= 0) continue;
      const a0 = nodes[i].a + 0.42, a1 = a0 + (Math.PI / 2 - 0.84) * k;
      c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = 6; c.beginPath(); c.arc(cx, cy, R, a0, a1); c.stroke();
      const hx = cx + R * Math.cos(a1), hy = cy + R * Math.sin(a1), dir = a1 + Math.PI / 2;
      c.save(); c.translate(hx, hy); c.rotate(dir); c.fillStyle = 'rgba(255,255,255,.85)';
      c.beginPath(); c.moveTo(14, 0); c.lineTo(-10, -13); c.lineTo(-10, 13); c.closePath(); c.fill(); c.restore();
    }
    // traveler
    let theta = null;
    if (lt > 2.6) {
      const x = lt - 2.6;
      theta = -Math.PI / 2 + 2 * Math.PI * (0.3 * x + 0.22 * x * x);
      for (let s = 12; s >= 0; s--) {
        const x2 = Math.max(0, x - s * 0.018), th = -Math.PI / 2 + 2 * Math.PI * (0.3 * x2 + 0.22 * x2 * x2);
        c.save(); c.globalAlpha = (1 - s / 13) * 0.9; c.fillStyle = C.red; c.shadowColor = C.red; c.shadowBlur = 20;
        c.beginPath(); c.arc(cx + R * Math.cos(th), cy + R * Math.sin(th), 16 * (1 - s / 16), 0, 7); c.fill(); c.restore();
      }
    }
    nodes.forEach((n, i) => {
      const k = p(lt, 0.3 + 0.6 * i, 0.3 + 0.6 * i + 0.35); if (k <= 0) return;
      const x = cx + R * Math.cos(n.a), y = cy + R * Math.sin(n.a), s = eBack(k);
      let hot = 0;
      if (theta !== null) { let d = Math.abs(((theta - n.a) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI); hot = clamp(1 - d / 0.5); }
      const h = n.l.length === 1 ? 92 : 128, w = 250;
      c.save(); c.translate(x, y); c.scale(s * (1 + hot * 0.08), s * (1 + hot * 0.08));
      rrect(c, -w / 2, -h / 2, w, h, 24, hot > 0 ? mixHex('#151821', '#4a0c18', hot) : '#151821', n.col, 4);
      c.restore();
      n.l.forEach((ln, j) => txt(c, ln, x, y + (n.l.length === 1 ? 2 : (j - 0.5) * 50), { size: 38, weight: 900, color: n.col, scale: s * (1 + hot * 0.08), maxW: 225 }));
    });
    const ke = p(lt, 3.2, 3.5);
    if (ke > 0) {
      const beat = 1 + 0.07 * Math.pow(Math.max(0, Math.sin(lt * 9)), 8);
      txt(c, 'EMOSI', cx, cy - 10, { size: 88, maxW: 300, weight: 900, color: C.white, scale: lerp(1.6, 1, eOut(ke)) * beat, alpha: ke, glow: C.red, blur: 30 });
      txt(c, 'musuh terbesarmu', cx, cy + 60, { size: 30, weight: 600, color: C.grey, alpha: ke });
    }
  }

  function sCost(c, lt) {
    txt(c, 'BIAYA TERSEMBUNYI', 540, 300, { size: 90, weight: 900, color: C.yellow, maxW: 920 });
    const rows = [
      ['SPREAD', 'selisih harga beli & jual', '−Rp15rb'],
      ['SWAP', 'biaya inap posisi tiap malam', '−Rp8rb'],
      ['KOMISI', 'dipotong tiap transaksi', '−Rp35rb'],
      ['SLIPPAGE', 'harga meleset saat eksekusi', '−Rp20rb'],
    ];
    let hit = 0;
    rows.forEach(([n, d, v], i) => {
      const ta = 0.3 + 0.8 * i, a = p(lt, ta, ta + 0.3); hit += eOut(a); if (a <= 0) return;
      const y = 450 + 140 * i, dx = 300 * (1 - eOut(a));
      c.save(); c.globalAlpha = a; rrect(c, 90 + dx, y - 58, 900, 116, 24, C.panel, '#232837', 3); c.restore();
      txt(c, n, 130 + dx, y - 16, { size: 46, weight: 900, align: 'left', alpha: a });
      txt(c, d, 130 + dx, y + 30, { size: 28, weight: 500, color: C.grey, align: 'left', alpha: a });
      txt(c, v, 955 + dx, y, { size: 48, weight: 900, color: C.red, align: 'right', alpha: a, scale: lerp(1.4, 1, eOut(p(lt, ta + 0.1, ta + 0.35))) });
    });
    const f = 1 - 0.04 * hit - 0.012 * Math.max(0, lt - 0.3);
    txt(c, 'MODAL', 130, 1070, { size: 32, ls: 6, color: C.grey, align: 'left' });
    txt(c, `${Math.round(f * 100)}%`, 950, 1070, { size: 44, weight: 900, color: mixHex(C.white, C.red, clamp((1 - f) * 3)), align: 'right' });
    rrect(c, 130, 1110, 820, 40, 20, '#1d212b');
    rrect(c, 130, 1110, 820 * f, 40, 20, mixHex(C.yellow, C.red, clamp((1 - f) * 4)));
    txt(c, '*angka ilustrasi', 540, 1200, { size: 24, weight: 500, color: C.grey });
  }

  function sCheck(c, lt) {
    const k = p(lt, 0, 0.25);
    txt(c, 'KALAU TETAP MAU COBA:', 540, 300, { size: 76, weight: 900, color: C.green, scale: lerp(1.4, 1, eOut(k)), alpha: clamp(k * 3), maxW: 920 });
    const items = [
      ['Latihan di akun DEMO', 'sampai paham & konsisten'],
      ['Broker resmi Bappebti', 'cek dulu di bappebti.go.id'],
      ['Pakai uang dingin', 'siap kalau hilang 100%'],
      ['Selalu pasang stop loss', 'tentukan batas rugi sebelum entry'],
      ['Risiko maks 1–2% per posisi', 'dihitung dari total modal'],
    ];
    items.forEach(([a1, a2], i) => {
      const ta = CHECK_T[i] - 41.5, a = p(lt, ta, ta + 0.3); if (a <= 0) return;
      const y = 450 + 150 * i, dx = -200 * (1 - eOut(a));
      const newest = i === items.length - 1 ? 1 : 1 - p(lt, CHECK_T[i + 1] - 41.5, CHECK_T[i + 1] - 41.5 + 0.3);
      c.save(); c.globalAlpha = a;
      rrect(c, 90 + dx, y - 62, 900, 124, 24, mixHex('#10131a', '#0c2a1f', newest), newest > 0.5 ? C.green : '#23303a', 3);
      rrect(c, 120 + dx, y - 35, 70, 70, 16, null, C.green, 5);
      const ck = eOut(p(lt, ta + 0.15, ta + 0.45));
      if (ck > 0) {
        const P = [[135, y + 2], [150, y + 18], [176, y - 16]];
        c.strokeStyle = C.green; c.lineWidth = 9; c.lineCap = 'round'; c.lineJoin = 'round';
        c.beginPath(); c.moveTo(P[0][0] + dx, P[0][1]);
        const seg1 = clamp(ck * 2), seg2 = clamp(ck * 2 - 1);
        c.lineTo(lerp(P[0][0], P[1][0], seg1) + dx, lerp(P[0][1], P[1][1], seg1));
        if (seg2 > 0) c.lineTo(lerp(P[1][0], P[2][0], seg2) + dx, lerp(P[1][1], P[2][1], seg2));
        c.stroke();
      }
      c.restore();
      txt(c, a1, 225 + dx, y - 16, { size: 46, weight: 900, align: 'left', alpha: a, maxW: 740 });
      txt(c, a2, 225 + dx, y + 32, { size: 29, weight: 500, color: C.grey, align: 'left', alpha: a, maxW: 740 });
    });
  }

  function sOutro(c, lt) {
    const fade = 1 - p(lt, 2.9, 3.4);
    const loop = eOut(p(lt, 2.3, 3.5));
    if (loop > 0) { drawHookChart(c, 22 * loop, 0, loop); tag(c, 'SISI GELAP TRADING FOREX', 250, C.red, p(lt, 3.0, 3.4)); }
    c.save(); c.globalAlpha = fade;
    txt(c, 'TRADING ITU', 540, 560, { size: 80, ls: 6, alpha: p(lt, 0, 0.15) });
    const k1 = p(lt, 0.15, 0.32), k2 = p(lt, 0.35, 0.52);
    if (k1 > 0) txt(c, 'BUKAN JALAN', 540, 715, { size: 145, weight: 900, scale: lerp(2, 1, eOut(k1)), alpha: clamp(k1 * 3), stroke: '#000', sw: 12 });
    if (k2 > 0) txt(c, 'PINTAS KAYA.', 540, 875, { size: 145, weight: 900, color: C.yellow, scale: lerp(2, 1, eOut(k2)), alpha: clamp(k2 * 3), glow: 'rgba(255,214,10,.6)', blur: 35, stroke: '#000', sw: 12 });
    txt(c, 'Belajar dulu. Jangan cuma coba-coba.', 540, 1025, { size: 44, weight: 700, color: '#d5d9e2', alpha: p(lt, 1.3, 1.6) });
    txt(c, 'Konten edukasi, bukan ajakan atau saran investasi.', 540, 1225, { size: 26, weight: 500, color: C.grey, alpha: p(lt, 1.6, 1.9) });
    c.restore();
  }

  // ---------- captions ----------
  function drawCaptions(c, t) {
    const cap = CAPTIONS.find(k => t >= k.t0 && t < k.t1); if (!cap) return;
    let cur = 0; cap.times.forEach((tt, i) => { if (t >= tt) cur = i; });
    const g = cap.groups.find(gr => gr.includes(cur));
    const gStart = cap.times[g[0]], pop = eBack(p(t, gStart, gStart + 0.14));
    c.save();
    c.font = '900 72px NS';
    const words = g.map(i => cap.words[i]);
    const sp = 26, widths = words.map((w, j) => c.measureText(w).width * (g[j] === cur ? 1.12 : 1));
    let total = widths.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
    const fit = Math.min(1, 900 / total);
    c.translate(540, 1335); c.scale(fit * lerp(0.85, 1, pop), fit * lerp(0.85, 1, pop));
    let x = -total / 2;
    words.forEach((w, j) => {
      const idx = g[j], active = idx === cur, wp = active ? eBack(p(t, cap.times[idx], cap.times[idx] + 0.12)) : 1;
      c.save(); c.translate(x + widths[j] / 2, 0); const s = active ? lerp(1, 1.12, wp) : 1; c.scale(s, s);
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.lineJoin = 'round'; c.lineWidth = 14; c.strokeStyle = '#000'; c.strokeText(w, 0, 0);
      c.fillStyle = active ? C.yellow : C.white; c.fillText(w, 0, 0);
      c.restore();
      x += widths[j] + sp;
    });
    c.restore();
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

  function render(main, t) {
    if (!buf) init();
    const scene = SCENES.find(s => t >= s.t0 && t < s.t1) || SCENES[SCENES.length - 1];
    const lt = t - scene.t0, c = bctx;
    // background
    c.save(); c.globalAlpha = 1; c.fillStyle = C.bg; c.fillRect(0, 0, W, H);
    let accent = scene.accent; if (scene.id === 'hook' && lt < 0.62) accent = C.green;
    const rg = c.createRadialGradient(540, 700, 50, 540, 700, 1100);
    rg.addColorStop(0, accent + '33'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = rg; c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(255,255,255,0.045)'; c.lineWidth = 2;
    const off = (t * 25) % 90;
    for (let x = 0; x <= W; x += 90) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    for (let y = -90 + off; y <= H; y += 90) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    c.restore();
    c.save(); scene.draw(c, lt, t); c.restore();
    c.save(); drawCaptions(c, t); c.restore();

    // camera shake / punch
    const A = sumEnv(t, EV.boom.map(([a, s]) => [a, s * 1.3]), 9) + sumEnv(t, EV.hit, 10) + sumEnv(t, EV.stamp, 10);
    const dx = A * 26 * Math.sin(t * 91 + 1), dy = A * 20 * Math.cos(t * 77);
    const zs = 1 + 0.035 * Math.min(A, 1.5);
    main.save();
    main.fillStyle = C.bg; main.fillRect(0, 0, W, H);
    main.translate(W / 2 + dx, H / 2 + dy); main.scale(zs, zs); main.drawImage(buf, -W / 2, -H / 2);
    main.restore();
    // glitch on cuts and booms
    let g = 0;
    SCENES.slice(1).forEach(s => { const d = Math.abs(t - s.t0); if (d < 0.15) g = Math.max(g, 1 - d / 0.15); });
    EV.boom.forEach(([b]) => { if (t >= b && t - b < 0.22) g = Math.max(g, 1 - (t - b) / 0.22); });
    if (g > 0) {
      const r = rng(Math.floor(t * FPS) * 13 + 7), n = Math.ceil(8 * g);
      for (let i = 0; i < n; i++) {
        const y = r() * H, h = 20 + r() * 140, sx = (r() - 0.5) * 160 * g;
        main.drawImage(buf, 0, y, W, h, sx, y, W, h);
      }
      main.save(); main.globalCompositeOperation = 'screen';
      for (let i = 0; i < n; i++) {
        main.fillStyle = i % 2 ? `rgba(255,30,70,${0.35 * g})` : `rgba(0,230,255,${0.25 * g})`;
        main.fillRect(r() * W * 0.6, r() * H, 100 + r() * 600, 6 + r() * 30);
      }
      main.restore();
    }
    // flashes
    const fw = sumEnv(t, EV.hit.map(([a]) => [a, 0.28]), 22, 0.3);
    const fr = sumEnv(t, EV.boom.map(([a]) => [a, 0.4]), 14, 0.4) + sumEnv(t, EV.stamp.map(([a]) => [a, 0.2]), 18, 0.3);
    if (fw > 0.005) { main.fillStyle = `rgba(255,255,255,${Math.min(0.5, fw)})`; main.fillRect(0, 0, W, H); }
    if (fr > 0.005) { main.fillStyle = `rgba(255,20,50,${Math.min(0.5, fr)})`; main.fillRect(0, 0, W, H); }
    // vignette + grain
    const vg = main.createRadialGradient(540, 960, 500, 540, 960, 1250);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.65)');
    main.fillStyle = vg; main.fillRect(0, 0, W, H);
    main.save(); main.globalAlpha = 0.06; main.globalCompositeOperation = 'overlay';
    main.drawImage(noise[Math.floor(t * FPS) % 4], 0, 0, W, H); main.restore();
  }

  // ---------- audio (deterministic synthesis, 48 kHz stereo) ----------
  function synthAudio(sr = 48000) {
    const N = Math.ceil(DURATION * sr), L = new Float32Array(N), Rr = new Float32Array(N), r = rng(5);
    const add = (i, v, pan = 0) => { if (i >= 0 && i < N) { L[i] += v * (1 - pan * 0.5); Rr[i] += v * (1 + pan * 0.5); } };
    // drone + filtered noise
    let lp = 0;
    for (let i = 0; i < N; i++) {
      const t = i / sr, lfo = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.18 * t);
      const tens = t > 41.5 && t < 51.5 ? 0.6 : 1;
      const d = 0.07 * Math.sin(2 * Math.PI * 55 * t) + 0.045 * Math.sin(2 * Math.PI * 55.6 * t + 1) + 0.025 * lfo * Math.sin(2 * Math.PI * 110.4 * t) + 0.012 * Math.sin(2 * Math.PI * 164.8 * t) * lfo;
      lp += 0.02 * ((r() * 2 - 1) - lp);
      const v = (d + lp * 0.12) * tens;
      L[i] += v * (1 + 0.15 * Math.sin(t * 0.7)); Rr[i] += v * (1 - 0.15 * Math.sin(t * 0.7));
    }
    const kick = (t0, g) => { const s0 = Math.floor(t0 * sr); let ph = 0; for (let j = 0; j < sr * 0.35; j++) { const tt = j / sr; ph += 2 * Math.PI * (48 + 110 * Math.exp(-tt * 35)) / sr; add(s0 + j, Math.sin(ph) * Math.exp(-tt * 9) * g); } };
    for (let t = EV.kick[0]; t < EV.kick[1]; t += EV.kick[2]) kick(t, t > 41.5 ? 0.18 : 0.28);
    EV.boom.forEach(([t0, s]) => {
      const s0 = Math.floor(t0 * sr); let ph = 0, n = 0;
      for (let j = 0; j < sr * 1.6; j++) {
        const tt = j / sr; ph += 2 * Math.PI * (32 + 90 * Math.exp(-tt * 6)) / sr; n += 0.15 * ((r() * 2 - 1) - n);
        add(s0 + j, (Math.sin(ph) * Math.exp(-tt * 2.6) * 0.75 + n * Math.exp(-tt * 10) * 1.2) * s);
      }
    });
    EV.hit.forEach(([t0, s]) => {
      const s0 = Math.floor(t0 * sr); let ph = 0, n = 0;
      for (let j = 0; j < sr * 0.7; j++) { const tt = j / sr; ph += 2 * Math.PI * (45 + 80 * Math.exp(-tt * 18)) / sr; n += 0.3 * ((r() * 2 - 1) - n); add(s0 + j, (Math.sin(ph) * Math.exp(-tt * 5) * 0.55 + n * Math.exp(-tt * 25) * 0.6) * s); }
    });
    EV.stamp.forEach(([t0, s]) => {
      const s0 = Math.floor(t0 * sr); let n = 0, ph = 0;
      for (let j = 0; j < sr * 0.5; j++) { const tt = j / sr; n += 0.5 * ((r() * 2 - 1) - n); ph += 2 * Math.PI * (70 + 60 * Math.exp(-tt * 20)) / sr; add(s0 + j, (n * Math.exp(-tt * 30) * 0.9 + Math.sin(ph) * Math.exp(-tt * 8) * 0.5) * s); }
    });
    EV.whoosh.forEach(t1 => {
      const len = 0.35, s0 = Math.floor((t1 - len) * sr); let n = 0, prev = 0;
      for (let j = 0; j < sr * len; j++) { const x = j / (sr * len), w = r() * 2 - 1; n += (0.05 + 0.5 * x) * (w - n); const hp = n - prev; prev = n; add(s0 + j, hp * Math.pow(x, 2) * 0.9, Math.sin(x * 3)); }
    });
    EV.alert.forEach(t0 => {
      [[880, 0], [660, 0.13]].forEach(([f, o]) => { const s0 = Math.floor((t0 + o) * sr); for (let j = 0; j < sr * 0.12; j++) { const tt = j / sr; add(s0 + j, Math.sign(Math.sin(2 * Math.PI * f * tt)) * 0.06 * Math.min(1, tt * 200) * Math.exp(-tt * 10)); } });
    });
    EV.ding.forEach((t0, i) => {
      const s0 = Math.floor(t0 * sr), f = 880 * Math.pow(2, [0, 2, 4, 7, 9][i] / 12);
      for (let j = 0; j < sr * 0.6; j++) { const tt = j / sr; add(s0 + j, (Math.sin(2 * Math.PI * f * tt) + 0.4 * Math.sin(2 * Math.PI * f * 1.5 * tt)) * 0.12 * Math.exp(-tt * 6), 0.2); }
    });
    EV.blip.forEach(t0 => { const s0 = Math.floor(t0 * sr); for (let j = 0; j < sr * 0.09; j++) { const tt = j / sr; add(s0 + j, Math.sin(2 * Math.PI * (1200 - 4000 * tt) * tt) * 0.1 * Math.exp(-tt * 30)); } });
    EV.ticks.forEach(([a, b, step]) => {
      for (let t0 = a; t0 < b; t0 += step) { const s0 = Math.floor(t0 * sr); for (let j = 0; j < sr * 0.012; j++) { const tt = j / sr; add(s0 + j, Math.sin(2 * Math.PI * 2600 * tt) * 0.07 * Math.exp(-tt * 400), (r() - 0.5)); } }
    });
    EV.riser.forEach(([a, b]) => {
      const s0 = Math.floor(a * sr), len = (b - a) * sr; let ph = 0, n = 0;
      for (let j = 0; j < len; j++) { const x = j / len; ph += 2 * Math.PI * (200 + 900 * x * x) / sr; n += 0.3 * ((r() * 2 - 1) - n); add(s0 + j, (Math.sin(ph) * 0.05 + n * 0.12) * x * x); }
    });
    if (window.VO_DATA) {
      // place each VO line at its slot; duck the music/SFX bed under the voice
      const V = new Float32Array(N), act = new Uint8Array(N);
      window.VO_LINES.forEach((ln, li) => {
        const d = window.VO_DATA[li]; if (!d) return;
        const bin = atob(d.b64), pcm = new Int16Array(bin.length >> 1);
        for (let k = 0; k < pcm.length; k++) pcm[k] = (bin.charCodeAt(2 * k) | (bin.charCodeAt(2 * k + 1) << 8)) << 16 >> 16;
        const ratio = d.sr / sr, s0 = Math.floor(ln.t0 * sr), len = Math.floor(pcm.length / ratio);
        for (let j = 0; j < len && s0 + j < N; j++) {
          const x = j * ratio, k = Math.floor(x), f = x - k;
          V[s0 + j] = (pcm[k] * (1 - f) + (pcm[Math.min(k + 1, pcm.length - 1)] || 0) * f) / 32768;
          act[s0 + j] = 1;
        }
      });
      // smoothing low-pass only for the low-rate espeak voice; full-band TTS passes through
      const smooth = window.VO_DATA.some(d => d && d.sr <= 16000);
      let lp1 = 0, lp2 = 0, peak = 1e-6;
      for (let i = 0; i < N; i++) {
        if (smooth) { lp1 += 0.55 * (V[i] - lp1); lp2 += 0.55 * (lp1 - lp2); V[i] = lp2; }
        peak = Math.max(peak, Math.abs(V[i]));
      }
      const vg = 0.95 / peak; let duck = 1;
      for (let i = 0; i < N; i++) {
        const target = act[Math.min(N - 1, i + Math.floor(sr * 0.04))] ? 0.38 : 1;
        duck += (target < duck ? 0.0008 : 0.00012) * (target - duck);
        const v = V[i] * vg;
        L[i] = L[i] * duck + v; Rr[i] = Rr[i] * duck + v;
      }
    }
    for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i] * 1.3) * 0.88; Rr[i] = Math.tanh(Rr[i] * 1.3) * 0.88; }
    return { sr, L, R: Rr };
  }

  window.COMP = { W, H, FPS, DURATION, render, synthAudio };
})();
