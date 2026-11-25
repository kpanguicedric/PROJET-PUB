"""Bande-son originale synthétisée (120 BPM, 40 s) + effets calés sur l'animation.
Usage : python3 music.py sortie.wav"""
import sys
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 44100
DUR = 40.0
N = int(SR * DUR)
rng = np.random.default_rng(42)
BEAT = 0.5
BAR = 2.0


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def buf():
    return np.zeros((2, N), dtype=np.float64)


def place(dst, x, t, gain=1.0, pan=0.0):
    """Ajoute un signal mono (ou stéréo) à l'instant t, avec panoramique."""
    i = int(t * SR)
    if i >= N:
        return
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        x = np.vstack([x * l * 1.414, x * r * 1.414])
    n = min(x.shape[1], N - i)
    dst[:, i:i + n] += x[:, :n] * gain


def env(n, a, d, s=0.0, r=0.0, sus_len=None):
    t = np.arange(n) / SR
    e = np.ones(n)
    if a > 0:
        e = np.minimum(e, t / a)
    e = np.where(t >= a, np.exp(-(t - a) / max(d, 1e-4)) * (1 - s) + s, e)
    if sus_len is not None and r > 0:
        e = np.where(t > sus_len, e * np.exp(-(t - sus_len) / r), e)
    return e


def lp(x, fc, order=2):
    sos = signal.butter(order, min(fc, SR / 2 * 0.95), 'low', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=-1)


def hp(x, fc, order=2):
    sos = signal.butter(order, fc, 'high', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=-1)


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], 'band', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=-1)


def saw(f, n, phase=0.0):
    t = np.arange(n) / SR
    return 2 * ((f * t + phase) % 1.0) - 1


def reverb(x, secs=2.2, mix=1.0, seed=1):
    r = np.random.default_rng(seed)
    n = int(secs * SR)
    t = np.arange(n) / SR
    ir = np.vstack([r.standard_normal(n), r.standard_normal(n)]) * np.exp(-t * 6.0 / secs)
    ir = lp(ir, 6000)
    ir[:, :int(0.012 * SR)] = 0
    ir /= np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
    out = np.vstack([signal.fftconvolve(x[0], ir[0])[:N], signal.fftconvolve(x[1], ir[1])[:N]])
    return out * mix


# ---------------- harmonie ----------------
PROG = {  # vi - IV - I - V en Do majeur
    'Am': ([57, 60, 64, 69], 33),
    'F': ([53, 57, 60, 65], 29),
    'C': ([55, 60, 64, 67], 36),
    'G': ([55, 59, 62, 67], 31),
}
ORDER = ['Am', 'F', 'C', 'G']
NBARS = 20


def chord_of(b):
    return 'C' if b >= 19 else ORDER[b % 4]


pad, pluck, bass, drums, fx, bells = buf(), buf(), buf(), buf(), buf(), buf()

# ---------------- pad (supersaw filtré) ----------------
for b in range(NBARS):
    notes, _ = PROG[chord_of(b)]
    t0 = b * BAR
    length = BAR if b < 19 else 2.0
    n = int((length + 1.2) * SR)
    for m in notes:
        f = mtof(m)
        for ch, det in ((0, [-0.11, 0.0, 0.07]), (1, [-0.06, 0.03, 0.12])):
            x = sum(saw(f * 2 ** (d / 12), n, phase=rng.random()) for d in det) / 3
            e = env(n, 0.25, 9, 1.0, 0.5, sus_len=length)
            cutoff = 900 if b < 2 else 2400
            y = lp(x * e, cutoff, 2) * (0.11 if b < 2 else 0.05)
            pad[ch, int(t0 * SR):int(t0 * SR) + n] += y[:max(0, min(n, N - int(t0 * SR)))]

# ---------------- arpège pluck ----------------
PATTERN = [0, 2, 1, 3, 2, 4, 3, 1, 0, 2, 1, 3, 4, 3, 2, 1]
for b in range(NBARS - 1):
    notes, _ = PROG[chord_of(b)]
    tones = [m + 12 for m in notes] + [notes[0] + 24]
    for s, idx in enumerate(PATTERN):
        t = b * BAR + s * BEAT / 4
        if t >= 38:
            continue
        f = mtof(tones[idx])
        n = int(0.35 * SR)
        x = 0.6 * saw(f, n) + 0.4 * np.sign(np.sin(2 * np.pi * f * np.arange(n) / SR))
        e = env(n, 0.002, 0.12)
        fc = 1200 + (2600 if b >= 2 else 1400 * (t / 4))
        y = lp(x * e, fc, 2)
        g = 0.05 if b < 2 else 0.075
        if s % 4 == 0:
            g *= 1.25
        place(pluck, y, t, g, pan=(-0.35 if s % 2 else 0.35))
