// Seri "Jebakan Cicilan" — Episode 2/3: Gali Lubang (76 dtk). Kisah fiktif.
const N = { who: 'narator', voice: 'Brian' }, DIMAS = { who: 'dimas', voice: 'Liam' },
  PENAGIH = { who: 'penagih', voice: 'Callum' }, IBU = { who: 'ibu', voice: 'Matilda' };
const VO_LINES = [
  { ...N, t0: 0.1, t1: 3.4, cap: 'Dimas akhirnya menekan tombol itu.' },
  { ...N, t0: 3.6, t1: 7.4, cap: 'Lima menit kemudian, Rp3 juta masuk rekening.', el: 'Lima|menit|kemudian,|tiga|juta|masuk|rekening.' },
  { ...DIMAS, t0: 7.6, t1: 10.8, cap: 'Aman. Bayar paylater dulu, sisanya buat makan.' },
  { ...N, t0: 11.0, t1: 14.2, cap: 'Yang nggak dia baca: tenornya cuma 30 hari.', el: 'Yang|nggak|dia|baca:|tenornya|cuma|tiga puluh|hari.' },
  { ...N, t0: 14.4, t1: 17.8, cap: 'Dan aplikasinya nggak terdaftar di OJK.' },
  { ...N, t0: 18.0, t1: 22.2, cap: 'Tiga puluh hari lewat. Tagihannya jadi Rp4,2 juta.', el: 'Tiga|puluh|hari|lewat.|Tagihannya|jadi|empat koma dua|juta.' },
  { ...N, t0: 22.4, t1: 26.0, cap: 'Untuk bayar itu, Dimas pinjam lagi di aplikasi lain.' },
  { ...N, t0: 26.2, t1: 29.8, cap: 'Gali lubang, tutup lubang. Lubangnya makin dalam.' },
  { ...N, t0: 30.0, t1: 33.8, cap: 'Dua bulan kemudian, utangnya tersebar di 7 aplikasi.', el: 'Dua|bulan|kemudian,|utangnya|tersebar|di|tujuh|aplikasi.' },
  { ...N, t0: 34.0, t1: 37.2, cap: 'Lalu telepon itu mulai datang.' },
  { ...PENAGIH, t0: 37.4, t1: 41.2, cap: 'Saudara Dimas, kapan mau bayar? Jangan pura-pura sibuk.' },
  { ...DIMAS, t0: 41.4, t1: 44.2, cap: 'Saya usahakan minggu depan, Pak.' },
  { ...PENAGIH, t0: 44.4, t1: 48.4, cap: 'Kalau hari ini nggak bayar, semua kontakmu kami hubungi.' },
  { ...N, t0: 48.6, t1: 52.2, cap: 'Dimas pikir itu cuma ancaman. Ternyata bukan.' },
  { ...N, t0: 52.4, t1: 55.6, cap: 'Malam itu, grup keluarga ramai.' },
  { ...N, t0: 55.8, t1: 60.6, cap: 'Foto Dimas tersebar, dengan tulisan: orang ini menunggak utang.' },
  { ...IBU, t0: 60.8, t1: 64.0, cap: 'Dimas, ini maksudnya apa, Nak?' },
  { ...N, t0: 64.2, t1: 68.4, cap: 'Dimas nggak sanggup menjawab. Ponselnya terus bergetar.' },
  { ...N, t0: 68.6, t1: 72.8, cap: 'Dia merasa nggak ada jalan keluar. Bersambung.' },
];
if (typeof module !== 'undefined') module.exports = { VO_LINES };
else window.VO_LINES = VO_LINES;
