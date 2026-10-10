#!/bin/bash
# =====================================================================
#  Dino-Inselwelt · Grafiken, Töne und Sprache einbinden (macOS)
#  Doppelklick genügt. Das Skript schaut in die Ordner „grafiken-neu“
#  und „sounds-neu“ und schreibt die Liste aller gefundenen Dateien nach
#  „js/asset-map.js“. Danach benutzt die App überall die neuen Dateien
#  (was fehlt, bleibt wie bisher: Zeichnung, eingebauter Ton, alte Aufnahme).
#  Braucht nichts außer macOS (bash, find, od, sips, sed, grep).
#  Windows: Grafiken-einbinden.bat (erzeugt dieselbe Datei).
# =====================================================================
cd "$(dirname "$0")/.." || { echo "Projektordner nicht gefunden."; exit 1; }
DIR="grafiken-neu"
SDIR="sounds-neu"
OUT="js/asset-map.js"
LIST="tools/grafiken-liste.txt"
TONLIST="tools/toene-liste.txt"
VLIST="tools/sprache-liste.csv"
XLIST="tools/sprache-liste-experimente.txt"
SAETZE="$SDIR/sprache/saetze.txt"
TMP="$OUT.tmp"
WORK="${TMPDIR:-/tmp}/dino-einbinden.$$"
mkdir -p "$WORK" 2>/dev/null || WORK="."
NAMES="$WORK/namen.txt"; KNOWN="$WORK/bekannt.txt"; USED="$WORK/benutzt.txt"
: > "$NAMES"; : > "$KNOWN"; : > "$USED"
trap 'rm -f "$TMP" "$NAMES" "$KNOWN" "$USED"; [ "$WORK" != "." ] && rmdir "$WORK" 2>/dev/null' EXIT

if [ ! -d "$DIR" ] && [ ! -d "$SDIR" ]; then
  echo "Die Ordner „$DIR“ und „$SDIR“ fehlen. Lege sie neben index.html an und kopiere die Dateien hinein."
  exit 1
fi
[ -d js ] || { echo "Der Ordner „js“ fehlt – liegt dieses Werkzeug im Ordner „tools“ der App?"; exit 1; }

