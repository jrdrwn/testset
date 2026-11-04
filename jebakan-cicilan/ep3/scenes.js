// Jebakan Cicilan — EP 3/3: Jalan Keluar (80 dtk). Waktu animasi = waktu kata di vo/plan.json.
window.makeScenes = function (K) {
  const { C, p, eOut, eBack, clamp, lerp, txt, rrect, stamp, card, rp } = K;
  const P = window.makePeople(K), { person, room, nightTint, cam, phone, bubble, appIcon } = P;
  const LIST = [['PayKu', 1.2e6, true], ['CicilIn', 0.9e6, true], ['LaterYuk', 0.8e6, false], ['DanaKilat', 1.6e6, false],
    ['UangCepat', 1.5e6, false], ['PinjamYuk', 1.6e6, false], ['KasCair', 1.4e6, false]];

  function door(c, t, open) {
    rrect(c, 820, 470, 230, 660, 8, '#6e5236');
    if (open > 0) { c.fillStyle = `rgba(255,230,170,${0.6 * open})`; c.fillRect(830, 480, 210 * open, 650); }
    rrect(c, 830 + 160 * open, 480, 210 - 160 * open, 650, 6, '#8a6a48');
    c.fillStyle = '#d9b26a'; c.beginPath(); c.arc(1000 - 140 * open, 820, 12, 0, Math.PI * 2); c.fill();
  }
  // 0–3.7 ponsel bergetar, pintu diketuk (@2.6)
  function sKetuk(c, lt, t) {
    room(c, 'gelap', t, { night: true }); nightTint(c, 1.3);
    const knock = t > 2.6 && t < 3.3 ? Math.sin(t * 50) * 6 : 0;
    c.save(); c.translate(knock, 0); door(c, t, 0); c.restore();
    person(c, 'dimas', 420, 1140, 1.1, t, { pose: 'phone', mood: 'sad', shake: t < 1.6 ? 2 : 0 });
    if (t > 2.6) txt(c, 'tok tok', 900, 400, { size: 48, color: '#f4ead6', font: 'body', alpha: p(t, 2.6, 2.8) });
    P.seriesBadge(c, t, 3.7);
  }
  // 3.7–14.7 Rani masuk, ajak cerita
  function sRani(c, lt, t) {
    room(c, 'kamar', t, { night: true }); nightTint(c, 0.7);
    door(c, t, 1);
    const close = t >= 7.1 && t < 10.7;
    c.save();
    if (close) { c.translate(330, 800); c.scale(1.3, 1.3); c.translate(-330, -800); } else cam(c, lt, 11, 0.04);
    person(c, 'dimas', 330, 1140, 1.05, t, { pose: t < 10.7 ? 'head' : 'stand', mood: t < 10.7 ? 'sad' : 'worried', look: 1 });
    const enter = eOut(p(t, 3.7, 4.4));
    person(c, 'rani', lerp(1000, 760, enter), 1140, 1.0, t, { flip: true, pose: t >= 10.8 ? 'point' : 'open', mood: t >= 11.9 ? 'happy' : 'worried', look: 1 });
    c.restore();
    if (t >= 11.9) { const k = p(t, 12.2, 12.5); card(c, 240, 250, 600, 120, { alpha: k }); txt(c, 'Tulis semua utangnya', 540, 312, { size: 46, alpha: k }); }
  }
  // 14.7–22.7 daftar utang: total 9 jt (@17.8), 5 tidak terdaftar OJK (@20.6)
  function sDaftar(c, lt, t) {
    room(c, 'kamar', t, { night: true }); nightTint(c, 0.5);
    rrect(c, 120, 200, 840, 1000, 24, '#fbf7ee'); c.fillStyle = 'rgba(80,120,200,0.18)'; for (let y = 300; y < 1180; y += 100) c.fillRect(140, y, 800, 3);
    c.fillStyle = 'rgba(193,18,31,0.4)'; c.fillRect(220, 220, 4, 960);
    txt(c, 'DAFTAR UTANG', 560, 262, { size: 44 });
    LIST.forEach(([n, v, legal], i) => {
      const k = p(t, 15.7 + i * 0.12, 16.0 + i * 0.12); if (k <= 0) return;
      const y = 350 + i * 100;
      txt(c, `${i + 1}. ${n}`, 250, y, { size: 34, align: 'left', font: 'body', alpha: k });
      txt(c, rp(v), 705, y, { size: 32, align: 'right', font: 'body', alpha: k });
      const m = p(t, 20.4 + i * 0.1, 20.7 + i * 0.1);
      if (m > 0) { rrect(c, 730, y - 26, 190, 52, 26, legal ? C.good : C.accent); txt(c, legal ? 'OJK ✓' : 'ILEGAL', 825, y + 1, { size: 26, color: '#fff', font: 'body', alpha: m }); }
    });
    const kt = p(t, 17.6, 17.9);
    if (kt > 0) { c.fillStyle = C.text; c.fillRect(250, 1050, 660, 4); txt(c, 'TOTAL', 250, 1110, { size: 40, align: 'left', alpha: kt }); K.counter(c, 0, 9e6, p(t, 17.8, 18.4), 680, 1110, { size: 44, align: 'right', color: C.accent, format: rp }); }
  }
  // 22.7–27.5 Rani: laporkan yang ilegal (@23.7), melanggar hukum (@26.1)
  function sLapor(c, lt, t) {
    room(c, 'kamar', t, { night: true }); nightTint(c, 0.4);
    c.save(); cam(c, lt, 4.8, 0.05);
    person(c, 'rani', 640, 1140, 1.1, t, { pose: 'point', mood: 'neutral', flip: true });
    c.restore();
    const k1 = p(t, 23.7, 24.0), k2 = p(t, 26.1, 26.4);
    if (k1 > 0) { card(c, 90, 250, 560, 120, { alpha: k1 }); txt(c, 'Yang ilegal: LAPORKAN', 370, 312, { size: 40, alpha: k1, color: C.accent, maxW: 520 }); }
    if (k2 > 0) { card(c, 90, 400, 560, 160, { alpha: k2 }); txt(c, 'Ancaman & sebar data', 370, 455, { size: 36, alpha: k2, maxW: 520 }); txt(c, '= melanggar hukum', 370, 510, { size: 36, alpha: k2, color: C.accent }); }
  }
  // 27.5–32 lapor ke Kontak OJK 157 (@29.4) dan Satgas PASTI (@30.7)
  function sOjk(c, lt, t) {
    room(c, 'kamar', t);
    c.save(); cam(c, lt, 4.5, 0.04);
    person(c, 'dimas', 330, 1140, 1.05, t, { pose: 'phone', mood: 'neutral' });
    c.restore();
    const k1 = p(t, 28.5, 28.8), k2 = p(t, 30.7, 31.0);
    if (k1 > 0) { card(c, 560, 300, 440, 200, { alpha: k1 }); txt(c, 'Kontak OJK', 780, 365, { size: 40, alpha: k1, font: 'body' }); txt(c, '157', 780, 445, { size: 90, alpha: p(t, 29.4, 29.7), color: C.good }); }
    if (k2 > 0) { card(c, 560, 540, 440, 170, { alpha: k2 }); txt(c, 'Satgas PASTI', 780, 600, { size: 44, alpha: k2 }); txt(c, 'aktivitas keuangan ilegal', 780, 655, { size: 26, alpha: k2, font: 'body', color: C.muted }); }
  }
  // 32–36.1 blokir nomor (@33.6), simpan bukti chat (@34.4)
  function sBlokir(c, lt, t) {
    room(c, 'kamar', t);
    phone(c, 540, 780, 640, 1060, t, (c, x, y, w, h) => {
      txt(c, 'Kontak', x + 40, y + 100, { size: 40, align: 'left', color: '#1d1d1f' });
      for (let i = 0; i < 4; i++) {
        const yy = y + 180 + i * 110, blocked = t >= 33.6 + i * 0.15;
        txt(c, `+62 8xx-xxxx-xx${10 + i * 7}`, x + 44, yy, { size: 30, align: 'left', font: 'body', color: '#333' });
        rrect(c, x + w - 220, yy - 30, 180, 60, 30, blocked ? '#c1121f' : '#e5e5ea'); txt(c, blocked ? 'Diblokir' : 'Blokir', x + w - 130, yy + 1, { size: 26, color: blocked ? '#fff' : '#333', font: 'body' });
      }
      const k = p(t, 34.4, 34.7);
      if (k > 0) {
        txt(c, 'Album: Bukti chat', x + 40, y + 680, { size: 32, align: 'left', alpha: k, color: '#1d1d1f' });
        for (let i = 0; i < 4; i++) { const kk = p(t, 34.6 + i * 0.15, 34.9 + i * 0.15); rrect(c, x + 40 + i * 140, y + 730, 120, 200, 12, `rgba(120,120,130,${0.5 * kk})`); }
      }
    });
  }
  // 36.1–44.5 hubungi layanan resmi, minta keringanan (@39.6), dijadwal ulang (@41.2)
  function sKeringanan(c, lt, t) {
    room(c, 'kamar', t);
    phone(c, 540, 780, 680, 1120, t, (c, x, y, w, h) => {
      c.fillStyle = '#eef3f2'; c.fillRect(x, y, w, h);
      rrect(c, x, y, w, 140, 0, '#2a9d8f'); txt(c, 'Layanan Pelanggan PayKu', x + 40, y + 85, { size: 32, align: 'left', color: '#fff' });
      let yy = y + 180;
      yy += bubble(c, x + w - 520, yy, 490, 'Saya kesulitan bayar. Bisa minta keringanan?', 'r', p(t, 37.8, 38.1), { size: 28 }) + 18;
      yy += bubble(c, x + 30, yy, 520, 'Bisa, Kak. Cicilan kami jadwal ulang jadi 6 bulan.', 'l', p(t, 40.6, 40.9), { size: 28 }) + 18;
      const k = p(t, 41.2, 41.5);
      if (k > 0) { rrect(c, x + 30, yy, w - 60, 170, 20, '#ffffff'); txt(c, `${rp(1200000)} → 6× ${rp(215000)}`, x + w / 2, yy + 65, { size: 36, color: '#1d1d1f', alpha: k, maxW: w - 100 }); txt(c, 'bisa dibayar ✓', x + w / 2, yy + 125, { size: 30, color: '#2a9d8f', font: 'body', alpha: p(t, 43.2, 43.5) }); }
    });
    txt(c, 'untuk yang resmi', 540, 200, { size: 36, font: 'body', color: C.muted, alpha: p(t, 36.3, 36.6) });
  }
  // 44.5–48.9 tutup akun paylater (@45.9), kecuali yang masih cicilan (@46.3)
  function sTutup(c, lt, t) {
    room(c, 'kamar', t);
    txt(c, 'TUTUP AKUN', 540, 260, { size: 60, alpha: p(t, 44.7, 45.0) });
    [['PayKu', '#e76f51', true], ['CicilIn', '#2a9d8f', true], ['LaterYuk', '#8e5bd1', false]].forEach(([n, col, keep], i) => {
      const x = 230 + i * 310;
      appIcon(c, x, 520, 200, n.slice(0, 1), col, p(t, 44.6 + i * 0.15, 44.9 + i * 0.15));
      txt(c, n, x, 670, { size: 34, font: 'body', alpha: p(t, 44.8, 45.0) });
      if (!keep) stamp(c, 'DITUTUP', x, 520, p(t, 45.9, 46.1), { size: 46 });
      else txt(c, 'cicilan jalan', x, 720, { size: 28, font: 'body', color: C.good, alpha: p(t, 46.3 + i * 0.2, 46.6 + i * 0.2) });
    });
    txt(c, '+ 4 aplikasi pinjol ilegal dihapus', 540, 860, { size: 36, font: 'body', color: C.muted, alpha: p(t, 46.9, 47.2) });
  }
  // 48.9–52.7 Dimas: gaji masuk, bagi dulu
  function sBagi(c, lt, t) {
    room(c, 'kamar', t);
    c.save(); cam(c, lt, 3.8, 0.05);
    person(c, 'dimas', 540, 1140, 1.12, t, { pose: 'open', mood: 'relief' });
    c.restore();
    const k = p(t, 49.7, 50.0);
    if (k > 0) { card(c, 230, 250, 620, 120, { alpha: k }); txt(c, 'Gaji masuk → BAGI DULU', 540, 312, { size: 44, alpha: k, color: C.good, maxW: 580 }); }
  }
  // 52.7–57.5 50/30/20
  function sBudget(c, lt, t) {
    room(c, 'kamar', t);
    txt(c, 'GAJI Rp5 JUTA', 540, 270, { size: 54 });
    [[52.8, 50, 'Kebutuhan', C.accent2, 2.5e6], [54.3, 30, 'Cicilan', C.accent, 1.5e6], [55.7, 20, 'Tabungan darurat', C.good, 1e6]].forEach(([tt, pc, n, col, v], i) => {
      const k = p(t, tt, tt + 0.5), y = 400 + i * 230;
      txt(c, `${pc}%  ${n}`, 140, y, { size: 44, align: 'left', alpha: p(t, tt, tt + 0.2) });
      txt(c, rp(v), 940, y, { size: 34, align: 'right', font: 'body', color: C.muted, alpha: p(t, tt, tt + 0.2) });
      rrect(c, 140, y + 40, 800, 54, 27, 'rgba(0,0,0,0.08)'); rrect(c, 140, y + 40, Math.max(54, 800 * (pc / 50) * eOut(k)), 54, 27, col);
    });
  }
  // 57.5–61.7 8 bulan (@58.0) sampai lunas (@59.4)
  function sLunas(c, lt, t) {
    room(c, 'kamar', t);
    txt(c, 'SISA UTANG', 540, 300, { size: 36, font: 'body', color: C.muted, ls: 4 });
    K.counter(c, 9e6, 0, p(t, 58.0, 59.4), 540, 400, { size: 96, color: t >= 59.4 ? C.good : C.accent, format: rp });
    for (let i = 0; i < 8; i++) {
      const k = p(t, 58.0 + i * 0.17, 58.2 + i * 0.17), x = 140 + i * 105;
      rrect(c, x, 560, 85, 85, 18, k > 0.5 ? C.good : 'rgba(0,0,0,0.08)');
      txt(c, String(i + 1), x + 42, 603, { size: 36, color: k > 0.5 ? '#fff' : C.muted });
    }
    txt(c, 'bulan', 540, 700, { size: 34, font: 'body', color: C.muted });
    stamp(c, 'LUNAS', 540, 900, p(t, 59.4, 59.65), { size: 120, color: C.good });
  }
  // 61.7–65 Ibu
  function sIbu(c, lt, t) {
    room(c, 'rumah', t);
    c.save(); cam(c, lt, 3.3, 0.05);
    person(c, 'dimas', 380, 1140, 1.05, t, { mood: 'relief', look: 1 });
    person(c, 'ibu', 720, 1140, 1.0, t, { pose: 'hug', mood: 'happy', flip: true, look: 1 });
    c.restore();
  }
  // 65–69.1 pelajaran
  function sPelajaran(c, lt, t) {
    room(c, 'rumah', t);
    c.save(); cam(c, lt, 4.1, 0.04);
    person(c, 'dimas', 380, 1140, 1.0, t, { mood: 'happy' });
    person(c, 'rani', 720, 1140, 0.95, t, { mood: 'happy', flip: true, pose: 'wave' });
    c.restore();
    const k = p(t, 66.3, 66.6);
    card(c, 120, 230, 840, 200, { alpha: k });
    txt(c, 'PAYLATER BUKAN', 540, 300, { size: 58, alpha: k });
    txt(c, 'UANG TAMBAHAN', 540, 370, { size: 58, alpha: p(t, 66.9, 67.2), color: C.accent });
  }
  // 69.1–74 kamu nggak sendirian (@71.2), tamat (@71.9)
  function sBersama(c, lt, t) {
    room(c, 'rumah', t);
    c.save(); cam(c, lt, 4.9, 0.05, 540, 900);
    person(c, 'rani', 270, 1140, 0.92, t, { mood: 'happy' });
    person(c, 'dimas', 540, 1140, 1.0, t, { mood: 'happy', pose: 'wave' });
    person(c, 'ibu', 810, 1140, 0.95, t, { mood: 'happy', flip: true });
    c.restore();
    const k = p(t, 70.8, 71.2);
    if (k > 0) { card(c, 150, 230, 780, 130, { alpha: k }); txt(c, 'Kamu nggak sendirian.', 540, 297, { size: 52, alpha: k }); }
  }
  function sEnd(c, lt) {
    P.endCard(c, lt, 'TAMAT', 'Kalau kamu terjerat:', { y0: 860, gap: 62, lines: ['1. Catat semua utang', '2. Cek legalitas di ojk.go.id', '3. Lapor yang ilegal: Kontak OJK 157', '4. Minta keringanan ke yang resmi'] });
  }

  const raw = [
    ['ketuk', 0, 3.7, sKetuk], ['rani', 3.7, 14.7, sRani], ['daftar', 14.7, 22.7, sDaftar], ['lapor', 22.7, 27.5, sLapor],
    ['ojk', 27.5, 32.0, sOjk], ['blokir', 32.0, 36.1, sBlokir], ['keringanan', 36.1, 44.5, sKeringanan], ['tutup', 44.5, 48.9, sTutup],
    ['bagi', 48.9, 52.7, sBagi], ['budget', 52.7, 57.5, sBudget], ['lunas', 57.5, 61.7, sLunas], ['ibu', 61.7, 65.0, sIbu],
    ['pelajaran', 65.0, 69.1, sPelajaran], ['bersama', 69.1, 74.0, sBersama], ['end', 74.0, 80.0, sEnd],
  ];
  const SCENES = raw.map(([id, t0, t1, f]) => ({ id, t0, t1, accent: C.good, draw: (c, lt, t) => { f(c, lt, t); if (id !== 'end') P.nameTag(c, t); } }));
  const EV = {
    hit: [[3.7, 0.2], [14.7, 0.2], [27.5, 0.2], [52.7, 0.2], [65.0, 0.2]],
    stamp: [[45.9, 0.3], [59.4, 0.4]],
    ding: [17.8, 29.4, 30.7, 41.2, 52.8, 54.3, 55.7, 59.4],
    blip: [15.7, 15.8, 15.9, 16.1, 16.2, 16.3, 16.4, 33.6, 33.75, 33.9, 34.05, 74.6, 74.85, 75.1, 75.35],
    riser: [[72.5, 74.0]],
  };
  return { SCENES, EV };
};
