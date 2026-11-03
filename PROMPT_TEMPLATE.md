# Template Prompt: Video Edukasi Pendek 9:16 (mandiri, tanpa folder project)

Dokumen ini berisi semua yang dibutuhkan agent untuk membuat video dari nol: brief, aturan kerja, katalog style, katalog voice, aturan thumbnail, dan **kode lengkap** yang sudah diuji.

Hasil uji template ini (3 November 2026, di sandbox Kiro). Semua file diekstrak **hanya dari dokumen ini** ke folder kosong, lalu dijalankan:
- Kelima style ter-render tanpa error.
- Demo 14 detik dengan VO Liam, style `dark-alert`: 31/31 kata caption cocok dengan ucapan, selisih median 0,015 dtk, maksimal 0,074 dtk.
- OCR caption 90%. Kata pendek seperti "per" atau "ke" kadang tidak terbaca OCR.
- 4 thumbnail dibuat: 3 varian 9:16 dan 1 ukuran 16:9. `verify.py`: LULUS.

## Cara pakai

Ada dua mode. Pilih salah satu.

**Mode Cepat (hanya judul).** Kirim dokumen ini dan tulis:

```
MODE CEPAT
Judul: {mis. "Sisi Gelap Pinjol"}
API key ElevenLabs: {sk_...}      (lewati kalau ELEVENLABS_API_KEY sudah di-set di environment)
```

Semua isian lain ditentukan agent sesuai aturan **2.0**. Agent bekerja sampai PR selesai tanpa berhenti, lalu melaporkan semua keputusan otomatisnya. Isian Bagian 1 tetap bisa ditambahkan untuk menimpa keputusan otomatis, misalnya `Style: neon-tech` atau `Durasi: 30`. Kalau ingin menyetujui naskah dulu, tambahkan baris `Berhenti di naskah: ya`.

**Mode Lengkap.**
1. Isi **Bagian 1 (Brief)**.
2. Kirim ke agent **seluruh dokumen ini** (Bagian 1 + 2 + 3) sebagai satu pesan, atau lampirkan file ini dan tulis "Ikuti PROMPT_TEMPLATE.md, ini brief-nya: ...".
3. Agent akan berhenti dua kali untuk minta persetujuan: setelah naskah, dan setelah preview gambar per adegan.

---

## BAGIAN 1 — Brief (isi semua `{...}`)

```
TOPIK & TUJUAN
- Judul video          : {mis. "Sisi Gelap Pinjol"}
- Slug (nama file)     : {mis. pinjol-dark-side}
- Pesan utama (1 kal.) : {mis. "Pinjol ilegal menjebak lewat bunga harian dan teror penagihan."}
- Target penonton      : {mis. pekerja muda 20-30 th, awam keuangan}
- Nada                 : {tegas & memperingatkan | santai & ramah | serius & berita | bercerita}
- CTA penutup          : {mis. "Kirim ini ke temanmu."}
- Disclaimer di layar  : {mis. "Konten edukasi, bukan saran keuangan." | tidak ada}
- Akun brand           : {default @wanadiary | handle lain | tidak ada}
- Sumber data/angka    : {tautan/sumber; atau "cari sendiri dan cantumkan sumbernya"}

FORMAT
- Durasi               : {30 | 45 | 55 | 60} detik
- Struktur             : {mis. hook + 5 poin + "kalau tetap mau coba" + outro}  (atau "tentukan sendiri")
- Naskah               : {(a) buatkan dari topik | (b) pakai naskah ini: ...}

STYLE (pilih satu dari katalog di Bagian 2, atau tulis "custom: ...")
- Style                : {dark-alert | clean-explainer | neon-tech | bold-news | editorial-story}
- Penyesuaian (opsional): {mis. "aksen hijau saja", "caption huruf kapital", "tanpa grain", "musik lebih pelan"}

VOICE-OVER
- Voice                : {Liam | Brian | Daniel | Sarah | Matilda | voice ID lain}
- Gaya bicara          : {energik | tenang | tegas}
- API key ElevenLabs   : {sk_...}   (butuh izin Text to Speech, Speech to Text, Voices Read)

THUMBNAIL
- Judul thumbnail      : {2-3 baris, total 3-6 kata, mis. "SISI GELAP" / "PINJOL"}
- Kata yang di-highlight: {mis. "PINJOL"}
- Subjudul             : {mis. "Bunga 0,8% per hari itu bukan kecil"}
- Badge                : {mis. "WASPADA" | kosong}
- Adegan latar         : {mis. "adegan angka bunga" | "pilihkan yang paling menarik"}
- Varian               : {A, B, C | salah satu}   + 16:9 untuk YouTube: {ya | tidak}

OUTPUT
- Repo                 : {mis. jrdrwn/testset}
- Folder project       : {slug}/
- File                 : {slug}.mp4 (tanpa VO): {ya | tidak}; {slug}-vo.mp4; thumbnail
- Kirim lewat          : branch baru + PR ke main
```

---

## BAGIAN 2 — Instruksi untuk agent

### 2.0 Mode Cepat: aturan isian otomatis

Berlaku kalau user menulis `MODE CEPAT`. Isian yang diberikan user selalu menang atas aturan ini. Isian yang tidak diberikan ditentukan sebagai berikut:

**Yang tetap wajib dari user atau environment:**
- **API key ElevenLabs.** Ambil dari env `ELEVENLABS_API_KEY` kalau ada. Kalau tidak ada, berhenti dan minta. Hanya ini yang boleh membuat agent berhenti.
- **Repo.** Pakai repo yang sedang dibuka di workspace. Kalau ada lebih dari satu, pakai yang berisi video atau project sebelumnya.

**Topik dan isi:**

| Isian | Aturan otomatis |
|---|---|
| Slug | Dari judul: huruf kecil, tanpa kata sambung (di, ke, dan, yang), spasi jadi `-`, maksimal 4 kata. Contoh: "Sisi Gelap Pinjol" → `sisi-gelap-pinjol`. Kalau folder sudah ada, tambahkan `-2`. |
| Pesan utama | Satu kalimat yang menjawab "apa yang harus penonton tahu atau lakukan setelah menonton?". |
| Target penonton | Default: orang Indonesia 18–35 tahun, awam soal topiknya. |
| Nada | Ikuti style terpilih (lihat tabel style di bawah). |
| Sumber data | Wajib riset dengan web search. Pakai sumber resmi atau tepercaya (regulator, lembaga negara, jurnal, media besar). Setiap angka di layar diberi sumber singkat (teks kecil). Kalau angka tidak bisa diverifikasi, jangan pakai angka. Pakai pernyataan umum. |
| Disclaimer | Topik keuangan/investasi: "Konten edukasi, bukan saran keuangan." Kesehatan: "Konten edukasi, bukan pengganti konsultasi dokter." Hukum: "Konten edukasi, bukan nasihat hukum." Lainnya: tanpa disclaimer. Tampil mulai detik ke-(durasi − 4). |
| CTA | "Kirim ini ke temanmu." Kalau topiknya tips atau cara: "Simpan biar nggak lupa." |
| Akun brand | `@wanadiary` (`VIDEO.handle`). Tampil otomatis sebagai watermark samar sepanjang video (`VIDEO.watermark`), sebagai pil di adegan terakhir, dan di semua thumbnail. Tidak perlu diucapkan di VO. |
| Sudut pandang | Brand @wanadiary membahas **keresahan**: hal yang meresahkan, merugikan, atau jarang dibicarakan. Bingkai topik sebagai keresahan nyata yang dialami penonton, lalu beri jalan keluar yang aman. |

**Format:**

| Isian | Aturan otomatis |
|---|---|
| Durasi | 55 detik. Pakai 30 detik kalau judulnya satu fakta atau satu tips saja. |
| Struktur 55 dtk | hook (0–3 dtk) + 5 poin (masing-masing sekitar 7,5 dtk) + "kalau tetap mau/cara aman" (sekitar 10 dtk, checklist) + outro/CTA (sekitar 4,5 dtk). |
| Struktur 30 dtk | hook (0–3 dtk) + 3 poin (masing-masing sekitar 7,5 dtk) + outro/CTA (sekitar 4,5 dtk). |
| Naskah | Buat sendiri sesuai 2.2, sekitar 2,4 kata per detik. Hook berupa angka mengejutkan atau pertanyaan langsung ke penonton. |

**Style (berdasarkan kata di judul/topik):**

