// Voice-over script. t0/t1 = slot in the video (seconds). cap = on-screen caption, say = respelled for Indonesian TTS (espeak, build-vo.js).
// el = what ElevenLabs speaks (build-vo-elevenlabs.js): one '|'-separated unit per caption word, so each caption word
// lights up when its unit is spoken. Without el, the caption text is spoken as-is.
const CHECK_T = [43.0, 44.45, 46.05, 47.2, 48.75];
const VO_LINES = [
  { t0: 0.1, t1: 2.95, cap: 'Mau coba-coba forex? Tonton ini dulu.', say: 'Mau coba-coba foreks? Tonton ini dulu.' },
  { t0: 3.15, t1: 7.4, cap: 'Leverage 1:500. Modal Rp1 juta bisa pegang posisi Rp500 juta.', say: 'Leverej, satu banding lima ratus. Modal sejuta, bisa pegang posisi lima ratus juta.',
    el: 'Leverage|satu banding lima ratus.|Modal|satu|juta,|bisa|pegang|posisi|lima ratus|juta.' },
  { t0: 7.65, t1: 11.4, cap: 'Harga lawan arah cuma 0,2%... modalmu habis.', say: 'Harga lawan arah, cuma nol koma dua persen... modalmu habis.',
    el: 'Harga|lawan|arah,|cuma|nol koma dua persen...|modalmu|habis.' },
  { t0: 11.6, t1: 16.9, cap: 'Margin call. Stop out. Akunmu terkuras dalam hitungan menit.', say: 'Marjin kol. Stop aut. Akunmu terkuras, dalam hitungan menit.' },
  { t0: 17.15, t1: 23.4, cap: 'Broker ilegal: deposit gampang, withdraw ditolak. Selalu cek legalitasnya di Bappebti.', say: 'Broker ilegal. Deposit gampang, tapi witdro ditolak. Selalu cek legalitasnya di Bapebti.',
    el: 'Broker|ilegal.|Deposit|gampang,|tapi withdraw|ditolak.|Selalu|cek|legalitasnya|di|Bappebti.' },
  { t0: 23.65, t1: 29.9, cap: 'Profit pasti tiap bulan? Robot anti-loss? Sinyal VIP auto cuan? Itu red flag penipuan.', say: 'Profit pasti tiap bulan? Robot anti los? Sinyal vi ai pi, oto cuan? Itu red flek penipuan.' },
  { t0: 30.15, t1: 35.9, cap: 'Rugi, lalu balas dendam. Lot digedein, rugi makin besar. Musuh terbesarmu: emosimu sendiri.', say: 'Rugi, lalu balas dendam. Lot digedein, rugi makin besar. Musuh terbesarmu, emosimu sendiri.',
    el: 'Rugi,|lalu|balas|dendam.|Lot|digedein,|rugi|makin|besar.|Musuh|terbesarmu,|emosimu|sendiri.' },
  { t0: 36.15, t1: 41.4, cap: 'Spread, swap, komisi, slippage. Biaya kecil yang pelan-pelan menggerus modalmu.', say: 'Spred, swop, komisi, slipej. Biaya kecil, yang pelan-pelan menggerus modalmu.' },
  { t0: 41.6, t1: CHECK_T[0] - 0.1, cap: 'Kalau tetap mau coba:', say: 'Kalau tetap mau coba:', el: 'Kalau|tetap|mau|coba.' },
  { t0: CHECK_T[0], t1: CHECK_T[1] - 0.1, cap: 'Latihan di akun demo.', say: 'Latihan di akun demo.' },
  { t0: CHECK_T[1], t1: CHECK_T[2] - 0.1, cap: 'Pakai broker resmi Bappebti.', say: 'Pakai broker resmi Bapebti.' },
  { t0: CHECK_T[2], t1: CHECK_T[3] - 0.1, cap: 'Pakai uang dingin.', say: 'Pakai uang dingin.' },
  { t0: CHECK_T[3], t1: CHECK_T[4] - 0.1, cap: 'Selalu pasang stop loss.', say: 'Selalu pasang stop los.' },
  { t0: CHECK_T[4], t1: 51.45, cap: 'Risiko maksimal 1–2% per posisi.', say: 'Risiko maksimal, satu sampai dua persen per posisi.',
    el: 'Risiko|maksimal|satu sampai dua persen|per|posisi.' },
  { t0: 51.6, t1: 54.95, cap: 'Trading bukan jalan pintas kaya. Kirim ini ke temanmu.', say: 'Treding bukan jalan pintas kaya. Kirim ini ke temanmu.' },
];
if (typeof module !== 'undefined') module.exports = { VO_LINES, CHECK_T };
else { window.VO_LINES = VO_LINES; window.VO_CHECK_T = CHECK_T; }
