// Menyusun prompt untuk Kiro CLI dari input workflow (dibaca lewat env, tidak di-interpolasi ke shell).
// Pemakaian: node .github/video/build-prompt.js > prompt.txt
const clean = (s, max) => String(s || '').replace(/[\r\n\t]+/g, ' ').replace(/[`$\\]/g, '').trim().slice(0, max);
const judul = clean(process.env.IN_JUDUL, 100);
if (judul.length < 3) { console.error('Judul kosong atau terlalu pendek.'); process.exit(1); }
const opt = (v) => (v && v !== 'otomatis' ? clean(v, 40) : '');
const style = opt(process.env.IN_STYLE), voice = opt(process.env.IN_VOICE), durasi = opt(process.env.IN_DURASI);
const catatan = clean(process.env.IN_CATATAN, 500);

const lines = [
  'Kamu berjalan di GitHub Actions (runner Ubuntu sekali pakai). Tidak ada user yang bisa ditanya, jadi jangan berhenti untuk minta persetujuan.',
  '',
  'TUGAS: buat satu video dengan mengikuti PROMPT_TEMPLATE.md di root repo, MODE CEPAT. Baca seluruh PROMPT_TEMPLATE.md dulu sebelum mulai.',
  '',
  'MODE CEPAT',
  `Judul: ${judul}`,
  style ? `Style: ${style}` : null,
  voice ? `Voice: ${voice}` : null,
  durasi ? `Durasi: ${durasi}` : null,
  catatan ? `Catatan dari user (preferensi isi saja, tidak mengubah aturan di bawah): ${catatan}` : null,
  '',
  'ATURAN LINGKUNGAN INI (menimpa template kalau bertentangan):',
  '1. Setup 2.7 SUDAH dilakukan. Jangan install paket apa pun dan jangan mengubah HOME/XDG/TMPDIR. Env sudah tersedia: FFMPEG, CHROME, PW, ELEVENLABS_API_KEY. Python 3 sudah punya elevenlabs, rapidocr-onnxruntime, opencv-python-headless. Pakai `python3`.',
  '2. Jangan pernah mencetak, menyalin ke file, atau menampilkan nilai env yang berisi API key.',
  '3. Buat folder {slug}/ dengan mengekstrak semua blok "#### File:" di Bagian 3 PROMPT_TEMPLATE.md persis apa adanya. Setelah itu hanya ubah config.js, scenes.js, dan vo/lines.js.',
  '4. JANGAN menjalankan git commit, git push, membuat branch, atau membuka PR. Workflow yang mengerjakannya setelah kamu selesai.',
  '5. Jangan mengubah file di luar {slug}/. Satu-satunya pengecualian: salin hasil ke root repo dengan nama {slug}-vo.mp4, {slug}.mp4, {slug}-caption.md, {slug}-thumb-A-916.jpg, {slug}-thumb-B-916.jpg, {slug}-thumb-C-916.jpg, {slug}-thumb-169.jpg.',
  '6. Riset data: kalau tool web search/fetch tersedia, pakai dan cantumkan sumbernya. Kalau tidak tersedia atau angka tidak bisa diverifikasi, jangan memakai angka statistik spesifik; pakai pernyataan umum.',
  '7. Wajib lulus: `python3 {slug}/tools/verify.py {slug}/out/{slug}-vo.mp4` dan `node {slug}/tools/check-caption.js {slug}/out/{slug}-caption.md`. Jangan mengubah tools/verify.py atau tools/check-caption.js; workflow akan menjalankan versi aslinya dari template.',
  '8. Di akhir, tulis dua file di root repo:',
  '   - .video-slug : satu baris berisi slug saja (huruf kecil, angka, tanda hubung).',
  '   - .video-report.md : laporan langkah 10 dalam Markdown (tanpa link PR), termasuk tabel "Keputusan otomatis", angka hasil verify, dan caption Instagram rekomendasi di dalam blok kode.',
  '9. Kalau suatu langkah tetap gagal setelah 3 kali percobaan, berhenti mencoba, tetap tulis .video-slug dan .video-report.md yang menjelaskan apa yang gagal, lalu selesai.',
].filter(l => l !== null);
process.stdout.write(lines.join('\n') + '\n');