| Kata kunci di judul/topik | Style | Voice |
|---|---|---|
| sisi gelap, bahaya, waspada, penipuan, scam, jebakan, risiko, ilegal, mitos | `dark-alert` | Liam |
| AI, teknologi, aplikasi, gadget, crypto, coding, internet, digital | `neon-tech` | Liam |
| fakta, terbaru, viral, heboh, ternyata, berita, data | `bold-news` | Daniel |
| kisah, sejarah, asal-usul, biografi, cerita, perjalanan | `editorial-story` | Brian |
| cara, tips, panduan, belajar, dasar, pemula, hemat, (lainnya) | `clean-explainer` | Sarah |

- Kalau lebih dari satu baris cocok, pakai baris paling atas.
- Gaya bicara mengikuti style: `dark-alert`/`neon-tech` energik, `bold-news` tegas, `editorial-story` tenang, `clean-explainer` energik.
- Tidak ada penyesuaian style. Pakai nilai `config.js` apa adanya.

**Thumbnail:**

| Isian | Aturan otomatis |
|---|---|
| Judul | Judul video dalam huruf kapital, dipecah jadi 2 baris (maksimal 3) dengan panjang mirip. Kalau judul lebih dari 6 kata, ringkas jadi 3–5 kata inti. |
| Highlight | Baris yang berisi kata paling spesifik (nama topik), biasanya baris terakhir. |
| Subjudul | Fakta atau angka paling mengejutkan dari naskah, maksimal 45 karakter. |
| Badge | `dark-alert`: "WASPADA". `bold-news`: "FAKTA". `neon-tech`: "WAJIB TAHU". `clean-explainer`: "TIPS". `editorial-story`: kosong. |
| Adegan latar | `bgTime` = detik di adegan poin pertama ketika angka atau visual utamanya sudah tampil penuh. |
| Varian | A, B, C (9:16) + 16:9. Sebutkan di laporan mana yang direkomendasikan dan alasannya. |

**Output:** `{slug}-vo.mp4`, `{slug}.mp4` (tanpa VO), dan semua thumbnail. Kirim lewat branch baru `video/{slug}` dan PR ke `main`.

**Alur Mode Cepat:** jalankan 2.1 tanpa berhenti di langkah 1 dan 3, kecuali user menulis `Berhenti di naskah: ya`. Pemeriksaan di langkah 3 (OCR still dan thumbnail) tetap wajib, hanya tidak perlu menunggu persetujuan. Laporan akhir (langkah 9) wajib menyertakan tabel **"Keputusan otomatis"**: slug, style + alasan, voice, durasi, struktur, sumber data yang dipakai, isi thumbnail, dan varian yang direkomendasikan. Dengan tabel itu user bisa minta revisi bagian tertentu saja.

### 2.1 Alur kerja (ikuti berurutan)

1. **Naskah.** Tulis naskah sesuai brief dan aturan 2.2. Kirim ke user dalam bentuk tabel per baris: `t0–t1 | caption di layar | yang diucapkan | visual adegan`. **Berhenti dan tunggu persetujuan.**
2. **Setup.** Buat folder `{slug}/` di repo, jalankan setup 2.7, lalu buat semua file dari Bagian 3 persis apa adanya. Yang diganti hanya:
   - `config.js`: VIDEO, STYLE_ID, THUMB. Tambah style custom di STYLES bila diminta.
   - `scenes.js`: adegan dan EV.
   - `vo/lines.js`: naskah.
3. **Preview visual.** Buat `vo/voice.js` sementara berisi `window.VO_DATA = undefined;`. Lalu jalankan `node render.js stills <1 detik di tengah tiap adegan>` dan `node render.js thumb`. Periksa dengan OCR (2.8 langkah 4). Kirim ke user daftar adegan beserta teks yang terbaca di tiap still. Kalau user bisa melihat gambar, push still ke branch. **Berhenti dan tunggu persetujuan.**
4. **VO.** Jalankan `node vo/build-vo-elevenlabs.js`. Kalau exit code 2 (baris OVER/PANJANG), pendekkan naskah baris itu atau perlebar slotnya, lalu ulangi. Setelah itu samakan waktu animasi penting di `scenes.js` dengan waktu kata di `vo/plan.json`. Contoh: angka muncul saat kata angkanya diucapkan.
5. **Render.** Jalankan `node render.js mp4`. Kalau brief minta versi tanpa VO, jalankan juga `NOVO=1 node render.js mp4`.
6. **Thumbnail.** Jalankan `node render.js thumb`.
7. **Verifikasi.** Jalankan `python tools/verify.py out/{slug}-vo.mp4`. Harus "LULUS". Kalau ada saran `ONLY=...`, buat ulang baris itu, lalu render dan verifikasi ulang.
8. **Kirim.** Salin `out/{slug}-vo.mp4`, `out/{slug}.mp4` (jika ada), dan `out/thumb-*.jpg` ke root repo. Commit `{slug}/` (tanpa `out/` dan `previews/`) ke branch baru, lalu buka PR ke `main`.
9. **Laporan ke user.** Isinya: link PR, angka hasil verify (cocok %, median, maks, OCR %), kecepatan per baris yang dinaikkan, perbedaan naskah ucapan vs caption, dan hal yang tidak bisa dicek (agent tidak bisa menonton/mendengar).

### 2.2 Aturan naskah dan `vo/lines.js`

- **Kecepatan bicara:** sekitar 2,3–2,6 kata per detik termasuk jeda. Contoh: 55 detik ≈ 125–145 kata. Slot tiap baris harus cukup untuk kata-katanya.
- **Hook:** baris pertama di 0,1–3 dtk berupa pertanyaan atau angka mengejutkan.
- **Satu baris = satu ide = satu adegan atau sub-adegan.** Kalimat pendek, maksimal sekitar 12 kata per kalimat.
- **Jeda antar baris:** `t0` baris berikutnya ≥ `t1` baris sebelumnya, dengan jeda 0,15–0,25 dtk. Baris terakhir selesai ≤ `duration − 0,05`.
- **`cap` (teks di layar)** boleh memakai angka dan simbol: "Rp1 juta", "0,8%", "1–2%", "1:500".
- **`el` (yang diucapkan)** wajib diisi kalau `cap` berisi angka, simbol, atau singkatan yang dibaca berbeda.
  - Format: satu potongan per kata `cap`, dipisah `|`, dan **jumlahnya harus sama**.
  - Contoh: cap `Bunga 0,8% per hari.` → el `Bunga|nol koma delapan persen|per|hari.`
  - Satu potongan boleh berisi beberapa kata ucapan (mis. `nol koma delapan persen`), tapi tidak boleh kosong.
- **Istilah Inggris** (leverage, withdraw, stop loss, trading) ditulis biasa. ElevenLabs mengucapkannya dengan benar. Jangan dieja ala Indonesia.
- **Singkatan umum** (OJK, VIP, BI) ditulis biasa. Jangan diberi spasi seperti "O J K", karena hasil alignment jadi kacau.
- **Batas kecepatan:** speed maksimal 1,2, atempo maksimal 1,15. Kalau lebih dari itu, build berhenti (exit 2). Solusinya pendekkan kalimat, bukan mempercepat suara.
- **Angka harus faktual** dan diberi sumber di layar (teks kecil, `font:'body'`, warna `C.muted`) bila mengutip statistik.

### 2.3 Aturan visual dan `scenes.js`

- Kanvas 1080×1920, 30 fps. Semua visual digambar dengan Canvas 2D di `scenes.js` memakai helper dari `K` (lihat komentar di `composition.js`):
  - Dasar: `txt`, `rrect`, `card`, `stamp`, `tag`.
  - Visual siap pakai: `counter`, `checklist`, `bars`, `notif`.
  - Easing dan progres: `p`, `eOut`, `eBack`, `lerp`, `clamp`, `rng`, `rp`.
- **Zona aman** (UI TikTok/Reels/Shorts menutupi tepi):
  - Konten utama di y 200–1250 dan x 60–1020.
  - Caption otomatis di y≈1335.
  - Disclaimer di y 1560, berupa teks kecil.
  - Jangan menaruh teks penting di y > 1450 atau di 120 px kanan (area tombol like/share).
