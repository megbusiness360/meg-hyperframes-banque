# Overlays PNG MEG pour Borumi

Le renderer versionné `borumi/scripts/render-overlay.mjs` fabrique des
overlays transparents sans Remotion ni réseau. Il écrit un SVG temporaire,
puis utilise `/usr/bin/sips` sur macOS et vérifie le PNG final (`alpha=yes`).
Les assets et la police viennent du dépôt : aucun logo, CDN ou chemin machine
n’est injecté dans le montage.

## CLI et contrat JSON

Depuis la racine du dépôt :

```bash
node borumi/scripts/render-overlay.mjs \
  --json '{"format":"reel","type":"brand-chrome","label":"PREUVE"}' \
  --output /tmp/meg-brand-chrome.png
```

Une entrée JSON peut aussi venir d’un fichier borné ou de stdin :

```bash
node borumi/scripts/render-overlay.mjs --input overlay.json --output /tmp/overlay.png
cat overlay.json | node borumi/scripts/render-overlay.mjs --stdin --output /tmp/overlay.png
```

Le renderer accepte uniquement :

- `format` : `reel` (`1080×1920`) ou `youtube` (`1920×1080`) ;
- `type` : `brand-chrome`, `steps` ou `proof-chrome` ;
- `output` : chemin `.png` (l’option CLI peut le remplacer) ;
- `label` (ou `cartouche`) : une ligne courte, facultative selon le type.

Pour `steps`, `steps` (ou `items`) doit contenir exactement `5`, `6` ou `7`
objets/chaînes. Chaque objet utilise `text` (ou `label`/`title`) et peut
porter `active: true`. Une seule étape active est autorisée. On peut aussi
utiliser `activeIndex` (index zéro) à la racine.

Exemple :

```json
{
  "format": "youtube",
  "type": "steps",
  "label": "PARCOURS",
  "activeIndex": 2,
  "steps": [
    {"text": "Audit", "active": false},
    "Plan d’action",
    "Mise en œuvre",
    "Contrôle",
    "Bilan"
  ],
  "output": "/tmp/meg-steps.png"
}
```

Les entrées JSON sont traitées comme des données : aucune expression, URL,
commande ou contenu SVG n’est exécuté. Les textes sont échappés, bornés et
les listes hors contrat sont refusées avec une erreur lisible.

## Types et routage

- `brand-chrome` : cartouche en haut à gauche et vrai logo MEG en haut à
  droite dans une pastille crème ; transparent partout ailleurs.
- `steps` : liste verticale alignée à gauche, numéros 1–7, rail violet, logo
  haut-droite et état actif or optionnel ; le reste du canvas reste transparent.
- `proof-chrome` : même chrome que `brand-chrome`, fond violet MEG autour et
  grande fenêtre transparente afin de laisser visible le B-roll sous-jacent.

La palette est limitée à `#FFFCD6`, `#FFF3AE`, `#2F2C00`, `#5C4F1C`,
`#B9AA02` et `#8F8DE0`. La police est Clash Grotesk. Les logos officiels
proviennent de `scripts/gen-layouts/assets/`.

Après le rendu, importer le PNG dans Borumi avec `import_media`, puis l’ajouter
comme `media_overlay` plein cadre sur la plage utile. Un PNG reste déplaçable
et remplaçable dans Borumi, mais ses textes et formes internes ne sont pas
éditables. Utiliser les éléments natifs Borumi lorsqu’une éditabilité stricte
est prioritaire ; garder HyperFrames pour les animations, occlusions et
transitions.

Le test ciblé couvre les trois types, les listes de 5/6/7 éléments, les deux
formats, les dimensions et l’alpha :

```bash
node borumi/scripts/overlay-self-test.mjs
```
