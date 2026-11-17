#!/usr/bin/env python3
"""Construye el audio y los tiempos del tutorial 2FA.

Entrada : lines/<id>.wav  (cualquier voz: espeak, Piper, Sabina, grabación propia)
Salida  : ../public/audio/mix.wav        narración + música original + efectos
          ../src/timings.json            escenas, líneas y eventos (sincronía)
          ../out/subtitulos.vtt          subtítulos en español

Todo el sonido que no es voz (música y efectos) se sintetiza aquí con numpy:
es composición propia, sin licencias ni descargas.
Uso: python3 build_audio.py
"""
import json, pathlib, subprocess, tempfile, wave
import numpy as np

BASE = pathlib.Path(__file__).parent
ROOT = BASE.parent
SR = 44100
MAX_SECONDS = 30.0

GAPS = {"start": 0.35, "L2": 0.45, "L3a": 0.65, "L3b": 0.30, "L3c": 0.30,
        "L3d": 0.30, "L4a": 0.65, "L4b": 0.30}   # silencio ANTES de cada línea
OUTRO = 2.2                                       # cola con el logo al final


def load_mono(path):
    """Lee cualquier wav y lo devuelve como float32 mono a 44.1 kHz."""
    with tempfile.TemporaryDirectory() as tmp:
        out = pathlib.Path(tmp) / "x.wav"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(path), "-ac", "1",
                        "-ar", str(SR), "-sample_fmt", "s16", str(out)], check=True)
        with wave.open(str(out)) as w:
            raw = w.readframes(w.getnframes())
    return np.frombuffer(raw, dtype="<i2").astype(np.float32) / 32768.0


def trim_silence(x, thr=0.01):
    idx = np.where(np.abs(x) > thr)[0]
    return x[idx[0]:idx[-1] + 1] if len(idx) else x


def env_follow(x, win=0.08):
    k = int(SR * win)
    e = np.convolve(np.abs(x), np.ones(k) / k, mode="same")
    return e


def tone(freq, dur, kind="sine", attack=0.01, release=0.2, amp=1.0):
    t = np.arange(int(SR * dur)) / SR
    if kind == "tri":
        y = 2 * np.abs(2 * ((t * freq) % 1) - 1) - 1
    else:
        y = np.sin(2 * np.pi * freq * t)
    env = np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / release)
    return (y * env * amp).astype(np.float32)


def mix_tones(*sigs):
    n = max(len(x) for x in sigs)
    out = np.zeros(n, dtype=np.float32)
    for x in sigs:
        out[:len(x)] += x
    return out


def put(track, sig, at):
    i = int(at * SR)
    if i < 0 or i >= len(track):
        return
    n = min(len(sig), len(track) - i)
    track[i:i + n] += sig[:n]


# ---------- efectos (todos sintetizados) ----------
def fx_click():
    return mix_tones(tone(1500, 0.07, "sine", 0.002, 0.02, 0.5), tone(900, 0.09, "sine", 0.002, 0.03, 0.3))

def fx_pop():
    return mix_tones(tone(520, 0.14, "sine", 0.004, 0.05, 0.55), tone(780, 0.12, "sine", 0.004, 0.04, 0.25))

def fx_whoosh(dur=0.55):
    rng = np.random.default_rng(7)
    n = rng.standard_normal(int(SR * dur)).astype(np.float32)
    # filtro paso-banda barato: media móvil cuya ventana se estrecha (barrido)
    out = np.zeros_like(n)
    for k, w in enumerate([48, 24, 12, 6]):
        out += (n - np.convolve(n, np.ones(w) / w, mode="same")) * (0.25 if k < 2 else 0.15)
    t = np.arange(len(out)) / SR
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 2
    return (out * env * 0.5).astype(np.float32)


def fx_ding():
    return mix_tones(tone(1046.5, 0.9, "sine", 0.004, 0.28, 0.5), tone(1568, 0.8, "sine", 0.004, 0.22, 0.28),
                     tone(2093, 0.6, "sine", 0.004, 0.16, 0.12))


def fx_toggle():
    return mix_tones(tone(660, 0.09, "sine", 0.003, 0.03, 0.5), tone(990, 0.16, "sine", 0.003, 0.07, 0.5),
                     tone(1320, 0.28, "sine", 0.003, 0.12, 0.35))