- **Tiap adegan wajib punya visual yang menjelaskan poinnya**, misalnya angka yang menghitung, grafik batang, notifikasi, checklist, stamp, atau ikon. Tidak boleh hanya teks.
- **Animasi masuk:** 0,2–0,4 dtk dengan `eOut`/`eBack`. Elemen penting muncul bersamaan dengan kata yang diucapkan (lihat `vo/plan.json`).
- **Warna** selalu diambil dari `C` (`C.bg`, `C.panel`, `C.text`, `C.muted`, `C.accent`, `C.accent2`, `C.good`). Jangan hardcode warna, supaya pergantian style tetap konsisten.
- **Font:** `txt(..., {font:'body'})` untuk teks kecil atau sumber, default `head` untuk judul. Teks panjang beri `maxW` agar otomatis mengecil.
- **Adegan** harus menutup 0..duration tanpa celah. `accent` adegan mewarnai cahaya latar.
- **Adegan terakhir:** kosongkan area y 1140–1260. Area itu dipakai pil akun brand (`VIDEO.handle`, mis. @wanadiary) yang digambar otomatis oleh `composition.js`.
- **Watermark:** handle tampil samar (opacity 0,28, ukuran 30 px) di tengah y 1440 dari detik 0 sampai adegan terakhir, lalu memudar saat pil handle muncul. Watermark tidak ikut guncang, glitch, atau transisi. Jangan menaruh elemen adegan di y 1420–1460. Atur lewat `VIDEO.watermark` di `config.js` (`null` = tanpa watermark; opacity 0,2–0,35 masih tidak mengganggu).
- **EV (SFX)** dalam detik absolut:
  - `boom` [[t,kekuatan]]: dentuman + guncang, untuk hook atau fakta besar.
  - `hit`: pukulan kecil + flash, untuk pergantian poin.
  - `stamp`: saat stamp muncul.
  - `ding` [t,...]: tiap item checklist.
  - `blip`: angka muncul.
  - `riser` [[mulai,selesai]]: menjelang outro.
  - `whoosh` otomatis di awal tiap adegan.

### 2.4 Katalog style (nilai lengkapnya ada di `config.js`)

| ID | Cocok untuk | Latar | Font judul / isi | Transisi | Caption | Musik |
|---|---|---|---|---|---|---|
| `dark-alert` | peringatan, scam, "sisi gelap", risiko | gelap + grid bergerak, aksen merah/kuning/hijau | Noto Sans 900 / Noto Sans | glitch + flash | kata aktif kuning membesar (pop) | drone tegang + kick |
| `clean-explainer` | edukasi santai, tips, keuangan dasar | krem terang + titik-titik, kartu putih berbayang | Poppins Black / Poppins Bold | slide | kata aktif di kotak oranye (box) | upbeat ringan |
| `neon-tech` | teknologi, AI, crypto, gadget | ungu gelap + scanline, aksen magenta/cyan | Montserrat 900 / JetBrains Mono | zoom | kapital, garis bawah cyan (underline) | synth 120 bpm |
| `bold-news` | berita, fakta mengejutkan, "breaking" | hitam + garis diagonal, bar merah atas-bawah | Anton / Noto Sans | flash putih | kapital, kotak hitam di belakang (pop) | beat berita + tik-tik |
| `editorial-story` | cerita, sejarah, biografi, refleksi | kertas krem bertekstur, tinta gelap + merah bata | Playfair Display / Noto Sans | fade | garis bawah merah bata, 4 kata per grup | pad tenang + petikan |

**Style custom:** salin satu entri di `STYLES`, beri ID baru, lalu ubah:
- `colors`: hex 6 digit, karena aksen dipakai sebagai `accent + '33'`.
- `fonts`: nama dari daftar di `tools/fonts.js`. Kalau butuh font lain, tambahkan URL Google Fonts ke daftar itu.
- `bg`: `grid` | `dots` | `scanlines` | `stripes` | `paper`.
- `transition`: `glitch` | `slide` | `zoom` | `flash` | `fade`.
- `caption.mode`: `pop` | `box` | `underline`.
- `music`: `tension` | `upbeat` | `synth` | `news` | `calm`.
- `grain` (0–0,12), `vignette` (0–0,7), `shake` (0–1).

### 2.5 Katalog voice ElevenLabs (premade, ID tetap)

| Nama | voice_id | Karakter | Cocok untuk style |
|---|---|---|---|
| Liam | `TX3LPaxmHKxFdv7VOQHJ` | pria muda, energik, gaya konten sosial | dark-alert, neon-tech, clean-explainer |
| Brian | `nPczCjzI2devNBz1zQrb` | pria, dalam, menenangkan | editorial-story |
| Daniel | `onwK4e9ZLuTAKqWW03F9` | pria, gaya penyiar berita | bold-news |
| Adam | `pNInz6obpgDQGcFmaJgB` | pria, tegas, dominan | dark-alert |
| Sarah | `EXAVITQu4vr4xnSDxMaL` | wanita muda, percaya diri | clean-explainer |
| Matilda | `XrExE9yKIg1WjnnlVkGX` | wanita, profesional | clean-explainer, bold-news |
| Jessica | `cgSgspJ2msm6clMCkdW9` | wanita muda, ceria | clean-explainer |

- Model: `eleven_multilingual_v2`. Bahasa Indonesia terbaca baik walau label voice-nya "en".
- Gaya bicara lewat env:
  - energik: `STABILITY=0.4 STYLE=0.4`
  - tenang: `STABILITY=0.6 STYLE=0.15`
  - tegas: `STABILITY=0.5 STYLE=0.3`
- Kalau voice tidak ada di tabel, cari ID-nya dengan `curl -H "xi-api-key: $ELEVENLABS_API_KEY" "https://api.elevenlabs.io/v2/voices?page_size=100"` (butuh izin Voices Read).

### 2.6 Aturan thumbnail

- `node render.js thumb` menghasilkan `out/thumb-A-916.jpg`, `thumb-B-916.jpg`, `thumb-C-916.jpg` (1080×1920, cover Reels/TikTok/Shorts) dan `out/thumb-169.jpg` (1280×720, YouTube).
- **Latar** = frame video pada `THUMB.bgTime` tanpa caption, di-blur (`THUMB.blur`, default 14) dan digelapkan atau diterangkan sesuai style. Pilih detik ketika visual adegannya paling kuat, misalnya angka besar atau stamp.
- **Varian 9:16:**
  - A: judul di tengah, badge kecil di atasnya.
  - B: judul di atas, badge besar di tengah bawah.
  - C: visual tajam di atas, judul di blok bawah.
- **Varian 16:9:** judul rata kiri, badge di kanan atas.
- **Isi judul:** 3–6 kata, maksimal 3 baris, huruf kapital. Satu baris di-highlight dengan warna aksen (`THUMB.highlight` berisi teks baris yang persis sama).
- **Subjudul:** maksimal sekitar 45 karakter. Ukuran teks menyesuaikan otomatis agar tidak terpotong.
- Teks thumbnail tidak boleh sama persis dengan hook caption. Thumbnail menjanjikan hasil, hook memancing rasa penasaran.
- **Akun brand** (`VIDEO.handle`) otomatis tampil di bawah subjudul (9:16) atau kiri bawah (16:9).
- **Grid profil Instagram** memotong cover 9:16 menjadi 3:4 di tengah (y sekitar 240–1680). Judul, subjudul, dan handle harus berada di area itu. Layout A/B/C sudah memenuhi aturan ini; periksa ulang kalau mengubah layout.
- Ukuran file thumbnail < 2 MB (dicek oleh `verify.py`).
- Periksa dengan OCR (2.8 langkah 4) bahwa semua baris judul terbaca utuh dan tidak menempel ke tepi.

### 2.7 Setup lingkungan (sandbox Kiro; sesuaikan bila beda)

Kondisi sandbox yang perlu diketahui:
- Home dan `/root/.local` read-only.
- `/tmp` tidak bertahan antar command.
- ffmpeg tidak terpasang.
- Chromium crash (crashpad) kalau HOME read-only.
- `opencv-python` biasa gagal karena libGL tidak ada. Pakai versi headless.

```bash
# di root workspace (mis. /projects/sandbox)
python -m venv .venv
./.venv/bin/pip install -q elevenlabs imageio-ffmpeg rapidocr-onnxruntime opencv-python-headless
./.venv/bin/pip uninstall -y -q opencv-python; ./.venv/bin/pip install -q --force-reinstall --no-deps opencv-python-headless
mkdir -p .work/home

# set di setiap command (env tidak bertahan antar command)
export FFMPEG=$(./.venv/bin/python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
export HOME=$PWD/.work/home XDG_CONFIG_HOME=$PWD/.work/home XDG_CACHE_HOME=$PWD/.work/home TMPDIR=$PWD/.work/home
export CHROME=/inner_container/opt/playwright/chromium-1232/chrome-linux64/chrome
export PW=/inner_container/opt/toolchains/.nvm/versions/node/v22.23.4/lib/node_modules/@playwright/mcp/node_modules/playwright-core
export ELEVENLABS_API_KEY='sk_...'      # jangan ditulis ke file atau commit

# di folder project
node tools/fonts.js                     # unduh font sesuai STYLE_ID (ulang setiap ganti style)
```

