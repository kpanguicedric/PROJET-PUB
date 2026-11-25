# DEME TRADING COMPANY — Vidéo motion design

Vidéo promotionnelle 16:9 (1920×1080, 40 s, avec musique originale) :

- `DEME_Trading_Company.mp4` — la vidéo finale
- `apercu.jpg` — miniature / affiche

## Déroulé

| Temps | Scène |
|---|---|
| 0–4 s | Accroche : « Importer depuis la Chine ? » → « Simple. Rapide. Sécurisé. » |
| 4–8 s | Révélation du logo DEME TRADING COMPANY |
| 8–12 s | Globe animé : liaison Chine → Côte d'Ivoire |
| 12–28 s | Les 4 services (Achat/Vente, Sourcing, Formation, Logistique) |
| 28–32 s | Pourquoi choisir DEME ? |
| 32–40 s | Contacts, QR code WhatsApp, « Votre partenaire de confiance » |

## Régénérer la vidéo

```bash
npm install                 # gsap, d3-geo, icônes, qrcode…
node build-assets.mjs       # icônes, QR WhatsApp, points du globe -> assets.js
python3 music.py music.wav  # bande-son (numpy + scipy)
node render.mjs 30 4        # rendu (Playwright + ffmpeg) -> DEME_Trading_Company.mp4
```

Aperçu en direct : ouvrir `index.html` dans un navigateur (ajouter `#t=12` pour démarrer à 12 s).
