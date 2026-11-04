// Cek file caption upload (<slug>-caption.md) terhadap batas tiap platform.
// Pemakaian: node tools/check-caption.js out/<slug>-caption.md
// Format file: tiap bagian diawali "## <Platform> ..." lalu satu blok ``` berisi teks siap tempel.
// Platform dikenali dari judul bagian: Instagram, TikTok, YouTube Judul, YouTube Deskripsi, Komentar, Alt text.
const fs = require('fs');
const md = fs.readFileSync(process.argv[2], 'utf8');
// urutan penting: aturan yang lebih spesifik dicek dulu
// Sumber batas (Nov 2026): Instagram maks 5 hashtag per post/Reel sejak Des 2025, caption 2.200; TikTok 2.200 lewat API (4.000 di app);
// YouTube judul 100, deskripsi 5.000. Baris pertama dipotong "lainnya" sekitar 125 (IG) / 100 (TikTok) karakter.
const RULES = [
  { key: /alt text/i, name: 'Alt text', max: 1000, tags: [0, 0] },
  { key: /komentar/i, name: 'Komentar tersemat', max: 300, tags: [0, 0] },
  { key: /youtube.*judul/i, name: 'YouTube judul', max: 100, tags: [0, 2] },
  { key: /youtube.*deskripsi/i, name: 'YouTube deskripsi', max: 5000, tags: [1, 5] },
  { key: /tiktok/i, name: 'TikTok', max: 2200, tags: [1, 5], first: 100 },
  { key: /instagram/i, name: 'Instagram', max: 2200, tags: [1, 5], first: 125 },
];
const len = s => [...s].length; // hitung emoji sebagai 1 karakter
const sections = md.split(/\n(?=## )/).filter(s => s.startsWith('## '));
let fail = 0, seen = new Set();
for (const s of sections) {
  const title = s.split('\n')[0].slice(3).trim();
  const block = (s.match(/```[a-z]*\n([\s\S]*?)\n```/) || [])[1];
  const rule = RULES.find(r => r.key.test(title));
  if (!rule || block == null) continue;
  seen.add(rule.name);
  const n = len(block), tags = (block.match(/(^|\s)#[\p{L}\p{N}_]+/gu) || []).length;
  const firstLine = block.split('\n')[0], fl = len(firstLine);
  const errs = [];
  if (n > rule.max) errs.push(`panjang ${n} > ${rule.max}`);
  if (tags < rule.tags[0] || tags > rule.tags[1]) errs.push(`hashtag ${tags} (harus ${rule.tags[0]}–${rule.tags[1]})`);
  if (rule.first && fl > rule.first) errs.push(`baris pertama ${fl} > ${rule.first} (terpotong "lainnya")`);
  if (/\{|\}/.test(block)) errs.push('masih ada placeholder {…}');
  console.log(`${errs.length ? 'GAGAL' : 'ok   '}  ${title}: ${n} karakter, ${tags} hashtag${rule.first ? `, baris pertama ${fl}` : ''}${errs.length ? '  -> ' + errs.join('; ') : ''}`);
  if (errs.length) fail++;
}
for (const need of ['Instagram', 'TikTok', 'YouTube judul', 'YouTube deskripsi']) if (!seen.has(need)) { console.log(`GAGAL  bagian "${need}" tidak ditemukan`); fail++; }
console.log(fail ? `HASIL: GAGAL (${fail})` : 'HASIL: LULUS');
process.exit(fail ? 1 : 0);