- Kalau path Chromium atau playwright-core berbeda, cari dengan `find / -name chrome -path "*chrome-linux*" 2>/dev/null` dan `find / -type d -name playwright-core 2>/dev/null`.
- Di luar sandbox, cukup `npm i playwright-core` dan `npx playwright install chromium`, lalu hapus env `CHROME`/`PW`.
- Butuh Node ≥ 18 (fetch bawaan) dan Chromium dengan WebCodecs (H.264 + Opus).

### 2.8 Verifikasi (wajib sebelum lapor selesai)

`tools/verify.py` memeriksa langkah 1–5 berikut. Ambang lulusnya:

1. **Stream:** 1080×1920, ada audio, durasi = `duration` ±0,05 dtk.
2. **Transkripsi Scribe:** semua kalimat naskah terbaca. Tidak ada kata di luar naskah seperti "eh" atau napas. Kalau ada, buat ulang baris itu dengan `ONLY=n`.
3. **Sinkron caption:** ≥ 90% kata cocok, selisih median ≤ 0,05 dtk, maksimal ≤ 0,15 dtk.
4. **OCR caption:** ≥ 85% kata terlihat saat diucapkan. Kata 2–3 huruf sering gagal dibaca OCR, dan itu wajar.
5. **Thumbnail:** ada, dan tiap file < 2 MB.

Untuk cek layout still/thumbnail secara manual, OCR dengan RapidOCR lalu tandai teks yang menempel ke tepi (≤ 8 px):

```python
from rapidocr_onnxruntime import RapidOCR; import cv2, sys
ocr = RapidOCR()
for f in sys.argv[1:]:
    h, w = cv2.imread(f).shape[:2]; res, _ = ocr(f)
    print(f, [(t, int(min(p[1] for p in b)), 'EDGE' if min(p[0] for p in b) < 8 or max(p[0] for p in b) > w - 8 else '') for b, t, _ in res or []])
```

### 2.9 Masalah yang pernah terjadi dan solusinya

| Gejala | Penyebab | Solusi |
|---|---|---|
| `missing the permission voices_read` / `user_read` | izin API key kurang | tambah izin di ElevenLabs → Settings → API Keys |
| `API key ID used as API key` | yang dikirim key ID (64 hex) | pakai nilai `sk_...` yang muncul saat key dibuat |
| Chromium `chrome_crashpad_handler: --database is required` | HOME read-only | set HOME/XDG_*/TMPDIR ke folder yang bisa ditulis |
| `libGL.so.1` saat import cv2 | opencv versi GUI | pasang `opencv-python-headless` (lihat 2.7) |
| Font fallback / teks tampak beda | `fonts/HEAD.ttf` belum diunduh untuk style itu | `node tools/fonts.js` setelah ganti `STYLE_ID` |
| Ada "eh" atau napas di awal baris | TTS tidak deterministik | `ONLY=<baris> node vo/build-vo-elevenlabs.js`, lalu render ulang |
| Build exit 2 (OVER/PANJANG) | naskah terlalu panjang untuk slot | pendekkan kalimat atau perlebar `t0/t1` dan adegan terkait |
| `jumlah potongan el != jumlah kata cap` | `el` tidak sejajar dengan `cap` | hitung kata `cap` (dipisah spasi) dan samakan jumlah potongan `el` |
| Singkatan dieja aneh / alignment kacau | singkatan ditulis berspasi ("O J K") | tulis biasa: "OJK" |

---

## BAGIAN 3 — Kode lengkap

Buat struktur ini, lalu isi setiap file **persis** seperti blok di bawahnya:

```
{slug}/
  .gitignore            (isi: out/ dan previews/)
  config.js             <- ubah: VIDEO, STYLE_ID, THUMB
  scenes.js             <- ubah: adegan + EV (contoh di bawah = demo 14 dtk)
  vo/lines.js           <- ubah: naskah (contoh di bawah = demo 14 dtk)
  vo/voice.js           <- dihasilkan build-vo-elevenlabs.js
  vo/plan.json          <- dihasilkan build-vo-elevenlabs.js
  vo/build-vo-elevenlabs.js
  composition.js
  exporter.js
  mp4mux.js
  render.js
  index.html
  tools/fonts.js
  tools/verify.py
  fonts/HEAD.ttf, fonts/BODY.ttf   <- dihasilkan tools/fonts.js
```

Contoh `scenes.js` dan `vo/lines.js` di bawah adalah demo 14 detik tentang pinjol. Demo ini dipakai saat menguji template. Pakai sebagai pola, lalu ganti seluruh isinya untuk topik baru.




#### File: `config.js`

````js
// ===== Konfigurasi video: SATU-SATUNYA file yang wajib diubah selain scenes.js dan vo/lines.js =====
window.VIDEO = {
  slug: 'contoh-topik',                 // nama file output: <slug>.mp4, <slug>-vo.mp4
  title: 'Judul Video',
  duration: 14,                         // detik; harus >= t1 baris VO terakhir + 0.05
  disclaimer: 'Konten edukasi, bukan saran keuangan.',
  disclaimerFrom: 11,                   // detik mulai disclaimer tampil (null = tidak tampil)
  handle: '@wanadiary',                 // akun brand: tampil di adegan terakhir + thumbnail ('' = tidak tampil)
  watermark: { opacity: 0.28, size: 30, y: 1440 }, // handle samar sepanjang video (null = tanpa watermark)
};
window.STYLE_ID = 'dark-alert';         // pilih salah satu key di STYLES

