#!/usr/bin/env bash
# Dijalankan workflow setelah Kiro selesai: validasi slug, verifikasi ulang dengan tools asli dari template,
# commit hanya file milik video ini, push ke branch video/<slug>, dan buka PR ke branch default.
# Env: GH_TOKEN, GITHUB_REPOSITORY, GITHUB_OUTPUT, GITHUB_STEP_SUMMARY, RUNNER_TEMP, BASE_BRANCH, FFMPEG, ELEVENLABS_API_KEY
set -euo pipefail

[ -f .video-slug ] || { echo "::error::Kiro tidak menulis .video-slug. Lihat log Kiro di artifact."; exit 1; }
SLUG=$(head -n1 .video-slug | tr -d '\r\n ')
if [[ ! "$SLUG" =~ ^[a-z0-9][a-z0-9-]{2,59}$ ]]; then echo "::error::slug tidak valid: '$SLUG'"; exit 1; fi
[ -d "$SLUG" ] || { echo "::error::folder $SLUG/ tidak ada"; exit 1; }
echo "slug=$SLUG" >> "$GITHUB_OUTPUT"

# --- verifikasi ulang dengan verify.py & check-caption.js asli dari PROMPT_TEMPLATE.md ---
CI="$SLUG/.ci-tools"; mkdir -p "$CI"
node -e '
const fs=require("fs"),md=fs.readFileSync("PROMPT_TEMPLATE.md","utf8");
const re=/#### File: `([^`]+)`\n\n````[a-z]*\n([\s\S]*?)\n````/g;let m;
while((m=re.exec(md))){const f=m[1];if(f==="tools/verify.py"||f==="tools/check-caption.js")fs.writeFileSync(process.argv[1]+"/"+f.split("/")[1],m[2]+"\n");}
' "$CI"
VERIFY_LOG="$RUNNER_TEMP/verify.txt"; CAPTION_LOG="$RUNNER_TEMP/caption.txt"
VIDEO="$SLUG/out/$SLUG-vo.mp4"; [ -f "$VIDEO" ] || VIDEO="$SLUG-vo.mp4"
set +e
python3 "$CI/verify.py" "$VIDEO" > "$VERIFY_LOG" 2>&1; VERIFY_RC=$?
CAPFILE="$SLUG/out/$SLUG-caption.md"; [ -f "$CAPFILE" ] || CAPFILE="$SLUG-caption.md"
node "$CI/check-caption.js" "$CAPFILE" > "$CAPTION_LOG" 2>&1; CAPTION_RC=$?
set -e
rm -rf "$CI"
OK=true; { [ $VERIFY_RC -eq 0 ] && [ $CAPTION_RC -eq 0 ]; } || OK=false
echo "ok=$OK" >> "$GITHUB_OUTPUT"

# --- ringkasan di halaman run ---
{
  echo "# Video: $SLUG"
  echo; echo "**Verifikasi:** $([ "$OK" = true ] && echo 'LULUS ✅' || echo 'GAGAL ❌ (PR dibuat sebagai draft)')"
  echo; echo '<details><summary>verify.py</summary>'; echo; echo '```'; grep -v '^\[2\]' "$VERIFY_LOG" || true; echo '```'; echo '</details>'
  echo; echo '<details><summary>check-caption.js</summary>'; echo; echo '```'; cat "$CAPTION_LOG"; echo '```'; echo '</details>'
  echo; [ -f .video-report.md ] && cat .video-report.md
  CRED=$(grep -oE 'Credits: [0-9.]+' "$RUNNER_TEMP/kiro.log" 2>/dev/null | tail -1 || true); [ -n "$CRED" ] && { echo; echo "Kiro $CRED"; }
} >> "$GITHUB_STEP_SUMMARY"

# --- commit hanya file video ini ---
BRANCH="video/$SLUG"
git remote set-url origin "${REMOTE_URL:-https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git}"  # REMOTE_URL hanya untuk uji lokal
if git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then BRANCH="$BRANCH-$GITHUB_RUN_NUMBER"; fi
echo "branch=$BRANCH" >> "$GITHUB_OUTPUT"
git config user.name "github-actions[bot]"
git config user.email "41898231+github-actions[bot]@users.noreply.github.com"
git checkout -q -b "$BRANCH"
git add -- "$SLUG"
for f in "$SLUG-vo.mp4" "$SLUG.mp4" "$SLUG-caption.md" "$SLUG"-thumb-*.jpg; do [ -f "$f" ] && git add -- "$f"; done
for f in $(git diff --cached --name-only); do
  sz=$(stat -c%s "$f"); [ "$sz" -gt 95000000 ] && { echo "::error::$f terlalu besar untuk git ($sz byte)"; exit 1; }
done
git commit -q -m "Add video: $SLUG (dibuat otomatis lewat GitHub Actions + Kiro, run #$GITHUB_RUN_NUMBER)"
git push -q -u origin "$BRANCH"

# --- PR ---
BODY="$RUNNER_TEMP/pr-body.md"
{
  echo "Video dibuat otomatis oleh workflow **Buat video** (run #$GITHUB_RUN_NUMBER) mengikuti \`PROMPT_TEMPLATE.md\` Mode Cepat."
  echo; echo "**Verifikasi ulang (tools asli template):** $([ "$OK" = true ] && echo LULUS || echo GAGAL)"
  echo; echo "File siap upload di root: \`$SLUG-vo.mp4\`, \`$SLUG.mp4\`, \`$SLUG-thumb-*.jpg\`, \`$SLUG-caption.md\`. Bisa juga diunduh sebagai artifact di halaman run."
  echo; echo '```'; grep -v '^\[2\]' "$VERIFY_LOG" | head -40 || true; tail -3 "$CAPTION_LOG"; echo '```'
  echo; [ -f .video-report.md ] && head -c 50000 .video-report.md
} > "$BODY"
DRAFT=false; [ "$OK" = true ] || DRAFT=true
URL=$(gh api "repos/$GITHUB_REPOSITORY/pulls" -f title="Video: $SLUG" -f head="$BRANCH" -f base="$BASE_BRANCH" \
  -F draft=$DRAFT -F body=@"$BODY" --jq .html_url)
echo "pr=$URL" >> "$GITHUB_OUTPUT"
echo; echo "PR: $URL" | tee -a "$GITHUB_STEP_SUMMARY"
[ "$OK" = true ] || { echo "::warning::Verifikasi gagal, PR dibuat sebagai draft: $URL"; }
