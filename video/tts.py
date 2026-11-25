"""Génère la voix off (Kokoro TTS, voix française ff_siwis) et le minutage de la vidéo.

Usage : python3 tts.py <dossier_modele_kokoro>
Produit : build/narration.wav, build/timings.json, out/pi-spi-explication.srt
"""
import json, re, sys, os
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = sys.argv[1] if len(sys.argv) > 1 else "."
SR = 24000
SPEED = 0.98

LEAD_IN = 0.6      # silence avant le premier beat d'une scène
GAP = 0.45         # silence entre deux phrases
TAIL = 0.9         # silence en fin de scène

# Réécritures phonétiques : le sous-titre garde l'orthographe normale.
PRON = [
    (r"PI-SPI", "Pi-Spi"),
    (r"BCEAO", "Bé-Cé-E-A-O"),
    (r"UEMOA", "Uémoa"),
    (r"\bWave\b", "Ouève"),
    (r"\bMoov\b", "Mouv"),
    (r"MoMo", "Momo"),
    (r"Money", "Moni"),
    (r"money", "moni"),
    (r"\balias\b", "aliasse"),
]


def say(text):
    for a, b in PRON:
        text = re.sub(a, b, text)
    return text


def split_long(p, maxc):
    if len(p) <= maxc:
        return [p]
    mid = len(p) / 2
    cands = [m.end() for m in re.finditer(r"[,;:] ", p)] or [m.end() for m in re.finditer(r" ", p)]
    cut = min(cands, key=lambda c: abs(c - mid))
    return split_long(p[:cut].strip(), maxc) + split_long(p[cut:].strip(), maxc)


def sub_chunks(text, maxc=86):
    """Découpe une phrase en sous-titres de 2 lignes maximum."""
    parts = []
    for sent in re.split(r"(?<=[.!?])\s+", text):
        parts += split_long(sent, maxc)
    out = []
    for p in parts:
        if out and len(out[-1]) + 1 + len(p) <= maxc:
            out[-1] += " " + p
        else:
            out.append(p)
    return out


def srt_time(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def main():
    script = json.load(open(os.path.join(HERE, "script.json"), encoding="utf-8"))
    k = Kokoro(os.path.join(MODEL_DIR, "kokoro-v1.0.onnx"), os.path.join(MODEL_DIR, "voices-v1.0.bin"))
    chunks, scenes, t = [], [], 0.0

    def silence(d):
        nonlocal t
        chunks.append(np.zeros(int(round(d * SR)), dtype=np.float32))
        t += d

    for sc in script["scenes"]:
        start = t
        silence(LEAD_IN)
        beats = []
        for i, sub in enumerate(sc["beats"]):
            if i:
                silence(GAP)
            audio, sr = k.create(say(sub), voice="ff_siwis", speed=SPEED, lang="fr-fr")
            assert sr == SR
            audio = audio.astype(np.float32)
            # coupe les silences de bord produits par le modèle
            idx = np.where(np.abs(audio) > 0.01)[0]
            if len(idx):
                audio = audio[max(0, idx[0] - 600): idx[-1] + 1200]
            b0 = t
            chunks.append(audio)
            t += len(audio) / SR
            cks = sub_chunks(sub)
            total = sum(len(c) for c in cks)
            subs, c0 = [], b0
            for c in cks:
                c1 = c0 + (t - b0) * len(c) / total
                subs.append({"start": round(c0, 3), "end": round(c1, 3), "text": c})
                c0 = c1
            beats.append({"start": round(b0, 3), "end": round(t, 3), "text": sub, "subs": subs})
            print(f"{sc['id']}[{i}] {t - b0:5.2f}s  {sub[:60]}")
        silence(TAIL if sc is not script["scenes"][-1] else 3.5)
        scenes.append({"id": sc["id"], "chapter": sc["chapter"], "start": round(start, 3),
                       "end": round(t, 3), "beats": beats})

    os.makedirs(os.path.join(HERE, "build"), exist_ok=True)
    os.makedirs(os.path.join(HERE, "out"), exist_ok=True)
    wav = np.concatenate(chunks)
    wav = wav / max(1e-6, np.abs(wav).max()) * 0.89
    sf.write(os.path.join(HERE, "build", "narration.wav"), wav, SR)
    json.dump({"duration": round(t, 3), "scenes": scenes}, open(os.path.join(HERE, "build", "timings.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    with open(os.path.join(HERE, "build", "timings.js"), "w", encoding="utf-8") as f:
        f.write("window.TIMINGS = " + json.dumps({"duration": round(t, 3), "scenes": scenes}, ensure_ascii=False) + ";\n")
    with open(os.path.join(HERE, "out", "pi-spi-explication.srt"), "w", encoding="utf-8") as f:
        n = 1
        for sc in scenes:
            for b in sc["beats"]:
                for c in b["subs"]:
                    f.write(f"{n}\n{srt_time(c['start'])} --> {srt_time(c['end'] + 0.15)}\n{c['text']}\n\n")
                    n += 1
    print(f"Durée totale : {t:.1f}s")


if __name__ == "__main__":
    main()