// Thumbnail/cover. Ditampilkan di atas frame video pada detik bgTime (tanpa caption).
window.THUMB = {
  bgTime: 2.0,
  lines: ['JUDUL BESAR', 'DI SINI'],    // 2-3 baris, total 3-6 kata
  highlight: ['DI SINI'],               // kata/baris yang diberi warna aksen
  sub: 'Subjudul pendek pemancing rasa ingin tahu',
  badge: 'WASPADA',                     // label stamp kecil; '' = tanpa badge
  variants: ['A', 'B', 'C'],            // 9:16 -> A: judul tengah, B: judul atas + badge besar, C: judul di blok bawah
  blur: 14,                             // blur latar (px); 0 = tajam
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
````

#### File: `scenes.js`

````js
// Isi visual video. Ganti seluruh isi makeScenes untuk topik baru.
// Aturan: tiap adegan = { id, t0, t1, accent, draw(c, lt, t) }; lt = detik sejak adegan mulai.
// Adegan harus menutup 0..DURATION tanpa celah. Waktu animasi penting disamakan dengan waktu kata di VO.
// EV = timing SFX (detik absolut). whoosh default = awal tiap adegan.
window.makeScenes = function (K) {
  const { C, p, eOut, eBack, clamp, lerp, txt, tag, stamp, counter, checklist, bars, notif, card, rp } = K;

  function sHook(c, lt) {
    tag(c, 'CONTOH TOPIK', 250, C.accent);
    const k = p(lt, 0.3, 0.6);
    if (k > 0) txt(c, '3 DARI 5', 540, 700, { size: 190, scale: lerp(2.2, 1, eOut(k)), alpha: clamp(k * 3), stroke: C.bg, sw: 14 });
    const k2 = p(lt, 0.9, 1.2);
    if (k2 > 0) txt(c, 'ORANG TERJEBAK', 540, 880 + 30 * (1 - eOut(k2)), { size: 70, alpha: k2, color: C.accent });
    stamp(c, 'WASPADA', 540, 1080, p(lt, 1.8, 2.1));
  }
  function sStat(c, lt) {
    txt(c, 'BUNGA PER HARI', 540, 300, { size: 56, ls: 8, color: C.muted, font: 'body' });
    counter(c, 0, 0.8, p(lt, 0.1, 1.0), 540, 460, { size: 200, color: C.accent2, format: v => v.toFixed(1).replace('.', ',') + '%' });
    bars(c, [{ label: 'PINJAMAN', value: 1, text: rp(1e6), color: C.muted }, { label: '90 HARI', value: 1.72, text: rp(1.72e6), color: C.accent }], p(lt, 1.2, 2.4));
  }
  function sTips(c, lt) {
    tag(c, 'CEK DULU', 250, C.good);
    checklist(c, [
      { t: 0.2, text: 'Terdaftar OJK', sub: 'cek di ojk.go.id' },
      { t: 1.0, text: 'Bunga jelas', sub: 'tertulis sebelum setuju' },
      { t: 1.8, text: 'Tidak minta akses kontak' },
    ], lt, { y: 420, gap: 170 });
    notif(c, lt, 2.6, 1000, 'Penagihan', 'Data kontakmu akan kami hubungi...', { color: C.accent });
  }
  function sOutro(c, lt) {
    const k = p(lt, 0.1, 0.4);
    card(c, 120, 520, 840, 420, { alpha: k });
    txt(c, 'PINJAM SEPERLUNYA', 540, 650, { size: 74, alpha: k, maxW: 760 });
    txt(c, 'Bayar tepat waktu.', 540, 770, { size: 46, alpha: k, color: C.muted, font: 'body' });
    txt(c, 'Kirim ke temanmu →', 540, 870, { size: 44, alpha: p(lt, 0.8, 1.1), color: C.accent2, font: 'body' });
  }

  const SCENES = [
    { id: 'hook', t0: 0, t1: 3, accent: C.accent, draw: sHook },
    { id: 'stat', t0: 3, t1: 7, accent: C.accent2, draw: sStat },
    { id: 'tips', t0: 7, t1: 11, accent: C.good, draw: sTips },
    { id: 'outro', t0: 11, t1: 14, accent: C.accent2, draw: sOutro },
  ];
  const EV = {
    boom: [[0.3, 0.8]],            // [detik, kekuatan] dentuman + guncang
    hit: [[3, 0.6], [7, 0.5]],     // pukulan kecil + flash
    stamp: [[1.8, 0.7]],
    ding: [7.2, 8.0, 8.8],         // ding naik nada (checklist)
    blip: [4.2],
    riser: [[13.0, 14.0]],         // [mulai, selesai]
  };
  return { SCENES, EV };
};
````

#### File: `vo/lines.js`

````js
// Naskah VO. Satu baris = satu slot waktu di video.
//  t0/t1 : slot (detik). VO baris ini mulai tepat di t0 dan harus selesai sebelum t1.
//  cap   : teks caption di layar (boleh angka/simbol: "Rp1 juta", "0,8%", "1–2%").
//  el    : (opsional) yang diucapkan ElevenLabs, dipisah '|', JUMLAH POTONGAN = JUMLAH KATA cap.
//          Wajib diisi kalau cap mengandung angka/simbol/singkatan yang dibaca beda.
const VO_LINES = [
  { t0: 0.1, t1: 2.95, cap: 'Tiga dari lima orang terjebak pinjol ilegal.' },
  { t0: 3.1, t1: 6.9, cap: 'Bunga 0,8% per hari. Rp1 juta jadi Rp1,7 juta.',
    el: 'Bunga|nol koma delapan persen|per|hari.|Satu|juta|jadi|satu koma tujuh|juta.' },
  { t0: 7.1, t1: 10.9, cap: 'Cek dulu: terdaftar OJK, bunga jelas, tanpa akses kontak.' },
  { t0: 11.1, t1: 13.95, cap: 'Pinjam seperlunya. Kirim ini ke temanmu.' },
];
if (typeof module !== 'undefined') module.exports = { VO_LINES };
else window.VO_LINES = VO_LINES;
````

#### File: `vo/build-vo-elevenlabs.js`

````js
// Membuat vo/voice.js (PCM base64 per baris + waktu mulai tiap kata caption) dan vo/plan.json (untuk verifikasi).
// Env: ELEVENLABS_API_KEY (wajib), VOICE_ID (default Liam), MODEL_ID, FFMPEG (path ffmpeg, untuk atempo cadangan),
//      ONLY=1,4 (buat ulang baris tertentu saja), STABILITY/SIMILARITY/STYLE (opsional).
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
global.window = global.window || {};
require('../config.js');
const { VO_LINES } = require('./lines.js');

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) { console.error('ELEVENLABS_API_KEY belum di-set'); process.exit(1); }
const VOICE_ID = process.env.VOICE_ID || 'TX3LPaxmHKxFdv7VOQHJ'; // Liam
const MODEL_ID = process.env.MODEL_ID || 'eleven_multilingual_v2';
const FFMPEG = process.env.FFMPEG || '';
const SR = 24000, MAX_SPEED = 1.2, MAX_ATEMPO = 1.15; // di atas ini suara terdengar terburu-buru: pendekkan naskah
const VS = { stability: +(process.env.STABILITY || 0.45), similarity_boost: +(process.env.SIMILARITY || 0.8), style: +(process.env.STYLE || 0.3), use_speaker_boost: true };

// satu potongan ucapan per kata caption
function units(ln) {
  const capWords = ln.cap.split(' ');
  const u = ln.el ? ln.el.split('|').map(s => s.trim()) : capWords;
  if (u.length !== capWords.length) throw new Error(`jumlah potongan el (${u.length}) != jumlah kata cap (${capWords.length}): ${ln.cap}`);
  return u;
}
async function tts(text, speed) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=pcm_${SR}`, {
    method: 'POST', headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings: { ...VS, speed } }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const d = await res.json(), b = Buffer.from(d.audio_base64, 'base64');
  return { pcm: new Int16Array(b.buffer.slice(b.byteOffset, b.byteOffset + (b.length & ~1))), al: d.alignment };
}
function trim(pcm) { // buang hening awal/akhir; off = detik yang dibuang di depan
  const th = 300, pad = Math.round(SR * 0.02);
  let a = 0, b = pcm.length - 1;
  while (a < b && Math.abs(pcm[a]) < th) a++;
  while (b > a && Math.abs(pcm[b]) < th) b--;
  const s = Math.max(0, a - pad);
  return { pcm: pcm.slice(s, Math.min(pcm.length, b + pad)), off: s / SR };
}
function atempo(pcm, ratio) { // percepat tanpa ubah pitch (cadangan terakhir)
  const tin = path.join(os.tmpdir(), `vo-in-${process.pid}.raw`), tout = path.join(os.tmpdir(), `vo-out-${process.pid}.raw`);
  fs.writeFileSync(tin, Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength));
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', String(SR), '-ac', '1', '-i', tin, '-af', `atempo=${ratio.toFixed(4)}`, '-f', 's16le', tout]);
  const b = fs.readFileSync(tout); fs.unlinkSync(tin); fs.unlinkSync(tout);
  return new Int16Array(b.buffer.slice(b.byteOffset, b.byteOffset + (b.length & ~1)));
}
function loadExisting() {
  const src = fs.readFileSync(path.join(__dirname, 'voice.js'), 'utf8');
  return JSON.parse(src.slice(src.indexOf('=') + 1).trim().replace(/;$/, ''));
}

(async () => {
  const D = window.VIDEO.duration;
  VO_LINES.forEach((ln, i) => {
    if (ln.t1 <= ln.t0) throw new Error(`baris ${i}: t1 <= t0`);
    if (i && ln.t0 < VO_LINES[i - 1].t1) throw new Error(`baris ${i}: tumpang tindih dengan baris sebelumnya`);
    if (ln.t1 > D) throw new Error(`baris ${i}: t1 ${ln.t1} melewati durasi video ${D}`);
  });
  const only = process.env.ONLY ? new Set(process.env.ONLY.split(',').map(Number)) : null;
  const out = only ? loadExisting() : [];
  let over = 0;
  for (const [i, ln] of VO_LINES.entries()) {
    if (only && !only.has(i)) continue;
    const u = units(ln), text = u.join(' ');
    const starts = []; let pos = 0;
    u.forEach(w => { starts.push(pos); pos += w.length + 1; });
    const slot = (ln.t1 - ln.t0) * 0.97;
    let speed = 1.0, r, t, dur;
    for (let k = 0; k < 3; k++) {
      r = await tts(text, speed); t = trim(r.pcm); dur = t.pcm.length / SR;
      if (dur <= slot || speed >= MAX_SPEED) break;
      speed = Math.min(MAX_SPEED, +(speed * (dur / slot) * 1.02).toFixed(3));
    }
    if (r.al.characters.join('') !== text) throw new Error(`alignment tidak cocok di baris ${i}`);
    let wt = starts.map(s => Math.max(0, r.al.character_start_times_seconds[s] - t.off));
    let pcm = t.pcm, stretch = 1;
    if (dur > slot && FFMPEG) { stretch = dur / (slot * 0.99); pcm = atempo(pcm, stretch); wt = wt.map(x => x / stretch); dur = pcm.length / SR; }
    const fit = dur > slot ? 'OVER' : stretch > MAX_ATEMPO ? 'PANJANG' : 'ok'; if (fit !== 'ok') over++;
    console.log(`${String(i).padStart(2)} ${ln.t0.toFixed(2)}-${ln.t1.toFixed(2)} slot ${slot.toFixed(2)}s  vo ${dur.toFixed(2)}s  speed ${speed}${stretch > 1 ? ` atempo ${stretch.toFixed(2)}` : ''}  ${fit}  | ${text}`);
    out[i] = { sr: SR, dur: +dur.toFixed(3), speed, wt: wt.map(x => +x.toFixed(3)), b64: Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength).toString('base64') };
  }
  fs.writeFileSync(path.join(__dirname, 'voice.js'), `// generated by build-vo-elevenlabs.js — ElevenLabs ${MODEL_ID}, voice ${VOICE_ID}\nwindow.VO_DATA = ${JSON.stringify(out)};\n`);
  // rencana caption: kata, kata pertama yang diucapkan, detik absolut
  const plan = [];
  VO_LINES.forEach((ln, i) => {
    const u = units(ln);
    ln.cap.split(' ').forEach((w, j) => plan.push({ line: i, cap: w, say: u[j], t: +(ln.t0 + out[i].wt[j]).toFixed(3) }));
  });
  fs.writeFileSync(path.join(__dirname, 'plan.json'), JSON.stringify(plan, null, 1));
  console.log(`wrote vo/voice.js + vo/plan.json`);
  if (over) { console.log(`${over} baris OVER/PANJANG: pendekkan naskah baris itu atau perlebar slotnya, lalu build ulang.`); process.exit(2); }
})().catch(e => { console.error(e.message); process.exit(1); });
````

