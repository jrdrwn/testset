// Frame-accurate offline export with WebCodecs -> MP4 (H.264 + Opus).
async function exportMP4(ctx, log = () => {}) {
  await document.fonts.load('900 40px NS');
  const { W, H, FPS, DURATION } = COMP;
  const frames = Math.round(DURATION * FPS), TS = 90000, FD = TS / FPS;

  const vSamples = []; let avcC = null;
  const ve = new VideoEncoder({
    output: (chunk, meta) => {
      if (meta && meta.decoderConfig && meta.decoderConfig.description && !avcC) avcC = new Uint8Array(meta.decoderConfig.description);
      const d = new Uint8Array(chunk.byteLength); chunk.copyTo(d);
      vSamples.push({ data: d, ts: chunk.timestamp, key: chunk.type === 'key' });
    },
    error: e => { throw e; },
  });
  ve.configure({ codec: 'avc1.640028', width: W, height: H, bitrate: window.EXPORT_BITRATE || 12_000_000, framerate: FPS, avc: { format: 'avc' }, latencyMode: 'quality' });
  for (let i = 0; i < frames; i++) {
    COMP.render(ctx, i / FPS);
    const vf = new VideoFrame(ctx.canvas, { timestamp: Math.round((i * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
    ve.encode(vf, { keyFrame: i % (FPS * 2) === 0 }); vf.close();
    while (ve.encodeQueueSize > 4) await new Promise(r => setTimeout(r, 1));
    if (i % 60 === 0) log(`video ${i}/${frames}`);
  }
  await ve.flush(); ve.close();
  vSamples.sort((a, b) => a.ts - b.ts);
  const video = { width: W, height: H, timescale: TS, avcC, samples: vSamples.map(s => ({ data: s.data, key: s.key, duration: FD })) };

  log('audio');
  const sr = 48000, au = COMP.synthAudio(sr), aSamples = []; let preSkip = 312;
  const ae = new AudioEncoder({
    output: (chunk, meta) => {
      if (meta && meta.decoderConfig && meta.decoderConfig.description) {
        const h = new Uint8Array(meta.decoderConfig.description); // OpusHead, little endian
        if (h.length >= 12) preSkip = h[10] | (h[11] << 8);
      }
      const d = new Uint8Array(chunk.byteLength); chunk.copyTo(d);
      aSamples.push({ data: d, duration: Math.round((chunk.duration * sr) / 1e6) || 960 });
    },
    error: e => { throw e; },
  });
  ae.configure({ codec: 'opus', sampleRate: sr, numberOfChannels: 2, bitrate: 160000 });
  const BL = 4800;
  for (let o = 0; o < au.L.length; o += BL) {
    const n = Math.min(BL, au.L.length - o), buf = new Float32Array(n * 2);
    buf.set(au.L.subarray(o, o + n), 0); buf.set(au.R.subarray(o, o + n), n);
    const ad = new AudioData({ format: 'f32-planar', sampleRate: sr, numberOfFrames: n, numberOfChannels: 2, timestamp: Math.round((o * 1e6) / sr), data: buf });
    ae.encode(ad); ad.close();
  }
  await ae.flush(); ae.close();
  log('mux');
  return MP4MUX.mux(video, { sampleRate: sr, channels: 2, preSkip, timescale: sr, samples: aSamples });
}
