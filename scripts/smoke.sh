#!/usr/bin/env bash
# Post-deploy smoke test. Usage: npm run smoke -- https://your-site.vercel.app
set -uo pipefail
BASE="${1:-${SMOKE_URL:-}}"
if [[ -z "$BASE" ]]; then echo "usage: npm run smoke -- <base-url>" >&2; exit 2; fi
BASE="${BASE%/}"
fail=0
check() { # path expected-status [content-type-substring]
  local path="$1" want="$2" type="${3:-}"
  local out code ctype
  out=$(curl -s -o /dev/null -w '%{http_code} %{content_type}' --max-time 20 "$BASE$path")
  code="${out%% *}"; ctype="${out#* }"
  if [[ "$code" != "$want" ]] || [[ -n "$type" && "$ctype" != *"$type"* ]]; then
    printf 'FAIL %-58s %s %s (want %s %s)\n' "$path" "$code" "$ctype" "$want" "$type"; fail=1
  else
    printf 'ok   %-58s %s %s\n' "$path" "$code" "$ctype"
  fi
}
check /                                                       200 text/html
check /classic                                                200 text/html
check /kage                                                   200 text/html
check /landing-pages/portfolio.html                           200 text/html
check /landing-pages/kage.html                                200 text/html
check /landing-pages/secret-pathways-assets/three.min.js      200 javascript
check /landing-pages/secret-pathways-assets/fonts.css         200 text/css
check /landing-pages/secret-pathways-assets/generated/kage-approach.webp 200 image/webp
check /Chinthan_Shetty_Resume.pdf                             200 application/pdf
check /chinthan-hd.webp                                       200 image/webp
check /og.png                                                 200 image/png
check /favicon.png                                            200 image/png
check /this-page-does-not-exist                               404 text/html

# every hashed bundle referenced by the entry HTML must load
for asset in $(curl -s --max-time 20 "$BASE/" | grep -oE '/assets/[^"]+\.(js|css)' | sort -u); do
  check "$asset" 200
done

if [[ "$BASE" == https://* ]]; then
  if curl -sI --max-time 20 "$BASE/" | grep -qi '^strict-transport-security:'; then
    echo "ok   HSTS header present"
  else
    echo "FAIL HSTS header missing"; fail=1
  fi
fi
exit $fail