def fx_digit():
    return tone(1900, 0.05, "sine", 0.002, 0.015, 0.22)


# ---------- música ambiental original ----------
def music(total):
    n = int(total * SR)
    m = np.zeros(n, dtype=np.float32)
    bpm = 84
    beat = 60 / bpm
    bar = beat * 4
    # Am - F - C - G  (voicings abiertos, registro medio-grave)
    chords = [[220.00, 261.63, 329.63], [174.61, 220.00, 261.63],
              [196.00, 261.63, 329.63], [196.00, 246.94, 293.66]]
    bars = int(total / bar) + 2
    for b in range(bars):
        ch = chords[b % 4]
        start = b * bar
        for f in ch:
            for det in (-0.6, 0.6):          # leve desafinación = pad más cálido
                t = np.arange(int(SR * (bar + 1.4))) / SR
                env = np.minimum(1, t / 0.9) * np.where(t < bar, 1, np.exp(-(t - bar) / 0.45))
                y = np.sin(2 * np.pi * (f + det) * t) + 0.25 * np.sin(2 * np.pi * (f + det) * 2 * t)
                put(m, (y * env * 0.045).astype(np.float32), start)
        put(m, tone(ch[0] / 2, bar + 0.6, "sine", 0.3, 1.8, 0.16), start)      # bajo suave
        arp = [ch[0] * 2, ch[2] * 2, ch[1] * 2, ch[2] * 2, ch[0] * 4, ch[2] * 2, ch[1] * 2, ch[2] * 2]
        for i, f in enumerate(arp):                                            # arpegio tipo "pluck"
            put(m, tone(f, 0.9, "tri", 0.004, 0.22, 0.05), start + i * beat / 2)
    fade = np.minimum(1, np.arange(n) / (SR * 1.2)) * np.minimum(1, (n - np.arange(n)) / (SR * 2.0))
    return m * fade


