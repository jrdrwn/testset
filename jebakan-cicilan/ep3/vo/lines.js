// Seri "Jebakan Cicilan" — Episode 3/3: Jalan Keluar (80 dtk). Kisah fiktif.
const N = { who: 'narator', voice: 'Brian' }, DIMAS = { who: 'dimas', voice: 'Liam' },
  RANI = { who: 'rani', voice: 'Jessica' }, IBU = { who: 'ibu', voice: 'Matilda' };
const VO_LINES = [
  { ...N, t0: 0.1, t1: 3.6, cap: 'Ponselnya masih bergetar waktu pintu kamarnya diketuk.' },
  { ...RANI, t0: 3.8, t1: 7.0, cap: 'Mas, aku lihat grup keluarga. Cerita sama aku.' },
  { ...DIMAS, t0: 7.2, t1: 10.6, cap: 'Aku malu, Ran. Utangku di mana-mana.' },
  { ...RANI, t0: 10.8, t1: 14.6, cap: 'Malu nanti dulu. Kita tulis semua utangnya, satu-satu.' },
  { ...N, t0: 14.8, t1: 18.8, cap: 'Malam itu mereka bikin daftar: tujuh aplikasi, total Rp9 juta.',
    el: 'Malam|itu|mereka|bikin|daftar:|tujuh|aplikasi,|total|sembilan|juta.' },
  { ...N, t0: 19.0, t1: 22.6, cap: 'Ternyata lima di antaranya nggak terdaftar di OJK.' },
  { ...RANI, t0: 22.8, t1: 27.4, cap: 'Yang ilegal, laporkan. Ancaman dan sebar data itu melanggar hukum.' },
  { ...N, t0: 27.6, t1: 31.8, cap: 'Dimas melapor ke Kontak OJK 157 dan Satgas PASTI.',
    el: 'Dimas|melapor|ke|Kontak|OJK|seratus lima puluh tujuh|dan|Satgas|PASTI.' },
  { ...N, t0: 32.0, t1: 36.0, cap: 'Nomor penagih yang mengancam dia blokir. Bukti chatnya dia simpan.' },
  { ...N, t0: 36.2, t1: 40.4, cap: 'Untuk yang resmi, Dimas menghubungi layanan pelanggan dan minta keringanan.' },
  { ...N, t0: 40.6, t1: 44.4, cap: 'Cicilannya dijadwal ulang. Lebih panjang, tapi bisa dibayar.' },
  { ...N, t0: 44.6, t1: 48.8, cap: 'Semua akun paylater dia tutup, kecuali yang masih ada cicilan.' },
  { ...DIMAS, t0: 49.0, t1: 52.6, cap: 'Mulai sekarang, gaji masuk, langsung bagi dulu.' },
  { ...N, t0: 52.8, t1: 57.4, cap: '50% kebutuhan. 30% cicilan. 20% tabungan darurat.',
    el: 'Lima puluh persen|kebutuhan.|Tiga puluh persen|cicilan.|Dua puluh persen|tabungan|darurat.' },
  { ...N, t0: 57.6, t1: 61.6, cap: 'Butuh 8 bulan sampai utangnya lunas.', el: 'Butuh|delapan|bulan|sampai|utangnya|lunas.' },
  { ...IBU, t0: 61.8, t1: 64.8, cap: 'Yang penting kamu jujur, Nak.' },
  { ...N, t0: 65.0, t1: 69.0, cap: 'Dimas belajar satu hal: paylater bukan uang tambahan.' },
  { ...N, t0: 69.2, t1: 73.8, cap: 'Kalau kamu lagi di posisi Dimas, kamu nggak sendirian. Tamat.' },
];
if (typeof module !== 'undefined') module.exports = { VO_LINES };
else window.VO_LINES = VO_LINES;
