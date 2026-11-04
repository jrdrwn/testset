// Jebakan Cicilan — EP 1/3: Gajian Pertama (74 dtk). Waktu animasi = waktu kata di vo/plan.json.
window.makeScenes = function (K) {
  const { C, p, eOut, eBack, clamp, lerp, txt, rrect, stamp, card, rp } = K;
  const P = window.makePeople(K), { person, room, nightTint, table, desk, cam, phone, bubble, appIcon, FY } = P;
  const APPS = [['PayKu', '#e76f51'], ['CicilIn', '#2a9d8f'], ['LaterYuk', '#8e5bd1']];

  // 0–3.6 "satu klik bisa ngubah hidupnya" (klik @1.8)
  function sKlik(c, lt, t) {
    room(c, 'gelap', t, { night: true }); nightTint(c, 1.4);
    c.save(); cam(c, lt, 3.6, 0.08, 540, 700);
    const g = c.createRadialGradient(540, 820, 20, 540, 820, 520); g.addColorStop(0, 'rgba(159,211,255,0.45)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.fillRect(0, 300, 1080, 1100);
    person(c, 'dimas', 540, 1650, 1.9, t, { pose: 'phone', mood: lt > 1.8 ? 'shock' : 'neutral', down: true });
    c.restore();
    stamp(c, 'KLIK.', 540, 420, p(lt, 1.7, 1.95), { size: 120, color: C.accent2 });
    P.seriesBadge(c, t, 3.6);
  }
  // 3.6–8.1 kantor: umur 23 (@4.0), 3 bulan kerja (@5.1), gaji 5 juta (@6.6)
  function sKantor(c, lt, t) {
    room(c, 'kantor', t);
    c.save(); cam(c, lt, 4.5, 0.04);
    person(c, 'dimas', 540, 1060, 1, t, { pose: 'open', mood: 'happy', seated: true }); desk(c, t);
    c.restore();
    const a = p(lt, 0.4, 0.7);
    card(c, 90, 240, 420, 150, { alpha: a }); txt(c, 'DIMAS, 23', 300, 295, { size: 54, alpha: a }); txt(c, 'baru 3 bulan kerja', 300, 350, { size: 32, font: 'body', color: C.muted, alpha: p(lt, 1.4, 1.7) });
    const k = p(lt, 2.6, 2.9);
    if (k > 0) { card(c, 560, 240, 430, 150, { alpha: k }); txt(c, 'SLIP GAJI', 775, 290, { size: 30, font: 'body', color: C.muted, alpha: k, ls: 4 }); K.counter(c, 0, 5e6, p(lt, 2.9, 3.5), 775, 348, { size: 52, color: C.good, format: rp }); }
  }
  // 8.1–22.1 kafe: Bayu pamer HP, ajak paylater
  function sKafe(c, lt, t) {
    room(c, 'kafe', t);
    const close = t >= 18.0 && t < 21.4;
    c.save();
    if (close) { c.translate(540, 900); c.scale(1.35, 1.35); c.translate(-540, -900); } else cam(c, lt, 14, 0.04);
    person(c, 'dimas', 330, 1040, 1, t, { seated: true, pose: t > 15 && t < 17.3 ? 'shrug' : 'phone', mood: t > 15 && t < 17.3 ? 'worried' : 'neutral', screen: '#7a8a99', look: 1 });
    person(c, 'bayu', 760, 1040, 1, t, { seated: true, flip: true, pose: t > 18 && t < 21.3 ? 'point' : 'phone', mood: 'happy', screen: '#ffd27a', look: 1 });
    table(c, 545, 860, 640);
    rrect(c, 420, 830, 60, 34, 8, '#f1ece2'); rrect(c, 610, 826, 70, 38, 8, '#f1ece2');
    c.restore();
    if (t < 11.7) txt(c, 'Gaya hidup teman-teman', 540, 280, { size: 56, alpha: p(lt, 0.3, 0.6) * (1 - p(lt, 3.3, 3.6)) });
    if (t >= 11.8 && t < 15) { // HP baru vs HP retak
      const k = p(t, 12.3, 12.6);
      card(c, 600, 230, 400, 130, { alpha: k }); txt(c, 'HP BARU', 800, 275, { size: 30, font: 'body', color: C.muted, alpha: k, ls: 4 }); txt(c, rp(4299000), 800, 325, { size: 44, alpha: k, color: C.accent });
      txt(c, 'HP lama, layar retak', 300, 300, { size: 34, font: 'body', color: C.muted, alpha: p(t, 13.2, 13.5) });
    }
    if (t >= 18.0 && t < 22.1) {
      stamp(c, 'PAYLATER', 540, 330, p(t, 18.3, 18.55), { size: 92, color: C.accent });
      const k = p(t, 19.6, 19.9);
      if (k > 0) { card(c, 230, 470, 620, 120, { alpha: k }); txt(c, 'Cicil 12 bulan · 0% di bulan pertama', 540, 530, { size: 34, font: 'body', alpha: k, maxW: 580 }); }
    }
  }
  // 22.1–30.0 kamar malam, buka aplikasi, limit 7 juta (@24.4), cair (@25.5), "aman lah" (@28.5)
  function sLimit(c, lt, t) {
    room(c, 'kamar', t, { night: true }); nightTint(c);
    if (t < 23.3 || t >= 26.9) {
      c.save(); cam(c, lt, 8, 0.05);
      person(c, 'dimas', 560, 1140, 1.15, t, { pose: 'phone', mood: t >= 26.9 ? 'happy' : 'neutral', down: t < 26.9 });
      c.restore();
      if (t >= 27.2) { const k = p(t, 27.2, 27.5); card(c, 220, 260, 640, 150, { alpha: k }); txt(c, '±Rp300 ribu / bulan', 540, 335, { size: 54, alpha: k, color: C.good }); }
      stamp(c, 'AMAN?', 760, 520, p(t, 28.5, 28.75), { size: 84, color: C.accent2 });
      return;
    }
    phone(c, 540, 820, 640, 1100, t, (c, x, y, w, h) => {
      rrect(c, x, y, w, 150, 0, APPS[0][1]); txt(c, 'PayKu', x + w / 2, y + 95, { size: 44, color: '#fff' });
      txt(c, 'Limit kamu', x + w / 2, y + 260, { size: 34, font: 'body', color: '#555' });
      K.counter(c, 0, 7e6, p(t, 24.2, 24.8), x + w / 2, y + 340, { size: 70, color: '#1d1d1f', format: rp });
      const k = p(t, 25.4, 25.7);
      if (k > 0) { rrect(c, x + 60, y + 440, w - 120, 90, 45, '#2a9d8f'); txt(c, 'DISETUJUI ✓', x + w / 2, y + 487, { size: 38, color: '#fff', alpha: k }); }
      txt(c, 'Tanpa kartu kredit · Cair instan', x + w / 2, y + 600, { size: 26, font: 'body', color: '#888' });
    });
  }
  // 30–34 checkout: HP (@30.4), sepatu (@31.3), makan (@32.0)
  function sCheckout(c, lt, t) {
    room(c, 'kamar', t); 
    [[30.4, 'HP baru', 4299000], [31.3, 'Sepatu', 899000], [32.0, 'Makan enak, tiap Sabtu', 180000]].forEach(([tt, n, v], i) => {
      const k = p(t, tt, tt + 0.3); if (k <= 0) return;
      const y = 380 + i * 220, dx = (1 - eOut(k)) * 200;
      card(c, 110 + dx, y, 860, 180, { alpha: k });
      txt(c, n, 160 + dx, y + 65, { size: 46, align: 'left', alpha: k });
      txt(c, rp(v), 160 + dx, y + 125, { size: 36, align: 'left', font: 'body', color: C.muted, alpha: k });
      rrect(c, 690 + dx, y + 60, 230, 64, 32, C.good); txt(c, 'Bayar nanti', 805 + dx, y + 93, { size: 30, color: '#fff', font: 'body', alpha: k });
    });
    stamp(c, 'KLIK', 540, 250, p(t, 30.0, 30.2), { size: 80, color: C.accent2 });
  }
  // 34–42.3 aplikasi 1 (@34.4), 2 (@37.0), 3 (@37.6); "gajimu cukup nggak?" (@40.5)
  function sApps(c, lt, t) {
    room(c, 'kamar', t);
    txt(c, 'Daftar lagi...', 540, 290, { size: 56, alpha: p(t, 34.0, 34.3) });
    [34.4, 37.0, 37.6].forEach((tt, i) => {
      appIcon(c, 250 + i * 290, 520, 200, APPS[i][0].slice(0, 1), APPS[i][1], p(t, tt, tt + 0.35));
      txt(c, APPS[i][0], 250 + i * 290, 670, { size: 34, font: 'body', alpha: p(t, tt, tt + 0.35) });
      const ok = p(t, 38.6 + i * 0.25, 38.9 + i * 0.25); if (ok > 0) txt(c, 'Disetujui ✓', 250 + i * 290, 720, { size: 30, font: 'body', color: C.good, alpha: ok });
    });
    const k = p(t, 39.6, 39.9);
    if (k > 0) {
      card(c, 150, 820, 780, 260, { alpha: k });
      txt(c, 'KTP ✓   Selfie ✓', 540, 890, { size: 42, alpha: k, font: 'body' });
      txt(c, '"Gajimu cukup nggak?"', 540, 980, { size: 46, alpha: p(t, 40.5, 40.8), color: C.accent });
      txt(c, 'nggak ada yang nanya', 540, 1040, { size: 30, alpha: p(t, 41.0, 41.3), font: 'body', color: C.muted });
    }
  }
  // 42.3–45.7 bulan pertama ringan
  function sRingan(c, lt, t) {
    room(c, 'kafe', t);
    c.save(); cam(c, lt, 3.4, 0.05);
    person(c, 'dimas', 420, 1130, 1.05, t, { pose: 'wave', mood: 'happy' });
    person(c, 'bayu', 760, 1130, 1.0, t, { pose: 'phone', mood: 'happy', flip: true, screen: '#ffd27a' });
    c.restore();
    card(c, 300, 230, 480, 130, { alpha: p(lt, 0.2, 0.5) }); txt(c, 'BULAN 1', 540, 297, { size: 60, alpha: p(lt, 0.2, 0.5), color: C.good });
  }
  // 45.7–58.1 tanggal 25 (@46.6), notifikasi (@47.6), total 2,3 jt (@51.8), setengah gaji (@53.8), kaget (@55.2)
  function sTagihan(c, lt, t) {
    room(c, 'kamar', t, { night: true }); nightTint(c, 0.6);
    if (t >= 54.9) {
      c.save(); c.translate(540, 900); c.scale(1.05 + 0.04 * p(t, 54.9, 58), 1.05 + 0.04 * p(t, 54.9, 58)); c.translate(-540, -900);
      person(c, 'dimas', 540, 1700, 2.0, t, { pose: 'head', mood: 'shock', shake: t < 55.6 ? 3 : 0 });
      c.restore();
      return;
    }
    if (t < 47.4) { // kalender
      const k = p(t, 46.4, 46.8);
      card(c, 290, 380, 500, 520, {});
      rrect(c, 290, 380, 500, 120, 30, C.accent); txt(c, 'TANGGAL', 540, 442, { size: 40, color: '#fff', font: 'body', ls: 4 });
      txt(c, k > 0.5 ? '25' : '24', 540, 700, { size: 260, color: k > 0.5 ? C.accent : C.text, scale: k > 0.5 ? lerp(1.4, 1, eOut((k - 0.5) * 2)) : 1 });
      return;
    }
    phone(c, 540, 760, 640, 1000, t, (c, x, y, w, h) => {
      txt(c, 'Notifikasi', x + 40, y + 90, { size: 40, align: 'left', color: '#1d1d1f' });
      [[47.6, 0, 812000], [48.0, 1, 965000], [48.4, 2, 523000]].forEach(([tt, i, v], j) => {
        const k = p(t, tt, tt + 0.3); if (k <= 0) return;
        const yy = y + 150 + j * 150 + (1 - eBack(k)) * -40;
        rrect(c, x + 24, yy, w - 48, 130, 24, '#ffffff'); c.save(); c.globalAlpha *= k; rrect(c, x + 44, yy + 25, 80, 80, 20, APPS[i][1]); c.restore();
        txt(c, `${APPS[i][0]} · jatuh tempo hari ini`, x + 145, yy + 52, { size: 26, align: 'left', font: 'body', color: '#333', alpha: k, maxW: w - 190 });
        txt(c, 'Tagihan ' + rp(v), x + 145, yy + 94, { size: 32, align: 'left', color: '#1d1d1f', alpha: k });
      });
      const k = p(t, 51.6, 51.9);
      if (k > 0) {
        txt(c, 'TOTAL', x + w / 2, y + 640, { size: 30, font: 'body', color: '#777', alpha: k, ls: 4 });
        K.counter(c, 0, 2.3e6, p(t, 51.8, 52.5), x + w / 2, y + 710, { size: 76, color: C.accent, format: rp });
      }
    }, { bg: '#eef0f3' });
    const kb = p(t, 53.3, 53.6);
    if (kb > 0) {
      txt(c, 'GAJI Rp5 juta', 130, 1295 - 120, { size: 30, font: 'body', align: 'left', alpha: kb });
      rrect(c, 330, 1155, 620, 40, 20, 'rgba(0,0,0,0.15)'); rrect(c, 330, 1155, 620 * 0.46 * p(t, 53.8, 54.4), 40, 20, C.accent);
    }
  }
  // 58.1–63.1 sisa gaji 2,7 jt (@59.1), kos & makan belum (@61.2)
  function sSisa(c, lt, t) {
    room(c, 'kamar', t); 
    card(c, 110, 300, 860, 230, {});
    txt(c, 'SISA GAJI', 540, 370, { size: 32, font: 'body', color: C.muted, ls: 4 });
    K.counter(c, 5e6, 2.7e6, p(t, 58.7, 59.6), 540, 460, { size: 84, color: C.accent2, format: rp });
    [[61.2, 'Kos', 1500000], [61.6, 'Makan sebulan', 1500000], [62.0, 'Transport', 500000]].forEach(([tt, n, v], i) => {
      const k = p(t, tt, tt + 0.3); if (k <= 0) return;
      const y = 600 + i * 130;
      card(c, 110, y, 860, 110, { alpha: k, stroke: C.accent });
      txt(c, n, 160, y + 56, { size: 40, align: 'left', alpha: k });
      txt(c, rp(v) + ' · belum', 920, y + 56, { size: 32, align: 'right', font: 'body', color: C.accent, alpha: k });
    });
    stamp(c, 'KURANG', 540, 1060, p(t, 62.4, 62.65), { size: 80 });
  }
  // 63.1–70 iklan pinjaman: "cair 5 menit" (@64.8), "tanpa syarat" (@65.6), jari berhenti (@68.4)
  function sIklan(c, lt, t) {
    room(c, 'kamar', t, { night: true }); nightTint(c, 1.2);
    phone(c, 540, 800, 660, 1120, t, (c, x, y, w, h) => {
      c.fillStyle = '#fff6e0'; c.fillRect(x, y, w, h);
      txt(c, 'IKLAN', x + 50, y + 80, { size: 24, align: 'left', font: 'body', color: '#999', ls: 3 });
      txt(c, 'BUTUH DANA?', x + w / 2, y + 230, { size: 64, color: '#c1121f', alpha: p(t, 63.4, 63.7) });
      txt(c, 'Cair 5 menit', x + w / 2, y + 350, { size: 56, color: '#1d1d1f', alpha: p(t, 64.8, 65.1) });
      txt(c, 'Tanpa syarat · Tanpa jaminan', x + w / 2, y + 430, { size: 34, font: 'body', color: '#444', alpha: p(t, 65.6, 65.9) });
      const pulse = 1 + 0.04 * Math.sin(t * 8);
      c.save(); c.translate(x + w / 2, y + 640); c.scale(pulse, pulse);
      rrect(c, -230, -60, 460, 120, 60, '#c1121f'); c.restore();
      txt(c, 'AJUKAN SEKARANG', x + w / 2, y + 642, { size: 40, color: '#fff' });
    }, { alpha: p(lt, 0, 0.3) });
    // jari mendekat lalu berhenti
    const k = eOut(p(t, 67.6, 68.4));
    if (k > 0) { const fy = lerp(1500, 1000, k); c.fillStyle = P.CAST.dimas.skin; c.beginPath(); c.roundRect(505, fy, 70, 400, 35); c.fill(); c.fillStyle = 'rgba(255,255,255,0.4)'; c.beginPath(); c.roundRect(518, fy + 12, 44, 40, 14); c.fill(); }
    if (t >= 69.6) { c.fillStyle = `rgba(0,0,0,${0.5 * p(t, 69.6, 70)})`; c.fillRect(0, 0, 1080, 1920); }
  }
  // 70–74 bersambung
  function sEnd(c, lt) { P.endCard(c, lt, 'BERSAMBUNG', 'Episode 2: Gali Lubang →'); }

  const raw = [
    ['klik', 0, 3.6, sKlik], ['kantor', 3.6, 8.1, sKantor], ['kafe', 8.1, 22.1, sKafe], ['limit', 22.1, 30.0, sLimit],
    ['checkout', 30.0, 34.0, sCheckout], ['apps', 34.0, 42.3, sApps], ['ringan', 42.3, 45.7, sRingan], ['tagihan', 45.7, 58.1, sTagihan],
    ['sisa', 58.1, 63.1, sSisa], ['iklan', 63.1, 70.0, sIklan], ['end', 70.0, 74.0, sEnd],
  ];
  const SCENES = raw.map(([id, t0, t1, f]) => ({ id, t0, t1, accent: C.accent2, draw: (c, lt, t) => { f(c, lt, t); if (id !== 'end') P.nameTag(c, t); } }));
  const EV = {
    boom: [[1.8, 0.5], [55.2, 0.6]],
    hit: [[3.6, 0.3], [22.1, 0.3], [45.7, 0.3], [63.1, 0.3]],
    stamp: [[1.8, 0.4], [18.3, 0.4], [28.5, 0.3], [30.0, 0.3], [62.4, 0.4]],
    ding: [25.5, 38.6, 38.85, 39.1],
    blip: [30.4, 31.3, 32.0, 34.4, 37.0, 37.6, 47.6, 48.0, 48.4, 61.2, 61.6, 62.0],
    riser: [[66.5, 69.6]],
  };
  return { SCENES, EV };
};
