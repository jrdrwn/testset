# Template Prompt: Video Edukasi Pendek 9:16 dengan VO ElevenLabs

Template ini disusun dari pengalaman membuat video "Sisi Gelap Trading Forex" (`forex-dark-side/`).
Salin bagian **Prompt** di bawah, isi semua `{...}`, lalu kirim ke agent.
Bagian **Catatan teknis** sengaja ikut dikirim. Isinya masalah yang pernah muncul, jadi agent tidak perlu menemukannya ulang.

---

## Prompt

```
Buatkan motion video edukasi pendek berformat vertikal, dengan voice-over ElevenLabs dan caption yang sinkron per kata.

## Topik & tujuan
- Judul: {JUDUL, mis. "Sisi Gelap Pinjol"}
- Pesan utama: {1 kalimat, mis. "Pinjol ilegal menjebak lewat bunga harian dan teror penagihan."}
- Target penonton: {mis. "pekerja muda 20-30 tahun, awam soal keuangan"}
- Ajakan di akhir (CTA): {mis. "Kirim ini ke temanmu."}
- Disclaimer di layar: {mis. "Konten edukasi, bukan ajakan atau saran investasi."}

## Naskah
{PILIH SALAH SATU:}
(a) Tuliskan naskahnya dari topik di atas. Isinya 1 hook + {N, mis. 6} poin + 1 bagian "kalau tetap mau coba" + outro/CTA.
    Kalimat pendek dan tegas, bahasa sehari-hari, total sekitar {130-150} kata untuk {55} detik.
(b) Pakai naskah ini apa adanya:
    {tempel naskah per adegan}

Kirim naskah dan pembagian adegannya ke saya dulu sebelum render.

## Spesifikasi video
- Resolusi 1080x1920, 30 fps, durasi {55} detik.
- Gaya visual: ikuti `forex-dark-side/composition.js` (latar gelap, grid bergerak, aksen merah/kuning/hijau,
  font Noto Sans tebal, stamp "RED FLAG", glitch dan flash saat pergantian adegan, vignette + grain).
- Tiap adegan punya visual sendiri yang menjelaskan poinnya (angka, grafik, notifikasi, checklist), bukan hanya teks.
- Caption di bawah (y sekitar 1335), maks 3 kata per kelompok, kata aktif berwarna kuning dan membesar.
- Musik dan SFX disintesis di kode (drone, kick, whoosh, hit, ding), otomatis mengecil saat VO bicara.

## Voice-over
- ElevenLabs, voice: {Liam `TX3LPaxmHKxFdv7VOQHJ` | voice ID lain}, model `eleven_multilingual_v2`.
- Voice settings: stability 0.45, similarity_boost 0.8, style 0.3, speaker boost on.
- Speed dinaikkan hanya kalau baris tidak muat di slotnya, maks 1.2. Kalau masih kurang, pakai atempo seminimal mungkin.
- API key: {key} (pakai hanya di command, jangan simpan di file/repo).

## Sinkron caption
- Pakai endpoint `/v1/text-to-speech/{voice_id}/with-timestamps` dan simpan waktu mulai tiap kata caption.
- Tiap baris di `vo/lines.js` punya:
  - `cap`: teks di layar (boleh angka/simbol: "Rp500 juta", "1–2%", "0,2%").
  - `el`: yang diucapkan, dipisah `|`, satu potongan per kata caption
    (mis. cap "Rp500 juta." menjadi el "lima ratus|juta.").
- Highlight caption mengikuti waktu kata dari ElevenLabs, bukan perkiraan dari jumlah huruf.

## Struktur project
Buat folder `{slug-topik}/` dengan struktur yang sama seperti `forex-dark-side/`:
composition.js, exporter.js, mp4mux.js, render.js, index.html, fonts/, vo/lines.js,
vo/build-vo-elevenlabs.js, vo/voice.js (hasil generate). Folder `out/` masuk .gitignore.
Pakai ulang kode dari `forex-dark-side/`. Yang diganti: SCENES, fungsi draw tiap adegan, EV (timing SFX), dan lines.js.

## Verifikasi (wajib sebelum lapor selesai)
1. Semua baris VO muat di slotnya (log build tidak ada "OVER").
2. Transkripsi ulang audio hasil render dengan ElevenLabs Scribe: semua kalimat terbaca benar,
   dan tidak ada bunyi tambahan ("eh", napas) di awal baris.
3. Bandingkan waktu kata diucapkan dengan waktu caption: median di bawah 0,05 dtk, maks di bawah 0,15 dtk.
4. OCR beberapa frame untuk memastikan caption dan teks adegan tidak terpotong atau bertabrakan.
5. Cek durasi, resolusi, dan stream audio/video hasil MP4.
Laporkan angka hasil verifikasi, dan sebutkan bagian yang tidak bisa dicek (mis. tidak bisa mendengar/menonton).

## Output
- `{slug-topik}.mp4` (tanpa VO, jika diminta) dan `{slug-topik}-vo.mp4` di root repo.
- Commit ke branch baru, buka PR ke `main` di jrdrwn/testset, kirim link PR.
```

---

## Catatan teknis (sertakan di prompt)

```
Catatan lingkungan sandbox (dari project sebelumnya):
- Home dan /root/.local read-only, dan /tmp tidak bertahan antar command.
  Buat venv di /projects/sandbox/.venv dan folder kerja di /projects/sandbox/.work.
- ffmpeg tidak terpasang. Pakai binary dari `pip install imageio-ffmpeg`
  (cari path-nya dengan imageio_ffmpeg.get_ffmpeg_exe()).
- Render: Chromium ada di /inner_container/opt/playwright/chromium-1232/chrome-linux64/chrome,
  playwright-core ada di /inner_container/opt/toolchains/.nvm/versions/node/v22.23.4/lib/node_modules/@playwright/mcp/node_modules/playwright-core.
  Chromium crash (crashpad) kalau HOME read-only. Jalankan dengan
  HOME, XDG_CONFIG_HOME, XDG_CACHE_HOME, dan TMPDIR diarahkan ke folder yang bisa ditulis.
- OCR: rapidocr-onnxruntime + opencv-python-headless (versi opencv biasa gagal karena libGL tidak ada).
- API key ElevenLabs butuh izin: Text to Speech, Speech to Text, dan Voices Read.
  Yang dipakai sebagai key adalah nilai yang diawali "sk_", bukan key ID.
- Istilah Inggris (leverage, withdraw, stop loss) ditulis normal di `el`; ElevenLabs mengucapkannya dengan benar.
  Angka dan simbol ditulis sebagai kata ("nol koma dua persen", "satu banding lima ratus").
- Hasil TTS tidak deterministik. Kalau satu baris bermasalah, buat ulang baris itu saja: ONLY=1,7 node vo/build-vo-elevenlabs.js
```

---

## Contoh isian singkat

```
Judul: Sisi Gelap Pinjol
Pesan utama: Pinjol ilegal menjebak lewat bunga harian, biaya tersembunyi, dan teror penagihan.
Target: pekerja muda 20-30 tahun.
CTA: Kirim ini ke temanmu.
Disclaimer: Konten edukasi, bukan saran keuangan.
Naskah: (a), 1 hook + 6 poin + "kalau terpaksa pinjam" + outro, 55 detik.
Voice: Liam.
Slug: pinjol-dark-side
```
