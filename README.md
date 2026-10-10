# Dino-Inselwelt

Eine gemalte Dino-Insel für Kinder von 4 bis 8 Jahren: eine riesige Aquarell-Weltkarte mit Boot, 42 Stationen auf der Urkontinent-Karte Pangäa und Minispielen rund um Dinosaurier, Urzeit-Meer, Fossilien und Plattentektonik. Alles wird vorgelesen, ohne Lesen spielbar, ohne Konto, ohne Werbung, offline nutzbar.

## Starten

- **Online (empfohlen):** GitHub Pages einschalten (siehe unten), dann die Adresse im Browser öffnen. Auf iPad/iPhone: **Teilen → Zum Home-Bildschirm** – danach läuft die App auch offline.
- **Am Computer:** `index.html` doppelklicken.

## GitHub Pages einschalten

1. Im Repository auf **Settings → Pages** gehen.
2. Unter „Build and deployment“: **Source: Deploy from a branch**, Branch **main**, Ordner **/ (root)**, speichern.
3. Nach 1–2 Minuten ist die App unter `https://<benutzername>.github.io/<repository-name>/` erreichbar.

## Ordner

| Ordner | Inhalt |
|---|---|
| `index.html`, `manifest.webmanifest`, `sw.js` | App-Grundgerüst, Offline-Speicher |
| `js/` | Zeichnungen (`art.js`), Inhalte (`data.js`, `data2.js`), Kern, Weltkarte, Spiele-Baukasten, Aufträge, Stimmen-Liste |
| `stations/` | die 42 Stationen auf der Urkontinent-Karte Pangäa |
| `css/` | Gestaltung |
| `data/` | Plattentektonik-Daten, 100 Experimente |
| `assets/` | Schriften, Dinokarten, Kino-Bilder, Sprachaufnahmen (`voice/`), Geräusche, Icons |
| `docs/` | Anleitung (`LIESMICH.md`) und die Bild-Prompts für die neue Grafik (`bildprompts/`) |
| `grafiken-neu/` | Platz für die neuen KI-Grafiken (Dateinamen wie in den Prompt-Tabellen) |

## Nach Änderungen

In `sw.js` die Versionsnummer (`dino-inselwelt-v7`) erhöhen, sonst zeigen installierte Geräte die alte Fassung.

## Quellen & Hinweise

- Globus: Plattenmodell Merdith et al. (2021) / Müller et al. (2022), EarthByte / GPlates.
- Mary-Anning-Gemälde: gemeinfrei.
- Sprachaufnahmen: ElevenLabs (über Higgsfield), Stimmen „Julian“ und „Pixie“.
- Dinokarten, Kino-Bilder und Game-Design: Karo.
