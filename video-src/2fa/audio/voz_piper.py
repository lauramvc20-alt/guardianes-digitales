#!/usr/bin/env python3
"""Voz NEURONAL, gratuita y sin conexión (Piper). Se ejecuta en TU equipo, que sí puede
descargar las voces (el entorno donde se montó el video tiene bloqueado ese servidor).

  pip install piper-tts

  1) Compara voces (genera la primera frase con cada una en audio/muestras_piper/):
       python audio/voz_piper.py --probar
  2) Genera todas las líneas con la que prefieras (se descarga sola la primera vez):
       python audio/voz_piper.py es_MX-claude-high
  3) Sincroniza y renderiza:
       npm run audio && npm run render:subtitulos

Escucha y compara voces en https://rhasspy.github.io/piper-samples/ (idioma es).
"""
import json, pathlib, subprocess, sys

CANDIDATAS = ["es_MX-claude-high", "es_MX-ald-medium", "es_ES-davefx-medium",
              "es_ES-sharvard-medium", "es_ES-carlfm-x_low", "es_AR-daniela-high"]
base = pathlib.Path(__file__).parent
guion = json.loads((base / "guion.json").read_text(encoding="utf-8"))


def asegurar_voz(voz):
    subprocess.run([sys.executable, "-m", "piper.download_voices", voz], check=True)


def decir(voz, texto, salida):
    salida.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run([sys.executable, "-m", "piper", "-m", voz, "-f", str(salida)],
                   input=texto.encode("utf-8"), check=True)


if "--probar" in sys.argv:
    for v in CANDIDATAS:
        try:
            asegurar_voz(v)
            decir(v, guion[0]["texto"] + " " + guion[1]["texto"], base / "muestras_piper" / f"{v}.wav")
            print("ok", v)
        except subprocess.CalledProcessError:
            print("no disponible", v)
    print("Escucha audio/muestras_piper/ y elige una.")
else:
    voz = next((a for a in sys.argv[1:] if not a.startswith("-")), "es_MX-claude-high")
    asegurar_voz(voz)
    for l in guion:
        decir(voz, l["texto"], base / "lines" / f"{l['id']}.wav")
        print("ok", l["id"])
    print(f"Listo con {voz}. Ahora: npm run audio && npm run render:subtitulos")
