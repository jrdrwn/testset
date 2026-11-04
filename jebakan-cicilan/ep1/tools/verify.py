"""Verifikasi hasil render.
Pemakaian: python tools/verify.py out/<slug>-vo.mp4 [--cap-y 1335] [--no-ocr]
Cek: (1) durasi/resolusi/stream, (2) transkripsi ElevenLabs Scribe vs naskah, (3) selisih waktu kata diucapkan vs caption,
     (4) OCR caption pada waktu tiap kata, (5) file thumbnail. Env: ELEVENLABS_API_KEY, FFMPEG.
Keluar dengan kode 1 kalau ada ambang yang gagal."""
import json, os, re, subprocess, sys, glob, tempfile

FF = os.environ.get("FFMPEG", "ffmpeg")
args = sys.argv[1:]
mp4 = args[0]
cap_y = int(args[args.index("--cap-y") + 1]) if "--cap-y" in args else 1335
do_ocr = "--no-ocr" not in args
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
plan = json.load(open(os.path.join(root, "vo", "plan.json")))
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
fail = []

# 1) stream info
info = subprocess.run([FF, "-hide_banner", "-i", mp4], capture_output=True, text=True).stderr
dur = re.search(r"Duration: (\d+):(\d+):([\d.]+)", info)
dur = int(dur[1]) * 3600 + int(dur[2]) * 60 + float(dur[3])
res = re.search(r"Video: .*?(\d{3,4})x(\d{3,4})", info)
has_audio = "Audio:" in info
vcodec = (re.search(r"Video: (\w+)", info) or [None, "?"])[1]
acodec = (re.search(r"Audio: (\w+)", info) or [None, "?"])[1]
faststart = open(mp4, "rb").read(4096).find(b"moov") != -1
print(f"[1] durasi {dur:.2f}s, resolusi {res[1]}x{res[2]}, video {vcodec}, audio {acodec}, moov di depan: {'ya' if faststart else 'TIDAK'}")
if (res[1], res[2]) != ("1080", "1920") or not has_audio:
    fail.append("stream")
if vcodec != "h264" or acodec != "aac" or not faststart:  # TikTok menolak audio Opus ("encode error")
    print("     format upload salah: harus H.264 + AAC + faststart (render.js finalize, butuh env FFMPEG)")
    fail.append("format")
derr = subprocess.run([FF, "-v", "error", "-i", mp4, "-f", "null", "-"], capture_output=True, text=True).stderr.strip()
if derr:
    print("     error decode:", derr[:300]); fail.append("decode")

# 2+3) STT
tmp = tempfile.mkdtemp()
mp3 = os.path.join(tmp, "a.mp3")
subprocess.run([FF, "-y", "-loglevel", "error", "-i", mp4, "-vn", "-ac", "1", "-b:a", "128k", mp3], check=True)
from elevenlabs.client import ElevenLabs
cl = ElevenLabs(api_key=os.environ["ELEVENLABS_API_KEY"])
r = cl.speech_to_text.convert(file=open(mp3, "rb"), model_id="scribe_v1", timestamps_granularity="word", language_code="ind")
words = [(w.text, w.start) for w in r.words if w.type == "word"]
print("[2] transkripsi:", r.text)
k, diffs, miss = 0, [], []
for pw in plan:
    first = norm(pw["say"].split(" ")[0])
    for s in range(k, min(k + 4, len(words))):
        if norm(words[s][0]) == first or (len(first) > 3 and norm(words[s][0]).startswith(first[:4])):
            pw["spoken"] = words[s][1]; k = s + 1; break
    if "spoken" in pw: diffs.append((abs(pw["spoken"] - pw["t"]), pw["cap"], pw["t"], pw["spoken"]))
    else: miss.append(pw["cap"])
a = sorted(d[0] for d in diffs)
med, mx = a[len(a) // 2], a[-1]
print(f"[3] kata caption {len(plan)}, cocok {len(diffs)} ({len(diffs)/len(plan):.0%}), selisih median {med:.3f}s, maks {mx:.3f}s")
for d in sorted(diffs, reverse=True)[:5]: print(f"     {d[0]:.2f}s  '{d[1]}' caption {d[2]:.2f} ucapan {d[3]:.2f}")
if miss: print("     tidak cocok:", " ".join(miss))
if len(diffs) / len(plan) < 0.9 or med > 0.05 or mx > 0.15: fail.append("sync")
redo = sorted({pw["line"] for pw in plan if "spoken" in pw and abs(pw["spoken"] - pw["t"]) > 0.12})
if redo: print(f"     saran: buat ulang baris ini (biasanya napas/'eh' di awal): ONLY={','.join(map(str, redo))} node vo/build-vo-elevenlabs.js")
# bunyi tambahan di awal baris (mis. "eh") = kata STT yang bukan bagian naskah
script = set(norm(x) for pw in plan for x in pw["say"].split(" "))
extra = [w for w, _ in words if norm(w) and norm(w) not in script and not any(norm(w).startswith(sc[:4]) for sc in script if len(sc) > 3)]
if extra: print("     kata di luar naskah (cek manual):", extra)

# 4) OCR caption
if do_ocr:
    from rapidocr_onnxruntime import RapidOCR
    ocr, ok, bad = RapidOCR(), 0, []
    for pw in plan:
        f = os.path.join(tmp, "f.jpg")
        subprocess.run([FF, "-y", "-loglevel", "error", "-ss", f"{pw['t'] + 0.15:.3f}", "-i", mp4, "-frames:v", "1",
                        "-vf", f"crop=1080:240:0:{cap_y - 120}", f], check=True)
        out, _ = ocr(f)
        txt = norm("".join(t for _, t, _ in (out or [])))
        want = norm(pw["cap"])[:5]
        if want and want in txt: ok += 1
        else: bad.append(f"{pw['cap']}@{pw['t']:.2f}")
    print(f"[4] OCR caption: {ok}/{len(plan)} kata terlihat tepat waktu ({ok/len(plan):.0%})")
    if bad: print("     tidak terbaca:", " ".join(bad[:15]))
    if ok / len(plan) < 0.85: fail.append("ocr")

# 5) thumbnail
th = sorted(glob.glob(os.path.join(root, "out", "thumb-*.jpg")))
print(f"[5] thumbnail: {len(th)} file", [os.path.basename(x) + f" {os.path.getsize(x)//1024}KB" for x in th])
if not th or any(os.path.getsize(x) > 2 * 1024 * 1024 for x in th): fail.append("thumb")

print("HASIL:", "LULUS" if not fail else "GAGAL " + ", ".join(fail))
sys.exit(1 if fail else 0)
