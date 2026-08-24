# Kit Borumi MEG

Ce dossier transporte les layouts favoris MEG, la police Clash Grotesk et les
outils portables nécessaires pour retrouver le même montage sur un autre Mac.

## Ce que Borumi stocke réellement

Les layouts personnalisés globaux sont stockés par Borumi dans
`settings.favorite_layout_presets`, c’est-à-dire dans l’onglet **Favorites**.
**All** est une vue agrégée qui réunit ces favoris avec les layouts du projet
et les layouts livrés par l’application. Laisser l’étoile est donc nécessaire
pour conserver un layout personnalisé dans le stockage global et le revoir
dans **All**. **Built-in** appartient à l’application : le kit ne peut pas y
ajouter de cartes et ne modifie ni ne re-signe le bundle Borumi.

`layouts/favorite-layout-presets.json` est le payload Borumi exact (83
géométries uniques). Les noms, familles et formats lisibles sont dans
`layouts/manifest.json` uniquement ; aucune métadonnée n’est injectée dans le
payload envoyé à Borumi.

## Installer sur un nouveau Mac

Depuis une copie du dépôt :

```bash
node borumi/scripts/install.mjs --check
```

La vérification est en lecture seule. Si `settings.db` est absent, lancer
Borumi une fois, le quitter complètement, puis relancer :

```bash
node borumi/scripts/install.mjs --install
```

L’installation exige que Borumi soit fermé. Elle vérifie l’intégrité SQLite,
crée une sauvegarde horodatée, fusionne les 83 géométries avec les favoris
existants (sans supprimer les favoris de l’utilisateur), installe
`ClashGrotesk-Variable.ttf` dans les polices utilisateur et synchronise le
skill vers `${CODEX_HOME:-~/.codex}/skills/borumi-montage`. Elle est idempotente.

Le kit ne copie aucun compte, licence, identifiant d’appareil ni projet
utilisateur. Le fichier `settings.db` reste local au Mac ; le dossier
`.bmprojbundle` et les médias restent locaux au projet.

## Routage des titres et d’HyperFrames

Pour un titre TikTok, rendre un PNG transparent avec :

```bash
node borumi/scripts/render-title.mjs --line1 "LIGNE 1" --line2 "LIGNE 2" --preset A --output /tmp/titre.png
```

Les presets sont A (`#FFFCD6` / `#2F2C00`), B (`#2F2C00` /
`#FFFCD6`) et E (`#FFF3AE` / `#2F2C00`). Le script accepte une ou deux
lignes, adapte la taille à 980 px maximum et produit une silhouette connectée
qui suit chaque ligne. Une troisième ligne est refusée. Importer le PNG dans
Borumi comme `media_overlay` plein cadre ; le transparent laisse voir le
montage dessous.

Les animations, transitions, occlusions et habillages qui nécessitent
HyperFrames restent rendus localement dans HyperFrames puis importés comme
médias dans Borumi. Les layouts et captions natifs restent éditables dans
Borumi. Aucun MP4 n’est exporté par ce kit : l’export ne se fait qu’après une
validation explicite du projet.

Les quatre logos officiels ne sont pas dupliqués ici : ils restent dans
`scripts/gen-layouts/assets/`.
