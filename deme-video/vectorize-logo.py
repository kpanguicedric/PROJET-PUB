"""Vectorise le logo original (src/logo-original.jpg) en tracés SVG séparés :
bleu (anneau + disque), orange (2 arcs + flèche), texte DEME, texte TRADING COMPANY.
Sortie : logo-paths.json (chemins SVG en coordonnées de l'image d'origine)."""
import json, sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd
import potrace

UP = 4
im = np.asarray(Image.open('src/logo-original.jpg').convert('RGB')).astype(float)
bg = np.array([18., 31., 47.])
r, g, b = im[..., 0], im[..., 1], im[..., 2]
d = np.sqrt(((im - bg) ** 2).sum(-1))

def up(score, sigma=1.2):
    s = nd.gaussian_filter(score, sigma)
    return np.asarray(Image.fromarray(s.astype(np.float32), mode='F').resize((s.shape[1] * UP, s.shape[0] * UP), Image.BICUBIC))

def trace(mask, offset=(0, 0), smooth=1.0):
    bm = potrace.Bitmap(~mask)
    plist = bm.trace(turdsize=200, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=smooth, opticurve=True, opttolerance=0.3 if smooth <= 1 else 1.0)
    parts = []
    f = lambda p: f"{p.x / UP + offset[0]:.2f} {p.y / UP + offset[1]:.2f}"
    for curve in plist:
        parts.append('M' + f(curve.start_point))
        for seg in curve.segments:
            if seg.is_corner:
                parts.append('L' + f(seg.c) + ' L' + f(seg.end_point))
            else:
                parts.append('C' + f(seg.c1) + ' ' + f(seg.c2) + ' ' + f(seg.end_point))
        parts.append('Z')
    return ' '.join(parts)

out = {}
# --- symbole (zone 300..700 x 360..830)
y0, y1, x0, x1 = 300, 700, 360, 830
c = im[y0:y1, x0:x1]; cd = d[y0:y1, x0:x1]
cr, cg, cb = c[..., 0], c[..., 1], c[..., 2]
orange = np.clip((cr - cb - 25) / 40, 0, 1) * np.clip((cd - 25) / 40, 0, 1)
blue = np.clip((cb - cr - 3) / 10, 0, 1) * np.clip((cd - 5) / 8, 0, 1) * (orange < .3)
om = up(orange * 255) > 128
bm = up(blue * 255, 4.5) > 105
bm = nd.binary_opening(nd.binary_closing(bm, iterations=10), iterations=10)
bm &= ~nd.binary_dilation(om, iterations=2)
lab, n = nd.label(om)
sizes = nd.sum(om, lab, range(1, n + 1))
order = np.argsort(sizes)[::-1]
print('orange comps', n, sorted(sizes.astype(int))[::-1][:5])
comps = []
for k in order[:3]:
    m = lab == (k + 1)
    ys, xs = np.where(m)
    comps.append((xs.mean(), ys.mean(), m))
# flèche = composante dont le centre est le plus à gauche ; arcs : haut / bas
comps.sort(key=lambda t: t[0])
arrow = comps[0]
rest = sorted(comps[1:], key=lambda t: t[1])
out['arrow'] = trace(arrow[2], (x0, y0))
out['arcTop'] = trace(rest[0][2], (x0, y0))
out['arcBot'] = trace(rest[1][2], (x0, y0))
lab, n = nd.label(bm)
sizes = nd.sum(bm, lab, range(1, n + 1))
print('blue comps', n, sorted(sizes.astype(int))[::-1][:5])
big = [k + 1 for k in np.argsort(sizes)[::-1] if sizes[k] > 8000]
# disque = composante dont le centre est le plus à droite ; le reste = anneau (+ queue)
cx = {k: np.where(lab == k)[1].mean() for k in big}
disc = max(big, key=lambda k: cx[k])
out['blueDisc'] = trace(lab == disc, (x0, y0), 1.3)
out['blueRing'] = trace(np.isin(lab, [k for k in big if k != disc]), (x0, y0), 1.3)
# --- textes (blanc)
for key, (ty0, ty1) in {'deme': (770, 905), 'tc': (905, 955)}.items():
    t = im[ty0:ty1, 300:900]
    wscore = np.clip((t.min(-1) - 60) / 120, 0, 1) * 255
    tm = up(wscore, .6) > 128
    out[key] = trace(tm, (300, ty0))
json.dump(out, open('logo-paths.json', 'w'))
print({k: len(v) for k, v in out.items()})
