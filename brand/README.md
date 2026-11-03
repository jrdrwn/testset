# Brand @wanadiary.id

## Logo

**Konsep:** monogram "w" geometris (garis tebal, ujung membulat) dan satu titik merah di kanan atas. Titik merah diambil dari ikon notifikasi, sebagai tanda "ada keresahan yang perlu diperhatikan". Warnanya sama dengan style video `dark-alert`.

| File | Ukuran | Pakai untuk |
|---|---|---|
| `logo-profile.png` | 1080×1080, lingkaran, latar transparan | **Foto profil Instagram/TikTok/YouTube** |
| `logo-dark.png` / `.svg` | 1080×1080, kotak sudut membulat | ikon di latar terang, watermark, highlight cover |
| `logo-light.png` / `.svg` | 1080×1080, versi terang | ikon di latar gelap |
| `wordmark-dark.png` / `.svg` | 1600×480 | banner, header, akhir video, kemasan |
| `wordmark-light.png` / `.svg` | 1600×480 | sama, untuk latar terang |

**Warna**

| Peran | Hex |
|---|---|
| Hitam (latar) | `#06070a` |
| Putih | `#f4f5f7` |
| Merah (titik) | `#ff2d4a` |
| Kuning (aksen caption) | `#ffd60a` |

**Font wordmark:** Noto Sans ExtraBold (OFL). Font sudah tertanam di SVG sebagai subset kecil (`wordmark-font.woff2`).

**Aturan pakai**
- Monogram dan titik berada di dalam lingkaran radius 415 dari 540, jadi aman untuk foto profil bulat.
- Jangan mengubah warna titik merah. Titik itu ciri utama logo.
- Untuk membuat ulang atau mengubah warna, edit `C` di `build-logo.js`, lalu jalankan `node brand/build-logo.js`. Env `CHROME` dan `PW` sama seperti di `render.js`.

## Profil Instagram

**Nama** (kolom ini ikut terbaca di pencarian, 27/64 karakter):

```
Wana Diary | Keresahan Kita
```

**Bio** (pilih satu, batas Instagram 150 karakter):

1. Lugas, cocok untuk konten edukasi keuangan (122 karakter):
   ```
   Keresahan yang jarang dibahas.
   Sisi gelap uang, kerja & internet, dibongkar singkat.
   Konten edukasi, bukan saran keuangan.
   ```
2. Santai dan mengajak (93 karakter):
   ```
   Diary keresahan kita 📓
   Yang bikin resah, kita bongkar bareng.
   Follow biar nggak ikut kejebak.
   ```
3. Menyebut topik, mengajak share (121 karakter):
   ```
   Catatan keresahan sehari-hari.
   Forex, pinjol, kerja, internet: sisi yang jarang diceritakan.
   🔴 Simpan & kirim ke temanmu.
   ```

**Kategori:** Pendidikan / Kreator digital.

**Highlight (sorotan):** buat sorotan per seri, misalnya "Uang", "Kerja", "Internet". Cover sorotan bisa memakai `logo-dark.png` atau `logo-light.png`.
