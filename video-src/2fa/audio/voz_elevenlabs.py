#!/usr/bin/env python3
"""Narración con ElevenLabs (plan gratuito, voz predefinida Eric, modelo multilingüe).
Lee ELEVENLABS_API_KEY del entorno (nunca la escribas en el código ni la subas al repositorio).
Genera audio/lines/<id>.wav a partir de guion.json.

    ELEVENLABS_API_KEY=... python3 audio/voz_elevenlabs.py            # voz Eric
    python3 audio/voz_elevenlabs.py <voice_id>                        # otra voz

Plan gratuito: menciona a ElevenLabs en los créditos si publicas el audio.
"""
import json, os, pathlib, subprocess, sys, urllib.request

VOICE = sys.argv[1] if len(sys.argv) > 1 else "cjVigY5qzO86Huf0OWal"  # Eric
base = pathlib.Path(__file__).parent
guion = json.loads((base / "guion.json").read_text(encoding="utf-8"))
(base / "lines").mkdir(exist_ok=True)
key = os.environ.get("ELEVENLABS_API_KEY")

for i, l in enumerate(guion):
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
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128",
        data=json.dumps(body).encode(), headers=headers, method="POST")
    mp3 = base / "lines" / f"{l['id']}.mp3"
    mp3.write_bytes(urllib.request.urlopen(req, timeout=60).read())
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(mp3), "-ac", "1", "-ar", "44100",
                    str(base / "lines" / f"{l['id']}.wav")], check=True)
    mp3.unlink()
    print("ok", l["id"])
