# Vidéo : « PI-SPI expliqué simplement »

Vidéo explicative (≈ 4 min 50, 1920×1080, en français, voix off + sous-titres incrustés) sur la
**Plateforme Interopérable du Système de Paiement Instantané (PI-SPI)** de la BCEAO, destinée :

- aux utilisateurs de mobile money en Côte d'Ivoire (Orange Money, MTN MoMo, Moov Money, Wave…) ;
- aux banques ivoiriennes.

## Fichiers livrés (`out/`)

| Fichier | Contenu |
|---|---|
| `out/pi-spi-explication.mp4` | La vidéo finale (H.264 + AAC) |
| `out/pi-spi-explication.srt` | Les sous-titres, à téléverser séparément sur YouTube / Facebook si besoin |

## Déroulé (11 chapitres)

1. **Intro** : les situations du quotidien (Wave → Orange Money, payer un commerçant, banque → mobile money)
2. **Avant** : chaque opérateur était une « île » ; un QR code par opérateur chez le commerçant
3. **C'est quoi ?** : le sigle expliqué, « interopérable », « instantané », le pont, la BCEAO, le lancement du 30/09/2025
4. **Qui ?** : banques, mobile money, microfinance, Trésor public ; plus de 170 établissements autorisés (30/09/2026)
5. **Exemple** : Awa (Wave, Abidjan) envoie 5 000 F à Koffi (Orange Money, Bouaké), en 4 étapes
6. **3 façons de payer** : alias, QR code unique, demande de paiement
7. **24h/24** : 7j/7 et 8 pays de l'UEMOA
8. **Nouvelles règles depuis le 2 novembre 2026** : passage obligatoire par PI-SPI entre opérateurs,
   envois gratuits jusqu'à 8 000 F/jour, frais plafonnés à 0,8 % HT au-delà, réception gratuite,
   plafond du compte identifié porté à 4 millions F, retraits chez les agents non concernés
9. **Banques** : un seul raccordement, banque ⇄ mobile money, nouveaux services, nouveaux clients
10. **Sécurité** : vérifier le nom et le montant, ne jamais donner son code secret, refuser les demandes inconnues
11. **Résumé** + appel au partage

Le texte complet de la voix off est dans `script.json` (une phrase par élément).

## Modifier puis régénérer la vidéo

Prérequis : Python 3, Node.js, `ffmpeg`, Playwright (Chromium), et le paquet Python `kokoro-onnx`
avec les fichiers `kokoro-v1.0.onnx` et `voices-v1.0.bin`
(publiés sur https://github.com/thewh1teagle/kokoro-onnx/releases, tag `model-files-v1.0`).

```bash
pip install kokoro-onnx soundfile
python3 tts.py /chemin/vers/modele_kokoro   # voix off + minutage + .srt
node render.js --stills 10,60,120           # (optionnel) images de contrôle dans build/stills/
node render.js                              # rendu complet -> out/pi-spi-explication.mp4
```

- **Changer le texte** : modifier `script.json`, puis relancer les deux commandes. Les animations se
  calent automatiquement sur les phrases (`b0`, `b1`… = début de la phrase 0, 1…).
- **Changer les visuels** : `scenes.js` (une entrée par scène), styles dans `index.html`.
- **Prononciation** : la table `PRON` de `tts.py` réécrit phonétiquement certains mots
  (BCEAO, Wave, Money, UEMOA…) sans changer les sous-titres.
- **Aperçu dans un navigateur** : ouvrir `index.html?t=95` (image figée à 95 s) ou `index.html?play`.

## Sources et précautions

Informations vérifiées au 25 novembre 2026 à partir de communications de la BCEAO et d'articles de presse
(lancement officiel le 30/09/2025 ; liste des participants autorisés au 30/09/2026 ; nouvelles règles
applicables depuis le 2 novembre 2026). Le texte officiel de la BCEAO sur les frais n'a pas pu être
consulté directement : **faites relire les chiffres (8 000 F, 0,8 %, 4 millions F) par une personne
habilitée avant diffusion**. La vidéo invite d'ailleurs le public à vérifier les frais exacts auprès de
sa banque ou de son opérateur.

Aucun logo de marque n'est utilisé : les opérateurs sont seulement cités par leur nom. Le numéro de
téléphone, les noms (Awa, Koffi, Boutique Adjoua), les soldes et le QR code affichés sont fictifs
(le QR code est décoratif et non scannable).
