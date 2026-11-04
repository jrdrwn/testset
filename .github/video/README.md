# Buat video lewat GitHub Actions

Workflow `.github/workflows/buat-video.yml` membuat satu video Reels/TikTok dari **judul saja**. Workflow menjalankan Kiro CLI (mode headless) yang mengikuti `PROMPT_TEMPLATE.md` Mode Cepat. Hasilnya berupa PR berisi video, thumbnail, dan caption.

## Persiapan (sekali saja)

1. **Merge PR #1 ke `main`.** Tombol "Run workflow" hanya muncul untuk workflow yang ada di branch default.
2. **API key Kiro:** buka [app.kiro.dev](https://app.kiro.dev) → Account → API Keys → Create key. Key diawali `ksk_`. Fitur ini butuh paket Pro, Pro+, atau Power.
3. **Isi secrets repo:** GitHub → Settings → Secrets and variables → Actions → New repository secret:
   - `KIRO_API_KEY`: key Kiro (`ksk_...`)
   - `ELEVENLABS_API_KEY`: key ElevenLabs (`sk_...`), dengan izin Text to Speech, Speech to Text, dan Voices Read
4. **Izin workflow:** Settings → Actions → General → Workflow permissions → centang "Allow GitHub Actions to create and approve pull requests".

## Cara pakai

1. Buka tab **Actions** → **Buat video** → **Run workflow**. Bisa dari browser HP.
2. Isi **judul**. Kolom lain boleh dibiarkan `otomatis`.
3. Tunggu sampai selesai, biasanya 15–40 menit.
4. Hasilnya bisa diambil dari tiga tempat:
   - **PR baru** `Video: <slug>`, berisi file siap upload di root.
   - **Artifact** `video-<slug>` di halaman run, untuk unduh langsung dalam bentuk zip.
   - **Ringkasan run**, berisi hasil verifikasi, laporan, caption IG rekomendasi, dan kredit Kiro yang terpakai.

Kalau verifikasi gagal, PR tetap dibuat sebagai **draft** supaya bisa dicek.

## Keamanan

- Hanya orang dengan akses tulis ke repo yang bisa menjalankan workflow.
- Input dibaca lewat env dan dibersihkan, jadi tidak dimasukkan langsung ke perintah shell.
- Agent Kiro tidak mendapat token GitHub (`persist-credentials: false`). Commit dan push dilakukan langkah terakhir, yang hanya menambahkan file milik video itu.
- Verifikasi akhir memakai `verify.py` dan `check-caption.js` asli dari `PROMPT_TEMPLATE.md`, bukan salinan yang mungkin sudah diubah agent.
- Secret otomatis disensor di log GitHub.

## Biaya

- **Kredit Kiro:** tercatat di ringkasan run (baris "Kiro Credits").
- **ElevenLabs:** sekitar 900 karakter untuk TTS dan sekitar 1 menit speech-to-text per video 55 detik.
- **Menit GitHub Actions:** gratis untuk repo publik, dan memakai kuota untuk repo privat.