#### File: `composition.js`

````js
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

  // pil akun brand (mis. @wanadiary); k = progres muncul, s = skala
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
````

#### File: `exporter.js`

````js
// Export offline frame-akurat dengan WebCodecs -> MP4 (H.264 + Opus). Butuh mp4mux.js.
async function fontsReady() {
  await Promise.all([document.fonts.load('900 40px HEAD'), document.fonts.load('700 40px BODY')]);
  if (!document.fonts.check('40px HEAD') || !document.fonts.check('40px BODY')) throw new Error('font HEAD/BODY gagal dimuat (cek fonts/*.ttf)');
}
async function exportMP4(ctx, log = () => {}) {
  await fontsReady();
  const { W, H, FPS, DURATION } = COMP;
  const frames = Math.round(DURATION * FPS), TS = 90000, FD = TS / FPS;
  const vSamples = []; let avcC = null;
  const ve = new VideoEncoder({
    output: (chunk, meta) => {
      if (meta && meta.decoderConfig && meta.decoderConfig.description && !avcC) avcC = new Uint8Array(meta.decoderConfig.description);
      const d = new Uint8Array(chunk.byteLength); chunk.copyTo(d);
      vSamples.push({ data: d, ts: chunk.timestamp, key: chunk.type === 'key' });
    },
    error: e => { throw e; },
  });
  ve.configure({ codec: 'avc1.640028', width: W, height: H, bitrate: window.EXPORT_BITRATE || 12_000_000, framerate: FPS, avc: { format: 'avc' }, latencyMode: 'quality' });
  for (let i = 0; i < frames; i++) {
    COMP.render(ctx, i / FPS);
    const vf = new VideoFrame(ctx.canvas, { timestamp: Math.round((i * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
    ve.encode(vf, { keyFrame: i % (FPS * 2) === 0 }); vf.close();
    while (ve.encodeQueueSize > 4) await new Promise(r => setTimeout(r, 1));
    if (i % 60 === 0) log(`video ${i}/${frames}`);
  }
  await ve.flush(); ve.close();
  vSamples.sort((a, b) => a.ts - b.ts);
  const video = { width: W, height: H, timescale: TS, avcC, samples: vSamples.map(s => ({ data: s.data, key: s.key, duration: FD })) };
  log('audio');
  const sr = 48000, au = COMP.synthAudio(sr), aSamples = []; let preSkip = 312;
  const ae = new AudioEncoder({
    output: (chunk, meta) => {
      if (meta && meta.decoderConfig && meta.decoderConfig.description) {
        const h = new Uint8Array(meta.decoderConfig.description); // OpusHead, little endian
        if (h.length >= 12) preSkip = h[10] | (h[11] << 8);
      }
      const d = new Uint8Array(chunk.byteLength); chunk.copyTo(d);
      aSamples.push({ data: d, duration: Math.round((chunk.duration * sr) / 1e6) || 960 });
    },
    error: e => { throw e; },
  });
  ae.configure({ codec: 'opus', sampleRate: sr, numberOfChannels: 2, bitrate: 160000 });
  const BL = 4800;
  for (let o = 0; o < au.L.length; o += BL) {
    const n = Math.min(BL, au.L.length - o), buf = new Float32Array(n * 2);
    buf.set(au.L.subarray(o, o + n), 0); buf.set(au.R.subarray(o, o + n), n);
    const ad = new AudioData({ format: 'f32-planar', sampleRate: sr, numberOfFrames: n, numberOfChannels: 2, timestamp: Math.round((o * 1e6) / sr), data: buf });
    ae.encode(ad); ad.close();
  }
  await ae.flush(); ae.close();
  log('mux');
  return MP4MUX.mux(video, { sampleRate: sr, channels: 2, preSkip, timescale: sr, samples: aSamples });
}
````

#### File: `mp4mux.js`

````js
// Minimal MP4 muxer (H.264 video + Opus audio), moov-first ("faststart").
(function () {
  const enc = new TextEncoder();
  function u32(n) { return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]; }
  function u16(n) { return [(n >>> 8) & 255, n & 255]; }
  function cat(parts) {
    let len = 0; for (const p of parts) len += p.length;
    const out = new Uint8Array(len); let o = 0;
    for (const p of parts) { out.set(p, o); o += p.length; }
    return out;
  }
  const bytes = a => (a instanceof Uint8Array ? a : new Uint8Array(a));
  function box(type, ...payload) {
    const body = cat(payload.map(bytes));
    return cat([new Uint8Array(u32(body.length + 8)), enc.encode(type), body]);
  }
  const full = (type, v, f, ...p) => box(type, [v, (f >> 16) & 255, (f >> 8) & 255, f & 255], ...p);
  const MATRIX = [0x00010000, 0, 0, 0, 0x00010000, 0, 0, 0, 0x40000000].flatMap(u32);

  function stbl(entry, durations, sizes, offsets, syncs) {
    // stts run-length
    const runs = [];
    for (const d of durations) { const l = runs[runs.length - 1]; if (l && l[1] === d) l[0]++; else runs.push([1, d]); }
    const parts = [
      full('stsd', 0, 0, u32(1), entry),
      full('stts', 0, 0, u32(runs.length), runs.flatMap(([c, d]) => [...u32(c), ...u32(d)])),
    ];
    if (syncs) parts.push(full('stss', 0, 0, u32(syncs.length), syncs.flatMap(u32)));
    parts.push(
      full('stsc', 0, 0, u32(1), [...u32(1), ...u32(1), ...u32(1)]),
      full('stsz', 0, 0, u32(0), u32(sizes.length), sizes.flatMap(u32)),
      full('stco', 0, 0, u32(offsets.length), offsets.flatMap(u32)),
    );
    return box('stbl', ...parts);
  }
  const dinf = () => box('dinf', full('dref', 0, 0, u32(1), full('url ', 0, 1)));
  function trak(id, kind, timescale, duration, movieDur, entry, s, width, height) {
    const tkhd = full('tkhd', 0, 3, u32(0), u32(0), u32(id), u32(0), u32(movieDur), new Uint8Array(8),
      u16(0), u16(0), u16(kind === 'soun' ? 0x0100 : 0), u16(0), MATRIX, u32(width << 16), u32(height << 16));
    const mdhd = full('mdhd', 0, 0, u32(0), u32(0), u32(timescale), u32(duration), u16(0x55c4), u16(0));
    const hdlr = full('hdlr', 0, 0, u32(0), enc.encode(kind), new Uint8Array(12), enc.encode(kind === 'vide' ? 'VideoHandler\0' : 'SoundHandler\0'));
    const mh = kind === 'vide' ? full('vmhd', 0, 1, new Uint8Array(8)) : full('smhd', 0, 0, new Uint8Array(4));
    return box('trak', tkhd, box('mdia', mdhd, hdlr, box('minf', mh, dinf(), stbl(entry, s.durations, s.sizes, s.offsets, s.syncs))));
  }

  // video: {width,height,timescale,avcC,samples:[{data,duration,key}]}
  // audio: {sampleRate,channels,preSkip,timescale,samples:[{data,duration}]}
  function mux(video, audio) {
    const ftyp = box('ftyp', enc.encode('isom'), u32(0x200), enc.encode('isomiso2avc1mp41'));
    const vEntry = box('avc1', new Uint8Array(6), u16(1), new Uint8Array(16), u16(video.width), u16(video.height),
      u32(0x00480000), u32(0x00480000), u32(0), u16(1), new Uint8Array(32), u16(0x18), u16(0xffff), box('avcC', video.avcC));
    const aEntry = box('Opus', new Uint8Array(6), u16(1), new Uint8Array(8), u16(audio.channels), u16(16), u16(0), u16(0), u32(48000 << 16),
      box('dOps', [0, audio.channels], u16(audio.preSkip), u32(audio.sampleRate), u16(0), [0]));
    const vd = video.samples.reduce((a, s) => a + s.duration, 0), ad = audio.samples.reduce((a, s) => a + s.duration, 0);
    const MT = 1000, movieDur = Math.max(Math.round(vd / video.timescale * MT), Math.round(ad / audio.timescale * MT));

    function build(base) {
      let off = base; const vo = [], ao = [];
      // interleave ~0.5 s blocks for smooth playback
      let vi = 0, ai = 0, vt = 0, at = 0; const order = [];
      while (vi < video.samples.length || ai < audio.samples.length) {
        const vNext = vi < video.samples.length ? vt / video.timescale : Infinity;
        const aNext = ai < audio.samples.length ? at / audio.timescale : Infinity;
        if (vNext <= aNext) { order.push(['v', vi]); vo[vi] = off; off += video.samples[vi].data.length; vt += video.samples[vi].duration; vi++; }
        else { order.push(['a', ai]); ao[ai] = off; off += audio.samples[ai].data.length; at += audio.samples[ai].duration; ai++; }
      }
      const vs = { durations: video.samples.map(s => s.duration), sizes: video.samples.map(s => s.data.length), offsets: vo, syncs: video.samples.map((s, i) => (s.key ? i + 1 : 0)).filter(Boolean) };
      const as = { durations: audio.samples.map(s => s.duration), sizes: audio.samples.map(s => s.data.length), offsets: ao };
      const mvhd = full('mvhd', 0, 0, u32(0), u32(0), u32(MT), u32(movieDur), u32(0x00010000), u16(0x0100), new Uint8Array(10), MATRIX, new Uint8Array(24), u32(3));
      const moov = box('moov', mvhd,
        trak(1, 'vide', video.timescale, vd, movieDur, vEntry, vs, video.width, video.height),
        trak(2, 'soun', audio.timescale, ad, movieDur, aEntry, as, 0, 0));
      return { moov, order };
    }
    const first = build(0);
    const mdatStart = ftyp.length + first.moov.length + 8;
    const { moov, order } = build(mdatStart);
    let payload = 0; for (const s of video.samples) payload += s.data.length; for (const s of audio.samples) payload += s.data.length;
    const out = new Uint8Array(mdatStart + payload);
    out.set(ftyp, 0); out.set(moov, ftyp.length);
    out.set([...u32(payload + 8), ...enc.encode('mdat')], ftyp.length + moov.length);
    let o = mdatStart;
    for (const [k, i] of order) { const d = (k === 'v' ? video.samples : audio.samples)[i].data; out.set(d, o); o += d.length; }
    return out;
  }
  window.MP4MUX = { mux };
})();
````

#### File: `render.js`

````js
// Pemakaian:
//   node render.js mp4                     -> out/<slug>-vo.mp4 (pakai NOVO=1 untuk versi tanpa VO -> out/<slug>.mp4)
//   node render.js stills 0.5,3.2,8        -> previews/tXX.XX.jpg (cek visual per detik)
//   node render.js thumb                   -> out/thumb-<varian>-916.jpg (1080x1920) dan -169.jpg (1280x720)
// Env: CHROME (path chrome), PW (path modul playwright-core), BITRATE, NOVO=1.
const path = require('path'), fs = require('fs');
const { chromium } = require(process.env.PW || 'playwright-core');
const CHROME = process.env.CHROME || '/inner_container/opt/playwright/chromium-1232/chrome-linux64/chrome';
(async () => {
  const [mode, arg] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: CHROME, chromiumSandbox: false, args: ['--disable-crash-reporter', '--disable-breakpad', '--no-zygote', '--disable-dev-shm-usage'] });
  const page = await b.newPage();
  page.on('console', m => console.log('[page]', m.text()));
  page.on('pageerror', e => { console.log('[pageerror]', e.message); process.exitCode = 1; });
  if (process.env.NOVO) await page.addInitScript(() => Object.defineProperty(window, 'VO_DATA', { get: () => undefined, set: () => {} }));
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.evaluate(() => fontsReady());
  const slug = await page.evaluate(() => VIDEO.slug);
  const outDir = path.join(__dirname, 'out'), prevDir = path.join(__dirname, 'previews');
  fs.mkdirSync(outDir, { recursive: true }); fs.mkdirSync(prevDir, { recursive: true });
  const jpg = (f, data) => { fs.writeFileSync(f, Buffer.from(data.split(',')[1], 'base64')); console.log(f); };
  if (mode === 'stills') {
    for (const t of arg.split(',').map(Number)) {
      const data = await page.evaluate(t => { const c = document.getElementById('c'); COMP.render(c.getContext('2d'), t); return c.toDataURL('image/jpeg', 0.85); }, t);
      jpg(path.join(prevDir, `t${t.toFixed(2).padStart(5, '0')}.jpg`), data);
    }
  } else if (mode === 'thumb') {
    const variants = await page.evaluate(() => THUMB.variants || ['A']);
    // 9:16 untuk tiap varian; 16:9 (YouTube) satu layout: teks kiri + badge kanan atas
    const jobs = variants.map(v => [v, 1080, 1920, '916']).concat([[variants[0], 1280, 720, '169']]);
    for (const [v, w, h, tag] of jobs) {
      const data = await page.evaluate(([v, w, h]) => {
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        COMP.renderThumb(c.getContext('2d'), v); return c.toDataURL('image/jpeg', 0.9);
      }, [v, w, h]);
      jpg(path.join(outDir, tag === '169' ? 'thumb-169.jpg' : `thumb-${v}-916.jpg`), data);
    }
  } else if (mode === 'mp4') {
    await page.exposeFunction('nodeLog', m => console.log(m));
    if (process.env.BITRATE) await page.evaluate(b => (window.EXPORT_BITRATE = b), Number(process.env.BITRATE));
    const parts = await page.evaluate(async () => {
      const bytes = await exportMP4(document.getElementById('c').getContext('2d'), m => nodeLog(m));
      const chunks = []; const CH = 1 << 22;
      for (let o = 0; o < bytes.length; o += CH) {
        const s = bytes.subarray(o, o + CH); let bin = '';
        for (let i = 0; i < s.length; i += 0x8000) bin += String.fromCharCode.apply(null, s.subarray(i, i + 0x8000));
        chunks.push(btoa(bin));
      }
      return chunks;
    });
    const f = path.join(outDir, process.env.OUT || `${slug}${process.env.NOVO ? '' : '-vo'}.mp4`);
    fs.writeFileSync(f, Buffer.concat(parts.map(p => Buffer.from(p, 'base64'))));
    console.log('wrote', f, fs.statSync(f).size);
  } else { console.log('mode: mp4 | stills <t,..> | thumb'); }
  await b.close();
})();
````

#### File: `index.html`

````html
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>motion video</title>
<style>
  @font-face { font-family: HEAD; src: url(fonts/HEAD.ttf) format('truetype'); font-weight: 100 900; }
  @font-face { font-family: BODY; src: url(fonts/BODY.ttf) format('truetype'); font-weight: 100 900; }
  html,body { margin:0; background:#000; color:#ccc; font-family: BODY, sans-serif; }
  #wrap { display:flex; flex-direction:column; align-items:center; gap:12px; padding:12px; }
  canvas { height: 85vh; aspect-ratio: 9/16; background:#000; }
  button { font: 700 16px BODY, sans-serif; padding: 10px 18px; border-radius: 8px; border: 0; cursor: pointer; }
</style>
</head>
<body>
<div id="wrap">
  <canvas id="c" width="1080" height="1920"></canvas>
  <div><button id="play">▶ Putar</button> <button id="dl">⬇ Export MP4</button> <span id="status"></span></div>
</div>
<script src="config.js"></script>
<script src="vo/lines.js"></script>
<script src="vo/voice.js"></script>
<script src="scenes.js"></script>
<script src="composition.js"></script>
<script src="mp4mux.js"></script>
<script src="exporter.js"></script>
<script>
  const cv = document.getElementById('c'), ctx = cv.getContext('2d'), st = document.getElementById('status');
  fontsReady().then(() => COMP.render(ctx, 0.0));
  let raf, ac;
  document.getElementById('play').onclick = async () => {
    cancelAnimationFrame(raf); if (ac) ac.close();
    ac = new AudioContext({ sampleRate: 48000 });
    const a = COMP.synthAudio(48000), b = ac.createBuffer(2, a.L.length, 48000);
    b.copyToChannel(a.L, 0); b.copyToChannel(a.R, 1);
    const src = ac.createBufferSource(); src.buffer = b; src.connect(ac.destination);
    const t0 = ac.currentTime + 0.05; src.start(t0);
    const loop = () => { const t = ac.currentTime - t0; COMP.render(ctx, Math.max(0, Math.min(t, COMP.DURATION - 1e-3))); if (t < COMP.DURATION) raf = requestAnimationFrame(loop); };
    loop();
  };
  document.getElementById('dl').onclick = async () => {
    const bytes = await exportMP4(ctx, m => (st.textContent = m));
    const url = URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }));
    Object.assign(document.createElement('a'), { href: url, download: VIDEO.slug + '.mp4' }).click();
  };
