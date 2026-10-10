@echo off
rem =====================================================================
rem  Dino-Inselwelt - Grafiken, Toene und Sprache einbinden (Windows)
rem  Doppelklick genuegt. Schaut in die Ordner "grafiken-neu" und
rem  "sounds-neu" und schreibt die Liste aller gefundenen Dateien nach
rem  "js\asset-map.js" (dieselbe Datei wie Grafiken-einbinden.command am Mac).
rem =====================================================================
setlocal
cd /d "%~dp0.."
powershell -NoProfile -ExecutionPolicy Bypass -Command "$s=[IO.File]::ReadAllText('%~f0'); $i=$s.IndexOf('#'+'POWERSHELL'); Invoke-Expression $s.Substring($i)"
echo.
pause
exit /b
#POWERSHELL
$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$dir = Join-Path $root 'grafiken-neu'
$sdir = Join-Path $root 'sounds-neu'
$out = Join-Path $root 'js\asset-map.js'
$list = Join-Path $root 'tools\grafiken-liste.txt'
$tonlist = Join-Path $root 'tools\toene-liste.txt'
$vlist = Join-Path $root 'tools\sprache-liste.csv'
$xlist = Join-Path $root 'tools\sprache-liste-experimente.txt'
$utf8 = New-Object System.Text.UTF8Encoding $false
$ord = [StringComparer]::Ordinal
if (-not (Test-Path $dir) -and -not (Test-Path $sdir)) { Write-Host 'Die Ordner "grafiken-neu" und "sounds-neu" fehlen. Lege sie neben index.html an.'; return }
if (-not (Test-Path (Join-Path $root 'js'))) { Write-Host 'Der Ordner "js" fehlt - liegt dieses Werkzeug im Ordner "tools" der App?'; return }
try { Add-Type -AssemblyName System.Drawing } catch {}
function Get-Dims($path) {
  try {
    $fs = [IO.File]::OpenRead($path); $b = New-Object byte[] 24; [void]$fs.Read($b, 0, 24); $fs.Close()
    if ($b[0] -eq 0x89 -and $b[1] -eq 0x50) {
      $w = ([int]$b[16] -shl 24) -bor ([int]$b[17] -shl 16) -bor ([int]$b[18] -shl 8) -bor [int]$b[19]
      $h = ([int]$b[20] -shl 24) -bor ([int]$b[21] -shl 16) -bor ([int]$b[22] -shl 8) -bor [int]$b[23]
      return @($w, $h)
    }
  } catch {}
  try { $img = [System.Drawing.Image]::FromFile($path); $r = @($img.Width, $img.Height); $img.Dispose(); return $r } catch { return @(0, 0) }
}
# nur A-Z klein schreiben (wie am Mac), Umlaute bleiben
function Lower-Ascii([string]$s) { return [regex]::Replace($s, '[A-Z]', { param($m) $m.Value.ToLowerInvariant() }) }
function To-Json([string]$s) { return $s.Replace('\', '\\').Replace('"', '\"').Replace("`t", ' ') }
function No-Ext([string]$s) { return ($s -replace '\.[^.]*$', '') }
# Dateien eines Ordners als Pfade mit "/" - sortiert wie am Mac (nach Zeichencode)
function Get-Rel([string]$base, [string]$pattern) {
  $l = New-Object System.Collections.Generic.List[string]
  if (Test-Path $base) {
    Get-ChildItem -LiteralPath $base -Recurse -File | Where-Object { $_.Extension -match $pattern -and -not $_.Name.StartsWith('.') } | ForEach-Object { $l.Add($_.FullName.Substring($base.Length + 1).Replace('\', '/')) }
  }
  $a = $l.ToArray(); [Array]::Sort($a, $ord); return ,$a
}
# erste Spalte einer Liste (Zeilen mit # und alles hinter ";" zaehlen nicht)
function Get-Names([string]$path) {
  $l = New-Object System.Collections.Generic.List[string]
  if (Test-Path $path) { foreach ($x in [IO.File]::ReadAllLines($path, $utf8)) { $t = $x.Trim().TrimStart([char]0xFEFF); if ($t -eq '' -or $t.StartsWith('#')) { continue }; $i = $t.IndexOf(';'); if ($i -ge 0) { $t = $t.Substring(0, $i).Trim() }; if ($t -ne '') { $l.Add($t) } } }
  return ,$l.ToArray()
}

# ---------------------------------------------------------------------
# 1) Bilder
# ---------------------------------------------------------------------
$names = New-Object System.Collections.Hashtable $ord
$total = 0
foreach ($x in (Get-Names $list)) { $names[$x] = 1; $total++ }
$lines = New-Object System.Collections.Generic.List[string]
$skipped = @(); $unknown = @(); $have = 0
foreach ($rel in (Get-Rel $dir '^\.(png|jpe?g|webp)$')) {
  if ($rel -notmatch '^[A-Za-z0-9_./-]+$') { $skipped += $rel; continue }
  $key = Lower-Ascii (No-Ext $rel)
  $d = Get-Dims (Join-Path $dir $rel.Replace('/', '\'))
  $lines.Add(('"{0}":["{1}",{2},{3}]' -f $key, $rel, $d[0], $d[1]))
  if ($total -gt 0) { $base = ($key -replace '_[1-4]$', ''); if ($names.ContainsKey("$key.png") -or ($key.StartsWith('karte/') -and $names.ContainsKey("$base.png"))) { $have++ } else { $unknown += $rel } }
}

# ---------------------------------------------------------------------
# 2) Toene, Sprache, Musik (sounds-neu\toene, sounds-neu\sprache, sounds-neu\musik)
# ---------------------------------------------------------------------
$slines = New-Object System.Collections.Generic.List[string]
$keys = New-Object System.Collections.Generic.List[string]
$seen = New-Object System.Collections.Hashtable $ord
$odd = @(); $dup = @(); $noplace = @()
foreach ($rel in (Get-Rel $sdir '^\.(mp3|m4a|wav|ogg|oga|aac)$')) {
  $key = Lower-Ascii (No-Ext $rel)
  if ($seen.ContainsKey($key)) { $dup += $rel; continue }
  $seen[$key] = 1; $keys.Add($key)
  if ($rel -notmatch '^[A-Za-z0-9_./-]+$') { $odd += $rel }
  if (-not ($key.StartsWith('toene/') -or $key.StartsWith('sprache/') -or $key.StartsWith('musik/'))) { $noplace += $rel }
  $slines.Add(('"{0}":"{1}"' -f (To-Json $key), (To-Json $rel)))
}

# saetze.txt:  dateiname.mp3 = Genauer Satz.
$zlines = New-Object System.Collections.Generic.List[string]
$used = New-Object System.Collections.Hashtable $ord
$zmiss = @(); $zbad = @(); $znote = ''
$spdir = Join-Path $sdir 'sprache'
$sz = Join-Path $spdir 'saetze.txt'
if (Test-Path $sz) {
  $bytes = [IO.File]::ReadAllBytes($sz)
  $text = $null
  if ($bytes.Length -ge 5 -and [Text.Encoding]::ASCII.GetString($bytes, 0, 5) -eq '{\rtf') {
    $znote = 'saetze.txt ist kein reiner Text (RTF). Bitte als "Nur Text" (.txt, UTF-8) speichern.'
  } elseif ($bytes.Length -ge 2 -and $bytes[0] -eq 0xFF -and $bytes[1] -eq 0xFE) { $text = [Text.Encoding]::Unicode.GetString($bytes)
  } elseif ($bytes.Length -ge 2 -and $bytes[0] -eq 0xFE -and $bytes[1] -eq 0xFF) { $text = [Text.Encoding]::BigEndianUnicode.GetString($bytes)
  } else {
    try { $text = (New-Object System.Text.UTF8Encoding $false, $true).GetString($bytes) }
    catch { $znote = 'saetze.txt ist nicht als UTF-8 gespeichert - die Umlaute waeren falsch. Bitte im Editor "Speichern unter", Codierung UTF-8.' }
  }
  if ($text -ne $null) {
    $lnr = 0
    foreach ($raw in ($text -split "`n")) {
      $lnr++
      $line = $raw.Trim().TrimStart([char]0xFEFF).Trim()
      if ($line -eq '' -or $line.StartsWith('#')) { continue }
      $i = $line.IndexOf('=')
      if ($i -lt 0) { $zbad += "Zeile ${lnr}: $line"; continue }
      $file = $line.Substring(0, $i).Trim(); $satz = $line.Substring($i + 1).Trim()
      if ($file.StartsWith('sounds-neu/')) { $file = $file.Substring(11) }
      if ($file.StartsWith('sprache/')) { $file = $file.Substring(8) }
      if ($file -eq '' -or $satz -eq '') { $zbad += "Zeile ${lnr}: $line"; continue }
      # Datei suchen: genau so, ohne Endung, oder mit anderer Gross-/Kleinschreibung (eingetragen wird der echte Name)
      $hit = $null
      foreach ($cand in @($file, "$file.mp3", "$file.m4a", "$file.wav", "$file.ogg")) {
        $sub = ''; $leaf = $cand; $j = $cand.LastIndexOf('/'); if ($j -ge 0) { $sub = $cand.Substring(0, $j + 1); $leaf = $cand.Substring($j + 1) }
        $d = $spdir; if ($sub -ne '') { $d = Join-Path $spdir $sub.TrimEnd('/').Replace('/', '\') }
        if (-not (Test-Path -LiteralPath $d -PathType Container)) { continue }
        $all = @(Get-ChildItem -LiteralPath $d -File | Where-Object { $_.Name -ieq $leaf } | ForEach-Object { $_.Name })
        if ($all.Count -eq 0) { continue }
        [Array]::Sort($all, $ord)
        $act = $all[0]; foreach ($x in $all) { if ($x -ceq $leaf) { $act = $x } }
        $hit = $sub + $act; break
      }
      if ($hit -eq $null) { $zmiss += "Zeile ${lnr}: $file  (fuer: $satz)"; continue }
      $used['sprache/' + (Lower-Ascii (No-Ext $hit))] = 1
      $zlines.Add(('"{0}":"{1}"' -f (To-Json $satz), (To-Json ('sprache/' + $hit))))
    }
  }
}

# ---------------------------------------------------------------------
# 3) Datei schreiben (gleicher Aufbau und gleicher Kopf wie am Mac)
# ---------------------------------------------------------------------
$stand = Get-Date -Format 'yyyy-MM-dd HH:mm'
$ae = [string][char]0xE4; $ue = [string][char]0xFC; $oe = [string][char]0xF6; $dash = [string][char]0x2013
$nl = "`n"
$text = "/* Automatisch erzeugt von tools/Grafiken-einbinden $dash bitte nicht von Hand ${ae}ndern.$nl" +
        "   Stand: $stand. Schl${ue}ssel = Pfad ohne Endung (klein geschrieben): [Datei, Breite, H${oe}he] */$nl" +
        'window.ASSET_MAP={"stand":"' + $stand + '","files":{' + $nl
if ($lines.Count -gt 0) { $text += ($lines -join ",$nl") + $nl }
if ($slines.Count -gt 0 -or $zlines.Count -gt 0) {
  $text += '},"sounds":{' + $nl
  if ($slines.Count -gt 0) { $text += ($slines -join ",$nl") + $nl }
  $text += '},"saetze":{' + $nl
  if ($zlines.Count -gt 0) { $text += ($zlines -join ",$nl") + $nl }
}
$text += '}};' + $nl
[IO.File]::WriteAllText($out, $text, $utf8)

# Welche Ton-/Sprach-Namen kennt die App? (nur fuer Hinweise auf Tippfehler)
$known = New-Object System.Collections.Hashtable $ord
foreach ($x in (Get-Names $tonlist)) { $k = No-Ext $x; if ($k -notmatch '/') { $k = 'toene/' + $k }; $known[$k] = 1 }
foreach ($x in (Get-Names $vlist)) { $known['sprache/' + (No-Ext $x)] = 1 }
if (Test-Path $xlist) { foreach ($x in [IO.File]::ReadAllLines($xlist, $utf8)) { $t = $x.Trim().TrimStart([char]0xFEFF); if ($t -eq '' -or $t.StartsWith('#')) { continue }; $i = $t.IndexOf('='); if ($i -lt 0) { continue }; $known['sprache/' + (No-Ext $t.Substring(0, $i).Trim())] = 1 } }
$sunknown = @()
if ($known.Count -gt 0) { foreach ($k in $keys) { if ($k.StartsWith('musik/')) { continue }; if (-not ($k.StartsWith('toene/') -or $k.StartsWith('sprache/'))) { continue }; if ($known.ContainsKey($k) -or $used.ContainsKey($k)) { continue }; $sunknown += $k } }

Write-Host ''
Write-Host 'Fertig! -> js\asset-map.js'
Write-Host ("   {0} Bilder" -f $lines.Count)
Write-Host ("   {0} Ton-/Sprachdateien, {1} Saetze aus saetze.txt" -f $slines.Count, $zlines.Count)
if ($total -gt 0) { Write-Host ("Aus der Bildliste vorhanden: {0} von {1}." -f $have, $total) }
function Show-List([string]$title, $items) { if ($items.Count) { Write-Host ''; Write-Host $title; $items | ForEach-Object { Write-Host "   $_" } } }
Show-List 'Diese Bilder stehen nicht in der Bildliste (Tippfehler im Namen?) - sie werden trotzdem eingebunden:' $unknown
Show-List 'Bilder uebersprungen (bitte nur a-z, 0-9, _ und - im Namen, keine Leerzeichen/Umlaute):' $skipped
Show-List 'Diese Tondateien liegen nicht in "toene", "sprache" oder "musik" - so findet die App sie nicht:' $noplace
Show-List 'Diese Namen kennt die App nicht (Tippfehler? Namen stehen in tools\toene-liste.txt und tools\sprache-liste...; eigene Saetze brauchen eine Zeile in sounds-neu\sprache\saetze.txt):' $sunknown
Show-List 'Doppelt (gleicher Name mit anderer Endung) - benutzt wird nur die erste Datei, nicht diese:' $dup
Show-List 'Achtung, Leerzeichen/Umlaute/Sonderzeichen im Namen. Am eigenen Computer klappt das meistens, im Internet (GitHub Pages) oft nicht - besser umbenennen (nur a-z, 0-9, _ und -):' $odd
if ($znote -ne '') { Write-Host ''; Write-Host $znote }
Show-List 'saetze.txt: Zu diesen Zeilen fehlt die Tondatei in sounds-neu\sprache\ (Zeile wird ausgelassen):' $zmiss
Show-List 'saetze.txt: Diese Zeilen verstehe ich nicht (Format: dateiname.mp3 = Genauer Satz.):' $zbad
Write-Host ''
Write-Host 'Tipp: Die App neu laden (bei GitHub Pages: hochladen, dann Seite neu laden).'
