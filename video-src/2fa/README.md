# Tutorial 2FA · Guardián Digital (Remotion)

Video de ~26 s (1920×1080, 30 fps, H.264 + AAC) sobre la verificación en dos pasos.
Se destina al **Kit Digital** de la plataforma (`PVA/assets/media/2fa/`).

## Flujo de trabajo
```bash
cd video-src/2fa
npm install
python3 audio/voz_espeak.py     # voz provisional (o voz_piper.py / voz_sabina.ps1)
npm run audio                   # sincroniza voz, compone música y efectos, genera timings.json y VTT
npm run estudio                 # vista previa interactiva
npm run render                  # out/tutorial-2fa.mp4
npm run render:subtitulos       # out/tutorial-2fa-subtitulado.mp4 (subtítulos incrustados)
npm run poster                  # out/poster.png
```
En equipos sin Chrome instalado Remotion lo descarga solo. En entornos restringidos:
`REMOTION_BROWSER=/ruta/a/chrome npm run render -- --chrome-mode=chrome-for-testing`.

## Cambiar la voz
Cualquier voz sirve: basta con dejar un `audio/lines/<id>.wav` por línea del `audio/guion.json`
(`voz_piper.py` = neuronal es_MX, `voz_sabina.ps1` = voz de Windows, o grabación propia).
`npm run audio` recalcula escenas, eventos y subtítulos con las duraciones reales y avisa si
se superan los 30 s. Después se vuelve a renderizar.

## Publicar en la plataforma
Comprimir para la web y copiar a `guardianes-digitales/PVA/assets/media/2fa/`:
```bash
ffmpeg -i out/tutorial-2fa.mp4 -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart tutorial-2fa.mp4
```
Junto a `tutorial-2fa-subtitulado.mp4`, `tutorial-2fa-poster.jpg` y `tutorial-2fa.es.vtt` (de `out/subtitulos.vtt`).

## Créditos y licencias
Música y efectos: composición propia sintetizada en `audio/build_audio.py` (sin licencias externas).
Voz provisional: espeak-ng + mbrola-mx1 (software libre). Motion graphics: Remotion
(revisar su licencia para el uso previsto). Tipografía: Inter / Segoe UI del sistema.
