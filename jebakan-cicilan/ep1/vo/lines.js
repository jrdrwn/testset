// Seri "Jebakan Cicilan" — Episode 1/3: Gajian Pertama (74 dtk). Kisah fiktif.
// who = siapa yang bicara (dipakai shared/people.js untuk gerak mulut + label nama). voice = voice ElevenLabs.
const N = { who: 'narator', voice: 'Brian' }, DIMAS = { who: 'dimas', voice: 'Liam' }, BAYU = { who: 'bayu', voice: 'Charlie' };
const VO_LINES = [
  { ...N, t0: 0.1, t1: 3.5, cap: 'Dimas nggak pernah nyangka, satu klik bisa ngubah hidupnya.' },
  { ...N, t0: 3.7, t1: 8.0, cap: 'Umur 23, baru tiga bulan kerja. Gaji Rp5 juta sebulan.',
    el: 'Umur|dua puluh tiga,|baru|tiga|bulan|kerja.|Gaji|lima|juta|sebulan.' },
  { ...N, t0: 8.2, t1: 11.6, cap: 'Cukup, asal nggak ikut gaya teman-temannya.' },
  { ...BAYU, t0: 11.8, t1: 14.8, cap: 'Dim, HP lo masih yang itu-itu aja?' },
  { ...DIMAS, t0: 15.0, t1: 17.8, cap: 'Belum ada duit, Bay. Nanti aja.' },
  { ...BAYU, t0: 18.0, t1: 22.0, cap: 'Pakai paylater aja. Cicil 12 bulan, nggak kerasa.',
    el: 'Pakai|paylater|aja.|Cicil|dua belas|bulan,|nggak|kerasa.' },
  { ...N, t0: 22.3, t1: 26.8, cap: 'Malamnya, Dimas buka aplikasi. Limit Rp7 juta, langsung cair.',
    el: 'Malamnya,|Dimas|buka|aplikasi.|Limit|tujuh|juta,|langsung|cair.' },
  { ...DIMAS, t0: 27.0, t1: 29.8, cap: 'Cuma 300 ribuan sebulan. Aman lah.', el: 'Cuma|tiga ratus|ribuan|sebulan.|Aman|lah.' },
  { ...N, t0: 30.0, t1: 33.8, cap: 'Klik. HP baru. Sepatu baru. Makan enak tiap akhir pekan.' },
  { ...N, t0: 34.0, t1: 38.2, cap: 'Satu aplikasi terasa kurang. Dimas daftar di aplikasi kedua, lalu ketiga.' },
  { ...N, t0: 38.4, t1: 42.2, cap: 'Semua gampang. Nggak ada yang nanya, gajimu cukup nggak?' },
  { ...N, t0: 42.4, t1: 45.6, cap: 'Bulan pertama, semuanya masih terasa ringan.' },
  { ...N, t0: 45.8, t1: 50.0, cap: 'Sampai tanggal 25. Notifikasi datang bersamaan.', el: 'Sampai|tanggal|dua puluh lima.|Notifikasi|datang|bersamaan.' },
  { ...N, t0: 50.2, t1: 55.0, cap: 'Tagihan tiga aplikasi: Rp2,3 juta. Hampir setengah gajinya.',
    el: 'Tagihan|tiga|aplikasi:|dua koma tiga|juta.|Hampir|setengah|gajinya.' },
  { ...DIMAS, t0: 55.2, t1: 58.0, cap: 'Kok bisa sebanyak ini?' },
  { ...N, t0: 58.2, t1: 63.0, cap: 'Gajinya tinggal Rp2,7 juta. Padahal kos dan makan belum dibayar.',
    el: 'Gajinya|tinggal|dua koma tujuh|juta.|Padahal|kos|dan|makan|belum|dibayar.' },
  { ...N, t0: 63.2, t1: 67.6, cap: 'Lalu muncul iklan: pinjaman cair 5 menit, tanpa syarat.',
    el: 'Lalu|muncul|iklan:|pinjaman|cair|lima|menit,|tanpa|syarat.' },
  { ...N, t0: 67.8, t1: 71.6, cap: 'Jari Dimas berhenti di tombol itu. Bersambung.' },
];
if (typeof module !== 'undefined') module.exports = { VO_LINES };
else window.VO_LINES = VO_LINES;