</script>
</body>
</html>
````

#### File: `tools/fonts.js`

````js
// Unduh font untuk style aktif ke fonts/HEAD.ttf dan fonts/BODY.ttf (sumber: github.com/google/fonts, lisensi OFL).
const fs = require('fs'), path = require('path');
global.window = {}; require('../config.js');
const BASE = 'https://github.com/google/fonts/raw/main/ofl/';
const URLS = {
  NotoSans: 'notosans/NotoSans%5Bwdth,wght%5D.ttf',
  Montserrat: 'montserrat/Montserrat%5Bwght%5D.ttf',
  JetBrainsMono: 'jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf',
  PlayfairDisplay: 'playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf',
  'Poppins-Black': 'poppins/Poppins-Black.ttf',
  'Poppins-Bold': 'poppins/Poppins-Bold.ttf',
  Anton: 'anton/Anton-Regular.ttf',
  BebasNeue: 'bebasneue/BebasNeue-Regular.ttf',
};
(async () => {
  const S = window.STYLES[window.STYLE_ID], dir = path.join(__dirname, '..', 'fonts');
  fs.mkdirSync(dir, { recursive: true });
  for (const [slot, name] of [['HEAD', S.fonts.head], ['BODY', S.fonts.body]]) {
    if (!URLS[name]) throw new Error('font tidak ada di daftar: ' + name);
    const r = await fetch(BASE + URLS[name]); if (!r.ok) throw new Error(`${name}: HTTP ${r.status}`);
    const b = Buffer.from(await r.arrayBuffer()); fs.writeFileSync(path.join(dir, slot + '.ttf'), b);
    console.log(`${slot}.ttf <- ${name} (${b.length} bytes)`);
  }
})().catch(e => { console.error(e.message); process.exit(1); });
````

