// Pustaka visual bersama untuk seri cerita: tokoh (flat illustration), ruangan, ponsel, chat.
// Dipakai scenes.js tiap episode: const P = window.makePeople(K);
// Tokoh digambar dengan kaki di (x, y). Skala 1 = tinggi ±600 px. Mulut bergerak otomatis saat baris VO dengan who = nama tokoh diputar.
window.makePeople = function (K) {
  const { C, p, eOut, eBack, clamp, lerp, txt, rrect } = K;
  const TAU = Math.PI * 2, rad = d => (d * Math.PI) / 180;

  const CAST = {
    dimas: { name: 'DIMAS', skin: '#e3b089', hair: '#2b1d14', style: 'short', shirt: '#3d6a9e', pants: '#2c3140', shoe: '#1d1f26', phase: 0.3 },
    bayu: { name: 'BAYU', skin: '#c08457', hair: '#17120e', style: 'curly', shirt: '#d9733b', pants: '#4a4036', shoe: '#2a221c', phase: 1.7 },
    rani: { name: 'RANI', skin: '#ecbd96', hair: '#5b8a63', style: 'hijab', shirt: '#e9c46a', pants: '#5a4a3a', shoe: '#3a2e24', phase: 2.4 },
    ibu: { name: 'IBU', skin: '#d6a07a', hair: '#6b4f7a', style: 'hijab', shirt: '#9c6b4e', pants: '#9c6b4e', shoe: '#3a2e24', dress: true, phase: 0.9 },
  };
  const LABEL = { narator: null, penagih: 'PENAGIH', dimas: 'DIMAS', bayu: 'BAYU', rani: 'RANI', ibu: 'IBU' };

  // siapa yang sedang bicara di detik t (berdasarkan VO_LINES + durasi VO asli)
  function speaker(t) {
    const L = window.VO_LINES || [], D = window.VO_DATA || [];
    for (let i = 0; i < L.length; i++) {
      const dur = D[i] ? D[i].dur : L[i].t1 - L[i].t0;
      if (t >= L[i].t0 && t < L[i].t0 + dur) return L[i].who || 'narator';
    }
    return null;
  }
  const talking = (who, t) => speaker(t) === who;

  // pose lengan kanan [sudut lengan atas, sudut lengan bawah] dalam derajat (0 = kanan, 90 = bawah); kiri dicerminkan
  const POSE = {
    stand: { r: [100, 92], l: [100, 92] },
    phone: { r: [115, -60], l: [100, 92] },
    phone2: { r: [115, -60], l: [115, -60] },
    wave: { r: [-40, -80], l: [100, 92] },
    head: { r: [-20, 215], l: [-20, 215] },
    point: { r: [10, 0], l: [100, 92] },
    shrug: { r: [60, -40], l: [60, -40] },
    open: { r: [40, 20], l: [100, 92] },
    hug: { r: [150, 170], l: [100, 92] },
  };
  function limb(c, x, y, a1, a2, w, col, hand, mirror) {
    const A1 = mirror ? 180 - a1 : a1, A2 = mirror ? 180 - a2 : a2;
    const ex = x + Math.cos(rad(A1)) * 125, ey = y + Math.sin(rad(A1)) * 125;
    const hx = ex + Math.cos(rad(A2)) * 115, hy = ey + Math.sin(rad(A2)) * 115;
    c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(x, y); c.lineTo(ex, ey); c.lineTo(hx, hy); c.stroke();
    c.fillStyle = hand; c.beginPath(); c.arc(hx, hy, w * 0.55, 0, TAU); c.fill();
    return [hx, hy];
  }
  function ellipse(c, x, y, rx, ry, col, rot = 0) { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, TAU); c.fill(); }

  // person(c, 'dimas', x, y, skala, t, { pose, mood, look, down, flip, seated, alpha })
  // mood: happy | neutral | worried | shock | sad | angry | relief
  function person(c, who, x, y, s, t, o = {}) {
    const P = CAST[who], pose = POSE[o.pose || 'stand'], mood = o.mood || 'neutral';
    const bob = Math.sin((t + P.phase) * TAU * 0.45) * 3 + (o.shake ? Math.sin(t * 60) * o.shake : 0);
    c.save(); c.globalAlpha *= o.alpha ?? 1;
    c.translate(x, y + bob); c.scale(s * (o.flip ? -1 : 1), s);
    // bayangan
    if (!o.seated) ellipse(c, 0, 4, 120, 18, 'rgba(0,0,0,0.12)');
    // kaki
    if (!o.seated && !P.dress) {
      rrect(c, -62, -185, 52, 182, 24, P.pants); rrect(c, 10, -185, 52, 182, 24, P.pants);
      ellipse(c, -40, -6, 40, 16, P.shoe); ellipse(c, 40, -6, 40, 16, P.shoe);
    }
    // badan
    if (P.dress && !o.seated) {
      c.fillStyle = P.shirt; c.beginPath();
      c.moveTo(-90, -400); c.lineTo(90, -400); c.lineTo(130, -10); c.quadraticCurveTo(0, 8, -130, -10); c.closePath(); c.fill();
      ellipse(c, -40, -4, 36, 14, P.shoe); ellipse(c, 40, -4, 36, 14, P.shoe);
    } else rrect(c, -95, -410, 190, 250, 60, P.shirt);
    // kerah
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.moveTo(-34, -408); c.lineTo(0, -372); c.lineTo(34, -408); c.closePath(); c.fill();
    // lengan
    const arm = P.shirt;
    const hR = limb(c, 80, -385, pose.r[0], pose.r[1], 40, arm, P.skin, false);
    const hL = limb(c, -80, -385, pose.l[0], pose.l[1], 40, arm, P.skin, true);
    // ponsel di tangan
    if (o.pose === 'phone' || o.pose === 'phone2') {
      const [px, py] = o.pose === 'phone2' ? [(hR[0] + hL[0]) / 2, (hR[1] + hL[1]) / 2] : hR;
      rrect(c, px - 26, py - 62, 52, 92, 10, '#1b1b1f');
      rrect(c, px - 21, py - 56, 42, 78, 6, o.screen || '#9fd3ff');
      c.fillStyle = P.skin; c.beginPath(); c.arc(px, py + 22, 20, 0, TAU); c.fill();
    }
    // kepala
    const hy = -488;
    if (P.style === 'hijab') {
      ellipse(c, 0, hy + 2, 98, 104, P.hair);
      c.fillStyle = P.hair; c.beginPath(); c.moveTo(-98, hy + 10); c.quadraticCurveTo(-118, -360, -70, -345);
      c.lineTo(70, -345); c.quadraticCurveTo(118, -360, 98, hy + 10); c.closePath(); c.fill();
      ellipse(c, 0, hy + 6, 60, 68, P.skin);
    } else {
      rrect(c, -22, -430, 44, 40, 10, P.skin);
      ellipse(c, -72, hy + 8, 14, 18, P.skin); ellipse(c, 72, hy + 8, 14, 18, P.skin);
      ellipse(c, 0, hy - 12, 80, 74, P.hair);
      if (P.style === 'curly') for (let a = 190; a <= 350; a += 20) ellipse(c, Math.cos(rad(a)) * 70, hy - 14 + Math.sin(rad(a)) * 62, 26, 26, P.hair);
      ellipse(c, 0, hy + 6, 72, 74, P.skin);
      if (P.style === 'short') ellipse(c, -18, hy - 56, 56, 24, P.hair, -0.25);
      else ellipse(c, 0, hy - 60, 66, 22, P.hair);
    }
    // wajah
    const fy = hy + 4, look = (o.look || 0) * 5, dn = o.down ? 6 : 0;
    const blink = ((t + P.phase * 1.3) % 3.6) < 0.12;
    c.fillStyle = '#231a14'; c.strokeStyle = '#231a14'; c.lineCap = 'round';
    for (const ex of [-25, 25]) {
      if (blink || mood === 'relief') { c.lineWidth = 5; c.beginPath(); c.arc(ex, fy - 2 + dn, 8, mood === 'relief' ? Math.PI * 1.1 : 0.1, mood === 'relief' ? Math.PI * 1.9 : Math.PI - 0.1, false); c.stroke(); }
      else { ellipse(c, ex + look, fy + dn, mood === 'shock' ? 9 : 7.5, mood === 'shock' ? 10 : 8.5, '#231a14'); ellipse(c, ex + look + 2.5, fy - 3 + dn, 2.4, 2.4, '#fff'); }
    }
    // alis
    c.lineWidth = 6;
    const brow = { neutral: [0, 0], happy: [-4, -4], worried: [4, -6], sad: [6, -4], shock: [-10, -10], angry: [-6, 6], relief: [-2, -2] }[mood] || [0, 0];
    for (const sgn of [-1, 1]) { c.beginPath(); c.moveTo(sgn * 40, fy - 24 + brow[0]); c.lineTo(sgn * 12, fy - 26 + brow[1]); c.stroke(); }
    // mulut
    const my = fy + 34, talk = talking(who, t);
    if (talk) {
      const open = 0.25 + 0.75 * Math.abs(Math.sin(t * 13 + Math.sin(t * 5.3) * 2));
      ellipse(c, 0, my, 14, 3 + 11 * open, '#5a2a2a');
    } else if (mood === 'happy' || mood === 'relief') { c.lineWidth = 5; c.beginPath(); c.arc(0, my - 8, 20, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke(); }
    else if (mood === 'shock') ellipse(c, 0, my, 12, 16, '#5a2a2a');
    else if (mood === 'sad' || mood === 'worried') { c.lineWidth = 5; c.beginPath(); c.arc(0, my + 12, 16, 1.2 * Math.PI, 1.8 * Math.PI); c.stroke(); }
    else { c.lineWidth = 5; c.beginPath(); c.moveTo(-13, my); c.lineTo(13, my); c.stroke(); }
    if (mood === 'happy' || mood === 'relief') { ellipse(c, -44, fy + 22, 13, 8, 'rgba(232,110,110,0.35)'); ellipse(c, 44, fy + 22, 13, 8, 'rgba(232,110,110,0.35)'); }
    if (mood === 'worried' || mood === 'shock' || o.sweat) {
      c.fillStyle = '#8cc8f0'; c.beginPath(); c.moveTo(70, fy - 52); c.quadraticCurveTo(84, fy - 28, 70, fy - 22); c.quadraticCurveTo(56, fy - 28, 70, fy - 52); c.fill();
    }
    if (mood === 'sad' && o.tear) ellipse(c, -27, fy + 20 + ((t * 40) % 30), 4, 7, '#8cc8f0');
    c.restore();
    return { head: [x, y + (hy - 80) * s], hand: [x + hR[0] * s * (o.flip ? -1 : 1), y + hR[1] * s] };
  }

  // ---------- latar ----------
  const FY = 1130; // garis lantai
  function room(c, kind, t, o = {}) {
    const wall = { kamar: '#d9c3a0', kantor: '#c9d3d6', kafe: '#c99c74', rumah: '#d6c0a0', gelap: '#2b2833' }[kind] || '#d9c3a0';
    c.fillStyle = wall; c.fillRect(0, 0, 1080, 1920);
    // tekstur dinding halus
    c.fillStyle = 'rgba(255,255,255,0.05)'; for (let x = 0; x < 1080; x += 60) c.fillRect(x, 0, 2, FY);
    c.fillStyle = kind === 'kantor' ? '#8d969a' : '#9b7350'; c.fillRect(0, FY, 1080, 1920 - FY);
    c.fillStyle = 'rgba(0,0,0,0.08)'; for (let y = FY + 70; y < 1920; y += 90) c.fillRect(0, y, 1080, 4);
    c.fillStyle = 'rgba(0,0,0,0.18)'; c.fillRect(0, FY - 14, 1080, 14);
    if (kind === 'kamar' || kind === 'gelap') {
      // jendela
      rrect(c, 650, 300, 300, 360, 16, '#6e5236');
      rrect(c, 668, 318, 264, 324, 8, o.night ? '#1d2742' : '#a9d3ea');
      if (o.night) { ellipse(c, 870, 380, 34, 34, '#f3e7b3'); c.fillStyle = '#fff'; for (const [sx, sy] of [[720, 360], [760, 470], [700, 560], [820, 520]]) c.fillRect(sx, sy, 4, 4); }
      c.fillStyle = '#6e5236'; c.fillRect(796, 318, 10, 324); c.fillRect(668, 476, 264, 10);
      // kasur
      rrect(c, 40, 930, 460, 200, 26, '#7f9bb8'); rrect(c, 40, 880, 160, 80, 30, '#f1ece2'); rrect(c, 40, 1010, 460, 120, 20, '#5f7d9c');
      // poster
      rrect(c, 140, 360, 220, 290, 10, '#e9e1cf'); rrect(c, 160, 380, 180, 180, 6, C.accent2 + '99');
    }
    if (kind === 'kantor') {
      for (let i = 0; i < 3; i++) { rrect(c, 90 + i * 320, 260, 260, 340, 10, '#eaf2f4'); c.fillStyle = 'rgba(0,0,0,0.06)'; for (let y = 280; y < 590; y += 26) c.fillRect(100 + i * 320, y, 240, 8); }
      rrect(c, 820, 700, 90, 160, 20, '#5b8a63'); rrect(c, 830, 840, 70, 90, 10, '#8a6b4f');
    }
    if (kind === 'kafe') {
      for (const lx of [220, 540, 860]) {
        c.strokeStyle = '#3b2a1e'; c.lineWidth = 4; c.beginPath(); c.moveTo(lx, 0); c.lineTo(lx, 300); c.stroke();
        c.fillStyle = '#3b2a1e'; c.beginPath(); c.moveTo(lx - 50, 360); c.lineTo(lx + 50, 360); c.lineTo(lx + 22, 300); c.lineTo(lx - 22, 300); c.closePath(); c.fill();
        const g = c.createRadialGradient(lx, 380, 10, lx, 380, 260); g.addColorStop(0, 'rgba(255,214,140,0.55)'); g.addColorStop(1, 'rgba(255,214,140,0)');
        c.fillStyle = g; c.fillRect(lx - 260, 300, 520, 400);
      }
      rrect(c, 60, 470, 300, 200, 12, '#3b2a1e'); txt(c, 'MENU', 210, 520, { size: 36, color: '#f1e3c8', font: 'body' });
    }
    if (kind === 'rumah') {
      rrect(c, 620, 860, 420, 200, 40, '#a65e46'); rrect(c, 640, 800, 380, 120, 40, '#b8705a');
      rrect(c, 130, 340, 240, 180, 10, '#6e5236'); rrect(c, 146, 356, 208, 148, 6, '#e8d9bd');
      c.fillStyle = '#6e5236'; c.beginPath(); c.arc(860, 420, 70, 0, TAU); c.fill(); c.fillStyle = '#f4ead6'; c.beginPath(); c.arc(860, 420, 58, 0, TAU); c.fill();
      c.strokeStyle = '#3b2a1e'; c.lineWidth = 6; c.beginPath(); c.moveTo(860, 420); c.lineTo(860, 380); c.moveTo(860, 420); c.lineTo(890, 430); c.stroke();
    }
  }
  function nightTint(c, k = 1) { c.fillStyle = `rgba(16,20,48,${0.38 * k})`; c.fillRect(0, 0, 1080, 1920); }
  function table(c, x, y, w, col = '#6e4a2f') { rrect(c, x - w / 2 + 10, y + 20, w - 20, 210, 12, '#5a3b25'); rrect(c, x - w / 2, y, w, 30, 10, col); c.fillStyle = col; c.fillRect(x - w / 2 + 30, y + 30, 22, FY - y - 30); c.fillRect(x + w / 2 - 52, y + 30, 22, FY - y - 30); }
  function desk(c, t) {
    rrect(c, 275, 900, 570, 200, 10, '#664a31'); rrect(c, 260, 880, 600, 34, 10, '#7b5a3c'); c.fillStyle = '#7b5a3c'; c.fillRect(290, 914, 26, 216); c.fillRect(804, 914, 26, 216);
    rrect(c, 430, 690, 260, 170, 12, '#26282e'); rrect(c, 444, 704, 232, 140, 6, '#5d8fbf');
    c.fillStyle = 'rgba(255,255,255,0.6)'; for (let i = 0; i < 5; i++) c.fillRect(460, 722 + i * 24, 120 + ((i * 37 + Math.floor(t * 3)) % 80), 8);
    rrect(c, 540, 860, 40, 22, 4, '#26282e');
  }
  // kamera pelan (zoom/pan) di dalam adegan
  function cam(c, lt, dur, z = 0.05, cx = 540, cy = 800) {
    const k = 1 + z * clamp(lt / dur);
    c.translate(cx, cy); c.scale(k, k); c.translate(-cx, -cy);
  }

  // ---------- ponsel besar ----------
  function phone(c, x, y, w, h, t, screen, o = {}) {
    // ponsel tidak boleh menutupi label nama (y 1232) dan caption (y 1335)
    if (y + h / 2 > 1210) { const nh = Math.min(h, 1210 - 170); y = 1210 - nh / 2; h = nh; }
    c.save(); c.globalAlpha *= o.alpha ?? 1;
    c.shadowColor = 'rgba(0,0,0,0.35)'; c.shadowBlur = 50; c.shadowOffsetY = 20;
    rrect(c, x - w / 2, y - h / 2, w, h, 64, '#18181c'); c.shadowColor = 'transparent';
    const sx = x - w / 2 + 20, sy = y - h / 2 + 20, sw = w - 40, sh = h - 40;
    c.beginPath(); c.roundRect(sx, sy, sw, sh, 46); c.clip();
    c.fillStyle = o.bg || '#f7f7f9'; c.fillRect(sx, sy, sw, sh);
    screen(c, sx, sy, sw, sh);
    c.restore();
    rrect(c, x - 60, y - h / 2 + 30, 120, 26, 13, '#18181c');
  }
  // teks dibungkus
  function wrap(c, text, maxW, font) {
    c.save(); c.font = font; const out = []; let line = '';
    for (const w of text.split(' ')) { const tryL = line ? line + ' ' + w : w; if (c.measureText(tryL).width > maxW && line) { out.push(line); line = w; } else line = tryL; }
    if (line) out.push(line); c.restore(); return out;
  }
  // gelembung chat; side 'l' | 'r'; k = progres muncul
  function bubble(c, x, y, w, text, side, k, o = {}) {
    if (k <= 0) return 0;
    const size = o.size || 34, font = `600 ${size}px BODY`, lines = wrap(c, text, w - 60, font), lh = size * 1.3;
    const bh = lines.length * lh + 40 + (o.name ? size : 0) + (o.img ? 220 : 0), a = eBack(clamp(k));
    const bx = side === 'r' ? x + (1 - a) * 40 : x - (1 - a) * 40;
    c.save(); c.globalAlpha *= clamp(k * 2);
    rrect(c, bx, y, w, bh, 26, side === 'r' ? (o.color || '#d9fdd3') : (o.color || '#ffffff'));
    let ty = y + 26;
    if (o.name) { txt(c, o.name, bx + 30, ty + size * 0.3, { size: size * 0.85, align: 'left', font: 'body', color: o.nameColor || C.accent }); ty += size; }
    if (o.img) { rrect(c, bx + 24, ty, w - 48, 200, 14, '#cfc6b8'); o.img(c, bx + 24, ty, w - 48, 200); ty += 220; }
    lines.forEach((l, i) => txt(c, l, bx + 30, ty + size * 0.5 + i * lh, { size, align: 'left', font: 'body', color: '#1d1d1f' }));
    c.restore();
    return bh;
  }
  // label nama pembicara di atas caption
  function nameTag(c, t) {
    const who = speaker(t), lab = who && LABEL[who];
    if (!lab) return;
    const col = { DIMAS: CAST.dimas.shirt, BAYU: CAST.bayu.shirt, RANI: CAST.rani.hair, IBU: CAST.ibu.hair, PENAGIH: '#8a2b2b' }[lab];
    c.save(); c.font = `700 30px BODY`; const w = c.measureText(lab).width + 50; c.restore();
    rrect(c, 540 - w / 2, 1232, w, 50, 25, col);
    txt(c, lab, 540, 1258, { size: 30, color: '#fff', font: 'body', ls: 3 });
  }
  // kartu judul seri (awal) dan "bersambung" (akhir)
  function seriesBadge(c, t, until = 3) {
    const S = window.VIDEO.series; if (!S) return;
    const k = p(t, 0.1, 0.4) * (1 - p(t, until - 0.4, until));
    if (k <= 0) return;
    c.save(); c.globalAlpha *= k;
    rrect(c, 300, 150, 480, 64, 32, 'rgba(43,33,24,0.82)');
    c.restore();
    txt(c, `${S.name} · EP ${S.ep}/${S.of}`, 540, 184, { size: 30, color: '#f4ead6', font: 'body', ls: 4, alpha: k });
  }
  function endCard(c, lt, title, sub, o = {}) {
    c.fillStyle = '#2b2118'; c.fillRect(0, 0, 1080, 1920);
    const g = c.createRadialGradient(540, 760, 50, 540, 760, 900); g.addColorStop(0, 'rgba(201,154,46,0.25)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.fillRect(0, 0, 1080, 1920);
    const S = window.VIDEO.series, k = p(lt, 0.05, 0.4);
    txt(c, `${S.name} · EP ${S.ep}/${S.of}`, 540, 420, { size: 34, color: '#c9a77a', font: 'body', ls: 6, alpha: k });
    txt(c, title, 540, 600, { size: 130, color: '#f4ead6', alpha: k, scale: lerp(1.3, 1, eOut(k)), maxW: 940 });
    if (sub) txt(c, sub, 540, 760, { size: 50, color: C.accent2, alpha: p(lt, 0.5, 0.9), maxW: 900 });
    if (o.lines) o.lines.forEach((l, i) => txt(c, l, 160, (o.y0 || 880) + i * (o.gap || 70), { size: 38, align: 'left', color: '#f4ead6', font: 'body', alpha: p(lt, 0.6 + i * 0.25, 0.9 + i * 0.25), maxW: 800 }));
  }
  // ikon aplikasi
  function appIcon(c, x, y, s, label, col, k = 1) {
    if (k <= 0) return;
    const a = eBack(clamp(k));
    c.save(); c.translate(x, y); c.scale(a, a);
    rrect(c, -s / 2, -s / 2, s, s, s * 0.24, col);
    c.restore();
    txt(c, label, x, y + 4, { size: s * 0.42, color: '#fff', alpha: clamp(k * 2) });
  }

  return { CAST, FY, person, speaker, talking, room, nightTint, table, desk, cam, phone, wrap, bubble, nameTag, seriesBadge, endCard, appIcon };
};
