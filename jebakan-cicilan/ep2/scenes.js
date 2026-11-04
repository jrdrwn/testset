// Jebakan Cicilan — EP 2/3: Gali Lubang (76 dtk). Waktu animasi = waktu kata di vo/plan.json.
window.makeScenes = function (K) {
  const { C, p, eOut, eBack, clamp, lerp, txt, rrect, stamp, card, rp } = K;
  const P = window.makePeople(K), { person, room, nightTint, cam, phone, bubble, appIcon } = P;
  const APPS = [['PayKu', '#e76f51'], ['CicilIn', '#2a9d8f'], ['LaterYuk', '#8e5bd1'], ['DanaKilat', '#c1121f'], ['UangCepat', '#d97706'], ['PinjamYuk', '#0f766e'], ['KasCair', '#7c3aed']];

  // 0–3.5 tombol ditekan (@1.1)
  function sTekan(c, lt, t) {
    room(c, 'kamar', t, { night: true }); nightTint(c, 1.2);
    const press = p(t, 1.0, 1.25);
    phone(c, 540, 800, 660, 1120, t, (c, x, y, w, h) => {
      c.fillStyle = '#fff6e0'; c.fillRect(x, y, w, h);
      txt(c, 'Cair 5 menit', x + w / 2, y + 300, { size: 56, color: '#1d1d1f' });
      const s = 1 - 0.08 * Math.sin(press * Math.PI);
      c.save(); c.translate(x + w / 2, y + 640); c.scale(s, s); rrect(c, -230, -60, 460, 120, 60, press > 0.5 ? '#7a0c14' : '#c1121f'); c.restore();
      txt(c, press > 0.5 ? 'MEMPROSES...' : 'AJUKAN SEKARANG', x + w / 2, y + 642, { size: 40, color: '#fff' });
    });
    const fy = lerp(1500, 1010, eOut(p(t, 0.2, 1.1))) + 20 * Math.sin(press * Math.PI);
    c.fillStyle = P.CAST.dimas.skin; c.beginPath(); c.roundRect(505, fy, 70, 420, 35); c.fill();
    P.seriesBadge(c, t, 3.5);
  }
  // 3.5–7.5 dana masuk 3 juta (@4.8)
  function sCair(c, lt, t) {
    room(c, 'kamar', t, { night: true }); nightTint(c, 0.8);
    phone(c, 540, 780, 640, 1040, t, (c, x, y, w, h) => {
      rrect(c, x, y, w, 160, 0, '#0f5132'); txt(c, 'Rekeningku', x + w / 2, y + 100, { size: 40, color: '#fff', font: 'body' });
      txt(c, 'Dana masuk', x + w / 2, y + 300, { size: 36, font: 'body', color: '#555', alpha: p(t, 4.3, 4.6) });
      K.counter(c, 0, 3e6, p(t, 4.8, 5.4), x + w / 2, y + 390, { size: 74, color: '#0f5132', format: v => '+' + rp(v) });
      txt(c, 'dari DanaKilat', x + w / 2, y + 470, { size: 30, font: 'body', color: '#888', alpha: p(t, 5.4, 5.7) });
    });
  }
  // 7.5–11 "aman, bayar paylater dulu"
  function sAman(c, lt, t) {
    room(c, 'kamar', t, { night: true }); nightTint(c, 0.6);
    c.save(); cam(c, lt, 3.5, 0.04);
    person(c, 'dimas', 560, 1140, 1.12, t, { pose: 'phone', mood: 'happy' });
    c.restore();
    const k = p(t, 8.3, 8.6);
    if (k > 0) { card(c, 230, 260, 620, 130, { alpha: k }); txt(c, 'Tagihan PayKu: LUNAS ✓', 540, 327, { size: 44, color: C.good, alpha: k }); }
  }
  // 11–18 syarat kecil: tenor 30 hari (@12.9), tidak terdaftar OJK (@15.3), ILEGAL (@15.9)
  function sSyarat(c, lt, t) {
    room(c, 'kamar', t, { night: true }); nightTint(c, 1);
    phone(c, 540, 780, 660, 1080, t, (c, x, y, w, h) => {
      txt(c, 'Syarat & Ketentuan', x + 40, y + 100, { size: 40, align: 'left', color: '#1d1d1f' });
      const rows = ['Pinjaman pokok Rp3.000.000', 'Tenor: 30 hari', 'Biaya layanan & bunga: Rp1.200.000', 'Denda keterlambatan per hari', 'Persetujuan akses kontak & galeri'];
      rows.forEach((r, i) => {
        const hl = (i === 1 && t >= 12.9) || (i === 2 && t >= 13.5) || (i === 4 && t >= 16.4);
        if (hl) rrect(c, x + 24, y + 170 + i * 90, w - 48, 70, 14, 'rgba(193,18,31,0.15)');
        txt(c, r, x + 44, y + 205 + i * 90, { size: 28, align: 'left', font: 'body', color: hl ? '#c1121f' : '#666', maxW: w - 90 });
      });
      const k = p(t, 15.3, 15.6);
      if (k > 0) { rrect(c, x + 40, y + 700, w - 80, 120, 20, '#fde2e1'); txt(c, 'Tidak terdaftar di OJK', x + w / 2, y + 760, { size: 38, color: '#c1121f', alpha: k }); }
    });
    stamp(c, 'ILEGAL', 760, 1100, p(t, 15.9, 16.15), { size: 90, color: C.accent });
    txt(c, 'yang nggak dia baca', 540, 230, { size: 40, font: 'body', color: '#f4ead6', alpha: p(t, 11.6, 11.9) * (1 - p(t, 15.7, 15.9)) });
  }
  // 18–22.3 hari ke-30, tagihan jadi 4,2 juta (@19.9)
  function sBengkak(c, lt, t) {
    room(c, 'kamar', t);
    card(c, 290, 280, 500, 300, {}); rrect(c, 290, 280, 500, 90, 30, C.accent);
    txt(c, 'HARI KE-', 540, 326, { size: 36, color: '#fff', font: 'body', ls: 4 });
    txt(c, String(Math.round(lerp(1, 30, eOut(p(t, 18.0, 18.8))))), 540, 480, { size: 150, color: C.accent });
    card(c, 160, 680, 760, 260, {});
    txt(c, 'TAGIHAN DANAKILAT', 540, 750, { size: 32, font: 'body', color: C.muted, ls: 4 });
    K.counter(c, 3e6, 4.2e6, p(t, 19.6, 20.4), 540, 850, { size: 90, color: C.accent, format: rp });
    txt(c, 'dari pinjaman Rp3 juta', 540, 1010, { size: 34, font: 'body', color: C.muted, alpha: p(t, 20.6, 20.9) });
  }
  // 22.3–30 gali lubang tutup lubang: pinjam lagi (@23.8), gali (@26.2), tutup (@26.9), makin dalam (@28.3)
  function sLubang(c, lt, t) {
    room(c, 'kamar', t);
    const depth = 40 * p(t, 23.8, 24.4) + 90 * p(t, 26.2, 26.8) + 120 * p(t, 27.8, 28.8);
    // lubang
    c.fillStyle = '#3b2a1e'; c.beginPath(); c.ellipse(540, 1135, 220 + depth * 0.6, 50 + depth * 0.15, 0, 0, Math.PI * 2); c.fill();
    c.save(); c.beginPath(); c.rect(0, 0, 1080, 1135); c.clip();
    person(c, 'dimas', 540, 1135 + depth, 1.0, t, { pose: depth > 120 ? 'head' : 'stand', mood: depth > 60 ? 'worried' : 'neutral' });
    c.restore();
    c.fillStyle = '#3b2a1e'; c.beginPath(); c.ellipse(540, 1135, 220 + depth * 0.6, 50 + depth * 0.15, 0, 0, Math.PI); c.fill();
    [[22.6, 0], [23.8, 1], [24.6, 2]].forEach(([tt, i], j) => appIcon(c, 220 + j * 320, 330, 150, APPS[i + 2][0].slice(0, 1), APPS[i + 2][1], p(t, tt, tt + 0.3)));
    txt(c, 'Pinjam baru → tutup pinjaman lama', 540, 480, { size: 38, font: 'body', alpha: p(t, 23.8, 24.1) * (1 - p(t, 25.9, 26.1)) });
    if (t >= 26.2) txt(c, 'GALI LUBANG', 540, 470, { size: 70, color: C.accent, alpha: p(t, 26.2, 26.4) });
    if (t >= 26.9) txt(c, 'TUTUP LUBANG', 540, 560, { size: 70, color: C.text, alpha: p(t, 26.9, 27.1) });
  }
  // 30–34 tujuh aplikasi (@32.4)
  function sTujuh(c, lt, t) {
    room(c, 'kamar', t);
    txt(c, '2 BULAN KEMUDIAN', 540, 260, { size: 50, color: C.muted, font: 'body', ls: 4, alpha: p(t, 30.0, 30.3) });
    APPS.forEach(([n, col], i) => {
      const x = 220 + (i % 3) * 320, y = 450 + Math.floor(i / 3) * 230;
      appIcon(c, i === 6 ? 540 : x, y, 160, n.slice(0, 1), col, p(t, 31.3 + i * 0.16, 31.6 + i * 0.16));
    });
    const k = p(t, 32.4, 32.7);
    if (k > 0) { card(c, 180, 1000, 720, 110, { alpha: k }); txt(c, '7 aplikasi · total utang ±Rp9 juta', 540, 1057, { size: 38, alpha: k, color: C.accent, maxW: 680 }); }
  }
  // 34–48.5 telepon penagih
  function callScreen(c, t, threat) {
    phone(c, 540, 760, 640, 1060, t, (c, x, y, w, h) => {
      c.fillStyle = '#1f1f24'; c.fillRect(x, y, w, h);
      txt(c, 'Nomor tidak dikenal', x + w / 2, y + 150, { size: 40, color: '#fff', font: 'body' });
      txt(c, '+62 8xx-xxxx-xxxx', x + w / 2, y + 210, { size: 30, color: '#aaa', font: 'body' });
      c.fillStyle = '#55555e'; c.beginPath(); c.arc(x + w / 2, y + 400, 110, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#2f2f36'; c.beginPath(); c.arc(x + w / 2, y + 370, 45, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(x + w / 2, y + 470, 75, 50, 0, Math.PI, 0); c.fill();
      const talk = P.talking('penagih', t);
      for (let i = 0; i < 18; i++) { const hh = talk ? 10 + 50 * Math.abs(Math.sin(t * 9 + i * 0.9)) : 6; rrect(c, x + 120 + i * 22, y + 620 - hh / 2, 12, hh, 6, '#e63946'); }
      if (threat) { const k = p(t, 45.9, 46.2); rrect(c, x + 30, y + 720, w - 60, 140, 20, 'rgba(230,57,70,0.2)'); txt(c, '"Semua kontakmu kami hubungi."', x + w / 2, y + 790, { size: 30, color: '#ffb4b4', font: 'body', alpha: k, maxW: w - 100 }); }
      rrect(c, x + w / 2 - 60, y + h - 160, 120, 120, 60, '#e63946');
    });
  }
  function sTelepon(c, lt, t) {
    room(c, 'kamar', t, { night: true }); nightTint(c, 1.1);
    if (t < 37.3) {
      phone(c, 540, 760, 640, 1060, t, (c, x, y, w, h) => {
        txt(c, 'Panggilan tak terjawab', x + 40, y + 100, { size: 36, align: 'left', color: '#1d1d1f' });
        for (let i = 0; i < 7; i++) {
          const k = p(t, 34.7 + i * 0.3, 35.0 + i * 0.3); if (k <= 0) continue;
          txt(c, `Nomor tidak dikenal (${3 + i * 2})`, x + 44, y + 190 + i * 100, { size: 30, align: 'left', font: 'body', color: '#c1121f', alpha: k });
          txt(c, `0${8 + i}:1${i}`, x + w - 44, y + 190 + i * 100, { size: 26, align: 'right', font: 'body', color: '#999', alpha: k });
        }
      }, { alpha: 1, bg: '#ffffff' });
      return;
    }
    if (t < 41.3) return callScreen(c, t, false);
    if (t < 44.3) {
      c.save(); c.translate(540, 900); c.scale(1.4, 1.4); c.translate(-540, -900);
      person(c, 'dimas', 540, 1350, 1.1, t, { pose: 'phone', mood: 'worried', sweat: true });
      c.restore(); return;
    }
    callScreen(c, t, true);
  }
  // 48.5–52.3 cuma ancaman... ternyata bukan (@50.4)
  function sAncaman(c, lt, t) {
    room(c, 'kamar', t, { night: true }); nightTint(c, 0.9);
    c.save(); cam(c, lt, 3.8, 0.05);
    person(c, 'dimas', 540, 1140, 1.1, t, { pose: 'shrug', mood: t < 50.4 ? 'neutral' : 'worried' });
    c.restore();
    txt(c, '"Cuma ancaman."', 540, 300, { size: 58, alpha: p(t, 49.4, 49.7), color: '#f4ead6' });
    stamp(c, 'TERNYATA BUKAN', 540, 470, p(t, 50.9, 51.15), { size: 80 });
  }
  // 52.3–60.7 grup keluarga; foto (@56.1); tulisan (@58.2)
  function sGrup(c, lt, t) {
    room(c, 'rumah', t, { night: true }); nightTint(c, 1);
    phone(c, 540, 780, 680, 1150, t, (c, x, y, w, h) => {
      c.fillStyle = '#efe7dc'; c.fillRect(x, y, w, h);
      rrect(c, x, y, w, 150, 0, '#075e54'); txt(c, 'Keluarga Besar', x + 50, y + 80, { size: 38, align: 'left', color: '#fff' });
      txt(c, '42 anggota', x + 50, y + 120, { size: 24, align: 'left', font: 'body', color: '#cde' });
      let yy = y + 180;
      yy += bubble(c, x + 30, yy, w - 160, 'Selamat malam semua', 'l', p(t, 52.6, 52.9), { name: 'Om Hari', size: 28 }) + 16;
      yy += bubble(c, x + 30, yy, w - 100, 'ORANG INI MENUNGGAK UTANG. Hubungi segera.', 'l', p(t, 56.1, 56.4), {
        name: '+62 8xx-xxxx-xxxx', size: 28, nameColor: '#c1121f',
        img: (c, ix, iy, iw, ih) => {
          c.fillStyle = '#a99d8c'; c.fillRect(ix, iy, iw, ih);
          person(c, 'dimas', ix + iw / 2, iy + ih + 300, 0.75, t, { mood: 'neutral' });
          if (t >= 58.2) { rrect(c, ix + 20, iy + ih - 64, iw - 40, 48, 8, '#c1121f'); txt(c, 'PENUNGGAK', ix + iw / 2, iy + ih - 40, { size: 28, color: '#fff' }); }
        },
      }) + 16;
      yy += bubble(c, x + 30, yy, w - 260, 'Lho, ini Dimas?', 'l', p(t, 59.0, 59.3), { name: 'Tante Wati', size: 28 }) + 16;
    });
  }
  // 60.7–64.1 Ibu di rumah
  function sIbu(c, lt, t) {
    room(c, 'rumah', t, { night: true }); nightTint(c, 0.5);
    c.save(); cam(c, lt, 3.4, 0.06, 540, 700);
    person(c, 'ibu', 540, 1140, 1.12, t, { pose: 'phone', mood: 'worried', screen: '#efe7dc' });
    c.restore();
  }
  // 64.1–73 ponsel bergetar terus, gelap, bersambung (@70.5)
  function sGetar(c, lt, t) {
    room(c, 'gelap', t, { night: true }); nightTint(c, 1.5);
    c.save(); cam(c, lt, 9, 0.08, 540, 800);
    person(c, 'dimas', 540, 1140, 1.12, t, { pose: 'head', mood: 'sad', tear: true });
    c.restore();
    const n = Math.round(lerp(12, 48, p(t, 65.8, 68.5))), buzz = Math.sin(t * 70) * 6;
    card(c, 270 + buzz, 250, 540, 140, { alpha: p(t, 65.8, 66.1) });
    txt(c, `${n} panggilan tak terjawab`, 540 + buzz, 322, { size: 40, color: C.accent, alpha: p(t, 65.8, 66.1), maxW: 500 });
    const d = p(t, 68.6, 70.3); if (d > 0) { c.fillStyle = `rgba(0,0,0,${0.6 * d})`; c.fillRect(0, 0, 1080, 1920); }
  }
  function sEnd(c, lt) { P.endCard(c, lt, 'BERSAMBUNG', 'Episode 3: Jalan Keluar →'); }

  const raw = [
    ['tekan', 0, 3.5, sTekan], ['cair', 3.5, 7.5, sCair], ['aman', 7.5, 11.0, sAman], ['syarat', 11.0, 18.0, sSyarat],
    ['bengkak', 18.0, 22.3, sBengkak], ['lubang', 22.3, 30.0, sLubang], ['tujuh', 30.0, 34.0, sTujuh], ['telepon', 34.0, 48.5, sTelepon],
    ['ancaman', 48.5, 52.3, sAncaman], ['grup', 52.3, 60.7, sGrup], ['ibu', 60.7, 64.1, sIbu], ['getar', 64.1, 73.0, sGetar], ['end', 73.0, 76.0, sEnd],
  ];
  const SCENES = raw.map(([id, t0, t1, f]) => ({ id, t0, t1, accent: C.accent, draw: (c, lt, t) => { f(c, lt, t); if (id !== 'end') P.nameTag(c, t); } }));
  const EV = {
    boom: [[1.1, 0.5], [15.9, 0.6], [50.9, 0.6], [58.2, 0.6]],
    hit: [[11.0, 0.3], [22.3, 0.3], [34.0, 0.3], [52.3, 0.3], [64.1, 0.3]],
    stamp: [[15.9, 0.4], [50.9, 0.4]],
    ding: [4.8, 8.3],
    blip: [22.6, 23.8, 24.6, 31.3, 31.5, 31.6, 31.8, 32.0, 32.1, 32.3, 34.7, 35.0, 35.3, 35.6, 35.9, 36.2, 36.5, 56.1, 59.0],
    riser: [[67.5, 70.3]],
  };
  return { SCENES, EV };
};
