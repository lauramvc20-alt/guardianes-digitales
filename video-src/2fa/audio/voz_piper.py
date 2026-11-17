#!/usr/bin/env python3
"""Voz NEURONAL gratuita y sin conexión con Piper (español de México).
Ejecútalo en tu equipo (necesita descargar la voz desde Hugging Face una sola vez):

    pip install piper-tts
    python -m piper.download_voices es_MX-claude-high      # ~60 MB, una vez
    python audio/voz_piper.py

Genera audio/lines/<id>.wav. Después: npm run audio && npm run render
"""
import json, pathlib, subprocess, sys
VOZ = sys.argv[1] if len(sys.argv) > 1 else "es_MX-claude-high"
base = pathlib.Path(__file__).parent
(base / "lines").mkdir(exist_ok=True)
for l in json.loads((base / "guion.json").read_text(encoding="utf-8")):
    out = base / "lines" / f"{l['id']}.wav"
    subprocess.run([sys.executable, "-m", "piper", "-m", VOZ, "-f", str(out)],
                   input=l["texto"].encode("utf-8"), check=True)
    print("ok", out.name)
