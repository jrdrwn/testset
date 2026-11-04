// "Sisi Gelap Paylater" — 55 dtk. Waktu animasi (lt) disamakan dengan waktu kata di vo/plan.json.
window.makeScenes = function (K) {
  const { C, p, eOut, eBack, clamp, lerp, txt, rrect, tag, stamp, counter, checklist, notif, card, rp } = K;
  const T = v => 'Rp' + v.toFixed(1).replace('.', ',') + ' T';

  // 0–3: hook. "Rp40" diucapkan di 1,24 dtk, "Kamu ikut?" di 2,27
  function sHook(c, lt) {
    tag(c, 'SISI GELAP PAYLATER', 250, C.accent);
    txt(c, 'UTANG PAYLATER', 540, 470, { size: 64, ls: 6, color: C.muted, alpha: p(lt, 0.1, 0.35) });
    const k = p(lt, 0.35, 1.24);
    if (k > 0) counter(c, 0, 39.3, k, 540, 640, { size: 190, color: C.accent, glow: C.accent, blur: 30, stroke: '#000', sw: 12, format: T });
    txt(c, 'OUTSTANDING, JANUARI 2026', 540, 790, { size: 34, ls: 4, color: C.text, alpha: p(lt, 1.3, 1.6), font: 'body' });
    stamp(c, 'KAMU IKUT?', 540, 980, p(lt, 2.27, 2.5), { size: 96, color: C.accent2 });
    txt(c, '*OJK: BNPL bank Rp27,1 T + perusahaan pembiayaan Rp12,18 T (Jan 2026)', 540, 1195, { size: 24, font: 'body', color: C.muted, alpha: p(lt, 1.4, 1.7), maxW: 940 });
  }

  // 3–10.5: ilusi uang tambahan. "tambahan" 1,2; "utang" 2,61; "gaji bulan depan" 3,28
  function sIlusi(c, lt) {
    txt(c, 'ISI DOMPETMU?', 540, 270, { size: 60, ls: 8, color: C.muted, font: 'body' });
    const a1 = eOut(p(lt, 0.1, 0.4));
    card(c, 110, 360, 860, 200, { alpha: a1 });
    txt(c, 'SALDO', 160, 415, { size: 32, ls: 5, color: C.muted, align: 'left', alpha: a1, font: 'body' });
    txt(c, rp(2450000), 160, 495, { size: 74, align: 'left', alpha: a1 });
    const a2 = eOut(p(lt, 0.6, 0.9)), red = p(lt, 2.61, 2.8);
    card(c, 110, 600, 860, 200, { alpha: a2, stroke: red > 0 ? C.accent : C.good });
    txt(c, red > 0.5 ? 'UTANG PAYLATER' : 'LIMIT PAYLATER', 160, 655, { size: 32, ls: 5, color: red > 0.5 ? C.accent : C.good, align: 'left', alpha: a2, font: 'body' });
    txt(c, (red > 0.5 ? '−' : '+') + rp(5000000), 160, 735, { size: 74, align: 'left', alpha: a2, color: red > 0.5 ? C.accent : C.good });
    const kt = p(lt, 1.2, 1.5), dim = 1 - p(lt, 2.61, 2.9);
    if (kt > 0 && dim > 0) txt(c, 'Rasanya punya ' + rp(7450000), 540, 900, { size: 54, color: C.accent2, alpha: kt * dim });
    stamp(c, 'UTANG', 760, 560, p(lt, 2.61, 2.85), { size: 90 });
    const kg = p(lt, 3.28, 3.6);
    if (kg > 0) txt(c, '= gaji bulan depan', 540, 920, { size: 62, alpha: kg, color: C.accent });
    if (kg > 0) txt(c, 'yang sudah kepakai duluan', 540, 1000, { size: 40, alpha: p(lt, 4.3, 4.6), color: C.muted, font: 'body' });
  }

  // 10.5–18: cicilan menumpuk. "checkout kecil" 0,35; "lima aplikasi" 2,06; "jatuh tempo" 3,45; "Gajimu habis" 4,43
  function sTumpuk(c, lt) {
    const k0 = p(lt, 0.3, 0.55), out = 1 - p(lt, 1.8, 2.0);
    if (out > 0 && k0 > 0) {
      card(c, 140, 500, 800, 300, { alpha: k0 * out });
      txt(c, 'Checkout', 540, 580, { size: 46, alpha: k0 * out, color: C.muted, font: 'body' });
      txt(c, rp(149000), 540, 660, { size: 80, alpha: k0 * out });
      rrect(c, 300, 715, 480, 60, 30, C.good); txt(c, 'Bayar nanti', 540, 747, { size: 34, color: '#fff', alpha: k0 * out, font: 'body' });
    }
    if (lt >= 1.9) {
      txt(c, 'TAGIHAN BULAN INI', 540, 255, { size: 52, ls: 6, alpha: p(lt, 1.9, 2.1) });
      const apps = [['Paylater A', 'tgl 1', 349000], ['Paylater B', 'tgl 5', 512000], ['Paylater C', 'tgl 10', 275000], ['Paylater D', 'tgl 15', 640000], ['Paylater E', 'tgl 25', 430000]];
      apps.forEach(([n, d, v], i) => notif(c, lt, 2.06 + i * 0.3, 320 + i * 150, `${n} · jatuh tempo ${d}`, `Tagihan ${rp(v)}`, { color: C.accent }));
      const kg = p(lt, 4.43, 5.6);
      if (lt > 4.3) {
        txt(c, 'GAJI', 130, 1110, { size: 36, ls: 4, align: 'left', color: C.muted, font: 'body', alpha: p(lt, 4.3, 4.5) });
        rrect(c, 250, 1090, 700, 40, 20, C.panel);
        rrect(c, 250, 1090, Math.max(20, 700 * (1 - kg)), 40, 20, kg > 0.8 ? C.accent : C.good);
      }
      stamp(c, 'GAJI HABIS', 540, 680, p(lt, 4.6, 4.85), { size: 100 });
    }
  }

  // 18–25.5: denda & biaya. "kena denda" 1,48; "Bunga" 2,94; "biaya layanan" 3,44; "lebih mahal" 5,38
  function sDenda(c, lt) {
    const k0 = p(lt, 0.05, 0.3);
    rrect(c, 290, 255, 500, 80, 40, C.accent);
    txt(c, 'JATUH TEMPO: KEMARIN', 540, 297, { size: 34, ls: 3, color: '#fff', alpha: k0, font: 'body' });
    card(c, 110, 400, 860, 190, { alpha: eOut(p(lt, 0.2, 0.5)) });
    txt(c, 'HARGA BARANG', 160, 455, { size: 32, ls: 5, color: C.muted, align: 'left', font: 'body', alpha: p(lt, 0.2, 0.5) });
    txt(c, rp(1000000), 160, 530, { size: 70, align: 'left', alpha: p(lt, 0.2, 0.5) });
    [['+ denda telat bayar', 1.48], ['+ bunga', 2.94], ['+ biaya layanan', 3.44]].forEach(([s, t], i) => {
      const k = p(lt, t, t + 0.3); if (k <= 0) return;
      txt(c, s, 160 + (1 - eOut(k)) * 40, 660 + i * 85, { size: 52, align: 'left', color: C.accent, alpha: k });
    });
    const kc = (p(lt, 1.48, 1.8) + p(lt, 2.94, 3.2) + p(lt, 3.44, 3.7)) / 3;
    if (lt > 1.4) {
      txt(c, 'TOTAL BAYAR', 160, 960, { size: 32, ls: 5, color: C.muted, align: 'left', font: 'body' });
      counter(c, 1000000, 1185000, kc, 160, 1040, { size: 80, align: 'left', color: C.accent2, format: rp });
      txt(c, '*angka ilustrasi; cek rincian biaya di aplikasimu', 160, 1120, { size: 26, align: 'left', color: C.muted, font: 'body' });
    }
    stamp(c, 'LEBIH MAHAL', 540, 1200, p(lt, 5.38, 5.6), { size: 70 });   // di bawah total, tidak menutupi rincian
  }

  // 25.5–33: SLIK OJK. "SLIK OJK" 1,13; "Telat bayar" 2,78; "KPR" 4,8; "ditolak" 6,02
  function sSlik(c, lt) {
    tag(c, 'TERCATAT DI SLIK OJK', 250, C.accent2, p(lt, 1.0, 1.3));
    const lv = [['1', 'Lancar', C.good], ['2', 'Dalam Perhatian Khusus', C.accent2], ['3', 'Kurang Lancar', C.accent2], ['4', 'Diragukan', C.accent], ['5', 'Macet', C.accent]];
    const cur = Math.min(4, Math.floor(lerp(0, 5, p(lt, 2.78, 4.6))));
    txt(c, 'KOLEKTIBILITAS KREDITMU', 540, 370, { size: 34, ls: 4, color: C.muted, font: 'body', alpha: p(lt, 0.3, 0.6) });
    lv.forEach(([n, s, col], i) => {
      const a = eOut(p(lt, 0.4 + i * 0.12, 0.7 + i * 0.12)), y = 430 + i * 118, on = lt > 2.7 && i === cur;
      card(c, 130, y, 820, 96, { alpha: a, r: 24, stroke: on ? col : undefined, fill: on ? col + '33' : undefined });
      txt(c, n, 190, y + 50, { size: 50, color: col, alpha: a });
      txt(c, s, 250, y + 50, { size: 40, align: 'left', alpha: a, color: on ? C.text : C.muted, font: on ? 'head' : 'body' });
    });
    notif(c, lt, 4.8, 1040, 'Pengajuan KPR', 'Status: tidak disetujui (riwayat kredit)', { color: C.accent });
    stamp(c, 'DITOLAK', 600, 700, p(lt, 6.02, 6.25), { size: 110 });
  }

  // 33–40.5: belanja impulsif. "penelitian" 0,35; "impulsif" 3,55; "Diskon dikit" 4,56; "langsung checkout" 5,59
  function sImpulsif(c, lt) {
    const ka = eOut(p(lt, 0.3, 0.6));
    card(c, 110, 300, 860, 470, { alpha: ka });
    txt(c, 'BANYAK STUDI DI INDONESIA', 540, 370, { size: 34, ls: 4, color: C.muted, font: 'body', alpha: ka });
    txt(c, 'PAYLATER', 540, 480, { size: 96, alpha: p(lt, 1.58, 1.8) });
    txt(c, '↑', 540, 590, { size: 110, color: C.accent, alpha: p(lt, 2.4, 2.6) * (1 - p(lt, 5.75, 5.85)) });
    txt(c, 'BELANJA IMPULSIF', 540, 690, { size: 76, color: C.accent, alpha: p(lt, 3.55, 3.8), maxW: 800 });
    txt(c, '*antara lain studi pada pengguna Gen Z (2024–2026)', 540, 745, { size: 24, font: 'body', color: C.muted, alpha: p(lt, 3.7, 4.0) });
    checklist(c, [
      { t: 4.56, text: 'Lagi diskon' },
      { t: 5.0, text: 'Cicilannya cuma Rp99 ribu' },
      { t: 5.4, text: 'Limit masih ada' },
    ], lt, { y: 880, gap: 120, bad: true });
    stamp(c, 'CHECKOUT', 540, 590, p(lt, 5.85, 6.1), { size: 76, color: C.accent2 });   // menggantikan panah, tidak menutupi teks
  }

  // 40.5–51: kalau tetap mau pakai. item muncul saat baris VO-nya mulai
  function sCheck(c, lt) {
    tag(c, 'KALAU TETAP MAU PAKAI', 250, C.good, p(lt, 0.1, 0.4));
    checklist(c, [
      { t: 1.5, text: 'Cukup satu aplikasi', sub: 'tutup yang jarang dipakai' },
      { t: 3.6, text: 'Cicilan maks 30% gaji', sub: 'semua cicilan digabung' },
      { t: 6.2, text: 'Bayar sebelum jatuh tempo', sub: 'pasang pengingat H-3' },
      { t: 8.2, text: 'Cuma untuk kebutuhan', sub: 'bukan keinginan' },
    ], lt, { y: 430, gap: 190 });
  }

  // 51–55: outro. "Kirim" 1,55. Area y 1140–1260 dikosongkan untuk pil handle
  function sOutro(c, lt) {
    const k = p(lt, 0.05, 0.35);
    card(c, 110, 480, 860, 480, { alpha: k });
    txt(c, 'PAYLATER BUKAN', 540, 620, { size: 84, alpha: k, maxW: 780 });
    txt(c, 'UANG TAMBAHAN.', 540, 740, { size: 84, alpha: p(lt, 0.4, 0.7), color: C.accent2, maxW: 780, scale: lerp(1.4, 1, eOut(p(lt, 0.4, 0.7))) });
    txt(c, 'Kirim ke temanmu →', 540, 870, { size: 46, alpha: p(lt, 1.55, 1.85), color: C.text, font: 'body' });
  }

  const SCENES = [
    { id: 'hook', t0: 0, t1: 3, accent: C.accent, draw: sHook },
    { id: 'ilusi', t0: 3, t1: 10.5, accent: C.good, draw: sIlusi },
    { id: 'tumpuk', t0: 10.5, t1: 18, accent: C.accent, draw: sTumpuk },
    { id: 'denda', t0: 18, t1: 25.5, accent: C.accent2, draw: sDenda },
    { id: 'slik', t0: 25.5, t1: 33, accent: C.accent, draw: sSlik },
    { id: 'impulsif', t0: 33, t1: 40.5, accent: C.accent2, draw: sImpulsif },
    { id: 'check', t0: 40.5, t1: 51, accent: C.good, draw: sCheck },
    { id: 'outro', t0: 51, t1: 55, accent: C.accent2, draw: sOutro },
  ];
  const EV = {
    boom: [[1.24, 0.9], [14.93, 0.6]],
    hit: [[3, 0.5], [10.5, 0.5], [18, 0.5], [25.5, 0.5], [33, 0.5], [40.5, 0.4], [51, 0.5]],
    stamp: [[2.27, 0.6], [5.61, 0.7], [15.1, 0.6], [23.38, 0.6], [31.52, 0.7], [38.85, 0.5]],
    ding: [42.0, 44.1, 46.7, 48.7],
    blip: [12.56, 12.86, 13.16, 13.46, 13.76, 37.56, 38.0, 38.4],
    riser: [[54.0, 55.0]],
  };
  return { SCENES, EV };
};
