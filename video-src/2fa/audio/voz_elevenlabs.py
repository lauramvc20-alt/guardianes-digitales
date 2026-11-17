#!/usr/bin/env python3
"""Narración con ElevenLabs (plan gratuito, voz predefinida Eric, modelo multilingüe).
Lee ELEVENLABS_API_KEY del entorno (nunca la escribas en el código ni la subas al repositorio).
Genera audio/lines/<id>.wav y audio/lines/<id>.json (tiempos de cada carácter, para sincronizar
la animación con palabras concretas) a partir de guion.json.

    ELEVENLABS_API_KEY=... python3 audio/voz_elevenlabs.py                 # todas las líneas
    python3 audio/voz_elevenlabs.py --solo L3d                             # solo algunas (ahorra cuota)
    python3 audio/voz_elevenlabs.py --voz <voice_id>                       # otra voz (por defecto Eric)

Plan gratuito: menciona a ElevenLabs en los créditos si publicas el audio.
"""
import base64, json, os, pathlib, subprocess, sys, urllib.request

args = sys.argv[1:]
VOICE = args[args.index("--voz") + 1] if "--voz" in args else "cjVigY5qzO86Huf0OWal"  # Eric
SOLO = args[args.index("--solo") + 1].split(",") if "--solo" in args else None
base = pathlib.Path(__file__).parent
guion = json.loads((base / "guion.json").read_text(encoding="utf-8"))
(base / "lines").mkdir(exist_ok=True)
key = os.environ.get("ELEVENLABS_API_KEY")

for i, l in enumerate(guion):
    if SOLO and l["id"] not in SOLO:
        continue
    body = {
        "text": l["texto"],
        "model_id": "eleven_multilingual_v2",
        "language_code": "es",
        "seed": 7,
        "previous_text": guion[i - 1]["texto"] if i else "",
        "next_text": guion[i + 1]["texto"] if i + 1 < len(guion) else "",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.2},
    }
    headers = {"Content-Type": "application/json"}
    if key:
        headers["xi-api-key"] = key
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(body).encode(), headers=headers, method="POST")
    resp = json.loads(urllib.request.urlopen(req, timeout=90).read())
    mp3 = base / "lines" / f"{l['id']}.mp3"
    mp3.write_bytes(base64.b64decode(resp["audio_base64"]))
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(mp3), "-ac", "1", "-ar", "44100",
                    str(base / "lines" / f"{l['id']}.wav")], check=True)
    mp3.unlink()
    al = resp.get("alignment") or {}
    (base / "lines" / f"{l['id']}.json").write_text(json.dumps(al, ensure_ascii=False), encoding="utf-8")
    print("ok", l["id"])