#### File: `tools/verify.py`

````python
"""Verifikasi hasil render.
Pemakaian: python tools/verify.py out/<slug>-vo.mp4 [--cap-y 1335] [--no-ocr]
Cek: (1) durasi/resolusi/stream, (2) transkripsi ElevenLabs Scribe vs naskah, (3) selisih waktu kata diucapkan vs caption,
     (4) OCR caption pada waktu tiap kata, (5) file thumbnail. Env: ELEVENLABS_API_KEY, FFMPEG.
Keluar dengan kode 1 kalau ada ambang yang gagal."""
import json, os, re, subprocess, sys, glob, tempfile

FF = os.environ.get("FFMPEG", "ffmpeg")
args = sys.argv[1:]
mp4 = args[0]
cap_y = int(args[args.index("--cap-y") + 1]) if "--cap-y" in args else 1335
do_ocr = "--no-ocr" not in args
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
plan = json.load(open(os.path.join(root, "vo", "plan.json")))
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
fail = []

# 1) stream info
info = subprocess.run([FF, "-hide_banner", "-i", mp4], capture_output=True, text=True).stderr
dur = re.search(r"Duration: (\d+):(\d+):([\d.]+)", info)
dur = int(dur[1]) * 3600 + int(dur[2]) * 60 + float(dur[3])
res = re.search(r"Video: .*?(\d{3,4})x(\d{3,4})", info)
has_audio = "Audio:" in info
print(f"[1] durasi {dur:.2f}s, resolusi {res[1]}x{res[2]}, audio {'ada' if has_audio else 'TIDAK ADA'}")
if (res[1], res[2]) != ("1080", "1920") or not has_audio:
    fail.append("stream")

# 2+3) STT
tmp = tempfile.mkdtemp()
mp3 = os.path.join(tmp, "a.mp3")
subprocess.run([FF, "-y", "-loglevel", "error", "-i", mp4, "-vn", "-ac", "1", "-b:a", "128k", mp3], check=True)
from elevenlabs.client import ElevenLabs
cl = ElevenLabs(api_key=os.environ["ELEVENLABS_API_KEY"])
r = cl.speech_to_text.convert(file=open(mp3, "rb"), model_id="scribe_v1", timestamps_granularity="word", language_code="ind")
words = [(w.text, w.start) for w in r.words if w.type == "word"]
print("[2] transkripsi:", r.text)
k, diffs, miss = 0, [], []
for pw in plan:
    first = norm(pw["say"].split(" ")[0])
    for s in range(k, min(k + 4, len(words))):
        if norm(words[s][0]) == first or (len(first) > 3 and norm(words[s][0]).startswith(first[:4])):
            pw["spoken"] = words[s][1]; k = s + 1; break
    if "spoken" in pw: diffs.append((abs(pw["spoken"] - pw["t"]), pw["cap"], pw["t"], pw["spoken"]))
    else: miss.append(pw["cap"])
a = sorted(d[0] for d in diffs)
med, mx = a[len(a) // 2], a[-1]
print(f"[3] kata caption {len(plan)}, cocok {len(diffs)} ({len(diffs)/len(plan):.0%}), selisih median {med:.3f}s, maks {mx:.3f}s")
for d in sorted(diffs, reverse=True)[:5]: print(f"     {d[0]:.2f}s  '{d[1]}' caption {d[2]:.2f} ucapan {d[3]:.2f}")
if miss: print("     tidak cocok:", " ".join(miss))
if len(diffs) / len(plan) < 0.9 or med > 0.05 or mx > 0.15: fail.append("sync")
redo = sorted({pw["line"] for pw in plan if "spoken" in pw and abs(pw["spoken"] - pw["t"]) > 0.12})
if redo: print(f"     saran: buat ulang baris ini (biasanya napas/'eh' di awal): ONLY={','.join(map(str, redo))} node vo/build-vo-elevenlabs.js")
# bunyi tambahan di awal baris (mis. "eh") = kata STT yang bukan bagian naskah
script = set(norm(x) for pw in plan for x in pw["say"].split(" "))
extra = [w for w, _ in words if norm(w) and norm(w) not in script and not any(norm(w).startswith(sc[:4]) for sc in script if len(sc) > 3)]
if extra: print("     kata di luar naskah (cek manual):", extra)

# 4) OCR caption
if do_ocr:
    from rapidocr_onnxruntime import RapidOCR
    ocr, ok, bad = RapidOCR(), 0, []
    for pw in plan:
        f = os.path.join(tmp, "f.jpg")
        subprocess.run([FF, "-y", "-loglevel", "error", "-ss", f"{pw['t'] + 0.15:.3f}", "-i", mp4, "-frames:v", "1",
                        "-vf", f"crop=1080:240:0:{cap_y - 120}", f], check=True)
        out, _ = ocr(f)
        txt = norm("".join(t for _, t, _ in (out or [])))
        want = norm(pw["cap"])[:5]
        if want and want in txt: ok += 1
        else: bad.append(f"{pw['cap']}@{pw['t']:.2f}")
    print(f"[4] OCR caption: {ok}/{len(plan)} kata terlihat tepat waktu ({ok/len(plan):.0%})")
    if bad: print("     tidak terbaca:", " ".join(bad[:15]))
    if ok / len(plan) < 0.85: fail.append("ocr")

# 5) thumbnail
th = sorted(glob.glob(os.path.join(root, "out", "thumb-*.jpg")))
print(f"[5] thumbnail: {len(th)} file", [os.path.basename(x) + f" {os.path.getsize(x)//1024}KB" for x in th])
if not th or any(os.path.getsize(x) > 2 * 1024 * 1024 for x in th): fail.append("thumb")

print("HASIL:", "LULUS" if not fail else "GAGAL " + ", ".join(fail))
sys.exit(1 if fail else 0)
````

#### File: `.gitignore`

````
out/
previews/
````