# Text für die Datei vorbereiten: \ und " schützen, Tabulatoren zu Leerzeichen
json() { printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' | tr '\t' ' '; }
lower() { printf '%s' "$1" | LC_ALL=C tr 'A-Z' 'a-z'; }   # nur A–Z (wie unter Windows), Umlaute bleiben
trim() { printf '%s' "$1" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'; }

# Breite und Höhe eines Bildes (PNG direkt aus dem Dateikopf, sonst mit sips)
dims() {
  local f="$1" b w h
  case "$(lower "$f")" in
    *.png)
      b=$(od -An -tu1 -j16 -N8 "$f" 2>/dev/null | tr -s ' \n' ' ')
      set -- $b
      if [ $# -eq 8 ]; then
        w=$(( ($1<<24) + ($2<<16) + ($3<<8) + $4 )); h=$(( ($5<<24) + ($6<<16) + ($7<<8) + $8 ))
        echo "$w $h"; return
      fi ;;
  esac
  if command -v sips >/dev/null 2>&1; then
    w=$(sips -g pixelWidth "$f" 2>/dev/null | awk '/pixelWidth/{print $2}')
    h=$(sips -g pixelHeight "$f" 2>/dev/null | awk '/pixelHeight/{print $2}')
    echo "${w:-0} ${h:-0}"; return
  fi
  echo "0 0"
}

STAND="$(date '+%Y-%m-%d %H:%M')"

# ---------------------------------------------------------------------
# 1) Bilder
# ---------------------------------------------------------------------
# Bildliste: nur der Dateiname zählt (alles hinter „;“ ist Größe/Beschreibung, Zeilen mit # sind Erklärungen)
if [ -f "$LIST" ]; then
  tr -d '\r' < "$LIST" | sed -e 's/^[[:space:]]*//' -e '/^#/d' -e 's/[[:space:]]*;.*$//' -e 's/[[:space:]]*$//' -e '/^$/d' > "$NAMES"
fi
n=0; skipped=""; unknown=""; have=0
{
  echo "/* Automatisch erzeugt von tools/Grafiken-einbinden – bitte nicht von Hand ändern."
  echo "   Stand: $STAND. Schlüssel = Pfad ohne Endung (klein geschrieben): [Datei, Breite, Höhe] */"
  echo "window.ASSET_MAP={\"stand\":\"$STAND\",\"files\":{"
} > "$TMP"

first=1
if [ -d "$DIR" ]; then
while IFS= read -r f; do
  rel="${f#$DIR/}"
  if ! [[ "$rel" =~ ^[A-Za-z0-9_./-]+$ ]]; then skipped="$skipped
   $rel"; continue; fi
  key=$(lower "${rel%.*}")
  set -- $(dims "$f")
  w=${1:-0}; h=${2:-0}
  if [ $first -eq 1 ]; then first=0; else printf ',\n' >> "$TMP"; fi
  printf '"%s":["%s",%s,%s]' "$key" "$rel" "$w" "$h" >> "$TMP"
  n=$((n+1))
  if [ -s "$NAMES" ]; then
    base="${key%_[1-4]}"   # Varianten karte/<name>_1 … _4 gelten als bekannt, wenn karte/<name> in der Liste steht
    if grep -Fxq "$key.png" "$NAMES" || { [ "${key#karte/}" != "$key" ] && grep -Fxq "$base.png" "$NAMES"; }; then have=$((have+1)); else unknown="$unknown
   $rel"; fi
  fi
done < <(find "$DIR" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' \) ! -name '.*' | LC_ALL=C sort)
fi
[ $first -eq 1 ] || printf '\n' >> "$TMP"

# ---------------------------------------------------------------------
# 2) Töne, Sprache, Musik (sounds-neu/toene, sounds-neu/sprache, sounds-neu/musik)
# ---------------------------------------------------------------------
sn=0; sfirst=1; SOUNDS=""; odd=""; dup=""; noplace=""; keys="
"
if [ -d "$SDIR" ]; then
while IFS= read -r f; do
  rel="${f#$SDIR/}"
  key=$(lower "${rel%.*}")
  case "$keys" in *"
$key
"*) dup="$dup
   $rel"; continue;; esac
  keys="$keys$key
"
  if ! [[ "$rel" =~ ^[A-Za-z0-9_./-]+$ ]]; then odd="$odd
   $rel"; fi
  case "$key" in toene/*|sprache/*|musik/*) ;; *) noplace="$noplace
   $rel";; esac
  if [ $sfirst -eq 1 ]; then sfirst=0; else SOUNDS="$SOUNDS,
"; fi
  SOUNDS="$SOUNDS\"$(json "$key")\":\"$(json "$rel")\""
  sn=$((sn+1))
done < <(find "$SDIR" -type f \( -iname '*.mp3' -o -iname '*.m4a' -o -iname '*.wav' -o -iname '*.ogg' -o -iname '*.oga' -o -iname '*.aac' \) ! -name '.*' | LC_ALL=C sort)
fi

# saetze.txt:  dateiname.mp3 = Genauer Satz.
zn=0; zfirst=1; SATZ=""; zmiss=""; zbad=""; znote=""
if [ -f "$SAETZE" ]; then
  if [ "$(head -c 5 "$SAETZE")" = '{\rtf' ]; then
    znote="saetze.txt ist kein reiner Text (RTF). In TextEdit: Menü „Format“ → „In reinen Text umwandeln“, dann sichern."
  elif command -v iconv >/dev/null 2>&1 && ! iconv -f UTF-8 -t UTF-8 "$SAETZE" >/dev/null 2>&1; then
    znote="saetze.txt ist nicht als „Unicode (UTF-8)“ gesichert – die Umlaute wären falsch. Bitte in TextEdit neu sichern (Codierung: Unicode UTF-8)."
  else
    lnr=0
    while IFS= read -r line || [ -n "$line" ]; do
      lnr=$((lnr+1))
      line="${line%$'\r'}"
      [ $lnr -eq 1 ] && line="${line#$'\xEF\xBB\xBF'}"
      line=$(trim "$line")
      case "$line" in ''|'#'*) continue;; esac
      case "$line" in *=*) ;; *) zbad="$zbad
   Zeile $lnr: $line"; continue;; esac
      file=$(trim "${line%%=*}"); satz=$(trim "${line#*=}")
      file="${file#sounds-neu/}"; file="${file#sprache/}"
      if [ -z "$file" ] || [ -z "$satz" ]; then zbad="$zbad
   Zeile $lnr: $line"; continue; fi
      # Datei suchen: genau so, ohne Endung, oder mit anderer Groß-/Kleinschreibung (eingetragen wird der echte Name)
      hit=""
      for cand in "$file" "$file.mp3" "$file.m4a" "$file.wav" "$file.ogg"; do
        case "$cand" in */*) sub="${cand%/*}/"; leaf="${cand##*/}";; *) sub=""; leaf="$cand";; esac
        d="$SDIR/sprache/${sub%/}"; d="${d%/}"
        [ -d "$d" ] || continue
        all=$(find "$d" -maxdepth 1 -type f -iname "$leaf" 2>/dev/null | LC_ALL=C sort)
        [ -n "$all" ] || continue
        act=$(printf '%s\n' "$all" | head -n 1)
        while IFS= read -r one; do [ "$one" = "$d/$leaf" ] && act="$one"; done <<EOL
$all
EOL
        hit="$sub${act##*/}"; break
      done
      if [ -z "$hit" ]; then zmiss="$zmiss
   Zeile $lnr: $file  (für: $satz)"; continue; fi
      printf '%s\n' "sprache/$(lower "${hit%.*}")" >> "$USED"
      if [ $zfirst -eq 1 ]; then zfirst=0; else SATZ="$SATZ,
"; fi
      SATZ="$SATZ\"$(json "$satz")\":\"$(json "sprache/$hit")\""
      zn=$((zn+1))
    done < "$SAETZE"
  fi
fi

if [ $sn -gt 0 ] || [ $zn -gt 0 ]; then
  printf '},"sounds":{\n' >> "$TMP"
  [ $sn -gt 0 ] && printf '%s\n' "$SOUNDS" >> "$TMP"
  printf '},"saetze":{\n' >> "$TMP"
  [ $zn -gt 0 ] && printf '%s\n' "$SATZ" >> "$TMP"
fi
printf '}};\n' >> "$TMP"
mv "$TMP" "$OUT"

# Welche Ton-/Sprach-Namen kennt die App? (nur für Hinweise auf Tippfehler)
if [ -f "$TONLIST" ]; then
  tr -d '\r' < "$TONLIST" | sed -e 's/^[[:space:]]*//' -e '/^#/d' -e 's/[[:space:]]*;.*$//' -e 's/\.[A-Za-z0-9]*$//' -e '/^$/d' -e '/\//!s/^/toene\//' >> "$KNOWN"
fi
if [ -f "$VLIST" ]; then
  tr -d '\r' < "$VLIST" | sed -e $'1s/^\xEF\xBB\xBF//' -e 's/;.*$//' -e 's/\.[A-Za-z0-9]*$//' -e '/^$/d' -e 's/^/sprache\//' >> "$KNOWN"
fi
if [ -f "$XLIST" ]; then
  tr -d '\r' < "$XLIST" | sed -e 's/^[[:space:]]*//' -e '/^#/d' -e '/=/!d' -e 's/[[:space:]]*=.*$//' -e 's/\.[A-Za-z0-9]*$//' -e '/^$/d' -e 's/^/sprache\//' >> "$KNOWN"
fi
sunknown=""
if [ -s "$KNOWN" ] && [ $sn -gt 0 ]; then
  while IFS= read -r k; do
    [ -z "$k" ] && continue
    case "$k" in musik/*) continue;; toene/*|sprache/*) ;; *) continue;; esac
    grep -Fxq "$k" "$KNOWN" && continue
    grep -Fxq "$k" "$USED" && continue
    sunknown="$sunknown
   $k"
  done <<EOF
$keys
EOF
fi

echo ""
echo "Fertig! → $OUT"
echo "   $n Bilder"
echo "   $sn Ton-/Sprachdateien, $zn Sätze aus saetze.txt"
if [ -s "$NAMES" ]; then
  total=$(grep -c . "$NAMES")
  echo "Aus der Bildliste vorhanden: $have von $total."
fi
if [ -n "$unknown" ]; then
  echo ""
  echo "Diese Bilder stehen nicht in der Bildliste (Tippfehler im Namen?) – sie werden trotzdem eingebunden:$unknown"
fi
if [ -n "$skipped" ]; then
  echo ""
  echo "Bilder übersprungen (bitte nur a–z, 0–9, _ und - im Namen, keine Leerzeichen/Umlaute):$skipped"
fi
if [ -n "$noplace" ]; then
  echo ""
  echo "Diese Tondateien liegen nicht in „toene“, „sprache“ oder „musik“ – so findet die App sie nicht:$noplace"
fi
if [ -n "$sunknown" ]; then
  echo ""
  echo "Diese Namen kennt die App nicht (Tippfehler? Namen stehen in tools/toene-liste.txt und tools/sprache-liste…;"
  echo "eigene Sätze brauchen eine Zeile in sounds-neu/sprache/saetze.txt):$sunknown"
fi
if [ -n "$dup" ]; then
  echo ""
  echo "Doppelt (gleicher Name mit anderer Endung) – benutzt wird nur die erste Datei, nicht diese:$dup"
fi
if [ -n "$odd" ]; then
  echo ""
  echo "Achtung, Leerzeichen/Umlaute/Sonderzeichen im Namen. Am eigenen Computer klappt das meistens,"
  echo "im Internet (GitHub Pages) oft nicht – besser umbenennen (nur a–z, 0–9, _ und -):$odd"
fi
if [ -n "$znote" ]; then
  echo ""
  echo "$znote"
fi
if [ -n "$zmiss" ]; then
  echo ""
  echo "saetze.txt: Zu diesen Zeilen fehlt die Tondatei in sounds-neu/sprache/ (Zeile wird ausgelassen):$zmiss"
fi
if [ -n "$zbad" ]; then
  echo ""
  echo "saetze.txt: Diese Zeilen verstehe ich nicht (Format: dateiname.mp3 = Genauer Satz.):$zbad"
fi
echo ""
echo "Tipp: Die App neu laden (bei GitHub Pages: hochladen, dann Seite neu laden)."
echo "Du kannst dieses Fenster jetzt schließen."
