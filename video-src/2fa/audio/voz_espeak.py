#!/usr/bin/env python3
"""Voz PROVISIONAL gratuita y sin conexión (espeak-ng + voz mexicana mbrola).
Requiere:  sudo apt install espeak-ng mbrola mbrola-mx1
Genera lines/<id>.wav a partir de guion.json. Sustituible por voz_piper.py o voz_sabina.ps1."""
import json, subprocess, pathlib
base = pathlib.Path(__file__).parent
(base / "lines").mkdir(exist_ok=True)
for l in json.loads((base / "guion.json").read_text(encoding="utf-8")):
    out = base / "lines" / f"{l['id']}.wav"
    subprocess.run(["espeak-ng", "-v", "mb-mx1", "-s", "178", "-g", "4", "-w", str(out), l["texto"]],
                   check=True, stderr=subprocess.DEVNULL)
    print("ok", out.name)
