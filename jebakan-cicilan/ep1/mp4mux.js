// Minimal MP4 muxer (H.264 video + Opus audio), moov-first ("faststart").
(function () {
  const enc = new TextEncoder();
  function u32(n) { return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]; }
  function u16(n) { return [(n >>> 8) & 255, n & 255]; }
  function cat(parts) {
    let len = 0; for (const p of parts) len += p.length;
    const out = new Uint8Array(len); let o = 0;
    for (const p of parts) { out.set(p, o); o += p.length; }
    return out;
  }
  const bytes = a => (a instanceof Uint8Array ? a : new Uint8Array(a));
  function box(type, ...payload) {
    const body = cat(payload.map(bytes));
    return cat([new Uint8Array(u32(body.length + 8)), enc.encode(type), body]);
  }
  const full = (type, v, f, ...p) => box(type, [v, (f >> 16) & 255, (f >> 8) & 255, f & 255], ...p);
  const MATRIX = [0x00010000, 0, 0, 0, 0x00010000, 0, 0, 0, 0x40000000].flatMap(u32);

  function stbl(entry, durations, sizes, offsets, syncs) {
    // stts run-length
    const runs = [];
    for (const d of durations) { const l = runs[runs.length - 1]; if (l && l[1] === d) l[0]++; else runs.push([1, d]); }
    const parts = [
      full('stsd', 0, 0, u32(1), entry),
      full('stts', 0, 0, u32(runs.length), runs.flatMap(([c, d]) => [...u32(c), ...u32(d)])),
    ];
    if (syncs) parts.push(full('stss', 0, 0, u32(syncs.length), syncs.flatMap(u32)));
    parts.push(
      full('stsc', 0, 0, u32(1), [...u32(1), ...u32(1), ...u32(1)]),
      full('stsz', 0, 0, u32(0), u32(sizes.length), sizes.flatMap(u32)),
      full('stco', 0, 0, u32(offsets.length), offsets.flatMap(u32)),
    );
    return box('stbl', ...parts);
  }
  const dinf = () => box('dinf', full('dref', 0, 0, u32(1), full('url ', 0, 1)));
  function trak(id, kind, timescale, duration, movieDur, entry, s, width, height) {
    const tkhd = full('tkhd', 0, 3, u32(0), u32(0), u32(id), u32(0), u32(movieDur), new Uint8Array(8),
      u16(0), u16(0), u16(kind === 'soun' ? 0x0100 : 0), u16(0), MATRIX, u32(width << 16), u32(height << 16));
    const mdhd = full('mdhd', 0, 0, u32(0), u32(0), u32(timescale), u32(duration), u16(0x55c4), u16(0));
    const hdlr = full('hdlr', 0, 0, u32(0), enc.encode(kind), new Uint8Array(12), enc.encode(kind === 'vide' ? 'VideoHandler\0' : 'SoundHandler\0'));
    const mh = kind === 'vide' ? full('vmhd', 0, 1, new Uint8Array(8)) : full('smhd', 0, 0, new Uint8Array(4));
    return box('trak', tkhd, box('mdia', mdhd, hdlr, box('minf', mh, dinf(), stbl(entry, s.durations, s.sizes, s.offsets, s.syncs))));
  }

  // video: {width,height,timescale,avcC,samples:[{data,duration,key}]}
  // audio: {sampleRate,channels,preSkip,timescale,samples:[{data,duration}]}
  function mux(video, audio) {
    const ftyp = box('ftyp', enc.encode('isom'), u32(0x200), enc.encode('isomiso2avc1mp41'));
    const vEntry = box('avc1', new Uint8Array(6), u16(1), new Uint8Array(16), u16(video.width), u16(video.height),
      u32(0x00480000), u32(0x00480000), u32(0), u16(1), new Uint8Array(32), u16(0x18), u16(0xffff), box('avcC', video.avcC));
    const aEntry = box('Opus', new Uint8Array(6), u16(1), new Uint8Array(8), u16(audio.channels), u16(16), u16(0), u16(0), u32(48000 << 16),
      box('dOps', [0, audio.channels], u16(audio.preSkip), u32(audio.sampleRate), u16(0), [0]));
    const vd = video.samples.reduce((a, s) => a + s.duration, 0), ad = audio.samples.reduce((a, s) => a + s.duration, 0);
    const MT = 1000, movieDur = Math.max(Math.round(vd / video.timescale * MT), Math.round(ad / audio.timescale * MT));

    function build(base) {
      let off = base; const vo = [], ao = [];
      // interleave ~0.5 s blocks for smooth playback
      let vi = 0, ai = 0, vt = 0, at = 0; const order = [];
      while (vi < video.samples.length || ai < audio.samples.length) {
        const vNext = vi < video.samples.length ? vt / video.timescale : Infinity;
        const aNext = ai < audio.samples.length ? at / audio.timescale : Infinity;
        if (vNext <= aNext) { order.push(['v', vi]); vo[vi] = off; off += video.samples[vi].data.length; vt += video.samples[vi].duration; vi++; }
        else { order.push(['a', ai]); ao[ai] = off; off += audio.samples[ai].data.length; at += audio.samples[ai].duration; ai++; }
      }
      const vs = { durations: video.samples.map(s => s.duration), sizes: video.samples.map(s => s.data.length), offsets: vo, syncs: video.samples.map((s, i) => (s.key ? i + 1 : 0)).filter(Boolean) };
      const as = { durations: audio.samples.map(s => s.duration), sizes: audio.samples.map(s => s.data.length), offsets: ao };
      const mvhd = full('mvhd', 0, 0, u32(0), u32(0), u32(MT), u32(movieDur), u32(0x00010000), u16(0x0100), new Uint8Array(10), MATRIX, new Uint8Array(24), u32(3));
      const moov = box('moov', mvhd,
        trak(1, 'vide', video.timescale, vd, movieDur, vEntry, vs, video.width, video.height),
        trak(2, 'soun', audio.timescale, ad, movieDur, aEntry, as, 0, 0));
      return { moov, order };
    }
    const first = build(0);
    const mdatStart = ftyp.length + first.moov.length + 8;
    const { moov, order } = build(mdatStart);
    let payload = 0; for (const s of video.samples) payload += s.data.length; for (const s of audio.samples) payload += s.data.length;
    const out = new Uint8Array(mdatStart + payload);
    out.set(ftyp, 0); out.set(moov, ftyp.length);
    out.set([...u32(payload + 8), ...enc.encode('mdat')], ftyp.length + moov.length);
    let o = mdatStart;
    for (const [k, i] of order) { const d = (k === 'v' ? video.samples : audio.samples)[i].data; out.set(d, o); o += d.length; }
    return out;
  }
  window.MP4MUX = { mux };
})();
