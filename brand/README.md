# Brand @wanadiary.id

## Logo

**Konsep:** monogram "wd" (wana diary) dari garis tebal berujung bulat, dengan garis bawah kuning. Garis bawahnya meniru kata yang sedang di-highlight di caption video, jadi logo dan video terasa satu keluarga. Logo lama ("w" + titik merah) disimpan di `alternatif/w-titik.svg`.

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
| Kuning (garis bawah, aksen caption) | `#ffd60a` |
| Kuning tua (garis bawah di latar terang) | `#e6b800` |
| Merah (aksen peringatan di video) | `#ff2d4a` |

**Font wordmark:** Noto Sans ExtraBold (OFL). Font sudah tertanam di SVG sebagai subset kecil (`wordmark-font.woff2`).

**Aturan pakai**
- Monogram dan garis bawah berada di dalam lingkaran radius 426 dari 540, jadi aman untuk foto profil bulat.
- Garis bawah kuning adalah ciri utama logo. Jangan dihapus atau diganti warna lain.
- Jarak "wd" ke garis bawah jangan dirapatkan. Kalau terlalu dekat, di ukuran kecil "wd" terbaca seperti "PM".
- "wd" terbaca OCR di ukuran 1080, 320, dan 110 px (ukuran foto profil IG).
- Untuk membuat ulang atau mengubah warna, edit `C` di `build-logo.js`, lalu jalankan `node brand/build-logo.js`. Env `CHROME` dan `PW` sama seperti di `render.js`.

## Alternatif logo (`alternatif/`)

`alternatif/perbandingan.png` menampilkan semua opsi berdampingan dalam tiga bentuk: kotak, bulat (foto profil), dan kecil 110 px (ukuran tampil di IG).

| No | File | Konsep |
|---|---|---|
| 0 | `alternatif/w-titik` (logo lama) | "w" geometris + titik merah notifikasi |
| 1 | `alternatif/diary-pita` | buku diary dengan pita pembatas merah |
| 2 | `alternatif/curhat-seru` | gelembung curhat dengan tanda seru, titiknya merah |
| 3 | `alternatif/monogram-wd` (**dipakai**) | huruf "wd" dengan garis bawah kuning, seperti kata yang di-highlight di caption |
| 4 | `alternatif/sisi-gelap` | lingkaran setengah terang setengah gelap + titik merah, untuk seri "Sisi Gelap ___" |
| 5 | `alternatif/halaman-w` | halaman bergaris dengan coretan "w" dan garis margin merah |

Semua opsi aman untuk foto profil bulat (elemen terjauh 365–418 px dari tengah, batas aman 460). Buat ulang dengan `node brand/build-logo-alt.js`.

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
