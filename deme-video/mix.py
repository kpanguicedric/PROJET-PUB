"""Mixage final : voix off (src/voix-off.mp3) découpée phrase par phrase et calée sur les scènes,
musique (music.wav) baissée automatiquement sous la voix. Sortie : bande-son.wav
Usage : python3 mix.py"""
import subprocess
import numpy as np
import pyloudnorm as pyln
from scipy import signal
from scipy.io import wavfile

SR = 44100
DUR = 40.0
N = int(SR * DUR)

# voix -> wav mono 44.1 kHz
raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', 'src/voix-off.mp3', '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'],
                     capture_output=True, check=True).stdout
v = np.frombuffer(raw, dtype=np.int16).astype(np.float64) / 32768
v = signal.sosfilt(signal.butter(2, 80, 'high', fs=SR, output='sos'), v)

# (début parole, fin parole) dans le fichier source  ->  instant de pose dans la vidéo
SEGMENTS = [
    (0.000, 1.283, 0.20),    # Importer depuis la Chine ?
    (1.737, 2.246, 1.75),    # Simple
    (2.783, 3.396, 2.45),    # Rapide
    (3.743, 4.488, 3.18),    # Sécurisé
    (4.941, 7.090, 4.95),    # C'est possible avec Démé Trading Company
    (7.506, 9.843, 8.35),    # Votre pont direct…           (globe)
    (10.235, 12.879, 12.30), # Nous achetons…               (service 01)
    (13.346, 16.122, 16.30), # Nous trouvons et vérifions…  (service 02)
    (16.548, 19.310, 20.30), # Nous vous formons…           (service 03)
    (19.699, 22.325, 24.30), # Et nous expédions…           (service 04)
    (22.748, 26.489, 28.05), # Fournisseurs vérifiés…       (pourquoi DEME)
    (26.913, 28.845, 32.40), # Démé Trading Company         (contact)
    (29.217, 30.471, 34.55), # Contactez-nous…
    (30.789, 32.282, 36.15), # Votre partenaire de confiance
]
PRE, POST = 0.06, 0.14
voice = np.zeros(N)
for s, e, t in SEGMENTS:
    a, b = int((s - PRE) * SR) if s > PRE else 0, min(len(v), int((e + POST) * SR))
    seg = v[a:b].copy()
    fi, fo = int(0.012 * SR), int(0.08 * SR)
    seg[:fi] *= np.linspace(0, 1, fi)
    seg[-fo:] *= np.linspace(1, 0, fo)
    i = max(0, int((t - s + a / SR) * SR))  # le début de parole tombe exactement à t
    voice[i:i + len(seg)] += seg[:N - i]

music_sr, m = wavfile.read('music.wav')
m = m.astype(np.float64).T / 32768
assert music_sr == SR

meter = pyln.Meter(SR)
# voix à -16 LUFS, musique à -19 LUFS avant ducking
voice = pyln.normalize.loudness(voice, meter.integrated_loudness(voice), -16.0)
m = pyln.normalize.loudness(m.T, meter.integrated_loudness(m.T), -19.0).T

# enveloppe de la voix -> ducking de la musique (-9 dB sous la voix)
env = np.abs(voice)
env = signal.sosfilt(signal.butter(1, 8, 'low', fs=SR, output='sos'), env)
active = (env > 0.01).astype(float)
k_att, k_rel = np.exp(-1 / (0.05 * SR)), np.exp(-1 / (0.35 * SR))
g = np.zeros(N)
acc = 0.0
for i in range(0, N, 64):  # lissage attaque/relâchement par blocs
    target = active[i:i + 64].max()
    k = k_att ** 64 if target > acc else k_rel ** 64
    acc = target + (acc - target) * k
    g[i:i + 64] = acc
duck = 10 ** (-9 * g / 20)
mix = m * duck + np.vstack([voice, voice])
mix /= max(1.0, np.max(np.abs(mix)) / 0.95)
wavfile.write('bande-son.wav', SR, (mix.T * 32767).astype(np.int16))
print('ok, LUFS mix =', round(meter.integrated_loudness(mix.T), 1))
