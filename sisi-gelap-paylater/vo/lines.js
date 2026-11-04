// Naskah VO "Sisi Gelap Paylater" (55 dtk). Satu baris = satu slot waktu di video.
//  t0/t1 : slot (detik). VO baris ini mulai tepat di t0 dan harus selesai sebelum t1.
//  cap   : teks caption di layar.  el: yang diucapkan, satu potongan per kata cap (dipisah '|').
// Sumber angka: OJK (Jan 2026) outstanding BNPL bank Rp27,1 T + perusahaan pembiayaan Rp12,18 T = Rp39,3 T.
const VO_LINES = [
  { t0: 0.1, t1: 2.95, cap: 'Utang paylater kita hampir Rp40 triliun. Kamu ikut?',
    el: 'Utang|paylater|kita|hampir|empat puluh|triliun.|Kamu|ikut?' },
  { t0: 3.1, t1: 10.3, cap: 'Rasanya kayak punya uang tambahan. Padahal itu utang: gaji bulan depan yang sudah kepakai duluan.' },
  { t0: 10.6, t1: 17.8, cap: 'Satu checkout kecil nggak kerasa. Tapi lima aplikasi, lima tanggal jatuh tempo. Gajimu habis sebelum sempat dipakai.' },
  { t0: 18.1, t1: 25.3, cap: 'Telat sehari, langsung kena denda. Bunga dan biaya layanan bikin barangmu diam-diam jauh lebih mahal.' },
  { t0: 25.6, t1: 32.8, cap: 'Semua tercatat di SLIK OJK. Telat bayar bisa bikin pengajuan KPR atau kreditmu ditolak nanti.' },
  { t0: 33.1, t1: 40.3, cap: 'Banyak penelitian bilang, paylater bikin kita gampang belanja impulsif. Diskon dikit, langsung checkout.' },
  { t0: 40.6, t1: 41.9, cap: 'Kalau tetap mau pakai:', el: 'Kalau|tetap|mau|pakai.' },
  { t0: 42.0, t1: 44.0, cap: 'Cukup satu aplikasi.' },
  { t0: 44.1, t1: 46.6, cap: 'Total cicilan maksimal 30% gaji.', el: 'Total|cicilan|maksimal|tiga puluh persen|gaji.' },
  { t0: 46.7, t1: 48.6, cap: 'Bayar sebelum jatuh tempo.' },
  { t0: 48.7, t1: 50.8, cap: 'Cuma buat kebutuhan, bukan keinginan.' },
  { t0: 51.0, t1: 54.9, cap: 'Paylater bukan uang tambahan. Kirim ini ke temanmu.' },
];
if (typeof module !== 'undefined') module.exports = { VO_LINES };
else window.VO_LINES = VO_LINES;