# écho ping-pong (croche pointée)
d = int(0.375 * SR)
echo = np.zeros_like(pluck)
echo[0, d:] += pluck[1, :-d] * 0.35
echo[1, 2 * d:] += pluck[0, :-2 * d] * 0.25
pluck += lp(echo, 3500)

# ---------------- basse ----------------
for b in range(2, NBARS - 1):
    _, root = PROG[chord_of(b)]
    for k in range(8):
        t = b * BAR + k * BEAT / 2
        if t >= 38 or (31.5 <= t < 32):
            continue
        n = int(0.24 * SR)
        f = mtof(root + 12)
        tt = np.arange(n) / SR
        sub = np.sin(2 * np.pi * f / 2 * tt)
        mid = lp(saw(f, n), 700)
        e = env(n, 0.004, 0.18)
        place(bass, (0.55 * sub + 0.35 * mid) * e, t, 0.32)

# ---------------- batterie ----------------
def kick():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 45 + 120 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t / 0.22)
    click = hp(rng.standard_normal(n), 3000) * np.exp(-t / 0.004) * 0.3
    return np.tanh(1.6 * (x + click))


def clap():
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    nz = bp(rng.standard_normal(n), 900, 4200)
    e = np.zeros(n)
    for o in (0, 0.011, 0.022):
        e += np.where(t >= o, np.exp(-(t - o) / 0.009), 0) * (t >= o)
    e += np.where(t >= 0.03, np.exp(-(t - 0.03) / 0.12), 0)
    return nz * e * 0.6


def hat(open_=False):
    n = int((0.35 if open_ else 0.08) * SR)
    t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7500, 4) * np.exp(-t / (0.12 if open_ else 0.025))


K, C = kick(), clap()
kick_times = []
for b in range(2, NBARS - 1):
    for q in range(4):
        t = b * BAR + q * BEAT
        if t >= 38 or (31.5 <= t < 32):
            continue
        place(drums, K, t, 0.8)
        kick_times.append(t)
        if q in (1, 3):
            place(drums, C, t, 0.55, pan=0.05)
        # charleston
        place(drums, hat(), t + BEAT / 2, 0.22, pan=0.25)
        if 12 <= t < 31.5 or t >= 32:
            place(drums, hat(), t + BEAT / 4, 0.09, pan=-0.25)
            place(drums, hat(), t + 3 * BEAT / 4, 0.09, pan=-0.25)
        if q == 3:
            place(drums, hat(True), t + BEAT / 2, 0.12, pan=0.3)
# pulsation d'intro (battement sourd)
for k in range(4):
    place(drums, lp(K, 400), k * BEAT, 0.35 + 0.1 * k)
# tics d'intro
for k in range(16):
    place(drums, hat(), 2.0 + k * 0.125, 0.05 + 0.06 * k / 16, pan=0.2)

# ---------------- sidechain ----------------
sc = np.ones(N)
tt = np.arange(N) / SR
for t in kick_times:
    i = int(t * SR)
    n = int(0.35 * SR)
    seg = 1 - 0.65 * np.exp(-np.arange(min(n, N - i)) / SR / 0.09)
    sc[i:i + len(seg)] = np.minimum(sc[i:i + len(seg)], seg)
pad *= sc
bass *= sc
pluck *= 0.5 + 0.5 * sc

# ---------------- cloches (motif) ----------------
def bell(f, dur=1.4):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / (dur * dd)) for r, a, dd in ((1, 1, .5), (2.0, .4, .3), (3.01, .2, .18), (5.4, .08, .08)))
    return x * np.minimum(1, t / 0.003)


MOTIF = {0: 76, 1: 72, 2: 79, 3: 74}
for b in range(6, 19):
    notes, _ = PROG[chord_of(b)]
    m = MOTIF[b % 4]
    place(bells, bell(mtof(m)), b * BAR, 0.07, pan=-0.2)
    place(bells, bell(mtof(m - 5 if b % 2 else m + 3)), b * BAR + 1.5, 0.045, pan=0.25)
bells += reverb(bells, 2.5, 0.6, seed=3)

# ---------------- effets ----------------
def impact(big=True):
    n = int((3.0 if big else 1.8) * SR)
    t = np.arange(n) / SR
    f = 30 + 60 * np.exp(-t / 0.25)
    boom = np.tanh(2 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t / (0.9 if big else 0.5))
    crash = hp(rng.standard_normal(n), 3500) * np.exp(-t / (1.1 if big else 0.6)) * 0.35
    return boom * 0.9 + crash


