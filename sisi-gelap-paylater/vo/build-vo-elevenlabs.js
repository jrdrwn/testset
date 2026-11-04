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