def main():
    guion = json.loads((BASE / "guion.json").read_text(encoding="utf-8"))
    lines, t = [], GAPS["start"]
    voice_clips = {}
    leads = {}
    for l in guion:
        raw_clip = load_mono(BASE / "lines" / f"{l['id']}.wav")
        clip = trim_silence(raw_clip)
        lead = (np.where(np.abs(raw_clip) > 0.01)[0][:1].tolist() or [0])[0] / SR
        leads[l["id"]] = lead
        t += GAPS.get(l["id"], 0.3) if l["id"] != guion[0]["id"] else 0
        dur = len(clip) / SR
        lines.append({**l, "inicio": round(t, 3), "fin": round(t + dur, 3)})
        voice_clips[l["id"]] = (clip, t)
        t += dur
    total = round(t + OUTRO, 3)
    if total > MAX_SECONDS:
        raise SystemExit(f"Duración {total:.1f}s supera {MAX_SECONDS}s: acorta el guion o acelera la voz.")

    L = {l["id"]: l for l in lines}
    pad = 0.30
    scenes = [
        {"id": 1, "nombre": "Introducción", "inicio": 0.0, "fin": round(L["L2"]["inicio"] - pad, 3)},
        {"id": 2, "nombre": "¿Qué es?", "inicio": round(L["L2"]["inicio"] - pad, 3), "fin": round(L["L3a"]["inicio"] - pad, 3)},
        {"id": 3, "nombre": "¿Cómo activarla?", "inicio": round(L["L3a"]["inicio"] - pad, 3), "fin": round(L["L4a"]["inicio"] - pad, 3)},
        {"id": 4, "nombre": "Recomendación final", "inicio": round(L["L4a"]["inicio"] - pad, 3), "fin": total},
    ]

    # --- narración ---
    n = int((total + 0.5) * SR)
    voice = np.zeros(n, dtype=np.float32)
    for clip, at in voice_clips.values():
        put(voice, clip, at)
    peak = np.max(np.abs(voice)) or 1
    voice = voice / peak * 0.92

    # --- efectos sincronizados con las líneas ---
    sfx = np.zeros(n, dtype=np.float32)
    events = []

    def ev(name, at, fx):
        events.append({"evento": name, "t": round(at, 3)})
        put(sfx, fx, at)

    ev("pop-cuenta", 0.55, fx_pop())
    ev("whoosh-1", scenes[1]["inicio"] - 0.15, fx_whoosh())
    for i in range(8):
        ev(f"pass-{i}", L["L2"]["inicio"] + 0.85 + i * 0.11, fx_digit())
    ev("pop-telefono", L["L2"]["inicio"] + 1.9, fx_pop())
    for i in range(6):
        ev(f"code-{i}", L["L2"]["inicio"] + 2.55 + i * 0.14, fx_digit())
    ev("ok-identidad", L["L2"]["inicio"] + 3.55, fx_pop())
    ev("whoosh-2", scenes[2]["inicio"] - 0.15, fx_whoosh())
    ev("click-seguridad", L["L3a"]["inicio"] + 1.6, fx_click())
    ev("click-fila", L["L3b"]["inicio"] + 1.95, fx_click())
    ev("toggle-on", L["L3c"]["inicio"] + 0.45, fx_toggle())
    def word_time(line_id, word, fallback):
        """Instante (en el video) en que empieza una palabra, según los tiempos de ElevenLabs."""
        f = BASE / "lines" / f"{line_id}.json"
        try:
            al = json.loads(f.read_text(encoding="utf-8"))
            i = "".join(al["characters"]).find(word)
            if i >= 0:
                return L[line_id]["inicio"] + al["character_start_times_seconds"][i] - leads[line_id]
        except (OSError, KeyError, ValueError):
            pass
        return L[line_id]["inicio"] + fallback

    ev("click-metodo", word_time("L3d", "Microsoft", 1.6) + 0.25, fx_click())
    ev("click-google", word_time("L3d", "Google", 3.2) + 0.25, fx_click())
    ev("click-llave", word_time("L3d", "llave", 5.0) + 0.2, fx_click())
    ev("whoosh-3", scenes[3]["inicio"] - 0.15, fx_whoosh())
    ev("segunda-capa", L["L4b"]["inicio"] + 0.9, fx_pop())
    ev("logo", L["L4b"]["fin"] + 0.35, fx_ding())

    # --- música con ducking bajo la voz ---
    mus = music(total + 0.5)[:n]
    mus = np.pad(mus, (0, n - len(mus)))
    duck = 1.0 - 0.62 * np.clip(env_follow(voice) * 9, 0, 1)
    duck = np.convolve(duck, np.ones(int(SR * 0.25)) / int(SR * 0.25), mode="same")
    mus = mus * duck * 0.9

    mix = voice * 1.0 + mus + sfx * 0.55
    mix = np.clip(mix, -1, 1)
    out_dir = ROOT / "public" / "audio"
    out_dir.mkdir(parents=True, exist_ok=True)
    raw = out_dir / "_mix_raw.wav"
    pcm = (mix * 32767).astype("<i2")
    with wave.open(str(raw), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    final = out_dir / "mix.wav"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af",
                    "loudnorm=I=-16:TP=-1.5:LRA=7", "-ar", str(SR), "-ac", "2", str(final)], check=True)
    raw.unlink()

    (ROOT / "src").mkdir(exist_ok=True)
    (ROOT / "src" / "timings.json").write_text(json.dumps(
        {"total": total, "fps": 30, "escenas": scenes, "lineas": lines, "eventos": events},
        ensure_ascii=False, indent=2), encoding="utf-8")

    # --- subtítulos VTT ---
    def ts(s):
        h, r = divmod(s, 3600); m, r = divmod(r, 60)
        return f"{int(h):02d}:{int(m):02d}:{r:06.3f}"
    vtt = ["WEBVTT", ""]
    for i, l in enumerate(lines, 1):
        vtt += [str(i), f"{ts(max(0, l['inicio'] - 0.05))} --> {ts(l['fin'] + 0.25)}", l["texto"], ""]
    (ROOT / "out").mkdir(exist_ok=True)
    (ROOT / "out" / "subtitulos.vtt").write_text("\n".join(vtt), encoding="utf-8")
    print(f"OK · duración total {total:.2f} s · {len(lines)} líneas · {len(events)} eventos de sonido")


if __name__ == "__main__":
    main()
