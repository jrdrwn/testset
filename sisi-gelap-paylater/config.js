// ===== Konfigurasi video: SATU-SATUNYA file yang wajib diubah selain scenes.js dan vo/lines.js =====
window.VIDEO = {
  slug: 'sisi-gelap-paylater',          // nama file output: <slug>.mp4, <slug>-vo.mp4
  title: 'Sisi Gelap Paylater',
  duration: 55,                         // detik; harus >= t1 baris VO terakhir + 0.05
  disclaimer: 'Konten edukasi, bukan saran keuangan.',
  disclaimerFrom: 51,                   // detik mulai disclaimer tampil (null = tidak tampil)
  handle: '@wanadiary.id',              // akun brand: tampil di adegan terakhir + thumbnail ('' = tidak tampil)
  watermark: { opacity: 0.28, size: 30, y: 1440 }, // handle samar sepanjang video (null = tanpa watermark)
};
window.STYLE_ID = 'dark-alert';         // pilih salah satu key di STYLES

// Thumbnail/cover. Ditampilkan di atas frame video pada detik bgTime (tanpa caption).
window.THUMB = {
  bgTime: 7.6,                          // adegan poin pertama: limit paylater berubah jadi UTANG
  lines: ['SISI GELAP', 'PAYLATER'],
  highlight: ['PAYLATER'],
  sub: 'Utang paylater kita hampir Rp40 triliun',
  badge: 'WASPADA',
  variants: ['A', 'B', 'C'],
  blur: 14,
};

// ===== Katalog style. Font diunduh ke fonts/HEAD.ttf dan fonts/BODY.ttf (lihat setup). =====
window.STYLES = {
  'dark-alert': {   // peringatan, scam, sisi gelap, risiko
    colors: { bg: '#06070a', panel: '#12151d', text: '#f4f5f7', muted: '#8a90a0', accent: '#ff2d4a', accent2: '#ffd60a', good: '#1fe39a', line: 'rgba(255,255,255,0.045)' },
    fonts: { head: 'NotoSans', body: 'NotoSans' }, headWeight: 900, bodyWeight: 700,
    bg: 'grid', transition: 'glitch', grain: 0.06, vignette: 0.65, shake: 1,
    caption: { mode: 'pop', y: 1335, size: 72, maxWords: 3, color: '#f4f5f7', active: '#ffd60a', stroke: '#000', sw: 14, backdrop: null, upper: false },
    music: 'tension', bpm: 100,
    thumb: { overlay: 'rgba(6,7,10,0.62)', stroke: '#000', textColor: '#f4f5f7', hl: '#ffd60a', badge: '#ff2d4a' },
  },
  'clean-explainer': {   // edukasi santai, tips, finansial dasar
    colors: { bg: '#f6f4ef', panel: '#ffffff', text: '#14213d', muted: '#6b7280', accent: '#ff6b4a', accent2: '#2ec4b6', good: '#2ec4b6', line: 'rgba(20,33,61,0.06)' },
    fonts: { head: 'Poppins-Black', body: 'Poppins-Bold' }, headWeight: 900, bodyWeight: 700,
    bg: 'dots', transition: 'slide', grain: 0.0, vignette: 0.12, shake: 0.25,
    caption: { mode: 'box', y: 1335, size: 66, maxWords: 3, color: '#14213d', active: '#ffffff', boxColor: '#ff6b4a', stroke: '#ffffff', sw: 10, backdrop: null, upper: false },
    music: 'upbeat', bpm: 112,
    thumb: { overlay: 'rgba(246,244,239,0.70)', stroke: '#ffffff', textColor: '#14213d', hl: '#ff6b4a', badge: '#2ec4b6' },
  },
  'neon-tech': {   // teknologi, AI, crypto, gadget
    colors: { bg: '#070314', panel: '#120b2a', text: '#eef1ff', muted: '#8b8fb8', accent: '#ff2bd6', accent2: '#22e7ff', good: '#7cff6b', line: 'rgba(34,231,255,0.07)' },
    fonts: { head: 'Montserrat', body: 'JetBrainsMono' }, headWeight: 900, bodyWeight: 700,
    bg: 'scanlines', transition: 'zoom', grain: 0.05, vignette: 0.55, shake: 0.6,
    caption: { mode: 'underline', y: 1335, size: 68, maxWords: 3, color: '#eef1ff', active: '#22e7ff', stroke: '#070314', sw: 12, backdrop: null, upper: true },
    music: 'synth', bpm: 120,
    thumb: { overlay: 'rgba(7,3,20,0.60)', stroke: '#070314', textColor: '#eef1ff', hl: '#22e7ff', badge: '#ff2bd6' },
  },
  'bold-news': {   // berita, fakta mengejutkan, "breaking"
    colors: { bg: '#0b0b0b', panel: '#1a1a1a', text: '#ffffff', muted: '#a3a3a3', accent: '#e10600', accent2: '#ffcc00', good: '#22c55e', line: 'rgba(255,255,255,0.05)' },
    fonts: { head: 'Anton', body: 'NotoSans' }, headWeight: 400, bodyWeight: 700,
    bg: 'stripes', transition: 'flash', grain: 0.04, vignette: 0.5, shake: 0.8,
    caption: { mode: 'pop', y: 1335, size: 70, maxWords: 3, color: '#ffffff', active: '#ffcc00', stroke: null, sw: 0, backdrop: 'rgba(0,0,0,0.85)', upper: true },
    music: 'news', bpm: 96,
    thumb: { overlay: 'rgba(11,11,11,0.55)', stroke: '#000', textColor: '#ffffff', hl: '#ffcc00', badge: '#e10600' },
  },
  'editorial-story': {   // storytelling, sejarah, biografi, refleksi
    colors: { bg: '#efe6d6', panel: '#f8f2e7', text: '#2b2118', muted: '#7a6a58', accent: '#b5462f', accent2: '#c99a2e', good: '#4f7a4a', line: 'rgba(43,33,24,0.06)' },
    fonts: { head: 'PlayfairDisplay', body: 'NotoSans' }, headWeight: 800, bodyWeight: 600,
    bg: 'paper', transition: 'fade', grain: 0.10, vignette: 0.35, shake: 0,
    caption: { mode: 'underline', y: 1335, size: 64, maxWords: 4, color: '#2b2118', active: '#b5462f', stroke: '#efe6d6', sw: 10, backdrop: null, upper: false },
    music: 'calm', bpm: 76,
    thumb: { overlay: 'rgba(239,230,214,0.66)', stroke: '#efe6d6', textColor: '#2b2118', hl: '#b5462f', badge: '#b5462f' },
  },
};