def riser(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    out = np.zeros(n)
    chunk = 1024
    zi = None
    for i in range(0, n, chunk):
        fc = 300 + 7000 * (i / n) ** 2
        sos = signal.butter(2, [fc * 0.7, min(fc * 1.4, 20000)], 'band', fs=SR, output='sos')
        if zi is None:
            zi = np.zeros((sos.shape[0], 2))
        out[i:i + chunk], zi = signal.sosfilt(sos, x[i:i + chunk], zi=zi)
    f = 200 * 2 ** (3 * t / dur)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.15
    return (out * 1.4 + tone) * (t / dur) ** 2.2


def whoosh(dur=0.9):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    out = np.zeros(n)
    chunk = 512
    zi = None
    for i in range(0, n, chunk):
        p = i / n
        fc = 400 + 4200 * np.sin(np.pi * p) ** 1.5
        sos = signal.butter(2, [fc * 0.6, min(fc * 1.6, 20000)], 'band', fs=SR, output='sos')
        if zi is None:
            zi = np.zeros((sos.shape[0], 2))
        out[i:i + chunk], zi = signal.sosfilt(sos, x[i:i + chunk], zi=zi)
    e = np.sin(np.pi * t / dur) ** 2
    y = out * e
    pan = np.linspace(0.8, -0.8, n)  # le panneau balaie de droite à gauche
    return np.vstack([y * np.cos((pan + 1) * np.pi / 4), y * np.sin((pan + 1) * np.pi / 4)]) * 1.4


def blip(f0=900, f1=1800, dur=0.09):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f0 + (f1 - f0) * (1 - np.exp(-t / 0.02))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (dur / 3))


def click():
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 2600 * t) * 0.5 + hp(rng.standard_normal(n), 4000) * 0.5) * np.exp(-t / 0.006)


def slam():
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    f = 55 + 140 * np.exp(-t / 0.04)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.18)
    snap = bp(rng.standard_normal(n), 1200, 6000) * np.exp(-t / 0.05) * 0.5
    return np.tanh(1.5 * (body + snap))


# accroche
for t in (2.0, 2.5, 3.0):
    place(fx, slam(), t, 0.55)
place(fx, riser(1.9), 2.1, 0.22)
place(fx, whoosh(0.7), 3.35, 0.35)
place(fx, impact(True), 4.0, 0.75)
# balayages de transition (milieu du panneau ~ t0 + 0.45)
for t0 in (7.5, 11.5, 15.5, 19.5, 23.5, 27.5, 31.5):
    place(fx, whoosh(0.9), t0, 0.32)
place(fx, riser(1.4), 30.6, 0.14)
place(fx, impact(False), 32.0, 0.45)
# interface
place(fx, click(), 14.33, 0.35); place(fx, blip(700, 1400), 14.42, 0.18)
place(fx, click(), 15.08, 0.35); place(fx, bell(1568, .8), 15.2, 0.12); place(fx, bell(2093, .8), 15.32, 0.1)
place(fx, blip(500, 1000), 17.35, 0.15)
for t in (17.45, 17.85, 18.25):
    place(fx, blip(1200, 1300, .05), t, 0.05)
place(fx, bell(1760, 1.0), 18.8, 0.13)
for i, t in enumerate((21.4, 21.9, 22.4, 22.95)):
    place(fx, blip(800 + 150 * i, 1600 + 300 * i), t, 0.14)
place(fx, bell(2093, 1.2), 23.1, 0.13); place(fx, bell(2637, 1.0), 23.22, 0.09)
place(fx, blip(600, 1200), 24.85, 0.14); place(fx, blip(700, 1400), 25.0, 0.14)
place(fx, bell(1975, 1.0), 27.25, 0.12)
for i, t in enumerate((28.5, 28.75, 29.0, 29.25)):
    place(fx, blip(500 + 120 * i, 1100 + 200 * i, .12), t, 0.16)
for i, t in enumerate((33.0, 33.28, 33.56)):
    place(fx, blip(600 + 100 * i, 1300 + 150 * i), t, 0.14)
place(fx, impact(True), 38.0, 0.35)
fx += reverb(fx, 1.6, 0.25, seed=5)

# ---------------- mixage ----------------
wet = reverb(pad * 0.6 + pluck * 0.5 + drums * 0.08, 2.4, 0.5, seed=7)
mix = pad * 1.0 + pluck * 0.9 + bass * 1.0 + drums * 0.75 + bells * 1.0 + fx * 1.0 + wet
# fondu final
fade = np.ones(N)
fs = int(38.5 * SR)
fade[fs:] = np.linspace(1, 0, N - fs) ** 1.5
fade[:int(0.03 * SR)] = np.linspace(0, 1, int(0.03 * SR))
mix *= fade
mix = hp(mix, 25)
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(1.4 * mix) / np.tanh(1.4)
mix *= 0.89
wavfile.write(sys.argv[1] if len(sys.argv) > 1 else 'music.wav', SR, (mix.T * 32767).astype(np.int16))
print('ok')
